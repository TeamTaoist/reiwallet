import TokenHeader from "../header/tokenHeader";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import Button from "../button/button";
import { useWeb3 } from "../../store/contracts";
import { useState } from "react";
import { formatUnit } from "@ckb-lumos/bi";

import Toast from "../modal/toast";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useNavigate } from "react-router-dom";
import PublicJS from "../../utils/publicJS";
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
//             font-size: 14px;
//             font-family: "AvenirNext-Medium";
//             font-weight: 500;
//
//
//             line-height: 28px;
//             box-sizing: border-box;
//             padding: 20px;
//
//             word-break: break-all;
//             text-overflow: ellipsis;
//             display: -webkit-box;
//             -webkit-box-orient: vertical;
//             -webkit-line-clamp: 10;
//             overflow: hidden;
//         }
//
// `

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
  .rhtName {
    text-transform: uppercase;
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
// const MeltBox = styled.div`
//     width: 100%;
//     text-align: center;
//     font-size: 12px;
//     margin-top: 10px;
//     cursor: pointer;
// `

const TipsBtmBox = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

export default function XUDTDetail() {
  const { t } = useTranslation();
  const {
    state: { xudt },
  } = useWeb3();
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  // const [show,setShow]= useState(false)

  const Copy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  const toGo = () => {
    navigate("/sendXUDT");

    // toBackground()
  };

  // const handleClose = () =>{
  //     setShow(false)
  // }

  return (
    <Box>
      <Toast tips="copied" size={20} show={copied} />

      <TokenHeader title={t("popup.xudt.XUDTDetail")} />
      <Content>
        <DlBox>
          <dl>
            <dt>Token</dt>
            <dd>
              <span>{PublicJS.addressToShow(xudt.output?.type?.args, 10)}</span>
              <CopyToClipboard
                onCopy={() => Copy()}
                text={xudt.output?.type?.args}
              >
                <CopyIcon size={14} />
              </CopyToClipboard>
            </dd>
          </dl>
          <dl>
            <dt>{t("popup.xudt.Name")}</dt>
            <dd>
              <span className="rhtName">{xudt?.name}</span>
            </dd>
          </dl>
          <dl>
            <dt>{t("popup.xudt.Symbol")}</dt>
            <dd>
              <span className="rhtName">{xudt?.symbol}</span>
            </dd>
          </dl>
          <dl>
            <dt>{t("popup.xudt.Decimals")}</dt>
            <dd>
              <span>{xudt?.decimal}</span>
            </dd>
          </dl>
          <dl>
            <dt>{t("popup.xudt.Balance")}</dt>
            <dd>
              <span>
                {xudt?.sum ? formatUnit(xudt.sum.toString(), "ckb") : 0}
              </span>
            </dd>
          </dl>

          {/*<dl>*/}
          {/*    <dt>Owner</dt>*/}
          {/*    <dd>*/}
          {/*        {*/}
          {/*            xudt?.argAddress === xudt.output.type.args && <span className="tag">Yes</span>*/}
          {/*        }*/}
          {/*        {*/}
          {/*            xudt?.argAddress !== xudt.output.type.args && <span className="tag no">no</span>*/}
          {/*        }*/}
          {/*    </dd>*/}
          {/*</dl>*/}
        </DlBox>
        <ImageBox>
          <div className="line" />
          <Button primary onClick={() => toGo()}>
            {t("popup.xudt.Send")}
          </Button>
          {/*<MeltBox onClick={() => handleShow()}>Melt Cluster</MeltBox>*/}
        </ImageBox>
        <TipsBtmBox>{t("popup.xudt.xudtTips")}</TipsBtmBox>
      </Content>
    </Box>
  );
}
