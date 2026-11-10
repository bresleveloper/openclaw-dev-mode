import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { s as throwSqliteLifecycleErrors } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { n as resolveRuntimeProcessEntrypointUrl } from "./runtime-process-url-BCfqgqXF.mjs";
import { t as captureRuntimeWorkerSource } from "./runtime-worker-generation-DvW-aFj2.mjs";
import { a as ensureSqliteLibrarySelected, o as getSqliteRuntimeCapabilities } from "./bun-sqlite-library-CYR1RYZS.mjs";
import { P as resolveSqliteDatabaseFilePath } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { i as mapRetainedOperation, r as flatMapRetainedOperation, t as createRetainedOperation } from "./retained-operation-cDWsZqBc.mjs";
import { b as registerOpenClawStateDatabaseLifecycleListener, y as registerOpenClawStateDatabaseAsyncResource } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { n as hydrateOpenClawStateWorkerError, r as retainOpenClawStateWorkerErrorPayload } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { t as captureRetainedNativeWorkerSource } from "./worker-native-lifecycle-BrCZRghB.mjs";
import { i as DEFAULT_WORKER_PENDING_BYTES, r as WorkerTaskError } from "./src-NEpyeLp1.mjs";
import { r as resolveStateReadWorkerCount } from "./worker-pool-sizing-9MNT4hxr.mjs";
import { n as createOwnedWorkerTaskPool } from "./worker-task-pool-D6ogd941.mjs";
import "./worker-task-pool-registry-D6q0YAmu.mjs";
import { t as SQLITE_IDLE_HANDLE_TTL_MS } from "./sqlite-handle-lifecycle-dWd9h3ii.mjs";
import { t as acquireSqliteDatabaseAdmissionTurn } from "./sqlite-database-admission-turn-BwijprYk.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/state/openclaw-state-read-pool.ts
function stateReadPools(state) {
	return [state.pool, state.awaitedPool].filter((pool) => pool !== void 0);
}
function createStateReadPool(workerUrl, nativeSource) {
	ensureSqliteLibrarySelected();
	return createOwnedWorkerTaskPool({
		workerUrl,
		workerOptions: { resourceLimits: { maxOldGenerationSizeMb: 512 } },
		maxWorkers: resolveStateReadWorkerCount(),
		idleTimeoutMs: SQLITE_IDLE_HANDLE_TTL_MS,
		burstIdleTimeoutMs: 3e4,
		maxPendingTasks: 128,
		maxPendingBytes: DEFAULT_WORKER_PENDING_BYTES
	}, nativeSource ? {
		retainedTransport: true,
		nativeSource,
		databaseAccess: "read-only"
	} : { databaseAccess: "read-only" });
}
function closeReadResources(pool, key) {
	return getSqliteRuntimeCapabilities().explicitSqliteCloseReleasesNativeResources ? pool.closeResources(key) : pool.rotate();
}
/** The same task/close contract; promise-only callers do not synchronously service it. */
function startReadTask(selection, input, options) {
	if (selection.retained) return selection.pool.startTask(input, options);
	const task = selection.pool.runTask(input, options);
	const result = createRetainedOperation(() => {});
	task.result.then(result.resolve, result.reject);
	return {
		...result.operation,
		release(closeOptions) {
			const closed = createRetainedOperation(() => {});
			task.close(closeOptions).then(closed.resolve, closed.reject);
			return closed.operation;
		}
	};
}
//#endregion
//#region src/state/openclaw-state-read-request.ts
function stringBytes(values) {
	return values.reduce((bytes, value) => bytes + Buffer.byteLength(value ?? "", "utf8"), 0);
}
function commandBytes(value) {
	if (typeof value === "string") return Buffer.byteLength(JSON.stringify(value), "utf8");
	if (typeof value === "number" || typeof value === "bigint") return 8;
	if (typeof value === "boolean") return 1;
	if (value === null || value === void 0) return 0;
	if (Array.isArray(value)) return value.reduce((bytes, entry) => bytes + 8 + commandBytes(entry), 0);
	return Object.entries(value).reduce((bytes, [key, entry]) => bytes + Buffer.byteLength(key, "utf8") + 8 + commandBytes(entry), 0);
}
function requestBytes(request) {
	return commandBytes(request.command) + stringBytes([
		...Object.entries(request.context.environment).flatMap(([key, value]) => [key, value]),
		request.context.existingSchemaPath,
		request.databasePath,
		request.location,
		request.expectedIdentity,
		request.snapshotRoot
	]);
}
//#endregion
//#region src/state/openclaw-state-read-worker.ts
function decodeOpenClawStateReadReply(reply) {
	if (reply.ok) return { value: reply };
	const error = new Error(reply.message);
	retainOpenClawStateWorkerErrorPayload(error, reply.error);
	return {
		error: hydrateOpenClawStateWorkerError(error, { includeOrdinary: true }),
		sourceAdmitted: reply.sourceAdmitted === true
	};
}
async function closeReadPool(state) {
	if (state.closing) return await state.closing;
	const pools = stateReadPools(state);
	if (!pools.length) return;
	const closing = (async () => {
		const results = await Promise.allSettled(pools.map(async (pool) => {
			await closeReadResources(pool);
			await pool.close();
		}));
		throwSqliteLifecycleErrors(results.flatMap((result) => result.status === "rejected" ? [result.reason] : []), "Shared-state reader pools cleanup failed");
		state.pool = void 0;
		state.awaitedPool = void 0;
	})();
	state.closing = closing;
	try {
		await closing;
	} finally {
		state.closing = void 0;
	}
}
function readRuntimes() {
	return resolveGlobalSingleton(Symbol.for("openclaw.stateReadWorkers"), () => {
		const sources = /* @__PURE__ */ new Map();
		registerOpenClawStateDatabaseAsyncResource({
			phase: "after-resources",
			async close(identity) {
				const results = await Promise.allSettled([...sources.values()].map(async (state) => {
					if (identity) {
						const resources = await Promise.allSettled(stateReadPools(state).map((pool) => closeReadResources(pool, identity.key)));
						throwSqliteLifecycleErrors(resources.flatMap((result) => result.status === "rejected" ? [result.reason] : []), "Shared-state reader resources cleanup failed");
					} else await closeReadPool(state);
				}));
				throwSqliteLifecycleErrors(results.flatMap((result) => result.status === "rejected" ? [result.reason] : []), "Shared-state reader source cleanup failed");
			}
		});
		registerOpenClawStateDatabaseLifecycleListener((event) => {
			if (event.kind !== "opened" && event.identity) {
				const identity = event.identity;
				for (const state of sources.values()) Promise.allSettled(stateReadPools(state).map((pool) => closeReadResources(pool, identity.key))).then((results) => throwSqliteLifecycleErrors(results.flatMap((result) => result.status === "rejected" ? [result.reason] : []), "Shared-state reader invalidation failed")).catch((error) => {
					process.emitWarning(`Shared-state reader invalidation failed: ${String(error)}`);
				});
			}
		});
		return sources;
	});
}
/** Retire cached workers only after every independently admitted reader has joined. */
async function retireIdleOpenClawStateReadWorkers(nativeSource) {
	const state = readRuntimes().get(nativeSource);
	if (!state) return true;
	if (state.operations.size > 0) return false;
	await closeReadPool(state);
	return true;
}
function readPool(state, admitted, awaitedOnly) {
	if (state.sealed && !admitted || state.closing) throw new WorkerTaskError("Shared-state readers are closing", "unavailable");
	const retained = !awaitedOnly || state.pool !== void 0;
	const key = retained ? "pool" : "awaitedPool";
	if (!state[key]) state[key] = createStateReadPool(state.workerUrl, retained ? state.nativeSource : void 0);
	return {
		pool: state[key],
		retained
	};
}
/** Capture the execution source before snapshot preparation yields. */
function captureOpenClawStateReadSource() {
	const captured = captureRuntimeWorkerSource(resolveRuntimeProcessEntrypointUrl("stateRead"));
	const nativeSource = captureRetainedNativeWorkerSource({ runtimeGeneration: captured.runtimeGeneration });
	const sources = readRuntimes();
	let runtime = sources.get(nativeSource);
	if (!runtime) {
		const created = {
			nativeSource,
			workerUrl: captured.moduleUrl,
			operations: /* @__PURE__ */ new Set(),
			servicing: false,
			sealed: false
		};
		nativeSource.retain(created, () => {
			created.sealed = true;
			if (!created.stopping) created.stopping = Promise.resolve().then(async () => {
				const results = await Promise.allSettled([...created.operations].map((operation) => Promise.resolve().then(() => operation.close())));
				throwSqliteLifecycleErrors(results.flatMap((result) => result.status === "rejected" ? [result.reason] : []), "Shared-state reader source cleanup failed");
				await closeReadPool(created);
				sources.delete(nativeSource);
			}).finally(() => {
				created.stopping = void 0;
			});
			return created.stopping;
		});
		sources.set(nativeSource, created);
		runtime = created;
	}
	const state = runtime;
	const admitted = /* @__PURE__ */ new Set();
	return {
		createTransport: (command, onChunk, onChunkAsync, awaitedOnly = false) => createReadTransport(command, state, () => admitted.size > 0, onChunk, onChunkAsync, awaitedOnly),
		own(service, close) {
			if (state.sealed || state.closing) throw new WorkerTaskError("Shared-state readers are closing", "unavailable");
			const inContext = AsyncLocalStorage.snapshot();
			const operation = {
				service: () => inContext(service),
				close: () => inContext(close)
			};
			state.operations.add(operation);
			admitted.add(operation);
			return () => {
				state.operations.delete(operation);
				admitted.delete(operation);
			};
		},
		service() {
			if (state.servicing) return;
			state.servicing = true;
			const errors = [];
			try {
				const operations = Array.from(state.operations);
				for (const operation of operations) if (state.operations.has(operation)) try {
					operation.service();
				} catch (error) {
					errors.push(error);
				}
			} finally {
				state.servicing = false;
			}
			throwSqliteLifecycleErrors(errors, "Shared-state reader source cleanup failed");
		}
	};
}
function createReadTransport(command, state, ownsAdmission, onChunk, onChunkAsync, awaitedOnly = false) {
	const capturedCommand = structuredClone(command);
	const tasks = /* @__PURE__ */ new Map();
	let closed = false;
	let closing;
	let pendingChunks = 0;
	const startCloseTask = (task) => {
		try {
			return mapRetainedOperation(task.release(tasks.get(task)?.retire ? { retire: true } : void 0), () => {
				tasks.delete(task);
			});
		} catch (error) {
			const completion = createRetainedOperation(() => {});
			completion.reject(error);
			return completion.operation;
		}
	};
	const startRun = (context, location, checkFreshAdmission, readCommand, authority, expectedIdentity, snapshotRoot) => {
		const inContext = AsyncLocalStorage.snapshot();
		let task;
		let releaseAdmission;
		let retireAfterRead = false;
		const cleanup = { retire: true };
		const completion = createRetainedOperation(() => inContext(service));
		function service() {
			if (!task || completion.operation.read().status !== "pending") return;
			let outcome;
			try {
				task.service();
				const read = task.read();
				if (read.status === "pending") return;
				if (read.status === "rejected") throw read.error;
				const reply = read.value;
				cleanup.retire = retireAfterRead || Boolean(reply.nativeCleanupFailure);
				outcome = decodeOpenClawStateReadReply(reply);
			} catch (error) {
				outcome = { error };
			}
			releaseAdmission?.();
			releaseAdmission = void 0;
			cleanup.retire ||= "error" in outcome;
			completion.resolve(outcome);
		}
		try {
			if (closed) throw new WorkerTaskError("Shared-state read transport is closed", "unavailable");
			const request = {
				context: {
					environment: { ...context.environment },
					existingSchemaPath: context.existingSchemaPath,
					stateIntegrity: context.stateIntegrity
				},
				databasePath: context.admission.databasePath,
				location,
				checkFreshAdmission,
				expectedIdentity,
				snapshotRoot,
				command: { ...readCommand }
			};
			const pool = readPool(state, ownsAdmission(), awaitedOnly);
			retireAfterRead = !pool.retained && !context.maintenanceScope && readCommand.type !== "admit";
			task = startReadTask(pool, () => {
				const turn = acquireSqliteDatabaseAdmissionTurn(resolveSqliteDatabaseFilePath(location));
				if (!turn) {
					authority.assertCurrent();
					return request;
				}
				return turn.then((release) => {
					releaseAdmission = release;
					try {
						authority.assertCurrent();
						return request;
					} catch (error) {
						releaseAdmission();
						releaseAdmission = void 0;
						throw error;
					}
				});
			}, {
				signal: authority.signal,
				inputBytes: requestBytes(request),
				diagnosticOperation: readCommand.type,
				...onChunkAsync ? { async onRequest(value, { signal: taskSignal }) {
					authority.assertCurrent();
					const signal = AbortSignal.any([authority.signal, taskSignal]);
					signal.throwIfAborted();
					pendingChunks += 1;
					try {
						await onChunkAsync(value, signal);
						signal.throwIfAborted();
						authority.assertCurrent();
						return {
							input: null,
							timeoutMs: 3e5
						};
					} finally {
						pendingChunks -= 1;
						closing?.service();
					}
				} } : onChunk ? { onRequestSync(value) {
					authority.assertCurrent();
					onChunk(value);
					return {
						input: null,
						timeoutMs: 3e5
					};
				} } : {}
			});
			tasks.set(task, cleanup);
			task.result.then(() => completion.operation.service(), () => completion.operation.service());
			completion.operation.service();
		} catch (error) {
			releaseAdmission?.();
			releaseAdmission = void 0;
			completion.reject(error);
		}
		return {
			task,
			operation: completion.operation
		};
	};
	const startValidateFresh = (context, authority) => {
		const run = startRun(context, context.admission.databasePath, true, { type: "admit" }, authority);
		return flatMapRetainedOperation(run.operation, (read) => {
			if ("error" in read) throw read.error;
			authority.assertCurrent();
			if (!run.task) throw new Error("Shared-state admission completed without its retained task");
			return startCloseTask(run.task);
		});
	};
	const startRead = (source, authority) => startRun(source.context, source.location, source.checkFreshAdmission, capturedCommand, authority, source.expectedIdentity, source.snapshotRoot).operation;
	const startClose = () => {
		closed = true;
		if (closing) return closing;
		const releases = [...tasks.keys()].map(startCloseTask);
		const inContext = AsyncLocalStorage.snapshot();
		const completion = createRetainedOperation(() => inContext(service));
		closing = completion.operation;
		function service() {
			if (completion.operation.read().status !== "pending") return;
			const errors = [];
			let pending = pendingChunks > 0;
			for (const release of releases) {
				release.service();
				const outcome = release.read();
				pending ||= outcome.status === "pending";
				if (outcome.status === "rejected") errors.push(outcome.error);
			}
			if (pending) return;
			closing = void 0;
			try {
				throwSqliteLifecycleErrors(errors, "Shared-state reader task cleanup failed");
				completion.resolve(void 0);
			} catch (error) {
				completion.reject(error);
			}
		}
		for (const release of releases) release.result.then(() => completion.operation.service(), () => completion.operation.service());
		completion.operation.service();
		return completion.operation;
	};
	return {
		startValidateFresh,
		startRead,
		startClose
	};
}
//#endregion
export { decodeOpenClawStateReadReply as n, retireIdleOpenClawStateReadWorkers as r, captureOpenClawStateReadSource as t };
