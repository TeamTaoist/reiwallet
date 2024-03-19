/*global chrome*/

function injectScript() {
    const script = document.createElement('script');
    script.async = false;
    script.src = chrome.runtime.getURL('/content_script/inject.js');
    script.type = "text/javascript";
    script.onload = () => script.remove();
    (document.head || document.documentElement).appendChild(script);
}

if (shouldInjectProvider()) {
    injectScript();
}
function shouldInjectProvider() {
    return doctypeCheck() && suffixCheck() && documentElementCheck();
}
function doctypeCheck() {
    const { doctype } = window.document;
    if (doctype) {
        return doctype.name === 'html';
    }
    return true;
}

function suffixCheck() {
    const prohibitedTypes = [/\.xml$/u, /\.pdf$/u];
    const currentUrl = window.location.pathname;
    for (let i = 0; i < prohibitedTypes.length; i++) {
        if (prohibitedTypes[i].test(currentUrl)) {
            return false;
        }
    }
    return true;
}

function documentElementCheck() {
    const documentElement = document.documentElement.nodeName;
    if (documentElement) {
        return documentElement.toLowerCase() === 'html';
    }
    return true;
}


// var event = new CustomEvent('CKB_RESPONSE', { detail: { action: action, result: "------",id} });
// document.dispatchEvent(event);

document.addEventListener('CKB_REQUEST', function(event) {
        chrome.runtime.sendMessage({ type:'CKB_REQUEST_BACKGROUND',data:event.detail},  ()=> {})

});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    let requestType = message.type;
    console.log("====requestType==",requestType,message.data)

    switch (requestType) {
        case "CKB_RESPONSE_BACKGROUND":
                var event = new CustomEvent('CKB_RESPONSE', { detail: { data:message.data} });
                document.dispatchEvent(event);
                sendResponse({ "message":message});
            break;


    }
})
