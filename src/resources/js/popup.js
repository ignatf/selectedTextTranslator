chrome.storage.local.get(['translator_language'], function(result) {
    if (result.translator_language) {
        document.getElementById('languages_choice').value = result.translator_language;
    }
});  

window.onload = (event) => {
    var dropdown = document.getElementById('languages_choice');
    dropdown.onchange = function(){
        chrome.storage.local.set({'translator_language': this.value}, function() {
            console.log('Settings saved.');
        });  
    };
};