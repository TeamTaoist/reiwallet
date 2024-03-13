import Wallet from "../../wallet/wallet";
import {networkList} from "../../constants/network";
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
}



