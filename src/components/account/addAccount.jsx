import styled from "styled-components";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import Button from "../button/button";
import useWalletList from "../../useHook/useWalletList";
import useNetwork from "../../useHook/useNetwork";
import {useNavigate} from "react-router-dom";

const MaskBox = styled.div`
    background: rgba(0,0,0,0.4);
    position: fixed;
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    
`

const BgBox = styled.div`
  width:90%;
  background: #FFFFFF;
  box-shadow: 0px 0px 8px 0px #EDEDED;
  border-radius: 14px!important;
  display: flex;
  flex-direction: column;
    overflow: hidden;
`
const TitleBox = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: #34332E;
  line-height: 20px;
  height: 62px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  flex-shrink: 0;
`

const ContentBox = styled.div`
    padding: 0 20px;
    .inputBox{
        margin-top: 15px;
    }
    .liBox{
        margin-bottom: 20px;
    }
  `
const BtnGroup = styled.div`

    display: flex;
    width:100%;
    justify-content: space-between;
    background: #fff;
    padding: 0  20px 20px;
    box-sizing: border-box;
    button{
      width: 49%;
    }
`

export default function AddAccount({handleCloseNew}) {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const {walletList} = useWalletList();
    const {network} = useNetwork();

    useEffect(() => {
        let str = `Account ${walletList.length+1}`
        setName(str)
    }, [walletList]);
    const handleInput = (e) => {
        const {value} = e.target;
        setName(value)
    }

    useEffect(() => {
        /*global chrome*/
        chrome.runtime.onMessage.addListener(listenerEvent)
        return () =>{
            chrome.runtime.onMessage.removeListener(listenerEvent)
        }
    }, []);

    const listenerEvent = (message, sender, sendResponse) => {

        if(message.type==="to_lock"){
            console.error("===to_lock=")
            navigate('/');
        }
        sendResponse({message})
    }

    const handleCreate = () =>{
        let obj ={
            index:walletList.length,
            network,
            hasMnemonic:true
        }
        /*global chrome*/
        chrome.runtime.sendMessage({  data: obj ,type:"Create_Account"}, function (response) {
            console.log("Create_Account success");
        })
    }

    return <MaskBox>
        <BgBox>
            <TitleBox className="medium-font">Add Account</TitleBox>
            <ContentBox>
                <div className="liBox">
                    <div className="titleTips regular-font">
                        Account Name
                    </div>
                    <div className="inputBox">
                        <input type="text" value={name}
                               placeholder={t('install.create.create.pwdPlaceholder')}
                               onChange={(e) => handleInput(e)}/>
                    </div>

                </div>
            </ContentBox>
            <BtnGroup>
                <Button black onClick={()=>handleCreate()}>{t('popup.switch.Create')}</Button>
                <Button border onClick={()=>handleCloseNew()}>Cancel</Button>
            </BtnGroup>
        </BgBox>

    </MaskBox>
}
