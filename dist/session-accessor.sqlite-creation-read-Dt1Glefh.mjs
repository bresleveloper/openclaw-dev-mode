import { y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { i as sqlPublicationAnchor } from "./sql-connection-DmQzXTVz.mjs";
import { c as withSqlitePostCommitPublications } from "./sqlite-post-commit-22SfWsLt.mjs";
import { i as executeSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { a as normalizeStoreSessionKey, s as resolveSessionEntryCandidates, t as collectSessionEntryLookupKeys } from "./store-entry-CUxN9KZj.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { r as assertCanonicalSqliteSessionKeysCurrent } from "./session-canonical-key-B7chVWi3.mjs";
import { t as iterateSessionEntryKeys } from "./session-accessor.sqlite-entry-inventory-Cl0fNMK8.mjs";
import { i as projectSqliteSessionParticipantsBatch } from "./session-accessor.sqlite-participant-projection-B8eNZYGT.mjs";
import { g as readSessionKeyBySessionIdInDatabase, i as prepareExactSessionEntryRowReads, o as readExactSessionEntryRow } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
import { r as readSelectedSessionEntriesInDatabase } from "./session-accessor.sqlite-entry-list.read-BLfvs7b2.mjs";
//#region src/config/sessions/session-accessor.sqlite-replacement-read.ts
function readSessionEntryReplacementLabelOwnerKeys(database, label) {
	return label === void 0 ? [] : executeSqliteQuerySync(database.db, getSessionKysely(database.db).selectFrom("session_nodes").select("session_key").where("label", "=", label).orderBy("session_key")).rows.map((row) => row.session_key);
}
/** Detached entries and their CAS bytes must come from the same admitted read snapshot. */
function readSessionEntryReplacementState(database, params) {
	const windowOwner = params.includeSessionWindowOwner ? readSessionKeyBySessionIdInDatabase(database, params.includeSessionWindowOwner) : void 0;
	const selectedSessionKeys = params.sessionKeys ? uniqueStrings([...params.sessionKeys, ...windowOwner ? [windowOwner] : []]) : void 0;
	const labelOwnerKeys = readSessionEntryReplacementLabelOwnerKeys(database, params.includeLabelOwners);
	if (!selectedSessionKeys) assertCanonicalSqliteSessionKeysCurrent(database);
	const selected = selectedSessionKeys ? uniqueStrings([...selectedSessionKeys, ...labelOwnerKeys]) : [...iterateSessionEntryKeys(database)];
	const expectedRows = /* @__PURE__ */ new Map();
	const readPrepared = selected.length > 1 ? prepareExactSessionEntryRowReads(database, selected) : void 0;
	return {
		entries: selected.flatMap((sessionKey) => {
			const row = readPrepared ? readPrepared(sessionKey) : readExactSessionEntryRow(database, sessionKey);
			if (!row) return [];
			expectedRows.set(sessionKey, row);
			return [{
				entry: structuredClone(row.entry),
				sessionKey
			}];
		}),
		expectedRows,
		labelOwnerKeys,
		selectedSessionKeys
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-creation-read.ts
/** Recheck the explicit claim inside the transaction that writes its session row. */
function assertSessionCreationLabelAvailable(database, sessionKey, label) {
	if (label === void 0) return;
	if (readSelectedSessionEntriesInDatabase(database, [], { label }).some((candidate) => candidate.sessionKey !== sessionKey)) {
		const error = /* @__PURE__ */ new Error(`label already in use: ${label}`);
		error.name = "SessionLabelConflictError";
		throw error;
	}
}
/** Target payload and the indexed label claim share one snapshot on the executing owner. */
function readSessionCreationSnapshotInDatabase(database, sessionKey, label) {
	return withSqlitePostCommitPublications(sqlPublicationAnchor(database.db), () => runSqliteDeferredTransactionSync(database.db, () => {
		const normalizedKey = normalizeStoreSessionKey(sessionKey);
		const keys = [normalizedKey, ...collectSessionEntryLookupKeys(sessionKey)];
		const candidates = readSelectedSessionEntriesInDatabase(database, keys, {
			fullEntryKeys: keys,
			label
		});
		const entries = projectSqliteSessionParticipantsBatch(database.db, new Map(candidates.filter((candidate) => keys.includes(candidate.sessionKey)).map(({ sessionKey: key, entry }) => [key, entry])));
		const resolved = resolveSessionEntryCandidates({
			entries: Array.from(entries, ([key, entry]) => ({
				sessionKey: key,
				entry
			})),
			sessionKey,
			canonicalKeys: true
		});
		const targetEntry = entries.get(normalizedKey);
		return {
			normalizedKey,
			legacyKeys: resolved.legacyKeys,
			existingEntry: resolved.existing ? { ...resolved.existing.entry } : void 0,
			targetEntry: targetEntry ? { ...targetEntry } : void 0,
			labelInUse: label !== void 0 && candidates.some((candidate) => candidate.sessionKey !== normalizedKey && candidate.entry.label === label)
		};
	}));
}
//#endregion
export { readSessionEntryReplacementState as i, readSessionCreationSnapshotInDatabase as n, readSessionEntryReplacementLabelOwnerKeys as r, assertSessionCreationLabelAvailable as t };
