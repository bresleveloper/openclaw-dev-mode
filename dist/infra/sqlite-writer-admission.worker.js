import { c as isRecord } from "../record-coerce-TIsquoVR.mjs";
import { i as readAgentDatabaseExecutionAuthority, n as readSqliteWorkerRequestCustody } from "../sqlite-worker-request-custody-Bj59t02j.mjs";
import { t as readProfileAuthority } from "../user-profile-authority-BGrgUb8e.mjs";
import { n as serveWorkerTasks } from "../worker-task-server-sMsYUF1K.mjs";
import { MessagePort, workerData } from "node:worker_threads";
//#region src/infra/sqlite-writer-admission.worker.ts
function isSharedCell(value) {
	return value instanceof Int32Array && value.buffer instanceof SharedArrayBuffer && value.length === 1;
}
function isBrokerRequest(value) {
	return isRecord(value) && isSharedCell(value.decision) && isRecord(value.custody) && isSharedCell(value.custody.slot) && isSharedCell(value.custody.request) && (value.executionAuthority === void 0 || isRecord(value.executionAuthority) && isSharedCell(value.executionAuthority.logical) && isSharedCell(value.executionAuthority.native) && typeof value.executionAuthority.physicalIdentity === "string" && typeof value.executionAuthority.incarnation === "string" && (value.executionAuthority.birthtime === void 0 || typeof value.executionAuthority.birthtime === "string"));
}
function isProfileAuthority(value) {
	return isRecord(value) && value.generation instanceof SharedArrayBuffer && value.generation.byteLength === 2 * Int32Array.BYTES_PER_ELEMENT && isRecord(value.lifetime) && value.lifetime.revision instanceof SharedArrayBuffer && value.lifetime.revision.byteLength === BigInt64Array.BYTES_PER_ELEMENT && typeof value.lifetime.epoch === "bigint" && Array.isArray(value.entries) && value.entries.every((entry) => isRecord(entry) && entry.state instanceof SharedArrayBuffer && entry.state.byteLength === 2 * Int32Array.BYTES_PER_ELEMENT && (entry.revision === void 0 || Number.isInteger(entry.revision)));
}
serveWorkerTasks((input) => {
	if (isRecord(input) && input.kind === "connect" && input.port instanceof MessagePort) {
		if (!isRecord(workerData) || !isSharedCell(workerData.admissionLifetime)) throw new Error("SQLite admission service requires its owner lifetime");
		const lifetime = workerData.admissionLifetime;
		const port = input.port;
		port.on("message", (request) => {
			if (!isBrokerRequest(request)) {
				port.close();
				return;
			}
			const current = Atomics.load(lifetime, 0) === 1 && readSqliteWorkerRequestCustody(request.custody) && (!request.executionAuthority || readAgentDatabaseExecutionAuthority(request.executionAuthority));
			Atomics.compareExchange(request.decision, 0, 0, current ? 1 : 2);
			Atomics.notify(request.decision, 0);
		});
		return {
			kind: "connected",
			lifetime
		};
	}
	if (!isRecord(input) || input.kind !== "assert-bound-revision" && input.kind !== "read-current-settled-facts" || !isProfileAuthority(input.authority) || input.authority.entries.some((entry) => input.kind === "assert-bound-revision" ? entry.revision === void 0 : entry.revision !== void 0)) throw new Error("SQLite admission requires a typed profile authority descriptor");
	return readProfileAuthority(input.authority);
});
//#endregion
export {};
