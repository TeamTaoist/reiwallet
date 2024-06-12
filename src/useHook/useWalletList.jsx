import {useEffect, useState} from "react";
import {useWeb3} from "../store/contracts";
import useNetwork from "./useNetwork";

export default function useWalletList(){
    const [walletList,setWalletList] = useState([]);
    const [wallets,setWallets] =useState([])
    const {dispatch,state:{refresh_wallet_list}} = useWeb3();
    const {network} = useNetwork();

    useEffect(() => {
        /*global chrome*/
        chrome.storage.local.get(['walletList'],(result)=>{
            setWallets(result.walletList ?? [])
        });
    }, [refresh_wallet_list]);

    useEffect(() => {
        if(!wallets.length)return;
        let arr = [...wallets];
        arr.map((item)=>{
            item.address = network === "mainnet"? item.account.address_main : item.account.address_test
        })
        setWalletList(arr)
    }, [network,wallets]);

    const saveWallet = (item,index) =>{

        /*global chrome*/
        chrome.storage.local.get(['walletList'],(result)=>{
          let list = result.walletList ?? [];
          let newList;
          if(index !== "new"){
              let arr = [...list];
              // arr[item.account_index] = item;
              arr[index] = item;
              newList = arr;
          }else{
               newList = [...list,JSON.parse(JSON.stringify(item))];
          }
            chrome.storage.local.set({walletList:newList});
            dispatch({type:'SET_WALLET_LIST',payload:!refresh_wallet_list});
        });

    }
    return {walletList, saveWallet};
}
