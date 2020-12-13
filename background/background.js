const axios = require("axios");

chrome.runtime.onMessage.addListener(receiver);

function receiver(request, sender, sendResponse) {
    axios({
        "method": "GET",
        "url": "https://mashape-community-urban-dictionary.p.rapidapi.com/define",
        "headers": {
            "content-type": "application/octet-stream",
            "x-rapidapi-host": "mashape-community-urban-dictionary.p.rapidapi.com",
            "x-rapidapi-key": "b598f70c79msh08876adf9d15f3dp10ef6ajsn6e2508f25e64",
            "useQueryString": true
        },
        "params": {
            "term": request
        }}).then((response) => {
            sendResponse({ meaningsList: response.data.list });
            console.log(response.data.list);
        }).catch((error) => {
            sendResponse({ error: "There is no such word in urban dictionary."});
            console.log(error)
        }
    );

    return true;
}