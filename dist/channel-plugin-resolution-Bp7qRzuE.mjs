import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { i as normalizeChannelId, n as getLoadedChannelPlugin } from "./registry-D3wOWFDo.mjs";
import "./plugins-BEpDh--e.mjs";
import { t as createClackPrompter } from "./clack-prompter-D8DhCvTT.mjs";
import { t as resolveChannelSetupOwner } from "./owner-B6TG8Er8.mjs";
import { r as listTrustedChannelPluginCatalogEntries, t as getTrustedChannelPluginCatalogEntry } from "./trusted-catalog-CFYwh8FA.mjs";
import { n as loadChannelSetupPluginRegistrySnapshotForChannel, t as ensureChannelSetupPluginInstalled } from "./plugin-install-DJtD2IFi.mjs";
//#region src/commands/channel-setup/channel-plugin-resolution.ts
function resolveCatalogChannelEntry(raw, cfg, workspaceDir) {
	const trimmed = normalizeOptionalLowercaseString(raw);
	if (!trimmed) return;
	return listTrustedChannelPluginCatalogEntries({
		cfg,
		workspaceDir
	}).find((entry) => {
		if (normalizeOptionalLowercaseString(entry.id) === trimmed) return true;
		return (entry.meta.aliases ?? []).some((alias) => normalizeOptionalLowercaseString(alias) === trimmed);
	});
}
/** Resolve an existing channel plugin, scoped setup plugin, or installable catalog entry. */
async function resolveInstallableChannelPlugin(params) {
	const supports = params.supports ?? (() => true);
	let nextCfg = params.cfg;
	const directChannelId = params.channelId ?? normalizeChannelId(params.rawChannel);
	const registeredPlugin = params.preferRegisteredPlugin && directChannelId ? getLoadedChannelPlugin(directChannelId) : void 0;
	if (params.preferRegisteredPlugin && directChannelId && registeredPlugin) return {
		cfg: nextCfg,
		channelId: directChannelId,
		plugin: registeredPlugin,
		configChanged: false,
		pluginInstalled: false,
		supportsRequestedCapability: supports(registeredPlugin)
	};
	const { workspaceDir } = resolveChannelSetupOwner(nextCfg, params.agentId);
	let catalogEntry = (params.rawChannel ? resolveCatalogChannelEntry(params.rawChannel, nextCfg, workspaceDir) : void 0) ?? (params.channelId ? getTrustedChannelPluginCatalogEntry(params.channelId, {
		cfg: nextCfg,
		workspaceDir
	}) : void 0);
	const channelId = directChannelId ?? (catalogEntry ? normalizeChannelId(catalogEntry.id) ?? catalogEntry.id : void 0);
	if (!channelId) return {
		cfg: nextCfg,
		catalogEntry,
		configChanged: false,
		pluginInstalled: false
	};
	let plugin = getLoadedChannelPlugin(channelId);
	let pluginInstalled = false;
	if (!plugin && catalogEntry) {
		const loadPlugin = (pluginId) => {
			const snapshot = loadChannelSetupPluginRegistrySnapshotForChannel({
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
		plugin = loadPlugin(catalogEntry.pluginId);
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
			if (pluginInstalled) plugin = loadPlugin(installedPluginId);
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
		pluginInstalled,
		supportsRequestedCapability: plugin ? supports(plugin) : void 0
	};
}
//#endregion
export { resolveInstallableChannelPlugin as t };
