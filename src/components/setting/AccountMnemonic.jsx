import TokenHeader from "../header/tokenHeader";
import ImportHeader from "../wallet/importWallet/ImportHeader";
import Info from "../../assets/images/create/tip.png";
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
const InputBox = styled.div`
  margin-top: 38px;
  .titleTips{
    font-size: 12px;
    color: #97A0C3;
    line-height: 16px;
    letter-spacing: 2px;
    margin-bottom: 14px;
  }
  .inputBox{
    border: 1px solid #A1ADCF;
    display: flex;
    align-items: center;
    justify-content: space-between;
    img{
      margin-right: 10px;
      cursor: pointer;
    }
    &:hover{
      border: 1px solid #000!important;
    }
  }
  dl{
    margin-bottom: 20px;
  }
`

export default function AccountMnemonic(){
    const navigate = useNavigate();
    const submit = () =>{
        navigate("/accountConfirm");
    }


    return <Box>
        <TokenHeader  />
        <ContentBox>
            <ImportHeader title="Account mnemonic" tips="If you ever change browsers or move computers, you will need this Secret Recovery Phrase to access your accounts. Save them somewhere safe and secret." />
            <InputBox>
                <div className="titleTips regular-font">Enter password to continue</div>
                <div className="inputBox">
                    <input type="text" placeholder="Please enter " />
                </div>
            </InputBox>
            <BtmBox>
                <Button  border>Cancel</Button>
                <Button  primary onClick={()=>submit()}>Next</Button>
            </BtmBox>
        </ContentBox>
    </Box>
}