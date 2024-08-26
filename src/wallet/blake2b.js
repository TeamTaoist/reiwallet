import { CKBHasher } from "@ckb-lumos/base/lib/utils";
import { bytes } from "@ckb-lumos/codec";

export default class Blake2b {
  constructor() {
    this.blake2b = new CKBHasher();
  }

  update = (message) => {
    const msg = message.startsWith("0x") ? message : `0x${message}`;
    this.blake2b.update(bytes.bytify(msg));
  };

  updateBuffer = (message) => {
    this.blake2b.update(message);
  };

  digest = () => {
    return this.blake2b.digestHex();
  };

  static digest = (message) => {
    const blake2bHash = new Blake2b();
    blake2bHash.update(message);
    return blake2bHash.digest();
  };
}
