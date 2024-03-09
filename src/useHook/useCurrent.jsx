import {useEffect, useState} from "react";
import {useWeb3} from "../store/contracts";

export default function useCurrent(){
    const [currentAccount,setCurrentAccount] = useState(0);
    const {dispatch,state:{refresh_current}} = useWeb3();

    useEffect(() => {
        /*global chrome*/
        chrome.storage.local.get(['current_address'],(result)=>{
            setCurrentAccount(result.current_address ?? 0)
        });
    }, [refresh_current]);

    const saveCurrent = (value) =>{
        /*global chrome*/
        chrome.storage.local.set({current_address:value});
        setCurrentAccount(value)
        dispatch({type:'SET_CURRENT_ACCOUNT',payload:value});
    }

    return {currentAccount, saveCurrent};
}
