import { d as toStringifiedError } from "./error-coercion-C787aVxk.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-DazJcPEG.mjs";
import { r as resolveRuntimeWorkerUrl } from "./runtime-worker-url-B4o9tqvO.mjs";
import { _ as registerOpenClawStateDatabaseAsyncResource } from "./openclaw-state-db-cache-Ci98mtX8.mjs";
import { t as WorkerTaskPool } from "./worker-task-pool-cppt7dT0.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import "./openclaw-database-preflight-agent-scheduler-DTKyg25c.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { MessageChannel } from "node:worker_threads";
//#region src/config/sessions/session-accessor.sqlite-canonical-worker-pool.ts
const log = createSubsystemLogger("session-sqlite");
const canonicalWorkerPool = new AsyncLocalStorage();
function captureCanonicalValidationWorkerPool() {
	return canonicalWorkerPool.getStore();
}
/** Reuse execution only; each physical database task closes its handles and leases. */
async function withSqliteCanonicalValidationWorkerPool(env, run) {
	const context = captureOpenClawStateWorkerContext({ env });
	let retired = false;
	let closing;
	const tasksDrained = createDeferredCore();
	const beforeExit = () => {
		execution.close().catch((error) => log.error(String(error)));
	};
	const retainFailure = (cleanupError) => {
		const latestFailure = toStringifiedError(cleanupError);
		execution.failure ??= latestFailure;
		return execution.failure === latestFailure ? execution.failure : new AggregateError([execution.failure, latestFailure], "Canonical validation failed and native Worker custody remains unsettled", { cause: latestFailure });
	};
	const execution = {
		pool: new WorkerTaskPool({
			workerUrl: resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.sessionTranscriptArchive),
			workerOptions: {
				resourceLimits: { maxOldGenerationSizeMb: 512 },
				workerData: {
					type: "sqlite-transcript-archive-v2",
					operation: "canonical-validation-pool"
				}
			},
			maxWorkers: 2,
			idleTimeoutMs: 0,
			validateResult: (result) => {
				if (result.status !== "closed") throw new Error(result.error);
			}
		}),
		closed: false,
		retryFailedRetirements: async () => {
			execution.closed = true;
			try {
				await execution.pool.retryFailedRetirements();
			} catch (error) {
				log.error(String(retainFailure(error)));
			}
		},
		close: async () => {
			execution.closed = true;
			await tasksDrained.promise;
			if (closing) try {
				await closing;
				return;
			} catch {}
			if (retired) return;
			return closing ??= execution.pool.close(execution.failure).then(() => {
				retired = true;
				unregister();
				process.off("beforeExit", beforeExit);
			}).catch((cleanupError) => {
				throw retainFailure(cleanupError);
			}).finally(() => {
				closing = void 0;
			});
		}
	};
	const unregister = registerOpenClawStateDatabaseAsyncResource({ close: async (identity) => {
		if (!identity || identity.key === context.admission.identity.key) await execution.close();
	} });
	process.once("beforeExit", beforeExit);
	try {
		context.maintenanceScope?.own(execution, "shared-resources", execution.close);
		return await canonicalWorkerPool.run(execution, run);
	} catch (error) {
		execution.failure ??= toStringifiedError(error);
		throw error;
	} finally {
		tasksDrained.resolve();
		await execution.close();
	}
}
async function startCanonicalValidationTask(execution, databaseOptions) {
	if (execution.closed) throw execution.failure ?? /* @__PURE__ */ new Error("Canonical validation Worker pool is closed");
	const { port1: channel, port2 } = new MessageChannel();
	const controller = new AbortController();
	const ready = createDeferredCore();
	let active = true;
	let custodyReleased = false;
	const custody = createDeferredCore();
	let taskFailure;
	const retryRetirement = async (failure) => {
		execution.closed = true;
		execution.failure ??= failure;
		await execution.retryFailedRetirements();
	};
	channel.on("message", (message) => {
		if (message.type === "ready") ready.resolve(message);
	});
	const completion = execution.pool.run({
		databaseOptions,
		port: port2
	}, {
		transferList: (task) => [task.port],
		signal: controller.signal,
		onRequest: async () => {
			throw new Error("Canonical validation task must request admission through its own port");
		},
		onInputConsumed: () => {
			custodyReleased = true;
			custody.resolve();
		}
	}).then(() => void 0).catch(async (error) => {
		taskFailure = toStringifiedError(error);
		if (!custodyReleased) {
			retryRetirement(taskFailure);
			await custody.promise;
		}
		throw execution.failure ?? taskFailure;
	}).finally(() => {
		active = false;
		port2.close();
	});
	completion.then(() => ready.reject(/* @__PURE__ */ new Error("Canonical validation task closed before readiness")), (error) => ready.reject(error));
	try {
		const started = await ready.promise;
		return {
			kind: "pooled",
			channel,
			threadId: started.threadId,
			initialOperationId: started.operationId,
			completion,
			custodyReleased: () => custodyReleased,
			terminate: async () => {
				if (active) controller.abort(/* @__PURE__ */ new Error("Canonical validation task was terminated"));
				if (taskFailure && !custodyReleased) await retryRetirement(taskFailure);
				await completion.catch((error) => {
					if (!custodyReleased) throw error;
				});
			}
		};
	} catch (error) {
		channel.close();
		throw error;
	}
}
//#endregion
export { startCanonicalValidationTask as n, withSqliteCanonicalValidationWorkerPool as r, captureCanonicalValidationWorkerPool as t };
