import styled from "styled-components";
import useDOB from "../../useHook/useDOB";
import {useEffect, useState} from "react";

import { unpackToRawSporeData } from '@spore-sdk/core';
import useNetwork from "../../useHook/useNetwork";
import {useNavigate} from "react-router-dom";
import {useWeb3} from "../../store/contracts";
import Loading from "../loading/loading";
import useAccountAddress from "../../useHook/useAccountAddress";
import useCurrentAccount from "../../useHook/useCurrentAccount";


const Box = styled.div`
    padding: 23px 20px;
`
const UlBox = styled.ul`
    &:after {
        content: '';
        display: block;
        clear: both;
    }
    li{
        float: left;
        width: 24%;
        margin-right: 1%;
        margin-bottom: 5px;
        position: relative;
        cursor: pointer;
        border: 1px solid #eee;
        border-radius: 10px;
        &:nth-child(4n){
            margin-right: 0;
        }

        .photo{

            display: flex !important;
            overflow: hidden;
            .aspect {
                padding-bottom: 100%;
                height: 0;
                flex-grow: 1 !important;
            }
            .content {
                width: 100%;
                margin-left: -100% !important;
                max-width: 100% !important;
                flex-grow: 1 !important;
                position: relative;
            }
            .innerImg{
                position: absolute;
                width: 100%;
                height: 100%;
                img{
                    width: 100%;
                    height: 100%;
                    border-radius: 8px;
                        object-position: center;
                        object-fit: cover;
                }
            }
        }
        .title{
            position: absolute;
            left: 20px;
            bottom:5px;
            font-size: 12px;
            width: calc(100% - 40px);
            color: #fff;
            background: rgba(0,0,0,0.8);
            border-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
`
const LoadingBox = styled.div`
    margin-top: 30px;
`

const TextBox = styled.div`
        display: flex !important;
        overflow: hidden;
        .aspect {
            padding-bottom: 100%;
            height: 0;
            flex-grow: 1 !important;
        }
        .content {
            width: 100%;
            margin-left: -100% !important;
            max-width: 100% !important;
            flex-grow: 1 !important;
            position: relative;
        }
        .inner{
            position: absolute;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f8f8f8;
            font-size: 16px;
            font-family: "AvenirNext-Medium";
            font-weight: 500;
        }
    
`

export default function Dob(){
    const {list,loading} = useDOB();
    const [sList,setSList] = useState([])
    const navigate = useNavigate()
    const {dispatch} = useWeb3();
    const {currentAccount} = useCurrentAccount();

    useEffect(() => {
        if(list === '')return;
        formatList()
    }, [list,currentAccount]);


    const formatList =  () =>{
        let arr = [...list];
        arr.map(async(item)=>{
            let spore =  unpackToRawSporeData(item.output_data)
            const buffer = Buffer.from(spore.content.toString().slice(2), 'hex');
            const base64 = Buffer.from(buffer, "binary" ).toString("base64");
            item.type = spore.contentType;
            item.image = `data:${spore.contentType};base64,${base64}`;
            item.clusterId =  spore.clusterId;
            return item
        })
        setSList(arr)
    }

    const toDetail = (item) =>{
        dispatch({type:'SET_DOB_DETAIL',payload:item});
        navigate("/dobDetail")
    }

    return <Box>
        {
            loading && <LoadingBox><Loading showBg={false} /></LoadingBox>
        }
        {
            !loading  && <UlBox>
                {
                    sList?.map((item,index)=> (<li key={index} onClick={() => toDetail(item)}>

                        {
                            item.type.indexOf("text") === -1 && <div className="photo">
                                <div className="aspect"/>
                                <div className="content">
                                    <div className="innerImg">
                                        <img src={item.image} alt=""/>
                                    </div>
                                </div>
                            </div>
                        }
                        {
                            item.type.indexOf("text") > -1 && <TextBox>
                                <div className="aspect"/>
                                <div className="content">
                                    <div className="inner">
                                            Text
                                    </div>
                                </div>
                            </TextBox>
                        }

                        {
                            !!item.clusterId && < div className="title">cluster</div>
                        }

                    </li>))
                }

            </UlBox>
        }


    </Box>
}
