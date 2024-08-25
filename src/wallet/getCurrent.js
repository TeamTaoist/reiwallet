import Wallet from "./wallet";
import Keystore from "./keystore";
import {networkList} from "../config/network";
import {getPassword} from "./password";
/*global chrome*/

export const getNetwork = async() =>{
    let network ;
    let rt = await chrome.storage.local.get(["networkInfo"]);
    if(rt){
        network = JSON.parse(rt.networkInfo);

    }else{
        network = networkList[0];
    }
    return network;
}

export const currentInfo = async() => {
    const currentObj = await chrome.storage.local.get(['current_address']);
    const current = currentObj.current_address;
    const walletListArr = await chrome.storage.local.get(['walletList'])
    const walletList = walletListArr.walletList;
    const currentAccount = walletList[current];

    const result = await getPassword();

    const {type,account_index,privateKey}= currentAccount;
    const network = await getNetwork();

    let privatekey_show;
    if (type === "create") {
        const wallet = new Wallet(currentAccount,network.value==="mainnet",true);
        privatekey_show = await wallet.ExportPrivateKey(account_index);
    } else {
        privatekey_show = await Keystore.decrypt(result,privateKey);
    }


    return {
        ...currentAccount,
        privatekey_show,
        address:network.value === "mainnet"? currentAccount.account.address_main : currentAccount.account.address_test
    }
}
