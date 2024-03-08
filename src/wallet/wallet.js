import * as bip39 from 'bip39';
import { hd } from '@ckb-lumos/lumos';
import { bytes } from '@ckb-lumos/codec';
import { predefined } from '@ckb-lumos/config-manager'
import { encodeToAddress } from '@ckb-lumos/helpers'

const systemScriptsMainnet = predefined.LINA.SCRIPTS
const systemScriptsTestnet = predefined.AGGRON4.SCRIPTS
export default class Wallet{
    constructor(index,isMainnet,mnemonic) {
        this.index = index;
        this.isMainnet = isMainnet;
        this.mnemonic = mnemonic?mnemonic:this.createMnemonic();
    }

    createMnemonic () {
        return bip39.generateMnemonic();
    }


    async GenerateSeed () {
        try{
            return await hd.mnemonic.mnemonicToSeed(this.mnemonic, "");
        }catch (e) {
            console.error("GenerateSeed",e)
        }

    }
    async GenerateWallet () {
        const seed = await this.GenerateSeed();
        const hdWallet = hd.Keychain.fromSeed(seed);
        const path =`m/44'/309'/0'/0/${this.index}`;

        const key= hdWallet.derivePath(path);

        let publicKey = bytes.hexify(key.publicKey);

        let address_main = this.publicKeyToAddress(publicKey,true)
        let address_test = this.publicKeyToAddress(publicKey,false)
            return {
                address_main,
                address_test,
                mnemonic:this.mnemonic
            }
        // return privateKey;
    }

    publicKeyToAddress  (publicKey)  {
        const pubkey = publicKey.startsWith('0x') ? publicKey : `0x${publicKey}`

        return this.scriptToAddress(
            {
                codeHash: systemScriptsMainnet.SECP256K1_BLAKE160.CODE_HASH,
                hashType: systemScriptsMainnet.SECP256K1_BLAKE160.HASH_TYPE,
                args: hd.key.publicKeyToBlake160(pubkey),
            }
        )
    }
    scriptToAddress  (script)  {
        const lumosConfig = !this.isMainnet ? predefined.AGGRON4 : predefined.LINA;
        return encodeToAddress(
            // omit keys other than codeHash, args and hashType
            {
                codeHash: script.codeHash,
                args: script.args,
                hashType: script.hashType,
            },
            { config: lumosConfig }
        )
    }


}
