import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { d as resolveAgentWorkspaceDir, g as resolveDefaultAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { d as resolveDiscoverableScopedChannelPluginIds, l as resolveConfiguredChannelPluginIds } from "./channel-presence-policy-BruI3Lbo.mjs";
import "./channel-plugin-ids-DY8VBQ0g.mjs";
import { t as applyPluginAutoEnable } from "./plugin-auto-enable-A8cOwPsR.mjs";
import { n as loadPluginRegistryHandle } from "./loader-D4eOiGg6.mjs";
import { t as ensureOnboardingPluginInstalled } from "./onboarding-plugin-install-DX_EgaWy.mjs";
import { t as getTrustedChannelPluginCatalogEntry } from "./trusted-catalog-rNaQIEAs.mjs";
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
function loadChannelSetupPluginRegistry(params) {
	const autoEnabled = applyPluginAutoEnable({
		config: params.cfg,
		env: process.env
	});
	const resolvedConfig = autoEnabled.config;
	const workspaceDir = params.workspaceDir ?? resolveAgentWorkspaceDir(resolvedConfig, resolveDefaultAgentId(resolvedConfig));
	const onlyPluginIds = params.onlyPluginIds ?? resolveConfiguredChannelPluginIds({
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
function resolveScopedChannelPluginId(params) {
	const explicitPluginId = params.pluginId?.trim();
	if (explicitPluginId) return explicitPluginId;
	return getTrustedChannelPluginCatalogEntry(params.channel, {
		cfg: params.cfg,
		workspaceDir: params.workspaceDir
	})?.pluginId ?? resolveUniqueManifestScopedChannelPluginId(params);
}
function resolveUniqueManifestScopedChannelPluginId(params) {
	const matches = resolveDiscoverableScopedChannelPluginIds({
		config: params.cfg,
		channelIds: [params.channel],
		workspaceDir: params.workspaceDir,
		env: process.env
	});
	return matches.length === 1 ? matches[0] : void 0;
}
/** Load an inactive setup-plugin registry snapshot for resolving a channel without side effects. */
function loadChannelSetupPluginRegistrySnapshotForChannel(params) {
	const scopedPluginId = resolveScopedChannelPluginId({
		cfg: params.cfg,
		channel: params.channel,
		pluginId: params.pluginId,
		workspaceDir: params.workspaceDir
	});
	return loadChannelSetupPluginRegistry({
		...params,
		...scopedPluginId ? { onlyPluginIds: [scopedPluginId] } : {}
	});
}
//#endregion
export { loadChannelSetupPluginRegistrySnapshotForChannel as n, ensureChannelSetupPluginInstalled as t };
