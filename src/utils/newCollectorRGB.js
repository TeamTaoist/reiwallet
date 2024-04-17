import CKB from '@nervosnetwork/ckb-sdk-core';
import { hexToBytes } from '@nervosnetwork/ckb-sdk-utils';

import camelcaseKeys from 'camelcase-keys';
import {BI} from "@ckb-lumos/lumos";
 const toCamelcase = (object) => {
  try {
    return JSON.parse(
        JSON.stringify(
            camelcaseKeys(object, {
              deep: true,
            }),
        ),
    );
  } catch (error) {
    console.error(error);
  }
  return null;
};

const parseScript = (script) => ({
  code_hash: script.codeHash,
  hash_type: script.hashType,
  args: script.args,
});

 const MIN_CAPACITY = BI.from(61).toBigInt() * BI.from(10000_0000).toBigInt();

export const append0x = (hex) => {
  return hex?.startsWith('0x') ? hex : `0x${hex}`;
};


const leToU128 = (leHex) => {
  const bytes = hexToBytes(append0x(leHex));
  const beHex = `0x${bytes.reduceRight((pre, cur) => pre + cur.toString(16).padStart(2, '0'), '')}`;
  return BI.from(beHex).toBigInt();
};
export class RGBCollector {

  constructor({ ckbNodeUrl, ckbIndexerUrl }) {
    this.ckbNodeUrl = ckbNodeUrl;
    this.ckbIndexerUrl = ckbIndexerUrl;
  }

  getCkb() {
    return new CKB(this.ckbNodeUrl);
  }

  async getCells({
    lock,
    type,
  }){
    let param = {
      script_search_mode: 'exact',
    };
    if (lock) {
      const filter = type
        ? {
            script: parseScript(type),
          }
        : {
            script: null,
            output_data_len_range: ['0x0', '0x1'],
          };
      param = {
        ...param,
        script: parseScript(lock),
        script_type: 'lock',
        filter,
      };
    } else if (type) {
      param = {
        ...param,
        script: parseScript(type),
        script_type: 'type',
      };
    }
    let payload = {
      id: Math.floor(Math.random() * 100000),
      jsonrpc: '2.0',
      method: 'get_cells',
      params: [param, 'asc', '0x3E8'],
    };
    const body = JSON.stringify(payload, null, '  ');


    const res = await fetch(this.ckbIndexerUrl, {
      method: 'POST',
      body: body,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const response = await res.json();
    if (response.error) {
      /* istanbul ignore next */
      throw new Error('Get cells error');
      // return Promise.reject(rt.error);
    } else {
      return toCamelcase(response.result.objects);
    }

  }

  collectInputs(
    liveCells,
    needCapacity,
    fee,
    minCapacity,
    errMsg,
  ) {
    const changeCapacity = minCapacity ?? MIN_CAPACITY;
    let inputs= [];
    let sumInputsCapacity = BI.from(0).toBigInt();
    for (let cell of liveCells) {
      inputs.push({
        previousOutput: {
          txHash: cell.outPoint.txHash,
          index: cell.outPoint.index,
        },
        since: '0x0',
      });
      sumInputsCapacity += BI.from(cell.output.capacity).toBigInt();
      if (sumInputsCapacity >= needCapacity + changeCapacity + fee) {
        break;
      }
    }
    if (sumInputsCapacity < needCapacity + changeCapacity + fee) {
      const message = errMsg ?? 'Insufficient free CKB balance';
      throw new Error(message);
    }
    return { inputs, sumInputsCapacity };
  }

  collectUdtInputs(liveCellsA, needAmountAAA) {

    const {liveCells, needAmount} = liveCellsA;

    let inputs = [];
    let sumInputsCapacity = BI.from(0).toBigInt();
    let sumAmount = BI.from(0).toBigInt();
    // for (let cell of liveCells) {

    for(let i = 0;i<liveCells.length;i++){
    let cell = liveCells[i];
      inputs.push({
        previousOutput: {
          txHash: cell.outPoint.txHash,
          index: cell.outPoint.index,
        },
        since: '0x0',
      });
      // sumInputsCapacity = sumInputsCapacity + BI.from(cell.output.capacity).toBigInt();
      sumInputsCapacity = sumInputsCapacity + BI.from(cell.output.capacity).toBigInt();
      sumAmount += leToU128(cell.outputData);
      if (sumAmount >= needAmount) {
        break;
      }
    }
    if (sumAmount < needAmount) {
      throw new Error('Insufficient UDT balance');
    }
    console.log("inputs, sumInputsCapacity, sumAmount",inputs, sumInputsCapacity, sumAmount)
    return { inputs, sumInputsCapacity, sumAmount };
  }

  async getLiveCell(outPoint) {
    const ckb = new CKB(this.ckbNodeUrl);
    const { cell } = await ckb.rpc.getLiveCell(outPoint, true);
    return cell;
  }
}
