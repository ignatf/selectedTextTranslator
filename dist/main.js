!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t){document.getElementsByTagName("body")[0].addEventListener("mouseup",(function(e){let t=(!!window.getSelection()&&window.getSelection()).toString().trim();console.log(t);if(t&&!t.match(/^[0-9]+$/)){popup=document.getElementById("popup-container");var n=document.documentElement,o=(window.pageXOffset||n.scrollLeft)-(n.clientLeft||0),r=(window.pageYOffset||n.scrollTop)-(n.clientTop||0);popup.style.cssText=`display: block; top: ${e.clientY+r}px; left: ${e.clientX+o}px;`}})),function(){var e;(e=document.createElement("div")).id="popup-container",document.body.appendChild(e),styles=document.createElement("link"),styles.setAttribute("href",chrome.runtime.getURL("translator_popup.css")),styles.setAttribute("rel","stylesheet"),styles.setAttribute("type","text/css"),document.head.appendChild(styles),popup=document.getElementById("popup-container");var t=new XMLHttpRequest;t.onreadystatechange=function(){4==this.readyState&&200==this.status&&(popup.innerHTML=this.responseText)},t.open("GET",chrome.runtime.getURL("translator_popup.html"),!0),t.send(),chrome.runtime.sendMessage("wat",(function(e){console.log(e.meaningsList)}))}()}]);