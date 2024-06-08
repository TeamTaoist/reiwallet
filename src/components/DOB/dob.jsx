import styled from "styled-components";
import useDOB from "../../useHook/useDOB";
import {useEffect, useState} from "react";

import {unpackToRawSporeData, unpackToRawClusterData, getClusterById, predefinedSporeConfigs} from '@spore-sdk/core';
import useNetwork from "../../useHook/useNetwork";
import {useNavigate} from "react-router-dom";
import {useWeb3} from "../../store/contracts";
import Loading from "../loading/loading";
import useAccountAddress from "../../useHook/useAccountAddress";
import useCurrentAccount from "../../useHook/useCurrentAccount";
import DobClusterList from "./dobClusterList";
import ClusterListDOB from "./clusterListDOB";


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
    .li{
        width: 80px;
        height: 30px;
        text-align: center;
        background: #f5f5f5;
        line-height: 30px;
        cursor: pointer;
        &:first-child{
            border-top-left-radius: 40px;
            border-bottom-left-radius: 40px;
        }
        &:last-child{
            border-top-right-radius: 40px;
            border-bottom-right-radius: 40px;
        }
        &.active{
            background: #00FF9D;
        }
    }
`

export default function Dob(){
    const {list,loading,clusterList} = useDOB();
    const [sList,setSList] = useState([])
    const [cList,setCList] = useState([])
    const navigate = useNavigate()
    const {dispatch} = useWeb3();
    const {currentAccount} = useCurrentAccount();
    const {networkInfo} = useNetwork();
    const {currentAccountInfo} = useAccountAddress();
    const [current,setCurrent] = useState(0);
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
        if(list === '' || clusterList === '')return;
        formatList()
    }, [list,currentAccount,clusterList]);


    const formatList =  () =>{
        let arr = [...list];
        arr.map(async(item)=>{
            let spore =  unpackToRawSporeData(item.output_data)
            const buffer = Buffer.from(spore.content.toString().slice(2), 'hex');
            const base64 = Buffer.from(buffer, "binary" ).toString("base64");
            item.type = spore.contentType;
            if( item.type.indexOf("text") > -1){
                item.text =  Buffer.from(buffer, "binary" ).toString()
            }else{
                item.image = `data:${spore.contentType};base64,${base64}`;
            }

            item.clusterId =  spore.clusterId;
            return item
        })
        setSList(arr)

        let clArr = [...clusterList];
        clArr.map(async(item)=>{
            item.cluster = unpackToRawClusterData(item.output_data,"v2");
            item.clusterId = item.output.type.args;
            return item
        })

        setCList(clArr)
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
            loading && <LoadingBox><Loading showBg={false} /></LoadingBox>
        }
        <TabBox>
            {
                !loading && tabList.map((item,index)=> (<div className={current===index?"li active":"li"} key={index} onClick={()=>handleCurrent(index)} >{item.name}</div>))
            }

        </TabBox>
        {
            current===1 &&<DobClusterList cList={cList} toCluster={toCluster} />
        }
        {
            current===0 &&<ClusterListDOB loading={loading} sList={sList} toDetail={toDetail} />
        }


        {
           ( sList.length >= 100 || cList.length >= 100) && <MoreBox onClick={() => toExplorer()}>view more</MoreBox>
        }

    </Box>
}
