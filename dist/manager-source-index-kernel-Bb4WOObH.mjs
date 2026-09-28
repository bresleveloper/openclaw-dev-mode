import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync, t as compileSqliteQueryBindings } from "./kysely-sync-Bn6Qrpbz.mjs";
import { o as runSqliteImmediateTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { u as MEMORY_INDEX_VECTOR_TABLE } from "./memory-schema-CkxujvZk.mjs";
import { r as encodeMemoryEmbedding } from "./embedding-vector-CGPWflQ5.mjs";
import { t as vectorToBlob } from "./vector-blob-T_j5xTNO.mjs";
import { t as hashText } from "./hash-Di28TYtu.mjs";
import "./memory-core-host-engine-indexing-DlKd_hwL.mjs";
import "./memory-core-host-engine-schema-emU_afev.mjs";
import "./sqlite-worker-runtime-BV5P9OQ4.mjs";
import { n as markMemoryVectorRebuildRequired, r as memoryTableExists } from "./manager-vector-rebuild-state-anPytK-9.mjs";
//#region extensions/memory-core/src/memory/manager-chunk-writer.ts
function createMemoryChunkWriter(database, context) {
	const db = getNodeSqliteKysely(database);
	const chunkWrite = compileSqliteQueryBindings((parameter) => db.insertInto("memory_index_chunks").values({
		id: parameter((row) => row.id),
		path: context.path,
		source: context.source,
		start_line: parameter((row) => row.chunk.startLine),
		end_line: parameter((row) => row.chunk.endLine),
		hash: parameter((row) => row.chunk.hash),
		model: context.model,
		text: parameter((row) => row.chunk.text),
		embedding: parameter((row) => encodeMemoryEmbedding(row.embedding)),
		updated_at: context.now
	}).onConflict((conflict) => conflict.column("id").doUpdateSet((eb) => ({
		hash: eb.ref("excluded.hash"),
		model: eb.ref("excluded.model"),
		text: eb.ref("excluded.text"),
		embedding: eb.ref("excluded.embedding"),
		updated_at: eb.ref("excluded.updated_at")
	}))));
	const recallWrite = compileSqliteQueryBindings((parameter) => db.insertInto("memory_index_chunk_recall_metadata").values({
		chunk_id: parameter((row) => row.id),
		importance: parameter((row) => row.chunk.importance),
		triggers: parameter((row) => row.chunk.triggers),
		project_key: parameter((row) => row.chunk.projectKey)
	}).onConflict((conflict) => conflict.column("chunk_id").doUpdateSet((eb) => ({
		importance: eb.ref("excluded.importance"),
		triggers: eb.ref("excluded.triggers"),
		project_key: eb.ref("excluded.project_key")
	}))));
	const provenanceWrite = compileSqliteQueryBindings((parameter) => db.insertInto("memory_index_chunk_provenance").values({
		chunk_id: parameter((row) => row.id),
		origin_class: parameter((row) => row.provenance.originClass),
		session_kind: parameter((row) => row.provenance.sessionKind),
		observed_at: parameter((row) => row.provenance.observedAt),
		supersedes_key: parameter((row) => row.provenance.supersedesKey ?? null)
	}).onConflict((conflict) => conflict.column("chunk_id").doUpdateSet((eb) => ({
		origin_class: eb.ref("excluded.origin_class"),
		session_kind: eb.ref("excluded.session_kind"),
		observed_at: eb.ref("excluded.observed_at"),
		supersedes_key: eb.ref("excluded.supersedes_key")
	}))));
	let chunkStatement;
	let recallStatement;
	let provenanceStatement;
	return (id, chunk, embedding) => {
		const row = {
			id,
			chunk,
			embedding
		};
		(chunkStatement ??= database.prepare(chunkWrite.compiled.sql)).run(...chunkWrite.bind(row));
		(recallStatement ??= database.prepare(recallWrite.compiled.sql)).run(...recallWrite.bind(row));
		const provenance = chunk.provenance ?? {
			originClass: "untrusted",
			sessionKind: "unknown",
			observedAt: context.now
		};
		(provenanceStatement ??= database.prepare(provenanceWrite.compiled.sql)).run(...provenanceWrite.bind({
			id,
			provenance
		}));
	};
}
//#endregion
//#region extensions/memory-core/src/memory/manager-vector-write.ts
function createMemoryVectorWriter(db, tableName = "memory_index_chunks_vec") {
	let deleteStatement;
	let insertStatement;
	return (id, embedding) => {
		try {
			(deleteStatement ??= db.prepare(`DELETE FROM ${tableName} WHERE id = ?`)).run(id);
		} catch {}
		(insertStatement ??= db.prepare(`INSERT INTO ${tableName} (id, embedding) VALUES (?, ?)`)).run(id, vectorToBlob(embedding));
	};
}
//#endregion
//#region extensions/memory-core/src/memory/manager-source-index-kernel.ts
const MAX_VECTOR_POINT_DELETES = 32;
function readMemorySourceHash(db, source, path) {
	return executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("memory_index_sources").select("hash").where("path", "=", path).where("source", "=", source))?.hash;
}
var MemorySourceIndexKernel = class {
	constructor(database, state) {
		this.database = database;
		this.state = state;
	}
	replace(params) {
		this.replaceRows(params, (function* () {
			for (const [index, chunk] of params.chunks.entries()) yield {
				chunk,
				embedding: params.embeddings[index] ?? []
			};
		})());
	}
	replaceRows(params, rows) {
		const { entry, source, model, now, vectorReady } = params;
		this.clear(entry.path, source);
		let writeChunk;
		let writeVector;
		let hasEmbeddings = false;
		for (const { chunk, embedding } of rows) {
			hasEmbeddings ||= embedding.length > 0;
			const id = hashText(`${source}:${entry.path}:${chunk.startLine}:${chunk.endLine}:${chunk.hash}:${model}`);
			writeChunk ??= createMemoryChunkWriter(this.database, {
				path: entry.path,
				source,
				model,
				now
			});
			writeChunk(id, chunk, embedding);
			if (vectorReady && embedding.length > 0) {
				writeVector ??= createMemoryVectorWriter(this.database, MEMORY_INDEX_VECTOR_TABLE);
				writeVector(id, embedding);
			}
		}
		const db = getNodeSqliteKysely(this.database);
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
	clear(pathname, source) {
		if (memoryTableExists(this.database, "memory_index_chunks_vec")) {
			if (!this.state.vector.enabled || this.state.vector.available !== true) markMemoryVectorRebuildRequired(this.database);
			else try {
				runSqliteImmediateTransactionSync(this.database, () => {
					const rows = executeSqliteQuerySync(this.database, getNodeSqliteKysely(this.database).selectFrom("memory_index_chunks").select("id").where("path", "=", pathname).where("source", "=", source).limit(33)).rows;
					if (rows.length > MAX_VECTOR_POINT_DELETES) {
						this.database.prepare(`DELETE FROM ${MEMORY_INDEX_VECTOR_TABLE} WHERE id IN (SELECT id FROM memory_index_chunks WHERE path = ? AND source = ?)`).run(pathname, source);
						return;
					}
					const removeVector = this.database.prepare(`DELETE FROM ${MEMORY_INDEX_VECTOR_TABLE} WHERE id = ?`);
					for (const { id } of rows) removeVector.run(id);
				});
			} catch {
				markMemoryVectorRebuildRequired(this.database);
			}
		}
		executeSqliteQuerySync(this.database, getNodeSqliteKysely(this.database).deleteFrom("memory_index_chunks").where("path", "=", pathname).where("source", "=", source));
	}
};
//#endregion
export { readMemorySourceHash as n, MemorySourceIndexKernel as t };
