import { i as isPidDefinitelyDead, t as getFileLockProcessStartTime } from "./pid-alive-CXdZEzr_.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { tt as OPENCLAW_STATE_SCHEMA_SQL } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import { c as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BFK9cMiV.mjs";
import { d as readAgentDatabaseAdmissionRefusal } from "./agent-database-admission-BFwcs62N.mjs";
import { a as loadCronRows, o as loadedCronStoreFromRows } from "./row-codec-mXerryYi.mjs";
import { n as deleteExecutionOwnerLifecycleMetadata, t as bindExecutionOwnerLifecycleMetadata } from "./execution-owner-lifecycle-binding-store-CzRkIAqs.mjs";
import { t as cronStoreKey } from "./key-BBZ40bDq.mjs";
import { t as resolveCronJobConfigRevision } from "./config-revision-DtL_Z8FS.mjs";
import { toUSVString } from "node:util";
import crypto from "node:crypto";
//#region src/cron/agent-availability.ts
function describeUnavailableCronAgent(agentId, env) {
	const refusal = readAgentDatabaseAdmissionRefusal(agentId, { env });
	return refusal ? `${refusal.reason}\n${refusal.repairHint}` : `cron job agent is unavailable: ${agentId}`;
}
//#endregion
//#region src/cron/store/run-receipt-read.ts
function isReceiptStatus(value) {
	return value === "running" || value === "ok" || value === "error" || value === "skipped" || value === "interrupted" || value === "superseded";
}
function receiptFromRow(row) {
	if (!isReceiptStatus(row.status)) throw new Error(`invalid cron run receipt status ${row.status}`);
	return {
		receiptId: row.receipt_id,
		storeKey: row.store_key,
		jobId: row.job_id,
		configRevision: row.config_revision,
		agentId: row.agent_id,
		...row.request_run_id ? { requestRunId: row.request_run_id } : {},
		status: row.status,
		ownerPid: row.owner_pid,
		ownerStartTime: row.owner_start_time,
		startedAtMs: row.started_at_ms,
		finishedAtMs: row.finished_at_ms,
		...row.error_text ? { error: row.error_text } : {}
	};
}
function receiptHandle(receipt) {
	return {
		receiptId: receipt.receiptId,
		storeKey: receipt.storeKey,
		jobId: receipt.jobId,
		configRevision: receipt.configRevision,
		agentId: receipt.agentId,
		ownerPid: receipt.ownerPid,
		ownerStartTime: receipt.ownerStartTime,
		startedAtMs: receipt.startedAtMs
	};
}
//#endregion
//#region src/cron/store/run-receipt-store.ts
const CRON_RUN_RECEIPT_SCHEMA_START = "CREATE TABLE IF NOT EXISTS cron_run_receipts (";
const CRON_RUN_RECEIPT_SCHEMA_END = "ON cron_run_receipts(store_key, job_id, started_at_ms DESC, receipt_id DESC);";
const CRON_RUN_RECEIPT_TERMINAL_RETENTION = 64;
const CRON_RUN_RECEIPT_DELETE_BATCH_SIZE = 500;
const CRON_RUN_RECEIPT_FINISH_RETRY_MS = 1e3;
/** Recovery horizon for abandoned markers and unverifiable foreign receipts. */
const CRON_STUCK_RUN_MS = 72e5;
const initializedDatabases = /* @__PURE__ */ new WeakSet();
const locallyOwnedReceipts = /* @__PURE__ */ new Set();
const pendingReceiptSettlements = /* @__PURE__ */ new Map();
const pendingReceiptFinishRetries = /* @__PURE__ */ new Map();
var CronRunReceiptConflictError = class extends Error {
	constructor(receipt) {
		super(`cron job ${receipt.jobId} is already running in process ${receipt.ownerPid}`);
		this.receipt = receipt;
		this.name = "CronRunReceiptConflictError";
		this.candidate = receiptHandle(receipt);
	}
};
var CronRunReceiptRevisionError = class extends Error {
	constructor(receiptId, message = "cron run configuration changed", reason = "revision-changed") {
		super(message);
		this.receiptId = receiptId;
		this.reason = reason;
		this.name = "CronRunReceiptRevisionError";
	}
};
function ensureCronRunReceiptSchema(database) {
	const start = OPENCLAW_STATE_SCHEMA_SQL.indexOf(CRON_RUN_RECEIPT_SCHEMA_START);
	const endMarker = OPENCLAW_STATE_SCHEMA_SQL.indexOf(CRON_RUN_RECEIPT_SCHEMA_END, start);
	if (start < 0 || endMarker < start) throw new Error("OpenClaw cron run receipt schema marker is missing.");
	database.exec(OPENCLAW_STATE_SCHEMA_SQL.slice(start, endMarker + 77));
}
function query(database) {
	return getNodeSqliteKysely(database);
}
function activeRow(db, key, jobId) {
	const find = () => {
		const active = query(db).selectFrom("cron_run_receipts").where("store_key", "=", key).where("status", "=", "running");
		return jobId === void 0 ? executeSqliteQuerySync(db, active.select("job_id")).rows : executeSqliteQueryTakeFirstSync(db, active.selectAll().where("job_id", "=", jobId));
	};
	try {
		return find();
	} catch (error) {
		if (!(error instanceof Error) || error.message !== "no such table: cron_run_receipts") throw error;
		ensureCronRunReceiptSchema(db);
		return find();
	}
}
function withReceiptWrite(operationLabel, options, operation) {
	let initializedDatabase;
	const result = runOpenClawStateWriteTransaction(({ db }) => {
		if (!initializedDatabases.has(db)) {
			ensureCronRunReceiptSchema(db);
			initializedDatabase = db;
		}
		return operation(db);
	}, options, { operationLabel });
	if (initializedDatabase) initializedDatabases.add(initializedDatabase);
	return result;
}
/** Binds the exact admitted execution to its authoritative receipt without changing lifecycle. */
function bindCronRunReceiptExecutionInDatabase(database, handle, binding) {
	ensureCronRunReceiptSchema(database);
	try {
		assertCronRunReceiptOwnedInDatabase({
			database,
			handle
		});
	} catch (error) {
		if (!(error instanceof CronRunReceiptRevisionError)) throw error;
		return "missing";
	}
	return bindExecutionOwnerLifecycleMetadata({
		db: database,
		ownerKind: "cron",
		ownerId: handle.receiptId,
		binding
	});
}
function currentJob(database, storeKey, jobId) {
	const rows = loadCronRows(database, storeKey, /* @__PURE__ */ new Set([jobId]));
	return loadedCronStoreFromRows(rows).store.jobs[0];
}
function sameOwner(left, right) {
	return left.receipt_id === right.receiptId && left.owner_pid === right.ownerPid && left.owner_start_time === right.ownerStartTime && left.started_at_ms === right.startedAtMs;
}
function observeOwner(row) {
	return {
		receiptId: row.receipt_id,
		ownerPid: row.owner_pid,
		ownerStartTime: row.owner_start_time,
		startedAtMs: row.started_at_ms
	};
}
function ownerStale(owner, nowMs = Date.now()) {
	if (owner.ownerPid === process.pid) return !locallyOwnedReceipts.has(owner.receiptId);
	if (isPidDefinitelyDead(owner.ownerPid)) return true;
	const observedStartTime = getFileLockProcessStartTime(owner.ownerPid);
	if (owner.ownerStartTime !== null && observedStartTime !== null) return owner.ownerStartTime !== observedStartTime;
	return nowMs - owner.startedAtMs > CRON_STUCK_RUN_MS;
}
function validateCurrentJob(params) {
	const job = currentJob(params.database, params.handle.storeKey, params.handle.jobId);
	if (!job) throw new CronRunReceiptRevisionError(params.handle.receiptId, "cron job was removed");
	if (params.resolveAgentId(job) !== params.handle.agentId) throw new CronRunReceiptRevisionError(params.handle.receiptId);
	return job;
}
function pruneTerminalReceipts(database, storeKey, jobId, job) {
	const pendingReceiptId = job?.state.runningAtMs === void 0 ? void 0 : job.state.runningReceiptId;
	let terminalQuery = query(database).selectFrom("cron_run_receipts").select("receipt_id").where("store_key", "=", storeKey).where("job_id", "=", jobId).where("status", "!=", "running");
	if (typeof pendingReceiptId === "string" && toUSVString(pendingReceiptId) === pendingReceiptId) terminalQuery = terminalQuery.orderBy((eb) => eb.case().when("receipt_id", "=", pendingReceiptId).then(1).else(0).end(), "desc");
	const terminalIds = executeSqliteQuerySync(database, terminalQuery.orderBy("finished_at_ms", "desc").orderBy("started_at_ms", "desc").orderBy("receipt_id", "desc").limit(-1).offset(CRON_RUN_RECEIPT_TERMINAL_RETENTION)).rows;
	for (let index = 0; index < terminalIds.length; index += CRON_RUN_RECEIPT_DELETE_BATCH_SIZE) {
		const receiptIds = terminalIds.slice(index, index + CRON_RUN_RECEIPT_DELETE_BATCH_SIZE).map((row) => row.receipt_id);
		deleteExecutionOwnerLifecycleMetadata({
			db: database,
			ownerKind: "cron",
			ownerIds: receiptIds
		});
		executeSqliteQuerySync(database, query(database).deleteFrom("cron_run_receipts").where("store_key", "=", storeKey).where("job_id", "=", jobId).where("status", "!=", "running").where("receipt_id", "in", receiptIds));
	}
}
/** Prepares process liveness facts before the caller enters its commit transaction. */
function prepareCronRunReceiptAdjudication(params) {
	const storeKey = cronStoreKey(params.storePath);
	const observed = withReceiptWrite("cron.run-receipt.inspect", params.env ? { env: params.env } : {}, (database) => activeRow(database, storeKey, params.jobId));
	return {
		storeKey,
		...observed ? { observed: observeOwner(observed) } : {},
		observedStale: observed ? ownerStale(observeOwner(observed), params.nowMs) : false
	};
}
function prepareCronRunReceiptClaim(params) {
	const ownerStartTime = getFileLockProcessStartTime(process.pid);
	if (ownerStartTime === null) throw new Error("cron run cannot acquire a durable fence without process start identity");
	const adjudication = prepareCronRunReceiptAdjudication({
		storePath: params.storePath,
		jobId: params.job.id,
		nowMs: params.startedAtMs,
		env: params.env
	});
	const storeKey = cronStoreKey(params.storePath);
	return {
		handle: {
			receiptId: crypto.randomUUID(),
			storeKey,
			jobId: params.job.id,
			configRevision: resolveCronJobConfigRevision(params.job),
			agentId: params.agentId,
			ownerPid: process.pid,
			ownerStartTime,
			startedAtMs: params.startedAtMs
		},
		...adjudication,
		...params.requestRunId ? { requestRunId: params.requestRunId } : {}
	};
}
/** Rechecks the owner and phase start so activation invalidates an age-based stale decision. */
function adjudicateActiveCronRunReceiptInDatabase(params) {
	const current = activeRow(params.database, params.prepared.storeKey, params.jobId);
	if (!current) return;
	if (params.prepared.observed && params.prepared.observedStale && sameOwner(current, params.prepared.observed)) {
		executeSqliteQuerySync(params.database, query(params.database).updateTable("cron_run_receipts").set({
			status: "interrupted",
			finished_at_ms: params.finishedAtMs,
			error_text: "cron: job interrupted because owner is unavailable"
		}).where("receipt_id", "=", current.receipt_id).where("status", "=", "running"));
		return;
	}
	throw new CronRunReceiptConflictError(receiptFromRow(current));
}
/** Claims the receipt inside the caller's synchronous cron-state transaction. */
function claimCronRunReceiptInDatabase(params) {
	const { handle } = params.prepared;
	if (handle.ownerStartTime === null) throw new Error("cron run cannot acquire a durable fence without process start identity");
	adjudicateActiveCronRunReceiptInDatabase({
		database: params.database,
		jobId: handle.jobId,
		prepared: params.prepared,
		finishedAtMs: handle.startedAtMs
	});
	const job = validateCurrentJob({
		database: params.database,
		handle,
		resolveAgentId: params.resolveAgentId
	});
	pruneTerminalReceipts(params.database, handle.storeKey, handle.jobId, job);
	executeSqliteQuerySync(params.database, query(params.database).insertInto("cron_run_receipts").values({
		receipt_id: handle.receiptId,
		store_key: handle.storeKey,
		job_id: handle.jobId,
		config_revision: handle.configRevision,
		agent_id: handle.agentId,
		request_run_id: params.prepared.requestRunId ?? null,
		status: "running",
		owner_pid: handle.ownerPid,
		owner_start_time: handle.ownerStartTime,
		started_at_ms: handle.startedAtMs,
		finished_at_ms: null,
		error_text: null
	}));
	const claimed = receiptHandle(receiptFromRow(activeRow(params.database, handle.storeKey, handle.jobId)));
	locallyOwnedReceipts.add(claimed.receiptId);
	return claimed;
}
function findActiveCronRunReceiptInDatabase(params) {
	const row = activeRow(params.database, cronStoreKey(params.storePath), params.jobId);
	return row ? receiptHandle(receiptFromRow(row)) : void 0;
}
function listActiveCronRunReceiptJobIdsInDatabase(database, storePath) {
	return new Set(activeRow(database, cronStoreKey(storePath)).map((row) => row.job_id));
}
function exactCronRunReceiptMatches(current, proposed) {
	return current?.receiptId === proposed.receiptId && current.ownerPid === proposed.ownerPid && current.ownerStartTime === proposed.ownerStartTime && current.storeKey === proposed.storeKey && current.jobId === proposed.jobId && current.startedAtMs === proposed.startedAtMs;
}
function isCronRunReceiptOwnerStale(candidate, nowMs = Date.now()) {
	return ownerStale(candidate, nowMs);
}
/** Synchronous transaction guard used immediately before a run side effect or state write. */
function assertCronRunReceiptOwnedInDatabase(params) {
	const current = activeRow(params.database, params.handle.storeKey, params.handle.jobId);
	if (!current || current.receipt_id !== params.handle.receiptId || current.owner_pid !== params.handle.ownerPid || current.owner_start_time !== params.handle.ownerStartTime) throw new CronRunReceiptRevisionError(params.handle.receiptId, "cron run fence is no longer current");
}
/** Synchronous transaction guard used immediately before a run side effect or state write. */
function assertCronRunReceiptCurrentInDatabase(params) {
	assertCronRunReceiptOwnedInDatabase(params);
	validateCurrentJob({
		database: params.database,
		handle: params.handle,
		resolveAgentId: params.resolveAgentId
	});
}
/** Advances a queued lease to its execution start inside the marker transaction. */
function activateCronRunReceiptInDatabase(params) {
	assertCronRunReceiptCurrentInDatabase(params);
	executeSqliteQuerySync(params.database, query(params.database).updateTable("cron_run_receipts").set({ started_at_ms: params.startedAtMs }).where("receipt_id", "=", params.handle.receiptId).where("status", "=", "running"));
	return {
		...params.handle,
		startedAtMs: params.startedAtMs
	};
}
/** Reads the canonical definition under the same exact receipt check used by execution. */
function readCronRunReceiptCurrentJob(params) {
	if (params.isAgentAvailable && !params.isAgentAvailable(params.handle.agentId)) throw new CronRunReceiptRevisionError(params.handle.receiptId, describeUnavailableCronAgent(params.handle.agentId, params.env), "owner-unavailable");
	return withReceiptWrite("cron.run-receipt.assert-current", params.env ? { env: params.env } : {}, (database) => {
		assertCronRunReceiptOwnedInDatabase({
			database,
			handle: params.handle
		});
		return params.allowMissingJob ? void 0 : validateCurrentJob({
			database,
			...params
		});
	});
}
function assertCronRunReceiptCurrent(params) {
	readCronRunReceiptCurrentJob(params);
}
/** Keeps the durable lease live when timeout/cancel returns before the runner. */
function trackCronRunReceiptSettlement(params) {
	const receiptId = params.handle.receiptId;
	const pending = {
		releaseRequested: false,
		onFinishError: params.onFinishError
	};
	pendingReceiptSettlements.set(receiptId, pending);
	const settle = () => {
		if (pendingReceiptSettlements.get(receiptId) !== pending) return;
		pendingReceiptSettlements.delete(receiptId);
		if (pending.finish) try {
			finishCronRunReceipt(pending.finish);
		} catch (error) {
			pending.onFinishError(error);
		}
		else if (pending.releaseRequested) locallyOwnedReceipts.delete(receiptId);
	};
	params.settlement.then(settle, settle);
}
function isCronRunReceiptSettlementPending(handle) {
	return pendingReceiptSettlements.has(handle.receiptId);
}
function clearCronRunReceiptFinishRetry(receiptId) {
	const pending = pendingReceiptFinishRetries.get(receiptId);
	if (pending?.timer) clearTimeout(pending.timer);
	pendingReceiptFinishRetries.delete(receiptId);
}
function queueCronRunReceiptFinishRetry(finish) {
	const receiptId = finish.handle.receiptId;
	let pending = pendingReceiptFinishRetries.get(receiptId);
	if (!pending) {
		pending = {
			finish,
			timer: null
		};
		pendingReceiptFinishRetries.set(receiptId, pending);
	}
	if (pending.timer) return;
	pending.timer = setTimeout(() => {
		pending.timer = null;
		try {
			finishCronRunReceipt(pending.finish);
		} catch {}
	}, CRON_RUN_RECEIPT_FINISH_RETRY_MS);
	pending.timer.unref?.();
}
function finishCronRunReceipt(params) {
	const pending = pendingReceiptSettlements.get(params.handle.receiptId);
	if (pending) {
		pending.finish ??= params;
		return;
	}
	try {
		const result = withReceiptWrite("cron.run-receipt.finish", params.env ? { env: params.env } : {}, (database) => finishCronRunReceiptInDatabase({
			database,
			...params
		}));
		clearCronRunReceiptFinishRetry(params.handle.receiptId);
		locallyOwnedReceipts.delete(params.handle.receiptId);
		return result;
	} catch (error) {
		queueCronRunReceiptFinishRetry(params);
		throw error;
	}
}
/** Releases only this process's liveness proof after terminal persistence fails. */
function releaseLocalCronRunReceiptOwnership(handle) {
	const pending = pendingReceiptSettlements.get(handle.receiptId);
	if (pending) {
		pending.releaseRequested = true;
		return;
	}
	if (pendingReceiptFinishRetries.has(handle.receiptId)) return;
	locallyOwnedReceipts.delete(handle.receiptId);
}
/** Completes the exact active receipt inside its caller's cron-state transaction. */
function finishCronRunReceiptInDatabase(params) {
	executeSqliteQuerySync(params.database, query(params.database).updateTable("cron_run_receipts").set({
		status: params.status,
		finished_at_ms: params.finishedAtMs,
		error_text: params.error ?? null
	}).where("receipt_id", "=", params.handle.receiptId).where("status", "=", "running").where("owner_pid", "=", params.handle.ownerPid));
	pruneTerminalReceipts(params.database, params.handle.storeKey, params.handle.jobId, currentJob(params.database, params.handle.storeKey, params.handle.jobId));
	const row = executeSqliteQueryTakeFirstSync(params.database, query(params.database).selectFrom("cron_run_receipts").selectAll().where("receipt_id", "=", params.handle.receiptId));
	return row ? receiptFromRow(row) : void 0;
}
//#endregion
export { trackCronRunReceiptSettlement as C, releaseLocalCronRunReceiptOwnership as S, isCronRunReceiptSettlementPending as _, adjudicateActiveCronRunReceiptInDatabase as a, prepareCronRunReceiptClaim as b, assertCronRunReceiptOwnedInDatabase as c, ensureCronRunReceiptSchema as d, exactCronRunReceiptMatches as f, isCronRunReceiptOwnerStale as g, finishCronRunReceiptInDatabase as h, activateCronRunReceiptInDatabase as i, bindCronRunReceiptExecutionInDatabase as l, finishCronRunReceipt as m, CronRunReceiptConflictError as n, assertCronRunReceiptCurrent as o, findActiveCronRunReceiptInDatabase as p, CronRunReceiptRevisionError as r, assertCronRunReceiptCurrentInDatabase as s, CRON_STUCK_RUN_MS as t, claimCronRunReceiptInDatabase as u, listActiveCronRunReceiptJobIdsInDatabase as v, describeUnavailableCronAgent as w, readCronRunReceiptCurrentJob as x, prepareCronRunReceiptAdjudication as y };
