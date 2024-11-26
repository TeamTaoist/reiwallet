import useMessage from "./useMessage";
import { BI, formatUnit } from "@ckb-lumos/bi";
import { useEffect, useState } from "react";
import useAccountAddress from "./useAccountAddress";
import { useWeb3 } from "../store/contracts";

export default function useSwap(from, isRotated) {
  const { currentAccountInfo } = useAccountAddress();
  const [loading, setLoading] = useState(false);
  const [currencyTo, setCurrencyTo] = useState(null);
  const [currencyFrom, setCurrencyFrom] = useState(null);
  const [range, setRange] = useState(null);
  const [time, setTime] = useState(null);

  const {
    dispatch,
    state: { stealthex_token, currentToken },
  } = useWeb3();

  const handleEvent = async (message) => {
    const { type } = message;
    switch (type) {
      case "stealthex_auth_success":
        {
          setLoading(false);
          /*global chrome*/
          await chrome.storage.local.set({ auth_expire: time });
          dispatch({ type: "SET_STEALTHEX_TOKEN", payload: message.data });
        }
        break;
      case "get_currency_success":
        {
          const { result, type } = message.data;
          console.error(message.data);
          if (result?.symbol === "ckb") {
            dispatch({
              type: "SET_EXCHANGE_LIST",
              payload: result?.available_routes ?? [],
            });
          }

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
    /*global chrome*/
    let expireArr = await chrome.storage.local.get(["auth_expire"]);
    let expireFormat = expireArr?.auth_expire ?? 0;
    let expire = new Date().valueOf() - expireFormat;

    if (expireFormat && expire > 60 * 60 * 1000 && stealthex_token) return;
    setLoading(true);

    let obj = {
      method: "stealthex_auth",
      currentAccountInfo,
    };

    setTime(new Date().valueOf());

    sendMsg(obj);
  };

  useEffect(() => {
    if (!currentAccountInfo || !stealthex_token) return;
    getCurrency(from, "from");
  }, [stealthex_token, currentAccountInfo, from]);

  useEffect(() => {
    if (!currentAccountInfo || !stealthex_token) return;
    getCurrency(currentToken, "to");
  }, [stealthex_token, currentAccountInfo, currentToken]);

  const getCurrency = async (symbol, type) => {
    let obj = {
      method: "get_currency",
      symbol,
      token: stealthex_token,
      type,
    };
    sendMsg(obj);
  };

  useEffect(() => {
    if (!currentToken || !currencyFrom) return;
    getRange();
  }, [currentToken, currencyFrom, isRotated]);

  const getRange = async () => {
    let from, to;
    if (!isRotated) {
      from = currencyFrom;
      to = currentToken;
    } else {
      from = currentToken;
      to = currencyFrom;
    }
    let obj = {
      method: "get_range",
      from,
      to,
      token: stealthex_token,
    };
    sendMsg(obj);
  };

  return { currencyTo, currencyFrom, loading, range };
}
