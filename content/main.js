var defaultAction = 'translation';
var selection = '';
var currentTranslation = {};
var currentDictionaryMeaning = {};
var currentUrbanDictionaryMeaning = {};

function createPopUp() {
    var popUp = document.createElement('div');
    popUp.id = 'popup-container';
    document.body.appendChild(popUp);
}

// Return selection object
function getSelected() {
    if (window.getSelection()) {
        return window.getSelection();
    }

    return false;
}

// temporary function to create popup and style it ?
function intializeTranslatorPopup() {
    createPopUp();

    // Add base styles for translator popup
    styles = document.createElement("link");
    styles.setAttribute("href", chrome.runtime.getURL("resources/css/translator_popup.css"));
    styles.setAttribute("rel", "stylesheet");
    styles.setAttribute("type", "text/css");
    document.head.appendChild(styles);
    
    popup = document.getElementById('popup-container');

    // Get popup html through request and chrome api
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            popup.innerHTML = this.responseText;
            assignTabFunctionality();
        }
    };
    xhttp.open("GET", chrome.runtime.getURL('resources/html/translator_popup.html'), true);
    xhttp.send();
}

function insertPopupData(data) {
    if (data.error) {
        erasePopupData();
        let wordMeaning = document.querySelector('#popup-container .word-meaning');
        wordMeaning.innerHTML = data.error;
    } else {
        let word = document.querySelector('#popup-container .word');
        word.innerHTML = data.word;
        let wordMeaning = document.querySelector('#popup-container .word-meaning');
        wordMeaning.innerHTML = data.definition;
        let loadedContent = document.querySelector('#popup-container .loaded-content');

        if (data.language) {
            let detectedLanguage = document.querySelector('#detected-language');
            detectedLanguage.innerHTML = `[${data.language}]`;
        }
        if (data.example) {
            let example = document.querySelector('#popup-container .example');
            example.innerHTML = data.example;
        }
        loadedContent.style.display = 'block';
        let loading = document.querySelector('#popup-container .loading');
        loading.style.display = 'none';
    }
}

function erasePopupData() {
    let word = document.querySelector('#popup-container .word');
    word.innerHTML = '';
    let wordMeaning = document.querySelector('#popup-container .word-meaning');
    wordMeaning.innerHTML = '';
    let detectedLanguage = document.querySelector('#detected-language');
    detectedLanguage.innerHTML = '';
    let example = document.querySelector('#popup-container .example');
    example.innerHTML = '';

    let loadedContent = document.querySelector('#popup-container .loaded-content');
    loadedContent.style.display = 'none';
    let loading = document.querySelector('#popup-container .loading');
    loading.style.display = 'block';
}

function getApiData(service) {
    chrome.runtime.sendMessage({ word: selection, service: service }, function(response) {
        console.log(response);
        if (response.apiResponse) {
            insertPopupData(prepareDataForInsert(response.apiResponse, service, selection))
        } else if (response.error) {
            insertPopupData({ word: selection, error: response.error });
        }
    });
}

// TODO
// 1. Finish with dictionary case
function switchTab(tab, e) {
    e = e || window.event;
    switch (tab.classList[0]) {
        case 'translation-tab':
            console.log('trans');
            if (currentTranslation.currentWord !== selection) {
                getApiData('translation');
            } else {
                insertPopupData(prepareDataForInsert(currentTranslation, 'translation', selection));
                console.log('not using api');
            } 
            break;
        case 'dictionary-tab':
            console.log('dict');
            e.preventDefault();
            break;
        case 'urban-tab':
            console.log('udict');
            if (currentUrbanDictionaryMeaning.currentWord !== selection) {
                getApiData('urban');
            } else {
                insertPopupData(prepareDataForInsert(currentUrbanDictionaryMeaning, 'urban', selection));
                console.log('not using api');
            } 
            break;
        default:
            break;
    }
}

function assignTabFunctionality() {
    let tabs = document.querySelectorAll('.tablinks');
    console.log(tabs);
    for (let i = 0; i < tabs.length; i++) {
        console.log(tabs[i]);

        tabs[i].onclick = function() { switchTab(tabs[i]) };
    }
}

// TODO
// 2. Finish with dictionary
function prepareDataForInsert(rawData, action, word) {
    data = {};
    switch (action) {
        case 'translation':
            currentTranslation = rawData;
            currentTranslation.currentWord = word;
            data.word = word;
            data.definition = rawData.translations[0].text;
            data.language = rawData.detectedLanguage.language;
            break;
        case 'urban':
            currentUrbanDictionaryMeaning = rawData;
            currentUrbanDictionaryMeaning.currentWord = word;
            data.word = word;
            data.definition = rawData[0].definition;
            data.example = rawData[0].example;
            break;
        default:
            break;
    }

    return data;
}

intializeTranslatorPopup();

// Add listener on mouseup to body when page is loaded
document.getElementsByTagName('body')[0].addEventListener('mouseup', function(event) {
    erasePopupData();
    if (selection !== getSelected().toString().trim()) {
        selection = getSelected().toString().trim();
    } else {
        return;
    }
    let numbers = /^[0-9]+$/;

    if (selection && !selection.match(numbers)) {
        chrome.runtime.sendMessage({ word: selection, service: '' }, function(response) {
            console.log(response);
            if (response.apiResponse) {
                insertPopupData(prepareDataForInsert(response.apiResponse, defaultAction, selection))
            } else if (response.error) {
                handleError(selection, response.error);
            }
        });

        popup = document.getElementById('popup-container');

        // Getting x and y of scrolling
        // Subtracting border of root element if such exists
        var doc = document.documentElement;
        var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
        var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);

        popup.style.cssText = `display: block; top: ${event.clientY + top}px; left: ${event.clientX + left}px;`;
    } else {
        popup.style.cssText = 'display: none;';
    }
    
});