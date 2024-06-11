import PublicJs from "../../utils/publicJS";
import useNetwork from "../../useHook/useNetwork";
import dayjs from "dayjs";
import {useTranslation} from "react-i18next";

export default function ActivitiesItem({item,networkInfo}) {
    const { t } = useTranslation();
    const toDetail = (tx) =>{
        if(!networkInfo || !networkInfo?.blockExplorerUrls)return;
        /*global chrome*/
        chrome.tabs.create({
            url: `${networkInfo?.blockExplorerUrls}transaction/${tx}`
        });
    }
    const formatDate = (dateTime) =>{
        return dayjs(dateTime).format("YYYY-MM-DD HH:mm")
    }

    return <li onClick={() => toDetail(item.tx_hash)} >
        {
           <div className="inner">
                <div className="item">
                    <div className="medium-font title">{item.tx_hash ? PublicJs.AddressToShow(item.tx_hash) : ""}</div>
                    {/*<div><span className="time">{item?.created ? formatDate(item?.created) : ""}</span></div>*/}
                    <div><span className="time">{t('popup.account.explorer')}</span></div>
                </div>
                <div className="item">
                    <div className="medium-font titleRht">{t('popup.account.Committed')}</div>
                </div>
            </div>
        }

    </li>
}
