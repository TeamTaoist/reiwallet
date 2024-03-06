
import styled from "styled-components";
import {useEffect, useState} from "react";

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
        chrome.storage.local.get(['identityInfo'],(result)=>{
            const Len = Object.keys(result).length;
            setShowHome(!Len);
        });
        chrome.storage.session.get(['password'],(result)=>{
            setPassword(result.password);
        });

    },[]);




    return <Box>
test
    </Box>
}
