import { t as mergeDeep } from "./deep-merge-CthyICF6.mjs";
import { t as normalizePluginConfigList } from "./config-normalization-shared-B7M6gfm-.mjs";
import { i as normalizeChatChannelId } from "./ids-NACrHrny.mjs";
import { s as normalizePluginId } from "./config-state-BEAL5gWH.mjs";
//#region src/plugins/toggle-config.ts
/** Returns config with a plugin enabled/disabled and optional built-in channel state synced. */
function setPluginEnabledInConfig(config, pluginId, enabled, options = {}) {
	const builtInChannelId = normalizeChatChannelId(pluginId);
	const resolvedId = normalizePluginId(builtInChannelId ?? pluginId);
	const rawEntries = Object.entries(config.plugins?.entries ?? {});
	let existingEntry = {};
	const existingEntries = rawEntries.filter(([entryId]) => normalizePluginId(entryId) === resolvedId).toSorted(([leftId], [rightId]) => {
		if (leftId === resolvedId) return rightId === resolvedId ? 0 : 1;
		if (rightId === resolvedId) return -1;
		return leftId.localeCompare(rightId, "en");
	});
	for (const [, entry] of existingEntries) existingEntry = mergeDeep(existingEntry, entry);
	const next = {
		...config,
		plugins: {
			...config.plugins,
			...Array.isArray(config.plugins?.allow) ? { allow: normalizePluginConfigList(config.plugins.allow, normalizePluginId) } : {},
			...Array.isArray(config.plugins?.deny) ? { deny: normalizePluginConfigList(config.plugins.deny, normalizePluginId) } : {},
			entries: {
				...Object.fromEntries(rawEntries.filter(([entryId]) => normalizePluginId(entryId) !== resolvedId)),
				[resolvedId]: {
					...existingEntry,
					enabled
				}
			}
		}
	};
	if (!builtInChannelId || options.updateChannelConfig === false) return next;
	const existing = config.channels?.[builtInChannelId];
	const existingRecord = existing && typeof existing === "object" && !Array.isArray(existing) ? existing : {};
	return {
		...next,
		channels: {
			...config.channels,
			[builtInChannelId]: {
				...existingRecord,
				enabled
			}
		}
	};
}
//#endregion
export { setPluginEnabledInConfig as t };
