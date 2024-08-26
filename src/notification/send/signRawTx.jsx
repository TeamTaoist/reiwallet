import Lock from "../../components/lock/lock";
import useLock from "../../hooks/useLock";
import { useEffect, useState } from "react";

import SignRawDetail from "./signRawDetail";

export default function SignRawTx() {
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
      {status && <SignRawDetail />}
    </div>
  );
}
