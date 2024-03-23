import { useMemo } from "react";
import styled from "styled-components";

const ButtonStyled = styled.button`
  font-family: "AvenirNext-Medium";
  cursor: pointer;
  & {
    box-shadow: 0px 0px 0px transparent;
    border: 0px solid transparent;
    text-shadow: 0px 0px 0px transparent;
  }

  &:hover {
    box-shadow: 0px 0px 0px transparent;
    border: 0px solid transparent;
    text-shadow: 0px 0px 0px transparent;
  }

  &:active {
    outline: none;
    border: none;
  }

  &:focus {
    outline: 0;
  }

  width: 140px;
  line-height: 44px;
  background: rgba(0, 255, 157, 0.12);
  color: #009f62;
  border-radius: 14px;
  font-size: 16px;
  cursor: pointer;

  &.fullWidth {
    width: 100%;
  }

  &.primary {
    background: rgba(0, 255, 157, 1);
    color: #000000;
    opacity: 1;
    &:disabled{
      opacity: 0.4;
    }
  }
  &.primaryBorder {
    border: 2px solid rgba(0, 255, 157, 1);
    color: #000000;
    background: #FFFFFF;
  }
  &.black {
    background: #000;
    color: #fff;
    opacity: 1;
  }
  &.border {
    background: #FFFFFF;
    border-radius: 14px;
    color: #000000;
    border: 2px solid #34332D;
  }
  &.import{
    display: flex;
    align-content: center;
    justify-content: center;
    gap:10px;
    width: 100%;
    background: rgba(0, 255, 157, 1);
    color: #000;
  }

`;
const Button = (props) => {
  const { fullWidth, primary,border,black,primaryBorder } = props;

  const buttonClass = useMemo(() => {
    let classes = "";
    if (fullWidth) {
      classes += "fullWidth ";
    }
    if (primary) {
      classes += "primary ";
    }
    if (border) {
      classes += "border ";
    }
    if (black) {
      classes += "black ";
    }
    if (primaryBorder) {
      classes += "primaryBorder ";
    }
    return classes;
  }, [fullWidth, primary]);
  return <ButtonStyled className={buttonClass} {...props}>{props.children}</ButtonStyled>;
};

export default Button;
