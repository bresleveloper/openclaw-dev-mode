import { F as resolveTimerTimeoutMs } from "./number-coercion-CkhMiRw8.mjs";
import { t as runInDetachedAsyncContext } from "./detached-async-context-D04NzekX.mjs";
import { n as tryProcessCwd } from "./safe-cwd-DOxDm8mD.mjs";
import "./src-Djeo9OvP.mjs";
import { n as formatByteSize } from "./format-C1IjPxxo.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { o as racePromiseWithAbortSignal } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { n as resolveRuntimeWorkerArgv } from "./runtime-worker-url-CvMrvFI1.mjs";
import { a as createSqliteLifecycleAggregateError } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { t as SQLITE_READONLY_CHILD_ARG } from "./runtime-process-entrypoints-BMmG9cQl.mjs";
import { n as resolveRuntimeProcessEntrypointUrl } from "./runtime-process-url-BCfqgqXF.mjs";
import { t as captureRuntimeWorkerSource } from "./runtime-worker-generation-DvW-aFj2.mjs";
import { o as getSqliteRuntimeCapabilities } from "./bun-sqlite-library-CYR1RYZS.mjs";
import { t as getSpawnBroker } from "./context-JTQRB4fe.mjs";
import { n as isArtifactPreservingStateRead } from "./artifact-preserving-state-reads-CSUBkGbZ.mjs";
import { t as resolveNodeCompileCacheEnv } from "./node-compile-cache-env-BKjFxzRG.mjs";
import { d as retainSnapshotWork } from "./sqlite-readonly-location-cleanup-zmu6YCue.mjs";
import { n as createSqliteReadOnlyWorkerScope, r as readOnlyWorkerScope } from "./sqlite-readonly-worker-context-DNk9aB7C.mjs";
import { n as isSameSqliteReadOnlyWorkerLaunch, o as readSqliteReadOnlyWorkerValue, r as SQLITE_READONLY_WORKER_MAX_BUFFER, s as sqliteReadOnlyWorkerRequestArgs, t as createSqliteReadOnlyWorkerSession } from "./sqlite-readonly-worker-session-Bq0RBm36.mjs";
import { n as trackWorkerRequest, t as classifyWorkerRequest } from "./worker-request-diagnostics-BrY1pZl2.mjs";
import fs from "node:fs";
import { tmpdir } from "node:os";
import { execFile, spawnSync } from "node:child_process";
import { performance } from "node:perf_hooks";
//#region src/bootstrap/node-compiler-args.ts
const COMPILER_FLAGS = /* @__PURE__ */ new Set([
	"--no-maglev",
	"--maglev",
	"--no-concurrent-sparkplug",
	"--concurrent-sparkplug"
]);
/** Forward explicit compiler policy into OpenClaw-owned Node workers. */
function resolveForwardedNodeCompilerArgs(execArgv = process.execArgv) {
	return execArgv.filter((arg) => COMPILER_FLAGS.has(arg.replaceAll("_", "-")));
}
//#endregion
//#region src/infra/sqlite-readonly-worker-pool.ts
const log$1 = createSubsystemLogger("state/sqlite");
function trackSqliteRead(options) {
	return trackWorkerRequest("sqlite_read", classifyWorkerRequest(options.mode === "operation" ? options.command.type : options.mode), options.signal);
}
function createSqliteReadOnlyWorkerPool(createSession) {
	const scopedReadWorkers = [];
	const SCOPED_READ_WORKER_LIMIT = 4;
	const SCOPED_READ_WORKER_IDLE_MS = 6e4;
	const statefulReadWorkers = /* @__PURE__ */ new WeakMap();
	const readWorkerReleaseWaiters = /* @__PURE__ */ new Set();
	const closingBrokers = /* @__PURE__ */ new WeakSet();
	const assertBrokerOpen = (launch) => {
		if (launch.transport.kind === "broker" && closingBrokers.has(launch.transport.owner)) throw new Error("SQLite read-only worker broker is closing");
	};
	async function closeSlot(slot) {
		const worker = slot.session;
		try {
			await worker?.close();
			slot.session = void 0;
		} catch (error) {
			slot.quarantined = { error };
			for (const released of readWorkerReleaseWaiters) released();
			throw error;
		}
	}
	async function selectScopedReadWorker(options, launch) {
		assertBrokerOpen(launch);
		const stateful = options.mode === "operation" && (options.command.type === "pageCache.begin" || options.command.type === "pageCache.step");
		const scope = readOnlyWorkerScope.getStore();
		if (stateful) {
			if (!scope?.active) throw new Error("Database page-cache warm requires an active read-only worker scope");
			const retained = statefulReadWorkers.get(scope);
			if (retained) {
				if (!isSameSqliteReadOnlyWorkerLaunch(retained.launch, launch)) throw new Error("Database page-cache warm worker launch changed during its scope");
				return retained;
			}
			if (options.command.type === "pageCache.step") throw new Error("Database page-cache warm is no longer active");
		}
		for (;;) {
			assertBrokerOpen(launch);
			options.signal?.throwIfAborted();
			const available = scopedReadWorkers.filter((candidate) => !candidate.leased && !candidate.quarantined);
			let slot = available.find((candidate) => isSameSqliteReadOnlyWorkerLaunch(candidate.launch, launch));
			if (!slot && scopedReadWorkers.length < SCOPED_READ_WORKER_LIMIT) {
				slot = {
					launch,
					tail: Promise.resolve(),
					queued: 0
				};
				scopedReadWorkers.push(slot);
			}
			slot ??= available.find((candidate) => candidate.queued === 0 && !candidate.session);
			slot ??= available.reduce((best, candidate) => !best || candidate.queued < best.queued ? candidate : best, void 0);
			if (slot) {
				if (stateful && scope) {
					const retained = slot;
					const lease = { started: false };
					retained.leased = lease;
					statefulReadWorkers.set(scope, retained);
					scope.releaseReadWorker = async () => {
						try {
							if (lease.started) {
								await retained.tail;
								await closeSlot(retained);
							}
						} finally {
							retained.leased = void 0;
							statefulReadWorkers.delete(scope);
							scope.releaseReadWorker = void 0;
							if (!retained.quarantined && retained.queued === 0 && retained.session && !retained.session.isRetired()) {
								retained.session.setIdle(true);
								armScopedReadWorkerIdle(retained);
							}
							for (const released of readWorkerReleaseWaiters) released();
						}
					};
				}
				return slot;
			}
			if (scopedReadWorkers.every((candidate) => candidate.quarantined)) throw new AggregateError(scopedReadWorkers.map((candidate) => candidate.quarantined?.error), "SQLite read-only worker capacity is held by unconfirmed cleanup");
			let released;
			const availableWorker = runInDetachedAsyncContext(() => new Promise((resolve) => {
				released = resolve;
			}));
			readWorkerReleaseWaiters.add(released);
			try {
				await racePromiseWithAbortSignal(availableWorker, options.signal, (signal) => signal.reason);
			} finally {
				readWorkerReleaseWaiters.delete(released);
			}
		}
	}
	function retireIdleSlot(slot) {
		clearTimeout(slot.idle);
		const closing = runInDetachedAsyncContext(() => closeSlot(slot));
		slot.tail = closing.catch(() => {
			log$1.warn("Idle SQLite read-only worker cleanup failed");
		});
		return closing;
	}
	function armScopedReadWorkerIdle(slot) {
		if (slot.launch.transport.kind === "broker" && closingBrokers.has(slot.launch.transport.owner)) {
			retireIdleSlot(slot);
			return;
		}
		slot.idle = runInDetachedAsyncContext(() => setTimeout(() => {
			retireIdleSlot(slot);
		}, SCOPED_READ_WORKER_IDLE_MS));
		slot.idle.unref();
	}
	return {
		run: async function runSqliteScopedReadWorker(pathname, options, launch, observation = trackSqliteRead(options)) {
			const stateful = options.mode === "operation" && (options.command.type === "pageCache.begin" || options.command.type === "pageCache.step");
			let selected;
			try {
				selected = await selectScopedReadWorker(options, launch);
				assertBrokerOpen(launch);
			} catch (error) {
				observation.completed();
				throw error;
			}
			clearTimeout(selected.idle);
			selected.queued++;
			const previous = selected.tail;
			const operation = runInDetachedAsyncContext(() => racePromiseWithAbortSignal(previous, options.signal, (signal) => signal.reason)).then(async () => {
				options.signal?.throwIfAborted();
				if (selected.quarantined) throw selected.quarantined.error;
				observation.started();
				if (selected.leased && options.mode === "operation" && options.command.type === "pageCache.begin") selected.leased.started = true;
				if (!isSameSqliteReadOnlyWorkerLaunch(selected.launch, launch) || selected.session?.isRetired()) await closeSlot(selected);
				options.signal?.throwIfAborted();
				selected.launch = launch;
				const worker = selected.session ??= createSession({
					...launch,
					pooledRead: true
				});
				worker.setIdle(false);
				try {
					const value = await worker.run(pathname, options);
					options.signal?.throwIfAborted();
					if (!stateful && !getSqliteRuntimeCapabilities().explicitSqliteCloseReleasesNativeResources) await closeSlot(selected);
					return value;
				} catch (error) {
					try {
						await closeSlot(selected);
					} catch (cleanupError) {
						throw createSqliteLifecycleAggregateError([error, cleanupError], "SQLite read and child cleanup failed", error);
					}
					throw error;
				}
			}).finally(() => {
				observation.completed();
				selected.queued--;
				if (!selected.leased && !selected.quarantined && selected.queued === 0 && selected.session && !selected.session.isRetired()) {
					selected.session?.setIdle(true);
					armScopedReadWorkerIdle(selected);
				}
			});
			selected.tail = runInDetachedAsyncContext(() => Promise.allSettled([previous, operation]).then(() => {}));
			return operation;
		},
		async closeBroker(broker) {
			closingBrokers.add(broker);
			const failures = (await Promise.allSettled(scopedReadWorkers.filter((slot) => slot.launch.transport.kind === "broker" && slot.launch.transport.owner === broker && slot.session && slot.queued === 0 && !slot.leased && !slot.quarantined).map(retireIdleSlot))).flatMap((outcome) => outcome.status === "rejected" ? [outcome.reason] : []);
			if (failures.length) throw new AggregateError(failures, "SQLite read-only broker worker cleanup failed");
		}
	};
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
/** Sum serial SQLite inspection budgets without overflowing Node timers. */
function resolveAggregateSqliteInspectionTimeoutMs(operation, databases) {
	let timeoutMs = 0;
	for (const database of databases) timeoutMs += resolveSqliteInspectionBudget(operation, database.path, database.sizeBytes).timeoutMs;
	return resolveTimerTimeoutMs(timeoutMs, SQLITE_INSPECTION_TIMEOUT_MS, SQLITE_INSPECTION_TIMEOUT_MS);
}
function readSqliteInspectionBudget(operation, pathname, mainSizeBytes) {
	let sizeBytes = mainSizeBytes;
	try {
		sizeBytes ??= fs.statSync(pathname, { bigint: true }).size;
		for (const suffix of [
			"-wal",
			"-shm",
			"-journal"
		]) try {
			sizeBytes += fs.statSync(pathname + suffix, { bigint: true }).size;
		} catch (error) {
			if (!hasErrnoCode(error, "ENOENT")) throw error;
		}
	} catch {}
	return resolveSqliteInspectionBudget(operation, pathname, sizeBytes);
}
function sqliteInspectionTimeoutError(operation, pathname, timeoutMs, size) {
	return /* @__PURE__ */ new Error(`SQLite ${operation} timed out after ${timeoutMs / 1e3} seconds (budget for ${size}) for ${pathname}. Stop the Gateway service and other OpenClaw processes using this database, then retry; if already stopped, check storage performance.`);
}
async function withSqliteReadOnlyWorkerScope(operation, options) {
	if (!options && readOnlyWorkerScope.getStore()?.active) return operation();
	const scope = createSqliteReadOnlyWorkerScope(options);
	try {
		return await scope.run(operation);
	} finally {
		await scope.close();
	}
}
/** A retained startup inspection is cancelled by its Gateway, not by its foreground wait. */
function isSqliteInspectionDeadlineOwnedByCaller() {
	return readOnlyWorkerScope.getStore()?.deadlineOwnedByCaller === true;
}
function resolveSqliteInspectionSignal(signal) {
	const scope = readOnlyWorkerScope.getStore();
	return scope ? signal ? AbortSignal.any([signal, scope.controller.signal]) : scope.controller.signal : signal;
}
/** Bind a one-shot inspection to the active scope's cancellation and close join. */
function runScopedSqliteInspection(signal, inspect) {
	const scope = readOnlyWorkerScope.getStore();
	if (!scope) return inspect(signal);
	if (!scope.active) return Promise.reject(/* @__PURE__ */ new Error("SQLite read-only worker scope closed"));
	const operation = inspect(signal ? AbortSignal.any([signal, scope.controller.signal]) : scope.controller.signal);
	scope.pending.add(operation);
	operation.then(() => scope.pending.delete(operation), () => scope.pending.delete(operation));
	return operation;
}
function sqliteReadOnlyWorkerArgv(pathname, options) {
	const { moduleUrl, runtimeGeneration } = captureRuntimeWorkerSource(resolveRuntimeProcessEntrypointUrl(options.mode === "content-version" || options.mode === "file-generation" ? "sqliteSourceRevision" : "sqliteReadOnly"));
	return {
		runtimeGeneration,
		argv: [
			...resolveForwardedNodeCompilerArgs(),
			...resolveRuntimeWorkerArgv(moduleUrl),
			SQLITE_READONLY_CHILD_ARG,
			...sqliteReadOnlyWorkerRequestArgs(pathname, options)
		]
	};
}
/** Capture launch facts before awaiting another session's retirement. */
function captureSqliteReadOnlyWorkerLaunch(env, source) {
	const broker = source === void 0 ? void 0 : getSpawnBroker();
	return {
		runtimeGeneration: captureRuntimeWorkerSource(resolveRuntimeProcessEntrypointUrl("sqliteReadOnly")).runtimeGeneration,
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
function createScopedSqliteReadOnlyWorker(launch) {
	const workerUrl = resolveRuntimeProcessEntrypointUrl("sqliteReadOnly");
	return runInDetachedAsyncContext(() => createSqliteReadOnlyWorkerSession({
		...launch,
		argv: [
			...resolveRuntimeWorkerArgv(launch.runtimeGeneration?.resolve(workerUrl) ?? workerUrl),
			SQLITE_READONLY_CHILD_ARG,
			"session"
		],
		requestArgs: sqliteReadOnlyWorkerRequestArgs,
		readBudget: (pathname) => readSqliteInspectionBudget("read-only snapshot", pathname),
		deadlineOwnedByCaller: launch.retainLifetime === false ? () => false : isSqliteInspectionDeadlineOwnedByCaller,
		timeoutError: (pathname, timeoutMs, size) => sqliteInspectionTimeoutError("read-only snapshot", pathname, timeoutMs, size),
		closeTimeoutMs: SQLITE_INSPECTION_TIMEOUT_MS
	}));
}
async function runSqliteReadOnlyOperation(pathname, command, options) {
	const capturedCommand = structuredClone(command);
	const result = await runSqliteReadOnlyWorker(pathname, {
		...options,
		mode: "operation",
		command: capturedCommand
	});
	return readOperationResult(capturedCommand.type, result);
}
/** Reuse a caller-owned native session without creating a canonical-read broker. */
async function runScopedSqliteReadOnlyOperation(worker, pathname, command, options) {
	const capturedCommand = structuredClone(command);
	const result = await worker.run(pathname, {
		...options,
		mode: "operation",
		command: capturedCommand
	});
	return readOperationResult(capturedCommand.type, result);
}
function readOperationResult(type, result) {
	if (typeof result !== "object" || !("operation" in result) || result.operation !== type) throw new Error("SQLite read-only worker returned a different operation");
	return result.value;
}
function runSqliteReadOnlyWorker(pathname, inputOptions) {
	const options = (inputOptions.mode === "auth-profile-rows" || inputOptions.mode === "operation") && isArtifactPreservingStateRead("agent", pathname) ? {
		...inputOptions,
		artifactPreserving: true
	} : inputOptions;
	if (options.mode === "reclaim") return readOnlyWorkerScope.exit(() => runSqliteReadOnlyWorkerOnce(pathname, options));
	return runScopedSqliteInspection(options.signal, (signal) => {
		const scope = readOnlyWorkerScope.getStore();
		if (!scope) return runSqliteReadOnlyWorkerOnce(pathname, options);
		const scopedOptions = {
			...options,
			signal
		};
		const useScopedWorker = options.mode === "sync" && !scope.busy;
		if (useScopedWorker) scope.busy = true;
		if (scopedOptions.mode === "auth-profile-rows" || scopedOptions.mode === "operation") {
			const launch = captureSqliteReadOnlyWorkerLaunch(scopedOptions.env, scopedOptions.source);
			return sqliteReadOnlyWorkerPool.run(pathname, scopedOptions, launch);
		}
		return (async () => {
			if (!useScopedWorker) return runSqliteReadOnlyWorkerOnce(pathname, scopedOptions);
			try {
				const launch = captureSqliteReadOnlyWorkerLaunch();
				if (!scope.worker?.compatible(launch)) {
					await scope.worker?.close();
					scopedOptions.signal?.throwIfAborted();
					scope.worker = createScopedSqliteReadOnlyWorker(launch);
				}
				return await scope.worker.run(pathname, scopedOptions);
			} finally {
				scope.busy = false;
			}
		})();
	});
}
const sqliteReadOnlyWorkerPool = createSqliteReadOnlyWorkerPool(createScopedSqliteReadOnlyWorker);
function closeSqliteReadOnlyWorkersForBroker(broker) {
	return sqliteReadOnlyWorkerPool.closeBroker(broker);
}
function runSqliteReadOnlyWorkerOnce(pathname, options, launch) {
	if (options.mode === "auth-profile-rows" || options.mode === "operation") return sqliteReadOnlyWorkerPool.run(pathname, options, captureSqliteReadOnlyWorkerLaunch(options.env, options.source));
	const reclaim = options.mode === "reclaim";
	const { argv, runtimeGeneration } = sqliteReadOnlyWorkerArgv(pathname, options);
	return runOneShotSqliteInspection({
		pathname,
		operation: reclaim ? "reclamation" : "read-only snapshot",
		argv,
		runtimeGeneration,
		signal: options.signal,
		deadlineOwnedByCaller: !reclaim && (launch?.deadlineOwnedByCaller ?? isSqliteInspectionDeadlineOwnedByCaller()),
		deadlineStopsOwner: reclaim,
		env: launch?.env,
		cwd: launch?.cwd,
		stoppedFailure: "snapshot owner stopped",
		...reclaim ? { interrupt: (child) => child.stdin?.end() } : {},
		read: (output, deadlineReached) => {
			if (reclaim) {
				const warnings = readSqliteReadOnlyWorkerValue(output, "reclaim");
				if (deadlineReached) {
					const { timeoutMs, size } = readSqliteInspectionBudget("reclamation", pathname);
					warnings.push(sqliteInspectionTimeoutError("reclamation", pathname, timeoutMs, size).message);
				}
				return warnings;
			}
			options.signal?.throwIfAborted();
			return readSqliteReadOnlyWorkerValue(output, options.mode);
		}
	});
}
function runOneShotSqliteInspection(params) {
	const { timeoutMs, size } = readSqliteInspectionBudget(params.operation, params.pathname);
	return new Promise((resolve, reject) => {
		let output = {
			kind: "launched",
			stderr: "",
			stdout: "",
			status: null
		};
		let stopped = false;
		let deadlineReached = false;
		const child = execFile(process.execPath, params.argv, {
			encoding: "utf8",
			windowsHide: true,
			env: params.env ?? resolveNodeCompileCacheEnv(),
			cwd: params.cwd,
			maxBuffer: SQLITE_READONLY_WORKER_MAX_BUFFER,
			timeout: params.deadlineStopsOwner || params.deadlineOwnedByCaller ? void 0 : timeoutMs,
			killSignal: "SIGKILL"
		}, (error, stdout, stderr) => {
			const timedOut = error?.killed && error.signal === "SIGKILL" && error.code == null;
			if (timedOut) deadlineReached = true;
			output = {
				kind: "launched",
				status: child.exitCode,
				failure: error ? stopped ? params.stoppedFailure : timedOut ? sqliteInspectionTimeoutError(params.operation, params.pathname, timeoutMs, size).message : `exited unsuccessfully: ${error.message}` : void 0,
				stderr,
				stdout,
				cause: error ?? void 0
			};
		});
		const interrupt = () => {
			if (params.interrupt) params.interrupt(child);
			else child.kill("SIGKILL");
		};
		const abort = () => {
			if (!stopped) {
				stopped = true;
				interrupt();
			}
		};
		const timer = params.deadlineStopsOwner ? setTimeout(() => {
			deadlineReached = true;
			stopped = true;
			interrupt();
		}, timeoutMs) : void 0;
		const closed = retainSnapshotWork(new Promise((resolveClosed) => {
			child.once("close", () => resolveClosed());
		}), abort);
		params.runtimeGeneration?.retain(child, async () => {
			await closed;
		});
		params.signal?.addEventListener("abort", abort, { once: true });
		if (params.signal?.aborted) abort();
		child.once("close", () => {
			clearTimeout(timer);
			params.signal?.removeEventListener("abort", abort);
			try {
				resolve(params.read(output, deadlineReached));
			} catch (workerError) {
				reject(workerError instanceof Error ? workerError : new Error(String(workerError)));
			}
		});
	});
}
function runSqliteReadOnlyWorkerSync(pathname, stagingRoot, mode = "sync") {
	const { timeoutMs, size } = readSqliteInspectionBudget("read-only snapshot", pathname);
	const started = log.isEnabled("trace") ? performance.now() : void 0;
	const result = spawnSync(process.execPath, sqliteReadOnlyWorkerArgv(pathname, {
		mode,
		stagingRoot
	}).argv, {
		encoding: "utf8",
		windowsHide: true,
		stdio: "pipe",
		env: resolveNodeCompileCacheEnv(),
		maxBuffer: SQLITE_READONLY_WORKER_MAX_BUFFER,
		timeout: timeoutMs,
		killSignal: "SIGKILL"
	});
	if (started !== void 0) log.trace(`SQLite read-only snapshot child durationMs=${performance.now() - started}`);
	const output = result.error ? {
		kind: "launch-failed",
		error: new Error(hasErrnoCode(result.error, "ETIMEDOUT") ? sqliteInspectionTimeoutError("read-only snapshot", pathname, timeoutMs, size).message : `SQLite read-only worker failed to start for ${pathname}: ${result.error.message}`, { cause: result.error })
	} : {
		kind: "launched",
		stdout: result.stdout,
		stderr: result.stderr,
		status: result.status,
		failure: result.status === 0 ? void 0 : `exited with ${result.signal ? `signal ${result.signal}` : `code ${result.status}`}`
	};
	return readSqliteReadOnlyWorkerValue(output, mode);
}
//#endregion
export { withSqliteReadOnlyWorkerScope as _, readSqliteInspectionBudget as a, resolveSqliteInspectionSignal as c, runScopedSqliteReadOnlyOperation as d, runSqliteReadOnlyOperation as f, sqliteInspectionTimeoutError as g, runSqliteReadOnlyWorkerSync as h, isSqliteInspectionDeadlineOwnedByCaller as i, runOneShotSqliteInspection as l, runSqliteReadOnlyWorkerOnce as m, closeSqliteReadOnlyWorkersForBroker as n, resolveAggregateSqliteInspectionTimeoutMs as o, runSqliteReadOnlyWorker as p, createScopedSqliteReadOnlyWorker as r, resolveSqliteInspectionBudget as s, captureSqliteReadOnlyWorkerLaunch as t, runScopedSqliteInspection as u };
