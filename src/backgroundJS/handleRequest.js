import RpcClient from "./rpc";
import { NotificationManager } from './notificationManager';
import browser from 'webextension-polyfill';
import PublicJS from "../utils/publicJS";

import {getPassword} from "../wallet/password";
import {networkList} from "../config/network";

/*global chrome*/
const toMessage = (data) =>{
    const {windowID} = data;
    chrome.tabs.query({active:true,windowId: windowID}, function(tabs){
        chrome.tabs.sendMessage(tabs[0]?.id, { type:"CKB_RESPONSE_BACKGROUND",data}, ()=>{
            if (chrome.runtime.lastError) {
                console.log("chrome.runtime.lastError", chrome.runtime.lastError.message);
                return;
              }
        });
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

export const handleRequest = async (requestData,windowObj) =>{
    const {id,data} = requestData.data;
    // const windowObj =  await chrome.windows.getCurrent();
    const windowID = windowObj?.id;


    const tabs = await chrome.tabs.query({active:true,windowId: windowID}) ?? [];
    const url = tabs[0]?.url??"http://";

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
            case "ckb_sendDOB":
                rt = await sendDOB(data,windowID,url);
                break;
            case "ckb_sendCluster":
                rt = await sendCluster(data,windowID,url);
                break;
            case "ckb_sendSUDT":
                rt = await sendSUDT(data,windowID,url);
                break;
            case "ckb_sendXUDT":
                rt = await sendXUDT(data,windowID,url);
                break;

            case "ckb_getPublicKey":
                rt = await getPublicKey_inner(url);
                break;

            case "ckb_sendRawTransaction":
            case "ckb_sendTransaction":
                data.type= requestData.method === "ckb_sendTransaction" ?"transaction_object":"skeleton_object"
                rt = await sendRawTx(url,data);
                break;
            case "ckb_signRawTransaction":
            case "ckb_signTransaction":
                data.type= requestData.method === "ckb_signTransaction" ?"transaction_object":"skeleton_object"
                rt = await signRawTx(url,data);
                break;
            default:
                console.error("Unknown request: "+data);
                break;
        }
        if(rt){
            let data = {
                result:rt,
                id,
                windowID
            }
            setTimeout(()=>{
                toMessage(data)
            },100)

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
            address = network==="mainnet"? currentAccount?.address_main : currentAccount?.address_test;
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
        const {capacity,OcCapacity} = rt;
        return {
            capacity,
            occupied:OcCapacity
        };

    }catch (e) {
        throw new Error(`getBalance:${e.message}`)
    }
}

const notificationManager = new NotificationManager();
const signData = async(data,windowId,url) =>{
    if(!data.message) {
        throw new Error("Message is required")
    }

    const message = `Nervos Message:${data.message}`

    let hasGrant = await PublicJS.requestGrant(url);
    if(!hasGrant){
        throw new Error(`This account has not been authorized by the user.`)
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
    }

    let hasGrant = await PublicJS.requestGrant(url);
    if(!hasGrant){
        throw new Error(`This account has not been authorized by the user.`)
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
                recordToTxList(data?.signedTx)
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

        const networkArr = networkList.filter(item=>item.value === value);

        let JsonStr = JSON.stringify(networkArr[0])
        chrome.storage.local.set({networkInfo:JsonStr});
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

const sendDOB = async (data,windowId,url) =>{
    const {to,outPoint:{txHash}} = data
    if( !to) {
        throw new Error("Address is required");
    }
    if( !txHash) {
        throw new Error("OutPoint is required");
    }

    let hasGrant = await PublicJS.requestGrant(url);
    if(!hasGrant){
        throw new Error(`This account has not been authorized by the user.`)
    }

    const { messenger, window: notificationWindow } = await notificationManager.createNotificationWindow(
        {
            path: 'sendDOB',
        },
        { preventDuplicate: false },
    );

    return new Promise((resolve, reject) => {
        messenger.register('get_DOB_Transaction', () => {
            return {rt:data,url};
        });

        messenger.register('DOB_transaction_result', (result) => {
            const {data,status} =result;

            recordToTxList(data)
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
                reject("Send DOB transaction Rejected");
            }
        });
    });


}

const sendCluster = async(data,windowId,url) =>{
    const {to,outPoint:{txHash}} = data
    if( !to) {
        throw new Error("Address is required");
    }
    if( !txHash) {
        throw new Error("OutPoint is required");
    }

    let hasGrant = await PublicJS.requestGrant(url);
    if(!hasGrant){
        throw new Error(`This account has not been authorized by the user.`)
    }

    const { messenger, window: notificationWindow } = await notificationManager.createNotificationWindow(
        {
            path: 'sendCluster',
        },
        { preventDuplicate: false },
    );

    return new Promise((resolve, reject) => {
        messenger.register('get_Cluster_Transaction', () => {
            return {rt:data,url};
        });

        messenger.register('Cluster_transaction_result', (result) => {
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
                reject("SendCluster transaction Rejected");
            }
        });
    });
}


const sendSUDT = async(data,windowId,url) =>{
    const {to,amount,token} = data
    if( !to) {
        throw new Error("Address is required");
    }
    if( !amount) {
        throw new Error("Amount is required");
    }
    if( !token) {
        throw new Error("Token is required");
    }

    let hasGrant = await PublicJS.requestGrant(url);
    if(!hasGrant){
        throw new Error(`This account has not been authorized by the user.`)
    }

    const { messenger, window: notificationWindow } = await notificationManager.createNotificationWindow(
        {
            path: 'sendSUDT',
        },
        { preventDuplicate: false },
    );

    return new Promise((resolve, reject) => {
        messenger.register('get_SUDT_Transaction', () => {
            return {rt:data,url};
        });

        messenger.register('SUDT_transaction_result', (result) => {
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
                reject("Send SUDT transaction Rejected");
            }
        });
    });
}


const sendXUDT = async(data,windowId,url) =>{
    const {to,amount,typeScript} = data;
    if( !to) {
        throw new Error("Address is required");
    }
    if( !amount) {
        throw new Error("Amount is required");
    }
    if( !typeScript) {
        throw new Error("TypeScript is required");
    }

    let hasGrant = await PublicJS.requestGrant(url);
    if(!hasGrant){
        throw new Error(`This account has not been authorized by the user.`)
    }



    const { messenger, window: notificationWindow } = await notificationManager.createNotificationWindow(
        {
            path: 'sendXUDT',
        },
        { preventDuplicate: false },
    );

    return new Promise((resolve, reject) => {
        messenger.register('get_XUDT_Transaction', () => {
            return {rt:data,url};
        });

        messenger.register('XUDT_transaction_result', (result) => {
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
                reject("Send xUDT transaction rejected");
            }
        });
    });
}


const getPublicKey_inner = async(url) =>{


    let hasGrant = await PublicJS.requestGrant(url);
    if(!hasGrant){
        throw new Error(`This account has not been authorized by the user.`)
    }

    let pwd = await getPassword();

    if(pwd){
        const client = new RpcClient();
        return await client.getPublicKey();
    }else{
        const { messenger, window: notificationWindow } = await notificationManager.createNotificationWindow(
            {
                path: 'getPublicKey',
            },
            { preventDuplicate: false },
        );

        return new Promise((resolve, reject) => {
            messenger.register('get_PublicKey', () => {
                return {url};
            });

            messenger.register('get_PublicKey_result', async(result) => {
                const {status} =result;

                if(status === "success"){
                    const client = new RpcClient();
                    let publicKey  = await client.getPublicKey();
                    resolve(publicKey);
                }else{
                    reject("Get PublicKey Failed");
                }
                messenger.destroy();

            });
            browser.windows.onRemoved.addListener((windowId) => {
                if (windowId === notificationWindow.id) {
                    messenger.destroy();
                    reject("Get PublicKey Rejected");
                }
            });
        });
    }
}


const sendRawTx = async(url,data) =>{

    let hasGrant = await PublicJS.requestGrant(url);
    if(!hasGrant){
        throw new Error(`This account has not been authorized by the user.`)
    }

    const { messenger, window: notificationWindow } = await notificationManager.createNotificationWindow(
        {
            path: 'sendRawTx',
        },
        { preventDuplicate: false },
    );

    return new Promise((resolve, reject) => {
        messenger.register('sendRawTx_Transaction', () => {
            return {rt:data,url};
        });

        messenger.register('sendRawTx_result', (result) => {
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
                reject("Send raw transaction Rejected");
            }
        });
    });


}
const signRawTx = async(url,data) =>{

    let hasGrant = await PublicJS.requestGrant(url);
    if(!hasGrant){
        throw new Error(`This account has not been authorized by the user.`)
    }

    const { messenger, window: notificationWindow } = await notificationManager.createNotificationWindow(
        {
            path: 'signRawTx',
        },
        { preventDuplicate: false },
    );

    return new Promise((resolve, reject) => {
        messenger.register('signRawTx_Transaction', () => {
            return {rt:data,url};
        });

        messenger.register('signRawTx_result', (result) => {
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
                reject("Sign raw transaction Rejected");
            }
        });
    });


}
