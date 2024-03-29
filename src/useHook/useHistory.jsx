import {useEffect, useState} from "react";
import useMessage from "./useMessage";
import useAccountAddress from "./useAccountAddress";
import useNetwork from "./useNetwork";

export default function useHistoryList(){
    const {currentAccountInfo} = useAccountAddress();
    const [loading,setLoading] = useState(false);
    const [list,setList] = useState([]);
    const {networkInfo} = useNetwork();

    const handleEvent = (message) => {
        const {type }= message;
        if(type ==="get_transaction_history_success"){
            setList(message.data?.objects ?? [])
            setLoading(false)
        }
    }

    const {sendMsg} = useMessage(handleEvent,[]);

    useEffect(() => {
        if(!currentAccountInfo || !networkInfo)return;

        setLoading(true)
        toBackground()
        const timer = setInterval(()=>{
            toBackground()
        },10 * 1000)

        return () =>{
            clearInterval(timer)
        }

    }, [currentAccountInfo,networkInfo]);

    const toBackground = () =>{
        let obj ={
            method:"get_transaction_history",
            currentAccountInfo
        }
        sendMsg(obj)
    }
    return {list,loading}
}
