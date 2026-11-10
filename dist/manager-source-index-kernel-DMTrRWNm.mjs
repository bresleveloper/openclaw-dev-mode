import { a as executeSqliteQueryTakeFirstSync, d as sqliteStringSet, i as executeSqliteQuerySync, o as getNodeSqliteKysely, s as iterateSqliteQuerySync, t as compileSqliteQueryBindings } from "./kysely-sync-9fPQaMlh.mjs";
import { a as runSqliteImmediateTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { d as MEMORY_INDEX_VECTOR_TABLE } from "./memory-schema-DY2eOY6N.mjs";
import { n as encodeMemoryEmbedding, t as decodeMemoryEmbedding } from "./embedding-vector-BfmrIPiB.mjs";
import { t as vectorToBlob } from "./vector-blob-T_j5xTNO.mjs";
import { p as listMemoryFiles, s as readMemoryRecallMetadata, u as buildFileEntry } from "./engine-storage-DAQECy5K.mjs";
import "./memory-core-host-engine-storage-wV2XR0Rc.mjs";
import { t as hashText } from "./hash-BOTtT1fO.mjs";
import { t as runWithConcurrency } from "./concurrency-BvONODc2.mjs";
import "./sqlite-worker-runtime-Da3qtgYL.mjs";
import "./memory-core-host-engine-schema-9m2yhquC.mjs";
import { a as resolvePersistedMemoryVectorIndexState, i as resolveMemoryVectorIndexState, r as markMemoryVectorRebuildRequired, t as VECTOR_REBUILD_META_KEY } from "./manager-vector-rebuild-state-C9-1fnZd.mjs";
import "./memory-core-host-engine-indexing-DILm2lK4.mjs";
//#region extensions/memory-core/src/memory/manager-embedding-cache.ts
/** Require a finite, nonempty vector compatible with the active embedding dimensions. */
function isValidMemoryEmbedding(embedding, dimensions) {
	return Array.isArray(embedding) && embedding.length > 0 && (dimensions === void 0 || embedding.length === dimensions) && embedding.every((coordinate) => typeof coordinate === "number" && Number.isFinite(coordinate));
}
function loadMemoryEmbeddingCache(params) {
	if (params.providerIdentities.length === 0 || params.hashes.length === 0) return /* @__PURE__ */ new Map();
	const unresolved = new Set(params.hashes.filter(Boolean));
	if (unresolved.size === 0) return /* @__PURE__ */ new Map();
	const db = getNodeSqliteKysely(params.db);
	const out = /* @__PURE__ */ new Map();
	const batchSize = 400;
	for (const identity of params.providerIdentities) {
		if (unresolved.size === 0) break;
		const hashes = [...unresolved];
		for (let start = 0; start < hashes.length; start += batchSize) {
			const batch = hashes.slice(start, start + batchSize);
			const query = db.selectFrom("memory_embedding_cache").select(["hash", "embedding"]).select((eb) => eb.or([eb("dims", "is", null), eb("dims", "=", eb(eb.fn("length", ["embedding"]), "/", eb.lit(8)))]).as("dimensions_match")).where("provider", "=", identity.provider).where("model", "=", identity.model).where("provider_key", "=", identity.providerKey).where("hash", "in", batch);
			for (const row of iterateSqliteQuerySync(params.db, query)) {
				const embedding = decodeMemoryEmbedding(row.embedding);
				out.set(row.hash, row.dimensions_match && isValidMemoryEmbedding(embedding) ? embedding : []);
				unresolved.delete(row.hash);
			}
		}
	}
	return out;
}
function countMemoryEmbeddingCache(database) {
	const db = getNodeSqliteKysely(database);
	return executeSqliteQuerySync(database, db.selectFrom("memory_embedding_cache").select((eb) => eb.fn.countAll().as("count"))).rows[0].count;
}
/** The publication owner supplies its retained count and holds the write transaction. */
function pruneMemoryEmbeddingCache(database, cacheSize, maxEntries) {
	const excess = cacheSize - maxEntries;
	if (excess <= 0) return cacheSize;
	const limit = Math.min(excess, 100);
	const removed = deleteOldestMemoryEmbeddingCacheRows(database, limit);
	return removed < limit ? 0 : cacheSize - removed;
}
function deleteOldestMemoryEmbeddingCacheRows(database, limit) {
	const db = getNodeSqliteKysely(database);
	const result = executeSqliteQuerySync(database, db.deleteFrom("memory_embedding_cache").where("rowid", "in", db.selectFrom("memory_embedding_cache").select("rowid").orderBy("updated_at", "asc").orderBy("rowid", "asc").limit(limit)));
	return Number(result.numAffectedRows);
}
/** Discard ambiguous vector spaces without removing unrelated provider caches or index rows. */
function clearMemoryEmbeddingCacheIdentities(database, identities) {
	const db = getNodeSqliteKysely(database);
	let removed = 0;
	for (const identity of identities) {
		const result = executeSqliteQuerySync(database, db.deleteFrom("memory_embedding_cache").where("provider", "=", identity.provider).where("model", "=", identity.model).where("provider_key", "=", identity.providerKey));
		removed += Number(result.numAffectedRows);
	}
	return removed;
}
/** Evicts within the caller budget; full rebuilds supply bounded temporary headroom. */
function upsertMemoryEmbeddingCache(params) {
	let cacheSize = params.cacheSize;
	const provider = params.provider;
	const lastRows = /* @__PURE__ */ new Map();
	let row = 0;
	for (const entry of params.entries()) lastRows.set(entry.hash, row++);
	const uniqueRows = [...lastRows].toSorted((left, right) => left[1] - right[1]);
	const maxEntries = typeof params.maxEntries === "number" && Number.isFinite(params.maxEntries) && params.maxEntries > 0 ? Math.floor(params.maxEntries) : void 0;
	const retainedRows = maxEntries === void 0 ? uniqueRows : uniqueRows.slice(-maxEntries);
	if (retainedRows.length === 0) return cacheSize;
	if (maxEntries !== void 0) {
		const db = getNodeSqliteKysely(params.db);
		const hashes = retainedRows.map(([hash]) => hash);
		for (let start = 0; start < hashes.length; start += 400) {
			const result = executeSqliteQuerySync(params.db, db.deleteFrom("memory_embedding_cache").where("provider", "=", provider.id).where("model", "=", provider.model).where("provider_key", "=", params.providerKey).where("hash", "in", hashes.slice(start, start + 400)));
			cacheSize -= Number(result.numAffectedRows);
		}
		const excess = cacheSize - (maxEntries - hashes.length);
		if (excess > 0) cacheSize -= deleteOldestMemoryEmbeddingCacheRows(params.db, excess);
	}
	const now = params.now ?? Date.now();
	const { compiled, bind } = compileSqliteQueryBindings((parameter) => getNodeSqliteKysely(params.db).insertInto("memory_embedding_cache").values({
		provider: provider.id,
		model: provider.model,
		provider_key: params.providerKey,
		hash: parameter((entry) => entry.hash),
		embedding: parameter((entry) => encodeMemoryEmbedding(entry.embedding)),
		dims: parameter((entry) => entry.embedding.length),
		updated_at: now
	}).onConflict((conflict) => conflict.columns([
		"provider",
		"model",
		"provider_key",
		"hash"
	]).doUpdateSet((eb) => ({
		embedding: eb.ref("excluded.embedding"),
		dims: eb.ref("excluded.dims"),
		updated_at: eb.ref("excluded.updated_at")
	}))));
	const statement = params.db.prepare(compiled.sql);
	statement.setReadBigInts(true);
	const retained = new Set(retainedRows.map(([, index]) => index));
	row = 0;
	for (const entry of params.entries()) {
		if (!retained.has(row++)) continue;
		statement.run(...bind(entry));
		cacheSize += 1;
	}
	return cacheSize;
}
function collectMemoryCachedEmbeddings(params) {
	const missing = [];
	return {
		embeddings: params.hashes.map((hash, index) => {
			const hit = hash ? params.cached.get(hash) : void 0;
			if (hit && hit.length > 0) return hit;
			missing.push(index);
			return [];
		}),
		missing
	};
}
//#endregion
//#region extensions/memory-core/src/memory/manager-source-state.ts
/** Resolve exactly the entries eligible for indexing, including validated multimodal files. */
async function resolveMemorySourceFileEntries(params) {
	const files = await (params.files?.listFiles ?? listMemoryFiles)(params.workspaceDir, params.settings.extraPaths, params.settings.multimodal, params.onSkippedSymlinkRoot);
	return (await runWithConcurrency(files.map((file) => async () => await (params.files?.inspectFile ?? buildFileEntry)(file, params.workspaceDir, params.settings.multimodal)), params.concurrency)).filter((entry) => entry !== null);
}
async function inspectMemorySourceState(params) {
	const skippedRoots = /* @__PURE__ */ new Set();
	const entries = await resolveMemorySourceFileEntries({
		...params,
		onSkippedSymlinkRoot: (root) => skippedRoots.add(root)
	});
	const indexedByPath = new Map((await params.readIndexedRows()).map((row) => [row.path, row.hash]));
	return {
		source: "memory",
		dirty: indexedByPath.size !== entries.length || entries.some((entry) => indexedByPath.get(entry.path) !== entry.hash),
		eligible: entries.length,
		issues: [...entries.length === 0 ? ["no eligible memory files found"] : [], ...Array.from(skippedRoots, (root) => `extra path "${root}" is a symlink root; symlinked roots are not traversed, so configure its resolved absolute directory instead`)]
	};
}
function loadMemorySourceFileState(params) {
	let query = getNodeSqliteKysely(params.db).selectFrom("memory_index_sources").select([
		"path",
		"hash",
		"mtime",
		"size"
	]).where("source", "=", params.source);
	if (params.paths) query = query.where("path", "in", sqliteStringSet(params.paths));
	return executeSqliteQuerySync(params.db, query).rows;
}
function refreshMemorySessionSourceState(db, input) {
	return Number(executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("memory_index_sources").set({
		hash: input.hash,
		mtime: input.mtime,
		size: input.size
	}).where("path", "=", input.path).where("source", "=", "sessions").where("hash", "=", input.expectedHash)).numAffectedRows) === 1;
}
//#endregion
//#region extensions/memory-core/src/memory/manager-retrieval-read.ts
const MEMORY_INDEX_META_KEY = "memory_index_meta_v1";
/** One bounded snapshot; retained text and embeddings never cross this boundary. */
function readMemoryDatabaseFacts(db, hasVectorTable = tableExists(db, MEMORY_INDEX_VECTOR_TABLE)) {
	const query = getNodeSqliteKysely(db);
	const row = executeSqliteQueryTakeFirstSync(db, query.selectFrom("memory_index_state").select((eb) => [
		"revision",
		eb.selectFrom("memory_index_meta").select("value").where("key", "=", MEMORY_INDEX_META_KEY).as("serialized"),
		eb.selectFrom("memory_index_meta").select("value").where("key", "=", VECTOR_REBUILD_META_KEY).as("vectorMarker"),
		...["memory", "sessions"].map((source) => eb.exists(eb.selectFrom("memory_index_sources").select("source").where("source", "=", source).where("hash", "=", "")).as(source)),
		eb.exists(eb.selectFrom("memory_index_chunks").select("model")).as("hasIndexedChunks"),
		eb.exists(eb.selectFrom("memory_index_chunks").select("model").where("model", "!=", "fts-only")).as("hasSemanticChunks")
	]).where("id", "=", 1));
	if (!row || !Number.isSafeInteger(row.revision)) throw new Error("Memory index revision is missing or invalid");
	const metadata = parseMemoryIndexMetadata(row.serialized);
	return {
		...metadata,
		revision: row.revision,
		hasIndexedChunks: Boolean(row.hasIndexedChunks),
		hasSemanticChunks: Boolean(row.hasSemanticChunks),
		invalidatedSources: ["memory", "sessions"].filter((source) => row[source]),
		hasVectorTable,
		vectorState: resolveMemoryVectorIndexState({
			marker: row.vectorMarker,
			hasVectorTable,
			metaVectorDims: metadata.meta?.vectorDims,
			hasSemanticChunks: Boolean(row.hasSemanticChunks)
		})
	};
}
function readMemoryIndexMetadata(db) {
	return parseMemoryIndexMetadata(db.prepare("SELECT value FROM memory_index_meta WHERE key = ?").get(MEMORY_INDEX_META_KEY)?.value);
}
function parseMemoryIndexMetadata(value) {
	if (typeof value !== "string" || !value) return {
		meta: null,
		serialized: null
	};
	try {
		return {
			meta: JSON.parse(value),
			serialized: value
		};
	} catch {
		return {
			meta: null,
			serialized: null
		};
	}
}
function readMemoryRetrievalIndexState(db) {
	const { meta } = readMemoryIndexMetadata(db);
	const hasIndexedChunks = db.prepare("SELECT 1 FROM memory_index_chunks LIMIT 1").get() !== void 0;
	return {
		meta,
		hasIndexedChunks,
		hasFtsContent: !hasIndexedChunks && tableExists(db, "memory_index_chunks_fts") && db.prepare(`SELECT 1 FROM memory_index_chunks_fts LIMIT 1`).get() !== void 0,
		vectorState: meta && meta.provider !== "none" ? resolvePersistedMemoryVectorIndexState({
			db,
			vectorTable: MEMORY_INDEX_VECTOR_TABLE,
			metaVectorDims: meta.vectorDims,
			hasSemanticChunks: db.prepare("SELECT 1 FROM memory_index_chunks WHERE model != 'fts-only' LIMIT 1").get() !== void 0
		}) : { state: "empty" }
	};
}
function readMemoryRecallData(db, request) {
	const rows = readMemoryRecallMetadata(db, request.candidates.map((entry) => entry.id));
	const sourceMtimes = {
		memory: /* @__PURE__ */ new Map(),
		sessions: /* @__PURE__ */ new Map()
	};
	for (const source of ["sessions", "memory"]) {
		if (source === "memory" && !request.includeMemoryMtimes) continue;
		const paths = Array.from(new Set(request.candidates.filter((entry) => entry.source === source && rows.has(entry.id)).map((entry) => entry.path)));
		if (paths.length > 0) sourceMtimes[source] = new Map(loadMemorySourceFileState({
			db,
			source,
			paths
		}).map((row) => [row.path, row.mtime]));
	}
	return {
		rows,
		sourceMtimes
	};
}
//#endregion
//#region extensions/memory-core/src/memory/manager-chunk-writer.ts
function writeMemoryChunks(database, context, rows) {
	if (rows.length === 0) return;
	const db = getNodeSqliteKysely(database);
	const written = rows.flatMap((row) => row.embedding === void 0 ? [] : [{
		...row,
		embedding: row.embedding
	}]);
	if (written.length > 0) executeSqliteQuerySync(database, db.insertInto("memory_index_chunks").values(written.map((row) => ({
		id: row.id,
		path: context.path,
		source: context.source,
		start_line: row.chunk.startLine,
		end_line: row.chunk.endLine,
		hash: row.chunk.hash,
		model: context.model,
		text: row.chunk.text,
		embedding: encodeMemoryEmbedding(row.embedding),
		updated_at: context.now
	}))).onConflict((conflict) => conflict.column("id").doUpdateSet((eb) => ({
		hash: eb.ref("excluded.hash"),
		model: eb.ref("excluded.model"),
		text: eb.ref("excluded.text"),
		embedding: eb.ref("excluded.embedding"),
		updated_at: eb.ref("excluded.updated_at")
	}))));
	executeSqliteQuerySync(database, db.insertInto("memory_index_chunk_recall_metadata").values(rows.map((row) => ({
		chunk_id: row.id,
		importance: row.chunk.importance,
		triggers: row.chunk.triggers,
		project_key: row.chunk.projectKey
	}))).onConflict((conflict) => conflict.column("chunk_id").doUpdateSet((eb) => ({
		importance: eb.ref("excluded.importance"),
		triggers: eb.ref("excluded.triggers"),
		project_key: eb.ref("excluded.project_key")
	}))));
	executeSqliteQuerySync(database, db.insertInto("memory_index_chunk_provenance").values(rows.map((row) => {
		const provenance = row.chunk.provenance ?? {
			originClass: "untrusted",
			sessionKind: "unknown",
			observedAt: context.now
		};
		return {
			chunk_id: row.id,
			origin_class: provenance.originClass,
			session_kind: provenance.sessionKind,
			observed_at: provenance.observedAt,
			supersedes_key: provenance.supersedesKey ?? null
		};
	})).onConflict((conflict) => conflict.column("chunk_id").doUpdateSet((eb) => ({
		origin_class: eb.ref("excluded.origin_class"),
		session_kind: eb.ref("excluded.session_kind"),
		observed_at: eb.ref("excluded.observed_at"),
		supersedes_key: eb.ref("excluded.supersedes_key")
	})).where((eb) => eb.or([
		"origin_class",
		"session_kind",
		"observed_at",
		"supersedes_key"
	].map((column) => eb(column, "is not", eb.ref(`excluded.${column}`)))))));
}
//#endregion
//#region extensions/memory-core/src/memory/manager-vector-write.ts
function writeMemoryVectors(db, rows) {
	if (rows.length === 0) return;
	const unique = [...new Map(rows.map((row) => [row.id, row])).values()];
	let deletion;
	for (const row of unique) try {
		deletion ??= db.prepare("DELETE FROM memory_index_chunks_vec WHERE id = ?");
		deletion.run(row.id);
	} catch {}
	db.prepare(`INSERT INTO memory_index_chunks_vec (id, embedding) VALUES ${unique.map(() => "(?, ?)").join(",")}`).run(...unique.flatMap((row) => [row.id, vectorToBlob(row.embedding)]));
}
//#endregion
//#region extensions/memory-core/src/memory/manager-source-index-kernel.ts
const SOURCE_WRITE_BATCH_SIZE = 128;
const MAX_VECTOR_POINT_DELETES = 32;
function memoryChunkRowId(source, pathname, chunk, model) {
	return hashText(`${source}:${pathname}:${chunk.startLine}:${chunk.endLine}:${chunk.hash}:${model}`);
}
/** Indexed row ids of one source and whether each row stores an embedding. */
function readMemorySourceChunks(db, source, path) {
	return executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("memory_index_chunks").leftJoin("memory_index_chunk_recall_metadata as recall", "recall.chunk_id", "memory_index_chunks.id").leftJoin("memory_index_chunk_provenance as provenance", "provenance.chunk_id", "memory_index_chunks.id").select((eb) => [
		"id",
		eb(eb.fn("length", ["embedding"]), ">", 0).as("embedded"),
		"recall.importance",
		"recall.triggers",
		"recall.project_key as projectKey",
		"provenance.origin_class as originClass",
		"provenance.session_kind as sessionKind",
		"provenance.observed_at as observedAt",
		"provenance.supersedes_key as supersedesKey"
	]).where("path", "=", path).where("source", "=", source)).rows.map((row) => Object.assign(row, { embedded: Boolean(row.embedded) }));
}
function readMemorySourceHash(db, source, path) {
	return executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("memory_index_sources").select("hash").where("path", "=", path).where("source", "=", source))?.hash;
}
var MemorySourceIndexKernel = class {
	constructor(database, state) {
		this.database = database;
		this.state = state;
	}
	replaceRows(params, rows) {
		const { entry, source, model, now, vectorReady } = params;
		const db = getNodeSqliteKysely(this.database);
		const delta = params.source === "sessions" && params.delta;
		const reuse = !delta && vectorReady && resolveMemoryVectorIndexState({
			marker: executeSqliteQueryTakeFirstSync(this.database, db.selectFrom("memory_index_meta").select("value").where("key", "=", "memory_vector_rebuild_v1"))?.value,
			hasVectorTable: this.state.hasVectorTable ?? this.state.vector.available === true,
			hasSemanticChunks: true
		}).state === "complete";
		const previous = reuse ? new Set(executeSqliteQuerySync(this.database, db.selectFrom("memory_index_chunks").select("id").where("path", "=", entry.path).where("source", "=", source)).rows.map((row) => row.id)) : void 0;
		if (!delta && !reuse) this.clear(entry.path, source);
		let findVector;
		let batch = [];
		let removedIds = [];
		let hasEmbeddings = false;
		const flush = () => {
			this.deleteIds(entry.path, source, removedIds);
			removedIds = [];
			const vectors = [...new Map(batch.flatMap((row) => row.embedding === void 0 ? [] : [[row.id, {
				id: row.id,
				embedding: row.embedding
			}]])).values()].filter((row) => {
				if (!reuse) return row.embedding.length > 0;
				findVector ??= this.database.prepare(`SELECT id FROM ${MEMORY_INDEX_VECTOR_TABLE} WHERE id = ?`);
				if (!findVector.get(row.id)) return row.embedding.length > 0;
				if (row.embedding.length === 0) {
					this.deleteVectors(entry.path, source, [row.id]);
					return false;
				}
				const old = executeSqliteQueryTakeFirstSync(this.database, db.selectFrom("memory_index_chunks").select("embedding").where("id", "=", row.id));
				return !old || !Buffer.from(old.embedding).equals(encodeMemoryEmbedding(row.embedding));
			});
			writeMemoryChunks(this.database, {
				path: entry.path,
				source,
				model,
				now
			}, batch);
			if (vectorReady) writeMemoryVectors(this.database, vectors);
			batch = [];
		};
		for (const row of rows) {
			if ("removedId" in row) {
				removedIds.push(row.removedId);
				if (removedIds.length === SOURCE_WRITE_BATCH_SIZE) flush();
				continue;
			}
			const { chunk, embedding, retained: keep } = row;
			const id = memoryChunkRowId(source, entry.path, chunk, model);
			previous?.delete(id);
			hasEmbeddings ||= !keep && embedding.length > 0;
			batch.push({
				id,
				chunk,
				...keep ? {} : { embedding }
			});
			if (batch.length === SOURCE_WRITE_BATCH_SIZE) flush();
		}
		flush();
		if (previous?.size) this.deleteIds(entry.path, source, [...previous], "complete-replacement");
		executeSqliteQuerySync(this.database, db.insertInto("memory_index_sources").values({
			path: entry.path,
			source,
			hash: entry.hash,
			mtime: entry.mtimeMs,
			size: entry.size
		}).onConflict((conflict) => conflict.columns(["path", "source"]).doUpdateSet((eb) => ({
			hash: eb.ref("excluded.hash"),
			mtime: eb.ref("excluded.mtime"),
			size: eb.ref("excluded.size")
		}))));
		if (!vectorReady && hasEmbeddings) markMemoryVectorRebuildRequired(this.database);
	}
	deleteIfCurrent(params) {
		if (readMemorySourceHash(this.database, params.source, params.path) !== params.expectedHash) return false;
		this.clear(params.path, params.source);
		executeSqliteQuerySync(this.database, getNodeSqliteKysely(this.database).deleteFrom("memory_index_sources").where("path", "=", params.path).where("source", "=", params.source));
		return true;
	}
	deleteIds(pathname, source, ids, cleanup = "session-delta") {
		if (ids.length === 0) return;
		this.deleteVectors(pathname, source, ids, cleanup);
		for (let offset = 0; offset < ids.length; offset += SOURCE_WRITE_BATCH_SIZE) executeSqliteQuerySync(this.database, getNodeSqliteKysely(this.database).deleteFrom("memory_index_chunks").where("id", "in", ids.slice(offset, offset + SOURCE_WRITE_BATCH_SIZE)));
	}
	deleteVectors(pathname, source, ids, cleanup = "session-delta") {
		if (!(this.state.hasVectorTable ?? this.state.vector.available === true)) return;
		if (!this.state.vector.enabled || this.state.vector.available !== true) {
			markMemoryVectorRebuildRequired(this.database);
			return;
		}
		try {
			runSqliteImmediateTransactionSync(this.database, () => {
				const sparse = ids ?? executeSqliteQuerySync(this.database, getNodeSqliteKysely(this.database).selectFrom("memory_index_chunks").select("id").where("path", "=", pathname).where("source", "=", source).limit(33)).rows.map((row) => row.id);
				if ((ids === void 0 || cleanup === "complete-replacement") && sparse.length > MAX_VECTOR_POINT_DELETES) {
					const deletion = this.database.prepare(`DELETE FROM ${MEMORY_INDEX_VECTOR_TABLE} WHERE id IN (SELECT id FROM memory_index_chunks WHERE path = ? AND source = ?` + (ids === void 0 ? "" : " AND id IN (SELECT value FROM json_each(?))") + ")");
					if (ids === void 0) deletion.run(pathname, source);
					else deletion.run(pathname, source, JSON.stringify(ids));
					return;
				}
				const deletion = this.database.prepare(`DELETE FROM ${MEMORY_INDEX_VECTOR_TABLE} WHERE id = ?`);
				for (const id of sparse) deletion.run(id);
			});
		} catch {
			markMemoryVectorRebuildRequired(this.database);
		}
	}
	clear(pathname, source) {
		this.deleteVectors(pathname, source);
		executeSqliteQuerySync(this.database, getNodeSqliteKysely(this.database).deleteFrom("memory_index_chunks").where("path", "=", pathname).where("source", "=", source));
	}
};
//#endregion
export { loadMemoryEmbeddingCache as _, MEMORY_INDEX_META_KEY as a, readMemoryRetrievalIndexState as c, refreshMemorySessionSourceState as d, resolveMemorySourceFileEntries as f, isValidMemoryEmbedding as g, countMemoryEmbeddingCache as h, readMemorySourceHash as i, inspectMemorySourceState as l, collectMemoryCachedEmbeddings as m, memoryChunkRowId as n, readMemoryDatabaseFacts as o, clearMemoryEmbeddingCacheIdentities as p, readMemorySourceChunks as r, readMemoryRecallData as s, MemorySourceIndexKernel as t, loadMemorySourceFileState as u, pruneMemoryEmbeddingCache as v, upsertMemoryEmbeddingCache as y };
