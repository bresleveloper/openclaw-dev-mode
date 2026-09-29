import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { o as runSqliteImmediateTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { r as tableExists } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { l as openOpenClawAgentDatabase } from "./openclaw-agent-db-CaQAStOA.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-IBx2zWDG.mjs";
import { n as readMemoryEntryOriginsInDatabase, r as recordMemoryEntryOriginsInDatabase, t as ensureMemoryEntryOriginsSchema } from "./memory-core-host-engine-storage-Dt5aD7j9.mjs";
import "./sqlite-runtime-DhVTOiCi.mjs";
import { r as memorySessionTombstonesExist, t as ensureMemorySessionTombstones } from "./memory-session-tombstones-Bu9FRJQf.mjs";
import { a as readDreamsFile, t as DREAMS_FILENAMES } from "./dreaming-dreams-file-C-CZ4y6s.mjs";
import { a as extractPromotionKeys } from "./short-term-promotion-memory-write-CFZnCVmO.mjs";
import path from "node:path";
//#region extensions/memory-core/src/memory-entry-origins.ts
const TOMBSTONE_INSERT_BATCH_SIZE = 128;
const ensuredDatabases = /* @__PURE__ */ new WeakSet();
function openMemoryOriginDatabase(agentId) {
	const db = openOpenClawAgentDatabase({ agentId }).db;
	if (!ensuredDatabases.has(db)) {
		ensureMemoryEntryOriginsSchema(db);
		ensuredDatabases.add(db);
	}
	return db;
}
function listMemoryEntryOrigins(params) {
	if (params.sessionIds?.length === 0 || params.entryKeys?.length === 0) return [];
	const result = withOpenClawAgentDatabaseReadOnly(({ db }) => {
		if (!ensuredDatabases.has(db) && !tableExists(db, "memory_entry_origins")) return [];
		return readMemoryEntryOriginsInDatabase(db, params);
	}, params);
	return result.found ? result.value : [];
}
function listMemorySessionTombstones(params) {
	if (params.sessionIds?.length === 0) return [];
	const result = withOpenClawAgentDatabaseReadOnly(({ db }) => {
		if (!memorySessionTombstonesExist(db)) return [];
		let query = getNodeSqliteKysely(db).selectFrom("memory_session_tombstones").selectAll().where("agent_id", "=", params.agentId);
		if (params.sessionIds) query = query.where("session_id", "in", params.sessionIds);
		return executeSqliteQuerySync(db, query.orderBy("session_id", "asc")).rows.map((row) => ({
			sessionId: row.session_id,
			agentId: row.agent_id,
			reason: row.reason,
			createdAt: row.created_at
		}));
	}, params);
	return result.found ? result.value : [];
}
/** Record on the supplied connection; the caller retains write admission. */
function recordMemorySessionTombstonesInDatabase(db, params) {
	const sessionIds = [...new Set(params.sessionIds)];
	if (sessionIds.length === 0) return 0;
	ensureMemorySessionTombstones(db);
	const reason = params.reason ?? "forgotten";
	const createdAt = params.createdAt ?? Date.now();
	return runSqliteImmediateTransactionSync(db, () => {
		const kysely = getNodeSqliteKysely(db);
		let recorded = 0;
		for (let start = 0; start < sessionIds.length; start += TOMBSTONE_INSERT_BATCH_SIZE) {
			const result = executeSqliteQuerySync(db, kysely.insertInto("memory_session_tombstones").values(sessionIds.slice(start, start + TOMBSTONE_INSERT_BATCH_SIZE).map((sessionId) => ({
				session_id: sessionId,
				agent_id: params.agentId,
				reason,
				created_at: createdAt
			}))).onConflict((conflict) => conflict.column("session_id").doNothing()));
			recorded += Number(result.numAffectedRows ?? 0n);
		}
		if (recorded > 0) executeSqliteQuerySync(db, kysely.updateTable("memory_index_state").set((expression) => ({ revision: expression("revision", "+", 1) })).where("id", "=", 1));
		return recorded;
	});
}
function recordMemoryEntryOrigins(params) {
	if (params.origins.length === 0) return [];
	const db = openMemoryOriginDatabase(params.agentId);
	return runSqliteImmediateTransactionSync(db, () => recordMemoryEntryOriginsInDatabase(db, params));
}
function deleteMemoryEntryOrigins(params) {
	if (params.entryKeys.length === 0 || params.sessionIds?.length === 0) return 0;
	const existing = withOpenClawAgentDatabaseReadOnly(({ db }) => {
		if (!ensuredDatabases.has(db) && !tableExists(db, "memory_entry_origins")) return false;
		let query = getNodeSqliteKysely(db).selectFrom("memory_entry_origins").select("entry_key").where("agent_id", "=", params.agentId).where("entry_key", "in", params.entryKeys);
		if (params.sessionIds) query = query.where("session_id", "in", params.sessionIds);
		return executeSqliteQuerySync(db, query.limit(1)).rows.length > 0;
	}, params);
	if (!existing.found || !existing.value) return 0;
	return deleteMemoryEntryOriginsInDatabase(openMemoryOriginDatabase(params.agentId), params);
}
/** Mutate only the supplied connection; callers retain its admission and lifetime. */
function deleteMemoryEntryOriginsInDatabase(db, params) {
	if (params.entryKeys.length === 0 || params.sessionIds?.length === 0 || !tableExists(db, "memory_entry_origins")) return 0;
	return runSqliteImmediateTransactionSync(db, () => {
		let query = getNodeSqliteKysely(db).deleteFrom("memory_entry_origins").where("agent_id", "=", params.agentId).where("entry_key", "in", params.entryKeys);
		if (params.sessionIds) query = query.where("session_id", "in", params.sessionIds);
		return Number(executeSqliteQuerySync(db, query).numAffectedRows ?? 0n);
	});
}
function reserveMemoryEntryOrigins(params) {
	const previousLines = params.previousMemory.replace(/\r\n/gu, "\n").split("\n");
	const operationParents = params.operations.map((operation) => {
		const parentKeys = /* @__PURE__ */ new Set([operation.candidateKey]);
		for (const entry of operation.priorEntries) {
			const entryIndex = previousLines.findIndex((line) => line.trim() === entry);
			const marker = previousLines[entryIndex - 1]?.trim();
			const parentKey = /^<!--\s*openclaw-memory-promotion:([^\n]*?)\s*-->$/u.exec(marker ?? "")?.[1]?.trim();
			if (parentKey) parentKeys.add(parentKey);
		}
		return {
			operation,
			parentKeys
		};
	});
	const affectedKeys = [...new Set(operationParents.flatMap(({ parentKeys }) => [...parentKeys]))];
	const reservations = [];
	const rollback = () => {
		for (const reservation of reservations.toReversed()) deleteMemoryEntryOrigins(reservation);
	};
	try {
		for (const agentId of [...new Set(params.agentIds)].toSorted()) {
			const origins = listMemoryEntryOrigins({
				agentId,
				entryKeys: affectedKeys
			});
			for (const { operation, parentKeys } of operationParents) {
				const added = recordMemoryEntryOrigins({
					agentId,
					origins: origins.filter((origin) => parentKeys.has(origin.entryKey)),
					entryKey: operation.candidateKey
				});
				if (added.length > 0) reservations.push({
					agentId,
					entryKeys: [operation.candidateKey],
					sessionIds: added.map((origin) => origin.sessionId)
				});
			}
		}
	} catch (error) {
		rollback();
		throw error;
	}
	return rollback;
}
async function pruneMemoryEntryOrigins(params) {
	const entryKeys = [...new Set(params.entryKeys)].filter((key) => !params.retainedEntryKeys.has(key));
	if (entryKeys.length === 0) return;
	const diaries = await Promise.all(DREAMS_FILENAMES.map((name) => readDreamsFile(path.join(params.workspaceDir, name), params.workspaceDir)));
	const diaryKeys = new Set(diaries.flatMap(extractPromotionKeys));
	for (const agentId of new Set(params.agentIds)) {
		const indexed = withOpenClawAgentDatabaseReadOnly(({ db }) => new Set(executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("memory_index_chunks").select("text").where("source", "=", "memory").where("text", "like", "%openclaw-memory-promotion:%")).rows.flatMap(({ text }) => extractPromotionKeys(text))), { agentId });
		deleteMemoryEntryOrigins({
			agentId,
			entryKeys: entryKeys.filter((key) => !diaryKeys.has(key) && !(indexed.found && indexed.value.has(key)))
		});
	}
}
//#endregion
export { recordMemoryEntryOrigins as a, pruneMemoryEntryOrigins as i, listMemoryEntryOrigins as n, recordMemorySessionTombstonesInDatabase as o, listMemorySessionTombstones as r, reserveMemoryEntryOrigins as s, deleteMemoryEntryOriginsInDatabase as t };
