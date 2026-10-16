import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { t as LruCache } from "./lru-cache-C3Xgvc4Q.mjs";
import { n as resolveRuntimeProcessEntrypointUrl } from "./runtime-process-url-D3H3_asn.mjs";
import { r as WorkerTaskError } from "./src-WCJCjrey.mjs";
import { t as WorkerTaskPool } from "./worker-task-pool-iI3pfrsK.mjs";
import { t as localAgentAvatarRevision } from "./identity-avatar-file-CzAdV6tU.mjs";
//#region src/agents/identity-avatar-file-runtime.ts
const MAX_AVATAR_CACHE_BYTES = 16777216;
const MAX_AVATAR_CACHE_ENTRIES = 64;
function prepareLocalAgentAvatar(input) {
	const runtime = resolveGlobalSingleton(Symbol.for("openclaw.localAgentAvatars"), () => ({
		pending: /* @__PURE__ */ new Map(),
		cached: new LruCache(MAX_AVATAR_CACHE_ENTRIES, {
			maxBytes: MAX_AVATAR_CACHE_BYTES,
			sizeOf: (entry) => entry.file.body?.byteLength ?? 0
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
	if (runtime.closing) return Promise.reject(new WorkerTaskError("Avatar reader is closing", "unavailable"));
	const key = JSON.stringify([
		input.workspaceDir,
		input.source,
		input.readBody
	]);
	return getOrCreatePromise(runtime.pending, key, async () => {
		const previous = runtime.cached.peek(key);
		const pool = runtime.pool ??= new WorkerTaskPool({
			workerUrl: resolveRuntimeProcessEntrypointUrl("localAgentAvatar"),
			maxWorkers: 2,
			sharedCompute: true,
			maxPendingTasks: 256,
			maxPendingBytes: 1048576
		});
		const knownRevision = previous ? localAgentAvatarRevision(previous.file) : void 0;
		const result = await pool.run({
			...input,
			knownRevision
		}, { inputBytes: 2 * (key.length + (knownRevision?.length ?? 0)) });
		let prepared = previous;
		if (!("kind" in result)) prepared = result.ok ? {
			ok: true,
			file: {
				...result.file,
				body: result.file.body ? Buffer.from(result.file.body.buffer, result.file.body.byteOffset, result.file.body.byteLength) : void 0
			}
		} : result;
		if (!prepared) throw new Error("Avatar reader returned an unknown revision");
		if (prepared.ok) runtime.cached.set(key, prepared);
		else runtime.cached.delete(key);
		return prepared;
	}, { evictOnSettled: true });
}
//#endregion
export { prepareLocalAgentAvatar };
