import { t as resolveIdentityPathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { M as parseAgentSessionKey, l as resolveAgentIdFromSessionKey } from "./session-key-CSDERtm3.mjs";
import { c as resolveSessionStorePathCore, i as resolveExplicitSessionStorePathForScope } from "./paths-YgcBNLgG.mjs";
import "./io-DIF-KW3P.mjs";
import { a as publishSystemEventStoreResolver, i as prepareSystemEventStorePath, n as getSystemEventStorePath, t as captureSystemEventStoreCurrentCheck } from "./system-event-ownership-DAgHWXZ1.mjs";
import { i as prepareSqliteTargetFromSessionStorePath, o as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-DJQA0Ssz.mjs";
//#region src/config/sessions/session-store-path.ts
function resolvePhysicalSessionStorePath(scope, cfg) {
	const agentId = scope.agentId ?? resolveAgentIdFromSessionKey(scope.sessionKey);
	return resolveIdentityPathViaExistingAncestorSync(resolveSqliteTargetFromSessionStorePath(resolveSessionStorePathForScope(scope, cfg), {
		...scope,
		agentId
	}).path);
}
/** Prepare ownership in the read worker before resolving the physical path identity. */
async function preparePhysicalSessionStorePath(scope, cfg) {
	const agentId = scope.agentId ?? resolveAgentIdFromSessionKey(scope.sessionKey);
	const target = await prepareSqliteTargetFromSessionStorePath(resolveSessionStorePathForScope(scope, cfg), {
		agentId,
		env: scope.env
	});
	return resolveIdentityPathViaExistingAncestorSync(target.path);
}
function publishSystemEventStoreConfig(cfg) {
	const env = { ...process.env };
	const paths = /* @__PURE__ */ new Map();
	const resolve = (sessionKey, owner) => {
		const agentId = resolveAgentIdFromSessionKey(sessionKey, owner);
		const scope = {
			sessionKey,
			agentId,
			env
		};
		return {
			scope,
			key: JSON.stringify([agentId, resolveSessionStorePathForScope(scope, cfg)])
		};
	};
	publishSystemEventStoreResolver((sessionKey, owner) => {
		const { scope, key } = resolve(sessionKey, owner);
		if (!paths.has(key)) paths.set(key, resolvePhysicalSessionStorePath(scope, cfg));
		return paths.get(key);
	}, async (sessionKey, owner) => {
		const { scope, key } = resolve(sessionKey, owner);
		if (!paths.has(key)) {
			const prepared = await preparePhysicalSessionStorePath(scope, cfg);
			if (!paths.has(key)) paths.set(key, prepared);
		}
		return paths.get(key);
	});
}
function captureSessionWatcherStorePaths(keys = [], env) {
	return Object.fromEntries(keys.filter((key) => parseAgentSessionKey(key) != null).map((sessionKey) => [sessionKey, getSystemEventStorePath(sessionKey) ?? resolvePhysicalSessionStorePath({
		sessionKey,
		env
	})]));
}
/** Prepare exact watcher stores and retain their owner checks through worker admission. */
async function prepareSessionWatcherStorePaths(keys = [], env) {
	const checks = [];
	const results = await Promise.allSettled(keys.filter((key) => parseAgentSessionKey(key) != null).map(async (sessionKey) => {
		const isStoreCurrent = captureSystemEventStoreCurrentCheck(sessionKey);
		const pathname = await (prepareSystemEventStorePath(sessionKey) ?? preparePhysicalSessionStorePath({
			sessionKey,
			env
		}));
		const check = () => {
			if (!isStoreCurrent(pathname)) throw new Error("Session signal lost its watcher store");
		};
		check();
		checks.push(check);
		return [sessionKey, pathname];
	}));
	return {
		paths: Object.fromEntries(results.map((result) => {
			if (result.status === "rejected") throw result.reason;
			return result.value;
		})),
		assertCurrent() {
			for (const check of checks) check();
		}
	};
}
function resolveSessionStorePathForScope(scope, config) {
	const explicitStorePath = resolveExplicitSessionStorePathForScope(scope);
	if (explicitStorePath) return explicitStorePath;
	const agentId = scope.agentId ?? resolveAgentIdFromSessionKey(scope.sessionKey);
	return resolveSessionStorePathCore((config ?? readRuntimeConfig()).session?.store, {
		agentId,
		env: scope.env
	});
}
//#endregion
export { resolvePhysicalSessionStorePath as a, publishSystemEventStoreConfig as i, preparePhysicalSessionStorePath as n, resolveSessionStorePathForScope as o, prepareSessionWatcherStorePaths as r, captureSessionWatcherStorePaths as t };
