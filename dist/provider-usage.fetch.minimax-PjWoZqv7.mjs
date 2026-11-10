import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { b as parseFiniteNumber, o as asDateTimestampMs } from "./number-coercion-CkhMiRw8.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import "./utils-gjJ-tD2q.mjs";
import { n as readTrimmedStringAlias } from "./string-readers-V5CfgPTP.mjs";
import { r as clampPercent, t as PROVIDER_LABELS } from "./provider-usage.shared-CksXGFVr.mjs";
import { i as fetchUsageJson, t as buildUsageErrorSnapshot } from "./provider-usage.fetch.shared-UQo0bRd5.mjs";
//#region src/infra/provider-usage.fetch.minimax.ts
const DEFAULT_MINIMAX_USAGE_ORIGIN = "https://api.minimaxi.com";
const MINIMAX_USAGE_PATH = "/v1/token_plan/remains";
function snakeAndCamelFields(...names) {
	return names.flatMap((name) => {
		const camel = name.replace(/_([a-z])/g, (_match, letter) => letter.toUpperCase());
		return camel === name ? [name] : [name, camel];
	});
}
const RESET_KEYS = snakeAndCamelFields("reset_at", "reset_time", "next_reset_at", "next_reset_time", "expires_at", "expire_at", "end_time", "window_end");
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
function modelWindowFields(period, reset, label) {
	return {
		label,
		total: snakeAndCamelFields(`current_${period}_total_count`),
		remaining: snakeAndCamelFields(`current_${period}_usage_count`),
		remainingPercent: snakeAndCamelFields(`current_${period}_remaining_percent`),
		status: snakeAndCamelFields(`current_${period}_status`),
		reset: snakeAndCamelFields(reset)
	};
}
const INTERVAL_WINDOW = modelWindowFields("interval", "end_time");
const WEEKLY_WINDOW = modelWindowFields("weekly", "weekly_end_time", "Week");
const MODEL_REMAINING_PERCENT_KEYS = [...INTERVAL_WINDOW.remainingPercent, ...WEEKLY_WINDOW.remainingPercent];
const USED_KEYS = snakeAndCamelFields("used", "usage", "used_amount", "used_tokens", "used_quota", "used_times", "prompt_used", "used_prompt", "prompts_used", "consumed");
const TOTAL_KEYS = [
	...snakeAndCamelFields("total", "total_amount", "total_tokens", "total_quota", "total_times", "prompt_total", "total_prompt", "prompt_limit", "limit_prompt", "prompts_total", "total_prompts"),
	...INTERVAL_WINDOW.total,
	...WEEKLY_WINDOW.total,
	...snakeAndCamelFields("limit", "quota", "quota_limit", "max")
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
	...snakeAndCamelFields("prompt_remain", "remain_prompt", "prompt_remaining", "remaining_prompt", "prompts_remaining", "prompt_left", "prompts_left"),
	"left",
	...INTERVAL_WINDOW.remaining,
	...WEEKLY_WINDOW.remaining
];
const PLAN_KEYS = [
	"plan",
	"plan_name",
	"planName",
	"product",
	"tier"
];
const WINDOW_HOUR_KEYS = snakeAndCamelFields("window_hours", "duration_hours", "hours");
const WINDOW_MINUTE_KEYS = snakeAndCamelFields("window_minutes", "duration_minutes", "minutes");
function pickNumber(record, keys, parse = parseFiniteNumber) {
	for (const key of keys) {
		const parsed = parse(record[key]);
		if (parsed !== void 0) return parsed;
	}
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
	let best;
	let bestScore = 0;
	for (const { value, depth } of queue) {
		if (isRecord(value)) {
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
function deriveWindowLabel(payload) {
	const hours = pickNumber(payload, WINDOW_HOUR_KEYS);
	if (hours) return `${hours}h`;
	const minutes = pickNumber(payload, WINDOW_MINUTE_KEYS);
	if (minutes) return `${minutes}m`;
	const startTime = parseEpoch(payload.start_time ?? payload.startTime);
	const endTime = parseEpoch(payload.end_time ?? payload.endTime);
	if (startTime !== void 0 && endTime !== void 0 && endTime > startTime) {
		const durationHours = (endTime - startTime) / 36e5;
		if (durationHours >= 1) return `${Math.round(durationHours)}h`;
		const durationMinutes = Math.round((endTime - startTime) / 6e4);
		if (durationMinutes > 0) return `${durationMinutes}m`;
	}
	return "5h";
}
function deriveUsedPercent(payload) {
	const total = pickNumber(payload, TOTAL_KEYS);
	let used = pickNumber(payload, USED_KEYS);
	const remaining = pickNumber(payload, REMAINING_KEYS);
	if (used === void 0 && remaining !== void 0 && total !== void 0) used = total - remaining;
	if (total && total > 0 && used !== void 0 && Number.isFinite(used)) return clampPercent(used / total * 100);
	const percentRaw = pickNumber(payload, PERCENT_KEYS);
	if (percentRaw !== void 0) return clampPercent(percentRaw <= 1 ? percentRaw * 100 : percentRaw);
	const remainingPercent = pickNumber(payload, REMAINING_PERCENT_KEYS);
	return remainingPercent === void 0 ? null : 100 - clampPercent(remainingPercent <= 1 ? remainingPercent * 100 : remainingPercent);
}
function pickChatModelRemains(modelRemains) {
	const records = modelRemains.filter(isRecord).filter((record) => hasAny(record, MODEL_REMAINING_PERCENT_KEYS) || (pickNumber(record, INTERVAL_WINDOW.total) ?? 0) > 0 || (pickNumber(record, WEEKLY_WINDOW.total) ?? 0) > 0);
	return records.find((record) => {
		const name = normalizeLowercaseStringOrEmpty(record.model_name);
		return name === "general" || name.startsWith("minimax-m");
	}) ?? records.find((record) => [INTERVAL_WINDOW.status, WEEKLY_WINDOW.status].some((keys) => {
		const status = pickNumber(record, keys);
		return status === 1 || status === 2;
	})) ?? records[0];
}
function deriveMinimaxModelWindows(record) {
	const windows = [];
	let recognized = false;
	for (const window of [INTERVAL_WINDOW, WEEKLY_WINDOW]) {
		const remainingPercent = pickNumber(record, window.remainingPercent);
		const total = pickNumber(record, window.total);
		const remaining = pickNumber(record, window.remaining);
		const used = total !== void 0 && remaining !== void 0 ? total - remaining : void 0;
		const usedPercent = remainingPercent !== void 0 ? 100 - clampPercent(remainingPercent) : total && total > 0 && used !== void 0 && Number.isFinite(used) ? clampPercent(used / total * 100) : null;
		if (usedPercent === null) continue;
		recognized = true;
		if (pickNumber(record, window.status) === 3) continue;
		windows.push({
			label: window.label ?? deriveWindowLabel(record),
			usedPercent,
			resetAt: pickNumber(record, window.reset, parseEpoch)
		});
	}
	return {
		recognized,
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
		const resetAt = pickNumber(usageRecord, RESET_KEYS, parseEpoch) ?? pickNumber(payload, RESET_KEYS, parseEpoch);
		windows = [{
			label: deriveWindowLabel(usageRecord),
			usedPercent,
			resetAt
		}];
	}
	const modelName = chatRemains && typeof chatRemains.model_name === "string" ? chatRemains.model_name : void 0;
	const plan = readTrimmedStringAlias(usageRecord, PLAN_KEYS) ?? readTrimmedStringAlias(payload, PLAN_KEYS) ?? (modelName ? `Coding Plan · ${modelName}` : void 0);
	return {
		provider: "minimax",
		displayName: PROVIDER_LABELS.minimax,
		windows,
		plan
	};
}
//#endregion
export { fetchMinimaxUsage };
