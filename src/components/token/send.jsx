import TokenHeader from "../header/tokenHeader";
import styled from "styled-components";
import SearchImg from '../../assets/images/search.png';
import Demo from "../../assets/images/demo/99592461.jpeg";
import QRcode from "../../assets/images/QRcode.png";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import PublicJs from "../../utils/publicJS";
import {use} from "i18next";

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
    margin:10px 20px 20px;
    dl{
      display: flex;
      align-items: center;
      height: 68px;
      cursor: pointer;
      &:hover{
        background: #F1FCF1;
      }
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
    // const [ address] = useState('0xddAaee7F2BB6764733f43F51B406349456826662');
    const [ keyword, setKeyword] = useState('');

    const [ last, setLast] = useState([{
        address:"0xddAaee7F2BB6764733f43F51B406349456826662"
    }]);
    const [searchList,setSearchList] = useState([]);

    const handleInput = (e) =>{
        setKeyword(e.target.value);
    }

    const toSearch = () =>{
        navigate("/sendConfirm");
        // setKeyword(address)
    }
    return <Box>
        <TokenHeader title={t('popup.send.send')} />
        <SearchBox>
            <img src={SearchImg} alt=""/>
            <input type="text" placeholder={t('popup.send.searchTips')} value={keyword} onChange={()=>handleInput()} />
            {/*<img src={QRcode} alt=""/>*/}
        </SearchBox>

        <LastTitle>{t('popup.send.last')}</LastTitle>
        <Content>
        {
            !searchList.length && last.map((item,index)=>( <dl onClick={()=>toSearch()} key={`last_${index}`}>
                <dt>
                    <img src={Demo} alt=""/>
                </dt>
                <dd className="medium-font">{PublicJs.AddressToShow(item.address)}</dd>
            </dl>))
        }
        {
            !! searchList.length && searchList.map((item,index)=>( <dl onClick={()=>toSearch()} key={`search_${index}`}>
                <dt>
                    <img src={Demo} alt=""/>
                </dt>
                <dd className="medium-font">{PublicJs.AddressToShow(item.address)}</dd>
            </dl>))
        }

        </Content>
    </Box>
}