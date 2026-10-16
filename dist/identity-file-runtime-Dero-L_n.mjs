import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { t as LruCache } from "./lru-cache-C3Xgvc4Q.mjs";
import { n as resolveRuntimeProcessEntrypointUrl } from "./runtime-process-url-D3H3_asn.mjs";
import { r as WorkerTaskError } from "./src-WCJCjrey.mjs";
import { t as WorkerTaskPool } from "./worker-task-pool-iI3pfrsK.mjs";
import path from "node:path";
//#region src/agents/identity-file-runtime.ts
const MAX_IDENTITY_CACHE_BYTES = 16777216;
const MAX_IDENTITY_CACHE_ENTRIES = 64;
function prepareIdentityFile(identityPath) {
	const runtime = resolveGlobalSingleton(Symbol.for("openclaw.identityFiles"), () => ({
		pending: /* @__PURE__ */ new Map(),
		cached: new LruCache(MAX_IDENTITY_CACHE_ENTRIES, {
			maxBytes: MAX_IDENTITY_CACHE_BYTES,
			sizeOf: (entry) => entry.size
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
	if (runtime.closing) return Promise.reject(new WorkerTaskError("Identity file reader is closing", "unavailable"));
	const filePath = path.resolve(identityPath);
	return getOrCreatePromise(runtime.pending, filePath, async () => {
		const previous = runtime.cached.peek(filePath);
		const result = await (runtime.pool ??= new WorkerTaskPool({
			workerUrl: resolveRuntimeProcessEntrypointUrl("identityFile"),
			maxWorkers: 2,
			sharedCompute: true,
			maxPendingTasks: 256,
			maxPendingBytes: 1048576
		})).run({
			identityPath: filePath,
			knownRevision: previous?.revision
		}, { inputBytes: 2 * (filePath.length + (previous?.revision.length ?? 0)) });
		const prepared = result.kind === "unchanged" ? previous : result;
		if (!prepared) throw new Error("Identity file reader returned an unknown revision");
		if (prepared.kind === "loaded") runtime.cached.set(filePath, prepared);
		else runtime.cached.delete(filePath);
		return prepared;
	}, { evictOnSettled: true });
}
//#endregion
export { prepareIdentityFile };
