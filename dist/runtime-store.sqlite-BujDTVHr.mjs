import { y as parseDateStringTimestampMs } from "./number-coercion-CkhMiRw8.mjs";
import { U as withSqliteDatabaseWriteScope } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely, s as iterateSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { t as coerceRequiredSqliteNumber } from "./sqlite-number-DZt1m75H.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import "./paths-Cc42TKDr.mjs";
import { n as captureSessionActorStorageOwner, s as withSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { n as resolveSqliteReadScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { o as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-DyHfVUVm.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
import { t as assertSqliteJsonlReadBudget } from "./sqlite-jsonl-budget-Ct596TxU.mjs";
import { r as captureTrajectoryRuntimeRetentionMutation } from "./runtime-retention.sqlite-DfZeO9Sv.mjs";
//#region src/trajectory/runtime-store.sqlite.ts
const TRAJECTORY_RUNTIME_INSERT_BATCH_SIZE = 32;
function appendSqliteTrajectoryRuntimeEventsWithWriter(input, write) {
	const { sessionId } = input;
	const rows = input.events.map((event) => ({
		session_id: sessionId,
		run_id: event.runId ?? null,
		event_json: event.line,
		created_at: parseDateStringTimestampMs(event.ts) ?? Date.now(),
		seq: 0
	}));
	const maxRuntimeBytes = Math.max(1, Math.floor(input.maxRuntimeBytes ?? 10485760));
	let retainedBytes = 0;
	let expiredThroughIndex = -1;
	for (const [index, row] of rows.toReversed().entries()) {
		retainedBytes += Buffer.byteLength(row.event_json, "utf8") + 1;
		if (!(retainedBytes <= maxRuntimeBytes)) {
			expiredThroughIndex = rows.length - index - 1;
			break;
		}
	}
	return write("trajectory.runtime.append", (database) => withSqliteDatabaseWriteScope(database.db, [], () => {
		const publishRetention = captureTrajectoryRuntimeRetentionMutation(database.db);
		const db = getTrajectoryKysely(database.db);
		const window = prepareSqliteTrajectoryRuntimeWindow(database, sessionId, {
			maxRuntimeBytes,
			retainedBytes,
			expiredThroughIndex,
			discardPrevious: input.discardPrevious
		});
		let seq = window.nextSeq;
		for (const row of rows) row.seq = seq++;
		for (let index = 0; index < rows.length; index += TRAJECTORY_RUNTIME_INSERT_BATCH_SIZE) executeSqliteQuerySync(database.db, db.insertInto("trajectory_runtime_events").values(rows.slice(index, index + TRAJECTORY_RUNTIME_INSERT_BATCH_SIZE)));
		if (window.removeThroughSeq !== void 0) executeSqliteQuerySync(database.db, db.deleteFrom("trajectory_runtime_events").where("session_id", "=", sessionId).where("seq", "<=", window.removeThroughSeq));
		publishRetention?.(sessionId);
		return {
			database,
			receipt: {
				kind: "trajectory-runtime-append",
				sessionId,
				appendedRange: rows.length ? {
					firstSeq: window.nextSeq,
					lastSeq: seq - 1
				} : void 0,
				removedThroughSeq: window.removeThroughSeq
			}
		};
	}));
}
/** Loads runtime trajectory events from per-agent SQLite rows in storage order. */
async function loadSqliteTrajectoryRuntimeEvents(scope) {
	const authority = {
		assertCurrent() {},
		authorize() {}
	};
	if (captureSessionActorStorageOwner(scope, authority)) return await withSessionActorStorage(scope, {
		authority,
		lifetime: {
			assertCurrent() {},
			assertReadable() {}
		}
	}, ({ actor, authority: current }) => actor.storage.read({
		type: "session.trajectory.read",
		input: {
			sessionId: scope.sessionId,
			maxEventBytes: scope.maxEventBytes,
			maxEventCount: scope.maxEventCount
		}
	}, current)) ?? [];
	const options = toDatabaseOptions(resolveSqliteReadScope(scope));
	return withSessionHistoryWorkerDatabase(options, (reader) => reader.readTrajectoryEvents({ scope }));
}
/** Loads runtime trajectory event rows with storage seqs for follow/export cursors. */
function loadSqliteTrajectoryRuntimeEventRowsSync(scope) {
	const source = captureSessionActorStorageOwner(scope, {
		assertCurrent() {},
		authorize() {}
	});
	if (source) {
		const query = {
			type: "session.trajectory.rows",
			input: {
				sessionId: scope.sessionId,
				maxEventBytes: scope.maxEventBytes,
				maxEventCount: scope.maxEventCount,
				afterSeq: scope.afterSeq,
				maxEvents: scope.maxEvents,
				tailEvents: scope.tailEvents
			}
		};
		if (!source.owner) return source.binding?.actor.storage?.readCurrent(query, source.authority) ?? [];
		const session = source.owner.readSessionById(scope.sessionId, source.authority);
		return session ? source.owner.readStorage(session.sessionKey, query, source.authority) ?? [] : [];
	}
	const read = withOpenClawAgentDatabaseReadOnly((database) => {
		const db = getTrajectoryKysely(database.db);
		const tailEvents = scope.tailEvents !== void 0 && Number.isFinite(scope.tailEvents) ? Math.max(0, Math.floor(scope.tailEvents)) : void 0;
		const afterSeq = scope.afterSeq;
		const events = db.selectFrom("trajectory_runtime_events").where("session_id", "=", scope.sessionId).$if(afterSeq !== void 0 && Number.isFinite(afterSeq), (query) => query.where("seq", ">", Math.floor(afterSeq)));
		return runSqliteDeferredTransactionSync(database.db, () => {
			if (tailEvents === void 0 && scope.maxEventCount !== void 0 && Number.isFinite(scope.maxEventCount) && scope.maxEventCount >= 0) {
				const eventLimit = Math.floor(scope.maxEventCount);
				const eventCount = executeSqliteQueryTakeFirstSync(database.db, events.select((eb) => [eb.fn.countAll().as("event_count")]))?.event_count ?? 0;
				if (eventCount > eventLimit) throw new Error(`Trajectory runtime store has too many events to export (${eventCount}; limit ${eventLimit})`);
			}
			if (scope.maxEventBytes !== void 0 && Number.isFinite(scope.maxEventBytes) && scope.maxEventBytes >= 0 && tailEvents === void 0) assertSqliteJsonlReadBudget(database.db, events.select("event_json").as("events"), Math.floor(scope.maxEventBytes), "Trajectory runtime store");
			let query = events.select(["seq", "event_json"]).orderBy("seq", tailEvents === void 0 ? "asc" : "desc");
			const normalizedMaxEvents = scope.maxEvents !== void 0 && Number.isFinite(scope.maxEvents) ? Math.max(0, Math.floor(scope.maxEvents)) : void 0;
			const maxEvents = tailEvents === void 0 ? normalizedMaxEvents : normalizedMaxEvents === void 0 ? tailEvents : Math.min(tailEvents, normalizedMaxEvents);
			if (maxEvents !== void 0) query = query.limit(maxEvents);
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
function getTrajectoryKysely(database) {
	return getNodeSqliteKysely(database);
}
function prepareSqliteTrajectoryRuntimeWindow(database, sessionId, input) {
	const db = getTrajectoryKysely(database.db);
	const rows = iterateSqliteQuerySync(database.db, db.selectFrom("trajectory_runtime_events").select("seq").select((eb) => {
		const utf8 = eb(eb.selectFrom("pragma_encoding").select("encoding"), "=", "UTF-8");
		return [eb.case().when(utf8).then(eb.fn("octet_length", ["event_json"])).else(0).end().as("event_bytes"), eb.case().when(utf8).then(null).else(eb.ref("event_json")).end().as("event_json")];
	}).where("session_id", "=", sessionId).orderBy("seq", "desc"));
	let nextSeq;
	let retainedBytes = input.retainedBytes;
	let removeThroughSeq;
	for (const row of rows) {
		nextSeq ??= coerceRequiredSqliteNumber(row.seq) + 1;
		if (input.discardPrevious || input.expiredThroughIndex >= 0) break;
		retainedBytes += (row.event_json === null ? coerceRequiredSqliteNumber(row.event_bytes) : Buffer.byteLength(row.event_json, "utf8")) + 1;
		if (!(retainedBytes <= input.maxRuntimeBytes)) {
			removeThroughSeq = row.seq;
			break;
		}
	}
	nextSeq ??= 0;
	if (input.expiredThroughIndex >= 0) removeThroughSeq = nextSeq + input.expiredThroughIndex;
	else if (input.discardPrevious) removeThroughSeq = nextSeq - 1;
	return {
		nextSeq,
		removeThroughSeq
	};
}
//#endregion
export { loadSqliteTrajectoryRuntimeEventRowsSync as n, loadSqliteTrajectoryRuntimeEvents as r, appendSqliteTrajectoryRuntimeEventsWithWriter as t };
