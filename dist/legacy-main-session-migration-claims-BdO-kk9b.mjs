import { d as sqliteStringSet, i as executeSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { a as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-CUxN9KZj.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { c as collectSessionStateIdsForEntry } from "./transcript-event-media-C4aKs47S.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
import { d as readSessionNodeArtifactFingerprint } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { c as readSqliteSessionGenerationClaim, d as rehomeSqliteSessionGenerationWindow, i as readExactSessionEntryRowForCanonicalRepair, l as readSqliteSessionGenerationComparison, u as readSqliteSessionGenerationWindows } from "./session-accessor.sqlite-canonical-repair-DvHsP9JX.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/config/sessions/legacy-main-session-migration-claims.ts
function projectEntryIdentity(entry) {
	const projected = { ...entry };
	delete projected.sessionFile;
	delete projected.transcriptPath;
	return projected;
}
function generationWindowIdentity(generation, canonicalKey) {
	const { updated_at: _updatedAt, transcript_updated_at: _transcriptUpdatedAt, transcript_observed_at: _transcriptObservedAt, row_transcript_json: _rowTranscript, row_transcript_updated_at: _rowTranscriptUpdatedAt, ...identity } = rehomeSqliteSessionGenerationWindow(generation.window, canonicalKey, /* @__PURE__ */ new Set([normalizeStoreSessionKey(generation.window.session_key.trim())]));
	return identity;
}
function generationsMatch(left, right, canonicalKey) {
	return left.contentFingerprint === right.contentFingerprint && isDeepStrictEqual(generationWindowIdentity(left, canonicalKey), generationWindowIdentity(right, canonicalKey));
}
function claimsMatch(left, right) {
	const generations = new Map(right.generations.map((generation) => [generation.window.session_id, generation]));
	return isDeepStrictEqual(projectEntryIdentity(left.entry), projectEntryIdentity(right.entry)) && left.generations.every((generation) => {
		const other = generations.get(generation.window.session_id);
		return !other || generationsMatch(generation, other, left.canonicalKey);
	});
}
function claimUnchanged(current, expected) {
	return current.databaseIdentity === expected.databaseIdentity && current.nodeArtifactFingerprint === expected.nodeArtifactFingerprint && isDeepStrictEqual(projectEntryIdentity(current.entry), projectEntryIdentity(expected.entry)) && current.generations.length === expected.generations.length && current.generations.every((generation, index) => generation.fingerprint === expected.generations[index]?.fingerprint);
}
function claimFullyCopied(source, destination) {
	const sessionIds = new Set(destination.generations.map((generation) => generation.window.session_id));
	return claimsMatch(source, destination) && source.generations.every((generation) => sessionIds.has(generation.window.session_id));
}
function readClaim(database, store, key, canonicalKey) {
	return runSqliteDeferredTransactionSync(database.db, () => {
		const row = readExactSessionEntryRowForCanonicalRepair(database, key);
		if (!row) return;
		const windows = readSqliteSessionGenerationWindows(database, [key], collectSessionStateIdsForEntry(row.entry));
		return {
			canonicalKey,
			databaseIdentity: readOpenClawAgentDatabaseIdentity(database).identity,
			entry: row.entry,
			generations: windows.map((window) => readSqliteSessionGenerationClaim(database, window)),
			key,
			nodeArtifactFingerprint: readSessionNodeArtifactFingerprint(database, key),
			store
		};
	});
}
/** Detection compares history; only Doctor acquires the artifact custody needed to delete it. */
function readComparisonClaim(database, store, key, canonicalKey) {
	return runSqliteDeferredTransactionSync(database.db, () => {
		const row = readExactSessionEntryRowForCanonicalRepair(database, key);
		if (!row) return;
		const windows = readSqliteSessionGenerationWindows(database, [key], collectSessionStateIdsForEntry(row.entry));
		return {
			canonicalKey,
			entry: row.entry,
			generations: windows.map((window) => readSqliteSessionGenerationComparison(database, window)),
			key,
			store
		};
	});
}
async function restoreColdSessionClaims(claims, env, beforePersistentApply) {
	for (const [index, claim] of claims.entries()) {
		const cold = withOpenClawAgentDatabaseReadOnly((database) => executeSqliteQuerySync(database.db, getSessionKysely(database.db).selectFrom("session_transcript_cold_archives").select("session_id").where("session_id", "in", sqliteStringSet(claim.generations.map((generation) => generation.window.session_id)))).rows, {
			agentId: claim.store.databaseAgentId,
			env,
			path: claim.store.path
		});
		if (!cold.found) throw new Error(`Legacy session store changed before history restoration: ${claim.key}`);
		if (cold.value.length === 0 && claim.generations.every((generation) => !generation.coldArchive)) continue;
		const { restoreSessionColdTranscript } = await import("./session-cold-storage-Doo7Aerf.mjs");
		for (const generation of cold.value) await restoreSessionColdTranscript({
			agentId: claim.store.databaseAgentId,
			env,
			sessionId: generation.session_id,
			storePath: claim.store.path
		}, beforePersistentApply);
		const refreshed = withOpenClawAgentDatabaseReadOnly((database) => readClaim(database, claim.store, claim.key, claim.canonicalKey), {
			agentId: claim.store.databaseAgentId,
			env,
			path: claim.store.path
		});
		if (!refreshed.found || !refreshed.value) throw new Error(`Legacy session changed during history restoration: ${claim.key}`);
		claims[index] = refreshed.value;
	}
}
//#endregion
export { readClaim as a, generationsMatch as i, claimUnchanged as n, readComparisonClaim as o, claimsMatch as r, restoreColdSessionClaims as s, claimFullyCopied as t };
