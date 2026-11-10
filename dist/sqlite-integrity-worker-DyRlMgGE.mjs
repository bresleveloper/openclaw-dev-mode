import { f as toStringifiedError } from "./error-coercion-BwMr25F8.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { n as resolveRuntimeWorkerArgv } from "./runtime-worker-url-CvMrvFI1.mjs";
import { s as throwSqliteLifecycleErrors } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { n as resolveRuntimeProcessEntrypointUrl } from "./runtime-process-url-BCfqgqXF.mjs";
import { r as readSqliteIntegrityFileIdentity } from "./sqlite-file-generation-Cmk6kG35.mjs";
import { a as readSqliteInspectionBudget, c as resolveSqliteInspectionSignal, g as sqliteInspectionTimeoutError, i as isSqliteInspectionDeadlineOwnedByCaller } from "./sqlite-readonly-worker-C2DDLw_y.mjs";
import { t as restoreNativeErrorResponse } from "./native-error-response-6ofCMHxA.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { fork } from "node:child_process";
import { performance } from "node:perf_hooks";
//#region src/infra/sqlite-integrity-worker-error.ts
var SqliteIntegrityWorkerInterruptedError = class extends Error {
	constructor(signal, lastObservedPhase) {
		super(`SQLite integrity check stopped by ${signal} before completion (lastObservedPhase=${lastObservedPhase})`);
		this.signal = signal;
		this.name = "SqliteIntegrityWorkerInterruptedError";
	}
};
//#endregion
//#region src/infra/sqlite-integrity-worker.ts
const integrityScope = new AsyncLocalStorage();
const log = createSubsystemLogger("state/sqlite");
async function closeIntegrityProcess(worker) {
	if (!worker.retired) {
		worker.retired = true;
		if (worker.child.connected) worker.child.send({ type: "close" }, (error) => {
			if (error) worker.child.kill("SIGKILL");
		});
	}
	const timeout = setTimeout(() => worker.child.kill("SIGKILL"), worker.closeBudgetMs);
	timeout.unref();
	try {
		await worker.closed;
	} finally {
		clearTimeout(timeout);
	}
}
/** Reuse imports within one maintenance lease; each request opens and closes its own database. */
async function withSqliteIntegrityWorkerScope(assertCurrent, operation) {
	const parent = integrityScope.getStore();
	if (parent && !parent.accepting) throw new Error("SQLite integrity maintenance scope is closed");
	const scope = {
		queue: parent?.queue ?? { tail: Promise.resolve() },
		assertCurrent,
		accepting: true,
		pending: /* @__PURE__ */ new Set()
	};
	try {
		return await integrityScope.run(scope, async () => {
			let outcome;
			try {
				outcome = { value: await operation() };
			} catch (error) {
				outcome = { error };
			}
			scope.accepting = false;
			const errors = "error" in outcome ? [outcome.error] : [];
			for (const result of await Promise.allSettled(scope.pending)) if (result.status === "rejected" && !errors.includes(result.reason)) errors.push(result.reason);
			try {
				assertCurrent();
			} catch (error) {
				if (!errors.includes(error)) errors.push(error);
			}
			throwSqliteLifecycleErrors(errors, "SQLite integrity maintenance scope failed");
			if ("error" in outcome) throw outcome.error;
			return outcome.value;
		});
	} finally {
		scope.accepting = false;
		if (!parent && scope.queue.process) await closeIntegrityProcess(scope.queue.process);
	}
}
/** The caller retains its owning lease or private snapshot until the native reader closes. */
function assertSqliteIntegrityInWorker(pathname, busyTimeoutMs, callerSignal, databaseLabel = pathname, timing) {
	const scope = integrityScope.getStore();
	const run = async (heldScope) => assertSqliteIntegrityWithProcess(pathname, busyTimeoutMs, callerSignal, databaseLabel, timing, heldScope);
	if (!scope) return run();
	if (!scope.accepting) return Promise.reject(/* @__PURE__ */ new Error("SQLite integrity maintenance scope is closed"));
	const pending = scope.queue.tail.then(async () => {
		try {
			if (scope.queue.process?.retired) await scope.queue.process.closed;
			await run(scope);
		} catch (error) {
			if (scope.queue.process) await closeIntegrityProcess(scope.queue.process);
			throw error;
		}
	});
	scope.queue.tail = pending.catch(() => void 0);
	scope.pending.add(pending);
	pending.finally(() => scope.pending.delete(pending)).catch(() => void 0);
	return pending;
}
function assertSqliteIntegrityWithProcess(pathname, busyTimeoutMs, callerSignal, databaseLabel, timing, scope) {
	const signal = resolveSqliteInspectionSignal(callerSignal) ?? callerSignal;
	if (timing) {
		delete timing.workerCheckElapsedMs;
		delete timing.workerLifetimeElapsedMs;
	}
	signal.throwIfAborted();
	scope?.assertCurrent();
	const identity = readSqliteIntegrityFileIdentity(pathname);
	const { timeoutMs, size } = readSqliteInspectionBudget("integrity check", databaseLabel, identity.size);
	const startedAt = performance.now();
	let active = scope?.queue.process;
	if (!active || active.retired) {
		const entry = resolveRuntimeProcessEntrypointUrl("sqliteIntegrity");
		const child = fork(entry, [], {
			execArgv: resolveRuntimeWorkerArgv(entry).slice(0, -1),
			serialization: "advanced",
			stdio: [
				"ignore",
				"ignore",
				"ignore",
				"ipc"
			],
			timeout: scope || isSqliteInspectionDeadlineOwnedByCaller() ? void 0 : timeoutMs,
			killSignal: "SIGKILL",
			...scope ? {} : { signal }
		});
		const { promise: closed, resolve: onClosed } = createDeferredCore();
		active = {
			child,
			closed,
			retired: false,
			closeBudgetMs: timeoutMs
		};
		const launched = active;
		child.on("error", (error) => {
			launched.failure = toStringifiedError(error);
			launched.retired = true;
			child.kill("SIGKILL");
		});
		child.once("close", () => {
			launched.retired = true;
			onClosed();
		});
		if (scope) scope.queue.process = active;
	}
	active.closeBudgetMs = timeoutMs;
	const reader = active;
	const worker = reader.child;
	return new Promise((resolve, reject) => {
		let result;
		let failure;
		let lastObservedPhase = "starting";
		let timeout;
		const heartbeat = setInterval(() => {
			log.info(`SQLite integrity check still running: ${databaseLabel} (${size}, ${Math.floor((performance.now() - startedAt) / 1e3)}s elapsed, phase=${lastObservedPhase}).`);
		}, 1e4);
		heartbeat.unref();
		const deadlineError = () => {
			const error = sqliteInspectionTimeoutError("integrity check", databaseLabel, timeoutMs, size);
			error.message += ` (lastObservedPhase=${lastObservedPhase})`;
			return error;
		};
		const kill = () => {
			reader.retired = true;
			worker.kill("SIGKILL");
		};
		const onAbort = () => {
			failure = toStringifiedError(signal.reason);
			kill();
		};
		const finish = (code, closeSignal) => {
			clearTimeout(timeout);
			clearInterval(heartbeat);
			signal.removeEventListener("abort", onAbort);
			worker.off("message", onMessage);
			worker.off("close", finish);
			if (timing) {
				timing.workerLifetimeElapsedMs = performance.now() - startedAt;
				const checkElapsedMs = result?.checkElapsedMs;
				if (typeof checkElapsedMs === "number" && Number.isFinite(checkElapsedMs) && checkElapsedMs >= 0) timing.workerCheckElapsedMs = checkElapsedMs;
			}
			try {
				signal.throwIfAborted();
				scope?.assertCurrent();
				const workerFailure = failure ?? reader.failure;
				if (workerFailure) throw workerFailure;
				if (worker.killed && closeSignal === "SIGKILL") throw deadlineError();
				if (code !== 0 || !result) {
					if (!result && closeSignal) throw new SqliteIntegrityWorkerInterruptedError(closeSignal, lastObservedPhase);
					throw new Error(`SQLite integrity worker exited ${code} without a completed check (lastObservedPhase=${lastObservedPhase})`);
				}
				readSqliteIntegrityFileIdentity(pathname, identity);
				if (!result.ok) throw restoreNativeErrorResponse(result.error);
				resolve();
			} catch (error) {
				if (scope && !reader.retired) {
					kill();
					reader.closed.then(() => reject(toStringifiedError(error)));
				} else reject(toStringifiedError(error));
			}
		};
		const onMessage = (message) => {
			if ("type" in message && message.type === "phase") {
				if (!result && (message.phase === "opening" || message.phase === "checking" || message.phase === "closing")) lastObservedPhase = message.phase;
			} else if ("ok" in message) {
				result = message;
				lastObservedPhase = "result-received";
				if (scope) {
					if (message.ok && !reader.retired && !failure && !reader.failure) finish(0, null);
					else reader.retired = true;
				}
			}
		};
		worker.on("message", onMessage);
		worker.once("close", finish);
		if (scope) {
			signal.addEventListener("abort", onAbort, { once: true });
			if (!isSqliteInspectionDeadlineOwnedByCaller()) {
				timeout = setTimeout(() => {
					if (!result || result.ok) failure ??= reader.failure ?? deadlineError();
					kill();
				}, timeoutMs);
				timeout.unref();
			}
		}
		if (!signal.aborted) worker.send({
			pathname,
			databaseLabel,
			identity,
			busyTimeoutMs,
			...scope ? { reuse: true } : {}
		}, (error) => {
			if (error) {
				failure = error;
				kill();
			}
		});
		else if (scope) onAbort();
	});
}
//#endregion
export { withSqliteIntegrityWorkerScope as n, SqliteIntegrityWorkerInterruptedError as r, assertSqliteIntegrityInWorker as t };
