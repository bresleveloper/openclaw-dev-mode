import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { f as asSafeIntegerInRange, s as asFiniteNumber, t as MAX_DATE_TIMESTAMP_MS } from "./number-coercion-CuVhdCBs.mjs";
import "./src-CdRlGRnW.mjs";
import { c as isRecord, r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as safeParseJsonRecord, t as safeParseJson } from "./json-coercion-pfKbZnCJ.mjs";
import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as UpdateSchemaRefusalError } from "./openclaw-update-schema-refusal-M64rViod.mjs";
import { a as getNodeSqliteKysely, c as prepareSqliteQuerySync, i as executeSqliteQueryTakeFirstSync, n as createSqliteQueryCache, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { r as invalidateSqliteSchemaFacts } from "./sqlite-schema-facts-CG0Tk84j.mjs";
import { s as quoteSqliteIdentifier, t as extractSqliteTableSchema, u as splitSqlList } from "./sqlite-schema-sql-CKIqAlrf.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-XIcwmOrl.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { n as OpenClawStateOwnershipError } from "./sqlite-lifecycle-errors-DuOygjcn.mjs";
import { t as SqliteSchemaMismatchError } from "./sqlite-schema-issues-Cd5MmsG2.mjs";
import { a as tableHasColumn, i as tableExists, n as ensureColumn, o as tablePrimaryKeyColumns, t as classifySqliteTableReadError } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { a as LAZY_ADDITIVE_STATE_TABLES, i as LAZY_ADDITIVE_STATE_INDEXES, n as FIRST_USE_STATE_INDEXES, r as FIRST_USE_STATE_TABLES, t as DOCTOR_OWNED_STATE_TABLES } from "./openclaw-state-db-contract-Cm9fKF2T.mjs";
import { t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-CQ_AyDCk.mjs";
import { a as runSqliteImmediateTransactionSync, r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { t as VERSION } from "./version-BJGPJZu6.mjs";
import { a as readSqliteUserVersion } from "./sqlite-user-version-ZJ4dPMsi.mjs";
import { n as normalizeSqliteNumber, t as coerceRequiredSqliteNumber } from "./sqlite-number-DZt1m75H.mjs";
import { i as resolveOpenClawAgentDatabaseStoredPath, o as resolveOpenClawStateDirForDatabasePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { Et as _enum, Fn as object, Jn as string, Kt as custom, Lt as boolean, Pn as number, Sn as looseObject, sr as unknown, xn as literal } from "./schemas-BOYIvvln.mjs";
import { n as OpenClawStateDatabaseSchemaMigrationRequiredError, t as LEGACY_SKILL_WORKSHOP_COLLECTION_REVIEWS_INDEX } from "./openclaw-state-db-schema-migration-required-BpllCelk.mjs";
import { r as withSqliteWritableSchema, t as hasDanglingSkillWorkshopCollectionReviewIndex } from "./openclaw-state-db-doctor-schema-BlUz8kWR.mjs";
import { t as ABANDONED_UPDATE_RUN_MS } from "./update-run-timeouts-Byb-PlTk.mjs";
import { a as collectSqliteSchemaIssues, i as collectSqliteNamedIndexContract, n as assertSqliteSchemaTablesPresent, o as createSqliteTableContractReader, s as getCanonicalSqliteNamedIndexContracts, t as assertSqliteSchemaContains } from "./sqlite-schema-contract-BTxZz0OV.mjs";
import { i as readStateSchemaMigrationVersion, n as assertSupportedStateSchemaVersion, r as readStateSchemaContentVersion, t as CONTENT_VERSION_KEY } from "./openclaw-state-db-schema-version-CGQ4F6pb.mjs";
import { n as assertSqliteIntegrity } from "./sqlite-integrity-GtqcmwG3.mjs";
import { t as FAILOVER_REASONS } from "./failover-reasons-Mjd0tFtT.mjs";
import { A as ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS, D as CLAW_FIRST_USE_ADDITIVE_STATE_COLUMN_DEFINITIONS, O as CLAW_LAZY_ADDITIVE_STATE_COLUMN_DEFINITIONS, f as OPENCLAW_STATE_SCHEMA_SQL, k as CLAW_STARTUP_ADDITIVE_STATE_COLUMN_DEFINITIONS, l as assertCanonicalOperatorApprovalKinds, s as repairLegacySubagentRetainedResults, u as detectOperatorApprovalSchemaMigration } from "./openclaw-state-db-legacy-backfills-BxTnDU05.mjs";
import { n as assertOpenClawStateWriteAllowed } from "./openclaw-state-ownership-BDcUGGMF.mjs";
import { existsSync } from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { parse as parse$1 } from "semver";
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
	if (published >= 20 || !readStateSchemaPublicationBlocker(db)) return 20;
	if (!tableExists(db, "config_machine_state")) throw new Error("Shared state schema publication cannot be deferred without config_machine_state.");
	executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("config_machine_state").values({
		state_key: CONTENT_VERSION_KEY,
		value_json: String(20),
		updated_at_ms: Date.now()
	}).onConflict((conflict) => conflict.column("state_key").doUpdateSet({
		value_json: String(20),
		updated_at_ms: Date.now()
	}).where("config_machine_state.value_json", "!=", String(20))));
	invalidateSqliteSchemaFacts(db);
	return published;
}
//#endregion
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
		runId: typeof record.detail.runId === "string" ? record.detail.runId : void 0
	}, { jobId: record.jobId });
}
//#endregion
//#region src/infra/state-migrations.cron-run-logs.ts
const CRON_RUN_LOG_TASK_IMPORT_MIGRATION_ID = "state:cron-run-logs-to-task-runs:v1";
const CRON_RUN_LOG_IMPORT_BATCH_SIZE = 500;
function hasLegacyCronRunLogs(db) {
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
//#region src/infra/sqlite-audit-record.kernel.ts
const LEGACY_AUDIT_SEQUENCE_BASE = Number.MIN_SAFE_INTEGER;
function getAuditRecordKysely(database) {
	return getNodeSqliteKysely(database);
}
function parseAuditRecord(row) {
	return {
		key: row.event_key,
		value: JSON.parse(row.payload_json),
		createdAt: row.created_at,
		sequence: row.sequence
	};
}
function countAuditRecords(database, scope) {
	const row = executeSqliteQueryTakeFirstSync(database, getAuditRecordKysely(database).selectFrom("diagnostic_events").select((eb) => eb.fn.countAll().as("count")).where("scope", "=", scope));
	return typeof row?.count === "bigint" ? coerceRequiredSqliteNumber(row.count) : row?.count ?? 0;
}
function nextAuditSequence(params) {
	const next = (executeSqliteQueryTakeFirstSync(params.database, getAuditRecordKysely(params.database).selectFrom("diagnostic_events").select((eb) => eb.fn.max("sequence").as("sequence")).where("scope", "=", params.scope).where("sequence", params.legacy ? "<" : ">=", 0))?.sequence ?? (params.legacy ? LEGACY_AUDIT_SEQUENCE_BASE : 0)) + 1;
	if (!Number.isSafeInteger(next) || params.legacy && next >= 0) throw new Error(`Audit sequence exhausted for scope ${params.scope}`);
	return next;
}
function pruneAuditRecords(params) {
	const overflow = countAuditRecords(params.database, params.scope) - params.maxEntries;
	if (overflow <= 0) return;
	const protectedKey = params.protectedKey;
	const baseCandidates = getAuditRecordKysely(params.database).selectFrom("diagnostic_events").select("event_key").where("scope", "=", params.scope);
	const candidates = (protectedKey === void 0 ? baseCandidates : baseCandidates.where("event_key", "!=", protectedKey)).orderBy("sequence", "asc").limit(overflow);
	executeSqliteQuerySync(params.database, getAuditRecordKysely(params.database).deleteFrom("diagnostic_events").where("scope", "=", params.scope).where("event_key", "in", candidates));
}
function prepareSqliteAuditRecord(scope, record) {
	const payloadJson = JSON.stringify(record.value);
	if (payloadJson === void 0) throw new Error(`Audit record ${scope}/${record.key} is not JSON-serializable`);
	return {
		event_key: record.key,
		payload_json: payloadJson,
		created_at: record.createdAt
	};
}
function createAuditRecordInsert(database) {
	return prepareSqliteQuerySync(database, (parameter) => getAuditRecordKysely(database).insertInto("diagnostic_events").values({
		scope: parameter((record) => record.scope),
		event_key: parameter((record) => record.event_key),
		payload_json: parameter((record) => record.payload_json),
		created_at: parameter((record) => record.created_at),
		sequence: parameter((record) => record.sequence)
	}).onConflict((conflict) => conflict.columns(["scope", "event_key"]).doNothing()));
}
const auditRecordInsert = createSqliteQueryCache(createAuditRecordInsert);
/** Connection-bound operations; mutation callers retain the complete transaction. */
function createSqliteAuditRecordKernel(database, options) {
	const scope = options.scope;
	const maxEntries = options.maxEntries;
	function insertRecord(record) {
		auditRecordInsert(database)({
			...record,
			scope
		});
	}
	function upsertPreparedRecord(record) {
		executeSqliteQuerySync(database, getAuditRecordKysely(database).insertInto("diagnostic_events").values({
			scope,
			event_key: record.event_key,
			payload_json: record.payload_json,
			created_at: record.created_at,
			sequence: nextAuditSequence({
				database,
				scope,
				legacy: false
			})
		}).onConflict((conflict) => conflict.columns(["scope", "event_key"]).doUpdateSet({
			payload_json: record.payload_json,
			created_at: record.created_at
		})));
		pruneAuditRecords({
			database,
			scope,
			maxEntries,
			protectedKey: record.event_key
		});
	}
	function deleteRecord(key) {
		executeSqliteQuerySync(database, getAuditRecordKysely(database).deleteFrom("diagnostic_events").where("scope", "=", scope).where("event_key", "=", key));
	}
	return {
		register(record) {
			insertRecord({
				...record,
				sequence: nextAuditSequence({
					database,
					scope,
					legacy: false
				})
			});
			pruneAuditRecords({
				database,
				scope,
				maxEntries,
				protectedKey: record.event_key
			});
		},
		upsert: upsertPreparedRecord,
		delete: deleteRecord,
		compareAndSet(key, expectedPayloadJson, record) {
			if ((executeSqliteQueryTakeFirstSync(database, getAuditRecordKysely(database).selectFrom("diagnostic_events").select("payload_json").where("scope", "=", scope).where("event_key", "=", key))?.payload_json ?? null) !== expectedPayloadJson) return false;
			if (record) upsertPreparedRecord(record);
			else deleteRecord(key);
			return true;
		},
		registerLegacyMany(records) {
			let sequence = nextAuditSequence({
				database,
				scope,
				legacy: true
			});
			for (const record of records) {
				insertRecord({
					...record,
					sequence
				});
				sequence += 1;
			}
			pruneAuditRecords({
				database,
				scope,
				maxEntries
			});
		},
		entries() {
			return executeSqliteQuerySync(database, getAuditRecordKysely(database).selectFrom("diagnostic_events").select([
				"event_key",
				"payload_json",
				"created_at",
				"sequence"
			]).where("scope", "=", scope).orderBy("sequence", "asc")).rows.map((row) => {
				const { sequence: _sequence, ...entry } = parseAuditRecord(row);
				return entry;
			});
		},
		latest(params) {
			const baseQuery = getAuditRecordKysely(database).selectFrom("diagnostic_events").select([
				"event_key",
				"payload_json",
				"created_at",
				"sequence"
			]).where("scope", "=", scope);
			const query = params.beforeSequence === void 0 ? baseQuery : baseQuery.where("sequence", "<", params.beforeSequence);
			return executeSqliteQuerySync(database, query.orderBy("sequence", "desc").limit(params.limit)).rows.map((row) => parseAuditRecord(row));
		}
	};
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
		env
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
	17: LAZY_ADDITIVE_STATE_TABLES,
	18: LAZY_ADDITIVE_STATE_TABLES,
	19: LAZY_ADDITIVE_STATE_TABLES
};
/** Require canonical shared-state ownership without requiring the latest schema. */
function assertOpenClawStateDatabaseOwner(database, options) {
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
	const userVersion = assertSupportedStateSchemaVersion(database, options.pathname);
	if (readStateSchemaContentVersion(database) !== 20) throw new SqliteSchemaMismatchError(`OpenClaw state database ${options.pathname} uses schema version ${userVersion}; run openclaw doctor --fix before compacting it.`);
	const metadata = assertOpenClawStateDatabaseOwner(database, options);
	if (metadata?.schema_version !== userVersion) {
		const schemaVersion = typeof metadata?.schema_version === "number" ? metadata.schema_version : "invalid";
		throw new SqliteSchemaMismatchError(`OpenClaw state database ${options.pathname} metadata schema version ${schemaVersion} does not match ${userVersion}; run openclaw doctor --fix before compacting it.`);
	}
	assertSqliteSchemaContains(database, options.pathname, OPENCLAW_STATE_SCHEMA_SQL, OPENCLAW_STATE_MAINTENANCE_SCHEMA_COMPATIBILITY, readTable);
}
function assertOpenClawStateDatabaseVersionForMigration(database, options) {
	const userVersion = readSqliteUserVersion(database);
	if (readStateSchemaMigrationVersion(database) !== options.version) throw new SqliteSchemaMismatchError(`OpenClaw state database ${options.pathname} uses schema version ${userVersion}; expected ${options.version} before migrating it.`);
	const metadata = assertOpenClawStateDatabaseOwner(database, options);
	if (metadata?.schema_version !== userVersion) {
		const schemaVersion = typeof metadata?.schema_version === "number" ? metadata.schema_version : "invalid";
		throw new SqliteSchemaMismatchError(`OpenClaw state database ${options.pathname} metadata schema version ${schemaVersion} does not match ${userVersion}; repair the ownership metadata before migrating it.`);
	}
	assertSqliteSchemaTablesPresent(database, options.pathname, OPENCLAW_STATE_SCHEMA_SQL, { allowedMissingTables: [...STATE_MIGRATION_ALLOWED_MISSING_TABLES[options.version], ...DOCTOR_OWNED_STATE_TABLES] });
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
	17,
	18,
	19
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
	},
	{
		migrate: migrateCronDeliveryAttemptState,
		applied: "Recorded cron completion delivery attempt uncertainty (v20)"
	}
];
function runStateSchemaMigrationTransaction(db, pathname, migrate, transactionOptions, prepareSchema) {
	const foreignKeysWereEnabled = Number(db.prepare("PRAGMA foreign_keys").get()?.foreign_keys) === 1;
	if (foreignKeysWereEnabled) db.exec("PRAGMA foreign_keys = OFF;");
	try {
		return runSqliteImmediateTransactionSync(db, () => {
			prepareSchema?.();
			const publishedVersion = readSqliteUserVersion(db);
			const blocker = publishedVersion < 20 ? readStateSchemaPublicationBlocker(db) : void 0;
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
					supportedVersion: 20
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
	database.exec(getOpenClawStateRuntimeSchema({
		...options,
		includeAgentDeletionJournal: options.includeAgentDeletionJournal ?? tableExists(database, "agent_deletion_journal")
	}));
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
const SESSION_WATCH_PROVENANCE_COLUMN_SQL = `provenance TEXT NOT NULL DEFAULT '${SESSION_WATCH_PROVENANCE_EXPLICIT}' CHECK (provenance IN ('${SESSION_WATCH_PROVENANCE_EXPLICIT}', '${SESSION_WATCH_PROVENANCE_AMBIENT_GROUP}'))`;
function getSessionWatchCursorKysely(db) {
	return getNodeSqliteKysely(db);
}
function hasLegacyAmbientWatchSentinels(db) {
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
		const needsRepair = readStateSchemaMigrationVersion(database) !== 20 || hasLegacyCronRunLogs(database) || detectOpenClawStateDatabaseSchemaMigrationsFromDatabase(database, pathname).length > 0;
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
	assertSqliteSchemaContains(database, pathname, getOpenClawStateRuntimeSchema({ includeVersionLazyAdditiveTables: false }), STATE_PERSISTENT_SCHEMA_COMPATIBILITY, readTable);
}
/** Catalog presence is enough to refuse retired history without reading or rewriting its rows. */
function assertNoLegacyStateRuntimeRepair(database, pathname) {
	if (hasLegacyCronRunLogs(database)) throw new OpenClawStateDatabaseSchemaMigrationRequiredError("legacy-cron-run-logs", pathname);
}
function isOpenClawStateSchemaFastPathEligible(database, pathname) {
	return runSqliteDeferredTransactionSync(database, () => {
		assertSupportedStateSchemaVersion(database, pathname);
		if (readStateSchemaMigrationVersion(database) !== 20) return false;
		assertSqliteIntegrity(database, pathname);
		const readTable = createSqliteTableContractReader(database);
		assertCurrentStateRuntimeSchema(database, pathname, readTable);
		if (collectSqliteSchemaIssues(database, getOpenClawStateRuntimeSchema({ includeVersionLazyAdditiveTables: false }), STATE_PERSISTENT_SCHEMA_COMPATIBILITY, readTable).some(isOpenClawStateStartupRepairableSchemaIssue)) return false;
		assertNoLegacyStateRuntimeRepair(database, pathname);
		return true;
	});
}
//#endregion
export { tailText as $, STATE_PERSISTENT_SCHEMA_COMPATIBILITY as A, cronRunRecordStoreKey as B, markCurrentStateSchemaVersion as C, versionedStateMigrations as D, runStateSchemaMigrationTransaction as E, prepareSqliteAuditRecord as F, isCronDeliveryStatus as G, cronRunRecordToScriptRunResult as H, migrateLegacyCronRunLogsToTaskRuns as I, resolveCronRunRecordTimestamp as J, isCronRunStatus as K, compareCronRunRecordsNewestFirst as L, isOpenClawStateFirstUseSchemaIssue as M, isOpenClawStateStartupRepairableSchemaIssue as N, writeCurrentStateSchemaMetadata as O, createSqliteAuditRecordKernel as P, normalizeExitCode as Q, cronQuietTriggerDetail as R, executeCanonicalStateSchema as S, prepareStateDatabaseSchemaRepair as T, cronRunRecordToTriggerEval as U, cronRunRecordToRunLogEntry as V, cronRunStorageStatus as W, normalizeCronRunDiagnosticSummary as X, formatUnknownError as Y, normalizeCronRunDiagnosticsCore as Z, SESSION_WATCH_PROVENANCE_EXPLICIT as _, assertCanonicalAgentDatabasesPrimaryKey as a, resolveCronCompletionStatus as at, assertOpenClawStateDatabaseForMaintenance as b, dropLegacyStateTables as c, repairLegacyGatewayRestartHandoffsForStrictMigration as d, CRON_JOB_EXECUTION_TIMEOUT_ERROR as et, logRetiredStateTableMigration as f, SESSION_WATCH_PROVENANCE_AMBIENT_GROUP as g, needsSessionWatchCursorProvenanceMigration as h, needsOpenClawStateDatabaseSchemaRepair as i, resolveAdmittedCronCompletionStatus as it, getOpenClawStateRuntimeSchema as j, OPENCLAW_STATE_MAINTENANCE_SCHEMA_COMPATIBILITY as k, migrateAgentDatabaseRelativePaths as l, migrateSessionWatchCursorProvenance as m, assertNoLegacyStateRuntimeRepair as n, CRON_SETUP_TIMEOUT_ERROR as nt, assertCanonicalStateSchemaShape as o, isUnfencedUpdateDriver as ot, runRetiredStateTableMigrations as p, parseCronRunDetailJson as q, isOpenClawStateSchemaFastPathEligible as r, isCronTimeoutErrorText as rt, detectOpenClawStateDatabaseSchemaMigrationsFromDatabase as s, readStateSchemaPublicationBlocker as st, assertCurrentStateRuntimeSchema as t, CRON_PRE_EXECUTION_TIMEOUT_ERROR as tt, migrateWorkerPlacementExecutionModeSchema as u, migrateSingletonStateFoldInV12 as v, openClawStateMigrationAssertions as w, assertOpenClawStateDatabaseOwner as x, repairAuditEventsSchema as y, cronRunLogEntryToDetail as z };
