import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-CSDERtm3.mjs";
import { i as resolveConcreteSessionStorePath } from "./session-sqlite-target-paths-DufdR-Na.mjs";
import "./paths-YgcBNLgG.mjs";
import "./openclaw-agent-db-_fC-kf1x.mjs";
import { n as captureSessionTranscriptTargetBinding } from "./transcript-target-binding-uO0pz59U.mjs";
import { o as resolveSessionStorePathForScope } from "./session-store-path-BQkYPc4_.mjs";
import { i as toDatabaseOptions, r as resolveSqliteSessionKey } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { a as resolveSqliteTranscriptReadScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import { s as resolveSqliteTranscriptScope } from "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { t as readRetainedSessionEntryFacts } from "./session-entry-read-facts-XUOtyCt0.mjs";
import { g as readSessionKeyBySessionIdInDatabase } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
import { f as resolveSessionKeyBySessionId } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import { l as resolveSessionEntry } from "./session-accessor.sqlite-exact-read-UkIlVdR6.mjs";
import "./session-accessor.entry-BLpjjUTc.mjs";
import { t as captureSessionActorTranscriptRead } from "./session-actor-transcript-read-Wje_m4fK.mjs";
import { n as resolveSessionTranscriptReadTargetCore } from "./session-accessor.transcript-read-target-BT22ajgI.mjs";
import { isMainThread } from "node:worker_threads";
//#region src/config/sessions/session-accessor.transcript-target.ts
/** Binds runtime storage without changing keys that raw ownership checks and read fences validate. */
function bindSessionTranscriptStoreScope(scope, config) {
	const memory = !scope.sessionKey || isIncognitoSessionKey(scope.sessionKey) ? captureSessionActorStorageOwner(scope) : void 0;
	if (memory) return {
		...scope,
		storePath: memory.path
	};
	return {
		...scope,
		storePath: resolveSessionStorePathForScope({
			...scope,
			storePath: resolveConcreteSessionStorePath(scope.storePath)
		}, config)
	};
}
/** Resolves the canonical storage identity for runtime transcript access. */
async function resolveSessionTranscriptRuntimeTarget(scope, config, options = {}) {
	const memory = captureSessionActorTranscriptRead(scope);
	if (memory) {
		const current = options.keyFormat ? memory.currentEntry() : void 0;
		return {
			...memory.target,
			...options.keyFormat ? {
				selectedSessionId: current?.sessionId ?? null,
				selectedLifecycleRevision: current?.lifecycleRevision ?? null
			} : {}
		};
	}
	const agentId = scope.agentId ?? resolveAgentIdFromSessionKey(scope.sessionKey);
	if (!agentId) throw new Error(`Cannot resolve transcript scope without an agent id: ${scope.sessionKey}`);
	const { storePath } = bindSessionTranscriptStoreScope({
		...scope,
		agentId
	}, config);
	const bound = captureSessionTranscriptTargetBinding({
		...scope,
		agentId,
		storePath
	});
	if (!isMainThread) return {
		...readSessionTranscriptRuntimeTarget(bound, options),
		storePath
	};
	const [{ withSessionStoreReaderInWorker }, { projectionLane }] = await Promise.all([import("./session-entry-read-runtime-BS7SNC06.mjs"), import("./session-transcript-worker-resources-z3zoJvTq.mjs")]);
	return {
		...await withSessionStoreReaderInWorker(bound, async ({ reader, database, logicalAgentId, continuation, assertCurrent }) => {
			const sessionKey = resolveSqliteSessionKey(bound.sessionKey, logicalAgentId);
			const entry = (sessionKey ? readRetainedSessionEntryFacts(database, { sessionKeys: [sessionKey] }) : void 0)?.entries.find((row) => row.sessionKey === sessionKey)?.entry;
			if (entry?.sessionId === bound.sessionId) {
				assertCurrent();
				return {
					agentId: logicalAgentId,
					sessionId: bound.sessionId,
					sessionKey,
					storePath: database.path,
					...options.keyFormat ? {
						selectedSessionId: entry.sessionId,
						selectedLifecycleRevision: entry.lifecycleRevision ?? null
					} : {}
				};
			}
			const selected = await reader.readRuntimeTarget({
				scope: {
					agentId: logicalAgentId,
					env: database.env,
					sessionId: bound.sessionId,
					sessionKey: bound.sessionKey,
					storePath: database.path
				},
				keyFormat: options.keyFormat,
				continuation
			});
			assertCurrent();
			return selected;
		}, {
			backing: true,
			lane: projectionLane,
			dataOnly: true
		}),
		storePath
	};
}
/** Resolve only a persisted window's key through the captured storage owner. */
async function resolveSessionKeyBySessionIdAsync(scope) {
	const memory = captureSessionActorTranscriptRead(scope);
	if (memory) return memory.missing ? void 0 : memory.target.sessionKey;
	const resolved = resolveSqliteTranscriptReadScope(scope);
	return (await resolveSessionTranscriptRuntimeTarget({
		...scope,
		agentId: resolved.agentId,
		sessionKey: ""
	})).sessionKey || void 0;
}
/** The admitted reader resolves the window and canonical row in its captured physical store. */
function readSessionTranscriptRuntimeTarget(scope, options = {}, database) {
	const { agentId, storePath } = scope;
	const persistedSessionKey = database ? readSessionKeyBySessionIdInDatabase(database, scope.sessionId) : resolveSessionKeyBySessionId({
		agentId: options.databaseAgentId ?? agentId,
		...scope.env ? { env: scope.env } : {},
		sessionId: scope.sessionId,
		storePath
	});
	const selected = persistedSessionKey && !options.keyFormat ? void 0 : resolveSessionEntry({
		agentId,
		...scope.env ? { env: scope.env } : {},
		sessionKey: persistedSessionKey ?? scope.sessionKey,
		storePath
	}, {
		readOnly: true,
		keyFormat: options.keyFormat,
		allowCanonicalMove: !persistedSessionKey,
		databaseAgentId: options.databaseAgentId,
		continuation: options.continuation
	});
	const sessionKey = persistedSessionKey ?? selected?.normalizedKey ?? scope.sessionKey;
	return {
		agentId,
		sessionId: scope.sessionId,
		sessionKey,
		storePath,
		...options.keyFormat ? {
			selectedSessionId: selected?.existing?.sessionId ?? null,
			selectedLifecycleRevision: selected?.existing?.lifecycleRevision ?? null
		} : {}
	};
}
/** Resolves the physical agent database that owns one runtime transcript. */
function resolveSessionTranscriptDatabasePath(target) {
	const memory = isIncognitoSessionKey(target.sessionKey) ? captureSessionActorStorageOwner(target) : void 0;
	if (memory) return memory.path;
	const resolved = resolveSqliteTranscriptScope(target);
	return resolveOpenClawAgentSqlitePath(toDatabaseOptions(resolved));
}
function resolveSessionTranscriptReadTarget(scope) {
	const memory = captureSessionActorTranscriptRead(scope);
	if (memory) return memory.target;
	return resolveSessionTranscriptReadTargetCore(scope, resolveSessionStorePathForScope);
}
//#endregion
export { resolveSessionTranscriptReadTarget as a, resolveSessionTranscriptDatabasePath as i, readSessionTranscriptRuntimeTarget as n, resolveSessionTranscriptRuntimeTarget as o, resolveSessionKeyBySessionIdAsync as r, bindSessionTranscriptStoreScope as t };
