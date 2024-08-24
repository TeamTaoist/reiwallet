import NavHeader from "../../header/navHeader";
import {useTranslation} from "react-i18next";
import ImportHeader from "./importHeader";
import styled from "styled-components";
import Button from "../../button/button";
import {useNavigate} from "react-router-dom";
import Info from "../../../assets/images/create/tip.png"

const Box = styled.div`
    display: flex;
  flex-direction: column;
  height: 100%;
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
  background: #FCFEFA;
  border-radius: 14px;
  border: 1px solid #000000;
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
const FlexLine = styled.div`
    display: flex;
    align-items: flex-start;
  margin-top: 22px;
  font-size: 14px;
  font-family: AvenirNext-Regular, AvenirNext;
  font-weight: 400;
  color: #242F57;
  line-height: 20px;
  img{
    width: 23px;
    margin-right: 4px;
  }
`


export default function Mnemonics(){
    const { t } = useTranslation();
    const navigate = useNavigate();

    const submit = () =>{
        navigate("/success");
    }

    return <Box>
        <NavHeader title={t('popup.mnemonics.title')} />

        <ContentBox>
            <ImportHeader title={t('popup.mnemonics.subTitle')} tips={t('popup.mnemonics.tips')} />
            <Title>{t('popup.mnemonics.textTitle')}</Title>
            <BoxText>
                <textarea name=""  />
            </BoxText>
            <FlexLine>
                <img src={Info} alt=""/>
                <div>
                    {t('popup.mnemonics.inputTips')}
                </div>
            </FlexLine>
            <BtmBox>
                <Button fullWidth primary onClick={()=>submit()}>{t('popup.mnemonics.Confirm')}</Button>
            </BtmBox>
        </ContentBox>
    </Box>
}