import useNetwork from "./useNetwork";
import useAccountAddress from "./useAccountAddress";
import {useEffect, useState} from "react";
import {formatUnit} from "@ckb-lumos/bi";
import useMessage from "./useMessage";

export default function useBalance(){
    const {networkInfo} = useNetwork();
    const {currentAccountInfo} = useAccountAddress();
    const [loading,setLoading] = useState(false);
    const [balance,setBalance] = useState("--");

    const handleEvent = (message) => {
        const {type }= message;
        if(type ==="get_Capacity_success"){
            setLoading(false)
            const {capacity} = message.data;
            let rt = formatUnit(capacity,"ckb")
            setBalance(rt)
        }
    }

    const {sendMsg} = useMessage(handleEvent,[]);


    useEffect(() => {
        if(!networkInfo || !currentAccountInfo) return;
        setLoading(true)
        toBackground()
        const timer = setInterval(()=>{
            toBackground()
        },1000)

        return () =>{
            clearInterval(timer)
        }

    }, [currentAccountInfo,networkInfo]);

    const toBackground = () =>{
        let obj ={
            method:"get_capacity",
            networkInfo,
            currentAccountInfo
        }
        sendMsg(obj)
    }
    return {balance,balanceLoading:loading,symbol:networkInfo?.nativeCurrency?.symbol}
}
