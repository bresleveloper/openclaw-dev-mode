import { r as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-C2YxM4Tj.mjs";
import "./openclaw-agent-db-CaQAStOA.mjs";
import { n as buildSessionCreationStamp } from "./session-entry-provenance-C-JyMH54.mjs";
import { n as resolveInternalSessionEffectsIdentity } from "./internal-session-key-Xwd1VHk2.mjs";
import { t as loadExactSessionEntry } from "./session-accessor.sqlite-exact-read-Dk6_8wqr.mjs";
import "./session-accessor-C05KQ5A3.mjs";
import { a as createSessionEntryWithTranscript, o as forkSessionFromParentTranscript, v as applySessionEntryLifecycleMutation } from "./session-accessor.reset-b9w8ccQ2.mjs";
//#region src/agents/internal-session-effects.ts
/** Manages hidden SQLite sessions used for suppressed agent side effects. */
/** Resolves the deterministic SQLite target owned by one internal-effects run. */
function resolveInternalSessionEffectsTarget(params) {
	const incognito = isIncognitoOpenClawAgentSqlitePath(params.storePath, { agentId: params.agentId });
	return {
		agentId: params.agentId,
		storePath: params.storePath,
		...resolveInternalSessionEffectsIdentity({
			agentId: params.agentId,
			runId: params.runId,
			...incognito ? { incognito: true } : {}
		})
	};
}
function toInternalSessionEffectsTarget(params) {
	return {
		agentId: params.agentId,
		sessionId: params.entry.sessionId,
		sessionKey: params.sessionKey,
		storePath: params.storePath,
		sessionEntry: params.entry,
		sessionFile: params.sessionKey
	};
}
/** Creates or reopens the hidden SQLite session owned by one internal-effects run. */
async function prepareInternalSessionEffectsSession(params) {
	const assertCurrent = () => {
		params.commitGuard?.();
		if (params.requireSource && (!params.source || loadExactSessionEntry(params.source)?.entry.sessionId !== params.source.sessionId)) throw new Error("Required internal-effects source session is unavailable");
	};
	assertCurrent();
	const scope = resolveInternalSessionEffectsTarget(params);
	const existing = loadExactSessionEntry(scope)?.entry;
	if (existing?.sessionId === scope.sessionId) return toInternalSessionEffectsTarget({
		agentId: params.agentId,
		entry: existing,
		sessionKey: scope.sessionKey,
		storePath: params.storePath
	});
	const fork = params.source ? await forkSessionFromParentTranscript({
		agentId: params.source.agentId,
		parentEntry: {
			sessionId: params.source.sessionId,
			updatedAt: Date.now()
		},
		parentSessionKey: params.source.sessionKey,
		sessionKey: scope.sessionKey,
		storePath: params.source.storePath,
		targetSessionId: scope.sessionId,
		targetStorePath: params.storePath,
		commitGuard: assertCurrent
	}) : void 0;
	if (params.requireSource && fork?.status !== "created") throw new Error(`Required internal-effects transcript could not be copied: ${fork?.status}`);
	const now = Date.now();
	const created = await createSessionEntryWithTranscript(scope, () => ({
		ok: true,
		entry: {
			...buildSessionCreationStamp({
				via: "internal",
				actor: { type: "system" }
			}),
			delivery: { kind: "internal" },
			sessionId: scope.sessionId,
			...isIncognitoOpenClawAgentSqlitePath(params.storePath, { agentId: params.agentId }) ? { incognito: true } : {},
			sessionStartedAt: now,
			updatedAt: now
		}
	}), {
		cwd: params.cwd,
		commitGuard: assertCurrent
	});
	if (!created.ok) throw new Error(`Failed to create internal SQLite session for run ${params.runId}`);
	return toInternalSessionEffectsTarget({
		agentId: params.agentId,
		entry: created.entry,
		sessionKey: scope.sessionKey,
		storePath: params.storePath
	});
}
/** Tracks every hidden binding used by one run, including accepted compaction rotations. */
function createInternalSessionEffectsCleanup(params) {
	const targets = params.enabled ? /* @__PURE__ */ new Map() : void 0;
	const track = (target) => {
		if (!targets || !target?.sessionKey || !target.storePath) return;
		targets.set(`${target.storePath}\n${target.sessionKey}`, target);
	};
	if (targets && params.storePath) track(resolveInternalSessionEffectsTarget({
		agentId: params.agentId,
		runId: params.runId,
		storePath: params.storePath
	}));
	return {
		track,
		cleanup: async () => {
			if (!targets) return;
			for (const target of targets.values()) try {
				await removeInternalSessionEffectsSession(target);
			} catch (error) {
				params.onError(error);
			}
		}
	};
}
/** Hard-deletes a run-owned hidden session and its SQLite transcript rows. */
async function removeInternalSessionEffectsSession(target, expectedOwner) {
	if (!target?.sessionKey || !target.storePath) return;
	const scope = {
		...target.agentId ? { agentId: target.agentId } : {},
		storePath: target.storePath
	};
	const expectedEntry = expectedOwner ? loadExactSessionEntry({
		...scope,
		sessionKey: target.sessionKey
	})?.entry : void 0;
	if (expectedOwner && (!expectedEntry || expectedEntry.sessionId !== target.sessionId || expectedEntry.lifecycleRevision !== expectedOwner.lifecycleRevision || expectedEntry.activeWriterRunId !== expectedOwner.activeWriterRunId)) return;
	await applySessionEntryLifecycleMutation({
		...scope,
		removals: [{
			sessionKey: target.sessionKey,
			...target.sessionId ? { expectedSessionId: target.sessionId } : {},
			...expectedEntry ? { expectedEntry } : {},
			archiveRemovedTranscript: false
		}],
		skipMaintenance: true
	});
}
//#endregion
export { prepareInternalSessionEffectsSession as n, removeInternalSessionEffectsSession as r, createInternalSessionEffectsCleanup as t };
