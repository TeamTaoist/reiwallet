import CloseImg from "../../assets/images/close.png";
import Button from "../button/button";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { CopyToClipboard } from "react-copy-to-clipboard";
import useAccountAddress from "../../hooks/useAccountAddress";
import TokenHeader from "../header/tokenHeader";
import { useWeb3 } from "../../store/contracts";
import PublicJS from "../../utils/publicJS";
import Toast from "../modal/toast";
import useMessage from "../../hooks/useMessage";
import Loading from "../loading/loading";
import { formatUnit } from "@ckb-lumos/bi";
import { Copy as Copy2 } from "lucide-react";

const Box = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f9fafa;
`;

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
    appearance: textfield;
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    &:focus {
      outline: none;
    }
  }
  .symbol {
    text-transform: uppercase;
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

const TokenBox = styled.div`
  padding: 10px;
  dl {
    width: 100%;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  dd {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    img {
      cursor: pointer;
    }
  }
  .tag {
    font-size: 10px;
    background: #00ff9d;
    padding: 2px 4px;
    line-height: 10px;
    border-radius: 4px;
    height: 14px;
    box-sizing: border-box;
    text-transform: uppercase;
    &.no {
      background: #c9233a;
      color: #fff;
    }
  }
`;

export default function SendXUDTConfirm() {
  const [amount, setAmount] = useState("");
  const { t } = useTranslation();
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [search] = useSearchParams();
  const sendTo = search.get("sendTo");
  const navigate = useNavigate();
  const { currentAccountInfo } = useAccountAddress();
  const {
    state: { xudt },
  } = useWeb3();
  const [error, setError] = useState(false);
  const [tips, setTips] = useState("");
  const [loading, setLoading] = useState(false);
  const [fee, setFee] = useState("");

  const handleEvent = (message) => {
    const { type } = message;
    switch (type) {
      case "get_fee_rate_success":
        {
          const { median } = message.data;
          let rt = formatUnit(median, "shannon");
          setFee(rt);
        }
        break;
      case "send_xudt_success":
        {
          setError(true);
          setTips("Send Finished");
          setTimeout(() => {
            setError(false);
            navigate(`/home?tab=0`);
          }, 2000);
        }
        break;
      case "send_xudt_error":
        {
          setTips("Send Failed:" + message.data);
          setError(true);
          setLoading(false);
          setTimeout(() => {
            setError(false);
            // navigate("/home")
          }, 2000);
        }
        break;
    }
  };

  const { sendMsg } = useMessage(handleEvent, []);

  useEffect(() => {
    toBackground();
    const timer = setInterval(() => {
      toBackground();
    }, 10 * 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const toBackground = () => {
    let obj = {
      method: "get_fee_rate",
    };
    sendMsg(obj);
  };

  useEffect(() => {
    setAddress(sendTo);
  }, [sendTo]);

  useEffect(() => {
    if (!xudt) return;
    setBalance(xudt?.sum ? formatUnit(xudt?.sum.toString(), "ckb") : 0);
  }, [xudt]);

  const chooseMax = () => {
    setAmount(balance);
  };
  const handleInput = (e) => {
    setAddress(e.target.value);
  };
  const ClearInput = () => {
    setAddress("");
  };
  const handleAmount = (e) => {
    setAmount(e.target.value);
  };

  const Copy = () => {
    setTips("Copied");
    setError(true);
    setTimeout(() => {
      setError(false);
    }, 1500);
  };

  const submit = () => {
    setLoading(true);
    let obj = {
      method: "send_xudt",
      currentAccountInfo,
      toAddress: address,
      args: xudt.output?.type?.args,
      typeScript: xudt.output?.type,
      amount,
      fee,
    };
    sendMsg(obj);
  };

  const checkDisabled = () => {
    let result = false;
    if (amount <= 0 || !address?.length) {
      result = true;
    } else if (currentAccountInfo.address.startsWith("ckt")) {
      if (!(address.startsWith("tb") || address.startsWith("ckt"))) {
        result = true;
      }
    } else if (currentAccountInfo.address.startsWith("ckb")) {
      if (!(address.startsWith("bc") || address.startsWith("ckb"))) {
        result = true;
      }
    }
    return result;
  };
  return (
    <Box>
      <TokenHeader title={t("popup.send.send")} />

      {loading && <Loading showBg={true} />}
      <Toast tips={tips} show={error} />
      <ContentBox>
        <div>
          <TitleBox>{t("popup.send.sendTo")}</TitleBox>
          <SendInput>
            <textarea
              name=""
              value={address}
              onChange={(e) => handleInput(e)}
            />
            {!!address.length && (
              <img src={CloseImg} alt="" onClick={() => ClearInput()} />
            )}
          </SendInput>
        </div>
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
                {t("popup.send.Amount")}: <span>{balance}</span>
                <span className="symbol">{xudt?.symbol}</span>
              </div>
            </div>
          </AmountBox>
        </div>

        <Gas>
          <div className="item">
            <WhiteInput>
              <div className="title">{t("popup.send.feeRate")}</div>
              <div className="num">
                <span>{fee ? fee : "--"}</span> Shannons/kB
              </div>
            </WhiteInput>
          </div>
        </Gas>
        <TokenBox>
          <dl>
            <dt>Token</dt>
            <dd>
              <span>{PublicJS.addressToShow(xudt.output?.type?.args, 10)}</span>
              <CopyToClipboard
                onCopy={() => Copy()}
                text={xudt.output?.type?.args}
              >
                <Copy2 size={16} />
              </CopyToClipboard>
            </dd>
          </dl>
        </TokenBox>
        <BtnGroup>
          <Button border onClick={() => navigate("/")}>
            {t("popup.send.cancel")}
          </Button>
          <Button primary disabled={checkDisabled()} onClick={() => submit()}>
            {t("popup.send.send")}
          </Button>
        </BtnGroup>
      </ContentBox>
    </Box>
  );
}
