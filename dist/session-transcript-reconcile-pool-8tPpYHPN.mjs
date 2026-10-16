import { d as toStringifiedError } from "./error-coercion-CvJK4lmH.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-DoBSDhBS.mjs";
import { u as readDatabasePathIdentitySync } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-Dgz2IR4T.mjs";
import { t as WorkerTaskPool } from "./worker-task-pool-iI3pfrsK.mjs";
import { a as registerOpenClawAgentDatabaseAsyncResource } from "./openclaw-agent-db-resources-x2MmUEok.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { i as withSqliteWorkerLifecycleCoordination } from "./session-accessor.sqlite-worker-coordination-CnWXpMvZ.mjs";
import { MessageChannel } from "node:worker_threads";
//#region src/config/sessions/session-transcript-reconcile-pool.ts
const MAX_WORKERS = 1;
const CLOSE_GRACE_MS = 5e3;
const log = createSubsystemLogger("sessions/transcript-index");
const runtime = resolveGlobalSingleton(Symbol.for("openclaw.sessionTranscriptReconcilePool"), () => ({
	operations: /* @__PURE__ */ new Map(),
	tasks: /* @__PURE__ */ new Map(),
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
	runtime.operations.set(promise, controller);
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
				runtime.operations.set(closing, controller);
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
				return startReconcileWorkerTask(input, input.mode === "release" ? void 0 : controller.signal);
			}
		}));
	} catch (error) {
		completion.reject(error);
	}
	return promise;
}
async function releaseReconcileWorkerLease(input) {
	const task = await startReconcileWorkerTask(input);
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
	const deadline = setTimeout(() => {
		const error = /* @__PURE__ */ new Error("Session transcript reconciliation shutdown grace expired");
		log.warn(`${error.message}; cancelling ${runtime.operations.size} operations; terminating workers: ${[...runtime.tasks.values()].join(", ") || "none"}`);
		for (const controller of runtime.operations.values()) controller.abort(error);
		for (const controller of runtime.tasks.keys()) controller.abort(error);
	}, CLOSE_GRACE_MS);
	runtime.closing = Promise.resolve().then(async () => {
		while (runtime.operations.size) await Promise.allSettled(runtime.operations.keys());
		await runtime.pool?.close();
		runtime.pool = void 0;
		runtime.generation++;
		runtime.stopped = false;
	}).finally(() => {
		clearTimeout(deadline);
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
async function startReconcileWorkerTask(input, signal) {
	const owner = input.mode === "memory" ? void 0 : {
		actorId: `transcript:${input.mode}:${input.leaseId}`,
		context: captureOpenClawStateWorkerContext({
			initializationAgentPaths: [input.path],
			env: {
				OPENCLAW_STATE_DIR: input.stateDir,
				...input.externallySupervised ? { OPENCLAW_SUPERVISOR_MODE: "external" } : {}
			}
		})
	};
	const sourceIdentity = input.mode === "disk" ? readDatabasePathIdentitySync(input.path).key : void 0;
	if (owner && input.mode === "disk" && owner.context.admission.identity.key.startsWith("path:")) {
		const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-RW5P1VzC.mjs");
		await runOpenClawStateWorkerOperation(owner.context, async () => void 0, { signal });
	}
	signal?.throwIfAborted();
	const pool = runtime.pool ??= new WorkerTaskPool({
		workerUrl: resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.sessionTranscriptReconcile),
		workerOptions: { resourceLimits: { maxOldGenerationSizeMb: 512 } },
		maxWorkers: MAX_WORKERS,
		maxPendingTasks: Number.MAX_SAFE_INTEGER
	});
	const { port1: port, port2 } = new MessageChannel();
	const controller = new AbortController();
	runtime.tasks.set(controller, input.mode === "memory" ? "memory" : `transcript:${input.mode}:${input.leaseId} (${input.path})`);
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
	const inputBytes = 128 + (owner ? 2 * (owner.actorId.length + owner.context.admission.databasePath.length + owner.context.environment.OPENCLAW_STATE_DIR.length) : 0) + (input.mode === "memory" ? input.sessionIds.reduce((bytes, id) => bytes + 2 * id.length, 0) : 2 * (input.stateDir.length + input.leaseId.length + input.path.length) + (input.mode === "disk" ? 2 * input.agentId.length : 0));
	let poolCompletion;
	const execute = async (coordination) => {
		poolCompletion = pool.run({
			input,
			port: port2,
			coordination,
			sourceIdentity
		}, {
			inputBytes,
			transferList: (task) => [task.port, ...task.coordination?.reconciliation ? [task.coordination.reconciliation.admission] : []],
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
	}, "reconciliation")).finally(() => {
		runtime.tasks.delete(controller);
		port2.close();
	});
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
