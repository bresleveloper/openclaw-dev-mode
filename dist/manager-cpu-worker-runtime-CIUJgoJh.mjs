import { t as ensureSqliteLibrarySelected } from "./bun-sqlite-library-GOquVAYK.mjs";
import { r as resolveRuntimeWorkerUrl } from "./runtime-worker-url-B4o9tqvO.mjs";
import { t as WorkerTaskPool } from "./worker-task-pool-cppt7dT0.mjs";
import "./memory-core-host-engine-knn-Dps9fjJT.mjs";
import { t as memoryCpuProcessEntrypoints } from "./manager-cpu-entrypoints-bJosRUx9.mjs";
import "./process-runtime-BF3dUvYO.mjs";
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
async function runMemoryIndexState(target, signal) {
	ensureSqliteLibrarySelected();
	const result = await retrieval.run({
		...target,
		kind: "index-state"
	}, { signal });
	if (result.kind !== "index-state") throw new Error("Invalid memory index state worker result");
	return result.state;
}
async function runMemoryRecallMetadata(target, query, signal) {
	ensureSqliteLibrarySelected();
	const result = await retrieval.run({
		...target,
		kind: "recall-metadata",
		...query
	}, {
		signal,
		inputBytes: query.candidates.reduce((bytes, entry) => bytes + (entry.id.length + entry.path.length + entry.source.length) * 2, 0)
	});
	if (result.kind !== "recall-metadata") throw new Error("Invalid memory recall metadata worker result");
	return result;
}
async function runMemoryCuratedCandidates(target, query) {
	ensureSqliteLibrarySelected();
	const result = await retrieval.run({
		...target,
		kind: "curated",
		...query
	}, { inputBytes: query.activeProjectKeys?.reduce((bytes, key) => bytes + key.length * 2, 0) ?? 0 });
	if (result.kind !== "curated") throw new Error("Invalid memory curated candidates worker result");
	return result;
}
async function runMemoryPresenceInspection(databasePath) {
	ensureSqliteLibrarySelected();
	const result = await retrieval.run({
		kind: "presence",
		databasePath
	}, { inputBytes: databasePath.length * 2 });
	if (result.kind !== "presence") throw new Error("Invalid memory presence worker result");
	return result.present;
}
async function runMemoryKeywordSearch(target, query, signal, includeIndexState = false) {
	ensureSqliteLibrarySelected();
	const result = await retrieval.run({
		...target,
		kind: "keyword",
		query,
		includeIndexState
	}, {
		signal,
		inputBytes: 2 * (query.body.query.length + (query.body.rankingQuery?.length ?? 0) + query.path.query.length + (query.path.exactPathQuery?.length ?? 0))
	});
	if (result.kind !== "keyword") throw new Error("Invalid memory keyword worker result");
	return result;
}
async function runMemoryVectorFallback(target, query, signal) {
	ensureSqliteLibrarySelected();
	const result = await retrieval.run({
		...target,
		kind: "vector",
		query
	}, {
		signal,
		inputBytes: query.queryVec.length * 8
	});
	if (result.kind !== "vector") throw new Error("Invalid memory vector worker result");
	return result.rows;
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
//#endregion
export { runMemoryPresenceInspection as a, runMemoryKeywordSearch as i, runMemoryCuratedCandidates as n, runMemoryRecallMetadata as o, runMemoryIndexState as r, runMemoryVectorFallback as s, prepareMemoryIndexInWorker as t };
