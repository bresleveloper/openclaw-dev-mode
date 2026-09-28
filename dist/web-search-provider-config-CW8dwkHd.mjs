import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as isLegacyWebSearchProviderConfigKey } from "./web-search-legacy-provider-keys-pn4zHmNy.mjs";
//#region src/config/plugin-web-search-config.ts
/** Resolve a plugin-owned `config.webSearch` object without interpreting provider fields. */
function resolvePluginWebSearchConfig(config, pluginId) {
	const pluginConfig = config?.plugins?.entries?.[pluginId]?.config;
	if (!isRecord(pluginConfig)) return;
	return isRecord(pluginConfig.webSearch) ? pluginConfig.webSearch : void 0;
}
//#endregion
//#region src/agents/tools/web-search-provider-config.ts
/**
* Provider-scoped web-search config helpers.
*
* Projects plugin-owned provider configuration into the tool-local search shape.
*/
/** Reads the legacy top-level web search credential value. */
function getTopLevelCredentialValue(searchConfig) {
	return searchConfig?.apiKey;
}
/** Writes the legacy top-level web search credential value. */
function setTopLevelCredentialValue(searchConfigTarget, value) {
	searchConfigTarget.apiKey = value;
}
/** Reads a provider-scoped credential value from a web search config object. */
function getScopedCredentialValue(searchConfig, key) {
	const scoped = searchConfig?.[key];
	if (!scoped || typeof scoped !== "object" || Array.isArray(scoped)) return;
	return scoped.apiKey;
}
/** Writes a provider-scoped credential value, creating the scoped object when needed. */
function setScopedCredentialValue(searchConfigTarget, key, value) {
	const scoped = searchConfigTarget[key];
	if (!scoped || typeof scoped !== "object" || Array.isArray(scoped)) {
		searchConfigTarget[key] = { apiKey: value };
		return;
	}
	scoped.apiKey = value;
}
/** Projects plugin web-search config into the provider-scoped tool-local shape. */
function mergeScopedSearchConfig(searchConfig, key, pluginConfig, options) {
	const next = { ...searchConfig };
	delete next.apiKey;
	if (isLegacyWebSearchProviderConfigKey(key)) delete next[key];
	if (!pluginConfig) return Object.keys(next).length > 0 ? next : void 0;
	Object.defineProperty(next, key, {
		value: { ...pluginConfig },
		enumerable: false,
		configurable: true,
		writable: true
	});
	if (options?.mirrorApiKeyToTopLevel && pluginConfig.apiKey !== void 0) next.apiKey = pluginConfig.apiKey;
	return next;
}
/** Resolves plugin-owned web-search config for a provider plugin id. */
function resolveProviderWebSearchPluginConfig(config, pluginId) {
	return resolvePluginWebSearchConfig(config, pluginId);
}
function ensureObject(target, key) {
	const current = target[key];
	if (current && typeof current === "object" && !Array.isArray(current)) return current;
	const next = {};
	target[key] = next;
	return next;
}
/** Writes a single plugin-owned web-search config value and enables the plugin entry if needed. */
function setProviderWebSearchPluginConfigValue(configTarget, pluginId, key, value) {
	const entry = ensureObject(ensureObject(ensureObject(configTarget, "plugins"), "entries"), pluginId);
	if (entry.enabled === void 0) entry.enabled = true;
	const webSearch = ensureObject(ensureObject(entry, "config"), "webSearch");
	webSearch[key] = value;
}
//#endregion
export { setProviderWebSearchPluginConfigValue as a, resolveProviderWebSearchPluginConfig as i, getTopLevelCredentialValue as n, setScopedCredentialValue as o, mergeScopedSearchConfig as r, setTopLevelCredentialValue as s, getScopedCredentialValue as t };
