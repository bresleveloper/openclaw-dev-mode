import { n as getFileLockProcessStartTime, o as isPidDefinitelyDead } from "./pid-alive-CPS_shDt.mjs";
import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync, u as sqliteStringSet } from "./kysely-sync-K7ftY-g4.mjs";
import { t as extractSqliteTableSchema } from "./sqlite-schema-sql-CKIqAlrf.mjs";
import "./sqlite-transaction-DsZ3X6nD.mjs";
import { d as withExistingOpenClawStateDatabaseCurrentReadOnly } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { f as OPENCLAW_STATE_SCHEMA_SQL } from "./openclaw-state-db-legacy-backfills-BxTnDU05.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import "./agent-deletion-journal-CDljXcnp.mjs";
import { g as readAgentDatabaseAdmissionRefusal } from "./agent-database-admission-dWNS6Rcs.mjs";
import { o as loadCronRows, s as loadedCronStoreFromRows } from "./row-codec-DgIrj0Uv.mjs";
import { a as hasCanonicalCronDeliveryMode, t as CRON_DELIVERY_REPAIR_REQUIRED_MESSAGE } from "./delivery-codec-DMPX9PBc.mjs";
import { t as runCronRuntimeMutation } from "./runtime-mutation-CPS1DVrM.mjs";
import { t as cronStoreKey } from "./key-BBZ40bDq.mjs";
import { t as resolveCronJobConfigRevision } from "./config-revision-DVuJ106z.mjs";
import { n as deleteExecutionOwnerLifecycleMetadata, r as ensureExecutionOwnerLifecycleBindingSchema, t as bindExecutionOwnerLifecycleMetadata } from "./execution-owner-lifecycle-binding-store-BA23fl2D.mjs";
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
function matchesCronRunReceiptOwner(current, expected) {
	return current !== void 0 && current.receiptId === expected.receiptId && current.ownerPid === expected.ownerPid && current.ownerStartTime === expected.ownerStartTime;
}
/** Observe existing receipts without the writable owner's first-use initialization. */
function readActiveCronRunReceiptsInDatabase(database, storeKey, jobIds) {
	let query = getNodeSqliteKysely(database).selectFrom("cron_run_receipts").selectAll().where("status", "=", "running").where("job_id", "in", sqliteStringSet(jobIds));
	if (storeKey !== void 0) query = query.where("store_key", "=", storeKey);
	const rows = executeSqliteQuerySync(database, query).rows;
	const selected = new Set(jobIds);
	return rows.filter((row) => selected.has(row.job_id)).map((row) => receiptHandle(receiptFromRow(row)));
}
//#endregion
//#region src/cron/store/run-receipt-settlement.ts
/** One instance belongs to the receipt store; SQL kernels never import this host state. */
function createCronRunReceiptSettlementOwner(callbacks) {
	const CRON_RUN_RECEIPT_FINISH_RETRY_MS = 1e3;
	const locallyOwnedReceipts = /* @__PURE__ */ new Set();
	const pendingReceiptSettlements = /* @__PURE__ */ new Map();
	const pendingReceiptFinishRetries = /* @__PURE__ */ new Map();
	/** Keeps the durable lease live when timeout/cancel returns before the runner. */
	function trackCronRunReceiptSettlement(params) {
		const receiptId = params.handle.receiptId;
		const pending = {
			releaseRequested: false,
			retained: 0,
			settled: false,
			settle: () => {},
			onFinishError: params.onFinishError
		};
		pendingReceiptSettlements.set(receiptId, pending);
		const settle = () => {
			if (pendingReceiptSettlements.get(receiptId) !== pending) return;
			pending.settled = true;
			if (pending.retained > 0) return;
			pendingReceiptSettlements.delete(receiptId);
			if (pending.finish) finishCronRunReceiptAsync(pending.finish, pending.finishContext).catch(pending.onFinishError);
			else if (pending.releaseRequested) locallyOwnedReceipts.delete(receiptId);
		};
		pending.settle = settle;
		params.settlement.then(settle, settle);
	}
	/** Keep the runner's settlement owner alive across a worker commit and host publication. */
	function retainCronRunReceiptSettlement(handle) {
		const pending = pendingReceiptSettlements.get(handle.receiptId);
		if (pending) pending.retained += 1;
		let released = false;
		return {
			pending: pending !== void 0,
			assertCurrent() {
				if (pendingReceiptSettlements.get(handle.receiptId) !== pending) throw callbacks.revisionError(handle.receiptId, "cron runner settlement changed before commit");
			},
			deferFinish(finish, context) {
				if (!pending || released) throw new Error("Cron deferred finish lost its retained settlement");
				pending.finish ??= finish;
				pending.finishContext ??= context;
			},
			release() {
				if (released) return;
				released = true;
				if (pending) {
					pending.retained -= 1;
					if (pending.settled) pending.settle();
				}
			}
		};
	}
	function clearCronRunReceiptFinishRetry(receiptId) {
		const pending = pendingReceiptFinishRetries.get(receiptId);
		if (pending?.timer) clearTimeout(pending.timer);
		pendingReceiptFinishRetries.delete(receiptId);
	}
	function queueCronRunReceiptFinishRetry(finish, context) {
		const receiptId = finish.handle.receiptId;
		let pending = pendingReceiptFinishRetries.get(receiptId);
		if (!pending) {
			pending = {
				finish,
				context,
				timer: null
			};
			pendingReceiptFinishRetries.set(receiptId, pending);
		}
		if (pending.timer) return;
		pending.timer = setTimeout(() => {
			pending.timer = null;
			finishCronRunReceiptAsync(pending.finish, pending.context).catch(() => void 0);
		}, CRON_RUN_RECEIPT_FINISH_RETRY_MS);
		pending.timer.unref?.();
	}
	/** The asynchronous settlement owner uses the same broker as the marker transaction. */
	async function finishCronRunReceiptAsync(params, context = captureOpenClawStateWorkerContext(params.env ? { env: params.env } : {})) {
		const pending = pendingReceiptSettlements.get(params.handle.receiptId);
		if (pending) {
			pending.finish ??= params;
			pending.finishContext ??= context;
			return;
		}
		let retrySafe = false;
		try {
			await runCronRuntimeMutation({
				context,
				type: "cron.finishReceipt",
				input: {
					storeKey: params.handle.storeKey,
					terminal: {
						handle: { ...params.handle },
						status: params.status,
						finishedAtMs: params.finishedAtMs,
						error: params.error
					}
				},
				assertCurrent() {
					if (pendingReceiptSettlements.has(params.handle.receiptId)) throw callbacks.revisionError(params.handle.receiptId, "cron runner settlement changed before finish");
				},
				prepare: () => ({
					value: {},
					assertCurrent() {}
				}),
				onSettled(outcome) {
					retrySafe = outcome === "not-committed";
				},
				publish() {
					clearCronRunReceiptFinishRetry(params.handle.receiptId);
					locallyOwnedReceipts.delete(params.handle.receiptId);
				}
			});
		} catch (error) {
			try {
				context.admission.assertCurrent();
			} catch {
				retrySafe = false;
			}
			if (retrySafe) queueCronRunReceiptFinishRetry(params, context);
			else {
				clearCronRunReceiptFinishRetry(params.handle.receiptId);
				releaseLocalCronRunReceiptOwnership(params.handle);
			}
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
	return {
		claimLocalCronRunReceiptOwnership: (handle) => {
			locallyOwnedReceipts.add(handle.receiptId);
		},
		owns: (receiptId) => locallyOwnedReceipts.has(receiptId),
		trackCronRunReceiptSettlement,
		retainCronRunReceiptSettlement,
		finishCronRunReceiptAsync,
		releaseLocalCronRunReceiptOwnership
	};
}
//#endregion
//#region src/cron/store/run-receipt-store.ts
const CRON_RUN_RECEIPT_TERMINAL_RETENTION = 64;
const CRON_RUN_RECEIPT_DELETE_BATCH_SIZE = 500;
/** Recovery horizon for abandoned markers and unverifiable foreign receipts. */
const CRON_STUCK_RUN_MS = 72e5;
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
const settlement = createCronRunReceiptSettlementOwner({ revisionError: (receiptId, message) => new CronRunReceiptRevisionError(receiptId, message) });
const { claimLocalCronRunReceiptOwnership, trackCronRunReceiptSettlement, retainCronRunReceiptSettlement, finishCronRunReceiptAsync, releaseLocalCronRunReceiptOwnership } = settlement;
function ensureCronRunReceiptSchema(database) {
	database.exec(extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL, "cron_run_receipts", {
		endMarker: "ON cron_run_receipts(store_key, job_id, started_at_ms DESC, receipt_id DESC);",
		errorMessage: "OpenClaw cron run receipt schema marker is missing."
	}));
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
/** Binds the exact admitted execution to its authoritative receipt without changing lifecycle. */
function bindCronRunReceiptExecutionInDatabase(database, handle, binding, receiptSchema) {
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
	if (!receiptSchema.executionOwnerLifecycleBindings) ensureExecutionOwnerLifecycleBindingSchema(database);
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
function ownerStale(owner, nowMs = Date.now()) {
	if (owner.ownerPid === process.pid) return !settlement.owns(owner.receiptId);
	if (isPidDefinitelyDead(owner.ownerPid)) return true;
	const observedStartTime = getFileLockProcessStartTime(owner.ownerPid);
	if (owner.ownerStartTime !== null && observedStartTime !== null) return owner.ownerStartTime !== observedStartTime;
	return nowMs - owner.startedAtMs > CRON_STUCK_RUN_MS;
}
function validateCurrentJob(params) {
	return validateCurrentReceiptJob(currentJob(params.database, params.handle.storeKey, params.handle.jobId), params);
}
function validateCurrentReceiptJob(job, params) {
	if (!job) throw new CronRunReceiptRevisionError(params.handle.receiptId, "cron job was removed");
	if (params.resolveAgentId(job) !== params.handle.agentId) throw new CronRunReceiptRevisionError(params.handle.receiptId);
	return job;
}
function assertCronRunDelivery(hasCanonicalMode, receiptId) {
	if (!hasCanonicalMode) throw new CronRunReceiptRevisionError(receiptId, CRON_DELIVERY_REPAIR_REQUIRED_MESSAGE);
}
function pruneTerminalReceipts(database, storeKey, jobId, job, receiptSchema) {
	const pendingReceiptId = job?.state.runningAtMs === void 0 ? void 0 : job.state.runningReceiptId;
	let terminalQuery = query(database).selectFrom("cron_run_receipts").select("receipt_id").where("store_key", "=", storeKey).where("job_id", "=", jobId).where("status", "!=", "running");
	if (typeof pendingReceiptId === "string" && toUSVString(pendingReceiptId) === pendingReceiptId) terminalQuery = terminalQuery.orderBy((eb) => eb.case().when("receipt_id", "=", pendingReceiptId).then(1).else(0).end(), "desc");
	const terminalIds = executeSqliteQuerySync(database, terminalQuery.orderBy("finished_at_ms", "desc").orderBy("started_at_ms", "desc").orderBy("receipt_id", "desc").limit(-1).offset(CRON_RUN_RECEIPT_TERMINAL_RETENTION)).rows;
	for (let index = 0; index < terminalIds.length; index += CRON_RUN_RECEIPT_DELETE_BATCH_SIZE) {
		const receiptIds = terminalIds.slice(index, index + CRON_RUN_RECEIPT_DELETE_BATCH_SIZE).map((row) => row.receipt_id);
		deleteExecutionOwnerLifecycleMetadata({
			db: database,
			ownerKind: "cron",
			ownerIds: receiptIds,
			executionOwnerLifecycleBindings: receiptSchema.executionOwnerLifecycleBindings
		});
		executeSqliteQuerySync(database, query(database).deleteFrom("cron_run_receipts").where("store_key", "=", storeKey).where("job_id", "=", jobId).where("status", "!=", "running").where("receipt_id", "in", receiptIds));
	}
}
/** Prepares process liveness facts before the caller enters its commit transaction. */
function prepareCronRunReceiptAdjudication(params) {
	const { observed } = params;
	return {
		storeKey: cronStoreKey(params.storePath),
		...observed ? { observed } : {},
		observedStale: observed ? ownerStale(observed, params.nowMs) : false
	};
}
function prepareCronRunReceiptClaim(params) {
	const ownerStartTime = getFileLockProcessStartTime(process.pid);
	if (ownerStartTime === null) throw new Error("cron run cannot acquire a durable fence without process start identity");
	const adjudication = prepareCronRunReceiptAdjudication({
		storePath: params.storePath,
		observed: params.observed,
		nowMs: params.startedAtMs
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
	assertCronRunDelivery(hasCanonicalCronDeliveryMode(job.delivery), handle.receiptId);
	pruneTerminalReceipts(params.database, handle.storeKey, handle.jobId, job, params.receiptSchema);
	executeSqliteQuerySync(params.database, query(params.database).insertInto("cron_run_receipts").values({
		receipt_id: handle.receiptId,
		store_key: handle.storeKey,
		job_id: handle.jobId,
		config_revision: handle.configRevision,
		agent_id: handle.agentId,
		request_run_id: params.prepared.requestRunId ?? null,
		delivery_attempt_state: "not-started",
		status: "running",
		owner_pid: handle.ownerPid,
		owner_start_time: handle.ownerStartTime,
		started_at_ms: handle.startedAtMs,
		finished_at_ms: null,
		error_text: null
	}));
	return receiptHandle(receiptFromRow(activeRow(params.database, handle.storeKey, handle.jobId)));
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
	assertReceiptOwner(current ? receiptHandle(receiptFromRow(current)) : void 0, params.handle);
}
function assertReceiptOwner(current, handle) {
	if (!matchesCronRunReceiptOwner(current, handle)) throw new CronRunReceiptRevisionError(handle.receiptId, "cron run fence is no longer current");
}
/** Synchronous transaction guard used immediately before a run side effect or state write. */
function assertCronRunReceiptCurrentInDatabase(params) {
	assertCronRunReceiptOwnedInDatabase(params);
	return validateCurrentJob({
		database: params.database,
		handle: params.handle,
		resolveAgentId: params.resolveAgentId
	});
}
/** Advances a queued lease to its execution start inside the marker transaction. */
function activateCronRunReceiptInDatabase(params) {
	const job = assertCronRunReceiptCurrentInDatabase(params);
	assertCronRunDelivery(hasCanonicalCronDeliveryMode(job.delivery), params.handle.receiptId);
	executeSqliteQuerySync(params.database, query(params.database).updateTable("cron_run_receipts").set({ started_at_ms: params.startedAtMs }).where("receipt_id", "=", params.handle.receiptId).where("status", "=", "running"));
	return {
		...params.handle,
		startedAtMs: params.startedAtMs
	};
}
function assertReceiptAgentAvailable(params, database, facts) {
	if (params.isAgentAvailable?.(params.handle.agentId, database, facts) === false) throw new CronRunReceiptRevisionError(params.handle.receiptId, describeUnavailableCronAgent(params.handle.agentId, params.env), "owner-unavailable");
}
function assertCronRunReceiptCurrentFacts(params) {
	if (!params.facts) throw new CronRunReceiptRevisionError(params.handle.receiptId, "cron run fence is no longer current");
	assertReceiptAgentAvailable(params, void 0, { deletionBlocked: params.facts.deletionBlocked });
	assertReceiptOwner(params.facts.receipt, params.handle);
	if (!params.allowMissingJob) assertCronRunDelivery(validateCurrentReceiptJob(params.facts.job, params).hasCanonicalDeliveryMode, params.handle.receiptId);
}
/** Reads the canonical definition under the same exact receipt check used by execution. */
function readCronRunReceiptCurrentJob(params) {
	const result = withExistingOpenClawStateDatabaseCurrentReadOnly(({ db: database }) => {
		assertReceiptAgentAvailable(params, database);
		let current;
		try {
			current = readActiveCronRunReceiptsInDatabase(database, params.handle.storeKey, [params.handle.jobId])[0];
		} catch (error) {
			if (!(error instanceof Error) || error.message !== "no such table: cron_run_receipts") throw error;
		}
		assertReceiptOwner(current, params.handle);
		const job = params.allowMissingJob ? void 0 : validateCurrentJob({
			database,
			...params
		});
		if (job) assertCronRunDelivery(hasCanonicalCronDeliveryMode(job.delivery), params.handle.receiptId);
		return { job };
	}, params.env ? { env: params.env } : {});
	if (!result) throw new CronRunReceiptRevisionError(params.handle.receiptId, "cron run fence is no longer current");
	return result.job;
}
/** Completes the exact active receipt inside its caller's cron-state transaction. */
function finishCronRunReceiptInDatabase(params) {
	executeSqliteQuerySync(params.database, query(params.database).updateTable("cron_run_receipts").set({
		status: params.status,
		finished_at_ms: params.finishedAtMs,
		error_text: params.error ?? null
	}).where("receipt_id", "=", params.handle.receiptId).where("status", "=", "running").where("owner_pid", "=", params.handle.ownerPid));
	pruneTerminalReceipts(params.database, params.handle.storeKey, params.handle.jobId, currentJob(params.database, params.handle.storeKey, params.handle.jobId), params.receiptSchema);
	const row = executeSqliteQueryTakeFirstSync(params.database, query(params.database).selectFrom("cron_run_receipts").selectAll().where("receipt_id", "=", params.handle.receiptId));
	return row ? receiptFromRow(row) : void 0;
}
//#endregion
export { retainCronRunReceiptSettlement as C, describeUnavailableCronAgent as E, releaseLocalCronRunReceiptOwnership as S, readActiveCronRunReceiptsInDatabase as T, isCronRunReceiptOwnerStale as _, adjudicateActiveCronRunReceiptInDatabase as a, prepareCronRunReceiptClaim as b, assertCronRunReceiptOwnedInDatabase as c, claimLocalCronRunReceiptOwnership as d, ensureCronRunReceiptSchema as f, finishCronRunReceiptInDatabase as g, finishCronRunReceiptAsync as h, activateCronRunReceiptInDatabase as i, bindCronRunReceiptExecutionInDatabase as l, findActiveCronRunReceiptInDatabase as m, CronRunReceiptConflictError as n, assertCronRunReceiptCurrentFacts as o, exactCronRunReceiptMatches as p, CronRunReceiptRevisionError as r, assertCronRunReceiptCurrentInDatabase as s, CRON_STUCK_RUN_MS as t, claimCronRunReceiptInDatabase as u, listActiveCronRunReceiptJobIdsInDatabase as v, trackCronRunReceiptSettlement as w, readCronRunReceiptCurrentJob as x, prepareCronRunReceiptAdjudication as y };
