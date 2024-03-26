import {useEffect, useState} from "react";
import useMessage from "./useMessage";

export default function usePendingDetail(txHash){

    const [loading,setLoading] = useState(false);
    const [item,setItem] = useState(null);

    const handleEvent = (message) => {
        const {type }= message;
        if(type ==="get_transaction_success"){
            if(txHash === message.data.transaction.hash){
                setItem(message.data)
                setLoading(false)
            }
        }
    }

    const {sendMsg} = useMessage(handleEvent,[txHash]);

    useEffect(() => {
        if(!txHash) return;
        setLoading(true)
        toBackground()
        const timer = setInterval(()=>{
            toBackground()
        },2 * 1000)

        return () =>{
            clearInterval(timer)
        }

    }, [txHash]);

    const toBackground = () =>{
        let obj ={
            method:"get_transaction",
            txHash
        }
        sendMsg(obj)
    }
    return {item,loading}
}
