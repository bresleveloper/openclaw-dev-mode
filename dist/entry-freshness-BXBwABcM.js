import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { p as resolveAgentIdFromSessionKey } from "./session-key-VWT_xzM9.js";
import { d as resolveStorePath } from "./paths-C2C4lJH6.js";
import { y as loadSessionEntry } from "./session-accessor-CwhXEUId.js";
import { s as resolveSessionLifecycleTimestamps } from "./lifecycle-BS_t5emX.js";
import { c as resolveSessionResetPolicy, o as evaluateSessionFreshness } from "./reset-DE-TpJ-C.js";
import { t as getCliSessionBinding } from "./cli-session-binding-BGrfRBGB.js";
//#region src/config/sessions/entry-freshness.ts
function hasProviderOwnedSession(entry) {
	const provider = normalizeOptionalString(entry?.providerOverride ?? entry?.modelProvider);
	return Boolean(provider && getCliSessionBinding(entry, provider));
}
/** Resolves one session entry's reset freshness using the runtime lifecycle rules. */
function resolveSessionEntryResetFreshness(params) {
	const agentId = params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey);
	const sessionCfg = params.sessionCfg;
	const storePath = params.storePath ?? resolveStorePath(sessionCfg?.store, {
		agentId,
		env: params.env
	});
	const entry = loadSessionEntry({
		...params,
		agentId,
		storePath
	});
	const resetType = params.resetType;
	const resetPolicy = resolveSessionResetPolicy({
		sessionCfg,
		resetType,
		resetOverride: params.resetOverride
	});
	const lifecycleTimestamps = resolveSessionLifecycleTimestamps({
		entry,
		agentId,
		storePath
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
export { resolveSessionEntryResetFreshness as n, hasProviderOwnedSession as t };
