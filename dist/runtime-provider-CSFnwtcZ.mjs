import { t as resolveMemoryBackendConfig } from "./backend-config-D3tXhXDP.mjs";
import "./memory-core-host-runtime-files-XBnONNUl.mjs";
import { p as configureMemoryCoreDreamingState } from "./dreaming-state-DJfKblhZ.mjs";
import { r as prepareMemoryManagerReload } from "./lifecycle-CtUK0V21.mjs";
import { n as closeMemorySearchManager, r as getMemorySearchManager, t as closeAllMemorySearchManagers } from "./memory-Bv2u560h.mjs";
import { t as classifyWorkspaceMemoryPaths } from "./workspace-path-classifier-B--qmGSg.mjs";
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
			const { filterMemorySearchHitsBySessionVisibility } = await import("./session-search-visibility-BmoVEczT.mjs");
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
