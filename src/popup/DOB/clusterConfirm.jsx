import useAccountAddress from "../../hooks/useAccountAddress";
import { useWeb3 } from "../../store/contracts";
import CloseImg from "../../assets/images/close.png";
import Button from "../button/button";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import PublicJs from "../../utils/publicJS";
import { CopyToClipboard } from "react-copy-to-clipboard";
import CopyImg from "../../assets/images/create/COPY.png";
import { formatUnit } from "@ckb-lumos/bi";
import Toast from "../modal/toast";
import useBalance from "../../hooks/useBalance";
import TokenHeader from "../header/tokenHeader";
import Loading from "../loading/loading";
import useMessage from "../../hooks/useMessage";

const ContentBox = styled.div`
  flex-grow: 1;
  .line {
    background: #f8f8f8;
    width: 100%;
    height: 10px;
    margin-top: 20px;
  }
`;
const TitleBox = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #34332e;
  line-height: 20px;
  margin: 0 20px 10px;
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
  margin: 20px 20px 10px;
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

const DlBox = styled.div`
  margin: 0 auto;
  padding: 30px 20px;
  dl {
    margin-bottom: 10px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }
  dt {
    opacity: 0.6;
  }
  dd {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    img {
      cursor: pointer;
    }
  }
  .desc {
    margin-left: 20px;
  }
`;

export default function ClusterConfirm() {
  const { currentAccountInfo } = useAccountAddress();
  const {
    state: { cluster },
  } = useWeb3();
  const { symbol } = useBalance();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [address, setAddress] = useState("");
  const [search] = useSearchParams();
  const sendTo = search.get("sendTo");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [tips, setTips] = useState("");

  const handleEvent = (message) => {
    const { type } = message;
    switch (type) {
      case "send_Cluster_success":
        {
          setError(true);
          setTips("Send Finished");
          setTimeout(() => {
            setError(false);
            navigate(`/home?tab=0`);
          }, 2000);
        }
        break;
      case "send_Cluster_error":
        {
          setTips("Send Failed:" + message.data);
          setError(true);
          setLoading(false);
          setTimeout(() => {
            setError(false);
            navigate("/home");
          }, 2000);
        }
        break;
    }
  };

  const { sendMsg } = useMessage(handleEvent, []);

  useEffect(() => {
    setAddress(sendTo);
  }, [sendTo]);

  const ClearInput = () => {
    setAddress("");
  };

  const handleInput = (e) => {
    setAddress(e.target.value);
  };

  const Copy = () => {
    setError(true);
    setTips("Copied");
    setTimeout(() => {
      setError(false);
    }, 1500);
  };

  const submit = () => {
    setLoading(true);
    let obj = {
      method: "send_Cluster",
      outPoint: cluster.out_point,
      currentAccountInfo,
      toAddress: address,
    };
    sendMsg(obj);
  };

  return (
    <ContentBox>
      {loading && <Loading showBg={true} />}
      <Toast tips={tips} show={error} />
      <TokenHeader title={t("popup.send.send")} />
      <div>
        <TitleBox>{t("popup.send.sendTo")}</TitleBox>
        <SendInput>
          <textarea name="" value={address} onChange={(e) => handleInput(e)} />
          {!!address.length && (
            <img src={CloseImg} alt="" onClick={() => ClearInput()} />
          )}
        </SendInput>
        <div className="line" />
      </div>

      <DlBox>
        <dl>
          <dt>{t("popup.cluster.ClusterId")}</dt>
          <dd className="medium-font">
            <span>
              {cluster?.clusterId
                ? PublicJs.addressToShow(cluster?.clusterId)
                : ""}
            </span>
            <CopyToClipboard onCopy={() => Copy()} text={cluster?.clusterId}>
              <img src={CopyImg} alt="" />
            </CopyToClipboard>
          </dd>
        </dl>

        <dl>
          <dt>{t("popup.cluster.ClusterName")}</dt>
          <dd className="medium-font">{cluster?.cluster?.name}</dd>
        </dl>
        <dl>
          <dt>{t("popup.cluster.occupied")}</dt>
          <dd className="medium-font">
            {formatUnit(cluster?.output?.capacity, "ckb")} {symbol}
          </dd>
        </dl>
        <dl>
          <dt>{t("popup.cluster.Description")}</dt>
          <dd className="medium-font desc">{cluster?.cluster?.description}</dd>
        </dl>
      </DlBox>
      <BtnGroup>
        <Button border onClick={() => navigate("/home?tab=1")}>
          {t("popup.send.Reject")}
        </Button>
        <Button primary onClick={() => submit()}>
          {t("popup.send.Confirm")}
        </Button>
      </BtnGroup>
    </ContentBox>
  );
}
