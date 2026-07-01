import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { t as expandHomePrefix } from "./home-dir-BjcCg_IW.js";
import { f as resolveConfigDir } from "./utils-BApvfmPs.js";
import { n as replaceFileAtomic } from "./replace-file-BrS02dAb.js";
import { t as parseJsonWithJson5Fallback } from "./parse-json-compat-DvZKmwhP.js";
import { _ as getNodeSqliteKysely, h as executeSqliteQuerySync, i as openOpenClawStateDatabase, o as runOpenClawStateWriteTransaction } from "./openclaw-state-db-gblCDNfo.js";
import { t as normalizeSqliteNumber } from "./sqlite-number-CklSB049.js";
import { c as cronStoreKey, n as normalizeCronJobInput } from "./normalize-BzS-Bdfc.js";
import { i as parseAbsoluteTimeMs, t as normalizeCronStaggerMs } from "./stagger-q3jv0Ns2.js";
import { u as coerceFiniteScheduleNumber } from "./session-target-BoV6mLXy.js";
import fs from "node:fs";
import path from "node:path";
//#region src/cron/normalize-job-identity.ts
/** Repairs legacy cron job identity fields into the canonical id shape. */
/** Normalizes mutable cron job rows from old `jobId` storage into the canonical `id` field. */
function normalizeCronJobIdentityFields(raw) {
	const rawId = normalizeOptionalString(raw.id) ?? "";
	const legacyJobId = normalizeOptionalString(raw.jobId) ?? "";
	const hadJobIdKey = "jobId" in raw;
	const normalizedId = rawId || legacyJobId;
	const idChanged = Boolean(normalizedId && raw.id !== normalizedId);
	if (idChanged) raw.id = normalizedId;
	if (hadJobIdKey) delete raw.jobId;
	return {
		mutated: idChanged || hadJobIdKey,
		legacyJobIdIssue: hadJobIdKey
	};
}
//#endregion
//#region src/cron/persisted-shape.ts
/** Validates persisted cron job records before loading them from disk/state. */
/** Returns the first structural reason a persisted cron job cannot be loaded safely. */
function getInvalidPersistedCronJobReason(candidate) {
	const id = candidate.id;
	if (typeof id !== "string" || !id.trim()) return "missing-id";
	const schedule = candidate.schedule;
	if (!schedule || Array.isArray(schedule)) return "missing-schedule";
	if (typeof schedule === "string") return null;
	if (typeof schedule !== "object") return "missing-schedule";
	const scheduleRecord = schedule;
	const scheduleKind = scheduleRecord.kind;
	if (scheduleKind !== "at" && scheduleKind !== "every" && scheduleKind !== "cron") return "invalid-schedule";
	if (scheduleKind === "at") {
		const at = scheduleRecord.at;
		if (typeof at !== "string" || parseAbsoluteTimeMs(at) === null) return "invalid-schedule";
	}
	if (scheduleKind === "every") {
		const everyMs = scheduleRecord.everyMs;
		if (typeof everyMs !== "number" || !Number.isFinite(everyMs) || everyMs <= 0) return "invalid-schedule";
	}
	if (scheduleKind === "cron") {
		const expr = scheduleRecord.expr;
		if (typeof expr !== "string" || expr.trim().length === 0) return "invalid-schedule";
	}
	const payload = candidate.payload;
	if (!payload || typeof payload !== "object" || Array.isArray(payload)) return "missing-payload";
	const payloadRecord = payload;
	const payloadKind = payloadRecord.kind;
	if (payloadKind !== "systemEvent" && payloadKind !== "agentTurn" && payloadKind !== "command") return "invalid-payload";
	if (payloadKind === "systemEvent") {
		if (typeof payloadRecord.text !== "string") return "invalid-payload";
	}
	if (payloadKind === "agentTurn") {
		const message = payloadRecord.message;
		if (typeof message !== "string" || message.trim().length === 0) return "invalid-payload";
	}
	if (payloadKind === "command") {
		const argv = payloadRecord.argv;
		if (!Array.isArray(argv) || argv.length === 0 || argv.some((value) => typeof value !== "string" || value.length === 0)) return "invalid-payload";
	}
	return null;
}
//#endregion
//#region src/cron/schedule-identity.ts
/** Builds stable identities for cron scheduling inputs. */
function readString(record, key) {
	return normalizeOptionalString(record[key]);
}
function readNumber(record, key) {
	return coerceFiniteScheduleNumber(record[key]);
}
function readStaggerMs(record) {
	return normalizeCronStaggerMs(record.staggerMs);
}
function schedulePayloadFromRecord(schedule) {
	const rawKind = readString(schedule, "kind")?.toLowerCase();
	const expr = readString(schedule, "expr");
	const at = readString(schedule, "at");
	const everyMs = readNumber(schedule, "everyMs");
	const anchorMs = readNumber(schedule, "anchorMs");
	const tz = readString(schedule, "tz");
	const staggerMs = readStaggerMs(schedule);
	const kind = rawKind === "at" || rawKind === "every" || rawKind === "cron" ? rawKind : at ? "at" : everyMs !== void 0 ? "every" : expr ? "cron" : void 0;
	if (kind === "at") return at ? {
		kind: "at",
		at
	} : void 0;
	if (kind === "every" && everyMs !== void 0) return {
		kind: "every",
		everyMs,
		anchorMs
	};
	if (kind === "cron" && expr) return {
		kind: "cron",
		expr,
		tz,
		staggerMs
	};
}
function resolveSchedulePayload(job) {
	if (job.schedule && typeof job.schedule === "object" && !Array.isArray(job.schedule)) return schedulePayloadFromRecord(job.schedule);
}
/** Builds a stable scheduling identity for deciding whether stored timer state is still valid. */
function tryCronScheduleIdentity(job) {
	const schedule = resolveSchedulePayload(job);
	if (!schedule) return;
	return JSON.stringify({
		version: 1,
		enabled: typeof job.enabled === "boolean" ? job.enabled : true,
		schedule
	});
}
/** Compares two cron jobs by the normalized inputs that affect next-run computation. */
function cronSchedulingInputsEqual(previous, next) {
	const previousIdentity = tryCronScheduleIdentity(previous);
	const nextIdentity = tryCronScheduleIdentity(next);
	return previousIdentity !== void 0 && nextIdentity !== void 0 && previousIdentity === nextIdentity;
}
//#endregion
//#region src/cron/store/scalar-codec.ts
/** Parses a JSON object column, returning the fallback for malformed or non-object values. */
function parseJsonObject(raw, fallback) {
	try {
		const parsed = JSON.parse(raw);
		return parsed && typeof parsed === "object" ? parsed : fallback;
	} catch {
		return fallback;
	}
}
/** Parses a JSON column without shape validation, returning the fallback only on parse failure. */
function parseJsonValue(raw, fallback) {
	try {
		return JSON.parse(raw);
	} catch {
		return fallback;
	}
}
/** Converts optional booleans into nullable SQLite integer flags. */
function booleanToInteger(value) {
	return typeof value === "boolean" ? value ? 1 : 0 : null;
}
/** Converts SQLite integer flags into booleans while preserving missing columns as undefined. */
function integerToBoolean(value) {
	const normalized = normalizeSqliteNumber(value);
	return normalized == null ? void 0 : normalized !== 0;
}
/** Serializes optional structured values for JSON columns. */
function serializeJson(value) {
	return value == null ? null : JSON.stringify(value);
}
/** Parses a JSON string-array column and drops non-string entries from legacy data. */
function parseJsonArray(raw) {
	if (!raw) return;
	const parsed = parseJsonObject(raw, void 0);
	return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : void 0;
}
//#endregion
//#region src/cron/store/delivery-codec.ts
/** Maps cron delivery config into normalized SQLite columns. */
function bindDeliveryColumns(delivery) {
	const failureDestination = delivery?.failureDestination;
	return {
		delivery_mode: delivery?.mode ?? null,
		delivery_channel: delivery?.channel ?? null,
		delivery_to: delivery?.to ?? null,
		delivery_thread_id: delivery?.threadId === void 0 || delivery.threadId === null ? null : String(delivery.threadId),
		delivery_account_id: delivery?.accountId ?? null,
		delivery_best_effort: booleanToInteger(delivery?.bestEffort),
		delivery_completion_mode: delivery?.completionDestination?.mode ?? null,
		delivery_completion_to: delivery?.completionDestination?.to ?? null,
		failure_delivery_mode: bindFailureDestinationField(failureDestination, "mode"),
		failure_delivery_channel: bindFailureDestinationField(failureDestination, "channel"),
		failure_delivery_to: bindFailureDestinationField(failureDestination, "to"),
		failure_delivery_account_id: bindFailureDestinationField(failureDestination, "accountId")
	};
}
function bindFailureDestinationField(failureDestination, key) {
	if (!failureDestination || !Object.hasOwn(failureDestination, key)) return null;
	return failureDestination[key] ?? "";
}
function readFailureDestinationField(value) {
	return value === "" || value == null ? void 0 : value;
}
function cronDeliveryModeFromValue(value) {
	return value === "none" || value === "announce" || value === "webhook" ? value : void 0;
}
/** Reconstructs delivery config from split SQLite columns, preserving legacy partial rows. */
function deliveryFromRow(row) {
	const rowMode = cronDeliveryModeFromValue(row.delivery_mode);
	const hasDeliveryColumns = Boolean(row.delivery_channel || row.delivery_to || row.delivery_thread_id || row.delivery_account_id || row.delivery_completion_mode || row.delivery_completion_to || row.failure_delivery_channel != null || row.failure_delivery_to != null || row.failure_delivery_mode != null || row.failure_delivery_account_id != null) || row.delivery_best_effort != null;
	const completionDestination = rowMode === "announce" && row.delivery_completion_mode === "webhook" ? {
		mode: "webhook",
		...row.delivery_completion_to ? { to: row.delivery_completion_to } : {}
	} : void 0;
	const failureDestination = row.failure_delivery_channel != null || row.failure_delivery_to != null || row.failure_delivery_mode != null || row.failure_delivery_account_id != null ? {
		...row.failure_delivery_channel != null ? { channel: readFailureDestinationField(row.failure_delivery_channel) } : {},
		...row.failure_delivery_to != null ? { to: readFailureDestinationField(row.failure_delivery_to) } : {},
		...row.failure_delivery_mode != null ? { mode: readFailureDestinationField(row.failure_delivery_mode) } : {},
		...row.failure_delivery_account_id != null ? { accountId: readFailureDestinationField(row.failure_delivery_account_id) } : {}
	} : void 0;
	if (!rowMode && !hasDeliveryColumns) return;
	return {
		mode: rowMode ?? "announce",
		...row.delivery_channel ? { channel: row.delivery_channel } : {},
		...row.delivery_to ? { to: row.delivery_to } : {},
		...row.delivery_thread_id ? { threadId: row.delivery_thread_id } : {},
		...row.delivery_account_id ? { accountId: row.delivery_account_id } : {},
		...row.delivery_best_effort != null ? { bestEffort: integerToBoolean(row.delivery_best_effort) } : {},
		...completionDestination ? { completionDestination } : {},
		...failureDestination ? { failureDestination } : {}
	};
}
//#endregion
//#region src/cron/store/failure-alert-codec.ts
/** Maps cron failure-alert config into normalized SQLite columns. */
function bindFailureAlertColumns(failureAlert) {
	if (failureAlert === false) return {
		failure_alert_disabled: 1,
		failure_alert_after: null,
		failure_alert_channel: null,
		failure_alert_to: null,
		failure_alert_cooldown_ms: null,
		failure_alert_include_skipped: null,
		failure_alert_mode: null,
		failure_alert_account_id: null
	};
	return {
		failure_alert_disabled: failureAlert ? 0 : null,
		failure_alert_after: failureAlert?.after ?? null,
		failure_alert_channel: failureAlert?.channel ?? null,
		failure_alert_to: failureAlert?.to ?? null,
		failure_alert_cooldown_ms: failureAlert?.cooldownMs ?? null,
		failure_alert_include_skipped: booleanToInteger(failureAlert?.includeSkipped),
		failure_alert_mode: failureAlert?.mode ?? null,
		failure_alert_account_id: failureAlert?.accountId ?? null
	};
}
/** Reconstructs failure-alert config, distinguishing disabled from omitted config. */
function failureAlertFromRow(row) {
	if (row.failure_alert_disabled === 1) return false;
	if (row.failure_alert_after == null && !row.failure_alert_channel && !row.failure_alert_to && row.failure_alert_cooldown_ms == null && row.failure_alert_include_skipped == null && !row.failure_alert_mode && !row.failure_alert_account_id) return;
	return {
		...row.failure_alert_after != null ? { after: normalizeSqliteNumber(row.failure_alert_after) } : {},
		...row.failure_alert_channel ? { channel: row.failure_alert_channel } : {},
		...row.failure_alert_to ? { to: row.failure_alert_to } : {},
		...row.failure_alert_cooldown_ms != null ? { cooldownMs: normalizeSqliteNumber(row.failure_alert_cooldown_ms) } : {},
		...row.failure_alert_include_skipped != null ? { includeSkipped: integerToBoolean(row.failure_alert_include_skipped) } : {},
		...row.failure_alert_mode ? { mode: row.failure_alert_mode } : {},
		...row.failure_alert_account_id ? { accountId: row.failure_alert_account_id } : {}
	};
}
//#endregion
//#region src/cron/store/payload-codec.ts
function parseExternalContentSource(raw) {
	const parsed = raw ? parseJsonValue(raw, void 0) : void 0;
	return parsed === "gmail" || parsed === "webhook" ? parsed : void 0;
}
function parseCommandPayloadMessage(raw) {
	const parsed = raw ? parseJsonValue(raw, void 0) : void 0;
	if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
	const record = parsed;
	if (!Array.isArray(record.argv) || record.argv.length === 0 || record.argv.some((value) => typeof value !== "string" || value.length === 0)) return null;
	const argv = record.argv.map((value) => String(value));
	const env = record.env && typeof record.env === "object" && !Array.isArray(record.env) ? Object.fromEntries(Object.entries(record.env).filter((entry) => typeof entry[1] === "string")) : void 0;
	const rawNoOutputTimeoutSeconds = typeof record.noOutputTimeoutSeconds === "number" || typeof record.noOutputTimeoutSeconds === "bigint" ? record.noOutputTimeoutSeconds : null;
	const rawOutputMaxBytes = typeof record.outputMaxBytes === "number" || typeof record.outputMaxBytes === "bigint" ? record.outputMaxBytes : null;
	const noOutputTimeoutSeconds = normalizeSqliteNumber(rawNoOutputTimeoutSeconds);
	const outputMaxBytes = normalizeSqliteNumber(rawOutputMaxBytes);
	return {
		argv,
		...typeof record.cwd === "string" && record.cwd.trim() ? { cwd: record.cwd } : {},
		...env && Object.keys(env).length > 0 ? { env } : {},
		...typeof record.input === "string" ? { input: record.input } : {},
		...noOutputTimeoutSeconds != null ? { noOutputTimeoutSeconds } : {},
		...outputMaxBytes != null && outputMaxBytes > 0 ? { outputMaxBytes } : {}
	};
}
/** Maps cron payload variants into normalized SQLite columns. */
function bindPayloadColumns(payload) {
	if (payload.kind === "systemEvent") return {
		payload_kind: "systemEvent",
		payload_message: payload.text,
		payload_model: null,
		payload_fallbacks_json: null,
		payload_thinking: null,
		payload_timeout_seconds: null,
		payload_allow_unsafe_external_content: null,
		payload_external_content_source_json: null,
		payload_light_context: null,
		payload_tools_allow_json: null
	};
	if (payload.kind === "command") {
		const { timeoutSeconds: _timeoutSeconds, ...payloadMessage } = payload;
		return {
			payload_kind: "command",
			payload_message: serializeJson(payloadMessage),
			payload_model: null,
			payload_fallbacks_json: null,
			payload_thinking: null,
			payload_timeout_seconds: payload.timeoutSeconds ?? null,
			payload_allow_unsafe_external_content: null,
			payload_external_content_source_json: null,
			payload_light_context: null,
			payload_tools_allow_json: null
		};
	}
	return {
		payload_kind: "agentTurn",
		payload_message: payload.message,
		payload_model: payload.model ?? null,
		payload_fallbacks_json: serializeJson(payload.fallbacks),
		payload_thinking: payload.thinking ?? null,
		payload_timeout_seconds: payload.timeoutSeconds ?? null,
		payload_allow_unsafe_external_content: booleanToInteger(payload.allowUnsafeExternalContent),
		payload_external_content_source_json: serializeJson(payload.externalContentSource),
		payload_light_context: booleanToInteger(payload.lightContext),
		payload_tools_allow_json: serializeJson(payload.toolsAllow)
	};
}
/** Reconstructs cron payload variants from SQLite columns, returning null for invalid rows. */
function payloadFromRow(row) {
	if (row.payload_kind === "systemEvent") return row.payload_message == null ? null : {
		kind: "systemEvent",
		text: row.payload_message
	};
	if (row.payload_kind === "agentTurn") {
		if (row.payload_message == null) return null;
		const fallbacks = row.payload_fallbacks_json ? parseJsonArray(row.payload_fallbacks_json) : void 0;
		const timeoutSeconds = normalizeSqliteNumber(row.payload_timeout_seconds);
		const allowUnsafeExternalContent = row.payload_allow_unsafe_external_content != null ? integerToBoolean(row.payload_allow_unsafe_external_content) : void 0;
		const externalContentSource = parseExternalContentSource(row.payload_external_content_source_json);
		const lightContext = row.payload_light_context != null ? integerToBoolean(row.payload_light_context) : void 0;
		const toolsAllow = row.payload_tools_allow_json ? parseJsonArray(row.payload_tools_allow_json) : void 0;
		return {
			kind: "agentTurn",
			message: row.payload_message,
			...row.payload_model ? { model: row.payload_model } : {},
			...fallbacks ? { fallbacks } : {},
			...row.payload_thinking ? { thinking: row.payload_thinking } : {},
			...timeoutSeconds != null ? { timeoutSeconds } : {},
			...allowUnsafeExternalContent != null ? { allowUnsafeExternalContent } : {},
			...externalContentSource ? { externalContentSource } : {},
			...lightContext != null ? { lightContext } : {},
			...toolsAllow ? { toolsAllow } : {}
		};
	}
	if (row.payload_kind === "command") {
		const command = parseCommandPayloadMessage(row.payload_message);
		if (!command) return null;
		const timeoutSeconds = normalizeSqliteNumber(row.payload_timeout_seconds);
		return {
			kind: "command",
			...command,
			...timeoutSeconds != null ? { timeoutSeconds } : {}
		};
	}
	return null;
}
//#endregion
//#region src/cron/store/schema.ts
/** Creates the Kysely facade scoped to cron_jobs for synchronous SQLite access. */
function getCronStoreKysely(db) {
	return getNodeSqliteKysely(db);
}
//#endregion
//#region src/cron/store/state-codec.ts
/** Maps mutable cron runtime state into normalized SQLite columns. */
function bindStateColumns(state) {
	return {
		next_run_at_ms: state.nextRunAtMs ?? null,
		running_at_ms: state.runningAtMs ?? null,
		last_run_at_ms: state.lastRunAtMs ?? null,
		last_run_status: state.lastRunStatus ?? state.lastStatus ?? null,
		last_error: state.lastError ?? null,
		last_duration_ms: state.lastDurationMs ?? null,
		consecutive_errors: state.consecutiveErrors ?? null,
		consecutive_skipped: state.consecutiveSkipped ?? null,
		schedule_error_count: state.scheduleErrorCount ?? null,
		last_delivery_status: state.lastDeliveryStatus ?? null,
		last_delivery_error: state.lastDeliveryError ?? null,
		last_delivered: booleanToInteger(state.lastDelivered),
		last_failure_alert_at_ms: state.lastFailureAlertAtMs ?? null
	};
}
/** Reconstructs cron runtime state from JSON plus split indexed columns. */
function stateFromRow(row) {
	return {
		...parseJsonObject(row.state_json, {}),
		...row.next_run_at_ms != null ? { nextRunAtMs: normalizeSqliteNumber(row.next_run_at_ms) } : {},
		...row.running_at_ms != null ? { runningAtMs: normalizeSqliteNumber(row.running_at_ms) } : {},
		...row.last_run_at_ms != null ? { lastRunAtMs: normalizeSqliteNumber(row.last_run_at_ms) } : {},
		...row.last_run_status ? { lastRunStatus: row.last_run_status } : {},
		...row.last_error ? { lastError: row.last_error } : {},
		...row.last_duration_ms != null ? { lastDurationMs: normalizeSqliteNumber(row.last_duration_ms) } : {},
		...row.consecutive_errors != null ? { consecutiveErrors: normalizeSqliteNumber(row.consecutive_errors) } : {},
		...row.consecutive_skipped != null ? { consecutiveSkipped: normalizeSqliteNumber(row.consecutive_skipped) } : {},
		...row.schedule_error_count != null ? { scheduleErrorCount: normalizeSqliteNumber(row.schedule_error_count) } : {},
		...row.last_delivery_status ? { lastDeliveryStatus: row.last_delivery_status } : {},
		...row.last_delivery_error ? { lastDeliveryError: row.last_delivery_error } : {},
		...row.last_delivered != null ? { lastDelivered: integerToBoolean(row.last_delivered) } : {},
		...row.last_failure_alert_at_ms != null ? { lastFailureAlertAtMs: normalizeSqliteNumber(row.last_failure_alert_at_ms) } : {}
	};
}
//#endregion
//#region src/cron/store/row-codec.ts
function bindScheduleColumns(schedule) {
	if (schedule.kind === "at") return {
		schedule_kind: "at",
		at: schedule.at,
		every_ms: null,
		anchor_ms: null,
		schedule_expr: null,
		schedule_tz: null,
		stagger_ms: null
	};
	if (schedule.kind === "every") return {
		schedule_kind: "every",
		at: null,
		every_ms: schedule.everyMs,
		anchor_ms: schedule.anchorMs ?? null,
		schedule_expr: null,
		schedule_tz: null,
		stagger_ms: null
	};
	return {
		schedule_kind: "cron",
		at: null,
		every_ms: null,
		anchor_ms: null,
		schedule_expr: schedule.expr,
		schedule_tz: schedule.tz ?? null,
		stagger_ms: schedule.staggerMs ?? null
	};
}
function stripJobRuntimeFields(job) {
	const { state: _state, updatedAtMs: _updatedAtMs, ...rest } = job;
	return {
		...rest,
		state: {}
	};
}
function mergeFailureDestinationProjection(configJob, projectedJob) {
	const failureDestination = projectedJob?.delivery?.failureDestination;
	if (!failureDestination) return configJob;
	const delivery = isRecord(configJob.delivery) && !Array.isArray(configJob.delivery) ? { ...configJob.delivery } : projectedJob?.delivery ? {
		mode: projectedJob.delivery.mode,
		...projectedJob.delivery.channel ? { channel: projectedJob.delivery.channel } : {},
		...projectedJob.delivery.to ? { to: projectedJob.delivery.to } : {},
		...projectedJob.delivery.threadId !== void 0 ? { threadId: projectedJob.delivery.threadId } : {},
		...projectedJob.delivery.accountId ? { accountId: projectedJob.delivery.accountId } : {},
		...projectedJob.delivery.bestEffort !== void 0 ? { bestEffort: projectedJob.delivery.bestEffort } : {},
		...projectedJob.delivery.completionDestination ? { completionDestination: projectedJob.delivery.completionDestination } : {}
	} : {};
	const nextFailureDestination = isRecord(delivery.failureDestination) ? { ...delivery.failureDestination } : {};
	if (Object.hasOwn(failureDestination, "channel")) nextFailureDestination.channel = failureDestination.channel;
	if (Object.hasOwn(failureDestination, "to")) nextFailureDestination.to = failureDestination.to;
	if (Object.hasOwn(failureDestination, "accountId")) nextFailureDestination.accountId = failureDestination.accountId;
	if (Object.hasOwn(failureDestination, "mode")) nextFailureDestination.mode = failureDestination.mode;
	delivery.failureDestination = nextFailureDestination;
	return {
		...configJob,
		delivery
	};
}
function bindCronJobRow(storeKey, job, sortOrder) {
	return {
		store_key: storeKey,
		job_id: job.id,
		name: job.name,
		description: job.description ?? null,
		enabled: job.enabled ? 1 : 0,
		delete_after_run: booleanToInteger(job.deleteAfterRun),
		created_at_ms: job.createdAtMs,
		updated_at: job.updatedAtMs,
		agent_id: job.agentId ?? null,
		session_key: job.sessionKey ?? null,
		session_target: job.sessionTarget,
		wake_mode: job.wakeMode,
		...bindScheduleColumns(job.schedule),
		...bindPayloadColumns(job.payload),
		...bindDeliveryColumns(job.delivery),
		...bindFailureAlertColumns(job.failureAlert),
		...bindStateColumns(job.state ?? {}),
		job_json: JSON.stringify(stripJobRuntimeFields(job)),
		state_json: JSON.stringify(job.state ?? {}),
		runtime_updated_at_ms: job.updatedAtMs,
		schedule_identity: tryCronScheduleIdentity(job) ?? null,
		sort_order: sortOrder
	};
}
function normalizeCronJobForSqlite(job) {
	const raw = structuredClone(job);
	const hadDeleteAfterRun = Object.hasOwn(raw, "deleteAfterRun");
	normalizeCronJobIdentityFields(raw);
	const normalized = normalizeCronJobInput(raw, { applyDefaults: true });
	if (!normalized || getInvalidPersistedCronJobReason(normalized)) return null;
	if (!hadDeleteAfterRun) delete normalized.deleteAfterRun;
	const createdAtMs = typeof normalized.createdAtMs === "number" && Number.isFinite(normalized.createdAtMs) ? normalized.createdAtMs : Date.now();
	const updatedAtMs = typeof normalized.updatedAtMs === "number" && Number.isFinite(normalized.updatedAtMs) ? normalized.updatedAtMs : createdAtMs;
	return {
		...normalized,
		createdAtMs,
		updatedAtMs,
		state: isRecord(normalized.state) ? normalized.state : {}
	};
}
function countUnpersistableCronJobs(store) {
	return store.jobs.reduce((count, job) => count + (normalizeCronJobForSqlite(job) ? 0 : 1), 0);
}
/** Fails before replacing SQLite rows when any config job cannot round-trip. */
function assertCronStoreCanPersist(store) {
	const invalidJobs = countUnpersistableCronJobs(store);
	if (invalidJobs > 0) throw new Error(`Cannot persist cron store with ${invalidJobs} invalid job(s)`);
}
function scheduleFromRow(row) {
	if (row.schedule_kind === "at" && row.at) return {
		kind: "at",
		at: row.at
	};
	if (row.schedule_kind === "every" && row.every_ms != null) return {
		kind: "every",
		everyMs: normalizeSqliteNumber(row.every_ms) ?? 0,
		...row.anchor_ms != null ? { anchorMs: normalizeSqliteNumber(row.anchor_ms) } : {}
	};
	if (row.schedule_kind === "cron" && row.schedule_expr) return {
		kind: "cron",
		expr: row.schedule_expr,
		...row.schedule_tz ? { tz: row.schedule_tz } : {},
		...row.stagger_ms != null ? { staggerMs: normalizeSqliteNumber(row.stagger_ms) } : {}
	};
	return null;
}
function rowToCronJob(row) {
	const schedule = scheduleFromRow(row);
	const payload = payloadFromRow(row);
	const delivery = deliveryFromRow(row);
	const failureAlert = failureAlertFromRow(row);
	if (!schedule || !payload) return null;
	const createdAtMs = normalizeSqliteNumber(row.created_at_ms) ?? Date.now();
	return {
		id: row.job_id,
		name: row.name,
		...row.description ? { description: row.description } : {},
		enabled: row.enabled !== 0,
		...row.delete_after_run != null ? { deleteAfterRun: integerToBoolean(row.delete_after_run) } : {},
		createdAtMs,
		updatedAtMs: normalizeSqliteNumber(row.runtime_updated_at_ms) ?? normalizeSqliteNumber(row.updated_at) ?? createdAtMs,
		...row.agent_id ? { agentId: row.agent_id } : {},
		...row.session_key ? { sessionKey: row.session_key } : {},
		schedule,
		sessionTarget: row.session_target,
		wakeMode: row.wake_mode,
		payload,
		...delivery ? { delivery } : {},
		...failureAlert !== void 0 ? { failureAlert } : {},
		state: stateFromRow(row)
	};
}
/** Loads cron rows in config order with deterministic fallbacks for old rows. */
function loadCronRows(db, storeKey) {
	return executeSqliteQuerySync(db, getCronStoreKysely(db).selectFrom("cron_jobs").selectAll().where("store_key", "=", storeKey).orderBy("sort_order", "asc").orderBy("updated_at", "asc").orderBy("job_id", "asc")).rows;
}
/** Replaces all persisted cron rows for one store key from the config store snapshot. */
function replaceCronRows(db, storeKey, store) {
	executeSqliteQuerySync(db, getCronStoreKysely(db).deleteFrom("cron_jobs").where("store_key", "=", storeKey));
	for (const [index, job] of store.jobs.entries()) {
		const normalized = normalizeCronJobForSqlite(job);
		if (!normalized) continue;
		executeSqliteQuerySync(db, getCronStoreKysely(db).insertInto("cron_jobs").values(bindCronJobRow(storeKey, normalized, index)));
	}
}
/** Updates only mutable runtime columns without rewriting full job config JSON. */
function updateCronRuntimeRows(db, storeKey, store) {
	for (const job of store.jobs) executeSqliteQuerySync(db, getCronStoreKysely(db).updateTable("cron_jobs").set({
		...bindStateColumns(job.state ?? {}),
		state_json: JSON.stringify(job.state ?? {}),
		runtime_updated_at_ms: job.updatedAtMs,
		schedule_identity: tryCronScheduleIdentity(job)
	}).where("store_key", "=", storeKey).where("job_id", "=", job.id));
}
/** Reconstructs loaded cron store data and config-runtime sidecars from SQLite rows. */
function loadedCronStoreFromRows(rows) {
	const parsedJobs = rows.map(rowToCronJob);
	const jobs = parsedJobs.filter((job) => job !== null);
	const configJobs = rows.map((row, index) => mergeFailureDestinationProjection(parseJsonObject(row.job_json, stripJobRuntimeFields(parsedJobs[index] ?? {})), parsedJobs[index] ?? null));
	const configJobRuntimeEntries = rows.map((row) => ({
		updatedAtMs: normalizeSqliteNumber(row.runtime_updated_at_ms) ?? normalizeSqliteNumber(row.updated_at),
		scheduleIdentity: row.schedule_identity ?? void 0,
		state: stateFromRow(row)
	}));
	return {
		store: {
			version: 1,
			jobs
		},
		configJobs,
		configJobIndexes: rows.map((_row, index) => index),
		configJobRuntimeEntries,
		invalidConfigRows: []
	};
}
//#endregion
//#region src/cron/store.ts
/** Public cron store load/save API backed by SQLite plus quarantine sidecars. */
function resolveDefaultCronDir() {
	return path.join(resolveConfigDir(), "cron");
}
function resolveDefaultCronStorePath() {
	return path.join(resolveDefaultCronDir(), "jobs.json");
}
/** Resolves the sidecar quarantine path used for invalid cron config rows. */
function resolveCronQuarantinePath(storePath) {
	if (storePath.endsWith(".json")) return storePath.replace(/\.json$/, "-quarantine.json");
	return `${storePath}-quarantine.json`;
}
/** Resolves the cron jobs store path, expanding home-relative user input. */
function resolveCronJobsStorePath(storePath) {
	if (storePath?.trim()) {
		const raw = storePath.trim();
		if (raw.startsWith("~")) return path.resolve(expandHomePrefix(raw));
		return path.resolve(raw);
	}
	return resolveDefaultCronStorePath();
}
/** Loads cron jobs plus config/runtime sidecars from the SQLite-backed store. */
async function loadCronJobsStoreWithConfigJobs(storePath) {
	const storeKey = cronStoreKey(path.resolve(storePath));
	const database = openOpenClawStateDatabase().db;
	const rows = loadCronRows(database, storeKey);
	if (rows.length > 0) return loadedCronStoreFromRows(rows);
	return {
		store: {
			version: 1,
			jobs: []
		},
		configJobs: [],
		configJobIndexes: [],
		configJobRuntimeEntries: [],
		invalidConfigRows: []
	};
}
/** Loads only the persisted cron job store payload. */
async function loadCronJobsStore(storePath) {
	return (await loadCronJobsStoreWithConfigJobs(storePath)).store;
}
/** Synchronously loads only the persisted cron job store payload. */
function loadCronJobsStoreSync(storePath) {
	const storeKey = cronStoreKey(path.resolve(storePath));
	const database = openOpenClawStateDatabase().db;
	const rows = loadCronRows(database, storeKey);
	if (rows.length > 0) return loadedCronStoreFromRows(rows).store;
	return {
		version: 1,
		jobs: []
	};
}
async function atomicWrite(filePath, content, dirMode = 448) {
	await replaceFileAtomic({
		filePath,
		content,
		dirMode,
		mode: 384,
		tempPrefix: ".openclaw-cron",
		renameMaxRetries: 3,
		copyFallbackOnPermissionError: true
	});
}
/** Persists cron jobs, or only mutable runtime state when stateOnly is set. */
async function saveCronJobsStore(storePath, store, opts) {
	const storeKey = cronStoreKey(path.resolve(storePath));
	if (opts?.stateOnly) {
		runOpenClawStateWriteTransaction(({ db }) => {
			updateCronRuntimeRows(db, storeKey, store);
		});
		return;
	}
	assertCronStoreCanPersist(store);
	runOpenClawStateWriteTransaction(({ db }) => {
		replaceCronRows(db, storeKey, store);
	});
}
/** Resolves the public plugin-SDK cron store path. */
function resolveCronStorePath(storePath) {
	return resolveCronJobsStorePath(storePath);
}
/** Plugin-SDK alias for loading the cron store. */
async function loadCronStore(storePath) {
	return await loadCronJobsStore(storePath);
}
/** Plugin-SDK alias for saving the cron store. */
async function saveCronStore(storePath, store, opts) {
	await saveCronJobsStore(storePath, store, opts);
}
/** Loads the cron quarantine sidecar, validating its persisted v1 shape. */
async function loadCronQuarantineFile(pathLocal) {
	try {
		const parsed = parseJsonWithJson5Fallback(await fs.promises.readFile(pathLocal, "utf-8"));
		if (!isRecord(parsed) || parsed.version !== 1 || !Array.isArray(parsed.jobs)) throw new Error(`Unsupported cron quarantine file shape at ${pathLocal}`);
		return {
			version: 1,
			jobs: parsed.jobs.map((entry, index) => {
				if (!isRecord(entry) || typeof entry.reason !== "string" || !isRecord(entry.job) && !("raw" in entry)) throw new Error(`Unsupported cron quarantine entry at ${pathLocal} index ${index}`);
				const sourceIndex = typeof entry.sourceIndex === "number" ? entry.sourceIndex : -1;
				const quarantined = {
					quarantinedAtMs: typeof entry.quarantinedAtMs === "number" && Number.isFinite(entry.quarantinedAtMs) ? entry.quarantinedAtMs : Date.now(),
					sourceIndex,
					reason: entry.reason
				};
				if (isRecord(entry.job)) quarantined.job = entry.job;
				if ("raw" in entry) quarantined.raw = entry.raw;
				if (isRecord(entry.state)) quarantined.state = entry.state;
				if (typeof entry.updatedAtMs === "number" && Number.isFinite(entry.updatedAtMs)) quarantined.updatedAtMs = entry.updatedAtMs;
				if (typeof entry.scheduleIdentity === "string") quarantined.scheduleIdentity = entry.scheduleIdentity;
				return quarantined;
			})
		};
	} catch (err) {
		if (err?.code === "ENOENT") return {
			version: 1,
			jobs: []
		};
		throw err;
	}
}
function quarantineEntryKey(entry) {
	const rawId = entry.job ? normalizeOptionalString(entry.job.id) ?? normalizeOptionalString(entry.job.jobId) : null;
	return JSON.stringify({
		id: rawId ?? null,
		sourceIndex: entry.sourceIndex,
		reason: entry.reason,
		job: entry.job ?? null,
		raw: entry.raw ?? null,
		state: entry.state ?? null,
		updatedAtMs: entry.updatedAtMs ?? null,
		scheduleIdentity: entry.scheduleIdentity ?? null
	});
}
/** Appends new invalid cron config rows to the quarantine sidecar without duplicating entries. */
async function saveCronQuarantineFile(params) {
	if (params.entries.length === 0) return null;
	const quarantinePath = resolveCronQuarantinePath(params.storePath);
	const existing = await loadCronQuarantineFile(quarantinePath);
	const seen = new Set(existing.jobs.map(quarantineEntryKey));
	const nextJobs = existing.jobs.slice();
	let appended = false;
	for (const entry of params.entries.toSorted((a, b) => a.sourceIndex - b.sourceIndex)) {
		const key = quarantineEntryKey(entry);
		if (seen.has(key)) continue;
		seen.add(key);
		appended = true;
		nextJobs.push({
			quarantinedAtMs: params.nowMs,
			sourceIndex: entry.sourceIndex,
			reason: entry.reason,
			...entry.job ? { job: structuredClone(entry.job) } : {},
			..."raw" in entry ? { raw: structuredClone(entry.raw) } : {},
			...entry.state ? { state: structuredClone(entry.state) } : {},
			...entry.updatedAtMs !== void 0 ? { updatedAtMs: entry.updatedAtMs } : {},
			...entry.scheduleIdentity !== void 0 ? { scheduleIdentity: entry.scheduleIdentity } : {}
		});
	}
	if (!appended) return quarantinePath;
	await atomicWrite(quarantinePath, JSON.stringify({
		version: 1,
		jobs: nextJobs
	}, null, 2));
	return quarantinePath;
}
//#endregion
export { loadCronStore as a, resolveCronStorePath as c, saveCronStore as d, cronSchedulingInputsEqual as f, loadCronQuarantineFile as i, saveCronJobsStore as l, normalizeCronJobIdentityFields as m, loadCronJobsStoreSync as n, resolveCronJobsStorePath as o, getInvalidPersistedCronJobReason as p, loadCronJobsStoreWithConfigJobs as r, resolveCronQuarantinePath as s, loadCronJobsStore as t, saveCronQuarantineFile as u };
