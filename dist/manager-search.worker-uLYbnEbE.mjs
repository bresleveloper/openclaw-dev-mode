import { i as getAdmittedSqliteSchemaFacts, t as admitSqliteSchema } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { r as openNodeSqliteDatabase } from "./node-sqlite-CYaq-2Hb.mjs";
import { i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { a as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { g as MEMORY_INDEX_SOURCES_TABLE, l as MEMORY_INDEX_META_TABLE, p as MEMORY_INDEX_CHUNKS_TABLE, u as MEMORY_INDEX_STATE_TABLE } from "./memory-schema-DY2eOY6N.mjs";
import { a as withFreshOpenClawAgentDatabaseReadOnly, n as openOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-open-DcexysGa.mjs";
import { n as withOpenClawAgentDatabaseReadOnly, t as retainOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
import { n as serveWorkerTasks } from "./worker-task-server-sMsYUF1K.mjs";
import { t as loadSqliteVecExtension } from "./sqlite-vec-DjjFDiM4.mjs";
import "./memory-core-host-engine-knn--De7HW1q.mjs";
import "./worker-task-server-T-g3Ibxb.mjs";
import { a as readCuratedMemoryTriggerCandidates, o as readCuratedProjectMemoryCandidates } from "./engine-storage-DAQECy5K.mjs";
import { n as readMemoryEntryOriginsInDatabase } from "./memory-core-host-engine-storage-wV2XR0Rc.mjs";
import "./sqlite-runtime-COh9hQA9.mjs";
import "./sqlite-worker-runtime-Da3qtgYL.mjs";
import { n as hasMemorySessionTombstone } from "./memory-session-tombstones-CXVQjYXY.mjs";
import { n as referencesSession, r as scrubMemoryContent } from "./memory-forget-content-B4g5ZnfG.mjs";
import { t as isMemorySessionIndexable } from "./manager-session-sync-state-CA5Z9OSL.mjs";
import { c as readMemoryRetrievalIndexState, o as readMemoryDatabaseFacts, s as readMemoryRecallData } from "./manager-source-index-kernel-DMTrRWNm.mjs";
import "./memory-core-host-engine-schema-9m2yhquC.mjs";
import { t as readMemoryIndex } from "./manager-index-read-CF3b7_Bh.mjs";
import { a as searchKeywordWithFallback, o as searchChunksByEmbedding, t as collectMemoryStatusSnapshot } from "./manager-status-state-D29k4MxO.mjs";
//#region extensions/memory-core/src/memory-entry-origin-reads.ts
function queryOrigins(db, request) {
	if (request.kind === "origin-rows") return {
		kind: request.kind,
		rows: db && tableExists(db, "memory_entry_origins") ? readMemoryEntryOriginsInDatabase(db, request) : []
	};
	if (!db) return {
		kind: request.kind,
		indices: []
	};
	const indices = [];
	const length = Math.min(request.sessionIds.length, 256);
	for (let index = 0; index < length; index += 1) if (hasMemorySessionTombstone(db, request.agentId, request.sessionIds[index])) indices.push(index);
	return {
		kind: request.kind,
		indices
	};
}
function readMemoryOriginsInWorker(request) {
	const result = withOpenClawAgentDatabaseReadOnly(({ db }) => queryOrigins(db, request), {
		agentId: request.agentId,
		path: request.databasePath,
		env: { OPENCLAW_STATE_DIR: request.stateDir }
	});
	return result.found ? result.value : queryOrigins(void 0, request);
}
//#endregion
//#region extensions/memory-core/src/memory-forget-index-read.ts
async function readMemoryForgetIndexInWorker(request) {
	const options = {
		agentId: request.agentId,
		path: request.databasePath,
		env: { OPENCLAW_STATE_DIR: request.stateDir }
	};
	const params = {
		agentId: request.agentId,
		changedPaths: new Set(request.changedPaths),
		removedPaths: new Set(request.removedPaths),
		sessionIds: new Set(request.sessionIds),
		excludedSessionIds: new Set(request.excludedSessionIds),
		entryKeys: new Set(request.entryKeys),
		corpusSnippets: new Set(request.corpusSnippets)
	};
	const result = withFreshOpenClawAgentDatabaseReadOnly(({ db }) => {
		const kysely = getNodeSqliteKysely(db);
		const indexedChunks = executeSqliteQuerySync(db, kysely.selectFrom("memory_index_chunks as chunk").select([
			"chunk.id",
			"chunk.path",
			"chunk.source"
		]).$if(tableExists(db, "memory_index_chunk_provenance"), (query) => query.leftJoin("memory_index_chunk_provenance as provenance", "provenance.chunk_id", "chunk.id").select(["provenance.origin_class as originClass", "provenance.session_kind as sessionKind"])).select((eb) => eb.case("chunk.source").when("sessions").then("").else(eb.ref("chunk.text")).end().as("text"))).rows;
		const changedPaths = new Set(params.changedPaths);
		for (const chunk of indexedChunks) if (chunk.source === "memory" && scrubMemoryContent({
			...params,
			content: chunk.text
		}).content !== chunk.text) changedPaths.add(chunk.path);
		const chunks = indexedChunks.filter((chunk) => changedPaths.has(chunk.path) || referencesSession(chunk.path, params.agentId, params.sessionIds) || params.sessionIds.size > 0 && chunk.source === "sessions" && (chunk.originClass === "system" || !isMemorySessionIndexable({ sessionKind: chunk.sessionKind ?? "unknown" }) || referencesSession(chunk.path, params.agentId, params.excludedSessionIds)));
		const removedSessionPaths = new Set(chunks.filter((chunk) => chunk.source === "sessions").map((chunk) => chunk.path));
		const sources = params.removedPaths.size > 0 || removedSessionPaths.size > 0 ? executeSqliteQuerySync(db, kysely.selectFrom("memory_index_sources").select(["path", "source"])).rows.filter((source) => params.removedPaths.has(source.path) || source.source === "sessions" && removedSessionPaths.has(source.path)) : [];
		const chunkIds = chunks.map((chunk) => chunk.id);
		const ftsRows = chunkIds.length > 0 && tableExists(db, "memory_index_chunks_fts") ? executeSqliteQuerySync(db, kysely.selectFrom("memory_index_chunks_fts").select((eb) => eb.fn.countAll().as("count")).where("rowid", "in", kysely.selectFrom("memory_index_chunks").select("chunk_rowid").where("id", "in", chunkIds))).rows[0].count : 0;
		const hasVectorTable = tableExists(db, "memory_index_chunks_vec");
		let embeddingCacheRows = 0;
		if (params.sessionIds.size > 0 && tableExists(db, "memory_embedding_cache")) embeddingCacheRows = executeSqliteQuerySync(db, kysely.selectFrom("memory_embedding_cache").select((eb) => eb.fn.countAll().as("count"))).rows[0].count;
		return {
			chunks: chunks.map(({ id, path, source }) => ({
				id,
				path,
				source
			})),
			sources,
			ftsRows,
			embeddingCacheRows,
			hasVectorTable
		};
	}, options);
	if (!result.found) return {
		chunks: [],
		sources: [],
		ftsRows: 0,
		vectorRows: 0,
		embeddingCacheRows: 0,
		hasVectorTable: false
	};
	let vectorRows = 0;
	let extensionPath;
	if (result.value.hasVectorTable && result.value.chunks.length > 0) {
		const probe = openNodeSqliteDatabase(":memory:", { allowExtension: true });
		let preparedExtensionPath;
		try {
			const loaded = await loadSqliteVecExtension({ db: probe });
			if (!loaded.ok || !loaded.extensionPath) throw new Error(`memory forget cannot inspect vector index: ${loaded.error ?? "load failed"}`);
			preparedExtensionPath = loaded.extensionPath;
		} finally {
			probe.close();
		}
		extensionPath = preparedExtensionPath;
		const vectorResult = withFreshOpenClawAgentDatabaseReadOnly(({ db }) => {
			db.enableLoadExtension(true);
			db.loadExtension(preparedExtensionPath);
			const vectorKysely = getNodeSqliteKysely(db);
			return executeSqliteQuerySync(db, vectorKysely.selectFrom("memory_index_chunks_vec").select((eb) => eb.fn.countAll().as("count")).where("id", "in", result.value.chunks.map((chunk) => chunk.id))).rows[0].count;
		}, options, { allowExtension: true });
		vectorRows = vectorResult.found ? vectorResult.value : 0;
	}
	return {
		...result.value,
		vectorRows,
		extensionPath
	};
}
//#endregion
//#region extensions/memory-core/src/memory/manager-status-presence.ts
const MEMORY_INDEX_META_KEY = "memory_index_meta_v1";
/** Inspect existing memory tables without constructing or migrating a manager. */
function inspectMemoryIndexPresenceInWorker(databasePath) {
	let db;
	try {
		db = openNodeSqliteDatabase(databasePath, { readOnly: true });
		admitSqliteSchema(db);
		const builtInMemoryTableSets = [{
			meta: MEMORY_INDEX_META_TABLE,
			sources: MEMORY_INDEX_SOURCES_TABLE,
			chunks: MEMORY_INDEX_CHUNKS_TABLE
		}, {
			meta: "meta",
			sources: "files",
			chunks: "chunks"
		}];
		for (const tables of builtInMemoryTableSets) {
			if (tableExists(db, tables.meta) && db.prepare(`SELECT 1 AS ok FROM ${tables.meta} WHERE key = ? LIMIT 1`).get(MEMORY_INDEX_META_KEY)) return true;
			for (const tableName of [tables.sources, tables.chunks]) if (tableExists(db, tableName) && db.prepare(`SELECT 1 AS ok FROM ${tableName} LIMIT 1`).get()) return true;
		}
		return false;
	} catch {
		return false;
	} finally {
		try {
			db?.close();
		} catch {}
	}
}
//#endregion
//#region extensions/memory-core/src/memory/manager-search.worker.ts
serveWorkerTasks(async (input) => {
	const request = input;
	if (request.kind === "prewarm") return { kind: "prewarm" };
	if (request.kind === "presence") return {
		kind: "presence",
		present: inspectMemoryIndexPresenceInWorker(request.databasePath)
	};
	if (request.kind === "forget-index-plan") return {
		kind: request.kind,
		plan: await readMemoryForgetIndexInWorker(request)
	};
	if (request.kind === "origin-rows" || request.kind === "session-tombstones") return readMemoryOriginsInWorker(request);
	if (request.kind === "recall-metadata") {
		const result = withOpenClawAgentDatabaseReadOnly(({ db }) => readMemoryRecallData(db, request), {
			agentId: request.agentId,
			path: request.databasePath
		});
		if (!result.found) throw new Error(`Memory search database unavailable: ${result.reason}`);
		return {
			kind: "recall-metadata",
			...result.value
		};
	}
	const target = {
		agentId: request.agentId,
		path: request.databasePath
	};
	const opened = request.kind === "vector-load" ? openOpenClawAgentDatabaseReadOnly(target, { allowExtension: true }) : retainOpenClawAgentDatabaseReadOnly(target);
	if (!opened.found) {
		if (opened.reason === "database-missing" && request.kind === "admission") return {
			kind: "admission",
			admission: {
				hasIndex: false,
				ftsAvailable: false
			}
		};
		if (opened.reason === "database-missing" && request.kind === "status") return {
			kind: "status",
			snapshot: collectMemoryStatusSnapshot(void 0, request.databasePath, request.query)
		};
		if (opened.reason === "database-missing" && (request.kind === "index-state" || request.kind === "keyword" && request.includeIndexState)) {
			const state = {
				meta: null,
				hasIndexedChunks: false,
				hasFtsContent: false,
				vectorState: { state: "empty" }
			};
			return request.kind === "index-state" ? {
				kind: "index-state",
				state
			} : {
				kind: "keyword",
				indexState: state,
				body: { rows: [] },
				path: { rows: [] }
			};
		}
		throw new Error(`Memory search database unavailable: ${opened.reason}`);
	}
	const { db } = opened.database;
	try {
		if (request.kind === "admission" || request.kind === "status") {
			const schema = getAdmittedSqliteSchemaFacts(db);
			if (!schema) throw new Error("Memory reader requires admitted schema facts");
			const hasIndex = schema.tables.has(MEMORY_INDEX_STATE_TABLE);
			if (request.kind === "admission") return {
				kind: "admission",
				admission: {
					hasIndex,
					ftsAvailable: hasIndex && schema.tables.has("memory_index_chunks_fts"),
					facts: hasIndex ? readMemoryDatabaseFacts(db) : void 0,
					identity: readOpenClawAgentDatabaseIdentity(opened.database),
					schemaVersion: schema.userVersion
				}
			};
			return {
				kind: "status",
				snapshot: collectMemoryStatusSnapshot(hasIndex ? db : void 0, request.databasePath, request.query)
			};
		}
		if (request.kind === "vector-load") return {
			kind: "vector-load",
			result: await loadSqliteVecExtension({
				db,
				extensionPath: request.extensionPath
			})
		};
		if (request.kind === "index-read") {
			const read = () => readMemoryIndex(db, request.command);
			return {
				kind: "index-read",
				read: request.command.type === "cache.read" ? runSqliteDeferredTransactionSync(db, read) : read()
			};
		}
		if (request.kind === "index-state") return {
			kind: "index-state",
			state: readMemoryRetrievalIndexState(db)
		};
		if (request.kind === "curated") {
			const provenanceRepairPending = request.checkProvenanceRepair && executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("memory_index_sources").select("hash").where("source", "=", "memory").where("hash", "=", "").limit(1)).rows.length > 0;
			return {
				kind: "curated",
				provenanceRepairPending,
				rows: provenanceRepairPending ? [] : request.projectsOnly ? readCuratedProjectMemoryCandidates(db, request.limit, request.activeProjectKeys ?? []) : readCuratedMemoryTriggerCandidates(db, request.limit, request.activeProjectKeys)
			};
		}
		if (request.kind === "vector") return {
			kind: "vector",
			rows: await searchChunksByEmbedding({
				...request.query,
				db
			})
		};
		const indexState = request.includeIndexState ? readMemoryRetrievalIndexState(db) : void 0;
		const { body, path } = await searchKeywordWithFallback({
			...request.query,
			db
		});
		const recallData = request.query.includeRecallMetadata ? readMemoryRecallData(db, {
			candidates: [...body.rows, ...path.rows],
			includeMemoryMtimes: false
		}) : void 0;
		return {
			kind: "keyword",
			body,
			path,
			...indexState ? { indexState } : {},
			...recallData ? { recallData } : {}
		};
	} finally {
		if ("claim" in opened) opened.claim.release();
		else opened.database.close();
	}
});
//#endregion
export {};
