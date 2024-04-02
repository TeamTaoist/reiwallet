
import RpcClient from "./rpc";
import { NotificationManager } from './notification';
import browser from 'webextension-polyfill';
import {formatUnit} from "@ckb-lumos/bi";
import PublicJS from "../utils/publicJS";
/*global chrome*/
const toMessage = (data) =>{
    const {windowID} = data;
    chrome.tabs.query({active:true,windowId: windowID}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, { type:"CKB_RESPONSE_BACKGROUND",data});
    });
}

const recordToTxList = async(txhash)=>{

    if(!txhash)return;
    let list = await chrome.storage.local.get(["txList"]);
    let arr = list.txList ? list.txList : [];
    chrome.storage.local.set({txList:[ {
            txhash,
            created:new Date().valueOf()
        },...arr]});
}

export const handleRequest = async (requestData) =>{
    const {id,data} = requestData.data;
    const windowObj =  await chrome.windows.getCurrent();
    const windowID = windowObj.id;
    const tabs = await chrome.tabs.query({active:true,windowId: windowID});
    const url = tabs[0].url;

    let rt;
    try{
        switch (requestData.method){
            case "ckb_requestAccounts":
                rt = await requestAccount(url);
                break;
            case "ckb_getCapacity":
                rt = await getBalance(data);
                break;
            case "ckb_signMessage":
                rt = await signData(data,windowID,url);
                break;

            case "ckb_sendTransaction":
                rt = await sendTx(data,windowID,url);
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
            error:e?.message || e,
            id,
            windowID
        }
        toMessage(data)
    }
}



const handleGrant = async(url) =>{

    const { messenger, window: notificationWindow } = await notificationManager.createNotificationWindow(
        {
            path: 'grant',
        },
        { preventDuplicate: false },
    );

    return new Promise((resolve, reject) => {


        messenger.register('get_grant', () => {
            return {url};
        });
        messenger.register('grant_result', (result) => {
            const {data,status} =result;
            if(status === "success"){
                resolve(data);
            }else{
                reject(data);
            }
            messenger.destroy();

        });
        browser.windows.onRemoved.addListener((windowId) => {
            if (windowId === notificationWindow.id) {
                messenger.destroy();
                reject("Grant Rejected");
            }
        });
    });


}

const requestAccount = async(url) =>{

    try{
        const walletListArr = await chrome.storage.local.get(['walletList']);
        const walletList = walletListArr?.walletList ?? [];
        const currentObj = await chrome.storage.local.get(['current_address'])
        const current = currentObj?.current_address ?? 0;
        const networkObj = await chrome.storage.local.get(['network'])
        const network = networkObj?.network ?? "mainnet";
        const currentAccount = walletList[current]?.account;
        let address
        if(currentAccount){
            address = network==="mainnet"? currentAccount.address_main : currentAccount.address_test;
        }else{
            address = ""
        }


        let urlObj = new URL(url);
        const fullDomain = `${urlObj.protocol}//${urlObj.host}`;

        let hasGrant = await PublicJS.requestGrant(address,fullDomain);

        let rt;
        if(!hasGrant){
         const result = await handleGrant(fullDomain);
         const {result_type,grant_address} = result;
         rt = result_type;
         address = grant_address;
        }else{
            rt ="grant_success";
        }
        if(rt === "grant_success"){
            return address;
        }else{
            throw new Error(`requestAccount:Grant Reject`)
        }

    }catch (e) {
        console.error("===requestAccount==",e)
        throw new Error(`requestAccount:${e}`)
    }
}


const getBalance = async(params) =>{
    let addr = params[0];
    if(!addr){
        throw new Error(`getBalance: Address cannot be empty`)
    }
    try{
        const client = new RpcClient();
        let rt = await client.get_capacity(addr);
        return rt?.capacity ?? 0;

    }catch (e) {
        throw new Error(`getBalance:${e.message}`)
    }
}

const notificationManager = new NotificationManager();
const signData = async(data,windowId,url) =>{
    const {message} = data
    if(!message) {
        throw new Error("Message is required")
        return;
    }
    const { messenger, window: notificationWindow } = await notificationManager.createNotificationWindow(
        {
            path: 'home',
        },
        { preventDuplicate: false },
    );
    return new Promise((resolve, reject) => {


        messenger.register('get_signMessage', () => {
            return {message,url};
        });
        messenger.register('signMessage_result', (result) => {
            const {data,status} =result;
            if(status === "success"){
                resolve(data);
            }else{
                reject(data);
            }
            messenger.destroy();

        });
        browser.windows.onRemoved.addListener((windowId) => {
            if (windowId === notificationWindow.id) {
                messenger.destroy();
                reject("Sign Message Rejected");
            }
        });
    });

}

const sendTx = async(data,windowId,url) =>{
    const {amount,to} = data
    if(!amount || !to) {
        throw new Error("Amount or Address is required")
    }
    const { messenger, window: notificationWindow } = await notificationManager.createNotificationWindow(
        {
            path: 'send',
        },
        { preventDuplicate: false },
    );

    return new Promise((resolve, reject) => {
        messenger.register('get_Transaction', () => {
            return {rt:{amount,to},url};
        });

        messenger.register('transaction_result', (result) => {
            const {data,status} =result;
            if(status === "success"){
                resolve(data);
            }else{
                reject(data);
            }
            messenger.destroy();

        });
        browser.windows.onRemoved.addListener((windowId) => {
            if (windowId === notificationWindow.id) {
                messenger.destroy();
                reject("Sign transaction Rejected");
            }
        });
    });

}

