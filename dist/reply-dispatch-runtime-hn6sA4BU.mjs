import { n as createLazyPromise } from "./lazy-promise-DGqyc4Y4.mjs";
import "./inbound-context-BLR5MPPS.mjs";
import "./chunk-D0NagiTt.mjs";
import "./conversation-label-generator-DhwTyvv6.mjs";
//#region src/plugin-sdk/reply-dispatch-runtime.ts
const loadProviderDispatcherRuntimeModule = createLazyPromise(() => import("./provider-dispatcher.runtime.js"), { cacheRejections: true });
/** Dispatches a reply with buffered block support after lazy-loading the runtime dispatcher. */
const dispatchReplyWithBufferedBlockDispatcher = async (params) => {
	const { dispatchReplyWithBufferedBlockDispatcherCore: dispatch } = await loadProviderDispatcherRuntimeModule();
	return await dispatch(params);
};
/** Dispatches a reply through the provider dispatcher after lazy-loading runtime code. */
const dispatchReplyWithDispatcher = async (params) => {
	const { dispatchReplyWithDispatcherCore: dispatch } = await loadProviderDispatcherRuntimeModule();
	return await dispatch(params);
};
//#endregion
export { dispatchReplyWithDispatcher as n, dispatchReplyWithBufferedBlockDispatcher as t };
