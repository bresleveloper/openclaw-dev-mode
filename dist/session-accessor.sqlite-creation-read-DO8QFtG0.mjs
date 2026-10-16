import { a as withSqlitePostCommitPublications } from "./sqlite-post-commit-CQ_AyDCk.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { a as normalizeStoreSessionKey, s as resolveSessionEntryCandidates, t as collectSessionEntryLookupKeys } from "./store-entry-Bb_svqyv.mjs";
import { o as projectSqliteSessionParticipantsBatch } from "./internal-session-key-CPayZwJR.mjs";
import { r as readSelectedSessionEntriesInDatabase } from "./session-accessor.sqlite-entry-list.read-jgvuh1fV.mjs";
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
	return withSqlitePostCommitPublications(database.db, () => runSqliteDeferredTransactionSync(database.db, () => {
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
export { readSessionCreationSnapshotInDatabase as n, assertSessionCreationLabelAvailable as t };
