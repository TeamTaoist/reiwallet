import Lock from "../../components/lock/lock";
import useLock from "../../useHook/useLock";
import { useEffect, useState } from "react";
import SendTransaction from "./sendCKB";

export default function Home() {
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
      {status && <SendTransaction />}
    </div>
  );
}
