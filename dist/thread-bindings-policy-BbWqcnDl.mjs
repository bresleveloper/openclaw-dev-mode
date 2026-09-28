import { l as asNonNegativeFiniteNumber, t as MAX_DATE_TIMESTAMP_MS } from "./number-coercion-CLj0HTDM.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { t as asBoolean } from "./boolean-C30ltbL7.mjs";
import "./session-key-CBvmC8zz.mjs";
import { n as normalizeAccountId } from "./account-id-B1bfbA5J.mjs";
import { t as resolveChannelDefaultBindingPlacement } from "./conversation-resolution-BQfeG7hv.mjs";
import { n as resolveThreadBindingLifecycle } from "./thread-binding-lifecycle-Cj9qM4Hm.mjs";
//#region src/channels/thread-bindings-policy.ts
const DEFAULT_THREAD_BINDING_IDLE_HOURS = 24;
const DEFAULT_THREAD_BINDING_MAX_AGE_HOURS = 0;
function normalizeChannelId(value) {
	return normalizeLowercaseStringOrEmpty(value);
}
/** Returns true when top-level commands should spawn in a child thread by default. */
function supportsAutomaticThreadBindingSpawn(channel) {
	return resolveChannelDefaultBindingPlacement(channel) === "child";
}
function normalizeThreadBindingHours(raw) {
	return asNonNegativeFiniteNumber(raw);
}
function resolveThreadBindingHoursMs(raw, fallbackHours) {
	const hours = normalizeThreadBindingHours(raw) ?? fallbackHours;
	const durationMs = Math.floor(hours * 60 * 60 * 1e3);
	if (!Number.isFinite(durationMs) || durationMs < 0) return 0;
	return Math.min(durationMs, MAX_DATE_TIMESTAMP_MS);
}
/** Resolves thread-binding idle timeout with channel/account override before session default. */
function resolveThreadBindingIdleTimeoutMs(params) {
	return resolveThreadBindingHoursMs(params.channelIdleHoursRaw, normalizeThreadBindingHours(params.sessionIdleHoursRaw) ?? DEFAULT_THREAD_BINDING_IDLE_HOURS);
}
/** Resolves thread-binding max age with channel/account override before session default. */
function resolveThreadBindingMaxAgeMs(params) {
	return resolveThreadBindingHoursMs(params.channelMaxAgeHoursRaw, normalizeThreadBindingHours(params.sessionMaxAgeHoursRaw) ?? DEFAULT_THREAD_BINDING_MAX_AGE_HOURS);
}
/** Computes the effective expiry timestamp for a thread-binding lifecycle record. */
function resolveThreadBindingEffectiveExpiresAt(params) {
	return resolveThreadBindingLifecycle(params).expiresAt;
}
/** Resolves the effective enabled flag for thread bindings. */
function resolveThreadBindingsEnabled(params) {
	return asBoolean(params.channelEnabledRaw) ?? asBoolean(params.sessionEnabledRaw) ?? true;
}
function resolveChannelThreadBindings(params) {
	const channelConfig = params.cfg.channels?.[params.channel];
	const accountConfig = channelConfig?.accounts?.[params.accountId];
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
	const channel = normalizeChannelId(params.channel);
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
/** Resolves idle timeout for a concrete channel/account config scope. */
function resolveThreadBindingIdleTimeoutMsForChannel(params) {
	const { root, account } = resolveThreadBindingChannelScope(params);
	return resolveThreadBindingIdleTimeoutMs({
		channelIdleHoursRaw: account?.idleHours ?? root?.idleHours,
		sessionIdleHoursRaw: params.cfg.session?.threadBindings?.idleHours
	});
}
/** Resolves max age for a concrete channel/account config scope. */
function resolveThreadBindingMaxAgeMsForChannel(params) {
	const { root, account } = resolveThreadBindingChannelScope(params);
	return resolveThreadBindingMaxAgeMs({
		channelMaxAgeHoursRaw: account?.maxAgeHours ?? root?.maxAgeHours,
		sessionMaxAgeHoursRaw: params.cfg.session?.threadBindings?.maxAgeHours
	});
}
function resolveThreadBindingChannelScope(params) {
	const channel = normalizeChannelId(params.channel);
	const accountId = normalizeAccountId(params.accountId);
	return resolveChannelThreadBindings({
		cfg: params.cfg,
		channel,
		accountId
	});
}
/** Formats the user-facing error for disabled thread bindings. */
function formatThreadBindingDisabledError(params) {
	return `Thread bindings are disabled for ${params.channel} (set channels.${params.channel}.threadBindings.enabled=true to override for this account, or session.threadBindings.enabled=true globally).`;
}
/** Formats the user-facing error for disabled thread-bound session spawning. */
function formatThreadBindingSpawnDisabledError(params) {
	return `Thread-bound session spawns are disabled for ${params.channel} (set channels.${params.channel}.threadBindings.spawnSessions=true to enable).`;
}
//#endregion
export { resolveThreadBindingIdleTimeoutMsForChannel as a, resolveThreadBindingSpawnPolicy as c, resolveThreadBindingIdleTimeoutMs as i, resolveThreadBindingsEnabled as l, formatThreadBindingSpawnDisabledError as n, resolveThreadBindingMaxAgeMs as o, resolveThreadBindingEffectiveExpiresAt as r, resolveThreadBindingMaxAgeMsForChannel as s, formatThreadBindingDisabledError as t, supportsAutomaticThreadBindingSpawn as u };
