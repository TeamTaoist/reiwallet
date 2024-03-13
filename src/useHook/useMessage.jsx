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
        chrome.runtime.sendMessage({  data ,type:"CKB_POPUP"}, function () {
            console.log(`send ${data.method} success`);
        })
    }

    return {sendMsg};
}
