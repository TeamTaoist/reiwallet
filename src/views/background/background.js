import Wallet from "../../wallet/wallet";
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
                console.log("===Create_Account===",message.data)
                create_new_wallet(message.data,sendResponse,message)
                sendResponse({ "message":message});
                break;
        }
    })


}

const create_new_wallet = async(obj) =>{
    const {index,network,hasMnemonic} = obj;


    try{
        const wallet = new Wallet(index,network==="mainnet",hasMnemonic);
        let walletObj = await wallet.GenerateWallet();

        console.log("create_new_wallet====",walletObj)
        // sendResponse({ "message": message });
    }catch (e) {

        if(e?.message.includes("no_password")){
            chrome.runtime.sendMessage({ type:"to_lock"},  ()=> {})
        }else{
            chrome.runtime.sendMessage({ type:"error"},  ()=> {})
        }

    }


}

init();
