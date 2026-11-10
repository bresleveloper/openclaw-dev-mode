import { n as createLazyPromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { n as createLazyRuntimeMethodBinder } from "./lazy-runtime-CJrzFzqU.mjs";
import "./inbound-context-DnPzLOsP.mjs";
import "./chunk-qrwWkfC7.mjs";
import { t as publicChannelTurn } from "./reply-options-vskFqRCa.mjs";
import "./conversation-label-generator-DiWCK6Mo.mjs";
//#region src/plugin-sdk/reply-dispatch-runtime.ts
const loadProviderDispatcherRuntimeModule = createLazyPromise(() => import("./provider-dispatcher.runtime.js"), { cacheRejections: true });
const bindProviderDispatcher = createLazyRuntimeMethodBinder(loadProviderDispatcherRuntimeModule);
const dispatchBuffered = bindProviderDispatcher((runtime) => runtime.dispatchReplyWithBufferedBlockDispatcherCore);
const dispatch = bindProviderDispatcher((runtime) => runtime.dispatchReplyWithDispatcherCore);
/** Dispatches a reply with buffered block support after lazy-loading the runtime dispatcher. */
const dispatchReplyWithBufferedBlockDispatcher = (params) => dispatchBuffered(publicChannelTurn(params));
/** Dispatches a reply through the provider dispatcher after lazy-loading runtime code. */
const dispatchReplyWithDispatcher = (params) => dispatch(publicChannelTurn(params));
//#endregion
export { dispatchReplyWithDispatcher as n, dispatchReplyWithBufferedBlockDispatcher as t };
