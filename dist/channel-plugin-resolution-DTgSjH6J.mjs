import { t as normalizeAnyChannelId } from "./registry-normalize-DKVgg-js.mjs";
import { n as getLoadedChannelPlugin } from "./registry-B91r5qN6.mjs";
import "./plugins-CCVkYF8m.mjs";
import { t as createClackPrompter } from "./clack-prompter-CALyuZTx.mjs";
import { t as resolveChannelSetupOwner } from "./owner-Bw1UJyA2.mjs";
import { i as resolveTrustedChannelCatalogInput, t as getTrustedChannelPluginCatalogEntry } from "./trusted-catalog-DzZMrVDM.mjs";
import { n as loadChannelSetupPluginRegistrySnapshotForChannel, t as ensureChannelSetupPluginInstalled } from "./plugin-install-C90oicUC.mjs";
//#region src/commands/channel-setup/channel-plugin-resolution.ts
/** Resolve an existing channel plugin, scoped setup plugin, or installable catalog entry. */
async function resolveInstallableChannelPlugin(params) {
	const supports = params.supports ?? (() => true);
	let nextCfg = params.cfg;
	const directChannelId = params.channelId ?? normalizeAnyChannelId(params.rawChannel);
	const registeredPlugin = params.preferRegisteredPlugin && directChannelId ? getLoadedChannelPlugin(directChannelId) : void 0;
	if (params.preferRegisteredPlugin && directChannelId && registeredPlugin) return {
		cfg: nextCfg,
		channelId: directChannelId,
		plugin: registeredPlugin,
		configChanged: false,
		pluginInstalled: false
	};
	const { workspaceDir } = resolveChannelSetupOwner(nextCfg, params.agentId);
	let catalogEntry = (params.rawChannel ? resolveTrustedChannelCatalogInput(params.rawChannel, {
		cfg: nextCfg,
		workspaceDir
	}) : void 0) ?? (params.channelId ? getTrustedChannelPluginCatalogEntry(params.channelId, {
		cfg: nextCfg,
		workspaceDir
	}) : void 0);
	const channelId = directChannelId ?? (catalogEntry ? normalizeAnyChannelId(catalogEntry.id) ?? catalogEntry.id : void 0);
	if (!channelId) return {
		cfg: nextCfg,
		catalogEntry,
		configChanged: false,
		pluginInstalled: false
	};
	let plugin = getLoadedChannelPlugin(channelId);
	let pluginInstalled = false;
	if (!plugin && catalogEntry) {
		const loadPlugin = async (pluginId) => {
			const snapshot = await loadChannelSetupPluginRegistrySnapshotForChannel({
				cfg: nextCfg,
				runtime: params.runtime,
				channel: channelId,
				...pluginId ? { pluginId } : {},
				workspaceDir
			});
			const runtimePlugin = snapshot.channels.find((entry) => entry.plugin.id === channelId)?.plugin;
			if (runtimePlugin) return runtimePlugin;
			const setupPlugin = snapshot.channelSetups.find((entry) => entry.plugin.id === channelId)?.plugin;
			return setupPlugin && supports(setupPlugin) ? setupPlugin : void 0;
		};
		plugin = await loadPlugin(catalogEntry.pluginId);
		if (!plugin && params.allowInstall !== false) {
			const installResult = await ensureChannelSetupPluginInstalled({
				cfg: nextCfg,
				entry: catalogEntry,
				prompter: params.prompter ?? createClackPrompter(),
				runtime: params.runtime,
				workspaceDir
			});
			nextCfg = installResult.cfg;
			const installedPluginId = installResult.pluginId ?? catalogEntry.pluginId;
			pluginInstalled = installResult.installed;
			if (pluginInstalled) plugin = await loadPlugin(installedPluginId);
			if (installedPluginId && catalogEntry.pluginId !== installedPluginId) catalogEntry = {
				...catalogEntry,
				pluginId: installedPluginId
			};
		}
	}
	return {
		cfg: nextCfg,
		channelId,
		plugin,
		catalogEntry,
		configChanged: nextCfg !== params.cfg,
		pluginInstalled
	};
}
//#endregion
export { resolveInstallableChannelPlugin as t };
