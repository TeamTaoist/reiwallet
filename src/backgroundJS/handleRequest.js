/*global chrome*/
export const handleRequest = async (requestData) =>{
    console.log("====handleRequest=",requestData)
    const {id} = requestData.data;
    let rt;
    try{

        switch (requestData.method){
            case "ckb_requestAccounts":
                rt = await requestAccount();
                console.error(rt,id)
                break;
        }
        if(rt){
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                chrome.tabs.sendMessage(tabs[0].id, { type:"CKB_RESPONSE_BACKGROUND",data: {result:rt, id}});
            });
        }

    }catch (e) {
        console.log("==CKB_RESPONSE_BACKGROUND===",e)
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, { type:"CKB_RESPONSE_BACKGROUND",data:{error:e,id}});
        });
    }



}

const requestAccount = async() =>{
    console.log("==requestAccount===")
    try{
        const walletListArr = await chrome.storage.local.get(['walletList']);
        const walletList = walletListArr?.walletList ?? [];
        const currentObj = await chrome.storage.local.get(['current_address'])
        const current = currentObj?.current_address ?? 0;
        const networkObj = await chrome.storage.local.get(['network'])
        const network = networkObj?.network ?? "mainnet";
        const currentAccount = walletList[current]?.account;
        console.log("==requestAccount===",currentAccount,network)
        if(currentAccount){
            return  network==="mainnet"? currentAccount.address_main : currentAccount.address_test;
        }else{
            return ""
        }

    }catch (e) {
        throw new Error(`requestAccount:${e}`)
    }

}
