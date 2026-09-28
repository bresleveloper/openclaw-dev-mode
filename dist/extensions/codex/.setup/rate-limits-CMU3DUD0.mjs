import { i as isJsonObject } from "./protocol-CANUwXJ3.mjs";
import { normalizeOptionalString, parseStrictFiniteNumber } from "openclaw/plugin-sdk/string-coerce-runtime";
import { z } from "zod";
import { MAX_DATE_TIMESTAMP_MS, resolveExpiresAtMsFromEpochSeconds } from "openclaw/plugin-sdk/number-runtime";
import { PROVIDER_LABELS, clampPercent } from "openclaw/plugin-sdk/provider-usage";
//#region extensions/codex/src/app-server/rate-limit-time.ts
/** Human-readable Codex quota reset times; no account or routing decisions. */
const ONE_SECOND_MS = 1e3;
const ONE_MINUTE_MS = 6e4;
const ONE_HOUR_MS = 60 * ONE_MINUTE_MS;
const ONE_DAY_MS$1 = 24 * ONE_HOUR_MS;
function formatCalendarResetTime(resetsAtMs, nowMs) {
	const resetDate = new Date(resetsAtMs);
	const resetParts = new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		...resetDate.getFullYear() === new Date(nowMs).getFullYear() ? {} : { year: "numeric" },
		hour: "numeric",
		minute: "2-digit",
		timeZoneName: "short"
	}).formatToParts(resetDate);
	const part = (type) => resetParts.find((entry) => entry.type === type)?.value;
	const dateParts = [
		part("month"),
		part("day"),
		part("year")
	].filter(Boolean);
	return [
		dateParts.length > 1 ? `${dateParts[0]} ${dateParts.slice(1).join(", ")}` : dateParts[0],
		"at",
		[
			[part("hour"), part("minute")].filter(Boolean).join(":"),
			part("dayPeriod"),
			part("timeZoneName")
		].filter(Boolean).join(" ")
	].filter(Boolean).join(" ");
}
function formatRelativeDuration(durationMs) {
	const safeMs = Math.max(1e3, durationMs);
	if (safeMs < ONE_MINUTE_MS) return `${Math.ceil(safeMs / 1e3)} seconds`;
	if (safeMs < ONE_HOUR_MS) {
		const minutes = Math.ceil(safeMs / ONE_MINUTE_MS);
		return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
	}
	if (safeMs < ONE_DAY_MS$1) {
		const hours = Math.ceil(safeMs / ONE_HOUR_MS);
		return `${hours} ${hours === 1 ? "hour" : "hours"}`;
	}
	const days = Math.ceil(safeMs / ONE_DAY_MS$1);
	return `${days} ${days === 1 ? "day" : "days"}`;
}
function formatResetDuration(resetsAtMs, nowMs) {
	const durationMs = Math.round(Math.max(ONE_SECOND_MS, resetsAtMs - nowMs) / ONE_SECOND_MS) * ONE_SECOND_MS;
	const days = Math.floor(durationMs / ONE_DAY_MS$1);
	const hours = Math.floor(durationMs % ONE_DAY_MS$1 / ONE_HOUR_MS);
	const minutes = Math.floor(durationMs % ONE_HOUR_MS / ONE_MINUTE_MS);
	const seconds = Math.floor(durationMs % ONE_MINUTE_MS / ONE_SECOND_MS);
	if (days > 0) return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
	if (hours > 0) return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
	if (minutes > 0) return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
	return `${seconds}s`;
}
//#endregion
//#region extensions/codex/src/app-server/rate-limits.ts
/**
* Parses Codex account rate-limit payloads into user-facing usage summaries,
* reset hints, and enriched usage-limit error messages.
*/
const CODEX_LIMIT_ID = "codex";
const CODEX_RESERVE_ROUTE = "gpt-reserve";
const CODEX_RESERVE_USAGE_NOTICE = "Luna Reserve is a separate, backend-authorized route. Ordinary Luna does not use this reserve, even with Fast off. An unused reserve does not establish eligibility or per-request billing. Ordinary usage may consume credits after included limits are reached.";
const LIMIT_WINDOW_KEYS = ["primary", "secondary"];
const ONE_DAY_MS = 864e5;
const DAY_WINDOW_MINUTES = 1440;
const WEEKLY_WINDOW_MINUTES = 7 * DAY_WINDOW_MINUTES;
const WEEKLY_RESET_GAP_MS = 3 * ONE_DAY_MS;
const CODEX_USAGE_LIMIT_MESSAGE_PREFIX = "You've reached your Codex subscription usage limit.";
const CODEX_USAGE_LIMIT_STATE_MISMATCH_MESSAGE = "Codex rejected the request with a usage-limit error, but its current account usage does not report an exhausted limit.";
const optionalNumber = z.number().optional().catch(void 0);
const optionalBoolean = z.boolean().optional().catch(void 0);
const rateLimitWindowSchema = z.object({
	usedPercent: optionalNumber,
	resetsAt: optionalNumber,
	windowDurationMins: optionalNumber
}).transform((window) => ({
	usedPercent: window.usedPercent,
	resetsAtMs: resolveExpiresAtMsFromEpochSeconds(window.resetsAt, { maxMs: MAX_DATE_TIMESTAMP_MS }) ?? 0,
	windowDurationMins: window.windowDurationMins
})).optional().catch(void 0);
const creditsSchema = z.object({
	hasCredits: optionalBoolean,
	unlimited: optionalBoolean,
	balance: z.preprocess(parseStrictFiniteNumber, optionalNumber)
}).optional().catch(void 0);
const rateLimitSnapshotSchema = z.looseObject({
	primary: rateLimitWindowSchema,
	secondary: rateLimitWindowSchema,
	credits: creditsSchema
}).transform((snapshot) => ({
	primary: snapshot.primary,
	secondary: snapshot.secondary,
	credits: snapshot.credits,
	limitId: normalizeOptionalString(snapshot.limitId),
	limitName: normalizeOptionalString(snapshot.limitName),
	planType: normalizeOptionalString(snapshot.planType),
	rateLimitReachedType: normalizeOptionalString(snapshot.rateLimitReachedType)
}));
/** Enriches Codex usage-limit failures with reset timing and recovery guidance. */
function formatCodexUsageLimitErrorMessage(params) {
	const message = normalizeOptionalString(params.message);
	if (params.codexErrorInfo !== "usageLimitExceeded") return;
	const nowMs = params.nowMs ?? Date.now();
	const ordinaryUsageAllowed = readOrdinaryUsageAllowed(params.rateLimits);
	const snapshots = collectCodexRateLimitSnapshots(params.rateLimits).filter(snapshotHasDisplayableData);
	const usageSnapshot = snapshots.find(isCodexLimitSnapshot) ?? snapshots[0];
	const blockingSnapshot = selectBlockingRateLimitSnapshot(snapshots, ordinaryUsageAllowed);
	const usageSummary = usageSnapshot ? summarizeRateLimitUsage(usageSnapshot, blockingSnapshot, nowMs) : void 0;
	if (params.rateLimitsAuthoritative && (ordinaryUsageAllowed === true && !blockingSnapshot || ordinaryUsageAllowed === void 0 && usageSummary?.blocked === false)) return [CODEX_USAGE_LIMIT_STATE_MISMATCH_MESSAGE, "Retry the request, use another Codex account if available, or switch to another configured model/provider."].join(" ");
	const nextReset = (blockingSnapshot ? selectSnapshotBlockingReset(blockingSnapshot, nowMs) : void 0) ?? (ordinaryUsageAllowed === void 0 && !usageSummary?.blocked ? selectNextRateLimitReset(params.rateLimits, nowMs) : void 0);
	const parts = [CODEX_USAGE_LIMIT_MESSAGE_PREFIX];
	let recoveryAction = "Wait until Codex becomes available";
	if (nextReset) {
		parts.push(`Next reset ${formatResetTime(nextReset.resetsAtMs, nowMs)}.`);
		recoveryAction = "Wait until the reset time";
	} else {
		const codexRetryHint = extractCodexRetryHint(message);
		if (codexRetryHint) {
			parts.push(`Codex says to try again ${codexRetryHint}.`);
			recoveryAction = "Wait until the retry time";
		} else {
			if (usageSummary?.blockingPeriod && usageSummary.blockingReason) parts.push(`Your ${usageSummary.blockingReason}.`);
			parts.push("OpenClaw could not determine a reset time from Codex.");
		}
	}
	parts.push(`${recoveryAction}, use another Codex account if available, or switch to another configured model/provider.`);
	return parts.join(" ");
}
/** Detects usage-limit messages that need a fresh rate-limit query before display. */
function shouldRefreshCodexRateLimitsForUsageLimitMessage(message) {
	const text = normalizeOptionalString(message);
	return Boolean(text?.startsWith(CODEX_USAGE_LIMIT_MESSAGE_PREFIX) && !text.includes("Next reset "));
}
/** Formats compact summaries for raw Codex rate-limit snapshot payloads. */
function summarizeCodexRateLimits(value, nowMs = Date.now()) {
	const snapshots = collectCodexRateLimitSnapshots(value).filter(snapshotHasDisplayableData);
	if (snapshots.length === 0) return;
	const summaries = snapshots.slice(0, 4).map((snapshot) => summarizeRateLimitSnapshot(snapshot, nowMs)).filter((summary) => summary !== void 0);
	if (summaries.length === 0) return;
	return [summaries.join("; "), reserveUsageNotice(snapshots)].filter(Boolean).join(". ");
}
/** Returns true when a value contains any recognizable Codex rate-limit snapshots. */
function hasCodexRateLimitSnapshots(value) {
	return collectCodexRateLimitSnapshots(value).length > 0;
}
/** Builds short account availability lines suitable for status surfaces. */
function summarizeCodexAccountRateLimits(value, nowMs = Date.now()) {
	const summary = summarizeCodexAccountUsage(value, nowMs);
	if (!summary) return;
	if (!summary.blocked) return ["Codex is available."];
	return [summary.blockedUntilText ? `Codex is paused until ${summary.blockedUntilText}.` : "Codex is paused by a usage limit.", summary.blockingReason ? `Your ${summary.blockingReason}.` : "Your Codex usage limit is reached."];
}
/** Returns the reset timestamp for the currently blocking Codex usage limit. */
function resolveCodexUsageLimitResetAtMs(value, nowMs = Date.now()) {
	return selectBlockingRateLimitReset(value, nowMs)?.resetsAtMs;
}
/** Summarizes account availability, blocking reason, and reset time from rate-limit data. */
function summarizeCodexAccountUsage(value, nowMs = Date.now()) {
	const ordinaryUsageAllowed = readOrdinaryUsageAllowed(value);
	if (ordinaryUsageAllowed === null) return;
	const snapshot = collectCodexRateLimitSnapshots(value).find(isCodexLimitSnapshot);
	if (ordinaryUsageAllowed !== void 0) return {
		usageLine: snapshot ? formatUsageLine(snapshot) : void 0,
		blocked: !ordinaryUsageAllowed,
		...!ordinaryUsageAllowed ? { blockingReason: "Codex usage limit is reached" } : {}
	};
	return snapshot && snapshotHasDisplayableData(snapshot) ? summarizeRateLimitUsage(snapshot, snapshotHasLimitBlock(snapshot) ? snapshot : void 0, nowMs) : void 0;
}
function summarizeRateLimitUsage(usageSnapshot, blockingSnapshot, nowMs) {
	const blockingEntries = blockingSnapshot ? readWindowEntries(blockingSnapshot) : [];
	const blockingWindowEntry = selectBlockingWindowEntry(blockingEntries, nowMs);
	const blockingWindow = blockingWindowEntry?.window;
	const blockingReset = blockingWindow && blockingWindow.resetsAtMs > nowMs ? blockingWindow : void 0;
	const blockingPeriod = formatBlockingLimitPeriod(blockingWindowEntry, blockingEntries);
	const blockedUntilText = blockingReset ? formatAccountResetTime(blockingReset.resetsAtMs, nowMs) : void 0;
	const blockedResetRelative = blockingReset ? `in ${formatRelativeDuration(blockingReset.resetsAtMs - nowMs)}` : void 0;
	const blockingReason = blockingPeriod ? `${blockingPeriod} Codex usage limit is reached` : blockingSnapshot ? "Codex usage limit is reached" : void 0;
	return {
		usageLine: formatUsageLine(usageSnapshot),
		blocked: Boolean(blockingSnapshot),
		...blockingReset ? { blockedUntilMs: blockingReset.resetsAtMs } : {},
		...blockedUntilText ? { blockedUntilText } : {},
		...blockedResetRelative ? { blockedResetRelative } : {},
		...blockingPeriod ? { blockingPeriod } : {},
		...blockingReason ? { blockingReason } : {}
	};
}
/** Converts Codex app-server rate-limit payloads into OpenAI/Codex usage windows. */
function buildCodexAppServerUsageSnapshot(value, options = {}) {
	const snapshots = collectCodexRateLimitSnapshots(value);
	const snapshot = snapshots.find(isCodexLimitSnapshot) ?? snapshots[0];
	const entries = snapshot ? readWindowEntries(snapshot) : [];
	const windows = entries.map((entry) => readProviderUsageWindow(entry, entries)).filter((window) => Boolean(window));
	const summary = reserveUsageNotice(snapshots);
	const result = {
		...summary ? { summary } : {},
		provider: "openai",
		displayName: PROVIDER_LABELS.openai,
		windows,
		...snapshot ? { plan: resolveCodexProviderUsagePlan(snapshot) } : {}
	};
	if (options.accountDetails && snapshot) {
		result.plan = snapshot.planType;
		for (const extra of snapshots) {
			if (extra === snapshot) continue;
			const extraEntries = readWindowEntries(extra);
			for (const entry of extraEntries) {
				const window = readProviderUsageWindow(entry, extraEntries);
				if (window) windows.push({
					...window,
					groupLabel: formatLimitLabel(extra)
				});
			}
		}
		const credits = snapshot.credits;
		const balance = credits?.balance;
		if (balance !== void 0 && balance >= 0 && credits?.unlimited !== true) result.billing = [{
			type: "balance",
			amount: balance,
			unit: "credits"
		}];
	}
	return result;
}
function selectNextRateLimitReset(value, nowMs) {
	const futureWindows = collectCodexRateLimitSnapshots(value).flatMap((snapshot) => LIMIT_WINDOW_KEYS.flatMap((key) => snapshot[key] ?? [])).filter((window) => window.resetsAtMs > nowMs);
	if (futureWindows.length === 0) return;
	const exhaustedWindows = futureWindows.filter((window) => window.usedPercent !== void 0 && window.usedPercent >= 100);
	return (exhaustedWindows.length > 0 ? exhaustedWindows : futureWindows).toSorted((left, right) => left.resetsAtMs - right.resetsAtMs)[0];
}
function selectBlockingRateLimitReset(value, nowMs) {
	const blockingSnapshot = selectBlockingRateLimitSnapshot(collectCodexRateLimitSnapshots(value), readOrdinaryUsageAllowed(value));
	return blockingSnapshot ? selectSnapshotBlockingReset(blockingSnapshot, nowMs) : void 0;
}
function selectBlockingRateLimitSnapshot(snapshots, ordinaryUsageAllowed) {
	const blockedSnapshots = snapshots.filter((snapshot) => snapshotHasLimitBlock(snapshot) && (ordinaryUsageAllowed !== true && ordinaryUsageAllowed !== null || !isCodexLimitSnapshot(snapshot)));
	return blockedSnapshots.find(isCodexLimitSnapshot) ?? blockedSnapshots[0];
}
function summarizeRateLimitSnapshot(snapshot, nowMs) {
	const label = formatLimitLabel(snapshot);
	const windows = LIMIT_WINDOW_KEYS.flatMap((key) => {
		const window = snapshot[key];
		return window ? [formatRateLimitWindow(key, window, nowMs)] : [];
	});
	const reachedType = snapshot.rateLimitReachedType;
	const suffix = reachedType ? ` (${formatReachedType(reachedType)})` : "";
	if (windows.length > 0) return `${label}: ${windows.join(" · ")}${suffix}`;
	if (reachedType) return `${label}: ${formatReachedType(reachedType)}`;
}
function collectCodexRateLimitSnapshots(value) {
	if (!isJsonObject(value)) return [];
	if (isRateLimitSnapshot(value)) return [rateLimitSnapshotSchema.parse(value)];
	const byLimitId = value.rateLimitsByLimitId;
	return (isJsonObject(byLimitId) ? sortedRateLimitKeys(Object.keys(byLimitId)).map((key) => byLimitId[key]) : [value.rateLimits]).filter(isJsonObject).filter(isRateLimitSnapshot).map((snapshot) => rateLimitSnapshotSchema.parse(snapshot));
}
function readOrdinaryUsageAllowed(value) {
	const allowed = isJsonObject(value) ? value.ordinaryUsageAllowed : void 0;
	return allowed === null || typeof allowed === "boolean" ? allowed : void 0;
}
function sortedRateLimitKeys(keys) {
	return keys.toSorted((left, right) => {
		if (left === CODEX_LIMIT_ID) return -1;
		if (right === CODEX_LIMIT_ID) return 1;
		return left.localeCompare(right);
	});
}
function isRateLimitSnapshot(value) {
	return isJsonObject(value.primary) || isJsonObject(value.secondary) || value.rateLimitReachedType !== void 0 || value.limitId !== void 0 || value.limitName !== void 0;
}
function snapshotHasDisplayableData(snapshot) {
	return Boolean(snapshot.rateLimitReachedType) || readWindowEntries(snapshot).some((entry) => entry.window.usedPercent !== void 0 || entry.window.resetsAtMs > 0);
}
function formatRateLimitWindow(key, window, nowMs) {
	return `${key} ${formatRateLimitWindowDetails(window, nowMs)}`;
}
function formatRateLimitWindowDetails(window, nowMs) {
	return `${window.usedPercent === void 0 ? "usage unknown" : `${Math.max(0, 100 - Math.round(window.usedPercent))}% left`}${window.resetsAtMs > nowMs ? ` ⏱${formatResetDuration(window.resetsAtMs, nowMs)}` : ""}`;
}
function reserveUsageNotice(snapshots) {
	return snapshots.some(isReserveSnapshot) ? CODEX_RESERVE_USAGE_NOTICE : void 0;
}
function isReserveSnapshot(snapshot) {
	return snapshot.limitName === CODEX_RESERVE_ROUTE || snapshot.limitId === CODEX_RESERVE_ROUTE;
}
function formatLimitLabel(snapshot) {
	if (isReserveSnapshot(snapshot)) return "Luna Reserve (separate route)";
	const label = snapshot.limitName ?? snapshot.limitId;
	if (!label || label === CODEX_LIMIT_ID) return "Codex";
	return label.replace(/[_-]+/gu, " ").replace(/\s+/gu, " ").trim();
}
function formatReachedType(value) {
	return value.replace(/[_-]+/gu, " ").replace(/\s+/gu, " ").trim();
}
function formatResetTime(resetsAtMs, nowMs) {
	return `in ${formatRelativeDuration(resetsAtMs - nowMs)}, ${formatCalendarResetTime(resetsAtMs, nowMs)}`;
}
function formatAccountResetTime(resetsAtMs, nowMs) {
	return `${formatCalendarResetTime(resetsAtMs, nowMs)} (in ${formatRelativeDuration(resetsAtMs - nowMs)})`;
}
function snapshotHasLimitBlock(snapshot) {
	return Boolean(snapshot.rateLimitReachedType ?? readWindowEntries(snapshot).some((entry) => entry.window.usedPercent !== void 0 && entry.window.usedPercent >= 100));
}
function isCodexLimitSnapshot(snapshot) {
	return !snapshot.limitId || snapshot.limitId === CODEX_LIMIT_ID;
}
function readProviderUsageWindow(entry, entries) {
	const { window } = entry;
	if (window.usedPercent === void 0 && window.resetsAtMs <= 0) return;
	return {
		label: formatProviderUsageWindowLabel(entry, entries),
		usedPercent: clampPercent(window.usedPercent ?? 0),
		resetAt: window.resetsAtMs > 0 ? window.resetsAtMs : void 0
	};
}
function formatProviderUsageWindowLabel(entry, entries) {
	const minutes = entry.window.windowDurationMins;
	if (minutes === WEEKLY_WINDOW_MINUTES || hasWeeklySecondaryResetCadence(entry, entries)) return "Week";
	if (minutes === DAY_WINDOW_MINUTES) return "Day";
	if (minutes !== void 0 && minutes > 0 && minutes < DAY_WINDOW_MINUTES) return minutes % 60 === 0 ? `${minutes / 60}h` : `${minutes}m`;
	if (minutes !== void 0 && minutes > 0 && minutes % DAY_WINDOW_MINUTES === 0) return `${minutes / DAY_WINDOW_MINUTES}d`;
	if (minutes !== void 0 && minutes > 0 && minutes % 60 === 0) return `${minutes / 60}h`;
	return entry.key === "primary" ? "Short" : "Long";
}
function resolveCodexProviderUsagePlan(snapshot) {
	const plan = snapshot.planType;
	const creditSummary = formatCodexCreditSummary(snapshot.credits);
	if (!creditSummary) return plan;
	return plan ? `${plan} (${creditSummary})` : creditSummary;
}
function formatCodexCreditSummary(credits) {
	if (!credits || credits.hasCredits === false) return;
	if (credits.unlimited) return "Unlimited credits";
	const balance = credits.balance;
	if (balance === void 0 || balance <= 0) return;
	const roundedBalance = Math.round(balance);
	return roundedBalance > 0 ? `${roundedBalance} credits` : void 0;
}
function selectSnapshotBlockingReset(snapshot, nowMs) {
	const futureWindows = readWindowEntries(snapshot).map((entry) => entry.window).filter((window) => window.resetsAtMs > nowMs);
	const exhaustedWindows = futureWindows.filter((window) => window.usedPercent !== void 0 && window.usedPercent >= 100);
	const candidates = exhaustedWindows.length > 0 ? exhaustedWindows : futureWindows;
	const resetSort = exhaustedWindows.length > 0 ? (left, right) => right.resetsAtMs - left.resetsAtMs : (left, right) => left.resetsAtMs - right.resetsAtMs;
	return candidates.toSorted(resetSort)[0];
}
function selectBlockingWindowEntry(entries, nowMs) {
	const futureEntries = entries.filter((entry) => entry.window.resetsAtMs > nowMs);
	const exhaustedFutureEntries = futureEntries.filter((entry) => entry.window.usedPercent !== void 0 && entry.window.usedPercent >= 100);
	const resetCandidates = exhaustedFutureEntries.length > 0 ? exhaustedFutureEntries : futureEntries;
	if (resetCandidates.length > 0) {
		const resetSort = exhaustedFutureEntries.length > 0 ? (left, right) => right.window.resetsAtMs - left.window.resetsAtMs : (left, right) => left.window.resetsAtMs - right.window.resetsAtMs;
		return resetCandidates.toSorted(resetSort)[0];
	}
	return entries.filter((entry) => entry.window.usedPercent !== void 0 && entry.window.usedPercent >= 100).toSorted((left, right) => (right.window.windowDurationMins ?? 0) - (left.window.windowDurationMins ?? 0))[0];
}
function readWindowEntries(snapshot) {
	return LIMIT_WINDOW_KEYS.flatMap((key) => {
		const window = snapshot[key];
		return window ? [{
			key,
			window
		}] : [];
	});
}
function formatBlockingLimitPeriod(entry, entries) {
	const minutes = entry?.window.windowDurationMins;
	if (entry && (minutes === WEEKLY_WINDOW_MINUTES || hasWeeklySecondaryResetCadence(entry, entries))) return "weekly";
	if (minutes === DAY_WINDOW_MINUTES) return "daily";
	if (minutes !== void 0 && minutes > 0 && minutes < DAY_WINDOW_MINUTES) return "short-term";
}
function formatUsageLine(snapshot) {
	const entries = readWindowEntries(snapshot);
	const windows = entries.filter((entry) => entry.window.usedPercent !== void 0).toSorted((left, right) => (right.window.windowDurationMins ?? 0) - (left.window.windowDurationMins ?? 0)).map((entry) => {
		return `${formatUsageWindowLabel(entry, entries)} ${Math.round(entry.window.usedPercent ?? 0)}%`;
	});
	return windows.length > 0 ? windows.join(" · ") : void 0;
}
function formatUsageWindowLabel(entry, entries) {
	const minutes = entry.window.windowDurationMins;
	if (minutes === WEEKLY_WINDOW_MINUTES || hasWeeklySecondaryResetCadence(entry, entries)) return "weekly";
	if (minutes === DAY_WINDOW_MINUTES) return "daily";
	if (minutes !== void 0 && minutes > 0 && minutes < DAY_WINDOW_MINUTES) return "short-term";
	if (minutes !== void 0 && minutes > 0 && minutes % DAY_WINDOW_MINUTES === 0) return `${minutes / DAY_WINDOW_MINUTES}-day`;
	if (minutes !== void 0 && minutes > 0 && minutes % 60 === 0) return `${minutes / 60}-hour`;
	return "usage";
}
function hasWeeklySecondaryResetCadence(entry, entries) {
	if (entry.key !== "secondary" || entry.window.windowDurationMins !== DAY_WINDOW_MINUTES) return false;
	const primaryResetMs = entries.find((candidate) => candidate.key === "primary")?.window.resetsAtMs;
	return typeof primaryResetMs === "number" && primaryResetMs > 0 && entry.window.resetsAtMs > 0 && entry.window.resetsAtMs - primaryResetMs >= WEEKLY_RESET_GAP_MS;
}
function extractCodexRetryHint(message) {
	if (!message) return;
	const tryAgainAt = /\btry again\s+(at\s+[^.!?\n]+)(?:[.!?]|$)/iu.exec(message);
	if (tryAgainAt?.[1]) return tryAgainAt[1].trim();
	return /\btry again\s+((?:tomorrow|in\s+[^.!?\n]+)[^.!?\n]*)(?:[.!?]|$)/iu.exec(message)?.[1]?.trim();
}
//#endregion
export { shouldRefreshCodexRateLimitsForUsageLimitMessage as a, summarizeCodexRateLimits as c, resolveCodexUsageLimitResetAtMs as i, formatCodexUsageLimitErrorMessage as n, summarizeCodexAccountRateLimits as o, hasCodexRateLimitSnapshots as r, summarizeCodexAccountUsage as s, buildCodexAppServerUsageSnapshot as t };
