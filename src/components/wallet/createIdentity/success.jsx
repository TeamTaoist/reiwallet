import {useTranslation} from "react-i18next";
import styled from "styled-components";
import Button from "../../button/button";
import {useNavigate} from "react-router-dom";
import Successful from "../../../assets/images/create/successful.png";
import {useEffect, useState} from "react";
import {CopyToClipboard} from "react-copy-to-clipboard";
import CopyImg from "../../../assets/images/create/COPY.png";
import Toast from "../../modal/toast";

import DashboardLayout from "../../dashboard/layout";
import ContainerLayout,{ContainerTitle} from "../../dashboard/container_layout";
import {useWeb3} from "../../../store/contracts";

const Box = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`
const ContainerContentStyled = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  position: relative;
`

const TitleBox = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 24px;
  .lft{
    font-size: 32px;
    line-height: 32px;
  }
  img{
    width: 63px;
  }
`
const Content = styled.div`
    margin-top: 40px;
  flex-grow: 1;
`

const BtmBox = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  padding:40px  20px;
  width: 100%;
`
const SubTitle = styled.div`
  font-size: 20px;
  line-height: 20px;
  margin-bottom: 20px;
  padding: 0 24px;
`
const AddressBox = styled.div`
    word-break: break-all;
  font-size: 16px;
  color: #242F57;
  line-height: 20px;
  padding: 0 24px;
  position: relative;
  img{
    width: 24px;
    display: inline-block;
    margin-bottom: -6px;
  }
`

export default function Success(){
    const { t } = useTranslation();
    const [copied,setCopied] = useState(false);
    const {state} = useWeb3();
    const { account } = state;

    const Copy = () =>{
        setCopied(true);
        setTimeout(()=>{
            setCopied(false);
        },1500);
    }

    const closeWin = () =>{
        window.close()
    }
    return <DashboardLayout>
        <ContainerLayout
            button={
                <Button primary fullWidth onClick={()=>closeWin()} >{t('popup.success.Complete')}</Button>
            }
        >
        <ContainerContentStyled>
            <TitleBox>
                <div className="lft medium-font">{t('popup.success.title')}</div>
                <img src={Successful} alt=""/>
            </TitleBox>
            <Content>
                <SubTitle className="medium-font">{t('popup.success.subTitle')}</SubTitle>
                <AddressBox className="regular-font">
                    <Toast tips="copied" left="100" bottom="-40" show={copied}/>
                    {account.address_main}
                    <CopyToClipboard onCopy={()=>Copy()} text={account}>
                        <img src={CopyImg} alt=""/>
                    </CopyToClipboard>
                </AddressBox>
            </Content>

        </ContainerContentStyled>
        </ContainerLayout>
    </DashboardLayout>
}
