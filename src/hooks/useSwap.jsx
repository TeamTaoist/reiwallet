import useMessage from "./useMessage";
import { useEffect, useState } from "react";
import useAccountAddress from "./useAccountAddress";
import { useWeb3 } from "../store/contracts";

export default function useSwap(from) {
  const { currentAccountInfo } = useAccountAddress();
  const [loading, setLoading] = useState(false);
  const [currencyTo, setCurrencyTo] = useState(null);
  const [currencyFrom, setCurrencyFrom] = useState(null);
  const [range, setRange] = useState(null);
  const [time, setTime] = useState(null);
  const [loadArr, setLoadArr] = useState([...Array(4)].fill(true));

  const {
    dispatch,
    state: { stealthex_token, currentToken, isRotated },
  } = useWeb3();

  const handleEvent = async (message) => {
    const { type } = message;
    switch (type) {
      case "stealthex_auth_success":
        {
          setLoadArr((arr) => {
            arr[0] = false;
            return [...arr];
          });
          /*global chrome*/
          await chrome.storage.local.set({ auth_expire: time });
          dispatch({ type: "SET_STEALTHEX_TOKEN", payload: message.data });
        }
        break;
      case "get_currency_success":
        {
          const { result, type } = message.data;
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

          setLoadArr((arr) => {
            if (type === "from") {
              arr[1] = false;
            } else {
              arr[2] = false;
            }
            return [...arr];
          });

          // setLoading(false);
        }
        break;
      case "get_range_success":
        {
          setRange(message.data);

          setLoadArr((arr) => {
            arr[3] = false;
            return [...arr];
          });
        }
        break;
    }
  };

  const { sendMsg } = useMessage(handleEvent, []);

  useEffect(() => {
    if (!currentAccountInfo) return;
    toBackground();
  }, [currentAccountInfo]);

  useEffect(() => {
    const arr = loadArr.filter((item) => item);
    setLoading(!!arr?.length);
  }, [loadArr]);

  const toBackground = async () => {
    /*global chrome*/
    let expireArr = await chrome.storage.local.get(["auth_expire"]);
    let expireFormat = expireArr?.auth_expire ?? 0;
    let expire = new Date().valueOf() - expireFormat;

    if (expireFormat && expire > 60 * 60 * 1000 && stealthex_token) return;

    setLoadArr((arr) => {
      arr[0] = true;
      return [...arr];
    });

    let obj = {
      method: "stealthex_auth",
      currentAccountInfo,
    };

    setTime(new Date().valueOf());

    sendMsg(obj);
  };

  useEffect(() => {
    if (!currentAccountInfo || !stealthex_token) return;
    getCurrency(isRotated ? currentToken : from, "from");
  }, [stealthex_token, currentAccountInfo, from, isRotated, currentToken]);

  useEffect(() => {
    if (!currentAccountInfo || !stealthex_token) return;
    getCurrency(!isRotated ? currentToken : from, "to");
  }, [stealthex_token, currentAccountInfo, currentToken, from, isRotated]);

  const getCurrency = async (symbol, type) => {
    let obj = {
      method: "get_currency",
      symbol,
      token: stealthex_token,
      type,
    };
    setLoadArr((arr) => {
      if (type === "from") {
        arr[1] = true;
      } else {
        arr[2] = true;
      }
      return [...arr];
    });

    sendMsg(obj);
  };

  useEffect(() => {
    if (
      !currencyTo ||
      !currencyFrom ||
      currencyTo.symbol === currencyFrom.symbol
    )
      return;
    getRange();
  }, [currencyTo, currencyFrom, isRotated]);

  const getRange = async () => {
    let obj = {
      method: "get_range",
      from: currencyFrom,
      to: currencyTo,
      token: stealthex_token,
    };
    setLoadArr((arr) => {
      arr[3] = true;
      return [...arr];
    });
    sendMsg(obj);
  };

  return { currencyTo, currencyFrom, loading, range };
}
