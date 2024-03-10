import * as bip39 from 'bip39';
import { hd } from '@ckb-lumos/lumos';
import { bytes } from '@ckb-lumos/codec';
import { predefined } from '@ckb-lumos/config-manager'
import { encodeToAddress } from '@ckb-lumos/helpers'
import Keystore from "./keystore";

const systemScriptsMainnet = predefined.LINA.SCRIPTS
const systemScriptsTestnet = predefined.AGGRON4.SCRIPTS

export default class Wallet{
    constructor(index,isMainnet,hasMnemonic) {
        this.index = index;
        this.isMainnet = isMainnet;
        this.hasMnemonic = hasMnemonic;
        this.mnemonic = "";
    }

    createMnemonic () {
        this.mnemonic = bip39.generateMnemonic();
        // return bip39.generateMnemonic();
    }

    async useMnemonic () {
        /*global chrome*/
        let result = await chrome.storage.session.get(["password"]);
        if(!result?.password){
            throw new Error("no_password")
        }
        this.mnemonic = await Keystore.decrypt(result?.password)

    }


    async GenerateSeed () {
        try{
            if(this.hasMnemonic){
                await this.useMnemonic()
            }else{
                this.createMnemonic()
            }
            return await hd.mnemonic.mnemonicToSeed(this.mnemonic);
        }catch (e) {
            throw e
        }

    }
    async GenerateWallet () {
        try{
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
            }

        }catch (e) {
            throw e
        }

    }

    publicKeyToAddress  (publicKey,isMainnet)  {
        const pubkey = publicKey.startsWith('0x') ? publicKey : `0x${publicKey}`

        return this.scriptToAddress(
            {
                codeHash: systemScriptsMainnet.SECP256K1_BLAKE160.CODE_HASH,
                hashType: systemScriptsMainnet.SECP256K1_BLAKE160.HASH_TYPE,
                args: hd.key.publicKeyToBlake160(pubkey),
            },
            isMainnet
        )
    }
    scriptToAddress  (script,isMainnet)  {
        const lumosConfig = !isMainnet ? predefined.AGGRON4 : predefined.LINA;
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
