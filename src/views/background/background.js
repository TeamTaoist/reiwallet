import {handleRequest} from "../../backgroundJS/handleRequest";
import {handlePopUp} from "../../backgroundJS/handlePopup";

/*global chrome*/
function init() {

    chrome.runtime.onInstalled.addListener((e) => {
        console.log("onInstalled", e)
        if (e && e.reason && e.reason === "install") {
            const privacyUrl = chrome.runtime.getURL("install.html");
            chrome.tabs.create({
                url: privacyUrl
            });
        }
    })
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        let requestType = message.type;
        switch (requestType) {
            case "CKB_POPUP":
                handlePopUp(message.data)
                sendResponse({ "message":message});
                break;

            case "CKB_REQUEST_BACKGROUND":
                handleRequest(message.data)
                sendResponse({ "message":message});
            break;
            case "CKB_ON_BACKGROUND":
                handleON(message.data,message.method)
                sendResponse({ "message":message});
            break;
        }
    })


}
init();


const handleON = async(data,method) =>{
    const windowObj =  await chrome.windows.getCurrent();
    const windowID = windowObj.id;
    chrome.tabs.query({active:true,windowId: windowID}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, { type:"CKB_ON_INJECT",result:data,method});
    });
}
