import { useSessionMessenger } from "../../useHook/useSessionMessenger";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Avatar from "../../components/svg/avatar/avatar";
import PublicJS from "../../utils/publicJS";
import FromImg from "../../assets/images/fromTo.png";
import useAccountAddress from "../../useHook/useAccountAddress";
import {
  getClusterByOutPoint,
  predefinedSporeConfigs,
  unpackToRawClusterData,
} from "@spore-sdk/core";
import useNetwork from "../../useHook/useNetwork";
import PublicJs from "../../utils/publicJS";
import { CopyToClipboard } from "react-copy-to-clipboard";
import CopyImg from "../../assets/images/create/COPY.png";
import { formatUnit } from "@ckb-lumos/bi";
import Button from "../../components/button/button";
import BtnLoading from "../../components/loading/btnloading";
import useBalance from "../../useHook/useBalance";
import Loading from "../../components/loading/loading";
import Toast from "../../components/modal/toast";
import useMessage from "../../useHook/useMessage";
import { useTranslation } from "react-i18next";

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
    img {
      cursor: pointer;
    }
  }
`;

// const ImageBox = styled.div`
//     margin: 0 auto;
//     width: 100%;
//     display: flex;
//     flex-direction: column;
//     justify-content: center;
//     align-items: center;
//     .imgbr{
//         width: 50px;
//         height: 50px;
//         border: 1px solid #eee;
//         border-radius: 4px;
//     }
//     .photo{
//
//         display: flex !important;
//         overflow: hidden;
//         .aspect {
//             padding-bottom: 100%;
//             height: 0;
//             flex-grow: 1 !important;
//         }
//         .content {
//             width: 100%;
//             margin-left: -100% !important;
//             max-width: 100% !important;
//             flex-grow: 1 !important;
//             position: relative;
//         }
//         .innerImg{
//             position: absolute;
//             width: 100%;
//             height: 100%;
//             img{
//                 width: 100%;
//                 height: 100%;
//                 border-radius: 4px;
//                 object-position: center;
//                 object-fit: cover;
//             }
//         }
//     }
// `
// const TextBox = styled.div`
//         display: flex !important;
//         overflow: hidden;
//         .aspect {
//             padding-bottom: 100%;
//             height: 0;
//             flex-grow: 1 !important;
//         }
//         .content {
//             width: 100%;
//             margin-left: -100% !important;
//             max-width: 100% !important;
//             flex-grow: 1 !important;
//             position: relative;
//         }
//         .inner{
//             position: absolute;
//             width: 100%;
//             height: 100%;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             background: #f8f8f8;
//             font-size: 12px;
//             font-family: "AvenirNext-Medium";
//             font-weight: 500;
//         }
//
// `

export default function SendCluster_detail() {
  const messenger = useSessionMessenger();
  const [params, setParams] = useState(null);
  const [url, setUrl] = useState("");
  const { currentAccountInfo } = useAccountAddress();
  const { network } = useNetwork();
  const [cluster, setCluster] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tips, setTips] = useState("");
  const { symbol } = useBalance();
  const [btnL, setBtnL] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (!messenger) return;
    getDetail();
  }, [messenger]);

  useEffect(() => {
    if (!params) return;
    getDOBDetail();
  }, [params]);

  const handleEvent = (message) => {
    const { type } = message;
    switch (type) {
      case "send_Cluster_success":
        {
          setError(true);
          setTips("Send Finished");

          const rt = message.data;
          handleSuccess(rt);
          setTimeout(() => {
            setError(false);
            setBtnL(false);
            window.close();
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
            setBtnL(false);
            handleError(message.data);
          }, 2000);
        }
        break;
    }
  };

  const handleError = async (error) => {
    await messenger.send("Cluster_transaction_result", {
      status: "rejected",
      data: error,
    });
    window.close();
  };

  const { sendMsg } = useMessage(handleEvent, []);

  const Copy = () => {
    setError(true);
    setTips("Copied");
    setTimeout(() => {
      setError(false);
    }, 1500);
  };

  const getDOBDetail = async () => {
    setLoading(true);
    const { index, txHash } = params?.outPoint;
    const outPoint = {
      index,
      txHash,
    };

    try {
      const rt = await getClusterByOutPoint(
        outPoint,
        network.value === "mainnet"
          ? predefinedSporeConfigs.Mainnet
          : predefinedSporeConfigs.Testnet,
      );
      const cluster = unpackToRawClusterData(rt.data, "v2");
      rt.clusterId = rt.cellOutput.type.args;
      rt.cluster = cluster;
      setCluster(rt);
    } catch (e) {
      setError(true);
      setTips(e.message);
      handleError(e.message);
    } finally {
      setLoading(false);
    }
  };
  const getDetail = async () => {
    if (messenger) {
      let data = await messenger.send("get_Cluster_Transaction");
      setParams(data.rt);
      setUrl(data.url);
    }
  };

  const handleSuccess = async (rt) => {
    try {
      await messenger.send("Cluster_transaction_result", {
        status: "success",
        data: rt,
      });
    } catch (e) {
      console.error("transaction_result", e);
      await messenger.send("Cluster_transaction_result", {
        status: "failed",
        data: e.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const submit = () => {
    setBtnL(true);
    const { index, txHash } = params?.outPoint;
    let obj = {
      method: "send_Cluster",
      outPoint: {
        index,
        tx_hash: txHash,
      },
      currentAccountInfo,
      toAddress: params?.to,
    };

    sendMsg(obj);
  };

  const handleClose = async () => {
    await messenger.send("Cluster_transaction_result", {
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

        <DlBox>
          <dl>
            <dt>{t("popup.cluster.ClusterId")}</dt>
            <dd className="medium-font">
              <span>
                {cluster?.clusterId
                  ? PublicJs.AddressToShow(cluster?.clusterId)
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
              {cluster?.cellOutput?.capacity
                ? formatUnit(cluster?.cellOutput?.capacity, "ckb")
                : 0}{" "}
              {symbol}
            </dd>
          </dl>
          <dl>
            <dt>{t("popup.cluster.ClusterDescription")}</dt>
            <dd className="medium-font desc">
              {cluster?.cluster?.description}
            </dd>
          </dl>
        </DlBox>
      </TopBox>
      <BtnGroup>
        <Button border onClick={() => handleClose()}>
          {t("notification.Reject")}
        </Button>
        <Button primary onClick={() => submit()}>
          {t("popup.step1.Confirm")}
          {btnL && <BtnLoading />}{" "}
        </Button>
      </BtnGroup>
    </Box>
  );
}
