import { MessageChannel } from "node:worker_threads";
//#region src/infra/worker-memory.ts
/** Publish isolate-local counters without sharing the task transport or keeping it alive. */
function serveWorkerMemorySamples(parent) {
	const { port1, port2 } = new MessageChannel();
	const sample = () => {
		const { heapUsed, heapTotal, external, arrayBuffers } = process.memoryUsage();
		port1.postMessage({
			heapUsed,
			heapTotal,
			external,
			arrayBuffers
		});
	};
	port1.on("message", sample);
	port1.on("messageerror", () => port1.close());
	port1.unref();
	sample();
	parent.postMessage({
		status: "memory",
		port: port2
	}, [port2]);
}
//#endregion
export { serveWorkerMemorySamples as t };
