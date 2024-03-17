import Wallet from "../../wallet/wallet";
import {networkList} from "../../constants/network";
import {commons, config, hd, helpers, Indexer} from "@ckb-lumos/lumos";
import {parseUnit} from "@ckb-lumos/bi";
import Keystore from "../../wallet/keystore";
import {formatter} from "./formatParamas";



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
            params:[]
        })

    }
    send_transaction = async (to,amt,fee) =>{
        console.log("=====global",global)
        const network = await this.getNetwork();
        const currentAccount = await this.currentInfo();
        const {address,privatekey_show} = currentAccount;
        console.log("====send_transaction---------amt--------------",amt)
        let amount = parseUnit(amt,"ckb");

        console.log("====send_transaction---------amount--------------",amount,amt,amount.toNumber())

        if(network.value === "mainnet"){
            config.initializeConfig(config.predefined.LINA);
        }else{
            config.initializeConfig(config.predefined.AGGRON4);
        }

        console.log("====indexer==")

        const indexer = new Indexer(network.rpcUrl.indexer, network.rpcUrl.node);

        console.log("====indexer==",indexer)
        let txSkeleton = helpers.TransactionSkeleton({ cellProvider: indexer });
        console.log("====txSkeleton==",txSkeleton)
        txSkeleton = await commons.common.transfer(txSkeleton, [address], to, amount);
        console.log("====txSkeleton== transfer",fee)
        txSkeleton = await commons.common.payFeeByFeeRate(txSkeleton, [address], fee /*fee_rate*/);
        let aa =await commons.common.payFeeByFeeRate(txSkeleton, [address], fee);
        console.log("====txSkeleton== payFeeByFeeRate",txSkeleton,txSkeleton.toJSON())
        console.log("====txSkeleton== payFeeByFeeRat22222e",aa)
        txSkeleton = commons.common.prepareSigningEntries(txSkeleton);
        console.log("====txSkeleton== prepareSigningEntries",privatekey_show)


        const signatures = txSkeleton
            .get("signingEntries")
            .map((entry) => hd.key.signRecoverable(entry.message, privatekey_show))
            .toArray();

        console.log("======signatures==",signatures)
        const signedTx = helpers.sealTransaction(txSkeleton, signatures);


        console.log("======signedTx==",signedTx)

        const newTx = formatter.toRawTransaction(signedTx)
        console.error("======newTx==",newTx)

        console.log("==network.rpcUrl.node====",network.rpcUrl.node)


        // const rpc = new RPC(network.rpcUrl.node);
        // console.log("==rpc====",rpc)
        // return await rpc.sendTransaction(signedTx);
        return await this._request({
            method:"send_transaction",
            url:network.rpcUrl.node,
            params:[
                newTx
            ]
        })
    }
}



