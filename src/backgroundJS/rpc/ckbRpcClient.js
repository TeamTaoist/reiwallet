// Description: This file contains the implementation of the RPC client.
// It is used to send requests to the CKB node and the indexer.
// The RPC client is used by the background script to interact with the CKB node and the indexer.
// The RPC client is used to send requests to the CKB node and the indexer.

// Third-party libraries

// Lumos
import {
  BI,
  // CellCollector,
  commons,
  config,
  hd,
  helpers,
  Indexer,
  RPC,
} from "@ckb-lumos/lumos";
import { parseUnit } from "@ckb-lumos/bi";
import { ParamsFormatter as formatter } from "@ckb-lumos/rpc";
import { blockchain } from "@ckb-lumos/base";
import { ResultFormatter } from "@ckb-lumos/rpc";
import { createTransactionSkeleton } from "@ckb-lumos/helpers";

// CKB SDK
import { serializeScript } from "@nervosnetwork/ckb-sdk-utils";

// Spore SDK
import {
  predefinedSporeConfigs,
  transferSpore,
  meltSpore,
  transferCluster,
  getSporeByOutPoint,
  getSporeScript,
  getSporeByType,
  assembleTransferSporeAction,
  assembleCobuildWitnessLayout,
} from "@spore-sdk/core";

// CKB DEX
import {
  getSudtTypeScript,
  getXudtTypeScript,
} from "@nervina-labs/ckb-dex/lib/constants";

// RGBPP SDK
import {
  buildRgbppLockArgs,
  genCkbJumpBtcVirtualTx,
  genRgbppLockScript,
  getSecp256k1CellDep,
} from "@rgbpp-sdk/ckb";
import LeapHelper from "rgbpp-leap-helper/lib";

// Self-defined functions
import Wallet from "../../wallet/wallet";
import { getCurNetwork, currentInfo } from "../../wallet/getCurrent";
import { transfer_udt } from "../../utils/ckbRequest";
import { RGBCollector } from "../../utils/newCollectorRGB";
import {
  DID_CONTRACT,
  localServer,
  mainConfig,
  testConfig,
} from "../../config/constants";
import { predefined } from "@ckb-lumos/config-manager";
import { bytes } from "@ckb-lumos/codec";

const MAX_FEE = BI.from("20000000");

/*global chrome*/
let jsonRpcId = 0;
export default class RpcClient {
  constructor(networkInfo) {}

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

  get_public_key = async () => {
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
    const network = await getCurNetwork();

    if (network.value === "mainnet") {
      config.initializeConfig(config.predefined.LINA);
    } else {
      config.initializeConfig(config.predefined.AGGRON4);
    }
    const indexer = new Indexer(network.rpcUrl.indexer, network.rpcUrl.node);

    let totalCapacity = BI.from(0);
    let OcCapacity = BI.from(0);
    const addressScript = Wallet.addressToScript(address);

    const collector = indexer.collector({
      lock: addressScript,
      scriptSearchMode: "exact",
    });

    for await (const cell of collector.collect()) {
      totalCapacity = totalCapacity.add(cell.cellOutput.capacity);
      if (cell?.cellOutput.type != null) {
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
    const network = await getCurNetwork();
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
    const network = await getCurNetwork();
    return await this._request({
      method: "get_transaction",
      url: network.rpcUrl.node,
      params: [txHash],
    });
  };

  get_fee_rate = async () => {
    const network = await getCurNetwork();
    let result = await this._request({
      method: "get_fee_rate_statistics",
      url: network.rpcUrl.node,
      params: ["0x65"],
    });

    let maxNum = Math.max(parseInt(result.median), 1100).toString(16);
    result.median = `0x${maxNum}`;
    return result;
  };

  send_transaction = async (to, amt, fee, isMax) => {
    const network = await getCurNetwork();
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
    const network = await getCurNetwork();
    return await this._request({
      method: "send_transaction",
      url: network.rpcUrl.node,
      params: [tx, "passthrough"],
    });
  };

  get_dob = async (address, version = "v2") => {
    const hashObj = Wallet.addressToScript(address);
    const { codeHash, hashType, args } = hashObj;
    const network = await getCurNetwork();

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

  get_did = async (address) => {
    const hashObj = Wallet.addressToScript(address);
    const { codeHash, hashType, args } = hashObj;
    const network = await getCurNetwork();

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

  get_cluster = async (address) => {
    const hashObj = Wallet.addressToScript(address);
    const { codeHash, hashType, args } = hashObj;
    const network = await getCurNetwork();

    const clusterConfig =
      network.value === "mainnet"
        ? predefinedSporeConfigs.Mainnet
        : predefinedSporeConfigs.Testnet;

    const versionStr = network.value === "testnet" ? "preview" : "latest";

    const clusterType = getSporeScript(clusterConfig, "Cluster", [
      "v2",
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

  send_dob = async (
    currentAccountInfo,
    outPoint,
    toAddress,
    dobType,
    typeScript,
  ) => {
    if (toAddress.startsWith("ck")) {
      await this.send_dob_ckb(
        currentAccountInfo,
        outPoint,
        toAddress,
        dobType,
        typeScript,
      );
    } else if (toAddress.startsWith("tb") || toAddress.startsWith("bc")) {
      await this.send_dob_btc(currentAccountInfo, outPoint, toAddress);
    }
  };

  send_dob_btc = async (currentAccountInfo, outPoint, toAddress) => {
    const network = await getCurNetwork();
    const isMainnet = network.value === "mainnet";
    const newConfig = isMainnet ? predefined.LINA : predefined.AGGRON4;
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
    const rpcURL = network.rpcUrl.node;
    const rpc = new RPC(rpcURL);
    const fetcher = async (outPoint) => {
      let rt = await rpc.getLiveCell(outPoint, true);
      const { data, output } = rt.cell;
      return { data, cellOutput: output, outPoint };
    };

    let txSkeleton = await helpers.createTransactionSkeleton(ckbRawTx, fetcher);

    const inputArr = txSkeleton.get("inputs").toArray();
    const outputArr = txSkeleton.get("outputs").toArray();

    const inputObj = inputArr[0];
    const { content } = inputObj.data;
    inputObj.data = content;
    const outputObj = outputArr[0];

    let inputMin = inputObj.cellOutput.capacity;
    let inputOccupid = helpers.minimalCellCapacityCompatible(inputObj);

    let newMargin = BI.from(inputMin).sub(inputOccupid);

    let outputMin = helpers
      .minimalCellCapacityCompatible(outputObj)
      .add(newMargin);
    let minBi = outputMin.sub(inputMin.toString());

    let amount;

    if (minBi.gt("0")) {
      amount = minBi;
    } else {
      amount = BI.from("0");
    }
    let capcityFormat = BI.from(inputMin);

    txSkeleton = txSkeleton.update("outputs", (outputs) => outputs.clear());

    outputObj.cellOutput.capacity = amount.add(capcityFormat).toHexString();
    txSkeleton = txSkeleton.update("outputs", (outputs) =>
      outputs.push(outputObj),
    );

    const fromScript = Wallet.addressToScript(currentAccountInfo?.address);

    let needCapacity = BI.from(
      helpers.minimalCellCapacity({
        cellOutput: {
          lock: fromScript,
          capacity: BI.from(0).toHexString(),
        },
        data: "0x",
      }),
    )
      .add(MAX_FEE)
      .add(amount);

    const indexURL = network.rpcUrl.indexer;
    const indexer = new Indexer(indexURL, rpcURL);

    const collect_ckb = indexer.collector({
      lock: {
        script: fromScript,
        searchMode: "exact",
      },
      type: "empty",
    });

    const inputs_ckb = [];
    let ckb_sum = BI.from(0);
    for await (const collect of collect_ckb.collect()) {
      inputs_ckb.push(collect);
      ckb_sum = ckb_sum.add(collect.cellOutput.capacity);
      if (ckb_sum.gte(needCapacity)) {
        break;
      }
    }

    if (ckb_sum.lt(needCapacity)) {
      throw new Error("Not Enough capacity found");
    }
    const { codeHash: myCodeHash, hashType: myHashType } = fromScript;
    let cellDep_script_lock;

    for (let key in newConfig.SCRIPTS) {
      let item = newConfig.SCRIPTS[key];
      if (item.CODE_HASH === myCodeHash && item.HASH_TYPE === myHashType) {
        cellDep_script_lock = item;
        break;
      }
      throw new Error("script not found");
    }

    let oldInputs = txSkeleton.get("inputs");
    txSkeleton = txSkeleton.update("inputs", (inputs) => inputs.clear());
    txSkeleton = txSkeleton.update("inputs", (inputs) =>
      inputs.push(...inputs_ckb, ...oldInputs),
    );

    const outputCapacity = ckb_sum.sub(MAX_FEE).sub(amount);

    txSkeleton = txSkeleton.update("outputs", (outputs) =>
      outputs.push({
        cellOutput: {
          capacity: `0x${outputCapacity.toString(16)}`,
          lock: fromScript,
        },
        data: "0x",
      }),
    );

    const {
      TX_HASH: tx_hash_lock,
      INDEX: index_lock,
      DEP_TYPE: dep_type_lock,
    } = cellDep_script_lock;

    txSkeleton = txSkeleton.update("cellDeps", (cellDeps) =>
      cellDeps.push({
        outPoint: {
          txHash: tx_hash_lock,
          index: index_lock,
        },
        depType: dep_type_lock,
      }),
    );

    let sporeCoBuild = generateSporeCoBuild_Single(inputObj, outputObj);

    txSkeleton = txSkeleton.update("witnesses", (witnesses) =>
      witnesses.clear(),
    );

    txSkeleton = await updateWitness(
      txSkeleton,
      fromScript,
      inputObj.cellOutput.type.codeHash,
      sporeCoBuild,
    );
    const unsignedTx = helpers.createTransactionFromSkeleton(txSkeleton);

    const size = getTransactionSizeByTx(unsignedTx);

    let rt = await this.get_fee_rate();
    const { median } = rt;

    let fee = BI.from(median);

    const newFee = calculateFeeCompatible(size, fee);
    const outputCapacityFact = ckb_sum.sub(newFee).sub(amount);
    let outputs = txSkeleton.get("outputs").toArray();
    let item = outputs[1];
    item.cellOutput.capacity = outputCapacityFact.toHexString();
    txSkeleton = txSkeleton.update("outputs", (outputs) => {
      outputs.set(1, item);
      return outputs;
    });

    const unsignedRawTx = helpers.transactionSkeletonToObject(txSkeleton);

    return await this.sign_and_send({
      txSkeletonObj: unsignedRawTx,
    });
  };

  send_dob_ckb = async (
    currentAccountInfo,
    outPoint,
    toAddress,
    dobType,
    typeScript,
  ) => {
    const network = await getCurNetwork();
    const addr = Wallet.addressToScript(toAddress);
    let feeRateRt = await this.get_fee_rate();

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
    outputCell.cellOutput.lock = Wallet.addressToScript(toAddress);

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

  send_cluster = async (obj) => {
    const { currentAccountInfo, outPoint, toAddress } = obj;
    const network = await getCurNetwork();
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

  melt_dob = async (currentAccountInfo, outPoint) => {
    const network = await getCurNetwork();

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

  get_sudt = async (address) => {
    const hashObj = Wallet.addressToScript(address);
    const { codeHash, hashType, args } = hashObj;
    const network = await getCurNetwork();

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

  send_sudt = async (obj) => {
    const { currentAccountInfo, toAddress, args, amount, fee } = obj;
    const network = await getCurNetwork();

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

  melt_cluster = async (currentAccountInfo, outPoint) => {
    const network = await getCurNetwork();

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

  get_xudt = async (address) => {
    const hashObj = Wallet.addressToScript(address);
    const { codeHash, hashType, args } = hashObj;
    const network = await getCurNetwork();

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
    const network = await getCurNetwork();

    const { toAddress, typeScript, amount } = obj;
    const currentAccount = await currentInfo();

    let btcUtxoList = await this._getRgbppAssert(toAddress, network);
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

  send_xudt = async (obj) => {
    const { toAddress } = obj;
    const network = await getCurNetwork();

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

  get_live_cell = async (outPoint) => {
    const network = await getCurNetwork();

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

  sign_and_send = async (obj) => {
    let signHash = await this.sign_raw(obj);
    const newTx = formatter.toRawTransaction(signHash);
    return await this.transaction_confirm(newTx);
  };

  sign_raw = async (obj) => {
    const { txSkeletonObj, type } = obj;

    let txSkeleton;

    if (type === "transaction_object") {
      const rawTransaction = ResultFormatter.toTransaction(txSkeletonObj);
      const fetcher = async (outPoint) => {
        let rs = await this.get_live_cell(outPoint);
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
    let rt = await signAndSendTransaction(txSkeleton);
    return rt;
  };

  _getRgbppAssert = async (address, network) => {
    const isMainnet = network.value === "mainnet";

    const result = await getUTXO(address, isMainnet);

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

      // Need Optimization: here it's quite slow to get xudt info for each rgbppLock. [F]
      for await (const rgbppLock of rgbppLocks) {
        const address = Wallet.scriptToAddress(rgbppLock.lock);
        let rs = await this.get_xudt(address);
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

const getUTXO = async (address, isMainnet) => {
  const res = await fetch(
    `https://mempool.space${
      isMainnet ? "" : "/testnet"
    }/api/address/${address}/utxo`,
    {
      method: "GET",
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

const generateSporeCoBuild_Single = (sporeCell, outputCell) => {
  const { actions } = assembleTransferSporeAction(sporeCell, outputCell);
  return assembleCobuildWitnessLayout(actions);
};

const updateWitness = async (
  txSkeleton,
  myScript,
  code_hash_contract_type,
  sporeCoBuild,
) => {
  const inputArr = txSkeleton.get("inputs").toArray();
  for (let i = 0; i < inputArr.length; i++) {
    txSkeleton = txSkeleton.update("witnesses", (witnesses) =>
      witnesses.push("0x"),
    );
  }

  const firstIndex = txSkeleton
    .get("inputs")
    .findIndex((input) =>
      bytes.equal(
        blockchain.Script.pack(input.cellOutput.lock),
        blockchain.Script.pack(myScript),
      ),
    );
  if (firstIndex !== -1) {
    while (firstIndex >= txSkeleton.get("witnesses").size) {
      txSkeleton = txSkeleton.update("witnesses", (witnesses) =>
        witnesses.push("0x"),
      );
    }
    let witness = txSkeleton.get("witnesses").get(firstIndex);
    const newWitnessArgs = {
      /* 65-byte zeros in hex */
      lock: "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    };
    if (witness !== "0x") {
      const witnessArgs = blockchain.WitnessArgs.unpack(bytes.bytify(witness));
      const lock = witnessArgs.lock;
      if (
        !!lock &&
        !!newWitnessArgs.lock &&
        !bytes.equal(lock, newWitnessArgs.lock)
      ) {
        throw new Error(
          "Lock field in first witness is set aside for signature!",
        );
      }
      const inputType = witnessArgs.inputType;
      if (!!inputType) {
        newWitnessArgs.inputType = inputType;
      }
      const outputType = witnessArgs.outputType;
      if (!!outputType) {
        newWitnessArgs.outputType = outputType;
      }
    }
    witness = bytes.hexify(blockchain.WitnessArgs.pack(newWitnessArgs));
    txSkeleton = txSkeleton.update("witnesses", (witnesses) =>
      witnesses.set(firstIndex, witness),
    );
  }

  const contractIndex = txSkeleton
    .get("inputs")
    .findIndex(
      (input) => input.cellOutput.type?.codeHash === code_hash_contract_type,
    );

  while (contractIndex >= txSkeleton.get("witnesses").size) {
    txSkeleton = txSkeleton.update("witnesses", (witnesses) =>
      witnesses.push("0x"),
    );
  }
  txSkeleton = txSkeleton.update("witnesses", (witnesses) =>
    witnesses.set(txSkeleton.get("inputs").size, sporeCoBuild),
  );

  return txSkeleton;
};
