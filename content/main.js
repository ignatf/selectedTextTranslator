var defaultAction = 'translation';

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

// temporary function to create popup and style it
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
    const word = document.querySelector('#popup-container .word');
    word.innerHTML = data.word;
    const wordMeaning = document.querySelector('#popup-container .word-meaning');
    wordMeaning.innerHTML = data.definition;
    const loadedContent = document.querySelector('#popup-container .loaded-content');
    loadedContent.style.display = 'block';
    const loading = document.querySelector('#popup-container .loading');
    loading.style.display = 'none';
}

function erasePopupData() {
    const word = document.querySelector('#popup-container .word');
    word.innerHTML = '';
    const wordMeaning = document.querySelector('#popup-container .word-meaning');
    wordMeaning.innerHTML = '';
    const loadedContent = document.querySelector('#popup-container .loaded-content');
    loadedContent.style.display = 'none';
    const loading = document.querySelector('#popup-container .loading');
    loading.style.display = 'block';
}

// TODO
// 1. Prevent creation of new window with tabs
// 2. Send translation with service name to background script
function switchTab(tab, e) {
    e = e || window.event;
    switch (tab.classList[0]) {
        case 'translation-tab':
            console.log('trans');
            e.preventDefault();
            break;
        case 'dictionary-tab':
            console.log('dict');
            e.preventDefault();
            break;
        case 'urban-tab':
            console.log('udict');
            e.preventDefault();
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

//TODO
// 1. Union functionality with insertPopupData
function handleError(selection, error) {
    const word = document.querySelector('#popup-container .word');
    word.innerHTML = selection;
    const wordMeaning = document.querySelector('#popup-container .word-meaning');
    wordMeaning.innerHTML = error;
    const loadedContent = document.querySelector('#popup-container .loaded-content');
    loadedContent.style.display = 'block';
    const loading = document.querySelector('#popup-container .loading');
    loading.style.display = 'none';
}

function prepareDataForInsert(rawData, action, word) {
    data = {};
    switch (action) {
        case 'translation':
            data.word = word;
            data.definition = rawData.translations[0].text;
            data.language = rawData.detectedLanguage.language;
            break;
    
        default:
            break;
    }
}

intializeTranslatorPopup();

// Add listener on mouseup to body when page is loaded
document.getElementsByTagName('body')[0].addEventListener('mouseup', function(event) {
    erasePopupData();
    let selection = getSelected().toString().trim();
    let numbers = /^[0-9]+$/;

    if (selection && !selection.match(numbers)) {
        chrome.runtime.sendMessage({ word: selection, service: '' }, function(response) {
            console.log(response);
            if (response.meaningsList) {
                prepareDataForInsert(response.apiResponse, defaultAction, selection);
                insertPopupData(response.meaningsList[0])
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