import TokenHeader from "../header/tokenHeader";
import styled from "styled-components";
import Checked from "../../assets/images/Checked.png";
import Remove from '../../assets/images/close.png';

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

export default function Language(){
    return <div>
        <TokenHeader title="Language switching" />
        <Content>
            <ul>
                <li>
                    <span>English</span>
                    <img src={Checked} alt=""/>
                </li>
                <li>
                    <span>中文</span>
                    <img src={Remove} alt=""/>
                </li>
            </ul>
        </Content>
    </div>
}