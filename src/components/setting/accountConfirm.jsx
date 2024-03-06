import TokenHeader from "../header/tokenHeader";
import ImportHeader from "../wallet/importWallet/ImportHeader";
import Info from "../../assets/images/info.png";
import Button from "../button/button";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";

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
    const submit = () =>{
        navigate("/accountConfirm");
    }


    return <Box>
        <TokenHeader  />
        <ContentBox>
            <ImportHeader title="Account mnemonic" tips="If you ever change browsers or move computers, you will need this Secret Recovery Phrase to access your accounts. Save them somewhere safe and secret." />
            <TextBox className="regular-font">
                {
                    [...Array(12)].map((item,index)=>(<span key={index}>test</span>))
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
                <Button  border>Cancel</Button>
                <Button  primary onClick={()=>submit()}>Copy Mnemonic</Button>
            </BtmBox>
        </ContentBox>
    </Box>
}