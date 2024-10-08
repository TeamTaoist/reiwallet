import { useSessionMessenger } from "../../hooks/useSessionMessenger";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Avatar from "../../popup/svg/avatar/avatar";
import PublicJS from "../../utils/publicJS";
import FromImg from "../../assets/images/fromTo.png";
import useAccountAddress from "../../hooks/useAccountAddress";
import { CopyToClipboard } from "react-copy-to-clipboard";
import CopyImg from "../../assets/images/create/COPY.png";
import { formatUnit } from "@ckb-lumos/bi";
import Button from "../../popup/button/button";
import BtnLoading from "../../popup/loading/btnLoading";
import { predefined } from "@ckb-lumos/config-manager";
import Loading from "../../popup/loading/loading";
import Toast from "../../popup/modal/toast";
import useMessage from "../../hooks/useMessage";
import { ownerForSudt } from "@ckb-lumos/common-scripts/lib/sudt";

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
  margin-top: 10px;
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
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
`;

const DlBox = styled.div`
  margin: 0 auto;
  padding: 30px 20px;
  background: #f8f8f8;
  border-radius: 5px;
  dl {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  dt {
    opacity: 0.6;
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

export default function SendSUDTDetail() {
  const messenger = useSessionMessenger();
  const [params, setParams] = useState(null);
  const [url, setUrl] = useState("");
  const { currentAccountInfo } = useAccountAddress();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [tips, setTips] = useState("");
  const [btnL, setBtnL] = useState(false);
  const [fee, setFee] = useState("");

  useEffect(() => {
    if (!messenger || !currentAccountInfo?.address) return;
    getDetail();
  }, [messenger, currentAccountInfo]);

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
      case "send_sudt_success":
        {
          setError(true);

          const rt = message.data;
          handleSuccess(rt);
          setTips("Send Finished");
          setTimeout(() => {
            setError(false);
            window.close();
          }, 2000);
        }
        break;
      case "send_sudt_error":
        {
          setTips("Send Failed:" + message.data);
          setError(true);
          setLoading(false);
          setTimeout(() => {
            setError(false);
            window.close();
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

  const Copy = () => {
    setError(true);
    setTips("Copied");
    setTimeout(() => {
      setError(false);
    }, 1500);
  };

  const getDetail = async () => {
    if (messenger) {
      let data = await messenger.send("get_sudt_Transaction");

      const prefix = currentAccountInfo?.address.slice(0, 3);
      const config = prefix === "ckt" ? predefined.AGGRON4 : predefined.LINA;

      data.rt.argAddress = ownerForSudt(currentAccountInfo?.address, {
        config,
      });

      setParams(data.rt);
      setUrl(data.url);
    }
  };

  const handleSuccess = async (rt) => {
    try {
      await messenger.send("SUDT_transaction_result", {
        status: "success",
        data: rt,
      });
    } catch (e) {
      console.error("transaction_result", e);
      await messenger.send("SUDT_transaction_result", {
        status: "failed",
        data: e.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const submit = () => {
    setBtnL(true);
    let obj = {
      method: "send_sudt",
      amount: params?.amount,
      currentAccountInfo,
      args: params?.token,
      toAddress: params?.to,
      fee,
    };

    sendMsg(obj);
  };

  const handleClose = async () => {
    await messenger.send("SUDT_transaction_result", {
      status: "rejected",
      data: "user rejected",
    });
    window.close();
  };

  return (
    <Box>
      {loading && <Loading showBg={true} />}
      <Toast tips={tips} show={error} />
      <TopBox>
        <UrlBox>{url}</UrlBox>

        <FirstLine>
          <AvatarBox>
            <Avatar size={20} address={currentAccountInfo?.address} />
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
            <Avatar size={20} address={params?.to} />
            <div className="name">
              {params?.to ? PublicJS.addressToShow(params?.to) : ""}
            </div>
          </AvatarBox>
        </FirstLine>

        <DlBox>
          <dl>
            <dt>Token</dt>
            <dd>
              <span>
                {params?.token ? PublicJS.addressToShow(params?.token, 10) : ""}
              </span>
              <CopyToClipboard onCopy={() => Copy()} text={params?.token}>
                <img src={CopyImg} alt="" />
              </CopyToClipboard>
            </dd>
          </dl>
          <dl>
            <dt>Amount</dt>
            <dd>
              <span>{params?.amount}</span>
            </dd>
          </dl>
          <dl>
            <dt>Gas</dt>
            <dd>
              <span>{fee ? fee : "--"}</span> Shannons/kB
            </dd>
          </dl>
          <dl>
            <dt>Owner</dt>
            <dd>
              {params?.argAddress === params?.token && (
                <span className="tag">Yes</span>
              )}
              {params?.argAddress !== params?.token && (
                <span className="tag no">no</span>
              )}
            </dd>
          </dl>
        </DlBox>
      </TopBox>
      <BtnGroup>
        <Button border onClick={() => handleClose()}>
          Rejected
        </Button>
        <Button primary onClick={() => submit()}>
          Confirm{btnL && <BtnLoading />}{" "}
        </Button>
      </BtnGroup>
    </Box>
  );
}
