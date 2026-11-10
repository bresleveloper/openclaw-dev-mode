import { i as sqlPublicationAnchor } from "./sql-connection-DmQzXTVz.mjs";
import { c as withSqlitePostCommitPublications } from "./sqlite-post-commit-22SfWsLt.mjs";
import { p as runSqliteReadOperationSync } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { d as sqliteStringSet, i as executeSqliteQuerySync, m as expressionBuilder, o as getNodeSqliteKysely, s as iterateSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { r as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { M as parseAgentSessionKey, x as isCronRunSessionKey } from "./session-key-CSDERtm3.mjs";
import { a as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { t as isInternalSessionEffectsKey } from "./internal-session-key-B6hhdgLR.mjs";
import { o as resolveDeliveryProvenCanonicalSessionKey } from "./store-entry-CUxN9KZj.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { n as parseSessionEntryJson, r as selectSessionEntryRows } from "./session-accessor.sqlite-status-B58ALiNV.mjs";
import { f as readWithCanonicalSessionReaderContinuation, h as canonicalSessionKeyMigrationRequiredError, r as assertCanonicalSqliteSessionKeysCurrent, s as hasCanonicalSessionValidationProjection } from "./session-canonical-key-B7chVWi3.mjs";
import { r as resolveSqliteScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { t as assertCapturedSessionEntryReadSource } from "./session-entry-read-source-CtAlEtSu.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
import { i as projectSqliteSessionParticipantsBatch } from "./session-accessor.sqlite-participant-projection-B8eNZYGT.mjs";
import { o as readSessionEntryCache } from "./session-accessor.sqlite-entry-cache-BGcjBaH_.mjs";
import { _ as validateDeliveryCanonicalSessionEntry, t as SESSION_ID_TRIM_CHARACTERS } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
//#region src/config/sessions/session-accessor.sqlite-entry-list.read.ts
function captureListingSource(database, scope) {
	if (!scope.captureSource) return;
	const physical = readOpenClawAgentDatabaseIdentity(database);
	const source = {
		agentId: database.agentId,
		path: database.path,
		databaseIdentity: physical.identity,
		databaseBirthtime: physical.birthtime
	};
	assertCapturedSessionEntryReadSource(source, database);
	scope.captureSource(() => assertCapturedSessionEntryReadSource(source, typeof source.databaseIdentity === "symbol" ? database : void 0));
}
function legacySessionFile(eb) {
	return eb.fn("iif", [
		eb.fn("json_valid", ["entry_json"]),
		eb.fn("json_extract", ["entry_json", eb.val("$.sessionFile")]),
		eb.val(null)
	]);
}
/** Select listing facts without hydrating the store; creation retains only its target payloads. */
function readSelectedSessionEntriesInDatabase(database, sessionKeys, options = {}) {
	return readWithCanonicalSessionReaderContinuation(database, options.continuation, () => {
		assertCanonicalSqliteSessionKeysCurrent(database);
		const keys = new Set(sessionKeys);
		const fullEntryKeys = new Set(options.fullEntryKeys);
		const query = selectSessionEntryRows(database, "list", options.fullEntryKeys).select("updated_at").orderBy("session_key");
		const db = getNodeSqliteKysely(database.db);
		const pending = db.selectFrom("session_canonical_validation_pending").select("session_key");
		let selected = db.selectFrom("session_nodes").select("session_key").where("session_key", "in", sqliteStringSet(sessionKeys));
		if (options.label !== void 0) selected = selected.union(db.selectFrom("session_nodes").select("session_key").where("label", "=", options.label.trim()));
		if (options.sessionIdOrKey !== void 0) selected = selected.union(db.selectFrom("session_nodes").select("session_key").where("session_key", "=", options.sessionIdOrKey)).union(db.selectFrom("session_nodes").select("session_key").where("current_session_id", "=", options.sessionIdOrKey));
		if (options.transcriptSessionIds !== void 0) {
			const ids = options.transcriptSessionIds;
			const trimmedIds = ids.map((id) => id.trim()).filter(Boolean);
			const eb = expressionBuilder();
			const trimmed = eb.fn("trim", ["current_session_id", eb.val(SESSION_ID_TRIM_CHARACTERS)]);
			const seedIds = db.selectFrom("session_nodes").select(trimmed.as("session_id")).where("session_key", "in", sqliteStringSet(sessionKeys)).where(trimmed, "!=", "");
			const file = eb.fn("trim", [legacySessionFile(eb), eb.val(SESSION_ID_TRIM_CHARACTERS)]);
			const seedFiles = db.selectFrom("session_nodes").select(file.as("session_file")).where("session_key", "in", sqliteStringSet(sessionKeys)).where(file, "!=", "");
			selected = selected.union(db.selectFrom("session_nodes").select("session_key").where(eb.or([
				eb("current_session_id", "in", sqliteStringSet(ids)),
				eb(trimmed, "in", sqliteStringSet(trimmedIds)),
				eb(trimmed, "in", seedIds),
				eb(file, "in", seedFiles),
				eb(file, "in", sqliteStringSet(options.transcriptSessionFiles ?? []))
			])));
		}
		const selectedQuery = query.select((eb) => options.transcriptSessionIds === void 0 ? [eb.val(null).as("transcript_session_file"), eb.val(0).as("transcript_selected")] : [legacySessionFile(eb).as("transcript_session_file"), eb("session_key", "in", selected).as("transcript_selected")]);
		const rows = iterateSqliteQuerySync(database.db, hasCanonicalSessionValidationProjection(database) ? selectedQuery.where("session_key", "in", pending.union(selected)) : selectedQuery);
		const entries = [];
		for (const row of rows) {
			if (isInternalSessionEffectsKey(row.session_key)) continue;
			const entry = parseSessionEntryJson(row, fullEntryKeys.has(row.session_key) ? "full" : "list");
			if (!entry) continue;
			validateDeliveryCanonicalSessionEntry(row.session_key, entry);
			if (keys.has(row.session_key) || row.transcript_selected || options.label !== void 0 && entry.label === options.label || options.sessionIdOrKey !== void 0 && (row.session_key === options.sessionIdOrKey || entry.sessionId === options.sessionIdOrKey)) {
				if (options.transcriptSessionIds !== void 0 && typeof row.transcript_session_file === "string") Object.assign(entry, { sessionFile: row.transcript_session_file });
				entries.push({
					sessionKey: row.session_key,
					entry
				});
			}
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
	captureListingSource(database, scope);
	const deferParticipants = options.deferParticipants || scope.includeParticipants === false ? true : void 0;
	if (scope.sessionKeys && !scope.cronRetention && !scope.expiredCronRuns) {
		const sessionKeys = scope.sessionKeys;
		return runSqliteReadOperationSync(database.db, () => {
			const entries = readSelectedSessionEntriesInDatabase(database, sessionKeys, scope.projection === "list" ? {} : { fullEntryKeys: sessionKeys });
			if (deferParticipants) return entries;
			return [...projectSqliteSessionParticipantsBatch(database.db, new Map(entries.map(({ sessionKey, entry }) => [sessionKey, entry])))].map(([sessionKey, entry]) => ({
				sessionKey,
				entry
			}));
		});
	}
	if (scope.cronRetention || scope.expiredCronRuns) {
		const expired = scope.expiredCronRuns;
		const requestedOwner = expired ? normalizeAgentId(expired.agentId) : void 0;
		const captured = withSqlitePostCommitPublications(sqlPublicationAnchor(database.db), () => runSqliteDeferredTransactionSync(database.db, () => {
			let entries;
			if (scope.cronRetention) {
				const page = scope.cronRetention;
				const keys = [];
				for (const row of iterateSqliteQuerySync(database.db, getNodeSqliteKysely(database.db).selectFrom("session_nodes").select("session_key").where("session_key", ">", page.afterSessionKey ?? "").orderBy("session_key"))) if (isCronRunSessionKey(row.session_key)) {
					keys.push(row.session_key);
					if (keys.length >= page.limit) break;
				}
				options.captureCronRunSessionKey?.(keys.length === page.limit ? keys.at(-1) : null);
				entries = readSelectedSessionEntriesInDatabase(database, keys);
				if (!deferParticipants) entries = [...projectSqliteSessionParticipantsBatch(database.db, new Map(entries.map(({ sessionKey, entry }) => [sessionKey, entry])))].map(([sessionKey, entry]) => ({
					sessionKey,
					entry
				}));
			} else {
				const snapshot = readSessionEntryCache(database, {
					cache: false,
					projection: "list",
					deferParticipants
				});
				entries = Array.from(iterateSessionEntriesForListing(snapshot));
			}
			let oldestUpdatedAt = null;
			const selected = entries.filter(({ sessionKey, entry }) => {
				if (!isCronRunSessionKey(sessionKey) || expired && normalizeAgentId(parseAgentSessionKey(sessionKey).agentId) !== requestedOwner) return false;
				const updatedAt = entry.updatedAt ?? 0;
				oldestUpdatedAt = Math.min(oldestUpdatedAt ?? updatedAt, updatedAt);
				return !expired || updatedAt < expired.updatedBefore;
			});
			options.captureCronRunUpdatedAt?.(oldestUpdatedAt);
			return {
				entries: selected,
				rows: selected.length ? executeSqliteQuerySync(database.db, selectSessionEntryRows(database, "full").select("updated_at").where("session_key", "in", sqliteStringSet(selected.map(({ sessionKey }) => sessionKey)))).rows : []
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
		deferParticipants
	});
	return Array.from(iterateSessionEntriesForListing(snapshot, projection === "list" && scope.clone !== false));
}
/** Applies the listing visibility and canonical-key contract to an owned snapshot. */
function* iterateSessionEntriesForListing(snapshot, cloneEntries = false) {
	for (const sessionKey of snapshot.keys) {
		if (isInternalSessionEffectsKey(sessionKey)) continue;
		const entry = snapshot.entries.get(sessionKey);
		if (!entry) continue;
		const deliveryCanonicalKey = resolveDeliveryProvenCanonicalSessionKey(sessionKey, entry);
		if (deliveryCanonicalKey !== sessionKey) throw canonicalSessionKeyMigrationRequiredError(`non-canonical persisted row resolves to session key ${deliveryCanonicalKey}`);
		yield {
			sessionKey,
			entry: cloneEntries ? structuredClone(entry) : entry
		};
	}
}
//#endregion
export { listSqliteSessionEntriesFromDatabase as n, readSelectedSessionEntriesInDatabase as r, listSessionEntriesReadOnly as t };
