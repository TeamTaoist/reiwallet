/*global chrome*/
import Wallet from "../wallet/wallet";
import RpcClient from "./rpc";
import {currentInfo} from "../wallet/getCurrent";

const recordToTxList = async(txhash)=>{
    if(!txhash)return;
    const currentAccount = await currentInfo();

    let list = await chrome.storage.local.get(["txList"]);
    let arr = list.txList ? list.txList : [];
    chrome.storage.local.set({txList:[ {
            txhash,
            address:currentAccount?.address,
            created:new Date().valueOf()
        },...arr]});
}

const RemoveRecord = async (txhash,result) =>{
    let list = await chrome.storage.local.get(["txList"]);
    let arr = list.txList ? list.txList : [];
    if(!arr.length)return;
    let resultIndex = arr.findIndex((item) =>item === txhash);
    arr.splice(resultIndex,1);
    chrome.storage.local.set({txList:arr});
}


export const handlePopUp = async (requestData) =>{
    switch (requestData.method){
        case "Create_Account":
           create_new_wallet(requestData);
            break;
        case "get_capacity":
            get_Capacity(requestData);
            break;
        case "get_transaction":
            get_transaction(requestData);
            break;
        case "get_transaction_history":
            get_transaction_history(requestData);
            break;
        case "get_feeRate":
            get_feeRate(requestData);
            break;
        case "send_transaction":
            send_transaction(requestData);
            break;
        case "transaction_confirm":
            transaction_confirm(requestData);
            break;
        case "get_DOB":
            getDOB(requestData);
            break;
        case "get_Cluster":
            getCLuster(requestData);
            break;
        case "send_DOB":
            sendDOB(requestData);
            break;
        case "send_Cluster":
            sendCluster(requestData);
            break;
        case "Melt_DOB":
            melt_dob(requestData);
            break;
        case "get_SUDT":
            getSUDT(requestData);
            break;
        case "send_SUDT":
            sendSUDT(requestData);
            break;
    }

}

const sendMsg = (data) =>{
    chrome.runtime.sendMessage(data,  ()=> {})
}

export const create_new_wallet = async(obj) =>{
    const {index,network,hasMnemonic,name,id,method} = obj;
    const wallet = new Wallet(index,network==="mainnet",hasMnemonic);
    try{
        chrome.storage.local.get(['walletList'],async (result)=>{
            let list = result.walletList ?? [];
            const sumArr = list.filter(item=>item.type === "create")??[]
            let walletObj = await wallet.GenerateWallet(sumArr.length);

            let item = {
                account:walletObj,
                type:"create",
                name,
                account_index:sumArr.length
            }
            let newList = [...list,item];
            chrome.storage.local.set({walletList:newList});
            sendMsg({ type:"create_account_success",data:{id}})
        });

    }catch (e) {
        if(e?.message.includes("no_password")){
            sendMsg({ type:"to_lock",data: {id}})
        }else{
            sendMsg({ type:`${method}_error`,data: {message:"error",id}})
        }

    }
}

const get_Capacity = async(obj) =>{
    const {currentAccountInfo} = obj;
    try{
        const client = new RpcClient();
        let rt = await client.get_capacity(currentAccountInfo.address);
        sendMsg({ type:"get_Capacity_success",data:rt})

    }catch (e){
        sendMsg({ type:`${obj.method}_error`,data: e.message})
    }
}

const get_transaction = async (obj) =>{
    const {txHash} = obj
    try{
        const client = new RpcClient();
        let rt = await client.get_transaction(txHash);
        const {transaction:{hash},tx_status} = rt;
        if(tx_status.status !== "pending" && tx_status.status !== "proposed"){
            await RemoveRecord(hash,rt)

        }else{
            sendMsg({ type:"get_transaction_success",data:rt})
        }


    }catch (e){
        sendMsg({ type:`${obj.method}_error`,data: e.message})
    }
}
const get_transaction_history = async (obj) =>{
    const {currentAccountInfo} = obj;

    try{
        const client = new RpcClient();
        let rt = await client.get_transaction_list(currentAccountInfo.address);
        sendMsg({ type:`${obj.method}_success`,data:rt})

    }catch (e){
        sendMsg({ type:`${obj.method}_error`,data: e.message})
    }
}

const get_feeRate = async(obj) =>{
    try{
        const client = new RpcClient();
        let rt = await client.get_feeRate();
        sendMsg({ type:"get_feeRate_success",data:rt})

    }catch (e){
        sendMsg({ type:`${obj.method}_error`,data: e.message})
    }
}

const send_transaction = async (obj) =>{
    const {to,amount,fee,isMax} = obj;
    try{
        const client = new RpcClient();
        let rt = await client.send_transaction(to,amount,fee,isMax);
        sendMsg({ type:"send_transaction_success",data:rt})

    }catch (e){
        console.error(`${obj.method}_error`,e.message)
        sendMsg({ type:`${obj.method}_error`,data: e.message})
    }
}


const transaction_confirm = async(obj) =>{
    const {tx} = obj;
    try{
        const client = new RpcClient();
        let rt = await client.transaction_confirm(tx);
        await recordToTxList(rt);
        sendMsg({ type:"transaction_confirm_success",data:rt})

    }catch (e){
        console.error(`${obj.method}_error`,e.message)
        sendMsg({ type:`${obj.method}_error`,data: e.message})
    }
}


const getDOB = async (obj) =>{
    const {currentAccountInfo} = obj;

    try{
        const client = new RpcClient();
        let rt = await client.get_DOB(currentAccountInfo.address);
        sendMsg({ type:`${obj.method}_success`,data:rt})

    }catch (e){
        sendMsg({ type:`${obj.method}_error`,data: e.message})
    }
}

const sendDOB = async (obj) =>{
    const {currentAccountInfo,outPoint,toAddress} = obj;

    try{
        const client = new RpcClient();
        let rt = await client.send_DOB(currentAccountInfo,outPoint,toAddress);
        await recordToTxList(rt);
        sendMsg({ type:`${obj.method}_success`,data:rt})

    }catch (e){
        console.error(`${obj.method}_error`, e.message)
        sendMsg({ type:`${obj.method}_error`,data: e.message})
    }
}

const melt_dob = async (obj) =>{
    const {currentAccountInfo,outPoint} = obj;

    try{
        const client = new RpcClient();
        let rt = await client.melt_DOB(currentAccountInfo,outPoint);
        await recordToTxList(rt);
        sendMsg({ type:`${obj.method}_success`,data:rt})

    }catch (e){
        console.error(`${obj.method}_error`, e.message)
        sendMsg({ type:`${obj.method}_error`,data: e.message})
    }
}

const getSUDT = async (obj) =>{
    const {currentAccountInfo} = obj;

    try{
        const client = new RpcClient();
        let rt = await client.get_SUDT(currentAccountInfo.address);
        sendMsg({ type:`${obj.method}_success`,data:rt})

    }catch (e){
        sendMsg({ type:`${obj.method}_error`,data: e.message})
    }
}

const sendSUDT = async (obj) =>{

    try{
        const client = new RpcClient();
        let rt = await client.send_SUDT(obj);
        await recordToTxList(rt);
        sendMsg({ type:`${obj.method}_success`,data:rt})

    }catch (e){
        sendMsg({ type:`${obj.method}_error`,data: e.message})
    }
}

const getCLuster = async (obj) =>{
    const {currentAccountInfo} = obj;

    try{
        const client = new RpcClient();
        let rt = await client.get_Cluster(currentAccountInfo.address);
        sendMsg({ type:`${obj.method}_success`,data:rt})

    }catch (e){
        sendMsg({ type:`${obj.method}_error`,data: e.message})
    }
}

const sendCluster = async (obj) =>{

    try{
        const client = new RpcClient();
        let rt = await client.send_Cluster(obj);
        await recordToTxList(rt);
        sendMsg({ type:`${obj.method}_success`,data:rt})

    }catch (e){
        console.error(`${obj.method}_error`, e.message)
        sendMsg({ type:`${obj.method}_error`,data: e.message})
    }
}
