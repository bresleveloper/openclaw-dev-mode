import { r as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-C2YxM4Tj.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-IBx2zWDG.mjs";
import { o as resolveDeliveryProvenCanonicalSessionKey } from "./store-entry-DuM7NmYY.mjs";
import { g as toDatabaseOptions, n as cloneSessionEntry, u as resolveSqliteScope } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
import { h as canonicalSessionKeyMigrationRequiredError } from "./session-canonical-key-BBylVEaq.mjs";
import { d as readSessionEntryCache } from "./session-accessor.sqlite-entry-cache-CtMz7hDz.mjs";
import { t as isInternalSessionEffectsKey } from "./internal-session-key-Xwd1VHk2.mjs";
//#region src/config/sessions/session-accessor.sqlite-entry-list.read.ts
/**
* Lists session entries without opening the agent database writable.
* Transient lock errors propagate: only the caller knows whether "empty" is an
* acceptable degradation (health snapshots) or hides real state (migration detection).
*/
function listSessionEntriesReadOnly(scope = {}, options = {}) {
	const resolved = resolveSqliteScope({
		...scope,
		sessionKey: ""
	});
	const result = withOpenClawAgentDatabaseReadOnly((database) => listSqliteSessionEntriesFromDatabase(database, resolved, scope, options), toDatabaseOptions(resolved));
	return result.found ? result.value : [];
}
function listSqliteSessionEntriesFromDatabase(database, resolved, scope, options = {}) {
	const projection = scope.projection ?? "full";
	const cache = !isIncognitoOpenClawAgentSqlitePath(database.path, {
		agentId: database.agentId,
		env: resolved.env
	});
	const snapshot = readSessionEntryCache(database, {
		cache,
		latest: scope.readConsistency === "latest",
		projection,
		deferParticipants: options.deferParticipants
	});
	return Array.from(iterateSessionEntriesForListing(snapshot, projection === "list" && scope.clone !== false, scope.sessionKeys ? new Set(scope.sessionKeys) : void 0));
}
/** Applies the listing visibility and canonical-key contract to an owned snapshot. */
function* iterateSessionEntriesForListing(snapshot, cloneEntries = false, sessionKeys) {
	for (const sessionKey of snapshot.keys) {
		if (isInternalSessionEffectsKey(sessionKey)) continue;
		const entry = snapshot.entries.get(sessionKey);
		if (!entry) continue;
		const deliveryCanonicalKey = resolveDeliveryProvenCanonicalSessionKey(sessionKey, entry);
		if (deliveryCanonicalKey !== sessionKey) throw canonicalSessionKeyMigrationRequiredError(`non-canonical persisted row resolves to session key ${deliveryCanonicalKey}`);
		if (sessionKeys && !sessionKeys.has(sessionKey)) continue;
		yield {
			sessionKey,
			entry: cloneEntries ? cloneSessionEntry(entry) : entry
		};
	}
}
//#endregion
export { listSessionEntriesReadOnly as n, listSqliteSessionEntriesFromDatabase as r, iterateSessionEntriesForListing as t };
