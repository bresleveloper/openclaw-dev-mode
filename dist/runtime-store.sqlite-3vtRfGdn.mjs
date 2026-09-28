import { y as parseDateStringTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import { a as iterateSqliteQuerySync, i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { i as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { t as coerceRequiredSqliteNumber } from "./sqlite-number-DM1AypRG.mjs";
import { f as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-CaQAStOA.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-IBx2zWDG.mjs";
import { g as toDatabaseOptions, l as resolveSqliteReadScope } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
import { z as assertSqliteJsonlReadBudget } from "./session-accessor.sqlite-read-DO8t28O6.mjs";
import "./paths-DV-XPqk-.mjs";
//#region src/trajectory/runtime-store.sqlite.ts
const TRAJECTORY_RUNTIME_RETENTION_MAX_AGE_MS = 12096e5;
const TRAJECTORY_RUNTIME_GLOBAL_MAX_BYTES = 536870912;
const TRAJECTORY_RUNTIME_GLOBAL_SWEEP_INTERVAL_MS = 36e5;
const TRAJECTORY_RUNTIME_DELETE_RUN_BATCH_SIZE = 100;
const TRAJECTORY_RUNTIME_INSERT_BATCH_SIZE = 32;
const lastGlobalSweepAtByDatabase = /* @__PURE__ */ new WeakMap();
/** Appends runtime trajectory events to the per-agent SQLite session store. */
function appendSqliteTrajectoryRuntimeEvents(scope, events) {
	if (events.length === 0) return;
	const options = toDatabaseOptions(resolveSqliteReadScope(scope));
	const maxRuntimeBytes = Math.max(1, Math.floor(scope.maxRuntimeBytes ?? 10485760));
	const maxGlobalRuntimeBytes = Math.max(1, Math.floor(scope.maxGlobalRuntimeBytes ?? TRAJECTORY_RUNTIME_GLOBAL_MAX_BYTES));
	const sweepAt = Date.now();
	let sweptDatabase;
	runOpenClawAgentWriteTransaction((database) => {
		const db = getTrajectoryKysely(database.db);
		let seq = readNextTrajectorySeq(database, scope.sessionId);
		for (let index = 0; index < events.length; index += TRAJECTORY_RUNTIME_INSERT_BATCH_SIZE) {
			const rows = events.slice(index, index + TRAJECTORY_RUNTIME_INSERT_BATCH_SIZE).map((event) => {
				const eventJson = JSON.stringify(event);
				return {
					session_id: scope.sessionId,
					seq: seq++,
					run_id: event.runId ?? null,
					event_json: eventJson,
					created_at: readTrajectoryEventTimestamp(event) ?? Date.now()
				};
			});
			executeSqliteQuerySync(database.db, db.insertInto("trajectory_runtime_events").values(rows));
		}
		trimSqliteTrajectoryRuntimeWindow(database, scope.sessionId, maxRuntimeBytes);
		const lastSweptAt = lastGlobalSweepAtByDatabase.get(database);
		if (lastSweptAt === void 0 || sweepAt < lastSweptAt || sweepAt - lastSweptAt >= TRAJECTORY_RUNTIME_GLOBAL_SWEEP_INTERVAL_MS) {
			sweepSqliteTrajectoryRuntimeRetention(database, scope.sessionId, sweepAt, maxGlobalRuntimeBytes);
			sweptDatabase = database;
		}
	}, options);
	if (sweptDatabase) lastGlobalSweepAtByDatabase.set(sweptDatabase, sweepAt);
}
/** Loads runtime trajectory events from per-agent SQLite rows in storage order. */
async function loadSqliteTrajectoryRuntimeEvents(scope) {
	return loadSqliteTrajectoryRuntimeEventsSync(scope);
}
/** Loads runtime trajectory events synchronously for CLI and export paths. */
function loadSqliteTrajectoryRuntimeEventsSync(scope) {
	return loadSqliteTrajectoryRuntimeEventRowsSync(scope).map((row) => row.event);
}
/** Loads runtime trajectory event rows with storage seqs for follow/export cursors. */
function loadSqliteTrajectoryRuntimeEventRowsSync(scope) {
	const read = withOpenClawAgentDatabaseReadOnly((database) => {
		const db = getTrajectoryKysely(database.db);
		const tailEvents = scope.tailEvents !== void 0 && Number.isFinite(scope.tailEvents) ? Math.max(0, Math.floor(scope.tailEvents)) : void 0;
		const afterSeq = scope.afterSeq;
		return runSqliteDeferredTransactionSync(database.db, () => {
			if (tailEvents === void 0 && scope.maxEventCount !== void 0 && Number.isFinite(scope.maxEventCount) && scope.maxEventCount >= 0) {
				const eventLimit = Math.floor(scope.maxEventCount);
				const eventCount = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("trajectory_runtime_events").select((eb) => [eb.fn.countAll().as("event_count")]).where("session_id", "=", scope.sessionId).$if(afterSeq !== void 0 && Number.isFinite(afterSeq), (query) => query.where("seq", ">", Math.floor(afterSeq))))?.event_count ?? 0;
				if (eventCount > eventLimit) throw new Error(`Trajectory runtime store has too many events to export (${eventCount}; limit ${eventLimit})`);
			}
			if (scope.maxEventBytes !== void 0 && Number.isFinite(scope.maxEventBytes) && scope.maxEventBytes >= 0 && tailEvents === void 0) assertSqliteJsonlReadBudget(database.db, db.selectFrom("trajectory_runtime_events").select("event_json").where("session_id", "=", scope.sessionId).$if(afterSeq !== void 0 && Number.isFinite(afterSeq), (query) => query.where("seq", ">", Math.floor(afterSeq))).as("events"), Math.floor(scope.maxEventBytes), "Trajectory runtime store");
			let query = db.selectFrom("trajectory_runtime_events").select(["seq", "event_json"]).where("session_id", "=", scope.sessionId).orderBy("seq", tailEvents === void 0 ? "asc" : "desc");
			if (afterSeq !== void 0 && Number.isFinite(afterSeq)) query = query.where("seq", ">", Math.floor(afterSeq));
			const normalizedMaxEvents = scope.maxEvents !== void 0 && Number.isFinite(scope.maxEvents) ? Math.max(0, Math.floor(scope.maxEvents)) : void 0;
			const maxEvents = tailEvents === void 0 ? normalizedMaxEvents : normalizedMaxEvents === void 0 ? tailEvents : Math.min(tailEvents, normalizedMaxEvents);
			if (maxEvents !== void 0 && Number.isFinite(maxEvents)) query = query.limit(Math.max(0, Math.floor(maxEvents)));
			const rows = executeSqliteQuerySync(database.db, query).rows.map((row) => ({
				event: JSON.parse(row.event_json),
				seq: row.seq
			}));
			return tailEvents === void 0 ? rows : rows.toReversed();
		}, {
			databaseLabel: database.path,
			operationLabel: "trajectory runtime budget read"
		});
	}, toDatabaseOptions(resolveSqliteReadScope(scope)));
	return read.found ? read.value : [];
}
function sweepSqliteTrajectoryRuntimeRetention(database, currentSessionId, now, maxGlobalRuntimeBytes) {
	const runs = readSqliteTrajectoryRuntimeRuns(database);
	let retainedBytes = runs.reduce((total, run) => total + run.runtimeBytes, 0);
	const cutoff = now - TRAJECTORY_RUNTIME_RETENTION_MAX_AGE_MS;
	const deletedRuns = /* @__PURE__ */ new Set();
	for (const run of runs) if (run.sessionId !== currentSessionId && run.newestCreatedAt < cutoff) {
		deletedRuns.add(run);
		retainedBytes -= run.runtimeBytes;
	}
	for (const run of runs.toSorted(compareTrajectoryRuntimeRunsOldestFirst)) {
		if (retainedBytes <= maxGlobalRuntimeBytes) break;
		if (run.sessionId === currentSessionId || deletedRuns.has(run)) continue;
		deletedRuns.add(run);
		retainedBytes -= run.runtimeBytes;
	}
	deleteSqliteTrajectoryRuntimeRuns(database, [...deletedRuns]);
}
function readSqliteTrajectoryRuntimeRuns(database) {
	const db = getTrajectoryKysely(database.db);
	return executeSqliteQuerySync(database.db, db.with((cte) => cte("event_sizes").materialized(), (qb) => qb.selectFrom("trajectory_runtime_events").select([
		"session_id",
		"run_id",
		"created_at"
	]).select((eb) => eb(eb.fn("octet_length", ["event_json"]), "+", 1).as("runtime_bytes"))).selectFrom("event_sizes").select(["session_id", "run_id"]).select((eb) => [eb.fn.max("created_at").as("newest_created_at"), eb.fn.sum("runtime_bytes").as("runtime_bytes")]).groupBy(["session_id", "run_id"])).rows.map((row) => ({
		newestCreatedAt: coerceRequiredSqliteNumber(row.newest_created_at),
		runId: row.run_id,
		runtimeBytes: coerceRequiredSqliteNumber(row.runtime_bytes),
		sessionId: row.session_id
	}));
}
function deleteSqliteTrajectoryRuntimeRuns(database, runs) {
	const db = getTrajectoryKysely(database.db);
	for (let index = 0; index < runs.length; index += TRAJECTORY_RUNTIME_DELETE_RUN_BATCH_SIZE) {
		const batch = runs.slice(index, index + TRAJECTORY_RUNTIME_DELETE_RUN_BATCH_SIZE);
		executeSqliteQuerySync(database.db, db.deleteFrom("trajectory_runtime_events").where((eb) => eb.or(batch.map((run) => eb.and([eb("session_id", "=", run.sessionId), run.runId === null ? eb("run_id", "is", null) : eb("run_id", "=", run.runId)])))));
	}
}
function compareTrajectoryRuntimeRunsOldestFirst(left, right) {
	return left.newestCreatedAt - right.newestCreatedAt || left.sessionId.localeCompare(right.sessionId) || (left.runId ?? "").localeCompare(right.runId ?? "");
}
function getTrajectoryKysely(database) {
	return getNodeSqliteKysely(database);
}
function readNextTrajectorySeq(database, sessionId) {
	const db = getTrajectoryKysely(database.db);
	const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("trajectory_runtime_events").select((eb) => eb.fn.max("seq").as("max_seq")).where("session_id", "=", sessionId));
	if (row?.max_seq === null || row?.max_seq === void 0) return 0;
	return coerceRequiredSqliteNumber(row.max_seq) + 1;
}
function trimSqliteTrajectoryRuntimeWindow(database, sessionId, maxRuntimeBytes) {
	const db = getTrajectoryKysely(database.db);
	const rows = iterateSqliteQuerySync(database.db, db.selectFrom("trajectory_runtime_events").select("seq").select((eb) => {
		const utf8 = eb(eb.selectFrom("pragma_encoding").select("encoding"), "=", "UTF-8");
		return [eb.case().when(utf8).then(eb.fn("octet_length", ["event_json"])).else(0).end().as("event_bytes"), eb.case().when(utf8).then(null).else(eb.ref("event_json")).end().as("event_json")];
	}).where("session_id", "=", sessionId).orderBy("seq", "desc"));
	let retainedBytes = 0;
	let removeThroughSeq;
	for (const row of rows) {
		retainedBytes += (row.event_json === null ? coerceRequiredSqliteNumber(row.event_bytes) : Buffer.byteLength(row.event_json, "utf8")) + 1;
		if (!(retainedBytes <= maxRuntimeBytes)) {
			removeThroughSeq = row.seq;
			break;
		}
	}
	if (removeThroughSeq === void 0) return;
	executeSqliteQuerySync(database.db, db.deleteFrom("trajectory_runtime_events").where("session_id", "=", sessionId).where("seq", "<=", removeThroughSeq));
}
function readTrajectoryEventTimestamp(event) {
	return parseDateStringTimestampMs(event.ts);
}
//#endregion
export { loadSqliteTrajectoryRuntimeEventRowsSync as n, loadSqliteTrajectoryRuntimeEvents as r, appendSqliteTrajectoryRuntimeEvents as t };
