import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { s as asFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as sha256Base64Url } from "./crypto-digest-y6oZN-_F.mjs";
import { i as decodeUsageCostRollupEnvelope, n as canUseUsageCostRollupForPartial, o as isUsageCostRollupFresh, r as decodeUsageCostRollup } from "./session-cost-usage-rollup-codec-BkTlisOD.mjs";
import { c as hasRecordedUsageCost, u as normalizeUsage } from "./usage-BqbJmOEZ.mjs";
import { l as scanSessionTranscriptTree } from "./transcript-tree-D61jhi_i.mjs";
import { t as calculateUsageCost } from "./usage-cost-Va5dwVFW.mjs";
import "./src-D3H6pm7W.mjs";
import { t as projectTranscriptNavigationFields } from "./transcript-navigation-fields-BLtx25WG.mjs";
import { n as selectVisibleTranscriptEvents } from "./transcript-visible-events-Ct6pwJvk.mjs";
import { n as isToolCallContentType } from "./tool-content-CCdCNdqN.mjs";
import { t as createTimeZoneDayKeyFormatter } from "./format-datetime-DS_okl6M.mjs";
import { r as createEmptyCostUsageTotals } from "./session-cost-usage-totals-Blmg-HFT.mjs";
import { a as createSessionUsageRollupData, n as appendSessionUsageRollupContribution, r as buildSessionCostSummaryFromRollup, t as addRollupToCostUsageSummary } from "./session-cost-usage-rollup-EJwp1CTx.mjs";
//#region src/infra/session-cost-usage-projection.ts
const formatUtcDayKey = (date) => `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
const createUsageDayKeyFormatter = (dayBucket) => {
	if (dayBucket?.mode === "utc-offset") return (date) => formatUtcDayKey(new Date(date.getTime() + dayBucket.utcOffsetMinutes * 60 * 1e3));
	const timeZone = dayBucket?.mode === "time-zone" ? dayBucket.timeZone : Intl.DateTimeFormat().resolvedOptions().timeZone;
	return createTimeZoneDayKeyFormatter(timeZone);
};
const MAX_ZERO_FILL_DAYS = 366;
const parseDayKeyToUtcMs = (dayKey) => {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dayKey);
	if (!match) return null;
	const year = Number(match[1]);
	const monthIdx = Number(match[2]) - 1;
	const day = Number(match[3]);
	const dayMs = Date.UTC(year, monthIdx, day);
	const date = new Date(dayMs);
	return date.getUTCFullYear() === year && date.getUTCMonth() === monthIdx && date.getUTCDate() === day ? dayMs : null;
};
const fillMissingDays = (dailyMap, startMs, endMs, formatDayKey) => {
	if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs < startMs) return;
	const dayMs = 864e5;
	const startKey = formatDayKey(new Date(startMs));
	const endKey = formatDayKey(new Date(endMs));
	const startDayMs = parseDayKeyToUtcMs(startKey);
	const endDayMs = parseDayKeyToUtcMs(endKey);
	if (startDayMs === null || endDayMs === null) {
		if (!dailyMap.has(startKey)) dailyMap.set(startKey, createEmptyCostUsageTotals());
		if (!dailyMap.has(endKey)) dailyMap.set(endKey, createEmptyCostUsageTotals());
		return;
	}
	if (Math.floor((endDayMs - startDayMs) / dayMs) + 1 > MAX_ZERO_FILL_DAYS) return;
	for (let cursorMs = startDayMs; cursorMs <= endDayMs; cursorMs += dayMs) {
		const key = formatUtcDayKey(new Date(cursorMs));
		if (!dailyMap.has(key)) dailyMap.set(key, createEmptyCostUsageTotals());
	}
	if (!dailyMap.has(endKey)) dailyMap.set(endKey, createEmptyCostUsageTotals());
};
const countCalendarDays = (startMs, endMs, formatDayKey) => {
	const startDayMs = parseDayKeyToUtcMs(formatDayKey(new Date(startMs)));
	const endDayMs = parseDayKeyToUtcMs(formatDayKey(new Date(endMs)));
	if (startDayMs === null || endDayMs === null || endDayMs < startDayMs) return Math.ceil((endMs - startMs) / 864e5) + 1;
	return Math.floor((endDayMs - startDayMs) / 864e5) + 1;
};
function createRollupProjectionReader(params) {
	let latestScan = 0;
	const readEnvelope = (row) => {
		const envelope = row ? decodeUsageCostRollupEnvelope(row.valueJson, params.pricingFingerprint) : void 0;
		if (envelope) latestScan = Math.max(latestScan, envelope.scannedAt);
		return envelope;
	};
	return {
		async read(filePath, requests, freshnessFile) {
			const row = params.readRow(filePath);
			const envelope = readEnvelope(row);
			const metadata = envelope ?? params.deferredMetadata?.get(filePath);
			if (metadata) latestScan = Math.max(latestScan, metadata.scannedAt);
			const fresh = freshnessFile ? isUsageCostRollupFresh({
				checkpoint: metadata?.checkpoint,
				file: freshnessFile
			}) : void 0;
			const usable = envelope ? requests.filter(({ file }) => canUseUsageCostRollupForPartial({
				checkpoint: envelope.checkpoint,
				file
			})) : [];
			const entry = row?.bodyBytes !== void 0 && envelope?.body.storedBytes !== row.bodyBytes ? void 0 : params.deferredPaths?.has(filePath) ? null : row && usable.length > 0 ? params.readEntry ? await params.readEntry(row) : decodeUsageCostRollup(row.valueJson, params.pricingFingerprint, await params.readBody(row)) : void 0;
			const invalidBody = Boolean(row && usable.length > 0 && entry === void 0);
			if (invalidBody && row) params.onInvalidBody(row.key);
			return {
				fresh,
				checkpoint: metadata?.checkpoint,
				entry,
				requests: usable,
				invalidBody
			};
		},
		refreshedAt() {
			for (const row of params.remainingRows) readEnvelope(row);
			return latestScan || void 0;
		}
	};
}
async function projectCostUsageSummary(params) {
	const daily = /* @__PURE__ */ new Map();
	const totals = createEmptyCostUsageTotals();
	const formatDay = createUsageDayKeyFormatter(params.dayBucket);
	let cachedFiles = 0;
	let staleFiles = 0;
	let deferredFiles = 0;
	const reader = createRollupProjectionReader(params);
	for (const file of params.files) {
		const { fresh, entry, invalidBody } = await reader.read(file.filePath, [{ file }], file);
		if (entry === null && fresh) deferredFiles += 1;
		else if (!fresh || invalidBody || !entry) staleFiles += 1;
		if (!entry) continue;
		cachedFiles += 1;
		addRollupToCostUsageSummary({
			rollup: entry.rollup,
			startMs: params.startMs,
			endMs: params.endMs,
			formatDay,
			daily,
			totals
		});
	}
	const refreshedAt = reader.refreshedAt();
	fillMissingDays(daily, params.startMs, params.endMs, formatDay);
	return {
		updatedAt: Date.now(),
		days: countCalendarDays(params.startMs, params.endMs, formatDay),
		daily: Array.from(daily, ([date, bucket]) => Object.assign({ date }, bucket)).toSorted((a, b) => a.date.localeCompare(b.date)),
		totals,
		cacheStatus: {
			status: staleFiles === 0 && deferredFiles === 0 ? "fresh" : cachedFiles > 0 || deferredFiles > 0 ? "partial" : "stale",
			cachedFiles,
			pendingFiles: staleFiles + deferredFiles,
			staleFiles,
			refreshedAt
		}
	};
}
async function projectSessionCostSummaries(params) {
	const summaries = Array(params.sessions.length).fill(null);
	const requestsByPath = /* @__PURE__ */ new Map();
	for (const [index, session] of params.sessions.entries()) {
		const file = params.files[index];
		if (!file) continue;
		const requests = requestsByPath.get(file.filePath) ?? [];
		requests.push({
			index,
			session,
			file
		});
		requestsByPath.set(file.filePath, requests);
	}
	const startMs = params.startMs ?? Number.NEGATIVE_INFINITY;
	const endMs = params.endMs ?? Number.POSITIVE_INFINITY;
	const includeUntimestamped = params.includeUntimestamped === true || params.startMs === void 0 && params.endMs === void 0;
	const formatDay = createUsageDayKeyFormatter(params.dayBucket);
	let cachedFiles = 0;
	const deferredIndexes = /* @__PURE__ */ new Set();
	const reader = createRollupProjectionReader(params);
	for (const [filePath, requests] of requestsByPath) {
		const { entry, checkpoint, requests: usableRequests } = await reader.read(filePath, requests);
		if (entry === null) {
			for (const { index, file } of requests) if (isUsageCostRollupFresh({
				checkpoint,
				file
			})) deferredIndexes.add(index);
		}
		if (!entry) continue;
		for (const { index, session, file } of usableRequests) {
			cachedFiles += 1;
			const fresh = isUsageCostRollupFresh({
				checkpoint: entry.checkpoint,
				file
			});
			summaries[index] = {
				...buildSessionCostSummaryFromRollup({
					rollup: entry.rollup,
					sessionId: session.sessionId,
					sessionFile: session.sessionFile,
					startMs,
					endMs,
					includeUntimestamped,
					formatDay
				}),
				computedAt: entry.scannedAt,
				...!fresh ? {
					refreshing: false,
					staleSince: file.mtimeMs
				} : {}
			};
		}
	}
	const staleSessionFiles = /* @__PURE__ */ new Set();
	for (const [index, session] of params.sessions.entries()) if (!deferredIndexes.has(index) && (summaries[index] === null || summaries[index]?.staleSince !== void 0)) staleSessionFiles.add(params.files[index]?.sourcePath ?? session.sessionFile);
	return {
		summaries,
		cacheStatus: {
			status: staleSessionFiles.size === 0 && deferredIndexes.size === 0 ? "fresh" : cachedFiles > 0 || deferredIndexes.size > 0 ? "partial" : "stale",
			cachedFiles,
			pendingFiles: staleSessionFiles.size + deferredIndexes.size,
			staleFiles: staleSessionFiles.size,
			refreshedAt: reader.refreshedAt()
		},
		staleSessionFiles: [...staleSessionFiles]
	};
}
//#endregion
//#region src/utils/transcript-tools.ts
const TOOL_RESULT_TYPES = /* @__PURE__ */ new Set(["tool_result", "tool_result_error"]);
/** Preserves call occurrences; a top-level legacy name can mirror the first matching block. */
const extractToolCallNames = (message) => {
	const toolName = normalizeOptionalString(message.toolName ?? message.tool_name);
	const names = toolName ? [toolName] : [];
	let unmatchedTopLevelName = toolName;
	const content = message.content;
	if (!Array.isArray(content)) return names;
	for (const entry of content) {
		if (!entry || typeof entry !== "object") continue;
		const block = entry;
		if (!isToolCallContentType(normalizeOptionalString(block.type))) continue;
		const name = normalizeOptionalString(block.name);
		if (name && name === unmatchedTopLevelName) unmatchedTopLevelName = void 0;
		else if (name) names.push(name);
	}
	return names;
};
/** Counts recognized tool-result blocks and the subset explicitly marked as errors. */
const countToolResults = (message) => {
	const content = message.content;
	if (!Array.isArray(content)) return {
		total: 0,
		errors: 0
	};
	let total = 0;
	let errors = 0;
	for (const entry of content) {
		if (!entry || typeof entry !== "object") continue;
		const block = entry;
		const type = normalizeLowercaseStringOrEmpty(block.type);
		if (!TOOL_RESULT_TYPES.has(type)) continue;
		total += 1;
		if (block.is_error === true) errors += 1;
	}
	return {
		total,
		errors
	};
};
//#endregion
//#region src/infra/session-cost-usage-pricing.ts
const extractCostBreakdown = (usageRaw) => {
	if (!usageRaw || usageRaw.usageReport?.state === "unavailable") return;
	const cost = usageRaw.cost;
	if (!cost) return;
	const total = asFiniteNumber(cost.total);
	if (total === void 0 || total < 0) return;
	return {
		total,
		input: asFiniteNumber(cost.input),
		output: asFiniteNumber(cost.output),
		cacheRead: asFiniteNumber(cost.cacheRead),
		cacheWrite: asFiniteNumber(cost.cacheWrite),
		totalOrigin: cost.totalOrigin === "provider-billed" ? cost.totalOrigin : void 0
	};
};
const parseTimestamp = (entry) => {
	const message = entry.message;
	const messageTimestamp = asFiniteNumber(message?.timestamp);
	if (messageTimestamp !== void 0) {
		const parsed = new Date(messageTimestamp);
		if (!Number.isNaN(parsed.valueOf())) return parsed;
	}
	const raw = entry.timestamp;
	if (typeof raw === "string") {
		const parsed = new Date(raw);
		if (!Number.isNaN(parsed.valueOf())) return parsed;
	}
};
const parseUsageCostTranscriptRecord = (entry) => {
	const message = entry.message;
	if (!message || typeof message !== "object") return null;
	const roleRaw = message.role;
	const role = roleRaw === "user" || roleRaw === "assistant" ? roleRaw : void 0;
	const isStandaloneToolResult = roleRaw === "tool" || roleRaw === "toolResult";
	if (!role && !isStandaloneToolResult) return null;
	const usageRaw = message.usage ?? entry.usage;
	const usage = usageRaw ? normalizeUsage(usageRaw) ?? void 0 : void 0;
	const provider = (typeof message.provider === "string" ? message.provider : void 0) ?? (typeof entry.provider === "string" ? entry.provider : void 0);
	const model = (typeof message.model === "string" ? message.model : void 0) ?? (typeof entry.model === "string" ? entry.model : void 0);
	const costBreakdown = extractCostBreakdown(usageRaw);
	const stopReason = typeof message.stopReason === "string" ? message.stopReason : void 0;
	const durationMs = asFiniteNumber(message.durationMs ?? entry.durationMs);
	return {
		role,
		timestamp: parseTimestamp(entry),
		durationMs,
		usage,
		costTotal: costBreakdown?.total,
		costBreakdown,
		provider,
		model,
		stopReason,
		toolNames: isStandaloneToolResult ? [] : extractToolCallNames(message),
		toolResultCounts: isStandaloneToolResult ? {
			total: 1,
			errors: message.isError === true || message.is_error === true ? 1 : 0
		} : countToolResults(message)
	};
};
const computeUsageTokenTotals = (usage) => {
	const input = usage.input ?? 0;
	const output = usage.output ?? 0;
	const cacheRead = usage.cacheRead ?? 0;
	const cacheWrite = usage.cacheWrite ?? 0;
	const componentTotal = input + output + cacheRead + cacheWrite;
	return {
		input,
		output,
		cacheRead,
		cacheWrite,
		totalTokens: usage.total ?? componentTotal
	};
};
function needsUsageCostEstimate(entry) {
	return Boolean(entry?.usage) && entry?.usage?.usageReport?.state !== "unavailable" && !((entry?.costTotal ?? 0) > 0 || hasRecordedUsageCost(entry?.costBreakdown));
}
function applyUsageCostEstimate(entry, resolveCost) {
	const cost = resolveCost({
		provider: entry.provider,
		model: entry.model
	});
	const { totalTokens } = computeUsageTokenTotals(entry.usage);
	if (!cost && totalTokens > 0) {
		entry.costTotal = void 0;
		entry.costBreakdown = void 0;
	} else if (entry.costTotal === void 0 || totalTokens > 0) {
		const estimated = cost ? calculateUsageCost(entry.usage, cost) : void 0;
		entry.costBreakdown = estimated && Number.isFinite(estimated.total) ? estimated : void 0;
		entry.costTotal = entry.costBreakdown?.total;
	}
	return entry;
}
//#endregion
//#region src/infra/session-cost-usage-rollup-scan.ts
function hashUsageCostCheckpointEvent(event) {
	return sha256Base64Url(JSON.stringify(event));
}
function createUsageRollupScan(params) {
	const previous = params.appendOnly ? params.previous : void 0;
	const rollup = previous?.rollup ?? createSessionUsageRollupData();
	let countedRecords = 0;
	let parsedRecords = 0;
	return {
		async addEntries(entries) {
			let batch = [];
			const flush = async () => {
				const estimated = batch.filter(needsUsageCostEstimate);
				const costs = await params.resolveCosts(estimated.map(({ provider, model }) => ({
					provider,
					model
				})));
				for (let i = 0; i < estimated.length; i++) applyUsageCostEstimate(estimated[i], () => costs[i]);
				for (const entry of batch) {
					let usageTotals;
					if (entry.usage) {
						usageTotals = {
							...createEmptyCostUsageTotals(),
							...computeUsageTokenTotals(entry.usage),
							usageReport: entry.usage.usageReport
						};
						const cost = entry.costBreakdown;
						if (cost?.total !== void 0) {
							usageTotals.totalCost += cost.total;
							usageTotals.inputCost += cost.input ?? 0;
							usageTotals.outputCost += cost.output ?? 0;
							usageTotals.cacheReadCost += cost.cacheRead ?? 0;
							usageTotals.cacheWriteCost += cost.cacheWrite ?? 0;
						} else if (entry.costTotal === void 0) {
							usageTotals.missingCostEntries = 1;
							const modelKey = `${normalizeOptionalString(entry.provider) ?? "unknown"}/${normalizeOptionalString(entry.model) ?? "unknown"}`;
							usageTotals.missingCostByModel = { [modelKey]: 1 };
						} else usageTotals.totalCost += entry.costTotal;
					}
					const timestamp = entry.timestamp?.getTime();
					appendSessionUsageRollupContribution(rollup, {
						timestamp,
						role: entry.role,
						durationMs: entry.durationMs,
						provider: entry.provider,
						model: entry.model,
						stopReason: entry.stopReason,
						toolNames: entry.toolNames,
						toolResultCounts: entry.toolResultCounts,
						usageTotals
					});
					countedRecords += entry.usage && timestamp ? 1 : 0;
					parsedRecords += entry.usage ? 1 : 0;
				}
				batch = [];
			};
			for (const entry of entries) {
				batch.push(entry);
				if (batch.length === 128) await flush();
			}
			if (batch.length > 0) await flush();
		},
		finish(checkpoint) {
			return {
				version: 7,
				pricingFingerprint: params.pricingFingerprint,
				checkpoint,
				scannedAt: Date.now(),
				parsedRecords: (previous?.parsedRecords ?? 0) + parsedRecords,
				countedRecords: (previous?.countedRecords ?? 0) + countedRecords,
				rollup
			};
		}
	};
}
/** Memory snapshots are immutable; no post-scan source probe or database lease is needed. */
async function scanMemoryUsageCostRollup(params) {
	let anchorHash = sha256Base64Url("");
	const records = params.events.map(({ eventJson }, index) => {
		const event = JSON.parse(eventJson);
		if (index === params.events.length - 1) anchorHash = hashUsageCostCheckpointEvent(event);
		const record = { usageEntry: null };
		if (isRecord(event)) {
			record.usageEntry = parseUsageCostTranscriptRecord(event);
			Object.assign(record, projectTranscriptNavigationFields(event));
		}
		return record;
	});
	const scan = createUsageRollupScan({
		...params,
		appendOnly: false
	});
	await scan.addEntries(selectVisibleTranscriptEvents(records).flatMap((record) => record.usageEntry ? [record.usageEntry] : []));
	const visibleLeafId = scanSessionTranscriptTree(records).leafId;
	return scan.finish({
		kind: "sqlite",
		maxSeq: params.file.maxSeq ?? 0,
		eventCount: params.file.eventCount ?? 0,
		size: params.file.size,
		mtimeMs: params.file.mtimeMs,
		anchorHash,
		...visibleLeafId ? { visibleLeafId } : {}
	});
}
//#endregion
export { needsUsageCostEstimate as a, projectCostUsageSummary as c, computeUsageTokenTotals as i, projectSessionCostSummaries as l, scanMemoryUsageCostRollup as n, parseUsageCostTranscriptRecord as o, applyUsageCostEstimate as r, createUsageDayKeyFormatter as s, createUsageRollupScan as t };
