import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-DazJcPEG.mjs";
import { fileURLToPath } from "node:url";
import { basename } from "node:path";
import { Worker } from "node:worker_threads";
//#region src/infra/worker-cpu.ts
const workerScriptNames = /* @__PURE__ */ new Set([
	...Object.values(runtimeProcessEntrypoints).map((entry) => basename(entry.distWorkerPath)),
	"catalog-page.worker.js",
	"code-mode.worker.js",
	"compaction-planning.worker.js",
	"disk-budget.worker.js",
	"document-extractor.worker.js",
	"manager-index.worker.js",
	"manager-search.worker.js",
	"memory-index.worker.js",
	"memory-search.worker.js",
	"session-history.worker.js"
]);
function workerScriptName(filename, evalSource = false) {
	if (evalSource || filename instanceof URL && filename.protocol !== "file:") return "other";
	const name = basename(filename instanceof URL ? fileURLToPath(filename) : filename).replace(/\.[cm]?ts$/u, ".js");
	return workerScriptNames.has(name) ? name : "other";
}
const trackedWorkers = resolveGlobalSingleton(Symbol.for("openclaw.workerCpuSources"), () => {
	process.on("worker", trackWorker);
	return {
		revision: 0,
		workers: /* @__PURE__ */ new Map()
	};
});
function createCpuTrackedWorker(...args) {
	const worker = new Worker(...args);
	trackWorker(worker);
	trackedWorkers.workers.get(worker).script = workerScriptName(args[0], args[1]?.eval);
	return worker;
}
function forgetWorker(worker) {
	if (trackedWorkers.workers.delete(worker)) trackedWorkers.revision++;
}
function trackWorker(worker) {
	if (trackedWorkers.workers.has(worker)) return;
	let pending = false;
	trackedWorkers.workers.set(worker, {
		script: "other",
		async cpuUsage() {
			if (pending) return;
			pending = true;
			try {
				return await worker.cpuUsage();
			} catch {
				return;
			} finally {
				pending = false;
			}
		}
	});
	trackedWorkers.revision++;
	worker.once("exit", () => forgetWorker(worker));
}
function pruneExitedWorkers() {
	for (const worker of trackedWorkers.workers.keys()) if (worker.threadId === -1) forgetWorker(worker);
}
function getTrackedWorkerCpuSources() {
	pruneExitedWorkers();
	return {
		revision: trackedWorkers.revision,
		workers: [...trackedWorkers.workers.values()]
	};
}
async function refreshWorkerHeap(worker, source) {
	source.heapPending = true;
	try {
		source.heap = {
			value: await worker.getHeapStatistics(),
			sampledAt: performance.now()
		};
	} catch {
		source.heap = void 0;
	} finally {
		source.heapPending = false;
	}
}
/** Read completed samples without blocking the heartbeat on a busy native isolate. */
function sampleTrackedWorkerMemory() {
	pruneExitedWorkers();
	const memory = {
		workerCount: trackedWorkers.workers.size,
		workerHeapSampledCount: 0,
		workerHeapTotalBytes: 0,
		workerHeapUsedBytes: 0,
		workerHeaps: []
	};
	for (const [worker, source] of trackedWorkers.workers) {
		if (source.heap && performance.now() - source.heap.sampledAt < 6e4) {
			memory.workerHeapSampledCount++;
			memory.workerHeapTotalBytes += source.heap.value.total_heap_size;
			memory.workerHeapUsedBytes += source.heap.value.used_heap_size;
			memory.workerHeaps.push({
				script: source.script,
				heapUsed: source.heap.value.used_heap_size,
				heapTotal: source.heap.value.total_heap_size
			});
		}
		if (!source.heapPending) refreshWorkerHeap(worker, source);
	}
	return memory;
}
//#endregion
export { getTrackedWorkerCpuSources as n, sampleTrackedWorkerMemory as r, createCpuTrackedWorker as t };
