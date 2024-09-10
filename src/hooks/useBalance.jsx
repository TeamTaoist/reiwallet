import useNetwork from "./useNetwork";
import useAccountAddress from "./useAccountAddress";
import { useEffect, useState } from "react";
import { formatUnit } from "@ckb-lumos/bi";
import useMessage from "./useMessage";
import { BI } from "@ckb-lumos/lumos";

export default function useBalance() {
  const { networkInfo } = useNetwork();
  const { currentAccountInfo } = useAccountAddress();
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState("--");
  const [occupied, setOccupied] = useState("--");
  const [available, setAvailable] = useState("--");

  const handleEvent = (message) => {
    const { type } = message;
    if (type === "get_capacity_success") {
      setLoading(false);
      const { capacity, OcCapacity } = message.data;
      let rt = formatUnit(capacity, "ckb");
      let occ = formatUnit(OcCapacity, "ckb");

      let av = BI.from(capacity).sub(OcCapacity);
      setBalance(rt);
      setAvailable(formatUnit(av, "ckb"));
      setOccupied(occ);
    } else if (type === "get_capacity_error") {
      setLoading(false);
      // FIXME: handle error [F]
    }
  };

  const { sendMsg } = useMessage(handleEvent, []);

  useEffect(() => {
    if (!networkInfo || !currentAccountInfo) return;
    setLoading(true);
    toBackground();
    const timer = setInterval(() => {
      toBackground();
    }, 10 * 1000);

    return () => {
      clearInterval(timer);
    };
  }, [currentAccountInfo, networkInfo]);

  const toBackground = () => {
    let obj = {
      method: "get_capacity",
      networkInfo,
      currentAccountInfo,
    };
    sendMsg(obj);
  };
  return {
    balance,
    occupied,
    available,
    balanceLoading: loading,
    symbol: networkInfo?.nativeCurrency?.symbol,
  };
}
