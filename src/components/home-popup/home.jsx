import CreateRestore from '../createIdentity/CreateRestore';
import WalletHome from "../wallet/createWallet/walletHome";
import Lock from "../lock/lock";
import styled from "styled-components";
import {useEffect, useState} from "react";

import {useWeb3} from "../../store/contracts";

const Box = styled.div`
    height: 600px;
`

export default function Home(){
    const [showHome, setShowHome] = useState(false);
    const [Unlocked,setUnlocked] = useState(true);
    const [ password, setPassword ] = useState(null);
    const [ next, setNext] = useState(false);

    useEffect(()=>{
        /*global chrome*/
        chrome.storage.local.get(['isInit'],(result)=>{
            console.log("=====result",result?.isInit)
            if(result?.isInit){
                setShowHome(false);
            }else{
                setShowHome(true);
            }

        });

    },[]);




    return <Box>
        {
            !showHome && Unlocked &&<WalletHome />
        }
        {
            !showHome && !Unlocked &&<Lock />
        }
        {
            showHome &&<CreateRestore />
        }
    </Box>
}
