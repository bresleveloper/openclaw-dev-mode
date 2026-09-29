import { i as getTailnetHostname } from "./tailscale-BRIsmHIP.mjs";
import { a as getActiveMemorySearchManagerCore } from "./memory-runtime-CtPYkvwg.mjs";
//#region src/commands/status.scan.deps.runtime.ts
/** Returns a narrow memory manager adapter for status probing. */
async function getMemorySearchManager(params) {
	const { manager } = await getActiveMemorySearchManagerCore(params);
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
