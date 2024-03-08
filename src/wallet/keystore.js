import crypto from 'crypto'
import { Keccak } from 'sha3'
import { v4 as uuid } from 'uuid'
import scrypt from 'scrypt-js';


const CIPHER = 'aes-128-ctr'
const CKB_CLI_ORIGIN = 'ckb-cli'

// Encrypt and save master extended private key.
export default class Keystore {

  constructor(theCrypto, id) {
    this.crypto = theCrypto
    this.id = id
  }

  static fromJson = (json) => {
    try {
      const object = JSON.parse(json)
      if (object.origin === CKB_CLI_ORIGIN) {
        throw 'Keystore from CKB CLI is not supported'
      }
      if (!object.crypto || !object.id) {
        throw new Error("InvalidKeystore")
      }
      return new Keystore(object.crypto, object.id)
    } catch {
      throw new Error("InvalidKeystore")
    }
  }

  // Create an empty keystore object that contains empty private key
  static createEmpty = () => {
    const salt = crypto.randomBytes(32)
    const iv = crypto.randomBytes(16)
    const kdfparams = {
      dklen: 32,
      salt: salt.toString('hex'),
      n: 2 ** 18,
      r: 8,
      p: 1,
    }
    return new Keystore(
        {
          ciphertext: '',
          cipherparams: {
            iv: iv.toString('hex'),
          },
          cipher: CIPHER,
          kdf: 'scrypt',
          kdfparams,
          mac: '',
        },
        uuid()
    )
  }

  static create = (
      str,
      password,
      options = {}
  ) => {
    const salt = options.salt || crypto.randomBytes(32)
    const iv = options.iv || crypto.randomBytes(16)
    // salt: salt.toString('hex'),
    const kdfparams = {
      dklen: 32,
      salt,
      n: 2 ** 18,
      r: 8,
      p: 1,
    }

    const privateKeyBuffer = Buffer.from(str, 'utf8');

    // const derivedKey = crypto.scryptSync(password, salt, kdfparams.dklen, Keystore.scryptOptions(kdfparams))
    const derivedKey   =  scrypt.syncScrypt(
        Buffer.from(password),
        kdfparams.salt,
        kdfparams.n,
        kdfparams.r,
        kdfparams.p,
        kdfparams.dklen,
        'sha256',
    );

    const cipher = crypto.createCipheriv(CIPHER, derivedKey.slice(0, 16), iv)

    if (!cipher) {
      throw new Error('Unsupported cipher');
    }

    const ciphertext = Buffer.concat([
      cipher.update(privateKeyBuffer),
      cipher.final(),
    ])

    return (
        {
          ciphertext: ciphertext.toString('hex'),
          cipherparams: {
            iv: iv.toString('hex'),
          },
          cipher: CIPHER,
          kdf: 'scrypt',
          kdfparams:kdfparams,
          mac: Keystore.mac(derivedKey, ciphertext),
          id:uuid()
        }

    )
  }

  // Imported from xpub with empty private key.
  isEmpty() {
    return this.crypto.ciphertext === '' && this.crypto.mac === ''
  }

  // Decrypt and return serialized extended private key.
  static decrypt = (keyStr,password)  =>{
    const {kdfparams} = keyStr;

    const salt = kdfparams.salt?.data;

    const derivedKey   =  scrypt.syncScrypt(
        Buffer.from(password),
        salt,
        kdfparams.n,
        kdfparams.r,
        kdfparams.p,
        kdfparams.dklen,
        'sha256',
    );
    const ciphertext = Buffer.from(keyStr.ciphertext, 'hex');
    const mac = new Keccak(256)
        .update(Buffer.concat([derivedKey.slice(16, 32), Buffer.from(ciphertext)]))
        .digest('hex');
    if (mac !== keyStr.mac) {
      throw new Error('Key derivation failed - possibly wrong passphrase');
    }

    const decipher = crypto.createDecipheriv(
        keyStr.cipher,
        derivedKey.slice(0, 16),
        Buffer.from(keyStr.cipherparams.iv, 'hex'),
    );

    const seed =  Buffer.concat([decipher.update(ciphertext), decipher.final()]);

    return seed.toString('utf8');

  }



checkPassword = (password) => {
  const derivedKey = this.derivedKey(password)
  const ciphertext = Buffer.from(this.crypto.ciphertext, 'hex')
  return Keystore.mac(derivedKey, ciphertext) === this.crypto.mac
}

derivedKey = (password) => {
  const { kdfparams } = this.crypto
  return crypto.scryptSync(
      password,
      Buffer.from(kdfparams.salt, 'hex'),
      kdfparams.dklen,
      Keystore.scryptOptions(kdfparams)
  )
}

static mac = (derivedKey, ciphertext) => {
  return new Keccak(256).update(Buffer.concat([derivedKey.slice(16, 32), ciphertext])).digest('hex')
}

static scryptOptions = (kdfparams) => {
  return {
    N: kdfparams.n,
    r: kdfparams.r,
    p: kdfparams.p,
    maxmem: 128 * (kdfparams.n + kdfparams.p + 2) * kdfparams.r,
  }
}
}
