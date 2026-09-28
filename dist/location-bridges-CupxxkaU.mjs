import { k as buildBundledPluginLoadPathAliases } from "./discovery-D_5mAUI7.mjs";
import { p as resolveOfficialExternalPluginInstall, r as getOfficialExternalPluginCatalogEntry } from "./official-external-plugin-catalog-CzZljLFK.mjs";
import { h as resolveOfficialExternalPluginId, o as getOfficialExternalPluginCatalogManifest } from "./official-external-plugin-catalog-source-CkmJlLAW.mjs";
import { r as loadPluginManifestRegistryForInstalledIndex } from "./plugin-control-plane-context-CNov0ojO.mjs";
import { n as readPersistedInstalledPluginIndex } from "./installed-plugin-index-store-Col5DnQ-.mjs";
import path from "node:path";
//#region src/plugins/location-bridges.ts
function buildBridgeFromPersistedBundledRecord(record, manifest) {
	if (record.origin !== "bundled" || !record.enabled) return null;
	const officialEntry = getOfficialExternalPluginCatalogEntry(record.pluginId);
	const officialInstall = officialEntry ? resolveOfficialExternalPluginInstall(officialEntry) : null;
	const officialNpmSpec = officialInstall?.npmSpec?.trim();
	const npmSpec = officialNpmSpec ?? record.packageInstall?.npm?.spec;
	const expectedIntegrity = officialNpmSpec ? officialInstall?.expectedIntegrity?.trim() : void 0;
	const clawhubSpec = officialInstall?.clawhubSpec?.trim();
	if (!npmSpec && !clawhubSpec) return null;
	const officialChannelId = officialEntry ? getOfficialExternalPluginCatalogManifest(officialEntry)?.channel?.id?.trim() : void 0;
	const externalPluginId = officialEntry ? resolveOfficialExternalPluginId(officialEntry)?.trim() : void 0;
	const channelIds = manifest?.channels.length ? manifest.channels : officialChannelId ? [officialChannelId] : [];
	return {
		bundledPluginId: record.pluginId,
		pluginId: externalPluginId || record.pluginId,
		...npmSpec ? { npmSpec } : {},
		...expectedIntegrity ? { expectedIntegrity } : {},
		...clawhubSpec ? { clawhubSpec } : {},
		...record.enabledByDefault ? { enabledByDefault: true } : {},
		...channelIds.length ? { channelIds } : {}
	};
}
/** List install bridges inferred from the persisted plugin index before current discovery runs. */
async function listPersistedBundledPluginLocationBridges(options) {
	const index = await readPersistedInstalledPluginIndex(options);
	if (!index) return [];
	const manifestRegistry = loadPluginManifestRegistryForInstalledIndex({
		index,
		workspaceDir: options.workspaceDir,
		env: options.env,
		includeDisabled: true
	});
	const manifestByPluginId = new Map(manifestRegistry.plugins.map((plugin) => [plugin.id, plugin]));
	return index.plugins.flatMap((record) => {
		const bridge = buildBridgeFromPersistedBundledRecord(record, manifestByPluginId.get(record.pluginId));
		return bridge ? [bridge] : [];
	});
}
/** List exact previous bundled paths that an explicit plugin reinstall may recover. */
async function listPersistedBundledPluginRecoveryLocations(options) {
	const index = await readPersistedInstalledPluginIndex(options);
	if (!index) return [];
	return index.plugins.flatMap((record) => {
		const rootDir = record.rootDir.trim();
		if (record.origin !== "bundled" || !path.isAbsolute(rootDir)) return [];
		const loadPaths = Array.from(/* @__PURE__ */ new Set([rootDir, ...buildBundledPluginLoadPathAliases(rootDir).map((alias) => alias.path)]));
		return [{
			pluginId: record.pluginId,
			loadPaths
		}];
	});
}
//#endregion
export { listPersistedBundledPluginRecoveryLocations as n, listPersistedBundledPluginLocationBridges as t };
