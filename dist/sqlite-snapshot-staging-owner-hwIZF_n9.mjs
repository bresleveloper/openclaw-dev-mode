import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { t as createRetainedOperation } from "./retained-operation-CODoIe4t.mjs";
import { a as createSqliteLifecycleAggregateError } from "./sqlite-lifecycle-errors-DuOygjcn.mjs";
import { a as registerRetainedSnapshotTempDirectory, f as sealRetainedSnapshotTempDirectory, m as startRemoveTempDirectory, p as settleSqliteSnapshotRequest, t as SqliteSnapshotCleanupError } from "./sqlite-readonly-location-cleanup-CPS8QEIp.mjs";
import { t as captureRuntimeWorkerSource } from "./runtime-worker-generation-DCJaEqeS.mjs";
import { t as captureSqliteReadOnlyWorkerLaunch } from "./sqlite-readonly-worker-TSy0m8v6.mjs";
import { n as resolveRuntimeProcessEntrypointUrl } from "./runtime-process-url-D3H3_asn.mjs";
import { n as hydrateOpenClawStateWorkerError, r as retainOpenClawStateWorkerErrorPayload } from "./openclaw-state-worker-error-Cmtk9G4_.mjs";
import { r as createSqliteReadOnlyNativeResourceConnection, t as SQLITE_NATIVE_RESOURCE_PORT } from "./sqlite-readonly-native-resource.types-Dze2GxGD.mjs";
import { t as captureRetainedNativeWorkerSource } from "./worker-native-lifecycle-VAONWs_C.mjs";
import { i as DEFAULT_WORKER_PENDING_BYTES } from "./src-WCJCjrey.mjs";
import { n as createOwnedWorkerTaskPool } from "./worker-task-pool-iI3pfrsK.mjs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import { MessageChannel } from "node:worker_threads";
//#region src/infra/sqlite-snapshot-staging-error.ts
function decodeSqliteSnapshotStagingError(payload) {
	const remote = /* @__PURE__ */ new Error("SQLite snapshot staging failed");
	retainOpenClawStateWorkerErrorPayload(remote, payload);
	return hydrateOpenClawStateWorkerError(remote, { includeOrdinary: true });
}
//#endregion
//#region src/infra/sqlite-snapshot-staging-owner.ts
/** The existing staging owner retains its child; this transport only moves its event loop. */
function createStagingOwner(workerUrl, nativeSource) {
	const nativeDirectories = /* @__PURE__ */ new Map();
	const nativeResource = nativeSource.captureResource(resolveRuntimeProcessEntrypointUrl("sqliteReadOnlyNativeResource"), SQLITE_NATIVE_RESOURCE_PORT, void 0, connectNativeResource);
	const pool = createOwnedWorkerTaskPool({
		workerUrl,
		maxWorkers: 1,
		idleTimeoutMs: 0,
		maxPendingTasks: 128,
		maxPendingBytes: DEFAULT_WORKER_PENDING_BYTES
	}, {
		retainedTransport: true,
		nativeSource,
		nativeResource,
		decodeResourceError: decodeSqliteSnapshotStagingError
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
			receive(value, owner) {
				const directory = value.directory;
				const existing = nativeDirectories.get(directory);
				if (value.type === "allocated") {
					const preparation = preparations.get(value.preparationId);
					if (!preparation?.isAdmitted()) throw new SqliteSnapshotCleanupError("SQLite snapshot preparation custody is unavailable");
					preparation.acceptOwner(owner);
					if (existing && (existing.owner !== owner || existing.preparationId !== value.preparationId)) throw new SqliteSnapshotCleanupError("SQLite snapshot changed its original native owner");
					if (!existing) nativeDirectories.set(directory, {
						owner,
						preparationId: value.preparationId,
						removed: false,
						recovering: false
					});
					preparation.directories.add(directory);
					retainDirectory(directory);
					if (preparation.closeRequested) try {
						sealRetainedSnapshotTempDirectory(directory);
					} catch {}
				} else {
					if (existing?.owner !== owner) throw new SqliteSnapshotCleanupError("SQLite snapshot native custody is unavailable");
					if (value.type === "retire") {
						sealRetainedSnapshotTempDirectory(directory, { requireRequested: true });
						existing.recovering = true;
					} else if (value.type === "removed") existing.removed = true;
				}
			},
			onFailure(error) {
				unavailable ??= { error };
			},
			onDispose(owner) {
				for (const [directory, record] of nativeDirectories) if (record.owner === owner && record.removed && !directories.has(directory)) nativeDirectories.delete(directory);
			}
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
		let close;
		let rotate;
		const retained = createRetainedOperation(() => {
			if (retained.operation.read().status !== "pending") return;
			if (!close) {
				if (requests > 0 || directories.size > 0) return retained.resolve(void 0);
				close = pool.startCloseResources();
				close.result.then(serviceIdleClose, serviceIdleClose);
			}
			close.service();
			const closed = close.read();
			if (closed.status === "pending") return;
			if (closed.status === "rejected") return retained.reject(closed.error);
			if (!rotate) {
				if (requests > 0 || directories.size > 0) return retained.resolve(void 0);
				rotate = pool.startRotate();
				rotate.result.then(serviceIdleClose, serviceIdleClose);
			}
			rotate.service();
			const rotated = rotate.read();
			if (rotated.status === "fulfilled") {
				unavailable = void 0;
				retained.resolve(void 0);
			} else if (rotated.status === "rejected") retained.reject(rotated.error);
		});
		const serviceIdleClose = retained.operation.service.bind(retained.operation);
		idleClose = retained.operation;
		retained.operation.service();
		return retained.operation;
	};
	const retainDirectory = (directory) => {
		const existing = directories.get(directory);
		if (existing) return existing;
		const preparationId = nativeDirectories.get(directory)?.preparationId;
		let pending;
		let removed = false;
		const startRetire = () => {
			if (pending?.read().status === "pending") return pending;
			let cleanup;
			let closing;
			const retained = createRetainedOperation(() => {
				if (retained.operation.read().status !== "pending") return;
				if (!removed) {
					const nativeDirectory = nativeDirectories.get(directory);
					if (!nativeDirectory?.removed || !nativeDirectory.recovering) {
						if (!cleanup) {
							try {
								sealRetainedSnapshotTempDirectory(directory);
								cleanup = pool.startCloseResources(directory);
							} catch (error) {
								retained.reject(error);
								return;
							}
							cleanup.result.then(serviceDirectoryClose, serviceDirectoryClose);
						}
						cleanup.service();
						const outcome = cleanup.read();
						if (outcome.status === "pending") return;
						if (outcome.status === "rejected") {
							retained.reject(outcome.error);
							return;
						}
						if (!nativeDirectories.get(directory)?.removed) {
							retained.reject(new SqliteSnapshotCleanupError(`SQLite snapshot native owner did not confirm directory removal: ${directory}`));
							return;
						}
					}
					removed = true;
					directories.delete(directory);
					if (!nativeDirectory?.recovering || nativeDirectory.owner.disposed) nativeDirectories.delete(directory);
				}
				if (!closing) {
					closing = closeWhenIdle();
					closing.result.then(serviceDirectoryClose, serviceDirectoryClose);
				}
				closing.service();
				const outcome = closing.read();
				if (outcome.status === "fulfilled") {
					if (preparationId !== void 0) {
						const preparation = preparations.get(preparationId);
						preparation?.directories.delete(directory);
						preparation?.releaseIfComplete();
					}
					retained.resolve(void 0);
				} else if (outcome.status === "rejected") retained.reject(outcome.error);
			});
			const serviceDirectoryClose = retained.operation.service.bind(retained.operation);
			pending = retained.operation;
			retained.operation.service();
			return retained.operation;
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
		const runInContext = AsyncLocalStorage.snapshot();
		const priorClose = idleClose;
		priorClose?.service();
		const cancellation = command.type === "prepare" ? new MessageChannel() : void 0;
		const abort = () => cancellation?.port1.postMessage({ type: "abort" });
		signal?.addEventListener("abort", abort, { once: true });
		if (signal?.aborted) abort();
		const input = command.type === "prepare" && cancellation ? {
			...command,
			preparationId,
			abortPort: cancellation.port2
		} : {
			...command,
			preparationId
		};
		requests++;
		let inputPrepared = false;
		let task;
		let admissionFailure;
		let custodyReleased = false;
		let pendingClose;
		let closeService;
		let admitting = true;
		let originalNativeOwner;
		let release;
		let closing;
		let observed = false;
		let reply;
		let refusedByCleanup;
		const errors = [];
		let servicing = false;
		const retained = createRetainedOperation(() => runInContext(service));
		const serviceRequest = retained.operation.service.bind(retained.operation);
		const preparation = {
			directories: /* @__PURE__ */ new Set(),
			closeRequested: false,
			isAdmitted: () => inputPrepared,
			acceptOwner(owner) {
				if (originalNativeOwner && originalNativeOwner !== owner) throw new SqliteSnapshotCleanupError("SQLite preparation changed its original native owner");
				originalNativeOwner = owner;
			},
			startClose,
			serviceClose: () => closeService?.(),
			releaseIfComplete
		};
		preparations.set(preparationId, preparation);
		try {
			task = pool.startTask(() => {
				if (unavailable !== void 0) throw unavailable.error;
				signal?.throwIfAborted();
				inputPrepared = true;
				return input;
			}, {
				inputBytes,
				transferList: () => cancellation ? [cancellation.port2] : []
			});
		} catch (error) {
			admissionFailure = { error };
			requests--;
			signal?.removeEventListener("abort", abort);
			cancellation?.port1.close();
			cancellation?.port2.close();
		}
		admitting = false;
		function service() {
			if (admitting || servicing || retained.operation.read().status !== "pending") return;
			servicing = true;
			try {
				priorClose?.service();
				const previous = priorClose?.read();
				const failure = unavailable ?? (previous?.status === "rejected" ? previous : void 0);
				if (failure && !inputPrepared && task?.read().status === "pending") {
					refusedByCleanup = new SqliteSnapshotCleanupError("SQLite snapshot staging cleanup failed before admission", { cause: failure.error });
					release = task.release();
				}
				if (!task) {
					retained.reject(admissionFailure?.error ?? /* @__PURE__ */ new Error("SQLite staging task is unavailable"));
					return;
				}
				task.service();
				const result = task.read();
				if (result.status === "pending") return;
				if (!observed) {
					observed = true;
					if (result.status === "rejected") {
						errors.push(refusedByCleanup ?? result.error);
						if (inputPrepared && directories.size > 0) unavailable = { error: result.error };
					} else if (result.value.type === "failed") {
						if (result.value.directory && !preparation.directories.has(result.value.directory)) errors.push(new SqliteSnapshotCleanupError("SQLite staging failure lost its original directory custody"));
						const error = decodeSqliteSnapshotStagingError(result.value.error);
						errors.push(result.value.cleanupFailure && !(error instanceof AggregateError) ? new SqliteSnapshotCleanupError(String(error), { cause: error }) : error);
					} else if (!preparation.directories.has(result.value.directory)) errors.push(new SqliteSnapshotCleanupError("SQLite staging result lost its original directory custody"));
					else reply = result.value;
					release ??= task.release();
					release.result.then(serviceRequest, serviceRequest);
				}
				release.service();
				const released = release.read();
				if (released.status === "pending") return;
				if (!closing) {
					signal?.removeEventListener("abort", abort);
					cancellation?.port1.close();
					cancellation?.port2.close();
					requests--;
					if (released.status === "rejected") errors.push(released.error);
					closing = closeWhenIdle();
					closing.result.then(serviceRequest, serviceRequest);
				}
				closing.service();
				const closed = closing.read();
				if (closed.status === "pending") return;
				if (closed.status === "rejected") errors.push(closed.error);
				if (errors.length > 1) retained.reject(createSqliteLifecycleAggregateError(errors, "SQLite snapshot staging failed", errors[0]));
				else if (errors.length === 1) retained.reject(errors[0]);
				else if (reply) retained.resolve(reply);
				else retained.reject(/* @__PURE__ */ new Error("SQLite snapshot staging returned no outcome"));
			} finally {
				servicing = false;
				if (retained.operation.read().status !== "pending") {
					activeRequests.delete(retained.operation);
					releaseIfComplete();
				}
			}
		}
		function releaseIfComplete() {
			if (retained.operation.read().status !== "pending" && pendingClose?.read().status !== "pending" && preparation.directories.size === 0 && release?.read().status === "fulfilled" && closing?.read().status === "fulfilled") {
				custodyReleased = true;
				preparations.delete(preparationId);
			}
		}
		function startClose() {
			preparation.closeRequested = true;
			if (pendingClose?.read().status === "pending") return pendingClose;
			let rawRelease;
			const removals = /* @__PURE__ */ new Map();
			const removalFailures = /* @__PURE__ */ new Map();
			let servicingClose = false;
			const completion = createRetainedOperation(() => runInContext(() => {
				if (admitting) return;
				if (servicingClose || completion.operation.read().status !== "pending") return;
				servicingClose = true;
				try {
					if (custodyReleased) {
						completion.resolve();
						return;
					}
					if (!task) throw new SqliteSnapshotCleanupError("SQLite staging admission did not return its original task custody", { cause: admissionFailure?.error });
					for (;;) {
						for (const directory of preparation.directories) try {
							sealRetainedSnapshotTempDirectory(directory);
						} catch {}
						serviceRequests();
						task.service();
						if (task.read().status === "pending") return;
						const failures = [];
						for (const directory of preparation.directories) {
							let removal = removals.get(directory);
							if (!removal) {
								removal = startRemoveTempDirectory(directory, (error) => removalFailures.set(directory, error));
								removals.set(directory, removal);
								removal.result.then(serviceRequestClose, serviceRequestClose);
							}
						}
						for (const [directory, removal] of removals) {
							removal.service();
							const removed = removal.read();
							if (removed.status === "pending") return;
							if (removed.status === "rejected") failures.push(removed.error);
							else if (!removed.value) failures.push(removalFailures.get(directory) ?? new SqliteSnapshotCleanupError(`SQLite staging preparation cleanup failed: ${directory}`));
						}
						if (failures.length) throw createSqliteLifecycleAggregateError(failures, "SQLite staging preparation cleanup failed", failures[0]);
						if (!rawRelease) {
							rawRelease = task.release();
							rawRelease.result.then(serviceRequestClose, serviceRequestClose);
						}
						rawRelease.service();
						const joined = rawRelease.read();
						if (joined.status === "pending") return;
						if (joined.status === "rejected") throw joined.error;
						if (preparation.directories.size > 0) {
							if ([...preparation.directories].some((directory) => !removals.has(directory))) continue;
							throw new SqliteSnapshotCleanupError("SQLite staging directory custody was not released");
						}
						service();
						if (retained.operation.read().status === "pending") return;
						const idle = closing?.read();
						if (inputPrepared && idle?.status === "rejected" && removals.size === 0) throw idle.error;
						custodyReleased = true;
						preparations.delete(preparationId);
						completion.resolve();
						return;
					}
				} catch (error) {
					completion.reject(error);
				} finally {
					servicingClose = false;
				}
			}));
			const serviceRequestClose = completion.operation.service.bind(completion.operation);
			closeService = serviceRequestClose;
			pendingClose = {
				...completion.operation,
				service: serviceRequests
			};
			if (task) task.result.then(serviceRequestClose, serviceRequestClose);
			retained.operation.result.then(serviceRequestClose, serviceRequestClose);
			completion.operation.service();
			return pendingClose;
		}
		priorClose?.result.then(serviceRequest, serviceRequest);
		if (task) task.result.then(serviceRequest, serviceRequest);
		activeRequests.add(retained.operation);
		retained.operation.service();
		closeService?.();
		return {
			...retained.operation,
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
		for (const preparation of preparations.values()) preparation.closeRequested = true;
		await Promise.allSettled([...activeRequests].map((request) => request.result));
		for (const directory of directories.keys()) try {
			sealRetainedSnapshotTempDirectory(directory);
		} catch {}
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
		owner = createStagingOwner(moduleUrl, nativeSource);
		owners.set(nativeSource, owner);
	}
	return owner;
}
async function allocateWorkerOwnedSqliteSnapshotDirectory(inputRoot, allowLegacyWorker, signal) {
	const root = path.resolve(inputRoot);
	const { env, cwd } = captureSqliteReadOnlyWorkerLaunch();
	const owner = captureSqliteSnapshotStagingOwner();
	const request = owner.start({
		type: "allocate",
		root,
		allowLegacyWorker,
		launch: {
			env,
			cwd,
			transport: { kind: "native" }
		}
	}, signal);
	const reply = await settleSqliteSnapshotRequest(request);
	return owner.retainDirectory(reply.directory);
}
//#endregion
export { captureSqliteSnapshotStagingOwner as n, allocateWorkerOwnedSqliteSnapshotDirectory as t };
