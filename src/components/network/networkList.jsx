import styled from "styled-components";
import Checked from "../../assets/images/Checked.png";
import Close from "../../assets/images/close.png";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import useNetwork from "../../useHook/useNetwork";
import {CirclePlus} from "lucide-react";

const Box = styled.div`
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.2);
    backdrop-filter: blur(2px);
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999;
`

const ModalBox = styled.div`
  position: absolute;
  //height: 297px;
  width: 90%;
  background: #FFFFFF;
  box-shadow: 0px 0px 8px 0px #EDEDED;
  border-radius: 14px;
  z-index: 9999;
  overflow: hidden;
  top:75px;
  right: 5%;
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
        box-sizing: border-box;
        padding-left: 20px;
        font-size: 14px;
    }
    li{
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 44px;
      padding: 0 10px;
        border-bottom: 1px solid #f5f5f5;
        &:last-child{
            border-bottom: 0;
            margin-bottom: 30px;
        }
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
    padding: 10px;
    .btn{
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        cursor: pointer;
    }
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

        let net = JSON.parse(JSON.stringify(netList[index]));
        delete net.value
        /*global chrome*/
        try {
            chrome.runtime.sendMessage({  data:net,method:"chainChanged" ,type:"CKB_ON_BACKGROUND"}, () =>{
                if (chrome.runtime.lastError) {
                    console.log("chrome.runtime.lastError", chrome.runtime.lastError.message);
                    return;
                  }
            })
        } catch (error) {
            console.error("Error sending message:", error);
        }

    }
    const handleRemove = async (index) =>{
        handleLoading()
        let arr = [...netList]
        arr.splice(index,1)

        chrome.storage.local.set({networkList:arr})
        closeLoading()
    }

    return <Box><ModalBox>
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
        {/*<BtnBox>*/}
        {/*    <div className="btn" onClick={()=>toGo()}> <CirclePlus /><span>{t('popup.network.AddNetwork')}</span></div>*/}
        {/*</BtnBox>*/}
    </ModalBox>
    </Box>
}
