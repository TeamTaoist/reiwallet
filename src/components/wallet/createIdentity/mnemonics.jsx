import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import styled from "styled-components";

import DashboardLayout from "../../dashboard/layout";
import Button from "../../button/button";
import ContainerLayout,{ContainerTitle} from "../../dashboard/container_layout";

import DownloadImg from '../../../assets/images/create/download.png';
import UncheckedImg from "../../../assets/images/create/unCheck.png";
import CheckedImg from '../../../assets/images/create/unCheck02.png';
import {useTranslation} from "react-i18next";


const ContainerContentStyled = styled.div`
  .title{
    margin-right: 51px;
  }
`

const ContentBox = styled.div`
    min-height: 130px;
    background: #F1FCF1;
    border-radius: 14px;
    padding: 21px 5px 20px 25px;
    margin: 20px auto 10px;
    position: relative;
      &>div{
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
      }
    span{
      padding:0 17px 10px 0;
    }
    .download{
      width: 24px;
      position: absolute;
      right: 10px;
      bottom: 10px;
      img{
        width: 100%;
      }
    }
`
const SelectBox = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    img{
      width: 24px;
      margin-right: 6px;
    }
`

export default function Mnemonics(){
    const[checked,setChecked] = useState(false);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [ mnemonicStr, setMnemonicStr] = useState([]);


    const next = () =>{
        navigate('/confirmation');
    }
    const download = () =>{
        navigate('/download');
    }
    const handleSelected = () =>{
        setChecked(!checked)
    }
    return <DashboardLayout>
        <ContainerLayout
            button={
                <Button primary fullWidth onClick={()=>next()} disabled={!checked}>{t('install.create.mnemonic.next')}</Button>
            }
        >
            <ContainerContentStyled>
                <ContainerTitle
                    title={t('install.create.mnemonic.mnemonic_title')}
                    subTitle={t('install.create.mnemonic.mnemonic_tips')}
                />
                <ContentBox className="regular-font">
                    <div>
                        <div className="download" onClick={()=>download()} >
                            <img src={DownloadImg} alt=""/>
                        </div>

                        {
                            mnemonicStr.map((item,index)=>(<span key={index}>{item}</span>))
                        }
                    </div>


                </ContentBox>
                <SelectBox onClick={()=>handleSelected()}>
                    <img src={ checked ? CheckedImg : UncheckedImg } alt=""/>
                    {t('install.create.mnemonic.mnemonic_label')}
                </SelectBox>
            </ContainerContentStyled>
        </ContainerLayout>
    </DashboardLayout>
}
