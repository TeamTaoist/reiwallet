import {create_new_wallet} from "../../backgroundJS/createAccount";
import {handleRequest} from "../../backgroundJS/handleRequest";

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
            case "Create_Account":
                create_new_wallet(message.data,sendResponse,message)
                sendResponse({ "message":message});
                break;

                case "CKB_REQUEST_BACKGROUND":
                    console.log("===CKB_REQUEST_BACKGROUND====",message.data)
                    handleRequest(message.data)
                    sendResponse({ "message":message});
                break;

        }
    })


}



init();
