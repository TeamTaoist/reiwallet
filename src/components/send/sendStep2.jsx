import styled from "styled-components";
import FromImg from "../../assets/images/fromTo.png";
import Avatar from "../svg/avatar/avatar";
import useBalance from "../../useHook/useBalance";
import Button from "../button/button";
import PublicJS from "../../utils/publicJS";
import useAccountAddress from "../../useHook/useAccountAddress";
import {formatUnit} from "@ckb-lumos/bi";
import {useEffect, useState} from "react";
import {BI} from "@ckb-lumos/lumos";
import {useNavigate} from "react-router-dom";

const ContentBox = styled.div`
    flex-grow: 1;
    margin: 20px 0 0;
    padding: 0 20px;
    overflow-y: auto;
`
const FirstLine = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
`
const AvatarBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap:10px;
`
const SendBox = styled.div`
    background: #fff;
    border-radius:8px;
    padding:17px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    width: 100%;
    box-sizing: border-box;
    margin: 5px 0 10px;
    font-size: 14px;
    .tit{
        font-size: 12px;
    }
    .number{
        font-size: 18px;
        font-weight: bold;
    }
`
const SymbolBox = styled.div`
    font-size: 18px;
    font-weight: 500;
`

const FeeBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
`
const TitleBox = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #34332E;
  line-height: 20px;
    width: 100%;
   margin-top: 10px;
    
`
const AddressBox = styled.div`
    background: #fff;
    border-radius:6px;
    padding:  17px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    box-sizing: border-box;
    margin: 5px 0 ;
    font-size:14px;
`

const BtnGroup = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    box-sizing: border-box;
    padding-bottom: 20px;
    button{
      width: 47%;
    }
`

export default function SendStep2({amount,address,result,sendConfirm}){
    const {symbol} = useBalance();
    const {currentAccountInfo} = useAccountAddress();
    const [fee,setFee] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {

        let inputsSum = BI.from(0)
            result?.inputs?.map((item)=>{
                //
                let capacity = BI.from(item.capacity);
                inputsSum = inputsSum.add(capacity)

            })
        let outputsSum = BI.from(0)
        result?.outputs?.map((item)=>{
            //
            let capacity = BI.from(item.capacity);
            outputsSum = outputsSum.add(capacity)

        })
        let gas = inputsSum.sub(outputsSum);
        let gasFormat = formatUnit(gas,'ckb');
        setFee(gasFormat)
    }, [result]);


    return <ContentBox>
        <FirstLine>
            <AvatarBox>
                <Avatar size={36} address={currentAccountInfo?.address} />
                <div className="name">{currentAccountInfo?.address?PublicJS.AddressToShow(currentAccountInfo?.address):""}</div>
            </AvatarBox>
            <div>
                <img src={FromImg} alt=""/>
            </div>
            <AvatarBox>
                <Avatar size={36} address={address} />
                <div className="name">{PublicJS.AddressToShow(address)}</div>
            </AvatarBox>
        </FirstLine>
        <SendBox>
            <div>
                <div className="tit">Sending</div>
                <div className="number">{amount}</div>
            </div>
            <SymbolBox>{symbol}</SymbolBox>
        </SendBox>
        <FeeBox>
            <TitleBox>Inputs</TitleBox>
            {
                result?.inputs?.map((item)=>(<AddressBox>
                    <div>{PublicJS.AddressToShow(item.address)}</div>
                    <div>{formatUnit(item.capacity,"ckb")} {symbol}</div>
                </AddressBox>))
            }

        </FeeBox>
        <FeeBox>
            <TitleBox>Outputs</TitleBox>
            {
                result?.outputs?.map((item)=>(<AddressBox>
                    <div>{PublicJS.AddressToShow(item.address)}</div>
                    <div>{formatUnit(item.capacity,"ckb")} {symbol}</div>
                </AddressBox>))
            }
        </FeeBox>

        <TitleBox>Transaction Fee</TitleBox>
        <SendBox>
            <div> </div>
            <div>{fee} {symbol} </div>
        </SendBox>
        <BtnGroup>
            <Button border onClick={()=>navigate("/")}>Reject</Button>
            <Button primary onClick={()=>sendConfirm(result?.signedTx)}>Confirm</Button>
        </BtnGroup>
    </ContentBox>
}
