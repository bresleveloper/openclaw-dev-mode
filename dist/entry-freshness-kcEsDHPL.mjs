import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-CSDERtm3.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { r as resolveSqliteSessionKey } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { r as getCliSessionBinding } from "./cli-session-binding-Dx1VbkI8.mjs";
import { s as isNativeSessionEntryRead } from "./session-entry-read-ordered-ygEz3W0N.mjs";
import { c as withSessionEntriesFromStoresInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { a as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import { t as resolveSessionLifecycleTimestamps } from "./lifecycle-CKc8qk3B.mjs";
import { a as resolveSessionResetPolicy, i as evaluateSessionFreshness } from "./reset-DlE-iD9Z.mjs";
//#region src/config/sessions/entry-freshness.ts
function hasProviderOwnedSession(entry) {
	const provider = normalizeOptionalString(entry?.providerOverride ?? entry?.modelProvider);
	return Boolean(provider && getCliSessionBinding(entry, provider));
}
function resolveFreshnessScope(params) {
	const agentId = params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey, params.defaultAgentId);
	const sessionCfg = params.sessionCfg;
	const storePath = params.storePath ?? resolveSessionStorePathCore(sessionCfg?.store, {
		agentId,
		env: params.env
	});
	return {
		...params,
		agentId,
		storePath
	};
}
/** @deprecated Runtime callers should await resolveSessionEntryResetFreshnessAsync. */
function resolveSessionEntryResetFreshness(params) {
	warnPluginSdkDeprecation({
		family: "session-entry-freshness",
		method: "resolveSessionEntryResetFreshness / runtime.channel.session.resolveEntryResetFreshness",
		replacement: "await resolveSessionEntryResetFreshnessAsync / runtime.channel.session.resolveEntryResetFreshnessAsync"
	});
	return readSessionEntryResetFreshness(resolveFreshnessScope(params));
}
function readSessionEntryResetFreshness(scope) {
	const entry = loadSessionEntryReadOnly(scope);
	return resolvePreparedSessionEntryResetFreshness(scope, entry, resolveSessionLifecycleTimestamps({
		...scope,
		entry
	}));
}
/** Entry and transcript fallback belong to the same retained worker snapshot. */
async function resolveSessionEntryResetFreshnessAsync(params) {
	const scope = resolveFreshnessScope(params);
	if (isNativeSessionEntryRead(scope, scope.agentId)) return readSessionEntryResetFreshness(scope);
	const sessionKey = resolveSqliteSessionKey(scope.sessionKey, scope.agentId);
	return withSessionEntriesFromStoresInWorker([{
		...scope,
		sessionKeys: [sessionKey],
		lifecycleSessionKey: sessionKey
	}], ([read]) => {
		read.assertCurrent();
		return resolvePreparedSessionEntryResetFreshness(params, read.result.entries[0]?.entry, read.result.lifecycleTimestamps);
	});
}
/** Consume entry and lifecycle facts from one retained read without opening another snapshot. */
function resolvePreparedSessionEntryResetFreshness(params, entry, lifecycleTimestamps) {
	const resetType = params.resetType;
	const resetPolicy = resolveSessionResetPolicy({
		sessionCfg: params.sessionCfg,
		resetType,
		resetOverride: params.resetOverride
	});
	const base = {
		lifecycleTimestamps,
		resetPolicy,
		resetType
	};
	if (!entry) return {
		state: "missing",
		entry: void 0,
		freshness: void 0,
		...base
	};
	const freshness = resetPolicy.configured !== true && hasProviderOwnedSession(entry) ? { fresh: true } : evaluateSessionFreshness({
		updatedAt: entry.updatedAt,
		sessionStartedAt: lifecycleTimestamps.sessionStartedAt,
		lastInteractionAt: lifecycleTimestamps.lastInteractionAt,
		now: params.now ?? Date.now(),
		policy: resetPolicy
	});
	return {
		state: freshness.fresh ? "fresh" : "stale",
		entry,
		freshness,
		...base
	};
}
//#endregion
export { resolveSessionEntryResetFreshnessAsync as i, resolvePreparedSessionEntryResetFreshness as n, resolveSessionEntryResetFreshness as r, hasProviderOwnedSession as t };
