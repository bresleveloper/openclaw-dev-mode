import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { r as getAsyncWorkSignal, s as trackAsyncWork, t as AsyncWorkScope } from "./async-work-scope-BH2yUdBz.mjs";
import "./src-Djeo9OvP.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { o as racePromiseWithAbortSignal } from "./src-Bzfi3cQM.mjs";
import { f as readDatabasePathIdentitySync } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { r as getActiveRemoteModelCatalog } from "./remote-overlay-ClWDV070.mjs";
import { r as readSessionRowChangeRevision } from "./session-row-changes-vFaNnKNM.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { a as hasGatewayClientCap, t as GATEWAY_CLIENT_CAPS } from "./client-info-BgcoFakQ.mjs";
import { Ba as validateSessionsUsageParams, Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { o as resolveSessionFilePathCore, s as resolveSessionFilePathOptions } from "./paths-YgcBNLgG.mjs";
import { c as readSessionTranscriptUpdateVersion } from "./transcript-events-D3brcRJS.mjs";
import { g as readUserProfileVersion } from "./user-profile-events-CXjmX5Qy.mjs";
import { h as resolveSessionAgentId } from "./agent-scope-DXrnO3F4.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-uO0pz59U.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { _ as readGatewayAccessRevision, o as operatorSessionCap } from "./operator-role-policy-Coro3qc5.mjs";
import { n as sessionDeliveryChannel, r as sessionDeliveryOrigin } from "./delivery-context.read-CR06zOJ4.mjs";
import { m as sessionCreatorProfileId } from "./session-entry-lineage-B7Mubzwj.mjs";
import { n as parseSqliteSessionFileMarker } from "./legacy-sqlite-marker-CkjJ0jcJ.mjs";
import { s as withSessionHistoryWorkerDatabases } from "./session-transcript-worker-runtime-DyHfVUVm.mjs";
import { r as resolveRequestedSessionAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import { s as resolveStoredSessionKeyForAgentStore } from "./session-store-key-DKpto8R6.mjs";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.mjs";
import { t as listGatewayAgentsBasic } from "./agent-list-CCh58b5o.mjs";
import { i as gatewayClientSessionCreator } from "./gateway-client-identity-DXWhtQve.mjs";
import { d as isGatewayAdmin } from "./session-sharing-policy-vx7GWqzs.mjs";
import { n as getSessionRowProjection } from "./session-row-projection-access-BUm5f-cY.mjs";
import { t as SessionMutationFactsUnavailableError } from "./session-sharing-incognito-DepuXzQy.mjs";
import { t as findCanonicalStoreMatch } from "./session-utils-store-selection-DIMLgaMc.mjs";
import { t as prepareSessionMutationFacts } from "./session-sharing-preparation-DAfvBDLL.mjs";
import { r as resolveGatewaySessionStoreTargetInWorker } from "./session-utils-store-worker-u3lCvEEg.mjs";
import { c as prepareSessionSharingProfiles, o as prepareProjectedSessionSharing, r as createSessionListEntryFilter } from "./session-sharing-read-B9_xLej9.mjs";
import "./session-sharing-DuL10izq.mjs";
import { t as getSessionCostUsageUpdatedAt } from "./session-cost-usage-events-BxUvxfAU.mjs";
import { i as projectSessionActor } from "./session-identity-projection-sgwF_hD_.mjs";
import { r as resolveGatewaySessionDisplayName } from "./session-utils-display-DdkO-Qt-.mjs";
import { t as resolvePreferredSessionKeyForSessionIdMatches } from "./session-id-resolution-B3ptFjot.mjs";
import { t as assertValidParams } from "./validation--xIH1Pj-.mjs";
import { a as resolveTimezone, i as resolveTimeZoneDayStartMs, t as createTimeZoneDayKeyFormatter } from "./format-datetime-DS_okl6M.mjs";
import { r as createEmptyCostUsageTotals, t as addCostUsageTotals } from "./session-cost-usage-totals-Blmg-HFT.mjs";
import { c as createUsageAggregateAccumulator, i as createSessionCostSummaryAccumulator, s as UNKNOWN_USAGE_CREATOR_KEY } from "./session-cost-usage-rollup-EJwp1CTx.mjs";
import { n as loadCostUsageSummaryFromCache, r as loadSessionCostSummariesFromCache, s as resolveUsageCostWorkerDayBucket } from "./session-cost-usage-cache-runtime-CYTPw1GD.mjs";
import { a as resolveUsageSessionSource, i as loadSessionUsageTimeSeries, r as loadSessionLogs, t as discoverAllSessions } from "./session-cost-usage-DW7QuRUA.mjs";
import { t as loadCombinedSessionStoreForGatewayCoreAsync } from "./combined-store-gateway-read-CLNpi_AQ.mjs";
import { n as loadUsageStatusStaleWhileRevalidate } from "./models-auth-status-usage-cache-4i0_JxOF.mjs";
import fs from "node:fs";
//#region src/shared/usage-query.ts
function matchesGlob(value, pattern) {
	const text = value.toLowerCase();
	let cursor = 0;
	let token = 0;
	let star = -1;
	let retry = 0;
	const matchesWildcard = (index) => !/[\r\n\u2028\u2029]/.test(text[index]);
	while (cursor < text.length) if (pattern[token] === "*") {
		star = token++;
		retry = cursor;
	} else if (token < pattern.length && (pattern[token] === "?" ? matchesWildcard(cursor) : pattern[token] === text[cursor])) {
		token++;
		cursor++;
	} else if (star >= 0 && retry < text.length && matchesWildcard(retry)) {
		cursor = ++retry;
		token = star + 1;
	} else return false;
	while (pattern[token] === "*") token++;
	return token === pattern.length;
}
const parseQueryNumber = (value) => {
	let raw = normalizeLowercaseStringOrEmpty(value);
	if (!raw) return null;
	if (raw.startsWith("$")) raw = raw.slice(1);
	let multiplier = 1;
	if (raw.endsWith("k")) {
		multiplier = 1e3;
		raw = raw.slice(0, -1);
	} else if (raw.endsWith("m")) {
		multiplier = 1e6;
		raw = raw.slice(0, -1);
	}
	if (!/^\d+(?:\.\d+)?$/.test(raw)) return null;
	const normalized = Number(raw) * multiplier;
	if (!Number.isFinite(normalized) || !Number.isSafeInteger(Math.round(normalized))) return null;
	return normalized;
};
const extractQueryTerms = (query) => {
	return (query.match(/(?:[^\s"]|"[^"]*")+/g) ?? []).map((token) => {
		const cleaned = token.replace(/^"(.*)"$/u, "$1");
		const idx = cleaned.indexOf(":");
		if (idx > 0) return {
			key: cleaned.slice(0, idx),
			value: cleaned.slice(idx + 1).replace(/^"(.*)"$/u, "$1"),
			raw: cleaned
		};
		return {
			value: cleaned,
			raw: token
		};
	});
};
const normalizeQueryValues = (items) => items.filter((item) => Boolean(item)).map((item) => normalizeLowercaseStringOrEmpty(item));
const getSessionProviders = (session) => normalizeQueryValues([
	session.modelProvider,
	session.providerOverride,
	session.origin?.provider,
	...(session.usage?.modelUsage ?? []).map((entry) => entry.provider)
]);
const getSessionModels = (session) => normalizeQueryValues([session.model, ...(session.usage?.modelUsage ?? []).map((entry) => entry.model)]);
const getSessionTools = (session) => (session.usage?.toolUsage?.tools ?? []).map((tool) => normalizeLowercaseStringOrEmpty(tool.name));
const HAS_PREDICATES = {
	tools: (session) => (session.usage?.toolUsage?.totalCalls ?? 0) > 0,
	errors: (session) => (session.usage?.messageCounts?.errors ?? 0) > 0,
	context: (session) => session.hasContextWeight === true,
	usage: (session) => Boolean(session.usage),
	model: (session) => getSessionModels(session).length > 0,
	provider: (session) => getSessionProviders(session).length > 0
};
const atLeast = (value, threshold) => value >= threshold;
const atMost = (value, threshold) => value <= threshold;
const NUMERIC_QUERY_SPECS = {
	mintokens: [(session) => session.usage?.totalTokens ?? 0, atLeast],
	maxtokens: [(session) => session.usage?.totalTokens ?? 0, atMost],
	mincost: [(session) => session.usage?.totalCost ?? 0, atLeast],
	maxcost: [(session) => session.usage?.totalCost ?? 0, atMost],
	minmessages: [(session) => session.usage?.messageCounts?.total ?? 0, atLeast],
	maxmessages: [(session) => session.usage?.messageCounts?.total ?? 0, atMost]
};
const QUERY_KEYS = /* @__PURE__ */ new Set([
	"agent",
	"channel",
	"chat",
	"provider",
	"model",
	"tool",
	"label",
	"key",
	"session",
	"id",
	"has",
	...Object.keys(NUMERIC_QUERY_SPECS)
]);
const MULTI_VALUE_QUERY_KEYS = /* @__PURE__ */ new Set([
	"channel",
	"provider",
	"model",
	"tool"
]);
const matchesEverySession = () => true;
const prepareUsageQuery = (term, key, warnings) => {
	if (term.key && !QUERY_KEYS.has(key)) {
		warnings.push(`Unknown filter: ${term.key}`);
		return matchesEverySession;
	}
	if (term.key && term.value === "") warnings.push(`Missing value for ${term.key}`);
	const value = normalizeLowercaseStringOrEmpty(term.value ?? "");
	const numericSpec = Object.hasOwn(NUMERIC_QUERY_SPECS, key) ? NUMERIC_QUERY_SPECS[key] : void 0;
	const threshold = numericSpec && term.value ? parseQueryNumber(term.value) : null;
	if (numericSpec && term.value && threshold === null) warnings.push(`Invalid number for ${term.key}`);
	if (key === "has") {
		const predicate = Object.hasOwn(HAS_PREDICATES, value) ? HAS_PREDICATES[value] : void 0;
		if (term.value && !predicate) warnings.push(`Unknown has:${term.value}`);
		return predicate ?? matchesEverySession;
	}
	if (!value) return matchesEverySession;
	if (!term.key) return (session) => normalizeQueryValues([
		session.label,
		session.key,
		session.sessionId
	]).some((text) => text.includes(value));
	switch (key) {
		case "agent": return (session) => normalizeLowercaseStringOrEmpty(session.agentId).includes(value);
		case "channel": return (session) => normalizeLowercaseStringOrEmpty(session.channel).includes(value);
		case "chat": return (session) => normalizeLowercaseStringOrEmpty(session.chatType).includes(value);
		case "provider": return (session) => getSessionProviders(session).some((provider) => provider.includes(value));
		case "model": return (session) => getSessionModels(session).some((model) => model.includes(value));
		case "tool": return (session) => getSessionTools(session).some((tool) => tool.includes(value));
		case "label": return (session) => normalizeLowercaseStringOrEmpty(session.label).includes(value);
		case "key":
		case "session":
		case "id":
			if (value.includes("*") || value.includes("?")) return (session) => matchesGlob(session.key, value) || (session.sessionId ? matchesGlob(session.sessionId, value) : false);
			return (session) => normalizeLowercaseStringOrEmpty(session.key).includes(value) || normalizeLowercaseStringOrEmpty(session.sessionId).includes(value);
	}
	if (!numericSpec || threshold === null) return matchesEverySession;
	const [getValue, matches] = numericSpec;
	return (session) => (!(key.endsWith("tokens") || key.endsWith("cost")) || session.usage?.usageReport?.state !== "unavailable") && matches(getValue(session), threshold);
};
const filterSessionsByQuery = (sessions, query) => {
	const terms = extractQueryTerms(query);
	if (terms.length === 0) return {
		sessions,
		warnings: []
	};
	const warnings = [];
	const categoricalTerms = /* @__PURE__ */ new Map();
	const predicates = terms.map((term) => {
		const key = normalizeLowercaseStringOrEmpty(term.key ?? "");
		const predicate = prepareUsageQuery(term, key, warnings);
		if (!MULTI_VALUE_QUERY_KEYS.has(key)) return predicate;
		const alternatives = categoricalTerms.get(key) ?? [];
		if (term.value) alternatives.push(predicate);
		categoricalTerms.set(key, alternatives);
		return (session) => alternatives.length === 0 || alternatives.some((match) => match(session));
	});
	return {
		sessions: sessions.filter((session) => predicates.every((match) => match(session))),
		warnings
	};
};
//#endregion
//#region src/shared/usage-overview.ts
const PAGE_SIZE = 50;
function createCalendar(bucket) {
	const formatter = bucket.mode === "time-zone" ? new Intl.DateTimeFormat("en-US", {
		timeZone: bucket.timeZone,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hourCycle: "h23"
	}) : void 0;
	const cache = /* @__PURE__ */ new Map();
	function at(timestamp) {
		const found = cache.get(timestamp);
		if (found) return found;
		const date = new Date(timestamp + (bucket.mode === "utc-offset" ? bucket.utcOffsetMinutes * 6e4 : 0));
		let year = date.getUTCFullYear(), month = date.getUTCMonth() + 1, day = date.getUTCDate();
		let hour = date.getUTCHours(), minute = date.getUTCMinutes(), second = date.getUTCSeconds();
		if (formatter) {
			const parts = formatter.formatToParts(timestamp);
			const value = (type) => Number(parts.find((part) => part.type === type)?.value);
			year = value("year");
			month = value("month");
			day = value("day");
			hour = value("hour");
			minute = value("minute");
			second = value("second");
		}
		const calendarMs = Date.UTC(year, month - 1, day, hour, minute, second);
		const result = {
			date: `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
			hour,
			minute,
			second,
			weekday: new Date(Date.UTC(year, month - 1, day)).getUTCDay(),
			offset: calendarMs - (timestamp - (timestamp % 1e3 + 1e3) % 1e3)
		};
		cache.set(timestamp, result);
		return result;
	}
	function quarter(date, index) {
		if (!Number.isInteger(index) || index < 0 || index > 95 || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
		const time = Date.parse(`${date}T00:00:00Z`);
		if (!Number.isFinite(time) || new Date(time).toISOString().slice(0, 10) !== date) return null;
		return at(time + index * 9e5);
	}
	function nextHour(timestamp) {
		const current = at(timestamp);
		const next = timestamp + (60 - current.minute) * 6e4 - current.second * 1e3 - (timestamp % 1e3 + 1e3) % 1e3;
		if (at(next - 1).offset === current.offset) return next;
		let low = timestamp + 1, high = next - 1;
		while (low < high) {
			const middle = low + Math.floor((high - low) / 2);
			if (at(middle).offset === current.offset) low = middle + 1;
			else high = middle;
		}
		return low;
	}
	return {
		at,
		quarter,
		nextHour
	};
}
function visitHours(session, calendar, inclusive, visit) {
	const start = session.usage?.firstActivity ?? session.updatedAt;
	const end = session.usage?.lastActivity ?? session.updatedAt;
	if (!start || !end) return false;
	const low = Math.min(start, end), high = Math.max(start, end);
	let cursor = low;
	while (cursor <= high) {
		const next = cursor === high ? cursor : Math.min(calendar.nextHour(cursor), high);
		const { hour, weekday } = calendar.at(cursor);
		if (visit(hour, weekday, low === high ? 1 : (next - cursor) / (high - low)) === false) break;
		if (cursor === high || !inclusive && next === high) break;
		cursor = next;
	}
	return true;
}
function touchesHours(session, hours, calendar) {
	if (hours.size === 0) return true;
	let precise = false;
	for (const value of session.usage?.utcQuarterHourTokenUsage ?? []) {
		if (value.totalTokens <= 0) continue;
		const mapped = calendar.quarter(value.date, value.quarterIndex);
		if (!mapped) continue;
		precise = true;
		if (hours.has(mapped.hour)) return true;
	}
	if (precise) return false;
	let touches = false;
	visitHours(session, calendar, true, (hour) => {
		touches = hours.has(hour);
		return !touches;
	});
	return touches;
}
function sessionRowTotals(session, days) {
	const usage = session.usage;
	if (!days.size || !usage?.dailyBreakdown?.length) return usage ?? createEmptyCostUsageTotals();
	const totals = createEmptyCostUsageTotals();
	for (const day of usage.dailyBreakdown) if (days.has(day.date)) addCostUsageTotals(totals, {
		...day,
		totalTokens: day.tokens,
		totalCost: day.cost
	});
	return totals;
}
function compareUsageOverviewSessions(options) {
	if (options.recentKeys) {
		const recentKeys = options.recentKeys;
		return (a, b) => recentKeys.indexOf(a.key) - recentKeys.indexOf(b.key);
	}
	const days = new Set(options.selectedDays);
	const rowTotals = /* @__PURE__ */ new Map();
	const totals = (entry) => {
		let result = rowTotals.get(entry);
		if (!result) {
			result = sessionRowTotals(entry, days);
			rowTotals.set(entry, result);
		}
		return result;
	};
	const value = (entry) => {
		switch (options.sort) {
			case "tokens": return totals(entry).totalTokens;
			case "cost": return totals(entry).totalCost;
			case "messages": return entry.usage?.messageCounts?.total ?? 0;
			case "errors": return entry.usage?.messageCounts?.errors ?? 0;
			default: return entry.updatedAt ?? 0;
		}
	};
	const direction = options.sortDirection === "asc" ? -1 : 1;
	return (a, b) => direction * (value(b) - value(a) || (b.updatedAt ?? 0) - (a.updatedAt ?? 0) || (a.label || a.key).localeCompare(b.label || b.key));
}
function compactSession(session, days) {
	if (!session.usage) return session;
	const row = sessionRowTotals(session, days);
	const usage = {
		...session.usage,
		...row,
		usageReport: row.usageReport
	};
	for (const field of [
		"dailyBreakdown",
		"dailyMessageCounts",
		"dailyModelUsage",
		"dailyLatency",
		"utcQuarterHourTokenUsage",
		"utcQuarterHourMessageCounts",
		"activityDates",
		"sessionFile"
	]) delete usage[field];
	return {
		...session,
		usage
	};
}
function selectUsageOverviewSessions(sessions, options, calendar) {
	const days = new Set(options.selectedDays);
	const hours = new Set(options.selectedHours);
	const queried = filterSessionsByQuery(sessions.filter((session) => touchesHours(session, hours, calendar)), options.query ?? "");
	const matched = queried.sessions.filter((session) => !days.size || (session.usage?.activityDates?.length ? session.usage.activityDates.some((day) => days.has(day)) : Boolean(session.updatedAt && days.has(calendar.at(session.updatedAt).date))));
	const selected = new Set(options.selectedSessions);
	const scoped = selected.size ? matched.filter((session) => selected.has(session.key)) : matched;
	const recent = options.recentKeys === void 0 ? void 0 : new Set(options.recentKeys);
	return {
		days,
		queried,
		matched,
		selected,
		scoped,
		roster: recent ? matched.filter((session) => recent.has(session.key)) : matched
	};
}
function usageOverviewPage(roster, options) {
	return roster.toSorted(compareUsageOverviewSessions(options)).slice(options.offset ?? 0, (options.offset ?? 0) + (options.limit ?? PAGE_SIZE));
}
/** Selects rows for context hydration without calculating the full report twice. */
function selectUsageOverviewPage(params) {
	const { roster } = selectUsageOverviewSessions(params.rows, params.options, createCalendar(params.dayBucket));
	return usageOverviewPage(roster, params.options);
}
function buildUsageOverview(params) {
	const { options, rows: sessions } = params;
	const calendar = createCalendar(params.dayBucket);
	const filters = {
		agent: /* @__PURE__ */ new Set(),
		channel: /* @__PURE__ */ new Set(),
		provider: /* @__PURE__ */ new Set(),
		model: /* @__PURE__ */ new Set(),
		tool: /* @__PURE__ */ new Set()
	};
	for (const session of sessions) {
		if (session.agentId) filters.agent.add(session.agentId);
		if (session.channel) filters.channel.add(session.channel);
		for (const provider of [
			session.modelProvider,
			session.providerOverride,
			session.origin?.provider
		]) if (provider) filters.provider.add(provider);
		if (session.model) filters.model.add(session.model);
		for (const model of session.usage?.modelUsage ?? []) {
			if (model.provider) filters.provider.add(model.provider);
			if (model.model) filters.model.add(model.model);
		}
		for (const tool of session.usage?.toolUsage?.tools ?? []) filters.tool.add(tool.name);
	}
	const { days, queried, matched, selected, scoped, roster } = selectUsageOverviewSessions(sessions, options, calendar);
	const selectedSources = new Map(sessions.filter((session) => selected.has(session.key)).map((session) => [session.key, session]));
	const selectedUsageComplete = selected.size ? selectedSources.size === selected.size && [...selectedSources.values()].every((session) => session.usage && !session.computing && session.usage.staleSince === void 0 && !session.usage.refreshing) : void 0;
	const selectedRows = new Map(selected.size ? scoped.map((session) => [session.key, session]) : []);
	const toRow = (session) => params.compact === false ? session : compactSession(session, days);
	const accumulator = createUsageAggregateAccumulator();
	const overview = {
		total: roster.length,
		unfilteredSessionCount: sessions.length,
		selectedSessionCount: 0,
		selectedRowCount: scoped.length,
		selectedUsageComplete,
		selectedRows: [...selected].flatMap((key) => {
			const session = selectedRows.get(key);
			return session ? [toRow(session)] : [];
		}),
		tableSessionCount: matched.length,
		tableTotals: {
			tokens: 0,
			cost: 0,
			errors: 0
		},
		offset: options.offset ?? 0,
		limit: options.limit ?? PAGE_SIZE,
		queryWarnings: queried.warnings,
		hourTokens: Array.from({ length: 24 }, () => 0),
		weekdayTokens: Array.from({ length: 7 }, () => 0),
		hasTimelineData: false,
		durationMs: 0,
		durationCount: 0,
		hourlyMessages: Array.from({ length: 24 }, () => 0),
		hourlyErrors: Array.from({ length: 24 }, () => 0),
		filterOptions: {
			agent: [...filters.agent].toSorted(),
			channel: [...filters.channel].toSorted(),
			provider: [...filters.provider].toSorted(),
			model: [...filters.model].toSorted(),
			tool: [...filters.tool].toSorted()
		}
	};
	for (const session of matched) {
		const row = sessionRowTotals(session, days);
		overview.tableTotals.tokens += row.totalTokens;
		overview.tableTotals.cost += row.totalCost;
		if (row.usageReport?.state === "unavailable") overview.tableTotals.usageReport = row.usageReport;
		overview.tableTotals.errors += session.usage?.messageCounts?.errors ?? 0;
	}
	for (const session of scoped) {
		accumulator.add(session);
		const usage = session.usage;
		if (!usage) continue;
		if ((usage.durationMs ?? 0) > 0) {
			overview.durationMs += usage.durationMs;
			overview.durationCount++;
		}
		if (usage.totalTokens > 0) {
			let precise = false;
			for (const value of usage.utcQuarterHourTokenUsage ?? []) {
				if (value.totalTokens <= 0) continue;
				const mapped = calendar.quarter(value.date, value.quarterIndex);
				if (!mapped) continue;
				precise = true;
				overview.hourTokens[mapped.hour] += value.totalTokens;
				overview.weekdayTokens[mapped.weekday] += value.totalTokens;
			}
			overview.hasTimelineData = overview.hasTimelineData || precise;
			if (!precise) overview.hasTimelineData = visitHours(session, calendar, false, (hour, weekday, share) => {
				overview.hourTokens[hour] += usage.totalTokens * share;
				overview.weekdayTokens[weekday] += usage.totalTokens * share;
			}) || overview.hasTimelineData;
		}
		if (usage.messageCounts?.total) {
			if (usage.utcQuarterHourMessageCounts?.length) for (const value of usage.utcQuarterHourMessageCounts) {
				const mapped = calendar.quarter(value.date, value.quarterIndex);
				if (!mapped) continue;
				overview.hourlyMessages[mapped.hour] += value.total;
				overview.hourlyErrors[mapped.hour] += value.errors;
			}
			else visitHours(session, calendar, false, (hour, _weekday, share) => {
				overview.hourlyMessages[hour] += usage.messageCounts.total * share;
				overview.hourlyErrors[hour] += usage.messageCounts.errors * share;
			});
		}
	}
	overview.usageReport = accumulator.totals.usageReport;
	const aggregates = accumulator.finish();
	overview.selectedSessionCount = aggregates.sessionCount ?? 0;
	let totals = accumulator.totals;
	if (days.size) {
		totals = createEmptyCostUsageTotals();
		for (const day of aggregates.costDaily ?? []) if (days.has(day.date)) addCostUsageTotals(totals, day);
		const calendarDaily = /* @__PURE__ */ new Map();
		for (const session of queried.sessions) {
			if (selected.size && !selected.has(session.key)) continue;
			for (const day of session.usage?.dailyBreakdown ?? []) {
				const dayTotals = calendarDaily.get(day.date) ?? createEmptyCostUsageTotals();
				addCostUsageTotals(dayTotals, day);
				calendarDaily.set(day.date, dayTotals);
			}
		}
		aggregates.costDaily = [...calendarDaily].map(([date, dayTotals]) => Object.assign({ date }, dayTotals)).toSorted((a, b) => a.date.localeCompare(b.date));
		for (const creator of aggregates.byCreator ?? []) {
			creator.daily = creator.daily.filter((day) => days.has(day.date));
			creator.totals = createEmptyCostUsageTotals();
			for (const day of creator.daily) addCostUsageTotals(creator.totals, day);
			creator.sessionCount = creator.sessionActivity.reduce((count, activity) => count + (activity.dates.some((day) => days.has(day)) ? activity.sessionCount : 0), 0);
		}
	}
	return {
		sessions: usageOverviewPage(roster, options).map(toRow),
		totals,
		aggregates,
		overview
	};
}
//#endregion
//#region src/gateway/server-methods/usage-creator.ts
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
//#endregion
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
	if (interpretation.mode === "gateway") {
		const local = new Date(year, monthIndex, day);
		if (local.getFullYear() !== year || local.getMonth() !== monthIndex || local.getDate() !== day) return;
		return local.getTime();
	}
	if (interpretation.mode === "time-zone") return resolveTimeZoneDayStartMs(formatDateParts(year, monthIndex, day), interpretation.timeZone);
	const utcStart = Date.UTC(year, monthIndex, day);
	return interpretation.mode === "utc-offset" ? utcStart - interpretation.utcOffsetMinutes * 60 * 1e3 : utcStart;
};
const datePartsToEndMs = (parts, interpretation) => {
	const lookaheadDays = interpretation.mode === "time-zone" || interpretation.mode === "gateway" ? 2 : 1;
	for (let daysAhead = 1; daysAhead <= lookaheadDays; daysAhead += 1) {
		const nextDayStartMs = datePartsToStartMs(shiftDateParts(parts, daysAhead), interpretation);
		if (nextDayStartMs !== void 0) return nextDayStartMs - 1;
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
const RANGE_DAYS = /* @__PURE__ */ new Map([
	["all", "all"],
	["7d", 7],
	["30d", 30],
	["90d", 90],
	["1y", 365]
]);
/**
* Get date range from params (startDate/endDate or days).
* Falls back to last 30 days if not provided.
*/
const resolveDateRange = (params, resolvedInterpretation) => {
	const dates = {
		startDate: parseDateParts(params.startDate),
		endDate: parseDateParts(params.endDate)
	};
	for (const field of ["startDate", "endDate"]) {
		const raw = params[field];
		if (raw != null && (typeof raw !== "string" || raw.trim() !== "") && dates[field] === void 0) return {
			ok: false,
			error: `invalid ${field}: expected a valid YYYY-MM-DD calendar date`
		};
	}
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
	const { startDate: startDateParts, endDate: endDateParts } = dates;
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
	const rangeDays = RANGE_DAYS.get(params.range);
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
function setUsageCache(cache, cacheKey, entry, maxEntries) {
	const cutoff = Date.now() - USAGE_CACHE_TTL_MS;
	for (const [key, candidate] of cache) if (key !== cacheKey && !candidate.inFlight && candidate.lastAccessedAt <= cutoff) cache.delete(key);
	if (!cache.has(cacheKey) && cache.size >= maxEntries) {
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
	if (cached?.value && cached.updatedAt !== void 0 && (params.revisionOnly || now - cached.updatedAt < USAGE_CACHE_TTL_MS)) return cached.value;
	if (cached?.inFlight && params.shareInFlight !== false) return cached.value && cached.updatedAt ? cached.value : await cached.inFlight;
	const entry = cached ? {
		...cached,
		inFlight: void 0
	} : {
		configRef,
		revision,
		lastAccessedAt: now
	};
	const inFlight = trackAsyncWork(() => params.load().then((value) => {
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
		entry.inFlight = void 0;
		entry.lastAccessedAt = Date.now();
	}));
	entry.inFlight = inFlight;
	setUsageCache(cache, cacheKey, entry, params.maxEntries ?? USAGE_CACHE_MAX);
	return entry.value && entry.updatedAt ? entry.value : await inFlight;
}
//#endregion
//#region src/gateway/server-methods/usage-session-loading.ts
const USAGE_AGENT_LOAD_CONCURRENCY = 12;
const USAGE_REPORT_PUBLICATION_WAIT_MS = 100;
const USAGE_REPORT_BATCH_SIZE = 256;
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
	return (await runUsageAgentTasks((requestedAgentId ? [{ id: normalizeAgentId(requestedAgentId) }] : (await listGatewayAgentsBasic(params.config)).agents).map((agent) => async () => {
		const agentId = normalizeAgentId(agent.id);
		return (await discoverAllSessions({
			agentId,
			startMs: params.startMs,
			endMs: params.endMs
		})).map((session) => Object.assign({}, session, { agentId }));
	}))).flat().toSorted((a, b) => b.mtime - a.mtime);
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
	const computing = Array(mergedEntries.length).fill(false);
	const sessionsByAgent = /* @__PURE__ */ new Map();
	for (const [entryIndex, merged] of mergedEntries.entries()) for (const { sessionId, sessionFile, transcriptFile } of merged.instances) {
		const agentSessions = sessionsByAgent.get(merged.agentId) ?? [];
		agentSessions.push({
			entryIndex,
			sessionId,
			sessionFile,
			transcriptFile
		});
		sessionsByAgent.set(merged.agentId, agentSessions);
	}
	await runUsageAgentTasks(Array.from(sessionsByAgent.entries()).map(([agentId, agentSessions]) => async () => {
		let usage;
		let reportBudgetBytes;
		for (let offset = 0; offset < agentSessions.length;) {
			const batch = agentSessions.slice(offset, offset + USAGE_REPORT_BATCH_SIZE);
			const loaded = await params.read(() => loadSessionCostSummariesFromCache({
				sessions: batch,
				config,
				agentId,
				startMs,
				endMs,
				includeUntimestamped,
				dayBucket,
				maxPublicationWaitMs: USAGE_REPORT_PUBLICATION_WAIT_MS,
				reportBudgetBytes
			}), () => ({
				summaries: batch.map(() => null),
				remainingReportBytes: 0,
				cacheStatus: {
					status: "partial",
					cachedFiles: 0,
					pendingFiles: batch.length,
					staleFiles: 0
				}
			}));
			reportBudgetBytes = loaded.remainingReportBytes;
			cacheStatus = mergeUsageCacheStatus(cacheStatus, loaded.cacheStatus);
			for (const [index, summary] of loaded.summaries.entries()) {
				const session = expectDefined(batch[index], "usage batch entry");
				if (!summary) computing[session.entryIndex] = true;
				if (summary) {
					const merged = expectDefined(mergedEntries[session.entryIndex], "usage entry");
					const identity = {
						sessionId: merged.sessionId ?? merged.instances[0]?.sessionId,
						sessionFile: merged.sessionFile ?? merged.instances[0]?.sessionFile
					};
					if (merged.instances.length === 1) {
						usageByEntryIndex[session.entryIndex] = {
							...summary,
							...identity
						};
						continue;
					}
					usage ??= createSessionCostSummaryAccumulator(identity);
					usage.add(summary);
				}
				if (usage && agentSessions[offset + index + 1]?.entryIndex !== session.entryIndex) {
					usageByEntryIndex[session.entryIndex] = usage.finish();
					usage = void 0;
				}
			}
			offset += batch.length;
		}
	}));
	return {
		summaries: usageByEntryIndex,
		computing,
		cacheStatus
	};
}
const USAGE_BUDGET_HINT = "Usage request exceeded its 15-second budget; narrow the date range or select a session.";
function withUsageRequestBudget(handler) {
	return async (request) => {
		const parent = AbortSignal.any([getAsyncWorkSignal(), request.signal].filter((signal) => signal !== void 0));
		const caller = new AsyncWorkScope();
		const data = new AsyncWorkScope();
		const exhausted = /* @__PURE__ */ new Error(USAGE_BUDGET_HINT);
		const cancel = () => {
			caller.beginClose(parent.reason);
			data.beginClose(parent.reason);
		};
		const timer = setTimeout(() => data.beginClose(exhausted), 15e3);
		timer.unref?.();
		parent.addEventListener("abort", cancel, { once: true });
		if (parent.aborted) cancel();
		const budget = {
			hint: USAGE_BUDGET_HINT,
			exhausted: () => data.signal.reason === exhausted,
			async read(load, partial) {
				caller.signal.throwIfAborted();
				if (budget.exhausted()) return partial();
				try {
					const result = await racePromiseWithAbortSignal(() => data.track(load), data.signal, (signal) => signal.reason);
					caller.signal.throwIfAborted();
					data.signal.throwIfAborted();
					return result;
				} catch (error) {
					caller.signal.throwIfAborted();
					if (!budget.exhausted()) throw error;
					return partial();
				}
			}
		};
		try {
			await trackAsyncWork(() => caller.track(() => handler(request, budget)));
		} finally {
			clearTimeout(timer);
			trackAsyncWork(() => AsyncWorkScope.runWhenAllIdle(() => [data, caller], async () => {
				await data.drain();
				await caller.drain();
			})).finally(() => parent.removeEventListener("abort", cancel));
		}
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
		params.overviewKey,
		...params.visibilityIdentity ? [params.visibilityIdentity] : []
	]);
}
async function loadSessionsUsageSnapshotCached(params) {
	return await loadUsageResultCached({
		cache: sessionsUsageCache,
		maxEntries: 8,
		shareInFlight: false,
		cacheKey: sessionsUsageCacheKey(params),
		configRef: params.configRef,
		revision: `${readUserProfileVersion()}:${getSessionCostUsageUpdatedAt()}:${readSessionRowChangeRevision()}:${readSessionTranscriptUpdateVersion()}:${readGatewayAccessRevision()}:${getActiveRemoteModelCatalog(params.configRef)?.revision ?? ""}`,
		revisionOnly: params.overviewKey !== void 0,
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
		revision: `${getSessionCostUsageUpdatedAt()}:${readSessionTranscriptUpdateVersion()}`,
		load: () => allAgents ? loadAllAgentCostUsageSummary(params) : loadCostUsageSummaryFromCache({
			...params,
			agentId: expectDefined(agentId, "non-aggregate usage agent id"),
			requestRefresh: true
		})
	});
}
async function loadAllAgentCostUsageSummary(params) {
	const summaries = await runUsageAgentTasks((await listGatewayAgentsBasic(params.config)).agents.map((agent) => normalizeAgentId(agent.id)).map((agentId) => () => loadCostUsageSummaryFromCache({
		...params,
		agentId,
		requestRefresh: true
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
async function selectUsageSessions(params) {
	const { config, agentId: effectiveAgentId, specificKey, groupingMode, startMs, endMs, visibilityFilter } = params;
	const { store, targetsBySessionKey } = await loadCombinedSessionStoreForGatewayCoreAsync(config, {
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
	function withUsageGrouping(base) {
		const currentInstance = {
			sessionId: base.sessionId,
			sessionFile: base.sessionFile,
			transcriptFile: discoveredByIdentity.get(usageSessionIdentity(base.agentId, base.sessionId))?.transcriptFile
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
		}));
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
			}));
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
async function loadUsageSessionContext(selected, visibilityFilter) {
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
	const groups = [...contextRows];
	const env = captureSessionTranscriptStorageEnvironment(process.env);
	const identities = groups.map(([target]) => readDatabasePathIdentitySync(target.storePath));
	await withSessionHistoryWorkerDatabases(groups.map(([target]) => ({
		agentId: target.agentId,
		path: target.storePath,
		env
	})), async (owners) => {
		const reads = [];
		for (const [index, [, rows]] of groups.entries()) reads.push(await owners[index].readExactEntries({
			env,
			expectedIdentity: identities[index],
			sessionKeys: [...new Set(rows.map(({ storedKey }) => storedKey))],
			projection: "exact",
			snapshotFields: ["systemPromptReport"]
		}));
		for (const owner of owners) owner.assertCurrent();
		for (const [index, [, rows]] of groups.entries()) {
			const entries = new Map(reads[index].entries.map(({ sessionKey, entry }) => [sessionKey, entry]));
			for (const { row, storedKey } of rows) {
				const entry = entries.get(storedKey);
				if (entry?.sessionId === row.sessionId && (!visibilityFilter || visibilityFilter(row.key, entry))) row.contextWeight = entry.systemPromptReport;
			}
		}
	});
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
		const requestedAgentId = params?.agentId;
		const requestedAgentScope = params?.agentScope;
		if (requestedAgentId !== void 0 && typeof requestedAgentId !== "string") {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "agentId must be a string"));
			return;
		}
		if (requestedAgentScope !== void 0 && requestedAgentScope !== "all") {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "agentScope must be 'all' when provided"));
			return;
		}
		const agentId = normalizeOptionalString(requestedAgentId);
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
	"sessions.usage": withUsageRequestBudget(async ({ respond, params, context, client }, budget) => {
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
		const limit = p.projection === "overview" ? 50 : p.limit ?? 50;
		const overviewOptions = p.projection === "overview" || p.query !== void 0 || p.selectedDays !== void 0 || p.selectedHours !== void 0 || p.selectedSessions !== void 0 || p.recentKeys !== void 0 || p.sort !== void 0 || p.sortDirection !== void 0 || p.offset !== void 0 ? {
			limit,
			offset: p.offset,
			query: p.query,
			selectedDays: p.selectedDays,
			selectedHours: p.selectedHours,
			selectedSessions: p.selectedSessions,
			recentKeys: p.recentKeys,
			sort: p.sort,
			sortDirection: p.sortDirection
		} : void 0;
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
			result = await loadSessionsUsageSnapshotCached({
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
				...overviewOptions ? { overviewKey: JSON.stringify([p.projection, overviewOptions]) } : {},
				...visibilityIdentity ? { visibilityIdentity } : {},
				load: async () => {
					const now = Date.now();
					const loadedAccessRevision = readGatewayAccessRevision();
					const loadedSessionRevision = readSessionRowChangeRevision();
					const visibleEntries = await budget.read(() => selectUsageSessions({
						config,
						agentId: effectiveAgentId,
						specificKey,
						groupingMode,
						startMs,
						endMs,
						visibilityFilter
					}), () => []);
					const profiles = /* @__PURE__ */ new Map();
					const matchedEntries = visibleEntries.map((entry) => ({
						entry,
						creator: projectUsageCreator(entry, profiles, config)
					}));
					const mergedEntries = matchedEntries.filter(({ creator }) => !creatorKey || creator.key === creatorKey).map(({ entry }) => entry);
					if (mergedEntries.reduce((count, entry) => count + entry.instances.length, 0) > 2e4) throw new UsageSessionInvalidRequestError("Usage includes more than 20,000 session instances; narrow the date range or select a session.");
					if (extractQueryTerms(overviewOptions?.query ?? "").some((term) => term.key?.toLowerCase() === "has" && term.value.toLowerCase() === "context")) await budget.read(() => loadUsageSessionContext(mergedEntries, visibilityFilter), () => void 0);
					const sessions = [];
					const { summaries, computing, cacheStatus } = await loadUsageSessionSummaries({
						entries: mergedEntries,
						read: budget.read,
						config,
						startMs,
						endMs,
						includeUntimestamped,
						dayBucket
					});
					const usageByEntry = new Map(mergedEntries.map((entry, index) => [entry, {
						usage: summaries[index],
						computing: computing[index]
					}]));
					for (const { entry: merged, creator } of matchedEntries) {
						const loaded = usageByEntry.get(merged);
						const usage = loaded?.usage ?? null;
						const channel = sessionDeliveryChannel(merged.storeEntry);
						const origin = sessionDeliveryOrigin(merged.storeEntry);
						sessions.push({
							key: merged.key,
							label: merged.label,
							sessionId: merged.sessionId,
							scope: merged.scope ?? "instance",
							sessionFamilyKey: merged.sessionFamilyKey,
							currentSessionId: merged.currentSessionId,
							includedSessionIds: merged.includedSessionIds,
							historicalInstanceCount: merged.includedSessionIds?.length,
							updatedAt: merged.updatedAt,
							agentId: merged.agentId,
							creatorKey: creator.key,
							createdActor: creator.actor,
							channel,
							chatType: merged.storeEntry?.chatType ?? origin?.chatType,
							origin,
							modelOverride: merged.storeEntry?.modelOverride,
							providerOverride: merged.storeEntry?.providerOverride,
							modelProvider: merged.storeEntry?.modelProvider,
							model: merged.storeEntry?.model,
							usage,
							...!usage || loaded?.computing ? { computing: true } : {},
							hasContextWeight: Boolean(merged.contextWeight),
							contextWeight: includeContextWeight ? merged.contextWeight ?? null : void 0
						});
					}
					return {
						updatedAt: now,
						sessions,
						cacheStatus: budget.exhausted() ? {
							cachedFiles: 0,
							pendingFiles: 0,
							staleFiles: 0,
							...cacheStatus,
							status: "partial"
						} : cacheStatus,
						sources: visibleEntries,
						accessRevision: loadedAccessRevision,
						sessionRevision: loadedSessionRevision
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
		const sourcesByAgent = /* @__PURE__ */ new Map();
		for (const source of result.sources) {
			const sources = sourcesByAgent.get(source.agentId) ?? /* @__PURE__ */ new Map();
			sources.set(source.key, source);
			sourcesByAgent.set(source.agentId, sources);
		}
		const contextReads = /* @__PURE__ */ new Map();
		const hydratedSources = /* @__PURE__ */ new Set();
		const sourceFor = ({ agentId, key }) => agentId === void 0 ? void 0 : sourcesByAgent.get(agentId)?.get(key);
		const committedEntry = (source) => source.contextTarget && !source.storeEntry?.incognito ? getSessionRowProjection(context)?.readCapabilityEntry({
			agentId: source.agentId,
			storePath: source.contextTarget.storeTarget.storePath,
			key: source.key
		}) : void 0;
		const snapshotIsCurrent = () => result.sessionRevision === readSessionRowChangeRevision() && result.accessRevision === readGatewayAccessRevision() && config === context.getRuntimeConfig();
		try {
			const profiles = await prepareSessionSharingProfiles(client ?? null);
			const prepareUnavailableSources = async () => {
				const signal = getAsyncWorkSignal();
				for (const session of result.sessions) {
					const source = sourceFor(session);
					if (!source || !session.agentId || contextReads.has(source) || !session.hasContextWeight && snapshotIsCurrent() || committedEntry(source) !== void 0) continue;
					signal?.throwIfAborted();
					contextReads.set(source, void 0);
					try {
						const prepared = await prepareSessionMutationFacts({
							cfg: context.getRuntimeConfig(),
							sessionKey: session.key,
							agentId: session.agentId
						});
						if (signal?.aborted) {
							prepared.release();
							signal.throwIfAborted();
						}
						contextReads.set(source, prepared);
					} catch (error) {
						if (!(error instanceof SessionMutationFactsUnavailableError)) throw error;
					}
				}
			};
			const readVisibleRows = () => {
				const currentConfig = context.getRuntimeConfig();
				const { entryFilter: currentFilter, sessionCap: currentSessionCap } = prepareProjectedSessionSharing({
					cfg: currentConfig,
					client: client ?? null,
					profiles,
					isMember: () => false
				});
				return result.sessions.flatMap((session) => {
					const source = sourceFor(session);
					const committed = source && committedEntry(source);
					let current = committed?.entry;
					if (committed === void 0 && source) {
						const prepared = contextReads.get(source);
						if (prepared) try {
							current = prepared.readCurrent(currentConfig).target?.entry;
						} catch (error) {
							if (!(error instanceof SessionMutationFactsUnavailableError)) throw error;
						}
						else if (!contextReads.has(source) && snapshotIsCurrent()) current = source.storeEntry;
					}
					if (source?.storeEntry ? !current || currentFilter && !currentFilter(session.key, current) : currentSessionCap === "none") return [];
					return session.hasContextWeight && current?.sessionId !== session.sessionId ? [{
						...session,
						hasContextWeight: false,
						contextWeight: includeContextWeight ? null : void 0
					}] : [session];
				});
			};
			let visible;
			for (let attempt = 0; attempt < 2; attempt += 1) {
				await budget.read(prepareUnavailableSources, () => void 0);
				visible = readVisibleRows();
				const selected = visible.filter((row) => !creatorKey || row.creatorKey === creatorKey);
				const pageSources = (overviewOptions ? selectUsageOverviewPage({
					rows: selected,
					options: overviewOptions,
					dayBucket: resolveUsageCostWorkerDayBucket(dayBucket)
				}) : selected.slice(0, limit)).flatMap((row) => {
					const source = sourceFor(row);
					return source && !hydratedSources.has(source) ? [source] : [];
				});
				if (pageSources.length === 0) break;
				visible = void 0;
				if (await budget.read(async () => {
					await loadUsageSessionContext(pageSources, visibilityFilter);
					return true;
				}, () => false)) pageSources.forEach((source) => hydratedSources.add(source));
				else break;
				result = {
					...result,
					sessions: result.sessions.map((row) => {
						const source = sourceFor(row);
						return source && hydratedSources.has(source) ? {
							...row,
							hasContextWeight: Boolean(source.contextWeight),
							contextWeight: includeContextWeight ? source.contextWeight ?? null : void 0
						} : row;
					})
				};
			}
			if (!visible) {
				await budget.read(prepareUnavailableSources, () => void 0);
				visible = readVisibleRows();
			}
			const creatorOptions = /* @__PURE__ */ new Map();
			for (const row of visible) if (row.creatorKey) creatorOptions.set(row.creatorKey, {
				key: row.creatorKey,
				actor: row.createdActor
			});
			const selected = visible.filter((row) => !creatorKey || row.creatorKey === creatorKey);
			const accumulator = createUsageAggregateAccumulator();
			if (!overviewOptions) selected.forEach((row) => accumulator.add(row));
			const slice = overviewOptions ? buildUsageOverview({
				rows: selected,
				options: overviewOptions,
				dayBucket: resolveUsageCostWorkerDayBucket(dayBucket),
				compact: p.projection === "overview"
			}) : {
				sessions: selected.slice(0, limit),
				totals: accumulator.totals,
				aggregates: accumulator.finish()
			};
			const partial = budget.exhausted() ? {
				reason: "time-budget",
				message: budget.hint
			} : void 0;
			if (partial && "overview" in slice) slice.overview.queryWarnings.push(partial.message);
			getAsyncWorkSignal()?.throwIfAborted();
			respond(true, {
				...slice,
				sessions: slice.sessions.map((row) => {
					const source = sourceFor(row);
					return source && hydratedSources.has(source) ? row : Object.assign({}, row, {
						hasContextWeight: false,
						contextWeight: void 0
					});
				}),
				updatedAt: result.updatedAt,
				startDate: formatDateLabel(startMs, dateInterpretation),
				endDate: formatDateLabel(endMs, dateInterpretation),
				creatorOptions: [...creatorOptions.values()],
				cacheStatus: partial ? {
					cachedFiles: 0,
					pendingFiles: 0,
					staleFiles: 0,
					...result.cacheStatus,
					status: "partial"
				} : result.cacheStatus,
				...partial ? { partial } : {}
			});
		} finally {
			contextReads.forEach((read) => read?.release());
		}
	}),
	"sessions.usage.timeseries": async ({ respond, params, context }) => {
		const resolved = await resolveSessionUsageFileOrRespond(params, "timeseries", respond, context.getRuntimeConfig());
		if (!resolved) return;
		const timeseries = await loadSessionUsageTimeSeries({
			...resolved,
			maxPoints: 200
		});
		if (!timeseries) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `No transcript found for session: ${resolved.key}`));
			return;
		}
		respond(true, timeseries, void 0);
	},
	"sessions.usage.logs": async ({ respond, params, context }) => {
		const limit = typeof params?.limit === "number" && Number.isFinite(params.limit) ? Math.min(params.limit, 1e3) : 200;
		const resolved = await resolveSessionUsageFileOrRespond(params, "logs", respond, context.getRuntimeConfig());
		if (!resolved) return;
		respond(true, { logs: await loadSessionLogs({
			...resolved,
			limit
		}) ?? [] }, void 0);
	}
};
//#endregion
export { usageHandlers };
