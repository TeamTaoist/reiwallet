import HeaderTop from "../../header/header";
import {useEffect, useMemo, useState} from "react";
import NoWallet from "./noWallet";
import Account from "../../account/account";
import styled from "styled-components";
import {use} from "i18next";

const Box = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
`
const Content = styled.div`
    flex-grow: 1;
    height: 100%;
  overflow-y: auto;
`

export default function WalletHome(){
    const [len,setLen] = useState(0);

    useEffect( ()=>{

        /*global chrome*/
         chrome.storage.local.get(['walletList'],(result)=>{
            console.error(result.walletList)
             setLen(result.walletList?.length)
        });


    },[]);


    return <Box>
        <HeaderTop />

        {
            !!len && <Content><Account /></Content>
        }
        {
            !len && <Content><NoWallet /></Content>
        }
    </Box>
}
