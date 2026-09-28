import { l as resolveAgentWorkspaceDir, m as resolveDefaultAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import { c as normalizeChannelMeta } from "./bundled-D8dZgG2d.mjs";
import { t as listPluginContributionIds } from "./plugin-registry-contributions-CHC0CCKR.mjs";
import "./plugin-registry-CVPVm6lt.mjs";
import { n as isStaticallyChannelConfigured } from "./channel-configured-shared-Cojxg7l6.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { r as isChannelVisibleInSetup } from "./channel-meta-BgTks57p.mjs";
import { r as listChatChannels } from "./chat-meta-CrZhPtTU.mjs";
import { t as applyPluginAutoEnable } from "./plugin-auto-enable-CaqgRIEy.mjs";
import { n as listSetupDiscoveryChannelPluginCatalogEntries, r as listTrustedChannelPluginCatalogEntries } from "./trusted-catalog-CFYwh8FA.mjs";
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
	const installedCatalogEntries = installedCatalogEntriesSource.filter((entry) => !installedPluginIds.has(entry.id) && manifestInstalledIds.has(entry.id) && shouldShowChannelInSetup(entry.meta)).map((entry) => Object.assign({}, entry, { meta: normalizeChannelMeta({
		id: entry.id,
		meta: entry.meta
	}) }));
	const installableCatalogEntries = installableCatalogEntriesSource.filter((entry) => !installedPluginIds.has(entry.id) && !manifestInstalledIds.has(entry.id) && !isStaticallyChannelConfigured(params.cfg, entry.id, params.env ?? process.env) && shouldShowChannelInSetup(entry.meta)).map((entry) => Object.assign({}, entry, { meta: normalizeChannelMeta({
		id: entry.id,
		meta: entry.meta
	}) }));
	const metaById = /* @__PURE__ */ new Map();
	for (const meta of listChatChannels()) metaById.set(meta.id, normalizeChannelMeta({
		id: meta.id,
		meta
	}));
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
