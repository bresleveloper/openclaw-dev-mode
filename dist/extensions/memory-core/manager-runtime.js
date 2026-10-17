import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "../../string-coerce-1VuiLaaR.mjs";
import { F as resolveTimerTimeoutMs, n as MAX_TIMER_TIMEOUT_MS } from "../../number-coercion-CuVhdCBs.mjs";
import { c as readErrorName, u as toErrorObject } from "../../error-coercion-CvJK4lmH.mjs";
import { a as resolveGlobalSingleton } from "../../global-singleton-0m-JziJW.mjs";
import { o as resolveUserPath } from "../../home-dir-Dc6nN6HB.mjs";
import { a as asOptionalRecord } from "../../record-coerce-TIsquoVR.mjs";
import { b as uniqueValues } from "../../string-normalization-CECOqf64.mjs";
import { i as resolveRuntimeWorkerUrl, n as resolveRuntimeWorkerArgv } from "../../runtime-worker-url-DoBSDhBS.mjs";
import { _ as redactSensitiveText } from "../../redact-DJ8j6ADa.mjs";
import { d as sleepWithAbort } from "../../src-D1BHGNTj.mjs";
import { r as resolveStateDir } from "../../state-dir-BHJORNly.mjs";
import { t as formatErrorMessage } from "../../errors-O33D01XW.mjs";
import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "../../kysely-sync-K7ftY-g4.mjs";
import { r as ensureSqliteLibrarySelected } from "../../bun-sqlite-library-CBSPJxTD.mjs";
import { t as createSubsystemLogger } from "../../subsystem-I-uqdx4f.mjs";
import { i as runSqliteImmediateTransaction } from "../../sqlite-transaction-DsZ3X6nD.mjs";
import { r as WorkerTaskError } from "../../src-WCJCjrey.mjs";
import { m as MEMORY_INDEX_PATHS_FTS_TABLE, p as MEMORY_INDEX_FTS_TABLE, t as ensureMemoryIndexSchema, u as MEMORY_INDEX_VECTOR_TABLE } from "../../memory-schema-BA04oCjG.mjs";
import { n as normalizeAgentId } from "../../agent-id-D1-Q6vR4.mjs";
import { t as SQLITE_IDLE_HANDLE_TTL_MS } from "../../sqlite-handle-lifecycle-dWd9h3ii.mjs";
import { a as resolveAgentDir, d as resolveAgentWorkspaceDir, r as resolveAgentConfig } from "../../agent-scope-config-CDYpzA0r.mjs";
import { l as openSqliteWorkerStore, p as runSqliteWorkerStoreWrite } from "../../sqlite-worker-store-CsIRv3py.mjs";
import { r as runQueuedStoreWrite } from "../../store-writer-queue-Cq6rziq_.mjs";
import { t as borrowOpenClawAgentDatabase } from "../../openclaw-agent-db-DBug3LUA.mjs";
import { r as onInternalSessionTranscriptUpdate } from "../../transcript-events-DUHAZLVw.mjs";
import { t as MEMORY_SEARCH_DEADLINE_CONTROL } from "../../search-deadline-control-CvwcTLrz.mjs";
import { t as openOpenClawAgentSqliteWorkerStore } from "../../openclaw-agent-worker-store-DpPONdtx.mjs";
import { t as retryAsync } from "../../retry-DH6xHyXB.mjs";
import { i as getAgentWorkspaceAccess } from "../../workspace-access-DjFUgH7e.mjs";
import { t as loadSqliteVecExtension } from "../../sqlite-vec-BcbJNyja.mjs";
import { t as chunkItems } from "../../chunk-items-2QWieLm-.mjs";
import "../../memory-core-host-engine-knn-DTjLOT03.mjs";
import { t as isVectorKnnRow } from "../../manager-search-knn-B-dpovcE.mjs";
import "../../error-runtime-BmospGvZ.mjs";
import "../../string-coerce-runtime-50qKeWeL.mjs";
import { i as stopMemorySqliteWalMaintenance } from "../../engine-storage-Cd_FIR_H.mjs";
import "../../memory-core-host-engine-storage-D1iAJzGI.mjs";
import { n as estimateUtf8Bytes, t as estimateStructuredEmbeddingInputBytes } from "../../embedding-input-limits-Dzm_zeQC.mjs";
import { c as buildMultimodalChunkForIndexing, f as normalizeExtraMemoryPathEntries, n as readMemoryFile, s as buildFileEntry } from "../../read-file-D9pCx2gk.mjs";
import { t as isFileMissingError } from "../../fs-utils-CK0xaytO.mjs";
import { t as hashText } from "../../hash-BOTtT1fO.mjs";
import { r as classifyMemoryMultimodalPath } from "../../multimodal-B9eYMDXo.mjs";
import { n as retryTransientMemoryRead } from "../../read-retry-Qn2FTJ6v.mjs";
import "../../markdown-chunks-XgYdcem0.mjs";
import { t as INVALID_PROJECT_ANNOTATION_KEY } from "../../curated-annotations-DM9mz8Th.mjs";
import { t as runWithConcurrency } from "../../concurrency-BvONODc2.mjs";
import { t as formatMemoryIndexRebuildGuidance } from "../../types-DTVBdCzw.mjs";
import { t as withOpenClawAgentDatabaseWrite } from "../../openclaw-agent-db-write-CVe9DulI.mjs";
import "../../sqlite-runtime-Ch9K5Xik.mjs";
import "../../security-runtime-CpTHQYW2.mjs";
import "../../agent-workspace-runtime-B_2-8Yo6.mjs";
import { n as resolveMemorySessionStartupState, r as resolveMemorySessionSyncPlan, t as isMemorySessionIndexable } from "../../manager-session-sync-state-CC68bJ0_.mjs";
import { a as searchVector, c as readMemoryRecallData, d as loadMemorySourceFileState, f as resolveMemorySourceFileEntries, m as buildFtsQuery, o as MEMORY_INDEX_META_KEY, s as readMemoryIndexMetadata, t as prepareExactPathMatcher, u as inspectMemorySourceState } from "../../manager-search-CbWN0Q_u.mjs";
import { a as resolvePersistedMemoryVectorIndexState, i as requiresMemoryVectorRebuild, r as memoryTableExists } from "../../manager-vector-rebuild-state-DWrs_Mbx.mjs";
import { t as extractKeywords } from "../../query-expansion-CBz4n5iE.mjs";
import { t as listSessionTranscriptCorpusEntriesForAgent } from "../../session-transcript-corpus-CJJovP8h.mjs";
import { c as sessionPathForSessionIdentity, l as statSessionEntrySync, s as sessionPathForFile, t as buildSessionEntry } from "../../session-files-DeB3fQWn.mjs";
import "../../memory-core-host-engine-sessions-BqHevZaM.mjs";
import { n as hasNonTextEmbeddingParts } from "../../embedding-chunk-limits-J6OR7lDp.mjs";
import { n as resolveChunkProvenance } from "../../manager-index-preparation-GBRH0CiB.mjs";
import { n as hasMemorySessionTombstone } from "../../memory-session-tombstones-Boi0AhzJ.mjs";
import { i as tableExists, r as readMemoryDatabaseRevision, t as MemoryIndexRevisionConflictError } from "../../manager-db-kernel-P1lEjy52.mjs";
import { i as collectMemoryCachedEmbeddings, n as readMemoryShadowIdentity, o as isValidMemoryEmbedding, t as assertMemoryShadowIdentity } from "../../manager-shadow-task-BgV0hfBk.mjs";
import { t as memoryCpuProcessEntrypoints } from "../../manager-cpu-entrypoints-_KEJpSFQ.mjs";
import { t as vectorKnnProcessEntrypoint } from "../../manager-search-knn-entrypoint-D4BNu0VT.mjs";
import "../../runtime-env-BjPzo7IN.mjs";
import { t as expectDefined } from "../../expect-runtime-CJBt0Gq2.mjs";
import "../../number-runtime-CgyXj1A5.mjs";
import "../../retry-runtime-CZf8_bHp.mjs";
import "../../process-runtime-CYiH_oPH.mjs";
import "../../routing-CEr1aXk1.mjs";
import "../../agent-scope-runtime-DMJYuX7c.mjs";
import { t as resolveMemorySearchConfig } from "../../memory-search-DFCytBn0.mjs";
import { r as listRegisteredMemoryEmbeddingProviderAdapters } from "../../memory-embedding-provider-runtime-BNAwzYkM.mjs";
import "../../text-chunking-BiSt_d1B.mjs";
import { t as createPluginRuntimeStore } from "../../runtime-store-USWE9VtE.mjs";
import "../../memory-core-host-embedding-registry-CctPZagZ.mjs";
import { k as isEmbeddingBatchUnavailableError } from "../../memory-core-host-engine-embeddings-C_qi8FWC.mjs";
import "../../memory-core-host-engine-foundation-CsHcvVQs.mjs";
import { n as getMemoryManagerLifecycle, t as MemoryManagerReloadError } from "../../lifecycle-ieTqs85R.mjs";
import { nt as withMemoryWorkspacePreparation, tt as withMemoryWorkspaceLock } from "../../dreaming-dreams-file-V27TxMsY.mjs";
import { n as listMemorySessionTombstones } from "../../memory-entry-origins-BBbywTCs.mjs";
import { r as tokenize, t as jaccardSimilarity } from "../../tokenize-DZU9mzSr.mjs";
import { n as readSessionResetRecallCutoffMetadata } from "../../session-reset-recall-metadata-_gATHFyh.mjs";
import { a as openMemoryDatabaseAtPath, d as withMemoryIndexPublishGeneration, i as closeMemoryDatabase, l as waitForMemoryReindexLock, n as logMemoryVectorDegradedWrite, o as openMemoryDatabaseReadOnlyAtPath, r as cleanupAgedMemoryReindexTempFiles, s as removeMemoryDatabaseFiles, u as acquireMemoryIndexReadGeneration } from "../../manager-vector-warning-E9NoEyaa.mjs";
import { a as resolveEmbeddingProviderIndexIdentity, i as resolveEmbeddingProviderFallbackRemote, n as resolveEmbeddingProviderAdapterTransport, r as resolveEmbeddingProviderFallbackModel, t as createEmbeddingProvider } from "../../embeddings-CSou5yfI.mjs";
import { c as runMemoryKeywordSearch, f as runMemoryRecallMetadata, i as runMemoryCuratedCandidates, m as runMemoryVectorFallback, o as runMemoryIndexState, r as readMemoryTranscriptStatsInWorker, t as prepareMemoryIndexInWorker } from "../../manager-cpu-worker-runtime-CcmzGYbo.mjs";
import { t as MemoryFileWatcher } from "../../file-watcher-CZ9WEVgx.mjs";
import { t as resolveMemoryPathClassification } from "../../memory-path-provenance-DDYcQ588.mjs";
import fs from "node:fs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import fs$1 from "node:fs/promises";
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { setImmediate as setImmediate$1, setTimeout as setTimeout$1 } from "node:timers/promises";
//#region extensions/memory-core/src/memory/manager-publication-transfer.ts
const FRAGMENT_CHARS = 16384;
const BATCH_BYTES = 524288;
const NUMERIC_PART_ITEMS = 512;
function* jsonParts(value, preserveNegativeZero) {
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
				const numbers = value.slice(index, end);
				yield preserveNegativeZero ? numbers.map((number) => Object.is(number, -0) ? "-0" : JSON.stringify(number)).join(",") : JSON.stringify(numbers).slice(1, -1);
				index = end - 1;
			} else yield* jsonParts(item, preserveNegativeZero);
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
			yield* jsonParts(item, preserveNegativeZero);
		}
		yield "}";
	} else yield JSON.stringify(value) ?? "null";
}
function* rowFragments(value, preserveNegativeZero) {
	let pending = "";
	for (const part of jsonParts(value, preserveNegativeZero)) {
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
	function* rows() {
		for (const [row, chunk] of replacement.chunks.entries()) yield {
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
		};
	}
	yield* publicationBatches(rows());
}
function* memoryEmbeddingCacheBatches(entries) {
	yield* publicationBatches(entries, true);
}
function* publicationBatches(rows, preserveNegativeZero = false) {
	let batch = [];
	let bytes = 0;
	let row = 0;
	for (const value of rows) {
		const fragments = rowFragments(value, preserveNegativeZero);
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
		row++;
	}
	if (batch.length) yield batch;
}
//#endregion
//#region extensions/memory-core/src/memory/manager-database-context.ts
function readConnectionPragmas(db, errorMessage) {
	const read = (name) => {
		const row = db.prepare(`PRAGMA ${name}`).get();
		const value = row?.[name] ?? row?.timeout;
		if (typeof value !== "number" || !Number.isSafeInteger(value)) throw new Error(errorMessage);
		return value;
	};
	return {
		busy_timeout: read("busy_timeout"),
		synchronous: read("synchronous"),
		foreign_keys: read("foreign_keys"),
		journal_size_limit: read("journal_size_limit"),
		checkpoint_fullfsync: read("checkpoint_fullfsync")
	};
}
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
			database.shadow = {
				path: filename,
				identity: readMemoryShadowIdentity(filename),
				pragmas: readConnectionPragmas(db, "Invalid memory shadow connection policy")
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
			const pragmas = this.shadow?.pragmas ?? readConnectionPragmas(this.db, "Invalid memory connection policy");
			const worker = {
				moduleUrl: resolveRuntimeWorkerUrl(memoryCpuProcessEntrypoints.publication),
				input: {
					fileIdentity: this.shadow?.identity ?? readMemoryShadowIdentity(filename),
					pragmas
				}
			};
			if (this.writeOptions) return {
				store: await openOpenClawAgentSqliteWorkerStore(this.writeOptions, this.db, worker),
				busyTimeoutMs: pragmas.busy_timeout
			};
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
				store: {
					run: (operation, assertCurrent) => runSqliteWorkerStoreWrite(store, operation, assertCurrent, [filename]),
					close: () => store.close()
				},
				busyTimeoutMs: pragmas.busy_timeout
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
				return await (await this.getPublicationWorker()).store.run(operation, assertCurrent);
			} catch (error) {
				const [cleanup] = await Promise.allSettled([this.closePublicationWorker()]);
				if (cleanup.status === "rejected") throw new AggregateError([error, cleanup.reason], `${String(error)}; Memory publication cleanup failed: ${String(cleanup.reason)}`, { cause: error });
				throw error;
			}
		};
		return this.isShadow ? this.withPrivateAccess(run, { nativeWriter: true }) : run();
	}
	async retryPublication(run, prepare = async () => true) {
		const worker = await this.getPublicationWorker();
		const deadline = performance.now() + worker.busyTimeoutMs;
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
	read(command, assertCurrent) {
		return this.runPublication((scope) => scope.execute(command), assertCurrent);
	}
	async pruneEmbeddingCache(maxEntries, assertCurrent) {
		assertCurrent();
		return await this.retryPublication(() => this.runPublication((scope) => scope.execute({
			type: "cache.prune",
			input: { maxEntries }
		}), assertCurrent)) ?? false;
	}
	async mutateEmbeddingCache(mutation, assertCurrent, prepareRevision, invalidate) {
		return this.runPublication(async (scope) => {
			const expectedRevision = prepareRevision();
			if (expectedRevision === void 0) return;
			const prepare = async () => prepareRevision() !== void 0;
			if (mutation.kind === "clear") try {
				return await this.retryPublication(() => scope.execute({
					type: "cache.clear",
					input: {
						identities: mutation.identities,
						expectedRevision
					}
				}), prepare);
			} finally {
				invalidate();
			}
			const operation = randomUUID();
			await scope.execute({
				type: "cache.stage.start",
				input: {
					operation,
					header: mutation.header,
					rows: mutation.entries.length
				}
			});
			for (const fragments of memoryEmbeddingCacheBatches(mutation.entries)) await scope.execute({
				type: "stage.append",
				input: {
					operation,
					fragments
				}
			});
			let needsDiscard = true;
			const current = await this.retryPublication(async () => {
				const outcome = await scope.execute({
					type: "cache.write",
					input: {
						operation,
						expectedRevision
					}
				});
				if (outcome.ok || outcome.entered) needsDiscard = false;
				return outcome;
			}, prepare);
			if (needsDiscard) await scope.execute({
				type: "stage.discard",
				input: { operation }
			});
			if (current === false) invalidate();
			return current;
		}, assertCurrent);
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
			await (await this.publicationWorker).store.close();
			this.publicationWorker = void 0;
		}
	}
	closeShadow() {
		this.closed = true;
		this.shadowClose ??= (async () => {
			await stopMemorySqliteWalMaintenance(this.db);
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
		current.push(chunk);
		currentTokens += estimate;
	}
	if (current.length > 0) batches.push(current);
	return batches;
}
const RATE_LIMITED_MEMORY_EMBEDDING_ERROR_RE = /(rate[_ ]limit|too many requests|\b429\b|resource has been exhausted|tokens per day)/i;
const RETRYABLE_MEMORY_EMBEDDING_SERVICE_ERROR_RE = /\b5\d\d\b|cloudflare/i;
const RETRYABLE_MEMORY_EMBEDDING_TRANSPORT_ERROR_RE = /(fetch failed|other side closed|ECONNRESET|ECONNREFUSED|ETIMEDOUT|EPIPE|UND_ERR_|socket hang up|socket terminated|network error|read ECONN|timed out|connection (?:reset|refused|aborted|timed out)|EHOSTUNREACH|ENETUNREACH|ECONNABORTED|EAI_AGAIN)/i;
const SPLITTABLE_MEMORY_EMBEDDING_BATCH_ERROR_RE = /(request_headers_too_large|request header fields too large|other side closed|ECONNRESET|EPIPE|UND_ERR_SOCKET|socket hang up|socket terminated|read ECONN|connection (?:reset|aborted)|\bembeddings (?:api input limit exceeded:\s*max\s+\d+\s*,\s*got\s+\d+|max input length is\s+\d+)\b|\bbatch size is invalid,?\s+it should not be larger than\s+\d+\b|\binput array max\s+\d+(?=\s*(?:["'}]|$))|input\s*数组最大不得超过\s*\d+\s*条)/i;
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
//#endregion
//#region extensions/memory-core/src/memory/manager-provider-state.ts
function resolveMemoryProviderLifecycle(result) {
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
function resolveMemoryFallbackProviderRequest(params) {
	const fallback = params.settings.fallback;
	if (!fallback || fallback === "none" || !params.currentProviderId || fallback === params.currentProviderId) return null;
	return {
		...resolveMemoryPrimaryProviderRequest({ settings: params.settings }),
		provider: fallback,
		model: resolveEmbeddingProviderFallbackModel(fallback, params.settings.model, params.cfg),
		remote: resolveEmbeddingProviderFallbackRemote(params.settings.remote),
		fallback: "none"
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
	return resolveConfiguredSourcesForMeta(new Set(Array.isArray(meta.sources) ? meta.sources : []));
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
//#region extensions/memory-core/src/memory/manager-sync-control.ts
function hasTargetedSessionSyncParams(params) {
	return Boolean(params?.sessions?.some((session) => session.sessionId.trim().length > 0) || params?.archiveFiles?.some((sessionFile) => sessionFile.trim().length > 0));
}
var MemoryTargetedSessionSyncQueue = class {
	constructor(owner) {
		this.owner = owner;
		this.archiveFiles = /* @__PURE__ */ new Set();
		this.sessions = /* @__PURE__ */ new Map();
		this.progressCallbacks = /* @__PURE__ */ new Set();
		this.force = false;
		this.pending = null;
	}
	get hasPending() {
		return this.pending !== null || this.archiveFiles.size > 0 || this.sessions.size > 0;
	}
	clear() {
		this.archiveFiles.clear();
		this.sessions.clear();
		this.force = false;
		this.progressCallbacks.clear();
	}
	enqueue(targets) {
		for (const sessionFile of targets?.archiveFiles ?? []) {
			const trimmed = sessionFile.trim();
			if (trimmed) this.archiveFiles.add(trimmed);
		}
		for (const session of targets?.sessions ?? []) {
			const normalized = normalizeQueuedMemorySessionSyncTarget(session);
			if (normalized) this.sessions.set(memorySessionSyncTargetKey(normalized), normalized);
		}
		if (this.archiveFiles.size === 0 && this.sessions.size === 0) return this.owner.getSyncing() ?? Promise.resolve();
		if (targets?.force) this.force = true;
		if (targets?.progress) this.progressCallbacks.add(targets.progress);
		if (!this.pending) this.pending = (async () => {
			try {
				await this.owner.getSyncing()?.catch(() => void 0);
				while (!this.owner.isClosed() && (this.archiveFiles.size > 0 || this.sessions.size > 0)) {
					const pendingArchiveFiles = Array.from(this.archiveFiles);
					const pendingSessions = Array.from(this.sessions.values());
					const pendingForce = this.force;
					const pendingProgressCallbacks = Array.from(this.progressCallbacks);
					this.clear();
					const progress = pendingProgressCallbacks.length > 0 ? (update) => {
						for (const callback of pendingProgressCallbacks) callback(update);
					} : void 0;
					try {
						await this.owner.sync({
							reason: "queued-sessions",
							...pendingForce ? { force: true } : {},
							sessions: pendingSessions,
							archiveFiles: pendingArchiveFiles,
							...progress ? { progress } : {}
						});
					} catch (err) {
						for (const archiveFile of pendingArchiveFiles) this.archiveFiles.add(archiveFile);
						for (const session of pendingSessions) this.sessions.set(memorySessionSyncTargetKey(session), session);
						if (pendingForce) this.force = true;
						this.progressCallbacks.clear();
						throw err;
					}
				}
			} finally {
				if (this.owner.isClosed()) this.clear();
				this.pending = null;
			}
		})();
		return this.pending ?? Promise.resolve();
	}
};
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
//#region extensions/memory-core/src/memory/manager-session-reindex.ts
function shouldSyncSessionsForReindex(params) {
	if (!params.hasSessionSource) return false;
	if (hasTargetedSessionSyncParams(params.sync) || params.sync?.force || params.needsFullReindex || params.sessionsFullRetryDirty) return true;
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
		this.memoryWatchGeneration = 0;
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
	markMemoryWatchDirty() {
		this.memoryWatchGeneration += 1;
		this.dirty = true;
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
		this.advanceSyncProgress(progress, items.length);
	}
	async executeSourceSync(params) {
		const deferIndex = this.shouldDeferSourceWideBatch();
		const memoryPlan = params.shouldSyncMemory ? await this.syncMemoryFiles({
			needsFullReindex: params.needsFullReindex,
			progress: params.progress,
			...deferIndex ? { deferIndex: true } : {}
		}) : void 0;
		if (params.shouldSyncSessions) await this.syncArchiveFiles({
			needsFullReindex: params.needsFullSessionReindex ?? params.needsFullReindex,
			targetArchiveFiles: params.targetArchiveFiles,
			progress: params.progress,
			...deferIndex ? {
				deferIndex: true,
				prefixIndexItems: memoryPlan?.indexItems
			} : {}
		});
		else if (deferIndex) await this.indexQueuedFiles(memoryPlan?.indexItems ?? [], params.progress);
		if (deferIndex) await memoryPlan?.finalize();
		if (params.shouldSyncSessions) this.clearSessionRetryState();
		else this.refreshSessionDirtyFlag();
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
				multimodal: this.settings.multimodal
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
			vectorTable: MEMORY_INDEX_VECTOR_TABLE,
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
		if (this.vector.dims === dimensions && memoryTableExists(this.db, "memory_index_chunks_vec")) return;
		if (!this.dropVectorTable()) throw new Error(`Failed to reset ${MEMORY_INDEX_VECTOR_TABLE} before rebuilding vector dimensions`);
		this.db.exec(`CREATE VIRTUAL TABLE IF NOT EXISTS ${MEMORY_INDEX_VECTOR_TABLE} USING vec0(\n  id TEXT PRIMARY KEY,\n  embedding FLOAT[${dimensions}]\n)`);
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
			this.db.exec(`DROP TABLE IF EXISTS ${MEMORY_INDEX_VECTOR_TABLE}`);
			return true;
		} catch (err) {
			const message = formatErrorMessage(err);
			log$10.debug(`Failed to drop ${MEMORY_INDEX_VECTOR_TABLE}: ${message}`);
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
		this.db.prepare(`INSERT INTO memory_index_meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value`).run(MEMORY_INDEX_META_KEY, value);
		this.database.lastMetaSerialized = value;
	}
};
//#endregion
//#region extensions/memory-core/src/memory/manager-watch-ops.ts
const log$9 = createSubsystemLogger("memory");
var MemoryManagerWatchOps = class extends MemoryManagerSyncBase {
	constructor(..._args) {
		super(..._args);
		this.memoryWatcherReady = Promise.resolve();
	}
	get memoryWatchCapacityDegraded() {
		return this.fileWatcher?.capacityDegraded ?? false;
	}
	get memoryWatcherHealth() {
		return this.fileWatcher?.health();
	}
	ensureWatcher() {
		if (!this.sources.has("memory") || !this.settings.sync.watch || this.closed) return;
		if (this.memoryFiles) {
			if (this.memoryWatchSubscription || this.memoryWatchUnavailable) return;
			const subscription = new AbortController();
			this.memoryWatchSubscription = subscription;
			const markDirty = (event) => {
				if (subscription.signal.aborted || this.closed) return;
				this.markMemoryWatchDirty();
				this.memoryWatchUnavailable ||= event === "unavailable";
				this.syncInBackground({ reason: "watch" });
			};
			this.remoteWatchRetirement = this.memoryFiles.watch({
				agentId: this.agentId,
				settings: {
					extraPaths: this.settings.extraPaths,
					multimodal: this.settings.multimodal,
					sync: { watchDebounceMs: this.settings.sync.watchDebounceMs }
				}
			}, markDirty, subscription.signal).then(() => markDirty("unavailable"), (error) => {
				markDirty("unavailable");
				if (!subscription.signal.aborted) log$9.warn(`memory workspace watcher unavailable: ${String(error)}`);
				else if (error !== subscription.signal.reason) this.remoteWatchCloseFailure = { error };
			});
			return;
		}
		if (this.fileWatcher) return;
		this.fileWatcher = new MemoryFileWatcher({
			runInBackgroundContext: this.runInBackgroundContext,
			workspaceDir: this.workspaceDir,
			agentId: this.agentId,
			settings: this.settings,
			onDirty: () => this.markMemoryWatchDirty(),
			onChange: () => {
				this.markMemoryWatchDirty();
				return this.sync({ reason: "watch" });
			},
			onUnavailable: () => {
				this.memoryWatchUnavailable = true;
				this.dirty = true;
			}
		});
		this.memoryWatcherReady = this.fileWatcher.start().catch((error) => {
			if (!this.closed) {
				this.memoryWatchUnavailable = true;
				this.dirty = true;
				log$9.warn(`memory workspace watcher unavailable: ${String(error)}`);
			}
		});
	}
	async closeWatchResources() {
		if (this.sessionWatchTimer) {
			clearTimeout(this.sessionWatchTimer);
			this.sessionWatchTimer = null;
		}
		if (this.intervalTimer) {
			clearInterval(this.intervalTimer);
			this.intervalTimer = null;
		}
		this.memoryWatchSubscription?.abort();
		this.memoryWatchSubscription = void 0;
		const errors = (await Promise.allSettled([
			(async () => {
				await this.remoteWatchRetirement;
				if (this.remoteWatchCloseFailure) throw this.remoteWatchCloseFailure.error;
				this.remoteWatchRetirement = void 0;
			})(),
			(async () => {
				await this.fileWatcher?.close();
				this.fileWatcher = void 0;
			})(),
			(async () => {
				this.sessionUnsubscribe?.();
				this.sessionUnsubscribe = null;
			})()
		])).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
		if (errors.length === 1) throw errors[0];
		if (errors.length > 1) throw new AggregateError(errors, "Memory watch resources cleanup failed");
	}
	syncInBackground(params, failureReason = params.reason) {
		const failed = (err) => {
			log$9.warn(`memory sync failed (${failureReason}): ${String(err)}`);
		};
		try {
			this.runInBackgroundContext(() => {
				this.runInBackgroundContext(() => this.sync(params)).catch(failed);
			});
		} catch (err) {
			failed(err);
		}
	}
	ensureIntervalSync() {
		const minutes = this.settings.sync.intervalMinutes;
		if (!minutes || minutes <= 0 || this.intervalTimer) return;
		const ms = resolveTimerTimeoutMs(minutes * 60 * 1e3, 0, 0);
		if (ms <= 0) return;
		this.intervalTimer = setInterval(() => {
			this.syncInBackground({ reason: "interval" });
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
		const forgottenSessions = new Set((await listMemorySessionTombstones({
			agentId: this.agentId,
			sessionIds: entries.map((entry) => entry.sessionId)
		})).map((entry) => entry.sessionId));
		return entries.filter((entry) => {
			const archivedSessionKey = entry.artifactKind === "archive-artifact" ? entry.sessionKey : void 0;
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
		this.sessionUnsubscribe = this.subscribeSessionTranscriptUpdates((update) => {
			this.runInBackgroundContext(() => {
				if (this.closing || this.closed) return;
				const target = this.resolveSessionTranscriptUpdateSyncTarget(update);
				if (target) {
					this.scheduleSessionDirty(target);
					return;
				}
				if (update.sessionFile) {
					const sessionFile = update.sessionFile;
					this.runInBackgroundContext(() => this.withManagerOperation(() => this.scheduleCorpusSessionFileDirty(sessionFile))).catch((err) => {
						log$8.warn(`memory session corpus update failed: ${String(err)}`);
					});
				}
			});
		});
	}
	subscribeSessionTranscriptUpdates(listener) {
		return onInternalSessionTranscriptUpdate(listener);
	}
	async scheduleCorpusSessionFileDirty(sessionFile) {
		const resolvedSessionFile = path.resolve(sessionFile);
		if ((await this.listSessionCorpusEntries()).some((entry) => entry.transcriptSource !== "sqlite" && path.resolve(entry.sessionFile) === resolvedSessionFile)) this.scheduleSessionDirty(resolvedSessionFile);
	}
	async ensureSessionStartupCatchup() {
		if (!this.sources.has("sessions") || this.closing || this.closed) return;
		await this.withManagerOperation(() => this.runSessionStartupCatchup());
	}
	async markSessionStartupCatchupDirtyFiles(inspectSources = false) {
		if (!this.sources.has("sessions") || this.closed) return [];
		const corpusEntries = await this.listSessionCorpusEntries();
		if (this.closed) return [];
		const existingRows = loadMemorySourceFileState({
			db: this.db,
			source: "sessions"
		});
		const indexedPaths = new Set(existingRows.map((row) => row.path));
		const sqliteCorpusEntries = corpusEntries.filter((entry) => entry.transcriptSource === "sqlite");
		const transcriptStats = await readMemoryTranscriptStatsInWorker(sqliteCorpusEntries.map((entry) => ({
			agentId: entry.agentId,
			sessionId: entry.sessionId,
			...entry.sessionKey ? { sessionKey: entry.sessionKey } : {},
			...entry.storePath ? { storePath: entry.storePath } : {}
		})));
		if (this.closed) return [];
		const statsByEntry = new Map(sqliteCorpusEntries.map((entry, index) => [entry, transcriptStats[index]]));
		const fileStates = (await runWithConcurrency(corpusEntries.map((corpusEntry) => async () => {
			if (!indexedPaths.has(this.sessionPathForCorpusEntry(corpusEntry))) {
				const entry = await buildSessionEntry(corpusEntry.sessionFile, this.buildSessionEntryOptions(corpusEntry));
				if (entry && !isMemorySessionIndexable(entry)) return null;
			}
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
		if (!this.sessionsDirty || this.closing || this.closed) return dirtyFiles;
		this.syncInBackground({ reason: "session-startup-catchup" });
		return dirtyFiles;
	}
	scheduleSessionDirty(target) {
		if (this.closing || this.closed) return;
		if (typeof target === "string") this.sessionPendingFiles.add(target);
		else this.sessionPendingTargets.set(memorySessionSyncTargetKey(target), target);
		if (this.sessionWatchTimer) return;
		this.sessionWatchTimer = setTimeout(() => {
			this.sessionWatchTimer = null;
			if (this.closing || this.closed) return;
			const failed = (err) => {
				log$8.warn(`memory session update failed: ${String(err)}`);
			};
			try {
				this.runInBackgroundContext(() => this.withManagerOperation(() => this.processSessionUpdateBatch())).catch(failed);
			} catch (err) {
				failed(err);
			}
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
			this.syncInBackground({
				reason: "session-delta",
				sessions: pendingTargets,
				archiveFiles: pending
			}, "session update");
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
		let entriesBySessionId;
		if (targets.length > 1) {
			entriesBySessionId = /* @__PURE__ */ new Map();
			for (const target of targets) {
				const sessionId = target.sessionId.trim();
				if (sessionId) entriesBySessionId.set(sessionId, []);
			}
			for (const entry of corpusEntries) entriesBySessionId.get(entry.sessionId)?.push(entry);
		}
		for (const rawSession of targets) {
			const sessionId = rawSession.sessionId.trim();
			const agentId = rawSession.agentId?.trim() || this.agentId;
			if (!sessionId || normalizeAgentId(agentId) !== normalizedAgentId) continue;
			const sessionKey = rawSession.sessionKey?.trim();
			const matchingEntries = (entriesBySessionId ? entriesBySessionId.get(sessionId) ?? [] : corpusEntries).filter((entry) => entry.sessionId === sessionId && normalizeAgentId(entry.agentId) === normalizedAgentId && (!sessionKey || entry.sessionKey === sessionKey));
			for (const entry of matchingEntries) files.add(entry.transcriptSource === "sqlite" ? entry.sessionFile : path.resolve(entry.sessionFile));
		}
		return files;
	}
	async resolveTargetSessionSyncPlan(params) {
		const corpusEntries = await this.listSessionCorpusEntries();
		const files = /* @__PURE__ */ new Set([...this.normalizeTargetArchiveFiles(params.archiveFiles, corpusEntries) ?? [], ...await this.resolveArchiveFilesForSyncTargets(params.sessions, corpusEntries)]);
		return files.size > 0 ? {
			corpusEntries,
			targetArchiveFiles: files
		} : null;
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
			const assertCurrent = () => {
				if (this.closed || database.closed || database.readOnly || !database.db.isOpen || this.database !== database) throw new Error("Memory source owner changed before deletion");
			};
			const capturedHash = expectedHash ?? await database.read({
				type: "source.hash",
				input: {
					path: pathname,
					source
				}
			}, assertCurrent);
			assertCurrent();
			await database.deleteSource({
				path: pathname,
				source,
				expectedHash: capturedHash
			}, assertCurrent);
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
			await runWithConcurrency(tasks, this.getIndexConcurrency());
		}
		await deleteStaleRows();
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
			const database = this.database;
			const assertCurrent = () => {
				if (this.closed || database.closed || !database.db.isOpen || this.database !== database) throw new Error("Memory source owner changed during hash lookup");
			};
			const existingHash = existingHashes ? existingHashes.get(entry.path) : await database.read({
				type: "source.hash",
				input: {
					source: "sessions",
					path: entry.path
				}
			}, assertCurrent);
			assertCurrent();
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
				const dirtyEntries = (await runWithConcurrency(fileBatch.map((absPath) => async () => {
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
			return;
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
		await runWithConcurrency(tasks, this.getIndexConcurrency());
		await deleteTargetArchiveStaleLiveRows();
		await deleteStaleRows();
	}
};
//#endregion
//#region extensions/memory-core/src/memory/manager-targeted-sync.ts
function markMemoryTargetArchiveFilesDirty(params) {
	if (params.targetArchiveFiles) for (const targetArchiveFile of params.targetArchiveFiles) params.sessionsDirtyFiles.add(targetArchiveFile);
	return params.sessionsDirtyFiles.size > 0;
}
async function runMemoryTargetedSessionSync(params) {
	const hasPendingSessionWork = () => params.sessionsFullRetryDirty || params.sessionsReconcileDirty || params.sessionsDirtyFiles.size > 0;
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
		for (const file of params.targetArchiveFiles) params.sessionsDirtyFiles.delete(file);
		return {
			handled: true,
			sessionsDirty: hasPendingSessionWork()
		};
	} catch (err) {
		const reason = formatErrorMessage(err);
		if (!(isMemoryEmbeddingOperationError(err) && await params.activateFallbackProvider(reason))) throw err;
		markMemoryTargetArchiveFilesDirty({
			sessionsDirtyFiles: params.sessionsDirtyFiles,
			targetArchiveFiles: params.targetArchiveFiles
		});
		return {
			handled: true,
			sessionsDirty: hasPendingSessionWork(),
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
	shouldDeferSourceWideBatch() {
		const generation = this.syncProviderGeneration;
		const provider = generation ? generation.provider : this.provider;
		const providerRuntime = generation ? generation.kind === "semantic" ? generation.runtime : void 0 : this.providerRuntime;
		return Boolean(this.batch.enabled && provider && providerRuntime?.batchEmbed && providerRuntime.sourceWideBatchEmbed === true);
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
		const hasTargetSessionRequest = hasTargetedSessionSyncParams(params);
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
					multimodal: this.settings.multimodal
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
					await this.runInPlaceReindex(progress);
					return;
				}
				const shouldSyncMemory = this.sources.has("memory") && (this.dirty || isSearchBootstrap);
				const shouldSyncSessions = this.shouldSyncSessions(params, needsFullSessionReindex);
				await this.executeSourceSync({
					shouldSyncMemory,
					shouldSyncSessions,
					needsFullReindex,
					needsFullSessionReindex,
					targetArchiveFiles: targetArchiveFiles ? Array.from(targetArchiveFiles) : void 0,
					progress: progress ?? void 0
				});
			} catch (err) {
				this.dirty ||= this.sources.has("memory");
				const reason = formatErrorMessage(err);
				const shouldFallback = isMemoryEmbeddingOperationError(err);
				if (shouldFallback) this.endSyncProviderGeneration();
				if (shouldFallback && await this.activateFallbackProvider(reason)) {
					if ((needsFullReindex || isSearchBootstrap) && !hasTargetArchiveFiles) {
						needsFullReindex = true;
						this.beginSyncProviderGeneration();
						await this.runInPlaceReindex(progress);
					}
					return;
				}
				if (!this.provider && this.fts.enabled && isMemoryEmbeddingOperationError(err)) {
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
		this.providerLifecycle = resolveMemoryProviderLifecycle({
			provider: fallbackResult.provider,
			runtime: fallbackResult.runtime,
			requestedProvider: currentProviderId,
			fallbackFrom: currentProviderId,
			fallbackReason: reason
		});
		this.fallbackFrom = currentProviderId;
		this.fallbackReason = reason;
		this.provider = fallbackResult.provider;
		this.providerRuntime = fallbackResult.runtime;
		this.providerUnavailableReason = void 0;
		this.providerKey = this.computeProviderKey();
		this.batch = this.resolveBatchConfig();
		log$6.warn(`memory embeddings: switched to fallback provider (${fallbackRequest.provider})`, { reason });
		return true;
	}
	async runInPlaceReindex(progress) {
		const dbPath = resolveUserPath(this.settings.store.databasePath);
		const tempDbPath = `${dbPath}.memory-reindex-${randomUUID()}`;
		const originalDb = this.db;
		const originalRetryState = this.snapshotReindexRetryState();
		const shouldRetryMemoryOnFailure = this.sources.has("memory");
		const shouldRetrySessionsOnFailure = this.shouldSyncSessions(void 0, true);
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
					await this.executeSourceSync({
						shouldSyncMemory,
						shouldSyncSessions,
						needsFullReindex: true,
						progress
					});
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
							multimodal: this.settings.multimodal
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
			this.adoptReindexRetryState(originalRetryState);
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
//#region extensions/memory-core/src/memory/manager-embedding-cache-ops.ts
var MemoryManagerEmbeddingCacheOps = class extends MemoryManagerSyncOps {
	async pruneEmbeddingCacheIfNeeded() {
		const max = this.cache.maxEntries;
		if (!this.cache.enabled || !max || max <= 0) return;
		const database = this.database;
		const assertCurrent = () => {
			if (this.closed || database.closed || !database.db.isOpen || this.database !== database) throw new Error("Memory database owner closed or changed before write admission");
		};
		while (await database.pruneEmbeddingCache(max, assertCurrent)) await setImmediate$1();
	}
	assertEmbeddingCacheGenerationCurrent(generation) {
		if (this.closed || this.syncProviderGeneration !== generation || generation.database.closed || !generation.database.db.isOpen || this.publishedDatabase !== generation.database) throw new Error("Memory embedding generation changed during cache lookup");
	}
	async collectCachedEmbeddings(candidates, generation) {
		const chunks = candidates.map((candidate) => candidate.chunk);
		const cached = this.cache.enabled ? await generation.database.read({
			type: "cache.read",
			input: {
				enabled: true,
				providerIdentities: generation.identities,
				hashes: chunks.map((chunk) => chunk.hash)
			}
		}, () => this.assertEmbeddingCacheGenerationCurrent(generation)) : /* @__PURE__ */ new Map();
		this.assertEmbeddingCacheGenerationCurrent(generation);
		for (const [hash, embedding] of cached) if (!isValidMemoryEmbedding(embedding, generation.embeddingDimensions)) cached.delete(hash);
		else generation.embeddingDimensions ??= embedding.length;
		const result = collectMemoryCachedEmbeddings({
			chunks,
			cached
		});
		return {
			...result,
			missingCandidates: result.missing.map((item) => expectDefined(candidates[item.index], "missing memory embedding candidate"))
		};
	}
	async embedChunksInBatches(candidates, generation, maxTokens) {
		const { embeddings, missing, missingCandidates } = await this.collectCachedEmbeddings(candidates, generation);
		this.assertEmbeddingCacheGenerationCurrent(generation);
		if (missing.length === 0) return embeddings;
		const batches = buildMemoryEmbeddingBatches(missingCandidates.map((candidate) => candidate.chunk), maxTokens);
		let cursor = 0;
		for (const batchChunks of batches) {
			const batchCandidates = missingCandidates.slice(cursor, cursor + batchChunks.length);
			const inputs = batchChunks.map((chunk) => chunk.embeddingInput ?? { text: chunk.text });
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
	async withGeneratedEmbeddingCacheWrite(generation, mutation) {
		await this.withPublishedDatabase(async () => {
			if (this.syncProviderGeneration !== generation || generation.cacheWritesInvalidated || generation.database.closed || this.database !== generation.database) return;
			const assertCurrent = () => {
				if (this.closed || generation.database.closed || !generation.database.db.isOpen || this.database !== generation.database) throw new Error("Memory database owner closed or changed before write admission");
			};
			await generation.database.mutateEmbeddingCache(mutation, assertCurrent, () => {
				assertCurrent();
				if (this.syncProviderGeneration !== generation || generation.cacheWritesInvalidated || generation.database.closed) return;
				return generation.databaseRevision;
			}, () => {
				generation.cacheWritesInvalidated = true;
			});
		});
	}
	async persistGeneratedEmbeddings(candidates, embeddings, generation) {
		if (!this.cache.enabled || candidates.length === 0 || this.syncProviderGeneration !== generation || generation.cacheWritesInvalidated || generation.database.closed) return;
		const dimensions = generation.embeddingDimensions ?? embeddings[0]?.length;
		if (embeddings.length !== candidates.length || !embeddings.every((embedding) => isValidMemoryEmbedding(embedding, dimensions))) {
			if (generation.embeddingDimensions !== void 0 && embeddings.some((embedding) => isValidMemoryEmbedding(embedding) && embedding.length !== generation.embeddingDimensions)) await withMemoryWorkspaceLock(this.workspaceDir, async () => {
				try {
					await this.withGeneratedEmbeddingCacheWrite(generation, {
						kind: "clear",
						identities: generation.identities
					});
				} finally {
					generation.cacheWritesInvalidated = true;
				}
			});
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
						valid = Boolean(sessionId);
					}
					entryValidity.set(candidate.entry, valid);
				}
				if (valid) accepted.push({
					hash: candidate.chunk.hash,
					embedding: embeddings[index] ?? [],
					...candidate.source === "sessions" ? { sessionId: candidate.entry.sessionId } : {}
				});
			}
			if (accepted.length === 0) return;
			await this.withGeneratedEmbeddingCacheWrite(generation, {
				kind: "upsert",
				header: {
					agentId: this.agentId,
					provider: {
						id: generation.provider.id,
						model: generation.provider.model
					},
					providerKey: generation.providerKey,
					maxEntries: this.cache.maxEntries
				},
				entries: accepted
			});
		});
	}
};
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
//#endregion
//#region extensions/memory-core/src/memory/manager-embedding-ops.ts
const EMBEDDING_BATCH_MAX_TOKENS = 8e3;
const EMBEDDING_INDEX_CONCURRENCY = 4;
const EMBEDDING_TIMEOUTS_MS = {
	query: {
		remote: 6e4,
		local: 3e5
	},
	batch: {
		remote: 12e4,
		local: 6e5
	}
};
const SOURCE_WIDE_BATCH_MAX_FILES = 2048;
const SOURCE_WIDE_BATCH_MAX_REQUESTS = 5e4;
const log$5 = createSubsystemLogger("memory");
function countBatchSources(items) {
	const counts = {};
	for (const item of items) counts[item.source] = (counts[item.source] ?? 0) + 1;
	return counts;
}
function formatBatchSourceCounts(counts) {
	return Object.entries(counts).toSorted(([left], [right]) => left.localeCompare(right)).map(([source, count]) => `${source}=${count}`).join(",") || "none";
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
var MemoryManagerEmbeddingOps = class extends MemoryManagerEmbeddingCacheOps {
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
		const generation = {
			database,
			databaseRevision: readMemoryDatabaseRevision(database.db),
			cacheWritesInvalidated: false,
			providerKey,
			identities
		};
		this.syncProviderGeneration = provider ? {
			...generation,
			kind: "semantic",
			provider,
			...runtime ? { runtime } : {}
		} : {
			...generation,
			kind: "fts-only",
			provider: null
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
	async embedChunksWithBatch(candidates, source, generation, debugContext = {}) {
		const provider = generation.provider;
		const batchEmbed = generation.runtime?.batchEmbed;
		if (!batchEmbed) return this.embedChunksInBatches(candidates, generation, EMBEDDING_BATCH_MAX_TOKENS);
		const { embeddings, missing, missingCandidates } = await this.collectCachedEmbeddings(candidates, generation);
		this.assertEmbeddingCacheGenerationCurrent(generation);
		if (missing.length === 0) return embeddings;
		const missingChunks = missingCandidates.map((candidate) => candidate.chunk);
		const batchResult = await this.runBatchWithFallback({
			provider: provider.id,
			run: () => batchEmbed({
				agentId: this.agentId,
				chunks: missingChunks,
				wait: this.batch.wait,
				concurrency: this.batch.concurrency,
				pollIntervalMs: this.batch.pollIntervalMs,
				timeoutMs: this.batch.timeoutMs,
				debug: (message, data) => log$5.debug(message, {
					...data,
					source,
					chunks: candidates.length,
					...debugContext
				})
			}),
			fallback: () => this.embedChunksInBatches(missingCandidates, generation, EMBEDDING_BATCH_MAX_TOKENS)
		});
		const batchEmbeddings = batchResult.value;
		if (!batchEmbeddings) return this.embedChunksInBatches(candidates, generation, EMBEDDING_BATCH_MAX_TOKENS);
		if (batchResult.kind === "batch") await this.persistGeneratedEmbeddings(missingCandidates, batchEmbeddings, generation);
		for (const [index, item] of missing.entries()) embeddings[item.index] = batchEmbeddings[index] ?? [];
		return embeddings;
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
	async waitForEmbeddingRetry(delayMs, action, signal) {
		log$5.warn(`memory embeddings retryable error; ${action} in ${delayMs}ms`);
		await sleepWithAbort(delayMs, signal);
	}
	resolveEmbeddingTimeout(kind, provider = this.provider, providerRuntime = this.providerRuntime) {
		const configuredTimeoutSeconds = this.settings.sync.embeddingBatchTimeoutSeconds;
		if (kind === "batch" && typeof configuredTimeoutSeconds === "number" && configuredTimeoutSeconds > 0) return resolveTimerTimeoutMs(configuredTimeoutSeconds * 1e3, MAX_TIMER_TIMEOUT_MS);
		const defaults = EMBEDDING_TIMEOUTS_MS[kind];
		const runtimeTimeoutMs = kind === "query" ? providerRuntime?.inlineQueryTimeoutMs : providerRuntime?.inlineBatchTimeoutMs;
		return typeof runtimeTimeoutMs === "number" && runtimeTimeoutMs > 0 ? resolveTimerTimeoutMs(runtimeTimeoutMs, defaults.remote) : defaults[provider?.id === "local" ? "local" : "remote"];
	}
	async embedQueryWithRetry(text, signal, providerOverride, providerRuntimeOverride, deadlineControl) {
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
		if (this.batch.enabled) return this.batch.concurrency;
		const configured = this.settings.remote?.nonBatchConcurrency;
		if (typeof configured === "number" && Number.isFinite(configured)) return Math.max(1, Math.floor(configured));
		return (this.syncProviderGeneration ? this.syncProviderGeneration.provider : this.provider)?.id === "ollama" ? 1 : EMBEDDING_INDEX_CONCURRENCY;
	}
	async writeChunks({ entry, source, chunks }, generation, embeddings, vectorReady) {
		await withMemoryWorkspaceLock(this.workspaceDir, async () => {
			const database = this.database;
			const assertCurrent = () => {
				this.memoryFiles?.assertCurrent();
				if (this.closed || database.closed || !database.db.isOpen || this.database !== database || generation && (generation.database !== this.publishedDatabase || generation.database.closed || !generation.database.db.isOpen || this.syncProviderGeneration !== generation)) throw new Error("Memory source owner changed before replacement");
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
				if (source === "sessions" && hasMemorySessionTombstone((generation?.database ?? database).db, this.agentId, expectDefined(entry.sessionId, "memory index session identity"))) {
					this.markFailedFullReindexRetry({
						memory: false,
						sessions: true
					});
					throw new Error("A session was forgotten while memory indexing was running; retry the memory index.");
				}
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
			await runWithConcurrency(items.map((item) => async () => await this.indexFileWithGeneration(item.entry, { source: item.source }, generation)), this.getIndexConcurrency());
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
			const chunkCount = candidates.length;
			const sourceCounts = countBatchSources(current);
			const source = Object.keys(sourceCounts).toSorted().join("+") || "unknown";
			sourceWideBatchGroup += 1;
			const chunkBatches = chunkItems(candidates, SOURCE_WIDE_BATCH_MAX_REQUESTS);
			log$5.debug(`memory embeddings: source-wide batch submit group=${sourceWideBatchGroup} source=${source} files=${current.length} chunks=${chunkCount} requests=${chunkBatches.length} sources=${formatBatchSourceCounts(sourceCounts)} reason=${reason}`, {
				source,
				files: current.length,
				chunks: chunkCount,
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
			candidates.length = 0;
			chunkBatches.length = 0;
			const sample = embeddings.find((embedding) => embedding.length > 0);
			const vectorReady = sample ? await this.ensureVectorReady(sample.length) : false;
			let offset = 0;
			for (const item of current) {
				const fileEmbeddings = embeddings.slice(offset, offset + item.chunks.length);
				await this.writeChunks(item, generation, fileEmbeddings, vectorReady);
				embeddings.fill([], offset, offset + item.chunks.length);
				offset += item.chunks.length;
			}
			prepared = [];
			preparedRequestCount = 0;
		};
		for (const item of items) {
			if (item.entry.kind === "multimodal") {
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
		if (generation?.kind !== "semantic" && entry.kind === "multimodal") return;
		const prepared = await this.prepareIndexEntry(entry, options, generation);
		if (!prepared) return;
		if (generation?.kind !== "semantic") {
			await this.writeChunks(prepared, generation, [], false);
			return;
		}
		let embeddings;
		try {
			const candidates = prepared.chunks.map((chunk) => ({
				chunk,
				entry: prepared.entry,
				source: prepared.source
			}));
			embeddings = this.batch.enabled ? await this.embedChunksWithBatch(candidates, options.source, generation) : await this.embedChunksInBatches(candidates, generation, EMBEDDING_BATCH_MAX_TOKENS);
		} catch (err) {
			const message = formatErrorMessage(err);
			if (entry.kind === "multimodal" && /(413|payload too large|request too large|input too large|too many tokens|input limit|request size)/i.test(message)) {
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
function resolveMemoryEmbeddingProviderRequirement(params) {
	const configuredProvider = (resolveAgentConfig(params.cfg, normalizeAgentId(params.agentId))?.memory?.search?.provider ?? params.cfg.memory?.search?.provider)?.trim();
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
	constructor(..._args) {
		super(..._args);
		this.providerInitPromise = null;
		this.providerInitialized = false;
		this.providerRetirementPromise = Promise.resolve();
		this.providersPendingRetirement = /* @__PURE__ */ new Set();
		this.activeBackgroundSearchSyncs = /* @__PURE__ */ new Set();
		this.indexIdentityDirty = false;
		this.primaryRecoveryPromise = null;
		this.primaryRecoveryRetryAt = 0;
	}
	applyProviderResult(providerResult) {
		this.provider = providerResult.provider;
		this.fallbackFrom = providerResult.fallbackFrom;
		this.fallbackReason = providerResult.fallbackReason;
		this.providerUnavailableReason = providerResult.providerUnavailableReason;
		this.providerLifecycle = resolveMemoryProviderLifecycle(providerResult);
		this.providerRuntime = providerResult.runtime;
		this.providerInitialized = true;
		this.providerKey = this.computeProviderKey();
		this.batch = this.resolveBatchConfig();
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
		this.providerLifecycle = {
			mode: "degraded",
			providerId: provider,
			reason
		};
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
		await this.recoverPrimaryProviderForSearch(indexState);
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
	async recoverPrimaryProviderForSearch(indexState) {
		if (this.primaryRecoveryPromise) {
			await this.primaryRecoveryPromise;
			return;
		}
		const fallback = this.provider;
		const meta = indexState.meta;
		if (!fallback || !this.fallbackFrom || !meta || this.closed || this.syncProviderGeneration || Date.now() < this.primaryRecoveryRetryAt || this.refreshIndexIdentityDirty({
			providerKeyKnown: true,
			indexState
		}).status === "valid") return;
		this.primaryRecoveryRetryAt = Date.now() + EMBEDDING_PROBE_CACHE_TTL_MS;
		const recovery = (async () => {
			let candidate = null;
			try {
				const result = await createEmbeddingProvider({
					createProvider: this.createProvider,
					config: this.cfg,
					agentDir: resolveAgentDir(this.cfg, this.agentId),
					...this.acquireLocalService ? { acquireLocalService: this.acquireLocalService } : {},
					...resolveMemoryPrimaryProviderRequest({ settings: this.settings }),
					fallback: "none"
				});
				candidate = result.provider;
				if (!candidate || !resolveMemoryIndexProviderIdentities({
					provider: candidate,
					cacheKeyData: result.runtime?.cacheKeyData,
					aliases: result.runtime?.indexIdentityAliases
				}).some((identity) => identity.provider === meta.provider && identity.model === meta.model && identity.providerKey === meta.providerKey)) return;
				await this.embedQueryWithRetry("ping", void 0, candidate, result.runtime);
				if (this.closed || this.provider !== fallback || this.syncProviderGeneration || this.fallbackProviderInitPromise) return;
				this.applyProviderResult(result);
				candidate = null;
				this.clearEmbeddingBootstrapFailureAfterRecovery();
				await this.retireProvider(fallback);
			} catch (err) {
				if (err instanceof MemoryManagerReloadError) throw err;
				log$4.debug(`memory embeddings: primary recovery deferred: ${formatErrorMessage(err)}`);
			} finally {
				if (candidate) await this.retireProvider(candidate);
			}
		})();
		this.primaryRecoveryPromise = recovery;
		try {
			await recovery;
		} finally {
			this.primaryRecoveryPromise = null;
		}
	}
	async ensureProviderInitialized() {
		if (this.providerInitialized) {
			if (!(this.embeddingBootstrapFailure !== void 0 && !this.provider && this.getCachedEmbeddingAvailability() === null)) {
				await this.fallbackProviderInitPromise?.catch(() => void 0);
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
			return;
		}
		if (!this.providerInitPromise) this.providerInitPromise = (async () => {
			await this.fallbackProviderInitPromise?.catch(() => void 0);
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
		this.providerLifecycle = {
			mode: "pending",
			requestedProvider: this.settings.provider
		};
	}
	markLocalEmbeddingProviderDegraded(err) {
		if (this.provider?.id !== "local") return;
		const message = formatErrorMessage(err);
		const degradedProvider = this.provider;
		this.retireCurrentProvider();
		this.providerUnavailableReason = `Local embeddings degraded: ${message}`;
		this.providerLifecycle = {
			mode: "degraded",
			providerId: degradedProvider.id,
			reason: message
		};
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
		}
		return this.retireProvider(provider);
	}
	retireProvider(provider) {
		if (provider) this.providersPendingRetirement.add(provider);
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
	buildRequiredProviderUnavailableError(operation) {
		const registeredProviderIds = listRegisteredMemoryEmbeddingProviderAdapters().map((adapter) => adapter.id).toSorted();
		const registeredProviders = registeredProviderIds.length > 0 ? registeredProviderIds.join(",") : "none";
		const reason = this.providerUnavailableReason ?? (this.providerLifecycle.mode === "fts-only" ? this.providerLifecycle.reason : "provider is unavailable");
		return /* @__PURE__ */ new Error(`Memory ${operation} unavailable: embedding provider "${this.settings.provider}" is configured but unavailable. Reason: ${reason}. agentId=${this.agentId} purpose=${this.purpose} lifecycle=${JSON.stringify(this.providerLifecycle)} registeredMemoryEmbeddingProviders=${registeredProviders}`);
	}
	assertRequiredProviderAvailable(operation) {
		if (this.providerRequirement.mode === "required" && !this.provider) {
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
		return this.updateIndexIdentityState(state, params?.indexState);
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
		return this.updateIndexIdentityState(state, indexState);
	}
	updateIndexIdentityState(state, indexState) {
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
			if (params.purpose !== "default") return await create();
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
	return results.map((entry) => ({
		...entry,
		score: entry.score * importanceMultiplier(entry.importance)
	}));
}
//#endregion
//#region extensions/memory-core/src/memory/mmr.ts
const DEFAULT_MMR_CONFIG = {
	enabled: false,
	lambda: .7
};
function applyMMRToHybridResults(items, config = {}) {
	if (items.length === 0) return items;
	const { enabled = DEFAULT_MMR_CONFIG.enabled, lambda = DEFAULT_MMR_CONFIG.lambda } = config;
	if (!enabled || items.length <= 1) return [...items];
	const clampedLambda = Math.max(0, Math.min(1, lambda));
	if (clampedLambda === 1) return items.toSorted((a, b) => b.score - a.score);
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
			const mmrScore = clampedLambda * candidate.relevance - (1 - clampedLambda) * candidate.maxSimilarity;
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
	const createCandidate = (r) => ({
		id: r.id,
		path: r.path,
		startLine: r.startLine,
		endLine: r.endLine,
		source: r.source,
		snippet: r.snippet,
		vectorScore: 0,
		textScore: 0,
		rankingScore: 0,
		pathScore: 0,
		exactPathSpecificity: r.exactPathSpecificity ?? 0,
		hasBodyMatch: false,
		hasVector: false,
		hasKeyword: false,
		importance: r.importance,
		triggers: r.triggers,
		projectKey: r.projectKey,
		...r.provenance ? { provenance: r.provenance } : {}
	});
	const byId = /* @__PURE__ */ new Map();
	for (const r of params.vector) byId.set(r.id, {
		...createCandidate(r),
		vectorScore: r.vectorScore,
		hasVector: true
	});
	for (const r of params.keyword) {
		const exactPathSpecificity = r.exactPathSpecificity ?? 0;
		const existing = byId.get(r.id) ?? createCandidate(r);
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
		byId.set(r.id, existing);
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
//#region extensions/memory-core/src/memory/manager-keyword-retrieval.ts
const SNIPPET_MAX_CHARS$1 = 700;
const KEYWORD_FALLBACK_SEARCH_TERM_LIMIT = 6;
const EXACT_PATH_CANDIDATE_LIMIT = 200;
const log$2 = createSubsystemLogger("memory");
function compareKeywordSearchHits(a, b, preferExactBody = true) {
	const specificityDelta = b.exactPathSpecificity - a.exactPathSpecificity;
	if (specificityDelta !== 0) return specificityDelta;
	if (preferExactBody && a.exactPathSpecificity > 0) {
		const bodyPresenceDelta = Number(b.hasBodyMatch) - Number(a.hasBodyMatch);
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
				const contentScore = entry.hasBodyMatch ? entry.score : 0;
				return {
					...entry,
					score: scoreExactPathTieForTemporalDecay(contentScore)
				};
			}) : params.results,
			temporalDecay: params.temporalDecay,
			workspaceDir: this.workspaceDir,
			sessionSourceMtimes: this.loadSourceMtimes("sessions", params.results),
			memorySourceMtimes: this.loadSourceMtimes("memory", params.results)
		});
		const activeProjects = prepareActiveProjectKeys(params.activeProjectKeys);
		const ranked = applyProjectRanking(applyImportanceMultiplier(decayed), activeProjects).toSorted((left, right) => compareKeywordSearchHits(left, right, !appliesTemporalDecay)).map((entry) => entry.exactPathSpecificity > 0 ? Object.assign(entry, { score: projectScoreMultiplier(entry.projectKey, activeProjects) }) : entry);
		const strict = ranked.filter((entry) => entry.score >= params.minScore);
		const selected = strict.length > 0 ? strict : ranked.filter((entry) => entry.score >= 0);
		return this.toMemorySearchResults(selected.slice(0, params.maxResults));
	}
	loadSourceMtimes(source, results) {
		if (source === "memory" && !this.memoryFiles) return;
		const entries = results.filter((entry) => entry.source === source);
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
				ftsTable: MEMORY_INDEX_FTS_TABLE,
				query,
				ftsTokenizer: this.settings.store.fts.tokenizer,
				limit,
				snippetMaxChars: SNIPPET_MAX_CHARS$1,
				sourceFilter: this.buildSourceFilter(void 0, sourceFilterList),
				boostFallbackRanking: options?.boostFallbackRanking,
				rankingQuery: options?.rankingQuery
			},
			path: {
				pathFtsTable: MEMORY_INDEX_PATHS_FTS_TABLE,
				query,
				exactPathQuery: options?.exactPathQuery ?? query,
				exactPathLimit: EXACT_PATH_CANDIDATE_LIMIT,
				ftsTokenizer: this.settings.store.fts.tokenizer,
				limit,
				snippetMaxChars: SNIPPET_MAX_CHARS$1,
				sourceFilter: this.buildSourceFilter(MEMORY_INDEX_PATHS_FTS_TABLE, sourceFilterList)
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
			const existingHasBody = existing.hasBodyMatch;
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
		for (const result of merged) if (!result.hasBodyMatch) result.score = result.exactPathSpecificity > 0 ? 1 : result.pathScore;
		return merged;
	}
	limitKeywordSearchHits(results, nonExactLimit) {
		const ranked = results.toSorted(compareKeywordSearchHits);
		const exactBody = ranked.filter((entry) => entry.exactPathSpecificity > 0 && entry.hasBodyMatch).slice(0, nonExactLimit);
		const exactPathOnly = ranked.filter((entry) => entry.exactPathSpecificity > 0 && !entry.hasBodyMatch);
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
		return results.map(({ id: _id, pathScore: _pathScore, exactPathSpecificity: _exactPathSpecificity, hasBodyMatch: _hasBodyMatch, path, startLine, endLine, score, textScore, snippet, source, ...metadata }) => Object.assign({
			path,
			startLine,
			endLine,
			score,
			textScore,
			snippet,
			source
		}, metadata));
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
			if (killExitTimer) {
				clearTimeout(killExitTimer);
				killExitTimer = void 0;
			}
			params.signal?.removeEventListener("abort", abort);
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
//#region extensions/memory-core/src/memory/manager-search-orchestration.ts
const SNIPPET_MAX_CHARS = 700;
const SEARCH_CANDIDATE_UNIVERSE = 200;
const log$1 = createSubsystemLogger("memory");
var MemorySearchOrchestration = class extends MemoryKeywordRetrieval {
	constructor(..._args) {
		super(..._args);
		this.sessionWarm = /* @__PURE__ */ new Set();
	}
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
					if (this.providerRequirement.mode === "optional" && isMemoryEmbeddingOperationError(err)) {
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
			if (!hasIndexedContent) {
				if (this.embeddingBootstrapFailure) opts?.onDebug?.({
					backend: "builtin",
					embeddingBootstrap: this.embeddingBootstrapFailure
				});
				return [];
			}
			const recoveringEmbeddingProvider = this.embeddingBootstrapFailure !== void 0;
			if (recoveringEmbeddingProvider) await releaseReadGeneration();
			const embeddingBootstrapKeywordOnly = await this.ensureEmbeddingProviderForSearch(indexState, opts?.onDebug);
			if (recoveringEmbeddingProvider) indexState = await readIndexState();
			const sessionStartSync = this.claimSessionWarmSync(opts?.sessionKey);
			const searchSyncEnabled = (this.settings.sync.onSearch || sessionStartSync) && (this.purpose === "default" || this.purpose === "cli");
			if (!embeddingBootstrapKeywordOnly && !this.provider && (this.providerLifecycle.mode === "pending" || this.providerLifecycle.mode === "degraded" && this.providerLifecycle.providerId !== this.settings.provider)) {
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
			const refreshSearchIdentity = () => embeddingBootstrapKeywordOnly ? this.refreshKeywordFallbackIndexIdentity(indexState) : this.refreshIndexIdentityDirty({
				providerKeyKnown: this.providerInitialized,
				indexState
			});
			const indexIdentity = refreshSearchIdentity();
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
			let repairedIndexIdentity = shouldRepairIdentity ? refreshSearchIdentity() : indexIdentity;
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
				const leasedIdentity = refreshSearchIdentity();
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
				const results = (keywordOnly || hybrid.enabled) && this.fts.enabled && this.fts.available ? await this.searchKeywordWithFallback(normalizedQuery, candidates, keywordOptions, sourceFilterList, initialResult).catch((err) => {
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
			const embedQuery = () => this.embedQueryWithRetry(normalizedQuery, opts?.signal, semanticProvider, semanticProviderRuntime, opts?.[MEMORY_SEARCH_DEADLINE_CONTROL]);
			let keywordResults = [];
			let queryVec;
			const releaseSemanticProvider = this.acquireProviderUse(semanticProvider);
			try {
				keywordResults = await loadKeywordResults();
				try {
					queryVec = await embedQuery();
				} catch (err) {
					releaseSemanticProvider();
					if (opts?.signal?.aborted) throw err;
					opts?.onPartialResults?.(null);
					this.markLocalEmbeddingProviderDegraded(err);
					const message = formatErrorMessage(err);
					if (isMemoryEmbeddingOperationError(err) ? await this.activateFallbackProvider(message).catch((fallbackErr) => {
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
								queryVec = await embedQuery();
							} catch (fallbackErr) {
								releaseFallbackProvider();
								if (!opts?.signal?.aborted) this.markLocalEmbeddingProviderDegraded(fallbackErr);
								throw fallbackErr;
							}
						} finally {
							releaseFallbackProvider();
						}
					} else if ((!this.provider || this.providerRequirement.mode !== "required") && this.fts.enabled && this.fts.available) {
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
					sessionSourceMtimes: this.loadSourceMtimes("sessions", vectorResults),
					memorySourceMtimes: this.loadSourceMtimes("memory", vectorResults)
				});
				const activeProjects = prepareActiveProjectKeys(opts?.activeProjectKeys);
				return applyProjectRanking(applyImportanceMultiplier(decayed), activeProjects).filter((entry) => entry.score >= minScore).toSorted((left, right) => right.score - left.score || left.path.localeCompare(right.path) || left.startLine - right.startLine || left.endLine - right.endLine).slice(0, maxResults);
			}
			const matchExactPath = prepareExactPathMatcher(normalizedQuery);
			return selectHybridSearchResults({
				merged: await mergeHybridResults({
					vector: vectorResults.map((entry) => ({
						...entry,
						vectorScore: entry.score,
						exactPathSpecificity: matchExactPath(entry.path)
					})),
					keyword: keywordResults.map((entry) => ({
						...entry,
						rankingScore: entry.score
					})),
					vectorWeight: hybrid.vectorWeight,
					textWeight: hybrid.textWeight,
					isNonTextMediaPath: (path) => classifyMemoryMultimodalPath(path, this.settings.multimodal) !== null,
					mmr: hybrid.mmr,
					temporalDecay: hybrid.temporalDecay,
					activeProjectKeys: opts?.activeProjectKeys,
					workspaceDir: this.workspaceDir,
					sessionSourceMtimes: this.loadSourceMtimes("sessions", [...keywordResults, ...vectorResults]),
					memorySourceMtimes: this.loadSourceMtimes("memory", [...keywordResults, ...vectorResults])
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
			vectorTable: MEMORY_INDEX_VECTOR_TABLE,
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
								runInBackgroundContext: source?.backgroundRunner ?? params.runInBackgroundContext,
								maintenanceSource: source,
								databaseOptions
							});
							managerRegistry.track(manager, key);
							return manager;
						};
						manager = purpose === "status" ? create() : await withOpenClawAgentDatabaseWrite(databaseOptions, create, source?.publishedDatabase.db);
						await manager.memoryWatcherReady;
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
				reuse: ({ closing, closed, db, memoryFiles: files, backgroundRunner }) => !closing && !closed && db.isOpen && files === memoryFiles && backgroundRunner === (source?.backgroundRunner ?? params.runInBackgroundContext)
			};
		} });
	}
	constructor(params) {
		super(params.maintenanceSource?.automaticRebuildNotice);
		this.createProvider = (adapter, create) => this.managerRegistry.createProvider(this, adapter, create);
		this.runInBackgroundContext = (run) => {
			if (!this.backgroundRunner) throw new Error("Memory background work requires a plugin lifecycle owner");
			return this.backgroundRunner(run);
		};
		this.closePromise = null;
		this.publishedDatabaseReleased = false;
		this.syncing = null;
		this.syncingMemoryWatchGeneration = 0;
		this.sessionSyncQueue = new MemoryTargetedSessionSyncQueue({
			isClosed: () => this.closing || this.closed,
			getSyncing: () => this.syncing,
			sync: (params) => this.syncAdmitted(params, { queuedSessionOwner: true })
		});
		this.managerRegistry = params.managerRegistry;
		const source = params.maintenanceSource;
		const effectiveSettings = resolveEffectiveMemorySearchSettings(params.settings);
		const dbPath = params.databaseOptions.path;
		this.cacheKey = params.cacheKey;
		this.acquireLocalService = params.acquireLocalService;
		this.backgroundRunner = params.runInBackgroundContext;
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
		this.providerLifecycle = {
			mode: "pending",
			requestedProvider: this.settings.provider
		};
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
			const transient = this.purpose !== "default";
			const invalidatedSources = new Set(this.db.prepare("SELECT DISTINCT source FROM memory_index_sources WHERE hash = ''").all().flatMap((row) => row.source === "memory" || row.source === "sessions" ? [row.source] : []));
			this.memorySourceProvenanceRepairPending = this.sources.has("memory") && invalidatedSources.has("memory");
			this.dirty = this.sources.has("memory") && (!transient || !meta) || this.memorySourceProvenanceRepairPending;
			if (this.sources.has("sessions") && invalidatedSources.has("sessions")) {
				this.sessionsDirty = true;
				this.sessionsFullRetryDirty = true;
			}
			this.batch = this.resolveBatchConfig();
			if (!transient) this.runInBackgroundContext(() => {
				this.ensureWatcher();
				this.ensureSessionListener();
				this.ensureIntervalSync();
				this.runInBackgroundContext(() => this.ensureSessionStartupCatchup()).catch((err) => {
					log.warn("memory session startup catch-up failed: " + String(err));
				});
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
			if (hasTargetedSessionSyncParams(params) && this.sessionSyncQueue.hasPending) return await this.sessionSyncQueue.enqueue(params);
			return await this.syncAdmitted(params);
		});
	}
	async syncPublishedIndexInBackground(params) {
		if (this.syncing) return await this.syncing;
		await this.syncOutcomes.track(() => runMemorySearchMaintenance({
			reason: params.reason,
			takeDirtyGeneration: () => this.takeSearchMaintenanceRequest(),
			restoreDirtyGeneration: (generation) => this.adoptReindexRetryState(generation),
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
				return this.sessionSyncQueue.enqueue(params);
			}
			try {
				await this.syncing;
				if (params?.reason === "watch" && this.dirty && !this.closing && !this.closed && this.memoryWatchGeneration > this.syncingMemoryWatchGeneration) return await this.syncAdmitted(params, options);
				return;
			} catch (err) {
				if (options?.allowEmbeddingBootstrapFallback && this.providerRequirement.mode === "optional" && (!this.providerInitialized || this.embeddingBootstrapFailure !== void 0)) {
					if (!this.embeddingBootstrapFailure) this.markEmbeddingBootstrapFailure(err);
					return await this.syncAdmitted(params, options);
				}
				throw err;
			}
		}
		this.syncingMemoryWatchGeneration = this.memoryWatchGeneration;
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
				if (!(this.providerRequirement.mode === "optional" && (options?.allowEmbeddingBootstrapFallback || hadBootstrapFailure) && isMemoryEmbeddingOperationError(err))) throw err;
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
		return this.syncing;
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
			requestedProvider: this.settings.provider,
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
			requestedProvider: this.settings.provider,
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
				watcher: this.memoryWatcherHealth,
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
		const closeOperation = this.withPublishedDatabase(() => this.publishedDatabaseReleased ? this.retryFailedClose() : this.closeOnce());
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
		const errors = [];
		await this.closeWatchResources().catch((error) => errors.push(error));
		const retirementErrors = await this.drainPendingProviderRetirements();
		if (this.providersPendingRetirement.size > 0) errors.push(toErrorObject(retirementErrors.at(-1), "Embedding provider retirement failed"));
		if (!this.publishedDatabaseReleased) try {
			await this.publishedDatabase.closePublicationWorker();
			this.publishedDatabase.release();
			this.publishedDatabaseReleased = true;
		} catch (error) {
			errors.push(error);
		}
		if (errors.length === 1) throw errors[0];
		if (errors.length > 1) throw new AggregateError(errors, "Memory manager cleanup failed");
	}
	async closeOnce() {
		this.closing = true;
		this.sessionSyncQueue.clear();
		await this.awaitManagerIdle();
		this.closed = true;
		const pendingProviderInit = this.providerInitPromise;
		const pendingFallbackInit = this.fallbackProviderInitPromise;
		const reportPendingWorkError = (err) => {
			log.warn(`memory close: pending manager work failed: ${formatErrorMessage(err)}`);
		};
		await pendingProviderInit?.catch(reportPendingWorkError);
		await pendingFallbackInit?.catch(reportPendingWorkError);
		await this.syncing?.catch(reportPendingWorkError);
		await this.retryFailedClose();
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
