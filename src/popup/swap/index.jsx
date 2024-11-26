import styled from "styled-components";
import TokenHeader from "../header/tokenHeader";
import { useTranslation } from "react-i18next";
import Button from "../button/button";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import useSwap from "../../hooks/useSwap";
import { useWeb3 } from "../../store/contracts";
import { debounce } from "lodash";
import useMessage from "../../hooks/useMessage";

const BoxOuter = styled.div`
  display: flex;
  flex-direction: column;
  background: #f9fafa;
  min-height: 100vh;
`;

const Box = styled.div`
  padding: 20px;
`;

const WhiteInput = styled.div`
  background: #ffffff;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0px 0px 8px 0px #e8e8e8;
  display: flex;
  align-content: center;
  justify-content: space-between;
  margin-bottom: 30px;
  position: relative;
  .textSmall {
    font-size: 10px;
    opacity: 0.6;
    margin-bottom: 5px;
  }
  .min {
    position: absolute;
    left: 5px;
    bottom: -20px;
    font-size: 10px;
    color: #f00;
  }
`;

const BtnGroup = styled.div`
  display: flex;
  position: absolute;
  left: 0;
  bottom: 20px;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
  padding: 0 20px;
  button {
    width: 47%;
  }
`;

const ArrowBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  justify-items: center;
  margin-bottom: 30px;
  .iconInner {
    transition: transform 0.3s ease-in-out;
  }
  .innerBox {
    background: #ffffff;
    border-radius: 100px;
    box-shadow: 0px 0px 8px 0px #e8e8e8;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    cursor: pointer;

    .iconInner.rotated {
      transform: rotate(180deg);
    }
  }
`;

const SelectBox = styled.div`
  background: #f9fafa;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  gap: 20px;
  border-radius: 10px;
  font-size: 16px;
  flex-shrink: 0;
  .lft {
    display: flex;
    align-items: center;
    gap: 5px;
    img {
      width: 20px;
      height: 20px;
    }
  }
  &.curHover {
    cursor: pointer;
  }
`;

const LftBox = styled.div`
  flex-grow: 1;
  input {
    width: 100%;
    border: none;
    font-size: 16px;
    &:focus {
      outline: none;
    }
  }
`;

export default function Swap() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [from] = useState({ symbol: "ckb", network: "mainnet" });
  // const [to] = useState({ symbol: "usdt", network: "trx" });
  const { currencyTo, currencyFrom, range } = useSwap(from);
  const [fromObj, setFromObj] = useState(null);
  const [toObj, setToObj] = useState(null);
  const [amountFrom, setAmountFrom] = useState("");
  const [amountTo, setAmountTo] = useState("");
  console.error("range", range);

  const {
    dispatch,
    state: { stealthex_token, isRotated },
  } = useWeb3();

  const handleEvent = async (message) => {
    const { type } = message;
    switch (type) {
      case "estimated_amount_success":
        {
          setAmountTo(message.data.estimated_amount);
        }
        break;
    }
  };

  const { sendMsg } = useMessage(handleEvent, []);

  useEffect(() => {
    if (!currencyTo) return;
    setToObj(currencyTo);
  }, [currencyTo]);
  useEffect(() => {
    if (!currencyFrom) return;
    setFromObj(currencyFrom);
  }, [currencyFrom]);

  const handleClick = () => {
    dispatch({ type: "SET_ISROTATED", payload: !isRotated });
    let swapObj = fromObj;
    setFromObj(toObj);
    setToObj(swapObj);
    setAmountFrom("");
    setAmountTo("");
  };

  const handleInput = (e) => {
    const { value } = e.target;
    setAmountFrom(value);
    setAmountTo("");
    handleChange(value);
  };

  const handleChange = useCallback(
    debounce((value) => {
      handleAmountChange(value);
    }, 600),
    [fromObj, toObj, range],
  );

  const handleAmountChange = (value) => {
    if (Number(value) < Number(range?.min_amount)) return;
    let obj = {
      method: "estimated_amount",
      from: fromObj,
      to: toObj,
      token: stealthex_token,
      amount: value,
    };
    sendMsg(obj);
  };

  const handleNav = (type) => {
    if ((type === "from" && isRotated) || (type === "to" && !isRotated)) {
      navigate("/currencyList");
    }
  };

  const handleCancel = () => {
    navigate("/");
    dispatch({ type: "SET_ISROTATED", payload: false });
  };

  return (
    <BoxOuter>
      <TokenHeader title={t("popup.Swap")} />
      <Box>
        <WhiteInput>
          <LftBox>
            <div className="textSmall">Send {fromObj?.name}</div>
            <input
              type="text"
              placeholder="0"
              name="from"
              value={amountFrom}
              onChange={(e) => handleInput(e)}
            />
          </LftBox>
          <SelectBox
            className={isRotated && fromObj?.symbol !== "ckb" ? "curHover" : ""}
            onClick={() => handleNav("from")}
          >
            <div className="lft">
              <img alt="" src={fromObj?.icon_url} />
              <span> {fromObj?.symbol}</span>
            </div>

            <ChevronDown size={12} />
          </SelectBox>
          {!!range?.min_amount && !range?.err && (
            <div className="min">
              The minimum amount: {range?.min_amount} {fromObj?.symbol}
            </div>
          )}
          {!!range?.err && <div className="min">{range?.err?.details}</div>}
        </WhiteInput>
        <ArrowBox>
          <div className="innerBox" onClick={() => handleClick()}>
            <ArrowUpDown
              size={18}
              className={isRotated ? "iconInner" : "iconInner rotated"}
            />
          </div>
        </ArrowBox>

        <WhiteInput>
          <LftBox>
            <div className="textSmall">Get {toObj?.name}</div>
            <input type="text" placeholder="0" name="to" value={amountTo} />
          </LftBox>
          <SelectBox
            className={!isRotated && toObj?.symbol !== "ckb" ? "curHover" : ""}
            onClick={() => handleNav("to")}
          >
            <div className="lft ">
              <img alt="" src={toObj?.icon_url} />
              <span> {toObj?.symbol}</span>
            </div>

            <ChevronDown size={12} />
          </SelectBox>
        </WhiteInput>
        <BtnGroup>
          <Button border onClick={() => handleCancel()}>
            {t("popup.send.cancel")}
          </Button>
          <Button primary disabled={true}>
            确认
          </Button>
        </BtnGroup>
      </Box>
    </BoxOuter>
  );
}
