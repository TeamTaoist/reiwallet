import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Loading from "../loading/loading";
import useBalance from "../../hooks/useBalance";
import SwapImg from "../../assets/images/exchange.svg";
import SengImg from "../../assets/images/send.svg";
import useNetwork from "../../hooks/useNetwork";

const BalanceBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 20px auto;
  .disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Title = styled.div`
  margin: 0 auto 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .total {
    font-size: 28px;
    font-weight: 500;
    color: #000000;
    line-height: 40px;
  }

  .subTitle,
  .titleTop {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-size: 14px;
    font-weight: 500;
    color: #000000;
    line-height: 1.5em;
    opacity: 0.4;
  }

  .subTitle {
    font-size: 12px;
  }

  .price {
    font-size: 16px;
    margin-top: 10px;
    color: #01774a;
  }
`;

const LoadingBox = styled.div`
  margin-top: 20px;
`;

const FlexBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  margin-top: 20px;
  //text-decoration: underline;
  cursor: pointer;
  gap: 30px;

  .btnLink {
    background: rgba(0, 0, 0, 0.03);
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    border-radius: 5px;
    text-decoration: none !important;
    border: 1px solid #eee;
  }
  img {
    width: 25px;
  }
`;

export default function Balance() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { balance, balanceLoading, available, symbol, occupied, price } =
    useBalance();
  const { network } = useNetwork();

  const toSend = () => {
    navigate("/send");
  };

  const handleExchange = () => {
    if (network === "testnet") return;
    navigate("/swap");
  };

  return (
    <BalanceBox>
      {balanceLoading && (
        <LoadingBox>
          <Loading showBg={false} />
        </LoadingBox>
      )}
      {!balanceLoading && (
        <Title className="medium-font">
          {/*<div className="titleTop">Total</div>*/}
          <div className="total">
            {balance} {symbol}
          </div>
          {!!Number(occupied) && (
            <>
              <div className="subTitle">
                <span>{t("popup.account.available")}</span>
                {available} {symbol}
              </div>
              <div className="subTitle">
                <span>{t("popup.account.occupied")}</span>
                {occupied} {symbol}
              </div>
            </>
          )}
          <div className="subTitle price">$ {price}</div>
        </Title>
      )}
      <FlexBox>
        <div className="btnLink" onClick={() => toSend()}>
          <img src={SengImg} />
          <span>{t("popup.account.send")}</span>
        </div>
        <div
          className={network === "testnet" ? "btnLink disabled" : "btnLink"}
          onClick={() => handleExchange()}
        >
          <img src={SwapImg} />
          <span>{t("popup.Swap")}</span>
        </div>
      </FlexBox>

      {/*<FlexBox onClick={()=>toHaste()}><span>haste</span>.pro &gt;</FlexBox>*/}
    </BalanceBox>
  );
}
