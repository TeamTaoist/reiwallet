import * as bip39 from 'bip39';
import { hd } from '@ckb-lumos/lumos';
import { bytes } from '@ckb-lumos/codec';
import { predefined } from '@ckb-lumos/config-manager'
import { encodeToAddress,parseAddress } from '@ckb-lumos/helpers'
import Keystore from "./keystore";
import {getPassword} from "./password";

const systemScriptsMainnet = predefined.LINA.SCRIPTS
// const systemScriptsTestnet = predefined.AGGRON4.SCRIPTS

export default class Wallet{
    constructor(index,isMainnet,hasMnemonic,importMnemonic="create") {
        this.index = index;
        this.isMainnet = isMainnet;
        this.hasMnemonic = hasMnemonic;
        this.importMnemonic = importMnemonic;
        this.mnemonic = "";
    }

    createMnemonic () {
        this.mnemonic = bip39.generateMnemonic();
    }

    async useMnemonic () {
        let result = await getPassword();
        if(!result){
            throw new Error("no_password")
        }
        this.mnemonic = await Keystore.decrypt(result)

    }


    async GenerateSeed () {
        try{
            if(this.hasMnemonic){
                await this.useMnemonic()
            }else{
                if(this.importMnemonic !== "create"){
                    this.mnemonic = this.importMnemonic;
                }else{
                    this.createMnemonic()
                }
            }
            return await hd.mnemonic.mnemonicToSeed(this.mnemonic);
        }catch (e) {
            throw e
        }

    }

    async exportMnemonic  () {
        await this.useMnemonic()
       return this.mnemonic;
    }

    async ExportPrivateKey (account_index) {
        try{
            const key = await this.GenerateKey(account_index);
            return bytes.hexify(key.privateKey);

        }catch (e) {
            throw e
        }
    }
    static privateToWallet (privateKey) {
        let publicKey  = hd.key.privateToPublic(privateKey);
        let address_main = Wallet.publicKeyToAddress(publicKey,true)
        let address_test = Wallet.publicKeyToAddress(publicKey,false)

        return {
            address_main,
            address_test,
            mnemonic:!this.hasMnemonic?this.mnemonic:""
        }

    }


    async GenerateKey (accountIndex) {
        try{
            const seed = await this.GenerateSeed();
            const hdWallet = hd.Keychain.fromSeed(seed);
            const path =`m/44'/309'/0'/0/${accountIndex!==undefined?accountIndex:this.index}`;
            return hdWallet.derivePath(path);
        }catch (e) {
            throw e
        }
    }

    async GenerateWallet (accountIndex) {
        try{
            const key = await this.GenerateKey(accountIndex);
            let publicKey = bytes.hexify(key.publicKey);

            let address_main =Wallet.publicKeyToAddress(publicKey,true)
            let address_test = Wallet.publicKeyToAddress(publicKey,false)

            return {
                address_main,
                address_test,
                mnemonic:!this.hasMnemonic?this.mnemonic:""
            }

        }catch (e) {
            throw e
        }

    }

    static publicKeyToAddress  (publicKey,isMainnet)  {
        const pubkey = publicKey.startsWith('0x') ? publicKey : `0x${publicKey}`

        return Wallet.scriptToAddress(
            {
                codeHash: systemScriptsMainnet.SECP256K1_BLAKE160.CODE_HASH,
                hashType: systemScriptsMainnet.SECP256K1_BLAKE160.HASH_TYPE,
                args: hd.key.publicKeyToBlake160(pubkey),
            },
            isMainnet
        )
    }
    static scriptToAddress  (script,isMainnet)  {
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
    static addressToScript  (address) {
        const prefix = address.slice(0, 3)
        if (prefix !== 'ckt' && prefix !== 'ckb') {
            throw new Error('Invalid address prefix')
        }
        const lumosConfig = prefix === 'ckt' ? predefined.AGGRON4 : predefined.LINA
        return parseAddress(address, { config: lumosConfig })
    }

}
