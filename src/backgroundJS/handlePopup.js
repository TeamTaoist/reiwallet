/*global chrome*/
import Wallet from "../wallet/wallet";
import { ckbRpcClient } from "./rpc";
import { currentInfo } from "../wallet/getCurrent";
import scope from "../utils/sentry";

const recordToTxList = async (txhash) => {
  if (!txhash) return;
  const currentAccount = await currentInfo();

  /*global chrome*/
  let list = await chrome.storage.local.get(["txList"]);
  let arr = list.txList ? list.txList : [];
  chrome.storage.local.set({
    txList: [
      {
        txhash,
        address: currentAccount?.address,
        created: new Date().valueOf(),
      },
      ...arr,
    ],
  });
};

const removeRecord = async (txhash, result) => {
  /*global chrome*/
  let list = await chrome.storage.local.get(["txList"]);
  let arr = list.txList ? list.txList : [];
  if (!arr.length) return;
  let resultIndex = arr.findIndex((item) => item === txhash);
  arr.splice(resultIndex, 1);
  chrome.storage.local.set({ txList: arr });
};

export const handlePopUp = async (requestData) => {
  switch (requestData.method) {
    case "create_account":
      createNewWallet(requestData);
      break;
    case "get_capacity":
      getCapacity(requestData);
      break;
    case "get_public_key":
      getPublicKey(requestData);
      break;
    case "get_transaction":
      getTransaction(requestData);
      break;
    case "get_transaction_history":
      getTransactionHistory(requestData);
      break;
    case "get_fee_rate":
      getFeeRate(requestData);
      break;
    case "send_transaction":
      sendTransaction(requestData);
      break;
    case "transaction_confirm":
      transactionConfirm(requestData);
      break;
    case "get_dob":
      getDOB(requestData);
      break;
    case "get_did":
      getDID(requestData);
      break;
    case "get_cluster":
      getCluster(requestData);
      break;
    case "send_dob":
      sendDOB(requestData);
      break;
    case "send_cluster":
      sendCluster(requestData);
      break;
    case "melt_dob":
      meltDOB(requestData);
      break;
    case "melt_cluster":
      meltCluster(requestData);
      break;
    case "get_sudt":
      getSUDT(requestData);
      break;
    case "send_sudt":
      sendSUDT(requestData);
      break;
    case "get_xudt":
      getXUDT(requestData);
      break;
    case "send_xudt":
      sendXUDT(requestData);
      break;

    case "sign_send_confirm":
      signAndSend(requestData);
      break;
    case "sign_confirm":
      signRaw(requestData);
      break;
    default:
      console.error("Unknown request: " + requestData);
      break;
  }
};

const sendMsg = (data) => {
  if (data.type.indexOf("error") > -1) {
    try {
      const message =
        typeof data.data === "string" ? data.data : JSON.stringify(data.data);
      scope.captureException(new Error(message));
    } catch (e) {
      console.error(e);
    }
  }

  try {
    /*global chrome*/
    chrome.runtime.sendMessage(data, () => {
      if (chrome.runtime.lastError) {
        console.log(
          "chrome.runtime.lastError",
          chrome.runtime.lastError.message,
        );
        return;
      }
    });
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

export const createNewWallet = async (obj) => {
  const { index, network, hasMnemonic, name, id, method } = obj;
  const wallet = new Wallet(index, network === "mainnet", hasMnemonic);
  try {
    /*global chrome*/
    chrome.storage.local.get(["walletList"], async (result) => {
      let list = result.walletList ?? [];
      const sumArr = list.filter((item) => item.type === "create") ?? [];
      let walletObj = await wallet.GenerateWallet(sumArr.length);

      let item = {
        account: walletObj,
        publicKey: walletObj.publicKey,
        type: "create",
        name,
        account_index: sumArr.length,
      };
      let newList = [...list, item];
      /*global chrome*/
      chrome.storage.local.set({ walletList: newList });
      sendMsg({ type: "create_account_success", data: { id } });
    });
  } catch (e) {
    if (e?.message.includes("no_password")) {
      sendMsg({ type: "to_lock", data: { id } });
    } else {
      sendMsg({ type: `${method}_error`, data: { message: "error", id } });
    }
  }
};

const getCapacity = async (obj) => {
  const { currentAccountInfo } = obj;
  try {
    const client = new ckbRpcClient();
    let rt = await client.get_capacity(currentAccountInfo.address);
    sendMsg({ type: "get_capacity_success", data: rt });
  } catch (e) {
    sendMsg({ type: `${obj.method}_error`, data: e.message });
  }
};
const getPublicKey = async (obj) => {
  try {
    const client = new ckbRpcClient();
    let rt = await client.get_public_key();
    sendMsg({ type: "get_public_key_success", data: rt });
  } catch (e) {
    sendMsg({ type: `${obj.method}_error`, data: e.message });
  }
};

const getTransaction = async (obj) => {
  const { txHash } = obj;
  try {
    const client = new ckbRpcClient();
    let rt = await client.get_transaction(txHash);
    const {
      transaction: { hash },
      tx_status,
    } = rt;

    if (tx_status.status !== "pending" && tx_status.status !== "proposed") {
      await removeRecord(hash, rt);
    }
    sendMsg({ type: "get_transaction_success", data: rt });
  } catch (e) {
    sendMsg({ type: `${obj.method}_error`, data: e.message });
  }
};
const getTransactionHistory = async (obj) => {
  const { currentAccountInfo } = obj;

  try {
    const client = new ckbRpcClient();
    let rt = await client.get_transaction_list(currentAccountInfo.address);
    sendMsg({ type: `${obj.method}_success`, data: rt });
  } catch (e) {
    sendMsg({ type: `${obj.method}_error`, data: e.message });
  }
};

const getFeeRate = async (obj) => {
  try {
    const client = new ckbRpcClient();
    let rt = await client.get_fee_rate();
    sendMsg({ type: "get_fee_rate_success", data: rt });
  } catch (e) {
    sendMsg({ type: `${obj.method}_error`, data: e.message });
  }
};

const sendTransaction = async (obj) => {
  const { to, amount, fee, isMax } = obj;
  try {
    const client = new ckbRpcClient();
    let rt = await client.send_transaction(to, amount, fee, isMax);
    sendMsg({ type: "send_transaction_success", data: rt });
  } catch (e) {
    console.error(`${obj.method}_error`, e.message);
    sendMsg({ type: `${obj.method}_error`, data: e.message });
  }
};

const transactionConfirm = async (obj) => {
  const { tx } = obj;
  try {
    const client = new ckbRpcClient();
    let rt = await client.transaction_confirm(tx);
    await recordToTxList(rt);
    sendMsg({ type: "transaction_confirm_success", data: rt });
  } catch (e) {
    console.error(`${obj.method}_error`, e.message);
    sendMsg({ type: `${obj.method}_error`, data: e.message });
  }
};

const getDOB = async (obj) => {
  const { currentAccountInfo, version } = obj;

  try {
    const client = new ckbRpcClient();
    let rt = await client.get_dob(currentAccountInfo.address, version);
    sendMsg({ type: `${obj.method}_success`, data: rt });
  } catch (e) {
    sendMsg({ type: `${obj.method}_error`, data: e.message });
  }
};
const getDID = async (obj) => {
  const { currentAccountInfo } = obj;

  try {
    const client = new ckbRpcClient();
    let rt = await client.get_did(currentAccountInfo.address);
    sendMsg({ type: `${obj.method}_success`, data: rt });
  } catch (e) {
    sendMsg({ type: `${obj.method}_error`, data: e.message });
  }
};

const sendDOB = async (obj) => {
  const { currentAccountInfo, outPoint, toAddress, dobType, typeScript } = obj;

  try {
    const client = new ckbRpcClient();
    let rt = await client.send_dob(
      currentAccountInfo,
      outPoint,
      toAddress,
      dobType,
      typeScript,
    );
    await recordToTxList(rt);
    sendMsg({ type: `${obj.method}_success`, data: rt });
  } catch (e) {
    console.error(`${obj.method}_error`, e);
    sendMsg({ type: `${obj.method}_error`, data: e.message });
  }
};

const meltDOB = async (obj) => {
  const { currentAccountInfo, outPoint } = obj;

  try {
    const client = new ckbRpcClient();
    let rt = await client.melt_dob(currentAccountInfo, outPoint);
    await recordToTxList(rt);
    sendMsg({ type: `${obj.method}_success`, data: rt });
  } catch (e) {
    console.error(`${obj.method}_error`, e.message);
    sendMsg({ type: `${obj.method}_error`, data: e.message });
  }
};

const getSUDT = async (obj) => {
  const { currentAccountInfo } = obj;

  try {
    const client = new ckbRpcClient();
    let rt = await client.get_sudt(currentAccountInfo.address);
    sendMsg({ type: `${obj.method}_success`, data: rt });
  } catch (e) {
    sendMsg({ type: `${obj.method}_error`, data: e.message });
  }
};

const sendSUDT = async (obj) => {
  try {
    const client = new ckbRpcClient();
    let rt = await client.send_sudt(obj);
    await recordToTxList(rt);
    sendMsg({ type: `${obj.method}_success`, data: rt });
  } catch (e) {
    sendMsg({ type: `${obj.method}_error`, data: e.message });
  }
};

const getCluster = async (obj) => {
  const { currentAccountInfo } = obj;

  try {
    const client = new ckbRpcClient();
    let rt = await client.get_cluster(currentAccountInfo.address);
    sendMsg({ type: `${obj.method}_success`, data: rt });
  } catch (e) {
    sendMsg({ type: `${obj.method}_error`, data: e.message });
  }
};

const sendCluster = async (obj) => {
  try {
    const client = new ckbRpcClient();
    let rt = await client.send_cluster(obj);
    await recordToTxList(rt);
    sendMsg({ type: `${obj.method}_success`, data: rt });
  } catch (e) {
    console.error(`${obj.method}_error`, e.message);
    sendMsg({ type: `${obj.method}_error`, data: e.message });
  }
};

const meltCluster = async (obj) => {
  const { currentAccountInfo, outPoint } = obj;

  try {
    const client = new ckbRpcClient();
    let rt = await client.melt_cluster(currentAccountInfo, outPoint);
    await recordToTxList(rt);
    sendMsg({ type: `${obj.method}_success`, data: rt });
  } catch (e) {
    console.error(`${obj.method}_error`, e.message);
    sendMsg({ type: `${obj.method}_error`, data: e.message });
  }
};

const getXUDT = async (obj) => {
  const { currentAccountInfo } = obj;

  try {
    const client = new ckbRpcClient();
    let rt = await client.get_xudt(currentAccountInfo.address);
    sendMsg({ type: `${obj.method}_success`, data: rt });
  } catch (e) {
    sendMsg({ type: `${obj.method}_error`, data: e.message });
  }
};

const sendXUDT = async (obj) => {
  try {
    const client = new ckbRpcClient();
    let rt = await client.send_xudt(obj);
    await recordToTxList(rt);
    sendMsg({ type: `${obj.method}_success`, data: rt });
  } catch (e) {
    sendMsg({ type: `${obj.method}_error`, data: e.message });
  }
};

const signAndSend = async (obj) => {
  try {
    const client = new ckbRpcClient();
    let rt = await client.sign_and_send(obj);
    await recordToTxList(rt);
    sendMsg({ type: `${obj.method}_success`, data: rt });
  } catch (e) {
    sendMsg({ type: `${obj.method}_error`, data: e.message });
  }
};
const signRaw = async (obj) => {
  try {
    const client = new ckbRpcClient();
    let rt = await client.sign_raw(obj);
    await recordToTxList(rt);
    sendMsg({ type: `${obj.method}_success`, data: rt });
  } catch (e) {
    sendMsg({ type: `${obj.method}_error`, data: e.message });
  }
};
