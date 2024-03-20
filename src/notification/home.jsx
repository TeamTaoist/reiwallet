import styled from "styled-components";
import {useState} from "react";
import Password from "../notification/password";

const Box = styled.div`
`
export default function Home(){
    const [Unlocked,setUnlocked] = useState(true);
    const [type,setType] = useState('')
    const getPassword = async() =>{
        /*global chrome*/
        let result = await chrome.storage.session.get(["password"]);
        setUnlocked(!!result.password)
    }


    return <div>
        {/*{*/}
        {/*   !Unlocked && <Password />*/}
        {/*}*/}
        <Password />
    </div>
}
