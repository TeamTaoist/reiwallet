import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import styled from "styled-components";

import DashboardLayout from "../../dashboard/layout";
import Button from "../../button/button";
import ContainerLayout,{ContainerTitle} from "../../dashboard/container_layout";

// import DownloadImg from '../../../assets/images/create/download.png';
import UncheckedImg from "../../../assets/images/create/unCheck.png";
import CheckedImg from '../../../assets/images/create/unCheck02.png';
import {useTranslation} from "react-i18next";
import {useWeb3} from "../../../store/contracts";
import Wallet from "../../../wallet/wallet";


const ContainerContentStyled = styled.div`
    position: relative;
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

const Restore = styled.div`
  position: absolute;
  right: 0;
  top:14px;
  font-size: 16px;
  color: #0051FF;
  line-height: 20px;
  cursor: pointer;
`

export default function Mnemonics(){
    const[checked,setChecked] = useState(false);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [ mnemonicStr, setMnemonicStr] = useState([]);
    const {dispatch,state:{mnemonic}} = useWeb3();

    useEffect(() => {
        if ( mnemonic == null){
            creatWallet(0)
        }else{
            setMnemonicStr(mnemonic)
        }

    }, [mnemonic]);

    const creatWallet = async (index) =>{
        const wallet = new Wallet(index,true,false);
        let walletObj = await wallet.GenerateWallet();
        const {address_main,address_test,mnemonic,publicKey} = walletObj;
        const mnemonicArr = mnemonic.split(' ');
        setMnemonicStr(mnemonicArr);
        dispatch({type:'SET_MNEMONIC',payload:mnemonicArr});
        dispatch({type:"SET_ACCOUNT",payload:{address_main,address_test,publicKey}});
    }


    const next = () =>{
        navigate('/confirmation');
    }
    // const download = () =>{
    //     navigate('/download');
    // }
    const handleSelected = () =>{
        setChecked(!checked)
    }

    const restore = () =>{
        navigate('/restore');
    }


    return <DashboardLayout>
        <ContainerLayout
            button={
                <Button primary fullWidth onClick={()=>next()} disabled={!checked}>{t('install.create.mnemonic.next')}</Button>
            }
        >
            <ContainerContentStyled>
                <Restore className="regular-font"  onClick={()=>restore()}>
                    {t('install.create.create.restore')}
                </Restore>
                <ContainerTitle
                    title={t('install.create.mnemonic.mnemonic_title')}
                    subTitle={t('install.create.mnemonic.mnemonic_tips')}
                />
                <ContentBox className="regular-font">

                    <div>
                        {/*<div className="download" onClick={()=>download()} >*/}
                        {/*    <img src={DownloadImg} alt=""/>*/}
                        {/*</div>*/}

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
