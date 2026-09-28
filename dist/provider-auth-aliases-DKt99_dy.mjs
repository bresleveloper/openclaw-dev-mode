import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { l as normalizePluginsConfig } from "./config-state-BEAL5gWH.mjs";
import { i as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-BU2mC0-C.mjs";
import { o as loadPluginMetadataSnapshot } from "./plugin-metadata-snapshot-pEXzzTbU.mjs";
import { t as buildPluginMetadataProviderAuthAliases } from "./plugin-metadata-provider-facts-VzYAAmcr.mjs";
import { a as resolveMergedModelProviderConfig } from "./model-provider-config-BbSyhfVf.mjs";
//#region src/plugins/plugin-config-trust.ts
/** Applies workspace plugin allow/deny config before manifest records reach control-plane decisions. */
/** Normalizes plugin ids used in config allow/deny/entry lists. */
function normalizePluginConfigId(id) {
	return normalizeOptionalLowercaseString(id) ?? "";
}
function hasPluginConfigId(list, pluginId) {
	return Array.isArray(list) && list.some((entry) => normalizePluginConfigId(entry) === pluginId);
}
function findPluginConfigEntry(entries, pluginId) {
	if (!entries || typeof entries !== "object" || Array.isArray(entries)) return;
	for (const [key, value] of Object.entries(entries)) {
		if (normalizePluginConfigId(key) !== pluginId) continue;
		return value && typeof value === "object" && !Array.isArray(value) ? value : {};
	}
}
/** Resolves whether workspace plugin config allows one plugin manifest record. */
function isWorkspacePluginAllowedByConfig(params) {
	const pluginsConfig = params.config?.plugins;
	if (pluginsConfig?.enabled === false) return false;
	const pluginId = normalizePluginConfigId(params.plugin.id);
	if (!pluginId || hasPluginConfigId(pluginsConfig?.deny, pluginId)) return false;
	const entry = findPluginConfigEntry(pluginsConfig?.entries, pluginId);
	if (entry?.enabled === false) return false;
	if (entry?.enabled === true || hasPluginConfigId(pluginsConfig?.allow, pluginId)) return true;
	return params.isImplicitlyAllowed?.(pluginId) ?? false;
}
//#endregion
//#region src/agents/provider-auth-aliases.ts
/**
* Provider auth alias resolution.
* Maps deprecated and plugin-defined provider IDs to canonical credential
* providers, with trusted workspace plugin handling and snapshot-owned metadata.
*/
function shouldUsePluginAuthAliases(plugin, params) {
	if (plugin.origin !== "workspace" || params?.includeUntrustedWorkspacePlugins === true) return true;
	return isWorkspacePluginAllowedByConfig({
		config: params?.config,
		isImplicitlyAllowed: (pluginId) => normalizePluginConfigId(params?.config?.plugins?.slots?.contextEngine) === pluginId,
		plugin
	});
}
function resolveProviderAuthAliasCandidates(params) {
	const config = params?.config;
	const context = {
		env: params?.env ?? process.env,
		workspaceDir: params?.workspaceDir
	};
	const lookup = {
		...context,
		allowWorkspaceScopedSnapshot: true
	};
	const snapshot = params?.metadataSnapshot ?? getCurrentPluginMetadataSnapshot({
		...lookup,
		config,
		requireDefaultDiscoveryContext: !config
	}) ?? (config && normalizePluginsConfig(config.plugins).loadPaths.length === 0 ? getCurrentPluginMetadataSnapshot({
		...lookup,
		requireDefaultDiscoveryContext: true
	}) : void 0) ?? loadPluginMetadataSnapshot({
		...context,
		config: config ?? {}
	});
	return snapshot.owners?.providerAuthAliases ?? buildPluginMetadataProviderAuthAliases(snapshot.plugins);
}
function resolveProviderAuthEndpoint(provider, config) {
	return resolveMergedModelProviderConfig(config, provider)?.baseUrl?.trim().replace(/\/+$/, "");
}
function matchesProviderAuthEndpoint(provider, candidate, params) {
	if (!candidate.baseUrls) return true;
	if (params?.storedCredential) return false;
	const baseUrl = resolveProviderAuthEndpoint(provider, params?.config);
	return baseUrl !== void 0 && candidate.baseUrls.includes(baseUrl);
}
/** A migration guard cannot select a credential realm without the route's endpoint. */
function hasUnresolvedProviderAuthEndpoint(provider, params) {
	const normalized = normalizeProviderId(provider);
	if (resolveProviderAuthEndpoint(normalized, params?.config)) return false;
	return resolveProviderAuthAliasCandidates(params).get(normalized)?.some((candidate) => candidate.baseUrls !== void 0 && shouldUsePluginAuthAliases(candidate.plugin, params)) ?? false;
}
/** Limit missing-endpoint ambiguity to realms an eligible alias can actually select. */
function couldResolveProviderIdForAuth(provider, target, params) {
	if (resolveProviderIdForAuth(provider, params) === target) return true;
	const normalized = normalizeProviderId(provider);
	if (params?.storedCredential || resolveProviderAuthEndpoint(normalized, params?.config)) return false;
	for (const candidate of resolveProviderAuthAliasCandidates(params).get(normalized) ?? []) {
		if (!shouldUsePluginAuthAliases(candidate.plugin, params)) continue;
		if (candidate.target === target && (!candidate.baseUrls || candidate.baseUrls.length > 0)) return true;
		if (!candidate.baseUrls) break;
	}
	return false;
}
/** Resolve canonical auth provider aliases from plugin metadata. */
function resolveProviderAuthAliasMap(params) {
	const allowedPlugins = /* @__PURE__ */ new Map();
	const selected = [];
	for (const [alias, candidates] of resolveProviderAuthAliasCandidates(params)) {
		let preferred;
		let order = Infinity;
		for (const candidate of candidates) {
			const { plugin } = candidate;
			const allowed = allowedPlugins.get(plugin) ?? shouldUsePluginAuthAliases(plugin, params);
			allowedPlugins.set(plugin, allowed);
			if (allowed && matchesProviderAuthEndpoint(alias, candidate, params)) {
				preferred ??= candidate;
				order = Math.min(order, candidate.order);
			}
		}
		if (preferred) selected.push({
			alias,
			target: preferred.target,
			order
		});
	}
	const aliases = Object.create(null);
	for (const { alias, target } of selected.toSorted((left, right) => left.order - right.order)) aliases[alias] = target;
	return aliases;
}
/** Resolve the provider ID that should be used for credential lookup. */
function resolveProviderIdForAuth(provider, params) {
	const normalized = normalizeProviderId(provider);
	if (!normalized) return normalized;
	return resolveProviderAuthAliasCandidates(params).get(normalized)?.find((candidate) => shouldUsePluginAuthAliases(candidate.plugin, params) && matchesProviderAuthEndpoint(normalized, candidate, params))?.target ?? normalized;
}
//#endregion
export { isWorkspacePluginAllowedByConfig as a, resolveProviderIdForAuth as i, hasUnresolvedProviderAuthEndpoint as n, normalizePluginConfigId as o, resolveProviderAuthAliasMap as r, couldResolveProviderIdForAuth as t };
