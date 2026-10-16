import { a as getNodeSqliteKysely, r as executeSqliteQuerySync, u as sqliteStringSet } from "./kysely-sync-K7ftY-g4.mjs";
import { a as withSqlitePostCommitPublications } from "./sqlite-post-commit-CQ_AyDCk.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { M as parseAgentSessionKey, x as isCronRunSessionKey } from "./session-key-C09ow4h0.mjs";
import { i as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C4wDuLrp.mjs";
import { o as resolveDeliveryProvenCanonicalSessionKey } from "./store-entry-Bb_svqyv.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { s as resolveSqliteScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { t as isInternalSessionEffectsKey } from "./internal-session-key-CPayZwJR.mjs";
import { a as selectSessionEntryRows, r as parseSessionEntryJson } from "./session-accessor.sqlite-status-zTXzk4Sy.mjs";
import { s as readSessionEntryCache } from "./session-accessor.sqlite-entry-cache-nS4OEr3G.mjs";
import { c as hasCanonicalSessionValidationProjection, d as readWithCanonicalSessionReaderContinuation, g as canonicalSessionKeyMigrationRequiredError, r as assertCanonicalSqliteSessionKeysCurrent } from "./session-canonical-key-D1TSJMmX.mjs";
import { f as validateDeliveryCanonicalSessionEntry } from "./session-accessor.sqlite-entry-read-CWTZjXLR.mjs";
//#region src/config/sessions/session-accessor.sqlite-entry-list.read.ts
/** Select listing facts without hydrating the store; creation retains only its target payloads. */
function readSelectedSessionEntriesInDatabase(database, sessionKeys, options = {}) {
	return readWithCanonicalSessionReaderContinuation(database, options.continuation, () => {
		assertCanonicalSqliteSessionKeysCurrent(database);
		const keys = new Set(sessionKeys);
		const fullEntryKeys = new Set(options.fullEntryKeys);
		const query = selectSessionEntryRows(database, "list", options.fullEntryKeys).select("updated_at");
		const db = getNodeSqliteKysely(database.db);
		const pending = db.selectFrom("session_canonical_validation_pending").select("session_key");
		let selected = db.selectFrom("session_nodes").select("session_key").where("session_key", "in", sqliteStringSet(sessionKeys));
		if (options.label !== void 0) selected = selected.union(db.selectFrom("session_nodes").select("session_key").where("label", "=", options.label.trim()));
		const rows = executeSqliteQuerySync(database.db, hasCanonicalSessionValidationProjection(database) ? query.where("session_key", "in", pending.union(selected)) : query).rows;
		const entries = [];
		for (const row of rows) {
			if (isInternalSessionEffectsKey(row.session_key)) continue;
			const entry = parseSessionEntryJson(row, fullEntryKeys.has(row.session_key) ? "full" : "list");
			if (!entry) continue;
			validateDeliveryCanonicalSessionEntry(row.session_key, entry);
			if (keys.has(row.session_key) || options.label !== void 0 && entry.label === options.label) entries.push({
				sessionKey: row.session_key,
				entry
			});
		}
		return entries;
	});
}
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
	const result = withOpenClawAgentDatabaseReadOnly((database) => {
		const read = () => listSqliteSessionEntriesFromDatabase(database, resolved, scope, options);
		return options.continuation ? readWithCanonicalSessionReaderContinuation(database, options.continuation, read) : read();
	}, toDatabaseOptions(resolved));
	return result.found ? result.value : [];
}
function listSqliteSessionEntriesFromDatabase(database, resolved, scope, options = {}) {
	if (scope.cronRetention || scope.expiredCronRuns) {
		const expired = scope.expiredCronRuns;
		const requestedOwner = expired ? normalizeAgentId(expired.agentId) : void 0;
		const captured = withSqlitePostCommitPublications(database.db, () => runSqliteDeferredTransactionSync(database.db, () => {
			const snapshot = readSessionEntryCache(database, {
				cache: false,
				projection: "list"
			});
			const entries = Array.from(iterateSessionEntriesForListing(snapshot));
			const selected = entries.filter(({ sessionKey, entry }) => isCronRunSessionKey(sessionKey) && (scope.cronRetention || expired !== void 0 && normalizeAgentId(parseAgentSessionKey(sessionKey).agentId) === requestedOwner && !((entry.updatedAt ?? 0) >= expired.updatedBefore)));
			const rows = selected.length ? executeSqliteQuerySync(database.db, selectSessionEntryRows(database, "full").select("updated_at").where("session_key", "in", sqliteStringSet(selected.map(({ sessionKey }) => sessionKey)))).rows : [];
			return {
				entries: scope.cronRetention ? entries : selected,
				rows
			};
		}));
		const fullRows = new Map(captured.rows.map((row) => [row.session_key, row]));
		for (const summary of captured.entries) {
			const row = fullRows.get(summary.sessionKey);
			if (row) summary.entry = {
				...parseSessionEntryJson(row),
				...summary.entry
			};
		}
		return captured.entries;
	}
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
			entry: cloneEntries ? structuredClone(entry) : entry
		};
	}
}
//#endregion
export { listSqliteSessionEntriesFromDatabase as n, readSelectedSessionEntriesInDatabase as r, listSessionEntriesReadOnly as t };
