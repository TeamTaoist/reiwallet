import Wallet from "../../wallet/wallet";
import {
  BI,
  // CellCollector,
  commons,
  config,
  hd,
  helpers,
  Indexer,
  // RPC,
} from "@ckb-lumos/lumos";
import { parseUnit } from "@ckb-lumos/bi";
import { formatter } from "./formatParams";
import { blockchain } from "@ckb-lumos/base";
import { currentInfo } from "../../wallet/getCurrent";
import {
  predefinedSporeConfigs,
  transferSpore,
  meltSpore,
  transferCluster,
  getSporeByOutPoint,
  getSporeScript,
  getSporeByType,
} from "@spore-sdk/core";
import {
  getSudtTypeScript,
  getXudtTypeScript,
} from "@nervina-labs/ckb-dex/lib/constants";

import { transfer_udt } from "../../utils/ckbRequest";
import {
  buildRgbppLockArgs,
  genCkbJumpBtcVirtualTx,
  genRgbppLockScript,
} from "@rgbpp-sdk/ckb";
import { serializeScript } from "@nervosnetwork/ckb-sdk-utils";
import { RGBCollector } from "../../utils/newCollectorRGB";
import {
  DID_CONTRACT,
  getSecp256k1CellDep,
  localServer,
  mainConfig,
  testConfig,
} from "../../config/constants";
import { networkList } from "../../config/network";
import { ResultFormatter } from "@ckb-lumos/rpc";

import { createTransactionSkeleton } from "@ckb-lumos/helpers";
import LeapHelper from "rgbpp-leap-helper/lib";

/*global chrome*/
chrome.webRequest.onBeforeSendHeaders.addListener(
  (e) => {
    // for (const header of e.requestHeaders) {
    //   if (header.name.toLowerCase() === "origin") {
    //     header.value = "https://reiwallet.origin";
    //   }
    // }
    e.requestHeaders.push({
      name: "Origin",
      value: "https://reiwallet.origin",
    });
    return { requestHeaders: e.requestHeaders };
  },
  { urls: ["<all_urls>"] },
  ["requestHeaders", "extraHeaders"],
);

let jsonRpcId = 0;
export default class RpcClient {
  constructor(networkInfo) {
    this.network = networkInfo;
  }

  async getNetwork() {
    if (this.network) return this.network;
    let rt = await chrome.storage.local.get(["networkInfo"]);
    if (rt) {
      this.network = JSON.parse(rt.networkInfo);
    } else {
      this.network = networkList[0];
    }
    return this.network;
  }

  async _request(obj) {
    ++jsonRpcId;
    const { method, params, url } = obj;

    const body = { jsonrpc: "2.0", id: jsonRpcId, method, params };
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
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

  getPublicKey = async () => {
    let publicKey;
    const currentObj = await chrome.storage.local.get(["current_address"]);
    const current = currentObj.current_address;
    const walletListArr = await chrome.storage.local.get(["walletList"]);
    const walletList = walletListArr.walletList;
    const currentAccount = walletList[current];
    if (currentAccount.publicKey) {
      publicKey = currentAccount.publicKey;
    } else {
      const currentObj = await currentInfo();
      publicKey = hd.key.privateToPublic(currentObj.privatekey_show);

      walletList[current].publicKey = publicKey;
      chrome.storage.local.set({ walletList: walletList });
    }

    return publicKey;
  };

  get_capacity = async (address) => {
    const network = await this.getNetwork();

    if (network.value === "mainnet") {
      config.initializeConfig(config.predefined.LINA);
    } else {
      config.initializeConfig(config.predefined.AGGRON4);
    }
    const indexer = new Indexer(network.rpcUrl.indexer, network.rpcUrl.node);

    let totalCapacity = BI.from(0);
    let OcCapacity = BI.from(0);
    const addressScript = helpers.parseAddress(address);

    const collector = indexer.collector({
      lock: addressScript,
      scriptSearchMode: "exact",
    });

    for await (const cell of collector.collect()) {
      totalCapacity = totalCapacity.add(cell.cellOutput.capacity);
      if (cell.data !== "0x") {
        OcCapacity = OcCapacity.add(cell.cellOutput.capacity);
      }
    }

    return {
      capacity: totalCapacity.toHexString(),
      OcCapacity: OcCapacity.toHexString(),
    };
  };
  get_transaction_list = async (address) => {
    const hashObj = Wallet.addressToScript(address);
    const { codeHash, hashType, args } = hashObj;
    const network = await this.getNetwork();

    console.log(network);
    const url = localServer[network.value];

    return await this._request({
      method: "get_transactions",
      url,
      params: [
        {
          script: {
            code_hash: codeHash,
            hash_type: hashType,
            args,
          },
          script_type: "lock",
          group_by_transaction: true,
        },
        "desc",
        "0x1E",
      ],
    });
  };
  get_transaction = async (txHash) => {
    const network = await this.getNetwork();
    return await this._request({
      method: "get_transaction",
      url: network.rpcUrl.node,
      params: [txHash],
    });
  };

  get_feeRate = async () => {
    const network = await this.getNetwork();
    return await this._request({
      method: "get_fee_rate_statistics",
      url: network.rpcUrl.node,
      params: ["0x65"],
    });
  };
  send_transaction = async (to, amt, fee, isMax) => {
    const network = await this.getNetwork();
    const currentAccount = await currentInfo();

    const { address, privatekey_show } = currentAccount;
    let amount = parseUnit(amt, "ckb");
    if (network.value === "mainnet") {
      config.initializeConfig(config.predefined.LINA);
    } else {
      config.initializeConfig(config.predefined.AGGRON4);
    }
    const indexer = new Indexer(network.rpcUrl.indexer, network.rpcUrl.node);
    let txSkeleton = helpers.TransactionSkeleton({ cellProvider: indexer });
    txSkeleton = await commons.common.transfer(
      txSkeleton,
      [address],
      to,
      amount,
    );
    if (isMax) {
      txSkeleton = await commons.common.payFee(txSkeleton, [address], 0);
    } else {
      txSkeleton = await commons.common.payFeeByFeeRate(
        txSkeleton,
        [address],
        fee /*fee_rate*/,
      );
    }

    txSkeleton = commons.common.prepareSigningEntries(txSkeleton);

    let signatures = txSkeleton
      .get("signingEntries")
      .map((entry) => hd.key.signRecoverable(entry.message, privatekey_show))
      .toArray();

    let signedTx = helpers.sealTransaction(txSkeleton, signatures);

    if (isMax) {
      const size = getTransactionSizeByTx(signedTx);
      const newFee = calculateFeeCompatible(size, fee);
      let outputs = txSkeleton.get("outputs").toArray();
      let item = outputs[0];
      item.cellOutput.capacity = BI.from(amount).sub(newFee).toHexString();
      txSkeleton = txSkeleton.update("outputs", (outputs) => {
        outputs[0] = item;
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
    const outputArr = outputs.map((item) => {
      return {
        capacity: item.cellOutput.capacity,
        address: Wallet.scriptToAddress(
          item.cellOutput.lock,
          network.value === "mainnet",
        ),
      };
    });

    let inputs = txSkeleton.get("inputs").toArray();
    const inputArr = inputs.map((item) => {
      return {
        capacity: item.cellOutput.capacity,
        address: Wallet.scriptToAddress(
          item.cellOutput.lock,
          network.value === "mainnet",
        ),
      };
    });
    return {
      signedTx: newTx,
      inputs: inputArr,
      outputs: outputArr,
    };
  };
  transaction_confirm = async (tx) => {
    const network = await this.getNetwork();
    return await this._request({
      method: "send_transaction",
      url: network.rpcUrl.node,
      params: [tx, "passthrough"],
    });
  };

  get_DOB = async (address, version = "v2") => {
    const hashObj = Wallet.addressToScript(address);
    const { codeHash, hashType, args } = hashObj;
    const network = await this.getNetwork();

    const sporeConfig =
      network.value === "testnet"
        ? predefinedSporeConfigs.Testnet
        : predefinedSporeConfigs.Mainnet;
    const versionStr = network.value === "testnet" ? "preview" : "latest";

    const sporeType = getSporeScript(sporeConfig, "Spore", [
      version,
      versionStr,
    ]);
    return await this._request({
      method: "get_cells",
      url: network.rpcUrl.indexer,
      params: [
        {
          script: {
            code_hash: codeHash,
            hash_type: hashType,
            args,
          },
          script_type: "lock",
          script_search_mode: "exact",
          filter: {
            script: {
              code_hash: sporeType.script.codeHash,
              hash_type: sporeType.script.hashType,
              args: "0x",
            },
            script_search_mode: "exact",
            script_type: "type",
          },
        },
        "desc",
        "0x64",
      ],
    });
  };
  get_DID = async (address) => {
    const hashObj = Wallet.addressToScript(address);
    const { codeHash, hashType, args } = hashObj;
    const network = await this.getNetwork();

    const { CODE_HASH: codeHashDID, HASH_TYPE: hashTypeDID } =
      DID_CONTRACT[network.value];
    const sporeType = {
      script: {
        codeHash: codeHashDID,
        hashType: hashTypeDID,
      },
    };

    return await this._request({
      method: "get_cells",
      url: network.rpcUrl.indexer,
      params: [
        {
          script: {
            code_hash: codeHash,
            hash_type: hashType,
            args,
          },
          script_type: "lock",
          script_search_mode: "exact",
          filter: {
            script: {
              code_hash: sporeType.script.codeHash,
              hash_type: sporeType.script.hashType,
              args: "0x",
            },
            script_search_mode: "exact",
            script_type: "type",
          },
        },
        "desc",
        "0x64",
      ],
    });
  };

  get_Cluster = async (address) => {
    const hashObj = Wallet.addressToScript(address);
    const { codeHash, hashType, args } = hashObj;
    const network = await this.getNetwork();

    const clusterConfig =
      network.value === "mainnet"
        ? predefinedSporeConfigs.Mainnet
        : predefinedSporeConfigs.Testnet;

    const clusterType = getSporeScript(clusterConfig, "Cluster", [
      "v2",
      "preview",
    ]);

    return await this._request({
      method: "get_cells",
      url: network.rpcUrl.indexer,
      params: [
        {
          script: {
            code_hash: codeHash,
            hash_type: hashType,
            args,
          },
          script_type: "lock",
          script_search_mode: "exact",
          filter: {
            script: {
              code_hash: clusterType.script.codeHash,
              hash_type: clusterType.script.hashType,
              args: "0x",
            },
            script_search_mode: "exact",
            script_type: "type",
          },
        },
        "desc",
        "0x64",
      ],
    });
  };

  send_DOB = async (
    currentAccountInfo,
    outPoint,
    toAddress,
    dobType,
    typeScript,
  ) => {
    if (toAddress.startsWith("ck")) {
      await this.send_DOB_CKB(
        currentAccountInfo,
        outPoint,
        toAddress,
        dobType,
        typeScript,
      );
    } else if (toAddress.startsWith("tb") || toAddress.startsWith("bc")) {
      await this.send_DOB_BTC(currentAccountInfo, outPoint, toAddress);
    }
  };
  send_DOB_BTC = async (currentAccountInfo, outPoint, toAddress) => {
    const network = await this.getNetwork();
    const isMainnet = network.value === "mainnet";
    let rpcURL = network.rpcUrl.node;
    let indexURL = network.rpcUrl.indexer;
    const cfg = isMainnet ? mainConfig : testConfig;
    const rgbppLeapHelper = new LeapHelper(
      isMainnet,
      cfg.BTC_ASSETS_API_URL,
      cfg.BTC_ASSETS_TOKEN,
      cfg.BTC_ASSETS_ORGIN,
    );

    const { index, tx_hash } = outPoint;
    let newOutPoint = {
      txHash: tx_hash,
      index,
    };
    const sporeConfig =
      network.value === "mainnet"
        ? predefinedSporeConfigs.Mainnet
        : predefinedSporeConfigs.Testnet;

    let sporeCell = await getSporeByOutPoint(newOutPoint, sporeConfig);

    const args = sporeCell?.cellOutput?.type?.args;

    const ckbRawTx = await rgbppLeapHelper.spore_leapToBtcCreateCkbTx({
      ckbAddress: currentAccountInfo?.address,
      toBtcAddress: toAddress,
      sporeId: args,
    });

    console.log("==ckbRawTx===", ckbRawTx);
  };

  send_DOB_CKB = async (
    currentAccountInfo,
    outPoint,
    toAddress,
    dobType,
    typeScript,
  ) => {
    const network = await this.getNetwork();
    const addr = Wallet.addressToScript(toAddress);
    let feeRateRt = await this.get_feeRate();

    let feeRate = BI.from(feeRateRt.median).toString();

    const { index, tx_hash } = outPoint;
    let newOutPoint = {
      txHash: tx_hash,
      index,
    };
    const sporeConfig =
      network.value === "mainnet"
        ? predefinedSporeConfigs.Mainnet
        : predefinedSporeConfigs.Testnet;

    let sporeCell;
    if (dobType === "spore") {
      sporeCell = await getSporeByOutPoint(newOutPoint, sporeConfig);
    } else {
      sporeCell = await getSporeByType(
        {
          args: typeScript.args,
          codeHash: typeScript.code_hash,
          hashType: typeScript.hash_type,
        },
        sporeConfig,
      );
    }

    let outputCell = JSON.parse(JSON.stringify(sporeCell));
    outputCell.cellOutput.lock = helpers.parseAddress(toAddress, {
      config: sporeConfig.lumos,
    });

    let inputCapacity = sporeCell.cellOutput.capacity;
    let inputOccupied = helpers.minimalCellCapacityCompatible(sporeCell);
    let inputMargin = BI.from(inputCapacity).sub(inputOccupied);

    let outputMin = helpers.minimalCellCapacityCompatible(outputCell);

    let minBi = outputMin.sub(inputOccupied.toString());

    let amount;
    if (minBi.gt("0")) {
      amount = minBi;
    } else {
      amount = BI.from("0");
    }

    const { txSkeleton } = await transferSpore({
      outPoint: {
        index,
        txHash: tx_hash,
      },
      feeRate,
      fromInfos: [currentAccountInfo?.address],
      toLock: addr,
      config:
        network.value === "mainnet"
          ? predefinedSporeConfigs.Mainnet
          : predefinedSporeConfigs.Testnet,
      capacityMargin: inputMargin.add(amount),
      useCapacityMarginAsFee: false,
    });

    let signHash = await signAndSendTransaction(txSkeleton);

    const newTx = formatter.toRawTransaction(signHash);

    return await this.transaction_confirm(newTx);
  };

  send_Cluster = async (obj) => {
    const { currentAccountInfo, outPoint, toAddress } = obj;
    const network = await this.getNetwork();
    const addr = Wallet.addressToScript(toAddress);

    const { index, tx_hash } = outPoint;

    const { txSkeleton } = await transferCluster({
      outPoint: {
        index,
        txHash: tx_hash,
      },
      fromInfos: [currentAccountInfo?.address],
      toLock: addr,
      config:
        network.value === "mainnet"
          ? predefinedSporeConfigs.Mainnet
          : predefinedSporeConfigs.Testnet,
    });
    let signHash = await signAndSendTransaction(txSkeleton);

    const newTx = formatter.toRawTransaction(signHash);

    return await this.transaction_confirm(newTx);
  };

  melt_DOB = async (currentAccountInfo, outPoint) => {
    const network = await this.getNetwork();

    const { index, tx_hash } = outPoint;

    const { txSkeleton } = await meltSpore({
      // outPoint:sporeCell.outPoint,
      outPoint: {
        index,
        txHash: tx_hash,
      },

      fromInfos: [currentAccountInfo?.address],
      config:
        network.value === "mainnet"
          ? predefinedSporeConfigs.Mainnet
          : predefinedSporeConfigs.Testnet,
    });
    let signHash = await signAndSendTransaction(txSkeleton);
    const newTx = formatter.toRawTransaction(signHash);

    return await this.transaction_confirm(newTx);
  };

  get_SUDT = async (address) => {
    const hashObj = Wallet.addressToScript(address);
    const { codeHash, hashType, args } = hashObj;
    const network = await this.getNetwork();

    const sporeType = getSudtTypeScript(network.value === "mainnet");

    return await this._request({
      method: "get_cells",
      url: network.rpcUrl.indexer,
      params: [
        {
          script: {
            code_hash: codeHash,
            hash_type: hashType,
            args,
          },
          script_type: "lock",
          script_search_mode: "exact",
          filter: {
            script: {
              code_hash: sporeType.codeHash,
              hash_type: sporeType.hashType,
              args: "0x",
            },
            script_search_mode: "exact",
            script_type: "type",
          },
        },
        "desc",
        "0x64",
      ],
    });
  };

  send_SUDT = async (obj) => {
    const { currentAccountInfo, toAddress, args, amount, fee } = obj;
    const network = await this.getNetwork();

    if (network.value === "mainnet") {
      config.initializeConfig(config.predefined.LINA);
    } else {
      config.initializeConfig(config.predefined.AGGRON4);
    }

    const indexer = new Indexer(network.rpcUrl.indexer, network.rpcUrl.node);

    let txSkeleton = helpers.TransactionSkeleton({ cellProvider: indexer });

    txSkeleton = await commons.sudt.transfer(
      txSkeleton,
      [currentAccountInfo.address],
      args,
      toAddress,
      amount,
      null,
      null,
      null,
      {
        splitChangeCell: true,
      },
    );

    txSkeleton = await commons.common.payFeeByFeeRate(
      txSkeleton,
      [currentAccountInfo.address],
      fee,
    );
    let signHash = await signAndSendTransaction(txSkeleton);

    const newTx = formatter.toRawTransaction(signHash);

    return await this.transaction_confirm(newTx);
  };

  melt_Cluster = async (currentAccountInfo, outPoint) => {
    const network = await this.getNetwork();

    const { index, tx_hash } = outPoint;

    const { txSkeleton } = await meltSpore({
      // outPoint:sporeCell.outPoint,
      outPoint: {
        index,
        txHash: tx_hash,
      },
      fromInfos: [currentAccountInfo?.address],
      config:
        network.value === "mainnet"
          ? predefinedSporeConfigs.Mainnet
          : predefinedSporeConfigs.Testnet,
    });
    let signHash = await signAndSendTransaction(txSkeleton);
    const newTx = formatter.toRawTransaction(signHash);

    return await this.transaction_confirm(newTx);
  };

  get_XUDT = async (address) => {
    const hashObj = Wallet.addressToScript(address);
    const { codeHash, hashType, args } = hashObj;
    const network = await this.getNetwork();

    const xudtType = getXudtTypeScript(network.value === "mainnet");

    return await this._request({
      method: "get_cells",
      url: network.rpcUrl.indexer,
      params: [
        {
          script: {
            code_hash: codeHash,
            hash_type: hashType,
            args,
          },
          script_type: "lock",
          script_search_mode: "exact",
          filter: {
            script: {
              code_hash: xudtType.codeHash,
              hash_type: xudtType.hashType,
              args: "0x",
            },
            script_search_mode: "exact",
            script_type: "type",
          },
        },
        "desc",
        "0x64",
      ],
    });
  };

  send_ckb2btc_xudt = async (obj) => {
    const network = await this.getNetwork();

    const { toAddress, typeScript, amount } = obj;
    const currentAccount = await currentInfo();

    let btcUtxoList = await this.getRgbppAssert(toAddress, network);
    const { code_hash, hash_type, args } = typeScript;
    let findUtxo = btcUtxoList.filter(
      (utxo) =>
        utxo.ckbCellInfo &&
        utxo.ckbCellInfo.output.type.args === args &&
        utxo.ckbCellInfo.output.type.code_hash === code_hash &&
        utxo.ckbCellInfo.output.type.hash_type === hash_type,
    );

    if (!findUtxo?.length) {
      for (let i = 0; i < btcUtxoList.length; i++) {
        const utxo = btcUtxoList[i];
        if (!utxo.ckbCellInfo) {
          findUtxo[0] = utxo;
          break;
        }
      }
    }
    if (!findUtxo?.length) {
      return "No can use utxo";
    }
    const { txHash: btcTxHash, idx: btcTxIdx } = findUtxo[0];

    const newTypescript = {
      codeHash: code_hash,
      hashType: hash_type,
      args: args,
    };

    if (network.value === "mainnet") {
      config.initializeConfig(config.predefined.LINA);
    } else {
      config.initializeConfig(config.predefined.AGGRON4);
    }

    const collector = new RGBCollector({
      ckbNodeUrl: network.rpcUrl.node,
      ckbIndexerUrl: network.rpcUrl.indexer,
    });
    const toRgbppLockArgs = buildRgbppLockArgs(btcTxIdx, btcTxHash);

    let ckbRawTx;

    ckbRawTx = await genCkbJumpBtcVirtualTx({
      collector,
      fromCkbAddress: currentAccount.address,
      toRgbppLockArgs,
      xudtTypeBytes: serializeScript(newTypescript),
      transferAmount: parseUnit(amount.toString(), "ckb").toBigInt(),
      witnessLockPlaceholderSize: 1000,
    });

    const emptyWitness = { lock: "", inputType: "", outputType: "" };
    let unsignedTx = {
      ...ckbRawTx,
      cellDeps: [
        ...ckbRawTx.cellDeps,
        getSecp256k1CellDep(network.value === "mainnet"),
      ],
      witnesses: [emptyWitness, ...ckbRawTx.witnesses.slice(1)],
    };

    const { privatekey_show } = currentAccount;

    const signedTx = collector.getCkb().signTransaction(privatekey_show)(
      unsignedTx,
    );

    return signedTx;
  };

  send_XUDT = async (obj) => {
    const { toAddress } = obj;
    const network = await this.getNetwork();

    if (toAddress.startsWith("ck")) {
      let txSkeleton = await transfer_udt(obj, network);
      let signHash = await signAndSendTransaction(txSkeleton);
      const newTx = formatter.toRawTransaction(signHash);
      return await this.transaction_confirm(newTx);
    } else if (toAddress.startsWith("tb") || toAddress.startsWith("bc")) {
      let tx = await this.send_ckb2btc_xudt(obj);
      const newTx = formatter.toRawTransaction(tx);
      return await this.transaction_confirm(newTx);
    }
  };

  getLiveCell = async (outPoint) => {
    const network = await this.getNetwork();

    const { txHash, index } = outPoint;

    return await this._request({
      method: "get_live_cell",
      url: network.rpcUrl.indexer,
      params: [
        {
          index,
          tx_hash: txHash,
        },
        true,
        true,
      ],
    });
  };

  signAndSend = async (obj) => {
    const { txSkeletonObj, type } = obj;

    let txSkeleton;
    if (type === "transaction_object") {
      const rawTransaction = ResultFormatter.toTransaction(txSkeletonObj);
      const fetcher = async (outPoint) => {
        let rs = await this.getLiveCell(outPoint);
        let cell = {
          cellOutput: {
            capacity: rs.cell?.output.capacity,
            lock: ResultFormatter.toScript(rs.cell?.output.lock),
            type: ResultFormatter.toScript(rs.cell?.output.type),
          },
          data: rs.cell?.data.content,
          outPoint: ResultFormatter.toOutPoint(outPoint),
        };
        return cell;
      };
      txSkeleton = await createTransactionSkeleton(rawTransaction, fetcher);
    } else {
      txSkeleton = helpers.objectToTransactionSkeleton(txSkeletonObj);
    }

    let signHash = await signAndSendTransaction(txSkeleton);

    const newTx = formatter.toRawTransaction(signHash);
    return await this.transaction_confirm(newTx);
  };
  signRaw = async (obj) => {
    const { txSkeletonObj, type } = obj;

    let txSkeleton;

    if (type === "transaction_object") {
      const rawTransaction = ResultFormatter.toTransaction(txSkeletonObj);

      const fetcher = async (outPoint) => {
        let rs = await this.getLiveCell(outPoint);
        let cell = {
          cellOutput: {
            capacity: rs.cell?.output.capacity,
            lock: ResultFormatter.toScript(rs.cell?.output.lock),
            type: ResultFormatter.toScript(rs.cell?.output.type),
          },
          data: rs.cell?.data.content,
          outPoint: ResultFormatter.toOutPoint(outPoint),
        };
        return cell;
      };

      txSkeleton = await createTransactionSkeleton(rawTransaction, fetcher);
    } else {
      txSkeleton = helpers.objectToTransactionSkeleton(txSkeletonObj);
    }

    const currentAccount = await currentInfo();
    const { privatekey_show } = currentAccount;

    txSkeleton = commons.common.prepareSigningEntries(txSkeleton);

    let signatures = txSkeleton
      .get("signingEntries")
      .map((entry) => hd.key.signRecoverable(entry.message, privatekey_show))
      .toArray();

    let rt = helpers.sealTransaction(txSkeleton, signatures);
    return rt;
  };

  getRgbppAssert = async (address, network) => {
    const isMainnet = network.value === "mainnet";

    const result = await getUtxo(address, isMainnet);

    if (network.value === "mainnet") {
      config.initializeConfig(config.predefined.LINA);
    } else {
      config.initializeConfig(config.predefined.AGGRON4);
    }

    const rgbAssertList = [];

    if (result) {
      const rgbppLockArgsList = [];
      for (let i = 0; i < result.length; i++) {
        const element = result[i];
        const rgbArgs = buildRgbppLockArgs(element.vout, element.txid);
        rgbppLockArgsList.push({
          args: rgbArgs,
          txHash: element.txid,
          idx: element.vout,
          value: element.value,
        });
      }
      const rgbppLocks = rgbppLockArgsList.map((item) => {
        const lock = genRgbppLockScript(item.args, isMainnet);

        return {
          lock,
          txHash: item.txHash,
          idx: item.idx,
          value: item.value,
        };
      });

      for await (const rgbppLock of rgbppLocks) {
        const address = helpers.encodeToAddress(rgbppLock.lock);
        let rs = await this.get_XUDT(address);
        const xudtList = rs?.objects;
        if (xudtList.length > 0) {
          for (let i = 0; i < xudtList.length; i++) {
            const xudt = xudtList[i];
            rgbAssertList.push({
              txHash: rgbppLock.txHash,
              idx: rgbppLock.idx,
              ckbCellInfo: xudt,
              value: rgbppLock.value,
            });
          }
        } else {
          rgbAssertList.push({
            txHash: rgbppLock.txHash,
            idx: rgbppLock.idx,
            value: rgbppLock.value,
          });
        }
      }
    }
    return rgbAssertList;
  };
}

async function signAndSendTransaction(txSkeleton) {
  const currentAccount = await currentInfo();
  const { privatekey_show } = currentAccount;

  txSkeleton = commons.common.prepareSigningEntries(txSkeleton);

  let signatures = txSkeleton
    .get("signingEntries")
    .map((entry) => hd.key.signRecoverable(entry.message, privatekey_show))
    .toArray();

  return helpers.sealTransaction(txSkeleton, signatures);
}

const getTransactionSizeByTx = (tx) => {
  const serializedTx = blockchain.Transaction.pack(tx);
  // 4 is serialized offset byte size
  const size = serializedTx.byteLength + 4;
  return size;
};

const calculateFeeCompatible = (size, feeRate) => {
  const ratio = BI.from(1000);
  const base = BI.from(size).mul(feeRate);
  const fee = base.div(ratio);
  if (fee.mul(ratio).lt(base)) {
    return fee.add(1);
  }
  return BI.from(fee);
};

const getUtxo = async (address, isMainnet) => {
  const res = await fetch(
    `https://mempool.space${
      isMainnet ? "" : "/testnet"
    }/api/address/${address}/utxo`,
    {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  const rt = await res.json();
  if (rt.error) {
    return Promise.reject(rt.error);
  }

  return rt;
};
