import styled from "styled-components";
import { useEffect, useState } from "react";
import ActivitiesItem from "./activitiesItem";
import PendingItem from "./pendingItem";
import useNetwork from "../../hooks/useNetwork";
import useAccountAddress from "../../hooks/useAccountAddress";
import useHistoryList from "../../hooks/useHistory";
import Loading from "../loading/loading";
import { useTranslation } from "react-i18next";
// import {getHistoryList, getPRList} from "../../utils/indexdb";

const Box = styled.div`
  padding: 15px 20px 0;
  li {
    display: flex;
    height: 60px;
    border-radius: 14px;
    padding: 0 22px;
    cursor: pointer;
    box-sizing: border-box;
    background: #fafafa;
    margin-bottom: 10px;
    &:hover {
      background: #f1fcf1;
    }
    &.op40 {
      opacity: 0.4;
    }
    .inner {
      width: 100%;
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .title {
      font-weight: 500;
      font-size: 16px;
    }
    .titleRht {
      font-weight: 500;
      font-size: 16px;
      text-transform: capitalize;
    }
    .pending {
      color: #00a554;
    }
    .time {
      font-size: 12px;
      color: #00a554;
      line-height: 20px;
      margin-right: 7px;
    }
    .web {
      font-size: 14px;
      color: #a6acbd;
      line-height: 20px;
    }
    .item {
      display: flex;
      flex-direction: column;
    }
    .innerLoading {
      width: 100%;
      height: 78px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;

const MoreBox = styled.div`
  width: 100%;
  text-align: center;
  cursor: pointer;
`;

export default function Activities() {
  const [pendingList, setPendingList] = useState([]);
  const { networkInfo } = useNetwork();
  const { list, loading } = useHistoryList();
  const { currentAccountInfo } = useAccountAddress();
  const { t } = useTranslation();

  useEffect(() => {
    if (!networkInfo || !currentAccountInfo) return;
    getPendingList();
  }, [networkInfo, currentAccountInfo]);

  useEffect(() => {
    if (!pendingList.length || !networkInfo) return;
    const timer = setInterval(() => {
      getPendingList();
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [pendingList, list, networkInfo]);

  const getPendingList = async () => {
    /*global chrome*/
    let rt = await chrome.storage.local.get(["txList"]);
    const arr = rt?.txList ?? [];
    let arrMy = arr.filter(
      (item) => item.address === currentAccountInfo.address,
    );
    setPendingList(arrMy ?? []);
  };
  const toExplorer = () => {
    /*global chrome*/
    chrome.tabs.create({
      url: `${networkInfo?.blockExplorerUrls}address/${currentAccountInfo.address}`,
    });
  };

  return (
    <Box>
      {loading && !pendingList?.length && !list?.length && (
        <Loading showBg={false} />
      )}
      {!(loading && !pendingList?.length && !list?.length) && (
        <ul>
          {pendingList?.map((item, index) => (
            <PendingItem
              key={`pending_${index}`}
              txItem={item}
              networkInfo={networkInfo}
            />
          ))}

          {list?.map((item, index) => (
            <ActivitiesItem
              key={`confirmed_${index}`}
              item={item}
              networkInfo={networkInfo}
            />
          ))}
          {list?.length === 30 && (
            <MoreBox onClick={() => toExplorer()}>
              {t("popup.account.viewMore")}
            </MoreBox>
          )}
        </ul>
      )}
    </Box>
  );
}
