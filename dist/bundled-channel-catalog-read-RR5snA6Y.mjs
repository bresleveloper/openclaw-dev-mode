import { o as getPluginCache } from "./plugin-cache-A1nT2dqa.mjs";
import { r as resolveOpenClawPackageRootSync } from "./openclaw-root-Cur9Uhkp.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { d as readPluginCacheDirectory, p as readPluginCacheJsonFile } from "./package-manifest-C8sTeZKW.mjs";
import { s as resolveBundledPluginsDir } from "./bundled-dir-BGJkK8G5.mjs";
import { t as BUNDLED_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_ENTRIES } from "./official-external-plugin-bundled-catalogs-COfUtw4c.mjs";
import path from "node:path";
//#region src/channels/bundled-channel-catalog-read.ts
/**
* Bundled channel catalog reader.
*
* Loads channel metadata from generated package catalogs and bundled plugin package manifests.
*/
const OFFICIAL_CHANNEL_CATALOG_RELATIVE_PATH = path.join("dist", "channel-catalog.json");
function listPackageRoots() {
	return uniqueStrings([resolveOpenClawPackageRootSync({ cwd: process.cwd() }), resolveOpenClawPackageRootSync({ moduleUrl: import.meta.url })].filter((entry) => Boolean(entry)));
}
function readBundledExtensionCatalogEntriesSync(pluginsDir) {
	if (!pluginsDir) return [];
	try {
		return readPluginCacheDirectory(pluginsDir).filter((entry) => entry.isDirectory()).flatMap((entry) => {
			const packageJsonPath = path.join(pluginsDir, entry.name, "package.json");
			const parsed = readPluginCacheJsonFile(packageJsonPath);
			return parsed.ok && isRecord(parsed.value) ? [parsed.value] : [];
		});
	} catch {
		return [];
	}
}
function readOfficialCatalogFileSync() {
	const bundledExternalEntries = BUNDLED_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_ENTRIES.filter((entry) => typeof entry === "object" && entry !== null);
	for (const packageRoot of listPackageRoots()) {
		const candidate = path.join(packageRoot, OFFICIAL_CHANNEL_CATALOG_RELATIVE_PATH);
		const payload = readPluginCacheJsonFile(candidate);
		if (payload.ok && isRecord(payload.value)) {
			const entries = Array.isArray(payload.value.entries) ? payload.value.entries.filter((entry) => isRecord(entry)) : [];
			return [...bundledExternalEntries, ...entries];
		}
	}
	return bundledExternalEntries;
}
function isChannelCatalogEntryLike(entry) {
	return "openclaw" in entry;
}
function toBundledChannelEntry(entry) {
	const channel = isChannelCatalogEntryLike(entry) ? entry.openclaw?.channel : entry;
	const id = normalizeOptionalLowercaseString(channel?.id);
	if (!id || !channel) return null;
	return {
		id,
		channel,
		aliases: Array.isArray(channel.aliases) ? channel.aliases.map((alias) => normalizeOptionalLowercaseString(alias)).filter((alias) => Boolean(alias)) : [],
		order: typeof channel.order === "number" && Number.isFinite(channel.order) ? channel.order : Number.MAX_SAFE_INTEGER
	};
}
/**
* Lists bundled channel catalog entries from package manifests and generated catalog files.
*/
function listBundledChannelCatalogEntries() {
	const pluginsDir = resolveBundledPluginsDir();
	const catalogs = getPluginCache().metadata.bundledChannelCatalogs;
	const key = JSON.stringify([process.cwd(), pluginsDir]);
	const cached = catalogs.get(key);
	if (cached) return cached;
	const entries = /* @__PURE__ */ new Map();
	for (const entry of readBundledExtensionCatalogEntriesSync(pluginsDir)) {
		const channelEntry = toBundledChannelEntry(entry);
		if (channelEntry) entries.set(channelEntry.id, channelEntry);
	}
	for (const entry of readOfficialCatalogFileSync()) {
		const channelEntry = toBundledChannelEntry(entry);
		if (channelEntry) entries.set(channelEntry.id, entries.get(channelEntry.id) ?? channelEntry);
	}
	const catalog = Array.from(entries.values()).toSorted((left, right) => left.order - right.order || left.id.localeCompare(right.id));
	catalogs.set(key, catalog);
	return catalog;
}
/** Finds bundled or generated channel metadata by id or alias. */
function findBundledChannelCatalogMetadata(channelId) {
	const normalized = normalizeOptionalLowercaseString(channelId);
	if (!normalized) return;
	return listBundledChannelCatalogEntries().find((entry) => entry.id === normalized || entry.aliases.includes(normalized))?.channel;
}
//#endregion
export { listBundledChannelCatalogEntries as n, findBundledChannelCatalogMetadata as t };
