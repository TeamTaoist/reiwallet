import styled from "styled-components";
import Button from "../button/button";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import useNetwork from "../../useHook/useNetwork";
import useAccountAddress from "../../useHook/useAccountAddress";
import {formatUnit} from "@ckb-lumos/bi";
import useMessage from "../../useHook/useMessage";

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
    const [balance,setBalance] = useState("--");
    const {networkInfo} = useNetwork();
    const {currentAccountInfo} = useAccountAddress();
    const [loading,setLoading] = useState(false);

    const handleEvent = (message) => {
        const {type }= message;
        if(type ==="get_Capacity_success"){
            setLoading(false)
            const {capacity} = message.data;
            let rt = formatUnit(capacity,"ckb")
            setBalance(rt)
        }
    }

    const {sendMsg} = useMessage(handleEvent,[]);

    useEffect(() => {
        if(!networkInfo || !currentAccountInfo) return;
        setLoading(true)
        let obj ={
            method:"get_capacity",
            networkInfo,
            currentAccountInfo
        }
        sendMsg(obj)
    }, [currentAccountInfo,networkInfo]);


    const toSend = () =>{
        navigate("/send");
    }

    return <BalanceBox>
        <Title className="medium-font">
            {balance} {networkInfo?.nativeCurrency?.symbol}
        </Title>
        <Button primary onClick={()=>toSend()}>{t('popup.account.send')}</Button>
    </BalanceBox>
}
