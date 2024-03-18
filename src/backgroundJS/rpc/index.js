import Wallet from "../../wallet/wallet";
import {networkList} from "../../constants/network";
import {BI, commons, config, hd, helpers, Indexer} from "@ckb-lumos/lumos";
import {parseUnit} from "@ckb-lumos/bi";
import Keystore from "../../wallet/keystore";
import {formatter} from "./formatParamas";
import {blockchain} from "@ckb-lumos/base";



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

    async currentInfo() {
        const currentObj = await chrome.storage.local.get(['current_address']);
        const current = currentObj.current_address;
        const walletListArr = await chrome.storage.local.get(['walletList'])
        const walletList = walletListArr.walletList
        const currentAccount = walletList[current];
        const result = await chrome.storage.session.get(["password"]);
        const {type,account_index,privateKey}= currentAccount;
        const network = await this.getNetwork();

        let privatekey_show;
        if (type === "create") {
            privatekey_show = await Keystore.decrypt(result?.password,privateKey);
        } else {
            privatekey_show = await Keystore.decrypt(result?.password,privateKey);
        }
        return {
            ...currentAccount,
            privatekey_show,
            address:network.value === "mainnet"? currentAccount.account.address_main : currentAccount.account.address_test
        }
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
        // Abort retrying if the resource doesn't exist
        if (res.status >= 300) {
            /* istanbul ignore next */
            throw new Error(res.status);
        }
        const rt = await res.json();
        return rt?.result;

    }


    get_capacity = async(address) =>{
        const hashObj = Wallet.addressToScript(address);
        const{codeHash,hashType,args} = hashObj;
        const network = await this.getNetwork();

        return await this._request({
            method:"get_cells_capacity",
            url:network.rpcUrl.indexer,
            params:[
                {
                    "script": {
                        "code_hash": codeHash,
                        "hash_type":hashType,
                        args
                    },
                    "script_type": "lock"
                }
            ]
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
        const currentAccount = await this.currentInfo();
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
           let item =outputs[0];
            item.cellOutput.capacity = BI.from(amount).sub(newFee).toHexString();
            console.log(item)

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