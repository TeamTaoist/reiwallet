import browser from "webextension-polyfill";

export const browserExtensionAdapter = {
    send: (message) => browser.runtime.sendMessage(message),
    receive: (handler) => browser.runtime.onMessage.addListener(handler),
    dispose: (receiver) => browser.runtime.onMessage.removeListener(receiver),
};
