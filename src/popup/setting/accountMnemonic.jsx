import TokenHeader from "../header/tokenHeader";
import ImportHeader from "../wallet/importWallet/importHeader";
import Button from "../button/button";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Close from "../../assets/images/create/close.png";
import Open from "../../assets/images/create/open.png";
import { useState } from "react";
import Keystore from "../../wallet/keystore";
import BtnLoading from "../loading/btnLoading";
import { useTranslation } from "react-i18next";
import { clearPassword, switchPassword } from "../../wallet/password";

const Box = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const ContentBox = styled.div`
  flex-grow: 1;
  padding: 20px;
  height: 100%;
  position: relative;
`;
const BtmBox = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  padding: 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  background: #ffffff;
  button {
    width: 47%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
  }
`;
const InputBox = styled.div`
  margin-top: 38px;
  .titleTips {
    font-size: 12px;
    color: #97a0c3;
    line-height: 16px;
    letter-spacing: 2px;
    margin-bottom: 14px;
  }
  .inputBox {
    border: 1px solid #a1adcf;
    display: flex;
    align-items: center;
    justify-content: space-between;
    img {
      margin-right: 10px;
      cursor: pointer;
    }
    &:hover {
      border: 1px solid #000 !important;
    }
  }
  dl {
    margin-bottom: 20px;
  }
`;

export default function AccountMnemonic() {
  const navigate = useNavigate();
  const [show, setShow] = useState(true);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const { t } = useTranslation();

  const submit = async () => {
    setLoading(true);
    try {
      let newPassword = await switchPassword(password);
      let pwdRt = await Keystore.checkPassword(newPassword);
      if (pwdRt) {
        navigate("/accountConfirm");
      } else {
        clearPassword();
        navigate("/");
      }
    } catch (e) {
      console.error("checkPassword", e);
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (e) => {
    const { value } = e.target;
    setPassword(value);
  };
  const switchPwd = () => {
    setShow(!show);
  };

  return (
    <Box>
      <TokenHeader />
      <ContentBox>
        <ImportHeader
          title={t("popup.Settings.MnemonicTit")}
          tips={t("popup.Settings.MnemonicTips")}
        />
        <InputBox>
          <div className="titleTips regular-font">
            {t("popup.Settings.password")}
          </div>
          <div className="inputBox">
            <input
              type={show ? "password" : "text"}
              value={password}
              placeholder="Please enter"
              onChange={(e) => handleInput(e)}
            />
            {!show && <img src={Close} alt="" onClick={() => switchPwd()} />}
            {show && <img src={Open} alt="" onClick={() => switchPwd()} />}
          </div>
        </InputBox>
        <BtmBox>
          <Button border onClick={() => navigate("/")}>
            {t("popup.Settings.Cancel")}{" "}
          </Button>
          <Button
            primary
            onClick={() => submit()}
            disabled={!password.length || loading}
          >
            {t("popup.Settings.Next")} {loading && <BtnLoading />}{" "}
          </Button>
        </BtmBox>
      </ContentBox>
    </Box>
  );
}
