import TokenHeader from "../header/tokenHeader";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import Button from "../button/button";
import { useWeb3 } from "../../store/contracts";
import { useState } from "react";
import { formatUnit } from "@ckb-lumos/bi";
import useBalance from "../../hooks/useBalance";
import PublicJs from "../../utils/publicJS";
import Toast from "../modal/toast";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useNavigate } from "react-router-dom";
import MeltCluster from "./meltCluster";
import { Copy as CopyIcon } from "lucide-react";

const Box = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;
`;
const Content = styled.div`
  flex-grow: 1;
  margin: 10px 0 20px;
`;

const ImageBox = styled.div`
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .imgbr {
    width: 80vw;
    height: 80vw;
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
      img {
        width: 100%;
        height: 100%;
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
  padding: 0;
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
// const MeltBox = styled.div`
//     width: 100%;
//     text-align: center;
//     font-size: 12px;
//     margin-top: 10px;
//     cursor: pointer;
// `

export default function Cluster_detail() {
  const { t } = useTranslation();
  const {
    state: { cluster },
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
    navigate("/sendCluster");

    // toBackground()
  };

  const handleClose = () => {
    setShow(false);
  };
  // const handleShow = () =>{
  //     setShow(true)
  // }

  return (
    <Box>
      <Toast tips={t("popup.cluster.copied")} size={20} show={copied} />
      {show && <MeltCluster handleClose={handleClose} cluster={cluster} />}

      <TokenHeader title="Cluster Detail" />
      <Content>
        <DlBox>
          <dl>
            <dt>{t("popup.cluster.Type")}</dt>
            <dd className="medium-font">Spore Cluster</dd>
          </dl>
          <dl>
            <dt>{t("popup.cluster.ClusterId")}</dt>
            <dd className="medium-font">
              <span>{PublicJs.AddressToShow(cluster?.clusterId)}</span>
              <CopyToClipboard onCopy={() => Copy()} text={cluster?.clusterId}>
                <CopyIcon size={14} />
              </CopyToClipboard>
            </dd>
          </dl>
          <dl>
            <dt>{t("popup.cluster.ClusterName")}</dt>
            <dd className="medium-font">
              <span>{cluster.cluster.name}</span>
            </dd>
          </dl>
          {/*<dl>*/}
          {/*    <dt>{t('popup.cluster.ClusterDescription')}</dt>*/}
          {/*    <dd className="medium-font">*/}
          {/*        <span>{cluster.cluster.description}</span>*/}
          {/*    </dd>*/}
          {/*</dl>*/}

          <dl>
            <dt>{t("popup.cluster.occupied")}</dt>
            <dd className="medium-font">
              {formatUnit(cluster?.output?.capacity, "ckb")} {symbol}
            </dd>
          </dl>
        </DlBox>
        <ImageBox>
          <div className="line" />
          <Button primary onClick={() => toGo()}>
            {t("popup.cluster.Send")}
          </Button>
          {/*<MeltBox onClick={() => handleShow()}>Melt Cluster</MeltBox>*/}
          {/*api not support*/}
        </ImageBox>
      </Content>
    </Box>
  );
}
