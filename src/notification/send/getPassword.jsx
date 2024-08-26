import Lock from "../../components/lock/lock";
import useLock from "../../useHook/useLock";
import { useEffect, useState } from "react";

import { useSessionMessenger } from "../../useHook/useSessionMessenger";

export default function GetPassword() {
  const Unlocked = useLock();
  const [status, setStatus] = useState(false);

  const messenger = useSessionMessenger();

  useEffect(() => {
    setStatus(Unlocked);
  }, [Unlocked]);

  const handleLock = async (bl) => {
    await messenger.send("get_PublicKey_result", { status: "success" });
    window.close();

    setStatus(bl);
  };

  useEffect(() => {
    if (!status || Unlocked) return;
    window.close();
  }, [status, Unlocked]);

  return <>{!status && <Lock isNav={true} handleLock={handleLock} />}</>;
}
