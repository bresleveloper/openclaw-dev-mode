import "./src-CdRlGRnW.mjs";
import { t as safeParseJson } from "./json-coercion-pfKbZnCJ.mjs";
import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { n as normalizeSqliteNumber } from "./sqlite-number-DZt1m75H.mjs";
//#region src/sessions/session-upstream-links.kernel.ts
function parseJson(value) {
	if (value === null) return null;
	return safeParseJson(value) ?? null;
}
function rowToSessionUpstreamLink(row) {
	return {
		sessionKey: row.session_key,
		agentId: row.agent_id,
		catalogId: row.catalog_id,
		hostId: row.host_id,
		threadId: row.thread_id,
		upstreamKind: row.upstream_kind,
		upstreamRef: parseJson(row.upstream_ref_json),
		marker: parseJson(row.last_marker_json),
		...row.last_scanned_at === null ? {} : { lastScannedAt: normalizeSqliteNumber(row.last_scanned_at) ?? 0 },
		createdAt: normalizeSqliteNumber(row.created_at) ?? 0,
		updatedAt: normalizeSqliteNumber(row.updated_at) ?? 0
	};
}
function listWatchedSessionUpstreamLinksInDatabase(db) {
	return executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("session_upstream_links as links").selectAll("links").where((eb) => eb.exists(eb.selectFrom("session_watch_cursors as cursors").select("cursors.target_session_key").whereRef("cursors.target_session_key", "=", "links.session_key"))).orderBy("links.catalog_id", "asc").orderBy("links.session_key", "asc")).rows.map(rowToSessionUpstreamLink);
}
//#endregion
export { rowToSessionUpstreamLink as n, listWatchedSessionUpstreamLinksInDatabase as t };
