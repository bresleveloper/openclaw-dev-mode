import "./redact-tYkqLD33.mjs";
import "./sqlite-snapshot-staging-owner-ctWsxzq7.mjs";
import "./sqlite-worker-identity-BvirgyPs.mjs";
import "./openclaw-state-db.paths-DGDQTHyE.mjs";
import { D as captureOpenClawStateWorkerContextWithAdmission, E as captureOpenClawStateReadWorkerContextWithAdmission, r as captureOpenClawStateDatabaseReadAdmission } from "./openclaw-state-db-cache-CRSDAqPM.mjs";
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
