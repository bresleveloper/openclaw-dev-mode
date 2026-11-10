import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as normalizeDiagnosticWorkerScript } from "./worker-diagnostic-script-DtBjzxq1.mjs";
import { n as runWithMainThreadTask } from "./main-thread-stall-BJxVH-It.mjs";
import { i as workerMessagePayloadBytes, n as observeWorkerMessage, r as recordWorkerMessage } from "./worker-message-metrics-CcNXClPZ.mjs";
import { fileURLToPath } from "node:url";
import { basename } from "node:path";
import { MessagePort, Worker, isMainThread } from "node:worker_threads";
import { setFlagsFromString } from "node:v8";
//#region worker-heap-flag.mjs
const startupFlags = `${process.execArgv.join(" ")} ${process.env.NODE_OPTIONS ?? ""}`;
const heapFlag = /--max[-_](?:old[-_]space[-_]size(?:[-_]percentage)?|heap[-_]size)(?:=|\s)/u;
const immutableFlags = /--(?:freeze[-_]flags[-_]after[-_]init|(?:abort|exit)[-_]on[-_]contradictory[-_]flags)(?:=(?:true|1))?(?:\s|$)/u;
if (isMainThread && !process.versions.bun && heapFlag.test(startupFlags)) {
	if (immutableFlags.test(startupFlags)) process.emitWarning("V8 startup flags prevent enforcing per-worker heap limits.");
	else setFlagsFromString("--max-old-space-size=0 --max-heap-size=0");
}
//#endregion
//#region src/infra/worker-cpu.ts
function workerScriptName(filename, evalSource = false) {
	if (evalSource || filename instanceof URL && filename.protocol !== "file:") return "other";
	const name = basename(filename instanceof URL ? fileURLToPath(filename) : filename).replace(/\.[cm]?[jt]s$/u, ".js");
	return normalizeDiagnosticWorkerScript(name);
}
const trackedWorkers = resolveGlobalSingleton(Symbol.for("openclaw.workerCpuSources"), () => {
	process.on("worker", trackWorker);
	return {
		gcObserver: void 0,
		revision: 0,
		nextPoolId: 0,
		poolIds: /* @__PURE__ */ new WeakMap(),
		workers: /* @__PURE__ */ new Map(),
		lifecycle: /* @__PURE__ */ new Map()
	};
});
function createCpuTrackedWorker(...args) {
	const worker = runWithMainThreadTask(`worker:${workerScriptName(args[0], args[1]?.eval)}`, () => new Worker(...args));
	trackNativeWorkerForCpu(worker, args[0], args[1]?.eval);
	trackedWorkers.workers.get(worker).internalMessages = true;
	return worker;
}
/** Register a physical child only after its native lifetime owner confirms construction. */
function trackNativeWorkerForCpu(worker, filename, evalSource = false) {
	trackWorker(worker);
	const source = trackedWorkers.workers.get(worker);
	source.script = workerScriptName(filename, evalSource);
	if (source.script === "code-mode-node.worker.js" && source.workerSlot === void 0) {
		const occupied = new Set([...trackedWorkers.workers.values()].map((entry) => entry.workerSlot));
		for (let slot = 1; slot <= 64; slot++) if (!occupied.has(slot)) {
			source.workerSlot = slot;
			break;
		}
	}
	source.lifecycleMessages = source.script === "openclaw-state-lease-heartbeat.worker.js" || source.script === "gateway-state-owner-heartbeat.worker.js";
}
/** Pool identity follows its live Workers without retaining the pool itself. */
function attributeWorkerToPool(worker, pool) {
	const source = trackedWorkers.workers.get(worker);
	if (!source) return;
	let poolId = trackedWorkers.poolIds.get(pool);
	if (poolId === void 0) {
		poolId = ++trackedWorkers.nextPoolId;
		trackedWorkers.poolIds.set(pool, poolId);
	}
	source.poolId = poolId;
}
/** A bounded census of live pools, including Workers whose retirement is pending. */
function getTrackedWorkerPoolSnapshot() {
	pruneExitedWorkers();
	const pools = /* @__PURE__ */ new Map();
	for (const source of trackedWorkers.workers.values()) {
		if (source.poolId === void 0) continue;
		const pool = pools.get(source.poolId);
		if (pool) pool.workerCount++;
		else pools.set(source.poolId, {
			poolId: source.poolId,
			script: source.script,
			workerCount: 1
		});
	}
	return {
		workerCount: trackedWorkers.workers.size,
		workerPoolCount: pools.size,
		workerPools: [...pools.values()].toSorted((a, b) => b.workerCount - a.workerCount || a.poolId - b.poolId).slice(0, 100)
	};
}
function forgetWorker(worker) {
	const source = trackedWorkers.workers.get(worker);
	if (!source) return;
	const counts = countWorkerStart(source);
	const reason = source.retirementReason ?? "exit";
	counts.retired.set(reason, (counts.retired.get(reason) ?? 0) + 1);
	source.memoryPort?.close();
	trackedWorkers.workers.delete(worker);
	trackedWorkers.revision++;
}
function countWorkerStart(source) {
	let counts = trackedWorkers.lifecycle.get(source.script);
	if (!counts) {
		counts = {
			started: 0,
			retired: /* @__PURE__ */ new Map()
		};
		trackedWorkers.lifecycle.set(source.script, counts);
	}
	if (!source.started) {
		source.started = true;
		counts.started++;
	}
	return counts;
}
/** Record the owner's reason now; only confirmed native exit increments retirement. */
function markWorkerRetirement(worker, reason) {
	const source = trackedWorkers.workers.get(worker);
	if (source) source.retirementReason ??= reason;
}
function canObserveWorkerMessages(worker) {
	if (!Object.isExtensible(worker)) return false;
	for (const method of ["postMessage", "emit"]) {
		let owner = worker;
		while (owner) {
			const descriptor = Object.getOwnPropertyDescriptor(owner, method);
			if (descriptor) {
				if (!descriptor.writable || typeof descriptor.value !== "function") return false;
				break;
			}
			owner = Reflect.getPrototypeOf(owner);
		}
		if (!owner) return false;
	}
	return true;
}
function trackWorker(worker) {
	if (trackedWorkers.workers.has(worker)) return;
	if (isMainThread && worker instanceof Worker) recordWorkerMessage("lifecycle", "to_worker");
	if (isMainThread && worker instanceof Worker && canObserveWorkerMessages(worker)) {
		const nativePrototype = Object.getPrototypeOf(worker) === Worker.prototype;
		const postMessage = !nativePrototype || Object.hasOwn(worker, "postMessage") ? worker.postMessage : void 0;
		worker.postMessage = function(value, transferList) {
			const bytes = source.internalMessages ? workerMessagePayloadBytes(value) : void 0;
			(postMessage ?? Worker.prototype.postMessage).call(this, value, transferList);
			if (source.lifecycleMessages) recordWorkerMessage("lifecycle", "to_worker", bytes);
			else if (source.internalMessages) observeWorkerMessage(value, "to_worker", "other", bytes ?? null);
			else recordWorkerMessage("other", "to_worker");
		};
		const emit = !nativePrototype || Object.hasOwn(worker, "emit") ? worker.emit : void 0;
		worker.emit = function(event, ...args) {
			if (event === "message") {
				if (source.lifecycleMessages) recordWorkerMessage("lifecycle", "from_worker", workerMessagePayloadBytes(args[0]));
				else if (source.internalMessages) observeWorkerMessage(args[0], "from_worker");
				else recordWorkerMessage("other", "from_worker");
			}
			return (emit ?? Worker.prototype.emit).call(this, event, ...args);
		};
	}
	let pending = false;
	const source = {
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
	};
	trackedWorkers.workers.set(worker, source);
	queueMicrotask(() => countWorkerStart(source));
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
	const previous = source.heap;
	try {
		const heap = await worker.getHeapStatistics();
		if (source.heap === previous) {
			source.heap = {
				value: {
					heapUsed: heap.used_heap_size,
					heapTotal: heap.total_heap_size,
					external: heap.external_memory,
					heapSizeLimitBytes: process.versions.bun ? void 0 : heap.heap_size_limit
				},
				sampledAt: performance.now()
			};
			source.memoryUnavailable = false;
		}
	} catch {
		source.memoryUnavailable = true;
	} finally {
		source.heapPending = false;
	}
}
/** Heartbeat demand also applies to workers attaching after observer activation. */
function setTrackedWorkerGcObserver(observer) {
	const wasEnabled = Boolean(trackedWorkers.gcObserver);
	trackedWorkers.gcObserver = observer;
	const enabled = Boolean(observer);
	if (wasEnabled !== enabled) {
		for (const source of trackedWorkers.workers.values()) if (source.memoryPort) {
			source.memoryPort.postMessage({ gc: enabled }, []);
			recordWorkerMessage("memory", "to_worker", 1);
		}
	}
}
/** The existing registry owns this channel until native exit, never the submitting task. */
function receiveWorkerMemoryPort(worker, message) {
	if (!isRecord(message) || message.status !== "memory" || !(message.port instanceof MessagePort)) return false;
	const port = message.port;
	const source = trackedWorkers.workers.get(worker);
	if (!source || source.memoryPort || worker.threadId === -1) {
		port.close();
		return true;
	}
	source.memoryPort = port;
	source.memoryPending = true;
	const close = () => {
		source.memoryPort = void 0;
		source.memoryPending = false;
		source.memoryUnavailable = true;
		port.close();
	};
	port.on("message", (record) => {
		recordWorkerMessage("memory", "from_worker", ("heapUsed" in record ? 32 + (record.heapSizeLimitBytes === void 0 ? 0 : 8) : 0) + (record.gc?.length ?? 0) * 8);
		if (record.gc) trackedWorkers.gcObserver?.(record.gc, source.script, source.workerSlot);
		if (!("heapUsed" in record)) return;
		delete record.gc;
		source.heap = {
			value: record,
			sampledAt: performance.now()
		};
		source.memoryPending = false;
		source.memoryUnavailable = false;
	});
	port.once("close", close);
	port.once("messageerror", close);
	port.unref();
	if (trackedWorkers.gcObserver) {
		port.postMessage({ gc: true });
		recordWorkerMessage("memory", "to_worker", 1);
	}
	return true;
}
/** Read lifecycle counters without requesting native CPU or heap interrupts. */
function getTrackedWorkerLifecycleSnapshot() {
	pruneExitedWorkers();
	return {
		workerCount: trackedWorkers.workers.size,
		workerLifecycle: [...trackedWorkers.lifecycle].map(([script, counts]) => ({
			script,
			started: counts.started,
			retired: [...counts.retired].map(([reason, count]) => ({
				reason,
				count
			}))
		}))
	};
}
/** Read completed samples without blocking the heartbeat on a busy native isolate. */
function sampleTrackedWorkerMemory() {
	const workerHeaps = [];
	const workerMemoryMissing = [];
	const memory = {
		...getTrackedWorkerLifecycleSnapshot(),
		workerHeapSampledCount: 0,
		workerHeapTotalBytes: 0,
		workerHeapUsedBytes: 0,
		workerExternalBytes: 0,
		workerArrayBuffersBytes: 0,
		workerArrayBuffersSampledCount: 0,
		workerMemoryScope: "direct",
		workerMemoryMissing,
		workerHeaps
	};
	for (const [worker, source] of trackedWorkers.workers) {
		const sampleAgeMs = source.heap ? performance.now() - source.heap.sampledAt : void 0;
		if (source.heap && sampleAgeMs !== void 0 && sampleAgeMs < 6e4) {
			memory.workerHeapSampledCount++;
			memory.workerHeapTotalBytes += source.heap.value.heapTotal;
			memory.workerHeapUsedBytes += source.heap.value.heapUsed;
			memory.workerExternalBytes += source.heap.value.external;
			if (source.heap.value.arrayBuffers !== void 0) {
				memory.workerArrayBuffersSampledCount++;
				memory.workerArrayBuffersBytes += source.heap.value.arrayBuffers;
			}
			memory.workerHeaps.push({
				script: source.script,
				threadId: worker.threadId,
				workerSlot: source.workerSlot,
				...source.heap.value,
				sampleAgeMs: Math.round(sampleAgeMs)
			});
		} else memory.workerMemoryMissing.push({
			script: source.script,
			threadId: worker.threadId,
			reason: source.heap ? "stale" : source.memoryUnavailable ? "unavailable" : "pending"
		});
		if (source.memoryPort) {
			if (!source.memoryPending) {
				source.memoryPending = true;
				try {
					source.memoryPort.postMessage(void 0, []);
					recordWorkerMessage("memory", "to_worker", 0);
				} catch {
					source.memoryPort.close();
					source.memoryPort = void 0;
					source.memoryPending = false;
					source.memoryUnavailable = true;
				}
			}
		}
		if (!source.heapPending && (!source.memoryPort || source.heap?.value.arrayBuffers === void 0 || sampleAgeMs !== void 0 && sampleAgeMs >= 6e4)) refreshWorkerHeap(worker, source);
	}
	const heapUnavailable = memory.workerCount > 0 && memory.workerHeapSampledCount === 0;
	const buffersUnavailable = memory.workerCount > 0 && memory.workerArrayBuffersSampledCount === 0;
	const workerMemoryCoverage = heapUnavailable ? "unavailable" : memory.workerArrayBuffersSampledCount < memory.workerCount ? "partial" : "complete";
	return {
		...memory,
		workerMemoryCoverage,
		workerHeapTotalBytes: heapUnavailable ? void 0 : memory.workerHeapTotalBytes,
		workerHeapUsedBytes: heapUnavailable ? void 0 : memory.workerHeapUsedBytes,
		workerExternalBytes: heapUnavailable ? void 0 : memory.workerExternalBytes,
		workerArrayBuffersBytes: buffersUnavailable ? void 0 : memory.workerArrayBuffersBytes
	};
}
//#endregion
export { getTrackedWorkerPoolSnapshot as a, sampleTrackedWorkerMemory as c, getTrackedWorkerLifecycleSnapshot as i, setTrackedWorkerGcObserver as l, createCpuTrackedWorker as n, markWorkerRetirement as o, getTrackedWorkerCpuSources as r, receiveWorkerMemoryPort as s, attributeWorkerToPool as t, trackNativeWorkerForCpu as u };
