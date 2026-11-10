import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { s as raceWithTimeout } from "./src-Bzfi3cQM.mjs";
import { a as registerSignalExitFinalizer } from "./signal-exit-barrier-DtR3X_NN.mjs";
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
	return await scope.run(current, async () => {
		let outcome;
		let settlement;
		const settleGeneration = () => {
			return settlement ??= (async () => {
				const settled = await Promise.allSettled([...resources.values()].map((settle) => Promise.resolve().then(settle)));
				const failures = settled.flatMap((result) => result.status === "rejected" ? [result.reason] : []);
				const terminate = settled.flatMap((result) => result.status === "fulfilled" && result.value ? [result.value] : []);
				const termination = Promise.allSettled(terminate.map((close) => Promise.resolve().then(close)));
				const observed = await raceWithTimeout(termination, 1e4, () => void 0);
				if (!observed) retainedDirectory?.("retained updater worker termination is still pending after settlement; waiting for native retirement before releasing the runtime");
				const terminated = observed ?? await termination;
				if (failures.length) {
					const reason = "retained updater workers did not settle; keep it until the workers stop";
					const directory = retainedDirectory?.(reason);
					throw new AggregateError(failures, "Retained updater workers did not settle" + (directory ? `. Runtime retained at ${directory}: ${reason}.` : ""));
				}
				if (terminated.some((result) => result.status === "rejected")) {
					retainedDirectory?.("retained updater worker termination failed after settlement; retry openclaw update cleanup after this process exits");
					return;
				}
				await release();
			})();
		};
		const unregister = registerSignalExitFinalizer(settleGeneration);
		try {
			outcome = { value: await operation((resolve) => {
				current.generation = Object.freeze({
					resolve,
					retain(owner, settle) {
						resources.set(owner, settle);
					}
				});
			}) };
		} catch (error) {
			outcome = { error };
		}
		try {
			await settleGeneration();
		} catch (error) {
			if ("error" in outcome) throw new AggregateError([outcome.error, error], "Update and retained runtime cleanup failed", { cause: error });
			throw error;
		} finally {
			unregister();
		}
		if ("error" in outcome) throw outcome.error;
		return outcome.value;
	});
}
//#endregion
export { withRuntimeWorkerGeneration as n, captureRuntimeWorkerSource as t };
