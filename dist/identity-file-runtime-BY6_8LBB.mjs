import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as LruCache } from "./lru-cache-C3Xgvc4Q.mjs";
import { n as resolveRuntimeProcessEntrypointUrl } from "./runtime-process-url-BCfqgqXF.mjs";
import { r as WorkerTaskError } from "./src-NEpyeLp1.mjs";
import { t as WorkerTaskPool } from "./worker-task-pool-D6ogd941.mjs";
import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.mjs";
import path from "node:path";
//#region src/agents/identity-file-runtime.ts
/** Identity metadata and avatar bytes share admission and cache settlement, not file policy. */
function prepareCachedIdentityRead(params) {
	const runtime = resolveGlobalSingleton(params.runtimeKey, () => ({
		pending: /* @__PURE__ */ new Map(),
		cached: new LruCache(64, {
			maxBytes: 16777216,
			sizeOf: params.sizeOf
		})
	}), (state) => {
		state.closing ??= (async () => {
			await state.pool?.close();
			await Promise.allSettled(state.pending.values());
			state.pool = void 0;
			state.cached.clear();
		})().finally(() => {
			state.closing = void 0;
		});
		return state.closing;
	});
	if (runtime.closing) return Promise.reject(new WorkerTaskError(`${params.readerName} is closing`, "unavailable"));
	const key = params.key();
	return getOrCreatePromise(runtime.pending, key, async () => {
		const previous = runtime.cached.peek(key);
		const pool = runtime.pool ??= new WorkerTaskPool({
			workerUrl: resolveRuntimeProcessEntrypointUrl(params.worker),
			workerClass: "file-reader",
			sharedCompute: true,
			maxPendingTasks: 256,
			maxPendingBytes: 1048576
		});
		const knownRevision = previous ? params.revision(previous) : void 0;
		const result = await pool.run(params.input(key, knownRevision), { inputBytes: 2 * (key.length + (knownRevision?.length ?? 0)) });
		const prepared = params.prepare(result, previous);
		if (!prepared) throw new Error(`${params.readerName} returned an unknown revision`);
		if (params.isLoaded(prepared)) runtime.cached.set(key, prepared);
		else runtime.cached.delete(key);
		return prepared;
	}, { evictOnSettled: true });
}
function prepareIdentityFile(identityPath) {
	return prepareCachedIdentityRead({
		runtimeKey: Symbol.for("openclaw.identityFiles"),
		worker: "identityFile",
		readerName: "Identity file reader",
		key: () => path.resolve(identityPath),
		input: (filePath, knownRevision) => ({
			identityPath: filePath,
			knownRevision
		}),
		revision: (entry) => entry.revision,
		sizeOf: (entry) => entry.size,
		prepare: (result, previous) => result.kind === "unchanged" ? previous : result,
		isLoaded: (result) => result.kind === "loaded"
	});
}
//#endregion
export { prepareIdentityFile as n, prepareCachedIdentityRead as t };
