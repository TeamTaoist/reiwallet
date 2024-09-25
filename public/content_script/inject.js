let completer = {};

document.addEventListener("CKB_RESPONSE", function (event) {
  const { id, result, error } = event.detail.data;
  if (error) {
    completer[id]?.reject(error);
  } else {
    completer[id]?.resolve(result);
  }

  delete completer[id];
});

const ReiWalletRequest = ({ method, data }) => {
  const id = new Date().valueOf() + Math.random();
  const request_event = new CustomEvent("CKB_REQUEST", {
    detail: { method, data: { data, id } },
  });
  return new Promise((resolve, reject) => {
    completer[id] = {
      resolve,
      reject,
    };
    document.dispatchEvent(request_event);
    // let noTimeout = ["ckb_signMessage"]
    // if(noTimeout.includes(method)) return;

    // setTimeout(()=>{
    //     reject("Time Out");
    //     delete completer[id];
    // },60 * 1000)
  });
};

const ReiWalletIsConnected = async () => {
  let rt = await ReiWalletRequest({ method: "isConnected" });
  const { isConnected } = rt;
  return isConnected;
};

const nextCall = {};

document.addEventListener("CKB_ON_RESPONSE", function (event) {
  const { result, method } = event.detail;
  if (!method) return;
  let arr = nextCall[method] ?? [];
  arr.map((item) => {
    item(result);
  });
});

/**
 * add listener to listen for the event method.
 * @param {*} method
 * @param {*} callback
 */
const ReiWalletOn = (method, callback) => {
  if (!callback) return;

  if (!nextCall[method]) {
    nextCall[method] = [];
  }
  nextCall[method].push(callback);
};

/**
 *
 * @param {*} method
 * @param {*} callback
 */
const ReiWalletOff = (method, callback) => {
  if (!callback) return;

  if (!nextCall[method]) return;
  const arr = nextCall[method].filter((item) => item !== callback);
  nextCall[method] = arr;
};

let injectedCkb = {
  version: "#VERSION#",
  request: ReiWalletRequest,
  isConnected: ReiWalletIsConnected,
  off: ReiWalletOff,
  on: ReiWalletOn,
};
// window.ckb = Object.freeze(injectedCkb);

/**
 * Inject ckb object to the webpage.
 * The injected object is read-only.
 * TODO: we should use rei as the name of this injected object, since we will have both btc and ckb.
 */
if (!window.ckb) {
  window.ckb = new Proxy(injectedCkb, {
    deleteProperty: () => true,
  });
}

Object.defineProperty(window, "ckb", {
  value: new Proxy(injectedCkb, {
    deleteProperty: () => true,
  }),
  writable: false,
});
