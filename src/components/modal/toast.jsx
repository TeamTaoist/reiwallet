import styled from "styled-components";

const MashBox = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    z-index: 9999999;
`

const ToastBox = styled.div`
  background: #040404;
  border-radius: 4px;
    max-width: 80vw;
    box-sizing: border-box;
  border: 1px solid #040404;
  font-size: 14px;
  font-family: "AvenirNext-Medium";
  font-weight: 500;
  color: #FDFEFD;
  line-height: 1.5em;
  padding: 36px;
  text-align: center;
`

export default function Toast(props){

    const { tips,show} = props;


    return <>
        {
            show &&<MashBox><ToastBox >
                {tips}
            </ToastBox>
            </MashBox>
        }

    </>
}
