import { f as resolveCodexPluginsPolicy } from "./config-parsing-BQq-CHTF.mjs";
import { c as findCodexAppById } from "./plugin-app-cache-key-BW8rd98k.mjs";
import "./config-0Gxk3_eq.mjs";
import { embeddedAgentLog } from "openclaw/plugin-sdk/agent-harness-runtime";
//#region extensions/codex/src/app-server/config-contracts.ts
const CODEX_PLUGINS_MARKETPLACE_NAME = "openai-curated";
const CODEX_PLUGINS_WORKSPACE_MARKETPLACE_NAME = "workspace-directory";
//#endregion
//#region extensions/codex/src/app-server/plugin-inventory.ts
const CODEX_PLUGINS_REMOTE_MARKETPLACE_NAME = `${CODEX_PLUGINS_MARKETPLACE_NAME}-remote`;
const CODEX_PLUGINS_API_MARKETPLACE_NAME = "openai-api-curated";
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
			const catalogKey = pluginMetadataCatalogScope(pluginPolicy.marketplaceName);
			let catalog = pluginCatalogs.get(catalogKey);
			if (!catalog) {
				catalog = await listCodexPluginMetadata(params, pluginPolicy.marketplaceName);
				pluginCatalogs.set(catalogKey, catalog);
			}
			listed = catalog;
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
		const ownedAppIds = detail?.apps.map((app) => app.id).filter(Boolean) ?? [];
		const appOwnership = detail?.apps.length ? "proven" : appInventory?.snapshot?.apps.some((app) => app.pluginDisplayNames.includes(summary.name)) ? "ambiguous" : "none";
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
function resolveRecoverableCodexPluginConfigKeys(params) {
	return params.policy.pluginPolicies.filter((pluginPolicy) => pluginPolicy.enabled && !isSettledMissingPluginPolicy({
		...params,
		pluginPolicy
	})).map((pluginPolicy) => pluginPolicy.configKey).toSorted();
}
async function listCodexPluginMetadata(params, marketplaceName, options = {}) {
	const requestParams = {
		...buildPluginCatalogRequestParams(params, marketplaceName),
		...options.forceRefetch ? { forceRefetch: true } : {}
	};
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
		return Object.assign(toCodexPluginOwnedAccountApp(info, findCodexAppById(installedApps, info.id)), { name: app.name });
	}).toSorted((left, right) => left.id.localeCompare(right.id));
}
function toCodexPluginOwnedAccountApp(app, installedApp) {
	return {
		id: app.id,
		name: app.name,
		accessible: true,
		enabled: installedApp?.enabled ?? false,
		needsAuth: false,
		...resolveOwnedAppApprovalOverrideKeys(app)
	};
}
/** Returns current tool keys whose overrides could bypass the requested reviewer. */
function resolveOwnedAppApprovalOverrideKeys(app) {
	if (!app.toolSummaries) return {};
	const appName = app.name.trim();
	const prefixes = [.../* @__PURE__ */ new Set([appName, appName.toLowerCase()])].filter(Boolean);
	const keys = /* @__PURE__ */ new Set();
	for (const tool of app.toolSummaries) {
		if (tool.isReadOnly) continue;
		keys.add(tool.name);
		if (tool.title) keys.add(tool.title);
		for (const prefix of prefixes) keys.add(`${prefix}_${tool.name}`);
	}
	return { approvalOverrideToolConfigKeys: Array.from(keys).toSorted() };
}
function findPluginSummary(marketplace, pluginName) {
	const exact = marketplace.plugins.find((plugin) => plugin.id === pluginName || plugin.id === `${pluginName}@${marketplace.name}`);
	if (exact) return exact;
	const matches = marketplace.plugins.filter((plugin) => plugin.name === pluginName || pluginNameFromPluginId(plugin.id, marketplace.name) === pluginName);
	return matches.length === 1 ? matches[0] : void 0;
}
function findConfiguredMarketplacePlugin(listed, plugin) {
	if (plugin.marketplaceName === "workspace-directory") {
		const marketplace = listed.marketplaces.find((entry) => entry.name === CODEX_PLUGINS_WORKSPACE_MARKETPLACE_NAME);
		const summary = marketplace?.plugins.find((entry) => entry.id === plugin.pluginName);
		return marketplace && summary ? {
			marketplace,
			summary
		} : void 0;
	}
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
	return isOpenAiCuratedMarketplaceName(configuredMarketplaceName) ? isOpenAiCuratedMarketplaceName(marketplace.name) : marketplace.name === configuredMarketplaceName;
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
function isOpenAiCuratedMarketplaceName(marketplaceName) {
	return marketplaceName === "openai-curated" || marketplaceName === CODEX_PLUGINS_REMOTE_MARKETPLACE_NAME || marketplaceName === CODEX_PLUGINS_API_MARKETPLACE_NAME;
}
//#endregion
export { pluginReadParams as a, toCodexPluginOwnedAccountApp as c, marketplaceRef as i, CODEX_PLUGINS_MARKETPLACE_NAME as l, isOpenAiCuratedMarketplaceName as n, readCodexPluginInventory as o, listCodexPluginMetadata as r, resolveRecoverableCodexPluginConfigKeys as s, findCodexMarketplacePluginSummary as t, CODEX_PLUGINS_WORKSPACE_MARKETPLACE_NAME as u };
