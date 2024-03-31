import {useEffect, useState} from "react";
import useMessage from "./useMessage";
import useAccountAddress from "./useAccountAddress";

export default function useDOB(){
    const {currentAccountInfo} = useAccountAddress();
    const [loading,setLoading] = useState(false);
    const [loadingCL,setLoadingCL] = useState(false);
    const [list,setList] = useState('');
    const [clusterList,setClusterList] = useState('');

    const handleEvent = (message) => {
        const {type }= message;
        switch (type) {
            case "get_DOB_success":
            {
                setList(message.data?.objects ?? [])
                setLoading(false)
            }
                break;
            case "get_Cluster_success":
            {
                setClusterList(message.data?.objects ?? [])
                setLoadingCL(false)
            }
                break;
        }
    }

    const {sendMsg} = useMessage(handleEvent,[]);

    useEffect(() => {
        if(!currentAccountInfo)return;
        setLoading(true)
        setLoadingCL(true)
        clustertoBackground()
        toBackground()
    }, [currentAccountInfo]);

    const toBackground = () =>{
        let obj ={
            method:"get_DOB",
            currentAccountInfo
        }
        sendMsg(obj)
    }
    const clustertoBackground = () =>{
        let obj ={
            method:"get_Cluster",
            currentAccountInfo
        }
        sendMsg(obj)
    }
    return {list,loading,clusterList,loadingCL}
}
