import { d as toStringifiedError } from "./error-coercion-C787aVxk.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-DazJcPEG.mjs";
import { r as resolveRuntimeWorkerUrl } from "./runtime-worker-url-B4o9tqvO.mjs";
import { t as WorkerTaskPool } from "./worker-task-pool-cppt7dT0.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { a as registerOpenClawAgentDatabaseAsyncResource } from "./openclaw-agent-db-resources-o9110hVL.mjs";
import { r as withSqliteWorkerLifecycleCoordination } from "./session-accessor.sqlite-worker-coordination-wh6w_NYn.mjs";
import { MessageChannel } from "node:worker_threads";
//#region src/config/sessions/session-transcript-reconcile-pool.ts
const MAX_WORKERS = 1;
const runtime = resolveGlobalSingleton(Symbol.for("openclaw.sessionTranscriptReconcilePool"), () => ({
	operations: /* @__PURE__ */ new Set(),
	generation: 0,
	stopped: false
}), () => closeSessionTranscriptReconcileWorkerPool());
function captureSessionTranscriptReconcileGeneration() {
	return runtime.generation;
}
function isSessionTranscriptReconcileGenerationCurrent(generation) {
	return !runtime.stopped && generation === runtime.generation;
}
/** Track the complete owner, including parent writes and independent lease recovery. */
function runSessionTranscriptReconcileOperation(generation, run, owner) {
	if (!isSessionTranscriptReconcileGenerationCurrent(generation)) return Promise.reject(/* @__PURE__ */ new Error("Session transcript reconciliation lifecycle is closed"));
	let active = true;
	const controller = new AbortController();
	let cleanupLease;
	let unregister;
	const completion = createDeferredCore();
	const promise = completion.promise.finally(() => {
		active = false;
		runtime.operations.delete(promise);
		if (!cleanupLease) unregister?.();
	});
	runtime.operations.add(promise);
	try {
		unregister = owner && registerOpenClawAgentDatabaseAsyncResource({
			...owner,
			revoke: () => controller.abort(/* @__PURE__ */ new Error("Session transcript reconciliation was revoked")),
			close() {
				const closing = promise.catch(() => {}).then(async () => {
					if (cleanupLease) {
						await releaseReconcileWorkerLease(cleanupLease);
						cleanupLease = void 0;
						unregister?.();
					}
				});
				runtime.operations.add(closing);
				return closing.finally(() => runtime.operations.delete(closing));
			}
		});
		completion.resolve(run({
			signal: controller.signal,
			retainLeaseForCleanup: (lease) => {
				cleanupLease ??= lease;
			},
			startTask: (input) => {
				if (!active) throw new Error("Session transcript reconciliation operation is closed");
				if (input.mode !== "release") controller.signal.throwIfAborted();
				return startReconcileWorkerTask(input);
			}
		}));
	} catch (error) {
		completion.reject(error);
	}
	return promise;
}
async function releaseReconcileWorkerLease(input) {
	const task = startReconcileWorkerTask(input);
	try {
		const cleanup = await task.leaseRelease;
		if (cleanup.failure) throw cleanup.failure;
	} finally {
		task.port.close();
		task.port.removeAllListeners();
	}
}
/** Close admission first; accepted owners may still dispatch their lease-release tasks. */
function closeSessionTranscriptReconcileWorkerPool() {
	if (runtime.closing) return runtime.closing;
	runtime.stopped = true;
	runtime.generation++;
	runtime.closing = Promise.resolve().then(async () => {
		while (runtime.operations.size) await Promise.allSettled(runtime.operations);
		await runtime.pool?.close();
		runtime.pool = void 0;
		runtime.generation++;
		runtime.stopped = false;
	}).finally(() => {
		runtime.closing = void 0;
	});
	return runtime.closing;
}
function getSessionTranscriptReconcileWorkerPoolSnapshot() {
	return runtime.pool?.getSnapshot() ?? {
		maxWorkers: MAX_WORKERS,
		workers: 0,
		workersCreated: 0,
		activeTasks: 0,
		pendingTasks: 0
	};
}
function startReconcileWorkerTask(input) {
	const owner = input.mode === "memory" ? void 0 : {
		actorId: `transcript:${input.mode}:${input.leaseId}`,
		context: captureOpenClawStateWorkerContext({ env: {
			OPENCLAW_STATE_DIR: input.stateDir,
			...input.externallySupervised ? { OPENCLAW_SUPERVISOR_MODE: "external" } : {}
		} })
	};
	const pool = runtime.pool ??= new WorkerTaskPool({
		workerUrl: resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.sessionTranscriptReconcile),
		workerOptions: { resourceLimits: { maxOldGenerationSizeMb: 512 } },
		maxWorkers: MAX_WORKERS,
		maxPendingTasks: Number.MAX_SAFE_INTEGER
	});
	const { port1: port, port2 } = new MessageChannel();
	const controller = new AbortController();
	const closed = new Promise((resolve) => {
		port.once("close", resolve);
	});
	let released = false;
	let releaseFailed = false;
	let failure;
	port.on("message", (message) => {
		if (message.type === "lease-released") released = true;
		else if (message.type === "lease-release-failed") {
			releaseFailed = true;
			failure = new Error(message.error);
		}
	});
	const inputBytes = 128 + (owner ? 2 * (owner.actorId.length + owner.context.admission.databasePath.length + owner.context.environment.OPENCLAW_STATE_DIR.length + owner.context.coordinatorRuntime.directory.length) : 0) + (input.mode === "memory" ? input.sessionIds.reduce((bytes, id) => bytes + 2 * id.length, 0) : 2 * (input.stateDir.length + input.leaseId.length) + (input.mode === "disk" ? 2 * (input.path.length + input.agentId.length) : 0));
	let poolCompletion;
	const execute = async (coordination) => {
		poolCompletion = pool.run({
			input,
			port: port2,
			coordination
		}, {
			inputBytes,
			transferList: (task) => [task.port, ...task.coordination?.stateLifecycle ? [task.coordination.stateLifecycle] : []],
			signal: controller.signal
		});
		try {
			await poolCompletion;
		} finally {
			port2.close();
			await closed;
		}
	};
	const completion = (!owner ? execute() : withSqliteWorkerLifecycleCoordination(owner.context, owner.actorId, execute, async () => {
		controller.abort();
		await poolCompletion?.catch(() => {});
		port2.close();
		await closed;
	})).finally(() => port2.close());
	return {
		port,
		controller,
		completion,
		closed,
		leaseRelease: Promise.allSettled([completion, closed]).then(([result]) => {
			if (result.status === "rejected") failure ??= toStringifiedError(result.reason);
			if (!released) failure ??= /* @__PURE__ */ new Error("transcript worker task closed before lease release");
			return {
				released,
				releaseFailed,
				failure
			};
		})
	};
}
//#endregion
export { runSessionTranscriptReconcileOperation as a, isSessionTranscriptReconcileGenerationCurrent as i, closeSessionTranscriptReconcileWorkerPool as n, getSessionTranscriptReconcileWorkerPoolSnapshot as r, captureSessionTranscriptReconcileGeneration as t };
