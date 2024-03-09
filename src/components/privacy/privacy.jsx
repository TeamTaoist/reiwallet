import React, { useCallback } from "react"
import styled from "styled-components"
import DashboardLayout from "../dashboard/layout";
import Button from "../button/button";
import Check from '../../assets/images/dashboard/check.svg';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import useWalletList from "../../useHook/useWalletList";

const PrivacyPageStyled = styled.div`
  width: 762px;
  padding: 120px 100px 50px 100px;
  background: #FFFFFF;
  box-shadow: 0px 0px 30px 0px rgba(3, 36, 22, 0.06);
  border-radius: 10px;
  border: 1px solid #F3F7F4;
  margin: 60px auto ;
  height: 600px;
  overflow-y: auto;

  h1 {
    font-size: 32px;
    letter-spacing: 0.62px;
  }

  h2 {
    font-size: 20px;
  }

  p {
    font-size: 16px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0.23px;
  }

  .options {
    text-align: center;
    margin-top: 38px;
    button:first-child {
      margin-right: 30px;
    }
  }
`

const CheckBoxStyled = styled.div`
  font-size: 16px;
  margin: 44px 0;
`
const CheckItemStyled = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-top: 18px;
  &:first-child {
    margin-top: 0;
  }
  img {
    width: 24px;
    height: 24px;
    margin-right: 10px;
  }
`

const CheckItem = (props) => {
  return (
    <CheckItemStyled>
      <img src={Check} alt="" />
      <span>{props.children}</span>
    </CheckItemStyled>
  )
}

const PrivacyDashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {walletList} = useWalletList();
  const clickCancel = useCallback(() => {
    window.close();
  }, [])

  const clickAgree =() => {
    if(walletList?.length){
      window.close();
      return;
    }
    /*global chrome*/
    chrome.storage.local.set({agreement:true})
    navigate('/create');
  }

  return (
    <DashboardLayout>
      <PrivacyPageStyled>
        <h1 className="medium-font">{t('install.privacy.privacy-title')}</h1>
        <p>{t('install.privacy.privacy-content_p1')}</p>
        <p>{t('install.privacy.privacy-content_p2')}</p>
        <CheckBoxStyled>
          <CheckItem>{t('install.privacy.privacy-check_li_1')}</CheckItem>
          <CheckItem>{t('install.privacy.privacy-check_li_2')}</CheckItem>
          <CheckItem>{t('install.privacy.privacy-check_li_3')}</CheckItem>
          <CheckItem>{t('install.privacy.privacy-check_li_4')}</CheckItem>
        </CheckBoxStyled>
        <h2 className="medium-font">{t('install.privacy.privacy_subtitle')}</h2>
        <p>{t('install.privacy.privacy_description')}</p>
        <div className="options">
          <Button onClick={clickCancel}>{t('install.privacy.privacy-cancel')}</Button>

          <Button primary onClick={clickAgree}>{t('install.privacy.privacy-agree')}</Button>
        </div>
      </PrivacyPageStyled>
    </DashboardLayout>
  );
};

export default PrivacyDashboard;
