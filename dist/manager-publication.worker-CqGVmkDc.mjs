import { i as setSqliteBusyTimeout } from "./sqlite-busy-timeout-COlIRjFZ.mjs";
import { E as readSqliteDatabaseScopedWriteToken, U as withSqliteDatabaseWriteScope, w as readSqliteDatabasePendingScopedWriteToken } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { i as getAdmittedSqliteSchemaFacts, t as admitSqliteSchema } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { a as resolveExistingSqliteFileUri, l as supportsNodeSqliteExtensionLoading, r as openNodeSqliteDatabase } from "./node-sqlite-CYaq-2Hb.mjs";
import { i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { a as runSqliteImmediateTransactionSync, c as runSqliteSingleStatementSync, t as assertTransactionUsable } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { f as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { a as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { d as MEMORY_INDEX_VECTOR_TABLE, r as stageMemoryIndexSchemaExtension, t as ensureMemoryIndexSchema } from "./memory-schema-DY2eOY6N.mjs";
import { n as loadSqliteVecExtensionFromPath, t as loadSqliteVecExtension } from "./sqlite-vec-DjjFDiM4.mjs";
import { i as stopMemorySqliteWalMaintenance, n as configureMemorySqliteWalMaintenance, t as closeMemorySqliteWalMaintenance } from "./engine-storage-DAQECy5K.mjs";
import "./memory-core-host-engine-storage-wV2XR0Rc.mjs";
import "./sqlite-runtime-COh9hQA9.mjs";
import { t as stageOpenClawAgentDatabaseSchemaExtension } from "./sqlite-worker-runtime-Da3qtgYL.mjs";
import { n as hasMemorySessionTombstone } from "./memory-session-tombstones-CXVQjYXY.mjs";
import { a as MEMORY_INDEX_META_KEY, d as refreshMemorySessionSourceState, h as countMemoryEmbeddingCache, o as readMemoryDatabaseFacts, p as clearMemoryEmbeddingCacheIdentities, t as MemorySourceIndexKernel, v as pruneMemoryEmbeddingCache, y as upsertMemoryEmbeddingCache } from "./manager-source-index-kernel-DMTrRWNm.mjs";
import "./memory-core-host-engine-schema-9m2yhquC.mjs";
import { t as readMemoryIndex } from "./manager-index-read-CF3b7_Bh.mjs";
import { n as publishMemoryDatabaseTables } from "./manager-db-kernel-WGk4tT1_.mjs";
import { n as MEMORY_INDEX_WRITE_SCOPE, t as MEMORY_EMBEDDING_CACHE_WRITE_SCOPE } from "./manager-publication-task-B1g1hKrX.mjs";
import { n as readMemoryConnectionPragmas, r as readMemoryShadowIdentity, t as assertMemoryShadowIdentity } from "./manager-shadow-task-DKSy_h58.mjs";
//#region extensions/memory-core/src/memory/manager-publication.worker.ts
const agentConnectionPragmas = /* @__PURE__ */ new WeakMap();
const loadedExtensions = /* @__PURE__ */ new WeakMap();
const embeddingCacheSizes = /* @__PURE__ */ new WeakMap();
function failure(error) {
	return {
		name: error instanceof Error ? error.name : "Error",
		message: error instanceof Error ? error.message : String(error),
		...error && typeof error === "object" && "code" in error && typeof error.code === "string" ? { code: error.code } : {},
		...error && typeof error === "object" && "errcode" in error && typeof error.errcode === "number" ? { errcode: error.errcode } : {}
	};
}
function createSqliteWorkerBackend(input, context) {
	return openShadowBackend(context.databasePath, input.allowExtension);
}
function openExistingSqliteWorkerBackend(input, context) {
	return openShadowBackend(context.databasePath, true, input);
}
async function openShadowBackend(databasePath, allowExtension, existing) {
	const db = openNodeSqliteDatabase(existing ? resolveExistingSqliteFileUri(databasePath) : databasePath, { allowExtension: allowExtension && !process.permission && supportsNodeSqliteExtensionLoading() });
	const close = async () => {
		await stopMemorySqliteWalMaintenance(db);
		try {
			closeMemorySqliteWalMaintenance(db);
		} finally {
			if (db.isOpen) db.close();
		}
	};
	try {
		configureMemorySqliteWalMaintenance(db, {
			busyTimeoutMs: 5e3,
			databasePath
		});
		return {
			...createPublicationBackend(existing ?? {
				fileIdentity: readMemoryShadowIdentity(databasePath),
				pragmas: readMemoryConnectionPragmas(db, "Invalid memory publication connection policy")
			}, databasePath, db, true, (stage) => requestSqliteWorkerOperationAdmission({
				stage,
				facts: void 0
			})),
			close
		};
	} catch (error) {
		await close();
		throw error;
	}
}
/** Agent publication borrows its executor connection; only private shadows open their own. */
function bindSqliteWorkerBackend(input, context) {
	const db = context.database;
	let pragmas = agentConnectionPragmas.get(db);
	if ("kind" in input && !pragmas) {
		pragmas = {
			busy_timeout: readConnectionPragma(db, "busy_timeout"),
			foreign_keys: readConnectionPragma(db, "foreign_keys")
		};
		agentConnectionPragmas.set(db, pragmas);
	}
	return createPublicationBackend("kind" in input ? {
		kind: "agent",
		pragmas
	} : input, context.databasePath, db, false, (stage) => context.admit(stage));
}
function readConnectionPragma(db, name) {
	const row = db.prepare(`PRAGMA ${name}`).get();
	const value = row?.[name] ?? row?.timeout;
	if (typeof value !== "number" || !Number.isSafeInteger(value)) throw new Error("Invalid memory publication connection policy");
	return value;
}
function createPublicationBackend(input, databasePath, db, ownsConnection, admit) {
	if (!("kind" in input)) assertMemoryShadowIdentity(databasePath, input.fileIdentity);
	let staged;
	const loadExtension = (extensionPath) => {
		if (extensionPath && extensionPath !== loadedExtensions.get(db)) {
			loadSqliteVecExtensionFromPath(db, extensionPath);
			loadedExtensions.set(db, extensionPath);
		}
	};
	for (const [name, value] of Object.entries(input.pragmas)) if (ownsConnection) {
		if (name === "busy_timeout") setSqliteBusyTimeout(db, value);
		else db.exec(`PRAGMA ${name} = ${value}`);
	}
	const discard = () => {
		staged = void 0;
	};
	const finish = (outcome) => {
		if (outcome.ok) discard();
		return outcome;
	};
	const transact = (run) => {
		let entered = false;
		let committed = false;
		let writeToken;
		let restoredBusyTimeout = false;
		const restoreBusyTimeout = () => {
			if (!restoredBusyTimeout) {
				setSqliteBusyTimeout(db, input.pragmas.busy_timeout);
				restoredBusyTimeout = true;
			}
		};
		try {
			setSqliteBusyTimeout(db, 0);
			return {
				ok: true,
				value: run({
					onBegin: () => {
						entered = true;
						restoreBusyTimeout();
						admit("transaction");
					},
					withCommit: (commit) => {
						admit("commit");
						writeToken = readSqliteDatabasePendingScopedWriteToken(db, MEMORY_INDEX_WRITE_SCOPE);
						commit();
						committed = true;
					}
				}),
				writeToken
			};
		} catch (error) {
			return {
				ok: false,
				error: failure(error),
				entered,
				committed
			};
		} finally {
			if (db.isOpen) restoreBusyTimeout();
		}
	};
	const write = (run, scopes = [MEMORY_INDEX_WRITE_SCOPE]) => transact((hooks) => runSqliteImmediateTransactionSync(db, () => {
		hooks.onBegin();
		return withSqliteDatabaseWriteScope(db, scopes, run);
	}, { withCommit: hooks.withCommit }));
	const writeSingleStatement = (statement) => {
		let statementStarted = false;
		let committed = false;
		try {
			admit("transaction");
			admit("commit");
			setSqliteBusyTimeout(db, 0);
			statementStarted = true;
			const value = withSqliteDatabaseWriteScope(db, [MEMORY_INDEX_WRITE_SCOPE], () => runSqliteSingleStatementSync(db, statement));
			committed = true;
			return {
				ok: true,
				value,
				writeToken: readSqliteDatabaseScopedWriteToken(db, MEMORY_INDEX_WRITE_SCOPE)
			};
		} catch (error) {
			const detail = failure(error);
			return {
				ok: false,
				error: detail,
				entered: !(statementStarted && !committed && detail.errcode !== void 0 && [5, 6].includes(detail.errcode & 255)),
				committed
			};
		} finally {
			if (statementStarted && db.isOpen) setSqliteBusyTimeout(db, input.pragmas.busy_timeout);
		}
	};
	const withFacts = (result) => result.ok ? {
		...result,
		facts: readMemoryDatabaseFacts(db)
	} : result;
	const cacheSize = () => {
		const token = readSqliteDatabaseScopedWriteToken(db, MEMORY_EMBEDDING_CACHE_WRITE_SCOPE);
		let retained = embeddingCacheSizes.get(db);
		if (!retained || retained.token !== token) {
			retained = {
				size: countMemoryEmbeddingCache(db),
				token
			};
			embeddingCacheSizes.set(db, retained);
		}
		return retained.size;
	};
	const writeCache = (run) => {
		const size = cacheSize();
		const result = write(() => run(size), [MEMORY_EMBEDDING_CACHE_WRITE_SCOPE]);
		if (!result.ok) return result;
		embeddingCacheSizes.set(db, {
			size: result.value,
			token: readSqliteDatabaseScopedWriteToken(db, MEMORY_EMBEDDING_CACHE_WRITE_SCOPE)
		});
		return {
			...result,
			value: true
		};
	};
	const writeMeta = (value) => {
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("memory_index_meta").values({
			key: MEMORY_INDEX_META_KEY,
			value
		}).onConflict((conflict) => conflict.column("key").doUpdateSet({ value })));
	};
	return {
		async prepare(command) {
			if (command.type !== "vector.prepare") return;
			const extensionPath = command.input.state.extensionPath;
			const loadedPath = loadedExtensions.get(db);
			if (loadedPath && (!extensionPath || extensionPath === loadedPath)) return;
			const loaded = await loadSqliteVecExtension({
				db,
				extensionPath
			});
			if (!loaded.ok || !loaded.extensionPath) throw new Error(loaded.error ?? "unknown sqlite-vec load error");
			loadedExtensions.set(db, loaded.extensionPath);
		},
		assertSettled() {
			assertTransactionUsable(db);
			if (!db.isOpen || db.isTransaction) throw new Error("Memory publication left an unsettled native connection");
		},
		execute(command) {
			if (command.type === "connection.inspect") return "kind" in input ? {
				fileIdentity: readMemoryShadowIdentity(databasePath),
				pragmas: readMemoryConnectionPragmas(db, "Invalid memory publication connection policy")
			} : input;
			if (command.type === "index.facts" || command.type === "source.state" || command.type === "source.hash" || command.type === "source.chunks" || command.type === "cache.read" || command.type === "session.current") return readMemoryIndex(db, command).value;
			if (command.type === "schema.admit") {
				db.exec("PRAGMA foreign_keys = OFF");
				try {
					const result = write(() => ensureMemoryIndexSchema({
						...command.input,
						db
					}));
					if (result.ok) admitSqliteSchema(db);
					const published = withFacts(result);
					return published.ok && "kind" in input ? {
						...published,
						value: {
							...published.value,
							admission: {
								hasIndex: true,
								ftsAvailable: published.value.ftsAvailable,
								schemaVersion: getAdmittedSqliteSchemaFacts(db)?.userVersion,
								identity: readOpenClawAgentDatabaseIdentity({ db }),
								facts: published.facts
							}
						}
					} : published;
				} finally {
					if (db.isOpen) db.exec(`PRAGMA foreign_keys = ${input.pragmas.foreign_keys}`);
				}
			}
			if (command.type === "index.writeMetadata") {
				const serialized = JSON.stringify(command.input);
				return withFacts(writeSingleStatement(() => writeMeta(serialized)));
			}
			if (command.type === "source.refresh") return withFacts(writeSingleStatement(() => refreshMemorySessionSourceState(db, command.input)));
			if (command.type === "stage.start" || command.type === "cache.stage.start") {
				staged = command.type === "stage.start" ? {
					...command.input,
					kind: "source",
					fragments: []
				} : {
					...command.input,
					kind: "cache",
					fragments: []
				};
				return;
			}
			if (command.type === "stage.discard") {
				discard();
				return;
			}
			if (command.type === "stage.append") {
				if (!staged) throw new Error("Memory publication input was not started");
				staged.fragments.push(...command.input.fragments);
				return;
			}
			if (command.type === "cache.prune") {
				if (!command.input.recount && cacheSize() <= command.input.maxEntries) return {
					ok: true,
					value: false
				};
				let exceedsCap = false;
				const result = writeCache((retainedSize) => {
					const size = command.input.recount ? countMemoryEmbeddingCache(db) : retainedSize;
					exceedsCap = size > command.input.maxEntries;
					return exceedsCap ? pruneMemoryEmbeddingCache(db, size, command.input.maxEntries) : size;
				});
				return result.ok ? {
					...result,
					value: exceedsCap
				} : result;
			}
			if (command.type === "cache.clear") return writeCache((size) => size - clearMemoryEmbeddingCacheIdentities(db, command.input.identities));
			if (command.type === "cache.write" || command.type === "cache.write.inline") {
				let header;
				let readEntries;
				if (command.type === "cache.write.inline") {
					header = command.input.header;
					const entries = command.input.entries;
					readEntries = () => entries;
				} else {
					if (staged?.kind !== "cache") throw new Error("Memory cache input was not started");
					header = staged.header;
					const fragments = staged.fragments;
					readEntries = () => readPublicationRows(fragments);
				}
				const outcome = writeCache((size) => {
					const eligible = /* @__PURE__ */ new Map();
					function* entries() {
						for (const entry of readEntries()) {
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
					return upsertMemoryEmbeddingCache({
						...header,
						db,
						cacheSize: size,
						entries
					});
				});
				return command.type === "cache.write" ? finish(outcome) : outcome;
			}
			if (command.type === "vector.prepare") {
				const loadedPath = loadedExtensions.get(db);
				if (!loadedPath) throw new Error("Memory vector extension was not prepared");
				if (!tableExists(db, "chunks_vec")) return {
					ok: true,
					value: {
						extensionPath: loadedPath,
						retiredLegacy: false
					}
				};
				return withFacts(write(() => {
					stageMemoryIndexSchemaExtension(db);
					stageOpenClawAgentDatabaseSchemaExtension(db);
					db.exec("DROP TABLE IF EXISTS chunks_vec");
					return {
						extensionPath: loadedPath,
						retiredLegacy: true
					};
				}));
			}
			if (command.type === "vector.ensure") {
				const { dimensions } = command.input;
				if (!Number.isSafeInteger(dimensions) || dimensions <= 0) throw new Error("Memory vector dimensions must be a positive integer");
				const { meta, hasIndexedChunks } = readMemoryDatabaseFacts(db);
				if ((meta ? meta.vectorDims : command.input.currentDimensions) === dimensions && tableExists(db, "memory_index_chunks_vec")) return {
					ok: true,
					value: void 0
				};
				loadExtension(command.input.state.extensionPath);
				return withFacts(write(() => {
					stageMemoryIndexSchemaExtension(db);
					stageOpenClawAgentDatabaseSchemaExtension(db);
					db.exec(`DROP TABLE IF EXISTS ${MEMORY_INDEX_VECTOR_TABLE}`);
					db.exec(`CREATE VIRTUAL TABLE ${MEMORY_INDEX_VECTOR_TABLE} USING vec0(\n  id TEXT PRIMARY KEY,\n  embedding FLOAT[${dimensions}]\n)`);
					if (meta && !meta.vectorDims && !hasIndexedChunks) writeMeta(JSON.stringify({
						...meta,
						vectorDims: dimensions
					}));
				}));
			}
			loadExtension(command.input.state.extensionPath);
			if (command.type === "database.publish") {
				const publication = command.input;
				return withFacts(transact((hooks) => {
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
				}));
			}
			if (command.type === "source.delete") return withFacts(write(() => new MemorySourceIndexKernel(db, command.input.state).deleteIfCurrent(command.input)));
			if (command.type === "source.replace.group") {
				const outcome = write(() => {
					const kernel = new MemorySourceIndexKernel(db, command.input.state);
					for (const { header, fragments } of command.input.sources) {
						if (header.source === "sessions" && hasMemorySessionTombstone(db, header.agentId, header.sessionId)) throw new Error("A session was forgotten while memory indexing was running; retry the memory index.");
						kernel.replaceRows(header, readPublicationRows(fragments));
					}
					return true;
				});
				return outcome.ok ? {
					...outcome,
					facts: readMemoryDatabaseFacts(db, command.input.state.hasVectorTable)
				} : outcome;
			}
			let header;
			let rows;
			if (command.type === "source.replace.inline") {
				header = command.input.header;
				rows = readPublicationRows(command.input.fragments);
			} else {
				if (staged?.kind !== "source") throw new Error("Memory publication input was not started");
				header = staged.header;
				rows = readPublicationRows(staged.fragments);
			}
			let facts;
			const outcome = write(() => {
				if (header.source === "sessions" && hasMemorySessionTombstone(db, header.agentId, header.sessionId)) throw new Error("A session was forgotten while memory indexing was running; retry the memory index.");
				new MemorySourceIndexKernel(db, command.input.state).replaceRows(header, rows);
				facts = readMemoryDatabaseFacts(db, command.input.state.hasVectorTable);
				return true;
			});
			const published = outcome.ok ? {
				...outcome,
				facts
			} : outcome;
			return command.type === "source.replace.inline" ? published : finish(published);
		},
		close() {
			discard();
		}
	};
}
function* readPublicationRows(fragments) {
	const parse = (parts) => JSON.parse(parts.join(""));
	let parts = [];
	for (const fragment of fragments) {
		parts.push(fragment.json);
		if (fragment.last) {
			yield parse(parts);
			parts = [];
		}
	}
	if (parts.length) yield parse(parts);
}
//#endregion
export { createSqliteWorkerBackend as n, openExistingSqliteWorkerBackend as r, bindSqliteWorkerBackend as t };
