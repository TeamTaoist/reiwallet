import styled from "styled-components";
import CreateImg from "../../../assets/images/create/CreateWallet.png";
import ImportImg from "../../../assets/images/create/importWallet.png";
import Button from "../../button/button";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

const Box = styled.div`
    display: flex;
    flex-direction: column;
  height: 100%;
  .blackBtn{
    width: 90%;
  }
 
`
const Content = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  img{
    width: 90px;
  }
`

const BtnBox = styled.div`
    margin: 15px 71px 0;
`
const Desc = styled.div`
    margin: 0 51px;
    text-align: center;
      font-size: 14px;
      font-weight: 500;
      color: #A6ACBD;
      line-height: 20px;
`
const ImgBox = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 15px;
`
const ImgBox2 = styled(ImgBox)`
    margin-top: 15px;
`

export default function NoWallet(){
    const navigate = useNavigate();
    const { t } = useTranslation();

    const ToCreate = ()=>{
        navigate('/step1')
    }
    const ToImport = ()=>{
        navigate('/mnemonics');
    }

    return <Box>
        <Content>
            <ImgBox>
                <img src={CreateImg} alt=""/>
            </ImgBox>
            <Desc className="regular-font">
                {t('popup.walletHome.createTips')}
            </Desc>
            <BtnBox>
                <Button primary fullWidth onClick={()=>ToCreate()}>{t('popup.walletHome.createBtn')}</Button>
            </BtnBox>

            <ImgBox2>
                <img src={ImportImg} alt=""/>
            </ImgBox2>
            <Desc className="regular-font">
                {t('popup.walletHome.importTips')}
            </Desc>
            <BtnBox>
                <Button black fullWidth onClick={()=>ToImport()}>{t('popup.walletHome.importBtn')}</Button>
            </BtnBox>

        </Content>

    </Box>
}