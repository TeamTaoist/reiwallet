import styled from "styled-components";


const Box = styled.div`
    /* HTML: <div class="loader"></div> */
    display: flex;
    .loader {
        width: 20px;
        padding:5px;
        aspect-ratio: 1;
        border-radius: 50%;
        background: #fff;
        --_m:
                conic-gradient(#0000 10%,#000),
                linear-gradient(#000 0 0) content-box;
        -webkit-mask: var(--_m);
        mask: var(--_m);
        -webkit-mask-composite: source-out;
        mask-composite: subtract;
        animation: l3 1s infinite linear;
    }
    @keyframes l3 {to{transform: rotate(1turn)}}
`
export default function BtnLoading(){
    return <Box>
        <div className="loader"/>
    </Box>

}
