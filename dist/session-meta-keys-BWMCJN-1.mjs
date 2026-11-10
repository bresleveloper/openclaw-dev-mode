import { i as sqlPublicationAnchor } from "./sql-connection-DmQzXTVz.mjs";
import { b as publishSqliteDatabaseAdmission, c as getSqliteDatabaseAdmission, s as getOrLoadSqliteDatabaseAdmissionForPath } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { s as stageSqliteTransactionState } from "./sqlite-post-commit-22SfWsLt.mjs";
import "./sqlite-schema-facts-C8u_9Af1.mjs";
import { a as executeSqliteQueryTakeFirstSync, d as sqliteStringSet, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-CUxN9KZj.mjs";
//#region src/acp/runtime/session-meta-keys.ts
const MAX_RETAINED_ACP_SESSION_ROWS = 128;
const metadataReceipt = {
	name: "acp.metadata",
	schemaDependent: true,
	read(value) {
		return value instanceof Map ? value : void 0;
	}
};
const pendingMetadataChanges = /* @__PURE__ */ new WeakMap();
function publishAcpMetadataRows(db, rows, preservePublishedRows = false) {
	if (rows.length === 0) return;
	const anchor = sqlPublicationAnchor(db);
	const previous = pendingMetadataChanges.get(anchor);
	const receipt = new Map(previous ?? getSqliteDatabaseAdmission(db, metadataReceipt));
	let changed = false;
	for (const [key, row] of rows) {
		if (preservePublishedRows && receipt.has(key)) continue;
		changed = true;
		receipt.delete(key);
		receipt.set(key, row);
	}
	if (!changed) return;
	while (receipt.size > MAX_RETAINED_ACP_SESSION_ROWS) receipt.delete(receipt.keys().next().value);
	const commit = () => {
		pendingMetadataChanges.delete(anchor);
	};
	if (!stageSqliteTransactionState(anchor, {
		stage: () => pendingMetadataChanges.set(anchor, receipt),
		commit,
		rollback: () => {
			if (previous) pendingMetadataChanges.set(anchor, previous);
			else pendingMetadataChanges.delete(anchor);
		}
	})) commit();
	publishSqliteDatabaseAdmission(db, metadataReceipt, receipt);
}
/** Host readers consume admitted rows and committed postimages; uncovered keys use the worker. */
function readPublishedAcpSessionRows(databasePath, entries) {
	const rows = getOrLoadSqliteDatabaseAdmissionForPath(databasePath, metadataReceipt, () => void 0);
	if (!rows || entries.some(({ keys }) => keys.some((key) => !rows.has(key)))) return;
	return entries.map(({ keys, entry }) => {
		const row = keys.map((key) => rows.get(key)).find((candidate) => candidate && acpSessionRowMatchesEntry(candidate, entry));
		return row ? { ...row } : null;
	});
}
function getAcpSessionKysely(db) {
	return getNodeSqliteKysely(db);
}
function selectAcpSessionRows(db) {
	return executeSqliteQuerySync(db, getAcpSessionKysely(db).selectFrom("acp_sessions").selectAll().orderBy("last_activity_at", "desc").orderBy("session_key", "asc")).rows;
}
function selectAcpSessionRow(db, sessionKey) {
	return executeSqliteQueryTakeFirstSync(db, getAcpSessionKysely(db).selectFrom("acp_sessions").selectAll().where("session_key", "=", sessionKey));
}
const ACP_DATABASE_KEY_PREFIX = "@acp:v1:";
function buildAcpDatabaseSessionKey(storeSessionKey, agentId) {
	const normalizedKey = storeSessionKey.trim();
	const identity = [agentId ? normalizeAgentId(agentId) : null, normalizedKey];
	return `${ACP_DATABASE_KEY_PREFIX}${Buffer.from(JSON.stringify(identity), "utf8").toString("base64url")}`;
}
function parseAcpDatabaseSessionKey(sessionKey) {
	if (!sessionKey.startsWith(ACP_DATABASE_KEY_PREFIX)) return;
	try {
		const decoded = JSON.parse(Buffer.from(sessionKey.slice(8), "base64url").toString("utf8"));
		if (Array.isArray(decoded) && decoded.length === 2 && (decoded[0] === null || typeof decoded[0] === "string") && typeof decoded[1] === "string") {
			const identity = {
				...decoded[0] ? { agentId: normalizeAgentId(decoded[0]) } : {},
				storeSessionKey: decoded[1]
			};
			return buildAcpDatabaseSessionKey(identity.storeSessionKey, identity.agentId) === sessionKey ? identity : void 0;
		}
	} catch {}
}
function acpSessionRowMatchesEntry(row, entry) {
	return row.session_id == null || row.session_id === entry?.lifecycleRevision || row.session_id === entry?.sessionId && (entry?.sessionStartedAt === void 0 || row.updated_at >= entry.sessionStartedAt);
}
function selectAcpSessionRowForStoreEntry(db, storeSessionKey, agentId, entry) {
	const key = normalizeStoreSessionKey(storeSessionKey);
	return selectAcpSessionRowForRead(db, {
		keys: [buildAcpDatabaseSessionKey(key, agentId ?? parseAgentSessionKey(key)?.agentId)],
		entry
	});
}
function selectAcpSessionRowForRead(db, { keys, entry }) {
	for (const key of keys) {
		const row = selectAcpSessionRow(db, key);
		if (row && (!entry || acpSessionRowMatchesEntry(row, entry))) return row;
	}
}
function resolveReadableAcpSessionRow(params) {
	const { row, entry } = params;
	return row && acpSessionRowMatchesEntry(row, entry) ? row : void 0;
}
function upsertAcpSessionMetaRow(db, row) {
	const written = executeSqliteQueryTakeFirstSync(db, getAcpSessionKysely(db).insertInto("acp_sessions").values(row).onConflict((conflict) => conflict.column("session_key").doUpdateSet({
		session_id: (eb) => eb.ref("excluded.session_id"),
		backend: (eb) => eb.ref("excluded.backend"),
		agent: (eb) => eb.ref("excluded.agent"),
		runtime_session_name: (eb) => eb.ref("excluded.runtime_session_name"),
		identity_json: (eb) => eb.ref("excluded.identity_json"),
		resume_agent_session_id: (eb) => eb.ref("excluded.resume_agent_session_id"),
		resume_acpx_session_id: (eb) => eb.ref("excluded.resume_acpx_session_id"),
		mode: (eb) => eb.ref("excluded.mode"),
		runtime_options_json: (eb) => eb.ref("excluded.runtime_options_json"),
		cwd: (eb) => eb.ref("excluded.cwd"),
		state: (eb) => eb.ref("excluded.state"),
		last_activity_at: (eb) => eb.ref("excluded.last_activity_at"),
		last_error: (eb) => eb.ref("excluded.last_error"),
		updated_at: (eb) => eb.ref("excluded.updated_at")
	})).returningAll());
	if (written) publishAcpMetadataRows(db, [[written.session_key, written]]);
	return written;
}
function deleteAcpSessionMetaRows(db, keys) {
	if (keys.length === 0) return;
	const deleted = executeSqliteQuerySync(db, getAcpSessionKysely(db).deleteFrom("acp_sessions").where("session_key", "in", sqliteStringSet(keys)).returning("session_key")).rows;
	publishAcpMetadataRows(db, deleted.map((row) => [row.session_key, void 0]));
}
//#endregion
export { parseAcpDatabaseSessionKey as a, selectAcpSessionRow as c, selectAcpSessionRows as d, upsertAcpSessionMetaRow as f, getAcpSessionKysely as i, selectAcpSessionRowForRead as l, buildAcpDatabaseSessionKey as n, readPublishedAcpSessionRows as o, deleteAcpSessionMetaRows as r, resolveReadableAcpSessionRow as s, acpSessionRowMatchesEntry as t, selectAcpSessionRowForStoreEntry as u };
