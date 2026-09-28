import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as createLazyRuntimeMethod } from "./lazy-runtime-BPNHa36e.mjs";
import { p as readProviderJsonObjectResponse } from "./provider-http-errors-CTY_-ABT.mjs";
import "./provider-usage.shared-DA20vxhR.mjs";
import "./provider-usage.fetch.shared-Bwo0b_7x.mjs";
//#region src/infra/provider-usage.admin.ts
const DAY_MS = 864e5;
const MAX_USAGE_PAGES = 100;
function cleanProviderUsageCredential(raw) {
	const trimmed = raw?.replaceAll(/[\r\n]/g, "").trim();
	if (!trimmed) return;
	return (trimmed.startsWith("\"") && trimmed.endsWith("\"") || trimmed.startsWith("'") && trimmed.endsWith("'") ? trimmed.slice(1, -1).trim() : trimmed) || void 0;
}
function encodeProviderUsageAdminToken(prefix, token) {
	return `${prefix}${JSON.stringify({ token })}`;
}
function decodeProviderUsageAdminToken(prefix, raw) {
	if (!raw.startsWith(prefix)) return;
	try {
		const token = asProviderUsageObject(JSON.parse(raw.slice(prefix.length)))?.token;
		return typeof token === "string" && token.trim() ? token.trim() : void 0;
	} catch {
		return;
	}
}
function asProviderUsageObject(value) {
	return asOptionalRecord(value);
}
function parseProviderUsageNumber(value) {
	const parsed = typeof value === "number" ? value : typeof value === "string" && value.trim() ? Number(value) : NaN;
	return Number.isFinite(parsed) ? parsed : void 0;
}
function parseProviderUsageNonNegativeNumber(value) {
	const parsed = parseProviderUsageNumber(value);
	return parsed !== void 0 && parsed >= 0 ? parsed : void 0;
}
function parseProviderUsageNonNegativeInteger(value) {
	const parsed = parseProviderUsageNumber(value);
	return parsed === void 0 ? 0 : Math.max(0, Math.trunc(parsed));
}
function resolveProviderUsageDisplayName(value, fallback) {
	return typeof value === "string" && value.trim() ? value.trim() : fallback;
}
function resolveProviderUsageDailyPeriod(params) {
	const periodDays = Math.max(1, Math.min(31, Math.trunc(params.periodDays ?? params.defaultPeriodDays)));
	const current = new Date(params.now);
	const todayStart = Date.UTC(current.getUTCFullYear(), current.getUTCMonth(), current.getUTCDate());
	return {
		periodDays,
		startMs: todayStart - (periodDays - 1) * DAY_MS,
		endMs: todayStart + DAY_MS
	};
}
async function fetchProviderUsagePages(params) {
	const data = [];
	const seenPages = /* @__PURE__ */ new Set();
	let page;
	for (let pageCount = 1; pageCount <= MAX_USAGE_PAGES; pageCount += 1) {
		const request = params.buildRequest(page);
		let response;
		try {
			response = await params.fetchFn(request.url, {
				headers: request.headers,
				signal: AbortSignal.timeout(params.timeoutMs)
			});
		} catch {
			return { ok: false };
		}
		if (!response.ok) {
			await response.body?.cancel().catch(() => void 0);
			return {
				ok: false,
				status: response.status
			};
		}
		let payload;
		try {
			payload = await readProviderJsonObjectResponse(response, params.responseLabel, {
				maxBytes: params.responseMaxBytes,
				chunkTimeoutMs: params.timeoutMs,
				onIdleTimeout: ({ chunkTimeoutMs }) => /* @__PURE__ */ new Error(`${params.responseLabel} response stalled for ${chunkTimeoutMs}ms`)
			});
		} catch {
			return { ok: false };
		}
		if (!Array.isArray(payload.data)) return { ok: false };
		data.push(...payload.data);
		if (payload.has_more !== true) return {
			ok: true,
			data
		};
		const nextPage = typeof payload.next_page === "string" && payload.next_page.trim() ? payload.next_page.trim() : void 0;
		if (!nextPage || seenPages.has(nextPage)) return { ok: false };
		seenPages.add(nextPage);
		page = nextPage;
	}
	return { ok: false };
}
function createProviderUsageDailyAccumulator(date, includeRequests = false) {
	return {
		date,
		amount: 0,
		...includeRequests ? { requests: 0 } : {},
		inputTokens: 0,
		cacheReadTokens: 0,
		cacheWriteTokens: 0,
		outputTokens: 0,
		totalTokens: 0,
		categories: /* @__PURE__ */ new Map(),
		models: /* @__PURE__ */ new Map()
	};
}
function mergeModelUsage(models, name, usage) {
	const current = models.get(name) ?? {
		name,
		...usage.requests === void 0 ? {} : { requests: 0 },
		inputTokens: 0,
		cacheReadTokens: 0,
		cacheWriteTokens: 0,
		outputTokens: 0,
		totalTokens: 0
	};
	if (usage.requests !== void 0) current.requests = (current.requests ?? 0) + usage.requests;
	current.inputTokens += usage.inputTokens;
	current.cacheReadTokens += usage.cacheReadTokens;
	current.cacheWriteTokens += usage.cacheWriteTokens;
	current.outputTokens += usage.outputTokens;
	current.totalTokens += usage.totalTokens;
	models.set(name, current);
}
function addProviderUsageModel(accumulator, name, usage) {
	mergeModelUsage(accumulator.models, name, usage);
}
function buildProviderUsageHistorySnapshot(params) {
	const categories = /* @__PURE__ */ new Map();
	const models = /* @__PURE__ */ new Map();
	const daily = [...params.daily].toSorted((a, b) => a.date.localeCompare(b.date)).map((entry) => {
		for (const [name, amount] of entry.categories) categories.set(name, (categories.get(name) ?? 0) + amount);
		for (const model of entry.models.values()) mergeModelUsage(models, model.name, model);
		const { categories: _categories, models: _models, ...day } = entry;
		return day;
	});
	const amount = daily.reduce((total, day) => total + day.amount, 0);
	const requests = daily.reduce((total, day) => total + (day.requests ?? 0), 0);
	const totalTokens = daily.reduce((total, day) => total + day.totalTokens, 0);
	return {
		provider: params.provider,
		displayName: params.displayName,
		windows: [],
		plan: params.plan,
		billing: [{
			type: "spend",
			label: `${params.periodDays}-day API spend`,
			amount,
			unit: params.unit,
			period: `${params.periodDays}d`
		}],
		costHistory: {
			unit: params.unit,
			periodDays: params.periodDays,
			...params.scope ? { scope: params.scope } : {},
			daily,
			models: [...models.values()].toSorted((a, b) => b.totalTokens - a.totalTokens || a.name.localeCompare(b.name)),
			categories: [...categories.entries()].map(([name, categoryAmount]) => ({
				name,
				amount: categoryAmount
			})).toSorted((a, b) => b.amount - a.amount || a.name.localeCompare(b.name))
		},
		summary: params.formatSummary({
			requests,
			totalTokens
		})
	};
}
//#endregion
//#region src/plugin-sdk/provider-usage.ts
const fetchClaudeUsage = createLazyRuntimeMethod(() => import("./provider-usage.fetch.claude-DZS4vinl.mjs"), (runtime) => runtime.fetchClaudeUsage);
const fetchCodexUsage = createLazyRuntimeMethod(() => import("./provider-usage.fetch.codex-Dl_GNT10.mjs"), (runtime) => runtime.fetchCodexUsage);
const fetchDeepSeekUsage = createLazyRuntimeMethod(() => import("./provider-usage.fetch.deepseek-DGoE-Jy4.mjs"), (runtime) => runtime.fetchDeepSeekUsage);
const fetchGeminiUsage = createLazyRuntimeMethod(() => import("./provider-usage.fetch.gemini-BQKJiOqV.mjs"), (runtime) => runtime.fetchGeminiUsage);
const fetchMinimaxUsage = createLazyRuntimeMethod(() => import("./provider-usage.fetch.minimax-hBcXCsCP.mjs"), (runtime) => runtime.fetchMinimaxUsage);
const fetchZaiUsage = createLazyRuntimeMethod(() => import("./provider-usage.fetch.zai-BktO-4cd.mjs"), (runtime) => runtime.fetchZaiUsage);
//#endregion
export { parseProviderUsageNumber as _, fetchMinimaxUsage as a, asProviderUsageObject as c, createProviderUsageDailyAccumulator as d, decodeProviderUsageAdminToken as f, parseProviderUsageNonNegativeNumber as g, parseProviderUsageNonNegativeInteger as h, fetchGeminiUsage as i, buildProviderUsageHistorySnapshot as l, fetchProviderUsagePages as m, fetchCodexUsage as n, fetchZaiUsage as o, encodeProviderUsageAdminToken as p, fetchDeepSeekUsage as r, addProviderUsageModel as s, fetchClaudeUsage as t, cleanProviderUsageCredential as u, resolveProviderUsageDailyPeriod as v, resolveProviderUsageDisplayName as y };
