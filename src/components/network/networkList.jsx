import styled from "styled-components";
import Checked from "../../assets/images/Checked.png";
import Close from "../../assets/images/close.png";
import Button from "../button/button";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useState} from "react";
import useNetwork from "../../useHook/useNetwork";

const ModalBox = styled.div`
  position: absolute;
  //height: 297px;
  width: 296px;
  background: #FFFFFF;
  box-shadow: 0px 0px 8px 0px #EDEDED;
  border-radius: 14px;
  z-index: 9999;
  overflow: hidden;
  top:75px;
  right: 28px;
`

const Title = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #000000;
  line-height: 22px;
  height: 59px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const UlBox = styled.ul`
  overflow-y: auto;
  height: 100px;
    .lft{
      flex-grow: 1;
      text-align: center;
    }
    li{
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 44px;
      padding: 0 10px;
      &:hover{
        background: #F1FCF1;
      }
        .flex{
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-grow: 1;
        }
        .img{
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap:10px;
            width:24px;
            &:last-child img{
                cursor:pointer
            }
        }
    }
`
const BtnBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    padding: 20px;
`

export default function NetworkList({current,handleLoading,closeLoading}){
    const { t } = useTranslation();
    const navigate = useNavigate();
    const {saveNetwork,netList} = useNetwork();

    const toGo = () =>{
        navigate('/addNetwork');
    }

    const handleSelect = async (index) =>{
        const value = netList[index].value;
        saveNetwork(value)

        let net = netList[index];
        delete net.value

        /*global chrome*/
        chrome.runtime.sendMessage({  data:net,method:"chainChanged" ,type:"CKB_ON_BACKGROUND"}, () =>{})

    }
    const handleRemove = async (index) =>{
        handleLoading()
        let arr = [...netList]
        arr.splice(index,1)

        /*global chrome*/
        chrome.storage.local.set({networkList:arr})
        closeLoading()
    }

    return <ModalBox>
        <Title className="medium-font">{t('popup.network.Networks')}</Title>
        <UlBox>
            {
                netList.map((item,index)=>(<li key={index}>

                    <div className="flex" onClick={() => handleSelect(index)}>
                        <div className="lft">{item.name}</div>
                        <div className="img">
                            {
                                current === index && <img src={Checked} alt=""/>
                            }
                        </div>
                    </div>

                    <div className="img">
                        {
                            index > 1 && current !== index &&
                            <img src={Close} alt="" onClick={() => handleRemove(index)}/>
                        }
                    </div>

                </li>))
            }
        </UlBox>
        <BtnBox>
            <Button border onClick={()=>toGo()}>{t('popup.network.AddNetwork')}</Button>
        </BtnBox>
    </ModalBox>
}
