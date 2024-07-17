import Lock from "../../components/lock/lock";
import useLock from "../../useHook/useLock";
import {useEffect, useState} from "react";

import SendDOBDetail from "./sendDOB_detail";

export default function SendDOB(){

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
            status && <SendDOBDetail />
        }
    </div>
}
