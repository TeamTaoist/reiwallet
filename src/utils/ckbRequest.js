import {
  Indexer,
  commons,
  config,
  helpers,
} from "@ckb-lumos/lumos";
import {BI, parseUnit} from "@ckb-lumos/bi";
import { addCellDep } from "@ckb-lumos/common-scripts/lib/helper";

import { number, bytes } from "@ckb-lumos/codec";

import {getXudtTypeScript,getXudtDep} from "@nervina-labs/ckb-dex/lib/constants";


export const remove0x = (hex) => {
  if (hex.startsWith("0x")) {
    return hex.substring(2);
  }
  return hex;
};


export const calculateEmptyCellMinCapacity = (lock)=> {
  const lockArgsSize = remove0x(lock.args).length / 2;
  const cellSize = 33 + lockArgsSize + 8;
  //@ts-ignore
  return parseUnit(cellSize + 1 + "", "ckb");
};



  // transfer udt
  export const transfer_udt = async(options,network) => {


    const unsigned = await sudt_xudt_buildTransfer(options,network);
    // return helpers.createTransactionFromSkeleton(unsigned);
    return unsigned;
  }

  const sudt_xudt_buildTransfer = async(options,network) =>{

    console.log("sudt_xudt_buildTransfe----r",options,network)

    console.log("===config.predefined.LINA",config.predefined.LINA)

    if(network.value === "mainnet"){
      config.initializeConfig(config.predefined.LINA);
    }else{
      config.initializeConfig(config.predefined.AGGRON4);
    }

    const amount = parseUnit(options.amount.toString(),"ckb")
    console.log("=======config======",config)
    const indexer = new Indexer(network.rpcUrl.indexer, network.rpcUrl.node);

    console.log("=======indexer======",indexer)
    let txSkeleton = helpers.TransactionSkeleton({ cellProvider: indexer });

    console.log("=======txSkeleton======",txSkeleton)

    const {code_hash,hash_type,args} = options.typeScript;

    const sudtToken = {
      codeHash: code_hash,
      hashType: hash_type,
      args: args
    };

    console.log("=======sudtToken======",sudtToken)

    //
    // const xudtScript = getXudtTypeScript(network.value === "Mainnet");

    const CONFIG = network.value === "Mainnet"? config.predefined.LINA:config.predefined.AGGRON4;

    console.log("=======CONFIG======",CONFIG)

    const fromScript = helpers.parseAddress(options.currentAccountInfo.address, { config:CONFIG });
    const fromAddress = helpers.encodeToAddress(fromScript, { config: CONFIG });

    console.log("fromAddress----",fromAddress,fromScript);

    const toScript = helpers.parseAddress(options.toAddress, { config: CONFIG });
    const toAddress = helpers.encodeToAddress(toScript, { config: CONFIG });

    console.log("toAddress----",toAddress);


    let sudt_cellDeps;
    sudt_cellDeps = getXudtDep(network.value === "Mainnet");


    console.log("=======sudt_cellDeps======",sudt_cellDeps)
    txSkeleton = addCellDep(txSkeleton, sudt_cellDeps);

    console.log("=======txSkeleton======",txSkeleton,indexer)

    // find sudt
    // <<
    const collect_sudt = indexer.collector({
      lock: {
        script: fromScript,
        searchMode: "exact",
      },
      type: {
        script: sudtToken,
        searchMode: "exact",
      },
    });


    console.log("=======collect_sudt======",collect_sudt)
    const inputs_sudt = [];
    let sudt_sumCapacity = BI.from(0);
    let sudt_sumAmount = BI.from(0);


    for await (const collect of collect_sudt.collect()) {
      console.log("====collect",collect.cellOutput.capacity.toString(),collect)
      inputs_sudt.push(collect);

      sudt_sumCapacity = sudt_sumCapacity.add(collect.cellOutput.capacity);
      let addNum = undefined;
      try {
        addNum = number.Uint128LE.unpack(collect.data);
      } catch (error) {
        console.warn(error.message);
      }
      console.log("=======addNum======",addNum)
      if (addNum) {
        sudt_sumAmount = sudt_sumAmount.add(addNum);

        console.error("=======sudt_sumAmount======",sudt_sumAmount,"aaa")
        console.error("=======sudt_sumAmount.gte(amount)======",sudt_sumAmount.gte(amount))

        if (sudt_sumAmount.gte(amount)) {
          break;
        }
      }
    }


    // >>
    if (sudt_sumAmount.lt(amount)) {
      throw new Error("Not enough sudt amount");
    }

    console.log("inputs_sudt",inputs_sudt)
    for (let i = 0; i < inputs_sudt.length; i++) {
      const input = inputs_sudt[i];
      // input.cellOutput.capacity = "0x0";

      console.log("inputs_sudt[i]=",inputs_sudt[i],i,fromAddress,CONFIG)


      // txSkeleton = await commons.common.setupInputCell(txSkeleton, input,fromAddress,{ config: CONFIG });

      txSkeleton = txSkeleton.update("inputs", (inputs) =>{

        inputs.push(input);
        console.log("==inputs==",inputs)
      })

      console.log("txSkeleton",txSkeleton)

    }

    let outputCapacity = BI.from(0);

    const outputData = number.Uint128LE.pack(amount);
    const newOutputData = outputData;

    const outputs_sudt = {
      cellOutput: {
        capacity: "0x0",
        lock: toScript,
        type: sudtToken,
      },
      data: bytes.hexify(newOutputData),
    };
    console.log("=======outputs_sudt======",outputs_sudt)

    const outputs_sudt_capacity = BI.from(
      helpers.minimalCellCapacity(outputs_sudt)
    );


    console.log("=======outputs_sudt_capacity======",outputs_sudt_capacity)
    outputs_sudt.cellOutput.capacity = outputs_sudt_capacity.toHexString();
    outputCapacity = outputCapacity.add(outputs_sudt_capacity);


    const change_amount = sudt_sumAmount.sub(amount);

    console.log("=======change_amount======",change_amount.toString(),change_amount.gt(0))

    if (change_amount.gt(0)) {
      const changeData = number.Uint128LE.pack(change_amount);
      const newChangeData = changeData;

      const outputs_sudt_change = {
        cellOutput: {
          capacity: "0x0",
          lock: fromScript,
          type: sudtToken,
        },
        data: bytes.hexify(newChangeData),
      };
      console.log("=======outputs_sudt_change======",outputs_sudt_change)

      const outputs_sudt_change_capacity = BI.from(
        helpers.minimalCellCapacity(outputs_sudt_change)
      );

      console.log("=======outputs_sudt_change_capacity======",outputs_sudt_change_capacity)
      outputs_sudt_change.cellOutput.capacity =
        outputs_sudt_change_capacity.toHexString();

      outputCapacity = outputCapacity.add(outputs_sudt_change_capacity);
      console.log("=======outputCapacity======",outputCapacity.toString())
      console.log("=======outputs_sudt_change======",outputs_sudt_change)
      console.log("=======txSkeleton======",txSkeleton.outputs.toJSON())

      txSkeleton = txSkeleton.update("outputs", (outputs) =>{
            console.error("====outputs000",outputs.toJSON(),outputs_sudt)
         outputs.push(outputs_sudt, outputs_sudt_change);
         console.error("====outputs",outputs.toJSON(),outputs_sudt_change)
      }




      );



    } else {
      txSkeleton = txSkeleton.update("outputs", (outputs) =>
        outputs.push(outputs_sudt)
      );
    }

    console.log("=======change_amount======",change_amount)

    const minEmptyCapacity = calculateEmptyCellMinCapacity(fromScript);
    const needCapacity = outputCapacity
      .sub(sudt_sumCapacity)
      .add(minEmptyCapacity)
      .add(2000); // fee

    console.log("=======needCapacity======",needCapacity)

    // find ckb
    // <<
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

    console.log("=======ckb_sum======",ckb_sum)
    // >>
    if (ckb_sum.lt(needCapacity)) {
      throw new Error("No enough capacity");
    }
    for (let i = 0; i < inputs_ckb.length; i++) {
      const element = inputs_ckb[i];
      // element.cellOutput.capacity = "0x0";
      // txSkeleton = await commons.common.setupInputCell(txSkeleton, element);

      txSkeleton = txSkeleton.update("inputs", (inputs) =>
          inputs.push(element)
      );
    }


    const ckb_change = ckb_sum.sub(needCapacity);


    console.log("=======ckb_change======",ckb_change.toString())
    if (ckb_change.gt(0)) {
      const output_ckb_change = {
        cellOutput: {
          lock: fromScript,
          capacity: ckb_change.toHexString(),
        },
        data: "0x",
      };
      txSkeleton = txSkeleton.update("outputs", (outputs) =>
        outputs.push(output_ckb_change)
      );
    }

    console.log("=======txSkeleton======",txSkeleton.toJSON())
    console.log("=======txSkeletonoutputs======",txSkeleton.outputs.toJSON())

    return txSkeleton;
  }
