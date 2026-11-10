import { r as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import "./openclaw-agent-db-_fC-kf1x.mjs";
import { n as resolveInternalSessionEffectsIdentity } from "./internal-session-key-B6hhdgLR.mjs";
import { l as buildSessionCreationStamp } from "./session-entry-lineage-B7Mubzwj.mjs";
import { a as readCapturedSessionActorEntry, n as captureSessionActorStorageOwner, s as withSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { a as captureSessionEntryReadScope } from "./session-entry-read-ordered-ygEz3W0N.mjs";
import { i as readSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { _ as applySessionEntryLifecycleMutation, f as forkSessionTranscriptFromParent, r as createSessionEntryWithTranscript } from "./session-accessor.entry-mutation-DgCGNicZ.mjs";
import { n as deleteSessionEntryLifecycle } from "./session-accessor.sqlite-lifecycle-7VGnaDT3.mjs";
//#region src/agents/internal-session-effects.ts
/** Manages hidden sessions used for suppressed agent side effects. */
/** Resolves the deterministic storage target owned by one internal-effects run. */
function resolveInternalSessionEffectsTarget(params) {
	const incognito = Boolean(captureSessionActorStorageOwner(params, {
		assertCurrent() {},
		authorize() {}
	})) || isIncognitoOpenClawAgentSqlitePath(params.storePath, { agentId: params.agentId });
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
function toInternalSessionEffectsTarget(scope, entry) {
	return {
		agentId: scope.agentId,
		sessionId: entry.sessionId,
		sessionKey: scope.sessionKey,
		storePath: scope.storePath,
		sessionEntry: entry,
		sessionFile: scope.sessionKey
	};
}
/** Creates or reopens the hidden session owned by one internal-effects run. */
async function prepareInternalSessionEffectsSession(params) {
	params.commitGuard?.();
	const target = resolveInternalSessionEffectsTarget(params);
	const { env } = captureSessionEntryReadScope(target);
	const scope = {
		...target,
		env
	};
	const authority = {
		assertCurrent() {
			params.commitGuard?.();
		},
		authorize() {}
	};
	const memory = captureSessionActorStorageOwner(scope, authority);
	const prepare = async () => {
		const existing = memory ? readCapturedSessionActorEntry(memory, scope.sessionKey) : await readSessionEntryReadOnlyInWorker(scope, params.commitGuard);
		params.commitGuard?.();
		if (existing?.sessionId === scope.sessionId) return toInternalSessionEffectsTarget(scope, existing);
		if (params.source) await forkSessionTranscriptFromParent({
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
			commitGuard: params.commitGuard
		});
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
				...isIncognitoSessionKey(scope.sessionKey) ? { incognito: true } : {},
				sessionStartedAt: now,
				updatedAt: now
			}
		}), {
			cwd: params.cwd,
			commitGuard: params.commitGuard
		});
		if (!created.ok) throw new Error(`Failed to create internal session for run ${params.runId}`);
		return toInternalSessionEffectsTarget(scope, created.entry);
	};
	if (!memory) return prepare();
	const result = await withSessionActorStorage(scope, {
		authority,
		lifetime: {
			assertCurrent: () => authority.assertCurrent(),
			assertReadable: () => authority.assertCurrent()
		},
		create: true
	}, prepare);
	if (!result) throw new Error("Internal memory session could not be acquired");
	return result;
}
/** Tracks every hidden binding used by one run, including accepted compaction rotations. */
function createInternalSessionEffectsCleanup(params) {
	const targets = params.enabled ? /* @__PURE__ */ new Map() : void 0;
	const source = params.enabled && params.storePath ? captureSessionActorStorageOwner(params, {
		assertCurrent() {},
		authorize() {}
	}) : void 0;
	const track = (target) => {
		if (!targets || !target?.sessionKey || !target.storePath) return;
		targets.set(`${target.storePath}\n${target.sessionKey}`, target);
	};
	if (targets && params.storePath) track(resolveInternalSessionEffectsTarget({
		agentId: params.agentId,
		runId: params.runId,
		storePath: params.storePath
	}));
	const cleanup = async () => {
		if (!targets) return;
		for (const target of targets.values()) try {
			await removeInternalSessionEffectsSession(target);
		} catch (error) {
			params.onError(error);
		}
	};
	return {
		track,
		cleanup: async () => {
			if (source && !source.owner && !source.binding) return;
			source?.owner?.assertCurrent();
			await cleanup();
		}
	};
}
/** Hard-deletes a run-owned hidden session and its transcript rows. */
async function removeInternalSessionEffectsSession(target, expectedOwner) {
	if (!target?.sessionKey || !target.storePath) return;
	const source = captureSessionActorStorageOwner(target, {
		assertCurrent() {},
		authorize() {}
	});
	const { env } = captureSessionEntryReadScope({
		...target,
		sessionKey: target.sessionKey
	});
	const scope = {
		...target.agentId ? { agentId: target.agentId } : {},
		storePath: target.storePath,
		env
	};
	const expectedEntry = expectedOwner ? source ? readCapturedSessionActorEntry(source, target.sessionKey) : await readSessionEntryReadOnlyInWorker({
		...scope,
		sessionKey: target.sessionKey
	}) : void 0;
	if (expectedOwner && (!expectedEntry || expectedEntry.sessionId !== target.sessionId || expectedEntry.lifecycleRevision !== expectedOwner.lifecycleRevision || expectedEntry.activeWriterRunId !== expectedOwner.activeWriterRunId)) return;
	if (source) {
		const sessionKey = target.sessionKey;
		await withSessionActorStorage({
			...scope,
			sessionKey
		}, {
			authority: source.authority,
			lifetime: {
				assertCurrent() {},
				assertReadable() {}
			}
		}, () => deleteSessionEntryLifecycle({
			...scope,
			target: {
				canonicalKey: sessionKey,
				storeKeys: [sessionKey]
			},
			archiveTranscript: false,
			deleteTranscriptWithoutArchive: true,
			expectedSessionId: target.sessionId,
			expectedEntry
		}));
		return;
	}
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
