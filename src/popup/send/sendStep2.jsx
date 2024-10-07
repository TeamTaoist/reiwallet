import styled from "styled-components";
import FromImg from "../../assets/images/fromTo.png";
import Avatar from "../svg/avatar/avatar";
import useBalance from "../../hooks/useBalance";
import Button from "../button/button";
import PublicJS from "../../utils/publicJS";
import useAccountAddress from "../../hooks/useAccountAddress";
import { formatUnit, parseUnit } from "@ckb-lumos/bi";
import { useEffect, useState } from "react";
import { BI } from "@ckb-lumos/lumos";
import { useNavigate } from "react-router-dom";
import BtnLoading from "../loading/btnLoading";
import { useTranslation } from "react-i18next";
import Wallet from "../../wallet/wallet";
import { minimalCellCapacity, minimalScriptCapacity } from "@ckb-lumos/helpers";

const ContentBox = styled.div`
  flex-grow: 1;
  margin: 20px 0 0;
  padding: 0 20px;
  overflow-y: auto;
`;
const FirstLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
`;
const AvatarBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;
const SendBox = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 17px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
  margin: 5px 0 10px;
  font-size: 14px;
  .tit {
    font-size: 12px;
  }
  .number {
    font-size: 18px;
    font-weight: bold;
  }
`;
const SymbolBox = styled.div`
  font-size: 18px;
  font-weight: 500;
`;

const FeeBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
`;
const TitleBox = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #34332e;
  line-height: 20px;
  width: 100%;
  margin-top: 10px;
`;
const AddressBox = styled.div`
  background: #fff;
  border-radius: 6px;
  padding: 17px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
  margin: 5px 0;
  font-size: 14px;
`;

const BtnGroup = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
  padding-bottom: 20px;
  button {
    width: 47%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
`;

const Tips = styled.div`
  background: #c9233a;
  color: #fff;
  font-size: 12px;
  padding: 5px 10px;
  margin-bottom: 20px;
  border-radius: 5px;
`;

export default function SendStep2({
  address,
  result,
  sendConfirm,
  isMax,
  amt,
}) {
  const { symbol } = useBalance();
  const [amount, setAmount] = useState(0);
  const { currentAccountInfo } = useAccountAddress();
  const [fee, setFee] = useState(0);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [isDisable, setIsDisable] = useState(false);

  const getMinimal = (addr) => {
    const toScript = Wallet.addressToScript(addr);
    const minimal = minimalScriptCapacity(toScript);

    const capacityField = parseUnit("8", "ckb");
    return BI.from(minimal.toString()).add(capacityField);
  };

  useEffect(() => {
    let inputsSum = BI.from(0);
    result?.inputs?.map((item) => {
      //
      let capacity = BI.from(item.capacity);
      inputsSum = inputsSum.add(capacity);
    });

    let outputsSum = BI.from(0);
    result?.outputs?.map((item) => {
      //
      let capacity = BI.from(item.capacity);
      const cellMini = getMinimal(item.address);
      if (capacity.lt(cellMini)) {
        setIsDisable(true);
      }

      outputsSum = outputsSum.add(capacity);
    });

    if (isMax) {
      let outputsFormat = formatUnit(outputsSum, "ckb");

      setAmount(outputsFormat);
    } else {
      setAmount(amt);
    }

    let gas = inputsSum.sub(outputsSum);
    let gasFormat = formatUnit(gas, "ckb");
    setFee(gasFormat);
  }, [result, isMax]);

  const handleSubmit = () => {
    sendConfirm(result?.signedTx);
    setLoading(true);
  };

  return (
    <ContentBox>
      <FirstLine>
        <AvatarBox>
          <Avatar size={36} address={currentAccountInfo?.address} />
          <div className="name">
            {currentAccountInfo?.address
              ? PublicJS.addressToShow(currentAccountInfo?.address)
              : ""}
          </div>
        </AvatarBox>
        <div>
          <img src={FromImg} alt="" />
        </div>
        <AvatarBox>
          <Avatar size={36} address={address} />
          <div className="name">{PublicJS.addressToShow(address)}</div>
        </AvatarBox>
      </FirstLine>
      <SendBox>
        <div>
          <div className="tit">{t("popup.send.Sending")}</div>
          <div className="number">{amount}</div>
        </div>
        <SymbolBox>{symbol}</SymbolBox>
      </SendBox>
      <FeeBox>
        <TitleBox>{t("popup.send.Inputs")}</TitleBox>
        {result?.inputs?.map((item) => (
          <AddressBox>
            <div>{PublicJS.addressToShow(item.address)}</div>
            <div>
              {formatUnit(item.capacity, "ckb")} {symbol}
            </div>
          </AddressBox>
        ))}
      </FeeBox>
      <FeeBox>
        <TitleBox>{t("popup.send.Outputs")}</TitleBox>
        {result?.outputs?.map((item) => (
          <AddressBox>
            <div>{PublicJS.addressToShow(item.address)}</div>
            <div>
              {formatUnit(item.capacity, "ckb")} {symbol}
            </div>
          </AddressBox>
        ))}
      </FeeBox>

      <TitleBox>{t("popup.send.TransactionFee")}</TitleBox>
      <SendBox>
        <div> </div>
        <div>
          {fee} {symbol}{" "}
        </div>
      </SendBox>
      {isDisable && <Tips>{t("popup.send.insufficient")}</Tips>}

      <BtnGroup>
        <Button border onClick={() => navigate("/")}>
          {t("popup.send.Reject")}
        </Button>
        <Button
          primary
          disabled={loading || isDisable}
          onClick={() => handleSubmit()}
        >
          {t("popup.send.Confirm")}
          {loading && <BtnLoading />}
        </Button>
      </BtnGroup>
    </ContentBox>
  );
}
