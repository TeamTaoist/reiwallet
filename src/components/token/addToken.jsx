import TokenHeader from "../header/tokenHeader";
import styled from "styled-components";
import SearchImg from '../../assets/images/search.png';
import Demo from "../../assets/images/demo/99592461.jpeg";

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
    margin: 20px;
    dl{
      display: flex;
      align-items: center;
      height: 68px;
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
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  .title{
    font-size: 16px;
    font-weight: 500;
    color: #000000;
    line-height: 22px;
  }
  .tips{
    font-size: 12px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.4);
    line-height: 17px;
  }
  .num{
    font-size: 12px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.4);
    line-height: 17px;
  }
`

export default function AddToken(){
    return <Box>
        <TokenHeader title="Add Token" />
        <SearchBox>
            <img src={SearchImg} alt=""/>
            <input type="text" placeholder="Please search"/>
        </SearchBox>
        <Content>
            {
                [...Array(4)].map((item,index)=>(<dl key={index}>
                    <dt>
                        <img src={Demo} alt=""/>
                    </dt>
                    <dd>
                        <div>
                            <div className="medium-font title">ETH</div>
                            <div className="tips">Ether</div>
                        </div>
                        <div className="num">0</div>
                    </dd>
                </dl>))
            }

        </Content>
    </Box>
}