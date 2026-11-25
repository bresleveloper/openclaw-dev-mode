import { m as resolveCodexPluginsPolicy, p as readCodexPluginConfig } from "./config-parsing-BugaRTEy.mjs";
import { r as isJsonObject } from "./protocol-NX-eGZn-.mjs";
import { m as fingerprintCodexPolicy, v as CODEX_SESSION_OVERRIDABLE_LAYER_TYPES } from "./config-options-ZyoXdPOW.mjs";
import { a as defaultCodexAppInventoryCache, i as CodexAppInventoryCache, o as serializeCodexAppInventoryError, s as codexAppIdentityKey } from "./plugin-app-cache-key-C1YmeiUB.mjs";
import "./config-B-xRmWRi.mjs";
import { r as readCodexMcpToolConnectorId } from "./mcp-tool-metadata-dZb30ybZ.mjs";
import { l as toCodexPluginOwnedAccountApp, s as readCodexPluginInventory, t as createCodexAppInventoryRequest } from "./plugin-inventory-2AKJLSMB.mjs";
import { t as ensureCodexPluginActivation } from "./plugin-activation-D_4xfW78.mjs";
import { asOptionalRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { embeddedAgentLog } from "openclaw/plugin-sdk/agent-harness-runtime";
// extensions/codex/src/app-server/app-runtime-tools.ts
const CODEX_APPS_MCP_SERVER = "codex_apps";
const MCP_STATUS_PAGE_SIZE = 100;
const MCP_STATUS_MAX_PAGES = 100;
async function readCodexAppRuntimeTools(params) {
	const toolsByApp = /* @__PURE__ */ new Map();
	const seenCursors = /* @__PURE__ */ new Set();
	let cursor;
	for (let page = 0; page < MCP_STATUS_MAX_PAGES; page += 1) {
		const response = await params.request("mcpServerStatus/list", {
			...params.threadId ? { threadId: params.threadId } : {},
			serverName: CODEX_APPS_MCP_SERVER,
			detail: "toolsAndAuthOnly",
			limit: MCP_STATUS_PAGE_SIZE,
			...cursor ? { cursor } : {}
		});
		if (!isJsonObject(response) || !Array.isArray(response.data)) throw new Error("Codex mcpServerStatus/list returned invalid app tool inventory");
		for (const status of response.data) {
			if (!isJsonObject(status) || !isJsonObject(status.tools)) throw new Error("Codex app tool inventory contained an invalid server status");
			if (status.name !== CODEX_APPS_MCP_SERVER) continue;
			for (const [toolName, tool] of Object.entries(status.tools)) {
				const connectorId = readCodexMcpToolConnectorId(tool);
				if (connectorId) {
					const tools = toolsByApp.get(connectorId) ?? /* @__PURE__ */ new Map();
					const metadata = asOptionalRecord(tool);
					const appMetadata = asOptionalRecord(metadata?._meta);
					const annotations = asOptionalRecord(metadata?.annotations);
					const hosted = asOptionalRecord(appMetadata?.["_codex_apps"]);
					const resource = typeof hosted?.resource_uri === "string" ? hosted.resource_uri.split("/") : [];
					tools.set(toolName, {
						actionName: resource.length === 4 && resource[0] === "" && resource[1] === connectorId && resource[2] && hosted?.synthetic_link !== true ? resource[3] : void 0,
						readOnlyHint: annotations?.readOnlyHint === true,
						title: typeof metadata?.title === "string" ? metadata.title : void 0,
						linkId: typeof appMetadata?.link_id === "string" && appMetadata.link_id.trim() ? appMetadata.link_id : void 0,
						requiresExplicitLinkId: hosted?.requires_explicit_link_id === true,
						destructiveHint: annotations?.destructiveHint === false ? false : void 0,
						openWorldHint: annotations?.openWorldHint === false ? false : void 0
					});
					toolsByApp.set(connectorId, tools);
				}
			}
		}
		if (response.nextCursor !== void 0 && response.nextCursor !== null && typeof response.nextCursor !== "string") throw new Error("Codex app tool inventory returned an invalid pagination cursor");
		cursor = response.nextCursor;
		if (!cursor) return toolsByApp;
		if (seenCursors.has(cursor)) throw new Error("Codex app connector inventory repeated its pagination cursor");
		seenCursors.add(cursor);
	}
	throw new Error("Codex app connector inventory exceeded its bounded page limit");
}
// extensions/codex/src/app-server/plugin-app-approval-overrides.ts
/** Projects ask approvals into the native session layer without changing saved settings. */
function buildCodexAppApprovalOverrides(config, app) {
	const appsRoot = config.apps;
	const appConfig = isJsonObject(appsRoot) ? appsRoot[app.id] : void 0;
	if (!isJsonObject(appConfig)) return {};
	const overrides = {};
	const keys = app.approvalOverrideToolConfigKeys;
	for (const [section, fields] of [["tools", { approval_mode: "auto" }], ["links", {
		approvals_reviewer: "user",
		default_tools_approval_mode: "auto"
	}]]) {
		const entries = appConfig[section];
		if (!isJsonObject(entries)) continue;
		const projected = Object.entries(entries).toSorted(([left], [right]) => left.localeCompare(right)).filter(([name, value]) => isJsonObject(value) && (section !== "tools" || !keys || keys.includes(name)) && Object.keys(fields).some((field) => value[field] !== void 0 && value[field] !== null)).map(([name]) => [name, fields]);
		if (projected.length > 0) overrides[section] = Object.fromEntries(projected);
	}
	return overrides;
}
// extensions/codex/src/app-server/scheduled-app-tool-policy.ts
function normalizeAppToolApprovalMode(value) {
	return value === "auto" || value === "prompt" || value === "writes" || value === "approve" ? value : void 0;
}
function readCurrentToolPolicy(config, appId, toolName, metadata, fallbackApprovalMode = "auto") {
	const apps = asOptionalRecord(config.apps);
	const app = asOptionalRecord(apps?.[appId]);
	const defaults = asOptionalRecord(apps?.["_default"]);
	const tools = asOptionalRecord(app?.tools);
	const tool = asOptionalRecord(tools?.[toolName] ?? (metadata?.title !== void 0 ? tools?.[metadata.title] : void 0));
	const toolApprovalMode = normalizeAppToolApprovalMode(tool?.approval_mode);
	let approvalMode = toolApprovalMode ?? normalizeAppToolApprovalMode(app?.default_tools_approval_mode) ?? normalizeAppToolApprovalMode(defaults?.default_tools_approval_mode) ?? fallbackApprovalMode;
	if (!toolApprovalMode) {
		const links = asOptionalRecord(app?.links);
		if (metadata?.requiresExplicitLinkId) for (const link of Object.values(links ?? {})) {
			const linkMode = normalizeAppToolApprovalMode(asOptionalRecord(link)?.default_tools_approval_mode);
			if (linkMode) approvalMode = intersectToolApprovalMode(approvalMode, linkMode);
		}
		else if (metadata?.linkId) approvalMode = normalizeAppToolApprovalMode(asOptionalRecord(links?.[metadata.linkId])?.default_tools_approval_mode) ?? approvalMode;
	}
	const defaultToolsEnabled = app?.default_tools_enabled;
	return {
		enabled: (app ? app.enabled !== false : defaults?.enabled !== false) && (typeof tool?.enabled === "boolean" ? tool.enabled : typeof defaultToolsEnabled === "boolean" ? defaultToolsEnabled : appToolHintsAllowed(metadata, {
			allowDestructiveActions: (app?.destructive_enabled ?? defaults?.destructive_enabled) !== false,
			allowOpenWorld: (app?.open_world_enabled ?? defaults?.open_world_enabled) !== false
		})),
		approvalMode
	};
}
function appToolHintsAllowed(tool, policy) {
	return (policy.allowDestructiveActions || tool?.destructiveHint === false) && (policy.allowOpenWorld !== false || tool?.openWorldHint === false);
}
function intersectToolApprovalMode(captured, current) {
	if (captured === current || current === "approve") return captured;
	if (captured === "approve") return current;
	return "prompt";
}
// extensions/codex/src/app-server/plugin-app-read-only.ts
/** Native per-tool enabled takes precedence over both app flags and defaults. */
function buildCodexAppReadOnlyTools(config, app, runtimeTools, previousTools = {}) {
	const nativeApp = asOptionalRecord(asOptionalRecord(config.apps)?.[app.id]);
	const nativeTools = asOptionalRecord(nativeApp?.tools) ?? {};
	const enabledByKey = new Map([.../* @__PURE__ */ new Set([...Object.keys(nativeTools), ...Object.keys(previousTools)])].map((key) => [key, { enabled: false }]));
	const readable = /* @__PURE__ */ new Map();
	for (const tool of app.toolSummaries ?? []) readable.set(tool.name, readable.get(tool.name) !== false && isExplicitlyTrue(tool.isReadOnly) && isExplicitlyTrue(tool.isEnabled));
	for (const [name, tool] of runtimeTools ?? []) {
		const native = asOptionalRecord(nativeTools[name] ?? (tool.title && nativeTools[tool.title]));
		const approvalMode = normalizeAppToolApprovalMode(native?.approval_mode);
		enabledByKey.set(name, {
			enabled: tool.readOnlyHint === true && tool.actionName !== void 0 && readable.get(tool.actionName) === true && native?.enabled !== false,
			...approvalMode ? { approval_mode: approvalMode } : {}
		});
	}
	return Object.fromEntries([...enabledByKey].toSorted(([a], [b]) => a.localeCompare(b)));
}
function isExplicitlyTrue(value) {
	return value === true;
}
// extensions/codex/src/app-server/plugin-thread-app-admission.ts
function resolveCodexPluginThreadAppCacheKey(params) {
	return params.threadId ? `${params.appCacheKey}:thread:${encodeURIComponent(params.threadId)}` : params.appCacheKey;
}
async function refreshCodexPluginAppInventory(params, appCache, options = {}) {
	if (!params.appCacheKey) return;
	const request = createCodexAppInventoryRequest(params);
	try {
		return await appCache.refreshNow({
			key: resolveCodexPluginThreadAppCacheKey(params),
			request,
			nowMs: params.nowMs,
			forceRefetch: options.forceRefetch,
			targetAppIds: options.targetAppIds
		});
	} catch (error) {
		embeddedAgentLog.warn("codex plugin thread config app inventory refresh failed", {
			reason: options.reason,
			forceRefetch: options.forceRefetch === true,
			error: serializeCodexAppInventoryError(error)
		});
		return;
	}
}
function collectCodexPluginOwnedAppIds(inventory) {
	return Array.from(new Set(inventory.records.flatMap((record) => record.ownedAppIds).filter(Boolean))).toSorted();
}
function collectCodexReservedPluginAppIds(params) {
	const reserved = new Set(params.inventory.records.flatMap((record) => record.appOwnership === "proven" ? record.ownedAppIds : []).map(codexAppIdentityKey));
	const recordsByConfigKey = new Map(params.inventory.records.map((record) => [record.policy.configKey, record]));
	const configuredOwnerNames = new Set(params.policy.pluginPolicies.flatMap((policy) => {
		const record = recordsByConfigKey.get(policy.configKey);
		return [
			policy.configKey,
			policy.pluginName,
			record?.summary.name,
			record?.summary.id
		].filter((name) => Boolean(name)).map(normalizeCodexPluginOwnerName);
	}));
	for (const app of params.accountApps) if (app.pluginDisplayNames.some((name) => configuredOwnerNames.has(normalizeCodexPluginOwnerName(name)))) reserved.add(codexAppIdentityKey(app.id));
	return reserved;
}
function normalizeCodexPluginOwnerName(name) {
	return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
}
async function readCodexThreadAdmissibleAccountApps(params, appCache) {
	const request = createCodexAppInventoryRequest(params);
	const cachedInventory = appCache.read({
		key: resolveCodexPluginThreadAppCacheKey(params),
		request,
		nowMs: params.nowMs,
		suppressRefresh: true
	});
	const snapshot = cachedInventory.state === "fresh" && !cachedInventory.snapshot?.targetAppIds?.length ? cachedInventory.snapshot : await refreshCodexPluginAppInventory(params, appCache, {
		reason: "account_apps_all",
		targetAppIds: []
	});
	if (!snapshot) return {
		apps: [],
		diagnostic: {
			code: "account_app_inventory_unavailable",
			message: "Codex account app inventory was unavailable; account apps were not exposed."
		}
	};
	const installedAppsById = new Map(snapshot.installedApps.map((app) => [app.id, app]));
	return { apps: snapshot.apps.filter((app) => isCodexInstalledAppThreadAdmissible(installedAppsById.get(app.id))).toSorted((left, right) => left.id.localeCompare(right.id)) };
}
function isCodexPluginAppThreadAdmissible(app, inventory) {
	const snapshot = inventory.appInventory?.snapshot;
	if (!app.accessible || !snapshot) return false;
	return isCodexInstalledAppThreadAdmissible(snapshot.installedApps.find((candidate) => candidate.id === app.id));
}
function isCodexInstalledAppThreadAdmissible(installed) {
	return Boolean(installed && (installed.enabled && installed.callable || !installed.enabled && !installed.callable));
}
async function readCodexConfigForAppAdmission(params) {
	try {
		const response = await params.request("config/read", {
			includeLayers: true,
			...params.configCwd ? { cwd: params.configCwd } : {}
		});
		if (!isJsonObject(response) || !isJsonObject(response.config) || !Array.isArray(response.layers)) throw new Error("Codex config/read omitted effective config or config layers");
		return {
			config: response.config,
			layers: response.layers.flatMap((layer) => {
				if (!isJsonObject(layer)) throw new Error("Codex config/read returned an invalid config layer");
				if (layer.disabledReason !== void 0 && layer.disabledReason !== null) {
					if (typeof layer.disabledReason !== "string") throw new Error("Codex config/read returned an invalid disabled layer");
					return [];
				}
				if (!isJsonObject(layer.config)) throw new Error("Codex config/read returned an invalid layer config");
				if (!isJsonObject(layer.name) || typeof layer.name.type !== "string") throw new Error("Codex config/read returned an invalid config layer source");
				if (layer.config.apps !== void 0 && !CODEX_SESSION_OVERRIDABLE_LAYER_TYPES.has(layer.name.type)) throw new Error(`Codex app policy cannot override ${layer.name.type}; move app settings to a supported user or project config layer before exposing native apps`);
				return [layer.config];
			})
		};
	} catch (error) {
		const details = serializeCodexAppInventoryError(error);
		throw new Error(`Could not verify the Codex app allowlist: ${String(details.message)}. No native thread was started; resolve the native configuration error and retry.`, { cause: error });
	}
}
function resolveCodexExplicitAppEnablement(layersHighestPrecedenceFirst, appId) {
	for (const layer of layersHighestPrecedenceFirst) {
		const apps = layer.apps;
		const values = isJsonObject(apps) ? Object.entries(apps).filter(([id, app]) => codexAppIdentityKey(id) === codexAppIdentityKey(appId) && isJsonObject(app) && Object.hasOwn(app, "enabled")).map(([, app]) => isJsonObject(app) && app.enabled === true) : [];
		if (values.length > 0) return values.every(Boolean);
	}
}
function shouldForceRefreshCodexNotReadyPluginApps(params, policy, inventory) {
	if (!params.appCacheKey || !policy.pluginPolicies.some((plugin) => plugin.enabled) || inventory.appInventory?.state === "missing") return false;
	return inventory.records.some((record) => record.appOwnership === "proven" && record.ownedAppIds.length > 0 && (record.apps.length === 0 || record.apps.some((app) => !app.accessible)));
}
// extensions/codex/src/app-server/plugin-thread-config.ts
const CODEX_PLUGIN_THREAD_CONFIG_INPUT_FINGERPRINT_VERSION = 16;
const CODEX_PLUGIN_THREAD_CONFIG_FINGERPRINT_VERSION = 2;
function shouldBuildCodexPluginThreadConfig(pluginConfig) {
	return resolveCodexPluginsPolicy(readCodexPluginConfig(pluginConfig)).configured;
}
/** Fingerprints policy and app-cache identity before runtime inventory is read. */
function buildCodexPluginThreadConfigInputFingerprint(params) {
	const { policy } = params;
	return fingerprintCodexPolicy({
		version: CODEX_PLUGIN_THREAD_CONFIG_INPUT_FINGERPRINT_VERSION,
		...policy.enabled && policy.pluginPolicies.some((plugin) => plugin.enabled && plugin.readOnly) ? { readOnlyToolIdentity: "mcp-resource" } : {},
		policy: {
			enabled: policy.enabled,
			allowAllPlugins: policy.allowAllPlugins,
			allowDestructiveActions: policy.allowDestructiveActions,
			destructiveApprovalMode: policy.destructiveApprovalMode,
			plugins: policy.pluginPolicies
		},
		appCacheKey: params.appCacheKey ?? null
	});
}
/** Builds the deny-all app patch used when plugin discovery exceeds its turn budget. */
function buildCodexPluginThreadConfigTimeoutFallback(params) {
	return finishPluginThreadConfig({
		enabled: true,
		inputFingerprint: buildCodexPluginThreadConfigInputFingerprint(params),
		configPatch: buildDisabledAppsConfigPatch(),
		diagnostics: [{
			code: "plugin_config_timeout",
			message: params.message
		}]
	});
}
async function buildCodexPluginThreadConfig(params) {
	const appCache = params.appCache ?? defaultCodexAppInventoryCache;
	const threadAppCacheKey = resolveCodexPluginThreadAppCacheKey(params);
	const policy = params.policy ?? resolveCodexPluginsPolicy(readCodexPluginConfig(params.pluginConfig));
	const inputFingerprint = buildCodexPluginThreadConfigInputFingerprint({
		policy,
		appCacheKey: params.appCacheKey
	});
	if (!policy.enabled) return finishPluginThreadConfig({
		enabled: false,
		inputFingerprint,
		configPatch: buildDisabledAppsConfigPatch()
	});
	const inventoryParams = {
		request: params.request,
		threadId: params.threadId,
		appCache,
		appCacheKey: params.appCacheKey,
		appInventoryCacheKey: threadAppCacheKey,
		configCwd: params.configCwd,
		metadataCache: params.metadataCache
	};
	const readInventory = (suppressAppInventoryRefresh) => readCodexPluginInventory({
		...inventoryParams,
		policy,
		nowMs: params.nowMs,
		suppressAppInventoryRefresh
	});
	let inventory = policy.pluginPolicies.length > 0 ? await readInventory(true) : {
		policy,
		records: [],
		diagnostics: []
	};
	const refreshInventory = async (options) => {
		await refreshCodexPluginAppInventory(params, appCache, {
			...options,
			targetAppIds: collectCodexPluginOwnedAppIds(inventory)
		});
		inventory = await readInventory();
	};
	const activationRequired = inventory.records.some((record) => record.activationRequired);
	const appInventoryMissing = shouldRefreshMissingAppInventory(params, policy, inventory);
	const appInventoryRefreshDeferredForActivation = activationRequired && appInventoryMissing;
	if (!activationRequired && appInventoryMissing) await refreshInventory({
		forceRefetch: false,
		reason: "initial_missing"
	});
	const activationDiagnostics = [];
	const activationResults = /* @__PURE__ */ new Map();
	let postInstallRefreshRequired = false;
	for (const record of inventory.records) {
		if (!record.activationRequired) continue;
		const activation = await ensureCodexPluginActivation({
			...inventoryParams,
			identity: record.policy,
			deferAppInventoryRefresh: true,
			targetAppIds: record.ownedAppIds
		});
		activationResults.set(record.policy.configKey, activation.ok);
		postInstallRefreshRequired ||= activation.ok && activation.installAttempted;
		if (!activation.ok) activationDiagnostics.push({
			code: "plugin_activation_failed",
			plugin: record.policy,
			message: activation.diagnostics.map((item) => item.message).join(" ") || activation.reason
		});
	}
	const deferredMissingRefreshRequired = appInventoryRefreshDeferredForActivation && !postInstallRefreshRequired && shouldRefreshMissingAppInventory(params, policy, inventory);
	if (postInstallRefreshRequired || deferredMissingRefreshRequired) await refreshInventory({
		forceRefetch: true,
		reason: postInstallRefreshRequired ? "post_install" : "deferred_missing"
	});
	if (shouldForceRefreshCodexNotReadyPluginApps(params, policy, inventory)) await refreshInventory({
		forceRefetch: true,
		reason: "not_ready_plugin_apps"
	});
	const accountAppsResult = policy.allowAllPlugins ? await readCodexThreadAdmissibleAccountApps(params, appCache) : { apps: [] };
	let appAdmissionConfig;
	const getAdmissionConfig = () => appAdmissionConfig ??= readCodexConfigForAppAdmission(params);
	const diagnostics = [
		...inventory.diagnostics,
		...activationDiagnostics,
		...accountAppsResult.diagnostic ? [accountAppsResult.diagnostic] : []
	];
	let runtimeTools;
	const getRuntimeTools = () => runtimeTools ??= readReadOnlyRuntimeTools(params, diagnostics);
	const provisionalAppIds = /* @__PURE__ */ new Set();
	const { apps } = buildDisabledAppsConfigPatch();
	const policyApps = {};
	const pluginAppIds = {};
	const pluginOwnedAppIds = collectCodexReservedPluginAppIds({
		policy: inventory.policy,
		inventory,
		accountApps: accountAppsResult.apps
	});
	const unresolvedDisabledPluginOwnership = policy.allowAllPlugins ? inventory.policy.pluginPolicies.find((pluginPolicy) => {
		const record = inventory.records.find((candidate) => candidate.policy.configKey === pluginPolicy.configKey);
		const disabledByMarketplacePolicy = record?.summary.availability === "DISABLED_BY_ADMIN" || record?.summary.installPolicy === "NOT_AVAILABLE";
		const unresolvedPluginIdentity = !record && inventory.diagnostics.some((diagnostic) => diagnostic.plugin?.configKey === pluginPolicy.configKey && (diagnostic.code === "plugin_disabled" || diagnostic.code === "plugin_missing" || diagnostic.code === "marketplace_missing"));
		return (!pluginPolicy.enabled || disabledByMarketplacePolicy || unresolvedPluginIdentity) && !record?.detail;
	}) : void 0;
	if (unresolvedDisabledPluginOwnership) diagnostics.push({
		code: "account_app_ownership_unavailable",
		plugin: unresolvedDisabledPluginOwnership,
		message: `Could not verify disabled Codex plugin app ownership for ${unresolvedDisabledPluginOwnership.pluginName}; account apps were not exposed.`
	});
	for (const record of inventory.records) {
		if (!record.policy.enabled) continue;
		const activationSucceeded = activationResults.get(record.policy.configKey);
		if (activationSucceeded === false || record.activationRequired && !activationSucceeded) continue;
		if (record.appOwnership !== "proven") continue;
		pluginAppIds[record.policy.configKey] = [...record.ownedAppIds].toSorted();
		for (const app of inventory.appInventory?.state === "missing" ? [] : record.apps) {
			const admissionConfig = isCodexPluginAppThreadAdmissible(app, inventory) ? await getAdmissionConfig() : void 0;
			if (!admissionConfig || resolveCodexExplicitAppEnablement(admissionConfig.layers, app.id) === false) {
				diagnostics.push({
					code: "app_not_ready",
					plugin: record.policy,
					message: `${app.id} is not accessible for ${record.policy.pluginName}.`
				});
				continue;
			}
			provisionalAppIds.add(app.id);
			const readOnlyPolicy = record.policy.readOnly || policyApps[app.id]?.readOnlyTools !== void 0 ? { readOnlyTools: buildCodexAppReadOnlyTools(admissionConfig.config, app, (await getRuntimeTools()).get(app.id)) } : {};
			apps[app.id] = buildEnabledAppConfig({
				...record.policy,
				...readOnlyPolicy
			}, record.policy.destructiveApprovalMode === "ask" ? buildCodexAppApprovalOverrides(admissionConfig.config, app) : void 0);
			policyApps[app.id] = {
				...readOnlyPolicy,
				configKey: record.policy.configKey,
				marketplaceName: record.policy.marketplaceName,
				pluginName: record.policy.pluginName,
				allowDestructiveActions: record.policy.allowDestructiveActions,
				allowOpenWorld: true,
				destructiveApprovalMode: record.policy.destructiveApprovalMode,
				mcpServerNames: [...record.detail?.mcpServers ?? []].toSorted()
			};
		}
	}
	for (const app of unresolvedDisabledPluginOwnership ? [] : accountAppsResult.apps) {
		if (pluginOwnedAppIds.has(codexAppIdentityKey(app.id))) continue;
		const admissionConfig = await getAdmissionConfig();
		if (resolveCodexExplicitAppEnablement(admissionConfig.layers, app.id) === false) continue;
		const accountApp = toCodexPluginOwnedAccountApp(app);
		provisionalAppIds.add(app.id);
		apps[app.id] = buildEnabledAppConfig(policy, policy.destructiveApprovalMode === "ask" ? buildCodexAppApprovalOverrides(admissionConfig.config, accountApp) : void 0);
		policyApps[app.id] = {
			source: "account",
			appName: app.name,
			allowDestructiveActions: policy.allowDestructiveActions,
			allowOpenWorld: true,
			destructiveApprovalMode: policy.destructiveApprovalMode,
			mcpServerNames: []
		};
	}
	const configPatch = Object.keys(policyApps).length === 0 ? buildDisabledAppsConfigPatch() : disableUnlistedCodexApps({ apps }, (await getAdmissionConfig()).config);
	const policyContext = buildPluginAppPolicyContext(policyApps, pluginAppIds);
	return finishPluginThreadConfig({
		enabled: true,
		configPatch,
		...provisionalAppIds.size > 0 ? { provisionalAppIds: Array.from(provisionalAppIds).toSorted() } : {},
		inputFingerprint,
		policyContext,
		diagnostics
	});
}
/** Deep-merges optional Codex thread config patches, returning undefined when empty. */
function mergeCodexThreadConfigs(...configs) {
	let merged;
	for (const config of configs) {
		if (!config) continue;
		merged = mergeJsonObjects(merged ?? {}, normalizeShellEnvironmentOverrides(config));
	}
	return merged && Object.keys(merged).length > 0 ? merged : void 0;
}
function isCodexPluginThreadBindingStale(params) {
	if (!params.codexPluginsEnabled) return Boolean(params.bindingFingerprint || params.bindingInputFingerprint || params.hasBindingPolicyContext);
	if (!params.bindingFingerprint || !params.bindingInputFingerprint || !params.hasBindingPolicyContext) return true;
	return params.bindingInputFingerprint !== params.currentInputFingerprint;
}
function finishPluginThreadConfig(config) {
	const policyContext = config.policyContext ?? buildPluginAppPolicyContext({}, {});
	return {
		...config,
		policyContext,
		diagnostics: config.diagnostics ?? [],
		fingerprint: fingerprintCodexPolicy({
			version: CODEX_PLUGIN_THREAD_CONFIG_FINGERPRINT_VERSION,
			inputFingerprint: config.inputFingerprint,
			configPatch: config.configPatch ?? null,
			policyContext
		})
	};
}
function buildDisabledAppsConfigPatch() {
	return {
		"features.apps": false,
		apps: { _default: {
			enabled: false,
			destructive_enabled: false,
			open_world_enabled: false
		} }
	};
}
function disableUnlistedCodexApps(configPatch, nativeConfig) {
	const apps = { ...configPatch.apps };
	for (const id of Object.keys(isJsonObject(nativeConfig.apps) ? nativeConfig.apps : {})) if (id !== "_default" && !Object.hasOwn(apps, id)) apps[id] = { enabled: false };
	return {
		...configPatch,
		apps
	};
}
function buildEnabledAppConfig(policy, approvalOverrides = {}) {
	return {
		...approvalOverrides,
		enabled: true,
		destructive_enabled: policy.allowDestructiveActions,
		open_world_enabled: policy.allowOpenWorld !== false,
		...policy.readOnlyTools !== void 0 ? {
			default_tools_enabled: false,
			tools: mergeCodexThreadConfigs(isJsonObject(approvalOverrides.tools) ? approvalOverrides.tools : {}, policy.readOnlyTools)
		} : {},
		...policy.destructiveApprovalMode === "ask" ? {
			default_tools_approval_mode: "auto",
			approvals_reviewer: "user"
		} : {}
	};
}
/** Rebuilds the safe per-thread apps patch persisted with a Codex thread binding. */
function buildCodexPluginAppsConfigPatchFromPolicyContext(policyContext) {
	const disabledConfigPatch = buildDisabledAppsConfigPatch();
	const { apps } = disabledConfigPatch;
	for (const [appId, policy] of Object.entries(policyContext.apps).toSorted(([left], [right]) => left.localeCompare(right))) apps[appId] = buildEnabledAppConfig(policy);
	return Object.keys(policyContext.apps).length > 0 ? { apps } : disabledConfigPatch;
}
async function readReadOnlyRuntimeTools(params, diagnostics) {
	try {
		return await readCodexAppRuntimeTools(params);
	} catch {
		diagnostics.push({
			code: "app_not_ready",
			message: "Could not verify hosted tool identities. Read-only apps have no enabled tools."
		});
		return /* @__PURE__ */ new Map();
	}
}
/** Projects current ask overrides before a side thread replays its bound app policy. */
async function refreshCodexPluginAppApprovalPolicy(params) {
	if (Object.keys(params.policyContext.apps).length === 0) return {
		policyContext: params.policyContext,
		configPatch: buildDisabledAppsConfigPatch(),
		diagnostics: []
	};
	const targetApps = Object.entries(params.policyContext.apps).filter(([, app]) => app.destructiveApprovalMode === "ask" || app.readOnlyTools !== void 0).toSorted(([left], [right]) => left.localeCompare(right));
	const targetAppIds = targetApps.map(([id]) => id);
	const diagnostics = [];
	const readParams = {
		...params,
		appCacheKey: "approval-policy-replay"
	};
	const [inventory, admissionConfig, runtimeTools] = await Promise.all([
		targetAppIds.length > 0 ? refreshCodexPluginAppInventory(readParams, new CodexAppInventoryCache(), { targetAppIds }) : void 0,
		readCodexConfigForAppAdmission(readParams),
		targetApps.some(([, policy]) => policy.readOnlyTools !== void 0) ? readReadOnlyRuntimeTools(params, diagnostics) : void 0
	]);
	const configPatch = disableUnlistedCodexApps(buildCodexPluginAppsConfigPatchFromPolicyContext(params.policyContext), admissionConfig.config);
	const currentApps = new Map(inventory?.apps.map((app) => [app.id, toCodexPluginOwnedAccountApp(app)]));
	const apps = { ...params.policyContext.apps };
	for (const [id, policy] of targetApps) {
		const app = currentApps.get(id);
		if (!app) diagnostics.push({
			code: "app_not_ready",
			message: `Could not verify current Codex app approval policy for ${id}; the app was not exposed.`
		});
		else {
			const currentPolicy = {
				...policy,
				...policy.readOnlyTools !== void 0 ? { readOnlyTools: buildCodexAppReadOnlyTools(admissionConfig.config, app, runtimeTools?.get(id), policy.readOnlyTools) } : {}
			};
			apps[id] = currentPolicy;
			configPatch.apps[id] = buildEnabledAppConfig(currentPolicy, policy.destructiveApprovalMode === "ask" ? buildCodexAppApprovalOverrides(admissionConfig.config, app) : void 0);
			continue;
		}
		delete apps[id];
		configPatch.apps[id] = { enabled: false };
	}
	return {
		policyContext: buildPluginAppPolicyContext(apps, Object.fromEntries(Object.entries(params.policyContext.pluginAppIds).map(([key, ids]) => [key, ids.filter((id) => Object.hasOwn(apps, id))]))),
		configPatch,
		diagnostics
	};
}
function buildPluginAppPolicyContext(apps, pluginAppIds) {
	return {
		fingerprint: fingerprintCodexPolicy({
			version: 2,
			apps,
			pluginAppIds
		}),
		apps,
		pluginAppIds
	};
}
function shouldRefreshMissingAppInventory(params, policy, inventory) {
	return Boolean(params.appCacheKey && policy.pluginPolicies.some((plugin) => plugin.enabled) && inventory.appInventory?.state === "missing");
}
function normalizeShellEnvironmentOverrides(config) {
	let normalized = { ...config };
	for (const [key, value] of Object.entries(config)) {
		if (!key.startsWith("shell_environment_policy.")) continue;
		delete normalized[key];
		let patch = value;
		for (const segment of key.split(".").toReversed()) patch = { [segment]: patch };
		normalized = mergeJsonObjects(normalized, patch);
	}
	return normalized;
}
function mergeJsonObjects(left, right) {
	const merged = {
		...left,
		...right
	};
	for (const [key, value] of Object.entries(right)) {
		const existing = left[key];
		if (Object.hasOwn(left, key) && isJsonObject(existing) && isJsonObject(value)) merged[key] = mergeJsonObjects(existing, value);
	}
	return merged;
}
// extensions/codex/src/app-server/project-doc-thread-config.ts
const CODEX_NATIVE_PROJECT_DOC_MAX_BYTES = 131072;
function buildCodexProjectDocThreadConfig(config, effectiveNativeConfig) {
	const defaults = { project_doc_max_bytes: resolveCodexNativeProjectDocMaxBytes(effectiveNativeConfig) ?? CODEX_NATIVE_PROJECT_DOC_MAX_BYTES };
	return mergeCodexThreadConfigs(defaults, config) ?? defaults;
}
function resolveCodexNativeProjectDocMaxBytes(effectiveNativeConfig) {
	if (effectiveNativeConfig?.origins?.project_doc_max_bytes === void 0) return;
	const authoredMaxBytes = effectiveNativeConfig.config.project_doc_max_bytes;
	if (typeof authoredMaxBytes !== "number" || !Number.isSafeInteger(authoredMaxBytes) || authoredMaxBytes < 0) throw new Error("Codex config/read returned an invalid project_doc_max_bytes value");
	return authoredMaxBytes;
}
function mergeCodexNativeProjectDocThreadConfig(config, effectiveNativeConfig) {
	const authoredMaxBytes = resolveCodexNativeProjectDocMaxBytes(effectiveNativeConfig);
	return authoredMaxBytes === void 0 ? config : mergeCodexThreadConfigs({ project_doc_max_bytes: authoredMaxBytes }, config);
}
export { intersectToolApprovalMode as _, buildCodexPluginThreadConfigInputFingerprint as a, buildCodexAppApprovalOverrides as b, buildPluginAppPolicyContext as c, mergeCodexThreadConfigs as d, refreshCodexPluginAppApprovalPolicy as f, appToolHintsAllowed as g, buildCodexAppReadOnlyTools as h, buildCodexPluginThreadConfig as i, disableUnlistedCodexApps as l, resolveCodexPluginThreadAppCacheKey as m, mergeCodexNativeProjectDocThreadConfig as n, buildCodexPluginThreadConfigTimeoutFallback as o, shouldBuildCodexPluginThreadConfig as p, buildCodexPluginAppsConfigPatchFromPolicyContext as r, buildDisabledAppsConfigPatch as s, buildCodexProjectDocThreadConfig as t, isCodexPluginThreadBindingStale as u, normalizeAppToolApprovalMode as v, readCodexAppRuntimeTools as x, readCurrentToolPolicy as y };
