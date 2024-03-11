import styled from "styled-components";
import DemoImg from "../../assets/images/demo/99592461.jpeg";
import Button from "../button/button";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import useNetwork from "../../useHook/useNetwork";
import useAccountAddress from "../../useHook/useAccountAddress";

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
    const {networkInfo} = useNetwork();
    const {currentAccountInfo} = useAccountAddress();
    const [loading,setLoading] = useState(false);

    useEffect(() => {
        if(!networkInfo || !currentAccountInfo) return;
        setLoading(true)

        let obj ={
            method:"get_capacity",
            networkInfo,
            currentAccountInfo
        }
        /*global chrome*/
        chrome.runtime.sendMessage({  data: obj ,type:"CKB_POPUP"}, function () {
            console.log("send get_capacity success");
        })
    }, [currentAccountInfo,networkInfo]);

    useEffect(() => {
        /*global chrome*/
        chrome.runtime.onMessage.addListener(listenerEvent)
        return () =>{
            chrome.runtime.onMessage.removeListener(listenerEvent)
        }
    }, []);

    const listenerEvent = (message, sender, sendResponse) => {
        const {type }= message
        if(type ==="get_Capacity_success"){
            setLoading(false)
            console.log("====listenerEvent==",message.data)

        }
        sendResponse({message})
    }



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
