import { D as isRecord, S as resolveGlobalSingleton, i as asNonNegativeFiniteNumber } from "./number-coercion-CmpLVzZ6.mjs";
import "./src-DTVzOLXp.mjs";
import "./signal-exit-barrier-DMMQkzCa.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-Dgz2IR4T.mjs";
import { setFlagsFromString } from "node:v8";
import path, { basename } from "node:path";
import { fileURLToPath } from "node:url";
import { AsyncLocalStorage } from "node:async_hooks";
import { MessagePort, Worker, isMainThread } from "node:worker_threads";
//#region src/infra/runtime-worker-generation.ts
const scope = resolveGlobalSingleton(Symbol.for("openclaw.runtimeWorkerGeneration"), () => new AsyncLocalStorage());
/** Capture before queues or detached pool contexts discard the caller's scope. */
function captureRuntimeWorkerSource(url) {
	const generation = scope.getStore()?.generation;
	const bound = generation?.resolve(url);
	return bound && bound.href !== url.href ? {
		moduleUrl: bound,
		runtimeGeneration: generation
	} : { moduleUrl: url };
}
//#endregion
//#region worker-heap-flag.mjs
const startupFlags = `${process.execArgv.join(" ")} ${process.env.NODE_OPTIONS ?? ""}`;
const heapFlag = /--max[-_](?:old[-_]space[-_]size(?:[-_]percentage)?|heap[-_]size)(?:=|\s)/u;
const immutableFlags = /--(?:freeze[-_]flags[-_]after[-_]init|abort[-_]on[-_]contradictory[-_]flags)(?:=(?:true|1))?(?:\s|$)/u;
if (isMainThread && !process.versions.bun && heapFlag.test(startupFlags)) {
	if (immutableFlags.test(startupFlags)) process.emitWarning("V8 startup flags prevent enforcing per-worker heap limits.");
	else setFlagsFromString("--max-old-space-size=0 --max-heap-size=0");
}
//#endregion
//#region src/infra/worker-diagnostic-script.ts
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
	"session-history.worker.js",
	"audio-worker.runtime.js",
	"realtime-quicksilver-audio.worker.js",
	"realtime-quicksilver-socket.worker.js",
	"telegram-ingress-worker.runtime.js"
]);
/** Imported diagnostics may contain arbitrary paths or names. Preserve only known scripts. */
function normalizeDiagnosticWorkerScript(value) {
	return typeof value === "string" && workerScriptNames.has(value) ? value : "other";
}
//#endregion
//#region src/infra/worker-cpu.ts
function workerScriptName(filename, evalSource = false) {
	if (evalSource || filename instanceof URL && filename.protocol !== "file:") return "other";
	return normalizeDiagnosticWorkerScript(basename(filename instanceof URL ? fileURLToPath(filename) : filename).replace(/\.[cm]?ts$/u, ".js"));
}
const trackedWorkers = resolveGlobalSingleton(Symbol.for("openclaw.workerCpuSources"), () => {
	process.on("worker", trackWorker);
	return {
		revision: 0,
		nextPoolId: 0,
		poolIds: /* @__PURE__ */ new WeakMap(),
		workers: /* @__PURE__ */ new Map(),
		lifecycle: /* @__PURE__ */ new Map()
	};
});
function createCpuTrackedWorker(...args) {
	const worker = new Worker(...args);
	trackWorker(worker);
	trackedWorkers.workers.get(worker).script = workerScriptName(args[0], args[1]?.eval);
	return worker;
}
/** Register a physical child only after its native lifetime owner confirms construction. */
function trackNativeWorkerForCpu(worker, filename, evalSource = false) {
	trackWorker(worker);
	trackedWorkers.workers.get(worker).script = workerScriptName(filename, evalSource);
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
function trackWorker(worker) {
	if (trackedWorkers.workers.has(worker)) return;
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
	port.on("message", (value) => {
		const record = isRecord(value) ? value : {};
		const heapUsed = asNonNegativeFiniteNumber(record.heapUsed);
		const heapTotal = asNonNegativeFiniteNumber(record.heapTotal);
		const external = asNonNegativeFiniteNumber(record.external);
		const arrayBuffers = asNonNegativeFiniteNumber(record.arrayBuffers);
		if (heapUsed === void 0 || heapTotal === void 0 || external === void 0 || arrayBuffers === void 0) {
			close();
			return;
		}
		source.heap = {
			value: {
				heapUsed,
				heapTotal,
				external,
				arrayBuffers
			},
			sampledAt: performance.now()
		};
		source.memoryPending = false;
		source.memoryUnavailable = false;
	});
	port.once("close", close);
	port.once("messageerror", close);
	port.unref();
	return true;
}
//#endregion
//#region src/infra/agent-database-readers.ts
const readers = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseReaders"), () => ({
	closers: /* @__PURE__ */ new Set(),
	deleted: /* @__PURE__ */ new Map()
}));
/** Match captured read custody without inspecting files or inferring their owners. */
function matchesAgentDatabaseReadCandidatePath(candidate, pathname) {
	const capturedPath = path.resolve(candidate.path);
	const resolvedPath = path.resolve(pathname);
	if (capturedPath === resolvedPath) return true;
	if (candidate.scope !== "sibling-family") return false;
	const captured = path.parse(capturedPath);
	const selected = path.parse(resolvedPath);
	return selected.dir === captured.dir && selected.base.startsWith(`${captured.name}.`) && selected.base.endsWith(captured.ext);
}
/** Every cache that retains agent database connections registers once per isolate. */
function registerAgentDatabaseReaderCloser(closer) {
	readers.closers.add(closer);
	return () => {
		readers.closers.delete(closer);
	};
}
/** Task admission carries the parent owner's current fences into every worker generation. */
function captureDeletedAgentDatabaseFences() {
	return [...readers.deleted];
}
//#endregion
//#region packages/worker-runtime/src/retained-operation.ts
/** One producer settlement serves awaited callers and its named synchronous consumer. */
function createRetainedOperation(service, options = {}) {
	const completion = Promise.withResolvers();
	let outcome = Object.freeze({ status: "pending" });
	if (options.observeRejection !== false) completion.promise.catch(() => void 0);
	return {
		operation: {
			result: completion.promise,
			read: () => outcome,
			service
		},
		resolve(value) {
			if (outcome.status !== "pending") return;
			outcome = Object.freeze({
				status: "fulfilled",
				value
			});
			completion.resolve(value);
		},
		reject(error) {
			if (outcome.status !== "pending") return;
			outcome = Object.freeze({
				status: "rejected",
				error
			});
			completion.reject(error);
		}
	};
}
/** Transform settled facts without making Promise reactions part of their progress. */
function mapRetainedOperation(source, receive) {
	const inContext = AsyncLocalStorage.snapshot();
	let servicing = false;
	const serviceInContext = () => inContext(service);
	const completion = createRetainedOperation(serviceInContext);
	function service() {
		if (servicing || completion.operation.read().status !== "pending") return;
		servicing = true;
		try {
			source.service();
			const outcome = source.read();
			if (outcome.status === "fulfilled") completion.resolve(receive(outcome.value));
			else if (outcome.status === "rejected") completion.reject(outcome.error);
		} catch (error) {
			completion.reject(error);
		} finally {
			servicing = false;
		}
	}
	source.result.then(serviceInContext, serviceInContext);
	completion.operation.service();
	return completion.operation;
}
/** Sequence operations while retaining the continuation's captured caller context. */
function flatMapRetainedOperation(source, next) {
	return flatMapRetainedOutcome(source, (outcome) => {
		if (outcome.status === "rejected") throw outcome.error;
		return next(outcome.value);
	});
}
/** Final-only recovery joins the owner's successor rather than replaying the failed operation. */
function flatMapRetainedOutcome(source, next) {
	const inContext = AsyncLocalStorage.snapshot();
	let child;
	let servicing = false;
	const serviceInContext = () => inContext(service);
	const completion = createRetainedOperation(serviceInContext);
	function service() {
		if (servicing || completion.operation.read().status !== "pending") return;
		servicing = true;
		try {
			if (!child) {
				let outcome;
				try {
					source.service();
					outcome = source.read();
				} catch (error) {
					outcome = {
						status: "rejected",
						error
					};
				}
				if (outcome.status === "pending") return;
				child = next(outcome);
				child.result.then(serviceInContext, serviceInContext);
			}
			child.service();
			const outcome = child.read();
			if (outcome.status === "fulfilled") completion.resolve(outcome.value);
			else if (outcome.status === "rejected") completion.reject(outcome.error);
		} catch (error) {
			completion.reject(error);
		} finally {
			servicing = false;
		}
	}
	source.result.then(serviceInContext, serviceInContext);
	completion.operation.service();
	return completion.operation;
}
//#endregion
export { matchesAgentDatabaseReadCandidatePath as a, createCpuTrackedWorker as c, trackNativeWorkerForCpu as d, captureRuntimeWorkerSource as f, captureDeletedAgentDatabaseFences as i, markWorkerRetirement as l, flatMapRetainedOperation as n, registerAgentDatabaseReaderCloser as o, mapRetainedOperation as r, attributeWorkerToPool as s, createRetainedOperation as t, receiveWorkerMemoryPort as u };
