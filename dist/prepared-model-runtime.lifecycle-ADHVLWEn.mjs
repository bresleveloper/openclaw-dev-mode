import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
//#region src/agents/prepared-model-runtime.lifecycle.ts
/** Process close owns every admitted model runtime and native catalog worker. */
/** Notifications supplement the owner's generation and registration checks. */
function capturePreparedModelRuntimeGeneration(owner) {
	return (owner.generationRetirement ??= new AbortController()).signal;
}
function retirePreparedModelRuntimeGeneration(owner) {
	const retirement = owner.generationRetirement;
	owner.generationRetirement = void 0;
	retirement?.abort();
}
var ProcessModelRuntimeLifetimes = class {
	constructor() {
		this.closeCallbacks = /* @__PURE__ */ new Set();
		this.epoch = 0;
	}
};
const lifetimes = resolveGlobalSingleton(Symbol.for("openclaw.preparedModelRuntimeLifetimes"), () => new ProcessModelRuntimeLifetimes(), () => closePreparedModelRuntimeSnapshots());
function capturePreparedModelRuntimeLifetime() {
	const epoch = lifetimes.epoch;
	const assertCurrent = () => {
		if (lifetimes.closing || epoch !== lifetimes.epoch) throw new Error("prepared model runtime process lifetime closed");
	};
	assertCurrent();
	return assertCurrent;
}
function registerPreparedModelRuntimeClose(close) {
	capturePreparedModelRuntimeLifetime();
	lifetimes.closeCallbacks.add(close);
	return () => lifetimes.closeCallbacks.delete(close);
}
/** Install the shared plugin resource owner only when a real generation acquires it. */
function registerPreparedPluginRetirement(retire) {
	capturePreparedModelRuntimeLifetime();
	lifetimes.retirePlugins ??= retire;
}
/** Fence admission before abort callbacks run; old publications cannot enter the next lifetime. */
function closePreparedModelRuntimeSnapshots() {
	if (lifetimes.closing) return lifetimes.closing;
	const closed = createDeferredCore();
	lifetimes.closing = closed.promise;
	lifetimes.epoch += 1;
	const error = /* @__PURE__ */ new Error("prepared model runtime process lifetime closed");
	Promise.allSettled([...lifetimes.closeCallbacks].map(async (close) => await close(error))).then(async (results) => {
		try {
			await lifetimes.retirePlugins?.();
			lifetimes.retirePlugins = void 0;
		} catch (reason) {
			results.push({
				status: "rejected",
				reason
			});
		}
		const failures = results.flatMap((result) => result.status === "rejected" ? [result.reason] : []);
		if (failures.length) closed.reject(new AggregateError(failures, "Prepared model runtime failed to close"));
		else {
			lifetimes.closing = void 0;
			closed.resolve();
		}
	});
	return closed.promise;
}
function createPreparedModelRuntimeReplacement() {
	const { promise, resolve, reject } = createDeferredCore();
	promise.catch(() => void 0);
	return {
		gateId: Symbol("prepared-model-runtime-replacement"),
		promise,
		resolve,
		reject
	};
}
/** Execution waits for plugin replacement while the active publication remains readable. */
function createPreparedModelRuntimePluginDrain(getCancellationSignal, hasPendingPublication) {
	let pending;
	return {
		get pending() {
			return pending;
		},
		begin: () => {
			capturePreparedModelRuntimeLifetime();
			getCancellationSignal().throwIfAborted();
			if (pending) throw new Error("Prepared model runtime plugin drain is already pending");
			const drain = createPreparedModelRuntimeReplacement();
			pending = drain;
			const unregister = registerPreparedModelRuntimeClose(async (error) => {
				unregister();
				if (pending === drain) pending = void 0;
				drain.reject(error);
			});
			return {
				pendingPublication: hasPendingPublication(),
				release: () => {
					unregister();
					if (pending === drain) {
						pending = void 0;
						drain.resolve();
					}
				}
			};
		},
		async runAfter(queue, run) {
			const assertCurrent = capturePreparedModelRuntimeLifetime();
			for (;;) {
				const reservation = pending;
				if (reservation) {
					await reservation.promise;
					continue;
				}
				assertCurrent();
				let started = false;
				await queue.enqueue(async () => {
					assertCurrent();
					if (pending) return;
					started = true;
					await run();
				});
				if (started) return;
			}
		}
	};
}
//#endregion
export { createPreparedModelRuntimeReplacement as a, retirePreparedModelRuntimeGeneration as c, createPreparedModelRuntimePluginDrain as i, capturePreparedModelRuntimeLifetime as n, registerPreparedModelRuntimeClose as o, closePreparedModelRuntimeSnapshots as r, registerPreparedPluginRetirement as s, capturePreparedModelRuntimeGeneration as t };
