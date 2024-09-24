import { v4 as uuid } from "uuid";
import {
  createJSONRPCErrorResponse,
  createJSONRPCRequest,
  createJSONRPCSuccessResponse,
  isJSONRPCRequest,
  isJSONRPCResponse,
  JSONRPCErrorCode,
} from "json-rpc-2.0";
import browser from "webextension-polyfill";

export const SESSION_MESSAGE_SYMBOL = "__SESSION_MESSAGE_SYMBOL__";

export function createSessionMessenger(config) {
  const { sessionId = uuid() } = config;

  let handlers = new Set();
  let reqId = 1;

  const genJsonRpcRequestId = () => `${sessionId}:${reqId++}`;
  const isCurrentSessionMessage = (message) => {
    return (
      typeof message.rpc.id === "string" && message.rpc.id.startsWith(sessionId)
    );
  };

  return {
    sessionId: () => sessionId,
    send: (type, param) => {
      const currentReqId = genJsonRpcRequestId();

      const requestMessage = createSessionMessage(
        createJSONRPCRequest(currentReqId, String(type), param),
      );
      browser.runtime.sendMessage(requestMessage);

      return new Promise((resolve, reject) => {
        browser.runtime.onMessage.addListener(
          function handleResponse(unknownMessage) {
            if (!isSessionMessage(unknownMessage)) {
              return;
            }

            const res = unknownMessage.rpc;
            if (!isJSONRPCResponse(res) || res.id !== currentReqId) return;

            browser.runtime.onMessage.removeListener(handleResponse);

            if (res.error) {
              reject(res.error);
            } else {
              resolve(res.result);
            }
          },
        );
      });
    },
    register: (method, handler) => {
      browser.runtime.onMessage.addListener(
        async function handleRequest(unknownMessage) {
          if (!isSessionMessage(unknownMessage)) {
            return;
          }

          if (!isCurrentSessionMessage(unknownMessage)) return;

          const req = unknownMessage.rpc;
          if (!isJSONRPCRequest(req) || req.method !== method) return;

          const res = await (async () => {
            if (!req.id) throw new Error(`request id is required`);
            try {
              return createJSONRPCSuccessResponse(
                req.id,
                await handler(req.params),
              );
            } catch (e) {
              const errorMessage =
                e instanceof Error ? e.message : "Internal Error";
              return createJSONRPCErrorResponse(
                req.id,
                JSONRPCErrorCode.InternalError,
                errorMessage,
                e,
              );
            }
          })();

          browser.runtime.sendMessage(createSessionMessage(res));
          handlers.add(handleRequest);
        },
      );
    },
    destroy: () => {
      handlers.forEach((handler) =>
        browser.runtime.onMessage.removeListener(handler),
      );
    },
  };
}

export function createSessionMessage(data) {
  return {
    [SESSION_MESSAGE_SYMBOL]: true,
    rpc: data,
  };
}

export function isSessionMessage(x) {
  if (!x || typeof x !== "object") return false;
  return SESSION_MESSAGE_SYMBOL in x;
}
