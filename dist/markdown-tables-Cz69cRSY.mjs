import "./session-key-CBvmC8zz.mjs";
import { n as normalizeAccountId } from "./account-id-B1bfbA5J.mjs";
import { c as getActivePluginChannelRegistryVersion } from "./runtime-B2zZQffc.mjs";
import { r as resolveChannelAccountEntry } from "./account-lookup-CVHGcV8B.mjs";
import { i as normalizeChannelId, r as listChannelPlugins } from "./registry-D3wOWFDo.mjs";
import "./plugins-BEpDh--e.mjs";
//#region src/config/markdown-tables.ts
function buildDefaultTableModes() {
	return new Map(listChannelPlugins().flatMap((plugin) => {
		const defaultMarkdownTableMode = plugin.messaging?.defaultMarkdownTableMode;
		return defaultMarkdownTableMode ? [[plugin.id, defaultMarkdownTableMode]] : [];
	}).toSorted(([left], [right]) => left.localeCompare(right)));
}
let cachedDefaultTableModes = null;
let cachedDefaultTableModesRegistryVersion = null;
function getDefaultTableModes() {
	const registryVersion = getActivePluginChannelRegistryVersion();
	if (!cachedDefaultTableModes || cachedDefaultTableModesRegistryVersion !== registryVersion) {
		cachedDefaultTableModes = buildDefaultTableModes();
		cachedDefaultTableModesRegistryVersion = registryVersion;
	}
	return cachedDefaultTableModes;
}
const isMarkdownTableMode = (value) => value === "off" || value === "bullets" || value === "code" || value === "block";
function resolveMarkdownModeFromSection(section, channel, accountId) {
	if (!section) return;
	const normalizedAccountId = normalizeAccountId(accountId);
	const accounts = section.accounts;
	if (accounts && typeof accounts === "object") {
		const matchMode = resolveChannelAccountEntry(accounts, normalizedAccountId, channel)?.markdown?.tables;
		if (isMarkdownTableMode(matchMode)) return matchMode;
	}
	const sectionMode = section.markdown?.tables;
	return isMarkdownTableMode(sectionMode) ? sectionMode : void 0;
}
function resolveMarkdownTableMode(params) {
	const channel = normalizeChannelId(params.channel);
	const defaultMode = channel ? getDefaultTableModes().get(channel) ?? "code" : "code";
	let resolved = defaultMode;
	if (channel && params.cfg) {
		const channelsConfig = params.cfg.channels;
		const rootConfig = params.cfg;
		resolved = resolveMarkdownModeFromSection(channelsConfig?.[channel] ?? rootConfig[channel], channel, params.accountId) ?? defaultMode;
	}
	return resolved === "block" && !params.supportsBlockTables ? "code" : resolved;
}
//#endregion
export { resolveMarkdownTableMode as t };
