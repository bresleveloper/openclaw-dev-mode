import { r as resolveGlobalMap } from "./global-singleton-DrXvEBww.mjs";
//#region src/plugins/sdk-deprecation-usage.ts
const usage = resolveGlobalMap(Symbol.for("openclaw.pluginSdkDeprecationUsage"));
function recordPluginSdkDeprecationUsage(pluginId, id, displayName, replacement, removeAfter) {
	let recorded = usage.get(pluginId);
	if (!recorded) {
		recorded = /* @__PURE__ */ new Map();
		usage.set(pluginId, recorded);
	}
	if (!recorded.has(id)) recorded.set(id, {
		id,
		displayName,
		replacement,
		...removeAfter ? { removeAfter } : {}
	});
}
function getPluginSdkDeprecationUsage(pluginId) {
	return [...usage.get(pluginId)?.values() ?? []];
}
//#endregion
export { recordPluginSdkDeprecationUsage as n, getPluginSdkDeprecationUsage as t };
