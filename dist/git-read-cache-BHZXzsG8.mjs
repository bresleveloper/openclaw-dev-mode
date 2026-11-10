import { d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { w as runWithGatewayDetachedWorkContinuation } from "./gateway-work-admission-FWbk4b3p.mjs";
import { t as runGitWorkerOperation } from "./git-worker-DahANBH3.mjs";
//#region src/infra/git-read-cache.ts
const MAX_CACHED_CHECKOUTS = 1e3;
const log = createSubsystemLogger("git/read");
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
function createReadCache(load, freshnessMs, clone = structuredClone, revision, keyOf = JSON.stringify, snapshot, retain = () => true) {
	const entries = /* @__PURE__ */ new Map();
	const pending = /* @__PURE__ */ new Set();
	const revisions = /* @__PURE__ */ new Map();
	let refreshTail = Promise.resolve();
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
			if (options.refresh && currentRevision === null || !entry || entry.revision !== revisionKey || entry.expiresAt <= Date.now() && (!snapshot || !entry.pending)) {
				if (snapshot && pending.size >= MAX_CACHED_CHECKOUTS) return clone(entry?.value ?? snapshot.empty());
				const previousRefresh = refreshTail;
				const controller = new AbortController();
				const next = {
					revision: revisionKey,
					expiresAt: freshnessMs === 0 ? Number.POSITIVE_INFINITY : Date.now() + (currentRevision === null ? Math.min(freshnessMs, 75e3) : freshnessMs),
					controller,
					subscribers: 0,
					pending: true,
					value: entry?.value,
					promise: Promise.resolve().then(() => snapshot ? runWithGatewayDetachedWorkContinuation(async () => {
						await previousRefresh;
						controller.signal.throwIfAborted();
						return load(prepared, controller.signal);
					}, "runtime:project-discovery") : load(prepared, controller.signal))
				};
				pending.add(next);
				next.promise = next.promise.then((value) => {
					next.pending = false;
					pending.delete(next);
					controller.signal.throwIfAborted();
					if (snapshot) {
						next.value = value;
						next.expiresAt = Date.now() + freshnessMs;
					}
					if (freshnessMs === 0 || !retain(value)) remove(key, next);
					return value;
				}, (error) => {
					next.pending = false;
					pending.delete(next);
					if (snapshot) next.expiresAt = Date.now() + freshnessMs;
					else {
						next.expiresAt = 0;
						remove(key, next);
					}
					throw error;
				});
				if (snapshot) refreshTail = next.promise.catch(() => {
					if (!controller.signal.aborted) log.warn("Repository discovery refresh failed; retaining the previous project snapshot");
				});
				entry = next;
			}
			entries.delete(key);
			entries.set(key, entry);
			pruneMapToMaxSize(entries, MAX_CACHED_CHECKOUTS);
			return snapshot ? clone(entry.value ?? snapshot.empty()) : subscribe(entry, clone, options.signal);
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
	const comparisons = createReadCache((input, signal) => runGitWorkerOperation({
		type: "pull-request.branch-comparison",
		input
	}, { signal }), Number.POSITIVE_INFINITY, structuredClone, (input, signal) => runGitWorkerOperation({
		type: "checkout.revision",
		input: {
			...input,
			scope: "refs"
		}
	}, { signal }), (input) => input.root, void 0, (value) => value.complete);
	return {
		comparisons,
		identities: createReadCache((input, signal) => runGitWorkerOperation({
			type: "repository.identities",
			input
		}, { signal }), 6e4, structuredClone, void 0, (input) => JSON.stringify([input, Object.entries(process.env).filter(([key]) => /^(GIT_|HOME$|XDG_CONFIG_HOME$|PATH$|SUDO_UID$)/i.test(key)).toSorted(([left], [right]) => left.localeCompare(right))]), { empty: () => [] }),
		context: createReadCache((input, signal) => runGitWorkerOperation({
			type: "checkout.context",
			input
		}, { signal }), Number.POSITIVE_INFINITY, structuredClone, (input, signal) => runGitWorkerOperation({
			type: "checkout.revision",
			input: {
				root: input.root,
				scope: "context"
			}
		}, { signal }), (input) => input.root),
		branchFacts: createReadCache(async (input, signal) => {
			try {
				const { refreshIndex: _, ...comparisonInput } = input;
				const comparison = await comparisons.read(comparisonInput, {
					signal,
					refresh: true
				});
				return await runGitWorkerOperation({
					type: "pull-request.branch-facts",
					input: {
						...input,
						comparison
					}
				}, { signal });
			} catch {
				signal.throwIfAborted();
				log.warn("PR comparison unavailable; fetch repository history and retry. Dependent comparisons skipped.");
				return {
					creatable: false,
					stats: null
				};
			}
		}, 3e5, structuredClone, (input, signal) => runGitWorkerOperation({
			type: "checkout.revision",
			input: {
				...input,
				scope: "worktree"
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
