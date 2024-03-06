import NavHeader from "../../header/NavHeader";
import CreateHeader from "./createHeader";
import styled from "styled-components";
import {useTranslation} from "react-i18next";
import TipImg from "../../../assets/images/create/tip.png";
import Button from "../../button/button";
import {useNavigate} from "react-router-dom";
import Open from "../../../assets/images/create/open.png";
import Close from "../../../assets/images/create/close.png";
import {useState} from "react";

const Content = styled.div`
    padding: 0 20px;
      .titleTips{
        font-size: 12px;
        color: #97A0C3;
        line-height: 16px;
        letter-spacing: 2px;
        margin-bottom: 14px;
      }
    .inputBox{
      border: 1px solid #A1ADCF;
      display: flex;
      align-items: center;
      justify-content: space-between;
      img{
        margin-right: 10px;
        cursor: pointer;
      }
      &:hover{
        border: 1px solid #000!important;
      }
    }
    dl{
      margin-bottom: 20px;
    }
`
const TipsBox = styled.div`
  display: flex;
  align-items: center;
  img{
    margin-right: 7px;
  }
  div{
    font-size: 14px;
    line-height: 20px;
  }
`
const BtnGroup = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 25px;
  button{
    width: 47%;
  }
`


export default function Step1(){
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [show,setShow] = useState(true);
    const [showConfirm,setShowConfirm] = useState(true);

    const [walletName, setWalletName] = useState('');
    const [password,setPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');

    const submit = () =>{
        let obj = {
            walletName,
            password
        }
        navigate("/step2");
    }

    const switchPwd = () =>{
        setShow(!show)
    }

    const switchConfirmPwd = () =>{
        setShowConfirm(!showConfirm)
    }
    const handleInput = (e,type) =>{
        const { value } = e.target;
        switch (type) {
            case 'walletName':
                setWalletName(value);
                break;
            case 'password':
                setPassword(value);
                break;
            case 'confirmPassword':
                setConfirmPassword(value);
                break;
        }

    }

    return <div>
        <NavHeader title={t('popup.createTitle')} />
        <CreateHeader title={t('popup.step1.subTitle')} step="1/3" />
        <Content>
            <dl>
                <dt className="titleTips regular-font">{t('popup.step1.walletName')}</dt>
                <dd className="inputBox">
                    <input type="text" placeholder={t('popup.step1.namePlaceholder')} value={walletName} onChange={(e)=>handleInput(e,"walletName")} autoComplete="new-password"/>
                </dd>
            </dl>
            <dl>
                <dt className="titleTips regular-font">{t('popup.step1.pwd')}</dt>
                <dd className="inputBox">
                    <input type={show?"password":"text"} placeholder={t('popup.step1.pwdPlaceholder')} value={password} onChange={(e)=>handleInput(e,"password")} autoComplete="new-password" />
                    {
                        !show &&  <img src={Close} alt="" onClick={()=>switchPwd()}/>
                    }
                    {
                        show && <img src={Open} alt="" onClick={()=>switchPwd()}/>
                    }

                </dd>
            </dl>
            <dl>
                <dt className="titleTips regular-font">{t('popup.step1.confirmPwd')}</dt>
                <dd className="inputBox">
                    <input type={showConfirm?"password":"text"}  placeholder={t('popup.step1.confirmPlaceholder')} value={confirmPassword} onChange={(e)=>handleInput(e,"confirmPassword")} autoComplete="new-password"/>
                    {
                        !showConfirm &&  <img src={Close} alt="" onClick={()=>switchConfirmPwd()}/>
                    }
                    {
                        showConfirm && <img src={Open} alt="" onClick={()=>switchConfirmPwd()}/>
                    }
                </dd>
            </dl>
            <TipsBox>
                <img src={TipImg} alt=""/>
                <div className="regular-font">
                    {t('popup.step1.tips')}
                </div>
            </TipsBox>
            <BtnGroup>
                <Button primaryBorder>{t('popup.step1.cancel')}</Button>
                <Button primary onClick={()=>submit()} disabled={!walletName || !password || password!== confirmPassword}>{t('popup.step1.Confirm')}</Button>
            </BtnGroup>
        </Content>
    </div>
}
