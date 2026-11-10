import { isMainThread } from "node:worker_threads";
import { Session } from "node:inspector/promises";
//#region src/infra/worker-idle-gc.ts
const IDLE_GC_DELAY_MS = 1e3;
const IDLE_GC_GROWTH_BYTES = 33554432;
let collectedHeap = 0;
let session;
let pending;
let collecting = false;
let idle = false;
let generation = 0;
async function collectWorkerIdleGarbage() {
	pending = void 0;
	if (process.memoryUsage().heapUsed <= collectedHeap + IDLE_GC_GROWTH_BYTES) return;
	const collectingGeneration = generation;
	collecting = true;
	try {
		if (!session) {
			const connection = new Session();
			connection.connect();
			session = connection;
		}
		await session.post("HeapProfiler.collectGarbage");
		collecting = false;
		if (collectingGeneration === generation) collectedHeap = process.memoryUsage().heapUsed;
		else if (idle) scheduleWorkerIdleGc();
	} catch (error) {
		collecting = false;
		if (error instanceof Error && error.message.startsWith("Inspector error -32601:")) session = null;
		else process.emitWarning(error instanceof Error ? error : String(error));
	}
}
/** Only native worker owners call this after releasing their operation's payloads. */
function scheduleWorkerIdleGc() {
	if (isMainThread || session === null) return;
	idle = true;
	if (pending || collecting) return;
	if (process.memoryUsage().heapUsed <= collectedHeap + IDLE_GC_GROWTH_BYTES) return;
	pending = setTimeout(() => {
		collectWorkerIdleGarbage();
	}, IDLE_GC_DELAY_MS).unref();
}
/** A new operation takes precedence over collection of the preceding idle heap. */
function cancelWorkerIdleGc() {
	generation++;
	idle = false;
	clearTimeout(pending);
	pending = void 0;
}
//#endregion
export { scheduleWorkerIdleGc as n, cancelWorkerIdleGc as t };
