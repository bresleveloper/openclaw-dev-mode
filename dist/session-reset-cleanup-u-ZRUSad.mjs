import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { M as parseAgentSessionKey, c as normalizeOptionalAgentId, r as agentSessionKeysMatchByRequestKey } from "./session-key-CSDERtm3.mjs";
import { c as resolveSystemEventQueueKey } from "./system-event-ownership-DAgHWXZ1.mjs";
import { g as peekSystemEventEntries, r as consumeSelectedSystemEventEntries } from "./system-events-Bf4ozS7L.mjs";
import { A as projectSessionSharingEntry, _ as retainPreparedSessionGenerationFacts } from "./session-accessor.sqlite-entry-cache-publication-state-4Z0giEC3.mjs";
import { s as withSessionEntriesFromStoreInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { t as captureSessionEntryMetadataRead } from "./session-entry-source-authority-CY_NaTk4.mjs";
import { z as resolveReplyRunForCurrentSessionId } from "./reply-run-registry.state-Hn_UqZjq.mjs";
import { i as clearReplyRunForResetBySessionId } from "./reply-run-registry.registry-CmcnzV4X.mjs";
import "./reply-run-registry-BFUfTf-U.mjs";
import { n as killSessionSubagentRuns } from "./subagent-control-kill-ByoDJlho.mjs";
import { n as clearSessionLifecycleQueues } from "./cleanup-CjvcBZOl.mjs";
import { n as clearEmbeddedSessionPromptStates } from "./session-prompt-state-tij27tsD.mjs";
import { t as clearEmbeddedSessionForkSnapshot } from "./session-fork-11GSQ2uI.mjs";
import { t as clearPreparedEmbeddedAgentSettings } from "./agent-project-settings-BRSKWrAu.mjs";
//#region src/auto-reply/reply/session-reset-cleanup.ts
var SessionResetCleanupError = class extends Error {};
/** Prepare parent facts once; cleanup observes the entry writer's in-process receipts. */
async function prepareSessionResetCleanupGuard(params) {
	const memory = captureSessionEntryMetadataRead(params, () => {});
	const assertEntry = (current) => {
		params.assertCurrent?.();
		if (current?.sessionId !== params.expectedSession?.sessionId || current?.lifecycleRevision !== params.expectedSession?.lifecycleRevision) throw new SessionResetCleanupError("Reset did not complete because the session changed before cleanup. Retry /reset.");
	};
	if (memory) return {
		assertCurrent: () => assertEntry(memory.readCurrent()),
		release() {}
	};
	return withSessionEntriesFromStoreInWorker({
		agentId: params.agentId,
		storePath: params.storePath,
		sessionKeys: [params.sessionKey],
		snapshotFields: []
	}, async ({ result }) => {
		const entry = result.entries.find((row) => row.sessionKey === params.sessionKey)?.entry;
		assertEntry(entry);
		const identity = result.databaseIdentity?.identity;
		if (!identity) return {
			assertCurrent: () => params.assertCurrent?.(),
			release() {}
		};
		const retained = retainPreparedSessionGenerationFacts({
			databaseIdentity: `file:${identity}`,
			sessionKey: params.sessionKey,
			entry: entry ? projectSessionSharingEntry(entry) : void 0
		});
		return {
			assertCurrent: () => {
				const current = retained.readCurrent();
				if (current === void 0) throw new SessionResetCleanupError("Reset did not complete because the session changed before cleanup. Retry /reset.");
				assertEntry(current);
			},
			release: retained.release
		};
	});
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
	clearPreparedEmbeddedAgentSettings([opts.activeReplySessionId]);
	if (opts.activeReplySessionId) clearEmbeddedSessionForkSnapshot(opts.activeReplySessionId);
	const cleared = clearSessionLifecycleQueues({
		keys,
		agentId: opts.agentId,
		sessionKey: opts.sessionKey,
		sessionId: opts.activeReplySessionId,
		assertCurrent: opts.assertCurrent
	});
	for (const key of cleared.keys) {
		opts.assertCurrent();
		const owner = parseAgentSessionKey(key)?.agentId;
		if (owner && owner !== normalizeAgentId(opts.agentId)) continue;
		const queueKey = resolveSystemEventQueueKey(key, opts.agentId);
		consumeSelectedSystemEventEntries(queueKey, peekSystemEventEntries(queueKey));
	}
	if (opts.activeReplySessionId) {
		opts.assertCurrent();
		const operation = resolveReplyRunForCurrentSessionId(opts.activeReplySessionId);
		const ownerAgentId = normalizeOptionalAgentId(operation?.agentId) ?? parseAgentSessionKey(operation?.key)?.agentId;
		if (operation && ownerAgentId === normalizeAgentId(opts.agentId) && operation.sessionId === opts.activeReplySessionId && cleared.keys.some((key) => key !== opts.activeReplySessionId && agentSessionKeysMatchByRequestKey(operation.key, key))) clearReplyRunForResetBySessionId(opts.activeReplySessionId);
	}
}
//#endregion
export { stopSessionResetSubagents as a, prepareSessionResetCleanupGuard as i, clearCommittedSessionResetRuntimeState as n, clearSessionResetRuntimeState as r, SessionResetCleanupError as t };
