
import RpcClient from "./rpc";
import { NotificationManager } from './notification';
import browser from 'webextension-polyfill';
import PublicJS from "../utils/publicJS";
import {getMinFeeRate} from "@spore-sdk/core";
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

            case "ckb_sendCKB":
                rt = await sendCKBTx(data,windowID,url);
                break;
            case "ckb_getNetwork":
                rt = await getNetwork();
                break;
            case "ckb_switchNetwork":
                rt = await switchNetwork(data);
                break;
            case "ckb_getFeeRate":
                rt = await getFeeRate(data);
                break;
            case "isConnected":
                rt = await getConnected(url);
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
        const {currentAccount,network} = await PublicJS.getAccount();
            let address
        if(currentAccount){
            address = network==="mainnet"? currentAccount.address_main : currentAccount.address_test;
        }else{
            address = ""
        }

        let urlObj = new URL(url);
        const fullDomain = `${urlObj.protocol}//${urlObj.host}`;
        let hasGrant = await PublicJS.requestGrant(url);

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
        console.error("requestAccount",e)
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
    let hasGrant = await PublicJS.requestGrant(url);
    if(!hasGrant){
        throw new Error(`This account has not been authorized by the user.`)
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

const sendCKBTx = async(data,windowId,url) =>{
    const {amount,to} = data
    if(!amount || !to) {
        throw new Error("Amount or Address is required");
        return;
    }

    let hasGrant = await PublicJS.requestGrant(url);
    if(!hasGrant){
        throw new Error(`This account has not been authorized by the user.`)
        return;
    }

    const { messenger, window: notificationWindow } = await notificationManager.createNotificationWindow(
        {
            path: 'send',
        },
        { preventDuplicate: false },
    );

    return new Promise((resolve, reject) => {
        messenger.register('get_CKB_Transaction', () => {
            return {rt:{amount,to},url};
        });

        messenger.register('CKB_transaction_result', (result) => {
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
                reject("Send CKB transaction Rejected");
            }
        });
    });

}

const getNetwork = async() =>{
    try{
        const {network} = await PublicJS.getAccount();
        return network;

    }catch (e) {
        throw new Error(`getNetwork:${e.message}`)
    }
}

const switchNetwork = async(value) =>{
    try{
        await chrome.storage.local.set({network:value});
        return {
            type:"Success",
            network:value
        };

    }catch (e) {
        throw new Error(`switchNetwork:${e.message}`)
    }
}
const getFeeRate = async() =>{
    try{
        const client = new RpcClient();
        return await client.get_feeRate();

    }catch (e) {
        throw new Error(`getFeeRate:${e.message}`)
    }
}

const getConnected = async(url) =>{
    try{

        let rt =  await PublicJS.requestGrant(url)
        return {
            type:"Success",
            isConnected:rt
        };

    }catch (e) {
        throw new Error(`getConnected:${e.message}`)
    }
}
