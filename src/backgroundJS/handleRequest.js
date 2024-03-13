
import RpcClient from "./rpc";
/*global chrome*/
const toMessage = (data) =>{
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, { type:"CKB_RESPONSE_BACKGROUND",data});
    });
}

export const handleRequest = async (requestData) =>{
    const {id,data} = requestData.data;
    let rt;
    try{
        switch (requestData.method){
            case "ckb_requestAccounts":
                rt = await requestAccount();
                break;

            case "ckb_getBalance":
                rt = await getBalance(data);
                break;
        }
        if(rt){
            let data = {
                result:rt,
                id
            }
            toMessage(data)
        }

    }catch (e) {
        let data = {
            error:e.message,
            id
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
