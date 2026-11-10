import { t as observeGcSamples } from "./gc-observer-BGYErqy9.mjs";
import { MessageChannel } from "node:worker_threads";
import { getHeapStatistics } from "node:v8";
//#region src/infra/worker-memory.ts
const MAX_PENDING_GC_SAMPLES = 256;
/** Publish isolate-local counters without sharing the task transport or keeping it alive. */
function serveWorkerMemorySamples(parent) {
	const { port1, port2 } = new MessageChannel();
	const heapSizeLimitBytes = process.versions.bun ? void 0 : getHeapStatistics().heap_size_limit;
	let gc;
	const flushGc = () => {
		if (gc) {
			port1.postMessage({ gc });
			gc = void 0;
		}
	};
	const sample = () => {
		const { heapUsed, heapTotal, external, arrayBuffers } = process.memoryUsage();
		port1.postMessage({
			heapUsed,
			heapTotal,
			external,
			arrayBuffers,
			heapSizeLimitBytes,
			gc
		});
		gc = void 0;
	};
	let stopGc;
	port1.on("message", (request) => {
		if (request) {
			if (request.gc) stopGc ??= observeGcSamples((samples) => {
				(gc ??= []).push(...samples);
				if (gc.length >= MAX_PENDING_GC_SAMPLES) flushGc();
			});
			else {
				stopGc?.();
				stopGc = void 0;
				gc = void 0;
			}
		} else sample();
	});
	port1.once("close", () => {
		stopGc?.();
		gc = void 0;
	});
	port1.on("messageerror", () => port1.close());
	port1.unref();
	sample();
	parent.postMessage({
		status: "memory",
		port: port2
	}, [port2]);
	return () => {
		stopGc?.();
		flushGc();
		port1.close();
	};
}
//#endregion
//#region src/infra/worker-task-transport.ts
/** Private startup message shared by retained task hosts and their served workers. */
const WORKER_TASK_PORT_MESSAGE = "openclaw.worker-task-port";
//#endregion
export { serveWorkerMemorySamples as n, WORKER_TASK_PORT_MESSAGE as t };
