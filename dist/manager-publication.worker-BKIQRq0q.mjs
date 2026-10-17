import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync, t as compileSqliteQueryBindings } from "./kysely-sync-K7ftY-g4.mjs";
import { r as resolveExistingSqliteFileUri, s as supportsNodeSqliteExtensionLoading, t as openNodeSqliteDatabase } from "./node-sqlite-XIcwmOrl.mjs";
import { a as runSqliteImmediateTransactionSync, t as assertTransactionUsable } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { u as MEMORY_INDEX_VECTOR_TABLE } from "./memory-schema-BA04oCjG.mjs";
import { r as encodeMemoryEmbedding } from "./embedding-vector-DA_9H0FL.mjs";
import { i as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { n as loadSqliteVecExtensionFromPath } from "./sqlite-vec-BcbJNyja.mjs";
import { t as vectorToBlob } from "./vector-blob-T_j5xTNO.mjs";
import { t as hashText } from "./hash-BOTtT1fO.mjs";
import "./memory-core-host-engine-schema-C2UMfTcl.mjs";
import { n as markMemoryVectorRebuildRequired, r as memoryTableExists } from "./manager-vector-rebuild-state-DWrs_Mbx.mjs";
import "./memory-core-host-engine-indexing-JxQYGRDs.mjs";
import "./sqlite-worker-runtime-BFi6Nryt.mjs";
import { n as hasMemorySessionTombstone } from "./memory-session-tombstones-Boi0AhzJ.mjs";
import { n as publishMemoryDatabaseTables, r as readMemoryDatabaseRevision } from "./manager-db-kernel-P1lEjy52.mjs";
import { a as countMemoryEmbeddingCache, c as pruneMemoryEmbeddingCache, l as upsertMemoryEmbeddingCache, r as clearMemoryEmbeddingCacheIdentities, s as loadMemoryEmbeddingCache, t as assertMemoryShadowIdentity } from "./manager-shadow-task-BgV0hfBk.mjs";
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
//#region extensions/memory-core/src/memory/manager-publication.worker.ts
function failure(error) {
	return {
		name: error instanceof Error ? error.name : "Error",
		message: error instanceof Error ? error.message : String(error),
		...error && typeof error === "object" && "code" in error && typeof error.code === "string" ? { code: error.code } : {},
		...error && typeof error === "object" && "errcode" in error && typeof error.errcode === "number" ? { errcode: error.errcode } : {}
	};
}
function openExistingSqliteWorkerBackend(input, context) {
	const assertPath = () => assertMemoryShadowIdentity(context.databasePath, input.fileIdentity);
	assertPath();
	const db = openNodeSqliteDatabase(resolveExistingSqliteFileUri(context.databasePath), { allowExtension: !process.permission && supportsNodeSqliteExtensionLoading() });
	return createPublicationBackend(input, context.databasePath, db, true, (stage) => requestSqliteWorkerOperationAdmission({
		stage,
		facts: void 0
	}));
}
/** Agent publication borrows its executor connection; only private shadows open their own. */
function bindSqliteWorkerBackend(input, context) {
	return createPublicationBackend(input, context.databasePath, context.database, false, (stage) => context.admit(stage));
}
function createPublicationBackend(input, databasePath, db, ownsConnection, admit) {
	const assertPath = () => assertMemoryShadowIdentity(databasePath, input.fileIdentity);
	let staged;
	let loadedExtension;
	try {
		assertPath();
		for (const [name, value] of Object.entries(input.pragmas)) {
			if (!Number.isSafeInteger(value)) throw new Error("Invalid memory publication connection policy");
			if (ownsConnection) db.exec(`PRAGMA ${name} = ${value}`);
			else {
				const row = db.prepare(`PRAGMA ${name}`).get();
				if (!row || Number(Object.values(row)[0]) !== value) throw new Error(`Memory publication differs from its canonical connection policy: ${name}`);
			}
		}
		if (ownsConnection) db.exec("PRAGMA temp_store = FILE");
		db.exec("CREATE TEMP TABLE memory_publication_input (row INTEGER NOT NULL, part INTEGER NOT NULL, json TEXT NOT NULL, PRIMARY KEY (row, part)) WITHOUT ROWID");
		const insert = db.prepare("INSERT INTO temp.memory_publication_input (row, part, json) VALUES (?, ?, ?)");
		const discard = () => {
			db.exec("DELETE FROM temp.memory_publication_input");
			staged = void 0;
		};
		const finish = (outcome) => {
			if (outcome.ok) try {
				discard();
			} catch (error) {
				return {
					ok: false,
					error: failure(error),
					entered: true,
					committed: true
				};
			}
			return outcome;
		};
		const transact = (run) => {
			let entered = false;
			let committed = false;
			try {
				assertPath();
				db.exec("PRAGMA busy_timeout = 0");
				return {
					ok: true,
					value: run({
						onBegin: () => {
							entered = true;
							db.exec(`PRAGMA busy_timeout = ${input.pragmas.busy_timeout}`);
							assertPath();
							admit("transaction");
						},
						withCommit: (commit) => {
							assertPath();
							admit("commit");
							commit();
							committed = true;
						}
					})
				};
			} catch (error) {
				return {
					ok: false,
					error: failure(error),
					entered,
					committed
				};
			} finally {
				if (db.isOpen) db.exec(`PRAGMA busy_timeout = ${input.pragmas.busy_timeout}`);
			}
		};
		const write = (run) => transact((hooks) => runSqliteImmediateTransactionSync(db, () => {
			hooks.onBegin();
			return run();
		}, { withCommit: hooks.withCommit }));
		return {
			assertSettled() {
				assertTransactionUsable(db);
				if (!db.isOpen || db.isTransaction) throw new Error("Memory publication left an unsettled native connection");
			},
			execute(command) {
				assertPath();
				if (command.type === "source.hash") return readMemorySourceHash(db, command.input.source, command.input.path);
				if (command.type === "cache.read") return loadMemoryEmbeddingCache({
					...command.input,
					db
				});
				if (command.type === "stage.start" || command.type === "cache.stage.start") {
					if (staged) throw new Error("Memory publication input already belongs to another operation");
					staged = command.type === "stage.start" ? {
						...command.input,
						kind: "source",
						row: 0,
						part: 0
					} : {
						...command.input,
						kind: "cache",
						row: 0,
						part: 0
					};
					return;
				}
				if (command.type === "stage.discard") {
					if (staged?.operation === command.input.operation) discard();
					return;
				}
				if (command.type === "stage.append") {
					if (!staged || staged.operation !== command.input.operation) throw new Error("Memory publication input owner changed");
					for (const fragment of command.input.fragments) {
						if (fragment.row !== staged.row || fragment.part !== staged.part || staged.row >= staged.rows) throw new Error("Memory publication input is incomplete or out of order");
						insert.run(fragment.row, fragment.part, fragment.json);
						if (fragment.last) {
							staged.row++;
							staged.part = 0;
						} else staged.part++;
					}
					return;
				}
				if (command.type === "cache.prune") {
					if (countMemoryEmbeddingCache(db) <= command.input.maxEntries) return {
						ok: true,
						value: false
					};
					return write(() => {
						pruneMemoryEmbeddingCache(db, command.input.maxEntries);
						return true;
					});
				}
				if (command.type === "cache.clear") return write(() => {
					if (readMemoryDatabaseRevision(db) !== command.input.expectedRevision) return false;
					clearMemoryEmbeddingCacheIdentities(db, command.input.identities);
					return true;
				});
				if (command.type === "cache.write") {
					if (!staged || staged.kind !== "cache" || staged.operation !== command.input.operation || staged.row !== staged.rows || staged.part !== 0) throw new Error("Memory cache input was not sealed");
					const header = staged.header;
					return finish(write(() => {
						if (readMemoryDatabaseRevision(db) !== command.input.expectedRevision) return false;
						const eligible = /* @__PURE__ */ new Map();
						function* entries() {
							for (const json of readStagedJson(db)) {
								const entry = JSON.parse(json);
								if (entry.sessionId) {
									let current = eligible.get(entry.sessionId);
									if (current === void 0) {
										current = !hasMemorySessionTombstone(db, header.agentId, entry.sessionId);
										eligible.set(entry.sessionId, current);
									}
									if (!current) continue;
								}
								yield entry;
							}
						}
						upsertMemoryEmbeddingCache({
							...header,
							db,
							enabled: true,
							entries
						});
						return true;
					}));
				}
				const extensionPath = command.input.state.extensionPath;
				if (extensionPath && extensionPath !== loadedExtension) {
					loadSqliteVecExtensionFromPath(db, extensionPath);
					assertPath();
					loadedExtension = extensionPath;
				}
				if (command.type === "database.publish") {
					const publication = command.input;
					return transact((hooks) => {
						assertMemoryShadowIdentity(publication.sourcePath, publication.sourceIdentity);
						publishMemoryDatabaseTables({
							...publication,
							targetDb: db,
							onBegin: () => {
								hooks.onBegin();
								assertMemoryShadowIdentity(publication.sourcePath, publication.sourceIdentity);
							},
							withCommit: hooks.withCommit
						});
					});
				}
				if (command.type === "source.delete") return write(() => new MemorySourceIndexKernel(db, command.input.state).deleteIfCurrent(command.input));
				if (!staged || staged.kind !== "source" || staged.operation !== command.input.operation || staged.row !== staged.rows || staged.part !== 0) throw new Error("Memory publication input was not sealed");
				const header = staged.header;
				const outcome = write(() => {
					if (header.source === "sessions" && hasMemorySessionTombstone(db, header.agentId, header.sessionId)) throw new Error("A session was forgotten while memory indexing was running; retry the memory index.");
					const beforeRevision = readMemoryDatabaseRevision(db);
					new MemorySourceIndexKernel(db, command.input.state).replaceRows(header, readStagedRows(db));
					return {
						beforeRevision,
						databaseRevision: readMemoryDatabaseRevision(db)
					};
				});
				return finish(outcome);
			},
			close() {
				if (ownsConnection) db.close();
				else db.exec("DROP TABLE temp.memory_publication_input");
			}
		};
	} catch (error) {
		if (ownsConnection) db.close();
		throw error;
	}
}
function* readStagedRows(db) {
	for (const json of readStagedJson(db)) yield JSON.parse(json);
}
function* readStagedJson(db) {
	let parts = [];
	let row = 0;
	for (const fragment of db.prepare("SELECT row, json FROM temp.memory_publication_input ORDER BY row, part").iterate()) {
		if (fragment.row !== row) {
			yield parts.join("");
			parts = [];
			row = Number(fragment.row);
		}
		parts.push(String(fragment.json));
	}
	if (parts.length) yield parts.join("");
}
//#endregion
export { openExistingSqliteWorkerBackend as n, bindSqliteWorkerBackend as t };
