import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as trackAsyncWork, r as getAsyncWorkSignal } from "./async-work-scope-BYeX3gh6.mjs";
import "./src-CdRlGRnW.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { c as resolveSessionFilePathOptions, s as resolveSessionFilePathCore } from "./paths-dpReqUI8.mjs";
import { g as resolveSessionAgentId } from "./agent-scope-CG17uXFn.mjs";
import { a as hasGatewayClientCap, t as GATEWAY_CLIENT_CAPS } from "./client-info-C8RatpKO.mjs";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.mjs";
import { va as validateSessionsUsageParams } from "./src-l2dWvEsN.mjs";
import { K as readUserProfileVersion } from "./user-profiles-internal-DlO1LBbo.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { o as operatorSessionCap } from "./operator-role-policy-BqPaarjx.mjs";
import { n as parseSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.mjs";
import { n as sessionDeliveryChannel, r as sessionDeliveryOrigin } from "./delivery-context.read-CR06zOJ4.mjs";
import { r as loadExactSessionEntryCandidates } from "./session-accessor.sqlite-exact-read-JW6IveXD.mjs";
import { s as sessionCreatorProfileId } from "./session-entry-provenance-Bfs2J1E7.mjs";
import "./session-accessor-CQ-g9yb2.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-Bxi11ET4.mjs";
import { o as resolveStoredSessionKeyForAgentStore } from "./session-store-key-Ci099tm9.mjs";
import { t as resolvePreferredSessionKeyForSessionIdMatches } from "./session-id-resolution--80nkk68.mjs";
import { a as resolveTimezone, i as resolveTimeZoneDayStartMs, t as createTimeZoneDayKeyFormatter } from "./format-datetime-QNTzUilb.mjs";
import { i as gatewayClientSessionCreator } from "./gateway-client-identity-DnDs09-7.mjs";
import { t as findCanonicalStoreMatch } from "./session-utils-store-selection-DW7mpK3L.mjs";
import { n as loadCombinedSessionStoreForGatewayCore } from "./combined-store-gateway-BS1S2ivy.mjs";
import { V as resolveGatewaySessionDisplayName } from "./session-row-prepared-read-BwiDGjfX.mjs";
import { i as projectSessionActor } from "./session-identity-projection-C_gwtUz2.mjs";
import { t as listGatewayAgentsBasic } from "./agent-list-CjU3FIen.mjs";
import { f as isGatewayAdmin } from "./session-sharing-policy-BVt5saXn.mjs";
import { l as createSessionListEntryFilter } from "./session-sharing-target-read-DUttMvj3.mjs";
import "./session-sharing-50mq9oo9.mjs";
import { t as resolveGatewaySessionStoreTargetInWorker } from "./session-utils-store-worker-tRryl7lz.mjs";
import "./session-utils-N4Q5NAko.mjs";
import { r as createEmptyCostUsageTotals, t as addCostUsageTotals } from "./session-cost-usage-totals-D4e-85ui.mjs";
import { t as getSessionCostUsageUpdatedAt } from "./session-cost-usage-events-2-CLnboz.mjs";
import { i as loadSessionUsageTimeSeries, o as loadCostUsageSummaryFromCache, r as loadSessionLogs, s as loadSessionCostSummariesFromCache, t as discoverAllSessions } from "./session-cost-usage-DcW8Cj3G.mjs";
import { c as resolveUsageSessionSource } from "./session-cost-usage-collection-PyG819Q7.mjs";
import { t as assertValidParams } from "./validation-Bu27N0nv.mjs";
import { n as loadUsageStatusStaleWhileRevalidate } from "./models-auth-status-usage-cache-CtaGWZAf.mjs";
import { i as createSessionCostSummaryAccumulator, o as UNKNOWN_USAGE_CREATOR_KEY, s as createUsageAggregateAccumulator } from "./session-cost-usage-rollup-CRmnujy0.mjs";
import fs from "node:fs";
//#region src/gateway/server-methods/usage-date-range.ts
const MAX_USAGE_DAYS = 36600;
const parseDateParts = (raw) => {
	if (typeof raw !== "string" || !raw.trim()) return;
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw.trim());
	if (!match) return;
	const [, yearStr, monthStr, dayStr] = match;
	const year = Number(yearStr);
	const monthIndex = Number(monthStr) - 1;
	const day = Number(dayStr);
	const probe = new Date(Date.UTC(year, monthIndex, day));
	if (probe.getUTCFullYear() !== year || probe.getUTCMonth() !== monthIndex || probe.getUTCDate() !== day) return;
	return {
		year,
		monthIndex,
		day
	};
};
const shiftDateParts = (parts, days) => {
	const shifted = new Date(Date.UTC(parts.year, parts.monthIndex, parts.day + days));
	return {
		year: shifted.getUTCFullYear(),
		monthIndex: shifted.getUTCMonth(),
		day: shifted.getUTCDate()
	};
};
const datePartsToStartMs = (parts, interpretation) => {
	const { year, monthIndex, day } = parts;
	if (interpretation.mode === "gateway") return new Date(year, monthIndex, day).getTime();
	if (interpretation.mode === "time-zone") return resolveTimeZoneDayStartMs(formatDateParts(year, monthIndex, day), interpretation.timeZone);
	if (interpretation.mode === "utc-offset") return Date.UTC(year, monthIndex, day) - interpretation.utcOffsetMinutes * 60 * 1e3;
	return Date.UTC(year, monthIndex, day);
};
const datePartsToEndMs = (parts, interpretation) => {
	const lookaheadDays = interpretation.mode === "time-zone" ? 2 : 1;
	for (let daysAhead = 1; daysAhead <= lookaheadDays; daysAhead += 1) {
		const nextDayStartMs = datePartsToStartMs(shiftDateParts(parts, daysAhead), interpretation);
		if (nextDayStartMs !== void 0) return nextDayStartMs - 1;
	}
};
const findInvalidExplicitDate = (params) => {
	for (const field of ["startDate", "endDate"]) {
		const raw = params[field];
		if (raw === void 0 || raw === null || typeof raw === "string" && raw.trim() === "") continue;
		if (parseDateParts(raw) === void 0) return field;
	}
};
/**
* Parse a UTC offset string in the format UTC+H, UTC-H, UTC+HH, UTC-HH, UTC+H:MM, UTC-HH:MM.
* Returns the UTC offset in minutes (east-positive), or undefined if invalid.
*/
const parseUtcOffsetToMinutes = (raw) => {
	if (typeof raw !== "string" || !raw.trim()) return;
	const match = /^UTC([+-])(\d{1,2})(?::([0-5]\d))?$/.exec(raw.trim());
	if (!match) return;
	const sign = match[1] === "+" ? 1 : -1;
	const hours = Number(match[2]);
	const minutes = Number(match[3] ?? "0");
	const totalMinutes = sign * (hours * 60 + minutes);
	if (totalMinutes < -720 || totalMinutes > 840) return;
	return totalMinutes;
};
const resolveDateInterpretation = (params) => {
	if (params.mode === "gateway") return {
		ok: true,
		value: { mode: "gateway" }
	};
	if (params.mode === "specific") {
		const utcOffsetMinutes = parseUtcOffsetToMinutes(params.utcOffset);
		if (params.timeZone !== void 0 && params.timeZone !== null) {
			const requestedTimeZone = normalizeOptionalString(params.timeZone);
			const timeZone = requestedTimeZone ? resolveTimezone(requestedTimeZone) : void 0;
			if (!timeZone) {
				if (utcOffsetMinutes !== void 0) return {
					ok: true,
					value: {
						mode: "utc-offset",
						utcOffsetMinutes
					}
				};
				return {
					ok: false,
					error: "invalid timeZone: expected a valid IANA time zone"
				};
			}
			return {
				ok: true,
				value: {
					mode: "time-zone",
					timeZone,
					formatDayKey: createTimeZoneDayKeyFormatter(timeZone)
				}
			};
		}
		if (utcOffsetMinutes !== void 0) return {
			ok: true,
			value: {
				mode: "utc-offset",
				utcOffsetMinutes
			}
		};
		if (params.utcOffset != null && (typeof params.utcOffset !== "string" || params.utcOffset.trim() !== "")) return {
			ok: false,
			error: "invalid utcOffset: expected UTC-12:00 through UTC+14:00"
		};
	}
	return {
		ok: true,
		value: { mode: "utc" }
	};
};
const resolveDayBucket = (interpretation) => {
	if (interpretation.mode === "gateway") return;
	if (interpretation.mode === "time-zone") return {
		mode: "time-zone",
		timeZone: interpretation.timeZone
	};
	return {
		mode: "utc-offset",
		utcOffsetMinutes: interpretation.mode === "utc-offset" ? interpretation.utcOffsetMinutes : 0
	};
};
const getDateParts = (date, interpretation) => {
	if (interpretation.mode === "gateway") return {
		year: date.getFullYear(),
		monthIndex: date.getMonth(),
		day: date.getDate()
	};
	if (interpretation.mode === "time-zone") {
		const parts = parseDateParts(interpretation.formatDayKey(date));
		if (!parts) throw new Error("timezone formatter returned an invalid calendar day");
		return parts;
	}
	const utcDate = interpretation.mode === "utc-offset" ? new Date(date.getTime() + interpretation.utcOffsetMinutes * 60 * 1e3) : date;
	return {
		year: utcDate.getUTCFullYear(),
		monthIndex: utcDate.getUTCMonth(),
		day: utcDate.getUTCDate()
	};
};
const formatDateLabel = (ms, interpretation) => {
	const parts = getDateParts(new Date(ms), interpretation);
	return formatDateParts(parts.year, parts.monthIndex, parts.day);
};
const formatDateParts = (year, monthIndex, day) => `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
const parseDays = (raw) => {
	const value = typeof raw === "string" && raw.trim() !== "" ? Number(raw) : raw;
	return typeof value === "number" && Number.isFinite(value) ? Math.min(Math.floor(value), MAX_USAGE_DAYS) : void 0;
};
const resolveRangeDays = (raw) => {
	switch (raw) {
		case "all": return "all";
		case "7d": return 7;
		case "30d": return 30;
		case "90d": return 90;
		case "1y": return 365;
		default: return;
	}
};
/**
* Get date range from params (startDate/endDate or days).
* Falls back to last 30 days if not provided.
*/
const resolveDateRange = (params, resolvedInterpretation) => {
	const invalidDate = findInvalidExplicitDate(params);
	if (invalidDate) return {
		ok: false,
		error: `invalid ${invalidDate}: expected a valid YYYY-MM-DD calendar date`
	};
	const now = /* @__PURE__ */ new Date();
	const interpretationResolution = resolvedInterpretation ? {
		ok: true,
		value: resolvedInterpretation
	} : resolveDateInterpretation(params);
	if (!interpretationResolution.ok) return interpretationResolution;
	const interpretation = interpretationResolution.value;
	const todayDateParts = getDateParts(now, interpretation);
	const todayEndMs = datePartsToEndMs(todayDateParts, interpretation);
	if (todayEndMs === void 0) return {
		ok: false,
		error: "calendar day does not exist in requested time zone"
	};
	const startDateParts = parseDateParts(params.startDate);
	const endDateParts = parseDateParts(params.endDate);
	if (startDateParts === void 0 !== (endDateParts === void 0)) return {
		ok: false,
		error: "startDate and endDate must be provided together"
	};
	if (startDateParts && endDateParts) {
		const startMs = datePartsToStartMs(startDateParts, interpretation);
		const endStartMs = datePartsToStartMs(endDateParts, interpretation);
		const endMs = datePartsToEndMs(endDateParts, interpretation);
		if (startMs === void 0 || endStartMs === void 0 || endMs === void 0) return {
			ok: false,
			error: "calendar day does not exist in requested time zone"
		};
		if (startMs > endStartMs) return {
			ok: false,
			error: "startDate must not be after endDate"
		};
		return {
			ok: true,
			value: {
				startMs,
				endMs
			}
		};
	}
	const rangeDays = resolveRangeDays(params.range);
	if (rangeDays === "all") return {
		ok: true,
		value: {
			startMs: 0,
			endMs: todayEndMs,
			includeUntimestamped: true
		}
	};
	const days = Math.max(1, rangeDays ?? parseDays(params.days) ?? 30);
	const startMs = datePartsToStartMs(shiftDateParts(todayDateParts, -(days - 1)), interpretation);
	if (startMs === void 0) return {
		ok: false,
		error: "calendar day does not exist in requested time zone"
	};
	return {
		ok: true,
		value: {
			startMs,
			endMs: todayEndMs
		}
	};
};
//#endregion
//#region src/gateway/server-methods/usage-cache.ts
const USAGE_CACHE_TTL_MS = 3e4;
const USAGE_CACHE_MAX = 256;
function setUsageCache(cache, cacheKey, entry) {
	const cutoff = Date.now() - USAGE_CACHE_TTL_MS;
	for (const [key, candidate] of cache) if (key !== cacheKey && !candidate.inFlight && candidate.lastAccessedAt <= cutoff) cache.delete(key);
	if (!cache.has(cacheKey) && cache.size >= USAGE_CACHE_MAX) {
		let evictionKey = cache.keys().next().value;
		for (const [key, candidate] of cache) if (!candidate.inFlight) {
			evictionKey = key;
			break;
		}
		if (evictionKey !== void 0) cache.delete(evictionKey);
	}
	cache.set(cacheKey, entry);
}
async function loadUsageResultCached(params) {
	const { cache, cacheKey, configRef, revision } = params;
	const now = Date.now();
	const candidate = cache.get(cacheKey);
	const cached = candidate?.configRef === configRef && candidate.revision === revision ? candidate : void 0;
	if (cached) cached.lastAccessedAt = now;
	if (cached?.value && cached.updatedAt && now - cached.updatedAt < USAGE_CACHE_TTL_MS) return cached.value;
	if (cached?.inFlight) return cached.value && cached.updatedAt ? cached.value : await cached.inFlight;
	const entry = cached ?? {
		configRef,
		revision,
		lastAccessedAt: now
	};
	const inFlight = trackAsyncWork(() => params.load().then((value) => {
		if (cache.get(cacheKey) !== entry) return value;
		if (params.isComplete?.(value) ?? true) {
			entry.value = value;
			entry.updatedAt = Date.now();
		} else if (!entry.value) {
			entry.value = value;
			delete entry.updatedAt;
		}
		return value;
	}).catch((error) => {
		if (entry.value) return entry.value;
		throw error;
	}).finally(() => {
		const current = cache.get(cacheKey);
		if (current === entry && current.inFlight === inFlight) {
			current.inFlight = void 0;
			current.lastAccessedAt = Date.now();
		}
	}));
	entry.inFlight = inFlight;
	setUsageCache(cache, cacheKey, entry);
	return entry.value && entry.updatedAt ? entry.value : await inFlight;
}
//#endregion
//#region src/gateway/server-methods/usage-session-loading.ts
const USAGE_AGENT_LOAD_CONCURRENCY = 12;
async function runUsageAgentTasks(tasks) {
	const result = await runTasksWithConcurrency({
		tasks,
		limit: USAGE_AGENT_LOAD_CONCURRENCY,
		errorMode: "stop"
	});
	if (result.hasError) throw result.firstError;
	return result.results;
}
async function discoverAllSessionsForUsage(params) {
	const requestedAgentId = normalizeOptionalString(params.agentId);
	const allSessions = (await runUsageAgentTasks((requestedAgentId ? [{ id: normalizeAgentId(requestedAgentId) }] : (await listGatewayAgentsBasic(params.config)).agents).map((agent) => async () => {
		const agentId = normalizeAgentId(agent.id);
		return (await discoverAllSessions({
			agentId,
			startMs: params.startMs,
			endMs: params.endMs
		})).map((session) => Object.assign({}, session, { agentId }));
	}))).flat();
	allSessions.sort((a, b) => b.mtime - a.mtime);
	return allSessions;
}
function mergeUsageCacheStatus(target, source) {
	if (!target) return { ...source };
	const statusRank = {
		fresh: 0,
		partial: 1,
		stale: 2,
		refreshing: 3
	};
	return {
		status: statusRank[source.status] > statusRank[target.status] ? source.status : target.status,
		cachedFiles: target.cachedFiles + source.cachedFiles,
		pendingFiles: target.pendingFiles + source.pendingFiles,
		staleFiles: target.staleFiles + source.staleFiles,
		refreshedAt: target.refreshedAt === void 0 ? source.refreshedAt : source.refreshedAt === void 0 ? target.refreshedAt : Math.max(target.refreshedAt, source.refreshedAt)
	};
}
async function loadUsageSessionSummaries(params) {
	const { entries: mergedEntries, config, startMs, endMs, includeUntimestamped, dayBucket } = params;
	let cacheStatus;
	const usageByEntryIndex = Array.from({ length: mergedEntries.length }, () => null);
	const sessionsByAgent = /* @__PURE__ */ new Map();
	for (const [entryIndex, merged] of mergedEntries.entries()) for (const { sessionId, sessionFile } of merged.instances) {
		const agentSessions = sessionsByAgent.get(merged.agentId) ?? [];
		agentSessions.push({
			entryIndex,
			sessionId,
			sessionFile
		});
		sessionsByAgent.set(merged.agentId, agentSessions);
	}
	const agentLoads = await runUsageAgentTasks(Array.from(sessionsByAgent.entries()).map(([agentId, agentSessions]) => async () => ({
		agentSessions,
		loaded: await loadSessionCostSummariesFromCache({
			sessions: agentSessions,
			config,
			agentId,
			startMs,
			endMs,
			includeUntimestamped,
			dayBucket
		})
	})));
	for (const { agentSessions, loaded } of agentLoads) {
		cacheStatus = mergeUsageCacheStatus(cacheStatus, loaded.cacheStatus);
		let usage;
		for (const [index, summary] of loaded.summaries.entries()) {
			const session = expectDefined(agentSessions[index], "agent sessions entry at index");
			if (summary) {
				const merged = expectDefined(mergedEntries[session.entryIndex], "merged entries entry at session.entry index");
				usage ??= createSessionCostSummaryAccumulator({
					sessionId: merged.sessionId,
					sessionFile: merged.sessionFile
				});
				usage.add(summary);
			}
			if (usage && agentSessions[index + 1]?.entryIndex !== session.entryIndex) {
				usageByEntryIndex[session.entryIndex] = usage.finish();
				usage = void 0;
			}
		}
	}
	return {
		summaries: usageByEntryIndex,
		cacheStatus
	};
}
//#endregion
//#region src/gateway/server-methods/usage-result-cache.ts
const costUsageCache = /* @__PURE__ */ new Map();
const sessionsUsageCache = /* @__PURE__ */ new Map();
function usageDayBucketCacheKey(dayBucket) {
	return dayBucket ? dayBucket.mode === "time-zone" ? `time-zone:${dayBucket.timeZone}` : `utc-offset:${dayBucket.utcOffsetMinutes}` : "gateway";
}
function sessionsUsageCacheKey(params) {
	return JSON.stringify([
		params.agentScope === "all" ? "all" : `agent:${params.agentId}`,
		params.startMs,
		params.endMs,
		params.includeUntimestamped === true,
		usageDayBucketCacheKey(params.dayBucket),
		params.limit,
		params.groupingMode,
		params.specificKey,
		params.includeContextWeight,
		params.creatorKey,
		...params.visibilityIdentity ? [params.visibilityIdentity] : []
	]);
}
async function loadSessionsUsageResultCached(params) {
	return await loadUsageResultCached({
		cache: sessionsUsageCache,
		cacheKey: sessionsUsageCacheKey(params),
		configRef: params.configRef,
		revision: `${readUserProfileVersion()}:${getSessionCostUsageUpdatedAt()}`,
		load: params.load,
		isComplete: (result) => !result.cacheStatus || result.cacheStatus.status === "fresh"
	});
}
async function loadCostUsageSummaryCached(params) {
	const allAgents = params.agentScope === "all";
	const agentId = allAgents ? void 0 : normalizeAgentId(params.agentId ?? resolveSessionAgentId({ config: params.config }));
	const dayBucketKey = usageDayBucketCacheKey(params.dayBucket);
	const cacheKey = `${allAgents ? "all" : `agent:${agentId}`}:${params.startMs}-${params.endMs}:${dayBucketKey}`;
	return await loadUsageResultCached({
		cache: costUsageCache,
		cacheKey,
		configRef: params.config,
		revision: getSessionCostUsageUpdatedAt(),
		load: () => allAgents ? loadAllAgentCostUsageSummary({
			startMs: params.startMs,
			endMs: params.endMs,
			dayBucket: params.dayBucket,
			config: params.config
		}) : loadCostUsageSummaryFromCache({
			startMs: params.startMs,
			endMs: params.endMs,
			dayBucket: params.dayBucket,
			config: params.config,
			agentId: expectDefined(agentId, "non-aggregate usage agent id"),
			requestRefresh: true,
			refreshMode: "background"
		})
	});
}
async function loadAllAgentCostUsageSummary(params) {
	const summaries = await runUsageAgentTasks((await listGatewayAgentsBasic(params.config)).agents.map((agent) => normalizeAgentId(agent.id)).map((agentId) => () => loadCostUsageSummaryFromCache({
		startMs: params.startMs,
		endMs: params.endMs,
		dayBucket: params.dayBucket,
		config: params.config,
		agentId,
		requestRefresh: true,
		refreshMode: "background"
	})));
	const dailyByDate = /* @__PURE__ */ new Map();
	const totals = createEmptyCostUsageTotals();
	let cacheStatus;
	let updatedAt = 0;
	let days = 0;
	for (const summary of summaries) {
		updatedAt = Math.max(updatedAt, summary.updatedAt);
		days = Math.max(days, summary.days);
		addCostUsageTotals(totals, summary.totals);
		if (summary.cacheStatus) cacheStatus = mergeUsageCacheStatus(cacheStatus, summary.cacheStatus);
		for (const day of summary.daily) {
			const entry = dailyByDate.get(day.date) ?? {
				date: day.date,
				...createEmptyCostUsageTotals()
			};
			addCostUsageTotals(entry, day);
			dailyByDate.set(day.date, entry);
		}
	}
	return {
		updatedAt,
		days,
		daily: Array.from(dailyByDate.values()).toSorted((a, b) => a.date.localeCompare(b.date)),
		totals,
		...cacheStatus ? { cacheStatus } : {}
	};
}
//#endregion
//#region src/gateway/server-methods/usage-session-selection.ts
var UsageSessionInvalidRequestError = class extends Error {};
async function resolveSessionUsageTarget(key, config, agentIdHint) {
	const signal = getAsyncWorkSignal();
	const target = await resolveGatewaySessionStoreTargetInWorker({
		cfg: config,
		key,
		...agentIdHint ? { agentId: agentIdHint } : {},
		assertActive: () => signal?.throwIfAborted()
	});
	const { canonicalKey, storePath } = target;
	const entry = findCanonicalStoreMatch(target.store, target.storeKeys)?.entry;
	const parsed = parseAgentSessionKey(key);
	const agentId = parsed?.agentId ?? agentIdHint ?? resolveSessionAgentId({
		config,
		sessionKey: key
	});
	const sessionId = entry?.sessionId ?? parsed?.rest ?? key;
	const source = await resolveUsageSessionSource({
		agentId,
		sessionId,
		...entry ? { sessionTarget: {
			agentId,
			sessionId,
			sessionKey: canonicalKey,
			storePath: target.readSource?.path ?? storePath
		} } : { sessionFile: resolveSessionFilePathCore(sessionId, void 0, resolveSessionFilePathOptions({
			storePath,
			agentId
		})) }
	});
	signal?.throwIfAborted();
	return source ? {
		entry: source.entry,
		agentId,
		sessionId,
		sessionFile: source.sessionFile
	} : void 0;
}
function usageSessionIdentity(agentId, sessionId) {
	return `${agentId}\0${sessionId}`;
}
function buildStoreBySessionIdentity(store, targetsBySessionKey) {
	const matchesByIdentity = /* @__PURE__ */ new Map();
	for (const [key, entry] of Object.entries(store)) {
		if (!entry?.sessionId) continue;
		const agentId = expectDefined(targetsBySessionKey.get(key), "stored session owner").agentId;
		const identity = usageSessionIdentity(agentId, entry.sessionId);
		const matches = matchesByIdentity.get(identity) ?? [];
		matches.push([key, entry]);
		matchesByIdentity.set(identity, matches);
	}
	const storeByIdentity = /* @__PURE__ */ new Map();
	for (const [identity, matches] of matchesByIdentity) {
		const sessionId = expectDefined(matches[0], "stored session match")[1].sessionId;
		const preferredKey = resolvePreferredSessionKeyForSessionIdMatches(matches, sessionId);
		if (!preferredKey) continue;
		const preferredEntry = store[preferredKey];
		if (preferredEntry) storeByIdentity.set(identity, {
			key: preferredKey,
			entry: preferredEntry
		});
	}
	const familyMatches = /* @__PURE__ */ new Map();
	for (const { key, entry } of storeByIdentity.values()) {
		const agentId = expectDefined(targetsBySessionKey.get(key), "stored session owner").agentId;
		for (const sessionId of entry.usageFamilySessionIds ?? []) {
			const identity = usageSessionIdentity(agentId, sessionId);
			if (!storeByIdentity.has(identity)) {
				const candidates = familyMatches.get(identity) ?? {
					sessionId,
					matches: []
				};
				candidates.matches.push([key, entry]);
				familyMatches.set(identity, candidates);
			}
		}
	}
	const familyOwners = new Map(storeByIdentity);
	for (const [identity, { sessionId, matches }] of familyMatches) {
		const key = resolvePreferredSessionKeyForSessionIdMatches(matches, sessionId);
		if (key) familyOwners.set(identity, {
			key,
			entry: expectDefined(store[key], "family owner")
		});
	}
	return {
		storeByIdentity,
		familyOwners
	};
}
function withUsageGrouping(base, groupingMode, familyOwners, discoveredByIdentity) {
	const currentInstance = {
		sessionId: base.sessionId,
		sessionFile: base.sessionFile
	};
	if (groupingMode !== "family") return {
		...base,
		instances: [currentInstance]
	};
	const includedSessionIds = [...new Set([base.sessionId, ...base.storeEntry?.usageFamilySessionIds ?? []].map(normalizeOptionalString).filter((id) => Boolean(id)))].filter((id) => id === base.sessionId || familyOwners.get(usageSessionIdentity(base.agentId, id))?.entry.sessionId === base.sessionId);
	return {
		...base,
		instances: includedSessionIds.flatMap((id) => {
			const instance = id === base.sessionId ? currentInstance : discoveredByIdentity.get(usageSessionIdentity(base.agentId, id));
			return instance ? [instance] : [];
		}),
		scope: "family",
		sessionFamilyKey: base.storeEntry?.usageFamilyKey ?? base.key,
		currentSessionId: base.sessionId,
		includedSessionIds
	};
}
async function selectUsageSessions(params) {
	const { config, agentId: effectiveAgentId, specificKey, groupingMode, startMs, endMs, visibilityFilter } = params;
	const { store, targetsBySessionKey } = loadCombinedSessionStoreForGatewayCore(config, {
		...effectiveAgentId ? { agentId: effectiveAgentId } : {},
		projection: "list"
	});
	const scopedStore = Object.fromEntries(Object.entries(store).filter(([key, entry]) => (!effectiveAgentId || targetsBySessionKey.get(key)?.agentId === effectiveAgentId) && (!visibilityFilter || visibilityFilter(key, entry))));
	const { storeByIdentity: storeBySessionIdentity, familyOwners } = buildStoreBySessionIdentity(scopedStore, targetsBySessionKey);
	const discoveredSessions = !specificKey || groupingMode === "family" ? await discoverAllSessionsForUsage({
		config,
		...effectiveAgentId ? { agentId: effectiveAgentId } : {},
		startMs,
		endMs
	}) : [];
	const discoveredByIdentity = new Map(discoveredSessions.map((session) => [usageSessionIdentity(session.agentId, session.sessionId), session]));
	const now = Date.now();
	const mergedEntries = [];
	if (specificKey) {
		const scopedSpecificKey = resolveStoredSessionKeyForAgentStore({
			cfg: config,
			agentId: expectDefined(effectiveAgentId, "specific session owner"),
			sessionKey: specificKey
		});
		const scopedParsed = parseAgentSessionKey(scopedSpecificKey);
		const agentIdFromKey = scopedParsed?.agentId ?? expectDefined(effectiveAgentId, "specific session owner");
		const keyRest = scopedParsed?.rest ?? specificKey;
		const storeMatch = scopedStore[scopedSpecificKey] ? {
			key: scopedSpecificKey,
			entry: scopedStore[scopedSpecificKey]
		} : scopedStore[specificKey] ? {
			key: specificKey,
			entry: scopedStore[specificKey]
		} : null;
		const storeByIdMatch = storeBySessionIdentity.get(usageSessionIdentity(agentIdFromKey, keyRest)) ?? (keyRest !== specificKey ? storeBySessionIdentity.get(usageSessionIdentity(agentIdFromKey, specificKey)) : void 0) ?? null;
		const resolvedStoreKey = storeMatch?.key ?? storeByIdMatch?.key ?? scopedSpecificKey;
		let storeEntry = storeMatch?.entry ?? storeByIdMatch?.entry;
		if (visibilityFilter && !storeEntry) throw new UsageSessionInvalidRequestError(`Invalid session reference: ${specificKey}`);
		const sessionId = storeEntry?.sessionId ?? keyRest;
		let resolved;
		try {
			resolved = await resolveSessionUsageTarget(resolvedStoreKey, config, agentIdFromKey);
			if (!resolved || resolved.agentId !== agentIdFromKey || resolved.sessionId !== sessionId) throw new Error("session target mismatch");
			if (visibilityFilter && (!resolved.entry || !visibilityFilter(resolvedStoreKey, resolved.entry))) throw new Error("session visibility changed");
		} catch {
			getAsyncWorkSignal()?.throwIfAborted();
			throw new UsageSessionInvalidRequestError(`Invalid session reference: ${specificKey}`);
		}
		const { sessionFile } = resolved;
		storeEntry = resolved.entry;
		let updatedAt;
		if (parseSqliteSessionFileMarker(sessionFile)) updatedAt = storeEntry?.updatedAt ?? now;
		else try {
			const stats = fs.statSync(sessionFile);
			if (stats.isFile()) updatedAt = storeEntry?.updatedAt ?? stats.mtimeMs;
		} catch {}
		if (updatedAt !== void 0) mergedEntries.push(withUsageGrouping({
			key: resolvedStoreKey,
			agentId: agentIdFromKey,
			sessionId,
			sessionFile,
			label: resolveGatewaySessionDisplayName(resolvedStoreKey, storeEntry),
			updatedAt,
			storeEntry
		}, groupingMode, familyOwners, discoveredByIdentity));
	} else {
		const selectedFamilies = /* @__PURE__ */ new Set();
		for (const discovered of discoveredSessions) {
			const identity = usageSessionIdentity(discovered.agentId, discovered.sessionId);
			const owner = (groupingMode === "family" ? familyOwners : storeBySessionIdentity).get(identity);
			if (!owner) {
				if (!visibilityFilter) mergedEntries.push({
					key: `agent:${discovered.agentId}:${discovered.sessionId}`,
					agentId: discovered.agentId,
					sessionId: discovered.sessionId,
					sessionFile: discovered.sessionFile,
					instances: [discovered],
					updatedAt: discovered.mtime,
					scope: "instance",
					creatorEntry: familyOwners.get(identity)?.entry
				});
				continue;
			}
			const { key } = owner;
			let entry = owner.entry;
			const familyIdentity = usageSessionIdentity(discovered.agentId, key);
			if (selectedFamilies.has(familyIdentity)) continue;
			let sessionFile = discoveredByIdentity.get(usageSessionIdentity(discovered.agentId, entry.sessionId))?.sessionFile;
			if (!sessionFile) {
				const target = await resolveSessionUsageTarget(key, config, discovered.agentId);
				if (!target || target.agentId !== discovered.agentId || target.sessionId !== entry.sessionId) throw new UsageSessionInvalidRequestError(`Invalid session reference: ${key}`);
				if (visibilityFilter && (!target.entry || !visibilityFilter(key, target.entry))) continue;
				sessionFile = target.sessionFile;
				entry = target.entry ?? entry;
			}
			mergedEntries.push(withUsageGrouping({
				key,
				agentId: discovered.agentId,
				sessionId: entry.sessionId,
				sessionFile,
				label: resolveGatewaySessionDisplayName(key, entry),
				updatedAt: entry.updatedAt ?? discovered.mtime,
				storeEntry: entry
			}, groupingMode, familyOwners, discoveredByIdentity));
			if (groupingMode === "family") selectedFamilies.add(familyIdentity);
		}
	}
	mergedEntries.sort((a, b) => b.updatedAt - a.updatedAt);
	for (const row of mergedEntries) {
		const target = targetsBySessionKey.get(row.key);
		if (!target) continue;
		row.contextTarget = {
			storeTarget: target.storeTarget,
			storedKey: target.storeKey ?? row.key
		};
	}
	return mergedEntries;
}
function loadUsageSessionContext(selected, visibilityFilter) {
	const contextRows = /* @__PURE__ */ new Map();
	for (const row of selected) {
		const target = row.contextTarget;
		if (target) {
			const rows = contextRows.get(target.storeTarget) ?? [];
			rows.push({
				row,
				storedKey: target.storedKey
			});
			contextRows.set(target.storeTarget, rows);
		}
	}
	for (const [target, rows] of contextRows) {
		const entries = new Map(loadExactSessionEntryCandidates({
			readOnly: true,
			readSource: {
				agentId: target.agentId,
				path: target.storePath
			},
			sessionKeys: rows.map(({ storedKey }) => storedKey)
		}).map(({ sessionKey, entry }) => [sessionKey, entry]));
		for (const { row, storedKey } of rows) {
			const entry = entries.get(storedKey);
			if (entry?.sessionId === row.sessionId && (!visibilityFilter || visibilityFilter(row.key, entry))) row.contextWeight = entry.systemPromptReport;
		}
	}
}
//#endregion
//#region src/gateway/server-methods/usage.ts
async function resolveSessionUsageFileOrRespond(params, detail, respond, config) {
	const key = normalizeOptionalString(params?.key);
	if (!key) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `key is required for ${detail}`));
		return null;
	}
	const sessionOwner = resolveRequestedSessionAgentId(config, key, normalizeOptionalString(params?.agentId));
	if (!sessionOwner.ok) {
		respond(false, void 0, sessionOwner.error);
		return null;
	}
	let resolved;
	try {
		resolved = await resolveSessionUsageTarget(key, config, sessionOwner.agentId);
	} catch {
		getAsyncWorkSignal()?.throwIfAborted();
		resolved = void 0;
	}
	if (!resolved) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Invalid session key: ${key}`));
		return null;
	}
	return {
		config,
		key,
		...resolved
	};
}
function resolveUsageDateRangeOrRespond(params, respond) {
	const interpretation = resolveDateInterpretation(params);
	if (!interpretation.ok) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, interpretation.error));
		return null;
	}
	const range = resolveDateRange(params, interpretation.value);
	if (!range.ok) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, range.error));
		return null;
	}
	return {
		interpretation: interpretation.value,
		range: range.value
	};
}
function projectUsageCreator(session, profiles, config) {
	const entry = session.storeEntry ?? session.creatorEntry;
	const actor = entry?.createdActor;
	if (!actor) return { key: UNKNOWN_USAGE_CREATOR_KEY };
	const projected = projectSessionActor(actor, profiles, config, Boolean(sessionCreatorProfileId(actor)));
	if (!projected?.id && actor.type !== "system") return { key: UNKNOWN_USAGE_CREATOR_KEY };
	const identity = projected?.identity;
	const origin = sessionDeliveryOrigin(entry);
	const channel = sessionDeliveryChannel(entry);
	if (actor.type === "human" && actor.source !== "profile" && !channel) return { key: UNKNOWN_USAGE_CREATOR_KEY };
	return {
		key: identity?.type === "profile" ? JSON.stringify(["profile", identity.id]) : actor.type === "human" ? JSON.stringify([
			"human",
			actor.source,
			session.agentId,
			channel ?? null,
			origin?.accountId ?? null,
			projected?.id
		]) : actor.type === "agent" ? JSON.stringify([identity?.type ?? "agent", identity?.id ?? projected?.id]) : JSON.stringify(["system", projected?.id ?? null]),
		...projected ? { actor: projected } : {}
	};
}
const usageHandlers = {
	"usage.status": async ({ respond, context, client }) => {
		const coldRead = hasGatewayClientCap(client?.connect?.caps, GATEWAY_CLIENT_CAPS.USAGE_REFRESHING) ? "refresh-marker" : void 0;
		respond(true, await loadUsageStatusStaleWhileRevalidate({
			config: context.getRuntimeConfig(),
			coldRead
		}), void 0);
	},
	"usage.cost": async ({ respond, params, context, client }) => {
		const dateRange = resolveUsageDateRangeOrRespond(params ?? {}, respond);
		if (!dateRange) return;
		const { interpretation: dateInterpretation, range } = dateRange;
		const config = context.getRuntimeConfig();
		if (!isGatewayAdmin(client ?? null) && operatorSessionCap(client ?? null, config) === "none") {
			respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, "Aggregate usage includes sessions hidden by your operator role; ask an administrator to review Gateway-wide usage."));
			return;
		}
		const { startMs, endMs } = range;
		const agentId = normalizeOptionalString(params?.agentId);
		if (params?.agentScope === "all" && agentId) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "agentScope=all cannot be combined with agentId"));
			return;
		}
		const agentScope = params?.agentScope === "all" ? "all" : void 0;
		let effectiveAgentId = agentId;
		if (!agentScope && !effectiveAgentId) {
			const requestedAgent = resolveRequestedSessionAgentId(config, "main");
			if (!requestedAgent.ok) {
				respond(false, void 0, requestedAgent.error);
				return;
			}
			effectiveAgentId = requestedAgent.agentId;
		}
		respond(true, await loadCostUsageSummaryCached({
			startMs,
			endMs,
			dayBucket: resolveDayBucket(dateInterpretation),
			config,
			agentId: effectiveAgentId,
			agentScope
		}), void 0);
	},
	"sessions.usage": async ({ respond, params, context, client }) => {
		if (!assertValidParams(params, validateSessionsUsageParams, "sessions.usage", respond)) return;
		const p = params;
		const dateRange = resolveUsageDateRangeOrRespond(p, respond);
		if (!dateRange) return;
		const { interpretation: dateInterpretation, range } = dateRange;
		const config = context.getRuntimeConfig();
		const sessionCap = operatorSessionCap(client ?? null, config);
		const visibilityFilter = sessionCap === "none" ? createSessionListEntryFilter({
			client: client ?? null,
			cfg: config
		}) : void 0;
		const profileId = gatewayClientSessionCreator(client ?? null)?.id;
		const visibilityIdentity = sessionCap && profileId ? `${profileId}:${sessionCap}` : void 0;
		const { startMs, endMs, includeUntimestamped } = range;
		const dayBucket = resolveDayBucket(dateInterpretation);
		const limit = typeof p.limit === "number" && Number.isFinite(p.limit) ? p.limit : 50;
		const includeContextWeight = p.includeContextWeight ?? false;
		const creatorKey = normalizeOptionalString(p.creatorKey);
		const specificKey = normalizeOptionalString(p.key) ?? null;
		const requestedAgentId = normalizeOptionalString(p.agentId);
		const requestedAllAgents = p.agentScope === "all";
		if (requestedAllAgents && (requestedAgentId || specificKey)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "agentScope=all cannot be combined with key or agentId"));
			return;
		}
		const specificSessionOwner = specificKey ? resolveRequestedSessionAgentId(config, specificKey, requestedAgentId) : void 0;
		if (specificSessionOwner && !specificSessionOwner.ok) {
			respond(false, void 0, specificSessionOwner.error);
			return;
		}
		const implicitAgent = !requestedAllAgents && !specificSessionOwner?.agentId && !requestedAgentId ? resolveRequestedSessionAgentId(config, "main") : void 0;
		if (implicitAgent && !implicitAgent.ok) {
			respond(false, void 0, implicitAgent.error);
			return;
		}
		const effectiveAgentId = requestedAllAgents ? void 0 : normalizeAgentId(specificSessionOwner?.agentId ?? requestedAgentId ?? implicitAgent?.agentId);
		const groupingMode = p.groupBy === "family" || p.includeHistorical === true ? "family" : "instance";
		let result;
		try {
			result = await loadSessionsUsageResultCached({
				configRef: config,
				...effectiveAgentId ? { agentId: effectiveAgentId } : { agentScope: "all" },
				startMs,
				endMs,
				includeUntimestamped,
				dayBucket,
				limit,
				groupingMode,
				specificKey,
				includeContextWeight,
				creatorKey,
				...visibilityIdentity ? { visibilityIdentity } : {},
				load: async () => {
					const now = Date.now();
					const visibleEntries = await selectUsageSessions({
						config,
						agentId: effectiveAgentId,
						specificKey,
						groupingMode,
						startMs,
						endMs,
						visibilityFilter
					});
					const profiles = /* @__PURE__ */ new Map();
					const creatorOptions = /* @__PURE__ */ new Map();
					const matchedEntries = visibleEntries.flatMap((entry) => {
						const creator = projectUsageCreator(entry, profiles, config);
						creatorOptions.set(creator.key, creator);
						return !creatorKey || creator.key === creatorKey ? [{
							entry,
							creator
						}] : [];
					});
					const mergedEntries = matchedEntries.map(({ entry }) => entry);
					const sessions = [];
					const accumulator = createUsageAggregateAccumulator();
					const { summaries: usageByEntryIndex, cacheStatus } = await loadUsageSessionSummaries({
						entries: mergedEntries,
						config,
						startMs,
						endMs,
						includeUntimestamped,
						dayBucket
					});
					loadUsageSessionContext(mergedEntries.slice(0, limit), visibilityFilter);
					for (const [entryIndex, { entry: merged, creator }] of matchedEntries.entries()) {
						const agentId = merged.agentId;
						const usage = usageByEntryIndex[entryIndex] ?? null;
						const channel = sessionDeliveryChannel(merged.storeEntry);
						const origin = sessionDeliveryOrigin(merged.storeEntry);
						const chatType = merged.storeEntry?.chatType ?? origin?.chatType;
						accumulator.add({
							usage,
							agentId,
							channel,
							creatorKey: creator.key,
							createdActor: creator.actor
						});
						if (entryIndex < limit) sessions.push({
							key: merged.key,
							label: merged.label,
							sessionId: merged.sessionId,
							scope: merged.scope ?? "instance",
							sessionFamilyKey: merged.sessionFamilyKey,
							currentSessionId: merged.currentSessionId,
							includedSessionIds: merged.includedSessionIds,
							historicalInstanceCount: merged.includedSessionIds?.length,
							updatedAt: merged.updatedAt,
							agentId,
							creatorKey: creator.key,
							createdActor: creator.actor,
							channel,
							chatType,
							origin,
							modelOverride: merged.storeEntry?.modelOverride,
							providerOverride: merged.storeEntry?.providerOverride,
							modelProvider: merged.storeEntry?.modelProvider,
							model: merged.storeEntry?.model,
							usage,
							...!usage ? { computing: true } : {},
							hasContextWeight: Boolean(merged.contextWeight),
							contextWeight: includeContextWeight ? merged.contextWeight ?? null : void 0
						});
					}
					return {
						updatedAt: now,
						startDate: formatDateLabel(startMs, dateInterpretation),
						endDate: formatDateLabel(endMs, dateInterpretation),
						sessions,
						totals: accumulator.totals,
						aggregates: accumulator.finish(),
						creatorOptions: Array.from(creatorOptions.values()),
						cacheStatus
					};
				}
			});
		} catch (err) {
			if (err instanceof UsageSessionInvalidRequestError) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, err.message));
				return;
			}
			throw err;
		}
		respond(true, result, void 0);
	},
	"sessions.usage.timeseries": async ({ respond, params, context }) => {
		const resolved = await resolveSessionUsageFileOrRespond(params, "timeseries", respond, context.getRuntimeConfig());
		if (!resolved) return;
		const { config, key, agentId, sessionId, sessionFile } = resolved;
		const timeseries = await loadSessionUsageTimeSeries({
			sessionId,
			sessionFile,
			config,
			agentId,
			maxPoints: 200
		});
		if (!timeseries) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `No transcript found for session: ${key}`));
			return;
		}
		respond(true, timeseries, void 0);
	},
	"sessions.usage.logs": async ({ respond, params, context }) => {
		const limit = typeof params?.limit === "number" && Number.isFinite(params.limit) ? Math.min(params.limit, 1e3) : 200;
		const resolved = await resolveSessionUsageFileOrRespond(params, "logs", respond, context.getRuntimeConfig());
		if (!resolved) return;
		const { config, agentId, sessionId, sessionFile } = resolved;
		respond(true, { logs: await loadSessionLogs({
			sessionId,
			sessionFile,
			config,
			agentId,
			limit
		}) ?? [] }, void 0);
	}
};
//#endregion
export { usageHandlers as t };
