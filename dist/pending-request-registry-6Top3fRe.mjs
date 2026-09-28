import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
//#region src/shared/pending-request-registry.ts
function createPendingRequestRegistry() {
	const pending = /* @__PURE__ */ new Map();
	const release = (entry) => {
		clearTimeout(entry.timer);
		entry.dispose?.();
	};
	const take = (key, expected) => {
		const entry = pending.get(key);
		if (!entry || expected && entry !== expected) return;
		pending.delete(key);
		release(entry);
		return entry;
	};
	const add = (key, options) => {
		if (pending.has(key)) return;
		const entry = {
			...createDeferredCore(),
			value: options.value,
			dispose: options.dispose
		};
		pending.set(key, entry);
		entry.timer = setTimeout(() => {
			const timedOut = take(key, entry);
			if (timedOut) {
				timedOut.reject(options.timeoutError());
				options.onTimeout?.();
			}
		}, options.timeoutMs);
		entry.timer.unref?.();
		return entry;
	};
	const rejectAll = (reason) => {
		const entries = [...pending.values()];
		pending.clear();
		for (const entry of entries) {
			release(entry);
			entry.reject(reason);
		}
	};
	return {
		add,
		get: (key) => pending.get(key),
		take,
		rejectAll
	};
}
//#endregion
export { createPendingRequestRegistry as t };
