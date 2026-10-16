import "./src-CdRlGRnW.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as safeParseJson } from "./json-coercion-pfKbZnCJ.mjs";
import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { ni as NEVER } from "./json-schema-processors-C6KO_BFy.mjs";
import { Et as _enum, Fn as object, Jn as string, Kt as custom, Lt as boolean, Pn as number, Yt as discriminatedUnion, xn as literal } from "./schemas-BOYIvvln.mjs";
import { n as UpdateFailureFactSchema } from "./update-run-schema-DOichlUj.mjs";
import { t as updateRecoverySchema } from "./update-recovery-nMp5y7WR.mjs";
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
function parseRestartSentinelEnvelope(value) {
	if (!isRecord(value) || value.version !== 1) return null;
	const payload = parseRestartSentinelPayload(value.payload);
	return payload ? {
		version: 1,
		payload
	} : null;
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
function requireValidPayload(payload) {
	const parsed = parseRestartSentinelPayload(payload);
	if (!parsed) throw new TypeError("Invalid restart sentinel payload");
	return parsed;
}
function nextRevision(currentRevision) {
	if (currentRevision !== null && !Number.isSafeInteger(currentRevision)) throw new Error("Restart sentinel revision is outside the safe integer range");
	const revision = Math.max(Date.now(), currentRevision === null ? 0 : currentRevision + 1);
	if (!Number.isSafeInteger(revision)) throw new Error("Restart sentinel revision exhausted the safe integer range");
	return revision;
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
function buildRestartSentinelRow(payload, revision, sentinelKey = RESTART_SENTINEL_KEY) {
	return {
		sentinel_key: sentinelKey,
		version: 1,
		kind: payload.kind,
		status: payload.status,
		ts: payload.ts,
		session_key: payload.sessionKey ?? null,
		thread_id: payload.threadId ?? null,
		delivery_channel: payload.deliveryContext?.channel ?? null,
		delivery_to: payload.deliveryContext?.to ?? null,
		delivery_account_id: payload.deliveryContext?.accountId ?? null,
		message: payload.message ?? null,
		continuation_json: payload.continuation ? JSON.stringify(payload.continuation) : null,
		doctor_hint: payload.doctorHint ?? null,
		stats_json: payload.stats ? JSON.stringify(payload.stats) : null,
		payload_json: JSON.stringify(payload),
		updated_at_ms: revision
	};
}
function upsertRestartSentinelRowSync(db, row) {
	const stateDb = getNodeSqliteKysely(db);
	const { sentinel_key: _key, ...values } = row;
	executeSqliteQuerySync(db, stateDb.insertInto("gateway_restart_sentinel").values(row).onConflict((conflict) => conflict.column("sentinel_key").doUpdateSet(values)));
}
function advanceRestartSentinelRevisionFloorSync(db, revision) {
	upsertRestartSentinelRowSync(db, buildRestartSentinelRow({
		kind: "restart",
		status: "skipped",
		ts: revision
	}, revision, RESTART_SENTINEL_REVISION_FLOOR_KEY));
}
function writeRestartSentinelRowSync(db, rawPayload) {
	const payload = requireValidPayload(rawPayload);
	const revision = nextRevision(readRestartSentinelSnapshotSync(db).revision);
	upsertRestartSentinelRowSync(db, buildRestartSentinelRow(payload, revision));
	advanceRestartSentinelRevisionFloorSync(db, revision);
	return {
		version: 1,
		payload,
		revision
	};
}
/** Read inside a transaction; the floor also identifies an absent, consumed notification. */
function readRestartSentinelSnapshotSync(db) {
	const state = readRestartSentinelRowSync(db);
	return {
		state,
		revision: maxRevision(state.kind === "missing" ? null : state.kind === "valid" ? state.sentinel.revision : state.revision, readRestartSentinelRevisionFloorSync(db))
	};
}
function writeUpdateInstallReceiptRowSync(db, rawPayload) {
	const payload = requireValidPayload(rawPayload);
	if (payload.kind !== "update" || payload.stats?.mode !== "git") throw new TypeError("Update install receipt requires a git update payload");
	const current = readRestartSentinelRowForKeySync(db, UPDATE_INSTALL_RECEIPT_KEY);
	const revision = nextRevision(current.kind === "missing" ? null : current.kind === "valid" ? current.sentinel.revision : current.revision);
	upsertRestartSentinelRowSync(db, buildRestartSentinelRow(payload, revision, UPDATE_INSTALL_RECEIPT_KEY));
	return {
		version: 1,
		payload,
		revision
	};
}
/** Compare inside the caller's transaction; null requires an absent current row. */
function writeRestartSentinelRowIfRevisionSync(db, rawPayload, expectedRevision) {
	const { state: current, revision: previousRevision } = readRestartSentinelSnapshotSync(db);
	if (expectedRevision === null ? current.kind !== "missing" : current.kind !== "valid" || current.sentinel.revision !== expectedRevision) return null;
	const payload = requireValidPayload(rawPayload);
	const revision = nextRevision(previousRevision);
	const row = buildRestartSentinelRow(payload, revision);
	const stateDb = getNodeSqliteKysely(db);
	if (executeSqliteQuerySync(db, expectedRevision === null ? stateDb.insertInto("gateway_restart_sentinel").values(row).onConflict((conflict) => conflict.column("sentinel_key").doNothing()) : stateDb.updateTable("gateway_restart_sentinel").set(row).where("sentinel_key", "=", RESTART_SENTINEL_KEY).where("updated_at_ms", "=", expectedRevision)).numAffectedRows !== 1n) return null;
	advanceRestartSentinelRevisionFloorSync(db, revision);
	return {
		version: 1,
		payload,
		revision
	};
}
function deleteRestartSentinelRowSync(db, expectedRevision) {
	const current = readRestartSentinelRowSync(db);
	if (current.kind === "missing") return false;
	const currentRevision = current.kind === "valid" ? current.sentinel.revision : current.revision;
	if (currentRevision !== expectedRevision) return false;
	if (!Number.isSafeInteger(currentRevision)) throw new Error("Restart sentinel revision is outside the safe integer range");
	advanceRestartSentinelRevisionFloorSync(db, maxRevision(currentRevision, readRestartSentinelRevisionFloorSync(db)) ?? currentRevision);
	const query = getNodeSqliteKysely(db).deleteFrom("gateway_restart_sentinel").where("sentinel_key", "=", RESTART_SENTINEL_KEY).where("updated_at_ms", "=", expectedRevision);
	if (executeSqliteQuerySync(db, query).numAffectedRows !== 1n) throw new Error("Restart sentinel changed during guarded delete");
	return true;
}
//#endregion
export { readRestartSentinelRowForKeySync as a, writeRestartSentinelRowIfRevisionSync as c, parseRestartSentinelEnvelope as i, writeRestartSentinelRowSync as l, deleteRestartSentinelRowSync as n, readRestartSentinelRowSync as o, nextRevision as r, readRestartSentinelSnapshotSync as s, buildRestartSentinelRow as t, writeUpdateInstallReceiptRowSync as u };
