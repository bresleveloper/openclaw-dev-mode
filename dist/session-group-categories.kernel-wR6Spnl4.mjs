import { f as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { a as readExactSessionEntryRow, r as prepareExactSessionEntryRowReads } from "./session-accessor.sqlite-entry-read-CWTZjXLR.mjs";
import { n as readSessionGroupCatalogEntry } from "./session-group-catalog.kernel-5Y9zUvVe.mjs";
import { r as sqliteSessionEntriesEqual } from "./session-accessor.sqlite-entry-equality-7UlL8HUK.mjs";
import { d as writeSessionEntry } from "./session-accessor.sqlite-entry-store-Ca60AZ39.mjs";
import { t as readSessionGroupCategoryKeys } from "./session-group-categories.read-D10j5H75.mjs";
//#region src/config/sessions/session-group-categories.kernel.ts
const MIN_BATCHED_CATEGORY_KEYS = 10;
function prepareSessionGroupCategoryMutation(database, name) {
	const rows = /* @__PURE__ */ new Map();
	const keys = readSessionGroupCategoryKeys(database, name);
	const readPrepared = keys.length >= MIN_BATCHED_CATEGORY_KEYS ? prepareExactSessionEntryRowReads(database, keys) : void 0;
	for (const key of keys) {
		const row = readPrepared ? readPrepared(key) : readExactSessionEntryRow(database, key);
		if (row?.entry.category?.trim() === name) rows.set(key, row);
	}
	return rows;
}
function applySessionGroupCategoryMutation(database, expected, to, env) {
	const current = /* @__PURE__ */ new Map();
	const readPrepared = expected.size >= MIN_BATCHED_CATEGORY_KEYS ? prepareExactSessionEntryRowReads(database, [...expected.keys()]) : void 0;
	for (const [key, before] of expected) {
		const row = readPrepared ? readPrepared(key) : readExactSessionEntryRow(database, key);
		if (!row || row.row.entry_json !== before.row.entry_json || !sqliteSessionEntriesEqual(row.entry, before.entry)) throw new Error(`SQLite session entry changed before replacement for ${key}`);
		current.set(key, row);
	}
	assertSessionGroupCategoryDestination(to, env);
	for (const [key, row] of current) {
		const next = { ...row.entry };
		if (to === void 0) delete next.category;
		else next.category = to;
		writeSessionEntry(database, key, next, {
			canonicalPreviousEntry: row.entry,
			previousEntry: row.entry
		});
	}
	return [...current].map(([sessionKey, { entry }]) => ({
		sessionKey,
		sessionId: entry.sessionId
	}));
}
function assertSessionGroupCategoryDestination(to, env) {
	if (to !== void 0 && !withExistingOpenClawStateDatabaseReadOnly(({ db }) => readSessionGroupCatalogEntry(db, to), { env })) throw new Error(`unknown session group: ${to}`);
}
//#endregion
export { assertSessionGroupCategoryDestination as n, prepareSessionGroupCategoryMutation as r, applySessionGroupCategoryMutation as t };
