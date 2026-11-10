import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { _ as resolveDefaultAgentId, f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { h as resolveDiscoverableScopedChannelPluginIds, p as resolveConfiguredChannelPluginIdsAsync } from "./channel-presence-policy-hdzky3AO.mjs";
import "./channel-plugin-ids-Bgv12GOX.mjs";
import { t as applyPluginAutoEnable } from "./plugin-auto-enable-DYmyl_xH.mjs";
import { n as loadPluginRegistryHandle } from "./loader-B8PRFJEU.mjs";
import { t as ensureOnboardingPluginInstalled } from "./onboarding-plugin-install-D79DRY80.mjs";
import { t as getTrustedChannelPluginCatalogEntry } from "./trusted-catalog-DzZMrVDM.mjs";
//#region src/commands/channel-setup/plugin-install.ts
/** Install or reuse the plugin package required by a trusted channel catalog entry. */
async function ensureChannelSetupPluginInstalled(params) {
	const result = await ensureOnboardingPluginInstalled({
		cfg: params.cfg,
		entry: {
			pluginId: params.entry.pluginId ?? params.entry.id,
			label: params.entry.meta.label,
			install: params.entry.install,
			...params.entry.trustedSourceLinkedOfficialInstall ? { trustedSourceLinkedOfficialInstall: true } : {}
		},
		prompter: params.prompter,
		runtime: params.runtime,
		workspaceDir: params.workspaceDir,
		...params.promptInstall !== void 0 ? { promptInstall: params.promptInstall } : {},
		...params.autoConfirmSingleSource !== void 0 ? { autoConfirmSingleSource: params.autoConfirmSingleSource } : {},
		...params.beforePersistentEffect ? { beforePersistentEffect: params.beforePersistentEffect } : {}
	});
	return {
		cfg: result.cfg,
		installed: result.installed,
		pluginId: result.pluginId,
		status: result.status
	};
}
/** Load an inactive setup-plugin registry snapshot for resolving a channel without side effects. */
async function loadChannelSetupPluginRegistrySnapshotForChannel(params) {
	let scopedPluginId = params.pluginId?.trim();
	if (!scopedPluginId) {
		scopedPluginId = getTrustedChannelPluginCatalogEntry(params.channel, {
			cfg: params.cfg,
			workspaceDir: params.workspaceDir
		})?.pluginId;
		if (scopedPluginId == null) {
			const matches = resolveDiscoverableScopedChannelPluginIds({
				config: params.cfg,
				channelIds: [params.channel],
				workspaceDir: params.workspaceDir,
				env: process.env
			});
			scopedPluginId = matches.length === 1 ? matches[0] : void 0;
		}
	}
	const autoEnabled = applyPluginAutoEnable({
		config: params.cfg,
		env: process.env
	});
	const resolvedConfig = autoEnabled.config;
	const workspaceDir = params.workspaceDir ?? resolveAgentWorkspaceDir(resolvedConfig, resolveDefaultAgentId(resolvedConfig));
	const onlyPluginIds = scopedPluginId ? [scopedPluginId] : await resolveConfiguredChannelPluginIdsAsync({
		config: resolvedConfig,
		activationSourceConfig: params.cfg,
		workspaceDir,
		env: process.env
	});
	const log = createSubsystemLogger("plugins");
	return loadPluginRegistryHandle({
		config: resolvedConfig,
		activationSourceConfig: params.cfg,
		autoEnabledReasons: autoEnabled.autoEnabledReasons,
		workspaceDir,
		cache: false,
		logger: log,
		onlyPluginIds,
		includeSetupOnlyChannelPlugins: true,
		forceSetupOnlyChannelPlugins: params.forceSetupOnlyChannelPlugins,
		channelPluginLoadIntent: "setup"
	});
}
//#endregion
export { loadChannelSetupPluginRegistrySnapshotForChannel as n, ensureChannelSetupPluginInstalled as t };
