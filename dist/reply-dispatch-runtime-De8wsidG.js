import "./chunk-ulm_3glE.js";
import "./conversation-label-generator-BQSGncKD.js";
//#region src/plugin-sdk/reply-dispatch-runtime.ts
let providerDispatcherRuntimeModulePromise = null;
const loadProviderDispatcherRuntimeModule = async () => {
	providerDispatcherRuntimeModulePromise ??= import("./provider-dispatcher.runtime.js");
	return await providerDispatcherRuntimeModulePromise;
};
/** Dispatches a reply with buffered block support after lazy-loading the runtime dispatcher. */
const dispatchReplyWithBufferedBlockDispatcher = async (params) => {
	const { dispatchReplyWithBufferedBlockDispatcher: dispatch } = await loadProviderDispatcherRuntimeModule();
	return await dispatch(params);
};
/** Dispatches a reply through the provider dispatcher after lazy-loading runtime code. */
const dispatchReplyWithDispatcher = async (params) => {
	const { dispatchReplyWithDispatcher: dispatch } = await loadProviderDispatcherRuntimeModule();
	return await dispatch(params);
};
//#endregion
export { dispatchReplyWithDispatcher as n, dispatchReplyWithBufferedBlockDispatcher as t };
