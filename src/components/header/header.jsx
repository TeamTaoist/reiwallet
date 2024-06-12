import styled from "styled-components";
import Logo from "../../assets/images/logoIcon.png";
import More from "../../assets/images/more.png";
import DropImg from "../../assets/images/drop.png"
import {useNavigate} from "react-router-dom";
import NetworkList from "../network/networkList";
import {useEffect, useState} from "react";
import useNetwork from "../../useHook/useNetwork";
import Loading from "../loading/loading";

const HeaderBox = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding:10px 20px;
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
    font-size: 14px;
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
    const {network,netList} = useNetwork();
    const [loading , setLoading] = useState(false);

    useEffect(() => {
        if(!netList.length)return;
        const networkIndex = netList.findIndex(item=>item.value === network);
        setCurrent(networkIndex<0?0:networkIndex)
    }, [network,netList]);


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

    const handleLoading = () =>{
        setLoading(true)
    }
    const closeLoading = () =>{
        setLoading(false)
    }

    return <HeaderBox>
        {
            showNetwork && <NetworkList current={current} handleLoading={handleLoading} closeLoading={closeLoading} />
        }
        {
            loading && <Loading showBg={true} />
        }
        <LogoImg>
            <img src={Logo} alt=""/>
        </LogoImg>

        <InputBox onClick={(e)=>handleNetwork(e)}>
            {netList[current]?.name}
            <img src={DropImg} alt=""/>
        </InputBox>
        <MoreBox>
            <img src={More} alt="" onClick={()=>toSetting()}/>
        </MoreBox>

    </HeaderBox>
}
