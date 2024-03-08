import styled from "styled-components";
import Logo from "../../assets/images/logoIcon.png";
import More from "../../assets/images/more.png";
import DropImg from "../../assets/images/drop.png"
import {useNavigate} from "react-router-dom";
import NetworkList from "../network/networkList";
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
    const [netList] = useState([
        {
            name:"Mainnet",
            value:"mainnet"
        },
        {
            name:"Testnet",
            value:"testnet"
        },
        {
            name:"Devnet",
            value:"devnet"
        }
    ])
    /*global chrome*/
    chrome.storage.local.get(['network'],(result)=>{
        console.error("==== result.network", result.network)

        const networkIndex = netList.findIndex(item=>item.value === result.network);
        setCurrent(networkIndex<0?0:networkIndex)

    });

    //
    // useEffect(() => {
    //
    //
    //     chrome.storage.local.get(['network'],(result)=>{
    //         const networkIndex = netList.findIndex(item=>item.name === result.network);
    //         setCurrent(networkIndex<0?0:networkIndex)
    //     });
    //
    // }, []);

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
            showNetwork && <NetworkList netList={netList} current={current} />
        }
        <LogoImg>
            <img src={Logo} alt=""/>
        </LogoImg>

        <InputBox onClick={(e)=>handleNetwork(e)}>
            {netList[current].name}
            <img src={DropImg} alt=""/>
        </InputBox>
        <MoreBox>
            <img src={More} alt="" onClick={()=>toSetting()}/>
        </MoreBox>

    </HeaderBox>
}
