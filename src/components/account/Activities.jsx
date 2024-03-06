import styled from "styled-components";
import {useNavigate} from "react-router-dom";

const Box = styled.div`
  padding: 23px 20px 0;
  li{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    height: 78px;
    border-radius: 14px;
    padding: 0 22px;
    cursor: pointer;
    &:hover{
      background: #F1FCF1;
    }
    .title{
      font-weight: 500;
    }
    .time{
      font-size: 14px;
      color: #00A554;
      line-height: 20px;
      margin-right: 7px;
    }
    .web{
      font-size: 14px;
      color: #A6ACBD;
      line-height: 20px;
    }
    .item{
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
`

export default function Activities(){
    const navigate = useNavigate();

    const toDetail = () =>{
        navigate('/sendDetail')
    }

    return <Box>
        <ul>
            {
                // [...Array(8)].map((item,index)=>(<li key={index} onClick={()=>toDetail()}>
                //     <div className="item">
                //         <div className="medium-font title">Approve Token spend…</div>
                //         <div className="medium-font title">-0 TBNB</div>
                //
                //     </div>
                //     <div className="item">
                //         <div><span className="time">Apr28</span> <span className="web">localhost:3000</span></div>
                //         <div><span className="web">-0 TBNB</span></div>
                //     </div>
                //
                // </li>))
            }
        </ul>
    </Box>
}