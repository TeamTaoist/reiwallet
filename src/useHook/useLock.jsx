import {useEffect, useState} from "react";

export default function useLock(){
    const [Unlocked,setUnlocked] = useState(false);

    useEffect(()=>{
        getPassword()
    },[]);

    const getPassword = async() =>{
        /*global chrome*/
        let result = await chrome.storage.session.get(["password"]);
        setUnlocked(!!result?.password)
    }


    return Unlocked;
}
