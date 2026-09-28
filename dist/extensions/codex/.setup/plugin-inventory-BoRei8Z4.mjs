import { f as resolveCodexPluginsPolicy } from "./config-parsing-CcB9iPoq.mjs";
import { c as findCodexAppById } from "./plugin-app-cache-key-B2CsSdnV.mjs";
import "./config-BoTP_mrL.mjs";
import { embeddedAgentLog } from "openclaw/plugin-sdk/agent-harness-runtime";
//#region extensions/codex/src/app-server/config-contracts.ts
const CODEX_PLUGINS_MARKETPLACE_NAME = "openai-curated";
const CODEX_PLUGINS_WORKSPACE_MARKETPLACE_NAME = "workspace-directory";
//#endregion
//#region extensions/codex/src/app-server/plugin-inventory.ts
/**
* Reads Codex plugin marketplace state and app inventory to decide which
* plugin-owned apps can be exposed to a native Codex thread.
*/
const CODEX_PLUGINS_REMOTE_MARKETPLACE_NAME = `${CODEX_PLUGINS_MARKETPLACE_NAME}-remote`;
const CODEX_PLUGINS_API_MARKETPLACE_NAME = "openai-api-curated";
/** Reads configured Codex plugin state and maps owned apps to readiness diagnostics. */
async function readCodexPluginInventory(params) {
	const policy = params.policy ?? resolveCodexPluginsPolicy(params.pluginConfig);
	if (!policy.enabled) return {
		policy,
		records: [],
		diagnostics: [{
			code: "disabled",
			message: "Native Codex plugin support is disabled."
		}]
	};
	const appInventory = readCachedAppInventory(params);
	const installedPlugins = await readInstalledCodexPluginMetadata({
		...params,
		policy
	});
	const pluginCatalogs = /* @__PURE__ */ new Map();
	const diagnostics = [];
	const records = [];
	if (appInventory?.state === "missing") diagnostics.push({
		code: "app_inventory_missing",
		message: "Cached Codex app inventory is missing; plugin apps are excluded for this setup."
	});
	else if (appInventory?.state === "stale") diagnostics.push({
		code: "app_inventory_stale",
		message: "Cached Codex app inventory is stale; using stale app readiness and refreshing."
	});
	for (const pluginPolicy of policy.pluginPolicies) {
		if (!pluginPolicy.enabled && !policy.allowAllPlugins) continue;
		let listed = installedPlugins;
		let resolvedPlugin = findConfiguredMarketplacePlugin(listed, pluginPolicy);
		if (!resolvedPlugin && pluginPolicy.enabled && pluginPolicy.marketplaceName !== "workspace-directory") {
			const requestParams = buildPluginCatalogRequestParams(params, pluginPolicy.marketplaceName);
			const catalogKey = JSON.stringify([requestParams, pluginMetadataCatalogScope(pluginPolicy.marketplaceName)]);
			let catalog = pluginCatalogs.get(catalogKey);
			if (!catalog) {
				catalog = listCodexPluginMetadata(params, pluginPolicy.marketplaceName);
				pluginCatalogs.set(catalogKey, catalog);
			}
			listed = await catalog;
			resolvedPlugin = findConfiguredMarketplacePlugin(listed, pluginPolicy);
		}
		if (!listed.marketplaces.some((marketplace) => marketplaceMatchesConfiguredName(marketplace, pluginPolicy.marketplaceName))) {
			diagnostics.push({
				code: "marketplace_missing",
				plugin: pluginPolicy,
				message: `Codex marketplace ${pluginPolicy.marketplaceName} was not found.`
			});
			continue;
		}
		if (!resolvedPlugin) {
			diagnostics.push({
				code: "plugin_missing",
				plugin: pluginPolicy,
				message: `${pluginPolicy.pluginName} was not found in ${pluginPolicy.marketplaceName}.`
			});
			continue;
		}
		const { summary } = resolvedPlugin;
		const unavailableByMarketplacePolicy = summary.availability === "DISABLED_BY_ADMIN" || summary.installPolicy === "NOT_AVAILABLE";
		if (unavailableByMarketplacePolicy) {
			diagnostics.push({
				code: "plugin_disabled",
				plugin: pluginPolicy,
				message: `${pluginPolicy.pluginName} is unavailable in ${pluginPolicy.marketplaceName}.`
			});
			if (!summary.installed) continue;
		}
		const detail = await readPluginDetail(params, marketplaceRef(resolvedPlugin.marketplace, pluginPolicy.marketplaceName), pluginPolicy, summary, diagnostics);
		const ownedAppIds = detail?.apps.map((app) => app.id).filter(Boolean).toSorted() ?? [];
		const appOwnership = resolveAppOwnership({
			detail,
			appInventory,
			summary
		});
		if (appOwnership === "ambiguous") diagnostics.push({
			code: "app_ownership_ambiguous",
			plugin: pluginPolicy,
			message: `${pluginPolicy.pluginName} has only display-name app matches; apps are not exposed until ownership is stable.`
		});
		if (summary.installed && !summary.enabled) diagnostics.push({
			code: "plugin_disabled",
			plugin: pluginPolicy,
			message: `${pluginPolicy.pluginName} is installed in Codex but disabled.`
		});
		const apps = resolveOwnedApps({
			pluginPolicy,
			detail,
			appInventory
		});
		records.push({
			policy: pluginPolicy,
			summary,
			...detail ? { detail } : {},
			activationRequired: pluginPolicy.enabled && (unavailableByMarketplacePolicy || !summary.installed || !summary.enabled),
			authRequired: apps.some((app) => app.needsAuth || !app.accessible),
			appOwnership,
			ownedAppIds: Array.from(/* @__PURE__ */ new Set([...ownedAppIds, ...apps.map((app) => app.id)])).toSorted(),
			apps
		});
	}
	const missingKeys = /* @__PURE__ */ new Set();
	for (const diagnostic of diagnostics) if (diagnostic.code === "plugin_missing" || diagnostic.code === "marketplace_missing") {
		if (diagnostic.plugin) missingKeys.add(diagnostic.plugin.configKey);
		embeddedAgentLog.error(diagnostic.message, { code: diagnostic.code });
	}
	return {
		policy: {
			...policy,
			pluginPolicies: policy.pluginPolicies.filter((plugin) => !missingKeys.has(plugin.configKey))
		},
		records,
		diagnostics,
		...appInventory ? { appInventory } : {}
	};
}
/** Finds a configured plugin only in its authorized marketplace identity. */
function findCodexMarketplacePluginSummary(listed, marketplaceName, pluginName) {
	const resolved = findConfiguredMarketplacePlugin(listed, {
		marketplaceName,
		pluginName
	});
	return resolved ? {
		marketplace: marketplaceRef(resolved.marketplace, marketplaceName),
		summary: resolved.summary
	} : void 0;
}
/** Builds plugin/read or plugin/install params from a marketplace reference. */
function pluginReadParams(marketplace, pluginName) {
	return {
		...marketplace.path ? { marketplacePath: marketplace.path } : {},
		...marketplace.remoteMarketplaceName ? { remoteMarketplaceName: marketplace.remoteMarketplaceName } : {},
		pluginName
	};
}
/** Returns configured plugin keys whose current metadata may still recover. */
function resolveRecoverableCodexPluginConfigKeys(params) {
	return params.policy.pluginPolicies.filter((pluginPolicy) => pluginPolicy.enabled && !isSettledMissingPluginPolicy({
		pluginPolicy,
		metadataCache: params.metadataCache,
		appCacheKey: params.appCacheKey,
		configCwd: params.configCwd
	})).map((pluginPolicy) => pluginPolicy.configKey).toSorted();
}
async function listCodexPluginMetadata(params, marketplaceName) {
	const requestParams = buildPluginCatalogRequestParams(params, marketplaceName);
	if (!params.metadataCache || !params.appCacheKey) return await params.request("plugin/list", requestParams);
	return (await params.metadataCache.load({
		appCacheKey: params.appCacheKey,
		queryKind: "curated-global",
		requestParams,
		catalogScope: pluginMetadataCatalogScope(marketplaceName),
		request: async (method, listedParams) => await params.request(method, listedParams),
		cacheable: (response) => response.marketplaces.some((marketplace) => marketplaceMatchesConfiguredName(marketplace, marketplaceName))
	})).response;
}
async function readInstalledCodexPluginMetadata(params) {
	const requestParams = params.configCwd ? { cwds: [params.configCwd] } : {};
	if (!params.metadataCache || !params.appCacheKey) return await params.request("plugin/installed", requestParams);
	return (await params.metadataCache.load({
		appCacheKey: params.appCacheKey,
		queryKind: "installed",
		requestParams,
		request: async (method, installedParams) => await params.request(method, installedParams),
		cacheable: (response) => params.policy.pluginPolicies.every((pluginPolicy) => {
			if (!pluginPolicy.enabled && !params.policy.allowAllPlugins) return true;
			return Boolean(findConfiguredMarketplacePlugin(response, pluginPolicy));
		})
	})).response;
}
function isSettledMissingPluginPolicy(params) {
	const queryKind = params.pluginPolicy.marketplaceName === "workspace-directory" ? "installed" : "curated-global";
	const requestParams = queryKind === "installed" ? params.configCwd ? { cwds: [params.configCwd] } : {} : buildPluginCatalogRequestParams(params, params.pluginPolicy.marketplaceName);
	const listed = params.metadataCache.read(params.appCacheKey, queryKind, requestParams, queryKind === "curated-global" ? pluginMetadataCatalogScope(params.pluginPolicy.marketplaceName) : void 0)?.response;
	if (!listed) return false;
	return !findConfiguredMarketplacePlugin(listed, params.pluginPolicy);
}
function pluginMetadataCatalogScope(marketplaceName) {
	return isOpenAiCuratedMarketplaceName(marketplaceName) ? void 0 : marketplaceName;
}
function buildPluginCatalogRequestParams(params, marketplaceName) {
	const marketplaceKinds = marketplaceName === "created-by-me-remote" ? ["created-by-me-remote"] : marketplaceName.startsWith("workspace-shared-with-me") ? ["shared-with-me"] : void 0;
	return {
		...params.configCwd ? { cwds: [params.configCwd] } : {},
		...marketplaceKinds ? { marketplaceKinds: [...marketplaceKinds] } : {}
	};
}
function readCachedAppInventory(params) {
	if (!params.appCache || !params.appCacheKey) return;
	const request = async (method, requestParams) => await params.request(method, requestParams);
	return params.appCache.read({
		key: params.appInventoryCacheKey ?? params.appCacheKey,
		request,
		nowMs: params.nowMs,
		suppressRefresh: params.suppressAppInventoryRefresh
	});
}
async function readPluginDetail(params, marketplace, pluginPolicy, summary, diagnostics) {
	if (params.readPluginDetails === false) return;
	if (marketplace.remoteMarketplaceName && !summary.remotePluginId) {
		diagnostics.push({
			code: "plugin_detail_unavailable",
			plugin: pluginPolicy,
			message: `${pluginPolicy.pluginName} detail unavailable: Codex did not return a remote plugin id.`
		});
		return;
	}
	try {
		return (await params.request("plugin/read", pluginReadParams(marketplace, marketplace.remoteMarketplaceName && summary.remotePluginId ? summary.remotePluginId : pluginPolicy.pluginName))).plugin;
	} catch (error) {
		diagnostics.push({
			code: "plugin_detail_unavailable",
			plugin: pluginPolicy,
			message: `${pluginPolicy.pluginName} detail unavailable: ${error instanceof Error ? error.message : String(error)}`
		});
		return;
	}
}
function resolveAppOwnership(params) {
	if (params.detail && params.detail.apps.length > 0) return "proven";
	return (params.appInventory?.snapshot?.apps ?? []).filter((app) => app.pluginDisplayNames.some((displayName) => displayName === params.summary.name)).length > 0 ? "ambiguous" : "none";
}
function resolveOwnedApps(params) {
	const detailApps = params.detail?.apps ?? [];
	if (detailApps.length === 0) return [];
	if (params.appInventory?.state === "missing") {
		embeddedAgentLog.warn("codex plugin inventory missing app inventory for detail apps", {
			configKey: params.pluginPolicy.configKey,
			pluginName: params.pluginPolicy.pluginName,
			appIds: detailApps.map((app) => app.id).toSorted()
		});
		return [];
	}
	const appInfos = params.appInventory?.snapshot?.apps ?? [];
	const installedApps = params.appInventory?.snapshot?.installedApps ?? [];
	return detailApps.map((app) => {
		const info = findCodexAppById(appInfos, app.id);
		if (!info) return {
			id: app.id,
			name: app.name,
			accessible: false,
			enabled: false,
			needsAuth: true
		};
		return Object.assign({
			id: info.id,
			name: app.name,
			accessible: true,
			enabled: findCodexAppById(installedApps, info.id)?.enabled ?? false,
			needsAuth: false
		}, resolveOwnedAppApprovalOverrideKeys(info));
	}).toSorted((left, right) => left.id.localeCompare(right.id));
}
/** Returns current tool keys whose overrides could bypass the requested reviewer. */
function resolveOwnedAppApprovalOverrideKeys(app) {
	if (!app.toolSummaries) return {};
	const appName = app.name.trim();
	const appNameLower = appName.toLowerCase();
	const keys = app.toolSummaries.filter((tool) => !tool.isReadOnly).flatMap((tool) => resolveAppToolConfigKeys({
		appName,
		appNameLower,
		tool
	}));
	return { approvalOverrideToolConfigKeys: Array.from(new Set(keys)).toSorted() };
}
function resolveAppToolConfigKeys(params) {
	const keys = [params.tool.name];
	if (params.tool.title) keys.push(params.tool.title);
	if (params.appName) keys.push(`${params.appName}_${params.tool.name}`);
	if (params.appNameLower && params.appNameLower !== params.appName) keys.push(`${params.appNameLower}_${params.tool.name}`);
	return keys;
}
function findPluginSummary(marketplace, pluginName) {
	const exact = marketplace.plugins.find((plugin) => plugin.id === pluginName || plugin.id === `${pluginName}@${marketplace.name}`);
	if (exact) return exact;
	const matches = marketplace.plugins.filter((plugin) => plugin.name === pluginName || pluginNameFromPluginId(plugin.id, marketplace.name) === pluginName);
	return matches.length === 1 ? matches[0] : void 0;
}
function findConfiguredMarketplacePlugin(listed, plugin) {
	if (plugin.marketplaceName === "workspace-directory") return findWorkspaceMarketplacePlugin(listed, plugin.pluginName);
	for (const marketplace of listed.marketplaces) {
		if (!marketplaceMatchesConfiguredName(marketplace, plugin.marketplaceName)) continue;
		const summary = findPluginSummary(marketplace, plugin.pluginName);
		if (summary) return {
			marketplace,
			summary
		};
	}
}
function marketplaceMatchesConfiguredName(marketplace, configuredMarketplaceName) {
	return isOpenAiCuratedMarketplaceName(configuredMarketplaceName) ? isOpenAiCuratedMarketplace(marketplace) : marketplace.name === configuredMarketplaceName;
}
function findWorkspaceMarketplacePlugin(listed, pluginName) {
	const marketplace = listed.marketplaces.find((entry) => entry.name === CODEX_PLUGINS_WORKSPACE_MARKETPLACE_NAME);
	const summary = marketplace?.plugins.find((plugin) => plugin.id === pluginName);
	return marketplace && summary ? {
		marketplace,
		summary
	} : void 0;
}
function pluginNameFromPluginId(pluginId, marketplaceName) {
	const trimmed = pluginId.trim();
	if (!trimmed) return;
	const marketplaceSuffix = `@${marketplaceName}`;
	return (trimmed.endsWith(marketplaceSuffix) ? trimmed.slice(0, -marketplaceSuffix.length) : trimmed).split("/").at(-1)?.trim() || void 0;
}
function marketplaceRef(marketplace, name) {
	return {
		name,
		...marketplace.path ? { path: marketplace.path } : {},
		...!marketplace.path ? { remoteMarketplaceName: marketplace.name } : {}
	};
}
/** True for any supported OpenAI curated marketplace wire name, matching Codex's own curated predicate. */
function isOpenAiCuratedMarketplace(marketplace) {
	return isOpenAiCuratedMarketplaceName(marketplace.name);
}
/** True for all Codex wire aliases of the same OpenAI-curated catalog. */
function isOpenAiCuratedMarketplaceName(marketplaceName) {
	return marketplaceName === "openai-curated" || marketplaceName === CODEX_PLUGINS_REMOTE_MARKETPLACE_NAME || marketplaceName === CODEX_PLUGINS_API_MARKETPLACE_NAME;
}
//#endregion
export { readCodexPluginInventory as a, CODEX_PLUGINS_MARKETPLACE_NAME as c, pluginReadParams as i, CODEX_PLUGINS_WORKSPACE_MARKETPLACE_NAME as l, isOpenAiCuratedMarketplace as n, resolveOwnedAppApprovalOverrideKeys as o, isOpenAiCuratedMarketplaceName as r, resolveRecoverableCodexPluginConfigKeys as s, findCodexMarketplacePluginSummary as t };
