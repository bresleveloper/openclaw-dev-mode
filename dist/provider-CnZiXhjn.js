import { E as resolveExpiresAtMsFromEpochSeconds, _ as parseStrictFiniteNumber, s as asFiniteNumber } from "./number-coercion-CJQ8TR--.js";
import { t as createSubsystemLogger } from "./subsystem-yNfG7O3v.js";
import { a as normalizeModelCompat } from "./provider-model-compat-DAJmt9jr.js";
import "./number-runtime-DBLVDypr.js";
import "./string-coerce-runtime-BiZzULo_.js";
import "./core-etcZhDYQ.js";
import "./provider-model-shared-pp09751S.js";
import { r as resolvePluginConfigObject } from "./plugin-config-runtime-DWfSLpLu.js";
import { n as PROVIDER_LABELS, r as clampPercent } from "./provider-usage.shared-ayVH6rxf.js";
import "./provider-usage-C1zSp9Hk.js";
import { a as buildCodexModelDefinition, i as FALLBACK_CODEX_MODELS, n as CODEX_BASE_URL, o as buildCodexProviderConfig, r as CODEX_PROVIDER_ID, t as CODEX_APP_SERVER_AUTH_MARKER } from "./provider-catalog-BdolWBnQ.js";
import { n as isJsonObject } from "./protocol-dh-ETiNd.js";
import { d as resolveCodexAppServerRuntimeOptions, u as readCodexPluginConfig } from "./config-CbDnHE5R.js";
import { r as resolveCodexSystemPromptContribution } from "./prompt-overlay-D5ksW0Bt.js";
//#region extensions/codex/src/app-server/rate-limits.ts
/**
* Parses Codex account rate-limit payloads into user-facing usage summaries,
* reset hints, and enriched usage-limit error messages.
*/
const CODEX_LIMIT_ID = "codex";
const LIMIT_WINDOW_KEYS = ["primary", "secondary"];
const ONE_SECOND_MS = 1e3;
const ONE_MINUTE_MS = 6e4;
const ONE_HOUR_MS = 60 * ONE_MINUTE_MS;
const ONE_DAY_MS = 24 * ONE_HOUR_MS;
const DAY_WINDOW_MINUTES = 1440;
const WEEKLY_WINDOW_MINUTES = 7 * DAY_WINDOW_MINUTES;
const WEEKLY_RESET_GAP_MS = 3 * ONE_DAY_MS;
/** Enriches Codex usage-limit failures with reset timing and recovery guidance. */
function formatCodexUsageLimitErrorMessage(params) {
	const message = normalizeText(params.message);
	if (!isCodexUsageLimitError(params.codexErrorInfo, message)) return;
	const nowMs = params.nowMs ?? Date.now();
	const usageSummary = summarizeCodexAccountUsage(params.rateLimits, nowMs);
	const nextReset = selectBlockingRateLimitReset(params.rateLimits, nowMs) ?? (usageSummary?.blocked ? void 0 : selectNextRateLimitReset(params.rateLimits, nowMs));
	const parts = ["You've reached your Codex subscription usage limit."];
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
	const text = normalizeText(message);
	return Boolean(text?.includes("You've reached your Codex subscription usage limit.") && !text.includes("Next reset "));
}
/** Formats compact summaries for raw Codex rate-limit snapshot payloads. */
function summarizeCodexRateLimits(value, nowMs = Date.now()) {
	const snapshots = collectCodexRateLimitSnapshots(value).filter(snapshotHasDisplayableData);
	if (snapshots.length === 0) return;
	const summaries = snapshots.slice(0, 4).map((snapshot) => summarizeRateLimitSnapshot(snapshot, nowMs)).filter((summary) => summary !== void 0);
	return summaries.length > 0 ? summaries.join("; ") : void 0;
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
	const snapshots = collectCodexRateLimitSnapshots(value).filter(snapshotHasDisplayableData);
	if (snapshots.length === 0) return;
	const usageSnapshot = snapshots.find(isCodexLimitSnapshot) ?? snapshots[0];
	const blockedSnapshots = snapshots.filter(snapshotHasLimitBlock);
	const blockingSnapshot = blockedSnapshots.find(isCodexLimitSnapshot) ?? blockedSnapshots[0] ?? void 0;
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
function buildCodexAppServerUsageSnapshot(value) {
	const snapshot = selectCodexProviderUsageSnapshot(value);
	const entries = snapshot ? readWindowEntries(snapshot) : [];
	const windows = entries.map((entry) => readProviderUsageWindow(entry, entries)).filter((window) => Boolean(window));
	return {
		provider: "openai",
		displayName: PROVIDER_LABELS.openai,
		windows,
		...snapshot ? { plan: resolveCodexProviderUsagePlan(snapshot) } : {}
	};
}
function isCodexUsageLimitError(codexErrorInfo, message) {
	if (codexErrorInfo === "usageLimitExceeded") return true;
	if (typeof codexErrorInfo === "string") {
		if (codexErrorInfo.replace(/[_\s-]/gu, "").toLowerCase() === "usagelimitexceeded") return true;
	}
	return Boolean(message?.toLowerCase().includes("usage limit"));
}
function selectNextRateLimitReset(value, nowMs) {
	const futureWindows = collectCodexRateLimitSnapshots(value).flatMap((snapshot) => LIMIT_WINDOW_KEYS.flatMap((key) => readRateLimitWindow(snapshot, key) ?? [])).filter((window) => window.resetsAtMs > nowMs);
	if (futureWindows.length === 0) return;
	const exhaustedWindows = futureWindows.filter((window) => window.usedPercent !== void 0 && window.usedPercent >= 100);
	return (exhaustedWindows.length > 0 ? exhaustedWindows : futureWindows).toSorted((left, right) => left.resetsAtMs - right.resetsAtMs)[0];
}
function selectBlockingRateLimitReset(value, nowMs) {
	const blockedSnapshots = collectCodexRateLimitSnapshots(value).filter(snapshotHasLimitBlock);
	const blockingSnapshot = blockedSnapshots.find(isCodexLimitSnapshot) ?? blockedSnapshots[0] ?? void 0;
	return blockingSnapshot ? selectSnapshotBlockingReset(blockingSnapshot, nowMs) : void 0;
}
function summarizeRateLimitSnapshot(snapshot, nowMs) {
	const label = formatLimitLabel(snapshot);
	const windows = LIMIT_WINDOW_KEYS.flatMap((key) => {
		const window = readRateLimitWindow(snapshot, key);
		return window ? [formatRateLimitWindow(key, window, nowMs)] : [];
	});
	const reachedType = readString(snapshot, "rateLimitReachedType") ?? readString(snapshot, "rate_limit_reached_type");
	const suffix = reachedType ? ` (${formatReachedType(reachedType)})` : "";
	if (windows.length > 0) return `${label}: ${windows.join(" · ")}${suffix}`;
	if (reachedType) return `${label}: ${formatReachedType(reachedType)}`;
}
function collectCodexRateLimitSnapshots(value) {
	const snapshots = [];
	collectRateLimitSnapshots(value, snapshots, /* @__PURE__ */ new Set());
	return snapshots;
}
function collectRateLimitSnapshots(value, snapshots, seen) {
	if (Array.isArray(value)) {
		for (const entry of value) collectRateLimitSnapshots(entry, snapshots, seen);
		return;
	}
	if (!isJsonObject(value)) return;
	if (isRateLimitSnapshot(value)) {
		addRateLimitSnapshot(value, snapshots, seen);
		return;
	}
	const byLimitId = value.rateLimitsByLimitId;
	if (isJsonObject(byLimitId)) for (const key of sortedRateLimitKeys(Object.keys(byLimitId))) collectRateLimitSnapshots(byLimitId[key], snapshots, seen);
	const snakeByLimitId = value.rate_limits_by_limit_id;
	if (isJsonObject(snakeByLimitId)) for (const key of sortedRateLimitKeys(Object.keys(snakeByLimitId))) collectRateLimitSnapshots(snakeByLimitId[key], snapshots, seen);
	collectRateLimitSnapshots(value.rateLimits, snapshots, seen);
	collectRateLimitSnapshots(value.rate_limits, snapshots, seen);
	collectRateLimitSnapshots(value.data, snapshots, seen);
	collectRateLimitSnapshots(value.items, snapshots, seen);
}
function sortedRateLimitKeys(keys) {
	return keys.toSorted((left, right) => {
		if (left === CODEX_LIMIT_ID) return -1;
		if (right === CODEX_LIMIT_ID) return 1;
		return left.localeCompare(right);
	});
}
function addRateLimitSnapshot(snapshot, snapshots, seen) {
	const signature = [
		readNullableString(snapshot, "limitId") ?? readNullableString(snapshot, "limit_id") ?? "",
		readNullableString(snapshot, "limitName") ?? readNullableString(snapshot, "limit_name") ?? "",
		formatWindowSignature(snapshot.primary),
		formatWindowSignature(snapshot.secondary)
	].join("|");
	if (seen.has(signature)) return;
	seen.add(signature);
	snapshots.push(snapshot);
}
function isRateLimitSnapshot(value) {
	return isJsonObject(value.primary) || isJsonObject(value.secondary) || value.rateLimitReachedType !== void 0 || value.rate_limit_reached_type !== void 0 || value.limitId !== void 0 || value.limit_id !== void 0 || value.limitName !== void 0 || value.limit_name !== void 0;
}
function readRateLimitWindow(snapshot, key) {
	const window = snapshot[key];
	if (!isJsonObject(window)) return;
	return {
		resetsAtMs: resolveExpiresAtMsFromEpochSeconds(readNumber(window, "resetsAt") ?? readNumber(window, "resets_at"), { maxMs: 864e13 }) ?? 0,
		...readOptionalNumberField(window, "usedPercent", "used_percent"),
		...readOptionalNumberField(window, "windowDurationMins", "window_duration_mins", "windowMinutes", "window_minutes")
	};
}
function snapshotHasDisplayableData(snapshot) {
	if (readString(snapshot, "rateLimitReachedType") ?? readString(snapshot, "rate_limit_reached_type")) return true;
	return readWindowEntries(snapshot).some((entry) => entry.window.usedPercent !== void 0 || entry.window.resetsAtMs > 0);
}
function readOptionalNumberField(record, ...keys) {
	const value = keys.map((key) => readNumber(record, key)).find((entry) => entry !== void 0);
	if (value === void 0) return {};
	return keys.some((key) => key.toLowerCase().includes("window")) ? { windowDurationMins: value } : { usedPercent: value };
}
function formatRateLimitWindow(key, window, nowMs) {
	return `${key} ${formatRateLimitWindowDetails(window, nowMs)}`;
}
function formatRateLimitWindowDetails(window, nowMs) {
	return `${window.usedPercent === void 0 ? "usage unknown" : `${Math.max(0, 100 - Math.round(window.usedPercent))}% left`}${window.resetsAtMs > nowMs ? ` ⏱${formatResetDuration(window.resetsAtMs, nowMs)}` : ""}`;
}
function formatLimitLabel(snapshot) {
	const label = readNullableString(snapshot, "limitName") ?? readNullableString(snapshot, "limit_name") ?? readNullableString(snapshot, "limitId") ?? readNullableString(snapshot, "limit_id");
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
	return Boolean(readString(snapshot, "rateLimitReachedType") ?? readString(snapshot, "rate_limit_reached_type") ?? readWindowEntries(snapshot).some((entry) => entry.window.usedPercent !== void 0 && entry.window.usedPercent >= 100));
}
function isCodexLimitSnapshot(snapshot) {
	const id = readNullableString(snapshot, "limitId") ?? readNullableString(snapshot, "limit_id");
	return !id || id === CODEX_LIMIT_ID;
}
function selectCodexProviderUsageSnapshot(value) {
	const snapshots = collectCodexRateLimitSnapshots(value);
	return snapshots.find(isCodexLimitSnapshot) ?? snapshots[0];
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
	const plan = readString(snapshot, "planType") ?? readString(snapshot, "plan_type");
	const creditSummary = formatCodexCreditSummary(isJsonObject(snapshot.credits) ? snapshot.credits : void 0);
	if (!creditSummary) return plan;
	return plan ? `${plan} (${creditSummary})` : creditSummary;
}
function formatCodexCreditSummary(credits) {
	if (!credits) return;
	if ((readBoolean(credits, "hasCredits") ?? readBoolean(credits, "has_credits")) === false) return;
	if (readBoolean(credits, "unlimited")) return "Unlimited credits";
	const balance = typeof credits.balance === "string" ? parseStrictFiniteNumber(credits.balance) : asFiniteNumber(credits.balance);
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
		const window = readRateLimitWindow(snapshot, key);
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
	if (safeMs < ONE_DAY_MS) {
		const hours = Math.ceil(safeMs / ONE_HOUR_MS);
		return `${hours} ${hours === 1 ? "hour" : "hours"}`;
	}
	const days = Math.ceil(safeMs / ONE_DAY_MS);
	return `${days} ${days === 1 ? "day" : "days"}`;
}
function formatResetDuration(resetsAtMs, nowMs) {
	const durationMs = Math.round(Math.max(ONE_SECOND_MS, resetsAtMs - nowMs) / ONE_SECOND_MS) * ONE_SECOND_MS;
	const days = Math.floor(durationMs / ONE_DAY_MS);
	const hours = Math.floor(durationMs % ONE_DAY_MS / ONE_HOUR_MS);
	const minutes = Math.floor(durationMs % ONE_HOUR_MS / ONE_MINUTE_MS);
	const seconds = Math.floor(durationMs % ONE_MINUTE_MS / ONE_SECOND_MS);
	if (days > 0) return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
	if (hours > 0) return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
	if (minutes > 0) return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
	return `${seconds}s`;
}
function formatWindowSignature(value) {
	if (!isJsonObject(value)) return "";
	return `${readNumber(value, "usedPercent") ?? readNumber(value, "used_percent") ?? ""}:${readNumber(value, "resetsAt") ?? readNumber(value, "resets_at") ?? ""}`;
}
function extractCodexRetryHint(message) {
	if (!message) return;
	const tryAgainAt = /\btry again\s+(at\s+[^.!?\n]+)(?:[.!?]|$)/iu.exec(message);
	if (tryAgainAt?.[1]) return tryAgainAt[1].trim();
	return /\btry again\s+((?:tomorrow|in\s+[^.!?\n]+)[^.!?\n]*)(?:[.!?]|$)/iu.exec(message)?.[1]?.trim();
}
function readString(record, key) {
	const value = record[key];
	return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function readNullableString(record, key) {
	return readString(record, key) ?? void 0;
}
function readNumber(record, key) {
	return asFiniteNumber(record[key]);
}
function readBoolean(record, key) {
	const value = record[key];
	return typeof value === "boolean" ? value : void 0;
}
function normalizeText(value) {
	const text = value?.trim();
	return text ? text : void 0;
}
//#endregion
//#region extensions/codex/provider.ts
/**
* Codex provider plugin and live app-server model catalog discovery.
*/
const DEFAULT_DISCOVERY_TIMEOUT_MS = 2500;
const LIVE_DISCOVERY_ENV = "OPENCLAW_CODEX_DISCOVERY_LIVE";
const MODEL_DISCOVERY_PAGE_LIMIT = 100;
const CODEX_APP_SERVER_SETUP_METHOD_ID = "app-server";
const CODEX_DEFAULT_MODEL_REF = `${CODEX_PROVIDER_ID}/${FALLBACK_CODEX_MODELS[0].id}`;
const codexCatalogLog = createSubsystemLogger("codex/catalog");
/**
* Builds the Codex provider plugin, including setup metadata, catalog discovery,
* dynamic model resolution, and prompt/thinking hooks.
*/
function buildCodexProvider(options = {}) {
	return {
		id: CODEX_PROVIDER_ID,
		label: "Codex",
		docsPath: "/providers/models",
		auth: [{
			id: CODEX_APP_SERVER_SETUP_METHOD_ID,
			label: "Codex app-server",
			hint: "Use the Codex app-server runtime and managed model catalog.",
			kind: "custom",
			wizard: {
				choiceId: CODEX_PROVIDER_ID,
				choiceLabel: "Codex app-server",
				choiceHint: "Use the Codex app-server runtime and managed model catalog.",
				assistantPriority: -40,
				groupId: CODEX_PROVIDER_ID,
				groupLabel: "Codex",
				groupHint: "Codex app-server model provider",
				onboardingScopes: ["text-inference"]
			},
			run: async () => ({
				profiles: [],
				defaultModel: CODEX_DEFAULT_MODEL_REF
			})
		}],
		catalog: {
			order: "late",
			run: async (ctx) => {
				const pluginConfig = resolvePluginConfigObject(ctx.config, "codex") ?? (ctx.config ? void 0 : options.pluginConfig);
				return await buildCodexProviderCatalog({
					env: ctx.env,
					pluginConfig,
					listModels: options.listModels
				});
			}
		},
		staticCatalog: {
			order: "late",
			run: async () => ({ provider: buildCodexProviderConfig(FALLBACK_CODEX_MODELS) })
		},
		resolveDynamicModel: (ctx) => resolveCodexDynamicModel(ctx.modelId),
		resolveSyntheticAuth: () => ({
			apiKey: CODEX_APP_SERVER_AUTH_MARKER,
			source: "codex-app-server",
			mode: "token"
		}),
		fetchUsageSnapshot: async (ctx) => {
			if (ctx.token !== "codex-app-server") return null;
			const appServer = resolveCodexAppServerRuntimeOptions({ pluginConfig: resolvePluginConfigObject(ctx.config, "codex") ?? (ctx.config ? void 0 : options.pluginConfig) });
			return buildCodexAppServerUsageSnapshot(await (options.readRateLimits ?? requestCodexAppServerRateLimitsLazy)({
				timeoutMs: ctx.timeoutMs,
				agentDir: ctx.agentDir,
				...ctx.authProfileId ? { authProfileId: ctx.authProfileId } : {},
				config: ctx.config,
				startOptions: appServer.start
			}));
		},
		resolveThinkingProfile: ({ modelId }) => ({ levels: [
			{ id: "off" },
			{ id: "minimal" },
			{ id: "low" },
			{ id: "medium" },
			{ id: "high" },
			...isKnownXHighCodexModel(modelId) ? [{ id: "xhigh" }] : []
		] }),
		resolveSystemPromptContribution: ({ config, modelId }) => resolveCodexSystemPromptContribution({
			config,
			modelId
		}),
		isModernModelRef: ({ modelId }) => isModernCodexModel(modelId)
	};
}
/**
* Builds the Codex model catalog from live app-server discovery, falling back
* to built-in model records when discovery is disabled or unavailable.
*/
async function buildCodexProviderCatalog(options = {}) {
	const config = readCodexPluginConfig(options.pluginConfig);
	const appServer = resolveCodexAppServerRuntimeOptions({ pluginConfig: options.pluginConfig });
	const timeoutMs = normalizeTimeoutMs(config.discovery?.timeoutMs);
	let discovered = [];
	if (config.discovery?.enabled !== false && !shouldSkipLiveDiscovery(options.env)) discovered = await listModelsBestEffort({
		listModels: options.listModels ?? listCodexAppServerModelsLazy,
		timeoutMs,
		startOptions: appServer.start,
		onDiscoveryFailure: options.onDiscoveryFailure
	});
	return { provider: buildCodexProviderConfig(discovered.length > 0 ? discovered : FALLBACK_CODEX_MODELS) };
}
function resolveCodexDynamicModel(modelId) {
	const id = modelId.trim();
	if (!id) return;
	const fallbackModel = FALLBACK_CODEX_MODELS.find((model) => model.id === id);
	return normalizeModelCompat({
		...buildCodexModelDefinition({
			id,
			model: id,
			inputModalities: fallbackModel?.inputModalities ?? ["text"],
			supportedReasoningEfforts: fallbackModel?.supportedReasoningEfforts ?? (shouldDefaultToReasoningModel(id) ? ["medium"] : [])
		}),
		provider: CODEX_PROVIDER_ID,
		baseUrl: CODEX_BASE_URL
	});
}
async function listModelsBestEffort(params) {
	try {
		const models = [];
		let cursor;
		do {
			const result = await params.listModels({
				timeoutMs: params.timeoutMs,
				limit: MODEL_DISCOVERY_PAGE_LIMIT,
				cursor,
				startOptions: params.startOptions,
				sharedClient: false
			});
			models.push(...result.models.filter((model) => !model.hidden));
			cursor = result.nextCursor;
		} while (cursor);
		return models;
	} catch (error) {
		params.onDiscoveryFailure?.(error);
		codexCatalogLog.debug("codex model discovery failed; using fallback catalog", { error: error instanceof Error ? error.message : String(error) });
		return [];
	}
}
async function listCodexAppServerModelsLazy(options) {
	const { listCodexAppServerModels } = await import("./models-ZrwfPZ6r.js");
	return listCodexAppServerModels(options);
}
async function requestCodexAppServerRateLimitsLazy(options) {
	const { requestCodexAppServerJson } = await import("./request-C-ixKNWB.js");
	return await requestCodexAppServerJson({
		method: "account/rateLimits/read",
		timeoutMs: options.timeoutMs,
		agentDir: options.agentDir,
		...options.authProfileId ? { authProfileId: options.authProfileId } : {},
		config: options.config,
		startOptions: options.startOptions,
		isolated: true
	});
}
function normalizeTimeoutMs(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : DEFAULT_DISCOVERY_TIMEOUT_MS;
}
function shouldSkipLiveDiscovery(env = process.env) {
	const override = env[LIVE_DISCOVERY_ENV]?.trim().toLowerCase();
	if (override === "0" || override === "false") return true;
	return Boolean(env.VITEST) && override !== "1";
}
function shouldDefaultToReasoningModel(modelId) {
	const lower = modelId.toLowerCase();
	return lower.startsWith("gpt-5") || lower.startsWith("o1") || lower.startsWith("o3") || lower.startsWith("o4");
}
function isKnownXHighCodexModel(modelId) {
	const lower = modelId.trim().toLowerCase();
	return lower.startsWith("gpt-5") || lower.startsWith("o3") || lower.startsWith("o4") || lower.includes("codex");
}
/**
* Returns true for Codex models that use the modern reasoning effort enum and
* reject the legacy CLI `minimal` default.
*/
function isModernCodexModel(modelId) {
	const lower = modelId.trim().toLowerCase();
	return lower === "gpt-5.5" || lower === "gpt-5.4" || lower === "gpt-5.4-mini" || lower === "gpt-5.3-codex-spark";
}
//#endregion
export { hasCodexRateLimitSnapshots as a, summarizeCodexAccountRateLimits as c, formatCodexUsageLimitErrorMessage as i, summarizeCodexAccountUsage as l, buildCodexProviderCatalog as n, resolveCodexUsageLimitResetAtMs as o, isModernCodexModel as r, shouldRefreshCodexRateLimitsForUsageLimitMessage as s, buildCodexProvider as t, summarizeCodexRateLimits as u };
