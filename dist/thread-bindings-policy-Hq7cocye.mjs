import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { l as asNonNegativeFiniteNumber, t as MAX_DATE_TIMESTAMP_MS } from "./number-coercion-CkhMiRw8.mjs";
import { t as asBoolean } from "./boolean-CFfzB3ix.mjs";
import "./session-key-CSDERtm3.mjs";
import { n as normalizeAccountId } from "./account-id-ifCOO7_9.mjs";
import "./session-binding-service-ByKk9LiJ.mjs";
import { n as resolveThreadBindingLifecycle } from "./thread-binding-lifecycle-Cj9qM4Hm.mjs";
//#region src/channels/thread-bindings-policy.ts
const DEFAULT_THREAD_BINDING_IDLE_HOURS = 24;
const DEFAULT_THREAD_BINDING_MAX_AGE_HOURS = 0;
function resolveThreadBindingHoursMs(raw, fallbackHours) {
	const hours = asNonNegativeFiniteNumber(raw) ?? fallbackHours;
	const durationMs = Math.floor(hours * 60 * 60 * 1e3);
	if (!Number.isFinite(durationMs) || durationMs < 0) return 0;
	return Math.min(durationMs, MAX_DATE_TIMESTAMP_MS);
}
/** Resolves thread-binding idle timeout with channel/account override before session default. */
function resolveThreadBindingIdleTimeoutMs(params) {
	return resolveThreadBindingHoursMs(params.channelIdleHoursRaw, asNonNegativeFiniteNumber(params.sessionIdleHoursRaw) ?? DEFAULT_THREAD_BINDING_IDLE_HOURS);
}
/** Resolves thread-binding max age with channel/account override before session default. */
function resolveThreadBindingMaxAgeMs(params) {
	return resolveThreadBindingHoursMs(params.channelMaxAgeHoursRaw, asNonNegativeFiniteNumber(params.sessionMaxAgeHoursRaw) ?? DEFAULT_THREAD_BINDING_MAX_AGE_HOURS);
}
function resolveThreadBindingEffectiveExpiresAt(params) {
	return resolveThreadBindingLifecycle(params).expiresAt;
}
function resolveThreadBindingsEnabled(params) {
	return asBoolean(params.channelEnabledRaw) ?? asBoolean(params.sessionEnabledRaw) ?? true;
}
function resolveChannelThreadBindings(params) {
	const channelConfig = params.cfg.channels?.[normalizeLowercaseStringOrEmpty(params.channel)];
	const accountConfig = channelConfig?.accounts?.[normalizeAccountId(params.accountId)];
	return {
		root: channelConfig?.threadBindings,
		account: accountConfig?.threadBindings
	};
}
function normalizeSpawnContext(value) {
	return value === "isolated" || value === "fork" ? value : void 0;
}
/** Resolves effective spawn policy from account, channel, then global thread-binding config. */
function resolveThreadBindingSpawnPolicy(params) {
	const channel = normalizeLowercaseStringOrEmpty(params.channel);
	const accountId = normalizeAccountId(params.accountId);
	const { root, account } = resolveChannelThreadBindings({
		cfg: params.cfg,
		channel,
		accountId
	});
	return {
		channel,
		accountId,
		enabled: asBoolean(account?.enabled) ?? asBoolean(root?.enabled) ?? asBoolean(params.cfg.session?.threadBindings?.enabled) ?? true,
		spawnEnabled: asBoolean(account?.spawnSessions) ?? asBoolean(root?.spawnSessions) ?? asBoolean(params.cfg.session?.threadBindings?.spawnSessions) ?? true,
		defaultSpawnContext: normalizeSpawnContext(account?.defaultSpawnContext) ?? normalizeSpawnContext(root?.defaultSpawnContext) ?? normalizeSpawnContext(params.cfg.session?.threadBindings?.defaultSpawnContext) ?? "fork"
	};
}
function resolveThreadBindingIdleTimeoutMsForChannel(params) {
	const { root, account } = resolveChannelThreadBindings(params);
	return resolveThreadBindingIdleTimeoutMs({
		channelIdleHoursRaw: account?.idleHours ?? root?.idleHours,
		sessionIdleHoursRaw: params.cfg.session?.threadBindings?.idleHours
	});
}
function resolveThreadBindingMaxAgeMsForChannel(params) {
	const { root, account } = resolveChannelThreadBindings(params);
	return resolveThreadBindingMaxAgeMs({
		channelMaxAgeHoursRaw: account?.maxAgeHours ?? root?.maxAgeHours,
		sessionMaxAgeHoursRaw: params.cfg.session?.threadBindings?.maxAgeHours
	});
}
function formatThreadBindingDisabledError(params) {
	return `Thread bindings are disabled for ${params.channel} (set channels.${params.channel}.threadBindings.enabled=true to override for this account, or session.threadBindings.enabled=true globally).`;
}
function formatThreadBindingSpawnDisabledError(params) {
	return `Thread-bound session spawns are disabled for ${params.channel} (set channels.${params.channel}.threadBindings.spawnSessions=true to enable).`;
}
//#endregion
export { resolveThreadBindingIdleTimeoutMsForChannel as a, resolveThreadBindingSpawnPolicy as c, resolveThreadBindingIdleTimeoutMs as i, resolveThreadBindingsEnabled as l, formatThreadBindingSpawnDisabledError as n, resolveThreadBindingMaxAgeMs as o, resolveThreadBindingEffectiveExpiresAt as r, resolveThreadBindingMaxAgeMsForChannel as s, formatThreadBindingDisabledError as t };
