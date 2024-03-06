import styled from "styled-components";
import Logo from "../../assets/images/logoIcon.png";
import More from "../../assets/images/more.png";
import DropImg from "../../assets/images/drop.png"
import {useNavigate} from "react-router-dom";
// import NetworkList from "../network/networkList";
import {useEffect, useState} from "react";

const HeaderBox = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
`
const LogoImg = styled.div`
    width: 28px;
    img{
      width: 100%;
    }
`
const InputBox = styled.div`
    width: 218px;
    box-sizing: border-box;
    padding: 0 13px 0 18px;
    height: 36px;
    border-radius: 16px;
    border: 1px solid #34332D;
    display: flex;
    align-items: center;
    justify-content: space-between;
`
const MoreBox = styled.div`
  width: 24px;
  img{
    width: 100%;
  }
`

export default function HeaderTop(){

    const navigate = useNavigate();
    const [showNetwork,setShowNetwork] = useState(false);

    const toSetting = () =>{
        navigate('/setting')
    }
    const handleNetwork = (e) =>{
        return;
        stopPropagation(e);
        setShowNetwork(!showNetwork)
    }

    useEffect(() => {
        document.addEventListener("click", (e) =>{
            setShowNetwork(false)

        });
    }, [])
    const stopPropagation = (e) => {
        e.nativeEvent.stopImmediatePropagation();
    }

    return <HeaderBox>
        {/*{*/}
        {/*    showNetwork && <NetworkList />*/}
        {/*}*/}

        <LogoImg>
            <img src={Logo} alt=""/>
        </LogoImg>

        <InputBox onClick={(e)=>handleNetwork(e)}>
            Ethereum Mainnet
            <img src={DropImg} alt=""/>
        </InputBox>
        <MoreBox>
            <img src={More} alt="" onClick={()=>toSetting()}/>
        </MoreBox>

    </HeaderBox>
}
