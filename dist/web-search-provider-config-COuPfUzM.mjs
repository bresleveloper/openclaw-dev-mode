import { a as asOptionalRecord, c as isRecord } from "./record-coerce-TIsquoVR.mjs";
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
function getTopLevelCredentialValue(searchConfig) {
	return searchConfig?.apiKey;
}
function setTopLevelCredentialValue(searchConfigTarget, value) {
	searchConfigTarget.apiKey = value;
}
function getScopedCredentialValue(searchConfig, key) {
	return asOptionalRecord(searchConfig?.[key])?.apiKey;
}
function setScopedCredentialValue(searchConfigTarget, key, value) {
	const scoped = asOptionalRecord(searchConfigTarget[key]);
	if (!scoped) {
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
function ensureObject(target, key) {
	const current = asOptionalRecord(target[key]);
	if (current) return current;
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
export { setScopedCredentialValue as a, setProviderWebSearchPluginConfigValue as i, getTopLevelCredentialValue as n, setTopLevelCredentialValue as o, mergeScopedSearchConfig as r, resolvePluginWebSearchConfig as s, getScopedCredentialValue as t };
