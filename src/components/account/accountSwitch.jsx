import styled from "styled-components";
import CheckNor from "../../assets/images/Check01.png";
import CheckAct from "../../assets/images/Check02.png";
import Del from "../../assets/images/del.png";
import Demo from '../../assets/images/demo/99592461.jpeg';
import Button from "../button/button";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {use} from "i18next";
import PublicJs from "../../utils/publicJS";

const BgBox = styled.div`
    position: absolute;
  height: 346px;
  top:80px;
  width:90%;
  background: #FFFFFF;
  box-shadow: 0px 0px 8px 0px #EDEDED;
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`
const BtnGroup = styled.div`
    position: absolute;
    left: 0;
    bottom: 0;
    display: flex;
    width:100%;
    justify-content: space-between;
    background: #fff;
    padding: 20px;
    button{
      width: 30%;
    }
`
const TitleBox = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: #34332E;
  line-height: 20px;
  height: 62px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  flex-shrink: 0;
`
const ContentBox = styled.div`
    flex-grow: 1;
    overflow-y: auto;
    ul{
      padding-bottom: 100px;
    }
    li{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      height: 68px;
      &:hover{
        background: #F1FCF1;
      }
    }
  .decr{
    width: 24px;
  }
  
`
const AccountBox = styled.div`
  flex-grow: 1;
  margin: 0 6px;
  display: flex;
  align-items: center;
  .avatar{
    width: 24px;
    border-radius: 24px;
    margin-right: 12px;
  }
  .title{
    font-size: 18px;
    font-weight: 500;
    color: #34332E;
    line-height: 20px;
  }
  .balance{
    font-size: 14px;
    font-weight: 500;
    color: #A6ACBD;
    line-height: 20px;
  }
`

export default function AccountSwitch({walletList,network,currentAccount,handleCurrent}){
    const navigate = useNavigate();
    const { t } = useTranslation();


    const toGo = (url) =>{
        navigate(url);
    }

    const createNew = async() =>{
        // const primaryKeyring = keyringController.getKeyringsByType(
        //     'HD Key Tree',
        // )[0];
        // if (!primaryKeyring) {
        //     throw new Error('MetamaskController - No HD Key Tree found');
        // }
        //
        // const keyState = await keyringController.addNewAccount(primaryKeyring);
        //
        // const accountArr = keyState.keyrings[0].accounts;
        // const newAccount = accountArr[accountArr.length-1];
        //
        // const AddressBook = {
        //     name:`Account${accountArr.length}`,
        //     address:newAccount,
        //     type:'generate',
        //     pathIndex: accountArr.length
        // }
        // /*global chrome*/
        // chrome.storage.local.get(['account'],(result)=>{
        //     console.log(result)
        //     const accountInfo = result.account;
        //     const arr = [...accountInfo,AddressBook];
        //
        //     chrome.storage.local.set({account:arr});
        //     setAccountlist(arr)
        // });

    }

    const returnAccount = (account) =>{
        if(network === "mainnet"){
            return PublicJs.AddressToShow(account.address_main)
        }else{
            return PublicJs.AddressToShow(account.address_test)
        }

    }

    return <BgBox>
        <TitleBox className="medium-font">{t('popup.switch.title')}</TitleBox>
        <ContentBox>
            <ul>
                {
                    walletList?.map((item,index)=>(<li key={index} onClick={()=>handleCurrent(index)}>
                        <img src={currentAccount=== index ? CheckAct:CheckNor} alt="" className="decr"/>
                        <AccountBox>
                            <img src={Demo} alt="" className="avatar"/>
                            <div>
                                <div className="medium-font">{item.name}</div>
                                <div className="balance medium-font">{returnAccount(item.account)}</div>
                            </div>
                        </AccountBox>
                        {/*<img src={Del} alt="" className="decr"/>*/}
                    </li>))
                }


            </ul>
        </ContentBox>
        <BtnGroup>
            <Button black onClick={()=>createNew()}>{t('popup.switch.Create')}</Button>
            <Button border onClick={()=>toGo('/privatekey')} >{t('popup.switch.Import')}</Button>
            <Button border>{t('popup.switch.Lock')}</Button>
        </BtnGroup>
    </BgBox>
}
