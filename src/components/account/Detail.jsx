import AllModal from "../modal/AllModal";
import styled from "styled-components";
import Button from "../button/button";
import Avatar from "../../assets/images/Avatar.png";
import CopyImg from "../../assets/images/create/COPY.png";
import EditImg from "../../assets/images/edit.png";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {CopyToClipboard} from "react-copy-to-clipboard";
import Checked from "../../assets/images/Checked.png";
import Toast from "../modal/toast";
import useAccountAddress from "../../useHook/useAccountAddress";
import useWalletList from "../../useHook/useWalletList";
import useCurrentAccount from "../../useHook/useCurrentAccount";
import QRCode from "react-qr-code";

const TitleBox = styled.div`
    display: flex;
    align-items: center;
  font-family: "AvenirNext-Bold";
    .demo{
      width: 24px;
      border-radius: 24px;
      margin-right: 8px;
    }
  .edit{
    width: 24px;
    margin-left: 8px;
  }
  .rht{
    display: flex;
    align-items: center;
  }
  span{
    font-size: 18px;
  }
  .inputAccount{
    width: 219px;
    height: 38px;
    box-sizing: border-box;
    padding: 0 20px;
    border-radius: 14px;
    border: 1px solid #000000;
    font-family: "AvenirNext-Bold";
    font-size: 18px;
  }
`
const ImgBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 45px;
  
    img{
      width: 140px;
      height: 140px;
    }
`
const Address = styled.div`
    word-break: break-all;
    margin: 40px auto 60px;
  font-size: 16px;
  font-weight: 500;
  color: #34332E;
  line-height: 22px;
  position: relative;
    img{
      width: 24px;
      margin-bottom: -6px;
      cursor: pointer;
    }
`

export default function AccountDetail(){
    const navigate = useNavigate();
    const { t } = useTranslation();
    const {currentAccountInfo} = useAccountAddress();
    const {saveWallet} = useWalletList();
    const {currentAccount} = useCurrentAccount();

    const [ showInput, setShowInput ] = useState(false);
    const [address,setAddress] = useState('')
    const [copied,setCopied] = useState(false);
    const [walletName,setWalletName] = useState('');

    useEffect(() => {
        if(!currentAccountInfo)return;
        const {address,name} = currentAccountInfo;
        setWalletName(name)
        setAddress(address)
    }, [currentAccountInfo]);


    const goExport =() =>{
        navigate('/export');
    }
    const handleEdit = () =>{
        setShowInput(true);
    }
    const handleInput = (e) =>{
        setWalletName(e.target.value);
    }
    const Copy = () =>{
        setCopied(true);
        setTimeout(()=>{
            setCopied(false);
        },1500);
    }

    const Submit =( e )=>{
        setShowInput(false);
        let obj={
            ...currentAccountInfo,
            name:walletName
        }
        saveWallet(obj,currentAccount)
    }

    return <AllModal title={t('popup.account.details')} link="/home">
        <div>
            <TitleBox>
                <img src={Avatar} alt="" className="demo"/>
                {
                    !showInput && <div className="rht">
                        <span>{walletName}</span>
                        <img src={EditImg} alt="" className="edit" onClick={()=>handleEdit()}/>
                    </div>
                }
                {
                    showInput && <div className="rht">
                        <input type="text" className="inputAccount" value={walletName} onChange={(e)=>handleInput(e)}/>
                        <img src={Checked} alt="" className="edit" onClick={()=>Submit()}/>
                    </div>
                }

            </TitleBox>
            <ImgBox>
                {/*<img src={Demo} alt=""/>*/}
                <QRCode
                    size={80}
                    style={{ height: "auto", maxWidth: "140px", width: "140px" }}
                    value={address}
                    viewBox={`0 0 256 256`}
                />
            </ImgBox>

            <Address className="medium-font">
              <Toast tips="copied" left="100" bottom="-40" show={copied}/>
                {address}
                <CopyToClipboard onCopy={()=>Copy()} text={address}>
                    <img src={CopyImg} alt=""/>
                </CopyToClipboard>
            </Address>
            <Button fullWidth black onClick={()=>goExport()}>{t('popup.account.ExportAccount')}</Button>
        </div>
    </AllModal>
}
