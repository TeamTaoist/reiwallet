import NavHeader from "../../header/navHeader";
import { useTranslation } from "react-i18next";
import ImportHeader from "./importHeader";
import styled from "styled-components";
import Button from "../../button/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Wallet from "../../../wallet/wallet";
import useWalletList from "../../../hooks/useWalletList";
import Keystore from "../../../wallet/keystore";
import BtnLoading from "../../loading/btnLoading";
import { clearPassword, getPassword } from "../../../wallet/password";
import Toast from "../../modal/toast";

const Box = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;
const ContentBox = styled.div`
  flex-grow: 1;
  padding: 20px;
  position: relative;
`;
const Title = styled.div`
  font-size: 18px;
  line-height: 25px;
  margin-top: 31px;
`;
const BoxText = styled.div`
  margin-top: 13px;
  height: 130px;
  background: #f1fcf1;
  border-radius: 14px;
  textarea {
    background: transparent;
    width: 100%;
    height: 130px;
    box-sizing: border-box;
    padding: 20px 25px;
    border: 0;
    resize: none;
    font-size: 14px;
    font-family: AvenirNext-Regular, AvenirNext;
    font-weight: 400;
    color: #212f5a;
    line-height: 19px;
    &:focus {
      outline: none;
    }
  }
`;
const BtmBox = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  padding: 20px;
  width: 100%;

  background: #ffffff;
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    &:disabled {
      opacity: 0.3;
    }
  }
`;

export default function PrivateKey() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { saveWallet, walletList } = useWalletList();
  const [privateKey, setPrivateKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [tips, setTips] = useState("");
  const handleInput = (e) => {
    const { value } = e.target;
    setPrivateKey(value);
  };

  const submit = async () => {
    setLoading(true);
    try {
      const account = Wallet.privateToWallet(privateKey);
      let result = await getPassword();
      if (result) {
        const privateKeyCrypt = Keystore.create(privateKey, result);
        await saveWallet(
          {
            account,
            publicKey: account.publicKey,
            type: "import",
            name: `Account ${walletList.length + 1}`,
            account_index: "",
            privateKey: privateKeyCrypt,
          },
          "new",
        );
        setLoading(false);
        navigate("/");
      } else {
        clearPassword();
        // setLoading(false);
        navigate("/");
      }
    } catch (e) {
      setTips(e?.message || e?.reason);
      setShow(true);
      setTimeout(() => {
        setShow(false);
        setPrivateKey("");
        setLoading(false);
      }, 1500);
    }
  };

  return (
    <Box>
      <NavHeader title={t("popup.import.title")} />
      <Toast tips={tips} size={20} show={show} />
      <ContentBox>
        <ImportHeader
          title={t("popup.import.subTitle")}
          tips={t("popup.import.tips")}
        />
        <Title>{t("popup.import.textTitle")}</Title>
        <BoxText>
          <textarea value={privateKey} onChange={(e) => handleInput(e)} />
        </BoxText>
        <BtmBox>
          <Button
            fullWidth
            primary
            disabled={!privateKey?.length || loading}
            onClick={() => submit()}
          >
            {t("popup.import.Confirm")}
            {loading && <BtnLoading />}
          </Button>
        </BtmBox>
      </ContentBox>
    </Box>
  );
}
