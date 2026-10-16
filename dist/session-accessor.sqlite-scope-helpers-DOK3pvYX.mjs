import { a as getNodeSqliteKysely } from "./kysely-sync-K7ftY-g4.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { M as parseAgentSessionKey, _ as toAgentStoreSessionKey } from "./session-key-C09ow4h0.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-Bb_svqyv.mjs";
//#region src/config/sessions/session-accessor.sqlite-scope-helpers.ts
function getSessionKysely(database) {
	return getNodeSqliteKysely(database);
}
/** Logical qualification is independent of the thread that resolves the physical store. */
function resolveSqliteSessionKey(sessionKey, agentId) {
	const normalizedSessionKey = normalizeStoreSessionKey(sessionKey);
	return !normalizedSessionKey || normalizedSessionKey === "global" || normalizedSessionKey === "unknown" || parseAgentSessionKey(normalizedSessionKey) ? normalizedSessionKey : toAgentStoreSessionKey({
		agentId,
		requestKey: normalizedSessionKey
	});
}
function resolveSqliteAgentId(params) {
	const scopedAgentId = params.scopedAgentId ? normalizeAgentId(params.scopedAgentId) : void 0;
	if (scopedAgentId && params.storeAgentId && scopedAgentId !== params.storeAgentId && !params.storeShared) throw new Error(`SQLite session store path belongs to agent ${params.storeAgentId}; requested agent ${scopedAgentId}.`);
	const parsedAgentId = params.sessionKey ? parseAgentSessionKey(params.sessionKey)?.agentId : void 0;
	return scopedAgentId ?? params.storeAgentId ?? parsedAgentId;
}
function toDatabaseOptions(scope) {
	return {
		agentId: scope.databaseAgentId ?? scope.agentId,
		...scope.env ? { env: scope.env } : {},
		...scope.path ? { path: scope.path } : {}
	};
}
//#endregion
export { toDatabaseOptions as i, resolveSqliteAgentId as n, resolveSqliteSessionKey as r, getSessionKysely as t };
