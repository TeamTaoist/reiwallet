import { handleRequest } from "../../backgroundJS/handleRequest";
import { handlePopUp } from "../../backgroundJS/handlePopup";
import PublicJS from "../../utils/publicJS";

const handleON = async (data, method, windowObj) => {
  const windowID = windowObj.id;

  /*global chrome*/
  const tabs = await chrome.tabs.query({ active: true, windowId: windowID });
  const url = tabs[0].url;
  let hasGrant = await PublicJS.requestGrant(url);

  let obj = {
    data,
    type: "success",
  };

  if (!hasGrant && method === "accountsChanged") {
    obj = {
      type: "error",
      data: "This account and/or method has not been authorized by the user.",
    };
  }

  /*global chrome*/
  chrome.tabs.query({ active: true, windowId: windowID }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { type: "CKB_ON_INJECT", result: obj, method },
      () => {
        if (chrome.runtime.lastError) {
          console.log(
            "chrome.runtime.lastError",
            chrome.runtime.lastError.message,
          );
          return;
        }
      },
    );
  });
};

async function init() {
  // var dbName = "DatabaseName";
  // var open = indexedDB.open(dbName, 1);

  /*global chrome*/
  chrome.runtime.onInstalled.addListener((e) => {
    console.log("onInstalled", e);
    if (e && e.reason && e.reason === "install") {
      const privacyUrl = chrome.runtime.getURL("install.html");
      chrome.tabs.create({
        url: privacyUrl,
      });
    }
  });

  /*global chrome*/
  const windowObj = await chrome.windows.getCurrent();

  /*global chrome*/
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    let requestType = message.type;

    switch (requestType) {
      case "CKB_POPUP":
        handlePopUp(message.data);
        break;

      case "CKB_REQUEST_BACKGROUND":
        handleRequest(message.data, windowObj);
        break;
      case "CKB_ON_BACKGROUND":
        handleON(message.data, message.method, windowObj);
        break;
    }
    sendResponse({ message: message });
  });
}

init();
