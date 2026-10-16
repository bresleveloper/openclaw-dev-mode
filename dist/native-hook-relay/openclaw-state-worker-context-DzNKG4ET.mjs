import "./redact-TLu2QTmL.mjs";
import "./openclaw-state-db.paths-D1QtF7Ci.mjs";
import "./openclaw-state-db-schema-migration-required-DtltEO1E.mjs";
import { b as captureOpenClawStateWorkerContextWithAdmission, n as captureOpenClawStateDatabaseReadAdmission, y as captureOpenClawStateReadWorkerContextWithAdmission } from "./openclaw-state-db-cache-BjVpQwyn.mjs";
import "./sqlite-readonly-location-cleanup-CmRNKiuM.mjs";
import "node:path";
import "node:async_hooks";
//#region src/state/openclaw-state-worker-context.ts
/** Read-only workers need resolved runtime facts, not the initialization environment. */
function captureOpenClawStateReadWorkerContext(options = {}) {
	return captureOpenClawStateReadWorkerContextWithAdmission(options, captureOpenClawStateDatabaseReadAdmission);
}
function captureOpenClawStateWorkerContext(options = {}) {
	return captureOpenClawStateWorkerContextWithAdmission(options, captureOpenClawStateDatabaseReadAdmission);
}
//#endregion
export { captureOpenClawStateWorkerContext as n, captureOpenClawStateReadWorkerContext as t };
