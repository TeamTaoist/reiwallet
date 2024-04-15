import TokenHeader from "../header/tokenHeader";
import styled from "styled-components";
import WalletImg from '../../assets/images/account/Wallet01.png';
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import PublicJs from "../../utils/publicJS";
import Avatar from "../svg/avatar/avatar";
import useWalletList from "../../useHook/useWalletList";

const Box = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
`

const SearchBox = styled.div`
    margin: 20px;
    border-radius: 16px;
    border: 1px solid #34332D;
    display: flex;
    align-items: center;
      padding:0 10px;
    input{
      border: 0;
      flex-grow: 1;
      height: 34px;
      margin: 0 10px;
      font-size: 16px;
      line-height: 20px;
      font-weight: 400;
      &:focus{
        outline: none;
      }
      &::placeholder{
        color: rgba(52, 51, 46, 0.3);
     
      }
    }
`
const Content = styled.div`
    flex-grow: 1;
    margin:10px 0 20px;
    dl{
      display: flex;
      align-items: center;
      height: 68px;
      cursor: pointer;
        padding: 0 20px;
      &:hover{
        background: #F1FCF1;
      }
    }
    .title{
        font-size: 16px;
        overflow:hidden; 
        text-overflow:ellipsis;
        width: 295px;
    }
    dt{
      margin-right: 12px;
      img{
        width: 35px;
        height: 35px;
        border-radius: 35px;
      }
    }
    dd{
      flex-grow: 1;
    }
`

const LastTitle = styled.div`
  margin-top: 22px;
  padding: 6px 27px;
  font-size: 12px;
  font-weight: 400;
  color: #34332E;
  line-height: 17px;
  background: #F5F7F7;
`

export default function Send(){
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [ keyword, setKeyword] = useState('');
    const {walletList} = useWalletList();
    const { pathname } = useLocation();
    const [url,setUrl] = useState()

    useEffect(()=>{
        switch (true){
            case pathname.indexOf("/sendDOB")>-1:
                setUrl("/dobConfirm")
                break;
            case pathname.indexOf("/sendSUDT")>-1:
                setUrl("/sudtConfirm")
                break;
            case pathname.indexOf("/sendXUDT")>-1:
                setUrl("/XudtConfirm")
                break;
            case pathname.indexOf("/sendCluster")>-1:
                setUrl("/ClusterConfirm")
                break;
            default:
                setUrl("/sendStep1")
                break;
        }


    },[pathname])


    const [ last, setLast] = useState([]);

    useEffect(() => {
        if(!walletList?.length)return;
        setLast(walletList??[])
    }, [walletList]);

    const handleInput = (e) =>{
        setKeyword(e.target.value);

    }

    const toSendPage = (str) =>{
        navigate(`${url}?sendTo=${str}`);
    }

    const handleKeyPress = (event) =>{
        if (event.key === 'Enter') {
            navigate(`${url}?sendTo=${keyword}`);
        }
    }

    return <Box>
        <TokenHeader title={t('popup.send.sendTo')} />
        <SearchBox>
            <img src={WalletImg} alt=""/>
            <input type="text" placeholder={t('popup.send.enterTips')} value={keyword} onChange={(e)=>handleInput(e)} onKeyPress={(e)=>handleKeyPress(e)} />
            {/*<img src={QRcode} alt=""/>*/}
        </SearchBox>

        <LastTitle>{t('popup.send.last')}</LastTitle>
        <Content>
        {
            last.map((item,index)=>( <dl onClick={()=>toSendPage(item.address)} key={`last_${index}`}>
                <dt>
                    <Avatar size={36} address={item?.account?.address_main} />
                </dt>

                <dd className="medium-font">
                    <div className="title">{item?.name}</div>
                    <div>{PublicJs.AddressToShow(item.address)}</div>
                </dd>
            </dl>))
        }

        </Content>
    </Box>
}
