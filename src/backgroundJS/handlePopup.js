/*global chrome*/
import Wallet from "../wallet/wallet";
import RpcClient from "./rpc";

export const handlePopUp = async (requestData) =>{
    switch (requestData.method){
        case "Create_Account":
           create_new_wallet(requestData);
            break;
        case "get_capacity":
            get_Capacity(requestData);
            break;
        case "get_feeRate":
            get_feeRate(requestData);
            break;
        case "send_transaction":
            send_transaction(requestData);
            break;
        case "transaction_confirm":
            transaction_confirm(requestData);
            break;
    }

}

const sendMsg = (data) =>{
    chrome.runtime.sendMessage(data,  ()=> {})
}

export const create_new_wallet = async(obj) =>{
    const {index,network,hasMnemonic,name} = obj;
    try{
        const wallet = new Wallet(index,network==="mainnet",hasMnemonic);
        let walletObj = await wallet.GenerateWallet();

        chrome.storage.local.get(['walletList'],(result)=>{
            let list = result.walletList ?? [];
            let item = {
                account:walletObj,
                type:"create",
                name,
                account_index:list.length
            }
            let newList = [...list,item];
            chrome.storage.local.set({walletList:newList});
            sendMsg({ type:"create_account_success"})
        });

    }catch (e) {
        if(e?.message.includes("no_password")){
            sendMsg({ type:"to_lock",data:e.message})
        }else{
            sendMsg({ type:"error",data:e.message})
        }

    }
}

const get_Capacity = async(obj) =>{
    const {currentAccountInfo} = obj;
    try{
        const client = new RpcClient();
        let rt = await client.get_capacity(currentAccountInfo.address);
        sendMsg({ type:"get_Capacity_success",data:rt})

    }catch (e){
        sendMsg({ type:"error",data:e.message})
    }
}

const get_feeRate = async() =>{

    try{
        const client = new RpcClient();
        let rt = await client.get_feeRate();
        sendMsg({ type:"get_feeRate_success",data:rt})

    }catch (e){
        sendMsg({ type:"error",data:e.message})
    }
}

const send_transaction = async (obj) =>{
    const {to,amount,fee,isMax} = obj;
    try{
        const client = new RpcClient();
        let rt = await client.send_transaction(to,amount,fee,isMax);
        sendMsg({ type:"send_transaction_success",data:rt})

    }catch (e){
        console.error("===send_transaction failed=",e)
        sendMsg({ type:"error",data:e.message})
    }

}

const transaction_confirm = async(obj) =>{
    const {tx} = obj;
    try{
        const client = new RpcClient();
        let rt = await client.transaction_confirm(tx);
        console.log("===transaction_confirm_success=",rt)
        sendMsg({ type:"transaction_confirm_success",data:rt})

    }catch (e){
        console.error("===transaction_confirm failed=",e)
        sendMsg({ type:"error",data:e.message})
    }
}
