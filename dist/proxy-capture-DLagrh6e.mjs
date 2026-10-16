import { r as __exportAll } from "./rolldown-runtime-Dr7-SnC6.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { i as resolveEffectiveDebugProxyUrl, n as createDebugProxyWebSocketAgent, r as resolveDebugProxySettings } from "./env-BULAE3Xo.mjs";
import { _ as acquireDebugProxyCaptureStoreAsync, a as initializeDebugProxyCapture, c as finalizeDebugProxyCapture, g as getDebugProxyCaptureStore, h as closeDebugProxyCaptureStore, i as captureWsEventAsync, l as finalizeDebugProxyCaptureAsync, m as acquireDebugProxyCaptureStore, n as captureHttpExchangeAsync, o as initializeDebugProxyCaptureAsync, p as DebugProxyCaptureStore, r as captureWsEvent, t as captureHttpExchange, u as isDebugProxyGlobalFetchPatchInstalled } from "./runtime-tVgBJytW.mjs";
import { r as createDebugProxyCaptureReader } from "./store.kernel-CNZ9yqI0.mjs";
//#region src/proxy-capture/store-readonly.async.ts
/** Capture the read target without opening or creating its database. */
function createDebugProxyCaptureReaderAsync(params) {
	const context = captureOpenClawStateWorkerContext({ env: params.env });
	return {
		async getSessionEvents(sessionId, limit) {
			const result = await executeExistingOpenClawStateRead({
				env: context.environment,
				path: context.admission.databasePath
			}, {
				type: "capture.readOnlyEvents",
				sessionId,
				limit
			}, { context });
			context.admission.assertCurrent();
			if (result && (!result.ok || result.type !== "capture.readOnlyEvents")) throw new Error("Unexpected capture events read result");
			return result?.events ?? [];
		},
		async readBlob(blobId) {
			const result = await executeExistingOpenClawStateRead({
				env: context.environment,
				path: context.admission.databasePath
			}, {
				type: "capture.readOnlyBlob",
				blobId
			}, { context });
			context.admission.assertCurrent();
			if (result && (!result.ok || result.type !== "capture.readOnlyBlob")) throw new Error("Unexpected capture blob read result");
			return result?.blob ?? null;
		}
	};
}
//#endregion
//#region src/plugin-sdk/proxy-capture.ts
var proxy_capture_exports = /* @__PURE__ */ __exportAll({
	DebugProxyCaptureStore: () => DebugProxyCaptureStore,
	acquireDebugProxyCaptureStore: () => acquireDebugProxyCaptureStore,
	acquireDebugProxyCaptureStoreAsync: () => acquireDebugProxyCaptureStoreAsync,
	captureHttpExchange: () => captureHttpExchange,
	captureHttpExchangeAsync: () => captureHttpExchangeAsync,
	captureWsEvent: () => captureWsEvent,
	captureWsEventAsync: () => captureWsEventAsync,
	closeDebugProxyCaptureStore: () => closeDebugProxyCaptureStore,
	createDebugProxyCaptureReader: () => createDebugProxyCaptureReader,
	createDebugProxyCaptureReaderAsync: () => createDebugProxyCaptureReaderAsync,
	createDebugProxyWebSocketAgent: () => createDebugProxyWebSocketAgent,
	finalizeDebugProxyCapture: () => finalizeDebugProxyCapture,
	finalizeDebugProxyCaptureAsync: () => finalizeDebugProxyCaptureAsync,
	getDebugProxyCaptureStore: () => getDebugProxyCaptureStore,
	initializeDebugProxyCapture: () => initializeDebugProxyCapture,
	initializeDebugProxyCaptureAsync: () => initializeDebugProxyCaptureAsync,
	isDebugProxyGlobalFetchPatchInstalled: () => isDebugProxyGlobalFetchPatchInstalled,
	resolveDebugProxySettings: () => resolveDebugProxySettings,
	resolveEffectiveDebugProxyUrl: () => resolveEffectiveDebugProxyUrl
});
//#endregion
export { createDebugProxyCaptureReaderAsync as n, proxy_capture_exports as t };
