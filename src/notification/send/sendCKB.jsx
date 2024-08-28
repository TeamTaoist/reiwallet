import { useSessionMessenger } from "../../hooks/useSessionMessenger";
import styled from "styled-components";
import Button from "../../popup/button/button";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import BtnLoading from "../../popup/loading/btn_loading";
import Avatar from "../../popup/svg/avatar/avatar";
import PublicJS from "../../utils/publicJS";
import FromImg from "../../assets/images/fromTo.png";
import { formatUnit } from "@ckb-lumos/bi";
import useBalance from "../../hooks/useBalance";
import useAccountAddress from "../../hooks/useAccountAddress";
import useMessage from "../../hooks/useMessage";
import Loading from "../../popup/loading/loading";
import Toast from "../../popup/modal/toast";
import { BI } from "@ckb-lumos/lumos";

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  box-sizing: border-box;
  height: 100vh;
  overflow-y: auto;
`;
const TopBox = styled.div`
  width: 100%;
`;

const UrlBox = styled.div`
  background: #f8f8f8;
  padding: 10px;
  margin-bottom: 30px;
  word-break: break-all;
`;
const FirstLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  gap: 10px;
`;
const AvatarBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;
const SendBox = styled.div`
  background: #f8f8f8;
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
  background: #f8f8f8;
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
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
  button {
    width: 47%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
`;

export default function SendCKB() {
  const messenger = useSessionMessenger();
  const { currentAccountInfo } = useAccountAddress();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  // const [address,setAddress] = useState('')
  // const [amount,setAmount] = useState('')
  // const [fee,setFee] = useState(0)
  const [result, setResult] = useState(null);
  const { symbol } = useBalance();
  const [params, setParams] = useState(null);
  const [url, setUrl] = useState("");
  const [error, setError] = useState(false);
  const [tips, setTips] = useState("");
  const [fee, setFee] = useState(0);
  const [feeRate, setFeeRate] = useState(0);

  useEffect(() => {
    toBackground();
  }, []);

  const toBackground = () => {
    let obj = {
      method: "get_feeRate",
    };
    sendMsg(obj);
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
      outputsSum = outputsSum.add(capacity);
    });

    let gas = inputsSum.sub(outputsSum);
    let gasFormat = formatUnit(gas, "ckb");
    setFee(gasFormat);
  }, [result]);

  const handleEvent = (message) => {
    const { type } = message;
    switch (type) {
      case "get_feeRate_success":
        {
          const { median } = message.data;
          let rt = formatUnit(median, "shannon");
          setFeeRate(rt);
        }
        break;
      case "send_transaction_success":
        {
          const rt = message.data;
          setResult(rt);
          setLoading(false);
        }
        break;
      case "transaction_confirm_success":
        {
          const rt = message.data;
          handleSuccess(rt);
          // navigate("/")
          setError(true);
          setTips("Send Success");
          setLoading(false);
          setTimeout(() => {
            setError(false);
          }, 2000);
        }
        break;
      case "send_transaction_error":
        {
          setTips(message.data ?? "Send Failed");
          setError(true);
          setLoading(false);
          setTimeout(() => {
            setError(false);
            handleError(message.data ?? "Send Failed");
          }, 2000);
        }
        break;
      case "transaction_confirm_error":
        {
          setTips(message.data ?? "Send Failed");
          setError(true);
          setLoading(false);
          setTimeout(() => {
            setError(false);
            handleError(message.data ?? "Send Failed");
          }, 2000);
        }
        break;
    }
  };

  const handleError = async (error) => {
    await messenger.send("CKB_transaction_result", {
      status: "rejected",
      data: error,
    });
    window.close();
  };

  const { sendMsg } = useMessage(handleEvent, []);

  useEffect(() => {
    if (!messenger) return;
    getDetail();
  }, [messenger]);

  useEffect(() => {
    if (!params || !feeRate) return;
    getTXDetail();
  }, [params, feeRate]);

  const getTXDetail = () => {
    setLoading(true);
    const { amount, to } = params;
    let obj = {
      method: "send_transaction",
      to,
      amount,
      isMax: false,
      fee: feeRate,
    };
    sendMsg(obj);
  };

  const getDetail = async () => {
    if (messenger) {
      let data = await messenger.send("get_CKB_Transaction");
      setParams(data.rt);
      setUrl(data.url);
    }
  };

  const handleSuccess = async (rt) => {
    try {
      await messenger.send("CKB_transaction_result", {
        status: "success",
        data: rt,
      });
    } catch (e) {
      console.error("transaction_result", e);
      await messenger.send("CKB_transaction_result", {
        status: "failed",
        data: e.message,
      });
    } finally {
      setLoading(false);
      window.close();
    }
  };

  //
  const handleClose = async () => {
    await messenger.send("CKB_transaction_result", {
      status: "rejected",
      data: "user rejected",
    });
    window.close();
  };

  const submit = async () => {
    setLoading(true);

    let obj = {
      method: "transaction_confirm",
      tx: result?.signedTx,
    };
    sendMsg(obj);
  };

  return (
    <Box>
      {loading && <Loading showBg={true} />}
      <Toast tips={tips} left="80" top="400" show={error} />
      <TopBox>
        <UrlBox>{url}</UrlBox>
        <FirstLine>
          <AvatarBox>
            <Avatar size={20} address={currentAccountInfo?.address} />
            <div className="name">
              {currentAccountInfo?.address
                ? PublicJS.AddressToShow(currentAccountInfo?.address)
                : ""}
            </div>
          </AvatarBox>
          <div>
            <img src={FromImg} alt="" />
          </div>
          <AvatarBox>
            <Avatar size={20} address={params?.to} />
            <div className="name">
              {params?.to ? PublicJS.AddressToShow(params?.to) : ""}
            </div>
          </AvatarBox>
        </FirstLine>
        <SendBox>
          <div>
            <div className="tit">{t("popup.send.Sending")}</div>
            <div className="number">{params?.amount}</div>
          </div>
          <SymbolBox>{symbol}</SymbolBox>
        </SendBox>
        <FeeBox>
          <TitleBox>{t("popup.send.Inputs")}</TitleBox>
          {result?.inputs?.map((item) => (
            <AddressBox>
              <div>{PublicJS.AddressToShow(item.address)}</div>
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
              <div>{PublicJS.AddressToShow(item.address)}</div>
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
      </TopBox>
      <BtnGroup>
        <Button border onClick={() => handleClose()}>
          {t("popup.step1.cancel")}
        </Button>
        <Button primary disabled={loading} onClick={() => submit()}>
          {t("popup.step1.Confirm")} {loading && <BtnLoading />}
        </Button>
      </BtnGroup>
    </Box>
  );
}
