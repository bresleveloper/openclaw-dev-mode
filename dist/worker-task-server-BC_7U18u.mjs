import { n as loggingState } from "./state-UxwJeH7V.mjs";
import { o as installDeletedAgentDatabaseFences, r as decodeAgentDatabaseReaderRequest, t as applyAgentDatabaseReaderRequest } from "./agent-database-readers-DAuOtcuZ.mjs";
import { t as serveOwnedWorkerTasks$1 } from "./worker-BNX4X1Kw.mjs";
import { n as scheduleWorkerIdleGc, t as cancelWorkerIdleGc } from "./worker-idle-gc-DjILq491.mjs";
import { t as serveWorkerMemorySamples } from "./worker-memory-RbSetjGQ.mjs";
//#region src/infra/worker-task-server.ts
/** Pool dispatch is serial per worker; handlers finish cleanup before returning their result. */
function serveWorkerTasks(handler, options = {}) {
	serveOwnedWorkerTasks(handler, options);
}
/** Every served worker closes its agent database readers by path between tasks; owners may add more. */
function serveOwnedWorkerTasks(handler, options = {}) {
	let memoryPort;
	let memorySamplesStarted = false;
	serveOwnedWorkerTasks$1(handler, {
		...options,
		closeResource: async (key) => {
			const request = decodeAgentDatabaseReaderRequest(key);
			if (!request && !options.closeResource) throw new Error("Worker does not own retained resources");
			if (request) await applyAgentDatabaseReaderRequest(request);
			if (!request || request.kind === "close") await options.closeResource?.(key);
		}
	}, {
		initialize(port) {
			loggingState.forceConsoleToStderr = true;
			memoryPort = port;
		},
		onMessage(sampleMemory) {
			if (sampleMemory && !memorySamplesStarted) {
				memorySamplesStarted = true;
				serveWorkerMemorySamples(memoryPort);
			}
			cancelWorkerIdleGc();
		},
		installTaskContext: installDeletedAgentDatabaseFences,
		onIdle: scheduleWorkerIdleGc
	});
}
//#endregion
export { serveWorkerTasks as n, serveOwnedWorkerTasks as t };
