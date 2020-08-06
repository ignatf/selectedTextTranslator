function createPopUp() {
    var popUp = document.createElement('div');
    popUp.id = 'popup-container';
    document.body.appendChild(popUp);
}

// Return selection object
function getSelected() {
    if (window.getSelection) {
        return window.getSelection;
    }

    return false;
}

// temporary function to create popup and style it
function intializeTranslatorPopup() {
    createPopUp();
    styles = document.createElement("link");
    styles.setAttribute("href", chrome.runtime.getURL("translator_popup.css"));
    styles.setAttribute("rel", "stylesheet");
    styles.setAttribute("type", "text/css");
    document.head.appendChild(styles);
    popup = document.getElementById('popup-container');

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
    let numbers = /^[0-9]+$/;

    if (selection && !selection.match(numbers)) {
        console.log(selection);
        popup = document.getElementById('popup-container');
        console.log(event.clientY);
        console.log(event.clientX);
        popup.style.cssText = `display: block; top: ${event.clientY}px; left: ${event.clientX}px;`;
    }
    
});

intializeTranslatorPopup();
