import styled from "styled-components";
import Next from "../../assets/images/into.png"
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

const Box = styled.div`
  padding: 23px 20px;
  li{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 68px;
    border-radius: 14px;
    padding: 0 27px;
    cursor: pointer;
    &:hover{
      background: #F1FCF1;
    }
    span{
      font-size: 18px;
      font-weight: 500;
      color: #000000;
      line-height: 25px;
    }
  }
`
const AddToken = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #00A25C;
  line-height: 22px;
  margin-top: 12px;
  padding: 0 27px;
`

export default function Assets(){
    const navigate = useNavigate();
    const { t } = useTranslation();
    const add = () =>{
        navigate("/addToken");
    }
    const toDetail = () =>{
        navigate("/assetDetail");
    }

    return <Box>
        <ul>
            {
                [...Array(8)].map((item,index)=>(<li key={index} onClick={()=>toDetail()}>
                    <span className="medium-font">0.5654 ETH</span>
                    <img src={Next} alt=""/>
                </li>))
            }
        </ul>
        <AddToken onClick={()=>add()}>
            {t('popup.account.AddToken')}
        </AddToken>
    </Box>
}
