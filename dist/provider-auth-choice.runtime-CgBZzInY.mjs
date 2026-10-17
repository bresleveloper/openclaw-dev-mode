import { a as loadInstalledPluginIndexWithDiscovery } from "./installed-plugin-index-Zl-RSskC.mjs";
import { i as loadInstalledPluginIndexInstallRecordsSync } from "./installed-plugin-index-record-reader-C4Wdbs53.mjs";
import "./setup-registry-ajqRvCgP.mjs";
import { r as resolvePluginProvidersCore } from "./providers.runtime-BsABoqOU.mjs";
import "./provider-wizard-D3JqcEaG.mjs";
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
