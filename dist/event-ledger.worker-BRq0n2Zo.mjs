import { i as executeSqliteQuerySync, l as prepareSqliteQuerySync, n as createSqliteQueryCache, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { t as coerceRequiredSqliteNumber } from "./sqlite-number-DZt1m75H.mjs";
import { n as estimateAcpSessionRowBytes, t as estimateAcpEventRowBytes } from "./event-ledger-bytes-BqV24T1W.mjs";
import { n as normalizeAcpLedgerEvent } from "./event-ledger.types-beKitCWb.mjs";
//#region src/acp/event-ledger.worker.ts
function normalizeSqliteInteger(value) {
	return value === null ? 0 : coerceRequiredSqliteNumber(value);
}
function createSqliteLedgerQueries(db) {
	const query = getNodeSqliteKysely(db);
	return {
		readSession: prepareSqliteQuerySync(db, (parameter) => sqliteSessionMetadataQuery(db).where("session_id", "=", parameter((sessionId) => sessionId))),
		deleteEvents: prepareSqliteQuerySync(db, (parameter) => query.deleteFrom("acp_replay_events").where("session_id", "=", parameter((sessionId) => sessionId))),
		upsertSession: prepareSqliteQuerySync(db, (parameter) => query.insertInto("acp_replay_sessions").values({
			session_id: parameter((params) => params.sessionId),
			session_key: parameter((params) => params.sessionKey),
			cwd: parameter((params) => params.cwd),
			complete: parameter((params) => params.complete),
			created_at: parameter((params) => params.now),
			updated_at: parameter((params) => params.updatedAt),
			next_seq: parameter((params) => params.nextSeq),
			estimated_bytes: parameter((params) => params.rowBytes)
		}).onConflict((conflict) => conflict.column("session_id").doUpdateSet((eb) => ({
			session_key: eb.ref("excluded.session_key"),
			cwd: eb.ref("excluded.cwd"),
			complete: eb.ref("excluded.complete"),
			updated_at: eb.ref("excluded.updated_at"),
			next_seq: eb.ref("excluded.next_seq"),
			estimated_bytes: eb.ref("excluded.estimated_bytes")
		})))),
		updateSessionMetadata: prepareSqliteQuerySync(db, (parameter) => query.updateTable("acp_replay_sessions").set((eb) => ({
			estimated_bytes: eb("estimated_bytes", "+", parameter((params) => params.metadataDelta)),
			session_key: parameter((params) => params.sessionKey),
			cwd: parameter((params) => params.cwd),
			complete: parameter((params) => params.complete),
			updated_at: parameter((params) => params.now),
			next_seq: eb("next_seq", "+", parameter((params) => params.sequenceDelta))
		})).where("session_id", "=", parameter((params) => params.sessionId))),
		insertEvent: prepareSqliteQuerySync(db, (parameter) => query.insertInto("acp_replay_events").values({
			session_id: parameter((params) => params.sessionId),
			seq: parameter((params) => params.seq),
			at: parameter((params) => params.at),
			session_key: parameter((params) => params.sessionKey),
			run_id: parameter((params) => params.runId),
			update_json: parameter((params) => params.updateJson),
			estimated_bytes: parameter((params) => params.eventBytes)
		})),
		readEventCapCandidates: prepareSqliteQuerySync(db, (parameter) => query.selectFrom("acp_replay_sessions as s").select("s.session_id").select((eb) => eb.selectFrom("acp_replay_events as e").select((count) => count.fn.count("e.seq").as("event_count")).whereRef("e.session_id", "=", "s.session_id").as("event_count")).where((eb) => {
			const events = eb.selectFrom("acp_replay_events as e").whereRef("e.session_id", "=", "s.session_id");
			return eb(eb(events.select((endpoint) => endpoint.fn.max("e.seq").as("seq")), "-", events.select((endpoint) => endpoint.fn.min("e.seq").as("seq"))), ">=", parameter((limit) => limit));
		})),
		readExcessSessions: prepareSqliteQuerySync(db, (parameter) => query.selectFrom("acp_replay_sessions").select("session_id").orderBy("updated_at", "desc").orderBy("session_id", "asc").limit(-1).offset(parameter((limit) => limit))),
		readTotalBytes: prepareSqliteQuerySync(db, () => query.selectFrom("acp_replay_sessions").select((eb) => eb.fn.coalesce(eb.fn.sum("estimated_bytes"), eb.val(0)).as("total"))),
		readOldestSession: prepareSqliteQuerySync(db, () => query.selectFrom("acp_replay_sessions").select("session_id").orderBy("updated_at", "asc").orderBy("session_id", "asc").limit(1)),
		deleteOldestEvents: prepareSqliteQuerySync(db, (parameter) => {
			const sessionId = parameter((params) => params.sessionId);
			return query.deleteFrom("acp_replay_events").where("session_id", "=", sessionId).where("seq", "in", query.selectFrom("acp_replay_events").select("seq").where("session_id", "=", sessionId).orderBy("seq", "asc").limit(parameter((params) => params.limit))).returning("estimated_bytes");
		}),
		subtractSessionBytes: prepareSqliteQuerySync(db, (parameter) => query.updateTable("acp_replay_sessions").set((eb) => ({
			estimated_bytes: eb.fn("max", [eb.val(0), eb("estimated_bytes", "-", parameter((params) => params.freed))]),
			complete: 0
		})).where("session_id", "=", parameter((params) => params.sessionId))),
		deleteSession: prepareSqliteQuerySync(db, (parameter) => query.deleteFrom("acp_replay_sessions").where("session_id", "=", parameter((sessionId) => sessionId)))
	};
}
const getSqliteLedgerQueries = createSqliteQueryCache(createSqliteLedgerQueries);
function sqliteRowToLedgerEvent(row) {
	let update;
	try {
		update = JSON.parse(row.update_json ?? "");
	} catch {
		return;
	}
	return normalizeAcpLedgerEvent({
		seq: normalizeSqliteInteger(row.seq),
		at: normalizeSqliteInteger(row.at),
		sessionId: row.session_id,
		sessionKey: row.session_key,
		...row.run_id ? { runId: row.run_id } : {},
		update
	});
}
function sqliteSessionMetadataQuery(db) {
	return getNodeSqliteKysely(db).selectFrom("acp_replay_sessions").select([
		"session_id",
		"session_key",
		"cwd",
		"complete",
		"next_seq"
	]);
}
function readSqliteSessionById(db, sessionId) {
	return getSqliteLedgerQueries(db).readSession(sessionId).rows[0];
}
function upsertSqliteSession(db, now, params, append) {
	const existing = params.reset ? void 0 : readSqliteSessionById(db, params.sessionId);
	if (existing) {
		const cwd = params.cwd || existing.cwd;
		const complete = normalizeSqliteInteger(existing.complete) === 1 || params.complete ? 1 : 0;
		const metadataDelta = estimateAcpSessionRowBytes({
			...params,
			cwd
		}) - estimateAcpSessionRowBytes({
			sessionId: params.sessionId,
			sessionKey: existing.session_key,
			cwd: existing.cwd
		});
		getSqliteLedgerQueries(db).updateSessionMetadata({
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			cwd,
			complete,
			now: append?.at ?? now,
			metadataDelta: metadataDelta + (append?.eventBytes ?? 0),
			sequenceDelta: append ? 1 : 0
		});
		return normalizeSqliteInteger(existing.next_seq);
	}
	if (params.reset) getSqliteLedgerQueries(db).deleteEvents(params.sessionId);
	const rowBytes = estimateAcpSessionRowBytes(params);
	getSqliteLedgerQueries(db).upsertSession({
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		cwd: params.cwd,
		complete: params.complete ? 1 : 0,
		now,
		updatedAt: append?.at ?? now,
		nextSeq: append ? 2 : 1,
		rowBytes: rowBytes + (append?.eventBytes ?? 0)
	});
	return 1;
}
function estimateSqliteLedgerBytes(db) {
	const row = getSqliteLedgerQueries(db).readTotalBytes().rows[0];
	return normalizeSqliteInteger(row?.total ?? 0);
}
const LEDGER_TRIM_EVENT_BATCH = 64;
function deleteOldestSqliteEvents(db, sessionId, limit) {
	const queries = getSqliteLedgerQueries(db);
	const rows = queries.deleteOldestEvents({
		sessionId,
		limit
	}).rows;
	if (rows.length === 0) return 0;
	const freed = rows.reduce((sum, row) => sum + normalizeSqliteInteger(row.estimated_bytes), 0);
	queries.subtractSessionBytes({
		sessionId,
		freed
	});
	return rows.length;
}
function trimSqliteLedger(db, state) {
	const queries = getSqliteLedgerQueries(db);
	const eventCapCandidates = queries.readEventCapCandidates(state.maxEventsPerSession).rows;
	for (const row of eventCapCandidates) {
		const overage = normalizeSqliteInteger(row.event_count) - state.maxEventsPerSession;
		if (overage > 0) deleteOldestSqliteEvents(db, row.session_id, overage);
	}
	const oldSessions = queries.readExcessSessions(state.maxSessions).rows;
	for (const session of oldSessions) queries.deleteSession(session.session_id);
	let serializedBytes = estimateSqliteLedgerBytes(db);
	while (serializedBytes > state.maxSerializedBytes) {
		const session = queries.readOldestSession().rows[0];
		if (!session) break;
		if (deleteOldestSqliteEvents(db, session.session_id, LEDGER_TRIM_EVENT_BATCH) === 0) queries.deleteSession(session.session_id);
		serializedBytes = estimateSqliteLedgerBytes(db);
	}
}
function appendSqliteUpdate(db, state, params) {
	const updateJson = JSON.stringify(params.update);
	const eventBytes = estimateAcpEventRowBytes({
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		...params.runId !== void 0 ? { runId: params.runId } : {},
		updateJson
	});
	const nextSeq = upsertSqliteSession(db, params.createdAt, {
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		cwd: "",
		complete: false
	}, {
		eventBytes,
		at: params.at
	});
	getSqliteLedgerQueries(db).insertEvent({
		sessionId: params.sessionId,
		seq: nextSeq,
		at: params.at,
		sessionKey: params.sessionKey,
		runId: params.runId ?? null,
		updateJson,
		eventBytes
	});
	trimSqliteLedger(db, state);
}
function readSqliteReplay(db, input) {
	const query = getNodeSqliteKysely(db);
	let selected = query.selectFrom("acp_replay_sessions").select(["session_id", "session_key"]).where("complete", "=", 1);
	if (input.kind === "key") selected = selected.where("session_key", "=", input.sessionKey).orderBy("updated_at", "desc").orderBy("session_id", "asc");
	else {
		selected = selected.where("session_id", "=", input.sessionId);
		if (input.kind === "bound") selected = selected.where("session_key", "=", input.sessionKey);
	}
	const rows = executeSqliteQuerySync(db, query.selectFrom(selected.limit(1).as("session")).leftJoin("acp_replay_events as event", "event.session_id", "session.session_id").select([
		"session.session_id as replay_session_id",
		"session.session_key as replay_session_key",
		"event.session_id",
		"event.seq",
		"event.at",
		"event.session_key",
		"event.run_id",
		"event.update_json"
	]).orderBy("event.seq", "asc")).rows;
	const session = rows[0];
	return session ? {
		complete: true,
		sessionId: session.replay_session_id,
		sessionKey: session.replay_session_key,
		events: rows.flatMap((row) => {
			const event = sqliteRowToLedgerEvent(row);
			return event ? [event] : [];
		})
	} : {
		complete: false,
		events: []
	};
}
const acpReplayOperations = {
	"acpReplay.start": (input, { write }) => write((database) => {
		upsertSqliteSession(database.db, input.now, input.session);
		trimSqliteLedger(database.db, input.limits);
	}, { operationLabel: "acp.replay.start" }),
	"acpReplay.append": (input, { write }) => write((database) => {
		for (const event of input.events) appendSqliteUpdate(database.db, input.limits, {
			...event,
			...input.session
		});
	}, { operationLabel: "acp.replay.append" }),
	"acpReplay.incomplete": (input, { write }) => write((database) => {
		executeSqliteQuerySync(database.db, getNodeSqliteKysely(database.db).updateTable("acp_replay_sessions").set({
			complete: 0,
			updated_at: input.now
		}).where("session_id", "=", input.sessionId).where("session_key", "=", input.sessionKey));
	}, { operationLabel: "acp.replay.incomplete" }),
	"acpReplay.read": (input, { open }) => readSqliteReplay(open().db, input)
};
//#endregion
export { acpReplayOperations };
