import useNetwork from "./useNetwork";
import useAccountAddress from "./useAccountAddress";
import { useEffect, useState } from "react";
import { formatUnit, BI } from "@ckb-lumos/bi";
import useMessage from "./useMessage";
import BigNumber from "bignumber.js";

export default function useBalance() {
  const { networkInfo } = useNetwork();
  const { currentAccountInfo } = useAccountAddress();
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState("--");
  const [occupied, setOccupied] = useState("--");
  const [available, setAvailable] = useState("--");
  const [price, setPrice] = useState("--");

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
    } else if (type === "get_price_success") {
      const { result, balance } = message.data;
      const price = result[0]?.last;
      const newPrice = new BigNumber(price).multipliedBy(balance);
      setPrice(newPrice.toFixed(2));
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

  useEffect(() => {
    if (balance === "--") return;
    getPrice();

    const timer = setInterval(() => {
      getPrice();
    }, 10 * 1000);

    return () => {
      clearInterval(timer);
    };
  }, [balance]);

  const getPrice = () => {
    let obj = {
      method: "get_price",
      balance,
    };
    sendMsg(obj);
  };

  return {
    balance,
    occupied,
    available,
    price,
    balanceLoading: loading,
    symbol: networkInfo?.nativeCurrency?.symbol,
  };
}
