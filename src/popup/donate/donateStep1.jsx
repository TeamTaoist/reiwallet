import CloseImg from "../../assets/images/close.png";
import BtnLoading from "../loading/btnLoading";
import Button from "../button/button";
import { useEffect, useState } from "react";
import useBalance from "../../hooks/useBalance";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { formatUnit, parseUnit } from "@ckb-lumos/bi";
import useAccountAddress from "../../hooks/useAccountAddress";
import Wallet from "../../wallet/wallet";
import { minimalScriptCapacity } from "@ckb-lumos/helpers";
import { BI } from "@ckb-lumos/lumos";
import { donateAddress } from "../../config/constants";

const ContentBox = styled.div`
  flex-grow: 1;
  margin: 20px;
`;
const TitleBox = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #34332e;
  line-height: 20px;
  margin-bottom: 10px;
`;

const Gas = styled.div`
  display: flex;
  justify-content: space-between;
  .item {
    width: 100%;
    margin-bottom: 20px;
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

const SendInput = styled.div`
  background: #f1fcf1;
  border-radius: 14px;
  border: 1px solid #62ba46;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  margin-bottom: 10px;
  textarea {
    resize: none;
    height: 95px;
    padding: 15px;
    flex-grow: 1;
    border: 0;
    background: transparent;
    &:focus {
      outline: none;
    }
  }
  img {
    margin: 18px;
    cursor: pointer;
  }
`;
const WhiteInput = styled.div`
  overflow: hidden;
  background: #ffffff;
  border-radius: 14px;
  padding: 20px;
  display: flex;
  align-content: center;
  justify-content: space-between;

  .title {
    font-size: 12px;
    line-height: 28px;
  }
  .num {
    font-weight: bold;
    line-height: 28px;
    span {
      font-size: 16px;
    }
  }
  .tips {
    font-size: 10px;
  }
`;

const AmountBox = styled.div`
  overflow: hidden;
  background: #ffffff;
  border-radius: 14px;
  height: 66px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  input {
    flex-grow: 1;
    width: 100%;
    box-sizing: border-box;
    padding: 0 10px;
    border: 0;
    font-size: 18px;
    font-weight: 500;
    color: #34332e;
    line-height: 66px;
    -moz-appearance: textfield;
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    &:focus {
      outline: none;
    }
  }
  .rht {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    margin-right: 20px;
  }
  .max {
    width: 48px;
    height: 24px;
    background: #00ff9d;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 400;
    color: #000000;
    line-height: 24px;
    text-align: center;
    margin-bottom: 6px;
    cursor: pointer;
    border: 0;
    &:disabled {
      opacity: 0.4;
    }
  }
  .balance {
    font-size: 12px;
    font-weight: 400;
    color: #8897b1;
    line-height: 16px;
    white-space: nowrap;
    display: flex;
    align-content: center;
    justify-content: center;
    span {
      display: flex;
      align-content: center;
      justify-content: center;
      gap: 5px;
    }
  }
`;

const Tips = styled.div`
  padding: 10px 0;
  span {
    font-weight: bold;
  }
`;

export default function DonateStep1({ toDetail, fee }) {
  const [amount, setAmount] = useState("");
  const { t } = useTranslation();
  const { available, balanceLoading, symbol } = useBalance();
  const address = donateAddress;
  const [isMax, setIsMax] = useState(false);
  const [search] = useSearchParams();
  const sendTo = search.get("sendTo");
  const navigate = useNavigate();
  const { currentAccountInfo } = useAccountAddress();
  const [minimal, setMinimal] = useState(0);

  useEffect(() => {
    if (amount === "" || available === "--") return;

    let bl = parseUnit(available, "ckb");
    let amt = parseUnit(amount, "ckb");
    setIsMax(bl.eq(amt));
  }, [amount, available]);

  const chooseMax = () => {
    if (balanceLoading) return;
    setAmount(available);
    setIsMax(true);
  };

  const handleAmount = (e) => {
    setAmount(e.target.value);
  };
  useEffect(() => {
    if (address) {
      handleMinimal();
    }
  }, [address]);

  const handleMinimal = () => {
    const toScript = Wallet.addressToScript(address);
    const minimal = minimalScriptCapacity(toScript);

    const capacityField = parseUnit("8", "ckb");
    const total = BI.from(minimal.toString()).add(capacityField);
    const mi = formatUnit(total, "ckb");
    setMinimal(mi);
  };
  return (
    <ContentBox>
      <div>
        <TitleBox>{t("popup.send.payAmount")}</TitleBox>
        <AmountBox>
          <input
            type="number"
            value={amount}
            onChange={(e) => handleAmount(e)}
          />
          <div className="rht">
            <Button className="max" onClick={() => chooseMax()}>
              {t("popup.send.MAX")}
            </Button>
            <div className="balance">
              {t("popup.send.Capacity")}:{" "}
              <span>
                {balanceLoading && <BtnLoading color="#00FF9D" />}
                {available} {symbol}
              </span>
            </div>
          </div>
        </AmountBox>
      </div>

      <Gas>
        <div className="item">
          <WhiteInput>
            <div className="title">{t("popup.send.feeRate")}</div>
            <div className="num">
              <span>{fee}</span> Shannons/kB
            </div>
          </WhiteInput>
        </div>
      </Gas>
      <Tips>{t("popup.send.tips", { capacity: minimal })}</Tips>
      <BtnGroup>
        <Button border onClick={() => navigate("/")}>
          {t("popup.send.cancel")}
        </Button>
        <Button
          primary
          disabled={
            parseFloat(amount) < minimal ||
            parseFloat(amount) > parseFloat(available) ||
            !address?.length
          }
          onClick={() => toDetail(address, amount, isMax)}
        >
          {t("popup.send.Next")}
        </Button>
      </BtnGroup>
    </ContentBox>
  );
}
