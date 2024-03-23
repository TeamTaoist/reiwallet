import TokenHeader from "../header/tokenHeader";
import ImportHeader from "../wallet/importWallet/ImportHeader";
import Info from "../../assets/images/info.png";
import Button from "../button/button";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import Wallet from "../../wallet/wallet";
import useCurrentAccount from "../../useHook/useCurrentAccount";
import useNetwork from "../../useHook/useNetwork";
import Loading from "../loading/loading";
import {CopyToClipboard} from "react-copy-to-clipboard";
import Toast from "../modal/toast";

const Box = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
`

const ContentBox = styled.div`
  flex-grow: 1;
  padding: 20px;
  height: 100%;
  position: relative;
`
const BtmBox = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  padding: 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  background: #FFFFFF;
  button{
    width: 47%;
  }
`
const TextBox = styled.div`
  min-height: 130px;
  background: #F1FCF1;
  border-radius: 14px;
  padding: 21px 5px 20px 25px;
  margin: 20px auto 10px;
  position: relative;
  display: flex;
  flex-wrap: wrap;
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

const TipsBox = styled.div`
  display: flex;
  align-items: flex-start;
  margin-top: 22px;
  img{
    margin-right: 7px;
  }
  div{
    font-size: 14px;
    line-height: 20px;
    color: #C9233A;
  }
`


export default function AccountConfirm(){
    const navigate = useNavigate();
    const {currentAccount} = useCurrentAccount();
    const {network} = useNetwork();
    const [mnemonic,setMnemonic] = useState([]);
    const [loading , setLoading] = useState(true);
    const [copied,setCopied] = useState(false);

    useEffect(() => {
        if(currentAccount==="" || network === "")return;
        getMnemonic()

    }, [currentAccount]);

    useEffect(() => {
        if(mnemonic?.length) {
            setLoading(false)
        }

    }, [mnemonic]);

    const getMnemonic = async() =>{
        /*global chrome*/
        const wallet = new Wallet(currentAccount,network ==="mainnet",true);
        let result = await  wallet.exportMnemonic();
        const str = result.split(" ")
        setMnemonic(str);
    }


    const Copy = () =>{
        setCopied(true);
        setTimeout(()=>{
            setCopied(false);
        },1500);
    }


    return <Box>

        {
            loading && <Loading showBg={true} />
        }
        <Toast tips="copied" left="140" bottom="400" show={copied}/>
        <TokenHeader  />
        <ContentBox>
            <ImportHeader title="Account mnemonic" tips="If you ever change browsers or move computers, you will need this Secret Recovery Phrase to access your accounts. Save them somewhere safe and secret." />
            <TextBox className="regular-font">
                {
                    mnemonic.map((item,index)=>(<span key={index}>{item}</span>))
                }
            </TextBox>
            <TipsBox>
                <img src={Info} alt=""/>
                <div className="regular-font">
                    DO NOT share this phrase with anyone!
                    These words can be used to steal all your accounts.
                </div>
            </TipsBox>
            <BtmBox>

                <Button  border  onClick={()=>navigate("/")}>Cancel</Button>

            <CopyToClipboard onCopy={()=>Copy()} text={mnemonic.join(" ")}>
                <Button  primary onClick={()=>Copy()}>Copy Mnemonic</Button>
            </CopyToClipboard>
            </BtmBox>
        </ContentBox>
    </Box>
}
