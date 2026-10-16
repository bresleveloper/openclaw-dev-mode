import { a as getNodeSqliteKysely, o as iterateSqliteQuerySync, r as executeSqliteQuerySync, t as compileSqliteQueryBindings } from "./kysely-sync-K7ftY-g4.mjs";
import { n as decodeMemoryEmbedding, r as encodeMemoryEmbedding } from "./embedding-vector-DA_9H0FL.mjs";
import "./memory-core-host-engine-storage-CqSKqDgK.mjs";
import "./sqlite-worker-runtime-BFi6Nryt.mjs";
import fs from "node:fs";
//#region extensions/memory-core/src/memory/manager-embedding-cache.ts
/** Require a finite, nonempty vector compatible with the active embedding dimensions. */
function isValidMemoryEmbedding(embedding, dimensions) {
	return Array.isArray(embedding) && embedding.length > 0 && (dimensions === void 0 || embedding.length === dimensions) && embedding.every((coordinate) => typeof coordinate === "number" && Number.isFinite(coordinate));
}
function loadMemoryEmbeddingCache(params) {
	if (!params.enabled || params.providerIdentities.length === 0 || params.hashes.length === 0) return /* @__PURE__ */ new Map();
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
/** The caller holds the write transaction; another purge may have reduced the cache. */
function pruneMemoryEmbeddingCache(database, maxEntries) {
	const excess = countMemoryEmbeddingCache(database) - maxEntries;
	if (excess <= 0) return;
	deleteOldestMemoryEmbeddingCacheRows(database, Math.min(excess, 100));
}
function deleteOldestMemoryEmbeddingCacheRows(database, limit) {
	const db = getNodeSqliteKysely(database);
	executeSqliteQuerySync(database, db.deleteFrom("memory_embedding_cache").where("rowid", "in", db.selectFrom("memory_embedding_cache").select("rowid").orderBy("updated_at", "asc").orderBy("rowid", "asc").limit(limit)));
}
/** Discard ambiguous vector spaces without removing unrelated provider caches or index rows. */
function clearMemoryEmbeddingCacheIdentities(database, identities) {
	const db = getNodeSqliteKysely(database);
	for (const identity of identities) executeSqliteQuerySync(database, db.deleteFrom("memory_embedding_cache").where("provider", "=", identity.provider).where("model", "=", identity.model).where("provider_key", "=", identity.providerKey));
}
function prepareMemoryEmbeddingCacheUpsert(db) {
	const { compiled, bind } = compileSqliteQueryBindings((parameter) => getNodeSqliteKysely(db).insertInto("memory_embedding_cache").values({
		provider: parameter((row) => row.provider),
		model: parameter((row) => row.model),
		provider_key: parameter((row) => row.provider_key),
		hash: parameter((row) => row.hash),
		embedding: parameter((row) => row.embedding),
		dims: parameter((row) => row.dims),
		updated_at: parameter((row) => row.updated_at)
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
	const statement = db.prepare(compiled.sql);
	statement.setReadBigInts(true);
	return (row) => statement.run(...bind(row));
}
function upsertMemoryEmbeddingCache(params) {
	const provider = params.provider;
	if (!params.enabled || !provider || !params.providerKey) return;
	const lastRows = /* @__PURE__ */ new Map();
	let row = 0;
	for (const entry of params.entries()) lastRows.set(entry.hash, row++);
	const uniqueRows = [...lastRows].toSorted((left, right) => left[1] - right[1]);
	const maxEntries = typeof params.maxEntries === "number" && Number.isFinite(params.maxEntries) && params.maxEntries > 0 ? Math.floor(params.maxEntries) : void 0;
	const retainedRows = maxEntries === void 0 ? uniqueRows : uniqueRows.slice(-maxEntries);
	if (retainedRows.length === 0) return;
	if (maxEntries !== void 0) reserveMemoryEmbeddingCacheCapacity({
		db: params.db,
		provider,
		providerKey: params.providerKey,
		hashes: retainedRows.map(([hash]) => hash),
		maxEntries
	});
	const now = params.now ?? Date.now();
	const upsert = prepareMemoryEmbeddingCacheUpsert(params.db);
	const retained = new Set(retainedRows.map(([, index]) => index));
	row = 0;
	for (const entry of params.entries()) {
		if (!retained.has(row++)) continue;
		const embedding = entry.embedding ?? [];
		upsert({
			provider: provider.id,
			model: provider.model,
			provider_key: params.providerKey,
			hash: entry.hash,
			embedding: encodeMemoryEmbedding(embedding),
			dims: embedding.length,
			updated_at: now
		});
	}
}
function reserveMemoryEmbeddingCacheCapacity(params) {
	const db = getNodeSqliteKysely(params.db);
	for (let start = 0; start < params.hashes.length; start += 400) executeSqliteQuerySync(params.db, db.deleteFrom("memory_embedding_cache").where("provider", "=", params.provider.id).where("model", "=", params.provider.model).where("provider_key", "=", params.providerKey).where("hash", "in", params.hashes.slice(start, start + 400)));
	const retainedCapacity = params.maxEntries - params.hashes.length;
	const excess = countMemoryEmbeddingCache(params.db) - retainedCapacity;
	if (excess > 0) deleteOldestMemoryEmbeddingCacheRows(params.db, excess);
}
function collectMemoryCachedEmbeddings(params) {
	const embeddings = Array.from({ length: params.chunks.length }, () => []);
	const missing = [];
	for (let index = 0; index < params.chunks.length; index += 1) {
		const chunk = params.chunks[index];
		const hit = chunk?.hash ? params.cached.get(chunk.hash) : void 0;
		if (hit && hit.length > 0) embeddings[index] = hit;
		else if (chunk) missing.push({
			index,
			chunk
		});
	}
	return {
		embeddings,
		missing
	};
}
//#endregion
//#region extensions/memory-core/src/memory/manager-shadow-task.ts
function readMemoryShadowIdentity(filename) {
	const info = fs.statSync(filename, { bigint: true });
	if (!info.isFile()) throw new Error("Memory reindex shadow is not a regular file");
	return {
		device: String(info.dev),
		inode: String(info.ino)
	};
}
function assertMemoryShadowIdentity(filename, expected) {
	const actual = readMemoryShadowIdentity(filename);
	if (actual.device !== expected.device || actual.inode !== expected.inode) throw new Error("Memory reindex shadow file changed during its owned lifetime");
}
//#endregion
export { countMemoryEmbeddingCache as a, pruneMemoryEmbeddingCache as c, collectMemoryCachedEmbeddings as i, upsertMemoryEmbeddingCache as l, readMemoryShadowIdentity as n, isValidMemoryEmbedding as o, clearMemoryEmbeddingCacheIdentities as r, loadMemoryEmbeddingCache as s, assertMemoryShadowIdentity as t };
