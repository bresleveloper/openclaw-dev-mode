import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { r as WorkerTaskError } from "./worker-task-pool-cppt7dT0.mjs";
import { t as encodeOpenClawStateWorkerError } from "./openclaw-state-worker-error-DLFiBmPG.mjs";
import { r as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-C2YxM4Tj.mjs";
import { v as materializeSessionArchiveForRead } from "./artifacts-C9weQ_MG.mjs";
import { d as decodeUsageCostRollupEnvelope, f as encodeUsageCostRollup, l as canUseUsageCostRollupForPartial, p as isUsageCostRollupFresh, u as decodeUsageCostRollup } from "./openclaw-agent-db-maintenance-D--tx1ak.mjs";
import "./openclaw-agent-db-CaQAStOA.mjs";
import { n as openOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-open-_lavN1YB.mjs";
import { s as transcriptEventJsonSql } from "./transcript-payload-qsg5dB6v.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-IBx2zWDG.mjs";
import { n as parseSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.mjs";
import { a as getSessionKysely, g as toDatabaseOptions, l as resolveSqliteReadScope } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
import { l as scanSessionTranscriptTree, n as isSessionTranscriptLeafControl, t as isCanonicalSessionTranscriptEntry } from "./transcript-tree-3xvvNd9-.mjs";
import { t as SessionTranscriptColdError } from "./session-cold-storage-state-BcO2Rrog.mjs";
import { L as selectVisibleTranscriptEvents, T as readTranscriptStatsBatchReadOnlySync } from "./session-accessor.sqlite-read-BzN7WYll.mjs";
import { t as readHotSessionTranscriptSnapshot } from "./session-cold-storage-read-BK-Qc6S7.mjs";
import { o as listSessionTranscriptInstances } from "./session-accessor.sqlite-entry-BB2Zsfho.mjs";
import "./session-accessor-l-4ZHvKn.mjs";
import { i as isTransientSqliteError } from "./unhandled-rejections-DhJgSeK4.mjs";
import { t as createTimeZoneDayKeyFormatter } from "./format-datetime-CSLJIAzN.mjs";
import { r as createEmptyCostUsageTotals } from "./session-cost-usage-totals-D4e-85ui.mjs";
import { a as readSessionCostUsageRollupBodyInDatabase, s as readSessionCostUsageRollupRowsInDatabase } from "./session-cost-usage-cache.kernel-DkwKnfDv.mjs";
import { c as resolveUsageCostTranscriptSources, d as applyUsageCostEstimate, f as applyUsageTotals, h as parseUsageCostTranscriptRecord, l as applyCostBreakdown, m as needsUsageCostEstimate, n as listUsageCountedTranscriptStats, o as resolveUsageCostTranscriptFile, s as resolveUsageCostTranscriptFiles, t as listUsageCountedTranscriptSources, u as applyCostTotal } from "./session-cost-usage-collection-CKl2VVAh.mjs";
import { a as createSessionUsageRollupData, n as appendSessionUsageRollupContribution, r as buildSessionCostSummaryFromRollup, t as addRollupToCostUsageSummary } from "./session-cost-usage-rollup-58jCr_2f.mjs";
import fs from "node:fs";
import { createHash } from "node:crypto";
//#region src/infra/session-cost-usage-projection.ts
const formatUtcDayKey = (date) => `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
const createUsageDayKeyFormatter = (dayBucket) => {
	if (dayBucket?.mode === "utc-offset") return (date) => formatUtcDayKey(new Date(date.getTime() + dayBucket.utcOffsetMinutes * 60 * 1e3));
	const timeZone = dayBucket?.mode === "time-zone" ? dayBucket.timeZone : Intl.DateTimeFormat().resolvedOptions().timeZone;
	return createTimeZoneDayKeyFormatter(timeZone);
};
/**
* Maximum window (in days) for which we will zero-fill missing calendar
* days. Bounded ranges from the UI's range filter top out at 90 days for
* the explicit picker and "All" is the wildcard escape hatch — anything
* wider than this threshold is treated as an all-time / open-ended range
* and falls back to sparse behavior (only days with activity), since a
* dense series at that scale would produce tens of thousands of zero
* buckets (e.g. a 1970-based startMs → ~20k entries) without any user
* value. 366 days covers a full year + leap-day cushion.
*/
const MAX_ZERO_FILL_DAYS = 366;
/**
* Parse a `YYYY-MM-DD` day key into its UTC calendar-day timestamp. The
* timestamp is only used to enumerate calendar labels; usage timestamps stay
* in their requested timezone bucket.
*/
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
/**
* Ensure the daily map has an entry for every calendar day in [startMs, endMs].
* Days without activity are inserted with a zero-valued totals bucket so the
* resulting `daily` series matches the requested range length (one bar per
* calendar day) instead of only covering days with recorded usage.
*
* Day keys must use the same calendar zone as the request range. Otherwise a
* remote Gateway can return local-date labels for UTC/browser-local ranges,
* which drops boundary usage when the UI compares calendar windows.
*/
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
	const maxIterations = 367;
	for (let cursorMs = startDayMs, i = 0; cursorMs <= endDayMs && i < maxIterations; i += 1) {
		const key = formatUtcDayKey(new Date(cursorMs));
		if (!dailyMap.has(key)) dailyMap.set(key, createEmptyCostUsageTotals());
		cursorMs += dayMs;
	}
	if (!dailyMap.has(endKey)) dailyMap.set(endKey, createEmptyCostUsageTotals());
};
const countCalendarDays = (startMs, endMs, formatDayKey) => {
	const startDayMs = parseDayKeyToUtcMs(formatDayKey(new Date(startMs)));
	const endDayMs = parseDayKeyToUtcMs(formatDayKey(new Date(endMs)));
	if (startDayMs === null || endDayMs === null || endDayMs < startDayMs) return Math.ceil((endMs - startMs) / 864e5) + 1;
	return Math.floor((endDayMs - startDayMs) / 864e5) + 1;
};
function finishCostUsageSummary(params) {
	fillMissingDays(params.daily, params.startMs, params.endMs, params.formatDay);
	const status = params.refreshing ? "refreshing" : params.staleFiles > 0 ? params.cachedFiles > 0 ? "partial" : "stale" : "fresh";
	return {
		updatedAt: Date.now(),
		days: countCalendarDays(params.startMs, params.endMs, params.formatDay),
		daily: Array.from(params.daily.entries()).map(([date, bucket]) => Object.assign({ date }, bucket)).toSorted((a, b) => a.date.localeCompare(b.date)),
		totals: params.totals,
		cacheStatus: {
			status,
			cachedFiles: params.cachedFiles,
			pendingFiles: params.staleFiles,
			staleFiles: params.staleFiles,
			refreshedAt: params.refreshedAt
		}
	};
}
function includeRemainingRollupScans(rows, pricingFingerprint, initialLatest) {
	let latest = initialLatest;
	for (const row of rows) {
		const entry = decodeUsageCostRollupEnvelope(row.valueJson, pricingFingerprint);
		if (entry) latest = Math.max(latest, entry.scannedAt);
	}
	return latest || void 0;
}
async function projectCostUsageSummary(params) {
	const daily = /* @__PURE__ */ new Map();
	const totals = createEmptyCostUsageTotals();
	const formatDay = createUsageDayKeyFormatter(params.dayBucket);
	let cachedFiles = 0;
	let staleFiles = 0;
	let latestScan = 0;
	for (const file of params.files) {
		const row = params.readRow(file.filePath);
		const envelope = row ? decodeUsageCostRollupEnvelope(row.valueJson, params.pricingFingerprint) : void 0;
		if (envelope) latestScan = Math.max(latestScan, envelope.scannedAt);
		const fresh = isUsageCostRollupFresh({
			checkpoint: envelope?.checkpoint,
			file
		});
		if (!fresh) staleFiles += 1;
		if (!row || !envelope || !canUseUsageCostRollupForPartial({
			checkpoint: envelope.checkpoint,
			file
		})) continue;
		const entry = decodeUsageCostRollup(row.valueJson, params.pricingFingerprint, await params.readBody(row));
		if (!entry) {
			params.onInvalidBody(row.key);
			if (fresh) staleFiles += 1;
			continue;
		}
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
	return finishCostUsageSummary({
		daily,
		totals,
		startMs: params.startMs,
		endMs: params.endMs,
		formatDay,
		refreshing: params.refreshing,
		cachedFiles,
		staleFiles,
		refreshedAt: includeRemainingRollupScans(params.remainingRows, params.pricingFingerprint, latestScan)
	});
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
	let latestScan = 0;
	for (const [filePath, requests] of requestsByPath) {
		const row = params.readRow(filePath);
		const envelope = row ? decodeUsageCostRollupEnvelope(row.valueJson, params.pricingFingerprint) : void 0;
		if (!envelope || !row) continue;
		latestScan = Math.max(latestScan, envelope.scannedAt);
		const freshRequests = requests.filter(({ file }) => isUsageCostRollupFresh({
			checkpoint: envelope.checkpoint,
			file
		}));
		if (freshRequests.length === 0) continue;
		const entry = decodeUsageCostRollup(row.valueJson, params.pricingFingerprint, await params.readBody(row));
		if (!entry) {
			params.onInvalidBody(row.key);
			continue;
		}
		for (const { index, session } of freshRequests) {
			cachedFiles += 1;
			summaries[index] = buildSessionCostSummaryFromRollup({
				rollup: entry.rollup,
				sessionId: session.sessionId,
				sessionFile: session.sessionFile,
				startMs,
				endMs,
				includeUntimestamped,
				formatDay
			});
		}
	}
	const staleSessionFiles = /* @__PURE__ */ new Set();
	for (const [index, session] of params.sessions.entries()) if (summaries[index] === null) staleSessionFiles.add(params.files[index]?.sourcePath ?? session.sessionFile);
	return {
		summaries,
		cacheStatus: {
			status: staleSessionFiles.size === 0 ? "fresh" : params.refreshing ? "refreshing" : cachedFiles > 0 ? "partial" : "stale",
			cachedFiles,
			pendingFiles: staleSessionFiles.size,
			staleFiles: staleSessionFiles.size,
			refreshedAt: includeRemainingRollupScans(params.remainingRows, params.pricingFingerprint, latestScan)
		},
		staleSessionFiles: [...staleSessionFiles]
	};
}
//#endregion
//#region src/infra/session-cost-usage-worker-refresh.ts
const USAGE_COST_FILE_ANCHOR_BYTES = 4096;
function hashUsageCostCheckpoint(value) {
	return createHash("sha256").update(value).digest("base64url");
}
async function readJsonlAnchorHash(filePath, offset) {
	const start = Math.max(0, offset - USAGE_COST_FILE_ANCHOR_BYTES);
	const length = offset - start;
	if (length === 0) return hashUsageCostCheckpoint("");
	const handle = await fs.promises.open(filePath, "r").catch(() => null);
	if (!handle) return;
	try {
		const buffer = Buffer.alloc(length);
		const { bytesRead } = await handle.read(buffer, 0, length, start);
		return bytesRead === length ? hashUsageCostCheckpoint(buffer) : void 0;
	} finally {
		await handle.close().catch(() => void 0);
	}
}
function parseJsonlRecord(line) {
	const text = line.toString("utf8").trim();
	if (!text) return;
	try {
		const parsed = JSON.parse(text);
		return isRecord(parsed) ? parsed : void 0;
	} catch {
		return;
	}
}
async function scanJsonlRange(params) {
	if (params.endOffset <= params.startOffset) return params.startOffset;
	const stream = fs.createReadStream(params.filePath, {
		start: params.startOffset,
		end: params.endOffset - 1
	});
	const lineChunks = [];
	let lineBytes = 0;
	let chunkStart = params.startOffset;
	let processedOffset = params.startOffset;
	try {
		for await (const chunk of stream) {
			const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
			let lineStart = 0;
			for (let newline = bytes.indexOf(10); newline >= 0; newline = bytes.indexOf(10, lineStart)) {
				const fragment = bytes.subarray(lineStart, newline);
				let line = fragment;
				if (lineChunks.length > 0) {
					lineChunks.push(fragment);
					line = Buffer.concat(lineChunks, lineBytes + fragment.length);
					lineChunks.length = 0;
					lineBytes = 0;
				}
				const record = parseJsonlRecord(line);
				if (record) {
					const pending = params.onRecord(record);
					if (pending) await pending;
				}
				processedOffset = chunkStart + newline + 1;
				lineStart = newline + 1;
			}
			if (lineStart < bytes.length) {
				const fragment = bytes.subarray(lineStart);
				lineChunks.push(fragment);
				lineBytes += fragment.length;
			}
			chunkStart += bytes.length;
		}
		const firstChunk = lineChunks[0];
		if (firstChunk) {
			const record = parseJsonlRecord(lineChunks.length === 1 ? firstChunk : Buffer.concat(lineChunks, lineBytes));
			if (record) {
				const pending = params.onRecord(record);
				if (pending) await pending;
				processedOffset = params.endOffset;
			}
		}
		return processedOffset;
	} finally {
		stream.destroy();
	}
}
function appendParsedEntryToRollup(rollup, entry) {
	let usageTotals;
	if (entry.usage) {
		usageTotals = createEmptyCostUsageTotals();
		applyUsageTotals(usageTotals, entry.usage);
		if (entry.costBreakdown?.total !== void 0) applyCostBreakdown(usageTotals, entry.costBreakdown);
		else applyCostTotal(usageTotals, entry.costTotal, entry.provider, entry.model);
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
	return {
		parsedRecord: Boolean(entry.usage),
		countedRecord: Boolean(entry.usage && timestamp)
	};
}
function createUsageRollupScan(params) {
	const previous = params.appendOnly ? params.previous?.entry : void 0;
	const rollup = previous?.rollup ?? createSessionUsageRollupData();
	let countedRecords = 0;
	let parsedRecords = 0;
	return {
		async addRecords(records) {
			let batch = [];
			const flush = async () => {
				const estimated = batch.filter(needsUsageCostEstimate);
				const costs = await params.resolveCosts(estimated.map(({ provider, model }) => ({
					provider,
					model
				})));
				for (let i = 0; i < estimated.length; i++) applyUsageCostEstimate(estimated[i], () => costs[i]);
				for (const entry of batch) {
					const counted = appendParsedEntryToRollup(rollup, entry);
					countedRecords += counted.countedRecord ? 1 : 0;
					parsedRecords += counted.parsedRecord ? 1 : 0;
				}
				batch = [];
			};
			for (const record of records) {
				const entry = parseUsageCostTranscriptRecord(record);
				if (entry) batch.push(entry);
				if (batch.length === 128) await flush();
			}
			if (batch.length > 0) await flush();
		},
		finish(checkpoint) {
			return {
				version: 6,
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
async function scanJsonlUsageRollup(params) {
	const previousCheckpoint = params.previous?.entry.checkpoint.kind === "jsonl" ? params.previous.entry.checkpoint : void 0;
	const identityMatches = previousCheckpoint && previousCheckpoint.device === params.file.device && previousCheckpoint.inode === params.file.inode && previousCheckpoint.parsedOffset <= params.file.size && params.file.size > previousCheckpoint.observedSize;
	const previousAnchor = identityMatches ? await readJsonlAnchorHash(params.file.filePath, previousCheckpoint.parsedOffset) : void 0;
	const appendOnly = Boolean(identityMatches && previousAnchor === previousCheckpoint?.anchorHash && params.previous);
	const startOffset = appendOnly ? previousCheckpoint?.parsedOffset ?? 0 : 0;
	const scan = createUsageRollupScan({
		...params,
		appendOnly
	});
	let pendingRecords = [];
	const processedOffset = await scanJsonlRange({
		filePath: params.file.filePath,
		startOffset,
		endOffset: params.file.size,
		onRecord: (record) => {
			pendingRecords.push(record);
			if (pendingRecords.length === 128) {
				const batch = pendingRecords;
				pendingRecords = [];
				return scan.addRecords(batch);
			}
		}
	});
	await scan.addRecords(pendingRecords);
	const postStats = await fs.promises.stat(params.file.filePath);
	if (postStats.dev !== params.file.device || postStats.ino !== params.file.inode || postStats.size < params.file.size) throw new Error(`transcript changed identity while scanning: ${params.file.filePath}`);
	const anchorHash = await readJsonlAnchorHash(params.file.filePath, processedOffset);
	if (!anchorHash) throw new Error(`transcript checkpoint unavailable: ${params.file.filePath}`);
	return scan.finish({
		kind: "jsonl",
		parsedOffset: processedOffset,
		observedSize: params.file.size,
		observedMtimeMs: params.file.mtimeMs,
		device: params.file.device ?? 0,
		inode: params.file.inode ?? 0,
		anchorHash
	});
}
function selectIncrementalSqliteRecords(records, previousLeafId) {
	let visibleLeafId = previousLeafId;
	const visible = [];
	for (const record of records) {
		if (isSessionTranscriptLeafControl(record) || record.appendMode === "side") return;
		if (!isCanonicalSessionTranscriptEntry(record)) continue;
		const id = typeof record.id === "string" && record.id ? record.id : void 0;
		if (!id) return;
		if (Object.hasOwn(record, "parentId")) {
			if ((record.parentId === null ? void 0 : record.parentId) !== visibleLeafId) return;
		}
		visible.push(record);
		visibleLeafId = id;
	}
	return {
		records: visible,
		...visibleLeafId ? { visibleLeafId } : {}
	};
}
function sqliteCheckpointAnchorHash(event) {
	return hashUsageCostCheckpoint(JSON.stringify(event));
}
async function scanSqliteUsageRollup(params) {
	const scope = parseSqliteSessionFileMarker(params.file.filePath);
	if (!scope) throw new Error(`invalid SQLite transcript marker: ${params.file.filePath}`);
	const maxSeq = params.file.maxSeq ?? 0;
	const eventCount = params.file.eventCount ?? 0;
	const readAtSeq = async (seq) => (await params.readRows(scope, seq - 1, seq))[0];
	const snapshotLastRow = maxSeq > 0 ? await readAtSeq(maxSeq) : void 0;
	if (maxSeq > 0 && !snapshotLastRow) throw new Error(`SQLite transcript checkpoint unavailable: ${params.file.filePath}`);
	const snapshotAnchorHash = snapshotLastRow ? sqliteCheckpointAnchorHash(snapshotLastRow.event) : hashUsageCostCheckpoint("");
	const previousCheckpoint = params.previous?.entry.checkpoint.kind === "sqlite" ? params.previous.entry.checkpoint : void 0;
	const previousAnchor = previousCheckpoint?.maxSeq ? await readAtSeq(previousCheckpoint.maxSeq) : void 0;
	const anchorMatches = previousCheckpoint?.maxSeq === 0 || previousAnchor && sqliteCheckpointAnchorHash(previousAnchor.event) === previousCheckpoint?.anchorHash;
	const appendCandidate = Boolean(params.previous && previousCheckpoint && previousCheckpoint.maxSeq < maxSeq && previousCheckpoint.eventCount < eventCount && anchorMatches);
	const afterSeq = appendCandidate ? previousCheckpoint?.maxSeq ?? 0 : 0;
	const rows = await params.readRows(scope, afterSeq, maxSeq);
	const rawRecords = rows.map((row) => row.event).filter(isRecord);
	const incremental = appendCandidate ? selectIncrementalSqliteRecords(rawRecords, previousCheckpoint?.visibleLeafId) : void 0;
	const appendOnly = Boolean(incremental && params.previous);
	const allRows = appendOnly || afterSeq === 0 ? rows : await params.readRows(scope, 0, maxSeq);
	const allRecords = appendOnly ? incremental?.records ?? [] : selectVisibleTranscriptEvents(allRows.map((row) => row.event)).filter(isRecord);
	const scan = createUsageRollupScan({
		...params,
		appendOnly
	});
	await scan.addRecords(allRecords);
	const postFile = await resolveUsageCostTranscriptFile(params.file.filePath, params.access);
	if (!postFile || (postFile.maxSeq ?? 0) < maxSeq || (postFile.eventCount ?? 0) < eventCount) throw new Error(`SQLite transcript changed while scanning: ${params.file.filePath}`);
	const currentLastRow = maxSeq > 0 ? await readAtSeq(maxSeq) : void 0;
	if (maxSeq > 0 && !currentLastRow || currentLastRow && sqliteCheckpointAnchorHash(currentLastRow.event) !== snapshotAnchorHash) throw new Error(`SQLite transcript changed while scanning: ${params.file.filePath}`);
	const visibleLeafId = appendOnly ? incremental?.visibleLeafId : scanSessionTranscriptTree(allRows.map((row) => row.event)).leafId ?? void 0;
	return scan.finish({
		kind: "sqlite",
		maxSeq,
		eventCount,
		size: params.file.size,
		mtimeMs: params.file.mtimeMs,
		anchorHash: snapshotAnchorHash,
		...visibleLeafId ? { visibleLeafId } : {}
	});
}
function scanUsageCostRollupInWorker(params) {
	return params.file.kind === "sqlite" ? scanSqliteUsageRollup(params) : scanJsonlUsageRollup(params);
}
//#endregion
//#region src/infra/session-cost-usage-worker.ts
var UsageCostHostEffectError = class extends Error {
	constructor(origin, message) {
		super(message);
		this.origin = origin;
		this.name = "UsageCostHostEffectError";
	}
};
async function executeUsageCostWorker(input, channel, control, readDatabase) {
	const { location, operation } = input;
	const { env } = location;
	channel.consumeInput();
	const host = async (kind, value, transfer = []) => {
		control.throwIfCancelled();
		const response = await channel.request({
			kind,
			input: value
		}, transfer);
		const reply = response.input;
		response.consumed();
		if (!reply.ok) throw new UsageCostHostEffectError(reply.origin, reply.message);
		control.throwIfCancelled();
		return reply.value;
	};
	const target = (agentId, storePath) => {
		const options = toDatabaseOptions(resolveSqliteReadScope({
			agentId,
			storePath,
			env
		}));
		const owned = input.databases.find((entry) => entry.agentId === options.agentId && entry.path === options.path);
		if (!owned) throw new Error("Usage worker requested an unowned database");
		return owned;
	};
	const readStore = (agentId, storePath, read) => {
		const database = target(agentId, storePath);
		if (isIncognitoOpenClawAgentSqlitePath(database.path, {
			agentId: database.agentId,
			env
		})) throw new Error("Memory transcript reads require the host owner");
		return control.runNativeSection(() => readDatabase(database, read));
	};
	const access = {
		env,
		materializeArchive: (sourcePath) => control.runNativeSection(() => materializeSessionArchiveForRead(sourcePath)),
		readSqliteMetadata: (storePath, read) => readStore(location.agentId, storePath, read),
		listSqliteInstances: async (agentId, storePath) => {
			const database = target(agentId, storePath);
			return isIncognitoOpenClawAgentSqlitePath(database.path, {
				agentId: database.agentId,
				env
			}) ? host("memory-instances", {
				agentId,
				storePath
			}) : readStore(agentId, storePath, () => listSessionTranscriptInstances({
				agentId,
				storePath,
				env,
				projection: "list"
			}));
		},
		readSqliteStats: async (markers) => {
			const result = Array(markers.length);
			const groups = /* @__PURE__ */ new Map();
			for (const [index, marker] of markers.entries()) {
				const database = target(marker.agentId, marker.storePath);
				const key = JSON.stringify(database);
				const group = groups.get(key) ?? [];
				group.push({
					marker,
					index
				});
				groups.set(key, group);
			}
			for (const group of groups.values()) {
				const marker = group[0].marker;
				const database = target(marker.agentId, marker.storePath);
				const stats = isIncognitoOpenClawAgentSqlitePath(database.path, {
					agentId: database.agentId,
					env
				}) ? await host("memory-stats", group.map((item) => item.marker)) : await readStore(marker.agentId, marker.storePath, () => readTranscriptStatsBatchReadOnlySync(group.map((item) => ({
					...item.marker,
					env
				}))));
				for (const [index, item] of group.entries()) result[item.index] = stats[index] ?? void 0;
			}
			return result;
		}
	};
	const inventory = (minMtimeMs, sessionsDir) => listUsageCountedTranscriptStats(location.agentId, {
		...access,
		storePath: location.storePath,
		sessionsDir,
		minMtimeMs
	});
	if (operation.kind === "inventory") return {
		kind: "inventory",
		files: (operation.sessionFiles ? (await resolveUsageCostTranscriptSources(operation.sessionFiles, access)).filter((file) => file !== void 0) : await listUsageCountedTranscriptSources(location.agentId, {
			...access,
			storePath: location.storePath,
			minMtimeMs: operation.minMtimeMs
		})).map(({ kind, sourcePath, sessionId, mtimeMs }) => ({
			kind,
			sourcePath,
			sessionId,
			mtimeMs
		}))
	};
	const selectedFiles = operation.kind === "sessions" ? await resolveUsageCostTranscriptFiles(operation.sessions.map((session) => session.sessionFile), access) : [];
	const selectedPaths = operation.kind === "sessions" ? selectedFiles.flatMap((file) => file ? [file.filePath] : []) : void 0;
	const memoryCache = isIncognitoOpenClawAgentSqlitePath(location.databasePath, {
		agentId: location.agentId,
		env
	});
	const cacheDatabase = input.databases.find((entry) => entry.path === location.databasePath && entry.agentId === location.agentId);
	if (!cacheDatabase) throw new Error("Usage cache database is not owned by this worker operation");
	const readMetadata = async () => {
		if (memoryCache) return (await host("memory-cache", { filePaths: selectedPaths })).map((row) => ({
			key: row.key,
			updatedAt: row.updatedAt,
			valueJson: Buffer.from(row.valueJson.buffer, row.valueJson.byteOffset, row.valueJson.byteLength).toString("utf8")
		}));
		return control.runNativeSection(() => readDatabase(cacheDatabase, () => {
			try {
				const result = withOpenClawAgentDatabaseReadOnly((opened) => readSessionCostUsageRollupRowsInDatabase(opened.db, selectedPaths), {
					...cacheDatabase,
					env
				});
				return result.found ? result.value : [];
			} catch (error) {
				if (!isTransientSqliteError(error)) throw error;
				return [];
			}
		}));
	};
	const readBody = (row) => memoryCache ? host("memory-cache-body", row) : control.runNativeSection(() => readDatabase(cacheDatabase, () => {
		const result = withOpenClawAgentDatabaseReadOnly((opened) => readSessionCostUsageRollupBodyInDatabase(opened.db, row), {
			...cacheDatabase,
			env
		});
		return result.found ? result.value : void 0;
	}));
	if (operation.kind === "summary" || operation.kind === "sessions") {
		const project = async (rows, body) => {
			const reportFiles = operation.kind === "summary" ? await inventory() : await resolveUsageCostTranscriptFiles(operation.sessions.map((session) => session.sessionFile), access);
			const byPath = new Map(rows.map((row) => [row.key, row]));
			const consumed = /* @__PURE__ */ new Set();
			const invalidRows = /* @__PURE__ */ new Map();
			const source = {
				readRow(filePath) {
					consumed.add(filePath);
					return byPath.get(filePath);
				},
				readBody: body,
				onInvalidBody(key) {
					const row = byPath.get(key);
					if (row) invalidRows.set(key, row);
				},
				remainingRows: (function* () {
					for (const row of rows) if (!consumed.has(row.key)) yield row;
				})()
			};
			const result = operation.kind === "summary" ? {
				kind: "summary",
				summary: await projectCostUsageSummary({
					...source,
					...operation,
					files: reportFiles.filter((file) => file !== void 0),
					refreshing: false
				})
			} : {
				kind: "sessions",
				...await projectSessionCostSummaries({
					...source,
					...operation,
					files: reportFiles,
					refreshing: false
				})
			};
			control.throwIfCancelled();
			return {
				...result,
				invalidRows: [...invalidRows.values()]
			};
		};
		if (!memoryCache) try {
			return await control.runNativeSection(async () => {
				const opened = openOpenClawAgentDatabaseReadOnly({
					...cacheDatabase,
					env
				});
				if (!opened.found) return project([], () => null);
				const { db } = opened.database;
				try {
					db.exec("BEGIN DEFERRED");
					return await project(readSessionCostUsageRollupRowsInDatabase(db, selectedPaths), (row) => {
						const body = readSessionCostUsageRollupBodyInDatabase(db, row);
						if (!body) throw new WorkerTaskError("Usage cache snapshot is unavailable", "unavailable");
						return body.blob;
					});
				} finally {
					try {
						if (db.isTransaction) db.exec("ROLLBACK");
					} finally {
						opened.database.close();
					}
				}
			});
		} catch (error) {
			if (!isTransientSqliteError(error)) throw error;
			return project([], () => null);
		}
		const changed = /* @__PURE__ */ new Error("usage cache snapshot changed");
		for (let attempt = 0; attempt < 3; attempt++) {
			const rows = await readMetadata();
			try {
				const result = await project(rows, async (row) => {
					const body = await readBody(row);
					if (!body) throw changed;
					return body.blob;
				});
				const current = new Map((await readMetadata()).map((row) => [row.key, row]));
				if (current.size === rows.length && rows.every((row) => {
					const next = current.get(row.key);
					return next?.valueJson === row.valueJson && next.updatedAt === row.updatedAt;
				})) {
					control.throwIfCancelled();
					return result;
				}
			} catch (error) {
				if (error !== changed) throw error;
			}
		}
		throw new WorkerTaskError("Usage cache changed while reading; retry the report", "unavailable");
	}
	const rows = await readMetadata();
	const byPath = new Map(rows.map((row) => [row.key, row]));
	const discovered = await inventory(void 0, operation.sessionsDir);
	const requestedFiles = (await resolveUsageCostTranscriptFiles(operation.sessionFiles ?? [], access)).filter((file) => file !== void 0);
	const filesByPath = new Map(discovered.map((file) => [file.filePath, file]));
	for (const file of requestedFiles) filesByPath.set(file.filePath, file);
	for (const row of rows) {
		if (filesByPath.has(row.key)) continue;
		const bytes = new TextEncoder().encode(row.valueJson);
		await host("prune-row", {
			key: row.key,
			value: bytes,
			updatedAt: row.updatedAt
		}, [bytes.buffer]);
	}
	await host("prune", {});
	const requestedPaths = new Set(requestedFiles.map((file) => file.filePath));
	const rebuildByPath = new Map(operation.rebuildRows?.map((row) => [row.key, row]));
	const stale = [];
	for (const file of filesByPath.values()) {
		if (requestedPaths.size > 0 ? !requestedPaths.has(file.filePath) : operation.startMs !== void 0 && file.mtimeMs < operation.startMs) continue;
		const row = byPath.get(file.filePath);
		const envelope = row ? decodeUsageCostRollupEnvelope(row.valueJson, operation.pricingFingerprint) : void 0;
		const invalid = rebuildByPath.get(file.filePath);
		const rebuild = row && invalid?.valueJson === row.valueJson && invalid.updatedAt === row.updatedAt;
		if (rebuild || !isUsageCostRollupFresh({
			checkpoint: envelope?.checkpoint,
			file
		})) stale.push({
			file,
			row,
			envelope,
			rebuild
		});
	}
	stale.sort((a, b) => a.file.size - b.file.size || a.file.filePath.localeCompare(b.file.filePath));
	const maxFiles = operation.maxFiles !== void 0 && Number.isFinite(operation.maxFiles) && operation.maxFiles > 0 ? Math.floor(operation.maxFiles) : void 0;
	const prices = /* @__PURE__ */ new Map();
	const resolveCosts = async (pairs) => {
		const missing = new Map(pairs.filter((pair) => !prices.has(JSON.stringify(pair))).map((pair) => [JSON.stringify(pair), pair]));
		if (missing.size > 0) {
			const keys = [...missing.keys()];
			const costs = await host("pricing", [...missing.values()]);
			keys.forEach((key, index) => prices.set(key, costs[index]));
		}
		return pairs.map((pair) => prices.get(JSON.stringify(pair)));
	};
	let readId = 0;
	const readRows = async (marker, afterSeq, throughSeq) => {
		if (throughSeq <= afterSeq) return [];
		const database = target(marker.agentId, marker.storePath);
		if (isIncognitoOpenClawAgentSqlitePath(database.path, {
			agentId: database.agentId,
			env
		})) {
			const request = {
				marker,
				afterSeq,
				throughSeq,
				readId: ++readId
			};
			const events = [];
			let chunks = [];
			for (;;) {
				const frame = await host("memory-transcript", request);
				if (frame.type === "source-unavailable") throw new Error("Usage memory transcript changed while scanning");
				if (frame.type === "source-end") return events;
				chunks.push(frame.bytes);
				if (frame.final) {
					events.push({
						seq: frame.seq,
						event: JSON.parse(Buffer.concat(chunks).toString("utf8"))
					});
					chunks = [];
				}
			}
		}
		const read = async () => {
			return (await readStore(marker.agentId, marker.storePath, () => {
				const result = withOpenClawAgentDatabaseReadOnly((opened) => readHotSessionTranscriptSnapshot(opened, marker.sessionId, "incremental", () => {
					const query = getSessionKysely(opened.db).selectFrom("transcript_events").select(["seq", transcriptEventJsonSql(opened.db).as("event_json")]).where("session_id", "=", marker.sessionId).where("seq", ">", afterSeq).where("seq", "<=", throughSeq).orderBy("seq", "asc");
					return executeSqliteQuerySync(opened.db, query).rows;
				}), {
					...database,
					env
				});
				return result.found ? result.value : [];
			})).map((row) => ({
				seq: row.seq,
				event: JSON.parse(row.event_json)
			}));
		};
		try {
			return await read();
		} catch (error) {
			if (!(error instanceof SessionTranscriptColdError) || error.sessionId !== marker.sessionId) throw error;
			await host("restore", marker);
			return read();
		}
	};
	for (const { file, row, envelope, rebuild } of stale.slice(0, maxFiles)) {
		control.throwIfCancelled();
		let previous;
		if (!rebuild && row && envelope && canUseUsageCostRollupForPartial({
			checkpoint: envelope.checkpoint,
			file
		})) {
			const body = await readBody(row);
			const entry = body ? decodeUsageCostRollup(row.valueJson, operation.pricingFingerprint, body.blob) : void 0;
			if (entry) previous = { entry };
		}
		const entry = await scanUsageCostRollupInWorker({
			file,
			previous,
			pricingFingerprint: operation.pricingFingerprint,
			resolveCosts,
			readRows,
			access
		});
		const { valueJson, blob } = encodeUsageCostRollup(entry);
		const value = new TextEncoder().encode(valueJson);
		const rawPrevious = byPath.get(file.filePath)?.valueJson;
		const previousValue = rawPrevious === void 0 ? null : new TextEncoder().encode(rawPrevious);
		if (!await host("write", {
			key: file.filePath,
			previousValue,
			value,
			blob,
			updatedAt: entry.scannedAt
		}, [
			value.buffer,
			blob.buffer,
			...previousValue ? [previousValue.buffer] : []
		])) throw new Error(`usage rollup changed while refreshing: ${file.filePath}`);
	}
	return { kind: "refresh" };
}
function usageCostWorkerFailure(error) {
	const pending = [error];
	const seen = /* @__PURE__ */ new Set();
	let hostFailure;
	for (const entry of pending) {
		if (seen.has(entry)) continue;
		seen.add(entry);
		if (entry instanceof UsageCostHostEffectError) hostFailure ??= entry;
		if (entry instanceof Error && entry.cause) pending.push(entry.cause);
		if (entry instanceof AggregateError) pending.push(...entry.errors);
	}
	return {
		ok: false,
		error: {
			message: toErrorObject(error, "Usage cost worker failed").message,
			error: encodeOpenClawStateWorkerError(error, { includeOrdinary: true }),
			...hostFailure ? {
				hostOrigin: hostFailure.origin,
				hostFailureOnly: error === hostFailure
			} : {}
		}
	};
}
//#endregion
export { executeUsageCostWorker, usageCostWorkerFailure };
