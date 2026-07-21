import { t as createSubsystemLogger } from "./subsystem-C3fiUGN1.js";
import "./agent-scope-B2Pk_xhT.js";
import { c as resolveDefaultAgentId, o as resolveAgentWorkspaceDir } from "./agent-scope-config-BxAUeF6t.js";
import { i as isReusableCurrentPluginMetadataSnapshot, n as clearCurrentPluginMetadataSnapshot, o as setCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-CT4JjmjS.js";
import { p as extractPluginInstallRecordsFromInstalledPluginIndex } from "./installed-plugin-index-fYkAwJU0.js";
import { a as resolvePluginMetadataSnapshot, n as isPluginMetadataSnapshotCompatible } from "./plugin-metadata-snapshot-fqwcFyP9.js";
import { i as getRuntimeConfig } from "./io-DxnOT4sF.js";
import "./config-Cc93keN1.js";
import { t as applyPluginAutoEnable } from "./plugin-auto-enable-Dh5br2P5.js";
import { t as resolvePluginActivationSourceConfig } from "./activation-source-config-DKeLM_VJ.js";
import "./logging-DBHEcFUB.js";
//#region src/plugins/runtime/load-context.ts
const log = createSubsystemLogger("plugins");
/** Creates the default plugin runtime loader logger. */
function createPluginRuntimeLoaderLogger() {
	return {
		info: (message) => log.info(message),
		warn: (message) => log.warn(message),
		error: (message) => log.error(message),
		debug: (message) => log.debug(message)
	};
}
/** Resolves config, manifests, install records, and auto-enable state for runtime loads. */
function resolvePluginRuntimeLoadContext(options) {
	const env = options?.env ?? process.env;
	const rawConfig = options?.config ?? getRuntimeConfig();
	const rawWorkspaceDir = options?.workspaceDir ?? resolveAgentWorkspaceDir(rawConfig, resolveDefaultAgentId(rawConfig));
	const initialMetadataSnapshot = options?.manifestRegistry === void 0 ? resolvePluginMetadataSnapshot({
		config: rawConfig,
		env,
		workspaceDir: rawWorkspaceDir,
		allowWorkspaceScopedCurrent: true
	}) : void 0;
	const manifestRegistry = options?.manifestRegistry ?? initialMetadataSnapshot?.manifestRegistry;
	const activationSourceConfig = resolvePluginActivationSourceConfig({
		config: rawConfig,
		activationSourceConfig: options?.activationSourceConfig
	});
	const autoEnabled = applyPluginAutoEnable({
		config: rawConfig,
		env,
		manifestRegistry,
		discovery: initialMetadataSnapshot?.discovery
	});
	const config = autoEnabled.config;
	const workspaceDir = options?.workspaceDir ?? resolveAgentWorkspaceDir(config, resolveDefaultAgentId(config));
	const metadataSnapshot = options?.manifestRegistry !== void 0 ? void 0 : initialMetadataSnapshot && isPluginMetadataSnapshotCompatible({
		snapshot: initialMetadataSnapshot,
		config,
		env,
		workspaceDir
	}) ? initialMetadataSnapshot : resolvePluginMetadataSnapshot({
		config,
		env,
		workspaceDir,
		allowWorkspaceScopedCurrent: true,
		...initialMetadataSnapshot ? { index: initialMetadataSnapshot.index } : {}
	});
	const finalManifestRegistry = options?.manifestRegistry ?? metadataSnapshot?.manifestRegistry;
	const installRecords = metadataSnapshot ? extractPluginInstallRecordsFromInstalledPluginIndex(metadataSnapshot.index) : void 0;
	if (metadataSnapshot) if (isReusableCurrentPluginMetadataSnapshot(metadataSnapshot)) setCurrentPluginMetadataSnapshot(metadataSnapshot, {
		config: rawConfig,
		compatibleConfigs: [config, activationSourceConfig],
		env,
		workspaceDir
	});
	else clearCurrentPluginMetadataSnapshot();
	return {
		rawConfig,
		config,
		activationSourceConfig,
		autoEnabledReasons: autoEnabled.autoEnabledReasons,
		workspaceDir,
		env,
		logger: options?.logger ?? createPluginRuntimeLoaderLogger(),
		...finalManifestRegistry ? { manifestRegistry: finalManifestRegistry } : {},
		installRecords
	};
}
/** Builds plugin load options from a resolved runtime load context. */
function buildPluginRuntimeLoadOptions(context, overrides) {
	return buildPluginRuntimeLoadOptionsFromValues(context, overrides);
}
/** Builds plugin load options from explicit runtime load values. */
function buildPluginRuntimeLoadOptionsFromValues(values, overrides) {
	return {
		config: values.config,
		activationSourceConfig: values.activationSourceConfig,
		autoEnabledReasons: values.autoEnabledReasons,
		workspaceDir: values.workspaceDir,
		env: values.env,
		logger: values.logger,
		manifestRegistry: values.manifestRegistry,
		installRecords: values.installRecords,
		...overrides
	};
}
//#endregion
export { resolvePluginRuntimeLoadContext as i, buildPluginRuntimeLoadOptionsFromValues as n, createPluginRuntimeLoaderLogger as r, buildPluginRuntimeLoadOptions as t };
