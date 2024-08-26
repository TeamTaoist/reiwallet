import styled from "styled-components";
import { useEffect, useState } from "react";
import { useSessionMessenger } from "../../useHook/useSessionMessenger";
import Avatar from "../../components/svg/avatar/avatar";
import PublicJs from "../../utils/publicJS";
import useCurrentAccount from "../../useHook/useCurrentAccount";
import useAccountAddress from "../../useHook/useAccountAddress";
import AccountSwitch from "./accountSwitch";
import Button from "../../components/button/button";
import BtnLoading from "../../components/loading/btnloading";
import { useTranslation } from "react-i18next";

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
const Content = styled.div`
  flex-grow: 1;
`;

const UrlBox = styled.div`
  background: #f8f8f8;
  padding: 10px;
  margin-bottom: 30px;
`;

const TitleBox = styled.div`
  font-family: "AvenirNext-Bold";
  font-size: 20px;
  margin: 10px auto;
  width: 100%;
  text-align: center;
`;
const TipsBox = styled.div`
  width: 100%;
  text-align: center;
  font-size: 14px;
  margin-bottom: 40px;
`;

const AccountBox = styled.div`
  border: 1px solid #eee;
  padding: 10px;
  display: flex;
  align-items: center;
  border-radius: 10px;
  gap: 20px;
  width: 90vw;
  box-sizing: border-box;
`;
const RhtBox = styled.div`
  .address {
    font-size: 14px;
    font-weight: 500;
    color: #a6acbd;
    line-height: 20px;
  }
  .account {
    font-size: 18px;
    font-weight: 500;
    color: #34332e;
    font-family: "AvenirNext-Medium";
    line-height: 20px;
    margin-bottom: 4px;
  }
`;
const BtnGroup = styled.div`
  display: flex;
  position: absolute;
  left: 0;
  bottom: 20px;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
  padding: 0 20px;
  button {
    width: 47%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
`;

export default function Grant() {
  const [detail, setDetail] = useState(null);
  const messenger = useSessionMessenger();
  const { t } = useTranslation();
  const [address, setAddress] = useState("");
  const [walletName, setWalletName] = useState("");
  const [showAccount, setShowAccount] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentAccount, saveCurrent } = useCurrentAccount();
  const { currentAccountInfo, get_Address } = useAccountAddress();

  useEffect(() => {
    document.addEventListener("click", (e) => {
      setShowAccount(false);
    });
  }, []);

  useEffect(() => {
    if (!currentAccountInfo) return;
    const { address, name } = currentAccountInfo;
    setAddress(address);
    setWalletName(name);
  }, [currentAccountInfo, currentAccount]);

  useEffect(() => {
    if (!messenger) return;
    getDetail();
  }, [messenger]);

  const getDetail = async () => {
    if (messenger) {
      let rt = await messenger.send("get_grant");
      setDetail(rt);
    }
  };

  const handleAccount = (e) => {
    e.nativeEvent.stopImmediatePropagation();
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
            console.error(chrome.runtime.lastError.message);
          }
        },
      );
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const closeWin = async () => {
    await messenger.send("grant_result", {
      status: "rejected",
      data: "user rejected",
    });
    window.close();
  };
  const handleGrant = async () => {
    setLoading(true);
    console.log(address);
    try {
      /*global chrome*/
      const whiteListArr = await chrome.storage.local.get(["whiteList"]);
      const whiteList = whiteListArr?.whiteList ?? {};
      if (whiteList[address]?.length) {
        let arr = whiteList[address];
        arr.push(detail?.url);
        const uniqueArray = Array.from(new Set(arr));
        whiteList[address] = uniqueArray;
      } else {
        whiteList[address] = [detail?.url];
      }
      await chrome.storage.local.set({ whiteList });
      await messenger.send("grant_result", {
        status: "success",
        data: { result_type: "grant_success", grant_address: address },
      });
      window.close();
    } catch (e) {
      console.error("grant_result", e);
      await messenger.send("grant_result", {
        status: "failed",
        data: e.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {showAccount && (
        <AccountSwitch
          currentAccount={currentAccount}
          handleCurrent={handleCurrent}
        />
      )}
      <UrlBox>{detail?.url}</UrlBox>
      <Content>
        <TitleBox>Connect with Rei Wallet</TitleBox>
        <TipsBox>Select the account to use on this site</TipsBox>
        <AccountBox onClick={(e) => handleAccount(e)}>
          <div>
            <Avatar size={36} address={address} />
          </div>
          <RhtBox>
            <div className="account">{walletName}</div>
            <div className="address">{PublicJs.AddressToShow(address, 10)}</div>
          </RhtBox>
        </AccountBox>
      </Content>

      <BtnGroup>
        <Button border onClick={() => closeWin()}>
          {t("notification.Reject")}
        </Button>
        <Button primary onClick={() => handleGrant()}>
          {t("notification.Confirm")}
          {loading && <BtnLoading />}
        </Button>
      </BtnGroup>
    </Box>
  );
}
