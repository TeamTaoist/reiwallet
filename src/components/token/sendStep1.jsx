import TokenHeader from "../header/tokenHeader";
import styled from "styled-components";
import Button from "../button/button";
import CloseImg from "../../assets/images/close.png";
import {useEffect, useState} from "react";

import {useTranslation} from "react-i18next";
import {useNavigate, useSearchParams} from "react-router-dom";
import {formatUnit} from "@ckb-lumos/bi";
import useMessage from "../../useHook/useMessage";
import useBalance from "../../useHook/useBalance";
import BtnLoading from "../loading/btnloading";
// import {commons} from "@ckb-lumos/lumos";

import {commons, config, hd, helpers, Indexer, RPC} from "@ckb-lumos/lumos";
import useNetwork from "../../useHook/useNetwork";

const Box = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: #F9FAFA;
`

const ContentBox = styled.div`
    flex-grow: 1;
    margin: 20px;
`
const TitleBox = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #34332E;
  line-height: 20px;
  margin-bottom: 10px;
`

const Gas = styled.div`
    display: flex;
    justify-content: space-between;
    .item{
      width: 100%;
        margin-bottom: 20px;
    }
`
const BtnGroup = styled.div`
    display: flex;
    position: absolute;
    left: 0;
    bottom: 20px;
    justify-content: space-between;
    width: 100%;
    box-sizing: border-box;
    padding: 0 20px;
    button{
      width: 47%;
    }
`

const SendInput = styled.div`
  background: #F1FCF1;
  border-radius: 14px;
  border: 1px solid #62BA46;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  margin-bottom: 10px;
  textarea{
    resize: none;
    height: 95px;
    padding: 15px;
    flex-grow: 1;
    border: 0;
    background: transparent;
    &:focus{
      outline: none;
    }
  }
  img{
    margin: 18px;
    cursor: pointer;
  }
`
const WhiteInput = styled.div`
  overflow: hidden;
  background: #FFFFFF;
  border-radius: 14px;
    padding: 20px;
    display: flex;
    align-content: center;
    justify-content: space-between;

    .title{
        font-size: 12px;
        line-height: 28px;
    }
    .num{
       font-weight: bold;
        line-height: 28px;
        span{
            font-size: 16px;
        }
    }
    .tips{
        font-size: 10px;
    }
    
`

const AmountBox = styled.div`
  overflow: hidden;
  background: #FFFFFF;
  border-radius: 14px;
  height: 66px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  input{
    flex-grow: 1;
    width: 100%;
    box-sizing: border-box;
    padding: 0 10px;
    border: 0;
    font-size: 18px;
    font-weight: 500;
    color: #34332E;
    line-height: 66px;
    &:focus{
      outline: none;
    }
  }
  .rht{
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    margin-right: 20px;
  }
  .max{
    width: 48px;
    height: 24px;
    background: #00FF9D;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 400;
    color: #000000;
    line-height: 24px;
    text-align: center;
    margin-bottom: 6px;
  }
  .balance{
    font-size: 12px;
    font-weight: 400;
    color: #8897B1;
    line-height: 16px;
    white-space: nowrap;
      display: flex;
      align-content: center;
      justify-content: center;
      span{
          display: flex;
          align-content: center;
          justify-content: center;
          gap: 5px;
      }
  }
`



export default function SendStep1(){
    const { t } = useTranslation();
    const [search] = useSearchParams();
    const sendTo = search.get("sendTo");
    const navigate = useNavigate();
    const [ address,setAddress] = useState('');
    const [ show,setShow] = useState(false);
    const {balance,balanceLoading,symbol} = useBalance();
    const [fee,setFee] = useState('')
    const [gas,setGas]= useState('')
    const [ amount, setAmount] = useState('');


    useEffect(() => {
        setAddress(sendTo)
    }, [sendTo]);

    useEffect(() => {

        toBackground()
        const timer = setInterval(()=>{
            toBackground()
        },2000)

        return () =>{
            clearInterval(timer)
        }

    }, []);

    const handleEvent = (message) => {
        const {type }= message;
        if(type ==="get_feeRate_success"){
            const {mean} = message.data;
            let rt = formatUnit(mean,"shannon")
            setFee(rt)
        }else if(type === "send_transaction_success"){
            const rt = message.data;
            navigate("/");
            console.error("====send_transaction_success=",rt)
        }
    }

    const {sendMsg} = useMessage(handleEvent,[]);


    const toBackground = () =>{
        let obj ={
            method:"get_feeRate",
        }
        sendMsg(obj)
    }

    const handleInput = (e)=>{
        setAddress(e.target.value)
    }
    const ClearInput = () =>{
        setAddress('')
    }
    useEffect(() => {
        document.addEventListener("click", (e) =>{
            setShow(false)

        });
    }, [])

    const stopPropagation = (e) => {
        e.nativeEvent.stopImmediatePropagation();
    }
    const dropDown = (e) =>{
        stopPropagation(e)
        setShow(true)
    }

    const handleSelected = () =>{
        setShow(false)
    }

    const chooseMax = () =>{
        setAmount(balance)
    }
    const handleAmount = (e) =>{
        setAmount(e.target.value);
    }

    const toDetail = async() =>{
        let obj ={
            method:"send_transaction",
            to:address,
            amount,
            fee
        }
        sendMsg(obj)



        // config.initializeConfig(config.predefined.AGGRON4);
        // const indexer = new Indexer("https://testnet.ckb.dev/indexer", "https://testnet.ckb.dev/rpc");
        // console.log(indexer)
        //
        //
        // let txSkeleton = helpers.TransactionSkeleton({ cellProvider: indexer });
        //
        // console.log("=txSkeleton====",txSkeleton)
        //
        // const ALICE_ADDRESS = "ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqfqlfe506g2rl6e64cmsx80pqn74uev6dgwr0s62"
        // const BOB_ADDRESS = "ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqf5kmkgn25z8xajscwkw88ew3hagjfd5uqttnscm"
        // const ALICE_PRIVATE_KEY = "0x037fbb5dde1730ac91b1c77d70f0a979222f8ab5f47494f33b06103974922a97"
        //
        //
        // const aaaaddress = helpers.encodeToConfigAddress(hd.key.privateKeyToBlake160(ALICE_PRIVATE_KEY), "SECP256K1_BLAKE160");
        // const aaaaddressScritp = helpers.parseAddress(aaaaddress);
        //
        //
        //
        // txSkeleton = await commons.common.transfer(txSkeleton, [ALICE_ADDRESS], BOB_ADDRESS, 100e8);
        //
        // // // https://github.com/nervosnetwork/ckb/blob/develop/util/app-config/src/legacy/tx_pool.rs#L9
        // // // const DEFAULT_MIN_FEE_RATE: FeeRate = FeeRate::from_u64(1000);
        // txSkeleton = await commons.common.payFeeByFeeRate(txSkeleton, [ALICE_ADDRESS], 30000 /*fee_rate*/);
        //
        // txSkeleton = commons.common.prepareSigningEntries(txSkeleton);
        //
        //
        // const signatures = txSkeleton
        //     .get("signingEntries")
        //     .map((entry) => hd.key.signRecoverable(entry.message, ALICE_PRIVATE_KEY))
        //     .toArray();
        //
        // const signedTx = helpers.sealTransaction(txSkeleton, signatures);
        // const rpc = new RPC("https://testnet.ckb.dev/rpc");
        //
        // console.log("===rpc===",signedTx)
        // const txHash = await rpc.sendTransaction(signedTx);
        // console.log(`Go to explorer to check the sent transaction https://pudge.explorer.nervos.org/transaction/${txHash}`);

        // navigate("/sendDetail");
        // setKeyword(address)
    }

    return <Box>
        <TokenHeader title={t('popup.send.send')} />
        <ContentBox>
            <div>
                <TitleBox>Send to</TitleBox>
                <SendInput>
                    <textarea name="" value={address} onChange={(e)=>handleInput(e)} />
                    {
                        !!address.length &&<img src={CloseImg} alt="" onClick={()=>ClearInput()}/>
                    }
                </SendInput>
            </div>
            <div>
                <TitleBox>Payment amount</TitleBox>
                <AmountBox>
                    <input type="text" value={amount} onChange={(e)=>handleAmount(e)}/>
                    <div className="rht">
                        <div className="max" onClick={()=>chooseMax()}>MAX</div>
                        <div className="balance">Balance: <span>
                            {
                                balanceLoading && <BtnLoading color="#00FF9D" />
                            }
                            {balance} {symbol}</span></div>
                    </div>
                </AmountBox>
            </div>

            <Gas>
                <div className="item">
                    <WhiteInput>
                        <div className="title">Estimated Fee</div>
                        <div className="num"><span>{fee}</span> shannons/kB</div>
                    </WhiteInput>
                </div>
            </Gas>
            <BtnGroup>
                <Button border>Cancel</Button>
                <Button primary onClick={()=>toDetail()}>Next</Button>
            </BtnGroup>
        </ContentBox>
    </Box>
}
