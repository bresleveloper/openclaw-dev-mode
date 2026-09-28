import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { s as sleepWithAbort } from "./src-D4OikzaT.mjs";
import { n as createSqliteLifecycleAggregateError, t as SqliteCoordinatorError } from "./sqlite-coordinator-z2lO0ops.mjs";
import { C as withStateDatabaseCoordinatorRuntimeDirectory, T as StateDatabaseCoordinatorContentionError, s as acquireStateDatabaseCoordinator } from "./sqlite-source-handle-C0wvRR5v.mjs";
import { t as acquireWithWait } from "./acquire-with-wait-CTq_p6Fk.mjs";
import "./backoff-CszdOMiF.mjs";
import { MessageChannel, MessagePort, receiveMessageOnPort } from "node:worker_threads";
//#region src/infra/sqlite-worker-lifecycle-preparation.ts
/** Service only this job's preparation while a legacy native caller owns the host turn. */
function createSqliteWorkerLifecyclePreparation(params) {
	const { port1, port2 } = new MessageChannel();
	const prepared = createDeferredCore();
	let failure;
	let finished = false;
	let admitted = false;
	const refuse = (error) => {
		failure ??= error;
		port1.postMessage({ type: "cancel" });
	};
	const receive = (request, pumping = false) => {
		if (finished) return;
		if (isRecord(request) && request.type === "result") {
			params.receiveResult(request.reply, pumping);
			return;
		}
		if (!isRecord(request) || request.type !== "check" && request.type !== "acquired") {
			refuse(new SqliteCoordinatorError("SQLite lifecycle preparation request is invalid"));
			return;
		}
		try {
			params.signal.throwIfAborted();
			params.assertCurrent();
			if (admitted) throw new SqliteCoordinatorError("SQLite lifecycle preparation already admitted its job");
			if (request.type === "check") {
				port1.postMessage({ type: "accepted" });
				return;
			}
			const admission = params.admit();
			params.signal.throwIfAborted();
			params.assertCurrent();
			params.dispatch();
			admitted = true;
			port1.postMessage({
				type: "accepted",
				admission
			}, admission ? [admission] : []);
			prepared.resolve();
		} catch (error) {
			refuse(error);
		}
	};
	const abort = () => refuse(params.signal.reason);
	port1.on("message", receive);
	port1.once("close", () => prepared.resolve());
	port1.unref();
	params.signal.addEventListener("abort", abort, { once: true });
	return {
		port: port2,
		prepared: prepared.promise,
		get failure() {
			return failure;
		},
		service() {
			for (let queued = receiveMessageOnPort(port1); queued; queued = receiveMessageOnPort(port1)) receive(queued.message, true);
		},
		finish() {
			finished = true;
			params.signal.removeEventListener("abort", abort);
			prepared.resolve();
			port1.close();
			port2.close();
		}
	};
}
/** The executing data worker owns acquisition, its synchronous command, and native release. */
async function acquireSqliteWorkerLifecycle(params) {
	const controller = new AbortController();
	let waiting;
	const cancel = () => {
		const error = new SqliteCoordinatorError("SQLite lifecycle preparation was canceled");
		controller.abort(error);
		waiting?.reject(error);
	};
	const receive = (reply) => {
		if (!isRecord(reply) || reply.type !== "accepted") {
			cancel();
			return;
		}
		if (!waiting) {
			cancel();
			return;
		}
		const pending = waiting;
		waiting = void 0;
		if (reply.admission !== void 0 && !(reply.admission instanceof MessagePort)) {
			pending.reject(new SqliteCoordinatorError("SQLite lifecycle admission port is invalid"));
			return;
		}
		pending.resolve(reply.admission);
	};
	params.port.on("message", receive);
	params.port.once("close", cancel);
	const check = (type) => {
		controller.signal.throwIfAborted();
		waiting = createDeferredCore();
		params.port.postMessage({ type }, []);
		return waiting.promise;
	};
	let coordinator;
	try {
		const held = await acquireWithWait({
			deadlineMs: performance.now() + Number(params.deadlineNs - process.hrtime.bigint()) / 1e6,
			pollIntervalMs: 25,
			maxPollIntervalMs: 250,
			sleep: (ms) => sleepWithAbort(ms, controller.signal),
			shouldRetry: (error) => error instanceof StateDatabaseCoordinatorContentionError && error.family === "state-lifecycle",
			acquire: async () => {
				await check("check");
				controller.signal.throwIfAborted();
				return withStateDatabaseCoordinatorRuntimeDirectory(params.runtime, () => acquireStateDatabaseCoordinator({
					databasePath: params.databasePath,
					busyTimeoutMs: 0
				}));
			}
		});
		coordinator = held;
		const admission = await check("acquired");
		controller.signal.throwIfAborted();
		coordinator = void 0;
		return {
			coordinator: held,
			admission
		};
	} catch (error) {
		try {
			coordinator?.release();
		} catch (cleanupError) {
			params.onUnsettled();
			throw createSqliteLifecycleAggregateError([error, cleanupError], "SQLite lifecycle preparation cleanup failed", error);
		}
		throw error;
	} finally {
		params.port.off("message", receive);
		params.port.off("close", cancel);
	}
}
//#endregion
export { createSqliteWorkerLifecyclePreparation as n, acquireSqliteWorkerLifecycle as t };
