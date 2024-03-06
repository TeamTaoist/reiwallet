import TokenHeader from "../header/tokenHeader";
import styled from "styled-components";
import Demo from "../../assets/images/demo/99592461.jpeg";
import From from "../../assets/images/fromTo.png";

const Box = styled.div`

`

const Content = styled.div`
  margin: 20px;
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
    margin: 30px 0;
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
    margin-top: 30px;
    display: flex;
    justify-content: space-between;
`

export default function SendDetail(){
    return <Box>
        <TokenHeader title="Send details" />
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
                <dt className="medium-font">Noce</dt>
                <dd>1</dd>
            </dl>
            <dl>
                <dt className="medium-font">Amount</dt>
                <dd>1</dd>
            </dl>
            <dl>
                <dt className="medium-font">Gas Limit(Units)</dt>
                <dd>1</dd>
            </dl>
            <dl>
                <dt className="medium-font">Gas Used(Units)</dt>
                <dd>1</dd>
            </dl>
            <dl>
                <dt className="medium-font">Gas price</dt>
                <dd>1</dd>
            </dl>
            <dl>
                <dt className="medium-font">Total</dt>
                <dd>1</dd>
            </dl>
        </Content>
    </Box>
}