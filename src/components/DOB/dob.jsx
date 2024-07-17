import styled from "styled-components";
import useDOB from "../../useHook/useDOB";
import {useEffect, useState} from "react";
import {unpackToRawClusterData,} from '@spore-sdk/core';
import useNetwork from "../../useHook/useNetwork";
import {useNavigate} from "react-router-dom";
import {useWeb3} from "../../store/contracts";
import Loading from "../loading/loading";
import useAccountAddress from "../../useHook/useAccountAddress";
import useCurrentAccount from "../../useHook/useCurrentAccount";
import DobClusterList from "./dobClusterList";
import ClusterListDOB from "./clusterListDOB";
import {useTranslation} from "react-i18next";
import {decodeDOB} from "@taoist-labs/dob-decoder";

const Box = styled.div`
    padding: 23px 20px;
`


const LoadingBox = styled.div`
    margin-top: 30px;
`

const MoreBox = styled.div`
    width: 100%;
    text-align: center;
    cursor: pointer;
    margin-top: 20px;
`

const TabBox = styled("div")`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 30px;
    position: relative;
    width: 100%;
    .li{
        width: 80px;
        height: 30px;
        text-align: center;
        background: #f5f5f5;
        line-height: 30px;
        cursor: pointer;
        &.li0{
            border-top-left-radius: 40px;
            border-bottom-left-radius: 40px;
        }
        &.li1{
            border-top-right-radius: 40px;
            border-bottom-right-radius: 40px;
        }
        &.active{
            background: #00FF9D;
        }
    }
`

// const SelectBox = styled("div")`
//     border: 1px solid #ddd;
//     position: absolute;
//     right: 20px;
//     display: flex;
//     align-items: center;
//     padding: 2px 5px;
//     border-radius: 4px;
//
// `

// const DropBox = styled("div")`
//     position: fixed;
//     z-index: 99999999;
//     width: 100vw;
//     height: 100vh;
//     background: rgba(0,0,0,0.4);
//     backdrop-filter: blur(2px);
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     ul{
//         background: #fff;
//         width: 50vw;
//         border-radius: 10px;
//         li{
//             padding:10px 20px;
//             border-bottom: 1px solid #ddd;
//         }
//     }
//
// `

export default function Dob(){
    const {list,loading,clusterList} = useDOB();
    const [sList,setSList] = useState([])
    const [cList,setCList] = useState([])
    const [loadingShow,setLoadingShow] = useState(false)
    const navigate = useNavigate()
    const {dispatch} = useWeb3();
    const {currentAccount} = useCurrentAccount();
    const {networkInfo,network} = useNetwork();
    const {currentAccountInfo} = useAccountAddress();
    const [current,setCurrent] = useState(0);
    const { t } = useTranslation();
    const [tabList] = useState([
        {
            name:"DOB",
            value:0
        },
        {
            name:"Cluster",
            value:1
        }
    ])

    useEffect(() => {

        if(!list){
            setLoadingShow(true)
        }else{
            setLoadingShow(false)
        }

    }, [list]);

    useEffect(() => {


        formatList()
        formatClusterList()

    }, [list,currentAccount,clusterList]);

    const formatClusterList = () =>{
        if(clusterList  === '')return;
        let clArr = [...clusterList];
        clArr.map(async(item)=>{
            item.cluster = unpackToRawClusterData(item.output_data,"v2");
            item.clusterId = item.output.type.args;
            return item
        })

        setCList(clArr)
    }


    const formatList =  async() =>{
        if(list === '')return;
        setSList([])

        let arr = [];

        for(let i=0;i<list.length;i++){
            let item = list[i];

            const itemDobId = item.output.type.args;
            try{
                const asset = await decodeDOB(itemDobId,network==="testnet",item.output_data);
                arr.push({...item,asset});
                setSList([...arr])
            }catch(e){
                arr.push({...item,asset:{
                        contentType:"image",
                        data:""
                    }});
                setSList([...arr])
                console.error("Get dob info failed",e)
            }

        }



    }
    const toCluster = (item) =>{
        dispatch({type:'SET_CLUSTER_DETAIL',payload:item});
        navigate("/ClusterDetail")
    }


    const toDetail = (item) =>{
        dispatch({type:'SET_DOB_DETAIL',payload:item});
        navigate("/dobDetail")
    }

    const toExplorer = () =>{
        /*global chrome*/
        chrome.tabs.create({
            url: `${networkInfo?.blockExplorerUrls}address/${currentAccountInfo.address}`
        });
    }

    const handleCurrent =(ind)=>{
        setCurrent(ind);
    }



    return <Box>
        {
            (loading ||  (!loading && loadingShow )) && <LoadingBox><Loading showBg={false} /></LoadingBox>
        }

        <TabBox>
            {
                !loading && tabList.map((item,index)=> (<div className={current===index?`li active li${index}`:`li li${index}`} key={index} onClick={()=>handleCurrent(index)} >{item.name}</div>))
            }



        </TabBox>

        {
            current===1 &&<DobClusterList cList={cList} toCluster={toCluster} />
        }
        {
            current===0 &&<ClusterListDOB loading={loading} sList={sList} toDetail={toDetail}  />
        }


        {
           ( sList.length >= 100 || cList.length >= 100) && <MoreBox onClick={() => toExplorer()}>{t('popup.account.viewMore')}</MoreBox>
        }

    </Box>
}
