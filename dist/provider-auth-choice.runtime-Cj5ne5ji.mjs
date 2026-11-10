import { a as loadInstalledPluginIndexWithDiscovery } from "./installed-plugin-index-LVFKT7eZ.mjs";
import { i as loadInstalledPluginIndexInstallRecordsSync } from "./installed-plugin-index-record-reader-CE166Xp8.mjs";
import "./setup-registry-CGxNMBUk.mjs";
import { r as resolvePluginProvidersCore } from "./providers.runtime-CGIaZ9Jy.mjs";
import "./provider-wizard-DFpC4MOf.mjs";
//#region src/plugins/provider-auth-choice.runtime.ts
/** Runtime wrapper for registered model provider discovery. */
function resolvePluginProviders(params, preparedInstallRecords) {
	if (!preparedInstallRecords) return resolvePluginProvidersCore(params);
	const pluginMetadataSnapshot = loadInstalledPluginIndexWithDiscovery({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		installRecords: {
			...loadInstalledPluginIndexInstallRecordsSync({ env: params.env }),
			...preparedInstallRecords
		}
	});
	return resolvePluginProvidersCore({
		...params,
		pluginMetadataSnapshot
	});
}
//#endregion
export { resolvePluginProviders as t };
