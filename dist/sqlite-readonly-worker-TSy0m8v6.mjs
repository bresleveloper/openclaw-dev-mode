import { n as resolveForwardedExitCompilerArgs } from "./node-exit-safe-compilers-B7V3uapp.mjs";
import { F as resolveTimerTimeoutMs } from "./number-coercion-CuVhdCBs.mjs";
import { a as runInDetachedAsyncContext } from "./async-work-scope-BYeX3gh6.mjs";
import { n as tryProcessCwd } from "./safe-cwd-DOxDm8mD.mjs";
import "./src-CdRlGRnW.mjs";
import { n as formatByteSize } from "./format-C1IjPxxo.mjs";
import { n as resolveNodeCompileCacheEnv } from "./node-compile-cache-env-CpY9xPJG.mjs";
import { i as resolveRuntimeWorkerUrl, n as resolveRuntimeWorkerArgv } from "./runtime-worker-url-DoBSDhBS.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { d as retainSnapshotWork } from "./sqlite-readonly-location-cleanup-CPS8QEIp.mjs";
import { n as runtimeProcessEntrypoints, t as SQLITE_READONLY_CHILD_ARG } from "./runtime-process-entrypoints-Dgz2IR4T.mjs";
import { t as captureRuntimeWorkerSource } from "./runtime-worker-generation-DCJaEqeS.mjs";
import { t as getSpawnBroker } from "./context-BGWzAY3i.mjs";
import { n as readOnlyWorkerScope } from "./sqlite-readonly-worker-context-CtZdPPcK.mjs";
import { c as sqliteReadOnlyWorkerRequestArgs, n as isSameSqliteReadOnlyWorkerLaunch, r as SQLITE_READONLY_WORKER_MAX_BUFFER, s as readSqliteReadOnlyWorkerValue, t as createSqliteReadOnlyWorkerSession } from "./sqlite-readonly-worker-session-DK-j16po.mjs";
import fs from "node:fs";
import { tmpdir } from "node:os";
import { execFile, spawnSync } from "node:child_process";
import { performance } from "node:perf_hooks";
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
/** Reuse child imports until the lifecycle owner closes; reads reacquire source admission. */
function createSqliteReadOnlyWorkerScope(options) {
	const scope = {
		active: true,
		busy: false,
		controller: new AbortController(),
		pending: /* @__PURE__ */ new Set(),
		deadlineOwnedByCaller: options?.deadlineOwnedByCaller ?? false,
		readTail: Promise.resolve()
	};
	const abort = () => scope.controller.abort(options?.signal.reason);
	options?.signal.addEventListener("abort", abort, { once: true });
	if (options?.signal.aborted) abort();
	let closing;
	return {
		run(operation) {
			return readOnlyWorkerScope.run(scope, operation);
		},
		close() {
			closing ??= (async () => {
				options?.signal.removeEventListener("abort", abort);
				scope.active = false;
				scope.controller.abort(/* @__PURE__ */ new Error("SQLite read-only worker scope closed"));
				await Promise.allSettled(scope.pending);
				const failures = (await Promise.allSettled([scope.worker?.close(), scope.readWorker?.session.close()])).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
				if (failures.length > 0) throw new AggregateError(failures, "SQLite read-only worker scope cleanup failed");
			})();
			return closing;
		}
	};
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
function createScopedSqliteReadOnlyWorker(launch) {
	const workerUrl = resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.sqliteReadOnly);
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
	if (typeof result !== "object" || !("operation" in result) || result.operation !== capturedCommand.type) throw new Error("SQLite read-only worker returned a different operation");
	return result.value;
}
function runSqliteReadOnlyWorker(pathname, options) {
	if (options.mode === "reclaim") return readOnlyWorkerScope.exit(() => runSqliteReadOnlyWorkerOnce(pathname, options));
	const scope = readOnlyWorkerScope.getStore();
	if (!scope) return runSqliteReadOnlyWorkerOnce(pathname, options);
	if (!scope.active) return Promise.reject(/* @__PURE__ */ new Error("SQLite read-only worker scope closed"));
	const scopedOptions = {
		...options,
		signal: options.signal ? AbortSignal.any([options.signal, scope.controller.signal]) : scope.controller.signal
	};
	const useScopedWorker = options.mode === "sync" && !scope.busy;
	if (useScopedWorker) scope.busy = true;
	const readRequest = scopedOptions.mode === "auth-profile-rows" || scopedOptions.mode === "operation" ? {
		options: scopedOptions,
		launch: captureSqliteReadOnlyWorkerLaunch(scopedOptions.env, scopedOptions.source)
	} : void 0;
	const operation = readRequest ? scope.readTail.then(() => runSqliteScopedReadWorker(pathname, readRequest.options, readRequest.launch, scope)) : (async () => {
		if (!useScopedWorker) return runSqliteReadOnlyWorkerOnce(pathname, scopedOptions);
		try {
			const launch = captureSqliteReadOnlyWorkerLaunch();
			if (!scope.worker?.compatible(launch)) {
				await scope.worker?.close();
				scopedOptions.signal.throwIfAborted();
				scope.worker = createScopedSqliteReadOnlyWorker(launch);
			}
			return await scope.worker.run(pathname, scopedOptions);
		} finally {
			scope.busy = false;
		}
	})();
	if (readRequest) scope.readTail = runInDetachedAsyncContext(() => operation.then(() => {}, () => {}));
	scope.pending.add(operation);
	operation.then(() => scope.pending.delete(operation), () => scope.pending.delete(operation));
	return operation;
}
async function runSqliteScopedReadWorker(pathname, options, launch, scope) {
	options.signal?.throwIfAborted();
	if (scope?.readWorker && (scope.readWorker.source !== options.source || !isSameSqliteReadOnlyWorkerLaunch(scope.readWorker.launch, launch) || scope.readWorker.session.isRetired())) {
		await scope.readWorker.session.close();
		scope.readWorker = void 0;
		options.signal?.throwIfAborted();
	}
	let worker = scope?.readWorker?.session ?? createScopedSqliteReadOnlyWorker(launch);
	while (true) {
		if (scope) scope.readWorker = {
			source: options.source,
			launch,
			session: worker
		};
		let outcome;
		try {
			const value = await worker.run(pathname, options);
			options.signal?.throwIfAborted();
			outcome = { value };
		} catch (error) {
			outcome = { error };
		}
		let cleanupFailure;
		if (!scope || "error" in outcome) try {
			await worker.close();
			if (scope) scope.readWorker = void 0;
		} catch (error) {
			cleanupFailure = { error };
		}
		if (cleanupFailure) {
			if ("error" in outcome) throw new AggregateError([outcome.error, cleanupFailure.error], options.mode === "auth-profile-rows" ? "Auth read and child cleanup failed" : "SQLite read and child cleanup failed", { cause: outcome.error });
			throw cleanupFailure.error;
		}
		if ("error" in outcome) {
			if (worker.notStarted && hasErrnoCode(outcome.error, "ERR_SPAWN_BROKER_UNAVAILABLE")) {
				options.signal?.throwIfAborted();
				worker = worker.createNativeReplacement();
				continue;
			}
			throw outcome.error;
		}
		options.signal?.throwIfAborted();
		return outcome.value;
	}
}
function runSqliteReadOnlyWorkerOnce(pathname, options, launch) {
	if (options.mode === "auth-profile-rows" || options.mode === "operation") return runSqliteScopedReadWorker(pathname, options, captureSqliteReadOnlyWorkerLaunch(options.env, options.source));
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
export { readSqliteInspectionBudget as a, resolveSqliteInspectionSignal as c, runSqliteReadOnlyOperation as d, runSqliteReadOnlyWorker as f, withSqliteReadOnlyWorkerScope as g, sqliteInspectionTimeoutError as h, isSqliteInspectionDeadlineOwnedByCaller as i, runOneShotSqliteInspection as l, runSqliteReadOnlyWorkerSync as m, createScopedSqliteReadOnlyWorker as n, resolveAggregateSqliteInspectionTimeoutMs as o, runSqliteReadOnlyWorkerOnce as p, createSqliteReadOnlyWorkerScope as r, resolveSqliteInspectionBudget as s, captureSqliteReadOnlyWorkerLaunch as t, runScopedSqliteInspection as u };
