import { d as toStringifiedError } from "./error-coercion-C787aVxk.mjs";
import { i as runWithSqliteCoordinator, n as createSqliteLifecycleAggregateError, t as SqliteCoordinatorError } from "./sqlite-coordinator-z2lO0ops.mjs";
import { o as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-dESpOAuZ.mjs";
import { C as withStateDatabaseCoordinatorRuntimeDirectory, S as tryCreateStateLifecycleDelegate, T as StateDatabaseCoordinatorContentionError, f as attachStateLifecycleDelegate, s as acquireStateDatabaseCoordinator } from "./sqlite-source-handle-C0wvRR5v.mjs";
import { _ as registerOpenClawStateDatabaseAsyncResource } from "./openclaw-state-db-cache-Ci98mtX8.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { setTimeout } from "node:timers/promises";
import { performance } from "node:perf_hooks";
import { threadId } from "node:worker_threads";
//#region src/config/sessions/session-accessor.sqlite-worker-transport.ts
function sqliteMutationWorkerThreadId(transport) {
	return transport.kind === "dedicated" ? transport.channel.threadId : transport.threadId;
}
async function terminateSqliteMutationWorker(transport) {
	if (transport.kind === "dedicated") await transport.channel.terminate();
	else await transport.terminate();
}
/** Task completion proves closed resources; only the dedicated path reports native exit. */
function observeSqliteMutationWorkerEnd(transport, observe) {
	if (transport.kind === "dedicated") {
		const exited = (code) => observe({
			kind: "native-exit",
			code
		});
		transport.channel.once("exit", exited);
		return () => transport.channel.off("exit", exited);
	}
	let active = true;
	transport.completion.then(() => active && observe({ kind: "task-complete" }), (error) => active && observe({
		kind: "task-failed",
		error: toStringifiedError(error),
		custodyReleased: transport.custodyReleased()
	}));
	return () => {
		active = false;
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-worker-coordination.ts
async function prepareLifecycleDelegate(context, actorId) {
	const deadline = performance.now() + OPENCLAW_SQLITE_BUSY_TIMEOUT_MS;
	return withStateDatabaseCoordinatorRuntimeDirectory(context.coordinatorRuntime, async () => {
		while (true) try {
			return runWithSqliteCoordinator(acquireStateDatabaseCoordinator({
				databasePath: context.admission.databasePath,
				busyTimeoutMs: 0
			}), "SQLite mutation Worker lifecycle admission", () => tryCreateStateLifecycleDelegate({
				databasePath: context.admission.databasePath,
				actorId
			}));
		} catch (error) {
			const remaining = deadline - performance.now();
			if (!(error instanceof StateDatabaseCoordinatorContentionError) || error.family !== "state-lifecycle" || remaining <= 0) throw error;
			await setTimeout(Math.min(25, remaining));
		}
	});
}
/** The original request owns this pin until its result or native exit is settled. */
async function withSqliteMutationWorkerCoordination(context, transport, operationId, run) {
	const worker = transport.channel;
	const actorId = `${sqliteMutationWorkerThreadId(transport)}:${operationId}`;
	const preparingError = () => {};
	worker.on("error", preparingError);
	try {
		return await withSqliteWorkerLifecycleCoordination(context, actorId, run, async () => {
			await terminateSqliteMutationWorker(transport);
		});
	} finally {
		worker.off("error", preparingError);
	}
}
/** Each transport joins its native operation before relinquishing shared-state custody. */
async function withSqliteWorkerLifecycleCoordination(context, actorId, run, settleFailure) {
	let delegate;
	let outcome;
	try {
		delegate = await prepareLifecycleDelegate(context, actorId);
		outcome = { value: await run({
			actorId,
			databasePath: context.admission.databasePath,
			stateContext: {
				environment: context.environment,
				coordinatorRuntime: context.coordinatorRuntime
			},
			get stateLifecycle() {
				return delegate?.port;
			}
		}) };
	} catch (error) {
		outcome = { error };
		try {
			await settleFailure();
		} catch (exitError) {
			outcome.error = new AggregateError([error, exitError], "SQLite mutation and Worker exit failed", { cause: error });
		}
	}
	try {
		delegate?.release();
	} catch (error) {
		if (delegate && !delegate.closed) {
			const release = () => {
				delegate.release();
				unregister();
			};
			const unregister = registerOpenClawStateDatabaseAsyncResource({ close: async (identity) => {
				if (!identity || identity.key === context.admission.identity.key) release();
			} });
			context.maintenanceScope?.own(delegate, "shared-resources", release);
		}
		if ("error" in outcome) throw createSqliteLifecycleAggregateError([outcome.error, error], "SQLite mutation and coordinator cleanup failed", outcome.error);
		process.emitWarning(new SqliteCoordinatorError("SQLite mutation settled before coordinator cleanup failed", error));
	}
	if ("error" in outcome) throw outcome.error;
	return outcome.value;
}
async function runWithSqliteMutationWorkerCoordination(coordination, operationId, options, run) {
	if (coordination.actorId !== `${threadId}:${operationId}` || resolveOpenClawStateSqlitePath(coordination.stateContext.environment) !== coordination.databasePath) throw new Error("SQLite mutation Worker shared-state owner changed");
	const delegate = coordination.stateLifecycle ? await attachStateLifecycleDelegate(coordination.stateLifecycle, {
		actorId: coordination.actorId,
		databasePath: coordination.databasePath,
		runtimeDirectory: coordination.stateContext.coordinatorRuntime.directory
	}) : void 0;
	try {
		return await withStateDatabaseCoordinatorRuntimeDirectory(coordination.stateContext.coordinatorRuntime, () => {
			const operation = () => run({
				...options,
				env: {
					...options.env,
					...coordination.stateContext.environment
				}
			});
			return delegate ? delegate.run(operation) : operation();
		});
	} finally {
		delegate?.close();
	}
}
//#endregion
export { sqliteMutationWorkerThreadId as a, observeSqliteMutationWorkerEnd as i, withSqliteMutationWorkerCoordination as n, terminateSqliteMutationWorker as o, withSqliteWorkerLifecycleCoordination as r, runWithSqliteMutationWorkerCoordination as t };
