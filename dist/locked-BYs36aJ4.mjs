import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import { t as cronStoreKey } from "./key-BBZ40bDq.mjs";
//#region src/cron/service/locked.ts
/** Process-local cron operation serialization by SQLite store partition. */
const cronOperations = new KeyedAsyncQueue();
const pendingSessionCleanups = /* @__PURE__ */ new Map();
/** Returns cleanup that must finish before the same durable job identity can be reused. */
function getPendingCronSessionCleanup(state, jobId) {
	return pendingSessionCleanups.get(cronStoreKey(state.deps.storePath))?.get(jobId)?.done;
}
/** Deferred session cleanup remains a filesystem owner after its cron row disappears. */
function hasPendingCronSessionCleanupForAgent(agentId) {
	for (const jobs of pendingSessionCleanups.values()) for (const cleanup of jobs.values()) if (cleanup.agentId === agentId) return true;
	return false;
}
/** Registers cleanup at the store-partition owner shared by sibling service instances. */
function registerPendingCronSessionCleanup(state, jobId, done, agentId) {
	const storeKey = cronStoreKey(state.deps.storePath);
	let byJobId = pendingSessionCleanups.get(storeKey);
	if (!byJobId) {
		byJobId = /* @__PURE__ */ new Map();
		pendingSessionCleanups.set(storeKey, byJobId);
	}
	byJobId.set(jobId, {
		done,
		agentId
	});
	return () => {
		if (byJobId.get(jobId)?.done !== done) return;
		byJobId.delete(jobId);
		if (byJobId.size === 0) pendingSessionCleanups.delete(storeKey);
	};
}
const resolveChain = (promise) => promise.then(() => void 0, () => void 0);
/** Serializes operations by their actual SQLite partition and service-local order. */
async function locked(state, fn) {
	const previous = state.op;
	const next = cronOperations.enqueue(cronStoreKey(state.deps.storePath), async () => {
		await resolveChain(previous);
		return await fn();
	});
	state.op = resolveChain(next);
	return await next;
}
//#endregion
export { registerPendingCronSessionCleanup as i, hasPendingCronSessionCleanupForAgent as n, locked as r, getPendingCronSessionCleanup as t };
