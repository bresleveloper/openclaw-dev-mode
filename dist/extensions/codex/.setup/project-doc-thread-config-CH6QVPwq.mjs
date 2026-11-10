import { r as isJsonObject } from "./protocol-CaPAVwe9.mjs";
import { l as fingerprintCodexPolicy } from "./config-security-BxV4sSRz.mjs";
import { f as resolveCodexPluginsPolicy } from "./config-parsing-DsWSCPHO.mjs";
import { u as CODEX_SESSION_OVERRIDABLE_LAYER_TYPES } from "./config-options-l737cwJB.mjs";
import { a as defaultCodexAppInventoryCache, i as CodexAppInventoryCache, o as serializeCodexAppInventoryError, s as codexAppIdentityKey } from "./plugin-app-cache-key-CKBEird9.mjs";
import { l as toCodexPluginOwnedAccountApp, s as readCodexPluginInventory, t as createCodexAppInventoryRequest } from "./plugin-inventory-C6tZFyJF.mjs";
import "./config-DEC5R1wk.mjs";
import { t as ensureCodexPluginActivation } from "./plugin-activation-DhI5eCzu.mjs";
import { embeddedAgentLog } from "openclaw/plugin-sdk/agent-harness-runtime";
//#region extensions/codex/src/app-server/plugin-app-approval-overrides.ts
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
//#endregion
//#region extensions/codex/src/app-server/plugin-thread-app-admission.ts
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
		embeddedAgentLog.warn("codex plugin app admission config read failed", { error: details });
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
//#endregion
//#region extensions/codex/src/app-server/plugin-thread-config.ts
const CODEX_PLUGIN_THREAD_CONFIG_INPUT_FINGERPRINT_VERSION = 15;
const CODEX_PLUGIN_THREAD_CONFIG_FINGERPRINT_VERSION = 2;
function shouldBuildCodexPluginThreadConfig(pluginConfig) {
	return resolveCodexPluginsPolicy(pluginConfig).configured;
}
/** Fingerprints policy and app-cache identity before runtime inventory is read. */
function buildCodexPluginThreadConfigInputFingerprint(params) {
	const policy = resolveCodexPluginsPolicy(params.pluginConfig);
	return fingerprintCodexPolicy({
		version: CODEX_PLUGIN_THREAD_CONFIG_INPUT_FINGERPRINT_VERSION,
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
	let inputFingerprint = buildCodexPluginThreadConfigInputFingerprint(params);
	const policy = resolveCodexPluginsPolicy(params.pluginConfig);
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
		inputFingerprint = buildCodexPluginThreadConfigInputFingerprint(params);
	};
	const activationRequired = inventory.records.some((record) => record.activationRequired);
	const appInventoryMissing = shouldRefreshMissingAppInventory(params, policy, inventory);
	const appInventoryRefreshDeferredForActivation = activationRequired && appInventoryMissing;
	if (!activationRequired && appInventoryMissing) await refreshInventory({
		forceRefetch: false,
		reason: "initial_missing"
	});
	const activationDiagnostics = [];
	const activationResults = [];
	for (const record of inventory.records) {
		if (!record.activationRequired) continue;
		const activation = await ensureCodexPluginActivation({
			...inventoryParams,
			identity: record.policy,
			deferAppInventoryRefresh: true,
			targetAppIds: record.ownedAppIds
		});
		activationResults.push(activation);
		if (!activation.ok) activationDiagnostics.push({
			code: "plugin_activation_failed",
			plugin: record.policy,
			message: activation.diagnostics.map((item) => item.message).join(" ") || activation.reason
		});
	}
	const postInstallRefreshRequired = activationResults.some((activation) => activation.ok && activation.installAttempted);
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
		const activation = activationResults.find((item) => item.identity.configKey === record.policy.configKey);
		if (activation?.ok === false || record.activationRequired && !activation?.ok) continue;
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
			apps[app.id] = buildEnabledAppConfig(record.policy, record.policy.destructiveApprovalMode === "ask" ? buildCodexAppApprovalOverrides(admissionConfig.config, app) : void 0);
			policyApps[app.id] = {
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
/** Projects current ask overrides before a side thread replays its bound app policy. */
async function refreshCodexPluginAppApprovalPolicy(params) {
	if (Object.keys(params.policyContext.apps).length === 0) return {
		policyContext: params.policyContext,
		configPatch: buildDisabledAppsConfigPatch(),
		diagnostics: []
	};
	const targetApps = Object.entries(params.policyContext.apps).filter(([, app]) => app.destructiveApprovalMode === "ask").toSorted(([left], [right]) => left.localeCompare(right));
	const targetAppIds = targetApps.map(([id]) => id);
	const diagnostics = [];
	const readParams = {
		...params,
		appCacheKey: "approval-policy-replay"
	};
	const [inventory, admissionConfig] = await Promise.all([targetAppIds.length > 0 ? refreshCodexPluginAppInventory(readParams, new CodexAppInventoryCache(), { targetAppIds }) : void 0, readCodexConfigForAppAdmission(readParams)]);
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
			configPatch.apps[id] = buildEnabledAppConfig(policy, buildCodexAppApprovalOverrides(admissionConfig.config, app));
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
//#endregion
//#region extensions/codex/src/app-server/project-doc-thread-config.ts
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
//#endregion
export { buildCodexPluginThreadConfigInputFingerprint as a, buildPluginAppPolicyContext as c, mergeCodexThreadConfigs as d, refreshCodexPluginAppApprovalPolicy as f, buildCodexPluginThreadConfig as i, disableUnlistedCodexApps as l, buildCodexAppApprovalOverrides as m, mergeCodexNativeProjectDocThreadConfig as n, buildCodexPluginThreadConfigTimeoutFallback as o, shouldBuildCodexPluginThreadConfig as p, buildCodexPluginAppsConfigPatchFromPolicyContext as r, buildDisabledAppsConfigPatch as s, buildCodexProjectDocThreadConfig as t, isCodexPluginThreadBindingStale as u };
