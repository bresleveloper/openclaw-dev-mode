import { r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { t as isInternalSessionEffectsKey } from "./internal-session-key-CPayZwJR.mjs";
import { a as selectSessionEntryRows, r as parseSessionEntryJson } from "./session-accessor.sqlite-status-zTXzk4Sy.mjs";
import { r as assertCanonicalSqliteSessionKeysCurrent } from "./session-canonical-key-D1TSJMmX.mjs";
import { f as validateDeliveryCanonicalSessionEntry } from "./session-accessor.sqlite-entry-read-CWTZjXLR.mjs";
//#region src/config/sessions/session-group-categories.read.ts
function readSessionGroupCategoryKeys(database, name) {
	assertCanonicalSqliteSessionKeysCurrent(database);
	return executeSqliteQuerySync(database.db, selectSessionEntryRows(database, "list").orderBy("session_key")).rows.flatMap((row) => {
		if (isInternalSessionEffectsKey(row.session_key)) return [];
		const entry = parseSessionEntryJson(row, "list");
		if (!entry) return [];
		validateDeliveryCanonicalSessionEntry(row.session_key, entry);
		return entry.category?.trim() === name ? [row.session_key] : [];
	});
}
//#endregion
export { readSessionGroupCategoryKeys as t };
