import { r as isChannelVisibleInSetup } from "./channel-meta-Z2puM9_M.mjs";
import { s as listChatChannels } from "./registry-DqsL4UWB.mjs";
import { _ as resolveDefaultAgentId, f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { t as listPluginContributionIds } from "./plugin-registry-contributions-BDlJJbko.mjs";
import { c as normalizeChannelMeta } from "./bundled-CEh6W_x7.mjs";
import "./plugin-registry-BKRXR0Si.mjs";
import { t as applyPluginAutoEnable } from "./plugin-auto-enable-DYmyl_xH.mjs";
import { n as listSetupDiscoveryChannelPluginCatalogEntries, r as listTrustedChannelPluginCatalogEntries } from "./trusted-catalog-DzZMrVDM.mjs";
import { t as isStaticallyChannelConfigured } from "./channel-configured-shared-DgIr6XF-.mjs";
//#region src/commands/channel-setup/discovery.ts
/** Return true when channel metadata should appear in setup/onboarding choices. */
function shouldShowChannelInSetup(meta) {
	return isChannelVisibleInSetup(meta);
}
function resolveWorkspaceDir(cfg, workspaceDir) {
	return workspaceDir ?? resolveAgentWorkspaceDir(cfg, resolveDefaultAgentId(cfg));
}
/** List channel ids contributed by currently installed manifest-backed plugins. */
function listManifestInstalledChannelIds(params) {
	const resolvedConfig = applyPluginAutoEnable({
		config: params.cfg,
		env: params.env ?? process.env
	}).config;
	const workspaceDir = resolveWorkspaceDir(resolvedConfig, params.workspaceDir);
	return new Set(listPluginContributionIds({
		contribution: "channels",
		config: resolvedConfig,
		workspaceDir,
		env: params.env ?? process.env,
		...params.index ? { index: params.index } : {}
	}));
}
/** Return true when a trusted catalog channel is already installed through plugin manifests. */
function isCatalogChannelInstalled(params) {
	return listManifestInstalledChannelIds(params).has(params.entry.id);
}
/** Merge configured channels and installable catalog channels into setup display buckets. */
function resolveChannelSetupEntries(params) {
	const workspaceDir = resolveWorkspaceDir(params.cfg, params.workspaceDir);
	const manifestInstalledIds = listManifestInstalledChannelIds({
		cfg: params.cfg,
		workspaceDir,
		env: params.env
	});
	const installedPluginIds = new Set(params.installedPlugins.map((plugin) => plugin.id));
	const installedCatalogEntriesSource = listTrustedChannelPluginCatalogEntries({
		cfg: params.cfg,
		workspaceDir,
		env: params.env
	});
	const installableCatalogEntriesSource = listSetupDiscoveryChannelPluginCatalogEntries({
		cfg: params.cfg,
		workspaceDir,
		env: params.env
	});
	const catalogEntries = (entries, installed) => entries.filter((entry) => !installedPluginIds.has(entry.id) && manifestInstalledIds.has(entry.id) === installed && (installed || !isStaticallyChannelConfigured(params.cfg, entry.id, params.env ?? process.env)) && shouldShowChannelInSetup(entry.meta)).map((entry) => Object.assign({}, entry, { meta: normalizeChannelMeta({
		id: entry.id,
		meta: entry.meta
	}) }));
	const installedCatalogEntries = catalogEntries(installedCatalogEntriesSource, true);
	const installableCatalogEntries = catalogEntries(installableCatalogEntriesSource, false);
	const metaById = new Map(listChatChannels().map((meta) => [meta.id, normalizeChannelMeta({
		id: meta.id,
		meta
	})]));
	for (const plugin of params.installedPlugins) metaById.set(plugin.id, normalizeChannelMeta({
		id: plugin.id,
		meta: plugin.meta,
		existing: metaById.get(plugin.id)
	}));
	for (const entry of [...installedCatalogEntries, ...installableCatalogEntries]) if (!metaById.has(entry.id)) metaById.set(entry.id, entry.meta);
	return {
		entries: Array.from(metaById, ([id, meta]) => ({
			id,
			meta
		})).filter((entry) => shouldShowChannelInSetup(entry.meta)),
		installedCatalogEntries,
		installableCatalogEntries,
		installedCatalogById: new Map(installedCatalogEntries.map((entry) => [entry.id, entry])),
		installableCatalogById: new Map(installableCatalogEntries.map((entry) => [entry.id, entry]))
	};
}
//#endregion
export { shouldShowChannelInSetup as i, listManifestInstalledChannelIds as n, resolveChannelSetupEntries as r, isCatalogChannelInstalled as t };
