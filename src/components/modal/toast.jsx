import styled from "styled-components";
import {useEffect} from "react";

const ToastBox = styled.div`
  position: absolute;
  left: ${ props => props.left+'px'};
  bottom:${ props => props.bottom+'px'};;
  background: #040404;
  border-radius: 4px;
  border: 1px solid #040404;
  font-size: 14px;
  font-family: "AvenirNext-Medium";
  font-weight: 500;
  color: #FDFEFD;
  line-height: 40px;
  padding: 0 36px;
  text-align: center;
  z-index: 9999999;
  white-space: nowrap;
`

export default function Toast(props){

    const { left, bottom, tips,show} = props;


    return <div>
        {
            show && <ToastBox left={left} bottom={bottom}>
                {tips}
            </ToastBox>
        }

    </div>
}