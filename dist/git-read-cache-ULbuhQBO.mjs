import { u as toErrorObject } from "./error-coercion-CvJK4lmH.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { t as runGitWorkerOperation } from "./git-worker-pOqNR_b6.mjs";
//#region src/infra/git-read-cache.ts
const MAX_CACHED_CHECKOUTS = 1e3;
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
function createReadCache(load, freshnessMs, clone = structuredClone, revision, keyOf = JSON.stringify) {
	const entries = /* @__PURE__ */ new Map();
	const pending = /* @__PURE__ */ new Set();
	const revisions = /* @__PURE__ */ new Map();
	let closed = false;
	const remove = (key, entry) => {
		if (entries.get(key) === entry) entries.delete(key);
	};
	return {
		async read(input, options = {}) {
			options.signal?.throwIfAborted();
			const prepared = structuredClone(input);
			const key = keyOf(prepared);
			let currentRevision;
			if (revision) {
				const controller = new AbortController();
				const check = revision(prepared, options.signal ? AbortSignal.any([controller.signal, options.signal]) : controller.signal);
				revisions.set(controller, check);
				try {
					currentRevision = await check;
				} finally {
					revisions.delete(controller);
				}
			}
			const revisionKey = JSON.stringify([prepared, currentRevision]);
			options.signal?.throwIfAborted();
			if (closed) throw new Error("Git reads are unavailable while the Gateway is restarting");
			let entry = entries.get(key);
			if (options.refresh && currentRevision === null || !entry || entry.revision !== revisionKey || entry.expiresAt <= Date.now()) {
				const controller = new AbortController();
				const next = {
					revision: revisionKey,
					expiresAt: freshnessMs === 0 ? Number.POSITIVE_INFINITY : Date.now() + (currentRevision === null ? Math.min(freshnessMs, 75e3) : freshnessMs),
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
					if (freshnessMs === 0) remove(key, next);
					return value;
				}, (error) => {
					next.pending = false;
					pending.delete(next);
					next.expiresAt = 0;
					remove(key, next);
					throw error;
				});
				entry = next;
			}
			entries.delete(key);
			entries.set(key, entry);
			pruneMapToMaxSize(entries, MAX_CACHED_CHECKOUTS);
			return subscribe(entry, clone, options.signal);
		},
		async close() {
			closed = true;
			for (const controller of revisions.keys()) controller.abort();
			const retiring = [...pending];
			for (const entry of retiring) {
				entry.expiresAt = 0;
				entry.controller.abort();
			}
			entries.clear();
			await Promise.allSettled([...revisions.values(), ...retiring.map((entry) => entry.promise)]);
		}
	};
}
function createReadCaches() {
	return {
		identities: createReadCache((input, signal) => runGitWorkerOperation({
			type: "repository.identities",
			input
		}, { signal }), 0),
		context: createReadCache((input, signal) => runGitWorkerOperation({
			type: "checkout.context",
			input
		}, { signal }), Number.POSITIVE_INFINITY, structuredClone, (input, signal) => runGitWorkerOperation({
			type: "checkout.revision",
			input: {
				root: input.root,
				includeIndex: false
			}
		}, { signal }), (input) => input.root),
		branchFacts: createReadCache((input, signal) => runGitWorkerOperation({
			type: "pull-request.branch-facts",
			input
		}, { signal }), 3e5, structuredClone, (input, signal) => runGitWorkerOperation({
			type: "checkout.revision",
			input: {
				...input,
				includeIndex: true
			}
		}, { signal }), (input) => input.root),
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
function runGitReadOperation(operation, options) {
	const state = runtime();
	if (state.closing) return Promise.reject(/* @__PURE__ */ new Error("Git reads are unavailable while the Gateway is restarting"));
	const { context, branchFacts, diff, branches, baseline, identities } = state.caches ??= createReadCaches();
	switch (operation.type) {
		case "repository.identities": return identities.read(operation.input, options);
		case "checkout.revision": return runGitWorkerOperation(operation, options);
		case "checkout.context": return context.read(operation.input, options);
		case "pull-request.branch-facts": return branchFacts.read(operation.input, options);
		case "checkout.diff": return diff.read(operation.input, options);
		case "repository.branches": return branches.read(operation.input, options);
		case "checkout.baseline": return baseline.read(operation.input, options);
	}
	throw new Error("Unsupported Git read operation");
}
//#endregion
export { runGitReadOperation as t };
