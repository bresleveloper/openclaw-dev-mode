import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as runInDetachedAsyncContext } from "./detached-async-context-D04NzekX.mjs";
import { a as createSqliteLifecycleAggregateError } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { n as resolveRuntimeProcessEntrypointUrl } from "./runtime-process-url-BCfqgqXF.mjs";
import { t as captureRuntimeWorkerSource } from "./runtime-worker-generation-DvW-aFj2.mjs";
import { r as recordWorkerMessage } from "./worker-message-metrics-CcNXClPZ.mjs";
import { i as mapRetainedOperation, n as finallyRetainedOperation, r as flatMapRetainedOperation, t as createRetainedOperation } from "./retained-operation-cDWsZqBc.mjs";
import { a as registerRetainedSnapshotTempDirectory, f as sealRetainedSnapshotTempDirectory, m as startRemoveTempDirectory, t as SqliteSnapshotCleanupError } from "./sqlite-readonly-location-cleanup-zmu6YCue.mjs";
import { n as hydrateOpenClawStateWorkerError, r as retainOpenClawStateWorkerErrorPayload } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { r as createSqliteReadOnlyNativeResourceConnection, t as SQLITE_NATIVE_RESOURCE_PORT } from "./sqlite-readonly-native-resource.types-DWL7LzZr.mjs";
import { t as captureRetainedNativeWorkerSource } from "./worker-native-lifecycle-BrCZRghB.mjs";
import { i as DEFAULT_WORKER_PENDING_BYTES } from "./src-NEpyeLp1.mjs";
import { n as createOwnedWorkerTaskPool } from "./worker-task-pool-D6ogd941.mjs";
import { MessageChannel } from "node:worker_threads";
//#region src/infra/sqlite-snapshot-staging-error.ts
function decodeSqliteSnapshotStagingError(payload) {
	const remote = /* @__PURE__ */ new Error("SQLite snapshot staging failed");
	retainOpenClawStateWorkerErrorPayload(remote, payload);
	return hydrateOpenClawStateWorkerError(remote, { includeOrdinary: true });
}
//#endregion
//#region src/infra/sqlite-snapshot-staging-owner.ts
function completed() {
	const retained = createRetainedOperation(() => {});
	retained.resolve(void 0);
	return retained.operation;
}
/** The existing staging owner retains its child; this transport only moves its event loop. */
function createStagingOwner(workerUrl, nativeSource) {
	const nativeResource = nativeSource.captureResource(resolveRuntimeProcessEntrypointUrl("sqliteReadOnlyNativeResource"), SQLITE_NATIVE_RESOURCE_PORT, void 0, connectNativeResource);
	const pool = createOwnedWorkerTaskPool({
		workerUrl,
		workerClass: "writer",
		idleTimeoutMs: 0,
		maxPendingTasks: 128,
		maxPendingBytes: DEFAULT_WORKER_PENDING_BYTES
	}, {
		retainedTransport: true,
		nativeSource,
		nativeResource,
		databaseAccess: "read-only",
		decodeResourceError: (payload) => decodeSqliteSnapshotStagingError(payload)
	});
	const directories = /* @__PURE__ */ new Map();
	const preparations = /* @__PURE__ */ new Map();
	let preparationSequence = 0;
	const activeRequests = /* @__PURE__ */ new Set();
	let servicingRequests = false;
	let requests = 0;
	let admissionClosed = false;
	let idleClose;
	let unavailable;
	function connectNativeResource() {
		return createSqliteReadOnlyNativeResourceConnection({
			receive(value) {
				const directory = value.directory;
				if (value.type === "allocated") {
					const preparation = preparations.get(value.preparationId);
					if (!preparation) throw new SqliteSnapshotCleanupError("SQLite snapshot preparation custody is unavailable");
					preparation.directories.add(directory);
					retainDirectory(directory, value.preparationId);
				} else if (value.type === "retire") {
					if (!directories.has(directory)) throw new SqliteSnapshotCleanupError("SQLite snapshot native custody is unavailable");
					sealRetainedSnapshotTempDirectory(directory, { requireRequested: true });
				}
			},
			onFailure(error) {
				unavailable ??= { error };
			},
			onDispose() {}
		});
	}
	const serviceRequests = () => {
		if (servicingRequests) return;
		servicingRequests = true;
		try {
			for (const request of activeRequests) request.service();
			for (const preparation of Array.from(preparations.values())) preparation.serviceClose();
		} finally {
			servicingRequests = false;
		}
	};
	const closeWhenIdle = () => {
		if (idleClose?.read().status === "pending") return idleClose;
		if (requests > 0 || directories.size > 0) return completed();
		return idleClose = mapRetainedOperation(flatMapRetainedOperation(pool.startCloseResources(), () => requests > 0 || directories.size > 0 ? completed() : pool.startRotate()), () => {
			unavailable = void 0;
		});
	};
	const retainDirectory = (directory, preparationId) => {
		const existing = directories.get(directory);
		if (existing) return existing;
		let pending;
		const startRetire = () => {
			if (pending && pending.read().status !== "rejected") return pending;
			try {
				sealRetainedSnapshotTempDirectory(directory);
			} catch (error) {
				const refused = createRetainedOperation(() => {});
				refused.reject(error);
				return refused.operation;
			}
			return pending = flatMapRetainedOperation(pool.startCloseResources(directory), () => {
				directories.delete(directory);
				if (preparationId !== void 0) {
					const preparation = preparations.get(preparationId);
					preparation?.directories.delete(directory);
					preparation?.releaseIfComplete();
				}
				return closeWhenIdle();
			});
		};
		const owned = {
			directory,
			startRetire
		};
		directories.set(directory, owned);
		registerRetainedSnapshotTempDirectory(directory, startRetire);
		return owned;
	};
	const start = (command, signal) => {
		if (admissionClosed) throw new Error("SQLite snapshot staging owner is closing");
		const preparationId = ++preparationSequence;
		const inputBytes = Buffer.byteLength(JSON.stringify({
			...command,
			preparationId
		}));
		const cancellation = command.type === "prepare" ? new MessageChannel() : void 0;
		const abort = () => {
			if (cancellation) {
				cancellation.port1.postMessage({ type: "abort" });
				recordWorkerMessage("resource", "to_worker");
			}
		};
		const input = command.type === "prepare" && cancellation ? {
			...command,
			preparationId,
			abortPort: cancellation.port2
		} : {
			...command,
			preparationId
		};
		requests++;
		let pendingClose;
		const preparation = {
			directories: /* @__PURE__ */ new Set(),
			abort() {
				if (task.read().status === "pending") abort();
			},
			startClose,
			serviceClose: () => pendingClose?.service(),
			releaseIfComplete() {
				if (request?.read().status !== "pending" && preparation.directories.size === 0) preparations.delete(preparationId);
			}
		};
		preparations.set(preparationId, preparation);
		let task;
		try {
			task = pool.startTask(() => {
				if (unavailable !== void 0) throw unavailable.error;
				signal?.throwIfAborted();
				signal?.addEventListener("abort", abort, { once: true });
				return input;
			}, {
				inputBytes,
				transferList: () => cancellation ? [cancellation.port2] : []
			});
		} catch (error) {
			const refused = createRetainedOperation(() => {});
			refused.reject(error);
			task = {
				...refused.operation,
				release: completed
			};
		}
		let release;
		const result = mapRetainedOperation(task, (reply) => {
			if (reply.type === "failed") {
				const error = decodeSqliteSnapshotStagingError(reply.error);
				throw reply.cleanupFailure && !(error instanceof AggregateError) ? new SqliteSnapshotCleanupError(String(error), { cause: error }) : error;
			}
			return reply;
		});
		const request = finallyRetainedOperation(result, () => release = finallyRetainedOperation(task.release(), () => {
			signal?.removeEventListener("abort", abort);
			cancellation?.port1.close();
			cancellation?.port2.close();
			requests--;
			return closeWhenIdle();
		}), (error, cleanupError) => createSqliteLifecycleAggregateError([error, cleanupError], "SQLite snapshot staging failed", error));
		function startClose() {
			if (pendingClose?.read().status === "pending") return pendingClose;
			let removals;
			let servicing = false;
			const closing = createRetainedOperation(() => {
				if (servicing || closing.operation.read().status !== "pending") return;
				servicing = true;
				try {
					serviceRequests();
					request.service();
					if (request.read().status === "pending") return;
					removals ??= [...preparation.directories].map((directory) => {
						const removal = startRemoveTempDirectory(directory);
						removal.result.then(() => closing.operation.service(), () => closing.operation.service());
						return [directory, removal];
					});
					for (const [directory, removal] of removals) {
						removal.service();
						const outcome = removal.read();
						if (outcome.status === "pending") return;
						if (outcome.status === "rejected") throw outcome.error;
						if (!outcome.value) throw new SqliteSnapshotCleanupError(`SQLite staging preparation cleanup failed: ${directory}`);
					}
					const released = release?.read();
					if (released?.status === "rejected") throw released.error;
					preparation.releaseIfComplete();
					closing.resolve(void 0);
				} catch (error) {
					closing.reject(error);
				} finally {
					servicing = false;
				}
			});
			pendingClose = closing.operation;
			request.result.then(() => closing.operation.service(), () => closing.operation.service());
			closing.operation.service();
			return closing.operation;
		}
		const finish = () => {
			activeRequests.delete(request);
			preparation.releaseIfComplete();
		};
		request.result.then(finish, finish);
		if (request.read().status === "pending") activeRequests.add(request);
		else finish();
		return {
			...request,
			service: serviceRequests,
			startClose
		};
	};
	const owner = {
		start,
		retainDirectory
	};
	nativeSource.retain(owner, async () => {
		admissionClosed = true;
		for (const preparation of preparations.values()) preparation.abort();
		await Promise.allSettled([...activeRequests].map((request) => request.result));
		const closures = Array.from(preparations.values()).map((preparation) => preparation.startClose());
		const failures = (await Promise.allSettled(closures.map((close) => close.result))).flatMap((outcome) => outcome.status === "rejected" ? [outcome.reason] : []);
		if (failures.length) throw createSqliteLifecycleAggregateError(failures, "SQLite snapshot generation cleanup failed", failures[0]);
		await closeWhenIdle().result;
		await pool.close();
	});
	return owner;
}
function captureSqliteSnapshotStagingOwner() {
	const { moduleUrl, runtimeGeneration } = captureRuntimeWorkerSource(resolveRuntimeProcessEntrypointUrl("sqliteSnapshotStaging"));
	const nativeSource = captureRetainedNativeWorkerSource({ runtimeGeneration });
	const owners = resolveGlobalSingleton(Symbol.for("openclaw.sqliteSnapshotStagingOwner"), () => /* @__PURE__ */ new WeakMap());
	let owner = owners.get(nativeSource);
	if (!owner) {
		owner = runInDetachedAsyncContext(() => createStagingOwner(moduleUrl, nativeSource));
		owners.set(nativeSource, owner);
	}
	return owner;
}
//#endregion
export { captureSqliteSnapshotStagingOwner as t };
