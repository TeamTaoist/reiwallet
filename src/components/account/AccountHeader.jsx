import styled from "styled-components";
import DemoImg from "../../assets/images/Avatar.png";
import CopyImg from "../../assets/images/create/COPY.png";
import MoreImg from "../../assets/images/more-dot.png";
import EtherImg from "../../assets/images/ether.png";
import { useState} from "react";
import DetailsImg from "../../assets/images/Details.png";
import AccountSwitch from "./accountSwitch";
import {useEffect} from "react";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import PublicJs from "../../utils/publicJS";
import Toast from "../modal/toast";

const AccountBox = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px ;
    border-bottom: 9px solid rgba(235, 237, 240, 0.2);
    position: relative;
`
const Lft = styled.div`
    display: flex;
    .avatar{
      width: 36px;
      height: 36px;
      border-radius: 36px;
      margin-right: 13px;
    }
  .account{
    font-size: 22px;
    font-weight: 500;
    color: #34332E;
    font-family: "AvenirNext-Medium";
    line-height: 20px;
    margin-bottom: 4px;
  }
  .address{
    font-size: 14px;
    font-weight: 500;
    color: #A6ACBD;
    line-height: 20px;
  }
`

const Tips = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
  position: relative;
    img{
      margin-left: 5px;
      width: 24px;
      cursor: pointer;
    }
`

const Rht = styled.div`
  cursor: pointer;
    img{
      width: 24px;
    }
`
const DropDown = styled.div`
    position: absolute;
      right: 10px;
      top:60px;
      width: 173px;
      height: 116px;
      background: #FFFFFF;
      box-shadow: 0 0 8px 0 #EDEDED;
      border-radius: 14px;
      padding: 11px 0;
    dl{
      display: flex;
      align-items: center;
      height: 44px;
      padding: 0 8px;
      cursor: pointer;
      &:hover{
        background: #F1FCF1;
      }
    }
    img{
      margin-right: 6px;
      width: 24px;
    }
    dd{
      font-size: 12px;
      color: #34332D;
      line-height: 17px;
      font-family: "AvenirNext-Medium";
    }
`

export default function AccountHeader(){
    const navigate = useNavigate();
    const { t } = useTranslation();


    const[show,setShow] = useState(false);
    const [showAccount,setShowAccount] = useState(false);
    const [address,setAddress] = useState('');
    const [walletName,setWalletName] = useState('');
    const [copied,setCopied] = useState(false);

    useEffect(() => {
        document.addEventListener("click", (e) =>{
            setShow(false);
            setShowAccount(false);
        });
        getAccount();
    }, []);


    const getAccount = () =>{
        /*global chrome*/
        // chrome.storage.local.get(['current'],(result)=>{
        //   console.log(result)
        //     const accountInfo = result.current[0];
        //     setAddress(accountInfo.address)
        //     setWalletName(accountInfo.name)
        // });
    }

    const stopPropagation = (e) => {
        e.nativeEvent.stopImmediatePropagation();
    }
    const showDropDown =(e) =>{
        stopPropagation(e);
        setShow(!show);
    }

    const toDetail = () =>{
        navigate('/detail');
    }

    const Copy = () =>{
        setCopied(true);
        setTimeout(()=>{
            setCopied(false);
        },1500);
    }

    const handleAccount = (e) =>{
        stopPropagation(e);
        setShowAccount(!showAccount);
    }

    return <AccountBox>
        {
            show &&<DropDown>
                <dl>
                    <dt>
                        <img src={EtherImg} alt=""/>
                    </dt>
                    <dd>Etherscan.com</dd>
                </dl>
                <dl onClick={()=>toDetail()}>
                    <dt>
                        <img src={DetailsImg} alt=""/>
                    </dt>
                    <dd>{t('popup.account.details')}</dd>
                </dl>
            </DropDown>
        }
        {
            showAccount && <AccountSwitch />
        }


        <Lft>
            <img src={DemoImg} alt="" className="avatar" onClick={(e)=>handleAccount(e)}/>
            <div>
                <div className="account">{walletName}</div>
                <Tips>
                    <Toast tips="copied" left="100" bottom="-40" show={copied}/>
                    <div className="address">{PublicJs.AddressToShow(address)}</div>
                    <CopyToClipboard onCopy={()=>Copy()} text={address}>
                        <img src={CopyImg} alt=""/>
                    </CopyToClipboard>
                </Tips>
            </div>
        </Lft>
        <Rht onClick={(e)=>showDropDown(e)}>
            <img src={MoreImg} alt=""/>
        </Rht>
    </AccountBox>
}
