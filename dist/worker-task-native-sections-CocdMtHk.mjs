import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/infra/worker-task-native-sections.ts
const CANCELLED = 1;
const SECTION = 2;
const currentNativeSection = resolveGlobalSingleton(Symbol.for("openclaw.workerTaskNativeSection"), () => new AsyncLocalStorage());
function assertWorkerTaskActive(observed, isActive) {
	if (!isActive() || (observed & CANCELLED) !== 0) throw new Error("worker task cancelled");
}
function acquireWorkerNativeSection(state, isActive) {
	for (;;) {
		const observed = Atomics.load(state, 0);
		assertWorkerTaskActive(observed, isActive);
		if (Atomics.compareExchange(state, 0, observed, observed + SECTION) === observed) break;
	}
	let released = false;
	return () => {
		if (released) return;
		released = true;
		Atomics.sub(state, 0, SECTION);
		Atomics.notify(state, 0);
	};
}
/** Make this task's native custody available without retaining ordinary task work. */
function withWorkerTaskNativeSectionScope(state, isActive, run) {
	return currentNativeSection.run(() => acquireWorkerNativeSection(state, isActive), run);
}
/** Acquire before a durable side effect; release only after its cleanup or settlement. */
function retainCurrentWorkerNativeSection() {
	return currentNativeSection.getStore()?.() ?? (() => {});
}
function createWorkerNativeSectionState() {
	return new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT));
}
function cancelWorkerNativeSections(state) {
	Atomics.or(state, 0, CANCELLED);
	Atomics.notify(state, 0);
}
function observeWorkerTaskCancellation(state, isActive, onCancelled) {
	let observing = true;
	const settled = (async () => {
		for (;;) {
			if (!observing || !isActive()) return;
			const observed = Atomics.load(state, 0);
			if ((observed & CANCELLED) !== 0) {
				onCancelled();
				return;
			}
			await Atomics.waitAsync(state, 0, observed).value;
		}
	})();
	return () => {
		observing = false;
		Atomics.notify(state, 0);
		return settled;
	};
}
function waitForWorkerNativeSections(state) {
	if (Atomics.load(state, 0) < SECTION) return;
	return (async () => {
		for (;;) {
			const observed = Atomics.load(state, 0);
			if (observed < SECTION) return;
			await Atomics.waitAsync(state, 0, observed).value;
		}
	})();
}
function releaseWorkerNativeSectionsOnExit(state) {
	Atomics.store(state, 0, CANCELLED);
	Atomics.notify(state, 0);
}
function createWorkerTaskControl(state, isActive) {
	const throwIfCancelled = () => assertWorkerTaskActive(Atomics.load(state, 0), isActive);
	return {
		throwIfCancelled,
		runNativeSection: async (operation) => {
			const release = acquireWorkerNativeSection(state, isActive);
			let result;
			try {
				result = await operation();
			} finally {
				release();
			}
			throwIfCancelled();
			return result;
		}
	};
}
//#endregion
export { releaseWorkerNativeSectionsOnExit as a, withWorkerTaskNativeSectionScope as c, observeWorkerTaskCancellation as i, createWorkerNativeSectionState as n, retainCurrentWorkerNativeSection as o, createWorkerTaskControl as r, waitForWorkerNativeSections as s, cancelWorkerNativeSections as t };
