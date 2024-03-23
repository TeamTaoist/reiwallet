import AllModal from "../modal/AllModal";
import Avatar from "../../assets/images/Avatar.png";
import styled from "styled-components";
import Button from "../button/button";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import Open from  "../../assets/images/create/open.png";
import Close from "../../assets/images/create/close.png";
import {useEffect, useState} from "react";
import Keystore from "../../wallet/keystore";
import useAccountAddress from "../../useHook/useAccountAddress";
import BtnLoading from "../loading/btnloading";

const TitleBox = styled.div`
    display: flex;
    align-items: center;
  font-family: "AvenirNext-Bold";
    .demo{
      width: 24px;
      border-radius: 24px;
      margin-right: 8px;
    }
  span{
    font-size: 18px;
  }
  .edit{
    width: 24px;
    margin-left: 8px;
  }
`
const Address = styled.div`
    word-break: break-all;
    margin: 22px auto 36px;
  font-size: 16px;
  font-weight: 500;
  color: #34332E;
  line-height: 22px;
`
const Content = styled.div`
  .titleTips{
    font-size: 12px;
    color: #97A0C3;
    line-height: 16px;
    letter-spacing: 2px;
  }
  .inputBox{
    margin-top: 15px;
    border: 1px solid #A1ADCF;
    display: flex;
    align-items: center;
    justify-content: space-between;
    img{
      margin-right: 10px;
      cursor: pointer;
    }
`

const BtnGroup = styled.div`
    margin-top: 78px;
    display: flex;
    justify-content: space-between;
    button{
      width: 47%;
      height: 36px;
      font-size: 12px;
      line-height: 34px;
      border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap:5px;
        &:disabled{
            opacity: 0.4;
        }
    }
`

export default function Export(){
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [show,setShow] = useState(true);
    const [address,setAddress] = useState('')
    const [password,setPassword] = useState('')
    const [walletName,setWalletName] = useState('');
    const {currentAccountInfo} = useAccountAddress();
    const[loading,setLoading] = useState(false)

    useEffect(() => {
        if(!currentAccountInfo)return;
        const {address,name} = currentAccountInfo;
        setWalletName(name)
        setAddress(address)
    }, [currentAccountInfo]);


    const handleInput = (e) =>{
        const { value } = e.target;
        setPassword(value);

    }

    const toConfirm = async() =>{
        setLoading(true)
        try{
            let pwdRt =  await Keystore.checkPassword(password)
            if(pwdRt){
                navigate('/exportConfirm');
            }else{
                /*global chrome*/
                chrome.storage.session.set({ password:null });
                navigate('/');
            }
        }catch (e) {
            console.error("checkPassword",e)

        }finally {
            setLoading(false)
        }


    }
    const switchPwd = () =>{
        setShow(!show)
    }
    return <AllModal title={t('popup.export.Export')} link="/home">
        <div>
            <TitleBox>
                <img src={Avatar} alt="" className="demo"/>
                <span>{walletName}</span>
            </TitleBox>
            <Address className="medium-font">
                {address}
            </Address>
            <Content>
                <div>
                    <div className="titleTips regular-font">
                        {t('popup.export.password')}
                    </div>
                    <div className="inputBox">
                        <input type={show?"password":"text"} value={password} onChange={(e)=>handleInput(e)}/>
                        {
                            !show &&  <img src={Close} alt="" onClick={()=>switchPwd()}/>
                        }
                        {
                            show && <img src={Open} alt="" onClick={()=>switchPwd()}/>
                        }
                    </div>
                </div>
                <BtnGroup>
                    <Button border onClick={()=>navigate("/")}>{t('popup.export.cancel')}</Button>
                    <Button black onClick={()=>toConfirm()} disabled={!password.length || loading}>{t('popup.export.Confirm')}
                        {
                        loading && <BtnLoading/>
                    }</Button>
                </BtnGroup>
            </Content>
        </div>
    </AllModal>
}
