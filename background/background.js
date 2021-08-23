import { config } from '../config';
const axios = require("axios");
const defaultLanguage = 'ru';

chrome.runtime.onMessage.addListener(receiver);

// TODO
// 1. Prepare function for future changes for language settings
function getTranslation(word, sender, sendResponse) {
    let language = defaultLanguage;
    // axios({
    //     "method": "POST",
    //     "url": "https://microsoft-translator-text.p.rapidapi.com/translate",
    //     "headers": {
    //         "content-type": "application/json",
    //         "x-rapidapi-host": "microsoft-translator-text.p.rapidapi.com",
    //         "x-rapidapi-key": config.rapidApiKey,
    //         "useQueryString": true
    //     },
    //     "params": {
    //         to: defaultLanguage,
    //         "api-version": "3.0",
    //         profanityAction: "NoAction",
    //         textType: "plain"
    //     },
    //     data: [{Text: word}]
    //     }).then((response) => {
    //         sendResponse({apiResponse: response.data});
    //         console.log(response.data);
    //     }).catch((error) => {
    //         sendResponse({ error: "There is no translation for such word"});
    //         console.log(error);
    //     }
    // );
    chrome.storage.local.get(['translator_language'], function(result) {
        language = result.translator_language ? result.translator_language : defaultLanguage;        
        sendResponse({apiResponse: { detectedLanguage: {language: "en"}, translations: [{text: 'chto-nibudj', to: language }] }});
    });
}

function getUrbanDefiniton(word, sender, sendResponse) {
    axios({
        "method": "GET",
        "url": "https://mashape-community-urban-dictionary.p.rapidapi.com/define",
        "headers": {
            "content-type": "application/octet-stream",
            "x-rapidapi-host": "mashape-community-urban-dictionary.p.rapidapi.com",
            "x-rapidapi-key": config.rapidApiKey,
            "useQueryString": true
        },
        "params": {
            "term": word
        }}).then((response) => {
            sendResponse({ apiResponse: response.data.list });
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

// TODO
// 1. Use already loaded data if word is the same
function receiver(request, sender, sendResponse) {
    switch (request.service) {
        case 'translation':
            getTranslation(request.word, sender, sendResponse);
            break;
        case 'urban':
            getUrbanDefiniton(request.word, sender, sendResponse);
            break;
        case 'dictionary':
            getDictionaryDefinition(request.word, sender, sendResponse);
            break;
        default:
            // console.log('default');
            // getTranslation(request.word, sender, sendResponse);
            break;
    }

    return true;
}