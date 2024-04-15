import TokenHeader from "../header/tokenHeader";
import styled from "styled-components";
import {useTranslation} from "react-i18next";
import Button from "../button/button";
import {useWeb3} from "../../store/contracts";
import {useState} from "react";
import {formatUnit} from "@ckb-lumos/bi";
import useBalance from "../../useHook/useBalance";
import PublicJs from "../../utils/publicJS";
import CopyImg from "../../assets/images/create/COPY.png";
import Toast from "../modal/toast";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {useNavigate} from "react-router-dom";
import Melt from "./melt";

const Box = styled.div`
    min-height: 100%;
    display: flex;
    flex-direction: column;
`
const Content = styled.div`
    flex-grow: 1;
    margin:20px 0;
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
            font-size: 14px;
            font-family: "AvenirNext-Medium";
            font-weight: 500;


            line-height: 28px;
            box-sizing: border-box;
            padding: 20px;

            word-break: break-all;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 10;
            overflow: hidden;
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
        width: 80vw;
        height: 80vw;
        border: 1px solid #eee;
        border-radius: 10px;
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
                border-radius: 8px;
                object-position: center;
                object-fit: cover;
            }
        }
    }
    .line{
        background: #f8f8f8;
        width: 100%;
        height: 10px;
        margin-top: 20px;
    }
    button{
        width: 80vw;
        margin-top: 20px;
    }
`
const DlBox = styled.div`
    width: 80vw;
    margin: 0 auto;
    padding: 30px 0 ;
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
const MeltBox = styled.div`
    width: 100%;
    text-align: center;
    font-size: 12px;
    margin-top: 10px;
    cursor: pointer;
`



export default function DOB_detail(){
    const { t } = useTranslation();
    const {state:{dob}} = useWeb3();
    const {symbol} = useBalance();
    const [copied,setCopied] = useState(false);
    const navigate = useNavigate();
    const [show,setShow]= useState(false)

    const Copy = () =>{
        setCopied(true);
        setTimeout(()=>{
            setCopied(false);
        },1500);
    }

    const toGo = () =>{
        navigate("/sendDOB")

        // toBackground()
    }

    const handleClose = () =>{
        setShow(false)
    }
    const handleShow = () =>{
        setShow(true)
    }

    return <Box>
        <Toast tips="copied" size={20} show={copied}/>
        {
            show &&  <Melt handleClose={handleClose} dob={dob} />
        }

        <TokenHeader title="DOB Detail" />
        <Content>
            <ImageBox>
                <div className="imgbr">
                    {
                        dob?.type.indexOf("text") === -1 && <div className="photo">
                            <div className="aspect"/>
                            <div className="content">
                                <div className="innerImg">
                                    <img src={dob.image} alt=""/>
                                </div>
                            </div>
                        </div>
                    }
                    {
                        dob?.type.indexOf("text") > -1 && <TextBox>
                            <div className="aspect"/>
                            <div className="content">
                                <div className="inner">
                                    {dob.text}
                                </div>
                            </div>
                        </TextBox>
                    }
                </div>
                <Button primary onClick={()=>toGo()}>Send</Button>
                <MeltBox onClick={()=>handleShow()}>Melt DOB</MeltBox>
                <div className="line" />
            </ImageBox>
            <DlBox>
                {/*<dl>*/}
                {/*    <dt>Type</dt>*/}
                {/*    <dd className="medium-font">{dob?.clusterId ? "Spore Cluster" : "DOB"}</dd>*/}
                {/*</dl>*/}
                {
                    !!dob?.clusterId && <dl>
                        <dt>Cluster Id</dt>
                        <dd className="medium-font">
                            <span>{PublicJs.AddressToShow(dob?.clusterId)}</span>
                            <CopyToClipboard onCopy={()=>Copy()} text={dob?.clusterId}>
                                <img src={CopyImg} alt=""/>
                            </CopyToClipboard>
                        </dd>
                    </dl>
                }

                <dl>
                    <dt>Token ID</dt>
                    <dd className="medium-font">
                        <span>{PublicJs.AddressToShow(dob?.output?.type?.args)}</span>
                        <CopyToClipboard onCopy={()=>Copy()} text={dob?.output?.type?.args}>
                        <img src={CopyImg} alt=""/>
                        </CopyToClipboard>
                    </dd>
                </dl>
                <dl>
                    <dt>Occupied</dt>
                    <dd className="medium-font">{formatUnit(dob?.output?.capacity, "ckb")} {symbol}</dd>
                </dl>
            </DlBox>
        </Content>
    </Box>
}
