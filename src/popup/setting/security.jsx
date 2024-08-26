import TokenHeader from "../header/tokenHeader";
import styled from "styled-components";
import Next from "../../assets/images/into.png";
import { useNavigate } from "react-router-dom";
import LockImg from "../../assets/images/lock.png";
import { useTranslation } from "react-i18next";
import { clearPassword } from "../../wallet/password";

const Content = styled.div`
  margin: 20px;
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(165, 172, 191, 0.3);
    height: 52px;
  }
  .lft {
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

export default function Security() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const toGo = (url) => {
    navigate(url);
  };

  const goLock = () => {
    clearPassword();
    navigate("/");
  };

  return (
    <div>
      <TokenHeader title={t("popup.Settings.Security")} />
      <Content>
        <ul>
          <li onClick={() => toGo("/accountMnemonic")}>
            <div className="lft">
              <img src={LockImg} alt="" />
              <span>{t("popup.Settings.Mnemonic")}</span>
            </div>
            <img src={Next} alt="" />
          </li>
          <li onClick={() => goLock()}>
            <div className="lft">
              <img src={LockImg} alt="" />
              <span>{t("popup.Settings.Lock")}</span>
            </div>
            <img src={Next} alt="" />
          </li>
        </ul>
      </Content>
    </div>
  );
}
