import Lock from "../../popup/lock/lock";
import useLock from "../../hooks/useLock";
import { useEffect, useState } from "react";
import SendRawDetail from "./sendRawDetail";

export default function SendRawTx() {
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
      {status && <SendRawDetail />}
    </div>
  );
}
