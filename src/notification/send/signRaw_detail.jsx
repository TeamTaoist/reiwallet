import {useSessionMessenger} from "../../useHook/useSessionMessenger";
import styled from "styled-components";
import Button from "../../components/button/button";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import BtnLoading from "../../components/loading/btnloading";

import useMessage from "../../useHook/useMessage";
import Loading from "../../components/loading/loading";
import Toast from "../../components/modal/toast";



const Box = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    box-sizing: border-box;
    height: 100vh;
    overflow-y: auto;
`
const TopBox = styled.div`
    width: 100%;
`

const UrlBox = styled.div`
    background: #f8f8f8;
    padding: 10px;
    margin-bottom: 30px;
    word-break: break-all;
`

const BtnGroup = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 0;
    button{
        width: 47%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }
`

const JsonBox = styled.div`
    white-space: pre-wrap;
    height: 60vh;
    overflow-y: auto;
    background: #f5f5f5;
    padding: 20px;
    box-sizing: border-box;
`

export default function SignRaw_detail(){
    const messenger = useSessionMessenger();
    const { t } = useTranslation();
    const [loading,setLoading] = useState(true);


    const [params,setParams] = useState(null)
    const [url,setUrl] = useState('')
    const [error,setError] = useState(false)
    const [tips,setTips] = useState('')




    const handleEvent = (message) => {
        const {type }= message;

        if(type === "sign_confirm_success") {
                const rt = message.data;
                handleSuccess(rt)
                // navigate("/")
                setError(true)
                setTips('Sign raw transaction Success')
                setLoading(false)
                setTimeout(()=>{
                    setError(false)
                    window.close();
                },2000)
            }else if(type === "sign_confirm_error") {
                setError(true)
                setTips(message.data)
                setLoading(false)
                setTimeout(()=>{
                    setError(false)
                    handleError(message.data)
                },2000)
            }


    }

    const handleError = async(error) => {
        await messenger.send('signRawTx_result', {status:"rejected",data:error});
        window.close();
    }

    const {sendMsg} = useMessage(handleEvent,[]);

    useEffect(() => {
        if(!messenger)return;
        getDetail()

    }, [messenger]);




    const getDetail = async() =>{

        if(messenger){
            let data = await messenger.send("signRawTx_Transaction");


            console.log(data.rt)
            setLoading(false)
            setParams(data.rt?.txSkeleton)
            setUrl(data.url)
        }
    }

    const handleSuccess = async(rt) =>{
        try{
            await messenger.send('signRawTx_result', {status:"success",data:rt});

        }catch (e) {
            console.error('transaction_result',e)
            await messenger.send('signRawTx_result', {status:"failed",data:e.message});

        }finally {
            setLoading(false)
        }
    }


    //
    const handleClose = async() =>{
        await messenger.send('signRawTx_result', {status:"rejected",data:"user rejected"});
        window.close();
    }

    const submit = async() =>{
        setLoading(true)

        let obj ={
            method:"sign_confirm",
            txSkeletonObj:params
        }
        sendMsg(obj)

    }

    return <Box>
        {
            loading &&   <Loading showBg={true} />
        }
        <Toast tips={tips} left="80" top="400" show={error}/>
        <TopBox>
            <UrlBox>{url}</UrlBox>

            <JsonBox>
                {JSON.stringify(params, null, 4)}
            </JsonBox>

        </TopBox>
        <BtnGroup>
            <Button border onClick={()=>handleClose()}>{t('popup.step1.cancel')}</Button>
            <Button primary disabled={loading} onClick={()=>submit()}>{t('popup.step1.Confirm')} {
                loading && <BtnLoading />
            }
            </Button>
        </BtnGroup>
    </Box>
}
