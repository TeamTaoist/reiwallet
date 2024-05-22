import {useSessionMessenger} from "../../useHook/useSessionMessenger";
import styled from "styled-components";
import Button from "../../components/button/button";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import BtnLoading from "../../components/loading/btnloading";
import Avatar from "../../components/svg/avatar/avatar";
import PublicJS from "../../utils/publicJS";
import FromImg from "../../assets/images/fromTo.png";
import {formatUnit} from "@ckb-lumos/bi";
import useBalance from "../../useHook/useBalance";
import useAccountAddress from "../../useHook/useAccountAddress";
import useMessage from "../../useHook/useMessage";
import Loading from "../../components/loading/loading";
import Toast from "../../components/modal/toast";
import {BI} from "@ckb-lumos/lumos";


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
`
const FirstLine = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 15px;
    gap: 10px;
`
const AvatarBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap:10px;
`
const SendBox = styled.div`
    background: #f8f8f8;
    border-radius:8px;
    padding:17px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    width: 100%;
    box-sizing: border-box;
    margin: 5px 0 10px;
    font-size: 14px;
    .tit{
        font-size: 12px;
    }
    .number{
        font-size: 18px;
        font-weight: bold;
    }
`
const SymbolBox = styled.div`
    font-size: 18px;
    font-weight: 500;
`

const FeeBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
`
const TitleBox = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #34332E;
  line-height: 20px;
    width: 100%;
   margin-top: 10px;
    
`
const AddressBox = styled.div`
    background: #f8f8f8;
    border-radius:6px;
    padding:  17px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    box-sizing: border-box;
    margin: 5px 0 ;
    font-size:14px;
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

export default function SendRaw_detail(){
    const messenger = useSessionMessenger();
    const {currentAccountInfo} = useAccountAddress();
    const { t } = useTranslation();
    const [loading,setLoading] = useState(false);

    const [result,setResult] = useState(null)

    const [params,setParams] = useState(null)
    const [url,setUrl] = useState('')
    const [error,setError] = useState(false)
    const [tips,setTips] = useState('')




    //
    // useEffect(() => {
    //
    //     let inputsSum = BI.from(0)
    //     result?.inputs?.map((item)=>{
    //         //
    //         let capacity = BI.from(item.capacity);
    //         inputsSum = inputsSum.add(capacity)
    //
    //     })
    //     let outputsSum = BI.from(0)
    //     result?.outputs?.map((item)=>{
    //         //
    //         let capacity = BI.from(item.capacity);
    //         outputsSum = outputsSum.add(capacity)
    //
    //     })
    //
    //
    //     let gas = inputsSum.sub(outputsSum);
    //     let gasFormat = formatUnit(gas,'ckb');
    //     setFee(gasFormat)
    // }, [result]);


    const handleEvent = (message) => {
        const {type }= message;

        if(type === "sign_send_confirm_success") {
                const rt = message.data;
                handleSuccess(rt)
                // navigate("/")
                setError(true)
                setTips('Send raw transaction Success')
                setLoading(false)
                setTimeout(()=>{
                    setError(false)
                    window.close();
                },2000)
            }


    }

    const {sendMsg} = useMessage(handleEvent,[]);

    useEffect(() => {
        if(!messenger)return;
        getDetail()

    }, [messenger]);
    //
    // useEffect(()=>{
    //     if(!params || !feeRate)return;
    //     getTXDetail()
    //
    // },[params,feeRate])
    //
    // const getTXDetail = () =>{
    //     setLoading(true)
    //     const {amount,to} = params
    //     let obj ={
    //         method:"send_transaction",
    //         to,
    //         amount,
    //         isMax:false,
    //         fee:feeRate
    //     }
    //     sendMsg(obj)
    // }


    const getDetail = async() =>{

        if(messenger){
            let data = await messenger.send("sendRawTx_Transaction");


            console.log(data.rt)

            setParams(data.rt?.txSkeleton)
            setUrl(data.url)
        }
    }

    const handleSuccess = async(rt) =>{
        try{
            await messenger.send('sendRawTx_result', {status:"success",data:rt});

        }catch (e) {
            console.error('transaction_result',e)
            await messenger.send('sendRawTx_result', {status:"failed",data:e.message});
        }finally {
            setLoading(false)
        }
    }


    //
    const handleClose = async() =>{
        await messenger.send('sendRawTx_result', {status:"rejected",data:"user rejected"});
        window.close();
    }

    const submit = async() =>{
        setLoading(true)

        let obj ={
            method:"sign_send_confirm",
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