import { d as sqliteStringSet, i as executeSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { a as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { c as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-CUxN9KZj.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { l as runExclusiveSqliteSessionWrite } from "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { n as assertSessionTranscriptHot } from "./session-cold-storage-state-CWFSrppd.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
import { o as readExactSessionEntryRow } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
import { c as invalidateSessionEntryMaintenanceAgeFact } from "./session-accessor.sqlite-entry-worker-publication-myyyu_fk.mjs";
import { a as writeSessionEntry, c as copySessionNodeArtifactsForRepair } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { c as readSqliteSessionGenerationClaim, d as rehomeSqliteSessionGenerationWindow, f as copySessionDeliveriesForRepair, s as copySqliteSessionGenerationRows, u as readSqliteSessionGenerationWindows } from "./session-accessor.sqlite-canonical-repair-DvHsP9JX.mjs";
import { n as replaceSessionOwnerInTransaction } from "./session-accessor.sqlite-owner-DmFmcL8Z.mjs";
import { n as listSessionMembersInDatabase } from "./session-sharing-store.kernel-DHH7VvHM.mjs";
import { a as readClaim, i as generationsMatch, n as claimUnchanged, r as claimsMatch } from "./legacy-main-session-migration-claims-BdO-kk9b.mjs";
//#region src/config/sessions/session-claim-repair-copy.ts
function writeSessionClaimForRepair(database, sessionKey, entry) {
	invalidateSessionEntryMaintenanceAgeFact(database.db);
	writeSessionEntry(database, sessionKey, entry, {
		allowStoredAliases: true,
		previousEntry: null
	});
	replaceSessionOwnerInTransaction(database, sessionKey, entry.owner);
}
async function copySessionClaimForRepair(params) {
	const destinationOptions = {
		agentId: params.destination.databaseAgentId,
		env: params.env,
		path: params.destination.path
	};
	return await runExclusiveSqliteSessionWrite(destinationOptions, async () => {
		params.beforePersistentApply?.();
		return runOpenClawAgentWriteTransaction((destinationDatabase) => {
			const current = readClaim(destinationDatabase, params.destination, params.canonicalKey, params.canonicalKey);
			if (params.expectedDestination && (!current || !claimUnchanged(current, params.expectedDestination)) || current && !claimsMatch(params.source, current)) return;
			const source = withOpenClawAgentDatabaseReadOnly((sourceDatabase) => runSqliteDeferredTransactionSync(sourceDatabase.db, () => {
				const fresh = readClaim(sourceDatabase, params.source.store, params.source.key, params.canonicalKey);
				if (!fresh || !claimUnchanged(fresh, params.source) || fresh.databaseIdentity === readOpenClawAgentDatabaseIdentity(destinationDatabase).identity) return;
				if (params.mode === "store-relocation" && current && JSON.stringify(listSessionMembersInDatabase(sourceDatabase, fresh.key).map((member) => member.identityId)) !== JSON.stringify(listSessionMembersInDatabase(destinationDatabase, params.canonicalKey).map((member) => member.identityId))) return;
				const destinationWindows = new Map(readSqliteSessionGenerationWindows(destinationDatabase, [], fresh.generations.map((generation) => generation.window.session_id)).map((window) => [window.session_id, window]));
				const currentGenerations = new Map(current?.generations.map((generation) => [generation.window.session_id, generation]));
				const missing = [];
				for (const generation of fresh.generations) {
					assertSessionTranscriptHot(sourceDatabase.db, generation.window.session_id);
					if (normalizeStoreSessionKey(generation.window.session_key.trim()) !== normalizeStoreSessionKey(params.source.key.trim())) return;
					const existing = destinationWindows.get(generation.window.session_id);
					if (!existing) missing.push(generation);
					else if (existing.session_key !== params.canonicalKey || !generationsMatch(generation, currentGenerations.get(existing.session_id) ?? readSqliteSessionGenerationClaim(destinationDatabase, existing), params.canonicalKey)) return;
				}
				if (!current) {
					if (readExactSessionEntryRow(destinationDatabase, params.canonicalKey)) return;
					writeSessionClaimForRepair(destinationDatabase, params.canonicalKey, fresh.entry);
				}
				const sourceDb = getSessionKysely(sourceDatabase.db);
				const destinationDb = getSessionKysely(destinationDatabase.db);
				const sourceKeys = /* @__PURE__ */ new Set([normalizeStoreSessionKey(params.source.key.trim())]);
				for (const generation of missing) {
					const window = generation.window;
					const links = executeSqliteQuerySync(sourceDatabase.db, sourceDb.selectFrom("session_conversations").selectAll().where("session_id", "=", window.session_id)).rows;
					const conversationIds = [...window.primary_conversation_id ? [window.primary_conversation_id] : [], ...links.map((link) => link.conversation_id)];
					for (const conversation of executeSqliteQuerySync(sourceDatabase.db, sourceDb.selectFrom("conversations").selectAll().where("conversation_id", "in", sqliteStringSet(conversationIds))).rows) executeSqliteQuerySync(destinationDatabase.db, destinationDb.insertInto("conversations").values(conversation).onConflict((conflict) => conflict.column("conversation_id").doNothing()));
					const mapped = rehomeSqliteSessionGenerationWindow(window, params.canonicalKey, sourceKeys);
					executeSqliteQuerySync(destinationDatabase.db, destinationDb.insertInto("session_windows").values(mapped).onConflict((conflict) => conflict.column("session_id").doUpdateSet(mapped)));
					copySqliteSessionGenerationRows({
						destination: destinationDatabase,
						source: sourceDatabase,
						sessionId: window.session_id,
						sourceWindowPresent: true
					});
					executeSqliteQuerySync(destinationDatabase.db, destinationDb.deleteFrom("session_conversations").where("session_id", "=", window.session_id));
					for (const link of links) executeSqliteQuerySync(destinationDatabase.db, destinationDb.insertInto("session_conversations").values(link));
				}
				if (params.mode === "store-relocation") copySessionDeliveriesForRepair({
					source: sourceDatabase,
					destination: destinationDatabase,
					sourceKeys: [fresh.key],
					canonicalKey: params.canonicalKey,
					preserveDestination: true
				});
				copySessionNodeArtifactsForRepair(sourceDatabase, destinationDatabase, [fresh.key], params.canonicalKey, { includeMembers: params.mode === "store-relocation" });
				return readClaim(destinationDatabase, params.destination, params.canonicalKey, params.canonicalKey);
			}), {
				agentId: params.source.store.databaseAgentId,
				env: params.env,
				path: params.source.store.path
			});
			return source.found ? source.value : void 0;
		}, destinationOptions, { operationLabel: "session.repair.copy-claim" });
	}, "session-repair.copy");
}
//#endregion
export { writeSessionClaimForRepair as n, copySessionClaimForRepair as t };
