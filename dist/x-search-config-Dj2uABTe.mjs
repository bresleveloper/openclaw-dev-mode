import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
//#region extensions/xai/src/x-search-config.ts
function resolvePluginSearchConfig(config, key) {
	const pluginConfig = config?.plugins?.entries?.xai?.config;
	return isRecord(pluginConfig?.[key]) ? { ...pluginConfig[key] } : void 0;
}
function baseUrlFallback(config) {
	return typeof config?.baseUrl === "string" && config.baseUrl.trim() ? { baseUrl: config.baseUrl } : void 0;
}
function resolveEffectiveXSearchConfig(config) {
	const pluginWebSearchBaseUrl = baseUrlFallback(resolvePluginSearchConfig(config, "webSearch"));
	const pluginOwned = resolvePluginSearchConfig(config, "xSearch");
	const merged = {
		...pluginWebSearchBaseUrl,
		...pluginOwned
	};
	if (Object.keys(merged).length === 0) return;
	return merged;
}
function setPluginXSearchConfigValue(configTarget, key, value) {
	const plugins = configTarget.plugins ??= {};
	const entries = plugins.entries ??= {};
	const entry = entries.xai ??= {};
	const config = entry.config ??= {};
	const xSearch = config.xSearch ??= {};
	xSearch[key] = value;
}
//#endregion
export { setPluginXSearchConfigValue as n, resolveEffectiveXSearchConfig as t };
