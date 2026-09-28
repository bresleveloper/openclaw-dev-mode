import { a as readCodexPluginInventory, o as resolveOwnedAppApprovalOverrideKeys } from "./plugin-inventory-BoRei8Z4.mjs";
import { f as resolveCodexAppServerLocalHomeDir } from "./config-security-BEReZ6go.mjs";
import { f as resolveCodexPluginsPolicy } from "./config-parsing-CcB9iPoq.mjs";
import { i as isJsonObject } from "./protocol-CANUwXJ3.mjs";
import { d as readCodexEffectiveConfig, u as CODEX_SESSION_OVERRIDABLE_LAYER_TYPES } from "./config-options-BvaRs51b.mjs";
import { t as isIncognitoSessionKey } from "./incognito-session-uhrBF6wJ.mjs";
import { a as defaultCodexAppInventoryCache, i as CodexAppInventoryCache, o as serializeCodexAppInventoryError, s as codexAppIdentityKey, t as buildCodexAppServerConnectionFingerprint } from "./plugin-app-cache-key-B2CsSdnV.mjs";
import "./config-BoTP_mrL.mjs";
import { t as isCodexAppServerNativeAuthProfile } from "./auth-profile-WqZtZfXN.mjs";
import { E as nativeHookRelayUnregisterQueue, H as readCodexClientSessionMeta } from "./shared-client-DA4VR4Eb.mjs";
import { L as resolveCodexToolAbortTerminalReason } from "./client-Cs08OXVQ.mjs";
import { n as CODEX_APP_SERVER_UNSUBSCRIBE_TIMEOUT_MS, p as unsubscribeCodexThreadBestEffort } from "./attempt-client-cleanup-CEv1cKwF.mjs";
import { t as ensureCodexPluginActivation } from "./plugin-activation-DT3MNtqj.mjs";
import { r as hashCodexAppServerBindingFingerprint } from "./session-binding-Cm0apEbd.mjs";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import * as crypto$1 from "node:crypto";
import crypto, { createHash } from "node:crypto";
import { addTimerTimeoutGraceMs, finiteSecondsToTimerSafeMilliseconds } from "openclaw/plugin-sdk/number-runtime";
import path from "node:path";
import os from "node:os";
import fs from "node:fs/promises";
import { isPathInside } from "openclaw/plugin-sdk/file-access-runtime";
import { expectDefined } from "openclaw/plugin-sdk/expect-runtime";
import { resolveRequiredHomeDir, resolveStateDir } from "openclaw/plugin-sdk/state-paths";
import { toErrorObject } from "openclaw/plugin-sdk/error-runtime";
import { emitTrustedDiagnosticEvent } from "openclaw/plugin-sdk/diagnostic-runtime";
import { createDeferred } from "openclaw/plugin-sdk/extension-shared";
import { SKILL_WORKSHOP_TOOL_NAME, buildCredentialSafetyPrompt, buildDelegationGuidanceSection, buildSkillWorkshopPromptSection, buildUiPresentationPrompt, embeddedAgentLog, isHostScopedAgentToolActive, resolveMainSessionDelegationMode } from "openclaw/plugin-sdk/agent-harness-runtime";
import { registerNativeHookRelayForBundledRuntime } from "openclaw/plugin-sdk/native-hook-relay-runtime";
import { listRegisteredPluginAgentPromptGuidance } from "openclaw/plugin-sdk/plugin-runtime";
import { buildHostnameAllowlistPolicyFromSuffixAllowlist } from "openclaw/plugin-sdk/ssrf-policy";
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
		const projected = [];
		for (const [name, value] of Object.entries(entries).toSorted(([left], [right]) => left.localeCompare(right))) {
			if (!isJsonObject(value) || section === "tools" && keys && !keys.includes(name)) continue;
			if (Object.keys(fields).some((field) => value[field] !== void 0 && value[field] !== null)) projected.push([name, fields]);
		}
		if (projected.length > 0) overrides[section] = Object.fromEntries(projected);
	}
	return overrides;
}
//#endregion
//#region extensions/codex/src/app-server/plugin-thread-app-admission.ts
function resolveCodexPluginThreadAppCacheKey(params) {
	return params.threadId ? `${params.appCacheKey}:thread:${encodeURIComponent(params.threadId)}` : params.appCacheKey;
}
function createCodexPluginThreadAppInventoryRequest(params) {
	return async (method, requestParams) => await params.request(method, (method === "app/installed" || method === "app/read") && params.threadId ? {
		...requestParams,
		threadId: params.threadId
	} : requestParams);
}
async function refreshCodexPluginAppInventory(params, appCache, options = {}) {
	if (!params.appCacheKey) return;
	const request = createCodexPluginThreadAppInventoryRequest(params);
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
	const request = createCodexPluginThreadAppInventoryRequest(params);
	const cachedInventory = appCache.read({
		key: resolveCodexPluginThreadAppCacheKey(params),
		request,
		nowMs: params.nowMs,
		suppressRefresh: true
	});
	const snapshot = cachedInventory.state === "fresh" && !cachedInventory.snapshot?.targetAppIds?.length ? cachedInventory.snapshot : await refreshCodexPluginAppInventory(params, appCache, {
		forceRefetch: false,
		reason: "account_apps_all",
		targetAppIds: []
	});
	if (!snapshot) return {
		apps: [],
		installedApps: [],
		diagnostic: {
			code: "account_app_inventory_unavailable",
			message: "Codex account app inventory was unavailable; account apps were not exposed."
		}
	};
	const installedAppsById = new Map(snapshot.installedApps.map((app) => [app.id, app]));
	return {
		apps: snapshot.apps.filter((app) => resolveCodexInstalledAppThreadAdmission(toCodexPluginOwnedAccountApp(app, installedAppsById.get(app.id)), installedAppsById.get(app.id)) !== "blocked").toSorted((left, right) => left.id.localeCompare(right.id)),
		installedApps: snapshot.installedApps
	};
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
function resolveCodexThreadConfigAppsForRecord(params) {
	return params.inventory.appInventory?.state === "missing" ? [] : params.record.apps;
}
function resolveCodexPluginAppThreadAdmission(app, inventory) {
	const snapshot = inventory.appInventory?.snapshot;
	if (!snapshot) return "blocked";
	return resolveCodexInstalledAppThreadAdmission(app, snapshot.installedApps.find((candidate) => candidate.id === app.id));
}
function resolveCodexInstalledAppThreadAdmission(app, installed) {
	if (!app.accessible || app.needsAuth || !installed) return "blocked";
	if (installed.enabled && installed.callable) return "ready";
	return !installed.enabled && !installed.callable ? "provisional" : "blocked";
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
/**
* Builds Codex thread config patches that expose only policy-approved apps
* for native Codex turns.
*/
const CODEX_PLUGIN_THREAD_CONFIG_INPUT_FINGERPRINT_VERSION = 13;
const CODEX_PLUGIN_THREAD_CONFIG_FINGERPRINT_VERSION = 2;
/** Returns true when plugin config exists and thread config may need app patches. */
function shouldBuildCodexPluginThreadConfig(pluginConfig) {
	return resolveCodexPluginsPolicy(pluginConfig).configured;
}
/** Fingerprints policy and app-cache identity before runtime inventory is read. */
function buildCodexPluginThreadConfigInputFingerprint(params) {
	const policy = resolveCodexPluginsPolicy(params.pluginConfig);
	return fingerprintJson({
		version: CODEX_PLUGIN_THREAD_CONFIG_INPUT_FINGERPRINT_VERSION,
		policy: policyFingerprint(policy),
		appCacheKey: params.appCacheKey ?? null
	});
}
/** Builds the deny-all app patch used when plugin discovery exceeds its turn budget. */
function buildCodexPluginThreadConfigTimeoutFallback(params) {
	return {
		...emptyPluginThreadConfig({
			enabled: true,
			inputFingerprint: buildCodexPluginThreadConfigInputFingerprint(params),
			configPatch: buildDisabledAppsConfigPatch()
		}),
		diagnostics: [{
			code: "plugin_config_timeout",
			message: params.message
		}]
	};
}
/** Builds the Codex apps config patch and policy context for a native thread. */
async function buildCodexPluginThreadConfig(params) {
	const appCache = params.appCache ?? defaultCodexAppInventoryCache;
	const threadAppCacheKey = resolveCodexPluginThreadAppCacheKey(params);
	const threadRequest = (method, requestParams) => params.request(method, (method === "app/installed" || method === "app/read") && params.threadId && isJsonObject(requestParams) ? {
		...requestParams,
		threadId: params.threadId
	} : requestParams);
	let inputFingerprint = buildCodexPluginThreadConfigInputFingerprint({
		pluginConfig: params.pluginConfig,
		appCacheKey: params.appCacheKey
	});
	const policy = resolveCodexPluginsPolicy(params.pluginConfig);
	if (!policy.enabled) return emptyPluginThreadConfig({
		enabled: false,
		inputFingerprint,
		configPatch: buildDisabledAppsConfigPatch()
	});
	let inventory = policy.pluginPolicies.length > 0 ? await readCodexPluginInventory({
		pluginConfig: params.pluginConfig,
		policy,
		request: threadRequest,
		appCache,
		appCacheKey: params.appCacheKey,
		appInventoryCacheKey: threadAppCacheKey,
		configCwd: params.configCwd,
		metadataCache: params.metadataCache,
		nowMs: params.nowMs,
		suppressAppInventoryRefresh: true
	}) : emptyCodexPluginInventory(policy);
	const appInventoryRefreshDeferredForActivation = inventory.records.some((record) => record.activationRequired) && shouldRefreshMissingAppInventory(params, policy, inventory);
	if (shouldWaitForInitialAppInventory(params, policy, inventory)) {
		await refreshCodexPluginAppInventory(params, appCache, {
			forceRefetch: false,
			reason: "initial_missing",
			targetAppIds: collectCodexPluginOwnedAppIds(inventory)
		});
		inventory = await readCodexPluginInventory({
			pluginConfig: params.pluginConfig,
			policy,
			request: threadRequest,
			appCache,
			appCacheKey: params.appCacheKey,
			appInventoryCacheKey: threadAppCacheKey,
			configCwd: params.configCwd,
			metadataCache: params.metadataCache,
			nowMs: params.nowMs
		});
		inputFingerprint = buildCodexPluginThreadConfigInputFingerprint({
			pluginConfig: params.pluginConfig,
			appCacheKey: params.appCacheKey
		});
	}
	const activationDiagnostics = [];
	const activationResults = [];
	for (const record of inventory.records) {
		if (!record.activationRequired) continue;
		const activation = await ensureCodexPluginActivation({
			identity: record.policy,
			request: threadRequest,
			appCache,
			appCacheKey: params.appCacheKey,
			appInventoryCacheKey: threadAppCacheKey,
			configCwd: params.configCwd,
			metadataCache: params.metadataCache,
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
	if (postInstallRefreshRequired || deferredMissingRefreshRequired) {
		await refreshCodexPluginAppInventory(params, appCache, {
			forceRefetch: true,
			reason: postInstallRefreshRequired ? "post_install" : "deferred_missing",
			targetAppIds: collectCodexPluginOwnedAppIds(inventory)
		});
		inventory = await readCodexPluginInventory({
			pluginConfig: params.pluginConfig,
			policy,
			request: threadRequest,
			appCache,
			appCacheKey: params.appCacheKey,
			appInventoryCacheKey: threadAppCacheKey,
			configCwd: params.configCwd,
			metadataCache: params.metadataCache,
			nowMs: params.nowMs
		});
		inputFingerprint = buildCodexPluginThreadConfigInputFingerprint({
			pluginConfig: params.pluginConfig,
			appCacheKey: params.appCacheKey
		});
	}
	if (shouldForceRefreshCodexNotReadyPluginApps(params, policy, inventory)) {
		await refreshCodexPluginAppInventory(params, appCache, {
			forceRefetch: true,
			reason: "not_ready_plugin_apps",
			targetAppIds: collectCodexPluginOwnedAppIds(inventory)
		});
		inventory = await readCodexPluginInventory({
			pluginConfig: params.pluginConfig,
			policy,
			request: threadRequest,
			appCache,
			appCacheKey: params.appCacheKey,
			appInventoryCacheKey: threadAppCacheKey,
			configCwd: params.configCwd,
			metadataCache: params.metadataCache,
			nowMs: params.nowMs
		});
		inputFingerprint = buildCodexPluginThreadConfigInputFingerprint({
			pluginConfig: params.pluginConfig,
			appCacheKey: params.appCacheKey
		});
	}
	const accountAppsResult = policy.allowAllPlugins ? await readCodexThreadAdmissibleAccountApps(params, appCache) : {
		apps: [],
		installedApps: []
	};
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
		for (const app of resolveCodexThreadConfigAppsForRecord({
			record,
			inventory
		})) {
			const admissionConfig = resolveCodexPluginAppThreadAdmission(app, inventory) === "blocked" ? void 0 : await getAdmissionConfig();
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
		const accountApp = toCodexPluginOwnedAccountApp(app, accountAppsResult.installedApps.find((installed) => installed.id === app.id));
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
	return {
		enabled: true,
		configPatch,
		...provisionalAppIds.size > 0 ? { provisionalAppIds: Array.from(provisionalAppIds).toSorted() } : {},
		fingerprint: fingerprintJson({
			version: CODEX_PLUGIN_THREAD_CONFIG_FINGERPRINT_VERSION,
			inputFingerprint,
			configPatch,
			policyContext
		}),
		inputFingerprint,
		policyContext,
		inventory,
		diagnostics
	};
}
/** Deep-merges optional Codex thread config patches, returning undefined when empty. */
function mergeCodexThreadConfigs(...configs) {
	let merged;
	for (const config of configs) {
		if (!config) continue;
		merged = mergeJsonObjects(merged ?? {}, config);
	}
	return merged && Object.keys(merged).length > 0 ? merged : void 0;
}
/** Detects when a stored thread binding no longer matches current plugin policy inputs. */
function isCodexPluginThreadBindingStale(params) {
	if (!params.codexPluginsEnabled) return Boolean(params.bindingFingerprint || params.bindingInputFingerprint || params.hasBindingPolicyContext);
	if (!params.bindingFingerprint || !params.bindingInputFingerprint || !params.hasBindingPolicyContext) return true;
	return params.bindingInputFingerprint !== params.currentInputFingerprint;
}
function emptyPluginThreadConfig(params) {
	const policyContext = buildPluginAppPolicyContext({}, {});
	return {
		enabled: params.enabled,
		fingerprint: fingerprintJson({
			version: CODEX_PLUGIN_THREAD_CONFIG_FINGERPRINT_VERSION,
			inputFingerprint: params.inputFingerprint,
			configPatch: params.configPatch ?? null,
			policyContext
		}),
		inputFingerprint: params.inputFingerprint,
		...params.configPatch ? { configPatch: params.configPatch } : {},
		policyContext,
		diagnostics: []
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
		default_tools_approval_mode: "auto",
		...policy.destructiveApprovalMode === "ask" ? { approvals_reviewer: "user" } : {}
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
	const currentApps = new Map(inventory?.apps.map((app) => [app.id, toCodexPluginOwnedAccountApp(app, inventory.installedApps.find((installed) => installed.id === app.id))]));
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
		fingerprint: fingerprintJson({
			version: 2,
			apps,
			pluginAppIds
		}),
		apps,
		pluginAppIds
	};
}
function shouldWaitForInitialAppInventory(params, policy, inventory) {
	if (inventory.records.some((record) => record.activationRequired)) return false;
	return shouldRefreshMissingAppInventory(params, policy, inventory);
}
function shouldRefreshMissingAppInventory(params, policy, inventory) {
	return Boolean(params.appCacheKey && policy.pluginPolicies.some((plugin) => plugin.enabled) && inventory.appInventory?.state === "missing");
}
function emptyCodexPluginInventory(policy) {
	return {
		policy,
		records: [],
		diagnostics: []
	};
}
function policyFingerprint(policy) {
	return {
		enabled: policy.enabled,
		allowAllPlugins: policy.allowAllPlugins,
		allowDestructiveActions: policy.allowDestructiveActions,
		destructiveApprovalMode: policy.destructiveApprovalMode,
		plugins: policy.pluginPolicies.map((plugin) => ({
			configKey: plugin.configKey,
			marketplaceName: plugin.marketplaceName,
			pluginName: plugin.pluginName,
			enabled: plugin.enabled,
			allowDestructiveActions: plugin.allowDestructiveActions,
			destructiveApprovalMode: plugin.destructiveApprovalMode
		}))
	};
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
function fingerprintJson(value) {
	return crypto.createHash("sha256").update(stringifyCodexPluginPolicy(value)).digest("hex");
}
function stringifyCodexPluginPolicy(value) {
	if (Array.isArray(value)) return `[${value.map((item) => stringifyCodexPluginPolicy(item)).join(",")}]`;
	if (value && typeof value === "object") return `{${Object.entries(value).toSorted(([left], [right]) => left.localeCompare(right)).map(([key, item]) => `${JSON.stringify(key)}:${stringifyCodexPluginPolicy(item)}`).join(",")}}`;
	return JSON.stringify(value);
}
//#endregion
//#region extensions/codex/src/app-server/dynamic-tool-profile.ts
/** Tool names owned by Codex app-server and normally excluded from OpenClaw dynamic tools. */
const CODEX_APP_SERVER_OWNED_DYNAMIC_TOOL_EXCLUDES = [
	"read",
	"write",
	"edit",
	"apply_patch",
	"exec",
	"process",
	"update_plan",
	"tool_call",
	"tool_describe",
	"tool_search",
	"tool_search_code"
];
const CODEX_NATIVE_GOAL_TOOL_EXCLUDES = [
	"get_goal",
	"create_goal",
	"update_goal"
];
const CODEX_APP_SERVER_OWNED_REPLACEABLE_TOOL_EXCLUDES = /* @__PURE__ */ new Set([
	"read",
	"write",
	"edit",
	"apply_patch",
	...CODEX_NATIVE_GOAL_TOOL_EXCLUDES
]);
const CODEX_APP_SERVER_OWNED_SHELL_TOOL_EXCLUDES = /* @__PURE__ */ new Set(["exec", "process"]);
const DYNAMIC_TOOL_NAME_ALIASES = {
	bash: "exec",
	"apply-patch": "apply_patch"
};
/** Normalizes OpenClaw/Codex tool names before filtering and allowlist checks. */
function normalizeCodexDynamicToolName(name) {
	const normalized = name.trim().toLowerCase();
	return DYNAMIC_TOOL_NAME_ALIASES[normalized] ?? normalized;
}
/** True only for the host-scoped OpenClaw run's exact tool contract. */
function isSystemAgentOnlyCodexDynamicToolAllowlist(toolsAllow) {
	return toolsAllow?.length === 1 && normalizeCodexDynamicToolName(toolsAllow[0] ?? "") === "openclaw";
}
/** True when a private source reply may use the message delivery tool only. */
function isMessageOnlyCodexSourceReply(params) {
	return params.sourceReplyDeliveryMode === "message_tool_only" && params.toolsAllow?.length === 1 && normalizeCodexDynamicToolName(params.toolsAllow[0] ?? "") === "message";
}
/** Returns true for private QA runs that force the Codex runtime profile. */
function isForcedPrivateQaCodexRuntime(env = process.env) {
	return env.OPENCLAW_BUILD_PRIVATE_QA === "1" && env.OPENCLAW_QA_FORCE_RUNTIME?.trim().toLowerCase() === "codex";
}
/** Resolves whether dynamic tools load directly or through Codex tool search. */
function resolveCodexDynamicToolsLoading(config, env = process.env) {
	return isForcedPrivateQaCodexRuntime(env) ? "direct" : config.codexDynamicToolsLoading ?? "searchable";
}
function normalizeCodexModelId(modelId) {
	const normalized = modelId?.trim().toLowerCase();
	if (!normalized) return "";
	return normalized.includes("/") ? normalized.split("/").at(-1) : normalized;
}
/** Returns true when model behavior requires direct dynamic-tool registration. */
function shouldUseDirectCodexDynamicToolsForModel(modelId) {
	return shouldDisableCodexToolSearchForModel(modelId);
}
/** Returns true for models whose tool-search path is unsupported or inefficient. */
function shouldDisableCodexToolSearchForModel(modelId) {
	return normalizeCodexModelId(modelId) === "gpt-5.4-nano";
}
/** Resolves dynamic-tool loading after applying model-specific restrictions. */
function resolveCodexDynamicToolsLoadingForModel(config, modelId, env = process.env) {
	const loading = resolveCodexDynamicToolsLoading(config, env);
	return loading === "searchable" && shouldUseDirectCodexDynamicToolsForModel(modelId) ? "direct" : loading;
}
/** Resolves dynamic-tool loading for the app-server connection that will execute the turn. */
function resolveCodexDynamicToolsLoadingForRuntime(config, modelId, options = {}, env = process.env) {
	const loading = resolveCodexDynamicToolsLoadingForModel(config, modelId, env);
	return loading === "searchable" && options.connectionClass === "remote" ? "direct" : loading;
}
/** Filters OpenClaw tools that Codex owns natively or config explicitly excludes. */
function filterCodexDynamicTools(tools, config, env = process.env) {
	return filterCodexDynamicToolsWithOptions(tools, config, env, {
		preserveOpenClawReplacements: false,
		preserveOpenClawShell: false
	});
}
/** Keeps OpenClaw coding tools that replace a disabled Codex native surface. */
function filterCodexDynamicToolsForDisabledNativeSurface(tools, config, options, env = process.env) {
	return filterCodexDynamicToolsWithOptions(tools, config, env, {
		preserveOpenClawReplacements: true,
		preserveOpenClawShell: options.preserveShell
	});
}
function filterCodexDynamicToolsWithOptions(tools, config, env, options) {
	const excludes = /* @__PURE__ */ new Set();
	if (!options.preserveOpenClawReplacements) for (const name of CODEX_NATIVE_GOAL_TOOL_EXCLUDES) excludes.add(name);
	if (isForcedPrivateQaCodexRuntime(env)) excludes.add("apply_patch");
	else for (const name of CODEX_APP_SERVER_OWNED_DYNAMIC_TOOL_EXCLUDES) {
		if (options.preserveOpenClawReplacements && CODEX_APP_SERVER_OWNED_REPLACEABLE_TOOL_EXCLUDES.has(name)) continue;
		if (options.preserveOpenClawShell && CODEX_APP_SERVER_OWNED_SHELL_TOOL_EXCLUDES.has(name)) continue;
		excludes.add(name);
	}
	for (const name of config.codexDynamicToolsExclude ?? []) {
		const trimmed = normalizeCodexDynamicToolName(name);
		if (trimmed) excludes.add(trimmed);
	}
	return excludes.size === 0 ? tools : tools.filter((tool) => !excludes.has(normalizeCodexDynamicToolName(tool.name)));
}
//#endregion
//#region extensions/codex/src/app-server/thread-binding-policy.ts
function shouldRotateCodexAppServerBindingForRuntime(params) {
	if (!params.current) return false;
	if (params.binding === params.current) return false;
	return params.connectionClass === "remote" || Boolean(params.binding);
}
function resolveCodexGpt56MultiAgentVersion(modelRef) {
	let modelId = modelRef?.trim().toLowerCase();
	if (!modelId) return;
	const slashIndex = modelId.indexOf("/");
	if (slashIndex > 0) {
		const provider = modelId.slice(0, slashIndex);
		if (provider !== "openai" && provider !== "codex") return;
		modelId = modelId.slice(slashIndex + 1);
	}
	if (modelId === "gpt-5.6-sol" || modelId === "gpt-5.6-terra") return "v2";
	return modelId === "gpt-5.6-luna" ? "v1" : void 0;
}
function shouldRotateCodexGpt56MultiAgentBinding(params) {
	const bindingVersion = resolveCodexGpt56MultiAgentVersion(params.bindingModel);
	const requestedVersion = resolveCodexGpt56MultiAgentVersion(params.requestedModel);
	return Boolean(bindingVersion && requestedVersion && bindingVersion !== requestedVersion);
}
function isTransientWebSearchRestriction(params) {
	if (params.nativeProviderWebSearchSupport === "unknown") return true;
	if (params.params.config?.tools?.web?.search?.enabled === false) return false;
	if (params.params.disableTools === true) return true;
	const persistentWebSearchRestriction = params.webSearchAllowed === false && params.persistentWebSearchAllowed === false;
	if (params.nativeCodeModeEnabled === false && !persistentWebSearchRestriction) return true;
	if (params.webSearchAllowed !== false) return false;
	if (params.persistentWebSearchAllowed !== void 0) return params.persistentWebSearchAllowed;
	if (params.params.toolsAllow === void 0) return false;
	return !params.params.toolsAllow.some((name) => {
		const normalized = normalizeCodexDynamicToolName(name);
		return normalized === "*" || normalized === "web_search";
	});
}
function shouldRecheckRecoverablePluginBinding(params) {
	if (!params.pluginThreadConfig?.enabled) return false;
	if (!params.binding.pluginAppsFingerprint || !params.binding.pluginAppsInputFingerprint || params.binding.pluginAppsInputFingerprint !== params.pluginThreadConfig.inputFingerprint) return false;
	const policyContext = params.binding.pluginAppPolicyContext;
	if (!policyContext) return false;
	const enabledPluginConfigKeys = params.pluginThreadConfig.enabledPluginConfigKeys ?? [];
	const recoverablePluginConfigKeys = params.pluginThreadConfig.recoverablePluginConfigKeys ?? enabledPluginConfigKeys;
	const recoverablePluginConfigKeySet = new Set(recoverablePluginConfigKeys);
	const bindingContainsSettledPlugin = enabledPluginConfigKeys.filter((configKey) => !recoverablePluginConfigKeySet.has(configKey)).some((configKey) => (policyContext.pluginAppIds[configKey]?.length ?? 0) > 0 || Object.values(policyContext.apps).some((app) => app.source !== "account" && app.configKey === configKey));
	const accountAppRecoveryEnabled = params.pluginThreadConfig.accountAppRecoveryEnabled ?? enabledPluginConfigKeys.length === 0;
	return bindingContainsSettledPlugin || accountAppRecoveryEnabled && Object.keys(policyContext.apps).length === 0 || recoverablePluginConfigKeys.length > 0;
}
//#endregion
//#region extensions/codex/src/app-server/thread-fingerprints.ts
function codexDynamicToolsFingerprint(dynamicTools) {
	return hashCodexAppServerBindingFingerprint(legacyFingerprintDynamicTools(dynamicTools));
}
function codexLegacyDynamicToolsFingerprint(dynamicTools) {
	return legacyFingerprintDynamicTools(dynamicTools);
}
function areCodexDynamicToolFingerprintsCompatible(params) {
	return areDynamicToolFingerprintsCompatible(params.previous, params.next, params.nextLegacy);
}
function legacyFingerprintDynamicTools(dynamicTools) {
	return JSON.stringify(dynamicTools.map(stabilizeJsonValue).toSorted(compareJsonFingerprint));
}
function legacyFingerprintUserMcpServersConfigPatch(configPatch) {
	return configPatch ? JSON.stringify(stabilizeJsonValue(configPatch)) : void 0;
}
function fingerprintUserMcpServersConfigPatch(configPatch) {
	return configPatch ? hashCodexAppServerBindingFingerprint(JSON.stringify(stabilizeJsonValue(redactUserMcpServersFingerprintSecrets(configPatch)))) : void 0;
}
function redactUserMcpServersFingerprintSecrets(value) {
	if (Array.isArray(value)) return value.map(redactUserMcpServersFingerprintSecrets);
	if (!value || typeof value !== "object") return value;
	return Object.fromEntries(Object.entries(value).map(([key, entry]) => {
		if (key === "http_headers" && entry && typeof entry === "object" && !Array.isArray(entry)) return [key, Object.fromEntries(Object.entries(entry).map(([header, headerValue]) => [header, header.toLowerCase() === "authorization" ? fingerprintUserMcpServersAuthorizationHeader(headerValue) : headerValue]))];
		return [key, redactUserMcpServersFingerprintSecrets(entry)];
	}));
}
function fingerprintUserMcpServersAuthorizationHeader(value) {
	return typeof value === "string" && value.length > 0 ? `<redacted:sha256:${crypto$1.createHash("sha256").update(value).digest("hex")}>` : "<redacted>";
}
function fingerprintJsonObject(value) {
	return JSON.stringify(stabilizeJsonValue(value));
}
/** Hash thread-creation identity; settings already applied by turn/start must not restart Codex. */
function fingerprintCodexThreadConfig(request, authProfileId, dynamicToolsFingerprint) {
	return hashCodexAppServerBindingFingerprint(fingerprintJsonObject({
		authProfileId: authProfileId ?? null,
		dynamicToolsFingerprint: dynamicToolsFingerprint ?? null,
		nativeMultiAgentVersion: resolveCodexGpt56MultiAgentVersion(typeof request.requestedModel === "string" ? request.requestedModel : typeof request.model === "string" ? request.model : void 0) ?? null,
		modelProvider: request.modelProvider ?? null,
		requestedModelProvider: request.requestedModelProvider === void 0 ? request.modelProvider ?? null : request.requestedModelProvider,
		permissions: request.permissions ?? null,
		baseInstructions: request.baseInstructions ?? null,
		developerInstructions: request.developerInstructions ?? null,
		config: request.config ?? {}
	}));
}
function fingerprintEnvironmentSelection(environments) {
	return environments ? JSON.stringify(environments.map(stabilizeJsonValue)) : void 0;
}
function stabilizeJsonValue(value) {
	if (Array.isArray(value)) return value.map(stabilizeJsonValue);
	if (!isJsonObject(value)) return value;
	return Object.fromEntries(Object.entries(value).toSorted(([left], [right]) => left.localeCompare(right)).map(([key, child]) => [key, stabilizeJsonValue(child)]));
}
function readActiveCodexTurnIds(thread) {
	return (thread.turns ?? []).filter((turn) => turn.status === "inProgress").map((turn) => typeof turn.id === "string" ? turn.id : "").filter((turnId) => turnId.trim().length > 0);
}
function readActiveCodexTurnIdsFromResume(response) {
	const pagedTurns = response.initialTurnsPage?.data;
	return readActiveCodexTurnIds(Array.isArray(pagedTurns) ? { turns: pagedTurns } : response.thread);
}
const LEGACY_EMPTY_DYNAMIC_TOOLS_FINGERPRINT = legacyFingerprintDynamicTools([]);
const EMPTY_DYNAMIC_TOOLS_FINGERPRINT = hashCodexAppServerBindingFingerprint(LEGACY_EMPTY_DYNAMIC_TOOLS_FINGERPRINT);
function areDynamicToolFingerprintsCompatible(previous, next, nextLegacy) {
	return !previous || previous === next || previous === nextLegacy;
}
function areUserMcpServersFingerprintsCompatible(params) {
	return params.previous === params.next || params.previous === params.nextLegacy || params.nextLegacy !== void 0 && params.previous === hashCodexAppServerBindingFingerprint(params.nextLegacy);
}
function shouldStartTransientNoToolThread(params) {
	return Boolean(params.previous && !isEmptyDynamicToolsFingerprint(params.previous) && !params.nextHasDynamicTools);
}
function isEmptyDynamicToolsFingerprint(fingerprint) {
	return fingerprint === EMPTY_DYNAMIC_TOOLS_FINGERPRINT || fingerprint === LEGACY_EMPTY_DYNAMIC_TOOLS_FINGERPRINT;
}
function compareJsonFingerprint(left, right) {
	return JSON.stringify(left).localeCompare(JSON.stringify(right));
}
//#endregion
//#region extensions/codex/src/app-server/native-skill-isolation.ts
const MAX_PERSONAL_SKILL_DIRECTORIES = 2e3;
const MAX_PERSONAL_SKILL_DEPTH = 6;
const MAX_PERSONAL_SKILL_ENTRIES = 1e4;
const nativeSkillIsolationByClient = /* @__PURE__ */ new WeakMap();
function isMissingPathError(error) {
	return error.code === "ENOENT";
}
async function canonicalizeExistingPath(candidate) {
	try {
		return await fs.realpath(candidate);
	} catch {
		return path.resolve(candidate);
	}
}
async function usesDefaultStateDir() {
	if (!process.env.OPENCLAW_STATE_DIR?.trim()) return true;
	const home = resolveRequiredHomeDir();
	const [stateDir, defaultStateDir] = await Promise.all([canonicalizeExistingPath(resolveStateDir()), canonicalizeExistingPath(path.join(home, ".openclaw"))]);
	return stateDir === defaultStateDir;
}
async function collectPersonalSkillRealPaths(homes, codexHome) {
	const realStateDir = await canonicalizeExistingPath(resolveStateDir());
	const roots = [];
	for (const home of homes) {
		for (const dir of [".agents", ".claude"]) roots.push({
			dir: path.join(home, dir, "skills"),
			onlyEscapedStateTargets: false
		});
		const defaultCodexHome = path.join(home, ".codex");
		const realDefaultCodexHome = await canonicalizeExistingPath(defaultCodexHome);
		roots.push({
			dir: path.join(defaultCodexHome, "skills"),
			onlyEscapedStateTargets: isPathInside(realStateDir, realDefaultCodexHome)
		});
	}
	const configuredCodexHome = codexHome?.trim() || process.env.CODEX_HOME?.trim();
	if (configuredCodexHome) {
		const realCodexHome = await canonicalizeExistingPath(configuredCodexHome);
		const stateOwned = isPathInside(realStateDir, realCodexHome);
		roots.push({
			dir: path.join(configuredCodexHome, "skills"),
			onlyEscapedStateTargets: stateOwned
		});
	}
	const skillPaths = /* @__PURE__ */ new Set();
	let complete = true;
	const seenDirectories = /* @__PURE__ */ new Set();
	const queue = roots.map((root) => ({
		dir: root.dir,
		onlyEscapedStateTargets: root.onlyEscapedStateTargets,
		depth: 0
	}));
	let entryCount = 0;
	const recordSkillFile = async (filePath, onlyEscapedStateTargets) => {
		try {
			const skillRealPath = await fs.realpath(filePath);
			if (!onlyEscapedStateTargets || !isPathInside(realStateDir, skillRealPath)) skillPaths.add(skillRealPath);
		} catch (error) {
			if (!isMissingPathError(error)) complete = false;
		}
	};
	for (const current of queue) {
		let realDir;
		try {
			realDir = await fs.realpath(current.dir);
		} catch (error) {
			if (isMissingPathError(error)) continue;
			complete = false;
			continue;
		}
		if (seenDirectories.has(realDir)) continue;
		seenDirectories.add(realDir);
		if (seenDirectories.size > MAX_PERSONAL_SKILL_DIRECTORIES) {
			complete = false;
			break;
		}
		let directory;
		try {
			directory = await fs.opendir(current.dir);
		} catch (error) {
			if (!isMissingPathError(error)) complete = false;
			continue;
		}
		try {
			for await (const entry of directory) {
				entryCount += 1;
				if (entryCount > MAX_PERSONAL_SKILL_ENTRIES) {
					complete = false;
					queue.length = 0;
					break;
				}
				if (entry.name.startsWith(".")) continue;
				const entryPath = path.join(current.dir, entry.name);
				if (entry.name === "SKILL.md" && entry.isFile()) {
					await recordSkillFile(entryPath, current.onlyEscapedStateTargets);
					continue;
				}
				if (entry.isSymbolicLink()) {
					try {
						const stat = await fs.stat(entryPath);
						if (entry.name === "SKILL.md" && stat.isFile()) await recordSkillFile(entryPath, current.onlyEscapedStateTargets);
						else if (stat.isDirectory()) {
							if (current.depth < MAX_PERSONAL_SKILL_DEPTH) queue.push({
								dir: entryPath,
								depth: current.depth + 1,
								onlyEscapedStateTargets: current.onlyEscapedStateTargets
							});
							else complete = false;
						}
					} catch (error) {
						if (!isMissingPathError(error)) complete = false;
					}
					continue;
				}
				if (current.depth >= MAX_PERSONAL_SKILL_DEPTH) {
					if (entry.isDirectory()) complete = false;
					continue;
				}
				if (entry.isDirectory()) {
					queue.push({
						dir: entryPath,
						depth: current.depth + 1,
						onlyEscapedStateTargets: current.onlyEscapedStateTargets
					});
					continue;
				}
			}
		} catch (error) {
			if (!isMissingPathError(error)) complete = false;
		}
	}
	return {
		complete,
		skillPaths
	};
}
/** Resolves the native user-scope skills that an isolated OpenClaw thread must disable. */
async function resolveCodexNativeSkillIsolation(params) {
	params.signal?.throwIfAborted();
	if (!process.env.OPENCLAW_STATE_DIR?.trim()) return;
	const key = JSON.stringify([
		path.resolve(resolveStateDir()),
		path.resolve(params.cwd),
		params.codexHome?.trim() || process.env.CODEX_HOME?.trim() || "",
		params.home?.trim() || process.env.HOME?.trim() || "",
		params.userProfile?.trim() || process.env.USERPROFILE?.trim() || ""
	]);
	let cache = nativeSkillIsolationByClient.get(params.client);
	if (!cache) {
		cache = { revision: 0 };
		nativeSkillIsolationByClient.set(params.client, cache);
		const clientCache = cache;
		params.client.addNotificationHandler((notification) => {
			if (notification.method === "skills/changed") {
				clientCache.revision += 1;
				clientCache.snapshot = void 0;
			}
		});
	}
	for (;;) {
		params.signal?.throwIfAborted();
		let snapshot = cache.snapshot;
		if (snapshot?.key !== key || !snapshot.settled && snapshot.signal !== params.signal) {
			snapshot = {
				key,
				revision: cache.revision,
				result: resolveUncachedCodexNativeSkillIsolation(params),
				settled: false,
				signal: params.signal
			};
			cache.snapshot = snapshot;
		}
		try {
			const isolation = await snapshot.result;
			snapshot.settled = true;
			params.signal?.throwIfAborted();
			if (snapshot.revision === cache.revision) return isolation;
		} catch (error) {
			if (cache.snapshot === snapshot) cache.snapshot = void 0;
			throw error;
		}
	}
}
async function resolveUncachedCodexNativeSkillIsolation(params) {
	if (await usesDefaultStateDir()) return;
	const response = await params.client.request("skills/list", {
		cwds: [params.cwd],
		forceReload: true
	}, { signal: params.signal });
	const homes = [params.home?.trim() || process.env.HOME?.trim() || process.env.USERPROFILE?.trim() || os.homedir()];
	if (process.platform === "win32") homes.push(params.userProfile?.trim() || os.homedir());
	const personalSkills = await collectPersonalSkillRealPaths([...new Set(homes.map((home) => path.resolve(home)))], params.codexHome);
	return { disabledUserSkillPaths: [...personalSkills.complete ? personalSkills.skillPaths : /* @__PURE__ */ new Set([...personalSkills.skillPaths, ...response.data.flatMap((entry) => entry.skills.filter((skill) => skill.scope === "user").map((skill) => skill.path))])].toSorted((left, right) => left.localeCompare(right)) };
}
/** Applies path-exact session rules after caller config so isolated user skills stay disabled. */
function applyCodexNativeSkillIsolation(config, isolation) {
	if (!isolation) return config;
	const existingRules = config?.["skills.config"];
	if (existingRules !== void 0 && !Array.isArray(existingRules)) throw new Error("Codex thread skills.config must be an array");
	const disabledRules = isolation.disabledUserSkillPaths.map((skillPath) => ({
		path: skillPath,
		enabled: false
	}));
	return {
		...config,
		"skills.include_instructions": false,
		"skills.config": [...existingRules ?? [], ...disabledRules]
	};
}
//#endregion
//#region extensions/codex/src/app-server/native-tool-catalog.ts
function hasCodexNativeToolCatalog(binding) {
	return binding?.connectionScope === "supervision" && !binding.pendingSupervisionBranch;
}
/** Pinned serde omits empty catalogs and false deferLoading; declarations remain native-owned. */
function parseCodexNativeToolCatalog(metadata, threadId, fingerprint) {
	const fail = () => /* @__PURE__ */ new Error("The canonical Codex native tool catalog is missing, corrupt, or changed; the thread is preserved. Reconnect and inspect its native metadata before retrying.");
	if (!isJsonObject(metadata) || metadata.id !== threadId) throw fail();
	const catalog = metadata.dynamic_tools ?? [];
	if (!Array.isArray(catalog) || Buffer.byteLength(JSON.stringify(catalog)) > 1048576) throw fail();
	const names = /* @__PURE__ */ new Set();
	const namespaces = /* @__PURE__ */ new Set();
	const validName = (name) => typeof name === "string" && /^[a-zA-Z0-9_-]{1,128}$/u.test(name);
	const readFunction = (value) => {
		if (!isJsonObject(value) || value.type !== "function" || !validName(value.name) || typeof value.description !== "string" || !isJsonObject(value.inputSchema) || value.deferLoading !== void 0 && typeof value.deferLoading !== "boolean" || Object.keys(value).some((key) => ![
			"type",
			"name",
			"description",
			"inputSchema",
			"deferLoading"
		].includes(key)) || names.has(value.name) || names.size >= 2e3) throw fail();
		names.add(value.name);
		return {
			type: "function",
			name: value.name,
			description: value.description,
			inputSchema: structuredClone(value.inputSchema),
			...value.deferLoading === true ? { deferLoading: true } : {}
		};
	};
	const tools = catalog.map((value) => {
		if (!isJsonObject(value) || value.type !== "namespace") return readFunction(value);
		if (!validName(value.name) || namespaces.has(value.name) || typeof value.description !== "string" || !Array.isArray(value.tools) || !value.tools.length || Object.keys(value).some((key) => ![
			"type",
			"name",
			"description",
			"tools"
		].includes(key))) throw fail();
		namespaces.add(value.name);
		return {
			type: "namespace",
			name: value.name,
			description: value.description,
			tools: value.tools.map(readFunction)
		};
	});
	if (fingerprint !== void 0 && codexDynamicToolsFingerprint(tools) !== fingerprint) throw fail();
	return tools;
}
/** Existing supervised bindings identify data, never authorize an executor or a new adoption. */
async function loadCodexNativeToolCatalog(params) {
	const { binding, client, appServer, agentDir, assertCurrent } = params;
	assertCurrent();
	const home = resolveCodexAppServerLocalHomeDir(appServer.start, agentDir);
	const actualHome = client.getRuntimeIdentity()?.codexHome;
	if (!hasCodexNativeToolCatalog(binding) || !binding.dynamicToolsFingerprint || appServer.start.transport !== "stdio" && appServer.start.transport !== "unix" || appServer.remoteWorkspaceRoot || !actualHome || path.resolve(actualHome) !== path.resolve(home) || binding.appServerRuntimeFingerprint !== buildCodexAppServerConnectionFingerprint(appServer, agentDir)) throw new Error("Canonical Codex declarations require the original verified local binding and selected native connection; the thread is preserved.");
	const metadata = await readCodexClientSessionMeta(client, path.join(home, "sessions"), binding.rolloutPath, binding.threadId);
	assertCurrent();
	return parseCodexNativeToolCatalog(metadata, binding.threadId, binding.dynamicToolsFingerprint);
}
//#endregion
//#region extensions/codex/src/app-server/thread-mcp-attestation.ts
async function attestCodexRestrictedToolSurfaceMcpServersDisabled(client, threadId, threadConfig, signal, expectedActiveServerNames = []) {
	const configuredServers = threadConfig?.mcp_servers;
	if (configuredServers !== void 0 && !isJsonObject(configuredServers)) throw new Error("Codex restricted-tool-surface thread config has invalid mcp_servers");
	const expectedServers = /* @__PURE__ */ new Map();
	for (const [name, serverConfig] of Object.entries(configuredServers ?? {})) {
		if (!isJsonObject(serverConfig) || serverConfig.enabled !== false) throw new Error(`Codex restricted-tool-surface MCP server ${name} is not disabled`);
		expectedServers.set(name, "disabled");
	}
	for (const name of expectedActiveServerNames) {
		if (expectedServers.get(name) === "disabled") throw new Error(`Codex restricted-tool-surface MCP server ${name} has conflicting policy`);
		expectedServers.set(name, "active");
	}
	const response = await client.request("mcpServerStatus/list", {
		threadId,
		detail: "toolsAndAuthOnly"
	}, { signal });
	if (!isJsonObject(response) || !Array.isArray(response.data)) throw new Error("Codex mcpServerStatus/list returned an invalid restricted-tool-surface attestation");
	const observedServerNames = /* @__PURE__ */ new Set();
	for (const status of response.data) {
		if (!isJsonObject(status) || typeof status.name !== "string" || !isJsonObject(status.tools)) throw new Error("Codex mcpServerStatus/list returned an invalid restricted-tool-surface server");
		if (!expectedServers.has(status.name)) throw new Error(`Codex restricted-tool-surface MCP attestation found unexpected server ${status.name}`);
		if (observedServerNames.has(status.name)) throw new Error(`Codex restricted-tool-surface MCP attestation returned duplicate server ${status.name}`);
		observedServerNames.add(status.name);
		if (!Object.hasOwn(status, "serverInfo")) throw new Error(`Codex restricted-tool-surface MCP attestation returned malformed server ${status.name}`);
		if (expectedServers.get(status.name) === "active") {
			if (status.serverInfo === null || Object.keys(status.tools).length === 0) throw new Error(`Codex restricted-tool-surface MCP attestation found inactive admitted server ${status.name}`);
			continue;
		}
		if (status.serverInfo !== null) throw new Error(`Codex restricted-tool-surface MCP attestation found active server ${status.name}`);
		if (Object.keys(status.tools).length > 0) throw new Error(`Codex restricted-tool-surface MCP attestation found tools for server ${status.name}`);
	}
	for (const [expectedName, state] of expectedServers) if (!observedServerNames.has(expectedName)) throw new Error(`Codex restricted-tool-surface MCP attestation is missing ${state === "active" ? "admitted " : ""}server ${expectedName}`);
	if (response.nextCursor !== void 0 && response.nextCursor !== null) throw new Error("Codex mcpServerStatus/list returned an invalid empty-page cursor");
}
//#endregion
//#region extensions/codex/src/app-server/plugin-thread-attestation.ts
/**
* Checks app availability and enforces restricted MCP surfaces before a turn.
*/
/** Every admission path checks the same surface; its lifecycle owner keeps the claim fenced. */
async function attestCodexThreadToolSurface(params) {
	params.assertCurrent();
	if (params.appIds.length > 0) {
		await params.lifecycleTiming.measure("plugin-app-attestation", () => checkCodexThreadAppAvailability(params));
		params.assertCurrent();
	}
	if (params.restrictedToolSurface) {
		await params.lifecycleTiming.measure("restricted-tool-surface-mcp-attestation", () => attestCodexRestrictedToolSurfaceMcpServersDisabled(params.client, params.threadId, params.threadConfig, params.signal, params.appIds.length > 0 ? ["codex_apps"] : []));
		params.assertCurrent();
	}
}
var CodexPluginThreadAppAttestationError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "CodexPluginThreadAppAttestationError";
	}
};
/** Reads the existing runtime snapshot with the started thread's effective app policy. */
async function checkCodexThreadAppAvailability(params) {
	const appIds = Array.from(new Set(params.appIds.filter(Boolean))).toSorted();
	if (appIds.length === 0) return;
	let response;
	try {
		response = await params.client.request("app/installed", {
			threadId: params.threadId,
			forceRefresh: false
		}, { signal: params.signal });
	} catch (error) {
		params.signal?.throwIfAborted();
		throw new CodexPluginThreadAppAttestationError(`Codex could not confirm admitted apps for thread ${params.threadId}`, { cause: error });
	}
	params.signal?.throwIfAborted();
	const installedById = new Map(response.apps.map((app) => [app.id, app]));
	const failures = appIds.flatMap((appId) => {
		const app = installedById.get(appId);
		if (!app) return [`${appId}:missing`];
		if (!app.enabled) return [`${appId}:disabled`];
		return app.callable ? [] : [`${appId}:not-callable`];
	});
	if (failures.length > 0) embeddedAgentLog.warn("codex apps unavailable; continuing with remaining tools", {
		threadId: params.threadId,
		failures
	});
}
/** Deletes a persistent pre-turn thread; ephemeral threads can only be unsubscribed. */
async function discardUnattestedCodexPluginThread(params) {
	if (params.ephemeral) return await unsubscribeCodexThreadBestEffort(params.client, {
		threadId: params.threadId,
		timeoutMs: CODEX_APP_SERVER_UNSUBSCRIBE_TIMEOUT_MS
	});
	try {
		await params.client.request("thread/delete", { threadId: params.threadId }, { timeoutMs: CODEX_APP_SERVER_UNSUBSCRIBE_TIMEOUT_MS });
		return true;
	} catch (error) {
		embeddedAgentLog.debug("codex plugin app attestation thread deletion failed", {
			threadId: params.threadId,
			error
		});
		await unsubscribeCodexThreadBestEffort(params.client, {
			threadId: params.threadId,
			timeoutMs: CODEX_APP_SERVER_UNSUBSCRIBE_TIMEOUT_MS
		});
		return false;
	}
}
//#endregion
//#region extensions/codex/src/app-server/native-hook-relay.ts
/**
* Bridges Codex native hook callbacks into OpenClaw's native hook relay so
* app-server tool events can still run OpenClaw policy and diagnostics.
*/
/** Codex hook events that can be registered through OpenClaw's native relay. */
const CODEX_NATIVE_HOOK_RELAY_EVENTS = [
	"pre_tool_use",
	"post_tool_use",
	"permission_request",
	"before_agent_finalize"
];
const CODEX_NATIVE_HOOK_RELAY_EVENTS_WITH_APP_SERVER_APPROVALS = CODEX_NATIVE_HOOK_RELAY_EVENTS.filter((event) => event !== "permission_request");
const CODEX_NATIVE_HOOK_RELAY_MIN_TTL_MS = 18e5;
/** Extra relay lifetime after the expected turn budget, preventing late hook drops. */
const CODEX_NATIVE_HOOK_RELAY_TTL_GRACE_MS = 3e5;
const CODEX_NATIVE_HOOK_RELAY_COMMAND_MIN_PARENT_MARGIN_MS = 250;
const CODEX_NATIVE_HOOK_RELAY_COMMAND_MAX_PARENT_MARGIN_MS = 1e3;
const CODEX_NATIVE_HOOK_RELAY_DEFAULT_TIMEOUT_SEC = 10;
const CODEX_NATIVE_HOOK_RELAY_UNREGISTER_GRACE_MS = 1e4;
const CODEX_NATIVE_HOOK_RELAY_UNREGISTER_EXTRA_GRACE_MS = 5e3;
const MAX_PENDING_DIRECT_CHILD_ADMISSIONS = 32;
const CODEX_HOOK_MATCHER_NAMES_BY_TOOL_ID = {
	exec: [
		"Bash",
		"exec",
		"exec_command"
	],
	apply_patch: [
		"apply_patch",
		"Write",
		"Edit"
	],
	spawn_agent: ["spawn_agent", "Agent"]
};
var CodexManagedHooksOnlyError = class extends Error {
	constructor() {
		super("Codex managed-only hooks disable the OpenClaw native hook relay; refusing unenforced execution");
		this.name = "CodexManagedHooksOnlyError";
	}
};
/** Enterprise managed-only policy silently drops the session-layer hooks that enforce OpenClaw. */
async function assertCodexNativeHookRelayAllowed(client, signal, timeoutMs) {
	const response = await client.request("configRequirements/read", void 0, {
		signal,
		...timeoutMs === void 0 ? {} : { timeoutMs }
	});
	if (!isJsonObject(response) || !Object.hasOwn(response, "requirements")) throw new Error("Codex configRequirements/read returned an invalid hook policy response");
	const requirements = response.requirements;
	if (requirements === null) return;
	if (!isJsonObject(requirements)) throw new Error("Codex configRequirements/read returned invalid hook policy requirements");
	const managedOnly = requirements.allowManagedHooksOnly;
	if (managedOnly !== void 0 && managedOnly !== null && typeof managedOnly !== "boolean") throw new Error("Codex configRequirements/read returned invalid managed-only hook policy");
	if (managedOnly === true) throw new CodexManagedHooksOnlyError();
}
/** Defers relay unregister so late native hook subprocesses can still resolve. */
function scheduleCodexNativeHookRelayUnregister(params) {
	let pending;
	const unregister = () => {
		if (!pending) return;
		const current = pending;
		pending = void 0;
		if (!nativeHookRelayUnregisterQueue.delete(current)) return;
		params.relay.unregister();
		nativeHookRelayUnregisterQueue.track(params.relay.drain());
	};
	const timeout = setTimeout(unregister, resolveCodexNativeHookRelayUnregisterGraceMs(params.hookTimeoutSec));
	pending = {
		timeout,
		unregister
	};
	nativeHookRelayUnregisterQueue.add(pending);
	timeout.unref();
}
/** Computes the delayed unregister window from Codex's hook timeout. */
function resolveCodexNativeHookRelayUnregisterGraceMs(hookTimeoutSec) {
	const hookTimeoutMs = finiteSecondsToTimerSafeMilliseconds(normalizeHookTimeoutSec(hookTimeoutSec)) ?? 0;
	return Math.max(CODEX_NATIVE_HOOK_RELAY_UNREGISTER_GRACE_MS, addTimerTimeoutGraceMs(hookTimeoutMs, CODEX_NATIVE_HOOK_RELAY_UNREGISTER_EXTRA_GRACE_MS) ?? 0);
}
/** Records a native pre-tool failure that Codex does not project as a tool item. */
function emitCodexNativePreToolUseFailureDiagnostic(params) {
	emitTrustedDiagnosticEvent({
		type: "tool.execution.error",
		...params.agentId ? { agentId: params.agentId } : {},
		sessionId: params.sessionId,
		...params.sessionKey ? { sessionKey: params.sessionKey } : {},
		runId: params.runId,
		toolName: params.failure.toolName,
		toolCallId: params.failure.toolCallId,
		durationMs: params.failure.durationMs,
		errorCategory: "before_tool_call",
		terminalReason: params.terminalReason ?? (params.signal?.aborted ? resolveCodexToolAbortTerminalReason(params.signal) : params.failure.disposition),
		...params.sourceTimestampMs !== void 0 ? { sourceTimestampMs: params.sourceTimestampMs } : {}
	});
}
/** Registers an OpenClaw native hook relay for a Codex app-server turn. */
function createCodexNativeHookRelay(params) {
	if (params.options?.enabled === false) return;
	const directChildClaims = /* @__PURE__ */ new Map();
	const pendingDirectChildAdmissions = /* @__PURE__ */ new Map();
	let foregroundClosed = false;
	let successfulYieldRetentionAuthorized = false;
	const assertClaim = (threadId, claim) => () => directChildClaims.get(threadId) === claim;
	const rejectPendingAdmissions = (reason) => {
		for (const pending of pendingDirectChildAdmissions.values()) pending.reject(new Error(reason));
		pendingDirectChildAdmissions.clear();
	};
	let releaseProcessAdmission;
	let processAdmissionDisposed = false;
	const relay = registerNativeHookRelayForBundledRuntime({
		provider: "codex",
		relayId: buildCodexNativeHookRelayId({
			agentId: params.agentId,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey
		}),
		...params.generation ? { generation: params.generation } : {},
		...params.generationMismatchGraceMs ? { generationMismatchGraceMs: params.generationMismatchGraceMs } : {},
		...params.agentId ? { agentId: params.agentId } : {},
		sessionId: params.sessionId,
		...params.sessionKey ? { sessionKey: params.sessionKey } : {},
		...params.config ? { config: params.config } : {},
		autoApproveMcpTools: params.autoApproveMcpTools,
		projectedMcpServers: params.projectedMcpServers,
		runId: params.runId,
		...params.channelId ? { channelId: params.channelId } : {},
		...params.requester ? { requester: params.requester } : {},
		...params.approvalContext ? { approvalContext: params.approvalContext } : {},
		allowedEvents: params.events,
		preToolUseLoopDetection: params.loopDetectionPreToolUseRelay,
		ttlMs: resolveCodexNativeHookRelayTtlMs({
			explicitTtlMs: params.options?.ttlMs,
			attemptTimeoutMs: params.attemptTimeoutMs,
			startupTimeoutMs: params.startupTimeoutMs,
			turnStartTimeoutMs: params.turnStartTimeoutMs
		}),
		signal: params.signal,
		runBeforeToolCall: params.hostCapabilities.runBeforeToolCall,
		executionAdmission: params.nativeProcessAuthority ? {
			toolNames: ["exec"],
			admit: (invocation, assertAdmissionCurrent) => {
				const payload = invocation.rawPayload;
				const rootThreadId = isJsonObject(payload) && typeof payload.session_id === "string" ? payload.session_id.trim() : void 0;
				const childThreadId = readCodexNativeChildThreadId(payload);
				const threadId = childThreadId ?? rootThreadId;
				if (!threadId || !invocation.turnId || !invocation.toolUseId) throw new Error("Codex native process admission requires exact thread, turn, and tool identities");
				params.nativeProcessAuthority.owner.admit(params.nativeProcessAuthority.client(), {
					threadId,
					turnId: invocation.turnId,
					itemId: invocation.toolUseId
				}, assertAdmissionCurrent, childThreadId ? rootThreadId : void 0);
			}
		} : void 0,
		approvalHost: params.hostCapabilities,
		assertActive: () => {
			params.hostCapabilities.assertActive();
			params.assertCurrent?.();
		},
		retention: {
			readClaim: readCodexNativeChildThreadId,
			shouldRetainAfterForegroundClose: () => successfulYieldRetentionAuthorized && directChildClaims.size > 0,
			allowPreToolUse: (childThreadId) => directChildClaims.has(childThreadId),
			awaitForegroundAdmission: (childThreadId, signal) => {
				const existingClaim = directChildClaims.get(childThreadId);
				if (existingClaim) return Promise.resolve(assertClaim(childThreadId, existingClaim));
				if (foregroundClosed) return Promise.reject(/* @__PURE__ */ new Error("native hook relay foreground admission unavailable"));
				let pending = pendingDirectChildAdmissions.get(childThreadId);
				if (!pending) {
					if (pendingDirectChildAdmissions.size >= MAX_PENDING_DIRECT_CHILD_ADMISSIONS) return Promise.reject(/* @__PURE__ */ new Error("native hook relay foreground admission capacity reached"));
					pending = {
						...createDeferred(),
						waiters: 0
					};
					pendingDirectChildAdmissions.set(childThreadId, pending);
				}
				const admission = pending;
				admission.waiters++;
				let onAbort;
				return new Promise((resolve, reject) => {
					admission.promise.then(resolve, reject);
					onAbort = () => reject(toErrorObject(signal?.reason, "native hook relay admission aborted"));
					signal?.addEventListener("abort", onAbort, { once: true });
					if (signal?.aborted) onAbort();
				}).then((claim) => assertClaim(childThreadId, claim)).finally(() => {
					if (onAbort) signal?.removeEventListener("abort", onAbort);
					admission.waiters--;
					if (admission.waiters === 0 && pendingDirectChildAdmissions.get(childThreadId) === admission) pendingDirectChildAdmissions.delete(childThreadId);
				});
			},
			onDispose: () => {
				foregroundClosed = true;
				rejectPendingAdmissions("native hook relay registration closed");
				processAdmissionDisposed = true;
				releaseProcessAdmission?.();
			}
		},
		onPreToolUseFailure: params.onPreToolUseFailure,
		command: {
			nice: 10,
			timeoutMs: params.options?.gatewayTimeoutMs
		}
	});
	if (!processAdmissionDisposed) try {
		releaseProcessAdmission = params.nativeProcessAuthority?.owner.retainAdmission();
	} catch (error) {
		relay.unregister();
		throw error;
	}
	const unregister = () => {
		foregroundClosed = true;
		rejectPendingAdmissions("native hook relay foreground closed");
		relay.unregister();
	};
	return {
		...relay,
		unregister,
		authorizeRetentionAfterSuccessfulYield: () => {
			successfulYieldRetentionAuthorized = true;
		},
		hasClaimedDirectChild: () => directChildClaims.size > 0,
		rejectPendingDirectChild: (threadIdInput, reason) => {
			const threadId = threadIdInput.trim();
			const pending = threadId ? pendingDirectChildAdmissions.get(threadId) : void 0;
			if (!pending) return;
			pendingDirectChildAdmissions.delete(threadId);
			pending.reject(new Error(reason));
		},
		claimDirectChild: (threadIdInput) => {
			const threadId = threadIdInput.trim();
			if (!threadId) return () => void 0;
			if (directChildClaims.get(threadId)) return () => void 0;
			const claim = Symbol(threadId);
			directChildClaims.set(threadId, claim);
			const pending = pendingDirectChildAdmissions.get(threadId);
			pendingDirectChildAdmissions.delete(threadId);
			pending?.resolve(claim);
			let released = false;
			return () => {
				if (released) return;
				released = true;
				if (directChildClaims.get(threadId) !== claim) return;
				directChildClaims.delete(threadId);
				if (foregroundClosed && directChildClaims.size === 0) {
					relay.unregister();
					nativeHookRelayUnregisterQueue.track(relay.drain());
				}
			};
		}
	};
}
function readCodexNativeChildThreadId(rawPayload) {
	if (!isJsonObject(rawPayload) || typeof rawPayload.agent_id !== "string") return;
	return rawPayload.agent_id.trim() || void 0;
}
/** Selects the native hook events Codex should install for the current approval mode. */
function resolveCodexNativeHookRelayEvents(params) {
	if (params.configuredEvents?.length) return params.configuredEvents;
	return params.appServer.approvalPolicy === "never" ? CODEX_NATIVE_HOOK_RELAY_EVENTS : CODEX_NATIVE_HOOK_RELAY_EVENTS_WITH_APP_SERVER_APPROVALS;
}
/** Derives the native hook relay TTL from the turn budget unless explicitly configured. */
function resolveCodexNativeHookRelayTtlMs(params) {
	if (params.explicitTtlMs !== void 0) return params.explicitTtlMs;
	const relayBudgetMs = params.attemptTimeoutMs + params.startupTimeoutMs + params.turnStartTimeoutMs + CODEX_NATIVE_HOOK_RELAY_TTL_GRACE_MS;
	return Math.max(CODEX_NATIVE_HOOK_RELAY_MIN_TTL_MS, Math.floor(relayBudgetMs));
}
/** Builds a stable relay id scoped to the agent and session identity. */
function buildCodexNativeHookRelayId(params) {
	const hash = createHash("sha256");
	hash.update("openclaw:codex:native-hook-relay:v1");
	hash.update("\0");
	hash.update(params.agentId?.trim() || "");
	hash.update("\0");
	hash.update(params.sessionKey?.trim() || params.sessionId);
	return `codex-${hash.digest("hex").slice(0, 40)}`;
}
const CODEX_HOOK_EVENT_BY_NATIVE_EVENT = {
	pre_tool_use: "PreToolUse",
	post_tool_use: "PostToolUse",
	permission_request: "PermissionRequest",
	before_agent_finalize: "Stop"
};
const CODEX_HOOK_KEY_LABEL_BY_NATIVE_EVENT = {
	pre_tool_use: "pre_tool_use",
	post_tool_use: "post_tool_use",
	permission_request: "permission_request",
	before_agent_finalize: "stop"
};
const CODEX_SESSION_FLAGS_HOOK_SOURCE_PATHS = ["/<session-flags>/config.toml", "<session-flags>/config.toml"];
/** Builds the Codex config overlay that installs trusted command hooks for relay events. */
function buildCodexNativeHookRelayConfig(params) {
	const events = params.events?.length ? params.events : CODEX_NATIVE_HOOK_RELAY_EVENTS;
	const selectedEvents = new Set(events);
	const config = { "features.hooks": true };
	const hookState = {};
	for (const event of CODEX_NATIVE_HOOK_RELAY_EVENTS) {
		const codexEvent = CODEX_HOOK_EVENT_BY_NATIVE_EVENT[event];
		const selected = selectedEvents.has(event);
		const shouldRelay = params.relay.shouldRelayEvent(event);
		if (!selected || !shouldRelay) {
			if (selected || params.clearOmittedEvents) config[`hooks.${codexEvent}`] = [];
			if (params.clearOmittedEvents) for (const sourcePath of CODEX_SESSION_FLAGS_HOOK_SOURCE_PATHS) hookState[`${sourcePath}:${CODEX_HOOK_KEY_LABEL_BY_NATIVE_EVENT[event]}:0:0`] = { enabled: false };
			continue;
		}
		const timeout = normalizeHookTimeoutSec(params.hookTimeoutSec);
		const command = params.relay.commandForEvent(event, { timeoutMs: resolveCodexNativeHookRelayCommandTimeoutMs(timeout) });
		const matcher = buildCodexNativeToolMatcher(params.relay.toolMatcherForEvent(event));
		config[`hooks.${codexEvent}`] = [{
			...matcher ? { matcher } : {},
			hooks: [{
				type: "command",
				command,
				timeout,
				async: false,
				statusMessage: "OpenClaw native hook relay"
			}]
		}];
		const state = {
			enabled: true,
			trusted_hash: codexCommandHookTrustedHash({
				event,
				command,
				matcher,
				timeout,
				statusMessage: "OpenClaw native hook relay"
			})
		};
		for (const sourcePath of CODEX_SESSION_FLAGS_HOOK_SOURCE_PATHS) hookState[`${sourcePath}:${CODEX_HOOK_KEY_LABEL_BY_NATIVE_EVENT[event]}:0:0`] = state;
	}
	config["hooks.state"] = hookState;
	return config;
}
/** Builds a Codex config overlay that disables native hooks and clears hook arrays. */
function buildCodexNativeHookRelayDisabledConfig() {
	return {
		"features.hooks": false,
		"hooks.PreToolUse": [],
		"hooks.PostToolUse": [],
		"hooks.PermissionRequest": [],
		"hooks.Stop": []
	};
}
function normalizeHookTimeoutSec(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.ceil(value) : CODEX_NATIVE_HOOK_RELAY_DEFAULT_TIMEOUT_SEC;
}
function resolveCodexNativeHookRelayCommandTimeoutMs(hookTimeoutSec) {
	const parentTimeoutMs = finiteSecondsToTimerSafeMilliseconds(normalizeHookTimeoutSec(hookTimeoutSec)) ?? 5e3;
	const parentMarginMs = Math.min(CODEX_NATIVE_HOOK_RELAY_COMMAND_MAX_PARENT_MARGIN_MS, Math.max(CODEX_NATIVE_HOOK_RELAY_COMMAND_MIN_PARENT_MARGIN_MS, Math.floor(parentTimeoutMs / 5)));
	return Math.max(1, parentTimeoutMs - parentMarginMs);
}
function buildCodexNativeToolMatcher(toolNames) {
	if (toolNames === void 0) return;
	if (toolNames.length === 0) throw new TypeError("Codex native hook matcher requires at least one tool name");
	const nativeNames = /* @__PURE__ */ new Set();
	let hasCustomToolName = false;
	for (const toolName of toolNames) {
		const canonicalToolName = toolName.trim();
		if (!canonicalToolName || canonicalToolName === "*") throw new TypeError("Codex native hook matcher requires canonical OpenClaw tool ids");
		const nativeAliases = CODEX_HOOK_MATCHER_NAMES_BY_TOOL_ID[canonicalToolName];
		if (!nativeAliases) hasCustomToolName = true;
		for (const nativeName of nativeAliases ?? [canonicalToolName]) nativeNames.add(nativeName);
	}
	const sortedNames = Array.from(nativeNames).toSorted();
	if (!hasCustomToolName && sortedNames.every((toolName) => /^[A-Za-z0-9_]+$/.test(toolName))) return sortedNames.join("|");
	return `(?i)^(?:${sortedNames.map((toolName) => toolName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})$`;
}
function codexCommandHookTrustedHash(params) {
	const identity = {
		event_name: CODEX_HOOK_KEY_LABEL_BY_NATIVE_EVENT[params.event],
		...params.matcher ? { matcher: params.matcher } : {},
		hooks: [{
			async: false,
			command: params.command,
			statusMessage: params.statusMessage,
			timeout: params.timeout,
			type: "command"
		}]
	};
	return `sha256:${createHash("sha256").update(JSON.stringify(sortJsonValue(identity))).digest("hex")}`;
}
function sortJsonValue(value) {
	if (!value || typeof value !== "object") return value;
	if (Array.isArray(value)) return value.map(sortJsonValue);
	const sorted = {};
	for (const [key, entry] of Object.entries(value).toSorted(([left], [right]) => left.localeCompare(right))) sorted[key] = sortJsonValue(entry);
	return sorted;
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
//#region extensions/codex/src/app-server/thread-model-selection.ts
const CODEX_NATIVE_PERSONALITY_NONE = "none";
function resolveCodexBindingModelProviderFallback(params) {
	const provider = params.provider?.trim().toLowerCase();
	if (provider && provider !== "codex") return;
	const currentModel = params.currentModel?.trim();
	const bindingModel = params.bindingModel?.trim();
	if (currentModel && bindingModel && currentModel === bindingModel && params.bindingModelProvider) return params.bindingModelProvider;
	return hasProviderQualifiedModelRef(currentModel) ? void 0 : params.bindingModelProvider;
}
function resolveCodexAppServerThreadModelSelection(params) {
	const authProfileId = params.authProfileId ?? params.binding?.authProfileId;
	const explicitModelProvider = resolveCodexAppServerModelProvider({
		provider: params.provider,
		authProfileId,
		authProfileStore: params.authProfileStore,
		agentDir: params.agentDir,
		config: params.config
	});
	const bindingModelProvider = params.binding?.threadId ? resolveCodexBindingModelProviderFallback({
		provider: params.provider,
		currentModel: params.model,
		bindingModel: params.binding.model,
		bindingModelProvider: params.binding.modelProvider
	}) : void 0;
	return resolveCodexAppServerRequestModelSelection({
		model: params.model,
		modelProvider: explicitModelProvider ?? bindingModelProvider,
		authProfileId,
		authProfileStore: params.authProfileStore,
		agentDir: params.agentDir,
		config: params.config
	});
}
function resolveCodexAppServerRequestModelSelection(params) {
	const model = params.model.trim();
	const modelProvider = params.modelProvider?.trim();
	if (modelProvider) return {
		model,
		modelProvider
	};
	const slashIndex = model.indexOf("/");
	if (slashIndex <= 0 || slashIndex >= model.length - 1) return { model };
	const inferredModelProvider = resolveCodexAppServerModelProvider({
		provider: model.slice(0, slashIndex),
		authProfileId: params.authProfileId,
		authProfileStore: params.authProfileStore,
		agentDir: params.agentDir,
		config: params.config
	});
	return {
		model: model.slice(slashIndex + 1).trim(),
		...inferredModelProvider ? { modelProvider: inferredModelProvider } : {}
	};
}
function hasProviderQualifiedModelRef(model) {
	const trimmed = model?.trim();
	const slashIndex = trimmed?.indexOf("/") ?? -1;
	return slashIndex > 0 && slashIndex < (trimmed?.length ?? 0) - 1;
}
function resolveCodexAppServerModelProvider(params) {
	const normalized = params.provider.trim();
	const normalizedLower = normalized.toLowerCase();
	if (!normalized || normalizedLower === "codex") return;
	if (isCodexAppServerNativeAuthProfile(params) && normalizedLower === "openai") return;
	return normalizedLower === "openai" ? "openai" : normalized;
}
//#endregion
//#region extensions/codex/src/app-server/thread-prompt.ts
function buildDeveloperInstructions(params, options = {}) {
	const deferredToolNames = /* @__PURE__ */ new Set();
	let screenToolName;
	let showWidgetToolName;
	let dashboardToolName;
	let portalToolName;
	let messageTool;
	let hasSkillWorkshop = false;
	let hasSessionsSpawn = false;
	let hasSessionsYield = false;
	let hasSubagentsList = false;
	let hasSessionsSend = false;
	let hasControlTools = false;
	let hasSeenDirectNamespace = false;
	for (const spec of options.dynamicTools ?? []) {
		const isDirectNamespace = spec.type === "namespace" && !hasSeenDirectNamespace && spec.name.trim() === "openclaw_direct";
		if (isDirectNamespace) hasSeenDirectNamespace = true;
		for (const tool of spec.type === "namespace" ? spec.tools : [spec]) {
			const name = tool.name.trim();
			const qualifiedName = spec.type === "namespace" ? `${spec.name}.${name}` : name;
			if (tool.deferLoading === true && name) deferredToolNames.add(name);
			if (name === "screen") screenToolName ??= qualifiedName;
			if (name === "show_widget") showWidgetToolName ??= qualifiedName;
			if (name === "dashboard") dashboardToolName ??= qualifiedName;
			if (name === "portal") portalToolName ??= qualifiedName;
			if (name === "message") messageTool ??= {
				name: qualifiedName,
				parameters: tool.inputSchema
			};
			hasSkillWorkshop ||= name === SKILL_WORKSHOP_TOOL_NAME;
			hasSessionsSpawn ||= name === "sessions_spawn";
			hasSessionsYield ||= isDirectNamespace && name === "sessions_yield";
			hasSubagentsList ||= name === "subagents";
			hasSessionsSend ||= name === "sessions_send";
			hasControlTools ||= name === "openclaw" || name === "gateway";
		}
	}
	const nativeCommandGuidance = listRegisteredPluginAgentPromptGuidance({
		surface: "codex_app_server",
		includeLegacyGlobalGuidance: false
	}).join("\n");
	const delegationGuidanceAvailable = params.disableTools !== true && params.delegationCapability !== "report_only" && !isMessageOnlyCodexSourceReply(params);
	const nativeDelegationAvailable = delegationGuidanceAvailable && !isSystemAgentOnlyCodexDynamicToolAllowlist(params.toolsAllow) && !shouldDisableCodexToolSearchForModel(params.modelId);
	const deferredToolDiscoveryGuidance = deferredToolNames.size > 0 || nativeDelegationAvailable ? "Deferred tools may be absent from the direct tool list. Use `tool_search` when directly callable. On code-mode-only models, use `exec` instead: filter `ALL_TOOLS` by name and description, then call the matching entry through `tools`." : void 0;
	return [
		"You are a personal agent running inside OpenClaw. OpenClaw has dynamic tools for OpenClaw-owned messaging, cron, sessions, media, gateway, and nodes.",
		deferredToolNames.size > 0 ? `Deferred searchable OpenClaw dynamic tools available: ${[...deferredToolNames].toSorted((left, right) => left.localeCompare(right)).join(", ")}.` : void 0,
		deferredToolDiscoveryGuidance,
		hasSkillWorkshop ? buildSkillWorkshopPromptSection().join("\n") : void 0,
		nativeDelegationAvailable ? `Use Codex native \`spawn_agent\` for Codex subagents. \`spawn_agent\` and the other native collaboration tools may be deferred. For follow-up work on an existing native child, use the native collaboration tool that starts or queues a new turn.${hasSessionsSpawn ? " Use OpenClaw `sessions_spawn` only for OpenClaw or ACP delegation, never as a substitute for `spawn_agent` on internal legwork." : ""}` : void 0,
		hasSessionsYield && nativeDelegationAvailable ? "When a native child's result belongs in a later turn, end the current turn with `openclaw_direct.sessions_yield`; the completion arrives as the next model-visible input. Use native `wait_agent` only for an intentional same-turn wait when the immediate next step is blocked on the child. Never loop-poll for native child completion." : void 0,
		delegationGuidanceAvailable ? buildDelegationGuidanceSection({
			mode: resolveMainSessionDelegationMode({
				config: params.config,
				agentId: params.agentId,
				sessionKey: params.sessionKey
			}),
			isMinimal: params.promptMode === "minimal" || params.promptMode === "none",
			hiddenDelegationTool: nativeDelegationAvailable ? "native `spawn_agent`" : hasSessionsSpawn ? "`sessions_spawn`" : "",
			hasVisibleSessionSpawn: hasSessionsSpawn,
			hasSessionsYield,
			hasSubagentsList,
			hasSessionsSend
		}).join("\n") : void 0,
		params.disableTools !== true && params.promptMode !== "minimal" && params.promptMode !== "none" ? buildUiPresentationPrompt({
			screenToolName,
			showWidgetToolName,
			dashboardToolName,
			portalToolName,
			messageTool
		}) : void 0,
		buildCredentialSafetyPrompt({ controlToolsAvailable: params.disableTools !== true && hasControlTools }),
		nativeCommandGuidance,
		params.gitCoauthorPrompt,
		params.extraSystemPrompt
	].filter((section) => typeof section === "string" && section.trim()).join("\n\n");
}
//#endregion
//#region extensions/codex/src/app-server/thread-shell-environment.ts
/** Applies host-selected values and any required login-shell restriction last. */
function applyCodexManagedShellEnvironment(config, environment, disableLoginShell = false) {
	if (!environment || Object.keys(environment).length === 0) return disableLoginShell ? {
		...config,
		allow_login_shell: false
	} : config;
	const current = isJsonObject(config.shell_environment_policy) ? config.shell_environment_policy : {};
	const currentSet = isJsonObject(current.set) ? current.set : {};
	const names = Object.keys(environment).toSorted();
	const includeOnly = Array.isArray(current.include_only) ? current.include_only.filter((entry) => typeof entry === "string") : [];
	const filters = isJsonObject(current.filters) ? current.filters : void 0;
	const hasIncludeFilter = filters && Object.values(filters).includes("include");
	const managedConfig = {
		...config,
		shell_environment_policy: {
			...current,
			experimental_use_profile: false,
			set: {
				...currentSet,
				...environment
			},
			...filters ? hasIncludeFilter ? { filters: {
				...filters,
				...Object.fromEntries(names.map((name) => [name, "include"]))
			} } : {} : includeOnly.length > 0 ? { include_only: [.../* @__PURE__ */ new Set([...includeOnly, ...names])] } : {}
		}
	};
	return disableLoginShell ? {
		...managedConfig,
		allow_login_shell: false
	} : managedConfig;
}
//#endregion
//#region extensions/codex/src/app-server/web-search.ts
const CODEX_NATIVE_WEB_SEARCH_DISABLED_CONFIG = {
	"features.standalone_web_search": false,
	web_search: "disabled"
};
function normalizeUniqueStrings(value) {
	if (!Array.isArray(value)) return;
	const normalized = [...new Set(value.map(normalizeOptionalString).filter((entry) => Boolean(entry)))];
	return normalized.length > 0 ? normalized : void 0;
}
function hasManagedSearchProvider(config) {
	return normalizeOptionalString(config?.tools?.web?.search?.provider) !== void 0;
}
function hasNativeDomainRestrictions(config) {
	return normalizeUniqueStrings(config?.tools?.web?.search?.openaiCodex?.allowedDomains) !== void 0;
}
function buildCodexNativeWebSearchThreadConfig(config) {
	const nativeConfig = config?.tools?.web?.search?.openaiCodex;
	const threadConfig = {
		"features.standalone_web_search": false,
		web_search: nativeConfig?.mode === "live" ? "live" : "cached"
	};
	const allowedDomains = normalizeUniqueStrings(nativeConfig?.allowedDomains);
	if (allowedDomains) threadConfig["tools.web_search.allowed_domains"] = allowedDomains;
	if (nativeConfig?.contextSize) threadConfig["tools.web_search.context_size"] = nativeConfig.contextSize;
	const location = nativeConfig?.userLocation;
	const country = normalizeOptionalString(location?.country);
	const region = normalizeOptionalString(location?.region);
	const city = normalizeOptionalString(location?.city);
	const timezone = normalizeOptionalString(location?.timezone);
	if (country) threadConfig["tools.web_search.location.country"] = country;
	if (region) threadConfig["tools.web_search.location.region"] = region;
	if (city) threadConfig["tools.web_search.location.city"] = city;
	if (timezone) threadConfig["tools.web_search.location.timezone"] = timezone;
	return threadConfig;
}
function resolveCodexWebSearchPlan(params) {
	if (params.disableTools === true || params.webSearchAllowed === false || params.config?.tools?.web?.search?.enabled === false) return {
		kind: "disabled",
		suppressManagedWebSearch: true,
		threadConfig: CODEX_NATIVE_WEB_SEARCH_DISABLED_CONFIG
	};
	const nativeConfig = params.config?.tools?.web?.search?.openaiCodex;
	const managedSearchExplicit = hasManagedSearchProvider(params.config) || nativeConfig?.enabled === false;
	const nativeProviderSupportsSearch = params.nativeProviderWebSearchSupport === void 0 || params.nativeProviderWebSearchSupport === "supported";
	if (!(params.nativeToolSurfaceEnabled !== false && nativeProviderSupportsSearch && nativeConfig?.enabled !== false && !hasManagedSearchProvider(params.config))) {
		if (!managedSearchExplicit && hasNativeDomainRestrictions(params.config)) return {
			kind: "disabled",
			suppressManagedWebSearch: true,
			threadConfig: CODEX_NATIVE_WEB_SEARCH_DISABLED_CONFIG
		};
		return {
			kind: "managed",
			suppressManagedWebSearch: false,
			threadConfig: CODEX_NATIVE_WEB_SEARCH_DISABLED_CONFIG
		};
	}
	return {
		kind: "native-hosted",
		suppressManagedWebSearch: true,
		threadConfig: buildCodexNativeWebSearchThreadConfig(params.config),
		webFetchHostnameAllowlist: buildHostnameAllowlistPolicyFromSuffixAllowlist(nativeConfig?.allowedDomains)?.hostnameAllowlist
	};
}
const CODEX_CODE_MODE_THREAD_CONFIG = {
	"features.code_mode": true,
	"features.code_mode_only": false,
	"features.shell_tool": true,
	"features.apply_patch_streaming_events": true,
	suppress_unstable_features_warning: true
};
const CODEX_GOAL_CONTINUATION_DISABLED_THREAD_CONFIG = { "features.goals": false };
const CODEX_NATIVE_UPDATE_PLAN_DISABLED_THREAD_CONFIG = { "tools.update_plan.enabled": false };
const CODEX_CODE_MODE_DISABLED_THREAD_CONFIG = {
	"features.code_mode": false,
	"features.code_mode_only": false
};
const CODEX_NO_PROJECT_DOCS_CONFIG = { project_doc_max_bytes: 0 };
const CODEX_TOOL_SEARCH_UNSUPPORTED_THREAD_CONFIG = { "features.multi_agent": false };
const CODEX_DELEGATION_DISABLED_THREAD_CONFIG = {
	"agents.enabled": false,
	"features.multi_agent": false,
	"features.multi_agent_v2": false
};
const CODEX_RING_ZERO_RESTRICTED_FEATURES = /* @__PURE__ */ new Set([
	"apps",
	"artifact",
	"browser_use",
	"browser_use_external",
	"browser_use_full_cdp_access",
	"chronicle",
	"code_mode",
	"code_mode_only",
	"computer_use",
	"context_management",
	"current_time_reminder",
	"default_mode_request_user_input",
	"deferred_executor",
	"goals",
	"hooks",
	"image_generation",
	"memories",
	"multi_agent",
	"multi_agent_v2",
	"plugins",
	"request_permissions_tool",
	"skill_search",
	"shell_tool",
	"standalone_web_search",
	"token_budget",
	"unified_exec",
	"view_image",
	"web_search_cached",
	"web_search_request",
	"workspace_dependencies"
]);
const CODEX_RING_ZERO_THREAD_CONFIG = {
	...CODEX_DELEGATION_DISABLED_THREAD_CONFIG,
	...Object.fromEntries([...CODEX_RING_ZERO_RESTRICTED_FEATURES].map((feature) => [`features.${feature}`, false])),
	"orchestrator.mcp.enabled": false,
	"orchestrator.skills.enabled": false,
	"skills.bundled.enabled": false,
	"skills.include_instructions": false,
	"tools.experimental_request_user_input.enabled": false,
	hooks: {
		PreToolUse: [],
		PermissionRequest: [],
		PostToolUse: [],
		PreCompact: [],
		PostCompact: [],
		SessionStart: [],
		UserPromptSubmit: [],
		SubagentStart: [],
		SubagentStop: [],
		Stop: []
	},
	notify: [],
	web_search: "disabled"
};
const CODEX_RING_ZERO_RESTRICTED_FEATURE_ALIASES = /* @__PURE__ */ new Map([
	["connectors", "apps"],
	["imagegenext", "image_generation"],
	["collab", "multi_agent"],
	["memory_tool", "memories"],
	["telepathy", "chronicle"],
	["codex_hooks", "hooks"]
]);
/** Common deterministic start/resume/fork fields; no run resources or unsupported setters. */
function buildCodexThreadConfiguration(params, options) {
	return {
		...options.cwd !== void 0 ? { cwd: options.cwd } : {},
		...options.appServer.sessionRoot ? { runtimeWorkspaceRoots: [options.appServer.sessionRoot] } : {},
		approvalPolicy: options.appServer.approvalPolicy,
		approvalsReviewer: resolveCodexThreadApprovalsReviewer(options.appServer, options.config),
		...codexThreadSandboxOrPermissions(options.appServer),
		...options.appServer.serviceTier !== void 0 ? { serviceTier: options.appServer.serviceTier } : {},
		config: buildCodexRuntimeThreadConfigForRun(params, options.config, {
			nativeCodeModeEnabled: options.nativeCodeModeEnabled,
			nativeProviderWebSearchSupport: options.nativeProviderWebSearchSupport,
			nativeCodeModeOnlyEnabled: options.nativeCodeModeOnlyEnabled,
			directOnlyToolNamespaces: resolveDirectOnlyToolNamespaces(options.dynamicTools),
			webSearchAllowed: options.webSearchAllowed,
			appServer: options.appServer,
			hostSystemAgentActive: options.hostSystemAgentActive,
			restrictedToolSurfaceInheritedMcpServerNames: options.restrictedToolSurfaceInheritedMcpServerNames,
			shellEnvironment: options.shellEnvironment,
			disableLoginShell: options.disableLoginShell
		}),
		developerInstructions: options.developerInstructions ?? buildDeveloperInstructions(params, { dynamicTools: options.dynamicTools })
	};
}
function buildThreadStartParams(params, options) {
	const resolvedModelProvider = resolveCodexAppServerModelProvider({
		provider: params.provider,
		authProfileId: params.authProfileId,
		authProfileStore: params.authProfileStore,
		agentDir: params.agentDir,
		config: params.config
	});
	const modelSelection = resolveCodexAppServerRequestModelSelection({
		model: options.model ?? params.modelId,
		modelProvider: options.modelProvider ?? resolvedModelProvider,
		authProfileId: params.authProfileId,
		authProfileStore: params.authProfileStore,
		agentDir: params.agentDir,
		config: params.config
	});
	return {
		model: modelSelection.model,
		...modelSelection.modelProvider ? { modelProvider: modelSelection.modelProvider } : {},
		...buildCodexThreadConfiguration(params, options),
		...(options.hostSystemAgentActive ?? isHostScopedAgentToolActive("openclaw")) && isSystemAgentOnlyCodexDynamicToolAllowlist(params.toolsAllow) ? { baseInstructions: "" } : {},
		personality: CODEX_NATIVE_PERSONALITY_NONE,
		serviceName: "OpenClaw",
		threadSource: "openclaw",
		...resolveCodexThreadEnvironmentSelection(options),
		dynamicTools: [...options.dynamicTools],
		experimentalRawEvents: true,
		...isIncognitoSessionKey(params.sessionKey) ? { ephemeral: true } : {}
	};
}
function buildThreadResumeParams(params, options) {
	const modelSelection = options.preserveNativeModel ? void 0 : resolveCodexAppServerRequestModelSelection({
		model: options.model ?? params.modelId,
		modelProvider: options.modelProvider ?? resolveCodexAppServerModelProvider({
			provider: params.provider,
			authProfileId: options.authProfileId ?? params.authProfileId,
			authProfileStore: params.authProfileStore,
			agentDir: params.agentDir,
			config: params.config
		}),
		authProfileId: options.authProfileId ?? params.authProfileId,
		authProfileStore: params.authProfileStore,
		agentDir: params.agentDir,
		config: params.config
	});
	return {
		threadId: options.threadId,
		excludeTurns: true,
		initialTurnsPage: {
			limit: 1,
			sortDirection: "desc",
			itemsView: "notLoaded"
		},
		...modelSelection ? {
			model: modelSelection.model,
			...modelSelection.modelProvider ? { modelProvider: modelSelection.modelProvider } : {}
		} : {},
		...buildCodexThreadConfiguration(params, options),
		personality: CODEX_NATIVE_PERSONALITY_NONE
	};
}
function buildCodexRuntimeThreadConfig(config, options = {}) {
	const configured = buildCodexProjectDocThreadConfig(config);
	const codeModeConfig = {
		...CODEX_CODE_MODE_THREAD_CONFIG,
		"features.code_mode_only": options.nativeCodeModeOnlyEnabled === true
	};
	if (options.nativeCodeModeEnabled === false) {
		const disabledConfig = expectDefined(mergeCodexThreadConfigs(configured, CODEX_CODE_MODE_DISABLED_THREAD_CONFIG, CODEX_GOAL_CONTINUATION_DISABLED_THREAD_CONFIG, CODEX_NATIVE_UPDATE_PLAN_DISABLED_THREAD_CONFIG), "Codex disabled code mode config");
		delete disabledConfig["features.apply_patch_streaming_events"];
		return disabledConfig;
	}
	if (options.nativeCodeModeOnlyEnabled === true) return ensureDirectOnlyToolNamespaces(expectDefined(mergeCodexThreadConfigs(codeModeConfig, configured, CODEX_GOAL_CONTINUATION_DISABLED_THREAD_CONFIG, CODEX_NATIVE_UPDATE_PLAN_DISABLED_THREAD_CONFIG, { "features.code_mode_only": true }), "Codex code mode only config"), options.directOnlyToolNamespaces);
	return ensureDirectOnlyToolNamespaces(expectDefined(mergeCodexThreadConfigs(codeModeConfig, configured, CODEX_GOAL_CONTINUATION_DISABLED_THREAD_CONFIG, CODEX_NATIVE_UPDATE_PLAN_DISABLED_THREAD_CONFIG), "Codex code mode config"), options.directOnlyToolNamespaces);
}
function ensureDirectOnlyToolNamespaces(config, requiredNamespaces) {
	if (!requiredNamespaces?.length) return config;
	const feature = expectDefined(config["features.code_mode"], "Codex code mode config");
	const configured = isJsonObject(feature) ? feature : { enabled: feature };
	const namespaces = Array.isArray(configured.direct_only_tool_namespaces) ? configured.direct_only_tool_namespaces.filter((entry) => typeof entry === "string" && entry.length > 0) : [];
	return {
		...config,
		"features.code_mode": {
			...configured,
			direct_only_tool_namespaces: [.../* @__PURE__ */ new Set([...namespaces, ...requiredNamespaces])]
		}
	};
}
function resolveDirectOnlyToolNamespaces(dynamicTools) {
	return (dynamicTools ?? []).filter((tool) => tool.type === "namespace" && tool.name === "openclaw_direct").map((tool) => tool.name);
}
function buildCodexRuntimeThreadConfigForRun(params, config, options = {}) {
	const ringZeroActive = (options.hostSystemAgentActive ?? isHostScopedAgentToolActive("openclaw")) && isSystemAgentOnlyCodexDynamicToolAllowlist(params.toolsAllow);
	const messageOnlySourceReply = isMessageOnlyCodexSourceReply(params);
	const restrictedToolSurface = ringZeroActive || messageOnlySourceReply || params.pluginHarnessToolPolicyRestricted === true;
	const restrictedTurnDisablesProjectDocs = ringZeroActive || messageOnlySourceReply || params.pluginHarnessToolPolicyRestricted && params.disableTools;
	const configMcpServers = config?.mcp_servers;
	if (restrictedToolSurface && configMcpServers !== void 0 && !isJsonObject(configMcpServers)) throw new Error("Codex restricted tool surface received invalid thread mcp_servers config");
	const restrictedToolSurfaceMcpServerNames = [...options.restrictedToolSurfaceInheritedMcpServerNames ?? [], ...isJsonObject(configMcpServers) ? Object.keys(configMcpServers) : []];
	const webSearchConfig = resolveCodexWebSearchPlan({
		config: params.config,
		disableTools: params.disableTools,
		nativeToolSurfaceEnabled: options.nativeCodeModeEnabled,
		nativeProviderWebSearchSupport: options.nativeProviderWebSearchSupport,
		webSearchAllowed: options.webSearchAllowed
	}).threadConfig;
	const baseConfig = buildCodexRuntimeThreadConfig(mergeCodexThreadConfigs(config, webSearchConfig), options);
	return applyCodexManagedShellEnvironment({
		...mergeCodexThreadConfigs(baseConfig, options.appServer?.networkProxy?.configPatch, params.pluginHarnessToolPolicySafeDeniedTools?.includes("image_generate") ? { "features.image_generation": false } : void 0, shouldDisableCodexToolSearchForModel(params.modelId) ? CODEX_TOOL_SEARCH_UNSUPPORTED_THREAD_CONFIG : void 0, params.delegationCapability === "report_only" ? CODEX_DELEGATION_DISABLED_THREAD_CONFIG : void 0, messageOnlySourceReply || params.pluginHarnessToolPolicyRestricted === true ? buildRestrictedToolConfigPatch(restrictedToolSurfaceMcpServerNames, Boolean(params.scheduledRuntimeAuthority)) : buildCodexRingZeroThreadConfigPatch(params, options.hostSystemAgentActive, restrictedToolSurfaceMcpServerNames), restrictedTurnDisablesProjectDocs ? CODEX_NO_PROJECT_DOCS_CONFIG : void 0, params.authoredContextTokenCap === void 0 ? void 0 : { model_context_window: params.authoredContextTokenCap }) ?? baseConfig,
		...params.bootstrapContextMode === "lightweight" ? CODEX_NO_PROJECT_DOCS_CONFIG : {}
	}, options.shellEnvironment, options.disableLoginShell);
}
function buildCodexRingZeroThreadConfigPatch(params, hostSystemAgentActive = isHostScopedAgentToolActive("openclaw"), inheritedMcpServerNames = []) {
	if (!hostSystemAgentActive || !isSystemAgentOnlyCodexDynamicToolAllowlist(params.toolsAllow)) return;
	return {
		...buildRestrictedToolConfigPatch(inheritedMcpServerNames),
		...CODEX_NO_PROJECT_DOCS_CONFIG
	};
}
function buildRestrictedToolConfigPatch(inheritedMcpServerNames, scheduledAppAuthorityActive = false) {
	const mcpServers = Object.fromEntries([...new Set(inheritedMcpServerNames)].toSorted().map((name) => [name, { enabled: false }]));
	return {
		...CODEX_RING_ZERO_THREAD_CONFIG,
		...scheduledAppAuthorityActive ? {
			"features.apps": true,
			"orchestrator.mcp.enabled": true
		} : {},
		...Object.keys(mcpServers).length > 0 ? { mcp_servers: mcpServers } : {}
	};
}
async function readCodexInheritedMcpServerNames(client, cwd, signal, effectiveConfig) {
	const response = effectiveConfig ?? await readCodexEffectiveConfig(client, cwd, { signal });
	if (!Array.isArray(response.layers)) throw new Error("Codex config/read omitted effective config layers");
	for (const layer of response.layers) {
		if (!isJsonObject(layer) || !isJsonObject(layer.name) || typeof layer.name.type !== "string") throw new Error("Codex config/read returned invalid effective config layers");
		if (layer.name.type === "legacyManagedConfigTomlFromFile" || layer.name.type === "legacyManagedConfigTomlFromMdm") {
			const migrationGuidance = layer.name.type === "legacyManagedConfigTomlFromFile" ? "migrate /etc/codex/managed_config.toml to /etc/codex/requirements.toml before running restricted or isolated turns. For ChatGPT-only authentication, use allowed_login_methods = [\"chatgpt\"] in /etc/codex/requirements.toml" : "replace the legacy MDM payload with base64-encoded TOML requirements in the com.openai.codex managed preference requirements_toml_base64 before running restricted or isolated turns. For ChatGPT-only authentication, include allowed_login_methods = [\"chatgpt\"] in that TOML payload";
			throw new Error(`Codex restricted tool surface cannot override config layer ${layer.name.type}; ${migrationGuidance}.`);
		}
		if (!CODEX_SESSION_OVERRIDABLE_LAYER_TYPES.has(layer.name.type)) throw new Error(`Codex restricted tool surface does not recognize config layer ${layer.name.type}`);
	}
	const configuredServers = response.config.mcp_servers;
	if (configuredServers === void 0) return [];
	if (!isJsonObject(configuredServers)) throw new Error("Codex config/read returned invalid mcp_servers");
	return Object.keys(configuredServers).toSorted();
}
async function assertCodexManagedRequirementsDoNotOverrideToolPolicy(client, options, signal) {
	const requirements = await readCodexManagedRequirements(client, signal);
	const managedRequirementsFingerprint = buildCodexManagedRequirementsFingerprint(requirements);
	const managedRequirementsMatch = options.allowedManagedRequirementsFingerprint !== void 0 && managedRequirementsFingerprint === options.allowedManagedRequirementsFingerprint;
	const managedHooksAllowed = managedRequirementsMatch || options.allowConfiguredManagedHooks === true;
	if (options.allowedManagedRequirementsFingerprint !== void 0 && !managedRequirementsMatch) throw new Error("Codex managed requirements changed since this automation was authorized; reauthorize the automation from a fresh owner turn");
	if (requirements === null) return { enableManagedHooks: managedHooksAllowed && options.privateManagedHooksPresent === true };
	let hasManagedHooks = false;
	let requiredHooksEnabled;
	if (options.restrictedToolSurface) for (const key of [
		"hooks",
		"managedHooks",
		"managed_hooks"
	]) {
		const hooks = requirements[key];
		if (hooks === void 0 || hooks === null) continue;
		if (!isJsonObject(hooks)) throw new Error("Codex configRequirements/read returned invalid managed hooks");
		hasManagedHooks ||= hasNonEmptyJsonValue(hooks);
		if (hasManagedHooks && !managedHooksAllowed) throw new Error("Codex restricted tool surface cannot override managed hooks");
	}
	const additionalDeniedFeatures = new Set(options.additionalDeniedFeatures);
	for (const key of ["featureRequirements", "feature_requirements"]) {
		const featureRequirements = requirements[key];
		if (featureRequirements === void 0 || featureRequirements === null) continue;
		if (!isJsonObject(featureRequirements)) throw new Error("Codex configRequirements/read returned invalid feature requirements");
		for (const [feature, enabled] of Object.entries(featureRequirements)) {
			if (typeof enabled !== "boolean") throw new Error("Codex configRequirements/read returned invalid feature requirements");
			const canonicalFeature = CODEX_RING_ZERO_RESTRICTED_FEATURE_ALIASES.get(feature) ?? feature;
			if (options.requiredNativeShell && canonicalFeature === "shell_tool" && !enabled) throw new Error("Codex native code mode requires shell_tool, but managed requirements disable it. Ask your administrator to allow the shell, or select a tool policy that disables native code mode; no automation authority was captured.");
			const deniedByToolPolicy = options.restrictedToolSurface && CODEX_RING_ZERO_RESTRICTED_FEATURES.has(canonicalFeature) || additionalDeniedFeatures.has(canonicalFeature);
			if (canonicalFeature === "hooks" && managedHooksAllowed) {
				requiredHooksEnabled = enabled;
				continue;
			}
			if (enabled && deniedByToolPolicy) throw new Error(`Codex tool policy cannot override required feature ${feature}`);
		}
	}
	return { enableManagedHooks: managedHooksAllowed && requiredHooksEnabled !== false && (hasManagedHooks || options.privateManagedHooksPresent === true || requiredHooksEnabled === true) };
}
/** Hashes the exact managed requirements without retaining their hook commands or policy details. */
function buildCodexManagedRequirementsFingerprint(requirements) {
	const fingerprint = fingerprintJsonObject({
		version: 1,
		requirements
	});
	return crypto.createHash("sha256").update(fingerprint).digest("hex");
}
/** Reads and fingerprints the exact managed requirements active on this app-server. */
async function readCodexManagedRequirementsFingerprint(client, signal) {
	return buildCodexManagedRequirementsFingerprint(await readCodexManagedRequirements(client, signal));
}
async function readCodexManagedRequirements(client, signal) {
	const response = await client.request("configRequirements/read", void 0, { signal });
	if (!isJsonObject(response) || !Object.hasOwn(response, "requirements")) throw new Error("Codex configRequirements/read returned an invalid response");
	if (response.requirements !== null && !isJsonObject(response.requirements)) throw new Error("Codex configRequirements/read returned invalid requirements");
	return response.requirements;
}
function hasNonEmptyJsonValue(value) {
	if (value === null || value === false || value === "") return false;
	if (Array.isArray(value)) return value.length > 0;
	if (typeof value === "object") return Object.values(value).some(hasNonEmptyJsonValue);
	return true;
}
function resolveCodexThreadApprovalsReviewer(appServer, config) {
	return config?.approvals_reviewer === "user" ? "user" : appServer.approvalsReviewer;
}
function codexThreadSandboxOrPermissions(appServer) {
	if (appServer.networkProxy) return {};
	return { sandbox: appServer.sandbox };
}
function resolveCodexThreadEnvironmentSelection(options) {
	if (options.nativeCodeModeEnabled === false) return { environments: [] };
	if (options.environmentSelection) return { environments: options.environmentSelection };
	return {};
}
//#endregion
export { readActiveCodexTurnIdsFromResume as $, emitCodexNativePreToolUseFailureDiagnostic as A, parseCodexNativeToolCatalog as B, CODEX_NATIVE_HOOK_RELAY_TTL_GRACE_MS as C, shouldBuildCodexPluginThreadConfig as Ct, buildCodexNativeHookRelayDisabledConfig as D, buildCodexNativeHookRelayConfig as E, checkCodexThreadAppAvailability as F, areUserMcpServersFingerprintsCompatible as G, resolveCodexNativeSkillIsolation as H, discardUnattestedCodexPluginThread as I, fingerprintCodexThreadConfig as J, codexDynamicToolsFingerprint as K, attestCodexRestrictedToolSurfaceMcpServersDisabled as L, resolveCodexNativeHookRelayTtlMs as M, scheduleCodexNativeHookRelayUnregister as N, buildCodexNativeHookRelayId as O, attestCodexThreadToolSurface as P, legacyFingerprintUserMcpServersConfigPatch as Q, hasCodexNativeToolCatalog as R, CODEX_NATIVE_HOOK_RELAY_EVENTS as S, refreshCodexPluginAppApprovalPolicy as St, assertCodexNativeHookRelayAllowed as T, buildCodexAppApprovalOverrides as Tt, areCodexDynamicToolFingerprintsCompatible as U, applyCodexNativeSkillIsolation as V, areDynamicToolFingerprintsCompatible as W, fingerprintJsonObject as X, fingerprintEnvironmentSelection as Y, fingerprintUserMcpServersConfigPatch as Z, resolveCodexAppServerRequestModelSelection as _, buildDisabledAppsConfigPatch as _t, buildCodexThreadConfiguration as a, filterCodexDynamicTools as at, buildCodexProjectDocThreadConfig as b, isCodexPluginThreadBindingStale as bt, codexThreadSandboxOrPermissions as c, isMessageOnlyCodexSourceReply as ct, resolveCodexThreadApprovalsReviewer as d, resolveCodexDynamicToolsLoading as dt, shouldStartTransientNoToolThread as et, buildCodexNativeWebSearchThreadConfig as f, resolveCodexDynamicToolsLoadingForRuntime as ft, resolveCodexAppServerModelProvider as g, buildCodexPluginThreadConfigTimeoutFallback as gt, CODEX_NATIVE_PERSONALITY_NONE as h, buildCodexPluginThreadConfigInputFingerprint as ht, buildCodexRuntimeThreadConfigForRun as i, shouldRotateCodexGpt56MultiAgentBinding as it, resolveCodexNativeHookRelayEvents as j, createCodexNativeHookRelay as k, readCodexInheritedMcpServerNames as l, isSystemAgentOnlyCodexDynamicToolAllowlist as lt, buildDeveloperInstructions as m, buildCodexPluginThreadConfig as mt, buildCodexRingZeroThreadConfigPatch as n, shouldRecheckRecoverablePluginBinding as nt, buildThreadResumeParams as o, filterCodexDynamicToolsForDisabledNativeSurface as ot, resolveCodexWebSearchPlan as p, buildCodexPluginAppsConfigPatchFromPolicyContext as pt, codexLegacyDynamicToolsFingerprint as q, buildCodexRuntimeThreadConfig as r, shouldRotateCodexAppServerBindingForRuntime as rt, buildThreadStartParams as s, isForcedPrivateQaCodexRuntime as st, assertCodexManagedRequirementsDoNotOverrideToolPolicy as t, isTransientWebSearchRestriction as tt, readCodexManagedRequirementsFingerprint as u, normalizeCodexDynamicToolName as ut, resolveCodexAppServerThreadModelSelection as v, buildPluginAppPolicyContext as vt, CodexManagedHooksOnlyError as w, stringifyCodexPluginPolicy as wt, mergeCodexNativeProjectDocThreadConfig as x, mergeCodexThreadConfigs as xt, resolveCodexBindingModelProviderFallback as y, disableUnlistedCodexApps as yt, loadCodexNativeToolCatalog as z };
