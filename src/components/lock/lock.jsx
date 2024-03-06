import LogoV from "../../assets/images/logo-V.png";
import Button from "../button/button";
import {useTranslation} from "react-i18next";
import styled from "styled-components";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";


const Main = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    padding: 20px;
    text-align: center;
    button{
      margin-top: 30px;
    }
`

const TipsBox = styled.div`
    width: 80%;
    margin: 34px auto;
    font-size: 16px;
`

const Content = styled.div`
  width: 100%;
  text-align: left;
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
`
const Forgot = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: #00A25C;
  line-height: 20px;
  margin-top: 10px;
`

export default function Lock(){
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [ password, setPassword ] = useState('');

    const handleInput = (e) =>{
        const { value } = e.target;
        setPassword(value);
    }


    const submit = () =>{
        navigate("/");

    }
    return <Main>
        <img src={LogoV} alt=""/>
        <TipsBox className="regular-font">
            {t('popup.lock.tips')}
        </TipsBox>
        <Content>
            <dt className="titleTips regular-font">{t('popup.lock.password')}</dt>
            <dd className="inputBox">
                <input type="text" placeholder={t('popup.lock.placeholder')} value={password} onChange={(e)=>handleInput(e,"walletName")} autoComplete="new-password"/>
            </dd>
        </Content>
        <Button primary fullWidth disabled={!password.length} onClick={()=>submit()}>{t('popup.lock.unlock')}</Button>
        <Forgot className="medium-font">Forgot password</Forgot>
    </Main>

}
