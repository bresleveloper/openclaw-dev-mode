import { l as resolveAgentIdFromSessionKey } from "./session-key-CBvmC8zz.mjs";
import { a as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-C2YxM4Tj.mjs";
import { r as resolveConcreteSessionStorePath } from "./paths-CcMbq5NY.mjs";
import "./openclaw-agent-db-CaQAStOA.mjs";
import { g as toDatabaseOptions, m as resolveSqliteTranscriptScope } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
import { T as resolveSessionStorePathForScope, _ as resolveSessionKeyBySessionId } from "./session-accessor.sqlite-entry-BB2Zsfho.mjs";
import { s as resolveSessionEntrySelection } from "./session-accessor.entry-CwzWysXO.mjs";
import { n as resolveSessionTranscriptReadTargetCore } from "./session-accessor.transcript-read-target-Cotag45I.mjs";
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
async function resolveSessionTranscriptRuntimeTarget(scope, config) {
	const agentId = scope.agentId ?? resolveAgentIdFromSessionKey(scope.sessionKey);
	if (!agentId) throw new Error(`Cannot resolve transcript scope without an agent id: ${scope.sessionKey}`);
	const { storePath } = bindSessionTranscriptStoreScope({
		...scope,
		agentId
	}, config);
	const sessionKey = resolveSessionKeyBySessionId({
		agentId,
		...scope.env ? { env: scope.env } : {},
		sessionId: scope.sessionId,
		storePath
	}) ?? resolveSessionEntrySelection({
		agentId,
		...scope.env ? { env: scope.env } : {},
		sessionKey: scope.sessionKey,
		storePath
	}, { readOnly: true })?.normalizedKey ?? scope.sessionKey;
	return {
		agentId,
		sessionId: scope.sessionId,
		sessionKey,
		storePath
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
export { resolveSessionTranscriptRuntimeTarget as i, resolveSessionTranscriptDatabasePath as n, resolveSessionTranscriptReadTarget as r, bindSessionTranscriptStoreScope as t };
