import { s as asFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as resolveRealpathOrAbsolute } from "./boundary-path-BzetEUdq.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { d as parseSessionArchiveTimestamp, f as parseUsageCountedSessionIdFromFileName, s as isSessionArchiveArtifactName, u as isUsageCountedSessionTranscriptFileName, v as materializeSessionArchiveForRead } from "./artifacts-C9weQ_MG.mjs";
import { f as resolveSessionTranscriptsDirForAgent, o as resolveSessionArtifactDirectory, s as resolveSessionFilePathCore } from "./paths-CcMbq5NY.mjs";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.mjs";
import { t as calculateUsageCost } from "./usage-cost-Va5dwVFW.mjs";
import "./src-BpANEEBH.mjs";
import { r as listDurableSqliteTargetPathsForSessionStorePath, s as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-Dcog4O-M.mjs";
import { n as parseSqliteSessionFileMarker, t as formatSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.mjs";
import { E as readTranscriptStatsSync, L as selectVisibleTranscriptEvents, T as readTranscriptStatsBatchReadOnlySync, u as loadTranscriptEventsSync } from "./session-accessor.sqlite-read-BzN7WYll.mjs";
import { T as resolveSessionStorePathForScope, k as listSessionTranscriptArchivesReadOnly, l as loadSessionEntryReadOnly, o as listSessionTranscriptInstances } from "./session-accessor.sqlite-entry-BB2Zsfho.mjs";
import "./session-accessor-l-4ZHvKn.mjs";
import { c as hasRecordedUsageCost, u as normalizeUsage } from "./usage-XXLoqJQC.mjs";
import { t as streamSessionTranscriptLines } from "./transcript-stream-BZUMfFhx.mjs";
import { n as isToolCallContentType } from "./tool-content-ByAb-IhE.mjs";
import fs from "node:fs";
import path from "node:path";
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
const normalizeUsageCostTotalOrigin = (value) => value === "provider-billed" ? value : void 0;
const extractCostBreakdown = (usageRaw) => {
	if (!usageRaw || typeof usageRaw !== "object") return;
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
		totalOrigin: normalizeUsageCostTotalOrigin(cost.totalOrigin)
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
		message,
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
		componentTotal,
		totalTokens: usage.total ?? componentTotal
	};
};
const applyUsageTotals = (totals, usage) => {
	const usageTotals = computeUsageTokenTotals(usage);
	totals.input += usageTotals.input;
	totals.output += usageTotals.output;
	totals.cacheRead += usageTotals.cacheRead;
	totals.cacheWrite += usageTotals.cacheWrite;
	totals.totalTokens += usageTotals.totalTokens;
};
const applyCostBreakdown = (totals, costBreakdown) => {
	if (costBreakdown === void 0 || costBreakdown.total === void 0) return;
	totals.totalCost += costBreakdown.total;
	totals.inputCost += costBreakdown.input ?? 0;
	totals.outputCost += costBreakdown.output ?? 0;
	totals.cacheReadCost += costBreakdown.cacheRead ?? 0;
	totals.cacheWriteCost += costBreakdown.cacheWrite ?? 0;
};
const applyCostTotal = (totals, costTotal, provider, model) => {
	if (costTotal === void 0) {
		totals.missingCostEntries += 1;
		const modelKey = `${normalizeOptionalString(provider) ?? "unknown"}/${normalizeOptionalString(model) ?? "unknown"}`;
		totals.missingCostByModel ??= {};
		totals.missingCostByModel[modelKey] = (totals.missingCostByModel[modelKey] ?? 0) + 1;
		return;
	}
	totals.totalCost += costTotal;
};
function needsUsageCostEstimate(entry) {
	return Boolean(entry?.usage) && !((entry?.costTotal ?? 0) > 0 || hasRecordedUsageCost(entry?.costBreakdown));
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
//#region src/infra/session-cost-usage-collection.ts
const USAGE_COST_TRANSCRIPT_STAT_CONCURRENCY = 32;
async function materializeUsageCostTranscriptSource(source, access) {
	if (source.kind === "sqlite") return source;
	const { sourcePath, stats: sourceStats } = source;
	const filePath = access?.materializeArchive ? await access.materializeArchive(sourcePath) : materializeSessionArchiveForRead(sourcePath);
	const stats = filePath === sourcePath ? sourceStats : await fs.promises.stat(filePath);
	return {
		filePath,
		sourcePath,
		kind: "jsonl",
		sessionId: source.sessionId,
		size: stats.size,
		mtimeMs: sourceStats.mtimeMs,
		device: stats.dev,
		inode: stats.ino
	};
}
async function listUsageCountedTranscriptFileSources(agentId, params) {
	const { sessionsDir, storePath } = params;
	let entries;
	try {
		entries = await fs.promises.readdir(sessionsDir, { withFileTypes: true });
	} catch (error) {
		if (error.code === "ENOENT") return [];
		throw error;
	}
	const transcripts = entries.filter((entry) => entry.isFile() && isUsageCountedSessionTranscriptFileName(entry.name));
	const archiveNames = transcripts.map((entry) => entry.name);
	const stores = new Map(transcripts.length > 0 ? listDurableSqliteTargetPathsForSessionStorePath(storePath).map((databasePath) => [resolveRealpathOrAbsolute(databasePath), databasePath]) : []);
	const archivesByStore = [];
	for (const databasePath of stores.values()) {
		const read = () => listSessionTranscriptArchivesReadOnly({
			agentId,
			archiveNames,
			includeAllAgents: true,
			storePath: databasePath,
			env: params.env
		});
		archivesByStore.push(params.readSqliteMetadata ? await params.readSqliteMetadata(databasePath, read) : read());
	}
	const archives = new Map(archivesByStore.flat().map((archive) => [archive.archiveName, archive]));
	const tasks = transcripts.filter((entry) => (archives.get(entry.name)?.agentId ?? agentId) === agentId).map((entry) => async () => {
		const filePath = path.join(sessionsDir, entry.name);
		try {
			const stats = await fs.promises.stat(filePath);
			if (params.minMtimeMs !== void 0 && stats.mtimeMs < params.minMtimeMs) return;
			return {
				kind: "jsonl",
				sourcePath: filePath,
				sessionId: archives.get(entry.name)?.sessionId ?? parseUsageCountedSessionIdFromFileName(entry.name) ?? void 0,
				mtimeMs: stats.mtimeMs,
				stats
			};
		} catch (error) {
			if (error.code === "ENOENT") return;
			throw error;
		}
	});
	const { firstError, hasError, results } = await runTasksWithConcurrency({
		tasks,
		limit: USAGE_COST_TRANSCRIPT_STAT_CONCURRENCY
	});
	if (hasError) throw firstError;
	return results.filter((file) => Boolean(file));
}
async function readUsageCostSqliteFiles(markers, access = {}) {
	const scopes = markers.map((marker) => ({
		...marker,
		env: access.env
	}));
	const statsByIndex = access.readSqliteStats ? await access.readSqliteStats(markers) : scopes.length === 1 ? scopes.map(readTranscriptStatsSync) : readTranscriptStatsBatchReadOnlySync(scopes);
	return markers.map((marker, index) => {
		const stats = statsByIndex[index];
		if (!stats) return;
		const filePath = formatCanonicalUsageCostSqliteMarker(marker, access.env);
		return {
			filePath,
			sourcePath: filePath,
			kind: "sqlite",
			mtimeMs: stats.lastMutationAtMs ?? 0,
			sessionId: marker.sessionId,
			size: stats.sizeBytes,
			eventCount: stats.eventCount,
			maxSeq: stats.maxSeq
		};
	});
}
function formatCanonicalUsageCostSqliteMarker(marker, env) {
	const { path: storePath } = resolveSqliteTargetFromSessionStorePath(marker.storePath, {
		agentId: marker.agentId,
		env
	});
	return formatSqliteSessionFileMarker({
		...marker,
		storePath
	});
}
async function listUsageCountedTranscriptSources(agentId, params) {
	const logicalAgentId = normalizeAgentId(agentId);
	const storePath = resolveSessionStorePathForScope({
		agentId,
		env: params?.env,
		storePath: params?.storePath ?? (params?.sessionsDir ? path.join(params.sessionsDir, "sessions.json") : void 0)
	});
	const sessionsDir = params?.sessionsDir ?? resolveSessionArtifactDirectory(storePath);
	const fileBacked = await listUsageCountedTranscriptFileSources(logicalAgentId, {
		minMtimeMs: params?.minMtimeMs,
		sessionsDir,
		storePath,
		env: params?.env,
		readSqliteMetadata: params?.readSqliteMetadata,
		materializeArchive: params?.materializeArchive
	});
	const sqliteBacked = (await readUsageCostSqliteFiles((params?.listSqliteInstances ? await params.listSqliteInstances(agentId, storePath) : listSessionTranscriptInstances({
		agentId,
		storePath,
		env: params?.env,
		projection: "list"
	})).filter((instance) => instance.agentId === logicalAgentId && (params?.minMtimeMs === void 0 || instance.updatedAtMs >= params.minMtimeMs)).map((instance) => ({
		agentId: logicalAgentId,
		sessionId: instance.sessionId,
		storePath
	})), params)).filter((file) => file !== void 0);
	const sqliteSessionIds = new Set(sqliteBacked.map((file) => file.sessionId).filter(Boolean));
	return [...fileBacked.filter((file) => !file.sessionId || !sqliteSessionIds.has(file.sessionId)), ...sqliteBacked];
}
async function listUsageCountedTranscriptStats(agentId, params) {
	const sources = await listUsageCountedTranscriptSources(agentId, params);
	const { firstError, hasError, results } = await runTasksWithConcurrency({
		tasks: sources.map((source) => async () => {
			try {
				return await materializeUsageCostTranscriptSource(source, params);
			} catch (error) {
				if (hasErrnoCode(error, "ENOENT")) return;
				throw error;
			}
		}),
		limit: USAGE_COST_TRANSCRIPT_STAT_CONCURRENCY
	});
	if (hasError) throw firstError;
	return results.filter((file) => Boolean(file));
}
async function resolveUsageCostTranscriptSource(sessionFile, access) {
	const marker = parseSqliteSessionFileMarker(sessionFile);
	if (marker) return (await readUsageCostSqliteFiles([marker], access))[0];
	try {
		const stats = await fs.promises.stat(sessionFile);
		return {
			kind: "jsonl",
			sourcePath: sessionFile,
			sessionId: parseUsageCountedSessionIdFromFileName(path.basename(sessionFile)) ?? void 0,
			mtimeMs: stats.mtimeMs,
			stats
		};
	} catch {
		return;
	}
}
async function resolveUsageCostTranscriptSources(sessionFiles, access) {
	const markers = sessionFiles.map(parseSqliteSessionFileMarker);
	const sqliteFiles = await readUsageCostSqliteFiles(markers.filter((marker) => marker !== void 0), access);
	if (sqliteFiles.length === sessionFiles.length) return sqliteFiles;
	let sqliteIndex = 0;
	const tasks = sessionFiles.map((sessionFile, index) => {
		if (markers[index]) {
			const file = sqliteFiles[sqliteIndex++];
			return async () => file;
		}
		return () => resolveUsageCostTranscriptSource(sessionFile, access);
	});
	const { results } = await runTasksWithConcurrency({
		tasks,
		limit: USAGE_COST_TRANSCRIPT_STAT_CONCURRENCY
	});
	return results;
}
async function resolveUsageCostTranscriptFile(sessionFile, access) {
	const source = await resolveUsageCostTranscriptSource(sessionFile, access);
	if (!source) return;
	try {
		return await materializeUsageCostTranscriptSource(source, access);
	} catch {
		return;
	}
}
async function resolveUsageCostTranscriptFiles(sessionFiles, access) {
	const sources = await resolveUsageCostTranscriptSources(sessionFiles, access);
	const { results } = await runTasksWithConcurrency({
		tasks: sources.map((source) => async () => {
			if (!source) return;
			try {
				return await materializeUsageCostTranscriptSource(source, access);
			} catch {
				return;
			}
		}),
		limit: USAGE_COST_TRANSCRIPT_STAT_CONCURRENCY
	});
	return results;
}
async function* readTranscriptRecords(filePath) {
	const marker = parseSqliteSessionFileMarker(filePath);
	if (marker) {
		const { restoreSessionColdTranscript } = await import("./session-cold-storage-CqarxOH9.mjs");
		await restoreSessionColdTranscript(marker);
		for (const event of selectVisibleTranscriptEvents(loadTranscriptEventsSync(marker))) if (isRecord(event)) yield event;
		return;
	}
	const transcriptPath = materializeSessionArchiveForRead(filePath);
	for await (const line of streamSessionTranscriptLines(transcriptPath)) try {
		const parsed = JSON.parse(line);
		if (isRecord(parsed)) yield parsed;
	} catch {}
}
async function* readTranscriptRecordsBestEffort(filePath) {
	try {
		yield* readTranscriptRecords(filePath);
	} catch (error) {
		if (parseSqliteSessionFileMarker(filePath)) throw error;
	}
}
function resolveExistingUsageSessionFile(params) {
	const sessionId = normalizeOptionalString(params.sessionId);
	const target = params.sessionTarget ? {
		agentId: normalizeOptionalString(params.sessionTarget.agentId),
		sessionId: normalizeOptionalString(params.sessionTarget.sessionId),
		sessionKey: normalizeOptionalString(params.sessionTarget.sessionKey),
		storePath: normalizeOptionalString(params.sessionTarget.storePath)
	} : void 0;
	const completeTarget = Boolean(target?.agentId && target.sessionId && target.sessionKey && target.storePath);
	if (target && completeTarget) {
		const targetKeyAgentId = parseAgentSessionKey(target.sessionKey)?.agentId;
		const targetKeyEntry = loadSessionEntryReadOnly({
			agentId: target.agentId,
			sessionKey: target.sessionKey,
			storePath: target.storePath,
			projection: "list"
		});
		if (sessionId !== void 0 && target.sessionId !== sessionId || target.agentId !== params.agentId || targetKeyAgentId && targetKeyAgentId !== target.agentId || targetKeyEntry && targetKeyEntry.sessionId !== target.sessionId) return;
		return formatCanonicalUsageCostSqliteMarker({
			agentId: target.agentId,
			sessionId: target.sessionId,
			storePath: target.storePath
		});
	}
	const legacySessionFile = params.sessionEntry?.sessionFile;
	const entryMarker = parseSqliteSessionFileMarker(typeof legacySessionFile === "string" ? legacySessionFile : void 0);
	const explicitMarker = parseSqliteSessionFileMarker(params.sessionFile);
	const matchingEntryMarker = entryMarker && entryMarker.agentId === params.agentId && (!sessionId || entryMarker.sessionId === sessionId) ? entryMarker : void 0;
	const matchingExplicitMarker = explicitMarker && explicitMarker.agentId === params.agentId && (!sessionId || explicitMarker.sessionId === sessionId) ? explicitMarker : void 0;
	if (!matchingEntryMarker && explicitMarker && !matchingExplicitMarker) return;
	const sqliteMarker = matchingEntryMarker ?? matchingExplicitMarker;
	const targetKeyAgentId = parseAgentSessionKey(target?.sessionKey)?.agentId;
	const targetKeyEntry = target?.sessionKey && sqliteMarker && !completeTarget ? loadSessionEntryReadOnly({
		agentId: sqliteMarker.agentId,
		sessionKey: target.sessionKey,
		storePath: sqliteMarker.storePath,
		projection: "list"
	}) : void 0;
	if (target && !completeTarget && sqliteMarker && (target.agentId && target.agentId !== sqliteMarker.agentId || target.sessionId && target.sessionId !== sqliteMarker.sessionId || targetKeyAgentId && targetKeyAgentId !== sqliteMarker.agentId || target.sessionKey && targetKeyEntry?.sessionId !== sqliteMarker.sessionId || target.storePath && path.resolve(target.storePath) !== path.resolve(sqliteMarker.storePath))) return;
	if (sqliteMarker) return formatSqliteSessionFileMarker(sqliteMarker);
	if (entryMarker && !params.sessionFile) return;
	const candidate = params.sessionFile ?? (sessionId ? resolveSessionFilePathCore(sessionId, params.sessionEntry, { agentId: params.agentId }) : void 0);
	if (candidate && fs.existsSync(candidate)) return candidate;
	if (!sessionId) return candidate;
	try {
		const sessionsDir = candidate ? path.dirname(candidate) : resolveSessionTranscriptsDirForAgent(params.agentId);
		const baseFileName = `${sessionId}.jsonl`;
		const entries = fs.readdirSync(sessionsDir, { withFileTypes: true }).filter((entry) => {
			return entry.isFile() && (entry.name === baseFileName || entry.name.startsWith(`${baseFileName}.reset.`) || entry.name.startsWith(`${baseFileName}.deleted.`));
		});
		const primary = entries.find((entry) => entry.name === baseFileName);
		if (primary) return path.join(sessionsDir, primary.name);
		const latestArchive = entries.filter((entry) => isSessionArchiveArtifactName(entry.name)).map((entry) => entry.name).toSorted((a, b) => {
			const tsA = parseSessionArchiveTimestamp(a, "deleted") ?? parseSessionArchiveTimestamp(a, "reset") ?? 0;
			return (parseSessionArchiveTimestamp(b, "deleted") ?? parseSessionArchiveTimestamp(b, "reset") ?? 0) - tsA || b.localeCompare(a);
		})[0];
		return latestArchive ? path.join(sessionsDir, latestArchive) : candidate;
	} catch {
		return candidate;
	}
}
//#endregion
export { resolveExistingUsageSessionFile as a, resolveUsageCostTranscriptSources as c, applyUsageCostEstimate as d, applyUsageTotals as f, parseUsageCostTranscriptRecord as h, readTranscriptRecordsBestEffort as i, applyCostBreakdown as l, needsUsageCostEstimate as m, listUsageCountedTranscriptStats as n, resolveUsageCostTranscriptFile as o, computeUsageTokenTotals as p, readTranscriptRecords as r, resolveUsageCostTranscriptFiles as s, listUsageCountedTranscriptSources as t, applyCostTotal as u };
