import styled from "styled-components";
import TokenHeader from "../header/tokenHeader";
import useMessage from "../../hooks/useMessage";
import { useEffect, useState } from "react";
import { useWeb3 } from "../../store/contracts";
import PublicJS from "../../utils/publicJS";
import dayjs from "dayjs";
import Loading from "../loading/loading";
import { useTranslation } from "react-i18next";

const BoxOuter = styled.div`
  display: flex;
  flex-direction: column;
  background: #f9fafa;
  min-height: 100vh;
  .up {
    text-transform: uppercase;
  }
  .cursor {
    cursor: pointer;
    color: #01774a;
    text-decoration: underline;
  }
`;

const Box = styled.div`
  padding: 20px;
`;

const ListBox = styled.div`
  dl {
    background: #ffffff;
    border-radius: 10px;
    padding: 20px 10px 10px;
    box-shadow: 0px 0px 8px 0px #e8e8e8;
    margin-bottom: 10px;
  }
  .date {
    font-size: 12px;
  }
  dt {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    margin-bottom: 10px;
    padding: 0 10px;
  }
  .flexLine {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f9fafa;
    padding: 10px;
    margin-bottom: 10px;
  }
  .line {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 10px;
  }
  li {
    margin-bottom: 10px;
    border-bottom: 1px solid #e8e8e8;
    padding: 0 10px 10px;
    &:last-child {
      margin-bottom: 0;
      border-bottom: none;
      padding-bottom: 0;
    }
  }
  .name {
    opacity: 0.6;
  }
  .title {
    font-size: 14px;
    font-weight: bold;
    padding-bottom: 10px;
  }
`;

export default function SwapHistory() {
  const {
    dispatch,
    state: { stealthex_token },
  } = useWeb3();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleEvent = async (message) => {
    const { type } = message;
    switch (type) {
      case "get_history_Ex_success":
        {
          setLoading(false);

          const {
            data: { totalCount, limit, page: pageCur, results },
          } = message.data;
          setPageSize(limit);
          let totalPage = Math.ceil(totalCount / limit);
          setTotal(totalPage);

          let arr = [];
          results?.map((item) => {
            if (item?.MetaData) {
              console.log(JSON.parse(item?.MetaData));
              arr.push(JSON.parse(item?.MetaData));
            }
          });

          console.log(arr);

          setList(arr);
          if (totalPage > page) {
            setPage(pageCur + 1);
          }
        }
        break;
    }
  };
  const { sendMsg } = useMessage(handleEvent, []);

  const toExplorer = (url) => {
    /*global chrome*/
    chrome.tabs.create({
      url,
    });
  };

  useEffect(() => {
    getHistory(page);
  }, [page]);

  const getHistory = () => {
    setLoading(true);
    let obj = {
      method: "get_history_Ex",
      page,
      token: stealthex_token,
    };
    sendMsg(obj);
  };

  return (
    <BoxOuter>
      <TokenHeader title={t("swap.History")} />
      {loading && <Loading showBg={true} />}
      <Box>
        <ListBox>
          {list.map((item, index) => (
            <dl key={index}>
              <dt>
                <div> ID: {item?.id} </div>
                <div className="date">
                  {dayjs(item.created_at).format("YYYY-MM-DD HH:mm")}
                </div>
              </dt>
              <dd>
                <div className="flexLine">
                  <div className="up">
                    {item?.withdrawal?.amount} {item?.withdrawal?.symbol}
                  </div>
                  <div>{item?.status}</div>
                </div>
                <ul>
                  <li>
                    <div className="title">{t("swap.sendY")}</div>
                    <div className="line">
                      <span className="name">{t("swap.Amount")}</span>
                      <div className="up">
                        {item?.deposit?.amount} {item?.deposit?.symbol}
                      </div>
                    </div>
                    <div className="line">
                      <span className="name">{t("swap.Network")}</span>
                      <span>{item?.deposit?.network}</span>
                    </div>
                    <div
                      className="line"
                      onClick={() =>
                        toExplorer(item?.deposit?.address_explorer_url)
                      }
                    >
                      <span className="name">{t("swap.walletAddress")}</span>
                      <span className="cursor">
                        {PublicJS.addressToShow(item?.deposit?.address)}
                      </span>
                    </div>
                  </li>
                  <li>
                    <div className="title">{t("swap.get")}</div>
                    <div className="line">
                      <span>{t("swap.Amount")}</span>
                      <span>
                        {item?.withdrawal?.amount} {item?.withdrawal?.symbol}
                      </span>
                    </div>
                    <div className="line">
                      <span className="name">{t("swap.Network")}</span>
                      <span>{item?.withdrawal?.network}</span>
                    </div>
                    <div
                      className="line"
                      onClick={() =>
                        toExplorer(item?.withdrawal?.address_explorer_url)
                      }
                    >
                      <span className="name">{t("swap.walletAddress")}</span>
                      <span className="cursor">
                        {PublicJS.addressToShow(item?.withdrawal?.address)}
                      </span>
                    </div>
                  </li>
                </ul>
              </dd>
            </dl>
          ))}
        </ListBox>
      </Box>
    </BoxOuter>
  );
}
