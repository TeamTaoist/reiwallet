import Lock from "../../components/lock/lock";
import useLock from "../../hooks/useLock";
import { useEffect, useState } from "react";

import SendSUDTDetail from "./sendSUDTDetail";

export default function SendSUDT() {
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
      {status && <SendSUDTDetail />}
    </div>
  );
}
