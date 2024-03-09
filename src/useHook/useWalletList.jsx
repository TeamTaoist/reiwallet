import {useEffect, useState} from "react";
import {useWeb3} from "../store/contracts";

export default function useWalletList(){
    const [walletList,setWalletList] = useState([]);
    const {dispatch,state:{refresh_wallet_list}} = useWeb3();

    useEffect(() => {
        /*global chrome*/
        chrome.storage.local.get(['walletList'],(result)=>{
            setWalletList(result.walletList ?? [])
        });
    }, [refresh_wallet_list]);

    const saveWallet = (item,isFresh) =>{
        /*global chrome*/
        chrome.storage.local.get(['walletList'],(result)=>{
          let list = result.walletList ?? [];
          let newList = [...list,item];
            chrome.storage.local.set({walletList:newList});
            !isFresh && dispatch({type:'SET_WALLET_LIST',payload:!refresh_wallet_list});
        });

    }
    return {walletList, saveWallet};
}
