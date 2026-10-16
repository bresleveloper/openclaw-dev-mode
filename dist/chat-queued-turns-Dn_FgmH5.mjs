import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { p as normalizeTrimmedStringList } from "./string-normalization-CECOqf64.mjs";
import { o as createAgentRunRestartAbortError, p as resolveAgentRunAbortLifecycleFields } from "./run-termination-DGv2EKii.mjs";
import { t as chatRunBelongsToAgent } from "./chat-run-owner-Ci8Mz1ow.mjs";
//#region src/gateway/chat-abort-diagnostics.ts
/** Diagnostics retain owner facts without copying arbitrary abort error text. */
function resolveChatAbortDiagnosticReason(signal, entry) {
	if (entry?.abortDiagnosticReason) return entry.abortDiagnosticReason;
	switch (entry?.abortStopReason) {
		case "rpc":
		case "stop":
		case "timeout":
		case "restart":
		case "archive":
		case "delete": return entry.abortStopReason;
		default: return resolveAgentRunAbortLifecycleFields(signal).stopReason ?? "aborted";
	}
}
//#endregion
//#region src/gateway/chat-queued-turns.ts
/**
* Gateway-owned cancel identity for turns that have been admitted to the
* followup/collect queue but are not yet (or no longer) active chat-send runs.
*
* Active runs stay in chatAbortControllers. Queued waits must NOT look like
* active runs (projection, timeout ownership, terminal dedupe), but they must
* remain abortable by authorized requesters after chat.send terminalizes.
*/
function isQueuedChatTurnForSession(turns, runId, scope) {
	const queued = turns?.get(runId);
	return Boolean(queued && queued.sessionId === scope.sessionId && queued.sessionKey === scope.sessionKey && queued.agentId === scope.agentId && queued.abortable !== false && !queued.controller.signal.aborted);
}
function createQueuedChatAbortSignalReason(stopReason) {
	if (stopReason === "restart") return createAgentRunRestartAbortError();
	return stopReason ? /* @__PURE__ */ new Error(`queued turn aborted: ${stopReason}`) : void 0;
}
function detachQueuedChatTurnAbortListener(entry) {
	if (entry.abortListener) {
		entry.controller.signal.removeEventListener("abort", entry.abortListener);
		entry.abortListener = void 0;
	}
}
function deleteQueuedChatTurnEntry(chatQueuedTurns, runId, entry) {
	if (chatQueuedTurns.get(runId) !== entry) return false;
	detachQueuedChatTurnAbortListener(entry);
	return chatQueuedTurns.delete(runId);
}
function registerQueuedChatTurn(params) {
	const runId = params.runId;
	const sessionKey = normalizeOptionalString(params.sessionKey);
	if (!runId || !sessionKey) return false;
	if (params.controller.signal.aborted) return false;
	const existing = params.chatQueuedTurns.get(runId);
	if (existing && existing.controller === params.controller) return true;
	if (existing) return false;
	const entry = {
		controller: params.controller,
		sessionId: params.sessionId,
		sessionKey,
		agentId: normalizeOptionalString(params.agentId)?.toLowerCase(),
		ownerConnId: normalizeOptionalString(params.ownerConnId),
		ownerDeviceId: normalizeOptionalString(params.ownerDeviceId),
		...params.holdPendingInputWithdrawal ? { holdPendingInputWithdrawal: params.holdPendingInputWithdrawal } : {}
	};
	params.chatQueuedTurns.set(runId, entry);
	entry.abortListener = () => {
		if (entry.abortable !== false && params.chatQueuedTurns.get(runId) === entry) try {
			params.onAborted?.(resolveChatAbortDiagnosticReason(params.controller.signal, entry));
		} finally {
			deleteQueuedChatTurnEntry(params.chatQueuedTurns, runId, entry);
		}
	};
	params.controller.signal.addEventListener("abort", entry.abortListener, { once: true });
	return true;
}
function completeQueuedChatTurn(chatQueuedTurns, runId, controller) {
	if (!runId) return false;
	const entry = chatQueuedTurns.get(runId);
	return entry?.controller === controller ? deleteQueuedChatTurnEntry(chatQueuedTurns, runId, entry) : false;
}
/**
* Retain the live run identity for idempotency while transferring cancellation
* to a collect aggregate. Completion still removes the entry.
*/
function retireQueuedChatTurnCancellation(chatQueuedTurns, runId, controller) {
	const entry = runId ? chatQueuedTurns.get(runId) : void 0;
	if (!entry || entry.controller !== controller) return false;
	entry.abortable = false;
	detachQueuedChatTurnAbortListener(entry);
	return true;
}
/**
* Abort a single queued turn by runId. Does not authorize; caller must check.
* Returns false when missing or already aborted/removed.
*/
function abortQueuedChatTurnById(chatQueuedTurns, params) {
	const runId = params.runId;
	const sessionKey = normalizeOptionalString(params.sessionKey);
	if (!runId || !sessionKey) return { aborted: false };
	const entry = chatQueuedTurns.get(runId);
	if (!entry || entry.abortable === false) return { aborted: false };
	if (!params.allowSessionMismatch && entry.sessionKey !== sessionKey) return { aborted: false };
	if (!entry.controller.signal.aborted) {
		entry.abortDiagnosticReason = resolveChatAbortDiagnosticReason(entry.controller.signal, {
			abortDiagnosticReason: params.diagnosticReason,
			abortStopReason: params.stopReason
		});
		entry.controller.abort(createQueuedChatAbortSignalReason(params.stopReason));
	}
	deleteQueuedChatTurnEntry(chatQueuedTurns, runId, entry);
	return { aborted: true };
}
/**
* List queued turns matching session keys / session ids / optional agent scope.
* Authorization is left to the caller.
*/
function listQueuedChatTurnsForSession(params) {
	const sessionKeys = new Set(normalizeTrimmedStringList([...params.sessionKeys]));
	const sessionIds = new Set(normalizeTrimmedStringList([...params.sessionIds ?? []]));
	const agentId = normalizeOptionalString(params.agentId)?.toLowerCase();
	const defaultAgentId = normalizeOptionalString(params.defaultAgentId)?.toLowerCase();
	const matches = [];
	for (const [runId, entry] of params.chatQueuedTurns) {
		if (entry.abortable === false) continue;
		if (!sessionKeys.has(entry.sessionKey) && !sessionIds.has(entry.sessionId)) continue;
		if (params.requiredSessionId !== void 0 && (!sessionKeys.has(entry.sessionKey) || entry.sessionId !== params.requiredSessionId)) continue;
		if (agentId && !chatRunBelongsToAgent({
			agentId: entry.agentId,
			sessionKey: entry.sessionKey,
			defaultAgentId
		}, agentId)) continue;
		matches.push({
			runId,
			entry
		});
	}
	return matches;
}
/**
* Abort all provided queued turns (already authorized by caller).
* Order: abort signals first, then remove from map, so drain cannot promote mid-loop.
*/
function abortQueuedChatTurns(chatQueuedTurns, matches, stopReason) {
	const runIds = [];
	for (const { runId, entry } of matches) {
		if (chatQueuedTurns.get(runId) !== entry) continue;
		if (!entry.controller.signal.aborted) {
			entry.abortDiagnosticReason = resolveChatAbortDiagnosticReason(entry.controller.signal, { abortStopReason: stopReason });
			entry.controller.abort(createQueuedChatAbortSignalReason(stopReason));
		}
		deleteQueuedChatTurnEntry(chatQueuedTurns, runId, entry);
		runIds.push(runId);
	}
	return runIds;
}
//#endregion
export { listQueuedChatTurnsForSession as a, resolveChatAbortDiagnosticReason as c, isQueuedChatTurnForSession as i, abortQueuedChatTurns as n, registerQueuedChatTurn as o, completeQueuedChatTurn as r, retireQueuedChatTurnCancellation as s, abortQueuedChatTurnById as t };
