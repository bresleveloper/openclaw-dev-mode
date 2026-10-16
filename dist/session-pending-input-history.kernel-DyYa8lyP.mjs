import { d as sql, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { n as getAdmittedSqliteSchemaFacts } from "./sqlite-schema-facts-CG0Tk84j.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { u as parseSqliteTableDefinition } from "./sqlite-schema-contract-BTxZz0OV.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import "./server-constants-BH_EolwD.mjs";
//#region src/config/sessions/session-pending-input-history.kernel.ts
/** The admitted reader owns the snapshot; process-held incognito uses the same kernel. */
function readPendingInputHistoryInDatabase(database, query) {
	return runSqliteDeferredTransactionSync(database.db, () => {
		const schema = getAdmittedSqliteSchemaFacts(database.db);
		if (!schema) throw new Error("Pending input history requires admitted schema facts");
		const table = schema.tableSql.get("session_pending_inputs");
		if (!table) return {
			rows: [],
			total: 0
		};
		const hasConsumption = parseSqliteTableDefinition(table, "session_pending_inputs").columns.has("consumed_event_id");
		const db = getSessionKysely(database.db);
		let base = db.selectFrom("session_pending_inputs").where("session_key", "=", query.sessionKey).where("session_id", "=", query.sessionId);
		if (hasConsumption) base = base.where("consumed_event_id", "is", null);
		const total = query.id === void 0 ? executeSqliteQueryTakeFirstSync(database.db, base.select(db.fn.count("input_id").as("total")))?.total ?? 0 : void 0;
		const limit = Math.max(1, Math.min(20, Math.trunc(query.limit ?? 20)));
		let page = base.orderBy("seq", "desc").limit(limit + 1);
		if (query.before !== void 0) page = page.where("seq", "<", query.before);
		if (query.id !== void 0) page = page.where("input_id", "=", query.id);
		const metadata = executeSqliteQuerySync(database.db, page.select([
			"seq",
			db.selectFrom("session_nodes").select("current_session_id").where("session_key", "=", query.sessionKey).as("current_session_id"),
			sql`OCTET_LENGTH(message_json)`.as("serialized_bytes")
		])).rows;
		const selected = [];
		let bytes = 0;
		for (const row of metadata) {
			if (selected.length === limit || bytes + row.serialized_bytes > 26214400) break;
			selected.push(row.seq);
			bytes += row.serialized_bytes;
		}
		if (metadata.length && !selected.length) throw new Error("Stored pending input exceeds the Gateway payload limit");
		return {
			rows: selected.length ? executeSqliteQuerySync(database.db, base.selectAll().where("seq", "in", selected)).rows.toSorted((a, b) => b.seq - a.seq) : [],
			total,
			currentSessionId: metadata[0]?.current_session_id ?? void 0,
			nextBefore: selected.length < metadata.length ? selected.at(-1) : void 0
		};
	});
}
//#endregion
export { readPendingInputHistoryInDatabase as t };
