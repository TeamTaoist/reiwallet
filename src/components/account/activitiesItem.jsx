import PublicJs from "../../utils/publicJS";
import useNetwork from "../../useHook/useNetwork";
import dayjs from "dayjs";

export default function ActivitiesItem({item}) {

    const {networkInfo} = useNetwork();
    const toDetail = (tx) =>{
        /*global chrome*/
        chrome.tabs.create({
            url: `${networkInfo?.blockExplorerUrls}transaction/${tx}`
        });
    }
    const formatDate = (dateTime) =>{
        return dayjs(dateTime).format("YYYY-MM-DD HH:mm")
    }

    return <li onClick={() => toDetail(item.tx_hash)}>
        {
           <div className="inner">
                <div className="item">
                    <div className="medium-font title">{item.tx_hash ? PublicJs.AddressToShow(item.tx_hash) : ""}</div>
                    {/*<div><span className="time">{item?.created ? formatDate(item?.created) : ""}</span></div>*/}
                    <div><span className="time">View on block explorer</span></div>
                </div>
                <div className="item">
                    <div className="medium-font titleRht">Committed</div>
                </div>
            </div>
        }

    </li>
}
