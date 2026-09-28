import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { t as runGitWorkerOperation } from "./git-worker-Da8RAwNx.mjs";
//#region src/infra/retained-cache.ts
const UNWATCHED_CACHE_LIMIT = 100;
/** Signal-scoped watchers retain one canonical entry beyond the unobserved bound. */
function createRetainedCache() {
	const entries = /* @__PURE__ */ new Map();
	const retained = /* @__PURE__ */ new Map();
	const pins = /* @__PURE__ */ new WeakMap();
	const release = (signal) => {
		if (signal) pins.get(signal)?.release();
	};
	const retain = (key, entry, signal) => {
		if (!signal || signal.aborted || pins.get(signal)?.key === key) return;
		release(signal);
		const current = retained.get(key) ?? {
			entry,
			watchers: /* @__PURE__ */ new Set()
		};
		retained.set(key, current);
		current.watchers.add(signal);
		const unpin = () => {
			signal.removeEventListener("abort", unpin);
			pins.delete(signal);
			current.watchers.delete(signal);
			if (current.watchers.size === 0) retained.delete(key);
		};
		pins.set(signal, {
			key,
			release: unpin
		});
		signal.addEventListener("abort", unpin, { once: true });
	};
	return {
		get(key, signal) {
			if (signal && pins.get(signal)?.key !== key) release(signal);
			const entry = retained.get(key)?.entry ?? entries.get(key);
			if (entry !== void 0) retain(key, entry, signal);
			return entry;
		},
		set(key, entry, signal) {
			const current = retained.get(key);
			if (current) current.entry = entry;
			entries.delete(key);
			entries.set(key, entry);
			pruneMapToMaxSize(entries, UNWATCHED_CACHE_LIMIT);
			retain(key, entry, signal);
		},
		delete(key, expected) {
			if (entries.get(key) === expected) entries.delete(key);
			const current = retained.get(key);
			if (current && current.entry === expected) current.entry = void 0;
		},
		clear() {
			for (const current of retained.values()) for (const signal of current.watchers) release(signal);
			entries.clear();
		},
		release
	};
}
//#endregion
//#region src/infra/git-read-cache.ts
function subscribe(entry, clone, signal) {
	entry.subscribers += 1;
	return new Promise((resolve, reject) => {
		let settled = false;
		const finish = (complete) => {
			if (settled) return;
			settled = true;
			signal?.removeEventListener("abort", abort);
			entry.subscribers -= 1;
			if (entry.pending && entry.subscribers === 0) {
				entry.expiresAt = 0;
				entry.controller.abort();
				entry.promise.then(complete, complete);
				return;
			}
			complete();
		};
		const abort = () => finish(() => reject(toErrorObject(signal?.reason, "Git read aborted")));
		signal?.addEventListener("abort", abort, { once: true });
		entry.promise.then((value) => finish(() => resolve(clone(value))), (error) => finish(() => reject(toErrorObject(error, "Git read failed"))));
		if (signal?.aborted) abort();
	});
}
function createReadCache(load, freshnessMs, clone = structuredClone) {
	const entries = createRetainedCache();
	const pending = /* @__PURE__ */ new Set();
	return {
		async read(input, options = {}) {
			options.signal?.throwIfAborted();
			const prepared = structuredClone(input);
			const key = JSON.stringify(prepared);
			let entry = entries.get(key, options.cacheSignal);
			if (options.refresh || !entry || entry.expiresAt <= Date.now()) {
				const controller = new AbortController();
				const next = {
					expiresAt: freshnessMs === 0 ? Number.POSITIVE_INFINITY : Date.now() + freshnessMs,
					controller,
					subscribers: 0,
					pending: true,
					promise: Promise.resolve().then(() => load(prepared, controller.signal))
				};
				pending.add(next);
				next.promise = next.promise.then((value) => {
					next.pending = false;
					pending.delete(next);
					controller.signal.throwIfAborted();
					if (freshnessMs === 0) entries.delete(key, next);
					return value;
				}, (error) => {
					next.pending = false;
					pending.delete(next);
					next.expiresAt = 0;
					entries.delete(key, next);
					throw error;
				});
				entries.set(key, next, options.cacheSignal);
				entry = next;
			}
			return subscribe(entry, clone, options.signal);
		},
		async close() {
			const retiring = [...pending];
			for (const entry of retiring) {
				entry.expiresAt = 0;
				entry.controller.abort();
			}
			entries.clear();
			await Promise.allSettled(retiring.map((entry) => entry.promise));
		},
		release: entries.release
	};
}
function createReadCaches() {
	return {
		context: createReadCache((input, signal) => runGitWorkerOperation({
			type: "checkout.context",
			input
		}, { signal }), 75e3),
		branchFacts: createReadCache((input, signal) => runGitWorkerOperation({
			type: "pull-request.branch-facts",
			input
		}, { signal }), 75e3),
		diff: createReadCache((input, signal) => runGitWorkerOperation({
			type: "checkout.diff",
			input
		}, { signal }), 0, (diff) => ({
			...diff,
			files: diff.files.map((file) => ({ ...file })),
			...diff.commits ? { commits: diff.commits.map((commit) => ({ ...commit })) } : {},
			...diff.mergeBase ? { mergeBase: { ...diff.mergeBase } } : {}
		})),
		branches: createReadCache((input, signal) => runGitWorkerOperation({
			type: "repository.branches",
			input
		}, { signal }), 0),
		baseline: createReadCache((input, signal) => runGitWorkerOperation({
			type: "checkout.baseline",
			input
		}, { signal }), 0)
	};
}
function runtime() {
	return resolveGlobalSingleton(Symbol.for("openclaw.gitReadCache"), () => ({}), (state) => {
		state.closing ??= Promise.resolve().then(async () => {
			const caches = state.caches;
			state.caches = void 0;
			if (caches) await Promise.all(Object.values(caches).map((cache) => cache.close()));
		}).finally(() => {
			state.closing = void 0;
		});
		return state.closing;
	});
}
function releaseGitReadCache(type, signal) {
	const caches = runtime().caches;
	if (caches) (type === "checkout.context" ? caches.context : caches.branchFacts).release(signal);
}
function runGitReadOperation(operation, options) {
	const state = runtime();
	if (state.closing) return Promise.reject(/* @__PURE__ */ new Error("Git reads are unavailable while the Gateway is restarting"));
	const { context, branchFacts, diff, branches, baseline } = state.caches ??= createReadCaches();
	switch (operation.type) {
		case "checkout.context": return context.read(operation.input, options);
		case "pull-request.branch-facts": return branchFacts.read(operation.input, options);
		case "checkout.diff": return diff.read(operation.input, options);
		case "repository.branches": return branches.read(operation.input, options);
		case "checkout.baseline": return baseline.read(operation.input, options);
	}
	throw new Error("Unsupported Git read operation");
}
//#endregion
export { runGitReadOperation as n, createRetainedCache as r, releaseGitReadCache as t };
