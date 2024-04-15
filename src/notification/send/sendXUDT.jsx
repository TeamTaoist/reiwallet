import Lock from "../../components/lock/lock";
import useLock from "../../useHook/useLock";
import {useEffect, useState} from "react";

import SendXUDT_detail from "./sendXUDT_detail";

export default function SendXUDT(){

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
            status && <SendXUDT_detail />
        }
    </div>
}
