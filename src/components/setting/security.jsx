import TokenHeader from "../header/tokenHeader";
import styled from "styled-components";
import Next from "../../assets/images/into.png";
import {useNavigate} from "react-router-dom";

const Content = styled.div`
    margin: 20px;
    li{
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(165, 172, 191, 0.3);
      height: 52px;
    }
`

export default function Security(){
    const navigate = useNavigate()

    const toGo = (url) =>{
        navigate(url)
    }

    return <div>
        <TokenHeader title="Security and privacy" />
        <Content>
            <ul>
                <li onClick={()=>toGo('/accountMnemonic')}>
                    <div>
                        <img src="" alt=""/>
                        <span>Mnemonic</span>
                    </div>
                    <img src={Next} alt=""/>
                </li>
            </ul>
        </Content>
    </div>
}