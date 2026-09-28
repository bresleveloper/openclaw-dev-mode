import { n as codexHistoryRejectionReason } from "./.setup/history-rejection-B4nOXNXF.mjs";
import { t as runCodexHistoryWorkerInput } from "./.setup/session-history.worker-CaCh0xF_.mjs";
import { n as resolveCodexHistoryTarget } from "./.setup/session-history-BrqhSCf9.mjs";
import { WorkerTaskPool, resolveRuntimeWorkerArgv, resolveRuntimeWorkerUrl } from "openclaw/plugin-sdk/process-runtime";
import { isIncognitoSessionKey } from "openclaw/plugin-sdk/session-key-runtime";
import { fileURLToPath } from "node:url";
import { SessionTranscriptReadFenceError, captureCodexSessionTranscriptReadAdmission, validateCodexSessionTranscriptContextVersion, validateCodexSessionTranscriptReadAdmission } from "openclaw/plugin-sdk/codex-session-transcript-runtime";
//#region extensions/codex/session-history-worker-runtime.ts
const codexHistoryWorkerEntrypoint = {
	currentModuleUrl: import.meta.url,
	sourceWorkerName: "session-history.worker",
	distWorkerPath: "extensions/codex/session-history.worker.js",
	package: {
		name: "@openclaw/codex",
		distWorkerPath: "session-history.worker.js"
	}
};
function resolveCodexHistoryWorkerUrl() {
	const sourceUrl = resolveRuntimeWorkerUrl(codexHistoryWorkerEntrypoint);
	if (!(/\.[cm]?ts$/u.test(sourceUrl.pathname) && (typeof process.versions.bun === "string" || resolveRuntimeWorkerArgv(sourceUrl).length === 1))) return sourceUrl;
	return resolveRuntimeWorkerUrl({
		...codexHistoryWorkerEntrypoint,
		root: fileURLToPath(new URL("../..", import.meta.url))
	});
}
const historyReads = new WorkerTaskPool({
	workerUrl: resolveCodexHistoryWorkerUrl(),
	maxWorkers: 1
});
async function projectCodexSettledHistoryInWorker(target, signal) {
	signal?.throwIfAborted();
	const resolved = resolveCodexHistoryTarget(target);
	const receipt = resolved.kind === "sqlite" ? captureCodexSessionTranscriptReadAdmission(resolved.target) : void 0;
	const input = {
		target: resolved,
		sessionId: target.sessionId,
		...receipt ? { admission: { ...receipt } } : {},
		evidence: {
			mirroredMessages: target.mirroredMessages,
			settledMessages: target.settledMessages,
			turnId: target.turnId
		}
	};
	const result = resolved.kind === "sqlite" && isIncognitoSessionKey(resolved.target.sessionKey) ? await runCodexHistoryWorkerInput(input) : await historyReads.run(input, {
		timeoutMs: 6e4,
		signal
	});
	signal?.throwIfAborted();
	if (resolved.kind === "sqlite") try {
		if (input.admission) validateCodexSessionTranscriptReadAdmission(resolved.target, input.admission);
		else validateCodexSessionTranscriptContextVersion(resolved.target, result.version);
	} catch (error) {
		return {
			status: "rejected",
			reason: error instanceof SessionTranscriptReadFenceError ? "snapshot_invalidated" : codexHistoryRejectionReason(error)
		};
	}
	return result.result;
}
//#endregion
export { projectCodexSettledHistoryInWorker };
