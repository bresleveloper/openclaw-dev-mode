import { t as resolveMemoryBackendConfig } from "./backend-config-D3tXhXDP.mjs";
import "./memory-core-host-runtime-files-CzbMqtDQ.mjs";
import { f as configureMemoryCoreDreamingState } from "./dreaming-state-BHlTqX1G.mjs";
import { r as prepareMemoryManagerReload } from "./lifecycle-ieTqs85R.mjs";
import { n as closeMemorySearchManager, r as getMemorySearchManager, t as closeAllMemorySearchManagers } from "./memory-DkJmZQVc.mjs";
import { t as classifyWorkspaceMemoryPaths } from "./workspace-path-classifier-CvAX6j33.mjs";
//#region extensions/memory-core/src/runtime-provider.ts
function createMemoryRuntime(host) {
	if (host.openKeyedStore) configureMemoryCoreDreamingState(host.openKeyedStore);
	return {
		prepareReload: prepareMemoryManagerReload,
		async getMemorySearchManager(params) {
			const { manager, debug, error } = await getMemorySearchManager({
				...params,
				...host.acquireLocalService ? { acquireLocalService: host.acquireLocalService } : {},
				runInBackgroundContext: host.runInBackgroundContext
			});
			return {
				manager,
				debug,
				error
			};
		},
		resolveMemoryBackendConfig,
		async authorizeSearchHits(params) {
			const { filterMemorySearchHitsBySessionVisibility } = await import("./session-search-visibility-Djv4vu40.mjs");
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
