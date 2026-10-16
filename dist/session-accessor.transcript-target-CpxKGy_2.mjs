import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-C09ow4h0.mjs";
import { c as resolveOpenClawAgentSqlitePath, i as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { r as resolveConcreteSessionStorePath } from "./paths-dpReqUI8.mjs";
import "./openclaw-agent-db-DBug3LUA.mjs";
import { n as captureSessionTranscriptTargetBinding } from "./transcript-target-binding-WjVavOYj.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { d as resolveSqliteTranscriptScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { _ as resolveSessionStorePathForScope } from "./session-transcript-worker-runtime-EUbUbAQu.mjs";
import { u as resolveSessionEntry } from "./session-accessor.sqlite-exact-read-JW6IveXD.mjs";
import { p as resolveSessionKeyBySessionId } from "./session-accessor.sqlite-entry-AwYVLytL.mjs";
import "./session-accessor.entry-Di4jQk7u.mjs";
import { n as resolveSessionTranscriptReadTargetCore } from "./session-accessor.transcript-read-target-BJshrOZB.mjs";
import { isMainThread } from "node:worker_threads";
//#region src/config/sessions/session-accessor.transcript-target.ts
/** Binds runtime storage without changing keys that raw ownership checks and read fences validate. */
function bindSessionTranscriptStoreScope(scope, config) {
	return {
		...scope,
		storePath: resolveSessionStorePathForScope({
			...scope,
			storePath: resolveConcreteSessionStorePath(scope.storePath)
		}, config)
	};
}
/** Resolves the canonical SQLite identity for runtime transcript access. */
async function resolveSessionTranscriptRuntimeTarget(scope, config, options = {}) {
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
	if (!isMainThread || isIncognitoSessionKey(scope.sessionKey) || isIncognitoOpenClawAgentSqlitePath(storePath, {
		agentId,
		env: bound.env
	})) return {
		...readSessionTranscriptRuntimeTarget(bound, options),
		storePath
	};
	const { withSessionStoreReaderInWorker } = await import("./session-entry-read-runtime-DvU9RDm9.mjs");
	return {
		...await withSessionStoreReaderInWorker(bound, async ({ reader, database, logicalAgentId, continuation, assertCurrent }) => {
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
			dataOnly: true
		}),
		storePath
	};
}
/** The admitted reader resolves the window and canonical row in its captured physical store. */
function readSessionTranscriptRuntimeTarget(scope, options = {}) {
	const { agentId, storePath } = scope;
	const persistedSessionKey = resolveSessionKeyBySessionId({
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
	const resolved = resolveSqliteTranscriptScope(target);
	return resolveOpenClawAgentSqlitePath(toDatabaseOptions(resolved));
}
function resolveSessionTranscriptReadTarget(scope) {
	return resolveSessionTranscriptReadTargetCore(scope, resolveSessionStorePathForScope);
}
//#endregion
export { resolveSessionTranscriptRuntimeTarget as a, resolveSessionTranscriptReadTarget as i, readSessionTranscriptRuntimeTarget as n, resolveSessionTranscriptDatabasePath as r, bindSessionTranscriptStoreScope as t };
