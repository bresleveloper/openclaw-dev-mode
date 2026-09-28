import "./src-CZ2wJvNB.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as safeParseJson } from "./json-coercion-C7YSvZ9t.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { i as updateRecoverySchema, n as UpdateFailureFactSchema } from "./update-run-schema-BIZkdmqf.mjs";
//#region src/infra/restart-sentinel-store.ts
const RESTART_SENTINEL_KEY = "current";
const RESTART_SENTINEL_REVISION_FLOOR_KEY = "revision-floor";
const UPDATE_INSTALL_RECEIPT_KEY = "latest-update-install";
const RESTART_SENTINEL_KINDS = /* @__PURE__ */ new Set([
	"config-apply",
	"config-auto-recovery",
	"config-patch",
	"update",
	"restart"
]);
const RESTART_SENTINEL_STATUSES = /* @__PURE__ */ new Set([
	"ok",
	"error",
	"skipped"
]);
function isFiniteNumber(value) {
	return typeof value === "number" && Number.isFinite(value);
}
function isSafeInteger(value) {
	return typeof value === "number" && Number.isSafeInteger(value);
}
function parseOptionalNullableString(record, key) {
	const value = record[key];
	if (value === void 0 || value === null || typeof value === "string") return value;
	return false;
}
function parseRestartSentinelLog(value) {
	if (!isRecord(value)) return null;
	const stdoutTail = parseOptionalNullableString(value, "stdoutTail");
	const stderrTail = parseOptionalNullableString(value, "stderrTail");
	const exitCode = value.exitCode;
	if (stdoutTail === false || stderrTail === false || exitCode !== void 0 && exitCode !== null && !isSafeInteger(exitCode)) return null;
	return {
		...stdoutTail !== void 0 ? { stdoutTail } : {},
		...stderrTail !== void 0 ? { stderrTail } : {},
		...exitCode !== void 0 ? { exitCode } : {}
	};
}
function parseRestartSentinelStep(value) {
	if (!isRecord(value) || typeof value.name !== "string" || typeof value.command !== "string") return null;
	const cwd = parseOptionalNullableString(value, "cwd");
	const durationMs = value.durationMs;
	const log = value.log;
	const advisory = value.advisory;
	if (cwd === false || durationMs !== void 0 && durationMs !== null && !isFiniteNumber(durationMs) || log !== void 0 && log !== null && !parseRestartSentinelLog(log) || advisory !== void 0 && typeof advisory !== "boolean") return null;
	const { name, command } = value;
	const facts = UpdateFailureFactSchema.array().max(5).safeParse(value.failureFacts);
	return {
		name,
		command,
		...facts.success ? { failureFacts: facts.data } : {},
		...cwd !== void 0 ? { cwd } : {},
		...durationMs !== void 0 ? { durationMs } : {},
		...log !== void 0 ? { log: log === null ? null : parseRestartSentinelLog(log) } : {},
		...advisory !== void 0 ? { advisory } : {}
	};
}
function parseRestartSentinelStats(value) {
	if (!isRecord(value)) return null;
	const mode = parseOptionalNullableString(value, "mode");
	const root = parseOptionalNullableString(value, "root");
	const target = parseOptionalNullableString(value, "target");
	const handoffId = parseOptionalNullableString(value, "handoffId");
	const runId = parseOptionalNullableString(value, "runId");
	const reason = parseOptionalNullableString(value, "reason");
	const before = value.before;
	const after = value.after;
	const steps = value.steps;
	const durationMs = value.durationMs;
	const recovery = value.recovery === void 0 ? void 0 : updateRecoverySchema.safeParse(value.recovery);
	if (mode === false || mode === null || root === false || root === null || target === false || target === null || handoffId === false || handoffId === null || runId === false || runId === null || reason === false || value.requiresRestart !== void 0 && typeof value.requiresRestart !== "boolean" || before !== void 0 && before !== null && !isRecord(before) || after !== void 0 && after !== null && !isRecord(after) || steps !== void 0 && (!Array.isArray(steps) || steps.some((step) => !parseRestartSentinelStep(step))) || durationMs !== void 0 && durationMs !== null && !isFiniteNumber(durationMs)) return null;
	return {
		...recovery?.success ? { recovery: recovery.data } : {},
		...mode !== void 0 ? { mode } : {},
		...root !== void 0 ? { root } : {},
		...target !== void 0 ? { target } : {},
		...value.requiresRestart !== void 0 ? { requiresRestart: value.requiresRestart } : {},
		...handoffId !== void 0 ? { handoffId } : {},
		...runId !== void 0 ? { runId } : {},
		...before !== void 0 ? { before } : {},
		...after !== void 0 ? { after } : {},
		...steps !== void 0 ? { steps: steps.map((step) => parseRestartSentinelStep(step)) } : {},
		...reason !== void 0 ? { reason } : {},
		...durationMs !== void 0 ? { durationMs } : {}
	};
}
function parseRestartSentinelContinuation(value) {
	if (!isRecord(value)) return null;
	if (value.kind === "systemEvent" && typeof value.text === "string") return {
		kind: "systemEvent",
		text: value.text
	};
	if (value.kind === "agentTurn" && typeof value.message === "string") return {
		kind: "agentTurn",
		message: value.message
	};
	return null;
}
function parseRestartSentinelPayload(value) {
	if (!isRecord(value) || !RESTART_SENTINEL_KINDS.has(value.kind) || !RESTART_SENTINEL_STATUSES.has(value.status) || !isSafeInteger(value.ts)) return null;
	const sessionKey = parseOptionalNullableString(value, "sessionKey");
	const threadId = parseOptionalNullableString(value, "threadId");
	const message = parseOptionalNullableString(value, "message");
	const doctorHint = parseOptionalNullableString(value, "doctorHint");
	if (sessionKey === false || sessionKey === null || threadId === false || threadId === null || message === false || doctorHint === false) return null;
	let deliveryContext;
	if (value.deliveryContext !== void 0) {
		if (!isRecord(value.deliveryContext)) return null;
		const channel = parseOptionalNullableString(value.deliveryContext, "channel");
		const to = parseOptionalNullableString(value.deliveryContext, "to");
		const accountId = parseOptionalNullableString(value.deliveryContext, "accountId");
		if (channel === false || channel === null || to === false || to === null || accountId === false || accountId === null) return null;
		deliveryContext = {
			...channel !== void 0 ? { channel } : {},
			...to !== void 0 ? { to } : {},
			...accountId !== void 0 ? { accountId } : {}
		};
	}
	let continuation;
	if (value.continuation !== void 0) {
		continuation = value.continuation === null ? null : parseRestartSentinelContinuation(value.continuation);
		if (continuation === null && value.continuation !== null) return null;
	}
	let stats;
	if (value.stats !== void 0) {
		stats = value.stats === null ? null : parseRestartSentinelStats(value.stats);
		if (stats === null && value.stats !== null) return null;
	}
	return {
		kind: value.kind,
		status: value.status,
		ts: value.ts,
		...sessionKey !== void 0 ? { sessionKey } : {},
		...deliveryContext !== void 0 && Object.keys(deliveryContext).length > 0 ? { deliveryContext } : {},
		...threadId !== void 0 ? { threadId } : {},
		...message !== void 0 && message !== null ? { message } : {},
		...continuation !== void 0 && continuation !== null ? { continuation } : {},
		...doctorHint !== void 0 && doctorHint !== null ? { doctorHint } : {},
		...stats !== void 0 && stats !== null ? { stats } : {}
	};
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
function readUpdateInstallReceiptRowSync(db) {
	const current = readRestartSentinelRowForKeySync(db, UPDATE_INSTALL_RECEIPT_KEY);
	return current.kind === "valid" ? current.sentinel : null;
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
export { readRestartSentinelRowForKeySync as a, readUpdateInstallReceiptRowSync as c, writeUpdateInstallReceiptRowSync as d, parseRestartSentinelEnvelope as i, writeRestartSentinelRowIfRevisionSync as l, deleteRestartSentinelRowSync as n, readRestartSentinelRowSync as o, nextRevision as r, readRestartSentinelSnapshotSync as s, buildRestartSentinelRow as t, writeRestartSentinelRowSync as u };
