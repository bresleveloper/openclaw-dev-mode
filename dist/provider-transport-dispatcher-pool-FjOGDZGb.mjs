import { t as PinnedDispatcherPool } from "./pinned-dispatcher-pool-DxmgGQxN.mjs";
import { i as setProviderTransportDispatcherPoolActive } from "./provider-runtime-lifecycle-Cn0O7tiR.mjs";
//#region src/agents/provider-transport-dispatcher-pool.ts
const PROVIDER_DISPATCHER_POOL_MAX_ENTRIES = 16;
const PROVIDER_DISPATCHER_POOL_IDLE_TTL_MS = 6e4;
let activePool;
/** Returns the current process-lifecycle provider dispatcher pool generation. */
function getProviderTransportDispatcherPool() {
	if (!activePool) {
		activePool = new PinnedDispatcherPool({
			maxEntries: PROVIDER_DISPATCHER_POOL_MAX_ENTRIES,
			idleTtlMs: PROVIDER_DISPATCHER_POOL_IDLE_TTL_MS
		});
		setProviderTransportDispatcherPoolActive(true);
	}
	return activePool;
}
/** Closes the current generation while allowing an in-process Gateway restart to create another. */
async function closeProviderTransportDispatcherPool() {
	const pool = activePool;
	if (pool) {
		await pool.closeAll();
		if (activePool === pool) {
			activePool = void 0;
			setProviderTransportDispatcherPoolActive(false);
		}
	}
}
//#endregion
export { getProviderTransportDispatcherPool as n, closeProviderTransportDispatcherPool as t };
