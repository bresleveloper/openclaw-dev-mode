import { i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import "./openclaw-agent-db-DBug3LUA.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C4wDuLrp.mjs";
import { i as toDatabaseOptions, t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { o as resolveSqliteReadScope, s as resolveSqliteScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { r as assertCanonicalSqliteSessionKeysCurrent } from "./session-canonical-key-D1TSJMmX.mjs";
import { i as prepareSqliteSessionEntryRowDecoder, o as readExactSessionEntryRowValidated } from "./session-accessor.sqlite-entry-read-CWTZjXLR.mjs";
import "./session-accessor.sqlite-entry-store-Ca60AZ39.mjs";
import { t as chunkItems } from "./chunk-items-2QWieLm-.mjs";
//#region src/config/sessions/session-accessor.sqlite-entry-availability.ts
/** Exact persisted-key probe that preserves database and row availability. */
function loadExactSessionEntryReadOnlyResult(scope) {
	const sessionKey = scope.sessionKey.trim();
	if (!sessionKey) return {
		found: true,
		value: void 0
	};
	const resolved = resolveSqliteScope(scope);
	let result;
	try {
		result = withOpenClawAgentDatabaseReadOnly((database) => {
			const entry = readExactSessionEntryRowValidated(database, sessionKey)?.entry;
			return {
				entry,
				rowExists: entry ? true : Boolean(executeSqliteQueryTakeFirstSync(database.db, getSessionKysely(database.db).selectFrom("session_nodes").select("session_key").where("session_key", "=", sessionKey)))
			};
		}, toDatabaseOptions(resolved));
	} catch (error) {
		if (error instanceof Error && error.code === "SESSION_CANONICAL_KEY_MIGRATION_REQUIRED") return {
			found: false,
			reason: "row-invalid"
		};
		throw error;
	}
	if (!result.found) return result;
	if (!result.value.entry) return result.value.rowExists ? {
		found: false,
		reason: "row-invalid"
	} : {
		found: true,
		value: void 0
	};
	return {
		found: true,
		value: {
			sessionKey,
			entry: result.value.entry
		}
	};
}
const SESSION_IDENTITY_EVIDENCE_QUERY_CHUNK_SIZE = 400;
function readSessionIdentityEvidenceInDatabase(database, items) {
	assertCanonicalSqliteSessionKeysCurrent(database);
	const db = getSessionKysely(database.db);
	const rowsByKey = /* @__PURE__ */ new Map();
	const readChunks = (values, column) => {
		for (const chunk of chunkItems(values, SESSION_IDENTITY_EVIDENCE_QUERY_CHUNK_SIZE)) {
			const rows = executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").select([
				"current_session_id",
				"entry_valid",
				"session_key",
				"updated_at"
			]).select("entry_json").where(column, "in", chunk)).rows;
			for (const row of rows) rowsByKey.set(row.session_key, row);
		}
	};
	readChunks([...new Set(items.flatMap((item) => item.sessionKey ? [item.sessionKey] : []))], "session_key");
	const fallbackIds = items.flatMap((item) => {
		const exactRow = item.sessionKey ? rowsByKey.get(item.sessionKey) : void 0;
		return exactRow?.entry_valid === 1 && exactRow.current_session_id === item.sessionId ? [] : [item.sessionId];
	});
	readChunks([...new Set(fallbackIds)], "current_session_id");
	const rowsBySessionId = /* @__PURE__ */ new Map();
	const readableKeys = /* @__PURE__ */ new Set();
	const decodeRow = prepareSqliteSessionEntryRowDecoder(database, [...rowsByKey.values()].filter((row) => row.entry_valid === 1), "list");
	for (const row of rowsByKey.values()) {
		const rows = rowsBySessionId.get(row.current_session_id) ?? [];
		rows.push(row);
		rowsBySessionId.set(row.current_session_id, rows);
		if (row.entry_valid === 1) try {
			if (decodeRow(row)) readableKeys.add(row.session_key);
		} catch {}
	}
	return items.map((item) => {
		const exactRow = item.sessionKey ? rowsByKey.get(item.sessionKey) : void 0;
		if (exactRow && exactRow.entry_valid !== -1 && !readableKeys.has(exactRow.session_key)) return {
			status: "unknown",
			reason: "row-invalid"
		};
		if (exactRow && readableKeys.has(exactRow.session_key) && exactRow.current_session_id === item.sessionId) return {
			status: "current",
			sessionKey: exactRow.session_key
		};
		const fallbackRows = rowsBySessionId.get(item.sessionId) ?? [];
		if (fallbackRows.length !== 1) return fallbackRows.length === 0 ? { status: "absent" } : {
			status: "unknown",
			reason: "ambiguous"
		};
		const fallbackRow = fallbackRows[0];
		if (fallbackRow?.entry_valid === 1 && readableKeys.has(fallbackRow.session_key)) return {
			status: "current",
			sessionKey: fallbackRow.session_key
		};
		return fallbackRow?.entry_valid === -1 ? { status: "absent" } : {
			status: "unknown",
			reason: "row-invalid"
		};
	});
}
/** Reads indexed identity evidence once per physical store and in SQLite-sized chunks. */
function readSessionIdentityEvidenceBatch(probes) {
	const results = probes.map(() => ({
		status: "unknown",
		reason: "read-failed"
	}));
	const groups = /* @__PURE__ */ new Map();
	const targetCache = /* @__PURE__ */ new Map();
	for (const [index, probe] of probes.entries()) try {
		const resolved = resolveSqliteReadScope(probe, targetCache);
		const options = toDatabaseOptions(resolved);
		const databasePath = resolveOpenClawAgentSqlitePath(options);
		const group = groups.get(databasePath) ?? {
			items: [],
			options
		};
		group.items.push({
			index,
			sessionId: probe.sessionId,
			sessionKey: resolved.sessionKey
		});
		groups.set(databasePath, group);
	} catch {}
	for (const group of groups.values()) {
		let read;
		try {
			read = withOpenClawAgentDatabaseReadOnly((database) => readSessionIdentityEvidenceInDatabase(database, group.items), group.options);
		} catch {
			continue;
		}
		if (read.found) {
			for (const [itemIndex, item] of group.items.entries()) results[item.index] = read.value[itemIndex] ?? {
				status: "unknown",
				reason: "read-failed"
			};
			continue;
		}
		const unavailable = read.reason === "database-missing" ? { status: "absent" } : {
			status: "unknown",
			reason: read.reason
		};
		for (const item of group.items) results[item.index] = unavailable;
	}
	return results;
}
//#endregion
export { readSessionIdentityEvidenceBatch as n, readSessionIdentityEvidenceInDatabase as r, loadExactSessionEntryReadOnlyResult as t };
