import { c as withSqlitePostCommitPublications } from "./sqlite-post-commit-22SfWsLt.mjs";
import { d as sqliteStringSet, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { a as runSqliteImmediateTransactionSync, t as assertTransactionUsable } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { n as loadSqliteVecExtensionFromPath } from "./sqlite-vec-DjjFDiM4.mjs";
import { n as readMemoryEntryOriginsInDatabase, r as recordMemoryEntryOriginsInDatabase, t as ensureMemoryEntryOriginsSchema } from "./memory-core-host-engine-storage-wV2XR0Rc.mjs";
import "./sqlite-worker-runtime-Da3qtgYL.mjs";
import { t as selectedMemoryLineageIdentity } from "./memory-entry-origins-task-CNWEkDNg.mjs";
import { r as recordMemorySessionTombstonesInDatabase, t as ensureMemorySessionTombstones } from "./memory-session-tombstones-CXVQjYXY.mjs";
import { a as extractPromotionKeys } from "./short-term-promotion-memory-write-OkmZQyxM.mjs";
//#region extensions/memory-core/src/memory-entry-origins-delete.ts
/** Forget retains its supplied connection and original transaction boundary. */
function deleteMemoryEntryOriginsInDatabase(db, params, admission) {
	if (params.entryKeys.length === 0 || params.sessionIds?.length === 0 || !tableExists(db, "memory_entry_origins")) return 0;
	return runSqliteImmediateTransactionSync(db, () => {
		admission?.onBegin();
		let query = getNodeSqliteKysely(db).deleteFrom("memory_entry_origins").where("agent_id", "=", params.agentId).where("entry_key", "in", sqliteStringSet(params.entryKeys));
		if (params.sessionIds) query = query.where("session_id", "in", sqliteStringSet(params.sessionIds));
		return Number(executeSqliteQuerySync(db, query).numAffectedRows ?? 0n);
	}, admission && { withCommit: admission.withCommit });
}
//#endregion
//#region extensions/memory-core/src/memory-forget-kernel.ts
function checkLineage(db, input) {
	const origins = tableExists(db, "memory_entry_origins") ? readMemoryEntryOriginsInDatabase(db, { agentId: input.agentId }) : [];
	return selectedMemoryLineageIdentity(origins, new Set(input.sessionIds), new Set(input.entryKeys)) === input.identity ? { current: true } : {
		current: false,
		origins
	};
}
/** The binding owns this transaction and its commit grant. */
function markMemoryForgotten(db, input) {
	const lineage = checkLineage(db, input);
	if (!lineage.current) return lineage;
	if (recordMemorySessionTombstonesInDatabase(db, input) === 0) executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("memory_index_state").set((expression) => ({ revision: expression("revision", "+", 1) })).where("id", "=", 1));
	return lineage;
}
/** The earlier tombstone commit survives any failure of this separate purge. */
function purgeForgottenMemory(db, input) {
	const lineage = checkLineage(db, input);
	if (!lineage.current) return lineage;
	const kysely = getNodeSqliteKysely(db);
	if (input.chunkIds.length > 0) {
		if (input.hasVectorTable) executeSqliteQuerySync(db, kysely.deleteFrom("memory_index_chunks_vec").where("id", "in", input.chunkIds));
		executeSqliteQuerySync(db, kysely.deleteFrom("memory_index_chunks").where("id", "in", input.chunkIds));
	}
	deleteMemoryIndexSources(db, input.sources);
	if (tableExists(db, "memory_embedding_cache")) executeSqliteQuerySync(db, kysely.deleteFrom("memory_embedding_cache"));
	return lineage;
}
function deleteMemoryIndexSources(database, sources) {
	const db = getNodeSqliteKysely(database);
	for (let start = 0; start < sources.length;) {
		const source = sources[start];
		let end = start + 1;
		while (end < sources.length && sources[end].source === source.source) end += 1;
		executeSqliteQuerySync(database, db.deleteFrom("memory_index_sources").where("path", "in", sqliteStringSet(sources.slice(start, end).map((row) => row.path))).where("source", "=", source.source));
		start = end;
	}
}
//#endregion
//#region extensions/memory-core/src/memory-entry-origins.worker.ts
/** The existing agent executor owns this connection and its native lifetime. */
function bindSqliteWorkerBackend(input, context) {
	const db = context.database;
	const admission = {
		onBegin: () => context.admit("transaction"),
		withCommit: (commit) => {
			context.admit("commit");
			commit();
		}
	};
	const transact = (run) => runSqliteImmediateTransactionSync(db, () => {
		admission.onBegin();
		return run();
	}, { withCommit: admission.withCommit });
	if (input.kind === "forget") {
		if (input.extensionPath) try {
			loadSqliteVecExtensionFromPath(db, input.extensionPath);
		} catch (error) {
			throw new Error(`memory forget cannot purge vector index: ${error instanceof Error ? error.message : String(error)}`, { cause: error });
		}
		if (input.prepareTombstones && !tableExists(db, "memory_session_tombstones")) withSqlitePostCommitPublications(db, () => transact(() => ensureMemorySessionTombstones(db)));
	} else if (input.kind === "origin" && !tableExists(db, "memory_entry_origins")) withSqlitePostCommitPublications(db, () => transact(() => ensureMemoryEntryOriginsSchema(db)));
	let closed = false;
	return {
		execute(command) {
			if (closed) throw new Error("Memory origin worker binding is closed");
			if (command.type === "record") return transact(() => recordMemoryEntryOriginsInDatabase(db, command.input));
			if (command.type === "reserve") {
				if (!tableExists(db, "memory_entry_origins")) return [];
				return transact(() => {
					const { agentId, operations } = command.input;
					const origins = readMemoryEntryOriginsInDatabase(db, {
						agentId,
						entryKeys: [...new Set(operations.flatMap((operation) => operation.parentKeys))]
					});
					return operations.flatMap(({ entryKey, parentKeys }) => {
						const parents = new Set(parentKeys);
						const selected = origins.filter((origin) => parents.has(origin.entryKey));
						const added = selected.length ? recordMemoryEntryOriginsInDatabase(db, {
							agentId,
							entryKey,
							origins: selected
						}) : [];
						return added.length ? [{
							agentId,
							entryKeys: [entryKey],
							sessionIds: added.map((origin) => origin.sessionId)
						}] : [];
					});
				});
			}
			if (command.type === "prune") {
				if (!tableExists(db, "memory_entry_origins")) return 0;
				return transact(() => {
					const indexed = new Set(executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("memory_index_chunks").select("text").where("source", "=", "memory").where("text", "like", "%openclaw-memory-promotion:%")).rows.flatMap(({ text }) => extractPromotionKeys(text)));
					return deleteMemoryEntryOriginsInDatabase(db, {
						agentId: command.input.agentId,
						entryKeys: command.input.entryKeys.filter((key) => !indexed.has(key))
					});
				});
			}
			if (command.type === "delete") return deleteMemoryEntryOriginsInDatabase(db, command.input, admission);
			return transact(() => command.type === "forget.mark" ? markMemoryForgotten(db, command.input) : purgeForgottenMemory(db, command.input));
		},
		assertSettled() {
			assertTransactionUsable(db);
			if (!db.isOpen || db.isTransaction) throw new Error("Memory origin operation left an unsettled native connection");
		},
		close() {
			closed = true;
		}
	};
}
//#endregion
export { bindSqliteWorkerBackend as t };
