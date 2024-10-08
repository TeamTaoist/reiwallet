import { useEffect, useState } from "react";
import useMessage from "./useMessage";
import useAccountAddress from "./useAccountAddress";

export default function useXUDT() {
  const { currentAccountInfo } = useAccountAddress();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState("");

  const handleEvent = (message) => {
    const { type } = message;
    if (type === "get_xudt_success") {
      setList(message.data?.objects ?? []);
      setLoading(false);
    }
  };

  const { sendMsg } = useMessage(handleEvent, []);

  useEffect(() => {
    if (!currentAccountInfo) return;
    setLoading(true);
    toBackground();
  }, [currentAccountInfo]);

  const toBackground = () => {
    let obj = {
      method: "get_xudt",
      currentAccountInfo,
    };
    sendMsg(obj);
  };
  return { list, loading };
}
