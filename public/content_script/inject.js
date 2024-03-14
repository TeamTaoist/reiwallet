
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
        let arr = ["test"]
        if(arr.includes(method)) return;

        setTimeout(()=>{
            reject("Time Out");
            delete completer[id];
        },60 * 1000)
    });


}

let injectedCkb ={
    version:"0.0.1",
    request
}
window.ckb = Object.freeze(injectedCkb);
