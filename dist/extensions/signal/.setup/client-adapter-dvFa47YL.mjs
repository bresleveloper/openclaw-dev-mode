import { c as streamContainerEvents, i as streamSignalEvents$1, n as signalCheck$1, o as containerCheck, r as signalRpcRequest$1, s as containerRpcRequest } from "./client-BseAt7F7.mjs";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
//#region extensions/signal/src/client-adapter.ts
/**
* Signal client adapter - unified interface for both native signal-cli and bbernhard container.
*
* This adapter provides a single API that routes to the concrete account transport.
* Exports mirror client.ts names so consumers
* only need to change their import path.
*/
const DEFAULT_TIMEOUT_MS = 1e4;
function usesContainer(kind) {
	return kind === "container";
}
/**
* Drop-in replacement for native signalRpcRequest.
* Routes to native JSON-RPC or container REST based on config.
*/
async function signalRpcRequest(method, params, opts) {
	return usesContainer(opts.transportKind) ? containerRpcRequest(method, params, opts) : signalRpcRequest$1(method, params, opts);
}
/**
* Drop-in replacement for native signalCheck.
*/
async function signalCheck(baseUrl, timeoutMs = DEFAULT_TIMEOUT_MS, options = {}) {
	try {
		return usesContainer(options.transportKind) ? await containerCheck(baseUrl, timeoutMs, options.account) : await signalCheck$1(baseUrl, timeoutMs);
	} catch (error) {
		return {
			ok: false,
			status: null,
			error: formatErrorMessage(error)
		};
	}
}
/**
* Drop-in replacement for native streamSignalEvents.
* Container mode uses WebSocket; native uses SSE.
*/
async function streamSignalEvents(params) {
	if (usesContainer(params.transportKind)) return streamContainerEvents({
		baseUrl: params.baseUrl,
		account: params.account,
		abortSignal: params.abortSignal,
		timeoutMs: params.timeoutMs,
		onEvent: (event) => params.onEvent({
			event: "receive",
			data: JSON.stringify(event)
		}),
		onStreamOpen: params.onStreamOpen,
		logger: params.logger
	});
	return streamSignalEvents$1({
		baseUrl: params.baseUrl,
		account: params.account,
		abortSignal: params.abortSignal,
		timeoutMs: params.timeoutMs,
		onEvent: (event) => params.onEvent(event),
		onStreamOpen: params.onStreamOpen
	});
}
//#endregion
export { signalRpcRequest as n, streamSignalEvents as r, signalCheck as t };
