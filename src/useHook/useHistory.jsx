import {useEffect, useState} from "react";
import useMessage from "./useMessage";
import useAccountAddress from "./useAccountAddress";

export default function useHistoryList(){
    const {currentAccountInfo} = useAccountAddress();
    const [loading,setLoading] = useState(false);
    const [list,setList] = useState([]);

    const handleEvent = (message) => {
        const {type }= message;
        if(type ==="get_transaction_history_success"){
            setList(message.data?.objects ?? [])
            setLoading(false)
        }
    }

    const {sendMsg} = useMessage(handleEvent,[]);

    useEffect(() => {
        if(!currentAccountInfo)return;

        setLoading(true)
        toBackground()
        const timer = setInterval(()=>{
            toBackground()
        },10 * 1000)

        return () =>{
            clearInterval(timer)
        }

    }, [currentAccountInfo]);

    const toBackground = () =>{
        let obj ={
            method:"get_transaction_history",
            currentAccountInfo
        }
        sendMsg(obj)
    }
    return {list,loading}
}
