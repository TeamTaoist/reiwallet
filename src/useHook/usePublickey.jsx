import {useEffect, useState} from "react";
import {useWeb3} from "../store/contracts";
import useMessage from "./useMessage";

/*global chrome*/
export default function usePublickey(){
    const [currentAccount,setCurrentAccount] = useState('');
    const {dispatch,state:{refresh_current}} = useWeb3();


    const handleEvent = () => {}
    const toBackground = () =>{
        let obj ={
            method:"get_publicKey",
        }
        sendMsg(obj)
    }

    const {sendMsg} = useMessage(handleEvent,[]);


    useEffect(() => {
        if(!currentAccount)return;
        toBackground()
    }, [currentAccount]);

    useEffect(() => {

        chrome.storage.local.get(['current_address'],(result)=>{
            setCurrentAccount(result.current_address ?? 0)
        });
    }, [refresh_current]);



    return null;
}
