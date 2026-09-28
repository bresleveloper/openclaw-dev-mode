import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
//#region src/shared/keyed-fifo-lease.ts
/** Creates a close-owned FIFO registry shared by every runtime chunk using globalKey. */
function createKeyedFifoLeaseRegistry(globalKey) {
	const state = resolveGlobalSingleton(globalKey, () => ({
		tails: /* @__PURE__ */ new Map(),
		releases: /* @__PURE__ */ new Set()
	}), (current) => {
		for (const release of current.releases) release();
		current.tails.clear();
	}, "close-only");
	return { reserve(inputKeys) {
		const keys = [...new Set(inputKeys)].toSorted();
		if (keys.length === 0) return;
		const { promise: completed, resolve: complete } = createDeferredCore();
		const predecessors = [];
		const owned = keys.map((key) => {
			const predecessor = state.tails.get(key);
			if (predecessor) predecessors.push(predecessor);
			const tail = predecessor?.then(() => completed) ?? completed;
			state.tails.set(key, tail);
			return {
				key,
				tail
			};
		});
		const release = () => {
			if (!state.releases.delete(release)) return;
			complete();
			for (const { key, tail } of owned) tail.then(() => state.tails.get(key) === tail && state.tails.delete(key));
		};
		state.releases.add(release);
		return {
			async wait(signal) {
				if (signal?.aborted) return false;
				const ready = Promise.all(predecessors).then(() => true);
				if (!signal) return await ready;
				return await new Promise((resolve) => {
					const abort = () => resolve(false);
					signal.addEventListener("abort", abort, { once: true });
					if (signal.aborted) abort();
					ready.then((value) => {
						signal.removeEventListener("abort", abort);
						resolve(value);
					});
				});
			},
			release
		};
	} };
}
//#endregion
export { createKeyedFifoLeaseRegistry as t };
