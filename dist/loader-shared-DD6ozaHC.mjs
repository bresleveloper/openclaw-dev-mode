import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { i as extractErrorCode, n as collectErrorGraphCandidates } from "./error-coercion-CvJK4lmH.mjs";
import { n as parseBooleanValue } from "./boolean-BEb0Fdt8.mjs";
import { i as readErrorCause } from "./errors-O33D01XW.mjs";
import { t as VERSION } from "./version-BJGPJZu6.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { u as collectPluginManifestCompatCodes } from "./installed-plugin-index-Zl-RSskC.mjs";
import { t as isPluginEnabledByDefaultForPlatform } from "./default-enablement-CEIbpabL.mjs";
import { r as hasKind } from "./slots-DarSawuQ.mjs";
import { f as resolveEffectiveEnableState, p as resolveEffectivePluginActivationState } from "./config-state-DY_WJYue.mjs";
import { t as normalizePluginPolicyId } from "./plugin-policy-id-1GfPFu0U.mjs";
import { E as recordPluginCandidateInstallOwner, a as groupPluginRecords, b as formatPluginVerificationDiagnostic, o as isPluginLifecycleTraceEnabled } from "./discovery-Dma3bVNk.mjs";
import { a as resolvePluginManifestInstallOwner, i as isPluginManifestInstallOwnerAmbiguous } from "./manifest-registry-build-BTWjXT8m.mjs";
import { a as capturePluginLifecycleAuthority } from "./registry-lifecycle-CnhlPo20.mjs";
import { S as rollbackStagedPluginRegistry, d as getActivePluginRegistryVersion, i as commitStagedPluginRegistry, l as getActivePluginRegistry, n as captureActivePluginRegistrySnapshot, w as stageActivePluginRegistry } from "./runtime-DfYPSUKC.mjs";
import { r as validatePluginSchemaValue } from "./schema-validator-qnYkiHpy.mjs";
import { o as shippedNativeSessionCatalogs } from "./native-session-catalog-config-Cw2NJHbW.mjs";
import { t as activateContextEngineRegistrations } from "./registry-BIuAP_WM.mjs";
import { C as resolveMemoryDreamingPluginConfig, S as resolveMemoryDreamingConfig, l as DEFAULT_MEMORY_DREAMING_PLUGIN_ID } from "./dreaming-D1wokp9N.mjs";
import { a as resetGlobalHookRunner, i as initializeGlobalHookRunner, n as getGlobalPluginRegistry } from "./hook-runner-global-D5rL9Ed5.mjs";
import { t as isBundleCapabilitySupported } from "./bundle-capability-support-B86S0fqh.mjs";
import { t as recordPluginLoadDiagnostic } from "./load-diagnostics-ue2aSd6P.mjs";
import { t as encodeStartupTraceSegment } from "./startup-trace-segment-Cd4cVDJE.mjs";
//#region src/plugins/loader-records.ts
/** Builds the registry record shape shared by plugin loading, status, and diagnostics. */
function createPluginRecord(params) {
	return {
		id: params.id,
		nativeSessionCatalog: params.nativeSessionCatalog,
		name: params.name ?? params.id,
		description: params.description,
		packageVersion: params.packageVersion,
		version: params.version,
		builtWithOpenClawVersion: params.builtWithOpenClawVersion,
		packageName: params.packageName,
		format: params.format ?? "openclaw",
		bundleFormat: params.bundleFormat,
		bundleCapabilities: params.bundleCapabilities,
		source: params.source,
		rootDir: params.rootDir,
		origin: params.origin,
		workspaceDir: params.workspaceDir,
		trustedOfficialInstall: params.trustedOfficialInstall,
		trust: params.trust,
		enabled: params.enabled,
		compat: params.compat,
		explicitlyEnabled: params.activationState?.explicitlyEnabled,
		activated: params.activationState?.activated,
		activationSource: params.activationState?.source,
		activationReason: params.activationState?.reason,
		syntheticAuthRefs: params.syntheticAuthRefs ?? [],
		status: params.enabled ? "loaded" : "disabled",
		toolNames: [],
		hookNames: [],
		channelIds: [...params.channelIds ?? []],
		cliBackendIds: [],
		providerIds: [...params.providerIds ?? []],
		embeddingProviderIds: [...params.contracts?.embeddingProviders ?? []],
		speechProviderIds: [...params.contracts?.speechProviders ?? []],
		realtimeTranscriptionProviderIds: [...params.contracts?.realtimeTranscriptionProviders ?? []],
		realtimeVoiceProviderIds: [...params.contracts?.realtimeVoiceProviders ?? []],
		mediaUnderstandingProviderIds: [...params.contracts?.mediaUnderstandingProviders ?? []],
		transcriptSourceProviderIds: [...params.contracts?.transcriptSourceProviders ?? []],
		imageGenerationProviderIds: [...params.contracts?.imageGenerationProviders ?? []],
		videoGenerationProviderIds: [...params.contracts?.videoGenerationProviders ?? []],
		musicGenerationProviderIds: [...params.contracts?.musicGenerationProviders ?? []],
		webFetchProviderIds: [...params.contracts?.webFetchProviders ?? []],
		webSearchProviderIds: [...params.contracts?.webSearchProviders ?? []],
		migrationProviderIds: [...params.contracts?.migrationProviders ?? []],
		contextEngineIds: [],
		agentHarnessIds: [],
		cliCommands: [],
		services: [],
		gatewayDiscoveryServiceIds: [],
		commands: [],
		httpRoutes: 0,
		hookCount: 0,
		configSchema: params.configSchema,
		configUiHints: void 0,
		configJsonSchema: void 0,
		contracts: params.contracts,
		dashboard: params.dashboard,
		controlUi: params.controlUi,
		uiCapabilities: params.uiCapabilities,
		mcpServers: params.mcpServers
	};
}
/** Marks a discovered plugin inactive without discarding its metadata record. */
function markPluginActivationDisabled(record, reason) {
	record.status = "disabled";
	record.error = reason;
	record.activated = false;
	record.activationSource = "disabled";
	record.activationReason = reason;
}
/** Records a boot-time payload quarantine without importing or activating the plugin. */
function recordPluginConfiguredUnavailable(params) {
	const error = formatPluginVerificationDiagnostic(params.degradedPlugin.diagnostic);
	params.record.status = "error";
	params.record.error = error;
	params.record.failurePhase = "validation";
	params.record.activated = false;
	params.record.activationReason = `configured-unavailable: ${params.degradedPlugin.diagnostic.reason}`;
	params.registry.plugins.push(params.record);
	params.seenIds.set(params.record.id, params.record.origin);
	params.registry.diagnostics.push({
		level: "error",
		pluginId: params.record.id,
		source: params.record.source,
		code: "plugin-verification",
		message: error
	});
}
/** Joins auto-enable reasons into the single registry field shown by status surfaces. */
function formatAutoEnabledActivationReason(reasons) {
	return reasons?.length ? reasons.join("; ") : void 0;
}
function readCauseOrNothing(node) {
	try {
		return [readErrorCause(node)];
	} catch {
		return [];
	}
}
function resolvePluginImportHint(node, record, missingDependencyHint) {
	try {
		const text = String(node).replaceAll("\\", "/");
		const seam = /(?:The requested module ['"]openclaw\/|Package subpath ['"]\.\/)(plugin-sdk\/[\w./-]{1,160})['"] (?:does not provide an export named|is not defined by ["']exports["'] in .*\/openclaw\/package\.json)/.exec(text)?.[1];
		if (seam) {
			const sdkCompatibility = {
				seam: `openclaw/${seam}`,
				coreVersion: VERSION,
				builtWithOpenClawVersion: record.builtWithOpenClawVersion,
				nestedSdk: Boolean(record.rootDir && text.includes(`${record.rootDir.replaceAll("\\", "/")}/node_modules/openclaw/package.json`))
			};
			const repair = sdkCompatibility.nestedSdk ? "this plugin bundles an incompatible OpenClaw SDK; update it or contact its author" : /^[a-z0-9_][a-z0-9_.-]*$/i.test(record.id) ? `run \`openclaw plugins update ${record.id}\`` : "update this plugin or contact its author";
			return {
				hint: `Plugin ${record.id} cannot import ${sdkCompatibility.seam} (built with OpenClaw ${record.builtWithOpenClawVersion ?? "unknown"}; running core ${VERSION}); ${repair}`,
				sdkCompatibility
			};
		}
		const code = extractErrorCode(node);
		return missingDependencyHint && (code === "MODULE_NOT_FOUND" || code === "ERR_MODULE_NOT_FOUND") ? { hint: missingDependencyHint } : void 0;
	} catch {
		return;
	}
}
/** Records a loader failure in the registry, diagnostics list, and operator log consistently. */
function recordPluginError(params) {
	const errorText = isPluginLifecycleTraceEnabled() && params.error instanceof Error && typeof params.error.stack === "string" ? params.error.stack : String(params.error);
	const deprecatedApiHint = errorText.includes("api.registerHttpHandler") && errorText.includes("is not a function") ? "deprecated api.registerHttpHandler(...) was removed; use api.registerHttpRoute(...) for plugin-owned routes or registerPluginHttpRoute(...) for dynamic lifecycle routes" : null;
	const errorCandidates = collectErrorGraphCandidates(params.error, readCauseOrNothing);
	const errorCode = errorCandidates.map(extractErrorCode).find((code) => code !== void 0);
	const importHint = params.phase === "validation" ? void 0 : errorCandidates.map((node) => resolvePluginImportHint(node, params.record, params.missingDependencyHint)).find((hint) => hint !== void 0);
	const hint = errorCode === "ENOSPC" ? "ENOSPC: no space left on device; free space on the filesystem used by the plugin load and rerun Doctor" : params.phase === "validation" ? void 0 : deprecatedApiHint ?? importHint?.hint;
	const displayError = hint ? `${hint} (${errorText})` : errorText;
	params.record.status = "error";
	params.record.error = displayError;
	params.record.failedAt = /* @__PURE__ */ new Date();
	params.record.failurePhase = params.phase;
	params.registry.plugins.push(params.record);
	params.seenIds.set(params.record.id, params.record.origin);
	const diagnostic = {
		level: "error",
		pluginId: params.record.id,
		source: params.record.source,
		message: `${params.diagnosticMessagePrefix ?? ""}${displayError}`,
		...errorCode ? { errorCode } : {},
		...importHint?.sdkCompatibility ? {
			code: params.diagnosticCode ?? "sdk-incompatible",
			sdkCompatibility: importHint.sdkCompatibility
		} : params.diagnosticCode ? { code: params.diagnosticCode } : {}
	};
	params.registry.diagnostics.push(diagnostic);
	recordPluginLoadDiagnostic(diagnostic);
	params.logger?.error(`${params.logPrefix ?? ""}${displayError}`);
}
/** Groups failed plugin ids by loader phase for compact startup summaries. */
function formatPluginFailureSummary(failedPlugins) {
	return [...groupPluginRecords(failedPlugins, (plugin) => plugin.failurePhase ?? "load")].map(([phase, plugins]) => `${phase}: ${plugins.map((plugin) => plugin.id).join(", ")}`).join("; ");
}
function describePluginModuleExportShape(value, label = "export", seen = /* @__PURE__ */ new Set()) {
	if (value === null) return [`${label}:null`];
	if (typeof value !== "object") return [`${label}:${typeof value}`];
	if (seen.has(value)) return [`${label}:circular`];
	seen.add(value);
	const record = value;
	const keys = Object.keys(record).toSorted();
	const visibleKeys = keys.slice(0, 8);
	const extraCount = keys.length - visibleKeys.length;
	const details = [`${label}:object keys=${visibleKeys.length > 0 ? `${visibleKeys.join(",")}${extraCount > 0 ? `,+${extraCount}` : ""}` : "none"}`];
	for (const key of [
		"default",
		"module",
		"register",
		"activate"
	]) if (Object.hasOwn(record, key)) details.push(...describePluginModuleExportShape(record[key], `${label}.${key}`, seen));
	return details;
}
function formatMissingPluginRegisterError(moduleExport, env) {
	const message = "plugin export missing register/activate";
	if (parseBooleanValue(env.OPENCLAW_PLUGIN_LOAD_DEBUG) !== true) return message;
	return `${message} (module shape: ${describePluginModuleExportShape(moduleExport).join("; ")})`;
}
function recordBundleDiagnostics(params) {
	const warn = (message) => params.registry.diagnostics.push({
		level: "warn",
		pluginId: params.record.id,
		source: params.record.source,
		message
	});
	const unsupportedCapabilities = (params.record.bundleCapabilities ?? []).filter((capability) => !params.record.bundleFormat || !isBundleCapabilitySupported(params.record.bundleFormat, capability));
	for (const capability of unsupportedCapabilities) warn(`bundle capability detected but not wired into OpenClaw yet: ${capability}`);
	if (params.record.enabled && params.record.rootDir && params.record.bundleFormat && (params.record.bundleCapabilities ?? []).includes("mcpServers")) {
		const runtimeSupport = params.inspectMcp({
			pluginId: params.record.id,
			rootDir: params.record.rootDir,
			bundleFormat: params.record.bundleFormat
		});
		for (const message of runtimeSupport.diagnostics) warn(message);
		if (runtimeSupport.unsupportedServerNames.length > 0) warn(`bundle MCP servers use unsupported transports or incomplete configs (${runtimeSupport.unsupportedServerNames.join(", ")})`);
	}
	params.registry.plugins.push(params.record);
}
//#endregion
//#region src/plugins/loader-shared.ts
function detailPluginStartupTrace(startupTrace, pluginId, metrics) {
	startupTrace?.detail(`plugins.gateway-load.plugin.${encodeStartupTraceSegment(pluginId)}`, metrics);
}
function resolveAuthorizedDreamingSidecar(params) {
	const selectedMemoryPluginId = normalizeLowercaseStringOrEmpty(params.memorySlot);
	if (!selectedMemoryPluginId || selectedMemoryPluginId === "none" || selectedMemoryPluginId === "memory-core") return null;
	if (!resolveMemoryDreamingConfig({
		pluginConfig: resolveMemoryDreamingPluginConfig(params.cfg),
		cfg: params.cfg
	}).enabled || !params.normalized.enabled || !params.activationSource.plugins.enabled) return null;
	const engineId = DEFAULT_MEMORY_DREAMING_PLUGIN_ID;
	if (params.normalized.deny.includes(engineId) || params.activationSource.plugins.deny.includes(engineId) || params.normalized.entries[engineId]?.enabled === false || params.activationSource.plugins.entries[engineId]?.enabled === false) return null;
	const selectedMemoryPlugin = params.manifestRegistry.plugins.find((plugin) => plugin.id === selectedMemoryPluginId);
	const sidecarPlugin = params.manifestRegistry.plugins.find((plugin) => plugin.id === engineId);
	if (!selectedMemoryPlugin || !sidecarPlugin || !hasKind(selectedMemoryPlugin.kind, "memory") || !hasKind(sidecarPlugin.kind, "memory")) return null;
	return resolveEffectiveEnableState({
		id: selectedMemoryPlugin.id,
		origin: selectedMemoryPlugin.origin,
		config: params.normalized,
		rootConfig: params.cfg,
		enabledByDefault: isPluginEnabledByDefaultForPlatform(selectedMemoryPlugin),
		activationSource: params.activationSource
	}).enabled ? {
		engineId,
		selectedMemoryPluginId
	} : null;
}
function matchesScopedPluginOrDreamingSidecar(params) {
	if (!params.onlyPluginIdSet || params.onlyPluginIdSet.has(params.pluginId)) return true;
	return params.pluginId === params.sidecar?.engineId && params.onlyPluginIdSet.has(params.sidecar.selectedMemoryPluginId);
}
function createPluginCandidatesFromManifestRegistry(manifestRegistry) {
	return manifestRegistry.plugins.map((record) => {
		const installOwner = resolvePluginManifestInstallOwner(record);
		return recordPluginCandidateInstallOwner({
			idHint: record.id,
			effectivePluginId: record.id,
			rootDir: record.rootDir,
			source: record.source,
			...record.setupSource !== void 0 ? { setupSource: record.setupSource } : {},
			origin: record.origin,
			...record.sourcePreferred ? { sourcePreferred: true } : {},
			...record.workspaceDir !== void 0 ? { workspaceDir: record.workspaceDir } : {},
			...record.format !== void 0 ? { format: record.format } : {},
			...record.bundleFormat !== void 0 ? { bundleFormat: record.bundleFormat } : {},
			...record.packageManifest !== void 0 ? { packageManifest: record.packageManifest } : {}
		}, installOwner, isPluginManifestInstallOwnerAmbiguous(record));
	});
}
var PluginLoadFailureError = class extends Error {
	constructor(registry, failedPlugins) {
		const summary = failedPlugins.map((entry) => `${entry.id}: ${entry.error ?? "unknown plugin load error"}`).join("; ");
		super(`plugin load failed: ${summary}`);
		this.name = "PluginLoadFailureError";
		this.pluginIds = failedPlugins.map((entry) => entry.id);
		this.registry = registry;
	}
};
function validatePluginConfig(params) {
	const { schema, value } = params;
	if (!schema) return ok(value);
	if (params.sourceValue === void 0 && isEmptyPluginConfigJsonSchema(schema)) {
		if (value === void 0 || value && typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0) return ok({});
		if (!value || typeof value !== "object" || Array.isArray(value)) return err(["<root>: must be object"]);
		return err(["<root>: config must be empty"]);
	}
	const result = validatePluginSchemaValue({
		origin: params.origin,
		schema,
		cacheKey: params.cacheKey,
		value: value ?? {},
		sourceValue: params.sourceValue,
		applyDefaults: true
	});
	return result.ok ? ok(result.value) : err(result.errors.map((error) => error.text));
}
const EMPTY_PLUGIN_CONFIG_SHORTCUT_KEYWORDS = /* @__PURE__ */ new Set([
	"type",
	"additionalProperties",
	"properties",
	"title",
	"description",
	"$schema",
	"$id",
	"$comment",
	"deprecated",
	"readOnly",
	"writeOnly"
]);
function isEmptyPluginConfigJsonSchema(schema) {
	if (schema.type !== "object" || schema.additionalProperties !== false) return false;
	const properties = schema.properties;
	if (!properties || typeof properties !== "object" || Array.isArray(properties) || Object.keys(properties).length > 0) return false;
	return Object.keys(schema).every((keyword) => EMPTY_PLUGIN_CONFIG_SHORTCUT_KEYWORDS.has(keyword));
}
/** Builds the common manifest-backed record shape used by runtime and CLI loaders. */
function createManifestPluginRecord(params) {
	const { candidate, manifestRecord } = params;
	const record = createPluginRecord({
		id: manifestRecord.id,
		nativeSessionCatalog: manifestRecord.setup?.nativeSessionCatalog ?? shippedNativeSessionCatalogs.find(({ pluginId }) => pluginId === manifestRecord.id),
		name: manifestRecord.name ?? manifestRecord.id,
		description: manifestRecord.description,
		packageVersion: manifestRecord.packageVersion,
		version: manifestRecord.version,
		builtWithOpenClawVersion: normalizeOptionalString(candidate.packageManifest?.build?.openclawVersion),
		packageName: manifestRecord.packageName,
		format: manifestRecord.format,
		bundleFormat: manifestRecord.bundleFormat,
		bundleCapabilities: manifestRecord.bundleCapabilities,
		source: candidate.source,
		rootDir: candidate.rootDir,
		origin: candidate.origin,
		workspaceDir: candidate.workspaceDir,
		trustedOfficialInstall: manifestRecord.trustedOfficialInstall,
		trust: manifestRecord.trust,
		enabled: params.enabled,
		compat: collectPluginManifestCompatCodes(manifestRecord),
		activationState: params.activationState,
		syntheticAuthRefs: manifestRecord.syntheticAuthRefs,
		channelIds: manifestRecord.channels,
		providerIds: manifestRecord.providers,
		configSchema: Boolean(manifestRecord.configSchema),
		contracts: manifestRecord.contracts,
		dashboard: manifestRecord.dashboard,
		controlUi: manifestRecord.controlUi,
		uiCapabilities: manifestRecord.uiCapabilities,
		mcpServers: manifestRecord.mcpServers
	});
	if (!params.shouldLoadModules) {
		record.cliBackendIds = [...manifestRecord.cliBackends ?? [], ...manifestRecord.setup?.cliBackends ?? []];
		record.commands = (manifestRecord.commandAliases ?? []).map((alias) => alias.name);
	}
	return record;
}
/** Prepares one candidate; import and registration policy stays with each loader. */
function preparePluginLoadRecord(params) {
	const { candidate, manifestRecord, context, dreamingSidecar } = params;
	const pluginId = manifestRecord.id;
	const policyId = normalizePluginPolicyId(pluginId);
	if (!matchesScopedPluginOrDreamingSidecar({
		onlyPluginIdSet: params.onlyPluginIdSet,
		pluginId,
		sidecar: dreamingSidecar
	})) return null;
	const isDreamingSidecar = dreamingSidecar?.engineId === pluginId;
	const activationState = isDreamingSidecar ? {
		enabled: true,
		activated: true,
		explicitlyEnabled: false,
		source: "auto",
		reason: `dreaming sidecar for selected memory slot "${dreamingSidecar?.selectedMemoryPluginId ?? ""}"`
	} : resolveEffectivePluginActivationState({
		id: pluginId,
		origin: candidate.origin,
		config: context.normalized,
		rootConfig: context.cfg,
		enabledByDefault: isPluginEnabledByDefaultForPlatform(manifestRecord),
		channelIds: manifestRecord.channels,
		activationSource: context.activationSource,
		autoEnabledReason: formatAutoEnabledActivationReason(context.autoEnabledReasons[pluginId])
	});
	const existingOrigin = params.seenIds.get(pluginId);
	if (existingOrigin) {
		const duplicate = createManifestPluginRecord({
			candidate,
			manifestRecord,
			enabled: false,
			activationState,
			shouldLoadModules: context.shouldLoadModules
		});
		markPluginActivationDisabled(duplicate, `overridden by ${existingOrigin} plugin`);
		params.registry.plugins.push(duplicate);
		return null;
	}
	const enableState = isDreamingSidecar ? { enabled: true } : resolveEffectiveEnableState({
		id: pluginId,
		origin: candidate.origin,
		config: context.normalized,
		rootConfig: context.cfg,
		enabledByDefault: isPluginEnabledByDefaultForPlatform(manifestRecord),
		channelIds: manifestRecord.channels,
		activationSource: context.activationSource
	});
	const entry = context.normalized.entries[policyId];
	const record = createManifestPluginRecord({
		candidate,
		manifestRecord,
		enabled: enableState.enabled,
		activationState,
		shouldLoadModules: context.shouldLoadModules
	});
	record.kind = manifestRecord.kind;
	record.configUiHints = manifestRecord.configUiHints;
	record.configJsonSchema = manifestRecord.configSchema;
	record.commandAliases = manifestRecord.commandAliases;
	return {
		pluginId,
		policyId,
		isDreamingSidecar,
		activationState,
		enableState,
		entry,
		record
	};
}
function maybeThrowOnPluginLoadError(registry, throwOnLoadError, retained, previousRegistry, replacedIds) {
	if (!throwOnLoadError) return;
	const failedPlugins = registry.plugins.filter((entry) => {
		if (entry.status !== "error" || retained?.get(entry.id) === entry) return false;
		const previous = previousRegistry?.plugins.find((record) => record.id === entry.id);
		return replacedIds?.has(entry.id) || previous?.status !== "error" || previous.source !== entry.source || previous.failurePhase !== entry.failurePhase || previous.error !== entry.error;
	});
	if (failedPlugins.length > 0) throw new PluginLoadFailureError(registry, failedPlugins);
}
function activatePluginRegistry(registry, cacheKey, runtimeSubagentMode, workspaceDir, previousRegistry, trackActivationCleanup) {
	const activeSnapshot = captureActivePluginRegistrySnapshot();
	const retainedRegistry = previousRegistry ?? activeSnapshot.activeRegistry;
	const previousHookRegistry = getGlobalPluginRegistry();
	let stagedVersion;
	const isCurrentStage = () => stagedVersion !== void 0 && getActivePluginRegistry() === registry && getActivePluginRegistryVersion() === stagedVersion;
	try {
		stagedVersion = stageActivePluginRegistry(registry, cacheKey, runtimeSubagentMode, workspaceDir);
		if (!isCurrentStage()) throw new Error("Plugin registry activation was superseded");
		const activationAuthority = trackActivationCleanup ? capturePluginLifecycleAuthority(registry) : void 0;
		initializeGlobalHookRunner(registry);
		activateContextEngineRegistrations(registry, trackActivationCleanup ? {
			trackCleanup: trackActivationCleanup,
			assertCurrent: () => {
				if (stagedVersion === void 0 || !activationAuthority?.()) throw new Error("Plugin registry activation was superseded");
			}
		} : void 0);
		commitStagedPluginRegistry(retainedRegistry, registry);
		if (!isCurrentStage()) throw new Error("Plugin registry activation was superseded");
	} catch (error) {
		const rollbackCurrentStage = isCurrentStage();
		stagedVersion = void 0;
		if (rollbackCurrentStage) {
			const rollbackVersion = rollbackStagedPluginRegistry(activeSnapshot, retainedRegistry);
			if (getActivePluginRegistry() === activeSnapshot.activeRegistry && getActivePluginRegistryVersion() === rollbackVersion) {
				if (previousHookRegistry) initializeGlobalHookRunner(previousHookRegistry);
				else resetGlobalHookRunner();
			}
		}
		throw error;
	}
}
//#endregion
export { matchesScopedPluginOrDreamingSidecar as a, resolveAuthorizedDreamingSidecar as c, formatPluginFailureSummary as d, markPluginActivationDisabled as f, recordPluginError as h, detailPluginStartupTrace as i, validatePluginConfig as l, recordPluginConfiguredUnavailable as m, activatePluginRegistry as n, maybeThrowOnPluginLoadError as o, recordBundleDiagnostics as p, createPluginCandidatesFromManifestRegistry as r, preparePluginLoadRecord as s, PluginLoadFailureError as t, formatMissingPluginRegisterError as u };
