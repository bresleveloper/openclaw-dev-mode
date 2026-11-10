import { i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { r as isRecentSessionMaintenanceEntry } from "./store-maintenance-activity-ayV6kicm.mjs";
import { n as parseSessionEntryJson } from "./session-accessor.sqlite-status-B58ALiNV.mjs";
//#region src/config/sessions/session-accessor.sqlite-history-recency.ts
function* recentSessionHistoryIds(params, sessionId) {
	if (params.preserveRecentMs == null) return;
	const db = getNodeSqliteKysely(params.database.db);
	const rows = executeSqliteQuerySync(params.database.db, db.selectFrom("session_windows").innerJoin("session_nodes", "session_nodes.session_key", "session_windows.session_key").select([
		"session_nodes.current_session_id",
		"session_nodes.session_key",
		"session_nodes.updated_at",
		"session_nodes.entry_json",
		"session_windows.session_id"
	]).$if(sessionId !== void 0, (query) => query.where("session_windows.session_id", "=", sessionId))).rows;
	for (const row of rows) {
		const entry = parseSessionEntryJson(row);
		if (entry && isRecentSessionMaintenanceEntry({
			key: row.session_key,
			entry,
			preserveRecentMs: params.preserveRecentMs
		})) yield row.session_id;
	}
}
function collectRecentSessionHistoryIds(params) {
	return new Set(recentSessionHistoryIds(params));
}
function isRecentHistoricalSessionId(params) {
	return !recentSessionHistoryIds(params, params.sessionId).next().done;
}
//#endregion
export { isRecentHistoricalSessionId as n, collectRecentSessionHistoryIds as t };
