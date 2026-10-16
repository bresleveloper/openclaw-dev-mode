import pMap from "p-map";
//#region packages/memory-host-sdk/src/host/concurrency.ts
/** Run tasks with bounded concurrency, stopping admission and draining active work on failure. */
async function runWithConcurrency(tasks, limit) {
	const inFlight = /* @__PURE__ */ new Set();
	try {
		return await pMap(tasks, (task) => {
			const run = Promise.resolve().then(task);
			inFlight.add(run);
			run.then(() => inFlight.delete(run), () => inFlight.delete(run));
			return run;
		}, {
			concurrency: Math.max(1, Math.floor(limit)),
			stopOnError: true
		});
	} catch (error) {
		await Promise.allSettled(inFlight);
		throw error;
	}
}
//#endregion
export { runWithConcurrency as t };
