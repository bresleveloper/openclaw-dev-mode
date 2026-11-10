import "./src-Djeo9OvP.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as safeParseJson } from "./json-coercion-pfKbZnCJ.mjs";
import { t as gitCommitPrefixesMatch } from "./git-commit-CtMnYvhe.mjs";
import { ni as NEVER } from "./json-schema-processors-C6KO_BFy.mjs";
import { Et as _enum, Fn as object, Jn as string, Kt as custom, Lt as boolean, Pn as number, Yt as discriminatedUnion, xn as literal } from "./schemas-BOYIvvln.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { a as deferSqliteWorkerCommitReceipt, f as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { n as UpdateFailureFactSchema } from "./update-run-schema-CY2FAM7T.mjs";
import { n as updateRecoverySchema } from "./update-recovery-BLzKrbsf.mjs";
import { a as parseUpdateFailureReportReceipt, i as isValidTerminalReceipt } from "./update-failure-report-receipt-Bx33fJze.mjs";
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
//#region src/infra/update-failure-report-receipt-store.ts
const RECEIPT_KEY_PREFIX = "update-failure-report:";
const PREPARING_RECEIPT_STALE_AFTER_MS = 12e4;
const ARTIFACT_SWEEP_STALE_AFTER_MS = 12e4;
function retainedArtifactSweep(receipt) {
	return receipt.artifactSweep ? { artifactSweep: receipt.artifactSweep } : {};
}
function receiptKey(attemptId) {
	return `${RECEIPT_KEY_PREFIX}${sha256Hex(attemptId)}`;
}
function parseReceipt(sentinel) {
	if (sentinel?.payload.kind !== "update" || sentinel.payload.status !== "skipped" || sentinel.payload.stats?.reason !== "update-failure-report-receipt" || typeof sentinel.payload.message !== "string") return null;
	const value = safeParseJson(sentinel.payload.message);
	return parseUpdateFailureReportReceipt(value);
}
/** Reads one existing report receipt without creating state. */
function readUpdateFailureReportReceiptRowSync(db, attemptId) {
	const current = readRestartSentinelRowForKeySync(db, receiptKey(attemptId));
	return parseReceipt(current.kind === "valid" ? current.sentinel : null);
}
function buildReceiptPayload(receipt) {
	return {
		kind: "update",
		status: "skipped",
		ts: Date.now(),
		message: JSON.stringify(receipt),
		stats: { reason: "update-failure-report-receipt" }
	};
}
function replaceReceiptAtRevision(db, sentinelKey, revision, receipt) {
	const row = buildRestartSentinelRow(buildReceiptPayload(receipt), nextRevision(revision), sentinelKey);
	const stateDb = getNodeSqliteKysely(db);
	return executeSqliteQuerySync(db, stateDb.updateTable("gateway_restart_sentinel").set(row).where("sentinel_key", "=", sentinelKey).where("updated_at_ms", "=", revision)).numAffectedRows === 1n;
}
function mutateReceipt(db, attemptId, update) {
	const sentinelKey = receiptKey(attemptId);
	const current = readRestartSentinelRowForKeySync(db, sentinelKey);
	const receipt = parseReceipt(current.kind === "valid" ? current.sentinel : null);
	if (current.kind !== "valid" || !receipt) return false;
	const next = update(receipt);
	return next && replaceReceiptAtRevision(db, sentinelKey, current.sentinel.revision, next);
}
/** Atomically owns one report attempt in the canonical state database. */
function reserveUpdateFailureReportReceiptRowSync(db, attemptId, reservationId, previewDigest) {
	const sentinelKey = receiptKey(attemptId);
	const stateDb = getNodeSqliteKysely(db);
	const nowMs = Date.now();
	const receipt = {
		preparingSinceMs: nowMs,
		previewDigest,
		reservationId,
		status: "preparing"
	};
	const row = buildRestartSentinelRow(buildReceiptPayload(receipt), nowMs, sentinelKey);
	if (executeSqliteQuerySync(db, stateDb.insertInto("gateway_restart_sentinel").values(row).onConflict((conflict) => conflict.column("sentinel_key").doNothing())).numAffectedRows === 1n) return {
		receipt,
		reserved: true
	};
	const current = readRestartSentinelRowForKeySync(db, sentinelKey);
	const currentReceipt = parseReceipt(current.kind === "valid" ? current.sentinel : null);
	if (current.kind === "valid" && currentReceipt?.status === "retryable" && currentReceipt.cleanup === void 0 && currentReceipt.replacementReady === true && currentReceipt.sweepOwnerId === void 0) {
		const replacement = {
			preparingSinceMs: nowMs,
			previewDigest,
			...retainedArtifactSweep(currentReceipt),
			reservationId,
			status: "preparing"
		};
		return replaceReceiptAtRevision(db, sentinelKey, current.sentinel.revision, replacement) ? {
			receipt: replacement,
			reserved: true
		} : {
			receipt: readUpdateFailureReportReceiptRowSync(db, attemptId),
			reserved: false
		};
	}
	return {
		receipt: currentReceipt,
		reserved: false
	};
}
/** CAS-refreshes one owned, definitely-unstarted phase before fallback publication. */
function refreshUpdateFailureReportReceiptPreparationRowSync(db, attemptId, reservationId) {
	return mutateReceipt(db, attemptId, (currentReceipt) => {
		if (currentReceipt.status !== "prepared" && currentReceipt.status !== "pending" || currentReceipt.sweepOwnerId !== void 0 || currentReceipt.reservationId !== reservationId) return false;
		return {
			...currentReceipt.previewDigest ? { previewDigest: currentReceipt.previewDigest } : {},
			...retainedArtifactSweep(currentReceipt),
			reservationId,
			status: currentReceipt.status,
			...currentReceipt.status === "prepared" ? { preparingSinceMs: Date.now() } : {}
		};
	});
}
function preparationTransition(status) {
	const priorStatus = status === "prepared" ? "preparing" : "prepared";
	return (db, attemptId, reservationId, previewDigest) => mutateReceipt(db, attemptId, (currentReceipt) => {
		if (currentReceipt.status !== priorStatus || currentReceipt.sweepOwnerId !== void 0 || currentReceipt.reservationId !== reservationId || currentReceipt.previewDigest !== previewDigest) return false;
		return {
			...status === "prepared" ? { preparingSinceMs: Date.now() } : {},
			previewDigest,
			...retainedArtifactSweep(currentReceipt),
			reservationId,
			status
		};
	});
}
/** Fences final artifact publication behind one process-owned preparation. */
const markUpdateFailureReportReceiptPreparedRowSync = preparationTransition("prepared");
/** Makes one published preparation ambiguity-safe immediately before issue creation starts. */
const markUpdateFailureReportReceiptPendingRowSync = preparationTransition("pending");
/** Finalizes only a process-owned reservation in the required prior phase. */
function finalizeUpdateFailureReportReceiptRowSync(db, attemptId, receipt) {
	if (!isValidTerminalReceipt(receipt)) return false;
	return mutateReceipt(db, attemptId, (currentReceipt) => {
		if (currentReceipt.sweepOwnerId !== void 0 || (receipt.status === "fallback" || receipt.status === "retryable" ? currentReceipt.status !== "prepared" && currentReceipt.status !== "pending" : currentReceipt.status !== "pending") || currentReceipt.reservationId !== receipt.reservationId || currentReceipt.previewDigest === void 0 || currentReceipt.previewDigest !== receipt.previewDigest) return false;
		return {
			...receipt,
			...retainedArtifactSweep(currentReceipt)
		};
	});
}
/** Records post-commit cleanup intent without performing filesystem work in SQLite. */
function beginUpdateFailureReportReceiptCleanupRowSync(db, attemptId, reservationId) {
	return mutateReceipt(db, attemptId, (currentReceipt) => {
		if (currentReceipt.sweepOwnerId !== void 0 || currentReceipt.status !== "preparing" && currentReceipt.status !== "prepared" && currentReceipt.status !== "retryable" || currentReceipt.cleanup !== void 0 || currentReceipt.reservationId !== reservationId) return false;
		return {
			cleanup: "pending",
			...currentReceipt.previewDigest ? { previewDigest: currentReceipt.previewDigest } : {},
			...retainedArtifactSweep(currentReceipt),
			reservationId,
			status: "retryable"
		};
	});
}
/** Atomically transfers an expired preparation into durable cleanup custody. */
function beginStaleUpdateFailureReportReceiptCleanupRowSync(db, attemptId, reservationId) {
	return mutateReceipt(db, attemptId, (currentReceipt) => {
		const nowMs = Date.now();
		if (currentReceipt.sweepOwnerId !== void 0 || currentReceipt.status !== "preparing" && currentReceipt.status !== "prepared" || currentReceipt.preparingSinceMs === void 0 || currentReceipt.preparingSinceMs > nowMs - PREPARING_RECEIPT_STALE_AFTER_MS || currentReceipt.reservationId !== reservationId || !currentReceipt.previewDigest) return false;
		return {
			artifactSweep: "pending",
			cleanup: "pending",
			previewDigest: currentReceipt.previewDigest,
			reservationId,
			status: "retryable"
		};
	});
}
/** Serializes one attempt-wide retired-artifact sweep against successor publication. */
function claimUpdateFailureReportArtifactSweepRowSync(db, attemptId, expectedReservationId, sweepOwnerId, sweepGeneration) {
	return mutateReceipt(db, attemptId, (currentReceipt) => {
		const nowMs = Date.now();
		if (currentReceipt.artifactSweep !== "pending" || currentReceipt.reservationId !== expectedReservationId || currentReceipt.sweepOwnerId !== void 0 && currentReceipt.sweepSinceMs !== void 0 && currentReceipt.sweepSinceMs > nowMs - ARTIFACT_SWEEP_STALE_AFTER_MS) return false;
		return {
			...currentReceipt,
			sweepGeneration,
			sweepOwnerId,
			sweepSinceMs: nowMs
		};
	});
}
/** Releases only the exact attempt-wide artifact sweep lease held by this worker. */
function releaseUpdateFailureReportArtifactSweepRowSync(db, attemptId, expectedReservationId, sweepOwnerId, sweepGeneration) {
	return mutateReceipt(db, attemptId, (currentReceipt) => {
		if (currentReceipt.reservationId !== expectedReservationId || currentReceipt.sweepOwnerId !== sweepOwnerId || currentReceipt.sweepGeneration !== sweepGeneration) return false;
		const { sweepGeneration: _generation, sweepOwnerId: _owner, sweepSinceMs: _since, ...released } = currentReceipt;
		return released;
	});
}
/** Completes one idempotent artifact cleanup after the cleanup intent has committed. */
function completeUpdateFailureReportReceiptCleanupRowSync(db, attemptId, reservationId) {
	const sentinelKey = receiptKey(attemptId);
	const current = readRestartSentinelRowForKeySync(db, sentinelKey);
	const currentReceipt = parseReceipt(current.kind === "valid" ? current.sentinel : null);
	if (current.kind !== "valid" || !currentReceipt || currentReceipt.cleanup !== "pending" || currentReceipt.sweepOwnerId !== void 0 || currentReceipt.reservationId !== reservationId) return false;
	const stateDb = getNodeSqliteKysely(db);
	if (currentReceipt.status === "retryable") {
		if (currentReceipt.artifactSweep) {
			const completed = {
				artifactSweep: currentReceipt.artifactSweep,
				...currentReceipt.previewDigest ? { previewDigest: currentReceipt.previewDigest } : {},
				replacementReady: true,
				reservationId,
				status: "retryable"
			};
			return replaceReceiptAtRevision(db, sentinelKey, current.sentinel.revision, completed);
		}
		return executeSqliteQuerySync(db, stateDb.deleteFrom("gateway_restart_sentinel").where("sentinel_key", "=", sentinelKey).where("updated_at_ms", "=", current.sentinel.revision)).numAffectedRows === 1n;
	}
	if (currentReceipt.status !== "created" || !currentReceipt.url) return false;
	const completed = {
		...currentReceipt.previewDigest ? { previewDigest: currentReceipt.previewDigest } : {},
		...retainedArtifactSweep(currentReceipt),
		reservationId,
		status: "created",
		...currentReceipt.url ? { url: currentReceipt.url } : {}
	};
	return replaceReceiptAtRevision(db, sentinelKey, current.sentinel.revision, completed);
}
//#endregion
//#region src/infra/restart-sentinel.worker.ts
function transaction(label, operation) {
	return (input, { writeAdmitted }) => writeAdmitted(({ db }) => operation(db, input), { operationLabel: label });
}
function receiptTransaction(label, operation) {
	return (input, { write }) => write(({ db }) => {
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: void 0
		});
		const result = operation(db, input);
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: void 0
		});
		deferSqliteWorkerCommitReceipt(db, {
			kind: "update-report-result",
			value: result
		});
		return result;
	}, { operationLabel: label });
}
const restartSentinelOperations = {
	"restartSentinel.reserve": receiptTransaction("update-failure-report.reserve", (db, input) => reserveUpdateFailureReportReceiptRowSync(db, input.attemptId, input.reservationId, input.previewDigest)),
	"restartSentinel.beginCleanup": receiptTransaction("update-failure-report.beginCleanup", (db, input) => beginUpdateFailureReportReceiptCleanupRowSync(db, input.attemptId, input.reservationId)),
	"restartSentinel.beginStaleCleanup": receiptTransaction("update-failure-report.beginStaleCleanup", (db, input) => beginStaleUpdateFailureReportReceiptCleanupRowSync(db, input.attemptId, input.reservationId)),
	"restartSentinel.completeCleanup": receiptTransaction("update-failure-report.completeCleanup", (db, input) => completeUpdateFailureReportReceiptCleanupRowSync(db, input.attemptId, input.reservationId)),
	"restartSentinel.claimSweep": receiptTransaction("update-failure-report.claimSweep", (db, input) => claimUpdateFailureReportArtifactSweepRowSync(db, input.attemptId, input.expectedReservationId, input.sweepOwnerId, input.sweepGeneration)),
	"restartSentinel.releaseSweep": receiptTransaction("update-failure-report.releaseSweep", (db, input) => releaseUpdateFailureReportArtifactSweepRowSync(db, input.attemptId, input.expectedReservationId, input.sweepOwnerId, input.sweepGeneration)),
	"restartSentinel.refreshPreparation": receiptTransaction("update-failure-report.refreshPreparation", (db, input) => refreshUpdateFailureReportReceiptPreparationRowSync(db, input.attemptId, input.reservationId)),
	"restartSentinel.finalizeReceipt": receiptTransaction("update-failure-report.finalizeReceipt", (db, input) => finalizeUpdateFailureReportReceiptRowSync(db, input.attemptId, input.receipt)),
	"restartSentinel.markPending": receiptTransaction("update-failure-report.markPending", (db, input) => markUpdateFailureReportReceiptPendingRowSync(db, input.attemptId, input.reservationId, input.previewDigest)),
	"restartSentinel.markPrepared": receiptTransaction("update-failure-report.markPrepared", (db, input) => markUpdateFailureReportReceiptPreparedRowSync(db, input.attemptId, input.reservationId, input.previewDigest)),
	"restartSentinel.admit": (_input, { open }) => {
		open();
	},
	"restartSentinel.write": transaction("restart-sentinel.write", (db, payload) => writeRestartSentinelRowSync(db, payload)),
	"restartSentinel.writeIfUnchanged": transaction("restart-sentinel.write-if-unchanged", (db, input) => {
		const current = readRestartSentinelSnapshotSync(db);
		return current.state.kind !== "invalid" && current.revision === input.expectedRevision ? writeRestartSentinelRowSync(db, input.payload) : null;
	}),
	"restartSentinel.markFailure": transaction("restart-sentinel.mark-failure", (db, input) => {
		const current = readRestartSentinelRowSync(db);
		if (current.kind !== "valid") return null;
		const payload = current.sentinel.payload;
		if (payload.kind !== "update" || input.expectedOwner?.runId !== void 0 && payload.stats?.runId !== input.expectedOwner.runId || input.expectedOwner?.handoffId !== void 0 && payload.stats?.handoffId !== input.expectedOwner.handoffId) return null;
		delete payload.continuation;
		payload.status = "error";
		payload.stats = {
			...payload.stats,
			reason: input.reason
		};
		return writeRestartSentinelRowIfRevisionSync(db, payload, current.sentinel.revision);
	}),
	"restartSentinel.clear": transaction("restart-sentinel.clear-if-revision", deleteRestartSentinelRowSync),
	"restartSentinel.finalize": transaction("restart-sentinel.finalize-running-install", (db, input) => {
		const { version, commit, expectedRoot, actualRoot } = input;
		const current = readRestartSentinelRowSync(db);
		if (current.kind !== "valid" || current.sentinel.revision !== input.expectedRevision || current.sentinel.payload.kind !== "update") return {
			sentinel: null,
			installReceipt: null
		};
		const payload = current.sentinel.payload;
		const stats = payload.stats ? { ...payload.stats } : {};
		const after = isRecord(stats.after) ? { ...stats.after } : {};
		let changed = false;
		if (after.version !== version) {
			after.version = version;
			changed = true;
		}
		if (expectedRoot && stats.root !== expectedRoot) {
			stats.root = expectedRoot;
			changed = true;
		}
		const before = isRecord(stats.before) ? stats.before : {};
		const beforeSha = typeof before.sha === "string" ? before.sha.trim() : "";
		const expectedSha = typeof after.sha === "string" ? after.sha.trim() : "";
		const actualSha = commit?.trim() ?? "";
		const verifiesGitRevision = stats.mode !== "git" || expectedSha.length > 0 && gitCommitPrefixesMatch(expectedSha, actualSha);
		const verifiesInstallRoot = expectedRoot !== null && actualRoot !== null && expectedRoot === actualRoot;
		const changedInstall = stats.mode !== "git" || beforeSha.length > 0 && expectedSha.length > 0 && !gitCommitPrefixesMatch(beforeSha, expectedSha);
		if (payload.status === "ok" && expectedRoot && !verifiesInstallRoot) {
			payload.status = "error";
			stats.reason = actualRoot ? "restart-root-mismatch" : "restart-root-unavailable";
			delete payload.continuation;
			changed = true;
		} else if (payload.status === "ok" && stats.mode === "git" && expectedSha && !verifiesGitRevision) {
			payload.status = "error";
			stats.reason = actualSha ? "restart-revision-mismatch" : "restart-revision-unavailable";
			delete payload.continuation;
			changed = true;
		}
		stats.after = after;
		payload.stats = stats;
		const finalized = changed ? writeRestartSentinelRowIfRevisionSync(db, payload, current.sentinel.revision) : current.sentinel;
		if (!finalized) return {
			sentinel: null,
			installReceipt: null
		};
		return {
			sentinel: changed ? finalized : null,
			installReceipt: stats.mode === "git" && verifiesInstallRoot && verifiesGitRevision && changedInstall ? finalized : null
		};
	}),
	"restartSentinel.recordInstall": transaction("restart-sentinel.record-install", (db, receipt) => {
		const current = readRestartSentinelRowSync(db);
		if (current.kind === "valid" && current.sentinel.revision === receipt.revision) writeUpdateInstallReceiptRowSync(db, receipt.payload);
	})
};
//#endregion
export { restartSentinelOperations };
