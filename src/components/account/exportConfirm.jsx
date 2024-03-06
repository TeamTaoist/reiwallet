import AllModal from "../modal/AllModal";
import styled from "styled-components";
import Button from "../button/button";
import TipImg from "../../assets/images/create/tip.png";

const Content = styled.div`
  .titleTips{
    font-size: 12px;
    color: #97A0C3;
    line-height: 16px;
    letter-spacing: 2px;
  }
`

const BtnGroup = styled.div`
    margin-top: 50px;
`

const BoxText = styled.div`
  margin-top: 13px;
  height: 130px;
  background: #FCFEFA;
  border-radius: 14px;
  border: 1px solid #000000;
  textarea{
    background: transparent;
    width: 100%;
    height: 130px;
    box-sizing: border-box;
    padding: 20px 25px;
    border: 0;
    resize: none;
    font-size: 14px;
    font-family: AvenirNext-Regular, AvenirNext;
    font-weight: 400;
    color: #212F5A;
    line-height: 19px;
    &:focus{
      outline: none;
    }
  }
`
const TipsBox = styled.div`
  display: flex;
  align-items: flex-start;
  margin-top: 15px;
  img{
    margin-right: 7px;
  }
  div{
    font-size: 14px;
    line-height: 20px;
  }
`

export default function ExportConfirm(){
    const copy = () =>{

    }

    return <AllModal title="Export  Account" link="/home">
        <Content>
            <div>
                <div className="titleTips regular-font">
                    This is your private key
                </div>
                <BoxText >
                    <textarea />
                </BoxText>
            </div>
            <TipsBox>
                <img src={TipImg} alt=""/>
                <div className="regular-font">
                    Never disclose this key. Anyone with your private keys can steal any assets held in your account.
                </div>
            </TipsBox>
            <BtnGroup>
                <Button fullWidth black onClick={()=>copy()}>Copy</Button>
            </BtnGroup>
        </Content>
    </AllModal>
}