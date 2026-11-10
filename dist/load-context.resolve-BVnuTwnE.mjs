import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { p as extractPluginInstallRecordsFromInstalledPluginIndex } from "./installed-plugin-index-LVFKT7eZ.mjs";
import { c as projectPluginMetadataSnapshot, u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-DET-4y9k.mjs";
import { n as resolvePluginControlPlaneWorkspace } from "./control-plane-workspace-DZuGS_2S.mjs";
import { r as resolveConfigWidePluginMetadataSnapshot } from "./io.plugin-metadata-DeOUS5WQ.mjs";
import { t as resolvePluginActivationSourceConfig } from "./activation-source-config-vHcoMR69.mjs";
import "./config-B3oiWDlr.mjs";
import { r as createPluginRuntimeLoaderLogger } from "./load-context-YqkPeFye.mjs";
import { t as applyPluginAutoEnable } from "./plugin-auto-enable-DYmyl_xH.mjs";
//#region src/plugins/runtime/load-context.resolve.ts
function resolvePluginRuntimeLoadContext(options) {
	const env = options?.env ?? process.env;
	const rawConfig = options?.config ?? readRuntimeConfig();
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
