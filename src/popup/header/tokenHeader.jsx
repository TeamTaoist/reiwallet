import styled from "styled-components";
import BackImg from "../../assets/images/backToken.png";
import { useNavigate } from "react-router-dom";

const NavBox = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
  img {
    width: 18px;
    cursor: pointer;
  }
`;
const Title = styled.div`
  flex-grow: 1;
  margin-right: 48px;
  text-align: center;
  font-size: 18px;
`;

export default function TokenHeader(props) {
  const { title } = props;
  const navigate = useNavigate();

  const toBack = () => {
    navigate(-1);
  };
  return (
    <NavBox>
      <img src={BackImg} alt="" onClick={() => toBack()} />
      <Title className="medium-font">{title}</Title>
    </NavBox>
  );
}
