import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { f as asSafeIntegerInRange, s as asFiniteNumber, t as MAX_DATE_TIMESTAMP_MS } from "./number-coercion-CkhMiRw8.mjs";
import "./src-Djeo9OvP.mjs";
import { c as isRecord, r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as safeParseJsonRecord, t as safeParseJson } from "./json-coercion-pfKbZnCJ.mjs";
import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { t as VERSION } from "./version-jg_14gWz.mjs";
import { n as OpenClawStateOwnershipError } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { i as resolveOpenClawAgentDatabaseStoredPath, o as resolveOpenClawStateDirForDatabasePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { a as LAZY_ADDITIVE_STATE_TABLES, i as LAZY_ADDITIVE_STATE_INDEXES, n as FIRST_USE_STATE_INDEXES, r as FIRST_USE_STATE_TABLES, t as DOCTOR_OWNED_STATE_TABLES } from "./openclaw-state-db-contract-QlwTsE6j.mjs";
import { Et as _enum, Fn as object, Jn as string, Kt as custom, Lt as boolean, Pn as number, Sn as looseObject, sr as unknown, xn as literal } from "./schemas-BOYIvvln.mjs";
import { r as isPostgresSqlConnection } from "./sql-connection-DmQzXTVz.mjs";
import { K as OPENCLAW_STATE_SCHEMA_SQL, ft as splitSqlList, nt as extractSqliteTableSchema, st as normalizeSchemaSql, ut as quoteSqliteIdentifier } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { c as withSqlitePostCommitPublications, t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-22SfWsLt.mjs";
import { h as captureSqliteSchemaFacts, i as getAdmittedSqliteSchemaFacts } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { r as openNodeSqliteDatabase } from "./node-sqlite-CYaq-2Hb.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { r as assertSqliteIntegrity } from "./sqlite-integrity-06TCB-az.mjs";
import { n as normalizeSqliteNumber, t as coerceRequiredSqliteNumber } from "./sqlite-number-DZt1m75H.mjs";
import { a as runSqliteImmediateTransactionSync, r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { r as requireNativeDatabaseFile } from "./physical-facts-Cvtfrs3r.mjs";
import { t as SqliteSchemaMismatchError } from "./sqlite-schema-issues-BnRd2KGO.mjs";
import { a as tableExists, i as readTableColumns, n as ensureColumn, o as tableHasColumn, s as tablePrimaryKeyColumns, t as classifySqliteTableReadError } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { a as readSqliteUserVersion } from "./sqlite-user-version-Q7gNRxhK.mjs";
import { n as OpenClawStateDatabaseSchemaMigrationRequiredError, t as LEGACY_SKILL_WORKSHOP_COLLECTION_REVIEWS_INDEX } from "./openclaw-state-db-schema-migration-required-DmM7omMC.mjs";
import { c as publishStateRuntimeSchemaAdmission, i as readStateSchemaContentVersion, l as publishStateSchemaVersionAdmission, n as admitStateSchemaFacts, o as getStateRuntimeSchemaAdmission, r as assertSupportedStateSchemaVersion, s as getStateSchemaVersionAdmission } from "./openclaw-state-db-schema-version-CcCTuttF.mjs";
import { t as assertOpenClawStateRuntimeIntegrity } from "./openclaw-state-db-integrity-admission-BHpYd_s7.mjs";
import { n as readStateSchemaPublicationBlocker, r as resolveStateSchemaVersionToPublish } from "./openclaw-state-schema-publication-C2fzjU88.mjs";
import { a as collectSqliteNamedIndexContract, c as getCanonicalSqliteNamedIndexContracts, n as assertSqliteSchemaContains, o as collectSqliteSchemaIssues, r as assertSqliteSchemaTablesPresent, s as createSqliteTableContractReader, u as readSqliteSchemaCookie } from "./sqlite-schema-contract-C7_zBR7q.mjs";
import { t as FAILOVER_REASONS } from "./failover-reasons-Mjd0tFtT.mjs";
import { r as withSqliteWritableSchema, t as hasDanglingSkillWorkshopCollectionReviewIndex } from "./openclaw-state-db-doctor-schema-l6CS6yvq.mjs";
import { n as prepareSqliteAuditRecord, t as createSqliteAuditRecordKernel } from "./sqlite-audit-record.kernel-BhQWS5ko.mjs";
import { A as CLAW_STARTUP_ADDITIVE_STATE_COLUMN_DEFINITIONS, O as CLAW_FIRST_USE_ADDITIVE_STATE_COLUMN_DEFINITIONS, c as assertCanonicalOperatorApprovalKinds, j as ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS, k as CLAW_LAZY_ADDITIVE_STATE_COLUMN_DEFINITIONS, l as detectOperatorApprovalSchemaMigration, s as repairLegacySubagentRetainedResults } from "./openclaw-state-db-legacy-backfills-DGJSWaXR.mjs";
import { n as assertOpenClawStateWriteAllowed } from "./openclaw-state-ownership-SRnMuR_a.mjs";
import { t as UpdateSchemaRefusalError } from "./openclaw-update-schema-refusal-C8zbzbYZ.mjs";
import { existsSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
//#region src/cron/completion-status.ts
/** Resolves authored completion from an admitted job, or legacy completion from stored facts. */
function resolveCronCompletionStatus(params) {
	if (params.status === "error" || params.status === "skipped") return "failed";
	if (params.status !== "ok") return "unknown";
	if (params.requiredDelivery === void 0) return params.delivered === true || params.deliveryStatus === "delivered" || params.deliveryStatus === "not-requested" ? "succeeded" : "unknown";
	if (!params.requiredDelivery || params.deliveryStatus === "delivered" || params.deliveryStatus === "not-delivered" && params.deliverySuppressionReason !== void 0) return "succeeded";
	return params.deliveryStatus === "not-delivered" ? "failed" : "unknown";
}
/** Resolves completion from the immutable delivery contract admitted for this run. */
function resolveAdmittedCronCompletionStatus(job, status, deliveryStatus, deliverySuppressionReason) {
	return resolveCronCompletionStatus({
		status,
		deliveryStatus,
		deliverySuppressionReason,
		requiredDelivery: job.delivery?.bestEffort !== true && deliveryStatus !== "not-requested"
	});
}
//#endregion
//#region src/cron/execution-error-constants.ts
/** Stable cron execution error text shared by runtime and ledger codecs. */
const STARTUP_INTERRUPTED_ERROR = "cron: job interrupted by gateway restart";
const CRON_JOB_EXECUTION_TIMEOUT_ERROR = "cron: job execution timed out";
const CRON_SETUP_TIMEOUT_ERROR = "cron: isolated agent setup timed out before runner start";
const CRON_PRE_EXECUTION_TIMEOUT_ERROR = "cron: isolated agent run stalled before execution start";
const CRON_TIMEOUT_ERROR_PREFIXES = [
	CRON_JOB_EXECUTION_TIMEOUT_ERROR,
	CRON_SETUP_TIMEOUT_ERROR,
	CRON_PRE_EXECUTION_TIMEOUT_ERROR
];
/** Recognizes watchdog timeouts without loading agent or execution-phase runtime. */
function isCronTimeoutErrorText(error) {
	return typeof error === "string" && CRON_TIMEOUT_ERROR_PREFIXES.some((prefix) => error === prefix || error.startsWith(`${prefix} `));
}
//#endregion
//#region src/cron/run-diagnostics-normalize.ts
/** Dependency-light normalization helpers for stored cron run diagnostics. */
const MAX_ENTRIES = 10;
const MAX_ENTRY_CHARS = 1e3;
const MAX_SUMMARY_CHARS = 2e3;
function normalizeSeverity(value) {
	return value === "info" || value === "warn" || value === "error" ? value : "error";
}
function normalizeSource(value) {
	switch (value) {
		case "cron-preflight":
		case "cron-setup":
		case "model-preflight":
		case "agent-run":
		case "tool":
		case "exec":
		case "delivery": return value;
		default: return "agent-run";
	}
}
function normalizeTimestamp$1(value, nowMs) {
	return typeof value === "number" && Number.isFinite(value) && value >= 0 ? Math.floor(value) : nowMs();
}
function formatUnknownError(error) {
	if (error instanceof Error) return error.message || error.name;
	return String(error);
}
function normalizeExitCode(value) {
	return asFiniteNumber(value) ?? (value === null ? null : void 0);
}
function tailText(value, maxChars) {
	if (value.length <= maxChars) return value;
	return sliceUtf16Safe(value, -maxChars);
}
function normalizeDiagnosticMessage(value, redactText) {
	if (typeof value !== "string") return {};
	const normalized = normalizeOptionalString(value);
	if (!normalized) return {};
	const redacted = redactText(normalized);
	if (redacted.length <= MAX_ENTRY_CHARS) return { message: redacted };
	return {
		message: `${truncateUtf16Safe(redacted, 999)}…`,
		truncated: true
	};
}
function normalizeCronRunDiagnosticSummary(value) {
	const normalized = normalizeOptionalString(value);
	if (!normalized) return;
	if (normalized.length <= MAX_SUMMARY_CHARS) return normalized;
	return `${truncateUtf16Safe(normalized, 1999)}…`;
}
/** Normalizes stored cron diagnostic payloads into bounded entries. */
function normalizeCronRunDiagnosticsCore(value, opts) {
	if (!value || typeof value !== "object") return;
	const record = value;
	const nowMs = opts?.nowMs ?? Date.now;
	const redactText = opts?.redactText ?? ((text) => text);
	const entriesRaw = Array.isArray(record.entries) ? record.entries : [];
	const entries = [];
	for (const item of entriesRaw) {
		if (!item || typeof item !== "object") continue;
		const entry = item;
		const normalized = normalizeDiagnosticMessage(entry.message, redactText);
		if (!normalized.message) continue;
		entries.push({
			ts: normalizeTimestamp$1(entry.ts, nowMs),
			source: normalizeSource(entry.source),
			severity: normalizeSeverity(entry.severity),
			message: normalized.message,
			...typeof entry.toolName === "string" && entry.toolName.trim() ? { toolName: entry.toolName.trim() } : {},
			...typeof entry.exitCode === "number" && Number.isFinite(entry.exitCode) ? { exitCode: entry.exitCode } : entry.exitCode === null ? { exitCode: null } : {},
			...entry.truncated === true || normalized.truncated ? { truncated: true } : {}
		});
		if (entries.length > MAX_ENTRIES) entries.shift();
	}
	const summary = normalizeCronRunDiagnosticSummary(typeof record.summary === "string" ? redactText(record.summary) : void 0);
	if (entries.length === 0 && !summary) return;
	return {
		...summary ? { summary } : {},
		entries
	};
}
//#endregion
//#region src/cron/run-history-detail.ts
/** Read-side cron codec between cron history detail and the stable run-history wire shape.
* Deliberately free of agent/runtime imports so history reads stay dependency-light;
* the event->entry write codec lives in run-event-codec.ts. */
const CRON_RUN_DETAIL_KIND = "cron-run";
const cronRunStatusSchema = _enum([
	"ok",
	"error",
	"skipped"
]);
const cronCompletionStatusSchema = _enum([
	"succeeded",
	"failed",
	"unknown"
]);
const cronDeliveryStatusSchema = _enum([
	"delivered",
	"not-delivered",
	"unknown",
	"not-requested"
]);
const optionalCronStringSchema = string().optional().catch(void 0);
const optionalNonBlankCronStringSchema = string().refine((value) => value.trim().length > 0).optional().catch(void 0);
const optionalCronTimestampSchema = unknown().optional().transform((value) => normalizeTimestamp(value));
const optionalCronNonnegativeIntegerSchema = unknown().optional().transform((value) => asSafeIntegerInRange(value, { min: 0 }));
const cronUsageSchema = object({
	input_tokens: optionalCronNonnegativeIntegerSchema,
	output_tokens: optionalCronNonnegativeIntegerSchema,
	total_tokens: optionalCronNonnegativeIntegerSchema,
	cache_read_tokens: optionalCronNonnegativeIntegerSchema,
	cache_write_tokens: optionalCronNonnegativeIntegerSchema
}).transform((usage) => Object.values(usage).some((tokenCount) => tokenCount !== void 0) ? usage : void 0).optional().catch(void 0);
const cronFailureNotificationDeliverySchema = looseObject({
	status: cronDeliveryStatusSchema,
	delivered: boolean().optional().catch(void 0),
	error: optionalCronStringSchema
}).transform(({ status, delivered, error }) => ({
	status,
	...delivered !== void 0 ? { delivered } : {},
	...error !== void 0 ? { error } : {}
})).optional().catch(void 0);
const cronRunLogEntrySchema = looseObject({
	action: literal("finished"),
	jobId: string().refine((value) => value.trim().length > 0),
	ts: unknown().transform((value) => normalizeTimestamp(value)).pipe(number()),
	status: cronRunStatusSchema.optional().catch(void 0),
	completionStatus: cronCompletionStatusSchema.optional().catch(void 0),
	error: optionalCronStringSchema,
	errorReason: _enum(FAILOVER_REASONS).optional().catch(void 0),
	summary: optionalCronStringSchema,
	runId: optionalNonBlankCronStringSchema,
	diagnostics: unknown().optional(),
	runAtMs: optionalCronTimestampSchema,
	durationMs: optionalCronNonnegativeIntegerSchema,
	nextRunAtMs: optionalCronTimestampSchema,
	triggerFired: unknown().optional().transform((value) => value === true ? true : void 0),
	model: optionalNonBlankCronStringSchema,
	provider: optionalNonBlankCronStringSchema,
	usage: cronUsageSchema,
	delivered: boolean().optional().catch(void 0),
	deliveryStatus: cronDeliveryStatusSchema.optional().catch(void 0),
	deliveryError: optionalCronStringSchema,
	deliverySuppressionReason: _enum([
		"empty",
		"silent",
		"heartbeat",
		"channel_transform"
	]).optional().catch(void 0),
	failureNotificationDelivery: cronFailureNotificationDeliverySchema,
	delivery: custom(isJsonObject).optional().catch(void 0),
	sessionId: optionalNonBlankCronStringSchema,
	sessionKey: optionalNonBlankCronStringSchema
});
function isJsonValue(value) {
	const pending = [value];
	while (pending.length > 0) {
		const current = pending.pop();
		if (current === null || typeof current === "string" || typeof current === "boolean" || typeof current === "number") continue;
		if (!Array.isArray(current) && !isRecord(current)) return false;
		for (const child of Object.values(current)) pending.push(child);
	}
	return true;
}
/** Native JSON parsing keeps released scalar/null and numeric-overflow semantics. */
function parseCronRunDetailJson(serialized) {
	const value = safeParseJson(serialized);
	return isJsonValue(value) ? value : void 0;
}
function toJsonValue(value) {
	const serialized = JSON.stringify(value);
	return serialized === void 0 ? void 0 : parseCronRunDetailJson(serialized);
}
function isJsonObject(value) {
	return isRecord(value);
}
function normalizeTimestamp(value) {
	return asSafeIntegerInRange(value, {
		min: 0,
		max: MAX_DATE_TIMESTAMP_MS
	});
}
function isCronRunStatus(value) {
	return cronRunStatusSchema.safeParse(value).success;
}
function isCronDeliveryStatus(value) {
	return cronDeliveryStatusSchema.safeParse(value).success;
}
/** Parses stored or migrated cron history while preserving the stable wire shape. */
function parseCronRunLogEntryObject(obj, opts) {
	const jobId = normalizeOptionalString(opts?.jobId);
	const parsed = cronRunLogEntrySchema.safeParse(obj);
	if (!parsed.success) return null;
	const entryObj = parsed.data;
	if (jobId && entryObj.jobId !== jobId) return null;
	return {
		ts: entryObj.ts,
		jobId: entryObj.jobId,
		action: "finished",
		status: entryObj.status,
		completionStatus: entryObj.completionStatus ?? resolveCronCompletionStatus({
			status: entryObj.status,
			delivered: entryObj.delivered,
			deliveryStatus: entryObj.deliveryStatus
		}),
		error: entryObj.error,
		errorReason: entryObj.errorReason,
		summary: entryObj.summary,
		runId: entryObj.runId,
		diagnostics: normalizeCronRunDiagnosticsCore(entryObj.diagnostics),
		runAtMs: entryObj.runAtMs,
		durationMs: entryObj.durationMs,
		nextRunAtMs: entryObj.nextRunAtMs,
		triggerFired: entryObj.triggerFired,
		model: entryObj.model,
		provider: entryObj.provider,
		usage: entryObj.usage,
		delivered: entryObj.delivered,
		deliveryStatus: entryObj.deliveryStatus,
		deliveryError: entryObj.deliveryError,
		deliverySuppressionReason: entryObj.deliverySuppressionReason,
		failureNotificationDelivery: entryObj.failureNotificationDelivery,
		delivery: entryObj.delivery,
		sessionId: entryObj.sessionId,
		sessionKey: entryObj.sessionKey
	};
}
/** Encodes Cron-owned outcome fields for retained history. */
function cronRunLogEntryToDetail(entry, options) {
	return toJsonValue({
		kind: CRON_RUN_DETAIL_KIND,
		status: entry.status,
		completionStatus: entry.completionStatus,
		error: entry.error ?? null,
		summary: entry.summary ?? null,
		storeKey: options.storeKey,
		errorReason: entry.errorReason,
		diagnostics: entry.diagnostics,
		delivered: entry.delivered,
		deliveryStatus: entry.deliveryStatus,
		deliveryError: entry.deliveryError,
		deliverySuppressionReason: entry.deliverySuppressionReason,
		failureNotificationDelivery: entry.failureNotificationDelivery,
		delivery: entry.delivery,
		sessionId: entry.sessionId,
		runId: entry.runId,
		runAtMs: entry.runAtMs,
		durationMs: entry.durationMs,
		nextRunAtMs: entry.nextRunAtMs,
		triggerFired: entry.triggerFired,
		triggerStateChanged: options.triggerEval?.fired === true ? options.triggerEval.stateChanged : void 0,
		triggerState: options.triggerEval?.fired === true && options.triggerEval.stateChanged ? options.triggerEval.state : void 0,
		scriptStateChanged: options.scriptResult?.scriptStateChanged === true ? true : void 0,
		scriptState: options.scriptResult?.scriptStateChanged === true ? options.scriptResult.scriptState : void 0,
		model: entry.model,
		provider: entry.provider,
		usage: entry.usage
	}) ?? { kind: CRON_RUN_DETAIL_KIND };
}
/** Stores quiet-trigger recovery facts without creating a run-history detail row. */
function cronQuietTriggerDetail(storeKey, triggerEval) {
	return toJsonValue({
		storeKey,
		triggerFired: false,
		triggerStateChanged: triggerEval.stateChanged,
		...triggerEval.stateChanged ? { triggerState: triggerEval.state } : {}
	}) ?? {
		storeKey,
		triggerFired: false,
		triggerStateChanged: false
	};
}
/** Returns the cron store partition recorded on a cron row. */
function cronRunRecordStoreKey(record) {
	return isJsonObject(record.detail) && typeof record.detail.storeKey === "string" ? record.detail.storeKey : void 0;
}
/** Keeps history projection, recovery, and retention on one record-row timestamp. */
function resolveCronRunRecordTimestamp(record) {
	return record.endedAt ?? record.lastEventAt ?? record.createdAt;
}
/** Shared newest-first order for history pages, retention, and recovery. */
function compareCronRunRecordsNewestFirst(left, right) {
	return resolveCronRunRecordTimestamp(right) - resolveCronRunRecordTimestamp(left) || right.createdAt - left.createdAt || right.id.localeCompare(left.id);
}
/** Reads internal trigger recovery data without adding it to run-history responses. */
function cronRunRecordToTriggerEval(record) {
	if (!isJsonObject(record.detail) || typeof record.detail.triggerFired !== "boolean") return;
	return {
		fired: record.detail.triggerFired,
		stateChanged: record.detail.triggerStateChanged === true,
		...record.detail.triggerStateChanged === true && "triggerState" in record.detail ? { state: record.detail.triggerState } : {}
	};
}
/** Reads internal payload-script recovery data without exposing it in run history. */
function cronRunRecordToScriptRunResult(record) {
	if (!isJsonObject(record.detail) || record.detail.scriptStateChanged !== true) return;
	return {
		scriptStateChanged: true,
		...Object.hasOwn(record.detail, "scriptState") ? { scriptState: record.detail.scriptState } : {}
	};
}
/** Preserves the released history row status vocabulary. */
function cronRunStorageStatus(entry) {
	if (entry.status === "ok") return (entry.completionStatus ?? resolveCronCompletionStatus({
		status: entry.status,
		delivered: entry.delivered,
		deliveryStatus: entry.deliveryStatus
	})) === "succeeded" ? "succeeded" : "failed";
	return entry.status === "error" && isCronTimeoutErrorText(entry.error) ? "timed_out" : "failed";
}
/** Reconstructs the unchanged CronRunLogEntry wire shape from a cron record row. */
function cronRunRecordToRunLogEntry(record) {
	if (!record.jobId || !isJsonObject(record.detail)) return null;
	if (record.detail.kind !== CRON_RUN_DETAIL_KIND) return null;
	const wireDetail = { ...record.detail };
	delete wireDetail.storeKey;
	return parseCronRunLogEntryObject({
		error: record.error,
		summary: record.summary,
		...wireDetail,
		ts: resolveCronRunRecordTimestamp(record),
		jobId: record.jobId,
		action: "finished",
		sessionKey: record.sessionKey,
		runId: typeof record.detail.runId === "string" ? record.detail.runId : record.runId
	}, { jobId: record.jobId });
}
//#endregion
//#region src/infra/state-migrations.cron-run-logs.ts
const CRON_RUN_LOG_TASK_IMPORT_MIGRATION_ID = "state:cron-run-logs-to-task-runs:v1";
const CRON_RUN_LOG_IMPORT_BATCH_SIZE = 500;
function hasLegacyCronRunLogs(db) {
	const schema = getAdmittedSqliteSchemaFacts(db);
	if (schema) return schema.tables.has("cron_run_logs");
	return Boolean(db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'cron_run_logs' LIMIT 1").get());
}
function collectMirroredTasks(db) {
	const rows = db.prepare(`SELECT source_id, ended_at, detail_json
       FROM task_runs
       WHERE runtime = 'cron' AND source_id IS NOT NULL AND detail_json IS NOT NULL`).all();
	const bySource = /* @__PURE__ */ new Map();
	for (const row of rows) {
		const detail = row.detail_json ? safeParseJsonRecord(row.detail_json) : void 0;
		if (!row.source_id || detail?.kind !== "cron-run") continue;
		const identities = bySource.get(row.source_id) ?? [];
		identities.push({
			endedAt: normalizeSqliteNumber(row.ended_at) ?? null,
			...typeof detail.runId === "string" && detail.runId ? { runId: detail.runId } : {}
		});
		bySource.set(row.source_id, identities);
	}
	return bySource;
}
function hasMirroredIdentity(identities, runId, endedAt) {
	return identities.some((identity) => runId && identity.runId ? identity.runId === runId : identity.endedAt === endedAt);
}
function integerToBoolean(value) {
	return value === null || value === void 0 ? void 0 : coerceRequiredSqliteNumber(value) !== 0;
}
/** Legacy rows trust write-time errorReason and diagnostic redaction without recomputation. */
function parseLegacyRow(row) {
	const parsed = parseCronRunLogEntryObject(safeParseJson(row.entry_json ?? ""), { jobId: row.job_id });
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
		runAtMs: normalizeSqliteNumber(row.run_at_ms ?? null) ?? parsed.runAtMs,
		durationMs: normalizeSqliteNumber(row.duration_ms ?? null) ?? parsed.durationMs,
		nextRunAtMs: normalizeSqliteNumber(row.next_run_at_ms ?? null) ?? parsed.nextRunAtMs,
		model: row.model ?? parsed.model,
		provider: row.provider ?? parsed.provider
	};
}
/** Runs inside the state schema transaction and removes the retired table after import. */
function migrateLegacyCronRunLogsToTaskRuns(db) {
	if (!hasLegacyCronRunLogs(db)) return {
		imported: 0,
		alreadyMirrored: 0,
		malformed: 0,
		skipped: true
	};
	const mirrored = collectMirroredTasks(db);
	const ordinals = /* @__PURE__ */ new Map();
	const insert = db.prepare(`
    INSERT INTO task_runs (
      task_id, runtime, task_kind, source_id, requester_session_key, owner_key, scope_kind,
      child_session_key, parent_flow_id, parent_task_id, agent_id, requester_agent_id, run_id,
      label, task, status, delivery_status, notify_policy, created_at, started_at, ended_at,
      last_event_at, cleanup_after, error, progress_summary, terminal_summary, terminal_outcome,
      detail_json
    ) VALUES (
      @task_id, 'cron', NULL, @source_id, '', '', 'system', @child_session_key, NULL, NULL,
      NULL, NULL, @run_id, NULL, @task, @status, 'not_applicable', 'silent', @created_at,
      @started_at, @ended_at, @ended_at, NULL, @error, NULL, @terminal_summary,
      @terminal_outcome, @detail_json
    )
  `);
	let imported = 0;
	let alreadyMirrored = 0;
	let malformed = 0;
	let offset = 0;
	while (true) {
		const rows = db.prepare(`SELECT * FROM cron_run_logs
         ORDER BY job_id, ts, store_key, seq
         LIMIT ? OFFSET ?`).all(CRON_RUN_LOG_IMPORT_BATCH_SIZE, offset);
		if (rows.length === 0) break;
		offset += rows.length;
		for (const row of rows) {
			const entry = parseLegacyRow(row);
			if (!entry) {
				malformed++;
				continue;
			}
			const key = `${entry.jobId}\0${entry.ts}`;
			const ordinal = (ordinals.get(key) ?? 0) + 1;
			ordinals.set(key, ordinal);
			if (hasMirroredIdentity(mirrored.get(entry.jobId) ?? [], entry.runId, entry.ts)) {
				alreadyMirrored++;
				continue;
			}
			const taskId = `cron-runlog-import:${entry.jobId}:${entry.ts}:${ordinal}`;
			const status = cronRunStorageStatus(entry);
			insert.run({
				task_id: taskId,
				source_id: entry.jobId,
				child_session_key: entry.sessionKey?.trim() || null,
				run_id: taskId,
				task: entry.jobId,
				status,
				created_at: entry.runAtMs ?? entry.ts,
				started_at: entry.runAtMs ?? null,
				ended_at: entry.ts,
				error: entry.error ?? null,
				terminal_summary: entry.summary ?? null,
				terminal_outcome: status === "succeeded" ? "succeeded" : null,
				detail_json: JSON.stringify(cronRunLogEntryToDetail(entry, { storeKey: row.store_key }))
			});
			imported++;
		}
	}
	db.exec(`
    DROP INDEX IF EXISTS idx_cron_run_logs_store_ts;
    DROP INDEX IF EXISTS idx_cron_run_logs_job_status;
    DROP INDEX IF EXISTS idx_cron_run_logs_delivery;
    DROP TABLE cron_run_logs;
  `);
	const result = {
		imported,
		alreadyMirrored,
		malformed,
		skipped: false
	};
	const now = Date.now();
	db.prepare(`INSERT INTO migration_runs (id, started_at, finished_at, status, report_json)
     VALUES (?, ?, ?, 'completed', ?)
     ON CONFLICT(id) DO UPDATE SET
       finished_at = excluded.finished_at,
       status = excluded.status,
       report_json = excluded.report_json`).run(CRON_RUN_LOG_TASK_IMPORT_MIGRATION_ID, now, now, JSON.stringify(result));
	return result;
}
//#endregion
//#region src/state/openclaw-state-db-cron-delivery-migration.ts
/** Absence of old delivery evidence cannot prove that a completion was never sent. */
function migrateCronDeliveryAttemptState(db, previousVersion) {
	return previousVersion < 20 && tableExists(db, "cron_run_receipts") ? ensureColumn(db, "cron_run_receipts", "delivery_attempt_state TEXT NOT NULL DEFAULT 'unknown' CHECK (delivery_attempt_state IN ('unknown', 'not-started', 'started'))") : false;
}
//#endregion
//#region src/state/openclaw-state-db-schema-v13-widerow.ts
const FAILURE_DESTINATION_COLUMNS = [
	["failure_delivery_mode", "mode"],
	["failure_delivery_channel", "channel"],
	["failure_delivery_to", "to"],
	["failure_delivery_account_id", "accountId"]
];
function reprojectLegacyCronJson(db) {
	const projectionColumns = FAILURE_DESTINATION_COLUMNS.map(([columnName]) => tableHasColumn(db, "cron_jobs", columnName) ? quoteSqliteIdentifier(columnName) : `NULL AS ${quoteSqliteIdentifier(columnName)}`);
	const lastRunStatus = tableHasColumn(db, "cron_jobs", "last_run_status") ? "last_run_status" : "NULL AS last_run_status";
	const rows = db.prepare(`SELECT store_key, job_id, enabled, job_json, state_json, ${lastRunStatus}, ${projectionColumns.join(", ")}
         FROM cron_jobs`).all();
	const update = db.prepare("UPDATE cron_jobs SET job_json = ?, state_json = ? WHERE store_key = ? AND job_id = ?");
	for (const row of rows) {
		if (typeof row.store_key !== "string" || typeof row.job_id !== "string" || typeof row.job_json !== "string" || typeof row.state_json !== "string") throw new Error("OpenClaw v12 cron job row is not canonical");
		const job = asNullableRecord(safeParseJson(row.job_json));
		const state = asNullableRecord(safeParseJson(row.state_json));
		if (!job || !state) continue;
		let changed = false;
		const delivery = asNullableRecord(job.delivery);
		const destination = asNullableRecord(delivery?.failureDestination);
		if ((!Object.hasOwn(job, "delivery") || delivery !== null) && (!delivery || !Object.hasOwn(delivery, "failureDestination") || destination !== null)) {
			const nextDelivery = delivery ?? {};
			const nextDestination = destination ?? {};
			for (const [columnName, fieldName] of FAILURE_DESTINATION_COLUMNS) {
				const value = row[columnName];
				if (typeof value !== "string" || Object.hasOwn(nextDestination, fieldName)) continue;
				nextDestination[fieldName] = value === "" ? null : value;
				changed = true;
			}
			if (changed) {
				nextDelivery.failureDestination = nextDestination;
				job.delivery = nextDelivery;
			}
		}
		if (typeof job.enabled !== "boolean") {
			job.enabled = row.enabled !== 0;
			changed = true;
		}
		const hasLegacyStatus = Object.hasOwn(state, "lastStatus");
		if (!Object.hasOwn(state, "lastRunStatus") && (hasLegacyStatus || typeof row.last_run_status === "string")) {
			state.lastRunStatus = hasLegacyStatus ? state.lastStatus : row.last_run_status;
			changed = true;
		}
		if (changed) update.run(JSON.stringify(job), JSON.stringify(state), row.store_key, row.job_id);
	}
}
function rebuildJsonCanonicalTable(db, tableName) {
	const migrationTable = `${tableName}_migration_v13`;
	if (tableExists(db, migrationTable)) throw new Error(`OpenClaw v13 migration table already exists: ${migrationTable}`);
	const migrationSchema = extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL, tableName, { errorMessage: `Canonical ${tableName} schema block is missing` }).replace(`CREATE TABLE IF NOT EXISTS ${tableName} (`, `CREATE TABLE ${migrationTable} (`);
	db.exec(migrationSchema);
	const columns = db.prepare(`PRAGMA table_xinfo(${migrationTable})`).all().flatMap((column) => column.hidden === 0 && typeof column.name === "string" ? [column.name] : []);
	const projection = columns.map((columnName) => {
		return CLAW_LAZY_ADDITIVE_STATE_COLUMN_DEFINITIONS.some((column) => column.tableName === tableName && column.columnName === columnName) && !tableHasColumn(db, tableName, columnName) ? "NULL" : quoteSqliteIdentifier(columnName);
	});
	db.exec(`INSERT INTO ${migrationTable} (${columns.map(quoteSqliteIdentifier).join(", ")}) SELECT ${projection.join(", ")} FROM ${tableName};`);
	db.exec(`DROP TABLE ${tableName};`);
	db.exec(`ALTER TABLE ${migrationTable} RENAME TO ${tableName};`);
}
/** Fold obsolete physical projections into canonical JSON before removing their columns. */
function migrateJsonCanonicalWideRowsV13(db, previousVersion) {
	if (previousVersion >= 13) return false;
	let migrated = false;
	if (tableExists(db, "cron_jobs") && tableHasColumn(db, "cron_jobs", "schedule_kind")) {
		reprojectLegacyCronJson(db);
		rebuildJsonCanonicalTable(db, "cron_jobs");
		migrated = true;
	}
	const hasSetupState = tableExists(db, "workspace_setup_state");
	const hasAttestations = tableExists(db, "workspace_attestations");
	if (hasSetupState && !tableHasColumn(db, "workspace_setup_state", "attested_at_ms")) {
		db.exec("ALTER TABLE workspace_setup_state ADD COLUMN attested_at_ms INTEGER;");
		db.exec("ALTER TABLE workspace_setup_state ADD COLUMN attestation_updated_at_ms INTEGER;");
		rebuildJsonCanonicalTable(db, "workspace_setup_state");
		migrated = true;
	}
	if (hasAttestations) {
		db.exec(`
      UPDATE workspace_setup_state
         SET attested_at_ms = (
               SELECT attested_at_ms FROM workspace_attestations
                WHERE workspace_attestations.workspace_key = workspace_setup_state.workspace_key
             ),
             attestation_updated_at_ms = (
               SELECT updated_at_ms FROM workspace_attestations
                WHERE workspace_attestations.workspace_key = workspace_setup_state.workspace_key
             )
       WHERE workspace_key IN (SELECT workspace_key FROM workspace_attestations);
    `);
		const workspacePath = tableExists(db, "workspace_path_aliases") ? `(SELECT alias.workspace_path FROM workspace_path_aliases alias
           WHERE alias.workspace_key = a.workspace_key LIMIT 1)` : "NULL";
		db.exec(`
      INSERT INTO workspace_setup_state (
        workspace_key, workspace_path, attested_at_ms, attestation_updated_at_ms
      )
      SELECT a.workspace_key,
             ${workspacePath},
             a.attested_at_ms,
             a.updated_at_ms
        FROM workspace_attestations a
       WHERE a.workspace_key NOT IN (SELECT workspace_key FROM workspace_setup_state);
    `);
		db.exec("DROP TABLE workspace_attestations;");
		migrated = true;
	}
	if ((hasSetupState || hasAttestations) && tableExists(db, "workspace_generated_bootstrap_hashes")) {
		rebuildJsonCanonicalTable(db, "workspace_generated_bootstrap_hashes");
		db.exec(`
      DELETE FROM workspace_generated_bootstrap_hashes
       WHERE workspace_key NOT IN (SELECT workspace_key FROM workspace_setup_state);
    `);
	}
	for (const [tableName, jsonColumn, stateKey] of [[
		"auth_profile_stores",
		"store_json",
		"authProfiles.store"
	], [
		"auth_profile_state",
		"state_json",
		"authProfiles.state"
	]]) {
		if (!tableExists(db, tableName)) continue;
		db.prepare(`INSERT INTO config_machine_state (state_key, value_json, updated_at_ms)
       SELECT ?, ${jsonColumn}, updated_at FROM ${tableName} WHERE store_key = 'shared'
       ON CONFLICT(state_key) DO NOTHING`).run(stateKey);
		db.exec(`DROP TABLE ${tableName};`);
		migrated = true;
	}
	if (tableExists(db, "installed_plugin_index")) {
		const row = db.prepare("SELECT * FROM installed_plugin_index WHERE index_key = 'installed-plugin-index'").get();
		if (row) {
			const installRecords = asNullableRecord(safeParseJson(String(row.install_records_json)));
			const plugins = safeParseJson(String(row.plugins_json));
			const diagnostics = safeParseJson(String(row.diagnostics_json));
			if (!installRecords || !Array.isArray(plugins) || !Array.isArray(diagnostics)) {
				const scope = "plugins.installedIndex.quarantine";
				const message = `Preserved invalid legacy installed_plugin_index row in diagnostic_events (${scope}). Run openclaw doctor --fix or openclaw plugins registry --refresh to repair the plugin index; inspect the preserved row if install records need recovery.`;
				createSqliteAuditRecordKernel(db, {
					scope,
					maxEntries: Number.MAX_SAFE_INTEGER
				}).register(prepareSqliteAuditRecord(scope, {
					key: createHash("sha256").update(JSON.stringify(row)).digest("hex"),
					value: {
						level: "warn",
						message,
						raw: row
					},
					createdAt: Date.now()
				}));
				deferSqlitePostCommitPublication(db, () => createSubsystemLogger("state/db").warn(message));
			}
			const index = {
				version: Number(row.version),
				...typeof row.warning === "string" && row.warning ? { warning: row.warning } : {},
				hostContractVersion: row.host_contract_version,
				compatRegistryVersion: row.compat_registry_version,
				migrationVersion: Number(row.migration_version),
				policyHash: row.policy_hash,
				generatedAtMs: Number(row.generated_at_ms),
				...typeof row.workspace_dir === "string" ? { workspaceDir: row.workspace_dir } : {},
				...typeof row.refresh_reason === "string" && row.refresh_reason ? { refreshReason: row.refresh_reason } : {},
				installRecords,
				plugins,
				diagnostics
			};
			db.prepare(`INSERT INTO config_machine_state (state_key, value_json, updated_at_ms)
         VALUES (?, ?, ?) ON CONFLICT(state_key) DO NOTHING`).run("plugins.installedIndex", JSON.stringify({
				revision: Number(row.updated_at_ms),
				index
			}), Number(row.updated_at_ms));
		}
		db.exec("DROP TABLE installed_plugin_index;");
		migrated = true;
	}
	if (tableExists(db, "subagent_runs") && tableHasColumn(db, "subagent_runs", "task")) {
		repairLegacySubagentRetainedResults(db);
		rebuildJsonCanonicalTable(db, "subagent_runs");
		migrated = true;
	}
	return migrated;
}
//#endregion
//#region src/state/openclaw-state-db-schema-v21-columns.ts
/** Complete the derived projection before any writer or column-only reader runs. */
function migratePredicateColumnsV21(db, previousVersion) {
	if (previousVersion >= 21) return false;
	let changed = false;
	const text = (column, path) => `CASE WHEN json_valid(${column}) THEN CASE WHEN json_type(${column}, '${path}') = 'text' THEN json_extract(${column}, '${path}') END END`;
	if (tableExists(db, "meeting_transcript_sessions")) {
		const source = [
			"accountId",
			"guildId",
			"channelId",
			"meetingUrl",
			"threadTs",
			"fileId"
		];
		const columns = [
			"source_account_id",
			"source_guild_id",
			"source_channel_id",
			"source_meeting_url",
			"source_thread_ts",
			"source_file_id"
		];
		for (const column of [...columns, "metadata_agent_id"]) changed = ensureColumn(db, "meeting_transcript_sessions", `${column} TEXT`) || changed;
		db.exec(`UPDATE meeting_transcript_sessions SET
      ${columns.map((column, i) => `${column} = ${text("source_json", `$.${source[i]}`)}`).join(",")},
      metadata_agent_id = ${text("metadata_json", "$.agentId")}`);
	}
	if (tableExists(db, "meeting_transcript_summaries")) {
		changed = ensureColumn(db, "meeting_transcript_summaries", "overview TEXT") || changed;
		db.exec(`UPDATE meeting_transcript_summaries SET overview = ${text("summary_json", "$.overview")}`);
	}
	if (tableExists(db, "delivery_queue_entries")) {
		changed = ensureColumn(db, "delivery_queue_entries", "retention_id_prefix TEXT") || changed;
		changed = ensureColumn(db, "delivery_queue_entries", "retention_max_age_ms INTEGER") || changed;
		changed = ensureColumn(db, "delivery_queue_entries", "retention_max_entries INTEGER") || changed;
		db.exec(`UPDATE delivery_queue_entries SET
      (retention_id_prefix, retention_max_age_ms, retention_max_entries) = (
        SELECT id_prefix, max_age_ms, max_entries FROM (
          SELECT json_extract(entry_json, '$.completionRetention.idPrefix') id_prefix,
            json_extract(entry_json, '$.completionRetention.maxAgeMs') max_age_ms,
            json_extract(entry_json, '$.completionRetention.maxEntries') max_entries
          WHERE json_valid(entry_json)
            AND json_type(entry_json, '$.completionRetention') = 'object'
        ) WHERE typeof(id_prefix) = 'text' AND id_prefix <> ''
          AND substr(id, 1, length(id_prefix)) = id_prefix
          AND typeof(max_age_ms) = 'integer' AND max_age_ms BETWEEN 1 AND 9007199254740991
          AND typeof(max_entries) = 'integer' AND max_entries BETWEEN 1 AND 9007199254740991
      )`);
	}
	return changed;
}
//#endregion
//#region src/state/openclaw-state-db-schema-v22-columns.ts
const STATE_CURSOR_TABLES_V22 = [
	"operator_approvals",
	"cron_run_receipts",
	"execution_decision_facts",
	"skill_workshop_changes"
];
/** The schema owner holds the migration transaction with foreign keys disabled. */
function migratePortableIdentityColumnsV22(db, previousVersion) {
	if (previousVersion >= 22) return false;
	let changed = false;
	const schema = getAdmittedSqliteSchemaFacts(db) ?? captureSqliteSchemaFacts(db);
	for (const table of STATE_CURSOR_TABLES_V22) {
		if (!tableExists(db, table) || tableHasColumn(db, table, "cursor_id")) continue;
		const create = schema.tableSql.get(table);
		if (typeof create !== "string") throw new Error(`Missing v22 cursor migration schema: ${table}`);
		const temporary = quoteSqliteIdentifier(`${table}_migration_v22`);
		const name = quoteSqliteIdentifier(table);
		const columns = [...readTableColumns(db, table)].map(quoteSqliteIdentifier).join(", ");
		db.exec(`CREATE TABLE ${temporary} (cursor_id INTEGER NOT NULL, ${create.slice(create.indexOf("(") + 1)};
      INSERT INTO ${temporary} (rowid, ${columns}, cursor_id) SELECT rowid, ${columns}, rowid FROM ${name} ORDER BY rowid;
      DROP TABLE ${name};
      ALTER TABLE ${temporary} RENAME TO ${name};`);
		for (const object of [...schema.indexDefinitions.values(), ...schema.triggers.values()]) if (object.table === table && typeof object.sql === "string") db.exec(object.sql);
		changed = true;
	}
	if (tableExists(db, "acp_sessions")) {
		changed = ensureColumn(db, "acp_sessions", "resume_agent_session_id TEXT") || changed;
		changed = ensureColumn(db, "acp_sessions", "resume_acpx_session_id TEXT") || changed;
		const identity = "CASE WHEN json_valid(identity_json) THEN identity_json END";
		const whitespace = "char(9,10,11,12,13,32,160,5760,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8232,8233,8239,8287,12288,65279)";
		db.exec(`UPDATE acp_sessions SET
      resume_agent_session_id = CASE WHEN json_type(${identity}, '$.agentSessionId') = 'text'
        THEN trim(json_extract(${identity}, '$.agentSessionId'), ${whitespace}) END,
      resume_acpx_session_id = CASE WHEN json_type(${identity}, '$.acpxSessionId') = 'text'
        THEN trim(json_extract(${identity}, '$.acpxSessionId'), ${whitespace}) END;
      DROP INDEX IF EXISTS idx_acp_sessions_resume_agent;
      DROP INDEX IF EXISTS idx_acp_sessions_resume_acpx;`);
	}
	return changed;
}
//#endregion
//#region src/state/openclaw-state-schema-compatibility.ts
const CLAW_LAZY_ADDITIVE_STATE_COLUMNS = CLAW_LAZY_ADDITIVE_STATE_COLUMN_DEFINITIONS.map(({ columnName, tableName }) => `${tableName}.${columnName}`);
const CLAW_FIRST_USE_ADDITIVE_STATE_COLUMNS = CLAW_FIRST_USE_ADDITIVE_STATE_COLUMN_DEFINITIONS.map(({ columnName, tableName }) => `${tableName}.${columnName}`);
const CLAW_FIRST_USE_ADDITIVE_STATE_COLUMN_SET = new Set(CLAW_FIRST_USE_ADDITIVE_STATE_COLUMNS);
const CLAW_STARTUP_ADDITIVE_STATE_COLUMN_SET = /* @__PURE__ */ new Set([...CLAW_STARTUP_ADDITIVE_STATE_COLUMN_DEFINITIONS.map(({ columnName, tableName }) => `${tableName}.${columnName}`), ...Object.values(ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS).flat().map(([tableName, definition]) => `${tableName}.${definition.split(" ", 1)[0]}`)]);
const CLAW_STARTUP_ADDITIVE_STATE_TABLES = ["worker_session_tool_operations", "worker_turn_tool_authorities"];
const CLAW_STARTUP_ADDITIVE_STATE_TABLE_SET = new Set(CLAW_STARTUP_ADDITIVE_STATE_TABLES);
const CLAW_READONLY_OPTIONAL_STATE_INDEXES = [
	"idx_meeting_transcript_utterances_id",
	"idx_operator_approvals_source_run_resolved",
	"idx_task_runs_requester_session_key",
	"idx_worker_session_placements_environment"
];
let openClawStateCanonicalNamedIndexSet;
function getOpenClawStateCanonicalNamedIndexSet() {
	openClawStateCanonicalNamedIndexSet ??= new Set(getCanonicalSqliteNamedIndexContracts(OPENCLAW_STATE_SCHEMA_SQL).map((index) => index.name));
	return openClawStateCanonicalNamedIndexSet;
}
const runtimeSchemaCache = /* @__PURE__ */ new Map();
/** Project canonical SQL to the tables the shared runtime may create during this open. */
function getOpenClawStateRuntimeSchema(options) {
	const { includeVersionLazyAdditiveTables, includeAgentDeletionJournal = true } = options;
	const key = `${includeVersionLazyAdditiveTables}:${includeAgentDeletionJournal}`;
	const cached = runtimeSchemaCache.get(key);
	if (cached !== void 0) return cached;
	let schema = OPENCLAW_STATE_SCHEMA_SQL;
	const omittedTables = [...includeVersionLazyAdditiveTables ? FIRST_USE_STATE_TABLES : LAZY_ADDITIVE_STATE_TABLES, ...includeAgentDeletionJournal ? [] : DOCTOR_OWNED_STATE_TABLES];
	const omittedIndexes = includeVersionLazyAdditiveTables ? FIRST_USE_STATE_INDEXES : LAZY_ADDITIVE_STATE_INDEXES;
	for (const tableName of omittedTables) schema = schema.replace(extractSqliteTableSchema(schema, tableName, { errorMessage: `lazy additive state schema block is missing for ${tableName}` }), "");
	for (const indexName of omittedIndexes) {
		const plainStart = schema.indexOf(`CREATE INDEX IF NOT EXISTS ${indexName}`);
		const uniqueStart = schema.indexOf(`CREATE UNIQUE INDEX IF NOT EXISTS ${indexName}`);
		const start = plainStart >= 0 ? plainStart : uniqueStart;
		const end = start >= 0 ? schema.indexOf(";", start) : -1;
		if (start < 0 || end < 0) throw new Error(`lazy additive state schema index is missing for ${indexName}`);
		schema = `${schema.slice(0, start)}${schema.slice(end + 1)}`;
	}
	runtimeSchemaCache.set(key, schema);
	return schema;
}
const STATE_PERSISTENT_SCHEMA_COMPATIBILITY = {
	allowCompatibleAdditiveColumns: true,
	allowedMissingTables: DOCTOR_OWNED_STATE_TABLES,
	allowedMissingColumns: CLAW_FIRST_USE_ADDITIVE_STATE_COLUMNS,
	allowedColumnDefinitions: {
		"diagnostic_events.sequence": ["sequence INTEGER NOT NULL DEFAULT 0"],
		"claw_package_refs.package_integrity": ["package_integrity TEXT NOT NULL DEFAULT 'sha256:0000000000000000000000000000000000000000000000000000000000000000'"],
		"claw_package_refs.updated_at_ms": ["updated_at_ms INTEGER NOT NULL DEFAULT 0"],
		"cron_jobs.enabled": ["enabled INTEGER NOT NULL DEFAULT 1"],
		"cron_jobs.name": ["name TEXT NOT NULL DEFAULT ''"],
		"cron_jobs.payload_kind": ["payload_kind TEXT NOT NULL DEFAULT 'message'"],
		"current_conversation_bindings.conversation_kind": ["conversation_kind TEXT NOT NULL DEFAULT 'channel'"],
		"operator_approvals.resolution_ref": ["resolution_ref TEXT"],
		"worker_environments.desktop_json": ["desktop_json TEXT"],
		"worker_environments.bootstrap_install_kind": ["bootstrap_install_kind TEXT"],
		"worker_environments.shared_host": ["shared_host INTEGER CHECK (shared_host IN (0, 1))"],
		"worker_environments.node_setup_id": ["node_setup_id TEXT"],
		"worker_environments.node_device_id": ["node_device_id TEXT"],
		"worker_session_placements.terminal_reason": ["terminal_reason TEXT"],
		"worker_session_placements.terminal_at_ms": ["terminal_at_ms INTEGER"]
	}
};
const STATE_RUNTIME_SCHEMA_COMPATIBILITY = {
	...STATE_PERSISTENT_SCHEMA_COMPATIBILITY,
	excludedTables: LAZY_ADDITIVE_STATE_TABLES,
	excludedIndexes: LAZY_ADDITIVE_STATE_INDEXES
};
const OPENCLAW_STATE_MAINTENANCE_SCHEMA_COMPATIBILITY = {
	...STATE_PERSISTENT_SCHEMA_COMPATIBILITY,
	allowedMissingTables: [
		...LAZY_ADDITIVE_STATE_TABLES,
		...CLAW_STARTUP_ADDITIVE_STATE_TABLES,
		...DOCTOR_OWNED_STATE_TABLES
	],
	allowedMissingIndexes: CLAW_READONLY_OPTIONAL_STATE_INDEXES,
	allowedMissingColumns: CLAW_LAZY_ADDITIVE_STATE_COLUMNS
};
/** Identify schema differences that the writable shared-state cold open repairs. */
function isOpenClawStateStartupRepairableSchemaIssue(issue) {
	if (issue.code === "missing-table") return CLAW_STARTUP_ADDITIVE_STATE_TABLE_SET.has(issue.objectName);
	if (issue.code === "missing-column") return CLAW_STARTUP_ADDITIVE_STATE_COLUMN_SET.has(issue.objectName);
	return issue.code === "missing-or-drifted-index" && getOpenClawStateCanonicalNamedIndexSet().has(issue.objectName);
}
/** Identify compatible schema differences repaired only by their feature owner. */
function isOpenClawStateFirstUseSchemaIssue(issue) {
	return issue.code === "missing-column" && CLAW_FIRST_USE_ADDITIVE_STATE_COLUMN_SET.has(issue.objectName);
}
//#endregion
//#region src/state/openclaw-state-db-maintenance.ts
/**
* Make the known malformed index parseable, then let SQLite drop and reclaim it
* in the caller's transaction. A failed repair rolls both catalog edits back.
*/
function repairDanglingSkillWorkshopCollectionReviewIndex(database) {
	if (!hasDanglingSkillWorkshopCollectionReviewIndex(database)) return false;
	return withSqliteWritableSchema(database, () => {
		database.prepare("UPDATE sqlite_schema SET sql = ? WHERE type = 'index' AND name = ?").run(`CREATE INDEX ${LEGACY_SKILL_WORKSHOP_COLLECTION_REVIEWS_INDEX} ON skill_workshop_collection_reviews(create_time DESC, review_id DESC)`, LEGACY_SKILL_WORKSHOP_COLLECTION_REVIEWS_INDEX);
		const row = database.prepare("PRAGMA schema_version").get();
		const schemaVersion = typeof row.schema_version === "number" ? row.schema_version : 0;
		database.exec(`PRAGMA schema_version = ${schemaVersion + 1}; PRAGMA writable_schema = OFF;`);
		database.exec(`DROP INDEX ${LEGACY_SKILL_WORKSHOP_COLLECTION_REVIEWS_INDEX};`);
		return true;
	});
}
/** Admit Doctor repair, then return the ownership-rechecked catalog repair operation. */
function prepareStateDatabaseSchemaRepair(database, pathname, env) {
	const danglingWorkshopIndex = hasDanglingSkillWorkshopCollectionReviewIndex(database);
	const assertWriteAllowed = () => assertOpenClawStateWriteAllowed({
		database,
		databasePath: pathname,
		env,
		inspectOwnership: true
	});
	const admit = () => {
		assertSupportedStateSchemaVersion(database, pathname);
		if (danglingWorkshopIndex) assertWriteAllowed();
	};
	if (danglingWorkshopIndex) withSqliteWritableSchema(database, admit);
	else admit();
	return () => {
		if (danglingWorkshopIndex) withSqliteWritableSchema(database, assertWriteAllowed);
		else assertWriteAllowed();
		return repairDanglingSkillWorkshopCollectionReviewIndex(database) ? ["Removed dangling legacy Skill Workshop review index"] : [];
	};
}
const STATE_V6_ADDITIVE_TABLES = [
	"gateway_origin_device_tokens",
	...LAZY_ADDITIVE_STATE_TABLES,
	"worker_session_tool_operations",
	"worker_turn_tool_authorities"
];
const STATE_V5_ADDITIVE_TABLES = [
	"agent_database_leases",
	"agent_deletion_journal",
	"claw_cron_refs",
	"claw_installs",
	"claw_mcp_server_refs",
	"claw_package_refs",
	"claw_workspace_files",
	"config_machine_state",
	"cron_job_scratch",
	"meeting_transcript_sessions",
	"meeting_transcript_summaries",
	"meeting_transcript_utterances",
	"outbound_media_provenance",
	"worker_environment_credentials",
	"worker_transcript_commit_heads",
	"worker_transcript_commits",
	...STATE_V6_ADDITIVE_TABLES
];
const STATE_MIGRATION_VERSIONS = [
	5,
	6,
	7,
	8,
	9,
	10,
	11,
	12,
	13,
	14,
	15,
	16,
	17,
	18,
	19,
	20,
	21
];
/** Require canonical shared-state ownership without requiring the latest schema. */
function assertOpenClawStateDatabaseOwner(database, options) {
	const admitted = getStateSchemaVersionAdmission(database);
	if (admitted && getStateRuntimeSchemaAdmission(database)) return { schema_version: admitted.userVersion };
	const hasMetadataTable = tableExists(database, "schema_meta");
	let metadata;
	try {
		metadata = hasMetadataTable ? database.prepare("SELECT role, schema_version FROM schema_meta WHERE meta_key = 'primary' LIMIT 1").get() : void 0;
	} catch (error) {
		throw classifySqliteTableReadError(database, "schema_meta", [
			"meta_key",
			"role",
			"schema_version"
		], error);
	}
	if (metadata?.role !== "global") {
		const role = typeof metadata?.role === "string" ? metadata.role : "missing";
		throw new SqliteSchemaMismatchError(`OpenClaw state database ${options.pathname} has schema role ${role}; expected global. Run openclaw doctor --fix to inspect and repair its ownership.`);
	}
	return metadata;
}
/** Require the canonical shared-state owner and schema before offline file maintenance. */
function assertOpenClawStateDatabaseForMaintenance(database, options, readTable) {
	if (isPostgresSqlConnection(database)) requireNativeDatabaseFile("postgres", "repair");
	const userVersion = assertSupportedStateSchemaVersion(database, options.pathname, options.schemaVersions);
	if ((options.schemaVersions?.contentVersion ?? readStateSchemaContentVersion(database)) !== 22) throw new SqliteSchemaMismatchError(`OpenClaw state database ${options.pathname} uses schema version ${userVersion}; run openclaw doctor --fix before compacting it.`);
	const metadata = assertOpenClawStateDatabaseOwner(database, options);
	if (metadata?.schema_version !== userVersion) {
		const schemaVersion = typeof metadata?.schema_version === "number" ? metadata.schema_version : "invalid";
		throw new SqliteSchemaMismatchError(`OpenClaw state database ${options.pathname} metadata schema version ${schemaVersion} does not match ${userVersion}; run openclaw doctor --fix before compacting it.`);
	}
	assertSqliteSchemaContains(database, options.pathname, OPENCLAW_STATE_SCHEMA_SQL, OPENCLAW_STATE_MAINTENANCE_SCHEMA_COMPATIBILITY, readTable);
}
function assertOpenClawStateDatabaseVersionForMigration(database, options) {
	const userVersion = readSqliteUserVersion(database);
	if (readStateSchemaContentVersion(database) !== options.version) throw new SqliteSchemaMismatchError(`OpenClaw state database ${options.pathname} uses schema version ${userVersion}; expected ${options.version} before migrating it.`);
	const metadata = assertOpenClawStateDatabaseOwner(database, options);
	if (metadata?.schema_version !== userVersion) {
		const schemaVersion = typeof metadata?.schema_version === "number" ? metadata.schema_version : "invalid";
		throw new SqliteSchemaMismatchError(`OpenClaw state database ${options.pathname} metadata schema version ${schemaVersion} does not match ${userVersion}; repair the ownership metadata before migrating it.`);
	}
	assertSqliteSchemaTablesPresent(database, options.pathname, OPENCLAW_STATE_SCHEMA_SQL, { allowedMissingTables: [...options.version === 5 ? STATE_V5_ADDITIVE_TABLES : options.version < 13 ? STATE_V6_ADDITIVE_TABLES : LAZY_ADDITIVE_STATE_TABLES, ...DOCTOR_OWNED_STATE_TABLES] });
}
/** Keep historical migration gates beside their version-specific ownership assertions. */
const openClawStateMigrationAssertions = new Map(STATE_MIGRATION_VERSIONS.map((version) => [version, (database, options) => assertOpenClawStateDatabaseVersionForMigration(database, {
	...options,
	version
})]));
function markCurrentStateSchemaVersion(db, options = {}) {
	if (!tableExists(db, "audit_events")) return;
	const version = resolveStateSchemaVersionToPublish(db);
	db.exec(`PRAGMA user_version = ${version};`);
	publishStateSchemaVersionAdmission(db, {
		userVersion: version,
		contentVersion: 22
	});
	if (tableExists(db, "schema_meta") && [
		"meta_key",
		"schema_version",
		"updated_at"
	].every((column) => tableHasColumn(db, "schema_meta", column))) {
		const now = Date.now();
		if (options.createMetadataIfMissing) {
			db.prepare(`INSERT INTO schema_meta (
           meta_key, role, schema_version, agent_id, app_version, created_at, updated_at
         ) VALUES ('primary', 'global', ?, NULL, NULL, ?, ?)
         ON CONFLICT(meta_key) DO UPDATE SET
           schema_version = excluded.schema_version,
           updated_at = excluded.updated_at`).run(version, now, now);
			return;
		}
		db.prepare("UPDATE schema_meta SET schema_version = ?, updated_at = ? WHERE meta_key = 'primary'").run(version, now);
	}
}
/** Historical jobs lost the creator's origin; preserve attribution without guessing authority. */
function migrateCronCreatorNamespaces(db, previousVersion) {
	if (previousVersion >= 14 || !tableExists(db, "cron_jobs")) return false;
	db.exec(`
    UPDATE cron_jobs
       SET job_json = json_set(job_json, '$.createdActor.source', 'unknown')
     WHERE json_valid(job_json)
       AND json_extract(job_json, '$.createdActor.type') = 'human';
  `);
	return true;
}
/** Keep opaque plugin targets independent of agent identity without rewriting binding records. */
function migrateConversationBindingTargets(db, previousVersion) {
	if (previousVersion >= 15) return false;
	const columns = ["target_agent_id", "target_session_id"].filter((column) => tableHasColumn(db, "current_conversation_bindings", column));
	if (columns.length === 0) return false;
	db.exec("DROP INDEX IF EXISTS idx_current_conversation_bindings_target;");
	for (const column of columns) db.exec(`ALTER TABLE current_conversation_bindings DROP COLUMN ${column};`);
	return true;
}
/** Add preparation and activation facts without rebuilding the referenced environment table. */
function migratePreparedWorkerOwnership(db, previousVersion) {
	if (previousVersion >= 17 || !tableExists(db, "worker_environments")) return false;
	const start = OPENCLAW_STATE_SCHEMA_SQL.indexOf("CREATE TABLE IF NOT EXISTS worker_environments (");
	const end = OPENCLAW_STATE_SCHEMA_SQL.indexOf("\n) STRICT;", start);
	if (start < 0 || end < start) throw new Error("OpenClaw worker environment schema marker is missing.");
	const columns = splitSqlList(OPENCLAW_STATE_SCHEMA_SQL.slice(start + 48, end)).map((column) => column.trim()).filter((column) => column.startsWith("last_activated_at_ms ") || column.startsWith("preparation_"));
	let changed = false;
	for (const column of columns) changed = ensureColumn(db, "worker_environments", column) || changed;
	return changed;
}
/** Historical publication rows retain unknown requesters; first use still owns absent tables. */
function migrateGitHubPublicationRequesterAuthority(db, previousVersion) {
	if (previousVersion >= 18) return false;
	let changed = false;
	for (const table of ["github_publication_session_lifecycles", "github_repository_publication_requests"]) if (tableExists(db, table)) changed = ensureColumn(db, table, "requester_authority_json TEXT") || changed;
	return changed;
}
const statePredicateColumnMigration = {
	version: 21,
	tables: [
		"meeting_transcript_sessions",
		"meeting_transcript_summaries",
		"delivery_queue_entries"
	],
	columns: [
		...[
			"source_account_id",
			"source_guild_id",
			"source_channel_id",
			"source_meeting_url",
			"source_thread_ts",
			"source_file_id",
			"metadata_agent_id"
		].map((column) => `meeting_transcript_sessions.${column}`),
		"meeting_transcript_summaries.overview",
		"delivery_queue_entries.retention_id_prefix",
		"delivery_queue_entries.retention_max_age_ms",
		"delivery_queue_entries.retention_max_entries"
	],
	migrate: migratePredicateColumnsV21,
	applied: "Derived meeting transcript selectors and bounded delivery retention columns (v21)"
};
const statePortableIdentityMigration = {
	version: 22,
	tables: ["acp_sessions", ...STATE_CURSOR_TABLES_V22],
	columns: [
		"acp_sessions.resume_agent_session_id",
		"acp_sessions.resume_acpx_session_id",
		...STATE_CURSOR_TABLES_V22.map((table) => `${table}.cursor_id`)
	],
	migrate: migratePortableIdentityColumnsV22,
	applied: "Promoted portable ACP resume keys and cursor identities (v22)"
};
/** Version-gated column and row migrations, oldest first; each runs inside the caller's schema transaction. */
const versionedStateMigrations = [
	statePortableIdentityMigration,
	{
		migrate: migrateJsonCanonicalWideRowsV13,
		applied: "Consolidated shared state tables (v13)"
	},
	{
		migrate: migrateCronCreatorNamespaces,
		applied: "Qualified historical cron creator attribution as unknown (v14)"
	},
	{
		migrate: migrateConversationBindingTargets,
		applied: "Removed redundant conversation binding target projections (v15)"
	},
	{
		migrate: migratePreparedWorkerOwnership,
		applied: "Recorded prepared worker ownership and one-use lifecycle (v17)"
	},
	{
		migrate: migrateGitHubPublicationRequesterAuthority,
		applied: "Added original requester authority to GitHub publication receipts (v18)"
	},
	{
		migrate: migrateCronDeliveryAttemptState,
		applied: "Recorded cron completion delivery attempt uncertainty (v20)"
	}
];
/** Recent version migrations own only their tables; Doctor owns unrelated historical repair. */
function migrateBoundedStateSchema(db, previousVersion, options = {}) {
	const pending = [statePredicateColumnMigration, statePortableIdentityMigration].filter(({ version }) => version > previousVersion);
	if (previousVersion >= 22 || pending.length !== 22 - previousVersion) return;
	const tables = new Set(pending.flatMap((migration) => migration.tables));
	const indexes = getCanonicalSqliteNamedIndexContracts(OPENCLAW_STATE_SCHEMA_SQL).filter((index) => tables.has(index.tableName));
	if (!options.versionMigrationOnly && (tableExists(db, "cron_run_logs") || collectSqliteSchemaIssues(db, "\n\nCREATE TABLE IF NOT EXISTS mcp_oauth_stores (\n  store_key TEXT NOT NULL PRIMARY KEY,\n  format_version INTEGER NOT NULL CHECK (format_version = 1),\n  store_json TEXT NOT NULL,\n  updated_at INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS mcp_oauth_pending_authorizations (\n  state TEXT NOT NULL PRIMARY KEY,\n  store_key TEXT NOT NULL,\n  create_time INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS diagnostic_events (\n  scope TEXT NOT NULL,\n  event_key TEXT NOT NULL,\n  payload_json TEXT NOT NULL,\n  created_at INTEGER NOT NULL,\n  sequence INTEGER NOT NULL DEFAULT 0,\n  PRIMARY KEY (scope, event_key)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_diagnostic_events_scope_sequence\n  ON diagnostic_events(scope, sequence, event_key);\n\nCREATE TABLE IF NOT EXISTS skill_usage (\n  skill_file TEXT NOT NULL PRIMARY KEY,\n  skill_key TEXT NOT NULL,\n  skill_name TEXT NOT NULL,\n  skill_source TEXT NOT NULL,\n  first_used_at_ms INTEGER NOT NULL,\n  last_used_at_ms INTEGER NOT NULL,\n  use_count INTEGER NOT NULL,\n  last_agent_id TEXT\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_skill_usage_key\n  ON skill_usage(skill_key, skill_file);\n\n-- Profile-owned skill library: additive, absent until first publication/import.\nCREATE TABLE IF NOT EXISTS skill_library_entries (\n  skill_id TEXT NOT NULL PRIMARY KEY,\n  owner_profile_id TEXT,\n  author_profile_id TEXT NOT NULL,\n  slug TEXT NOT NULL,\n  current_revision TEXT NOT NULL,\n  shared INT NOT NULL,\n  enabled INT NOT NULL,\n  removed INT NOT NULL,\n  created_at INT NOT NULL,\n  updated_at INT NOT NULL\n) STRICT;\nCREATE TABLE IF NOT EXISTS skill_library_revisions (\n  skill_id TEXT NOT NULL,\n  revision TEXT NOT NULL,\n  description TEXT NOT NULL,\n  files_json TEXT NOT NULL,\n  created_at INT NOT NULL,\n  PRIMARY KEY (skill_id, revision)\n) STRICT;\nCREATE TABLE IF NOT EXISTS skill_library_events (\n  event_id TEXT NOT NULL PRIMARY KEY,\n  skill_id TEXT NOT NULL,\n  revision TEXT NOT NULL,\n  action TEXT NOT NULL,\n  actor_profile_id TEXT NOT NULL,\n  created_at INT NOT NULL\n) STRICT;\nCREATE TABLE IF NOT EXISTS skill_library_uploads (\n  upload_id TEXT NOT NULL PRIMARY KEY,\n  owner_profile_id TEXT NOT NULL,\n  slug TEXT NOT NULL,\n  size_bytes INT NOT NULL,\n  sha256 TEXT NOT NULL,\n  archive_blob BLOB NOT NULL,\n  expires_at INT NOT NULL,\n  published_skill_id TEXT\n) STRICT;\n-- End profile-owned skill library.\n\nCREATE TABLE IF NOT EXISTS skill_workshop_changes (\n  cursor_id INTEGER NOT NULL,\n  change_id TEXT NOT NULL PRIMARY KEY,\n  agent_id TEXT NOT NULL,\n  skill_name TEXT NOT NULL,\n  action TEXT NOT NULL CHECK (action IN ('create', 'patch', 'write_file', 'remove_file', 'archive', 'restore')),\n  actor TEXT NOT NULL CHECK (actor IN ('agent', 'review', 'curator', 'user')),\n  summary TEXT NOT NULL,\n  version_id TEXT,\n  session_key TEXT,\n  run_id TEXT,\n  created_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE UNIQUE INDEX IF NOT EXISTS skill_workshop_changes_cursor_id_idx\n  ON skill_workshop_changes(cursor_id);\n\nCREATE INDEX IF NOT EXISTS idx_skill_workshop_changes_agent_time\n  ON skill_workshop_changes(agent_id, created_at_ms);\n\nCREATE TABLE IF NOT EXISTS audit_events (\n  sequence INTEGER PRIMARY KEY AUTOINCREMENT,\n  event_id TEXT NOT NULL UNIQUE,\n  source_id TEXT NOT NULL UNIQUE,\n  schema_version INTEGER NOT NULL DEFAULT 1,\n  source_sequence INTEGER NOT NULL,\n  occurred_at INTEGER NOT NULL,\n  kind TEXT NOT NULL,\n  action TEXT NOT NULL,\n  status TEXT NOT NULL,\n  error_code TEXT,\n  actor_type TEXT NOT NULL,\n  actor_id TEXT NOT NULL,\n  agent_id TEXT,\n  session_key TEXT,\n  session_id TEXT,\n  run_id TEXT,\n  tool_call_id TEXT,\n  tool_name TEXT,\n  direction TEXT,\n  channel TEXT,\n  conversation_kind TEXT,\n  message_outcome TEXT,\n  reason_code TEXT,\n  delivery_kind TEXT,\n  failure_stage TEXT,\n  duration_ms INTEGER,\n  result_count INTEGER,\n  account_ref TEXT,\n  conversation_ref TEXT,\n  message_ref TEXT,\n  target_ref TEXT\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_audit_events_time\n  ON audit_events(occurred_at DESC, sequence DESC);\n\nCREATE INDEX IF NOT EXISTS idx_audit_events_agent_sequence\n  ON audit_events(agent_id, sequence DESC);\n\nCREATE INDEX IF NOT EXISTS idx_audit_events_session_sequence\n  ON audit_events(session_key, sequence DESC);\n\nCREATE INDEX IF NOT EXISTS idx_audit_events_run_sequence\n  ON audit_events(run_id, sequence DESC);\n\nCREATE INDEX IF NOT EXISTS idx_audit_events_kind_sequence\n  ON audit_events(kind, sequence DESC);\n\nCREATE INDEX IF NOT EXISTS idx_audit_events_status_sequence\n  ON audit_events(status, sequence DESC);\n\nCREATE INDEX IF NOT EXISTS idx_audit_events_channel_sequence\n  ON audit_events(channel, sequence DESC);\n\nCREATE INDEX IF NOT EXISTS idx_audit_events_direction_sequence\n  ON audit_events(direction, sequence DESC);\n\nCREATE TABLE IF NOT EXISTS outbound_message_execution_bindings (\n  event_id TEXT NOT NULL PRIMARY KEY,\n  context_id TEXT NOT NULL CHECK (length(context_id) BETWEEN 1 AND 256),\n  execution_id TEXT NOT NULL CHECK (length(execution_id) BETWEEN 1 AND 256),\n  run_id TEXT NOT NULL CHECK (length(run_id) BETWEEN 1 AND 256),\n  FOREIGN KEY (event_id) REFERENCES audit_events(event_id) ON DELETE CASCADE\n) STRICT;\nCREATE INDEX IF NOT EXISTS outbound_message_execution_bindings_execution_event_idx\n  ON outbound_message_execution_bindings (context_id, execution_id, run_id, event_id);\n\nCREATE TABLE IF NOT EXISTS outbound_message_progress (\n  sequence INTEGER PRIMARY KEY AUTOINCREMENT,\n  progress_id TEXT NOT NULL UNIQUE CHECK (length(progress_id) BETWEEN 1 AND 256),\n  source_id TEXT NOT NULL UNIQUE CHECK (length(source_id) BETWEEN 1 AND 512),\n  source_sequence INTEGER NOT NULL CHECK (source_sequence >= 1),\n  schema_version INTEGER NOT NULL CHECK (schema_version = 1),\n  occurred_at INTEGER NOT NULL CHECK (occurred_at >= 0),\n  action TEXT NOT NULL CHECK (\n    action IN ('message.outbound.queued', 'message.outbound.platform-started')\n  ),\n  outcome TEXT NOT NULL CHECK (outcome IN ('queued', 'platform_started')),\n  actor_type TEXT NOT NULL CHECK (actor_type IN ('agent', 'system')),\n  actor_id TEXT NOT NULL CHECK (length(actor_id) BETWEEN 1 AND 256),\n  agent_id TEXT CHECK (agent_id IS NULL OR length(agent_id) BETWEEN 1 AND 256),\n  run_id TEXT CHECK (run_id IS NULL OR length(run_id) BETWEEN 1 AND 256),\n  context_id TEXT,\n  execution_id TEXT,\n  channel TEXT NOT NULL CHECK (length(channel) BETWEEN 1 AND 256),\n  conversation_kind TEXT NOT NULL CHECK (\n    conversation_kind IN ('direct', 'group', 'channel', 'unknown')\n  ),\n  duration_ms INTEGER CHECK (duration_ms IS NULL OR duration_ms >= 0),\n  account_ref TEXT,\n  conversation_ref TEXT,\n  target_ref TEXT,\n  UNIQUE (occurred_at, progress_id)\n) STRICT;\nCREATE INDEX IF NOT EXISTS outbound_message_progress_occurred_idx\n  ON outbound_message_progress (occurred_at, sequence);\nCREATE INDEX IF NOT EXISTS outbound_message_progress_run_occurred_idx\n  ON outbound_message_progress (run_id, occurred_at, sequence);\n\nCREATE TABLE IF NOT EXISTS audit_identity_keys (\n  id INTEGER NOT NULL PRIMARY KEY CHECK (id = 1),\n  key_id TEXT NOT NULL,\n  key BLOB NOT NULL,\n  created_at INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS config_revision_keys (\n  id INTEGER NOT NULL PRIMARY KEY CHECK (id = 1),\n  hmac_key BLOB NOT NULL CHECK (length(hmac_key) = 32)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS execution_identity_contexts (\n  context_id TEXT NOT NULL PRIMARY KEY CHECK (length(context_id) BETWEEN 1 AND 256),\n  execution_id TEXT NOT NULL UNIQUE CHECK (length(execution_id) BETWEEN 1 AND 256),\n  run_id TEXT NOT NULL CHECK (length(run_id) BETWEEN 1 AND 256),\n  created_at INTEGER NOT NULL CHECK (created_at >= 0),\n  coverage_state TEXT NOT NULL CHECK (\n    coverage_state IN ('attribution-only', 'unattributed', 'unknown', 'unsupported')\n  ),\n  context_bytes INTEGER NOT NULL CHECK (context_bytes BETWEEN 1 AND 16384),\n  context_json TEXT NOT NULL CHECK (length(context_json) > 0),\n  UNIQUE (created_at, context_id)\n) STRICT;\nCREATE INDEX IF NOT EXISTS execution_identity_contexts_run_created_idx\n  ON execution_identity_contexts (run_id, created_at, execution_id);\n\nCREATE TABLE IF NOT EXISTS execution_decision_facts (\n  cursor_id INTEGER NOT NULL,\n  receipt_id TEXT NOT NULL PRIMARY KEY CHECK (length(receipt_id) BETWEEN 1 AND 256),\n  context_id TEXT NOT NULL CHECK (length(context_id) BETWEEN 1 AND 256),\n  execution_id TEXT NOT NULL CHECK (length(execution_id) BETWEEN 1 AND 256),\n  run_id TEXT NOT NULL CHECK (length(run_id) BETWEEN 1 AND 256),\n  action_id TEXT CHECK (action_id IS NULL OR length(action_id) BETWEEN 1 AND 256),\n  action_family TEXT NOT NULL CHECK (length(action_family) BETWEEN 1 AND 256),\n  decision_outcome TEXT NOT NULL CHECK (\n    decision_outcome IN ('allowed', 'denied', 'not-applicable', 'unknown')\n  ),\n  coverage_state TEXT NOT NULL CHECK (\n    coverage_state IN ('enforced', 'attribution-only', 'unattributed', 'unknown', 'unsupported')\n  ),\n  reason_code TEXT NOT NULL CHECK (length(reason_code) BETWEEN 1 AND 256),\n  owner TEXT NOT NULL CHECK (length(owner) BETWEEN 1 AND 256),\n  source_ref TEXT NOT NULL CHECK (length(source_ref) BETWEEN 1 AND 256),\n  occurred_at INTEGER NOT NULL CHECK (occurred_at >= 0),\n  receipt_bytes INTEGER NOT NULL CHECK (receipt_bytes BETWEEN 1 AND 16384),\n  receipt_json TEXT NOT NULL CHECK (length(receipt_json) > 0),\n  UNIQUE (occurred_at, receipt_id)\n) STRICT;\nCREATE UNIQUE INDEX IF NOT EXISTS execution_decision_facts_cursor_id_idx\n  ON execution_decision_facts(cursor_id);\n\nCREATE INDEX IF NOT EXISTS execution_decision_facts_context_occurred_idx\n  ON execution_decision_facts (context_id, occurred_at, receipt_id);\nCREATE INDEX IF NOT EXISTS execution_decision_facts_run_occurred_idx\n  ON execution_decision_facts (run_id, occurred_at, receipt_id);\n\n-- Exact admission identity stays separate from owner-native lifecycle rows so\n-- older readers retain byte-compatible cron/task/flow table definitions.\nCREATE TABLE IF NOT EXISTS execution_owner_lifecycle_bindings (\n  owner_kind TEXT NOT NULL,\n  owner_id TEXT NOT NULL,\n  context_id TEXT NOT NULL,\n  execution_id TEXT NOT NULL,\n  PRIMARY KEY (owner_kind, owner_id)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS session_state_events (\n  sequence INTEGER PRIMARY KEY AUTOINCREMENT,\n  dedupe_key TEXT UNIQUE,\n  session_key TEXT NOT NULL,\n  session_id TEXT,\n  agent_id TEXT NOT NULL,\n  kind TEXT NOT NULL,\n  actor_type TEXT NOT NULL,\n  actor_id TEXT,\n  run_id TEXT,\n  occurred_at INTEGER NOT NULL,\n  summary TEXT NOT NULL,\n  payload_json TEXT\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_session_state_events_session_sequence\n  ON session_state_events(session_key, sequence DESC);\n\nCREATE INDEX IF NOT EXISTS idx_session_state_events_time\n  ON session_state_events(occurred_at DESC, sequence DESC);\n\nCREATE TABLE IF NOT EXISTS session_state_heads (\n  session_key TEXT NOT NULL,\n  agent_id TEXT NOT NULL,\n  last_sequence INTEGER NOT NULL,\n  pruned_max_sequence INTEGER NOT NULL DEFAULT 0,\n  updated_at INTEGER NOT NULL,\n  PRIMARY KEY (session_key, agent_id)\n) STRICT;\n\n-- Notifiable watcher identity is the bare session key, matching the process-local\n-- system-event queue it feeds. Provenance distinguishes explicit immediate-wake\n-- watches from ambient queue-only group watches. Other bare keys\n-- (session.scope=\"global\") are ambiguous across agents and excluded until watcher\n-- identity is agent-scoped end-to-end.\nCREATE TABLE IF NOT EXISTS session_watch_cursors (\n  watcher_session_key TEXT NOT NULL,\n  watcher_store_path TEXT,\n  target_session_key TEXT NOT NULL,\n  last_seen_sequence INTEGER NOT NULL DEFAULT 0,\n  notified_sequence INTEGER NOT NULL DEFAULT 0,\n  material_sequence INTEGER NOT NULL DEFAULT 0,\n  provenance TEXT NOT NULL DEFAULT 'explicit' CHECK (provenance IN ('explicit', 'ambient-group')),\n  updated_at INTEGER NOT NULL,\n  PRIMARY KEY (watcher_session_key, target_session_key)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_session_watch_cursors_target\n  ON session_watch_cursors(target_session_key);\n\nCREATE TABLE IF NOT EXISTS session_upstream_links (\n  session_key TEXT NOT NULL,\n  agent_id TEXT NOT NULL,\n  catalog_id TEXT NOT NULL,\n  host_id TEXT NOT NULL,\n  thread_id TEXT NOT NULL,\n  upstream_kind TEXT NOT NULL,\n  upstream_ref_json TEXT,\n  last_marker_json TEXT,\n  last_scanned_at INTEGER,\n  created_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL,\n  -- (session_key, agent_id) composite identity: under session.scope=\"global\" agents\n  -- share bare keys; a key-only row would let one agent overwrite another's upstream.\n  PRIMARY KEY (session_key, agent_id)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_session_upstream_links_catalog_id\n  ON session_upstream_links(catalog_id);\n\nCREATE TABLE IF NOT EXISTS state_leases (\n  scope TEXT NOT NULL,\n  lease_key TEXT NOT NULL,\n  owner TEXT NOT NULL,\n  expires_at INTEGER,\n  heartbeat_at INTEGER,\n  payload_json TEXT,\n  created_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL,\n  PRIMARY KEY (scope, lease_key)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_state_leases_expiry\n  ON state_leases(expires_at, scope, lease_key)\n  WHERE expires_at IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_state_leases_owner\n  ON state_leases(owner, updated_at DESC);\n\nCREATE TABLE IF NOT EXISTS exec_approvals_config (\n  config_key TEXT NOT NULL PRIMARY KEY,\n  raw_json TEXT NOT NULL,\n  socket_path TEXT,\n  has_socket_token INTEGER NOT NULL,\n  default_security TEXT,\n  default_ask TEXT,\n  default_ask_fallback TEXT,\n  auto_allow_skills INTEGER,\n  agent_count INTEGER NOT NULL,\n  allowlist_count INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS operator_approvals (\n  cursor_id INTEGER NOT NULL,\n  approval_id TEXT NOT NULL PRIMARY KEY CHECK (\n    length(approval_id) > 0 AND approval_id NOT IN ('.', '..')\n  ),\n  resolution_ref TEXT NOT NULL CHECK (\n    length(resolution_ref) = 43 AND resolution_ref NOT GLOB '*[^A-Za-z0-9_-]*'\n  ),\n  kind TEXT NOT NULL CHECK (kind IN ('exec', 'plugin', 'system-agent')),\n  status TEXT NOT NULL CHECK (status IN ('pending', 'allowed', 'denied', 'expired', 'cancelled')),\n  presentation_json TEXT NOT NULL,\n  requested_by_device_id TEXT,\n  requested_by_client_id TEXT,\n  requested_by_device_token_auth INTEGER NOT NULL DEFAULT 0,\n  reviewer_device_ids_json TEXT NOT NULL,\n  source_agent_id TEXT,\n  source_session_key TEXT,\n  source_session_id TEXT,\n  source_run_id TEXT,\n  source_tool_call_id TEXT,\n  source_tool_name TEXT,\n  audience_session_keys_json TEXT NOT NULL,\n  runtime_epoch TEXT NOT NULL,\n  created_at_ms INTEGER NOT NULL,\n  expires_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  decision TEXT CHECK (decision IN ('allow-once', 'allow-always', 'deny')),\n  terminal_reason TEXT CHECK (\n    terminal_reason IN (\n      'user',\n      'timeout',\n      'malformed-verdict',\n      'no-route',\n      'run-aborted',\n      'gateway-restart',\n      'storage-corrupt'\n    )\n  ),\n  resolved_at_ms INTEGER,\n  resolver_kind TEXT CHECK (resolver_kind IN ('device', 'channel', 'runtime', 'system')),\n  resolver_id TEXT,\n  consumed_at_ms INTEGER,\n  consumed_by TEXT,\n  CHECK (expires_at_ms >= created_at_ms),\n  CHECK (updated_at_ms >= created_at_ms),\n  CHECK (resolved_at_ms IS NULL OR resolved_at_ms >= created_at_ms),\n  CHECK (resolved_at_ms IS NULL OR resolved_at_ms <= updated_at_ms),\n  CHECK (consumed_at_ms IS NULL OR consumed_at_ms >= resolved_at_ms),\n  CHECK (consumed_at_ms IS NULL OR consumed_at_ms <= updated_at_ms),\n  CHECK (requested_by_device_token_auth IN (0, 1)),\n  CHECK (\n    (\n      status = 'pending'\n      AND decision IS NULL\n      AND terminal_reason IS NULL\n      AND resolved_at_ms IS NULL\n      AND resolver_kind IS NULL\n      AND resolver_id IS NULL\n      AND consumed_at_ms IS NULL\n      AND consumed_by IS NULL\n    )\n    OR (\n      status = 'allowed'\n      AND decision IN ('allow-once', 'allow-always')\n      AND terminal_reason = 'user'\n      AND resolved_at_ms IS NOT NULL\n      AND resolver_kind IS NOT NULL\n    )\n    OR (\n      status = 'denied'\n      AND decision = 'deny'\n      AND terminal_reason IN ('user', 'malformed-verdict', 'no-route', 'storage-corrupt')\n      AND resolved_at_ms IS NOT NULL\n      AND resolver_kind IS NOT NULL\n      AND consumed_at_ms IS NULL\n      AND consumed_by IS NULL\n    )\n    OR (\n      status = 'expired'\n      AND decision = 'deny'\n      AND terminal_reason = 'timeout'\n      AND resolved_at_ms IS NOT NULL\n      AND resolver_kind IS NOT NULL\n      AND consumed_at_ms IS NULL\n      AND consumed_by IS NULL\n    )\n    OR (\n      status = 'cancelled'\n      AND decision = 'deny'\n      AND terminal_reason IN ('run-aborted', 'gateway-restart')\n      AND resolved_at_ms IS NOT NULL\n      AND resolver_kind IS NOT NULL\n      AND consumed_at_ms IS NULL\n      AND consumed_by IS NULL\n    )\n  ),\n  CHECK (\n    (consumed_at_ms IS NULL AND consumed_by IS NULL)\n    OR (\n      status = 'allowed'\n      AND decision = 'allow-once'\n      AND consumed_at_ms IS NOT NULL\n      AND consumed_by IS NOT NULL\n    )\n  )\n) STRICT;\n\nCREATE UNIQUE INDEX IF NOT EXISTS idx_operator_approvals_cursor_id\n  ON operator_approvals(cursor_id);\n\nCREATE INDEX IF NOT EXISTS idx_operator_approvals_status_expiry\n  ON operator_approvals(status, expires_at_ms, approval_id);\n\nCREATE UNIQUE INDEX IF NOT EXISTS idx_operator_approvals_resolution_ref\n  ON operator_approvals(resolution_ref);\n\nCREATE INDEX IF NOT EXISTS idx_operator_approvals_source_session_created\n  ON operator_approvals(source_session_key, created_at_ms DESC, approval_id);\n\nCREATE INDEX IF NOT EXISTS idx_operator_approvals_source_run_resolved\n  ON operator_approvals(source_run_id, resolved_at_ms, approval_id)\n  WHERE source_run_id IS NOT NULL AND resolved_at_ms IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_operator_approvals_resolved\n  ON operator_approvals(resolved_at_ms, approval_id)\n  WHERE resolved_at_ms IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_operator_approvals_runtime_pending\n  ON operator_approvals(runtime_epoch, approval_id)\n  WHERE status = 'pending';\n\nCREATE TABLE IF NOT EXISTS operator_approval_execution_identities (\n  approval_id TEXT NOT NULL PRIMARY KEY\n    REFERENCES operator_approvals(approval_id) ON DELETE CASCADE,\n  source_context_id TEXT NOT NULL CHECK (\n    length(source_context_id) BETWEEN 1 AND 256 AND source_context_id = trim(source_context_id)\n  ),\n  source_execution_id TEXT NOT NULL CHECK (\n    length(source_execution_id) BETWEEN 1 AND 256 AND source_execution_id = trim(source_execution_id)\n  )\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS operator_approval_standing_grants (\n  grant_id TEXT NOT NULL PRIMARY KEY CHECK (length(grant_id) > 0),\n  minted_by_approval_id TEXT NOT NULL\n    REFERENCES operator_approvals(approval_id) ON DELETE CASCADE,\n  agent_id TEXT NOT NULL CHECK (length(agent_id) > 0),\n  cron_job_id TEXT NOT NULL CHECK (length(cron_job_id) > 0),\n  job_config_revision TEXT NOT NULL CHECK (length(job_config_revision) > 0),\n  operation_binding TEXT NOT NULL CHECK (length(operation_binding) > 0),\n  created_at_ms INTEGER NOT NULL,\n  expires_at_ms INTEGER CHECK (expires_at_ms IS NULL OR expires_at_ms >= created_at_ms),\n  revoked_at_ms INTEGER,\n  revoked_by TEXT,\n  last_used_at_ms INTEGER,\n  use_count INTEGER NOT NULL DEFAULT 0\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_operator_approval_standing_grants_binding\n  ON operator_approval_standing_grants(agent_id, cron_job_id, operation_binding, created_at_ms DESC);\n\nCREATE TABLE IF NOT EXISTS operator_approval_standing_grant_generations (\n  grant_id TEXT NOT NULL PRIMARY KEY\n    REFERENCES operator_approval_standing_grants(grant_id) ON DELETE CASCADE,\n  job_definition_generation INTEGER NOT NULL CHECK (job_definition_generation >= 1)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS schema_meta (\n  meta_key TEXT NOT NULL PRIMARY KEY,\n  role TEXT NOT NULL,\n  schema_version INTEGER NOT NULL,\n  agent_id TEXT,\n  app_version TEXT,\n  created_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS config_machine_state (\n  state_key TEXT NOT NULL PRIMARY KEY,\n  value_json TEXT NOT NULL,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS device_pairing_pending (\n  request_id TEXT NOT NULL PRIMARY KEY,\n  device_id TEXT NOT NULL,\n  public_key TEXT NOT NULL,\n  display_name TEXT,\n  platform TEXT,\n  device_family TEXT,\n  client_id TEXT,\n  client_mode TEXT,\n  browser_origin TEXT,\n  role TEXT,\n  roles_json TEXT,\n  scopes_json TEXT,\n  remote_ip TEXT,\n  silent INTEGER,\n  is_repair INTEGER,\n  ts INTEGER NOT NULL,\n  refreshed_at_ms INTEGER\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_device_pairing_pending_device\n  ON device_pairing_pending(device_id, ts DESC);\n\nCREATE TABLE IF NOT EXISTS device_pairing_paired (\n  device_id TEXT NOT NULL PRIMARY KEY,\n  public_key TEXT NOT NULL,\n  display_name TEXT,\n  operator_label TEXT,\n  platform TEXT,\n  device_family TEXT,\n  client_id TEXT,\n  client_mode TEXT,\n  browser_origin TEXT,\n  role TEXT,\n  roles_json TEXT,\n  scopes_json TEXT,\n  approved_scopes_json TEXT,\n  remote_ip TEXT,\n  tokens_json TEXT,\n  approved_via TEXT,\n  node_surface_json TEXT,\n  pending_node_surface_json TEXT,\n  created_at_ms INTEGER NOT NULL,\n  approved_at_ms INTEGER NOT NULL,\n  last_seen_at_ms INTEGER,\n  last_seen_reason TEXT\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_device_pairing_paired_approved\n  ON device_pairing_paired(approved_at_ms DESC, device_id);\n\nCREATE TABLE IF NOT EXISTS device_bootstrap_tokens (\n  token_key TEXT NOT NULL PRIMARY KEY,\n  token TEXT NOT NULL,\n  setup_id TEXT,\n  ts INTEGER NOT NULL,\n  device_id TEXT,\n  public_key TEXT,\n  profile_json TEXT,\n  redeemed_profile_json TEXT,\n  pending_profile_json TEXT,\n  issued_at_ms INTEGER NOT NULL,\n  last_used_at_ms INTEGER\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_device_bootstrap_tokens_ts\n  ON device_bootstrap_tokens(ts);\n\n-- Terminal outcome of a redeemed setup credential. The bootstrap row is deleted\n-- on redemption, so this is the only durable proof a setup code succeeded; the\n-- presenting client reconciles it when the completion broadcast is missed.\n-- Non-secret only: never the bootstrap token or anything derived from it.\n-- Bounded by retention to a handful of live rows, so the primary key is the\n-- only access path worth having.\nCREATE TABLE IF NOT EXISTS device_pair_setup_completions (\n  setup_id TEXT NOT NULL PRIMARY KEY,\n  device_id TEXT NOT NULL,\n  device_name TEXT,\n  access TEXT NOT NULL,\n  completed_at_ms INTEGER NOT NULL,\n  delivery_state TEXT NOT NULL CHECK (delivery_state IN ('uncertain', 'confirmed')),\n  retain_until_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS device_pairing_join_codes (\n  shortcode TEXT,\n  payload_json TEXT,\n  created_at_ms INTEGER,\n  expires_at_ms INTEGER\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS device_identities (\n  identity_key TEXT NOT NULL PRIMARY KEY,\n  device_id TEXT NOT NULL,\n  public_key_pem TEXT NOT NULL,\n  private_key_pem TEXT NOT NULL,\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_device_identities_device\n  ON device_identities(device_id, updated_at_ms DESC);\n\nCREATE TABLE IF NOT EXISTS device_auth_tokens (\n  device_id TEXT NOT NULL,\n  role TEXT NOT NULL,\n  token TEXT NOT NULL,\n  scopes_json TEXT NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  PRIMARY KEY (device_id, role)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_device_auth_tokens_updated\n  ON device_auth_tokens(updated_at_ms DESC, device_id, role);\n\nCREATE TABLE IF NOT EXISTS gateway_origin_device_tokens (\n  gateway_scope TEXT NOT NULL,\n  device_id TEXT NOT NULL,\n  role TEXT NOT NULL,\n  token TEXT NOT NULL,\n  scopes_json TEXT NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  PRIMARY KEY (gateway_scope, device_id, role)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS macos_port_guardian_records (\n  pid INTEGER NOT NULL PRIMARY KEY,\n  port INTEGER NOT NULL,\n  command TEXT NOT NULL,\n  mode TEXT NOT NULL,\n  timestamp REAL NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_macos_port_guardian_records_port\n  ON macos_port_guardian_records(port, timestamp DESC);\n\nCREATE TABLE IF NOT EXISTS workspace_setup_state (\n  workspace_key TEXT NOT NULL PRIMARY KEY,\n  -- NULL only for attestation-only rows whose legacy source never recorded a\n  -- path (orphan hashed-key attestations); setup rows always carry one.\n  workspace_path TEXT,\n  -- NULL setup columns mean an attestation-only row: replaceWorkspaceAttestation\n  -- may record hashes before any setup milestone exists for the workspace.\n  version INTEGER,\n  bootstrap_seeded_at TEXT,\n  setup_completed_at TEXT,\n  updated_at INTEGER,\n  attested_at_ms INTEGER,\n  attestation_updated_at_ms INTEGER,\n  CHECK (version IS NULL OR workspace_path IS NOT NULL)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_workspace_setup_state_path\n  ON workspace_setup_state(workspace_path);\n\nCREATE TABLE IF NOT EXISTS workspace_path_aliases (\n  alias_key TEXT NOT NULL PRIMARY KEY,\n  alias_path TEXT NOT NULL,\n  workspace_key TEXT NOT NULL,\n  workspace_path TEXT NOT NULL,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_workspace_path_aliases_workspace\n  ON workspace_path_aliases(workspace_key);\n\n\n\nCREATE TABLE IF NOT EXISTS workspace_generated_bootstrap_hashes (\n  workspace_key TEXT NOT NULL,\n  filename TEXT NOT NULL,\n  sha256 TEXT NOT NULL,\n  PRIMARY KEY (workspace_key, filename),\n  FOREIGN KEY (workspace_key) REFERENCES workspace_setup_state(workspace_key) ON DELETE CASCADE\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS native_hook_relay_bridges (\n  relay_id TEXT NOT NULL PRIMARY KEY,\n  pid INTEGER NOT NULL,\n  hostname TEXT NOT NULL,\n  port INTEGER NOT NULL,\n  token TEXT NOT NULL,\n  expires_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_native_hook_relay_bridges_expires\n  ON native_hook_relay_bridges(expires_at_ms, relay_id);\n\nCREATE TABLE IF NOT EXISTS managed_outgoing_image_records (\n  attachment_id TEXT NOT NULL PRIMARY KEY,\n  session_key TEXT NOT NULL,\n  agent_id TEXT,\n  message_id TEXT,\n  created_at TEXT NOT NULL,\n  updated_at TEXT,\n  retention_class TEXT,\n  alt TEXT NOT NULL,\n  original_media_root TEXT NOT NULL,\n  original_media_id TEXT NOT NULL,\n  original_media_subdir TEXT NOT NULL,\n  original_content_type TEXT NOT NULL,\n  original_width INTEGER,\n  original_height INTEGER,\n  original_size_bytes INTEGER,\n  original_filename TEXT,\n  record_json TEXT NOT NULL,\n  cleanup_pending INTEGER NOT NULL DEFAULT 0 CHECK (cleanup_pending IN (0, 1))\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_managed_outgoing_images_session\n  ON managed_outgoing_image_records(session_key, created_at DESC, attachment_id);\n\nCREATE INDEX IF NOT EXISTS idx_managed_outgoing_images_message\n  ON managed_outgoing_image_records(session_key, message_id, attachment_id)\n  WHERE message_id IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_managed_outgoing_images_agent_session\n  ON managed_outgoing_image_records(session_key, agent_id, created_at DESC, attachment_id);\n\nCREATE INDEX IF NOT EXISTS idx_managed_outgoing_images_agent_message\n  ON managed_outgoing_image_records(session_key, agent_id, message_id, attachment_id)\n  WHERE message_id IS NOT NULL;\n\nCREATE TABLE IF NOT EXISTS channel_pairing_requests (\n  channel_key TEXT NOT NULL,\n  account_id TEXT NOT NULL,\n  request_id TEXT NOT NULL,\n  code TEXT NOT NULL,\n  created_at TEXT NOT NULL,\n  last_seen_at TEXT NOT NULL,\n  meta_json TEXT,\n  PRIMARY KEY (channel_key, account_id, request_id)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_channel_pairing_requests_code\n  ON channel_pairing_requests(channel_key, code);\n\nCREATE INDEX IF NOT EXISTS idx_channel_pairing_requests_created\n  ON channel_pairing_requests(channel_key, created_at, request_id);\n\nCREATE TABLE IF NOT EXISTS channel_pairing_allow_entries (\n  channel_key TEXT NOT NULL,\n  account_id TEXT NOT NULL,\n  entry TEXT NOT NULL,\n  sort_order INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL,\n  PRIMARY KEY (channel_key, account_id, entry)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_channel_pairing_allow_account\n  ON channel_pairing_allow_entries(channel_key, account_id, sort_order, entry);\n\nCREATE TABLE IF NOT EXISTS web_push_subscriptions (\n  endpoint_hash TEXT NOT NULL PRIMARY KEY,\n  subscription_id TEXT NOT NULL UNIQUE,\n  endpoint TEXT NOT NULL,\n  p256dh TEXT NOT NULL,\n  auth TEXT NOT NULL,\n  device_id TEXT,\n  user_profile_id TEXT,\n  preferences_json TEXT,\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_web_push_subscriptions_updated\n  ON web_push_subscriptions(updated_at_ms DESC, subscription_id);\n\nCREATE TABLE IF NOT EXISTS web_push_approval_deliveries (\n  approval_id TEXT NOT NULL\n    REFERENCES operator_approvals(approval_id) ON DELETE CASCADE,\n  subscription_id TEXT NOT NULL\n    REFERENCES web_push_subscriptions(subscription_id) ON DELETE CASCADE,\n  device_id TEXT NOT NULL,\n  user_profile_id TEXT,\n  prepared_at_ms INTEGER NOT NULL,\n  PRIMARY KEY (approval_id, subscription_id)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_web_push_approval_deliveries_subscription\n  ON web_push_approval_deliveries(subscription_id, approval_id);\n\nCREATE TABLE IF NOT EXISTS apns_registrations (\n  node_id TEXT NOT NULL PRIMARY KEY,\n  transport TEXT NOT NULL,\n  token TEXT,\n  relay_handle TEXT,\n  send_grant TEXT,\n  installation_id TEXT,\n  relay_origin TEXT,\n  topic TEXT NOT NULL,\n  environment TEXT NOT NULL,\n  distribution TEXT,\n  token_debug_suffix TEXT,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_apns_registrations_updated\n  ON apns_registrations(updated_at_ms DESC, node_id);\n\nCREATE TABLE IF NOT EXISTS apns_registration_tombstones (\n  node_id TEXT NOT NULL PRIMARY KEY,\n  deleted_at_ms INTEGER NOT NULL\n) STRICT;\n\n-- Node-host-owned launch journal. The descriptor and its credential remain\n-- process memory only; this table records bounded supervision facts.\nCREATE TABLE IF NOT EXISTS node_worker_launches (\n  launch_id TEXT NOT NULL PRIMARY KEY\n    CHECK (length(launch_id) BETWEEN 1 AND 256 AND instr(launch_id, char(0)) = 0),\n  plan_hash TEXT NOT NULL\n    CHECK (length(plan_hash) = 64 AND plan_hash NOT GLOB '*[^0-9a-f]*'),\n  gateway_namespace TEXT NOT NULL\n    CHECK (\n      length(gateway_namespace) BETWEEN 1 AND 128\n      AND gateway_namespace NOT GLOB '*[^A-Za-z0-9._-]*'\n      AND gateway_namespace GLOB '[A-Za-z0-9]*'\n    ),\n  environment_id TEXT NOT NULL\n    CHECK (length(environment_id) BETWEEN 1 AND 256 AND instr(environment_id, char(0)) = 0),\n  session_id TEXT NOT NULL\n    CHECK (length(session_id) BETWEEN 1 AND 256 AND instr(session_id, char(0)) = 0),\n  owner_epoch INTEGER NOT NULL CHECK (owner_epoch BETWEEN 1 AND 9007199254740991),\n  placement_generation INTEGER NOT NULL\n    CHECK (placement_generation BETWEEN 0 AND 9007199254740991),\n  run_id TEXT NOT NULL\n    CHECK (length(run_id) BETWEEN 1 AND 256 AND instr(run_id, char(0)) = 0),\n  state TEXT NOT NULL\n    CHECK (state IN ('pending', 'running', 'completed', 'failed', 'interrupted', 'cancelled')),\n  supervisor_pid INTEGER NOT NULL CHECK (supervisor_pid BETWEEN 1 AND 2147483647),\n  supervisor_start_time INTEGER NOT NULL\n    CHECK (supervisor_start_time BETWEEN 0 AND 9007199254740991),\n  worker_pid INTEGER CHECK (worker_pid IS NULL OR worker_pid BETWEEN 1 AND 2147483647),\n  worker_start_time INTEGER CHECK (\n    worker_start_time IS NULL OR worker_start_time BETWEEN 0 AND 9007199254740991\n  ),\n  result_json TEXT CHECK (\n    result_json IS NULL\n    OR (\n      length(CAST(result_json AS BLOB)) BETWEEN 1 AND 65536\n      AND instr(result_json, char(0)) = 0\n      AND json_valid(result_json)\n    )\n  ),\n  error_text TEXT CHECK (\n    error_text IS NULL\n    OR (\n      length(CAST(error_text AS BLOB)) BETWEEN 1 AND 4096\n      AND instr(error_text, char(0)) = 0\n      AND instr(error_text, char(10)) = 0\n      AND instr(error_text, char(13)) = 0\n    )\n  ),\n  completed_at_ms INTEGER CHECK (\n    completed_at_ms IS NULL OR completed_at_ms BETWEEN 0 AND 9007199254740991\n  ),\n  created_at_ms INTEGER NOT NULL CHECK (created_at_ms BETWEEN 0 AND 9007199254740991),\n  updated_at_ms INTEGER NOT NULL CHECK (\n    updated_at_ms BETWEEN created_at_ms AND 9007199254740991\n  ),\n  CHECK ((worker_pid IS NULL) = (worker_start_time IS NULL)),\n  CHECK (\n    (state = 'pending'\n      AND worker_pid IS NULL AND result_json IS NULL AND error_text IS NULL\n      AND completed_at_ms IS NULL)\n    OR\n    (state = 'running'\n      AND worker_pid IS NOT NULL AND result_json IS NULL AND error_text IS NULL\n      AND completed_at_ms IS NULL)\n    OR\n    (state = 'completed'\n      AND result_json IS NOT NULL AND error_text IS NULL\n      AND completed_at_ms BETWEEN created_at_ms AND updated_at_ms)\n    OR\n    (state IN ('failed', 'interrupted', 'cancelled')\n      AND result_json IS NULL AND error_text IS NOT NULL\n      AND completed_at_ms BETWEEN created_at_ms AND updated_at_ms)\n  )\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_node_worker_launches_terminal_completed\n  ON node_worker_launches(completed_at_ms, launch_id)\n  WHERE completed_at_ms IS NOT NULL;\n\nCREATE TABLE IF NOT EXISTS node_worker_launch_boots (\n  launch_id TEXT NOT NULL PRIMARY KEY\n    REFERENCES node_worker_launches(launch_id) ON DELETE CASCADE,\n  boot_id TEXT CHECK (boot_id IS NULL OR length(boot_id) BETWEEN 1 AND 128)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS node_worker_launch_containers (\n  launch_id TEXT PRIMARY KEY,\n  container_json TEXT\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS node_worker_launch_cleanup (\n  launch_id TEXT NOT NULL PRIMARY KEY\n    REFERENCES node_worker_launches(launch_id) ON DELETE CASCADE,\n  cleanup_mode TEXT NOT NULL CHECK (cleanup_mode IN ('process-group', 'owned-anchor')),\n  lineage_settled INTEGER CHECK (lineage_settled IS NULL OR lineage_settled = 1)\n) STRICT;\n\n-- Older readers retain owned-anchor custody: lineage EOF is not this certificate.\nCREATE TABLE IF NOT EXISTS node_worker_launch_process_scopes (\n  launch_id TEXT NOT NULL PRIMARY KEY\n    REFERENCES node_worker_launches(launch_id) ON DELETE CASCADE,\n  scope_kind TEXT NOT NULL CHECK (scope_kind = 'linux-subreaper'),\n  descendants_reaped INTEGER CHECK (descendants_reaped IS NULL OR descendants_reaped = 1)\n) STRICT;\n\n-- Turn receipts have a shorter lifetime than their physical worker owner.\n-- Keeping the launch running preserves capacity and predecessor cleanup semantics.\nCREATE TABLE IF NOT EXISTS node_worker_turns (\n  turn_id TEXT NOT NULL PRIMARY KEY\n    CHECK (length(turn_id) BETWEEN 1 AND 256 AND instr(turn_id, char(0)) = 0),\n  owner_launch_id TEXT NOT NULL\n    REFERENCES node_worker_launches(launch_id) ON DELETE CASCADE,\n  plan_hash TEXT NOT NULL\n    CHECK (length(plan_hash) = 64 AND plan_hash NOT GLOB '*[^0-9a-f]*'),\n  run_id TEXT NOT NULL\n    CHECK (length(run_id) BETWEEN 1 AND 256 AND instr(run_id, char(0)) = 0),\n  state TEXT NOT NULL\n    CHECK (state IN ('running', 'completed', 'failed', 'interrupted', 'cancelled')),\n  result_json TEXT CHECK (\n    result_json IS NULL\n    OR (\n      length(CAST(result_json AS BLOB)) BETWEEN 1 AND 65536\n      AND instr(result_json, char(0)) = 0\n      AND json_valid(result_json)\n    )\n  ),\n  error_text TEXT CHECK (\n    error_text IS NULL\n    OR (\n      length(CAST(error_text AS BLOB)) BETWEEN 1 AND 4096\n      AND instr(error_text, char(0)) = 0\n      AND instr(error_text, char(10)) = 0\n      AND instr(error_text, char(13)) = 0\n    )\n  ),\n  completed_at_ms INTEGER CHECK (\n    completed_at_ms IS NULL OR completed_at_ms BETWEEN 0 AND 9007199254740991\n  ),\n  created_at_ms INTEGER NOT NULL CHECK (created_at_ms BETWEEN 0 AND 9007199254740991),\n  updated_at_ms INTEGER NOT NULL CHECK (\n    updated_at_ms BETWEEN created_at_ms AND 9007199254740991\n  ),\n  CHECK (\n    (state = 'running'\n      AND result_json IS NULL AND error_text IS NULL AND completed_at_ms IS NULL)\n    OR\n    (state = 'completed'\n      AND result_json IS NOT NULL AND error_text IS NULL\n      AND completed_at_ms BETWEEN created_at_ms AND updated_at_ms)\n    OR\n    (state IN ('failed', 'interrupted', 'cancelled')\n      AND result_json IS NULL AND error_text IS NOT NULL\n      AND completed_at_ms BETWEEN created_at_ms AND updated_at_ms)\n  )\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_node_worker_turns_terminal_completed\n  ON node_worker_turns(completed_at_ms, turn_id)\n  WHERE completed_at_ms IS NOT NULL;\n\nCREATE UNIQUE INDEX IF NOT EXISTS idx_node_worker_turns_active_owner\n  ON node_worker_turns(owner_launch_id)\n  WHERE state = 'running';\n\nCREATE TABLE IF NOT EXISTS config_health_entries (\n  config_path TEXT NOT NULL PRIMARY KEY,\n  last_known_good_json TEXT,\n  last_promoted_good_json TEXT,\n  last_observed_suspicious_signature TEXT,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS clawhub_promotion_claims (\n  slug TEXT NOT NULL PRIMARY KEY,\n  provider TEXT,\n  model_keys_json TEXT NOT NULL,\n  ends_at_ms INTEGER NOT NULL,\n  claimed_at_ms INTEGER NOT NULL\n) STRICT;\n\n\n\nCREATE TABLE IF NOT EXISTS official_external_plugin_catalog_snapshots (\n  feed_url TEXT NOT NULL PRIMARY KEY,\n  body TEXT NOT NULL,\n  status INTEGER NOT NULL,\n  etag TEXT,\n  last_modified TEXT,\n  checksum TEXT NOT NULL,\n  saved_at TEXT NOT NULL,\n  trust_mode TEXT,\n  trust_key_id TEXT,\n  trust_signature_count INTEGER,\n  trust_threshold INTEGER,\n  trust_verified_at TEXT,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_official_external_plugin_catalog_snapshots_updated\n  ON official_external_plugin_catalog_snapshots(updated_at_ms DESC, feed_url);\n\nCREATE TABLE IF NOT EXISTS update_runs (\n  run_id TEXT PRIMARY KEY NOT NULL,\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  trigger TEXT NOT NULL CHECK (trigger IN ('chat', 'control-ui', 'cli', 'campaign', 'mac-app', 'api')),\n  phase TEXT NOT NULL CHECK (phase IN ('requested', 'staging', 'validating', 'repairing', 'activating', 'restarting', 'verifying', 'finished')),\n  status TEXT NOT NULL CHECK (status IN ('running', 'succeeded', 'failed', 'rolled-back', 'skipped')),\n  reason TEXT,\n  origin_json TEXT NOT NULL CHECK (length(CAST(origin_json AS BLOB)) <= 16384),\n  target_json TEXT NOT NULL CHECK (length(CAST(target_json AS BLOB)) <= 16384),\n  before_json TEXT NOT NULL CHECK (length(CAST(before_json AS BLOB)) <= 16384),\n  after_json TEXT NOT NULL CHECK (length(CAST(after_json AS BLOB)) <= 16384),\n  steps_json TEXT NOT NULL CHECK (length(CAST(steps_json AS BLOB)) <= 16384),\n  verification_json TEXT NOT NULL CHECK (length(CAST(verification_json AS BLOB)) <= 16384),\n  repair_json TEXT NOT NULL CHECK (length(CAST(repair_json AS BLOB)) <= 16384),\n  confirmed_at_ms INTEGER,\n  finished_at_ms INTEGER,\n  downtime_ms INTEGER,\n  CHECK ((status = 'running' AND phase != 'finished' AND finished_at_ms IS NULL) OR\n    (status != 'running' AND phase = 'finished' AND finished_at_ms IS NOT NULL))\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_update_runs_created\n  ON update_runs(created_at_ms DESC, run_id);\nCREATE INDEX IF NOT EXISTS idx_update_runs_active\n  ON update_runs(status, created_at_ms DESC, run_id);\n\nCREATE TABLE IF NOT EXISTS gateway_restart_sentinel (\n  sentinel_key TEXT NOT NULL PRIMARY KEY,\n  version INTEGER NOT NULL,\n  kind TEXT NOT NULL,\n  status TEXT NOT NULL,\n  ts INTEGER NOT NULL,\n  session_key TEXT,\n  thread_id TEXT,\n  delivery_channel TEXT,\n  delivery_to TEXT,\n  delivery_account_id TEXT,\n  message TEXT,\n  continuation_json TEXT,\n  doctor_hint TEXT,\n  stats_json TEXT,\n  payload_json TEXT NOT NULL,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_gateway_restart_sentinel_ts\n  ON gateway_restart_sentinel(ts DESC, sentinel_key);\n\nCREATE TABLE IF NOT EXISTS gateway_restart_intent (\n  intent_key TEXT NOT NULL PRIMARY KEY,\n  kind TEXT NOT NULL,\n  pid INTEGER NOT NULL,\n  created_at INTEGER NOT NULL,\n  reason TEXT,\n  force INTEGER,\n  wait_ms INTEGER,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS gateway_restart_handoff (\n  handoff_key TEXT NOT NULL PRIMARY KEY,\n  kind TEXT NOT NULL,\n  version INTEGER NOT NULL,\n  intent_id TEXT NOT NULL,\n  pid INTEGER NOT NULL,\n  process_instance_id TEXT,\n  created_at INTEGER NOT NULL,\n  expires_at INTEGER NOT NULL,\n  reason TEXT,\n  restart_trace_started_at INTEGER,\n  restart_trace_last_at INTEGER,\n  source TEXT NOT NULL,\n  restart_kind TEXT NOT NULL,\n  supervisor_mode TEXT NOT NULL,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_gateway_restart_handoff_expiry\n  ON gateway_restart_handoff(expires_at, pid);\n\nCREATE TABLE IF NOT EXISTS gateway_boot_lifecycle (\n  boot_id TEXT NOT NULL PRIMARY KEY,\n  pid INTEGER NOT NULL,\n  started_at_ms INTEGER NOT NULL,\n  completed_at_ms INTEGER,\n  outcome TEXT,\n  startup_reason TEXT,\n  reason TEXT\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_gateway_boot_lifecycle_started\n  ON gateway_boot_lifecycle(started_at_ms);\n\nCREATE TABLE IF NOT EXISTS acp_sessions (\n  session_key TEXT NOT NULL PRIMARY KEY,\n  session_id TEXT,\n  backend TEXT NOT NULL,\n  agent TEXT NOT NULL,\n  runtime_session_name TEXT NOT NULL,\n  identity_json TEXT,\n  resume_agent_session_id TEXT,\n  resume_acpx_session_id TEXT,\n  mode TEXT NOT NULL,\n  runtime_options_json TEXT,\n  cwd TEXT,\n  state TEXT NOT NULL,\n  last_activity_at INTEGER NOT NULL,\n  last_error TEXT,\n  updated_at INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_acp_sessions_state_activity\n  ON acp_sessions(state, last_activity_at DESC, session_key);\n\nCREATE INDEX IF NOT EXISTS idx_acp_sessions_agent_activity\n  ON acp_sessions(agent, last_activity_at DESC, session_key);\n\nCREATE INDEX IF NOT EXISTS idx_acp_sessions_resume_agent\n  ON acp_sessions(resume_agent_session_id);\n\nCREATE INDEX IF NOT EXISTS idx_acp_sessions_resume_acpx\n  ON acp_sessions(resume_acpx_session_id);\n\nCREATE TABLE IF NOT EXISTS acp_replay_sessions (\n  session_id TEXT NOT NULL PRIMARY KEY,\n  session_key TEXT NOT NULL,\n  cwd TEXT NOT NULL,\n  complete INTEGER NOT NULL,\n  created_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL,\n  next_seq INTEGER NOT NULL,\n  -- Running estimate of this session's ledger footprint (row overhead plus\n  -- all event rows), maintained at insert/trim so budget checks never scan\n  -- acp_replay_events (#100622).\n  estimated_bytes INTEGER NOT NULL DEFAULT 0\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_acp_replay_sessions_key_updated\n  ON acp_replay_sessions(session_key, complete, updated_at DESC, session_id);\n\nCREATE INDEX IF NOT EXISTS idx_acp_replay_sessions_updated\n  ON acp_replay_sessions(updated_at DESC, session_id);\n\nCREATE TABLE IF NOT EXISTS acp_replay_events (\n  session_id TEXT NOT NULL,\n  seq INTEGER NOT NULL,\n  at INTEGER NOT NULL,\n  session_key TEXT NOT NULL,\n  run_id TEXT,\n  update_json TEXT NOT NULL,\n  estimated_bytes INTEGER NOT NULL DEFAULT 0,\n  PRIMARY KEY (session_id, seq),\n  FOREIGN KEY (session_id) REFERENCES acp_replay_sessions(session_id) ON DELETE CASCADE\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_acp_replay_events_session_seq\n  ON acp_replay_events(session_id, seq);\n\nCREATE TABLE IF NOT EXISTS agent_databases (\n  agent_id TEXT NOT NULL,\n  path TEXT NOT NULL,\n  schema_version INTEGER NOT NULL,\n  last_seen_at INTEGER NOT NULL,\n  size_bytes INTEGER,\n  PRIMARY KEY (agent_id, path)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS agent_deletion_journal (\n  agent_id TEXT PRIMARY KEY,\n  operation_id TEXT NOT NULL DEFAULT '',\n  phase TEXT,\n  agent_dir TEXT NOT NULL,\n  workspace_dir TEXT NOT NULL,\n  sessions_dir TEXT NOT NULL,\n  database_paths_json TEXT NOT NULL DEFAULT '[]',\n  cleanup_paths_json TEXT NOT NULL DEFAULT '[]',\n  created_at INTEGER NOT NULL,\n  cleanup_completed INTEGER NOT NULL DEFAULT 0,\n  delete_files INTEGER NOT NULL DEFAULT 1\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS agent_provenance (\n  agent_id TEXT PRIMARY KEY,\n  created_via TEXT NOT NULL CHECK (created_via IN ('operator', 'agent', 'claw')),\n  creator_agent_id TEXT,\n  created_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS agent_database_leases (\n  lease_id TEXT PRIMARY KEY,\n  agent_id TEXT NOT NULL,\n  path TEXT NOT NULL,\n  owner_pid INTEGER NOT NULL,\n  owner_start_time INTEGER,\n  opened_at INTEGER NOT NULL,\n  provenance TEXT\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS plugin_state_entries (\n  plugin_id TEXT NOT NULL,\n  namespace TEXT NOT NULL,\n  entry_key TEXT NOT NULL,\n  value_json TEXT NOT NULL,\n  created_at INTEGER NOT NULL,\n  expires_at INTEGER,\n  PRIMARY KEY (plugin_id, namespace, entry_key)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_plugin_state_expiry\n  ON plugin_state_entries(expires_at)\n  WHERE expires_at IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_plugin_state_listing\n  ON plugin_state_entries(plugin_id, namespace, created_at, entry_key, expires_at);\n\nCREATE TABLE IF NOT EXISTS channel_ingress_events (\n  queue_name TEXT NOT NULL,\n  event_id TEXT NOT NULL,\n  channel_id TEXT NOT NULL,\n  account_id TEXT NOT NULL,\n  status TEXT NOT NULL,\n  lane_key TEXT,\n  payload_json TEXT NOT NULL,\n  metadata_json TEXT,\n  received_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL,\n  claim_token TEXT,\n  claim_owner TEXT,\n  claimed_at INTEGER,\n  attempts INTEGER NOT NULL DEFAULT 0,\n  last_attempt_at INTEGER,\n  last_error TEXT,\n  failed_reason TEXT,\n  failed_at INTEGER,\n  completed_at INTEGER,\n  completed_metadata_json TEXT,\n  PRIMARY KEY (queue_name, event_id)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_channel_ingress_pending\n  ON channel_ingress_events(queue_name, status, received_at, event_id);\n\nCREATE INDEX IF NOT EXISTS idx_channel_ingress_claims\n  ON channel_ingress_events(queue_name, status, claimed_at);\n\nCREATE INDEX IF NOT EXISTS idx_channel_ingress_lane\n  ON channel_ingress_events(queue_name, status, lane_key);\n\nCREATE TABLE IF NOT EXISTS plugin_blob_entries (\n  plugin_id TEXT NOT NULL,\n  namespace TEXT NOT NULL,\n  entry_key TEXT NOT NULL,\n  metadata_json TEXT NOT NULL,\n  blob BLOB NOT NULL,\n  created_at INTEGER NOT NULL,\n  expires_at INTEGER,\n  PRIMARY KEY (plugin_id, namespace, entry_key)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_plugin_blob_expiry\n  ON plugin_blob_entries(expires_at)\n  WHERE expires_at IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_plugin_blob_listing\n  ON plugin_blob_entries(plugin_id, namespace, created_at, entry_key);\n\nCREATE TABLE IF NOT EXISTS skill_uploads (\n  upload_id TEXT NOT NULL PRIMARY KEY,\n  kind TEXT NOT NULL,\n  slug TEXT NOT NULL,\n  force INTEGER NOT NULL,\n  size_bytes INTEGER NOT NULL,\n  sha256 TEXT,\n  actual_sha256 TEXT,\n  received_bytes INTEGER NOT NULL,\n  archive_blob BLOB NOT NULL,\n  created_at INTEGER NOT NULL,\n  expires_at INTEGER NOT NULL,\n  committed INTEGER NOT NULL,\n  committed_at INTEGER,\n  idempotency_key_hash TEXT UNIQUE\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_skill_uploads_expiry\n  ON skill_uploads(expires_at);\n\nCREATE INDEX IF NOT EXISTS idx_skill_uploads_idempotency\n  ON skill_uploads(idempotency_key_hash)\n  WHERE idempotency_key_hash IS NOT NULL;\n\nCREATE TABLE IF NOT EXISTS skill_upload_chunks (\n  upload_id TEXT NOT NULL,\n  byte_offset INTEGER NOT NULL CHECK (byte_offset >= 0),\n  size_bytes INTEGER NOT NULL CHECK (size_bytes > 0),\n  chunk_blob BLOB NOT NULL,\n  PRIMARY KEY (upload_id, byte_offset),\n  FOREIGN KEY (upload_id) REFERENCES skill_uploads(upload_id) ON DELETE CASCADE,\n  CHECK (length(chunk_blob) = size_bytes)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS capture_sessions (\n  id TEXT NOT NULL PRIMARY KEY,\n  started_at INTEGER NOT NULL,\n  ended_at INTEGER,\n  mode TEXT NOT NULL,\n  source_scope TEXT NOT NULL,\n  source_process TEXT NOT NULL,\n  proxy_url TEXT\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS capture_blobs (\n  blob_id TEXT NOT NULL PRIMARY KEY,\n  content_type TEXT,\n  encoding TEXT NOT NULL,\n  size_bytes INTEGER NOT NULL,\n  sha256 TEXT NOT NULL,\n  data BLOB NOT NULL,\n  created_at INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS capture_events (\n  id INTEGER NOT NULL PRIMARY KEY,\n  session_id TEXT NOT NULL,\n  ts INTEGER NOT NULL,\n  source_scope TEXT NOT NULL,\n  source_process TEXT NOT NULL,\n  protocol TEXT NOT NULL,\n  direction TEXT NOT NULL,\n  kind TEXT NOT NULL,\n  flow_id TEXT NOT NULL,\n  method TEXT,\n  host TEXT,\n  path TEXT,\n  status INTEGER,\n  close_code INTEGER,\n  content_type TEXT,\n  headers_json TEXT,\n  data_text TEXT,\n  data_blob_id TEXT,\n  data_sha256 TEXT,\n  error_text TEXT,\n  meta_json TEXT,\n  FOREIGN KEY (session_id) REFERENCES capture_sessions(id) ON DELETE CASCADE,\n  FOREIGN KEY (data_blob_id) REFERENCES capture_blobs(blob_id) ON DELETE SET NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS capture_events_session_ts_idx\n  ON capture_events(session_id, ts);\n\nCREATE INDEX IF NOT EXISTS capture_events_flow_idx\n  ON capture_events(flow_id, ts);\n\nCREATE TABLE IF NOT EXISTS sandbox_registry_entries (\n  registry_kind TEXT NOT NULL,\n  container_name TEXT NOT NULL,\n  session_key TEXT,\n  backend_id TEXT,\n  runtime_label TEXT,\n  image TEXT,\n  created_at_ms INTEGER,\n  last_used_at_ms INTEGER,\n  config_label_kind TEXT,\n  config_hash TEXT,\n  cdp_port INTEGER,\n  no_vnc_port INTEGER,\n  entry_json TEXT NOT NULL,\n  updated_at INTEGER NOT NULL,\n  PRIMARY KEY (registry_kind, container_name)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_sandbox_registry_updated\n  ON sandbox_registry_entries(registry_kind, updated_at DESC, container_name);\n\nCREATE INDEX IF NOT EXISTS idx_sandbox_registry_session\n  ON sandbox_registry_entries(registry_kind, session_key, last_used_at_ms DESC, container_name)\n  WHERE session_key IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_sandbox_registry_last_used\n  ON sandbox_registry_entries(registry_kind, last_used_at_ms DESC, container_name)\n  WHERE last_used_at_ms IS NOT NULL;\n\nCREATE TABLE IF NOT EXISTS cron_jobs (\n  store_key TEXT NOT NULL,\n  job_id TEXT NOT NULL,\n  declaration_key TEXT,\n  owner_agent_id TEXT,\n  name TEXT NOT NULL,\n  description TEXT,\n  enabled INTEGER NOT NULL,\n  agent_id TEXT,\n  payload_kind TEXT NOT NULL,\n  job_json TEXT NOT NULL,\n  grant_definition_revision TEXT,\n  grant_definition_generation INTEGER,\n  grant_definition_updated_at INTEGER,\n  state_json TEXT NOT NULL DEFAULT '{}',\n  runtime_updated_at_ms INTEGER,\n  schedule_identity TEXT,\n  sort_order INTEGER NOT NULL DEFAULT 0,\n  updated_at INTEGER NOT NULL,\n  PRIMARY KEY (store_key, job_id)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_cron_jobs_store_order\n  ON cron_jobs(store_key, sort_order ASC, updated_at ASC, job_id);\n\n-- One owner-native receipt is also the durable execution fence. Receipts\n-- survive job deletion so operators can distinguish a run from log inference.\nCREATE TABLE IF NOT EXISTS cron_run_receipts (\n  cursor_id INTEGER NOT NULL,\n  receipt_id TEXT PRIMARY KEY,\n  store_key TEXT NOT NULL,\n  job_id TEXT NOT NULL,\n  config_revision TEXT NOT NULL,\n  agent_id TEXT NOT NULL,\n  request_run_id TEXT,\n  delivery_attempt_state TEXT NOT NULL DEFAULT 'unknown' CHECK (delivery_attempt_state IN ('unknown', 'not-started', 'started')),\n  status TEXT NOT NULL,\n  owner_pid INTEGER NOT NULL,\n  owner_start_time INTEGER,\n  started_at_ms INTEGER NOT NULL,\n  finished_at_ms INTEGER,\n  error_text TEXT,\n  CHECK (status IN ('running', 'ok', 'error', 'skipped', 'interrupted', 'superseded')),\n  CHECK (\n    (status = 'running' AND finished_at_ms IS NULL)\n    OR\n    (status != 'running' AND finished_at_ms IS NOT NULL)\n  )\n) STRICT;\n\nCREATE UNIQUE INDEX IF NOT EXISTS cron_run_receipts_cursor_id_idx\n  ON cron_run_receipts(cursor_id);\n\nCREATE UNIQUE INDEX IF NOT EXISTS idx_cron_run_receipts_active_job\n  ON cron_run_receipts(store_key, job_id)\n  WHERE status = 'running';\n\nCREATE INDEX IF NOT EXISTS idx_cron_run_receipts_job_history\n  ON cron_run_receipts(store_key, job_id, started_at_ms DESC, receipt_id DESC);\n\n-- Retirement follows the receipt's retention without changing its released shape.\nCREATE TABLE IF NOT EXISTS cron_run_trigger_state_retirements (\n  receipt_id TEXT PRIMARY KEY\n    REFERENCES cron_run_receipts(receipt_id) ON DELETE CASCADE\n) STRICT;\n\n-- Runtime-private authority is independent of job_json so downgraded writers\n-- can rewrite recognized job config without erasing or silently widening it.\nCREATE TABLE IF NOT EXISTS cron_job_runtime_authorities (\n  store_key TEXT NOT NULL,\n  job_id TEXT NOT NULL,\n  authority_json TEXT,\n  authority_input_fingerprint TEXT,\n  recovery_required INTEGER NOT NULL,\n  PRIMARY KEY (store_key, job_id),\n  FOREIGN KEY (store_key, job_id)\n    REFERENCES cron_jobs(store_key, job_id) ON DELETE CASCADE,\n  CHECK (recovery_required IN (0, 1)),\n  CHECK (\n    (recovery_required = 0 AND authority_json IS NOT NULL AND authority_input_fingerprint IS NOT NULL)\n    OR\n    (recovery_required = 1 AND authority_json IS NULL AND authority_input_fingerprint IS NULL)\n  )\n) STRICT;\n\n-- Scratch is separate from cron_jobs so scheduler state writes and downgraded\n-- full-row replacement preserve it. New builds prune rows explicitly on job removal.\n-- content NULL is a tombstone: it keeps the revision lineage monotonic across\n-- unset/recreate so stale compare-and-swap writes cannot resurrect old content.\nCREATE TABLE IF NOT EXISTS cron_job_scratch (\n  store_key TEXT NOT NULL,\n  job_id TEXT NOT NULL,\n  content TEXT,\n  revision INTEGER NOT NULL,\n  source_sha256 TEXT,\n  updated_at_ms INTEGER NOT NULL,\n  PRIMARY KEY (store_key, job_id),\n  CHECK (revision >= 1),\n  CHECK (content IS NULL OR length(CAST(content AS BLOB)) <= 262144)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_cron_job_scratch_store_updated\n  ON cron_job_scratch(store_key, updated_at_ms DESC, job_id);\n\nCREATE TABLE IF NOT EXISTS delivery_queue_entries (\n  queue_name TEXT NOT NULL,\n  id TEXT NOT NULL,\n  status TEXT NOT NULL,\n  entry_kind TEXT,\n  session_key TEXT,\n  channel TEXT,\n  target TEXT,\n  account_id TEXT,\n  retry_count INTEGER NOT NULL DEFAULT 0,\n  last_attempt_at INTEGER,\n  last_error TEXT,\n  recovery_state TEXT,\n  platform_send_started_at INTEGER,\n  entry_json TEXT NOT NULL,\n  retention_id_prefix TEXT,\n  retention_max_age_ms INTEGER,\n  retention_max_entries INTEGER,\n  enqueued_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL,\n  failed_at INTEGER,\n  PRIMARY KEY (queue_name, id)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_delivery_queue_pending\n  ON delivery_queue_entries(queue_name, status, enqueued_at, id);\n\nCREATE INDEX IF NOT EXISTS idx_delivery_queue_failed\n  ON delivery_queue_entries(status, queue_name, failed_at, id);\n\nCREATE INDEX IF NOT EXISTS idx_delivery_queue_session\n  ON delivery_queue_entries(queue_name, status, session_key, enqueued_at, id)\n  WHERE session_key IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_delivery_queue_target\n  ON delivery_queue_entries(queue_name, status, channel, target, enqueued_at, id)\n  WHERE channel IS NOT NULL AND target IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_delivery_queue_bounded_retention\n  ON delivery_queue_entries(queue_name, retention_id_prefix, enqueued_at DESC, id DESC)\n  WHERE status IN ('completed', 'failed') AND recovery_state = 'completed_bounded'\n    AND retention_id_prefix IS NOT NULL;\n\nCREATE TABLE IF NOT EXISTS task_runs (\n  task_id TEXT NOT NULL PRIMARY KEY,\n  runtime TEXT NOT NULL,\n  task_kind TEXT,\n  source_id TEXT,\n  requester_session_key TEXT,\n  owner_key TEXT NOT NULL,\n  scope_kind TEXT NOT NULL,\n  child_session_key TEXT,\n  parent_flow_id TEXT,\n  parent_task_id TEXT,\n  agent_id TEXT,\n  requester_agent_id TEXT,\n  run_id TEXT,\n  execution_owner_host TEXT,\n  execution_owner_pid INTEGER,\n  execution_owner_start_identity INTEGER,\n  label TEXT,\n  task TEXT NOT NULL,\n  status TEXT NOT NULL,\n  delivery_status TEXT NOT NULL,\n  notify_policy TEXT NOT NULL,\n  created_at INTEGER NOT NULL,\n  started_at INTEGER,\n  ended_at INTEGER,\n  last_event_at INTEGER,\n  cleanup_after INTEGER,\n  tool_use_count INTEGER,\n  last_tool_name TEXT,\n  error TEXT,\n  progress_summary TEXT,\n  terminal_summary TEXT,\n  terminal_outcome TEXT,\n  detail_json TEXT\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_task_runs_run_id ON task_runs(run_id);\nCREATE INDEX IF NOT EXISTS idx_task_runs_status ON task_runs(status);\nCREATE INDEX IF NOT EXISTS idx_task_runs_runtime_status ON task_runs(runtime, status);\nCREATE INDEX IF NOT EXISTS idx_task_runs_cleanup_after ON task_runs(cleanup_after);\nCREATE INDEX IF NOT EXISTS idx_task_runs_last_event_at ON task_runs(last_event_at);\nCREATE INDEX IF NOT EXISTS idx_task_runs_owner_key ON task_runs(owner_key);\nCREATE INDEX IF NOT EXISTS idx_task_runs_parent_flow_id ON task_runs(parent_flow_id);\nCREATE INDEX IF NOT EXISTS idx_task_runs_child_session_key ON task_runs(child_session_key);\nCREATE INDEX IF NOT EXISTS idx_task_runs_requester_session_key ON task_runs(requester_session_key);\nCREATE INDEX IF NOT EXISTS idx_task_runs_runtime_source_ended\n  ON task_runs(runtime, source_id, ended_at, created_at, task_id);\nCREATE INDEX IF NOT EXISTS idx_task_runs_runtime_ended\n  ON task_runs(runtime, ended_at, created_at, task_id);\n\nCREATE TABLE IF NOT EXISTS subagent_runs (\n  run_id TEXT NOT NULL PRIMARY KEY,\n  child_session_key TEXT NOT NULL,\n  controller_session_key TEXT,\n  controller_store_path TEXT,\n  requester_session_key TEXT NOT NULL,\n  requester_store_path TEXT,\n  created_at INTEGER NOT NULL,\n  payload_json TEXT NOT NULL DEFAULT '{}'\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_subagent_runs_child_session_key\n  ON subagent_runs(child_session_key, created_at DESC, run_id);\nCREATE INDEX IF NOT EXISTS idx_subagent_runs_requester_session_key\n  ON subagent_runs(requester_session_key, created_at DESC, run_id);\nCREATE INDEX IF NOT EXISTS idx_subagent_runs_controller_session_key\n  ON subagent_runs(controller_session_key, created_at DESC, run_id);\n\nCREATE TABLE IF NOT EXISTS current_conversation_bindings (\n  binding_key TEXT NOT NULL PRIMARY KEY,\n  binding_id TEXT NOT NULL,\n  target_session_key TEXT NOT NULL,\n  channel TEXT NOT NULL,\n  account_id TEXT NOT NULL,\n  conversation_kind TEXT NOT NULL,\n  parent_conversation_id TEXT,\n  conversation_id TEXT NOT NULL,\n  target_kind TEXT NOT NULL,\n  status TEXT NOT NULL,\n  bound_at INTEGER NOT NULL,\n  expires_at INTEGER,\n  metadata_json TEXT,\n  record_json TEXT NOT NULL,\n  updated_at INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_current_conversation_bindings_target\n  ON current_conversation_bindings(target_session_key, updated_at DESC, binding_key);\nCREATE INDEX IF NOT EXISTS idx_current_conversation_bindings_conversation\n  ON current_conversation_bindings(channel, account_id, conversation_kind, conversation_id);\nCREATE INDEX IF NOT EXISTS idx_current_conversation_bindings_expires\n  ON current_conversation_bindings(expires_at, binding_key);\n\nCREATE TABLE IF NOT EXISTS plugin_binding_approvals (\n  plugin_root TEXT NOT NULL,\n  channel TEXT NOT NULL,\n  account_id TEXT NOT NULL,\n  plugin_id TEXT NOT NULL,\n  plugin_name TEXT,\n  approved_at INTEGER NOT NULL,\n  PRIMARY KEY (plugin_root, channel, account_id)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_plugin_binding_approvals_plugin\n  ON plugin_binding_approvals(plugin_id, approved_at DESC);\n\nCREATE TABLE IF NOT EXISTS task_delivery_state (\n  task_id TEXT NOT NULL PRIMARY KEY,\n  requester_origin_json TEXT,\n  last_notified_event_at INTEGER,\n  FOREIGN KEY (task_id) REFERENCES task_runs(task_id) ON DELETE CASCADE\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS flow_runs (\n  flow_id TEXT NOT NULL PRIMARY KEY,\n  shape TEXT,\n  sync_mode TEXT NOT NULL DEFAULT 'managed',\n  owner_key TEXT NOT NULL,\n  requester_origin_json TEXT,\n  controller_id TEXT,\n  revision INTEGER NOT NULL DEFAULT 0,\n  status TEXT NOT NULL,\n  notify_policy TEXT NOT NULL,\n  goal TEXT NOT NULL,\n  current_step TEXT,\n  blocked_task_id TEXT,\n  blocked_summary TEXT,\n  state_json TEXT,\n  wait_json TEXT,\n  cancel_requested_at INTEGER,\n  created_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL,\n  ended_at INTEGER\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_flow_runs_status ON flow_runs(status);\nCREATE INDEX IF NOT EXISTS idx_flow_runs_owner_key ON flow_runs(owner_key);\nCREATE INDEX IF NOT EXISTS idx_flow_runs_updated_at ON flow_runs(updated_at);\n\n-- Durable meeting-capture sessions are gateway-global rather than agent-session\n-- transcripts. JSON/JSONL files are doctor import inputs or explicit CLI exports.\nCREATE TABLE IF NOT EXISTS meeting_transcript_sessions (\n  session_id TEXT NOT NULL,\n  started_at TEXT NOT NULL,\n  selector TEXT NOT NULL UNIQUE,\n  export_key TEXT NOT NULL,\n  session_slug TEXT NOT NULL,\n  provider_id TEXT NOT NULL,\n  title TEXT,\n  source_json TEXT NOT NULL,\n  source_account_id TEXT,\n  source_guild_id TEXT,\n  source_channel_id TEXT,\n  source_meeting_url TEXT,\n  source_thread_ts TEXT,\n  source_file_id TEXT,\n  stopped_at TEXT,\n  metadata_json TEXT,\n  metadata_agent_id TEXT,\n  export_manifest_json TEXT NOT NULL DEFAULT '{}',\n  export_pending_json TEXT NOT NULL DEFAULT '[]',\n  next_utterance_seq INTEGER NOT NULL DEFAULT 0 CHECK (next_utterance_seq >= 0),\n  created_at_ms INTEGER NOT NULL CHECK (created_at_ms >= 0),\n  updated_at_ms INTEGER NOT NULL CHECK (updated_at_ms >= 0),\n  PRIMARY KEY (session_id, started_at)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_meeting_transcript_sessions_started\n  ON meeting_transcript_sessions(started_at DESC, session_id);\n\nCREATE INDEX IF NOT EXISTS idx_meeting_transcript_sessions_id\n  ON meeting_transcript_sessions(session_id, started_at DESC);\n\nCREATE INDEX IF NOT EXISTS idx_meeting_transcript_sessions_slug\n  ON meeting_transcript_sessions(session_slug, started_at DESC);\n\nCREATE INDEX IF NOT EXISTS idx_meeting_transcript_sessions_export_key\n  ON meeting_transcript_sessions(export_key);\n\nCREATE INDEX IF NOT EXISTS idx_meeting_transcript_sessions_source\n  ON meeting_transcript_sessions(provider_id, source_account_id, source_guild_id,\n    source_channel_id, source_meeting_url, source_thread_ts, source_file_id,\n    stopped_at DESC, started_at DESC, session_id);\n\nCREATE INDEX IF NOT EXISTS idx_meeting_transcript_sessions_account\n  ON meeting_transcript_sessions(source_account_id);\n\nCREATE INDEX IF NOT EXISTS idx_meeting_transcript_sessions_agent\n  ON meeting_transcript_sessions(metadata_agent_id);\n\nCREATE TABLE IF NOT EXISTS meeting_transcript_utterances (\n  session_id TEXT NOT NULL,\n  session_started_at TEXT NOT NULL,\n  sequence INTEGER NOT NULL CHECK (sequence >= 0),\n  utterance_id TEXT,\n  started_at TEXT,\n  ended_at TEXT,\n  speaker_id TEXT,\n  speaker_label TEXT,\n  text TEXT NOT NULL,\n  final INTEGER CHECK (final IN (0, 1)),\n  metadata_json TEXT,\n  PRIMARY KEY (session_id, session_started_at, sequence),\n  FOREIGN KEY (session_id, session_started_at)\n    REFERENCES meeting_transcript_sessions(session_id, started_at)\n    ON DELETE CASCADE\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_meeting_transcript_utterances_id\n  ON meeting_transcript_utterances(session_id, session_started_at, utterance_id)\n  WHERE utterance_id IS NOT NULL;\n\nCREATE TABLE IF NOT EXISTS meeting_transcript_summaries (\n  session_id TEXT NOT NULL,\n  session_started_at TEXT NOT NULL,\n  generated_at TEXT,\n  summary_json TEXT,\n  overview TEXT,\n  markdown TEXT,\n  utterance_count INTEGER NOT NULL CHECK (utterance_count >= 0),\n  PRIMARY KEY (session_id, session_started_at),\n  FOREIGN KEY (session_id, session_started_at)\n    REFERENCES meeting_transcript_sessions(session_id, started_at)\n    ON DELETE CASCADE,\n  CHECK (summary_json IS NOT NULL OR markdown IS NOT NULL)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS migration_runs (\n  id TEXT NOT NULL PRIMARY KEY,\n  started_at INTEGER NOT NULL,\n  finished_at INTEGER,\n  status TEXT NOT NULL,\n  report_json TEXT NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_migration_runs_started\n  ON migration_runs(started_at DESC, id);\n\nCREATE TABLE IF NOT EXISTS migration_sources (\n  source_key TEXT NOT NULL PRIMARY KEY,\n  migration_kind TEXT NOT NULL,\n  source_path TEXT NOT NULL,\n  target_table TEXT NOT NULL,\n  source_sha256 TEXT,\n  source_size_bytes INTEGER,\n  source_record_count INTEGER,\n  last_run_id TEXT NOT NULL,\n  status TEXT NOT NULL,\n  imported_at INTEGER NOT NULL,\n  removed_source INTEGER NOT NULL DEFAULT 0,\n  report_json TEXT NOT NULL,\n  FOREIGN KEY (last_run_id) REFERENCES migration_runs(id) ON DELETE CASCADE\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_migration_sources_path\n  ON migration_sources(source_path, migration_kind, target_table);\n\nCREATE INDEX IF NOT EXISTS idx_migration_sources_run\n  ON migration_sources(last_run_id, source_path);\n\nCREATE TABLE IF NOT EXISTS backup_runs (\n  id TEXT NOT NULL PRIMARY KEY,\n  created_at INTEGER NOT NULL,\n  archive_path TEXT NOT NULL,\n  status TEXT NOT NULL,\n  manifest_json TEXT NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_backup_runs_created\n  ON backup_runs(created_at DESC, id);\n\nCREATE TABLE IF NOT EXISTS worktrees (\n  id TEXT NOT NULL PRIMARY KEY,\n  repo_fingerprint TEXT NOT NULL,\n  repo_root TEXT NOT NULL,\n  path TEXT NOT NULL,\n  branch TEXT NOT NULL,\n  base_ref TEXT NOT NULL,\n  owner_kind TEXT NOT NULL CHECK (owner_kind IN ('manual', 'workboard', 'session')),\n  owner_id TEXT,\n  snapshot_ref TEXT,\n  provisioned_paths_json TEXT,\n  created_at INTEGER NOT NULL,\n  last_active_at INTEGER NOT NULL,\n  removed_at INTEGER,\n  run_end_cleanup_json TEXT,\n  gc_protection_json TEXT\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_worktrees_repo_fingerprint\n  ON worktrees(repo_fingerprint);\n\nCREATE INDEX IF NOT EXISTS idx_worktrees_removed_at\n  ON worktrees(removed_at);\n\nCREATE TABLE IF NOT EXISTS worktree_provisioned_file_chunks (\n  worktree_id TEXT NOT NULL,\n  path TEXT NOT NULL,\n  chunk_index INTEGER NOT NULL CHECK (chunk_index >= 0),\n  data BLOB NOT NULL,\n  PRIMARY KEY (worktree_id, path, chunk_index)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS worktree_templates (\n  cache_key TEXT NOT NULL PRIMARY KEY,\n  id TEXT NOT NULL UNIQUE,\n  repo_root TEXT NOT NULL,\n  common_dir TEXT NOT NULL,\n  worktree_root TEXT NOT NULL,\n  path TEXT NOT NULL,\n  backend TEXT NOT NULL,\n  source_commit TEXT NOT NULL,\n  content_key TEXT NOT NULL,\n  status TEXT NOT NULL CHECK (status IN ('preparing', 'ready')),\n  created_at INTEGER NOT NULL,\n  last_used_at INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS projects (\n  id TEXT NOT NULL PRIMARY KEY,\n  display_name TEXT NOT NULL,\n  repo_root TEXT NOT NULL,\n  origin_url TEXT,\n  source TEXT NOT NULL CHECK (source IN ('registered', 'cloned')),\n  created_at_ms INT NOT NULL,\n  updated_at_ms INT NOT NULL\n) STRICT;\n\n-- One explicitly retained, normalized private background per durable profile.\nCREATE TABLE IF NOT EXISTS user_background_images (\n  profile_id TEXT NOT NULL PRIMARY KEY REFERENCES user_profiles(id) ON DELETE CASCADE,\n  asset_id TEXT NOT NULL UNIQUE,\n  image BLOB NOT NULL CHECK (length(image) BETWEEN 1 AND 2097152),\n  width INTEGER NOT NULL CHECK (width BETWEEN 1 AND 2560),\n  height INTEGER NOT NULL CHECK (height BETWEEN 1 AND 2560)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS user_preferences (\n  profile_id TEXT NOT NULL,\n  pref_key TEXT NOT NULL,\n  value_json TEXT NOT NULL,\n  updated_at_ms INT NOT NULL,\n  PRIMARY KEY (profile_id, pref_key)\n) STRICT;\n\n-- Gateway-owned custom session group catalog (names + display order).\n-- Membership stays on each session entry's category field; this table only\n-- owns which groups exist and how operator UIs order them.\nCREATE TABLE IF NOT EXISTS session_groups (\n  name TEXT NOT NULL PRIMARY KEY,\n  position INTEGER NOT NULL,\n  created_at INTEGER NOT NULL,\n  cwd TEXT,\n  worktree INTEGER\n) STRICT;\n\n-- Gateway-owned durable cloud worker lifecycle. Provider-specific execution\n-- stays in plugins; this table records only core reconciliation facts.\nCREATE TABLE IF NOT EXISTS worker_environments (\n  environment_id TEXT NOT NULL PRIMARY KEY,\n  provider_id TEXT NOT NULL,\n  profile_id TEXT NOT NULL,\n  profile_snapshot_json TEXT NOT NULL,\n  last_activated_at_ms INTEGER,\n  preparation_key TEXT,\n  preparation_purpose TEXT,\n  preparation_demand_at_ms INTEGER,\n  preparation_expires_at_ms INTEGER,\n  preparation_consumed_at_ms INTEGER CHECK (\n    (preparation_key IS NULL AND preparation_demand_at_ms IS NULL\n      AND preparation_expires_at_ms IS NULL AND preparation_consumed_at_ms IS NULL)\n    OR\n    (preparation_key IS NOT NULL AND length(preparation_key) = 64\n      AND preparation_key NOT GLOB '*[^0-9a-f]*'\n      AND preparation_demand_at_ms IS NOT NULL\n      AND preparation_demand_at_ms BETWEEN 0 AND 9007199254740991\n      AND preparation_expires_at_ms IS NOT NULL\n      AND preparation_expires_at_ms > preparation_demand_at_ms\n      AND preparation_expires_at_ms <= 9007199254740991\n      AND (preparation_consumed_at_ms IS NULL\n        OR (preparation_consumed_at_ms >= preparation_demand_at_ms\n          AND preparation_consumed_at_ms < preparation_expires_at_ms)))\n  ),\n  provision_operation_id TEXT NOT NULL UNIQUE,\n  lease_id TEXT,\n  node_setup_id TEXT,\n  node_device_id TEXT,\n  ssh_host TEXT,\n  ssh_port INTEGER CHECK (ssh_port IS NULL OR (ssh_port >= 1 AND ssh_port <= 65535)),\n  ssh_user TEXT,\n  ssh_host_key TEXT,\n  ssh_key_ref_json TEXT,\n  desktop_json TEXT,\n  state TEXT NOT NULL CHECK (\n    state IN (\n      'requested',\n      'provisioning',\n      'bootstrapping',\n      'ready',\n      'attached',\n      'idle',\n      'draining',\n      'destroying',\n      'destroyed',\n      'failed',\n      'orphaned'\n    )\n  ),\n  bootstrap_bundle_hash TEXT,\n  bootstrap_openclaw_version TEXT,\n  bootstrap_protocol_features_json TEXT,\n  bootstrap_install_kind TEXT,\n  owner_epoch INTEGER NOT NULL DEFAULT 0 CHECK (owner_epoch >= 0),\n  teardown_terminal_state TEXT CHECK (teardown_terminal_state IN ('destroyed', 'failed')),\n  attached_session_ids_json TEXT NOT NULL DEFAULT '[]',\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  state_changed_at_ms INTEGER NOT NULL,\n  idle_since_at_ms INTEGER,\n  destroy_requested_at_ms INTEGER,\n  last_error TEXT,\n  shared_host INTEGER\n) STRICT;\n\nCREATE UNIQUE INDEX IF NOT EXISTS idx_worker_environments_provider_lease\n  ON worker_environments(provider_id, lease_id)\n  WHERE lease_id IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_worker_environments_terminal_changed\n  ON worker_environments(state_changed_at_ms, environment_id);\n\n-- A dedicated node registers its fixed build paths before ready, then binds\n-- them once. The environment belongs to the Gateway's separate database.\nCREATE TABLE IF NOT EXISTS node_worker_prepared_workspaces (\n  preparation_key TEXT NOT NULL PRIMARY KEY CHECK (\n    length(preparation_key) = 64 AND preparation_key NOT GLOB '*[^0-9a-f]*'\n  ),\n  cache_key TEXT NOT NULL CHECK (\n    length(cache_key) = 64 AND cache_key NOT GLOB '*[^0-9a-f]*'\n  ),\n  gateway_namespace TEXT NOT NULL CHECK (length(gateway_namespace) > 0),\n  workspace_dir TEXT NOT NULL UNIQUE CHECK (length(workspace_dir) > 0),\n  home_dir TEXT NOT NULL CHECK (length(home_dir) > 0),\n  source_manifest_ref TEXT NOT NULL CHECK (\n    length(source_manifest_ref) = 71 AND substr(source_manifest_ref, 1, 7) = 'sha256:'\n      AND substr(source_manifest_ref, 8) NOT GLOB '*[^0-9a-f]*'\n  ),\n  prepared_manifest_ref TEXT NOT NULL CHECK (\n    length(prepared_manifest_ref) = 71 AND substr(prepared_manifest_ref, 1, 7) = 'sha256:'\n      AND substr(prepared_manifest_ref, 8) NOT GLOB '*[^0-9a-f]*'\n  ),\n  state TEXT NOT NULL CHECK (state IN ('available', 'bound', 'retiring', 'retired')),\n  environment_id TEXT NOT NULL CHECK (length(environment_id) > 0),\n  session_id TEXT,\n  session_key TEXT,\n  owner_epoch INTEGER CHECK (owner_epoch BETWEEN 1 AND 9007199254740991),\n  created_at_ms INTEGER NOT NULL CHECK (created_at_ms BETWEEN 0 AND 9007199254740991),\n  bound_at_ms INTEGER CHECK (bound_at_ms BETWEEN created_at_ms AND 9007199254740991),\n  retired_at_ms INTEGER CHECK (\n    retired_at_ms BETWEEN coalesce(bound_at_ms, created_at_ms) AND 9007199254740991\n  ),\n  CHECK (\n    (session_id IS NULL AND session_key IS NULL AND owner_epoch IS NULL AND bound_at_ms IS NULL)\n    OR\n    (session_id IS NOT NULL AND length(session_id) > 0\n      AND session_key IS NOT NULL AND length(session_key) > 0\n      AND owner_epoch IS NOT NULL AND bound_at_ms IS NOT NULL)\n  ),\n  CHECK (\n    (state = 'available' AND bound_at_ms IS NULL AND retired_at_ms IS NULL)\n    OR (state = 'bound' AND bound_at_ms IS NOT NULL AND retired_at_ms IS NULL)\n    OR (state = 'retiring' AND retired_at_ms IS NULL)\n    OR (state = 'retired' AND retired_at_ms IS NOT NULL)\n  )\n) STRICT;\n\n-- Provider-advertised fallback ports preserve stable retry order separately\n-- from the downgrade-sensitive canonical worker environment row.\nCREATE TABLE IF NOT EXISTS worker_environment_ssh_fallback_ports (\n  environment_id TEXT NOT NULL,\n  position INTEGER NOT NULL CHECK (position >= 0 AND position <= 9),\n  port INTEGER NOT NULL CHECK (port >= 1 AND port <= 65535),\n  PRIMARY KEY (environment_id, position),\n  UNIQUE (environment_id, port),\n  FOREIGN KEY (environment_id) REFERENCES worker_environments(environment_id) ON DELETE CASCADE\n) STRICT;\n\n-- Logical sessions own repository intent and accepted artifact references,\n-- independently of the worker or rotating transcript session id.\nCREATE TABLE IF NOT EXISTS session_repository_workspaces (\n  workspace_id TEXT NOT NULL PRIMARY KEY CHECK (length(workspace_id) = 36),\n  agent_id TEXT NOT NULL CHECK (length(agent_id) BETWEEN 1 AND 128),\n  session_key TEXT NOT NULL CHECK (length(session_key) BETWEEN 1 AND 1024),\n  url TEXT NOT NULL CHECK (length(url) BETWEEN 1 AND 4096),\n  requested_ref TEXT CHECK (requested_ref IS NULL OR length(requested_ref) BETWEEN 1 AND 1024),\n  run_setup_script INTEGER NOT NULL DEFAULT 0 CHECK (run_setup_script IN (0, 1)),\n  base_commit TEXT CHECK (base_commit IS NULL OR length(base_commit) IN (40, 64)),\n  base_manifest_hash TEXT,\n  branch TEXT NOT NULL CHECK (length(branch) BETWEEN 1 AND 256),\n  checkpoint_ref TEXT,\n  manifest_hash TEXT,\n  revision INTEGER NOT NULL CHECK (revision >= 0),\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  UNIQUE (agent_id, session_key),\n  CHECK (base_manifest_hash IS NULL OR base_commit IS NOT NULL),\n  CHECK ((checkpoint_ref IS NULL AND manifest_hash IS NULL)\n    OR (checkpoint_ref IS NOT NULL AND manifest_hash IS NOT NULL AND base_manifest_hash IS NOT NULL))\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS github_repository_publication_requests (\n  request_id TEXT NOT NULL PRIMARY KEY,\n  owner_profile_id TEXT,\n  connection_generation TEXT,\n  idempotency_key TEXT NOT NULL,\n  request_digest TEXT NOT NULL,\n  session_id TEXT NOT NULL,\n  session_lifecycle_revision TEXT,\n  requester_authority_json TEXT,\n  session_key TEXT NOT NULL,\n  agent_id TEXT NOT NULL,\n  workspace_id TEXT NOT NULL,\n  checkpoint_ref TEXT,\n  checkpoint_digest TEXT,\n  claim_id TEXT,\n  run_id TEXT,\n  environment_id TEXT,\n  owner_epoch INTEGER,\n  placement_generation INTEGER,\n  identity_source TEXT NOT NULL CHECK (identity_source IN ('system-detected', 'system-configured', 'agent-override', 'personal')),\n  identity_profile_id TEXT,\n  identity_account_id INTEGER NOT NULL,\n  identity_login TEXT NOT NULL,\n  title TEXT,\n  body TEXT,\n  status TEXT NOT NULL CHECK (status IN ('requested', 'publishing', 'needs_confirmation', 'published', 'failed')),\n  gateway_instance_id TEXT,\n  execution_id TEXT,\n  last_effect TEXT CHECK (last_effect IN ('push', 'pull_request')),\n  effect_state TEXT CHECK (effect_state IN ('dispatched', 'observed')),\n  push_repository TEXT,\n  repository TEXT,\n  branch TEXT NOT NULL,\n  base_branch TEXT,\n  source_head_commit TEXT,\n  source_index_tree TEXT,\n  workspace_tree TEXT,\n  previous_head_commit TEXT,\n  pushed_head_commit TEXT,\n  head_commit TEXT,\n  pull_request_url TEXT,\n  error_code TEXT,\n  next_action TEXT,\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  reported_at_ms INTEGER,\n  CHECK ((identity_source = 'personal' AND owner_profile_id IS NOT NULL AND connection_generation IS NOT NULL)\n    OR (identity_source <> 'personal' AND owner_profile_id IS NULL AND connection_generation IS NULL)),\n  CHECK ((checkpoint_ref IS NULL AND checkpoint_digest IS NULL) OR (checkpoint_ref IS NOT NULL AND checkpoint_digest IS NOT NULL)),\n  CHECK ((last_effect IS NULL AND effect_state IS NULL) OR (last_effect IS NOT NULL AND effect_state IS NOT NULL))\n) STRICT;\nCREATE UNIQUE INDEX IF NOT EXISTS idx_github_repository_publication_shared_request\n  ON github_repository_publication_requests(session_id, idempotency_key) WHERE owner_profile_id IS NULL;\nCREATE UNIQUE INDEX IF NOT EXISTS idx_github_repository_publication_personal_request\n  ON github_repository_publication_requests(owner_profile_id, session_id, idempotency_key) WHERE owner_profile_id IS NOT NULL;\n\n-- Session placement lives in the shared state database so local admission,\n-- worker admission, and environment attachment use one durable authority.\nCREATE TABLE IF NOT EXISTS worker_session_placements (\n  session_id TEXT NOT NULL PRIMARY KEY,\n  agent_id TEXT NOT NULL,\n  session_key TEXT NOT NULL,\n  execution_mode TEXT CHECK (execution_mode IN ('worker-turn', 'remote-exec')),\n  state TEXT NOT NULL CHECK (\n    state IN (\n      'local',\n      'requested',\n      'provisioning',\n      'syncing',\n      'starting',\n      'active',\n      'draining',\n      'reconciling',\n      'reclaimed',\n      'failed'\n    )\n  ),\n  environment_id TEXT,\n  transition_generation INTEGER NOT NULL DEFAULT 0 CHECK (transition_generation >= 0),\n  active_owner_epoch INTEGER CHECK (active_owner_epoch IS NULL OR active_owner_epoch >= 1),\n  workspace_base_manifest_ref TEXT,\n  remote_workspace_dir TEXT,\n  worker_bundle_hash TEXT,\n  last_transcript_ack_cursor INTEGER CHECK (\n    last_transcript_ack_cursor IS NULL OR last_transcript_ack_cursor >= 0\n  ),\n  last_live_event_ack_cursor INTEGER CHECK (\n    last_live_event_ack_cursor IS NULL OR last_live_event_ack_cursor >= 0\n  ),\n  recovery_error TEXT,\n  turn_claim_owner TEXT CHECK (turn_claim_owner IN ('local', 'worker')),\n  turn_claim_id TEXT,\n  turn_claim_run_id TEXT,\n  turn_claim_generation INTEGER CHECK (\n    turn_claim_generation IS NULL OR turn_claim_generation >= 0\n  ),\n  turn_claim_owner_epoch INTEGER CHECK (\n    turn_claim_owner_epoch IS NULL OR turn_claim_owner_epoch >= 1\n  ),\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  state_changed_at_ms INTEGER NOT NULL,\n  terminal_reason TEXT,\n  terminal_at_ms INTEGER,\n  CHECK (\n    (state IN ('local', 'requested')\n      AND environment_id IS NULL AND active_owner_epoch IS NULL\n      AND workspace_base_manifest_ref IS NULL AND remote_workspace_dir IS NULL\n      AND worker_bundle_hash IS NULL\n      AND last_transcript_ack_cursor IS NULL AND last_live_event_ack_cursor IS NULL\n      AND recovery_error IS NULL)\n    OR\n    (state IS 'provisioning'\n      AND active_owner_epoch IS NULL\n      AND workspace_base_manifest_ref IS NULL AND remote_workspace_dir IS NULL\n      AND worker_bundle_hash IS NULL\n      AND last_transcript_ack_cursor IS NULL AND last_live_event_ack_cursor IS NULL\n      AND recovery_error IS NULL)\n    OR\n    (state IS 'syncing'\n      AND environment_id IS NOT NULL AND active_owner_epoch IS NULL\n      AND workspace_base_manifest_ref IS NULL AND remote_workspace_dir IS NULL\n      AND worker_bundle_hash IS NOT NULL\n      AND last_transcript_ack_cursor IS NULL AND last_live_event_ack_cursor IS NULL\n      AND recovery_error IS NULL)\n    OR\n    (state IS 'starting'\n      AND environment_id IS NOT NULL AND active_owner_epoch IS NULL\n      AND workspace_base_manifest_ref IS NOT NULL AND remote_workspace_dir IS NOT NULL\n      AND worker_bundle_hash IS NOT NULL\n      AND last_transcript_ack_cursor IS NULL AND last_live_event_ack_cursor IS NULL\n      AND recovery_error IS NULL)\n    OR\n    (state IN ('active', 'draining', 'reconciling')\n      AND environment_id IS NOT NULL AND active_owner_epoch IS NOT NULL\n      AND workspace_base_manifest_ref IS NOT NULL AND remote_workspace_dir IS NOT NULL\n      AND worker_bundle_hash IS NOT NULL AND recovery_error IS NULL)\n    OR\n    (state IS 'reclaimed'\n      AND environment_id IS NOT NULL AND active_owner_epoch IS NOT NULL\n      AND workspace_base_manifest_ref IS NOT NULL AND remote_workspace_dir IS NOT NULL\n      AND worker_bundle_hash IS NOT NULL AND recovery_error IS NULL\n      AND turn_claim_owner IS NULL AND turn_claim_id IS NULL AND turn_claim_run_id IS NULL\n      AND turn_claim_generation IS NULL AND turn_claim_owner_epoch IS NULL)\n    OR\n    (state IS 'failed' AND recovery_error IS NOT NULL)\n  ),\n  CHECK (\n    (turn_claim_owner IS NULL AND turn_claim_id IS NULL AND turn_claim_run_id IS NULL\n      AND turn_claim_generation IS NULL AND turn_claim_owner_epoch IS NULL)\n    OR\n    (turn_claim_owner IS 'local' AND turn_claim_id IS NOT NULL\n      AND turn_claim_run_id IS NOT NULL AND turn_claim_generation IS NOT NULL\n      AND turn_claim_owner_epoch IS NULL)\n    OR\n    (turn_claim_owner IS 'worker' AND turn_claim_id IS NOT NULL\n      AND turn_claim_run_id IS NOT NULL AND turn_claim_generation IS NOT NULL\n      AND turn_claim_owner_epoch IS NOT NULL)\n  ),\n  CHECK (\n    turn_claim_owner IS NULL\n    OR\n    (turn_claim_owner IS 'local' AND (\n      state IN ('local', 'requested', 'failed')\n      OR (state IN ('active', 'draining') AND execution_mode IS 'remote-exec')\n    ))\n    OR\n    (turn_claim_owner IS 'worker' AND state IN ('active', 'draining')\n      AND (execution_mode IS NULL OR execution_mode IS 'worker-turn')\n      AND turn_claim_owner_epoch IS active_owner_epoch)\n  )\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_worker_session_placements_session_key\n  ON worker_session_placements(agent_id, session_key);\n\nCREATE INDEX IF NOT EXISTS idx_worker_session_placements_reconcile\n  ON worker_session_placements(updated_at_ms, session_id);\n\nCREATE INDEX IF NOT EXISTS idx_worker_session_placements_environment\n  ON worker_session_placements(environment_id)\n  WHERE environment_id IS NOT NULL;\n\n-- Planned placement moves retain their exact source CAS and bounded target\n-- without widening the stable placement-state vocabulary. The opaque operation\n-- id fences stale asynchronous completion; it is correlation, never authority.\nCREATE TABLE IF NOT EXISTS worker_session_placement_moves (\n  operation_id TEXT NOT NULL PRIMARY KEY,\n  session_id TEXT NOT NULL UNIQUE\n    REFERENCES worker_session_placements(session_id) ON DELETE CASCADE,\n  source_generation INTEGER NOT NULL CHECK (source_generation >= 0),\n  source_environment_id TEXT NOT NULL CHECK (\n    length(source_environment_id) BETWEEN 1 AND 256\n    AND source_environment_id = trim(source_environment_id)\n  ),\n  source_owner_epoch INTEGER NOT NULL CHECK (source_owner_epoch >= 1),\n  target_kind TEXT NOT NULL CHECK (target_kind IN ('gateway', 'profile', 'device')),\n  target_id TEXT,\n  -- Keep these nullable columns constraint-free so lazy ALTER TABLE produces the\n  -- same shape as fresh databases; placement-move code validates their values.\n  target_machine_class TEXT,\n  target_os TEXT,\n  -- Explicit source abandonment is a durable operator decision. Keep the bit\n  -- bare and nullable so same-version older readers can safely omit it.\n  abandon_source INTEGER,\n  last_error TEXT,\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  CHECK (\n    (target_kind IS 'gateway' AND target_id IS NULL)\n    OR\n    (target_kind IN ('profile', 'device')\n      AND target_id IS NOT NULL\n      AND length(target_id) BETWEEN 1 AND 256\n      AND target_id = trim(target_id))\n  )\n) STRICT;\n\n-- Worker-visible session RPC authority is persisted against the exact turn\n-- claim. The launch descriptor is informative only; Gateway dispatch always\n-- revalidates this record and the live placement claim before executing.\nCREATE TABLE IF NOT EXISTS worker_turn_tool_authorities (\n  session_id TEXT NOT NULL PRIMARY KEY,\n  environment_id TEXT NOT NULL,\n  owner_epoch INTEGER NOT NULL CHECK (owner_epoch >= 1),\n  placement_generation INTEGER NOT NULL CHECK (placement_generation >= 0),\n  claim_id TEXT NOT NULL,\n  run_id TEXT NOT NULL,\n  tool_names_json TEXT NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  FOREIGN KEY (session_id) REFERENCES worker_session_placements(session_id) ON DELETE CASCADE\n) STRICT;\n\n-- Tool-call ids are idempotency keys only within one exact source turn claim.\n-- A running operation from another Gateway instance is ambiguous and is never\n-- replayed. A persisted random seed separates durable downstream identities\n-- from Gateway authentication keys and survives ordinary process restarts.\nCREATE TABLE IF NOT EXISTS worker_session_tool_operations (\n  source_session_id TEXT NOT NULL,\n  source_claim_id TEXT NOT NULL,\n  tool_call_id TEXT NOT NULL,\n  tool_name TEXT NOT NULL CHECK (tool_name IN ('sessions_spawn', 'sessions_send')),\n  request_digest TEXT NOT NULL,\n  operation_seed TEXT NOT NULL,\n  status TEXT NOT NULL CHECK (status IN ('running', 'succeeded', 'failed', 'unknown')),\n  child_session_key TEXT,\n  result_json TEXT,\n  gateway_instance_id TEXT NOT NULL,\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  PRIMARY KEY (source_session_id, source_claim_id, tool_call_id),\n  FOREIGN KEY (source_session_id)\n    REFERENCES worker_session_placements(session_id) ON DELETE CASCADE\n) STRICT;\n\n-- Local sandbox execution is a projection of a session-owned managed worktree.\n-- No cascade: an older binary must not discard pending edits with a session row.\nCREATE TABLE IF NOT EXISTS local_workspace_projections (\n  worktree_id TEXT NOT NULL PRIMARY KEY,\n  agent_id TEXT NOT NULL,\n  session_key TEXT NOT NULL,\n  session_id TEXT NOT NULL,\n  lifecycle_revision TEXT,\n  projection_path TEXT NOT NULL UNIQUE,\n  base_commit TEXT NOT NULL,\n  source_paths_json TEXT NOT NULL,\n  baseline_json TEXT,\n  baseline_ref TEXT,\n  pending_ref TEXT,\n  pending_target TEXT CHECK (pending_target IN ('canonical', 'projection')),\n  paused_runtimes_json TEXT,\n  journal_json TEXT,\n  journal_pack BLOB CHECK (journal_pack IS NULL OR length(journal_pack) <= 268435456),\n  revision INTEGER NOT NULL DEFAULT 0 CHECK (revision >= 0),\n  created_at_ms INTEGER NOT NULL,\n  CHECK ((baseline_json IS NULL) = (baseline_ref IS NULL)),\n  CHECK ((journal_json IS NULL) = (journal_pack IS NULL))\n) STRICT;\n\n-- A reconciliation journal is written before managed-worktree mutation. The\n-- bounded Git base snapshot repairs any subset left by an interrupted apply.\nCREATE TABLE IF NOT EXISTS worker_workspace_reconciliations (\n  session_id TEXT NOT NULL PRIMARY KEY,\n  environment_id TEXT NOT NULL,\n  owner_epoch INTEGER NOT NULL CHECK (owner_epoch >= 1),\n  placement_generation INTEGER NOT NULL CHECK (placement_generation >= 0),\n  base_manifest_ref TEXT NOT NULL,\n  current_manifest_ref TEXT NOT NULL,\n  plan_json TEXT NOT NULL,\n  base_pack BLOB NOT NULL CHECK (length(base_pack) <= 268435456),\n  created_at_ms INTEGER NOT NULL,\n  FOREIGN KEY (session_id) REFERENCES worker_session_placements(session_id) ON DELETE CASCADE\n) STRICT;\n\n-- A completed remote turn is fenced from stale-claim teardown until its\n-- workspace result is durably reconciled into the managed worktree.\nCREATE TABLE IF NOT EXISTS worker_workspace_pending_results (\n  session_id TEXT NOT NULL PRIMARY KEY,\n  environment_id TEXT NOT NULL,\n  owner_epoch INTEGER NOT NULL CHECK (owner_epoch >= 1),\n  placement_generation INTEGER NOT NULL CHECK (placement_generation >= 0),\n  claim_id TEXT NOT NULL,\n  run_id TEXT NOT NULL,\n  gateway_instance_id TEXT NOT NULL,\n  recovery_requested_at_ms INTEGER,\n  workspace_accepted_at_ms INTEGER,\n  staged_result_ref TEXT,\n  repository_workspace_id TEXT,\n  created_at_ms INTEGER NOT NULL,\n  FOREIGN KEY (session_id) REFERENCES worker_session_placements(session_id) ON DELETE CASCADE\n) STRICT;\n\n-- GitHub publication intent records the authoritative session worktree. Cloud\n-- requests execute only after the exact turn claim's result is accepted locally.\n-- Secrets stay in the effective Gateway-owned GitHub profile and never enter\n-- this row or the worker protocol.\nCREATE TABLE IF NOT EXISTS github_publication_requests (\n  request_id TEXT NOT NULL PRIMARY KEY,\n  idempotency_key TEXT NOT NULL,\n  request_digest TEXT NOT NULL,\n  session_id TEXT NOT NULL,\n  session_key TEXT NOT NULL,\n  agent_id TEXT NOT NULL,\n  worktree_id TEXT NOT NULL,\n  repository_fingerprint TEXT NOT NULL,\n  claim_id TEXT,\n  run_id TEXT,\n  environment_id TEXT,\n  owner_epoch INTEGER CHECK (owner_epoch IS NULL OR owner_epoch >= 1),\n  placement_generation INTEGER CHECK (\n    placement_generation IS NULL OR placement_generation >= 0\n  ),\n  identity_source TEXT NOT NULL CHECK (\n    identity_source IN ('system-detected', 'system-configured', 'agent-override')\n  ),\n  identity_profile_id TEXT,\n  identity_account_id INTEGER NOT NULL CHECK (identity_account_id >= 1),\n  identity_login TEXT NOT NULL,\n  title TEXT,\n  body TEXT,\n  status TEXT NOT NULL CHECK (\n    status IN ('requested', 'publishing', 'published', 'failed')\n  ),\n  gateway_instance_id TEXT,\n  repository TEXT,\n  branch TEXT NOT NULL,\n  base_branch TEXT,\n  source_head_commit TEXT,\n  source_index_tree TEXT,\n  workspace_tree TEXT,\n  head_commit TEXT,\n  pull_request_url TEXT,\n  error_code TEXT,\n  next_action TEXT,\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  reported_at_ms INTEGER,\n  UNIQUE (session_id, idempotency_key),\n  CHECK (\n    (claim_id IS NULL AND run_id IS NULL AND environment_id IS NULL\n      AND owner_epoch IS NULL AND placement_generation IS NULL)\n    OR\n    (claim_id IS NOT NULL AND run_id IS NOT NULL AND placement_generation IS NOT NULL\n      AND ((environment_id IS NULL AND owner_epoch IS NULL)\n        OR (environment_id IS NOT NULL AND owner_epoch IS NOT NULL)))\n  ),\n  CHECK (\n    (identity_source IS 'system-detected' AND identity_profile_id IS NULL)\n    OR\n    (identity_source IN ('system-configured', 'agent-override')\n      AND identity_profile_id IS NOT NULL)\n  ),\n  CHECK (\n    (source_head_commit IS NULL AND source_index_tree IS NULL AND workspace_tree IS NULL)\n    OR\n    (source_head_commit IS NOT NULL AND workspace_tree IS NOT NULL)\n  ),\n  CHECK (\n    (status IS 'published' AND pull_request_url IS NOT NULL AND error_code IS NULL\n      AND next_action IS NULL)\n    OR\n    (status IS 'failed' AND pull_request_url IS NULL AND error_code IS NOT NULL\n      AND next_action IS NOT NULL)\n    OR\n    (status IN ('requested', 'publishing') AND pull_request_url IS NULL\n      AND error_code IS NULL AND next_action IS NULL)\n  )\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_github_publication_requests_pending\n  ON github_publication_requests(status, updated_at_ms, request_id);\n\n-- Personal requests cannot be interpreted or resumed by older shared publishers.\nCREATE TABLE IF NOT EXISTS github_personal_publication_requests (\n  request_id TEXT NOT NULL PRIMARY KEY CHECK (length(request_id) = 36),\n  owner_profile_id TEXT NOT NULL CHECK (length(owner_profile_id) BETWEEN 1 AND 128),\n  connection_generation TEXT NOT NULL CHECK (length(connection_generation) = 36),\n  idempotency_key TEXT NOT NULL CHECK (length(idempotency_key) BETWEEN 1 AND 128),\n  request_digest TEXT NOT NULL CHECK (length(request_digest) = 64),\n  session_id TEXT NOT NULL CHECK (length(session_id) BETWEEN 1 AND 128),\n  session_key TEXT NOT NULL CHECK (length(session_key) BETWEEN 1 AND 1024),\n  agent_id TEXT NOT NULL CHECK (length(agent_id) BETWEEN 1 AND 128),\n  worktree_id TEXT NOT NULL CHECK (length(worktree_id) BETWEEN 1 AND 128),\n  repository_fingerprint TEXT NOT NULL CHECK (length(repository_fingerprint) BETWEEN 1 AND 256),\n  identity_source TEXT NOT NULL CHECK (identity_source = 'personal'),\n  identity_profile_id TEXT NOT NULL CHECK (length(identity_profile_id) = 36),\n  identity_account_id INTEGER NOT NULL CHECK (identity_account_id >= 1),\n  identity_login TEXT NOT NULL CHECK (length(identity_login) BETWEEN 1 AND 39),\n  title TEXT CHECK (title IS NULL OR length(title) BETWEEN 1 AND 256),\n  body TEXT CHECK (body IS NULL OR length(body) BETWEEN 1 AND 8192),\n  status TEXT NOT NULL CHECK (status IN ('requested', 'publishing', 'needs_confirmation', 'published', 'failed')),\n  gateway_instance_id TEXT CHECK (gateway_instance_id IS NULL OR length(gateway_instance_id) BETWEEN 1 AND 128),\n  execution_id TEXT CHECK (execution_id IS NULL OR length(execution_id) = 36),\n  last_effect TEXT CHECK (last_effect IS NULL OR last_effect IN ('push', 'pull_request')),\n  effect_state TEXT CHECK (effect_state IS NULL OR effect_state IN ('dispatched', 'observed')),\n  push_repository TEXT NOT NULL CHECK (length(push_repository) BETWEEN 3 AND 256),\n  repository TEXT NOT NULL CHECK (length(repository) BETWEEN 3 AND 256),\n  branch TEXT NOT NULL CHECK (length(branch) BETWEEN 1 AND 256),\n  base_branch TEXT NOT NULL CHECK (length(base_branch) BETWEEN 1 AND 256),\n  source_head_commit TEXT NOT NULL CHECK (length(source_head_commit) IN (40, 64)),\n  source_index_tree TEXT NOT NULL CHECK (length(source_index_tree) IN (40, 64)),\n  workspace_tree TEXT NOT NULL CHECK (length(workspace_tree) IN (40, 64)),\n  head_commit TEXT CHECK (head_commit IS NULL OR length(head_commit) IN (40, 64)),\n  pull_request_url TEXT CHECK (pull_request_url IS NULL OR length(pull_request_url) BETWEEN 1 AND 2048),\n  error_code TEXT CHECK (error_code IS NULL OR length(error_code) BETWEEN 1 AND 64),\n  next_action TEXT CHECK (next_action IS NULL OR length(next_action) BETWEEN 1 AND 1024),\n  created_at_ms INTEGER NOT NULL CHECK (created_at_ms >= 0),\n  updated_at_ms INTEGER NOT NULL CHECK (updated_at_ms >= created_at_ms),\n  reported_at_ms INTEGER,\n  UNIQUE (owner_profile_id, session_id, idempotency_key),\n  CHECK ((status = 'publishing' AND gateway_instance_id IS NOT NULL AND execution_id IS NOT NULL) OR status <> 'publishing'),\n  CHECK ((last_effect IS NULL AND effect_state IS NULL) OR (last_effect IS NOT NULL AND effect_state IS NOT NULL)),\n  CHECK ((status = 'published' AND pull_request_url IS NOT NULL AND head_commit IS NOT NULL AND error_code IS NULL AND next_action IS NULL)\n    OR (status = 'failed' AND error_code IS NOT NULL AND next_action IS NOT NULL)\n    OR (status IN ('requested', 'publishing', 'needs_confirmation') AND error_code IS NULL AND next_action IS NULL))\n) STRICT;\nCREATE INDEX IF NOT EXISTS idx_github_personal_publication_owner_session\n  ON github_personal_publication_requests(owner_profile_id, session_id, created_at_ms);\nCREATE INDEX IF NOT EXISTS idx_github_personal_publication_pending\n  ON github_personal_publication_requests(status, updated_at_ms, request_id);\n\n-- Older readers validate both local receipt tables exactly. Their immutable\n-- lifecycle binding stays in a first-use companion so those schemas remain readable.\nCREATE TABLE IF NOT EXISTS github_publication_session_lifecycles (\n  publication_kind TEXT NOT NULL CHECK (publication_kind IN ('shared', 'personal')),\n  request_id TEXT NOT NULL,\n  lifecycle_revision TEXT,\n  requester_authority_json TEXT,\n  PRIMARY KEY (publication_kind, request_id)\n) STRICT;\n\n-- One active, opaque admission credential per worker environment. Plaintext\n-- may be retried until delivery acknowledgement but never enters durable state.\nCREATE TABLE IF NOT EXISTS worker_environment_credentials (\n  environment_id TEXT NOT NULL PRIMARY KEY,\n  credential_hash TEXT NOT NULL UNIQUE,\n  bundle_hash TEXT NOT NULL,\n  session_id TEXT,\n  rpc_set_version INTEGER NOT NULL CHECK (rpc_set_version >= 1),\n  owner_epoch INTEGER NOT NULL CHECK (owner_epoch >= 0),\n  expires_at_ms INTEGER NOT NULL CHECK (expires_at_ms >= 0),\n  delivered_at_ms INTEGER CHECK (delivered_at_ms >= 0),\n  FOREIGN KEY (environment_id) REFERENCES worker_environments(environment_id) ON DELETE CASCADE\n) STRICT;\n\n-- One durable sequence cursor per attached session owner epoch. The environment\n-- binding prevents independent workers with coincident epochs from sharing replay state.\nCREATE TABLE IF NOT EXISTS worker_transcript_commit_heads (\n  session_id TEXT NOT NULL,\n  run_epoch INTEGER NOT NULL CHECK (run_epoch >= 0),\n  environment_id TEXT NOT NULL,\n  next_seq INTEGER NOT NULL CHECK (next_seq >= 1),\n  updated_at_ms INTEGER NOT NULL CHECK (updated_at_ms >= 0),\n  PRIMARY KEY (session_id, run_epoch)\n) STRICT;\n\n-- Pending rows preserve a claimed request across gateway restarts. Terminal rows\n-- cache the exact result returned for deterministic at-least-once replay.\nCREATE TABLE IF NOT EXISTS worker_transcript_commits (\n  session_id TEXT NOT NULL,\n  run_epoch INTEGER NOT NULL CHECK (run_epoch >= 0),\n  seq INTEGER NOT NULL CHECK (seq >= 1),\n  request_hash TEXT NOT NULL,\n  state TEXT NOT NULL CHECK (state IN ('pending', 'terminal')),\n  result_json TEXT,\n  created_at_ms INTEGER NOT NULL CHECK (created_at_ms >= 0),\n  updated_at_ms INTEGER NOT NULL CHECK (updated_at_ms >= 0),\n  PRIMARY KEY (session_id, run_epoch, seq),\n  FOREIGN KEY (session_id, run_epoch)\n    REFERENCES worker_transcript_commit_heads(session_id, run_epoch)\n    ON DELETE CASCADE,\n  CHECK (\n    (state = 'pending' AND result_json IS NULL) OR\n    (state = 'terminal' AND result_json IS NOT NULL)\n  )\n) STRICT;\n\n-- Pending rows preserve a claimed inference turn across gateway restarts.\n-- Terminal rows cache the exact outcome returned for deterministic replay.\nCREATE TABLE IF NOT EXISTS worker_inference_turns (\n  session_id TEXT NOT NULL,\n  run_epoch INTEGER NOT NULL CHECK (run_epoch >= 0),\n  run_id TEXT NOT NULL,\n  turn_id TEXT NOT NULL,\n  environment_id TEXT NOT NULL,\n  request_hash TEXT NOT NULL,\n  state TEXT NOT NULL CHECK (state IN ('pending', 'terminal')),\n  terminal_json TEXT,\n  created_at_ms INTEGER NOT NULL CHECK (created_at_ms >= 0),\n  updated_at_ms INTEGER NOT NULL CHECK (updated_at_ms >= 0),\n  PRIMARY KEY (session_id, run_epoch, run_id, turn_id),\n  FOREIGN KEY (environment_id) REFERENCES worker_environments(environment_id) ON DELETE CASCADE,\n  CHECK (\n    (state = 'pending' AND terminal_json IS NULL) OR\n    (state = 'terminal' AND terminal_json IS NOT NULL)\n  )\n) STRICT;\n\nCREATE UNIQUE INDEX IF NOT EXISTS idx_worker_inference_turns_pending_run\n  ON worker_inference_turns(session_id, run_epoch, run_id)\n  WHERE state = 'pending';\n\nCREATE TABLE IF NOT EXISTS claw_installs (\n  agent_id TEXT NOT NULL PRIMARY KEY,\n  schema_version TEXT NOT NULL,\n  source_kind TEXT NOT NULL,\n  claw_name TEXT NOT NULL,\n  claw_version TEXT NOT NULL,\n  package_root TEXT NOT NULL,\n  manifest_path TEXT NOT NULL,\n  integrity_kind TEXT NOT NULL,\n  integrity TEXT NOT NULL,\n  source_byte_length INTEGER NOT NULL,\n  manifest_schema_version INTEGER NOT NULL,\n  plan_integrity TEXT NOT NULL,\n  workspace TEXT NOT NULL UNIQUE,\n  agent_config_digest TEXT NOT NULL,\n  agent_owned_paths_json TEXT NOT NULL,\n  bootstrap_source_path TEXT,\n  bootstrap_content_digest TEXT,\n  status TEXT NOT NULL CHECK (\n    status IN ('pending', 'workspace_ready', 'config_committed', 'complete', 'partial')\n  ),\n  added_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS claw_workspace_files (\n  agent_id TEXT NOT NULL,\n  target_path TEXT NOT NULL,\n  schema_version TEXT NOT NULL,\n  workspace TEXT NOT NULL,\n  source_path TEXT NOT NULL,\n  content_digest TEXT NOT NULL,\n  status TEXT NOT NULL,\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  PRIMARY KEY (agent_id, target_path)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS claw_package_refs (\n  agent_id TEXT NOT NULL,\n  package_kind TEXT NOT NULL,\n  package_source TEXT NOT NULL,\n  package_ref TEXT NOT NULL,\n  package_version TEXT NOT NULL,\n  package_integrity TEXT NOT NULL,\n  schema_version TEXT NOT NULL,\n  claw_name TEXT NOT NULL,\n  package_status TEXT NOT NULL,\n  relationship TEXT NOT NULL CHECK (relationship IN ('managed', 'referenced')),\n  origin TEXT NOT NULL CHECK (origin IN ('claw-introduced', 'pre-existing')),\n  independent_owner INTEGER NOT NULL CHECK (independent_owner IN (0, 1)),\n  extension_id TEXT,\n  extension_format TEXT,\n  extension_detected_format TEXT,\n  extension_mapped_json TEXT,\n  extension_unavailable_json TEXT,\n  extension_adapter_identity TEXT,\n  installed_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  PRIMARY KEY (agent_id, package_kind, package_source, package_ref, package_version)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS claw_cron_refs (\n  agent_id TEXT NOT NULL,\n  manifest_id TEXT NOT NULL,\n  schema_version TEXT NOT NULL,\n  declaration_key TEXT NOT NULL UNIQUE,\n  scheduler_job_id TEXT UNIQUE,\n  status TEXT NOT NULL,\n  job_json TEXT NOT NULL,\n  error TEXT,\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  PRIMARY KEY (agent_id, manifest_id)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS claw_mcp_server_refs (\n  agent_id TEXT NOT NULL,\n  name TEXT NOT NULL,\n  schema_version TEXT NOT NULL,\n  config_digest TEXT NOT NULL,\n  relationship TEXT NOT NULL CHECK (relationship IN ('managed', 'referenced')),\n  origin TEXT NOT NULL CHECK (origin IN ('claw-introduced', 'pre-existing')),\n  independent_owner INTEGER NOT NULL DEFAULT 0 CHECK (independent_owner IN (0, 1)),\n  status TEXT NOT NULL,\n  error TEXT,\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  PRIMARY KEY (agent_id, name)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS user_profile_identities (\n  provider TEXT NOT NULL,\n  subject TEXT NOT NULL,\n  profile_id TEXT NOT NULL,\n  canonical_login TEXT,\n  created_at INTEGER NOT NULL,\n  authorization_id TEXT,\n  authorization_basis_json TEXT,\n  PRIMARY KEY (provider, subject)\n) STRICT;\nCREATE INDEX IF NOT EXISTS idx_user_profile_identities_profile_id\n  ON user_profile_identities(profile_id);\nCREATE UNIQUE INDEX IF NOT EXISTS idx_user_profile_identities_authorization\n  ON user_profile_identities(authorization_id);\n\nCREATE TABLE IF NOT EXISTS outbound_media_provenance (\n  realpath TEXT NOT NULL PRIMARY KEY,\n  kind TEXT NOT NULL,\n  version INTEGER NOT NULL,\n  sha256 TEXT NOT NULL,\n  size_bytes INTEGER NOT NULL,\n  created_at_ms INTEGER NOT NULL\n) STRICT;\n\n-- scope_id is non-null because SQLite treats NULLs as distinct in unique indexes/PKs,\n-- which would allow duplicate team rows. This PK also avoids a rebuild for identity scope.\nCREATE TABLE IF NOT EXISTS secret_store_entries (\n  scope_kind TEXT NOT NULL CHECK (scope_kind IN ('team', 'identity')),\n  scope_id TEXT NOT NULL,\n  name TEXT NOT NULL,\n  value TEXT NOT NULL,\n  kind TEXT NOT NULL CHECK (kind IN ('secret', 'env')),\n  created_at_ms INTEGER NOT NULL CHECK (created_at_ms >= 0),\n  updated_at_ms INTEGER NOT NULL CHECK (updated_at_ms >= 0),\n  updated_by TEXT,\n  deleted_at_ms INTEGER,\n  allowed_hosts TEXT,\n  CHECK ((scope_kind = 'team' AND scope_id = '') OR (scope_kind = 'identity' AND length(scope_id) > 0)),\n  PRIMARY KEY (scope_kind, scope_id, name)\n) STRICT;\nCREATE INDEX IF NOT EXISTS secret_store_entries_live_idx\n  ON secret_store_entries (scope_kind, scope_id, name) WHERE deleted_at_ms IS NULL;\n", {
		...STATE_RUNTIME_SCHEMA_COMPATIBILITY,
		allowedMissingColumns: [...STATE_RUNTIME_SCHEMA_COMPATIBILITY.allowedMissingColumns ?? [], ...pending.flatMap((migration) => migration.columns)],
		allowedMissingIndexes: [...STATE_RUNTIME_SCHEMA_COMPATIBILITY.allowedMissingIndexes ?? [], ...indexes.map((index) => index.name)],
		excludedIndexes: [
			...STATE_RUNTIME_SCHEMA_COMPATIBILITY.excludedIndexes ?? [],
			"idx_acp_sessions_resume_agent",
			"idx_acp_sessions_resume_acpx"
		]
	}).length > 0)) return;
	const changes = [];
	for (const migration of pending) {
		migration.migrate(db, previousVersion);
		changes.push(migration.applied);
	}
	for (const index of indexes) if (tableExists(db, index.tableName)) {
		const create = index.unique ? "CREATE UNIQUE INDEX" : "CREATE INDEX";
		db.exec(`${create} IF NOT EXISTS ${index.name} ${index.definition};`);
	}
	return changes;
}
function runStateSchemaMigrationTransaction(db, pathname, migrate, transactionOptions, prepareSchema) {
	const foreignKeysWereEnabled = Number(db.prepare("PRAGMA foreign_keys").get()?.foreign_keys) === 1;
	if (foreignKeysWereEnabled) db.exec("PRAGMA foreign_keys = OFF;");
	try {
		return runSqliteImmediateTransactionSync(db, () => {
			prepareSchema?.();
			const publishedVersion = readSqliteUserVersion(db);
			const blocker = publishedVersion < 22 ? readStateSchemaPublicationBlocker(db) : void 0;
			if (!blocker) return migrate();
			try {
				if (!tableExists(db, "config_machine_state")) throw new Error("Shared state schema publication requires config_machine_state.");
				return migrate();
			} catch (cause) {
				if (cause instanceof OpenClawStateOwnershipError) throw cause;
				throw new UpdateSchemaRefusalError([{
					kind: "state",
					path: pathname,
					foundVersion: publishedVersion,
					supportedVersion: 22
				}], blocker.updaterVersion, {
					targetVersion: VERSION,
					cause
				});
			}
		}, transactionOptions);
	} finally {
		if (foreignKeysWereEnabled && db.isOpen) db.exec("PRAGMA foreign_keys = ON;");
	}
}
function writeCurrentStateSchemaMetadata(db, now) {
	const kysely = getNodeSqliteKysely(db);
	const schemaVersion = resolveStateSchemaVersionToPublish(db);
	db.exec(`PRAGMA user_version = ${schemaVersion};`);
	publishStateSchemaVersionAdmission(db, {
		userVersion: schemaVersion,
		contentVersion: 22
	});
	executeSqliteQuerySync(db, kysely.insertInto("schema_meta").values({
		meta_key: "primary",
		role: "global",
		schema_version: schemaVersion,
		agent_id: null,
		app_version: VERSION,
		created_at: now,
		updated_at: now
	}).onConflict((conflict) => conflict.column("meta_key").doUpdateSet({
		role: "global",
		schema_version: schemaVersion,
		agent_id: null,
		app_version: VERSION,
		updated_at: now
	}).where((eb) => eb.or([
		eb("schema_meta.schema_version", "!=", schemaVersion),
		eb("schema_meta.app_version", "is not", VERSION),
		eb("schema_meta.role", "!=", "global")
	]))));
}
function executeCanonicalStateSchema(database, options) {
	database.exec(getOpenClawStateRuntimeSchema({
		...options,
		includeAgentDeletionJournal: options.includeAgentDeletionJournal ?? tableExists(database, "agent_deletion_journal")
	}));
}
//#endregion
//#region src/state/openclaw-state-db-audit-migration.ts
const AUDIT_EVENT_STATE_SCHEMA_VERSION = 2;
const CANONICAL_AUDIT_TABLES = ["audit_events", "audit_identity_keys"].map((name) => ({
	name,
	sql: normalizeSchemaSql(extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL, name))
}));
const AUDIT_EVENT_LEGACY_COLUMNS = [
	"sequence",
	"event_id",
	"source_id",
	"source_sequence",
	"occurred_at",
	"kind",
	"action",
	"status",
	"error_code",
	"actor_type",
	"actor_id",
	"agent_id",
	"session_key",
	"session_id",
	"run_id",
	"tool_call_id",
	"tool_name"
];
const AUDIT_EVENT_MIGRATED_COLUMNS = AUDIT_EVENT_LEGACY_COLUMNS.flatMap((column) => column === "source_id" ? [column, "schema_version"] : [column]);
const AUDIT_EVENT_V2_COLUMNS = [
	...AUDIT_EVENT_MIGRATED_COLUMNS,
	"direction",
	"channel",
	"conversation_kind",
	"message_outcome",
	"reason_code",
	"delivery_kind",
	"failure_stage",
	"duration_ms",
	"result_count",
	"account_ref",
	"conversation_ref",
	"message_ref",
	"target_ref"
];
function tableColumnInfo(db, tableName) {
	return db.prepare(`PRAGMA table_info(${tableName})`).all();
}
function tableHasExactColumns(db, tableName, expected) {
	const names = tableColumnInfo(db, tableName).map((column) => column.name);
	return names.length === expected.length && names.every((name, index) => name === expected[index]);
}
function tableHasRequiredColumns(db, tableName, required) {
	const columns = new Map(tableColumnInfo(db, tableName).map((column) => [column.name, column]));
	return required.every((name) => Number(columns.get(name)?.notnull ?? 0) === 1);
}
function tableSql(db, tableName) {
	const row = db.prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = ?").get(tableName);
	return typeof row?.sql === "string" ? row.sql : void 0;
}
function tableHasUniqueColumn(db, tableName, columnName) {
	return db.prepare(`PRAGMA index_list(${tableName})`).all().some((index) => {
		if (Number(index.unique ?? 0) !== 1 || typeof index.name !== "string") return false;
		const escaped = index.name.replaceAll("'", "''");
		const columns = db.prepare(`PRAGMA index_info('${escaped}')`).all();
		return columns.length === 1 && columns[0]?.name === columnName;
	});
}
function hasCanonicalAuditEventTable(db, expectedColumns, requiredColumns) {
	const sql = tableSql(db, "audit_events")?.toLowerCase();
	return tableHasExactColumns(db, "audit_events", expectedColumns) && tablePrimaryKeyColumns(db, "audit_events").join(",") === "sequence" && tableHasRequiredColumns(db, "audit_events", requiredColumns) && typeof sql === "string" && /\bsequence\s+integer\s+primary\s+key\s+autoincrement\b/.test(sql) && tableHasUniqueColumn(db, "audit_events", "event_id") && tableHasUniqueColumn(db, "audit_events", "source_id");
}
function hasCanonicalAuditIdentityKeyTable(db) {
	if (!tableExists(db, "audit_identity_keys")) return false;
	const sql = tableSql(db, "audit_identity_keys")?.toLowerCase();
	return tableHasExactColumns(db, "audit_identity_keys", [
		"id",
		"key_id",
		"key",
		"created_at"
	]) && tablePrimaryKeyColumns(db, "audit_identity_keys").join(",") === "id" && tableHasRequiredColumns(db, "audit_identity_keys", [
		"id",
		"key_id",
		"key",
		"created_at"
	]) && typeof sql === "string" && /\bcheck\s*\(\s*id\s*=\s*1\s*\)/.test(sql);
}
function hasCanonicalAuditEventsSchema(db) {
	const schema = getAdmittedSqliteSchemaFacts(db);
	if (schema && CANONICAL_AUDIT_TABLES.every(({ name, sql }) => normalizeSchemaSql(schema.tableSql.get(name) ?? null) === sql)) return true;
	if (!tableExists(db, "audit_events")) return readSqliteUserVersion(db) < AUDIT_EVENT_STATE_SCHEMA_VERSION && !tableExists(db, "audit_identity_keys");
	return hasCanonicalAuditEventTable(db, AUDIT_EVENT_V2_COLUMNS, [
		"event_id",
		"source_id",
		"schema_version",
		"source_sequence",
		"occurred_at",
		"kind",
		"action",
		"status",
		"actor_type",
		"actor_id"
	]) && hasCanonicalAuditIdentityKeyTable(db);
}
function canRepairLegacyAuditEventsSchema(db) {
	if (!tableExists(db, "audit_events") || tableExists(db, "audit_events_migration_new") || tableHasColumn(db, "audit_events", "schema_version")) return false;
	return (!tableExists(db, "audit_identity_keys") || hasCanonicalAuditIdentityKeyTable(db)) && hasCanonicalAuditEventTable(db, AUDIT_EVENT_LEGACY_COLUMNS, [
		"event_id",
		"source_id",
		"source_sequence",
		"occurred_at",
		"kind",
		"action",
		"status",
		"actor_type",
		"actor_id",
		"agent_id",
		"run_id"
	]);
}
function readAuditEventSequenceHighWater(db) {
	if (!tableExists(db, "sqlite_sequence")) return;
	const row = db.prepare("SELECT CAST(seq AS TEXT) AS seq FROM sqlite_sequence WHERE name = 'audit_events'").get();
	if (row === void 0) return;
	if (typeof row.seq !== "string" || !/^\d+$/.test(row.seq)) throw new Error("audit event sequence high-water mark is invalid");
	const sequence = BigInt(row.seq);
	if (sequence > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error("audit event sequence high-water mark exceeds the supported integer range");
	return Number(sequence);
}
function restoreAuditEventSequenceHighWater(db, sequence) {
	if (sequence === void 0) return;
	db.prepare("DELETE FROM sqlite_sequence WHERE name = 'audit_events'").run();
	db.prepare("INSERT INTO sqlite_sequence (name, seq) VALUES ('audit_events', ?)").run(sequence);
}
function repairAuditEventsSchema(db) {
	if (hasCanonicalAuditEventsSchema(db) || !canRepairLegacyAuditEventsSchema(db)) return false;
	const sequenceHighWater = readAuditEventSequenceHighWater(db);
	db.exec(`
    CREATE TABLE audit_events_migration_new (
      sequence INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id TEXT NOT NULL UNIQUE,
      source_id TEXT NOT NULL UNIQUE,
      schema_version INTEGER NOT NULL DEFAULT 1,
      source_sequence INTEGER NOT NULL,
      occurred_at INTEGER NOT NULL,
      kind TEXT NOT NULL,
      action TEXT NOT NULL,
      status TEXT NOT NULL,
      error_code TEXT,
      actor_type TEXT NOT NULL,
      actor_id TEXT NOT NULL,
      agent_id TEXT,
      session_key TEXT,
      session_id TEXT,
      run_id TEXT,
      tool_call_id TEXT,
      tool_name TEXT,
      direction TEXT,
      channel TEXT,
      conversation_kind TEXT,
      message_outcome TEXT,
      reason_code TEXT,
      delivery_kind TEXT,
      failure_stage TEXT,
      duration_ms INTEGER,
      result_count INTEGER,
      account_ref TEXT,
      conversation_ref TEXT,
      message_ref TEXT,
      target_ref TEXT
    );
    INSERT INTO audit_events_migration_new (${AUDIT_EVENT_MIGRATED_COLUMNS.join(", ")})
    SELECT ${AUDIT_EVENT_MIGRATED_COLUMNS.map((column) => column === "schema_version" ? "1" : column).join(", ")}
    FROM audit_events;
    DROP TABLE audit_events;
    ALTER TABLE audit_events_migration_new RENAME TO audit_events;
    CREATE INDEX idx_audit_events_time
      ON audit_events(occurred_at DESC, sequence DESC);
    CREATE INDEX idx_audit_events_agent_sequence
      ON audit_events(agent_id, sequence DESC);
    CREATE INDEX idx_audit_events_session_sequence
      ON audit_events(session_key, sequence DESC);
    CREATE INDEX idx_audit_events_run_sequence
      ON audit_events(run_id, sequence DESC);
    CREATE INDEX idx_audit_events_kind_sequence
      ON audit_events(kind, sequence DESC);
    CREATE INDEX idx_audit_events_status_sequence
      ON audit_events(status, sequence DESC);
    CREATE INDEX idx_audit_events_channel_sequence
      ON audit_events(channel, sequence DESC);
    CREATE INDEX idx_audit_events_direction_sequence
      ON audit_events(direction, sequence DESC);
    CREATE TABLE IF NOT EXISTS audit_identity_keys (
      id INTEGER NOT NULL PRIMARY KEY CHECK (id = 1),
      key_id TEXT NOT NULL,
      key BLOB NOT NULL,
      created_at INTEGER NOT NULL
    );
  `);
	restoreAuditEventSequenceHighWater(db, sequenceHighWater);
	return true;
}
//#endregion
//#region src/state/openclaw-state-db-schema-v12-foldin.ts
const FOLDED_SINGLETON_STATE_TABLES_V12 = [
	"skill_curator_state",
	"update_check_state",
	"clawhub_promotions_feed_state",
	"model_catalog_remote",
	"voicewake_triggers",
	"voicewake_routing_routes",
	"voicewake_routing_config",
	"onboarding_recommendations",
	"cron_store_epochs",
	"tui_last_sessions",
	"sidebar_sections",
	"node_host_config",
	"web_push_vapid_keys"
];
/** Preserve the table's original catalog SQL for fresh creation and historical migration. */
function createStateConfigMachineTable(db) {
	db.exec(`
    CREATE TABLE IF NOT EXISTS config_machine_state (
      state_key TEXT NOT NULL PRIMARY KEY,
      value_json TEXT NOT NULL,
      updated_at_ms INTEGER NOT NULL
    ) STRICT;
  `);
}
function migrateSingletonStateFoldInV12(db, previousVersion) {
	if (previousVersion >= 12) return false;
	createStateConfigMachineTable(db);
	const importState = db.prepare("INSERT INTO config_machine_state (state_key, value_json, updated_at_ms) VALUES (?, ?, ?) ON CONFLICT(state_key) DO NOTHING");
	if (tableExists(db, "update_check_state")) {
		const row = db.prepare("SELECT * FROM update_check_state WHERE state_key = 'default'").get();
		if (row) importState.run("update.checkState", JSON.stringify({
			lastCheckedAt: row.last_checked_at ?? void 0,
			lastNotifiedVersion: row.last_notified_version ?? void 0,
			lastNotifiedTag: row.last_notified_tag ?? void 0,
			lastAvailableVersion: row.last_available_version ?? void 0,
			lastAvailableTag: row.last_available_tag ?? void 0,
			autoInstallId: row.auto_install_id ?? void 0,
			autoFirstSeenVersion: row.auto_first_seen_version ?? void 0,
			autoFirstSeenTag: row.auto_first_seen_tag ?? void 0,
			autoFirstSeenAt: row.auto_first_seen_at ?? void 0,
			autoLastAttemptVersion: row.auto_last_attempt_version ?? void 0,
			autoLastAttemptAt: row.auto_last_attempt_at ?? void 0,
			autoLastSuccessVersion: row.auto_last_success_version ?? void 0,
			autoLastSuccessAt: row.auto_last_success_at ?? void 0
		}), Number(row.updated_at_ms));
	}
	if (tableExists(db, "voicewake_triggers")) {
		const rows = db.prepare("SELECT trigger, updated_at_ms FROM voicewake_triggers WHERE config_key = 'default' ORDER BY position").all();
		if (rows.length > 0) importState.run("voicewake.triggers", JSON.stringify(rows.map((row) => row.trigger)), Math.max(...rows.map((row) => Number(row.updated_at_ms))));
	}
	if (tableExists(db, "voicewake_routing_config")) {
		const config = db.prepare("SELECT * FROM voicewake_routing_config WHERE config_key = 'default'").get();
		if (config) {
			const routes = tableExists(db, "voicewake_routing_routes") ? db.prepare("SELECT trigger, target_mode, target_agent_id, target_session_key FROM voicewake_routing_routes WHERE config_key = 'default' ORDER BY position").all() : [];
			const targetFromColumns = (mode, agentId, sessionKey) => mode === "agent" && typeof agentId === "string" && agentId ? { agentId } : mode === "session" && typeof sessionKey === "string" && sessionKey ? { sessionKey } : { mode: "current" };
			importState.run("voicewake.routing", JSON.stringify({
				version: 1,
				defaultTarget: targetFromColumns(config.default_target_mode, config.default_target_agent_id, config.default_target_session_key),
				routes: routes.map((route) => ({
					trigger: route.trigger,
					target: targetFromColumns(route.target_mode, route.target_agent_id, route.target_session_key)
				})),
				updatedAtMs: config.updated_at_ms
			}), Number(config.updated_at_ms));
		}
	}
	if (tableExists(db, "onboarding_recommendations")) {
		const rows = db.prepare("SELECT * FROM onboarding_recommendations").all();
		for (const row of rows) importState.run(`onboarding.recommendations.${String(row.config_key)}`, JSON.stringify({
			inventoryHash: row.inventory_hash,
			matches: JSON.parse(String(row.matches_json)),
			offeredAt: row.offered_at_ms,
			acceptedAt: row.accepted_at_ms,
			updatedAt: row.updated_at_ms
		}), Number(row.updated_at_ms));
	}
	if (tableExists(db, "sidebar_sections")) {
		const sections = db.prepare("SELECT section_id FROM sidebar_sections ORDER BY position, section_id").all();
		if (sections.length > 0) importState.run("sidebar.sectionOrder", JSON.stringify(sections.map((section) => section.section_id)), Date.now());
	}
	if (tableExists(db, "node_host_config")) {
		const nodeHost = db.prepare("SELECT * FROM node_host_config WHERE config_key = 'current'").get();
		if (nodeHost) {
			const gateway = {
				host: nodeHost.gateway_host ?? void 0,
				port: nodeHost.gateway_port ?? void 0,
				tls: nodeHost.gateway_tls == null ? void 0 : nodeHost.gateway_tls === 1,
				tlsFingerprint: nodeHost.gateway_tls_fingerprint ?? void 0,
				contextPath: nodeHost.gateway_context_path ?? void 0,
				cloudflareAccess: nodeHost.gateway_cloudflare_access_json == null ? void 0 : JSON.parse(String(nodeHost.gateway_cloudflare_access_json))
			};
			importState.run("nodeHost.config", JSON.stringify({
				version: nodeHost.version,
				nodeId: nodeHost.node_id,
				...nodeHost.display_name == null ? {} : { displayName: nodeHost.display_name },
				gateway: Object.values(gateway).some((value) => value !== void 0) ? gateway : void 0,
				installedAppsSharing: nodeHost.installed_apps_sharing === 1
			}), Number(nodeHost.updated_at_ms));
		}
	}
	if (tableExists(db, "web_push_vapid_keys")) {
		const vapidKeys = db.prepare("SELECT * FROM web_push_vapid_keys WHERE key_id = 'default'").get();
		if (vapidKeys) importState.run("webPush.vapidKeys", JSON.stringify({
			publicKey: vapidKeys.public_key,
			privateKey: vapidKeys.private_key,
			subject: vapidKeys.subject
		}), Number(vapidKeys.updated_at_ms));
	}
	let dropped = false;
	for (const tableName of FOLDED_SINGLETON_STATE_TABLES_V12) if (tableExists(db, tableName)) {
		db.exec(`DROP TABLE IF EXISTS ${tableName};`);
		dropped = true;
	}
	return dropped;
}
//#endregion
//#region src/state/session-watch-cursor-provenance.ts
const SESSION_WATCH_PROVENANCE_EXPLICIT = "explicit";
const SESSION_WATCH_PROVENANCE_AMBIENT_GROUP = "ambient-group";
//#endregion
//#region src/state/openclaw-state-db-session-watch-migration.ts
const SESSION_WATCH_PROVENANCE_SCHEMA_VERSION = 4;
const LEGACY_AMBIENT_GROUP_WATCH_MARKER_PREFIX = "ambient-group-watch:";
const LEGACY_AMBIENT_GROUP_WATCH_MARKER_END = "ambient-group-watch;";
const SESSION_WATCH_PROVENANCE_COLUMN_SQL = `provenance TEXT NOT NULL DEFAULT '${SESSION_WATCH_PROVENANCE_EXPLICIT}' CHECK (provenance IN ('${SESSION_WATCH_PROVENANCE_EXPLICIT}', '${SESSION_WATCH_PROVENANCE_AMBIENT_GROUP}'))`;
function getSessionWatchCursorKysely(db) {
	return getNodeSqliteKysely(db);
}
function hasLegacyAmbientWatchSentinels(db) {
	return executeSqliteQueryTakeFirstSync(db, getSessionWatchCursorKysely(db).selectFrom("session_watch_cursors").select("watcher_session_key").where("watcher_session_key", ">=", LEGACY_AMBIENT_GROUP_WATCH_MARKER_PREFIX).where("watcher_session_key", "<", LEGACY_AMBIENT_GROUP_WATCH_MARKER_END).limit(1)) !== void 0;
}
function needsSessionWatchCursorProvenanceMigration(db, userVersion) {
	if (!tableExists(db, "session_watch_cursors")) return false;
	return userVersion < SESSION_WATCH_PROVENANCE_SCHEMA_VERSION || !tableHasColumn(db, "session_watch_cursors", "provenance") || hasLegacyAmbientWatchSentinels(db);
}
function decodeLegacyAmbientWatchMarkerKey(markerKey) {
	const encoded = markerKey.slice(20);
	if (!encoded || encoded.length % 2 !== 0 || !/^[0-9a-f]+$/.test(encoded)) return;
	try {
		return new TextDecoder("utf-8", {
			fatal: true,
			ignoreBOM: true
		}).decode(Buffer.from(encoded, "hex"));
	} catch {
		return;
	}
}
function migrateSessionWatchCursorProvenance(db) {
	if (!tableExists(db, "session_watch_cursors")) return {
		addedColumn: false,
		migratedAmbientWatches: 0,
		removedLegacySentinels: 0
	};
	const addedColumn = ensureColumn(db, "session_watch_cursors", SESSION_WATCH_PROVENANCE_COLUMN_SQL);
	const kysely = getSessionWatchCursorKysely(db);
	const legacyMarkers = executeSqliteQuerySync(db, kysely.selectFrom("session_watch_cursors").select([
		"watcher_session_key",
		"target_session_key",
		"updated_at"
	]).where("watcher_session_key", ">=", LEGACY_AMBIENT_GROUP_WATCH_MARKER_PREFIX).where("watcher_session_key", "<", LEGACY_AMBIENT_GROUP_WATCH_MARKER_END)).rows;
	let migratedAmbientWatches = 0;
	for (const marker of legacyMarkers) {
		const watcherSessionKey = decodeLegacyAmbientWatchMarkerKey(marker.watcher_session_key);
		if (watcherSessionKey) {
			const watch = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("session_watch_cursors").select("updated_at").where("watcher_session_key", "=", watcherSessionKey).where("target_session_key", "=", marker.target_session_key));
			if (watch) {
				const promoted = executeSqliteQuerySync(db, kysely.updateTable("session_watch_cursors").set({
					provenance: SESSION_WATCH_PROVENANCE_AMBIENT_GROUP,
					updated_at: Math.max(watch.updated_at, marker.updated_at)
				}).where("watcher_session_key", "=", watcherSessionKey).where("target_session_key", "=", marker.target_session_key));
				migratedAmbientWatches += Number(promoted.numAffectedRows ?? 0n);
			}
		}
		executeSqliteQuerySync(db, kysely.deleteFrom("session_watch_cursors").where("watcher_session_key", "=", marker.watcher_session_key).where("target_session_key", "=", marker.target_session_key));
	}
	return {
		addedColumn,
		migratedAmbientWatches,
		removedLegacySentinels: legacyMarkers.length
	};
}
//#endregion
//#region src/state/openclaw-state-db-table-retirements.ts
const stateDbLog = createSubsystemLogger("state/db");
const logRetiredStateTableMigration = (message) => stateDbLog.info(message);
const RETIRED_DEAD_STATE_TABLES_V10 = [
	"agent_model_catalogs",
	"android_notification_recent_packages",
	"command_log_entries",
	"diagnostic_stability_bundles",
	"media_blobs",
	"model_capability_cache"
];
const RETIRED_COMMITMENTS_COLUMNS_SQL = `
  id TEXT NOT NULL PRIMARY KEY,
  agent_id TEXT NOT NULL,
  session_key TEXT NOT NULL,
  channel TEXT NOT NULL,
  account_id TEXT,
  recipient_id TEXT,
  thread_id TEXT,
  sender_id TEXT,
  kind TEXT NOT NULL,
  sensitivity TEXT NOT NULL,
  source TEXT NOT NULL,
  status TEXT NOT NULL,
  reason TEXT NOT NULL,
  suggested_text TEXT NOT NULL,
  dedupe_key TEXT NOT NULL,
  confidence REAL NOT NULL,
  due_earliest_ms INTEGER NOT NULL,
  due_latest_ms INTEGER NOT NULL,
  due_timezone TEXT NOT NULL,
  source_message_id TEXT,
  source_run_id TEXT,
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  attempts INTEGER NOT NULL,
  last_attempt_at_ms INTEGER,
  sent_at_ms INTEGER,
  dismissed_at_ms INTEGER,
  snoozed_until_ms INTEGER,
  expired_at_ms INTEGER,
  record_json TEXT NOT NULL
`;
const RETIRED_COMMITMENTS_BASE_INDEXES_SQL = `CREATE INDEX idx_commitments_scope_due
  ON commitments(agent_id, session_key, status, due_earliest_ms, due_latest_ms);
CREATE INDEX idx_commitments_status_due
  ON commitments(status, due_earliest_ms, due_latest_ms);
CREATE INDEX idx_commitments_scope_dedupe
  ON commitments(agent_id, session_key, channel, dedupe_key, status);`;
const RETIRED_COMMITMENTS_SCHEMA_SQL = `
CREATE TABLE commitments (${RETIRED_COMMITMENTS_COLUMNS_SQL.slice(1, -1)}
) STRICT;
${RETIRED_COMMITMENTS_BASE_INDEXES_SQL}
CREATE INDEX idx_commitments_agent_due
  ON commitments(agent_id, status, due_earliest_ms, due_latest_ms, session_key);
CREATE INDEX idx_commitments_agent_sent
  ON commitments(agent_id, status, sent_at_ms, session_key);
`;
const SHIPPED_RETIRED_COMMITMENTS_SCHEMA_SQL = `
CREATE TABLE commitments (${RETIRED_COMMITMENTS_COLUMNS_SQL.slice(1, -1)}
);
${RETIRED_COMMITMENTS_BASE_INDEXES_SQL}
`;
const RETIRED_COMMITMENTS_ADDITIVE_COLUMNS = [
	"commitments.account_id",
	"commitments.recipient_id",
	"commitments.thread_id",
	"commitments.sender_id",
	"commitments.kind",
	"commitments.sensitivity",
	"commitments.source",
	"commitments.reason",
	"commitments.suggested_text",
	"commitments.dedupe_key",
	"commitments.confidence",
	"commitments.due_timezone",
	"commitments.source_message_id",
	"commitments.source_run_id",
	"commitments.created_at_ms",
	"commitments.attempts",
	"commitments.last_attempt_at_ms",
	"commitments.sent_at_ms",
	"commitments.dismissed_at_ms",
	"commitments.snoozed_until_ms",
	"commitments.expired_at_ms"
];
function deriveRetiredCommitmentsContract() {
	const indexFingerprints = new Map(getCanonicalSqliteNamedIndexContracts(RETIRED_COMMITMENTS_SCHEMA_SQL).map(({ fingerprint, name }) => [name, JSON.stringify(fingerprint)]));
	return {
		indexFingerprints,
		compatibility: {
			allowedColumnDefinitions: {
				"commitments.attempts": ["attempts INTEGER NOT NULL DEFAULT 0"],
				"commitments.confidence": ["confidence REAL NOT NULL DEFAULT 0"],
				"commitments.created_at_ms": ["created_at_ms INTEGER NOT NULL DEFAULT 0"],
				"commitments.dedupe_key": ["dedupe_key TEXT NOT NULL DEFAULT ''"],
				"commitments.due_timezone": ["due_timezone TEXT NOT NULL DEFAULT 'UTC'"],
				"commitments.kind": ["kind TEXT NOT NULL DEFAULT 'followup'"],
				"commitments.reason": ["reason TEXT NOT NULL DEFAULT ''"],
				"commitments.sensitivity": ["sensitivity TEXT NOT NULL DEFAULT 'normal'"],
				"commitments.source": ["source TEXT NOT NULL DEFAULT 'unknown'"],
				"commitments.suggested_text": ["suggested_text TEXT NOT NULL DEFAULT ''"]
			},
			allowedMissingColumns: RETIRED_COMMITMENTS_ADDITIVE_COLUMNS,
			allowedMissingIndexes: [...indexFingerprints.keys()]
		}
	};
}
function hasSupportedRetiredCommitmentsSchema(db, schemaSql, { compatibility, indexFingerprints }) {
	if (collectSqliteSchemaIssues(db, schemaSql, compatibility).length > 0) return false;
	return db.prepare(`SELECT type, name
           FROM sqlite_schema
          WHERE type IN ('index', 'trigger')
            AND tbl_name = 'commitments'
            AND sql IS NOT NULL
          ORDER BY type, name`).all().every((object) => object.type === "index" && JSON.stringify(collectSqliteNamedIndexContract(db, object.name)) === indexFingerprints.get(object.name));
}
function assertRecognizedRetiredCommitmentsSchema(db) {
	if (hasRecognizedRetiredCommitmentsSchema(db)) return;
	assertSqliteSchemaContains(db, "retired OpenClaw commitments schema", RETIRED_COMMITMENTS_SCHEMA_SQL, deriveRetiredCommitmentsContract().compatibility);
	throw new Error("Retired OpenClaw commitments schema has unsupported additional indexes; refusing destructive migration.");
}
function hasRecognizedRetiredCommitmentsSchema(db) {
	const contract = deriveRetiredCommitmentsContract();
	return hasSupportedRetiredCommitmentsSchema(db, RETIRED_COMMITMENTS_SCHEMA_SQL, contract) || hasSupportedRetiredCommitmentsSchema(db, SHIPPED_RETIRED_COMMITMENTS_SCHEMA_SQL, contract);
}
function assertNoRetiredCommitmentsForeignKeys(db) {
	const tables = db.prepare(`SELECT name
         FROM sqlite_schema
        WHERE type = 'table' AND name <> 'commitments'
        ORDER BY name`).all();
	for (const table of tables) if (db.prepare(`PRAGMA foreign_key_list(${quoteSqliteIdentifier(table.name)})`).all().some((foreignKey) => typeof foreignKey.table === "string" && foreignKey.table.toLowerCase() === "commitments")) throw new Error(`Retired OpenClaw commitments schema is referenced by table ${table.name}; refusing destructive migration.`);
}
function collectRetainedSchemaSql(db) {
	return new Map(db.prepare(`SELECT type, name, sql
             FROM sqlite_schema
            WHERE type IN ('trigger', 'view')
              AND tbl_name <> 'commitments'
              AND sql IS NOT NULL
            ORDER BY type, name`).all().map((object) => [`${object.type}:${object.name}`, object.sql]));
}
function assertNoRetiredCommitmentsSchemaDependencies(db) {
	const probeTable = "__openclaw_retired_commitments_probe";
	if (tableExists(db, probeTable)) throw new Error(`OpenClaw state database already contains ${probeTable}; refusing destructive migration.`);
	const before = collectRetainedSchemaSql(db);
	const savepoint = "openclaw_probe_commitments_dependencies";
	db.exec(`SAVEPOINT ${savepoint};`);
	let changedObject;
	try {
		db.exec(`ALTER TABLE commitments RENAME TO ${quoteSqliteIdentifier(probeTable)};`);
		const after = collectRetainedSchemaSql(db);
		changedObject = [...before].find(([object, sql]) => after.get(object) !== sql)?.[0];
	} catch (error) {
		db.exec(`ROLLBACK TO ${savepoint}; RELEASE ${savepoint};`);
		throw new Error("Could not prove retained SQLite views and triggers independent of commitments; refusing destructive migration.", { cause: error });
	}
	db.exec(`ROLLBACK TO ${savepoint}; RELEASE ${savepoint};`);
	if (changedObject) {
		const [type, name] = changedObject.split(":", 2);
		throw new Error(`Retired OpenClaw commitments schema is referenced by ${type} ${name}; refusing destructive migration.`);
	}
}
function assertVirtualTablesUsable(db, phase) {
	const virtualTables = db.prepare(`SELECT name
         FROM sqlite_schema
        WHERE type = 'table' AND lower(sql) LIKE 'create virtual table%'
        ORDER BY name`).all();
	for (const table of virtualTables) try {
		db.prepare(`SELECT * FROM ${quoteSqliteIdentifier(table.name)} LIMIT 1`).all();
	} catch (error) {
		throw new Error(`SQLite virtual table ${table.name} is unusable ${phase} commitments retirement.`, { cause: error });
	}
}
function migrateRetiredCommitmentsSchema(db, previousVersion) {
	if (previousVersion >= 7) return false;
	if (!tableExists(db, "commitments")) return false;
	assertRecognizedRetiredCommitmentsSchema(db);
	assertNoRetiredCommitmentsForeignKeys(db);
	assertNoRetiredCommitmentsSchemaDependencies(db);
	assertVirtualTablesUsable(db, "before");
	const savepoint = "openclaw_retire_commitments_v7";
	db.exec(`SAVEPOINT ${savepoint};`);
	try {
		db.exec("DROP TABLE commitments;");
		assertVirtualTablesUsable(db, "after");
		db.exec(`RELEASE ${savepoint};`);
		return true;
	} catch (error) {
		db.exec(`ROLLBACK TO ${savepoint}; RELEASE ${savepoint};`);
		throw error;
	}
}
function migrateRetiredDeadStateTablesV10(db, previousVersion) {
	if (previousVersion >= 10) return false;
	let dropped = false;
	for (const tableName of RETIRED_DEAD_STATE_TABLES_V10) if (tableExists(db, tableName)) {
		db.exec(`DROP TABLE IF EXISTS ${tableName};`);
		dropped = true;
	}
	return dropped;
}
const RETIRED_SKILL_CURATOR_TABLES_V11 = ["skill_lifecycle", "skill_workshop_proposal_origin_runs"];
function migrateRetiredSkillCuratorTablesV11(db, previousVersion) {
	if (previousVersion >= 11) return false;
	const retiredTables = RETIRED_SKILL_CURATOR_TABLES_V11.filter((table) => tableExists(db, table));
	if (retiredTables.length === 0) return false;
	if (retiredTables.includes("skill_lifecycle")) {
		const archivedCount = Number(db.prepare("SELECT COUNT(*) AS archived_count FROM skill_lifecycle WHERE state = 'archived'").get()?.archived_count);
		if (archivedCount > 0) stateDbLog.info(`${archivedCount} previously archived workshop skills are live again; archive any you no longer want`);
	}
	for (const table of retiredTables) db.exec(`DROP TABLE IF EXISTS ${table};`);
	return true;
}
const RETIRED_SKILL_WORKSHOP_PROPOSAL_TABLES = [
	"skill_workshop_proposal_events",
	"skill_workshop_proposal_rollbacks",
	"skill_workshop_collection_reviews",
	"skill_workshop_proposals"
];
/** Drops the retired proposal tables, children first, inside the caller's write transaction. */
function dropRetiredSkillWorkshopProposalTables(db) {
	const present = RETIRED_SKILL_WORKSHOP_PROPOSAL_TABLES.filter((table) => tableExists(db, table));
	if (present.length === 0) return false;
	const dependents = db.prepare(`SELECT type, name FROM sqlite_schema
        WHERE type IN ('index', 'trigger') AND sql IS NOT NULL
          AND tbl_name IN (${present.map(() => "?").join(", ")})`).all(...present);
	for (const { type, name } of dependents) if ((type === "index" || type === "trigger") && typeof name === "string") db.exec(`DROP ${type.toUpperCase()} IF EXISTS ${quoteSqliteIdentifier(name)};`);
	for (const table of present) db.exec(`DROP TABLE ${table};`);
	return true;
}
/**
* Runs every retired-table migration in schema order and names what it changed.
* Both the repair path and the ordinary open path go through here so the order
* and the operator-visible labels cannot drift apart.
*/
function runRetiredStateTableMigrations(db, previousVersion) {
	const applied = [];
	if (migrateRetiredCommitmentsSchema(db, previousVersion)) applied.push("Discarded retired shared-state commitments rows, table, and indexes");
	if (migrateRetiredDeadStateTablesV10(db, previousVersion)) applied.push("Retired six dead shared-state tables (v10)");
	if (migrateRetiredSkillCuratorTablesV11(db, previousVersion)) applied.push("Retired legacy skill curator lifecycle and proposal origin-run tables");
	return applied;
}
//#endregion
//#region src/state/openclaw-state-db-schema-repair.ts
/** Tables whose existing read contracts can change before this migration completes. */
const STATE_SCHEMA_MIGRATION_READ_TABLES = {
	"agent-databases-composite-primary-key": ["agent_databases"],
	"audit-events-v2": ["audit_events", "audit_identity_keys"],
	"commitments-retirement-v7": ["commitments"],
	"worker-placement-execution-mode-v8": ["worker_session_placements"],
	"agent-databases-relative-paths-v9": ["agent_databases"],
	"state-table-retirement-v10": RETIRED_DEAD_STATE_TABLES_V10,
	"state-table-retirement-v11": RETIRED_SKILL_CURATOR_TABLES_V11,
	"singleton-state-foldin-v12": ["config_machine_state", ...FOLDED_SINGLETON_STATE_TABLES_V12],
	"state-consolidation-v13": [
		"cron_jobs",
		"subagent_runs",
		"workspace_setup_state",
		"workspace_attestations",
		"workspace_generated_bootstrap_hashes",
		"auth_profile_stores",
		"auth_profile_state",
		"installed_plugin_index",
		"config_machine_state",
		"diagnostic_events"
	],
	"creator-namespace-v14": ["cron_jobs"],
	"conversation-binding-targets-v15": ["current_conversation_bindings"],
	"prepared-worker-ownership-v17": ["worker_environments"],
	"github-publication-requester-authority-v18": ["github_publication_session_lifecycles", "github_repository_publication_requests"],
	"portable-identity-columns-v22": ["acp_sessions", ...STATE_CURSOR_TABLES_V22],
	"predicate-columns-v21": [
		"meeting_transcript_sessions",
		"meeting_transcript_summaries",
		"delivery_queue_entries"
	],
	"operator-approvals-system-agent": ["operator_approvals"],
	"session-watch-cursor-provenance-v4": ["session_watch_cursors"],
	"strict-tables-v3": OPENCLAW_STATE_SCHEMA_SQL.split("\n").flatMap((line) => {
		const table = /^CREATE TABLE IF NOT EXISTS (\w+) \(/u.exec(line)?.[1];
		return table ? [table] : [];
	})
};
function dropLegacyStateTables(db) {
	const transientHistoryTable = ["database", "verifications"].join("_");
	db.exec(`DROP TABLE IF EXISTS ${transientHistoryTable};`);
	db.exec("DROP TABLE IF EXISTS node_pairing_pending; DROP TABLE IF EXISTS node_pairing_paired;");
}
function migrateWorkerPlacementExecutionModeSchema(db, previousVersion) {
	if (previousVersion >= 8 || !tableExists(db, "worker_session_placements")) return false;
	for (const definition of [
		"execution_mode TEXT",
		"terminal_reason TEXT",
		"terminal_at_ms INTEGER"
	]) ensureColumn(db, "worker_session_placements", definition);
	const placementSchema = extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL, "worker_session_placements", { errorMessage: "Canonical worker placement schema block is missing" });
	const canonical = openNodeSqliteDatabase(":memory:");
	let canonicalColumns;
	try {
		canonical.exec(placementSchema);
		canonicalColumns = canonical.prepare("PRAGMA table_xinfo(worker_session_placements)").all().filter((column) => column.hidden === 0).map((column) => column.name);
	} finally {
		canonical.close();
	}
	const currentColumns = db.prepare("PRAGMA table_xinfo(worker_session_placements)").all().filter((column) => column.hidden === 0).map((column) => column.name);
	const expected = new Set(canonicalColumns);
	if (currentColumns.length !== canonicalColumns.length || currentColumns.some((column) => !expected.has(column))) throw new Error("OpenClaw v7 worker placement columns are not canonical");
	if (db.prepare(`SELECT type, name
         FROM sqlite_schema
        WHERE tbl_name = 'worker_session_placements'
          AND type IN ('index', 'trigger')
          AND sql IS NOT NULL
          AND name NOT IN (
            'idx_worker_session_placements_session_key',
            'idx_worker_session_placements_reconcile',
            'idx_worker_session_placements_environment'
          )`).all().length > 0) throw new Error("OpenClaw v7 worker placement schema has unsupported attached objects");
	const migrationTable = "worker_session_placements_migration_v8";
	if (tableExists(db, migrationTable)) throw new Error(`OpenClaw worker placement migration table already exists: ${migrationTable}`);
	const migrationSchema = placementSchema.replace("CREATE TABLE IF NOT EXISTS worker_session_placements", `CREATE TABLE ${migrationTable}`);
	const columns = canonicalColumns.map(quoteSqliteIdentifier).join(", ");
	db.exec(migrationSchema);
	db.exec(`INSERT INTO ${migrationTable} (${columns}) SELECT ${columns} FROM worker_session_placements;`);
	db.exec("DROP TABLE worker_session_placements;");
	db.exec(`ALTER TABLE ${migrationTable} RENAME TO worker_session_placements;`);
	return true;
}
function isDefaultAgentDatabasePath(pathname, agentId) {
	const agentDir = path.dirname(pathname);
	const agentIdDir = path.dirname(agentDir);
	return path.basename(pathname) === "openclaw-agent.sqlite" && path.basename(agentDir) === "agent" && path.basename(agentIdDir) === agentId && path.basename(path.dirname(agentIdDir)) === "agents";
}
function migrateAgentDatabaseRelativePaths(db, previousVersion, databasePath) {
	if (previousVersion >= 9 || !tableExists(db, "agent_databases")) return {
		relativized: 0,
		reanchored: [],
		deleted: [],
		preserved: 0
	};
	const rows = db.prepare("SELECT agent_id, path FROM agent_databases").all();
	const updatePath = db.prepare("UPDATE agent_databases SET path = ? WHERE agent_id = ? AND path = ?");
	const deletePath = db.prepare("DELETE FROM agent_databases WHERE agent_id = ? AND path = ?");
	const hasPath = db.prepare("SELECT 1 FROM agent_databases WHERE agent_id = ? AND path = ? LIMIT 1");
	const retainNewerFacts = db.prepare(`
    UPDATE agent_databases AS canonical
       SET schema_version = source.schema_version,
           last_seen_at = source.last_seen_at,
           size_bytes = source.size_bytes
      FROM agent_databases AS source
     WHERE canonical.agent_id = ? AND canonical.path = ?
       AND source.agent_id = canonical.agent_id AND source.path = ?
       AND source.last_seen_at > canonical.last_seen_at
  `);
	let relativized = 0;
	const reanchored = [];
	const deleted = [];
	for (const row of rows) {
		const agentId = row.agent_id;
		const registeredPath = row.path;
		if (typeof agentId !== "string" || typeof registeredPath !== "string") throw new Error("OpenClaw v8 agent database registry paths are not canonical");
		if (!path.isAbsolute(registeredPath)) continue;
		const storedPath = resolveOpenClawAgentDatabaseStoredPath(databasePath, registeredPath);
		if (!path.isAbsolute(storedPath)) {
			if (hasPath.get(agentId, storedPath)) {
				retainNewerFacts.run(agentId, storedPath, registeredPath);
				deletePath.run(agentId, registeredPath);
				deleted.push(registeredPath);
			} else {
				updatePath.run(storedPath, agentId, registeredPath);
				relativized += 1;
			}
		}
	}
	const stateDir = resolveOpenClawStateDirForDatabasePath(databasePath);
	for (const row of rows) {
		const agentId = row.agent_id;
		const registeredPath = row.path;
		if (typeof agentId !== "string" || typeof registeredPath !== "string" || !path.isAbsolute(registeredPath) || !path.isAbsolute(resolveOpenClawAgentDatabaseStoredPath(databasePath, registeredPath))) continue;
		if (isDefaultAgentDatabasePath(path.resolve(registeredPath), agentId)) {
			const counterpartAbsolute = path.join(stateDir, "agents", agentId, "agent", "openclaw-agent.sqlite");
			const counterpartStored = resolveOpenClawAgentDatabaseStoredPath(databasePath, counterpartAbsolute);
			if (hasPath.get(agentId, counterpartStored)) {
				deletePath.run(agentId, registeredPath);
				deleted.push(registeredPath);
			} else if (existsSync(counterpartAbsolute)) {
				updatePath.run(counterpartStored, agentId, registeredPath);
				reanchored.push(registeredPath);
			}
		}
	}
	return {
		relativized,
		reanchored,
		deleted,
		preserved: rows.length - relativized - reanchored.length - deleted.length
	};
}
function assertCanonicalAgentDatabasesPrimaryKey(db, pathname) {
	if (!tableExists(db, "agent_databases")) return;
	const primaryKey = tablePrimaryKeyColumns(db, "agent_databases");
	if (primaryKey.length !== 2 || primaryKey[0] !== "agent_id" || primaryKey[1] !== "path") throw new SqliteSchemaMismatchError(`OpenClaw state database ${pathname} has an unsupported agent database registry schema. Upgrades from pre-July-2026 state are no longer migrated; restore a backup produced by a July 2026 or newer release before retrying.`);
}
function repairLegacyGatewayRestartHandoffsForStrictMigration(db) {
	if (!tableExists(db, "gateway_restart_handoff")) return;
	db.prepare("DELETE FROM gateway_restart_handoff WHERE expires_at <= ?").run(Date.now());
	db.exec(`
    UPDATE gateway_restart_handoff
    SET
      restart_trace_started_at = CASE
        WHEN typeof(restart_trace_started_at) = 'real'
          THEN CAST(restart_trace_started_at AS INTEGER)
        ELSE restart_trace_started_at
      END,
      restart_trace_last_at = CASE
        WHEN typeof(restart_trace_last_at) = 'real'
          THEN CAST(restart_trace_last_at AS INTEGER)
        ELSE restart_trace_last_at
      END
    WHERE typeof(restart_trace_started_at) = 'real'
       OR typeof(restart_trace_last_at) = 'real';
  `);
}
function assertCanonicalStateSchemaShape(db, pathname) {
	assertCanonicalOperatorApprovalKinds(db, pathname);
	assertCanonicalAgentDatabasesPrimaryKey(db, pathname);
	if (!hasCanonicalAuditEventsSchema(db)) {
		if (canRepairLegacyAuditEventsSchema(db)) throw new OpenClawStateDatabaseSchemaMigrationRequiredError("audit-events-v2", pathname);
		throw new SqliteSchemaMismatchError(`OpenClaw state database ${pathname} has a noncanonical audit event schema that cannot be repaired automatically; restore the canonical audit_events shape before retrying.`);
	}
}
/**
* Detect migrations against a caller-owned handle.
*
* Registry discovery runs this per lookup while already holding a state
* connection; opening a second one there made reads scale with row count.
*/
function detectOpenClawStateDatabaseSchemaMigrationsFromDatabase(db, pathname) {
	assertCanonicalAgentDatabasesPrimaryKey(db, pathname);
	const migrations = [];
	const userVersion = readStateSchemaContentVersion(db);
	if (userVersion < 7 && tableExists(db, "commitments") && hasRecognizedRetiredCommitmentsSchema(db)) migrations.push({
		kind: "commitments-retirement-v7",
		path: pathname
	});
	if (userVersion === 7 && tableExists(db, "worker_session_placements")) migrations.push({
		kind: "worker-placement-execution-mode-v8",
		path: pathname
	});
	if (userVersion === 8 && tableExists(db, "agent_databases")) migrations.push({
		kind: "agent-databases-relative-paths-v9",
		path: pathname
	});
	if (userVersion < 10 && RETIRED_DEAD_STATE_TABLES_V10.some((tableName) => tableExists(db, tableName))) migrations.push({
		kind: "state-table-retirement-v10",
		path: pathname
	});
	if (userVersion < 11 && RETIRED_SKILL_CURATOR_TABLES_V11.some((tableName) => tableExists(db, tableName))) migrations.push({
		kind: "state-table-retirement-v11",
		path: pathname
	});
	if (userVersion < 12 && FOLDED_SINGLETON_STATE_TABLES_V12.some((tableName) => tableExists(db, tableName))) migrations.push({
		kind: "singleton-state-foldin-v12",
		path: pathname
	});
	if (userVersion < 13 && (tableHasColumn(db, "cron_jobs", "schedule_kind") || tableHasColumn(db, "subagent_runs", "task") || tableExists(db, "workspace_attestations") || tableExists(db, "installed_plugin_index") || tableExists(db, "auth_profile_stores"))) migrations.push({
		kind: "state-consolidation-v13",
		path: pathname
	});
	if (userVersion < 14 && tableExists(db, "cron_jobs")) migrations.push({
		kind: "creator-namespace-v14",
		path: pathname
	});
	if (userVersion < 15 && (tableHasColumn(db, "current_conversation_bindings", "target_agent_id") || tableHasColumn(db, "current_conversation_bindings", "target_session_id"))) migrations.push({
		kind: "conversation-binding-targets-v15",
		path: pathname
	});
	if (userVersion < 17 && tableExists(db, "worker_environments") && !tableHasColumn(db, "worker_environments", "preparation_consumed_at_ms")) migrations.push({
		kind: "prepared-worker-ownership-v17",
		path: pathname
	});
	if (userVersion < 18 && ["github_publication_session_lifecycles", "github_repository_publication_requests"].some((table) => tableExists(db, table) && !tableHasColumn(db, table, "requester_authority_json"))) migrations.push({
		kind: "github-publication-requester-authority-v18",
		path: pathname
	});
	if (userVersion < 21 && [
		"meeting_transcript_sessions",
		"meeting_transcript_summaries",
		"delivery_queue_entries"
	].some((table) => tableExists(db, table))) migrations.push({
		kind: "predicate-columns-v21",
		path: pathname
	});
	if (userVersion < 22 && ["acp_sessions", ...STATE_CURSOR_TABLES_V22].some((table) => tableExists(db, table))) migrations.push({
		kind: "portable-identity-columns-v22",
		path: pathname
	});
	if (!hasCanonicalAuditEventsSchema(db)) migrations.push({
		kind: "audit-events-v2",
		path: pathname
	});
	if (tableExists(db, "audit_events") && userVersion < 3) migrations.push({
		kind: "strict-tables-v3",
		path: pathname
	});
	if (needsSessionWatchCursorProvenanceMigration(db, userVersion)) migrations.push({
		kind: "session-watch-cursor-provenance-v4",
		path: pathname
	});
	migrations.push(...detectOperatorApprovalSchemaMigration(db, pathname));
	return migrations;
}
//#endregion
//#region src/state/openclaw-state-db-fast-path.ts
function needsOpenClawStateDatabaseSchemaRepair(pathname, scope = "automatic") {
	let database;
	try {
		database = openNodeSqliteDatabase(pathname, { readOnly: true });
		if (scope === "automatic" && getStateRuntimeSchemaAdmission(database)?.startupReady) return false;
		admitStateSchemaFacts(database, pathname);
		assertSupportedStateSchemaVersion(database, pathname);
		const needsRepair = readStateSchemaContentVersion(database) !== 22 || hasLegacyCronRunLogs(database);
		if (!needsRepair) {
			assertCurrentStateRuntimeSchema(database, pathname);
			if (scope === "doctor") assertSqliteIntegrity(database, pathname);
		}
		return needsRepair;
	} catch {
		return true;
	} finally {
		database?.close();
	}
}
function assertCurrentStateRuntimeSchema(database, pathname, readTable = createSqliteTableContractReader(database)) {
	assertCanonicalStateSchemaShape(database, pathname);
	assertOpenClawStateDatabaseForMaintenance(database, { pathname }, readTable);
	assertSqliteSchemaContains(database, pathname, OPENCLAW_STATE_SCHEMA_SQL, STATE_RUNTIME_SCHEMA_COMPATIBILITY, readTable);
}
/** Catalog presence is enough to refuse retired history without reading or rewriting its rows. */
function assertNoLegacyStateRuntimeRepair(database, pathname) {
	if (hasLegacyCronRunLogs(database)) throw new OpenClawStateDatabaseSchemaMigrationRequiredError("legacy-cron-run-logs", pathname);
}
function isOpenClawStateSchemaFastPathEligible(database, pathname, integrity) {
	const admitted = getStateRuntimeSchemaAdmission(database);
	if (admitted) return admitted.startupReady;
	let publishIntegrity;
	const eligible = withSqlitePostCommitPublications(database, () => runSqliteDeferredTransactionSync(database, () => {
		const userVersion = assertSupportedStateSchemaVersion(database, pathname);
		if (readStateSchemaContentVersion(database) !== 22) return false;
		const schemaVersion = readSqliteSchemaCookie(database);
		if (typeof schemaVersion !== "number") throw new Error(`Shared-state database ${pathname} schema version is unavailable.`);
		assertCurrentStateRuntimeSchema(database, pathname, createSqliteTableContractReader(database));
		assertNoLegacyStateRuntimeRepair(database, pathname);
		publishIntegrity = assertOpenClawStateRuntimeIntegrity(database, pathname, {
			schemaVersion,
			userVersion
		}, integrity);
		return true;
	}, { operationLabel: "state.admission.fast-path" }));
	publishIntegrity?.();
	if (eligible) publishStateRuntimeSchemaAdmission(database, true);
	return eligible;
}
//#endregion
export { normalizeCronRunDiagnosticSummary as $, runStateSchemaMigrationTransaction as A, compareCronRunRecordsNewestFirst as B, assertOpenClawStateDatabaseForMaintenance as C, migrateBoundedStateSchema as D, markCurrentStateSchemaVersion as E, getOpenClawStateRuntimeSchema as F, cronRunRecordToScriptRunResult as G, cronRunLogEntryToDetail as H, isOpenClawStateFirstUseSchemaIssue as I, isCronDeliveryStatus as J, cronRunRecordToTriggerEval as K, isOpenClawStateStartupRepairableSchemaIssue as L, writeCurrentStateSchemaMetadata as M, OPENCLAW_STATE_MAINTENANCE_SCHEMA_COMPATIBILITY as N, openClawStateMigrationAssertions as O, STATE_RUNTIME_SCHEMA_COMPATIBILITY as P, formatUnknownError as Q, migratePredicateColumnsV21 as R, repairAuditEventsSchema as S, executeCanonicalStateSchema as T, cronRunRecordStoreKey as U, cronQuietTriggerDetail as V, cronRunRecordToRunLogEntry as W, parseCronRunDetailJson as X, isCronRunStatus as Y, resolveCronRunRecordTimestamp as Z, needsSessionWatchCursorProvenanceMigration as _, STATE_SCHEMA_MIGRATION_READ_TABLES as a, CRON_SETUP_TIMEOUT_ERROR as at, createStateConfigMachineTable as b, detectOpenClawStateDatabaseSchemaMigrationsFromDatabase as c, resolveAdmittedCronCompletionStatus as ct, migrateWorkerPlacementExecutionModeSchema as d, normalizeCronRunDiagnosticsCore as et, repairLegacyGatewayRestartHandoffsForStrictMigration as f, migrateSessionWatchCursorProvenance as g, runRetiredStateTableMigrations as h, needsOpenClawStateDatabaseSchemaRepair as i, CRON_PRE_EXECUTION_TIMEOUT_ERROR as it, versionedStateMigrations as j, prepareStateDatabaseSchemaRepair as k, dropLegacyStateTables as l, resolveCronCompletionStatus as lt, logRetiredStateTableMigration as m, assertNoLegacyStateRuntimeRepair as n, tailText as nt, assertCanonicalAgentDatabasesPrimaryKey as o, STARTUP_INTERRUPTED_ERROR as ot, dropRetiredSkillWorkshopProposalTables as p, cronRunStorageStatus as q, isOpenClawStateSchemaFastPathEligible as r, CRON_JOB_EXECUTION_TIMEOUT_ERROR as rt, assertCanonicalStateSchemaShape as s, isCronTimeoutErrorText as st, assertCurrentStateRuntimeSchema as t, normalizeExitCode as tt, migrateAgentDatabaseRelativePaths as u, SESSION_WATCH_PROVENANCE_AMBIENT_GROUP as v, assertOpenClawStateDatabaseOwner as w, migrateSingletonStateFoldInV12 as x, SESSION_WATCH_PROVENANCE_EXPLICIT as y, migrateLegacyCronRunLogsToTaskRuns as z };
