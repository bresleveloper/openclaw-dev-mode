import { a as isRecord } from "./openclaw-state-read-record-coerce-DWp7lFsP.mjs";
import "./openclaw-state-read-types.secrets-Wz8lmfvB.mjs";
import { t as safeParseJson } from "./openclaw-state-read-json-coercion-CYFfIS_L.mjs";
import { t as sha256Hex } from "./openclaw-state-read-node-crypto-D_-P4MKR.mjs";
import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync } from "./openclaw-state-read-kysely-sync-DrKJlREt.mjs";
import { S as NEVER, a as boolean, c as literal, d as number, f as object, g as string, n as _enum, o as custom, s as discriminatedUnion } from "./openclaw-state-read-schemas-D2seJkFD.mjs";
import { r as runSqliteDeferredTransactionSync } from "./openclaw-state-read-sqlite-transaction-gPY-7Ojc.mjs";
import { _ as UpdateFailureFactSchema, v as updateRecoverySchema } from "./openclaw-state-read-openclaw-state-read-handlers-BUnsgff9.mjs";
//#region src/infra/restart-sentinel-store.ts
const RESTART_SENTINEL_KEY = "current";
const RESTART_SENTINEL_REVISION_FLOOR_KEY = "revision-floor";
const UPDATE_INSTALL_RECEIPT_KEY = "latest-update-install";
function isSafeInteger(value) {
	return typeof value === "number" && Number.isSafeInteger(value);
}
function omitUndefinedFields(value) {
	for (const key in value) if (value[key] === void 0) delete value[key];
	return value;
}
const restartSentinelLogSchema = object({
	stdoutTail: string().nullish(),
	stderrTail: string().nullish(),
	exitCode: number().int().nullish()
}).transform(omitUndefinedFields);
const restartSentinelStepSchema = object({
	name: string(),
	command: string(),
	failureFacts: UpdateFailureFactSchema.array().max(5).optional().catch(void 0),
	cwd: string().nullish(),
	durationMs: number().finite().nullish(),
	log: restartSentinelLogSchema.nullish(),
	advisory: boolean().optional()
}).transform(omitUndefinedFields);
const restartSentinelStepsSchema = custom(Array.isArray).transform((steps, ctx) => steps.map((step) => {
	const parsed = restartSentinelStepSchema.safeParse(step);
	if (parsed.success) return parsed.data;
	ctx.addIssue({
		code: "custom",
		message: "Invalid restart sentinel step"
	});
	return NEVER;
}));
const restartSentinelStatsSchema = object({
	recovery: updateRecoverySchema.optional().catch(void 0),
	mode: string().optional(),
	root: string().optional(),
	target: string().optional(),
	requiresRestart: boolean().optional(),
	handoffId: string().optional(),
	runId: string().optional(),
	before: custom(isRecord).nullish(),
	after: custom(isRecord).nullish(),
	steps: restartSentinelStepsSchema.optional(),
	reason: string().nullish(),
	durationMs: number().finite().nullish()
}).transform(omitUndefinedFields);
const restartSentinelContinuationSchema = discriminatedUnion("kind", [object({
	kind: literal("systemEvent"),
	text: string()
}), object({
	kind: literal("agentTurn"),
	message: string()
})]);
const restartSentinelPayloadSchema = object({
	kind: _enum([
		"config-apply",
		"config-auto-recovery",
		"config-patch",
		"update",
		"restart"
	]),
	status: _enum([
		"ok",
		"error",
		"skipped"
	]),
	ts: number().int(),
	sessionKey: string().optional(),
	deliveryContext: object({
		channel: string().optional(),
		to: string().optional(),
		accountId: string().optional()
	}).transform(omitUndefinedFields).transform((value) => Object.keys(value).length > 0 ? value : void 0).optional(),
	threadId: string().optional(),
	message: string().nullish().transform((value) => value ?? void 0),
	continuation: restartSentinelContinuationSchema.nullish().transform((value) => value ?? void 0),
	doctorHint: string().nullish().transform((value) => value ?? void 0),
	stats: restartSentinelStatsSchema.nullish().transform((value) => value ?? void 0)
}).transform(omitUndefinedFields);
function parseRestartSentinelPayload(value) {
	const parsed = restartSentinelPayloadSchema.safeParse(value);
	return parsed.success ? parsed.data : null;
}
function parseRequiredJson(value) {
	if (value === null) return;
	return safeParseJson(value);
}
function decodeRestartSentinelRow(row) {
	if (row.version !== 1 || !isSafeInteger(row.updated_at_ms)) return null;
	const continuation = parseRequiredJson(row.continuation_json);
	if (row.continuation_json !== null && continuation === void 0) return null;
	const stats = parseRequiredJson(row.stats_json);
	if (row.stats_json !== null && stats === void 0) return null;
	const payload = parseRestartSentinelPayload({
		kind: row.kind,
		status: row.status,
		ts: row.ts,
		sessionKey: row.session_key ?? void 0,
		threadId: row.thread_id ?? void 0,
		deliveryContext: {
			channel: row.delivery_channel ?? void 0,
			to: row.delivery_to ?? void 0,
			accountId: row.delivery_account_id ?? void 0
		},
		message: row.message,
		continuation,
		doctorHint: row.doctor_hint,
		stats
	});
	return payload ? {
		version: 1,
		payload,
		revision: row.updated_at_ms
	} : null;
}
function readRestartSentinelRowForKeySync(db, sentinelKey) {
	const stateDb = getNodeSqliteKysely(db);
	const row = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("gateway_restart_sentinel").select([
		"version",
		"kind",
		"status",
		"ts",
		"session_key",
		"thread_id",
		"delivery_channel",
		"delivery_to",
		"delivery_account_id",
		"message",
		"continuation_json",
		"doctor_hint",
		"stats_json",
		"updated_at_ms"
	]).where("sentinel_key", "=", sentinelKey));
	if (!row) return { kind: "missing" };
	const sentinel = decodeRestartSentinelRow(row);
	return sentinel ? {
		kind: "valid",
		sentinel
	} : {
		kind: "invalid",
		revision: row.updated_at_ms
	};
}
function readRestartSentinelRowSync(db) {
	return readRestartSentinelRowForKeySync(db, RESTART_SENTINEL_KEY);
}
function readUpdateInstallReceiptRowSync(db) {
	const current = readRestartSentinelRowForKeySync(db, UPDATE_INSTALL_RECEIPT_KEY);
	return current.kind === "valid" ? current.sentinel : null;
}
function readRestartSentinelRevisionFloorSync(db) {
	const stateDb = getNodeSqliteKysely(db);
	const row = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("gateway_restart_sentinel").select("updated_at_ms").where("sentinel_key", "=", RESTART_SENTINEL_REVISION_FLOOR_KEY));
	if (!row) return null;
	if (!Number.isSafeInteger(row.updated_at_ms)) throw new Error("Restart sentinel revision floor is outside the safe integer range");
	return row.updated_at_ms;
}
function maxRevision(left, right) {
	if (left === null) return right;
	if (right === null) return left;
	return Math.max(left, right);
}
/** Read inside a transaction; the floor also identifies an absent, consumed notification. */
function readRestartSentinelSnapshotSync(db) {
	const state = readRestartSentinelRowSync(db);
	return {
		state,
		revision: maxRevision(state.kind === "missing" ? null : state.kind === "valid" ? state.sentinel.revision : state.revision, readRestartSentinelRevisionFloorSync(db))
	};
}
//#endregion
//#region src/infra/update-failure-report-receipt.ts
function isCanonicalGithubUrl(value, pathname, allowSearch) {
	if (typeof value !== "string") return false;
	try {
		const parsed = new URL(value);
		return parsed.origin === "https://github.com" && !parsed.username && !parsed.password && !parsed.hash && (allowSearch || !parsed.search) && pathname.test(parsed.pathname);
	} catch {
		return false;
	}
}
function isPreviewDigest(value) {
	return typeof value === "string" && /^[a-f0-9]{64}$/u.test(value);
}
function parseUpdateFailureReportReceipt(value) {
	if (!isRecord(value) || value.status !== "preparing" && value.status !== "prepared" && value.status !== "pending" && value.status !== "retryable" && value.status !== "created" && value.status !== "fallback" || typeof value.reservationId !== "string" || (value.status === "preparing" || value.status === "prepared") && (typeof value.preparingSinceMs !== "number" || !Number.isFinite(value.preparingSinceMs)) || value.artifactSweep !== void 0 && value.artifactSweep !== "pending" || value.cleanup !== void 0 && value.cleanup !== "pending" || value.previewDigest !== void 0 && !isPreviewDigest(value.previewDigest) || value.replacementReady !== void 0 && value.replacementReady !== true || value.replacementReady === true && (value.status !== "retryable" || value.cleanup !== void 0 || value.artifactSweep !== "pending") || value.sweepOwnerId === void 0 !== (value.sweepSinceMs === void 0) || value.sweepOwnerId === void 0 !== (value.sweepGeneration === void 0) || value.sweepGeneration !== void 0 && typeof value.sweepGeneration !== "string" || value.sweepOwnerId !== void 0 && typeof value.sweepOwnerId !== "string" || value.sweepSinceMs !== void 0 && (typeof value.sweepSinceMs !== "number" || !Number.isFinite(value.sweepSinceMs)) || value.sweepOwnerId !== void 0 && value.artifactSweep !== "pending" || value.status === "created" && !isCanonicalGithubUrl(value.url, /^\/openclaw\/openclaw\/issues\/\d+$/u, false) || value.status === "fallback" && !isCanonicalGithubUrl(value.fallbackUrl, /^\/openclaw\/openclaw\/issues\/new$/u, true) || value.cleanup !== void 0 && value.status !== "created" && value.status !== "retryable" || value.status !== "created" && value.url !== void 0 || value.status !== "fallback" && value.fallbackUrl !== void 0) return null;
	return {
		...value.artifactSweep === "pending" ? { artifactSweep: value.artifactSweep } : {},
		reservationId: value.reservationId,
		status: value.status,
		...value.cleanup === "pending" ? { cleanup: value.cleanup } : {},
		...typeof value.preparingSinceMs === "number" ? { preparingSinceMs: value.preparingSinceMs } : {},
		...typeof value.previewDigest === "string" ? { previewDigest: value.previewDigest } : {},
		...value.replacementReady === true ? { replacementReady: value.replacementReady } : {},
		...typeof value.sweepGeneration === "string" ? { sweepGeneration: value.sweepGeneration } : {},
		...typeof value.sweepOwnerId === "string" ? { sweepOwnerId: value.sweepOwnerId } : {},
		...typeof value.sweepSinceMs === "number" ? { sweepSinceMs: value.sweepSinceMs } : {},
		...typeof value.url === "string" ? { url: value.url } : {},
		...typeof value.fallbackUrl === "string" ? { fallbackUrl: value.fallbackUrl } : {}
	};
}
//#endregion
//#region src/infra/update-failure-report-receipt-store.ts
const RECEIPT_KEY_PREFIX = "update-failure-report:";
function receiptKey(attemptId) {
	return `${RECEIPT_KEY_PREFIX}${sha256Hex(attemptId)}`;
}
function parseReceipt(sentinel) {
	if (sentinel?.payload.kind !== "update" || sentinel.payload.status !== "skipped" || sentinel.payload.stats?.reason !== "update-failure-report-receipt" || typeof sentinel.payload.message !== "string") return null;
	return parseUpdateFailureReportReceipt(safeParseJson(sentinel.payload.message));
}
/** Reads one existing report receipt without creating state. */
function readUpdateFailureReportReceiptRowSync(db, attemptId) {
	const current = readRestartSentinelRowForKeySync(db, receiptKey(attemptId));
	return parseReceipt(current.kind === "valid" ? current.sentinel : null);
}
//#endregion
//#region src/infra/restart-sentinel.read.worker.ts
const restartSentinelReadOperations = {
	"restartSentinel.reportReceipt": (input, db) => ({
		type: "restartSentinel.reportReceipt",
		receipt: readUpdateFailureReportReceiptRowSync(db, input)
	}),
	"restartSentinel.current": (_input, db) => ({
		type: "restartSentinel.current",
		state: readRestartSentinelRowSync(db)
	}),
	"restartSentinel.snapshot": (_input, db) => runSqliteDeferredTransactionSync(db, () => {
		const { state, revision } = readRestartSentinelSnapshotSync(db);
		return {
			type: "restartSentinel.snapshot",
			snapshot: {
				sentinel: state.kind === "valid" ? state.sentinel : null,
				revision
			}
		};
	}),
	"restartSentinel.installReceipt": (_input, db) => ({
		type: "restartSentinel.installReceipt",
		sentinel: readUpdateInstallReceiptRowSync(db)
	})
};
//#endregion
export { restartSentinelReadOperations };
