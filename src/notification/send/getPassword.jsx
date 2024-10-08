import Lock from "../../popup/lock/lock";
import useLock from "../../hooks/useLock";
import { useEffect, useState } from "react";

import { useSessionMessenger } from "../../hooks/useSessionMessenger";

export default function GetPassword() {
  const Unlocked = useLock();
  const [status, setStatus] = useState(false);

  const messenger = useSessionMessenger();

  useEffect(() => {
    setStatus(Unlocked);
  }, [Unlocked]);

  const handleLock = async (bl) => {
    await messenger.send("get_public_key_result", { status: "success" });
    window.close();

    setStatus(bl);
  };

  useEffect(() => {
    if (!status || Unlocked) return;
    window.close();
  }, [status, Unlocked]);

  return <>{!status && <Lock isNav={true} handleLock={handleLock} />}</>;
}
