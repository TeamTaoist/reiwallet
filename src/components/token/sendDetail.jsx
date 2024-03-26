
import styled from "styled-components";
import Demo from "../../assets/images/demo/99592461.jpeg";
import From from "../../assets/images/fromTo.png";
import Button from "../button/button";

const Box = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.3);
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999;
`

const Content = styled.div`
    box-sizing: border-box;
    padding:20px;
    background: #fff;
    border-radius: 14px;
    width: 90vw;
    dl{
      height: 46px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    dt{
      font-size: 16px;
      font-weight: 500;
      color: #242F57;
      line-height: 20px;
    }
    dd{
      font-size: 16px;
      font-weight: 400;
      color: rgba(36, 47, 87, 0.7);
      line-height: 20px;
    }
`
const FromTo = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px 0;
    .avatar{
      width: 35px;
      height: 35px;
      border-radius: 35px;
      margin-right: 8px;
    }
    .one{
      display: flex;
      align-items: center;
    }
`
const TitleBox = styled.div`
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
`
const BtnBox = styled.div`
    padding: 20px;
    width: 100%;
    box-sizing: border-box;
`

export default function SendDetail({handleShowClose}){
    return <Box>
        <Content>
            <dl>
                <dt className="medium-font">Trading time</dt>
                <dd>2022-04-28  13:34</dd>
            </dl>
            <dl>
                <dt className="medium-font">Status</dt>
                <dd>View on block explorer</dd>
            </dl>
            <TitleBox>
                <div className="medium-font">From</div>
                <div className="medium-font">To</div>
            </TitleBox>
            <FromTo>
                <div className="one">
                    <img src={Demo} alt="" className="avatar"/>
                    <span className="medium-font">0x23…8867</span>
                </div>
                <img src={From} alt=""/>
                <div className="one">
                    <img src={Demo} alt="" className="avatar"/>
                    <span className="medium-font">0x23…8867</span>
                </div>

            </FromTo>
            <dl>
                <dt className="medium-font">Amount</dt>
                <dd>1</dd>
            </dl>
            <dl>
                <dt className="medium-font">Gas</dt>
                <dd>1</dd>
            </dl>
            <dl>
                <dt className="medium-font">Total</dt>
                <dd>1</dd>
            </dl>
            <BtnBox>
                <Button primary fullWidth onClick={()=>handleShowClose()} >Close</Button>
            </BtnBox>
        </Content>


    </Box>
}
