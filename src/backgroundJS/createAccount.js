import Wallet from "../wallet/wallet";

/*global chrome*/
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

        console.log("create_new_wallet====",walletObj)
    }catch (e) {

        if(e?.message.includes("no_password")){
            chrome.runtime.sendMessage({ type:"to_lock"},  ()=> {})
        }else{
            chrome.runtime.sendMessage({ type:"error"},  ()=> {})
        }

    }


}
