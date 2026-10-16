import { n as resolveForwardedExitCompilerArgs } from "./node-exit-safe-compilers-B7V3uapp.mjs";
import { D as isRecord, S as resolveGlobalSingleton, h as resolveTimerTimeoutMs } from "./number-coercion-CmpLVzZ6.mjs";
import { f as tryProcessCwd } from "./utils-BfTq4rUg.mjs";
import { A as hasErrnoCode, at as sliceUtf16Safe, st as expectDefined, v as resolveStateDir } from "./redact-TLu2QTmL.mjs";
import "./async-work-scope-6N1oTppj.mjs";
import { b as readDatabaseFileIdentity } from "./openclaw-state-db-schema-migration-required-DtltEO1E.mjs";
import { a as captureRetainedNativeWorkerSource, i as DEFAULT_WORKER_PENDING_BYTES, n as createOwnedWorkerTaskPool } from "./worker-task-pool-BXDBEv3e.mjs";
import { at as createSqliteLifecycleAggregateError, d as settleSqliteSnapshotRequest, f as startRemoveTempDirectory, i as registerRetainedSnapshotTempDirectory, t as SqliteSnapshotCleanupError, u as sealRetainedSnapshotTempDirectory, y as markPrivateDirectoryCreationRefused } from "./sqlite-readonly-location-cleanup-CmRNKiuM.mjs";
import { t as createSubsystemLogger } from "./subsystem-M2sQt_up.mjs";
import { n as runtimeProcessEntrypoints, t as SQLITE_READONLY_CHILD_ARG } from "./runtime-process-entrypoints-Dgz2IR4T.mjs";
import { f as captureRuntimeWorkerSource, t as createRetainedOperation } from "./retained-operation-Dsn-U2KQ.mjs";
import { i as resolveRuntimeWorkerUrl, n as resolveRuntimeWorkerArgv } from "./runtime-worker-url-QXcu2VO1.mjs";
import { a as hydrateOpenClawStateWorkerError, i as encodeOpenClawStateWorkerError, o as retainOpenClawStateWorkerErrorPayload, r as resolveNodeCompileCacheEnv } from "./sqlite-worker-transfer-DphMZ7LJ.mjs";
import { n as resolveRuntimeProcessEntrypointUrl } from "./runtime-process-url-C4UiB3n2.mjs";
import { n as getSpawnBroker } from "./spawn-diagnostics-C-w4nT88.mjs";
import "node:v8";
import { spawnSync } from "node:child_process";
import fsSync from "node:fs";
import path from "node:path";
import { tmpdir } from "node:os";
import { AsyncLocalStorage } from "node:async_hooks";
import { performance } from "node:perf_hooks";
import { MessageChannel, receiveMessageOnPort } from "node:worker_threads";
import { toUSVString } from "node:util";
//#region packages/normalization-core/src/format.ts
const BYTE_SIZE_UNITS = [
	"byte",
	"kilo",
	"mega",
	"giga",
	"tera"
];
const BYTE_SIZE_STYLES = {
	iec: {
		base: 1024,
		labels: [
			"B",
			"KiB",
			"MiB",
			"GiB",
			"TiB"
		]
	},
	"legacy-binary": {
		base: 1024,
		labels: [
			"B",
			"KB",
			"MB",
			"GB",
			"TB"
		]
	}
};
/** Formats a byte count with caller-explicit scale, labels, precision, and unit cap. */
function formatByteSize(bytes, options) {
	const { base, labels } = BYTE_SIZE_STYLES[options.style];
	const maxUnitIndex = BYTE_SIZE_UNITS.indexOf(options.maxUnit);
	let unitIndex = 0;
	let value = bytes;
	while (value >= base && unitIndex < maxUnitIndex) {
		value /= base;
		unitIndex += 1;
	}
	const unit = expectDefined(BYTE_SIZE_UNITS[unitIndex], "byte-size unit");
	const label = expectDefined(labels[unitIndex], "byte-size label");
	const fractionDigits = typeof options.fractionDigits === "function" ? options.fractionDigits(value, unit) : options.fractionDigits;
	if (fractionDigits === null) return `${value}${options.separator}${label}`;
	if (options.floorUnits?.includes(unit)) value = Math.floor(value * 10 ** fractionDigits) / 10 ** fractionDigits;
	return `${value.toFixed(fractionDigits)}${options.separator}${label}`;
}
//#endregion
//#region src/infra/sqlite-readonly-worker-context.ts
const readOnlyWorkerScope = new AsyncLocalStorage();
//#endregion
//#region src/infra/sqlite-readonly-worker-protocol.ts
const SQLITE_READONLY_WORKER_MAX_BUFFER = 1048576;
function isSqliteSnapshotStagingMode(mode) {
	return mode === "staging-create" || mode === "staging-create-legacy" || mode === "staging-reconcile" || mode === "staging-retire";
}
var SqliteReadOnlyInspectionContentionError = class extends Error {};
var SqliteSnapshotAllocationRefusedError = class extends Error {};
function sqliteReadOnlyWorkerRequestArgs(pathname, options) {
	const args = [options.mode, path.resolve(pathname)];
	const stagingRoot = options.stagingRoot && path.resolve(options.stagingRoot);
	const expected = options.mode === "auth-profile-rows" || options.mode === "operation" ? void 0 : options.expectedSourceIdentity;
	if (expected !== void 0) {
		if (options.mode !== "sync") throw new Error("SQLite source identity is supported only for artifact-preserving sync copies");
		args.push(stagingRoot ?? "", JSON.stringify(readDatabaseFileIdentity(expected)));
	} else if (stagingRoot) args.push(stagingRoot);
	return args;
}
function isSqliteReadOnlyWorkerResult(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return false;
	if (Object.keys(value).length !== 2 || !("ok" in value)) return false;
	return value.ok === true && "location" in value && typeof value.location === "string" || value.ok === true && "contentVersion" in value && typeof value.contentVersion === "string" && /^(?:[a-f0-9]{64})?$/.test(value.contentVersion) || value.ok === true && "warnings" in value && Array.isArray(value.warnings) && value.warnings.every((warning) => typeof warning === "string") || value.ok === false && "message" in value && typeof value.message === "string";
}
function createSqliteReadOnlyWorkerError(message, stderr, options) {
	const stderrTail = toUSVString(sliceUtf16Safe(stderr.trim(), -4e3));
	return new Error(`SQLite read-only worker ${message}${stderrTail ? `\nstderr (tail): ${stderrTail}` : ""}`, options);
}
function parseSqliteReadOnlyWorkerResult(stdout, stderr) {
	if (!stdout.trim()) throw createSqliteReadOnlyWorkerError("returned no JSON result", stderr);
	let message;
	try {
		message = JSON.parse(stdout);
	} catch {
		throw createSqliteReadOnlyWorkerError("returned invalid JSON", stderr);
	}
	if (!isSqliteReadOnlyWorkerResult(message)) throw createSqliteReadOnlyWorkerError("returned an invalid result", stderr);
	return message;
}
function readSqliteReadOnlyWorkerValue(params, mode) {
	if (params.kind === "launch-failed") throw params.error;
	let result;
	try {
		result = parseSqliteReadOnlyWorkerResult(params.stdout, params.stderr);
	} catch (error) {
		if (params.failure) throw createSqliteReadOnlyWorkerError(params.failure, params.stderr, { cause: params.cause });
		throw error;
	}
	if (params.status !== 0 || params.failure || !result.ok) {
		const contention = !result.ok && result.message.startsWith("Retryable SQLite inspection contention: ");
		const message = !result.ok ? contention ? result.message.slice(40) : result.message : params.failure ?? `exited with code ${params.status}`;
		const allocationRefused = params.failure === void 0 && !result.ok && (mode === "staging-create" || mode === "staging-create-legacy") && message.startsWith("SQLite snapshot directory creation refused: ");
		const error = createSqliteReadOnlyWorkerError(allocationRefused ? message.slice(44) : message, params.stderr, { cause: params.cause });
		if (contention) {
			const failure = new SqliteReadOnlyInspectionContentionError(error.message);
			throw allocationRefused ? markPrivateDirectoryCreationRefused(failure) : failure;
		}
		if (allocationRefused) throw new SqliteSnapshotAllocationRefusedError(error.message);
		throw error;
	}
	if ((mode === "sync" || mode === "async" || mode === "consolidated" || isSqliteSnapshotStagingMode(mode)) && "location" in result) return result.location;
	if (mode === "content-version" && "contentVersion" in result) return result.contentVersion;
	if (mode === "reclaim" && "warnings" in result) return result.warnings;
	throw createSqliteReadOnlyWorkerError("returned a result for a different operation", params.stderr);
}
//#endregion
//#region src/infra/sqlite-readonly-worker.ts
const SQLITE_INSPECTION_TIMEOUT_MS = 3e5;
const SQLITE_INSPECTION_BYTES_PER_SECOND = 33554432;
const log = createSubsystemLogger("state/sqlite");
function resolveSqliteInspectionBudget(operation, pathname, sizeBytes) {
	const timeoutMs = resolveTimerTimeoutMs(SQLITE_INSPECTION_TIMEOUT_MS + Math.ceil(40 * Number(sizeBytes ?? 0) / SQLITE_INSPECTION_BYTES_PER_SECOND) * 1e3, SQLITE_INSPECTION_TIMEOUT_MS);
	const size = sizeBytes === void 0 ? "unknown size" : formatByteSize(Number(sizeBytes), {
		style: "iec",
		maxUnit: "giga",
		separator: " ",
		fractionDigits: sizeBytes < 1024n ? 0 : 1
	});
	if (timeoutMs > SQLITE_INSPECTION_TIMEOUT_MS) log.debug(`SQLite ${operation} for ${pathname}: ${size}, budget ${timeoutMs / 1e3} seconds`);
	return {
		timeoutMs,
		size
	};
}
function readSqliteInspectionBudget(operation, pathname, mainSizeBytes) {
	let sizeBytes = mainSizeBytes;
	try {
		sizeBytes ??= fsSync.statSync(pathname, { bigint: true }).size;
		for (const suffix of [
			"-wal",
			"-shm",
			"-journal"
		]) try {
			sizeBytes += fsSync.statSync(pathname + suffix, { bigint: true }).size;
		} catch (error) {
			if (!hasErrnoCode(error, "ENOENT")) throw error;
		}
	} catch {}
	return resolveSqliteInspectionBudget(operation, pathname, sizeBytes);
}
function sqliteInspectionTimeoutError(operation, pathname, timeoutMs, size) {
	return /* @__PURE__ */ new Error(`SQLite ${operation} timed out after ${timeoutMs / 1e3} seconds (budget for ${size}) for ${pathname}. Stop the Gateway service and other OpenClaw processes using this database, then retry; if already stopped, check storage performance.`);
}
/** A retained startup inspection is cancelled by its Gateway, not by its foreground wait. */
function isSqliteInspectionDeadlineOwnedByCaller() {
	return readOnlyWorkerScope.getStore()?.deadlineOwnedByCaller === true;
}
function resolveSqliteInspectionSignal(signal) {
	const scope = readOnlyWorkerScope.getStore();
	return scope ? signal ? AbortSignal.any([signal, scope.controller.signal]) : scope.controller.signal : signal;
}
function sqliteReadOnlyWorkerArgv(pathname, options) {
	const { moduleUrl, runtimeGeneration } = captureRuntimeWorkerSource(resolveRuntimeWorkerUrl(options.mode === "content-version" ? runtimeProcessEntrypoints.sqliteSourceRevision : runtimeProcessEntrypoints.sqliteReadOnly));
	return {
		runtimeGeneration,
		argv: [
			...resolveForwardedExitCompilerArgs(),
			...resolveRuntimeWorkerArgv(moduleUrl),
			SQLITE_READONLY_CHILD_ARG,
			...sqliteReadOnlyWorkerRequestArgs(pathname, options)
		]
	};
}
/** Capture launch facts before awaiting another session's retirement. */
function captureSqliteReadOnlyWorkerLaunch(env, source) {
	const broker = source === "canonical" ? getSpawnBroker() : void 0;
	return {
		runtimeGeneration: captureRuntimeWorkerSource(resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.sqliteReadOnly)).runtimeGeneration,
		env: {
			...resolveNodeCompileCacheEnv(env),
			OPENCLAW_STATE_DIR: resolveStateDir(env)
		},
		cwd: tryProcessCwd() ?? tmpdir(),
		transport: broker ? {
			kind: "broker",
			owner: broker
		} : { kind: "native" }
	};
}
function runSqliteReadOnlyWorkerSync(pathname, stagingRoot, mode = "sync") {
	const { timeoutMs, size } = readSqliteInspectionBudget("read-only snapshot", pathname);
	const started = log.isEnabled("trace") ? performance.now() : void 0;
	const result = spawnSync(process.execPath, sqliteReadOnlyWorkerArgv(pathname, {
		mode,
		stagingRoot
	}).argv, {
		encoding: "utf8",
		env: resolveNodeCompileCacheEnv(),
		maxBuffer: SQLITE_READONLY_WORKER_MAX_BUFFER,
		timeout: timeoutMs,
		killSignal: "SIGKILL"
	});
	if (started !== void 0) log.trace(`SQLite read-only snapshot child durationMs=${performance.now() - started}`);
	return readSqliteReadOnlyWorkerValue(result.error ? {
		kind: "launch-failed",
		error: new Error(hasErrnoCode(result.error, "ETIMEDOUT") ? sqliteInspectionTimeoutError("read-only snapshot", pathname, timeoutMs, size).message : `SQLite read-only worker failed to start for ${pathname}: ${result.error.message}`, { cause: result.error })
	} : {
		kind: "launched",
		stdout: result.stdout,
		stderr: result.stderr,
		status: result.status,
		failure: result.status === 0 ? void 0 : `exited with ${result.signal ? `signal ${result.signal}` : `code ${result.status}`}`
	}, mode);
}
//#endregion
//#region src/infra/sqlite-readonly-native-resource.client.ts
/** Host-port framing; the staging owner alone admits readers and retires directories. */
function createSqliteReadOnlyNativeResourceConnection(callbacks) {
	const { port1, port2 } = new MessageChannel();
	const owner = { disposed: false };
	const receive = (value) => {
		if (!isRecord(value) || typeof value.id !== "number" || !Number.isSafeInteger(value.id) || value.id < 1) throw new SqliteSnapshotCleanupError("SQLite snapshot native owner sent an invalid request");
		let reply;
		try {
			if (typeof value.directory !== "string" || !value.directory || value.directory.includes("\0")) throw new SqliteSnapshotCleanupError("SQLite snapshot native owner sent an invalid directory");
			let request;
			if (value.type === "allocated") {
				if (typeof value.preparationId !== "number" || !Number.isSafeInteger(value.preparationId) || value.preparationId < 1) throw new SqliteSnapshotCleanupError("SQLite snapshot has no preparation identity");
				request = {
					id: value.id,
					type: value.type,
					directory: value.directory,
					preparationId: value.preparationId
				};
			} else if (value.type === "retire" || value.type === "removed") request = {
				id: value.id,
				type: value.type,
				directory: value.directory
			};
			else throw new SqliteSnapshotCleanupError("SQLite snapshot native owner sent an unsupported request");
			callbacks.receive(request, owner);
			reply = {
				id: value.id,
				ok: true
			};
		} catch (error) {
			const encoded = encodeOpenClawStateWorkerError(error, { includeOrdinary: true });
			if (!encoded) throw error;
			reply = {
				id: value.id,
				ok: false,
				error: encoded
			};
		}
		port1.postMessage(reply);
	};
	const fail = (error) => {
		callbacks.onFailure(error);
		port1.close();
	};
	const onMessage = (value) => {
		try {
			receive(value);
		} catch (error) {
			fail(error);
		}
	};
	port1.on("message", onMessage);
	port1.on("messageerror", fail);
	return {
		port: port2,
		service() {
			if (owner.disposed) return;
			for (;;) {
				const next = receiveMessageOnPort(port1);
				if (!next) return;
				try {
					receive(next.message);
				} catch (error) {
					fail(error);
					throw error;
				}
			}
		},
		decodeCloseError(payload) {
			const remote = /* @__PURE__ */ new Error("SQLite snapshot staging failed");
			retainOpenClawStateWorkerErrorPayload(remote, payload);
			const error = hydrateOpenClawStateWorkerError(remote, { includeOrdinary: true });
			return error instanceof AggregateError ? error : new SqliteSnapshotCleanupError(error.message, { cause: error });
		},
		dispose() {
			owner.disposed = true;
			callbacks.onDispose(owner);
			port1.removeAllListeners();
			port1.close();
			port2.close();
		}
	};
}
//#endregion
//#region src/infra/sqlite-readonly-native-resource.types.ts
const SQLITE_NATIVE_RESOURCE_PORT = "sqliteSnapshotNativeResource";
//#endregion
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
export { resolveSqliteInspectionSignal as a, isSqliteInspectionDeadlineOwnedByCaller as i, captureSqliteSnapshotStagingOwner as n, runSqliteReadOnlyWorkerSync as o, captureSqliteReadOnlyWorkerLaunch as r, allocateWorkerOwnedSqliteSnapshotDirectory as t };
