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
    styles.setAttribute("href", chrome.runtime.getURL("translator_popup.css"));
    styles.setAttribute("rel", "stylesheet");
    styles.setAttribute("type", "text/css");
    document.head.appendChild(styles);
    
    popup = document.getElementById('popup-container');

    // Get popup html through request and chrome api
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            popup.innerHTML = this.responseText;
        }
    };
    xhttp.open("GET", chrome.runtime.getURL('translator_popup.html'), true);
    xhttp.send();
}

function popUpTemplate(data) {
    return `
        <p id='word'><b>${data.word}</b></p>
        <div>
            <ul id='word-meaning'>
                <li id='first-word-meaning'>${data.meaning[0]}</li>
            </ul>
        </div>
    `;
}

// Add listener on mouseup to body when page is loaded
document.getElementsByTagName('body')[0].addEventListener('mouseup', function (event) {
    let selection = getSelected().toString().trim();
    console.log(selection);
    let numbers = /^[0-9]+$/;

    if (selection && !selection.match(numbers)) {
        popup = document.getElementById('popup-container');
        // Getting x and y of scrolling
        // Subtracting border of root element if such exists
        var doc = document.documentElement;
        var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
        var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);

        popup.style.cssText = `display: block; top: ${event.clientY + top}px; left: ${event.clientX + left}px;`;
    }
    
});

intializeTranslatorPopup();
