import { p as extractPluginInstallRecordsFromInstalledPluginIndex } from "./installed-plugin-index-Zl-RSskC.mjs";
import { c as projectPluginMetadataSnapshot, u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-6weqkLDz.mjs";
import { n as resolvePluginControlPlaneWorkspace } from "./control-plane-workspace-BSuk9I48.mjs";
import { r as resolveConfigWidePluginMetadataSnapshot } from "./io.plugin-metadata-DdBZxRt7.mjs";
import { t as resolvePluginActivationSourceConfig } from "./activation-source-config-Dz1QBmPR.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CPntde4x.mjs";
import "./config-CzeZu5J_.mjs";
import { r as createPluginRuntimeLoaderLogger } from "./load-context-Bf_u2yr8.mjs";
import { t as applyPluginAutoEnable } from "./plugin-auto-enable-CSQ1bLlx.mjs";
//#region src/plugins/runtime/load-context.resolve.ts
/** Resolves config, manifests, install records, and auto-enable state for runtime loads. */
function resolvePluginRuntimeLoadContext(options) {
	const env = options?.env ?? process.env;
	const rawConfig = options?.config ?? getRuntimeConfig();
	const rawWorkspaceDir = resolvePluginControlPlaneWorkspace({
		config: rawConfig,
		env,
		workspaceDir: options?.workspaceDir
	}).workspaceDir;
	const metadataSnapshot = options?.metadataSnapshot ?? (options?.manifestRegistry !== void 0 ? void 0 : options?.workspaceDir === void 0 ? projectPluginMetadataSnapshot(resolveConfigWidePluginMetadataSnapshot({
		config: rawConfig,
		env
	}), options?.onlyPluginIds) : resolvePluginMetadataSnapshot({
		config: rawConfig,
		env,
		workspaceDir: rawWorkspaceDir,
		allowWorkspaceScopedCurrent: true,
		...options?.onlyPluginIds !== void 0 ? { pluginIds: options.onlyPluginIds } : {}
	}));
	const manifestRegistry = options?.manifestRegistry ?? metadataSnapshot?.manifestRegistry;
	const activationSourceConfig = resolvePluginActivationSourceConfig({
		config: rawConfig,
		activationSourceConfig: options?.activationSourceConfig
	});
	const autoEnabled = applyPluginAutoEnable({
		config: rawConfig,
		env,
		manifestRegistry,
		discovery: metadataSnapshot?.discovery
	});
	const config = autoEnabled.config;
	const workspaceDir = resolvePluginControlPlaneWorkspace({
		config,
		env,
		workspaceDir: options?.workspaceDir
	}).workspaceDir;
	const installRecords = metadataSnapshot ? extractPluginInstallRecordsFromInstalledPluginIndex(metadataSnapshot.index) : void 0;
	return {
		rawConfig,
		config,
		activationSourceConfig,
		autoEnabledReasons: autoEnabled.autoEnabledReasons,
		workspaceDir,
		env,
		logger: options?.logger ?? createPluginRuntimeLoaderLogger(),
		...manifestRegistry ? { manifestRegistry } : {},
		...metadataSnapshot ? { metadataSnapshot } : {},
		installRecords,
		preferBuiltPluginArtifacts: options?.preferBuiltPluginArtifacts,
		expectedSourceDigests: options?.expectedSourceDigests
	};
}
//#endregion
export { resolvePluginRuntimeLoadContext as t };
