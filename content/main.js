function createPopUp() {
    var popUp = document.createElement('div');
    popUp.className = 'popup-container';
    document.body.appendChild(popUp);
}

function getSelected() {
    if (window.getSelection) {
        return window.getSelection;
    }

    return false;
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

getElementsByTagName('body')[0].mouseup(function (event) {
    let selection = getSelected().trim();
    let numbers = /^[0-9]+$/;

    if (selection && !selection.match(numbers)) {

    }
});

