import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import "./env-ZuG6CRvK.mjs";
import "./runtime-owner-DCTetk64.mjs";
import "./store.kernel-CAvEIXov.mjs";
import "./runtime-BZkWDI2h.mjs";
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
export { createDebugProxyCaptureReaderAsync as t };
