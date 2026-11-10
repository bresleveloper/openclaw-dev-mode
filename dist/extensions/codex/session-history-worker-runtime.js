import { codexHistoryWorkerEntrypoint } from "./session-history-worker-entrypoint.js";
import { n as codexHistoryRejectionReason } from "./.setup/history-rejection-B4nOXNXF.mjs";
import { t as consumeCodexHistory } from "./.setup/session-history-read-BI_2jRED.mjs";
import { n as resolveCodexHistoryTarget } from "./.setup/session-history-7W0cgTXF.mjs";
import { t as projectVerifiedSettledCodexMessages } from "./.setup/settled-turn-evidence-B5Ew3UUB.mjs";
import { WorkerTaskPool, resolveRuntimeWorkerArgv, resolveRuntimeWorkerUrl } from "openclaw/plugin-sdk/process-runtime";
import { fileURLToPath } from "node:url";
import { SessionTranscriptReadFenceError, captureCodexSessionContextReader, readCodexSessionContextProjection } from "openclaw/plugin-sdk/codex-session-transcript-runtime";
//#region extensions/codex/session-history-worker-runtime.ts
const sourceWorkerUrl = resolveRuntimeWorkerUrl(codexHistoryWorkerEntrypoint);
const sourceNeedsBuiltFallback = /\.[cm]?ts$/u.test(sourceWorkerUrl.pathname) && (typeof process.versions.bun === "string" || resolveRuntimeWorkerArgv(sourceWorkerUrl).length === 1);
const historyReads = new WorkerTaskPool({
	workerUrl: sourceNeedsBuiltFallback ? resolveRuntimeWorkerUrl({
		...codexHistoryWorkerEntrypoint,
		root: fileURLToPath(new URL("../..", import.meta.url))
	}) : sourceWorkerUrl,
	workerClass: "reader"
});
async function projectCodexSettledHistoryInWorker(target, signal, contextReader) {
	signal?.throwIfAborted();
	const resolved = await resolveCodexHistoryTarget(target);
	const reader = contextReader ?? (resolved.kind === "sqlite" ? captureCodexSessionContextReader({
		...target.sessionTarget,
		...resolved.target
	}, signal) : void 0);
	if (reader) {
		if (resolved.kind !== "sqlite") throw new Error("Actor history requires a complete matching sessionTarget");
		let result;
		try {
			result = await reader(resolved.target, (messages, header) => {
				signal?.throwIfAborted();
				try {
					return {
						status: "ok",
						value: consumeCodexHistory(messages, header, target.sessionId, (history) => projectVerifiedSettledCodexMessages(history, target))
					};
				} catch (error) {
					return {
						status: "rejected",
						reason: codexHistoryRejectionReason(error)
					};
				}
			});
		} catch (error) {
			if (error instanceof SessionTranscriptReadFenceError) result = {
				status: "rejected",
				reason: "snapshot_invalidated"
			};
			else throw error;
		}
		signal?.throwIfAborted();
		return result;
	}
	const evidence = {
		mirroredMessages: target.mirroredMessages,
		settledMessages: target.settledMessages,
		turnId: target.turnId,
		...target.promptIdentity ? { promptIdentity: target.promptIdentity } : {},
		...target.promptSuppressed ? { promptSuppressed: true } : {}
	};
	if (resolved.kind === "sqlite") try {
		return await readCodexSessionContextProjection(resolved.target, async ({ target: captured, admission, physicalSource }) => {
			const input = {
				target: {
					kind: "sqlite",
					target: captured
				},
				sessionId: target.sessionId,
				admission,
				physicalSource,
				evidence
			};
			const result = await historyReads.run(input, {
				timeoutMs: 6e4,
				signal
			});
			return {
				value: result.result,
				version: result.version
			};
		}, signal);
	} catch (error) {
		signal?.throwIfAborted();
		return {
			status: "rejected",
			reason: error instanceof SessionTranscriptReadFenceError ? "snapshot_invalidated" : codexHistoryRejectionReason(error)
		};
	}
	const input = {
		target: resolved,
		sessionId: target.sessionId,
		evidence
	};
	const result = await historyReads.run(input, {
		timeoutMs: 6e4,
		signal
	});
	signal?.throwIfAborted();
	return result.result;
}
//#endregion
export { projectCodexSettledHistoryInWorker };
