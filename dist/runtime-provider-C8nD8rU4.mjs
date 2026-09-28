import { t as resolveMemoryBackendConfig } from "./backend-config-D3tXhXDP.mjs";
import "./memory-core-host-runtime-files-u1TC5L8O.mjs";
import { p as configureMemoryCoreDreamingState } from "./dreaming-state-DJfKblhZ.mjs";
import { r as prepareMemoryManagerReload } from "./lifecycle-CtUK0V21.mjs";
import { n as closeMemorySearchManager, r as getMemorySearchManager, t as closeAllMemorySearchManagers } from "./memory-C_X5LB4G.mjs";
import { t as classifyWorkspaceMemoryPaths } from "./workspace-path-classifier-CeQFicHM.mjs";
//#region extensions/memory-core/src/runtime-provider.ts
function createMemoryRuntime(host = {}) {
	if (host.openKeyedStore) configureMemoryCoreDreamingState(host.openKeyedStore);
	return {
		prepareReload: prepareMemoryManagerReload,
		async getMemorySearchManager(params) {
			const { manager, debug, error } = await getMemorySearchManager({
				...params,
				...host.acquireLocalService ? { acquireLocalService: host.acquireLocalService } : {}
			});
			return {
				manager,
				debug,
				error
			};
		},
		resolveMemoryBackendConfig,
		async authorizeSearchHits(params) {
			const { filterMemorySearchHitsBySessionVisibility } = await import("./session-search-visibility-DrCK42_E.mjs");
			return await filterMemorySearchHitsBySessionVisibility(params);
		},
		supportsWorkspaceMemoryReadSources: true,
		classifyWorkspaceMemoryPaths,
		closeAllMemorySearchManagers,
		closeMemorySearchManager
	};
}
const memoryRuntime = createMemoryRuntime();
//#endregion
export { memoryRuntime as n, createMemoryRuntime as t };
