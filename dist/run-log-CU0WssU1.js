import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString, f as normalizeStringifiedOptionalString } from "./string-coerce-DW4mBlAt.js";
import { v as uniqueValues } from "./string-normalization-CRyoFBPt.js";
import { _ as getNodeSqliteKysely, g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync, i as openOpenClawStateDatabase, o as runOpenClawStateWriteTransaction } from "./openclaw-state-db-gblCDNfo.js";
import { t as parseByteSize } from "./parse-bytes-BOhZJPCN.js";
import { t as normalizeSqliteNumber } from "./sqlite-number-CklSB049.js";
import { c as cronStoreKey } from "./normalize-BzS-Bdfc.js";
import { u as resolveFailoverReasonFromError } from "./failover-error-CZc6_Wx_.js";
import { i as normalizeCronRunDiagnostics } from "./run-diagnostics-C9b5voB9.js";
//#region src/cron/run-log/entry-codec.ts
/** Parses and normalizes persisted cron run-log entry payloads. */
const CRON_FAILOVER_REASONS = new Set([
	"auth",
	"auth_permanent",
	"format",
	"rate_limit",
	"overloaded",
	"billing",
	"server_error",
	"timeout",
	"model_not_found",
	"session_expired",
	"empty_response",
	"no_error_details",
	"unclassified",
	"unknown"
]);
function normalizeCronRunLogErrorReason(value) {
	return typeof value === "string" && CRON_FAILOVER_REASONS.has(value) ? value : void 0;
}
/** Parses a persisted cron run-log entry object and drops invalid or wrong-job rows. */
function parseCronRunLogEntryObject(obj, opts) {
	const jobId = normalizeOptionalString(opts?.jobId);
	if (!obj || typeof obj !== "object") return null;
	const entryObj = obj;
	if (entryObj.action !== "finished") return null;
	if (typeof entryObj.jobId !== "string" || entryObj.jobId.trim().length === 0) return null;
	if (typeof entryObj.ts !== "number" || !Number.isFinite(entryObj.ts)) return null;
	if (jobId && entryObj.jobId !== jobId) return null;
	const usage = entryObj.usage && typeof entryObj.usage === "object" ? entryObj.usage : void 0;
	const normalizedError = typeof entryObj.error === "string" ? entryObj.error : void 0;
	const normalizedProvider = typeof entryObj.provider === "string" && entryObj.provider.trim() ? entryObj.provider : void 0;
	const normalizedErrorReason = normalizeCronRunLogErrorReason(entryObj.errorReason) ?? resolveFailoverReasonFromError(normalizedError, normalizedProvider) ?? void 0;
	const entry = {
		ts: entryObj.ts,
		jobId: entryObj.jobId,
		action: "finished",
		status: entryObj.status,
		error: normalizedError,
		errorReason: normalizedErrorReason,
		summary: entryObj.summary,
		runId: typeof entryObj.runId === "string" && entryObj.runId.trim() ? entryObj.runId : void 0,
		diagnostics: normalizeCronRunDiagnostics(entryObj.diagnostics),
		runAtMs: entryObj.runAtMs,
		durationMs: entryObj.durationMs,
		nextRunAtMs: entryObj.nextRunAtMs,
		model: typeof entryObj.model === "string" && entryObj.model.trim() ? entryObj.model : void 0,
		provider: normalizedProvider,
		usage: usage ? {
			input_tokens: typeof usage.input_tokens === "number" ? usage.input_tokens : void 0,
			output_tokens: typeof usage.output_tokens === "number" ? usage.output_tokens : void 0,
			total_tokens: typeof usage.total_tokens === "number" ? usage.total_tokens : void 0,
			cache_read_tokens: typeof usage.cache_read_tokens === "number" ? usage.cache_read_tokens : void 0,
			cache_write_tokens: typeof usage.cache_write_tokens === "number" ? usage.cache_write_tokens : void 0
		} : void 0
	};
	if (typeof entryObj.delivered === "boolean") entry.delivered = entryObj.delivered;
	if (entryObj.deliveryStatus === "delivered" || entryObj.deliveryStatus === "not-delivered" || entryObj.deliveryStatus === "unknown" || entryObj.deliveryStatus === "not-requested") entry.deliveryStatus = entryObj.deliveryStatus;
	if (typeof entryObj.deliveryError === "string") entry.deliveryError = entryObj.deliveryError;
	if (entryObj.failureNotificationDelivery && typeof entryObj.failureNotificationDelivery === "object") {
		const failureNotificationDelivery = entryObj.failureNotificationDelivery;
		if (failureNotificationDelivery.status === "delivered" || failureNotificationDelivery.status === "not-delivered" || failureNotificationDelivery.status === "unknown" || failureNotificationDelivery.status === "not-requested") entry.failureNotificationDelivery = {
			status: failureNotificationDelivery.status,
			...typeof failureNotificationDelivery.delivered === "boolean" ? { delivered: failureNotificationDelivery.delivered } : {},
			...typeof failureNotificationDelivery.error === "string" ? { error: failureNotificationDelivery.error } : {}
		};
	}
	if (entryObj.delivery && typeof entryObj.delivery === "object") entry.delivery = entryObj.delivery;
	if (typeof entryObj.sessionId === "string" && entryObj.sessionId.trim().length > 0) entry.sessionId = entryObj.sessionId;
	if (typeof entryObj.sessionKey === "string" && entryObj.sessionKey.trim().length > 0) entry.sessionKey = entryObj.sessionKey;
	return entry;
}
//#endregion
//#region src/cron/run-log/sqlite-store.ts
function getCronRunLogKysely(db) {
	return getNodeSqliteKysely(db);
}
function booleanToInteger(value) {
	return typeof value === "boolean" ? value ? 1 : 0 : null;
}
function integerToBoolean(value) {
	const normalized = normalizeSqliteNumber(value);
	return normalized == null ? void 0 : normalized !== 0;
}
function bindCronRunLogRow(params) {
	const entry = params.entry;
	return {
		store_key: params.storeKey,
		job_id: entry.jobId,
		seq: params.seq,
		ts: entry.ts,
		status: entry.status ?? null,
		error: entry.error ?? null,
		summary: entry.summary ?? null,
		diagnostics_summary: entry.diagnostics?.summary ?? null,
		delivery_status: entry.deliveryStatus ?? null,
		delivery_error: entry.deliveryError ?? null,
		delivered: booleanToInteger(entry.delivered),
		session_id: entry.sessionId ?? null,
		session_key: entry.sessionKey ?? null,
		run_id: entry.runId ?? null,
		run_at_ms: entry.runAtMs ?? null,
		duration_ms: entry.durationMs ?? null,
		next_run_at_ms: entry.nextRunAtMs ?? null,
		model: entry.model ?? null,
		provider: entry.provider ?? null,
		total_tokens: entry.usage?.total_tokens ?? null,
		entry_json: JSON.stringify(entry),
		created_at: Date.now()
	};
}
/** Rehydrates a cron run-log row, preferring indexed SQLite columns over JSON payload values. */
function parseStoredRunLogEntry(row) {
	let rawEntry;
	try {
		rawEntry = JSON.parse(row.entry_json);
	} catch {
		return null;
	}
	const parsed = parseCronRunLogEntryObject(rawEntry, { jobId: row.job_id });
	if (!parsed) return null;
	return {
		...parsed,
		ts: normalizeSqliteNumber(row.ts) ?? parsed.ts,
		jobId: row.job_id,
		status: row.status ?? parsed.status,
		error: row.error ?? parsed.error,
		summary: row.summary ?? parsed.summary,
		delivered: integerToBoolean(row.delivered) ?? parsed.delivered,
		deliveryStatus: row.delivery_status ?? parsed.deliveryStatus,
		deliveryError: row.delivery_error ?? parsed.deliveryError,
		sessionId: row.session_id ?? parsed.sessionId,
		sessionKey: row.session_key ?? parsed.sessionKey,
		runId: row.run_id ?? parsed.runId,
		runAtMs: normalizeSqliteNumber(row.run_at_ms) ?? parsed.runAtMs,
		durationMs: normalizeSqliteNumber(row.duration_ms) ?? parsed.durationMs,
		nextRunAtMs: normalizeSqliteNumber(row.next_run_at_ms) ?? parsed.nextRunAtMs,
		model: row.model ?? parsed.model,
		provider: row.provider ?? parsed.provider
	};
}
/** Reads run-log rows for one store, optionally scoped to one job, in chronological order. */
function readCronRunLogRows(db, storeKey, jobId) {
	let query = getCronRunLogKysely(db).selectFrom("cron_run_logs").selectAll().where("store_key", "=", storeKey);
	if (jobId) query = query.where("job_id", "=", jobId);
	return executeSqliteQuerySync(db, query.orderBy("ts", "asc").orderBy("seq", "asc")).rows;
}
function applyRunLogFilters(query, params) {
	let next = query.where("store_key", "=", params.storeKey);
	if (params.jobId) next = next.where("job_id", "=", params.jobId);
	if (params.statuses?.length) next = next.where("status", "in", params.statuses);
	if (params.deliveryStatuses?.length) next = next.where((eb) => eb.or(params.deliveryStatuses.map((status) => status === "not-requested" ? eb.or([eb("delivery_status", "is", null), eb("delivery_status", "=", status)]) : eb("delivery_status", "=", status))));
	const runId = params.runId?.trim();
	if (runId) next = next.where("run_id", "=", runId);
	return next;
}
/** Counts run-log rows after applying the same filters used by paged reads. */
function countCronRunLogRows(params) {
	return normalizeSqliteNumber(executeSqliteQueryTakeFirstSync(params.db, applyRunLogFilters(getCronRunLogKysely(params.db).selectFrom("cron_run_logs").select((eb) => eb.fn.countAll().as("count")), params))?.count ?? null) ?? 0;
}
/** Reads a sorted, filtered page of cron run-log rows. */
function readCronRunLogRowsPage(params) {
	let query = applyRunLogFilters(getCronRunLogKysely(params.db).selectFrom("cron_run_logs").selectAll(), params).orderBy("ts", params.sortDir).orderBy("seq", params.sortDir);
	if (params.limit !== void 0 && params.offset !== void 0) query = query.limit(params.limit).offset(params.offset);
	return executeSqliteQuerySync(params.db, query).rows;
}
function nextCronRunLogSeq(db, storeKey, jobId) {
	return (normalizeSqliteNumber(executeSqliteQueryTakeFirstSync(db, getCronRunLogKysely(db).selectFrom("cron_run_logs").select((eb) => eb.fn.max("seq").as("seq")).where("store_key", "=", storeKey).where("job_id", "=", jobId))?.seq ?? null) ?? 0) + 1;
}
/** Appends a cron run-log entry with a per-job monotonic sequence number. */
function insertCronRunLogEntry(db, storeKey, entry) {
	const seq = nextCronRunLogSeq(db, storeKey, entry.jobId);
	executeSqliteQuerySync(db, getCronRunLogKysely(db).insertInto("cron_run_logs").values(bindCronRunLogRow({
		storeKey,
		seq,
		entry
	})));
}
/** Prunes old cron run-log rows for one job, retaining the newest keepLines rows. */
function pruneCronRunLogRows(db, storeKey, jobId, keepLines) {
	const keep = Math.max(1, Math.floor(keepLines));
	const keepSeqs = getCronRunLogKysely(db).selectFrom("cron_run_logs").select("seq").where("store_key", "=", storeKey).where("job_id", "=", jobId).orderBy("seq", "desc").limit(keep);
	executeSqliteQuerySync(db, getCronRunLogKysely(db).deleteFrom("cron_run_logs").where("store_key", "=", storeKey).where("job_id", "=", jobId).where("seq", "not in", keepSeqs));
}
//#endregion
//#region src/cron/run-log.ts
/** Public cron run-log API with serialized writes and paged reads. */
const INVALID_CRON_RUN_LOG_JOB_ID_MESSAGE = "invalid cron run log job id";
function assertSafeCronRunLogJobId(jobId) {
	const trimmed = jobId.trim();
	if (!trimmed) throw new Error(INVALID_CRON_RUN_LOG_JOB_ID_MESSAGE);
	if (trimmed.includes("/") || trimmed.includes("\\") || trimmed.includes("\0")) throw new Error(INVALID_CRON_RUN_LOG_JOB_ID_MESSAGE);
	return trimmed;
}
/** Returns whether an error came from cron run-log job id validation. */
function isInvalidCronRunLogJobIdError(err) {
	return err instanceof Error && err.message === INVALID_CRON_RUN_LOG_JOB_ID_MESSAGE;
}
const writesByTarget = /* @__PURE__ */ new Map();
/** Legacy byte cap kept for config parsing compatibility with older file-backed run logs. */
const DEFAULT_CRON_RUN_LOG_MAX_BYTES = 2e6;
/** Default SQLite row retention per cron job when no explicit keepLines value is configured. */
const DEFAULT_CRON_RUN_LOG_KEEP_LINES = 2e3;
/** Resolves configured run-log pruning limits while preserving legacy maxBytes parsing. */
function resolveCronRunLogPruneOptions(cfg) {
	let maxBytes = DEFAULT_CRON_RUN_LOG_MAX_BYTES;
	if (cfg?.maxBytes !== void 0) try {
		const configuredMaxBytes = normalizeStringifiedOptionalString(cfg.maxBytes);
		if (configuredMaxBytes) maxBytes = parseByteSize(configuredMaxBytes, { defaultUnit: "b" });
	} catch {
		maxBytes = DEFAULT_CRON_RUN_LOG_MAX_BYTES;
	}
	let keepLines = DEFAULT_CRON_RUN_LOG_KEEP_LINES;
	if (typeof cfg?.keepLines === "number" && Number.isFinite(cfg.keepLines) && cfg.keepLines > 0) keepLines = Math.floor(cfg.keepLines);
	return {
		maxBytes,
		keepLines
	};
}
function cronRunLogWriteKey(storePath, jobId) {
	return `${cronStoreKey(storePath)}\0${jobId ?? ""}`;
}
async function drainPendingWrite(storePath, jobId) {
	if (jobId) {
		await writesByTarget.get(cronRunLogWriteKey(storePath, jobId))?.catch(() => void 0);
		return;
	}
	const storePrefix = `${cronStoreKey(storePath)}\0`;
	const pending = [...writesByTarget.entries()].filter(([key]) => key.startsWith(storePrefix)).map(([, write]) => write.catch(() => void 0));
	await Promise.all(pending);
}
/** Appends a cron run-log row and serializes writes per store/job before pruning old rows. */
async function appendCronRunLog(params) {
	const normalizedJobId = assertSafeCronRunLogJobId(params.entry.jobId);
	const entry = normalizedJobId === params.entry.jobId ? params.entry : {
		...params.entry,
		jobId: normalizedJobId
	};
	const storeKey = cronStoreKey(params.storePath);
	const writeKey = cronRunLogWriteKey(params.storePath, entry.jobId);
	const next = (writesByTarget.get(writeKey) ?? Promise.resolve()).catch(() => void 0).then(async () => {
		runOpenClawStateWriteTransaction(({ db }) => {
			insertCronRunLogEntry(db, storeKey, entry);
			if (params.opts?.keepLines !== false) pruneCronRunLogRows(db, storeKey, entry.jobId, params.opts?.keepLines ?? DEFAULT_CRON_RUN_LOG_KEEP_LINES);
		});
	});
	writesByTarget.set(writeKey, next);
	try {
		await next;
	} finally {
		if (writesByTarget.get(writeKey) === next) writesByTarget.delete(writeKey);
	}
}
/** Reads recent run-log entries synchronously for startup/task reconciliation paths. */
function readCronRunLogEntriesSync(params) {
	const limit = Math.max(1, Math.min(5e3, Math.floor(params.limit ?? 200)));
	const storeKey = cronStoreKey(params.storePath);
	const jobId = params.jobId ? assertSafeCronRunLogJobId(params.jobId) : void 0;
	return readCronRunLogRows(openOpenClawStateDatabase().db, storeKey, jobId).map(parseStoredRunLogEntry).filter((entry) => entry !== null).slice(-limit);
}
function normalizeRunStatusFilter(status) {
	if (status === "ok" || status === "error" || status === "skipped" || status === "all") return status;
	return "all";
}
function normalizeRunStatuses(opts) {
	if (Array.isArray(opts?.statuses) && opts.statuses.length > 0) {
		const filtered = opts.statuses.filter((status) => status === "ok" || status === "error" || status === "skipped");
		if (filtered.length > 0) return uniqueValues(filtered);
	}
	const status = normalizeRunStatusFilter(opts?.status);
	if (status === "all") return null;
	return [status];
}
function normalizeDeliveryStatuses(opts) {
	if (Array.isArray(opts?.deliveryStatuses) && opts.deliveryStatuses.length > 0) {
		const filtered = opts.deliveryStatuses.filter((status) => status === "delivered" || status === "not-delivered" || status === "unknown" || status === "not-requested");
		if (filtered.length > 0) return uniqueValues(filtered);
	}
	if (opts?.deliveryStatus === "delivered" || opts?.deliveryStatus === "not-delivered" || opts?.deliveryStatus === "unknown" || opts?.deliveryStatus === "not-requested") return [opts.deliveryStatus];
	return null;
}
function runIdMatches(entry, runId) {
	const normalized = normalizeOptionalString(runId);
	return !normalized || entry.runId === normalized;
}
function filterRunLogEntries(entries, opts) {
	return entries.filter((entry) => {
		if (!runIdMatches(entry, opts.runId)) return false;
		if (opts.statuses && (!entry.status || !opts.statuses.includes(entry.status))) return false;
		if (opts.deliveryStatuses) {
			const deliveryStatus = entry.deliveryStatus ?? "not-requested";
			if (!opts.deliveryStatuses.includes(deliveryStatus)) return false;
		}
		if (!opts.query) return true;
		return normalizeLowercaseStringOrEmpty(opts.queryTextForEntry(entry)).includes(opts.query);
	});
}
/** Reads a bounded, filterable run-log page for CLI and UI list views. */
async function readCronRunLogEntriesPage(opts) {
	const jobId = opts.jobId ? assertSafeCronRunLogJobId(opts.jobId) : void 0;
	await drainPendingWrite(opts.storePath, jobId);
	const limit = Math.max(1, Math.min(200, Math.floor(opts.limit ?? 50)));
	const statuses = normalizeRunStatuses(opts);
	const deliveryStatuses = normalizeDeliveryStatuses(opts);
	const query = normalizeLowercaseStringOrEmpty(opts.query);
	const sortDir = opts.sortDir === "asc" ? "asc" : "desc";
	const db = openOpenClawStateDatabase().db;
	const storeKey = cronStoreKey(opts.storePath);
	const offset = Math.max(0, Math.floor(opts.offset ?? 0));
	if (!query) {
		const total = countCronRunLogRows({
			db,
			storeKey,
			jobId,
			statuses,
			deliveryStatuses,
			runId: opts.runId
		});
		const boundedOffset = Math.min(total, offset);
		const entries = readCronRunLogRowsPage({
			db,
			storeKey,
			jobId,
			statuses,
			deliveryStatuses,
			runId: opts.runId,
			sortDir,
			offset: boundedOffset,
			limit
		}).map(parseStoredRunLogEntry).filter((entry) => entry !== null);
		if (opts.jobNameById) for (const entry of entries) {
			const jobName = opts.jobNameById[entry.jobId];
			if (jobName) entry.jobName = jobName;
		}
		const nextOffset = boundedOffset + entries.length;
		return {
			entries,
			total,
			offset: boundedOffset,
			limit,
			hasMore: nextOffset < total,
			nextOffset: nextOffset < total ? nextOffset : null
		};
	}
	const filtered = filterRunLogEntries(readCronRunLogRowsPage({
		db,
		storeKey,
		jobId,
		statuses,
		deliveryStatuses,
		runId: opts.runId,
		sortDir
	}).map(parseStoredRunLogEntry).filter((entry) => entry !== null), {
		runId: opts.runId,
		statuses: null,
		deliveryStatuses: null,
		query,
		queryTextForEntry: (entry) => {
			const jobName = opts.jobNameById?.[entry.jobId] ?? "";
			return [
				entry.summary ?? "",
				entry.error ?? "",
				entry.errorReason ?? "",
				entry.diagnostics?.summary ?? "",
				...(entry.diagnostics?.entries ?? []).map((diagnostic) => diagnostic.message),
				entry.jobId,
				jobName,
				entry.delivery?.intended?.channel ?? "",
				entry.delivery?.resolved?.channel ?? "",
				...(entry.delivery?.messageToolSentTo ?? []).map((target) => target.channel)
			].join(" ");
		}
	});
	const sorted = sortDir === "asc" ? filtered.toSorted((a, b) => a.ts - b.ts) : filtered.toSorted((a, b) => b.ts - a.ts);
	const total = sorted.length;
	const boundedOffset = Math.min(total, offset);
	const entries = sorted.slice(boundedOffset, boundedOffset + limit);
	if (opts.jobNameById) for (const entry of entries) {
		const jobName = opts.jobNameById[entry.jobId];
		if (jobName) entry.jobName = jobName;
	}
	const nextOffset = boundedOffset + entries.length;
	return {
		entries,
		total,
		offset: boundedOffset,
		limit,
		hasMore: nextOffset < total,
		nextOffset: nextOffset < total ? nextOffset : null
	};
}
/** Reads a run-log page across all jobs for a specific cron store. */
async function readCronRunLogEntriesPageAll(opts) {
	return readCronRunLogEntriesPage(opts);
}
//#endregion
export { readCronRunLogEntriesSync as a, readCronRunLogEntriesPageAll as i, isInvalidCronRunLogJobIdError as n, resolveCronRunLogPruneOptions as o, readCronRunLogEntriesPage as r, parseCronRunLogEntryObject as s, appendCronRunLog as t };
