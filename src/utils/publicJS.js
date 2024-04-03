const AddressToShow = (address,num = 5) => {
    let frontStr = address.substring(0, num);
    let afterStr = address.substring(address.length - num, address.length);
    return `${frontStr}...${afterStr}`
}

export const getAccount = async() =>{
    /*global chrome*/
    const walletListArr = await chrome.storage.local.get(['walletList']);
    const walletList = walletListArr?.walletList ?? [];
    const currentObj = await chrome.storage.local.get(['current_address'])
    const current = currentObj?.current_address ?? 0;
    const networkObj = await chrome.storage.local.get(['network'])
    const network = networkObj?.network ?? "mainnet";
    return {currentAccount:walletList[current]?.account,network};

}

export const requestGrant = async(website) =>{

    const {currentAccount,network} = await getAccount();
    let address = network==="mainnet"? currentAccount.address_main : currentAccount.address_test;

    let urlObj = new URL(website);
    const fullDomain = `${urlObj.protocol}//${urlObj.host}`;

    /*global chrome*/
    const whiteListArr = await chrome.storage.local.get(['whiteList']);
    const whiteList = whiteListArr?.whiteList ?? {};
    const websiteObj = whiteList[address]?.find(item=> item === fullDomain);
    return !!websiteObj;
}



const randomSort = (arr) =>{
    const newArr = [...arr]
    const length = newArr.length
    for (let i = 0; i < length; i++) {
        const index = Math.floor(Math.random() * length);
        let temp;
        temp = newArr[index]
        newArr[index] = newArr[i]
        newArr[i] = temp
    }
    return newArr;
}





export default {
    AddressToShow,
    requestGrant,
    getAccount,
    randomSort
}
