import styled from "styled-components";
import DemoImg from "../../assets/images/demo/99592461.jpeg";
import Button from "../button/button";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {useTranslation} from "react-i18next";

const BalanceBox = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 32px auto;
`

const Logo = styled.div`
    width: 50px;
    
    img{
      width: 100%;
      border-radius: 100%;
    }
`
const Title = styled.div`
  font-size: 28px;
  font-weight: 500;
  color: #000000;
  line-height: 40px;
  margin: 12px auto;
`

export default function Balance(){
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [balance,setBalance] = useState(0);

    const toSend = () =>{
        navigate("/send");
    }

    return <BalanceBox>
        <Logo>
            <img src={DemoImg} alt="" />

        </Logo>
        <Title className="medium-font">
            0 BTC
        </Title>
        <Button primary onClick={()=>toSend()}>{t('popup.account.send')}</Button>
    </BalanceBox>
}
