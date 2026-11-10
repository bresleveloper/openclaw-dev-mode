import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "../../string-coerce-1VuiLaaR.mjs";
import { F as resolveTimerTimeoutMs, n as MAX_TIMER_TIMEOUT_MS } from "../../number-coercion-CkhMiRw8.mjs";
import { d as toErrorObject, l as readErrorName } from "../../error-coercion-BwMr25F8.mjs";
import { a as resolveGlobalSingleton } from "../../global-singleton-DrXvEBww.mjs";
import { t as createDeferredCore } from "../../deferred-D0La5CRk.mjs";
import { o as resolveUserPath } from "../../home-dir-CtsdYvX3.mjs";
import { a as asOptionalRecord } from "../../record-coerce-TIsquoVR.mjs";
import { b as uniqueValues } from "../../string-normalization-D6DKCpwE.mjs";
import { s as redactSensitiveText } from "../../redact-BcXJu5HP.mjs";
import { d as sleepWithAbort } from "../../src-Bzfi3cQM.mjs";
import { r as resolveStateDir } from "../../state-dir-C8s3cOPX.mjs";
import { t as formatErrorMessage } from "../../errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "../../subsystem-mStysHHC.mjs";
import { i as resolveRuntimeWorkerUrl, n as resolveRuntimeWorkerArgv } from "../../runtime-worker-url-CvMrvFI1.mjs";
import { a as ensureSqliteLibrarySelected } from "../../bun-sqlite-library-CYR1RYZS.mjs";
import { D as readSqliteDatabaseScopedWriteTokenForPath } from "../../sqlite-database-admission-CqdNF9iE.mjs";
import { n as normalizeAgentId } from "../../agent-id-D1-Q6vR4.mjs";
import { r as WorkerTaskError } from "../../src-NEpyeLp1.mjs";
import { i as runQueuedStoreWrite } from "../../store-writer-queue-AKR6NnXM.mjs";
import { t as SQLITE_IDLE_HANDLE_TTL_MS } from "../../sqlite-handle-lifecycle-dWd9h3ii.mjs";
import { a as resolveAgentDir, f as resolveAgentWorkspaceDir, r as resolveAgentConfig } from "../../agent-scope-config-fjA2T9Gz.mjs";
import { a as readOpenClawAgentDatabaseIdentity } from "../../openclaw-agent-db-identity-CnM2kzVa.mjs";
import { c as openSqliteWorkerStore, f as runSqliteWorkerStoreWrite } from "../../sqlite-worker-store-Bzw_c0pA.mjs";
import { d as MEMORY_INDEX_VECTOR_TABLE, h as MEMORY_INDEX_PATHS_FTS_TABLE, m as MEMORY_INDEX_FTS_TABLE } from "../../memory-schema-DY2eOY6N.mjs";
import { i as onInternalSessionTranscriptUpdate } from "../../transcript-events-D3brcRJS.mjs";
import { t as retryAsync } from "../../retry-DwDRpCWu.mjs";
import { t as createPermitPool } from "../../permit-pool-DWNEROq5.mjs";
import { n as enqueueKeyedTask } from "../../keyed-async-queue-CTreGrmR.mjs";
import { r as captureOpenClawAgentDatabaseExecution, s as supportsOpenClawAgentDatabaseExecution } from "../../openclaw-agent-execution-BMcCyPIg.mjs";
import { r as openOpenClawAgentSqliteWorkerStoreV2 } from "../../openclaw-agent-worker-store-CcajP8TM.mjs";
import { n as createMemorySearchDeadlineControl, t as MEMORY_SEARCH_DEADLINE_CONTROL } from "../../search-deadline-control-CvwcTLrz.mjs";
import { i as getAgentWorkspaceAccess } from "../../workspace-access-sFz3TNTx.mjs";
import "../../memory-core-host-engine-knn--De7HW1q.mjs";
import { t as isVectorKnnRow } from "../../manager-search-knn-BcL6ZfNx.mjs";
import "../../error-runtime-ikopZs5O.mjs";
import "../../string-coerce-runtime-BbIJhy7G.mjs";
import { d as buildMultimodalChunkForIndexing, h as normalizeExtraMemoryPathEntries, l as readMemoryFile, u as buildFileEntry } from "../../engine-storage-DAQECy5K.mjs";
import "../../memory-core-host-engine-storage-wV2XR0Rc.mjs";
import { n as estimateUtf8Bytes, t as estimateStructuredEmbeddingInputBytes } from "../../embedding-input-limits-ByYEpQut.mjs";
import { t as isFileMissingError } from "../../fs-utils-CGe1-9Am.mjs";
import { t as hashText } from "../../hash-BOTtT1fO.mjs";
import { n as classifyMemoryMultimodalPath } from "../../multimodal-Di4Q334s.mjs";
import { t as retryTransientMemoryRead } from "../../openclaw-runtime-io-Vhn7I2o9.mjs";
import "../../markdown-chunks-D_nW3u36.mjs";
import { t as INVALID_PROJECT_ANNOTATION_KEY } from "../../curated-annotations-DM9mz8Th.mjs";
import { t as runWithConcurrency } from "../../concurrency-BvONODc2.mjs";
import { i as readMemorySearchManagerStatus, t as formatMemoryIndexRebuildGuidance } from "../../types-CGuNDIwt.mjs";
import { o as sdkOpenNodeSqliteDatabase } from "../../sqlite-runtime-COh9hQA9.mjs";
import { n as resolveMemorySessionStartupState, r as resolveMemorySessionSyncPlan, t as isMemorySessionIndexable } from "../../manager-session-sync-state-CA5Z9OSL.mjs";
import { a as MEMORY_INDEX_META_KEY, f as resolveMemorySourceFileEntries, g as isValidMemoryEmbedding, l as inspectMemorySourceState, m as collectMemoryCachedEmbeddings, n as memoryChunkRowId } from "../../manager-source-index-kernel-DMTrRWNm.mjs";
import { i as resolveEmbeddingInputFormatVersion, r as hasNonTextEmbeddingParts, t as formatEmbeddingModelInput } from "../../embedding-inputs-DTHx5hjN.mjs";
import { i as prepareExactPathMatcher, n as resolveStatusProviderInfo, r as buildMemorySourceFilter, s as searchVector, t as collectMemoryStatusSnapshot } from "../../manager-status-state-D29k4MxO.mjs";
import { i as resolveChunkProvenance } from "../../manager-session-index-preparation-CMSNOXGU.mjs";
import { t as MemoryIndexRevisionConflictError } from "../../manager-db-kernel-WGk4tT1_.mjs";
import { n as MEMORY_INDEX_WRITE_SCOPE } from "../../manager-publication-task-B1g1hKrX.mjs";
import { r as readMemoryShadowIdentity, t as assertMemoryShadowIdentity } from "../../manager-shadow-task-DKSy_h58.mjs";
import "../../security-runtime-6domDoE8.mjs";
import "../../agent-workspace-runtime-x7RZOSxd.mjs";
import { t as memoryCpuProcessEntrypoints } from "../../manager-cpu-entrypoints-CUaNAvfp.mjs";
import { t as vectorKnnProcessEntrypoint } from "../../manager-search-knn-entrypoint-D4BNu0VT.mjs";
import "../../runtime-env-BMLaJD4Z.mjs";
import { t as expectDefined } from "../../expect-runtime-CJBt0Gq2.mjs";
import "../../number-runtime-D3v2w3D4.mjs";
import "../../retry-runtime-CUY_Gz8_.mjs";
import "../../process-runtime-CG9_3L3N.mjs";
import "../../routing-Dl7FngGa.mjs";
import "../../agent-scope-runtime-Dld1eD8B.mjs";
import { n as resolveMemorySearchConfig } from "../../memory-search-Fa28vl7G.mjs";
import { r as listRegisteredMemoryEmbeddingProviderAdapters } from "../../memory-embedding-provider-runtime-QhiZ6pba.mjs";
import "../../concurrency-runtime-Eh-iOyQU.mjs";
import { t as createPluginRuntimeStore } from "../../runtime-store-pFaG-6b2.mjs";
import "../../memory-core-host-embedding-registry-DnKXzk3k.mjs";
import { S as isEmbeddingBatchUnavailableError } from "../../memory-core-host-engine-embeddings-BIgAa5Te.mjs";
import { t as observeAgentRunActivity } from "../../agent-run-activity-w99ALh1H.mjs";
import "../../memory-core-host-engine-foundation-Cj49LzJw.mjs";
import { o as sessionPathForSessionIdentity } from "../../session-entry-render-BZbrykV0.mjs";
import { a as sessionPathForFile, s as statSessionEntrySync, t as buildSessionEntries } from "../../session-files-Cv_U1iPC.mjs";
import { n as listSessionTranscriptCorpusEntriesForAgent, t as buildSessionEntry } from "../../memory-core-host-engine-sessions-D3l0Zm6q.mjs";
import { i as markMemoryIndexingLive, n as getMemoryManagerLifecycle, t as MemoryManagerReloadError } from "../../lifecycle-DzyiQIdz.mjs";
import { et as withMemoryWorkspaceLock, tt as withMemoryWorkspacePreparation } from "../../dreaming-dreams-file-BFl4u8HC.mjs";
import { t as findForgottenMemorySessionIds } from "../../memory-entry-origins-CgmXP4fy.mjs";
import { r as tokenize, t as jaccardSimilarity } from "../../tokenize-BrhRR-qj.mjs";
import { n as readSessionResetRecallCutoffMetadata } from "../../session-reset-recall-metadata-_gATHFyh.mjs";
import { a as runMemoryDatabaseAdmission, c as runMemoryIndexState, f as runMemoryRecallMetadata, h as runMemoryVectorLoad, i as runMemoryCuratedCandidates, l as runMemoryKeywordSearch, m as runMemoryVectorFallback, p as runMemoryStatus, r as readMemoryTranscriptStatsInWorker, s as runMemoryIndexRead, t as prepareMemoryIndexInWorker } from "../../manager-cpu-worker-runtime-CTMGdAU_.mjs";
import { d as withMemoryIndexGeneration, i as closeMemoryDatabase, l as waitForMemoryReindexLock, n as logMemoryVectorDegradedWrite, o as openMemoryDatabaseReadOnlyAtPath, r as cleanupAgedMemoryReindexTempFiles, s as removeMemoryDatabaseFiles, u as acquireMemoryIndexReadGeneration } from "../../manager-vector-warning-DIiv_r69.mjs";
import { a as resolveEmbeddingProviderIndexIdentity, i as resolveEmbeddingProviderFallbackRemote, n as resolveEmbeddingProviderAdapterTransport, r as resolveEmbeddingProviderFallbackModel, t as createEmbeddingProvider } from "../../embeddings-CIw54BqS.mjs";
import { t as MemoryFileWatcher } from "../../file-watcher-C6cLmEoG.mjs";
import { t as resolveMemoryPathClassification } from "../../memory-path-provenance-CFF9CvRa.mjs";
import { n as runEmbeddingOperationWithTimeout } from "../../paused-deadline-BS0-lwCR.mjs";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import { spawn } from "node:child_process";
import { setImmediate as setImmediate$1, setTimeout as setTimeout$1 } from "node:timers/promises";
//#region extensions/memory-core/src/memory/manager-publication-transfer.ts
const FRAGMENT_CHARS = 16384;
const BATCH_BYTES = 524288;
const NUMERIC_PART_ITEMS = 512;
/** Bound the direct command before serializing; oversized vectors retain streamed staging. */
function memoryEmbeddingCacheFitsInline(header, entries) {
	let bytes = 512 + 2 * (header.agentId.length + header.provider.id.length + header.provider.model.length + header.providerKey.length);
	for (const entry of entries) {
		bytes += 128 + 2 * (entry.hash.length + (entry.sessionId?.length ?? 0)) + 32 * entry.embedding.length;
		if (bytes > BATCH_BYTES) return false;
	}
	return bytes <= BATCH_BYTES && entries.every((entry) => entry.embedding.every(Number.isFinite));
}
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
function memoryPublicationHeader(replacement) {
	const { chunks: _chunks, embeddings: _embeddings, ...fields } = replacement;
	if (fields.source !== "sessions") return fields;
	const { retained: _retained, removedIds, ...header } = fields;
	return {
		...header,
		delta: removedIds !== void 0
	};
}
function* memoryPublicationBatches(replacement) {
	function* rows() {
		if (replacement.source === "sessions") for (const removedId of replacement.removedIds ?? []) yield { removedId };
		const retained = replacement.source === "sessions" ? replacement.retained ?? [] : [];
		for (const chunk of retained) yield {
			chunk: {
				...row(chunk),
				text: ""
			},
			embedding: [],
			retained: true
		};
		for (const [index, chunk] of replacement.chunks.entries()) yield {
			chunk: row(chunk),
			embedding: replacement.embeddings[index] ?? []
		};
	}
	function row(chunk) {
		return {
			startLine: chunk.startLine,
			endLine: chunk.endLine,
			text: chunk.text,
			hash: chunk.hash,
			importance: chunk.importance,
			triggers: chunk.triggers,
			projectKey: chunk.projectKey,
			...chunk.provenance ? { provenance: { ...chunk.provenance } } : {}
		};
	}
	yield* publicationBatches(rows());
}
/** Ordinary sources fit one bounded command; larger sources retain chunked transfer. */
function memoryPublicationInline(replacement) {
	const batches = memoryPublicationBatches(replacement);
	const first = batches.next();
	if (!batches.next().done) return;
	return {
		header: memoryPublicationHeader(replacement),
		fragments: first.value ?? []
	};
}
/** A group shares one bounded worker request and one native transaction. */
function memoryPublicationGroup(replacements) {
	const sources = [];
	let bytes = 0;
	for (const replacement of replacements) {
		const source = memoryPublicationInline(replacement);
		if (!source) return;
		bytes += JSON.stringify(source.header).length * 2;
		for (const fragment of source.fragments) bytes += Math.max(Buffer.byteLength(fragment.json), fragment.json.length * 2) + 128;
		if (bytes > BATCH_BYTES) return;
		sources.push(source);
	}
	return sources;
}
function* memoryEmbeddingCacheBatches(entries) {
	yield* publicationBatches(entries, true);
}
function* publicationBatches(rows, preserveNegativeZero = false) {
	let batch = [];
	let bytes = 0;
	for (const value of rows) {
		const fragments = rowFragments(value, preserveNegativeZero);
		let current = fragments.next();
		while (!current.done) {
			const next = fragments.next();
			const cost = Math.max(Buffer.byteLength(current.value), current.value.length * 2) + 128;
			if (batch.length && bytes + cost > BATCH_BYTES) {
				yield batch;
				batch = [];
				bytes = 0;
			}
			batch.push({
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
//#region extensions/memory-core/src/memory/manager-publication.ts
async function initializePublishedMemory(options, schema, assertCurrent) {
	const worker = await openOpenClawAgentSqliteWorkerStoreV2(options, {
		version: 2,
		assertCurrent
	}, {
		moduleUrl: resolveRuntimeWorkerUrl(memoryCpuProcessEntrypoints.publication),
		input: { kind: "agent" }
	});
	try {
		await worker.prepare();
		return {
			worker,
			admitted: schema ? await retryMemoryPublication({
				run: () => worker.execute({
					type: "schema.admit",
					input: schema
				}, assertCurrent),
				busyTimeoutMs: 5e3,
				prepare: async () => true
			}) : void 0
		};
	} catch (error) {
		await worker.close();
		throw error;
	}
}
async function withPublishedMemoryExecution(options, source, run) {
	let execution;
	if (options && supportsOpenClawAgentDatabaseExecution(options)) {
		if (!source) throw new Error("Memory publication requires its live file owner");
		execution = captureOpenClawAgentDatabaseExecution(options, { expectedIdentity: {
			kind: "file",
			physicalIdentity: source.identity,
			nativeLocation: source.filename,
			birthtime: source.birthtime
		} });
	}
	const failures = [];
	for (const settle of [run, () => execution?.release()]) try {
		await settle();
	} catch (error) {
		failures.push(error);
	}
	if (failures.length === 1) throw failures[0];
	if (failures.length > 1) throw new AggregateError(failures, `${String(failures[0])}; Memory sync cleanup failed`, { cause: failures[0] });
}
async function retryMemoryPublication(params) {
	const deadline = performance.now() + params.busyTimeoutMs;
	while (await params.prepare()) {
		const result = await params.run();
		if (result.ok) return result;
		const code = result.error.errcode === void 0 ? void 0 : result.error.errcode & 255;
		if (result.entered || code !== 5 && code !== 6 || performance.now() >= deadline) throw Object.assign(result.error.name === "MemoryIndexRevisionConflictError" ? new MemoryIndexRevisionConflictError(result.error.message) : new Error(result.error.message), result.error, {
			entered: result.entered,
			committed: result.committed
		});
		await setTimeout$1(Math.min(25, Math.max(0, deadline - performance.now())));
	}
}
/** Small publications use one request; larger inputs retain their bounded transfer scope. */
async function publishMemorySource(params) {
	const { replacement, state, execute, run, retry, prepare, assertPublished } = params;
	if (Array.isArray(replacement)) return retry(() => {
		const sources = memoryPublicationGroup(replacement);
		if (!sources) throw new Error("Memory publication group exceeds its bounded transfer");
		return execute({
			type: "source.replace.group",
			input: {
				sources,
				state: state()
			}
		});
	}, prepare);
	const inline = memoryPublicationInline(replacement);
	if (inline) return retry(() => execute({
		type: "source.replace.inline",
		input: {
			...inline,
			state: state()
		}
	}), prepare);
	return run(async (scope) => {
		const header = memoryPublicationHeader(replacement);
		await scope.execute({
			type: "stage.start",
			input: { header }
		});
		for (const fragments of memoryPublicationBatches(replacement)) await scope.execute({
			type: "stage.append",
			input: { fragments }
		});
		const result = await retry(() => scope.execute({
			type: "source.replace",
			input: { state: state() }
		}), prepare);
		assertPublished?.();
		if (result === void 0) await scope.execute({
			type: "stage.discard",
			input: void 0
		});
		return result;
	});
}
/** Cache entries are content-addressed; the worker excludes forgotten sessions. */
async function publishMemoryEmbeddingCache(params) {
	const { scope, mutation, prepare, retry } = params;
	if (!prepare()) return;
	const prepareRetry = async () => prepare();
	if (mutation.kind === "clear") return await retry(() => scope.execute({
		type: "cache.clear",
		input: { identities: mutation.identities }
	}), prepareRetry);
	if (memoryEmbeddingCacheFitsInline(mutation.header, mutation.entries)) return await retry(() => scope.execute({
		type: "cache.write.inline",
		input: {
			header: mutation.header,
			entries: mutation.entries
		}
	}), prepareRetry);
	await scope.execute({
		type: "cache.stage.start",
		input: { header: mutation.header }
	});
	for (const fragments of memoryEmbeddingCacheBatches(mutation.entries)) await scope.execute({
		type: "stage.append",
		input: { fragments }
	});
	const current = await retry(() => scope.execute({
		type: "cache.write",
		input: void 0
	}), prepareRetry);
	if (current === void 0) await scope.execute({
		type: "stage.discard",
		input: void 0
	});
	return current;
}
//#endregion
//#region extensions/memory-core/src/memory/manager-database-context.ts
const log$11 = createSubsystemLogger("memory");
var MemoryIndexDatabase = class MemoryIndexDatabase {
	static async openPublished(params) {
		let initialized;
		if (!params.readOnly) initialized = await initializePublishedMemory(params.writeOptions, params.maintenanceSource ? void 0 : params.schema, () => {
			const source = params.maintenanceSource;
			if (source && !source.isOpen) throw new Error("Memory maintenance source connection changed");
		});
		let database;
		try {
			const admitted = initialized?.admitted;
			const admission = params.readOnly ? await runMemoryDatabaseAdmission({
				databasePath: params.writeOptions.path,
				agentId: params.agentId
			}) : params.maintenanceSource?.admission ?? admitted?.value.admission;
			if (!admission) throw new Error("Memory worker did not publish database admission");
			database = new MemoryIndexDatabase(void 0, void 0, params.readOnly, params.writeOptions, admission.hasIndex, admission);
			if (initialized) {
				database.terminalSignal = initialized.worker.terminalSignal;
				database.publicationWorker = Promise.resolve({
					store: initialized.worker,
					busyTimeoutMs: 5e3
				});
			}
			database.fts.enabled = params.schema.ftsEnabled;
			if (params.maintenanceSource) database.installFacts(params.maintenanceSource.facts, params.maintenanceSource.factsToken);
			if (params.maintenanceSource && (!database.fts.enabled || params.maintenanceSource.fts.available)) Object.assign(database.fts, params.maintenanceSource.fts);
			else if (params.readOnly) {
				database.fts.available = database.hasIndex && database.fts.enabled && admission.ftsAvailable;
				if (admission.facts) database.installFacts(admission.facts);
			} else if (admitted) {
				if (admitted.facts) database.installFacts(admitted.facts, admitted.writeToken);
				database.fts.available = admitted.value.ftsAvailable;
				database.fts.loadError = admitted.value.ftsError;
				if (params.schema.ftsEnabled && admitted.value.ftsError) log$11.warn(`fts unavailable: ${admitted.value.ftsError}`);
			}
			return database;
		} catch (error) {
			try {
				await initialized?.worker.close();
			} finally {
				database?.release();
			}
			throw error;
		}
	}
	static async openShadow(filename, allowExtension) {
		const store = await openSqliteWorkerStore({
			moduleUrl: resolveRuntimeWorkerUrl(memoryCpuProcessEntrypoints.publication),
			databasePath: filename,
			input: { allowExtension }
		});
		let db;
		try {
			const connection = await store.execute({
				type: "connection.inspect",
				input: void 0
			});
			assertMemoryShadowIdentity(filename, connection.fileIdentity);
			db = sdkOpenNodeSqliteDatabase(filename, {
				readOnly: true,
				allowExtension
			});
			const database = new MemoryIndexDatabase(db);
			database.shadow = {
				path: filename,
				identity: connection.fileIdentity,
				pragmas: connection.pragmas
			};
			database.publicationWorker = Promise.resolve(database.bindShadowWorker(store, connection.pragmas.busy_timeout));
			return database;
		} catch (error) {
			try {
				await store.close();
			} finally {
				db?.close();
			}
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
	constructor(db, release, readOnly = false, writeOptions, hasIndex = true, admission) {
		this.readOnly = readOnly;
		this.writeOptions = writeOptions;
		this.hasIndex = hasIndex;
		this.admission = admission;
		this.privateQueues = /* @__PURE__ */ new Map();
		this.nativeWriterActive = false;
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
		this.facts = {
			meta: null,
			serialized: null,
			revision: 0,
			hasIndexedChunks: false,
			hasSemanticChunks: false,
			invalidatedSources: [],
			hasVectorTable: false,
			vectorState: { state: "empty" }
		};
		this.vectorDegradedWriteWarningShown = false;
		this.closed = false;
		this.nativeDb = db;
		this.nativeRelease = release ?? (db ? () => closeMemoryDatabase(db) : void 0);
	}
	get isOpen() {
		return !this.closed && !this.terminalSignal?.aborted && this.nativeDb?.isOpen !== false;
	}
	/** Released synchronous status compatibility; runtime callers use worker reads. */
	get db() {
		if (!this.isOpen) throw new Error("Memory database owner is closed");
		if (!this.nativeDb) {
			const target = this.writeOptions;
			if (!target?.agentId || !target.path) throw new Error("Memory compatibility reader requires its captured target");
			const connection = openMemoryDatabaseReadOnlyAtPath(target.path, false, target.agentId);
			this.nativeDb = connection.db;
			this.nativeRelease = connection.release;
		}
		return this.nativeDb;
	}
	release() {
		this.nativeRelease?.();
		this.closed = true;
	}
	writeToken() {
		const filename = this.shadow?.path ?? this.writeOptions?.path;
		return filename ? readSqliteDatabaseScopedWriteTokenForPath(filename, MEMORY_INDEX_WRITE_SCOPE) : void 0;
	}
	installFacts(facts, token) {
		this.facts = facts;
		this.factsToken = token;
	}
	async refreshFacts() {
		if (!this.hasIndex || this.readOnly) return;
		const token = this.writeToken();
		if (token !== void 0 && token === this.factsToken) return;
		this.installFacts(await this.read({
			type: "index.facts",
			input: void 0
		}, () => {
			if (!this.isOpen) throw new Error("Memory database owner closed before reading index facts");
		}), token);
	}
	async writeMetadata(meta) {
		if (this.facts.serialized === JSON.stringify(meta)) return;
		await this.retryPublication(() => this.executePublication({
			type: "index.writeMetadata",
			input: meta
		}, () => {
			if (!this.isOpen) throw new Error("Memory database owner closed before writing index metadata");
		}));
	}
	get isShadow() {
		return this.shadow !== void 0;
	}
	assertShadowPath() {
		if (this.shadow) assertMemoryShadowIdentity(this.shadow.path, this.shadow.identity);
	}
	withPrivateAccess(operation, options = {}) {
		if (this.closed) return Promise.reject(/* @__PURE__ */ new Error("Memory reindex database owner is closed"));
		return runQueuedStoreWrite({
			queues: this.privateQueues,
			storePath: this.shadow?.path ?? "memory-index",
			label: "private memory index access",
			reentrant: options.reentrant === true && !this.nativeWriterActive,
			fn: async () => {
				if (!this.isOpen) throw new Error("Memory reindex database owner is closed");
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
			hasVectorTable: this.facts.hasVectorTable,
			...this.vector.available && this.vector.extensionPath ? { extensionPath: this.vector.extensionPath } : {}
		};
	}
	assertPublishedFileCurrent() {
		if (!this.isOpen || !this.writeOptions?.path) throw new Error("Memory publication owner closed or changed");
		const source = this.admission?.identity ?? (this.nativeDb ? readOpenClawAgentDatabaseIdentity({ db: this.nativeDb }) : void 0);
		const current = readMemoryShadowIdentity(this.writeOptions.path);
		if (source?.identity !== `${current.device}:${current.inode}`) throw new Error("Memory publication source file changed");
	}
	getPublicationWorker() {
		this.publicationWorker ??= (async () => {
			const filename = this.shadow?.path ?? this.writeOptions?.path;
			if (!filename || this.readOnly || this.closed) throw new Error("Memory publication requires its live file owner");
			if (this.writeOptions) {
				this.assertPublishedFileCurrent();
				const store = await openOpenClawAgentSqliteWorkerStoreV2(this.writeOptions, {
					version: 2,
					assertCurrent: () => {
						if (!this.isOpen) throw new Error("Memory publication owner closed");
					}
				}, {
					moduleUrl: resolveRuntimeWorkerUrl(memoryCpuProcessEntrypoints.publication),
					input: { kind: "agent" }
				});
				this.terminalSignal = store.terminalSignal;
				return {
					store,
					busyTimeoutMs: 5e3
				};
			}
			const pragmas = this.shadow.pragmas;
			const worker = {
				moduleUrl: resolveRuntimeWorkerUrl(memoryCpuProcessEntrypoints.publication),
				input: {
					fileIdentity: this.shadow?.identity ?? readMemoryShadowIdentity(filename),
					pragmas
				}
			};
			const store = await openSqliteWorkerStore({
				...worker,
				databasePath: filename,
				existingOnly: true,
				admission: {
					identity: `file:${this.shadow.identity.device}:${this.shadow.identity.inode}`,
					assertCurrent: () => {
						if (!this.isOpen) throw new Error("Memory shadow owner closed before Worker open");
						this.assertShadowPath();
					}
				}
			});
			if (!store) throw new Error("Memory shadow disappeared before publication Worker open");
			return this.bindShadowWorker(store, pragmas.busy_timeout);
		})().catch((error) => {
			this.publicationWorker = void 0;
			throw error;
		});
		return this.publicationWorker;
	}
	bindShadowWorker(store, busyTimeoutMs) {
		const run = (operation, assertCurrent) => runSqliteWorkerStoreWrite(store, operation, () => {
			if (!this.isOpen) throw new Error("Memory shadow owner closed");
			this.assertShadowPath();
			assertCurrent();
		}, [this.shadow.path]);
		return {
			store: {
				run,
				execute: (command, assertCurrent, options) => run((scope) => scope.execute(command, options), assertCurrent),
				close: () => store.close()
			},
			busyTimeoutMs
		};
	}
	withPublicationWorker(operation, assertCurrent) {
		const run = async () => {
			assertCurrent();
			try {
				return await operation((await this.getPublicationWorker()).store);
			} catch (error) {
				const [cleanup] = await Promise.allSettled([this.closePublicationWorker()]);
				if (cleanup.status === "rejected") throw new AggregateError([error, cleanup.reason], `${String(error)}; Memory publication cleanup failed: ${String(cleanup.reason)}`, { cause: error });
				throw error;
			}
		};
		return this.isShadow ? this.withPrivateAccess(run, {
			nativeWriter: true,
			reentrant: true
		}) : run();
	}
	runPublication(operation, assertCurrent) {
		return this.withPublicationWorker((store) => store.run(operation, assertCurrent), assertCurrent);
	}
	executePublication(command, assertCurrent) {
		return this.withPublicationWorker((store) => store.execute(command, assertCurrent), assertCurrent);
	}
	async retryPublication(run, prepare = async () => true) {
		const result = await retryMemoryPublication({
			run,
			busyTimeoutMs: (await this.getPublicationWorker()).busyTimeoutMs,
			prepare
		});
		if (result?.facts) this.installFacts(result.facts, result.writeToken);
		return result?.value;
	}
	async read(command, assertCurrent) {
		if (this.isShadow) return this.executePublication(command, assertCurrent);
		const target = this.writeOptions;
		if (!target?.agentId || !target.path) throw new Error("Memory index reads require their captured database target");
		assertCurrent();
		return runMemoryIndexRead({
			agentId: target.agentId,
			databasePath: target.path
		}, command);
	}
	admitSchema(input) {
		this.schemaAdmission ??= this.retryPublication(() => this.executePublication({
			type: "schema.admit",
			input
		}, () => {
			if (!this.isOpen) throw new Error("Memory database owner closed before schema admission");
		})).then((result) => {
			if (!result) throw new Error("Memory schema admission did not complete");
			this.fts.enabled = input.ftsEnabled;
			this.fts.available = result.ftsAvailable;
			this.fts.loadError = result.ftsError;
			if (input.ftsEnabled && result.ftsError) log$11.warn(`fts unavailable: ${result.ftsError}`);
		});
		return this.schemaAdmission;
	}
	async readSourceState(query) {
		const assertCurrent = () => {
			if (!this.isOpen) throw new Error("Memory source owner closed during source preparation");
			this.assertShadowPath();
		};
		if (!this.hasIndex) return [];
		return this.read({
			type: "source.state",
			input: query
		}, assertCurrent);
	}
	async pruneEmbeddingCache(maxEntries, assertCurrent, recount = false) {
		assertCurrent();
		const input = {
			maxEntries,
			recount
		};
		const run = () => this.executePublication({
			type: "cache.prune",
			input
		}, assertCurrent);
		return await this.retryPublication(run) ?? false;
	}
	async mutateEmbeddingCache(mutation, assertCurrent, prepare) {
		const publish = (scope) => publishMemoryEmbeddingCache({
			scope,
			mutation,
			prepare,
			retry: (run, prepareRetry) => this.retryPublication(run, prepareRetry)
		});
		return mutation.kind === "clear" || memoryEmbeddingCacheFitsInline(mutation.header, mutation.entries) ? publish({ execute: (command) => this.executePublication(command, assertCurrent) }) : this.runPublication(publish, assertCurrent);
	}
	async replaceSource(replacement, assertCurrent, prepare) {
		return this.withSourceMutation(() => publishMemorySource({
			replacement,
			state: () => this.publicationState(),
			execute: (command) => this.executePublication(command, assertCurrent),
			run: (operation) => this.runPublication(operation, assertCurrent),
			retry: (run, prepareRetry) => this.retryPublication(run, prepareRetry),
			prepare,
			assertPublished: this.isShadow ? assertCurrent : void 0
		}));
	}
	async deleteSource(input, assertCurrent) {
		return this.withSourceMutation(() => this.retryPublication(() => this.executePublication({
			type: "source.delete",
			input: {
				...input,
				state: this.publicationState()
			}
		}, assertCurrent)));
	}
	refreshSourceState(input, assertCurrent) {
		return this.withSourceMutation(() => this.retryPublication(() => this.executePublication({
			type: "source.refresh",
			input
		}, assertCurrent)));
	}
	async prepareVector(extensionPath, assertCurrent) {
		return this.readOnly ? runMemoryVectorLoad(this.writeOptions, extensionPath) : this.retryPublication(() => this.executePublication({
			type: "vector.prepare",
			input: { state: {
				...this.publicationState(),
				extensionPath
			} }
		}, assertCurrent));
	}
	async updateIndexStructure(command, assertCurrent) {
		return this.retryPublication(() => this.executePublication(command, assertCurrent));
	}
	withSourceMutation(run) {
		return this.writeOptions?.path ? withMemoryIndexGeneration(this.writeOptions.path, "mutation", run) : run();
	}
	async publishShadow(input, assertCurrent) {
		await this.retryPublication(() => this.executePublication({
			type: "database.publish",
			input: {
				...input,
				state: {
					...this.publicationState(),
					extensionPath: input.sourceHasVectors ? input.extensionPath : void 0
				}
			}
		}, assertCurrent));
	}
	async closePublicationWorker() {
		if (this.publicationWorker) {
			await (await this.publicationWorker).store.close();
			this.publicationWorker = void 0;
		}
	}
	async withPublicationGeneration(run) {
		if (!this.isOpen) throw new Error("Memory publication requires its live file owner");
		await withPublishedMemoryExecution(this.readOnly ? void 0 : this.writeOptions, this.admission?.identity ?? (this.nativeDb ? readOpenClawAgentDatabaseIdentity({ db: this.nativeDb }) : void 0), run);
	}
	closeShadow() {
		this.closed = true;
		this.shadowClose ??= (async () => {
			await this.drainPrivateAccess();
			await this.closePublicationWorker();
			this.release();
			this.shadowReleased = true;
		})().catch((error) => {
			this.shadowClose = void 0;
			throw error;
		});
		return this.shadowClose;
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
async function runMemoryEmbeddingBatchTimeoutRetry(params) {
	let attempts = 1;
	while (true) {
		try {
			return {
				kind: "success",
				value: await params.run()
			};
		} catch (error) {
			if (attempts === 2 || !/timed out|timeout/i.test(formatErrorMessage(error))) return {
				kind: "failure",
				error,
				attempts
			};
		}
		params.onRetry();
		attempts = 2;
	}
}
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
const SPLITTABLE_MEMORY_EMBEDDING_BATCH_ERROR_RE = /(too many tokens overall,?\s*split into more batches|request_headers_too_large|request header fields too large|other side closed|ECONNRESET|EPIPE|UND_ERR_SOCKET|socket hang up|socket terminated|read ECONN|connection (?:reset|aborted)|\bembeddings (?:api input limit exceeded:\s*max\s+\d+\s*,\s*got\s+\d+|max input length is\s+\d+)\b|\bbatch size is invalid,?\s+it should not be larger than\s+\d+\b|\binput array max\s+\d+(?=\s*(?:["'}]|$))|input\s*数组最大不得超过\s*\d+\s*条)/i;
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
const MEMORY_EMBEDDING_BATCH_ITEM_LIMIT_RE = /\b(?:embeddings api input limit exceeded:\s*max\s+(\d+)\s*,\s*got\s+\d+|embeddings max input length is\s+(\d+(?:\.\d+)?)|batch size is invalid,?\s+it should not be larger than\s+(\d+(?:\.\d+)?)|input array max\s+(\d+)(?=\s*(?:["'}]|$))|input\s*数组最大不得超过\s*(\d+)\s*条)/gi;
function parseMemoryEmbeddingBatchItemLimit(message) {
	const limits = /* @__PURE__ */ new Set();
	for (const match of message.matchAll(MEMORY_EMBEDDING_BATCH_ITEM_LIMIT_RE)) {
		const value = Number(match[1] ?? match[2] ?? match[3] ?? match[4] ?? match[5]);
		if (!Number.isSafeInteger(value) || value <= 0) return;
		limits.add(value);
	}
	return limits.size === 1 ? limits.values().next().value : void 0;
}
function isInvalidEmbeddingResponse(error) {
	return asOptionalRecord(error)?.code === "INVALID_EMBEDDING_RESPONSE";
}
function embeddingRetryMessage(error) {
	const message = asOptionalRecord(error)?.embeddingErrorMessage;
	return typeof message === "string" ? message : formatErrorMessage(error);
}
function resolveMemoryEmbeddingRetryBudget(profile, error) {
	if (isInvalidEmbeddingResponse(error)) return;
	const fields = asOptionalRecord(error);
	const message = embeddingRetryMessage(error);
	const cooldown = fields?.retryAfterMs;
	const retryAfterMs = typeof cooldown === "number" && Number.isSafeInteger(cooldown) && cooldown >= 0 ? cooldown : void 0;
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
	if (SPLITTABLE_MEMORY_EMBEDDING_BATCH_ERROR_RE.test(message)) return;
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
	const split = async (splitAt) => {
		const results = [];
		for (let start = 0; start < params.items.length; start += splitAt) results.push(...await runMemoryEmbeddingBatchRetryWithSplit({
			...params,
			items: params.items.slice(start, start + splitAt)
		}));
		return results;
	};
	const cap = params.maxInputsPerRequest;
	if (cap !== void 0 && Number.isSafeInteger(cap) && cap > 0 && params.items.length > cap) return await split(cap);
	let outputs;
	try {
		outputs = await runMemoryEmbeddingRetryLoop({
			profile: "index",
			run: async () => await params.run(params.items),
			waitForRetry: params.waitForRetry
		});
	} catch (err) {
		const message = embeddingRetryMessage(err);
		if (isInvalidEmbeddingResponse(err) || params.items.length <= 1 || !SPLITTABLE_MEMORY_EMBEDDING_BATCH_ERROR_RE.test(message)) throw err;
		const itemLimit = parseMemoryEmbeddingBatchItemLimit(message);
		const splitAt = itemLimit !== void 0 && itemLimit < params.items.length ? itemLimit : Math.ceil(params.items.length / 2);
		params.onSplit?.({
			itemCount: params.items.length,
			splitAt,
			message
		});
		return await split(splitAt);
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
	const embeddingInputFormatVersion = resolveEmbeddingInputFormatVersion(provider.model);
	const seen = /* @__PURE__ */ new Set();
	const identities = [];
	for (const [index, candidate] of candidates.entries()) {
		const cacheKeyData = embeddingInputFormatVersion ? {
			provider: candidate.cacheKeyData,
			embeddingInputFormatVersion
		} : candidate.cacheKeyData;
		const providerKey = hashText(JSON.stringify(cacheKeyData));
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
	const indexedModel = meta.provider === params.provider?.id && params.providerAliases?.some(({ model }) => model === meta.model) ? params.provider?.model ?? meta.model : meta.model;
	const embeddingInputFormatVersion = resolveEmbeddingInputFormatVersion(indexedModel);
	const newerVersion = (meta.provenanceVersion ?? 0) > 1 ? "provenance_version" : (meta.chunkingVersion ?? 0) > 6 ? "chunking_version" : (meta.embeddingInputFormatVersion ?? 0) > embeddingInputFormatVersion ? "embedding_input_format" : void 0;
	if (newerVersion) return openClawIndexMismatch(newerVersion, "the index was written by a newer OpenClaw version; upgrade OpenClaw or reindex explicitly", "newer");
	if ((meta.provenanceVersion ?? 0) < 1) return openClawIndexMismatch("provenance_version", "index provenance classifier changed", "older");
	const olderFormat = (meta.chunkingVersion ?? 0) < 6 ? "chunking_version" : (meta.embeddingInputFormatVersion ?? 0) < embeddingInputFormatVersion ? "embedding_input_format" : void 0;
	if (olderFormat) return {
		...openClawIndexMismatch(olderFormat, olderFormat === "chunking_version" ? "index chunking implementation changed" : "index embedding input format changed", "older"),
		...resolveContentScopeIdentityState(params, meta).status === "valid" ? olderFormat === "chunking_version" ? { chunkingVersionOnly: true } : { lexicalCompatible: true } : {}
	};
	return resolveConfigurationIndexIdentityState(params, meta);
}
//#endregion
//#region extensions/memory-core/src/memory/manager-sync-control.ts
var MemoryBackgroundRebuildInterruptedError = class extends Error {
	constructor() {
		super("Memory background rebuild interrupted by foreground activity");
		this.name = "MemoryBackgroundRebuildInterruptedError";
	}
};
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
//#region extensions/memory-core/src/memory/manager-sync-outcome.ts
/** Outcome of a sync pass that skipped its work on purpose, reported by detached maintenance. */
const MEMORY_SYNC_DEFERRED = Symbol("memory-sync-deferred");
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
			if (incompleteReason === MEMORY_SYNC_DEFERRED) return;
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
//#region extensions/memory-core/src/memory/manager-sync-base.ts
const VECTOR_LOAD_TIMEOUT_MS = 3e4;
const FULL_REINDEX_RETRY_INITIAL_DELAY_MS = 3e4;
const FULL_REINDEX_RETRY_MAX_DELAY_MS = 18e5;
const log$10 = createSubsystemLogger("memory");
const reindexDatabase = new AsyncLocalStorage();
var MemoryManagerSyncBase = class {
	constructor() {
		this.closed = false;
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
		this.fullReindexRetryBackoff = {
			attempts: 0,
			retryAt: 0,
			failedWithEmbeddings: false
		};
		this.sessionsDirty = false;
		this.sessionsFullRetryDirty = false;
		this.sessionsReconcileDirty = false;
		this.sessionsDirtyFiles = /* @__PURE__ */ new Set();
		this.sessionPendingFiles = /* @__PURE__ */ new Set();
		this.sessionPendingTargets = /* @__PURE__ */ new Map();
		this.sessionAgentBusy = false;
		this.sessionBackgroundIndexing = false;
	}
	assertDatabaseMutationCurrent(database) {
		if (this.closed || !database.isOpen || this.database !== database) throw new Error("Memory database owner closed or changed before write admission");
		if (database.readOnly) throw new Error("Memory status managers are read-only");
	}
	get database() {
		const context = reindexDatabase.getStore();
		const shadow = context?.manager === this ? context.database : void 0;
		if (shadow?.closed) throw new Error("Memory reindex database context is closed");
		return shadow ?? this.publishedDatabase;
	}
	get reindexCacheState() {
		const context = reindexDatabase.getStore();
		return context?.manager === this ? context.cacheState : void 0;
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
	async withReindexDatabase(database, run, cacheState) {
		try {
			const result = await reindexDatabase.run({
				manager: this,
				database,
				cacheState
			}, run);
			await database.closeShadow();
			return result;
		} finally {
			try {
				await database.closeShadow();
			} catch {}
		}
	}
	shouldYieldSessionIndexing() {
		const interrupted = this.sessionBackgroundIndexing && (this.sessionAgentBusy || this.closing || this.closed);
		if (interrupted && this.database !== this.publishedDatabase) throw new MemoryBackgroundRebuildInterruptedError();
		return interrupted;
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
			fullReindexRetryBackoff: this.fullReindexRetryBackoff,
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
		if (snapshot.fullReindexRetryBackoff.retryAt >= this.fullReindexRetryBackoff.retryAt) this.fullReindexRetryBackoff = snapshot.fullReindexRetryBackoff;
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
	recordFullReindexFailure(withEmbeddings) {
		this.fullReindexRetryBackoff.attempts += 1;
		this.fullReindexRetryBackoff.failedWithEmbeddings = withEmbeddings;
		const delay = Math.min(FULL_REINDEX_RETRY_INITIAL_DELAY_MS * 2 ** Math.min(this.fullReindexRetryBackoff.attempts - 1, 30), FULL_REINDEX_RETRY_MAX_DELAY_MS);
		this.fullReindexRetryBackoff.retryAt = Date.now() + delay;
	}
	clearFullReindexRetryBackoff() {
		this.fullReindexRetryBackoff.attempts = 0;
		this.fullReindexRetryBackoff.retryAt = 0;
		this.fullReindexRetryBackoff.failedWithEmbeddings = false;
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
		if (items.length === 0) return [];
		if (progress && label) progress.report({
			completed: progress.completed,
			total: progress.total,
			label
		});
		const remaining = await this.indexFiles(items);
		this.advanceSyncProgress(progress, items.length - remaining.length);
		return remaining;
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
			...deferIndex ? { prefixIndexItems: memoryPlan?.indexItems } : {}
		});
		else if (deferIndex) await this.indexQueuedFiles(memoryPlan?.indexItems ?? [], params.progress);
		if (deferIndex) await memoryPlan?.finalize();
		if (params.shouldSyncSessions) this.clearSessionRetryState();
		else this.refreshSessionDirtyFlag();
	}
	hasIndexedChunks() {
		return this.database.facts.hasIndexedChunks;
	}
	hasSemanticChunks() {
		return this.database.facts.hasSemanticChunks;
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
		const hasProviderOverride = params.provider !== void 0;
		const configuredIndexIdentity = !hasProviderOverride && !this.provider && this.settings.provider !== "none" ? this.resolveConfiguredIndexIdentity() : void 0;
		const configuredProvider = this.settings.provider === "none" ? null : {
			id: configuredIndexIdentity?.provider.id ?? this.settings.provider,
			model: (configuredIndexIdentity?.provider.model ?? this.settings.model.trim()) || void 0
		};
		const provider = hasProviderOverride ? params.provider : this.provider ? {
			id: this.provider.id,
			model: this.provider.model
		} : configuredProvider;
		const vectorReady = params.vectorReady ?? this.vector.available === true;
		const initializedProviderIdentities = provider && this.provider && provider.id === this.provider.id && provider.model === this.provider.model ? this.resolveProviderIndexIdentities() : [];
		const configuredProviderIdentities = configuredIndexIdentity?.cacheKeyData ? resolveMemoryIndexProviderIdentities({
			provider: configuredIndexIdentity.provider,
			cacheKeyData: configuredIndexIdentity.cacheKeyData,
			aliases: configuredIndexIdentity.aliases
		}) : [];
		const providerIdentities = initializedProviderIdentities.length > 0 ? initializedProviderIdentities : configuredProviderIdentities;
		const configuredProviderKeyKnown = configuredProviderIdentities.length > 0;
		return resolveMemoryIndexIdentityState({
			meta: params.meta === void 0 ? this.readMeta() : params.meta,
			provider,
			providerKey: configuredProviderKeyKnown ? providerIdentities[0]?.providerKey : params.providerKeyKnown === false ? void 0 : this.providerKey ?? void 0,
			providerAliases: providerIdentities.slice(1),
			providerKeyKnown: configuredProviderKeyKnown ? true : params.providerKeyKnown,
			configuredSources: resolveConfiguredSourcesForMeta(this.sources),
			configuredScopeHash: resolveConfiguredScopeHash({
				workspaceDir: this.workspaceDir,
				extraPaths: this.settings.extraPaths,
				multimodal: this.settings.multimodal
			}),
			chunkTokens: this.settings.chunking.tokens,
			chunkOverlap: this.settings.chunking.overlap,
			vectorReady,
			hasIndexedChunks: params.hasIndexedChunks ?? this.hasIndexedChunks(),
			ftsTokenizer: this.settings.store.fts.tokenizer
		});
	}
	resetVectorState(vectorIndexComplete) {
		const extensionLoaded = vectorIndexComplete && this.vector.available === true;
		this.database.vectorReady = extensionLoaded ? Promise.resolve(true) : null;
		if (!extensionLoaded) {
			this.vector.available = null;
			this.vector.loadError = void 0;
		}
		this.database.ensuredVectorDimensions = void 0;
		this.vector.semanticAvailable = void 0;
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
		if (ready && typeof dimensions === "number" && dimensions > 0 && this.database.ensuredVectorDimensions !== dimensions) {
			const database = this.database;
			await database.updateIndexStructure({
				type: "vector.ensure",
				input: {
					dimensions,
					currentDimensions: this.vector.dims,
					state: {
						vector: this.vector,
						fts: this.fts,
						extensionPath: this.vector.extensionPath
					}
				}
			}, () => this.assertDatabaseMutationCurrent(database));
			database.ensuredVectorDimensions = dimensions;
			this.vector.dims = dimensions;
		}
		return ready;
	}
	async loadVectorExtension() {
		if (this.vector.available === false) return false;
		if (!this.vector.enabled) {
			this.vector.available = false;
			return false;
		}
		try {
			const resolvedPath = this.vector.extensionPath?.trim() ? resolveUserPath(this.vector.extensionPath) : void 0;
			const database = this.database;
			const loaded = await database.prepareVector(resolvedPath, () => {
				if (this.closed || !database.isOpen) throw new Error("Memory database owner closed before vector preparation");
			});
			if (!loaded) throw new Error("Memory vector preparation did not complete");
			this.vector.extensionPath = loaded.extensionPath;
			this.vector.available = true;
			if (["incomplete", "unverified"].includes(database.facts.vectorState.state)) {
				this.markConfiguredSourcesForFullReindex();
				return false;
			}
			if (loaded.retiredLegacy) {
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
	markConfiguredSourcesForFullReindex() {
		this.memoryFullRetryDirty = true;
		if (this.sources.has("memory")) this.dirty = true;
		if (this.sources.has("sessions")) {
			this.sessionsDirty = true;
			this.sessionsFullRetryDirty = true;
		}
	}
	buildSourceFilter(alias, sourcesOverride) {
		const sources = sourcesOverride ?? Array.from(this.sources);
		return buildMemorySourceFilter(alias, sources);
	}
	readMeta() {
		return this.database.facts.meta;
	}
	writeMeta(meta) {
		return this.database.writeMetadata(meta);
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
const SESSION_QUIET_PERIOD_MS = 3e4;
const SESSION_MAX_DEFERRAL_MS = 3e5;
const SESSION_RETRY_DELAYS_MS = [
	6e4,
	3e5,
	9e5
];
const log$8 = createSubsystemLogger("memory");
var MemoryManagerSessionSyncOps = class extends MemoryManagerWatchOps {
	constructor(..._args) {
		super(..._args);
		this.sessionLastActivity = 0;
		this.sessionFullSyncPending = false;
		this.sessionRetryAttempt = 0;
		this.sessionRetryAt = 0;
		this.sessionIndexRetryRequested = false;
	}
	async inspectDiagnosticSourceState() {
		if (this.sources.has("memory")) try {
			const database = this.database;
			const inspection = await inspectMemorySourceState({
				files: this.memoryFiles,
				readIndexedRows: () => database.readSourceState({ source: "memory" }),
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
	async listSessionCorpusEntries(targets) {
		let entries = await listSessionTranscriptCorpusEntriesForAgent(this.agentId, {
			config: this.cfg,
			includeContentRevision: false,
			readOnly: this.database.readOnly
		});
		entries = entries.filter((entry) => {
			const archivedSessionKey = entry.artifactKind === "archive-artifact" ? entry.sessionKey : void 0;
			return isMemorySessionIndexable(entry, archivedSessionKey);
		});
		if (targets) {
			const files = /* @__PURE__ */ new Set([...this.normalizeTargetArchiveFiles(targets.archiveFiles, entries) ?? [], ...this.resolveArchiveFilesForSyncTargets(targets.sessions, entries)]);
			const sessionIds = new Set(entries.filter((entry) => files.has(entry.sessionFile) || entry.transcriptSource !== "sqlite" && files.has(path.resolve(entry.sessionFile))).map((entry) => entry.sessionId));
			entries = entries.filter((entry) => sessionIds.has(entry.sessionId));
		}
		const forgottenSessions = await findForgottenMemorySessionIds({
			agentId: this.agentId,
			sessionIds: entries.map((entry) => entry.sessionId)
		});
		return entries.filter((entry) => !forgottenSessions.has(entry.sessionId));
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
		const unsubscribeActivity = observeAgentRunActivity(this.agentId, (busy) => {
			this.runInBackgroundContext(() => {
				this.sessionAgentBusy = busy;
				this.noteSessionIndexActivity();
				this.scheduleSessionIndexPass();
			});
		});
		const unsubscribeTranscripts = this.subscribeSessionTranscriptUpdates((update) => {
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
		this.sessionUnsubscribe = () => {
			unsubscribeActivity();
			unsubscribeTranscripts();
		};
	}
	subscribeSessionTranscriptUpdates(listener) {
		return onInternalSessionTranscriptUpdate(listener);
	}
	async scheduleCorpusSessionFileDirty(sessionFile) {
		const resolvedSessionFile = path.resolve(sessionFile);
		if ((await this.listSessionCorpusEntries({ archiveFiles: [resolvedSessionFile] })).length > 0) this.scheduleSessionDirty(resolvedSessionFile);
	}
	async ensureSessionStartupCatchup() {
		if (!this.sources.has("sessions") || this.closing || this.closed) return;
		await this.withManagerOperation(() => this.runSessionStartupCatchup());
	}
	async markSessionStartupCatchupDirtyFiles(inspectSources = false, stopped = () => this.closed) {
		if (!this.sources.has("sessions") || stopped()) return [];
		const corpusEntries = await this.listSessionCorpusEntries();
		if (stopped()) return [];
		const existingRows = await this.database.readSourceState({ source: "sessions" });
		const indexedPaths = new Set(existingRows.map((row) => row.path));
		const sqliteCorpusEntries = corpusEntries.filter((entry) => entry.transcriptSource === "sqlite");
		const transcriptStats = await readMemoryTranscriptStatsInWorker(sqliteCorpusEntries.map((entry) => ({
			agentId: entry.agentId,
			sessionId: entry.sessionId,
			...entry.sessionKey ? { sessionKey: entry.sessionKey } : {},
			...entry.storePath ? { storePath: entry.storePath } : {}
		})));
		if (stopped()) return [];
		const statsByEntry = new Map(sqliteCorpusEntries.map((entry, index) => [entry, transcriptStats[index]]));
		const fileStates = (await runWithConcurrency(corpusEntries.map((corpusEntry) => async () => {
			if (stopped()) return null;
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
				const stat = await fs.stat(file);
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
		if (stopped()) return dirtyFiles;
		if (hasStaleIndexedPaths) {
			this.sessionsDirty = true;
			this.sessionsReconcileDirty = true;
		}
		for (const file of dirtyFiles) this.sessionsDirtyFiles.add(file);
		if (dirtyFiles.length > 0) this.sessionsDirty = true;
		return dirtyFiles;
	}
	async runSessionStartupCatchup() {
		const dirtyFiles = await this.markSessionStartupCatchupDirtyFiles(false, () => this.closing);
		if (!this.sessionsDirty || this.closing || this.closed) return dirtyFiles;
		this.sessionFullSyncPending = true;
		this.deferSessionIndexFiles(dirtyFiles);
		return dirtyFiles;
	}
	scheduleSessionDirty(target) {
		if (this.closing || this.closed) return;
		if (typeof target === "string") this.sessionPendingFiles.add(target);
		else this.sessionPendingTargets.set(memorySessionSyncTargetKey(target), target);
		this.sessionPendingSince ??= Date.now();
		this.noteSessionIndexActivity();
		this.scheduleSessionIndexPass();
	}
	noteSessionIndexActivity() {
		this.sessionLastActivity = Date.now();
		if (this.sessionRetryAt === Infinity) {
			this.sessionRetryAttempt = 0;
			this.sessionRetryAt = 0;
		}
	}
	requestSessionIndexRetry(providerChanged = false) {
		if (this.sessionBackgroundIndexing) {
			this.sessionIndexRetryRequested = true;
			if (providerChanged) {
				this.sessionFullSyncPending = true;
				this.sessionsFullRetryDirty = true;
			}
		}
	}
	deferSessionIndexFiles(files, corpusEntries = []) {
		const entriesByFile = new Map(corpusEntries.map((entry) => [entry.sessionFile, entry]));
		for (const file of files) {
			const entry = entriesByFile.get(file);
			if (entry?.transcriptSource === "sqlite") {
				const target = {
					agentId: entry.agentId,
					sessionId: entry.sessionId,
					...entry.sessionKey ? { sessionKey: entry.sessionKey } : {}
				};
				this.sessionPendingTargets.set(memorySessionSyncTargetKey(target), target);
			} else this.sessionPendingFiles.add(file);
		}
		this.sessionPendingSince ??= Date.now();
		this.sessionLastActivity = Date.now();
		this.scheduleSessionIndexPass();
	}
	scheduleSessionIndexPass() {
		if (this.sessionWatchTimer) {
			clearTimeout(this.sessionWatchTimer);
			this.sessionWatchTimer = null;
		}
		if (this.sessionPendingSince === void 0 || this.sessionRetryAt === Infinity || this.sessionAgentBusy || this.sessionBackgroundIndexing || this.closing || this.closed) return;
		const deadline = Math.max(this.sessionRetryAt, Math.min(this.sessionLastActivity + SESSION_QUIET_PERIOD_MS, this.sessionPendingSince + SESSION_MAX_DEFERRAL_MS));
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
		}, Math.max(0, deadline - Date.now()));
		this.sessionWatchTimer.unref();
	}
	async processSessionUpdateBatch() {
		if (this.sessionAgentBusy) {
			this.scheduleSessionIndexPass();
			return;
		}
		if (!this.sessionFullSyncPending && this.sessionPendingFiles.size === 0 && this.sessionPendingTargets.size === 0) return;
		const fullSync = this.sessionFullSyncPending;
		this.sessionFullSyncPending = false;
		const pending = Array.from(this.sessionPendingFiles);
		const pendingTargets = Array.from(this.sessionPendingTargets.values());
		const pendingSince = this.sessionPendingSince;
		this.sessionPendingFiles.clear();
		this.sessionPendingTargets.clear();
		this.sessionPendingSince = void 0;
		for (const sessionFile of pending) this.sessionsDirtyFiles.add(sessionFile);
		if (fullSync || pending.length > 0 || pendingTargets.length > 0) {
			this.sessionsDirty = true;
			this.sessionBackgroundIndexing = true;
			this.sessionIndexRetryRequested = false;
			let completed = false;
			let interrupted = false;
			try {
				await this.sync(fullSync ? { reason: "session-startup-catchup" } : {
					reason: "session-delta",
					sessions: pendingTargets,
					archiveFiles: pending
				});
				completed = !this.sessionIndexRetryRequested;
			} catch (error) {
				if (!(error instanceof MemoryBackgroundRebuildInterruptedError)) throw error;
				interrupted = true;
				this.sessionFullSyncPending = true;
			} finally {
				if (completed) {
					this.sessionRetryAttempt = 0;
					this.sessionRetryAt = 0;
				} else {
					this.sessionFullSyncPending ||= fullSync;
					this.sessionPendingFiles = /* @__PURE__ */ new Set([...pending, ...this.sessionPendingFiles]);
					this.sessionPendingTargets = new Map([...pendingTargets.map((target) => [memorySessionSyncTargetKey(target), target]), ...this.sessionPendingTargets]);
					this.sessionPendingSince = pendingSince ?? this.sessionPendingSince ?? Date.now();
					if (!interrupted) {
						const delay = SESSION_RETRY_DELAYS_MS[this.sessionRetryAttempt++];
						this.sessionRetryAt = delay === void 0 ? Infinity : Date.now() + delay;
						if (this.sessionRetryAttempt === SESSION_RETRY_DELAYS_MS.length) this.sessionRetryAt = Math.max(this.sessionRetryAt, this.fullReindexRetryBackoff.retryAt);
					}
				}
				this.sessionBackgroundIndexing = false;
				this.scheduleSessionIndexPass();
			}
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
	resolveArchiveFilesForSyncTargets(sessions, corpusEntries) {
		const files = /* @__PURE__ */ new Set();
		const targets = Array.from(sessions ?? []);
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
		const corpusEntries = await this.listSessionCorpusEntries(params);
		const files = /* @__PURE__ */ new Set([...this.normalizeTargetArchiveFiles(params.archiveFiles, corpusEntries) ?? [], ...this.resolveArchiveFilesForSyncTargets(params.sessions, corpusEntries)]);
		return files.size > 0 ? {
			corpusEntries,
			targetArchiveFiles: files
		} : null;
	}
	shouldSyncSessions(params, needsFullReindex = false) {
		if (!this.sources.has("sessions")) return false;
		if (params?.reason === "search" && !params.force) return false;
		if (hasTargetedSessionSyncParams(params) || params?.force || needsFullReindex || this.sessionsFullRetryDirty) return true;
		return params?.reason !== "session-start" && params?.reason !== "watch" && this.sessionsDirty;
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
				if (this.closed || database.closed || database.readOnly || !database.isOpen || this.database !== database) throw new Error("Memory source owner changed before deletion");
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
		const existingRows = await this.database.readSourceState({ source: "memory" });
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
		const indexItems = [];
		for (const entry of fileEntries) {
			if (!params.needsFullReindex && existingHashes.get(entry.path) === entry.hash) {
				this.advanceSyncProgress(params.progress);
				continue;
			}
			indexItems.push({
				entry,
				source: "memory"
			});
		}
		if (this.batch.enabled) {
			if (params.deferIndex) return {
				indexItems,
				finalize: deleteStaleRows
			};
			await this.indexQueuedFiles(indexItems, params.progress);
		} else {
			const tasks = indexItems.map(({ entry }) => async () => {
				await this.indexFile(entry, "memory");
				this.advanceSyncProgress(params.progress);
			});
			await runWithConcurrency(tasks, this.getIndexConcurrency());
		}
		await deleteStaleRows();
	}
	async syncArchiveFiles(params) {
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
			existingRows: targetArchiveFiles ? null : await this.database.readSourceState({ source: "sessions" }),
			sessionPathForFile: (file) => this.sessionPathForCorpusEntry(corpusEntryForPath(file))
		});
		const sourceHashes = existingHashes ?? new Map((await this.database.readSourceState({
			source: "sessions",
			paths: files.map((file) => this.sessionPathForCorpusEntry(corpusEntryForPath(file)))
		})).map((row) => [row.path, row.hash]));
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
			const existingSessionHashes = new Map((await this.database.readSourceState({
				source: "sessions",
				paths: staleLivePaths
			})).map((row) => [row.path, row.hash]));
			for (const staleLivePath of staleLivePaths) {
				if (!existingSessionHashes.has(staleLivePath)) continue;
				await this.deleteIndexedFile(staleLivePath, "sessions", existingSessionHashes.get(staleLivePath));
			}
		};
		const resolveSessionIndexEntry = async (absPath, entry) => {
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
				if (this.closed || !database.isOpen || this.database !== database) throw new Error("Memory source owner changed during hash lookup");
			};
			const existingHash = sourceHashes.get(entry.path);
			const hash = entry.revisionMs === void 0 ? entry.hash : `sqlite:${entry.revisionMs}:${entry.hash}`;
			const existingContentHash = existingHash?.startsWith("sqlite:") ? existingHash.slice(existingHash.lastIndexOf(":") + 1) : existingHash;
			if (!params.needsFullReindex && existingHash !== void 0 && existingContentHash === entry.hash) {
				if ((this.sessionsDirtyFiles.has(absPath) || existingHash !== hash) && !await database.refreshSourceState({
					path: entry.path,
					hash,
					mtime: entry.mtimeMs,
					size: entry.size,
					expectedHash: existingHash
				}, assertCurrent)) throw new MemoryIndexRevisionConflictError(`Memory session source ${entry.path} changed during metadata refresh; retry incremental sync.`);
				this.advanceSyncProgress(params.progress);
				return null;
			}
			return Object.assign(entry, {
				hash,
				sessionId: corpusEntryForPath(absPath).sessionId
			});
		};
		const syncFiles = async (batch) => {
			const selected = batch.filter((file) => {
				if (indexAll || this.sessionsDirtyFiles.has(file)) return true;
				this.advanceSyncProgress(params.progress);
				return false;
			});
			const entries = await buildSessionEntries(selected.map((absPath) => ({
				absPath,
				options: this.buildSessionEntryOptions(corpusEntryForPath(absPath))
			})));
			return await runWithConcurrency(selected.map((absPath, index) => async () => {
				try {
					return await resolveSessionIndexEntry(absPath, entries[index] ?? null);
				} finally {
					await yieldAfterSessionFile();
				}
			}), this.getIndexConcurrency());
		};
		const deferItems = (items) => {
			if (items.some((item) => item.source === "memory")) this.dirty = true;
			this.deferSessionIndexFiles(items.filter((item) => item.source === "sessions").map((item) => item.entry.absPath), corpusEntries);
		};
		{
			const pendingIndexItems = [...params.prefixIndexItems ?? []];
			const flushPendingIndexItems = async () => {
				if (pendingIndexItems.length === 0) return false;
				const current = pendingIndexItems.splice(0);
				const sources = new Set(current.map((item) => item.source));
				const remaining = await this.indexQueuedFiles(current, params.progress, sources.size > 1 ? "Indexing memory sources (batch)..." : void 0);
				if (remaining.length > 0) {
					deferItems(remaining);
					return true;
				}
				return false;
			};
			const groupSize = this.sessionBackgroundIndexing ? 8 : SOURCE_WIDE_SESSION_INDEX_FLUSH_FILES;
			for (let start = 0; start < files.length; start += groupSize) {
				if (this.shouldYieldSessionIndexing()) {
					deferItems(pendingIndexItems);
					this.deferSessionIndexFiles(files.slice(start), corpusEntries);
					return;
				}
				const dirtyEntries = (await syncFiles(files.slice(start, start + groupSize))).filter((entry) => entry !== null);
				pendingIndexItems.push(...dirtyEntries.map((entry) => ({
					entry,
					source: "sessions"
				})));
				if (pendingIndexItems.length >= groupSize) {
					if (await flushPendingIndexItems()) {
						this.deferSessionIndexFiles(files.slice(start + groupSize), corpusEntries);
						return;
					}
				}
			}
			if (await flushPendingIndexItems()) return;
		}
		await deleteTargetArchiveStaleLiveRows();
		await deleteStaleRows();
	}
};
//#endregion
//#region extensions/memory-core/src/memory/manager-sync-ops.ts
const log$6 = createSubsystemLogger("memory");
var MemoryManagerSyncOps = class extends MemoryManagerSourceSyncOps {
	constructor(notice) {
		super();
		this.fallbackProviderInitPromise = null;
		this.providerInitialized = false;
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
	applyProviderResult(result) {
		this.provider = result.provider;
		this.fallbackFrom = result.fallbackFrom;
		this.fallbackReason = result.fallbackReason;
		this.providerUnavailableReason = result.providerUnavailableReason;
		this.providerLifecycle = resolveMemoryProviderLifecycle(result);
		this.providerRuntime = result.runtime;
		this.providerInitialized = true;
		this.providerKey = this.computeProviderKey();
		this.batch = this.resolveBatchConfig();
	}
	createConfiguredEmbeddingProvider(request = resolveMemoryPrimaryProviderRequest({ settings: this.settings })) {
		return createEmbeddingProvider({
			createProvider: this.createProvider,
			config: this.cfg,
			agentDir: resolveAgentDir(this.cfg, this.agentId),
			...this.acquireLocalService ? { acquireLocalService: this.acquireLocalService } : {},
			...request
		});
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
			if (this.database.ensuredVectorDimensions !== meta?.vectorDims) this.database.ensuredVectorDimensions = void 0;
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
			const retryFullReindexRequested = this.memoryFullRetryDirty || this.sessionsFullRetryDirty;
			const fullRetryRemainsAfterTargetSync = hasTargetArchiveFiles && retryFullReindexRequested;
			const deferAutomaticFullReindex = retryFullReindexRequested && (!params?.force || params.reason === "embedding-bootstrap-recovery") && !(this.fullReindexRetryBackoff.failedWithEmbeddings && !syncProvider) && Date.now() < this.fullReindexRetryBackoff.retryAt && !needsExplicitIdentityReindex;
			if (deferAutomaticFullReindex && !hasTargetArchiveFiles) {
				this.requestSessionIndexRetry();
				return MEMORY_SYNC_DEFERRED;
			}
			needsFullReindex = params?.force && !hasTargetArchiveFiles || needsExplicitIdentityReindex || !deferAutomaticFullReindex && (needsInitialIndex || needsMissingIdentityReindex || needsRuntimeVersionReindex) || !hasTargetArchiveFiles && !deferAutomaticFullReindex && (this.memoryFullRetryDirty && canRunRetryFullReindex || this.sessionsFullRetryDirty && indexIdentity.status !== "valid" && canRunRetryFullReindex);
			const isSearchBootstrap = params?.reason === "search-bootstrap";
			const needsFullSessionReindex = needsFullReindex || this.sessionsFullRetryDirty && !hasTargetArchiveFiles && !deferAutomaticFullReindex || isSearchBootstrap;
			if (indexIdentity.status !== "valid" && !needsFullReindex) {
				this.dirty = true;
				if (this.markTargetArchiveFilesDirty(targetArchiveFiles)) this.sessionsDirty = true;
				return fullRetryRemainsAfterTargetSync ? MEMORY_SYNC_DEFERRED : void 0;
			}
			if (!needsFullSessionReindex) {
				if (this.sources.has("sessions") && targetArchiveFiles) this.sessionsDirty = this.markTargetArchiveFilesDirty(targetArchiveFiles);
				if (await this.syncTargetedSessions(targetArchiveFiles, targetSessionSync?.corpusEntries, progress)) return fullRetryRemainsAfterTargetSync ? MEMORY_SYNC_DEFERRED : void 0;
			}
			let recoveringSessionFullRetry = false;
			try {
				if (needsFullReindex) {
					if (params?.reason !== "cli") this.recordAutomaticRebuild();
					await this.runInPlaceReindex(progress);
					return;
				}
				const shouldSyncMemory = this.sources.has("memory") && (this.dirty || isSearchBootstrap);
				const shouldSyncSessions = this.shouldSyncSessions(params, needsFullSessionReindex);
				recoveringSessionFullRetry = this.sessionsFullRetryDirty && shouldSyncSessions;
				await this.executeSourceSync({
					shouldSyncMemory,
					shouldSyncSessions,
					needsFullReindex,
					needsFullSessionReindex,
					targetArchiveFiles: targetArchiveFiles ? Array.from(targetArchiveFiles) : void 0,
					progress: progress ?? void 0
				});
				if (recoveringSessionFullRetry && !this.memoryFullRetryDirty) this.clearFullReindexRetryBackoff();
			} catch (err) {
				this.dirty ||= this.sources.has("memory");
				if (recoveringSessionFullRetry && !this.memoryFullRetryDirty) {
					this.markFailedFullReindexRetry({
						memory: false,
						sessions: true
					});
					this.recordFullReindexFailure(syncProvider !== null);
				}
				const reason = formatErrorMessage(err);
				const shouldFallback = isMemoryEmbeddingOperationError(err);
				if (shouldFallback) this.endSyncProviderGeneration();
				if (shouldFallback && await this.activateFallbackProvider(reason)) {
					if ((needsFullReindex || isSearchBootstrap) && !hasTargetArchiveFiles) {
						needsFullReindex = true;
						this.beginSyncProviderGeneration();
						await this.runInPlaceReindex(progress);
					} else this.requestSessionIndexRetry(true);
					return;
				}
				if (!this.provider && this.fts.enabled && isMemoryEmbeddingOperationError(err)) {
					this.requestSessionIndexRetry();
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
	markTargetArchiveFilesDirty(targetArchiveFiles) {
		for (const file of targetArchiveFiles ?? []) this.sessionsDirtyFiles.add(file);
		return this.sessionsDirtyFiles.size > 0;
	}
	async syncTargetedSessions(targetArchiveFiles, corpusEntries, progress) {
		if (!this.sources.has("sessions") || !targetArchiveFiles) return false;
		const { sessionsDirtyFiles, sessionsFullRetryDirty, sessionsReconcileDirty } = this;
		let failure;
		try {
			await this.syncArchiveFiles({
				needsFullReindex: false,
				targetArchiveFiles: Array.from(targetArchiveFiles),
				progress,
				corpusEntries
			});
			for (const file of targetArchiveFiles) sessionsDirtyFiles.delete(file);
		} catch (error) {
			const reason = formatErrorMessage(error);
			const shouldFallback = isMemoryEmbeddingOperationError(error);
			if (shouldFallback) this.endSyncProviderGeneration();
			if (!shouldFallback || !await this.activateFallbackProvider(reason)) throw error;
			for (const file of targetArchiveFiles) sessionsDirtyFiles.add(file);
			failure = { error };
		}
		this.sessionsDirty = sessionsFullRetryDirty || sessionsReconcileDirty || sessionsDirtyFiles.size > 0;
		if (failure) {
			this.requestSessionIndexRetry(true);
			this.syncOutcomes.recordActiveFailure(failure.error);
		}
		return true;
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
			fallbackResult = await this.createConfiguredEmbeddingProvider(fallbackRequest);
		} catch (err) {
			this.resetProviderInitializationForRetry();
			throw err;
		}
		if (!fallbackResult.provider) {
			this.resetProviderInitializationForRetry();
			return false;
		}
		this.applyProviderResult({
			...fallbackResult,
			requestedProvider: currentProviderId,
			fallbackFrom: currentProviderId,
			fallbackReason: reason,
			providerUnavailableReason: void 0
		});
		log$6.warn(`memory embeddings: switched to fallback provider (${fallbackRequest.provider})`, { reason });
		return true;
	}
	async runInPlaceReindex(progress) {
		const dbPath = resolveUserPath(this.settings.store.databasePath);
		const tempDbPath = `${dbPath}.memory-reindex-${randomUUID()}`;
		const originalDatabase = this.database;
		const generation = this.syncProviderGeneration;
		const cacheState = { writesPendingPrune: false };
		const assertGeneration = () => {
			if (this.syncProviderGeneration !== generation || this.publishedDatabase !== originalDatabase) throw new Error("Memory cache generation changed before terminal prune");
		};
		const originalRetryState = this.snapshotReindexRetryState();
		const withEmbeddings = this.syncProviderGeneration?.kind === "semantic";
		const shouldRetryMemoryOnFailure = this.sources.has("memory");
		const shouldRetrySessionsOnFailure = this.shouldSyncSessions(void 0, true);
		let shadowCleanup;
		try {
			await cleanupAgedMemoryReindexTempFiles(dbPath);
			const originalRevision = this.database.facts.revision;
			const shadow = await MemoryIndexDatabase.openShadow(tempDbPath, this.settings.store.vector.enabled);
			shadowCleanup = shadow;
			shadow.vector.enabled = this.vector.enabled;
			shadow.vector.extensionPath = this.vector.extensionPath;
			shadow.fts.enabled = this.fts.enabled;
			const rebuilt = await this.withReindexDatabase(shadow, async () => {
				try {
					await shadow.admitSchema({
						cacheEnabled: this.cache.enabled,
						ftsEnabled: shadow.fts.enabled,
						ftsTokenizer: this.settings.store.fts.tokenizer
					});
					await this.executeSourceSync({
						shouldSyncMemory: shouldRetryMemoryOnFailure,
						shouldSyncSessions: shouldRetrySessionsOnFailure,
						needsFullReindex: true,
						progress
					});
					if (!shouldRetryMemoryOnFailure) this.clearMemoryRetryState();
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
						chunkingVersion: 6,
						embeddingInputFormatVersion: resolveEmbeddingInputFormatVersion(syncProvider?.model ?? ""),
						ftsTokenizer: this.settings.store.fts.tokenizer,
						provenanceVersion: 1
					};
					if (this.vector.available && this.vector.dims) nextMeta.vectorDims = this.vector.dims;
					await this.writeMeta(nextMeta);
					return {
						nextMeta,
						vectorIndexComplete,
						hasVectors: shadow.facts.hasVectorTable
					};
				} finally {
					shadow.closed = true;
				}
			}, cacheState);
			await withMemoryWorkspaceLock(this.workspaceDir, async () => {
				await withMemoryIndexGeneration(dbPath, "write", async () => {
					await this.publishedDatabase.publishShadow({
						sourcePath: tempDbPath,
						sourceIdentity: readMemoryShadowIdentity(tempDbPath),
						metaKey: MEMORY_INDEX_META_KEY,
						expectedRevision: originalRevision,
						sourceHasVectors: rebuilt.hasVectors,
						vectorIndexComplete: rebuilt.vectorIndexComplete,
						extensionPath: shadow.vector.extensionPath
					}, () => {
						if (this.closed || this.publishedDatabase.closed || this.publishedDatabase.readOnly || this.publishedDatabase !== originalDatabase || !originalDatabase.isOpen) throw new Error("Memory publication owner changed before reindex publication");
						shadow.assertShadowPath();
					});
				});
			});
			this.resetVectorState(rebuilt.vectorIndexComplete);
			this.fts.available = shadow.fts.available;
			this.fts.loadError = shadow.fts.loadError;
			this.vector.dims = rebuilt.nextMeta.vectorDims;
			if (cacheState.writesPendingPrune) {
				await this.withPublishedDatabase(() => this.pruneEmbeddingCacheIfNeeded(true, assertGeneration));
				cacheState.writesPendingPrune = false;
			}
			this.clearFullReindexRetryBackoff();
		} catch (err) {
			this.adoptReindexRetryState(originalRetryState);
			this.markFailedFullReindexRetry({
				memory: shouldRetryMemoryOnFailure,
				sessions: shouldRetrySessionsOnFailure
			});
			if (!(err instanceof MemoryBackgroundRebuildInterruptedError)) this.recordFullReindexFailure(withEmbeddings);
			throw err;
		} finally {
			try {
				if (cacheState.writesPendingPrune) try {
					await this.withPublishedDatabase(() => this.pruneEmbeddingCacheIfNeeded(true, assertGeneration));
				} catch (err) {
					log$6.warn(`failed to prune aborted memory rebuild cache: ${formatErrorMessage(err)}`);
				}
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
	}
};
//#endregion
//#region extensions/memory-core/src/memory/manager-embedding-cache-ops.ts
var MemoryManagerEmbeddingCacheOps = class extends MemoryManagerSyncOps {
	async pruneEmbeddingCacheIfNeeded(recount = false, assertGeneration) {
		const max = this.cache.maxEntries;
		if (!this.cache.enabled || !max || max <= 0) return;
		const database = this.database;
		const assertCurrent = () => {
			assertGeneration?.();
			if (this.closed || !database.isOpen || this.database !== database) throw new Error("Memory database owner closed or changed before write admission");
		};
		while (await database.pruneEmbeddingCache(max, assertCurrent, recount)) await setImmediate$1();
	}
	async collectCachedEmbeddings(candidates, generation) {
		const hashes = candidates.map((candidate) => candidate.chunk.hash);
		const cached = this.cache.enabled ? await generation.database.read({
			type: "cache.read",
			input: {
				providerIdentities: generation.identities,
				hashes
			}
		}, () => {
			if (!generation.database.isOpen) throw new Error("Memory database owner is closed");
		}) : /* @__PURE__ */ new Map();
		for (const [hash, embedding] of cached) if (!isValidMemoryEmbedding(embedding, generation.embeddingDimensions)) cached.delete(hash);
		else generation.embeddingDimensions ??= embedding.length;
		const result = collectMemoryCachedEmbeddings({
			hashes,
			cached
		});
		return {
			...result,
			missingCandidates: result.missing.map((index) => expectDefined(candidates[index], "missing memory embedding candidate"))
		};
	}
	async embedChunksInBatches(candidates, generation, maxTokens, prepared) {
		const { embeddings, missing, missingCandidates } = prepared ?? await this.collectCachedEmbeddings(candidates, generation);
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
				if (item !== void 0) embeddings[item] = embedding;
			}
			cursor += batchChunks.length;
		}
		return embeddings;
	}
	async withGeneratedEmbeddingCacheWrite(generation, mutation, reindex) {
		await this.withPublishedDatabase(async () => {
			if (!this.canWriteEmbeddingCache(generation) || this.database !== generation.database) return;
			const assertCurrent = () => {
				if (this.closed || generation.database.closed || !generation.database.isOpen || this.database !== generation.database) throw new Error("Memory database owner closed or changed before write admission");
			};
			await generation.database.mutateEmbeddingCache(mutation, assertCurrent, () => {
				assertCurrent();
				if (!this.canWriteEmbeddingCache(generation)) return false;
				if (reindex) reindex.writesPendingPrune = true;
				return true;
			});
		});
	}
	canWriteEmbeddingCache(generation) {
		return this.syncProviderGeneration === generation && !generation.cacheWritesInvalidated && !generation.database.closed;
	}
	async persistGeneratedEmbeddings(candidates, embeddings, generation) {
		if (candidates.length === 0 || !this.canWriteEmbeddingCache(generation)) return;
		const dimensions = generation.embeddingDimensions ?? embeddings[0]?.length;
		if (embeddings.length !== candidates.length || !embeddings.every((embedding) => isValidMemoryEmbedding(embedding, dimensions))) {
			if (this.cache.enabled && generation.embeddingDimensions !== void 0 && embeddings.some((embedding) => isValidMemoryEmbedding(embedding) && embedding.length !== generation.embeddingDimensions)) await withMemoryWorkspaceLock(this.workspaceDir, async () => {
				try {
					await this.withGeneratedEmbeddingCacheWrite(generation, {
						kind: "clear",
						identities: generation.identities
					});
				} finally {
					generation.cacheWritesInvalidated = true;
				}
			});
			const position = embeddings.findIndex((embedding) => !isValidMemoryEmbedding(embedding, dimensions));
			const embedding = embeddings[position];
			let condition = `expected ${candidates.length} vectors, got ${embeddings.length}`;
			if (embeddings.length === candidates.length) {
				if (!Array.isArray(embedding)) condition = `missing embedding array at position ${position}`;
				else if (embedding.length === 0) condition = `empty embedding at position ${position}`;
				else if (embedding.length !== dimensions) condition = `expected ${dimensions} dimensions, got ${embedding.length} at position ${position}`;
				else condition = `non-finite or non-numeric coordinate at position ${position}`;
			}
			throw new Error(`${generation.provider.id} embeddings failed (model: ${generation.provider.model}, batch size: ${candidates.length}): ${condition}`);
		}
		generation.embeddingDimensions = dimensions;
		if (!this.cache.enabled) return;
		await withMemoryWorkspaceLock(this.workspaceDir, async () => {
			if (!this.canWriteEmbeddingCache(generation)) return;
			const accepted = [];
			for (const [index, candidate] of candidates.entries()) {
				if (candidate.source === "sessions" && !candidate.entry.sessionId) continue;
				accepted.push({
					hash: candidate.chunk.hash,
					embedding: embeddings[index] ?? [],
					...candidate.source === "sessions" ? { sessionId: candidate.entry.sessionId } : {}
				});
			}
			if (accepted.length === 0) return;
			const reindex = this.reindexCacheState;
			await this.withGeneratedEmbeddingCacheWrite(generation, {
				kind: "upsert",
				header: {
					agentId: this.agentId,
					provider: {
						id: generation.provider.id,
						model: generation.provider.model
					},
					providerKey: generation.providerKey,
					maxEntries: this.cache.maxEntries === void 0 ? void 0 : Math.min(Number.MAX_SAFE_INTEGER, this.cache.maxEntries * (reindex ? 2 : 1))
				},
				entries: accepted
			}, reindex);
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
	const content = remoteRead?.content ?? suppliedContent ?? await retryTransientMemoryRead(() => fs.readFile(absolutePath, "utf-8"), `read memory markdown for indexing ${absolutePath}`).catch((err) => {
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
//#region extensions/memory-core/src/memory/manager-session-delta.ts
/** A shadow's empty tombstone table cannot authorize publication into the live index. */
async function assertMemorySessionNotForgotten(database, session, assertCurrent) {
	const predicate = await database.read({
		type: "session.current",
		input: session
	}, assertCurrent);
	assertCurrent();
	if (predicate === "forgotten") throw new Error("A session was forgotten while memory indexing was running; retry the memory index.");
}
async function retainIndexedSessionChunks(prepared, database, generation, assertCurrent) {
	const { entry, source, chunks } = prepared;
	if (source !== "sessions" || entry.kind === "multimodal" || chunks.length === 0 || database.isShadow) return prepared;
	const indexed = await database.read({
		type: "source.chunks",
		input: {
			source,
			path: entry.path
		}
	}, assertCurrent);
	const semantic = generation?.kind === "semantic";
	const keep = new Map(indexed.filter((row) => row.embedded || !semantic).map((row) => [row.id, row]));
	if (keep.size === 0) return prepared;
	const model = generation?.provider?.model ?? "fts-only";
	const written = [];
	const retained = [];
	const planned = /* @__PURE__ */ new Set();
	for (const chunk of chunks) {
		const id = memoryChunkRowId(source, entry.path, chunk, model);
		if (!planned.has(id)) {
			planned.add(id);
			const current = keep.get(id);
			if (!current) written.push(chunk);
			else if (current.importance !== chunk.importance || current.triggers !== chunk.triggers || current.projectKey !== chunk.projectKey || current.originClass !== (chunk.provenance?.originClass ?? "untrusted") || current.sessionKind !== (chunk.provenance?.sessionKind ?? "unknown") || chunk.provenance && current.observedAt !== chunk.provenance.observedAt || current.supersedesKey !== (chunk.provenance?.supersedesKey ?? null)) retained.push(chunk);
		}
	}
	return {
		...prepared,
		chunks: written,
		retained,
		removedIds: indexed.filter((row) => !planned.has(row.id)).map((row) => row.id)
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
const SOURCE_PUBLICATION_MAX_FILES = 8;
const SOURCE_PUBLICATION_MAX_ROWS = 128;
const SOURCE_WIDE_BATCH_MAX_FILES = 2048;
const SOURCE_WIDE_BATCH_MAX_REQUESTS = 5e4;
const log$5 = createSubsystemLogger("memory");
var MemoryManagerEmbeddingOps = class extends MemoryManagerEmbeddingCacheOps {
	constructor(..._args) {
		super(..._args);
		this.batchFailureLimit = 2;
		this.batchFailure = { count: 0 };
		this.activeProviderUses = /* @__PURE__ */ new Map();
		this.syncProviderGenerationRelease = null;
		this.syncProviderGenerationOwners = 0;
	}
	acquireProviderUse(provider) {
		const completion = createDeferredCore();
		const uses = this.activeProviderUses.get(provider) ?? /* @__PURE__ */ new Set();
		uses.add(completion.promise);
		this.activeProviderUses.set(provider, uses);
		return () => {
			if (!uses.delete(completion.promise)) return;
			completion.resolve();
			if (uses.size === 0) this.activeProviderUses.delete(provider);
		};
	}
	async awaitProviderIdle(provider) {
		const uses = this.activeProviderUses.get(provider);
		if (uses) await Promise.all(uses);
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
		const generation = {
			database: this.database,
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
	async embedChunksWithBatch(candidates, source, generation, debugContext = {}, cached) {
		const provider = generation.provider;
		const batchEmbed = generation.runtime?.batchEmbed;
		if (!this.batch.enabled || !batchEmbed) return this.embedChunksInBatches(candidates, generation, EMBEDDING_BATCH_MAX_TOKENS, cached);
		const { embeddings, missing, missingCandidates } = cached ?? await this.collectCachedEmbeddings(candidates, generation);
		if (missing.length === 0) return embeddings;
		const missingChunks = missingCandidates.map((candidate) => candidate.chunk);
		const batchResult = this.batch.enabled ? await runMemoryEmbeddingBatchTimeoutRetry({
			onRetry: () => log$5.warn(`memory embeddings: ${provider.id} batch timed out; retrying once`),
			run: () => batchEmbed({
				agentId: this.agentId,
				chunks: resolveEmbeddingInputFormatVersion(provider.model) ? missingChunks.map((chunk) => ({
					...chunk,
					...formatEmbeddingModelInput(chunk, provider.model, "document"),
					...chunk.embeddingInput ? { embeddingInput: formatEmbeddingModelInput(chunk.embeddingInput, provider.model, "document") } : {}
				})) : missingChunks,
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
			})
		}) : null;
		let batchEmbeddings;
		if (batchResult?.kind === "success") {
			if (this.batchFailure.count > 0) log$5.debug("memory embeddings: batch recovered; resetting failure count");
			this.batchFailure = { count: 0 };
			if (!batchResult.value) return this.embedChunksInBatches(candidates, generation, EMBEDDING_BATCH_MAX_TOKENS, {
				embeddings,
				missing,
				missingCandidates
			});
			batchEmbeddings = batchResult.value;
			await this.persistGeneratedEmbeddings(missingCandidates, batchEmbeddings, generation);
		} else {
			if (batchResult) {
				const message = formatErrorMessage(batchResult.error);
				const forceDisable = isEmbeddingBatchUnavailableError(batchResult.error);
				if (this.batch.enabled) {
					const count = this.batchFailure.count + (forceDisable ? this.batchFailureLimit : batchResult.attempts);
					this.batchFailure = {
						count,
						lastError: message,
						lastProvider: provider.id
					};
					this.batch.enabled = !(forceDisable || count >= this.batchFailureLimit);
				}
				const suffix = this.batch.enabled ? "keeping batch enabled" : "disabling batch";
				log$5.warn(`memory embeddings: ${provider.id} batch failed (${this.batchFailure.count}/${this.batchFailureLimit}); ${suffix}; falling back to non-batch embeddings: ${message}`);
			}
			return this.embedChunksInBatches(candidates, generation, EMBEDDING_BATCH_MAX_TOKENS, {
				embeddings,
				missing,
				missingCandidates
			});
		}
		for (const [index, item] of missing.entries()) embeddings[item] = batchEmbeddings[index] ?? [];
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
			return await runMemoryEmbeddingBatchRetryWithSplit({
				items: requestItems,
				maxInputsPerRequest: provider.maxInputsPerRequest,
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
						run: async (signal) => await provider.embedBatch(batchItems.map((item) => formatEmbeddingModelInput(item.input, provider.model, "document")), {
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
				waitForRetry: async (delayMs) => {
					await this.waitForEmbeddingRetry(delayMs, structured ? "retrying structured batch" : "retrying");
				},
				onSplit: ({ itemCount, splitAt }) => {
					log$5.warn(`memory embeddings ${label} failed; splitting ${itemCount} inputs into ${Math.ceil(itemCount / splitAt)} batches of at most ${splitAt}`);
				}
			});
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
	async probeEmbeddingProvider(provider, providerRuntime) {
		const timeoutMs = this.resolveEmbeddingTimeout("query", provider, providerRuntime);
		const deadlineControl = createMemorySearchDeadlineControl();
		try {
			await runEmbeddingOperationWithTimeout({
				timeoutMs,
				message: `memory embedding probe timed out after ${Math.round(timeoutMs / 1e3)}s`,
				deadlineControl,
				run: (signal) => provider.embed(formatEmbeddingModelInput("ping", provider.model, "query"), {
					signal,
					inputType: "query",
					[MEMORY_SEARCH_DEADLINE_CONTROL]: deadlineControl
				})
			});
		} catch (error) {
			if (provider === this.provider) this.markLocalEmbeddingProviderDegraded(error);
			throw error;
		}
	}
	async embedQueryWithRetry(text, signal, providerOverride, providerRuntimeOverride, deadlineControl) {
		const provider = providerOverride ?? this.provider;
		const providerRuntime = providerOverride ? providerRuntimeOverride : this.providerRuntime;
		if (!provider) throw new Error("Cannot embed query in FTS-only mode (no embedding provider)");
		try {
			return await runMemoryEmbeddingRetryLoop({
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
						run: async (opSignal) => await provider.embed(formatEmbeddingModelInput(text, provider.model, "query"), {
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
			});
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
	getIndexConcurrency() {
		if (this.batch.enabled) return this.batch.concurrency;
		const provider = this.syncProviderGeneration ? this.syncProviderGeneration.provider : this.provider;
		return provider?.id === "local" || provider?.id === "ollama" ? 1 : EMBEDDING_INDEX_CONCURRENCY;
	}
	sourceReplacement({ prepared: { entry, source, chunks, retained, removedIds }, embeddings, vectorReady }, generation) {
		return {
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
				sessionId: expectDefined(entry.sessionId, "memory index session identity"),
				retained,
				removedIds
			} : { source }
		};
	}
	async writeChunkGroup(items, generation) {
		const database = this.database;
		const sourceDatabase = generation?.database ?? this.publishedDatabase;
		await withMemoryWorkspaceLock(this.workspaceDir, async () => {
			const assertCurrent = () => {
				this.memoryFiles?.assertCurrent();
				if (this.closed || database.closed || !database.isOpen || this.database !== database || sourceDatabase !== this.publishedDatabase || sourceDatabase.closed || !sourceDatabase.isOpen || generation && this.syncProviderGeneration !== generation) throw new Error("Memory source owner changed before replacement");
			};
			const activeItems = [...items];
			const replacements = activeItems.map((item) => this.sourceReplacement(item, generation));
			if (database !== sourceDatabase) {
				for (const replacement of replacements) if (replacement.source === "sessions") await assertMemorySessionNotForgotten(sourceDatabase, replacement, assertCurrent);
			}
			const prepare = async () => {
				for (let index = activeItems.length - 1; index >= 0; index--) {
					const { prepared: { entry, source } } = activeItems[index];
					if (source !== "memory") continue;
					if ((await (this.memoryFiles?.inspectFile ?? buildFileEntry)(entry.absPath, this.workspaceDir, this.settings.multimodal))?.hash !== entry.hash) {
						this.dirty = true;
						log$5.debug("memory source changed while indexing; queued incremental retry", { path: entry.path });
						activeItems.splice(index, 1);
						replacements.splice(index, 1);
					}
				}
				assertCurrent();
				return replacements.length > 0;
			};
			if (!(replacements.length > 1 && memoryPublicationGroup(replacements) ? await database.replaceSource(replacements, assertCurrent, prepare) : await database.replaceSource(expectDefined(replacements[0], "memory source publication"), assertCurrent, prepare))) return;
			for (const { prepared: { chunks }, vectorReady } of activeItems) database.vectorDegradedWriteWarningShown = logMemoryVectorDegradedWrite({
				vectorEnabled: this.vector.enabled,
				vectorReady,
				chunkCount: chunks.length,
				warningShown: database.vectorDegradedWriteWarningShown,
				loadError: this.vector.loadError,
				warn: (message) => log$5.warn(message)
			});
		}).catch((error) => {
			this.markFailedFullReindexRetry({
				memory: false,
				sessions: items.some((item) => item.prepared.source === "sessions")
			});
			throw error;
		});
	}
	async prepareIndexEntry(entry, source, generation, retain = true) {
		const kind = entry.kind;
		const suppliedContent = entry.content;
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
		const preparedEntry = source === "sessions" && kind !== "multimodal" && typeof suppliedContent === "string" ? await withMemoryWorkspacePreparation(this.workspaceDir, prepare) : await withMemoryWorkspaceLock(this.workspaceDir, prepare);
		if (!preparedEntry || !retain) return preparedEntry;
		const database = this.database;
		return await retainIndexedSessionChunks(preparedEntry, database, generation, () => {
			if (this.closed || database.closed || this.database !== database) throw new Error("Memory source owner changed before session delta planning");
		});
	}
	async indexFiles(items) {
		if (items.length === 0) return [];
		this.beginSyncProviderGeneration();
		try {
			return await this.indexFilesWithGeneration(items, this.syncProviderGeneration);
		} finally {
			this.endSyncProviderGeneration();
		}
	}
	async indexFilesWithGeneration(items, generation) {
		const prepared = [];
		let preparedRequestCount = 0;
		let next = 0;
		while (next < items.length && prepared.length < SOURCE_WIDE_BATCH_MAX_FILES) {
			if (this.shouldYieldSessionIndexing()) return [...prepared.map((item) => item.work), ...items.slice(next)];
			const work = items[next++];
			if (work.entry.kind === "multimodal") {
				await this.indexFileWithGeneration(work.entry, work.source, generation);
				continue;
			}
			const value = await this.prepareIndexEntry(work.entry, work.source, generation);
			if (value) {
				prepared.push({
					work,
					value
				});
				preparedRequestCount += value.chunks.length;
				if (preparedRequestCount >= SOURCE_WIDE_BATCH_MAX_REQUESTS) break;
			}
		}
		if (this.shouldYieldSessionIndexing()) return [...prepared.map((item) => item.work), ...items.slice(next)];
		const candidates = prepared.flatMap(({ value }) => value.chunks.map((chunk) => ({
			chunk,
			entry: value.entry,
			source: value.source
		})));
		let embeddings = [];
		if (generation?.kind === "semantic" && candidates.length > 0) {
			const cached = await this.collectCachedEmbeddings(candidates, generation);
			if (!this.batch.enabled) embeddings = await this.embedChunksInBatches(candidates, generation, EMBEDDING_BATCH_MAX_TOKENS, cached);
			else {
				const sourceWide = generation.runtime?.sourceWideBatchEmbed === true;
				const requestSizes = sourceWide ? Array.from({ length: Math.ceil(candidates.length / SOURCE_WIDE_BATCH_MAX_REQUESTS) }, (_, index) => Math.min(SOURCE_WIDE_BATCH_MAX_REQUESTS, candidates.length - index * SOURCE_WIDE_BATCH_MAX_REQUESTS)) : prepared.map((item) => item.value.chunks.length);
				const resolved = new Map(candidates.flatMap((candidate, index) => cached.embeddings[index]?.length ? [[candidate.chunk.hash, cached.embeddings[index]]] : []));
				let offset = 0;
				const requests = requestSizes.map((size) => {
					const batchCandidates = candidates.slice(offset, offset + size);
					offset += size;
					return async () => {
						const known = batchCandidates.map((candidate) => resolved.get(candidate.chunk.hash) ?? []);
						const missing = known.flatMap((embedding, index) => embedding.length > 0 ? [] : [index]);
						const batchEmbeddings = await this.embedChunksWithBatch(batchCandidates, batchCandidates[0]?.source ?? "unknown", generation, {}, {
							embeddings: known,
							missing,
							missingCandidates: missing.map((index) => batchCandidates[index])
						});
						for (const [index, candidate] of batchCandidates.entries()) {
							const embedding = batchEmbeddings[index];
							if (embedding?.length) resolved.set(candidate.chunk.hash, embedding);
						}
						return batchEmbeddings;
					};
				});
				embeddings = (await runWithConcurrency(requests, sourceWide ? 1 : this.getIndexConcurrency())).flat();
			}
		}
		const sample = embeddings.find((embedding) => embedding.length > 0);
		const vectorReady = sample ? await this.ensureVectorReady(sample.length) : false;
		let offset = 0;
		let cursor = 0;
		while (cursor < prepared.length) {
			if (this.shouldYieldSessionIndexing()) return [...prepared.slice(cursor).map((item) => item.work), ...items.slice(next)];
			const group = [];
			const groupStart = offset;
			let rows = 0;
			while (cursor < prepared.length && group.length < SOURCE_PUBLICATION_MAX_FILES) {
				const item = prepared[cursor].value;
				const rowCount = item.chunks.length + (item.retained?.length ?? 0) + (item.removedIds?.length ?? 0);
				const publication = {
					prepared: item,
					embeddings: embeddings.slice(offset, offset + item.chunks.length),
					vectorReady
				};
				if (group.length > 0 && (group[0].prepared.source !== item.source || rows + rowCount > SOURCE_PUBLICATION_MAX_ROWS || !memoryPublicationGroup([...group, publication].map((source) => this.sourceReplacement(source, generation))))) break;
				group.push(publication);
				rows += rowCount;
				offset += item.chunks.length;
				cursor++;
			}
			await this.writeChunkGroup(group, generation);
			embeddings.fill([], groupStart, offset);
			for (const item of group) item.embeddings = [];
		}
		return next < items.length ? await this.indexFilesWithGeneration(items.slice(next), generation) : [];
	}
	async indexFile(entry, source) {
		this.beginSyncProviderGeneration();
		try {
			await this.indexFileWithGeneration(entry, source, this.syncProviderGeneration);
		} finally {
			this.endSyncProviderGeneration();
		}
	}
	async indexFileWithGeneration(entry, source, generation, retain = true) {
		if (generation?.kind !== "semantic" && entry.kind === "multimodal") return;
		const prepared = await this.prepareIndexEntry(entry, source, generation, retain);
		if (!prepared) return;
		if (generation?.kind !== "semantic" || prepared.chunks.length === 0) return await this.writeChunkGroup([{
			prepared,
			embeddings: [],
			vectorReady: false
		}], generation);
		let embeddings;
		try {
			const candidates = prepared.chunks.map((chunk) => ({
				chunk,
				entry: prepared.entry,
				source: prepared.source
			}));
			embeddings = await this.embedChunksWithBatch(candidates, source, generation);
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
				return await this.writeChunkGroup([{
					prepared: {
						...prepared,
						chunks: []
					},
					embeddings: [],
					vectorReady: false
				}], generation);
			}
			throw err;
		}
		const sample = embeddings.find((embedding) => embedding.length > 0);
		const vectorReady = sample ? await this.ensureVectorReady(sample.length) : false;
		await this.writeChunkGroup([{
			prepared,
			embeddings,
			vectorReady
		}], generation);
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
	if (params.settings.provider === "none" || configuredProvider?.toLowerCase() === "none") return {
		mode: "fts-only",
		provider: params.settings.provider
	};
	const adapterTransport = resolveEmbeddingProviderAdapterTransport(params.settings.provider, params.cfg);
	if (!configuredProvider || configuredProvider.toLowerCase() === "auto" || adapterTransport === "local") return {
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
		this.providerRetirementPromise = Promise.resolve();
		this.providersPendingRetirement = /* @__PURE__ */ new Set();
		this.activeBackgroundSearchSyncs = /* @__PURE__ */ new Set();
		this.indexIdentityDirty = false;
		this.primaryRecoveryPromise = null;
		this.primaryRecoveryRetryAt = 0;
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
			const nextFailure = this.refreshEmbeddingBootstrapFailure(failure);
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
					reason: "embedding-bootstrap-recovery",
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
	refreshEmbeddingBootstrapFailure(failure) {
		const nextFailure = {
			...failure,
			reason: this.providerUnavailableReason ?? failure.reason
		};
		this.embeddingBootstrapFailure = nextFailure;
		this.cacheProbeResult({
			ok: false,
			error: nextFailure.reason
		});
		return nextFailure;
	}
	clearEmbeddingBootstrapFailureAfterRecovery() {
		this.embeddingBootstrapFailure = void 0;
		this.providerUnavailableReason = void 0;
		if (this.provider) this.providerLifecycle = resolveMemoryProviderLifecycle({
			provider: this.provider,
			requestedProvider: this.settings.provider,
			fallbackFrom: this.fallbackFrom,
			fallbackReason: this.fallbackReason
		});
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
		const provider = this.provider;
		if (!provider) return false;
		try {
			await this.probeEmbeddingProvider(provider, this.providerRuntime);
			this.cacheProbeResult({ ok: true });
			return true;
		} catch (err) {
			this.markEmbeddingBootstrapFailure(err, {
				retainProvider: true,
				provider: provider.id
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
				const result = await this.createConfiguredEmbeddingProvider({
					...resolveMemoryPrimaryProviderRequest({ settings: this.settings }),
					fallback: "none"
				});
				candidate = result.provider;
				if (!candidate || !resolveMemoryIndexProviderIdentities({
					provider: candidate,
					cacheKeyData: result.runtime?.cacheKeyData,
					aliases: result.runtime?.indexIdentityAliases
				}).some((identity) => identity.provider === meta.provider && identity.model === meta.model && identity.providerKey === meta.providerKey)) return;
				await this.probeEmbeddingProvider(candidate, result.runtime);
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
			const providerResult = await this.createConfiguredEmbeddingProvider();
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
		try {
			await this.retireCurrentProvider();
			return [];
		} catch (err) {
			log$4.warn(`memory close: pending manager work failed: ${formatErrorMessage(err)}`);
			return [err];
		}
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
		const provider = this.settings.provider === "none" ? null : this.providerInitialized && this.providerLifecycle.mode !== "degraded" ? this.provider : void 0;
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
		if (indexState) this.database.facts = {
			...this.database.facts,
			meta: indexState.meta,
			serialized: indexState.meta ? JSON.stringify(indexState.meta) : null,
			hasIndexedChunks: indexState.hasIndexedChunks,
			vectorState: indexState.vectorState
		};
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
		return await this.withManagerOperation(() => this.probeVectorStoreAvailabilityAdmitted());
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
				await this.probeEmbeddingProvider(this.provider, this.providerRuntime);
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
				adapters: /* @__PURE__ */ new Set(),
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
		owner.adapters.add(adapter);
		return await create();
	}
	canPublishProbe(manager) {
		const owner = this.managers.get(manager);
		return owner !== void 0 && !owner.retiring;
	}
	getProbeOwners(manager) {
		const owner = this.managers.get(manager);
		return owner ? [...owner.adapters] : [];
	}
	prepareManagersForReload(reload) {
		for (const [key, entry] of this.embeddingProbeCache) if (reload.retireRuntime || entry.adapters.some((adapter) => reload.adapters.has(adapter))) this.embeddingProbeCache.delete(key);
		return async () => {
			const selected = [...this.managers].filter(([manager, owner]) => owner.retiring || reload.retireRuntime || this.getProbeOwners(manager).some((adapter) => reload.adapters.has(adapter)));
			for (const [manager, owner] of selected) {
				owner.retiring = true;
				if (this.cache.get(owner.key) === manager) this.cache.delete(owner.key);
				this.embeddingProbeCache.delete(owner.key);
			}
			return { errors: (await Promise.allSettled([...reload.retireRuntime ? this.scopeOperations.values() : [], ...selected.map(([manager, owner]) => this.closeEntry(owner.key, manager))])).flatMap((result) => result.status === "rejected" ? [result.reason] : []) };
		};
	}
	async acquire(params, callbacks) {
		if (params.purpose === "maintenance" && (this.reload?.retireRuntime || this.closePromise)) return null;
		if (this.reload?.retireRuntime) throw new MemoryManagerReloadError();
		return await this.runScopeOperation(params, async () => {
			const prepared = await callbacks.prepare();
			if (!prepared) return null;
			const create = async () => {
				const manager = await prepared.create();
				this.track(manager, prepared.key);
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
			if (existing) return existing;
			const manager = await create();
			this.cache.set(prepared.key, manager);
			return manager;
		});
	}
	async closeAll() {
		const previous = this.closePromise ?? Promise.resolve();
		const operation = () => this.closeAllUnlocked();
		const closePromise = previous.then(operation, operation);
		this.closePromise = closePromise;
		await closePromise;
		if (this.closePromise === closePromise) this.closePromise = null;
	}
	async closeForAgent(params) {
		const scope = {
			agentId: normalizeAgentId(params.agentId),
			purpose: params.purpose
		};
		await this.runScopeOperation(scope, () => this.closeScopeUnlocked(scope));
	}
	deleteIfCurrent(key, manager) {
		this.managers.delete(manager);
		if (this.cache.get(key) === manager) this.cache.delete(key);
	}
	async runScopeOperation(params, operation) {
		await this.closePromise;
		return await enqueueKeyedTask({
			tails: this.scopeOperations,
			key: JSON.stringify([params.agentId, params.purpose]),
			task: operation
		});
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
			await manager.sync({
				reason: params.reason,
				force: true
			});
		}
		const status = await readMemorySearchManagerStatus(manager);
		if (status.dirty === true) {
			const remaining = manager.takeReindexRetryStateForMaintenance();
			params.restoreDirtyGeneration(remaining);
			incompleteReason = status.lastSyncError ?? (remaining.memoryFullRetryDirty || remaining.sessionsFullRetryDirty ? MEMORY_SYNC_DEFERRED : void 0);
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
//#region extensions/memory-core/src/memory/mmr.ts
const DEFAULT_MMR_CONFIG = {
	enabled: false,
	lambda: .7
};
function applyMMRToHybridResults(items, lambda) {
	if (items.length === 0) return items;
	if (items.length === 1) return [...items];
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
/** Chunks with a malformed project annotation never reach retrieval results. */
function hasValidProjectAnnotation(entry) {
	return !entry.projectKey?.split(";").map((key) => key.trim()).includes(INVALID_PROJECT_ANNOTATION_KEY);
}
function applyRetrievalRanking(results, activeProjectKeys) {
	return results.filter(hasValidProjectAnnotation).map((entry) => {
		const importance = entry.importance;
		const multiplier = importance === null || importance === void 0 ? 1 : .75 + Math.max(1, Math.min(10, Math.floor(importance))) * .05;
		return Object.assign({}, entry, { score: entry.score * multiplier * projectScoreMultiplier(entry.projectKey, activeProjectKeys) });
	});
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
async function extractTimestamp(params) {
	if (params.source === "sessions") {
		const mtime = params.sessionSourceMtimes?.get(params.filePath);
		return mtime !== void 0 && Number.isFinite(mtime) ? new Date(mtime) : null;
	}
	const normalized = params.filePath.replaceAll("\\", "/").replace(/^\.\//, "");
	const match = DATED_MEMORY_PATH_RE.exec(normalized);
	if (match) {
		const year = Number(match[1]);
		const month = Number(match[2]);
		const day = Number(match[3]);
		const parsed = new Date(Date.UTC(year, month - 1, day));
		if (parsed.getUTCFullYear() === year && parsed.getUTCMonth() === month - 1 && parsed.getUTCDate() === day) return parsed;
	}
	if (params.source === "memory" && (normalized === "MEMORY.md" || normalized === "USER.md" || normalized.startsWith("memory/") && !match)) return null;
	if (params.source === "memory" && params.memorySourceMtimes) {
		const mtime = params.memorySourceMtimes.get(params.filePath);
		return mtime !== void 0 && Number.isFinite(mtime) ? new Date(mtime) : null;
	}
	if (!params.workspaceDir) return null;
	const absolutePath = path.isAbsolute(params.filePath) ? params.filePath : path.resolve(params.workspaceDir, params.filePath);
	try {
		const stat = await fs.stat(absolutePath);
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
function createKeywordScoreScale(keywordScores, bestVectorScore) {
	if (bestVectorScore === 0) return (score) => score;
	const relevance = (score) => score / (1 - score);
	const strongest = Math.max(0, ...keywordScores.filter((score) => score < 1).map(relevance));
	return (score) => {
		if (score <= 0) return score;
		const share = score >= 1 ? 1 : relevance(score) / strongest;
		return Math.min(score, share * bestVectorScore);
	};
}
async function mergeHybridResults(params) {
	const createCandidate = (r) => ({
		...r,
		vectorScore: 0,
		textScore: 0,
		rankingScore: 0,
		pathScore: 0,
		exactPathSpecificity: r.exactPathSpecificity ?? 0,
		hasBodyMatch: false,
		hasVector: false,
		hasKeyword: false
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
	const candidates = Array.from(byId.values()).filter(hasValidProjectAnnotation);
	const keywordScoreOf = (entry) => entry.textScore > 0 ? entry.rankingScore : entry.exactPathSpecificity > 0 ? 0 : entry.pathScore;
	const scaleKeywordScore = createKeywordScoreScale(candidates.map(keywordScoreOf), params.vectorWeight > 0 ? Math.max(0, ...candidates.map((entry) => entry.vectorScore)) : 0);
	const merged = candidates.map((entry) => {
		const keywordScore = scaleKeywordScore(keywordScoreOf(entry));
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
	});
	const activeProjects = prepareActiveProjectKeys(params.activeProjectKeys);
	const rankable = (await applyTemporalDecayToHybridResults({
		results: applyRetrievalRanking(merged, activeProjects).map((entry) => Object.assign(entry, { eligibilityScore: entry.exactPathSpecificity > 0 ? projectScoreMultiplier(entry.projectKey, activeProjects) : entry.contentScore === 0 ? 0 : entry.score })),
		temporalDecay: temporalDecayConfig,
		workspaceDir: params.workspaceDir,
		sessionSourceMtimes: params.sessionSourceMtimes,
		memorySourceMtimes: params.memorySourceMtimes,
		nowMs: params.nowMs
	})).map((entry) => {
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
		return applyMMRToHybridResults(entries.map((entry) => Object.assign(entry, { score: entry.rankingScore })), mmrConfig.lambda).map((entry) => Object.assign(entry, { score: projectScoreMultiplier(entry.projectKey, activeProjects) }));
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
	}), ...mmrConfig.enabled ? applyMMRToHybridResults(nonExact, mmrConfig.lambda) : nonExact].map(({ exactPathSpecificity: _exactPathSpecificity, rankingScore: _rankingScore, contentScore: _contentScore, lexicalRank: _lexicalRank, ...entry }) => entry);
}
function hybridResultRangeKey(entry) {
	return `${entry.source}:${entry.path}:${entry.startLine}:${entry.endLine}`;
}
function selectHybridSearchResults(params) {
	const strict = params.merged.filter((entry) => entry.eligibilityScore >= params.minScore);
	const selected = strict.slice(0, params.maxResults);
	if (params.keyword.length === 0 || selected.length === params.maxResults) return selected.map(({ eligibilityScore: _eligibilityScore, ...entry }) => entry);
	const keywordKeys = new Set(params.keyword.map((entry) => hybridResultRangeKey(entry)));
	const isLexicalCandidate = (entry) => entry.eligibilityScore >= 0 && keywordKeys.has(hybridResultRangeKey(entry));
	if (strict.length === 0) return params.merged.filter(isLexicalCandidate).slice(0, params.maxResults).map(({ eligibilityScore: _eligibilityScore, ...entry }) => entry);
	const vectorKeys = new Set(params.vectorCandidates.map(hybridResultRangeKey));
	const seen = new Set(selected.map((entry) => hybridResultRangeKey(entry)));
	for (const entry of params.merged) {
		if (selected.length === params.maxResults) break;
		const key = hybridResultRangeKey(entry);
		if (entry.eligibilityScore < params.minScore && (entry.vectorScore === 0 || !vectorKeys.has(key)) && isLexicalCandidate(entry) && !seen.has(key)) {
			seen.add(key);
			selected.push(entry);
		}
	}
	return selected.map(({ eligibilityScore: _eligibilityScore, ...entry }) => entry);
}
//#endregion
//#region extensions/memory-core/src/memory/manager-keyword-retrieval.ts
const SNIPPET_MAX_CHARS$1 = 700;
const EXACT_PATH_CANDIDATE_LIMIT = 200;
const log$2 = createSubsystemLogger("memory");
function projectRecallMetadata(row) {
	return {
		...typeof row?.importance === "number" ? { importance: row.importance } : {},
		...typeof row?.triggers === "string" && row.triggers.trim() ? { triggers: row.triggers.trim() } : {},
		...typeof row?.project_key === "string" && row.project_key.trim() ? { projectKey: row.project_key.trim() } : {}
	};
}
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
		return await this.readCuratedMemoryCandidates(opts, false);
	}
	async listCuratedProjectCandidates(opts) {
		return await this.readCuratedMemoryCandidates(opts, true);
	}
	async readCuratedMemoryCandidates(opts, projectsOnly) {
		const limit = Math.max(1, Math.min(512, Math.floor(opts?.limit ?? (projectsOnly ? 48 : 512))));
		return await this.withManagerOperation(async () => {
			const result = await runMemoryCuratedCandidates({
				agentId: this.agentId,
				databasePath: resolveUserPath(this.settings.store.databasePath)
			}, {
				limit,
				projectsOnly,
				activeProjectKeys: opts?.activeProjectKeys,
				checkProvenanceRepair: this.memorySourceProvenanceRepairPending
			});
			this.memorySourceProvenanceRepairPending = result.provenanceRepairPending;
			if (this.memorySourceProvenanceRepairPending) {
				this.withManagerOperation(() => this.syncAdmitted({ reason: "search" }, { allowEmbeddingBootstrapFallback: true })).catch((err) => {
					log$2.warn(`memory sync failed (automatic candidates): ${formatErrorMessage(err)}`);
				});
				return [];
			}
			return result.rows.map((row) => {
				const candidate = {
					path: row.path,
					startLine: row.start_line,
					endLine: row.end_line,
					score: 0,
					snippet: row.text,
					source: "memory"
				};
				Object.assign(candidate, projectRecallMetadata(row));
				candidate.provenance = {
					originClass: row.origin_class,
					sessionKind: row.session_kind,
					observedAt: row.observed_at
				};
				if (typeof row.supersedes_key === "string") candidate.provenance.supersedesKey = row.supersedes_key;
				return candidate;
			});
		});
	}
	async finalizeKeywordOnlyResults(params) {
		const appliesTemporalDecay = params.temporalDecay?.enabled === true;
		const decayInputs = appliesTemporalDecay ? params.results.map((entry) => {
			if (entry.exactPathSpecificity === 0) return entry;
			const contentScore = entry.hasBodyMatch ? entry.score : 0;
			return {
				...entry,
				score: scoreExactPathTieForTemporalDecay(contentScore)
			};
		}) : params.results;
		const activeProjects = prepareActiveProjectKeys(params.activeProjectKeys);
		const weighted = applyRetrievalRanking(decayInputs, activeProjects);
		const strict = weighted.filter((entry) => (entry.exactPathSpecificity > 0 ? projectScoreMultiplier(entry.projectKey, activeProjects) : entry.score) >= params.minScore);
		const ranked = (await applyTemporalDecayToHybridResults({
			results: strict.length > 0 ? strict : weighted.filter((entry) => entry.score >= 0),
			temporalDecay: params.temporalDecay,
			workspaceDir: this.workspaceDir,
			sessionSourceMtimes: this.loadSourceMtimes("sessions", params.results),
			memorySourceMtimes: this.loadSourceMtimes("memory", params.results)
		})).toSorted((left, right) => compareKeywordSearchHits(left, right, !appliesTemporalDecay)).map((entry) => entry.exactPathSpecificity > 0 ? Object.assign(entry, { score: projectScoreMultiplier(entry.projectKey, activeProjects) }) : entry);
		return this.toMemorySearchResults(ranked.slice(0, params.maxResults));
	}
	loadSourceMtimes(source, results) {
		if (source === "memory" && !this.memoryFiles) return;
		const entries = results.filter((entry) => entry.source === source);
		if (entries.length === 0) return;
		return new Map(entries.map((entry) => [entry.path, entry.sourceMtime]));
	}
	async attachRecallMetadata(results, signal) {
		if (results.length === 0) return results;
		const query = {
			candidates: results.map(({ id, path, source }) => ({
				id,
				path,
				source
			})),
			includeMemoryMtimes: Boolean(this.memoryFiles)
		};
		const metadata = await runMemoryRecallMetadata({
			agentId: this.agentId,
			databasePath: resolveUserPath(this.settings.store.databasePath)
		}, query, signal);
		return this.applyRecallMetadata(results, metadata);
	}
	applyRecallMetadata(results, { rows: metadataById, sourceMtimes }) {
		return results.filter((entry) => metadataById.has(entry.id)).map((entry) => {
			const row = metadataById.get(entry.id);
			return Object.assign(entry, {
				sourceMtime: sourceMtimes[entry.source].get(entry.path),
				...projectRecallMetadata(row),
				...row?.provenance ? { provenance: row.provenance } : {}
			});
		});
	}
	buildKeywordSearchQuery(query, limit, options, sourceFilterList) {
		return {
			includeRecallMetadata: options?.fuseRecallMetadata,
			body: {
				ftsTable: MEMORY_INDEX_FTS_TABLE,
				query,
				ftsTokenizer: this.settings.store.fts.tokenizer,
				limit,
				snippetMaxChars: SNIPPET_MAX_CHARS$1,
				sourceFilter: this.buildSourceFilter(void 0, sourceFilterList),
				boostFallbackRanking: options?.boostFallbackRanking
			},
			path: {
				pathFtsTable: MEMORY_INDEX_PATHS_FTS_TABLE,
				query,
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
	resolveKeywordSearchResult(result, exactPathQuery, limit) {
		if (result.body.error) log$2.warn(`memory search: body keyword query failed: ${result.body.error}`);
		if (result.path.error) log$2.warn(`memory search: path keyword query failed: ${result.path.error}`);
		const bodyResults = result.body.rows;
		const pathResults = result.path.rows;
		const merged = this.mergeKeywordSearchHits([bodyResults.map((entry) => Object.assign(entry, { pathScore: 0 })), pathResults], exactPathQuery);
		const results = this.limitKeywordSearchHits(merged, limit);
		return result.recallData ? this.applyRecallMetadata(results, result.recallData) : results;
	}
	async searchKeyword(query, limit, options, sourceFilterList, initialResult) {
		if (!this.fts.enabled || !this.fts.available) return [];
		const result = initialResult ?? await runMemoryKeywordSearch({
			agentId: this.agentId,
			databasePath: resolveUserPath(this.settings.store.databasePath)
		}, this.buildKeywordSearchQuery(query, limit, options, sourceFilterList), options?.signal);
		options?.signal?.throwIfAborted();
		const results = this.resolveKeywordSearchResult(result, query, limit);
		return options?.fuseRecallMetadata ? results : this.attachRecallMetadata(results, options?.signal);
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
function buildChildEnv() {
	const childEnv = {};
	for (const name of [
		"PATH",
		"SystemRoot",
		"SYSTEMROOT",
		"WINDIR",
		"TEMP",
		"TMP",
		"TMPDIR"
	]) if (process.env[name]) childEnv[name] = process.env[name];
	return childEnv;
}
function toAbortError(signal) {
	return signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("memory vector KNN aborted");
}
const vectorKnnAdmission = createPermitPool(MAX_CONCURRENT_VECTOR_KNN_CHILDREN);
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
function parseChildResult(output, maxRows) {
	let parsed;
	try {
		parsed = JSON.parse(output.toString("utf8"));
	} catch {
		throw new VectorKnnSubprocessError("memory vector KNN child returned malformed JSON", "protocol");
	}
	if (!parsed || typeof parsed !== "object" || !("status" in parsed)) throw new VectorKnnSubprocessError("memory vector KNN child returned an invalid envelope", "protocol");
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
			admission: createPermitPool(1),
			users: 0
		};
		databaseAdmissions.set(params.databasePath, entry);
	}
	entry.users += 1;
	let release;
	try {
		release = await entry.admission.acquire({ signal: params.signal }) ?? void 0;
		if (!release) throw toAbortError(params.signal);
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
		databasePath: params.databasePath,
		extensionPath: params.extensionPath,
		...sqliteLibrary.source !== "runtime" ? { sqliteLibraryPath: sqliteLibrary.path } : {},
		request: params.request
	};
	const inputPayload = Buffer.from(JSON.stringify(input), "utf8");
	if (inputPayload.byteLength > MAX_STDIN_BYTES) throw new VectorKnnSubprocessError("memory vector KNN child input is too large", "protocol");
	let worker = children.get(params.databasePath);
	if (!worker) {
		let permit = vectorKnnAdmission.tryAcquire();
		if (!permit) {
			const idleWorker = [...children.values()].find((candidate) => candidate.idleTimer);
			if (idleWorker) idleWorker.retire();
			permit = await vectorKnnAdmission.acquire({ signal: params.signal });
		}
		if (!permit) throw toAbortError(params.signal);
		const releaseAdmission = permit;
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
	clearTimeout(worker.idleTimer);
	worker.idleTimer = void 0;
	child.stdout.removeAllListeners("data");
	setChildReferenced(child, true);
	return await new Promise((resolve, reject) => {
		const stderrChunks = [];
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
		for (const stream of ["stdout", "stderr"]) {
			const chunks = stream === "stderr" ? stderrChunks : [];
			const maxBytes = stream === "stdout" ? MAX_STDOUT_BYTES : MAX_STDERR_BYTES;
			let bytes = 0;
			child[stream].on("data", (chunk) => {
				bytes += chunk.byteLength;
				const frameBytes = stream === "stdout" && chunk[chunk.length - 1] === 10 ? 1 : 0;
				if (bytes > maxBytes + frameBytes) {
					if (stream === "stdout") chunks.length = 0;
					requestTermination(new VectorKnnSubprocessError(`memory vector KNN child ${stream} exceeded its limit`, "protocol"));
					return;
				}
				chunks.push(chunk);
				if (stream === "stderr") return;
				const newline = chunk.indexOf(10);
				if (newline < 0) return;
				try {
					if (newline !== chunk.length - 1) throw new VectorKnnSubprocessError("memory vector KNN child returned extra output", "protocol");
					const result = parseChildResult(Buffer.concat(chunks), params.request.limit);
					if (terminationReason) return;
					settleCaller(() => resolve(result));
					child.stdout.on("data", ownedWorker.retire);
					ownedWorker.idleTimer = setTimeout(ownedWorker.retire, SQLITE_IDLE_HANDLE_TTL_MS);
					ownedWorker.idleTimer.unref();
					if (vectorKnnAdmission.pendingCount > 0) ownedWorker.retire();
					else setChildReferenced(child, false);
				} catch (error) {
					requestTermination(error instanceof Error ? error : new Error(String(error)));
				}
			});
		}
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
		const fuseRecallMetadata = (opts?.lexicalOnly === true || this.providerRequirement.mode === "fts-only") && sourceFilterList.length === 1 && sourceFilterList[0] === "sessions";
		const keywordOptions = {
			boostFallbackRanking: true,
			signal: opts?.signal,
			fuseRecallMetadata
		};
		const database = this.publishedDatabase;
		const assertReadOwner = () => {
			opts?.signal?.throwIfAborted();
			if (!database.isOpen || this.publishedDatabase !== database) throw new Error("Memory retrieval changed its captured database owner");
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
			assertReadOwner();
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
			if (recoveringEmbeddingProvider || fuseRecallMetadata && !this.providerInitialized) await releaseReadGeneration();
			const embeddingBootstrapKeywordOnly = await this.ensureEmbeddingProviderForSearch(indexState, opts?.onDebug);
			const refreshSearchIdentity = () => embeddingBootstrapKeywordOnly ? this.refreshKeywordFallbackIndexIdentity(indexState) : this.refreshIndexIdentityDirty({
				providerKeyKnown: this.providerInitialized,
				indexState
			});
			if (recoveringEmbeddingProvider) indexState = await readIndexState();
			const sessionStartSync = this.claimSessionWarmSync(opts?.sessionKey);
			const searchSyncEnabled = (this.settings.sync.onSearch || sessionStartSync) && (this.purpose === "default" || this.purpose === "cli");
			if (!embeddingBootstrapKeywordOnly && !this.provider && (this.providerLifecycle.mode === "pending" || this.providerLifecycle.mode === "degraded" && this.providerLifecycle.providerId !== this.settings.provider)) {
				this.resetProviderInitializationForRetry();
				if (fuseRecallMetadata) await releaseReadGeneration();
				await this.ensureProviderInitialized();
			}
			this.assertRequiredProviderAvailable("search");
			if (!embeddingBootstrapKeywordOnly && !this.provider && this.providerLifecycle.mode === "degraded") {
				if (fuseRecallMetadata) await releaseReadGeneration();
				if (await this.activateSearchFallback(this.providerLifecycle.reason)) refreshSearchIdentity();
			}
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
			if (repairedIndexIdentity.status === "mismatched" && !embeddingBootstrapKeywordOnly && await this.adoptPublishedFallbackProviderIfMatched(indexState)) repairedIndexIdentity = refreshSearchIdentity();
			const formatUpgradePendingKeywordOnly = (state) => state.status === "mismatched" && state.owner === "openclaw" && state.versionOrder === "older" && (state.chunkingVersionOnly === true || state.lexicalCompatible === true) && this.fts.enabled && this.fts.available;
			if (repairedIndexIdentity.status !== "valid") {
				if (!formatUpgradePendingKeywordOnly(repairedIndexIdentity)) return [];
				log$1.warn("memory search: format upgrade rebuild is pending; serving the existing keyword index");
			}
			if (this.memoryWatchCapacityDegraded || this.memoryWatchUnavailable) this.dirty = true;
			const capacitySyncInFlight = (this.memoryWatchCapacityDegraded || this.memoryWatchUnavailable) && this.activeBackgroundSearchSyncs.size > 0;
			if (searchSyncEnabled && !capacitySyncInFlight && !formatUpgradePendingKeywordOnly(repairedIndexIdentity) && this.dirty) {
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
				if (leasedIdentity.status === "valid" || formatUpgradePendingKeywordOnly(leasedIdentity)) break;
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
			const keywordOnly = embeddingBootstrapKeywordOnly || formatUpgradePendingKeywordOnly(effectiveIdentity) || !this.provider || opts?.lexicalOnly;
			if (formatUpgradePendingKeywordOnly(effectiveIdentity)) opts?.onDebug?.({
				backend: "builtin",
				effectiveMode: "keyword-only"
			});
			const loadKeywordResults = async () => {
				const initialResult = preparedKeyword;
				preparedKeyword = void 0;
				const results = (keywordOnly || hybrid.enabled) && this.fts.enabled && this.fts.available ? await this.searchKeyword(normalizedQuery, candidates, keywordOptions, sourceFilterList, initialResult).catch((error) => this.handleRetrievalError("FTS keyword", error, opts?.signal)) : [];
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
			let vectorProviderIdentity;
			let keywordResults = [];
			let queryVec;
			for (let fallbackAttempt = false;; fallbackAttempt = true) {
				const semanticProviderRuntime = this.providerRuntime;
				vectorProviderIdentity = {
					model: semanticProvider.model,
					aliases: this.resolveProviderIndexIdentities().slice(1).map((identity) => identity.model)
				};
				const releaseProvider = this.acquireProviderUse(semanticProvider);
				try {
					keywordResults = await loadKeywordResults();
					try {
						queryVec = await this.embedQueryWithRetry(normalizedQuery, opts?.signal, semanticProvider, semanticProviderRuntime, opts?.[MEMORY_SEARCH_DEADLINE_CONTROL]);
						const dimensions = indexState.meta?.vectorDims;
						if (dimensions !== void 0 && queryVec.length !== dimensions) throw createMemoryEmbeddingOperationError({
							operation: "query",
							providerId: semanticProvider.id,
							cause: /* @__PURE__ */ new Error(`query embedding has ${queryVec.length} dimensions, but the memory index expects ${dimensions}; rebuild with openclaw memory index --force --agent ${this.agentId}`)
						});
						break;
					} catch (err) {
						releaseProvider();
						if (opts?.signal?.aborted) throw err;
						if (fallbackAttempt) {
							this.markLocalEmbeddingProviderDegraded(err);
							throw err;
						}
						opts?.onPartialResults?.(null);
						this.markLocalEmbeddingProviderDegraded(err);
						const message = formatErrorMessage(err);
						if (isMemoryEmbeddingOperationError(err) && await this.activateSearchFallback(message)) {
							if (refreshSearchIdentity().status !== "valid" || !this.provider) return [];
							semanticProvider = this.provider;
						} else if ((!this.provider || this.providerRequirement.mode !== "required") && this.fts.enabled && this.fts.available) {
							this.assertRequiredProviderAvailable("search");
							log$1.warn(`memory search: embeddings unavailable; using keyword-only results: ${message}`);
							return await finalizeKeywords(keywordResults);
						} else throw err;
					}
				} finally {
					releaseProvider();
				}
			}
			const hasVector = queryVec.some((v) => v !== 0);
			if (!hasVector) log$1.warn(`memory search: query embedding from ${semanticProvider.id} is all zeros; vector recall skipped; check the embedding service and retry`);
			const vector = hasVector ? await this.searchVector(queryVec, candidates, sourceFilterList, vectorProviderIdentity, indexState, keywordResults.map((entry) => entry.id), opts?.signal).catch((error) => ({
				results: this.handleRetrievalError("vector", error, opts?.signal),
				candidates: []
			})) : {
				results: [],
				candidates: []
			};
			const vectorResults = vector.results;
			if (!hybrid.enabled || !this.fts.enabled || !this.fts.available) return (await applyTemporalDecayToHybridResults({
				results: applyRetrievalRanking(vectorResults, prepareActiveProjectKeys(opts?.activeProjectKeys)).filter((entry) => entry.score >= minScore),
				temporalDecay: hybrid.temporalDecay,
				workspaceDir: this.workspaceDir,
				sessionSourceMtimes: this.loadSourceMtimes("sessions", vectorResults),
				memorySourceMtimes: this.loadSourceMtimes("memory", vectorResults)
			})).toSorted((left, right) => right.score - left.score || left.path.localeCompare(right.path) || left.startLine - right.startLine || left.endLine - right.endLine).slice(0, maxResults);
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
				vectorCandidates: vector.candidates,
				maxResults,
				minScore
			});
		};
		return await this.withManagerOperation(async () => {
			try {
				const results = await runSearch();
				assertReadOwner();
				return results;
			} finally {
				await releaseReadGeneration();
			}
		});
	}
	async activateSearchFallback(reason) {
		return await this.activateFallbackProvider(reason).catch((error) => {
			log$1.warn(`memory search: failed to activate fallback provider: ${formatErrorMessage(error)}`);
			return false;
		});
	}
	hasIndexedContent(state) {
		return state.hasIndexedChunks || this.fts.enabled && this.fts.available && state.hasFtsContent;
	}
	handleRetrievalError(kind, error, signal) {
		signal?.throwIfAborted();
		if (error instanceof WorkerTaskError && error.code === "overloaded") throw error;
		log$1.warn(`memory search: ${kind} query failed: ${formatErrorMessage(error)}`);
		return [];
	}
	async searchVector(queryVec, limit, sourceFilterList, providerIdentity, indexState, keywordCandidateIds, signal) {
		const query = {
			providerModel: providerIdentity.model,
			providerModelAliases: providerIdentity.aliases,
			queryVec,
			limit,
			snippetMaxChars: SNIPPET_MAX_CHARS
		};
		const readVectorRows = (candidateIds) => runMemoryVectorFallback({
			agentId: this.agentId,
			databasePath: resolveUserPath(this.settings.store.databasePath)
		}, {
			...query,
			candidateIds,
			limit: candidateIds?.length ?? limit,
			sourceFilter: this.buildSourceFilter(void 0, sourceFilterList)
		}, signal);
		const results = await searchVector({
			vectorTable: MEMORY_INDEX_VECTOR_TABLE,
			...query,
			signal,
			ensureVectorReady: async () => {
				if (!this.vector.enabled) return false;
				if (indexState.vectorState.state === "incomplete" || indexState.vectorState.state === "unverified") {
					this.markConfiguredSourcesForFullReindex();
					return false;
				}
				return indexState.vectorState.state === "complete";
			},
			runFallback: readVectorRows,
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
		const candidates = [...results];
		const scoredIds = new Set(candidates.map((entry) => entry.id));
		const missingIds = keywordCandidateIds.filter((id) => !scoredIds.has(id));
		if (missingIds.length > 0) results.push(...await readVectorRows(missingIds).catch((error) => this.handleRetrievalError("vector", error, signal)));
		return {
			results: await this.attachRecallMetadata(results, signal),
			candidates
		};
	}
};
//#endregion
//#region extensions/memory-core/src/memory/manager.ts
const log = createSubsystemLogger("memory");
var MemoryIndexManager = class MemoryIndexManager extends MemorySearchOrchestration {
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
					let publishedDatabase;
					try {
						if (source && (!source.publishedDatabase.isOpen || purpose !== "maintenance")) throw new Error("Memory maintenance source connection is unavailable");
						const effectiveSettings = resolveEffectiveMemorySearchSettings(settings);
						publishedDatabase = await MemoryIndexDatabase.openPublished({
							agentId,
							writeOptions: databaseOptions,
							readOnly: purpose === "status",
							allowExtension: effectiveSettings.store.vector.enabled,
							maintenanceSource: source?.publishedDatabase,
							schema: {
								cacheEnabled: effectiveSettings.cache.enabled,
								ftsEnabled: effectiveSettings.query.hybrid.enabled,
								ftsTokenizer: effectiveSettings.store.fts.tokenizer
							}
						});
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
							databaseOptions,
							publishedDatabase
						});
						managerRegistry.track(manager, key);
						await manager.memoryWatcherReady;
						if (params.inspectSources) await manager.inspectDiagnosticSourceState();
						memoryFiles?.assertCurrent();
						return manager;
					} catch (error) {
						try {
							if (manager) await manager.close();
							else if (publishedDatabase) try {
								await publishedDatabase.closePublicationWorker();
							} finally {
								publishedDatabase.release();
							}
						} catch (cleanupError) {
							throw new AggregateError([error, cleanupError], "Memory manager preparation cleanup failed", { cause: cleanupError });
						}
						throw error;
					}
				},
				reuse: ({ closing, closed, publishedDatabase, memoryFiles: files, backgroundRunner }) => !closing && !closed && publishedDatabase.isOpen && files === memoryFiles && backgroundRunner === (source?.backgroundRunner ?? params.runInBackgroundContext)
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
		this.publishedDatabase = params.publishedDatabase;
		this.providerKey = this.computeProviderKey();
		this.cache = {
			enabled: effectiveSettings.cache.enabled,
			maxEntries: effectiveSettings.cache.maxEntries
		};
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
		const invalidatedSources = new Set(this.database.facts.invalidatedSources);
		this.memorySourceProvenanceRepairPending = this.sources.has("memory") && invalidatedSources.has("memory");
		this.dirty = this.sources.has("memory") && (!transient || !meta) || this.memorySourceProvenanceRepairPending;
		if (this.sources.has("sessions") && invalidatedSources.has("sessions")) {
			this.sessionsDirty = true;
			this.sessionsFullRetryDirty = true;
		}
		this.batch = this.resolveBatchConfig();
		if (!transient) {
			markMemoryIndexingLive();
			this.runInBackgroundContext(() => {
				this.ensureWatcher();
				this.ensureSessionListener();
				this.ensureIntervalSync();
				this.runInBackgroundContext(() => this.ensureSessionStartupCatchup()).catch((err) => {
					log.warn("memory session startup catch-up failed: " + String(err));
				});
			});
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
			let outcome;
			await this.publishedDatabase.withPublicationGeneration(async () => {
				try {
					await this.publishedDatabase.refreshFacts();
				} catch (error) {
					if (params?.force && !hasTargetedSessionSyncParams(params)) {
						this.markFailedFullReindexRetry({
							memory: this.sources.has("memory"),
							sessions: this.sources.has("sessions")
						});
						this.recordFullReindexFailure(this.provider !== null);
					}
					throw error;
				}
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
						this.refreshEmbeddingBootstrapFailure(this.embeddingBootstrapFailure);
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
							return await this.runSync(params).then(async (syncOutcome) => {
								await this.publishedDatabase.closePublicationWorker();
								return syncOutcome;
							}, async (error) => {
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
					outcome = await runGeneration(forceFtsOnly);
				} catch (err) {
					if (!(this.providerRequirement.mode === "optional" && isMemoryEmbeddingOperationError(err))) throw err;
					const failedProvider = this.provider?.id ?? this.settings.provider;
					this.markEmbeddingBootstrapFailure(err, {
						retainProvider: this.provider !== null,
						provider: failedProvider
					});
					if (!options?.allowEmbeddingBootstrapFallback && !hadBootstrapFailure) throw err;
					forceFtsOnly = true;
					outcome = await runGeneration(true);
				}
				if (hadBootstrapFailure && !forceFtsOnly && this.provider && this.refreshIndexIdentityDirty({ providerKeyKnown: true }).status === "valid" && await this.confirmEmbeddingBootstrapRecovery()) this.clearEmbeddingBootstrapFailureAfterRecovery();
			});
			return outcome;
		};
		this.syncing = this.syncOutcomes.track(run, true).finally(() => {
			this.syncing = null;
		});
		return this.syncing;
	}
	/** @deprecated Compatibility for released synchronous callers; use statusAsync. */
	status() {
		if (this.closing || this.closed) throw new Error("Memory index manager is closed");
		return this.withPublishedDatabase(() => this.publishedStatus(collectMemoryStatusSnapshot(this.database.hasIndex ? this.db : void 0, resolveUserPath(this.settings.store.databasePath), this.statusQuery())));
	}
	statusAsync(options) {
		return this.withManagerOperation(async () => {
			if (options?.includeCounts === false) return this.publishedStatus();
			const target = this.publishedDatabase.writeOptions;
			if (!target?.agentId || !target.path) throw new Error("Memory status requires its captured database target");
			const snapshot = await runMemoryStatus({
				agentId: target.agentId,
				databasePath: target.path
			}, this.statusQuery());
			return this.publishedStatus(snapshot);
		});
	}
	statusQuery() {
		return {
			sources: Array.from(this.sources),
			cacheEnabled: this.cache.enabled,
			includeStorage: this.sourceInspections.size > 0
		};
	}
	publishedStatus(snapshot) {
		const aggregateState = snapshot?.aggregate;
		if (this.embeddingBootstrapFailure) this.refreshKeywordFallbackIndexIdentity();
		else this.refreshIndexIdentityDirty({ providerKeyKnown: this.providerInitialized });
		const providerInfo = resolveStatusProviderInfo({
			provider: this.embeddingBootstrapFailure ? null : this.provider,
			providerInitialized: this.embeddingBootstrapFailure ? true : this.providerInitialized,
			requestedProvider: this.settings.provider,
			resolveConfiguredModel: () => this.resolveConfiguredIndexIdentity()?.provider.model || this.settings.model
		});
		return {
			backend: "builtin",
			files: aggregateState?.files,
			chunks: aggregateState?.chunks,
			dirty: this.dirty || this.sessionsDirty || this.indexIdentityDirty || this.syncing !== null || this.activeBackgroundSearchSyncs.size > 0,
			lastSyncError: this.syncOutcomes.lastError,
			workspaceDir: this.workspaceDir,
			dbPath: this.settings.store.databasePath,
			storage: snapshot?.storage,
			provider: providerInfo.provider,
			model: providerInfo.model,
			requestedProvider: this.settings.provider,
			sources: Array.from(this.sources),
			extraPaths: this.settings.extraPaths,
			sourceCounts: aggregateState?.sourceCounts.map((entry) => Object.assign(entry, this.sourceInspections.get(entry.source) ?? {})),
			cache: this.cache.enabled ? {
				enabled: true,
				entries: snapshot?.cacheEntries,
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
				index: this.database.facts.vectorState,
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
