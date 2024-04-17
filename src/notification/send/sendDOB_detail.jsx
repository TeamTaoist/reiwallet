import {useSessionMessenger} from "../../useHook/useSessionMessenger";
import {useEffect, useState} from "react";
import styled from "styled-components";
import Avatar from "../../components/svg/avatar/avatar";
import PublicJS from "../../utils/publicJS";
import FromImg from "../../assets/images/fromTo.png";
import useAccountAddress from "../../useHook/useAccountAddress";
import {getSporeByOutPoint, predefinedSporeConfigs, unpackToRawSporeData} from "@spore-sdk/core";
import useNetwork from "../../useHook/useNetwork";
import PublicJs from "../../utils/publicJS";
import {CopyToClipboard} from "react-copy-to-clipboard";
import CopyImg from "../../assets/images/create/COPY.png";
import {formatUnit} from "@ckb-lumos/bi";
import Button from "../../components/button/button";
import BtnLoading from "../../components/loading/btnloading";
import useBalance from "../../useHook/useBalance";
import {useNavigate} from "react-router-dom";
import Loading from "../../components/loading/loading";
import Toast from "../../components/modal/toast";
import useMessage from "../../useHook/useMessage";

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
    margin-top: 10px;
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

const BtnGroup = styled.div`
    display: flex;
    position: absolute;
    left: 0;
    bottom: 20px;
    justify-content: space-between;
    width: 100%;
    box-sizing: border-box;
    padding: 0 20px;
    button{
      width: 47%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }
`

const DlBox = styled.div`
    margin: 0 auto;
    padding: 30px 20px;
    background: #f8f8f8;
    border-radius: 5px;
    dl{
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        
    }
    dt{
        opacity: 0.6;
    }
    dd{
        display: flex;
        align-items: center;
        justify-content: flex-end;
        img{
            cursor: pointer;
        }
    }
`

const ImageBox = styled.div`
    margin: 0 auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .imgbr{
        width: 50px;
        height: 50px;
        border: 1px solid #eee;
        border-radius: 4px;
    }
    .photo{

        display: flex !important;
        overflow: hidden;
        .aspect {
            padding-bottom: 100%;
            height: 0;
            flex-grow: 1 !important;
        }
        .content {
            width: 100%;
            margin-left: -100% !important;
            max-width: 100% !important;
            flex-grow: 1 !important;
            position: relative;
        }
        .innerImg{
            position: absolute;
            width: 100%;
            height: 100%;
            img{
                width: 100%;
                height: 100%;
                border-radius: 4px;
                object-position: center;
                object-fit: cover;
            }
        }
    }
`
const TextBox = styled.div`
        display: flex !important;
        overflow: hidden;
        .aspect {
            padding-bottom: 100%;
            height: 0;
            flex-grow: 1 !important;
        }
        .content {
            width: 100%;
            margin-left: -100% !important;
            max-width: 100% !important;
            flex-grow: 1 !important;
            position: relative;
        }
        .inner{
            position: absolute;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f8f8f8;
            font-size: 12px;
            font-family: "AvenirNext-Medium";
            font-weight: 500;
        }
    
`

export default function SendDOB_detail(){
    const messenger = useSessionMessenger();
    const [params,setParams] = useState(null)
    const [url,setUrl] = useState('')
    const {currentAccountInfo} = useAccountAddress();
    const {network} = useNetwork();
    const [dobDetail,setDobDetail] = useState(null)
    const[loading,setLoading] = useState(false)
    const [error,setError] = useState(false)
    const [tips,setTips] = useState('')
    const {symbol} = useBalance();
    const navigate = useNavigate();
    const [btnL,setBtnL] = useState(false)

    useEffect(() => {
        if(!messenger)return;
        getDetail()
    }, [messenger]);

    useEffect(() => {
        if(!params)return;
        getDOBDetail()
    }, [params]);


    const handleEvent = (message) => {
        const {type }= message;
        switch(type){
            case "send_DOB_success":
            {
                setError(true)
                setTips('Send Finished')

                const rt = message.data;
                handleSuccess(rt)
                setTimeout(()=>{
                    setError(false)
                    setBtnL(false)
                    window.close();
                },2000)
            }
                break;
            case "send_DOB_error":
            {
                setTips('Send Failed:'+message.data)
                setError(true)
                setLoading(false)
                setTimeout(()=>{
                    setError(false)
                    setBtnL(false)
                },2000)
            }
                break;
        }
    }


    const {sendMsg} = useMessage(handleEvent,[]);

    const Copy = () =>{
        setError(true);
        setTips('Copied')
        setTimeout(()=>{
            setError(false);
        },1500);
    }

    const getDOBDetail = async() =>{
        setLoading(true)
        const {index,txHash} = params?.outPoint;
        const outPoint = {
            index,
            txHash
        }

        try{
            const rt = await getSporeByOutPoint(
                outPoint,
                network.value === "mainnet" ? predefinedSporeConfigs.Mainnet : predefinedSporeConfigs.Testnet,
            )
            let spore =  unpackToRawSporeData(rt.data)
            const buffer = Buffer.from(spore.content.toString().slice(2), 'hex');
            const base64 = Buffer.from(buffer, "binary" ).toString("base64");
            rt.type = spore.contentType;
            if( rt.type.indexOf("text") > -1){
                rt.text =  Buffer.from(buffer, "binary" ).toString()
            }else{
                rt.image = `data:${spore.contentType};base64,${base64}`;
            }

            rt.clusterId =  spore.clusterId;
            setDobDetail(rt)

        }catch (e) {
            console.error("=====getSporeByOutPoint=====",e.message)
            setError(true);
            setTips(e.message)

        }finally {
            setLoading(false)
        }
    }
    const getDetail = async() =>{

        if(messenger){
            let data = await messenger.send("get_DOB_Transaction");
            setParams(data.rt)
            setUrl(data.url)
        }
    }

    const handleSuccess = async(rt) =>{
        try{
            await messenger.send('DOB_transaction_result', {status:"success",data:rt});

        }catch (e) {
            console.error('transaction_result',e)
            await messenger.send('DOB_transaction_result', {status:"failed",data:e.message});
        }finally {
            setLoading(false)
        }
    }

    const submit =() =>{
        setBtnL(true)
        const {index,txHash} = params?.outPoint;
        let obj ={
            method:"send_DOB",
            outPoint:{
                index,
                tx_hash:txHash
            },
            currentAccountInfo,
            toAddress:params?.to
        }

        sendMsg(obj)
    }

    const handleClose = async() =>{
        await messenger.send('DOB_transaction_result', {status:"rejected",data:"user rejected"});
        window.close();
    }

    return <Box>
        {
            loading &&   <Loading showBg={true} />
        }
        <Toast tips={tips}  show={error}/>
        <TopBox>
            <UrlBox>{url}</UrlBox>

            <FirstLine>
                <AvatarBox>
                    <Avatar size={20} address={currentAccountInfo?.address} />
                    <div className="name">{currentAccountInfo?.address?PublicJS.AddressToShow(currentAccountInfo?.address):""}</div>
                </AvatarBox>
                <div>
                    <img src={FromImg} alt=""/>
                </div>
                <AvatarBox>
                    <Avatar size={20} address={params?.to} />
                    <div className="name">{params?.to?PublicJS.AddressToShow(params?.to):""}</div>
                </AvatarBox>
            </FirstLine>

            <DlBox>
                <dl>
                    <dt>Assets</dt>
                    <dd>
                        <ImageBox>
                            <div className="imgbr">
                                {
                                    dobDetail?.type.indexOf("text") === -1 && <div className="photo">
                                        <div className="aspect"/>
                                        <div className="content">
                                            <div className="innerImg">
                                                <img src={dobDetail.image} alt=""/>
                                            </div>
                                        </div>
                                    </div>
                                }
                                {
                                    dobDetail?.type.indexOf("text") > -1 && <TextBox>
                                        <div className="aspect"/>
                                        <div className="content">
                                            <div className="inner">
                                                Text
                                            </div>
                                        </div>
                                    </TextBox>
                                }
                            </div>
                        </ImageBox>
                    </dd>
                </dl>
                {
                    !!dobDetail?.clusterId && <dl>
                        <dt>Cluster Id</dt>
                        <dd className="medium-font">
                            <span>{PublicJs.AddressToShow(dobDetail?.clusterId)}</span>
                            <CopyToClipboard onCopy={()=>Copy()} text={dobDetail?.clusterId}>
                                <img src={CopyImg} alt=""/>
                            </CopyToClipboard>
                        </dd>
                    </dl>
                }

                <dl>
                    <dt>Token ID</dt>
                    <dd className="medium-font">
                        <span>{dobDetail?.cellOutput?.type?.args?PublicJs.AddressToShow(dobDetail?.cellOutput?.type?.args):""}</span>
                        <CopyToClipboard onCopy={()=>Copy()} text={dobDetail?.cellOutput?.type?.args}>
                            <img src={CopyImg} alt=""/>
                        </CopyToClipboard>
                    </dd>
                </dl>
                <dl>
                    <dt>Occupied</dt>
                    <dd className="medium-font">{dobDetail?.cellOutput?.capacity?formatUnit(dobDetail?.cellOutput?.capacity, "ckb"):0} {symbol}</dd>
                </dl>
            </DlBox>
        </TopBox>
        <BtnGroup>
            <Button border onClick={()=>handleClose()}>Rejected</Button>
            <Button primary onClick={()=>submit()} >Confirm{
                btnL && <BtnLoading/>
            } </Button>
        </BtnGroup>
    </Box>
}