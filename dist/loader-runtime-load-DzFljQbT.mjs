import { l as normalizeOptionalString, t as hasNonEmptyString } from "./string-coerce-1VuiLaaR.mjs";
import { r as resolveGlobalMap } from "./global-singleton-DrXvEBww.mjs";
import { T as retirePluginCache, c as getPluginCache, k as withPluginCache, s as createPluginCache, x as releasePluginCacheInstance } from "./plugin-cache-BbahpD-b.mjs";
import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { p as normalizeTrimmedStringList, v as sortUniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { s as redactSensitiveText } from "./redact-BcXJu5HP.mjs";
import { c as isSecretRef, p as isValidSecretRef, s as isBuiltInDefaultSecretProviderRef } from "./ref-contract-Bfd9_-Lp.mjs";
import { h as parseSecretRef } from "./types.secrets-Dgbd2kyP.mjs";
import { n as describeRootFileOpenFailure } from "./boundary-file-read-CCth2Hwg.mjs";
import { r as resolveRealpathOrAbsolute } from "./boundary-path-CAv_plX7.mjs";
import "./utils-gjJ-tD2q.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { f as bindGatewayContextResolver, g as getGatewayContextResolver, o as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-1BXD1G3l.mjs";
import { n as PluginRuntimeCloseRetainedError } from "./runtime-close-error-DOUCCb00.mjs";
import { p as getActivePluginRegistryWorkspaceDirFromStateCore, u as findProviderRuntimeRegistrationInRegistry } from "./model-ref-shared-BRJ3VRZV.mjs";
import { n as getPluginRuntimeLoadContextState } from "./load-context-state-Dj3BDflJ.mjs";
import { n as prepareGatewayContextBindingOwner } from "./gateway-context-binding-owner-bQvbtsTz.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { o as resolveCompatibilityHostVersion, t as VERSION } from "./version-jg_14gWz.mjs";
import { r as createLazyRuntimeModule, t as createLazyRuntimeMethod } from "./lazy-runtime-CJrzFzqU.mjs";
import { T as selectApplicableRuntimeConfig, g as readRuntimeConfig, l as getRuntimeConfigSourceSnapshot, o as getRuntimeConfigSnapshot } from "./runtime-snapshot-BBYDJbw9.mjs";
import { a as safeRealpathSync, n as isPathInside, o as safeStatSync, r as openPluginRootFileSync } from "./path-safety-n0YlfCVt.mjs";
import { m as resolvePluginRuntimeExecutionArtifact, u as prefersBuiltPluginArtifacts } from "./bundled-dir-LfC_CFuw.mjs";
import { t as isPluginEnabledByDefaultForPlatform } from "./default-enablement-CEIbpabL.mjs";
import { t as normalizePluginPolicyId } from "./plugin-policy-id-1GfPFu0U.mjs";
import { T as kindsEqual, b as normalizePluginsConfigWithResolverCore, h as resolveMemorySlotDecision, p as resolveEffectivePluginActivationState, u as normalizePluginsConfig, w as hasKind } from "./config-state-DkDfCu7E.mjs";
import { t as cloneConfigWithResolutionFacts } from "./resolution-facts-D_pto3MV.mjs";
import { A as withPluginRegistryPreparationScope, S as markPluginRecordBorrowed, c as getPluginLoaderCacheState, g as isPluginRegistryActivated, h as isPluginRecordBorrowed, m as isPluginRecordActive } from "./registry-lifecycle-CjTFYNkp.mjs";
import { n as getPluginInstance, o as getPluginValueInstance, r as getPluginInstanceOwner } from "./plugin-instance-scope-BoTOTPL4.mjs";
import { E as withPluginRegistrationContext, f as getActivePluginRegistryWorkspaceDir, g as recordImportedPluginId } from "./runtime-DkPagH0y.mjs";
import { t as getPluginRuntimeGenerationRegistry } from "./generation-state-BWMrcMOM.mjs";
import { t as createEmptyPluginRegistry } from "./registry-empty-mS6HujHb.mjs";
import { a as resolveMergedModelProviderConfig } from "./model-provider-config-wdC9jpCz.mjs";
import { a as resolveAgentDir, g as resolveDefaultAgentDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { n as discoverOpenClawPlugins, v as resolveImmutableInstallIdentity, y as resolvePluginCandidateInstallOwner } from "./discovery-B5pUUvVG.mjs";
import { n as hashStableJson } from "./installed-plugin-index-hash-N3AVaUCF.mjs";
import { p as extractPluginInstallRecordsFromInstalledPluginIndex } from "./installed-plugin-index-LVFKT7eZ.mjs";
import { d as clearActiveDegradedPlugin, f as degradedPluginMatchesRoot, m as findActiveDegradedPlugin } from "./discovery-availability-CEoTdFoo.mjs";
import { t as shouldRejectHardlinkedPluginFiles } from "./hardlink-policy-DiVSy6jb.mjs";
import { t as compareOpenClawReleaseVersions } from "./npm-registry-spec-B_IER0ZB.mjs";
import { i as loadInstalledPluginIndexInstallRecordsSync } from "./installed-plugin-index-record-reader-CE166Xp8.mjs";
import { t as loadPluginManifestRegistryCore } from "./manifest-registry-BqtrPPLI.mjs";
import { t as resolvePluginControlPlaneFingerprint } from "./plugin-control-plane-context-Cn4izUMk.mjs";
import { n as nativeAdmissionStateFor, t as inheritPluginNativeAdmissions } from "./plugin-native-admission-state-COqSwm4O.mjs";
import { d as hasExplicitPluginIdScope, i as getCurrentPluginMetadataSnapshot, p as normalizePluginIdScope, u as createPluginIdScopeSet } from "./current-plugin-metadata-snapshot-BK2DY7Lo.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-DCRcDae6.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-DET-4y9k.mjs";
import { r as matchesDeclaredProviderOwner, t as buildDeclaredProviderOwnerIndex } from "./provider-owner-index-B3AXzLxc.mjs";
import { r as isOAuthRefreshFence } from "./oauth-refresh-marker-Dio1lCzm.mjs";
import { a as resolveTokenExpiryState, r as hasUsableOAuthCredential } from "./credential-state-NmgqOc1o.mjs";
import { c as toSafeImportPath, i as preparePluginModule, o as installOpenClawPluginSdkNativeResolver, t as getCachedPluginModuleLoader } from "./plugin-module-loader-cache-CJx9mYDU.mjs";
import { u as tryNativeRequireModule } from "./native-module-require-aTb-JMiu.mjs";
import { c as resolvePluginRuntimeModulePathWithDiagnostics, o as preparePluginLoaderAliases } from "./sdk-alias-DCaIS4rn.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { c as findActiveDegradedSecretOwner, n as SecretSurfaceUnavailableError } from "./runtime-degraded-state-SptB0g_t.mjs";
import { a as resolveManifestOwnerBasePolicyBlock, t as hasExplicitManifestOwnerTrust } from "./manifest-owner-policy-Dq1F0Dcx.mjs";
import { n as resolveManifestActivationPluginIds } from "./activation-planner-d5S6zg8U.mjs";
import { c as clearPluginRuntimeArtifactResolutionMemo, l as resolvePluginRuntimeArtifact, n as PluginInstance, r as bindPluginInstanceModuleLoader, t as getPluginSetupModuleLoader } from "./plugin-setup-module-B4MiOXOl.mjs";
import { a as isAuthModeAllowedForModel, r as resolveModelRuntimePolicy } from "./model-runtime-policy-DSkspt0X.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CrboVKXT.mjs";
import { a as resolveProviderConfigApiOwnerHint, i as resolveModelCatalogScope, n as hasConfiguredModelProvider } from "./provider-config-owner-xL-mNZoa.mjs";
import { t as resolvePluginActivationSourceConfig } from "./activation-source-config-vHcoMR69.mjs";
import { t as resolvePluginModuleExport } from "./module-export-BbYMQUy2.mjs";
import "./io.runtime-Ds5uC0Bf.mjs";
import { t as GATEWAY_SERVER_CAPS } from "./server-capabilities-y64LHoys.mjs";
import { i as runCommandWithTimeout } from "./exec-Bf6uhUA7.mjs";
import { t as resolveAllowedModelRefCore } from "./model-selection-resolve-B4Z5ZIMD.mjs";
import { n as getPluginRegistryInspectionResources, t as PluginRegistryInspectionResources } from "./registry-inspection-resources-COvkPmap.mjs";
import { a as resolveProviderRuntimeWorkspaceDir, r as matchesProviderPluginRef } from "./provider-registry-shared-Cov0065J.mjs";
import { a as resolveAuthProfileOrder, f as listProfilesForProvider } from "./order-CElLtwMu.mjs";
import { l as createUnavailableRuntime, s as runPluginRegistration } from "./setup-registry-CGxNMBUk.mjs";
import "./installed-plugin-index-records-DTzp62mN.mjs";
import { i as getPluginRuntimeLoadContext, n as buildPluginRuntimeLoadOptions, o as setPluginRuntimeLoadContext, r as createPluginRuntimeLoaderLogger, s as resolvePluginRegistrationConfigKey } from "./load-context-YqkPeFye.mjs";
import { a as registryContainsRuntimePluginIds, c as resolveRuntimeSubagentMode, n as getLoadedRuntimePluginRegistry, o as resolveCompatibleRuntimePluginRegistry, s as resolvePluginLoadCacheContext, t as createRuntimePluginManifestLookup } from "./active-runtime-registry-BrXk-dcA.mjs";
import { a as hasCompletedPluginRuntimeRegistration, t as bindPluginRuntimeArtifactSelection } from "./plugin-runtime-artifact-binding-CqK5OPco.mjs";
import { o as isKnownEnvApiKeyMarker, s as isNonSecretApiKeyMarker } from "./model-auth-markers-Clx9vUna.mjs";
import { c as mintSecretSentinel } from "./sentinel-DZP_CK2t.mjs";
import { E as createExternalAuthRuntime, r as createAuthProfileStoreRuntime } from "./store-BPXZsh12.mjs";
import { h as readProviderTextResponse, m as readProviderJsonResponse, o as createProviderHttpError } from "./provider-http-errors-CjVOxCE5.mjs";
import { d as resolveProviderRequestHeaders } from "./provider-request-config-WdycwKIG.mjs";
import { c as warn } from "./globals-XVSoVbNQ.mjs";
import { i as fetchWithSsrFGuard } from "./fetch-guard-DRapCKeS.mjs";
import { a as resolveDebugProxySettings, r as createDebugProxyWebSocketAgent } from "./env-ZuG6CRvK.mjs";
import { i as captureWsEventAsync, r as captureWsEvent } from "./runtime-BZkWDI2h.mjs";
import { t as createRealtimeTranscriptionWebSocketSession } from "./websocket-session-LsdOmAM1.mjs";
import { a as normalizeAgentToolResultMiddlewareRuntimeIds } from "./agent-tool-result-middleware-CYg_z_PV.mjs";
import { i as withProfile } from "./plugin-load-profile-Bh1H-B57.mjs";
import { p as requestSessionEventWake } from "./heartbeat-wake-do575_JN.mjs";
import { o as enqueueSystemEventFromSdk } from "./system-events-EwTKG-tz.mjs";
import { n as formatPluginTrustDiagnostic } from "./plugin-trust-7uLdzSo1.mjs";
import { a as matchesScopedPluginOrDreamingSidecar, c as resolveAuthorizedDreamingSidecar, d as formatPluginFailureSummary, f as markPluginActivationDisabled, h as recordPluginError, i as detailPluginStartupTrace, l as validatePluginConfig, m as recordPluginConfiguredUnavailable, n as activatePluginRegistry, o as maybeThrowOnPluginLoadError, p as recordBundleDiagnostics, r as createPluginCandidatesFromManifestRegistry, s as preparePluginLoadRecord, u as formatMissingPluginRegisterError } from "./loader-shared-yt0SORbS.mjs";
import { n as inspectBundleMcpRuntimeSupport } from "./bundle-mcp-dtpQHFMr.mjs";
import { a as resolvePluginCapabilityCatalog, i as capabilityCatalogFamilies, r as projectPluginContributions, t as createPluginRegistry } from "./registry-Bz-UU13h.mjs";
import { c as registerPluginDashboardCapabilities, o as PluginDashboardDeclarationError } from "./board-widget-content-kinds-Dtlmq87Q.mjs";
import { a as resolveSetupChannelRegistration, i as resolveBundledRuntimeChannelRegistration, n as loadBundledRuntimeChannelPlugin, o as shouldLoadChannelPluginInSetupRuntime, r as mergeSetupRuntimeChannelPlugin, t as channelPluginIdBelongsToManifest } from "./loader-channel-setup-_ipy9Zx8.mjs";
import { t as resolveExternalPluginRuntimeDependencyRepairHint } from "./official-external-plugin-repair-hints-Ue6gYZgR.mjs";
import { i as resolveConfiguredRuntimePluginInstallCandidate } from "./official-runtime-plugins-WPvV9MD6.mjs";
import { n as externalCliDiscoveryForProviderAuth } from "./external-cli-discovery-kYfv_bUN.mjs";
import { t as canResolveEnvSecretRefInReadOnlyPath } from "./secret-ref-readonly.internal-BueGE3VV.mjs";
import { t as resolveEnvApiKey } from "./model-auth-env-CPdn6zH8.mjs";
import { M as resolveDirectProviderCredentialMode, b as resolveUsableCustomProviderApiKey, c as profileTypeToAuthMode, r as hasSecretRefProviderApiKey, u as providerConfigMatchesRuntimeSnapshot, v as resolveProviderEntryApiKeyProfileReference, y as resolveRuntimeProviderConfigApiKeyAuth } from "./model-auth-provider-config-C_EL9CxV.mjs";
import { a as resolveDiscoverableProviderOwnerPluginIds, c as resolveExternalAuthProfileProviderPluginIds, f as resolveOwningPluginIdsForProviderRef, n as resolveActivatableProviderOwnerPluginIds, o as resolveDiscoveredProviderPluginIds, r as resolveBundledProviderCompatPluginIds, s as resolveEnabledProviderPluginIds, u as resolveOwningPluginIdsForModelRefs } from "./providers-3h1HIigh.mjs";
import { t as attachModelProviderLocalServiceReconciler } from "./provider-local-service-reconcile-HqZ_bnuN.mjs";
import { n as withActivatedPluginIds, t as resolveBundledCompatActivationInputs } from "./activation-context-ZGPJ_bJQ.mjs";
import fs from "node:fs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import { setImmediate } from "node:timers/promises";
//#region src/plugins/capability-catalog-context.ts
function createPluginCapabilityCatalogContext(availability) {
	const { isProviderApiKeyConfigured, isProviderApiKeyConfiguredAsync, isProviderAuthProfileConfigured, isProviderAuthProfileConfiguredAsync, resolveProviderAuthProfileApiKey } = availability;
	return Object.freeze({
		isProviderApiKeyConfigured,
		isProviderApiKeyConfiguredAsync,
		isProviderAuthProfileConfigured,
		isProviderAuthProfileConfiguredAsync,
		resolveAgentDir,
		createRealtimeTranscriptionWebSocketSession,
		resolveProviderRequestHeaders,
		resolveProviderAuthProfileApiKey,
		resolveApiKeyForProvider: async (params) => (await import("./runtime-model-auth.runtime.js")).resolveProviderRuntimeApiKey(params),
		captureWsEvent,
		captureWsEventAsync,
		createDebugProxyWebSocketAgent,
		resolveDebugProxySettings,
		fetchWithSsrFGuard,
		createProviderHttpError,
		readProviderJsonResponse,
		readProviderTextResponse,
		formatErrorMessage,
		warn,
		redactSensitiveText
	});
}
//#endregion
//#region src/plugins/loader-cache.ts
/** Registry reuse is off for explicit opt-outs and for raw env-substituted config loads. */
function isPluginRegistryCacheEnabled(options) {
	return options.cache !== false && options.resolveRawConfigEnvVars !== true;
}
function clearPluginRegistryLoadCache() {
	clearPluginRuntimeArtifactResolutionMemo();
	getPluginLoaderCacheState().clearCachedRegistries();
}
function resolvePluginRegistryLoadCacheKey(options = {}) {
	return resolvePluginLoadCacheContext(options).cacheKey;
}
function isPluginRegistryLoadInFlight(options = {}) {
	const context = resolvePluginLoadCacheContext(options);
	return context.cacheState.isLoadInFlight(context.cacheKey);
}
//#endregion
//#region src/plugins/runtime/runtime-config.ts
function createRuntimeConfig() {
	return {
		current: (options) => {
			const config = readRuntimeConfig();
			return options?.clone ? cloneConfigWithResolutionFacts(config) : config;
		},
		mutateConfigFile: async (params) => {
			const { mutateConfigFile } = await import("./mutate-CJrOnF4H.mjs");
			return await mutateConfigFile(params);
		},
		replaceConfigFile: async (params) => {
			const { replaceConfigFile } = await import("./mutate-CJrOnF4H.mjs");
			return await replaceConfigFile(params);
		}
	};
}
//#endregion
//#region src/plugins/runtime/native-deps.ts
function formatNativeDependencyHint(params) {
	const manager = params.manager ?? "pnpm";
	const rebuildCommand = params.rebuildCommand ?? `${manager === "npm" || manager === "yarn" ? manager : "pnpm"} rebuild ${params.packageName}`;
	const steps = [
		params.approveBuildsCommand ?? (manager === "pnpm" ? `pnpm approve-builds (select ${params.packageName})` : void 0),
		rebuildCommand,
		params.downloadCommand
	].filter((step) => Boolean(step));
	if (steps.length === 0) return `Install ${params.packageName} and rebuild its native module.`;
	return `Install ${params.packageName} and rebuild its native module (${steps.join("; ")}).`;
}
//#endregion
//#region src/plugins/runtime/runtime-system.ts
const loadHeartbeatRunnerRuntime = createLazyRuntimeModule(() => import("./heartbeat-runner-DWUVEdXo.mjs"));
const runHeartbeatOnceInternal = createLazyRuntimeMethod(loadHeartbeatRunnerRuntime, (runtime) => runtime.runHeartbeatOnce);
/** Creates the plugin runtime system facade with heartbeat/event/process helpers. */
function createRuntimeSystem() {
	const requestHeartbeatNow = (opts) => requestSessionEventWake({
		source: opts?.source ?? "other",
		intent: opts?.intent ?? "immediate",
		reason: opts?.reason,
		coalesceMs: opts?.coalesceMs,
		agentId: opts?.agentId,
		sessionKey: opts?.sessionKey,
		heartbeat: opts?.heartbeat
	});
	return {
		enqueueSystemEvent: enqueueSystemEventFromSdk,
		requestHeartbeat: requestSessionEventWake,
		requestHeartbeatNow,
		runHeartbeatOnce: (opts) => {
			const { reason, agentId, sessionKey, heartbeat } = opts ?? {};
			return runHeartbeatOnceInternal({
				reason,
				agentId,
				sessionKey,
				heartbeat: heartbeat ? { target: heartbeat.target } : void 0
			});
		},
		runCommandWithTimeout,
		formatNativeDependencyHint
	};
}
//#endregion
//#region src/plugins/runtime/runtime-base.ts
function unavailable(method) {
	return () => {
		throw new Error(`${method} is only available through the plugin runtime proxy.`);
	};
}
/** Host-owned facades survive later path-loaded runtime materialization unchanged. */
function createRuntimeBase() {
	let system;
	return {
		getConfig: readRuntimeConfig,
		capabilities: Object.freeze([GATEWAY_SERVER_CAPS.SENDER_RESTRICTED_HIDDEN_HELPERS]),
		config: createRuntimeConfig(),
		state: {
			resolveStateDir,
			openBlobStore: unavailable("openBlobStore"),
			openKeyedStore: unavailable("openKeyedStore"),
			openKeyedStoreV2: unavailable("openKeyedStoreV2"),
			openSyncKeyedStore: unavailable("openSyncKeyedStore"),
			openChannelIngressQueue: unavailable("openChannelIngressQueue"),
			openChannelIngressDrain: unavailable("openChannelIngressDrain")
		},
		get system() {
			return system ??= createRuntimeSystem();
		}
	};
}
//#endregion
//#region src/plugins/loader-module-runtime.ts
const LAZY_RUNTIME_PROPERTIES = {
	version: true,
	decisions: true,
	gateway: true,
	config: true,
	agent: true,
	subagent: true,
	system: true,
	media: true,
	mediaUnderstanding: true,
	tts: true,
	channel: true,
	events: true,
	logging: true,
	state: true,
	modelAuth: true,
	imageGeneration: true,
	videoGeneration: true,
	musicGeneration: true,
	llm: true,
	hooks: true,
	nodes: true,
	sandbox: true,
	worktrees: true,
	webSearch: true,
	modelConfig: true,
	capabilities: true
};
function runPluginRegisterSyncInRegistry(register, api, registry, pluginId) {
	const owner = getPluginValueInstance(api);
	const run = () => withPluginRegistrationContext(registry, pluginId, () => {
		const inspection = getPluginRegistryInspectionResources(registry);
		const registerPlugin = () => runPluginRegistration(register, api, "reject", (pending) => {
			inspection?.trackRegistration(pending);
		});
		if (inspection) inspection.runRegistration(pluginId, registerPlugin, owner ? (cleanup) => owner.runCleanup(cleanup) : void 0);
		else registerPlugin();
	}, {
		registerMemoryCapability: api.registerMemoryCapability,
		instance: owner
	});
	if (owner) {
		owner.run(run);
		owner.toolRegistrationComplete ||= api.registrationMode === "full" || api.registrationMode === "tool-discovery";
	} else run();
}
function createPluginModuleLoader(options) {
	const cache = getPluginCache();
	const captured = {
		...options,
		expectedSourceDigests: options.expectedSourceDigests ? { ...options.expectedSourceDigests } : void 0
	};
	const createLoaderForModule = (modulePath) => {
		if (captured.installNativeSdkResolver !== false && captured.tryNative !== false) installOpenClawPluginSdkNativeResolver({
			argv1: process.argv[1],
			moduleUrl: import.meta.url,
			pluginModulePath: modulePath,
			devSourceRoot: captured.devSourceRoot,
			pluginSdkResolution: captured.pluginSdkResolution
		});
		return getCachedPluginModuleLoader({
			modulePath,
			importerUrl: import.meta.url,
			loaderFilename: captured.loaderFilename ?? modulePath,
			devSourceRoot: captured.devSourceRoot,
			pluginSdkResolution: captured.pluginSdkResolution,
			...captured.tryNative !== void 0 ? { tryNative: captured.tryNative } : {}
		});
	};
	const inspection = (owner) => getPluginRegistryInspectionResources(owner.registry) === void 0 ? {} : {
		inspectionSourceIdentity: owner.immutableInstallIdentity,
		inspectionRetention: nativeAdmissionStateFor(cache).inspectionNativeEsm
	};
	return (modulePath, owner) => withPluginCache(cache, () => {
		if (!owner) return createLoaderForModule(modulePath)(toSafeImportPath(modulePath));
		let instance = getPluginInstance(owner.record);
		if (!instance) {
			instance = new PluginInstance(owner.record.id, owner);
			bindPluginInstanceModuleLoader({
				instance,
				origin: owner.record.origin,
				source: modulePath,
				rootDir: owner.rootDir,
				standalone: owner.standalone,
				expectedSourceDigest: captured.expectedSourceDigests?.[owner.record.id],
				...inspection(owner),
				devSourceRoot: captured.devSourceRoot,
				pluginSdkResolution: captured.pluginSdkResolution,
				createHostModuleLoader: () => createLoaderForModule(modulePath)
			});
		}
		const expected = captured.expectedSourceDigests?.[owner.record.id];
		if (expected !== void 0 && instance.sourceDigest !== expected) throw new Error(`Plugin ${owner.record.id} captured source changed after installation`);
		return instance.loadModule(modulePath);
	});
}
function formatPluginRuntimeModuleResolutionError(params) {
	const { resolution } = params;
	const candidates = resolution.candidates.length > 0 ? resolution.candidates.join(", ") : "<none>";
	return [
		"Unable to resolve plugin runtime module",
		`loader=${resolution.modulePath ?? "<unresolved>"}`,
		`packageRoot=${resolution.packageRoot ?? "<none>"}`,
		`pluginSdkResolution=${params.pluginSdkResolution ?? "auto"}`,
		`candidates=${candidates}`,
		...resolution.error ? [`resolverError=${resolution.error}`] : []
	].join("; ");
}
/** Lazily materializes the broad plugin runtime only when registration reads it. */
function createLazyPluginRuntime(params) {
	const cache = getPluginCache();
	const resolveRuntimeModule = () => {
		const resolution = resolvePluginRuntimeModulePathWithDiagnostics({
			devSourceRoot: params.devSourceRoot,
			pluginSdkResolution: params.pluginSdkResolution
		});
		if (!resolution.resolvedPath) throw new Error(formatPluginRuntimeModuleResolutionError({
			resolution,
			pluginSdkResolution: params.pluginSdkResolution
		}));
		const resolvedPath = resolution.resolvedPath;
		return withPluginCache(cache, () => withProfile({ source: resolvedPath }, "runtime-module", () => {
			const native = tryNativeRequireModule(resolvedPath, { aliasMap: preparePluginLoaderAliases({
				modulePath: resolvedPath,
				moduleUrl: import.meta.url,
				devSourceRoot: params.devSourceRoot,
				pluginSdkResolution: params.pluginSdkResolution
			}).resolveAlias });
			if (!native.ok) throw new Error(`Unable to load host plugin runtime natively: ${resolvedPath}. Use a supported native TypeScript loader for a source host, or rebuild the host runtime.`);
			return native.moduleExport;
		}));
	};
	const base = createRuntimeBase();
	let resolvedRuntime = null;
	const resolveRuntime = () => {
		resolvedRuntime ??= withPluginCache(cache, () => {
			const { createPluginRuntime } = resolveRuntimeModule();
			if (typeof createPluginRuntime !== "function") throw new Error("Plugin runtime module missing createPluginRuntime export");
			return createPluginRuntime(params.runtimeOptions, base);
		});
		return resolvedRuntime;
	};
	const getRuntimeProperty = (prop, ...receiver) => {
		if (!resolvedRuntime) {
			if (prop === "gateway" || prop === "hooks" || prop === "nodes" || prop === "subagent" || prop === "modelAuth" || prop === "modelConfig") {
				const value = params.runtimeOptions?.[prop];
				if (value !== void 0) return value;
			}
			if (prop === "version") return VERSION;
			if (prop === "capabilities" || prop === "config" || prop === "state" || prop === "system") return base[prop];
		}
		return receiver.length === 0 ? Reflect.get(resolveRuntime(), prop) : Reflect.get(resolveRuntime(), prop, receiver[0]);
	};
	const resolveLazyRuntimeDescriptor = (prop) => {
		if (resolvedRuntime || !Object.hasOwn(LAZY_RUNTIME_PROPERTIES, prop)) return Reflect.getOwnPropertyDescriptor(resolveRuntime(), prop);
		const descriptor = {
			configurable: true,
			enumerable: true,
			get() {
				return getRuntimeProperty(prop);
			}
		};
		if (prop !== "modelAuth" && prop !== "modelConfig") descriptor.set = (value) => {
			Reflect.set(resolveRuntime(), prop, value);
		};
		return descriptor;
	};
	let preparingOwner = true;
	const runtime = new Proxy({}, {
		get: (target, prop, receiver) => Object.hasOwn(target, prop) ? Reflect.get(target, prop, receiver) : getRuntimeProperty(prop, receiver),
		set(target, prop, value, receiver) {
			return Reflect.set(Object.hasOwn(target, prop) ? target : resolveRuntime(), prop, value, receiver);
		},
		has(target, prop) {
			return Object.hasOwn(target, prop) || Object.hasOwn(LAZY_RUNTIME_PROPERTIES, prop) || Reflect.has(resolveRuntime(), prop);
		},
		ownKeys(target) {
			return [...Object.keys(LAZY_RUNTIME_PROPERTIES), ...Reflect.ownKeys(target)];
		},
		getOwnPropertyDescriptor(target, prop) {
			return Reflect.getOwnPropertyDescriptor(target, prop) ?? (preparingOwner ? void 0 : resolveLazyRuntimeDescriptor(prop));
		},
		defineProperty(target, prop, attributes) {
			return Reflect.defineProperty(preparingOwner || Object.hasOwn(target, prop) ? target : resolveRuntime(), prop, attributes);
		},
		deleteProperty(target, prop) {
			return Reflect.deleteProperty(Object.hasOwn(target, prop) ? target : resolveRuntime(), prop);
		},
		getPrototypeOf() {
			return Reflect.getPrototypeOf(resolveRuntime());
		}
	});
	prepareGatewayContextBindingOwner(runtime);
	preparingOwner = false;
	const subagent = params.runtimeOptions ? Object.getOwnPropertyDescriptor(params.runtimeOptions, "subagent")?.value : void 0;
	if (subagent && typeof subagent === "object") bindGatewayContextResolver(runtime, getGatewayContextResolver(subagent));
	return runtime;
}
function kindIncludes(kind, target) {
	return kind === target || Array.isArray(kind) && kind.includes(target);
}
function formatBundledChannelWrongLoaderError(kind) {
	if (kindIncludes(kind, "bundled-channel-setup-entry")) return "bundled channel setup entry requires setup-runtime loader";
	if (kindIncludes(kind, "bundled-channel-entry")) return "bundled channel entry requires setup-runtime loader";
	return null;
}
//#endregion
//#region src/plugins/loader-provenance.ts
const lastProvenanceWarning = resolveGlobalMap(Symbol.for("openclaw.pluginProvenanceWarnings"), "close-and-restart");
function createPathMatcher() {
	return {
		exact: /* @__PURE__ */ new Set(),
		dirs: []
	};
}
function addPathToMatcher(matcher, rawPath, env = process.env) {
	const trimmed = rawPath.trim();
	if (!trimmed) return;
	const resolved = resolveUserPath(trimmed, env);
	if (!resolved) return;
	const canonical = safeRealpathSync(resolved) ?? resolved;
	if (matcher.exact.has(canonical) || matcher.dirs.includes(canonical)) return;
	if (safeStatSync(canonical)?.isDirectory()) {
		matcher.dirs.push(canonical);
		return;
	}
	matcher.exact.add(canonical);
}
function matchesPathMatcher(matcher, sourcePath) {
	return matcher.exact.has(sourcePath) || matcher.dirs.some((dirPath) => isPathInside(dirPath, sourcePath));
}
function formatPluginInspectCommand(pluginId) {
	return `openclaw plugins inspect ${quoteCliArg(pluginId)}`;
}
/** Builds provenance matchers from configured load paths and install records. */
function buildProvenanceIndex(params) {
	const loadPathMatcher = createPathMatcher();
	for (const loadPath of params.normalizedLoadPaths) addPathToMatcher(loadPathMatcher, loadPath, params.env);
	const installRules = /* @__PURE__ */ new Map();
	const installs = params.installRecords ?? loadInstalledPluginIndexInstallRecordsSync({ env: params.env });
	for (const [pluginId, install] of Object.entries(installs)) {
		const rule = {
			record: install,
			trackedWithoutPaths: false,
			matcher: createPathMatcher()
		};
		const trackedPaths = normalizeTrimmedStringList([install.installPath, install.sourcePath]);
		if (trackedPaths.length === 0) rule.trackedWithoutPaths = true;
		else for (const trackedPath of trackedPaths) addPathToMatcher(rule.matcher, trackedPath, params.env);
		installRules.set(pluginId, rule);
	}
	return {
		loadPathMatcher,
		installRules
	};
}
function isTrackedByProvenance(params) {
	const sourcePath = resolveUserPath(params.source, params.env);
	const canonicalSourcePath = safeRealpathSync(sourcePath) ?? sourcePath;
	const installRule = params.index.installRules.get(params.pluginId);
	if (installRule) {
		if (installRule.trackedWithoutPaths) return true;
		if (matchesPathMatcher(installRule.matcher, canonicalSourcePath)) return true;
	}
	return matchesPathMatcher(params.index.loadPathMatcher, canonicalSourcePath);
}
/** Warns when an open plugin allowlist may auto-load non-bundled plugins. */
function warnWhenAllowlistIsOpen(params) {
	if (!params.emitWarning || !params.pluginsEnabled) return;
	const autoDiscoverable = params.discoverablePlugins.filter((entry) => (entry.origin === "workspace" || entry.origin === "global") && !params.explicitlyEnabledPluginIds?.has(entry.id));
	if (autoDiscoverable.length === 0) return;
	const allDiscoveredIds = new Set(params.discoverablePlugins.map((entry) => entry.id));
	const hasConfiguredAllowlist = params.allow.length > 0;
	if (params.allow.some((id) => allDiscoveredIds.has(id))) return;
	if (params.warningCache.hasOpenAllowlistWarning(params.warningCacheKey)) return;
	const preview = autoDiscoverable.slice(0, 6).map((entry) => `${entry.id} (${entry.source})`).join(", ");
	const truncated = autoDiscoverable.length > 6;
	const extra = truncated ? ` (+${autoDiscoverable.length - 6} more)` : "";
	const inspectCommands = autoDiscoverable.map((entry) => `'${formatPluginInspectCommand(entry.id)}'`).join(", ");
	const remediation = truncated ? "Run 'openclaw plugins list --enabled --verbose' to enumerate every discovered plugin id, inspect trusted ids with 'openclaw plugins inspect <id>', and add the ones you trust to plugins.allow in openclaw.json." : `To trust them explicitly, set plugins.allow in openclaw.json (e.g. "plugins": { "allow": [${autoDiscoverable.map((entry) => JSON.stringify(entry.id)).join(", ")}] }). Run 'openclaw plugins list --enabled --verbose' or ${inspectCommands} to confirm plugin ids.`;
	params.warningCache.recordOpenAllowlistWarning(params.warningCacheKey);
	if (!hasConfiguredAllowlist) {
		params.logger.warn(`[plugins] plugins.allow is empty; discovered non-bundled plugins may auto-load: ${preview}${extra}. ${remediation}`);
		return;
	}
	const unmatchedEntries = params.allow.filter((id) => !allDiscoveredIds.has(id));
	const unmatchedPreview = unmatchedEntries.slice(0, 6).map((id) => `"${id}"`).join(", ");
	const unmatchedExtra = unmatchedEntries.length > 6 ? ` (+${unmatchedEntries.length - 6} more)` : "";
	params.logger.warn(`[plugins] plugins.allow entries ${unmatchedPreview}${unmatchedExtra} do not match any discovered plugin ids; discovered non-bundled plugins: ${preview}${extra}. Use the plugin id (not a channel id or npm package name).`);
}
/** Reports untracked plugins and unverified install provenance without refusing runtime access. */
function warnAboutUntrackedLoadedPlugins(params) {
	const allowSet = new Set(params.allowlist);
	for (const plugin of params.registry.plugins) {
		if (plugin.status !== "loaded" || plugin.origin === "bundled") continue;
		const reason = plugin.trust?.reason;
		const unverifiedInstall = reason === "provenance-missing" || reason === "provenance-invalid" || reason === "owner-ambiguous" || reason === "install-path-mismatch" || reason === "record-missing" && plugin.origin === "global";
		if (!unverifiedInstall && allowSet.has(plugin.id)) continue;
		const installOwner = params.installOwnerByPluginId.get(plugin.id);
		if (!unverifiedInstall && installOwner && isTrackedByProvenance({
			pluginId: installOwner,
			source: plugin.source,
			index: params.provenance,
			env: params.env
		})) continue;
		const diagnostic = plugin.trust ? ` ${formatPluginTrustDiagnostic(plugin.trust)}.` : "";
		const message = `OpenClaw can't verify where this plugin came from. Review it with '${formatPluginInspectCommand(plugin.id)}'. Adding it to plugins.allow lets it load, but does not make it trusted. If it's an official plugin, reinstall it from its official npm package or its official ClawHub listing to enable trusted features.${diagnostic}`;
		if (!params.registry.diagnostics.some((entry) => entry.pluginId === plugin.id && entry.source === plugin.source && entry.message === message)) params.registry.diagnostics.push({
			level: "warn",
			pluginId: plugin.id,
			source: plugin.source,
			message
		});
		if (params.emitWarning) {
			const warningKey = hashStableJson([
				plugin.source,
				plugin.trust,
				installOwner ? params.provenance.installRules.get(installOwner)?.record : void 0
			]);
			if (lastProvenanceWarning.get(plugin.id) !== warningKey) {
				lastProvenanceWarning.set(plugin.id, warningKey);
				params.logger.warn(`[plugins] ${plugin.id}: ${message} (${plugin.source})`);
			}
		}
	}
}
//#endregion
//#region src/plugins/loader-channel-runtime.ts
/**
* Handles the setup-entry channel path.
* Returns true when the candidate is complete (loaded, disabled, or failed).
*/
function loadSetupRuntimeChannelCandidate(params) {
	const { manifestRecord, record, registrationPlan, runtimeCandidateEntry, registryBuilder } = params;
	if (!registrationPlan.loadSetupEntry || !manifestRecord.setupSource) return false;
	const recordSetupFailure = (error, phase, message) => {
		registryBuilder.rollbackPluginGlobalSideEffects(record.id, record);
		recordPluginError({
			logger: params.logger,
			registry: registryBuilder.registry,
			record,
			seenIds: params.seenIds,
			phase,
			error,
			logPrefix: `[plugins] ${record.id} ${message} from ${record.source}: `,
			diagnosticMessagePrefix: `${message}: `,
			diagnosticCode: "channel-setup-failure"
		});
		return true;
	};
	const setupRegistration = resolveSetupChannelRegistration(params.mod);
	if ("loadError" in setupRegistration) return recordSetupFailure(setupRegistration.loadError, "load", "failed to load setup entry");
	if (!setupRegistration.plugin) return false;
	if (!channelPluginIdBelongsToManifest({
		channelId: setupRegistration.plugin.id,
		pluginId: record.id,
		manifestChannels: manifestRecord.channels
	})) {
		params.pushPluginLoadError(`plugin id mismatch (config uses "${record.id}", setup export uses "${setupRegistration.plugin.id}")`);
		return true;
	}
	const api = registryBuilder.createApi(record, {
		config: params.cfg,
		pluginConfig: {},
		hookPolicy: params.entry?.hooks,
		registrationMode: registrationPlan.mode
	});
	const instance = getPluginInstance(record);
	const applyChannelRuntime = (setter) => {
		if (!setter) return;
		if (!instance) {
			setter(api.runtime);
			return;
		}
		instance.run(() => setter(api.runtime));
	};
	let mergedSetupPlugin = setupRegistration.plugin;
	try {
		applyChannelRuntime(setupRegistration.setChannelRuntime);
	} catch (error) {
		return recordSetupFailure(error, "load", "failed to apply setup channel runtime");
	}
	const runtimeEntry = registrationPlan.loadSetupRuntimeEntry && setupRegistration.usesBundledSetupContract ? resolvePluginRuntimeExecutionArtifact(runtimeCandidateEntry) : void 0;
	if (runtimeEntry && runtimeEntry.source !== params.safeSource) {
		const { source: runtimeModuleSource, rootDir: runtimeModuleRoot } = runtimeEntry;
		const runtimeOpened = openPluginRootFileSync({
			filePath: runtimeModuleSource,
			rootPath: runtimeModuleRoot,
			rejectHardlinks: params.rejectHardlinks
		});
		if (!runtimeOpened.ok) {
			params.pushPluginLoadError(describeRootFileOpenFailure({
				failure: runtimeOpened,
				subject: "plugin entry path",
				boundaryLabel: "plugin root",
				filePath: runtimeModuleSource
			}));
			return true;
		}
		const safeRuntimeSource = runtimeOpened.path;
		fs.closeSync(runtimeOpened.fd);
		let runtimeMod;
		try {
			runtimeMod = withProfile({
				pluginId: record.id,
				source: safeRuntimeSource
			}, "load-setup-runtime-entry", () => params.loadPluginModule(safeRuntimeSource));
		} catch (error) {
			return recordSetupFailure(error, "load", "failed to load setup-runtime entry");
		}
		const runtimeRegistration = resolveBundledRuntimeChannelRegistration(runtimeMod);
		if (runtimeRegistration.id && runtimeRegistration.id !== record.id) {
			params.pushPluginLoadError(`plugin id mismatch (config uses "${record.id}", runtime entry uses "${runtimeRegistration.id}")`);
			return true;
		}
		if (runtimeRegistration.setChannelRuntime) try {
			if (runtimeRegistration.setChannelRuntime !== setupRegistration.setChannelRuntime) applyChannelRuntime(runtimeRegistration.setChannelRuntime);
		} catch (error) {
			return recordSetupFailure(error, "load", "failed to apply setup-runtime channel runtime");
		}
		const runtimePluginRegistration = loadBundledRuntimeChannelPlugin({ registration: runtimeRegistration });
		if ("loadError" in runtimePluginRegistration) return recordSetupFailure(runtimePluginRegistration.loadError, "load", "failed to load setup-runtime channel entry");
		if (runtimePluginRegistration.plugin) {
			if (runtimePluginRegistration.plugin.id && runtimePluginRegistration.plugin.id !== record.id) {
				params.pushPluginLoadError(`plugin id mismatch (config uses "${record.id}", runtime export uses "${runtimePluginRegistration.plugin.id}")`);
				return true;
			}
			mergedSetupPlugin = mergeSetupRuntimeChannelPlugin(runtimePluginRegistration.plugin, setupRegistration.plugin);
		}
	}
	if (!channelPluginIdBelongsToManifest({
		channelId: mergedSetupPlugin.id,
		pluginId: record.id,
		manifestChannels: manifestRecord.channels
	})) {
		params.pushPluginLoadError(`plugin id mismatch (config uses "${record.id}", setup export uses "${mergedSetupPlugin.id}")`);
		return true;
	}
	if (registrationPlan.mode === "setup-runtime" && setupRegistration.registerSetupRuntime) try {
		runPluginRegisterSyncInRegistry((registrationApi) => setupRegistration.registerSetupRuntime?.(registrationApi), api, registryBuilder.registry, record.id);
	} catch (error) {
		return recordSetupFailure(error, "register", "failed to register setup-runtime channel side effects");
	}
	try {
		api.registerChannel(mergedSetupPlugin);
	} catch (error) {
		return recordSetupFailure(error, "load", "failed to register setup channel");
	}
	registryBuilder.registry.plugins.push(record);
	params.seenIds.set(record.id, record.origin);
	return true;
}
//#endregion
//#region src/plugins/loader-registration-plan.ts
function createRegistrationPlan(mode) {
	const loadSetupEntry = mode === "setup-only" || mode === "setup-runtime";
	return {
		/** Public compatibility label passed to plugin register(api). */
		mode,
		/** Load a setup entry instead of the normal runtime entry. */
		loadSetupEntry,
		/** Setup flow also needs the runtime channel entry for runtime setters/plugin shape. */
		loadSetupRuntimeEntry: mode === "setup-runtime",
		/** Apply runtime capability policy such as memory-slot selection. */
		runRuntimeCapabilityPolicy: !loadSetupEntry,
		/** Register metadata that only belongs to live activation. */
		runFullActivationOnlyRegistrations: mode === "full"
	};
}
/** Converts loader intent into explicit entrypoint and activation behavior. */
function resolvePluginRegistrationPlan(params) {
	if (params.cliMetadata) return params.enableStateEnabled ? createRegistrationPlan("cli-metadata") : null;
	if (params.canLoadScopedSetupOnlyChannelPlugin) return createRegistrationPlan("setup-only");
	if (!params.enableStateEnabled) return null;
	if (params.toolDiscovery) return createRegistrationPlan("tool-discovery");
	if (params.shouldLoadModules && !params.validateOnly && shouldLoadChannelPluginInSetupRuntime({
		manifestChannels: params.manifestRecord.channels,
		setupSource: params.manifestRecord.setupSource,
		cfg: params.cfg,
		env: params.env,
		channelPluginLoadIntent: params.channelPluginLoadIntent
	})) return createRegistrationPlan("setup-runtime");
	return createRegistrationPlan(params.runtimeSideEffects ? "full" : "discovery");
}
//#endregion
//#region src/plugins/loader-runtime-candidate.ts
function prepareRuntimePluginConfig(params) {
	const { candidate, manifestRecord, context, preparedConfig } = params;
	if (!preparedConfig.validation) {
		const policyId = normalizePluginPolicyId(manifestRecord.id);
		preparedConfig.validation = validatePluginConfig({
			origin: candidate.origin,
			schema: manifestRecord.configSchema,
			cacheKey: manifestRecord.schemaCacheKey,
			value: context.normalized.entries[policyId]?.config,
			sourceValue: manifestRecord.configContracts?.secretInputs ? context.activationSource.plugins.entries[policyId]?.config : void 0
		});
		preparedConfig.input = JSON.stringify(preparedConfig.validation);
	}
	return preparedConfig.validation;
}
function loadRuntimePluginCandidate(params) {
	const { candidate, manifestRecord, context, state } = params;
	const cliMetadata = params.options.mode === "cli-metadata";
	const { registry } = params.registryBuilder;
	const prepared = preparePluginLoadRecord({
		candidate,
		manifestRecord,
		context,
		onlyPluginIdSet: params.onlyPluginIdSet,
		dreamingSidecar: params.dreamingSidecar,
		registry,
		seenIds: state.seenIds
	});
	if (!prepared) return;
	const { pluginId, isDreamingSidecar, activationState, enableState, entry, record } = prepared;
	const finish = () => {
		registry.plugins.push(record);
		state.seenIds.set(pluginId, candidate.origin);
	};
	const disableMemoryPlugin = (reason) => {
		record.enabled = false;
		markPluginActivationDisabled(record, reason);
		finish();
	};
	const recovery = params.options.moduleRecoveries?.get(pluginId);
	const pluginRoot = recovery ? candidate.rootDir : resolveRealpathOrAbsolute(candidate.rootDir);
	const degradedPluginForId = findActiveDegradedPlugin(pluginId);
	const degradedPlugin = degradedPluginForId && degradedPluginMatchesRoot(degradedPluginForId, pluginRoot) ? degradedPluginForId : void 0;
	const clearMismatchedQuarantineAfterLoad = enableState.enabled && Boolean(degradedPluginForId) && !degradedPlugin;
	if (enableState.enabled && degradedPlugin) {
		recordPluginConfiguredUnavailable({
			registry,
			record,
			seenIds: state.seenIds,
			degradedPlugin
		});
		return;
	}
	const trustedLocalScopedChannelSetupImport = resolveManifestOwnerBasePolicyBlock({
		plugin: { id: pluginId },
		normalizedConfig: context.normalized
	}) === null && (hasExplicitManifestOwnerTrust({
		plugin: { id: pluginId },
		normalizedConfig: context.normalized
	}) || candidate.origin === "workspace" && activationState.source === "auto");
	const blockUntrustedLocalScopedChannelSetupImport = !cliMetadata && context.includeSetupOnlyChannelPlugins && !params.validateOnly && Boolean(params.onlyPluginIdSet) && manifestRecord.channels.length > 0 && candidate.origin !== "bundled" && !trustedLocalScopedChannelSetupImport;
	const pushPluginLoadError = (message) => {
		params.registryBuilder.rollbackPluginGlobalSideEffects(record.id, record);
		recordPluginError({
			registry,
			seenIds: state.seenIds,
			record,
			phase: "validation",
			error: message
		});
	};
	const missingDependencyHint = resolveExternalPluginRuntimeDependencyRepairHint({
		pluginId,
		packageName: candidate.packageName,
		packageBuild: candidate.packageManifest?.build
	});
	if (blockUntrustedLocalScopedChannelSetupImport) {
		markPluginActivationDisabled(record, activationState.reason ?? enableState.reason ?? "local plugin requires explicit trust for setup");
		registry.plugins.push(record);
		return;
	}
	const registrationPlan = resolvePluginRegistrationPlan({
		canLoadScopedSetupOnlyChannelPlugin: context.includeSetupOnlyChannelPlugins && !params.validateOnly && Boolean(params.onlyPluginIdSet) && manifestRecord.channels.length > 0 && (!enableState.enabled || context.forceSetupOnlyChannelPlugins) && (candidate.origin !== "workspace" || enableState.enabled),
		enableStateEnabled: enableState.enabled,
		shouldLoadModules: context.shouldLoadModules,
		validateOnly: params.validateOnly,
		runtimeSideEffects: context.runtimeSideEffects,
		manifestRecord,
		cfg: context.cfg,
		env: context.env,
		channelPluginLoadIntent: context.channelPluginLoadIntent,
		toolDiscovery: params.options.toolDiscovery === true,
		cliMetadata
	});
	if (!registrationPlan) {
		markPluginActivationDisabled(record, enableState.reason);
		finish();
		return;
	}
	if (!enableState.enabled) markPluginActivationDisabled(record, enableState.reason);
	const runtimePackage = resolveConfiguredRuntimePluginInstallCandidate(pluginId);
	const hostVersion = resolveCompatibilityHostVersion(context.env);
	const minimumCompatibleVersion = runtimePackage?.minimumCompatibleVersion;
	const packageVersion = manifestRecord.packageVersion;
	if (enableState.enabled && candidate.origin !== "bundled" && runtimePackage?.versionBoundToOpenClaw && minimumCompatibleVersion && manifestRecord.packageName === runtimePackage.npmSpec && packageVersion && (compareOpenClawReleaseVersions(packageVersion, minimumCompatibleVersion) ?? 0) < 0) {
		record.activated = false;
		pushPluginLoadError(`Official runtime plugin ${pluginId} ${packageVersion} is incompatible with OpenClaw ${hostVersion} (minimum compatible plugin version is ${minimumCompatibleVersion}); it is unavailable until repaired. Run \`openclaw update repair\` or \`openclaw plugins update ${pluginId}\`, then restart the Gateway. For a linked plugin, update the linked source or remove its load-path override before retrying.`);
		return;
	}
	if (record.format === "bundle") {
		if (cliMetadata) registry.plugins.push(record);
		else recordBundleDiagnostics({
			record,
			registry,
			inspectMcp: inspectBundleMcpRuntimeSupport
		});
		state.seenIds.set(pluginId, candidate.origin);
		return;
	}
	const memorySlot = context.normalized.slots.memory;
	const memoryDecisionFor = (kind) => resolveMemorySlotDecision({
		id: record.id,
		kind,
		slot: memorySlot,
		selectedId: state.selectedMemoryPluginId
	});
	if (registrationPlan.runRuntimeCapabilityPolicy && candidate.origin === "bundled" && hasKind(manifestRecord.kind, "memory") && !isDreamingSidecar) {
		const earlyMemoryDecision = memoryDecisionFor(manifestRecord.kind);
		if (!earlyMemoryDecision.enabled) {
			disableMemoryPlugin(earlyMemoryDecision.reason);
			return;
		}
	}
	if (!manifestRecord.configSchema) {
		pushPluginLoadError("missing config schema");
		return;
	}
	if (!context.shouldLoadModules && registrationPlan.runRuntimeCapabilityPolicy) {
		const memoryDecision = memoryDecisionFor(record.kind);
		if (!memoryDecision.enabled && !isDreamingSidecar) {
			disableMemoryPlugin(memoryDecision.reason);
			return;
		}
		if (memoryDecision.selected && hasKind(record.kind, "memory")) {
			state.selectedMemoryPluginId = record.id;
			state.memorySlotMatched = true;
			record.memorySlotSelected = true;
		}
	}
	const validatedConfig = prepareRuntimePluginConfig(params);
	if (!validatedConfig.ok) {
		params.logger.error(`[plugins] ${record.id} invalid config: ${validatedConfig.error.join(", ")}`);
		pushPluginLoadError(`invalid config: ${validatedConfig.error.join(", ")}`);
		return;
	}
	if (!context.shouldLoadModules) {
		finish();
		return;
	}
	const artifactParams = {
		pluginId,
		rootDir: pluginRoot,
		origin: candidate.origin,
		preferBuiltPluginArtifacts: prefersBuiltPluginArtifacts(context.artifactPreference, candidate.origin),
		sourcePreferred: manifestRecord.sourcePreferred,
		packageManifest: candidate.packageManifest,
		registry
	};
	const catalogRequest = params.options.capabilityCatalog;
	if (catalogRequest && manifestRecord.capabilityCatalogSource !== void 0) try {
		if (!manifestRecord.capabilityCatalogSource) throw new Error("entry must resolve inside the selected plugin root");
		const artifact = resolvePluginRuntimeArtifact({
			...artifactParams,
			entryKind: "capability-catalog",
			source: manifestRecord.capabilityCatalogSource
		});
		const { source, modulePath } = preparePluginModule({
			modulePath: artifact.source,
			boundaryRoot: artifact.rootDir,
			boundaryLabel: "plugin root",
			rejectHardlinks: shouldRejectHardlinkedPluginFiles({
				origin: candidate.origin,
				rootDir: candidate.rootDir,
				env: context.env
			}),
			surfaceLabel: `${pluginId} capabilityCatalogEntry`
		});
		if (source.capabilityCatalog?.context !== catalogRequest.context) {
			const moduleLoader = getPluginSetupModuleLoader(manifestRecord, modulePath, artifact.rootDir);
			source.capabilityCatalog = {
				context: catalogRequest.context,
				value: moduleLoader.initialize(() => resolvePluginCapabilityCatalog(moduleLoader(modulePath), catalogRequest.context))
			};
		}
		const catalog = source.capabilityCatalog.value;
		if (Object.hasOwn(catalog, catalogRequest.family)) {
			const speechProviders = catalog.speechProviders ?? [];
			for (const index of speechProviders.keys()) params.registryBuilder.registerSpeechProvider(record, speechProviders[index]);
			const transcriptionProviders = catalog.realtimeTranscriptionProviders ?? [];
			for (const index of transcriptionProviders.keys()) params.registryBuilder.registerRealtimeTranscriptionProvider(record, transcriptionProviders[index]);
			const voiceProviders = catalog.realtimeVoiceProviders ?? [];
			for (const index of voiceProviders.keys()) params.registryBuilder.registerRealtimeVoiceProvider(record, voiceProviders[index]);
			record.imported = false;
			record.capabilityCatalog = capabilityCatalogFamilies.filter((key) => Object.hasOwn(catalog, key));
			finish();
			return;
		}
	} catch (error) {
		params.registryBuilder.rollbackPluginGlobalSideEffects(record.id, record);
		throw new Error(`Plugin ${pluginId} capabilityCatalogEntry failed: ${formatErrorMessage(error)}. Repair the declared entry in ${manifestRecord.manifestPath}.`, { cause: error });
	}
	const runtimeCandidateEntry = recovery?.runtimeEntry ?? (cliMetadata ? {
		source: candidate.source,
		rootDir: pluginRoot
	} : resolvePluginRuntimeArtifact({
		...artifactParams,
		entryKind: "runtime",
		source: candidate.source
	}));
	let selectedEntry = registrationPlan.loadSetupEntry && (recovery ? recovery.setupEntry : manifestRecord.setupSource && resolvePluginRuntimeArtifact({
		...artifactParams,
		entryKind: "setup",
		source: manifestRecord.setupSource
	})) || runtimeCandidateEntry;
	if (cliMetadata) {
		const source = resolveCliMetadataEntrySource(candidate.rootDir, candidate.source);
		if (!source && candidate.origin === "bundled") {
			finish();
			return;
		}
		selectedEntry = {
			source: source ?? candidate.source,
			rootDir: pluginRoot
		};
	}
	const loadEntry = recovery ? selectedEntry : resolvePluginRuntimeExecutionArtifact(selectedEntry);
	const artifactSelection = bindPluginRuntimeArtifactSelection(record, {
		...artifactParams,
		source: candidate.source,
		runtimeEntry: recovery ? runtimeCandidateEntry : resolvePluginRuntimeExecutionArtifact(runtimeCandidateEntry),
		setupEntry: registrationPlan.loadSetupEntry ? loadEntry : void 0
	});
	const moduleLoadSource = loadEntry.source;
	const moduleRoot = loadEntry.rootDir;
	const rejectHardlinks = shouldRejectHardlinkedPluginFiles({
		origin: candidate.origin,
		rootDir: candidate.rootDir,
		env: context.env
	});
	let safeSource = moduleLoadSource;
	if (!recovery) {
		const opened = openPluginRootFileSync({
			filePath: moduleLoadSource,
			rootPath: moduleRoot,
			rejectHardlinks
		});
		if (!opened.ok) {
			pushPluginLoadError(describeRootFileOpenFailure({
				failure: opened,
				subject: "plugin entry path",
				boundaryLabel: "plugin root",
				filePath: moduleLoadSource
			}));
			return;
		}
		safeSource = opened.path;
		fs.closeSync(opened.fd);
	}
	let moduleLoadMs = 0;
	let beforeRegister;
	let failed = false;
	const beforeModuleLoad = performance.now();
	try {
		if (!cliMetadata) recordImportedPluginId(record.id);
		state.pluginLoadAttemptCount++;
		params.logger.debug?.(`[plugins] loading ${record.id} from ${safeSource}`);
		const moduleOwner = {
			record,
			rootDir: moduleRoot,
			registry,
			standalone: manifestRecord.manifestPath === candidate.source,
			immutableInstallIdentity: resolveImmutableInstallIdentity(candidate.origin, resolvePluginCandidateInstallOwner(candidate), context.installRecords)
		};
		const loadPluginModule = (source) => {
			if (recovery) {
				let instance = getPluginInstance(record);
				if (!instance) {
					instance = new PluginInstance(record.id, {
						record,
						registry
					});
					recovery.module.bind(instance);
				}
				return instance.loadModule(source);
			}
			return params.loadPluginModule(source, moduleOwner);
		};
		const mod = withProfile({
			pluginId: record.id,
			source: safeSource
		}, registrationPlan.mode, () => loadPluginModule(safeSource));
		moduleLoadMs = performance.now() - beforeModuleLoad;
		const instance = getPluginInstance(record);
		const loadSetupCandidate = () => loadSetupRuntimeChannelCandidate({
			mod,
			manifestRecord,
			record,
			registrationPlan,
			runtimeCandidateEntry,
			safeSource,
			rejectHardlinks,
			loadPluginModule,
			registryBuilder: params.registryBuilder,
			cfg: context.cfg,
			entry,
			seenIds: state.seenIds,
			logger: params.logger,
			pushPluginLoadError
		});
		if (instance ? instance.run(loadSetupCandidate) : loadSetupCandidate()) return;
		const { definition, register } = resolvePluginModuleExport(mod);
		if (definition?.id && definition.id !== record.id) {
			pushPluginLoadError(`plugin id mismatch (config uses "${record.id}", export uses "${definition.id}")`);
			return;
		}
		record.name = definition?.name ?? record.name;
		record.description = definition?.description ?? record.description;
		record.version = definition?.version ?? record.version;
		const manifestKind = record.kind;
		const exportKind = definition?.kind;
		if (manifestKind && exportKind && !kindsEqual(manifestKind, exportKind)) registry.diagnostics.push({
			level: "warn",
			pluginId: record.id,
			source: record.source,
			message: `plugin kind mismatch (manifest uses "${String(manifestKind)}", export uses "${String(exportKind)}")`
		});
		record.kind = definition?.kind ?? record.kind;
		if (hasKind(record.kind, "memory") && memorySlot === record.id) state.memorySlotMatched = true;
		if (registrationPlan.runRuntimeCapabilityPolicy && !isDreamingSidecar) {
			const memoryDecision = memoryDecisionFor(record.kind);
			if (!memoryDecision.enabled) {
				params.registryBuilder.rollbackPluginGlobalSideEffects(record.id, record);
				disableMemoryPlugin(memoryDecision.reason);
				return;
			}
			if (memoryDecision.selected && hasKind(record.kind, "memory")) {
				state.selectedMemoryPluginId = record.id;
				record.memorySlotSelected = true;
			}
		}
		if (params.validateOnly) {
			finish();
			return;
		}
		if (typeof register !== "function") {
			const wrongLoaderError = formatBundledChannelWrongLoaderError(record.kind);
			if (wrongLoaderError) {
				params.logger.error(`[plugins] ${record.id} ${wrongLoaderError}; check that plugin is loaded via bundled channel discovery, not legacy plugin loader`);
				pushPluginLoadError(wrongLoaderError);
			} else {
				params.logger.error(`[plugins] ${record.id} missing register/activate export`);
				pushPluginLoadError(formatMissingPluginRegisterError(mod, context.env));
			}
			return;
		}
		beforeRegister = performance.now();
		const registerPlugin = () => {
			const ownedDefinition = instance?.wrap(definition) ?? definition;
			if (!cliMetadata) for (const command of ownedDefinition?.nodeHostCommands ?? []) params.registryBuilder.registerNodeHostCommand(record, command);
			if (registrationPlan.runFullActivationOnlyRegistrations) {
				if (ownedDefinition?.reload) params.registryBuilder.registerReload(record, ownedDefinition.reload);
				for (const collector of ownedDefinition?.securityAuditCollectors ?? []) params.registryBuilder.registerSecurityAuditCollector(record, collector);
			}
			const api = params.registryBuilder.createApi(record, {
				config: context.cfg,
				pluginConfig: validatedConfig.value,
				hookPolicy: entry?.hooks,
				registrationMode: registrationPlan.mode
			});
			return withProfile({
				pluginId: record.id,
				source: record.source
			}, `${registrationPlan.mode}:register`, () => runPluginRegisterSyncInRegistry(register, api, registry, record.id));
		};
		if (instance) instance.run(registerPlugin);
		else registerPlugin();
		if (!cliMetadata && registrationPlan.runRuntimeCapabilityPolicy) {
			registerPluginDashboardCapabilities({
				record,
				registry
			});
			artifactSelection.runtimeRegistrationComplete = true;
		}
		finish();
		if (clearMismatchedQuarantineAfterLoad) clearActiveDegradedPlugin(pluginId);
	} catch (error) {
		const failurePhase = beforeRegister === void 0 ? "load" : "register";
		let failure = error;
		try {
			params.options.prepareRegistrationFailureCleanup?.(registry, record);
		} catch (cleanupError) {
			failure = new AggregateError([error, cleanupError], `${formatErrorMessage(error)}; registration cleanup preparation failed: ${formatErrorMessage(cleanupError)}`, { cause: error });
		}
		params.registryBuilder.rollbackPluginGlobalSideEffects(record.id, record);
		recordPluginError({
			logger: params.logger,
			registry,
			record,
			seenIds: state.seenIds,
			phase: failurePhase,
			error: failure,
			logPrefix: `[plugins] ${record.id} failed during ${failurePhase} from ${record.source}: `,
			diagnosticMessagePrefix: `plugin failed during ${failurePhase}: `,
			missingDependencyHint,
			...error instanceof PluginDashboardDeclarationError ? { diagnosticCode: "dashboard-declaration-invalid" } : {}
		});
		failed = true;
	} finally {
		const elapsed = performance.now() - beforeModuleLoad;
		const registerMs = beforeRegister === void 0 ? void 0 : performance.now() - beforeRegister;
		detailPluginStartupTrace(params.options.startupTrace, record.id, [
			["loadMs", moduleLoadMs || elapsed],
			["loadFailedCount", failed && beforeRegister === void 0 ? 1 : 0],
			...registerMs === void 0 ? [] : [
				["registerMs", registerMs],
				["loadAndRegisterMs", elapsed],
				["registerFailedCount", failed ? 1 : 0]
			]
		]);
	}
}
function resolveCliMetadataEntrySource(rootDir, source) {
	for (const directory of /* @__PURE__ */ new Set([rootDir, path.dirname(source)])) for (const extension of [
		".ts",
		".js",
		".mjs",
		".cjs"
	]) {
		const candidate = path.join(directory, `cli-metadata${extension}`);
		if (fs.existsSync(candidate)) return candidate;
	}
	return null;
}
//#endregion
//#region src/plugins/loader-runtime-core.ts
const registryInputs = /* @__PURE__ */ new WeakMap();
/** Captured JSON inputs ignore object key order, but preserve array order and values. */
function samePluginLoadInput(left, right) {
	return left === right || left !== void 0 && right !== void 0 && isDeepStrictEqual(JSON.parse(left), JSON.parse(right));
}
/**
* Same-mode predecessors transfer to the candidate at publication. A live side-effect
* runtime lends active records to a non-activating load and keeps their custody.
*/
function resolvePluginRecordRetention({ previousRegistry, borrowRegistry }, pluginId, params) {
	const previous = previousRegistry?.plugins.find((record) => record.id === pluginId);
	const previousInput = previousRegistry && registryInputs.get(previousRegistry)?.get(pluginId);
	if (previousRegistry && previous && previousInput && !isPluginRecordBorrowed(previousRegistry, previous) && params.signature !== void 0 && !params.replaced && samePluginLoadInput(previousInput.signature, params.signature)) return {
		registry: previousRegistry,
		record: previous,
		input: previousInput
	};
	const lent = borrowRegistry?.plugins.find((record) => record.id === pluginId);
	const lentInput = borrowRegistry && registryInputs.get(borrowRegistry)?.get(pluginId);
	return borrowRegistry && lent && lentInput?.borrowSignature !== void 0 && isPluginRecordActive(borrowRegistry, lent) && samePluginLoadInput(lentInput.borrowSignature, params.borrowSignature) ? {
		registry: borrowRegistry,
		record: lent,
		input: lentInput
	} : void 0;
}
function createDeferredGatewaySubagentRuntime(runtime) {
	const subagent = {
		complete: (...args) => runtime.subagent.complete(...args),
		forkSession: (...args) => runtime.subagent.forkSession(...args),
		run: (...args) => runtime.subagent.run(...args),
		waitForRun: (...args) => runtime.subagent.waitForRun(...args),
		getSessionMessages: (...args) => runtime.subagent.getSessionMessages(...args),
		deleteSession: (...args) => runtime.subagent.deleteSession(...args)
	};
	bindGatewayContextResolver(subagent, getGatewayContextResolver(runtime));
	return subagent;
}
function createDeferredGatewayNodesRuntime(runtime) {
	return {
		list: (...args) => runtime.nodes.list(...args),
		invoke: (...args) => runtime.nodes.invoke(...args),
		openDuplex: (...args) => runtime.nodes.openDuplex(...args)
	};
}
function createCapabilityCatalogContextResolver(context) {
	return () => context;
}
function loadOpenClawPluginsCore(...args) {
	const steps = loadOpenClawPluginsSteps(...args);
	let step = steps.next();
	while (!step.done) step = steps.next();
	return step.value;
}
/** One registration sequence, consumed synchronously by CLI/SDK callers or incrementally by hosts. */
function* loadOpenClawPluginsSteps(options, nativeBindings, overrides, inspectionResources, trackActivationCleanup) {
	if (getPluginCache().retirement) throw new Error("Plugin inventory has retired; begin a new plugin operation.");
	const requestedOnlyPluginIds = normalizePluginIdScope(options.onlyPluginIds);
	const requestedOnlyPluginIdSet = createPluginIdScopeSet(requestedOnlyPluginIds);
	if (requestedOnlyPluginIdSet && requestedOnlyPluginIdSet.size === 0) {
		const emptyRegistry = createEmptyPluginRegistry();
		inspectionResources?.attach(emptyRegistry);
		if (options.mode !== "cli-metadata" && options.activate !== false) {
			const runtimeSubagentMode = resolveRuntimeSubagentMode(options.runtimeOptions);
			activatePluginRegistry(emptyRegistry, `empty-plugin-scope::${runtimeSubagentMode}::${options.workspaceDir ?? ""}`, runtimeSubagentMode, options.workspaceDir, void 0, trackActivationCleanup);
		}
		return emptyRegistry;
	}
	const context = resolvePluginLoadCacheContext(options);
	const logger = options.logger ?? createSubsystemLogger("plugins");
	const validateOnly = options.mode === "validate";
	const onlyPluginIdSet = createPluginIdScopeSet(context.onlyPluginIds);
	const cacheEnabled = !options.previousRegistry && !options.borrowRegistry && !options.moduleRecoveries && isPluginRegistryCacheEnabled(options);
	if (cacheEnabled) {
		const cached = context.cacheState.get(context.cacheKey);
		if (cached) {
			maybeThrowOnPluginLoadError(cached, options.throwOnLoadError);
			if (context.shouldActivate) activatePluginRegistry(cached, context.cacheKey, context.runtimeSubagentMode, options.workspaceDir, void 0, trackActivationCleanup);
			return cached;
		}
	}
	context.cacheState.beginLoad(context.cacheKey);
	let registryBuilder;
	try {
		const loadPluginModule = createPluginModuleLoader({
			devSourceRoot: context.devSourceRoot,
			pluginSdkResolution: options.pluginSdkResolution,
			expectedSourceDigests: options.expectedSourceDigests,
			...overrides?.moduleLoader
		});
		const borrowedSubagent = context.borrowedGatewayRuntime ? createDeferredGatewaySubagentRuntime(context.borrowedGatewayRuntime) : void 0;
		const borrowedNodes = context.borrowedGatewayRuntime ? createDeferredGatewayNodesRuntime(context.borrowedGatewayRuntime) : void 0;
		const runtime = options.mode === "cli-metadata" ? createUnavailableRuntime("cli-metadata") : overrides?.runtime ? overrides.runtime : createLazyPluginRuntime({
			devSourceRoot: context.devSourceRoot,
			pluginSdkResolution: options.pluginSdkResolution,
			runtimeOptions: {
				...options.runtimeOptions,
				modelAuth: options.runtimeOptions?.modelAuth ?? { ...nativeBindings.modelAuth },
				modelConfig: options.runtimeOptions?.modelConfig ?? { ...nativeBindings.modelConfig },
				subagent: options.runtimeOptions?.subagent ?? borrowedSubagent,
				nodes: options.runtimeOptions?.nodes ?? borrowedNodes
			}
		});
		const capabilityCatalogContext = options.capabilityCatalogContext ?? options.capabilityCatalog?.context ?? nativeBindings.capabilityCatalogContext;
		registryBuilder = createPluginRegistry({
			logger,
			runtime,
			resolveCapabilityCatalogContext: createCapabilityCatalogContextResolver(capabilityCatalogContext),
			allowProcessHomeSessionCatalogs: options.allowProcessHomeSessionCatalogs ?? true,
			coreGatewayHandlers: options.coreGatewayHandlers,
			...options.coreGatewayMethodNames !== void 0 && { coreGatewayMethodNames: options.coreGatewayMethodNames },
			...options.hostServices !== void 0 && { hostServices: options.hostServices },
			activateGlobalSideEffects: context.runtimeSideEffects
		});
		const builder = registryBuilder;
		const { registry } = builder;
		inspectionResources?.attach(registry);
		const suppliedManifestRegistry = options.manifestRegistry ?? (options.discovery === void 0 ? context.metadataSnapshot?.manifestRegistry : void 0);
		const discovery = suppliedManifestRegistry ? {
			candidates: createPluginCandidatesFromManifestRegistry(suppliedManifestRegistry),
			diagnostics: []
		} : options.discovery ?? discoverOpenClawPlugins({
			workspaceDir: options.workspaceDir,
			extraPaths: context.normalized.loadPaths,
			env: context.env,
			installRecords: context.installRecords
		});
		const manifestRegistry = suppliedManifestRegistry ?? loadPluginManifestRegistryCore({
			config: context.cfg,
			workspaceDir: options.workspaceDir,
			env: context.env,
			candidates: discovery.candidates,
			diagnostics: discovery.diagnostics,
			installRecords: Object.keys(context.installRecords).length > 0 ? context.installRecords : void 0
		});
		registry.diagnostics.push(...manifestRegistry.diagnostics);
		warnWhenAllowlistIsOpen({
			emitWarning: context.shouldActivate,
			logger,
			pluginsEnabled: context.normalized.enabled,
			allow: context.normalized.allow,
			warningCacheKey: context.cacheKey,
			warningCache: context.cacheState,
			explicitlyEnabledPluginIds: new Set(Object.entries(context.normalized.entries).filter(([, entry]) => entry.enabled === true).map(([pluginId]) => pluginId)),
			discoverablePlugins: manifestRegistry.plugins.filter((plugin) => !onlyPluginIdSet || onlyPluginIdSet.has(plugin.id))
		});
		const provenance = buildProvenanceIndex({
			normalizedLoadPaths: context.normalized.loadPaths,
			env: context.env,
			installRecords: context.installRecords
		});
		const manifestBySource = new Map(manifestRegistry.plugins.map((record) => [record.source, record]));
		const orderedCandidates = discovery.candidates.flatMap((candidate) => {
			const manifest = manifestBySource.get(candidate.source);
			return manifest ? [{
				candidate,
				manifest
			}] : [];
		});
		const loaderCacheIdentity = Object.freeze({
			requestKey: context.cacheKey,
			resolvedKey: context.resolveManifestCacheKey(manifestRegistry)
		});
		setPluginRuntimeLoadContext(registry, {
			rawConfig: options.config ?? {},
			config: context.cfg,
			activationSourceConfig: context.activationSourceConfig,
			autoEnabledReasons: context.autoEnabledReasons,
			workspaceDir: options.workspaceDir,
			env: context.env,
			logger,
			manifestRegistry,
			normalizePluginId: options.normalizePluginId,
			installRecords: context.installRecords,
			preferBuiltPluginArtifacts: options.preferBuiltPluginArtifacts
		}, context.registrationConfigKey);
		const replacedIds = /* @__PURE__ */ new Set([...options.replacePluginIds ?? [], ...options.moduleRecoveries?.keys() ?? []]);
		const memorySlot = context.normalized.slots.memory;
		const dreamingSidecar = resolveAuthorizedDreamingSidecar({
			cfg: context.cfg,
			normalized: context.normalized,
			activationSource: context.activationSource,
			manifestRegistry,
			memorySlot
		});
		const inputs = /* @__PURE__ */ new Map();
		const retained = /* @__PURE__ */ new Map();
		for (const { candidate, manifest } of orderedCandidates) {
			if (inputs.has(manifest.id) || !matchesScopedPluginOrDreamingSidecar({
				onlyPluginIdSet,
				pluginId: manifest.id,
				sidecar: dreamingSidecar
			})) continue;
			const activation = resolveEffectivePluginActivationState({
				id: manifest.id,
				origin: candidate.origin,
				channelIds: manifest.channels,
				config: context.normalized,
				rootConfig: context.cfg,
				enabledByDefault: isPluginEnabledByDefaultForPlatform(manifest),
				activationSource: context.activationSource
			});
			const installOwner = resolvePluginCandidateInstallOwner(candidate);
			const { config: pluginConfig, ...entryPolicy } = context.normalized.entries[normalizePluginPolicyId(manifest.id)] ?? {};
			const preparedConfig = { input: JSON.stringify(pluginConfig) };
			const degradedPlugin = findActiveDegradedPlugin(manifest.id);
			const { controlUi, schemaCacheKey: _schemaCacheKey, ...runtimeManifest } = manifest;
			const identityInputs = [
				candidate.source,
				candidate.origin,
				[installOwner, installOwner ? context.installRecords[installOwner] : void 0],
				{
					...runtimeManifest,
					controlUi: controlUi !== void 0
				},
				activation,
				entryPolicy,
				degradedPlugin && degradedPluginMatchesRoot(degradedPlugin, candidate.rootDir) ? degradedPlugin : void 0,
				hasKind(manifest.kind, "memory") ? memorySlot : void 0,
				manifest.id === dreamingSidecar?.engineId ? dreamingSidecar : void 0,
				context.channelPluginLoadIntent,
				context.includeSetupOnlyChannelPlugins,
				context.forceSetupOnlyChannelPlugins,
				validateOnly
			];
			const runtimeRegistration = !validateOnly && options.mode !== "cli-metadata" && options.toolDiscovery !== true;
			const lends = runtimeRegistration && context.runtimeSideEffects;
			const borrows = runtimeRegistration && !context.runtimeSideEffects && options.borrowRegistry !== void 0;
			let signature;
			let borrowSignature;
			try {
				signature = JSON.stringify([
					...identityInputs,
					context.artifactPreference,
					context.runtimeSideEffects,
					options.toolDiscovery === true,
					options.mode
				]);
				borrowSignature = lends || borrows ? JSON.stringify(identityInputs) : void 0;
			} catch (error) {
				if (!(error instanceof RangeError) || candidate.origin === "bundled" || prepareRuntimePluginConfig({
					candidate,
					manifestRecord: manifest,
					context,
					preparedConfig
				}).ok) throw error;
			}
			inputs.set(manifest.id, {
				source: candidate.source,
				signature,
				...lends ? { borrowSignature } : {},
				config: preparedConfig
			});
			const retention = resolvePluginRecordRetention(options, manifest.id, {
				signature,
				borrowSignature: borrows ? borrowSignature : void 0,
				replaced: replacedIds.has(manifest.id)
			});
			if (retention) {
				if (retention.input.config.validation) prepareRuntimePluginConfig({
					candidate,
					manifestRecord: manifest,
					context,
					preparedConfig
				});
				if (samePluginLoadInput(retention.input.config.input, preparedConfig.input)) {
					retained.set(manifest.id, retention.record);
					if (retention.registry === options.borrowRegistry) markPluginRecordBorrowed(registry, retention.record);
					projectPluginContributions(retention.registry, retention.record, registry);
				}
			}
		}
		for (const source of [options.previousRegistry, options.borrowRegistry]) registry.diagnostics.push(...source?.diagnostics.filter((entry) => {
			const record = entry.pluginId && retained.get(entry.pluginId);
			return record && source.plugins.includes(record);
		}) ?? []);
		const selectedMiddlewareOwnerManifests = /* @__PURE__ */ new Map();
		for (const { manifest: record } of orderedCandidates) if (!selectedMiddlewareOwnerManifests.has(record.id)) selectedMiddlewareOwnerManifests.set(record.id, record);
		for (const record of selectedMiddlewareOwnerManifests.values()) {
			if (retained.has(record.id) || options.mode === "cli-metadata") continue;
			const activation = resolveEffectivePluginActivationState({
				id: record.id,
				origin: record.origin,
				channelIds: record.channels,
				config: context.normalized,
				rootConfig: context.cfg,
				enabledByDefault: isPluginEnabledByDefaultForPlatform(record),
				activationSource: context.activationSource
			});
			const runtimes = normalizeAgentToolResultMiddlewareRuntimeIds(record.contracts?.agentToolResultMiddleware);
			if (runtimes.length > 0 && (record.origin === "bundled" || activation.enabled && activation.explicitlyEnabled)) registry.agentToolResultMiddlewareOwners.push({
				pluginId: record.id,
				runtimes,
				manifest: record
			});
		}
		const state = {
			seenIds: /* @__PURE__ */ new Map(),
			selectedMemoryPluginId: null,
			memorySlotMatched: false,
			pluginLoadAttemptCount: 0
		};
		const pluginLoadStartMs = performance.now();
		for (const { candidate, manifest: manifestRecord } of orderedCandidates) {
			const previous = retained.get(manifestRecord.id);
			if (previous && !state.seenIds.has(manifestRecord.id)) {
				registry.plugins.push(previous);
				state.seenIds.set(previous.id, previous.origin);
				if (previous.memorySlotSelected) {
					state.selectedMemoryPluginId = previous.id;
					state.memorySlotMatched = true;
				}
				continue;
			}
			const attemptedBefore = state.pluginLoadAttemptCount;
			const input = inputs.get(manifestRecord.id);
			const loadCandidate = () => loadRuntimePluginCandidate({
				candidate,
				manifestRecord,
				context,
				options,
				onlyPluginIdSet,
				dreamingSidecar,
				validateOnly,
				registryBuilder: builder,
				loadPluginModule,
				logger,
				state,
				preparedConfig: input?.source === candidate.source ? input.config : { input: void 0 }
			});
			if (options.previousRegistry) withPluginRegistryPreparationScope(registry, loadCandidate);
			else loadCandidate();
			if (state.pluginLoadAttemptCount !== attemptedBefore) {
				yield;
				if (getPluginCache().retirement) throw new Error("Plugin inventory has retired; begin a new plugin operation.");
			}
		}
		const pluginLoadElapsedMs = performance.now() - pluginLoadStartMs;
		if (state.pluginLoadAttemptCount > 0) logger.debug?.(`[plugins] loaded ${registry.plugins.length} plugin(s) (${state.pluginLoadAttemptCount} attempted) in ${pluginLoadElapsedMs.toFixed(1)}ms`);
		if (options.mode !== "cli-metadata" && !onlyPluginIdSet && typeof memorySlot === "string" && !state.memorySlotMatched) registry.diagnostics.push({
			level: "warn",
			message: `memory slot plugin not found or not marked as memory: ${memorySlot}`
		});
		if (options.mode !== "cli-metadata") warnAboutUntrackedLoadedPlugins({
			registry,
			provenance,
			allowlist: context.normalized.allow,
			emitWarning: context.shouldActivate,
			logger,
			env: context.env,
			installOwnerByPluginId: new Map(orderedCandidates.flatMap(({ candidate, manifest }) => {
				const installOwner = resolvePluginCandidateInstallOwner(candidate);
				return manifest.id && installOwner ? [[manifest.id, installOwner]] : [];
			}))
		});
		maybeThrowOnPluginLoadError(registry, options.throwOnLoadError, retained, options.previousRegistry, replacedIds);
		if (context.shouldActivate && options.mode !== "validate") {
			const failedPlugins = registry.plugins.filter((plugin) => plugin.failedAt != null);
			if (failedPlugins.length > 0) logger.warn(`[plugins] ${failedPlugins.length} plugin(s) failed to initialize (${formatPluginFailureSummary(failedPlugins)}). Run 'openclaw plugins inspect <id> --runtime --json' for runtime diagnostics and 'openclaw plugins list' for registry state. After fixing plugin code or load paths, run 'openclaw plugins reload <id>' to retry.`);
		}
		getPluginRuntimeLoadContextState(registry).loaderCacheIdentity = loaderCacheIdentity;
		if (context.shouldActivate) activatePluginRegistry(registry, context.cacheKey, context.runtimeSubagentMode, options.workspaceDir, void 0, trackActivationCleanup);
		if (cacheEnabled) {
			context.cacheState.set(context.cacheKey, registry);
			if (loaderCacheIdentity.resolvedKey !== context.cacheKey) context.cacheState.set(loaderCacheIdentity.resolvedKey, registry);
		}
		registryInputs.set(registry, inputs);
		return registry;
	} catch (error) {
		if (registryBuilder && !isPluginRegistryActivated(registryBuilder.registry)) {
			for (const plugin of registryBuilder.registry.plugins.toReversed()) if (!options.previousRegistry?.plugins.includes(plugin) && !options.borrowRegistry?.plugins.includes(plugin)) registryBuilder.rollbackPluginGlobalSideEffects(plugin.id, plugin);
		}
		throw error;
	} finally {
		context.cacheState.finishLoad(context.cacheKey);
	}
}
//#endregion
//#region src/agents/auth-profiles/read-only-availability.ts
/** Pure, non-resolving credential availability checks shared by status and route selection. */
/** Store revisions do not advance when a token or failure window expires. */
function resolveAuthStoreReadOnlyValidUntil(store, now) {
	return Math.min(...[...Object.values(store.profiles).map((profile) => profile.type === "token" ? profile.expires : void 0), ...Object.values(store.usageStats ?? {}).flatMap((stats) => [
		stats.blockedUntil,
		stats.cooldownUntil,
		stats.disabledUntil
	])].filter((deadline) => deadline !== void 0 && deadline > now));
}
function hasMalformedSecretInputSyntax(value) {
	if (typeof value !== "string") return false;
	const trimmed = value.trim();
	return trimmed.startsWith("secretref-env:") || trimmed.startsWith("__env__:") || trimmed.startsWith("$");
}
function resolveSecretRefReadOnlyAvailability(value, cfg, env) {
	if (!isSecretRef(value) || !isValidSecretRef(value)) return false;
	if (value.source === "env") {
		if (!canResolveEnvSecretRefInReadOnlyPath({
			cfg,
			provider: value.provider,
			id: value.id
		})) return false;
		return hasNonEmptyString(env[value.id]) ? true : void 0;
	}
	const source = cfg.secrets?.providers?.[value.provider];
	if (source?.source !== value.source && !isBuiltInDefaultSecretProviderRef(cfg, value)) return false;
	if (value.source === "file" && source?.source === "file" && source.mode === "singleValue" !== (value.id === "value")) return false;
}
function resolveSecretInputReadOnlyAvailability(value, refValue, cfg, env) {
	const ref = parseSecretRef(refValue, cfg.secrets?.defaults) ?? parseSecretRef(value, cfg.secrets?.defaults);
	if (ref) return resolveSecretRefReadOnlyAvailability(ref, cfg, env);
	if (!hasNonEmptyString(value) || hasMalformedSecretInputSyntax(value)) return false;
	return isKnownEnvApiKeyMarker(value) ? hasNonEmptyString(env[value.trim()]) : isNonSecretApiKeyMarker(value) ? void 0 : true;
}
function resolveStoredCredentialReadOnlyAvailability(params) {
	const { credential, cfg, env } = params;
	const now = params.now ?? Date.now();
	if (credential.type === "api_key") return resolveSecretInputReadOnlyAvailability(credential.key, credential.keyRef, cfg, env);
	if (credential.type === "token") {
		const expiryState = resolveTokenExpiryState(credential.expires, now);
		if (expiryState === "expired" || expiryState === "invalid_expires") return false;
		return resolveSecretInputReadOnlyAvailability(credential.token, credential.tokenRef, cfg, env);
	}
	if (hasUsableOAuthCredential(credential, { now })) return true;
	if (isOAuthRefreshFence(credential)) return false;
	if (hasNonEmptyString(credential.refresh)) return params.canRefreshOAuth ? true : void 0;
	return credential.oauthRef && !hasNonEmptyString(credential.access) ? void 0 : false;
}
//#endregion
//#region src/agents/model-auth-runtime-config.ts
/**
* Runtime-config-backed provider auth that does not require plugin activation.
*/
/** Reads a runtime-resolved credential for a SecretRef-backed provider entry. */
function resolveManagedSecretRefRuntimeProviderAuth(params) {
	const runtimeConfig = getRuntimeConfigSnapshot();
	const runtimeSourceConfig = getRuntimeConfigSourceSnapshot();
	const sourceConfig = runtimeSourceConfig ?? void 0;
	if (!runtimeConfig || !hasSecretRefProviderApiKey(sourceConfig, params.provider)) return;
	if (!(providerConfigMatchesRuntimeSnapshot({
		inputConfig: params.cfg,
		runtimeConfig,
		provider: params.provider
	}) || selectApplicableRuntimeConfig({
		inputConfig: params.cfg,
		runtimeConfig,
		runtimeSourceConfig
	}) === runtimeConfig)) return;
	const resolved = resolveRuntimeProviderConfigApiKeyAuth({
		cfg: runtimeConfig,
		sourceConfig,
		provider: params.provider
	});
	if (!resolved?.apiKey) return;
	return {
		...resolved,
		apiKey: params.secretSentinels ? mintSecretSentinel(resolved.apiKey, { label: `model-auth:${params.provider}` }) : resolved.apiKey
	};
}
function assertRuntimeProviderSecretOwnerAvailable(params) {
	const provider = normalizeProviderId(params.provider);
	const degraded = findActiveDegradedSecretOwner("provider", provider);
	if (!degraded) return;
	const runtimeConfig = getRuntimeConfigSnapshot();
	const runtimeSourceConfig = getRuntimeConfigSourceSnapshot();
	if (!params.cfg || params.cfg === runtimeConfig || params.cfg === runtimeSourceConfig || providerConfigMatchesRuntimeSnapshot({
		inputConfig: params.cfg,
		runtimeConfig,
		provider
	})) throw new SecretSurfaceUnavailableError(degraded);
}
//#endregion
//#region src/plugins/provider-auth-availability-core.ts
function createProviderAuthAvailability(authStore) {
	const { ensureAuthProfileStore, ensureAuthProfileStoreAsync, loadAuthProfileStoreWithoutExternalProfilesAsync, loadAuthProfileStoreForRuntimeAsync, findPersistedAuthProfileCredential, findPersistedAuthProfileCredentialAsync, loadAuthProfileStoreForSecretsRuntime, loadAuthProfileStoreWithoutExternalProfiles } = authStore;
	/**
	* Checks whether a provider has usable config/env auth or matching local auth profiles.
	*/
	function isProviderApiKeyConfiguredFromStore(params, persistedCredential) {
		const agentDir = params.agentDir?.trim();
		if (params.acceptsApiKey) {
			const { acceptsApiKey, ...availability } = params;
			if (!isProviderApiKeyConfiguredFromStore(availability, persistedCredential)) return false;
			const providerConfig = resolveMergedModelProviderConfig(params.cfg, params.provider);
			const authoredApiKey = providerConfig?.apiKey;
			const store = params.store ?? (agentDir ? ensureAuthProfileStore(agentDir, { allowKeychainPrompt: false }) : void 0);
			let profile = persistedCredential ?? (typeof authoredApiKey === "string" ? store?.profiles[authoredApiKey.trim()] : void 0);
			if (!profile && store && providerConfig?.auth !== "api-key") {
				const [profileId] = params.store ? filterAuthProfileIds(store, resolveAuthProfileOrder({
					cfg: params.cfg,
					store,
					provider: params.provider
				}), params) : listUsableProviderAuthProfileIds(availability).profileIds;
				profile = profileId ? store.profiles[profileId] : void 0;
			}
			if (profile) {
				const credential = profile.type === "oauth" ? profile.access : profile.type === "token" ? profile.token ?? (profile.tokenRef?.source === "env" ? process.env[profile.tokenRef.id] : void 0) : profile.key ?? (profile.keyRef?.source === "env" ? process.env[profile.keyRef.id] : void 0);
				return credential === void 0 || acceptsApiKey(credential);
			}
			const configParams = {
				cfg: params.cfg,
				provider: params.provider
			};
			const configKey = resolveManagedSecretRefRuntimeProviderAuth(configParams)?.apiKey ?? resolveUsableCustomProviderApiKey(configParams)?.apiKey;
			const selectedKey = providerConfig?.auth === "api-key" && authoredApiKey !== void 0 ? configKey : resolveEnvApiKey(params.provider, process.env, { config: params.cfg })?.apiKey ?? configKey;
			return selectedKey === void 0 || acceptsApiKey(selectedKey);
		}
		if (params.cfg) {
			const allowsCredentialMode = (mode, authFlow) => (!params.profileTypes?.length || params.profileTypes.some((profileType) => profileTypeToAuthMode(profileType) === mode)) && (!params.capability || isAuthModeAllowedForModel({
				provider: params.provider,
				capability: params.capability,
				mode,
				authFlow
			}));
			const authoredApiKey = resolveMergedModelProviderConfig(params.cfg, params.provider)?.apiKey;
			const profileId = typeof authoredApiKey === "string" ? authoredApiKey.trim() : void 0;
			if (agentDir && profileId) {
				const credential = persistedCredential !== void 0 ? persistedCredential ?? void 0 : findPersistedAuthProfileCredential({
					agentDir,
					profileId
				});
				if (credential) {
					const binding = resolveProviderEntryApiKeyProfileReference({
						cfg: params.cfg,
						provider: params.provider,
						store: {
							version: 1,
							profiles: { [profileId]: credential }
						}
					});
					if (binding.kind === "profile-incompatible") return false;
					if (binding.kind === "profile") return allowsCredentialMode(binding.mode, binding.credential.type === "oauth" ? binding.credential.authFlow : void 0) && resolveStoredCredentialReadOnlyAvailability({
						credential: binding.credential,
						cfg: params.cfg,
						env: process.env
					}) === true;
				}
			}
			const configured = resolveUsableCustomProviderApiKey({
				cfg: params.cfg,
				provider: params.provider
			});
			if (configured?.apiKey && !isNonSecretApiKeyMarker(configured.apiKey) && allowsCredentialMode(resolveDirectProviderCredentialMode({
				cfg: params.cfg,
				provider: params.provider,
				inferredMode: "api-key"
			}))) return true;
			const managed = resolveManagedSecretRefRuntimeProviderAuth({
				cfg: params.cfg,
				provider: params.provider
			});
			if (managed?.apiKey && allowsCredentialMode(managed.mode)) return true;
		}
		if (resolveEnvApiKey(params.provider)?.apiKey && (!params.capability || isAuthModeAllowedForModel({
			provider: params.provider,
			capability: params.capability,
			mode: "api-key"
		}))) return true;
		if (!agentDir) return false;
		const store = params.store ?? ensureAuthProfileStore(agentDir, { allowKeychainPrompt: false });
		return filterAuthProfileIds(store, listProfilesForProvider(store, params.provider), params).length > 0;
	}
	/** @deprecated Use isProviderApiKeyConfiguredAsync. Final compatibility day: 2026-12-31. */
	function isProviderApiKeyConfigured(params) {
		warnPluginSdkDeprecation({
			family: "provider-auth",
			method: "isProviderApiKeyConfigured",
			replacement: "isProviderApiKeyConfiguredAsync"
		});
		return isProviderApiKeyConfiguredFromStore(params);
	}
	async function isProviderApiKeyConfiguredAsync(params) {
		const agentDir = params.agentDir?.trim();
		const providerConfig = resolveMergedModelProviderConfig(params.cfg, params.provider);
		const apiKey = providerConfig?.apiKey;
		const profileId = typeof apiKey === "string" ? apiKey.trim() : void 0;
		const persistedCredential = agentDir && profileId ? await findPersistedAuthProfileCredentialAsync({
			agentDir,
			profileId
		}) ?? null : null;
		let store = params.store;
		if (params.acceptsApiKey && !store && agentDir && !persistedCredential && providerConfig?.auth !== "api-key") store = await ensureAuthProfileStoreAsync(agentDir, { allowKeychainPrompt: false });
		const configured = isProviderApiKeyConfiguredFromStore({
			...params,
			store: store ?? {
				version: 1,
				profiles: {}
			}
		}, persistedCredential);
		if (configured || store || !agentDir || persistedCredential) return configured;
		store = await ensureAuthProfileStoreAsync(agentDir, { allowKeychainPrompt: false });
		return isProviderApiKeyConfiguredFromStore({
			...params,
			store
		}, persistedCredential);
	}
	/** @deprecated Use listUsableProviderAuthProfileIdsAsync. Final compatibility day: 2026-12-31. */
	function listUsableProviderAuthProfileIds(params) {
		warnPluginSdkDeprecation({
			family: "auth-profile-sync-operations",
			method: "listUsableProviderAuthProfileIds",
			replacement: "await listUsableProviderAuthProfileIdsAsync()"
		});
		try {
			const { agentDir, profileIds, store } = resolveUsableProviderAuthProfiles(params);
			return {
				agentDir,
				profileIds: filterAuthProfileIds(store, profileIds, params)
			};
		} catch {
			return {
				agentDir: "",
				profileIds: []
			};
		}
	}
	/** @deprecated Use isProviderAuthProfileConfiguredAsync. Final compatibility day: 2026-12-31. */
	function isProviderAuthProfileConfigured(params) {
		warnPluginSdkDeprecation({
			family: "auth-profile-sync-operations",
			method: "isProviderAuthProfileConfigured",
			replacement: "await isProviderAuthProfileConfiguredAsync()"
		});
		return listUsableProviderAuthProfileIds(params).profileIds.length > 0;
	}
	async function isProviderAuthProfileConfiguredAsync(params) {
		return (await listUsableProviderAuthProfileIdsAsync(params)).profileIds.length > 0;
	}
	async function listUsableProviderAuthProfileIdsAsync(params) {
		try {
			const { agentDir, profileIds, store } = await resolveUsableProviderAuthProfilesAsync(params);
			return {
				agentDir,
				profileIds: filterAuthProfileIds(store, profileIds, params)
			};
		} catch {
			return {
				agentDir: "",
				profileIds: []
			};
		}
	}
	/**
	* Resolves the first usable auth-profile API key for a provider in configured profile order.
	*/
	async function resolveProviderAuthProfileApiKey(params) {
		const { resolveApiKeyForProfile } = await import("./oauth-DalQEbRJ.mjs");
		const { agentDir, profileIds, store } = await resolveUsableProviderAuthProfilesAsync({
			...params,
			includePendingOAuthRefresh: true
		});
		if (!agentDir || profileIds.length === 0) return;
		for (const profileId of filterAuthProfileIds(store, profileIds, params)) {
			const resolved = await resolveApiKeyForProfile({
				cfg: params.cfg,
				store,
				agentDir,
				profileId
			});
			const credential = resolved?.credential ?? store.profiles[resolved?.profileId ?? profileId];
			if (resolved?.apiKey && (!params.capability || credential && acceptsCredential(credential, params))) return resolved.apiKey;
		}
	}
	function resolveUsableProviderAuthProfiles(params) {
		const agentDir = params.agentDir?.trim() || resolveDefaultAgentDir(params.cfg ?? {});
		const externalCli = params.includeExternalCliAuth ? externalCliDiscoveryForProviderAuth({
			cfg: params.cfg,
			provider: params.provider,
			allowKeychainPrompt: params.allowKeychainPrompt
		}) : void 0;
		const store = externalCli ? loadAuthProfileStoreForSecretsRuntime(agentDir, { externalCli }) : loadAuthProfileStoreForSecretsRuntime(agentDir);
		const profileIds = resolveAuthProfileOrder({
			cfg: params.cfg,
			store,
			provider: params.provider,
			includePendingOAuthRefresh: params.includePendingOAuthRefresh
		});
		if (profileIds.length > 0) return {
			agentDir,
			profileIds,
			store
		};
		const fallbackStore = loadAuthProfileStoreWithoutExternalProfiles(agentDir, { allowKeychainPrompt: params.allowKeychainPrompt ?? false });
		return {
			agentDir,
			profileIds: resolveAuthProfileOrder({
				cfg: params.cfg,
				store: fallbackStore,
				provider: params.provider,
				includePendingOAuthRefresh: params.includePendingOAuthRefresh
			}),
			store: fallbackStore
		};
	}
	async function resolveUsableProviderAuthProfilesAsync(params) {
		const agentDir = params.agentDir?.trim() || resolveDefaultAgentDir(params.cfg ?? {});
		const externalCli = params.includeExternalCliAuth ? externalCliDiscoveryForProviderAuth({
			cfg: params.cfg,
			provider: params.provider,
			allowKeychainPrompt: params.allowKeychainPrompt
		}) : void 0;
		const store = await loadAuthProfileStoreForRuntimeAsync(agentDir, {
			readOnly: true,
			allowKeychainPrompt: false,
			...externalCli ? { externalCli } : {}
		});
		const profileIds = resolveAuthProfileOrder({
			cfg: params.cfg,
			store,
			provider: params.provider,
			includePendingOAuthRefresh: params.includePendingOAuthRefresh
		});
		if (profileIds.length > 0) return {
			agentDir,
			profileIds,
			store
		};
		const fallbackStore = await loadAuthProfileStoreWithoutExternalProfilesAsync(agentDir, { allowKeychainPrompt: params.allowKeychainPrompt ?? false });
		return {
			agentDir,
			profileIds: resolveAuthProfileOrder({
				cfg: params.cfg,
				store: fallbackStore,
				provider: params.provider,
				includePendingOAuthRefresh: params.includePendingOAuthRefresh
			}),
			store: fallbackStore
		};
	}
	function acceptsCredential(credential, params) {
		return (!params.profileTypes?.length || params.profileTypes.includes(credential.type)) && (!params.capability || isAuthModeAllowedForModel({
			provider: params.provider,
			capability: params.capability,
			mode: profileTypeToAuthMode(credential.type),
			authFlow: credential.type === "oauth" ? credential.authFlow : void 0
		}));
	}
	function filterAuthProfileIds(store, profileIds, params) {
		return profileIds.filter((profileId) => {
			const credential = store.profiles[profileId];
			return credential !== void 0 && acceptsCredential(credential, params);
		});
	}
	return {
		isProviderApiKeyConfigured,
		isProviderApiKeyConfiguredAsync,
		listUsableProviderAuthProfileIds,
		listUsableProviderAuthProfileIdsAsync,
		isProviderAuthProfileConfigured,
		isProviderAuthProfileConfiguredAsync,
		resolveProviderAuthProfileApiKey
	};
}
//#endregion
//#region src/plugins/provider-external-auth-core.ts
/** Resolves external auth overlays through metadata and synchronous provider hooks. */
function createProviderExternalAuthResolver(hooks) {
	const { resolveProviderPluginsForHooks } = hooks;
	function resolveExternalAuthProfilesWithPlugins(params) {
		const workspaceDir = params.workspaceDir ?? getActivePluginRegistryWorkspaceDirFromStateCore();
		const env = params.env ?? process.env;
		const config = params.config ?? {};
		const currentMetadataSnapshot = getCurrentPluginMetadataSnapshot({
			env,
			...params.config ? { config } : { requireDefaultDiscoveryContext: true },
			...workspaceDir ? { workspaceDir } : { allowWorkspaceScopedSnapshot: true }
		});
		const { manifestRegistry } = currentMetadataSnapshot ?? resolvePluginMetadataSnapshot({
			config,
			workspaceDir,
			env
		});
		if (currentMetadataSnapshot && !manifestRegistry.plugins.some((plugin) => plugin.contracts?.externalAuthProviders?.length)) return [];
		const externalAuthPluginIds = resolveExternalAuthProfileProviderPluginIds({
			config: params.config,
			workspaceDir,
			env,
			manifestRegistry
		});
		if (externalAuthPluginIds.length === 0) return [];
		const matches = [];
		for (const plugin of resolveProviderPluginsForHooks({
			...params,
			workspaceDir,
			env,
			onlyPluginIds: externalAuthPluginIds
		})) matches.push(...plugin.resolveExternalAuthProfiles?.(params.context) ?? []);
		return matches;
	}
	return { resolveExternalAuthProfilesWithPlugins };
}
//#endregion
//#region src/plugins/provider-hook-runtime-core.ts
const MODEL_PROVIDER_RUNTIME_PLUGIN_HANDLE_SYMBOL = Symbol.for("openclaw.modelProviderRuntimePluginHandle");
function createProviderHookRuntime(providers) {
	const { resolvePluginProviderRegistryCore, resolvePluginProvidersCore } = providers;
	/** Carries one attempt's prepared provider plugin through the model transport boundary. */
	function attachModelProviderRuntimePluginHandle(model, runtimeHandle) {
		return {
			...attachModelProviderLocalServiceReconciler(model, runtimeHandle.plugin?.reconcileLocalService),
			[MODEL_PROVIDER_RUNTIME_PLUGIN_HANDLE_SYMBOL]: runtimeHandle
		};
	}
	/** Reads the provider plugin handle attached to a prepared attempt model. */
	function getModelProviderRuntimePluginHandle(model) {
		return model ? model[MODEL_PROVIDER_RUNTIME_PLUGIN_HANDLE_SYMBOL] : void 0;
	}
	function resolveProviderRuntimeLookupModelId(params) {
		return normalizeOptionalString(params.modelId ?? params.context?.modelId);
	}
	function resolveLoadedProviderPluginsForHooks(params) {
		const resolved = resolvePluginProviderRegistryCore({
			...params,
			registryScope: "loaded"
		});
		if (!resolved) return;
		return resolved.registry.providers.filter(({ pluginId, provider }) => (!resolved.onlyPluginIds || resolved.onlyPluginIds.includes(pluginId)) && (!params.providerRefs?.length || params.providerRefs.some((ref) => matchesProviderPluginRef(provider, ref)))).map(({ pluginId, provider }) => Object.assign({}, provider, { pluginId }));
	}
	function resolveProviderPluginsForHooks(params) {
		return resolvePluginProvidersCore({
			...params,
			activate: false,
			applyAutoEnable: params.applyAutoEnable,
			skipIfLoadInFlight: true
		});
	}
	function resolveSelectedProvider(selection, provider, ownerRefs) {
		const registration = selection && findProviderRuntimeRegistrationInRegistry({
			registry: selection.registry,
			provider,
			ownerRefs,
			isOwnerEligible: (id) => selection.isProviderOwnerEligible(id, provider)
		});
		return registration ? Object.assign({}, registration.provider, { pluginId: registration.pluginId }) : void 0;
	}
	function resolveProviderRuntimePluginLookup(params, registryScope) {
		const apiOwnerHint = resolveProviderConfigApiOwnerHint(params);
		const ownerRefs = [...new Set([params.providerOwner, apiOwnerHint].filter((owner) => Boolean(owner)))];
		const modelId = resolveProviderRuntimeLookupModelId(params);
		const selection = resolvePluginProviderRegistryCore({
			...params,
			providerRefs: [params.provider, ...ownerRefs],
			modelRefs: modelId ? resolveModelCatalogScope({
				cfg: params.config,
				provider: params.provider,
				model: modelId
			}).modelRefs : void 0,
			registryScope,
			activate: false,
			skipIfLoadInFlight: true
		});
		const plugin = resolveSelectedProvider(selection, params.provider, ownerRefs);
		return {
			...params,
			...selection ? { workspaceDir: selection.workspaceDir } : {},
			plugin
		};
	}
	function resolveProviderRuntimePlugin(params) {
		return resolveProviderRuntimePluginLookup(params).plugin;
	}
	function resolveLoadedProviderRuntimePlugin(params) {
		return resolveProviderRuntimePluginLookup(params, "loaded").plugin;
	}
	function resolveProviderHookPlugin(params) {
		const runtimePlugin = resolveProviderRuntimePlugin(params);
		if (runtimePlugin) return runtimePlugin;
		if (hasConfiguredModelProvider(params)) return;
		return resolveSelectedProvider(resolvePluginProviderRegistryCore({
			config: params.config,
			workspaceDir: params.workspaceDir,
			env: params.env,
			activate: false,
			skipIfLoadInFlight: true
		}), params.provider, []);
	}
	function ensureProviderRuntimePluginHandle(params) {
		const modelId = resolveProviderRuntimeLookupModelId(params);
		if (!params.runtimeHandle || modelId && !params.runtimeHandle.plugin && params.runtimeHandle.modelId !== modelId) return resolveProviderRuntimePluginLookup({
			provider: params.provider,
			modelId,
			config: params.config ?? params.runtimeHandle?.config,
			workspaceDir: params.workspaceDir ?? params.runtimeHandle?.workspaceDir,
			env: params.env ?? params.runtimeHandle?.env,
			applyAutoEnable: params.runtimeHandle?.applyAutoEnable,
			pluginMetadataSnapshot: params.pluginMetadataSnapshot ?? params.runtimeHandle?.pluginMetadataSnapshot
		});
		return params.runtimeHandle;
	}
	function resolveProviderAuthProfileId(params) {
		const resolved = ensureProviderRuntimePluginHandle(params).plugin?.resolveAuthProfileId?.(params.context);
		return normalizeOptionalString(resolved);
	}
	function resolveProviderFollowupFallbackRoute(params) {
		return ensureProviderRuntimePluginHandle(params).plugin?.followupFallbackRoute?.(params.context) ?? void 0;
	}
	function wrapProviderSimpleCompletionStreamFn(params) {
		return ensureProviderRuntimePluginHandle(params).plugin?.wrapSimpleCompletionStreamFn?.(params.context) ?? void 0;
	}
	return {
		attachModelProviderRuntimePluginHandle,
		getModelProviderRuntimePluginHandle,
		resolveLoadedProviderPluginsForHooks,
		resolveProviderPluginsForHooks,
		resolveProviderRuntimePlugin,
		resolveLoadedProviderRuntimePlugin,
		resolveProviderHookPlugin,
		resolveProviderRuntimePluginHandle: resolveProviderRuntimePluginLookup,
		ensureProviderRuntimePluginHandle,
		resolveProviderAuthProfileId,
		resolveProviderFollowupFallbackRoute,
		wrapProviderSimpleCompletionStreamFn
	};
}
//#endregion
//#region src/plugins/providers.runtime-core.ts
function createProviderRegistryResolver(dependencies) {
	const { loadOpenClawPlugins, resolveRuntimePluginRegistry, isPluginRegistryLoadInFlight } = dependencies;
	function prepareProviderSelection(params, manifestRegistry, declaredProviderOwners = buildDeclaredProviderOwnerIndex(manifestRegistry?.plugins ?? []), retained = false) {
		let normalizedConfig;
		const providerOwners = manifestRegistry ? (params.providerRefs ?? []).map((provider) => {
			const lookup = {
				provider,
				config: params.config,
				workspaceDir: params.workspaceDir,
				env: params.env
			};
			const apiOwnerHint = resolveProviderConfigApiOwnerHint(lookup);
			const ownerRef = declaredProviderOwners.has(normalizeProviderId(provider)) ? provider : apiOwnerHint ?? provider;
			const declaredIds = declaredProviderOwners.get(normalizeProviderId(ownerRef));
			const ownerIds = declaredIds ? [...declaredIds] : resolveOwningPluginIdsForProviderRef({
				...lookup,
				provider: ownerRef,
				manifestRegistry
			}) ?? [];
			const runtimePluginIds = retained && ownerIds.length > 0 ? [] : sortUniqueStrings([provider, ...apiOwnerHint ? [apiOwnerHint] : []].flatMap((providerRef) => resolveManifestActivationPluginIds({
				...lookup,
				trigger: {
					kind: "provider",
					provider: providerRef
				},
				manifestRecords: manifestRegistry.plugins,
				normalizedConfig: normalizedConfig ??= normalizePluginsConfig(params.config?.plugins)
			})));
			return {
				provider,
				ownerPluginIds: ownerIds,
				providerPluginIds: ownerIds.length > 0 ? ownerIds : runtimePluginIds,
				runtimePluginIds
			};
		}) : [];
		const modelOwnedPluginIds = manifestRegistry && params.modelRefs?.length ? resolveOwningPluginIdsForModelRefs({
			models: params.modelRefs,
			config: params.config,
			workspaceDir: params.workspaceDir,
			env: params.env,
			manifestRegistry
		}) : [];
		const explicitOwnerPluginIds = sortUniqueStrings([...providerOwners.flatMap((owner) => [...owner.ownerPluginIds, ...owner.runtimePluginIds]), ...modelOwnedPluginIds]);
		return {
			pluginIds: !manifestRegistry ? params.onlyPluginIds : hasExplicitPluginIdScope(params.onlyPluginIds) || params.providerRefs?.length || params.modelRefs?.length ? sortUniqueStrings([...params.onlyPluginIds ?? [], ...explicitOwnerPluginIds]) : void 0,
			workspaceDir: params.workspaceDir,
			manifestRegistry,
			onlyPluginIds: params.onlyPluginIds,
			providerRefs: params.providerRefs,
			projectedPluginIds: manifestRegistry && (params.providerRefs?.length || params.modelRefs?.length) ? sortUniqueStrings([...providerOwners.flatMap((owner) => owner.providerPluginIds), ...modelOwnedPluginIds]) : void 0,
			declaredProviderOwners,
			providerOwners,
			providerRegistrationPluginIds: void 0,
			runtimeRegistrationPluginIds: void 0,
			unownedProviderRefs: manifestRegistry ? providerOwners.filter((owner) => owner.ownerPluginIds.length === 0).map((owner) => owner.provider) : params.providerRefs ?? [],
			explicitOwnerPluginIds
		};
	}
	function prepareProviderLookup(params, retained = false) {
		const env = params.env ?? process.env;
		const sourceParams = retained ? {
			...params,
			pluginMetadataSnapshot: getCurrentPluginMetadataSnapshot({
				config: params.config,
				env
			})
		} : params;
		const workspaceDir = resolveProviderRuntimeWorkspaceDir(sourceParams, retained ? void 0 : getActivePluginRegistryWorkspaceDir());
		const snapshot = sourceParams.pluginMetadataSnapshot ?? (retained || params.registryScope === "loaded" ? getCurrentPluginMetadataSnapshot({
			config: params.config,
			env,
			workspaceDir,
			allowWorkspaceScopedSnapshot: true
		}) : resolvePluginMetadataSnapshot({
			config: params.config ?? {},
			env,
			workspaceDir
		}));
		const inputs = {
			...sourceParams,
			env,
			workspaceDir
		};
		const selection = snapshot ? prepareProviderSelection(inputs, snapshot.manifestRegistry, snapshot.declaredProviderOwners, retained) : void 0;
		return {
			inputs,
			snapshot,
			selection,
			loadOptions: snapshot && selection && !retained ? resolveProviderLoadOptions(inputs, selection, snapshot) : void 0
		};
	}
	function resolveProviderLoadOptions(params, selection, snapshot) {
		const sourceConfig = resolvePluginActivationSourceConfig(params);
		const ownerLookup = {
			config: params.config,
			workspaceDir: params.workspaceDir,
			env: params.env,
			includeUntrustedWorkspacePlugins: params.includeUntrustedWorkspacePlugins,
			registry: snapshot.index,
			manifestRegistry: snapshot.manifestRegistry,
			normalizePluginId: snapshot.normalizePluginId
		};
		const setup = params.mode === "setup";
		const explicitOwnerPluginIds = (setup ? resolveDiscoverableProviderOwnerPluginIds : resolveActivatableProviderOwnerPluginIds)({
			...ownerLookup,
			pluginIds: selection.explicitOwnerPluginIds
		});
		let activation;
		if (setup) {
			selection.pluginIds = sortUniqueStrings([...resolveDiscoveredProviderPluginIds({
				...ownerLookup,
				onlyPluginIds: selection.pluginIds
			}), ...explicitOwnerPluginIds]);
			if (selection.pluginIds.length === 0) return;
			const setupConfig = withActivatedPluginIds({
				config: params.config,
				pluginIds: selection.pluginIds
			});
			activation = {
				config: setupConfig,
				activationSourceConfig: setupConfig,
				autoEnabledReasons: {}
			};
		} else {
			const onlyPluginIds = selection.pluginIds !== void 0 ? sortUniqueStrings([...params.onlyPluginIds ?? [], ...explicitOwnerPluginIds]) : void 0;
			activation = resolveBundledCompatActivationInputs({
				rawConfig: withActivatedPluginIds({
					config: params.config,
					pluginIds: explicitOwnerPluginIds
				}),
				env: params.env,
				workspaceDir: params.workspaceDir,
				applyAutoEnable: params.applyAutoEnable ?? true,
				discovery: snapshot.discovery,
				manifestRegistry: snapshot.manifestRegistry,
				onlyPluginIds,
				resolveBundledPluginIds: resolveBundledProviderCompatPluginIds,
				activation: "defaults"
			});
			const eligiblePluginIds = sortUniqueStrings([...resolveEnabledProviderPluginIds({
				...ownerLookup,
				config: activation.config,
				onlyPluginIds
			}), ...explicitOwnerPluginIds]);
			selection.pluginIds = eligiblePluginIds;
			selection.projectedPluginIds = selection.projectedPluginIds?.filter((pluginId) => eligiblePluginIds.includes(pluginId));
		}
		if (params.config !== void 0 && sourceConfig !== params.config) activation.activationSourceConfig = withActivatedPluginIds({
			config: sourceConfig,
			pluginIds: setup ? selection.pluginIds : explicitOwnerPluginIds
		});
		return buildPluginRuntimeLoadOptions({
			...activation,
			workspaceDir: params.workspaceDir,
			env: params.env,
			logger: createPluginRuntimeLoaderLogger(),
			manifestRegistry: snapshot.manifestRegistry,
			installRecords: extractPluginInstallRecordsFromInstalledPluginIndex(snapshot.index)
		}, {
			normalizePluginId: snapshot.normalizePluginId,
			registrationConfigOrigin: !setup && params.registryScope !== "exact" ? params.config : void 0,
			onlyPluginIds: selection.pluginIds,
			pluginSdkResolution: params.pluginSdkResolution,
			cache: params.cache ?? !setup,
			activate: params.activate ?? false
		});
	}
	function isPluginProvidersLoadInFlight(params) {
		const { loadOptions } = prepareProviderLookup({
			...params,
			registryScope: void 0
		});
		return loadOptions !== void 0 && isPluginRegistryLoadInFlight(loadOptions);
	}
	function captureProviderRegistrySelection(registry, base, onlyPluginIds) {
		return {
			registry,
			workspaceDir: base.workspaceDir,
			onlyPluginIds,
			isProviderOwnerEligible: (pluginId, provider) => (!onlyPluginIds || onlyPluginIds.includes(pluginId)) && matchesDeclaredProviderOwner(base.declaredProviderOwners, provider, pluginId)
		};
	}
	function resolveProviderRegistryCandidate(registry, selection, retained, aliasOwners, lookup) {
		let onlyPluginIds = selection.pluginIds;
		let projectedPluginIds = selection.projectedPluginIds ?? onlyPluginIds;
		if (selection.unownedProviderRefs.length > 0) {
			onlyPluginIds = sortUniqueStrings([...onlyPluginIds ?? [], ...aliasOwners]);
			projectedPluginIds = sortUniqueStrings([...projectedPluginIds ?? [], ...aliasOwners]);
		}
		if (retained) return captureProviderRegistrySelection(registry, selection, projectedPluginIds);
		if (!registryContainsRuntimePluginIds(registry, onlyPluginIds)) return;
		if (lookup) {
			selection.providerRegistrationPluginIds ??= new Set((selection.manifestRegistry?.plugins ?? []).filter((plugin) => plugin.providers.length > 0 || (plugin.setup?.providers?.length ?? 0) > 0).map((plugin) => plugin.id));
			selection.runtimeRegistrationPluginIds ??= new Set(selection.providerOwners.flatMap((owner) => owner.runtimePluginIds));
			const providerOwners = new Set(registry.providers.map((entry) => entry.pluginId));
			for (const id of onlyPluginIds ?? []) {
				const record = lookup(id);
				if (!record || (selection.providerRegistrationPluginIds.has(id) ? !providerOwners.has(id) : selection.runtimeRegistrationPluginIds.has(id) && !hasCompletedPluginRuntimeRegistration(record))) return;
			}
			onlyPluginIds ??= sortUniqueStrings(registry.providers.map((entry) => entry.pluginId).filter(lookup));
		}
		return registry.providers.some(({ pluginId, provider }) => (!onlyPluginIds || onlyPluginIds.includes(pluginId)) && (!selection.providerRefs?.length || selection.providerRefs.some((ref) => matchesProviderPluginRef(provider, ref)))) ? captureProviderRegistrySelection(registry, selection, projectedPluginIds ?? onlyPluginIds) : void 0;
	}
	function resolvePluginProviderRegistryCore(params) {
		if (params.mode === "setup" && params.registryScope === "loaded") return;
		const generationRegistry = params.mode === "setup" ? void 0 : getPluginRuntimeGenerationRegistry();
		const prepared = prepareProviderLookup(params, Boolean(generationRegistry));
		const { inputs, snapshot } = prepared;
		let { loadOptions } = prepared;
		const { env, workspaceDir } = inputs;
		const registrationKey = (normalizePluginId) => {
			if (generationRegistry || params.config === void 0) return;
			const registrationConfig = loadOptions ?? {
				config: params.config,
				activationSourceConfig: resolvePluginActivationSourceConfig(params)
			};
			const normalize = normalizePluginId ? (config) => normalizePluginsConfigWithResolverCore(config?.plugins, normalizePluginId) : (config) => normalizePluginsConfig(config?.plugins);
			return resolvePluginRegistrationConfigKey({
				runtimeEntries: normalize(registrationConfig.config).entries,
				sourceEntries: normalize(registrationConfig.activationSourceConfig).entries
			});
		};
		const registrationConfigKey = snapshot ? registrationKey(snapshot.normalizePluginId) : void 0;
		if (params.skipIfLoadInFlight && loadOptions && isPluginRegistryLoadInFlight(loadOptions)) return;
		const prepareRegistry = (registry, selection) => {
			const lookup = !generationRegistry && selection.manifestRegistry ? createRuntimePluginManifestLookup(registry, selection.manifestRegistry.plugins) : void 0;
			const aliasOwners = selection.unownedProviderRefs.length > 0 ? registry.providers.filter(({ pluginId, provider }) => (!selection.onlyPluginIds || selection.onlyPluginIds.includes(pluginId)) && selection.unownedProviderRefs.some((ref) => matchesProviderPluginRef(provider, ref)) && (!lookup || Boolean(lookup(pluginId)))).map((entry) => entry.pluginId) : [];
			return {
				lookup,
				aliasOwners: !generationRegistry && snapshot && aliasOwners.length > 0 ? resolveActivatableProviderOwnerPluginIds({
					...inputs,
					pluginIds: aliasOwners,
					registry: snapshot.index,
					manifestRegistry: snapshot.manifestRegistry,
					normalizePluginId: snapshot.normalizePluginId
				}) : aliasOwners
			};
		};
		if (generationRegistry || params.mode !== "setup") {
			const request = getPluginRuntimeGatewayRequestScope()?.pluginRegistry;
			const requestContext = getPluginRuntimeLoadContext(request);
			const candidates = generationRegistry ? [generationRegistry] : [requestContext && requestContext.workspaceDir === workspaceDir ? request : void 0, getLoadedRuntimePluginRegistry({
				env,
				workspaceDir
			})];
			for (const registry of candidates) {
				if (!registry) continue;
				const context = getPluginRuntimeLoadContext(registry);
				if (!snapshot && !generationRegistry && context && resolvePluginControlPlaneFingerprint({
					config: params.config ?? context.rawConfig,
					env: params.env ?? context.env,
					workspaceDir
				}) !== context.controlPlaneFingerprint) continue;
				const selection = prepared.selection ?? prepareProviderSelection(inputs, context?.manifestRegistry, context?.declaredProviderOwners, Boolean(generationRegistry));
				const { lookup, aliasOwners } = prepareRegistry(registry, selection);
				if (!generationRegistry && snapshot && aliasOwners.some((id) => !selection.explicitOwnerPluginIds.includes(id))) {
					selection.explicitOwnerPluginIds = sortUniqueStrings([...selection.explicitOwnerPluginIds, ...aliasOwners]);
					loadOptions = resolveProviderLoadOptions(inputs, selection, snapshot);
					if (params.skipIfLoadInFlight && loadOptions && isPluginRegistryLoadInFlight(loadOptions)) return;
				}
				const requestedRegistrationKey = snapshot ? registrationConfigKey : registrationKey(context?.normalizePluginId);
				if (!generationRegistry && params.registryScope === "exact" || context && requestedRegistrationKey !== void 0 && requestedRegistrationKey !== context.registrationConfigKey) continue;
				const selected = resolveProviderRegistryCandidate(registry, selection, Boolean(generationRegistry), aliasOwners, lookup);
				if (selected) return selected;
			}
		}
		if (generationRegistry || params.registryScope === "loaded" || !loadOptions || !prepared.selection || loadOptions.onlyPluginIds?.length === 0) return;
		const registry = params.mode === "setup" || params.registryScope === "exact" ? loadOpenClawPlugins(loadOptions) : resolveRuntimePluginRegistry(loadOptions);
		if (!registry) return;
		const projectedPluginIds = prepared.selection.projectedPluginIds ?? loadOptions.onlyPluginIds;
		return captureProviderRegistrySelection(registry, prepared.selection, params.mode !== "setup" && projectedPluginIds ? sortUniqueStrings([...projectedPluginIds, ...prepared.selection.unownedProviderRefs.length > 0 ? prepareRegistry(registry, prepared.selection).aliasOwners : []]) : void 0);
	}
	function resolvePluginProvidersCore(params, onSelectedRegistry) {
		const resolved = resolvePluginProviderRegistryCore(params);
		if (!resolved) return [];
		const { registry, onlyPluginIds } = resolved;
		const project = onSelectedRegistry?.(registry) ?? ((provider, pluginId) => Object.assign({}, provider, { pluginId }));
		return registry.providers.filter((entry) => !onlyPluginIds || onlyPluginIds.includes(entry.pluginId)).map((entry) => project(entry.provider, entry.pluginId));
	}
	return {
		isPluginProvidersLoadInFlight,
		resolvePluginProviderRegistryCore,
		resolvePluginProvidersCore
	};
}
//#endregion
//#region src/plugins/runtime/runtime-model-auth.ts
const loadModelAuthRuntime = createLazyRuntimeModule(() => import("./runtime-model-auth.runtime.js"));
function createRuntimeModelAuth({ ensureAuthProfileStore, ensureAuthProfileStoreAsync, isProviderApiKeyConfigured, isProviderApiKeyConfiguredAsync }) {
	const getApiKeyForModel = createLazyRuntimeMethod(loadModelAuthRuntime, (runtime) => runtime.getApiKeyForModel);
	const getRuntimeAuthForModel = createLazyRuntimeMethod(loadModelAuthRuntime, (runtime) => runtime.getRuntimeAuthForModelCore);
	const resolveApiKeyForProvider = createLazyRuntimeMethod(loadModelAuthRuntime, (runtime) => runtime.resolveProviderRuntimeApiKey);
	return {
		resolveProviderIdForAuth,
		ensureAuthProfileStore,
		ensureAuthProfileStoreAsync,
		resolveAuthProfileOrder,
		listProfilesForProvider,
		isProviderApiKeyConfigured,
		isProviderApiKeyConfiguredAsync,
		getApiKeyForModel: (params) => getApiKeyForModel({
			model: params.model,
			cfg: params.cfg,
			workspaceDir: params.workspaceDir
		}),
		getRuntimeAuthForModel: (params) => getRuntimeAuthForModel({
			model: params.model,
			cfg: params.cfg,
			workspaceDir: params.workspaceDir
		}),
		resolveApiKeyForProvider: (params) => resolveApiKeyForProvider({
			provider: params.provider,
			cfg: params.cfg,
			workspaceDir: params.workspaceDir
		})
	};
}
//#endregion
//#region src/plugins/loader-runtime-load.ts
/** Native composition entry for ordinary, restricted, and cold provider-hook loading. */
function resolveRuntimePluginRegistry(options) {
	const activeRegistry = resolveCompatibleRuntimePluginRegistry(options);
	if (activeRegistry) return activeRegistry;
	return isPluginRegistryLoadInFlight(options) ? void 0 : loadOpenClawPlugins({
		...options,
		activate: false
	});
}
const providerRegistry = Object.freeze(createProviderRegistryResolver({
	loadOpenClawPlugins,
	resolveRuntimePluginRegistry,
	isPluginRegistryLoadInFlight
}));
const providerHooks = Object.freeze(createProviderHookRuntime(providerRegistry));
const externalProfiles = Object.freeze(createProviderExternalAuthResolver(providerHooks));
const externalAuth = Object.freeze(createExternalAuthRuntime(externalProfiles.resolveExternalAuthProfilesWithPlugins));
const authStore = Object.freeze(createAuthProfileStoreRuntime(externalAuth));
const authAvailability = Object.freeze(createProviderAuthAvailability(authStore));
let modelAuth;
let modelConfig;
let capabilityCatalogContext;
const loaderBindings = Object.freeze({
	get modelAuth() {
		return modelAuth ??= Object.freeze(createRuntimeModelAuth({
			ensureAuthProfileStore: authStore.ensureAuthProfileStore,
			ensureAuthProfileStoreAsync: authStore.ensureAuthProfileStoreAsync,
			isProviderApiKeyConfigured: authAvailability.isProviderApiKeyConfigured,
			isProviderApiKeyConfiguredAsync: authAvailability.isProviderApiKeyConfiguredAsync
		}));
	},
	get modelConfig() {
		return modelConfig ??= Object.freeze({
			resolveDefaultModelForAgent,
			resolveAllowedModelRef: resolveAllowedModelRefCore,
			resolveModelRuntimePolicy
		});
	},
	get capabilityCatalogContext() {
		return capabilityCatalogContext ??= createPluginCapabilityCatalogContext(authAvailability);
	}
});
const nativePluginBindings = Object.freeze({
	providerRegistry,
	providerHooks,
	externalProfiles,
	externalAuth,
	authStore,
	authAvailability
});
function resolvePluginCapabilityCatalogContext() {
	return loaderBindings.capabilityCatalogContext;
}
function loadOpenClawPlugins(options = {}) {
	return loadOpenClawPluginsCore(options, loaderBindings);
}
/** Keep network callbacks responsive without publishing a partially registered generation. */
async function loadOpenClawPluginsAsync(options = {}) {
	const steps = loadOpenClawPluginsSteps(options, loaderBindings);
	let step = steps.next();
	while (!step.done) {
		await setImmediate();
		step = steps.next();
	}
	return step.value;
}
/** Publishes synchronously, then joins every accepted health write before returning to its host. */
async function loadAndActivateRootPluginRegistry(options = {}) {
	const cleanup = [];
	try {
		return loadOpenClawPluginsCore({
			...options,
			activate: true
		}, loaderBindings, void 0, void 0, (completion) => cleanup.push(completion));
	} finally {
		await Promise.allSettled(cleanup);
	}
}
/** Acquires a fresh discovery registry; release waits for its registration resources. */
async function acquirePluginRegistryForInspection(options = {}) {
	return acquireRegistryResources((resources) => loadOpenClawPluginsCore({
		...options,
		activate: false,
		cache: false
	}, loaderBindings, void 0, resources));
}
async function acquireRegistryResources(load) {
	const cache = createPluginCache();
	const resources = new PluginRegistryInspectionResources(async (registry, rollbackInstances) => {
		const instances = new Set(cache.instances);
		for (const record of registry?.plugins ?? []) {
			const instance = getPluginInstance(record);
			if (instance && instance.owner?.registry === registry) instances.add(instance);
		}
		const failures = (await Promise.allSettled([...instances].filter((instance) => {
			const owner = getPluginInstanceOwner(instance);
			return !owner || owner.registry === registry;
		}).map(async (instance) => {
			const result = await instance.dispose(void 0, { waitForSettlement: true });
			return rollbackInstances.has(instance) ? { errors: [] } : result;
		}))).flatMap((result) => result.status === "rejected" ? [new PluginRuntimeCloseRetainedError(result.reason)] : result.value.errors);
		for (const instance of instances) releasePluginCacheInstance(instance, cache);
		try {
			const retired = await retirePluginCache(cache, void 0, { waitForSettlement: true });
			failures.push(...retired.failures.map((failure) => failure.error));
		} catch (reason) {
			failures.push(new PluginRuntimeCloseRetainedError(reason));
		}
		if (failures.length) throw new AggregateError(failures, "Plugin inspection instances failed to retire");
	});
	try {
		inheritPluginNativeAdmissions(getPluginCache(), cache);
		return {
			registry: withPluginCache(cache, () => load(resources)),
			release: () => resources.release()
		};
	} catch (error) {
		try {
			await resources.release();
		} catch (disposalError) {
			throw new AggregateError([error, disposalError], "Plugin inspection failed and its resources could not be disposed", { cause: disposalError });
		}
		throw error;
	}
}
function loadOpenClawPluginsWithInternalOverrides(options, overrides) {
	return loadRegistryWithInternalOverrides(options, overrides);
}
/** Owns the same narrow capability runtime without publishing or caching its registrations. */
function acquirePluginRegistryWithInternalOverrides(options, overrides) {
	return acquireRegistryResources((resources) => loadRegistryWithInternalOverrides(options, overrides, resources));
}
function loadRegistryWithInternalOverrides(options, overrides, resources) {
	const runtimeModelAuth = overrides.runtime.modelAuth ?? options.runtimeOptions?.modelAuth ?? { ...loaderBindings.modelAuth };
	const runtimeModelConfig = overrides.runtime.modelConfig ?? options.runtimeOptions?.modelConfig ?? { ...loaderBindings.modelConfig };
	const runtime = {
		config: overrides.runtime.config,
		get modelAuth() {
			return runtimeModelAuth;
		},
		get modelConfig() {
			return runtimeModelConfig;
		}
	};
	const runtimeDescriptors = Object.getOwnPropertyDescriptors(overrides.runtime);
	delete runtimeDescriptors.modelAuth;
	delete runtimeDescriptors.modelConfig;
	Object.defineProperties(runtime, runtimeDescriptors);
	return loadOpenClawPluginsCore(options, loaderBindings, {
		...overrides,
		runtime
	}, resources);
}
function resolveNativePluginModelAuth() {
	return { ...loaderBindings.modelAuth };
}
function resolveNativePluginModelConfig() {
	return { ...loaderBindings.modelConfig };
}
//#endregion
export { resolveStoredCredentialReadOnlyAvailability as _, loadOpenClawPluginsAsync as a, isPluginRegistryLoadInFlight as b, resolveNativePluginModelAuth as c, resolveRuntimePluginRegistry as d, assertRuntimeProviderSecretOwnerAvailable as f, resolveSecretRefReadOnlyAvailability as g, resolveAuthStoreReadOnlyValidUntil as h, loadOpenClawPlugins as i, resolveNativePluginModelConfig as l, hasMalformedSecretInputSyntax as m, acquirePluginRegistryWithInternalOverrides as n, loadOpenClawPluginsWithInternalOverrides as o, resolveManagedSecretRefRuntimeProviderAuth as p, loadAndActivateRootPluginRegistry as r, nativePluginBindings as s, acquirePluginRegistryForInspection as t, resolvePluginCapabilityCatalogContext as u, createRuntimeBase as v, resolvePluginRegistryLoadCacheKey as x, clearPluginRegistryLoadCache as y };
