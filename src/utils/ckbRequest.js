import { Indexer, config, helpers, commons } from "@ckb-lumos/lumos";
import { BI, parseUnit } from "@ckb-lumos/bi";
import { addCellDep } from "@ckb-lumos/common-scripts/lib/helper";

import { number, bytes } from "@ckb-lumos/codec";

import { getXudtDep } from "@nervina-labs/ckb-dex/lib/constants";
import { getSecp256k1CellDep, MAX_FEE } from "@rgbpp-sdk/ckb";
import { blockchain } from "@ckb-lumos/base";
import Wallet from "../wallet/wallet";

// transfer udt
export const transfer_udt = async (options, network, currentAccount) => {
  const unsigned = await sudt_xudt_buildTransfer(
    options,
    network,
    currentAccount,
  );
  return unsigned;
};

const sudt_xudt_buildTransfer = async (options, network) => {
  console.log("======options", options);
  if (network.value === "mainnet") {
    config.initializeConfig(config.predefined.LINA);
  } else {
    config.initializeConfig(config.predefined.AGGRON4);
  }

  const amount = parseUnit(options.amount.toString(), "ckb");
  const indexer = new Indexer(network.rpcUrl.indexer, network.rpcUrl.node);
  let txSkeleton = helpers.TransactionSkeleton({ cellProvider: indexer });
  const { code_hash, hash_type, args } = options.typeScript;

  console.log("======options", code_hash, hash_type, args);

  const sudtToken = {
    codeHash: code_hash,
    hashType: hash_type,
    args: args,
  };

  const fromScript = Wallet.addressToScript(options.currentAccountInfo.address);
  const toScript = Wallet.addressToScript(options.toAddress);
  let sudt_cellDeps;
  sudt_cellDeps = getXudtDep(network.value === "Mainnet");

  let fromDeps = getSecp256k1CellDep(network.value === "Mainnet");

  txSkeleton = addCellDep(txSkeleton, sudt_cellDeps);
  txSkeleton = addCellDep(txSkeleton, fromDeps);

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

  const inputs_sudt = [];
  let sudt_sumCapacity = BI.from(0);
  let sudt_sumAmount = BI.from(0);

  for await (const collect of collect_sudt.collect()) {
    inputs_sudt.push(collect);

    sudt_sumCapacity = sudt_sumCapacity.add(collect.cellOutput.capacity);
    let addNum = undefined;
    try {
      addNum = number.Uint128LE.unpack(collect.data);
    } catch (error) {
      console.warn(error.message);
    }
    if (addNum) {
      sudt_sumAmount = sudt_sumAmount.add(addNum);
      if (sudt_sumAmount.gte(amount)) {
        break;
      }
    }
  }
  if (sudt_sumAmount.lt(amount)) {
    throw new Error("Not enough udt amount");
  }

  for (let i = 0; i < inputs_sudt.length; i++) {
    const input = inputs_sudt[i];
    txSkeleton = txSkeleton.update("inputs", (inputs) => inputs.push(input));
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
  const outputs_sudt_capacity = BI.from(
    helpers.minimalCellCapacity(outputs_sudt),
  );
  outputs_sudt.cellOutput.capacity = outputs_sudt_capacity.toHexString();
  outputCapacity = outputCapacity.add(outputs_sudt_capacity);

  const change_amount = sudt_sumAmount.sub(amount);

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
    const outputs_sudt_change_capacity = BI.from(
      helpers.minimalCellCapacity(outputs_sudt_change),
    );
    outputs_sudt_change.cellOutput.capacity =
      outputs_sudt_change_capacity.toHexString();

    outputCapacity = outputCapacity.add(outputs_sudt_change_capacity);

    txSkeleton = txSkeleton.update("outputs", (outputs) =>
      outputs.push(outputs_sudt, outputs_sudt_change),
    );
  } else {
    txSkeleton = txSkeleton.update("outputs", (outputs) =>
      outputs.push(outputs_sudt),
    );
  }

  let needCapacity = outputCapacity.add(MAX_FEE);

  const minFromCKBCell = BI.from(
    helpers.minimalCellCapacity({
      cellOutput: {
        lock: fromScript,
        capacity: BI.from(0).toHexString(),
      },
      data: "0x",
    }),
  );

  if (needCapacity.lt(sudt_sumCapacity)) {
    const ckb_change = sudt_sumCapacity.sub(needCapacity);
    // if (ckb_change.gt(0)) {
    //   const output_ckb_change = {
    //     cellOutput: {
    //       lock: fromScript,
    //       capacity: ckb_change.toHexString(),
    //     },
    //     data: "0x",
    //   };
    //   txSkeleton = txSkeleton.update("outputs", (outputs) =>
    //       outputs.push(output_ckb_change)
    //   );
    // }

    if (ckb_change.gt(minFromCKBCell)) {
      const output_ckb_change = {
        cellOutput: {
          lock: fromScript,
          capacity: ckb_change.toHexString(),
        },
        data: "0x",
      };

      txSkeleton = txSkeleton.update("outputs", (outputs) =>
        outputs.push(output_ckb_change),
      );
    } else {
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
        break;
      }
      if (inputs_ckb.length <= 0) {
        throw new Error("Cannot find empty cell");
      }
      for (let i = 0; i < inputs_ckb.length; i++) {
        const element = inputs_ckb[i];
        element.cellOutput.capacity = "0x0";
        txSkeleton = await commons.common.setupInputCell(txSkeleton, element);
      }
      const new_ckb_change = ckb_sum.add(ckb_change);
      if (new_ckb_change.gt(0)) {
        const output_ckb_change = {
          cellOutput: {
            lock: fromScript,
            capacity: new_ckb_change.toHexString(),
          },
          data: "0x",
        };
        txSkeleton = txSkeleton.update("outputs", (outputs) =>
          outputs.push(output_ckb_change),
        );
      }
    }
  } else {
    needCapacity = needCapacity.sub(sudt_sumCapacity);
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
    // >>
    if (ckb_sum.lt(needCapacity)) {
      throw new Error("No enough capacity");
    }
    for (let i = 0; i < inputs_ckb.length; i++) {
      const element = inputs_ckb[i];

      txSkeleton = txSkeleton.update("inputs", (inputs) =>
        inputs.push(element),
      );
    }
    const ckb_change = ckb_sum.sub(needCapacity);
    if (ckb_change.gt(0)) {
      const output_ckb_change = {
        cellOutput: {
          lock: fromScript,
          capacity: ckb_change.toHexString(),
        },
        data: "0x",
      };
      txSkeleton = txSkeleton.update("outputs", (outputs) =>
        outputs.push(output_ckb_change),
      );
    }
  }

  const firstIndex = txSkeleton
    .get("inputs")
    .findIndex((input) =>
      bytes.equal(
        blockchain.Script.pack(input.cellOutput.lock),
        blockchain.Script.pack(fromScript),
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
  return txSkeleton;
};
