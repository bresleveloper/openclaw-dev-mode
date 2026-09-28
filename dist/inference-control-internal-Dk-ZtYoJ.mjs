//#region src/gateway/worker-environments/inference-control-internal.ts
var WorkerInferenceSessionDrainBusyError = class extends Error {
	constructor(sessionId) {
		super(`Worker inference drain already owns session ${sessionId}`);
	}
};
const sessionControlByService = /* @__PURE__ */ new WeakMap();
function registerWorkerInferenceSessionControl(service, control) {
	sessionControlByService.set(service, control);
}
function beginWorkerInferenceSessionDrain(service, sessionId) {
	if (typeof service !== "object" || service === null) return;
	return sessionControlByService.get(service)?.beginDrain(sessionId);
}
function captureWorkerInferenceCancellation(service, sessionId, runId) {
	if (typeof service !== "object" || service === null) return;
	return sessionControlByService.get(service)?.captureCancel(sessionId, runId);
}
//#endregion
export { registerWorkerInferenceSessionControl as i, beginWorkerInferenceSessionDrain as n, captureWorkerInferenceCancellation as r, WorkerInferenceSessionDrainBusyError as t };
