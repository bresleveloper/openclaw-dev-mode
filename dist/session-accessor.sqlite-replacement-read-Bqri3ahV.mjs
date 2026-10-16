import { y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { r as executeSqliteQuerySync, u as sqliteStringSet } from "./kysely-sync-K7ftY-g4.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { r as assertCanonicalSqliteSessionKeysCurrent } from "./session-canonical-key-D1TSJMmX.mjs";
import { a as readExactSessionEntryRow, r as prepareExactSessionEntryRowReads } from "./session-accessor.sqlite-entry-read-CWTZjXLR.mjs";
import { t as iterateSessionEntryKeys } from "./session-accessor.sqlite-entry-inventory-DQ3Ihq0l.mjs";
//#region src/config/sessions/session-accessor.sqlite-replacement-read.ts
function readSessionEntryReplacementLabelOwnerKeys(database, label) {
	return label === void 0 ? [] : executeSqliteQuerySync(database.db, getSessionKysely(database.db).selectFrom("session_nodes").select("session_key").where("label", "=", label).orderBy("session_key")).rows.map((row) => row.session_key);
}
function selectReplacementKeys(database, params, labelOwnerKeys) {
	if (params.statuses) {
		if (params.statuses.length === 0) return [];
		let query = getSessionKysely(database.db).selectFrom("session_nodes").select("session_key").where("status", "in", params.statuses);
		if (params.sessionKeys) query = query.where("session_key", "in", sqliteStringSet(params.sessionKeys));
		return executeSqliteQuerySync(database.db, query).rows.map((row) => row.session_key).toSorted((left, right) => left.localeCompare(right));
	}
	if (params.sessionKeys) return uniqueStrings([...params.sessionKeys, ...labelOwnerKeys]);
	assertCanonicalSqliteSessionKeysCurrent(database);
	return [...iterateSessionEntryKeys(database)];
}
/** Detached entries and their CAS bytes must come from the same admitted read snapshot. */
function readSessionEntryReplacementState(database, params) {
	const selectedKeys = params.sessionKeys ? new Set(params.sessionKeys) : void 0;
	const selectedStatuses = params.statuses ? new Set(params.statuses) : void 0;
	const labelOwnerKeys = readSessionEntryReplacementLabelOwnerKeys(database, params.includeLabelOwners);
	const selected = selectReplacementKeys(database, params, labelOwnerKeys);
	const expectedRows = /* @__PURE__ */ new Map();
	const readPrepared = selected.length > 1 ? prepareExactSessionEntryRowReads(database, selected) : void 0;
	return {
		entries: selected.flatMap((sessionKey) => {
			const row = readPrepared ? readPrepared(sessionKey) : readExactSessionEntryRow(database, sessionKey);
			if (!row) {
				if (!selectedKeys || selectedStatuses) throw new Error(`SQLite session entry changed before replacement for ${sessionKey}`);
				return [];
			}
			if (selectedStatuses && (!row.entry.status || !selectedStatuses.has(row.entry.status))) return [];
			expectedRows.set(sessionKey, row);
			return [{
				entry: structuredClone(row.entry),
				sessionKey
			}];
		}),
		expectedRows,
		labelOwnerKeys
	};
}
//#endregion
export { readSessionEntryReplacementState as n, readSessionEntryReplacementLabelOwnerKeys as t };
