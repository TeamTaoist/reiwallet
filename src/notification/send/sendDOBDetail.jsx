import { useSessionMessenger } from "../../hooks/useSessionMessenger";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Avatar from "../../popup/svg/avatar/avatar";
import PublicJS from "../../utils/publicJS";
import FromImg from "../../assets/images/fromTo.png";
import useAccountAddress from "../../hooks/useAccountAddress";
import { getSporeByOutPoint, predefinedSporeConfigs } from "@spore-sdk/core";
import useNetwork from "../../hooks/useNetwork";
import PublicJs from "../../utils/publicJS";
import { CopyToClipboard } from "react-copy-to-clipboard";
import CopyImg from "../../assets/images/create/COPY.png";
import { formatUnit } from "@ckb-lumos/bi";
import Button from "../../popup/button/button";
import BtnLoading from "../../popup/loading/btn_loading";
import useBalance from "../../hooks/useBalance";
import Loading from "../../popup/loading/loading";
import Toast from "../../popup/modal/toast";
import useMessage from "../../hooks/useMessage";
import { useTranslation } from "react-i18next";
import { decodeDOB } from "@taoist-labs/dob-decoder";

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

const ImageBox = styled.div`
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .imgbr {
    width: 50px;
    height: 50px;
    border: 1px solid #eee;
    border-radius: 4px;
  }
  .photo {
    display: flex !important;
    overflow: hidden;
    .aspect {
      padding-bottom: 100%;
      height: 0;
      flex-grow: 1 !important;
    }
    .content {
      width: 100%;
      margin-left: -100% !important;
      max-width: 100% !important;
      flex-grow: 1 !important;
      position: relative;
    }
    .innerImg {
      position: absolute;
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
        border-radius: 4px;
        object-position: center;
        object-fit: cover;
      }
    }
  }
`;
const TextBox = styled.div`
  display: flex !important;
  overflow: hidden;
  .aspect {
    padding-bottom: 100%;
    height: 0;
    flex-grow: 1 !important;
  }
  .content {
    width: 100%;
    margin-left: -100% !important;
    max-width: 100% !important;
    flex-grow: 1 !important;
    position: relative;
  }
  .inner {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8f8f8;
    font-size: 12px;
    font-family: "AvenirNext-Medium";
    font-weight: 500;
  }
`;

export default function SendDOB_detail() {
  const messenger = useSessionMessenger();
  const [params, setParams] = useState(null);
  const [url, setUrl] = useState("");
  const { currentAccountInfo } = useAccountAddress();
  const { network } = useNetwork();
  const [dobDetail, setDobDetail] = useState(null);
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
      case "send_DOB_success":
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
      case "send_DOB_error":
        {
          setTips("Send Failed:" + message.data);
          setError(true);
          setLoading(false);
          setTimeout(() => {
            setError(false);
            setBtnL(false);
            handleError("Send Failed:" + message.data);
          }, 2000);
        }
        break;
    }
  };

  const handleError = async (error) => {
    await messenger.send("DOB_transaction_result", {
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
      const rt = await getSporeByOutPoint(
        outPoint,
        network === "mainnet"
          ? predefinedSporeConfigs.Mainnet
          : predefinedSporeConfigs.Testnet,
      );

      const itemDobId = rt.cellOutput.type.args;
      try {
        const asset = await decodeDOB(
          itemDobId,
          network === "testnet",
          rt.data,
        );
        rt.asset = asset;
      } catch (e) {
        console.error("Get dob info failed", e);
      }

      // let spore =  unpackToRawSporeData(rt.data)
      // const buffer = Buffer.from(spore.content.toString().slice(2), 'hex');
      // const base64 = Buffer.from(buffer, "binary" ).toString("base64");
      // rt.type = spore.contentType;
      // if( rt.type.indexOf("text") > -1){
      //     rt.text =  Buffer.from(buffer, "binary" ).toString()
      // }else{
      //     rt.image = `data:${spore.contentType};base64,${base64}`;
      // }
      //
      // rt.clusterId =  spore.clusterId;
      setDobDetail(rt);
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
      let data = await messenger.send("get_DOB_Transaction");
      setParams(data.rt);
      setUrl(data.url);
    }
  };

  const handleSuccess = async (rt) => {
    try {
      await messenger.send("DOB_transaction_result", {
        status: "success",
        data: rt,
      });
    } catch (e) {
      console.error("transaction_result", e);
      await messenger.send("DOB_transaction_result", {
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
      method: "send_DOB",
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
    await messenger.send("DOB_transaction_result", {
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
            <dt>{t("popup.send.Assets")}</dt>
            <dd>
              <ImageBox>
                <div className="imgbr">
                  {dobDetail?.asset?.contentType?.indexOf("image") > -1 && (
                    <div className="photo">
                      <div className="aspect" />
                      <div className="content">
                        <div className="innerImg">
                          <img src={dobDetail?.asset?.data} alt="" />
                        </div>
                      </div>
                    </div>
                  )}
                  {dobDetail?.asset?.contentType?.indexOf("text") > -1 && (
                    <TextBox>
                      <div className="aspect" />
                      <div className="content">
                        <div className="inner">{dobDetail?.asset?.data}</div>
                      </div>
                    </TextBox>
                  )}
                  {dobDetail?.asset?.contentType?.indexOf("json") > -1 && (
                    <div className="photo">
                      <div className="aspect" />
                      <div className="content">
                        <div className="innerImg">
                          <img src={dobDetail?.asset?.data?.url} alt="" />
                        </div>
                      </div>
                    </div>
                  )}

                  {dobDetail?.asset?.contentType?.indexOf("dob/0") > -1 && (
                    <div className="photo">
                      <div className="aspect" />
                      <div className="content">
                        <div className="innerImg">
                          <img src={dobDetail?.asset?.data?.imgUrl} alt="" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ImageBox>
            </dd>
          </dl>
          {!!dobDetail?.asset?.clusterId && (
            <dl>
              <dt>{t("popup.send.ClusterId")}</dt>
              <dd className="medium-font">
                <span>
                  {PublicJs.AddressToShow(dobDetail?.asset?.clusterId)}
                </span>
                <CopyToClipboard
                  onCopy={() => Copy()}
                  text={dobDetail?.asset?.clusterId}
                >
                  <img src={CopyImg} alt="" />
                </CopyToClipboard>
              </dd>
            </dl>
          )}

          <dl>
            <dt>{t("popup.send.TokenID")}</dt>
            <dd className="medium-font">
              <span>
                {dobDetail?.cellOutput?.type?.args
                  ? PublicJs.AddressToShow(dobDetail?.cellOutput?.type?.args)
                  : ""}
              </span>
              <CopyToClipboard
                onCopy={() => Copy()}
                text={dobDetail?.cellOutput?.type?.args}
              >
                <img src={CopyImg} alt="" />
              </CopyToClipboard>
            </dd>
          </dl>
          <dl>
            <dt>{t("popup.send.occupied")}</dt>
            <dd className="medium-font">
              {dobDetail?.cellOutput?.capacity
                ? formatUnit(dobDetail?.cellOutput?.capacity, "ckb")
                : 0}{" "}
              {symbol}
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
