import { hexToBytes } from "@nervosnetwork/ckb-sdk-utils";
import { BI } from "@ckb-lumos/lumos";

/*global chrome*/
const addressToShow = (address, num = 5) => {
  if (!address || typeof address !== "string") return "...";
  let frontStr = address?.substring(0, num);
  let afterStr = address?.substring(address?.length - num, address?.length);
  return `${frontStr}...${afterStr}`;
};

export const getAccount = async () => {
  const walletListArr = await chrome.storage.local.get(["walletList"]);
  const walletList = walletListArr?.walletList ?? [];
  const currentObj = await chrome.storage.local.get(["current_address"]);
  const current = currentObj?.current_address ?? 0;
  const networkObj = await chrome.storage.local.get(["network"]);
  const network = networkObj?.network ?? "mainnet";

  if (!walletList.length) {
    throw new Error("No account found.");
  }
  return { currentAccount: walletList[current]?.account, network };
};

export const requestGrant = async (website) => {
  const { currentAccount, network } = await getAccount();
  let address =
    network === "mainnet"
      ? currentAccount?.address_main
      : currentAccount?.address_test;
  let urlObj = new URL(website);
  const fullDomain = `${urlObj.protocol}//${urlObj.host}`;
  /*global chrome*/
  const whiteListArr = await chrome.storage.local.get(["whiteList"]);
  const whiteList = whiteListArr?.whiteList ?? {};
  const websiteObj = whiteList[address]?.find((item) => item === fullDomain);
  return !!websiteObj;
};

const randomSort = (arr) => {
  const newArr = [...arr];
  const length = newArr.length;
  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * length);
    let temp;
    temp = newArr[index];
    newArr[index] = newArr[i];
    newArr[i] = temp;
  }
  return newArr;
};

export const unSerializeTokenInfo = (hexData) => {
  const buf = hexToBytes(hexData);
  const view = new DataView(buf.buffer);

  const decimal = view.getUint8(0);

  const nameLen = view.getUint8(1);

  let header = 2;
  const nameMax = header + nameLen;
  const nameBuf = new ArrayBuffer(nameLen);
  const nameView = new DataView(nameBuf);
  for (let i = 0; header < nameMax; header++, i++) {
    const v = view.getUint8(header);
    nameView.setUint8(i, v);
  }

  const symbolLen = view.getUint8(header);
  header++;
  const symbolMax = header + symbolLen;
  const symbolBuf = new ArrayBuffer(symbolLen);
  const symbolView = new DataView(symbolBuf);
  for (let i = 0; header < symbolMax; header++, i++) {
    const v = view.getUint8(header);
    symbolView.setUint8(i, v);
  }

  return {
    decimal,
    name: Buffer.from(nameBuf).toString(),
    symbol: Buffer.from(symbolBuf).toString(),
  };
};

export const parseFixed = (amount, decimal) => {
  const amountBI = BI.from(amount);
  const newAmount = amountBI.div(10 ** decimal);
  return newAmount;
};

export const getUtxoStore = async () => {
  let rt = await chrome.storage.local.get(["utxo"]);
  const { utxo } = rt;

  const date = new Date().valueOf();
  return utxo.filter((utx) => utx.timeStamp + 5 * 60 * 1000 > date);
};

export const setUtxo = (txSkeleton) => {
  try {
    // const inputsArr = txSkeleton.get("inputs").toArray();

    const inputsArr = txSkeleton.inputs;
    const utxoList = getUtxoStore();
    for (let i = 0; i < inputsArr.length; i++) {
      utxoList.push({
        timeStamp: new Date().valueOf(),
        index: inputsArr[i].previous_output.index,
        txHash: inputsArr[i].previous_output.tx_hash,
      });
    }
    chrome.storage.local.set({ utxo: utxoList });
  } catch (e) {
    console.log(e);
  }
};

export default {
  addressToShow,
  requestGrant,
  getAccount,
  parseFixed,
  getUtxoStore,
  setUtxo,
  randomSort,
};
