import AllModal from "../modal/AllModal";
import styled from "styled-components";
import Button from "../button/button";
import TipImg from "../../assets/images/create/tip.png";
import {useEffect, useState} from "react";
import useCurrentAccount from "../../useHook/useCurrentAccount";
import Wallet from "../../wallet/wallet";
import useNetwork from "../../useHook/useNetwork";
import Loading from "../loading/loading";
import useAccountAddress from "../../useHook/useAccountAddress";
import Keystore from "../../wallet/keystore";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import Toast from "../modal/toast";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {clearPassword, getPassword} from "../../wallet/password";

const Content = styled.div`
  .titleTips{
    font-size: 12px;
    color: #97A0C3;
    line-height: 16px;
    letter-spacing: 2px;
  }
`

const BtnGroup = styled.div`
    margin-top: 50px;
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
const TipsBox = styled.div`
  display: flex;
  align-items: flex-start;
  margin-top: 15px;
  img{
    margin-right: 7px;
  }
  div{
    font-size: 14px;
    line-height: 20px;
  }
`

export default function ExportConfirm(){
    const { t } = useTranslation();
    const {currentAccount} = useCurrentAccount();
    const {network} = useNetwork();
    const {currentAccountInfo} = useAccountAddress();
    const [py,setPy] = useState('');
    const [loading , setLoading] = useState(true);
    const navigate = useNavigate();
    const [copied,setCopied] = useState(false);

    useEffect(() => {
        if(!network || currentAccount === '' || !currentAccountInfo)return;
        handlePrivate()
    }, [network,currentAccount,currentAccountInfo]);

    useEffect(() => {
        if(py) {
            setLoading(false)
        }

    }, [py]);

    const handlePrivate = () =>{
        const {type,account_index,privateKey}= currentAccountInfo;
        if(type === "create"){
            getPrivateKey(account_index)
        }else{
            decryptPrivatekey(privateKey)
        }
    }

    const decryptPrivatekey = async(privateKey) => {
        try {
            /*global chrome*/
            let result = await getPassword();
            if (result) {
                let str = await Keystore.decrypt(result,privateKey);
                setPy(str)
            } else {
                clearPassword()
                navigate("/");
            }
        } catch (e) {
            console.error(e)
        }

    }

    const getPrivateKey = async(account_index) =>{
        try{
            const wallet = new Wallet(currentAccount,network==="mainnet",true);
            let walletStr = await wallet.ExportPrivateKey(account_index);
            setPy(walletStr)

        }catch (e) {
            console.error(e)

        }

    }
    const Copy = () =>{
        setCopied(true);
        setTimeout(()=>{
            setCopied(false);
        },1500);
    }

    return <AllModal title={t('popup.export.Export')} link="/home">
        {
            loading && <Loading showBg={true} />
        }
        <Toast tips="copied" size={20} show={copied}/>
        <Content>
            <div>
                <div className="titleTips regular-font">
                    {t('popup.export.privateTips')}
                </div>
                <BoxText >
                    <textarea  readOnly={true} value={py}/>
                </BoxText>
            </div>
            <TipsBox>
                <img src={TipImg} alt=""/>
                <div className="regular-font">
                    {t('popup.export.passwordTips')}
                </div>
            </TipsBox>

            <BtnGroup>
                <CopyToClipboard onCopy={()=>Copy()} text={py}>
                <Button fullWidth black >{t('popup.export.Copy')}</Button>
                </CopyToClipboard>
            </BtnGroup>
        </Content>
    </AllModal>
}
