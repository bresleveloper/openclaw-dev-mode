import { o as getTailnetHostname } from "./tailscale-BQCmy6GX.js";
import { r as getActiveMemorySearchManager } from "./memory-runtime-C--Ao28B.js";
//#region src/commands/status.scan.deps.runtime.ts
/** Returns a narrow memory manager adapter for status probing. */
async function getMemorySearchManager(params) {
	const { manager } = await getActiveMemorySearchManager(params);
	if (!manager) return { manager: null };
	return { manager: {
		probeVectorStoreAvailability: manager.probeVectorStoreAvailability ? async () => await manager.probeVectorStoreAvailability() : void 0,
		async probeVectorAvailability() {
			return await manager.probeVectorAvailability();
		},
		status() {
			return manager.status();
		},
		close: manager.close ? async () => await manager.close?.() : void 0
	} };
}
//#endregion
export { getMemorySearchManager, getTailnetHostname };
