
/*global chrome*/
export const savePassword = async (password) =>{
    let rt = await switchPassword(password)
    await chrome.storage.session.set({ password:rt });
    return rt;
}


export const switchPassword = async(password) =>{
    const pwdData = new TextEncoder().encode(password);
    let keyBefore = await window.crypto.subtle.digest("SHA-256", pwdData);
    const keyBytes = Buffer.from(keyBefore, 'utf8');
    const key = await window.crypto.subtle.importKey(
        "raw",
        keyBytes,
        { name: "AES-CBC" },
        false,
        ["encrypt", "decrypt"]
    );
    const data = new TextEncoder().encode(process.env.REACT_APP_PASSWORD);
    const iv = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);

    const encryptedData = await window.crypto.subtle.encrypt(
        {
            name: "AES-CBC",
            iv: iv
        },
        key,
        data
    );
    const encryptedDataArray = new Uint8Array(encryptedData);
    return Array.prototype.map.call(encryptedDataArray, x => ('00' + x.toString(16)).slice(-2)).join('');
}


export const getPassword = async () =>{
    let rt = await chrome.storage.session.get(['password']);
    return rt?.password
}

export const clearPassword = ()=>{
     chrome.storage.session.set({ password:null });
}


// decrypt test
// const encryptedDataArray2 = encryptedDataString.match(/.{1,2}/g).map(byte => parseInt(byte, 16));
// const encryptedData2 = new Uint8Array(encryptedDataArray2);
// const decryptedData = await window.crypto.subtle.decrypt(
//     {
//         name: "AES-CBC",
//         iv: iv
//     },
//     key,
//     encryptedData2
// );
// const decryptedDataString = new TextDecoder().decode(decryptedData);
// console.log("Decrypted data:", decryptedDataString);

// const passwordObj= Keystore.create(process.env.REACT_APP_PASSWORD,password);
// const {ciphertext} = passwordObj;
// return ciphertext;
