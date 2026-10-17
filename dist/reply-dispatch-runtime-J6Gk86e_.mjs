import { n as createLazyPromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { n as createLazyRuntimeMethodBinder } from "./lazy-runtime-CJrzFzqU.mjs";
import "./inbound-context-jAt0CAb-.mjs";
import "./chunk-BenoswI3.mjs";
import "./conversation-label-generator-DXdAyC3X.mjs";
//#region src/plugin-sdk/reply-dispatch-runtime.ts
const loadProviderDispatcherRuntimeModule = createLazyPromise(() => import("./provider-dispatcher.runtime.js"), { cacheRejections: true });
const bindProviderDispatcher = createLazyRuntimeMethodBinder(loadProviderDispatcherRuntimeModule);
/** Dispatches a reply with buffered block support after lazy-loading the runtime dispatcher. */
const dispatchReplyWithBufferedBlockDispatcher = bindProviderDispatcher((runtime) => runtime.dispatchReplyWithBufferedBlockDispatcherCore);
/** Dispatches a reply through the provider dispatcher after lazy-loading runtime code. */
const dispatchReplyWithDispatcher = bindProviderDispatcher((runtime) => runtime.dispatchReplyWithDispatcherCore);
//#endregion
export { dispatchReplyWithDispatcher as n, dispatchReplyWithBufferedBlockDispatcher as t };
