
let completer={};

document.addEventListener('CKB_RESPONSE', function(event) {
    const {id,result,error} = event.detail.data;
    if(error){
        completer[id]?.reject(error)
    }else{
        completer[id]?.resolve(result)
    }

    delete completer[id]
});


const request = ({method, data}) =>{

    const id = new Date().valueOf()+ Math.random();
    const request_event = new CustomEvent('CKB_REQUEST', { detail: {  method, data:{data,id}} });
    return new Promise((resolve, reject) => {
        completer[id] = {
            resolve,
            reject
        }
        document.dispatchEvent(request_event);
        // let noTimeout = ["ckb_signMessage"]
        // if(noTimeout.includes(method)) return;

        // setTimeout(()=>{
        //     reject("Time Out");
        //     delete completer[id];
        // },60 * 1000)
    });
}

const isConnected = async() =>{
    let rt = await request({method:"isConnected"});
    const {isConnected} =rt;
    return isConnected;
}

const nextCall = {} ;

document.addEventListener('CKB_ON_RESPONSE', function(event) {
    const {result,method} = event.detail;
    if(!method)return;
    let arr = nextCall[method] ??[];
    arr.map((item) =>{
        item(result)
    })
});



const on = (method, callback) =>{
    if(!callback)return;

    if(!nextCall[method]){
        nextCall[method] = [];
    }
    nextCall[method].push(callback)
}

let injectedCkb ={
    version:"0.0.1",
    request,
    isConnected,
    on
}
window.ckb = Object.freeze(injectedCkb);
