import { c as containerRpcRequest, i as streamSignalEvents$1, l as streamContainerEvents, n as signalCheck$1, r as signalRpcRequest$1, s as containerCheck } from "./client-AXcDteBZ.mjs";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
//#region extensions/signal/src/client-adapter.ts
const DEFAULT_TIMEOUT_MS = 1e4;
async function signalRpcRequest(method, params, opts) {
	return opts.transportKind === "container" ? containerRpcRequest(method, params, opts) : signalRpcRequest$1(method, params, opts);
}
async function signalCheck(baseUrl, timeoutMs = DEFAULT_TIMEOUT_MS, options = {}) {
	try {
		return options.transportKind === "container" ? await containerCheck(baseUrl, timeoutMs, options.account) : await signalCheck$1(baseUrl, timeoutMs);
	} catch (error) {
		return {
			ok: false,
			status: null,
			error: formatErrorMessage(error)
		};
	}
}
async function streamSignalEvents(params) {
	if (params.transportKind === "container") return streamContainerEvents({
		...params,
		onEvent: (event) => params.onEvent({
			event: "receive",
			data: JSON.stringify(event)
		})
	});
	return streamSignalEvents$1(params);
}
//#endregion
export { signalRpcRequest as n, streamSignalEvents as r, signalCheck as t };
