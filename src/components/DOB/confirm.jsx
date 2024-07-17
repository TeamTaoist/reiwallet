import useAccountAddress from "../../useHook/useAccountAddress";
import {useWeb3} from "../../store/contracts";
import CloseImg from "../../assets/images/close.png";
import Button from "../button/button";
import styled from "styled-components";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate, useSearchParams} from "react-router-dom";
import PublicJs from "../../utils/publicJS";
import {CopyToClipboard} from "react-copy-to-clipboard";
import CopyImg from "../../assets/images/create/COPY.png";
import {formatUnit} from "@ckb-lumos/bi";
import Toast from "../modal/toast";
import useBalance from "../../useHook/useBalance";
import TokenHeader from "../header/tokenHeader";
import Loading from "../loading/loading";
import useMessage from "../../useHook/useMessage";
import ErrorImg from "../../assets/images/error_image.svg";


const ContentBox = styled.div`
    flex-grow: 1;
    .line{
        background: #f8f8f8;
        width: 100%;
        height: 10px;
        margin-top: 20px;
    }
`
const TitleBox = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #34332E;
  line-height: 20px;
  margin:0 20px 10px;
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
    }
`

const SendInput = styled.div`
  background: #F1FCF1;
  border-radius: 14px;
  border: 1px solid #62BA46;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  margin: 20px  20px 10px;
  textarea{
    resize: none;
    height: 95px;
    padding: 15px;
    flex-grow: 1;
    border: 0;
    background: transparent;
    &:focus{
      outline: none;
    }
  }
  img{
    margin: 18px;
    cursor: pointer;
  }
`



const DlBox = styled.div`
    margin: 0 auto;
    padding: 30px 20px;
    dl{
        margin-bottom: 10px;
        display: flex;
        align-items: flex-end;
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

export default function DOBConfirm(){
    const {currentAccountInfo} = useAccountAddress();
    const {state:{dob}} = useWeb3();
    const {symbol} = useBalance();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [ address,setAddress] = useState('');
    const [search] = useSearchParams();
    const sendTo = search.get("sendTo");
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState(false)
    const [tips,setTips] = useState('')
    const handleEvent = (message) => {
        const {type }= message;
        switch(type){
            case "send_DOB_success":
            {
                setError(true)
                setTips('Send Finished')
                setTimeout(()=>{
                    setError(false)
                    navigate(`/home?tab=0`)
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
                    navigate("/home")
                },2000)
            }
                break;
        }
    }

    const {sendMsg} = useMessage(handleEvent,[]);


    useEffect(() => {
        setAddress(sendTo)
    }, [sendTo]);

    const ClearInput = () =>{
        setAddress('')
    }

    const handleInput = (e)=>{
        setAddress(e.target.value)
    }

    const Copy = () =>{
        setError(true);
        setTips('Copied')
        setTimeout(()=>{
            setError(false);
        },1500);
    }

    const submit =() =>{
        setLoading(true)
        let obj ={
            method:"send_DOB",
            outPoint:dob.out_point,
            currentAccountInfo,
            id:dob?.output?.type?.args,
            toAddress:address
        }

        sendMsg(obj)
    }

    return  <ContentBox>

        {
            loading &&   <Loading showBg={true} />
        }
        <Toast tips={tips}  show={error}/>
        <TokenHeader title={t('popup.send.send')} />
        <div>
            <TitleBox>{t('popup.send.sendTo')}</TitleBox>
            <SendInput>
                <textarea name="" value={address} onChange={(e)=>handleInput(e)} />
                {
                    !!address.length &&<img src={CloseImg} alt="" onClick={()=>ClearInput()}/>
                }
            </SendInput>
            <div className="line" />
        </div>

        <DlBox>
            {/*<dl>*/}
            {/*    <dt>Type</dt>*/}
            {/*    <dd className="medium-font">{dob?.clusterId ? "Spore Cluster" : "DOB"}</dd>*/}
            {/*</dl>*/}
            <dl>
                <dt>{t('popup.send.Assets')}</dt>
                <dd>
                    <ImageBox>
                        <div className="imgbr">
                            {
                                dob.asset.contentType.indexOf("image") > -1 && <div className="photo">
                                    <div className="aspect"/>
                                    <div className="content">
                                        <div className="innerImg">
                                            <img src={dob.asset.data?dob.asset.data:ErrorImg} alt=""/>
                                        </div>
                                    </div>
                                </div>
                            }
                            {
                                dob.asset.contentType.indexOf("text") > -1 && <TextBox>
                                    <div className="aspect"/>
                                    <div className="content">
                                        <div className="inner">
                                            {dob.asset.data}
                                        </div>
                                    </div>
                                </TextBox>
                            }
                            {
                                dob.asset.contentType.indexOf("json") > -1 && <div className="photo">
                                    <div className="aspect"/>
                                    <div className="content">
                                        <div className="innerImg">
                                            <img src={dob.asset.data.url} alt=""/>
                                        </div>
                                    </div>
                                </div>
                            }

                            {
                                dob.asset.contentType.indexOf("dob/0") > -1 && <div className="photo">
                                    <div className="aspect"/>
                                    <div className="content">
                                        <div className="innerImg">
                                            <img src={dob.asset.data.imgUrl} alt=""/>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </ImageBox>
                </dd>
            </dl>
            {
                !!dob?.clusterId && <dl>
                    <dt>{t('popup.send.ClusterId')}</dt>
                    <dd className="medium-font">
                        <span>{PublicJs.AddressToShow(dob?.clusterId)}</span>
                        <CopyToClipboard onCopy={()=>Copy()} text={dob?.clusterId}>
                            <img src={CopyImg} alt=""/>
                        </CopyToClipboard>
                    </dd>
                </dl>
            }

            <dl>
                <dt>{t('popup.send.TokenID')}</dt>
                <dd className="medium-font">
                    <span>{PublicJs.AddressToShow(dob?.output?.type?.args)}</span>
                    <CopyToClipboard onCopy={()=>Copy()} text={dob?.output?.type?.args}>
                        <img src={CopyImg} alt=""/>
                    </CopyToClipboard>
                </dd>
            </dl>
            <dl>
                <dt>{t('popup.send.occupied')}</dt>
                <dd className="medium-font">{formatUnit(dob?.output?.capacity, "ckb")} {symbol}</dd>
            </dl>
        </DlBox>
        <BtnGroup>
            <Button border onClick={()=>navigate("/home?tab=1")}>{t('popup.send.Reject')}</Button>
            <Button primary onClick={()=>submit()} >{t('popup.send.Confirm')}</Button>
        </BtnGroup>
    </ContentBox>
}
