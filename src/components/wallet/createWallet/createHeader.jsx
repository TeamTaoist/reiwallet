import styled from "styled-components";

const Box = styled.div`
    padding: 20px;
`
const TitleBox = styled.div`
    display: flex;
    justify-content: space-between;
  .lft{
    font-size: 32px;
    line-height: 32px;
  }
`
const StepBox = styled.div`
  width: 60px;
  height: 27px;
  background: #000000;
  border-radius: 8px;
  color: #ffffff;
  font-size: 16px;
  line-height: 27px;
  text-align: center;
`
const Tips = styled.div`
    margin-top: 14px;
  font-size: 16px;
  line-height: 20px;
`

export default function CreateHeader(props){
    const { step, title,tips} = props
    return <Box>
        <TitleBox>
            <div className="lft medium-font">{title}</div>
            <StepBox className="medium-font">{step}</StepBox>
        </TitleBox>
        <Tips className="regular-font">{tips}</Tips>
    </Box>
}