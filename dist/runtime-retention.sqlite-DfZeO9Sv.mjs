import { c as registerNodeSqliteDisposeCallback } from "./kysely-sync-cache-state-Dc7tna9E.mjs";
import { U as withSqliteDatabaseWriteScope, k as readSqliteDatabaseSiblingWriteRevision } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-22SfWsLt.mjs";
import { d as readSqliteNativeMutationRevision } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { t as coerceRequiredSqliteNumber } from "./sqlite-number-DZt1m75H.mjs";
import "./paths-Cc42TKDr.mjs";
import { randomUUID } from "node:crypto";
//#region src/trajectory/runtime-retention.sqlite.ts
const RETENTION_MAX_AGE_MS = 12096e5;
const GLOBAL_MAX_BYTES = 536870912;
const SWEEP_INTERVAL_MS = 36e5;
const DELETE_RUN_BATCH_SIZE = 16;
const states = /* @__PURE__ */ new WeakMap();
const sweeps = /* @__PURE__ */ new WeakMap();
const observedConnections = /* @__PURE__ */ new WeakSet();
function trajectoryRuntimeRetentionState(owner) {
	let state = states.get(owner);
	if (!state) {
		state = {};
		states.set(owner, state);
	}
	return state;
}
function trajectoryRuntimeRetentionDue(state, now) {
	return !state.pending && (state.sweptAt === void 0 || now < state.sweptAt || now - state.sweptAt >= SWEEP_INTERVAL_MS);
}
function compareRuns(left, right) {
	return left.newest - right.newest || left.sessionId.localeCompare(right.sessionId) || (left.runId ?? "").localeCompare(right.runId ?? "") || (left.order < right.order ? -1 : left.order > right.order ? 1 : 0);
}
function readRuns(database, sessionId, runId) {
	let query = getNodeSqliteKysely(database).selectFrom("trajectory_runtime_events").select(["session_id as sessionId", "run_id as runId"]).select((eb) => [
		eb.fn.max("created_at").as("newest"),
		eb.fn.sum(eb(eb.fn("octet_length", ["event_json"]), "+", 1)).as("bytes"),
		eb.fn.countAll().as("events"),
		eb.fn("hex", [eb.cast("session_id", "blob")]).as("sessionOrder"),
		eb.fn("hex", [eb.cast("run_id", "blob")]).as("runOrder")
	]).groupBy(["session_id", "run_id"]);
	if (sessionId !== void 0) query = query.where("session_id", "=", sessionId);
	if (runId !== void 0) query = runId === null ? query.where("run_id", "is", null) : query.where("run_id", "=", runId);
	return executeSqliteQuerySync(database, query).rows.map((row) => ({
		sessionId: row.sessionId,
		runId: row.runId,
		newest: coerceRequiredSqliteNumber(row.newest),
		bytes: coerceRequiredSqliteNumber(row.bytes),
		events: coerceRequiredSqliteNumber(row.events),
		order: `${row.sessionOrder}/${row.runId === null ? "0" : `1${row.runOrder}`}`
	}));
}
/** The read worker performs the sweep's only full-store aggregate. */
function prepareTrajectoryRuntimeRetention(database, input, now) {
	return {
		sessionId: input.sessionId,
		cutoff: now - RETENTION_MAX_AGE_MS,
		maxBytes: Math.max(1, Math.floor(input.maxGlobalRuntimeBytes ?? GLOBAL_MAX_BYTES)),
		runs: readRuns(database)
	};
}
function changes(database, native) {
	if (native) return readSqliteNativeMutationRevision(database);
	return executeSqliteQueryTakeFirstSync(database, getNodeSqliteKysely(database).selectNoFrom((eb) => eb.fn("total_changes", []).as("changes"))).changes;
}
/** The shared lease is revoked by the coordinator before releasing its native owner. */
function beginTrajectoryRuntimeRetention(database, lease) {
	if (!observedConnections.has(database)) {
		observedConnections.add(database);
		registerNodeSqliteDisposeCallback(database, () => {
			const active = sweeps.get(database);
			if (active) {
				Atomics.store(active.lease, 0, 0);
				sweeps.delete(database);
			}
		});
	}
	const nativeChanges = readSqliteNativeMutationRevision(database) !== void 0;
	const sweep = {
		id: randomUUID(),
		lease,
		version: readSqliteDatabaseSiblingWriteRevision(database),
		nativeChanges,
		changes: changes(database, nativeChanges),
		receipts: /* @__PURE__ */ new Map(),
		sessions: /* @__PURE__ */ new Map(),
		queue: [],
		cursor: 0,
		additions: [],
		totalBytes: 0,
		expiredRuns: 0,
		unprotectedRuns: 0
	};
	sweeps.set(database, sweep);
	return sweep.id;
}
function currentSweep(database) {
	const sweep = sweeps.get(database);
	if (sweep && (Atomics.load(sweep.lease, 0) !== 1 || !database.isOpen || sweep.version === void 0 || readSqliteDatabaseSiblingWriteRevision(database) !== sweep.version || changes(database, sweep.nativeChanges) !== sweep.changes)) {
		sweeps.delete(database);
		return;
	}
	return sweep;
}
function stageRetentionMutation(database, sweep, receipt) {
	const committedChanges = changes(database, sweep.nativeChanges);
	deferSqlitePostCommitPublication(database, () => {
		if (sweeps.get(database) === sweep && Atomics.load(sweep.lease, 0) === 1) {
			if (receipt) sweep.receipts.set(receipt.sessionId, receipt.runs);
			sweep.changes = committedChanges;
		}
	});
}
/** Capture before mutation; publish only after the enclosing transaction commits. */
function captureTrajectoryRuntimeRetentionMutation(database) {
	const sweep = currentSweep(database);
	if (!sweep) return;
	return (sessionId) => {
		stageRetentionMutation(database, sweep, {
			sessionId,
			runs: readRuns(database, sessionId)
		});
	};
}
/** Session metadata upserts preserve trajectory rows and need only a committed mutation counter. */
function captureTrajectoryRuntimeRetentionMetadataMutation(database) {
	const sweep = currentSweep(database);
	return sweep ? () => stageRetentionMutation(database, sweep) : void 0;
}
function account(sweep, run, sign) {
	sweep.totalBytes += sign * run.bytes;
	if (run.sessionId !== sweep.plan.sessionId) {
		sweep.unprotectedRuns += sign;
		sweep.expiredRuns += sign * Number(run.newest < sweep.plan.cutoff);
	}
}
function replaceSession(sweep, sessionId, rows) {
	const previous = sweep.sessions.get(sessionId);
	const next = /* @__PURE__ */ new Map();
	for (const row of rows) {
		const old = previous?.get(row.runId);
		const run = old && old.newest === row.newest && old.bytes === row.bytes && old.events === row.events ? old : row;
		next.set(run.runId, run);
		if (run !== old) {
			account(sweep, run, 1);
			if (run.sessionId !== sweep.plan.sessionId) sweep.additions.push(run);
		}
	}
	for (const old of previous?.values() ?? []) if (next.get(old.runId) !== old) account(sweep, old, -1);
	sweep.sessions.set(sessionId, next);
}
/** Reconcile receipts and advance the sorted cursor before acquiring the writer lock. */
function selectTrajectoryRuntimeRetentionBatch(database, input) {
	const sweep = currentSweep(database);
	const runs = [];
	if (!sweep || sweep.id !== input.sweepId) return {
		sweepId: input.sweepId,
		runs,
		refresh: true
	};
	if (input.snapshot && !sweep.plan) {
		sweep.plan = {
			...input.snapshot,
			runs: []
		};
		const sessions = /* @__PURE__ */ new Map();
		for (const run of input.snapshot.runs) {
			const rows = sessions.get(run.sessionId) ?? [];
			rows.push(run);
			sessions.set(run.sessionId, rows);
		}
		for (const [sessionId, rows] of sessions) replaceSession(sweep, sessionId, sweep.receipts.get(sessionId) ?? rows);
		for (const [sessionId, rows] of sweep.receipts) if (!sessions.has(sessionId)) replaceSession(sweep, sessionId, rows);
		sweep.queue = sweep.additions.toSorted(compareRuns);
		sweep.additions = [];
	} else if (sweep.plan) for (const [sessionId, rows] of sweep.receipts) replaceSession(sweep, sessionId, rows);
	sweep.receipts.clear();
	sweep.additions.sort(compareRuns);
	let bytes = 0;
	while (runs.length < DELETE_RUN_BATCH_SIZE) {
		const queued = sweep.queue[sweep.cursor];
		const added = sweep.additions[0];
		const useAdded = added && (!queued || compareRuns(added, queued) < 0);
		const run = useAdded ? added : queued;
		if (!run) break;
		if (sweep.sessions.get(run.sessionId)?.get(run.runId) !== run) {
			if (useAdded) sweep.additions.shift();
			else sweep.cursor++;
			continue;
		}
		if (runs.length && bytes + run.bytes > 10485760) break;
		if (useAdded) sweep.additions.shift();
		else sweep.cursor++;
		runs.push(run);
		bytes += run.bytes;
	}
	return {
		sweepId: input.sweepId,
		runs
	};
}
/** Only the handed-off batch is queried under the writer lock. */
function deleteTrajectoryRuntimeRetention(database, batch) {
	const sweep = batch.refresh ? void 0 : currentSweep(database.db);
	if (!sweep?.plan || sweep.id !== batch.sweepId) return {
		complete: false,
		refresh: true,
		deleted: 0,
		invalidated: 0,
		totalBytes: 0
	};
	const db = getNodeSqliteKysely(database.db);
	let totalBytes = sweep.totalBytes;
	let expiredRuns = sweep.expiredRuns;
	const deleted = [];
	let invalidated = 0;
	for (const run of batch.runs) {
		if (run.sessionId === sweep.plan.sessionId || run.newest >= sweep.plan.cutoff && totalBytes <= sweep.plan.maxBytes) continue;
		const current = readRuns(database.db, run.sessionId, run.runId)[0];
		if (current?.newest !== run.newest || current.bytes !== run.bytes || current.events !== run.events) {
			invalidated++;
			break;
		}
		withSqliteDatabaseWriteScope(database.db, [], () => executeSqliteQuerySync(database.db, db.deleteFrom("trajectory_runtime_events").where("session_id", "=", run.sessionId).where("run_id", run.runId === null ? "is" : "=", run.runId)));
		totalBytes -= run.bytes;
		expiredRuns -= Number(run.newest < sweep.plan.cutoff);
		deleted.push(run);
	}
	const committedChanges = changes(database.db, sweep.nativeChanges);
	deferSqlitePostCommitPublication(database.db, () => {
		for (const run of deleted) {
			sweep.sessions.get(run.sessionId)?.delete(run.runId);
			account(sweep, run, -1);
		}
		sweep.changes = committedChanges;
		if (invalidated) sweeps.delete(database.db);
	});
	return {
		complete: expiredRuns === 0 && (totalBytes <= sweep.plan.maxBytes || deleted.length === sweep.unprotectedRuns),
		refresh: invalidated > 0,
		deleted: deleted.length,
		invalidated,
		totalBytes
	};
}
//#endregion
export { prepareTrajectoryRuntimeRetention as a, trajectoryRuntimeRetentionState as c, deleteTrajectoryRuntimeRetention as i, captureTrajectoryRuntimeRetentionMetadataMutation as n, selectTrajectoryRuntimeRetentionBatch as o, captureTrajectoryRuntimeRetentionMutation as r, trajectoryRuntimeRetentionDue as s, beginTrajectoryRuntimeRetention as t };
