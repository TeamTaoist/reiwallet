import NavHeader from "../../header/NavHeader";
import {useTranslation} from "react-i18next";
import ImportHeader from "./ImportHeader";
import styled from "styled-components";
import Button from "../../button/button";
import {useNavigate} from "react-router-dom";

const Box = styled.div`
    display: flex;
  flex-direction: column;
  height: 100vh;
`
const ContentBox = styled.div`
  flex-grow: 1;
  padding: 20px;
  position: relative;
`
const Title = styled.div`
  font-size: 18px;
  line-height: 25px;
  margin-top: 31px;
`
const BoxText = styled.div`
  margin-top: 13px;
  height: 130px;
  background: #F1FCF1;
  border-radius: 14px;
  textarea{
    background: transparent;
    width: 100%;
    height: 130px;
    box-sizing: border-box;
    padding: 20px 25px;
    border: 0;
    resize: none;
    font-size: 14px;
    font-family: AvenirNext-Regular, AvenirNext;
    font-weight: 400;
    color: #212F5A;
    line-height: 19px;
    &:focus{
      outline: none;
    }
  }
`
const BtmBox = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  padding: 20px;
  width: 100%;
  
  background: #FFFFFF;
`


export default function PrivateKey(){
    const { t } = useTranslation();
    const navigate = useNavigate();

    const submit = () =>{
        navigate("/success");
    }

    return <Box>
        <NavHeader title={t('popup.import.title')} />

        <ContentBox>
            <ImportHeader title={t('popup.import.subTitle')} tips={t('popup.import.tips')} />
            <Title>{t('popup.import.textTitle')}</Title>
            <BoxText>
                <textarea name=""  />
            </BoxText>
            <BtmBox>
                <Button fullWidth primary onClick={()=>submit()}>{t('popup.import.Confirm')}</Button>
            </BtmBox>
        </ContentBox>
    </Box>
}