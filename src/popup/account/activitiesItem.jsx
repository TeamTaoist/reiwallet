import PublicJs from "../../utils/publicJS";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

export default function ActivitiesItem({ item, networkInfo }) {
  const { t } = useTranslation();
  const toDetail = (tx) => {
    if (!networkInfo || !networkInfo?.blockExplorerUrls) return;
    /*global chrome*/
    chrome.tabs.create({
      url: `${networkInfo?.blockExplorerUrls}transaction/${tx}`,
    });
  };
  const formatDate = (dateTime) => {
    const time = parseInt(dateTime, 16);

    return dayjs(time).format("YYYY-MM-DD HH:mm");
  };

  return (
    <li onClick={() => toDetail(item.tx_hash)}>
      {
        <div className="inner">
          <div className="item">
            <div className="medium-font title">
              {item.tx_hash ? PublicJs.addressToShow(item.tx_hash) : ""}
            </div>
            <div>
              <span className="time">
                {item?.timestamp ? formatDate(item?.timestamp) : ""}
              </span>
            </div>
            {/*<div><span className="time">{t('popup.account.view')}</span></div>*/}
          </div>
          <div className="item">
            <div className="medium-font titleRht">
              {t("popup.account.committed")}
            </div>
          </div>
        </div>
      }
    </li>
  );
}
