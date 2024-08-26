import styled from "styled-components";

const Box = styled.div``;
const TitleBox = styled.div`
  display: flex;
  .lft {
    font-size: 32px;
    line-height: 32px;
  }
`;
// const StepBox = styled.div`
//   width: 60px;
//   height: 27px;
//   background: #000000;
//   border-radius: 8px;
//   color: #ffffff;
//   font-size: 16px;
//   line-height: 27px;
//   text-align: center;
// `
const Tips = styled.div`
  margin-top: 14px;
  font-size: 16px;
  line-height: 20px;
`;

export default function ImportHeader(props) {
  const { title, tips } = props;
  return (
    <Box>
      <TitleBox>
        <div className="lft medium-font">{title}</div>
      </TitleBox>
      <Tips className="regular-font">{tips}</Tips>
    </Box>
  );
}
