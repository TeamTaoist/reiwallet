import AllModal from "../modal/AllModal";
import {useTranslation} from "react-i18next";
import useAccountAddress from "../../useHook/useAccountAddress";
import {useEffect, useState} from "react";
import styled from "styled-components";

const DlBox = styled.div`
    dl{
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        gap: 10px;
    }
    dt{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    dd{
        color: #009f62;
        cursor: pointer;
        &:hover{
            text-decoration: underline;
        }
    }
`

const EmptyBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
`


export default function Sites(){
    const { t } = useTranslation();
    const {currentAccountInfo} = useAccountAddress();
    const [list,setList] = useState([])
    const [loading,setLoading] = useState(false)

    useEffect(()=>{
        if(!currentAccountInfo?.address)return;
        getList()
    },[currentAccountInfo])

    const getList = async() =>{
        /*global chrome*/
        const whiteListArr = await chrome.storage.local.get(['whiteList']);
        const whiteList = whiteListArr?.whiteList ?? {};
        let arr = whiteList[currentAccountInfo.address] ?? [];
        setList(arr)
    }

    const disconnect = async(website) =>{
        setLoading(true)
        try{
            let arr = [...list];
            let itemIndex = arr.findIndex(item=>item === website);
            arr.splice(itemIndex,1)
            setList([...arr]);
            /*global chrome*/
            const whiteListArr = await chrome.storage.local.get(['whiteList']);
            const whiteList = whiteListArr?.whiteList;
            whiteList[currentAccountInfo.address] = [...arr];
            await chrome.storage.local.set({whiteList});
        }catch (e) {
            console.error("disconnect",e.message)
        }finally {
            setLoading(false)
        }

    }

    return <AllModal title="Connected Sites" link="/home">
            <DlBox>
                {
                    list?.map((item,index)=> (<dl key={index}>
                        <dt>{item}</dt>
                        <dd onClick={(item) => disconnect(item)}>Disconnect</dd>
                    </dl>))
                }

                {
                  !list.length  && <EmptyBox>No sites</EmptyBox>
                }
            </DlBox>

    </AllModal>
}
