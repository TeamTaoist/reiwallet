import {useEffect, useState} from "react";
import {useWeb3} from "../store/contracts";
import {networkList} from "../config/network";

export default function useNetwork(){
    const [network,setNetwork] = useState('');
    const [netList,setNetList] = useState([]);
    const [networkInfo,setNetworkInfo] = useState(null);
    const {dispatch,state:{refresh_network}} = useWeb3();

    useEffect(() => {
        /*global chrome*/
        chrome.storage.local.get(['network'],(result)=>{
            setNetwork(result.network ?? "mainnet")
        });
    }, [refresh_network]);


    useEffect(() => {
        if(!network)return;
        getNetWork()
    }, [network]);

    useEffect(() => {
        getList()
    }, []);

    const getList = async() =>{
        /*global chrome*/
        let netArr = await chrome.storage.local.get(["networkList"]);
        let netArrFormat= netArr?.networkList ?? networkList
        setNetList(netArrFormat)
    }

    const getNetWork = async() =>{
        const networkArr = netList.filter(item=>item.value === network);
        setNetworkInfo(networkArr[0])
        let JsonStr = JSON.stringify(networkArr[0])
        /*global chrome*/
        chrome.storage.local.set({networkInfo:JsonStr});

    }
    const saveNetwork = (value) =>{
        /*global chrome*/
        chrome.storage.local.set({network:value});
        setNetwork(value)
        dispatch({type:'SET_REFRESH_NETWORK',payload:value});
    }

    return {network, networkInfo,saveNetwork,netList};
}
