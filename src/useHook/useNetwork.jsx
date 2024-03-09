import {useEffect, useState} from "react";
import {useWeb3} from "../store/contracts";

export default function useNetwork(){
    const [network,setNetwork] = useState('mainnet');
    const {dispatch,state:{refresh_network}} = useWeb3();

    useEffect(() => {
        /*global chrome*/
        chrome.storage.local.get(['network'],(result)=>{
            setNetwork(result.network ?? "mainnet")
        });
    }, [refresh_network]);

    const saveNetwork = (value) =>{
        /*global chrome*/
        chrome.storage.local.set({network:value});
        setNetwork(value)
        dispatch({type:'SET_REFRESH_NETWORK',payload:value});
    }

    return {network, saveNetwork};
}
