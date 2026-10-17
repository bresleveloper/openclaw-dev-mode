import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { a as getNodeSqliteKysely, r as executeSqliteQuerySync, u as sqliteStringSet } from "./kysely-sync-K7ftY-g4.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-XIcwmOrl.mjs";
import { i as tableExists } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { c as MEMORY_INDEX_META_TABLE, f as MEMORY_INDEX_CHUNKS_TABLE, h as MEMORY_INDEX_SOURCES_TABLE } from "./memory-schema-BA04oCjG.mjs";
import { i as withFreshOpenClawAgentDatabaseReadOnly, n as openOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-open-hQ4ohjUT.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C4wDuLrp.mjs";
import { n as serveWorkerTasks } from "./worker-task-server-BC_7U18u.mjs";
import { t as loadSqliteVecExtension } from "./sqlite-vec-BcbJNyja.mjs";
import "./memory-core-host-engine-knn-DTjLOT03.mjs";
import "./error-runtime-BmospGvZ.mjs";
import "./worker-task-server-OcaoXQUy.mjs";
import { a as readCuratedMemoryTriggerCandidates, o as readCuratedProjectMemoryCandidates } from "./engine-storage-Cd_FIR_H.mjs";
import { n as readMemoryEntryOriginsInDatabase } from "./memory-core-host-engine-storage-D1iAJzGI.mjs";
import "./sqlite-runtime-Ch9K5Xik.mjs";
import { a as extractPromotionKeys } from "./short-term-promotion-memory-write-CM8ubexx.mjs";
import { n as referencesSession, r as scrubMemoryContent } from "./memory-forget-content-6V7NKQaY.mjs";
import { t as isMemorySessionIndexable } from "./manager-session-sync-state-CC68bJ0_.mjs";
import { c as readMemoryRecallData, i as searchChunksByEmbedding, l as readMemoryRetrievalIndexState, m as buildFtsQuery, n as searchKeyword, p as bm25RankToScore, r as searchPathKeyword } from "./manager-search-CbWN0Q_u.mjs";
import "./memory-core-host-engine-schema-C2UMfTcl.mjs";
//#region extensions/memory-core/src/memory-entry-origin-reads.ts
function queryOrigins(db, request) {
	if (request.kind === "origin-rows") return {
		kind: request.kind,
		rows: db && tableExists(db, "memory_entry_origins") ? readMemoryEntryOriginsInDatabase(db, request) : []
	};
	if (request.kind === "origin-exists") {
		let exists = false;
		if (db && tableExists(db, "memory_entry_origins")) {
			let query = getNodeSqliteKysely(db).selectFrom("memory_entry_origins").select("entry_key").where("agent_id", "=", request.agentId).where("entry_key", "in", sqliteStringSet(request.entryKeys));
			if (request.sessionIds) query = query.where("session_id", "in", sqliteStringSet(request.sessionIds));
			exists = executeSqliteQuerySync(db, query.limit(1)).rows.length > 0;
		}
		return {
			kind: request.kind,
			exists
		};
	}
	if (request.kind === "session-tombstones") {
		if (!db || !tableExists(db, "memory_session_tombstones")) return {
			kind: request.kind,
			rows: []
		};
		let query = getNodeSqliteKysely(db).selectFrom("memory_session_tombstones").selectAll().where("agent_id", "=", request.agentId);
		if (request.sessionIds) query = query.where("session_id", "in", sqliteStringSet(request.sessionIds));
		return {
			kind: request.kind,
			rows: executeSqliteQuerySync(db, query.orderBy("session_id", "asc")).rows.map((row) => ({
				sessionId: row.session_id,
				agentId: row.agent_id,
				reason: row.reason,
				createdAt: row.created_at
			}))
		};
	}
	const keys = db ? executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("memory_index_chunks").select("text").where("source", "=", "memory").where("text", "like", "%openclaw-memory-promotion:%")).rows.flatMap(({ text }) => extractPromotionKeys(text)) : [];
	return {
		kind: request.kind,
		keys
	};
}
function readMemoryOriginsInWorker(request) {
	const result = withFreshOpenClawAgentDatabaseReadOnly(({ db }) => queryOrigins(db, request), {
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
		const sources = executeSqliteQuerySync(db, kysely.selectFrom("memory_index_sources").select(["path", "source"])).rows.filter((source) => params.removedPaths.has(source.path) || source.source === "sessions" && removedSessionPaths.has(source.path));
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
		const builtInMemoryTableSets = [{
			meta: MEMORY_INDEX_META_TABLE,
			sources: MEMORY_INDEX_SOURCES_TABLE,
			chunks: MEMORY_INDEX_CHUNKS_TABLE
		}, {
			meta: "meta",
			sources: "files",
			chunks: "chunks"
		}];
		const builtInMemoryTables = builtInMemoryTableSets.flatMap(({ meta, sources, chunks }) => [
			meta,
			sources,
			chunks
		]);
		const tableNames = new Set(db.prepare(`SELECT name FROM sqlite_master WHERE type = 'table' AND name IN (${builtInMemoryTables.map(() => "?").join(", ")})`).all(...builtInMemoryTables).map((row) => row.name).filter((name) => typeof name === "string"));
		for (const tables of builtInMemoryTableSets) {
			if (tableNames.has(tables.meta) && db.prepare(`SELECT 1 AS ok FROM ${tables.meta} WHERE key = ? LIMIT 1`).get(MEMORY_INDEX_META_KEY)) return true;
			for (const tableName of [tables.sources, tables.chunks]) if (tableNames.has(tableName) && db.prepare(`SELECT 1 AS ok FROM ${tableName} LIMIT 1`).get()) return true;
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
	if (request.kind === "origin-rows" || request.kind === "origin-exists" || request.kind === "session-tombstones" || request.kind === "origin-index-keys") return readMemoryOriginsInWorker(request);
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
	const opened = openOpenClawAgentDatabaseReadOnly({
		agentId: request.agentId,
		path: request.databasePath
	});
	if (!opened.found) {
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
		return {
			kind: "keyword",
			body: await searchKeyword({
				...request.query.body,
				db,
				buildFtsQuery,
				bm25RankToScore
			}).then((rows) => ({ rows })).catch((error) => ({
				rows: [],
				error: formatErrorMessage(error)
			})),
			path: await searchPathKeyword({
				...request.query.path,
				db,
				buildFtsQuery,
				bm25RankToScore
			}).then((rows) => ({ rows })).catch((error) => ({
				rows: [],
				error: formatErrorMessage(error)
			})),
			...indexState ? { indexState } : {}
		};
	} finally {
		opened.database.close();
	}
});
//#endregion
export {};
