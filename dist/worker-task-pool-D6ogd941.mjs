import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as runInDetachedAsyncContext } from "./detached-async-context-D04NzekX.mjs";
import { r as resolveRuntimeWorkerThreadExecArgv } from "./runtime-worker-url-CvMrvFI1.mjs";
import { n as createCpuTrackedWorker, o as markWorkerRetirement, s as receiveWorkerMemoryPort, t as attributeWorkerToPool } from "./worker-cpu-c5lFIb1t.mjs";
import { r as recordWorkerMessage } from "./worker-message-metrics-CcNXClPZ.mjs";
import { V as trackSqliteDatabaseAdmissionWorker } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { n as captureDeletedAgentDatabaseFences } from "./agent-database-readers-DSwi8tar.mjs";
import { n as trackWorkerRequest, t as classifyWorkerRequest } from "./worker-request-diagnostics-BrY1pZl2.mjs";
import { i as workerRequestKind, r as createRetainedNativeWorker, t as captureRetainedNativeWorkerSource } from "./worker-native-lifecycle-BrCZRghB.mjs";
import { o as createWorkerComputeCapacity, t as WorkerTaskPoolCore } from "./src-NEpyeLp1.mjs";
import { a as resolveWorkerComputeLimit, o as resolveWorkerPoolSize } from "./worker-pool-sizing-9MNT4hxr.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { r as createSqliteDatabaseAdmissionRelay } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { n as liveWorkerTaskPools } from "./worker-task-pool-registry-D6q0YAmu.mjs";
import { MessageChannel } from "node:worker_threads";
//#region src/infra/worker-task-capacity.ts
/** All runtime chunks share the same host-owned computation budget. */
function getWorkerComputeCapacity() {
	return resolveGlobalSingleton(Symbol.for("openclaw.workerComputeCapacity"), () => createWorkerComputeCapacity(resolveWorkerComputeLimit()));
}
//#endregion
//#region src/infra/worker-task-host.ts
const diagnosticTaskKinds = /* @__PURE__ */ new Set([
	"prepare",
	"prepare-session",
	"transcript-stats",
	"session-entry",
	"session-entries",
	"session-cleanup",
	"session-memory-capture",
	"history-page",
	"historical-eviction-candidates",
	"usage-cost",
	"model-context",
	"context-messages",
	"transcript-search"
]);
const prepareResources = createLazyRuntimeModule(() => import("./temp-artifact-cleanup-s_jtCpQk.mjs"));
const admissions = resolveGlobalSingleton(Symbol.for("openclaw.workerTaskDatabaseAdmissionChannels"), () => /* @__PURE__ */ new Map());
function createWorkerTaskHost(owner = {}, workerClass) {
	const boundedHeap = workerClass && workerClass !== "writer" && workerClass !== "singleton";
	const source = owner.retainedTransport ? owner.nativeSource ?? captureRetainedNativeWorkerSource({ runtimeGeneration: void 0 }) : void 0;
	return {
		maxWorkers: workerClass ? resolveWorkerPoolSize(workerClass) : void 0,
		requiresReady: owner.retainedTransport,
		createWorker(url, options) {
			const workerOptions = {
				execArgv: resolveRuntimeWorkerThreadExecArgv(url),
				...options
			};
			if (boundedHeap) {
				const limits = workerOptions.resourceLimits;
				workerOptions.resourceLimits = {
					maxOldGenerationSizeMb: limits?.maxOldGenerationSizeMb ?? 512,
					maxYoungGenerationSizeMb: limits?.maxYoungGenerationSizeMb,
					codeRangeSizeMb: limits?.codeRangeSizeMb,
					stackSizeMb: limits?.stackSizeMb
				};
			}
			if (owner.retainedTransport) {
				const { port1, port2 } = new MessageChannel();
				const native = createRetainedNativeWorker(url, workerOptions, source, owner.nativeResource, {
					host: port1,
					worker: port2
				});
				return {
					worker: native,
					native
				};
			}
			return { worker: createCpuTrackedWorker(url, workerOptions) };
		},
		serviceNativeWorkers(workers) {
			for (const { owner: admission } of admissions.values()) admission.service();
			workers[0]?.service();
		},
		prepareResources,
		async releaseTemporaryDirectory(directory) {
			const { removeTemporaryArtifacts } = await prepareResources();
			await removeTemporaryArtifacts(directory, "Worker task");
		},
		captureTaskContext(worker) {
			let admission = admissions.get(worker);
			if (!admission) {
				admission = {
					owner: runInDetachedAsyncContext(() => createSqliteDatabaseAdmissionRelay(() => {
						if (admissions.get(worker)?.retiring !== false) throw new Error("SQLite creation relay's task worker is retiring");
					})),
					sent: false,
					retiring: false
				};
				admissions.set(worker, admission);
				const retained = admission;
				worker.once("exit", () => {
					retained.owner.finish();
					admissions.delete(worker);
				});
			}
			const context = {
				deletedAgentDatabaseFences: captureDeletedAgentDatabaseFences(),
				...!admission.sent ? { databaseAdmissionPort: admission.owner.port } : {}
			};
			admission.sent = true;
			return context;
		},
		taskContextTransferList(context) {
			const captured = context;
			return captured.databaseAdmissionPort ? [captured.databaseAdmissionPort] : [];
		},
		createTaskObserver(url) {
			const kind = workerRequestKind(url);
			return (operation) => trackWorkerRequest(kind, operation === void 0 ? "task" : classifyWorkerRequest(operation));
		},
		describeTask(url, input) {
			const kind = input !== null && typeof input === "object" ? Object.getOwnPropertyDescriptor(input, "kind")?.value : void 0;
			const operation = typeof kind === "string" && diagnosticTaskKinds.has(kind) ? kind : "task";
			return `${workerRequestKind(url)}.${operation}`;
		},
		receiveMessage: receiveWorkerMemoryPort,
		observeResourceReply: () => recordWorkerMessage("resource", "from_worker"),
		workerStarted(worker, pool) {
			if (owner.databaseAccess !== "read-only") trackSqliteDatabaseAdmissionWorker(worker);
			attributeWorkerToPool(worker, pool);
		},
		workerRetiring(worker, reason) {
			const admission = admissions.get(worker);
			if (admission) admission.retiring = true;
			markWorkerRetirement(worker, reason);
		},
		computeCapacity: getWorkerComputeCapacity(),
		pools: liveWorkerTaskPools
	};
}
//#endregion
//#region src/infra/worker-task-pool.ts
/** Existing SDK surface; task custody remains an internal capability. */
var WorkerTaskPool = class {
	constructor(options) {
		this.core = new WorkerTaskPoolCore(options, createWorkerTaskHost(void 0, options.workerClass), {
			close: (error) => this.close(error),
			getSnapshot: () => this.getSnapshot()
		});
	}
	run(input, options) {
		return this.core.run(input, options);
	}
	get isClosed() {
		return this.core.isClosed;
	}
	getSnapshot() {
		return this.core.getSnapshot();
	}
	retryFailedRetirements() {
		return this.core.retryFailedRetirements();
	}
	rotate() {
		return this.core.rotate();
	}
	close(error) {
		return this.core.close(error);
	}
};
/** Internal resource owners can retain task custody or use settled ordinary reads. */
function createOwnedWorkerTaskPool(options, ownerOptions) {
	const core = new WorkerTaskPoolCore(options, createWorkerTaskHost(ownerOptions, options.workerClass), void 0, ownerOptions);
	return {
		run: (input, taskOptions) => core.run(input, taskOptions),
		rotate: () => core.rotate(),
		runTask: (input, taskOptions) => core.runTask(input, taskOptions),
		startTask: (input, taskOptions) => core.startTask(input, taskOptions),
		closeResources: (key) => core.startCloseResources(key).result,
		startCloseResources: (key) => core.startCloseResources(key),
		startRotate: () => core.startRotate(),
		getSnapshot: () => core.getSnapshot(),
		close: (error) => core.close(error)
	};
}
//#endregion
export { createOwnedWorkerTaskPool as n, getWorkerComputeCapacity as r, WorkerTaskPool as t };
