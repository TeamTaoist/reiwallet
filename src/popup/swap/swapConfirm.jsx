import styled from "styled-components";
import TokenHeader from "../header/tokenHeader";
import Avatar from "../svg/avatar/avatar";
import PublicJS from "../../utils/publicJS";
import FromImg from "../../assets/images/fromTo.png";
import Button from "../button/button";
import BtnLoading from "../loading/btnLoading";
import { useTranslation } from "react-i18next";
import { useWeb3 } from "../../store/contracts";
import useAccountAddress from "../../hooks/useAccountAddress";
import useBalance from "../../hooks/useBalance";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";

const Box = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f9fafa;
`;

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
  .symbol {
    text-transform: uppercase;
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
  .up {
    text-transform: uppercase;
  }
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

export default function SwapConfirm() {
  const {
    dispatch,
    state: { stealthex_token, exchangeObj },
  } = useWeb3();
  const { symbol } = useBalance();
  const navigate = useNavigate();
  const { currentAccountInfo } = useAccountAddress();
  const { t } = useTranslation();
  const fee = 0.001;

  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (!exchangeObj) return;
    const { amount, isMax } = exchangeObj;

    if (isMax) {
      let av = new BigNumber(Number(amount)).minus(fee);
      setAmount(av.toString());
    } else {
      setAmount(amount);
    }
  }, [exchangeObj]);

  const handleSubmit = () => {};

  return (
    <Box>
      <TokenHeader title="Swap" />

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
          <div>Estimating...</div>
        </FirstLine>
        <SendBox>
          <div>
            <div className="tit">{t("popup.send.Sending")}</div>
            <div className="number">{amount}</div>
          </div>
          <SymbolBox>{symbol}</SymbolBox>
        </SendBox>
        <FeeBox>
          <TitleBox>You Get</TitleBox>
          {exchangeObj?.address && (
            <AddressBox>
              <div>{PublicJS.addressToShow(exchangeObj?.address)}</div>
              <div>
                {exchangeObj?.amountTo}{" "}
                <div className="up">{exchangeObj?.to?.symbol}</div>
              </div>
            </AddressBox>
          )}
        </FeeBox>

        <TitleBox>{t("popup.send.TransactionFee")}</TitleBox>
        <SendBox>
          <div> </div>
          <div className="symbol">
            {fee} {symbol}
          </div>
        </SendBox>
        {/*{isDisable && <Tips>{t("popup.send.insufficient")}</Tips>}*/}

        <BtnGroup>
          <Button border onClick={() => navigate("/")}>
            {t("popup.send.Reject")}
          </Button>
          <Button primary disabled={true} onClick={() => handleSubmit()}>
            {t("popup.send.Confirm")}
            {/*{loading && <BtnLoading />}*/}
          </Button>
        </BtnGroup>
      </ContentBox>
    </Box>
  );
}
