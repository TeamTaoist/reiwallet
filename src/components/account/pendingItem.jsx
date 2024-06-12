import {useEffect, useState} from "react";
import usePendingDetail from "../../useHook/usePendingDetail";
import PublicJs from "../../utils/publicJS";
import dayjs from "dayjs";
import useNetwork from "../../useHook/useNetwork";
import BtnLoading from "../loading/btnloading";
import {useTranslation} from "react-i18next";


export default function PendingItem({ txItem,networkInfo}) {
    const [tx,setTx] = useState('')
    const {loading,item}=usePendingDetail(tx);
    const { t } = useTranslation();

    useEffect(() => {
        if(!txItem)return;
        setTx(txItem.txhash)
    }, [txItem]);

    const formatDate = (dateTime) =>{
        return dayjs(dateTime).format("YYYY-MM-DD HH:mm")
    }

    const toDetail = (tx) =>{
        if(!networkInfo || !networkInfo?.blockExplorerUrls)return;
        /*global chrome*/
        chrome.tabs.create({
            url: `${networkInfo?.blockExplorerUrls}transaction/${tx}`
        });
    }


    return <li onClick={() => toDetail(tx)}>
        {
            !loading && <div className="inner">
                <div className="item">
                    <div className="medium-font title">{tx ? PublicJs.AddressToShow(tx) : ""}</div>
                    {/*<div><span className="time">{txItem?.created ? formatDate(txItem?.created) : ""}</span></div>*/}
                    <div><span className="time">{t('popup.account.explorer')}</span></div>
                </div>
                <div className="item">
                    <div className="medium-font titleRht pending">{item?.tx_status?.status ?? ""}</div>
                </div>
            </div>
        }
        {
            loading && <div className="innerLoading">
                <BtnLoading color="#00FF9D" />
            </div>
        }

    </li>
}
