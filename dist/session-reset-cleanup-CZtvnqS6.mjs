import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { M as parseAgentSessionKey, c as normalizeOptionalAgentId, r as agentSessionKeysMatchByRequestKey } from "./session-key-C09ow4h0.mjs";
import { c as resolveSystemEventQueueKey } from "./system-event-ownership-BkQcgSZJ.mjs";
import { l as peekSystemEventEntries, t as consumeSelectedSystemEventEntries } from "./system-events-BD0JkU8V.mjs";
import { o as loadExactSessionEntryReadOnly } from "./session-accessor.sqlite-exact-read-JW6IveXD.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import { P as resolveReplyRunForCurrentSessionId } from "./reply-run-registry.state-DhKeZ1Xr.mjs";
import { i as clearReplyRunForResetBySessionId } from "./reply-run-registry.registry-CVpYrkbm.mjs";
import "./reply-run-registry-CHTPEb3-.mjs";
import { n as clearSessionLifecycleQueues } from "./cleanup-BrSuoAYi.mjs";
import { n as killSessionSubagentRuns } from "./subagent-control-kill-DcgU-e2d.mjs";
import { n as clearEmbeddedSessionPromptStates } from "./session-prompt-state-DQdMeWc6.mjs";
//#region src/auto-reply/reply/session-reset-cleanup.ts
var SessionResetCleanupError = class extends Error {};
/** Bind runtime cleanup to the parent incarnation accepted before asynchronous work. */
function createSessionResetCleanupGuard(params) {
	const sessionId = params.expectedSession?.sessionId;
	const lifecycleRevision = params.expectedSession?.lifecycleRevision;
	return () => {
		params.assertCurrent?.();
		const current = loadExactSessionEntryReadOnly({
			storePath: params.storePath,
			sessionKey: params.sessionKey,
			clone: false
		})?.entry;
		if (current?.sessionId !== sessionId || current?.lifecycleRevision !== lifecycleRevision) throw new SessionResetCleanupError("Reset did not complete because the session changed before cleanup. Retry /reset.");
	};
}
/** Reset must report unfinished child cleanup before committing a fresh conversation. */
async function stopSessionResetSubagents(params) {
	try {
		params.assertCurrent();
		const result = await killSessionSubagentRuns(params);
		params.assertCurrent();
		if (result.status === "error") throw new Error(result.error);
	} catch (cause) {
		if (cause instanceof SessionResetCleanupError) throw cause;
		throw new SessionResetCleanupError("Reset did not complete because some subagent tasks could not be stopped. Inspect the remaining tasks and retry /reset.", { cause });
	}
}
function clearCommittedSessionResetRuntimeState(params) {
	if (!params.previousSessionEntry) return;
	try {
		clearSessionResetRuntimeState([params.sessionKey, params.previousSessionEntry.sessionId], {
			activeReplySessionId: params.previousSessionEntry.sessionId,
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			assertCurrent: () => params.signal?.throwIfAborted()
		});
	} catch (error) {
		params.onError(error);
	}
}
/** Clears queued follow-ups and pending system events visible to the resetting agent. */
function clearSessionResetRuntimeState(keys, opts) {
	opts.assertCurrent();
	clearEmbeddedSessionPromptStates([opts.activeReplySessionId]);
	const cleared = clearSessionLifecycleQueues({
		keys,
		agentId: opts.agentId,
		sessionKey: opts.sessionKey,
		sessionId: opts.activeReplySessionId,
		assertCurrent: opts.assertCurrent
	});
	let systemEventsCleared = 0;
	for (const key of cleared.keys) {
		opts.assertCurrent();
		const owner = parseAgentSessionKey(key)?.agentId;
		if (owner && owner !== normalizeAgentId(opts.agentId)) continue;
		const queueKey = resolveSystemEventQueueKey(key, opts.agentId);
		const removed = consumeSelectedSystemEventEntries(queueKey, peekSystemEventEntries(queueKey));
		systemEventsCleared += removed.length;
	}
	if (opts.activeReplySessionId) {
		opts.assertCurrent();
		const operation = resolveReplyRunForCurrentSessionId(opts.activeReplySessionId);
		const ownerAgentId = normalizeOptionalAgentId(operation?.agentId) ?? parseAgentSessionKey(operation?.key)?.agentId;
		if (operation && ownerAgentId === normalizeAgentId(opts.agentId) && operation.sessionId === opts.activeReplySessionId && cleared.keys.some((key) => key !== opts.activeReplySessionId && agentSessionKeysMatchByRequestKey(operation.key, key))) clearReplyRunForResetBySessionId(opts.activeReplySessionId);
	}
	return {
		...cleared,
		systemEventsCleared
	};
}
//#endregion
export { stopSessionResetSubagents as a, createSessionResetCleanupGuard as i, clearCommittedSessionResetRuntimeState as n, clearSessionResetRuntimeState as r, SessionResetCleanupError as t };
