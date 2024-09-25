import styled from "styled-components";
import CloseImg from "../../assets/images/close.png";
import { useNavigate } from "react-router-dom";

const Box = styled.div`
  width: 100%;
  height: 100vh;
  background: #f9fafa;
  box-shadow: 0px 0px 8px 0px #e8e8e8;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const TitleBox = styled.div`
  padding-bottom: 24px;
  display: flex;
  align-items: center;
  img {
    width: 24px;
    cursor: pointer;
  }
  .title {
    margin-right: 24px;
    text-align: center;
    width: 100%;
    font-size: 18px;
    color: #34332e;
    line-height: 20px;
  }
`;

const ContentBox = styled.div`
  flex-grow: 1;
  width: 100%;
  background: #ffffff;
  box-shadow: 0px 0px 6px 0px rgba(234, 234, 234, 0.66);
  border-radius: 14px;
  padding: 26px 20px;
`;

export default function AllModal(props) {
  const { children, title, link } = props;
  const navigate = useNavigate();

  const CloseModal = () => {
    navigate(link);
  };
  return (
    <Box>
      <TitleBox>
        <img src={CloseImg} alt="" onClick={() => CloseModal()} />
        <div className="title medium-font">{title}</div>
      </TitleBox>
      <ContentBox>{children}</ContentBox>
    </Box>
  );
}
