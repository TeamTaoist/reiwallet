import styled from "styled-components";
import MoreImg from "../../assets/images/more-dot.png";
import EtherImg from "../../assets/images/ether.png";
import SiteImg from "../../assets/images/sites.png";
import { useEffect, useState } from "react";
import DetailsImg from "../../assets/images/Details.png";
import AccountSwitch from "./accountSwitch";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PublicJs from "../../utils/publicJS";
import Toast from "../modal/toast";
import useCurrentAccount from "../../hooks/useCurrentAccount";
import AddAccount from "./addAccount";
import useAccountAddress from "../../hooks/useAccountAddress";
import useNetwork from "../../hooks/useNetwork";
import Avatar from "../svg/avatar/avatar";
import { Copy as Copy2, ChevronDown } from "lucide-react";
import usePublickey from "../../hooks/usePublickey";

const AccountBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 20px 10px;
  border-bottom: 1px solid rgba(235, 237, 240, 1);
  position: relative;
`;
const Lft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .account {
    font-size: 14px;
    font-weight: 500;
    color: #34332e;
    font-family: "AvenirNext-Medium";
    line-height: 1.5em;
  }
  .address {
    font-size: 12px;
    font-weight: 500;
    color: #a6acbd;
    line-height: 1.5em;
  }
`;

const Tips = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  gap: 10px;
  img {
    margin-left: 5px;
    width: 24px;
    cursor: pointer;
  }
`;

const Rht = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  img {
    width: 24px;
  }
`;
const DropDown = styled.div`
  position: absolute;
  right: 10px;
  top: 60px;
  width: 173px;
  background: #ffffff;
  box-shadow: 0 0 8px 0 #ededed;
  border-radius: 14px;
  padding: 11px 0;
  z-index: 9999;
  dl {
    display: flex;
    align-items: center;
    height: 44px;
    padding: 0 8px;
    cursor: pointer;
    &:hover {
      background: #f1fcf1;
    }
  }
  img {
    margin-right: 6px;
    width: 24px;
  }
  dd {
    font-size: 12px;
    color: #34332d;
    line-height: 17px;
    font-family: "AvenirNext-Medium";
  }
`;

export default function AccountHeader() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currentAccount, saveCurrent } = useCurrentAccount();
  const { currentAccountInfo, get_Address } = useAccountAddress();
  const { networkInfo } = useNetwork();
  usePublickey();

  const [show, setShow] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [address, setAddress] = useState("");
  const [walletName, setWalletName] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.addEventListener("click", (e) => {
      setShow(false);
      setShowAccount(false);
    });
  }, []);

  useEffect(() => {
    if (!currentAccountInfo) return;
    const { address, name } = currentAccountInfo;
    setAddress(address);
    setWalletName(name);
  }, [currentAccountInfo]);

  const stopPropagation = (e) => {
    e.nativeEvent.stopImmediatePropagation();
  };
  const showDropDown = (e) => {
    stopPropagation(e);
    setShow(!show);
  };

  const toDetail = (url) => {
    navigate(url);
  };

  const Copy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  const handleAccount = (e) => {
    stopPropagation(e);
    setShowAccount(!showAccount);
  };

  const handleCurrent = (index) => {
    saveCurrent(index);
    let currentUser = get_Address(index);

    /*global chrome*/
    try {
      chrome.runtime.sendMessage(
        {
          data: currentUser,
          method: "accountsChanged",
          type: "CKB_ON_BACKGROUND",
        },
        () => {
          if (chrome.runtime.lastError) {
            console.log(
              "chrome.runtime.lastError",
              chrome.runtime.lastError.message,
            );
            return;
          }
        },
      );
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleNew = () => {
    setShow(false);
    setShowNew(true);
  };

  const handleClose = () => {
    setShowAccount(false);
  };

  const handleCloseNew = () => {
    setShowNew(false);
  };

  const toExplorer = () => {
    chrome.tabs.create({
      url: `${networkInfo?.blockExplorerUrls}address/${address}`,
    });
  };

  return (
    <AccountBox>
      {show && (
        <DropDown>
          <dl onClick={() => toExplorer()}>
            <dt>
              <img src={EtherImg} alt="" />
            </dt>
            <dd>{t("popup.account.explorer")}</dd>
          </dl>
          <dl onClick={() => toDetail("/detail")}>
            <dt>
              <img src={DetailsImg} alt="" />
            </dt>
            <dd>{t("popup.account.details")}</dd>
          </dl>
          <dl onClick={() => toDetail("/sites")}>
            <dt>
              <img src={SiteImg} alt="" />
            </dt>
            <dd>{t("popup.account.sites")}</dd>
          </dl>
        </DropDown>
      )}
      {showAccount && (
        <AccountSwitch
          currentAccount={currentAccount}
          handleCurrent={handleCurrent}
          handleNew={handleNew}
          handleClose={handleClose}
        />
      )}
      {showNew && <AddAccount handleCloseNew={handleCloseNew} />}
      <Toast tips={t("popup.account.copied")} size={20} show={copied} />

      <Lft onClick={(e) => handleAccount(e)}>
        <div className="avatar">
          <Avatar size={30} address={address} />
        </div>

        <div>
          <div className="account">{walletName}</div>
          <Tips>
            <div className="address">{PublicJs.addressToShow(address)}</div>
            <ChevronDown size={12} />
          </Tips>
        </div>
      </Lft>
      <Rht>
        <CopyToClipboard onCopy={() => Copy()} text={address}>
          <Copy2 size={16} />
        </CopyToClipboard>
        <img onClick={(e) => showDropDown(e)} src={MoreImg} alt="" />
      </Rht>
    </AccountBox>
  );
}
