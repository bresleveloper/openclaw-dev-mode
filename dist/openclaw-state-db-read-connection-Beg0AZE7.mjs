import { d as asPositiveSafeInteger, f as asSafeIntegerInRange, s as asFiniteNumber, t as MAX_DATE_TIMESTAMP_MS } from "./number-coercion-CLj0HTDM.mjs";
import "./src-CZ2wJvNB.mjs";
import { c as isRecord, r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as safeParseJsonRecord, t as safeParseJson } from "./json-coercion-C7YSvZ9t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { Et as _enum, Fn as object, Jn as string, Kt as custom, Lt as boolean, Pn as number, Sn as looseObject, sr as unknown, xn as literal } from "./schemas-BOYIvvln.mjs";
import { _ as redactSensitiveText } from "./redact-B5EGyLvV.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { t as VERSION } from "./version-BkM1aB4w.mjs";
import { a as iterateSqliteQuerySync, c as prepareSqliteQueryTakeFirstSync, i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync, s as prepareSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { c as registerNodeSqliteDisposeCallback } from "./kysely-sync-cache-state-CFxglP-_.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-BO6jRFcG.mjs";
import { t as SQLITE_IDLE_HANDLE_TTL_MS } from "./sqlite-handle-lifecycle-dWd9h3ii.mjs";
import { i as runSqliteDeferredTransactionSync, o as runSqliteImmediateTransactionSync, t as assertTransactionUsable } from "./sqlite-transaction-DKSXLQhb.mjs";
import { a as throwSqliteLifecycleErrors, n as createSqliteLifecycleAggregateError, t as SqliteCoordinatorError } from "./sqlite-coordinator-z2lO0ops.mjs";
import { t as acquireSqliteSnapshotReadToken } from "./sqlite-snapshot-staging-BNvNaOwn.mjs";
import { i as tableHasColumn, o as tablePrimaryKeyColumns, r as tableExists, t as ensureColumn } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { i as LAZY_ADDITIVE_STATE_TABLES, n as FIRST_USE_STATE_TABLES, o as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS, r as LAZY_ADDITIVE_STATE_INDEXES, t as FIRST_USE_STATE_INDEXES } from "./openclaw-state-db-contract-dESpOAuZ.mjs";
import { a as readSqliteUserVersion } from "./sqlite-user-version-B1TtVu8E.mjs";
import { n as normalizeSqliteNumber, t as coerceRequiredSqliteNumber } from "./sqlite-number-DM1AypRG.mjs";
import { a as registerSqliteCacheExitClose, o as runInSqliteMaintenanceContext } from "./sqlite-wal-BzoPsBh0.mjs";
import { i as readDatabasePathIdentitySync, t as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-CR_ZuhW6.mjs";
import { n as assertSqliteIntegrity } from "./sqlite-integrity-B4lhf3Iz.mjs";
import { T as openTrackedStateDatabaseResult, p as openClawStateDatabaseCache } from "./openclaw-state-db-cache-Ci98mtX8.mjs";
import { a as resolveOpenClawStateDirForDatabasePath, r as resolveOpenClawAgentDatabaseStoredPath, s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { s as quoteSqliteIdentifier, u as splitSqlList } from "./sqlite-schema-sql-5Wa9sNMr.mjs";
import { a as createSqliteTableContractReader, c as readSqliteSchemaCookie, i as collectSqliteSchemaIssues, n as assertSqliteSchemaTablesPresent, o as getCanonicalSqliteNamedIndexContracts, r as collectSqliteNamedIndexContract, t as assertSqliteSchemaContains } from "./sqlite-schema-contract-BFcZzasN.mjs";
import { n as OpenClawStateDatabaseSchemaMigrationRequiredError, t as LEGACY_SKILL_WORKSHOP_COLLECTION_REVIEWS_INDEX } from "./openclaw-state-db-schema-migration-required-x5nU_jtc.mjs";
import { i as readStateSchemaMigrationVersion, n as assertSupportedStateSchemaVersion, r as readStateSchemaContentVersion, t as CONTENT_VERSION_KEY } from "./openclaw-state-db-schema-version-DX12nO8l.mjs";
import { i as isExistingOpenClawStateSchema } from "./openclaw-state-db-schema-policy-BpQ7rCsk.mjs";
import { t as FAILOVER_REASONS } from "./failover-reasons-Mjd0tFtT.mjs";
import { r as withSqliteWritableSchema, t as hasDanglingSkillWorkshopCollectionReviewIndex } from "./openclaw-state-db-doctor-schema-Cy4xw-oI.mjs";
import { t as stripInternalMetadataForDisplay } from "./display-text-sanitize-CredJWX1.mjs";
import { o as isSilentReplyText } from "./tokens-BTKQYTUd.mjs";
import { a as selectDeliverableSessionsReply } from "./sessions-send-tokens-Dy3kgMtK.mjs";
import { t as buildApprovalResolutionRef } from "./approval-resolution-ref-BMBlVd2b.mjs";
import { a as assertOpenClawStateWriteAllowed, n as OpenClawStateOwnershipError } from "./openclaw-state-ownership-OLtsPpqu.mjs";
import { t as ABANDONED_UPDATE_RUN_MS } from "./update-run-timeouts-Byb-PlTk.mjs";
import { t as UpdateSchemaRefusalError } from "./openclaw-update-schema-refusal-CIfR48BB.mjs";
import { existsSync } from "node:fs";
import path from "node:path";
import { parse as parse$1 } from "semver";
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
function normalizeDiagnosticToolName(value) {
	if (typeof value !== "string") return;
	return normalizeOptionalString(value);
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
//#region src/cron/task-run-detail.ts
/** Read-side cron codec between task-ledger detail and the stable run-history wire shape.
* Deliberately free of agent/runtime imports so history reads stay dependency-light;
* the event->entry write codec lives in task-run-event-codec.ts. */
const CRON_TASK_DETAIL_KIND = "cron-run";
const CRON_FAILOVER_REASONS = new Set(FAILOVER_REASONS);
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
const optionalCronDurationSchema = unknown().optional().transform((value) => asSafeIntegerInRange(value, { min: 0 }));
const optionalCronTokenCountSchema = unknown().optional().transform((value) => asSafeIntegerInRange(value, { min: 0 }));
const cronUsageSchema = object({
	input_tokens: optionalCronTokenCountSchema,
	output_tokens: optionalCronTokenCountSchema,
	total_tokens: optionalCronTokenCountSchema,
	cache_read_tokens: optionalCronTokenCountSchema,
	cache_write_tokens: optionalCronTokenCountSchema
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
	errorReason: custom((value) => typeof value === "string" && CRON_FAILOVER_REASONS.has(value)).optional().catch(void 0),
	summary: optionalCronStringSchema,
	runId: optionalNonBlankCronStringSchema,
	diagnostics: unknown().optional(),
	runAtMs: optionalCronTimestampSchema,
	durationMs: optionalCronDurationSchema,
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
function toJsonValue(value) {
	const serialized = JSON.stringify(value);
	return serialized === void 0 ? void 0 : JSON.parse(serialized);
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
	const entry = {
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
		usage: entryObj.usage
	};
	if (entryObj.delivered !== void 0) entry.delivered = entryObj.delivered;
	if (entryObj.deliveryStatus !== void 0) entry.deliveryStatus = entryObj.deliveryStatus;
	if (entryObj.deliveryError !== void 0) entry.deliveryError = entryObj.deliveryError;
	if (entryObj.deliverySuppressionReason !== void 0) entry.deliverySuppressionReason = entryObj.deliverySuppressionReason;
	if (entryObj.failureNotificationDelivery !== void 0) entry.failureNotificationDelivery = entryObj.failureNotificationDelivery;
	if (entryObj.delivery !== void 0) entry.delivery = entryObj.delivery;
	if (entryObj.sessionId !== void 0) entry.sessionId = entryObj.sessionId;
	if (entryObj.sessionKey !== void 0) entry.sessionKey = entryObj.sessionKey;
	return entry;
}
/** Encodes cron-owned outcome fields; the generic lifecycle projection stays on TaskRecord. */
function cronRunLogEntryToTaskDetail(entry, options) {
	return toJsonValue({
		kind: CRON_TASK_DETAIL_KIND,
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
	}) ?? { kind: CRON_TASK_DETAIL_KIND };
}
/** Stores quiet-trigger recovery facts without creating a run-history detail row. */
function cronQuietTriggerTaskDetail(storeKey, triggerEval) {
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
/** Returns the cron store partition recorded on a task row. */
function cronTaskRecordStoreKey(task) {
	return isJsonObject(task.detail) && typeof task.detail.storeKey === "string" ? task.detail.storeKey : void 0;
}
/** Keeps history projection, recovery, and retention on one task-row timestamp. */
function resolveCronTaskRecordTimestamp(task) {
	return task.endedAt ?? task.lastEventAt ?? task.createdAt;
}
/** Reads internal trigger recovery data without adding it to run-history responses. */
function cronTaskRecordToTriggerEval(task) {
	if (!isJsonObject(task.detail) || typeof task.detail.triggerFired !== "boolean") return;
	return {
		fired: task.detail.triggerFired,
		stateChanged: task.detail.triggerStateChanged === true,
		...task.detail.triggerStateChanged === true && "triggerState" in task.detail ? { state: task.detail.triggerState } : {}
	};
}
/** Reads internal payload-script recovery data without exposing it in run history. */
function cronTaskRecordToScriptRunResult(task) {
	if (!isJsonObject(task.detail) || task.detail.scriptStateChanged !== true) return;
	return {
		scriptStateChanged: true,
		...Object.hasOwn(task.detail, "scriptState") ? { scriptState: task.detail.scriptState } : {}
	};
}
/** Maps the cron outcome vocabulary onto generic task terminal states. */
function cronRunStatusToTaskStatus(entry) {
	if (entry.status === "ok") return (entry.completionStatus ?? resolveCronCompletionStatus({
		status: entry.status,
		delivered: entry.delivered,
		deliveryStatus: entry.deliveryStatus
	})) === "succeeded" ? "succeeded" : "failed";
	return entry.status === "error" && isCronTimeoutErrorText(entry.error) ? "timed_out" : "failed";
}
/** Reconstructs the unchanged CronRunLogEntry wire shape from a cron task row. */
function cronTaskRecordToRunLogEntry(task) {
	if (task.runtime !== "cron" || !task.sourceId || !isJsonObject(task.detail)) return null;
	if (task.detail.kind !== CRON_TASK_DETAIL_KIND) return null;
	const wireDetail = { ...task.detail };
	delete wireDetail.storeKey;
	const entry = parseCronRunLogEntryObject({
		error: task.error,
		summary: task.terminalSummary,
		...wireDetail,
		ts: resolveCronTaskRecordTimestamp(task),
		jobId: task.sourceId,
		action: "finished",
		sessionKey: task.childSessionKey,
		runId: typeof task.detail.runId === "string" ? task.detail.runId : void 0
	}, { jobId: task.sourceId });
	if (!entry) return null;
	return Object.assign(entry, {
		delivered: entry.delivered,
		deliveryStatus: entry.deliveryStatus,
		deliveryError: entry.deliveryError,
		sessionId: entry.sessionId,
		sessionKey: entry.sessionKey
	});
}
//#endregion
//#region src/infra/state-migrations.cron-run-logs.ts
const CRON_RUN_LOG_TASK_IMPORT_MIGRATION_ID = "state:cron-run-logs-to-task-runs:v1";
const CRON_RUN_LOG_IMPORT_BATCH_SIZE = 500;
function hasLegacyCronRunLogs(db) {
	return Boolean(db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'cron_run_logs' LIMIT 1").get());
}
function parseDetail(raw) {
	return raw ? safeParseJsonRecord(raw) : void 0;
}
function collectMirroredTasks(db) {
	const rows = db.prepare(`SELECT source_id, ended_at, detail_json
       FROM task_runs
       WHERE runtime = 'cron' AND source_id IS NOT NULL AND detail_json IS NOT NULL`).all();
	const bySource = /* @__PURE__ */ new Map();
	for (const row of rows) {
		const detail = parseDetail(row.detail_json);
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
	let rawEntry;
	try {
		rawEntry = JSON.parse(row.entry_json ?? "");
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
		runAtMs: normalizeSqliteNumber(row.run_at_ms ?? null) ?? parsed.runAtMs,
		durationMs: normalizeSqliteNumber(row.duration_ms ?? null) ?? parsed.durationMs,
		nextRunAtMs: normalizeSqliteNumber(row.next_run_at_ms ?? null) ?? parsed.nextRunAtMs,
		model: row.model ?? parsed.model,
		provider: row.provider ?? parsed.provider
	};
}
function ordinalKey(jobId, ts) {
	return `${jobId}\0${ts}`;
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
			const key = ordinalKey(entry.jobId, entry.ts);
			const ordinal = (ordinals.get(key) ?? 0) + 1;
			ordinals.set(key, ordinal);
			if (hasMirroredIdentity(mirrored.get(entry.jobId) ?? [], entry.runId, entry.ts)) {
				alreadyMirrored++;
				continue;
			}
			const taskId = `cron-runlog-import:${entry.jobId}:${entry.ts}:${ordinal}`;
			const status = cronRunStatusToTaskStatus(entry);
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
				detail_json: JSON.stringify(cronRunLogEntryToTaskDetail(entry, { storeKey: row.store_key }))
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
//#region src/state/openclaw-state-db-additive-columns.ts
const lazyColumns = [
	[
		"claw_installs",
		"bootstrap_content_digest",
		"TEXT"
	],
	[
		"claw_installs",
		"bootstrap_source_path",
		"TEXT"
	],
	[
		"worker_environments",
		"desktop_json",
		"TEXT"
	],
	[
		"worker_environments",
		"bootstrap_install_kind",
		"TEXT"
	],
	[
		"worker_environments",
		"preparation_purpose",
		"TEXT"
	],
	[
		"claw_package_refs",
		"extension_adapter_identity",
		"TEXT"
	],
	[
		"claw_package_refs",
		"extension_detected_format",
		"TEXT"
	],
	[
		"claw_package_refs",
		"extension_format",
		"TEXT"
	],
	[
		"claw_package_refs",
		"extension_id",
		"TEXT"
	],
	[
		"claw_package_refs",
		"extension_mapped_json",
		"TEXT"
	],
	[
		"claw_package_refs",
		"extension_unavailable_json",
		"TEXT"
	],
	[
		"worker_environments",
		"shared_host",
		"INTEGER"
	],
	[
		"worker_environments",
		"node_setup_id",
		"TEXT"
	],
	[
		"worker_environments",
		"node_device_id",
		"TEXT"
	],
	[
		"worker_session_placements",
		"terminal_reason",
		"TEXT"
	],
	[
		"worker_session_placements",
		"terminal_at_ms",
		"INTEGER"
	],
	[
		"worker_workspace_pending_results",
		"repository_workspace_id",
		"TEXT",
		true
	],
	[
		"worker_session_placement_moves",
		"abandon_source",
		"INTEGER",
		true
	],
	[
		"worker_session_placement_moves",
		"target_machine_class",
		"TEXT",
		true
	],
	[
		"worker_session_placement_moves",
		"target_os",
		"TEXT",
		true
	],
	[
		"worktrees",
		"run_end_cleanup_json",
		"TEXT"
	],
	[
		"device_bootstrap_tokens",
		"setup_id",
		"TEXT",
		true
	],
	[
		"session_groups",
		"cwd",
		"TEXT",
		true
	],
	[
		"session_groups",
		"worktree",
		"INTEGER",
		true
	],
	[
		"secret_store_entries",
		"allowed_hosts",
		"TEXT"
	],
	[
		"web_push_subscriptions",
		"device_id",
		"TEXT",
		true
	],
	[
		"web_push_subscriptions",
		"user_profile_id",
		"TEXT",
		true
	],
	[
		"web_push_subscriptions",
		"preferences_json",
		"TEXT",
		true
	],
	[
		"task_runs",
		"execution_owner_host",
		"TEXT",
		true
	],
	[
		"task_runs",
		"execution_owner_pid",
		"INTEGER",
		true
	],
	[
		"task_runs",
		"execution_owner_start_identity",
		"INTEGER",
		true
	],
	[
		"session_watch_cursors",
		"watcher_store_path",
		"TEXT",
		true
	],
	[
		"subagent_runs",
		"requester_store_path",
		"TEXT",
		true
	],
	[
		"subagent_runs",
		"controller_store_path",
		"TEXT",
		true
	],
	[
		"cron_jobs",
		"grant_definition_revision",
		"TEXT"
	],
	[
		"cron_jobs",
		"grant_definition_generation",
		"INTEGER"
	],
	[
		"cron_jobs",
		"grant_definition_updated_at",
		"INTEGER"
	]
];
function lazyColumnDefinitions(firstUseOnly) {
	return lazyColumns.filter((definition) => firstUseOnly === void 0 || Boolean(definition[3]) === firstUseOnly).map(([tableName, columnName, dataType]) => ({
		columnName,
		dataType,
		tableName
	}));
}
const CLAW_LAZY_ADDITIVE_STATE_COLUMN_DEFINITIONS = lazyColumnDefinitions();
const CLAW_STARTUP_ADDITIVE_STATE_COLUMN_DEFINITIONS = lazyColumnDefinitions(false);
const CLAW_FIRST_USE_ADDITIVE_STATE_COLUMN_DEFINITIONS = lazyColumnDefinitions(true);
const ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS = {
	packageUpdatedAt: [["claw_package_refs", "updated_at_ms INTEGER NOT NULL DEFAULT 0"]],
	packageIntegrity: [["claw_package_refs", "package_integrity TEXT NOT NULL DEFAULT 'sha256:0000000000000000000000000000000000000000000000000000000000000000'"]],
	diagnosticSequence: [["diagnostic_events", "sequence INTEGER NOT NULL DEFAULT 0"]],
	cronRunLogs: [
		["worktrees", "provisioned_paths_json TEXT"],
		["apns_registrations", "relay_origin TEXT"],
		["device_pairing_pending", "refreshed_at_ms INTEGER"],
		["device_pairing_pending", "browser_origin TEXT"],
		["device_pairing_paired", "approved_via TEXT"],
		["device_pairing_paired", "browser_origin TEXT"],
		["device_pairing_paired", "operator_label TEXT"],
		["device_pairing_paired", "node_surface_json TEXT"],
		["device_pairing_paired", "pending_node_surface_json TEXT"],
		["cron_run_logs", "status TEXT"],
		["cron_run_logs", "error TEXT"],
		["cron_run_logs", "summary TEXT"],
		["cron_run_logs", "diagnostics_summary TEXT"],
		["cron_run_logs", "delivery_status TEXT"],
		["cron_run_logs", "delivery_error TEXT"],
		["cron_run_logs", "delivered INTEGER"],
		["cron_run_logs", "session_id TEXT"],
		["cron_run_logs", "session_key TEXT"],
		["cron_run_logs", "run_id TEXT"],
		["cron_run_logs", "run_at_ms INTEGER"],
		["cron_run_logs", "duration_ms INTEGER"],
		["cron_run_logs", "next_run_at_ms INTEGER"],
		["cron_run_logs", "model TEXT"],
		["cron_run_logs", "provider TEXT"],
		["cron_run_logs", "total_tokens INTEGER"],
		["cron_run_logs", "entry_json TEXT NOT NULL DEFAULT '{}'"],
		["cron_run_logs", "created_at INTEGER NOT NULL DEFAULT 0"]
	],
	acpReplay: [["acp_replay_events", "estimated_bytes INTEGER NOT NULL DEFAULT 0"], ["acp_replay_sessions", "estimated_bytes INTEGER NOT NULL DEFAULT 0"]],
	cronJobs: [
		["cron_jobs", "description TEXT"],
		["cron_jobs", "declaration_key TEXT"],
		["cron_jobs", "owner_agent_id TEXT"],
		["cron_jobs", "name TEXT NOT NULL DEFAULT ''"],
		["cron_jobs", "enabled INTEGER NOT NULL DEFAULT 1"],
		["cron_jobs", "agent_id TEXT"],
		["cron_jobs", "payload_kind TEXT NOT NULL DEFAULT 'message'"],
		["cron_jobs", "state_json TEXT NOT NULL DEFAULT '{}'"],
		["cron_jobs", "runtime_updated_at_ms INTEGER"],
		["cron_jobs", "schedule_identity TEXT"],
		["cron_jobs", "sort_order INTEGER NOT NULL DEFAULT 0"]
	],
	deliveryQueue: [
		["sandbox_registry_entries", "session_key TEXT"],
		["sandbox_registry_entries", "backend_id TEXT"],
		["sandbox_registry_entries", "runtime_label TEXT"],
		["sandbox_registry_entries", "image TEXT"],
		["sandbox_registry_entries", "created_at_ms INTEGER"],
		["sandbox_registry_entries", "last_used_at_ms INTEGER"],
		["sandbox_registry_entries", "config_label_kind TEXT"],
		["sandbox_registry_entries", "config_hash TEXT"],
		["sandbox_registry_entries", "cdp_port INTEGER"],
		["sandbox_registry_entries", "no_vnc_port INTEGER"],
		["delivery_queue_entries", "entry_kind TEXT"],
		["delivery_queue_entries", "session_key TEXT"],
		["delivery_queue_entries", "channel TEXT"],
		["delivery_queue_entries", "target TEXT"],
		["delivery_queue_entries", "account_id TEXT"],
		["delivery_queue_entries", "retry_count INTEGER NOT NULL DEFAULT 0"],
		["delivery_queue_entries", "last_attempt_at INTEGER"],
		["delivery_queue_entries", "last_error TEXT"],
		["delivery_queue_entries", "recovery_state TEXT"],
		["delivery_queue_entries", "platform_send_started_at INTEGER"]
	],
	originalMediaRoot: [["managed_outgoing_image_records", "original_media_root TEXT NOT NULL DEFAULT ''"]],
	beforeTaskAttribution: [
		["managed_outgoing_image_records", "agent_id TEXT"],
		["managed_outgoing_image_records", "cleanup_pending INTEGER NOT NULL DEFAULT 0 CHECK (cleanup_pending IN (0, 1))"],
		["current_conversation_bindings", "conversation_kind TEXT NOT NULL DEFAULT 'channel'"],
		["device_bootstrap_tokens", "pending_profile_json TEXT"],
		["gateway_restart_handoff", "restart_trace_started_at INTEGER"],
		["gateway_restart_handoff", "restart_trace_last_at INTEGER"],
		["gateway_restart_intent", "reason TEXT"],
		["gateway_restart_sentinel", "delivery_channel TEXT"],
		["gateway_restart_sentinel", "delivery_to TEXT"],
		["gateway_restart_sentinel", "delivery_account_id TEXT"],
		["gateway_restart_sentinel", "message TEXT"],
		["gateway_restart_sentinel", "continuation_json TEXT"],
		["gateway_restart_sentinel", "doctor_hint TEXT"],
		["gateway_restart_sentinel", "stats_json TEXT"],
		["gateway_boot_lifecycle", "startup_reason TEXT"],
		["official_external_plugin_catalog_snapshots", "trust_mode TEXT"],
		["official_external_plugin_catalog_snapshots", "trust_key_id TEXT"],
		["official_external_plugin_catalog_snapshots", "trust_signature_count INTEGER"],
		["official_external_plugin_catalog_snapshots", "trust_threshold INTEGER"],
		["official_external_plugin_catalog_snapshots", "trust_verified_at TEXT"]
	],
	taskRequester: [["task_runs", "requester_agent_id TEXT"]],
	taskRunDetails: [
		["task_runs", "tool_use_count INTEGER"],
		["task_runs", "last_tool_name TEXT"],
		["task_runs", "detail_json TEXT"]
	],
	workerEnvironments: [
		["worker_environments", "bootstrap_bundle_hash TEXT"],
		["worker_environments", "bootstrap_openclaw_version TEXT"],
		["worker_environments", "bootstrap_protocol_features_json TEXT"],
		["worker_environments", "bootstrap_install_kind TEXT"],
		["worker_environments", "owner_epoch INTEGER NOT NULL DEFAULT 0 CHECK (owner_epoch >= 0)"],
		["worker_environments", "ssh_host_key TEXT"],
		["worker_workspace_pending_results", "staged_result_ref TEXT"],
		["worker_environments", "teardown_terminal_state TEXT CHECK (teardown_terminal_state IN ('destroyed', 'failed'))"]
	]
};
//#endregion
//#region src/acp/event-ledger-bytes.ts
/** Retained UTF-8 text footprint, including the existing fixed allowance per row. */
function estimateAcpSessionRowBytes(params) {
	return Buffer.byteLength(params.sessionId, "utf8") + Buffer.byteLength(params.sessionKey, "utf8") + Buffer.byteLength(params.cwd, "utf8") + 32;
}
function estimateAcpEventRowBytes(params) {
	return Buffer.byteLength(params.sessionId, "utf8") + Buffer.byteLength(params.sessionKey, "utf8") + Buffer.byteLength(params.runId ?? "", "utf8") + Buffer.byteLength(params.updateJson, "utf8") + 32;
}
//#endregion
//#region src/agents/agent-run-terminal-receipt.ts
const AGENT_RUN_ROUTE_CHANGE_MAX_CHARS = 320;
function normalizeAgentRunTerminalReceipt(value) {
	const receipt = value;
	return receipt && typeof receipt.runId === "string" && typeof receipt.sessionId === "string" && typeof receipt.turnId === "string" && receipt.requested && receipt.effective && Array.isArray(receipt.successfulToolNames) ? receipt : void 0;
}
function formatAgentRunModelRef(value) {
	const route = redactSensitiveText(`${value.provider}/${value.model}`, { mode: "tools" }).replace(/\s+/gu, " ").trim();
	return route ? truncateUtf16Safe(route, 128) : void 0;
}
/** Normalizes the producer-owned route fact before lifecycle or prompt use. */
function normalizeAgentRunRouteChange(value) {
	const normalized = typeof value === "string" ? redactSensitiveText(value, { mode: "tools" }).replace(/\s+/gu, " ").trim() : "";
	return normalized ? truncateUtf16Safe(normalized, AGENT_RUN_ROUTE_CHANGE_MAX_CHARS) : void 0;
}
/** Formats the bounded, secret-free route fact owned by a terminal receipt. */
function formatAgentRunRouteChange(receipt, expectedRunId) {
	if (receipt?.runId !== expectedRunId || !receipt.rerouted || receipt.terminalDisposition !== "visible") return;
	const requested = formatAgentRunModelRef(receipt.requested);
	const effective = formatAgentRunModelRef({
		...receipt.effective,
		model: receipt.effective.responseModel || receipt.effective.model
	});
	return requested && effective ? `Model route changed: ${requested} → ${effective}.` : void 0;
}
//#endregion
//#region src/agents/agent-run-terminal-reply.ts
const AGENT_RUN_TERMINAL_REPLY_MAX_CHARS = 4096;
function isMessageToolNotCalledTerminalReply(reply) {
	return reply?.disposition === "empty" && reply.code === "message-tool-not-called";
}
/** Sanitizes and caps producer-owned text before it enters lifecycle or durable state. */
function sanitizeAgentRunTerminalReplyText(text) {
	const sanitized = stripInternalMetadataForDisplay(text).trim();
	if (sanitized.length <= AGENT_RUN_TERMINAL_REPLY_MAX_CHARS) return sanitized;
	return `${truncateUtf16Safe(sanitized, 4095).trimEnd()}…`;
}
/** Builds the authoritative terminal reply fact while raw assistant text is still available. */
function buildAgentRunTerminalReplySnapshot(params) {
	if (params.terminalReplyKind === "silent-empty" || isSilentReplyText(params.rawText ?? params.visibleText, "NO_REPLY")) return { disposition: "silent" };
	const text = sanitizeAgentRunTerminalReplyText(params.visibleText ?? "");
	return text ? {
		disposition: "visible",
		text
	} : { disposition: "empty" };
}
/** Normalizes lifecycle/RPC evidence without allowing raw or unbounded text through. */
function normalizeAgentRunTerminalReplySnapshot(value) {
	if (!isRecord(value)) return;
	const disposition = value.disposition;
	if (disposition === "silent") return { disposition };
	if (disposition === "empty") {
		if (value.code === "message-tool-not-called") return {
			disposition,
			code: "message-tool-not-called"
		};
		return { disposition };
	}
	if (disposition !== "visible") return;
	const rawText = value.text;
	if (typeof rawText !== "string") return;
	const text = sanitizeAgentRunTerminalReplyText(rawText);
	const modelRouteChange = normalizeAgentRunRouteChange(value.modelRouteChange);
	return text ? {
		disposition: "visible",
		text,
		...modelRouteChange ? { modelRouteChange } : {}
	} : { disposition: "empty" };
}
/** Reply evidence merges independently from sticky timeout/cancellation precedence. */
function mergeAgentRunTerminalReplySnapshot(existing, incoming) {
	if (!incoming) return existing;
	if (!existing) return incoming;
	if (isMessageToolNotCalledTerminalReply(existing)) return existing;
	if (isMessageToolNotCalledTerminalReply(incoming)) return incoming;
	if (existing.disposition === "empty") return incoming;
	return incoming.disposition === "empty" ? existing : incoming;
}
//#endregion
//#region src/infra/delivery-queue-sqlite-bound.ts
const COMPLETED_TOMBSTONE_RETENTION_MS = 2592e6;
const BOUNDED_DELIVERY_RECEIPTS_SQL = `
  SELECT * FROM (
    SELECT rowid receipt_rowid, queue_name, id, enqueued_at,
      json_extract(entry_json, '$.completionRetention.idPrefix') id_prefix,
      json_extract(entry_json, '$.completionRetention.maxAgeMs') max_age_ms,
      json_extract(entry_json, '$.completionRetention.maxEntries') max_entries
    FROM delivery_queue_entries WHERE status IN ('completed', 'failed')
      AND recovery_state = 'completed_bounded' AND json_valid(entry_json)
       AND json_type(entry_json, '$.completionRetention') = 'object'
  )
  WHERE typeof(id_prefix) = 'text' AND id_prefix <> ''
    AND substr(id, 1, length(id_prefix)) = id_prefix
    AND typeof(max_age_ms) = 'integer' AND max_age_ms BETWEEN 1 AND 9007199254740991
    AND typeof(max_entries) = 'integer' AND max_entries BETWEEN 1 AND 9007199254740991`;
const deliveryQueueRowColumns = [
	"id",
	"entry_json",
	"enqueued_at",
	"retry_count",
	"last_attempt_at",
	"last_error",
	"platform_send_started_at",
	"recovery_state"
];
/** Prunes bounded receipts globally or for one exact producer namespace. */
function pruneDeliveryQueueTombstones(db, now, prefix) {
	const result = db.prepare(`WITH policies AS (
      ${BOUNDED_DELIVERY_RECEIPTS_SQL}
      ${prefix ? "AND queue_name = @queueName AND id_prefix = @idPrefix" : ""}
    ), ranked AS (
      SELECT *, row_number() OVER (PARTITION BY queue_name, id_prefix
        ORDER BY enqueued_at DESC, id DESC) retention_rank FROM policies
    ) DELETE FROM delivery_queue_entries WHERE rowid IN (
      SELECT receipt_rowid FROM ranked
      WHERE enqueued_at < @now - max_age_ms OR retention_rank > max_entries
    )`).run(prefix ? {
		now,
		...prefix
	} : { now });
	const ordinaryPruned = prefix ? false : pruneOrdinaryDeliveryReceipts(db, now);
	return result.changes > 0 || ordinaryPruned;
}
/** Cheap maintenance cleanup: age predicates only, with no window sort. */
function pruneDeliveryQueueTombstoneAges(db, now) {
	db.prepare(`DELETE FROM delivery_queue_entries WHERE rowid IN (
    SELECT receipt_rowid FROM (${BOUNDED_DELIVERY_RECEIPTS_SQL})
    WHERE enqueued_at < @now - max_age_ms)`).run({ now });
	pruneOrdinaryDeliveryReceipts(db, now);
}
/** CAS-compacts one exact row, or deletes it when no fence is authored. */
function terminalizeBoundDeliveryQueueEntry(db, queueName, id, expectedJson, failedEntry, now, expectedStatus = "pending") {
	const queueDb = getNodeSqliteKysely(db);
	const expected = {
		queue_name: queueName,
		id,
		status: expectedStatus,
		entry_json: expectedJson
	};
	const query = failedEntry ? queueDb.updateTable("delivery_queue_entries").where((eb) => eb.and(expected)).set({
		status: "failed",
		entry_kind: null,
		session_key: null,
		channel: null,
		target: null,
		account_id: null,
		last_attempt_at: null,
		last_error: null,
		platform_send_started_at: null,
		recovery_state: failedEntry.recoveryState ?? null,
		entry_json: JSON.stringify(failedEntry),
		enqueued_at: now,
		updated_at: now,
		failed_at: now
	}) : queueDb.deleteFrom("delivery_queue_entries").where((eb) => eb.and(expected));
	return executeSqliteQuerySync(db, query).numAffectedRows === 1n;
}
function pruneOrdinaryDeliveryReceipts(db, now) {
	return (executeSqliteQuerySync(db, getNodeSqliteKysely(db).deleteFrom("delivery_queue_entries").where("status", "=", "completed").where("enqueued_at", "<", now - COMPLETED_TOMBSTONE_RETENTION_MS).where((eb) => eb.or([eb("recovery_state", "is", null), eb("recovery_state", "not in", ["completed_permanent", "completed_bounded"])]))).numAffectedRows ?? 0n) > 0n;
}
function inflateDeliveryQueueRow(row) {
	let parsed;
	try {
		parsed = JSON.parse(row.entry_json);
	} catch {
		return null;
	}
	return {
		...parsed,
		id: row.id,
		enqueuedAt: coerceRequiredSqliteNumber(row.enqueued_at),
		retryCount: coerceRequiredSqliteNumber(row.retry_count),
		...row.last_attempt_at == null ? {} : { lastAttemptAt: coerceRequiredSqliteNumber(row.last_attempt_at) },
		...row.last_error == null ? {} : { lastError: row.last_error },
		...row.platform_send_started_at == null ? {} : { platformSendStartedAt: coerceRequiredSqliteNumber(row.platform_send_started_at) },
		...row.recovery_state == null ? {} : { recoveryState: row.recovery_state }
	};
}
function deliveryQueueMetadata(queueName, entry) {
	const item = entry;
	return {
		entryKind: item.kind ?? queueName,
		sessionKey: item.sessionKey ?? item.session?.key,
		channel: item.channel ?? item.route?.channel ?? item.deliveryContext?.channel,
		target: item.to ?? item.route?.to ?? item.deliveryContext?.to,
		accountId: item.accountId ?? item.route?.accountId ?? item.deliveryContext?.accountId
	};
}
/** Canonically serializes a queue row before a transaction acquires the write lock. */
function bindDeliveryQueueEntry(params, now = Date.now()) {
	const status = params.status ?? "pending";
	const meta = params.metadata ?? deliveryQueueMetadata(params.queueName, params.entry);
	return {
		insertOnly: params.insertOnly === true,
		updatePendingOnly: params.updatePendingOnly === true,
		completeExisting: params.completeExisting === true,
		row: {
			queue_name: params.queueName,
			id: params.entry.id,
			status,
			entry_kind: meta.entryKind ?? null,
			session_key: meta.sessionKey ?? null,
			channel: meta.channel ?? null,
			target: meta.target ?? null,
			account_id: meta.accountId ?? null,
			retry_count: params.entry.retryCount,
			last_attempt_at: params.entry.lastAttemptAt ?? null,
			last_error: params.entry.lastError ?? null,
			recovery_state: params.entry.recoveryState ?? null,
			platform_send_started_at: params.entry.platformSendStartedAt ?? null,
			entry_json: JSON.stringify(params.entry),
			enqueued_at: params.entry.enqueuedAt,
			updated_at: now,
			failed_at: status === "failed" ? now : null
		}
	};
}
function createDeliveryQueueUpsert(database, mode) {
	const queueDb = getNodeSqliteKysely(database);
	return prepareSqliteQuerySync(database, (parameter) => {
		const insert = queueDb.insertInto("delivery_queue_entries").values({
			queue_name: parameter((row) => row.queue_name),
			id: parameter((row) => row.id),
			status: parameter((row) => row.status),
			entry_kind: parameter((row) => row.entry_kind),
			session_key: parameter((row) => row.session_key),
			channel: parameter((row) => row.channel),
			target: parameter((row) => row.target),
			account_id: parameter((row) => row.account_id),
			retry_count: parameter((row) => row.retry_count),
			last_attempt_at: parameter((row) => row.last_attempt_at),
			last_error: parameter((row) => row.last_error),
			recovery_state: parameter((row) => row.recovery_state),
			platform_send_started_at: parameter((row) => row.platform_send_started_at),
			entry_json: parameter((row) => row.entry_json),
			enqueued_at: parameter((row) => row.enqueued_at),
			updated_at: parameter((row) => row.updated_at),
			failed_at: parameter((row) => row.failed_at)
		});
		return mode === "insert" ? insert.onConflict((conflict) => conflict.columns(["queue_name", "id"]).doNothing()) : insert.onConflict((conflict) => {
			const update = conflict.columns(["queue_name", "id"]).doUpdateSet({
				status: (eb) => eb.ref("excluded.status"),
				entry_kind: (eb) => eb.ref("excluded.entry_kind"),
				session_key: (eb) => eb.ref("excluded.session_key"),
				channel: (eb) => eb.ref("excluded.channel"),
				target: (eb) => eb.ref("excluded.target"),
				account_id: (eb) => eb.ref("excluded.account_id"),
				retry_count: (eb) => eb.ref("excluded.retry_count"),
				last_attempt_at: (eb) => eb.ref("excluded.last_attempt_at"),
				last_error: (eb) => eb.ref("excluded.last_error"),
				recovery_state: (eb) => eb.ref("excluded.recovery_state"),
				platform_send_started_at: (eb) => eb.ref("excluded.platform_send_started_at"),
				entry_json: (eb) => eb.ref("excluded.entry_json"),
				enqueued_at: (eb) => eb.ref("excluded.enqueued_at"),
				updated_at: (eb) => eb.ref("excluded.updated_at"),
				failed_at: (eb) => eb.ref("excluded.failed_at")
			});
			if (mode === "pending") return update.where("delivery_queue_entries.status", "=", "pending");
			return mode === "complete" ? update.where("delivery_queue_entries.status", "in", ["pending", "failed"]) : update;
		});
	});
}
const deliveryQueueUpserts = /* @__PURE__ */ new WeakMap();
/** Mutates only the exact supplied shared-state handle; never opens or hardens a file. */
function upsertBoundDeliveryQueueEntryInDatabase(bound, database) {
	const mode = bound.insertOnly ? "insert" : bound.updatePendingOnly ? "pending" : bound.completeExisting ? "complete" : "replace";
	let queries = deliveryQueueUpserts.get(database.db);
	if (!queries) {
		queries = {};
		deliveryQueueUpserts.set(database.db, queries);
	}
	return (queries[mode] ??= createDeliveryQueueUpsert(database.db, mode))(bound.row).numAffectedRows === 1n;
}
/** Recovery and media custody share the same inventory of unfinished work. */
function deliveryQueueEntriesQuery(database, queueNames, mode) {
	const query = getNodeSqliteKysely(database.db).selectFrom("delivery_queue_entries").select(deliveryQueueRowColumns).where("queue_name", "in", queueNames);
	return mode === "all" ? query : query.where((eb) => mode === "pending" ? eb("status", "=", "pending") : eb.or([eb("status", "=", "pending"), eb.and([eb("status", "=", "failed"), eb("recovery_state", "=", "settlement_pending")])]));
}
function createDeliveryQueueRead(database, mode) {
	return prepareSqliteQueryTakeFirstSync(database.db, (parameter) => deliveryQueueEntriesQuery(database, [parameter((params) => params.queueName)], mode).where("id", "=", parameter((params) => params.id)));
}
const deliveryQueueReads = /* @__PURE__ */ new WeakMap();
/** Reads one row from the exact supplied handle for cross-owner invariant validation. */
function loadDeliveryQueueEntryInDatabase(database, queueName, id, mode = "all") {
	let queries = deliveryQueueReads.get(database.db);
	if (!queries) {
		queries = {};
		deliveryQueueReads.set(database.db, queries);
	}
	const readMode = mode === "all" || mode === "pending" ? mode : "unfinished";
	const row = (queries[readMode] ??= createDeliveryQueueRead(database, readMode))({
		queueName,
		id
	});
	return row ? inflateDeliveryQueueRow(row) : null;
}
//#endregion
//#region src/infra/delivery-queue-sqlite.types.ts
/** Parse only the shipped completion-retention shape for one exact producer ID. */
function parseDeliveryQueueCompletionRetention(value, id) {
	if (value === "permanent") return value;
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const retention = value;
	const idPrefix = typeof retention.idPrefix === "string" ? retention.idPrefix : "";
	const maxAgeMs = asPositiveSafeInteger(retention.maxAgeMs);
	const maxEntries = asPositiveSafeInteger(retention.maxEntries);
	if (!idPrefix || !id.startsWith(idPrefix) || maxAgeMs === void 0 || maxEntries === void 0) return;
	return {
		idPrefix,
		maxAgeMs,
		maxEntries
	};
}
const finite = (value) => typeof value === "number" && Number.isFinite(value);
/** Recover only authored or shipped producer ownership from a failed entry. */
function inferDeliveryQueueFailureRetention(entry, id, queueName, legacyAmbiguousSendEvidence = false) {
	const explicit = parseDeliveryQueueCompletionRetention(entry.completionRetention, id) ?? parseDeliveryQueueCompletionRetention(entry.failureRetention, id);
	if (explicit) return explicit;
	const fence = asNullableRecord(asNullableRecord(entry.terminalPolicy)?.fence);
	if (fence?.kind === "none") return;
	const fenced = fence?.kind === "permanent" ? "permanent" : parseDeliveryQueueCompletionRetention(fence, id);
	if (fenced) return fenced;
	const durable = queueName === "outbound-preparing-v1" || queueName === "outbound-legacy-preparing-v1" || queueName === "outbound-prepared-migration-v1" || entry.retainOnFailure === true || asNullableRecord(entry.deliveryCompletion) !== null || queueName === "session" && finite(entry.availableAt);
	const ambiguous = legacyAmbiguousSendEvidence && (typeof entry.platformSendAttemptId === "string" && entry.platformSendAttemptId.length > 0 || finite(entry.platformSendStartedAt) || entry.recoveryState === "send_attempt_started" || entry.recoveryState === "unknown_after_send" || queueName === "session" && (finite(entry.deliveryStartedAt) || typeof entry.settlementOutcome === "string" && entry.settlementOutcome.length > 0 || finite(entry.acknowledgedAt)));
	return durable || ambiguous ? "permanent" : void 0;
}
/** Additional work needs a live claim; settling an observed outcome only needs exact ownership. */
function hasLiveDeliveryQueueClaim(entry, claimId, now) {
	const unexpired = typeof entry.availableAt === "number" && entry.availableAt > now;
	return entry.recoveryState === "producer_claimed" ? entry.producerClaimId === claimId && unexpired : (entry.recoveryState === "send_attempt_started" || entry.recoveryState === "unknown_after_send") && entry.platformSendAttemptId === claimId && (entry.requiresProducerClaim !== true || unexpired);
}
/** Strip a terminal queue row to the producer policy needed for admission. */
function projectDeliveryQueueTerminalEntry(entry, terminalAt, terminal, completionRetention) {
	const retryCount = Number.isSafeInteger(entry.retryCount) && entry.retryCount >= 0 ? entry.retryCount : 0;
	const recoveryState = completionRetention === "permanent" ? "completed_permanent" : completionRetention ? "completed_bounded" : void 0;
	return {
		id: entry.id,
		enqueuedAt: terminalAt,
		retryCount,
		...terminal === "completed" ? { acknowledgedAt: terminalAt } : { failedAt: terminalAt },
		...completionRetention ? { completionRetention } : {},
		...recoveryState ? { recoveryState } : {}
	};
}
//#endregion
//#region src/state/openclaw-state-db-delivery-queue-backfill.ts
function nonNegativeSafeInteger(value) {
	const number = typeof value === "bigint" ? Number(value) : value;
	return typeof number === "number" && Number.isSafeInteger(number) && number >= 0 ? number : void 0;
}
const inferLegacyRetention = (entry, id, queue) => inferDeliveryQueueFailureRetention(entry ?? {}, id, queue, true);
/** Compact every preexisting failed row without inferring replay or owner policy. */
function compactLegacyDeliveryQueueFailures(db) {
	const migrationNow = Date.now();
	const retainPending = db.prepare(`UPDATE delivery_queue_entries SET entry_json = ?
      WHERE queue_name = ? AND id = ? AND status = 'pending' AND entry_json = ?`);
	const select = db.prepare(`SELECT queue_name, id, status, retry_count, entry_json, updated_at, failed_at, recovery_state
       FROM delivery_queue_entries WHERE status IN ('pending', 'failed')`);
	select.setReadBigInts(true);
	const rows = select.all();
	const remove = db.prepare(`DELETE FROM delivery_queue_entries WHERE queue_name = ? AND id = ? AND status = 'failed'`);
	const compact = db.prepare(`UPDATE delivery_queue_entries
        SET entry_kind = NULL, session_key = NULL, channel = NULL, target = NULL,
            account_id = NULL, retry_count = @retryCount, last_attempt_at = NULL,
            last_error = NULL, platform_send_started_at = NULL, entry_json = @entryJson,
            enqueued_at = @failedAt, failed_at = @failedAt, recovery_state = @recoveryState
      WHERE queue_name = @queueName AND id = @id AND status = 'failed'`);
	for (const row of rows) {
		if (row.recovery_state === "settlement_pending") continue;
		const parsedEntry = safeParseJsonRecord(String(row.entry_json));
		const queueName = String(row.queue_name);
		const id = String(row.id);
		if (row.status === "pending") {
			if (parsedEntry?.retainOnFailure !== true && inferLegacyRetention(parsedEntry, id, queueName)) retainPending.run(JSON.stringify({
				...parsedEntry,
				retainOnFailure: true
			}), queueName, id, String(row.entry_json));
			continue;
		}
		const failedAt = nonNegativeSafeInteger(row.failed_at) ?? nonNegativeSafeInteger(row.updated_at) ?? migrationNow;
		const entry = parsedEntry ?? {};
		const retryCount = Math.max(nonNegativeSafeInteger(row.retry_count) ?? 0, nonNegativeSafeInteger(entry.retryCount) ?? 0);
		const retention = parsedEntry ? inferLegacyRetention(entry, id, queueName) : "permanent";
		if (!retention) {
			remove.run(queueName, id);
			continue;
		}
		const failedEntry = projectDeliveryQueueTerminalEntry({
			id,
			retryCount
		}, failedAt, "failed", retention);
		compact.run({
			retryCount,
			entryJson: JSON.stringify(failedEntry),
			failedAt,
			recoveryState: failedEntry.recoveryState ?? null,
			queueName,
			id
		});
	}
	pruneDeliveryQueueTombstones(db, migrationNow);
}
//#endregion
//#region src/state/openclaw-state-schema.ts
const OPENCLAW_STATE_SCHEMA_SQL = "\n\nCREATE TABLE IF NOT EXISTS mcp_oauth_stores (\n  store_key TEXT NOT NULL PRIMARY KEY,\n  format_version INTEGER NOT NULL CHECK (format_version = 1),\n  store_json TEXT NOT NULL,\n  updated_at INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS mcp_oauth_pending_authorizations (\n  state TEXT NOT NULL PRIMARY KEY,\n  store_key TEXT NOT NULL,\n  create_time INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS diagnostic_events (\n  scope TEXT NOT NULL,\n  event_key TEXT NOT NULL,\n  payload_json TEXT NOT NULL,\n  created_at INTEGER NOT NULL,\n  sequence INTEGER NOT NULL DEFAULT 0,\n  PRIMARY KEY (scope, event_key)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_diagnostic_events_scope_sequence\n  ON diagnostic_events(scope, sequence, event_key);\n\nCREATE TABLE IF NOT EXISTS skill_usage (\n  skill_file TEXT NOT NULL PRIMARY KEY,\n  skill_key TEXT NOT NULL,\n  skill_name TEXT NOT NULL,\n  skill_source TEXT NOT NULL,\n  first_used_at_ms INTEGER NOT NULL,\n  last_used_at_ms INTEGER NOT NULL,\n  use_count INTEGER NOT NULL,\n  last_agent_id TEXT\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_skill_usage_key\n  ON skill_usage(skill_key, skill_file);\n\n-- Profile-owned skill library: additive, absent until first publication/import.\nCREATE TABLE IF NOT EXISTS skill_library_entries (\n  skill_id TEXT NOT NULL PRIMARY KEY,\n  owner_profile_id TEXT,\n  author_profile_id TEXT NOT NULL,\n  slug TEXT NOT NULL,\n  current_revision TEXT NOT NULL,\n  shared INT NOT NULL,\n  enabled INT NOT NULL,\n  removed INT NOT NULL,\n  created_at INT NOT NULL,\n  updated_at INT NOT NULL\n) STRICT;\nCREATE TABLE IF NOT EXISTS skill_library_revisions (\n  skill_id TEXT NOT NULL,\n  revision TEXT NOT NULL,\n  description TEXT NOT NULL,\n  files_json TEXT NOT NULL,\n  created_at INT NOT NULL,\n  PRIMARY KEY (skill_id, revision)\n) STRICT;\nCREATE TABLE IF NOT EXISTS skill_library_events (\n  event_id TEXT NOT NULL PRIMARY KEY,\n  skill_id TEXT NOT NULL,\n  revision TEXT NOT NULL,\n  action TEXT NOT NULL,\n  actor_profile_id TEXT NOT NULL,\n  created_at INT NOT NULL\n) STRICT;\nCREATE TABLE IF NOT EXISTS skill_library_uploads (\n  upload_id TEXT NOT NULL PRIMARY KEY,\n  owner_profile_id TEXT NOT NULL,\n  slug TEXT NOT NULL,\n  size_bytes INT NOT NULL,\n  sha256 TEXT NOT NULL,\n  archive_blob BLOB NOT NULL,\n  expires_at INT NOT NULL,\n  published_skill_id TEXT\n) STRICT;\n-- End profile-owned skill library.\n\nCREATE TABLE IF NOT EXISTS skill_workshop_proposals (\n  proposal_id TEXT NOT NULL PRIMARY KEY,\n  record_json TEXT NOT NULL,\n  owner_agent_id TEXT,\n  kind TEXT NOT NULL CHECK (kind IN ('create', 'update')),\n  status TEXT NOT NULL CHECK (status IN ('pending', 'applied', 'rejected', 'quarantined', 'stale')),\n  created_at TEXT NOT NULL,\n  updated_at TEXT NOT NULL,\n  draft_hash TEXT NOT NULL,\n  origin_agent_id TEXT,\n  origin_session_key TEXT,\n  origin_run_id TEXT,\n  origin_message_id TEXT,\n  applied_at TEXT,\n  rejected_at TEXT,\n  quarantined_at TEXT,\n  stale_at TEXT,\n  status_reason TEXT\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS skill_workshop_collection_reviews (\n  review_id TEXT NOT NULL PRIMARY KEY,\n  owner_agent_id TEXT NOT NULL,\n  backup_id TEXT NOT NULL,\n  create_time INTEGER NOT NULL,\n  kept_names_json TEXT NOT NULL,\n  written_names_json TEXT NOT NULL,\n  dropped_json TEXT NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_skill_workshop_collection_reviews_owner_time\n  ON skill_workshop_collection_reviews(owner_agent_id, create_time DESC, review_id);\n\nCREATE TABLE IF NOT EXISTS skill_workshop_proposal_rollbacks (\n  proposal_id TEXT NOT NULL PRIMARY KEY,\n  written_at TEXT NOT NULL,\n  target_skill_file TEXT NOT NULL,\n  action TEXT NOT NULL CHECK (action IN ('create', 'update')),\n  previous_content_hash TEXT,\n  previous_content TEXT,\n  support_files_json TEXT,\n  FOREIGN KEY (proposal_id) REFERENCES skill_workshop_proposals(proposal_id) ON DELETE CASCADE\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS skill_workshop_proposal_events (\n  sequence INTEGER PRIMARY KEY AUTOINCREMENT,\n  event_id TEXT NOT NULL UNIQUE,\n  proposal_id TEXT NOT NULL,\n  proposed_version TEXT NOT NULL,\n  revision_hash TEXT NOT NULL,\n  event_type TEXT NOT NULL CHECK (event_type IN (\n    'created',\n    'revised',\n    'evaluation_completed',\n    'applied',\n    'rejected',\n    'quarantined',\n    'stale'\n  )),\n  occurred_at TEXT NOT NULL,\n  actor_json TEXT NOT NULL,\n  correlation_id TEXT,\n  payload_json TEXT,\n  FOREIGN KEY (proposal_id) REFERENCES skill_workshop_proposals(proposal_id) ON DELETE CASCADE\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS audit_events (\n  sequence INTEGER PRIMARY KEY AUTOINCREMENT,\n  event_id TEXT NOT NULL UNIQUE,\n  source_id TEXT NOT NULL UNIQUE,\n  schema_version INTEGER NOT NULL DEFAULT 1,\n  source_sequence INTEGER NOT NULL,\n  occurred_at INTEGER NOT NULL,\n  kind TEXT NOT NULL,\n  action TEXT NOT NULL,\n  status TEXT NOT NULL,\n  error_code TEXT,\n  actor_type TEXT NOT NULL,\n  actor_id TEXT NOT NULL,\n  agent_id TEXT,\n  session_key TEXT,\n  session_id TEXT,\n  run_id TEXT,\n  tool_call_id TEXT,\n  tool_name TEXT,\n  direction TEXT,\n  channel TEXT,\n  conversation_kind TEXT,\n  message_outcome TEXT,\n  reason_code TEXT,\n  delivery_kind TEXT,\n  failure_stage TEXT,\n  duration_ms INTEGER,\n  result_count INTEGER,\n  account_ref TEXT,\n  conversation_ref TEXT,\n  message_ref TEXT,\n  target_ref TEXT\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_audit_events_time\n  ON audit_events(occurred_at DESC, sequence DESC);\n\nCREATE INDEX IF NOT EXISTS idx_audit_events_agent_sequence\n  ON audit_events(agent_id, sequence DESC);\n\nCREATE INDEX IF NOT EXISTS idx_audit_events_session_sequence\n  ON audit_events(session_key, sequence DESC);\n\nCREATE INDEX IF NOT EXISTS idx_audit_events_run_sequence\n  ON audit_events(run_id, sequence DESC);\n\nCREATE INDEX IF NOT EXISTS idx_audit_events_kind_sequence\n  ON audit_events(kind, sequence DESC);\n\nCREATE INDEX IF NOT EXISTS idx_audit_events_status_sequence\n  ON audit_events(status, sequence DESC);\n\nCREATE INDEX IF NOT EXISTS idx_audit_events_channel_sequence\n  ON audit_events(channel, sequence DESC);\n\nCREATE INDEX IF NOT EXISTS idx_audit_events_direction_sequence\n  ON audit_events(direction, sequence DESC);\n\nCREATE TABLE IF NOT EXISTS outbound_message_execution_bindings (\n  event_id TEXT NOT NULL PRIMARY KEY,\n  context_id TEXT NOT NULL CHECK (length(context_id) BETWEEN 1 AND 256),\n  execution_id TEXT NOT NULL CHECK (length(execution_id) BETWEEN 1 AND 256),\n  run_id TEXT NOT NULL CHECK (length(run_id) BETWEEN 1 AND 256),\n  FOREIGN KEY (event_id) REFERENCES audit_events(event_id) ON DELETE CASCADE\n) STRICT;\nCREATE INDEX IF NOT EXISTS outbound_message_execution_bindings_execution_event_idx\n  ON outbound_message_execution_bindings (context_id, execution_id, run_id, event_id);\n\nCREATE TABLE IF NOT EXISTS outbound_message_progress (\n  sequence INTEGER PRIMARY KEY AUTOINCREMENT,\n  progress_id TEXT NOT NULL UNIQUE CHECK (length(progress_id) BETWEEN 1 AND 256),\n  source_id TEXT NOT NULL UNIQUE CHECK (length(source_id) BETWEEN 1 AND 512),\n  source_sequence INTEGER NOT NULL CHECK (source_sequence >= 1),\n  schema_version INTEGER NOT NULL CHECK (schema_version = 1),\n  occurred_at INTEGER NOT NULL CHECK (occurred_at >= 0),\n  action TEXT NOT NULL CHECK (\n    action IN ('message.outbound.queued', 'message.outbound.platform-started')\n  ),\n  outcome TEXT NOT NULL CHECK (outcome IN ('queued', 'platform_started')),\n  actor_type TEXT NOT NULL CHECK (actor_type IN ('agent', 'system')),\n  actor_id TEXT NOT NULL CHECK (length(actor_id) BETWEEN 1 AND 256),\n  agent_id TEXT CHECK (agent_id IS NULL OR length(agent_id) BETWEEN 1 AND 256),\n  run_id TEXT CHECK (run_id IS NULL OR length(run_id) BETWEEN 1 AND 256),\n  context_id TEXT,\n  execution_id TEXT,\n  channel TEXT NOT NULL CHECK (length(channel) BETWEEN 1 AND 256),\n  conversation_kind TEXT NOT NULL CHECK (\n    conversation_kind IN ('direct', 'group', 'channel', 'unknown')\n  ),\n  duration_ms INTEGER CHECK (duration_ms IS NULL OR duration_ms >= 0),\n  account_ref TEXT,\n  conversation_ref TEXT,\n  target_ref TEXT,\n  UNIQUE (occurred_at, progress_id)\n) STRICT;\nCREATE INDEX IF NOT EXISTS outbound_message_progress_occurred_idx\n  ON outbound_message_progress (occurred_at, sequence);\nCREATE INDEX IF NOT EXISTS outbound_message_progress_run_occurred_idx\n  ON outbound_message_progress (run_id, occurred_at, sequence);\n\nCREATE TABLE IF NOT EXISTS audit_identity_keys (\n  id INTEGER NOT NULL PRIMARY KEY CHECK (id = 1),\n  key_id TEXT NOT NULL,\n  key BLOB NOT NULL,\n  created_at INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS config_revision_keys (\n  id INTEGER NOT NULL PRIMARY KEY CHECK (id = 1),\n  hmac_key BLOB NOT NULL CHECK (length(hmac_key) = 32)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS execution_identity_contexts (\n  context_id TEXT NOT NULL PRIMARY KEY CHECK (length(context_id) BETWEEN 1 AND 256),\n  execution_id TEXT NOT NULL UNIQUE CHECK (length(execution_id) BETWEEN 1 AND 256),\n  run_id TEXT NOT NULL CHECK (length(run_id) BETWEEN 1 AND 256),\n  created_at INTEGER NOT NULL CHECK (created_at >= 0),\n  coverage_state TEXT NOT NULL CHECK (\n    coverage_state IN ('attribution-only', 'unattributed', 'unknown', 'unsupported')\n  ),\n  context_bytes INTEGER NOT NULL CHECK (context_bytes BETWEEN 1 AND 16384),\n  context_json TEXT NOT NULL CHECK (length(context_json) > 0),\n  UNIQUE (created_at, context_id)\n) STRICT;\nCREATE INDEX IF NOT EXISTS execution_identity_contexts_run_created_idx\n  ON execution_identity_contexts (run_id, created_at, execution_id);\n\nCREATE TABLE IF NOT EXISTS execution_decision_facts (\n  receipt_id TEXT NOT NULL PRIMARY KEY CHECK (length(receipt_id) BETWEEN 1 AND 256),\n  context_id TEXT NOT NULL CHECK (length(context_id) BETWEEN 1 AND 256),\n  execution_id TEXT NOT NULL CHECK (length(execution_id) BETWEEN 1 AND 256),\n  run_id TEXT NOT NULL CHECK (length(run_id) BETWEEN 1 AND 256),\n  action_id TEXT CHECK (action_id IS NULL OR length(action_id) BETWEEN 1 AND 256),\n  action_family TEXT NOT NULL CHECK (length(action_family) BETWEEN 1 AND 256),\n  decision_outcome TEXT NOT NULL CHECK (\n    decision_outcome IN ('allowed', 'denied', 'not-applicable', 'unknown')\n  ),\n  coverage_state TEXT NOT NULL CHECK (\n    coverage_state IN ('enforced', 'attribution-only', 'unattributed', 'unknown', 'unsupported')\n  ),\n  reason_code TEXT NOT NULL CHECK (length(reason_code) BETWEEN 1 AND 256),\n  owner TEXT NOT NULL CHECK (length(owner) BETWEEN 1 AND 256),\n  source_ref TEXT NOT NULL CHECK (length(source_ref) BETWEEN 1 AND 256),\n  occurred_at INTEGER NOT NULL CHECK (occurred_at >= 0),\n  receipt_bytes INTEGER NOT NULL CHECK (receipt_bytes BETWEEN 1 AND 16384),\n  receipt_json TEXT NOT NULL CHECK (length(receipt_json) > 0),\n  UNIQUE (occurred_at, receipt_id)\n) STRICT;\nCREATE INDEX IF NOT EXISTS execution_decision_facts_context_occurred_idx\n  ON execution_decision_facts (context_id, occurred_at, receipt_id);\nCREATE INDEX IF NOT EXISTS execution_decision_facts_run_occurred_idx\n  ON execution_decision_facts (run_id, occurred_at, receipt_id);\n\n-- Exact admission identity stays separate from owner-native lifecycle rows so\n-- older readers retain byte-compatible cron/task/flow table definitions.\nCREATE TABLE IF NOT EXISTS execution_owner_lifecycle_bindings (\n  owner_kind TEXT NOT NULL,\n  owner_id TEXT NOT NULL,\n  context_id TEXT NOT NULL,\n  execution_id TEXT NOT NULL,\n  PRIMARY KEY (owner_kind, owner_id)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS session_state_events (\n  sequence INTEGER PRIMARY KEY AUTOINCREMENT,\n  dedupe_key TEXT UNIQUE,\n  session_key TEXT NOT NULL,\n  session_id TEXT,\n  agent_id TEXT NOT NULL,\n  kind TEXT NOT NULL,\n  actor_type TEXT NOT NULL,\n  actor_id TEXT,\n  run_id TEXT,\n  occurred_at INTEGER NOT NULL,\n  summary TEXT NOT NULL,\n  payload_json TEXT\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_session_state_events_session_sequence\n  ON session_state_events(session_key, sequence DESC);\n\nCREATE INDEX IF NOT EXISTS idx_session_state_events_time\n  ON session_state_events(occurred_at DESC, sequence DESC);\n\nCREATE TABLE IF NOT EXISTS session_state_heads (\n  session_key TEXT NOT NULL,\n  agent_id TEXT NOT NULL,\n  last_sequence INTEGER NOT NULL,\n  pruned_max_sequence INTEGER NOT NULL DEFAULT 0,\n  updated_at INTEGER NOT NULL,\n  PRIMARY KEY (session_key, agent_id)\n) STRICT;\n\n-- Notifiable watcher identity is the bare session key, matching the process-local\n-- system-event queue it feeds. Provenance distinguishes explicit immediate-wake\n-- watches from ambient queue-only group watches. Other bare keys\n-- (session.scope=\"global\") are ambiguous across agents and excluded until watcher\n-- identity is agent-scoped end-to-end.\nCREATE TABLE IF NOT EXISTS session_watch_cursors (\n  watcher_session_key TEXT NOT NULL,\n  watcher_store_path TEXT,\n  target_session_key TEXT NOT NULL,\n  last_seen_sequence INTEGER NOT NULL DEFAULT 0,\n  notified_sequence INTEGER NOT NULL DEFAULT 0,\n  material_sequence INTEGER NOT NULL DEFAULT 0,\n  provenance TEXT NOT NULL DEFAULT 'explicit' CHECK (provenance IN ('explicit', 'ambient-group')),\n  updated_at INTEGER NOT NULL,\n  PRIMARY KEY (watcher_session_key, target_session_key)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_session_watch_cursors_target\n  ON session_watch_cursors(target_session_key);\n\nCREATE TABLE IF NOT EXISTS session_upstream_links (\n  session_key TEXT NOT NULL,\n  agent_id TEXT NOT NULL,\n  catalog_id TEXT NOT NULL,\n  host_id TEXT NOT NULL,\n  thread_id TEXT NOT NULL,\n  upstream_kind TEXT NOT NULL,\n  upstream_ref_json TEXT,\n  last_marker_json TEXT,\n  last_scanned_at INTEGER,\n  created_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL,\n  -- (session_key, agent_id) composite identity: under session.scope=\"global\" agents\n  -- share bare keys; a key-only row would let one agent overwrite another's upstream.\n  PRIMARY KEY (session_key, agent_id)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_session_upstream_links_catalog_id\n  ON session_upstream_links(catalog_id);\n\nCREATE TABLE IF NOT EXISTS state_leases (\n  scope TEXT NOT NULL,\n  lease_key TEXT NOT NULL,\n  owner TEXT NOT NULL,\n  expires_at INTEGER,\n  heartbeat_at INTEGER,\n  payload_json TEXT,\n  created_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL,\n  PRIMARY KEY (scope, lease_key)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_state_leases_expiry\n  ON state_leases(expires_at, scope, lease_key)\n  WHERE expires_at IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_state_leases_owner\n  ON state_leases(owner, updated_at DESC);\n\nCREATE TABLE IF NOT EXISTS exec_approvals_config (\n  config_key TEXT NOT NULL PRIMARY KEY,\n  raw_json TEXT NOT NULL,\n  socket_path TEXT,\n  has_socket_token INTEGER NOT NULL,\n  default_security TEXT,\n  default_ask TEXT,\n  default_ask_fallback TEXT,\n  auto_allow_skills INTEGER,\n  agent_count INTEGER NOT NULL,\n  allowlist_count INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS operator_approvals (\n  approval_id TEXT NOT NULL PRIMARY KEY CHECK (\n    length(approval_id) > 0 AND approval_id NOT IN ('.', '..')\n  ),\n  resolution_ref TEXT NOT NULL CHECK (\n    length(resolution_ref) = 43 AND resolution_ref NOT GLOB '*[^A-Za-z0-9_-]*'\n  ),\n  kind TEXT NOT NULL CHECK (kind IN ('exec', 'plugin', 'system-agent')),\n  status TEXT NOT NULL CHECK (status IN ('pending', 'allowed', 'denied', 'expired', 'cancelled')),\n  presentation_json TEXT NOT NULL,\n  requested_by_device_id TEXT,\n  requested_by_client_id TEXT,\n  requested_by_device_token_auth INTEGER NOT NULL DEFAULT 0,\n  reviewer_device_ids_json TEXT NOT NULL,\n  source_agent_id TEXT,\n  source_session_key TEXT,\n  source_session_id TEXT,\n  source_run_id TEXT,\n  source_tool_call_id TEXT,\n  source_tool_name TEXT,\n  audience_session_keys_json TEXT NOT NULL,\n  runtime_epoch TEXT NOT NULL,\n  created_at_ms INTEGER NOT NULL,\n  expires_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  decision TEXT CHECK (decision IN ('allow-once', 'allow-always', 'deny')),\n  terminal_reason TEXT CHECK (\n    terminal_reason IN (\n      'user',\n      'timeout',\n      'malformed-verdict',\n      'no-route',\n      'run-aborted',\n      'gateway-restart',\n      'storage-corrupt'\n    )\n  ),\n  resolved_at_ms INTEGER,\n  resolver_kind TEXT CHECK (resolver_kind IN ('device', 'channel', 'runtime', 'system')),\n  resolver_id TEXT,\n  consumed_at_ms INTEGER,\n  consumed_by TEXT,\n  CHECK (expires_at_ms >= created_at_ms),\n  CHECK (updated_at_ms >= created_at_ms),\n  CHECK (resolved_at_ms IS NULL OR resolved_at_ms >= created_at_ms),\n  CHECK (resolved_at_ms IS NULL OR resolved_at_ms <= updated_at_ms),\n  CHECK (consumed_at_ms IS NULL OR consumed_at_ms >= resolved_at_ms),\n  CHECK (consumed_at_ms IS NULL OR consumed_at_ms <= updated_at_ms),\n  CHECK (requested_by_device_token_auth IN (0, 1)),\n  CHECK (\n    (\n      status = 'pending'\n      AND decision IS NULL\n      AND terminal_reason IS NULL\n      AND resolved_at_ms IS NULL\n      AND resolver_kind IS NULL\n      AND resolver_id IS NULL\n      AND consumed_at_ms IS NULL\n      AND consumed_by IS NULL\n    )\n    OR (\n      status = 'allowed'\n      AND decision IN ('allow-once', 'allow-always')\n      AND terminal_reason = 'user'\n      AND resolved_at_ms IS NOT NULL\n      AND resolver_kind IS NOT NULL\n    )\n    OR (\n      status = 'denied'\n      AND decision = 'deny'\n      AND terminal_reason IN ('user', 'malformed-verdict', 'no-route', 'storage-corrupt')\n      AND resolved_at_ms IS NOT NULL\n      AND resolver_kind IS NOT NULL\n      AND consumed_at_ms IS NULL\n      AND consumed_by IS NULL\n    )\n    OR (\n      status = 'expired'\n      AND decision = 'deny'\n      AND terminal_reason = 'timeout'\n      AND resolved_at_ms IS NOT NULL\n      AND resolver_kind IS NOT NULL\n      AND consumed_at_ms IS NULL\n      AND consumed_by IS NULL\n    )\n    OR (\n      status = 'cancelled'\n      AND decision = 'deny'\n      AND terminal_reason IN ('run-aborted', 'gateway-restart')\n      AND resolved_at_ms IS NOT NULL\n      AND resolver_kind IS NOT NULL\n      AND consumed_at_ms IS NULL\n      AND consumed_by IS NULL\n    )\n  ),\n  CHECK (\n    (consumed_at_ms IS NULL AND consumed_by IS NULL)\n    OR (\n      status = 'allowed'\n      AND decision = 'allow-once'\n      AND consumed_at_ms IS NOT NULL\n      AND consumed_by IS NOT NULL\n    )\n  )\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_operator_approvals_status_expiry\n  ON operator_approvals(status, expires_at_ms, approval_id);\n\nCREATE UNIQUE INDEX IF NOT EXISTS idx_operator_approvals_resolution_ref\n  ON operator_approvals(resolution_ref);\n\nCREATE INDEX IF NOT EXISTS idx_operator_approvals_source_session_created\n  ON operator_approvals(source_session_key, created_at_ms DESC, approval_id);\n\nCREATE INDEX IF NOT EXISTS idx_operator_approvals_source_run_resolved\n  ON operator_approvals(source_run_id, resolved_at_ms, approval_id)\n  WHERE source_run_id IS NOT NULL AND resolved_at_ms IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_operator_approvals_resolved\n  ON operator_approvals(resolved_at_ms, approval_id)\n  WHERE resolved_at_ms IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_operator_approvals_runtime_pending\n  ON operator_approvals(runtime_epoch, approval_id)\n  WHERE status = 'pending';\n\nCREATE TABLE IF NOT EXISTS operator_approval_execution_identities (\n  approval_id TEXT NOT NULL PRIMARY KEY\n    REFERENCES operator_approvals(approval_id) ON DELETE CASCADE,\n  source_context_id TEXT NOT NULL CHECK (\n    length(source_context_id) BETWEEN 1 AND 256 AND source_context_id = trim(source_context_id)\n  ),\n  source_execution_id TEXT NOT NULL CHECK (\n    length(source_execution_id) BETWEEN 1 AND 256 AND source_execution_id = trim(source_execution_id)\n  )\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS operator_approval_standing_grants (\n  grant_id TEXT NOT NULL PRIMARY KEY CHECK (length(grant_id) > 0),\n  minted_by_approval_id TEXT NOT NULL\n    REFERENCES operator_approvals(approval_id) ON DELETE CASCADE,\n  agent_id TEXT NOT NULL CHECK (length(agent_id) > 0),\n  cron_job_id TEXT NOT NULL CHECK (length(cron_job_id) > 0),\n  job_config_revision TEXT NOT NULL CHECK (length(job_config_revision) > 0),\n  operation_binding TEXT NOT NULL CHECK (length(operation_binding) > 0),\n  created_at_ms INTEGER NOT NULL,\n  expires_at_ms INTEGER CHECK (expires_at_ms IS NULL OR expires_at_ms >= created_at_ms),\n  revoked_at_ms INTEGER,\n  revoked_by TEXT,\n  last_used_at_ms INTEGER,\n  use_count INTEGER NOT NULL DEFAULT 0\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_operator_approval_standing_grants_binding\n  ON operator_approval_standing_grants(agent_id, cron_job_id, operation_binding, created_at_ms DESC);\n\nCREATE TABLE IF NOT EXISTS operator_approval_standing_grant_generations (\n  grant_id TEXT NOT NULL PRIMARY KEY\n    REFERENCES operator_approval_standing_grants(grant_id) ON DELETE CASCADE,\n  job_definition_generation INTEGER NOT NULL CHECK (job_definition_generation >= 1)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS schema_meta (\n  meta_key TEXT NOT NULL PRIMARY KEY,\n  role TEXT NOT NULL,\n  schema_version INTEGER NOT NULL,\n  agent_id TEXT,\n  app_version TEXT,\n  created_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS config_machine_state (\n  state_key TEXT NOT NULL PRIMARY KEY,\n  value_json TEXT NOT NULL,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS device_pairing_pending (\n  request_id TEXT NOT NULL PRIMARY KEY,\n  device_id TEXT NOT NULL,\n  public_key TEXT NOT NULL,\n  display_name TEXT,\n  platform TEXT,\n  device_family TEXT,\n  client_id TEXT,\n  client_mode TEXT,\n  browser_origin TEXT,\n  role TEXT,\n  roles_json TEXT,\n  scopes_json TEXT,\n  remote_ip TEXT,\n  silent INTEGER,\n  is_repair INTEGER,\n  ts INTEGER NOT NULL,\n  refreshed_at_ms INTEGER\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_device_pairing_pending_device\n  ON device_pairing_pending(device_id, ts DESC);\n\nCREATE TABLE IF NOT EXISTS device_pairing_paired (\n  device_id TEXT NOT NULL PRIMARY KEY,\n  public_key TEXT NOT NULL,\n  display_name TEXT,\n  operator_label TEXT,\n  platform TEXT,\n  device_family TEXT,\n  client_id TEXT,\n  client_mode TEXT,\n  browser_origin TEXT,\n  role TEXT,\n  roles_json TEXT,\n  scopes_json TEXT,\n  approved_scopes_json TEXT,\n  remote_ip TEXT,\n  tokens_json TEXT,\n  approved_via TEXT,\n  node_surface_json TEXT,\n  pending_node_surface_json TEXT,\n  created_at_ms INTEGER NOT NULL,\n  approved_at_ms INTEGER NOT NULL,\n  last_seen_at_ms INTEGER,\n  last_seen_reason TEXT\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_device_pairing_paired_approved\n  ON device_pairing_paired(approved_at_ms DESC, device_id);\n\nCREATE TABLE IF NOT EXISTS device_bootstrap_tokens (\n  token_key TEXT NOT NULL PRIMARY KEY,\n  token TEXT NOT NULL,\n  setup_id TEXT,\n  ts INTEGER NOT NULL,\n  device_id TEXT,\n  public_key TEXT,\n  profile_json TEXT,\n  redeemed_profile_json TEXT,\n  pending_profile_json TEXT,\n  issued_at_ms INTEGER NOT NULL,\n  last_used_at_ms INTEGER\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_device_bootstrap_tokens_ts\n  ON device_bootstrap_tokens(ts);\n\n-- Terminal outcome of a redeemed setup credential. The bootstrap row is deleted\n-- on redemption, so this is the only durable proof a setup code succeeded; the\n-- presenting client reconciles it when the completion broadcast is missed.\n-- Non-secret only: never the bootstrap token or anything derived from it.\n-- Bounded by retention to a handful of live rows, so the primary key is the\n-- only access path worth having.\nCREATE TABLE IF NOT EXISTS device_pair_setup_completions (\n  setup_id TEXT NOT NULL PRIMARY KEY,\n  device_id TEXT NOT NULL,\n  device_name TEXT,\n  access TEXT NOT NULL,\n  completed_at_ms INTEGER NOT NULL,\n  delivery_state TEXT NOT NULL CHECK (delivery_state IN ('uncertain', 'confirmed')),\n  retain_until_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS device_pairing_join_codes (\n  shortcode TEXT,\n  payload_json TEXT,\n  created_at_ms INTEGER,\n  expires_at_ms INTEGER\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS device_identities (\n  identity_key TEXT NOT NULL PRIMARY KEY,\n  device_id TEXT NOT NULL,\n  public_key_pem TEXT NOT NULL,\n  private_key_pem TEXT NOT NULL,\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_device_identities_device\n  ON device_identities(device_id, updated_at_ms DESC);\n\nCREATE TABLE IF NOT EXISTS device_auth_tokens (\n  device_id TEXT NOT NULL,\n  role TEXT NOT NULL,\n  token TEXT NOT NULL,\n  scopes_json TEXT NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  PRIMARY KEY (device_id, role)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_device_auth_tokens_updated\n  ON device_auth_tokens(updated_at_ms DESC, device_id, role);\n\nCREATE TABLE IF NOT EXISTS gateway_origin_device_tokens (\n  gateway_scope TEXT NOT NULL,\n  device_id TEXT NOT NULL,\n  role TEXT NOT NULL,\n  token TEXT NOT NULL,\n  scopes_json TEXT NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  PRIMARY KEY (gateway_scope, device_id, role)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS macos_port_guardian_records (\n  pid INTEGER NOT NULL PRIMARY KEY,\n  port INTEGER NOT NULL,\n  command TEXT NOT NULL,\n  mode TEXT NOT NULL,\n  timestamp REAL NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_macos_port_guardian_records_port\n  ON macos_port_guardian_records(port, timestamp DESC);\n\nCREATE TABLE IF NOT EXISTS workspace_setup_state (\n  workspace_key TEXT NOT NULL PRIMARY KEY,\n  -- NULL only for attestation-only rows whose legacy source never recorded a\n  -- path (orphan hashed-key attestations); setup rows always carry one.\n  workspace_path TEXT,\n  -- NULL setup columns mean an attestation-only row: replaceWorkspaceAttestation\n  -- may record hashes before any setup milestone exists for the workspace.\n  version INTEGER,\n  bootstrap_seeded_at TEXT,\n  setup_completed_at TEXT,\n  updated_at INTEGER,\n  attested_at_ms INTEGER,\n  attestation_updated_at_ms INTEGER,\n  CHECK (version IS NULL OR workspace_path IS NOT NULL)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_workspace_setup_state_path\n  ON workspace_setup_state(workspace_path);\n\nCREATE TABLE IF NOT EXISTS workspace_path_aliases (\n  alias_key TEXT NOT NULL PRIMARY KEY,\n  alias_path TEXT NOT NULL,\n  workspace_key TEXT NOT NULL,\n  workspace_path TEXT NOT NULL,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_workspace_path_aliases_workspace\n  ON workspace_path_aliases(workspace_key);\n\n\n\nCREATE TABLE IF NOT EXISTS workspace_generated_bootstrap_hashes (\n  workspace_key TEXT NOT NULL,\n  filename TEXT NOT NULL,\n  sha256 TEXT NOT NULL,\n  PRIMARY KEY (workspace_key, filename),\n  FOREIGN KEY (workspace_key) REFERENCES workspace_setup_state(workspace_key) ON DELETE CASCADE\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS native_hook_relay_bridges (\n  relay_id TEXT NOT NULL PRIMARY KEY,\n  pid INTEGER NOT NULL,\n  hostname TEXT NOT NULL,\n  port INTEGER NOT NULL,\n  token TEXT NOT NULL,\n  expires_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_native_hook_relay_bridges_expires\n  ON native_hook_relay_bridges(expires_at_ms, relay_id);\n\nCREATE TABLE IF NOT EXISTS managed_outgoing_image_records (\n  attachment_id TEXT NOT NULL PRIMARY KEY,\n  session_key TEXT NOT NULL,\n  agent_id TEXT,\n  message_id TEXT,\n  created_at TEXT NOT NULL,\n  updated_at TEXT,\n  retention_class TEXT,\n  alt TEXT NOT NULL,\n  original_media_root TEXT NOT NULL,\n  original_media_id TEXT NOT NULL,\n  original_media_subdir TEXT NOT NULL,\n  original_content_type TEXT NOT NULL,\n  original_width INTEGER,\n  original_height INTEGER,\n  original_size_bytes INTEGER,\n  original_filename TEXT,\n  record_json TEXT NOT NULL,\n  cleanup_pending INTEGER NOT NULL DEFAULT 0 CHECK (cleanup_pending IN (0, 1))\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_managed_outgoing_images_session\n  ON managed_outgoing_image_records(session_key, created_at DESC, attachment_id);\n\nCREATE INDEX IF NOT EXISTS idx_managed_outgoing_images_message\n  ON managed_outgoing_image_records(session_key, message_id, attachment_id)\n  WHERE message_id IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_managed_outgoing_images_agent_session\n  ON managed_outgoing_image_records(session_key, agent_id, created_at DESC, attachment_id);\n\nCREATE INDEX IF NOT EXISTS idx_managed_outgoing_images_agent_message\n  ON managed_outgoing_image_records(session_key, agent_id, message_id, attachment_id)\n  WHERE message_id IS NOT NULL;\n\nCREATE TABLE IF NOT EXISTS channel_pairing_requests (\n  channel_key TEXT NOT NULL,\n  account_id TEXT NOT NULL,\n  request_id TEXT NOT NULL,\n  code TEXT NOT NULL,\n  created_at TEXT NOT NULL,\n  last_seen_at TEXT NOT NULL,\n  meta_json TEXT,\n  PRIMARY KEY (channel_key, account_id, request_id)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_channel_pairing_requests_code\n  ON channel_pairing_requests(channel_key, code);\n\nCREATE INDEX IF NOT EXISTS idx_channel_pairing_requests_created\n  ON channel_pairing_requests(channel_key, created_at, request_id);\n\nCREATE TABLE IF NOT EXISTS channel_pairing_allow_entries (\n  channel_key TEXT NOT NULL,\n  account_id TEXT NOT NULL,\n  entry TEXT NOT NULL,\n  sort_order INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL,\n  PRIMARY KEY (channel_key, account_id, entry)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_channel_pairing_allow_account\n  ON channel_pairing_allow_entries(channel_key, account_id, sort_order, entry);\n\nCREATE TABLE IF NOT EXISTS web_push_subscriptions (\n  endpoint_hash TEXT NOT NULL PRIMARY KEY,\n  subscription_id TEXT NOT NULL UNIQUE,\n  endpoint TEXT NOT NULL,\n  p256dh TEXT NOT NULL,\n  auth TEXT NOT NULL,\n  device_id TEXT,\n  user_profile_id TEXT,\n  preferences_json TEXT,\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_web_push_subscriptions_updated\n  ON web_push_subscriptions(updated_at_ms DESC, subscription_id);\n\nCREATE TABLE IF NOT EXISTS web_push_approval_deliveries (\n  approval_id TEXT NOT NULL\n    REFERENCES operator_approvals(approval_id) ON DELETE CASCADE,\n  subscription_id TEXT NOT NULL\n    REFERENCES web_push_subscriptions(subscription_id) ON DELETE CASCADE,\n  device_id TEXT NOT NULL,\n  user_profile_id TEXT,\n  prepared_at_ms INTEGER NOT NULL,\n  PRIMARY KEY (approval_id, subscription_id)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_web_push_approval_deliveries_subscription\n  ON web_push_approval_deliveries(subscription_id, approval_id);\n\nCREATE TABLE IF NOT EXISTS apns_registrations (\n  node_id TEXT NOT NULL PRIMARY KEY,\n  transport TEXT NOT NULL,\n  token TEXT,\n  relay_handle TEXT,\n  send_grant TEXT,\n  installation_id TEXT,\n  relay_origin TEXT,\n  topic TEXT NOT NULL,\n  environment TEXT NOT NULL,\n  distribution TEXT,\n  token_debug_suffix TEXT,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_apns_registrations_updated\n  ON apns_registrations(updated_at_ms DESC, node_id);\n\nCREATE TABLE IF NOT EXISTS apns_registration_tombstones (\n  node_id TEXT NOT NULL PRIMARY KEY,\n  deleted_at_ms INTEGER NOT NULL\n) STRICT;\n\n-- Node-host-owned launch journal. The descriptor and its credential remain\n-- process memory only; this table records bounded supervision facts.\nCREATE TABLE IF NOT EXISTS node_worker_launches (\n  launch_id TEXT NOT NULL PRIMARY KEY\n    CHECK (length(launch_id) BETWEEN 1 AND 256 AND instr(launch_id, char(0)) = 0),\n  plan_hash TEXT NOT NULL\n    CHECK (length(plan_hash) = 64 AND plan_hash NOT GLOB '*[^0-9a-f]*'),\n  gateway_namespace TEXT NOT NULL\n    CHECK (\n      length(gateway_namespace) BETWEEN 1 AND 128\n      AND gateway_namespace NOT GLOB '*[^A-Za-z0-9._-]*'\n      AND gateway_namespace GLOB '[A-Za-z0-9]*'\n    ),\n  environment_id TEXT NOT NULL\n    CHECK (length(environment_id) BETWEEN 1 AND 256 AND instr(environment_id, char(0)) = 0),\n  session_id TEXT NOT NULL\n    CHECK (length(session_id) BETWEEN 1 AND 256 AND instr(session_id, char(0)) = 0),\n  owner_epoch INTEGER NOT NULL CHECK (owner_epoch BETWEEN 1 AND 9007199254740991),\n  placement_generation INTEGER NOT NULL\n    CHECK (placement_generation BETWEEN 0 AND 9007199254740991),\n  run_id TEXT NOT NULL\n    CHECK (length(run_id) BETWEEN 1 AND 256 AND instr(run_id, char(0)) = 0),\n  state TEXT NOT NULL\n    CHECK (state IN ('pending', 'running', 'completed', 'failed', 'interrupted', 'cancelled')),\n  supervisor_pid INTEGER NOT NULL CHECK (supervisor_pid BETWEEN 1 AND 2147483647),\n  supervisor_start_time INTEGER NOT NULL\n    CHECK (supervisor_start_time BETWEEN 0 AND 9007199254740991),\n  worker_pid INTEGER CHECK (worker_pid IS NULL OR worker_pid BETWEEN 1 AND 2147483647),\n  worker_start_time INTEGER CHECK (\n    worker_start_time IS NULL OR worker_start_time BETWEEN 0 AND 9007199254740991\n  ),\n  result_json TEXT CHECK (\n    result_json IS NULL\n    OR (\n      length(CAST(result_json AS BLOB)) BETWEEN 1 AND 65536\n      AND instr(result_json, char(0)) = 0\n      AND json_valid(result_json)\n    )\n  ),\n  error_text TEXT CHECK (\n    error_text IS NULL\n    OR (\n      length(CAST(error_text AS BLOB)) BETWEEN 1 AND 4096\n      AND instr(error_text, char(0)) = 0\n      AND instr(error_text, char(10)) = 0\n      AND instr(error_text, char(13)) = 0\n    )\n  ),\n  completed_at_ms INTEGER CHECK (\n    completed_at_ms IS NULL OR completed_at_ms BETWEEN 0 AND 9007199254740991\n  ),\n  created_at_ms INTEGER NOT NULL CHECK (created_at_ms BETWEEN 0 AND 9007199254740991),\n  updated_at_ms INTEGER NOT NULL CHECK (\n    updated_at_ms BETWEEN created_at_ms AND 9007199254740991\n  ),\n  CHECK ((worker_pid IS NULL) = (worker_start_time IS NULL)),\n  CHECK (\n    (state = 'pending'\n      AND worker_pid IS NULL AND result_json IS NULL AND error_text IS NULL\n      AND completed_at_ms IS NULL)\n    OR\n    (state = 'running'\n      AND worker_pid IS NOT NULL AND result_json IS NULL AND error_text IS NULL\n      AND completed_at_ms IS NULL)\n    OR\n    (state = 'completed'\n      AND result_json IS NOT NULL AND error_text IS NULL\n      AND completed_at_ms BETWEEN created_at_ms AND updated_at_ms)\n    OR\n    (state IN ('failed', 'interrupted', 'cancelled')\n      AND result_json IS NULL AND error_text IS NOT NULL\n      AND completed_at_ms BETWEEN created_at_ms AND updated_at_ms)\n  )\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_node_worker_launches_terminal_completed\n  ON node_worker_launches(completed_at_ms, launch_id)\n  WHERE completed_at_ms IS NOT NULL;\n\nCREATE TABLE IF NOT EXISTS node_worker_launch_containers (\n  launch_id TEXT PRIMARY KEY,\n  container_json TEXT\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS node_worker_launch_cleanup (\n  launch_id TEXT NOT NULL PRIMARY KEY\n    REFERENCES node_worker_launches(launch_id) ON DELETE CASCADE,\n  cleanup_mode TEXT NOT NULL CHECK (cleanup_mode IN ('process-group', 'owned-anchor')),\n  lineage_settled INTEGER CHECK (lineage_settled IS NULL OR lineage_settled = 1)\n) STRICT;\n\n-- Turn receipts have a shorter lifetime than their physical worker owner.\n-- Keeping the launch running preserves capacity and predecessor cleanup semantics.\nCREATE TABLE IF NOT EXISTS node_worker_turns (\n  turn_id TEXT NOT NULL PRIMARY KEY\n    CHECK (length(turn_id) BETWEEN 1 AND 256 AND instr(turn_id, char(0)) = 0),\n  owner_launch_id TEXT NOT NULL\n    REFERENCES node_worker_launches(launch_id) ON DELETE CASCADE,\n  plan_hash TEXT NOT NULL\n    CHECK (length(plan_hash) = 64 AND plan_hash NOT GLOB '*[^0-9a-f]*'),\n  run_id TEXT NOT NULL\n    CHECK (length(run_id) BETWEEN 1 AND 256 AND instr(run_id, char(0)) = 0),\n  state TEXT NOT NULL\n    CHECK (state IN ('running', 'completed', 'failed', 'interrupted', 'cancelled')),\n  result_json TEXT CHECK (\n    result_json IS NULL\n    OR (\n      length(CAST(result_json AS BLOB)) BETWEEN 1 AND 65536\n      AND instr(result_json, char(0)) = 0\n      AND json_valid(result_json)\n    )\n  ),\n  error_text TEXT CHECK (\n    error_text IS NULL\n    OR (\n      length(CAST(error_text AS BLOB)) BETWEEN 1 AND 4096\n      AND instr(error_text, char(0)) = 0\n      AND instr(error_text, char(10)) = 0\n      AND instr(error_text, char(13)) = 0\n    )\n  ),\n  completed_at_ms INTEGER CHECK (\n    completed_at_ms IS NULL OR completed_at_ms BETWEEN 0 AND 9007199254740991\n  ),\n  created_at_ms INTEGER NOT NULL CHECK (created_at_ms BETWEEN 0 AND 9007199254740991),\n  updated_at_ms INTEGER NOT NULL CHECK (\n    updated_at_ms BETWEEN created_at_ms AND 9007199254740991\n  ),\n  CHECK (\n    (state = 'running'\n      AND result_json IS NULL AND error_text IS NULL AND completed_at_ms IS NULL)\n    OR\n    (state = 'completed'\n      AND result_json IS NOT NULL AND error_text IS NULL\n      AND completed_at_ms BETWEEN created_at_ms AND updated_at_ms)\n    OR\n    (state IN ('failed', 'interrupted', 'cancelled')\n      AND result_json IS NULL AND error_text IS NOT NULL\n      AND completed_at_ms BETWEEN created_at_ms AND updated_at_ms)\n  )\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_node_worker_turns_terminal_completed\n  ON node_worker_turns(completed_at_ms, turn_id)\n  WHERE completed_at_ms IS NOT NULL;\n\nCREATE UNIQUE INDEX IF NOT EXISTS idx_node_worker_turns_active_owner\n  ON node_worker_turns(owner_launch_id)\n  WHERE state = 'running';\n\nCREATE TABLE IF NOT EXISTS config_health_entries (\n  config_path TEXT NOT NULL PRIMARY KEY,\n  last_known_good_json TEXT,\n  last_promoted_good_json TEXT,\n  last_observed_suspicious_signature TEXT,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS clawhub_promotion_claims (\n  slug TEXT NOT NULL PRIMARY KEY,\n  provider TEXT,\n  model_keys_json TEXT NOT NULL,\n  ends_at_ms INTEGER NOT NULL,\n  claimed_at_ms INTEGER NOT NULL\n) STRICT;\n\n\n\nCREATE TABLE IF NOT EXISTS official_external_plugin_catalog_snapshots (\n  feed_url TEXT NOT NULL PRIMARY KEY,\n  body TEXT NOT NULL,\n  status INTEGER NOT NULL,\n  etag TEXT,\n  last_modified TEXT,\n  checksum TEXT NOT NULL,\n  saved_at TEXT NOT NULL,\n  trust_mode TEXT,\n  trust_key_id TEXT,\n  trust_signature_count INTEGER,\n  trust_threshold INTEGER,\n  trust_verified_at TEXT,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_official_external_plugin_catalog_snapshots_updated\n  ON official_external_plugin_catalog_snapshots(updated_at_ms DESC, feed_url);\n\nCREATE TABLE IF NOT EXISTS update_runs (\n  run_id TEXT PRIMARY KEY NOT NULL,\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  trigger TEXT NOT NULL CHECK (trigger IN ('chat', 'control-ui', 'cli', 'campaign', 'mac-app', 'api')),\n  phase TEXT NOT NULL CHECK (phase IN ('requested', 'staging', 'validating', 'repairing', 'activating', 'restarting', 'verifying', 'finished')),\n  status TEXT NOT NULL CHECK (status IN ('running', 'succeeded', 'failed', 'rolled-back', 'skipped')),\n  reason TEXT,\n  origin_json TEXT NOT NULL CHECK (length(CAST(origin_json AS BLOB)) <= 16384),\n  target_json TEXT NOT NULL CHECK (length(CAST(target_json AS BLOB)) <= 16384),\n  before_json TEXT NOT NULL CHECK (length(CAST(before_json AS BLOB)) <= 16384),\n  after_json TEXT NOT NULL CHECK (length(CAST(after_json AS BLOB)) <= 16384),\n  steps_json TEXT NOT NULL CHECK (length(CAST(steps_json AS BLOB)) <= 16384),\n  verification_json TEXT NOT NULL CHECK (length(CAST(verification_json AS BLOB)) <= 16384),\n  repair_json TEXT NOT NULL CHECK (length(CAST(repair_json AS BLOB)) <= 16384),\n  confirmed_at_ms INTEGER,\n  finished_at_ms INTEGER,\n  downtime_ms INTEGER,\n  CHECK ((status = 'running' AND phase != 'finished' AND finished_at_ms IS NULL) OR\n    (status != 'running' AND phase = 'finished' AND finished_at_ms IS NOT NULL))\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_update_runs_created\n  ON update_runs(created_at_ms DESC, run_id);\nCREATE INDEX IF NOT EXISTS idx_update_runs_active\n  ON update_runs(status, created_at_ms DESC, run_id);\n\nCREATE TABLE IF NOT EXISTS gateway_restart_sentinel (\n  sentinel_key TEXT NOT NULL PRIMARY KEY,\n  version INTEGER NOT NULL,\n  kind TEXT NOT NULL,\n  status TEXT NOT NULL,\n  ts INTEGER NOT NULL,\n  session_key TEXT,\n  thread_id TEXT,\n  delivery_channel TEXT,\n  delivery_to TEXT,\n  delivery_account_id TEXT,\n  message TEXT,\n  continuation_json TEXT,\n  doctor_hint TEXT,\n  stats_json TEXT,\n  payload_json TEXT NOT NULL,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_gateway_restart_sentinel_ts\n  ON gateway_restart_sentinel(ts DESC, sentinel_key);\n\nCREATE TABLE IF NOT EXISTS gateway_restart_intent (\n  intent_key TEXT NOT NULL PRIMARY KEY,\n  kind TEXT NOT NULL,\n  pid INTEGER NOT NULL,\n  created_at INTEGER NOT NULL,\n  reason TEXT,\n  force INTEGER,\n  wait_ms INTEGER,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS gateway_restart_handoff (\n  handoff_key TEXT NOT NULL PRIMARY KEY,\n  kind TEXT NOT NULL,\n  version INTEGER NOT NULL,\n  intent_id TEXT NOT NULL,\n  pid INTEGER NOT NULL,\n  process_instance_id TEXT,\n  created_at INTEGER NOT NULL,\n  expires_at INTEGER NOT NULL,\n  reason TEXT,\n  restart_trace_started_at INTEGER,\n  restart_trace_last_at INTEGER,\n  source TEXT NOT NULL,\n  restart_kind TEXT NOT NULL,\n  supervisor_mode TEXT NOT NULL,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_gateway_restart_handoff_expiry\n  ON gateway_restart_handoff(expires_at, pid);\n\nCREATE TABLE IF NOT EXISTS gateway_boot_lifecycle (\n  boot_id TEXT NOT NULL PRIMARY KEY,\n  pid INTEGER NOT NULL,\n  started_at_ms INTEGER NOT NULL,\n  completed_at_ms INTEGER,\n  outcome TEXT,\n  startup_reason TEXT,\n  reason TEXT\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_gateway_boot_lifecycle_started\n  ON gateway_boot_lifecycle(started_at_ms);\n\nCREATE TABLE IF NOT EXISTS acp_sessions (\n  session_key TEXT NOT NULL PRIMARY KEY,\n  session_id TEXT,\n  backend TEXT NOT NULL,\n  agent TEXT NOT NULL,\n  runtime_session_name TEXT NOT NULL,\n  identity_json TEXT,\n  mode TEXT NOT NULL,\n  runtime_options_json TEXT,\n  cwd TEXT,\n  state TEXT NOT NULL,\n  last_activity_at INTEGER NOT NULL,\n  last_error TEXT,\n  updated_at INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_acp_sessions_state_activity\n  ON acp_sessions(state, last_activity_at DESC, session_key);\n\nCREATE INDEX IF NOT EXISTS idx_acp_sessions_agent_activity\n  ON acp_sessions(agent, last_activity_at DESC, session_key);\n\nCREATE TABLE IF NOT EXISTS acp_replay_sessions (\n  session_id TEXT NOT NULL PRIMARY KEY,\n  session_key TEXT NOT NULL,\n  cwd TEXT NOT NULL,\n  complete INTEGER NOT NULL,\n  created_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL,\n  next_seq INTEGER NOT NULL,\n  -- Running estimate of this session's ledger footprint (row overhead plus\n  -- all event rows), maintained at insert/trim so budget checks never scan\n  -- acp_replay_events (#100622).\n  estimated_bytes INTEGER NOT NULL DEFAULT 0\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_acp_replay_sessions_key_updated\n  ON acp_replay_sessions(session_key, complete, updated_at DESC, session_id);\n\nCREATE INDEX IF NOT EXISTS idx_acp_replay_sessions_updated\n  ON acp_replay_sessions(updated_at DESC, session_id);\n\nCREATE TABLE IF NOT EXISTS acp_replay_events (\n  session_id TEXT NOT NULL,\n  seq INTEGER NOT NULL,\n  at INTEGER NOT NULL,\n  session_key TEXT NOT NULL,\n  run_id TEXT,\n  update_json TEXT NOT NULL,\n  estimated_bytes INTEGER NOT NULL DEFAULT 0,\n  PRIMARY KEY (session_id, seq),\n  FOREIGN KEY (session_id) REFERENCES acp_replay_sessions(session_id) ON DELETE CASCADE\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_acp_replay_events_session_seq\n  ON acp_replay_events(session_id, seq);\n\nCREATE TABLE IF NOT EXISTS agent_databases (\n  agent_id TEXT NOT NULL,\n  path TEXT NOT NULL,\n  schema_version INTEGER NOT NULL,\n  last_seen_at INTEGER NOT NULL,\n  size_bytes INTEGER,\n  PRIMARY KEY (agent_id, path)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS agent_deletion_journal (\n  agent_id TEXT PRIMARY KEY,\n  operation_id TEXT NOT NULL DEFAULT '',\n  agent_dir TEXT NOT NULL,\n  workspace_dir TEXT NOT NULL,\n  sessions_dir TEXT NOT NULL,\n  database_paths_json TEXT NOT NULL DEFAULT '[]',\n  cleanup_paths_json TEXT NOT NULL DEFAULT '[]',\n  created_at INTEGER NOT NULL,\n  cleanup_completed INTEGER NOT NULL DEFAULT 0,\n  delete_files INTEGER NOT NULL DEFAULT 1\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS agent_provenance (\n  agent_id TEXT PRIMARY KEY,\n  created_via TEXT NOT NULL CHECK (created_via IN ('operator', 'agent', 'claw')),\n  creator_agent_id TEXT,\n  created_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS agent_database_leases (\n  lease_id TEXT PRIMARY KEY,\n  agent_id TEXT NOT NULL,\n  path TEXT NOT NULL,\n  owner_pid INTEGER NOT NULL,\n  owner_start_time INTEGER,\n  opened_at INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS plugin_state_entries (\n  plugin_id TEXT NOT NULL,\n  namespace TEXT NOT NULL,\n  entry_key TEXT NOT NULL,\n  value_json TEXT NOT NULL,\n  created_at INTEGER NOT NULL,\n  expires_at INTEGER,\n  PRIMARY KEY (plugin_id, namespace, entry_key)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_plugin_state_expiry\n  ON plugin_state_entries(expires_at)\n  WHERE expires_at IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_plugin_state_listing\n  ON plugin_state_entries(plugin_id, namespace, created_at, entry_key, expires_at);\n\nCREATE TABLE IF NOT EXISTS channel_ingress_events (\n  queue_name TEXT NOT NULL,\n  event_id TEXT NOT NULL,\n  channel_id TEXT NOT NULL,\n  account_id TEXT NOT NULL,\n  status TEXT NOT NULL,\n  lane_key TEXT,\n  payload_json TEXT NOT NULL,\n  metadata_json TEXT,\n  received_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL,\n  claim_token TEXT,\n  claim_owner TEXT,\n  claimed_at INTEGER,\n  attempts INTEGER NOT NULL DEFAULT 0,\n  last_attempt_at INTEGER,\n  last_error TEXT,\n  failed_reason TEXT,\n  failed_at INTEGER,\n  completed_at INTEGER,\n  completed_metadata_json TEXT,\n  PRIMARY KEY (queue_name, event_id)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_channel_ingress_pending\n  ON channel_ingress_events(queue_name, status, received_at, event_id);\n\nCREATE INDEX IF NOT EXISTS idx_channel_ingress_claims\n  ON channel_ingress_events(queue_name, status, claimed_at);\n\nCREATE INDEX IF NOT EXISTS idx_channel_ingress_lane\n  ON channel_ingress_events(queue_name, status, lane_key);\n\nCREATE TABLE IF NOT EXISTS plugin_blob_entries (\n  plugin_id TEXT NOT NULL,\n  namespace TEXT NOT NULL,\n  entry_key TEXT NOT NULL,\n  metadata_json TEXT NOT NULL,\n  blob BLOB NOT NULL,\n  created_at INTEGER NOT NULL,\n  expires_at INTEGER,\n  PRIMARY KEY (plugin_id, namespace, entry_key)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_plugin_blob_expiry\n  ON plugin_blob_entries(expires_at)\n  WHERE expires_at IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_plugin_blob_listing\n  ON plugin_blob_entries(plugin_id, namespace, created_at, entry_key);\n\nCREATE TABLE IF NOT EXISTS skill_uploads (\n  upload_id TEXT NOT NULL PRIMARY KEY,\n  kind TEXT NOT NULL,\n  slug TEXT NOT NULL,\n  force INTEGER NOT NULL,\n  size_bytes INTEGER NOT NULL,\n  sha256 TEXT,\n  actual_sha256 TEXT,\n  received_bytes INTEGER NOT NULL,\n  archive_blob BLOB NOT NULL,\n  created_at INTEGER NOT NULL,\n  expires_at INTEGER NOT NULL,\n  committed INTEGER NOT NULL,\n  committed_at INTEGER,\n  idempotency_key_hash TEXT UNIQUE\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_skill_uploads_expiry\n  ON skill_uploads(expires_at);\n\nCREATE INDEX IF NOT EXISTS idx_skill_uploads_idempotency\n  ON skill_uploads(idempotency_key_hash)\n  WHERE idempotency_key_hash IS NOT NULL;\n\nCREATE TABLE IF NOT EXISTS skill_upload_chunks (\n  upload_id TEXT NOT NULL,\n  byte_offset INTEGER NOT NULL CHECK (byte_offset >= 0),\n  size_bytes INTEGER NOT NULL CHECK (size_bytes > 0),\n  chunk_blob BLOB NOT NULL,\n  PRIMARY KEY (upload_id, byte_offset),\n  FOREIGN KEY (upload_id) REFERENCES skill_uploads(upload_id) ON DELETE CASCADE,\n  CHECK (length(chunk_blob) = size_bytes)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS capture_sessions (\n  id TEXT NOT NULL PRIMARY KEY,\n  started_at INTEGER NOT NULL,\n  ended_at INTEGER,\n  mode TEXT NOT NULL,\n  source_scope TEXT NOT NULL,\n  source_process TEXT NOT NULL,\n  proxy_url TEXT\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS capture_blobs (\n  blob_id TEXT NOT NULL PRIMARY KEY,\n  content_type TEXT,\n  encoding TEXT NOT NULL,\n  size_bytes INTEGER NOT NULL,\n  sha256 TEXT NOT NULL,\n  data BLOB NOT NULL,\n  created_at INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS capture_events (\n  id INTEGER NOT NULL PRIMARY KEY,\n  session_id TEXT NOT NULL,\n  ts INTEGER NOT NULL,\n  source_scope TEXT NOT NULL,\n  source_process TEXT NOT NULL,\n  protocol TEXT NOT NULL,\n  direction TEXT NOT NULL,\n  kind TEXT NOT NULL,\n  flow_id TEXT NOT NULL,\n  method TEXT,\n  host TEXT,\n  path TEXT,\n  status INTEGER,\n  close_code INTEGER,\n  content_type TEXT,\n  headers_json TEXT,\n  data_text TEXT,\n  data_blob_id TEXT,\n  data_sha256 TEXT,\n  error_text TEXT,\n  meta_json TEXT,\n  FOREIGN KEY (session_id) REFERENCES capture_sessions(id) ON DELETE CASCADE,\n  FOREIGN KEY (data_blob_id) REFERENCES capture_blobs(blob_id) ON DELETE SET NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS capture_events_session_ts_idx\n  ON capture_events(session_id, ts);\n\nCREATE INDEX IF NOT EXISTS capture_events_flow_idx\n  ON capture_events(flow_id, ts);\n\nCREATE TABLE IF NOT EXISTS sandbox_registry_entries (\n  registry_kind TEXT NOT NULL,\n  container_name TEXT NOT NULL,\n  session_key TEXT,\n  backend_id TEXT,\n  runtime_label TEXT,\n  image TEXT,\n  created_at_ms INTEGER,\n  last_used_at_ms INTEGER,\n  config_label_kind TEXT,\n  config_hash TEXT,\n  cdp_port INTEGER,\n  no_vnc_port INTEGER,\n  entry_json TEXT NOT NULL,\n  updated_at INTEGER NOT NULL,\n  PRIMARY KEY (registry_kind, container_name)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_sandbox_registry_updated\n  ON sandbox_registry_entries(registry_kind, updated_at DESC, container_name);\n\nCREATE INDEX IF NOT EXISTS idx_sandbox_registry_session\n  ON sandbox_registry_entries(registry_kind, session_key, last_used_at_ms DESC, container_name)\n  WHERE session_key IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_sandbox_registry_last_used\n  ON sandbox_registry_entries(registry_kind, last_used_at_ms DESC, container_name)\n  WHERE last_used_at_ms IS NOT NULL;\n\nCREATE TABLE IF NOT EXISTS cron_jobs (\n  store_key TEXT NOT NULL,\n  job_id TEXT NOT NULL,\n  declaration_key TEXT,\n  owner_agent_id TEXT,\n  name TEXT NOT NULL,\n  description TEXT,\n  enabled INTEGER NOT NULL,\n  agent_id TEXT,\n  payload_kind TEXT NOT NULL,\n  job_json TEXT NOT NULL,\n  grant_definition_revision TEXT,\n  grant_definition_generation INTEGER,\n  grant_definition_updated_at INTEGER,\n  state_json TEXT NOT NULL DEFAULT '{}',\n  runtime_updated_at_ms INTEGER,\n  schedule_identity TEXT,\n  sort_order INTEGER NOT NULL DEFAULT 0,\n  updated_at INTEGER NOT NULL,\n  PRIMARY KEY (store_key, job_id)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_cron_jobs_store_order\n  ON cron_jobs(store_key, sort_order ASC, updated_at ASC, job_id);\n\n-- One owner-native receipt is also the durable execution fence. Receipts\n-- survive job deletion so operators can distinguish a run from log inference.\nCREATE TABLE IF NOT EXISTS cron_run_receipts (\n  receipt_id TEXT PRIMARY KEY,\n  store_key TEXT NOT NULL,\n  job_id TEXT NOT NULL,\n  config_revision TEXT NOT NULL,\n  agent_id TEXT NOT NULL,\n  request_run_id TEXT,\n  status TEXT NOT NULL,\n  owner_pid INTEGER NOT NULL,\n  owner_start_time INTEGER,\n  started_at_ms INTEGER NOT NULL,\n  finished_at_ms INTEGER,\n  error_text TEXT,\n  CHECK (status IN ('running', 'ok', 'error', 'skipped', 'interrupted', 'superseded')),\n  CHECK (\n    (status = 'running' AND finished_at_ms IS NULL)\n    OR\n    (status != 'running' AND finished_at_ms IS NOT NULL)\n  )\n) STRICT;\n\nCREATE UNIQUE INDEX IF NOT EXISTS idx_cron_run_receipts_active_job\n  ON cron_run_receipts(store_key, job_id)\n  WHERE status = 'running';\n\nCREATE INDEX IF NOT EXISTS idx_cron_run_receipts_job_history\n  ON cron_run_receipts(store_key, job_id, started_at_ms DESC, receipt_id DESC);\n\n-- Retirement follows the receipt's retention without changing its released shape.\nCREATE TABLE IF NOT EXISTS cron_run_trigger_state_retirements (\n  receipt_id TEXT PRIMARY KEY\n    REFERENCES cron_run_receipts(receipt_id) ON DELETE CASCADE\n) STRICT;\n\n-- Runtime-private authority is independent of job_json so downgraded writers\n-- can rewrite recognized job config without erasing or silently widening it.\nCREATE TABLE IF NOT EXISTS cron_job_runtime_authorities (\n  store_key TEXT NOT NULL,\n  job_id TEXT NOT NULL,\n  authority_json TEXT,\n  authority_input_fingerprint TEXT,\n  recovery_required INTEGER NOT NULL,\n  PRIMARY KEY (store_key, job_id),\n  FOREIGN KEY (store_key, job_id)\n    REFERENCES cron_jobs(store_key, job_id) ON DELETE CASCADE,\n  CHECK (recovery_required IN (0, 1)),\n  CHECK (\n    (recovery_required = 0 AND authority_json IS NOT NULL AND authority_input_fingerprint IS NOT NULL)\n    OR\n    (recovery_required = 1 AND authority_json IS NULL AND authority_input_fingerprint IS NULL)\n  )\n) STRICT;\n\n-- Scratch is separate from cron_jobs so scheduler state writes and downgraded\n-- full-row replacement preserve it. New builds prune rows explicitly on job removal.\n-- content NULL is a tombstone: it keeps the revision lineage monotonic across\n-- unset/recreate so stale compare-and-swap writes cannot resurrect old content.\nCREATE TABLE IF NOT EXISTS cron_job_scratch (\n  store_key TEXT NOT NULL,\n  job_id TEXT NOT NULL,\n  content TEXT,\n  revision INTEGER NOT NULL,\n  source_sha256 TEXT,\n  updated_at_ms INTEGER NOT NULL,\n  PRIMARY KEY (store_key, job_id),\n  CHECK (revision >= 1),\n  CHECK (content IS NULL OR length(CAST(content AS BLOB)) <= 262144)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_cron_job_scratch_store_updated\n  ON cron_job_scratch(store_key, updated_at_ms DESC, job_id);\n\nCREATE TABLE IF NOT EXISTS delivery_queue_entries (\n  queue_name TEXT NOT NULL,\n  id TEXT NOT NULL,\n  status TEXT NOT NULL,\n  entry_kind TEXT,\n  session_key TEXT,\n  channel TEXT,\n  target TEXT,\n  account_id TEXT,\n  retry_count INTEGER NOT NULL DEFAULT 0,\n  last_attempt_at INTEGER,\n  last_error TEXT,\n  recovery_state TEXT,\n  platform_send_started_at INTEGER,\n  entry_json TEXT NOT NULL,\n  enqueued_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL,\n  failed_at INTEGER,\n  PRIMARY KEY (queue_name, id)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_delivery_queue_pending\n  ON delivery_queue_entries(queue_name, status, enqueued_at, id);\n\nCREATE INDEX IF NOT EXISTS idx_delivery_queue_failed\n  ON delivery_queue_entries(queue_name, status, failed_at, id);\n\nCREATE INDEX IF NOT EXISTS idx_delivery_queue_session\n  ON delivery_queue_entries(queue_name, status, session_key, enqueued_at, id)\n  WHERE session_key IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_delivery_queue_target\n  ON delivery_queue_entries(queue_name, status, channel, target, enqueued_at, id)\n  WHERE channel IS NOT NULL AND target IS NOT NULL;\n\nCREATE TABLE IF NOT EXISTS task_runs (\n  task_id TEXT NOT NULL PRIMARY KEY,\n  runtime TEXT NOT NULL,\n  task_kind TEXT,\n  source_id TEXT,\n  requester_session_key TEXT,\n  owner_key TEXT NOT NULL,\n  scope_kind TEXT NOT NULL,\n  child_session_key TEXT,\n  parent_flow_id TEXT,\n  parent_task_id TEXT,\n  agent_id TEXT,\n  requester_agent_id TEXT,\n  run_id TEXT,\n  execution_owner_host TEXT,\n  execution_owner_pid INTEGER,\n  execution_owner_start_identity INTEGER,\n  label TEXT,\n  task TEXT NOT NULL,\n  status TEXT NOT NULL,\n  delivery_status TEXT NOT NULL,\n  notify_policy TEXT NOT NULL,\n  created_at INTEGER NOT NULL,\n  started_at INTEGER,\n  ended_at INTEGER,\n  last_event_at INTEGER,\n  cleanup_after INTEGER,\n  tool_use_count INTEGER,\n  last_tool_name TEXT,\n  error TEXT,\n  progress_summary TEXT,\n  terminal_summary TEXT,\n  terminal_outcome TEXT,\n  detail_json TEXT\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_task_runs_run_id ON task_runs(run_id);\nCREATE INDEX IF NOT EXISTS idx_task_runs_status ON task_runs(status);\nCREATE INDEX IF NOT EXISTS idx_task_runs_runtime_status ON task_runs(runtime, status);\nCREATE INDEX IF NOT EXISTS idx_task_runs_cleanup_after ON task_runs(cleanup_after);\nCREATE INDEX IF NOT EXISTS idx_task_runs_last_event_at ON task_runs(last_event_at);\nCREATE INDEX IF NOT EXISTS idx_task_runs_owner_key ON task_runs(owner_key);\nCREATE INDEX IF NOT EXISTS idx_task_runs_parent_flow_id ON task_runs(parent_flow_id);\nCREATE INDEX IF NOT EXISTS idx_task_runs_child_session_key ON task_runs(child_session_key);\nCREATE INDEX IF NOT EXISTS idx_task_runs_requester_session_key ON task_runs(requester_session_key);\nCREATE INDEX IF NOT EXISTS idx_task_runs_runtime_source_ended\n  ON task_runs(runtime, source_id, ended_at, created_at, task_id);\nCREATE INDEX IF NOT EXISTS idx_task_runs_runtime_ended\n  ON task_runs(runtime, ended_at, created_at, task_id);\n\nCREATE TABLE IF NOT EXISTS subagent_runs (\n  run_id TEXT NOT NULL PRIMARY KEY,\n  child_session_key TEXT NOT NULL,\n  controller_session_key TEXT,\n  controller_store_path TEXT,\n  requester_session_key TEXT NOT NULL,\n  requester_store_path TEXT,\n  created_at INTEGER NOT NULL,\n  payload_json TEXT NOT NULL DEFAULT '{}'\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_subagent_runs_child_session_key\n  ON subagent_runs(child_session_key, created_at DESC, run_id);\nCREATE INDEX IF NOT EXISTS idx_subagent_runs_requester_session_key\n  ON subagent_runs(requester_session_key, created_at DESC, run_id);\nCREATE INDEX IF NOT EXISTS idx_subagent_runs_controller_session_key\n  ON subagent_runs(controller_session_key, created_at DESC, run_id);\n\nCREATE TABLE IF NOT EXISTS current_conversation_bindings (\n  binding_key TEXT NOT NULL PRIMARY KEY,\n  binding_id TEXT NOT NULL,\n  target_session_key TEXT NOT NULL,\n  channel TEXT NOT NULL,\n  account_id TEXT NOT NULL,\n  conversation_kind TEXT NOT NULL,\n  parent_conversation_id TEXT,\n  conversation_id TEXT NOT NULL,\n  target_kind TEXT NOT NULL,\n  status TEXT NOT NULL,\n  bound_at INTEGER NOT NULL,\n  expires_at INTEGER,\n  metadata_json TEXT,\n  record_json TEXT NOT NULL,\n  updated_at INTEGER NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_current_conversation_bindings_target\n  ON current_conversation_bindings(target_session_key, updated_at DESC, binding_key);\nCREATE INDEX IF NOT EXISTS idx_current_conversation_bindings_conversation\n  ON current_conversation_bindings(channel, account_id, conversation_kind, conversation_id);\nCREATE INDEX IF NOT EXISTS idx_current_conversation_bindings_expires\n  ON current_conversation_bindings(expires_at, binding_key);\n\nCREATE TABLE IF NOT EXISTS plugin_binding_approvals (\n  plugin_root TEXT NOT NULL,\n  channel TEXT NOT NULL,\n  account_id TEXT NOT NULL,\n  plugin_id TEXT NOT NULL,\n  plugin_name TEXT,\n  approved_at INTEGER NOT NULL,\n  PRIMARY KEY (plugin_root, channel, account_id)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_plugin_binding_approvals_plugin\n  ON plugin_binding_approvals(plugin_id, approved_at DESC);\n\nCREATE TABLE IF NOT EXISTS task_delivery_state (\n  task_id TEXT NOT NULL PRIMARY KEY,\n  requester_origin_json TEXT,\n  last_notified_event_at INTEGER,\n  FOREIGN KEY (task_id) REFERENCES task_runs(task_id) ON DELETE CASCADE\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS flow_runs (\n  flow_id TEXT NOT NULL PRIMARY KEY,\n  shape TEXT,\n  sync_mode TEXT NOT NULL DEFAULT 'managed',\n  owner_key TEXT NOT NULL,\n  requester_origin_json TEXT,\n  controller_id TEXT,\n  revision INTEGER NOT NULL DEFAULT 0,\n  status TEXT NOT NULL,\n  notify_policy TEXT NOT NULL,\n  goal TEXT NOT NULL,\n  current_step TEXT,\n  blocked_task_id TEXT,\n  blocked_summary TEXT,\n  state_json TEXT,\n  wait_json TEXT,\n  cancel_requested_at INTEGER,\n  created_at INTEGER NOT NULL,\n  updated_at INTEGER NOT NULL,\n  ended_at INTEGER\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_flow_runs_status ON flow_runs(status);\nCREATE INDEX IF NOT EXISTS idx_flow_runs_owner_key ON flow_runs(owner_key);\nCREATE INDEX IF NOT EXISTS idx_flow_runs_updated_at ON flow_runs(updated_at);\n\n-- Durable meeting-capture sessions are gateway-global rather than agent-session\n-- transcripts. JSON/JSONL files are doctor import inputs or explicit CLI exports.\nCREATE TABLE IF NOT EXISTS meeting_transcript_sessions (\n  session_id TEXT NOT NULL,\n  started_at TEXT NOT NULL,\n  selector TEXT NOT NULL UNIQUE,\n  export_key TEXT NOT NULL,\n  session_slug TEXT NOT NULL,\n  provider_id TEXT NOT NULL,\n  title TEXT,\n  source_json TEXT NOT NULL,\n  stopped_at TEXT,\n  metadata_json TEXT,\n  export_manifest_json TEXT NOT NULL DEFAULT '{}',\n  export_pending_json TEXT NOT NULL DEFAULT '[]',\n  next_utterance_seq INTEGER NOT NULL DEFAULT 0 CHECK (next_utterance_seq >= 0),\n  created_at_ms INTEGER NOT NULL CHECK (created_at_ms >= 0),\n  updated_at_ms INTEGER NOT NULL CHECK (updated_at_ms >= 0),\n  PRIMARY KEY (session_id, started_at)\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_meeting_transcript_sessions_started\n  ON meeting_transcript_sessions(started_at DESC, session_id);\n\nCREATE INDEX IF NOT EXISTS idx_meeting_transcript_sessions_id\n  ON meeting_transcript_sessions(session_id, started_at DESC);\n\nCREATE INDEX IF NOT EXISTS idx_meeting_transcript_sessions_slug\n  ON meeting_transcript_sessions(session_slug, started_at DESC);\n\nCREATE INDEX IF NOT EXISTS idx_meeting_transcript_sessions_export_key\n  ON meeting_transcript_sessions(export_key);\n\nCREATE TABLE IF NOT EXISTS meeting_transcript_utterances (\n  session_id TEXT NOT NULL,\n  session_started_at TEXT NOT NULL,\n  sequence INTEGER NOT NULL CHECK (sequence >= 0),\n  utterance_id TEXT,\n  started_at TEXT,\n  ended_at TEXT,\n  speaker_id TEXT,\n  speaker_label TEXT,\n  text TEXT NOT NULL,\n  final INTEGER CHECK (final IN (0, 1)),\n  metadata_json TEXT,\n  PRIMARY KEY (session_id, session_started_at, sequence),\n  FOREIGN KEY (session_id, session_started_at)\n    REFERENCES meeting_transcript_sessions(session_id, started_at)\n    ON DELETE CASCADE\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS meeting_transcript_summaries (\n  session_id TEXT NOT NULL,\n  session_started_at TEXT NOT NULL,\n  generated_at TEXT,\n  summary_json TEXT,\n  markdown TEXT,\n  utterance_count INTEGER NOT NULL CHECK (utterance_count >= 0),\n  PRIMARY KEY (session_id, session_started_at),\n  FOREIGN KEY (session_id, session_started_at)\n    REFERENCES meeting_transcript_sessions(session_id, started_at)\n    ON DELETE CASCADE,\n  CHECK (summary_json IS NOT NULL OR markdown IS NOT NULL)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS migration_runs (\n  id TEXT NOT NULL PRIMARY KEY,\n  started_at INTEGER NOT NULL,\n  finished_at INTEGER,\n  status TEXT NOT NULL,\n  report_json TEXT NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_migration_runs_started\n  ON migration_runs(started_at DESC, id);\n\nCREATE TABLE IF NOT EXISTS migration_sources (\n  source_key TEXT NOT NULL PRIMARY KEY,\n  migration_kind TEXT NOT NULL,\n  source_path TEXT NOT NULL,\n  target_table TEXT NOT NULL,\n  source_sha256 TEXT,\n  source_size_bytes INTEGER,\n  source_record_count INTEGER,\n  last_run_id TEXT NOT NULL,\n  status TEXT NOT NULL,\n  imported_at INTEGER NOT NULL,\n  removed_source INTEGER NOT NULL DEFAULT 0,\n  report_json TEXT NOT NULL,\n  FOREIGN KEY (last_run_id) REFERENCES migration_runs(id) ON DELETE CASCADE\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_migration_sources_path\n  ON migration_sources(source_path, migration_kind, target_table);\n\nCREATE INDEX IF NOT EXISTS idx_migration_sources_run\n  ON migration_sources(last_run_id, source_path);\n\nCREATE TABLE IF NOT EXISTS backup_runs (\n  id TEXT NOT NULL PRIMARY KEY,\n  created_at INTEGER NOT NULL,\n  archive_path TEXT NOT NULL,\n  status TEXT NOT NULL,\n  manifest_json TEXT NOT NULL\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_backup_runs_created\n  ON backup_runs(created_at DESC, id);\n\nCREATE TABLE IF NOT EXISTS worktrees (\n  id TEXT NOT NULL PRIMARY KEY,\n  repo_fingerprint TEXT NOT NULL,\n  repo_root TEXT NOT NULL,\n  path TEXT NOT NULL,\n  branch TEXT NOT NULL,\n  base_ref TEXT NOT NULL,\n  owner_kind TEXT NOT NULL CHECK (owner_kind IN ('manual', 'workboard', 'session')),\n  owner_id TEXT,\n  snapshot_ref TEXT,\n  provisioned_paths_json TEXT,\n  created_at INTEGER NOT NULL,\n  last_active_at INTEGER NOT NULL,\n  removed_at INTEGER,\n  run_end_cleanup_json TEXT\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_worktrees_repo_fingerprint\n  ON worktrees(repo_fingerprint);\n\nCREATE INDEX IF NOT EXISTS idx_worktrees_removed_at\n  ON worktrees(removed_at);\n\nCREATE TABLE IF NOT EXISTS worktree_provisioned_file_chunks (\n  worktree_id TEXT NOT NULL,\n  path TEXT NOT NULL,\n  chunk_index INTEGER NOT NULL CHECK (chunk_index >= 0),\n  data BLOB NOT NULL,\n  PRIMARY KEY (worktree_id, path, chunk_index)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS worktree_templates (\n  cache_key TEXT NOT NULL PRIMARY KEY,\n  id TEXT NOT NULL UNIQUE,\n  repo_root TEXT NOT NULL,\n  common_dir TEXT NOT NULL,\n  worktree_root TEXT NOT NULL,\n  path TEXT NOT NULL,\n  backend TEXT NOT NULL,\n  source_commit TEXT NOT NULL,\n  content_key TEXT NOT NULL,\n  status TEXT NOT NULL CHECK (status IN ('preparing', 'ready')),\n  created_at INTEGER NOT NULL,\n  last_used_at INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS projects (\n  id TEXT NOT NULL PRIMARY KEY,\n  display_name TEXT NOT NULL,\n  repo_root TEXT NOT NULL,\n  origin_url TEXT,\n  source TEXT NOT NULL CHECK (source IN ('registered', 'cloned')),\n  created_at_ms INT NOT NULL,\n  updated_at_ms INT NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS user_preferences (\n  profile_id TEXT NOT NULL,\n  pref_key TEXT NOT NULL,\n  value_json TEXT NOT NULL,\n  updated_at_ms INT NOT NULL,\n  PRIMARY KEY (profile_id, pref_key)\n) STRICT;\n\n-- Gateway-owned custom session group catalog (names + display order).\n-- Membership stays on each session entry's category field; this table only\n-- owns which groups exist and how operator UIs order them.\nCREATE TABLE IF NOT EXISTS session_groups (\n  name TEXT NOT NULL PRIMARY KEY,\n  position INTEGER NOT NULL,\n  created_at INTEGER NOT NULL,\n  cwd TEXT,\n  worktree INTEGER\n) STRICT;\n\n-- Gateway-owned durable cloud worker lifecycle. Provider-specific execution\n-- stays in plugins; this table records only core reconciliation facts.\nCREATE TABLE IF NOT EXISTS worker_environments (\n  environment_id TEXT NOT NULL PRIMARY KEY,\n  provider_id TEXT NOT NULL,\n  profile_id TEXT NOT NULL,\n  profile_snapshot_json TEXT NOT NULL,\n  last_activated_at_ms INTEGER,\n  preparation_key TEXT,\n  preparation_purpose TEXT,\n  preparation_demand_at_ms INTEGER,\n  preparation_expires_at_ms INTEGER,\n  preparation_consumed_at_ms INTEGER CHECK (\n    (preparation_key IS NULL AND preparation_demand_at_ms IS NULL\n      AND preparation_expires_at_ms IS NULL AND preparation_consumed_at_ms IS NULL)\n    OR\n    (preparation_key IS NOT NULL AND length(preparation_key) = 64\n      AND preparation_key NOT GLOB '*[^0-9a-f]*'\n      AND preparation_demand_at_ms IS NOT NULL\n      AND preparation_demand_at_ms BETWEEN 0 AND 9007199254740991\n      AND preparation_expires_at_ms IS NOT NULL\n      AND preparation_expires_at_ms > preparation_demand_at_ms\n      AND preparation_expires_at_ms <= 9007199254740991\n      AND (preparation_consumed_at_ms IS NULL\n        OR (preparation_consumed_at_ms >= preparation_demand_at_ms\n          AND preparation_consumed_at_ms < preparation_expires_at_ms)))\n  ),\n  provision_operation_id TEXT NOT NULL UNIQUE,\n  lease_id TEXT,\n  node_setup_id TEXT,\n  node_device_id TEXT,\n  ssh_host TEXT,\n  ssh_port INTEGER CHECK (ssh_port IS NULL OR (ssh_port >= 1 AND ssh_port <= 65535)),\n  ssh_user TEXT,\n  ssh_host_key TEXT,\n  ssh_key_ref_json TEXT,\n  desktop_json TEXT,\n  state TEXT NOT NULL CHECK (\n    state IN (\n      'requested',\n      'provisioning',\n      'bootstrapping',\n      'ready',\n      'attached',\n      'idle',\n      'draining',\n      'destroying',\n      'destroyed',\n      'failed',\n      'orphaned'\n    )\n  ),\n  bootstrap_bundle_hash TEXT,\n  bootstrap_openclaw_version TEXT,\n  bootstrap_protocol_features_json TEXT,\n  bootstrap_install_kind TEXT,\n  owner_epoch INTEGER NOT NULL DEFAULT 0 CHECK (owner_epoch >= 0),\n  teardown_terminal_state TEXT CHECK (teardown_terminal_state IN ('destroyed', 'failed')),\n  attached_session_ids_json TEXT NOT NULL DEFAULT '[]',\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  state_changed_at_ms INTEGER NOT NULL,\n  idle_since_at_ms INTEGER,\n  destroy_requested_at_ms INTEGER,\n  last_error TEXT,\n  shared_host INTEGER\n) STRICT;\n\nCREATE UNIQUE INDEX IF NOT EXISTS idx_worker_environments_provider_lease\n  ON worker_environments(provider_id, lease_id)\n  WHERE lease_id IS NOT NULL;\n\nCREATE INDEX IF NOT EXISTS idx_worker_environments_terminal_changed\n  ON worker_environments(state_changed_at_ms, environment_id);\n\n-- A dedicated node registers its fixed build paths before ready, then binds\n-- them once. The environment belongs to the Gateway's separate database.\nCREATE TABLE IF NOT EXISTS node_worker_prepared_workspaces (\n  preparation_key TEXT NOT NULL PRIMARY KEY CHECK (\n    length(preparation_key) = 64 AND preparation_key NOT GLOB '*[^0-9a-f]*'\n  ),\n  cache_key TEXT NOT NULL CHECK (\n    length(cache_key) = 64 AND cache_key NOT GLOB '*[^0-9a-f]*'\n  ),\n  gateway_namespace TEXT NOT NULL CHECK (length(gateway_namespace) > 0),\n  workspace_dir TEXT NOT NULL UNIQUE CHECK (length(workspace_dir) > 0),\n  home_dir TEXT NOT NULL CHECK (length(home_dir) > 0),\n  source_manifest_ref TEXT NOT NULL CHECK (\n    length(source_manifest_ref) = 71 AND substr(source_manifest_ref, 1, 7) = 'sha256:'\n      AND substr(source_manifest_ref, 8) NOT GLOB '*[^0-9a-f]*'\n  ),\n  prepared_manifest_ref TEXT NOT NULL CHECK (\n    length(prepared_manifest_ref) = 71 AND substr(prepared_manifest_ref, 1, 7) = 'sha256:'\n      AND substr(prepared_manifest_ref, 8) NOT GLOB '*[^0-9a-f]*'\n  ),\n  state TEXT NOT NULL CHECK (state IN ('available', 'bound', 'retiring', 'retired')),\n  environment_id TEXT NOT NULL CHECK (length(environment_id) > 0),\n  session_id TEXT,\n  session_key TEXT,\n  owner_epoch INTEGER CHECK (owner_epoch BETWEEN 1 AND 9007199254740991),\n  created_at_ms INTEGER NOT NULL CHECK (created_at_ms BETWEEN 0 AND 9007199254740991),\n  bound_at_ms INTEGER CHECK (bound_at_ms BETWEEN created_at_ms AND 9007199254740991),\n  retired_at_ms INTEGER CHECK (\n    retired_at_ms BETWEEN coalesce(bound_at_ms, created_at_ms) AND 9007199254740991\n  ),\n  CHECK (\n    (session_id IS NULL AND session_key IS NULL AND owner_epoch IS NULL AND bound_at_ms IS NULL)\n    OR\n    (session_id IS NOT NULL AND length(session_id) > 0\n      AND session_key IS NOT NULL AND length(session_key) > 0\n      AND owner_epoch IS NOT NULL AND bound_at_ms IS NOT NULL)\n  ),\n  CHECK (\n    (state = 'available' AND bound_at_ms IS NULL AND retired_at_ms IS NULL)\n    OR (state = 'bound' AND bound_at_ms IS NOT NULL AND retired_at_ms IS NULL)\n    OR (state = 'retiring' AND retired_at_ms IS NULL)\n    OR (state = 'retired' AND retired_at_ms IS NOT NULL)\n  )\n) STRICT;\n\n-- Provider-advertised fallback ports preserve stable retry order separately\n-- from the downgrade-sensitive canonical worker environment row.\nCREATE TABLE IF NOT EXISTS worker_environment_ssh_fallback_ports (\n  environment_id TEXT NOT NULL,\n  position INTEGER NOT NULL CHECK (position >= 0 AND position <= 9),\n  port INTEGER NOT NULL CHECK (port >= 1 AND port <= 65535),\n  PRIMARY KEY (environment_id, position),\n  UNIQUE (environment_id, port),\n  FOREIGN KEY (environment_id) REFERENCES worker_environments(environment_id) ON DELETE CASCADE\n) STRICT;\n\n-- Logical sessions own repository intent and accepted artifact references,\n-- independently of the worker or rotating transcript session id.\nCREATE TABLE IF NOT EXISTS session_repository_workspaces (\n  workspace_id TEXT NOT NULL PRIMARY KEY CHECK (length(workspace_id) = 36),\n  agent_id TEXT NOT NULL CHECK (length(agent_id) BETWEEN 1 AND 128),\n  session_key TEXT NOT NULL CHECK (length(session_key) BETWEEN 1 AND 1024),\n  url TEXT NOT NULL CHECK (length(url) BETWEEN 1 AND 4096),\n  requested_ref TEXT CHECK (requested_ref IS NULL OR length(requested_ref) BETWEEN 1 AND 1024),\n  run_setup_script INTEGER NOT NULL DEFAULT 0 CHECK (run_setup_script IN (0, 1)),\n  base_commit TEXT CHECK (base_commit IS NULL OR length(base_commit) IN (40, 64)),\n  base_manifest_hash TEXT,\n  branch TEXT NOT NULL CHECK (length(branch) BETWEEN 1 AND 256),\n  checkpoint_ref TEXT,\n  manifest_hash TEXT,\n  revision INTEGER NOT NULL CHECK (revision >= 0),\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  UNIQUE (agent_id, session_key),\n  CHECK (base_manifest_hash IS NULL OR base_commit IS NOT NULL),\n  CHECK ((checkpoint_ref IS NULL AND manifest_hash IS NULL)\n    OR (checkpoint_ref IS NOT NULL AND manifest_hash IS NOT NULL AND base_manifest_hash IS NOT NULL))\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS github_repository_publication_requests (\n  request_id TEXT NOT NULL PRIMARY KEY,\n  owner_profile_id TEXT,\n  connection_generation TEXT,\n  idempotency_key TEXT NOT NULL,\n  request_digest TEXT NOT NULL,\n  session_id TEXT NOT NULL,\n  session_lifecycle_revision TEXT,\n  requester_authority_json TEXT,\n  session_key TEXT NOT NULL,\n  agent_id TEXT NOT NULL,\n  workspace_id TEXT NOT NULL,\n  checkpoint_ref TEXT,\n  checkpoint_digest TEXT,\n  claim_id TEXT,\n  run_id TEXT,\n  environment_id TEXT,\n  owner_epoch INTEGER,\n  placement_generation INTEGER,\n  identity_source TEXT NOT NULL CHECK (identity_source IN ('system-detected', 'system-configured', 'agent-override', 'personal')),\n  identity_profile_id TEXT,\n  identity_account_id INTEGER NOT NULL,\n  identity_login TEXT NOT NULL,\n  title TEXT,\n  body TEXT,\n  status TEXT NOT NULL CHECK (status IN ('requested', 'publishing', 'needs_confirmation', 'published', 'failed')),\n  gateway_instance_id TEXT,\n  execution_id TEXT,\n  last_effect TEXT CHECK (last_effect IN ('push', 'pull_request')),\n  effect_state TEXT CHECK (effect_state IN ('dispatched', 'observed')),\n  push_repository TEXT,\n  repository TEXT,\n  branch TEXT NOT NULL,\n  base_branch TEXT,\n  source_head_commit TEXT,\n  source_index_tree TEXT,\n  workspace_tree TEXT,\n  previous_head_commit TEXT,\n  pushed_head_commit TEXT,\n  head_commit TEXT,\n  pull_request_url TEXT,\n  error_code TEXT,\n  next_action TEXT,\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  reported_at_ms INTEGER,\n  CHECK ((identity_source = 'personal' AND owner_profile_id IS NOT NULL AND connection_generation IS NOT NULL)\n    OR (identity_source <> 'personal' AND owner_profile_id IS NULL AND connection_generation IS NULL)),\n  CHECK ((checkpoint_ref IS NULL AND checkpoint_digest IS NULL) OR (checkpoint_ref IS NOT NULL AND checkpoint_digest IS NOT NULL)),\n  CHECK ((last_effect IS NULL AND effect_state IS NULL) OR (last_effect IS NOT NULL AND effect_state IS NOT NULL))\n) STRICT;\nCREATE UNIQUE INDEX IF NOT EXISTS idx_github_repository_publication_shared_request\n  ON github_repository_publication_requests(session_id, idempotency_key) WHERE owner_profile_id IS NULL;\nCREATE UNIQUE INDEX IF NOT EXISTS idx_github_repository_publication_personal_request\n  ON github_repository_publication_requests(owner_profile_id, session_id, idempotency_key) WHERE owner_profile_id IS NOT NULL;\n\n-- Session placement lives in the shared state database so local admission,\n-- worker admission, and environment attachment use one durable authority.\nCREATE TABLE IF NOT EXISTS worker_session_placements (\n  session_id TEXT NOT NULL PRIMARY KEY,\n  agent_id TEXT NOT NULL,\n  session_key TEXT NOT NULL,\n  execution_mode TEXT CHECK (execution_mode IN ('worker-turn', 'remote-exec')),\n  state TEXT NOT NULL CHECK (\n    state IN (\n      'local',\n      'requested',\n      'provisioning',\n      'syncing',\n      'starting',\n      'active',\n      'draining',\n      'reconciling',\n      'reclaimed',\n      'failed'\n    )\n  ),\n  environment_id TEXT,\n  transition_generation INTEGER NOT NULL DEFAULT 0 CHECK (transition_generation >= 0),\n  active_owner_epoch INTEGER CHECK (active_owner_epoch IS NULL OR active_owner_epoch >= 1),\n  workspace_base_manifest_ref TEXT,\n  remote_workspace_dir TEXT,\n  worker_bundle_hash TEXT,\n  last_transcript_ack_cursor INTEGER CHECK (\n    last_transcript_ack_cursor IS NULL OR last_transcript_ack_cursor >= 0\n  ),\n  last_live_event_ack_cursor INTEGER CHECK (\n    last_live_event_ack_cursor IS NULL OR last_live_event_ack_cursor >= 0\n  ),\n  recovery_error TEXT,\n  turn_claim_owner TEXT CHECK (turn_claim_owner IN ('local', 'worker')),\n  turn_claim_id TEXT,\n  turn_claim_run_id TEXT,\n  turn_claim_generation INTEGER CHECK (\n    turn_claim_generation IS NULL OR turn_claim_generation >= 0\n  ),\n  turn_claim_owner_epoch INTEGER CHECK (\n    turn_claim_owner_epoch IS NULL OR turn_claim_owner_epoch >= 1\n  ),\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  state_changed_at_ms INTEGER NOT NULL,\n  terminal_reason TEXT,\n  terminal_at_ms INTEGER,\n  CHECK (\n    (state IN ('local', 'requested')\n      AND environment_id IS NULL AND active_owner_epoch IS NULL\n      AND workspace_base_manifest_ref IS NULL AND remote_workspace_dir IS NULL\n      AND worker_bundle_hash IS NULL\n      AND last_transcript_ack_cursor IS NULL AND last_live_event_ack_cursor IS NULL\n      AND recovery_error IS NULL)\n    OR\n    (state IS 'provisioning'\n      AND active_owner_epoch IS NULL\n      AND workspace_base_manifest_ref IS NULL AND remote_workspace_dir IS NULL\n      AND worker_bundle_hash IS NULL\n      AND last_transcript_ack_cursor IS NULL AND last_live_event_ack_cursor IS NULL\n      AND recovery_error IS NULL)\n    OR\n    (state IS 'syncing'\n      AND environment_id IS NOT NULL AND active_owner_epoch IS NULL\n      AND workspace_base_manifest_ref IS NULL AND remote_workspace_dir IS NULL\n      AND worker_bundle_hash IS NOT NULL\n      AND last_transcript_ack_cursor IS NULL AND last_live_event_ack_cursor IS NULL\n      AND recovery_error IS NULL)\n    OR\n    (state IS 'starting'\n      AND environment_id IS NOT NULL AND active_owner_epoch IS NULL\n      AND workspace_base_manifest_ref IS NOT NULL AND remote_workspace_dir IS NOT NULL\n      AND worker_bundle_hash IS NOT NULL\n      AND last_transcript_ack_cursor IS NULL AND last_live_event_ack_cursor IS NULL\n      AND recovery_error IS NULL)\n    OR\n    (state IN ('active', 'draining', 'reconciling')\n      AND environment_id IS NOT NULL AND active_owner_epoch IS NOT NULL\n      AND workspace_base_manifest_ref IS NOT NULL AND remote_workspace_dir IS NOT NULL\n      AND worker_bundle_hash IS NOT NULL AND recovery_error IS NULL)\n    OR\n    (state IS 'reclaimed'\n      AND environment_id IS NOT NULL AND active_owner_epoch IS NOT NULL\n      AND workspace_base_manifest_ref IS NOT NULL AND remote_workspace_dir IS NOT NULL\n      AND worker_bundle_hash IS NOT NULL AND recovery_error IS NULL\n      AND turn_claim_owner IS NULL AND turn_claim_id IS NULL AND turn_claim_run_id IS NULL\n      AND turn_claim_generation IS NULL AND turn_claim_owner_epoch IS NULL)\n    OR\n    (state IS 'failed' AND recovery_error IS NOT NULL)\n  ),\n  CHECK (\n    (turn_claim_owner IS NULL AND turn_claim_id IS NULL AND turn_claim_run_id IS NULL\n      AND turn_claim_generation IS NULL AND turn_claim_owner_epoch IS NULL)\n    OR\n    (turn_claim_owner IS 'local' AND turn_claim_id IS NOT NULL\n      AND turn_claim_run_id IS NOT NULL AND turn_claim_generation IS NOT NULL\n      AND turn_claim_owner_epoch IS NULL)\n    OR\n    (turn_claim_owner IS 'worker' AND turn_claim_id IS NOT NULL\n      AND turn_claim_run_id IS NOT NULL AND turn_claim_generation IS NOT NULL\n      AND turn_claim_owner_epoch IS NOT NULL)\n  ),\n  CHECK (\n    turn_claim_owner IS NULL\n    OR\n    (turn_claim_owner IS 'local' AND (\n      state IN ('local', 'requested', 'failed')\n      OR (state IN ('active', 'draining') AND execution_mode IS 'remote-exec')\n    ))\n    OR\n    (turn_claim_owner IS 'worker' AND state IN ('active', 'draining')\n      AND (execution_mode IS NULL OR execution_mode IS 'worker-turn')\n      AND turn_claim_owner_epoch IS active_owner_epoch)\n  )\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_worker_session_placements_session_key\n  ON worker_session_placements(agent_id, session_key);\n\nCREATE INDEX IF NOT EXISTS idx_worker_session_placements_reconcile\n  ON worker_session_placements(updated_at_ms, session_id);\n\nCREATE INDEX IF NOT EXISTS idx_worker_session_placements_environment\n  ON worker_session_placements(environment_id)\n  WHERE environment_id IS NOT NULL;\n\n-- Planned placement moves retain their exact source CAS and bounded target\n-- without widening the stable placement-state vocabulary. The opaque operation\n-- id fences stale asynchronous completion; it is correlation, never authority.\nCREATE TABLE IF NOT EXISTS worker_session_placement_moves (\n  operation_id TEXT NOT NULL PRIMARY KEY,\n  session_id TEXT NOT NULL UNIQUE\n    REFERENCES worker_session_placements(session_id) ON DELETE CASCADE,\n  source_generation INTEGER NOT NULL CHECK (source_generation >= 0),\n  source_environment_id TEXT NOT NULL CHECK (\n    length(source_environment_id) BETWEEN 1 AND 256\n    AND source_environment_id = trim(source_environment_id)\n  ),\n  source_owner_epoch INTEGER NOT NULL CHECK (source_owner_epoch >= 1),\n  target_kind TEXT NOT NULL CHECK (target_kind IN ('gateway', 'profile', 'device')),\n  target_id TEXT,\n  -- Keep these nullable columns constraint-free so lazy ALTER TABLE produces the\n  -- same shape as fresh databases; placement-move code validates their values.\n  target_machine_class TEXT,\n  target_os TEXT,\n  -- Explicit source abandonment is a durable operator decision. Keep the bit\n  -- bare and nullable so same-version older readers can safely omit it.\n  abandon_source INTEGER,\n  last_error TEXT,\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  CHECK (\n    (target_kind IS 'gateway' AND target_id IS NULL)\n    OR\n    (target_kind IN ('profile', 'device')\n      AND target_id IS NOT NULL\n      AND length(target_id) BETWEEN 1 AND 256\n      AND target_id = trim(target_id))\n  )\n) STRICT;\n\n-- Worker-visible session RPC authority is persisted against the exact turn\n-- claim. The launch descriptor is informative only; Gateway dispatch always\n-- revalidates this record and the live placement claim before executing.\nCREATE TABLE IF NOT EXISTS worker_turn_tool_authorities (\n  session_id TEXT NOT NULL PRIMARY KEY,\n  environment_id TEXT NOT NULL,\n  owner_epoch INTEGER NOT NULL CHECK (owner_epoch >= 1),\n  placement_generation INTEGER NOT NULL CHECK (placement_generation >= 0),\n  claim_id TEXT NOT NULL,\n  run_id TEXT NOT NULL,\n  tool_names_json TEXT NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  FOREIGN KEY (session_id) REFERENCES worker_session_placements(session_id) ON DELETE CASCADE\n) STRICT;\n\n-- Tool-call ids are idempotency keys only within one exact source turn claim.\n-- A running operation from another Gateway instance is ambiguous and is never\n-- replayed. A persisted random seed separates durable downstream identities\n-- from Gateway authentication keys and survives ordinary process restarts.\nCREATE TABLE IF NOT EXISTS worker_session_tool_operations (\n  source_session_id TEXT NOT NULL,\n  source_claim_id TEXT NOT NULL,\n  tool_call_id TEXT NOT NULL,\n  tool_name TEXT NOT NULL CHECK (tool_name IN ('sessions_spawn', 'sessions_send')),\n  request_digest TEXT NOT NULL,\n  operation_seed TEXT NOT NULL,\n  status TEXT NOT NULL CHECK (status IN ('running', 'succeeded', 'failed', 'unknown')),\n  child_session_key TEXT,\n  result_json TEXT,\n  gateway_instance_id TEXT NOT NULL,\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  PRIMARY KEY (source_session_id, source_claim_id, tool_call_id),\n  FOREIGN KEY (source_session_id)\n    REFERENCES worker_session_placements(session_id) ON DELETE CASCADE\n) STRICT;\n\n-- Local sandbox execution is a projection of a session-owned managed worktree.\n-- No cascade: an older binary must not discard pending edits with a session row.\nCREATE TABLE IF NOT EXISTS local_workspace_projections (\n  worktree_id TEXT NOT NULL PRIMARY KEY,\n  agent_id TEXT NOT NULL,\n  session_key TEXT NOT NULL,\n  session_id TEXT NOT NULL,\n  lifecycle_revision TEXT,\n  projection_path TEXT NOT NULL UNIQUE,\n  base_commit TEXT NOT NULL,\n  source_paths_json TEXT NOT NULL,\n  baseline_json TEXT,\n  baseline_ref TEXT,\n  pending_ref TEXT,\n  pending_target TEXT CHECK (pending_target IN ('canonical', 'projection')),\n  paused_runtimes_json TEXT,\n  journal_json TEXT,\n  journal_pack BLOB CHECK (journal_pack IS NULL OR length(journal_pack) <= 268435456),\n  revision INTEGER NOT NULL DEFAULT 0 CHECK (revision >= 0),\n  created_at_ms INTEGER NOT NULL,\n  CHECK ((baseline_json IS NULL) = (baseline_ref IS NULL)),\n  CHECK ((journal_json IS NULL) = (journal_pack IS NULL))\n) STRICT;\n\n-- A reconciliation journal is written before managed-worktree mutation. The\n-- bounded Git base snapshot repairs any subset left by an interrupted apply.\nCREATE TABLE IF NOT EXISTS worker_workspace_reconciliations (\n  session_id TEXT NOT NULL PRIMARY KEY,\n  environment_id TEXT NOT NULL,\n  owner_epoch INTEGER NOT NULL CHECK (owner_epoch >= 1),\n  placement_generation INTEGER NOT NULL CHECK (placement_generation >= 0),\n  base_manifest_ref TEXT NOT NULL,\n  current_manifest_ref TEXT NOT NULL,\n  plan_json TEXT NOT NULL,\n  base_pack BLOB NOT NULL CHECK (length(base_pack) <= 268435456),\n  created_at_ms INTEGER NOT NULL,\n  FOREIGN KEY (session_id) REFERENCES worker_session_placements(session_id) ON DELETE CASCADE\n) STRICT;\n\n-- A completed remote turn is fenced from stale-claim teardown until its\n-- workspace result is durably reconciled into the managed worktree.\nCREATE TABLE IF NOT EXISTS worker_workspace_pending_results (\n  session_id TEXT NOT NULL PRIMARY KEY,\n  environment_id TEXT NOT NULL,\n  owner_epoch INTEGER NOT NULL CHECK (owner_epoch >= 1),\n  placement_generation INTEGER NOT NULL CHECK (placement_generation >= 0),\n  claim_id TEXT NOT NULL,\n  run_id TEXT NOT NULL,\n  gateway_instance_id TEXT NOT NULL,\n  recovery_requested_at_ms INTEGER,\n  workspace_accepted_at_ms INTEGER,\n  staged_result_ref TEXT,\n  repository_workspace_id TEXT,\n  created_at_ms INTEGER NOT NULL,\n  FOREIGN KEY (session_id) REFERENCES worker_session_placements(session_id) ON DELETE CASCADE\n) STRICT;\n\n-- GitHub publication intent records the authoritative session worktree. Cloud\n-- requests execute only after the exact turn claim's result is accepted locally.\n-- Secrets stay in the effective Gateway-owned GitHub profile and never enter\n-- this row or the worker protocol.\nCREATE TABLE IF NOT EXISTS github_publication_requests (\n  request_id TEXT NOT NULL PRIMARY KEY,\n  idempotency_key TEXT NOT NULL,\n  request_digest TEXT NOT NULL,\n  session_id TEXT NOT NULL,\n  session_key TEXT NOT NULL,\n  agent_id TEXT NOT NULL,\n  worktree_id TEXT NOT NULL,\n  repository_fingerprint TEXT NOT NULL,\n  claim_id TEXT,\n  run_id TEXT,\n  environment_id TEXT,\n  owner_epoch INTEGER CHECK (owner_epoch IS NULL OR owner_epoch >= 1),\n  placement_generation INTEGER CHECK (\n    placement_generation IS NULL OR placement_generation >= 0\n  ),\n  identity_source TEXT NOT NULL CHECK (\n    identity_source IN ('system-detected', 'system-configured', 'agent-override')\n  ),\n  identity_profile_id TEXT,\n  identity_account_id INTEGER NOT NULL CHECK (identity_account_id >= 1),\n  identity_login TEXT NOT NULL,\n  title TEXT,\n  body TEXT,\n  status TEXT NOT NULL CHECK (\n    status IN ('requested', 'publishing', 'published', 'failed')\n  ),\n  gateway_instance_id TEXT,\n  repository TEXT,\n  branch TEXT NOT NULL,\n  base_branch TEXT,\n  source_head_commit TEXT,\n  source_index_tree TEXT,\n  workspace_tree TEXT,\n  head_commit TEXT,\n  pull_request_url TEXT,\n  error_code TEXT,\n  next_action TEXT,\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  reported_at_ms INTEGER,\n  UNIQUE (session_id, idempotency_key),\n  CHECK (\n    (claim_id IS NULL AND run_id IS NULL AND environment_id IS NULL\n      AND owner_epoch IS NULL AND placement_generation IS NULL)\n    OR\n    (claim_id IS NOT NULL AND run_id IS NOT NULL AND placement_generation IS NOT NULL\n      AND ((environment_id IS NULL AND owner_epoch IS NULL)\n        OR (environment_id IS NOT NULL AND owner_epoch IS NOT NULL)))\n  ),\n  CHECK (\n    (identity_source IS 'system-detected' AND identity_profile_id IS NULL)\n    OR\n    (identity_source IN ('system-configured', 'agent-override')\n      AND identity_profile_id IS NOT NULL)\n  ),\n  CHECK (\n    (source_head_commit IS NULL AND source_index_tree IS NULL AND workspace_tree IS NULL)\n    OR\n    (source_head_commit IS NOT NULL AND workspace_tree IS NOT NULL)\n  ),\n  CHECK (\n    (status IS 'published' AND pull_request_url IS NOT NULL AND error_code IS NULL\n      AND next_action IS NULL)\n    OR\n    (status IS 'failed' AND pull_request_url IS NULL AND error_code IS NOT NULL\n      AND next_action IS NOT NULL)\n    OR\n    (status IN ('requested', 'publishing') AND pull_request_url IS NULL\n      AND error_code IS NULL AND next_action IS NULL)\n  )\n) STRICT;\n\nCREATE INDEX IF NOT EXISTS idx_github_publication_requests_pending\n  ON github_publication_requests(status, updated_at_ms, request_id);\n\n-- Personal requests cannot be interpreted or resumed by older shared publishers.\nCREATE TABLE IF NOT EXISTS github_personal_publication_requests (\n  request_id TEXT NOT NULL PRIMARY KEY CHECK (length(request_id) = 36),\n  owner_profile_id TEXT NOT NULL CHECK (length(owner_profile_id) BETWEEN 1 AND 128),\n  connection_generation TEXT NOT NULL CHECK (length(connection_generation) = 36),\n  idempotency_key TEXT NOT NULL CHECK (length(idempotency_key) BETWEEN 1 AND 128),\n  request_digest TEXT NOT NULL CHECK (length(request_digest) = 64),\n  session_id TEXT NOT NULL CHECK (length(session_id) BETWEEN 1 AND 128),\n  session_key TEXT NOT NULL CHECK (length(session_key) BETWEEN 1 AND 1024),\n  agent_id TEXT NOT NULL CHECK (length(agent_id) BETWEEN 1 AND 128),\n  worktree_id TEXT NOT NULL CHECK (length(worktree_id) BETWEEN 1 AND 128),\n  repository_fingerprint TEXT NOT NULL CHECK (length(repository_fingerprint) BETWEEN 1 AND 256),\n  identity_source TEXT NOT NULL CHECK (identity_source = 'personal'),\n  identity_profile_id TEXT NOT NULL CHECK (length(identity_profile_id) = 36),\n  identity_account_id INTEGER NOT NULL CHECK (identity_account_id >= 1),\n  identity_login TEXT NOT NULL CHECK (length(identity_login) BETWEEN 1 AND 39),\n  title TEXT CHECK (title IS NULL OR length(title) BETWEEN 1 AND 256),\n  body TEXT CHECK (body IS NULL OR length(body) BETWEEN 1 AND 8192),\n  status TEXT NOT NULL CHECK (status IN ('requested', 'publishing', 'needs_confirmation', 'published', 'failed')),\n  gateway_instance_id TEXT CHECK (gateway_instance_id IS NULL OR length(gateway_instance_id) BETWEEN 1 AND 128),\n  execution_id TEXT CHECK (execution_id IS NULL OR length(execution_id) = 36),\n  last_effect TEXT CHECK (last_effect IS NULL OR last_effect IN ('push', 'pull_request')),\n  effect_state TEXT CHECK (effect_state IS NULL OR effect_state IN ('dispatched', 'observed')),\n  push_repository TEXT NOT NULL CHECK (length(push_repository) BETWEEN 3 AND 256),\n  repository TEXT NOT NULL CHECK (length(repository) BETWEEN 3 AND 256),\n  branch TEXT NOT NULL CHECK (length(branch) BETWEEN 1 AND 256),\n  base_branch TEXT NOT NULL CHECK (length(base_branch) BETWEEN 1 AND 256),\n  source_head_commit TEXT NOT NULL CHECK (length(source_head_commit) IN (40, 64)),\n  source_index_tree TEXT NOT NULL CHECK (length(source_index_tree) IN (40, 64)),\n  workspace_tree TEXT NOT NULL CHECK (length(workspace_tree) IN (40, 64)),\n  head_commit TEXT CHECK (head_commit IS NULL OR length(head_commit) IN (40, 64)),\n  pull_request_url TEXT CHECK (pull_request_url IS NULL OR length(pull_request_url) BETWEEN 1 AND 2048),\n  error_code TEXT CHECK (error_code IS NULL OR length(error_code) BETWEEN 1 AND 64),\n  next_action TEXT CHECK (next_action IS NULL OR length(next_action) BETWEEN 1 AND 1024),\n  created_at_ms INTEGER NOT NULL CHECK (created_at_ms >= 0),\n  updated_at_ms INTEGER NOT NULL CHECK (updated_at_ms >= created_at_ms),\n  reported_at_ms INTEGER,\n  UNIQUE (owner_profile_id, session_id, idempotency_key),\n  CHECK ((status = 'publishing' AND gateway_instance_id IS NOT NULL AND execution_id IS NOT NULL) OR status <> 'publishing'),\n  CHECK ((last_effect IS NULL AND effect_state IS NULL) OR (last_effect IS NOT NULL AND effect_state IS NOT NULL)),\n  CHECK ((status = 'published' AND pull_request_url IS NOT NULL AND head_commit IS NOT NULL AND error_code IS NULL AND next_action IS NULL)\n    OR (status = 'failed' AND error_code IS NOT NULL AND next_action IS NOT NULL)\n    OR (status IN ('requested', 'publishing', 'needs_confirmation') AND error_code IS NULL AND next_action IS NULL))\n) STRICT;\nCREATE INDEX IF NOT EXISTS idx_github_personal_publication_owner_session\n  ON github_personal_publication_requests(owner_profile_id, session_id, created_at_ms);\nCREATE INDEX IF NOT EXISTS idx_github_personal_publication_pending\n  ON github_personal_publication_requests(status, updated_at_ms, request_id);\n\n-- Older readers validate both local receipt tables exactly. Their immutable\n-- lifecycle binding stays in a first-use companion so those schemas remain readable.\nCREATE TABLE IF NOT EXISTS github_publication_session_lifecycles (\n  publication_kind TEXT NOT NULL CHECK (publication_kind IN ('shared', 'personal')),\n  request_id TEXT NOT NULL,\n  lifecycle_revision TEXT,\n  requester_authority_json TEXT,\n  PRIMARY KEY (publication_kind, request_id)\n) STRICT;\n\n-- One active, opaque admission credential per worker environment. Plaintext\n-- may be retried until delivery acknowledgement but never enters durable state.\nCREATE TABLE IF NOT EXISTS worker_environment_credentials (\n  environment_id TEXT NOT NULL PRIMARY KEY,\n  credential_hash TEXT NOT NULL UNIQUE,\n  bundle_hash TEXT NOT NULL,\n  session_id TEXT,\n  rpc_set_version INTEGER NOT NULL CHECK (rpc_set_version >= 1),\n  owner_epoch INTEGER NOT NULL CHECK (owner_epoch >= 0),\n  expires_at_ms INTEGER NOT NULL CHECK (expires_at_ms >= 0),\n  delivered_at_ms INTEGER CHECK (delivered_at_ms >= 0),\n  FOREIGN KEY (environment_id) REFERENCES worker_environments(environment_id) ON DELETE CASCADE\n) STRICT;\n\n-- One durable sequence cursor per attached session owner epoch. The environment\n-- binding prevents independent workers with coincident epochs from sharing replay state.\nCREATE TABLE IF NOT EXISTS worker_transcript_commit_heads (\n  session_id TEXT NOT NULL,\n  run_epoch INTEGER NOT NULL CHECK (run_epoch >= 0),\n  environment_id TEXT NOT NULL,\n  next_seq INTEGER NOT NULL CHECK (next_seq >= 1),\n  updated_at_ms INTEGER NOT NULL CHECK (updated_at_ms >= 0),\n  PRIMARY KEY (session_id, run_epoch)\n) STRICT;\n\n-- Pending rows preserve a claimed request across gateway restarts. Terminal rows\n-- cache the exact result returned for deterministic at-least-once replay.\nCREATE TABLE IF NOT EXISTS worker_transcript_commits (\n  session_id TEXT NOT NULL,\n  run_epoch INTEGER NOT NULL CHECK (run_epoch >= 0),\n  seq INTEGER NOT NULL CHECK (seq >= 1),\n  request_hash TEXT NOT NULL,\n  state TEXT NOT NULL CHECK (state IN ('pending', 'terminal')),\n  result_json TEXT,\n  created_at_ms INTEGER NOT NULL CHECK (created_at_ms >= 0),\n  updated_at_ms INTEGER NOT NULL CHECK (updated_at_ms >= 0),\n  PRIMARY KEY (session_id, run_epoch, seq),\n  FOREIGN KEY (session_id, run_epoch)\n    REFERENCES worker_transcript_commit_heads(session_id, run_epoch)\n    ON DELETE CASCADE,\n  CHECK (\n    (state = 'pending' AND result_json IS NULL) OR\n    (state = 'terminal' AND result_json IS NOT NULL)\n  )\n) STRICT;\n\n-- Pending rows preserve a claimed inference turn across gateway restarts.\n-- Terminal rows cache the exact outcome returned for deterministic replay.\nCREATE TABLE IF NOT EXISTS worker_inference_turns (\n  session_id TEXT NOT NULL,\n  run_epoch INTEGER NOT NULL CHECK (run_epoch >= 0),\n  run_id TEXT NOT NULL,\n  turn_id TEXT NOT NULL,\n  environment_id TEXT NOT NULL,\n  request_hash TEXT NOT NULL,\n  state TEXT NOT NULL CHECK (state IN ('pending', 'terminal')),\n  terminal_json TEXT,\n  created_at_ms INTEGER NOT NULL CHECK (created_at_ms >= 0),\n  updated_at_ms INTEGER NOT NULL CHECK (updated_at_ms >= 0),\n  PRIMARY KEY (session_id, run_epoch, run_id, turn_id),\n  FOREIGN KEY (environment_id) REFERENCES worker_environments(environment_id) ON DELETE CASCADE,\n  CHECK (\n    (state = 'pending' AND terminal_json IS NULL) OR\n    (state = 'terminal' AND terminal_json IS NOT NULL)\n  )\n) STRICT;\n\nCREATE UNIQUE INDEX IF NOT EXISTS idx_worker_inference_turns_pending_run\n  ON worker_inference_turns(session_id, run_epoch, run_id)\n  WHERE state = 'pending';\n\nCREATE TABLE IF NOT EXISTS fleet_cells (\n  tenant_id TEXT NOT NULL PRIMARY KEY,\n  created_at_ms INTEGER NOT NULL,\n  image TEXT NOT NULL,\n  runtime TEXT NOT NULL,\n  host_port INTEGER NOT NULL,\n  container_name TEXT NOT NULL,\n  data_dir TEXT NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS claw_installs (\n  agent_id TEXT NOT NULL PRIMARY KEY,\n  schema_version TEXT NOT NULL,\n  source_kind TEXT NOT NULL,\n  claw_name TEXT NOT NULL,\n  claw_version TEXT NOT NULL,\n  package_root TEXT NOT NULL,\n  manifest_path TEXT NOT NULL,\n  integrity_kind TEXT NOT NULL,\n  integrity TEXT NOT NULL,\n  source_byte_length INTEGER NOT NULL,\n  manifest_schema_version INTEGER NOT NULL,\n  plan_integrity TEXT NOT NULL,\n  workspace TEXT NOT NULL UNIQUE,\n  agent_config_digest TEXT NOT NULL,\n  agent_owned_paths_json TEXT NOT NULL,\n  bootstrap_source_path TEXT,\n  bootstrap_content_digest TEXT,\n  status TEXT NOT NULL CHECK (\n    status IN ('pending', 'workspace_ready', 'config_committed', 'complete', 'partial')\n  ),\n  added_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS claw_workspace_files (\n  agent_id TEXT NOT NULL,\n  target_path TEXT NOT NULL,\n  schema_version TEXT NOT NULL,\n  workspace TEXT NOT NULL,\n  source_path TEXT NOT NULL,\n  content_digest TEXT NOT NULL,\n  status TEXT NOT NULL,\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  PRIMARY KEY (agent_id, target_path)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS claw_package_refs (\n  agent_id TEXT NOT NULL,\n  package_kind TEXT NOT NULL,\n  package_source TEXT NOT NULL,\n  package_ref TEXT NOT NULL,\n  package_version TEXT NOT NULL,\n  package_integrity TEXT NOT NULL,\n  schema_version TEXT NOT NULL,\n  claw_name TEXT NOT NULL,\n  package_status TEXT NOT NULL,\n  relationship TEXT NOT NULL CHECK (relationship IN ('managed', 'referenced')),\n  origin TEXT NOT NULL CHECK (origin IN ('claw-introduced', 'pre-existing')),\n  independent_owner INTEGER NOT NULL CHECK (independent_owner IN (0, 1)),\n  extension_id TEXT,\n  extension_format TEXT,\n  extension_detected_format TEXT,\n  extension_mapped_json TEXT,\n  extension_unavailable_json TEXT,\n  extension_adapter_identity TEXT,\n  installed_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  PRIMARY KEY (agent_id, package_kind, package_source, package_ref, package_version)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS claw_cron_refs (\n  agent_id TEXT NOT NULL,\n  manifest_id TEXT NOT NULL,\n  schema_version TEXT NOT NULL,\n  declaration_key TEXT NOT NULL UNIQUE,\n  scheduler_job_id TEXT UNIQUE,\n  status TEXT NOT NULL,\n  job_json TEXT NOT NULL,\n  error TEXT,\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  PRIMARY KEY (agent_id, manifest_id)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS claw_mcp_server_refs (\n  agent_id TEXT NOT NULL,\n  name TEXT NOT NULL,\n  schema_version TEXT NOT NULL,\n  config_digest TEXT NOT NULL,\n  relationship TEXT NOT NULL CHECK (relationship IN ('managed', 'referenced')),\n  origin TEXT NOT NULL CHECK (origin IN ('claw-introduced', 'pre-existing')),\n  independent_owner INTEGER NOT NULL DEFAULT 0 CHECK (independent_owner IN (0, 1)),\n  status TEXT NOT NULL,\n  error TEXT,\n  created_at_ms INTEGER NOT NULL,\n  updated_at_ms INTEGER NOT NULL,\n  PRIMARY KEY (agent_id, name)\n) STRICT;\n\nCREATE TABLE IF NOT EXISTS outbound_media_provenance (\n  realpath TEXT NOT NULL PRIMARY KEY,\n  kind TEXT NOT NULL,\n  version INTEGER NOT NULL,\n  sha256 TEXT NOT NULL,\n  size_bytes INTEGER NOT NULL,\n  created_at_ms INTEGER NOT NULL\n) STRICT;\n\n-- scope_id is non-null because SQLite treats NULLs as distinct in unique indexes/PKs,\n-- which would allow duplicate team rows. This PK also avoids a rebuild for identity scope.\nCREATE TABLE IF NOT EXISTS secret_store_entries (\n  scope_kind TEXT NOT NULL CHECK (scope_kind IN ('team', 'identity')),\n  scope_id TEXT NOT NULL,\n  name TEXT NOT NULL,\n  value TEXT NOT NULL,\n  kind TEXT NOT NULL CHECK (kind IN ('secret', 'env')),\n  created_at_ms INTEGER NOT NULL CHECK (created_at_ms >= 0),\n  updated_at_ms INTEGER NOT NULL CHECK (updated_at_ms >= 0),\n  updated_by TEXT,\n  deleted_at_ms INTEGER,\n  allowed_hosts TEXT,\n  CHECK ((scope_kind = 'team' AND scope_id = '') OR (scope_kind = 'identity' AND length(scope_id) > 0)),\n  PRIMARY KEY (scope_kind, scope_id, name)\n) STRICT;\nCREATE INDEX IF NOT EXISTS secret_store_entries_live_idx\n  ON secret_store_entries (scope_kind, scope_id, name) WHERE deleted_at_ms IS NULL;\n";
//#endregion
//#region src/state/openclaw-state-db-operator-approval-migration.ts
const COLUMNS = [
	"approval_id",
	"resolution_ref",
	"kind",
	"status",
	"presentation_json",
	"requested_by_device_id",
	"requested_by_client_id",
	"requested_by_device_token_auth",
	"reviewer_device_ids_json",
	"source_agent_id",
	"source_session_key",
	"source_session_id",
	"source_run_id",
	"source_tool_call_id",
	"source_tool_name",
	"audience_session_keys_json",
	"runtime_epoch",
	"created_at_ms",
	"expires_at_ms",
	"updated_at_ms",
	"decision",
	"terminal_reason",
	"resolved_at_ms",
	"resolver_kind",
	"resolver_id",
	"consumed_at_ms",
	"consumed_by"
];
function tableSql$1(db) {
	const row = db.prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'operator_approvals'").get();
	return typeof row?.sql === "string" ? row.sql : void 0;
}
function hasCanonicalOperatorApprovalKinds(db) {
	if (!tableExists(db, "operator_approvals")) return true;
	return /kind\s+text\s+not\s+null\s+check\s*\(\s*kind\s+in\s*\(\s*'exec'\s*,\s*'plugin'\s*,\s*'system-agent'\s*\)\s*\)/.test(tableSql$1(db)?.toLowerCase() ?? "");
}
function assertCanonicalOperatorApprovalKinds(db, pathname) {
	if (!hasCanonicalOperatorApprovalKinds(db)) throw new Error(`OpenClaw state database ${pathname} has a legacy operator approval schema; run openclaw doctor --fix to migrate it.`);
}
function isCanonicalOperatorApprovalKind(value) {
	return value === "exec" || value === "plugin" || value === "system-agent";
}
function detectOperatorApprovalSchemaMigration(db, path) {
	return hasCanonicalOperatorApprovalKinds(db) ? [] : [{
		kind: "operator-approvals-system-agent",
		path
	}];
}
function normalizeDdl(sql) {
	return sql.replace(/\s+/g, " ").trim().replace(/;$/, "");
}
function canonicalOperatorApprovalCreateSql() {
	const marker = "CREATE TABLE IF NOT EXISTS operator_approvals (";
	const tableTerminator = "\n) STRICT;";
	const start = OPENCLAW_STATE_SCHEMA_SQL.indexOf(marker);
	const end = OPENCLAW_STATE_SCHEMA_SQL.indexOf(`${tableTerminator}\n\nCREATE INDEX IF NOT EXISTS idx_operator_approvals_status_expiry`, start);
	if (start < 0 || end < 0) throw new Error("canonical operator approval schema is unavailable");
	return OPENCLAW_STATE_SCHEMA_SQL.slice(start, end + 10);
}
function alterAppendedResolutionRefCreateSql(sql) {
	const resolutionRefStart = sql.indexOf("\n  resolution_ref ");
	const followingColumnStart = sql.indexOf("\n  kind ", resolutionRefStart);
	const tailColumn = "\n  consumed_by TEXT,";
	const tailColumnStart = sql.indexOf(tailColumn, followingColumnStart);
	if (resolutionRefStart < 0 || followingColumnStart < 0 || tailColumnStart < 0) throw new Error("canonical operator approval resolution reference schema is unavailable");
	return (sql.slice(0, resolutionRefStart) + sql.slice(followingColumnStart)).replace(tailColumn, `${tailColumn} resolution_ref TEXT,`);
}
function hasExactLegacyOperatorApprovalSchema(db) {
	const live = tableSql$1(db);
	if (!live) return false;
	const exactStrictLegacy = canonicalOperatorApprovalCreateSql().replace("CREATE TABLE IF NOT EXISTS operator_approvals (", "CREATE TABLE operator_approvals (").replace(/'exec',\s*'plugin',\s*'system-agent'/, "'exec', 'plugin'");
	const normalizedLive = normalizeDdl(live);
	return [exactStrictLegacy, alterAppendedResolutionRefCreateSql(exactStrictLegacy)].some((strictLegacy) => [strictLegacy, strictLegacy.replace(/\) STRICT;$/u, ");")].map(normalizeDdl).includes(normalizedLive));
}
function canonicalCreateSql() {
	return canonicalOperatorApprovalCreateSql().replace("CREATE TABLE IF NOT EXISTS operator_approvals (", "CREATE TABLE operator_approvals_migration_new (");
}
function operatorApprovalIndexSql() {
	const statements = OPENCLAW_STATE_SCHEMA_SQL.split(";").map((statement) => statement.trim()).filter((statement) => /^CREATE (?:UNIQUE )?INDEX IF NOT EXISTS idx_operator_approvals_/.test(statement));
	if (statements.length === 0) throw new Error("canonical operator approval index schema is unavailable");
	return `${statements.join(";\n")};`;
}
function repairOperatorApprovalKinds(db) {
	if (hasCanonicalOperatorApprovalKinds(db) || tableExists(db, "operator_approvals_migration_new") || !hasExactLegacyOperatorApprovalSchema(db)) return false;
	const columns = COLUMNS.join(", ");
	runSqliteImmediateTransactionSync(db, () => {
		db.exec(canonicalCreateSql());
		db.exec(`
      INSERT INTO operator_approvals_migration_new (${columns})
      SELECT ${columns} FROM operator_approvals
      WHERE typeof(resolution_ref) = 'text'
        AND length(resolution_ref) = 43
        AND resolution_ref NOT GLOB '*[^A-Za-z0-9_-]*';
      DROP TABLE operator_approvals;
      ALTER TABLE operator_approvals_migration_new RENAME TO operator_approvals;
    `);
		db.exec(operatorApprovalIndexSql());
	});
	return true;
}
function repairOperatorApprovalSchema(db) {
	return repairOperatorApprovalKinds(db) ? ["Migrated shared state operator approvals → OpenClaw system changes"] : [];
}
//#endregion
//#region src/state/openclaw-state-db-legacy-backfills.ts
const taskIdentifierWhitespace = "	\n\v\f\r \xA0            \u2028\u2029  　﻿";
function ensureOperatorApprovalResolutionRefs(db) {
	if (!tableExists(db, "operator_approvals")) return;
	runSqliteImmediateTransactionSync(db, () => {
		ensureColumn(db, "operator_approvals", "resolution_ref TEXT");
		const rows = db.prepare("SELECT approval_id, kind, resolution_ref FROM operator_approvals").all();
		const update = db.prepare("UPDATE operator_approvals SET resolution_ref = ? WHERE approval_id = ?");
		for (const row of rows) {
			if (typeof row.approval_id !== "string" || !isCanonicalOperatorApprovalKind(row.kind)) throw new Error("operator approval row cannot be assigned a transport reference");
			const resolutionRef = buildApprovalResolutionRef({
				approvalId: row.approval_id,
				approvalKind: row.kind
			});
			if (row.resolution_ref !== resolutionRef) update.run(resolutionRef, row.approval_id);
		}
		if (db.prepare(`SELECT canonical.approval_id
         FROM operator_approvals AS canonical
         JOIN operator_approvals AS referenced
           ON canonical.approval_id = referenced.resolution_ref
         WHERE canonical.approval_id <> referenced.approval_id
         LIMIT 1`).get()) throw new Error("operator approval ids conflict with durable transport references");
		db.exec(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_operator_approvals_resolution_ref
        ON operator_approvals(resolution_ref);
    `);
	});
}
function repairLegacyTaskAgentAttribution(db) {
	if (!tableExists(db, "task_runs") || !tableHasColumn(db, "task_runs", "requester_agent_id")) return;
	db.exec(`
    UPDATE task_runs
    SET
      requester_agent_id = CASE
        WHEN owner_key GLOB 'agent:*:*' THEN substr(
          owner_key,
          7,
          instr(substr(owner_key, 7), ':') - 1
        )
        WHEN requester_session_key GLOB 'agent:*:*' THEN substr(
          requester_session_key,
          7,
          instr(substr(requester_session_key, 7), ':') - 1
        )
        WHEN agent_id <> substr(
          child_session_key,
          7,
          instr(substr(child_session_key, 7), ':') - 1
        ) THEN agent_id
        ELSE NULL
      END,
      agent_id = substr(
        child_session_key,
        7,
        instr(substr(child_session_key, 7), ':') - 1
      )
    WHERE requester_agent_id IS NULL
      AND runtime IN ('subagent', 'acp')
      AND child_session_key GLOB 'agent:*:*'
      AND instr(substr(child_session_key, 7), ':') > 1
      AND (
        owner_key GLOB 'agent:*:*'
        OR requester_session_key GLOB 'agent:*:*'
        OR (
          agent_id IS NOT NULL
          AND agent_id <> substr(
            child_session_key,
            7,
            instr(substr(child_session_key, 7), ':') - 1
          )
        )
      );
  `);
}
function repairLegacyTaskDeliveryStatuses(db) {
	if (!tableExists(db, "task_runs") || !tableHasColumn(db, "task_runs", "delivery_status")) return;
	db.exec(`
    UPDATE task_runs
    SET delivery_status = 'not_applicable'
    WHERE delivery_status = 'not-requested';
  `);
}
/** Recover the task owner lost by stable steer replacements before runtime hydration. */
function repairLegacySubagentTaskBindings(db) {
	if (!tableExists(db, "subagent_runs") || !tableExists(db, "task_runs")) return;
	db.prepare(`
    WITH runs AS MATERIALIZED (
      SELECT run_id, trim(child_session_key, ?) AS child_session_key, requester_session_key, created_at,
        CASE WHEN json_valid(payload_json) THEN payload_json ELSE 'null' END AS payload
      FROM subagent_runs
    ), bindings AS MATERIALIZED (
      SELECT run.run_id, task.run_id AS task_run_id
      FROM runs AS run JOIN task_runs AS task
        ON task.child_session_key = run.child_session_key
      WHERE task.runtime = 'subagent'
        AND task.requester_session_key = run.requester_session_key
        AND task.run_id <> '' AND trim(task.run_id) = task.run_id
        AND json_type(run.payload, '$.taskRunId') IS NULL
        AND json_type(run.payload, '$.completion.required') = 'true'
        AND json_type(run.payload, '$.sessionStartedAt') IN ('integer', 'real')
        AND json_extract(run.payload, '$.sessionStartedAt') < run.created_at
        AND task.created_at BETWEEN json_extract(run.payload, '$.sessionStartedAt')
          AND run.created_at
        AND (SELECT count(*) FROM runs AS sibling
          WHERE sibling.child_session_key = run.child_session_key) = 1
        AND (SELECT count(*) FROM task_runs AS sibling
          WHERE sibling.runtime = 'subagent'
            AND sibling.child_session_key = run.child_session_key) = 1
        AND (SELECT count(*) FROM task_runs AS sibling
          WHERE sibling.run_id = task.run_id) = 1
        AND NOT EXISTS (SELECT 1 FROM runs AS sibling
          WHERE json_type(sibling.payload) <> 'object' OR coalesce(
            CASE WHEN json_type(sibling.payload, '$.taskRunId') = 'text'
              THEN nullif(trim(json_extract(sibling.payload, '$.taskRunId'), ?), '') END,
            sibling.run_id
          ) = task.run_id)
    )
    UPDATE subagent_runs SET payload_json = json_set(payload_json, '$.taskRunId',
      (SELECT task_run_id FROM bindings WHERE bindings.run_id = subagent_runs.run_id))
    WHERE run_id IN (SELECT run_id FROM bindings);
  `).run(taskIdentifierWhitespace, taskIdentifierWhitespace);
}
function nullableTextValue(record, key) {
	if (!record || !Object.hasOwn(record, key)) return;
	const value = record[key];
	return typeof value === "string" || value === null ? value : void 0;
}
function selectLegacyRetainedTaskResult(completion, primary, fallback) {
	const terminalReply = normalizeAgentRunTerminalReplySnapshot(completion.terminalReply);
	if (terminalReply) return terminalReply.disposition === "visible" ? terminalReply.text : null;
	return selectDeliverableSessionsReply(primary, fallback) ?? null;
}
/** Promote shipped retained results before runtime hydrates canonical subagent/task state. */
function repairLegacySubagentRetainedResults(db) {
	if (!tableExists(db, "subagent_runs")) return;
	const repair = () => {
		const hasLegacyPendingPayload = tableHasColumn(db, "subagent_runs", "pending_final_delivery_payload_json");
		const rows = db.prepare(hasLegacyPendingPayload ? "SELECT run_id, payload_json, pending_final_delivery_payload_json FROM subagent_runs" : "SELECT run_id, payload_json FROM subagent_runs").all();
		const updateRun = db.prepare(`UPDATE subagent_runs
          SET payload_json = ?
        WHERE run_id = ?`);
		const updateTask = tableExists(db, "task_runs") && tableHasColumn(db, "task_runs", "progress_summary") ? db.prepare(`UPDATE task_runs
              SET progress_summary = ?
            WHERE runtime = 'subagent'
              AND run_id = ?
              AND (progress_summary IS NULL
                OR trim(progress_summary) = ''
                OR (? IS NOT NULL AND trim(progress_summary) = ?))`) : void 0;
		for (const row of rows) {
			const payload = parseJsonRecord(row.payload_json);
			const completion = payload ? recordField(payload, "completion") : null;
			if (!payload || !completion) continue;
			const delivery = recordField(payload, "delivery");
			const deliveryPayload = delivery ? recordField(delivery, "payload") : null;
			const pendingPayload = row.pending_final_delivery_payload_json ? parseJsonRecord(row.pending_final_delivery_payload_json) : null;
			if (!Boolean(deliveryPayload && (Object.hasOwn(deliveryPayload, "frozenResultText") || Object.hasOwn(deliveryPayload, "fallbackFrozenResultText")) || pendingPayload && (Object.hasOwn(pendingPayload, "frozenResultText") || Object.hasOwn(pendingPayload, "fallbackFrozenResultText")))) continue;
			const legacyPrimary = nullableTextValue(deliveryPayload, "frozenResultText") ?? nullableTextValue(pendingPayload, "frozenResultText");
			const legacyFallback = nullableTextValue(deliveryPayload, "fallbackFrozenResultText") ?? nullableTextValue(pendingPayload, "fallbackFrozenResultText");
			if (nullableTextValue(completion, "resultText") == null && legacyPrimary !== void 0) completion.resultText = legacyPrimary;
			if (nullableTextValue(completion, "fallbackResultText") == null && legacyFallback !== void 0) completion.fallbackResultText = legacyFallback;
			delete deliveryPayload?.frozenResultText;
			delete deliveryPayload?.fallbackFrozenResultText;
			const primary = nullableTextValue(completion, "resultText");
			const fallback = nullableTextValue(completion, "fallbackResultText");
			updateRun.run(JSON.stringify(payload), row.run_id);
			const taskRunId = textField(payload, "taskRunId")?.trim() ?? row.run_id;
			const terminalReply = normalizeAgentRunTerminalReplySnapshot(completion.terminalReply);
			const taskResult = selectLegacyRetainedTaskResult(completion, primary, fallback);
			if (updateTask && (taskResult || terminalReply)) {
				const retainedPrimary = primary?.trim() || null;
				updateTask.run(taskResult, taskRunId, retainedPrimary, retainedPrimary);
			}
		}
	};
	if (db.isTransaction) {
		repair();
		return;
	}
	runSqliteImmediateTransactionSync(db, repair);
}
/** Canonicalize shipped subagent rows whose pause/kill owner only wrote root terminal fields. */
function repairLegacySubagentExecutionPayloads(db) {
	if (!tableExists(db, "subagent_runs")) return;
	db.exec(`
    UPDATE subagent_runs
    SET payload_json = json_remove(
      CASE
        WHEN json_extract(payload_json, '$.pauseReason') = 'sessions_yield'
          AND json_extract(payload_json, '$.execution.status') <> 'terminal'
          AND json_type(payload_json, '$.endedAt') IN ('integer', 'real')
        THEN json_remove(json_set(
          payload_json,
          '$.execution.status', 'terminal',
          '$.execution.endedAt', json_extract(payload_json, '$.endedAt')
        ), '$.execution.outcome')
        WHEN (json_type(payload_json, '$.killReconciliation') = 'object'
          OR json_extract(payload_json, '$.endedReason') = 'subagent-killed')
          AND json_extract(payload_json, '$.execution.status') <> 'terminal'
          AND json_type(payload_json, '$.endedAt') IN ('integer', 'real')
          AND json_type(payload_json, '$.outcome') = 'object'
        THEN json_set(
          payload_json,
          '$.execution.status', 'terminal',
          '$.execution.endedAt', json_extract(payload_json, '$.endedAt'),
          '$.execution.outcome', json_extract(payload_json, '$.outcome')
        )
        ELSE payload_json
      END,
      '$.startedAt', '$.endedAt', '$.outcome'
    )
    WHERE json_valid(payload_json)
      AND (json_type(payload_json, '$.startedAt') IS NOT NULL
        OR json_type(payload_json, '$.endedAt') IS NOT NULL
        OR json_type(payload_json, '$.outcome') IS NOT NULL);
  `);
}
/** Canonicalize the shipped suspension reason before runtime hydrates subagent state. */
function repairLegacySubagentSuspensionReasons(db) {
	if (!tableExists(db, "subagent_runs")) return;
	db.exec(`
    UPDATE subagent_runs
    SET payload_json = json_set(payload_json, '$.delivery.suspendedReason', 'permanent_failure')
    WHERE json_valid(payload_json)
      AND json_extract(payload_json, '$.delivery.suspendedReason') = 'retry-limit';
  `);
}
function backfillAcpReplayEstimatedBytes(db) {
	if (!tableExists(db, "acp_replay_events") || !tableHasColumn(db, "acp_replay_events", "estimated_bytes")) return;
	const replayDb = getNodeSqliteKysely(db);
	const updateEvent = db.prepare("UPDATE acp_replay_events SET estimated_bytes = ? WHERE session_id = ? AND seq = ?");
	for (const row of iterateSqliteQuerySync(db, replayDb.selectFrom("acp_replay_events").select([
		"session_id",
		"seq",
		"session_key",
		"run_id",
		"update_json",
		"estimated_bytes"
	]))) {
		const expected = estimateAcpEventRowBytes({
			sessionId: row.session_id,
			sessionKey: row.session_key,
			runId: row.run_id,
			updateJson: row.update_json
		});
		if (coerceRequiredSqliteNumber(row.estimated_bytes) !== expected) updateEvent.run(expected, row.session_id, row.seq);
	}
	const updateSession = db.prepare("UPDATE acp_replay_sessions SET estimated_bytes = ? WHERE session_id = ?");
	for (const row of iterateSqliteQuerySync(db, replayDb.selectFrom("acp_replay_sessions as s").select([
		"s.session_id",
		"s.session_key",
		"s.cwd",
		"s.estimated_bytes"
	]).select((eb) => eb.fn.coalesce(eb.selectFrom("acp_replay_events as e").select((events) => events.fn.sum("e.estimated_bytes").as("total")).whereRef("e.session_id", "=", "s.session_id"), eb.val(0)).as("event_bytes")))) {
		const expected = estimateAcpSessionRowBytes({
			sessionId: row.session_id,
			sessionKey: row.session_key,
			cwd: row.cwd
		}) + coerceRequiredSqliteNumber(row.event_bytes);
		if (coerceRequiredSqliteNumber(row.estimated_bytes) !== expected) updateSession.run(expected, row.session_id);
	}
}
function backfillCronRunLogEntryJson(db) {
	if (!tableExists(db, "cron_run_logs") || !tableHasColumn(db, "cron_run_logs", "entry_json")) return;
	const rows = db.prepare(`SELECT store_key, job_id, seq, ts
         FROM cron_run_logs
        WHERE entry_json = '{}'`).all();
	if (rows.length === 0) return;
	const update = db.prepare(`UPDATE cron_run_logs
        SET entry_json = ?
      WHERE store_key = ? AND job_id = ? AND seq = ?`);
	for (const row of rows) update.run(JSON.stringify({
		ts: coerceRequiredSqliteNumber(row.ts),
		jobId: row.job_id,
		action: "finished"
	}), row.store_key, row.job_id, row.seq);
}
function parseJsonRecord(value) {
	return safeParseJsonRecord(value) ?? null;
}
function textField(record, key) {
	const value = record[key];
	return typeof value === "string" && value.trim() ? value : null;
}
function numberField(record, key) {
	return asFiniteNumber(record[key]) ?? null;
}
function recordField(record, key) {
	return asNullableRecord(record[key]);
}
function backfillCronJobsFromJobJson(db) {
	if (!tableExists(db, "cron_jobs") || !tableHasColumn(db, "cron_jobs", "job_json") || !tableHasColumn(db, "cron_jobs", "payload_kind")) return;
	const rows = db.prepare(`SELECT store_key, job_id, job_json, updated_at
         FROM cron_jobs
        WHERE payload_kind = 'message'
           OR name = ''`).all();
	if (rows.length === 0) return;
	const update = db.prepare(`UPDATE cron_jobs
        SET name = ?,
            enabled = ?,
            agent_id = ?,
            payload_kind = ?,
            runtime_updated_at_ms = ?
      WHERE store_key = ?
        AND job_id = ?`);
	for (const row of rows) {
		const job = parseJsonRecord(row.job_json);
		if (!job) continue;
		const schedule = recordField(job, "schedule");
		const payload = recordField(job, "payload");
		const scheduleKind = textField(schedule ?? {}, "kind");
		const payloadKind = textField(payload ?? {}, "kind");
		const isAt = scheduleKind === "at" && textField(schedule ?? {}, "at");
		const isEvery = scheduleKind === "every" && numberField(schedule ?? {}, "everyMs") != null;
		const isCron = scheduleKind === "cron" && textField(schedule ?? {}, "expr");
		const isSystemEvent = payloadKind === "systemEvent" && textField(payload ?? {}, "text");
		const isAgentTurn = payloadKind === "agentTurn" && textField(payload ?? {}, "message");
		if (!schedule || !payload || !isAt && !isEvery && !isCron || !isSystemEvent && !isAgentTurn) continue;
		update.run(textField(job, "name") ?? row.job_id, job.enabled === false ? 0 : 1, textField(job, "agentId"), payloadKind, numberField(job, "updatedAtMs") ?? (coerceRequiredSqliteNumber(row.updated_at) || 0), row.store_key, row.job_id);
	}
}
function metadataStringField(record, key) {
	return textField(record, key);
}
function backfillDeliveryQueueEntriesFromEntryJson(db) {
	if (!tableExists(db, "delivery_queue_entries") || !tableHasColumn(db, "delivery_queue_entries", "entry_json") || !tableHasColumn(db, "delivery_queue_entries", "retry_count")) return;
	compactLegacyDeliveryQueueFailures(db);
	const rows = db.prepare(`SELECT queue_name, id, entry_json
         FROM delivery_queue_entries
        WHERE status = 'pending'
          AND (retry_count = 0
            OR last_attempt_at IS NULL
            OR last_error IS NULL
            OR recovery_state IS NULL
            OR platform_send_started_at IS NULL
            OR entry_kind IS NULL
            OR session_key IS NULL
            OR channel IS NULL
            OR target IS NULL
            OR account_id IS NULL)`).all();
	if (rows.length === 0) return;
	const update = db.prepare(`UPDATE delivery_queue_entries
        SET entry_kind = COALESCE(?, entry_kind),
            session_key = COALESCE(?, session_key),
            channel = COALESCE(?, channel),
            target = COALESCE(?, target),
            account_id = COALESCE(?, account_id),
            retry_count = ?,
            last_attempt_at = COALESCE(?, last_attempt_at),
            last_error = COALESCE(?, last_error),
            recovery_state = COALESCE(?, recovery_state),
            platform_send_started_at = COALESCE(?, platform_send_started_at)
      WHERE queue_name = ?
        AND id = ?`);
	for (const row of rows) {
		const entry = parseJsonRecord(row.entry_json);
		if (!entry) continue;
		const session = recordField(entry, "session");
		const route = recordField(entry, "route");
		const deliveryContext = recordField(entry, "deliveryContext");
		update.run(metadataStringField(entry, "kind"), metadataStringField(entry, "sessionKey") ?? (session ? metadataStringField(session, "key") : null), metadataStringField(entry, "channel") ?? (route ? metadataStringField(route, "channel") : null) ?? (deliveryContext ? metadataStringField(deliveryContext, "channel") : null), metadataStringField(entry, "to") ?? (route ? metadataStringField(route, "to") : null) ?? (deliveryContext ? metadataStringField(deliveryContext, "to") : null), metadataStringField(entry, "accountId") ?? (route ? metadataStringField(route, "accountId") : null) ?? (deliveryContext ? metadataStringField(deliveryContext, "accountId") : null), asSafeIntegerInRange(entry.retryCount, { min: 0 }) ?? 0, asSafeIntegerInRange(entry.lastAttemptAt, { min: 0 }) ?? null, metadataStringField(entry, "lastError"), metadataStringField(entry, "recoveryState"), asSafeIntegerInRange(entry.platformSendStartedAt, { min: 0 }) ?? null, row.queue_name, row.id);
	}
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
	const startMarker = `CREATE TABLE IF NOT EXISTS ${tableName} (`;
	const start = OPENCLAW_STATE_SCHEMA_SQL.indexOf(startMarker);
	const end = start >= 0 ? OPENCLAW_STATE_SCHEMA_SQL.indexOf("\n) STRICT;", start) : -1;
	if (start < 0 || end < 0) throw new Error(`Canonical ${tableName} schema block is missing`);
	const migrationSchema = OPENCLAW_STATE_SCHEMA_SQL.slice(start, end + 10).replace(startMarker, `CREATE TABLE ${migrationTable} (`);
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
		const workspaceDirColumn = tableHasColumn(db, "installed_plugin_index", "workspace_dir") ? "workspace_dir" : "NULL AS workspace_dir";
		const rawRow = db.prepare(`SELECT version, warning, host_contract_version, compat_registry_version,
                migration_version, policy_hash, generated_at_ms, ${workspaceDirColumn},
                refresh_reason, install_records_json, plugins_json, diagnostics_json,
                updated_at_ms
           FROM installed_plugin_index
          WHERE index_key = 'installed-plugin-index'`).get();
		const installRecords = asNullableRecord(safeParseJson(String(rawRow?.install_records_json ?? "")));
		const plugins = safeParseJson(String(rawRow?.plugins_json ?? ""));
		const diagnostics = safeParseJson(String(rawRow?.diagnostics_json ?? ""));
		const row = rawRow && installRecords && Array.isArray(plugins) && Array.isArray(diagnostics) ? rawRow : void 0;
		if (row) {
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
//#region src/state/openclaw-state-schema-compatibility.ts
const CLAW_LAZY_ADDITIVE_STATE_COLUMNS = CLAW_LAZY_ADDITIVE_STATE_COLUMN_DEFINITIONS.map(({ columnName, tableName }) => `${tableName}.${columnName}`);
const CLAW_FIRST_USE_ADDITIVE_STATE_COLUMNS = CLAW_FIRST_USE_ADDITIVE_STATE_COLUMN_DEFINITIONS.map(({ columnName, tableName }) => `${tableName}.${columnName}`);
const CLAW_FIRST_USE_ADDITIVE_STATE_COLUMN_SET = new Set(CLAW_FIRST_USE_ADDITIVE_STATE_COLUMNS);
const CLAW_STARTUP_ADDITIVE_STATE_COLUMN_SET = /* @__PURE__ */ new Set([...CLAW_STARTUP_ADDITIVE_STATE_COLUMN_DEFINITIONS.map(({ columnName, tableName }) => `${tableName}.${columnName}`), ...Object.values(ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS).flat().map(([tableName, definition]) => `${tableName}.${definition.split(" ", 1)[0]}`)]);
const CLAW_STARTUP_ADDITIVE_STATE_TABLES = ["worker_session_tool_operations", "worker_turn_tool_authorities"];
const CLAW_STARTUP_ADDITIVE_STATE_TABLE_SET = new Set(CLAW_STARTUP_ADDITIVE_STATE_TABLES);
const CLAW_READONLY_OPTIONAL_STATE_INDEXES = [
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
	const { includeVersionLazyAdditiveTables } = options;
	const cached = runtimeSchemaCache.get(includeVersionLazyAdditiveTables);
	if (cached !== void 0) return cached;
	let schema = OPENCLAW_STATE_SCHEMA_SQL;
	const omittedTables = includeVersionLazyAdditiveTables ? FIRST_USE_STATE_TABLES : LAZY_ADDITIVE_STATE_TABLES;
	const omittedIndexes = includeVersionLazyAdditiveTables ? FIRST_USE_STATE_INDEXES : LAZY_ADDITIVE_STATE_INDEXES;
	for (const tableName of omittedTables) {
		const start = schema.indexOf(`CREATE TABLE IF NOT EXISTS ${tableName} (`);
		const end = start >= 0 ? schema.indexOf("\n) STRICT;", start) : -1;
		if (start < 0 || end < 0) throw new Error(`lazy additive state schema block is missing for ${tableName}`);
		schema = `${schema.slice(0, start)}${schema.slice(end + 10)}`;
	}
	for (const indexName of omittedIndexes) {
		const plainStart = schema.indexOf(`CREATE INDEX IF NOT EXISTS ${indexName}`);
		const uniqueStart = schema.indexOf(`CREATE UNIQUE INDEX IF NOT EXISTS ${indexName}`);
		const start = plainStart >= 0 ? plainStart : uniqueStart;
		const end = start >= 0 ? schema.indexOf(";", start) : -1;
		if (start < 0 || end < 0) throw new Error(`lazy additive state schema index is missing for ${indexName}`);
		schema = `${schema.slice(0, start)}${schema.slice(end + 1)}`;
	}
	runtimeSchemaCache.set(includeVersionLazyAdditiveTables, schema);
	return schema;
}
const STATE_PERSISTENT_SCHEMA_COMPATIBILITY = {
	allowCompatibleAdditiveColumns: true,
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
const OPENCLAW_STATE_MAINTENANCE_SCHEMA_COMPATIBILITY = {
	...STATE_PERSISTENT_SCHEMA_COMPATIBILITY,
	allowedMissingTables: [...LAZY_ADDITIVE_STATE_TABLES, ...CLAW_STARTUP_ADDITIVE_STATE_TABLES],
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
//#region src/state/openclaw-state-schema-publication.ts
const TERMINAL_GRACE_MS = 3e5;
/** Only the 2026.9.2 release line reopens the ledger without the transaction fence. */
function isUnfencedUpdateDriver(version) {
	const parsed = typeof version === "string" ? parse$1(version) : null;
	return parsed !== null && `${parsed.major}.${parsed.minor}.${parsed.patch}` === "2026.9.2";
}
/** Every unfenced driver must clear its own deadline; a newer run cannot hide an older one. */
function readStateSchemaPublicationBlocker(db, nowMs = Date.now()) {
	if (!tableExists(db, "update_runs")) return;
	const rows = executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("update_runs").select([
		"run_id",
		"before_json",
		"status",
		"updated_at_ms",
		"finished_at_ms"
	]).where((eb) => eb.or([eb.and([eb("status", "=", "running"), eb("updated_at_ms", ">=", nowMs - ABANDONED_UPDATE_RUN_MS)]), eb.and([eb("status", "!=", "running"), eb.or([eb("finished_at_ms", ">", nowMs - TERMINAL_GRACE_MS), eb("finished_at_ms", "is", null)])])])).orderBy("run_id")).rows;
	let blocker;
	for (const row of rows) {
		const before = JSON.parse(row.before_json);
		if (!isRecord(before) || typeof before.version !== "string" || !isUnfencedUpdateDriver(before.version)) continue;
		const deadline = row.status === "running" ? row.updated_at_ms + ABANDONED_UPDATE_RUN_MS + 1 : row.finished_at_ms === null ? null : row.finished_at_ms + TERMINAL_GRACE_MS;
		if (!blocker || deadline === null || blocker.publishAfterMs !== null && deadline > blocker.publishAfterMs) blocker = {
			runId: row.run_id,
			updaterVersion: before.version,
			publishAfterMs: deadline
		};
	}
	return blocker;
}
/** Called inside the schema write transaction, after all content migrations succeed. */
function resolveStateSchemaVersionToPublish(db) {
	const published = readSqliteUserVersion(db);
	if (published >= 18 || !readStateSchemaPublicationBlocker(db)) return 18;
	if (!tableExists(db, "config_machine_state")) throw new Error("Shared state schema publication cannot be deferred without config_machine_state.");
	executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("config_machine_state").values({
		state_key: CONTENT_VERSION_KEY,
		value_json: String(18),
		updated_at_ms: Date.now()
	}).onConflict((conflict) => conflict.column("state_key").doUpdateSet({
		value_json: String(18),
		updated_at_ms: Date.now()
	}).where("config_machine_state.value_json", "!=", String(18))));
	return published;
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
function repairDanglingSkillWorkshopCollectionReviewIndexChanges(database) {
	return repairDanglingSkillWorkshopCollectionReviewIndex(database) ? ["Removed dangling legacy Skill Workshop review index"] : [];
}
/** Run read-only schema admission while SQLite ignores malformed catalog rows. */
function admitStateDatabaseWithDanglingWorkshopIndex(database, operation) {
	return withSqliteWritableSchema(database, operation);
}
/** Admit the schema before Doctor begins its write transaction. */
function admitStateDatabaseForSchemaRepair(database, pathname, env) {
	const danglingWorkshopIndex = hasDanglingSkillWorkshopCollectionReviewIndex(database);
	const admit = () => {
		assertSupportedStateSchemaVersion(database, pathname);
		if (danglingWorkshopIndex) assertOpenClawStateWriteAllowed({
			database,
			databasePath: pathname,
			env
		});
	};
	if (danglingWorkshopIndex) admitStateDatabaseWithDanglingWorkshopIndex(database, admit);
	else admit();
	return danglingWorkshopIndex;
}
/** Recheck write ownership after BEGIN IMMEDIATE and before catalog mutation. */
function assertStateDatabaseSchemaRepairWriteAllowed(database, pathname, env, danglingWorkshopIndex) {
	const assertAllowed = () => assertOpenClawStateWriteAllowed({
		database,
		databasePath: pathname,
		env
	});
	if (danglingWorkshopIndex) admitStateDatabaseWithDanglingWorkshopIndex(database, assertAllowed);
	else assertAllowed();
}
/** Admit Doctor repair, then return the ownership-rechecked catalog repair operation. */
function prepareStateDatabaseSchemaRepair(database, pathname, env) {
	const danglingWorkshopIndex = admitStateDatabaseForSchemaRepair(database, pathname, env);
	return () => {
		assertStateDatabaseSchemaRepairWriteAllowed(database, pathname, env, danglingWorkshopIndex);
		return repairDanglingSkillWorkshopCollectionReviewIndexChanges(database);
	};
}
const STATE_V6_ADDITIVE_TABLES = [
	"gateway_origin_device_tokens",
	...LAZY_ADDITIVE_STATE_TABLES,
	"worker_session_tool_operations",
	"worker_turn_tool_authorities"
];
const STATE_MIGRATION_ALLOWED_MISSING_TABLES = {
	5: [
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
	],
	6: STATE_V6_ADDITIVE_TABLES,
	7: STATE_V6_ADDITIVE_TABLES,
	8: STATE_V6_ADDITIVE_TABLES,
	9: STATE_V6_ADDITIVE_TABLES,
	10: STATE_V6_ADDITIVE_TABLES,
	11: STATE_V6_ADDITIVE_TABLES,
	12: STATE_V6_ADDITIVE_TABLES,
	13: LAZY_ADDITIVE_STATE_TABLES,
	14: LAZY_ADDITIVE_STATE_TABLES,
	15: LAZY_ADDITIVE_STATE_TABLES,
	16: LAZY_ADDITIVE_STATE_TABLES,
	17: LAZY_ADDITIVE_STATE_TABLES
};
/** Require canonical shared-state ownership without requiring the latest schema. */
function assertOpenClawStateDatabaseOwner(database, options) {
	const metadata = database.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'schema_meta' LIMIT 1").get() ? database.prepare("SELECT role FROM schema_meta WHERE meta_key = 'primary' LIMIT 1").get() : void 0;
	if (metadata?.role !== "global") {
		const role = typeof metadata?.role === "string" ? metadata.role : "missing";
		throw new Error(`OpenClaw state database ${options.pathname} has schema role ${role}; expected global.`);
	}
}
/** Require the canonical shared-state owner and schema before offline file maintenance. */
function assertOpenClawStateDatabaseForMaintenance(database, options, readTable) {
	const userVersion = assertSupportedStateSchemaVersion(database, options.pathname);
	if (readStateSchemaContentVersion(database) !== 18) throw new Error(`OpenClaw state database ${options.pathname} uses schema version ${userVersion}; run openclaw doctor --fix before compacting it.`);
	assertOpenClawStateDatabaseOwner(database, options);
	const metadata = database.prepare("SELECT schema_version FROM schema_meta WHERE meta_key = 'primary' LIMIT 1").get();
	if (metadata?.schema_version !== userVersion) {
		const schemaVersion = typeof metadata?.schema_version === "number" ? metadata.schema_version : "invalid";
		throw new Error(`OpenClaw state database ${options.pathname} metadata schema version ${schemaVersion} does not match ${userVersion}; run openclaw doctor --fix before compacting it.`);
	}
	assertSqliteSchemaContains(database, options.pathname, OPENCLAW_STATE_SCHEMA_SQL, OPENCLAW_STATE_MAINTENANCE_SCHEMA_COMPATIBILITY, readTable);
}
function assertOpenClawStateDatabaseVersionForMigration(database, options) {
	const userVersion = readSqliteUserVersion(database);
	if (readStateSchemaMigrationVersion(database) !== options.version) throw new Error(`OpenClaw state database ${options.pathname} uses schema version ${userVersion}; expected ${options.version} before migrating it.`);
	assertOpenClawStateDatabaseOwner(database, options);
	const metadata = database.prepare("SELECT schema_version FROM schema_meta WHERE meta_key = 'primary' LIMIT 1").get();
	if (metadata?.schema_version !== userVersion) {
		const schemaVersion = typeof metadata?.schema_version === "number" ? metadata.schema_version : "invalid";
		throw new Error(`OpenClaw state database ${options.pathname} metadata schema version ${schemaVersion} does not match ${userVersion}; repair the ownership metadata before migrating it.`);
	}
	assertSqliteSchemaTablesPresent(database, options.pathname, OPENCLAW_STATE_SCHEMA_SQL, { allowedMissingTables: STATE_MIGRATION_ALLOWED_MISSING_TABLES[options.version] });
}
/** Keep historical migration gates beside their version-specific ownership assertions. */
const openClawStateMigrationAssertions = new Map([
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
	17
].map((version) => [version, (database, options) => assertOpenClawStateDatabaseVersionForMigration(database, {
	...options,
	version
})]));
function markCurrentStateSchemaVersion(db, options = {}) {
	if (!tableExists(db, "audit_events")) return;
	const version = resolveStateSchemaVersionToPublish(db);
	db.exec(`PRAGMA user_version = ${version};`);
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
function resolveDatabasePath(options = {}) {
	return path.resolve(options.path ?? resolveOpenClawStateSqlitePath(options.env ?? process.env));
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
const RELEASED_WORKSHOP_CLAIM_REASON = "Skill Workshop released this skill in a collection review; the path stays user-owned.";
function migrateSkillWorkshopCollectionReviewOwnership(db) {
	const retainedObjects = db.prepare(`
    SELECT sql FROM sqlite_schema
    WHERE tbl_name = 'skill_workshop_collection_reviews'
      AND type IN ('index', 'trigger') AND sql IS NOT NULL
      AND name NOT IN ('idx_skill_workshop_collection_reviews_workspace_time',
                       'idx_skill_workshop_collection_reviews_owner_time')
    ORDER BY type, name
  `).all();
	db.exec(`
    CREATE TABLE skill_workshop_collection_reviews_v16 (
      review_id TEXT NOT NULL PRIMARY KEY,
      owner_agent_id TEXT NOT NULL,
      backup_id TEXT NOT NULL,
      create_time INTEGER NOT NULL,
      kept_names_json TEXT NOT NULL,
      written_names_json TEXT NOT NULL,
      dropped_json TEXT NOT NULL
    ) STRICT;
  `);
	if (tableExists(db, "skill_workshop_proposals")) db.exec(`
    INSERT INTO skill_workshop_collection_reviews_v16 (
      review_id, owner_agent_id, backup_id, create_time,
      kept_names_json, written_names_json, dropped_json
    )
    SELECT review.review_id,
           (
             SELECT MIN(proposal.owner_agent_id)
             FROM skill_workshop_proposals AS proposal
             WHERE proposal.workspace_dir = review.workspace_dir
               AND proposal.owner_agent_id IS NOT NULL
               AND (
                 SELECT COUNT(DISTINCT owner_agent_id)
                 FROM skill_workshop_proposals AS matching
                 WHERE matching.workspace_dir = review.workspace_dir
                   AND matching.owner_agent_id IS NOT NULL
               ) = 1
           ),
           review.backup_id,
           review.create_time,
           review.kept_names_json,
           review.written_names_json,
           review.dropped_json
    FROM skill_workshop_collection_reviews AS review
    WHERE (
      SELECT COUNT(DISTINCT proposal.owner_agent_id)
      FROM skill_workshop_proposals AS proposal
      WHERE proposal.workspace_dir = review.workspace_dir
        AND proposal.owner_agent_id IS NOT NULL
    ) = 1;
    `);
	db.exec(`
    DROP TABLE skill_workshop_collection_reviews;
    ALTER TABLE skill_workshop_collection_reviews_v16
      RENAME TO skill_workshop_collection_reviews;
    CREATE INDEX idx_skill_workshop_collection_reviews_owner_time
      ON skill_workshop_collection_reviews(owner_agent_id, create_time DESC, review_id);
  `);
	for (const object of retainedObjects) if (typeof object.sql === "string") db.exec(object.sql);
}
/** Remove row provenance after the Workshop directory becomes the ownership boundary. */
function migrateSkillWorkshopDirectoryOwnership(db, previousVersion) {
	if (previousVersion >= 16) return false;
	const proposalColumns = ["workspace_dir", "claim_released_time"].filter((column) => tableHasColumn(db, "skill_workshop_proposals", column));
	const reviewHasWorkspace = tableHasColumn(db, "skill_workshop_collection_reviews", "workspace_dir");
	if (proposalColumns.length === 0 && !reviewHasWorkspace) return false;
	if (proposalColumns.includes("claim_released_time")) {
		const released = db.prepare("SELECT proposal_id, record_json FROM skill_workshop_proposals WHERE claim_released_time IS NOT NULL").all();
		if (released.length > 0) {
			const staleAt = (/* @__PURE__ */ new Date()).toISOString();
			const update = db.prepare(`UPDATE skill_workshop_proposals
           SET record_json = ?, status = 'stale', updated_at = ?, stale_at = ?, status_reason = ?
         WHERE proposal_id = ?`);
			for (const row of released) {
				const staleRecord = {
					...JSON.parse(row.record_json),
					status: "stale",
					updatedAt: staleAt,
					staleAt,
					statusReason: RELEASED_WORKSHOP_CLAIM_REASON
				};
				update.run(JSON.stringify(staleRecord), staleAt, staleAt, RELEASED_WORKSHOP_CLAIM_REASON, row.proposal_id);
			}
		}
	}
	if (reviewHasWorkspace) migrateSkillWorkshopCollectionReviewOwnership(db);
	for (const column of proposalColumns) db.exec(`ALTER TABLE skill_workshop_proposals DROP COLUMN ${column};`);
	return true;
}
/** Version-gated column and row migrations, oldest first; each runs inside the caller's schema transaction. */
const versionedStateMigrations = [
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
		migrate: migrateSkillWorkshopDirectoryOwnership,
		applied: "Moved Skill Workshop ownership to per-agent directories (v16)"
	},
	{
		migrate: migratePreparedWorkerOwnership,
		applied: "Recorded prepared worker ownership and one-use lifecycle (v17)"
	},
	{
		migrate: migrateGitHubPublicationRequesterAuthority,
		applied: "Added original requester authority to GitHub publication receipts (v18)"
	}
];
function runStateSchemaMigrationTransaction(db, pathname, migrate, transactionOptions, prepareSchema) {
	const foreignKeysWereEnabled = Number(db.prepare("PRAGMA foreign_keys").get()?.foreign_keys) === 1;
	if (foreignKeysWereEnabled) db.exec("PRAGMA foreign_keys = OFF;");
	try {
		return runSqliteImmediateTransactionSync(db, () => {
			prepareSchema?.();
			const publishedVersion = readSqliteUserVersion(db);
			const blocker = publishedVersion < 18 ? readStateSchemaPublicationBlocker(db) : void 0;
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
					supportedVersion: 18
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
	database.exec(getOpenClawStateRuntimeSchema(options));
}
//#endregion
//#region src/state/openclaw-state-db-audit-migration.ts
const AUDIT_EVENT_STATE_SCHEMA_VERSION = 2;
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
const AUDIT_EVENT_V2_COLUMNS = [
	"sequence",
	"event_id",
	"source_id",
	"schema_version",
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
	"tool_name",
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
    INSERT INTO audit_events_migration_new (
      sequence,
      event_id,
      source_id,
      schema_version,
      source_sequence,
      occurred_at,
      kind,
      action,
      status,
      error_code,
      actor_type,
      actor_id,
      agent_id,
      session_key,
      session_id,
      run_id,
      tool_call_id,
      tool_name
    )
    SELECT
      sequence,
      event_id,
      source_id,
      1,
      source_sequence,
      occurred_at,
      kind,
      action,
      status,
      error_code,
      actor_type,
      actor_id,
      agent_id,
      session_key,
      session_id,
      run_id,
      tool_call_id,
      tool_name
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
function migrateSingletonStateFoldInV12(db, previousVersion) {
	if (previousVersion >= 12) return false;
	db.exec(`
    CREATE TABLE IF NOT EXISTS config_machine_state (
      state_key TEXT NOT NULL PRIMARY KEY,
      value_json TEXT NOT NULL,
      updated_at_ms INTEGER NOT NULL
    ) STRICT;
  `);
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
				...nodeHost.gateway_host == null ? {} : { host: nodeHost.gateway_host },
				...nodeHost.gateway_port == null ? {} : { port: nodeHost.gateway_port },
				...nodeHost.gateway_tls == null ? {} : { tls: nodeHost.gateway_tls === 1 },
				...nodeHost.gateway_tls_fingerprint == null ? {} : { tlsFingerprint: nodeHost.gateway_tls_fingerprint },
				...nodeHost.gateway_context_path == null ? {} : { contextPath: nodeHost.gateway_context_path },
				...nodeHost.gateway_cloudflare_access_json == null ? {} : { cloudflareAccess: JSON.parse(String(nodeHost.gateway_cloudflare_access_json)) }
			};
			importState.run("nodeHost.config", JSON.stringify({
				version: nodeHost.version,
				nodeId: nodeHost.node_id,
				...nodeHost.display_name == null ? {} : { displayName: nodeHost.display_name },
				...Object.keys(gateway).length === 0 ? {} : { gateway },
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
const SESSION_WATCH_PROVENANCE_COLUMN_SQL = `provenance TEXT NOT NULL DEFAULT '${SESSION_WATCH_PROVENANCE_EXPLICIT}' CHECK (provenance IN ('${SESSION_WATCH_PROVENANCE_EXPLICIT}', '${SESSION_WATCH_PROVENANCE_AMBIENT_GROUP}'))`;
function getSessionWatchCursorKysely(db) {
	return getNodeSqliteKysely(db);
}
function hasLegacyAmbientWatchSentinels(db) {
	if (!tableExists(db, "session_watch_cursors")) return false;
	return executeSqliteQueryTakeFirstSync(db, getSessionWatchCursorKysely(db).selectFrom("session_watch_cursors").select("watcher_session_key").where("watcher_session_key", "like", `${LEGACY_AMBIENT_GROUP_WATCH_MARKER_PREFIX}%`).limit(1)) !== void 0;
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
	]).where("watcher_session_key", "like", `${LEGACY_AMBIENT_GROUP_WATCH_MARKER_PREFIX}%`)).rows;
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
		if (archivedCount > 0) stateDbLog.info(`${archivedCount} previously archived workshop skills return to the active collection; the weekly collection review will judge them`);
	}
	for (const table of retiredTables) db.exec(`DROP TABLE IF EXISTS ${table};`);
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
	]) {
		const column = definition.split(" ", 1)[0];
		if (!tableHasColumn(db, "worker_session_placements", column)) db.exec(`ALTER TABLE worker_session_placements ADD COLUMN ${definition};`);
	}
	const start = OPENCLAW_STATE_SCHEMA_SQL.indexOf("CREATE TABLE IF NOT EXISTS worker_session_placements (");
	const end = start >= 0 ? OPENCLAW_STATE_SCHEMA_SQL.indexOf("\n) STRICT;", start) : -1;
	if (start < 0 || end < 0) throw new Error("Canonical worker placement schema block is missing");
	const placementSchema = OPENCLAW_STATE_SCHEMA_SQL.slice(start, end + 10);
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
            'idx_worker_session_placements_reconcile'
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
function hasCanonicalAgentDatabasesPrimaryKey(db) {
	if (!tableExists(db, "agent_databases")) return true;
	const primaryKey = tablePrimaryKeyColumns(db, "agent_databases");
	return primaryKey.length === 2 && primaryKey[0] === "agent_id" && primaryKey[1] === "path";
}
function canRepairAgentDatabasesPrimaryKey(db) {
	if (!tableExists(db, "agent_databases")) return false;
	return [
		"agent_id",
		"path",
		"schema_version",
		"last_seen_at",
		"size_bytes"
	].every((column) => tableHasColumn(db, "agent_databases", column));
}
function repairAgentDatabasesCompositePrimaryKey(db) {
	if (hasCanonicalAgentDatabasesPrimaryKey(db) || !canRepairAgentDatabasesPrimaryKey(db)) return false;
	db.exec(`
    DROP TABLE IF EXISTS agent_databases_migration_new;
    CREATE TABLE agent_databases_migration_new (
      agent_id TEXT NOT NULL,
      path TEXT NOT NULL,
      schema_version INTEGER NOT NULL,
      last_seen_at INTEGER NOT NULL,
      size_bytes INTEGER,
      PRIMARY KEY (agent_id, path)
    );
    INSERT OR REPLACE INTO agent_databases_migration_new (
      agent_id,
      path,
      schema_version,
      last_seen_at,
      size_bytes
    )
    SELECT
      agent_id,
      path,
      schema_version,
      last_seen_at,
      size_bytes
    FROM agent_databases
    WHERE agent_id IS NOT NULL AND path IS NOT NULL;
    DROP TABLE agent_databases;
    ALTER TABLE agent_databases_migration_new RENAME TO agent_databases;
  `);
	return true;
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
	if (!hasCanonicalAgentDatabasesPrimaryKey(db)) {
		if (canRepairAgentDatabasesPrimaryKey(db)) throw new OpenClawStateDatabaseSchemaMigrationRequiredError("agent-databases-composite-primary-key", pathname);
		throw new Error(`OpenClaw state database ${pathname} has a noncanonical agent database registry schema that cannot be repaired automatically; restore the canonical agent_databases shape before retrying.`);
	}
	if (!hasCanonicalAuditEventsSchema(db)) {
		if (canRepairLegacyAuditEventsSchema(db)) throw new OpenClawStateDatabaseSchemaMigrationRequiredError("audit-events-v2", pathname);
		throw new Error(`OpenClaw state database ${pathname} has a noncanonical audit event schema that cannot be repaired automatically; restore the canonical audit_events shape before retrying.`);
	}
}
/**
* Detect migrations against a caller-owned handle.
*
* Registry discovery runs this per lookup while already holding a state
* connection; opening a second one there made reads scale with row count.
*/
function detectOpenClawStateDatabaseSchemaMigrationsFromDatabase(db, pathname) {
	const migrations = [];
	const userVersion = readStateSchemaMigrationVersion(db);
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
	if (userVersion < 16 && (tableHasColumn(db, "skill_workshop_proposals", "workspace_dir") || tableHasColumn(db, "skill_workshop_proposals", "claim_released_time") || tableHasColumn(db, "skill_workshop_collection_reviews", "workspace_dir"))) migrations.push({
		kind: "skill-workshop-directory-ownership-v16",
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
	if (!hasCanonicalAgentDatabasesPrimaryKey(db)) migrations.push({
		kind: "agent-databases-composite-primary-key",
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
		assertSupportedStateSchemaVersion(database, pathname);
		const needsRepair = readStateSchemaMigrationVersion(database) !== 18 || hasLegacyCronRunLogs(database) || detectOpenClawStateDatabaseSchemaMigrationsFromDatabase(database, pathname).length > 0;
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
function assertCurrentStateRuntimeSchema(database, pathname, readTable) {
	assertCanonicalStateSchemaShape(database, pathname);
	assertOpenClawStateDatabaseForMaintenance(database, { pathname }, readTable);
}
/** Catalog presence is enough to refuse retired history without reading or rewriting its rows. */
function assertNoLegacyStateRuntimeRepair(database, pathname) {
	if (hasLegacyCronRunLogs(database)) throw new OpenClawStateDatabaseSchemaMigrationRequiredError("legacy-cron-run-logs", pathname);
}
function isOpenClawStateSchemaFastPathEligible(database, pathname) {
	return runSqliteDeferredTransactionSync(database, () => {
		assertSupportedStateSchemaVersion(database, pathname);
		if (readStateSchemaMigrationVersion(database) !== 18) return false;
		assertSqliteIntegrity(database, pathname);
		const readTable = createSqliteTableContractReader(database);
		assertCurrentStateRuntimeSchema(database, pathname, readTable);
		if (collectSqliteSchemaIssues(database, getOpenClawStateRuntimeSchema({ includeVersionLazyAdditiveTables: false }), STATE_PERSISTENT_SCHEMA_COMPATIBILITY, readTable).some(isOpenClawStateStartupRepairableSchemaIssue)) return false;
		assertNoLegacyStateRuntimeRepair(database, pathname);
		return true;
	});
}
//#endregion
//#region src/state/openclaw-state-db-existing-schema.ts
const validatedSchemas = /* @__PURE__ */ new WeakMap();
/** Prove the existing runtime contract without certifying this release's repairs. */
function assertExistingOpenClawStateRuntimeSchema(database, pathname) {
	const schemaCookie = runSqliteDeferredTransactionSync(database, () => {
		const version = assertSupportedStateSchemaVersion(database, pathname);
		if (readStateSchemaMigrationVersion(database) !== 18) throw new Error(`Existing shared-state database ${pathname} requires schema migration by its owning installation before this node can use it.`);
		const metadata = executeSqliteQueryTakeFirstSync(database, getNodeSqliteKysely(database).selectFrom("schema_meta").select(["role", "schema_version"]).where("meta_key", "=", "primary").limit(1));
		if (metadata?.role !== "global" || metadata.schema_version !== version) throw new Error(`Existing shared-state database ${pathname} has inconsistent ownership or schema metadata.`);
		const currentCookie = readSqliteSchemaCookie(database);
		if (typeof currentCookie !== "number") throw new Error(`Existing shared-state database ${pathname} schema version is unavailable.`);
		const cached = validatedSchemas.get(database);
		if (cached?.cookie !== currentCookie) {
			cached?.unregister();
			validatedSchemas.delete(database);
			assertSqliteIntegrity(database, pathname);
			assertCurrentStateRuntimeSchema(database, pathname);
			assertNoLegacyStateRuntimeRepair(database, pathname);
			assertSqliteSchemaContains(database, pathname, getOpenClawStateRuntimeSchema({ includeVersionLazyAdditiveTables: false }), STATE_PERSISTENT_SCHEMA_COMPATIBILITY);
		}
		return currentCookie;
	});
	if (!database.isTransaction && validatedSchemas.get(database)?.cookie !== schemaCookie) {
		const unregister = registerNodeSqliteDisposeCallback(database, () => {
			validatedSchemas.delete(database);
			unregister();
		});
		validatedSchemas.set(database, {
			cookie: schemaCookie,
			unregister
		});
	}
}
//#endregion
//#region src/state/openclaw-state-db-read-connection.ts
const retainedReaders = /* @__PURE__ */ new Map();
let unregisterExitClose;
function retireReader(reader) {
	clearTimeout(reader.idleTimer);
	reader.retiring = true;
	reader.connection.close();
	retainedReaders.delete(reader.identity.key);
	if (!retainedReaders.size) {
		unregisterExitClose?.();
		unregisterExitClose = void 0;
	}
}
function scheduleReaderRetirement(reader) {
	if (retainedReaders.get(reader.identity.key) !== reader) return;
	clearTimeout(reader.idleTimer);
	reader.idleTimer = runInSqliteMaintenanceContext(() => setTimeout(() => {
		try {
			retireReader(reader);
		} catch (error) {
			process.emitWarning(`Idle shared-state reader cleanup failed: ${String(error)}`);
			scheduleReaderRetirement(reader);
		}
	}, SQLITE_IDLE_HANDLE_TTL_MS));
	reader.idleTimer.unref?.();
}
/** The host joins this receipt before allowing replacement or deletion of live state. */
function closeRetainedOpenClawStateReadConnections(identity) {
	const errors = [];
	for (const reader of retainedReaders.values()) if (identity === void 0 || reader.identity.key === identity) try {
		retireReader(reader);
	} catch (error) {
		errors.push(error);
	}
	throwSqliteLifecycleErrors(errors, "Retained shared-state reader cleanup failed.");
}
function borrowStateReadConnection(pathname, expectedIdentity) {
	isExistingOpenClawStateSchema(pathname);
	const identity = readDatabasePathIdentitySync(pathname);
	if (expectedIdentity !== void 0) assertExistingDatabaseIdentity(pathname, expectedIdentity);
	for (const previous of retainedReaders.values()) if (previous.identity.canonicalPath === identity.canonicalPath && previous.identity.key !== identity.key) retireReader(previous);
	if (!identity.key.startsWith("file:")) return openStateReadConnectionResult(pathname, pathname, expectedIdentity);
	let reader = retainedReaders.get(identity.key);
	if (reader?.retiring || reader && !reader.connection.database.db.isOpen) {
		retireReader(reader);
		reader = void 0;
	}
	if (!reader) {
		const opening = openStateReadConnectionResult(pathname, pathname, identity.key);
		if (opening.status === "unavailable") return opening;
		reader = {
			connection: opening.value,
			identity,
			retiring: false
		};
		retainedReaders.set(identity.key, reader);
		unregisterExitClose ??= registerSqliteCacheExitClose(closeRetainedOpenClawStateReadConnections);
	}
	const retained = reader;
	clearTimeout(retained.idleTimer);
	return {
		status: "available",
		value: {
			database: {
				db: retained.connection.database.db,
				path: pathname
			},
			close(keep) {
				if (keep && retained.connection.database.db.isOpen && !retained.connection.database.db.isTransaction) scheduleReaderRetirement(retained);
				else retireReader(retained);
				return true;
			}
		}
	};
}
var SnapshotCleanupIncompleteError = class extends Error {};
function assertStateReadSchema(database, pathname) {
	assertStateReadSchemaForPolicy(database, pathname, isExistingOpenClawStateSchema(pathname, database));
}
function assertStateReadSchemaForPolicy(database, pathname, existingSchema) {
	if (existingSchema) assertExistingOpenClawStateRuntimeSchema(database, pathname);
	else assertSupportedStateSchemaVersion(database, pathname);
}
function withOpenClawStateReadOnlyLocation(operation, pathname, source, openStateSchemaReadAdmission, expectedIdentity, snapshotRoot, retainConnection = false) {
	const result = readOpenClawStateReadOnlyLocation(operation, pathname, source, openStateSchemaReadAdmission, expectedIdentity, snapshotRoot, retainConnection);
	if (result.status === "unavailable") throw result.error;
	return result.value;
}
/** Return a failed read only after its native reader and admission have settled. */
function readOpenClawStateReadOnlyLocation(operation, pathname, source, openStateSchemaReadAdmission, expectedIdentity, snapshotRoot, retainConnection = false) {
	const opening = retainConnection && source === pathname && !snapshotRoot && !process.versions.bun ? borrowStateReadConnection(pathname, expectedIdentity) : openStateReadConnectionResult(pathname, source, expectedIdentity, snapshotRoot, true);
	if (opening.status === "unavailable") return opening;
	const opened = opening.value;
	const errors = [];
	let closeAdmission;
	let result;
	try {
		closeAdmission = openStateSchemaReadAdmission?.(opened.database.db);
		const existingSchema = isExistingOpenClawStateSchema(pathname, opened.database.db);
		try {
			assertStateReadSchemaForPolicy(opened.database.db, pathname, existingSchema);
			result = {
				status: "available",
				value: operation(opened.database)
			};
		} catch (error) {
			result = {
				status: "unavailable",
				error
			};
		}
		const location = typeof source === "string" ? source : source.location;
		if (result.status === "available" && location === pathname && isPromiseLike(result.value)) throw new SqliteCoordinatorError("SQLite source read must remain synchronous");
		assertTransactionUsable(opened.database.db);
	} catch (error) {
		errors.push(error);
	}
	try {
		closeAdmission?.();
	} catch (error) {
		errors.push(error);
	}
	try {
		if (!opened.close(errors.length === 0 && result?.status === "available")) throw new SnapshotCleanupIncompleteError("Shared-state snapshot cleanup is incomplete.");
	} catch (error) {
		errors.push(error);
	}
	if (errors.length) {
		if (result?.status === "unavailable" && !errors.includes(result.error)) errors.unshift(result.error);
		throwSqliteLifecycleErrors(errors, "Shared-state read and reader cleanup failed.");
	}
	return result;
}
/** Keep streamed rows on one private reader while callers yield or close the shared writer. */
async function* iterateOpenClawStateDatabaseReadOnly(source, operation, env = process.env) {
	const pathname = source.db.location();
	if (!pathname) throw new Error("Streaming shared-state reads require a filesystem-backed database.");
	openClawStateDatabaseCache.assertOpenClawStateDatabaseFreshOpenAllowedAtPath(pathname, env);
	const opened = openOpenClawStateReadOnlyLocation(pathname, pathname);
	try {
		opened.database.db.exec("BEGIN");
		return yield* operation(opened.database);
	} catch (error) {
		openClawStateDatabaseCache.evictOpenClawStateDatabaseAfterCorruption(source, error);
		throw error;
	} finally {
		try {
			if (opened.database.db.isTransaction) opened.database.db.exec("ROLLBACK");
		} finally {
			opened.close();
		}
	}
}
function openOpenClawStateReadOnlyLocation(pathname, source) {
	const connection = openOpenClawStateReadConnection(pathname, source);
	try {
		assertStateReadSchema(connection.database.db, pathname);
	} catch (error) {
		try {
			connection.close();
		} catch (cleanupError) {
			throwSqliteLifecycleErrors([error, cleanupError], "Shared-state reader admission and cleanup failed.");
		}
		throw error;
	}
	return connection;
}
/** Own one native reader; callers retain their runtime or maintenance schema policy. */
function openOpenClawStateReadConnection(pathname, source, expectedIdentity, snapshotRoot) {
	const result = openStateReadConnectionResult(pathname, source, expectedIdentity, snapshotRoot);
	if (result.status === "unavailable") throw result.error;
	return result.value;
}
function openStateReadConnectionResult(pathname, source, expectedIdentity, snapshotRoot, checkSchemaPolicy = false) {
	const snapshot = typeof source === "string" ? void 0 : source;
	const location = typeof source === "string" ? source : source.location;
	const options = {
		readOnly: true,
		timeout: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS
	};
	let releaseToken;
	const cleanupFailedOpen = (error) => {
		const errors = [error];
		try {
			releaseToken?.();
		} catch (cleanupError) {
			errors.push(cleanupError);
		}
		try {
			if (snapshot && !snapshot.cleanup()) errors.push(new SnapshotCleanupIncompleteError("Shared-state snapshot cleanup is incomplete."));
		} catch (cleanupError) {
			errors.push(cleanupError);
		}
		if (errors.length > 1) throw createSqliteLifecycleAggregateError(errors, "Shared-state reader open and cleanup failed.", error);
	};
	let native;
	try {
		if (expectedIdentity !== void 0) assertExistingDatabaseIdentity(location, expectedIdentity);
		releaseToken = snapshotRoot ? acquireSqliteSnapshotReadToken(snapshotRoot) : void 0;
		if (checkSchemaPolicy) isExistingOpenClawStateSchema(pathname);
		if (location === pathname) native = openTrackedStateDatabaseResult(pathname, options);
		else try {
			native = {
				status: "available",
				database: openNodeSqliteDatabase(location, options)
			};
		} catch (error) {
			native = {
				status: "unavailable",
				error
			};
		}
	} catch (error) {
		cleanupFailedOpen(error);
		throw error;
	}
	if (native.status === "unavailable") {
		cleanupFailedOpen(native.error);
		return native;
	}
	const db = native.database;
	let closed = false;
	const database = {
		db,
		path: pathname,
		afterClose: () => {
			releaseToken?.();
			if (snapshot && !snapshot.cleanup()) throw new SnapshotCleanupIncompleteError("Shared-state snapshot cleanup is incomplete.");
		}
	};
	const connection = {
		database: {
			db,
			path: pathname
		},
		close() {
			if (closed) return false;
			const errors = openClawStateDatabaseCache.closeOpenClawStateDatabaseHandle(database);
			if (errors.length === 1 && errors[0] instanceof SnapshotCleanupIncompleteError) return false;
			if (errors.length === 1) throw errors[0];
			if (errors.length > 1) throw createSqliteLifecycleAggregateError(errors, "Shared-state reader cleanup failed.", errors[0]);
			closed = true;
			return true;
		}
	};
	try {
		if (expectedIdentity !== void 0) assertExistingDatabaseIdentity(location, expectedIdentity);
	} catch (error) {
		try {
			if (!connection.close()) throw new SnapshotCleanupIncompleteError("Shared-state snapshot cleanup is incomplete.");
		} catch (cleanupError) {
			throw createSqliteLifecycleAggregateError([error, cleanupError], "Shared-state reader identity and cleanup failed.", error);
		}
		throw error;
	}
	return {
		status: "available",
		value: connection
	};
}
//#endregion
export { repairLegacyTaskDeliveryStatuses as $, openClawStateMigrationAssertions as A, cronRunStatusToTaskStatus as At, getOpenClawStateRuntimeSchema as B, normalizeCronRunDiagnosticSummary as Bt, SESSION_WATCH_PROVENANCE_EXPLICIT as C, estimateAcpSessionRowBytes as Ct, assertOpenClawStateDatabaseOwner as D, migrateLegacyCronRunLogsToTaskRuns as Dt, assertOpenClawStateDatabaseForMaintenance as E, ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS as Et, writeCurrentStateSchemaMetadata as F, isCronDeliveryStatus as Ft, backfillCronRunLogEntryJson as G, CRON_JOB_EXECUTION_TIMEOUT_ERROR as Gt, isOpenClawStateStartupRepairableSchemaIssue as H, normalizeDiagnosticToolName as Ht, isUnfencedUpdateDriver as I, isCronRunStatus as It, repairLegacySubagentExecutionPayloads as J, isCronTimeoutErrorText as Jt, backfillDeliveryQueueEntriesFromEntryJson as K, CRON_PRE_EXECUTION_TIMEOUT_ERROR as Kt, readStateSchemaPublicationBlocker as L, parseCronRunLogEntryObject as Lt, resolveDatabasePath as M, cronTaskRecordToRunLogEntry as Mt, runStateSchemaMigrationTransaction as N, cronTaskRecordToScriptRunResult as Nt, executeCanonicalStateSchema as O, cronQuietTriggerTaskDetail as Ot, versionedStateMigrations as P, cronTaskRecordToTriggerEval as Pt, repairLegacyTaskAgentAttribution as Q, OPENCLAW_STATE_MAINTENANCE_SCHEMA_COMPATIBILITY as R, resolveCronTaskRecordTimestamp as Rt, SESSION_WATCH_PROVENANCE_AMBIENT_GROUP as S, estimateAcpEventRowBytes as St, repairAuditEventsSchema as T, CLAW_STARTUP_ADDITIVE_STATE_COLUMN_DEFINITIONS as Tt, backfillAcpReplayEstimatedBytes as U, normalizeExitCode as Ut, isOpenClawStateFirstUseSchemaIssue as V, normalizeCronRunDiagnosticsCore as Vt, backfillCronJobsFromJobJson as W, tailText as Wt, repairLegacySubagentSuspensionReasons as X, resolveCronCompletionStatus as Xt, repairLegacySubagentRetainedResults as Y, resolveAdmittedCronCompletionStatus as Yt, repairLegacySubagentTaskBindings as Z, repairLegacyGatewayRestartHandoffsForStrictMigration as _, normalizeAgentRunTerminalReplySnapshot as _t, withOpenClawStateReadOnlyLocation as a, projectDeliveryQueueTerminalEntry as at, migrateSessionWatchCursorProvenance as b, normalizeAgentRunRouteChange as bt, assertNoLegacyStateRuntimeRepair as c, deliveryQueueMetadata as ct, assertCanonicalStateSchemaShape as d, pruneDeliveryQueueTombstoneAges as dt, repairOperatorApprovalSchema as et, detectOpenClawStateDatabaseSchemaMigrationsFromDatabase as f, pruneDeliveryQueueTombstones as ft, repairAgentDatabasesCompositePrimaryKey as g, mergeAgentRunTerminalReplySnapshot as gt, migrateWorkerPlacementExecutionModeSchema as h, buildAgentRunTerminalReplySnapshot as ht, openOpenClawStateReadOnlyLocation as i, parseDeliveryQueueCompletionRetention as it, prepareStateDatabaseSchemaRepair as j, cronTaskRecordStoreKey as jt, markCurrentStateSchemaVersion as k, cronRunLogEntryToTaskDetail as kt, isOpenClawStateSchemaFastPathEligible as l, inflateDeliveryQueueRow as lt, migrateAgentDatabaseRelativePaths as m, upsertBoundDeliveryQueueEntryInDatabase as mt, iterateOpenClawStateDatabaseReadOnly as n, hasLiveDeliveryQueueClaim as nt, assertExistingOpenClawStateRuntimeSchema as o, bindDeliveryQueueEntry as ot, dropLegacyStateTables as p, terminalizeBoundDeliveryQueueEntry as pt, ensureOperatorApprovalResolutionRefs as q, CRON_SETUP_TIMEOUT_ERROR as qt, openOpenClawStateReadConnection as r, inferDeliveryQueueFailureRetention as rt, assertCurrentStateRuntimeSchema as s, deliveryQueueEntriesQuery as st, assertStateReadSchema as t, OPENCLAW_STATE_SCHEMA_SQL as tt, needsOpenClawStateDatabaseSchemaRepair as u, loadDeliveryQueueEntryInDatabase as ut, logRetiredStateTableMigration as v, sanitizeAgentRunTerminalReplyText as vt, migrateSingletonStateFoldInV12 as w, CLAW_FIRST_USE_ADDITIVE_STATE_COLUMN_DEFINITIONS as wt, needsSessionWatchCursorProvenanceMigration as x, normalizeAgentRunTerminalReceipt as xt, runRetiredStateTableMigrations as y, formatAgentRunRouteChange as yt, STATE_PERSISTENT_SCHEMA_COMPATIBILITY as z, formatUnknownError as zt };
