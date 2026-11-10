import "./src-Djeo9OvP.mjs";
import { t as safeParseJson } from "./json-coercion-pfKbZnCJ.mjs";
import { i as sqlPublicationAnchor } from "./sql-connection-DmQzXTVz.mjs";
import { c as registerNodeSqliteDisposeCallback } from "./kysely-sync-cache-state-Dc7tna9E.mjs";
import { a as getSqliteReadOperationRevision } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, n as createSqliteQueryCache, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { n as normalizeSqliteNumber } from "./sqlite-number-DZt1m75H.mjs";
import { isDeepStrictEqual } from "node:util";
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
function getSessionUpstreamKysely(db) {
	return getNodeSqliteKysely(db);
}
const upstreamLinkQuery = createSqliteQueryCache((db) => {
	let retained;
	registerNodeSqliteDisposeCallback(sqlPublicationAnchor(db), () => {
		retained = void 0;
	});
	return (key) => {
		const revision = getSqliteReadOperationRevision(db);
		if (revision && retained?.revision === revision && retained.sessionKey === key.sessionKey && retained.agentId === key.agentId) return retained.row;
		retained = void 0;
		const row = executeSqliteQueryTakeFirstSync(db, getSessionUpstreamKysely(db).selectFrom("session_upstream_links").selectAll().where("session_key", "=", key.sessionKey).where("agent_id", "=", key.agentId));
		if (revision) retained = {
			...key,
			revision,
			row
		};
		return row;
	};
});
function readSessionUpstreamLinkInDatabase(db, sessionKey, agentId) {
	const row = upstreamLinkQuery(db)({
		sessionKey,
		agentId
	});
	return row ? rowToSessionUpstreamLink(row) : void 0;
}
function upsertSessionUpstreamLinkInDatabase(db, input, now, ifAbsent) {
	return executeSqliteQuerySync(db, getSessionUpstreamKysely(db).insertInto("session_upstream_links").values({
		session_key: input.sessionKey,
		agent_id: input.agentId,
		catalog_id: input.catalogId,
		host_id: input.hostId,
		thread_id: input.threadId,
		upstream_kind: input.upstreamKind,
		upstream_ref_json: JSON.stringify(input.upstreamRef),
		last_marker_json: JSON.stringify(input.marker),
		last_scanned_at: null,
		created_at: now,
		updated_at: now
	}).onConflict((conflict) => ifAbsent ? conflict.columns(["session_key", "agent_id"]).doNothing() : conflict.columns(["session_key", "agent_id"]).doUpdateSet((eb) => {
		const sourceChanged = eb.or([
			eb("session_upstream_links.thread_id", "!=", eb.ref("excluded.thread_id")),
			eb("session_upstream_links.host_id", "!=", eb.ref("excluded.host_id")),
			eb("session_upstream_links.upstream_kind", "!=", eb.ref("excluded.upstream_kind")),
			eb("session_upstream_links.upstream_ref_json", "!=", eb.ref("excluded.upstream_ref_json"))
		]);
		return {
			agent_id: input.agentId,
			catalog_id: input.catalogId,
			host_id: input.hostId,
			thread_id: input.threadId,
			upstream_kind: input.upstreamKind,
			upstream_ref_json: JSON.stringify(input.upstreamRef),
			last_marker_json: eb.case().when(sourceChanged).then(JSON.stringify(input.marker)).else(eb.ref("session_upstream_links.last_marker_json")).end(),
			last_scanned_at: eb.case().when(sourceChanged).then(null).else(eb.ref("session_upstream_links.last_scanned_at")).end(),
			updated_at: now
		};
	}))).numAffectedRows === 1n;
}
function deleteSessionUpstreamLinkInDatabase(db, sessionKey, agentId, expected) {
	if (expected) {
		const current = readSessionUpstreamLinkInDatabase(db, sessionKey, agentId);
		if (!current) return "absent";
		if (!isDeepStrictEqual(current, expected)) return "changed";
	}
	executeSqliteQuerySync(db, getSessionUpstreamKysely(db).deleteFrom("session_upstream_links").where("session_key", "=", sessionKey).where("agent_id", "=", agentId));
	return "deleted";
}
function sessionUpstreamLinkSourceMatches(current, expected) {
	return current !== void 0 && current.sessionKey === expected.sessionKey && current.agentId === expected.agentId && current.catalogId === expected.catalogId && current.hostId === expected.hostId && current.threadId === expected.threadId && current.upstreamKind === expected.upstreamKind && isDeepStrictEqual(current.upstreamRef, expected.upstreamRef);
}
//#endregion
export { upsertSessionUpstreamLinkInDatabase as a, sessionUpstreamLinkSourceMatches as i, listWatchedSessionUpstreamLinksInDatabase as n, readSessionUpstreamLinkInDatabase as r, deleteSessionUpstreamLinkInDatabase as t };
