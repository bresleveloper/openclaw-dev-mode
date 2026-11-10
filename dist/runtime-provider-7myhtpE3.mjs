import { t as resolveMemoryBackendConfig } from "./memory-core-host-runtime-files-C1pefsWV.mjs";
import { f as configureMemoryCoreDreamingState } from "./dreaming-state-D1mfF5St.mjs";
import { a as prepareMemoryManagerReload } from "./lifecycle-DzyiQIdz.mjs";
import { n as closeMemorySearchManager, r as getMemorySearchManager, t as closeAllMemorySearchManagers } from "./memory-VNVX55ZQ.mjs";
import { t as classifyWorkspaceMemoryPaths } from "./workspace-path-classifier-CBLwy615.mjs";
//#region extensions/memory-core/src/runtime-provider.ts
function createMemoryRuntime(host) {
	if (host.openKeyedStore) configureMemoryCoreDreamingState(host.openKeyedStore);
	return {
		async searchForCli(params) {
			const { searchMemoryForCli } = await import("./memory-search-operation-COWj-vtF.mjs");
			return searchMemoryForCli(params);
		},
		prepareReload: prepareMemoryManagerReload,
		async getMemorySearchManager(params) {
			return await getMemorySearchManager({
				...params,
				...host.acquireLocalService ? { acquireLocalService: host.acquireLocalService } : {},
				runInBackgroundContext: host.runInBackgroundContext
			});
		},
		resolveMemoryBackendConfig,
		async authorizeSearchHits(params) {
			const { filterMemorySearchHitsBySessionVisibility } = await import("./session-search-visibility-B4v65PXf.mjs");
			return await filterMemorySearchHitsBySessionVisibility(params);
		},
		supportsWorkspaceMemoryReadSources: true,
		classifyWorkspaceMemoryPaths,
		closeAllMemorySearchManagers,
		closeMemorySearchManager
	};
}
//#endregion
export { createMemoryRuntime as t };
