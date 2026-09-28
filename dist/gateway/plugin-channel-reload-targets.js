import { l as normalizeOptionalString } from "../string-coerce-CIXf7egm.mjs";
//#region src/gateway/plugin-channel-reload-targets.ts
function addNormalizedTarget(targets, value) {
	const normalized = normalizeOptionalString(value);
	if (normalized) targets.add(normalized);
}
/** Lists all config ids that should trigger reload for a channel plugin target. */
function listChannelPluginConfigTargetIds(target) {
	const targets = /* @__PURE__ */ new Set();
	addNormalizedTarget(targets, target.channelId);
	addNormalizedTarget(targets, target.pluginId);
	for (const alias of target.aliases ?? []) addNormalizedTarget(targets, alias);
	return targets;
}
/** Returns true when changed config paths affect any target plugin/channel id. */
function pluginConfigTargetsChanged(targetIds, changedPaths) {
	const prefixes = Array.from(targetIds, (id) => [`plugins.entries.${id}`, `plugins.installs.${id}`]).flat();
	return changedPaths.some((path) => prefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}.`)));
}
//#endregion
export { listChannelPluginConfigTargetIds, pluginConfigTargetsChanged };
