import { config } from '../config';
const axios = require("axios");

chrome.runtime.onMessage.addListener(receiver);

// TODO
// 1. Implemented translation api
// 2. Prepare function for future changes for language settings
function getTranslation(word, sender, sendResponse) {
    console.log('word for translation: ' . word);
    sendResponse({error: "test error"});
}

function getUrbanDefiniton(word, sender, sendResponse) {
    axios({
        "method": "GET",
        "url": "https://mashape-community-urban-dictionary.p.rapidapi.com/define",
        "headers": {
            "content-type": "application/octet-stream",
            "x-rapidapi-host": "mashape-community-urban-dictionary.p.rapidapi.com",
            "x-rapidapi-key": config.urbanApi,
            "useQueryString": true
        },
        "params": {
            "term": word
        }}).then((response) => {
            sendResponse({ meaningsList: response.data.list });
            console.log(response.data.list);
        }).catch((error) => {
            sendResponse({ error: "There is no such word in urban dictionary."});
            console.log(error)
        }
    );
}

// TODO
// 1. Implement dictionary api
function getDictionaryDefinition(word, sender, sendResponse) {
    sendResponse({error: "test error of dictionary"});
}

function receiver(request, sender, sendResponse) {
    switch (request.service) {
        case 'translate':
            getTranslation(request.word, sender, sendResponse);
            break;
        case 'urban':
            getUrbanDefiniton(request.word, sender, sendResponse);
            break;
        case 'dictionary':
            getDictionaryDefinition(request.word, sender, sendResponse);
            break;
        default:
            getTranslation(request.word, sender, sendResponse);
            break;
    }

    return true;
}