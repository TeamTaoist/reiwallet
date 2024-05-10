import Lock from "../../components/lock/lock";
import useLock from "../../useHook/useLock";
import {useEffect, useState} from "react";

import styled from "styled-components";
import SendRaw_detail from "./sendRaw_detail";

const Box = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    min-height: 100vh;
    width: 100%;
    box-sizing: border-box;
    padding:20px;
    &.show{
        display: block;
    }
    &.none{
        display: none;
    }
`

const UrlBox = styled.div`
    background: #f8f8f8;
    padding: 10px;
    margin-bottom: 30px;
`
const TitleBox = styled.div`
    font-weight: bold;
    font-size: 20px;
    margin-bottom: 20px;
`
const TipsBox = styled.div`
    font-size: 12px;
    margin-bottom: 30px;
`

const SubTitle = styled.div`
    font-weight: bold;
    margin-bottom: 10px;
`

const MsgBox = styled.div`
    padding: 20px;
    background: #f8f8f8;
`
const BtnGroup = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    button{
        width: 47%;
    }
`

export default function SendRawTx(){

    const Unlocked = useLock();
    const [status,setStatus ] = useState(false)

    useEffect(() => {
        setStatus(Unlocked)
    }, [Unlocked]);

    const handleLock = (bl) =>{
        setStatus(bl)
    }


    return <div>
        {
            !status && <Lock isNav={true} handleLock={handleLock} />
        }
        {
            status && <SendRaw_detail />
        }
    </div>
}
