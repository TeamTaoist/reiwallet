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


const Tips = styled.div`
    padding: 10px 0;
    span{
        font-weight: bold;
    }
`

const DlBox = styled.div`
    margin: 0 auto;
    padding: 30px 20px;
    dl{
        margin-bottom: 10px;
        display: flex;
        align-items: flex-start;
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
    .desc{
        margin-left: 20px;
    }
`

export default function ClusterConfirm(){
    const {currentAccountInfo} = useAccountAddress();
    const {state:{cluster}} = useWeb3();
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
            case "send_Cluster_success":
            {
                setError(true)
                setTips('Send Finished')
                setTimeout(()=>{
                    setError(false)
                    navigate(`/home?tab=0`)
                },2000)
            }
                break;
            case "send_Cluster_error":
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
            method:"send_Cluster",
            outPoint:cluster.out_point,
            currentAccountInfo,
            toAddress:address,
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
        <dl>
            <dt>Cluster Id</dt>
            <dd className="medium-font">
                <span>{cluster?.clusterId ? PublicJs.AddressToShow(cluster?.clusterId):""}</span>
                <CopyToClipboard onCopy={()=>Copy()} text={cluster?.clusterId}>
                    <img src={CopyImg} alt=""/>
                </CopyToClipboard>
            </dd>
        </dl>

            <dl>
                <dt>Cluster Name</dt>
                <dd className="medium-font">{cluster?.cluster?.name}</dd>
            </dl>
            <dl>
                <dt>Occupied</dt>
                <dd className="medium-font">{formatUnit(cluster?.output?.capacity, "ckb")} {symbol}</dd>
            </dl>
            <dl>
                <dt>Description</dt>
                <dd className="medium-font desc">{cluster?.cluster?.description}</dd>
            </dl>
        </DlBox>
        <BtnGroup>
            <Button border onClick={()=>navigate("/home?tab=1")}>Rejected</Button>
            <Button primary onClick={()=>submit()} >Confirm</Button>
        </BtnGroup>
    </ContentBox>
}