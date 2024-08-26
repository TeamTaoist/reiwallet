import styled from "styled-components";
import BackImg from "../../assets/images/back.png";
import { useNavigate } from "react-router-dom";

const ContainerStyled = styled.div`
  width: 382px;
  height: 662px;
  background: #ffffff;
  box-shadow: 0px 0px 8px 0px #e8e8e8;
  border-radius: 10px;
  border: 1px solid #f3f7f4;
  padding: 20px;
  margin: 0 auto;
  position: relative;
`;

const ContainerHeadStyled = styled.div`
  height: 20px;
  margin-bottom: 40px;
  img {
    height: 100%;
    cursor: pointer;
  }
`;

const ContainerFooterStyled = styled.div`
  width: calc(100% - 40px);
  position: absolute;
  bottom: 40px;
  left: 20px;
`;

const ContainerTitleStyled = styled.div`
  .title {
    font-size: 32px;
  }
  .sub-title {
    font-size: 16px;
    margin-top: 13px;
  }
`;

export const ContainerTitle = ({ title, subTitle }) => {
  return (
    <ContainerTitleStyled>
      <div className="title medium-font">{title}</div>
      {subTitle && <div className="sub-title">{subTitle}</div>}
    </ContainerTitleStyled>
  );
};

const ContainerLayout = ({ children, button }) => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <ContainerStyled>
      <ContainerHeadStyled>
        <img src={BackImg} alt="" onClick={goBack} />
      </ContainerHeadStyled>
      {children}
      <ContainerFooterStyled>{button}</ContainerFooterStyled>
    </ContainerStyled>
  );
};
export default ContainerLayout;
