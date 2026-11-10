import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { o as resolveExplicitIncognitoAgentSqliteTarget, s as resolveIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { M as parseAgentSessionKey, l as resolveAgentIdFromSessionKey } from "./session-key-CSDERtm3.mjs";
import { o as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-DJQA0Ssz.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-CUxN9KZj.mjs";
import { n as resolveSqliteAgentId, r as resolveSqliteSessionKey } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
//#region src/config/sessions/session-accessor.sqlite-read-scope.ts
function resolveSqliteDatabaseScopeIdentity(scope) {
	const parsedAgentId = parseAgentSessionKey(scope.sessionKey)?.agentId;
	const scopedAgentId = scope.agentId ? normalizeAgentId(scope.agentId) : parsedAgentId;
	const incognitoAgentId = isIncognitoSessionKey(scope.sessionKey) ? resolveAgentIdFromSessionKey(scope.sessionKey) : void 0;
	const explicitIncognito = resolveExplicitIncognitoAgentSqliteTarget(scope.storePath, {
		agentId: incognitoAgentId ?? scopedAgentId,
		env: scope.env
	});
	if (explicitIncognito) return {
		effectiveAgentId: explicitIncognito.agentId,
		effectiveStorePath: explicitIncognito.path,
		effectiveEnv: explicitIncognito.env,
		explicitIncognito
	};
	const effectiveStorePath = incognitoAgentId ? resolveIncognitoOpenClawAgentSqlitePath({
		agentId: incognitoAgentId,
		env: scope.env
	}) : scope.storePath;
	return {
		effectiveAgentId: incognitoAgentId ?? scopedAgentId,
		effectiveStorePath,
		effectiveEnv: scope.env
	};
}
function resolveSqliteDatabaseScope(scope, targetCache, preparedStoreTarget) {
	const { effectiveAgentId, effectiveStorePath, effectiveEnv, explicitIncognito } = resolveSqliteDatabaseScopeIdentity(scope);
	const storeTarget = explicitIncognito ?? preparedStoreTarget ?? (effectiveStorePath ? resolveCachedSqliteStoreTarget({
		agentId: effectiveAgentId,
		defaultAgentId: scope.defaultAgentId,
		env: effectiveEnv,
		storePath: effectiveStorePath
	}, targetCache) : void 0);
	return {
		agentId: resolveSqliteAgentId({
			scopedAgentId: effectiveAgentId,
			sessionKey: scope.sessionKey,
			storeAgentId: storeTarget?.agentId,
			storeShared: storeTarget?.shared
		}),
		...storeTarget?.shared && storeTarget.agentId ? { databaseAgentId: storeTarget.agentId } : {},
		...effectiveEnv ? { env: effectiveEnv } : {},
		...effectiveStorePath ? { ownerStorePath: effectiveStorePath } : {},
		...storeTarget ? { path: storeTarget.path } : {}
	};
}
function resolveSqliteScope(scope, targetCache, preparedStoreTarget) {
	const { agentId, ...database } = resolveSqliteDatabaseScope(scope, targetCache, preparedStoreTarget);
	if (!agentId) throw new Error("Cannot resolve SQLite session scope without an agent id");
	return {
		agentId,
		...database,
		sessionKey: resolveSqliteSessionKey(scope.sessionKey, agentId)
	};
}
function resolveSqliteReadScope(scope, targetCache, preparedStoreTarget) {
	const sessionKey = scope.sessionKey ? normalizeStoreSessionKey(scope.sessionKey) : void 0;
	const { agentId, ...database } = resolveSqliteDatabaseScope({
		...scope,
		sessionKey
	}, targetCache, preparedStoreTarget);
	if (!agentId) throw new Error("Cannot resolve SQLite transcript read scope without an agent id");
	return {
		agentId,
		...database,
		...sessionKey ? { sessionKey } : {}
	};
}
function resolveCachedSqliteStoreTarget(params, targetCache) {
	const envCache = targetCache && (targetCache.get(params.env) ?? /* @__PURE__ */ new Map());
	if (envCache) targetCache?.set(params.env, envCache);
	const cacheKey = envCache ? JSON.stringify([
		params.storePath,
		params.agentId,
		params.defaultAgentId
	]) : "";
	const cached = envCache?.get(cacheKey);
	if (cached) return cached;
	const resolved = resolveSqliteTargetFromSessionStorePath(params.storePath, {
		agentId: params.agentId,
		defaultAgentId: params.defaultAgentId,
		...params.env ? { env: params.env } : {}
	});
	envCache?.set(cacheKey, resolved);
	return resolved;
}
function resolveSqliteStoreScope(storePath, options = {}) {
	return resolveSqliteScope({
		...options.agentId ? { agentId: options.agentId } : {},
		sessionKey: "",
		storePath
	});
}
function resolveSqliteTranscriptReadScope(scope, targetCache) {
	return {
		...resolveSqliteReadScope(scope, targetCache),
		sessionId: scope.sessionId
	};
}
//#endregion
export { resolveSqliteTranscriptReadScope as a, resolveSqliteStoreScope as i, resolveSqliteReadScope as n, resolveSqliteScope as r, resolveSqliteDatabaseScopeIdentity as t };
