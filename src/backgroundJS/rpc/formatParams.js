export const formatter = {
  toHash: (hash) => {
    if (typeof hash !== "string") {
      throw new Error(`StringHashTypeException:${hash}`);
    }
    return hash.startsWith("0x") ? hash : `0x${hash}`;
  },
  toNumber: (number) => {
    if (typeof number === "bigint") {
      return `0x${number.toString(16)}`;
    }
    if (typeof number !== "string") {
      throw new Error(`BigintOrHexStringTypeException:${number}`);
    }
    if (!number.startsWith("0x")) {
      throw new Error(`HexStringWithout0xException:${number}`);
    }
    return number;
  },
  toScript: (script) => {
    const { codeHash, hashType: hash_type, ...rest } = script;
    return {
      code_hash: formatter.toHash(codeHash),
      hash_type,
      ...rest,
    };
  },
  toOutPoint: (outPoint) => {
    const { txHash, index, ...rest } = outPoint;
    return {
      tx_hash: formatter.toHash(txHash),
      index: formatter.toNumber(index),
      ...rest,
    };
  },
  toInput: (input) => {
    if (!input) return input;
    const { previousOutput, since, ...rest } = input;
    return {
      previous_output: formatter.toOutPoint(previousOutput),
      since: formatter.toNumber(since),
      ...rest,
    };
  },
  toOutput: (output) => {
    if (!output) return output;
    const { capacity, lock, type = undefined, ...rest } = output;
    return {
      capacity: formatter.toNumber(capacity),
      lock: formatter.toScript(lock),
      type: type ? formatter.toScript(type) : type,
      ...rest,
    };
  },
  toDepType: (type) => {
    if (type === "depGroup") {
      return "dep_group";
    }
    return type;
  },
  toOrder: (order) => {
    return order;
  },
  toCellDep: (cellDep) => {
    if (!cellDep) return cellDep;
    const { outPoint, depType = "code", ...rest } = cellDep;
    return {
      out_point: formatter.toOutPoint(outPoint),
      dep_type: formatter.toDepType(depType),
      ...rest,
    };
  },
  toRawTransaction: (transaction) => {
    if (!transaction) return transaction;
    const {
      version,
      cellDeps = [],
      inputs = [],
      outputs = [],
      outputsData: outputs_data = [],
      headerDeps: header_deps = [],
      ...rest
    } = transaction;
    const formattedInputs = inputs.map((input) => formatter.toInput(input));
    const formattedOutputs = outputs.map((output) =>
      formatter.toOutput(output),
    );
    const formattedCellDeps = cellDeps.map((cellDep) =>
      formatter.toCellDep(cellDep),
    );
    const tx = {
      version: formatter.toNumber(version),
      cell_deps: formattedCellDeps,
      inputs: formattedInputs,
      outputs: formattedOutputs,
      outputs_data,
      header_deps,
      ...rest,
    };
    return tx;
  },
};
