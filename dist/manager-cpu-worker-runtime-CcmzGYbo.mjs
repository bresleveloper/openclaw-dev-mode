import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-DoBSDhBS.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { r as ensureSqliteLibrarySelected } from "./bun-sqlite-library-CBSPJxTD.mjs";
import { t as WorkerTaskPool } from "./worker-task-pool-iI3pfrsK.mjs";
import "./memory-core-host-engine-knn-DTjLOT03.mjs";
import { t as memoryCpuProcessEntrypoints } from "./manager-cpu-entrypoints-_KEJpSFQ.mjs";
import "./process-runtime-CYiH_oPH.mjs";
import "./memory-core-host-engine-foundation-CsHcvVQs.mjs";
//#region extensions/memory-core/src/memory/manager-cpu-worker-runtime.ts
const MEMORY_INDEX_WORKER_INPUT_LIMIT_BYTES = 268435456;
const retrieval = new WorkerTaskPool({
	workerUrl: resolveRuntimeWorkerUrl(memoryCpuProcessEntrypoints.search),
	maxWorkers: 1,
	sharedCompute: true
});
const indexing = new WorkerTaskPool({
	workerUrl: resolveRuntimeWorkerUrl(memoryCpuProcessEntrypoints.index),
	maxWorkers: 1,
	sharedCompute: true,
	maxPendingBytes: MEMORY_INDEX_WORKER_INPUT_LIMIT_BYTES
});
function hasResultKind(result, kind) {
	return result.kind === kind;
}
async function runRetrieval(request, options, description) {
	ensureSqliteLibrarySelected();
	const result = await retrieval.run(request, options);
	if (!hasResultKind(result, request.kind)) throw new Error(`Invalid memory ${description} worker result`);
	return result;
}
async function runMemoryForgetIndexPlan(request) {
	let inputBytes = 2 * (request.agentId.length + request.databasePath.length + request.stateDir.length);
	for (const values of [
		request.changedPaths,
		request.removedPaths,
		request.sessionIds,
		request.excludedSessionIds,
		request.entryKeys,
		request.corpusSnippets
	]) for (const value of values) inputBytes += value.length * 2;
	return (await runRetrieval(request, { inputBytes }, "Forget index plan")).plan;
}
function originReadBytes(target, filters = {}) {
	return 2 * (target.agentId.length + target.databasePath.length + target.stateDir.length + (filters.entryKeys?.reduce((bytes, key) => bytes + key.length, 0) ?? 0) + (filters.sessionIds?.reduce((bytes, key) => bytes + key.length, 0) ?? 0));
}
async function runMemoryOriginRows(target, filters) {
	return (await runRetrieval({
		...target,
		...filters,
		kind: "origin-rows"
	}, { inputBytes: originReadBytes(target, filters) }, "origin rows")).rows;
}
async function runMemoryTombstoneRows(target, sessionIds) {
	return (await runRetrieval({
		...target,
		sessionIds,
		kind: "session-tombstones"
	}, { inputBytes: originReadBytes(target, { sessionIds }) }, "tombstone rows")).rows;
}
async function runMemoryOriginExists(target, filters) {
	return (await runRetrieval({
		...target,
		...filters,
		kind: "origin-exists"
	}, { inputBytes: originReadBytes(target, filters) }, "origin existence")).exists;
}
async function runMemoryIndexedOriginKeys(target) {
	return (await runRetrieval({
		...target,
		kind: "origin-index-keys"
	}, { inputBytes: originReadBytes(target) }, "indexed origin keys")).keys;
}
async function prewarmMemorySearchWorker() {
	ensureSqliteLibrarySelected();
	await retrieval.run({ kind: "prewarm" }, {});
}
async function runMemoryIndexState(target, signal) {
	return (await runRetrieval({
		...target,
		kind: "index-state"
	}, { signal }, "index state")).state;
}
async function runMemoryRecallMetadata(target, query, signal) {
	return runRetrieval({
		...target,
		kind: "recall-metadata",
		...query
	}, {
		signal,
		inputBytes: query.candidates.reduce((bytes, entry) => bytes + (entry.id.length + entry.path.length + entry.source.length) * 2, 0)
	}, "recall metadata");
}
async function runMemoryCuratedCandidates(target, query) {
	return runRetrieval({
		...target,
		kind: "curated",
		...query
	}, { inputBytes: query.activeProjectKeys?.reduce((bytes, key) => bytes + key.length * 2, 0) ?? 0 }, "curated candidates");
}
async function runMemoryPresenceInspection(databasePath) {
	return (await runRetrieval({
		kind: "presence",
		databasePath
	}, { inputBytes: databasePath.length * 2 }, "presence")).present;
}
async function runMemoryKeywordSearch(target, query, signal, includeIndexState = false) {
	return runRetrieval({
		...target,
		kind: "keyword",
		query,
		includeIndexState
	}, {
		signal,
		inputBytes: 2 * (query.body.query.length + (query.body.rankingQuery?.length ?? 0) + query.path.query.length + (query.path.exactPathQuery?.length ?? 0))
	}, "keyword");
}
async function runMemoryVectorFallback(target, query, signal) {
	return (await runRetrieval({
		...target,
		kind: "vector",
		query
	}, {
		signal,
		inputBytes: query.queryVec.length * 8
	}, "vector")).rows;
}
async function prepareMemoryIndexInWorker(input) {
	let inputBytes = input.content.length * 2 + (input.entry.lineMap?.length ?? 0) * 8;
	for (const provenance of input.entry.lineProvenance ?? []) inputBytes += 32 + 2 * (provenance.originClass.length + provenance.sessionKind.length + (provenance.supersedesKey?.length ?? 0));
	const result = await indexing.run({
		kind: "prepare",
		input
	}, { inputBytes });
	if (result.kind !== "prepared") throw new Error("Invalid memory indexing worker result");
	return result.value;
}
/** Startup scans use the background indexing pool under the shared compute limit. */
async function readMemoryTranscriptStatsInWorker(scopes) {
	if (scopes.length === 0) return [];
	ensureSqliteLibrarySelected();
	const env = {
		OPENCLAW_STATE_DIR: resolveStateDir(),
		OPENCLAW_SUPERVISOR_MODE: process.env.OPENCLAW_SUPERVISOR_MODE
	};
	const result = await indexing.run({
		kind: "transcript-stats",
		scopes,
		env
	}, { inputBytes: 2 * (JSON.stringify(scopes).length + JSON.stringify(env).length) });
	if (result.kind !== "transcript-stats") throw new Error("Invalid memory transcript stats worker result");
	return result.stats;
}
//#endregion
export { runMemoryForgetIndexPlan as a, runMemoryKeywordSearch as c, runMemoryPresenceInspection as d, runMemoryRecallMetadata as f, runMemoryCuratedCandidates as i, runMemoryOriginExists as l, runMemoryVectorFallback as m, prewarmMemorySearchWorker as n, runMemoryIndexState as o, runMemoryTombstoneRows as p, readMemoryTranscriptStatsInWorker as r, runMemoryIndexedOriginKeys as s, prepareMemoryIndexInWorker as t, runMemoryOriginRows as u };
