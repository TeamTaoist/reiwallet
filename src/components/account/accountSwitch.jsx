import styled from "styled-components";
import CheckNor from "../../assets/images/Check01.png";
import CheckAct from "../../assets/images/Check02.png";
import Button from "../button/button";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import PublicJs from "../../utils/publicJS";
import useAccountAddress from "../../useHook/useAccountAddress";
import Avatar from "../svg/avatar/avatar";

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
      width: 49%;
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
    .tagBox{
        margin-left: 10px;
        background: #00ff9d;
        color: #000;
        border-radius: 8px;
        font-size: 10px;
        padding: 0 10px;
    }
`

export default function AccountSwitch({currentAccount,handleCurrent,handleNew}){
    const navigate = useNavigate();
    const { t } = useTranslation();
    const {accountList} = useAccountAddress();

    const toGo = (url) =>{
        navigate(url);
    }

    return <BgBox>
        <TitleBox className="medium-font">{t('popup.switch.title')}</TitleBox>
        <ContentBox>
            <ul>
                {
                    accountList?.map((item,index)=>(<li key={index} onClick={()=>handleCurrent(index)}>
                        <img src={currentAccount=== index ? CheckAct:CheckNor} alt="" className="decr"/>
                        <AccountBox>
                            <div className="avatar">
                                <Avatar size={24} address={item.address} />
                            </div>
                            <div>
                                <div className="medium-font">{item.name}
                                    {item.type === "import" && <span className="tagBox">{item.type}</span>}</div>
                                <div className="balance medium-font">{PublicJs.AddressToShow(item.address)}</div>
                            </div>
                        </AccountBox>
                        {/*<img src={Del} alt="" className="decr"/>*/}
                    </li>))
                }


            </ul>
        </ContentBox>
        <BtnGroup>
            <Button black onClick={()=>handleNew()}>{t('popup.switch.Create')}</Button>
            <Button border onClick={()=>toGo('/privatekey')} >{t('popup.switch.Import')}</Button>
        </BtnGroup>
    </BgBox>
}
