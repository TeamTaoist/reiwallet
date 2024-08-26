import Lock from "../../components/lock/lock";
import useLock from "../../hooks/useLock";
import { useEffect, useState } from "react";

import SendDOBDetail from "./sendDOBDetail";

export default function SendDOB() {
  const Unlocked = useLock();
  const [status, setStatus] = useState(false);

  useEffect(() => {
    setStatus(Unlocked);
  }, [Unlocked]);

  const handleLock = (bl) => {
    setStatus(bl);
  };

  return (
    <div>
      {!status && <Lock isNav={true} handleLock={handleLock} />}
      {status && <SendDOBDetail />}
    </div>
  );
}
