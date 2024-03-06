import styled from "styled-components";
import Checked from "../../assets/images/Checked.png";
import Close from "../../assets/images/close.png";
import Button from "../button/button";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

const ModalBox = styled.div`
  position: absolute;
  height: 297px;
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
  height: 147px;
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
        .img{
            width: 24px;
            height: 24px;
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

export default function NetworkList(){
    const { t } = useTranslation();
    const navigate = useNavigate();

    const toGo = () =>{
        navigate('/addNetwork');
    }

    return <ModalBox>
        <Title className="medium-font">{t('popup.network.Networks')}</Title>
        <UlBox>
            {
                [...Array(2)].map((item,index)=>( <li key={index} >
                    <div className="lft">Ethereum Mainnet</div>
                    <img src={Checked} alt=""/>
                </li>))
            }

            <li>
                <div className="lft">Ethereum Mainnet</div>
                <div className="img" />
            </li>
            <li>
            <div className="lft">Ethereum Mainnet</div>
                <img src={Close} alt=""/>
            </li>
        </UlBox>
        {/*<BtnBox>*/}
        {/*    <Button border onClick={()=>toGo()}>{t('popup.network.AddNetwork')}</Button>*/}
        {/*</BtnBox>*/}
    </ModalBox>
}
