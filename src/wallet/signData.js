import Blake2b from "./blake2b";
import { hd } from '@ckb-lumos/lumos';
import {currentInfo} from "./getCurrent";

export default class SignData{

     static signByPrivateKey = async(message) => {
        const currentAccount = await currentInfo();
        const {privatekey_show} = currentAccount;

        let newMessage
         if (!/^0x([0-9a-fA-F][0-9a-fA-F])*$/.test(message)) {
             newMessage = SignData.signatureHash(message);
         }else{
             newMessage = message;
         }
        return hd.key.signRecoverable(newMessage, privatekey_show)
    }
     static signatureHash(message) {
        const buffer = Buffer.from( message, 'utf-8')
        const blake2b = new Blake2b()
        blake2b.updateBuffer(buffer)
        return blake2b.digest()
    }


}
