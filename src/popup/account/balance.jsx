import styled from "styled-components";
import Button from "../button/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Loading from "../loading/loading";
import useBalance from "../../hooks/useBalance";

const BalanceBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 20px auto;
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
`;

const LoadingBox = styled.div`
  margin-top: 20px;
`;

// const FlexBox = styled.div`
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     font-size: 14px;
//     margin-top: 20px;
//     text-decoration: underline;
//     cursor: pointer;
//     span{
//         text-transform: uppercase;
//     }
//
// `

export default function Balance() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { balance, balanceLoading, available, symbol, occupied } = useBalance();

  const toSend = () => {
    navigate("/send");
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
        </Title>
      )}
      <Button primary onClick={() => toSend()}>
        {t("popup.account.send")}
      </Button>

      {/*<FlexBox onClick={()=>toHaste()}><span>haste</span>.pro &gt;</FlexBox>*/}
    </BalanceBox>
  );
}
