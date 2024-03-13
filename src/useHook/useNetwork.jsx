import {useEffect, useState} from "react";
import {useWeb3} from "../store/contracts";
import {networkList} from "../constants/network";

export default function useNetwork(){
    const [network,setNetwork] = useState('mainnet');
    const [networkInfo,setNetworkInfo] = useState(null);
    const {dispatch,state:{refresh_network}} = useWeb3();

    useEffect(() => {
        /*global chrome*/
        chrome.storage.local.get(['network'],(result)=>{
            setNetwork(result.network ?? "mainnet")
        });
    }, [refresh_network]);


    useEffect(() => {
        const networkArr = networkList.filter(item=>item.value === network);
        setNetworkInfo(networkArr[0])
        let JsonStr = JSON.stringify(networkArr[0])
        /*global chrome*/
        chrome.storage.local.set({networkInfo:JsonStr});
    }, [network]);

    const saveNetwork = (value) =>{
        /*global chrome*/
        chrome.storage.local.set({network:value});
        setNetwork(value)
        dispatch({type:'SET_REFRESH_NETWORK',payload:value});
    }

    return {network, networkInfo,saveNetwork};
}
