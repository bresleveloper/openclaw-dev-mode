import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-CvMrvFI1.mjs";
import { a as ensureSqliteLibrarySelected } from "./bun-sqlite-library-CYR1RYZS.mjs";
import { t as WorkerTaskPool } from "./worker-task-pool-D6ogd941.mjs";
import "./memory-core-host-engine-knn--De7HW1q.mjs";
import { n as sessionIndexPages } from "./manager-session-index-preparation-CMSNOXGU.mjs";
import { t as memoryCpuProcessEntrypoints } from "./manager-cpu-entrypoints-CUaNAvfp.mjs";
import "./process-runtime-CG9_3L3N.mjs";
import "./memory-core-host-engine-foundation-Cj49LzJw.mjs";
//#region extensions/memory-core/src/memory/manager-cpu-worker-runtime.ts
const MEMORY_INDEX_WORKER_INPUT_LIMIT_BYTES = 268435456;
const retrieval = new WorkerTaskPool({
	workerUrl: resolveRuntimeWorkerUrl(memoryCpuProcessEntrypoints.search),
	workerClass: "reader",
	sharedCompute: true
});
const indexing = new WorkerTaskPool({
	workerUrl: resolveRuntimeWorkerUrl(memoryCpuProcessEntrypoints.index),
	workerClass: "compute",
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
async function runMemoryOriginRead(request) {
	return runRetrieval(request, { inputBytes: 2 * (request.agentId.length + request.databasePath.length + request.stateDir.length + (request.entryKeys?.reduce((bytes, key) => bytes + key.length, 0) ?? 0) + (request.sessionIds?.reduce((bytes, key) => bytes + key.length, 0) ?? 0)) }, {
		"origin-rows": "origin rows",
		"session-tombstones": "tombstone rows"
	}[request.kind]);
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
async function runMemoryDatabaseAdmission(target) {
	return (await runRetrieval({
		...target,
		kind: "admission"
	}, {}, "database admission")).admission;
}
async function runMemoryStatus(target, query) {
	return (await runRetrieval({
		...target,
		kind: "status",
		query
	}, {}, "status")).snapshot;
}
async function runMemoryVectorLoad(target, extensionPath) {
	if (!target?.agentId || !target.path) throw new Error("Memory vector inspection requires its captured database target");
	const loaded = (await runRetrieval({
		agentId: target.agentId,
		databasePath: target.path,
		kind: "vector-load",
		extensionPath
	}, {}, "vector capability")).result;
	if (!loaded.ok || !loaded.extensionPath) throw new Error(loaded.error ?? "unknown sqlite-vec load error");
	return {
		extensionPath: loaded.extensionPath,
		retiredLegacy: false
	};
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
async function runMemoryIndexRead(target, command) {
	const result = await runRetrieval({
		...target,
		kind: "index-read",
		command
	}, { inputBytes: JSON.stringify(command).length * 2 }, "index read");
	if (result.read.type !== command.type) throw new Error("Memory index reader returned another operation");
	return result.read.value;
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
		inputBytes: 2 * (query.body.query.length + query.path.query.length)
	}, "keyword");
}
async function runMemoryVectorFallback(target, query, signal) {
	return (await runRetrieval({
		...target,
		kind: "vector",
		query
	}, {
		signal,
		inputBytes: query.queryVec.length * 8 + (query.candidateIds?.reduce((bytes, id) => bytes + id.length * 2, 0) ?? 0)
	}, "vector")).rows;
}
async function prepareMemoryIndexInWorker(input) {
	let inputBytes = input.content.length * 2 + (input.entry.lineMap?.length ?? 0) * 8;
	for (const provenance of input.entry.lineProvenance ?? []) inputBytes += 32 + 2 * (provenance.originClass.length + provenance.sessionKind.length + (provenance.supersedesKey?.length ?? 0));
	if (input.source === "sessions") {
		const pages = sessionIndexPages(input);
		const chunks = [];
		const { content: _content, entry, cutoffLine, ...settings } = input;
		const cutoffIndex = cutoffLine === void 0 ? -1 : entry.lineMap?.findIndex((line) => line >= cutoffLine) ?? -1;
		if ((await indexing.run({
			kind: "prepare-session",
			input: {
				...settings,
				resetAtLine: cutoffIndex > 0 ? cutoffIndex + 1 : void 0,
				entry: {
					path: entry.path,
					mtimeMs: entry.mtimeMs
				}
			}
		}, {
			inputBytes: Math.min(inputBytes, MEMORY_INDEX_WORKER_INPUT_LIMIT_BYTES),
			onRequest: (value) => {
				const progress = value;
				for (const chunk of progress.chunks) chunks.push(chunk);
				return Promise.resolve({
					input: pages.next().value ?? {
						lines: [],
						done: true
					},
					timeoutMs: 6e4
				});
			}
		})).kind !== "prepared") throw new Error("Invalid memory indexing worker result");
		return {
			contentHash: void 0,
			chunks
		};
	}
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
export { runMemoryDatabaseAdmission as a, runMemoryIndexState as c, runMemoryPresenceInspection as d, runMemoryRecallMetadata as f, runMemoryVectorLoad as h, runMemoryCuratedCandidates as i, runMemoryKeywordSearch as l, runMemoryVectorFallback as m, prewarmMemorySearchWorker as n, runMemoryForgetIndexPlan as o, runMemoryStatus as p, readMemoryTranscriptStatsInWorker as r, runMemoryIndexRead as s, prepareMemoryIndexInWorker as t, runMemoryOriginRead as u };
