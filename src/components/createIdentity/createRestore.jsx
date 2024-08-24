import styled from "styled-components";
import Button from "../button/button";
import LogoV from "../../assets/images/create/CreateWallet.png";
import {useTranslation} from "react-i18next";

const Main = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    padding: 20px;
    text-align: center;
    button{
      margin-top: 30px;
    }
`

const TipsBox = styled.div`
    width: 80%;
    margin: 34px auto;
    font-size: 16px;
`

export default function CreateRestore(){
    const { t } = useTranslation();
    const create = () =>{
        /*global chrome*/
        chrome.tabs.create({
            url: '/install.html#/create'
        });
    }
    return <Main>
        <img src={LogoV} alt=""/>
        <TipsBox className="regular-font">
            {t('popup.create.tips')}
        </TipsBox>
        <Button primary fullWidth onClick={()=>create()}>{t('install.create.create.start')}</Button>
        {/*<Button border fullWidth>{t('popup.create.Restore')}</Button>*/}

    </Main>
}
