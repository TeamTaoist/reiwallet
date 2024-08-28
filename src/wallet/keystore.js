import crypto from "crypto";
import { Keccak } from "sha3";
import { v4 as uuid } from "uuid";
import scrypt from "scrypt-js";

const CIPHER = "aes-128-ctr";

// Encrypt and save master extended private key.
export default class Keystore {
  // Create an empty keystore object that contains empty private key
  static createEmpty = () => {
    const salt = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const kdfParams = {
      dkLen: 32,
      salt: salt.toString("hex"),
      n: 2 ** 18,
      r: 8,
      p: 1,
    };
    return new Keystore(
      {
        cipherText: "",
        cipherParams: {
          iv: iv.toString("hex"),
        },
        cipher: CIPHER,
        kdf: "scrypt",
        kdfParams,
        mac: "",
      },
      uuid(),
    );
  };

  static create = (str, password, options = {}) => {
    const salt = options.salt || crypto.randomBytes(32);
    const iv = options.iv || crypto.randomBytes(16);
    // salt: salt.toString('hex'),
    const kdfParams = {
      dkLen: 32,
      salt,
      n: 2 ** 18,
      r: 8,
      p: 1,
    };

    const privateKeyBuffer = Buffer.from(str, "utf8");

    // const derivedKey = crypto.scryptSync(password, salt, kdfParams.dkLen, Keystore.scryptOptions(kdfParams))
    const derivedKey = scrypt.syncScrypt(
      Buffer.from(password),
      kdfParams.salt,
      kdfParams.n,
      kdfParams.r,
      kdfParams.p,
      kdfParams.dkLen,
      "sha256",
    );

    const cipher = crypto.createCipheriv(CIPHER, derivedKey.slice(0, 16), iv);

    if (!cipher) {
      throw new Error("Unsupported cipher");
    }

    const cipherText = Buffer.concat([
      cipher.update(privateKeyBuffer),
      cipher.final(),
    ]);

    return {
      cipherText: cipherText.toString("hex"),
      cipherParams: {
        iv: iv.toString("hex"),
      },
      cipher: CIPHER,
      kdf: "scrypt",
      kdfParams: kdfParams,
      mac: Keystore.mac(derivedKey, cipherText),
      id: uuid(),
    };
  };

  // Decrypt and return serialized extended private key.
  static decrypt = async (password, decryptStr) => {
    /*global chrome*/
    let keyStr;
    if (!decryptStr) {
      let keyJson = await chrome.storage.local.get(["Mnemonic"]);
      keyStr = JSON.parse(keyJson.Mnemonic);
    } else {
      keyStr = decryptStr;
    }

    const { kdfParams } = keyStr;

    const salt = kdfParams.salt?.data;

    const derivedKey = scrypt.syncScrypt(
      Buffer.from(password),
      salt,
      kdfParams.n,
      kdfParams.r,
      kdfParams.p,
      kdfParams.dkLen,
      "sha256",
    );
    const cipherText = Buffer.from(keyStr.cipherText, "hex");
    const mac = new Keccak(256)
      .update(
        Buffer.concat([derivedKey.slice(16, 32), Buffer.from(cipherText)]),
      )
      .digest("hex");
    if (mac !== keyStr.mac) {
      throw new Error("Key derivation failed - possibly wrong passphrase");
    }

    const decipher = crypto.createDecipheriv(
      keyStr.cipher,
      derivedKey.slice(0, 16),
      Buffer.from(keyStr.cipherParams.iv, "hex"),
    );

    const seed = Buffer.concat([decipher.update(cipherText), decipher.final()]);

    return seed.toString("utf8");
  };

  static checkPassword = async (password) => {
    /*global chrome*/
    let keyJson = await chrome.storage.local.get(["Mnemonic"]);
    let keyStr = JSON.parse(keyJson.Mnemonic);
    keyStr.kdfParams.salt = keyStr.kdfParams.salt?.data;

    const { kdfParams } = keyStr;
    const derivedKey = scrypt.syncScrypt(
      Buffer.from(password),
      kdfParams.salt,
      kdfParams.n,
      kdfParams.r,
      kdfParams.p,
      kdfParams.dkLen,
    );

    const cipherText = Buffer.from(keyStr.cipherText, "hex");
    return Keystore.mac(derivedKey, cipherText) === keyStr.mac;
  };

  static derivedKey = (password, kdfParams) => {
    return scrypt.syncScrypt(
      password,
      Buffer.from(kdfParams.salt, "hex"),
      kdfParams.dkLen,
      Keystore.scryptOptions(kdfParams),
    );
  };

  static mac = (derivedKey, cipherText) => {
    return new Keccak(256)
      .update(Buffer.concat([derivedKey.slice(16, 32), cipherText]))
      .digest("hex");
  };

  static scryptOptions = (kdfParams) => {
    return {
      N: kdfParams.n,
      r: kdfParams.r,
      p: kdfParams.p,
      maxmem: 128 * (kdfParams.n + kdfParams.p + 2) * kdfParams.r,
    };
  };
}
