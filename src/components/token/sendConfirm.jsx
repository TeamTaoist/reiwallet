import TokenHeader from "../header/tokenHeader";
import styled from "styled-components";
import Button from "../button/button";
import CloseImg from "../../assets/images/close.png";
import {useEffect, useState} from "react";
import Drop from '../../assets/images/drop.png';
import Avatar from "../../assets/images/Avatar.png";
import publicJS from "../../utils/publicJS";
import CheckedNor from '../../assets/images/Check01.png';
import Checked from '../../assets/images/Check02.png';
import {useTranslation} from "react-i18next";

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
      width: 47%;
    }
`
const BtnGroup = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 37px;
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
    height: 66px;
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
  input{
    height: 44px;
    width: 100%;
    box-sizing: border-box;
    padding: 0 10px;
    border: 0;
    &:focus{
      outline: none;
    }
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
  }
`
const AccountSelect = styled.div`
  height: 66px;
  background: #FFFFFF;
  border-radius: 14px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;

`
const Item = styled.div`
    display: flex;
    align-items: center;
    .title{
      font-size: 18px;
      font-weight: 400;
      color: #34332E;
      line-height: 25px;
    }
    .address{
      font-size: 14px;
      font-weight: 400;
      color: #34332E;
      line-height: 19px;
    }
    img{
      width: 36px;
      height: 36px;
      border-radius: 36px;
      margin-right: 8px;
    }
`

const SelectBox = styled.div`
    position: absolute;
    left: 0;
    top:50px;
    z-index: 999;
    width: 342px;
    height: 248px;
    overflow-y: auto;
    background: #FFFFFF;
    box-shadow: 0px 0px 8px 0px #EDEDED;
    border-radius: 14px;
    padding: 26px 0;
    box-sizing: border-box;
    li{
      padding: 0 20px;
      height: 68px;
      display: flex;
      align-items: center;
      &:hover{
        background: #F1FCF1;
      }
    }
  .title{
    font-size: 18px;
    font-weight: 400;
    color: #34332E;
    line-height: 25px;
  }
  .address{
    font-size: 14px;
    font-weight: 400;
    color: #34332E;
    line-height: 19px;
  }
  .avatar{
    width: 24px;
    height: 24px;
    border-radius: 36px;
    margin-right: 14px;
  }
  .checked{
    width: 18px;
    margin-right: 12px;
  }
`

const BoxP= styled.div`
  position: relative;
`


export default function SendConfirm(){
    const { t } = useTranslation();

    const [ address,setAddress] = useState('');
    const [ show,setShow] = useState(false);
    const [ balance, setBalance] = useState(99.23987621);
    const [ amount, setAmount] = useState('');
    const [ seleced, setSelected] = useState({
        name:"Account1",
        img:""
    })

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


            <BoxP>
                <TitleBox>Payment account</TitleBox>
                <AccountSelect onClick={(e)=>dropDown(e)}>
                    <Item>
                        <img src={Avatar} alt=""/>
                        <div >
                            <div className="title">Account1</div>
                            <div className="address">{publicJS.AddressToShow('0xddAaee7F2BB6764733f43F51B406349456826662')}</div>
                        </div>
                    </Item>
                    <img src={Drop} alt=""/>
                </AccountSelect>
                {
                    show && <SelectBox>
                        <ul>
                            {
                                [...Array(9)].map((item,index)=>(<li key={`account_${index}`} onClick={()=>handleSelected(index)}>
                                    <img src={Checked} alt="" className="checked"/>
                                    <img src={Avatar} alt="" className="avatar"/>
                                    <div >
                                        <div className="title">Account1</div>
                                        <div className="address">{publicJS.AddressToShow('0xddAaee7F2BB6764733f43F51B406349456826662')}</div>
                                    </div>
                                </li>))
                            }

                        </ul>
                    </SelectBox>
                }

            </BoxP>


            <div>
                <TitleBox>Payment amount</TitleBox>
                <AmountBox>
                    <input type="text" value={amount} onChange={(e)=>handleAmount(e)}/>
                    <div className="rht">
                        <div className="max" onClick={()=>chooseMax()}>MAX</div>
                        <div className="balance">Balance: <span>{balance} TBNB</span></div>
                    </div>
                </AmountBox>
            </div>

            <Gas>
                <div className="item">
                    <TitleBox>Gas Price （GWEI）</TitleBox>
                    <WhiteInput>
                        <input type="number"/>
                    </WhiteInput>

                </div>
                <div className="item">
                    <TitleBox>Gas Limit</TitleBox>
                    <WhiteInput>
                        <input type="number"/>
                    </WhiteInput>
                </div>
            </Gas>
            <BtnGroup>
                <Button border>Cancel</Button>
                <Button primary>Next</Button>
            </BtnGroup>
        </ContentBox>
    </Box>
}