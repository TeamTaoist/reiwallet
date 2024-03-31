import TokenHeader from "../header/tokenHeader";
import styled from "styled-components";
import {useEffect, useState} from "react";

import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {formatUnit} from "@ckb-lumos/bi";
import useMessage from "../../useHook/useMessage";
import SendStep1 from "../send/sendStep1";
import SendStep2 from "../send/sendStep2";
import Loading from "../loading/loading";
import Toast from "../modal/toast";

const Box = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: #F9FAFA;
`

export default function SendAction(){
    const { t } = useTranslation();
    const [fee,setFee] = useState('')
    const navigate = useNavigate();
    const [step,setStep] = useState(0)
    const [amount,setAmount] = useState(0)
    const [address,setAddress] = useState('')
    const [result,setResult] = useState(null);
    const [loading,setLoading] = useState(false)
    const [isMax,setIsMax] = useState(false)
    const [error,setError] = useState(false)
    const [tips,setTips] = useState('')

    const handleEvent = (message) => {
        const {type }= message;
        switch(type){
            case "get_feeRate_success":
                {
                    const {median} = message.data;
                    let rt = formatUnit(median,"shannon")
                    setFee(rt)
                }
                break;
            case "send_transaction_success":
                {
                    const rt = message.data;
                    setResult(rt);
                    setLoading(false)
                }
                break;
            case "transaction_confirm_success":
                {
                    setError(true)
                    setTips('Send Finished')
                    setTimeout(()=>{
                        setError(false)
                        navigate(`/home?tab=0`)
                    },2000)
                }
                break;
            case "send_transaction_error":
            case "transaction_confirm_error":
                {
                    setTips('Send Failed:'+message.data)
                    setError(true)
                    setLoading(false)
                    setTimeout(()=>{
                        setError(false)
                        navigate("/home")
                    },2000)

                }
                break;

        }
    }
    useEffect(() => {
        toBackground()
        const timer = setInterval(()=>{
            toBackground()
        },10 * 1000)

        return () =>{
            clearInterval(timer)
        }
    }, []);

    const {sendMsg} = useMessage(handleEvent,[]);


    const toBackground = () =>{
        let obj ={
            method:"get_feeRate",
        }
        sendMsg(obj)
    }

    useEffect(() => {
        if(!address || !amount) return;
        getDetail()
    }, [step,address,amount]);

    const getDetail = () =>{
        let obj ={
            method:"send_transaction",
            to:address,
            amount,
            isMax,
            fee
        }
        sendMsg(obj)
    }

    const toDetail = (address,amount,isMax) =>{
        setAddress(address)
        setAmount(amount)
        setLoading(true)
        setIsMax(isMax)
        setStep(1)
    }

    const sendConfirm = (tx) =>{
        let obj ={
            method:"transaction_confirm",
            tx
        }
        sendMsg(obj)
    }

    return <Box>
        <TokenHeader title={t('popup.send.send')} />
        <Toast tips={tips}  show={error}/>
        {
            loading &&   <Loading showBg={true} />
        }

        {
            step===0 &&  <SendStep1 toDetail={toDetail} fee={fee} />
        }

        {
            step === 1 && <SendStep2 address={address} amt={amount} result={result} sendConfirm={sendConfirm} isMax={isMax}/>
        }
    </Box>
}
