import { i as getSqliteWorkerStateContext } from "./sqlite-worker-state-context-QuvwmAax.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { n as persistEventPayload, t as DebugProxyCaptureKernel } from "./store.kernel-CAvEIXov.mjs";
//#region src/proxy-capture/store.worker.ts
function executeCaptureCommand(command, database) {
	const kernel = new DebugProxyCaptureKernel({
		db: database.db,
		dbPath: database.path,
		blobDir: database.path,
		runWrite: (operation) => runOpenClawStateWriteTransaction(operation, {
			database,
			env: getSqliteWorkerStateContext().environment
		})
	});
	switch (command.type) {
		case "capture.upsertSession": return kernel.upsertSession(command.input);
		case "capture.endSession": return kernel.endSession(command.input.sessionId, command.input.endedAt);
		case "capture.persistPayload": {
			const { path: _legacyPath, ...blob } = kernel.persistPayload(command.input.data, command.input.contentType);
			return blob;
		}
		case "capture.recordEvent": return kernel.recordEvent(command.input);
		case "capture.recordEventWithPayload": {
			const payload = persistEventPayload(kernel, command.input.payload);
			return kernel.recordEvent({
				...command.input.event,
				...payload
			});
		}
		case "capture.listSessions": return kernel.listSessions(command.input.limit);
		case "capture.getSessionEvents": return kernel.getSessionEvents(command.input.sessionId, command.input.limit);
		case "capture.summarizeSessionCoverage": return kernel.summarizeSessionCoverage(command.input.sessionId);
		case "capture.readBlob": return kernel.readBlob(command.input.blobId);
		case "capture.queryPreset": return kernel.queryPreset(command.input.preset, command.input.sessionId);
		case "capture.deleteSessions": return kernel.deleteSessions(command.input.sessionIds);
		case "capture.purgeAll": return kernel.purgeAll();
	}
}
//#endregion
export { executeCaptureCommand };
