import { isMainThread } from "node:worker_threads";
import { getHeapStatistics } from "node:v8";
import { Session } from "node:inspector";
//#region src/infra/worker-idle-gc.ts
const IDLE_GC_GROWTH_BYTES = 33554432;
let collectedHeap = 0;
let session;
let pending;
let collecting = false;
let idle = false;
let generation = 0;
/** Only native worker owners call this after releasing their operation's payloads. */
function scheduleWorkerIdleGc() {
	if (isMainThread || process.versions.bun) return;
	idle = true;
	if (pending || collecting) return;
	pending = setImmediate(() => {
		pending = void 0;
		if (getHeapStatistics().used_heap_size <= collectedHeap + IDLE_GC_GROWTH_BYTES) return;
		const collectingGeneration = generation;
		collecting = true;
		try {
			if (!session) {
				const connection = new Session();
				connection.connect();
				session = connection;
			}
			session.post("HeapProfiler.collectGarbage", (error) => {
				collecting = false;
				if (error) process.emitWarning(error);
				else if (collectingGeneration === generation) collectedHeap = getHeapStatistics().used_heap_size;
				else if (idle) scheduleWorkerIdleGc();
			});
		} catch (error) {
			collecting = false;
			process.emitWarning(error instanceof Error ? error : String(error));
		}
	});
	pending.unref();
}
/** A new operation takes precedence over collection of the preceding idle heap. */
function cancelWorkerIdleGc() {
	generation++;
	idle = false;
	clearImmediate(pending);
	pending = void 0;
}
//#endregion
export { scheduleWorkerIdleGc as n, cancelWorkerIdleGc as t };
