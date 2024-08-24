import styled from "styled-components";
import BackImg from "../../assets/images/back.png";
import {useNavigate} from "react-router-dom";

const NavBox = styled.div`
    display: flex;
  align-items: center;
  padding: 20px;
  img{
    width: 24px;
    cursor: pointer;
  }
`
const Title = styled.div`
    flex-grow: 1;
  margin-right: 48px;
  text-align: center;
`

export default function NavHeader(props){
    const {title} =props;
    const navigate = useNavigate();

    const toBack = () =>{
        navigate(-1)
    }
    return <NavBox>
        <img src={BackImg} alt="" onClick={()=>toBack()}/>
        <Title className="medium-font">
            {title}
        </Title>
    </NavBox>
}