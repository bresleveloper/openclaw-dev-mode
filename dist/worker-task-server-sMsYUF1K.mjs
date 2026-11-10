import { a as scheduleOpenClawCompileCacheFlush } from "./node-compile-cache-D2yvJTzP.mjs";
import "./detached-async-context-D04NzekX.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as loggingState } from "./state-UxwJeH7V.mjs";
import { H as withSqliteDatabaseAdmissionExchange } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { a as installDeletedAgentDatabaseFences, r as decodeAgentDatabaseReaderRequest, t as applyAgentDatabaseReaderRequest } from "./agent-database-readers-DSwi8tar.mjs";
import { r as exchangeSqliteDatabaseAdmissions, t as bindSqliteDatabaseAdmissionUpstream } from "./sqlite-worker-database-admission-relay-CPqKkejS.mjs";
import { t as serveOwnedWorkerTasks$1 } from "./worker-DKr4WoBi.mjs";
import { n as scheduleWorkerIdleGc, t as cancelWorkerIdleGc } from "./worker-idle-gc-DrnCHdyX.mjs";
import { n as serveWorkerMemorySamples } from "./worker-task-transport-CU6xz65-.mjs";
import { MessagePort } from "node:worker_threads";
//#region src/infra/worker-task-server.ts
/** Pool dispatch is serial per worker; handlers finish cleanup before returning their result. */
function serveWorkerTasks(handler, options = {}) {
	serveOwnedWorkerTasks(handler, options);
}
/** Every served worker closes its agent database readers by path between tasks; owners may add more. */
function serveOwnedWorkerTasks(handler, options = {}) {
	let memoryPort;
	let taskPort;
	let databaseAdmissionPort;
	let closeMemorySamples;
	const runWithDatabaseAdmission = async (operation) => {
		const port = databaseAdmissionPort;
		if (!port) return operation();
		let active = true;
		try {
			return await withSqliteDatabaseAdmissionExchange((admissions, location, create) => {
				if (!active) throw new Error("SQLite admission facts outlived their worker task");
				return exchangeSqliteDatabaseAdmissions(port, admissions, location, create);
			}, operation);
		} finally {
			active = false;
		}
	};
	serveOwnedWorkerTasks$1((input, channel, control) => runWithDatabaseAdmission(() => handler(input, channel, control)), {
		...options,
		closeResource: (key) => runWithDatabaseAdmission(async () => {
			const request = decodeAgentDatabaseReaderRequest(key);
			if (!request && !options.closeResource) throw new Error("Worker does not own retained resources");
			if (request) await applyAgentDatabaseReaderRequest(request);
			if (!request || request.kind === "close") await options.closeResource?.(key);
		})
	}, {
		selectStartupPort(message) {
			if (!isRecord(message) || message.type !== "openclaw.worker-task-port") return;
			if (!(message.port instanceof MessagePort)) throw new Error("Retained worker task port is invalid");
			taskPort = message.port;
			return taskPort;
		},
		initialize(port) {
			loggingState.forceConsoleToStderr = true;
			memoryPort = port;
		},
		onReady() {
			taskPort?.postMessage({ status: "ready" }, []);
		},
		onMessage(sampleMemory) {
			if (sampleMemory && !closeMemorySamples) closeMemorySamples = serveWorkerMemorySamples(memoryPort);
			cancelWorkerIdleGc();
		},
		installTaskContext(context) {
			installDeletedAgentDatabaseFences(context.deletedAgentDatabaseFences);
			if (context.databaseAdmissionPort) bindSqliteDatabaseAdmissionUpstream(context.databaseAdmissionPort);
			databaseAdmissionPort ??= context.databaseAdmissionPort;
		},
		onIdle() {
			scheduleOpenClawCompileCacheFlush();
			if (options.idleGc !== false) scheduleWorkerIdleGc();
		},
		onRetire() {
			cancelWorkerIdleGc();
			try {
				closeMemorySamples?.();
			} finally {
				databaseAdmissionPort?.close();
			}
		}
	});
}
//#endregion
export { serveWorkerTasks as n, serveOwnedWorkerTasks as t };
