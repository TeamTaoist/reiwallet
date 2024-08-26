import TokenHeader from "../header/tokenHeader";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import Button from "../button/button";
import { useWeb3 } from "../../store/contracts";
import { useState } from "react";
import { formatUnit } from "@ckb-lumos/bi";
import useBalance from "../../useHook/useBalance";
import PublicJs from "../../utils/publicJS";
import { Copy as CopyIcon } from "lucide-react";
import Toast from "../modal/toast";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useNavigate } from "react-router-dom";
import Melt from "./melt";
import ErrorImg from "../../assets/images/error_image.svg";

const Box = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;
`;
const Content = styled.div`
  flex-grow: 1;
  margin: 20px 0;
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
    font-size: 14px;
    font-family: "AvenirNext-Medium";
    font-weight: 500;

    line-height: 28px;
    box-sizing: border-box;
    padding: 20px;

    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 10;
    overflow: hidden;
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
    width: 85vw;
    height: 85vw;
    border: 1px solid #eee;
    border-radius: 10px;
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
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        max-width: 100%;
        max-height: 100%;
        border-radius: 8px;
        object-position: center;
        object-fit: cover;
      }
    }
  }
  .line {
    background: #f8f8f8;
    width: 100%;
    height: 10px;
    margin-top: 20px;
  }
  button {
    width: 80vw;
    margin-top: 20px;
  }
`;
const DlBox = styled.div`
  width: 85vw;
  margin: 0 auto;
  padding: 30px 0;
  font-size: 14px;
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
`;
const MeltBox = styled.div`
  width: 100%;
  text-align: center;
  font-size: 12px;
  margin-top: 10px;
  cursor: pointer;
`;

export default function DOB_detail() {
  const { t } = useTranslation();
  const {
    state: { dob },
  } = useWeb3();
  const { symbol } = useBalance();
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const Copy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  const toGo = () => {
    navigate("/sendDOB");

    // toBackground()
  };

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };

  return (
    <Box>
      <Toast tips={t("popup.dob.copied")} size={20} show={copied} />
      {show && <Melt handleClose={handleClose} dob={dob} />}

      <TokenHeader title={t("popup.dob.DOBDetail")} />
      <Content>
        <ImageBox>
          <div className="imgbr">
            {dob.asset.contentType.indexOf("image") > -1 && (
              <div className="photo">
                <div className="aspect" />
                <div className="content">
                  <div className="innerImg">
                    <img
                      src={dob.asset.data ? dob.asset.data : ErrorImg}
                      alt=""
                    />
                  </div>
                </div>
              </div>
            )}
            {dob.asset.contentType.indexOf("text") > -1 && (
              <TextBox>
                <div className="aspect" />
                <div className="content">
                  <div className="inner">{dob.asset.data}</div>
                </div>
              </TextBox>
            )}
            {dob.asset.contentType.indexOf("json") > -1 && (
              <div className="photo">
                <div className="aspect" />
                <div className="content">
                  <div className="innerImg">
                    <img src={dob.asset.data.url} alt="" />
                  </div>
                </div>
              </div>
            )}

            {(dob.asset.contentType.indexOf("dob/0") > -1 ||
              dob.asset.contentType?.indexOf("DID") > -1) && (
              <div className="photo">
                <div className="aspect" />
                <div className="content">
                  <div className="innerImg">
                    <img src={dob.asset.data.imgUrl} alt="" />
                  </div>
                </div>
              </div>
            )}
          </div>
          <Button primary onClick={() => toGo()}>
            {t("popup.dob.Send")}
          </Button>
          {dob.asset.contentType?.indexOf("DID") === -1 && (
            <MeltBox onClick={() => handleShow()}>
              {t("popup.dob.MeltDOB")}
            </MeltBox>
          )}

          <div className="line" />
        </ImageBox>
        <DlBox>
          {/*<dl>*/}
          {/*    <dt>Type</dt>*/}
          {/*    <dd className="medium-font">{dob?.clusterId ? "Spore Cluster" : "DOB"}</dd>*/}
          {/*</dl>*/}
          {!!dob?.asset.clusterId && (
            <dl>
              <dt>{t("popup.dob.ClusterId")}</dt>
              <dd className="medium-font">
                <span>{PublicJs.AddressToShow(dob?.asset.clusterId)}</span>
                <CopyToClipboard
                  onCopy={() => Copy()}
                  text={dob?.asset.clusterId}
                >
                  <CopyIcon size={14} />
                </CopyToClipboard>
              </dd>
            </dl>
          )}

          <dl>
            <dt>{t("popup.dob.TokenID")}</dt>
            <dd className="medium-font">
              <span>{PublicJs.AddressToShow(dob?.output?.type?.args)}</span>
              <CopyToClipboard
                onCopy={() => Copy()}
                text={dob?.output?.type?.args}
              >
                {/*<img src={CopyImg} alt=""/>*/}
                <CopyIcon size={14} />
              </CopyToClipboard>
            </dd>
          </dl>
          <dl>
            <dt>{t("popup.dob.capacity")}</dt>
            <dd className="medium-font">
              {formatUnit(dob?.output?.capacity, "ckb")} {symbol}
            </dd>
          </dl>
        </DlBox>
      </Content>
    </Box>
  );
}
