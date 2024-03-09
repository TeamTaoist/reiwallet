import styled from "styled-components";

const Mask = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.6);
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999;
`

const Box = styled.div`

    .inner{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 35px;
        
    }
    /* HTML: <div class="loader"></div> */
    .loader {
        --d:22px;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        color: #00FF9D;
        box-shadow:
                calc(1*var(--d))      calc(0*var(--d))     0 0,
                calc(0.707*var(--d))  calc(0.707*var(--d)) 0 1px,
                calc(0*var(--d))      calc(1*var(--d))     0 2px,
                calc(-0.707*var(--d)) calc(0.707*var(--d)) 0 3px,
                calc(-1*var(--d))     calc(0*var(--d))     0 4px,
                calc(-0.707*var(--d)) calc(-0.707*var(--d))0 5px,
                calc(0*var(--d))      calc(-1*var(--d))    0 6px;
        animation: l27 1s infinite steps(8);
    }
    @keyframes l27 {
        100% {transform: rotate(1turn)}
    }
    .text{
        color: #fff;
    }
`
export default function Loading(){
    return <Mask>
        <Box>
            <div className="inner">
                <div className="loader"/>
                <div className="text">
                    validating
                </div>

            </div>



        </Box>
    </Mask>
}
