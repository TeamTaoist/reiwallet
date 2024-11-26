import useMessage from "./useMessage";
import { BI, formatUnit } from "@ckb-lumos/bi";
import { useEffect, useState } from "react";
import useAccountAddress from "./useAccountAddress";
import { useWeb3 } from "../store/contracts";

export default function useSwap(from, to) {
  const { currentAccountInfo } = useAccountAddress();
  const [loading, setLoading] = useState(false);
  const [currencyTo, setCurrencyTo] = useState(null);
  const [currencyFrom, setCurrencyFrom] = useState(null);
  const [range, setRange] = useState(null);

  const {
    dispatch,
    state: { stealthex_token },
  } = useWeb3();

  const handleEvent = (message) => {
    const { type } = message;
    switch (type) {
      case "stealthex_auth_success":
        {
          setLoading(false);
          dispatch({ type: "SET_STEALTHEX_TOKEN", payload: message.data });
        }
        break;
      case "get_currency_success":
        {
          const { result, type } = message.data;
          console.error(message.data);
          if (type === "to") {
            setCurrencyTo(result);
          } else {
            setCurrencyFrom(result);
          }
          setLoading(false);
        }
        break;
      case "get_range_success":
        {
          setRange(message.data);
        }
        break;
    }
  };

  const { sendMsg } = useMessage(handleEvent, []);

  useEffect(() => {
    if (!currentAccountInfo) return;
    toBackground();
  }, [currentAccountInfo]);

  const toBackground = async () => {
    let expireArr = await chrome.storage.local.get(["auth_expire"]);
    let expireFormat = expireArr?.auth_expire ?? 0;
    let expire = new Date().valueOf() - expireFormat;

    if (expireFormat && expire > 60 * 60 * 1000) return;
    setLoading(true);

    let obj = {
      method: "stealthex_auth",
      currentAccountInfo,
    };
    /*global chrome*/
    await chrome.storage.local.set({ auth_expire: new Date().valueOf() });
    sendMsg(obj);
  };

  useEffect(() => {
    if (!currentAccountInfo || !stealthex_token) return;
    getCurrency(from, "from");
  }, [stealthex_token, currentAccountInfo, from]);

  useEffect(() => {
    if (!currentAccountInfo || !stealthex_token) return;

    getCurrency(to, "to");
  }, [stealthex_token, currentAccountInfo, to]);

  const getCurrency = async (symbol, type) => {
    console.log("getCurrency", symbol);
    let obj = {
      method: "get_currency",
      symbol,
      token: stealthex_token,
      type,
    };
    sendMsg(obj);
  };

  useEffect(() => {
    if (!currencyTo || !currencyFrom) return;
    getRange();
  }, [currencyTo, currencyFrom]);

  const getRange = async () => {
    let obj = {
      method: "get_range",
      from: currencyFrom,
      to: currencyTo,
      token: stealthex_token,
    };
    sendMsg(obj);
  };

  return { currencyTo, currencyFrom, loading, range };
}
