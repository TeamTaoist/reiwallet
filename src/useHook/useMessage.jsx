import {useEffect} from "react";

export default function useMessage(onMsg,dependencies){

    useEffect(() => {
        /*global chrome*/
        chrome.runtime.onMessage.addListener(listenerEvent)
        return () =>{
            chrome.runtime.onMessage.removeListener(listenerEvent)
        }
    }, dependencies||[]);


    const listenerEvent = (message, sender, sendResponse) => {
        onMsg(message)
        sendResponse({message})
    }

    const sendMsg = (data) =>{
        /*global chrome*/
        try {
            chrome.runtime.sendMessage({  data ,type:"CKB_POPUP"}, function () {
                console.log(`send ${data.method} success`);

                if (chrome.runtime.lastError) {
                    console.log("chrome.runtime.lastError", chrome.runtime.lastError.message);
                    return;
                }
            })
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }

    return {sendMsg};
}
