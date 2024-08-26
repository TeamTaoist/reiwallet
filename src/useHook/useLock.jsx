import { useEffect, useState } from "react";
import { getPassword } from "../wallet/password";

export default function useLock() {
  const [Unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    getLocalPassword();
  }, []);

  const getLocalPassword = async () => {
    let result = await getPassword();
    setUnlocked(!!result);
  };

  return Unlocked;
}
