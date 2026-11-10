import { i as getAdmittedSqliteSchemaFacts } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, p as sql } from "./kysely-sync-9fPQaMlh.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { F as hasPendingInputConsumptionColumn } from "./openclaw-agent-db-validation-cache-9WCf6XyJ.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { o as resolvePendingInputHistoryLimit, s as selectPendingInputHistoryPage } from "./session-pending-input-value-CPY0B7Hg.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { t as assertCapturedSessionEntryReadSource } from "./session-entry-read-source-CtAlEtSu.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
//#region src/config/sessions/session-pending-input-history.kernel.ts
/** The admitted reader owns the snapshot; process-held incognito uses the same kernel. */
function readPendingInputHistoryInDatabase(database, query) {
	return runSqliteDeferredTransactionSync(database.db, () => {
		const schema = getAdmittedSqliteSchemaFacts(database.db);
		if (!schema) throw new Error("Pending input history requires admitted schema facts");
		if (!schema.tableSql.get("session_pending_inputs")) return {
			rows: [],
			total: 0
		};
		const db = getSessionKysely(database.db);
		let base = db.selectFrom("session_pending_inputs").where("session_key", "=", query.sessionKey).where("session_id", "=", query.sessionId);
		if (hasPendingInputConsumptionColumn(database.db)) base = base.where("consumed_event_id", "is", null);
		const total = query.id === void 0 ? executeSqliteQueryTakeFirstSync(database.db, base.select(db.fn.count("input_id").as("total")))?.total ?? 0 : void 0;
		if (total === 0) return {
			rows: [],
			total
		};
		const limit = resolvePendingInputHistoryLimit(query.limit);
		let page = base.orderBy("seq", "desc").limit(limit + 1);
		if (query.before !== void 0) page = page.where("seq", "<", query.before);
		if (query.id !== void 0) page = page.where("input_id", "=", query.id);
		const metadata = executeSqliteQuerySync(database.db, page.select([
			"seq",
			db.selectFrom("session_nodes").select("current_session_id").where("session_key", "=", query.sessionKey).as("current_session_id"),
			sql`OCTET_LENGTH(message_json)`.as("serialized_bytes")
		])).rows;
		const { selected, nextBefore } = selectPendingInputHistoryPage(metadata, limit);
		return {
			rows: selected.length ? executeSqliteQuerySync(database.db, base.selectAll().where("seq", "in", selected)).rows.toSorted((a, b) => b.seq - a.seq) : [],
			total,
			currentSessionId: metadata[0]?.current_session_id ?? void 0,
			nextBefore
		};
	});
}
//#endregion
//#region src/config/sessions/session-pending-input-history-read.worker.ts
function readPendingInputHistoryInWorker(request) {
	const read = withOpenClawAgentDatabaseReadOnly((database) => {
		assertCapturedSessionEntryReadSource(request.source, database);
		return readPendingInputHistoryInDatabase(database, request.query);
	}, {
		...request.database,
		env: request.env
	});
	return read.found ? read.value : {
		rows: [],
		total: 0
	};
}
//#endregion
export { readPendingInputHistoryInWorker };
