import { o as racePromiseWithAbortSignal } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
//#region src/gateway/worker-environments/node-worker-abort.ts
function raceNodeWorkerOperation(operation, signal, messages = {
	aborted: "node worker operation aborted",
	failed: "node worker operation failed"
}) {
	if (!signal) return operation;
	const abortError = () => signal.reason instanceof Error ? signal.reason : new Error(messages.aborted);
	return racePromiseWithAbortSignal(operation, signal, abortError).catch((error) => {
		throw error instanceof Error ? error : new Error(messages.failed ?? String(error));
	});
}
//#endregion
export { raceNodeWorkerOperation as t };
