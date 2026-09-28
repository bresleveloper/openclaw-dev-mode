import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/infra/runtime-worker-generation.ts
const scope = resolveGlobalSingleton(Symbol.for("openclaw.runtimeWorkerGeneration"), () => new AsyncLocalStorage());
/** Capture before queues or detached pool contexts discard the caller's scope. */
function captureRuntimeWorkerSource(url) {
	const generation = scope.getStore()?.generation;
	const bound = generation?.resolve(url);
	return bound && bound.href !== url.href ? {
		moduleUrl: bound,
		runtimeGeneration: generation
	} : { moduleUrl: url };
}
async function withRuntimeWorkerGeneration(operation, release, retainedDirectory) {
	const current = {};
	const resources = /* @__PURE__ */ new Map();
	let closing = false;
	return await scope.run(current, async () => {
		let outcome;
		try {
			outcome = { value: await operation((resolve) => {
				if (closing || current.generation) throw new Error("The updater already retained its worker generation");
				current.generation = Object.freeze({
					resolve(url) {
						if (closing) throw new Error("The updater's retained worker generation is closing");
						return resolve(url);
					},
					retain(owner, close) {
						if (closing) throw new Error("The updater's retained worker generation is closing");
						resources.set(owner, close);
					}
				});
			}) };
		} catch (error) {
			outcome = { error };
		}
		closing = true;
		const failures = (await Promise.allSettled([...resources.values()].map((close) => close()))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
		if (failures.length) {
			const directory = retainedDirectory?.();
			throw new AggregateError([..."error" in outcome ? [outcome.error] : [], ...failures], "Retained updater workers did not settle" + (directory ? `. Runtime retained at ${directory}; keep it until the workers stop.` : ""));
		}
		await release();
		if ("error" in outcome) throw outcome.error;
		return outcome.value;
	});
}
//#endregion
export { withRuntimeWorkerGeneration as n, captureRuntimeWorkerSource as t };
