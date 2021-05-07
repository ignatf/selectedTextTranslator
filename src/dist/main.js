/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./content/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./content/main.js":
/*!*************************!*\
  !*** ./content/main.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var defaultAction = 'translation';\r\nvar selection = '';\r\nvar currentTranslation = {};\r\nvar currentDictionaryMeaning = {};\r\nvar currentUrbanDictionaryMeaning = {};\r\n\r\nfunction createPopUp() {\r\n    var popUp = document.createElement('div');\r\n    popUp.id = 'popup-container';\r\n    document.body.appendChild(popUp);\r\n}\r\n\r\n// Return selection object\r\nfunction getSelected() {\r\n    if (window.getSelection()) {\r\n        return window.getSelection();\r\n    }\r\n\r\n    return false;\r\n}\r\n\r\n// temporary function to create popup and style it ?\r\nfunction intializeTranslatorPopup() {\r\n    createPopUp();\r\n\r\n    // Add base styles for translator popup\r\n    styles = document.createElement(\"link\");\r\n    styles.setAttribute(\"href\", chrome.runtime.getURL(\"resources/css/translator_popup.css\"));\r\n    styles.setAttribute(\"rel\", \"stylesheet\");\r\n    styles.setAttribute(\"type\", \"text/css\");\r\n    document.head.appendChild(styles);\r\n    \r\n    popup = document.getElementById('popup-container');\r\n\r\n    // Get popup html through request and chrome api\r\n    var xhttp = new XMLHttpRequest();\r\n    xhttp.onreadystatechange = function() {\r\n        if (this.readyState == 4 && this.status == 200) {\r\n            popup.innerHTML = this.responseText;\r\n            assignTabFunctionality();\r\n        }\r\n    };\r\n    xhttp.open(\"GET\", chrome.runtime.getURL('resources/html/translator_popup.html'), true);\r\n    xhttp.send();\r\n}\r\n\r\nfunction insertPopupData(data) {\r\n    if (data.error) {\r\n        erasePopupData();\r\n        let wordMeaning = document.querySelector('#popup-container .word-meaning');\r\n        wordMeaning.innerHTML = data.error;\r\n    } else {\r\n        let word = document.querySelector('#popup-container .word');\r\n        word.innerHTML = data.word;\r\n        let wordMeaning = document.querySelector('#popup-container .word-meaning');\r\n        wordMeaning.innerHTML = data.definition;\r\n        let loadedContent = document.querySelector('#popup-container .loaded-content');\r\n\r\n        if (data.language) {\r\n            let detectedLanguage = document.querySelector('#detected-language');\r\n            detectedLanguage.innerHTML = `[${data.language}]`;\r\n        }\r\n        if (data.example) {\r\n            let example = document.querySelector('#popup-container .example');\r\n            example.innerHTML = data.example;\r\n        }\r\n        loadedContent.style.display = 'block';\r\n        let loading = document.querySelector('#popup-container .loading');\r\n        loading.style.display = 'none';\r\n    }\r\n}\r\n\r\nfunction erasePopupData() {\r\n    let word = document.querySelector('#popup-container .word');\r\n    word.innerHTML = '';\r\n    let wordMeaning = document.querySelector('#popup-container .word-meaning');\r\n    wordMeaning.innerHTML = '';\r\n    let detectedLanguage = document.querySelector('#detected-language');\r\n    detectedLanguage.innerHTML = '';\r\n    let example = document.querySelector('#popup-container .example');\r\n    example.innerHTML = '';\r\n\r\n    let loadedContent = document.querySelector('#popup-container .loaded-content');\r\n    loadedContent.style.display = 'none';\r\n    let loading = document.querySelector('#popup-container .loading');\r\n    loading.style.display = 'block';\r\n}\r\n\r\nfunction getApiData(service) {\r\n    chrome.runtime.sendMessage({ word: selection, service: service }, function(response) {\r\n        console.log(response);\r\n        if (response.apiResponse) {\r\n            insertPopupData(prepareDataForInsert(response.apiResponse, service, selection))\r\n        } else if (response.error) {\r\n            insertPopupData({ word: selection, error: response.error });\r\n        }\r\n    });\r\n}\r\n\r\n// TODO\r\n// 1. Finish with dictionary case\r\nfunction switchTab(tab, e) {\r\n    e = e || window.event;\r\n    switch (tab.classList[0]) {\r\n        case 'translation-tab':\r\n            console.log('trans');\r\n            if (currentTranslation.currentWord !== selection) {\r\n                getApiData('translation');\r\n            } else {\r\n                insertPopupData(prepareDataForInsert(currentTranslation, 'translation', selection));\r\n                console.log('not using api');\r\n            } \r\n            break;\r\n        case 'dictionary-tab':\r\n            console.log('dict');\r\n            e.preventDefault();\r\n            break;\r\n        case 'urban-tab':\r\n            console.log('udict');\r\n            if (currentUrbanDictionaryMeaning.currentWord !== selection) {\r\n                getApiData('urban');\r\n            } else {\r\n                insertPopupData(prepareDataForInsert(currentUrbanDictionaryMeaning, 'urban', selection));\r\n                console.log('not using api');\r\n            } \r\n            break;\r\n        default:\r\n            break;\r\n    }\r\n}\r\n\r\nfunction assignTabFunctionality() {\r\n    let tabs = document.querySelectorAll('.tablinks');\r\n    console.log(tabs);\r\n    for (let i = 0; i < tabs.length; i++) {\r\n        console.log(tabs[i]);\r\n\r\n        tabs[i].onclick = function() { switchTab(tabs[i]) };\r\n    }\r\n}\r\n\r\n// TODO\r\n// 2. Finish with dictionary\r\nfunction prepareDataForInsert(rawData, action, word) {\r\n    data = {};\r\n    switch (action) {\r\n        case 'translation':\r\n            currentTranslation = rawData;\r\n            currentTranslation.currentWord = word;\r\n            data.word = word;\r\n            data.definition = rawData.translations[0].text;\r\n            data.language = rawData.detectedLanguage.language;\r\n            break;\r\n        case 'urban':\r\n            currentUrbanDictionaryMeaning = rawData;\r\n            currentUrbanDictionaryMeaning.currentWord = word;\r\n            data.word = word;\r\n            data.definition = rawData[0].definition;\r\n            data.example = rawData[0].example;\r\n            break;\r\n        default:\r\n            break;\r\n    }\r\n\r\n    return data;\r\n}\r\n\r\nintializeTranslatorPopup();\r\n\r\n// Add listener on mouseup to body when page is loaded\r\ndocument.getElementsByTagName('body')[0].addEventListener('mouseup', function(event) {\r\n    erasePopupData();\r\n    if (selection !== getSelected().toString().trim()) {\r\n        selection = getSelected().toString().trim();\r\n    } else {\r\n        return;\r\n    }\r\n    let numbers = /^[0-9]+$/;\r\n\r\n    if (selection && !selection.match(numbers)) {\r\n        chrome.runtime.sendMessage({ word: selection, service: '' }, function(response) {\r\n            console.log(response);\r\n            if (response.apiResponse) {\r\n                insertPopupData(prepareDataForInsert(response.apiResponse, defaultAction, selection))\r\n            } else if (response.error) {\r\n                handleError(selection, response.error);\r\n            }\r\n        });\r\n\r\n        popup = document.getElementById('popup-container');\r\n\r\n        // Getting x and y of scrolling\r\n        // Subtracting border of root element if such exists\r\n        var doc = document.documentElement;\r\n        var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);\r\n        var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);\r\n\r\n        popup.style.cssText = `display: block; top: ${event.clientY + top}px; left: ${event.clientX + left}px;`;\r\n    } else {\r\n        popup.style.cssText = 'display: none;';\r\n    }\r\n    \r\n});\n\n//# sourceURL=webpack:///./content/main.js?");

/***/ })

/******/ });