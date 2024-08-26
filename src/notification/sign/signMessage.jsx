import { useSessionMessenger } from "../../hooks/useSessionMessenger";
import styled from "styled-components";
import Button from "../../popup/button/button";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import SignData from "../../wallet/signData";
import BtnLoading from "../../popup/loading/btnloading";

const Box = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
`;

const UrlBox = styled.div`
  background: #f8f8f8;
  padding: 10px;
  margin-bottom: 30px;
  word-break: break-all;
`;
const TitleBox = styled.div`
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 20px;
`;
const TipsBox = styled.div`
  font-size: 12px;
  margin-bottom: 30px;
`;

const SubTitle = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
`;

const MsgBox = styled.div`
  padding: 20px;
  background: #f8f8f8;
  word-break: break-all;
`;
const BtnGroup = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  button {
    width: 47%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
`;

export default function SignMessage() {
  const messenger = useSessionMessenger();
  const { t } = useTranslation();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!messenger) return;
    getDetail();
  }, [messenger]);

  const getDetail = async () => {
    if (messenger) {
      let rt = await messenger.send("get_signMessage");
      setDetail(rt);
    }
  };

  const handleClose = async () => {
    await messenger.send("signMessage_result", {
      status: "rejected",
      data: "user rejected",
    });
    window.close();
  };

  const submit = async () => {
    setLoading(true);
    try {
      let rt = await SignData.signByPrivateKey(detail.message);
      await messenger.send("signMessage_result", {
        status: "success",
        data: rt,
      });
    } catch (e) {
      console.error("signMessage_result", e);
      await messenger.send("signMessage_result", {
        status: "failed",
        data: e.message,
      });
    } finally {
      setLoading(false);
      window.close();
    }
  };

  return (
    <Box>
      <div>
        <UrlBox>{detail?.url}</UrlBox>
        <TitleBox>{t("notification.sign.title")}</TitleBox>
        <TipsBox>{t("notification.sign.tips")}</TipsBox>
        <SubTitle>{t("notification.sign.signing")}:</SubTitle>
        <MsgBox>{detail?.message}</MsgBox>
      </div>

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
