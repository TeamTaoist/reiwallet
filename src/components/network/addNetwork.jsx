import TokenHeader from "../header/tokenHeader";
import styled from "styled-components";
import Button from "../button/button";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";

const Box = styled.div`
  background: #F9FAFA;
`

const ContentBox = styled.div`
    margin: 0 20px;
`
const BtnGroup = styled.div`
    display: flex;
    justify-content: space-between;
    margin:59px 20px 20px;
    button{
      width: 47%;
    }
`

const InputBox = styled.div`
    margin-top: 29px;
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
    &:hover{
      border: 1px solid #000!important;
    }
  }
`

export default function AddNetwork(){
    const { t } = useTranslation();
    const navigate = useNavigate();

    const toGo = () =>{
        navigate('/');
    }
    const submit =()=>{
        navigate('/');
    }

    return <Box>
        <TokenHeader title={t('popup.network.AddNetwork')} />
        <ContentBox>
            <InputBox>
                <div className="titleTips regular-font">{t('popup.network.name')}</div>
                <div className="inputBox">
                    <input type="text" />
                </div>
            </InputBox>
            <InputBox>
                <div className="titleTips regular-font">{t('popup.network.rpcUrl')}</div>
                <div className="inputBox">
                    <input type="text"  />
                </div>
            </InputBox>
            <InputBox>
                <div className="titleTips regular-font">{t('popup.network.id')}</div>
                <div className="inputBox">
                    <input type="text"  />
                </div>
            </InputBox>
            <InputBox>
                <div className="titleTips regular-font">{t('popup.network.symbol')}</div>
                <div className="inputBox">
                    <input type="text"  />
                </div>
            </InputBox>
            <InputBox>
                <div className="titleTips regular-font">{t('popup.network.explorerUrl')}</div>
                <div className="inputBox">
                    <input type="text"  />
                </div>
            </InputBox>
        </ContentBox>
        <BtnGroup>
            <Button border onClick={()=>toGo()}>{t('popup.network.cancel')}</Button>
            <Button primary onClick={()=>submit()}>{t('popup.network.save')}</Button>
        </BtnGroup>
    </Box>
}