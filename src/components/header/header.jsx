import styled from "styled-components";
import Logo from "../../assets/images/logoIcon.png";
import More from "../../assets/images/more.png";
import DropImg from "../../assets/images/drop.png"
import {useNavigate} from "react-router-dom";
import NetworkList from "../network/networkList";
import {useEffect, useState} from "react";
import {networkList} from "../../constants/network";
import useNetwork from "../../useHook/useNetwork";

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
    cursor: pointer;
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
    const [ current,setCurrent] = useState(0);
    const {network} = useNetwork();


    useEffect(() => {
        const networkIndex = networkList.findIndex(item=>item.value === network);
        setCurrent(networkIndex<0?0:networkIndex)
    }, [network]);


    const toSetting = () =>{
        navigate('/setting')
    }
    const handleNetwork = (e) =>{
        e.nativeEvent.stopImmediatePropagation();
        setShowNetwork(true)
    }

    useEffect(() => {
        document.addEventListener("click", (e) =>{
            setShowNetwork(false)

        });
    }, [])

    return <HeaderBox>
        {
            showNetwork && <NetworkList netList={networkList} current={current} />
        }
        <LogoImg>
            <img src={Logo} alt=""/>
        </LogoImg>

        <InputBox onClick={(e)=>handleNetwork(e)}>
            {networkList[current].name}
            <img src={DropImg} alt=""/>
        </InputBox>
        <MoreBox>
            <img src={More} alt="" onClick={()=>toSetting()}/>
        </MoreBox>

    </HeaderBox>
}
