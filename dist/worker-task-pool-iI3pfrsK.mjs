import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { r as resolveRuntimeWorkerThreadExecArgv } from "./runtime-worker-url-DoBSDhBS.mjs";
import { n as createCpuTrackedWorker, o as markWorkerRetirement, s as receiveWorkerMemoryPort, t as attributeWorkerToPool } from "./worker-cpu-DU6Cf6Aq.mjs";
import { r as createRetainedNativeWorker, t as captureRetainedNativeWorkerSource } from "./worker-native-lifecycle-VAONWs_C.mjs";
import { o as createWorkerComputeCapacity, t as WorkerTaskPoolCore } from "./src-WCJCjrey.mjs";
import { n as captureDeletedAgentDatabaseFences } from "./agent-database-readers-DAuOtcuZ.mjs";
import { n as liveWorkerTaskPools } from "./worker-task-pool-registry-DkolpTBF.mjs";
import { availableParallelism } from "node:os";
//#region src/infra/worker-task-capacity.ts
/** All runtime chunks share the same host-owned computation budget. */
function getWorkerComputeCapacity() {
	return resolveGlobalSingleton(Symbol.for("openclaw.workerComputeCapacity"), () => createWorkerComputeCapacity(Math.max(1, availableParallelism() - 1)));
}
//#endregion
//#region src/infra/worker-task-host.ts
const prepareResources = createLazyRuntimeModule(() => import("./temp-artifact-cleanup-oq2J-gZ9.mjs"));
function createWorkerTaskHost(owner = {}) {
	const source = owner.retainedTransport ? owner.nativeSource ?? captureRetainedNativeWorkerSource({ runtimeGeneration: void 0 }) : void 0;
	return {
		createWorker(url, options) {
			const workerOptions = {
				execArgv: resolveRuntimeWorkerThreadExecArgv(url),
				...options
			};
			if (owner.retainedTransport) {
				const native = createRetainedNativeWorker(url, workerOptions, source, owner.nativeResource);
				return {
					worker: native,
					native
				};
			}
			return { worker: createCpuTrackedWorker(url, workerOptions) };
		},
		prepareResources,
		async releaseTemporaryDirectory(directory) {
			const { removeTemporaryArtifacts } = await prepareResources();
			await removeTemporaryArtifacts(directory, "Worker task");
		},
		captureTaskContext: captureDeletedAgentDatabaseFences,
		receiveMessage: receiveWorkerMemoryPort,
		workerStarted: attributeWorkerToPool,
		workerRetiring: markWorkerRetirement,
		computeCapacity: getWorkerComputeCapacity(),
		pools: liveWorkerTaskPools
	};
}
//#endregion
//#region src/infra/worker-task-pool.ts
/** Existing SDK surface; task custody remains an internal capability. */
var WorkerTaskPool = class {
	constructor(options) {
		this.core = new WorkerTaskPoolCore(options, createWorkerTaskHost(), {
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
	const core = new WorkerTaskPoolCore(options, createWorkerTaskHost(ownerOptions), void 0, ownerOptions);
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
