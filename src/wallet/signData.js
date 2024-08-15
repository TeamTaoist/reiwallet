import Blake2b from "./blake2b";
import { hd } from '@ckb-lumos/lumos';
import {currentInfo} from "./getCurrent";

export default class SignData{

     static signByPrivateKey = async(message) => {
        const currentAccount = await currentInfo();
        const {privatekey_show} = currentAccount;

        const newMessage = SignData.signatureHash(message);
        return hd.key.signRecoverable(newMessage, privatekey_show)
    }
     static signatureHash(message) {
        const buffer = Buffer.from( message, 'utf-8')
        const blake2b = new Blake2b()
        blake2b.updateBuffer(buffer)
        return blake2b.digest()
    }


}
