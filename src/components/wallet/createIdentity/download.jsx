import DashboardLayout from "../../dashboard/layout";
import Button from "../../button/button";
import ContainerLayout, {
  ContainerTitle,
} from "../../dashboard/containerLayout";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import html2canvas from "html2canvas";
import { useEffect, useState } from "react";
import { useWeb3 } from "../../../store/contracts";

const ContainerContentStyled = styled.div``;

const Box = styled.div`
  padding: 20px;
  dl {
    display: flex;
    align-items: flex-start;
    margin-bottom: 9px;
    font-size: 12px;
    line-height: 16px;

    dt {
      text-align: right;
      color: #97a0c3;
      flex-shrink: 0;
      white-space: nowrap;
      margin-right: 20px;
      line-height: 20px;
    }
    dd {
      word-break: break-all;
      flex-grow: 1;
      color: #242f57;
      line-height: 20px;
      img {
        height: 20px;
        line-height: 20px;
        display: inline-block;
        margin-bottom: -5px;
        cursor: pointer;
      }
    }
  }
`;
const DownloadBox = styled.div`
  margin: 24px -20px 0;
  min-height: 130px;
  background: #f1fcf1;
  border-radius: 14px;
  padding: 20px 0 20px 20px;
  display: flex;
  flex-wrap: wrap;
  span {
    padding-right: 20px;
  }
`;

export default function Download() {
  const { t } = useTranslation();
  const { state } = useWeb3();
  const { mnemonic, account } = state;

  const [mnemonicStr, setMnemonicStr] = useState([]);

  useEffect(() => {
    if (mnemonic == null) return;
    setMnemonicStr(mnemonic);
  }, [mnemonic]);

  const download = () => {
    html2canvas(document.getElementById("downloadBox"), {
      allowTaint: false,
      useCORS: true,
    }).then(function (canvas) {
      // toImage
      const dataImg = new Image();
      dataImg.src = canvas.toDataURL("image/png");
      const alink = document.createElement("a");
      alink.href = dataImg.src;
      const time = new Date().valueOf();
      alink.download = `Mnemonic_${time}.jpg`;
      alink.click();
    });
  };

  return (
    <DashboardLayout>
      <ContainerLayout
        button={
          <Button primary fullWidth onClick={() => download()}>
            {t("install.create.download.download")}
          </Button>
        }
      >
        <ContainerContentStyled>
          <ContainerTitle
            title={t("install.create.download.title")}
            subTitle={t("install.create.download.tips")}
          />
          <Box id="downloadBox">
            <div className="top">
              <dl>
                <dt>{t("install.create.download.walletAddress")}</dt>
                {/*<dd>{account.address_main}<img src={CopyImg} alt=""/></dd>*/}
                <dd>{account.address_main}</dd>
              </dl>
              {/*<dl>*/}
              {/*    <dt>{t('install.create.download.PrivateKey')}</dt>*/}
              {/*    /!*<dd>h6NjcnalSyOyNTajZXhOw6F42Ss30G9maGhwUXZYTIQOHdnoXnZKzJPUWcOSGOyMm9uMk1mYnZLdV9pbkVMalNiUHVDQm9RVEFOeHIZZ3Z1a0Wna2V5X29wc5KoZGVvaXZIS2V5amRIcmI2ZUJpdHOja3R50kVDoWTZK1ZoZihydlpZT1AyMFIHU <img src={CopyImg} alt=""/></dd>*!/*/}
              {/*</dl>*/}
            </div>
            <DownloadBox>
              {mnemonicStr.map((item, index) => (
                <span key={index}>{item}</span>
              ))}
            </DownloadBox>
          </Box>
        </ContainerContentStyled>
      </ContainerLayout>
    </DashboardLayout>
  );
}
