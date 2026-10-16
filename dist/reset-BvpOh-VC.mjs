import { c as normalizeOptionalLowercaseString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { c as asFiniteNumberInRange, s as asFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CqBAHB04.mjs";
import "./message-channel-j-k-Nup3.mjs";
import { t as resolveLoadedSessionThreadInfo } from "./session-thread-info-loaded-BaLPu4nN.mjs";
//#region src/config/sessions/reset-policy.ts
const DEFAULT_RESET_MODE = "none";
const DEFAULT_RESET_AT_HOUR = 4;
const DEFAULT_IDLE_MINUTES = 0;
/** Returns the most recent daily reset boundary for the supplied wall-clock time. */
function resolveDailyResetAtMs(now, atHour) {
	const hour = normalizeResetAtHour(atHour);
	const today = new Date(now).setHours(hour, 0, 0, 0);
	return now < today ? new Date(now).setHours(hour - 24, 0, 0, 0) : today;
}
/** Resolves the effective reset policy for direct, group, or thread sessions. */
function resolveSessionResetPolicy(params) {
	const sessionCfg = params.sessionCfg;
	const baseReset = params.resetOverride ?? sessionCfg?.reset;
	const typeReset = params.resetOverride ? void 0 : sessionCfg?.resetByType?.[params.resetType];
	const configured = Boolean(baseReset || typeReset);
	const inheritedTypeMode = typeReset && baseReset?.mode !== "none" ? baseReset?.mode : void 0;
	const mode = typeReset?.mode ?? inheritedTypeMode ?? (typeReset ? "daily" : void 0) ?? baseReset?.mode ?? (baseReset ? "daily" : DEFAULT_RESET_MODE);
	const atHour = normalizeResetAtHour(typeReset?.atHour ?? baseReset?.atHour ?? DEFAULT_RESET_AT_HOUR);
	const idleMinutesRaw = typeReset?.idleMinutes ?? baseReset?.idleMinutes;
	let idleMinutes;
	if (idleMinutesRaw != null) {
		const normalized = Math.floor(idleMinutesRaw);
		if (Number.isFinite(normalized)) idleMinutes = Math.max(normalized, 0);
	} else if (mode === "idle") idleMinutes = DEFAULT_IDLE_MINUTES;
	return {
		mode,
		atHour,
		idleMinutes,
		configured
	};
}
/** Evaluates whether a persisted session is still fresh under the resolved reset policy. */
function evaluateSessionFreshness(params) {
	if (params.updatedAt === 0) return { fresh: false };
	if (params.policy.mode === "none") return { fresh: true };
	const updatedAt = resolveTimestamp(params.updatedAt, params.now) ?? 0;
	const sessionStartedAt = resolveTimestamp(params.sessionStartedAt, params.now) ?? updatedAt;
	const lastInteractionAt = resolveTimestamp(params.lastInteractionAt, params.now) ?? sessionStartedAt;
	const dailyResetAt = params.policy.mode === "daily" ? resolveDailyResetAtMs(params.now, params.policy.atHour) : void 0;
	const idleExpiresAt = params.policy.idleMinutes != null && params.policy.idleMinutes > 0 ? lastInteractionAt + params.policy.idleMinutes * 6e4 : void 0;
	const staleDaily = dailyResetAt != null && sessionStartedAt < dailyResetAt;
	const staleIdle = idleExpiresAt != null && params.now > idleExpiresAt;
	const staleReason = staleDaily && staleIdle ? (dailyResetAt ?? Number.POSITIVE_INFINITY) <= (idleExpiresAt ?? Number.POSITIVE_INFINITY) ? "daily" : "idle" : staleIdle ? "idle" : staleDaily ? "daily" : void 0;
	return {
		fresh: !(staleDaily || staleIdle),
		dailyResetAt,
		idleExpiresAt,
		...staleReason ? { staleReason } : {}
	};
}
function resolveTimestamp(value, now) {
	return asFiniteNumberInRange(value, {
		min: 0,
		max: asFiniteNumber(now)
	});
}
function normalizeResetAtHour(value) {
	if (typeof value !== "number" || !Number.isFinite(value)) return DEFAULT_RESET_AT_HOUR;
	const normalized = Math.floor(value);
	return normalized < 0 ? 0 : Math.min(normalized, 23);
}
//#endregion
//#region src/config/sessions/reset.ts
const GROUP_SESSION_MARKERS = [":group:", ":channel:"];
/** Returns true when a session key is known to represent a thread. */
function isThreadSessionKey(sessionKey) {
	return Boolean(resolveLoadedSessionThreadInfo(sessionKey).threadId);
}
function resolveSessionResetType(params) {
	if (params.isThread || isThreadSessionKey(params.sessionKey)) return "thread";
	if (params.isGroup) return "group";
	const normalized = normalizeLowercaseStringOrEmpty(params.sessionKey);
	if (GROUP_SESSION_MARKERS.some((marker) => normalized.includes(marker))) return "group";
	return "direct";
}
function resolveThreadFlag(params) {
	return Boolean(params.messageThreadId != null || params.threadLabel?.trim() || params.threadStarterBody?.trim() || params.parentSessionKey?.trim() || isThreadSessionKey(params.sessionKey));
}
function resolveChannelResetConfig(params) {
	const resetByChannel = params.sessionCfg?.resetByChannel;
	if (!resetByChannel) return;
	const normalized = normalizeMessageChannel(params.channel);
	const fallback = normalizeOptionalLowercaseString(params.channel);
	const key = normalized ?? fallback;
	if (!key) return;
	return resetByChannel[key];
}
//#endregion
export { resolveSessionResetPolicy as a, evaluateSessionFreshness as i, resolveSessionResetType as n, resolveThreadFlag as r, resolveChannelResetConfig as t };
