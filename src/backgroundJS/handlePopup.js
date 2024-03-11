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
    }

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
            chrome.runtime.sendMessage({ type:"create_account_success"},  ()=> {})
        });

    }catch (e) {

        if(e?.message.includes("no_password")){
            chrome.runtime.sendMessage({ type:"to_lock"},  ()=> {})
        }else{
            chrome.runtime.sendMessage({ type:"error"},  ()=> {})
        }

    }
}

const get_Capacity = async(obj) =>{
    const {networkInfo,currentAccountInfo} = obj;

    console.log("get_Capacity",obj)
    try{
        const client = new RpcClient(networkInfo);
        let rt = await client.get_capacity(currentAccountInfo.address);
        chrome.runtime.sendMessage({ type:"get_Capacity_success",data:rt},  ()=> {})

    }catch (e){
        chrome.runtime.sendMessage({ type:"error"},  ()=> {})
    }


}
