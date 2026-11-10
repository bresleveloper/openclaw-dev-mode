import { f as toStringifiedError } from "./error-coercion-BwMr25F8.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-CvMrvFI1.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-BMmG9cQl.mjs";
import { n as observeWorkerMessage } from "./worker-message-metrics-CcNXClPZ.mjs";
import { i as decodeNativeWorkerFailure } from "./resource-protocol-Bh2jG53d.mjs";
import { y as registerOpenClawStateDatabaseAsyncResource } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { t as WorkerTaskPool } from "./worker-task-pool-D6ogd941.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import "./openclaw-agent-db-contract-BcoeqAm4.mjs";
import { MessageChannel } from "node:worker_threads";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/config/sessions/session-accessor.sqlite-canonical-worker-pool.ts
const log = createSubsystemLogger("session-sqlite");
const canonicalWorkerPool = new AsyncLocalStorage();
function captureCanonicalValidationWorkerPool() {
	return canonicalWorkerPool.getStore();
}
/** Reuse execution only; each physical database task closes its handles and leases. */
async function withSqliteCanonicalValidationWorkerPool(env, run) {
	const context = captureOpenClawStateWorkerContext({ env });
	let closing;
	const tasksDrained = createDeferredCore();
	const beforeExit = () => {
		execution.close().catch((error) => log.error(String(error)));
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
				if (result.status !== "closed") throw decodeNativeWorkerFailure(result.error);
			}
		}),
		closed: false,
		close: async () => {
			execution.closed = true;
			await tasksDrained.promise;
			return closing ??= execution.pool.close(execution.failure).then(() => {
				unregister();
				process.off("beforeExit", beforeExit);
			}, (error) => {
				closing = void 0;
				throw error;
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
	channel.on("message", (message) => {
		observeWorkerMessage(message, "from_worker", "sqlite_reply");
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
		}
	}).then(() => void 0).catch((error) => {
		execution.closed = true;
		execution.failure ??= toStringifiedError(error);
		throw execution.failure;
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
