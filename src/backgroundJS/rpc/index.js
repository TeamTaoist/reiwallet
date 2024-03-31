import Wallet from "../../wallet/wallet";
import {clusterScript, networkList} from "../../constants/network";
import {BI, commons, config, hd, helpers, Indexer} from "@ckb-lumos/lumos";
import {parseUnit} from "@ckb-lumos/bi";
import {formatter} from "./formatParamas";
import {blockchain} from "@ckb-lumos/base";
import {currentInfo} from "../../wallet/getCurrent";
import { getSporeTypeScript } from "@nervina-labs/ckb-dex";
import { predefinedSporeConfigs, transferSpore,meltSpore,transferCluster} from "@spore-sdk/core";
import {getSudtTypeScript} from "@nervina-labs/ckb-dex/lib/constants";

/*global chrome*/
let jsonRpcId = 0;
export default class RpcClient{
    constructor(networkInfo) {
        this.network = networkInfo;
    }

    async getNetwork(){
        if(this.network) return this.network;
        let rt = await chrome.storage.local.get(["networkInfo"]);
        if(rt){
            this.network =  JSON.parse(rt.networkInfo);

        }else{
            this.network = networkList[0];
        }
        return this.network;
    }



    async  _request(obj) {
        ++jsonRpcId;
        const {method,params,url} = obj;

        const body = { jsonrpc: '2.0', id: jsonRpcId, method, params }
        const res = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const rt = await res.json();
        // Abort retrying if the resource doesn't exist
        if (rt.error) {
            /* istanbul ignore next */
            return Promise.reject(rt.error);
        }

        return rt?.result;

    }


    get_capacity = async(address) =>{

        const network = await this.getNetwork();

        if(network.value === "mainnet"){
            config.initializeConfig(config.predefined.LINA);
        }else{
            config.initializeConfig(config.predefined.AGGRON4);
        }
        const indexer = new Indexer(network.rpcUrl.indexer, network.rpcUrl.node);


        let totalCapacity = BI.from(0);
        let OcCapacity = BI.from(0);
        const addressScript = helpers.parseAddress(address);

        const collector = indexer.collector({ lock: addressScript});

        for await (const cell of collector.collect()) {
            totalCapacity = totalCapacity.add(cell.cellOutput.capacity);
            if(cell.data !== "0x"){
                OcCapacity = OcCapacity.add(cell.cellOutput.capacity)
            }
        }

        return {capacity:totalCapacity.toHexString(),OcCapacity:OcCapacity.toHexString()};

    }
    get_transaction_list = async(address) =>{
        const hashObj = Wallet.addressToScript(address);
        const{codeHash,hashType,args} = hashObj;
        const network = await this.getNetwork();

        return await this._request({
            method:"get_transactions",
            url:network.rpcUrl.indexer,
            params:[
                {
                    "script": {
                        "code_hash":codeHash,
                        "hash_type":hashType,
                        args
                    },
                    "script_type": "lock",
                    "group_by_transaction": true
                },
                "desc",
                "0x1E"
            ]
        })
    }
    get_transaction = async(txHash) =>{
        const network = await this.getNetwork();
        return await this._request({
            method:"get_transaction",
            url:network.rpcUrl.node,
            params:[txHash]
        })

    }

    get_feeRate = async() =>{
        const network = await this.getNetwork();
        return await this._request({
            method:"get_fee_rate_statistics",
            url:network.rpcUrl.node,
            params:['0x65']
        })

    }
    send_transaction = async (to,amt,fee,isMax) =>{
        const network = await this.getNetwork();

        const currentAccount = await currentInfo();

        const {address,privatekey_show} = currentAccount;
        let amount = parseUnit(amt,"ckb");
        if(network.value === "mainnet"){
            config.initializeConfig(config.predefined.LINA);
        }else{
            config.initializeConfig(config.predefined.AGGRON4);
        }
        const indexer = new Indexer(network.rpcUrl.indexer, network.rpcUrl.node);
        let txSkeleton = helpers.TransactionSkeleton({ cellProvider: indexer });
        txSkeleton = await commons.common.transfer(txSkeleton, [address], to, amount);
        if(isMax){
            txSkeleton = await commons.common.payFee(txSkeleton, [address] ,0);
        }else{
            txSkeleton = await commons.common.payFeeByFeeRate(txSkeleton, [address], fee /*fee_rate*/);
        }

        txSkeleton = commons.common.prepareSigningEntries(txSkeleton);

        let signatures = txSkeleton
            .get("signingEntries")
            .map((entry) => hd.key.signRecoverable(entry.message, privatekey_show))
            .toArray();

        let signedTx = helpers.sealTransaction(txSkeleton, signatures);

        if(isMax){
           const size =  getTransactionSizeByTx(signedTx)
            const newFee = calculateFeeCompatible(size,fee);
            let outputs = txSkeleton.get("outputs").toArray();
           let item = outputs[0];
            item.cellOutput.capacity = BI.from(amount).sub(newFee).toHexString();
            txSkeleton = txSkeleton.update("outputs", (outputs) => {
                outputs[0] =item
                return outputs;
            });


            txSkeleton = commons.common.prepareSigningEntries(txSkeleton);
             signatures = txSkeleton
                .get("signingEntries")
                .map((entry) => hd.key.signRecoverable(entry.message, privatekey_show))
                .toArray();
            signedTx = helpers.sealTransaction(txSkeleton, signatures);
        }
        const newTx = formatter.toRawTransaction(signedTx);
        let outputs = txSkeleton.get("outputs").toArray();
        const outputArr= outputs.map((item)=>{
            return {
                capacity:item.cellOutput.capacity,
                address:Wallet.scriptToAddress(item.cellOutput.lock,network.value === "mainnet")
            }
        })

        let inputs = txSkeleton.get("inputs").toArray();
        const inputArr= inputs.map((item)=>{
            return {
                capacity:item.cellOutput.capacity,
                address:Wallet.scriptToAddress(item.cellOutput.lock,network.value === "mainnet")
            }
        })
        return {
            signedTx:newTx,
            inputs:inputArr,
            outputs:outputArr
        }

    }
    transaction_confirm = async (tx) =>{
        const network = await this.getNetwork();
        return await this._request({
            method:"send_transaction",
            url:network.rpcUrl.node,
            params:[
                tx
            ]
        })
    }

    get_DOB = async(address) =>{
        const hashObj = Wallet.addressToScript(address);
        const{codeHash,hashType,args} = hashObj;
        const network = await this.getNetwork();

        const sporeType = getSporeTypeScript(network.value === "mainnet");

        return await this._request({
            method:"get_cells",
            url:network.rpcUrl.indexer,
            params:[
                {
                    script: {
                        code_hash: codeHash,
                        hash_type:hashType,
                        args
                    },
                    "script_type": "lock",
                    script_search_mode: "exact",
                    filter: {
                        script: {
                            code_hash: sporeType.codeHash,
                            hash_type: sporeType.hashType,
                            args: "0x",
                        },
                        script_search_mode: 'prefix',
                        script_type: 'type',
                    },
                },
                "desc",
                "0x64"
            ]
        })
    }

    get_Cluster = async(address) =>{
        const hashObj = Wallet.addressToScript(address);
        const{codeHash,hashType,args} = hashObj;
        const network = await this.getNetwork();

        const clusterType = clusterScript[network.value]?.script;

        return await this._request({
            method:"get_cells",
            url:network.rpcUrl.indexer,
            params:[
                {
                    script: {
                        code_hash: codeHash,
                        hash_type:hashType,
                        args
                    },
                    "script_type": "lock",
                    script_search_mode: "exact",
                    filter: {
                        script: {
                            code_hash: clusterType.codeHash,
                            hash_type: clusterType.hashType,
                            args: "0x",
                        },
                        script_search_mode: 'prefix',
                        script_type: 'type',
                    },
                },
                "desc",
                "0x64"
            ]
        })
    }

    send_DOB = async(currentAccountInfo,outPoint,toAddress) => {
        const network = await this.getNetwork();
        const addr =  Wallet.addressToScript(toAddress);

        const {index,tx_hash} = outPoint

        const { txSkeleton, outputIndex } = await transferSpore({
            // outPoint:sporeCell.outPoint,
            outPoint:{
                index,
                txHash:tx_hash
            },
            fromInfos: [currentAccountInfo?.address],
            toLock: addr,
            config:network.value === "mainnet" ? predefinedSporeConfigs.Mainnet : predefinedSporeConfigs.Testnet,
        });
        let signHash = await signAndSendTransaction(txSkeleton);

        const newTx = formatter.toRawTransaction(signHash);

        return await this.transaction_confirm(newTx);
    }

    send_Cluster = async(obj) => {
        const {currentAccountInfo,outPoint,toAddress} = obj;
        const network = await this.getNetwork();
        const addr =  Wallet.addressToScript(toAddress);

        const {index,tx_hash} = outPoint

        const { txSkeleton } = await transferCluster({
            // outPoint:sporeCell.outPoint,
            outPoint:{
                index,
                txHash:tx_hash
            },
            fromInfos: [currentAccountInfo?.address],
            toLock: addr,
            config:network.value === "mainnet" ? predefinedSporeConfigs.Mainnet : predefinedSporeConfigs.Testnet,
        });
        let signHash = await signAndSendTransaction(txSkeleton);

        const newTx = formatter.toRawTransaction(signHash);

        return await this.transaction_confirm(newTx);
    }

    melt_DOB = async(currentAccountInfo,outPoint) => {
        const network = await this.getNetwork();

        const {index,tx_hash} = outPoint

        const { txSkeleton } = await meltSpore({
            // outPoint:sporeCell.outPoint,
            outPoint:{
                index,
                txHash:tx_hash
            },
            fromInfos: [currentAccountInfo?.address],
            config:network.value === "mainnet" ? predefinedSporeConfigs.Mainnet : predefinedSporeConfigs.Testnet,
        });
        let signHash = await signAndSendTransaction(txSkeleton);
        const newTx = formatter.toRawTransaction(signHash);

        return await this.transaction_confirm(newTx);
    }

    get_SUDT = async(address) =>{
        const hashObj = Wallet.addressToScript(address);
        const{codeHash,hashType,args} = hashObj;
        const network = await this.getNetwork();

        const sporeType = getSudtTypeScript(network.value === "mainnet");

        return await this._request({
            method:"get_cells",
            url:network.rpcUrl.indexer,
            params:[
                {
                    script: {
                        code_hash: codeHash,
                        hash_type:hashType,
                        args
                    },
                    "script_type": "lock",
                    script_search_mode: "exact",
                    filter: {
                        script: {
                            code_hash: sporeType.codeHash,
                            hash_type: sporeType.hashType,
                            args: "0x",
                        },
                        script_search_mode: 'prefix',
                        script_type: 'type',
                    },
                },
                "desc",
                "0x64"
            ]
        })
    }

    send_SUDT = async(obj) => {
        const {currentAccountInfo, toAddress,args, amount,fee} = obj;
        const network = await this.getNetwork();

        if(network.value === "mainnet"){
            config.initializeConfig(config.predefined.LINA);
        }else{
            config.initializeConfig(config.predefined.AGGRON4);
        }

        const indexer = new Indexer(network.rpcUrl.indexer, network.rpcUrl.node);

        let txSkeleton = helpers.TransactionSkeleton({ cellProvider: indexer });
        txSkeleton = await commons.sudt.transfer(
            txSkeleton,
            [currentAccountInfo.address],
            args,
            toAddress,
            amount,null,null,null,
            {
                splitChangeCell:true
            }
            );
        txSkeleton = await commons.common.payFeeByFeeRate(txSkeleton, [currentAccountInfo.address], fee);

        let signHash = await signAndSendTransaction(txSkeleton);

        const newTx = formatter.toRawTransaction(signHash);


        return await this.transaction_confirm(newTx);
    }
}


async function signAndSendTransaction(txSkeleton) {

    const currentAccount = await currentInfo();

    const {privatekey_show} = currentAccount;

    txSkeleton = commons.common.prepareSigningEntries(txSkeleton);

    let signatures = txSkeleton
        .get("signingEntries")
        .map((entry) => hd.key.signRecoverable(entry.message, privatekey_show))
        .toArray();

    return helpers.sealTransaction(txSkeleton, signatures);
}


const getTransactionSizeByTx = (tx) => {
    const serializedTx = blockchain.Transaction.pack(tx);
    // 4 is serialized offset bytesize
    const size = serializedTx.byteLength + 4;
    return size;
}

const calculateFeeCompatible = (size, feeRate)=> {
    const ratio = BI.from(1000);
    const base = BI.from(size).mul(feeRate);
    const fee = base.div(ratio);
    if (fee.mul(ratio).lt(base)) {
        return fee.add(1);
    }
    return BI.from(fee);
}
