import { b as parseFiniteNumber, o as asDateTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import "./utils-aKqR_F_U.mjs";
import { n as readTrimmedStringAlias } from "./string-readers-Dkx3Z36w.mjs";
import { r as clampPercent, t as PROVIDER_LABELS } from "./provider-usage.shared-DA20vxhR.mjs";
import { i as fetchUsageJson, t as buildUsageErrorSnapshot } from "./provider-usage.fetch.shared-Bwo0b_7x.mjs";
//#region src/infra/provider-usage.fetch.minimax.ts
const DEFAULT_MINIMAX_USAGE_ORIGIN = "https://api.minimaxi.com";
const MINIMAX_USAGE_PATH = "/v1/token_plan/remains";
const RESET_KEYS = [
	"reset_at",
	"resetAt",
	"reset_time",
	"resetTime",
	"next_reset_at",
	"nextResetAt",
	"next_reset_time",
	"nextResetTime",
	"expires_at",
	"expiresAt",
	"expire_at",
	"expireAt",
	"end_time",
	"endTime",
	"window_end",
	"windowEnd"
];
const PERCENT_KEYS = [
	"used_percent",
	"usedPercent",
	"used_rate",
	"usage_rate",
	"used_ratio",
	"usage_ratio",
	"usedRatio",
	"usageRatio"
];
const REMAINING_PERCENT_KEYS = ["usage_percent", "usagePercent"];
const CURRENT_INTERVAL_TOTAL_KEYS = ["current_interval_total_count", "currentIntervalTotalCount"];
const CURRENT_INTERVAL_REMAINING_KEYS = ["current_interval_usage_count", "currentIntervalUsageCount"];
const CURRENT_INTERVAL_REMAINING_PERCENT_KEYS = ["current_interval_remaining_percent", "currentIntervalRemainingPercent"];
const CURRENT_INTERVAL_STATUS_KEYS = ["current_interval_status", "currentIntervalStatus"];
const CURRENT_WEEKLY_TOTAL_KEYS = ["current_weekly_total_count", "currentWeeklyTotalCount"];
const CURRENT_WEEKLY_REMAINING_KEYS = ["current_weekly_usage_count", "currentWeeklyUsageCount"];
const CURRENT_WEEKLY_REMAINING_PERCENT_KEYS = ["current_weekly_remaining_percent", "currentWeeklyRemainingPercent"];
const CURRENT_WEEKLY_STATUS_KEYS = ["current_weekly_status", "currentWeeklyStatus"];
const MODEL_REMAINING_PERCENT_KEYS = [...CURRENT_INTERVAL_REMAINING_PERCENT_KEYS, ...CURRENT_WEEKLY_REMAINING_PERCENT_KEYS];
const NO_USAGE_KEYS = [];
const USED_KEYS = [
	"used",
	"usage",
	"used_amount",
	"usedAmount",
	"used_tokens",
	"usedTokens",
	"used_quota",
	"usedQuota",
	"used_times",
	"usedTimes",
	"prompt_used",
	"promptUsed",
	"used_prompt",
	"usedPrompt",
	"prompts_used",
	"promptsUsed",
	"consumed"
];
const TOTAL_KEYS = [
	"total",
	"total_amount",
	"totalAmount",
	"total_tokens",
	"totalTokens",
	"total_quota",
	"totalQuota",
	"total_times",
	"totalTimes",
	"prompt_total",
	"promptTotal",
	"total_prompt",
	"totalPrompt",
	"prompt_limit",
	"promptLimit",
	"limit_prompt",
	"limitPrompt",
	"prompts_total",
	"promptsTotal",
	"total_prompts",
	"totalPrompts",
	"current_interval_total_count",
	"currentIntervalTotalCount",
	"current_weekly_total_count",
	"currentWeeklyTotalCount",
	"limit",
	"quota",
	"quota_limit",
	"quotaLimit",
	"max"
];
const REMAINING_KEYS = [
	"remain",
	"remaining",
	"remain_amount",
	"remainingAmount",
	"remaining_amount",
	"remain_tokens",
	"remainingTokens",
	"remaining_tokens",
	"remain_quota",
	"remainingQuota",
	"remaining_quota",
	"remain_times",
	"remainingTimes",
	"remaining_times",
	"prompt_remain",
	"promptRemain",
	"remain_prompt",
	"remainPrompt",
	"prompt_remaining",
	"promptRemaining",
	"remaining_prompt",
	"remainingPrompt",
	"prompts_remaining",
	"promptsRemaining",
	"prompt_left",
	"promptLeft",
	"prompts_left",
	"promptsLeft",
	"left",
	"current_interval_usage_count",
	"currentIntervalUsageCount",
	"current_weekly_usage_count",
	"currentWeeklyUsageCount"
];
const PLAN_KEYS = [
	"plan",
	"plan_name",
	"planName",
	"product",
	"tier"
];
const WINDOW_HOUR_KEYS = [
	"window_hours",
	"windowHours",
	"duration_hours",
	"durationHours",
	"hours"
];
const WINDOW_MINUTE_KEYS = [
	"window_minutes",
	"windowMinutes",
	"duration_minutes",
	"durationMinutes",
	"minutes"
];
function pickNumber(record, keys) {
	for (const key of keys) {
		const parsed = parseFiniteNumber(record[key]);
		if (parsed !== void 0) return parsed;
	}
}
function pickString(record, keys) {
	return readTrimmedStringAlias(record, keys);
}
function parseEpoch(value) {
	if (typeof value === "number" && Number.isFinite(value)) {
		const timestampMs = value < 0xe8d4a51000 ? Math.floor(value * 1e3) : Math.floor(value);
		return asDateTimestampMs(timestampMs);
	}
	if (typeof value === "string" && value.trim()) {
		const numeric = parseFiniteNumber(value);
		if (numeric !== void 0) return parseEpoch(numeric);
		return asDateTimestampMs(Date.parse(value));
	}
}
function hasAny(record, keys) {
	return keys.some((key) => key in record);
}
function scoreUsageRecord(record) {
	let score = 0;
	if (hasAny(record, PERCENT_KEYS) || hasAny(record, MODEL_REMAINING_PERCENT_KEYS)) score += 4;
	if (hasAny(record, TOTAL_KEYS)) score += 3;
	if (hasAny(record, USED_KEYS) || hasAny(record, REMAINING_KEYS)) score += 2;
	if (hasAny(record, RESET_KEYS)) score += 1;
	if (hasAny(record, PLAN_KEYS)) score += 1;
	return score;
}
function pickUsageRecord(root) {
	const MAX_SCAN_DEPTH = 4;
	const MAX_SCAN_NODES = 60;
	const queue = [{
		value: root,
		depth: 0
	}];
	const seen = /* @__PURE__ */ new Set();
	let best;
	let bestScore = 0;
	for (const { value, depth } of queue) {
		if (isRecord(value)) {
			if (seen.has(value)) continue;
			seen.add(value);
			const score = scoreUsageRecord(value);
			if (score > bestScore) {
				const usedPercent = deriveUsedPercent(value);
				if (usedPercent !== null) {
					best = {
						record: value,
						usedPercent
					};
					bestScore = score;
				}
			}
		}
		if (depth >= MAX_SCAN_DEPTH || queue.length >= MAX_SCAN_NODES) continue;
		for (const nested of Array.isArray(value) ? value : Object.values(value)) {
			if (queue.length >= MAX_SCAN_NODES) break;
			if (isRecord(nested) || Array.isArray(nested)) queue.push({
				value: nested,
				depth: depth + 1
			});
		}
	}
	return best;
}
function deriveWindowLabelFromTimestamps(record) {
	const startTime = parseEpoch(record.start_time ?? record.startTime);
	const endTime = parseEpoch(record.end_time ?? record.endTime);
	if (startTime !== void 0 && endTime !== void 0 && endTime > startTime) {
		const durationHours = (endTime - startTime) / 36e5;
		if (durationHours >= 1 && Number.isFinite(durationHours)) return `${Math.round(durationHours)}h`;
		const durationMinutes = Math.round((endTime - startTime) / 6e4);
		if (durationMinutes > 0) return `${durationMinutes}m`;
	}
}
function deriveWindowLabel(payload) {
	const hours = pickNumber(payload, WINDOW_HOUR_KEYS);
	if (hours && Number.isFinite(hours)) return `${hours}h`;
	const minutes = pickNumber(payload, WINDOW_MINUTE_KEYS);
	if (minutes && Number.isFinite(minutes)) return `${minutes}m`;
	const fromTimestamps = deriveWindowLabelFromTimestamps(payload);
	if (fromTimestamps) return fromTimestamps;
	return "5h";
}
function deriveUsedPercent(payload, keys = {}) {
	const remainingPercentRaw = pickNumber(payload, keys.remainingPercent ?? REMAINING_PERCENT_KEYS);
	const remainingPercentUnit = keys.remainingPercentUnit ?? "ratio-or-percent";
	const fromRemainingPercent = remainingPercentRaw === void 0 ? null : clampPercent(100 - clampPercent(remainingPercentUnit === "ratio-or-percent" && remainingPercentRaw <= 1 ? remainingPercentRaw * 100 : remainingPercentRaw));
	if (keys.preferRemainingPercent === true && fromRemainingPercent !== null) return fromRemainingPercent;
	const total = pickNumber(payload, keys.total ?? TOTAL_KEYS);
	let used = pickNumber(payload, keys.used ?? USED_KEYS);
	const remaining = pickNumber(payload, keys.remaining ?? REMAINING_KEYS);
	if (used === void 0 && remaining !== void 0 && total !== void 0) used = total - remaining;
	const fromCounts = total && total > 0 && used !== void 0 && Number.isFinite(used) ? clampPercent(used / total * 100) : null;
	if (fromCounts !== null) return fromCounts;
	const percentRaw = pickNumber(payload, keys.percent ?? PERCENT_KEYS);
	if (percentRaw !== void 0) return clampPercent(percentRaw <= 1 ? percentRaw * 100 : percentRaw);
	if (fromRemainingPercent !== null) return fromRemainingPercent;
	return null;
}
function hasModelUsageEvidence(record) {
	return hasAny(record, MODEL_REMAINING_PERCENT_KEYS) || (pickNumber(record, CURRENT_INTERVAL_TOTAL_KEYS) ?? 0) > 0 || (pickNumber(record, CURRENT_WEEKLY_TOTAL_KEYS) ?? 0) > 0;
}
function isChatModelUsageRecord(record) {
	const name = normalizeLowercaseStringOrEmpty(typeof record.model_name === "string" ? record.model_name : "");
	return name === "general" || name.startsWith("minimax-m");
}
function isBoundedMinimaxStatus(status) {
	return status === 1 || status === 2;
}
function isBoundedModelUsageRecord(record) {
	return isBoundedMinimaxStatus(pickNumber(record, CURRENT_INTERVAL_STATUS_KEYS)) || isBoundedMinimaxStatus(pickNumber(record, CURRENT_WEEKLY_STATUS_KEYS));
}
function pickChatModelRemains(modelRemains) {
	const records = modelRemains.filter(isRecord).filter(hasModelUsageEvidence);
	if (records.length === 0) return;
	return records.find(isChatModelUsageRecord) ?? records.find(isBoundedModelUsageRecord) ?? records[0];
}
function pickEpoch(record, keys) {
	for (const key of keys) {
		const parsed = parseEpoch(record[key]);
		if (parsed !== void 0) return parsed;
	}
}
function shouldExposeMinimaxWindow(record, statusKeys) {
	return pickNumber(record, statusKeys) !== 3;
}
function deriveMinimaxModelWindows(record) {
	const windows = [];
	const currentUsedPercent = deriveUsedPercent(record, {
		total: CURRENT_INTERVAL_TOTAL_KEYS,
		used: NO_USAGE_KEYS,
		remaining: CURRENT_INTERVAL_REMAINING_KEYS,
		percent: NO_USAGE_KEYS,
		remainingPercent: CURRENT_INTERVAL_REMAINING_PERCENT_KEYS,
		remainingPercentUnit: "percent",
		preferRemainingPercent: true
	});
	if (currentUsedPercent !== null && shouldExposeMinimaxWindow(record, CURRENT_INTERVAL_STATUS_KEYS)) windows.push({
		label: deriveWindowLabel(record),
		usedPercent: currentUsedPercent,
		resetAt: pickEpoch(record, ["end_time", "endTime"])
	});
	const weeklyUsedPercent = deriveUsedPercent(record, {
		total: CURRENT_WEEKLY_TOTAL_KEYS,
		used: NO_USAGE_KEYS,
		remaining: CURRENT_WEEKLY_REMAINING_KEYS,
		percent: NO_USAGE_KEYS,
		remainingPercent: CURRENT_WEEKLY_REMAINING_PERCENT_KEYS,
		remainingPercentUnit: "percent",
		preferRemainingPercent: true
	});
	if (weeklyUsedPercent !== null && shouldExposeMinimaxWindow(record, CURRENT_WEEKLY_STATUS_KEYS)) windows.push({
		label: "Week",
		usedPercent: weeklyUsedPercent,
		resetAt: pickEpoch(record, ["weekly_end_time", "weeklyEndTime"])
	});
	return {
		recognized: currentUsedPercent !== null || weeklyUsedPercent !== null,
		windows
	};
}
function resolveMinimaxUsageUrl(baseUrl) {
	const trimmed = baseUrl?.trim();
	if (!trimmed) return `${DEFAULT_MINIMAX_USAGE_ORIGIN}${MINIMAX_USAGE_PATH}`;
	try {
		const parsed = new URL(trimmed);
		if (parsed.protocol === "http:" || parsed.protocol === "https:") return `${parsed.origin}${MINIMAX_USAGE_PATH}`;
	} catch {}
	return `${DEFAULT_MINIMAX_USAGE_ORIGIN}${MINIMAX_USAGE_PATH}`;
}
async function fetchMinimaxUsage(apiKey, timeoutMs, fetchFn, options) {
	const parsed = await fetchUsageJson({
		provider: "minimax",
		url: resolveMinimaxUsageUrl(options?.baseUrl),
		init: {
			method: "GET",
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json",
				"MM-API-Source": "OpenClaw"
			}
		},
		timeoutMs,
		fetchFn,
		malformedResponseError: "Invalid JSON"
	});
	if (!parsed.ok) return parsed.snapshot;
	const data = parsed.data;
	if (!isRecord(data)) return buildUsageErrorSnapshot("minimax", "Invalid JSON");
	const baseResp = isRecord(data.base_resp) ? data.base_resp : void 0;
	if (baseResp && typeof baseResp.status_code === "number" && baseResp.status_code !== 0) return buildUsageErrorSnapshot("minimax", baseResp.status_msg?.trim() || "API error");
	const payload = isRecord(data.data) ? data.data : data;
	const modelRemains = Array.isArray(payload.model_remains) ? payload.model_remains : null;
	const chatRemains = modelRemains ? pickChatModelRemains(modelRemains) : void 0;
	const usageSource = chatRemains ?? payload;
	let usageRecord = usageSource;
	const modelUsage = chatRemains ? deriveMinimaxModelWindows(chatRemains) : void 0;
	let windows = modelUsage?.windows ?? [];
	if (modelUsage?.recognized !== true) {
		const selected = pickUsageRecord(usageSource);
		if (selected) usageRecord = selected.record;
		const usedPercent = selected?.usedPercent ?? deriveUsedPercent(usageSource);
		if (usedPercent === null) return buildUsageErrorSnapshot("minimax", "Unsupported response shape");
		const resetAt = pickEpoch(usageRecord, RESET_KEYS) ?? pickEpoch(payload, RESET_KEYS);
		windows = [{
			label: deriveWindowLabel(usageRecord),
			usedPercent,
			resetAt
		}];
	}
	const modelName = chatRemains && typeof chatRemains.model_name === "string" ? chatRemains.model_name : void 0;
	const plan = pickString(usageRecord, PLAN_KEYS) ?? pickString(payload, PLAN_KEYS) ?? (modelName ? `Coding Plan · ${modelName}` : void 0);
	return {
		provider: "minimax",
		displayName: PROVIDER_LABELS.minimax,
		windows,
		plan
	};
}
//#endregion
export { fetchMinimaxUsage };
