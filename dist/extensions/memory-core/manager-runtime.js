import { F as resolveTimerTimeoutMs, n as MAX_TIMER_TIMEOUT_MS } from "../../number-coercion-CLj0HTDM.mjs";
import { c as readErrorName, u as toErrorObject } from "../../error-coercion-C787aVxk.mjs";
import { i as resolveGlobalSingleton } from "../../global-singleton-Dc_stLtU.mjs";
import { a as asOptionalRecord } from "../../record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "../../string-coerce-CIXf7egm.mjs";
import { b as uniqueValues } from "../../string-normalization-_gRhJUDw.mjs";
import { o as resolveUserPath } from "../../home-dir-BKwhAL2c.mjs";
import { s as sleepWithAbort } from "../../src-D4OikzaT.mjs";
import { n as normalizeAgentId } from "../../agent-id-GA8mwdTG.mjs";
import { a as resolveAgentDir, l as resolveAgentWorkspaceDir, r as resolveAgentConfig } from "../../agent-scope-config-IQKOEtZ4.mjs";
import { E as resolveStateDir } from "../../paths-DehQwyE0.mjs";
import { _ as redactSensitiveText } from "../../redact-B5EGyLvV.mjs";
import { t as formatErrorMessage } from "../../errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "../../subsystem-DleLyu58.mjs";
import { a as iterateSqliteQuerySync, i as getNodeSqliteKysely, n as executeSqliteQuerySync, t as compileSqliteQueryBindings } from "../../kysely-sync-Bn6Qrpbz.mjs";
import { t as ensureSqliteLibrarySelected } from "../../bun-sqlite-library-GOquVAYK.mjs";
import { t as SQLITE_IDLE_HANDLE_TTL_MS } from "../../sqlite-handle-lifecycle-dWd9h3ii.mjs";
import { a as runSqliteImmediateTransaction, o as runSqliteImmediateTransactionSync } from "../../sqlite-transaction-DKSXLQhb.mjs";
import { r as resolveRuntimeWorkerUrl, t as resolveRuntimeWorkerArgv } from "../../runtime-worker-url-B4o9tqvO.mjs";
import { r as WorkerTaskError } from "../../worker-task-pool-cppt7dT0.mjs";
import { l as resolveSessionStorePathCore } from "../../paths-CcMbq5NY.mjs";
import { c as openSqliteWorkerStore, f as runSqliteWorkerStoreWrite } from "../../sqlite-worker-store-H5HXDD9v.mjs";
import { t as retryAsync } from "../../retry-C0DLN1oj.mjs";
import { o as MEMORY_EMBEDDING_CACHE_TABLE, t as ensureMemoryIndexSchema, u as MEMORY_INDEX_VECTOR_TABLE, v as MEMORY_INDEX_FTS_TABLE, y as MEMORY_INDEX_PATHS_FTS_TABLE } from "../../memory-schema-CkxujvZk.mjs";
import { n as decodeMemoryEmbedding, r as encodeMemoryEmbedding } from "../../embedding-vector-CGPWflQ5.mjs";
import { t as borrowOpenClawAgentDatabase } from "../../openclaw-agent-db-CaQAStOA.mjs";
import { r as onInternalSessionTranscriptUpdate } from "../../transcript-events-DukKauix.mjs";
import { a as runQueuedStoreWrite } from "../../openclaw-agent-write-admission-b9fAKekK.mjs";
import { k as MEMORY_SEARCH_DEADLINE_CONTROL } from "../../gateway-startup-plugin-config-XCCRUavD.mjs";
import { t as openOpenClawAgentSqliteWorkerStore } from "../../openclaw-agent-worker-store-DpwCZ9_q.mjs";
import { i as getAgentWorkspaceAccess } from "../../workspace-access-BNUXOhfF.mjs";
import { T as readTranscriptStatsBatchReadOnlySync } from "../../session-accessor.sqlite-read-DO8t28O6.mjs";
import { t as loadSqliteVecExtension } from "../../sqlite-vec-BskpG3v_.mjs";
import "../../memory-core-host-engine-knn-Dps9fjJT.mjs";
import { t as isVectorKnnRow } from "../../manager-search-knn-JQGcRJWQ.mjs";
import "../../error-runtime-Bf1fYXFh.mjs";
import "../../memory-core-host-engine-storage-BwYLAX9e.mjs";
import { l as runMemoryHostTasksWithConcurrency, n as buildMultimodalChunkForIndexing, s as normalizeExtraMemoryPathEntries, t as buildFileEntry } from "../../internal-CDL7w83q.mjs";
import { a as hasNonTextEmbeddingParts, o as estimateStructuredEmbeddingInputBytes, s as estimateUtf8Bytes } from "../../markdown-chunks-DYWd0D11.mjs";
import { n as isFileMissingError } from "../../fs-utils-BVDi6fm8.mjs";
import { t as hashText } from "../../hash-Di28TYtu.mjs";
import { r as classifyMemoryMultimodalPath } from "../../multimodal-BBZswXZ7.mjs";
import { n as retryTransientMemoryRead } from "../../read-retry-B-bw--uT.mjs";
import { t as INVALID_PROJECT_ANNOTATION_KEY } from "../../curated-annotations-DM9mz8Th.mjs";
import { t as resolveMemorySearchConfig } from "../../memory-search-D02aykS-.mjs";
import { r as listRegisteredMemoryEmbeddingProviderAdapters } from "../../memory-embedding-provider-runtime-Bxt3rk6q.mjs";
import { n as readMemoryFile } from "../../read-file-BDVpCgFA.mjs";
import { t as formatMemoryIndexRebuildGuidance } from "../../types-BH9UhQoF.mjs";
import { t as withOpenClawAgentDatabaseWrite } from "../../openclaw-agent-db-write-BhC-9Wsf.mjs";
import "../../sqlite-runtime-DhVTOiCi.mjs";
import "../../string-coerce-runtime-C_MKhRVt.mjs";
import { a as searchVector, c as readMemoryRecallData, d as loadMemorySourceFileState, f as resolveMemorySourceExistingHash, h as buildFtsQuery, o as MEMORY_INDEX_META_KEY, p as resolveMemorySourceFileEntries, s as readMemoryIndexMetadata, t as prepareExactPathMatcher, u as inspectMemorySourceState } from "../../manager-search-CO5lA9XG.mjs";
import { a as resolvePersistedMemoryVectorIndexState, i as requiresMemoryVectorRebuild, r as memoryTableExists } from "../../manager-vector-rebuild-state-anPytK-9.mjs";
import { n as resolveChunkProvenance } from "../../manager-index-preparation-BEdGU4Rv.mjs";
import { n as hasMemorySessionTombstone } from "../../memory-session-tombstones-Bu9FRJQf.mjs";
import { i as tableExists, r as readMemoryDatabaseRevision, t as MemoryIndexRevisionConflictError } from "../../manager-db-kernel-Dc2ThViV.mjs";
import { n as readMemoryShadowIdentity, t as assertMemoryShadowIdentity } from "../../manager-shadow-task-DGuJMed1.mjs";
import { t as memoryCpuProcessEntrypoints } from "../../manager-cpu-entrypoints-bJosRUx9.mjs";
import { t as vectorKnnProcessEntrypoint } from "../../manager-search-knn-entrypoint-D4BNu0VT.mjs";
import { k as listSessionTranscriptArchivesReadOnly } from "../../session-accessor.sqlite-entry-BTkJgNr-.mjs";
import { t as chunkItems } from "../../chunk-items-2QWieLm-.mjs";
import "../../runtime-env-BaPIl5PP.mjs";
import { t as expectDefined } from "../../expect-runtime-CJBt0Gq2.mjs";
import "../../number-runtime-CGwowceO.mjs";
import "../../retry-runtime-BLMk_EI2.mjs";
import "../../routing-JKvWkBDR.mjs";
import "../../agent-scope-runtime-OY7yRyJL.mjs";
import { t as extractKeywords } from "../../query-expansion-XZx6aBHC.mjs";
import "../../session-store-paths-C0kAfy_y.mjs";
import "../../text-chunking-zFGQSbFt.mjs";
import "../../security-runtime-HdPo6iAV.mjs";
import "../../agent-workspace-runtime-8l4U0NcT.mjs";
import "../../process-runtime-BF3dUvYO.mjs";
import { t as createPluginRuntimeStore } from "../../runtime-store-Mt8Rbmwz.mjs";
import "../../memory-core-host-embedding-registry-DxZMaoaS.mjs";
import { k as isEmbeddingBatchUnavailableError } from "../../memory-core-host-engine-embeddings-CRt6gGvK.mjs";
import "../../memory-core-host-engine-foundation-DgtNHcIh.mjs";
import { c as statSessionEntrySync, l as listSessionTranscriptCorpusEntriesForAgent, o as sessionPathForFile, s as sessionPathForSessionIdentity, t as buildSessionEntry } from "../../session-files-D7_8HS3h.mjs";
import "../../memory-core-host-engine-sessions-Dsaoiw9O.mjs";
import { t as runInMemoryBackgroundContext } from "../../background-context-tbmmWTrm.mjs";
import { n as getMemoryManagerLifecycle, r as prepareMemoryManagerReload, t as MemoryManagerReloadError } from "../../lifecycle-CtUK0V21.mjs";
import { _ as withMemoryWorkspacePreparation, g as withMemoryWorkspaceLock } from "../../dreaming-dreams-file-BZjYHlPi.mjs";
import { r as listMemorySessionTombstones } from "../../memory-entry-origins-DcbeLcSG.mjs";
import { r as tokenize, t as jaccardSimilarity } from "../../tokenize-VY3Ar2wB.mjs";
import { n as readSessionResetRecallCutoffMetadata } from "../../session-reset-recall-metadata-_gATHFyh.mjs";
import { a as resolveMemorySessionSyncPlan, c as openMemoryDatabaseAtPath, f as waitForMemoryReindexLock, i as resolveMemorySessionStartupState, l as openMemoryDatabaseReadOnlyAtPath, m as withMemoryIndexPublishGeneration, n as logMemoryVectorDegradedWrite, o as cleanupAgedMemoryReindexTempFiles, p as acquireMemoryIndexReadGeneration, r as isMemorySessionIndexable, s as closeMemoryDatabase, u as removeMemoryDatabaseFiles } from "../../manager-vector-warning-DCQEy5vX.mjs";
import { a as resolveEmbeddingProviderIndexIdentity, i as resolveEmbeddingProviderFallbackRemote, n as resolveEmbeddingProviderAdapterTransport, r as resolveEmbeddingProviderFallbackModel, t as createEmbeddingProvider } from "../../embeddings-cLHb4BN-.mjs";
import { i as runMemoryKeywordSearch, n as runMemoryCuratedCandidates, o as runMemoryRecallMetadata, r as runMemoryIndexState, s as runMemoryVectorFallback, t as prepareMemoryIndexInWorker } from "../../manager-cpu-worker-runtime-CIUJgoJh.mjs";
import { t as resolveMemoryPathClassification } from "../../memory-path-provenance-D123SMho.mjs";
import { t as MemoryFileWatcher } from "../../file-watcher-RUN-wa5I.mjs";
import fs from "node:fs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import fs$1 from "node:fs/promises";
import { spawn } from "node:child_process";
import { setTimeout as setTimeout$1 } from "node:timers/promises";
import { randomUUID } from "node:crypto";
//#region extensions/memory-core/src/memory/manager-publication-transfer.ts
const FRAGMENT_CHARS = 16384;
const BATCH_BYTES = 524288;
const NUMERIC_PART_ITEMS = 512;
function* jsonParts(value) {
	if (typeof value === "string") {
		yield "\"";
		for (let offset = 0; offset < value.length; offset += FRAGMENT_CHARS) yield JSON.stringify(value.slice(offset, offset + FRAGMENT_CHARS)).slice(1, -1);
		yield "\"";
	} else if (Array.isArray(value)) {
		yield "[";
		for (let index = 0; index < value.length; index++) {
			if (index) yield ",";
			const item = value[index] ?? null;
			if (typeof item === "number") {
				const limit = Math.min(value.length, index + NUMERIC_PART_ITEMS);
				let end = index + 1;
				while (end < limit && typeof value[end] === "number") end++;
				yield JSON.stringify(value.slice(index, end)).slice(1, -1);
				index = end - 1;
			} else yield* jsonParts(item);
		}
		yield "]";
	} else if (value && typeof value === "object") {
		yield "{";
		let first = true;
		for (const [key, item] of Object.entries(value)) {
			if (item === void 0) continue;
			if (!first) yield ",";
			first = false;
			yield JSON.stringify(key) + ":";
			yield* jsonParts(item);
		}
		yield "}";
	} else yield JSON.stringify(value) ?? "null";
}
function* rowFragments(value) {
	let pending = "";
	for (const part of jsonParts(value)) {
		pending += part;
		while (pending.length >= FRAGMENT_CHARS) {
			let end = FRAGMENT_CHARS;
			const last = pending.charCodeAt(end - 1);
			const next = pending.charCodeAt(end);
			if (last >= 55296 && last <= 56319 && next >= 56320 && next <= 57343) end--;
			yield pending.slice(0, end);
			pending = pending.slice(end);
		}
	}
	if (pending) yield pending;
}
function* memoryPublicationBatches(replacement) {
	let batch = [];
	let bytes = 0;
	for (const [row, chunk] of replacement.chunks.entries()) {
		const fragments = rowFragments({
			chunk: {
				startLine: chunk.startLine,
				endLine: chunk.endLine,
				text: chunk.text,
				hash: chunk.hash,
				importance: chunk.importance,
				triggers: chunk.triggers,
				projectKey: chunk.projectKey,
				...chunk.provenance ? { provenance: { ...chunk.provenance } } : {}
			},
			embedding: replacement.embeddings[row] ?? []
		});
		let current = fragments.next();
		let part = 0;
		while (!current.done) {
			const next = fragments.next();
			const cost = Math.max(Buffer.byteLength(current.value), current.value.length * 2) + 128;
			if (batch.length && bytes + cost > BATCH_BYTES) {
				yield batch;
				batch = [];
				bytes = 0;
			}
			batch.push({
				row,
				part: part++,
				json: current.value,
				last: next.done === true
			});
			bytes += cost;
			current = next;
		}
	}
	if (batch.length) yield batch;
}
//#endregion
//#region extensions/memory-core/src/memory/manager-database-context.ts
var MemoryIndexDatabase = class MemoryIndexDatabase {
	static openPublished(params) {
		const connection = params.readOnly ? openMemoryDatabaseReadOnlyAtPath(params.writeOptions.path, params.allowExtension, params.agentId) : borrowOpenClawAgentDatabase(params.writeOptions);
		if (params.maintenanceSource && connection.db !== params.maintenanceSource.db) {
			connection.release();
			throw new Error("Memory maintenance source connection changed");
		}
		return new MemoryIndexDatabase(connection.db, connection.release, params.readOnly, params.writeOptions);
	}
	static openShadow(filename, allowExtension) {
		let database;
		const db = openMemoryDatabaseAtPath(filename, allowExtension, (operation) => database ? database.runMaintenance(operation) : operation());
		try {
			database = new MemoryIndexDatabase(db);
			const readPragma = (name) => {
				const row = db.prepare(`PRAGMA ${name}`).get();
				const value = name === "busy_timeout" ? row?.busy_timeout ?? row?.timeout : row?.[name];
				if (typeof value !== "number" || !Number.isSafeInteger(value)) throw new Error("Invalid memory shadow connection policy");
				return value;
			};
			database.shadow = {
				path: filename,
				identity: readMemoryShadowIdentity(filename),
				pragmas: {
					busy_timeout: readPragma("busy_timeout"),
					synchronous: readPragma("synchronous"),
					foreign_keys: readPragma("foreign_keys"),
					wal_autocheckpoint: readPragma("wal_autocheckpoint"),
					journal_size_limit: readPragma("journal_size_limit"),
					checkpoint_fullfsync: readPragma("checkpoint_fullfsync")
				}
			};
			return database;
		} catch (error) {
			closeMemoryDatabase(db);
			throw error;
		}
	}
	static captureWriteOptions(agentId, databasePath, source) {
		const env = { ...source?.writeOptions?.env ?? process.env };
		env.OPENCLAW_STATE_DIR = resolveStateDir(env);
		return {
			agentId,
			path: source?.writeOptions?.path ?? resolveUserPath(databasePath),
			env
		};
	}
	constructor(db, release = () => closeMemoryDatabase(db), readOnly = false, writeOptions) {
		this.db = db;
		this.release = release;
		this.readOnly = readOnly;
		this.writeOptions = writeOptions;
		this.privateQueues = /* @__PURE__ */ new Map();
		this.nativeWriterActive = false;
		this.releaseInProgress = false;
		this.shadowReleased = false;
		this.vector = {
			enabled: false,
			available: null
		};
		this.fts = {
			enabled: false,
			available: false
		};
		this.vectorReady = null;
		this.lastMetaSerialized = null;
		this.vectorDegradedWriteWarningShown = false;
		this.closed = false;
	}
	get isShadow() {
		return this.shadow !== void 0;
	}
	assertShadowPath() {
		if (this.shadow) assertMemoryShadowIdentity(this.shadow.path, this.shadow.identity);
	}
	withPrivateAccess(operation, options = {}) {
		if (this.closed && !options.closingMaintenance) return Promise.reject(/* @__PURE__ */ new Error("Memory reindex database owner is closed"));
		return runQueuedStoreWrite({
			queues: this.privateQueues,
			storePath: this.shadow?.path ?? "memory-index",
			label: "private memory index access",
			reentrant: options.reentrant === true && !this.nativeWriterActive,
			fn: async () => {
				if (!this.db.isOpen) throw new Error("Memory reindex database owner is closed");
				this.assertShadowPath();
				if (options.nativeWriter) this.nativeWriterActive = true;
				try {
					return await operation();
				} finally {
					if (options.nativeWriter) this.nativeWriterActive = false;
				}
			}
		});
	}
	async drainPrivateAccess() {
		while (this.privateQueues.size > 0) await Promise.allSettled(Array.from(this.privateQueues.values()).flatMap((queue) => queue.drainPromise ? [queue.drainPromise] : []));
	}
	runMaintenance(operation) {
		let result = false;
		this.withPrivateAccess(() => {
			result = operation();
			return result;
		}, {
			reentrant: true,
			closingMaintenance: this.releaseInProgress
		}).catch(() => void 0);
		return result;
	}
	publicationState() {
		return {
			vector: {
				enabled: this.vector.enabled,
				available: this.vector.available
			},
			fts: {
				enabled: this.fts.enabled,
				available: this.fts.available
			},
			...this.vector.available && this.vector.extensionPath ? { extensionPath: this.vector.extensionPath } : {}
		};
	}
	getPublicationWorker() {
		this.publicationWorker ??= (async () => {
			const filename = this.shadow?.path ?? this.writeOptions?.path;
			if (!filename || this.readOnly || this.closed) throw new Error("Memory publication requires its live file owner");
			const readPragma = (name) => {
				const row = this.db.prepare("PRAGMA " + name).get();
				const value = row?.[name] ?? row?.timeout;
				if (typeof value !== "number" || !Number.isSafeInteger(value)) throw new Error("Invalid memory connection policy");
				return value;
			};
			const pragmas = this.shadow?.pragmas ?? {
				busy_timeout: readPragma("busy_timeout"),
				synchronous: readPragma("synchronous"),
				foreign_keys: readPragma("foreign_keys"),
				wal_autocheckpoint: readPragma("wal_autocheckpoint"),
				journal_size_limit: readPragma("journal_size_limit"),
				checkpoint_fullfsync: readPragma("checkpoint_fullfsync")
			};
			const worker = {
				moduleUrl: resolveRuntimeWorkerUrl(memoryCpuProcessEntrypoints.publication),
				input: {
					fileIdentity: this.shadow?.identity ?? readMemoryShadowIdentity(filename),
					pragmas
				}
			};
			if (this.writeOptions) return openOpenClawAgentSqliteWorkerStore(this.writeOptions, this.db, worker);
			const store = await openSqliteWorkerStore({
				...worker,
				databasePath: filename,
				existingOnly: true,
				admission: {
					identity: `file:${this.shadow.identity.device}:${this.shadow.identity.inode}`,
					assertCurrent: () => {
						if (this.closed || !this.db.isOpen) throw new Error("Memory shadow owner closed before Worker open");
						this.assertShadowPath();
					}
				}
			});
			if (!store) throw new Error("Memory shadow disappeared before publication Worker open");
			return {
				run: (operation, assertCurrent) => runSqliteWorkerStoreWrite(store, operation, assertCurrent, [filename]),
				close: () => store.close()
			};
		})().catch((error) => {
			this.publicationWorker = void 0;
			throw error;
		});
		return this.publicationWorker;
	}
	runPublication(operation, assertCurrent) {
		const run = async () => {
			assertCurrent();
			try {
				return await (await this.getPublicationWorker()).run(operation, assertCurrent);
			} catch (error) {
				const [cleanup] = await Promise.allSettled([this.closePublicationWorker()]);
				if (cleanup.status === "rejected") throw new AggregateError([error, cleanup.reason], `${String(error)}; Memory publication cleanup failed: ${String(cleanup.reason)}`, { cause: error });
				throw error;
			}
		};
		return this.isShadow ? this.withPrivateAccess(run, { nativeWriter: true }) : run();
	}
	async retryPublication(run, prepare = async () => true) {
		const policy = this.db.prepare("PRAGMA busy_timeout").get();
		const deadline = performance.now() + Number(policy?.timeout ?? policy?.busy_timeout ?? 5e3);
		while (await prepare()) {
			const result = await run();
			if (result.ok) return result.value;
			const code = result.error.errcode === void 0 ? void 0 : result.error.errcode & 255;
			if (result.entered || code !== 5 && code !== 6 || performance.now() >= deadline) throw Object.assign(result.error.name === "MemoryIndexRevisionConflictError" ? new MemoryIndexRevisionConflictError(result.error.message) : new Error(result.error.message), result.error, {
				entered: result.entered,
				committed: result.committed
			});
			await setTimeout$1(Math.min(25, Math.max(0, deadline - performance.now())));
		}
	}
	async replaceSource(replacement, assertCurrent, prepare) {
		return this.runPublication(async (scope) => {
			const operation = randomUUID();
			const { chunks, embeddings: _embeddings, ...header } = replacement;
			await scope.execute({
				type: "stage.start",
				input: {
					operation,
					header,
					rows: chunks.length
				}
			});
			let needsDiscard = true;
			for (const fragments of memoryPublicationBatches(replacement)) await scope.execute({
				type: "stage.append",
				input: {
					operation,
					fragments
				}
			});
			const result = await this.retryPublication(async () => {
				const outcome = await scope.execute({
					type: "source.replace",
					input: {
						operation,
						state: this.publicationState()
					}
				});
				if (outcome.ok || outcome.entered) needsDiscard = false;
				return outcome;
			}, prepare);
			if (this.isShadow) assertCurrent();
			if (needsDiscard) await scope.execute({
				type: "stage.discard",
				input: { operation }
			});
			return result;
		}, assertCurrent);
	}
	async deleteSource(input, assertCurrent) {
		return this.runPublication((scope) => this.retryPublication(() => scope.execute({
			type: "source.delete",
			input: {
				...input,
				state: this.publicationState()
			}
		})), assertCurrent);
	}
	async publishShadow(input, assertCurrent) {
		await this.runPublication((scope) => this.retryPublication(() => scope.execute({
			type: "database.publish",
			input: {
				...input,
				state: {
					...this.publicationState(),
					extensionPath: input.sourceHasVectors ? input.extensionPath : void 0
				}
			}
		})), assertCurrent);
	}
	async closePublicationWorker() {
		if (this.publicationWorker) {
			await (await this.publicationWorker).close();
			this.publicationWorker = void 0;
		}
	}
	closeShadow() {
		this.closed = true;
		this.shadowClose ??= (async () => {
			await this.drainPrivateAccess();
			await this.closePublicationWorker();
			this.releaseInProgress = true;
			try {
				this.release();
			} finally {
				this.releaseInProgress = false;
			}
			await this.drainPrivateAccess();
			this.shadowReleased = true;
		})().catch((error) => {
			this.shadowClose = void 0;
			throw error;
		});
		return this.shadowClose;
	}
};
const reindexDatabase = new AsyncLocalStorage();
var MemoryManagerDatabaseContext = class {
	constructor() {
		this.closed = false;
	}
	async withDatabaseWrite(write) {
		const database = this.database;
		const run = () => {
			if (this.closed || database.closed || !database.db.isOpen || this.database !== database) throw new Error("Memory database owner closed or changed before write admission");
			if (database.readOnly) throw new Error("Memory status managers are read-only");
			return write();
		};
		return database.writeOptions ? await withOpenClawAgentDatabaseWrite(database.writeOptions, run, database.db) : await database.withPrivateAccess(run, { reentrant: true });
	}
	async withDatabaseRead(read) {
		const database = this.database;
		return database.isShadow ? database.withPrivateAccess(read) : read();
	}
	get database() {
		const context = reindexDatabase.getStore();
		const shadow = context?.manager === this ? context.database : void 0;
		if (shadow?.closed) throw new Error("Memory reindex database context is closed");
		return shadow ?? this.publishedDatabase;
	}
	get db() {
		return this.database.db;
	}
	get vector() {
		return this.database.vector;
	}
	get fts() {
		return this.database.fts;
	}
	withPublishedDatabase(run) {
		return reindexDatabase.exit(run);
	}
	async withReindexDatabase(database, run) {
		try {
			const result = await reindexDatabase.run({
				manager: this,
				database
			}, run);
			await database.closeShadow();
			return result;
		} finally {
			try {
				await database.closeShadow();
			} catch {}
		}
	}
};
//#endregion
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
	if (!params.enabled || !provider || !params.providerKey || params.entries.length === 0) return;
	const seenHashes = /* @__PURE__ */ new Set();
	const uniqueEntries = [];
	for (let index = params.entries.length - 1; index >= 0; index -= 1) {
		const entry = params.entries[index];
		if (entry && !seenHashes.has(entry.hash)) {
			seenHashes.add(entry.hash);
			uniqueEntries.push(entry);
		}
	}
	uniqueEntries.reverse();
	const maxEntries = typeof params.maxEntries === "number" && Number.isFinite(params.maxEntries) && params.maxEntries > 0 ? Math.floor(params.maxEntries) : void 0;
	const retainedEntries = maxEntries === void 0 ? uniqueEntries : uniqueEntries.slice(-maxEntries);
	if (retainedEntries.length === 0) return;
	if (maxEntries !== void 0) reserveMemoryEmbeddingCacheCapacity({
		db: params.db,
		provider,
		providerKey: params.providerKey,
		hashes: retainedEntries.map((entry) => entry.hash),
		maxEntries
	});
	const now = params.now ?? Date.now();
	const upsert = prepareMemoryEmbeddingCacheUpsert(params.db);
	for (const entry of retainedEntries) {
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
	executeSqliteQuerySync(params.db, db.deleteFrom("memory_embedding_cache").where("rowid", "in", db.selectFrom("memory_embedding_cache").select("rowid").orderBy("updated_at", "desc").orderBy("rowid", "desc").limit(-1).offset(params.maxEntries - params.hashes.length)));
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
//#region extensions/memory-core/src/memory/manager-embedding-errors.ts
const MEMORY_EMBEDDING_OPERATION_ERROR_CODE = "MEMORY_EMBEDDING_OPERATION_FAILED";
function createMemoryEmbeddingOperationError(params) {
	const message = formatErrorMessage(params.cause);
	const error = new Error(message);
	error.code = MEMORY_EMBEDDING_OPERATION_ERROR_CODE;
	error.operation = params.operation;
	if (params.providerId) error.providerId = params.providerId;
	error.cause = params.cause;
	return error;
}
function isMemoryEmbeddingOperationError(err) {
	return err instanceof Error && err.code === MEMORY_EMBEDDING_OPERATION_ERROR_CODE;
}
//#endregion
//#region extensions/memory-core/src/memory/manager-embedding-policy.ts
function buildMemoryEmbeddingBatches(chunks, maxTokens) {
	const batches = [];
	let current = [];
	let currentTokens = 0;
	for (const chunk of chunks) {
		const estimate = chunk.embeddingInput ? estimateStructuredEmbeddingInputBytes(chunk.embeddingInput) : estimateUtf8Bytes(chunk.text);
		if (current.length > 0 && currentTokens + estimate > maxTokens) {
			batches.push(current);
			current = [];
			currentTokens = 0;
		}
		if (current.length === 0 && estimate > maxTokens) {
			batches.push([chunk]);
			continue;
		}
		current.push(chunk);
		currentTokens += estimate;
	}
	if (current.length > 0) batches.push(current);
	return batches;
}
const RATE_LIMITED_MEMORY_EMBEDDING_ERROR_RE = /(rate[_ ]limit|too many requests|\b429\b|resource has been exhausted|tokens per day)/i;
const RETRYABLE_MEMORY_EMBEDDING_SERVICE_ERROR_RE = /\b5\d\d\b|cloudflare/i;
const RETRYABLE_MEMORY_EMBEDDING_TRANSPORT_ERROR_RE = /(fetch failed|other side closed|ECONNRESET|ECONNREFUSED|ETIMEDOUT|EPIPE|UND_ERR_|socket hang up|socket terminated|network error|read ECONN|timed out|connection (?:reset|refused|aborted|timed out)|EHOSTUNREACH|ENETUNREACH|ECONNABORTED|EAI_AGAIN)/i;
const SPLITTABLE_MEMORY_EMBEDDING_BATCH_ERROR_RE = /(request_headers_too_large|request header fields too large|other side closed|ECONNRESET|EPIPE|UND_ERR_SOCKET|socket hang up|socket terminated|read ECONN|connection (?:reset|aborted)|\bembeddings (?:api input limit exceeded:\s*max\s+\d+\s*,\s*got\s+\d+|max input length is\s+\d+)\b|\bbatch size is invalid,?\s+it should not be larger than\s+\d+\b|\binput array max\s+\d+(?=\s*(?:["'}]|$)))/i;
const SHORT_MEMORY_EMBEDDING_RETRY_BUDGET = {
	attempts: 3,
	baseDelayMs: 500,
	maxDelayMs: 8e3
};
const MEMORY_EMBEDDING_RETRY_PROFILES = {
	index: {
		transient: SHORT_MEMORY_EMBEDDING_RETRY_BUDGET,
		rateLimit: {
			attempts: 5,
			baseDelayMs: 5e3,
			maxDelayMs: 6e4
		},
		maxTotalWaitMs: Number.POSITIVE_INFINITY
	},
	query: {
		transient: SHORT_MEMORY_EMBEDDING_RETRY_BUDGET,
		rateLimit: SHORT_MEMORY_EMBEDDING_RETRY_BUDGET,
		maxTotalWaitMs: 8e3
	}
};
function isSplittableMemoryEmbeddingBatchError(message) {
	return SPLITTABLE_MEMORY_EMBEDDING_BATCH_ERROR_RE.test(message);
}
function readMemoryEmbeddingRetryAfterMs(error) {
	const value = asOptionalRecord(error)?.retryAfterMs;
	return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : void 0;
}
function resolveMemoryEmbeddingRetryBudget(profile, error) {
	const fields = asOptionalRecord(error);
	const message = formatErrorMessage(error);
	const retryAfterMs = readMemoryEmbeddingRetryAfterMs(error);
	const status = [fields?.status, fields?.statusCode].find((value) => typeof value === "number" && Number.isInteger(value));
	if ([
		fields?.errorCode,
		fields?.code,
		fields?.errorType
	].some((value) => {
		const code = normalizeOptionalString(value)?.toLowerCase();
		return code === "quota_exceeded" || code === "insufficient_quota";
	}) && retryAfterMs === void 0) return;
	if (status === 429) return {
		...profile.rateLimit,
		retryAfterMs
	};
	if (status !== void 0) return status >= 500 && status <= 599 ? profile.transient : void 0;
	if (RETRYABLE_MEMORY_EMBEDDING_TRANSPORT_ERROR_RE.test(message)) return profile.transient;
	if (isSplittableMemoryEmbeddingBatchError(message)) return;
	if (RATE_LIMITED_MEMORY_EMBEDDING_ERROR_RE.test(message)) return {
		...profile.rateLimit,
		retryAfterMs
	};
	return RETRYABLE_MEMORY_EMBEDDING_SERVICE_ERROR_RE.test(message) ? profile.transient : void 0;
}
async function runMemoryEmbeddingRetryLoop(params) {
	const profile = MEMORY_EMBEDDING_RETRY_PROFILES[params.profile];
	let remainingWaitMs = profile.maxTotalWaitMs;
	return await retryAsync(params.run, {
		attempts: profile.rateLimit.attempts,
		minDelayMs: profile.transient.baseDelayMs,
		maxDelayMs: profile.rateLimit.maxDelayMs,
		retryAfterMaxDelayMs: profile.rateLimit.maxDelayMs,
		jitter: .2,
		shouldRetry: (err, attempt) => {
			if (params.signal?.aborted) return false;
			const retryBudget = resolveMemoryEmbeddingRetryBudget(profile, err);
			return retryBudget !== void 0 && attempt < retryBudget.attempts;
		},
		delayMs: ({ attempt, err }) => {
			const retryBudget = resolveMemoryEmbeddingRetryBudget(profile, err);
			return retryBudget ? Math.min(retryBudget.maxDelayMs, retryBudget.baseDelayMs * 2 ** (attempt - 1)) : 0;
		},
		retryAfterMs: (err) => resolveMemoryEmbeddingRetryBudget(profile, err)?.retryAfterMs,
		sleep: async (delayMs) => {
			const boundedDelayMs = Math.min(delayMs, remainingWaitMs);
			remainingWaitMs -= boundedDelayMs;
			await params.waitForRetry(boundedDelayMs);
		}
	});
}
async function runMemoryEmbeddingBatchRetryWithSplit(params) {
	let outputs;
	try {
		outputs = await runMemoryEmbeddingRetryLoop({
			profile: params.profile,
			run: async () => await params.run(params.items),
			waitForRetry: params.waitForRetry
		});
	} catch (err) {
		const message = formatErrorMessage(err);
		if (params.items.length <= 1 || !params.isSplittable(message)) throw err;
		const splitAt = Math.ceil(params.items.length / 2);
		params.onSplit?.({
			itemCount: params.items.length,
			splitAt,
			message
		});
		const left = await runMemoryEmbeddingBatchRetryWithSplit({
			...params,
			items: params.items.slice(0, splitAt)
		});
		const right = await runMemoryEmbeddingBatchRetryWithSplit({
			...params,
			items: params.items.slice(splitAt)
		});
		return [...left, ...right];
	}
	await params.onSuccess?.(params.items, outputs);
	return outputs;
}
function buildTextEmbeddingInputs(chunks) {
	return chunks.map((chunk) => chunk.embeddingInput ?? { text: chunk.text });
}
//#endregion
//#region extensions/memory-core/src/memory/manager-index-source.ts
async function readMemoryIndexSource({ absolutePath, workspaceDir, source, suppliedContent, memoryFiles }) {
	const remoteRead = source === "memory" && memoryFiles ? await retryTransientMemoryRead(() => memoryFiles.readForIndexing(absolutePath), `read workspace memory for indexing ${absolutePath}`).catch((error) => {
		if (!isFileMissingError(error)) throw error;
		return null;
	}) : void 0;
	if (remoteRead === null) return null;
	const pathClassification = await resolveMemoryPathClassification({
		absolutePath,
		source,
		workspaceDir,
		readSource: remoteRead
	});
	const content = remoteRead?.content ?? suppliedContent ?? await retryTransientMemoryRead(() => fs$1.readFile(absolutePath, "utf-8"), `read memory markdown for indexing ${absolutePath}`).catch((err) => {
		if (source !== "memory" || !isFileMissingError(err)) throw err;
		return null;
	});
	if (content === null) return null;
	return {
		content,
		pathClassification
	};
}
function resolveMemoryIndexProviderIdentities(params) {
	const provider = params.provider ?? {
		id: "none",
		model: "fts-only"
	};
	const candidates = [{
		model: provider.model,
		cacheKeyData: params.cacheKeyData ?? {
			provider: provider.id,
			model: provider.model
		}
	}, ...params.provider ? params.aliases ?? [] : []];
	const seen = /* @__PURE__ */ new Set();
	const identities = [];
	for (const [index, candidate] of candidates.entries()) {
		const providerKey = hashText(JSON.stringify(candidate.cacheKeyData));
		const key = `${candidate.model}\u0000${providerKey}`;
		if (index > 0 && !candidate.model || seen.has(key)) continue;
		seen.add(key);
		identities.push({
			provider: provider.id,
			model: candidate.model,
			providerKey
		});
	}
	return identities;
}
function resolveConfiguredSourcesForMeta(sources) {
	const normalized = Array.from(sources).filter((source) => source === "memory" || source === "sessions").toSorted((left, right) => left.localeCompare(right));
	return normalized.length > 0 ? normalized : ["memory"];
}
function normalizeMetaSources(meta) {
	if (!Array.isArray(meta.sources)) return ["memory"];
	const normalized = Array.from(new Set(meta.sources.filter((source) => source === "memory" || source === "sessions"))).toSorted((left, right) => left.localeCompare(right));
	return normalized.length > 0 ? normalized : ["memory"];
}
function configuredMetaSourcesDiffer(params) {
	const metaSources = normalizeMetaSources(params.meta);
	if (metaSources.length !== params.configuredSources.length) return true;
	return metaSources.some((source, index) => source !== params.configuredSources[index]);
}
function openClawIndexMismatch(code, reason, versionOrder) {
	return {
		status: "mismatched",
		reason,
		code,
		owner: "openclaw",
		versionOrder
	};
}
function configuredIndexMismatch(code, reason) {
	return {
		status: "mismatched",
		reason,
		code,
		owner: "configuration"
	};
}
function resolveConfiguredScopeHash(params) {
	const extraPaths = normalizeExtraMemoryPathEntries(params.workspaceDir, params.extraPaths).map((entry) => {
		const path = entry.path.replaceAll("\\", "/");
		return entry.pattern ? {
			path,
			pattern: entry.pattern
		} : path;
	}).toSorted((left, right) => JSON.stringify(left).localeCompare(JSON.stringify(right)));
	return hashText(JSON.stringify({
		extraPaths,
		multimodal: {
			enabled: params.multimodal.enabled,
			modalities: [...params.multimodal.modalities].toSorted(),
			maxFileBytes: params.multimodal.maxFileBytes
		}
	}));
}
function resolveConfigurationIndexIdentityState(params, meta) {
	const expectedModel = params.provider && params.provider.model === void 0 ? void 0 : params.provider?.model?.trim() || "fts-only";
	const matchingModelIdentities = [{
		model: expectedModel,
		providerKey: params.providerKey
	}, ...params.providerAliases ?? []].filter((identity) => identity.model === meta.model);
	if (expectedModel !== void 0 && matchingModelIdentities.length === 0) return configuredIndexMismatch("model", `index was built for model ${meta.model}, expected ${expectedModel}`);
	const expectedProvider = params.provider ? params.provider.id : "none";
	if (meta.provider !== expectedProvider) return configuredIndexMismatch("provider", `index was built for provider ${meta.provider}, expected ${expectedProvider}`);
	if (expectedModel !== void 0 && params.providerKeyKnown !== false && !matchingModelIdentities.some((identity) => identity.providerKey === meta.providerKey)) return configuredIndexMismatch("provider_settings", "index provider settings changed");
	const contentIdentity = resolveContentScopeIdentityState(params, meta);
	if (contentIdentity.status !== "valid") return contentIdentity;
	if (params.vectorReady && params.hasIndexedChunks !== false && !meta.vectorDims) return configuredIndexMismatch("vector_dims", "index vector dimensions are missing");
	return { status: "valid" };
}
function resolveContentScopeIdentityState(params, meta) {
	if (configuredMetaSourcesDiffer({
		meta,
		configuredSources: params.configuredSources
	})) return configuredIndexMismatch("sources", "index sources changed");
	if (meta.scopeHash !== params.configuredScopeHash) return configuredIndexMismatch("scope", "index scope changed");
	if (meta.chunkTokens !== params.chunkTokens || meta.chunkOverlap !== params.chunkOverlap) return configuredIndexMismatch("chunking", "index chunking changed");
	if ((meta.ftsTokenizer ?? "unicode61") !== params.ftsTokenizer) return configuredIndexMismatch("fts_tokenizer", "index FTS tokenizer changed");
	return { status: "valid" };
}
function resolveMemoryIndexIdentityState(params) {
	const { meta } = params;
	if (!meta) return {
		status: "missing",
		reason: "index metadata is missing",
		code: "metadata_missing",
		owner: "openclaw"
	};
	if ((meta.provenanceVersion ?? 0) > 1 || (meta.chunkingVersion ?? 0) > 5) return openClawIndexMismatch((meta.provenanceVersion ?? 0) > 1 ? "provenance_version" : "chunking_version", "the index was written by a newer OpenClaw version; upgrade OpenClaw or reindex explicitly", "newer");
	if ((meta.provenanceVersion ?? 0) < 1) return openClawIndexMismatch("provenance_version", "index provenance classifier changed", "older");
	if ((meta.chunkingVersion ?? 0) < 5) return {
		...openClawIndexMismatch("chunking_version", "index chunking implementation changed", "older"),
		...resolveContentScopeIdentityState(params, meta).status === "valid" ? { chunkingVersionOnly: true } : {}
	};
	return resolveConfigurationIndexIdentityState(params, meta);
}
//#endregion
//#region extensions/memory-core/src/memory/manager-provider-state.ts
function createPendingMemoryProviderLifecycle(requestedProvider) {
	return {
		mode: "pending",
		requestedProvider
	};
}
function createDegradedMemoryProviderLifecycle(params) {
	return {
		mode: "degraded",
		providerId: params.providerId,
		reason: params.reason,
		...params.code ? { code: params.code } : {}
	};
}
function resolveProviderLifecycle(result) {
	if (result.provider && result.fallbackFrom) return {
		mode: "fallback-active",
		providerId: result.provider.id,
		fallbackFrom: result.fallbackFrom,
		reason: result.fallbackReason ?? "fallback activated"
	};
	if (result.provider) return {
		mode: "active",
		providerId: result.provider.id
	};
	return {
		mode: "fts-only",
		reason: result.providerUnavailableReason ?? "No embedding provider available",
		attemptedProviderId: result.requestedProvider
	};
}
function resolveFallbackCurrentProviderId(params) {
	if (params.provider) return params.provider.id;
	if (params.lifecycle.mode === "degraded") return params.lifecycle.providerId;
	return null;
}
function resolveMemoryPrimaryProviderRequest(params) {
	return {
		provider: params.settings.provider,
		model: params.settings.model,
		remote: params.settings.remote,
		inputType: params.settings.inputType,
		queryInputType: params.settings.queryInputType,
		documentInputType: params.settings.documentInputType,
		outputDimensionality: params.settings.outputDimensionality,
		fallback: params.settings.fallback,
		local: params.settings.local
	};
}
function resolveMemoryProviderState(result) {
	return {
		provider: result.provider,
		fallbackFrom: result.fallbackFrom,
		fallbackReason: result.fallbackReason,
		providerUnavailableReason: result.providerUnavailableReason,
		providerRuntime: result.runtime,
		lifecycle: resolveProviderLifecycle(result)
	};
}
function applyMemoryFallbackProviderState(params) {
	return {
		...params.current,
		fallbackFrom: params.fallbackFrom,
		fallbackReason: params.reason,
		providerUnavailableReason: void 0,
		provider: params.result.provider,
		providerRuntime: params.result.runtime,
		lifecycle: params.result.provider ? {
			mode: "fallback-active",
			providerId: params.result.provider.id,
			fallbackFrom: params.fallbackFrom,
			reason: params.reason
		} : {
			mode: "fts-only",
			reason: params.reason,
			attemptedProviderId: params.fallbackFrom
		}
	};
}
function resolveMemoryFallbackProviderRequest(params) {
	const fallback = params.settings.fallback;
	if (!fallback || fallback === "none" || !params.currentProviderId || fallback === params.currentProviderId) return null;
	return {
		provider: fallback,
		model: resolveEmbeddingProviderFallbackModel(fallback, params.settings.model, params.cfg),
		remote: resolveEmbeddingProviderFallbackRemote(params.settings.remote),
		inputType: params.settings.inputType,
		queryInputType: params.settings.queryInputType,
		documentInputType: params.settings.documentInputType,
		outputDimensionality: params.settings.outputDimensionality,
		fallback: "none",
		local: params.settings.local
	};
}
//#endregion
//#region extensions/memory-core/src/memory/manager-session-reindex.ts
function shouldSyncSessionsForReindex(params) {
	if (!params.hasSessionSource) return false;
	if (params.sync?.sessions?.some((session) => session.sessionId.trim().length > 0)) return true;
	if (params.sync?.archiveFiles?.some((sessionFile) => sessionFile.trim().length > 0)) return true;
	if (params.sync?.force) return true;
	if (params.needsFullReindex) return true;
	if (params.sessionsFullRetryDirty) return true;
	const reason = params.sync?.reason;
	if (reason === "session-start" || reason === "watch") return false;
	return params.sessionsDirty;
}
//#endregion
//#region extensions/memory-core/src/memory/manager-sync-outcome.ts
var MemorySyncOutcomeLedger = class {
	constructor() {
		this.failureRevision = 0;
		this.active = false;
	}
	async track(operation, active = false) {
		const failureAtStart = this.latestFailure?.revision;
		if (active) this.active = true;
		try {
			const incompleteReason = await operation();
			if (incompleteReason) this.recordFailure(incompleteReason);
			else if (failureAtStart !== void 0 && this.latestFailure?.revision === failureAtStart) this.latestFailure = void 0;
		} catch (error) {
			this.recordFailure(error);
			throw error;
		} finally {
			if (active) this.active = false;
		}
	}
	recordActiveFailure(error) {
		if (this.active) this.recordFailure(error);
	}
	get lastError() {
		return this.latestFailure?.reason;
	}
	recordFailure(error) {
		this.latestFailure = {
			revision: ++this.failureRevision,
			reason: redactSensitiveText(formatErrorMessage(error), { mode: "tools" })
		};
	}
};
//#endregion
//#region extensions/memory-core/src/memory/source-filter.ts
function buildMemorySourceFilter(alias, sources) {
	if (sources.length === 0) return {
		sql: "",
		params: []
	};
	return {
		sql: ` AND ${alias ? `${alias}.source` : "source"} IN (${sources.map(() => "?").join(", ")})`,
		params: [...sources]
	};
}
//#endregion
//#region extensions/memory-core/src/memory/manager-sync-base.ts
const META_KEY = MEMORY_INDEX_META_KEY;
const VECTOR_TABLE$1 = MEMORY_INDEX_VECTOR_TABLE;
const LEGACY_VECTOR_TABLE = "chunks_vec";
const VECTOR_LOAD_TIMEOUT_MS = 3e4;
const log$10 = createSubsystemLogger("memory");
var MemoryManagerSyncBase = class extends MemoryManagerDatabaseContext {
	constructor(..._args) {
		super(..._args);
		this.memoryWatchUnavailable = false;
		this.closing = false;
		this.activeManagerOperations = 0;
		this.managerIdleWaiters = /* @__PURE__ */ new Set();
		this.provider = null;
		this.sources = /* @__PURE__ */ new Set();
		this.sourceInspections = /* @__PURE__ */ new Map();
		this.providerKey = null;
		this.sessionWatchTimer = null;
		this.sessionUnsubscribe = null;
		this.intervalTimer = null;
		this.dirty = false;
		this.syncOutcomes = new MemorySyncOutcomeLedger();
		this.memorySourceProvenanceRepairPending = false;
		this.memoryFullRetryDirty = false;
		this.sessionsDirty = false;
		this.sessionsFullRetryDirty = false;
		this.sessionsReconcileDirty = false;
		this.sessionsDirtyFiles = /* @__PURE__ */ new Set();
		this.sessionPendingFiles = /* @__PURE__ */ new Set();
		this.sessionPendingTargets = /* @__PURE__ */ new Map();
	}
	async withManagerOperation(run) {
		this.memoryFiles?.assertCurrent();
		if (this.closing || this.closed) throw new Error("Memory index manager is closed");
		this.activeManagerOperations += 1;
		try {
			const result = await this.withPublishedDatabase(run);
			this.memoryFiles?.assertCurrent();
			return result;
		} finally {
			this.activeManagerOperations -= 1;
			if (this.activeManagerOperations === 0) {
				const waiters = Array.from(this.managerIdleWaiters);
				this.managerIdleWaiters.clear();
				for (const resolve of waiters) resolve();
			}
		}
	}
	async indexFiles(items) {
		for (const item of items) await this.indexFile(item.entry, { source: item.source });
	}
	emptySourceSyncPlan() {
		return {
			indexItems: [],
			finalize: () => {}
		};
	}
	snapshotReindexRetryState() {
		return {
			dirty: this.dirty,
			memoryFullRetryDirty: this.memoryFullRetryDirty,
			sessionsDirty: this.sessionsDirty,
			sessionsFullRetryDirty: this.sessionsFullRetryDirty,
			sessionsReconcileDirty: this.sessionsReconcileDirty,
			sessionsDirtyFiles: new Set(this.sessionsDirtyFiles)
		};
	}
	takeReindexRetryStateForMaintenance() {
		const snapshot = this.snapshotReindexRetryState();
		this.clearMemoryRetryState();
		this.clearSessionRetryState();
		return snapshot;
	}
	adoptReindexRetryState(snapshot) {
		this.restoreReindexRetryState(snapshot);
	}
	restoreReindexRetryState(snapshot) {
		this.dirty = snapshot.dirty || this.dirty;
		this.memoryFullRetryDirty = snapshot.memoryFullRetryDirty || this.memoryFullRetryDirty;
		this.sessionsFullRetryDirty = snapshot.sessionsFullRetryDirty || this.sessionsFullRetryDirty;
		this.sessionsReconcileDirty = snapshot.sessionsReconcileDirty || this.sessionsReconcileDirty;
		this.sessionsDirtyFiles = /* @__PURE__ */ new Set([...snapshot.sessionsDirtyFiles, ...this.sessionsDirtyFiles]);
		this.sessionsDirty = snapshot.sessionsDirty || this.sessionsDirty || this.sessionsFullRetryDirty || this.sessionsReconcileDirty || this.sessionsDirtyFiles.size > 0;
	}
	markFailedFullReindexRetry(params) {
		if (params.memory) {
			this.dirty = true;
			this.memoryFullRetryDirty = true;
		}
		if (params.sessions) {
			this.sessionsDirty = true;
			this.sessionsFullRetryDirty = true;
		}
	}
	clearSessionRetryState() {
		this.sessionsDirty = false;
		this.sessionsFullRetryDirty = false;
		this.sessionsReconcileDirty = false;
		this.sessionsDirtyFiles.clear();
	}
	clearMemoryRetryState() {
		this.dirty = false;
		this.memoryFullRetryDirty = false;
	}
	refreshSessionDirtyFlag() {
		this.sessionsDirty = this.sessionsFullRetryDirty || this.sessionsReconcileDirty || this.sessionsDirtyFiles.size > 0;
	}
	shouldDeferSourceWideBatch() {
		return Boolean(this.batch.enabled && this.provider && this.providerRuntime?.batchEmbed && this.providerRuntime.sourceWideBatchEmbed === true);
	}
	advanceSyncProgress(progress, count = 1) {
		if (!progress) return;
		progress.completed += count;
		progress.report({
			completed: progress.completed,
			total: progress.total
		});
	}
	async indexQueuedFiles(items, progress, label) {
		if (items.length === 0) return;
		if (progress && label) progress.report({
			completed: progress.completed,
			total: progress.total,
			label
		});
		await this.indexFiles(items);
		for (const item of items) item.afterIndex?.();
		this.advanceSyncProgress(progress, items.length);
	}
	async executeSourceSyncPlans(plans, progress) {
		const indexItems = plans.flatMap((plan) => plan.indexItems);
		const sources = new Set(indexItems.map((item) => item.source));
		await this.indexQueuedFiles(indexItems, progress, sources.size > 1 ? "Indexing memory sources (batch)..." : void 0);
		for (const plan of plans) await plan.finalize();
	}
	async executeSourceWideSync(params) {
		const memoryPlan = params.shouldSyncMemory ? await this.syncMemoryFiles({
			needsFullReindex: params.needsFullReindex,
			progress: params.progress,
			deferIndex: true
		}) : this.emptySourceSyncPlan();
		if (params.shouldSyncSessions) {
			await this.syncArchiveFiles({
				needsFullReindex: params.needsFullSessionReindex ?? params.needsFullReindex,
				targetArchiveFiles: params.targetArchiveFiles,
				progress: params.progress,
				deferIndex: true,
				prefixIndexItems: memoryPlan.indexItems
			});
			await memoryPlan.finalize();
			return;
		}
		await this.executeSourceSyncPlans([memoryPlan], params.progress);
	}
	hasIndexedChunks() {
		return this.db.prepare(`SELECT 1 as found FROM memory_index_chunks LIMIT 1`).get() !== void 0;
	}
	hasSemanticChunks() {
		return this.db.prepare(`SELECT 1 as found FROM memory_index_chunks WHERE model != 'fts-only' LIMIT 1`).get()?.found === 1;
	}
	resolveConfiguredIndexIdentity() {
		if (this.settings.provider === "none") return;
		return resolveEmbeddingProviderIndexIdentity({
			config: this.cfg,
			agentDir: resolveAgentDir(this.cfg, this.agentId),
			...resolveMemoryPrimaryProviderRequest({ settings: this.settings })
		});
	}
	resolveCurrentIndexIdentityState(params) {
		const hasProviderOverride = params && "provider" in params;
		const configuredIndexIdentity = !hasProviderOverride && !this.provider && this.settings.provider !== "none" ? this.resolveConfiguredIndexIdentity() : void 0;
		const configuredProvider = this.settings.provider === "none" ? null : {
			id: configuredIndexIdentity?.provider.id ?? this.settings.provider,
			model: (configuredIndexIdentity?.provider.model ?? this.settings.model.trim()) || void 0
		};
		const provider = hasProviderOverride ? params.provider : this.provider ? {
			id: this.provider.id,
			model: this.provider.model
		} : configuredProvider;
		const vectorReady = params && "vectorReady" in params ? Boolean(params.vectorReady) : this.vector.available === true;
		const initializedProviderIdentities = provider && this.provider && provider.id === this.provider.id && provider.model === this.provider.model ? this.resolveProviderIndexIdentities() : [];
		const configuredProviderIdentities = configuredIndexIdentity?.cacheKeyData ? resolveMemoryIndexProviderIdentities({
			provider: configuredIndexIdentity.provider,
			cacheKeyData: configuredIndexIdentity.cacheKeyData,
			aliases: configuredIndexIdentity.aliases
		}) : [];
		const providerIdentities = initializedProviderIdentities.length > 0 ? initializedProviderIdentities : configuredProviderIdentities;
		const configuredProviderKeyKnown = configuredProviderIdentities.length > 0;
		return resolveMemoryIndexIdentityState({
			meta: params && "meta" in params ? params.meta : this.readMeta(),
			provider,
			providerKey: configuredProviderKeyKnown ? providerIdentities[0]?.providerKey : params?.providerKeyKnown === false ? void 0 : this.providerKey ?? void 0,
			providerAliases: providerIdentities.slice(1),
			providerKeyKnown: configuredProviderKeyKnown ? true : params?.providerKeyKnown,
			configuredSources: resolveConfiguredSourcesForMeta(this.sources),
			configuredScopeHash: resolveConfiguredScopeHash({
				workspaceDir: this.workspaceDir,
				extraPaths: this.settings.extraPaths,
				multimodal: {
					enabled: this.settings.multimodal.enabled,
					modalities: this.settings.multimodal.modalities,
					maxFileBytes: this.settings.multimodal.maxFileBytes
				}
			}),
			chunkTokens: this.settings.chunking.tokens,
			chunkOverlap: this.settings.chunking.overlap,
			vectorReady,
			hasIndexedChunks: params && "hasIndexedChunks" in params ? Boolean(params.hasIndexedChunks) : this.hasIndexedChunks(),
			ftsTokenizer: this.settings.store.fts.tokenizer
		});
	}
	resetVectorState() {
		this.database.vectorReady = null;
		this.vector.available = null;
		this.vector.semanticAvailable = void 0;
		this.vector.loadError = void 0;
		this.vector.dims = void 0;
		this.database.vectorDegradedWriteWarningShown = false;
	}
	async ensureVectorReady(dimensions) {
		if (!this.vector.enabled) return false;
		if (!this.database.vectorReady) {
			const database = this.database;
			const setup = database.isShadow ? database.withPrivateAccess(() => this.loadVectorExtension(), { reentrant: true }) : this.loadVectorExtension();
			database.vectorReady = this.withTimeout(setup, VECTOR_LOAD_TIMEOUT_MS, `sqlite-vec load timed out after ${Math.round(VECTOR_LOAD_TIMEOUT_MS / 1e3)}s`);
		}
		let ready;
		try {
			ready = await this.database.vectorReady || false;
		} catch (err) {
			const message = formatErrorMessage(err);
			this.vector.available = false;
			this.vector.loadError = message;
			this.database.vectorReady = null;
			log$10.warn(`sqlite-vec unavailable: ${message}`);
			return false;
		}
		if (ready && typeof dimensions === "number" && dimensions > 0) await this.withDatabaseWrite(() => {
			const persistedMeta = this.readMeta();
			if (persistedMeta && persistedMeta.vectorDims !== this.vector.dims) this.vector.dims = persistedMeta.vectorDims;
			this.ensureVectorTable(dimensions);
			if (persistedMeta && !persistedMeta.vectorDims && !this.hasIndexedChunks()) this.writeMeta({
				...persistedMeta,
				vectorDims: dimensions
			});
		});
		return ready;
	}
	async loadVectorExtension() {
		if (this.vector.available === true && this.hasVectorRebuildMarker()) {
			this.markConfiguredSourcesForFullReindex();
			return false;
		}
		if (this.vector.available === false) return false;
		if (!this.vector.enabled) {
			this.vector.available = false;
			return false;
		}
		try {
			const resolvedPath = this.vector.extensionPath?.trim() ? resolveUserPath(this.vector.extensionPath) : void 0;
			const loaded = await loadSqliteVecExtension({
				db: this.db,
				extensionPath: resolvedPath
			});
			if (!loaded.ok) throw new Error(loaded.error ?? "unknown sqlite-vec load error");
			this.vector.extensionPath = loaded.extensionPath;
			this.vector.available = true;
			if (this.hasVectorRebuildMarker()) {
				this.markConfiguredSourcesForFullReindex();
				return false;
			}
			if (!this.database.readOnly && await this.withDatabaseWrite(() => this.dropLegacyVectorTable())) {
				this.dirty = true;
				this.memoryFullRetryDirty = true;
			}
			return true;
		} catch (err) {
			const message = formatErrorMessage(err);
			this.vector.available = false;
			this.vector.loadError = message;
			log$10.warn(`sqlite-vec unavailable: ${message}`);
			return false;
		}
	}
	hasVectorRebuildMarker() {
		return requiresMemoryVectorRebuild({
			db: this.db,
			vectorTable: VECTOR_TABLE$1,
			metaVectorDims: this.readMeta()?.vectorDims,
			hasSemanticChunks: this.hasSemanticChunks()
		});
	}
	markConfiguredSourcesForFullReindex() {
		this.memoryFullRetryDirty = true;
		if (this.sources.has("memory")) this.dirty = true;
		if (this.sources.has("sessions")) {
			this.sessionsDirty = true;
			this.sessionsFullRetryDirty = true;
		}
	}
	ensureVectorTable(dimensions) {
		if (this.vector.dims === dimensions && memoryTableExists(this.db, VECTOR_TABLE$1)) return;
		if (!this.dropVectorTable()) throw new Error(`Failed to reset ${VECTOR_TABLE$1} before rebuilding vector dimensions`);
		this.db.exec(`CREATE VIRTUAL TABLE IF NOT EXISTS ${VECTOR_TABLE$1} USING vec0(\n  id TEXT PRIMARY KEY,\n  embedding FLOAT[${dimensions}]\n)`);
		this.vector.dims = dimensions;
	}
	dropLegacyVectorTable() {
		if (!memoryTableExists(this.db, LEGACY_VECTOR_TABLE)) return false;
		try {
			this.db.exec(`DROP TABLE ${LEGACY_VECTOR_TABLE}`);
			return true;
		} catch (err) {
			log$10.debug(`Failed to drop ${LEGACY_VECTOR_TABLE}: ${formatErrorMessage(err)}`);
			return false;
		}
	}
	dropVectorTable() {
		try {
			this.db.exec(`DROP TABLE IF EXISTS ${VECTOR_TABLE$1}`);
			return true;
		} catch (err) {
			const message = formatErrorMessage(err);
			log$10.debug(`Failed to drop ${VECTOR_TABLE$1}: ${message}`);
			return false;
		}
	}
	buildSourceFilter(alias, sourcesOverride) {
		return buildMemorySourceFilter(alias, sourcesOverride ?? Array.from(this.sources));
	}
	ensureSchema() {
		const result = ensureMemoryIndexSchema({
			db: this.db,
			cacheEnabled: this.cache.enabled,
			ftsEnabled: this.fts.enabled,
			ftsTokenizer: this.settings.store.fts.tokenizer
		});
		this.fts.available = result.ftsAvailable;
		if (result.ftsError) {
			this.fts.loadError = result.ftsError;
			if (this.fts.enabled) log$10.warn(`fts unavailable: ${result.ftsError}`);
		}
	}
	readMeta() {
		const { meta, serialized } = readMemoryIndexMetadata(this.db);
		this.database.lastMetaSerialized = serialized;
		return meta;
	}
	writeMeta(meta) {
		const value = JSON.stringify(meta);
		if (this.database.lastMetaSerialized === value) return;
		this.db.prepare(`INSERT INTO memory_index_meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value`).run(META_KEY, value);
		this.database.lastMetaSerialized = value;
	}
};
//#endregion
//#region extensions/memory-core/src/memory/manager-watch-ops.ts
const log$9 = createSubsystemLogger("memory");
function runDetachedMemorySync(sync, reason) {
	sync().catch((err) => {
		log$9.warn(`memory sync failed (${reason}): ${String(err)}`);
	});
}
var MemoryManagerWatchOps = class extends MemoryManagerSyncBase {
	get memoryWatchCapacityDegraded() {
		return this.fileWatcher?.capacityDegraded ?? false;
	}
	ensureWatcher() {
		if (!this.sources.has("memory") || !this.settings.sync.watch || this.closed) return;
		if (this.memoryFiles) {
			if (this.memoryWatchSubscription || this.memoryWatchUnavailable) return;
			const subscription = new AbortController();
			this.memoryWatchSubscription = subscription;
			const markDirty = (event) => {
				if (subscription.signal.aborted || this.closed) return;
				this.dirty = true;
				this.memoryWatchUnavailable ||= event === "unavailable";
				runDetachedMemorySync(() => this.sync({ reason: "watch" }), "watch");
			};
			this.memoryFiles.watch({
				agentId: this.agentId,
				settings: {
					extraPaths: this.settings.extraPaths,
					multimodal: this.settings.multimodal,
					sync: { watchDebounceMs: this.settings.sync.watchDebounceMs }
				}
			}, markDirty, subscription.signal).then(() => markDirty("unavailable"), (error) => {
				markDirty("unavailable");
				if (!subscription.signal.aborted) log$9.warn(`memory workspace watcher unavailable: ${String(error)}`);
			});
			return;
		}
		if (this.fileWatcher) return;
		this.fileWatcher = new MemoryFileWatcher({
			workspaceDir: this.workspaceDir,
			agentId: this.agentId,
			settings: this.settings,
			onDirty: () => {
				this.dirty = true;
			},
			onChange: () => this.sync({ reason: "watch" }),
			onUnavailable: () => {
				this.dirty = true;
			}
		});
		this.fileWatcher.start();
	}
	async closeMemoryWatcher() {
		this.memoryWatchSubscription?.abort();
		this.memoryWatchSubscription = void 0;
		await this.fileWatcher?.close();
		this.fileWatcher = void 0;
	}
	ensureIntervalSync() {
		const minutes = this.settings.sync.intervalMinutes;
		if (!minutes || minutes <= 0 || this.intervalTimer) return;
		const ms = resolveTimerTimeoutMs(minutes * 60 * 1e3, 0, 0);
		if (ms <= 0) return;
		this.intervalTimer = setInterval(() => {
			runDetachedMemorySync(() => this.sync({ reason: "interval" }), "interval");
		}, ms);
	}
};
//#endregion
//#region extensions/memory-core/src/memory/manager-session-sync-ops.ts
const SESSION_DIRTY_DEBOUNCE_MS = 5e3;
const log$8 = createSubsystemLogger("memory");
var MemoryManagerSessionSyncOps = class extends MemoryManagerWatchOps {
	async inspectDiagnosticSourceState() {
		if (this.sources.has("memory")) try {
			const inspection = await inspectMemorySourceState({
				files: this.memoryFiles,
				db: this.db,
				workspaceDir: this.workspaceDir,
				settings: this.settings,
				concurrency: this.getIndexConcurrency()
			});
			this.sourceInspections.set("memory", inspection);
			this.dirty ||= inspection.dirty;
		} catch (error) {
			this.sourceInspections.set("memory", {
				eligible: null,
				issues: [String(error)]
			});
			this.dirty = true;
		}
		if (this.sources.has("sessions")) try {
			await this.markSessionStartupCatchupDirtyFiles(true);
		} catch (error) {
			this.sourceInspections.set("sessions", {
				eligible: null,
				issues: [String(error)]
			});
			this.sessionsDirty = true;
		}
	}
	async listSessionCorpusEntries() {
		const readOnly = this.database.readOnly;
		const entries = await listSessionTranscriptCorpusEntriesForAgent(this.agentId, {
			includeContentRevision: false,
			readOnly
		});
		const archivedSessions = new Map(listSessionTranscriptArchivesReadOnly({
			agentId: this.agentId,
			storePath: resolveSessionStorePathCore(this.cfg.session?.store, { agentId: this.agentId }),
			sessionIds: entries.filter((entry) => entry.artifactKind === "archive-artifact").map((entry) => entry.sessionId)
		}).map((archive) => [archive.archiveName, archive]));
		const forgottenSessions = new Set(listMemorySessionTombstones({
			agentId: this.agentId,
			sessionIds: entries.map((entry) => entry.sessionId)
		}).map((entry) => entry.sessionId));
		return entries.filter((entry) => {
			const archive = archivedSessions.get(path.basename(entry.sessionFile));
			const archivedSessionKey = archive?.sessionId === entry.sessionId ? archive.sessionKey : void 0;
			return !forgottenSessions.has(entry.sessionId) && isMemorySessionIndexable(entry, archivedSessionKey);
		});
	}
	sessionPathForCorpusEntry(entry) {
		return entry.transcriptSource === "sqlite" ? sessionPathForSessionIdentity(entry.agentId, entry.sessionId) : sessionPathForFile(entry.sessionFile);
	}
	legacyExtensionlessSessionPathForIdentity(agentId, sessionId) {
		return path.join("sessions", normalizeAgentId(agentId), sessionId).replace(/\\/g, "/");
	}
	buildSessionEntryOptions(entry) {
		return {
			generatedByDreamingNarrative: entry.generatedByDreamingNarrative === true,
			generatedByCronRun: entry.generatedByCronRun === true,
			...entry.sessionKind ? { sessionKind: entry.sessionKind } : {},
			...entry.transcriptSource === "sqlite" && entry.storePath ? {
				agentId: entry.agentId,
				sessionId: entry.sessionId,
				storePath: entry.storePath
			} : {},
			...entry.sessionKey ? { sessionKey: entry.sessionKey } : {},
			...entry.updatedAtMs !== void 0 ? { updatedAtMs: entry.updatedAtMs } : {}
		};
	}
	ensureSessionListener() {
		if (!this.sources.has("sessions") || this.sessionUnsubscribe) return;
		this.sessionUnsubscribe = this.subscribeSessionTranscriptUpdates((update) => runInMemoryBackgroundContext(() => {
			if (this.closing || this.closed) return;
			const target = this.resolveSessionTranscriptUpdateSyncTarget(update);
			if (target) {
				this.scheduleSessionDirty(target);
				return;
			}
			if (update.sessionFile) {
				const sessionFile = update.sessionFile;
				this.withManagerOperation(() => this.scheduleCorpusSessionFileDirty(sessionFile)).catch((err) => {
					log$8.warn(`memory session corpus update failed: ${String(err)}`);
				});
			}
		}));
	}
	subscribeSessionTranscriptUpdates(listener) {
		return onInternalSessionTranscriptUpdate(listener);
	}
	async scheduleCorpusSessionFileDirty(sessionFile) {
		const resolvedSessionFile = path.resolve(sessionFile);
		if ((await this.listSessionCorpusEntries()).some((entry) => entry.transcriptSource !== "sqlite" && path.resolve(entry.sessionFile) === resolvedSessionFile)) this.scheduleSessionDirty(resolvedSessionFile);
	}
	ensureSessionStartupCatchup() {
		if (!this.sources.has("sessions") || this.closing || this.closed) return;
		this.withManagerOperation(() => this.runSessionStartupCatchup()).catch((err) => {
			log$8.warn("memory session startup catch-up failed: " + String(err));
		});
	}
	async markSessionStartupCatchupDirtyFiles(inspectSources = false) {
		if (!this.sources.has("sessions") || this.closed) return [];
		const corpusEntries = await this.listSessionCorpusEntries();
		if (this.closed) return [];
		const existingRows = loadMemorySourceFileState({
			db: this.db,
			source: "sessions"
		});
		const sqliteCorpusEntries = corpusEntries.filter((entry) => entry.transcriptSource === "sqlite");
		const transcriptStats = readTranscriptStatsBatchReadOnlySync(sqliteCorpusEntries.map((entry) => ({
			agentId: entry.agentId,
			sessionId: entry.sessionId,
			...entry.sessionKey ? { sessionKey: entry.sessionKey } : {},
			...entry.storePath ? { storePath: entry.storePath } : {}
		})));
		const statsByEntry = new Map(sqliteCorpusEntries.map((entry, index) => [entry, transcriptStats[index]]));
		const fileStates = (await runMemoryHostTasksWithConcurrency(corpusEntries.map((corpusEntry) => async () => {
			if (corpusEntry.transcriptSource === "sqlite") {
				const stats = statsByEntry.get(corpusEntry);
				return stats ? statSessionEntrySync(corpusEntry.sessionFile, this.buildSessionEntryOptions(corpusEntry), stats) : null;
			}
			const file = corpusEntry.sessionFile;
			try {
				const stat = await fs$1.stat(file);
				if (!stat.isFile()) return null;
				return {
					absPath: file,
					path: this.sessionPathForCorpusEntry(corpusEntry),
					mtimeMs: stat.mtimeMs,
					size: stat.size
				};
			} catch (err) {
				if (isFileMissingError(err)) return null;
				throw err;
			}
		}), this.getIndexConcurrency())).filter((file) => file !== null);
		const { dirtyFiles, hasStaleIndexedPaths } = resolveMemorySessionStartupState({
			files: fileStates,
			existingRows
		});
		if (inspectSources) this.sourceInspections.set("sessions", {
			eligible: fileStates.length,
			issues: fileStates.length === 0 ? ["no eligible session transcripts found"] : []
		});
		if (this.closed) return dirtyFiles;
		if (hasStaleIndexedPaths) {
			this.sessionsDirty = true;
			this.sessionsReconcileDirty = true;
		}
		for (const file of dirtyFiles) this.sessionsDirtyFiles.add(file);
		if (dirtyFiles.length > 0) this.sessionsDirty = true;
		return dirtyFiles;
	}
	async runSessionStartupCatchup() {
		const dirtyFiles = await this.markSessionStartupCatchupDirtyFiles();
		if (!this.sessionsDirty || this.closed) return dirtyFiles;
		this.sync({ reason: "session-startup-catchup" }).catch((err) => {
			log$8.warn("memory sync failed (session-startup-catchup): " + String(err));
		});
		return dirtyFiles;
	}
	scheduleSessionDirty(target) {
		if (this.closing || this.closed) return;
		if (typeof target === "string") this.sessionPendingFiles.add(target);
		else this.sessionPendingTargets.set(this.memorySessionSyncTargetKey(target), target);
		if (this.sessionWatchTimer) return;
		this.sessionWatchTimer = setTimeout(() => {
			this.sessionWatchTimer = null;
			if (this.closing || this.closed) return;
			this.withManagerOperation(() => this.processSessionUpdateBatch()).catch((err) => {
				log$8.warn(`memory session update failed: ${String(err)}`);
			});
		}, SESSION_DIRTY_DEBOUNCE_MS);
	}
	async processSessionUpdateBatch() {
		if (this.sessionPendingFiles.size === 0 && this.sessionPendingTargets.size === 0) return;
		const pending = Array.from(this.sessionPendingFiles);
		const pendingTargets = Array.from(this.sessionPendingTargets.values());
		this.sessionPendingFiles.clear();
		this.sessionPendingTargets.clear();
		pending.push(...Array.from(await this.resolveArchiveFilesForSyncTargets(pendingTargets)));
		for (const sessionFile of pending) this.sessionsDirtyFiles.add(sessionFile);
		if (pending.length > 0) {
			this.sessionsDirty = true;
			this.sync({
				reason: "session-delta",
				sessions: pendingTargets,
				archiveFiles: pending
			}).catch((err) => {
				log$8.warn(`memory sync failed (session update): ${String(err)}`);
			});
		}
	}
	resolveSessionTranscriptUpdateSyncTarget(update) {
		if (!update.target) return null;
		const agentId = update.target.agentId.trim();
		const sessionId = update.target.sessionId.trim();
		const sessionKey = update.target.sessionKey.trim();
		if (!agentId || !sessionId || normalizeAgentId(agentId) !== normalizeAgentId(this.agentId)) return null;
		return {
			agentId,
			sessionId,
			...sessionKey ? { sessionKey } : {}
		};
	}
	normalizeTargetArchiveFiles(archiveFiles, corpusEntries = [], includeSqlite = false) {
		if (!archiveFiles || archiveFiles.length === 0) return null;
		const normalized = /* @__PURE__ */ new Set();
		const corpusPaths = new Map(corpusEntries.filter((entry) => includeSqlite || entry.transcriptSource !== "sqlite").map((entry) => [entry.transcriptSource === "sqlite" ? entry.sessionFile : path.resolve(entry.sessionFile), entry.sessionFile]));
		for (const sessionFile of archiveFiles) {
			const trimmed = sessionFile.trim();
			if (!trimmed) continue;
			const corpusPath = corpusPaths.get(trimmed) ?? corpusPaths.get(path.resolve(trimmed));
			if (corpusPath) normalized.add(corpusPath);
		}
		return normalized.size > 0 ? normalized : null;
	}
	async resolveArchiveFilesForSyncTargets(sessions, knownCorpusEntries) {
		const files = /* @__PURE__ */ new Set();
		const targets = Array.from(sessions ?? []);
		if (targets.length === 0) return files;
		const corpusEntries = knownCorpusEntries ?? await this.listSessionCorpusEntries();
		const normalizedAgentId = normalizeAgentId(this.agentId);
		for (const rawSession of targets) {
			const sessionId = rawSession.sessionId.trim();
			const agentId = rawSession.agentId?.trim() || this.agentId;
			if (!sessionId || normalizeAgentId(agentId) !== normalizedAgentId) continue;
			const sessionKey = rawSession.sessionKey?.trim();
			const matchingEntries = corpusEntries.filter((entry) => entry.sessionId === sessionId && normalizeAgentId(entry.agentId) === normalizedAgentId && (!sessionKey || entry.sessionKey === sessionKey));
			for (const entry of matchingEntries) files.add(entry.transcriptSource === "sqlite" ? entry.sessionFile : path.resolve(entry.sessionFile));
		}
		return files;
	}
	async resolveTargetSessionSyncPlan(params) {
		const files = /* @__PURE__ */ new Set();
		const corpusEntries = await this.listSessionCorpusEntries();
		for (const file of this.normalizeTargetArchiveFiles(params.archiveFiles, corpusEntries) ?? []) files.add(file);
		for (const file of await this.resolveArchiveFilesForSyncTargets(params.sessions, corpusEntries)) files.add(file);
		return files.size > 0 ? {
			corpusEntries,
			targetArchiveFiles: files
		} : null;
	}
	memorySessionSyncTargetKey(target) {
		return [
			target.agentId ?? "",
			target.sessionId,
			target.sessionKey ?? ""
		].join("\0");
	}
	shouldSyncSessions(params, needsFullReindex = false) {
		return shouldSyncSessionsForReindex({
			hasSessionSource: this.sources.has("sessions"),
			sessionsDirty: this.sessionsDirty,
			sessionsFullRetryDirty: this.sessionsFullRetryDirty,
			sync: params,
			needsFullReindex
		});
	}
};
//#endregion
//#region extensions/memory-core/src/memory/manager-source-sync-ops.ts
const SOURCE_SYNC_YIELD_INTERVAL_MS = 12;
const SOURCE_WIDE_SESSION_INDEX_FLUSH_FILES = 128;
const log$7 = createSubsystemLogger("memory");
function createSourceSyncYield(total) {
	let completed = 0;
	let workStartedAt = performance.now();
	let pendingYield;
	return async () => {
		completed += 1;
		if (!pendingYield && completed < total && performance.now() - workStartedAt >= SOURCE_SYNC_YIELD_INTERVAL_MS) pendingYield = new Promise((resolve) => {
			setImmediate(() => {
				workStartedAt = performance.now();
				pendingYield = void 0;
				resolve();
			});
		});
		if (pendingYield) await pendingYield;
	};
}
var MemoryManagerSourceSyncOps = class extends MemoryManagerSessionSyncOps {
	async deleteIndexedFile(pathname, source, expectedHash) {
		await withMemoryWorkspaceLock(this.workspaceDir, async () => {
			const database = this.database;
			const capturedHash = expectedHash ?? await this.withDatabaseRead(() => resolveMemorySourceExistingHash({
				db: this.db,
				path: pathname,
				source
			}));
			await database.deleteSource({
				path: pathname,
				source,
				expectedHash: capturedHash
			}, () => {
				if (this.closed || database.closed || database.readOnly || !database.db.isOpen || this.database !== database) throw new Error("Memory source owner changed before deletion");
			});
		});
	}
	async deleteStaleSourceFiles(source, rows, activePaths) {
		if (activePaths === null) return;
		const yieldAfterRow = createSourceSyncYield(rows.length);
		for (const row of rows) try {
			if (!activePaths.has(row.path)) await this.deleteIndexedFile(row.path, source, row.hash);
		} finally {
			await yieldAfterRow();
		}
	}
	async syncMemoryFiles(params) {
		this.clearMemoryRetryState();
		const fileEntries = await resolveMemorySourceFileEntries({
			files: this.memoryFiles,
			workspaceDir: this.workspaceDir,
			settings: this.settings,
			concurrency: this.getIndexConcurrency()
		});
		log$7.debug("memory sync: indexing memory files", {
			files: fileEntries.length,
			needsFullReindex: params.needsFullReindex,
			batch: this.batch.enabled,
			concurrency: this.getIndexConcurrency()
		});
		const existingRows = loadMemorySourceFileState({
			db: this.db,
			source: "memory"
		});
		const existingHashes = new Map(existingRows.map((row) => [row.path, row.hash]));
		const activePaths = new Set(fileEntries.map((entry) => entry.path));
		if (params.progress) {
			params.progress.total += fileEntries.length;
			params.progress.report({
				completed: params.progress.completed,
				total: params.progress.total,
				label: this.batch.enabled ? "Indexing memory files (batch)..." : "Indexing memory files…"
			});
		}
		const deleteStaleRows = () => this.deleteStaleSourceFiles("memory", existingRows, activePaths);
		if (this.batch.enabled) {
			const dirtyEntries = [];
			for (const entry of fileEntries) {
				if (!params.needsFullReindex && existingHashes.get(entry.path) === entry.hash) {
					this.advanceSyncProgress(params.progress);
					continue;
				}
				dirtyEntries.push(entry);
			}
			const indexItems = dirtyEntries.map((entry) => ({
				entry,
				source: "memory"
			}));
			if (params.deferIndex) return {
				indexItems,
				finalize: deleteStaleRows
			};
			await this.indexQueuedFiles(indexItems, params.progress);
		} else {
			const tasks = fileEntries.map((entry) => async () => {
				if (!params.needsFullReindex && existingHashes.get(entry.path) === entry.hash) {
					this.advanceSyncProgress(params.progress);
					return;
				}
				await this.indexFile(entry, { source: "memory" });
				this.advanceSyncProgress(params.progress);
			});
			await runMemoryHostTasksWithConcurrency(tasks, this.getIndexConcurrency());
		}
		await deleteStaleRows();
		return this.emptySourceSyncPlan();
	}
	async syncArchiveFiles(params) {
		const updateUnchangedSessionSourceMetadata = this.db.prepare(`UPDATE memory_index_sources
       SET mtime = ?, size = ?, hash = ?
       WHERE path = ? AND source = 'sessions' AND hash = ?`);
		const corpusEntries = params.corpusEntries ?? await this.listSessionCorpusEntries();
		const targetArchiveFiles = params.needsFullReindex ? null : this.normalizeTargetArchiveFiles(params.targetArchiveFiles, corpusEntries, true);
		const corpusEntryByPath = new Map(corpusEntries.map((entry) => [entry.sessionFile, entry]));
		const corpusEntryForPath = (file) => {
			const entry = corpusEntryByPath.get(file);
			if (!entry) throw new Error(`Missing session corpus entry for ${file}`);
			return entry;
		};
		const files = targetArchiveFiles ? Array.from(targetArchiveFiles) : corpusEntries.map((entry) => entry.sessionFile);
		const { activePaths, existingRows, existingHashes, indexAll } = resolveMemorySessionSyncPlan({
			needsFullReindex: params.needsFullReindex,
			files,
			targetSessionFiles: targetArchiveFiles,
			existingRows: targetArchiveFiles ? null : loadMemorySourceFileState({
				db: this.db,
				source: "sessions"
			}),
			sessionPathForFile: (file) => this.sessionPathForCorpusEntry(corpusEntryForPath(file))
		});
		log$7.debug("memory sync: indexing session files", {
			files: files.length,
			indexAll,
			dirtyFiles: this.sessionsDirtyFiles.size,
			targetedFiles: targetArchiveFiles?.size ?? 0,
			batch: this.batch.enabled,
			concurrency: this.getIndexConcurrency()
		});
		if (params.progress) {
			params.progress.total += files.length;
			params.progress.report({
				completed: params.progress.completed,
				total: params.progress.total,
				label: this.batch.enabled ? "Indexing session files (batch)..." : "Indexing session files…"
			});
		}
		const yieldAfterSessionFile = createSourceSyncYield(files.length);
		const deleteStaleRows = () => this.deleteStaleSourceFiles("sessions", existingRows ?? [], activePaths);
		const deleteTargetArchiveStaleLiveRows = async () => {
			if (!targetArchiveFiles) return;
			const activeCorpusPaths = new Set(corpusEntries.filter((entry) => entry.artifactKind === "active-session").map((entry) => this.sessionPathForCorpusEntry(entry)));
			const staleLivePaths = Array.from(targetArchiveFiles).flatMap((file) => {
				const { agentId, sessionId } = corpusEntryForPath(file);
				return [sessionPathForSessionIdentity(agentId, sessionId), this.legacyExtensionlessSessionPathForIdentity(agentId, sessionId)];
			}).filter((pathname) => !activeCorpusPaths.has(pathname));
			const existingSessionHashes = new Map(loadMemorySourceFileState({
				db: this.db,
				source: "sessions",
				paths: staleLivePaths
			}).map((row) => [row.path, row.hash]));
			for (const staleLivePath of staleLivePaths) {
				if (!existingSessionHashes.has(staleLivePath)) continue;
				await this.deleteIndexedFile(staleLivePath, "sessions", existingSessionHashes.get(staleLivePath));
			}
		};
		const resolveSessionIndexEntry = async (absPath) => {
			if (!indexAll && !this.sessionsDirtyFiles.has(absPath)) {
				this.advanceSyncProgress(params.progress);
				return null;
			}
			const entry = await buildSessionEntry(absPath, this.buildSessionEntryOptions(corpusEntryForPath(absPath)));
			if (!entry) {
				this.advanceSyncProgress(params.progress);
				return null;
			}
			if (!isMemorySessionIndexable(entry)) {
				await this.deleteIndexedFile(entry.path, "sessions");
				this.advanceSyncProgress(params.progress);
				return null;
			}
			const existingHash = resolveMemorySourceExistingHash({
				db: this.db,
				source: "sessions",
				path: entry.path,
				existingHashes
			});
			const hash = entry.revisionMs === void 0 ? entry.hash : `sqlite:${entry.revisionMs}:${entry.hash}`;
			const existingContentHash = existingHash?.startsWith("sqlite:") ? existingHash.slice(existingHash.lastIndexOf(":") + 1) : existingHash;
			if (!params.needsFullReindex && existingHash !== void 0 && existingContentHash === entry.hash) {
				if ((this.sessionsDirtyFiles.has(absPath) || existingHash !== hash) && !await runSqliteImmediateTransaction(this.db, async () => () => updateUnchangedSessionSourceMetadata.run(entry.mtimeMs, entry.size, hash, entry.path, existingHash).changes === 1, void 0, (write) => this.withDatabaseWrite(write))) throw new MemoryIndexRevisionConflictError(`Memory session source ${entry.path} changed during metadata refresh; retry incremental sync.`);
				this.advanceSyncProgress(params.progress);
				return null;
			}
			return Object.assign(entry, {
				hash,
				sessionId: corpusEntryForPath(absPath).sessionId
			});
		};
		if (params.deferIndex) {
			const pendingIndexItems = [...params.prefixIndexItems ?? []];
			const flushPendingIndexItems = async () => {
				if (pendingIndexItems.length === 0) return;
				const current = pendingIndexItems.splice(0);
				const sources = new Set(current.map((item) => item.source));
				await this.indexQueuedFiles(current, params.progress, sources.size > 1 ? "Indexing memory sources (batch)..." : void 0);
			};
			for (let start = 0; start < files.length; start += SOURCE_WIDE_SESSION_INDEX_FLUSH_FILES) {
				const fileBatch = files.slice(start, start + SOURCE_WIDE_SESSION_INDEX_FLUSH_FILES);
				const dirtyEntries = (await runMemoryHostTasksWithConcurrency(fileBatch.map((absPath) => async () => {
					try {
						return await resolveSessionIndexEntry(absPath);
					} finally {
						await yieldAfterSessionFile();
					}
				}), this.getIndexConcurrency())).filter((entry) => entry !== null);
				pendingIndexItems.push(...dirtyEntries.map((entry) => ({
					entry,
					source: "sessions"
				})));
				if (pendingIndexItems.length >= SOURCE_WIDE_SESSION_INDEX_FLUSH_FILES) await flushPendingIndexItems();
			}
			await flushPendingIndexItems();
			await deleteTargetArchiveStaleLiveRows();
			await deleteStaleRows();
			return this.emptySourceSyncPlan();
		}
		if ((params.prefixIndexItems?.length ?? 0) > 0) throw new Error("Memory session sync prefix requires deferred source-wide indexing.");
		const tasks = files.map((absPath) => async () => {
			try {
				const entry = await resolveSessionIndexEntry(absPath);
				if (!entry) return;
				await this.indexFile(entry, {
					source: "sessions",
					content: entry.content
				});
				this.advanceSyncProgress(params.progress);
			} finally {
				await yieldAfterSessionFile();
			}
		});
		await runMemoryHostTasksWithConcurrency(tasks, this.getIndexConcurrency());
		await deleteTargetArchiveStaleLiveRows();
		await deleteStaleRows();
		return this.emptySourceSyncPlan();
	}
};
//#endregion
//#region extensions/memory-core/src/memory/manager-targeted-sync.ts
function clearMemorySyncedArchiveFiles(params) {
	if (!params.targetArchiveFiles) params.sessionsDirtyFiles.clear();
	else for (const targetArchiveFile of params.targetArchiveFiles) params.sessionsDirtyFiles.delete(targetArchiveFile);
	return params.sessionsDirtyFiles.size > 0;
}
function markMemoryTargetArchiveFilesDirty(params) {
	if (params.targetArchiveFiles) for (const targetArchiveFile of params.targetArchiveFiles) params.sessionsDirtyFiles.add(targetArchiveFile);
	return params.sessionsDirtyFiles.size > 0;
}
async function runMemoryTargetedSessionSync(params) {
	const hasPendingSessionWork = (hasDirtyFiles = params.sessionsDirtyFiles.size > 0) => params.sessionsFullRetryDirty || params.sessionsReconcileDirty || hasDirtyFiles;
	if (!params.hasSessionSource || !params.targetArchiveFiles) return {
		handled: false,
		sessionsDirty: hasPendingSessionWork()
	};
	try {
		await params.syncArchiveFiles({
			needsFullReindex: false,
			targetArchiveFiles: Array.from(params.targetArchiveFiles),
			progress: params.progress
		});
		return {
			handled: true,
			sessionsDirty: hasPendingSessionWork(clearMemorySyncedArchiveFiles({
				sessionsDirtyFiles: params.sessionsDirtyFiles,
				targetArchiveFiles: params.targetArchiveFiles
			}))
		};
	} catch (err) {
		const reason = formatErrorMessage(err);
		if (!(params.shouldFallbackOnError(err) && await params.activateFallbackProvider(reason))) throw err;
		return {
			handled: true,
			sessionsDirty: hasPendingSessionWork(markMemoryTargetArchiveFilesDirty({
				sessionsDirtyFiles: params.sessionsDirtyFiles,
				targetArchiveFiles: params.targetArchiveFiles
			})),
			failure: { error: err }
		};
	}
}
//#endregion
//#region extensions/memory-core/src/memory/manager-sync-ops.ts
const log$6 = createSubsystemLogger("memory");
var MemoryManagerSyncOps = class extends MemoryManagerSourceSyncOps {
	constructor(notice) {
		super();
		this.fallbackProviderInitPromise = null;
		this.syncProviderGeneration = null;
		this.automaticRebuildNotice = notice ?? {
			sequence: 0,
			warning: ""
		};
	}
	recordAutomaticRebuild() {
		this.automaticRebuildNotice.sequence += 1;
		this.automaticRebuildNotice.warning = `Automatic memory index repair was requested. To rebuild manually, run: ${formatMemoryIndexRebuildGuidance({ requestedProvider: this.settings.provider }, this.agentId)}`;
	}
	takeSearchMaintenanceRequest() {
		const generation = this.takeReindexRetryStateForMaintenance();
		if (generation.memoryFullRetryDirty || generation.sessionsFullRetryDirty) this.recordAutomaticRebuild();
		return generation;
	}
	beginSyncProviderGeneration(_options) {}
	endSyncProviderGeneration() {}
	shouldDeferSourceWideBatch() {
		const generation = this.syncProviderGeneration;
		const provider = generation ? generation.provider : this.provider;
		const providerRuntime = generation ? generation.kind === "semantic" ? generation.runtime : void 0 : this.providerRuntime;
		return Boolean(this.batch.enabled && provider && providerRuntime?.batchEmbed && providerRuntime.sourceWideBatchEmbed === true);
	}
	async retireCurrentProvider() {
		const provider = this.provider;
		this.provider = null;
		this.providerRuntime = void 0;
		await provider?.close?.();
	}
	createSyncProgress(onProgress) {
		const state = {
			completed: 0,
			total: 0,
			label: void 0,
			report: (update) => {
				if (update.label) state.label = update.label;
				const label = update.total > 0 && state.label ? `${state.label} ${update.completed}/${update.total}` : state.label;
				onProgress({
					completed: update.completed,
					total: update.total,
					label
				});
			}
		};
		return state;
	}
	assertFtsOnlySyncAllowed() {
		if (this.syncProviderGeneration ? this.syncProviderGeneration.provider : this.provider) return;
		this.assertRequiredProviderAvailable("sync");
		const existingMeta = this.readMeta();
		if (!existingMeta || existingMeta.model === "fts-only" || !this.settings.provider || this.settings.provider === "none") return;
		const providerFailure = this.providerUnavailableReason;
		this.resetProviderInitializationForRetry();
		throw new Error(`Memory sync aborted: embedding provider "${this.settings.provider}" is configured but unavailable. Refusing to run sync in fts-only fallback mode to protect existing vector index (current model: ${existingMeta.model}).` + (providerFailure ? ` Provider failure: ${providerFailure}` : ""));
	}
	async runSync(params) {
		const hasTargetSessionRequest = this.hasRequestedTargetSessionSync(params);
		let needsFullReindex = Boolean(params?.force && !hasTargetSessionRequest);
		try {
			this.assertFtsOnlySyncAllowed();
			const syncProvider = this.syncProviderGeneration ? this.syncProviderGeneration.provider : this.provider;
			const progress = params?.progress ? this.createSyncProgress(params.progress) : void 0;
			if (progress) progress.report({
				completed: progress.completed,
				total: progress.total,
				label: "Loading vector extension…"
			});
			const vectorReady = syncProvider ? await this.ensureVectorReady() : false;
			const meta = this.readMeta();
			const targetSessionSync = hasTargetSessionRequest ? await this.resolveTargetSessionSyncPlan({
				sessions: params?.sessions,
				archiveFiles: params?.archiveFiles
			}) : null;
			const targetArchiveFiles = targetSessionSync?.targetArchiveFiles ?? null;
			const hasTargetArchiveFiles = targetArchiveFiles !== null;
			if (hasTargetSessionRequest && !hasTargetArchiveFiles) return;
			if (params?.reason === "cli" && !params.force && !hasTargetArchiveFiles) await this.markSessionStartupCatchupDirtyFiles();
			const syncProviderKey = this.syncProviderGeneration ? this.syncProviderGeneration.providerKey : this.providerKey;
			const syncProviderIdentities = this.syncProviderGeneration?.identities ?? this.resolveProviderIndexIdentities();
			const hasIndexedChunks = this.hasIndexedChunks();
			const indexIdentity = resolveMemoryIndexIdentityState({
				meta,
				provider: syncProvider ? {
					id: syncProvider.id,
					model: syncProvider.model
				} : null,
				providerKey: syncProviderKey ?? void 0,
				providerAliases: syncProviderIdentities.slice(1),
				configuredSources: resolveConfiguredSourcesForMeta(this.sources),
				configuredScopeHash: resolveConfiguredScopeHash({
					workspaceDir: this.workspaceDir,
					extraPaths: this.settings.extraPaths,
					multimodal: {
						enabled: this.settings.multimodal.enabled,
						modalities: this.settings.multimodal.modalities,
						maxFileBytes: this.settings.multimodal.maxFileBytes
					}
				}),
				chunkTokens: this.settings.chunking.tokens,
				chunkOverlap: this.settings.chunking.overlap,
				vectorReady,
				hasIndexedChunks,
				ftsTokenizer: this.settings.store.fts.tokenizer
			});
			if (indexIdentity.status === "mismatched" && indexIdentity.owner === "openclaw" && indexIdentity.versionOrder === "newer" && params?.reason !== "cli") {
				needsFullReindex = true;
				return;
			}
			const needsInitialIndex = indexIdentity.status !== "valid" && !hasIndexedChunks;
			const hasOnlyFtsChunks = indexIdentity.status === "missing" && hasIndexedChunks && syncProvider === null && Boolean(this.settings.provider) && this.settings.provider !== "none" && !this.hasSemanticChunks();
			const canRebuildMissingIdentity = syncProvider !== null || !this.settings.provider || this.settings.provider === "none" || hasOnlyFtsChunks;
			const needsMissingIdentityReindex = indexIdentity.status === "missing" && !hasTargetArchiveFiles && canRebuildMissingIdentity;
			const needsExplicitIdentityReindex = params?.reason === "cli" && indexIdentity.status !== "valid" && !hasTargetArchiveFiles;
			const needsRuntimeVersionReindex = indexIdentity.status === "mismatched" && indexIdentity.owner === "openclaw" && !hasTargetArchiveFiles;
			const canRunRetryFullReindex = indexIdentity.status !== "missing" || needsInitialIndex || canRebuildMissingIdentity;
			needsFullReindex = params?.force && !hasTargetArchiveFiles || needsInitialIndex || needsMissingIdentityReindex || needsExplicitIdentityReindex || needsRuntimeVersionReindex || this.memoryFullRetryDirty && canRunRetryFullReindex || this.sessionsFullRetryDirty && indexIdentity.status !== "valid" && canRunRetryFullReindex;
			const isSearchBootstrap = params?.reason === "search-bootstrap";
			const needsFullSessionReindex = needsFullReindex || this.sessionsFullRetryDirty || isSearchBootstrap;
			if (indexIdentity.status !== "valid" && !needsFullReindex) {
				this.dirty = true;
				if (markMemoryTargetArchiveFilesDirty({
					sessionsDirtyFiles: this.sessionsDirtyFiles,
					targetArchiveFiles
				})) this.sessionsDirty = true;
				return;
			}
			if (!needsFullSessionReindex) {
				if (this.sources.has("sessions") && targetArchiveFiles) this.sessionsDirty = markMemoryTargetArchiveFilesDirty({
					sessionsDirtyFiles: this.sessionsDirtyFiles,
					targetArchiveFiles
				});
				const targetedSessionSync = await runMemoryTargetedSessionSync({
					hasSessionSource: this.sources.has("sessions"),
					targetArchiveFiles,
					reason: params?.reason,
					progress: progress ?? void 0,
					sessionsFullRetryDirty: this.sessionsFullRetryDirty,
					sessionsReconcileDirty: this.sessionsReconcileDirty,
					sessionsDirtyFiles: this.sessionsDirtyFiles,
					syncArchiveFiles: async (targetedParams) => {
						await this.syncArchiveFiles({
							...targetedParams,
							corpusEntries: targetSessionSync?.corpusEntries
						});
					},
					shouldFallbackOnError: (err) => this.shouldFallbackOnError(err),
					activateFallbackProvider: async (reason) => {
						this.endSyncProviderGeneration();
						return await this.activateFallbackProvider(reason);
					}
				});
				if (targetedSessionSync.handled) {
					this.sessionsDirty = targetedSessionSync.sessionsDirty;
					if (targetedSessionSync.failure) this.syncOutcomes.recordActiveFailure(targetedSessionSync.failure.error);
					return;
				}
			}
			try {
				if (needsFullReindex) {
					if (params?.reason !== "cli") this.recordAutomaticRebuild();
					await this.runInPlaceReindex({
						reason: params?.reason,
						force: params?.force,
						progress: progress ?? void 0
					});
					return;
				}
				const shouldSyncMemory = this.sources.has("memory") && (this.dirty || isSearchBootstrap);
				const shouldSyncSessions = this.shouldSyncSessions(params, needsFullSessionReindex);
				if (this.shouldDeferSourceWideBatch()) {
					await this.executeSourceWideSync({
						shouldSyncMemory,
						shouldSyncSessions,
						needsFullReindex,
						needsFullSessionReindex,
						targetArchiveFiles: targetArchiveFiles ? Array.from(targetArchiveFiles) : void 0,
						progress: progress ?? void 0
					});
					if (shouldSyncSessions) this.clearSessionRetryState();
					else this.refreshSessionDirtyFlag();
				} else {
					if (shouldSyncMemory) await this.syncMemoryFiles({
						needsFullReindex,
						progress: progress ?? void 0
					});
					if (shouldSyncSessions) {
						await this.syncArchiveFiles({
							needsFullReindex: needsFullSessionReindex,
							targetArchiveFiles: targetArchiveFiles ? Array.from(targetArchiveFiles) : void 0,
							progress: progress ?? void 0
						});
						this.clearSessionRetryState();
					} else this.refreshSessionDirtyFlag();
				}
			} catch (err) {
				this.dirty ||= this.sources.has("memory");
				const reason = formatErrorMessage(err);
				const shouldFallback = this.shouldFallbackOnError(err);
				if (shouldFallback) this.endSyncProviderGeneration();
				if (shouldFallback && await this.activateFallbackProvider(reason)) {
					if ((needsFullReindex || isSearchBootstrap) && !hasTargetArchiveFiles) {
						needsFullReindex = true;
						this.beginSyncProviderGeneration();
						await this.runInPlaceReindex({
							reason: params?.reason ?? "fallback",
							force: true,
							progress: progress ?? void 0
						});
					}
					return;
				}
				if (!this.provider && this.fts.enabled && this.shouldFallbackOnError(err)) {
					this.syncOutcomes.recordActiveFailure(err);
					log$6.warn(`memory embeddings unavailable; leaving memory index dirty: ${reason}`);
					return;
				}
				throw err;
			}
		} finally {
			if (!needsFullReindex) await this.pruneEmbeddingCacheIfNeeded();
		}
	}
	shouldFallbackOnError(err) {
		return isMemoryEmbeddingOperationError(err);
	}
	hasRequestedTargetSessionSync(params) {
		return Boolean(params?.sessions?.some((session) => session.sessionId.trim().length > 0) || params?.archiveFiles?.some((sessionFile) => sessionFile.trim().length > 0));
	}
	resolveBatchConfig() {
		const batch = this.settings.remote?.batch;
		return {
			enabled: Boolean(batch?.enabled && this.provider && this.providerRuntime?.batchEmbed),
			wait: batch?.wait ?? true,
			concurrency: Math.max(1, batch?.concurrency ?? 2),
			pollIntervalMs: batch?.pollIntervalMs ?? 2e3,
			timeoutMs: resolveTimerTimeoutMs((batch?.timeoutMinutes ?? 60) * 60 * 1e3, 36e5)
		};
	}
	async activateFallbackProvider(reason) {
		if (this.closed) return false;
		const pending = this.fallbackProviderInitPromise;
		if (pending) return await pending;
		const activation = this.activateFallbackProviderOnce(reason);
		this.fallbackProviderInitPromise = activation;
		try {
			return await activation;
		} finally {
			if (this.fallbackProviderInitPromise === activation) this.fallbackProviderInitPromise = null;
		}
	}
	getPendingFallbackProviderInitialization() {
		return this.fallbackProviderInitPromise;
	}
	async activateFallbackProviderOnce(reason) {
		const currentProviderId = resolveFallbackCurrentProviderId({
			provider: this.provider,
			lifecycle: this.providerLifecycle
		});
		const fallbackRequest = resolveMemoryFallbackProviderRequest({
			cfg: this.cfg,
			settings: this.settings,
			currentProviderId
		});
		if (!fallbackRequest || !currentProviderId) return false;
		if (this.fallbackFrom) return false;
		const currentState = {
			provider: this.provider,
			fallbackFrom: this.fallbackFrom,
			fallbackReason: this.fallbackReason,
			providerUnavailableReason: void 0,
			providerRuntime: this.providerRuntime,
			lifecycle: this.providerLifecycle
		};
		this.providerLifecycle = {
			mode: "degraded",
			providerId: currentProviderId,
			reason
		};
		await this.retireCurrentProvider();
		if (this.closed) return false;
		let fallbackResult;
		try {
			fallbackResult = await createEmbeddingProvider({
				createProvider: this.createProvider,
				config: this.cfg,
				agentDir: resolveAgentDir(this.cfg, this.agentId),
				...this.acquireLocalService ? { acquireLocalService: this.acquireLocalService } : {},
				...fallbackRequest
			});
		} catch (err) {
			this.resetProviderInitializationForRetry();
			throw err;
		}
		if (!fallbackResult.provider) {
			this.resetProviderInitializationForRetry();
			return false;
		}
		const fallbackState = applyMemoryFallbackProviderState({
			current: currentState,
			fallbackFrom: currentProviderId,
			reason,
			result: fallbackResult
		});
		this.fallbackFrom = fallbackState.fallbackFrom;
		this.fallbackReason = fallbackState.fallbackReason;
		this.provider = fallbackState.provider;
		this.providerRuntime = fallbackState.providerRuntime;
		this.providerUnavailableReason = fallbackState.providerUnavailableReason;
		this.providerLifecycle = fallbackState.lifecycle;
		this.providerKey = this.computeProviderKey();
		this.batch = this.resolveBatchConfig();
		log$6.warn(`memory embeddings: switched to fallback provider (${fallbackRequest.provider})`, { reason });
		return true;
	}
	async runInPlaceReindex(params) {
		const dbPath = resolveUserPath(this.settings.store.databasePath);
		const tempDbPath = `${dbPath}.memory-reindex-${randomUUID()}`;
		const originalDb = this.db;
		const originalRetryState = this.snapshotReindexRetryState();
		const shouldRetryMemoryOnFailure = this.sources.has("memory");
		const shouldRetrySessionsOnFailure = this.shouldSyncSessions({
			reason: params.reason,
			force: params.force
		}, true);
		let shadowCleanup;
		try {
			await cleanupAgedMemoryReindexTempFiles(dbPath);
			const originalRevision = readMemoryDatabaseRevision(originalDb);
			const shadow = MemoryIndexDatabase.openShadow(tempDbPath, this.settings.store.vector.enabled);
			shadowCleanup = shadow;
			shadow.vector.enabled = this.vector.enabled;
			shadow.vector.extensionPath = this.vector.extensionPath;
			shadow.fts.enabled = this.fts.enabled;
			const rebuilt = await this.withReindexDatabase(shadow, async () => {
				try {
					await this.withDatabaseWrite(() => this.ensureSchema());
					const shouldSyncMemory = shouldRetryMemoryOnFailure;
					const shouldSyncSessions = shouldRetrySessionsOnFailure;
					if (this.shouldDeferSourceWideBatch()) {
						await this.executeSourceWideSync({
							shouldSyncMemory,
							shouldSyncSessions,
							needsFullReindex: true,
							progress: params.progress
						});
						if (shouldSyncSessions) this.clearSessionRetryState();
						else this.refreshSessionDirtyFlag();
					} else {
						if (shouldSyncMemory) await this.syncMemoryFiles({
							needsFullReindex: true,
							progress: params.progress
						});
						if (shouldSyncSessions) {
							await this.syncArchiveFiles({
								needsFullReindex: true,
								progress: params.progress
							});
							this.clearSessionRetryState();
						} else this.refreshSessionDirtyFlag();
					}
					if (!shouldSyncMemory) this.clearMemoryRetryState();
					const syncProvider = this.syncProviderGeneration ? this.syncProviderGeneration.provider : this.provider;
					const vectorIndexComplete = syncProvider === null || this.vector.available === true;
					const nextMeta = {
						model: syncProvider?.model ?? "fts-only",
						provider: syncProvider?.id ?? "none",
						providerKey: this.syncProviderGeneration ? this.syncProviderGeneration.providerKey : this.providerKey,
						sources: resolveConfiguredSourcesForMeta(this.sources),
						scopeHash: resolveConfiguredScopeHash({
							workspaceDir: this.workspaceDir,
							extraPaths: this.settings.extraPaths,
							multimodal: {
								enabled: this.settings.multimodal.enabled,
								modalities: this.settings.multimodal.modalities,
								maxFileBytes: this.settings.multimodal.maxFileBytes
							}
						}),
						chunkTokens: this.settings.chunking.tokens,
						chunkOverlap: this.settings.chunking.overlap,
						chunkingVersion: 5,
						ftsTokenizer: this.settings.store.fts.tokenizer,
						provenanceVersion: 1
					};
					if (this.vector.available && this.vector.dims) nextMeta.vectorDims = this.vector.dims;
					await this.withDatabaseWrite(() => this.writeMeta(nextMeta));
					return {
						nextMeta,
						vectorIndexComplete,
						hasVectors: tableExists(shadow.db, "main", MEMORY_INDEX_VECTOR_TABLE)
					};
				} finally {
					shadow.closed = true;
				}
			});
			await withMemoryWorkspaceLock(this.workspaceDir, async () => {
				await withMemoryIndexPublishGeneration(dbPath, async () => {
					await this.publishedDatabase.publishShadow({
						sourcePath: tempDbPath,
						sourceIdentity: readMemoryShadowIdentity(tempDbPath),
						metaKey: MEMORY_INDEX_META_KEY,
						expectedRevision: originalRevision,
						sourceHasVectors: rebuilt.hasVectors,
						vectorIndexComplete: rebuilt.vectorIndexComplete,
						extensionPath: shadow.vector.extensionPath
					}, () => {
						if (this.closed || this.publishedDatabase.closed || this.publishedDatabase.readOnly || this.publishedDatabase.db !== originalDb || !originalDb.isOpen) throw new Error("Memory publication owner changed before reindex publication");
						shadow.assertShadowPath();
					});
				});
			});
			this.database.lastMetaSerialized = null;
			this.resetVectorState();
			this.fts.available = shadow.fts.available;
			this.fts.loadError = shadow.fts.loadError;
			this.vector.dims = rebuilt.nextMeta.vectorDims;
			await this.pruneEmbeddingCacheIfNeeded();
		} catch (err) {
			this.restoreReindexRetryState(originalRetryState);
			this.markFailedFullReindexRetry({
				memory: shouldRetryMemoryOnFailure,
				sessions: shouldRetrySessionsOnFailure
			});
			throw err;
		} finally {
			try {
				if (shadowCleanup?.shadowReleased) {
					shadowCleanup.assertShadowPath();
					await removeMemoryDatabaseFiles(tempDbPath);
				}
			} catch (err) {
				log$6.warn(`failed to remove memory reindex shadow database: ${formatErrorMessage(err)}`);
			}
		}
	}
};
//#endregion
//#region extensions/memory-core/src/memory/manager-embedding-ops.ts
const EMBEDDING_CACHE_TABLE = MEMORY_EMBEDDING_CACHE_TABLE;
const EMBEDDING_CACHE_PRUNE_BATCH_SIZE = 100;
const EMBEDDING_BATCH_MAX_TOKENS = 8e3;
const EMBEDDING_INDEX_CONCURRENCY = 4;
const EMBEDDING_QUERY_TIMEOUT_REMOTE_MS = 6e4;
const EMBEDDING_QUERY_TIMEOUT_LOCAL_MS = 3e5;
const EMBEDDING_BATCH_TIMEOUT_REMOTE_MS = 12e4;
const EMBEDDING_BATCH_TIMEOUT_LOCAL_MS = 6e5;
const SOURCE_WIDE_BATCH_MAX_FILES = 2048;
const SOURCE_WIDE_BATCH_MAX_REQUESTS = 5e4;
const log$5 = createSubsystemLogger("memory");
function resolveEmbeddingSecondsTimeoutMs(seconds) {
	if (!Number.isFinite(seconds)) return MAX_TIMER_TIMEOUT_MS;
	const timeoutMs = Math.floor(seconds * 1e3);
	return resolveTimerTimeoutMs(Number.isFinite(timeoutMs) ? timeoutMs : MAX_TIMER_TIMEOUT_MS, MAX_TIMER_TIMEOUT_MS);
}
function countBatchSources(items) {
	const counts = {};
	for (const item of items) counts[item.source] = (counts[item.source] ?? 0) + 1;
	return counts;
}
function formatBatchSourceLabel(counts) {
	const sources = Object.keys(counts).toSorted();
	return sources.length > 0 ? sources.join("+") : "unknown";
}
function formatBatchSourceCounts(counts) {
	return Object.entries(counts).toSorted(([left], [right]) => left.localeCompare(right)).map(([source, count]) => `${source}=${count}`).join(",") || "none";
}
function splitSourceWideEmbeddingChunks(chunks, maxRequests) {
	return chunkItems(chunks, Math.max(1, Math.floor(maxRequests)));
}
function resolveEmbeddingTimeoutMs(params) {
	if (params.kind === "query") {
		const runtimeTimeoutMs = params.providerRuntime?.inlineQueryTimeoutMs;
		if (typeof runtimeTimeoutMs === "number" && runtimeTimeoutMs > 0) return resolveTimerTimeoutMs(runtimeTimeoutMs, EMBEDDING_QUERY_TIMEOUT_REMOTE_MS);
		return params.providerId === "local" ? EMBEDDING_QUERY_TIMEOUT_LOCAL_MS : EMBEDDING_QUERY_TIMEOUT_REMOTE_MS;
	}
	const configuredTimeoutSeconds = params.configuredBatchTimeoutSeconds;
	if (typeof configuredTimeoutSeconds === "number" && configuredTimeoutSeconds > 0) return resolveEmbeddingSecondsTimeoutMs(configuredTimeoutSeconds);
	const runtimeTimeoutMs = params.providerRuntime?.inlineBatchTimeoutMs;
	if (typeof runtimeTimeoutMs === "number" && runtimeTimeoutMs > 0) return resolveTimerTimeoutMs(runtimeTimeoutMs, EMBEDDING_BATCH_TIMEOUT_REMOTE_MS);
	return params.providerId === "local" ? EMBEDDING_BATCH_TIMEOUT_LOCAL_MS : EMBEDDING_BATCH_TIMEOUT_REMOTE_MS;
}
function resolveMemoryIndexConcurrency(params) {
	if (params.batch.enabled) return params.batch.concurrency;
	const configured = params.configuredNonBatchConcurrency;
	if (typeof configured === "number" && Number.isFinite(configured)) return Math.max(1, Math.floor(configured));
	return params.providerId === "ollama" ? 1 : EMBEDDING_INDEX_CONCURRENCY;
}
async function runEmbeddingOperationWithTimeout(params) {
	const controller = new AbortController();
	const signal = params.signal ? AbortSignal.any([params.signal, controller.signal]) : controller.signal;
	if (!Number.isFinite(params.timeoutMs) || params.timeoutMs <= 0) return await params.run(signal);
	const timeoutMs = resolveTimerTimeoutMs(params.timeoutMs, 1);
	const timeoutError = new Error(params.message);
	let remainingMs = timeoutMs;
	let segmentStartedAt = Date.now();
	let paused = false;
	let timer = null;
	let rejectTimeout;
	const timeoutPromise = new Promise((_, reject) => {
		rejectTimeout = reject;
	});
	const armWatchdog = () => {
		segmentStartedAt = Date.now();
		timer = setTimeout(() => {
			timer = null;
			rejectTimeout(timeoutError);
			controller.abort(timeoutError);
		}, remainingMs);
	};
	const unsubscribe = params.deadlineControl?.subscribe((action) => {
		if (action === "pause") {
			paused = true;
			if (timer) {
				clearTimeout(timer);
				timer = null;
			}
			remainingMs = Math.max(0, remainingMs - (Date.now() - segmentStartedAt));
			if (remainingMs === 0) {
				rejectTimeout(timeoutError);
				controller.abort(timeoutError);
			}
			return;
		}
		paused = false;
		if (!signal.aborted) armWatchdog();
	});
	if (!paused) armWatchdog();
	try {
		const operation = params.run(signal);
		const result = await Promise.race([operation, timeoutPromise]);
		params.signal?.throwIfAborted();
		if (!paused && Date.now() - segmentStartedAt >= remainingMs) {
			controller.abort(timeoutError);
			throw timeoutError;
		}
		return result;
	} finally {
		unsubscribe?.();
		if (timer) clearTimeout(timer);
	}
}
var MemoryManagerEmbeddingOps = class extends MemoryManagerSyncOps {
	constructor(..._args) {
		super(..._args);
		this.batchFailureLimit = 2;
		this.batchFailure = { count: 0 };
		this.activeProviderUses = /* @__PURE__ */ new Map();
		this.providerIdleWaiters = /* @__PURE__ */ new Map();
		this.syncProviderGenerationRelease = null;
		this.syncProviderGenerationOwners = 0;
	}
	acquireProviderUse(provider) {
		this.activeProviderUses.set(provider, (this.activeProviderUses.get(provider) ?? 0) + 1);
		let released = false;
		return () => {
			if (released) return;
			released = true;
			const remaining = (this.activeProviderUses.get(provider) ?? 1) - 1;
			if (remaining > 0) {
				this.activeProviderUses.set(provider, remaining);
				return;
			}
			this.activeProviderUses.delete(provider);
			const waiters = this.providerIdleWaiters.get(provider);
			this.providerIdleWaiters.delete(provider);
			for (const resolve of waiters ?? []) resolve();
		};
	}
	async withProviderUse(provider, run) {
		const release = this.acquireProviderUse(provider);
		try {
			return await run();
		} finally {
			release();
		}
	}
	async awaitProviderIdle(provider) {
		if (!this.activeProviderUses.has(provider)) return;
		await new Promise((resolve) => {
			const waiters = this.providerIdleWaiters.get(provider) ?? /* @__PURE__ */ new Set();
			waiters.add(resolve);
			this.providerIdleWaiters.set(provider, waiters);
		});
	}
	beginSyncProviderGeneration(options) {
		if (this.syncProviderGeneration) {
			this.syncProviderGenerationOwners += 1;
			return;
		}
		const provider = options?.forceFtsOnly ? null : this.provider;
		const runtime = provider ? this.providerRuntime : void 0;
		const identities = resolveMemoryIndexProviderIdentities({
			provider,
			cacheKeyData: runtime?.cacheKeyData,
			aliases: runtime?.indexIdentityAliases
		});
		const providerKey = expectDefined(identities.at(0), "primary memory provider identity").providerKey;
		const database = this.database;
		this.syncProviderGeneration = provider ? {
			kind: "semantic",
			database,
			databaseRevision: readMemoryDatabaseRevision(database.db),
			cacheWritesInvalidated: false,
			provider,
			...runtime ? { runtime } : {},
			providerKey,
			identities
		} : {
			kind: "fts-only",
			database,
			databaseRevision: readMemoryDatabaseRevision(database.db),
			cacheWritesInvalidated: false,
			provider: null,
			providerKey,
			identities
		};
		this.syncProviderGenerationRelease = provider ? this.acquireProviderUse(provider) : null;
		this.syncProviderGenerationOwners = 1;
	}
	endSyncProviderGeneration() {
		if (this.syncProviderGenerationOwners > 1) {
			this.syncProviderGenerationOwners -= 1;
			return;
		}
		this.syncProviderGenerationOwners = 0;
		this.syncProviderGeneration = null;
		this.syncProviderGenerationRelease?.();
		this.syncProviderGenerationRelease = null;
	}
	async pruneEmbeddingCacheIfNeeded() {
		const max = this.cache.maxEntries;
		if (!this.cache.enabled || !max || max <= 0) return;
		const count = this.db.prepare(`SELECT COUNT(*) as c FROM ${EMBEDDING_CACHE_TABLE}`);
		const excess = () => Number(count.get()?.c ?? 0) - max;
		const remove = this.db.prepare(`DELETE FROM ${EMBEDDING_CACHE_TABLE} WHERE rowid IN (
         SELECT rowid FROM ${EMBEDDING_CACHE_TABLE} ORDER BY updated_at ASC LIMIT ?
       )`);
		while (excess() > 0) {
			await runSqliteImmediateTransaction(this.db, async () => () => {
				const currentExcess = excess();
				if (currentExcess > 0) remove.run(Math.min(currentExcess, EMBEDDING_CACHE_PRUNE_BATCH_SIZE));
			}, void 0, (write) => this.withDatabaseWrite(write));
			await new Promise((resolve) => {
				setImmediate(resolve);
			});
		}
	}
	async embedChunksInBatches(candidates, generation) {
		const chunks = candidates.map((candidate) => candidate.chunk);
		if (chunks.length === 0) return [];
		const { embeddings, missing } = this.collectCachedEmbeddings(chunks, generation);
		if (missing.length === 0) return embeddings;
		const missingCandidates = missing.map((item) => expectDefined(candidates[item.index], "missing memory embedding candidate"));
		const batches = buildMemoryEmbeddingBatches(missingCandidates.map((candidate) => candidate.chunk), EMBEDDING_BATCH_MAX_TOKENS);
		let cursor = 0;
		for (const batchChunks of batches) {
			const batchCandidates = missingCandidates.slice(cursor, cursor + batchChunks.length);
			const inputs = buildTextEmbeddingInputs(batchChunks);
			const hasStructuredInputs = inputs.some((input) => hasNonTextEmbeddingParts(input));
			const batchEmbeddings = await this.embedBatchWithRetry(hasStructuredInputs ? inputs : batchChunks.map((chunk) => chunk.text), generation, batchCandidates);
			for (let i = 0; i < batchChunks.length; i += 1) {
				const item = missing[cursor + i];
				const embedding = batchEmbeddings[i] ?? [];
				if (item) embeddings[item.index] = embedding;
			}
			cursor += batchChunks.length;
		}
		return embeddings;
	}
	computeProviderKey() {
		return expectDefined(this.resolveProviderIndexIdentities().at(0), "primary memory provider identity").providerKey;
	}
	resolveProviderIndexIdentities() {
		return resolveMemoryIndexProviderIdentities({
			provider: this.provider,
			cacheKeyData: this.providerRuntime?.cacheKeyData,
			aliases: this.providerRuntime?.indexIdentityAliases
		});
	}
	buildBatchDebug(source, chunks, context = {}) {
		return (message, data) => log$5.debug(message, data ? {
			...data,
			source,
			chunks: chunks.length,
			...context
		} : {
			source,
			chunks: chunks.length,
			...context
		});
	}
	async embedChunksWithBatch(candidates, source, generation, debugContext = {}) {
		const chunks = candidates.map((candidate) => candidate.chunk);
		const provider = generation.provider;
		const batchEmbed = generation.runtime?.batchEmbed;
		if (!batchEmbed) return this.embedChunksInBatches(candidates, generation);
		if (chunks.length === 0) return [];
		const { embeddings, missing } = this.collectCachedEmbeddings(chunks, generation);
		if (missing.length === 0) return embeddings;
		const missingCandidates = missing.map((item) => expectDefined(candidates[item.index], "missing memory embedding candidate"));
		const missingChunks = missingCandidates.map((candidate) => candidate.chunk);
		const batchResult = await this.runBatchWithFallback({
			provider: provider.id,
			run: async () => await batchEmbed({
				agentId: this.agentId,
				chunks: missingChunks,
				wait: this.batch.wait,
				concurrency: this.batch.concurrency,
				pollIntervalMs: this.batch.pollIntervalMs,
				timeoutMs: this.batch.timeoutMs,
				debug: this.buildBatchDebug(source, chunks, debugContext)
			}),
			fallback: async () => await this.embedChunksInBatches(missingCandidates, generation)
		});
		const batchEmbeddings = batchResult.value;
		if (!batchEmbeddings) return this.embedChunksInBatches(candidates, generation);
		if (batchResult.kind === "batch") await this.persistGeneratedEmbeddings(missingCandidates, batchEmbeddings, generation);
		for (let index = 0; index < missing.length; index += 1) {
			const item = missing[index];
			const embedding = batchEmbeddings[index] ?? [];
			if (!item) continue;
			embeddings[item.index] = embedding;
		}
		return embeddings;
	}
	collectCachedEmbeddings(chunks, generation) {
		const cached = loadMemoryEmbeddingCache({
			db: generation.database.db,
			enabled: this.cache.enabled,
			providerIdentities: generation.identities,
			hashes: chunks.map((chunk) => chunk.hash)
		});
		for (const [hash, embedding] of cached) if (!isValidMemoryEmbedding(embedding, generation.embeddingDimensions)) cached.delete(hash);
		else generation.embeddingDimensions ??= embedding.length;
		return collectMemoryCachedEmbeddings({
			chunks,
			cached
		});
	}
	async embedBatchWithRetry(inputs, generation, cacheCandidates) {
		if (inputs.length === 0) return [];
		const provider = generation?.provider ?? this.provider;
		if (!provider) throw new Error("Cannot embed batch in FTS-only mode (no embedding provider)");
		const structured = inputs.some((input) => typeof input !== "string");
		const label = structured ? "structured batch" : "batch";
		const requestItems = inputs.map((input, index) => ({
			input,
			cacheCandidate: cacheCandidates?.[index]
		}));
		try {
			return await this.withProviderUse(provider, async () => await runMemoryEmbeddingBatchRetryWithSplit({
				profile: "index",
				items: requestItems,
				run: async (batchItems) => {
					const timeoutMs = this.resolveEmbeddingTimeout("batch", provider, generation?.runtime);
					log$5.debug(`memory embeddings: ${label} start`, {
						provider: provider.id,
						items: batchItems.length,
						timeoutMs
					});
					const result = await runEmbeddingOperationWithTimeout({
						timeoutMs,
						message: `memory embeddings batch timed out after ${Math.round(timeoutMs / 1e3)}s`,
						run: async (signal) => await provider.embedBatch(batchItems.map((item) => item.input), {
							signal,
							inputType: "document"
						})
					});
					if (!structured) log$5.debug("memory embeddings: batch completed", {
						provider: provider.id,
						items: batchItems.length
					});
					return result;
				},
				onSuccess: async (batchItems, batchEmbeddings) => {
					if (!generation) return;
					const batchCandidates = batchItems.flatMap((item) => item.cacheCandidate ? [item.cacheCandidate] : []);
					if (batchCandidates.length !== batchItems.length) return;
					await this.persistGeneratedEmbeddings(batchCandidates, batchEmbeddings, generation);
				},
				isSplittable: isSplittableMemoryEmbeddingBatchError,
				waitForRetry: async (delayMs) => {
					await this.waitForEmbeddingRetry(delayMs, structured ? "retrying structured batch" : "retrying");
				},
				onSplit: ({ itemCount, splitAt }) => {
					log$5.warn(`memory embeddings ${label} failed; splitting ${itemCount} inputs into ${splitAt} + ${itemCount - splitAt}`);
				}
			}));
		} catch (err) {
			if (!structured) log$5.debug("memory embeddings: batch failed", {
				provider: provider.id,
				error: formatErrorMessage(err)
			});
			this.markLocalEmbeddingProviderDegraded(err);
			throw createMemoryEmbeddingOperationError({
				operation: structured ? "structured-batch" : "batch",
				providerId: provider.id,
				cause: err
			});
		}
	}
	async withGeneratedEmbeddingCacheWrite(generation, write) {
		await this.withPublishedDatabase(async () => {
			if (this.syncProviderGeneration !== generation || generation.cacheWritesInvalidated || generation.database.closed || this.database !== generation.database) return;
			await this.withDatabaseWrite(() => runSqliteImmediateTransactionSync(generation.database.db, () => {
				if (this.syncProviderGeneration !== generation || generation.cacheWritesInvalidated || generation.database.closed) return;
				if (readMemoryDatabaseRevision(generation.database.db) !== generation.databaseRevision) {
					generation.cacheWritesInvalidated = true;
					return;
				}
				write();
			}));
		});
	}
	async persistGeneratedEmbeddings(candidates, embeddings, generation) {
		if (!this.cache.enabled || candidates.length === 0 || this.syncProviderGeneration !== generation || generation.cacheWritesInvalidated || generation.database.closed) return;
		const dimensions = generation.embeddingDimensions ?? embeddings[0]?.length;
		if (embeddings.length !== candidates.length || !embeddings.every((embedding) => isValidMemoryEmbedding(embedding, dimensions))) {
			if (generation.embeddingDimensions !== void 0 && embeddings.some((embedding) => isValidMemoryEmbedding(embedding) && embedding.length !== generation.embeddingDimensions)) await withMemoryWorkspaceLock(this.workspaceDir, () => this.withGeneratedEmbeddingCacheWrite(generation, () => {
				clearMemoryEmbeddingCacheIdentities(generation.database.db, generation.identities);
				generation.cacheWritesInvalidated = true;
			}));
			throw new Error("memory embeddings: malformed vector response (count, dimensions, or coordinates)");
		}
		generation.embeddingDimensions = dimensions;
		await withMemoryWorkspaceLock(this.workspaceDir, async () => {
			if (this.syncProviderGeneration !== generation || generation.cacheWritesInvalidated || generation.database.closed) return;
			const entryValidity = /* @__PURE__ */ new Map();
			const accepted = [];
			for (const [index, candidate] of candidates.entries()) {
				let valid = entryValidity.get(candidate.entry);
				if (valid === void 0) {
					if (candidate.source === "memory") valid = (await (this.memoryFiles?.inspectFile ?? buildFileEntry)(candidate.entry.absPath, this.workspaceDir, this.settings.multimodal))?.hash === candidate.entry.hash;
					else {
						const sessionId = candidate.entry.sessionId;
						valid = Boolean(sessionId && !hasMemorySessionTombstone(generation.database.db, this.agentId, sessionId));
					}
					entryValidity.set(candidate.entry, valid);
				}
				if (valid) accepted.push({
					hash: candidate.chunk.hash,
					embedding: embeddings[index] ?? []
				});
			}
			if (accepted.length === 0) return;
			await this.withGeneratedEmbeddingCacheWrite(generation, () => {
				upsertMemoryEmbeddingCache({
					db: generation.database.db,
					enabled: true,
					provider: generation.provider,
					providerKey: generation.providerKey,
					entries: accepted,
					maxEntries: this.cache.maxEntries
				});
			});
		});
	}
	async waitForEmbeddingRetry(delayMs, action, signal) {
		log$5.warn(`memory embeddings retryable error; ${action} in ${delayMs}ms`);
		await sleepWithAbort(delayMs, signal);
	}
	resolveEmbeddingTimeout(kind, provider = this.provider, providerRuntime = this.providerRuntime) {
		return resolveEmbeddingTimeoutMs({
			kind,
			providerId: provider?.id,
			providerRuntime,
			configuredBatchTimeoutSeconds: this.settings.sync.embeddingBatchTimeoutSeconds
		});
	}
	async embedQueryWithRetry(text, signal, providerOverride, markDegraded = true, providerRuntimeOverride, deadlineControl) {
		const provider = providerOverride ?? this.provider;
		const providerRuntime = providerOverride ? providerRuntimeOverride : this.providerRuntime;
		if (!provider) throw new Error("Cannot embed query in FTS-only mode (no embedding provider)");
		try {
			return await this.withProviderUse(provider, async () => await runMemoryEmbeddingRetryLoop({
				profile: "query",
				run: async () => {
					signal?.throwIfAborted();
					const timeoutMs = this.resolveEmbeddingTimeout("query", provider, providerRuntime);
					log$5.debug("memory embeddings: query start", {
						provider: provider.id,
						timeoutMs
					});
					return await runEmbeddingOperationWithTimeout({
						timeoutMs,
						message: `memory embeddings query timed out after ${Math.round(timeoutMs / 1e3)}s`,
						signal,
						deadlineControl,
						run: async (opSignal) => await provider.embed(text, {
							signal: opSignal,
							inputType: "query",
							...deadlineControl ? { [MEMORY_SEARCH_DEADLINE_CONTROL]: deadlineControl } : {}
						})
					});
				},
				signal,
				waitForRetry: async (delayMs) => {
					await this.waitForEmbeddingRetry(delayMs, "retrying query", signal);
				}
			}));
		} catch (err) {
			if (markDegraded) this.markLocalEmbeddingProviderDegraded(err);
			throw createMemoryEmbeddingOperationError({
				operation: "query",
				providerId: provider.id,
				cause: err
			});
		}
	}
	async withTimeout(promise, timeoutMs, message) {
		return await runEmbeddingOperationWithTimeout({
			timeoutMs,
			message,
			run: () => promise
		});
	}
	async runBatchWithTimeoutRetry(params) {
		try {
			return {
				kind: "success",
				value: await params.run()
			};
		} catch (error) {
			if (!/timed out|timeout/i.test(formatErrorMessage(error))) return {
				kind: "failure",
				error,
				attempts: 1
			};
		}
		log$5.warn(`memory embeddings: ${params.provider} batch timed out; retrying once`);
		try {
			return {
				kind: "success",
				value: await params.run()
			};
		} catch (error) {
			return {
				kind: "failure",
				error,
				attempts: 2
			};
		}
	}
	async runBatchWithFallback(params) {
		if (!this.batch.enabled) return {
			kind: "fallback",
			value: await params.fallback()
		};
		const result = await this.runBatchWithTimeoutRetry({
			provider: params.provider,
			run: params.run
		});
		if (result.kind === "success") {
			if (this.batchFailure.count > 0) log$5.debug("memory embeddings: batch recovered; resetting failure count");
			this.batchFailure = { count: 0 };
			return {
				kind: "batch",
				value: result.value
			};
		}
		const message = formatErrorMessage(result.error);
		const forceDisable = isEmbeddingBatchUnavailableError(result.error);
		if (this.batch.enabled) {
			const count = this.batchFailure.count + (forceDisable ? this.batchFailureLimit : result.attempts);
			this.batchFailure = {
				count,
				lastError: message,
				lastProvider: params.provider
			};
			this.batch.enabled = !(forceDisable || count >= this.batchFailureLimit);
		}
		const suffix = this.batch.enabled ? "keeping batch enabled" : "disabling batch";
		log$5.warn(`memory embeddings: ${params.provider} batch failed (${this.batchFailure.count}/${this.batchFailureLimit}); ${suffix}; falling back to non-batch embeddings: ${message}`);
		return {
			kind: "fallback",
			value: await params.fallback()
		};
	}
	getIndexConcurrency() {
		return resolveMemoryIndexConcurrency({
			batch: this.batch,
			configuredNonBatchConcurrency: this.settings.remote?.nonBatchConcurrency,
			providerId: this.syncProviderGeneration ? this.syncProviderGeneration.provider?.id : this.provider?.id
		});
	}
	async writeChunks({ entry, source, chunks }, generation, embeddings, vectorReady) {
		await withMemoryWorkspaceLock(this.workspaceDir, async () => {
			const database = this.database;
			const assertCurrent = () => {
				this.memoryFiles?.assertCurrent();
				if (this.closed || database.closed || !database.db.isOpen || this.database !== database || generation && (generation.database !== this.publishedDatabase || generation.database.closed || !generation.database.db.isOpen || this.syncProviderGeneration !== generation)) throw new Error("Memory source owner changed before replacement");
				if (source === "sessions" && hasMemorySessionTombstone((generation?.database ?? database).db, this.agentId, expectDefined(entry.sessionId, "memory index session identity"))) {
					this.markFailedFullReindexRetry({
						memory: false,
						sessions: true
					});
					throw new Error("A session was forgotten while memory indexing was running; retry the memory index.");
				}
			};
			const createReplacement = () => ({
				entry: {
					path: entry.path,
					hash: entry.hash,
					mtimeMs: entry.mtimeMs,
					size: entry.size
				},
				chunks,
				embeddings,
				model: generation?.provider?.model ?? "fts-only",
				now: Date.now(),
				vectorReady,
				...source === "sessions" ? {
					source,
					agentId: this.agentId,
					sessionId: expectDefined(entry.sessionId, "memory index session identity")
				} : { source }
			});
			const prepare = async () => {
				if (source === "memory") {
					if ((await (this.memoryFiles?.inspectFile ?? buildFileEntry)(entry.absPath, this.workspaceDir, this.settings.multimodal))?.hash !== entry.hash) {
						this.dirty = true;
						log$5.debug("memory source changed while indexing; queued incremental retry", { path: entry.path });
						return false;
					}
				}
				assertCurrent();
				return true;
			};
			const published = await database.replaceSource(createReplacement(), assertCurrent, prepare);
			if (!published) return;
			if (generation && database === generation.database) {
				if (published.beforeRevision !== generation.databaseRevision) generation.cacheWritesInvalidated = true;
				generation.databaseRevision = published.databaseRevision;
			}
			this.database.vectorDegradedWriteWarningShown = logMemoryVectorDegradedWrite({
				vectorEnabled: this.vector.enabled,
				vectorReady,
				chunkCount: chunks.length,
				warningShown: this.database.vectorDegradedWriteWarningShown,
				loadError: this.vector.loadError,
				warn: (message) => log$5.warn(message)
			});
		});
	}
	async prepareIndexEntry(entry, options, generation) {
		const source = options.source;
		const kind = entry.kind;
		const suppliedContent = options.content ?? entry.content;
		const prepare = async () => {
			if (kind === "multimodal") {
				const multimodalChunk = await (this.memoryFiles?.buildMultimodalChunk ?? buildMultimodalChunkForIndexing)(entry);
				if (!multimodalChunk) {
					this.dirty = true;
					await this.deleteIndexedFile(entry.path, source);
					return null;
				}
				const pathClassification = await resolveMemoryPathClassification({
					absolutePath: entry.absPath,
					source,
					workspaceDir: this.workspaceDir,
					readSource: this.memoryFiles ? multimodalChunk : void 0
				});
				const chunk = {
					...multimodalChunk.chunk,
					importance: null,
					triggers: null,
					projectKey: null
				};
				chunk.provenance = resolveChunkProvenance(entry, source, chunk, pathClassification.originClass);
				return {
					entry,
					source,
					chunks: [chunk],
					structuredInputBytes: multimodalChunk.structuredInputBytes
				};
			}
			const read = await readMemoryIndexSource({
				absolutePath: entry.absPath,
				workspaceDir: this.workspaceDir,
				source,
				suppliedContent,
				memoryFiles: this.memoryFiles
			});
			if (!read) {
				this.dirty = true;
				return null;
			}
			const cutoff = readSessionResetRecallCutoffMetadata(entry);
			const prepared = await prepareMemoryIndexInWorker({
				entry: {
					path: entry.path,
					mtimeMs: entry.mtimeMs,
					lineMap: entry.lineMap,
					lineProvenance: entry.lineProvenance
				},
				source,
				content: read.content,
				pathClassification: read.pathClassification,
				chunking: this.settings.chunking,
				cutoffLine: cutoff.state === "valid" ? cutoff.cutoffLine : void 0,
				provider: generation?.kind === "semantic" ? {
					id: generation.provider.id,
					maxInputTokens: generation.provider.maxInputTokens
				} : void 0,
				hardMaxInputTokens: EMBEDDING_BATCH_MAX_TOKENS
			});
			return {
				entry: prepared.contentHash !== void 0 ? {
					...entry,
					hash: prepared.contentHash
				} : entry,
				source,
				chunks: prepared.chunks
			};
		};
		return source === "sessions" && kind !== "multimodal" && typeof suppliedContent === "string" ? withMemoryWorkspacePreparation(this.workspaceDir, prepare) : withMemoryWorkspaceLock(this.workspaceDir, prepare);
	}
	async indexFiles(items) {
		if (items.length === 0) return;
		this.beginSyncProviderGeneration();
		try {
			await this.indexFilesWithGeneration(items, this.syncProviderGeneration);
		} finally {
			this.endSyncProviderGeneration();
		}
	}
	async indexFilesWithGeneration(items, generation) {
		const batchEmbed = generation?.kind === "semantic" ? generation.runtime?.batchEmbed : void 0;
		if (generation?.kind !== "semantic" || !this.batch.enabled || !batchEmbed || generation.runtime?.sourceWideBatchEmbed !== true) {
			await runMemoryHostTasksWithConcurrency(items.map((item) => async () => await this.indexFileWithGeneration(item.entry, { source: item.source }, generation)), this.getIndexConcurrency());
			return;
		}
		const itemSourceCounts = countBatchSources(items);
		log$5.debug(`memory embeddings: source-wide batch prepare files=${items.length} sources=${formatBatchSourceCounts(itemSourceCounts)} maxFiles=${SOURCE_WIDE_BATCH_MAX_FILES} maxRequests=${SOURCE_WIDE_BATCH_MAX_REQUESTS}`, {
			files: items.length,
			sources: itemSourceCounts,
			maxFiles: SOURCE_WIDE_BATCH_MAX_FILES,
			maxRequests: SOURCE_WIDE_BATCH_MAX_REQUESTS
		});
		let prepared = [];
		let preparedRequestCount = 0;
		let sourceWideBatchGroup = 0;
		const flushPrepared = async (reason) => {
			if (prepared.length === 0) return;
			const current = prepared;
			const candidates = current.flatMap((item) => item.chunks.map((chunk) => ({
				chunk,
				entry: item.entry,
				source: item.source
			})));
			const chunks = candidates.map((candidate) => candidate.chunk);
			const sourceCounts = countBatchSources(current);
			const source = formatBatchSourceLabel(sourceCounts);
			sourceWideBatchGroup += 1;
			const chunkBatches = splitSourceWideEmbeddingChunks(candidates, SOURCE_WIDE_BATCH_MAX_REQUESTS);
			log$5.debug(`memory embeddings: source-wide batch submit group=${sourceWideBatchGroup} source=${source} files=${current.length} chunks=${chunks.length} requests=${chunkBatches.length} sources=${formatBatchSourceCounts(sourceCounts)} reason=${reason}`, {
				source,
				files: current.length,
				chunks: chunks.length,
				requests: chunkBatches.length,
				sources: sourceCounts,
				group: sourceWideBatchGroup,
				reason,
				maxFiles: SOURCE_WIDE_BATCH_MAX_FILES,
				maxRequests: SOURCE_WIDE_BATCH_MAX_REQUESTS
			});
			const embeddings = [];
			for (let requestIndex = 0; requestIndex < chunkBatches.length; requestIndex += 1) {
				const chunkBatch = chunkBatches[requestIndex] ?? [];
				embeddings.push(...await this.embedChunksWithBatch(chunkBatch, source, generation, {
					sourceWideFiles: current.length,
					sourceWideSources: sourceCounts,
					sourceWideBatchGroup,
					sourceWideRequestGroup: requestIndex + 1,
					sourceWideRequestGroups: chunkBatches.length
				}));
			}
			const sample = embeddings.find((embedding) => embedding.length > 0);
			const vectorReady = sample ? await this.ensureVectorReady(sample.length) : false;
			let offset = 0;
			for (const item of current) {
				const fileEmbeddings = embeddings.slice(offset, offset + item.chunks.length);
				offset += item.chunks.length;
				await this.writeChunks(item, generation, fileEmbeddings, vectorReady);
			}
			prepared = [];
			preparedRequestCount = 0;
		};
		for (const item of items) {
			if ("kind" in item.entry && item.entry.kind === "multimodal") {
				await this.indexFileWithGeneration(item.entry, { source: item.source }, generation);
				continue;
			}
			const preparedEntry = await this.prepareIndexEntry(item.entry, { source: item.source }, generation);
			if (!preparedEntry) continue;
			const nextWouldExceedFiles = prepared.length >= SOURCE_WIDE_BATCH_MAX_FILES;
			const nextWouldExceedRequests = preparedRequestCount + preparedEntry.chunks.length > SOURCE_WIDE_BATCH_MAX_REQUESTS;
			if (prepared.length > 0 && (nextWouldExceedFiles || nextWouldExceedRequests)) await flushPrepared(nextWouldExceedFiles ? "max-files" : "max-requests");
			prepared.push(preparedEntry);
			preparedRequestCount += preparedEntry.chunks.length;
			if (prepared.length >= SOURCE_WIDE_BATCH_MAX_FILES || preparedRequestCount >= SOURCE_WIDE_BATCH_MAX_REQUESTS) await flushPrepared(prepared.length >= SOURCE_WIDE_BATCH_MAX_FILES ? "max-files" : "max-requests");
		}
		await flushPrepared("end");
	}
	async indexFile(entry, options) {
		this.beginSyncProviderGeneration();
		try {
			await this.indexFileWithGeneration(entry, options, this.syncProviderGeneration);
		} finally {
			this.endSyncProviderGeneration();
		}
	}
	async indexFileWithGeneration(entry, options, generation) {
		if (generation?.kind !== "semantic" && "kind" in entry && entry.kind === "multimodal") return;
		const prepared = await this.prepareIndexEntry(entry, options, generation);
		if (!prepared) return;
		if (generation?.kind !== "semantic") {
			await this.writeChunks(prepared, generation, [], false);
			return;
		}
		let embeddings;
		try {
			embeddings = this.batch.enabled ? await this.embedChunksWithBatch(prepared.chunks.map((chunk) => ({
				chunk,
				entry: prepared.entry,
				source: prepared.source
			})), options.source, generation) : await this.embedChunksInBatches(prepared.chunks.map((chunk) => ({
				chunk,
				entry: prepared.entry,
				source: prepared.source
			})), generation);
		} catch (err) {
			const message = formatErrorMessage(err);
			if ("kind" in entry && entry.kind === "multimodal" && /(413|payload too large|request too large|input too large|too many tokens|input limit|request size)/i.test(message)) {
				log$5.warn("memory embeddings: skipping multimodal file rejected as too large", {
					path: entry.path,
					bytes: prepared.structuredInputBytes,
					provider: generation.provider.id,
					model: generation.provider.model,
					error: message
				});
				await this.writeChunks({
					...prepared,
					chunks: []
				}, generation, [], false);
				return;
			}
			throw err;
		}
		const sample = embeddings.find((embedding) => embedding.length > 0);
		const vectorReady = sample ? await this.ensureVectorReady(sample.length) : false;
		await this.writeChunks(prepared, generation, embeddings, vectorReady);
	}
};
//#endregion
//#region extensions/memory-core/src/memory/manager-provider-lifecycle.ts
const EMBEDDING_PROBE_CACHE_TTL_MS = 3e4;
const log$4 = createSubsystemLogger("memory");
function resolveEffectiveMemorySearchSettings(settings) {
	if (settings.provider !== "none" || !settings.store.vector.enabled) return settings;
	return {
		...settings,
		store: {
			...settings.store,
			vector: {
				...settings.store.vector,
				enabled: false
			}
		}
	};
}
function resolveConfiguredMemoryEmbeddingProvider(params) {
	return resolveAgentConfig(params.cfg, normalizeAgentId(params.agentId))?.memory?.search?.provider ?? params.cfg.memory?.search?.provider;
}
function resolveMemoryEmbeddingProviderRequirement(params) {
	const configuredProvider = resolveConfiguredMemoryEmbeddingProvider(params)?.trim();
	if (params.settings.provider === "none" || configuredProvider === "none") return {
		mode: "fts-only",
		provider: params.settings.provider
	};
	const adapterTransport = resolveEmbeddingProviderAdapterTransport(params.settings.provider, params.cfg);
	if (!configuredProvider || configuredProvider === "auto" || adapterTransport === "local") return {
		mode: "optional",
		provider: params.settings.provider
	};
	return {
		mode: "required",
		provider: params.settings.provider,
		configuredProvider
	};
}
var MemoryProviderLifecycle = class extends MemoryManagerEmbeddingOps {
	applyProviderResult(providerResult) {
		const providerState = resolveMemoryProviderState(providerResult);
		this.provider = providerState.provider;
		this.fallbackFrom = providerState.fallbackFrom;
		this.fallbackReason = providerState.fallbackReason;
		this.providerUnavailableReason = providerState.providerUnavailableReason;
		this.providerLifecycle = providerState.lifecycle;
		this.providerRuntime = providerState.providerRuntime;
		this.providerInitialized = true;
	}
	markEmbeddingBootstrapFailure(err, options) {
		if (err instanceof MemoryManagerReloadError) throw err;
		const rawErrorName = readErrorName(err).trim();
		const errorName = /^[A-Za-z][A-Za-z0-9_.-]{0,63}$/.test(rawErrorName) ? rawErrorName : "";
		const message = redactSensitiveText(formatErrorMessage(err), { mode: "tools" }).trim() || "embedding provider initialization failed";
		const reason = redactSensitiveText(errorName && errorName !== "Error" ? `${errorName}: ${message}` : message, { mode: "tools" });
		const provider = options?.provider ?? this.provider?.id ?? this.settings.provider;
		const debug = {
			ok: false,
			provider,
			reason,
			degradedTo: "keyword-only"
		};
		if (!options?.retainProvider) {
			this.provider = null;
			this.providerRuntime = void 0;
		}
		this.providerInitialized = true;
		this.providerUnavailableReason = reason;
		this.providerLifecycle = createDegradedMemoryProviderLifecycle({
			providerId: provider,
			reason
		});
		this.embeddingBootstrapFailure = debug;
		this.providerKey = this.computeProviderKey();
		this.batch = this.resolveBatchConfig();
		this.vector.semanticAvailable = false;
		this.cacheProbeResult({
			ok: false,
			error: reason
		});
		return debug;
	}
	async ensureEmbeddingProviderForSearch(initialIndexState, onDebug) {
		let indexState = initialIndexState;
		const failure = this.embeddingBootstrapFailure;
		if (failure) {
			if (this.getCachedEmbeddingAvailability()?.ok === false) {
				onDebug?.({
					backend: "builtin",
					embeddingBootstrap: failure
				});
				return true;
			}
		}
		try {
			await this.ensureProviderInitialized();
		} catch (err) {
			if (this.providerRequirement.mode !== "optional") throw err;
			const nextFailure = this.markEmbeddingBootstrapFailure(err);
			onDebug?.({
				backend: "builtin",
				embeddingBootstrap: nextFailure
			});
			return true;
		}
		if (!failure) return false;
		if (!this.provider) {
			const nextFailure = {
				...failure,
				reason: this.providerUnavailableReason ?? failure.reason
			};
			this.embeddingBootstrapFailure = nextFailure;
			this.cacheProbeResult({
				ok: false,
				error: nextFailure.reason
			});
			onDebug?.({
				backend: "builtin",
				embeddingBootstrap: nextFailure
			});
			return true;
		}
		const currentIdentity = this.refreshIndexIdentityDirty({
			providerKeyKnown: true,
			indexState
		});
		let activeFailure = failure;
		if (currentIdentity.status !== "valid") {
			try {
				await this.syncAdmitted({
					reason: "search",
					force: true
				});
			} catch (err) {
				const message = redactSensitiveText(formatErrorMessage(err), { mode: "tools" });
				log$4.warn(`memory sync failed (embedding-bootstrap-recovery): ${message}`);
				activeFailure = this.markEmbeddingBootstrapFailure(err, { retainProvider: true });
			}
			indexState = await this.readRetrievalIndexState();
		}
		if (this.refreshIndexIdentityDirty({
			providerKeyKnown: true,
			indexState
		}).status === "valid" && await this.confirmEmbeddingBootstrapRecovery()) {
			this.vector.semanticAvailable = this.vector.enabled && this.vector.available === true && indexState.vectorState.state === "complete";
			this.clearEmbeddingBootstrapFailureAfterRecovery();
			return false;
		}
		activeFailure = this.embeddingBootstrapFailure ?? activeFailure;
		onDebug?.({
			backend: "builtin",
			embeddingBootstrap: activeFailure
		});
		return true;
	}
	clearEmbeddingBootstrapFailureAfterRecovery() {
		this.embeddingBootstrapFailure = void 0;
		this.providerUnavailableReason = void 0;
		if (this.provider) this.providerLifecycle = this.fallbackFrom ? {
			mode: "fallback-active",
			providerId: this.provider.id,
			fallbackFrom: this.fallbackFrom,
			reason: this.fallbackReason ?? "fallback activated"
		} : {
			mode: "active",
			providerId: this.provider.id
		};
		this.embeddingProbeCache.delete(this.cacheKey);
	}
	async adoptPublishedFallbackProviderIfMatched(indexState) {
		if (this.fallbackFrom || !this.provider) return false;
		const currentProviderId = resolveFallbackCurrentProviderId({
			provider: this.provider,
			lifecycle: this.providerLifecycle
		});
		const fallbackRequest = resolveMemoryFallbackProviderRequest({
			cfg: this.cfg,
			settings: this.settings,
			currentProviderId
		});
		const meta = indexState ? indexState.meta : this.readMeta();
		if (!fallbackRequest || !meta || meta.provider !== fallbackRequest.provider || meta.model !== fallbackRequest.model) return false;
		return await this.activateFallbackProvider("published memory index uses the configured fallback provider") && this.refreshIndexIdentityDirty({
			providerKeyKnown: this.providerInitialized,
			indexState
		}).status === "valid";
	}
	async confirmEmbeddingBootstrapRecovery() {
		const cached = this.getCachedEmbeddingAvailability();
		if (cached) return cached.ok;
		if (!this.provider) return false;
		try {
			await this.embedBatchWithRetry(["ping"]);
			this.cacheProbeResult({ ok: true });
			return true;
		} catch (err) {
			this.markEmbeddingBootstrapFailure(err, {
				retainProvider: true,
				provider: this.provider.id
			});
			return false;
		}
	}
	async ensureProviderInitialized() {
		if (this.providerInitialized) {
			if (!(this.embeddingBootstrapFailure !== void 0 && !this.provider && this.getCachedEmbeddingAvailability() === null)) {
				await this.getPendingFallbackProviderInitialization()?.catch(() => void 0);
				return;
			}
			this.resetProviderInitializationForRetry();
		}
		if (this.settings.provider === "none") {
			this.applyProviderResult({
				provider: null,
				requestedProvider: "none",
				providerUnavailableReason: "No embedding provider available (FTS-only mode)"
			});
			this.providerKey = this.computeProviderKey();
			this.batch = this.resolveBatchConfig();
			return;
		}
		if (!this.providerInitPromise) this.providerInitPromise = (async () => {
			await this.getPendingFallbackProviderInitialization()?.catch(() => void 0);
			await this.retireCurrentProvider();
			if (this.closed) return;
			const providerResult = await createEmbeddingProvider({
				createProvider: this.createProvider,
				config: this.cfg,
				agentDir: resolveAgentDir(this.cfg, this.agentId),
				...this.acquireLocalService ? { acquireLocalService: this.acquireLocalService } : {},
				...resolveMemoryPrimaryProviderRequest({ settings: this.settings })
			});
			this.applyProviderResult(providerResult);
			this.providerKey = this.computeProviderKey();
			this.batch = this.resolveBatchConfig();
		})();
		try {
			await this.providerInitPromise;
		} catch (err) {
			this.providerInitPromise = null;
			throw err;
		} finally {
			if (this.providerInitialized) this.providerInitPromise = null;
		}
	}
	resetProviderInitializationForRetry() {
		this.retireCurrentProvider();
		this.providerInitialized = false;
		this.providerInitPromise = null;
		this.providerUnavailableReason = void 0;
		this.providerLifecycle = createPendingMemoryProviderLifecycle(this.requestedProvider);
	}
	markLocalEmbeddingProviderDegraded(err) {
		if (this.provider?.id !== "local") return;
		const message = formatErrorMessage(err);
		const degradedProvider = this.provider;
		this.retireCurrentProvider();
		this.providerUnavailableReason = `Local embeddings degraded: ${message}`;
		this.providerLifecycle = createDegradedMemoryProviderLifecycle({
			providerId: degradedProvider.id,
			reason: message
		});
		this.embeddingProbeCache.delete(this.cacheKey);
		this.providerKey = this.computeProviderKey();
		this.batch = this.resolveBatchConfig();
		this.vector.semanticAvailable = false;
		log$4.warn("memory embeddings: local provider degraded after transport failure", { error: message });
	}
	retireCurrentProvider() {
		const provider = this.provider;
		if (provider) {
			this.provider = null;
			this.providerRuntime = void 0;
			this.providersPendingRetirement.add(provider);
		}
		if (this.providersPendingRetirement.size === 0) return this.providerRetirementPromise;
		const retirement = this.providerRetirementPromise.catch(() => {}).then(async () => {
			let firstError;
			let closeFailed = false;
			for (const pendingProvider of this.providersPendingRetirement) try {
				await this.awaitProviderIdle(pendingProvider);
				await pendingProvider.close?.();
				this.releaseProvider(pendingProvider);
				this.providersPendingRetirement.delete(pendingProvider);
			} catch (err) {
				if (!closeFailed) firstError = err;
				closeFailed = true;
			}
			if (closeFailed) throw toErrorObject(firstError, "Embedding provider retirement failed");
		});
		this.providerRetirementPromise = retirement;
		retirement.catch((err) => {
			log$4.warn(`memory embeddings: failed to close previous provider: ${formatErrorMessage(err)}`);
		});
		return retirement;
	}
	async drainPendingProviderRetirements() {
		const errors = [];
		for (let attempt = 0; attempt < 2 && (this.provider !== null || this.providersPendingRetirement.size > 0); attempt += 1) try {
			await this.retireCurrentProvider();
		} catch (err) {
			errors.push(err);
			log$4.warn(`memory close: pending manager work failed: ${formatErrorMessage(err)}`);
		}
		return errors;
	}
	isRequiredProviderUnavailable() {
		return this.providerRequirement.mode === "required" && !this.provider;
	}
	buildRequiredProviderUnavailableError(operation) {
		const registeredProviderIds = listRegisteredMemoryEmbeddingProviderAdapters().map((adapter) => adapter.id).toSorted();
		const registeredProviders = registeredProviderIds.length > 0 ? registeredProviderIds.join(",") : "none";
		const reason = this.providerUnavailableReason ?? (this.providerLifecycle.mode === "fts-only" ? this.providerLifecycle.reason : "provider is unavailable");
		return /* @__PURE__ */ new Error(`Memory ${operation} unavailable: embedding provider "${this.settings.provider}" is configured but unavailable. Reason: ${reason}. agentId=${this.agentId} purpose=${this.purpose} lifecycle=${JSON.stringify(this.providerLifecycle)} registeredMemoryEmbeddingProviders=${registeredProviders}`);
	}
	assertRequiredProviderAvailable(operation) {
		if (this.isRequiredProviderUnavailable()) {
			const error = this.buildRequiredProviderUnavailableError(operation);
			this.resetProviderInitializationForRetry();
			throw error;
		}
	}
	readRetrievalIndexState(signal) {
		return runMemoryIndexState({
			agentId: this.agentId,
			databasePath: resolveUserPath(this.settings.store.databasePath)
		}, signal);
	}
	refreshIndexIdentityDirty(params) {
		const provider = this.settings.provider === "none" ? null : this.providerInitialized ? this.provider ? {
			id: this.provider.id,
			model: this.provider.model
		} : null : void 0;
		const state = this.resolveCurrentIndexIdentityState({
			...provider !== void 0 ? { provider } : {},
			providerKeyKnown: params?.providerKeyKnown,
			...params?.indexState ? {
				meta: params.indexState.meta,
				hasIndexedChunks: params.indexState.hasIndexedChunks
			} : {}
		});
		this.indexIdentityState = state;
		this.indexIdentityDirty = state.status === "mismatched" || state.status === "missing" && (this.sources.has("memory") || (params?.indexState?.hasIndexedChunks ?? this.hasIndexedChunks()));
		return state;
	}
	refreshKeywordFallbackIndexIdentity(indexState) {
		const meta = indexState ? indexState.meta : this.readMeta();
		const state = this.resolveCurrentIndexIdentityState({
			meta,
			provider: meta && meta.provider !== "none" ? {
				id: meta.provider,
				model: meta.model
			} : null,
			providerKeyKnown: false,
			vectorReady: false,
			...indexState ? { hasIndexedChunks: indexState.hasIndexedChunks } : {}
		});
		this.indexIdentityState = state;
		this.indexIdentityDirty = state.status === "mismatched" || state.status === "missing" && (this.sources.has("memory") || (indexState?.hasIndexedChunks ?? this.hasIndexedChunks()));
		return state;
	}
	async awaitManagerIdle() {
		if (this.activeManagerOperations > 0) await new Promise((resolve) => {
			this.managerIdleWaiters.add(resolve);
		});
		while (this.purpose !== "cli" && this.activeBackgroundSearchSyncs.size > 0) await Promise.all(Array.from(this.activeBackgroundSearchSyncs));
	}
	async probeVectorAvailability() {
		return await this.withManagerOperation(async () => {
			if (!this.vector.enabled) {
				this.vector.semanticAvailable = false;
				return false;
			}
			await this.ensureProviderInitialized();
			if (!this.provider) {
				this.vector.semanticAvailable = false;
				return false;
			}
			const ready = await this.probeVectorStoreAvailabilityAdmitted();
			this.vector.semanticAvailable = ready;
			return ready;
		});
	}
	async probeVectorStoreAvailability() {
		return await this.withManagerOperation(async () => await this.probeVectorStoreAvailabilityAdmitted());
	}
	async probeVectorStoreAvailabilityAdmitted() {
		if (!this.vector.enabled) {
			this.vector.available = false;
			return false;
		}
		return await this.ensureVectorReady();
	}
	cacheProbeResult(result) {
		if (!this.canPublishEmbeddingProbe()) return result;
		const checkedAtMs = Date.now();
		this.embeddingProbeCache.set(this.cacheKey, {
			result,
			adapters: this.getEmbeddingProbeOwners(),
			checkedAtMs,
			expireAtMs: checkedAtMs + EMBEDDING_PROBE_CACHE_TTL_MS
		});
		return result;
	}
	getCachedEmbeddingAvailability() {
		const cached = this.embeddingProbeCache.get(this.cacheKey);
		if (!cached) return null;
		if (Date.now() >= cached.expireAtMs) {
			this.embeddingProbeCache.delete(this.cacheKey);
			return null;
		}
		return {
			...cached.result,
			checked: true,
			cached: true,
			checkedAtMs: cached.checkedAtMs,
			cacheExpiresAtMs: cached.expireAtMs
		};
	}
	async probeEmbeddingAvailability() {
		return await this.withManagerOperation(async () => {
			const cached = this.getCachedEmbeddingAvailability();
			if (cached) return cached;
			await this.ensureProviderInitialized();
			await this.adoptPublishedFallbackProviderIfMatched();
			if (!this.provider) return this.cacheProbeResult({
				ok: false,
				error: this.providerUnavailableReason ?? "No embedding provider available (FTS-only mode)"
			});
			try {
				await this.embedBatchWithRetry(["ping"]);
				return this.cacheProbeResult({ ok: true });
			} catch (err) {
				const message = formatErrorMessage(err);
				return this.cacheProbeResult({
					ok: false,
					error: message
				});
			}
		});
	}
};
//#endregion
//#region extensions/memory-core/src/memory/manager-provider-runtime-facts.ts
const LOCAL_EMBEDDING_RUNTIME_FACTS = Symbol.for("openclaw.localEmbeddingRuntimeFacts");
function getLocalEmbeddingRuntimeFacts(provider) {
	if (!provider) return;
	const getRuntimeFacts = Reflect.get(provider, LOCAL_EMBEDDING_RUNTIME_FACTS);
	return typeof getRuntimeFacts === "function" ? getRuntimeFacts() : void 0;
}
//#endregion
//#region extensions/memory-core/src/memory/embedding-local-service.ts
const LOCAL_SERVICE_HOST_IDENTITIES = resolveGlobalSingleton(Symbol.for("openclaw.memoryLocalServiceHostIdentities"), () => ({
	ids: /* @__PURE__ */ new WeakMap(),
	nextId: 1
}));
function resolveMemoryCoreLocalServiceHostIdentity(acquireLocalService) {
	if (!acquireLocalService) return "none";
	let id = LOCAL_SERVICE_HOST_IDENTITIES.ids.get(acquireLocalService);
	if (id === void 0) {
		id = LOCAL_SERVICE_HOST_IDENTITIES.nextId;
		LOCAL_SERVICE_HOST_IDENTITIES.nextId += 1;
		LOCAL_SERVICE_HOST_IDENTITIES.ids.set(acquireLocalService, id);
	}
	return String(id);
}
//#endregion
//#region extensions/memory-core/src/memory/manager-registry.ts
const log$3 = createSubsystemLogger("memory");
function isTransientMemoryIndexManagerPurpose(purpose) {
	return purpose !== "default";
}
function normalizeMemoryIndexManagerPurpose(purpose) {
	return purpose === "status" || purpose === "cli" || purpose === "maintenance" ? purpose : "default";
}
function resolveMemoryIndexManagerCacheKey(params) {
	return [
		params.agentId,
		params.workspaceDir,
		JSON.stringify(params.settings),
		JSON.stringify(params.providerRequirement),
		resolveMemoryCoreLocalServiceHostIdentity(params.acquireLocalService),
		params.purpose
	].join(":");
}
var MemoryManagerRegistry = class {
	constructor(lifecycle = {}) {
		this.lifecycle = lifecycle;
		this.embeddingProbeCache = /* @__PURE__ */ new Map();
		this.cache = /* @__PURE__ */ new Map();
		this.scopeOperations = /* @__PURE__ */ new Map();
		this.closePromise = null;
		this.closeFailed = false;
		this.managers = /* @__PURE__ */ new Map();
		lifecycle.prepare = (reload) => this.prepareManagersForReload(reload);
	}
	get reload() {
		return this.lifecycle.reload;
	}
	track(manager, key) {
		let owner = this.managers.get(manager);
		if (!owner) {
			owner = {
				key,
				pending: /* @__PURE__ */ new Map(),
				providers: /* @__PURE__ */ new Map(),
				failedAdapters: /* @__PURE__ */ new Set(),
				retiring: false
			};
			this.managers.set(manager, owner);
		}
		return owner;
	}
	async createProvider(manager, adapter, create) {
		const owner = this.managers.get(manager);
		if (!owner) throw new Error("Memory manager has no lifecycle owner");
		if (owner.retiring || this.reload?.retireRuntime || this.reload?.adapters.has(adapter)) throw new MemoryManagerReloadError();
		const acquisition = {};
		owner.pending.set(acquisition, adapter);
		try {
			const result = await create();
			if (result.provider) {
				owner.providers.set(result.provider, adapter);
				owner.failedAdapters.delete(adapter);
			} else owner.failedAdapters.add(adapter);
			return result;
		} catch (error) {
			owner.failedAdapters.add(adapter);
			throw error;
		} finally {
			owner.pending.delete(acquisition);
		}
	}
	canPublishProbe(manager) {
		const owner = this.managers.get(manager);
		return owner !== void 0 && !owner.retiring;
	}
	getProbeOwners(manager) {
		const owner = this.managers.get(manager);
		return owner ? [.../* @__PURE__ */ new Set([
			...owner.pending.values(),
			...owner.providers.values(),
			...owner.failedAdapters
		])] : [];
	}
	releaseProvider(manager, provider) {
		this.managers.get(manager)?.providers.delete(provider);
	}
	prepareReload(change) {
		return prepareMemoryManagerReload(change, this.lifecycle);
	}
	prepareManagersForReload(reload) {
		for (const [key, entry] of this.embeddingProbeCache) if (reload.retireRuntime || entry.adapters.some((adapter) => reload.adapters.has(adapter))) this.embeddingProbeCache.delete(key);
		return async () => {
			const selected = [...this.managers].filter(([, owner]) => owner.retiring || reload.retireRuntime || [
				...owner.pending.values(),
				...owner.providers.values(),
				...owner.failedAdapters
			].some((adapter) => reload.adapters.has(adapter)));
			for (const [manager, owner] of selected) {
				owner.retiring = true;
				if (this.cache.get(owner.key) === manager) this.cache.delete(owner.key);
				this.embeddingProbeCache.delete(owner.key);
			}
			return { errors: (await Promise.allSettled([...reload.retireRuntime ? this.scopeOperations.values() : [], ...selected.map(([manager, owner]) => this.closeEntry(owner.key, manager))])).flatMap((result) => result.status === "rejected" ? [result.reason] : []) };
		};
	}
	async acquire(params, callbacks) {
		if (params.purpose === "maintenance" && (this.reload?.retireRuntime || this.closePromise || this.closeFailed)) return null;
		if (this.reload?.retireRuntime) throw new MemoryManagerReloadError();
		return await this.runScopeOperation(params, async () => {
			if (this.reload?.retireRuntime) throw new MemoryManagerReloadError();
			if (this.closeFailed) await this.retryFailedGlobalClose();
			const prepared = await callbacks.prepare();
			if (!prepared) return null;
			if (this.reload?.retireRuntime) throw new MemoryManagerReloadError();
			const transient = isTransientMemoryIndexManagerPurpose(params.purpose);
			const create = async () => {
				if (this.reload?.retireRuntime) throw new MemoryManagerReloadError();
				const manager = await prepared.create();
				const owner = this.track(manager, prepared.key);
				if (this.reload?.retireRuntime) {
					owner.retiring = true;
					await this.closeEntries([[prepared.key, manager]]);
					throw new MemoryManagerReloadError();
				}
				return manager;
			};
			if (transient) return await create();
			const cachedManager = this.cache.get(prepared.key);
			await this.closeScopeUnlocked({
				agentId: params.agentId,
				purpose: params.purpose,
				...cachedManager && prepared.reuse(cachedManager) ? { exceptKey: prepared.key } : {}
			});
			const existing = this.cache.get(prepared.key);
			if (existing) {
				const reload = this.reload;
				if (reload && (reload.retireRuntime || this.getProbeOwners(existing).some((adapter) => reload.adapters.has(adapter)))) throw new MemoryManagerReloadError();
				return existing;
			}
			const manager = await create();
			this.cache.set(prepared.key, manager);
			return manager;
		});
	}
	async closeAll() {
		await this.runGlobalClose(() => this.retryFailedGlobalClose());
	}
	async closeForAgent(params) {
		const scope = {
			agentId: normalizeAgentId(params.agentId),
			purpose: params.purpose
		};
		await this.runScopeOperation(scope, async () => {
			await this.closeScopeUnlocked(scope);
		});
	}
	deleteIfCurrent(key, manager) {
		this.managers.delete(manager);
		if (this.cache.get(key) === manager) this.cache.delete(key);
	}
	async retryFailedGlobalClose() {
		try {
			await this.closeAllUnlocked();
			this.closeFailed = false;
		} catch (err) {
			this.closeFailed = true;
			throw err;
		}
	}
	async runGlobalClose(operation) {
		const closePromise = (this.closePromise ?? Promise.resolve()).then(operation, operation);
		this.closePromise = closePromise;
		await closePromise;
		if (this.closePromise === closePromise) this.closePromise = null;
	}
	async runScopeOperation(params, operation) {
		while (this.closePromise) {
			const globalClose = this.closePromise;
			try {
				await globalClose;
			} catch {
				if (this.closePromise === globalClose) await this.closeAll();
			}
		}
		const scopeKey = JSON.stringify([params.agentId, params.purpose]);
		const result = (this.scopeOperations.get(scopeKey) ?? Promise.resolve()).then(operation, operation);
		const tail = result.then(() => void 0, () => void 0);
		this.scopeOperations.set(scopeKey, tail);
		try {
			return await result;
		} finally {
			if (this.scopeOperations.get(scopeKey) === tail) this.scopeOperations.delete(scopeKey);
		}
	}
	async closeAllUnlocked() {
		const scopedOperations = Array.from(this.scopeOperations.values());
		if (scopedOperations.length > 0) await Promise.allSettled(scopedOperations);
		await this.closeEntries([...this.managers].filter(([manager, owner]) => owner.retiring || this.cache.get(owner.key) === manager).map(([manager, owner]) => [owner.key, manager]));
	}
	async closeScopeUnlocked(params) {
		const isScopedKey = (key) => key !== params.exceptKey && key.startsWith(`${params.agentId}:`) && key.endsWith(`:${params.purpose}`);
		await this.closeEntries(Array.from(this.cache.entries()).filter(([key]) => isScopedKey(key)), params.agentId);
	}
	async closeEntry(key, manager) {
		await manager.close();
		this.deleteIfCurrent(key, manager);
	}
	async closeEntries(entries, agentId) {
		let firstError;
		for (const [key, manager] of entries) try {
			await this.closeEntry(key, manager);
		} catch (err) {
			firstError ??= err;
			const scope = agentId ? ` for agent ${agentId}` : "";
			log$3.warn(`failed to close memory index manager${scope}: ${String(err)}`);
		}
		if (firstError !== void 0) throw toErrorObject(firstError, "Failed to close memory index manager");
	}
};
//#endregion
//#region extensions/memory-core/src/memory/manager-search-maintenance.ts
async function runMemorySearchMaintenance(params) {
	const dirtyGeneration = params.takeDirtyGeneration();
	let manager;
	try {
		manager = await params.acquireManager();
	} catch (err) {
		params.restoreDirtyGeneration(dirtyGeneration);
		throw toErrorObject(err, "Memory search maintenance manager acquisition failed");
	}
	if (!manager) {
		params.restoreDirtyGeneration(dirtyGeneration);
		return;
	}
	let maintenanceError;
	let incompleteReason;
	try {
		manager.adoptReindexRetryState(dirtyGeneration);
		try {
			await manager.sync({ reason: params.reason });
		} catch (err) {
			if (!(err instanceof MemoryIndexRevisionConflictError)) throw err;
			await manager.sync({ reason: params.reason });
		}
		const status = manager.status();
		if (status.dirty === true) {
			params.restoreDirtyGeneration(manager.takeReindexRetryStateForMaintenance());
			incompleteReason = status.lastSyncError;
		}
	} catch (err) {
		params.restoreDirtyGeneration(dirtyGeneration);
		maintenanceError = toErrorObject(err, "Memory search maintenance failed");
	}
	try {
		await manager.close();
	} catch (err) {
		maintenanceError ??= toErrorObject(err, "Memory search maintenance close failed");
	}
	if (maintenanceError) throw maintenanceError;
	return incompleteReason;
}
//#endregion
//#region extensions/memory-core/src/memory/importance.ts
function importanceMultiplier(importance) {
	if (importance === null || importance === void 0) return 1;
	return .75 + Math.max(1, Math.min(10, Math.floor(importance))) * .05;
}
function applyImportanceMultiplier(results) {
	return results.map(applyEntryImportance);
}
function applyEntryImportance(entry) {
	return {
		...entry,
		score: entry.score * importanceMultiplier(entry.importance)
	};
}
//#endregion
//#region extensions/memory-core/src/memory/mmr.ts
const DEFAULT_MMR_CONFIG = {
	enabled: false,
	lambda: .7
};
/**
* Compute MMR score for a candidate item.
* MMR = λ * relevance - (1-λ) * max_similarity_to_selected
*/
function computeMMRScore(relevance, maxSimilarity, lambda) {
	return lambda * relevance - (1 - lambda) * maxSimilarity;
}
/**
* Re-rank items using Maximal Marginal Relevance (MMR).
*
* The algorithm iteratively selects items that balance relevance with diversity:
* 1. Start with the highest-scoring item
* 2. For each remaining slot, select the item that maximizes the MMR score
* 3. MMR score = λ * relevance - (1-λ) * max_similarity_to_already_selected
*
* @param items - Items to re-rank, must have score and snippet
* @param config - MMR configuration (lambda, enabled)
* @returns Re-ranked items in MMR order
*/
function mmrRerank(items, config = {}) {
	const { enabled = DEFAULT_MMR_CONFIG.enabled, lambda = DEFAULT_MMR_CONFIG.lambda } = config;
	if (!enabled || items.length <= 1) return [...items];
	const clampedLambda = Math.max(0, Math.min(1, lambda));
	if (clampedLambda === 1) return [...items].toSorted((a, b) => b.score - a.score);
	const prepared = items.map((item) => {
		const snippet = item.snippet;
		const tokens = tokenize(snippet);
		return {
			item,
			score: item.score,
			tokens,
			emptyTokenText: tokens.size === 0 ? normalizeLowercaseStringOrEmpty(snippet) : void 0,
			relevance: 0,
			maxSimilarity: 0
		};
	});
	const maxScore = Math.max(...prepared.map((item) => item.score));
	const minScore = Math.min(...prepared.map((item) => item.score));
	const scoreRange = maxScore - minScore;
	for (const item of prepared) item.relevance = scoreRange === 0 ? 1 : (item.score - minScore) / scoreRange;
	const remaining = new Set(prepared);
	const selected = [];
	while (remaining.size > 0) {
		let bestItem = null;
		let bestMMRScore = -Infinity;
		for (const candidate of remaining) {
			const mmrScore = computeMMRScore(candidate.relevance, candidate.maxSimilarity, clampedLambda);
			if (mmrScore > bestMMRScore || mmrScore === bestMMRScore && candidate.score > (bestItem?.score ?? -Infinity)) {
				bestMMRScore = mmrScore;
				bestItem = candidate;
			}
		}
		if (!bestItem) break;
		selected.push(bestItem.item);
		remaining.delete(bestItem);
		for (const candidate of remaining) {
			const similarity = candidate.tokens.size === 0 && bestItem.tokens.size === 0 ? Number(candidate.emptyTokenText === bestItem.emptyTokenText) : jaccardSimilarity(candidate.tokens, bestItem.tokens);
			if (similarity > candidate.maxSimilarity) candidate.maxSimilarity = similarity;
		}
	}
	return selected;
}
/**
* Apply MMR re-ranking to hybrid search results.
*/
function applyMMRToHybridResults(results, config = {}) {
	if (results.length === 0) return results;
	return mmrRerank(results, config);
}
//#endregion
//#region extensions/memory-core/src/memory/project-ranking.ts
function prepareActiveProjectKeys(activeProjectKeys) {
	return activeProjectKeys?.length ? new Set(activeProjectKeys) : void 0;
}
function projectScoreMultiplier(projectKey, activeProjectKeys) {
	if (!projectKey || !activeProjectKeys || activeProjectKeys.size === 0) return 1;
	return projectKey.split(";").map((key) => key.trim()).filter(Boolean).every((key) => activeProjectKeys.has(key)) ? 1.15 : .9;
}
function applyProjectRanking(results, activeProjectKeys) {
	const eligible = results.filter((entry) => !entry.projectKey?.split(";").map((key) => key.trim()).includes(INVALID_PROJECT_ANNOTATION_KEY));
	if (!activeProjectKeys || activeProjectKeys.size === 0) return eligible;
	return eligible.map((entry) => Object.assign({}, entry, { score: entry.score * projectScoreMultiplier(entry.projectKey, activeProjectKeys) }));
}
//#endregion
//#region extensions/memory-core/src/memory/temporal-decay.ts
const DEFAULT_TEMPORAL_DECAY_CONFIG = {
	enabled: false,
	halfLifeDays: 30
};
const DAY_MS = 864e5;
const DATED_MEMORY_PATH_RE = /(?:^|\/)memory\/(?:[^/]+\/)*(\d{4})-(\d{2})-(\d{2})(?:-[^/]+)?\.md$/;
function applyTemporalDecayToScore(params) {
	const { halfLifeDays } = params;
	const clampedAge = Math.max(0, params.ageInDays);
	if (!Number.isFinite(halfLifeDays) || halfLifeDays <= 0 || !Number.isFinite(clampedAge)) return params.score;
	return params.score * Math.exp(-(Math.LN2 / halfLifeDays) * clampedAge);
}
function parseMemoryDateFromPath(filePath) {
	const normalized = filePath.replaceAll("\\", "/").replace(/^\.\//, "");
	const match = DATED_MEMORY_PATH_RE.exec(normalized);
	if (!match) return null;
	const year = Number(match[1]);
	const month = Number(match[2]);
	const day = Number(match[3]);
	if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return null;
	const timestamp = Date.UTC(year, month - 1, day);
	const parsed = new Date(timestamp);
	if (parsed.getUTCFullYear() !== year || parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== day) return null;
	return parsed;
}
function isEvergreenMemoryPath(filePath) {
	const normalized = filePath.replaceAll("\\", "/").replace(/^\.\//, "");
	if (normalized === "MEMORY.md" || normalized === "USER.md") return true;
	if (!normalized.startsWith("memory/")) return false;
	return !DATED_MEMORY_PATH_RE.test(normalized);
}
async function extractTimestamp(params) {
	if (params.source === "sessions") {
		const mtime = params.sessionSourceMtimes?.get(params.filePath);
		return mtime !== void 0 && Number.isFinite(mtime) ? new Date(mtime) : null;
	}
	const fromPath = parseMemoryDateFromPath(params.filePath);
	if (fromPath) return fromPath;
	if (params.source === "memory" && isEvergreenMemoryPath(params.filePath)) return null;
	if (params.source === "memory" && params.memorySourceMtimes) {
		const mtime = params.memorySourceMtimes.get(params.filePath);
		return mtime !== void 0 && Number.isFinite(mtime) ? new Date(mtime) : null;
	}
	if (!params.workspaceDir) return null;
	const absolutePath = path.isAbsolute(params.filePath) ? params.filePath : path.resolve(params.workspaceDir, params.filePath);
	try {
		const stat = await fs$1.stat(absolutePath);
		if (!Number.isFinite(stat.mtimeMs)) return null;
		return new Date(stat.mtimeMs);
	} catch {
		return null;
	}
}
async function applyTemporalDecayToHybridResults(params) {
	const config = {
		...DEFAULT_TEMPORAL_DECAY_CONFIG,
		...params.temporalDecay
	};
	if (!config.enabled) return [...params.results];
	const nowMs = params.nowMs ?? Date.now();
	const timestampPromiseCache = /* @__PURE__ */ new Map();
	return Promise.all(params.results.map(async (entry) => {
		const cacheKey = `${entry.source}:${entry.path}`;
		let timestampPromise = timestampPromiseCache.get(cacheKey);
		if (!timestampPromise) {
			timestampPromise = extractTimestamp({
				filePath: entry.path,
				source: entry.source,
				workspaceDir: params.workspaceDir,
				sessionSourceMtimes: params.sessionSourceMtimes,
				memorySourceMtimes: params.memorySourceMtimes
			});
			timestampPromiseCache.set(cacheKey, timestampPromise);
		}
		const timestamp = await timestampPromise;
		if (!timestamp) return entry;
		const decayedScore = applyTemporalDecayToScore({
			score: entry.score,
			ageInDays: (nowMs - timestamp.getTime()) / DAY_MS,
			halfLifeDays: config.halfLifeDays
		});
		return {
			...entry,
			score: decayedScore
		};
	}));
}
//#endregion
//#region extensions/memory-core/src/memory/hybrid.ts
function scoreExactPathTieForTemporalDecay(contentScore) {
	return (1 + Math.max(0, Math.min(1, contentScore))) / 2;
}
async function mergeHybridResults(params) {
	const byId = /* @__PURE__ */ new Map();
	for (const r of params.vector) byId.set(r.id, {
		id: r.id,
		path: r.path,
		startLine: r.startLine,
		endLine: r.endLine,
		source: r.source,
		snippet: r.snippet,
		vectorScore: r.vectorScore,
		textScore: 0,
		rankingScore: 0,
		pathScore: 0,
		exactPathSpecificity: r.exactPathSpecificity ?? 0,
		hasBodyMatch: false,
		hasVector: true,
		hasKeyword: false,
		importance: r.importance,
		triggers: r.triggers,
		projectKey: r.projectKey,
		...r.provenance ? { provenance: r.provenance } : {}
	});
	for (const r of params.keyword) {
		const exactPathSpecificity = r.exactPathSpecificity ?? 0;
		const existing = byId.get(r.id);
		if (existing) {
			existing.textScore = r.textScore;
			existing.hasBodyMatch = r.hasBodyMatch ?? r.textScore > 0;
			existing.rankingScore = r.rankingScore ?? r.textScore;
			existing.pathScore = r.pathScore ?? 0;
			existing.exactPathSpecificity = Math.max(existing.exactPathSpecificity, exactPathSpecificity);
			existing.hasKeyword = true;
			existing.importance ??= r.importance;
			existing.triggers ??= r.triggers;
			existing.projectKey ??= r.projectKey;
			if (!existing.provenance && r.provenance) existing.provenance = r.provenance;
			if (r.snippet && r.snippet.length > 0) existing.snippet = r.snippet;
		} else byId.set(r.id, {
			id: r.id,
			path: r.path,
			startLine: r.startLine,
			endLine: r.endLine,
			source: r.source,
			snippet: r.snippet,
			vectorScore: 0,
			textScore: r.textScore,
			rankingScore: r.rankingScore ?? r.textScore,
			pathScore: r.pathScore ?? 0,
			exactPathSpecificity,
			hasBodyMatch: r.hasBodyMatch ?? r.textScore > 0,
			hasVector: false,
			hasKeyword: true,
			importance: r.importance,
			triggers: r.triggers,
			projectKey: r.projectKey,
			...r.provenance ? { provenance: r.provenance } : {}
		});
	}
	const temporalDecayConfig = {
		...DEFAULT_TEMPORAL_DECAY_CONFIG,
		...params.temporalDecay
	};
	const decayed = await applyTemporalDecayToHybridResults({
		results: Array.from(byId.values()).map((entry) => {
			const keywordScore = entry.textScore > 0 ? entry.rankingScore : entry.exactPathSpecificity > 0 ? 0 : entry.pathScore;
			const contentScore = entry.hasVector && !entry.hasKeyword && params.vectorWeight > 0 && params.isNonTextMediaPath?.(entry.path) === true ? entry.vectorScore : params.vectorWeight * entry.vectorScore + params.textWeight * keywordScore;
			const lexicalRank = entry.hasBodyMatch && entry.textScore === 0 ? entry.rankingScore : 0;
			const rankingScore = entry.exactPathSpecificity > 0 ? temporalDecayConfig.enabled ? scoreExactPathTieForTemporalDecay(contentScore) : contentScore > 0 ? contentScore : 1 : contentScore === 0 ? lexicalRank : contentScore;
			return Object.assign({
				path: entry.path,
				startLine: entry.startLine,
				endLine: entry.endLine,
				score: rankingScore,
				vectorScore: entry.vectorScore,
				textScore: entry.textScore,
				exactPathSpecificity: entry.exactPathSpecificity,
				contentScore,
				lexicalRank,
				snippet: entry.snippet,
				source: entry.source,
				importance: entry.importance,
				triggers: entry.triggers,
				projectKey: entry.projectKey
			}, entry.provenance ? { provenance: entry.provenance } : {});
		}),
		temporalDecay: temporalDecayConfig,
		workspaceDir: params.workspaceDir,
		sessionSourceMtimes: params.sessionSourceMtimes,
		memorySourceMtimes: params.memorySourceMtimes,
		nowMs: params.nowMs
	});
	const activeProjects = prepareActiveProjectKeys(params.activeProjectKeys);
	const rankable = applyProjectRanking(applyImportanceMultiplier(decayed), activeProjects).map((entry) => {
		const rankingScore = entry.score;
		return Object.assign(entry, {
			rankingScore,
			score: entry.exactPathSpecificity > 0 ? projectScoreMultiplier(entry.projectKey, activeProjects) : entry.contentScore === 0 ? 0 : entry.score
		});
	});
	const compareRankingScores = (a, b) => b.rankingScore - a.rankingScore || b.lexicalRank - a.lexicalRank || a.path.localeCompare(b.path) || a.startLine - b.startLine || a.endLine - b.endLine;
	const nonExact = rankable.filter((entry) => entry.exactPathSpecificity === 0).toSorted((a, b) => b.score - a.score || compareRankingScores(a, b));
	const mmrConfig = {
		...DEFAULT_MMR_CONFIG,
		...params.mmr
	};
	const rerankExactGroup = (entries) => {
		if (!mmrConfig.enabled) return entries;
		return applyMMRToHybridResults(entries.map((entry) => Object.assign(entry, { score: entry.rankingScore })), mmrConfig).map((entry) => Object.assign(entry, { score: projectScoreMultiplier(entry.projectKey, activeProjects) }));
	};
	return [...[
		3,
		2,
		1
	].flatMap((specificity) => {
		const tier = rankable.filter((entry) => entry.exactPathSpecificity === specificity).toSorted(compareRankingScores);
		if (temporalDecayConfig.enabled) return rerankExactGroup(tier);
		const contentBacked = tier.filter((entry) => entry.contentScore > 0 || entry.lexicalRank > 0);
		const pathOnly = tier.filter((entry) => !(entry.contentScore > 0) && entry.lexicalRank === 0);
		return rerankExactGroup(contentBacked).concat(rerankExactGroup(pathOnly));
	}), ...mmrConfig.enabled ? applyMMRToHybridResults(nonExact, mmrConfig) : nonExact].map(({ exactPathSpecificity: _exactPathSpecificity, rankingScore: _rankingScore, contentScore: _contentScore, lexicalRank: _lexicalRank, ...entry }) => entry);
}
function hybridResultRangeKey(entry) {
	return `${entry.source}:${entry.path}:${entry.startLine}:${entry.endLine}`;
}
function selectHybridSearchResults(params) {
	const strict = params.merged.filter((entry) => entry.score >= params.minScore);
	const selected = strict.slice(0, params.maxResults);
	if (params.keyword.length === 0 || selected.length === params.maxResults) return selected;
	const keywordKeys = new Set(params.keyword.map((entry) => hybridResultRangeKey(entry)));
	if (strict.length === 0) return params.merged.filter((entry) => entry.score >= 0 && keywordKeys.has(hybridResultRangeKey(entry))).slice(0, params.maxResults);
	const seen = new Set(selected.map((entry) => hybridResultRangeKey(entry)));
	for (const entry of params.merged) {
		if (selected.length === params.maxResults) break;
		const key = hybridResultRangeKey(entry);
		if (entry.score < params.minScore && entry.vectorScore === 0 && keywordKeys.has(key) && !seen.has(key)) {
			seen.add(key);
			selected.push(entry);
		}
	}
	return selected;
}
//#endregion
//#region extensions/memory-core/src/memory/manager-hybrid-candidates.ts
function projectHybridCandidates(query, vector, keyword) {
	const matchExactPath = prepareExactPathMatcher(query);
	return {
		vector: vector.map((result) => ({
			id: result.id,
			path: result.path,
			startLine: result.startLine,
			endLine: result.endLine,
			source: result.source,
			snippet: result.snippet,
			vectorScore: result.score,
			importance: result.importance,
			triggers: result.triggers,
			projectKey: result.projectKey,
			exactPathSpecificity: matchExactPath(result.path),
			...result.provenance ? { provenance: result.provenance } : {}
		})),
		keyword: keyword.map((result) => ({
			id: result.id,
			path: result.path,
			startLine: result.startLine,
			endLine: result.endLine,
			source: result.source,
			snippet: result.snippet,
			textScore: result.textScore,
			hasBodyMatch: result.hasBodyMatch,
			importance: result.importance,
			triggers: result.triggers,
			projectKey: result.projectKey,
			rankingScore: result.score,
			pathScore: result.pathScore,
			exactPathSpecificity: result.exactPathSpecificity,
			...result.provenance ? { provenance: result.provenance } : {}
		}))
	};
}
//#endregion
//#region extensions/memory-core/src/memory/manager-keyword-retrieval.ts
const SNIPPET_MAX_CHARS$1 = 700;
const FTS_TABLE = MEMORY_INDEX_FTS_TABLE;
const PATH_FTS_TABLE = MEMORY_INDEX_PATHS_FTS_TABLE;
const KEYWORD_FALLBACK_SEARCH_TERM_LIMIT = 6;
const EXACT_PATH_CANDIDATE_LIMIT = 200;
const log$2 = createSubsystemLogger("memory");
function keywordHitHasBody(hit) {
	return hit.hasBodyMatch;
}
function compareKeywordSearchHits(a, b, preferExactBody = true) {
	const specificityDelta = b.exactPathSpecificity - a.exactPathSpecificity;
	if (specificityDelta !== 0) return specificityDelta;
	if (preferExactBody && a.exactPathSpecificity > 0) {
		const bodyPresenceDelta = Number(keywordHitHasBody(b)) - Number(keywordHitHasBody(a));
		if (bodyPresenceDelta !== 0) return bodyPresenceDelta;
	}
	const relevanceDelta = b.score - a.score;
	if (relevanceDelta !== 0) return relevanceDelta;
	const textDelta = b.textScore - a.textScore;
	if (textDelta !== 0) return textDelta;
	if (a.exactPathSpecificity === 0) {
		const pathDelta = b.pathScore - a.pathScore;
		if (pathDelta !== 0) return pathDelta;
	}
	return a.path.localeCompare(b.path) || a.startLine - b.startLine || a.id.localeCompare(b.id);
}
var MemoryKeywordRetrieval = class extends MemoryProviderLifecycle {
	selectScoredResults(results, maxResults, minScore, relaxedMinScore = minScore) {
		const strict = results.filter((entry) => entry.score >= minScore);
		if (strict.length > 0) return strict.slice(0, maxResults);
		return results.filter((entry) => entry.score >= relaxedMinScore).slice(0, maxResults);
	}
	async listTriggerCandidates(opts) {
		const limit = Math.max(1, Math.min(512, Math.floor(opts?.limit ?? 512)));
		return await this.readCuratedMemoryCandidates({
			limit,
			projectsOnly: false,
			activeProjectKeys: opts?.activeProjectKeys
		});
	}
	async listCuratedProjectCandidates(opts) {
		const limit = Math.max(1, Math.min(512, Math.floor(opts.limit ?? 48)));
		return await this.readCuratedMemoryCandidates({
			limit,
			projectsOnly: true,
			activeProjectKeys: opts.activeProjectKeys
		});
	}
	async readCuratedMemoryCandidates(query) {
		return await this.withManagerOperation(async () => {
			const result = await runMemoryCuratedCandidates({
				agentId: this.agentId,
				databasePath: resolveUserPath(this.settings.store.databasePath)
			}, {
				...query,
				checkProvenanceRepair: this.memorySourceProvenanceRepairPending
			});
			this.memorySourceProvenanceRepairPending = result.provenanceRepairPending;
			if (this.memorySourceProvenanceRepairPending) {
				this.withManagerOperation(() => this.syncAdmitted({ reason: "search" }, { allowEmbeddingBootstrapFallback: true })).catch((err) => {
					log$2.warn(`memory sync failed (automatic candidates): ${formatErrorMessage(err)}`);
				});
				return [];
			}
			return this.toCuratedMemorySearchResults(result.rows);
		});
	}
	toCuratedMemorySearchResults(rows) {
		return rows.map((row) => {
			const result = {
				path: row.path,
				startLine: row.start_line,
				endLine: row.end_line,
				score: 0,
				snippet: row.text,
				source: "memory"
			};
			if (typeof row.importance === "number") result.importance = row.importance;
			if (typeof row.triggers === "string" && row.triggers.trim()) result.triggers = row.triggers.trim();
			if (typeof row.project_key === "string" && row.project_key.trim()) result.projectKey = row.project_key.trim();
			result.provenance = {
				originClass: row.origin_class,
				sessionKind: row.session_kind,
				observedAt: row.observed_at,
				...typeof row.supersedes_key === "string" ? { supersedesKey: row.supersedes_key } : {}
			};
			return result;
		});
	}
	async finalizeKeywordOnlyResults(params) {
		const appliesTemporalDecay = params.temporalDecay?.enabled === true;
		const decayed = await applyTemporalDecayToHybridResults({
			results: appliesTemporalDecay ? params.results.map((entry) => {
				if (entry.exactPathSpecificity === 0) return entry;
				const contentScore = keywordHitHasBody(entry) ? entry.score : 0;
				return {
					...entry,
					score: scoreExactPathTieForTemporalDecay(contentScore)
				};
			}) : params.results,
			temporalDecay: params.temporalDecay,
			workspaceDir: this.workspaceDir,
			sessionSourceMtimes: this.loadSessionSourceMtimes(params.results),
			memorySourceMtimes: this.loadRemoteMemorySourceMtimes(params.results)
		});
		const activeProjects = prepareActiveProjectKeys(params.activeProjectKeys);
		const ranked = applyProjectRanking(applyImportanceMultiplier(decayed), activeProjects).toSorted((left, right) => compareKeywordSearchHits(left, right, !appliesTemporalDecay)).map((entry) => entry.exactPathSpecificity > 0 ? Object.assign(entry, { score: projectScoreMultiplier(entry.projectKey, activeProjects) }) : entry);
		return this.toMemorySearchResults(this.selectScoredResults(ranked, params.maxResults, params.minScore, 0));
	}
	loadRemoteMemorySourceMtimes(results) {
		if (!this.memoryFiles) return;
		const entries = results.filter((entry) => entry.source === "memory");
		if (entries.length === 0) return;
		return new Map(entries.map((entry) => [entry.path, entry.sourceMtime]));
	}
	loadSessionSourceMtimes(results) {
		const entries = results.filter((entry) => entry.source === "sessions");
		if (entries.length === 0) return;
		return new Map(entries.map((entry) => [entry.path, entry.sourceMtime]));
	}
	async attachRecallMetadata(results, signal, sourceFilterList) {
		if (results.length === 0) return results;
		const query = {
			candidates: results.map(({ id, path, source }) => ({
				id,
				path,
				source
			})),
			includeMemoryMtimes: Boolean(this.memoryFiles)
		};
		const { rows: metadataById, sourceMtimes } = sourceFilterList?.length === 1 && sourceFilterList[0] === "sessions" ? readMemoryRecallData(this.db, query) : await runMemoryRecallMetadata({
			agentId: this.agentId,
			databasePath: resolveUserPath(this.settings.store.databasePath)
		}, query, signal);
		return results.filter((entry) => metadataById.has(entry.id)).map((entry) => {
			const row = metadataById.get(entry.id);
			return Object.assign(entry, {
				sourceMtime: sourceMtimes[entry.source].get(entry.path),
				...typeof row?.importance === "number" ? { importance: row.importance } : {},
				...typeof row?.triggers === "string" && row.triggers.trim() ? { triggers: row.triggers.trim() } : {},
				...typeof row?.project_key === "string" && row.project_key.trim() ? { projectKey: row.project_key.trim() } : {},
				...row?.provenance ? { provenance: row.provenance } : {}
			});
		});
	}
	buildKeywordSearchQuery(query, limit, options, sourceFilterList) {
		return {
			body: {
				ftsTable: FTS_TABLE,
				query,
				ftsTokenizer: this.settings.store.fts.tokenizer,
				limit,
				snippetMaxChars: SNIPPET_MAX_CHARS$1,
				sourceFilter: this.buildSourceFilter(void 0, sourceFilterList),
				boostFallbackRanking: options?.boostFallbackRanking,
				rankingQuery: options?.rankingQuery
			},
			path: {
				pathFtsTable: PATH_FTS_TABLE,
				query,
				exactPathQuery: options?.exactPathQuery ?? query,
				exactPathLimit: EXACT_PATH_CANDIDATE_LIMIT,
				ftsTokenizer: this.settings.store.fts.tokenizer,
				limit,
				snippetMaxChars: SNIPPET_MAX_CHARS$1,
				sourceFilter: this.buildSourceFilter(PATH_FTS_TABLE, sourceFilterList)
			}
		};
	}
	async prepareKeywordSearch(query, limit, options, sourceFilterList) {
		const result = await runMemoryKeywordSearch({
			agentId: this.agentId,
			databasePath: resolveUserPath(this.settings.store.databasePath)
		}, this.buildKeywordSearchQuery(query, limit, options, sourceFilterList), options.signal, true);
		if (!result.indexState) throw new Error("Memory keyword preparation returned no index state");
		return {
			indexState: result.indexState,
			keyword: result
		};
	}
	async searchKeyword(query, limit, options, sourceFilterList) {
		if (!this.fts.enabled || !this.fts.available) return [];
		const result = await runMemoryKeywordSearch({
			agentId: this.agentId,
			databasePath: resolveUserPath(this.settings.store.databasePath)
		}, this.buildKeywordSearchQuery(query, limit, options, sourceFilterList), options?.signal);
		return this.resolveKeywordSearchResult(result, options?.exactPathQuery ?? query, limit);
	}
	resolveKeywordSearchResult(result, exactPathQuery, limit) {
		if (result.body.error) log$2.warn(`memory search: body keyword query failed: ${result.body.error}`);
		if (result.path.error) log$2.warn(`memory search: path keyword query failed: ${result.path.error}`);
		const bodyResults = result.body.rows;
		const pathResults = result.path.rows;
		const merged = this.mergeKeywordSearchHits([bodyResults.map((entry) => Object.assign(entry, { pathScore: 0 })), pathResults], exactPathQuery);
		return this.limitKeywordSearchHits(merged, limit);
	}
	async searchKeywordWithFallback(query, limit, options, sourceFilterList, initialResult) {
		const fullQueryResults = initialResult ? this.resolveKeywordSearchResult(initialResult, query, limit) : await this.searchKeyword(query, limit, options, sourceFilterList);
		options?.signal?.throwIfAborted();
		if (fullQueryResults.filter((result) => result.exactPathSpecificity === 0).length >= limit) return this.attachRecallMetadata(fullQueryResults, options?.signal, sourceFilterList);
		const fallbackTerms = this.resolveKeywordFallbackTerms(query);
		if (fallbackTerms.length === 0) return this.attachRecallMetadata(fullQueryResults, options?.signal, sourceFilterList);
		const strictFtsQuery = buildFtsQuery(query)?.toLowerCase();
		const keywordFtsQuery = buildFtsQuery(fallbackTerms.join(" "))?.toLowerCase();
		if (fullQueryResults.length > 0 && strictFtsQuery === keywordFtsQuery) return this.attachRecallMetadata(fullQueryResults, options?.signal, sourceFilterList);
		const settled = await Promise.allSettled(fallbackTerms.map((term) => this.searchKeyword(term, limit, {
			...options,
			exactPathQuery: query,
			rankingQuery: query
		}, sourceFilterList)));
		options?.signal?.throwIfAborted();
		const resultSets = settled.map((result) => {
			if (result.status === "rejected") throw result.reason;
			return result.value;
		});
		return this.attachRecallMetadata(this.limitKeywordSearchHits(this.mergeKeywordSearchHits([fullQueryResults, ...resultSets], query), limit), options?.signal, sourceFilterList);
	}
	resolveKeywordFallbackTerms(query) {
		const normalizedQuery = query.trim().toLowerCase();
		return extractKeywords(query, { ftsTokenizer: this.settings.store.fts.tokenizer }).filter((term) => term !== normalizedQuery).slice(0, KEYWORD_FALLBACK_SEARCH_TERM_LIMIT);
	}
	mergeKeywordSearchHits(resultSets, exactPathQuery) {
		const matchExactPath = prepareExactPathMatcher(exactPathQuery);
		const seenIds = /* @__PURE__ */ new Map();
		for (const results of resultSets) for (const result of results) {
			const existing = seenIds.get(result.id);
			if (!existing) {
				seenIds.set(result.id, Object.assign(result, { exactPathSpecificity: matchExactPath(result.path) }));
				continue;
			}
			const existingHasBody = keywordHitHasBody(existing);
			const resultHasBody = result.hasBodyMatch;
			const existingBodyScore = existingHasBody ? existing.score : 0;
			const resultBodyScore = resultHasBody ? result.score : 0;
			existing.textScore = Math.max(existing.textScore, result.textScore);
			existing.pathScore = Math.max(existing.pathScore, result.pathScore);
			existing.hasBodyMatch ||= result.hasBodyMatch;
			const bodyScore = Math.max(existingBodyScore, resultBodyScore);
			existing.score = bodyScore > 0 ? bodyScore : existing.pathScore;
			if (resultHasBody && !existingHasBody || resultHasBody === existingHasBody && result.snippet.length > existing.snippet.length) existing.snippet = result.snippet;
		}
		const merged = [...seenIds.values()];
		for (const result of merged) if (!keywordHitHasBody(result)) result.score = result.exactPathSpecificity > 0 ? 1 : result.pathScore;
		return merged.toSorted(compareKeywordSearchHits);
	}
	limitKeywordSearchHits(results, nonExactLimit) {
		const ranked = results.toSorted(compareKeywordSearchHits);
		const exactBody = ranked.filter((entry) => entry.exactPathSpecificity > 0 && keywordHitHasBody(entry)).slice(0, nonExactLimit);
		const exactPathOnly = ranked.filter((entry) => entry.exactPathSpecificity > 0 && !keywordHitHasBody(entry));
		const boundedExact = exactBody.concat(exactPathOnly).toSorted(compareKeywordSearchHits);
		const selectedPathKeys = /* @__PURE__ */ new Set();
		for (const entry of boundedExact) {
			selectedPathKeys.add(`${entry.source}:${entry.path}`);
			if (selectedPathKeys.size === EXACT_PATH_CANDIDATE_LIMIT) break;
		}
		const exact = boundedExact.filter((entry) => selectedPathKeys.has(`${entry.source}:${entry.path}`));
		const nonExact = ranked.filter((entry) => entry.exactPathSpecificity === 0).slice(0, nonExactLimit);
		return exact.concat(nonExact);
	}
	toMemorySearchResults(results) {
		return results.map(({ id: _id, pathScore: _pathScore, exactPathSpecificity: _exactPathSpecificity, hasBodyMatch: _hasBodyMatch, ...result }) => result);
	}
};
//#endregion
//#region extensions/memory-core/src/memory/manager-search-knn-subprocess.ts
const MAX_STDIN_BYTES = 1048576;
const MAX_STDOUT_BYTES = 2097152;
const MAX_STDERR_BYTES = 65536;
const KILL_EXIT_TIMEOUT_MS = 2e3;
const MAX_CONCURRENT_VECTOR_KNN_CHILDREN = 2;
var VectorKnnSubprocessError = class extends Error {
	constructor(message, code) {
		super(message);
		this.code = code;
		this.name = "VectorKnnSubprocessError";
	}
};
function buildChildEnv(env = process.env) {
	const childEnv = {};
	for (const name of [
		"PATH",
		"SystemRoot",
		"SYSTEMROOT",
		"WINDIR",
		"TEMP",
		"TMP",
		"TMPDIR"
	]) if (env[name]) childEnv[name] = env[name];
	return childEnv;
}
function toAbortError(signal) {
	return signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("memory vector KNN aborted");
}
function createVectorKnnAdmission(maxConcurrent) {
	let active = 0;
	const waiters = [];
	const releaseNext = () => {
		while (waiters.length > 0) {
			const next = waiters.shift();
			next.signal?.removeEventListener("abort", next.abort);
			if (next.signal?.aborted) {
				next.reject(toAbortError(next.signal));
				continue;
			}
			next.resolve(createRelease());
			return;
		}
		active -= 1;
	};
	const createRelease = () => {
		let released = false;
		return () => {
			if (released) return;
			released = true;
			releaseNext();
		};
	};
	return {
		get full() {
			return active >= maxConcurrent;
		},
		get waiting() {
			return waiters.length > 0;
		},
		acquire: async (signal) => {
			if (signal?.aborted) throw toAbortError(signal);
			if (active < maxConcurrent) {
				active += 1;
				return createRelease();
			}
			return await new Promise((resolve, reject) => {
				const waiter = {
					signal,
					resolve,
					reject,
					abort: () => {
						const index = waiters.indexOf(waiter);
						if (index >= 0) waiters.splice(index, 1);
						reject(toAbortError(signal));
					}
				};
				waiters.push(waiter);
				signal?.addEventListener("abort", waiter.abort, { once: true });
				if (signal?.aborted) waiter.abort();
			});
		}
	};
}
const vectorKnnAdmission = createVectorKnnAdmission(MAX_CONCURRENT_VECTOR_KNN_CHILDREN);
const databaseAdmissions = /* @__PURE__ */ new Map();
const children = /* @__PURE__ */ new Map();
function setChildReferenced(child, referenced) {
	child[referenced ? "ref" : "unref"]();
	for (const pipe of [
		child.stdin,
		child.stdout,
		child.stderr
	]) {
		if (referenced && "ref" in pipe && typeof pipe.ref === "function") pipe.ref();
		if (!referenced && "unref" in pipe && typeof pipe.unref === "function") pipe.unref();
	}
}
function parseChildResult(output, maxRows, id) {
	let parsed;
	try {
		parsed = JSON.parse(output.toString("utf8"));
	} catch {
		throw new VectorKnnSubprocessError("memory vector KNN child returned malformed JSON", "protocol");
	}
	if (!parsed || typeof parsed !== "object" || !("status" in parsed) || !("id" in parsed) || parsed.id !== id) throw new VectorKnnSubprocessError("memory vector KNN child returned an invalid envelope", "protocol");
	if (parsed.status === "failed" && "error" in parsed && typeof parsed.error === "string") throw new VectorKnnSubprocessError(parsed.error || "memory vector KNN child failed", "failed");
	const value = "value" in parsed ? parsed.value : void 0;
	if (parsed.status !== "ok" || !value || typeof value !== "object" || !("rows" in value) || !Array.isArray(value.rows) || value.rows.length > maxRows || !value.rows.every(isVectorKnnRow) || !("fallbackScanRequired" in value) || typeof value.fallbackScanRequired !== "boolean") throw new VectorKnnSubprocessError("memory vector KNN child returned an invalid result", "protocol");
	return {
		rows: value.rows,
		fallbackScanRequired: value.fallbackScanRequired
	};
}
/** Run one file-backed KNN query in a bounded, OS-killable child process. */
async function runVectorKnnInSubprocess(params) {
	let entry = databaseAdmissions.get(params.databasePath);
	if (!entry) {
		entry = {
			admission: createVectorKnnAdmission(1),
			users: 0
		};
		databaseAdmissions.set(params.databasePath, entry);
	}
	entry.users += 1;
	let release;
	try {
		release = await entry.admission.acquire(params.signal);
		return await runAdmittedVectorKnn(params);
	} finally {
		release?.();
		if (--entry.users === 0) databaseAdmissions.delete(params.databasePath);
	}
}
async function runAdmittedVectorKnn(params) {
	if (params.signal?.aborted) throw toAbortError(params.signal);
	const sqliteLibrary = ensureSqliteLibrarySelected();
	const input = {
		id: (children.get(params.databasePath)?.requestId ?? 0) + 1,
		databasePath: params.databasePath,
		extensionPath: params.extensionPath,
		...sqliteLibrary.source !== "runtime" ? { sqliteLibraryPath: sqliteLibrary.path } : {},
		request: params.request
	};
	const inputPayload = Buffer.from(JSON.stringify(input), "utf8");
	if (inputPayload.byteLength > MAX_STDIN_BYTES) throw new VectorKnnSubprocessError("memory vector KNN child input is too large", "protocol");
	let worker = children.get(params.databasePath);
	if (!worker) {
		if (vectorKnnAdmission.full) {
			const idleWorker = [...children.values()].find((candidate) => candidate.idleTimer);
			if (idleWorker) idleWorker.retire();
		}
		const releaseAdmission = await vectorKnnAdmission.acquire(params.signal);
		if (params.signal?.aborted) {
			releaseAdmission();
			throw toAbortError(params.signal);
		}
		let child;
		try {
			const childUrl = resolveRuntimeWorkerUrl(vectorKnnProcessEntrypoint);
			child = spawn(process.execPath, resolveRuntimeWorkerArgv(childUrl), {
				env: buildChildEnv(),
				shell: false,
				stdio: [
					"pipe",
					"pipe",
					"pipe"
				],
				windowsHide: true
			});
		} catch (error) {
			releaseAdmission();
			throw new VectorKnnSubprocessError(error instanceof Error ? error.message : String(error), "unavailable");
		}
		worker = {
			child,
			requestId: 0,
			retire: () => {
				if (children.get(params.databasePath) !== ownedWorker) return;
				setChildReferenced(child, true);
				children.delete(params.databasePath);
				clearTimeout(ownedWorker.idleTimer);
				child.stdin.destroy();
				child.kill("SIGKILL");
			}
		};
		const ownedWorker = worker;
		child.once("close", () => {
			clearTimeout(ownedWorker.idleTimer);
			if (children.get(params.databasePath) === ownedWorker) children.delete(params.databasePath);
			releaseAdmission();
		});
		child.on("error", ownedWorker.retire);
		child.stdin.on("error", ownedWorker.retire);
		children.set(params.databasePath, worker);
	}
	const { child } = worker;
	const ownedWorker = worker;
	worker.requestId = input.id;
	clearTimeout(worker.idleTimer);
	worker.idleTimer = void 0;
	child.stdout.removeAllListeners("data");
	setChildReferenced(child, true);
	return await new Promise((resolve, reject) => {
		const stdoutChunks = [];
		const stderrChunks = [];
		let stdoutBytes = 0;
		let stderrBytes = 0;
		let closed = false;
		let callerSettled = false;
		let terminationReason;
		let killExitTimer;
		const clearKillExitTimer = () => {
			if (killExitTimer) {
				clearTimeout(killExitTimer);
				killExitTimer = void 0;
			}
		};
		const settleCaller = (action) => {
			if (callerSettled) return;
			callerSettled = true;
			params.signal?.removeEventListener("abort", abort);
			child.stdout.removeAllListeners("data");
			child.stderr.removeAllListeners("data");
			child.stdin.removeListener("error", onStdinError);
			child.removeListener("error", onError);
			child.removeListener("close", onClose);
			action();
		};
		const releaseClosedChild = () => {
			clearKillExitTimer();
			params.signal?.removeEventListener("abort", abort);
		};
		const requestTermination = (reason) => {
			if (terminationReason || closed) return;
			terminationReason = reason;
			ownedWorker.retire();
			killExitTimer = setTimeout(() => {
				if (!closed) {
					child.stdin.destroy();
					child.stdout.destroy();
					child.stderr.destroy();
					child.unref();
					settleCaller(() => reject(new VectorKnnSubprocessError("memory vector KNN child did not exit after SIGKILL", "termination-timeout")));
				}
			}, KILL_EXIT_TIMEOUT_MS);
		};
		const abort = () => {
			requestTermination(toAbortError(params.signal));
		};
		params.signal?.addEventListener("abort", abort, { once: true });
		if (params.signal?.aborted) abort();
		child.stdout.on("data", (chunk) => {
			stdoutBytes += chunk.byteLength;
			if (stdoutBytes > MAX_STDOUT_BYTES + (chunk[chunk.length - 1] === 10 ? 1 : 0)) {
				const failure = new VectorKnnSubprocessError("memory vector KNN child stdout exceeded its limit", "protocol");
				stdoutChunks.length = 0;
				requestTermination(failure);
				return;
			}
			stdoutChunks.push(chunk);
			const newline = chunk.indexOf(10);
			if (newline < 0) return;
			try {
				if (newline !== chunk.length - 1) throw new VectorKnnSubprocessError("memory vector KNN child returned extra output", "protocol");
				const result = parseChildResult(Buffer.concat(stdoutChunks), params.request.limit, input.id);
				if (terminationReason) return;
				settleCaller(() => resolve(result));
				child.stdout.on("data", ownedWorker.retire);
				ownedWorker.idleTimer = setTimeout(ownedWorker.retire, SQLITE_IDLE_HANDLE_TTL_MS);
				ownedWorker.idleTimer.unref();
				if (vectorKnnAdmission.waiting) ownedWorker.retire();
				else setChildReferenced(child, false);
			} catch (error) {
				requestTermination(error instanceof Error ? error : new Error(String(error)));
			}
		});
		child.stderr.on("data", (chunk) => {
			stderrBytes += chunk.byteLength;
			if (stderrBytes > MAX_STDERR_BYTES) {
				const failure = new VectorKnnSubprocessError("memory vector KNN child stderr exceeded its limit", "protocol");
				requestTermination(failure);
				return;
			}
			stderrChunks.push(chunk);
		});
		const onStdinError = (error) => {
			if (!terminationReason && error.code !== "EPIPE") requestTermination(new VectorKnnSubprocessError(error.message, "failed"));
		};
		child.stdin.on("error", onStdinError);
		const onError = (error) => {
			requestTermination(new VectorKnnSubprocessError(error.message, "unavailable"));
		};
		child.once("error", onError);
		const onClose = (code, signal) => {
			closed = true;
			releaseClosedChild();
			settleCaller(() => {
				if (terminationReason) {
					reject(terminationReason);
					return;
				}
				const stderr = Buffer.concat(stderrChunks).toString("utf8").trim();
				reject(new VectorKnnSubprocessError(`memory vector KNN child exited before returning a result (code ${code}, signal ${signal ?? "none"})${stderr ? `: ${stderr}` : ""}`, "failed"));
			});
		};
		child.once("close", onClose);
		child.stdin.write(Buffer.concat([inputPayload, Buffer.from("\n")]));
	});
}
//#endregion
//#region extensions/memory-core/src/memory/manager-search-preflight.ts
function resolveMemorySearchPreflight(params) {
	const normalizedQuery = params.query.trim();
	if (!normalizedQuery) return {
		normalizedQuery,
		shouldInitializeProvider: false,
		shouldSearch: false
	};
	if (!params.hasIndexedContent) return {
		normalizedQuery,
		shouldInitializeProvider: false,
		shouldSearch: false
	};
	return {
		normalizedQuery,
		shouldInitializeProvider: true,
		shouldSearch: true
	};
}
//#endregion
//#region extensions/memory-core/src/memory/manager-search-orchestration.ts
const SNIPPET_MAX_CHARS = 700;
const SEARCH_CANDIDATE_UNIVERSE = 200;
const VECTOR_TABLE = MEMORY_INDEX_VECTOR_TABLE;
const log$1 = createSubsystemLogger("memory");
var MemorySearchOrchestration = class extends MemoryKeywordRetrieval {
	claimSessionWarmSync(sessionKey) {
		if (!this.settings.sync.onSessionStart) return false;
		const key = sessionKey?.trim() || "";
		if (key && this.sessionWarm.has(key)) return false;
		if (key) this.sessionWarm.add(key);
		return this.dirty || this.sessionsDirty;
	}
	async search(query, opts) {
		const normalizedQuery = query.trim();
		if (!normalizedQuery) return [];
		const maxResults = opts?.maxResults ?? this.settings.query.maxResults;
		const minScore = opts?.minScore ?? this.settings.query.minScore;
		const candidateMaxResults = (opts?.activeProjectKeys?.length ?? 0) > 0 ? SEARCH_CANDIDATE_UNIVERSE : Math.max(SEARCH_CANDIDATE_UNIVERSE, maxResults);
		const selectResults = (results) => results.slice(0, maxResults).map(({ sourceMtime: _sourceMtime, ...result }) => result);
		return selectResults(await this.searchCandidates(normalizedQuery, {
			...opts,
			maxResults: candidateMaxResults,
			minScore,
			onPartialResults: opts?.onPartialResults ? (partial) => opts.onPartialResults?.(partial && selectResults(partial)) : void 0
		}));
	}
	async readFile(params) {
		const access = this.memoryFiles ? void 0 : getAgentWorkspaceAccess(this.workspaceDir, "memoryFiles");
		const files = this.memoryFiles ?? access?.memoryFiles;
		files?.assertCurrent();
		return await (files?.readFile ?? readMemoryFile)({
			workspaceDir: this.workspaceDir,
			extraPaths: this.settings.extraPaths,
			relPath: params.relPath,
			from: params.from,
			lines: params.lines
		});
	}
	async searchCandidates(normalizedQuery, opts) {
		const minScore = opts?.minScore ?? this.settings.query.minScore;
		const maxResults = opts?.maxResults ?? this.settings.query.maxResults;
		const searchSources = opts?.sources && opts.sources.length > 0 ? uniqueValues(opts.sources).filter((source) => this.sources.has(source)) : void 0;
		const sourceFilterAllowed = !opts?.sources?.length || (searchSources?.length ?? 0) > 0;
		const sourceFilterList = searchSources ?? this.settings.searchSources;
		const hybrid = this.settings.query.hybrid;
		const candidates = Math.min(200, Math.max(1, Math.floor(maxResults * hybrid.candidateMultiplier)));
		const keywordOptions = {
			boostFallbackRanking: true,
			signal: opts?.signal
		};
		let preparedKeyword;
		let releaseGeneration;
		const releaseReadGeneration = async () => {
			const release = releaseGeneration;
			releaseGeneration = void 0;
			preparedKeyword = void 0;
			await release?.();
		};
		const readIndexState = async () => {
			releaseGeneration ??= await acquireMemoryIndexReadGeneration(this.settings.store.databasePath, opts?.signal);
			preparedKeyword = void 0;
			if (sourceFilterAllowed && this.fts.enabled && this.fts.available && (opts?.lexicalOnly || hybrid.enabled || this.providerRequirement.mode === "fts-only" || this.providerInitialized && !this.provider || this.embeddingBootstrapFailure !== void 0)) {
				const prepared = await this.prepareKeywordSearch(normalizedQuery, candidates, keywordOptions, sourceFilterList);
				preparedKeyword = prepared.keyword;
				return prepared.indexState;
			}
			return await this.readRetrievalIndexState(opts?.signal);
		};
		const runSearch = async () => {
			opts?.onDebug?.({ backend: "builtin" });
			if (this.providerRequirement.mode === "required") {
				await this.ensureProviderInitialized();
				this.assertRequiredProviderAvailable("search");
			}
			let indexState = await readIndexState();
			let hasIndexedContent = this.hasIndexedContent(indexState);
			if (!hasIndexedContent) {
				await releaseReadGeneration();
				try {
					await this.syncAdmitted({ reason: "search-bootstrap" }, { allowEmbeddingBootstrapFallback: true });
				} catch (err) {
					if (err instanceof WorkerTaskError && err.code === "overloaded") throw err;
					if (this.providerRequirement.mode === "optional" && this.shouldFallbackOnError(err)) {
						const failedProvider = this.provider?.id ?? this.settings.provider;
						await this.retireCurrentProvider().catch((retireErr) => {
							const message = redactSensitiveText(formatErrorMessage(retireErr), { mode: "tools" });
							log$1.warn(`memory search-bootstrap: failed to retire embedding provider: ${message}`);
						});
						this.markEmbeddingBootstrapFailure(err, { provider: failedProvider });
						await this.syncAdmitted({ reason: "search-bootstrap" }).catch((fallbackErr) => {
							if (fallbackErr instanceof WorkerTaskError && fallbackErr.code === "overloaded") throw fallbackErr;
							const message = redactSensitiveText(formatErrorMessage(fallbackErr), { mode: "tools" });
							log$1.warn(`memory sync failed (search-bootstrap-fallback): ${message}`);
						});
					} else log$1.warn(`memory sync failed (search-bootstrap): ${String(err)}`);
				}
				indexState = await readIndexState();
				hasIndexedContent = this.hasIndexedContent(indexState);
			}
			const preflight = resolveMemorySearchPreflight({
				query: normalizedQuery,
				hasIndexedContent
			});
			if (!preflight.shouldSearch) {
				if (this.embeddingBootstrapFailure) opts?.onDebug?.({
					backend: "builtin",
					embeddingBootstrap: this.embeddingBootstrapFailure
				});
				return [];
			}
			const cleaned = preflight.normalizedQuery;
			const recoveringEmbeddingProvider = this.embeddingBootstrapFailure !== void 0;
			if (recoveringEmbeddingProvider) await releaseReadGeneration();
			const embeddingBootstrapKeywordOnly = await this.ensureEmbeddingProviderForSearch(indexState, opts?.onDebug);
			if (recoveringEmbeddingProvider) indexState = await readIndexState();
			const sessionStartSync = this.claimSessionWarmSync(opts?.sessionKey);
			const searchSyncEnabled = (this.settings.sync.onSearch || sessionStartSync) && (this.purpose === "default" || this.purpose === "cli");
			if (!embeddingBootstrapKeywordOnly && preflight.shouldInitializeProvider && !this.provider && (this.providerLifecycle.mode === "pending" || this.providerLifecycle.mode === "degraded" && this.providerLifecycle.providerId !== this.settings.provider)) {
				this.resetProviderInitializationForRetry();
				await this.ensureProviderInitialized();
			}
			this.assertRequiredProviderAvailable("search");
			if (!embeddingBootstrapKeywordOnly && !this.provider && this.providerLifecycle.mode === "degraded") {
				if (await this.activateFallbackProvider(this.providerLifecycle.reason).catch((fallbackErr) => {
					log$1.warn(`memory search: failed to activate fallback provider: ${formatErrorMessage(fallbackErr)}`);
					return false;
				})) this.refreshIndexIdentityDirty({
					providerKeyKnown: this.providerInitialized,
					indexState
				});
			}
			const indexIdentity = embeddingBootstrapKeywordOnly ? this.refreshKeywordFallbackIndexIdentity(indexState) : this.refreshIndexIdentityDirty({
				providerKeyKnown: this.providerInitialized,
				indexState
			});
			const shouldRepairIdentity = hasIndexedContent && (indexIdentity.status === "missing" || searchSyncEnabled && indexIdentity.status === "mismatched" && indexIdentity.owner === "openclaw" && indexIdentity.versionOrder === "older");
			if (shouldRepairIdentity) {
				await releaseReadGeneration();
				this.recordAutomaticRebuild();
				await this.syncAdmitted({ reason: "search" }, { allowEmbeddingBootstrapFallback: true }).catch((err) => {
					if (err instanceof WorkerTaskError && err.code === "overloaded") throw err;
					log$1.warn(`memory sync failed (search-identity-repair): ${formatErrorMessage(err)}`);
				});
				indexState = await readIndexState();
			}
			let repairedIndexIdentity = shouldRepairIdentity ? embeddingBootstrapKeywordOnly ? this.refreshKeywordFallbackIndexIdentity(indexState) : this.refreshIndexIdentityDirty({
				providerKeyKnown: this.providerInitialized,
				indexState
			}) : indexIdentity;
			if (repairedIndexIdentity.status === "mismatched" && !embeddingBootstrapKeywordOnly && await this.adoptPublishedFallbackProviderIfMatched(indexState)) repairedIndexIdentity = this.refreshIndexIdentityDirty({
				providerKeyKnown: this.providerInitialized,
				indexState
			});
			const chunkingUpgradePendingKeywordOnly = (state) => state.status === "mismatched" && state.owner === "openclaw" && state.code === "chunking_version" && state.versionOrder === "older" && state.chunkingVersionOnly === true && this.fts.enabled && this.fts.available;
			if (repairedIndexIdentity.status !== "valid") {
				if (!chunkingUpgradePendingKeywordOnly(repairedIndexIdentity)) return [];
				log$1.warn("memory search: chunking upgrade rebuild is pending; serving the existing keyword index");
			}
			if (this.memoryWatchCapacityDegraded || this.memoryWatchUnavailable) this.dirty = true;
			const capacitySyncInFlight = (this.memoryWatchCapacityDegraded || this.memoryWatchUnavailable) && this.activeBackgroundSearchSyncs.size > 0;
			if (searchSyncEnabled && !capacitySyncInFlight && !chunkingUpgradePendingKeywordOnly(repairedIndexIdentity) && (this.dirty || this.sessionsDirty)) {
				const trackedSearchSync = this.syncPublishedIndexInBackground({ reason: "search" }).catch((err) => {
					log$1.warn(`memory sync failed (search): ${String(err)}`);
				}).finally(() => {
					this.activeBackgroundSearchSyncs.delete(trackedSearchSync);
				});
				this.activeBackgroundSearchSyncs.add(trackedSearchSync);
			}
			let effectiveIdentity = repairedIndexIdentity;
			for (let identityAttempt = 0; identityAttempt < 2; identityAttempt += 1) {
				if (!releaseGeneration) indexState = await readIndexState();
				const leasedIdentity = embeddingBootstrapKeywordOnly ? this.refreshKeywordFallbackIndexIdentity(indexState) : this.refreshIndexIdentityDirty({
					providerKeyKnown: this.providerInitialized,
					indexState
				});
				effectiveIdentity = leasedIdentity;
				if (leasedIdentity.status === "valid" || chunkingUpgradePendingKeywordOnly(leasedIdentity)) break;
				await releaseReadGeneration();
				if (embeddingBootstrapKeywordOnly || identityAttempt > 0 || leasedIdentity.status !== "mismatched" || !await this.adoptPublishedFallbackProviderIfMatched(indexState)) return [];
			}
			if (!sourceFilterAllowed) return [];
			const finalizeKeywords = (results) => this.finalizeKeywordOnlyResults({
				results,
				temporalDecay: hybrid.temporalDecay,
				maxResults,
				minScore,
				activeProjectKeys: opts?.activeProjectKeys
			});
			const keywordOnly = embeddingBootstrapKeywordOnly || chunkingUpgradePendingKeywordOnly(effectiveIdentity) || !this.provider || opts?.lexicalOnly;
			if (chunkingUpgradePendingKeywordOnly(effectiveIdentity)) opts?.onDebug?.({
				backend: "builtin",
				effectiveMode: "keyword-only"
			});
			const loadKeywordResults = async () => {
				const initialResult = preparedKeyword;
				preparedKeyword = void 0;
				const results = (keywordOnly || hybrid.enabled) && this.fts.enabled && this.fts.available ? await this.searchKeywordWithFallback(cleaned, candidates, keywordOptions, sourceFilterList, initialResult).catch((err) => {
					opts?.signal?.throwIfAborted();
					if (err instanceof WorkerTaskError && err.code === "overloaded") throw err;
					log$1.warn(`memory search: FTS keyword query failed: ${formatErrorMessage(err)}`);
					return [];
				}) : [];
				if (!keywordOnly && opts?.onPartialResults) {
					const memoryResults = results.filter((entry) => entry.source === "memory");
					if (memoryResults.length > 0) opts.onPartialResults(await finalizeKeywords(memoryResults));
				}
				return results;
			};
			if (keywordOnly || !this.provider) {
				this.assertRequiredProviderAvailable("search");
				if (!this.fts.enabled || !this.fts.available) {
					log$1.warn("memory search: keyword-only search has no available FTS index");
					return [];
				}
				return await finalizeKeywords(await loadKeywordResults());
			}
			let semanticProvider = this.provider;
			let semanticProviderRuntime = this.providerRuntime;
			let vectorProviderIdentity = {
				model: semanticProvider.model,
				aliases: this.resolveProviderIndexIdentities().slice(1).map((identity) => identity.model)
			};
			let keywordResults = [];
			let queryVec;
			const releaseSemanticProvider = this.acquireProviderUse(semanticProvider);
			try {
				keywordResults = await loadKeywordResults();
				try {
					queryVec = await this.embedQueryWithRetry(cleaned, opts?.signal, semanticProvider, false, semanticProviderRuntime, opts?.[MEMORY_SEARCH_DEADLINE_CONTROL]);
				} catch (err) {
					releaseSemanticProvider();
					if (opts?.signal?.aborted) throw err;
					opts?.onPartialResults?.(null);
					this.markLocalEmbeddingProviderDegraded(err);
					const message = formatErrorMessage(err);
					if (this.shouldFallbackOnError(err) ? await this.activateFallbackProvider(message).catch((fallbackErr) => {
						log$1.warn(`memory search: failed to activate fallback provider: ${formatErrorMessage(fallbackErr)}`);
						return false;
					}) : false) {
						if (this.refreshIndexIdentityDirty({
							providerKeyKnown: this.providerInitialized,
							indexState
						}).status !== "valid") return [];
						if (!this.provider) return [];
						semanticProvider = this.provider;
						semanticProviderRuntime = this.providerRuntime;
						vectorProviderIdentity = {
							model: semanticProvider.model,
							aliases: this.resolveProviderIndexIdentities().slice(1).map((identity) => identity.model)
						};
						const releaseFallbackProvider = this.acquireProviderUse(semanticProvider);
						try {
							keywordResults = await loadKeywordResults();
							try {
								queryVec = await this.embedQueryWithRetry(cleaned, opts?.signal, semanticProvider, false, semanticProviderRuntime, opts?.[MEMORY_SEARCH_DEADLINE_CONTROL]);
							} catch (fallbackErr) {
								releaseFallbackProvider();
								if (!opts?.signal?.aborted) this.markLocalEmbeddingProviderDegraded(fallbackErr);
								throw fallbackErr;
							}
						} finally {
							releaseFallbackProvider();
						}
					} else if (!this.provider && this.fts.enabled && this.fts.available) {
						this.assertRequiredProviderAvailable("search");
						log$1.warn(`memory search: embeddings unavailable; using keyword-only results: ${message}`);
						return await finalizeKeywords(keywordResults);
					} else throw err;
				}
			} finally {
				releaseSemanticProvider();
			}
			const vectorResults = queryVec.some((v) => v !== 0) ? await this.searchVector(queryVec, candidates, sourceFilterList, vectorProviderIdentity, indexState, opts?.signal).catch((err) => {
				opts?.signal?.throwIfAborted();
				if (err instanceof WorkerTaskError && err.code === "overloaded") throw err;
				log$1.warn(`memory search: vector query failed: ${formatErrorMessage(err)}`);
				return [];
			}) : [];
			if (!hybrid.enabled || !this.fts.enabled || !this.fts.available) {
				const decayed = await applyTemporalDecayToHybridResults({
					results: vectorResults,
					temporalDecay: hybrid.temporalDecay,
					workspaceDir: this.workspaceDir,
					sessionSourceMtimes: this.loadSessionSourceMtimes(vectorResults),
					memorySourceMtimes: this.loadRemoteMemorySourceMtimes(vectorResults)
				});
				const activeProjects = prepareActiveProjectKeys(opts?.activeProjectKeys);
				return applyProjectRanking(applyImportanceMultiplier(decayed), activeProjects).filter((entry) => entry.score >= minScore).toSorted((left, right) => right.score - left.score || left.path.localeCompare(right.path) || left.startLine - right.startLine || left.endLine - right.endLine).slice(0, maxResults);
			}
			return selectHybridSearchResults({
				merged: await this.mergeHybridResults({
					query: cleaned,
					vector: vectorResults,
					keyword: keywordResults,
					vectorWeight: hybrid.vectorWeight,
					textWeight: hybrid.textWeight,
					mmr: hybrid.mmr,
					temporalDecay: hybrid.temporalDecay,
					activeProjectKeys: opts?.activeProjectKeys
				}),
				keyword: keywordResults,
				maxResults,
				minScore
			});
		};
		return await this.withManagerOperation(async () => {
			try {
				return await runSearch();
			} finally {
				await releaseReadGeneration();
			}
		});
	}
	hasIndexedContent(state) {
		return state.hasIndexedChunks || this.fts.enabled && this.fts.available && state.hasFtsContent;
	}
	async searchVector(queryVec, limit, sourceFilterList, providerIdentity, indexState, signal) {
		const results = await searchVector({
			vectorTable: VECTOR_TABLE,
			providerModel: providerIdentity.model,
			providerModelAliases: providerIdentity.aliases,
			queryVec,
			limit,
			snippetMaxChars: SNIPPET_MAX_CHARS,
			signal,
			ensureVectorReady: async (dimensions) => {
				if (!this.vector.enabled) return false;
				if (indexState.vectorState.state === "incomplete" || indexState.vectorState.state === "unverified") {
					this.markConfiguredSourcesForFullReindex();
					return false;
				}
				return indexState.vectorState.state === "complete" && (indexState.meta?.vectorDims === void 0 || indexState.meta.vectorDims === dimensions);
			},
			runFallback: () => runMemoryVectorFallback({
				agentId: this.agentId,
				databasePath: resolveUserPath(this.settings.store.databasePath)
			}, {
				providerModel: providerIdentity.model,
				providerModelAliases: providerIdentity.aliases,
				queryVec,
				limit,
				snippetMaxChars: SNIPPET_MAX_CHARS,
				sourceFilter: this.buildSourceFilter(void 0, sourceFilterList)
			}, signal),
			runVectorKnn: async (request, knnSignal) => {
				const response = await runVectorKnnInSubprocess({
					databasePath: resolveUserPath(this.settings.store.databasePath),
					extensionPath: this.vector.extensionPath,
					request,
					signal: knnSignal
				});
				if (!response.fallbackScanRequired) {
					this.vector.available = true;
					this.vector.semanticAvailable = true;
					this.vector.dims = queryVec.length;
					this.vector.loadError = void 0;
				}
				return response;
			},
			sourceFilterVec: this.buildSourceFilter("c", sourceFilterList)
		});
		return this.attachRecallMetadata(results, signal, sourceFilterList);
	}
	mergeHybridResults(params) {
		return mergeHybridResults({
			...projectHybridCandidates(params.query, params.vector, params.keyword),
			vectorWeight: params.vectorWeight,
			textWeight: params.textWeight,
			isNonTextMediaPath: (path) => classifyMemoryMultimodalPath(path, this.settings.multimodal) !== null,
			mmr: params.mmr,
			temporalDecay: params.temporalDecay,
			activeProjectKeys: params.activeProjectKeys,
			workspaceDir: this.workspaceDir,
			sessionSourceMtimes: this.loadSessionSourceMtimes([...params.keyword, ...params.vector]),
			memorySourceMtimes: this.loadRemoteMemorySourceMtimes([...params.keyword, ...params.vector])
		});
	}
};
//#endregion
//#region extensions/memory-core/src/memory/manager-status-state.ts
/** Read only for explicit diagnostics: retained cache payloads can be large even when disabled. */
function collectMemoryStorageStatus(db, databasePath) {
	const query = getNodeSqliteKysely(db).selectFrom("memory_embedding_cache").select((eb) => [eb.fn.countAll().as("entries"), eb.fn.coalesce(eb.fn.sum(eb.fn("octet_length", ["embedding"])), eb.val(0)).as("bytes")]);
	const cache = executeSqliteQuerySync(db, query).rows[0];
	const pageSize = Number(db.prepare("PRAGMA page_size").get()?.page_size);
	const freePages = Number(db.prepare("PRAGMA freelist_count").get()?.freelist_count);
	return {
		databaseBytes: fs.statSync(databasePath, { throwIfNoEntry: false })?.size ?? 0,
		walBytes: fs.statSync(`${databasePath}-wal`, { throwIfNoEntry: false })?.size ?? 0,
		reusableBytes: freePages * pageSize,
		embeddingCacheBytes: cache.bytes,
		embeddingCacheEntries: cache.entries
	};
}
function resolveStatusProviderInfo(params) {
	if (params.provider) return {
		provider: params.provider.id,
		model: params.provider.model,
		searchMode: "hybrid"
	};
	if (params.providerInitialized) return {
		provider: "none",
		model: void 0,
		searchMode: "fts-only"
	};
	return {
		provider: params.requestedProvider,
		model: params.resolveConfiguredModel?.() || void 0,
		searchMode: "hybrid"
	};
}
function collectMemoryStatusAggregate(params) {
	const totals = {
		files: 0,
		chunks: 0
	};
	const emptyCounts = {
		...totals,
		...params.includeChunkBytes ? { chunkBytes: 0 } : {}
	};
	const bySource = /* @__PURE__ */ new Map();
	const chunkBytes = params.includeChunkBytes ? "COALESCE(SUM(octet_length(text) + octet_length(embedding)), 0)" : "NULL";
	const sourceFilterSql = params.sourceFilterSql ?? "";
	const query = `SELECT 'files' AS kind, source, COUNT(*) as c, 0 AS bytes FROM memory_index_sources WHERE 1=1${sourceFilterSql} GROUP BY source\nUNION ALL\nSELECT 'chunks' AS kind, source, COUNT(*) as c, ${chunkBytes} AS bytes FROM memory_index_chunks WHERE 1=1${sourceFilterSql} GROUP BY source`;
	const filterParams = params.sourceFilterParams ?? [];
	const rows = params.db.prepare(query).all(...filterParams, ...filterParams);
	for (const row of rows) {
		const entry = bySource.get(row.source) ?? { ...emptyCounts };
		entry[row.kind] = row.c;
		totals[row.kind] += row.c;
		if (row.kind === "chunks" && row.bytes !== null) entry.chunkBytes = row.bytes;
		bySource.set(row.source, entry);
	}
	return {
		...totals,
		sourceCounts: Array.from(params.sources, (source) => Object.assign({
			source,
			...emptyCounts
		}, bySource.get(source)))
	};
}
//#endregion
//#region extensions/memory-core/src/memory/manager-sync-control.ts
function hasTargetedSessionSyncParams(params) {
	return Boolean(params?.sessions?.some((session) => session.sessionId.trim().length > 0) || params?.archiveFiles?.some((sessionFile) => sessionFile.trim().length > 0));
}
function enqueueMemoryTargetedSessionSync(state, targets) {
	const queuedArchiveFiles = state.getQueuedArchiveFiles();
	for (const sessionFile of targets?.archiveFiles ?? []) {
		const trimmed = sessionFile.trim();
		if (trimmed) queuedArchiveFiles.add(trimmed);
	}
	const queuedSessions = state.getQueuedSessions();
	for (const session of targets?.sessions ?? []) {
		const normalized = normalizeQueuedMemorySessionSyncTarget(session);
		if (normalized) queuedSessions.set(memorySessionSyncTargetKey(normalized), normalized);
	}
	if (queuedArchiveFiles.size === 0 && queuedSessions.size === 0) return state.getSyncing() ?? Promise.resolve();
	if (targets?.force) state.setQueuedForce(true);
	if (targets?.progress) state.getQueuedProgressCallbacks().add(targets.progress);
	if (!state.getQueuedSessionSync()) state.setQueuedSessionSync((async () => {
		try {
			await state.getSyncing()?.catch(() => void 0);
			while (!state.isClosed() && (state.getQueuedArchiveFiles().size > 0 || state.getQueuedSessions().size > 0)) {
				const pendingArchiveFiles = Array.from(state.getQueuedArchiveFiles());
				const pendingSessions = Array.from(state.getQueuedSessions().values());
				const pendingForce = state.getQueuedForce();
				const pendingProgressCallbacks = Array.from(state.getQueuedProgressCallbacks());
				state.getQueuedArchiveFiles().clear();
				state.getQueuedSessions().clear();
				state.setQueuedForce(false);
				state.getQueuedProgressCallbacks().clear();
				const progress = pendingProgressCallbacks.length > 0 ? (update) => {
					for (const callback of pendingProgressCallbacks) callback(update);
				} : void 0;
				try {
					await state.sync({
						reason: "queued-sessions",
						...pendingForce ? { force: true } : {},
						sessions: pendingSessions,
						archiveFiles: pendingArchiveFiles,
						...progress ? { progress } : {}
					});
				} catch (err) {
					for (const archiveFile of pendingArchiveFiles) state.getQueuedArchiveFiles().add(archiveFile);
					for (const session of pendingSessions) state.getQueuedSessions().set(memorySessionSyncTargetKey(session), session);
					if (pendingForce) state.setQueuedForce(true);
					state.getQueuedProgressCallbacks().clear();
					throw err;
				}
			}
		} finally {
			if (state.isClosed()) {
				state.getQueuedArchiveFiles().clear();
				state.getQueuedSessions().clear();
				state.setQueuedForce(false);
				state.getQueuedProgressCallbacks().clear();
			}
			state.setQueuedSessionSync(null);
		}
	})());
	return state.getQueuedSessionSync() ?? Promise.resolve();
}
function normalizeQueuedMemorySessionSyncTarget(target) {
	const sessionId = target.sessionId.trim();
	if (!sessionId) return null;
	const agentId = target.agentId?.trim();
	const sessionKey = target.sessionKey?.trim();
	return {
		...agentId ? { agentId } : {},
		sessionId,
		...sessionKey ? { sessionKey } : {}
	};
}
function memorySessionSyncTargetKey(target) {
	return [
		target.agentId ?? "",
		target.sessionId,
		target.sessionKey ?? ""
	].join("\0");
}
//#endregion
//#region extensions/memory-core/src/memory/manager.ts
const log = createSubsystemLogger("memory");
var MemoryIndexManager = class MemoryIndexManager extends MemorySearchOrchestration {
	releaseProvider(provider) {
		this.managerRegistry.releaseProvider(this, provider);
	}
	canPublishEmbeddingProbe() {
		return this.managerRegistry.canPublishProbe(this);
	}
	getEmbeddingProbeOwners() {
		return this.managerRegistry.getProbeOwners(this);
	}
	get embeddingProbeCache() {
		return this.managerRegistry.embeddingProbeCache;
	}
	static async get(params) {
		const source = params.maintenanceSource;
		const memoryFiles = source?.memoryFiles ?? params.memoryFiles;
		memoryFiles?.assertCurrent();
		const cfg = source?.cfg ?? params.cfg;
		const agentId = source?.agentId ?? normalizeAgentId(params.agentId);
		const purpose = normalizeMemoryIndexManagerPurpose(params.purpose);
		const managerRegistry = source?.managerRegistry ?? getMemoryIndexManagerRegistry();
		return await managerRegistry.acquire({
			agentId,
			purpose
		}, { prepare: () => {
			const settings = source?.settings ?? resolveMemorySearchConfig(cfg, agentId);
			if (!settings) return null;
			const workspaceDir = source?.workspaceDir ?? resolveAgentWorkspaceDir(cfg, agentId);
			const providerRequirement = source?.providerRequirement ?? resolveMemoryEmbeddingProviderRequirement({
				cfg,
				agentId,
				settings
			});
			const key = resolveMemoryIndexManagerCacheKey({
				agentId,
				workspaceDir,
				settings,
				providerRequirement,
				purpose,
				acquireLocalService: params.acquireLocalService
			});
			const databaseOptions = MemoryIndexDatabase.captureWriteOptions(agentId, settings.store.databasePath, source?.publishedDatabase);
			return {
				key,
				create: async () => {
					let manager;
					try {
						const create = () => {
							manager = new MemoryIndexManager({
								managerRegistry,
								cacheKey: key,
								cfg,
								agentId,
								workspaceDir,
								memoryFiles,
								settings,
								providerRequirement,
								purpose,
								acquireLocalService: params.acquireLocalService,
								maintenanceSource: source,
								databaseOptions
							});
							managerRegistry.track(manager, key);
							return manager;
						};
						manager = purpose === "status" ? create() : await withOpenClawAgentDatabaseWrite(databaseOptions, create, source?.publishedDatabase.db);
						if (params.inspectSources) await manager.inspectDiagnosticSourceState();
						memoryFiles?.assertCurrent();
						return manager;
					} catch (error) {
						try {
							await manager?.close();
						} catch (cleanupError) {
							throw new AggregateError([error, cleanupError], "Memory manager preparation cleanup failed", { cause: cleanupError });
						}
						throw error;
					}
				},
				reuse: ({ closing, closed, db, memoryFiles: files }) => !closing && !closed && db.isOpen && files === memoryFiles
			};
		} });
	}
	constructor(params) {
		super(params.maintenanceSource?.automaticRebuildNotice);
		this.createProvider = (adapter, create) => this.managerRegistry.createProvider(this, adapter, create);
		this.providerInitPromise = null;
		this.providerInitialized = false;
		this.providerRetirementPromise = Promise.resolve();
		this.providersPendingRetirement = /* @__PURE__ */ new Set();
		this.closePromise = null;
		this.closeTeardownComplete = false;
		this.activeBackgroundSearchSyncs = /* @__PURE__ */ new Set();
		this.indexIdentityDirty = false;
		this.sessionWarm = /* @__PURE__ */ new Set();
		this.syncing = null;
		this.queuedArchiveFiles = /* @__PURE__ */ new Set();
		this.queuedSessions = /* @__PURE__ */ new Map();
		this.queuedForce = false;
		this.queuedProgressCallbacks = /* @__PURE__ */ new Set();
		this.queuedSessionSync = null;
		this.managerRegistry = params.managerRegistry;
		const source = params.maintenanceSource;
		const effectiveSettings = resolveEffectiveMemorySearchSettings(params.settings);
		const dbPath = params.databaseOptions.path;
		this.cacheKey = params.cacheKey;
		this.acquireLocalService = params.acquireLocalService;
		this.purpose = params.purpose;
		this.cfg = params.cfg;
		this.agentId = params.agentId;
		this.workspaceDir = params.workspaceDir;
		this.memoryFiles = params.memoryFiles;
		this.settings = {
			...effectiveSettings,
			store: {
				...effectiveSettings.store,
				databasePath: dbPath
			}
		};
		this.providerRequirement = params.providerRequirement;
		this.requestedProvider = effectiveSettings.provider;
		this.providerLifecycle = createPendingMemoryProviderLifecycle(this.requestedProvider);
		for (const memorySource of effectiveSettings.sources) this.sources.add(memorySource);
		const readOnly = this.purpose === "status";
		if (source && (!source.publishedDatabase.db.isOpen || this.purpose !== "maintenance")) throw new Error("Memory maintenance source connection is unavailable");
		this.publishedDatabase = MemoryIndexDatabase.openPublished({
			agentId: this.agentId,
			writeOptions: params.databaseOptions,
			readOnly,
			allowExtension: effectiveSettings.store.vector.enabled,
			maintenanceSource: source?.publishedDatabase
		});
		try {
			this.providerKey = this.computeProviderKey();
			this.cache = {
				enabled: effectiveSettings.cache.enabled,
				maxEntries: effectiveSettings.cache.maxEntries
			};
			this.fts.enabled = effectiveSettings.query.hybrid.enabled;
			if (source && (!this.fts.enabled || source.publishedDatabase.fts.available)) Object.assign(this.fts, source.publishedDatabase.fts);
			else if (this.purpose === "status") this.fts.available = this.fts.enabled && tableExists(this.db, "main", "memory_index_chunks_fts");
			else this.ensureSchema();
			this.vector.enabled = effectiveSettings.store.vector.enabled;
			this.vector.extensionPath = effectiveSettings.store.vector.extensionPath;
			const meta = this.readMeta();
			if (meta?.vectorDims) this.vector.dims = meta.vectorDims;
			this.indexIdentityState = this.resolveCurrentIndexIdentityState({
				meta,
				providerKeyKnown: false
			});
			this.indexIdentityDirty = this.indexIdentityState.status === "mismatched" || this.indexIdentityState.status === "missing" && this.sources.has("memory");
			const transient = isTransientMemoryIndexManagerPurpose(this.purpose);
			const invalidatedSources = new Set(this.db.prepare("SELECT DISTINCT source FROM memory_index_sources WHERE hash = ''").all().flatMap((row) => row.source === "memory" || row.source === "sessions" ? [row.source] : []));
			this.memorySourceProvenanceRepairPending = this.sources.has("memory") && invalidatedSources.has("memory");
			this.dirty = this.sources.has("memory") && (!transient || !meta) || this.memorySourceProvenanceRepairPending;
			if (this.sources.has("sessions") && invalidatedSources.has("sessions")) {
				this.sessionsDirty = true;
				this.sessionsFullRetryDirty = true;
			}
			this.batch = this.resolveBatchConfig();
			if (!transient) runInMemoryBackgroundContext(() => {
				this.ensureWatcher();
				this.ensureSessionListener();
				this.ensureIntervalSync();
				this.ensureSessionStartupCatchup();
			});
		} catch (err) {
			this.publishedDatabase.release();
			throw err;
		}
	}
	async sync(params) {
		if (this.purpose === "status") throw new Error("Memory status managers are read-only");
		if (this.closing || this.closed) return;
		return await this.withManagerOperation(async () => {
			if (hasTargetedSessionSyncParams(params) && (this.queuedSessionSync !== null || this.queuedArchiveFiles.size > 0 || this.queuedSessions.size > 0)) return await this.enqueueTargetedSessionSync(params);
			return await this.syncAdmitted(params);
		});
	}
	async syncPublishedIndexInBackground(params) {
		if (this.syncing) return await this.syncing;
		await this.syncOutcomes.track(() => runMemorySearchMaintenance({
			reason: params.reason,
			takeDirtyGeneration: () => this.takeSearchMaintenanceRequest(),
			restoreDirtyGeneration: (generation) => this.restoreReindexRetryState(generation),
			acquireManager: () => MemoryIndexManager.get({
				cfg: this.cfg,
				agentId: this.agentId,
				purpose: "maintenance",
				acquireLocalService: this.acquireLocalService,
				maintenanceSource: this
			})
		}));
	}
	async syncAdmitted(params, options) {
		if (this.syncing) {
			if (hasTargetedSessionSyncParams(params)) {
				if (options?.queuedSessionOwner) {
					await this.syncing.catch(() => void 0);
					if (this.closing || this.closed) return;
					return await this.syncAdmitted(params, options);
				}
				return this.enqueueTargetedSessionSync(params);
			}
			try {
				return await this.syncing;
			} catch (err) {
				if (options?.allowEmbeddingBootstrapFallback && this.providerRequirement.mode === "optional" && (!this.providerInitialized || this.embeddingBootstrapFailure !== void 0)) {
					if (!this.embeddingBootstrapFailure) this.markEmbeddingBootstrapFailure(err);
					return await this.syncAdmitted(params, options);
				}
				throw err;
			}
		}
		const run = async () => {
			const hadBootstrapFailure = this.embeddingBootstrapFailure !== void 0;
			let forceFtsOnly = this.embeddingBootstrapFailure !== void 0 && this.getCachedEmbeddingAvailability()?.ok === false;
			if (!forceFtsOnly) {
				try {
					await this.ensureProviderInitialized();
				} catch (err) {
					if (this.providerRequirement.mode !== "optional") throw err;
					this.markEmbeddingBootstrapFailure(err);
					forceFtsOnly = true;
				}
				if (hadBootstrapFailure && !this.provider) {
					const failure = this.embeddingBootstrapFailure;
					const nextFailure = {
						...failure,
						reason: this.providerUnavailableReason ?? failure.reason
					};
					this.embeddingBootstrapFailure = nextFailure;
					this.cacheProbeResult({
						ok: false,
						error: nextFailure.reason
					});
					forceFtsOnly = true;
				}
			}
			const runGeneration = async (keywordOnly) => {
				const dbPath = resolveUserPath(this.settings.store.databasePath);
				const lock = await waitForMemoryReindexLock(dbPath, { waitForActive: true });
				try {
					await this.publishedDatabase.closePublicationWorker();
					this.beginSyncProviderGeneration({ forceFtsOnly: keywordOnly });
					try {
						await this.runSync(params).then(() => this.publishedDatabase.closePublicationWorker(), async (error) => {
							const [cleanup] = await Promise.allSettled([this.publishedDatabase.closePublicationWorker()]);
							if (cleanup.status === "rejected") throw new AggregateError([error, cleanup.reason], `${String(error)}; Memory sync cleanup failed: ${String(cleanup.reason)}`, { cause: error });
							throw error;
						});
					} finally {
						this.endSyncProviderGeneration();
					}
				} finally {
					await lock.release();
				}
			};
			try {
				await runGeneration(forceFtsOnly);
			} catch (err) {
				if (!(this.providerRequirement.mode === "optional" && (options?.allowEmbeddingBootstrapFallback || hadBootstrapFailure) && this.shouldFallbackOnError(err))) throw err;
				const failedProvider = this.provider?.id ?? this.settings.provider;
				this.markEmbeddingBootstrapFailure(err, {
					retainProvider: this.provider !== null,
					provider: failedProvider
				});
				forceFtsOnly = true;
				await runGeneration(true);
			}
			if (hadBootstrapFailure && !forceFtsOnly && this.provider && this.refreshIndexIdentityDirty({ providerKeyKnown: true }).status === "valid" && await this.confirmEmbeddingBootstrapRecovery()) this.clearEmbeddingBootstrapFailureAfterRecovery();
		};
		this.syncing = this.syncOutcomes.track(run, true).finally(() => {
			this.syncing = null;
		});
		return this.syncing ?? Promise.resolve();
	}
	enqueueTargetedSessionSync(targets) {
		return enqueueMemoryTargetedSessionSync({
			isClosed: () => this.closing || this.closed,
			getSyncing: () => this.syncing,
			getQueuedArchiveFiles: () => this.queuedArchiveFiles,
			getQueuedSessions: () => this.queuedSessions,
			getQueuedForce: () => this.queuedForce,
			setQueuedForce: (value) => {
				this.queuedForce = value;
			},
			getQueuedProgressCallbacks: () => this.queuedProgressCallbacks,
			getQueuedSessionSync: () => this.queuedSessionSync,
			setQueuedSessionSync: (value) => {
				this.queuedSessionSync = value;
			},
			sync: async (params) => await this.syncAdmitted(params, { queuedSessionOwner: true })
		}, targets);
	}
	status() {
		if (this.closing || this.closed) throw new Error("Memory index manager is closed");
		return this.withPublishedDatabase(() => this.publishedStatus());
	}
	publishedStatus() {
		if (this.embeddingBootstrapFailure) this.refreshKeywordFallbackIndexIdentity();
		else this.refreshIndexIdentityDirty({ providerKeyKnown: this.providerInitialized });
		const sourceFilter = this.buildSourceFilter();
		const aggregateState = collectMemoryStatusAggregate({
			db: this.db,
			sources: this.sources,
			sourceFilterSql: sourceFilter.sql,
			sourceFilterParams: sourceFilter.params,
			includeChunkBytes: this.sourceInspections.size > 0
		});
		const providerInfo = resolveStatusProviderInfo({
			provider: this.embeddingBootstrapFailure ? null : this.provider,
			providerInitialized: this.embeddingBootstrapFailure ? true : this.providerInitialized,
			requestedProvider: this.requestedProvider,
			resolveConfiguredModel: () => this.resolveConfiguredIndexIdentity()?.provider.model || this.settings.model
		});
		const storage = this.sourceInspections.size > 0 ? collectMemoryStorageStatus(this.db, resolveUserPath(this.settings.store.databasePath)) : void 0;
		return {
			backend: "builtin",
			files: aggregateState.files,
			chunks: aggregateState.chunks,
			dirty: this.dirty || this.sessionsDirty || this.indexIdentityDirty || this.syncing !== null || this.activeBackgroundSearchSyncs.size > 0,
			lastSyncError: this.syncOutcomes.lastError,
			workspaceDir: this.workspaceDir,
			dbPath: this.settings.store.databasePath,
			storage,
			provider: providerInfo.provider,
			model: providerInfo.model,
			requestedProvider: this.requestedProvider,
			sources: Array.from(this.sources),
			extraPaths: this.settings.extraPaths,
			sourceCounts: aggregateState.sourceCounts.map((entry) => Object.assign(entry, this.sourceInspections.get(entry.source) ?? {})),
			cache: this.cache.enabled ? {
				enabled: true,
				entries: storage?.embeddingCacheEntries ?? this.db.prepare(`SELECT COUNT(*) as c FROM memory_embedding_cache`).get()?.c ?? 0,
				maxEntries: this.cache.maxEntries
			} : {
				enabled: false,
				maxEntries: this.cache.maxEntries
			},
			fts: {
				enabled: this.fts.enabled,
				available: this.fts.available,
				error: this.fts.loadError
			},
			fallback: this.fallbackReason ? {
				from: this.fallbackFrom ?? "local",
				reason: this.fallbackReason
			} : void 0,
			vector: {
				enabled: this.vector.enabled,
				index: resolvePersistedMemoryVectorIndexState({
					db: this.db,
					vectorTable: MEMORY_INDEX_VECTOR_TABLE,
					metaVectorDims: this.vector.dims,
					hasSemanticChunks: this.hasSemanticChunks()
				}),
				storeAvailable: this.vector.available ?? void 0,
				semanticAvailable: this.vector.semanticAvailable,
				available: this.vector.semanticAvailable,
				extensionPath: this.vector.extensionPath,
				loadError: this.vector.loadError,
				dims: this.vector.dims
			},
			batch: {
				enabled: this.batch.enabled,
				failures: this.batchFailure.count,
				limit: this.batchFailureLimit,
				wait: this.batch.wait,
				concurrency: this.batch.concurrency,
				pollIntervalMs: this.batch.pollIntervalMs,
				timeoutMs: this.batch.timeoutMs,
				lastError: this.batchFailure.lastError,
				lastProvider: this.batchFailure.lastProvider
			},
			custom: {
				llamaCppRuntime: getLocalEmbeddingRuntimeFacts(this.provider),
				searchMode: providerInfo.searchMode,
				providerState: this.providerLifecycle,
				providerUnavailableReason: this.providerUnavailableReason,
				indexIdentity: this.indexIdentityState,
				automaticRebuildNotice: this.automaticRebuildNotice
			}
		};
	}
	async close() {
		const existingClose = this.closePromise;
		if (existingClose) {
			await existingClose;
			return;
		}
		const closeOperation = this.withPublishedDatabase(() => this.closeTeardownComplete ? this.retryFailedClose() : this.closeOnce());
		this.closePromise = closeOperation;
		try {
			await closeOperation;
			this.managerRegistry.deleteIfCurrent(this.cacheKey, this);
		} catch (err) {
			if (this.closePromise === closeOperation) this.closePromise = null;
			throw err;
		}
	}
	async retryFailedClose() {
		const retirementErrors = await this.drainPendingProviderRetirements();
		if (this.providersPendingRetirement.size > 0) throw toErrorObject(retirementErrors.at(-1), "Embedding provider retirement failed");
	}
	async closeOnce() {
		this.closing = true;
		this.queuedArchiveFiles.clear();
		this.queuedSessions.clear();
		this.queuedForce = false;
		this.queuedProgressCallbacks.clear();
		await this.awaitManagerIdle();
		this.closed = true;
		const pendingProviderInit = this.providerInitPromise;
		const pendingFallbackInit = this.getPendingFallbackProviderInitialization();
		if (this.sessionWatchTimer) {
			clearTimeout(this.sessionWatchTimer);
			this.sessionWatchTimer = null;
		}
		if (this.intervalTimer) {
			clearInterval(this.intervalTimer);
			this.intervalTimer = null;
		}
		await this.closeMemoryWatcher();
		if (this.sessionUnsubscribe) {
			this.sessionUnsubscribe();
			this.sessionUnsubscribe = null;
		}
		const reportPendingWorkError = (err) => {
			log.warn(`memory close: pending manager work failed: ${formatErrorMessage(err)}`);
		};
		await pendingProviderInit?.catch(reportPendingWorkError);
		await pendingFallbackInit?.catch(reportPendingWorkError);
		await this.syncing?.catch(reportPendingWorkError);
		try {
			await this.retryFailedClose();
		} finally {
			await this.publishedDatabase.closePublicationWorker();
			this.publishedDatabase.release();
			this.closeTeardownComplete = true;
		}
	}
};
const managerRegistryStore = createPluginRuntimeStore({
	key: "memory-core:manager-registry",
	errorMessage: "Memory manager registry is not initialized"
});
function getMemoryIndexManagerRegistry() {
	let registry = managerRegistryStore.tryGetRuntime();
	if (!registry) {
		registry = new MemoryManagerRegistry(getMemoryManagerLifecycle());
		managerRegistryStore.setRuntime(registry);
	}
	return registry;
}
//#endregion
//#region extensions/memory-core/src/memory/manager-runtime.ts
async function closeAllMemoryIndexManagers() {
	const registry = getMemoryIndexManagerRegistry();
	registry.embeddingProbeCache.clear();
	await registry.closeAll();
}
async function closeMemoryIndexManagersForAgent(params) {
	const registry = getMemoryIndexManagerRegistry();
	for (const purpose of ["default", "maintenance"]) await registry.closeForAgent({
		...params,
		purpose
	});
}
//#endregion
export { MemoryIndexManager, closeAllMemoryIndexManagers, closeMemoryIndexManagersForAgent };
