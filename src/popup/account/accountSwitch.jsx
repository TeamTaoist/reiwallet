import styled from "styled-components";
import CheckNor from "../../assets/images/Check01.png";
import CheckAct from "../../assets/images/Check02.png";
import Button from "../button/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PublicJs from "../../utils/publicJS";
import useAccountAddress from "../../hooks/useAccountAddress";
import Avatar from "../svg/avatar/avatar";
import { XIcon } from "lucide-react";
import { useEffect } from "react";

const Box = styled.div`
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(2px);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9999;
`;

const BgBox = styled.div`
  position: absolute;
  height: 550px;
  z-index: 99999;
  top: 20px;
  width: 90%;
  left: 5%;
  background: #ffffff;
  box-shadow: 0px 0px 8px 0px #ededed;
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;
const BtnGroup = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  display: flex;
  width: 100%;
  justify-content: space-between;
  background: #fff;
  padding: 20px;
  button {
    width: 49%;
    height: 40px !important;
    line-height: 35px !important;
  }
`;
const TitleBox = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: #34332e;
  line-height: 20px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  flex-shrink: 0;
  .iconRht {
    cursor: pointer;
  }
`;
const ContentBox = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  ul {
    padding-bottom: 100px;
  }
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    height: 60px;
    border-bottom: 1px solid #f5f5f5;
    &:hover {
      background: #f1fcf1;
    }
  }
  .decr {
    width: 24px;
  }
`;
const AccountBox = styled.div`
  flex-grow: 1;
  margin: 0 6px;
  display: flex;
  align-items: center;
  .avatar {
    width: 24px;
    border-radius: 24px;
    margin-right: 12px;
  }
  .title {
    font-size: 18px;
    font-weight: 500;
    color: #34332e;
    line-height: 20px;
  }
  .balance {
    font-size: 14px;
    font-weight: 500;
    color: #a6acbd;
    line-height: 20px;
  }
  .tagBox {
    margin-left: 10px;
    background: #00ff9d;
    color: #000;
    border-radius: 8px;
    font-size: 10px;
    padding: 0 10px;
  }
`;

export default function AccountSwitch({
  currentAccount,
  handleCurrent,
  handleNew,
  handleClose,
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { accountList } = useAccountAddress();

  useEffect(() => {
    if (!accountList?.length || currentAccount < 5) return;
    const element = document.getElementById(`current_${currentAccount}`);
    element?.scrollIntoView();
  }, [currentAccount, accountList]);

  const toGo = (url) => {
    navigate(url);
  };

  return (
    <Box>
      <BgBox>
        <TitleBox className="medium-font">
          <span>{t("popup.switch.title")}</span>
          <XIcon className="iconRht" onClick={() => handleClose()} />
        </TitleBox>
        <ContentBox>
          <ul>
            {accountList?.map((item, index) => (
              <li
                key={index}
                onClick={() => handleCurrent(index)}
                id={`current_${index}`}
              >
                <img
                  src={currentAccount === index ? CheckAct : CheckNor}
                  alt=""
                  className="decr"
                />
                <AccountBox>
                  <div className="avatar">
                    <Avatar size={28} address={item.address} />
                  </div>
                  <div>
                    <div className="medium-font">
                      {item.name}
                      {item.type === "import" && (
                        <span className="tagBox">{item.type}</span>
                      )}
                    </div>
                    <div className="balance medium-font">
                      {PublicJs.addressToShow(item.address)}
                    </div>
                  </div>
                </AccountBox>
                {/*<img src={Del} alt="" className="decr"/>*/}
              </li>
            ))}
          </ul>
        </ContentBox>
        <BtnGroup>
          <Button black onClick={() => handleNew()}>
            {t("popup.switch.Create")}
          </Button>
          <Button border onClick={() => toGo("/privatekey")}>
            {t("popup.switch.Import")}
          </Button>
        </BtnGroup>
      </BgBox>
    </Box>
  );
}
