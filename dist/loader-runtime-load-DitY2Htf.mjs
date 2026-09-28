import { D as resolveExpiresAtMsFromDurationMs, R as timestampMsToIsoString } from "./number-coercion-CLj0HTDM.mjs";
import { C as retirePluginCache, D as withPluginCache, a as createPluginCache, o as getPluginCache, w as retirePluginCacheInstance, y as releasePluginCacheInstance } from "./plugin-cache-A1nT2dqa.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty, p as normalizeStringifiedOptionalString, t as hasNonEmptyString } from "./string-coerce-CIXf7egm.mjs";
import { _ as normalizeUniqueTrimmedStringList, b as uniqueValues, d as normalizeStringEntries, h as normalizeUniqueStringEntries, p as normalizeTrimmedStringList, v as sortUniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { t as PluginRuntimeCloseRetainedError } from "./runtime-close-error-CYO2S35x.mjs";
import { n as getActivePluginRegistryWorkspaceDirFromState } from "./runtime-state-C5tDvNBc.mjs";
import { n as prepareGatewayContextBindingOwner } from "./gateway-context-binding-owner-bQvbtsTz.mjs";
import { a as getGatewayContextResolver, r as getCanonicalGatewayContextResolver, t as bindGatewayContextResolver } from "./gateway-context-binding-VqB7gkMe.mjs";
import { c as withPluginRuntimePluginScope, i as getPluginRuntimeGatewayRequestScope, s as withPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { a as createLazyRuntimeSurface, r as createLazyRuntimeModule, t as createLazyRuntimeMethod } from "./lazy-runtime-BPNHa36e.mjs";
import { k as withTimeout } from "./fs-safe-BAPek8At.mjs";
import { r as resolveRealpathOrAbsolute } from "./boundary-path-BzetEUdq.mjs";
import "./utils-aKqR_F_U.mjs";
import { n as describeRootFileOpenFailure } from "./boundary-file-read-D-Aa04On.mjs";
import { o as safeRealpathSync, s as safeStatSync } from "./path-safety-0BfxAYBQ.mjs";
import { n as findNormalizedProviderValue, r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { a as resolveAgentDir, p as resolveDefaultAgentDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { E as resolveStateDir, p as resolveConfigPath } from "./paths-DehQwyE0.mjs";
import { t as appendConfigPathSegment } from "./dot-path-BSC76DAI.mjs";
import { c as isSecretRef, p as isValidSecretRef, s as isBuiltInDefaultSecretProviderRef } from "./ref-contract-BVi3ykLT.mjs";
import { a as coerceSecretRef, p as resolveSecretInputRef } from "./types.secrets-B5xWSzLp.mjs";
import { f as resolveConfigSecretRef, l as getResolvedConfigEnvSecretRef } from "./resolution-facts-CSuKIPux.mjs";
import { u as tryNativeRequireModule } from "./native-module-require-CFiIAPP0.mjs";
import { i as preparePluginModule, o as installOpenClawPluginSdkNativeResolver, s as toSafeImportPath, t as getCachedPluginModuleLoader } from "./plugin-module-loader-cache-Bj8S5W5g.mjs";
import { n as openPluginRootFileSync, t as isPathInside } from "./path-safety-Cc0rrc_m.mjs";
import { c as runPluginCleanup, i as getPluginValueInstance, t as getPluginInstance, u as wrapCurrentPluginInstance } from "./plugin-instance-scope-C9hxyH_A.mjs";
import { _ as redactSensitiveText } from "./redact-B5EGyLvV.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { m as resolvePluginRuntimeExecutionArtifact, u as prefersBuiltPluginArtifacts } from "./bundled-dir-BGJkK8G5.mjs";
import { c as resolvePluginRuntimeModulePathWithDiagnostics, o as preparePluginLoaderAliases } from "./sdk-alias-DjyX8sAu.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { t as VERSION } from "./version-BkM1aB4w.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { a as PluginBlobStoreError } from "./openclaw-state-worker-error-DLFiBmPG.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { d as extractPluginInstallRecordsFromInstalledPluginIndex } from "./installed-plugin-index-D0kh4WcK.mjs";
import { t as normalizePluginPolicyId } from "./plugin-policy-id-C9JZrwYv.mjs";
import { i as kindsEqual, n as defaultSlotIdForKey, r as hasKind } from "./slots-D4OMSTbt.mjs";
import { d as resolveEffectivePluginActivationState, l as normalizePluginsConfig, p as resolveMemorySlotDecision } from "./config-state-BEAL5gWH.mjs";
import { E as resolvePluginCandidateInstallOwner, g as degradedPluginMatchesRoot, h as clearActiveDegradedPlugin, n as discoverOpenClawPlugins, v as findActiveDegradedPlugin } from "./discovery-D_5mAUI7.mjs";
import { l as normalizeCommandDescriptorName, u as sanitizeCommandDescriptorDescription } from "./manifest-DHkEL08H.mjs";
import { t as shouldRejectHardlinkedPluginFiles } from "./hardlink-policy-DhqUNG6g.mjs";
import { t as isPluginEnabledByDefaultForPlatform } from "./default-enablement-CEIbpabL.mjs";
import { s as listOfficialExternalChannelCatalogEntries } from "./official-external-plugin-catalog-CzZljLFK.mjs";
import { i as loadInstalledPluginIndexInstallRecordsSync } from "./installed-plugin-index-record-reader-Bwq1gZI1.mjs";
import { o as getOfficialExternalPluginCatalogManifest } from "./official-external-plugin-catalog-source-CkmJlLAW.mjs";
import { t as loadPluginManifestRegistryCore } from "./manifest-registry-CEG7WMVu.mjs";
import { t as resolvePluginControlPlaneFingerprint } from "./plugin-control-plane-context-CNov0ojO.mjs";
import { d as hasExplicitPluginIdScope, i as getCurrentPluginMetadataSnapshot, p as normalizePluginIdScope, u as createPluginIdScopeSet } from "./current-plugin-metadata-snapshot-BU2mC0-C.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-pEXzzTbU.mjs";
import { n as matchesDeclaredProviderOwner, t as buildDeclaredProviderOwnerIndex } from "./provider-owner-index-eVSJvcfU.mjs";
import { c as normalizeChannelMeta } from "./bundled-D8dZgG2d.mjs";
import { n as unwrapDefaultModuleExport, t as resolvePluginModuleExport } from "./module-export-BbYMQUy2.mjs";
import { a as resolveManifestOwnerBasePolicyBlock, t as hasExplicitManifestOwnerTrust } from "./manifest-owner-policy-D9DuiaNx.mjs";
import { t as GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA } from "./bundled-channel-config-metadata.generated-BMhosYMN.mjs";
import { o as PluginInstanceUnavailableError } from "./plugin-generation-artifact-VyjUi6ei.mjs";
import { n as PluginInstance, r as bindPluginInstanceModuleLoader, t as getPluginSetupModuleLoader } from "./plugin-setup-module-DjAZi3JK.mjs";
import { n as pluginArrays, r as pluginMaps, t as createEmptyPluginRegistry } from "./registry-empty--vb91VWS.mjs";
import { t as getPluginRuntimeGenerationRegistry } from "./generation-state-Mkqqbxs_.mjs";
import { d as invalidateProviderRegistryIndex, u as findProviderRuntimeRegistrationInRegistry } from "./model-ref-shared-BgRrSHjn.mjs";
import { o as resolveMergedModelProviderEntry } from "./model-provider-config-BbSyhfVf.mjs";
import { E as selectApplicableRuntimeConfig, f as hashRuntimeConfigValue, r as createRuntimeConfigReader, s as getRuntimeConfigSnapshot, u as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-DbgWcCyV.mjs";
import { r as resolveModelRuntimePolicy } from "./model-runtime-policy-IbIjya7U.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-DZ4sk4C2.mjs";
import "./openclaw-state-db-BFK9cMiV.mjs";
import { n as getShellEnvAppliedKeys } from "./shell-env-B_7LkFoy.mjs";
import { l as reserveSqliteWorkerInputPreparation } from "./sqlite-worker-store-H5HXDD9v.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-DKt99_dy.mjs";
import { c as warn } from "./globals-QODkv80i.mjs";
import { n as resolveManifestActivationPluginIds } from "./activation-planner-CtJXavAS.mjs";
import { n as validateJsonSchemaValue } from "./schema-validator-G8odGT6Q.mjs";
import { t as isPluginJsonValue } from "./host-hook-json-BdcyDerH.mjs";
import { d as isOperatorScope } from "./operator-scopes-D-CL26h0.mjs";
import { i as resolveProviderConfigApiOwnerHint, r as resolveModelCatalogScope } from "./provider-config-owner-CewfXQTW.mjs";
import { t as resolvePluginActivationSourceConfig } from "./activation-source-config-CpKxe5XX.mjs";
import { r as listChatChannels } from "./chat-meta-CrZhPtTU.mjs";
import { a as readNativeSessionCatalogPreference, n as hasLegacyNativeSessionCatalogDefault } from "./native-session-catalog-config-CYC8tjEu.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import { i as runCommandWithTimeout } from "./exec-shcN2-sN.mjs";
import { s as mintSecretSentinel } from "./sentinel-C86v7W15.mjs";
import { t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { C as NODE_WORKER_PRIVATE_COMMANDS, N as isPrivateNodeInvokeCommand, a as NODE_EXEC_APPROVALS_COMMANDS, m as NODE_SYSTEM_RUN_COMMANDS, p as NODE_SYSTEM_NOTIFY_COMMAND } from "./node-commands-BLhGKTZa.mjs";
import { i as normalizePluginGatewayMethodScope, r as createPluginGatewayMethodDescriptor } from "./descriptor-ByqpE-ah.mjs";
import { h as readProviderTextResponse, m as readProviderJsonResponse, o as createProviderHttpError } from "./provider-http-errors-CTY_-ABT.mjs";
import { n as inspectBundleMcpRuntimeSupport } from "./bundle-mcp-BCbIrwKD.mjs";
import { S as hasInvalidLifecycleStartTimestamp, i as emitAgentEvent } from "./agent-events-BOSJcayE.mjs";
import { S as withPluginRegistryPreparationScope, c as getPluginRecordRegistry, d as isPluginRecordActive, f as isPluginRegistryActivated, h as isPluginRegistryRetired, i as capturePluginLifecycleAuthority, m as isPluginRegistryPreparing, s as getPluginLoaderCacheState, u as getPluginRegistryResourceOwner, x as revokePluginRecord } from "./registry-lifecycle-xdpzLZzd.mjs";
import { D as withPluginRegistrationContext, I as publishPluginSessionSchedulerJobs, L as registerPluginSessionSchedulerJob, M as deletePluginSessionSchedulerJob, N as getPluginRunContext, R as setPluginRunContext, _ as recordImportedPluginId, f as getActivePluginRegistryWorkspaceDir, j as clearPluginRunContext, l as getActivePluginRegistry } from "./runtime-B2zZQffc.mjs";
import { a as normalizePluginHostHookId, i as normalizeOptionalHostHookString, n as normalizeHostHookString, r as normalizeHostHookStringList } from "./host-hooks-D9_pJ8kZ.mjs";
import { i as fetchWithSsrFGuard } from "./fetch-guard-EFfAF2PS.mjs";
import { c as findActiveDegradedSecretOwner, n as SecretSurfaceUnavailableError } from "./runtime-degraded-state-DVMYGogL.mjs";
import { n as normalizeSecretInput, t as normalizeOptionalSecretInput } from "./normalize-secret-input-Df_qhWv_.mjs";
import { a as resolveTokenExpiryState, l as isOAuthRefreshFence, r as hasUsableOAuthCredential } from "./credential-state-CWZ_V0ds.mjs";
import { S as createExternalAuthRuntime, i as createAuthProfileStoreRuntime } from "./store-CTvq6MSF.mjs";
import { t as resolveAllowedModelRefCore } from "./model-selection-resolve-D7hqOXrq.mjs";
import { d as resolveProviderRequestHeaders } from "./provider-request-config-DOrVD029.mjs";
import { n as createDebugProxyWebSocketAgent, r as resolveDebugProxySettings } from "./env-BOt5Nx-y.mjs";
import { n as captureWsEvent } from "./runtime-Cr-8v8fa.mjs";
import { t as createRealtimeTranscriptionWebSocketSession } from "./websocket-session-DAhMrtO4.mjs";
import "./installed-plugin-index-records-Clh203og.mjs";
import { t as resolvePluginRegistrationConfigKey } from "./loader-registration-config-Cnug19UU.mjs";
import { t as bindPluginRegistryRuntime } from "./registry-runtime-binding-i7RQa2C4.mjs";
import { c as bindPluginRuntimeArtifactSelection, d as hasCompletedPluginRuntimeRegistration, f as resolvePluginLoadCacheContext, o as registryContainsRuntimePluginIds, p as resolveRuntimeSubagentMode, r as getLoadedRuntimePluginRegistry, s as resolveCompatibleRuntimePluginRegistry, t as createRuntimePluginManifestLookup, u as getPluginRuntimeEntrySource } from "./active-runtime-registry-k2s7FqfS.mjs";
import { n as resolvePluginRuntimeArtifact, t as clearPluginRuntimeArtifactResolutionMemo } from "./plugin-runtime-artifact-resolution-D0YkvU1X.mjs";
import { a as isConversationHookName, c as isPluginHookReplyDispatchKind, k as normalizePluginToolMatcher, l as isPromptInjectionHookName, o as isPluginHookAgentTrigger, s as isPluginHookName } from "./hooks-DuXrq03h.mjs";
import { a as normalizeAgentToolResultMiddlewareRuntimeIds, n as appendAgentToolResultMiddlewareScope, o as normalizeAgentToolResultMiddlewareRuntimes, t as agentToolResultMiddlewareRegistrationCoversTool } from "./agent-tool-result-middleware-CfincE3c.mjs";
import { c as createUnavailableRuntime, l as instrumentPluginInstanceApi, o as runPluginRegistration, s as buildPluginApi } from "./setup-registry-D5VN3YGP.mjs";
import { d as PluginRegistryInspectionResources, f as getPluginRegistryInspectionResources, o as registerContextEngineInRegistry } from "./registry-BKkCbmgx.mjs";
import { C as validatePluginStoreNamespace, S as validatePluginStoreKey, b as serializePluginStoreJson, w as validatePluginStorePositiveInteger, x as validateOptionalPluginStoreTtlMs, y as createPluginStoreOptionPolicy } from "./plugin-state-worker-errors-DPQ69K6p.mjs";
import { i as createPluginStateSyncKeyedStore, r as createPluginStateKeyedStore } from "./plugin-state-store-CgyXRuSI.mjs";
import { a as matchesScopedPluginOrDreamingSidecar, c as resolveAuthorizedDreamingSidecar, d as formatPluginFailureSummary, f as markPluginActivationDisabled, h as recordPluginError, i as detailPluginStartupTrace, l as validatePluginConfig, m as recordPluginConfiguredUnavailable, n as activatePluginRegistry, o as maybeThrowOnPluginLoadError, p as recordBundleDiagnostics, r as createPluginCandidatesFromManifestRegistry, s as preparePluginLoadRecord, u as formatMissingPluginRegisterError } from "./loader-shared-CminlXwi.mjs";
import { i as withProfile } from "./plugin-load-profile-Bo_sVzOb.mjs";
import { p as requestSessionEventWake } from "./heartbeat-wake-bWS25cgK.mjs";
import { o as enqueueSystemEventFromSdk } from "./system-events-DevGIiH8.mjs";
import { c as registerPluginDashboardCapabilities, o as PluginDashboardDeclarationError, t as createPluginBoardWidgetContentKindRegistrar } from "./board-widget-content-kinds-BjjfWoCI.mjs";
import { a as resolveSetupChannelRegistration, i as resolveBundledRuntimeChannelRegistration, n as loadBundledRuntimeChannelPlugin, o as shouldLoadChannelPluginInSetupRuntime, r as mergeSetupRuntimeChannelPlugin, t as channelPluginIdBelongsToManifest } from "./loader-channel-setup-gIbhbeVR.mjs";
import { O as getCoreEmbeddingProvider } from "./gateway-startup-plugin-config-XCCRUavD.mjs";
import { n as resolveDecisionModelSetting, t as getConfiguredDecisionProviderIds } from "./decision-model-setting-BX2feN2y.mjs";
import { a as resolveProviderRuntimeWorkspaceDir, r as matchesProviderPluginRef } from "./provider-registry-shared-CGngP_UC.mjs";
import { t as resolveExternalPluginRuntimeDependencyRepairHint } from "./official-external-plugin-repair-hints-B2sBFVIg.mjs";
import { i as replacePluginHttpRoutes, r as projectPluginHttpRoutes, t as getPluginHttpRouteViews } from "./http-route-owner-CyFsFlZs.mjs";
import { n as resolveCronListPageNextOffset, t as readCanonicalCronListPage } from "./list-page-validation-myXdxCmr.mjs";
import { l as getActiveSecretsRuntimeSnapshotRevisionState } from "./runtime-state-CtZtwiOt.mjs";
import { r as validateDecisionResult, t as DecisionContractError } from "./validation-DRK4SBoT.mjs";
import { r as registerPluginInteractiveHandlerInRegistry } from "./interactive-registry-Bq5qVG5E.mjs";
import { i as classifyGatewayProbePath } from "./gateway-http-route-contracts-jBtizxKU.mjs";
import { t as normalizeSessionEntrySlotKey } from "./session-entry-slot-keys-CAUcdkW5.mjs";
import { n as normalizePluginHttpPath, t as findPluginHttpRouteRegistrationConflicts } from "./http-route-overlap-CYyCb1q8.mjs";
import { r as registerPluginCommandInRegistry, t as isReservedCommandName } from "./command-registration-CddDTMHE.mjs";
import { n as validateWorkerProviderContract } from "./worker-provider-registry-DRB5p70d.mjs";
import "./with-timeout-DI2A0gT4.mjs";
import { n as resolvePromptInjectionAllowed, t as resolveConversationAccessAllowed } from "./hook-policy-decisions-DL3kOjGW.mjs";
import { t as createHostChannelInboundEventContextBuilder } from "./host-context-builder-CFkGVEZB.mjs";
import { n as createHostChannelIngressRuntime } from "./runtime-DRt6NcU3.mjs";
import { n as createChannelIngressDrain } from "./ingress-drain-Drc4V_K5.mjs";
import { t as createChannelIngressQueue } from "./ingress-queue-D-wMlCUi.mjs";
import { a as MAX_PLUGIN_BLOB_ENTRIES_PER_PLUGIN, f as wrapPluginBlobError, i as MAX_PLUGIN_BLOB_BYTES_PER_PLUGIN, n as pluginBlobWorkerOperations, r as MAX_PLUGIN_BLOB_BYTES_PER_ENTRY } from "./plugin-blob-worker-contract-CABc82se.mjs";
import { t as PluginTrustRefusalError } from "./plugin-trust-Czz4RpQ5.mjs";
import { a as setPluginRuntimeLoadContext, n as createPluginRuntimeLoaderLogger, r as getPluginRuntimeLoadContext, t as buildPluginRuntimeLoadOptions } from "./load-context-D-CZ4KSw.mjs";
import { n as externalCliDiscoveryForProviderAuth } from "./external-cli-discovery-BbOBKQM3.mjs";
import { a as resolveAuthProfileOrder, n as isStoredCredentialCompatibleWithAuthProvider, p as listProfilesForProvider, t as isConfiguredAwsSdkAuthProfileForProvider } from "./order-BQhYF772.mjs";
import { l as readInlineProviderApiKeyUsage } from "./usage-state-Bm5iXGhR.mjs";
import { t as canResolveEnvSecretRefInReadOnlyPath } from "./secret-ref-readonly.internal-DPtRYfnc.mjs";
import { t as NON_ENV_SECRETREF_MARKER } from "./provider-credential-values-DSE2VVU-.mjs";
import { a as SECRETREF_ENV_HEADER_MARKER_PREFIX, n as CUSTOM_LOCAL_AUTH_MARKER, o as isKnownEnvApiKeyMarker, s as isNonSecretApiKeyMarker } from "./model-auth-markers-BfYDKFYI.mjs";
import { t as resolveEnvApiKey } from "./model-auth-env-CmdBc7TL.mjs";
import { t as isLocalProviderBaseUrl } from "./model-provider-local-BgnUkLMP.mjs";
import { a as resolveDiscoverableProviderOwnerPluginIds, c as resolveExternalAuthProfileProviderPluginIds, f as resolveOwningPluginIdsForProviderRef, n as resolveActivatableProviderOwnerPluginIds, o as resolveDiscoveredProviderPluginIds, r as resolveBundledProviderCompatPluginIds, s as resolveEnabledProviderPluginIds, u as resolveOwningPluginIdsForModelRefs } from "./providers-Bx7WoFEI.mjs";
import { t as attachModelProviderLocalServiceReconciler } from "./provider-local-service-reconcile-BYimpgvx.mjs";
import { n as withActivatedPluginIds, t as resolveBundledCompatActivationInputs } from "./activation-context-CNegFLwh.mjs";
import fs from "node:fs";
import { isDeepStrictEqual, types } from "node:util";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { serialize } from "node:v8";
//#region src/plugins/capability-catalog-context.ts
function createPluginCapabilityCatalogContext(availability) {
	const { isProviderApiKeyConfigured, isProviderAuthProfileConfigured, resolveProviderAuthProfileApiKey } = availability;
	return Object.freeze({
		isProviderApiKeyConfigured,
		isProviderAuthProfileConfigured,
		resolveAgentDir,
		createRealtimeTranscriptionWebSocketSession,
		resolveProviderRequestHeaders,
		resolveProviderAuthProfileApiKey,
		resolveApiKeyForProvider: async (params) => (await import("./runtime-model-auth.runtime.js")).resolveProviderRuntimeApiKey(params),
		captureWsEvent,
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
//#region src/plugins/loader-provenance.ts
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
	if (matcher.exact.has(sourcePath)) return true;
	return matcher.dirs.some((dirPath) => isPathInside(dirPath, sourcePath));
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
	if (!params.emitWarning) return;
	if (!params.pluginsEnabled) return;
	const autoDiscoverable = params.discoverablePlugins.filter((entry) => (entry.origin === "workspace" || entry.origin === "global") && !params.explicitlyEnabledPluginIds?.has(entry.id));
	if (autoDiscoverable.length === 0) return;
	const allDiscoveredIds = new Set(params.discoverablePlugins.map((entry) => entry.id));
	const hasConfiguredAllowlist = params.allow.length > 0;
	const allowHasDiscoveredMatch = params.allow.some((id) => allDiscoveredIds.has(id));
	if (hasConfiguredAllowlist && allowHasDiscoveredMatch) return;
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
/** Adds diagnostics for loaded plugins without install or load-path provenance. */
function warnAboutUntrackedLoadedPlugins(params) {
	const allowSet = new Set(params.allowlist);
	for (const plugin of params.registry.plugins) {
		if (plugin.status !== "loaded" || plugin.origin === "bundled") continue;
		if (allowSet.has(plugin.id)) continue;
		const installOwner = params.installOwnerByPluginId.get(plugin.id);
		if (installOwner && isTrackedByProvenance({
			pluginId: installOwner,
			source: plugin.source,
			index: params.provenance,
			env: params.env
		})) continue;
		const message = `OpenClaw can't verify where this plugin came from. Review it with '${formatPluginInspectCommand(plugin.id)}'. Adding it to plugins.allow lets it load, but does not make it trusted. If it's an official plugin, reinstall it from its official npm package or its official ClawHub listing to enable trusted features.`;
		params.registry.diagnostics.push({
			level: "warn",
			pluginId: plugin.id,
			source: plugin.source,
			message
		});
		if (params.emitWarning) params.logger.warn(`[plugins] ${plugin.id}: ${message} (${plugin.source})`);
	}
}
//#endregion
//#region src/plugins/loader-discovery.ts
function resolvePluginLoadDiscovery(params) {
	const { options, context } = params;
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
	params.diagnostics.push(...manifestRegistry.diagnostics);
	warnWhenAllowlistIsOpen({
		emitWarning: params.emitWarning,
		logger: params.logger,
		pluginsEnabled: context.normalized.enabled,
		allow: context.normalized.allow,
		warningCacheKey: params.warningCacheKey,
		warningCache: context.cacheState,
		explicitlyEnabledPluginIds: new Set(Object.entries(context.normalized.entries).filter(([, entry]) => entry.enabled === true).map(([pluginId]) => pluginId)),
		discoverablePlugins: manifestRegistry.plugins.filter((plugin) => !params.onlyPluginIdSet || params.onlyPluginIdSet.has(plugin.id))
	});
	const provenance = buildProvenanceIndex({
		normalizedLoadPaths: context.normalized.loadPaths,
		env: context.env,
		installRecords: context.installRecords
	});
	const manifestBySource = new Map(manifestRegistry.plugins.map((record) => [record.source, record]));
	return {
		discovery,
		manifestRegistry,
		orderedCandidates: discovery.candidates.filter((candidate) => manifestBySource.has(candidate.source)),
		manifestBySource,
		provenance
	};
}
//#endregion
//#region src/plugins/runtime/runtime-config.ts
function createRuntimeConfig() {
	return {
		current: getRuntimeConfig,
		mutateConfigFile: async (params) => {
			const { mutateConfigFile } = await import("./mutate-RdF5T4lL.mjs");
			return await mutateConfigFile(params);
		},
		replaceConfigFile: async (params) => {
			const { replaceConfigFile } = await import("./mutate-RdF5T4lL.mjs");
			return await replaceConfigFile(params);
		}
	};
}
//#endregion
//#region src/plugins/runtime/native-deps.ts
/** Formats concise guidance for installing and rebuilding a native dependency. */
function formatNativeDependencyHint(params) {
	const manager = params.manager ?? "pnpm";
	const rebuildCommand = params.rebuildCommand ?? (manager === "npm" ? `npm rebuild ${params.packageName}` : manager === "yarn" ? `yarn rebuild ${params.packageName}` : `pnpm rebuild ${params.packageName}`);
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
const loadHeartbeatRunnerRuntime = createLazyRuntimeModule(() => import("./heartbeat-runner-D7AZw--w.mjs"));
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
		config: createRuntimeConfig(),
		state: {
			resolveStateDir,
			openBlobStore: unavailable("openBlobStore"),
			openKeyedStore: unavailable("openKeyedStore"),
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
	tasks: true,
	modelConfig: true
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
			if (prop === "config" || prop === "state" || prop === "system") return base[prop];
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
//#region src/plugins/capability-catalog.ts
const capabilityCatalogFamilies = [
	"speechProviders",
	"realtimeTranscriptionProviders",
	"realtimeVoiceProviders"
];
/** Materialize one registration without copying its descriptor or invoking provider operations. */
function resolveCapabilityProviderRegistration(entry, resolveContext) {
	if (typeof entry !== "function") return entry;
	if (!resolveContext) throw new Error("Capability provider factories require host context; supply resolveCapabilityCatalogContext when creating the registry.");
	const provider = entry(wrapCurrentPluginInstance(resolveContext()));
	if (isPromiseLike(provider)) {
		Promise.resolve(provider).catch(() => {});
		throw new Error("capability provider factories must be synchronous");
	}
	return provider;
}
/** Validate the declared public surface without copying provider objects or their hidden methods. */
function resolvePluginCapabilityCatalog(module, context) {
	const entry = unwrapDefaultModuleExport(module);
	const catalog = typeof entry === "function" ? entry(context) : entry;
	if (isPromiseLike(catalog)) {
		Promise.resolve(catalog).catch(() => {});
		throw new Error("capability catalog factories must be synchronous");
	}
	if (!isRecord(catalog)) throw new Error("default export must synchronously provide a capability descriptor collection");
	const methods = {
		speechProviders: "synthesize",
		realtimeTranscriptionProviders: "createSession",
		realtimeVoiceProviders: "createBridge"
	};
	for (const [family, providers] of Object.entries(catalog)) {
		if (!Object.hasOwn(methods, family)) throw new Error(`unknown capability catalog family: ${family}`);
		const method = methods[family];
		if (!Array.isArray(providers) || providers.some((provider) => !isRecord(provider) || typeof provider.id !== "string" || !provider.id.trim() || typeof provider.label !== "string" || typeof provider.isConfigured !== "function" || typeof provider[method] !== "function")) throw new Error(`${family} must contain complete provider descriptors`);
	}
	return catalog;
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
	};
	const setupRegistration = resolveSetupChannelRegistration(params.mod);
	if ("loadError" in setupRegistration) {
		recordSetupFailure(setupRegistration.loadError, "load", "failed to load setup entry");
		return true;
	}
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
	let mergedSetupRegistration = setupRegistration;
	try {
		applyChannelRuntime(setupRegistration.setChannelRuntime);
	} catch (error) {
		recordSetupFailure(error, "load", "failed to apply setup channel runtime");
		return true;
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
			recordSetupFailure(error, "load", "failed to load setup-runtime entry");
			return true;
		}
		const runtimeRegistration = resolveBundledRuntimeChannelRegistration(runtimeMod);
		if (runtimeRegistration.id && runtimeRegistration.id !== record.id) {
			params.pushPluginLoadError(`plugin id mismatch (config uses "${record.id}", runtime entry uses "${runtimeRegistration.id}")`);
			return true;
		}
		if (runtimeRegistration.setChannelRuntime) try {
			if (runtimeRegistration.setChannelRuntime !== setupRegistration.setChannelRuntime) applyChannelRuntime(runtimeRegistration.setChannelRuntime);
		} catch (error) {
			recordSetupFailure(error, "load", "failed to apply setup-runtime channel runtime");
			return true;
		}
		const runtimePluginRegistration = loadBundledRuntimeChannelPlugin({ registration: runtimeRegistration });
		if ("loadError" in runtimePluginRegistration) {
			recordSetupFailure(runtimePluginRegistration.loadError, "load", "failed to load setup-runtime channel entry");
			return true;
		}
		if (runtimePluginRegistration.plugin) {
			if (runtimePluginRegistration.plugin.id && runtimePluginRegistration.plugin.id !== record.id) {
				params.pushPluginLoadError(`plugin id mismatch (config uses "${record.id}", runtime export uses "${runtimePluginRegistration.plugin.id}")`);
				return true;
			}
			mergedSetupRegistration = {
				...setupRegistration,
				plugin: mergeSetupRuntimeChannelPlugin(runtimePluginRegistration.plugin, setupRegistration.plugin),
				setChannelRuntime: runtimeRegistration.setChannelRuntime ?? setupRegistration.setChannelRuntime
			};
		}
	}
	const mergedSetupPlugin = mergedSetupRegistration.plugin;
	if (!mergedSetupPlugin) return true;
	if (!channelPluginIdBelongsToManifest({
		channelId: mergedSetupPlugin.id,
		pluginId: record.id,
		manifestChannels: manifestRecord.channels
	})) {
		params.pushPluginLoadError(`plugin id mismatch (config uses "${record.id}", setup export uses "${mergedSetupPlugin.id}")`);
		return true;
	}
	if (registrationPlan.mode === "setup-runtime" && mergedSetupRegistration.registerSetupRuntime) try {
		runPluginRegisterSyncInRegistry((registrationApi) => mergedSetupRegistration.registerSetupRuntime?.(registrationApi), api, registryBuilder.registry, record.id);
	} catch (error) {
		recordSetupFailure(error, "register", "failed to register setup-runtime channel side effects");
		return true;
	}
	try {
		api.registerChannel(mergedSetupPlugin);
	} catch (error) {
		recordSetupFailure(error, "load", "failed to register setup channel");
		return true;
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
		mode,
		loadSetupEntry,
		loadSetupRuntimeEntry: mode === "setup-runtime",
		runRuntimeCapabilityPolicy: !loadSetupEntry,
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
		registry.plugins.push(record);
		state.seenIds.set(pluginId, candidate.origin);
		return;
	}
	if (!enableState.enabled) markPluginActivationDisabled(record, enableState.reason);
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
	if (registrationPlan.runRuntimeCapabilityPolicy && candidate.origin === "bundled" && hasKind(manifestRecord.kind, "memory") && !isDreamingSidecar) {
		const earlyMemoryDecision = resolveMemorySlotDecision({
			id: record.id,
			kind: manifestRecord.kind,
			slot: memorySlot,
			selectedId: state.selectedMemoryPluginId
		});
		if (!earlyMemoryDecision.enabled) {
			record.enabled = false;
			markPluginActivationDisabled(record, earlyMemoryDecision.reason);
			registry.plugins.push(record);
			state.seenIds.set(pluginId, candidate.origin);
			return;
		}
	}
	if (!manifestRecord.configSchema) {
		pushPluginLoadError("missing config schema");
		return;
	}
	if (!context.shouldLoadModules && registrationPlan.runRuntimeCapabilityPolicy) {
		const memoryDecision = resolveMemorySlotDecision({
			id: record.id,
			kind: record.kind,
			slot: memorySlot,
			selectedId: state.selectedMemoryPluginId
		});
		if (!memoryDecision.enabled && !isDreamingSidecar) {
			record.enabled = false;
			markPluginActivationDisabled(record, memoryDecision.reason);
			registry.plugins.push(record);
			state.seenIds.set(pluginId, candidate.origin);
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
		registry.plugins.push(record);
		state.seenIds.set(pluginId, candidate.origin);
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
			for (const provider of catalog.speechProviders ?? []) params.registryBuilder.registerSpeechProvider(record, provider);
			for (const provider of catalog.realtimeTranscriptionProviders ?? []) params.registryBuilder.registerRealtimeTranscriptionProvider(record, provider);
			for (const provider of catalog.realtimeVoiceProviders ?? []) params.registryBuilder.registerRealtimeVoiceProvider(record, provider);
			record.imported = false;
			record.capabilityCatalog = capabilityCatalogFamilies.filter((key) => Object.hasOwn(catalog, key));
			registry.plugins.push(record);
			state.seenIds.set(pluginId, candidate.origin);
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
			registry.plugins.push(record);
			state.seenIds.set(pluginId, candidate.origin);
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
	let failurePhase = "load";
	let failed = false;
	const beforeModuleLoad = performance.now();
	try {
		if (!cliMetadata) recordImportedPluginId(record.id);
		state.pluginLoadAttemptCount++;
		params.logger.debug?.(`[plugins] loading ${record.id} from ${safeSource}`);
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
			return params.loadPluginModule(source, {
				record,
				rootDir: moduleRoot,
				registry,
				standalone: manifestRecord.manifestPath === candidate.source
			});
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
			const memoryDecision = resolveMemorySlotDecision({
				id: record.id,
				kind: record.kind,
				slot: memorySlot,
				selectedId: state.selectedMemoryPluginId
			});
			if (!memoryDecision.enabled) {
				params.registryBuilder.rollbackPluginGlobalSideEffects(record.id, record);
				record.enabled = false;
				markPluginActivationDisabled(record, memoryDecision.reason);
				registry.plugins.push(record);
				state.seenIds.set(pluginId, candidate.origin);
				return;
			}
			if (memoryDecision.selected && hasKind(record.kind, "memory")) {
				state.selectedMemoryPluginId = record.id;
				record.memorySlotSelected = true;
			}
		}
		if (params.validateOnly) {
			registry.plugins.push(record);
			state.seenIds.set(pluginId, candidate.origin);
			return;
		}
		if (typeof register !== "function") {
			const wrongLoaderError = formatBundledChannelWrongLoaderError(record.kind);
			if (wrongLoaderError) {
				params.logger.error(`[plugins] ${record.id} ${wrongLoaderError}; ensure plugin is loaded via bundled channel discovery, not legacy plugin loader`);
				pushPluginLoadError(wrongLoaderError);
			} else {
				params.logger.error(`[plugins] ${record.id} missing register/activate export`);
				pushPluginLoadError(formatMissingPluginRegisterError(mod, context.env));
			}
			return;
		}
		beforeRegister = performance.now();
		failurePhase = "register";
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
		registry.plugins.push(record);
		state.seenIds.set(pluginId, candidate.origin);
		if (clearMismatchedQuarantineAfterLoad) clearActiveDegradedPlugin(pluginId);
	} catch (error) {
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
			["loadFailedCount", failed && failurePhase === "load" ? 1 : 0],
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
//#region src/plugins/registry-contributions.ts
function projectArray(source, target, owns) {
	if (target) target.push(...source.filter(owns));
	else for (let index = source.length - 1; index >= 0; index--) if (owns(source[index])) source.splice(index, 1);
}
function projectMap(source, target, owns) {
	for (const [key, entry] of source) {
		if (!owns(entry, key)) continue;
		if (target) target.set(key, entry);
		else source.delete(key);
	}
}
/** Copy exact owned contributions into a candidate, or remove them during failed registration. */
function projectPluginContributions(source, record, target) {
	const pluginId = record.id;
	projectPluginHttpRoutes(source, record, target);
	const owns = (entry) => entry.pluginId === pluginId;
	for (const key of pluginArrays) projectArray(source[key], target?.[key], owns);
	invalidateProviderRegistryIndex((target ?? source).providers);
	for (const key of pluginMaps) projectMap(source[key], target?.[key], owns);
	projectArray(source.compactionProviders, target?.compactionProviders, (entry) => entry.ownerPluginId === pluginId);
	projectMap(source.contextEngines, target?.contextEngines, (entry) => entry.owner === `plugin:${pluginId}`);
	projectMap(source.pluginRuntimeArtifacts, target?.pluginRuntimeArtifacts, (_entry, key) => JSON.parse(key)[0] === pluginId);
	const ownsMethod = (entry) => entry.owner.kind === "plugin" && entry.owner.pluginId === pluginId;
	for (const entry of source.gatewayMethodDescriptors.filter(ownsMethod)) if (target) target.gatewayHandlers[entry.name] = source.gatewayHandlers[entry.name];
	else delete source.gatewayHandlers[entry.name];
	projectArray(source.gatewayMethodDescriptors, target?.gatewayMethodDescriptors, ownsMethod);
}
//#endregion
//#region src/plugins/agent-event-emission.ts
const HOST_OWNED_AGENT_EVENT_STREAMS = /* @__PURE__ */ new Set([
	"lifecycle",
	"tool",
	"assistant",
	"error",
	"item",
	"plan",
	"approval",
	"command_output",
	"patch",
	"compaction",
	"thinking",
	"model"
]);
function isPluginOwnedAgentEventStream(pluginId, stream) {
	return stream === pluginId || stream.startsWith(`${pluginId}.`);
}
function normalizePluginEventData(params) {
	if (params.data && typeof params.data === "object" && !Array.isArray(params.data)) return {
		...params.data,
		pluginId: params.pluginId,
		...params.pluginName ? { pluginName: params.pluginName } : {}
	};
	return {
		value: params.data,
		pluginId: params.pluginId,
		...params.pluginName ? { pluginName: params.pluginName } : {}
	};
}
function emitPluginAgentEvent(params) {
	const runId = normalizeOptionalString(params.event.runId);
	const sessionKey = normalizeOptionalString(params.event.sessionKey);
	const stream = normalizeOptionalString(params.event.stream);
	if (!runId || !stream) return {
		emitted: false,
		reason: "runId and stream are required"
	};
	if (!isPluginJsonValue(params.event.data)) return {
		emitted: false,
		reason: "event data must be JSON-compatible"
	};
	if (params.origin !== "bundled" && HOST_OWNED_AGENT_EVENT_STREAMS.has(stream)) return {
		emitted: false,
		reason: `stream ${stream} is reserved for bundled plugins`
	};
	if (params.origin !== "bundled" && !isPluginOwnedAgentEventStream(params.pluginId, stream)) return {
		emitted: false,
		reason: `stream ${stream} must be scoped to plugin ${params.pluginId}`
	};
	if (hasInvalidLifecycleStartTimestamp(stream, params.event.data)) return {
		emitted: false,
		reason: "lifecycle start requires a finite startedAt timestamp"
	};
	emitAgentEvent({
		runId,
		stream,
		...sessionKey ? { sessionKey } : {},
		data: normalizePluginEventData({
			pluginId: params.pluginId,
			pluginName: params.pluginName,
			data: params.event.data
		})
	});
	return {
		emitted: true,
		stream
	};
}
//#endregion
//#region src/plugins/host-hook-scheduled-turns.ts
const log = createSubsystemLogger("plugins/host-scheduled-turns");
const PLUGIN_CRON_NAME_PREFIX = "plugin:";
const PLUGIN_CRON_TAG_MARKER = ":tag:";
const PLUGIN_CRON_CLEANUP_PAGE_SIZE = 200;
const PLUGIN_CRON_CLEANUP_MAX_PAGES = 50;
const PLUGIN_CRON_CLEANUP_MAX_SNAPSHOT_RESTARTS = 3;
function resolveSchedule(params) {
	const cron = normalizeOptionalString(params.cron);
	if (cron) {
		const tz = normalizeOptionalString(params.tz);
		return {
			kind: "cron",
			expr: cron,
			...tz ? { tz } : {}
		};
	}
	if ("delayMs" in params) {
		if (!Number.isFinite(params.delayMs) || params.delayMs < 0) return;
		const timestamp = resolveExpiresAtMsFromDurationMs(Math.max(1, Math.floor(params.delayMs)));
		const at = timestampMsToIsoString(timestamp);
		if (!at) return;
		return {
			kind: "at",
			at
		};
	}
	const rawAt = params.at;
	const at = rawAt instanceof Date ? rawAt : new Date(rawAt);
	if (!Number.isFinite(at.getTime())) return;
	return {
		kind: "at",
		at: at.toISOString()
	};
}
function resolveSessionEventDeliveryMode(deliveryMode) {
	if (deliveryMode === void 0) return;
	if (deliveryMode === "none" || deliveryMode === "announce") return deliveryMode;
}
function formatScheduleLogContext(params) {
	const parts = [`pluginId=${params.pluginId}`];
	if (params.sessionKey) parts.push(`sessionKey=${params.sessionKey}`);
	if (params.name) parts.push(`name=${params.name}`);
	if (params.jobId) parts.push(`jobId=${params.jobId}`);
	return parts.join(" ");
}
async function removeScheduledSessionTurn(params) {
	try {
		return didCronCleanupJob(await params.cron.remove(params.jobId));
	} catch (error) {
		log.warn(`plugin session turn cleanup failed (${formatScheduleLogContext(params)}): ${formatErrorMessage(error)}`);
		return false;
	}
}
function didCronRemoveJob(value) {
	return isCronRemoveResult(value) && value.ok && value.removed;
}
function didCronCleanupJob(value) {
	return isCronRemoveResult(value) && value.ok;
}
const PLUGIN_CRON_RESERVED_DELIMITER = ":";
function resolvePluginSessionTurnTag(value) {
	const tag = normalizeOptionalString(value);
	if (!tag) return { invalid: false };
	if (tag.includes(PLUGIN_CRON_RESERVED_DELIMITER)) return { invalid: true };
	return {
		tag,
		invalid: false
	};
}
function buildPluginSchedulerCronName(params) {
	const uniqueId = params.uniqueId ?? randomUUID();
	if (!params.tag) return `${PLUGIN_CRON_NAME_PREFIX}${params.pluginId}:${params.sessionKey}:${uniqueId}`;
	return `${PLUGIN_CRON_NAME_PREFIX}${params.pluginId}${PLUGIN_CRON_TAG_MARKER}${params.tag}:${params.sessionKey}:${uniqueId}`;
}
function buildPluginSchedulerTagPrefix(params) {
	return `${PLUGIN_CRON_NAME_PREFIX}${params.pluginId}${PLUGIN_CRON_TAG_MARKER}${params.tag}:${params.sessionKey}:`;
}
function isCronRemoveResult(value) {
	return Boolean(value) && typeof value === "object" && !Array.isArray(value) && typeof value.ok === "boolean" && typeof value.removed === "boolean";
}
async function listAllCronJobsForPluginTagCleanup(cron, query) {
	for (let restart = 0; restart <= PLUGIN_CRON_CLEANUP_MAX_SNAPSHOT_RESTARTS; restart += 1) {
		const jobs = [];
		let offset = 0;
		let snapshotRevision;
		let total;
		let snapshotChanged = false;
		for (let pageNumber = 0; pageNumber < PLUGIN_CRON_CLEANUP_MAX_PAGES; pageNumber += 1) {
			const page = readCanonicalCronListPage(await cron.listPage({
				includeDisabled: true,
				limit: PLUGIN_CRON_CLEANUP_PAGE_SIZE,
				offset,
				query,
				sortBy: "name",
				sortDir: "asc"
			}), PLUGIN_CRON_CLEANUP_PAGE_SIZE);
			if (snapshotRevision !== void 0 && page.snapshotRevision !== snapshotRevision || total !== void 0 && page.total !== total) {
				snapshotChanged = true;
				break;
			}
			snapshotRevision ??= page.snapshotRevision;
			total ??= page.total;
			const nextOffset = resolveCronListPageNextOffset(page, offset);
			jobs.push(...page.jobs);
			if (nextOffset === null) return jobs;
			offset = nextOffset;
		}
		if (!snapshotChanged) throw new Error("cron.list pagination exceeded maximum pages");
		if (restart === PLUGIN_CRON_CLEANUP_MAX_SNAPSHOT_RESTARTS) throw new Error("cron.list inventory changed repeatedly during cleanup");
	}
	throw new Error("cron.list inventory changed repeatedly during cleanup");
}
async function schedulePluginSessionTurn(params) {
	if (params.origin !== "bundled") return;
	const sessionKey = normalizeOptionalString(params.schedule.sessionKey);
	const message = normalizeOptionalString(params.schedule.message);
	if (!sessionKey || !message) return;
	const cronSchedule = resolveSchedule(params.schedule);
	if (!cronSchedule) return;
	const rawDeliveryMode = params.schedule.deliveryMode;
	const deliveryMode = resolveSessionEventDeliveryMode(rawDeliveryMode);
	const scheduleName = normalizeOptionalString(params.schedule.name);
	if (rawDeliveryMode !== void 0 && !deliveryMode) {
		log.warn(`plugin session turn scheduling failed (${formatScheduleLogContext({
			pluginId: params.pluginId,
			sessionKey,
			...scheduleName ? { name: scheduleName } : {}
		})}): unsupported deliveryMode`);
		return;
	}
	if (cronSchedule.kind === "cron" && params.schedule.deleteAfterRun === true) {
		log.warn(`plugin session turn scheduling failed (${formatScheduleLogContext({
			pluginId: params.pluginId,
			sessionKey,
			...scheduleName ? { name: scheduleName } : {}
		})}): deleteAfterRun requires a one-shot schedule`);
		return;
	}
	const { tag, invalid: invalidTag } = resolvePluginSessionTurnTag(params.schedule.tag);
	if (invalidTag) {
		log.warn(`plugin session turn scheduling failed (${formatScheduleLogContext({
			pluginId: params.pluginId,
			sessionKey,
			...scheduleName ? { name: scheduleName } : {}
		})}): tag contains reserved delimiter ":"`);
		return;
	}
	const cronDeliveryMode = deliveryMode ?? "announce";
	if (params.shouldCommit && !params.shouldCommit()) return;
	if (!params.cron) {
		log.warn(`plugin session turn scheduling failed (${formatScheduleLogContext({
			pluginId: params.pluginId,
			sessionKey,
			...scheduleName ? { name: scheduleName } : {}
		})}): cron service unavailable`);
		return;
	}
	const cron = params.cron;
	const cronJobName = buildPluginSchedulerCronName({
		pluginId: params.pluginId,
		sessionKey,
		...tag !== void 0 ? { tag } : {},
		...scheduleName ? { uniqueId: scheduleName } : {}
	});
	const cronPayload = {
		kind: "agentTurn",
		message
	};
	let result;
	try {
		result = await cron.add({
			name: cronJobName,
			enabled: true,
			schedule: cronSchedule,
			sessionTarget: `session:${sessionKey}`,
			payload: cronPayload,
			...params.schedule.agentId ? { agentId: params.schedule.agentId } : {},
			deleteAfterRun: params.schedule.deleteAfterRun ?? cronSchedule.kind === "at",
			wakeMode: "now",
			delivery: {
				mode: cronDeliveryMode,
				...cronDeliveryMode === "announce" ? { channel: "last" } : {}
			}
		});
	} catch (error) {
		log.warn(`plugin session turn scheduling failed (${formatScheduleLogContext({
			pluginId: params.pluginId,
			sessionKey,
			name: cronJobName
		})}): ${formatErrorMessage(error)}`);
		return;
	}
	const jobId = result.id;
	if (!jobId) return;
	if (params.shouldCommit && !params.shouldCommit()) {
		if (!await removeScheduledSessionTurn({
			cron,
			jobId,
			pluginId: params.pluginId,
			sessionKey,
			name: cronJobName
		})) log.warn(`plugin session turn scheduling rollback failed (${formatScheduleLogContext({
			pluginId: params.pluginId,
			sessionKey,
			name: cronJobName,
			jobId
		})}): failed to remove stale scheduled session turn`);
		return;
	}
	return registerPluginSessionSchedulerJob({
		pluginId: params.pluginId,
		pluginName: params.pluginName,
		ownerRegistry: params.ownerRegistry,
		job: {
			id: jobId,
			sessionKey,
			kind: "session-turn",
			cleanup: async () => {
				if (!await removeScheduledSessionTurn({
					cron,
					jobId,
					pluginId: params.pluginId,
					sessionKey,
					name: cronJobName
				})) throw new Error(`failed to remove scheduled session turn: ${jobId}`);
			}
		}
	});
}
async function unschedulePluginSessionTurnsByTag(params) {
	if (params.origin !== "bundled") return {
		removed: 0,
		failed: 0
	};
	const sessionKey = normalizeOptionalString(params.request.sessionKey);
	const { tag, invalid: invalidTag } = resolvePluginSessionTurnTag(params.request.tag);
	if (!sessionKey || !tag || invalidTag) return {
		removed: 0,
		failed: 0
	};
	if (!params.cron) {
		log.warn("plugin session turn untag-list failed: cron service unavailable");
		return {
			removed: 0,
			failed: 1
		};
	}
	const cron = params.cron;
	const namePrefix = buildPluginSchedulerTagPrefix({
		pluginId: params.pluginId,
		tag,
		sessionKey
	});
	let jobs;
	try {
		jobs = await listAllCronJobsForPluginTagCleanup(cron, namePrefix);
	} catch (error) {
		log.warn(`plugin session turn untag-list failed: ${formatErrorMessage(error)}`);
		return {
			removed: 0,
			failed: 1
		};
	}
	const candidates = jobs.filter((job) => {
		return job.name.startsWith(namePrefix) && job.sessionTarget === `session:${sessionKey}`;
	});
	let removed = 0;
	let failed = 0;
	for (const job of candidates) {
		const id = job.id.trim();
		if (!id) continue;
		try {
			if (didCronRemoveJob(await cron.remove(id))) {
				removed += 1;
				deletePluginSessionSchedulerJob({
					pluginId: params.pluginId,
					jobId: id,
					sessionKey
				});
			} else failed += 1;
		} catch (error) {
			log.warn(`plugin session turn untag-remove failed: id=${id} error=${formatErrorMessage(error)}`);
			failed += 1;
		}
	}
	return {
		removed,
		failed
	};
}
//#endregion
//#region src/plugins/model-catalog-registration.ts
function mergeCatalogHookResults(source, left, right) {
	const rows = [...left ?? [], ...right ?? []];
	if (rows.length === 0) return null;
	const mergedRows = [];
	for (const row of rows) mergedRows.push({
		...row,
		source
	});
	return mergedRows;
}
function mergeModelCatalogHooks(source, left, right) {
	if (!left) return right;
	if (!right) return left;
	return async (ctx) => {
		const [leftRows, rightRows] = await Promise.all([left(ctx), right(ctx)]);
		return mergeCatalogHookResults(source, leftRows, rightRows);
	};
}
/** Creates handlers that register plugin model catalog providers into a registry. */
function createModelCatalogRegistrationHandlers(params) {
	const registerModelCatalogProvider = (record, provider) => {
		const providerId = normalizeOptionalString(provider.provider) ?? "";
		if (!providerId) {
			params.pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "model catalog provider registration missing provider"
			});
			return;
		}
		if (!provider.kinds || provider.kinds.length === 0) {
			params.pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `model catalog provider "${providerId}" registration missing kinds`
			});
			return;
		}
		const existing = params.registry.modelCatalogProviders.find((entry) => entry.provider.provider === providerId && entry.pluginId !== record.id);
		if (existing) {
			params.pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `model catalog provider already registered: ${providerId} (${existing.pluginId})`
			});
			return;
		}
		const normalizedKinds = uniqueValues(provider.kinds);
		const samePluginOverlapping = params.registry.modelCatalogProviders.find((entry) => entry.provider.provider === providerId && entry.pluginId === record.id && entry.provider.kinds.some((kind) => normalizedKinds.includes(kind)));
		if (samePluginOverlapping) {
			samePluginOverlapping.provider = {
				...samePluginOverlapping.provider,
				...provider,
				provider: providerId,
				kinds: uniqueValues([...samePluginOverlapping.provider.kinds, ...normalizedKinds]),
				staticCatalog: mergeModelCatalogHooks("static", samePluginOverlapping.provider.staticCatalog, provider.staticCatalog),
				liveCatalog: mergeModelCatalogHooks("live", samePluginOverlapping.provider.liveCatalog, provider.liveCatalog)
			};
			return;
		}
		params.registry.modelCatalogProviders.push({
			pluginId: record.id,
			pluginName: record.name,
			provider: {
				...provider,
				provider: providerId,
				kinds: normalizedKinds
			},
			source: record.source,
			rootDir: record.rootDir
		});
	};
	return { registerModelCatalogProvider };
}
//#endregion
//#region src/plugins/native-session-catalog-registration.ts
function hasReadableNativeCatalogConfig() {
	try {
		const configPath = resolveConfigPath();
		const link = fs.lstatSync(configPath);
		if (!(link.isSymbolicLink() ? fs.statSync(configPath) : link).isFile()) return false;
		fs.accessSync(configPath, fs.constants.R_OK);
		return true;
	} catch {
		return false;
	}
}
function guardCatalogListOperation(initialOperation, assertEnabled) {
	let operation = initialOperation;
	let closed = false;
	return {
		async next() {
			if (closed) throw new Error("Session catalog list operation is closed");
			if (!operation) return {
				done: true,
				hosts: []
			};
			assertEnabled();
			const step = await operation.next();
			assertEnabled();
			return step;
		},
		close() {
			if (closed) return;
			closed = true;
			const closing = operation;
			operation = void 0;
			if (closing) runPluginCleanup(closing, () => closing.close());
		}
	};
}
function createNativeSessionCatalogGate(params) {
	const legacyDefaultAllowed = hasLegacyNativeSessionCatalogDefault(params.pluginId) && hasReadableNativeCatalogConfig();
	const enabled = () => readNativeSessionCatalogPreference(params.getConfig(), params.pluginId) ?? legacyDefaultAllowed;
	const assertEnabled = () => {
		if (!enabled()) throw new Error(`Native conversation discovery is disabled for ${params.pluginId}. Enable it in that plugin's settings.`);
	};
	return {
		catalog(provider) {
			const { createListOperation, continueSession, copyToGatewaySession, archive, openTerminal, checkUpstreamActivity } = provider;
			return {
				...provider,
				list: async (query) => enabled() ? provider.list(query) : [],
				...createListOperation ? { createListOperation: (query) => guardCatalogListOperation(enabled() ? createListOperation.call(provider, query) : void 0, assertEnabled) } : {},
				read: async (request) => {
					assertEnabled();
					return provider.read(request);
				},
				...continueSession ? { continueSession: async (request) => {
					assertEnabled();
					return continueSession.call(provider, request);
				} } : {},
				...copyToGatewaySession ? { copyToGatewaySession: async (request) => {
					assertEnabled();
					return copyToGatewaySession.call(provider, request);
				} } : {},
				...archive ? { archive: async (request) => {
					assertEnabled();
					return archive.call(provider, request);
				} } : {},
				...openTerminal ? { openTerminal: async (request) => {
					assertEnabled();
					return openTerminal.call(provider, request);
				} } : {},
				...checkUpstreamActivity ? { checkUpstreamActivity: async (probes, policy) => enabled() ? checkUpstreamActivity.call(provider, probes, policy) : [] } : {}
			};
		},
		node(command) {
			const { prepare, watchAvailability } = command;
			return {
				...command,
				isAvailable: (context) => enabled() && (command.isAvailable?.(context) ?? true),
				...prepare ? { prepare: (context) => {
					if (enabled()) return prepare.call(command, context);
				} } : {},
				...watchAvailability ? { watchAvailability: (context, onChange) => {
					if (enabled()) return watchAvailability.call(command, context, onChange);
				} } : {},
				handle: async (...args) => {
					assertEnabled();
					return command.handle(...args);
				}
			};
		}
	};
}
//#endregion
//#region src/plugins/registry-state.ts
/** Decode the public mode once so domain registrars do not repeat string checks. */
function resolvePluginRegistrationCapabilities(mode) {
	return {
		capabilityHandlers: mode === "full" || mode === "discovery" || mode === "tool-discovery",
		setupRuntimeHandlers: mode === "setup-runtime",
		runtimeChannel: mode !== "setup-only" && mode !== "tool-discovery"
	};
}
function normalizeHookTimeoutMs(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return;
	return Math.floor(value);
}
function resolveTypedHookTimeoutMs(params) {
	return normalizeHookTimeoutMs(params.policy?.timeouts?.[params.hookName]) ?? normalizeHookTimeoutMs(params.policy?.timeoutMs) ?? normalizeHookTimeoutMs(params.opts?.timeoutMs);
}
function createRegistration(record, contribution) {
	return {
		pluginId: record.id,
		pluginName: record.name,
		...getPluginInstance(record)?.wrap(contribution) ?? contribution,
		source: record.source,
		rootDir: record.rootDir
	};
}
function createIdentityRegistration(record, contribution) {
	return {
		pluginId: record.id,
		pluginName: record.name,
		...getPluginInstance(record)?.adopt(contribution) ?? contribution,
		source: record.source,
		rootDir: record.rootDir
	};
}
function createPluginRegistryState(registryParams) {
	const registry = createEmptyPluginRegistry();
	const nativeCatalogGates = /* @__PURE__ */ new WeakMap();
	const getNativeCatalogGate = (record) => {
		if (!record.nativeSessionCatalog) return;
		let gate = nativeCatalogGates.get(record);
		if (!gate) {
			gate = createNativeSessionCatalogGate({
				pluginId: record.id,
				getConfig: () => registryParams.runtime.config.current()
			});
			nativeCatalogGates.set(record, gate);
		}
		return gate;
	};
	bindPluginRegistryRuntime(registry, registryParams.runtime);
	const coreGatewayMethods = new Set(registryParams.coreGatewayMethodNames);
	for (const name of Object.keys(registryParams.coreGatewayHandlers ?? {})) coreGatewayMethods.add(name);
	registry.coreGatewayMethodNames = Array.from(coreGatewayMethods).sort();
	const pushDiagnostic = (diagnostic) => {
		registry.diagnostics.push(diagnostic);
	};
	const reportRegistrationError = (record, message) => {
		pushDiagnostic({
			level: "error",
			pluginId: record.id,
			source: record.source,
			message
		});
	};
	const reportRegistrationWarning = (record, message) => {
		pushDiagnostic({
			level: "warn",
			pluginId: record.id,
			source: record.source,
			message
		});
	};
	const modelCatalogRegistrars = createModelCatalogRegistrationHandlers({
		registry,
		pushDiagnostic
	});
	return {
		registry,
		registryParams,
		getNativeCatalogGate,
		allowProcessHomeSessionCatalogs: registryParams.allowProcessHomeSessionCatalogs ?? true,
		coreGatewayMethods,
		getHostCronService: () => registryParams.hostServices?.cron,
		pluginsWithChannelRegistrationConflict: /* @__PURE__ */ new Set(),
		createRegistration,
		createIdentityRegistration,
		pushDiagnostic,
		reportRegistrationError,
		reportRegistrationWarning,
		...modelCatalogRegistrars
	};
}
//#endregion
//#region src/plugins/registry-api.ts
const loadAttachments = createLazyRuntimeModule(() => import("./host-hook-attachments-BDO8T5rV.mjs"));
const loadHookState = createLazyRuntimeModule(() => import("./host-hook-state-D-_ocou4.mjs"));
function normalizeLogger(logger) {
	return {
		info: logger.info,
		warn: logger.warn,
		error: logger.error,
		debug: logger.debug
	};
}
function resolvePluginPath(input, rootDir) {
	const trimmed = input.trim();
	if (!trimmed || path.isAbsolute(trimmed) || trimmed.startsWith("~")) return resolveUserPath(input);
	return rootDir ? path.resolve(rootDir, trimmed) : resolveUserPath(input);
}
function createPluginApiFactory(state, registrars, runtimeResolver) {
	const { registry, registryParams, getHostCronService, pushDiagnostic } = state;
	const { resolvePluginRuntime, resolveRegisteredChannelRuntime } = runtimeResolver;
	const createApi = (record, params) => {
		const registrationMode = params.registrationMode ?? "full";
		const registrationCapabilities = resolvePluginRegistrationCapabilities(registrationMode);
		const shouldCommitWorkflowSideEffect = () => capturePluginLifecycleAuthority(getPluginRecordRegistry(registry, record), record, { registration: true })?.() === true;
		const { registerChannel, ...bound } = Object.fromEntries(Object.entries(registrars).map(([name, register]) => [name, (...args) => Reflect.apply(register, void 0, [record, ...args])]));
		return buildPluginApi({
			id: record.id,
			name: record.name,
			version: record.version,
			description: record.description,
			source: record.source,
			runtimeSource: getPluginRuntimeEntrySource(record),
			rootDir: record.rootDir,
			registrationMode,
			config: params.config,
			pluginConfig: params.pluginConfig,
			runtime: registrationMode === "cli-metadata" ? createUnavailableRuntime(registrationMode, record.id) : resolvePluginRuntime(record),
			logger: normalizeLogger(registryParams.logger),
			resolvePath: (input) => resolvePluginPath(input, registrationMode === "cli-metadata" ? void 0 : record.rootDir),
			handlers: {
				...registrationCapabilities.capabilityHandlers ? {
					...bound,
					registerHook: (events, handler, opts) => bound.registerHook(events, handler, opts, params.config, params.pluginConfig),
					registerSpeechProvider: (entry) => {
						const provider = resolveCapabilityProviderRegistration(entry, registryParams.resolveCapabilityCatalogContext);
						bound.registerSpeechProvider(provider);
					},
					registerRealtimeTranscriptionProvider: (entry) => {
						const provider = resolveCapabilityProviderRegistration(entry, registryParams.resolveCapabilityCatalogContext);
						bound.registerRealtimeTranscriptionProvider(provider);
					},
					registerRealtimeVoiceProvider: (entry) => {
						const provider = resolveCapabilityProviderRegistration(entry, registryParams.resolveCapabilityCatalogContext);
						bound.registerRealtimeVoiceProvider(provider);
					},
					registerNodeInvokePolicy: (policy) => bound.registerNodeInvokePolicy(policy, params.pluginConfig),
					onConversationBindingResolved: bound.registerConversationBindingResolvedHandler,
					registerContextEngine: (id, factory) => bound.registerContextEngine(id, factory, registrationMode),
					registerAgentToolResultMiddleware: (handler, options) => {
						bound.registerAgentToolResultMiddleware(handler, options, params.hookPolicy);
					},
					enqueueNextTurnInjection: async (injection) => {
						if (params.hookPolicy?.allowPromptInjection === false) {
							pushDiagnostic({
								level: "warn",
								pluginId: record.id,
								source: record.source,
								message: `next-turn injection blocked by plugins.entries.${record.id}.hooks.allowPromptInjection=false`
							});
							return {
								enqueued: false,
								id: "",
								sessionKey: injection.sessionKey
							};
						}
						const { enqueuePluginNextTurnInjection } = await loadHookState();
						if (registryParams.activateGlobalSideEffects === false || !shouldCommitWorkflowSideEffect()) return {
							enqueued: false,
							id: "",
							sessionKey: injection.sessionKey
						};
						return enqueuePluginNextTurnInjection({
							cfg: registryParams.runtime.config.current(),
							pluginId: record.id,
							pluginName: record.name,
							injection
						});
					},
					emitAgentEvent: (event) => {
						if (registryParams.activateGlobalSideEffects === false) return {
							emitted: false,
							reason: "global side effects disabled"
						};
						if (!shouldCommitWorkflowSideEffect()) return {
							emitted: false,
							reason: "plugin is not loaded"
						};
						return emitPluginAgentEvent({
							pluginId: record.id,
							pluginName: record.name,
							origin: record.origin,
							event
						});
					},
					setRunContext: (patch) => registryParams.activateGlobalSideEffects !== false && shouldCommitWorkflowSideEffect() ? setPluginRunContext({
						pluginId: record.id,
						patch
					}) : false,
					getRunContext: (get) => registryParams.activateGlobalSideEffects !== false && shouldCommitWorkflowSideEffect() ? getPluginRunContext({
						pluginId: record.id,
						get
					}) : void 0,
					clearRunContext: (paramsLocal) => {
						if (registryParams.activateGlobalSideEffects === false || !shouldCommitWorkflowSideEffect()) return;
						clearPluginRunContext({
							pluginId: record.id,
							runId: paramsLocal.runId,
							namespace: paramsLocal.namespace
						});
					},
					sendSessionAttachment: async (attachment) => {
						if (registryParams.activateGlobalSideEffects === false) return {
							ok: false,
							error: "global side effects disabled"
						};
						try {
							const { sendPluginSessionAttachment } = await loadAttachments();
							if (!isPluginRecordActive(registry, record)) return {
								ok: false,
								error: "plugin is not loaded"
							};
							const runtimeConfig = registryParams.runtime.config?.current?.() ?? params.config;
							return await sendPluginSessionAttachment({
								...attachment,
								config: runtimeConfig,
								origin: record.origin
							});
						} catch (error) {
							return {
								ok: false,
								error: `attachment delivery setup failed: ${formatErrorMessage(error)}`
							};
						}
					},
					scheduleSessionTurn: async (schedule) => {
						if (registryParams.activateGlobalSideEffects === false) return;
						await Promise.resolve();
						return schedulePluginSessionTurn({
							pluginId: record.id,
							pluginName: record.name,
							origin: record.origin,
							schedule,
							cron: getHostCronService(),
							shouldCommit: shouldCommitWorkflowSideEffect,
							ownerRegistry: getPluginRecordRegistry(registry, record)
						});
					},
					unscheduleSessionTurnsByTag: async (request) => {
						if (registryParams.activateGlobalSideEffects === false) return {
							removed: 0,
							failed: 0
						};
						await Promise.resolve();
						if (!shouldCommitWorkflowSideEffect()) return {
							removed: 0,
							failed: 0
						};
						return unschedulePluginSessionTurnsByTag({
							pluginId: record.id,
							origin: record.origin,
							cron: getHostCronService(),
							request
						});
					},
					on: (hookName, handler, opts) => registrars.registerTypedHook(record, hookName, handler, opts, params.hookPolicy)
				} : {},
				...registrationCapabilities.setupRuntimeHandlers ? {
					registerHttpRoute: bound.registerHttpRoute,
					registerGatewayMethod: bound.registerGatewayMethod,
					registerSessionCatalog: bound.registerSessionCatalog
				} : {},
				registerCli: bound.registerCli,
				...registrationMode === "cli-metadata" ? {} : { registerChannel: (registration) => registerChannel(registration, registrationMode, registrationCapabilities.runtimeChannel ? () => resolveRegisteredChannelRuntime(record) : void 0) }
			}
		});
	};
	return createApi;
}
//#endregion
//#region src/decisions/provider-host.ts
const FAILURE_REASONS = /* @__PURE__ */ new Set([
	"credentials-unavailable",
	"authentication",
	"rate-limited",
	"transport",
	"unsupported-input",
	"invalid-response"
]);
const MAX_CONCURRENT = 4;
const COOLDOWN_MS = 1e4;
const MAX_RETRY_AFTER_MS = 6e4;
var DecisionConsumerClosedError = class extends Error {
	constructor() {
		super("Decision consumer authority closed.");
	}
};
/** Provider-owned admission and health. */
var DecisionProviderHost = class {
	constructor(provider, record) {
		this.provider = provider;
		this.record = record;
		this.retired = false;
		this.pending = /* @__PURE__ */ new Map();
		this.reasons = {};
		this.successCount = 0;
		this.totalLatencyMs = 0;
		this.inputTokens = 0;
		this.outputTokens = 0;
	}
	generation(config) {
		const secretRevision = getActiveSecretsRuntimeSnapshotRevisionState();
		const providerConfig = config.plugins?.entries?.[this.record.id];
		if (!this.health || this.health.secretRevision !== secretRevision || !isDeepStrictEqual(this.health.config, providerConfig)) this.health = {
			id: randomUUID(),
			secretRevision,
			config: providerConfig,
			failures: 0,
			openUntil: 0,
			authFailed: false,
			trial: false
		};
		return this.health;
	}
	unavailable(reason) {
		this.reasons[reason] = (this.reasons[reason] ?? 0) + 1;
		return {
			status: "unavailable",
			reason
		};
	}
	/** Close only capability admission before reversible native reload preparation. */
	pauseForReload(changedConsumerIds = /* @__PURE__ */ new Set()) {
		const token = {};
		this.reloadPause = token;
		for (const [controller, request] of this.pending) controller.abort(request.consumerId !== void 0 && changedConsumerIds.has(request.consumerId) ? new DecisionConsumerClosedError() : "decision-provider-retired");
		const assertResumable = () => {
			const instance = getPluginInstance(this.record);
			if (this.reloadPause !== token || this.retired || this.pending.size > 0 || !instance?.acceptingCalls || instance.owner?.revoked || instance.lifecycle.signal.aborted) throw new Error("Decision reload admission cannot safely resume.");
		};
		return {
			settled: Promise.all([...this.pending.values()].map((request) => request.done)),
			assertResumable,
			resume: () => {
				assertResumable();
				if (this.health) this.health = {
					...this.health,
					id: randomUUID(),
					trial: false
				};
				this.reloadPause = void 0;
			}
		};
	}
	/** Native service stop/disposal is irreversible; rollback must not reopen it. */
	retire() {
		this.retired = true;
		for (const controller of this.pending.keys()) controller.abort("decision-provider-retired");
	}
	cancelConsumer(pluginId) {
		for (const [controller, request] of this.pending) if (request.consumerId === pluginId) controller.abort(new DecisionConsumerClosedError());
	}
	async stop() {
		this.retire();
		await Promise.all([...this.pending.values()].map((request) => request.done));
	}
	ready() {
		try {
			const available = this.provider.isReady?.() ?? true;
			if (typeof available !== "boolean") throw new DecisionContractError();
			return available;
		} catch {
			throw new DecisionContractError();
		}
	}
	inspect(config) {
		const health = this.generation(config);
		const instance = getPluginInstance(this.record);
		const configured = getConfiguredDecisionProviderIds(config).includes(this.provider.id);
		const enabled = config.plugins?.enabled !== false && config.plugins?.entries?.[this.record.id]?.enabled !== false;
		const credentialReady = !this.retired && !this.reloadPause && instance?.acceptingCalls === true && instance.run(() => this.ready());
		return {
			providerId: this.provider.id,
			pluginId: this.record.id,
			configured,
			credentialReady,
			callable: configured && enabled && credentialReady && !health.authFailed && !health.trial && health.openUntil <= performance.now() && this.pending.size < MAX_CONCURRENT,
			runtimeGeneration: health.id,
			recentSuccessAt: health.lastSuccessAt,
			activeRequests: this.pending.size,
			successCount: this.successCount,
			totalLatencyMs: this.totalLatencyMs,
			usage: {
				inputTokens: this.inputTokens,
				outputTokens: this.outputTokens
			},
			reasons: { ...this.reasons }
		};
	}
	async evaluate(batch, options, model, config, registry, consumerId) {
		options.signal.throwIfAborted();
		let submitted;
		try {
			submitted = structuredClone(batch);
		} catch {
			throw new DecisionContractError();
		}
		const instance = getPluginInstance(this.record);
		if (this.retired || this.reloadPause || !instance?.acceptingCalls || instance.owner?.revoked) return this.unavailable("retiring");
		const health = this.generation(config);
		const readConfig = createRuntimeConfigReader(config);
		if (!instance.runInRegistry(registry, () => this.ready())) return this.unavailable("credentials-unavailable");
		if (health.authFailed || health.openUntil > performance.now() || health.trial) return this.unavailable("circuit-open");
		if (this.pending.size >= MAX_CONCURRENT) return this.unavailable("overloaded");
		const halfOpen = health.openUntil > 0;
		if (halfOpen) health.trial = true;
		const controller = new AbortController();
		const signal = AbortSignal.any([options.signal, controller.signal]);
		const started = performance.now();
		const budget = Math.min(options.timeoutMs, 3e4);
		const deadlineMonotonicMs = started + budget;
		const timer = setTimeout(() => controller.abort("decision-deadline"), budget);
		let settle;
		const done = new Promise((resolve) => {
			settle = resolve;
		});
		this.pending.set(controller, {
			consumerId,
			done
		});
		const interrupted = () => {
			options.signal.throwIfAborted();
			if (controller.signal.reason instanceof DecisionConsumerClosedError) throw controller.signal.reason;
			if (this.retired || controller.signal.reason === "decision-provider-retired") return this.unavailable("retiring");
			if (controller.signal.reason === "decision-deadline" || performance.now() >= deadlineMonotonicMs) return this.unavailable("deadline");
			const currentConfig = readConfig();
			const selection = resolveDecisionModelSetting(currentConfig, options.agentId);
			if (getActiveSecretsRuntimeSnapshotRevisionState() !== health.secretRevision || this.health !== health || currentConfig.plugins?.enabled === false || !isDeepStrictEqual(currentConfig.plugins?.entries?.[this.record.id], health.config) || selection?.provider !== this.provider.id || selection.model !== model) return this.unavailable("retiring");
		};
		try {
			let outcome;
			let questions;
			try {
				questions = structuredClone(submitted.questions);
				outcome = await instance.runInRegistry(registry, () => this.provider.evaluate(submitted, {
					model,
					...options.agentId ? { agentId: options.agentId } : {},
					signal,
					deadlineMonotonicMs
				}));
			} catch {
				const stopped = interrupted();
				if (stopped) {
					if (stopped.status === "unavailable" && stopped.reason === "deadline") this.fail(health, "transport");
					return stopped;
				}
				throw new DecisionContractError();
			}
			const stopped = interrupted();
			if (stopped) {
				if (stopped.status === "unavailable" && stopped.reason === "deadline") this.fail(health, "transport");
				return stopped;
			}
			if (outcome?.status === "ok") {
				if (!validateDecisionResult({ questions }, outcome.result)) {
					this.fail(health, "invalid-response");
					return this.unavailable("invalid-response");
				}
				health.failures = 0;
				health.openUntil = 0;
				health.lastSuccessAt = Date.now();
				this.successCount++;
				this.inputTokens += outcome.result.usage?.inputTokens ?? 0;
				this.outputTokens += outcome.result.usage?.outputTokens ?? 0;
				return {
					status: "ok",
					result: structuredClone(outcome.result),
					provenance: {
						providerId: this.provider.id,
						rubricVersion: options.rubricVersion,
						runtimeGeneration: health.id
					}
				};
			}
			if (outcome?.status !== "unavailable" || !FAILURE_REASONS.has(outcome.reason)) throw new DecisionContractError();
			this.fail(health, outcome.reason, outcome.retryAfterMs);
			return this.unavailable(outcome.reason);
		} catch (error) {
			options.signal.throwIfAborted();
			if (controller.signal.reason instanceof DecisionConsumerClosedError) throw controller.signal.reason;
			if (error instanceof DecisionContractError) throw error;
			throw new DecisionContractError();
		} finally {
			clearTimeout(timer);
			this.pending.delete(controller);
			if (halfOpen) health.trial = false;
			this.totalLatencyMs += performance.now() - started;
			settle();
		}
	}
	fail(health, reason, retryAfterMs) {
		if (this.health !== health || getActiveSecretsRuntimeSnapshotRevisionState() !== health.secretRevision || this.retired || this.reloadPause) return;
		if (reason === "authentication") {
			health.authFailed = true;
			return;
		}
		if (reason === "unsupported-input" || reason === "credentials-unavailable") return;
		health.failures++;
		const retryAfter = typeof retryAfterMs === "number" && Number.isFinite(retryAfterMs) ? Math.max(0, Math.min(retryAfterMs, MAX_RETRY_AFTER_MS)) : 0;
		if (health.failures >= 3 || retryAfter > 0) health.openUntil = performance.now() + Math.max(COOLDOWN_MS, retryAfter);
	}
};
//#endregion
//#region src/plugins/registry-registrars-capabilities.ts
function createCapabilityRegistrars(state) {
	const { registry, reportRegistrationError, reportRegistrationWarning } = state;
	const registerDecisionProvider = (record, provider) => {
		const id = normalizeOptionalString(provider?.id);
		if (!id || id !== provider.id || id.includes("/") || provider.contractVersion !== 1 || typeof provider.evaluate !== "function" || provider.isReady !== void 0 && typeof provider.isReady !== "function") {
			reportRegistrationError(record, "invalid version 1 decision provider contract");
			return;
		}
		if (!record.contracts?.decisionProviders?.includes(id)) {
			reportRegistrationError(record, "decision provider must declare contracts.decisionProviders ownership");
			return;
		}
		if (registry.decisionProviders.some((entry) => entry.host.provider.id === id)) {
			reportRegistrationError(record, `decision provider already registered: ${id}`);
			return;
		}
		const host = new DecisionProviderHost(provider, record);
		registry.decisionProviders.push({
			pluginId: record.id,
			host
		});
		record.services.push(`decisions:${id}`);
		getPluginInstance(record)?.lifecycle.onDispose(() => host.stop());
		registry.services.push({
			pluginId: record.id,
			id: `decisions:${id}`,
			origin: record.origin,
			source: record.source,
			service: {
				id: `decisions:${id}`,
				start() {},
				stop: () => host.stop()
			}
		});
	};
	const registerDetachedTaskRuntime = (record, runtime) => {
		const existing = registry.detachedTaskRuntimes[0];
		if (existing && existing.pluginId !== record.id) {
			reportRegistrationError(record, `detached task runtime already registered by ${existing.pluginId}`);
			return;
		}
		const next = {
			pluginId: record.id,
			runtime
		};
		if (existing) registry.detachedTaskRuntimes.splice(0, 1, next);
		else registry.detachedTaskRuntimes.push(next);
	};
	const registerInteractiveHandler = (record, registration) => {
		const result = registerPluginInteractiveHandlerInRegistry(registry, record.id, registration, {
			pluginName: record.name,
			pluginRoot: record.rootDir
		});
		if (!result.ok) reportRegistrationWarning(record, result.error ?? "interactive handler registration failed");
	};
	const registerContextEngine = (record, id, factory, registrationMode) => {
		const normalizedId = normalizeOptionalString(id) ?? "";
		if (!normalizedId) {
			reportRegistrationError(record, "context engine registration missing id");
			return;
		}
		if (typeof factory !== "function") {
			reportRegistrationError(record, `context engine "${normalizedId}" registration missing factory`);
			return;
		}
		if (normalizedId === defaultSlotIdForKey("contextEngine")) {
			reportRegistrationError(record, `context engine id reserved by core: ${normalizedId}`);
			return;
		}
		const result = registerContextEngineInRegistry(registry, normalizedId, factory, `plugin:${record.id}`, {
			allowSameOwnerRefresh: true,
			lifecycle: registrationMode === "full" ? "runtime" : "readOnlyDiscovery"
		});
		if (!result.ok) {
			reportRegistrationError(record, `context engine already registered: ${normalizedId} (${result.existingOwner})`);
			return;
		}
		if (!record.contextEngineIds?.includes(normalizedId)) record.contextEngineIds = [...record.contextEngineIds ?? [], normalizedId];
	};
	const registerCompactionProvider = (record, provider) => {
		const id = normalizeOptionalString(provider?.id);
		if (!id) {
			reportRegistrationError(record, "compaction provider registration missing id");
			return;
		}
		if (typeof provider?.summarize !== "function") {
			reportRegistrationError(record, `compaction provider "${id}" registration missing summarize`);
			return;
		}
		const existing = registry.compactionProviders.find((entry) => entry.provider.id === id);
		if (existing) {
			const ownerDetail = existing.ownerPluginId ? ` (owner: ${existing.ownerPluginId})` : "";
			reportRegistrationError(record, `compaction provider already registered: ${id}${ownerDetail}`);
			return;
		}
		registry.compactionProviders.push({
			provider,
			ownerPluginId: record.id
		});
	};
	return {
		registerDecisionProvider,
		registerDetachedTaskRuntime,
		registerInteractiveHandler,
		registerContextEngine,
		registerCompactionProvider
	};
}
//#endregion
//#region src/plugins/registry-control-ui-policy.ts
const reservedTabSlugs = /* @__PURE__ */ new Set([
	"api",
	"plugins",
	"plugin",
	"focus",
	"approve",
	"ask",
	"share",
	"j",
	"v1",
	"ui",
	"mcp-app-sandbox",
	"__openclaw__",
	"__openclaw",
	"sessions",
	"agent",
	"agents"
]);
function isReservedControlUiTabSlug(slug) {
	return reservedTabSlugs.has(slug) || classifyGatewayProbePath(`/${slug}`) !== "outside";
}
function validateControlUiNativeRoutePlacement(params) {
	if (!params.placement?.startsWith("route:")) return true;
	if (params.record.origin === "bundled" && params.placement === `route:${params.record.id}`) return true;
	params.pushDiagnostic({
		level: "error",
		pluginId: params.record.id,
		source: params.record.source,
		message: `native Control UI route placement must be owned by its bundled plugin: ${params.placement}`
	});
	return false;
}
//#endregion
//#region src/plugins/registry-control-ui.ts
/** Copy bounded plugin metadata before it becomes a browser routing contract. */
function normalizeLinkReaderMetadata(value) {
	if (!isRecord(value) || !Array.isArray(value.hosts) || value.hosts.length === 0 || value.hosts.length > 16) return;
	const hostPattern = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/u;
	if (!value.hosts.every((host) => typeof host === "string" && host.length <= 253 && hostPattern.test(host))) return;
	const pathPattern = value.pathPattern;
	if (typeof pathPattern !== "string" || pathPattern.length > 1024 || !pathPattern.startsWith("^") || !pathPattern.endsWith("$")) return;
	try {
		RegExp(pathPattern, "u");
	} catch {
		return;
	}
	const methodPattern = /^[a-zA-Z][a-zA-Z0-9_.-]{0,127}$/u;
	const detailMethod = value.detailMethod;
	const previewMethod = value.previewMethod;
	const imageMethod = value.imageMethod;
	if (typeof detailMethod !== "string" || !methodPattern.test(detailMethod) || previewMethod !== void 0 && (typeof previewMethod !== "string" || !methodPattern.test(previewMethod)) || imageMethod !== void 0 && (typeof imageMethod !== "string" || !methodPattern.test(imageMethod))) return;
	return {
		hosts: [...new Set(value.hosts)],
		pathPattern,
		detailMethod,
		...previewMethod !== void 0 ? { previewMethod } : {},
		...imageMethod !== void 0 ? { imageMethod } : {}
	};
}
const controlUiSurfaces = /* @__PURE__ */ new Set([
	"session",
	"tool",
	"run",
	"settings",
	"tab",
	"widget",
	"link-reader"
]);
function createControlUiRegistrar(state) {
	const { registry, createRegistration, pushDiagnostic, reportRegistrationError } = state;
	const registerControlUiDescriptor = (record, descriptor) => {
		const legacyDescriptor = descriptor;
		const id = normalizeHostHookString(descriptor.id);
		const label = normalizeHostHookString(descriptor.label ?? legacyDescriptor.name);
		const description = normalizeOptionalHostHookString(descriptor.description);
		const placement = normalizeOptionalHostHookString(descriptor.placement);
		const slug = descriptor.slug;
		const requiredScopes = normalizeHostHookStringList(descriptor.requiredScopes);
		const surface = typeof descriptor.surface === "string" ? descriptor.surface : "session";
		if (!id || !label || !controlUiSurfaces.has(surface) || description === "" || placement === "" || requiredScopes === null) {
			reportRegistrationError(record, "control UI descriptor registration requires id, surface, label, and valid optional fields");
			return;
		}
		if (requiredScopes !== void 0) {
			const unknownScope = requiredScopes.find((scope) => !isOperatorScope(scope));
			if (unknownScope !== void 0) {
				reportRegistrationError(record, `control UI descriptor requiredScopes contains unknown operator scope: ${unknownScope}`);
				return;
			}
		}
		if (!validateControlUiNativeRoutePlacement({
			record,
			placement,
			pushDiagnostic
		})) return;
		if (slug !== void 0) {
			if (typeof slug !== "string" || slug.trim() !== slug || slug.length > 64 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || surface !== "tab" || placement?.startsWith("route:") || isReservedControlUiTabSlug(slug)) {
				reportRegistrationError(record, `control UI descriptor slug requires an unreserved lowercase alphanumeric/hyphen segment of at most 64 characters on a tab without native route placement: ${id}`);
				return;
			}
			const owner = registry.controlUiDescriptors.find((entry) => entry.descriptor.slug === slug);
			if (owner) {
				reportRegistrationError(record, `control UI tab slug already registered by ${owner.pluginId}: ${slug}`);
				return;
			}
		}
		if (descriptor.schema !== void 0 && !isPluginJsonValue(descriptor.schema)) {
			reportRegistrationError(record, `control UI descriptor schema must be JSON-compatible: ${id}`);
			return;
		}
		if (registry.controlUiDescriptors.find((entry) => entry.pluginId === record.id && entry.descriptor.id === id)) {
			reportRegistrationError(record, `control UI descriptor already registered: ${id}`);
			return;
		}
		const linkReader = surface === "link-reader" ? normalizeLinkReaderMetadata(descriptor.linkReader) : void 0;
		if (surface === "link-reader" && !linkReader || surface !== "link-reader" && descriptor.linkReader !== void 0) {
			reportRegistrationError(record, "link-reader descriptors require bounded exact hosts, an anchored pathPattern, and method names");
			return;
		}
		const icon = normalizeOptionalHostHookString(descriptor.icon);
		const tabPath = normalizeOptionalHostHookString(descriptor.path);
		if (!(tabPath === void 0 || tabPath.startsWith("/") && !tabPath.startsWith("//") && !tabPath.startsWith("/\\"))) {
			reportRegistrationError(record, `control UI descriptor path must be a gateway-local absolute path: ${id}`);
			return;
		}
		const group = descriptor.group === "control" || descriptor.group === "agent" ? descriptor.group : void 0;
		const order = typeof descriptor.order === "number" && Number.isFinite(descriptor.order) ? descriptor.order : void 0;
		registry.controlUiDescriptors.push(createRegistration(record, { descriptor: {
			...descriptor,
			id,
			surface,
			...linkReader ? { linkReader } : {},
			label,
			...description !== void 0 ? { description } : {},
			...placement !== void 0 ? { placement } : {},
			...requiredScopes !== void 0 ? { requiredScopes: requiredScopes.filter(isOperatorScope) } : {},
			icon,
			path: tabPath,
			group,
			order
		} }));
	};
	return registerControlUiDescriptor;
}
//#endregion
//#region src/plugins/tool-contracts.ts
function normalizePluginToolContractNames(contracts) {
	return normalizePluginToolNames(contracts?.tools);
}
function normalizePluginToolNames(names) {
	const normalized = /* @__PURE__ */ new Set();
	for (const name of names ?? []) {
		const trimmed = name.trim();
		if (trimmed) normalized.add(trimmed);
	}
	return [...normalized];
}
function findUndeclaredPluginToolNames(params) {
	const declared = new Set(normalizePluginToolNames(params.declaredNames));
	return normalizePluginToolNames(params.toolNames).filter((name) => !declared.has(name));
}
//#endregion
//#region src/plugins/registry-registrars-host.ts
function createHostRegistrars(state) {
	const { registry, createRegistration, reportRegistrationError } = state;
	const validateSessionActionSchema = (record, id, schema) => {
		if (schema === void 0) return true;
		if (!isPluginJsonValue(schema)) {
			reportRegistrationError(record, `session action schema must be JSON-compatible: ${id}`);
			return false;
		}
		if (typeof schema !== "boolean" && (!schema || typeof schema !== "object" || Array.isArray(schema))) {
			reportRegistrationError(record, `session action schema must be a JSON schema object or boolean: ${id}`);
			return false;
		}
		try {
			validateJsonSchemaValue({
				schema,
				cacheKey: `plugin-session-action-registration:${record.id}:${id}`,
				value: void 0
			});
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			reportRegistrationError(record, `session action schema is not valid JSON Schema: ${id}: ${message}`);
			return false;
		}
		return true;
	};
	const registerSessionExtension = (record, extension) => {
		const namespace = normalizeHostHookString(extension.namespace);
		const description = normalizeHostHookString(extension.description);
		const project = extension.project;
		let normalizedSessionEntrySlotKey;
		let invalidMessage;
		if (!namespace || !description) invalidMessage = "session extension registration requires namespace and description";
		else if (project !== void 0 && typeof project !== "function") invalidMessage = "session extension projector must be a function";
		else if (project?.constructor?.name === "AsyncFunction") invalidMessage = "session extension projector must be synchronous";
		else if (extension.cleanup !== void 0 && typeof extension.cleanup !== "function") invalidMessage = "session extension cleanup must be a function";
		else if (extension.sessionEntrySlotKey !== void 0) {
			const slotKey = normalizeSessionEntrySlotKey(extension.sessionEntrySlotKey);
			if (!slotKey.ok) invalidMessage = slotKey.error;
			else normalizedSessionEntrySlotKey = slotKey.key;
		}
		if (invalidMessage) {
			reportRegistrationError(record, invalidMessage);
			return;
		}
		if (registry.sessionExtensions.find((entry) => entry.pluginId === record.id && entry.extension.namespace === namespace)) {
			reportRegistrationError(record, `session extension already registered: ${namespace}`);
			return;
		}
		if (normalizedSessionEntrySlotKey) {
			if (registry.sessionExtensions.find((entry) => {
				const existingSlotKey = entry.extension.sessionEntrySlotKey;
				if (existingSlotKey === void 0) return false;
				const normalizedExistingSlotKey = normalizeSessionEntrySlotKey(existingSlotKey);
				return normalizedExistingSlotKey.ok && normalizedExistingSlotKey.key === normalizedSessionEntrySlotKey;
			})) {
				reportRegistrationError(record, `sessionEntrySlotKey already registered: ${normalizedSessionEntrySlotKey}`);
				return;
			}
		}
		registry.sessionExtensions.push(createRegistration(record, { extension: {
			...extension,
			namespace,
			description,
			...normalizedSessionEntrySlotKey ? { sessionEntrySlotKey: normalizedSessionEntrySlotKey } : {}
		} }));
	};
	const registerTrustedToolPolicy = (record, policy) => {
		if (!policy || typeof policy !== "object") {
			reportRegistrationError(record, "trusted tool policy registration requires id, description, and evaluate()");
			return;
		}
		const id = normalizeHostHookString(policy.id);
		const description = normalizeHostHookString(policy.description);
		const matcher = normalizePluginToolMatcher(policy.matcher);
		if (!id || !description || typeof policy.evaluate !== "function") {
			reportRegistrationError(record, "trusted tool policy registration requires id, description, and evaluate()");
			return;
		}
		if (record.origin !== "bundled" && !(record.contracts?.trustedToolPolicies ?? []).includes(id)) {
			reportRegistrationError(record, `plugin must declare contracts.trustedToolPolicies for: ${id}`);
			return;
		}
		if (record.origin !== "bundled" && !(record.enabled && record.explicitlyEnabled === true)) {
			reportRegistrationError(record, `plugin must be explicitly enabled to register trusted tool policy: ${id}`);
			return;
		}
		const policies = registry.trustedToolPolicies;
		const existing = policies.find((entry) => entry.pluginId === record.id && entry.policy.id === id);
		if (existing) {
			reportRegistrationError(record, `trusted tool policy already registered: ${id} (${existing.pluginId})`);
			return;
		}
		const registration = createRegistration(record, {
			policy: {
				...policy,
				id,
				description,
				...matcher ? { matcher } : {}
			},
			origin: record.origin
		});
		if (record.origin === "bundled") {
			const firstInstalledPolicyIndex = policies.findIndex((entry) => entry.origin !== "bundled");
			if (firstInstalledPolicyIndex === -1) policies.push(registration);
			else policies.splice(firstInstalledPolicyIndex, 0, registration);
			return;
		}
		policies.push(registration);
	};
	const registerToolMetadata = (record, metadata) => {
		const toolName = normalizeHostHookString(metadata.toolName);
		if (!toolName) {
			reportRegistrationError(record, "tool metadata registration missing toolName");
			return;
		}
		const undeclared = findUndeclaredPluginToolNames({
			declaredNames: normalizePluginToolContractNames(record.contracts),
			toolNames: [toolName]
		});
		if (undeclared.length > 0) {
			reportRegistrationError(record, `plugin must declare contracts.tools for tool metadata: ${undeclared.join(", ")}`);
			return;
		}
		const existing = registry.toolMetadata.find((entry) => entry.pluginId === record.id && entry.metadata.toolName === toolName);
		if (existing) {
			reportRegistrationError(record, `tool metadata already registered: ${toolName} (${existing.pluginId})`);
			return;
		}
		const displayName = normalizeOptionalHostHookString(metadata.displayName);
		const description = normalizeOptionalHostHookString(metadata.description);
		const tags = normalizeHostHookStringList(metadata.tags);
		if (displayName === "" || description === "" || tags === null || metadata.risk !== void 0 && ![
			"low",
			"medium",
			"high"
		].includes(metadata.risk)) {
			reportRegistrationError(record, `tool metadata registration has invalid metadata: ${toolName}`);
			return;
		}
		registry.toolMetadata.push(createRegistration(record, { metadata: {
			...metadata,
			toolName,
			...displayName !== void 0 ? { displayName } : {},
			...description !== void 0 ? { description } : {},
			...tags !== void 0 ? { tags } : {}
		} }));
	};
	const registerControlUiDescriptor = createControlUiRegistrar(state);
	const registerRuntimeLifecycle = (record, lifecycle) => {
		const id = normalizePluginHostHookId(lifecycle.id);
		if (!id) {
			reportRegistrationError(record, "runtime lifecycle registration missing id");
			return;
		}
		if (registry.runtimeLifecycles.find((entry) => entry.pluginId === record.id && entry.lifecycle.id === id)) {
			reportRegistrationError(record, `runtime lifecycle already registered: ${id}`);
			return;
		}
		if (lifecycle.cleanup !== void 0 && typeof lifecycle.cleanup !== "function") {
			reportRegistrationError(record, `runtime lifecycle cleanup must be a function: ${id}`);
			return;
		}
		const inspection = getPluginRegistryInspectionResources(registry);
		const dispose = inspection ? lifecycle.dispose : void 0;
		if (dispose !== void 0 && typeof dispose !== "function") {
			reportRegistrationError(record, `runtime lifecycle dispose must be a function: ${id}`);
			return;
		}
		if (inspection && dispose) {
			const instance = getPluginInstance(record);
			inspection.register(record.id, {
				id,
				dispose: () => instance ? instance.runCleanup(() => dispose.call(lifecycle)) : dispose.call(lifecycle)
			});
		}
		registry.runtimeLifecycles.push(createRegistration(record, { lifecycle: {
			...lifecycle,
			id
		} }));
	};
	const registerAgentEventSubscription = (record, subscription) => {
		const id = normalizePluginHostHookId(subscription.id);
		if (!id || typeof subscription.handle !== "function") {
			reportRegistrationError(record, "agent event subscription registration requires id and handle");
			return;
		}
		const streams = normalizeHostHookStringList(subscription.streams);
		if (streams === null) {
			reportRegistrationError(record, `agent event subscription streams must be an array of strings: ${id}`);
			return;
		}
		if (registry.agentEventSubscriptions.find((entry) => entry.pluginId === record.id && entry.subscription.id === id)) {
			reportRegistrationError(record, `agent event subscription already registered: ${id}`);
			return;
		}
		registry.agentEventSubscriptions.push(createRegistration(record, { subscription: {
			...subscription,
			id,
			...streams !== void 0 ? { streams } : {}
		} }));
	};
	const registerSessionSchedulerJob = (record, job) => {
		const owner = getPluginRecordRegistry(registry, record);
		const active = isPluginRecordActive(registry, record);
		if (!active && isPluginRegistryRetired(registry)) return;
		const jobId = normalizeHostHookString(job.id);
		const sessionKey = normalizeHostHookString(job.sessionKey);
		const kind = normalizeHostHookString(job.kind);
		if (jobId && owner.sessionSchedulerJobs.some((entry) => entry.pluginId === record.id && entry.job.id === jobId)) {
			reportRegistrationError(record, `session scheduler job already registered: ${jobId}`);
			return;
		}
		if (!jobId || !sessionKey || !kind) {
			reportRegistrationError(record, "session scheduler job registration requires unique id, sessionKey, and kind");
			return;
		}
		if (job.cleanup !== void 0 && typeof job.cleanup !== "function") {
			reportRegistrationError(record, `session scheduler job cleanup must be a function: ${jobId}`);
			return;
		}
		owner.sessionSchedulerJobs.push(createRegistration(record, { job: {
			...job,
			id: jobId,
			sessionKey,
			kind
		} }));
		if (active) publishPluginSessionSchedulerJobs(owner);
		return {
			id: jobId,
			pluginId: record.id,
			sessionKey,
			kind
		};
	};
	const registerSessionAction = (record, action) => {
		const id = normalizeHostHookString(action.id);
		const description = normalizeOptionalHostHookString(action.description);
		const requiredScopes = normalizeHostHookStringList(action.requiredScopes);
		if (!id || description === "" || requiredScopes === null || typeof action.handler !== "function") {
			reportRegistrationError(record, "session action registration requires id, handler, and valid optional fields");
			return;
		}
		if (requiredScopes !== void 0) {
			const unknownScope = requiredScopes.find((scope) => !isOperatorScope(scope));
			if (unknownScope !== void 0) {
				reportRegistrationError(record, `session action requiredScopes contains unknown operator scope: ${unknownScope}`);
				return;
			}
		}
		if (!validateSessionActionSchema(record, id, action.schema)) return;
		if (registry.sessionActions.find((entry) => entry.pluginId === record.id && entry.action.id === id)) {
			reportRegistrationError(record, `session action already registered: ${id}`);
			return;
		}
		registry.sessionActions.push(createRegistration(record, { action: {
			...action,
			id,
			...description !== void 0 ? { description } : {},
			...requiredScopes !== void 0 ? { requiredScopes } : {}
		} }));
	};
	const registerConversationBindingResolvedHandler = (record, handler) => {
		registry.conversationBindingResolvedHandlers.push(createRegistration(record, {
			pluginRoot: record.rootDir,
			handler
		}));
	};
	return {
		registerSessionExtension,
		registerTrustedToolPolicy,
		registerToolMetadata,
		registerControlUiDescriptor,
		registerBoardWidgetContentKind: createPluginBoardWidgetContentKindRegistrar(registry),
		registerRuntimeLifecycle,
		registerAgentEventSubscription,
		registerSessionSchedulerJob,
		registerSessionAction,
		registerConversationBindingResolvedHandler
	};
}
//#endregion
//#region src/plugins/registry-registrars-memory.ts
function createMemoryRegistrars(state) {
	const { registry, reportRegistrationError, reportRegistrationWarning } = state;
	const requireMemorySlot = (record, surface) => {
		if (!hasKind(record.kind, "memory")) throw new Error(`only memory plugins can register a memory ${surface}`);
		if (Array.isArray(record.kind) && record.kind.length > 1 && !record.memorySlotSelected) {
			reportRegistrationWarning(record, `dual-kind plugin not selected for memory slot; skipping memory ${surface} registration`);
			return false;
		}
		return true;
	};
	const registerMemoryCapability = (record, capability) => {
		if (!requireMemorySlot(record, "capability")) return;
		const memorySlotSelected = record.memorySlotSelected === true;
		if (!memorySlotSelected && (capability.runtime !== void 0 || capability.deterministicRecallToolName !== void 0 || capability.supportsPrivateTranscriptRecall !== void 0)) reportRegistrationWarning(record, "memory plugin not selected for the memory slot; skipping its indexing runtime and recall registration (consolidation lifecycle preserved)");
		const { runtime: _droppedRuntime, deterministicRecallToolName: _droppedRecallToolName, supportsPrivateTranscriptRecall: _droppedPrivateRecall, ...consolidationCapability } = capability;
		registry.memoryCapabilities.push({
			pluginId: record.id,
			capability: memorySlotSelected ? capability : consolidationCapability,
			memorySlotSelected
		});
	};
	const registerMemoryPromptSupplement = (record, builder) => {
		if (typeof builder !== "function") {
			reportRegistrationError(record, "memory prompt supplement registration missing builder");
			return;
		}
		registry.memoryPromptSupplements = registry.memoryPromptSupplements.filter((entry) => entry.pluginId !== record.id);
		registry.memoryPromptSupplements.push({
			pluginId: record.id,
			builder
		});
	};
	const registerMemoryPromptPreparation = (record, prepare) => {
		if (typeof prepare !== "function") {
			reportRegistrationError(record, "memory prompt preparation registration missing prepare function");
			return;
		}
		registry.memoryPromptPreparations = registry.memoryPromptPreparations.filter((entry) => entry.pluginId !== record.id);
		registry.memoryPromptPreparations.push({
			pluginId: record.id,
			prepare
		});
	};
	const registerMemoryCorpusSupplement = (record, supplement) => {
		registry.memoryCorpusSupplements = registry.memoryCorpusSupplements.filter((entry) => entry.pluginId !== record.id);
		registry.memoryCorpusSupplements.push({
			pluginId: record.id,
			supplement
		});
	};
	return {
		registerMemoryCapability,
		registerMemoryPromptSupplement,
		registerMemoryPromptPreparation,
		registerMemoryCorpusSupplement
	};
}
//#endregion
//#region src/plugins/channel-validation.ts
function resolveKnownChannelMeta(id) {
	return listChatChannels().find((meta) => meta?.id === id) ?? resolveGeneratedBundledChannelMeta(id) ?? resolveOfficialExternalChannelMeta(id);
}
function resolveOfficialExternalChannelMeta(id) {
	const normalizedId = id.toLowerCase();
	const channel = listOfficialExternalChannelCatalogEntries().map((entry) => getOfficialExternalPluginCatalogManifest(entry)?.channel).find((candidate) => candidate?.id?.trim().toLowerCase() === normalizedId);
	return channel?.aliases?.length ? { aliases: channel.aliases } : void 0;
}
function resolveGeneratedBundledChannelMeta(id) {
	const channel = GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA.find((entry) => entry.channelId === id && entry.configurable !== false);
	const label = normalizeOptionalString(channel?.label);
	if (!channel || !label) return;
	return {
		id,
		label,
		selectionLabel: label,
		docsPath: `/channels/${id}`,
		blurb: normalizeOptionalString(channel.description) ?? ""
	};
}
function collectMissingChannelMetaFields(meta) {
	const missing = [];
	if (!normalizeOptionalString(meta?.label)) missing.push("label");
	if (!normalizeOptionalString(meta?.selectionLabel)) missing.push("selectionLabel");
	if (!normalizeOptionalString(meta?.docsPath)) missing.push("docsPath");
	if (typeof meta?.blurb !== "string") missing.push("blurb");
	return missing;
}
const CHANNEL_CAPABILITY_CHAT_TYPES = /* @__PURE__ */ new Set([
	"direct",
	"group",
	"channel",
	"thread"
]);
/** Validates and normalizes a channel plugin registration before runtime catalog insertion. */
function normalizeRegisteredChannelPlugin(params) {
	const id = normalizeOptionalString(params.plugin?.id) ?? normalizeStringifiedOptionalString(params.plugin?.id) ?? "";
	if (!id) {
		params.pushDiagnostic({
			level: "error",
			pluginId: params.pluginId,
			source: params.source,
			message: "channel registration missing id"
		});
		return null;
	}
	const chatTypes = params.plugin.capabilities?.chatTypes;
	if (!Array.isArray(chatTypes) || chatTypes.length === 0 || chatTypes.some((chatType) => !CHANNEL_CAPABILITY_CHAT_TYPES.has(chatType))) {
		params.pushDiagnostic({
			level: "error",
			pluginId: params.pluginId,
			source: params.source,
			message: `channel "${id}" registration missing or invalid required capabilities.chatTypes`
		});
		return null;
	}
	if (typeof params.plugin.config?.listAccountIds !== "function" || typeof params.plugin.config?.resolveAccount !== "function") {
		params.pushDiagnostic({
			level: "error",
			pluginId: params.pluginId,
			source: params.source,
			message: `channel "${id}" registration missing required config helpers`
		});
		return null;
	}
	const rawMeta = params.plugin.meta;
	const rawMetaId = normalizeOptionalString(rawMeta?.id);
	if (rawMetaId && rawMetaId !== id) params.pushDiagnostic({
		level: "warn",
		pluginId: params.pluginId,
		source: params.source,
		message: `channel "${id}" meta.id mismatch ("${rawMetaId}"); using registered channel id`
	});
	const missingFields = collectMissingChannelMetaFields(rawMeta);
	if (missingFields.length > 0) params.pushDiagnostic({
		level: "warn",
		pluginId: params.pluginId,
		source: params.source,
		message: `channel "${id}" registered incomplete metadata; filled missing ${missingFields.join(", ")}`
	});
	return {
		...params.plugin,
		id,
		meta: normalizeChannelMeta({
			id,
			meta: rawMeta,
			existing: resolveKnownChannelMeta(id)
		})
	};
}
//#endregion
//#region src/plugins/registry-registrars-network.ts
const GATEWAY_METHOD_DISPATCH_CONTRACT = "authenticated-request";
function adaptPluginGatewayMethodHandler(handler, mayDispatch) {
	return async (opts) => {
		let responded = false;
		const respond = (ok, payload, error, meta) => {
			responded = true;
			opts.respond(ok, payload, error, meta);
		};
		const scope = getPluginRuntimeGatewayRequestScope();
		const invoke = () => handler({
			...opts,
			respond
		});
		const result = scope ? await withPluginRuntimeGatewayRequestScope({
			...scope,
			gatewayMethodDispatchAllowed: mayDispatch && scope.client != null
		}, invoke) : await invoke();
		if (!responded && result !== void 0) respond(true, result);
	};
}
function createNetworkRegistrars(state) {
	const { registry, createRegistration, coreGatewayMethods, pluginsWithChannelRegistrationConflict, pushDiagnostic, reportRegistrationError, reportRegistrationWarning } = state;
	let reportedLegacyCatalogSkip = false;
	const registerGatewayMethod = (record, method, handler, opts) => {
		const trimmed = method.trim();
		if (!trimmed) return;
		if (coreGatewayMethods.has(trimmed) || registry.gatewayHandlers[trimmed]) {
			reportRegistrationError(record, `gateway method already registered: ${trimmed}`);
			return;
		}
		const wrappedHandler = adaptPluginGatewayMethodHandler(handler, canDispatchGatewayMethods(record));
		registry.gatewayHandlers[trimmed] = wrappedHandler;
		const normalizedScope = normalizePluginGatewayMethodScope(trimmed, opts?.scope);
		if (normalizedScope.coercedToReservedAdmin) reportRegistrationWarning(record, `gateway method scope coerced to operator.admin for reserved core namespace: ${trimmed}`);
		registry.gatewayMethodDescriptors.push(createPluginGatewayMethodDescriptor({
			pluginId: record.id,
			name: trimmed,
			handler: wrappedHandler,
			scope: normalizedScope.scope,
			...opts?.profileAccess ? { profileAccess: opts.profileAccess } : {}
		}));
	};
	const registerSessionCatalog = (record, provider) => {
		const id = provider.id.trim();
		const label = provider.label.trim();
		if (!id || !label) {
			reportRegistrationError(record, "session catalog requires non-empty id and label");
			return;
		}
		if (!state.allowProcessHomeSessionCatalogs && provider.supportsProcessHomeIsolation !== true) {
			if (!reportedLegacyCatalogSkip) {
				reportedLegacyCatalogSkip = true;
				reportRegistrationWarning(record, "external session catalog skipped in isolated state: provider must declare supportsProcessHomeIsolation");
			}
			return;
		}
		const existing = registry.sessionCatalogs.find((entry) => entry.provider.id === id);
		if (existing) {
			reportRegistrationError(record, `session catalog already registered: ${id} (${existing.pluginId})`);
			return;
		}
		const normalizedProvider = {
			...provider,
			id,
			label
		};
		registry.sessionCatalogs.push(createRegistration(record, { provider: state.getNativeCatalogGate(record)?.catalog(normalizedProvider) ?? normalizedProvider }));
	};
	const describeHttpRouteOwner = (entry) => {
		return `${normalizeOptionalString(entry.pluginId) || "unknown-plugin"} (${normalizeOptionalString(entry.source) || "unknown-source"})`;
	};
	const canDispatchGatewayMethods = (record) => (record.contracts?.gatewayMethodDispatch ?? []).includes(GATEWAY_METHOD_DISPATCH_CONTRACT);
	const registerHttpRoute = (record, params) => {
		const normalizedPath = normalizePluginHttpPath(params.path);
		if (!normalizedPath) {
			reportRegistrationWarning(record, "http route registration missing path");
			return;
		}
		if (params.auth !== "gateway" && params.auth !== "plugin") {
			reportRegistrationError(record, `http route registration missing or invalid auth: ${normalizedPath}`);
			return;
		}
		const match = params.match ?? "exact";
		const { authOverlap, canonicalMatches } = findPluginHttpRouteRegistrationConflicts([...new Set(getPluginHttpRouteViews(registry, record.id).flatMap((view) => view.httpRoutes))], {
			path: normalizedPath,
			match,
			auth: params.auth
		});
		if (authOverlap) {
			reportRegistrationError(record, `http route overlap rejected: ${normalizedPath} (${match}, ${params.auth}) overlaps ${authOverlap.path} (${authOverlap.match}, ${authOverlap.auth}) owned by ${describeHttpRouteOwner(authOverlap)}`);
			return;
		}
		const registration = {
			pluginId: record.id,
			path: normalizedPath,
			handler: params.handler,
			...params.handleUpgrade ? { handleUpgrade: params.handleUpgrade } : {},
			auth: params.auth,
			match,
			...params.gatewayRuntimeScopeSurface ? { gatewayRuntimeScopeSurface: params.gatewayRuntimeScopeSurface } : {},
			...canDispatchGatewayMethods(record) ? { gatewayMethodDispatchAllowed: true } : {},
			...params.nodeCapability ? { nodeCapability: { ...params.nodeCapability } } : {},
			source: record.source
		};
		const foreignOwner = canonicalMatches.find((route) => route.pluginId !== record.id);
		if (foreignOwner) {
			reportRegistrationError(record, params.replaceExisting ? `http route replacement rejected: ${normalizedPath} (${match}) owned by ${describeHttpRouteOwner(foreignOwner)}` : `http route already registered: ${normalizedPath} (${match}) by ${describeHttpRouteOwner(foreignOwner)}`);
			return;
		}
		if (!canonicalMatches.length) record.httpRoutes += 1;
		replacePluginHttpRoutes(registry, registration, canonicalMatches, true);
	};
	const registerHostedMediaResolver = (record, resolver) => {
		if (typeof resolver !== "function") {
			reportRegistrationError(record, "hosted media resolver registration missing resolver");
			return;
		}
		registry.hostedMediaResolvers.push(createRegistration(record, { resolver }));
	};
	const registerMcpServerConnectionResolver = (record, resolver) => {
		const serverName = normalizeOptionalString(resolver?.serverName);
		if (!serverName || typeof resolver.resolve !== "function") {
			reportRegistrationError(record, "MCP server connection resolver registration missing serverName or resolve");
			return;
		}
		const existingIndex = registry.mcpServerConnectionResolvers.findIndex((entry) => entry.resolver.serverName === serverName);
		const registration = createRegistration(record, { resolver: {
			serverName,
			resolve: resolver.resolve
		} });
		if (existingIndex >= 0) {
			const existing = registry.mcpServerConnectionResolvers[existingIndex];
			if (existing && existing.pluginId !== record.id) {
				reportRegistrationError(record, `MCP server connection resolver for "${serverName}" rejected: already registered by plugin "${existing.pluginId}"`);
				return;
			}
			registry.mcpServerConnectionResolvers[existingIndex] = registration;
			return;
		}
		registry.mcpServerConnectionResolvers.push(registration);
	};
	const registerChannel = (record, registration, mode = "full", resolveChannelRuntime) => {
		if (record.origin === "workspace" && !record.enabled) {
			reportRegistrationWarning(record, `channel registration rejected for disabled workspace plugin: ${record.id}`);
			return;
		}
		const registrationCapabilities = resolvePluginRegistrationCapabilities(mode);
		const normalized = typeof registration.plugin === "object" ? registration : { plugin: registration };
		const plugin = normalizeRegisteredChannelPlugin({
			pluginId: record.id,
			source: record.source,
			plugin: normalized.plugin,
			pushDiagnostic
		});
		if (!plugin) return;
		const id = plugin.id;
		const existingRuntime = registrationCapabilities.runtimeChannel ? registry.channels.find((entry) => entry.plugin.id === id) : void 0;
		const existingSetup = registry.channelSetups.find((entry) => entry.plugin.id === id);
		const existing = existingRuntime ?? existingSetup;
		if (existing && existing.pluginId !== record.id) {
			reportRegistrationError(record, `${existingRuntime ? "channel" : "channel setup"} already registered: ${id} (${existing.pluginId})`);
			pluginsWithChannelRegistrationConflict.add(record.id);
			return;
		}
		const metadata = {
			plugin: wrapCurrentPluginInstance(plugin),
			pluginName: record.name,
			origin: record.origin,
			source: record.source,
			rootDir: record.rootDir
		};
		const captureReadAuthority = () => {
			const currentRegistry = getPluginRecordRegistry(registry, record);
			const entry = currentRegistry.channels.find((candidate) => candidate.plugin.id === id);
			const ownerCurrent = capturePluginLifecycleAuthority(currentRegistry, record, { scopedRuntime: true });
			const isCurrent = () => ownerCurrent?.() === true && (record.origin === "bundled" || record.trustedOfficialInstall === true) && entry !== void 0 && getPluginRecordRegistry(registry, record).channels.includes(entry) && entry.pluginId === record.id && entry.plugin === metadata.plugin && entry.captureReadAuthority === captureReadAuthority;
			return isCurrent() ? isCurrent : void 0;
		};
		if (existing) {
			if (existingRuntime) Object.assign(existingRuntime, metadata, {
				resolveChannelRuntime,
				captureReadAuthority
			});
			if (existingSetup) Object.assign(existingSetup, metadata, { enabled: record.enabled });
			return;
		}
		if (!record.channelIds.includes(id)) record.channelIds.push(id);
		registry.channelSetups.push({
			...metadata,
			pluginId: record.id,
			enabled: record.enabled
		});
		if (registrationCapabilities.runtimeChannel) registry.channels.push({
			...metadata,
			pluginId: record.id,
			resolveChannelRuntime,
			captureReadAuthority
		});
	};
	return {
		registerGatewayMethod,
		registerSessionCatalog,
		registerHttpRoute,
		registerHostedMediaResolver,
		registerMcpServerConnectionResolver,
		registerChannel
	};
}
//#endregion
//#region src/plugins/gateway-access-policy-registration.ts
const signalRelays = /* @__PURE__ */ new WeakMap();
const signalRelayCleanup = new FinalizationRegistry((release) => release());
function observeNativeAbort(source, relay, token) {
	const onAbort = () => {
		try {
			relay.deref()?.();
		} finally {
			release();
		}
	};
	function release() {
		EventTarget.prototype.removeEventListener.call(source, "abort", onAbort);
		signalRelayCleanup.unregister(token);
	}
	EventTarget.prototype.addEventListener.call(source, "abort", onAbort, { once: true });
	return release;
}
function bindAccessSignal(signal, instance) {
	if (types.isProxy(signal) || !(signal instanceof AbortSignal)) throw new TypeError("Gateway access authority requires a native AbortSignal");
	const source = AbortSignal.any([signal, instance.lifecycle.signal]);
	const controller = new AbortController();
	const relay = () => {
		let reason;
		try {
			instance.run(() => {
				reason = instance.wrap(source.reason);
			});
		} catch {
			reason = new PluginInstanceUnavailableError(instance.pluginId);
		}
		controller.abort(reason);
		signalRelays.delete(controller.signal);
	};
	if (source.aborted) {
		relay();
		return controller.signal;
	}
	const token = {};
	const release = observeNativeAbort(source, new WeakRef(relay), token);
	signalRelays.set(controller.signal, relay);
	signalRelayCleanup.register(relay, release, token);
	return controller.signal;
}
function bindAccessAuthority(authority, instance) {
	if (!authority) return;
	const grantId = authority.grantId;
	if (grantId !== void 0 && typeof grantId !== "string") throw new TypeError("Gateway access grant identity must be a string");
	return {
		grantId,
		signal: bindAccessSignal(authority.signal, instance),
		assertCurrent: () => instance.run(() => {
			authority.assertCurrent();
		})
	};
}
/** Preserve native signals while every plugin callback retains its original owner. */
function bindPluginGatewayAccessPolicy(policy, instance) {
	if (!instance) return policy;
	const bound = { authorize(context) {
		return instance.run(() => bindAccessAuthority(policy.authorize(context), instance));
	} };
	const resume = instance.run(() => policy.resume);
	if (resume) bound.resume = (context) => instance.run(() => bindAccessAuthority(resume.call(policy, context), instance));
	return bound;
}
//#endregion
//#region src/plugins/registry-registrars-operations.ts
function isOfficialCodexPluginRecord(record) {
	if (record.id !== "codex" || record.origin !== "global") return false;
	if (record.packageName === "@openclaw/codex") return true;
	return path.normalize(record.rootDir ?? record.source).split(path.sep).join("/").includes("/node_modules/@openclaw/codex");
}
function canClaimReservedCommandOwnership(record) {
	return record.origin === "bundled" || isOfficialCodexPluginRecord(record);
}
function createOperationRegistrars(state) {
	const { registry, createRegistration, createIdentityRegistration, reportRegistrationError, reportRegistrationWarning } = state;
	const registerWidgetPresenter = (record, presenter) => {
		const description = normalizeOptionalString(presenter.description);
		const currentCapabilities = presenter.target === "current_channel" ? presenter.capabilities : void 0;
		const currentChannelValid = presenter.target === "current_channel" && typeof presenter.match === "function" && currentCapabilities !== void 0 && Array.isArray(currentCapabilities.sourceKinds) && currentCapabilities.sourceKinds.length > 0 && currentCapabilities.sourceKinds.every((kind) => typeof kind === "string" && kind.trim().length > 0) && (currentCapabilities.maxSourceBytes === void 0 || Number.isInteger(currentCapabilities.maxSourceBytes) && currentCapabilities.maxSourceBytes > 0);
		if (presenter.target !== "node_panel" && !currentChannelValid || !description || description.length > 160 || typeof presenter.availability !== "function" || typeof presenter.present !== "function") {
			reportRegistrationError(record, "invalid widget presenter registration");
			return;
		}
		const existing = presenter.target === "current_channel" ? void 0 : registry.widgetPresenters.find((registration) => registration.presenter.target === presenter.target);
		if (existing) {
			reportRegistrationError(record, `widget presenter already registered for ${presenter.target} (${existing.pluginId})`);
			return;
		}
		registry.widgetPresenters.push(createRegistration(record, { presenter: {
			...presenter,
			description
		} }));
	};
	const registerCli = (record, registrar, opts) => {
		const normalizeCommandRoot = (raw, source) => {
			const normalized = normalizeCommandDescriptorName(raw);
			if (!normalized) reportRegistrationError(record, `invalid cli ${source} name: ${JSON.stringify(raw.trim())}`);
			return normalized;
		};
		const parentPath = (opts?.parentPath ?? []).map((segment) => normalizeCommandRoot(segment, "command"));
		if (parentPath.some((segment) => segment === null)) return;
		const normalizedParentPath = parentPath;
		const rootRegistration = normalizedParentPath.length === 0;
		const descriptors = (opts?.descriptors ?? []).map((descriptor) => {
			const name = normalizeCommandRoot(descriptor.name, "descriptor");
			const description = sanitizeCommandDescriptorDescription(descriptor.description);
			const machineOutput = rootRegistration ? descriptor.machineOutput : void 0;
			if (!name || !description) return null;
			const normalized = {
				name,
				description,
				hasSubcommands: descriptor.hasSubcommands
			};
			if (machineOutput) normalized.machineOutput = machineOutput;
			return normalized;
		}).filter((descriptor) => descriptor !== null);
		const commands = normalizeUniqueStringEntries([...opts?.commands ?? [], ...descriptors.map((descriptor) => descriptor.name)].map((command) => normalizeCommandRoot(command, "command")).filter((command) => command !== null));
		if (commands.length === 0) {
			reportRegistrationError(record, "cli registration missing explicit commands metadata");
			return;
		}
		const serializeCommandPath = (command) => [...normalizedParentPath, command].join(" ");
		const commandPaths = commands.map(serializeCommandPath);
		const commandPathSet = new Set(commandPaths);
		const existing = registry.cliRegistrars.find((entry) => entry.commands.map((command) => [...entry.parentPath ?? [], command].join(" ")).some((commandPath) => commandPathSet.has(commandPath)));
		if (existing) {
			const existingCommandPaths = new Set(existing.commands.map((command) => [...existing.parentPath ?? [], command].join(" ")));
			const overlap = commandPaths.find((commandPath) => existingCommandPaths.has(commandPath));
			reportRegistrationError(record, `cli command already registered: ${overlap ?? commands[0]} (${existing.pluginId})`);
			return;
		}
		record.cliCommands.push(...commandPaths);
		registry.cliRegistrars.push(createRegistration(record, {
			register: registrar,
			parentPath: normalizedParentPath,
			commands,
			descriptors
		}));
	};
	const registerReload = (record, registration) => {
		const normalized = {
			restartPrefixes: normalizeStringEntries(registration.restartPrefixes),
			hotPrefixes: normalizeStringEntries(registration.hotPrefixes),
			noopPrefixes: normalizeStringEntries(registration.noopPrefixes)
		};
		if ((normalized.restartPrefixes?.length ?? 0) === 0 && (normalized.hotPrefixes?.length ?? 0) === 0 && (normalized.noopPrefixes?.length ?? 0) === 0) {
			reportRegistrationWarning(record, "reload registration missing prefixes");
			return;
		}
		registry.reloads.push(createRegistration(record, { registration: normalized }));
	};
	const reservedNodeHostCommands = /* @__PURE__ */ new Set([
		...NODE_SYSTEM_RUN_COMMANDS,
		...NODE_EXEC_APPROVALS_COMMANDS,
		NODE_SYSTEM_NOTIFY_COMMAND,
		...NODE_WORKER_PRIVATE_COMMANDS
	]);
	const registerNodeHostCommand = (record, nodeCommand) => {
		const command = nodeCommand.command.trim();
		if (!command) {
			reportRegistrationError(record, "node host command registration missing command");
			return;
		}
		const bundledSystemNotify = record.origin === "bundled" && command === "system.notify";
		if (reservedNodeHostCommands.has(command) && !bundledSystemNotify) {
			reportRegistrationError(record, `node host command reserved by core: ${command}`);
			return;
		}
		const existing = registry.nodeHostCommands.find((entry) => entry.command.command === command);
		if (existing) {
			reportRegistrationError(record, `node host command already registered: ${command} (${existing.pluginId})`);
			return;
		}
		const normalizedCommand = {
			...nodeCommand,
			command,
			cap: normalizeOptionalString(nodeCommand.cap)
		};
		registry.nodeHostCommands.push(createRegistration(record, { command: record.nativeSessionCatalog?.nodeCommands?.includes(command) ? state.getNativeCatalogGate(record)?.node(normalizedCommand) ?? normalizedCommand : normalizedCommand }));
	};
	const registerNodeInvokePolicy = (record, policy, pluginConfig) => {
		const commands = normalizeUniqueStringEntries(Array.isArray(policy.commands) ? policy.commands : []);
		if (commands.length === 0) {
			reportRegistrationError(record, "node invoke policy registration missing commands");
			return;
		}
		const reservedCommand = commands.find(isPrivateNodeInvokeCommand);
		if (reservedCommand) {
			reportRegistrationError(record, `node invoke policy command reserved by core: ${reservedCommand}`);
			return;
		}
		if (typeof policy.handle !== "function") {
			reportRegistrationError(record, `node invoke policy registration missing handler: ${commands.join(", ")}`);
			return;
		}
		for (const command of commands) {
			const existing = registry.nodeInvokePolicies.find((entry) => entry.policy.commands.includes(command));
			if (existing) {
				reportRegistrationError(record, `node invoke policy already registered for ${command} (${existing.pluginId})`);
				return;
			}
		}
		registry.nodeInvokePolicies.push(createRegistration(record, {
			policy: {
				...policy,
				commands
			},
			pluginConfig
		}));
	};
	const registerSecurityAuditCollector = (record, collector) => {
		registry.securityAuditCollectors.push(createRegistration(record, { collector }));
	};
	const registerGatewayAccessPolicy = (record, policy) => {
		if (typeof policy.authorize !== "function") {
			reportRegistrationError(record, "Gateway access policy requires an authorize handler");
			return;
		}
		registry.gatewayAccessPolicies.push(createIdentityRegistration(record, { policy: bindPluginGatewayAccessPolicy(policy, getPluginInstance(record)) }));
	};
	const resolveServiceRegistrationId = (record, service, kind) => {
		try {
			const id = service.id.trim();
			const registrations = kind === "service" ? registry.services : registry.gatewayDiscoveryServices;
			const existing = id ? registrations.find((entry) => entry.id === id) : void 0;
			if (id && !existing) return id;
			if (existing?.pluginId !== record.id) reportRegistrationError(record, existing ? `${kind} already registered: ${id} (${existing.pluginId})` : `${kind} registration missing id`);
		} catch {
			reportRegistrationError(record, `${kind} registration id cannot be normalized`);
		}
	};
	const registerService = (record, service) => {
		const id = resolveServiceRegistrationId(record, service, "service");
		if (!id) return;
		record.services.push(id);
		registry.services.push({
			id,
			pluginId: record.id,
			pluginName: record.name,
			service,
			source: record.source,
			origin: record.origin,
			trustedOfficialInstall: record.trustedOfficialInstall,
			rootDir: record.rootDir
		});
	};
	const registerGatewayDiscoveryService = (record, service) => {
		const id = resolveServiceRegistrationId(record, service, "gateway discovery service");
		if (!id) return;
		record.gatewayDiscoveryServiceIds.push(id);
		registry.gatewayDiscoveryServices.push({
			...createRegistration(record, {
				id,
				service
			}),
			instance: getPluginInstance(record)
		});
	};
	const registerCommand = (record, command) => {
		const name = command.name.trim();
		if (!name) {
			reportRegistrationError(record, "command registration missing name");
			return;
		}
		const allowReservedCommandNames = command.ownership === "reserved";
		if (allowReservedCommandNames && !canClaimReservedCommandOwnership(record)) {
			reportRegistrationError(record, `only bundled plugins can claim reserved command ownership: ${name}`);
			return;
		}
		if (allowReservedCommandNames && !isReservedCommandName(name)) {
			reportRegistrationError(record, `reserved command ownership requires a reserved command name: ${name}`);
			return;
		}
		if (allowReservedCommandNames && record.id !== normalizeLowercaseStringOrEmpty(name)) {
			reportRegistrationError(record, `command registration failed: Reserved command ownership requires plugin id "${record.id}" to match reserved command name "${normalizeLowercaseStringOrEmpty(name)}"`);
			return;
		}
		const { ownership: _ownership, ...commandForRegistration } = command;
		const result = registerPluginCommandInRegistry(registry, record.id, allowReservedCommandNames ? commandForRegistration : command, {
			pluginName: record.name,
			pluginRoot: record.rootDir,
			allowReservedCommandNames,
			allowOwnerStatusExposure: canClaimReservedCommandOwnership(record)
		});
		if (!result.ok) {
			reportRegistrationError(record, `command registration failed: ${result.error}`);
			return;
		}
		const registered = registry.commands.at(-1);
		if (registered?.pluginId === record.id) {
			registered.source = record.source;
			if (allowReservedCommandNames) registered.command.ownership = "reserved";
		}
		record.commands.push(name);
	};
	return {
		registerWidgetPresenter,
		registerCli,
		registerReload,
		registerNodeHostCommand,
		registerNodeInvokePolicy,
		registerGatewayAccessPolicy,
		registerSecurityAuditCollector,
		registerService,
		registerGatewayDiscoveryService,
		registerCommand
	};
}
//#endregion
//#region src/plugins/provider-validation.ts
/** Validates and normalizes provider plugin definitions before registry registration. */
function normalizeTextList(values) {
	const normalized = normalizeUniqueTrimmedStringList(values);
	return normalized.length > 0 ? normalized : void 0;
}
function normalizeOnboardingScopes(values) {
	const normalized = Array.from(new Set((values ?? []).filter((value) => value === "text-inference" || value === "image-generation" || value === "music-generation")));
	return normalized.length > 0 ? normalized : void 0;
}
function normalizeProviderOAuthProfileIdRepairs(values) {
	if (!Array.isArray(values)) return;
	const normalized = values.map((value) => {
		const legacyProfileId = normalizeOptionalString(value?.legacyProfileId);
		const promptLabel = normalizeOptionalString(value?.promptLabel);
		if (!legacyProfileId && !promptLabel) return null;
		return {
			...legacyProfileId ? { legacyProfileId } : {},
			...promptLabel ? { promptLabel } : {}
		};
	}).filter((value) => value !== null);
	return normalized.length > 0 ? normalized : void 0;
}
function resolveWizardMethodId(params) {
	if (!params.methodId) return;
	if (params.auth.some((method) => method.id === params.methodId)) return params.methodId;
	params.pushDiagnostic({
		level: "warn",
		pluginId: params.pluginId,
		source: params.source,
		message: `provider "${params.providerId}" ${params.metadataKind} method "${params.methodId}" not found; falling back to available methods`
	});
}
function buildNormalizedModelAllowlist(modelAllowlist) {
	if (!modelAllowlist) return;
	const allowedKeys = normalizeTextList(modelAllowlist.allowedKeys);
	const initialSelections = normalizeTextList(modelAllowlist.initialSelections);
	const loadCatalog = modelAllowlist.loadCatalog === true;
	const message = normalizeOptionalString(modelAllowlist.message);
	if (!allowedKeys && !initialSelections && !loadCatalog && !message) return;
	return {
		...allowedKeys ? { allowedKeys } : {},
		...initialSelections ? { initialSelections } : {},
		...loadCatalog ? { loadCatalog } : {},
		...message ? { message } : {}
	};
}
function buildNormalizedWizardSetup(params) {
	const choiceId = normalizeOptionalString(params.setup.choiceId);
	const choiceLabel = normalizeOptionalString(params.setup.choiceLabel);
	const choiceHint = normalizeOptionalString(params.setup.choiceHint);
	const groupId = normalizeOptionalString(params.setup.groupId);
	const groupLabel = normalizeOptionalString(params.setup.groupLabel);
	const groupHint = normalizeOptionalString(params.setup.groupHint);
	const onboardingScopes = normalizeOnboardingScopes(params.setup.onboardingScopes);
	const modelAllowlist = buildNormalizedModelAllowlist(params.setup.modelAllowlist);
	return {
		...choiceId ? { choiceId } : {},
		...params.setup.modelTarget === "utility" ? { modelTarget: "utility" } : {},
		...choiceLabel ? { choiceLabel } : {},
		...choiceHint ? { choiceHint } : {},
		...typeof params.setup.assistantPriority === "number" && Number.isFinite(params.setup.assistantPriority) ? { assistantPriority: params.setup.assistantPriority } : {},
		...params.setup.assistantVisibility === "manual-only" || params.setup.assistantVisibility === "visible" || params.setup.assistantVisibility === "detected-only" ? { assistantVisibility: params.setup.assistantVisibility } : {},
		...params.setup.onboardingFeatured === true ? { onboardingFeatured: true } : {},
		...groupId ? { groupId } : {},
		...groupLabel ? { groupLabel } : {},
		...groupHint ? { groupHint } : {},
		...params.methodId ? { methodId: params.methodId } : {},
		...onboardingScopes ? { onboardingScopes } : {},
		...modelAllowlist ? { modelAllowlist } : {}
	};
}
function buildNormalizedModelPicker(modelPicker, methodId) {
	const label = normalizeOptionalString(modelPicker.label);
	const hint = normalizeOptionalString(modelPicker.hint);
	return {
		...label ? { label } : {},
		...hint ? { hint } : {},
		...methodId ? { methodId } : {}
	};
}
function normalizeProviderWizardSetup(params) {
	const hasAuthMethods = params.auth.length > 0;
	if (!params.setup) return;
	if (!hasAuthMethods) {
		params.pushDiagnostic({
			level: "warn",
			pluginId: params.pluginId,
			source: params.source,
			message: `provider "${params.providerId}" setup metadata ignored because it has no auth methods`
		});
		return;
	}
	const methodId = resolveWizardMethodId({
		providerId: params.providerId,
		pluginId: params.pluginId,
		source: params.source,
		auth: params.auth,
		methodId: normalizeOptionalString(params.setup.methodId),
		metadataKind: "setup",
		pushDiagnostic: params.pushDiagnostic
	});
	return buildNormalizedWizardSetup({
		setup: params.setup,
		methodId
	});
}
function normalizeProviderAuthMethods(params) {
	const seenMethodIds = /* @__PURE__ */ new Set();
	const normalized = [];
	for (const method of params.auth) {
		const methodId = normalizeOptionalString(method.id);
		if (!methodId) {
			params.pushDiagnostic({
				level: "error",
				pluginId: params.pluginId,
				source: params.source,
				message: `provider "${params.providerId}" auth method missing id`
			});
			continue;
		}
		if (seenMethodIds.has(methodId)) {
			params.pushDiagnostic({
				level: "error",
				pluginId: params.pluginId,
				source: params.source,
				message: `provider "${params.providerId}" auth method duplicated id "${methodId}"`
			});
			continue;
		}
		seenMethodIds.add(methodId);
		const wizardSetup = method.wizard;
		const wizard = wizardSetup ? normalizeProviderWizardSetup({
			providerId: params.providerId,
			pluginId: params.pluginId,
			source: params.source,
			auth: [{
				...method,
				id: methodId
			}],
			setup: wizardSetup,
			pushDiagnostic: params.pushDiagnostic
		}) : void 0;
		normalized.push({
			...method,
			id: methodId,
			label: normalizeOptionalString(method.label) ?? methodId,
			...normalizeOptionalString(method.hint) ? { hint: normalizeOptionalString(method.hint) } : {},
			...wizard ? { wizard } : {}
		});
	}
	return normalized;
}
function normalizeProviderWizard(params) {
	if (!params.wizard) return;
	const hasAuthMethods = params.auth.length > 0;
	const normalizeSetup = () => {
		const setup = params.wizard?.setup;
		if (!setup) return;
		return normalizeProviderWizardSetup({
			providerId: params.providerId,
			pluginId: params.pluginId,
			source: params.source,
			auth: params.auth,
			setup,
			pushDiagnostic: params.pushDiagnostic
		});
	};
	const normalizeModelPicker = () => {
		const modelPicker = params.wizard?.modelPicker;
		if (!modelPicker) return;
		if (!hasAuthMethods) {
			params.pushDiagnostic({
				level: "warn",
				pluginId: params.pluginId,
				source: params.source,
				message: `provider "${params.providerId}" model-picker metadata ignored because it has no auth methods`
			});
			return;
		}
		return buildNormalizedModelPicker(modelPicker, resolveWizardMethodId({
			providerId: params.providerId,
			pluginId: params.pluginId,
			source: params.source,
			auth: params.auth,
			methodId: normalizeOptionalString(modelPicker.methodId),
			metadataKind: "model-picker",
			pushDiagnostic: params.pushDiagnostic
		}));
	};
	const setup = normalizeSetup();
	const modelPicker = normalizeModelPicker();
	if (!setup && !modelPicker) return;
	return {
		...setup ? { setup } : {},
		...modelPicker ? { modelPicker } : {}
	};
}
/** Normalizes provider plugin metadata and emits diagnostics for invalid public fields. */
function normalizeRegisteredProvider(params) {
	const id = normalizeOptionalString(params.provider.id);
	if (!id) {
		params.pushDiagnostic({
			level: "error",
			pluginId: params.pluginId,
			source: params.source,
			message: "provider registration missing id"
		});
		return null;
	}
	const auth = normalizeProviderAuthMethods({
		providerId: id,
		pluginId: params.pluginId,
		source: params.source,
		auth: params.provider.auth ?? [],
		pushDiagnostic: params.pushDiagnostic
	});
	const docsPath = normalizeOptionalString(params.provider.docsPath);
	const aliases = normalizeTextList(params.provider.aliases);
	const deprecatedProfileIds = normalizeTextList(params.provider.deprecatedProfileIds);
	const oauthProfileIdRepairs = normalizeProviderOAuthProfileIdRepairs(params.provider.oauthProfileIdRepairs);
	const envVars = normalizeTextList(params.provider.envVars);
	const wizard = normalizeProviderWizard({
		providerId: id,
		pluginId: params.pluginId,
		source: params.source,
		auth,
		wizard: params.provider.wizard,
		pushDiagnostic: params.pushDiagnostic
	});
	const catalog = params.provider.catalog;
	const { wizard: _ignoredWizard, docsPath: _ignoredDocsPath, aliases: _ignoredAliases, envVars: _ignoredEnvVars, catalog: _ignoredCatalog, ...restProvider } = params.provider;
	return {
		...restProvider,
		id,
		label: normalizeOptionalString(params.provider.label) ?? id,
		...docsPath ? { docsPath } : {},
		...aliases ? { aliases } : {},
		...deprecatedProfileIds ? { deprecatedProfileIds } : {},
		...oauthProfileIdRepairs ? { oauthProfileIdRepairs } : {},
		...envVars ? { envVars } : {},
		auth,
		...catalog ? { catalog } : {},
		...wizard ? { wizard } : {}
	};
}
//#endregion
//#region src/plugins/registry-registrars-providers.ts
function createProviderRegistrars(state) {
	const { registry, createIdentityRegistration, createRegistration, pushDiagnostic, reportRegistrationError, reportRegistrationWarning, registerModelCatalogProvider } = state;
	const registerProvider = (record, provider) => {
		const normalizedProvider = normalizeRegisteredProvider({
			pluginId: record.id,
			source: record.source,
			provider,
			pushDiagnostic
		});
		if (!normalizedProvider) return;
		const id = normalizedProvider.id;
		const existing = registry.providers.find((entry) => entry.provider.id === id);
		if (existing) {
			reportRegistrationError(record, `provider already registered: ${id} (${existing.pluginId})`);
			return;
		}
		if (!record.providerIds.includes(id)) record.providerIds.push(id);
		registry.providers.push(createRegistration(record, { provider: {
			...normalizedProvider,
			pluginRoot: record.rootDir
		} }));
		invalidateProviderRegistryIndex(registry.providers);
		if (normalizedProvider.catalog || normalizedProvider.staticCatalog) registerModelCatalogProvider(record, {
			provider: normalizedProvider.id,
			kinds: ["text"]
		});
	};
	const registerAgentHarness = (record, harness, options) => {
		const id = normalizeOptionalString(harness?.id) ?? "";
		if (!id) {
			reportRegistrationError(record, "agent harness registration missing id");
			return;
		}
		if (id === "openclaw") {
			reportRegistrationError(record, "agent harness id \"openclaw\" is reserved for the built-in runtime");
			return;
		}
		if (typeof harness.supports !== "function" || typeof harness.runAttempt !== "function") {
			reportRegistrationError(record, `agent harness "${id}" registration missing required runtime methods`);
			return;
		}
		if (options?.nativeCompaction && (!canClaimReservedCommandOwnership(record) || id !== "codex" || typeof options.nativeCompaction !== "function")) {
			reportRegistrationError(record, "native compaction requires the registry-owned \"codex\" harness");
			return;
		}
		const existing = registry.agentHarnesses.find((entry) => entry.harness.id === id);
		if (existing) {
			const ownerPluginId = "pluginId" in existing ? existing.pluginId : void 0;
			const ownerDetail = ownerPluginId ? ` (owner: ${ownerPluginId})` : "";
			reportRegistrationError(record, `agent harness already registered: ${id}${ownerDetail}`);
			return;
		}
		const normalizedHarness = {
			...harness,
			id,
			pluginId: harness.pluginId ?? record.id
		};
		record.agentHarnessIds.push(id);
		registry.agentHarnesses.push(createRegistration(record, {
			harness: normalizedHarness,
			...options?.nativeCompaction ? { nativeCompaction: options.nativeCompaction } : {}
		}));
	};
	const registerCliBackend = (record, backend) => {
		const id = backend.id.trim();
		if (!id) {
			reportRegistrationError(record, "cli backend registration missing id");
			return;
		}
		const existing = registry.cliBackends.find((entry) => entry.backend.id === id);
		if (existing) {
			reportRegistrationError(record, `cli backend already registered: ${id} (${existing.pluginId})`);
			return;
		}
		registry.cliBackends.push(createRegistration(record, {
			builtWithOpenClawVersion: record.builtWithOpenClawVersion,
			backend: {
				...backend,
				id
			}
		}));
		record.cliBackendIds.push(id);
	};
	const registerTextTransforms = (record, transforms) => {
		if ((!transforms.input || transforms.input.length === 0) && (!transforms.output || transforms.output.length === 0)) {
			reportRegistrationWarning(record, "text transform registration has no input or output replacements");
			return;
		}
		registry.textTransforms.push(createRegistration(record, { transforms }));
	};
	const registerEmbeddingProvider = (record, adapter) => {
		const id = adapter.id.trim();
		if (!id) {
			reportRegistrationError(record, "embedding provider registration missing id");
			return;
		}
		if (!(record.contracts?.embeddingProviders ?? []).includes(id)) {
			reportRegistrationError(record, `plugin must declare contracts.embeddingProviders for adapter: ${id}`);
			return;
		}
		const existing = getCoreEmbeddingProvider(id) ?? registry.embeddingProviders.find((entry) => entry.provider.id === id);
		if (existing) {
			const ownerPluginId = "ownerPluginId" in existing ? existing.ownerPluginId : "pluginId" in existing ? existing.pluginId : void 0;
			const ownerDetail = ownerPluginId ? ` (owner: ${ownerPluginId})` : "";
			reportRegistrationError(record, `embedding provider already registered: ${id}${ownerDetail}`);
			return;
		}
		registry.embeddingProviders.push(createRegistration(record, { provider: adapter }));
		if (!record.embeddingProviderIds.includes(id)) record.embeddingProviderIds.push(id);
	};
	const createProviderLikeRegistrar = (params) => (record, provider) => {
		const id = provider.id.trim();
		const { kindLabel } = params;
		if (!id) {
			reportRegistrationError(record, `${kindLabel} registration missing id`);
			return params.catalogKinds ? void 0 : false;
		}
		const existing = params.registrations.find((entry) => entry.provider.id === id);
		if (existing) {
			reportRegistrationError(record, `${kindLabel} already registered: ${id} (${existing.pluginId})`);
			return params.catalogKinds ? void 0 : false;
		}
		const ownedIds = params.ownedIds(record);
		if (!ownedIds.includes(id)) ownedIds.push(id);
		params.registrations.push(createIdentityRegistration(record, { provider }));
		if (params.catalogKinds) {
			registerModelCatalogProvider(record, {
				provider: provider.id,
				kinds: params.catalogKinds
			});
			return;
		}
		return true;
	};
	const registerWorkerProvider = (record, provider) => {
		const reject = (message) => reportRegistrationError(record, message);
		const validation = validateWorkerProviderContract(provider, record.contracts?.workerProviders ?? []);
		if (!validation.ok) {
			reject(validation.message);
			return;
		}
		const { id } = validation;
		const existing = registry.workerProviders.get(id);
		if (existing) {
			reject(`worker provider already registered: ${id} (${existing.pluginId})`);
			return;
		}
		registry.workerProviders.set(id, createRegistration(record, { provider }));
	};
	return {
		registerProvider,
		registerAgentHarness,
		registerCliBackend,
		registerTextTransforms,
		registerEmbeddingProvider,
		registerWorkerProvider,
		registerSpeechProvider: createProviderLikeRegistrar({
			kindLabel: "speech provider",
			registrations: registry.speechProviders,
			ownedIds: (record) => record.speechProviderIds,
			catalogKinds: ["voice"]
		}),
		registerRealtimeTranscriptionProvider: createProviderLikeRegistrar({
			kindLabel: "realtime transcription provider",
			registrations: registry.realtimeTranscriptionProviders,
			ownedIds: (record) => record.realtimeTranscriptionProviderIds,
			catalogKinds: ["voice"]
		}),
		registerRealtimeVoiceProvider: createProviderLikeRegistrar({
			kindLabel: "realtime voice provider",
			registrations: registry.realtimeVoiceProviders,
			ownedIds: (record) => record.realtimeVoiceProviderIds,
			catalogKinds: ["voice"]
		}),
		registerMediaUnderstandingProvider: createProviderLikeRegistrar({
			kindLabel: "media provider",
			registrations: registry.mediaUnderstandingProviders,
			ownedIds: (record) => record.mediaUnderstandingProviderIds
		}),
		registerTranscriptSourceProvider: createProviderLikeRegistrar({
			kindLabel: "transcripts source provider",
			registrations: registry.transcriptSourceProviders,
			ownedIds: (record) => record.transcriptSourceProviderIds
		}),
		registerImageGenerationProvider: createProviderLikeRegistrar({
			kindLabel: "image-generation provider",
			registrations: registry.imageGenerationProviders,
			ownedIds: (record) => record.imageGenerationProviderIds,
			catalogKinds: ["image_generation"]
		}),
		registerVideoGenerationProvider: createProviderLikeRegistrar({
			kindLabel: "video-generation provider",
			registrations: registry.videoGenerationProviders,
			ownedIds: (record) => record.videoGenerationProviderIds,
			catalogKinds: ["video_generation"]
		}),
		registerMusicGenerationProvider: createProviderLikeRegistrar({
			kindLabel: "music-generation provider",
			registrations: registry.musicGenerationProviders,
			ownedIds: (record) => record.musicGenerationProviderIds,
			catalogKinds: ["music_generation"]
		}),
		registerWebFetchProvider: createProviderLikeRegistrar({
			kindLabel: "web fetch provider",
			registrations: registry.webFetchProviders,
			ownedIds: (record) => record.webFetchProviderIds
		}),
		registerWebSearchProvider: createProviderLikeRegistrar({
			kindLabel: "web search provider",
			registrations: registry.webSearchProviders,
			ownedIds: (record) => record.webSearchProviderIds
		}),
		registerMigrationProvider: createProviderLikeRegistrar({
			kindLabel: "migration provider",
			registrations: registry.migrationProviders,
			ownedIds: (record) => record.migrationProviderIds
		})
	};
}
/** Lists active Codex app-server extension factories from the plugin registry. */
function listCodexAppServerExtensionFactories() {
	return getActivePluginRegistry()?.codexAppServerExtensionFactories?.map((entry) => entry.factory) ?? [];
}
//#endregion
//#region src/plugins/registry-registrars-tools-hooks.ts
function normalizeHookEligibility(value, isEligible) {
	if (!Array.isArray(value)) return;
	const entries = Array.from(value);
	if (entries.length === 0 || !entries.every(isEligible)) return;
	return uniqueValues(entries);
}
function canRegisterInstalledTrustedHook(record) {
	return record.origin === "bundled" || record.enabled && record.explicitlyEnabled === true;
}
function createToolHookRegistrars(state) {
	const { registry, createRegistration, registryParams, pluginsWithChannelRegistrationConflict, reportRegistrationError, reportRegistrationWarning } = state;
	const registerCodexAppServerExtensionFactory = (record, factory) => {
		if (record.origin !== "bundled") {
			reportRegistrationError(record, "only bundled plugins can register Codex app-server extension factories");
			return;
		}
		if (!(record.contracts?.embeddedExtensionFactories ?? []).includes("codex-app-server")) {
			reportRegistrationError(record, "plugin must declare contracts.embeddedExtensionFactories: [\"codex-app-server\"] to register Codex app-server extension factories");
			return;
		}
		if (typeof factory !== "function") {
			reportRegistrationError(record, "codex app-server extension factory must be a function");
			return;
		}
		if (registry.codexAppServerExtensionFactories.some((entry) => entry.pluginId === record.id && entry.rawFactory === factory)) return;
		const safeFactory = async (codex) => {
			try {
				await factory(codex);
			} catch (error) {
				const detail = error instanceof Error ? error.message : String(error);
				registryParams.logger.warn(`[plugins] codex app-server extension factory failed for ${record.id}: ${detail}`);
			}
		};
		registry.codexAppServerExtensionFactories.push({
			...createRegistration(record, { factory: safeFactory }),
			rawFactory: factory
		});
	};
	const registerAgentToolResultMiddleware = (record, handler, options, policy) => {
		if (typeof handler !== "function") {
			reportRegistrationError(record, "agent tool result middleware must be a function");
			return;
		}
		const runtimes = normalizeAgentToolResultMiddlewareRuntimes(options);
		const matcher = normalizePluginToolMatcher(options?.matcher);
		if (runtimes.length === 0) {
			reportRegistrationError(record, "agent tool result middleware must target at least one supported runtime");
			return;
		}
		const declared = normalizeAgentToolResultMiddlewareRuntimeIds(record.contracts?.agentToolResultMiddleware);
		const missing = runtimes.filter((runtime) => !declared.includes(runtime));
		if (missing.length > 0) {
			reportRegistrationError(record, `plugin must declare contracts.agentToolResultMiddleware for: ${missing.join(", ")}`);
			return;
		}
		if (!canRegisterInstalledTrustedHook(record)) {
			reportRegistrationError(record, "plugin must be explicitly enabled to register agent tool result middleware");
			return;
		}
		const existing = registry.agentToolResultMiddlewares.find((entry) => entry.pluginId === record.id && entry.rawHandler === handler);
		if (existing) {
			appendAgentToolResultMiddlewareScope(existing, {
				runtimes,
				matcher
			});
			return;
		}
		const timeoutMs = resolveTypedHookTimeoutMs({
			hookName: "after_tool_call",
			policy
		});
		const safeHandler = async (event, ctx) => {
			if (!agentToolResultMiddlewareRegistrationCoversTool(registration, ctx.runtime, event.toolName)) return;
			try {
				return await withTimeout(Promise.resolve(handler(event, ctx)), timeoutMs ?? 0, `agent tool result middleware for ${record.id}`);
			} catch (error) {
				registryParams.logger.warn(`[plugins] agent tool result middleware failed for ${record.id}`);
				throw error;
			}
		};
		const registration = {
			...createRegistration(record, {
				handler: safeHandler,
				runtimes,
				scopes: [{
					runtimes,
					...matcher ? { matcher } : {}
				}]
			}),
			rawHandler: handler
		};
		registry.agentToolResultMiddlewares.push(registration);
	};
	const registerTool = (record, tool, opts) => {
		if (pluginsWithChannelRegistrationConflict.has(record.id)) return;
		const declaredNames = normalizePluginToolContractNames(record.contracts);
		if (declaredNames.length === 0) {
			reportRegistrationError(record, "plugin must declare contracts.tools before registering agent tools");
			return;
		}
		const names = [...opts?.names ?? [], ...opts?.name ? [opts.name] : []];
		const optional = opts?.optional === true;
		const versioned = typeof tool !== "function" && "contextVersion" in tool;
		if (versioned && (tool.contextVersion !== 2 || typeof tool.create !== "function")) {
			reportRegistrationError(record, "unsupported plugin tool context version");
			return;
		}
		const factory = typeof tool === "function" ? tool : versioned ? (ctx) => {
			if (!ctx.assertInvocationCurrent) throw new Error("Version 2 tool factories require host invocation authority");
			return tool.create({
				...ctx,
				get senderIsOwner() {
					return ctx.senderIsOwner;
				},
				assertInvocationCurrent: ctx.assertInvocationCurrent
			});
		} : (_ctx) => tool;
		if (typeof tool !== "function" && !versioned) names.push(tool.name);
		const normalized = normalizePluginToolNames(names);
		const undeclared = findUndeclaredPluginToolNames({
			declaredNames,
			toolNames: normalized
		});
		if (undeclared.length > 0) {
			reportRegistrationError(record, `plugin must declare contracts.tools for: ${undeclared.join(", ")}`);
			return;
		}
		if (normalized.length > 0) record.toolNames.push(...normalized);
		registry.tools.push(createRegistration(record, {
			factory,
			...versioned ? { contextVersion: 2 } : {},
			names: normalized,
			declaredNames,
			optional,
			origin: record.origin
		}));
	};
	const registerHook = (record, events, handler, opts, config, pluginConfig) => {
		const normalizedEvents = normalizeStringEntries(Array.isArray(events) ? events : [events]);
		for (const event of normalizedEvents) if (isPluginHookName(event)) reportRegistrationWarning(record, `hook event "${event}" is dispatched by the typed hook runner only; api.registerHook registrations for it are not invoked. Use api.on("${event}", ...) instead.`);
		const entry = opts?.entry ?? null;
		const hookName = entry?.hook.name ?? opts?.name?.trim();
		if (!hookName) throw new Error("hook registration missing name");
		const existingHook = registry.hooks.find((entryLocal) => entryLocal.entry.hook.name === hookName);
		if (existingHook) {
			reportRegistrationError(record, `hook already registered: ${hookName} (${existingHook.pluginId})`);
			return;
		}
		const description = entry?.hook.description ?? opts?.description ?? "";
		const hookEntry = entry ? {
			...entry,
			hook: {
				...entry.hook,
				name: hookName,
				description,
				source: "openclaw-plugin",
				pluginId: record.id
			},
			metadata: {
				...entry.metadata,
				events: normalizedEvents
			}
		} : {
			hook: {
				name: hookName,
				description,
				source: "openclaw-plugin",
				pluginId: record.id,
				filePath: record.source,
				baseDir: path.dirname(record.source),
				handlerPath: record.source
			},
			frontmatter: {},
			metadata: { events: normalizedEvents },
			invocation: { enabled: true }
		};
		record.hookNames.push(hookName);
		registry.hooks.push({
			pluginId: record.id,
			entry: hookEntry,
			events: normalizedEvents,
			source: record.source
		});
		if (!(config?.hooks?.internal?.enabled !== false) || opts?.register === false) return;
		for (const event of normalizedEvents) {
			const wrappedHandler = async (evt) => {
				const context = evt.context;
				const hadPluginConfig = Object.hasOwn(context, "pluginConfig");
				const previousPluginConfig = context.pluginConfig;
				context.pluginConfig = pluginConfig;
				try {
					return await handler({
						...evt,
						context
					});
				} finally {
					if (hadPluginConfig) context.pluginConfig = previousPluginConfig;
					else delete context.pluginConfig;
				}
			};
			registry.legacyInternalHooks.push({
				pluginId: record.id,
				name: hookName,
				event,
				handler: wrappedHandler
			});
		}
	};
	const registerTypedHook = (record, hookName, handler, opts, policy) => {
		if (!isPluginHookName(hookName)) {
			reportRegistrationWarning(record, `unknown typed hook "${String(hookName)}" ignored`);
			return;
		}
		if (!resolvePromptInjectionAllowed(policy) && isPromptInjectionHookName(hookName)) {
			reportRegistrationWarning(record, `typed hook "${hookName}" blocked by plugins.entries.${record.id}.hooks.allowPromptInjection=false`);
			return;
		}
		if (isConversationHookName(hookName) && !resolveConversationAccessAllowed(record.origin, policy)) {
			if (record.origin !== "bundled") {
				reportRegistrationWarning(record, `typed hook "${hookName}" blocked because non-bundled plugins must set plugins.entries.${record.id}.hooks.allowConversationAccess=true`);
				return;
			}
			reportRegistrationWarning(record, `typed hook "${hookName}" blocked by plugins.entries.${record.id}.hooks.allowConversationAccess=false`);
			return;
		}
		const timeoutMs = resolveTypedHookTimeoutMs({
			hookName,
			opts,
			policy
		});
		const eligibleTriggers = hookName === "before_agent_reply" ? normalizeHookEligibility(opts?.eligibleTriggers, isPluginHookAgentTrigger) : void 0;
		const eligibleDispatchKinds = hookName === "reply_dispatch" ? normalizeHookEligibility(opts?.eligibleDispatchKinds, isPluginHookReplyDispatchKind) : void 0;
		const matcher = hookName === "before_tool_call" || hookName === "after_tool_call" ? normalizePluginToolMatcher(opts?.matcher) : void 0;
		if (opts?.matcher && hookName !== "before_tool_call" && hookName !== "after_tool_call") reportRegistrationWarning(record, `typed hook "${hookName}" ignores tool matcher`);
		record.hookCount += 1;
		registry.typedHooks.push({
			pluginId: record.id,
			...opts?.registrationId ? { registrationId: opts.registrationId } : {},
			hookName,
			handler,
			...matcher ? { matcher } : {},
			priority: opts?.priority,
			...timeoutMs !== void 0 ? { timeoutMs } : {},
			...eligibleTriggers ? { eligibleTriggers } : {},
			...eligibleDispatchKinds ? { eligibleDispatchKinds } : {},
			...hookName === "before_prompt_build" && opts?.requiresToolAuthority === true ? { requiresToolAuthority: true } : {},
			source: record.source
		});
	};
	return {
		registerCodexAppServerExtensionFactory,
		registerAgentToolResultMiddleware,
		registerTool,
		registerHook,
		registerTypedHook
	};
}
//#endregion
//#region src/plugins/registry-registrars.ts
/** Compose domain registrars over one explicit mutable registry state. */
function createPluginRegistrars(state) {
	return {
		...createCapabilityRegistrars(state),
		...createToolHookRegistrars(state),
		...createNetworkRegistrars(state),
		...createProviderRegistrars(state),
		...createOperationRegistrars(state),
		...createHostRegistrars(state),
		...createMemoryRegistrars(state),
		registerModelCatalogProvider: state.registerModelCatalogProvider
	};
}
//#endregion
//#region src/plugin-state/plugin-blob-worker-client.ts
async function execute(env, name, dispatch, prepare) {
	const databasePath = resolveOpenClawStateSqlitePath(env ?? process.env);
	const description = pluginBlobWorkerOperations[name];
	let dispatched = false;
	let preparation;
	try {
		preparation = prepare?.();
		const context = captureOpenClawStateWorkerContext({
			path: databasePath,
			env
		});
		const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-BgU7tLf5.mjs");
		return await runOpenClawStateWorkerOperation(context, async (scope) => {
			dispatched = true;
			return await (preparation ? preparation.handoff(() => dispatch(scope)) : dispatch(scope));
		}, {
			requireStateLifecycle: true,
			assertCurrent: preparation?.assertCurrent
		});
	} catch (error) {
		throw wrapPluginBlobError(error, description.operation, dispatched ? "PLUGIN_BLOB_WRITE_FAILED" : "PLUGIN_BLOB_OPEN_FAILED", dispatched ? description.message : "Failed to open plugin blob store.", env, databasePath);
	} finally {
		preparation?.release();
	}
}
function captureRegistrationInput(type, input) {
	const metadataBytes = serialize({
		type,
		input: {
			...input,
			bytes: /* @__PURE__ */ new Uint8Array()
		}
	}).byteLength;
	const preparation = reserveSqliteWorkerInputPreparation(input.bytes.byteLength + metadataBytes);
	try {
		input.bytes = Uint8Array.from(input.bytes);
		return preparation;
	} catch (error) {
		preparation.release();
		throw error;
	}
}
function registerPluginBlobInWorker(params) {
	const { env, ...input } = params;
	return execute(env, "pluginBlob.register", (scope) => scope.execute({
		type: "pluginBlob.register",
		input
	}), () => captureRegistrationInput("pluginBlob.register", input));
}
function registerPluginBlobIfAbsentInWorker(params) {
	const { env, ...input } = params;
	return execute(env, "pluginBlob.registerIfAbsent", (scope) => scope.execute({
		type: "pluginBlob.registerIfAbsent",
		input
	}), () => captureRegistrationInput("pluginBlob.registerIfAbsent", input));
}
function deletePluginBlobInWorker(params) {
	const { env, ...input } = params;
	return execute(env, "pluginBlob.delete", (scope) => scope.execute({
		type: "pluginBlob.delete",
		input
	}));
}
async function deleteExpiredPluginBlobKeyInWorker(params) {
	const { env, ...input } = params;
	return await execute(env, "pluginBlob.deleteExpiredKey", (scope) => scope.execute({
		type: "pluginBlob.deleteExpiredKey",
		input
	}));
}
async function deleteExpiredPluginBlobsInWorker(params) {
	const { env, ...input } = params;
	return await execute(env, "pluginBlob.deleteExpired", (scope) => scope.execute({
		type: "pluginBlob.deleteExpired",
		input
	}));
}
function clearPluginBlobsInWorker(params) {
	const { env, ...input } = params;
	return execute(env, "pluginBlob.clear", (scope) => scope.execute({
		type: "pluginBlob.clear",
		input
	}));
}
function readPluginBlob(command, env) {
	const databasePath = resolveOpenClawStateSqlitePath(env ?? process.env);
	const operation = command.type === "pluginBlob.lookup" ? "lookup" : "entries";
	return executeExistingOpenClawStateRead({
		path: databasePath,
		env
	}, command, { mapError: (error, phase) => wrapPluginBlobError(error, operation, phase === "before-read" ? "PLUGIN_BLOB_OPEN_FAILED" : "PLUGIN_BLOB_READ_FAILED", phase === "before-read" ? "Failed to open plugin blob store." : operation === "lookup" ? "Failed to read plugin blob entry." : "Failed to list plugin blob entries.", env, databasePath) });
}
async function lookupPluginBlobInWorker(params) {
	const { env, ...input } = params;
	const reply = await readPluginBlob({
		type: "pluginBlob.lookup",
		input
	}, env);
	if (reply === void 0) return;
	if (reply.ok && reply.type === "pluginBlob.lookup") return reply.value;
	throw new Error("Unexpected plugin blob lookup reply");
}
async function listPluginBlobsInWorker(params) {
	const { env, ...input } = params;
	const reply = await readPluginBlob({
		type: "pluginBlob.entries",
		input
	}, env);
	if (reply === void 0) return [];
	if (reply.ok && reply.type === "pluginBlob.entries") return reply.value;
	throw new Error("Unexpected plugin blob entries reply");
}
//#endregion
//#region src/plugin-state/plugin-blob-store.ts
function invalidInput(message, operation = "register") {
	return new PluginBlobStoreError(message, {
		code: "PLUGIN_BLOB_INVALID_INPUT",
		operation
	});
}
function limitError(message) {
	return new PluginBlobStoreError(message, {
		code: "PLUGIN_BLOB_LIMIT_EXCEEDED",
		operation: "register"
	});
}
const validationErrors = (operation) => ({
	invalid: (message) => invalidInput(message, operation),
	limit: (message) => limitError(message)
});
function validateNamespace(value) {
	return validatePluginStoreNamespace({
		value,
		label: "plugin blob",
		errors: validationErrors("open")
	});
}
function validateKey(value, operation) {
	return validatePluginStoreKey({
		value,
		label: "plugin blob",
		errors: validationErrors(operation)
	});
}
function validatePositiveLimit(value, label, maximum) {
	const normalized = validatePluginStorePositiveInteger({
		value,
		label,
		errors: validationErrors("open")
	});
	if (normalized > maximum) throw invalidInput(`${label} must be <= ${maximum}`, "open");
	return normalized;
}
const optionPolicy = createPluginStoreOptionPolicy({
	label: "plugin blob",
	invalid: (message) => invalidInput(message, "open")
});
function validateTtl(value, operation) {
	return validateOptionalPluginStoreTtlMs({
		value,
		label: "plugin blob ttlMs",
		errors: validationErrors(operation)
	});
}
function prepareBlob(params) {
	const key = validateKey(params.key, "register");
	if (!(params.bytes instanceof Uint8Array)) throw invalidInput("plugin blob bytes must be a Uint8Array");
	if (params.bytes.byteLength > params.maxBytesPerEntry) throw limitError(`plugin blob entry exceeds the configured ${params.maxBytesPerEntry} byte limit`);
	const metadataJson = serializePluginStoreJson({
		value: params.metadata,
		label: "plugin blob metadata",
		errors: validationErrors("register")
	});
	const ttlMs = validateTtl(params.opts?.ttlMs, "register") ?? params.defaultTtlMs;
	return {
		key,
		bytes: params.bytes,
		metadataJson,
		...ttlMs !== void 0 ? { ttlMs } : {}
	};
}
function createPluginBlobStoreInternal(pluginId, options, env) {
	if (pluginId.startsWith("core:")) throw invalidInput("Plugin ids starting with 'core:' are reserved for core consumers.", "open");
	const namespace = validateNamespace(options.namespace);
	const maxEntries = validatePositiveLimit(options.maxEntries, "plugin blob maxEntries", MAX_PLUGIN_BLOB_ENTRIES_PER_PLUGIN);
	const maxBytesPerEntry = validatePositiveLimit(options.maxBytesPerEntry, "plugin blob maxBytesPerEntry", MAX_PLUGIN_BLOB_BYTES_PER_ENTRY);
	const maxBytesPerNamespace = validatePositiveLimit(options.maxBytesPerNamespace, "plugin blob maxBytesPerNamespace", MAX_PLUGIN_BLOB_BYTES_PER_PLUGIN);
	if (maxBytesPerEntry > maxBytesPerNamespace) throw invalidInput("plugin blob maxBytesPerEntry must not exceed maxBytesPerNamespace", "open");
	const overflowPolicy = optionPolicy.resolveOverflowPolicy(options.overflowPolicy);
	const defaultTtlMs = validateTtl(options.defaultTtlMs, "open");
	optionPolicy.assertConsistent(pluginId, namespace, {
		maxEntries,
		maxBytesPerEntry,
		maxBytesPerNamespace,
		overflowPolicy,
		defaultTtlMs
	});
	const writeParams = (blob) => ({
		pluginId,
		namespace,
		key: blob.key,
		bytes: blob.bytes,
		metadataJson: blob.metadataJson,
		maxEntries,
		maxBytesPerNamespace,
		overflowPolicy,
		...blob.ttlMs !== void 0 ? { ttlMs: blob.ttlMs } : {},
		...env ? { env } : {}
	});
	return {
		async register(key, bytes, metadata, opts) {
			const blob = prepareBlob({
				key,
				bytes,
				metadata,
				maxBytesPerEntry,
				defaultTtlMs,
				opts
			});
			await registerPluginBlobInWorker(writeParams(blob));
		},
		async registerIfAbsent(key, bytes, metadata, opts) {
			const blob = prepareBlob({
				key,
				bytes,
				metadata,
				maxBytesPerEntry,
				defaultTtlMs,
				opts
			});
			return registerPluginBlobIfAbsentInWorker(writeParams(blob));
		},
		async lookup(key) {
			return lookupPluginBlobInWorker({
				pluginId,
				namespace,
				key: validateKey(key, "lookup"),
				...env ? { env } : {}
			});
		},
		async entries() {
			return listPluginBlobsInWorker({
				pluginId,
				namespace,
				...env ? { env } : {}
			});
		},
		async delete(key) {
			return deletePluginBlobInWorker({
				pluginId,
				namespace,
				key: validateKey(key, "delete"),
				...env ? { env } : {}
			});
		},
		async deleteExpiredKey(key) {
			return deleteExpiredPluginBlobKeyInWorker({
				pluginId,
				namespace,
				key: validateKey(key, "sweep"),
				...env ? { env } : {}
			});
		},
		async deleteExpired() {
			return deleteExpiredPluginBlobsInWorker({
				pluginId,
				namespace,
				...env ? { env } : {}
			});
		},
		async clear() {
			await clearPluginBlobsInWorker({
				pluginId,
				namespace,
				...env ? { env } : {}
			});
		}
	};
}
/** Opens an async blob namespace for a non-core plugin id. */
function createPluginBlobStore(pluginId, options) {
	return createPluginBlobStoreInternal(pluginId, options);
}
//#endregion
//#region src/plugins/registry-runtime.ts
function createPluginRuntimeResolver(state) {
	const { registry, registryParams } = state;
	const pluginRuntimes = /* @__PURE__ */ new WeakMap();
	const registeredChannelRuntime = /* @__PURE__ */ new WeakMap();
	const registeredRuntimeRecordById = /* @__PURE__ */ new Map();
	const registeredAdmissionOwnerByRecord = /* @__PURE__ */ new WeakMap();
	const addPluginRuntimeResolutionContext = (params) => {
		const { error, record, prop } = params;
		if (error instanceof Error && error.message.startsWith("Unable to resolve plugin runtime module") && !error.message.includes("pluginRuntimeContext=")) {
			const propName = typeof prop === "symbol" ? prop.description ?? prop.toString() : String(prop);
			error.message = [
				error.message,
				`pluginRuntimeContext=pluginId:${record.id}`,
				`property:${propName}`,
				...record.source ? [`source:${record.source}`] : []
			].join("; ");
		}
		throw error;
	};
	const resolveRecordChannelRuntime = (record) => {
		const cached = registeredChannelRuntime.get(record);
		const cachedOwner = registeredAdmissionOwnerByRecord.get(record);
		if (cached && cachedOwner?.isLive() === true) return cached;
		if (cachedOwner) {
			cachedOwner.dispose();
			registeredAdmissionOwnerByRecord.delete(record);
		}
		const channel = (() => {
			try {
				return Reflect.get(registryParams.runtime, "channel", registryParams.runtime);
			} catch (error) {
				return addPluginRuntimeResolutionContext({
					error,
					record,
					prop: "channel"
				});
			}
		})();
		if (record.origin !== "bundled" && record.trustedOfficialInstall !== true || !registry.channels.some((entry) => entry.pluginId === record.id) || !isPluginRecordActive(registry, record)) return channel;
		let closed = false;
		const ownsLiveRegistrySlot = () => !closed && registeredRuntimeRecordById.get(record.id) === record && isPluginRecordActive(registry, record);
		const previousRecord = registeredRuntimeRecordById.get(record.id);
		if (previousRecord && previousRecord !== record) {
			registeredAdmissionOwnerByRecord.get(previousRecord)?.dispose();
			registeredAdmissionOwnerByRecord.delete(previousRecord);
			revokePluginRecord(registry, previousRecord);
		}
		registeredRuntimeRecordById.set(record.id, record);
		const resolveGatewayContext = getGatewayContextResolver(registryParams.runtime.subagent);
		const scopedGatewayContext = resolveGatewayContext ? () => ownsLiveRegistrySlot() ? resolveGatewayContext() : void 0 : void 0;
		if (scopedGatewayContext && resolveGatewayContext) bindGatewayContextResolver(scopedGatewayContext, getCanonicalGatewayContextResolver(resolveGatewayContext));
		const owner = Object.freeze({
			channelId: record.id,
			resolveGatewayContext: scopedGatewayContext,
			isLive: ownsLiveRegistrySlot
		});
		registeredAdmissionOwnerByRecord.set(record, {
			isLive: owner.isLive,
			dispose: () => {
				closed = true;
			}
		});
		const buildHostContext = createHostChannelInboundEventContextBuilder(channel.inbound.buildContext, owner);
		const buildContext = ((params) => {
			return buildHostContext(params);
		});
		const inbound = {
			...channel.inbound,
			ingress: createHostChannelIngressRuntime(owner),
			buildContext
		};
		const scoped = {
			...channel,
			inbound,
			turn: inbound
		};
		registeredChannelRuntime.set(record, scoped);
		return scoped;
	};
	const resolvePluginRuntime = (record) => {
		const pluginId = record.id;
		const cached = pluginRuntimes.get(record);
		if (cached) return cached;
		const currentRegistry = () => getPluginRecordRegistry(registry, record);
		const currentDecisionRegistry = () => {
			const owner = currentRegistry();
			const invocationView = getPluginRuntimeGatewayRequestScope()?.pluginRegistry;
			return invocationView?.plugins.includes(record) && getPluginRegistryResourceOwner(invocationView) === owner ? invocationView : owner;
		};
		const resolveDelegatedRuntime = (ownerPluginId) => {
			const owner = currentRegistry().plugins.find((entry) => entry.id === ownerPluginId);
			if (!owner) throw new Error(`Plugin "${ownerPluginId}" runtime is no longer active.`);
			return resolvePluginRuntime(owner);
		};
		const assertRuntimeCurrent = () => {
			if (!capturePluginLifecycleAuthority(currentRegistry(), record, {
				scopedRuntime: registryParams.activateGlobalSideEffects === false,
				registration: true,
				admittedRuntime: true
			})?.()) throw new Error(`Plugin "${pluginId}" runtime is no longer active.`);
		};
		const loadSessionOwnership = createLazyRuntimeSurface(() => import("./registry-runtime-session-ownership-Dy6LtMuJ.mjs"), (module) => module.createPluginSessionOwnership(state, pluginId, currentRegistry));
		let scopedAgentRuntime;
		const assertTrustedPluginRuntime = (methodName) => {
			if (record.origin !== "bundled" && record.trustedOfficialInstall !== true) throw new PluginTrustRefusalError({
				methodName,
				pluginId,
				source: record.source,
				origin: record.origin,
				trust: record.trust
			});
		};
		const runtime = new Proxy(registryParams.runtime, { get(target, prop, receiver) {
			const runWithPluginScope = (run, requireActive = true) => {
				if (requireActive) assertRuntimeCurrent();
				const scopedRegistry = currentRegistry();
				return withPluginRuntimePluginScope({
					pluginId,
					pluginSource: record.source,
					pluginOrigin: record.origin,
					pluginTrustedOfficialInstall: record.trustedOfficialInstall
				}, run, scopedRegistry);
			};
			const getRuntimeProperty = () => {
				try {
					return Reflect.get(target, prop, receiver);
				} catch (error) {
					return addPluginRuntimeResolutionContext({
						error,
						record,
						prop
					});
				}
			};
			if (prop === "state") {
				const baseState = getRuntimeProperty();
				return {
					...baseState,
					openBlobStore: (options) => {
						assertTrustedPluginRuntime("openBlobStore");
						return createPluginBlobStore(pluginId, options);
					},
					openKeyedStore: (options) => {
						assertTrustedPluginRuntime("openKeyedStore");
						if (options.retention === "retained") assertRuntimeCurrent();
						return createPluginStateKeyedStore(pluginId, options, assertRuntimeCurrent);
					},
					openSyncKeyedStore: (options) => {
						assertTrustedPluginRuntime("openSyncKeyedStore");
						return createPluginStateSyncKeyedStore(pluginId, options);
					},
					openChannelIngressQueue: (options) => {
						assertTrustedPluginRuntime("openChannelIngressQueue");
						const stateDir = options?.stateDir ?? baseState.resolveStateDir();
						return createChannelIngressQueue({
							...options,
							channelId: pluginId,
							stateDir
						});
					},
					openChannelIngressDrain: (options) => {
						assertTrustedPluginRuntime("openChannelIngressDrain");
						const stateDir = options.stateDir ?? baseState.resolveStateDir();
						const queue = options.queue ?? createChannelIngressQueue({
							channelId: pluginId,
							accountId: options.accountId,
							stateDir
						});
						const { queue: _queue, accountId: _accountId, stateDir: _stateDir, ...drainOptions } = options;
						return createChannelIngressDrain({
							...drainOptions,
							queue
						});
					}
				};
			}
			if (prop === "config") {
				const config = getRuntimeProperty();
				return {
					...config,
					current: () => runWithPluginScope(() => config.current(), false),
					mutateConfigFile: (params) => runWithPluginScope(() => config.mutateConfigFile(params)),
					replaceConfigFile: (params) => runWithPluginScope(() => config.replaceConfigFile(params))
				};
			}
			if (prop === "system") {
				const system = getRuntimeProperty();
				const route = (run) => {
					assertRuntimeCurrent();
					if (isPluginRegistryPreparing(registry) && !isPluginRecordActive(registry, record)) throw new Error(`Plugin "${pluginId}" cannot route system events during replacement preparation.`);
					return runWithPluginScope(run);
				};
				return {
					...system,
					enqueueSystemEvent: (...args) => route(() => system.enqueueSystemEvent(...args)),
					requestHeartbeat: (...args) => route(() => system.requestHeartbeat(...args)),
					requestHeartbeatNow: (...args) => route(() => system.requestHeartbeatNow(...args)),
					runHeartbeatOnce: (...args) => route(() => system.runHeartbeatOnce(...args)),
					runCommandWithTimeout: (...args) => runWithPluginScope(() => system.runCommandWithTimeout(...args))
				};
			}
			if (prop === "channel") return resolveRecordChannelRuntime(record);
			if (prop === "decisions") return { evaluate: async (batch, options) => {
				assertRuntimeCurrent();
				const { evaluateDecisionInRegistry } = await import("./runtime-BRCBPcLi.mjs");
				assertRuntimeCurrent();
				const result = await evaluateDecisionInRegistry(batch, options, currentDecisionRegistry(), getRuntimeConfig(), record.id);
				assertRuntimeCurrent();
				options.signal.throwIfAborted();
				return result;
			} };
			if (prop === "llm") {
				const llm = getRuntimeProperty();
				return {
					acquireLocalService: (...args) => runWithPluginScope(() => llm.acquireLocalService(...args)),
					complete: (params) => runWithPluginScope(() => llm.complete(params))
				};
			}
			if (prop === "gateway") {
				const gateway = getRuntimeProperty();
				return {
					isAvailable: () => runWithPluginScope(() => gateway.isAvailable(), false),
					request: async (method, params, options) => {
						const { assertGatewaySessionRequestOwned } = await loadSessionOwnership();
						return await runWithPluginScope(async () => {
							assertGatewaySessionRequestOwned(method, params);
							return await gateway.request(method, params, options);
						});
					}
				};
			}
			if (prop === "hooks") {
				const hooks = getRuntimeProperty();
				return { dispatchHookAgentTurn: async (params) => {
					assertTrustedPluginRuntime("dispatchHookAgentTurn");
					return await runWithPluginScope(() => hooks.dispatchHookAgentTurn(params));
				} };
			}
			if (prop === "nodes") {
				const nodes = getRuntimeProperty();
				return {
					list: (params) => runWithPluginScope(() => nodes.list(params)),
					invoke: (params) => runWithPluginScope(() => nodes.invoke(params)),
					openDuplex: (params) => runWithPluginScope(() => nodes.openDuplex(params))
				};
			}
			if (prop === "agent") {
				if (scopedAgentRuntime) return scopedAgentRuntime;
				const agent = getRuntimeProperty();
				const session = agent.session;
				const scopedSession = {
					resolveStorePath: session.resolveStorePath,
					getSessionEntry: session.getSessionEntry,
					listSessionEntries: session.listSessionEntries,
					createSessionEntry: async (params) => {
						const { assertOwnedHarness, assertReservedSessionKeyOwned } = await loadSessionOwnership();
						return await runWithPluginScope(async () => {
							if ([
								"agentHarnessId" in params.initialEntry,
								"cliBackendId" in params.initialEntry,
								"acpSessionBinding" in params.initialEntry
							].filter(Boolean).length !== 1) throw new Error(`Plugin "${pluginId}" session creation requires exactly one runtime owner.`);
							if ("agentHarnessId" in params.initialEntry) {
								assertOwnedHarness(params.initialEntry.agentHarnessId, "create its sessions");
								assertReservedSessionKeyOwned(params.key, "create");
								return await session.createSessionEntry(params);
							}
							const initialEntry = params.initialEntry;
							if (!("acpSessionBinding" in initialEntry)) {
								const backend = currentRegistry().cliBackends.find((entry) => entry.backend.id === initialEntry.cliBackendId);
								if (!backend || backend.pluginId !== pluginId) throw new Error(`Plugin "${pluginId}" must own CLI backend "${initialEntry.cliBackendId}" to create its sessions.`);
							}
							if (!params.key.startsWith(`plugin:${pluginId}:`)) throw new Error(`Plugin "${pluginId}" session keys must start with "plugin:${pluginId}:".`);
							return await session.createSessionEntry({
								...params,
								initialEntry: {
									...initialEntry,
									pluginOwnerId: pluginId
								}
							});
						});
					},
					patchSessionEntry: async (params) => {
						const { assertStoredSessionEntryOwned, assertStoreEntryOwned } = await loadSessionOwnership();
						return await runWithPluginScope(async () => {
							assertStoredSessionEntryOwned({
								action: "patch",
								sessionKey: params.sessionKey,
								...params.agentId !== void 0 ? { agentId: params.agentId } : {},
								...params.env !== void 0 ? { env: params.env } : {},
								...params.storePath !== void 0 ? { storePath: params.storePath } : {}
							});
							return await session.patchSessionEntry({
								...params,
								update: async (entry, context) => {
									const patch = await params.update(entry, context);
									assertRuntimeCurrent();
									if (!patch) return patch;
									const next = params.replaceEntry ? patch : {
										...entry,
										...patch
									};
									assertStoreEntryOwned({
										action: "patch",
										before: context.existingEntry ?? entry,
										entry: next,
										sessionKey: params.sessionKey
									});
									return patch;
								}
							});
						});
					},
					upsertSessionEntry: async (params) => {
						const { assertStoredSessionEntryOwned, assertStoreEntryOwned } = await loadSessionOwnership();
						return await runWithPluginScope(async () => {
							const before = assertStoredSessionEntryOwned({
								action: "upsert",
								sessionKey: params.sessionKey,
								...params.agentId !== void 0 ? { agentId: params.agentId } : {},
								...params.env !== void 0 ? { env: params.env } : {},
								...params.storePath !== void 0 ? { storePath: params.storePath } : {}
							});
							assertStoreEntryOwned({
								action: "upsert",
								before,
								entry: params.entry,
								sessionKey: params.sessionKey
							});
							await session.upsertSessionEntry(params);
						});
					},
					runWithWorkAdmission: async (params, run) => {
						const { resolveStoredSessionExecutionOwner } = await loadSessionOwnership();
						return await runWithPluginScope(async () => {
							const resolveCurrentExecutionOwner = () => resolveStoredSessionExecutionOwner({
								action: "admit work on",
								sessionKey: params.sessionKey,
								storePath: params.storePath
							});
							const ownerPluginId = resolveCurrentExecutionOwner();
							return await (ownerPluginId ? resolveDelegatedRuntime(ownerPluginId).agent.session : session).runWithWorkAdmission(params, async (signal) => {
								if (resolveCurrentExecutionOwner() !== ownerPluginId) throw new Error(`Session "${params.sessionKey}" changed execution ownership while starting work.`);
								return await runWithPluginScope(() => run(signal));
							});
						});
					},
					updateSessionStoreEntry: async (params) => {
						const { assertStoredSessionEntryOwned, assertStoreEntryOwned } = await loadSessionOwnership();
						return await runWithPluginScope(async () => {
							assertStoredSessionEntryOwned({
								action: "update",
								sessionKey: params.sessionKey,
								storePath: params.storePath
							});
							return await session.updateSessionStoreEntry({
								...params,
								update: async (entry) => {
									const patch = await params.update(entry);
									assertRuntimeCurrent();
									if (!patch) return patch;
									assertStoreEntryOwned({
										action: "update",
										before: entry,
										entry: {
											...entry,
											...patch
										},
										sessionKey: params.sessionKey
									});
									return patch;
								}
							});
						});
					}
				};
				const runEmbeddedAgent = async (params) => {
					const runParams = { ...params };
					const { prepareRunSessionExecution } = await loadSessionOwnership();
					return await runWithPluginScope(async () => {
						const { ownerPluginId, agentHarnessRuntimeOverride } = prepareRunSessionExecution(runParams);
						if (agentHarnessRuntimeOverride !== void 0) runParams.agentHarnessRuntimeOverride = agentHarnessRuntimeOverride;
						if (ownerPluginId) return await resolveDelegatedRuntime(ownerPluginId).agent.runEmbeddedAgent(runParams);
						return await agent.runEmbeddedAgent(runParams);
					});
				};
				const runCommandFromIngress = async (params, commandRuntime) => {
					const { senderIsOwner: claimedOwner, messageChannel, ...remainingParams } = params;
					const senderIsOwner = claimedOwner === true;
					const ingressParams = {
						...remainingParams,
						senderIsOwner,
						messageChannel
					};
					if (senderIsOwner && record.origin !== "bundled" && record.trustedOfficialInstall !== true || currentRegistry().plugins.find((entry) => entry.id === pluginId) !== record || !isPluginRecordActive(registry, record) || !currentRegistry().channels.some((channel) => channel.pluginId === pluginId && channel.plugin.id === messageChannel)) throw new Error(`Plugin "${pluginId}" cannot admit authenticated owner authority for channel "${messageChannel ?? "unknown"}".`);
					return await runWithPluginScope(() => agent.runCommandFromIngress(ingressParams, commandRuntime));
				};
				const scopedAgent = Object.create(Object.getPrototypeOf(agent), Object.getOwnPropertyDescriptors(agent));
				Object.defineProperties(scopedAgent, {
					runCommandFromIngress: {
						configurable: true,
						enumerable: true,
						value: runCommandFromIngress
					},
					runEmbeddedAgent: {
						configurable: true,
						enumerable: true,
						value: runEmbeddedAgent
					},
					session: {
						configurable: true,
						enumerable: true,
						value: scopedSession
					}
				});
				scopedAgentRuntime = scopedAgent;
				return scopedAgentRuntime;
			}
			if (prop !== "subagent") return getRuntimeProperty();
			const subagent = getRuntimeProperty();
			return {
				complete: (params) => runWithPluginScope(() => subagent.complete(params)),
				run: async (params) => {
					const { assertSessionIdentitiesOwned } = await loadSessionOwnership();
					return await runWithPluginScope(async () => {
						assertSessionIdentitiesOwned({
							action: "run",
							sessionKeys: [params.sessionKey]
						});
						return await subagent.run(params);
					});
				},
				waitForRun: (params) => runWithPluginScope(() => subagent.waitForRun(params)),
				getSessionMessages: (params) => runWithPluginScope(() => subagent.getSessionMessages(params)),
				deleteSession: async (params) => {
					const { assertStoredSessionEntryOwned } = await loadSessionOwnership();
					return await runWithPluginScope(async () => {
						assertStoredSessionEntryOwned({
							action: "delete",
							sessionKey: params.sessionKey
						});
						await subagent.deleteSession(params);
					});
				}
			};
		} });
		pluginRuntimes.set(record, runtime);
		return runtime;
	};
	return {
		resolvePluginRuntime,
		resolveRegisteredChannelRuntime: (record) => resolveRecordChannelRuntime(record),
		revokePluginRuntimeRecord: (pluginId, record) => {
			revokePluginRecord(registry, record);
			registeredAdmissionOwnerByRecord.get(record)?.dispose();
			registeredAdmissionOwnerByRecord.delete(record);
			if (registeredRuntimeRecordById.get(pluginId) === record) registeredRuntimeRecordById.delete(pluginId);
		}
	};
}
//#endregion
//#region src/plugins/registry.ts
function clonePluginRecord(record) {
	return Object.fromEntries(Object.entries(record).map(([key, value]) => [key, Array.isArray(value) ? [...value] : value]));
}
/**
* Compose the registry state, domain registrars, scoped runtime, and plugin API.
* Domain modules own validation and mutation; this function owns lifecycle wiring only.
*/
function createPluginRegistry(registryParams) {
	const state = createPluginRegistryState(registryParams);
	const cache = getPluginCache();
	const registrars = createPluginRegistrars(state);
	const runtimeResolver = createPluginRuntimeResolver(state);
	const createPluginApi = createPluginApiFactory(state, registrars, runtimeResolver);
	const registrationRecordSnapshots = /* @__PURE__ */ new WeakMap();
	const createApi = (record, params) => {
		registrationRecordSnapshots.set(record, clonePluginRecord(record));
		const api = createPluginApi(record, params);
		return instrumentPluginInstanceApi(api, getPluginInstance(record) ?? new PluginInstance(record.id, {
			record,
			registry: state.registry
		}));
	};
	const rollbackPluginGlobalSideEffects = (pluginId, record) => {
		runtimeResolver.revokePluginRuntimeRecord(pluginId, record);
		projectPluginContributions(state.registry, record);
		const recordSnapshot = registrationRecordSnapshots.get(record);
		if (recordSnapshot) {
			Object.keys(record).forEach((key) => Reflect.deleteProperty(record, key));
			Object.assign(record, recordSnapshot);
			registrationRecordSnapshots.delete(record);
		}
		const instance = getPluginInstance(record);
		const inspection = getPluginRegistryInspectionResources(state.registry);
		const retire = instance && !instance.disposing ? () => retirePluginCacheInstance(instance, cache) : void 0;
		if (inspection) inspection.rollback(pluginId, retire, instance);
		else if (retire) retire().catch((error) => {
			state.pushDiagnostic({
				level: "warn",
				pluginId,
				source: record.source,
				message: `plugin cleanup failed after registration rollback: ${formatErrorMessage(error)}`
			});
		});
	};
	return {
		...registrars,
		registry: state.registry,
		createApi,
		rollbackPluginGlobalSideEffects,
		pushDiagnostic: state.pushDiagnostic
	};
}
//#endregion
//#region src/plugins/loader-runtime-core.ts
const registryInputs = /* @__PURE__ */ new WeakMap();
/** Captured JSON inputs ignore object key order, but preserve array order and values. */
function samePluginLoadInput(left, right) {
	return left === right || left !== void 0 && right !== void 0 && isDeepStrictEqual(JSON.parse(left), JSON.parse(right));
}
function createDeferredGatewaySubagentRuntime(runtime) {
	const subagent = {
		complete: (...args) => runtime.subagent.complete(...args),
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
function loadOpenClawPluginsCore(options, nativeBindings, overrides, inspectionResources) {
	if (getPluginCache().retirement) throw new Error("Plugin inventory has retired; begin a new plugin operation.");
	const requestedOnlyPluginIds = normalizePluginIdScope(options.onlyPluginIds);
	const requestedOnlyPluginIdSet = createPluginIdScopeSet(requestedOnlyPluginIds);
	if (requestedOnlyPluginIdSet && requestedOnlyPluginIdSet.size === 0) {
		const emptyRegistry = createEmptyPluginRegistry();
		inspectionResources?.attach(emptyRegistry);
		if (options.mode !== "cli-metadata" && options.activate !== false) {
			const runtimeSubagentMode = resolveRuntimeSubagentMode(options.runtimeOptions);
			activatePluginRegistry(emptyRegistry, `empty-plugin-scope::${runtimeSubagentMode}::${options.workspaceDir ?? ""}`, runtimeSubagentMode, options.workspaceDir);
		}
		return emptyRegistry;
	}
	const context = resolvePluginLoadCacheContext(options);
	const logger = options.logger ?? createSubsystemLogger("plugins");
	const validateOnly = options.mode === "validate";
	const onlyPluginIdSet = createPluginIdScopeSet(context.onlyPluginIds);
	const cacheEnabled = !options.previousRegistry && !options.moduleRecoveries && isPluginRegistryCacheEnabled(options);
	if (cacheEnabled) {
		const cached = context.cacheState.get(context.cacheKey);
		if (cached) {
			maybeThrowOnPluginLoadError(cached, options.throwOnLoadError);
			if (context.shouldActivate) activatePluginRegistry(cached, context.cacheKey, context.runtimeSubagentMode, options.workspaceDir);
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
		registryBuilder = createPluginRegistry({
			logger,
			runtime: options.mode === "cli-metadata" ? createUnavailableRuntime("cli-metadata") : overrides?.runtime ? overrides.runtime : createLazyPluginRuntime({
				devSourceRoot: context.devSourceRoot,
				pluginSdkResolution: options.pluginSdkResolution,
				runtimeOptions: {
					...options.runtimeOptions,
					modelAuth: options.runtimeOptions?.modelAuth ?? { ...nativeBindings.modelAuth },
					modelConfig: options.runtimeOptions?.modelConfig ?? { ...nativeBindings.modelConfig },
					subagent: options.runtimeOptions?.subagent ?? borrowedSubagent,
					nodes: options.runtimeOptions?.nodes ?? borrowedNodes
				}
			}),
			resolveCapabilityCatalogContext: createCapabilityCatalogContextResolver(options.capabilityCatalogContext ?? options.capabilityCatalog?.context ?? nativeBindings.capabilityCatalogContext),
			allowProcessHomeSessionCatalogs: options.allowProcessHomeSessionCatalogs ?? true,
			coreGatewayHandlers: options.coreGatewayHandlers,
			...options.coreGatewayMethodNames !== void 0 && { coreGatewayMethodNames: options.coreGatewayMethodNames },
			...options.hostServices !== void 0 && { hostServices: options.hostServices },
			activateGlobalSideEffects: context.runtimeSideEffects
		});
		const builder = registryBuilder;
		const { registry } = builder;
		inspectionResources?.attach(registry);
		const { manifestRegistry, orderedCandidates, manifestBySource, provenance } = resolvePluginLoadDiscovery({
			options,
			context,
			diagnostics: registry.diagnostics,
			logger,
			onlyPluginIdSet,
			emitWarning: context.shouldActivate,
			warningCacheKey: context.cacheKey
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
			installRecords: context.installRecords,
			preferBuiltPluginArtifacts: options.preferBuiltPluginArtifacts
		}, context.registrationConfigKey, loaderCacheIdentity);
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
		for (const candidate of orderedCandidates) {
			const manifest = manifestBySource.get(candidate.source);
			if (!manifest || inputs.has(manifest.id) || !matchesScopedPluginOrDreamingSidecar({
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
			const signatureInputs = [
				candidate.source,
				candidate.origin,
				[installOwner, installOwner ? context.installRecords[installOwner] : void 0],
				manifest,
				activation,
				entryPolicy,
				degradedPlugin && degradedPluginMatchesRoot(degradedPlugin, candidate.rootDir) ? degradedPlugin : void 0,
				hasKind(manifest.kind, "memory") ? memorySlot : void 0,
				manifest.id === dreamingSidecar?.engineId ? dreamingSidecar : void 0,
				context.artifactPreference,
				context.runtimeSideEffects,
				context.channelPluginLoadIntent,
				context.includeSetupOnlyChannelPlugins,
				context.forceSetupOnlyChannelPlugins,
				validateOnly,
				options.toolDiscovery === true,
				options.mode
			];
			let signature;
			try {
				signature = JSON.stringify(signatureInputs);
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
				config: preparedConfig
			});
			const previous = options.previousRegistry?.plugins.find((record) => record.id === manifest.id);
			const previousInput = options.previousRegistry && registryInputs.get(options.previousRegistry)?.get(manifest.id);
			if (signature !== void 0 && previous && previousInput && !replacedIds.has(manifest.id) && samePluginLoadInput(previousInput.signature, signature)) {
				if (previousInput.config.validation) prepareRuntimePluginConfig({
					candidate,
					manifestRecord: manifest,
					context,
					preparedConfig
				});
				if (samePluginLoadInput(previousInput.config.input, preparedConfig.input)) {
					retained.set(manifest.id, previous);
					projectPluginContributions(options.previousRegistry, previous, registry);
				}
			}
		}
		if (options.previousRegistry) registry.diagnostics.push(...options.previousRegistry.diagnostics.filter((entry) => entry.pluginId && retained.has(entry.pluginId)));
		const selectedMiddlewareOwnerManifests = /* @__PURE__ */ new Map();
		for (const candidate of orderedCandidates) {
			const record = manifestBySource.get(candidate.source);
			if (record && !selectedMiddlewareOwnerManifests.has(record.id)) selectedMiddlewareOwnerManifests.set(record.id, record);
		}
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
		for (const candidate of orderedCandidates) {
			const manifestRecord = manifestBySource.get(candidate.source);
			if (!manifestRecord) continue;
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
			installOwnerByPluginId: new Map(orderedCandidates.flatMap((candidate) => {
				const pluginId = manifestBySource.get(candidate.source)?.id;
				const installOwner = resolvePluginCandidateInstallOwner(candidate);
				return pluginId && installOwner ? [[pluginId, installOwner]] : [];
			}))
		});
		maybeThrowOnPluginLoadError(registry, options.throwOnLoadError, retained);
		if (context.shouldActivate && options.mode !== "validate") {
			const failedPlugins = registry.plugins.filter((plugin) => plugin.failedAt != null);
			if (failedPlugins.length > 0) logger.warn(`[plugins] ${failedPlugins.length} plugin(s) failed to initialize (${formatPluginFailureSummary(failedPlugins)}). Run 'openclaw plugins inspect <id> --runtime --json' for runtime diagnostics and 'openclaw plugins list' for registry state. After fixing plugin code or load paths, run 'openclaw plugins reload <id>' to retry.`);
		}
		if (context.shouldActivate) activatePluginRegistry(registry, context.cacheKey, context.runtimeSubagentMode, options.workspaceDir);
		if (cacheEnabled) {
			context.cacheState.set(context.cacheKey, registry);
			if (loaderCacheIdentity.resolvedKey !== context.cacheKey) context.cacheState.set(loaderCacheIdentity.resolvedKey, registry);
		}
		registryInputs.set(registry, inputs);
		return registry;
	} catch (error) {
		if (registryBuilder && !isPluginRegistryActivated(registryBuilder.registry)) {
			for (const plugin of registryBuilder.registry.plugins.toReversed()) if (!options.previousRegistry?.plugins.includes(plugin)) registryBuilder.rollbackPluginGlobalSideEffects(plugin.id, plugin);
		}
		throw error;
	} finally {
		context.cacheState.finishLoad(context.cacheKey);
	}
}
//#endregion
//#region src/plugins/loader-runtime-registry.ts
function createPluginRuntimeRegistryResolver(loadRegistry) {
	function resolveRuntimePluginRegistry(options) {
		const activeRegistry = resolveCompatibleRuntimePluginRegistry(options);
		if (activeRegistry) return activeRegistry;
		if (isPluginRegistryLoadInFlight(options)) return;
		return loadRegistry({
			...options,
			activate: false
		});
	}
	return resolveRuntimePluginRegistry;
}
//#endregion
//#region src/agents/auth-profiles/read-only-availability.ts
/** Pure, non-resolving credential availability checks shared by status and route selection. */
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
	const { ref } = resolveSecretInputRef({
		value,
		refValue,
		defaults: cfg.secrets?.defaults
	});
	if (ref) return resolveSecretRefReadOnlyAvailability(ref, cfg, env);
	if (!hasNonEmptyString(value)) return false;
	if (hasMalformedSecretInputSyntax(value)) return false;
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
//#region src/agents/model-auth-runtime-shared.ts
/**
* Shared provider-auth runtime types and errors. Provider calls use these
* helpers to fail with actionable auth provenance while keeping secret
* normalization local.
*/
const AWS_BEARER_ENV = "AWS_BEARER_TOKEN_BEDROCK";
const AWS_ACCESS_KEY_ENV = "AWS_ACCESS_KEY_ID";
const AWS_SECRET_KEY_ENV = "AWS_SECRET_ACCESS_KEY";
const AWS_PROFILE_ENV = "AWS_PROFILE";
function resolveDirectProviderCredentialMode(params) {
	const configuredMode = resolveMergedModelProviderEntry(params.cfg, params.provider)?.providerConfig.auth;
	return configuredMode === "oauth" || configuredMode === "token" ? configuredMode : params.inferredMode;
}
/** Base provider auth error with a stable code for retry/fallback logic. */
var ProviderAuthError = class extends Error {
	constructor(code, provider, message, options) {
		super(message);
		this.name = "ProviderAuthError";
		this.code = code;
		this.provider = provider;
		this.providerGuidance = options?.providerGuidance === true;
	}
};
/** Auth error raised when a resolved provider auth source lacks usable material. */
var MissingProviderAuthError = class extends ProviderAuthError {
	constructor(provider, auth) {
		super("missing-api-key", provider, formatMissingAuthError(auth, provider));
		this.name = "MissingProviderAuthError";
		this.mode = auth.mode;
		this.source = auth.source;
	}
};
/** Narrow unknown errors to provider auth errors, optionally by code. */
function isProviderAuthError(err, code) {
	return err instanceof ProviderAuthError && (!code || err.code === code);
}
/** Narrow unknown errors to missing-provider-auth failures. */
function isMissingProviderAuthError(err) {
	return err instanceof MissingProviderAuthError;
}
/** Return the AWS credential env var that proves SDK auth is configured. */
function resolveAwsSdkEnvVarName(env = process.env) {
	if (env[AWS_BEARER_ENV]?.trim()) return AWS_BEARER_ENV;
	if (env[AWS_ACCESS_KEY_ENV]?.trim() && env[AWS_SECRET_KEY_ENV]?.trim()) return AWS_ACCESS_KEY_ENV;
	if (env[AWS_PROFILE_ENV]?.trim()) return AWS_PROFILE_ENV;
}
/** Format the user-facing missing-auth error from auth provenance. */
function formatMissingAuthError(auth, provider) {
	return `No API key resolved for provider "${provider}" (auth mode: ${auth.mode}, checked: ${auth.source}).`;
}
/** Require a normalized API key or throw a provider-auth error. */
function requireApiKey(auth, provider) {
	const key = normalizeSecretInput(auth.apiKey);
	if (key) return key;
	throw new MissingProviderAuthError(provider, auth);
}
//#endregion
//#region src/agents/model-auth-provider-config.ts
/**
* Provider-entry configuration and stored-profile binding for model auth.
*/
const MODEL_AUTH_LOCAL_HOST_ALIASES = /* @__PURE__ */ new Set([
	"docker.orb.internal",
	"host.docker.internal",
	"host.orb.internal"
]);
function projectResolvedProfileAuth(params) {
	const credential = params.store.profiles[params.profileId];
	return {
		apiKey: (credential?.type === "api_key" ? coerceSecretRef(credential.keyRef) : credential?.type === "token" ? coerceSecretRef(credential.tokenRef) : null) && params.enabled ? mintSecretSentinel(params.apiKey, { label: `model-auth:${params.provider}` }) : params.apiKey,
		profileId: params.profileId,
		source: `profile:${params.profileId}`,
		mode: params.mode
	};
}
function resolveConfigAwareEnvApiKey(cfg, provider, workspaceDir, skipSetupProviderFallback) {
	return resolveEnvApiKey(provider, process.env, {
		config: cfg,
		workspaceDir,
		...skipSetupProviderFallback ? { skipSetupProviderFallback: true } : {}
	});
}
function resolveProviderConfig(cfg, provider) {
	return resolveMergedModelProviderEntry(cfg, provider)?.providerConfig;
}
function resolveProviderSourceConfig(cfg, provider) {
	return providerConfigMatchesRuntimeSnapshot({
		inputConfig: cfg,
		runtimeConfig: getRuntimeConfigSnapshot(),
		provider
	}) ? getRuntimeConfigSourceSnapshot() ?? cfg : cfg;
}
/** Keeps authored references distinct from opaque bytes in a matching runtime provider. */
function resolveProviderConfigSecretInput(cfg, provider, sourceConfig = resolveProviderSourceConfig(cfg, provider)) {
	const entry = resolveMergedModelProviderEntry(sourceConfig, provider);
	const path = entry ? `${appendConfigPathSegment("models.providers", entry.providerKey)}.apiKey` : "";
	const resolvedEnvRef = entry ? getResolvedConfigEnvSecretRef(sourceConfig, path) : null;
	return {
		providerConfig: resolveProviderConfig(cfg, provider),
		resolvedEnvRef,
		ref: entry ? resolvedEnvRef ?? resolveConfigSecretRef({
			config: sourceConfig,
			path,
			value: entry.providerConfig.apiKey,
			defaults: sourceConfig?.secrets?.defaults
		}) : null
	};
}
/** Reads a literal or env-secret marker for a custom provider entry. */
function getCustomProviderApiKey(cfg, provider) {
	const { providerConfig, ref } = resolveProviderConfigSecretInput(cfg, provider);
	if (!ref) return normalizeOptionalSecretInput(providerConfig?.apiKey);
	if (ref.source === "env") return ref.id.trim() || "secretref-managed";
	return NON_ENV_SECRETREF_MARKER;
}
/** Resolves custom provider API keys that are usable without mutating secret stores. */
function resolveUsableCustomProviderApiKey(params) {
	const input = resolveProviderConfigSecretInput(params.cfg, params.provider);
	const { providerConfig: customProviderConfig, ref: apiKeyRef } = input;
	if (apiKeyRef) {
		const envVarName = apiKeyRef.source === "env" ? apiKeyRef.id.trim() : "";
		if (!envVarName) return null;
		if (!(input.resolvedEnvRef || canResolveEnvSecretRefInReadOnlyPath({
			cfg: params.cfg,
			provider: apiKeyRef.provider,
			id: envVarName
		}))) return null;
		const envValue = normalizeOptionalSecretInput(input.resolvedEnvRef ? customProviderConfig?.apiKey : (params.env ?? process.env)[envVarName]);
		if (!envValue) return null;
		const source = input.resolvedEnvRef ? "models.json" : resolveEnvSourceLabel({
			applied: new Set(getShellEnvAppliedKeys()),
			envVars: [envVarName],
			label: `${envVarName} (models.json secretref)`
		});
		return {
			apiKey: params.secretSentinels ? mintSecretSentinel(envValue, { label: `model-auth:${params.provider}` }) : envValue,
			source
		};
	}
	const customKey = normalizeOptionalSecretInput(customProviderConfig?.apiKey);
	if (!customKey) return null;
	if (!isNonSecretApiKeyMarker(customKey)) return {
		apiKey: customKey,
		source: "models.json"
	};
	if (isKnownEnvApiKeyMarker(customKey)) {
		const envValue = normalizeOptionalSecretInput((params.env ?? process.env)[customKey]);
		if (!envValue) return null;
		return {
			apiKey: envValue,
			source: resolveEnvSourceLabel({
				applied: new Set(getShellEnvAppliedKeys()),
				envVars: [customKey],
				label: `${customKey} (models.json marker)`
			})
		};
	}
	if (customProviderConfig && isCustomLocalProviderConfig(customProviderConfig) && (customProviderConfig.api === "openai-completions" || customProviderConfig.api === "ollama") && customProviderConfig.baseUrl && isLocalAuthProviderBaseUrl(customProviderConfig.baseUrl)) return {
		apiKey: customProviderConfig.api === "ollama" ? customKey : CUSTOM_LOCAL_AUTH_MARKER,
		source: "models.json (local marker)"
	};
	return null;
}
/** True when a custom provider has a literal/env/local key available now. */
const hasUsableCustomProviderApiKey = (cfg, provider, env) => Boolean(resolveUsableCustomProviderApiKey({
	cfg,
	provider,
	env
}));
/** True when explicit provider config should outrank profile/environment auth. */
function shouldPreferExplicitConfigApiKeyAuth(cfg, provider) {
	const providerConfig = resolveProviderConfig(cfg, provider);
	return resolveProviderAuthOverride(cfg, provider) === "api-key" && providerConfig !== void 0 && hasExplicitProviderApiKeyConfig(providerConfig);
}
/** True when configured or prepared route facts prove a local no-auth provider. */
function hasSyntheticLocalProviderAuthConfig(params) {
	const providerConfig = resolveProviderConfig(params.cfg, params.provider);
	const authOverride = resolveProviderAuthOverride(params.cfg, params.provider);
	if (authOverride && authOverride !== "api-key") return false;
	if (!params.route && (!providerConfig || !isCustomLocalProviderConfig(providerConfig)) || providerConfig !== void 0 && hasExplicitProviderApiKeyConfig(providerConfig)) return false;
	const route = params.route ?? providerConfig;
	return typeof route?.api === "string" && route.api.trim().length > 0 && typeof route.baseUrl === "string" && isLocalAuthProviderBaseUrl(route.baseUrl);
}
function resolveProviderAuthOverride(cfg, provider) {
	const auth = resolveProviderConfig(cfg, provider)?.auth;
	if (auth === "api-key" || auth === "aws-sdk" || auth === "oauth" || auth === "token") return auth;
}
function shouldUseImplicitAwsSdkAuth(params) {
	if (params.modelApi !== "bedrock-converse-stream") return false;
	if (normalizeProviderId(params.provider) !== "amazon-bedrock") return false;
	const providerConfig = resolveProviderConfig(params.cfg, params.provider);
	return resolveProviderAuthOverride(params.cfg, params.provider) === void 0 && (providerConfig === void 0 || !hasExplicitProviderApiKeyConfig(providerConfig));
}
function profileTypeToAuthMode(type) {
	return type === "oauth" ? "oauth" : type === "token" ? "token" : "api-key";
}
function normalizeProviderEntryBaseUrlForBinding(baseUrl) {
	const trimmed = baseUrl?.trim();
	if (!trimmed) return;
	try {
		const parsed = new URL(trimmed);
		parsed.hash = "";
		parsed.search = "";
		parsed.pathname = parsed.pathname.replace(/\/+$/, "");
		return parsed.toString().replace(/\/+$/, "");
	} catch {
		return trimmed.toLowerCase().replace(/\/+$/, "");
	}
}
function providerEntriesShareBaseUrl(params) {
	const providerBaseUrl = normalizeProviderEntryBaseUrlForBinding(resolveProviderConfig(params.cfg, params.provider)?.baseUrl);
	const credentialProviderBaseUrl = normalizeProviderEntryBaseUrlForBinding(resolveProviderConfig(params.cfg, params.credentialProvider)?.baseUrl);
	return Boolean(providerBaseUrl && credentialProviderBaseUrl && providerBaseUrl === credentialProviderBaseUrl);
}
function isBearerProfileCredential(credential) {
	return credential.type === "api_key" || credential.type === "token";
}
/** True when a bearer auth profile can safely satisfy a provider-entry apiKey reference. */
function canUseProfileAsProviderEntryApiKey(params) {
	if (!isBearerProfileCredential(params.credential)) return false;
	if (isStoredCredentialCompatibleWithAuthProvider({
		cfg: params.cfg,
		authAliasLookupParams: params.authAliasLookupParams,
		provider: params.provider,
		credential: params.credential
	})) return true;
	return providerEntriesShareBaseUrl({
		cfg: params.cfg,
		provider: params.provider,
		credentialProvider: params.credential.provider
	});
}
/** Classifies a provider entry apiKey as literal/profile/marker before resolving secrets. */
function resolveProviderEntryApiKeyProfileReference(params) {
	const { providerConfig, ref } = resolveProviderConfigSecretInput(params.cfg, params.provider, params.sourceConfig);
	if (ref) return { kind: "none" };
	const perEntryRawKey = normalizeOptionalSecretInput(providerConfig?.apiKey);
	if (!perEntryRawKey) return { kind: "none" };
	if (isNonSecretApiKeyMarker(perEntryRawKey)) return {
		kind: "marker",
		evidence: isKnownEnvApiKeyMarker(perEntryRawKey) ? "environment" : "synthetic"
	};
	const credential = params.store.profiles[perEntryRawKey];
	if (!credential) return {
		kind: "literal",
		apiKey: perEntryRawKey,
		source: "models.json"
	};
	const reason = !isBearerProfileCredential(credential) ? "credential-class" : !canUseProfileAsProviderEntryApiKey({
		cfg: params.cfg,
		authAliasLookupParams: params.authAliasLookupParams,
		provider: params.provider,
		credential
	}) ? "provider-binding" : void 0;
	if (reason) return {
		kind: "profile-incompatible",
		profileId: perEntryRawKey,
		credentialProvider: credential.provider,
		credentialType: credential.type,
		reason
	};
	return {
		kind: "profile",
		profileId: perEntryRawKey,
		credential,
		mode: profileTypeToAuthMode(credential.type)
	};
}
/** Resolves a provider-entry apiKey profile reference into runtime auth when possible. */
async function resolveProviderEntryApiKeyBinding(params) {
	params.signal?.throwIfAborted();
	const reference = resolveProviderEntryApiKeyProfileReference(params);
	if (reference.kind === "none" || reference.kind === "marker") return { kind: "none" };
	if (reference.kind === "literal" || reference.kind === "profile-incompatible") return reference;
	try {
		const { resolveApiKeyForProfile } = await import("./oauth-BxxRuYJ3.mjs");
		const resolved = await resolveApiKeyForProfile({
			cfg: params.cfg,
			store: params.store,
			profileId: reference.profileId,
			agentDir: params.agentDir,
			signal: params.signal
		});
		params.signal?.throwIfAborted();
		if (!resolved) return {
			kind: "profile-unresolved",
			profileId: reference.profileId
		};
		const resolvedProfileId = resolved.profileId ?? reference.profileId;
		return {
			kind: "profile-resolved",
			auth: projectResolvedProfileAuth({
				apiKey: resolved.apiKey,
				enabled: params.secretSentinels,
				profileId: resolvedProfileId,
				provider: params.provider,
				store: params.store,
				mode: resolved.profileType ? profileTypeToAuthMode(resolved.profileType) : reference.mode
			})
		};
	} catch (err) {
		params.signal?.throwIfAborted();
		if (err instanceof SecretSurfaceUnavailableError) throw err;
		return {
			kind: "profile-unresolved",
			profileId: reference.profileId,
			error: err
		};
	}
}
function resolveConfiguredAwsSdkProfileAuth(params) {
	if (!isConfiguredAwsSdkAuthProfileForProvider(params)) return null;
	return {
		...resolveAwsSdkAuthInfo(),
		profileId: params.profileId,
		source: `profile:${params.profileId}`
	};
}
function isLocalAuthProviderBaseUrl(baseUrl) {
	return isLocalProviderBaseUrl(baseUrl, MODEL_AUTH_LOCAL_HOST_ALIASES);
}
function hasExplicitProviderApiKeyConfig(providerConfig) {
	return normalizeOptionalSecretInput(providerConfig.apiKey) !== void 0 || coerceSecretRef(providerConfig.apiKey) !== null;
}
function isInlineProviderApiKeySource(source) {
	return source === "models.json" || source.endsWith(" (models.json secretref)") || source.endsWith(" (models.json marker)");
}
/** True when a resolved credential came from an inline `models.providers.<id>.apiKey`. */
function isConfigBackedInlineProviderApiKey(params) {
	if (isInlineProviderApiKeySource(params.source)) return true;
	const { providerConfig, ref } = resolveProviderConfigSecretInput(params.cfg, params.provider);
	if (!providerConfig || !hasExplicitProviderApiKeyConfig(providerConfig)) return false;
	if (ref) return true;
	const perEntryRawKey = normalizeOptionalSecretInput(providerConfig.apiKey);
	return Boolean(perEntryRawKey && !params.store?.profiles[perEntryRawKey]);
}
function resolveInlineProviderApiKeyCooldownUntil(store, provider) {
	return readInlineProviderApiKeyUsage(store, provider).unusableUntil;
}
/** Fails closed while an inline provider API key is inside its billing/auth cooldown. */
function assertInlineProviderApiKeyUsable(params) {
	const unusableUntil = resolveInlineProviderApiKeyCooldownUntil(params.store, params.provider);
	if (typeof unusableUntil !== "number" || unusableUntil <= Date.now()) return;
	const waitMs = Math.max(0, unusableUntil - Date.now());
	const waitMinutes = Math.max(1, Math.ceil(waitMs / 6e4));
	throw new Error(`Inline API key for provider "${params.provider}" is temporarily disabled after a provider auth/billing failure. Retry after about ${waitMinutes} minute${waitMinutes === 1 ? "" : "s"}, or switch to a different auth profile/API key.`);
}
function isCustomLocalProviderConfig(providerConfig) {
	return typeof providerConfig.baseUrl === "string" && providerConfig.baseUrl.trim().length > 0 && typeof providerConfig.api === "string" && providerConfig.api.trim().length > 0 && Array.isArray(providerConfig.models) && providerConfig.models.length > 0;
}
function isManagedSecretRefApiKeyMarker(apiKey) {
	return apiKey?.trim() === NON_ENV_SECRETREF_MARKER;
}
function hasSecretRefProviderApiKey(cfg, provider) {
	const { providerConfig, ref } = resolveProviderConfigSecretInput(cfg, provider);
	const apiKey = providerConfig?.apiKey;
	if (ref) return true;
	return typeof apiKey === "string" && (isManagedSecretRefApiKeyMarker(apiKey) || apiKey.trim().startsWith("secretref-env:"));
}
function providerConfigMatchesRuntimeSnapshot(params) {
	const inputProvider = resolveProviderConfig(params.inputConfig, params.provider);
	const runtimeProvider = resolveProviderConfig(params.runtimeConfig ?? void 0, params.provider);
	const toComparableConfig = (providerConfig) => ({ models: { providers: { [params.provider]: providerConfig } } });
	return inputProvider && runtimeProvider ? params.inputConfig === params.runtimeConfig || inputProvider === runtimeProvider || hashRuntimeConfigValue(toComparableConfig(inputProvider)) === hashRuntimeConfigValue(toComparableConfig(runtimeProvider)) : false;
}
function sentinelizeConfigSecretRefEnvApiKey(params) {
	if (!params.enabled) return params.apiKey;
	const configured = resolveProviderConfig(resolveProviderSourceConfig(params.cfg, params.provider), params.provider)?.apiKey;
	const ref = coerceSecretRef(configured);
	const envId = ref?.source === "env" ? ref.id : typeof configured === "string" && configured.trim().startsWith("secretref-env:") ? configured.trim().slice(SECRETREF_ENV_HEADER_MARKER_PREFIX.length) : void 0;
	return envId && params.source.includes(envId) ? mintSecretSentinel(params.apiKey, { label: `model-auth:${params.provider}` }) : params.apiKey;
}
function resolveRuntimeProviderConfigApiKeyAuth(params) {
	const { providerConfig, ref } = resolveProviderConfigSecretInput(params.cfg, params.provider);
	const sourceRef = resolveProviderConfigSecretInput(params.sourceConfig, params.provider).ref;
	const apiKey = sourceRef ? providerConfig?.apiKey : ref ? void 0 : normalizeOptionalSecretInput(providerConfig?.apiKey);
	if (typeof apiKey !== "string" || !apiKey.trim() || !sourceRef && isNonSecretApiKeyMarker(apiKey)) return;
	return {
		apiKey,
		source: `models.providers.${params.provider}`,
		mode: resolveDirectProviderCredentialMode({
			cfg: params.cfg,
			provider: params.provider,
			inferredMode: "api-key"
		})
	};
}
function resolveEnvSourceLabel(params) {
	return `${params.envVars.some((envVar) => params.applied.has(envVar)) ? "shell env: " : "env: "}${params.label}`;
}
function resolveAwsSdkAuthInfo() {
	const applied = new Set(getShellEnvAppliedKeys());
	const envVar = resolveAwsSdkEnvVarName();
	const envVars = envVar === "AWS_ACCESS_KEY_ID" ? [envVar, "AWS_SECRET_ACCESS_KEY"] : envVar ? [envVar] : [];
	return {
		mode: "aws-sdk",
		source: envVar ? resolveEnvSourceLabel({
			applied,
			envVars,
			label: envVars.join(" + ")
		}) : "aws-sdk default chain"
	};
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
	if (params.cfg && params.cfg !== runtimeConfig && !runtimeSourceConfig) return;
	const usesRuntimeProvider = selectApplicableRuntimeConfig({
		inputConfig: params.cfg,
		runtimeConfig,
		runtimeSourceConfig
	}) === runtimeConfig || providerConfigMatchesRuntimeSnapshot({
		inputConfig: params.cfg,
		runtimeConfig,
		provider: params.provider
	});
	const sourceConfig = usesRuntimeProvider ? runtimeSourceConfig ?? void 0 : params.cfg;
	if (!hasSecretRefProviderApiKey(sourceConfig, params.provider)) return;
	if (!runtimeConfig || !usesRuntimeProvider) return;
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
	const { ensureAuthProfileStore, findPersistedAuthProfileCredential, loadAuthProfileStoreForSecretsRuntime, loadAuthProfileStoreWithoutExternalProfiles } = authStore;
	/**
	* Checks whether a provider has usable config/env auth or matching local auth profiles.
	*/
	function isProviderApiKeyConfigured(params) {
		const agentDir = params.agentDir?.trim();
		if (params.acceptsApiKey) {
			const { acceptsApiKey, ...availability } = params;
			if (!isProviderApiKeyConfigured(availability)) return false;
			const providerConfig = resolveProviderConfig(params.cfg, params.provider);
			const authoredApiKey = providerConfig?.apiKey;
			const store = agentDir ? ensureAuthProfileStore(agentDir, { allowKeychainPrompt: false }) : void 0;
			let profile = typeof authoredApiKey === "string" ? store?.profiles[authoredApiKey.trim()] : void 0;
			if (!profile && store && providerConfig?.auth !== "api-key") {
				const [profileId] = listUsableProviderAuthProfileIds(availability).profileIds;
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
			const allowsCredentialMode = (mode) => !params.profileTypes?.length || params.profileTypes.some((profileType) => profileTypeToAuthMode(profileType) === mode);
			const authoredApiKey = resolveProviderConfig(params.cfg, params.provider)?.apiKey;
			const profileId = typeof authoredApiKey === "string" ? authoredApiKey.trim() : void 0;
			if (agentDir && profileId) {
				const credential = findPersistedAuthProfileCredential({
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
					if (binding.kind === "profile") return allowsCredentialMode(binding.mode) && resolveStoredCredentialReadOnlyAvailability({
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
		if (resolveEnvApiKey(params.provider)?.apiKey) return true;
		if (!agentDir) return false;
		const store = ensureAuthProfileStore(agentDir, { allowKeychainPrompt: false });
		const profileIds = listProfilesForProvider(store, params.provider);
		if (!params.profileTypes?.length) return profileIds.length > 0;
		const allowedTypes = new Set(params.profileTypes);
		return profileIds.some((profileId) => {
			const type = store.profiles[profileId]?.type;
			return type !== void 0 && allowedTypes.has(type);
		});
	}
	/**
	* Lists auth profile ids usable for a provider without throwing on missing stores or keychain access.
	*/
	function listUsableProviderAuthProfileIds(params) {
		try {
			const { agentDir, profileIds, store } = resolveUsableProviderAuthProfiles(params);
			return {
				agentDir,
				profileIds: filterAuthProfileIdsByType(store, profileIds, params)
			};
		} catch {
			return {
				agentDir: "",
				profileIds: []
			};
		}
	}
	/**
	* Checks whether any usable auth profile exists for a provider.
	*/
	function isProviderAuthProfileConfigured(params) {
		return listUsableProviderAuthProfileIds(params).profileIds.length > 0;
	}
	/**
	* Resolves the first usable auth-profile API key for a provider in configured profile order.
	*/
	async function resolveProviderAuthProfileApiKey(params) {
		const { resolveApiKeyForProfile } = await import("./oauth-BxxRuYJ3.mjs");
		const { agentDir, profileIds, store } = resolveUsableProviderAuthProfiles({
			...params,
			includePendingOAuthRefresh: true
		});
		if (!agentDir || profileIds.length === 0) return;
		for (const profileId of filterAuthProfileIdsByType(store, profileIds, params)) {
			const resolved = await resolveApiKeyForProfile({
				cfg: params.cfg,
				store,
				agentDir,
				profileId
			});
			if (resolved?.apiKey) return resolved.apiKey;
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
	function filterAuthProfileIdsByType(store, profileIds, params) {
		if (!params.profileTypes?.length) return [...profileIds];
		const allowedTypes = new Set(params.profileTypes);
		return profileIds.filter((profileId) => {
			const type = store.profiles[profileId]?.type;
			return type !== void 0 && allowedTypes.has(type);
		});
	}
	return {
		isProviderApiKeyConfigured,
		listUsableProviderAuthProfileIds,
		isProviderAuthProfileConfigured,
		resolveProviderAuthProfileApiKey
	};
}
//#endregion
//#region src/plugins/provider-external-auth-core.ts
/** Resolves external auth overlays through metadata and synchronous provider hooks. */
function createProviderExternalAuthResolver(hooks) {
	const { resolveProviderPluginsForHooks } = hooks;
	function resolveExternalAuthProfilesWithPlugins(params) {
		const workspaceDir = params.workspaceDir ?? getActivePluginRegistryWorkspaceDirFromState();
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
		})) {
			const profiles = plugin.resolveExternalAuthProfiles?.(params.context);
			if (!profiles || profiles.length === 0) continue;
			matches.push(...profiles);
		}
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
		return normalizeOptionalString(params.modelId ?? (typeof params.context?.modelId === "string" ? params.context.modelId : void 0));
	}
	function hasConfiguredModelProvider(params) {
		return findNormalizedProviderValue(params.config?.models?.providers, params.provider) !== void 0;
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
		const registration = selection ? findProviderRuntimeRegistrationInRegistry({
			registry: selection.registry,
			provider: params.provider,
			ownerRefs,
			isOwnerEligible: (id) => selection.isProviderOwnerEligible(id, params.provider)
		}) : void 0;
		return {
			...params,
			...selection ? { workspaceDir: selection.workspaceDir } : {},
			plugin: registration ? Object.assign({}, registration.provider, { pluginId: registration.pluginId }) : void 0
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
		const selection = resolvePluginProviderRegistryCore({
			config: params.config,
			workspaceDir: params.workspaceDir,
			env: params.env,
			activate: false,
			skipIfLoadInFlight: true
		});
		const registration = selection ? findProviderRuntimeRegistrationInRegistry({
			registry: selection.registry,
			provider: params.provider,
			ownerRefs: [],
			isOwnerEligible: (id) => selection.isProviderOwnerEligible(id, params.provider)
		}) : void 0;
		return registration ? Object.assign({}, registration.provider, { pluginId: registration.pluginId }) : void 0;
	}
	function resolveProviderRuntimePluginHandle(params) {
		return resolveProviderRuntimePluginLookup(params);
	}
	function ensureProviderRuntimePluginHandle(params) {
		const modelId = resolveProviderRuntimeLookupModelId(params);
		if (!params.runtimeHandle || modelId && !params.runtimeHandle.plugin && params.runtimeHandle.modelId !== modelId) return resolveProviderRuntimePluginHandle({
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
		return typeof resolved === "string" && resolved.trim() ? resolved.trim() : void 0;
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
		resolveProviderRuntimePluginHandle,
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
	function resolveProviderOwnerSelection(params, manifestRegistry, declaredOwners, getNormalizedConfig, retained) {
		const apiOwnerHint = resolveProviderConfigApiOwnerHint(params);
		const ownerRef = declaredOwners.has(normalizeProviderId(params.provider)) ? params.provider : apiOwnerHint ?? params.provider;
		const declaredIds = declaredOwners.get(normalizeProviderId(ownerRef));
		const ownerIds = declaredIds ? [...declaredIds] : resolveOwningPluginIdsForProviderRef({
			...params,
			provider: ownerRef,
			manifestRegistry
		}) ?? [];
		const runtimePluginIds = retained && ownerIds.length > 0 ? [] : sortUniqueStrings([params.provider, ...apiOwnerHint ? [apiOwnerHint] : []].flatMap((provider) => resolveManifestActivationPluginIds({
			...params,
			trigger: {
				kind: "provider",
				provider
			},
			manifestRecords: manifestRegistry.plugins,
			normalizedConfig: getNormalizedConfig()
		})));
		return {
			provider: params.provider,
			ownerPluginIds: ownerIds,
			providerPluginIds: ownerIds.length > 0 ? ownerIds : runtimePluginIds,
			runtimePluginIds
		};
	}
	function prepareProviderSelection(params, manifestRegistry, declaredProviderOwners = buildDeclaredProviderOwnerIndex(manifestRegistry?.plugins ?? []), retained = false) {
		let normalizedConfig;
		const getNormalizedConfig = () => normalizedConfig ??= normalizePluginsConfig(params.config?.plugins);
		const providerOwners = manifestRegistry ? (params.providerRefs ?? []).map((provider) => resolveProviderOwnerSelection({
			provider,
			config: params.config,
			workspaceDir: params.workspaceDir,
			env: params.env
		}, manifestRegistry, declaredProviderOwners, getNormalizedConfig, retained)) : [];
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
			manifestRegistry: snapshot.manifestRegistry
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
		let registrationConfigKey;
		if (!generationRegistry && params.config !== void 0) {
			const registrationConfig = loadOptions ?? {
				config: params.config,
				activationSourceConfig: resolvePluginActivationSourceConfig(params)
			};
			registrationConfigKey = resolvePluginRegistrationConfigKey({
				runtimeEntries: normalizePluginsConfig(registrationConfig.config?.plugins).entries,
				sourceEntries: normalizePluginsConfig(registrationConfig.activationSourceConfig?.plugins).entries
			});
		}
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
					manifestRegistry: snapshot.manifestRegistry
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
				if (!generationRegistry && params.registryScope === "exact" || context && registrationConfigKey !== void 0 && registrationConfigKey !== context.registrationConfigKey) continue;
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
function createRuntimeModelAuth({ ensureAuthProfileStore, isProviderApiKeyConfigured }) {
	const getApiKeyForModel = createLazyRuntimeMethod(loadModelAuthRuntime, (runtime) => runtime.getApiKeyForModel);
	const getRuntimeAuthForModel = createLazyRuntimeMethod(loadModelAuthRuntime, (runtime) => runtime.getRuntimeAuthForModelCore);
	const resolveApiKeyForProvider = createLazyRuntimeMethod(loadModelAuthRuntime, (runtime) => runtime.resolveProviderRuntimeApiKey);
	return {
		resolveProviderIdForAuth,
		ensureAuthProfileStore,
		resolveAuthProfileOrder,
		listProfilesForProvider,
		isProviderApiKeyConfigured,
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
const resolveRuntimePluginRegistry = createPluginRuntimeRegistryResolver(loadOpenClawPlugins);
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
			isProviderApiKeyConfigured: authAvailability.isProviderApiKeyConfigured
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
			if (instance) instances.add(instance);
		}
		const results = await Promise.allSettled([...instances].filter((instance) => !rollbackInstances.has(instance)).map((instance) => instance.dispose()));
		for (const instance of instances) releasePluginCacheInstance(instance, cache);
		try {
			await retirePluginCache(cache);
		} catch (reason) {
			results.push({
				status: "rejected",
				reason
			});
		}
		const failures = results.flatMap((result) => result.status === "rejected" ? [result.reason] : []);
		if (failures.length) throw new PluginRuntimeCloseRetainedError(new AggregateError(failures, "Plugin inspection instances failed to retire"));
	});
	try {
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
export { resolveProviderEntryApiKeyBinding as A, isProviderAuthError as B, resolveAwsSdkAuthInfo as C, resolveProviderAuthOverride as D, resolveInlineProviderApiKeyCooldownUntil as E, shouldUseImplicitAwsSdkAuth as F, resolveSecretRefReadOnlyAvailability as G, resolveAwsSdkEnvVarName as H, MissingProviderAuthError as I, findUndeclaredPluginToolNames as J, resolveStoredCredentialReadOnlyAvailability as K, ProviderAuthError as L, resolveUsableCustomProviderApiKey as M, sentinelizeConfigSecretRefEnvApiKey as N, resolveProviderConfig as O, shouldPreferExplicitConfigApiKeyAuth as P, resolvePluginRegistryLoadCacheKey as Q, formatMissingAuthError as R, providerConfigMatchesRuntimeSnapshot as S, resolveConfiguredAwsSdkProfileAuth as T, resolveDirectProviderCredentialMode as U, requireApiKey as V, hasMalformedSecretInputSyntax as W, clearPluginRegistryLoadCache as X, createRuntimeBase as Y, isPluginRegistryLoadInFlight as Z, hasUsableCustomProviderApiKey as _, nativePluginBindings as a, profileTypeToAuthMode as b, resolvePluginCapabilityCatalogContext as c, resolveManagedSecretRefRuntimeProviderAuth as d, assertInlineProviderApiKeyUsable as f, hasSyntheticLocalProviderAuthConfig as g, hasSecretRefProviderApiKey as h, loadOpenClawPluginsWithInternalOverrides as i, resolveProviderEntryApiKeyProfileReference as j, resolveProviderConfigSecretInput as k, resolveRuntimePluginRegistry as l, getCustomProviderApiKey as m, acquirePluginRegistryWithInternalOverrides as n, resolveNativePluginModelAuth as o, canUseProfileAsProviderEntryApiKey as p, listCodexAppServerExtensionFactories as q, loadOpenClawPlugins as r, resolveNativePluginModelConfig as s, acquirePluginRegistryForInspection as t, assertRuntimeProviderSecretOwnerAvailable as u, isConfigBackedInlineProviderApiKey as v, resolveConfigAwareEnvApiKey as w, projectResolvedProfileAuth as x, isManagedSecretRefApiKeyMarker as y, isMissingProviderAuthError as z };
