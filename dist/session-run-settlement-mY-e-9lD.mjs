import { o as racePromiseWithAbortSignal } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
import { t as settlesWithin } from "./settle-within-DLEx44ea.mjs";
import { h as getTerminalSessionWorkAdmissionRelease, t as SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS } from "./session-lifecycle-admission-BihxXo5j.mjs";
import { h as getAttachedBackend, v as hasCommittedReplyOperationOutcome } from "./reply-run-registry.state-Hn_UqZjq.mjs";
import { g as replyRunRegistry, x as waitForReplyOperationOwnerSettlement, y as resolveReplyOperationsForSession } from "./reply-run-registry.registry-CmcnzV4X.mjs";
import { t as chatRunBelongsToAgent } from "./chat-run-owner-BB6L4tWc.mjs";
import "./reply-run-registry-BFUfTf-U.mjs";
import { a as isCurrentChatAbortExecution, d as waitForChatAbortControllerRemoval } from "./chat-abort-lifecycle-internal-EU815r6Q.mjs";
//#region src/gateway/server-methods/session-run-settlement.ts
/** Join terminal writers before taking lifecycle locks; live turns retain the caller's idle gate. */
async function waitForTerminalSessionRunSettlement(params) {
	params.signal?.throwIfAborted();
	const sessionKeys = [params.requestedKey, params.canonicalKey];
	const admissions = getTerminalSessionWorkAdmissionRelease({
		scope: params.storePath,
		identities: [...sessionKeys, params.sessionId]
	});
	if (admissions === false) return false;
	const matchingRuns = [...params.context.chatAbortControllers].filter(([, entry]) => (sessionKeys.includes(entry.sessionKey.trim()) || entry.sessionId === params.sessionId) && chatRunBelongsToAgent({
		...entry,
		defaultAgentId: params.defaultAgentId
	}, params.agentId));
	const currentRunId = matchingRuns.find(([, entry]) => isCurrentChatAbortExecution(entry))?.[0];
	const terminalRuns = matchingRuns.filter(([, entry]) => entry.terminalOutcomeObserved || entry.projectSessionTerminalObservedAt !== void 0).map(([runId, entry]) => ({
		runId,
		entry
	}));
	const replies = resolveReplyOperationsForSession({
		...params,
		sessionKeys
	}).filter((operation) => currentRunId === void 0 || replyRunRegistry.getSourceTurnId(operation.key) !== currentRunId && getAttachedBackend(operation)?.runId !== currentRunId);
	if (matchingRuns.some(([runId, entry]) => runId !== currentRunId && !entry.terminalOutcomeObserved && entry.projectSessionTerminalObservedAt === void 0) || replies.some((operation) => operation.result === null && !hasCommittedReplyOperationOutcome(operation))) return false;
	const timeoutMs = SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS;
	return await racePromiseWithAbortSignal(Promise.all([
		settlesWithin(admissions, timeoutMs),
		waitForChatAbortControllerRemoval({
			entries: params.context.chatAbortControllers,
			targets: terminalRuns,
			timeoutMs
		}),
		...replies.map((operation) => waitForReplyOperationOwnerSettlement(operation, timeoutMs))
	]).then((results) => results.every(Boolean)), params.signal);
}
//#endregion
export { waitForTerminalSessionRunSettlement as t };
