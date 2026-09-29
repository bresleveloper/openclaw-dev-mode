import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { o as resolveSystemEventQueueKey } from "./system-event-ownership-CHVGbaAW.mjs";
import { l as peekSystemEventEntries, t as consumeSelectedSystemEventEntries } from "./system-events-ANKIkU0W.mjs";
import { a as loadExactSessionEntryReadOnly } from "./session-accessor.sqlite-exact-read-Dk6_8wqr.mjs";
import "./session-accessor-l-4ZHvKn.mjs";
import { i as clearReplyRunForResetBySessionId } from "./reply-run-registry.registry-QRh9NCRy.mjs";
import "./reply-run-registry-D1FEEbJ6.mjs";
import { n as killSessionSubagentRuns } from "./subagent-control-kill-BNSJbxki.mjs";
import { t as clearEmbeddedSessionPromptStates } from "./session-prompt-state-C1pwD4fu.mjs";
import { t as clearSessionQueues } from "./cleanup-CaqS6FX1.mjs";
//#region src/auto-reply/reply/session-reset-cleanup.ts
/** Clears reset-related queues and system events for session keys. */
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
/** Clears queued follow-ups and pending system events visible to the resetting agent. */
function clearSessionResetRuntimeState(keys, opts) {
	clearEmbeddedSessionPromptStates(keys);
	const cleared = clearSessionQueues(keys);
	let systemEventsCleared = 0;
	for (const key of cleared.keys) {
		const owner = parseAgentSessionKey(key)?.agentId;
		if (owner && owner !== normalizeAgentId(opts.agentId)) continue;
		const queueKey = resolveSystemEventQueueKey(key, opts.agentId);
		const removed = consumeSelectedSystemEventEntries(queueKey, peekSystemEventEntries(queueKey));
		systemEventsCleared += removed.length;
	}
	if (opts.activeReplySessionId) clearReplyRunForResetBySessionId(opts.activeReplySessionId);
	return {
		...cleared,
		systemEventsCleared
	};
}
//#endregion
export { stopSessionResetSubagents as i, clearSessionResetRuntimeState as n, createSessionResetCleanupGuard as r, SessionResetCleanupError as t };
