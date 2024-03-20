
import RpcClient from "./rpc";
import { NotificationManager } from './notification';
import browser from 'webextension-polyfill';
/*global chrome*/
const toMessage = (data) =>{
    const {windowID} = data;
    chrome.tabs.query({active:true,windowId: windowID}, function(tabs){

        console.log("====data=currentWindow",tabs[0].id,windowID)
        chrome.tabs.sendMessage(tabs[0].id, { type:"CKB_RESPONSE_BACKGROUND",data});
    });

    // chrome.tabs.sendMessage(windowID, { type:"CKB_RESPONSE_BACKGROUND",data});
}

export const handleRequest = async (requestData) =>{
    const {id,data} = requestData.data;
    let windowObj =  await chrome.windows.getCurrent();
    const windowID = windowObj.id;

    let rt;
    try{
        switch (requestData.method){
            case "ckb_requestAccounts":
                rt = await requestAccount();
                break;

            case "ckb_getCapacity":
                rt = await getBalance(data);
                break;
            case "ckb_sign":
                rt = await signData(data);
                console.log("=====ckb_sign===",rt)
                break;
        }
        if(rt){
            let data = {
                result:rt,
                id,
                windowID
            }
            toMessage(data)
        }

    }catch (e) {
        let data = {
            error:e.message,
            id,
            windowID
        }
        toMessage(data)
    }
}

const requestAccount = async() =>{
    try{
        const walletListArr = await chrome.storage.local.get(['walletList']);
        const walletList = walletListArr?.walletList ?? [];
        const currentObj = await chrome.storage.local.get(['current_address'])
        const current = currentObj?.current_address ?? 0;
        const networkObj = await chrome.storage.local.get(['network'])
        const network = networkObj?.network ?? "mainnet";
        const currentAccount = walletList[current]?.account;
        if(currentAccount){
            return  network==="mainnet"? currentAccount.address_main : currentAccount.address_test;
        }else{
            return ""
        }

    }catch (e) {
        throw new Error(`requestAccount:${e}`)
    }
}
const getBalance = async(params) =>{
    let addr = params[0];
    try{
        const client = new RpcClient();
        let rt = await client.get_capacity(addr);
        return rt?.capacity ?? 0;

    }catch (e) {
        throw new Error(`getBalance:${e.message}`)
    }
}

const notificationManager = new NotificationManager();
const signData = async(data) =>{
    console.log("====data",data)
    const {message} = data

    const { messenger, window: notificationWindow } = await notificationManager.createNotificationWindow(
        {
            path: 'home',
            // metadata: { host: "http://localhost:5173/" },
        },
        { preventDuplicate: false },
    );
    return new Promise((resolve, reject) => {

        messenger.register('test', () => {
            return message;
        });
        messenger.register('session_approveEnableWallet', () => {
            console.log("=====session_approveEnableWallet==")
            messenger.destroy();
            resolve({message:"session_approveEnableWallet", wId:notificationWindow.id});
        });


        browser.windows.onRemoved.addListener((windowId) => {
            if (windowId === notificationWindow.id) {
                messenger.destroy();
                reject("ApproveRejected");
            }
        });
    });


}

