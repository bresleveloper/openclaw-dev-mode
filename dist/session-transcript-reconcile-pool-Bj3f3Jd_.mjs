import { f as toStringifiedError } from "./error-coercion-BwMr25F8.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { o as racePromiseWithAbortSignal } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-CvMrvFI1.mjs";
import { f as readDatabasePathIdentitySync } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-BMmG9cQl.mjs";
import { n as observeWorkerMessage, r as recordWorkerMessage } from "./worker-message-metrics-CcNXClPZ.mjs";
import { o as registerOpenClawAgentDatabaseAsyncResource } from "./openclaw-agent-db-resources-DIwq7LM6.mjs";
import { o as resolveWorkerPoolSize } from "./worker-pool-sizing-9MNT4hxr.mjs";
import { t as WorkerTaskPool } from "./worker-task-pool-D6ogd941.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { n as runWithSqliteDatabaseAdmissionTurn } from "./sqlite-database-admission-turn-BwijprYk.mjs";
import { r as withSqliteWorkerLifecycleCoordination } from "./session-accessor.sqlite-worker-coordination-VYaqe2BP.mjs";
import { MessageChannel } from "node:worker_threads";
import { addAbortListener } from "node:events";
//#region src/config/sessions/session-transcript-reconcile-pool.ts
const MAX_WORKERS = resolveWorkerPoolSize("writer");
const CLOSE_GRACE_MS = 5e3;
const log = createSubsystemLogger("sessions/transcript-index");
const runtime = resolveGlobalSingleton(Symbol.for("openclaw.sessionTranscriptReconcilePool"), () => ({
	operations: /* @__PURE__ */ new Map(),
	tasks: /* @__PURE__ */ new Map(),
	stopped: false
}), () => closeSessionTranscriptReconcileWorkerPool());
function isSessionTranscriptReconcileWorkerPoolClosing() {
	return runtime.stopped;
}
/** Track the complete owner, including parent writes and native lease release. */
function runSessionTranscriptReconcileOperation(run, owner, signal) {
	if (runtime.stopped) return Promise.reject(/* @__PURE__ */ new Error("Session transcript reconciliation lifecycle is closed"));
	const controller = new AbortController();
	if (signal?.aborted) controller.abort(signal.reason);
	const abort = signal && addAbortListener(signal, () => controller.abort(signal.reason));
	let unregister;
	const completion = createDeferredCore();
	const promise = completion.promise.finally(() => {
		abort?.[Symbol.dispose]();
		runtime.operations.delete(promise);
		unregister?.();
	});
	runtime.operations.set(promise, controller);
	try {
		unregister = owner && registerOpenClawAgentDatabaseAsyncResource({
			...owner,
			revoke: () => controller.abort(/* @__PURE__ */ new Error("Session transcript reconciliation was revoked")),
			close: () => promise.then(() => void 0, () => void 0)
		});
		completion.resolve(run({
			signal: controller.signal,
			shouldYield: () => runtime.operations.size > 1,
			startTask: (input) => {
				if (input.mode === "release") return startReconcileWorkerTask(input);
				controller.signal.throwIfAborted();
				return startReconcileWorkerTask(input, controller.signal);
			}
		}));
	} catch (error) {
		completion.reject(error);
	}
	return promise;
}
async function finishSessionTranscriptReconcileTask({ operation, task, input, handlingMessage, terminalReceived, outcome }) {
	const worker = task.port;
	let plannerFailure;
	try {
		if (!terminalReceived) task.controller.abort();
		await handlingMessage;
		if (terminalReceived) {
			worker.postMessage({ type: "release" }, []);
			recordWorkerMessage("lifecycle", "to_worker");
		}
		const plannerRelease = await task.leaseRelease;
		let cleanup = plannerRelease;
		if (!cleanup.released && !cleanup.releaseFailed) {
			const releaseTask = await operation.startTask({
				mode: "release",
				leaseId: input.leaseId,
				path: input.path,
				stateDir: input.stateDir,
				externallySupervised: input.externallySupervised
			});
			try {
				cleanup = await releaseTask.leaseRelease;
			} finally {
				releaseTask.port.close();
				releaseTask.port.removeAllListeners();
			}
		}
		if (cleanup.failure) throw cleanup.failure;
		if (outcome.ok && plannerRelease.failure) plannerFailure = plannerRelease.failure;
	} catch (error) {
		const failure = new Error(`Transcript lease cleanup incomplete; restart OpenClaw before deleting this agent: ${toStringifiedError(error).message}`, { cause: error });
		throw outcome.ok ? failure : new AggregateError([outcome.error, failure], failure.message, { cause: failure });
	} finally {
		worker.close();
		worker.removeAllListeners();
	}
	if (!outcome.ok) throw outcome.error;
	if (plannerFailure) throw plannerFailure;
	return outcome.value;
}
/** Close admission first; accepted owners may still dispatch their lease-release tasks. */
function closeSessionTranscriptReconcileWorkerPool() {
	if (runtime.closing) return runtime.closing;
	runtime.stopped = true;
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
	const owner = {
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
	if (input.mode === "disk" && owner.context.admission.identity.key.startsWith("path:")) {
		const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
		await runOpenClawStateWorkerOperation(owner.context, async () => void 0, { signal });
	}
	signal?.throwIfAborted();
	const pool = runtime.pool ??= new WorkerTaskPool({
		workerUrl: resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.sessionTranscriptReconcile),
		workerOptions: { resourceLimits: { maxOldGenerationSizeMb: 512 } },
		maxWorkers: MAX_WORKERS
	});
	const { port1: port, port2 } = new MessageChannel();
	const controller = new AbortController();
	runtime.tasks.set(controller, `transcript:${input.mode}:${input.leaseId} (${input.path})`);
	const closed = new Promise((resolve) => {
		port.once("close", resolve);
	});
	let released = false;
	let releaseFailed = false;
	let failure;
	port.on("message", (message) => {
		observeWorkerMessage(message, "from_worker", "sqlite_reply", message.type === "fts-chunk" ? message.chunk.textBytes.byteLength : void 0);
		if (message.type === "lease-released") released = true;
		else if (message.type === "lease-release-failed") {
			releaseFailed = true;
			failure = new Error(message.error);
		}
	});
	const inputBytes = 128 + 2 * (owner.actorId.length + owner.context.admission.databasePath.length + owner.context.environment.OPENCLAW_STATE_DIR.length) + (input.mode === "release" ? 0 : input.sessionIds.reduce((bytes, id) => bytes + 2 * id.length, 0)) + 2 * (input.stateDir.length + input.leaseId.length + input.path.length) + (input.mode === "disk" ? 2 * input.agentId.length : 0);
	let poolCompletion;
	const execute = async (coordination) => {
		const waiting = new AbortController();
		const abort = addAbortListener(controller.signal, () => waiting.abort(controller.signal.reason));
		poolCompletion = racePromiseWithAbortSignal(() => runWithSqliteDatabaseAdmissionTurn(input.mode === "disk" ? [input.path] : [], () => {
			abort[Symbol.dispose]();
			controller.signal.throwIfAborted();
			return pool.run({
				input,
				port: port2,
				coordination,
				sourceIdentity
			}, {
				inputBytes,
				transferList: (task) => [task.port, ...task.coordination?.databaseAdmission ? [task.coordination.databaseAdmission] : []],
				signal: controller.signal
			});
		}), waiting.signal);
		try {
			await poolCompletion;
		} finally {
			abort[Symbol.dispose]();
			port2.close();
			await closed;
		}
	};
	const completion = withSqliteWorkerLifecycleCoordination(owner.context, owner.actorId, execute, async () => {
		controller.abort();
		await poolCompletion?.catch(() => {});
		port2.close();
		await closed;
	}, "reconciliation").finally(() => {
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
export { runSessionTranscriptReconcileOperation as a, isSessionTranscriptReconcileWorkerPoolClosing as i, finishSessionTranscriptReconcileTask as n, getSessionTranscriptReconcileWorkerPoolSnapshot as r, closeSessionTranscriptReconcileWorkerPool as t };
