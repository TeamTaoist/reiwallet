/*global chrome*/
import Wallet from "../wallet/wallet";
import RpcClient from "./rpc";

export const handlePopUp = async (requestData) =>{
    console.log("===handlePopUp=",requestData, Date.now())
    switch (requestData.method){
        case "Create_Account":
           create_new_wallet(requestData);
            break;
        case "get_capacity":
            get_Capacity(requestData);
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
        console.log("===get_Capacity=",rt, Date.now())
        sendMsg({ type:"get_Capacity_success",data:rt})

    }catch (e){
        console.error("===get_Capacity=",e, Date.now())
        sendMsg({ type:"error",data:e.message})
    }

}
