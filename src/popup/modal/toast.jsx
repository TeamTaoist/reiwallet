import styled from "styled-components";

const MashBox = styled.div`
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 9999999;
`;

const ToastBox = styled.div`
  background: #040404;
  border-radius: 4px;
  max-width: 80vw;
  min-width: 100px;
  width: ${(prop) => (prop.size ? prop.size : "80%")};
  box-sizing: border-box;
  border: 1px solid #040404;
  font-size: 14px;
  font-family: "AvenirNext-Medium";
  font-weight: 500;
  color: #fdfefd;
  line-height: 1.5em;
  word-break: break-all;
  padding: 10px 20px;
  text-align: center;
`;

export default function Toast(props) {
  const { tips, show, size } = props;
  return (
    <>
      {show && (
        <MashBox>
          <ToastBox size={size}>{tips}</ToastBox>
        </MashBox>
      )}
    </>
  );
}
