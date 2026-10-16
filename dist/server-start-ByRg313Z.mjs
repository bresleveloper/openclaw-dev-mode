import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { g as isFutureDateTimestampMs, j as resolveIntegerOption, w as parseStrictPositiveInteger } from "./number-coercion-CuVhdCBs.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { o as runOutsideAsyncWorkScope, t as AsyncWorkScope } from "./async-work-scope-BYeX3gh6.mjs";
import { d as getPluginMetadataSnapshotCache } from "./plugin-cache-BABafcXD.mjs";
import { i as pluginInstanceInvocation } from "./plugin-instance-invocation-CH4zOUb4.mjs";
import { n as createLazyPromise, r as createLazyPromiseLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { i as createLazyRuntimeNamedExport, n as createLazyRuntimeMethodBinder, r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { n as isVitestRuntimeEnv } from "./test-runtime-env-mVzBKwSd.mjs";
import { r as logAcceptedEnvOption } from "./env-BBJTTIuE.mjs";
import "./src-CdRlGRnW.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { u as normalizeSortedUniqueTrimmedStringList, y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { c as isSecretRef } from "./ref-contract-D0kWy5jy.mjs";
import "./types.secrets-DsPRn9Dz.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { S as resolveIsConfigReadOnly, l as isNixMode, u as normalizeStateDirEnv } from "./paths-DGIwWbpu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { P as runWithDiagnosticTraceContext, T as createDiagnosticTraceContext, b as setDiagnosticsEnabledForProcess, o as emitInternalDiagnosticEvent, p as isDiagnosticsEnabled, q as hasInternalDiagnosticEventInterest, t as areDiagnosticsEnabledForProcess } from "./diagnostic-events-BADdmgZf.mjs";
import { t as applyLoggingConfig } from "./logger-Mnn26Jj7.mjs";
import { n as runtimeForLogger, t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { i as stageSqliteTransactionState } from "./sqlite-post-commit-CQ_AyDCk.mjs";
import { l as resolveRuntimeServiceVersion } from "./version-BJGPJZu6.mjs";
import { t as GatewayScheduler } from "./gateway-scheduler-BYbkpAYn.mjs";
import { c as resolveOpenClawStateSqlitePath, r as resolveDatabasePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { r as getTrackedWorkerCpuSources } from "./worker-cpu-DU6Cf6Aq.mjs";
import { n as runWithSpawnBroker, t as getSpawnBroker } from "./context-BGWzAY3i.mjs";
import { t as captureSqliteReadOnlyWorkerScope } from "./sqlite-readonly-worker-context-CtZdPPcK.mjs";
import { g as withSqliteReadOnlyWorkerScope } from "./sqlite-readonly-worker-TSy0m8v6.mjs";
import { n as hydrateOpenClawStateWorkerError, r as retainOpenClawStateWorkerErrorPayload } from "./openclaw-state-worker-error-Cmtk9G4_.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import { i as runHttpConnectionRequest } from "./http-request-lifecycle-DO9mb9Gu.mjs";
import { t as resolveGatewayPublicOrigin } from "./gateway-public-origin-BcHLka2A.mjs";
import { n as resolveControlUiWebPushUrl, t as normalizeControlUiBasePath } from "./control-ui-shared-DqFhbHR8.mjs";
import { t as _usingCtx } from "./usingCtx-DwOBYOJf.mjs";
import { t as isContainerEnvironment } from "./container-environment-e2wGNmXf.mjs";
import { _ as registerOpenClawStateDatabaseAsyncResource, f as openClawStateDatabaseCache } from "./openclaw-state-db-cache-BKCnj4of.mjs";
import { v as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { c as initializePublishedConfigRuntimeEnv, i as collectConfigRuntimeEnvOwnership, l as prepareConfigRuntimeEnv } from "./config-env-vars-DjPHKieF.mjs";
import { o as withArtifactPreservingStateReads, t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { r as assertOpenClawStateWriteAllowedAtPath } from "./openclaw-state-ownership-BDcUGGMF.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { a as runWithSqliteWorkerStateContext } from "./sqlite-worker-state-context-BeVaUlhr.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { i as buildControlUiSessionPath } from "./src-D0qIyKKg.mjs";
import { _ as isControlUiPluginManagerRequest, f as isControlUiSharePath, g as isControlUiApprovalDocumentPath, h as classifyControlUiRequest, p as resolveControlUiShareOrigin, t as createGatewayControlUiRootLifecycle, y as isControlUiFocusPath } from "./server-control-ui-root-BvtEOT1l.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { t as resolveIncognitoSessionExpiresAt } from "./incognito-session-key-B0aO5PSy.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import { i as copyConfigResolutionFactsExcept, r as copyConfigResolutionFacts } from "./resolution-facts-HH1cnmIY.mjs";
import { i as hashConfigRaw } from "./io.read-helpers-Bvdjf9tk.mjs";
import { o as isSameOpenClawAgentDatabasePath, s as resolveIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { a as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-DCVYVtaO.mjs";
import { i as getGatewayPluginMetadataSnapshot, s as selectCurrentPluginMetadataCache } from "./current-plugin-metadata-state-CfLPTM0e.mjs";
import { i as hasRetainedPluginRuntimeCloseError } from "./runtime-close-error-DPmgR5gM.mjs";
import { n as registerPluginMetadataProcessMemoLifecycleClear, r as retainGatewayPluginMetadata } from "./plugin-metadata-lifecycle-BSDrXrxO.mjs";
import { c as setGatewayPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-DkhWcws3.mjs";
import { d as captureConfigOverrideApplier } from "./io.factory-DWrU5KGJ.mjs";
import { n as getPluginInstance } from "./plugin-instance-scope-DEzoxqBj.mjs";
import { i as getGatewayContextLifetime, t as bindGatewayContextResolver } from "./gateway-context-binding-VqB7gkMe.mjs";
import { u as withPluginRuntimeRegistryScope } from "./gateway-request-scope-BSmCVVpP.mjs";
import { a as resolveControlUiAllowedOrigins, n as ensureControlUiAllowedOriginsForNonLoopbackBind } from "./gateway-control-ui-origins-WhL6Lrby.mjs";
import { T as setAppliedRuntimeConfigSnapshot, l as getRuntimeConfigSourceSnapshot, o as getRuntimeConfigSnapshot } from "./runtime-snapshot-DYptB0Cf.mjs";
import { n as sessionChanges } from "./session-row-changes-BcJIdta8.mjs";
import { A as validateAgentRunDelegatedAuthority } from "./agent-run-registry-BaxMDLZF.mjs";
import { o as capturePluginRegistryLifecycleEpoch, v as isPluginRegistryLifecycleEpochActive } from "./registry-lifecycle-Dekhrk9Y.mjs";
import { M as onPluginHttpRoutesChanged, a as createPluginRegistryOwner } from "./runtime-D4MkflNJ.mjs";
import { o as listLoadedChannelPluginsForRegistry } from "./registry-loaded-BugfxX6l.mjs";
import { n as bindLegacyPluginSdkResourceHost, t as LegacyPluginSdkResourceHost } from "./legacy-sdk-resource-host-DC4n8Jcn.mjs";
import { t as dedupeByKey } from "./dedupe-by-key-DnqEVrst.mjs";
import { a as READ_SCOPE, c as TALK_SCOPE, i as QUESTIONS_SCOPE, n as APPROVALS_SCOPE, o as SESSION_READ_SCOPE, r as PAIRING_SCOPE, t as ADMIN_SCOPE } from "./operator-scopes-DsrPoRc4.mjs";
import { n as captureRemoteModelCatalogStartupSnapshot } from "./remote-overlay-C3A-3o4_.mjs";
import { n as assertGatewayConfigEnvSelectionUnchanged } from "./gateway-env-selection-B-LO0cRL.mjs";
import { a as promoteConfigSnapshotToLastKnownGood, d as readConfigFileSnapshotWithPluginMetadata, l as readConfigFileSnapshotForRuntimeTransaction, r as getRuntimeConfig, x as registerConfigWriteListener } from "./io.runtime-CPntde4x.mjs";
import "./io-CUI9EWW_.mjs";
import "./config-CzeZu5J_.mjs";
import { a as hasGatewayClientCap, t as GATEWAY_CLIENT_CAPS } from "./client-info-C8RatpKO.mjs";
import { n as isBrowserOperatorUiClient, t as isBrowserCopilotClient } from "./message-channel-j-k-Nup3.mjs";
import { g as stripInternalRuntimeContext } from "./internal-runtime-context-CAWYwg4i.mjs";
import { n as runWithProcessCleanupBudget, t as getProcessCleanupBudget } from "./cleanup-budget-B-yQr9sD.mjs";
import { i as tryLoadActivatedBundledPluginPublicSurfaceModule } from "./facade-runtime-B-yS8AQL.mjs";
import { m as listAgentDatabaseAdmissionRefusals, r as canIsolateAgentDatabase, v as withAgentDatabasePreparationGuard } from "./agent-database-admission-dWNS6Rcs.mjs";
import { m as listOpenIncognitoAgentDatabases } from "./openclaw-agent-db-lifecycle-BJiYtXuW.mjs";
import { a as getOpenClawAgentDatabaseIfOpen } from "./openclaw-agent-db-DBug3LUA.mjs";
import { g as resolveAuthProfileDatabasePath } from "./sqlite-CW8wNN4G.mjs";
import "./sessions-DJqMAtE3.mjs";
import { K as readUserProfileVersion, R as onUserProfilesChanged } from "./user-profiles-internal-DlO1LBbo.mjs";
import { a as getActiveGatewayRootWorkCount, c as getGatewaySuspendAdmissionPhase, f as isGatewayWorkAdmissionClosed, s as getGatewayRestartDrainSignal, u as isGatewayRestartDraining } from "./gateway-work-admission-rc4ZgKq_.mjs";
import { l as withSystemEventOwner } from "./system-event-ownership-BkQcgSZJ.mjs";
import { c as resolveSystemMainSessionTarget } from "./main-session-00MgEWj5.mjs";
import { i as enqueueSystemEvent } from "./system-events-BD0JkU8V.mjs";
import { i as clearSecretsRuntimeSnapshotState, o as getActiveSecretsRuntimeConfigSnapshot } from "./runtime-state-D5wZ6Dom.mjs";
import { i as decodeSandboxHostCsp, n as buildSandboxHostDocument, o as resolveSandboxHostPort } from "./sandbox-host-BRz3YO81.mjs";
import { a as classifyMcpAppStandalonePath, c as classifyWorkerBootstrapArtifactTransferPath, i as classifyGatewayProbePath, l as classifyWorkerGatewayPath, o as classifyNodeWorkerBundleTransferPath, r as WORKER_BOOTSTRAP_ARTIFACT_TRANSFER_PATH, s as classifyNodeWorkspaceTransferPath } from "./gateway-http-route-contracts-jBtizxKU.mjs";
import { a as roleScopesAllow, n as operatorScopeSatisfied } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { i as closeGatewayDeviceRevocation } from "./device-revocation-DeateGFe.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { f as readUserProfileDirectory } from "./user-profiles-DYQbtiqy.mjs";
import { g as readGatewayAccessRevision, n as authorizeGatewaySessionCreation, p as resolveOperatorRolePolicyForProfile } from "./operator-role-policy-BqPaarjx.mjs";
import { r as GatewayOperatorAccessUnavailableError } from "./operator-access-policy-DIBw5efa.mjs";
import { t as warnSessionPersistenceDeprecation } from "./session-persistence-deprecation-H2dQRi8K.mjs";
import { r as closePreparedModelRuntimeSnapshots } from "./prepared-model-runtime.lifecycle-ADHVLWEn.mjs";
import { h as publishSystemEventStoreConfig } from "./session-transcript-worker-runtime-EUbUbAQu.mjs";
import { r as onSessionIdentityMutation } from "./session-lifecycle-events-qdejgRzS.mjs";
import { t as listSessionEntriesReadOnly } from "./session-accessor.sqlite-entry-list.read-jgvuh1fV.mjs";
import { s as resolveConfiguredAgentDatabaseTargets } from "./targets-BbcRkdUC.mjs";
import { _ as resolveGatewayListenHosts, r as isLocalDirectRequest, s as isLoopbackHost, y as resolveHostName } from "./net-C6WEu3pd.mjs";
import { n as mergeGatewayAuthConfig, r as resolveGatewayAuth } from "./auth-resolve-BmUDP1m_.mjs";
import { r as purgeExpiredSecretStoreEntries } from "./secret-store-B2HXTuK3.mjs";
import { n as WebSocketServer } from "./websocket-CGHaToS5.mjs";
import { n as authorizeOperatorScopesForMethod } from "./method-scopes-BrMPjfvW.mjs";
import { c as listCoreGatewayMethodNames, n as createCoreGatewayMethodDescriptors, r as isCoreGatewayMethodClassified, t as STARTUP_UNAVAILABLE_GATEWAY_METHODS } from "./core-method-policy-CcBevufV.mjs";
import { t as getAgentDatabaseStartupAdmission } from "./agent-database-startup-n_PGS5Sj.mjs";
import { o as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-AwYVLytL.mjs";
import { t as extractAssistantPhaseText } from "./chat-message-content-C-d0FKNG.mjs";
import { l as sanitizeAssistantVisibleTextWithProfile } from "./assistant-visible-text-Bv6mP5pg.mjs";
import { s as isTranscriptOnlyOpenClawAssistantMessage } from "./transcript-only-openclaw-assistant-CzjHCvH2.mjs";
import { E as updateSessionProfileInvolvement } from "./session-accessor-cUVSaeKy.mjs";
import { i as MAX_BUFFERED_BYTES, o as MAX_PREAUTH_PAYLOAD_BYTES } from "./server-constants-BH_EolwD.mjs";
import { i as resolveSessionEventAgentScope, n as resolveRequestedSessionAgentId } from "./session-request-agent-Bxi11ET4.mjs";
import { o as createAgentRunRestartAbortError } from "./run-termination-DGv2EKii.mjs";
import { f as startGatewayDiagnosticHeartbeat, p as stopGatewayDiagnosticHeartbeat } from "./diagnostic-ozwVRTLX.mjs";
import { n as resolveCronJobsStorePathFromConfig } from "./paths-C7ju4So0.mjs";
import { i as resolveActiveEmbeddedRunSessionId } from "./active-run-projections-B86tDIo_.mjs";
import { d as setGatewayRestartPolicy, f as setPreRestartDeferralCheck } from "./restart-DQIBmMjt.mjs";
import { r as readGatewayRestartHandoffSync } from "./restart-handoff-HHx3Pddl.mjs";
import { t as getTotalPendingReplies } from "./dispatcher-registry-mpEkB3hL.mjs";
import "./command-queue-CFE60Avj.mjs";
import { t as createGatewayActiveWorkSnapshot } from "./gateway-active-work-D2-QpshF.mjs";
import { a as isGatewaySuspendControlAvailable, o as markGatewaySuspendExiting } from "./gateway-suspend-coordinator-xypp_ryT.mjs";
import "./sessions-DNhLX2Ep.mjs";
import { n as isRestartEnabled } from "./commands.flags-D0cD2TME.mjs";
import { n as fenceSessionSuspensionWritesForGatewayShutdown } from "./session-suspension-DVRz0I9V.mjs";
import { a as resolveMessageActionTurnCapability } from "./message-action-turn-capability-BbHQ1t6i.mjs";
import { i as retireQuestionChannelGateway } from "./question-channel-runtime-CQFEhZRu.mjs";
import { i as withCoreCanvasNodeCapability, n as isCanvasDocumentHttpPath, r as resolveCanvasNodeCapability } from "./constants-Cm4bJJ1Q.mjs";
import { o as captureWorkerTurnClaimCurrentness } from "./placement-turn-claim-events-BCSz3C5d.mjs";
import { d as resumeGatewayRestartTraceFromHandoff, i as finishGatewayRestartTrace, n as collectGatewayProcessMemoryUsageMb, u as resumeGatewayRestartTraceFromEnv } from "./restart-trace-Kdafqv6h.mjs";
import { r as waitForMediaCleanupDrains, t as MEDIA_CLEANUP_STOP_TIMEOUT_MS } from "./server-media-cleanup-lifecycle-KlRv-aNy.mjs";
import { a as upsertPresence, n as listSystemPresence, t as commitPresence } from "./system-presence-CbgT1h20.mjs";
import { a as createSessionMessageSubscriberRegistry, i as createSessionEventSubscriberRegistry, r as createChatRunState } from "./server-chat-state-BP63MB41.mjs";
import { a as runGatewayCloseSteps, i as rethrowGatewayStartupError, r as resolveGatewayShutdownNotice } from "./server-shutdown-DqBhRLh6.mjs";
import { r as prepareGatewayAgentCliShim, t as clearGatewayAgentCliShim } from "./openclaw-cli-shim-I4WwJOH3.mjs";
import { t as isCoreCanvasHostEnabled } from "./config-_RMQn10s.mjs";
import { i as onGatewayPolicyClientInvalidated } from "./ws-policy-close-BgtfQbi3.mjs";
import { t as SharedGatewaySessionGenerationState } from "./server-shared-auth-generation-C2ZgQQOt.mjs";
import { t as authenticatedProfileUnavailableError } from "./gateway-client-identity-DnDs09-7.mjs";
import { t as flattenMarkdownToPlainText } from "./markdown-plain-text-BIBtRgN0.mjs";
import { a as parseControlUiUserAvatarPath, i as parseControlUiResourcePath, o as resolveAssistantMediaRoutePath } from "./control-ui-resource-routes-y_jZ6jnp.mjs";
import "./control-ui-contract-B_YMMx3J.mjs";
import { t as resolveCurrentUserProfileDisplay } from "./current-user-profile-display-CsoRu_a-.mjs";
import { t as deriveSessionTitle } from "./session-utils-core-tGMGyJu7.mjs";
import { a as resolveAssistantAgentId } from "./assistant-avatar-CM_Vhve2.mjs";
import { _ as resolveSessionSharingTarget, m as isSessionVisibilityAllowed, v as resolveSessionVisibility } from "./session-sharing-policy-4QkIpHi4.mjs";
import { c as createProfileSessionEntryFilter, d as prepareSessionSharing, s as canReceiveSessionEvent, u as prepareProjectedSessionSharing } from "./session-sharing-target-read-D_4wDbBo.mjs";
import "./session-sharing-t7UPtrZq.mjs";
import { t as prepareControlUiSessionPrRead } from "./control-ui-session-pr-read-Bt_DBpus.mjs";
import { t as createVisibleActiveSessionRunProjector } from "./session-active-runs-6vHANwv_.mjs";
import "./node-desktop-stream-BZM2AiRA.mjs";
import { t as bumpSkillsSnapshotVersion } from "./refresh-state-CRa-OKC_.mjs";
import { n as installActiveGitHubOAuthLifecycle, t as createGitHubOAuthLifecycle } from "./github-oauth-lifecycle-BGYBvj0R.mjs";
import { c as removeRemoteNodeInfoForConnection, i as recordRemoteNodeInfo, s as removeRemoteNodeInfo } from "./remote-DQMZEn3w.mjs";
import { f as requestNodePairing, p as reusePendingNodePairingForReconnect, r as finalizeNodePairingCleanupClaim } from "./device-pairing-node-HEhf89hA.mjs";
import { t as ensureOpenClawCliOnPath } from "./path-env-BsiqIaLw.mjs";
import { n as NODE_WORKER_BUNDLE_TRANSFER_PATH } from "./node-bundle-install-protocol-C0PbrQ0m.mjs";
import "./store-ChPMJI5O.mjs";
import { t as createDefaultDeps } from "./deps-BPCWhUW0.mjs";
import { t as createCronExecutionId } from "./run-id-kGde0n7U.mjs";
import { n as logRejectedLargePayload } from "./diagnostic-payload-cGmngu3I.mjs";
import { t as closeGatewayTransportWithGrace } from "./connection-transport-close-CHFo-TQT.mjs";
import { f as waitForNodeWorkerSupervisor } from "./node-registry-private-CyaYRwVd.mjs";
import { n as readPreparedServerMethodModelCatalogs } from "./optional-model-catalog-B-pbmxbf.mjs";
import { r as registerGatewayModelCatalogPrivateAccess } from "./server-model-catalog-auth-d5Ty5VGR.mjs";
import { n as resolvePluginRoutePathContext, t as isProtectedPluginRoutePathFromContext } from "./path-context-D7IHOCQE.mjs";
import { c as normalizePluginNodeCapabilityScopedUrl, d as reconcileClientPluginNodeCapabilities, o as indexPluginNodeCapabilitySurfaces } from "./plugin-node-capability-BlHl5bub.mjs";
import { f as buildRateLimitIdentityKey, p as createGatewayAuthRateLimiter, s as AUTH_RATE_LIMIT_SCOPE_NODE_REAPPROVAL, u as AUTH_RATE_LIMIT_SCOPE_WORKER_ADMISSION } from "./auth-rate-limit-CnTz49S4.mjs";
import { s as readTailscaleWhoisIdentity } from "./tailscale-CHbn3zco.mjs";
import { a as prepareGatewayIngressAttribution, i as markGatewayIngressTransport, n as PROXY_ATTRIBUTION_REQUIRED_REASON, o as readPreparedGatewayIngressAttribution, r as createGatewayUnattributableProxyReporter, t as PROXY_ATTRIBUTION_GUIDANCE } from "./ingress-attribution-BJWxHT2f.mjs";
import { r as authorizeHttpGatewayConnect } from "./auth-DS7WgSf9.mjs";
import { t as rejectWebSocketUpgrade } from "./websocket-upgrade-reject-D2Ac4nen.mjs";
import { i as handleProviderOAuthCallback, t as PROVIDER_OAUTH_CALLBACK_PATH } from "./provider-browser-auth-WgSgTn1j.mjs";
import { r as markPluginHttpLegacyListener, t as getWebhookLegacyListener } from "./http-legacy-listener-C-rWca_U.mjs";
import { t as adoptPluginHttpRouteHandoffs } from "./http-registry-CF8q0nT-.mjs";
import { d as revokeAttachGrantsForSession, t as GatewayConnectionWork } from "./server-connection-work-CCPgXdCH.mjs";
import { S as respondPlainText, c as sendGatewayAuthFailure, h as setDefaultSecurityHeaders, n as finishFailedGatewayHttpResponse, r as isWebSocketUpgradeRequest, x as respondNotFound } from "./http-common-DJ7rKVvj.mjs";
import { n as loadGatewayTlsServerRuntime } from "./gateway-2zTYRRvn.mjs";
import { r as listConfigReloadRefinementPrefixes, s as diffGatewayReloadPaths, t as buildGatewayReloadPlan } from "./config-reload-plan-rFxyKwyb.mjs";
import { n as parseDevicePairingJoinRequestPath } from "./join-code-B_OfdZ-j.mjs";
import { t as assertGatewayRuntimeSecurityConfig } from "./server-runtime-config-OgB0Qaqg.mjs";
import { t as isChannelStartupSuppressedByEnvironment } from "./server-sidecar-startup-mode-De0PJqUq.mjs";
import { _ as webPushAgentAllowed, f as isWebPushQuietHours, m as normalizeWebPushDisplayLabel, v as webPushCategoryEnabled } from "./push-web-store.records-CGk3CZmD.mjs";
import { n as DEFAULT_CHANNEL_STALE_EVENT_THRESHOLD_MS, r as evaluateChannelHealth, t as DEFAULT_CHANNEL_CONNECT_GRACE_MS } from "./channel-health-policy-CQLQKpCe.mjs";
import { n as controlUiPluginAssetRoot } from "./control-ui-plugin-assets-contract-BEmf5f0r.mjs";
import { t as findMatchingPluginHttpRoutes } from "./route-match-2DPrkRqp.mjs";
import { n as logWs, r as summarizeAgentEventForWsLog } from "./ws-log-Cxv8Uaao.mjs";
import { a as finishGatewayHttpAuthorityError } from "./http-request-authority-DE-KFuCo.mjs";
import { t as resolveSharedGatewaySessionGeneration } from "./ws-shared-generation-BeRsGF9T.mjs";
import { r as queuePluginSessionsChanged } from "./gateway-events-DOO6jtm-.mjs";
import { n as SessionAncestorReferences, t as prepareSessionEventProjection } from "./session-event-projection-BVV8k6WQ.mjs";
import { t as attachSessionChangeEventLifetime } from "./session-change-event-B7XNN_I7.mjs";
import { n as resolveOperatorSessionCreation } from "./session-creation-provenance-CZ3I7AOG.mjs";
import { n as createGatewayMethodRegistry, r as createPluginGatewayMethodDescriptors, t as createGatewayMethodDescriptorsFromHandlers } from "./registry-aQKhFQO5.mjs";
import "./artifact-download-CXaDlLGk.mjs";
import { n as buildControlUiPublicSessionSharePath, r as parseControlUiPublicSessionShareUrl } from "./public-share-BBu0WQWQ.mjs";
import { t as isTerminalConfigEnabled } from "./enabled-BSjeiWpO.mjs";
import { a as writeMentionStoreChanges, i as readMentionStoreSnapshot, n as MENTION_RETENTION_MS } from "./mention-inbox-store-C9lniJqc.mjs";
import { n as resolveGatewayReloadPluginActivationCandidate, t as mergeActivationSectionsIntoRuntimeConfig } from "./plugin-activation-runtime-config-gs4-U9B6.mjs";
import { r as prepareWebPushNotificationSender, s as hasBoundWebPushSubscriptions } from "./push-web-CligmjCq.mjs";
import { i as withCurrentWebPushAuthority, n as webPushSessionAccess, r as webPushTargetClient, t as listCurrentWebPushTargets } from "./web-push-authority-hkrb9gNs.mjs";
import { i as GATEWAY_EVENT_UPDATE_RUN_CHANGED, n as GATEWAY_EVENT_NODE_RUNNER_INVENTORY_CHANGED, t as GATEWAY_EVENT_DEVICE_PAIR_CHANGED } from "./events-D023Lo1g.mjs";
import { t as createPresenceRecipientProjection } from "./presence-projection-BnAueirH.mjs";
import { a as incrementPresenceVersion, i as getPresenceVersion, o as refreshGatewayHealthSnapshot, r as getHealthVersion } from "./health-state-CFMejOLY.mjs";
import { t as collectGatewayWorkerPoolMetrics } from "./process-vitals-Bng1Qgfn.mjs";
import { r as createModelAccountConnectService } from "./model-account-connect-wfMmajkJ.mjs";
import { t as createControlUiSessionPullRequestSubscriptions } from "./control-ui-session-pr-subscriptions-DHAeyirD.mjs";
import { i as clearNodeWakeState } from "./node-wake-state-CWVR-GCk.mjs";
import { t as resolveGrantExpiryDaysConfig } from "./standing-grant-expiry-config-CqUe6ux8.mjs";
import { r as createWizardSessionTracker } from "./server-wizard-sessions-Bjw33MRW.mjs";
import { n as refreshConnectedNodeSurfaceCaches } from "./nodes.read-DvMGajGB.mjs";
import { i as listenGatewayHttpServer, t as createGatewayPortalService } from "./portal-service-DOivgj0M.mjs";
import { n as createGatewayChatMetadataLifecycle, t as broadcastChatMetadataChanged } from "./server-chat-metadata-lifecycle-B9PnU98B.mjs";
import { t as isLiveTextAppend } from "./live-text-continuity-CerU9eca.mjs";
import { n as listPluginNodeCapabilities, t as findMatchingPluginNodeCapabilityRoute } from "./route-capability-C0Y47UOw.mjs";
import { n as applyGatewayLaneConcurrency, r as resolveGatewayLaneConcurrency, t as resolveHookClientIpConfig } from "./hook-client-ip-config-Cfv8QwAY.mjs";
import { n as clearGatewayMaintenanceHandles, t as createNoopHeartbeatRunner } from "./server-runtime-service-shared-DE-vorah.mjs";
import { t as recordClientPresenceActivity } from "./client-presence-O8mBp5sO.mjs";
import { a as retireDeviceTokenClients, i as startNodeConnectionNotifications, t as disconnectDisallowedGatewayPolicyClients } from "./ws-origin-policy-Mc4ue5hf.mjs";
import { r as createDesktopSessionRegistry } from "./session-registry-BokhNGNC.mjs";
import { t as createGatewayStartupTrace } from "./server-startup-trace-D88Ik5PK.mjs";
import { a as runWithGatewayHttpWorkAdmission, i as rejectGatewayUpgradeServiceUnavailable, r as shouldEnforceGatewayAuthForPluginPath, t as isPluginAuthenticatedRoutePath } from "./route-auth-DQXHWvPu.mjs";
import { i as markPublicWorkerIngress, t as GATEWAY_WS_CONNECTION_KIND_PROPERTY } from "./ws-types-099MIJxx.mjs";
import { n as handleArtifactTransferHttpRequest } from "./artifact-transfer-http-DMhtm51C.mjs";
import { n as handleNodeWorkspaceTransferHttpRequest } from "./node-workspace-transfer-http-Cbn4M3YF.mjs";
import { t as GATEWAY_EVENTS } from "./server-methods-list-IpRgCVfK.mjs";
import { n as logGatewayReady, t as beginMacOSSystemCaWarmupOnce } from "./system-ca-warmup-D8yqU9RU.mjs";
import "./session-limits-BqiIRDwa.mjs";
import { unwatchFile, watchFile } from "node:fs";
import { AsyncLocalStorage } from "node:async_hooks";
import { cpus } from "node:os";
import { isDeepStrictEqual } from "node:util";
import { createHash, randomUUID } from "node:crypto";
import { Worker, isMainThread } from "node:worker_threads";
import { createHistogram, performance } from "node:perf_hooks";
import { setTimeout as setTimeout$1 } from "node:timers/promises";
import { isProxy } from "node:util/types";
import { createServer } from "node:http";
import { Server, createServer as createServer$1 } from "node:https";
import { TLSSocket } from "node:tls";
//#region src/gateway/agent-runtime-approval-authority.ts
/** Builds the use-time approval gate from the run owner and canonical worker store. */
function createAgentRuntimeApprovalAuthorityValidator(placements) {
	return (identity) => {
		const authority = identity.delegatedAuthority;
		if (authority.kind === "worker") {
			if (!(placements && captureWorkerTurnClaimCurrentness(placements, authority.turnClaim, authority))?.()) return false;
		} else if (!validateAgentRunDelegatedAuthority(authority)) return false;
		const messageActionContext = identity.messageActionContext;
		if (!messageActionContext) return true;
		if (!messageActionContext.turnCapability) return false;
		return Boolean(resolveMessageActionTurnCapability({
			token: messageActionContext.turnCapability,
			agentId: identity.agentId,
			runId: identity.operationalRunInstance.runId,
			sessionKey: identity.sessionKey,
			sessionId: messageActionContext.sessionId
		}));
	};
}
//#endregion
//#region src/gateway/channel-thaw-restart.ts
function snapshotRunningTargets(manager) {
	return Object.entries(manager.getRuntimeSnapshot({ inspectAccounts: false }).channelAccounts).flatMap(([channelId, accounts]) => Object.entries(accounts ?? {}).filter(([accountId, status]) => status?.running === true && manager.isAccountListed(channelId, accountId)).map(([accountId]) => ({
		channelId,
		accountId
	})));
}
/**
* Restarts running listed, non-manually-stopped channel accounts after a host
* thaw. Dead sockets from a freeze otherwise wait for the slow health sweep.
*/
async function restartRunningChannelAccounts(manager, opts, selection = { kind: "new-thaw" }) {
	const targets = selection.kind === "new-thaw" ? dedupeByKey([...selection.pendingTargets ?? [], ...snapshotRunningTargets(manager)], (target) => `${target.channelId}:${target.accountId}`) : [...selection.targets];
	const failedTargets = [];
	for (const [index, target] of targets.entries()) {
		const { channelId, accountId } = target;
		if (manager.isManuallyStopped(channelId, accountId)) continue;
		if (!opts.shouldContinue()) return [...failedTargets, ...targets.slice(index)];
		try {
			const snapshotOptions = {
				channelId,
				inspectAccounts: false
			};
			let current = manager.getRuntimeSnapshot(snapshotOptions).channelAccounts[channelId]?.[accountId];
			if (!current || !manager.isAccountListed(channelId, accountId)) continue;
			await manager.stopChannel(channelId, accountId, { manual: false });
			if (!opts.shouldContinue()) return [
				...failedTargets,
				target,
				...targets.slice(index + 1)
			];
			current = manager.getRuntimeSnapshot(snapshotOptions).channelAccounts[channelId]?.[accountId];
			if (!current || !manager.isAccountListed(channelId, accountId)) continue;
			let startOutcomes = await manager.startChannel(channelId, accountId, { preserveManualStop: true });
			let startOutcome = startOutcomes.get(accountId);
			let restarted = manager.getRuntimeSnapshot(snapshotOptions).channelAccounts[channelId]?.[accountId];
			if (startOutcome?.status === "retry" && restarted?.restartPending === true && manager.isAccountListed(channelId, accountId)) {
				startOutcomes = await manager.startChannel(channelId, accountId, { preserveManualStop: true });
				startOutcome = startOutcomes.get(accountId);
				restarted = manager.getRuntimeSnapshot(snapshotOptions).channelAccounts[channelId]?.[accountId];
			}
			if (startOutcome?.status === "retry") {
				failedTargets.push(target);
				opts.onError(`[${channelId}:${accountId}] host-thaw restart failed: replacement was not handed off (${startOutcome.reason})${restarted?.lastError ? `: ${restarted.lastError}` : ""}`);
			}
		} catch (error) {
			failedTargets.push(target);
			opts.onError(`[${channelId}:${accountId}] host-thaw restart failed: ${String(error)}`);
		}
		if (!opts.shouldContinue()) return [...failedTargets, ...targets.slice(index + 1)];
	}
	return failedTargets;
}
//#endregion
//#region src/gateway/server-core-runtime.ts
function approvalRequestTargetsSession(request, sessionKeys, sessionId) {
	if (typeof request !== "object" || request === null) return false;
	const record = request;
	return typeof record.sessionId === "string" && record.sessionId === sessionId || typeof record.sessionKey === "string" && sessionKeys.has(record.sessionKey);
}
async function startGatewayCoreRuntime(input) {
	const { lifecycleRuntime: runtime, port, log, logDiscovery, logHealth, logChannels, loadGatewayStartupEarlyModule, loadGatewayPluginBootstrapModule, loadGatewayModelCatalog, loadGatewayModelCatalogSnapshot, readPreparedGatewayModelCatalog, readPreparedGatewayModelCatalogBatch } = input;
	const { minimalTestGateway, cfgAtStart, gatewayTls, bindHost, tailscaleMode, nodeRegistry, pluginRuntime, broadcast, nodeSendToAllSubscribed, refreshGatewayHealthSnapshotWithRuntime, dedupe, chatAbortControllers, chatQueuedTurns, restartRecoveryCandidates, chatRunState, removeChatRun, agentRunSeq, nodeHasSessionSubscribers, nodeSendToSession, runtimeState, kernel, startupTrace, channelManager, readinessEventLoopHealth, workerDispatchAuthority, clients, sharedGatewaySessionGenerationState, resolveSharedGatewaySessionGenerationForConfig, sessionMessageSubscribers, sessionEventSubscribers, toolEventRecipients, broadcastToConnIds, controlUiBasePath, workerEnvironmentService, workerPlacementControlAvailable, desktopSessionRegistry, gatewayComputerService, listStartupChannelGatewayMethods, workerEnvironmentStartup, activateRuntimeSecrets } = runtime;
	runtime.registerGatewayLifetimeSidecars({
		preparePluginReload: gatewayComputerService.preparePluginReload,
		stop: async () => {
			await gatewayComputerService.close();
			await desktopSessionRegistry.stopAll();
		}
	});
	const secretEgressProxy = cfgAtStart.secrets?.egressProxy?.enabled === true ? await import("./runtime-CWUOzXCX.mjs").then((egressRuntime) => egressRuntime.startGatewaySecretEgressProxy({
		...cfgAtStart.secrets?.egressProxy?.allowedHosts !== void 0 ? { allowedHosts: cfgAtStart.secrets.egressProxy.allowedHosts } : {},
		...cfgAtStart.secrets?.egressProxy?.bypassHosts ? { bypassHosts: cfgAtStart.secrets.egressProxy.bypassHosts } : {}
	})) : void 0;
	if (secretEgressProxy) runtime.registerGatewayLifetimeSidecars(secretEgressProxy);
	const sendNodeSessionEvent = (sessionKey, event, payload, opts) => {
		nodeSendToSession(sessionKey, event, payload, opts);
	};
	let pendingThawRestartTargets;
	let earlyRuntimePromise;
	const startEarlyRuntime = () => earlyRuntimePromise ??= startupTrace.measure("runtime.early", () => loadGatewayStartupEarlyModule().then(({ startGatewayEarlyRuntime }) => startGatewayEarlyRuntime({
		scheduler: runtime.scheduler,
		minimalTestGateway,
		isClosing: () => runtime.lifecycle.closePreludeStarted,
		updateCanary: runtime.opts.updateCanary,
		cfgAtStart,
		port,
		gatewayTls,
		gatewayDirectReachable: !isLoopbackHost(bindHost),
		tailscaleMode,
		log,
		logDiscovery,
		nodeRegistry,
		swapDiscovery: kernel.swapDiscovery,
		pluginRegistry: pluginRuntime.registry,
		pluginRuntimeClaim: kernel.pluginRuntimeGeneration.currentClaim(),
		broadcast,
		nodeSendToAllSubscribed,
		getPresenceVersion,
		getHealthVersion,
		refreshGatewayHealthSnapshot: refreshGatewayHealthSnapshotWithRuntime,
		restartRunningChannels: async (mode, shouldContinue = () => !isGatewayWorkAdmissionClosed()) => {
			const failedTargets = await restartRunningChannelAccounts(channelManager, {
				shouldContinue,
				onError: (message) => logHealth.error(message)
			}, mode === "new-thaw" || pendingThawRestartTargets === void 0 ? {
				kind: "new-thaw",
				pendingTargets: pendingThawRestartTargets
			} : {
				kind: "deferred-retry",
				targets: pendingThawRestartTargets
			});
			pendingThawRestartTargets = failedTargets.length > 0 ? failedTargets : void 0;
			return failedTargets.length === 0;
		},
		refreshPresence: runtime.publishPresence,
		resetEventLoopHealth: readinessEventLoopHealth.reset,
		logHealth,
		clients,
		dedupe,
		chatAbortControllers,
		chatQueuedTurns,
		restartRecoveryCandidates,
		chatRunState,
		removeChatRun,
		agentRunSeq,
		nodeSendToSession: sendNodeSessionEvent,
		getRuntimeConfig,
		startupTrace
	}))).then((earlyRuntime) => {
		kernel.setEarlyRuntimeHandles(earlyRuntime);
		return earlyRuntime;
	});
	const [{ startGatewayEventSubscriptions }, { startGatewayChannelHealthMonitor }] = await startupTrace.measure("runtime.post-early-imports", () => Promise.all([import("./server-runtime-subscriptions-DAV-oUzK.mjs"), import("./server-runtime-startup-services-CoePdkIf.mjs")]));
	const { sessionCompanion, sessionObserver, sessionActivitySummaries, channelAdmissionAudit, ...runtimeSubscriptionUnsubs } = await startupTrace.measure("runtime.subscriptions", () => startGatewayEventSubscriptions({
		scheduler: runtime.scheduler,
		signal: runtime.connectionWork.signal,
		getSessionRowProjection: runtime.getSessionRowProjection,
		log,
		broadcast,
		broadcastToConnIds,
		nodeHasSessionSubscribers,
		nodeSendToSession: sendNodeSessionEvent,
		agentRunSeq,
		chatRunState,
		toolEventRecipients,
		sessionEventSubscribers,
		sessionMessageSubscribers,
		chatAbortControllers,
		restartRecoveryCandidates,
		refreshConnectedUserProfiles: () => runtime.resolvePluginGatewayContext()?.refreshConnectedUserProfile?.()
	}));
	Object.assign(runtimeState, runtimeSubscriptionUnsubs);
	await startupTrace.measure("runtime.services", () => kernel.setChannelHealthMonitor(startGatewayChannelHealthMonitor({
		channelManager,
		scheduler: runtime.scheduler
	})));
	const { createOperatorApprovalSessionEventRuntime } = await import("./operator-approval-session-events-CPqLRHOY.mjs");
	const approvalManagersForReplay = /* @__PURE__ */ new Map();
	const approvalSessionEvents = createOperatorApprovalSessionEventRuntime({
		clients,
		sessionMessageSubscribers,
		broadcastToConnIds,
		controlUiBasePath,
		reconcileTerminal: (record) => {
			return approvalManagersForReplay.get(record.kind)?.reconcileDurableTerminal(record) ?? false;
		},
		getLiveManager: (kind) => approvalManagersForReplay.get(kind),
		isCurrent: () => !runtime.connectionWork.signal.aborted
	});
	const validateAgentRuntimeApprovalAuthority = createAgentRuntimeApprovalAuthorityValidator(workerEnvironmentStartup?.placementStore);
	const { beginCloseApprovalObservers, stopOperatorInteractions, extraHandlers, coreGatewayHandlers, ...approvalRuntime } = await startupTrace.measure("gateway.handlers", async () => {
		const [{ createGatewayAuxHandlers }, { coreGatewayHandlers: coreGatewayHandlersLocal }] = await Promise.all([import("./server-aux-handlers-D_-QFevx.mjs"), import("./server-methods-Brtp6VFQ.mjs")]);
		return {
			...createGatewayAuxHandlers({
				scheduler: runtime.scheduler,
				log,
				chatAbortControllers,
				hasRunAbortMarker: (runId) => chatRunState.hasAbortMarker(runId),
				getNativeApprovalRouteCoordinator: () => runtime.gatewayInstanceRuntimeRef.current?.nativeApprovals.routeCoordinator,
				resolveGrantDefaultExpiresAtMs: (nowMs) => {
					const days = resolveGrantExpiryDaysConfig(getRuntimeConfig());
					return days !== null ? nowMs + days * 864e5 : null;
				},
				activateRuntimeSecrets,
				sharedGatewaySessionGenerationState,
				resolveSharedGatewaySessionGenerationForConfig,
				clients,
				channelManager,
				getChannelAutostartSuppression: channelManager.getAutostartSuppression,
				logChannels,
				registerWorkerTurnClaimClosedHandler: workerEnvironmentStartup?.placementStore ? (handler) => workerEnvironmentStartup.placementStore.registerTurnClaimClosedHandler(handler) : void 0,
				validateAgentRuntimeDelegatedAuthority: (authority) => validateAgentRuntimeApprovalAuthority({
					kind: "agentRuntime",
					agentId: "approval-manager",
					sessionKey: "approval-manager",
					operationalRunInstance: authority.operationalRunInstance,
					delegatedAuthority: authority
				}),
				onApprovalLifecycle: approvalSessionEvents.publish,
				onAgentRunAuthorityClosed: (authority) => {
					gatewayComputerService.revokeRunAuthority(authority);
				}
			}),
			coreGatewayHandlers: coreGatewayHandlersLocal
		};
	});
	const { execApprovalManager, pluginApprovalManager, systemAgentApprovalManager } = approvalRuntime;
	const requestLifetime = runtime.connectionWork.signal;
	requestLifetime.addEventListener("abort", beginCloseApprovalObservers, { once: true });
	if (requestLifetime.aborted) beginCloseApprovalObservers();
	runtime.registerGatewayLifetimeSidecars({ stop: async () => {
		requestLifetime.removeEventListener("abort", beginCloseApprovalObservers);
		await stopOperatorInteractions();
	} });
	approvalManagersForReplay.set("exec", execApprovalManager);
	approvalManagersForReplay.set("plugin", pluginApprovalManager);
	approvalManagersForReplay.set("system-agent", systemAgentApprovalManager);
	workerDispatchAuthority.revoke = ({ sessionId, sessionKeys }) => {
		const keys = new Set(sessionKeys);
		for (const sessionKey of keys) revokeAttachGrantsForSession(sessionKey);
		const fenceResolver = {
			kind: "system",
			id: "worker-dispatch"
		};
		for (const manager of [execApprovalManager, pluginApprovalManager]) for (const record of manager.listLocalPendingRecords()) if (approvalRequestTargetsSession(record.request, keys, sessionId)) manager.forceDenyDetailed(record.id, "run-aborted", fenceResolver, "cancelled").catch((error) => {
			log.error(`approval dispatch-fence settlement failed: ${String(error)}`);
		});
	};
	const attachedGatewayExtraHandlers = {
		...pluginRuntime.registry.gatewayHandlers,
		...extraHandlers
	};
	let attachedPluginGatewayHandlerKeys = new Set(Object.keys(pluginRuntime.registry.gatewayHandlers));
	const buildAttachedGatewayMethodRegistry = (nextPluginRegistry) => {
		const coreDescriptorHandlers = { ...coreGatewayHandlers };
		const auxHandlers = {};
		for (const [method, handler] of Object.entries(extraHandlers)) if (isCoreGatewayMethodClassified(method)) coreDescriptorHandlers[method] = handler;
		else auxHandlers[method] = handler;
		const coreDescriptors = createCoreGatewayMethodDescriptors(coreDescriptorHandlers).filter((descriptor) => (workerEnvironmentService || descriptor.name !== "environments.create" && descriptor.name !== "environments.destroy" && !descriptor.name.startsWith("environments.session.")) && (workerPlacementControlAvailable || descriptor.name !== "sessions.dispatch") && (workerPlacementControlAvailable || descriptor.name !== "sessions.reclaim" && descriptor.name !== "sessions.move") && (workerEnvironmentService || descriptor.name !== "desktop.launch" && descriptor.name !== "worker.desktop.observe" && descriptor.name !== "worker.desktop.launch"));
		return createGatewayMethodRegistry([
			...coreDescriptors,
			...createPluginGatewayMethodDescriptors(nextPluginRegistry),
			...createGatewayMethodDescriptorsFromHandlers({
				handlers: auxHandlers,
				owner: {
					kind: "aux",
					area: "gateway-extra"
				},
				defaultScope: ADMIN_SCOPE
			})
		], nextPluginRegistry);
	};
	let attachedGatewayMethodRegistry = buildAttachedGatewayMethodRegistry(pluginRuntime.registry);
	const listAttachedGatewayMethods = () => {
		const methods = attachedGatewayMethodRegistry.listAdvertisedMethods();
		methods.push(...listStartupChannelGatewayMethods());
		return uniqueStrings(methods);
	};
	kernel.publishMethodSurface(listAttachedGatewayMethods());
	const getPluginNodeCapabilities = () => withCoreCanvasNodeCapability(listPluginNodeCapabilities(pluginRuntime.registry), isCoreCanvasHostEnabled(getRuntimeConfig()));
	const prepareAttachedPluginRuntime = async (loaded, trackActivationCleanup) => {
		const { activatePluginRegistry } = await import("./loader-shared-h_W0R_-n.mjs");
		const nextMethodRegistry = buildAttachedGatewayMethodRegistry(loaded.pluginRegistry);
		const nextMethods = uniqueStrings([...nextMethodRegistry.listAdvertisedMethods(), ...listStartupChannelGatewayMethods(loaded.pluginRegistry)]);
		const nextHandlerKeys = new Set(Object.keys(loaded.pluginRegistry.gatewayHandlers));
		return {
			publish: () => {
				adoptPluginHttpRouteHandoffs(pluginRuntime.registry, loaded.pluginRegistry);
				activatePluginRegistry(loaded.pluginRegistry, null, "gateway-bindable", runtime.pluginWorkspaceDir, pluginRuntime.registry, trackActivationCleanup);
				pluginRuntime.publish(loaded.pluginRegistry);
				pluginRuntime.baseGatewayMethods = loaded.gatewayMethods;
				for (const key of attachedPluginGatewayHandlerKeys) delete attachedGatewayExtraHandlers[key];
				Object.assign(attachedGatewayExtraHandlers, loaded.pluginRegistry.gatewayHandlers);
				attachedPluginGatewayHandlerKeys = nextHandlerKeys;
				attachedGatewayMethodRegistry = nextMethodRegistry;
				kernel.publishMethodSurface(nextMethods);
			},
			afterCommit: () => {
				nodeRegistry.refreshRuntimePolicy();
			}
		};
	};
	const refreshAttachedGatewayDiscovery = async (nextPluginRegistry, claim) => {
		if (minimalTestGateway) return;
		try {
			if (!await claim.waitForUnblocked()) return;
			await runtimeState.discovery?.update({ gatewayDiscoveryServices: nextPluginRegistry.gatewayDiscoveryServices }, claim);
		} catch (err) {
			logDiscovery.warn(`gateway discovery refresh failed after plugin load: ${String(err)}`);
		}
	};
	const reloadAttachedGatewayPlugins = async (params) => {
		const { reloadGatewayPlugins } = await import("./server-plugin-reload-CNuQuqAp.mjs");
		return reloadGatewayPlugins({
			runtime,
			port,
			log,
			loadGatewayPluginBootstrapModule,
			prepareAttachedPluginRuntime
		}, params);
	};
	return {
		...runtime,
		kernel: {
			...kernel,
			reloadPlugins: reloadAttachedGatewayPlugins
		},
		startEarlyRuntime,
		sessionCompanion,
		sessionObserver,
		sessionActivitySummaries,
		channelAdmissionAudit,
		approvalSessionEvents,
		...approvalRuntime,
		validateAgentRuntimeApprovalAuthority,
		attachedGatewayExtraHandlers,
		getAttachedGatewayMethodRegistry: () => attachedGatewayMethodRegistry,
		getPluginNodeCapabilities,
		prepareAttachedPluginRuntime,
		refreshAttachedGatewayDiscovery,
		loadGatewayModelCatalog,
		loadGatewayModelCatalogSnapshot,
		readPreparedGatewayModelCatalog,
		readPreparedGatewayModelCatalogBatch,
		getPluginMetadataSnapshot: () => runtime.pluginMetadataSnapshot
	};
}
//#endregion
//#region src/gateway/session-incognito-lifetime.ts
const CLEANUP_RETRY_MS = 6e4;
/** Deadline scheduling only: the session deletion owner drains work and removes data. */
function createIncognitoSessionDeadlineOwner(params) {
	const scheduler = params.scheduler.scope();
	const restartSignal = getGatewayRestartDrainSignal();
	const deadlines = /* @__PURE__ */ new Map();
	const current = (deadline) => {
		if (scheduler.signal.aborted || restartSignal.aborted || deadlines.get(deadline.sessionKey) !== deadline) return false;
		try {
			deadline.source.assertCurrent();
			return true;
		} catch {
			return false;
		}
	};
	const retire = (deadline) => {
		deadline.job?.cancel();
		if (deadlines.get(deadline.sessionKey) === deadline) deadlines.delete(deadline.sessionKey);
	};
	const schedule = (deadline, delayMs) => {
		deadline.job = scheduler.schedule({
			id: `incognito-expiry:${deadline.sessionKey}`,
			...delayMs === void 0 ? { atMs: deadline.expiresAt } : { delayMs },
			run: async () => {
				if (!current(deadline)) {
					retire(deadline);
					return;
				}
				try {
					const { deleteGatewaySession } = await import("./sessions-delete-rAhiiBS-.mjs");
					const result = await deleteGatewaySession({
						params: {
							key: deadline.sessionKey,
							agentId: deadline.agentId,
							expectedSessionId: deadline.sessionId
						},
						client: null,
						context: params.context,
						assertCurrent: () => {
							if (!current(deadline)) throw new Error("Incognito expiry no longer owns this session.");
						}
					});
					if (!result.ok) throw new Error(result.error.message);
					retire(deadline);
				} catch {
					if (current(deadline)) {
						params.logWarning("Incognito session expiry could not finish cleanup; will retry.");
						schedule(deadline, CLEANUP_RETRY_MS);
					} else retire(deadline);
				}
			}
		});
	};
	return {
		observe(fact) {
			if (scheduler.signal.aborted || restartSignal.aborted) return;
			fact.source.assertCurrent();
			const existing = deadlines.get(fact.sessionKey);
			if (existing?.source.identity === fact.source.identity && existing.sessionId === fact.sessionId) return;
			if (existing) retire(existing);
			const deadline = { ...fact };
			deadlines.set(fact.sessionKey, deadline);
			schedule(deadline);
		},
		forget(sessionKey) {
			const existing = deadlines.get(sessionKey);
			if (existing) retire(existing);
		},
		stop: async () => {
			scheduler.beginClose();
			deadlines.clear();
			await scheduler.stop();
		}
	};
}
/** Production acquisition remains native until every incognito caller moves together. */
function startIncognitoSessionLifetime(params) {
	const owner = createIncognitoSessionDeadlineOwner(params);
	const runInOwner = AsyncLocalStorage.snapshot();
	const env = {
		...process.env,
		OPENCLAW_STATE_DIR: resolveStateDir()
	};
	const restartSignal = getGatewayRestartDrainSignal();
	let active = true;
	const observe = (change) => {
		if (!active || restartSignal.aborted || !("sessionKey" in change)) return;
		const { sessionKey, agentId, storePath } = change;
		if (!isIncognitoSessionKey(sessionKey) || !agentId || storePath !== resolveIncognitoOpenClawAgentSqlitePath({
			agentId,
			env
		})) return;
		const database = getOpenClawAgentDatabaseIfOpen({
			agentId,
			path: storePath,
			env
		});
		const entry = database ? loadSessionEntryReadOnly({
			agentId,
			sessionKey,
			storePath,
			env
		}) : void 0;
		if (!database || !entry) {
			owner.forget(sessionKey);
			return;
		}
		const expiresAt = resolveIncognitoSessionExpiresAt(entry);
		if (!database.db.isOpen || expiresAt === void 0) return;
		owner.observe({
			sessionKey,
			agentId,
			sessionId: entry.sessionId,
			source: {
				identity: readOpenClawAgentDatabaseIdentity(database).identity,
				assertCurrent() {
					if (!database.db.isOpen || getOpenClawAgentDatabaseIfOpen({
						agentId,
						path: storePath,
						env
					}) !== database) throw new Error("Incognito expiry lost its original database");
				}
			},
			expiresAt
		});
	};
	const unsubscribe = sessionChanges.subscribeProjection((change) => runInOwner(() => observe(change)));
	for (const target of listOpenIncognitoAgentDatabases()) {
		if (target.storePath !== resolveIncognitoOpenClawAgentSqlitePath({
			...target,
			env
		})) continue;
		for (const { sessionKey } of listSessionEntriesReadOnly({
			...target,
			env,
			clone: false
		})) observe({
			...target,
			sessionKey
		});
	}
	return { stop: async () => {
		active = false;
		unsubscribe();
		await owner.stop();
	} };
}
//#endregion
//#region src/gateway/server-lifetime-sidecars.ts
async function attachInitialGatewayLifetimeSidecars(params) {
	params.publishSidecars(startIncognitoSessionLifetime({
		scheduler: params.scheduler,
		context: params.gatewayRequestContext,
		logWarning: params.logWarning
	}));
	await params.chatMetadataLifecycle.attachContext(params.gatewayRequestContext, params.publishSidecars);
	const modelAccountConnect = createModelAccountConnectService({
		getConfig: params.gatewayRequestContext.getRuntimeConfig,
		onChanged: () => broadcastChatMetadataChanged(params.gatewayRequestContext)
	});
	params.gatewayRequestContext.modelAccountConnectService = modelAccountConnect;
	params.publishSidecars({ stop: async () => {
		await modelAccountConnect.stop();
		if (params.gatewayRequestContext.modelAccountConnectService === modelAccountConnect) delete params.gatewayRequestContext.modelAccountConnectService;
	} });
	const githubOAuth = createGitHubOAuthLifecycle({
		scheduler: params.scheduler,
		getConfig: params.gatewayRequestContext.getRuntimeConfig,
		getPersistedConfig: () => getRuntimeConfig({ pin: false }),
		warn: params.logWarning
	});
	params.gatewayRequestContext.githubOAuthService = githubOAuth;
	const uninstallGitHubOAuth = installActiveGitHubOAuthLifecycle(githubOAuth);
	if (!params.minimalTestGateway) githubOAuth.start();
	params.publishSidecars({ stop: async () => {
		uninstallGitHubOAuth();
		await githubOAuth.stop();
		if (params.gatewayRequestContext.githubOAuthService === githubOAuth) delete params.gatewayRequestContext.githubOAuthService;
	} });
	if (!params.minimalTestGateway) {
		let warned = false;
		params.publishSidecars(params.scheduler.schedule({
			id: "maintenance:secret-expiry",
			atMs: params.scheduler.now(),
			everyMs: 6e4,
			run: () => purgeExpiredSecretStoreEntries().then(() => {
				warned = false;
			}).catch(() => {
				if (!warned) {
					params.logWarning("Secret store expiry cleanup failed; will retry.");
					warned = true;
				}
			})
		}));
	}
	const reconcileGitHubPublications = params.reconcileGitHubPublications;
	if (reconcileGitHubPublications) params.publishSidecars(params.scheduler.schedule({
		id: "maintenance:github-publication",
		atMs: params.scheduler.now(),
		everyMs: 6e4,
		run: () => reconcileGitHubPublications().catch(() => params.logWarning("GitHub publication recovery failed; will retry."))
	}));
	attachSessionChangeEventLifetime(params.gatewayRequestContext, () => params.publishSidecars({ stop: async () => {
		await params.flushPendingSessionsChangedEvents(params.gatewayRequestContext);
	} }));
}
//#endregion
//#region src/gateway/server-kernel-request-runtime.ts
/** Completes the socket-free request and internal-dispatch half of Gateway startup. */
async function prepareGatewayKernelRequestRuntime(params) {
	const { coreRuntime: runtime, log, logHealth } = params;
	const { minimalTestGateway, runtimeState, bindApprovalPublicationContext, startupTrace, workerPlacementRuntime, githubPublicationRuntime, pluginGatewayContext, getAttachedGatewayMethodRegistry, gatewayInstanceRuntimeRef, lifecycle, startupState, shutdownRuntime } = runtime;
	const chatMetadataLifecycle = await createGatewayChatMetadataLifecycle({
		getConfig: getRuntimeConfig,
		minimalTestGateway,
		log
	});
	const configRevisionProjector = await startupTrace.measure("gateway.config-revision-key", async () => {
		const { loadGatewayConfigRevisionProjector } = await import("./config-revision-token-BRtXfXtJ.mjs");
		return loadGatewayConfigRevisionProjector({ env: process.env });
	});
	const gatewayRequestContext = await startupTrace.measure("gateway.request-context", async () => {
		const { createGatewayRequestContext } = await import("./server-request-context-DSACcXuI.mjs");
		return createGatewayRequestContext({
			runtime,
			configRevisionProjector,
			chatMetadataLifecycle,
			log,
			logHealth
		});
	});
	const projectionReady = runtime.opts.updateCanary ? Promise.resolve(void 0) : startupTrace.measure("sessions.projection", async () => {
		const { createSessionRowProjection } = await import("./session-row-projection-D_MFzI5O.mjs");
		return createSessionRowProjection({
			cfg: getRuntimeConfig(),
			getConfig: getRuntimeConfig,
			getPolicyConfig: gatewayRequestContext.getCommittedRuntimeConfig ?? getRuntimeConfig,
			getModelCatalog: () => readPreparedServerMethodModelCatalogs(gatewayRequestContext, listAgentIds(getRuntimeConfig())),
			context: gatewayRequestContext,
			placementFactsReader: runtime.workerEnvironmentStartup?.placementStore
		});
	});
	const projectionLifetime = { closing: false };
	runtime.registerGatewayLifetimeSidecars({ stop: async () => {
		projectionLifetime.closing = true;
		retireQuestionChannelGateway(runtime.connectionWork.signal);
		closeGatewayDeviceRevocation(gatewayRequestContext);
		await gatewayRequestContext.scopeUpgradeCoordinator?.close();
		const projection = await projectionReady.catch(() => void 0);
		await shutdownRuntime.flushPendingSessionsChangedEvents(gatewayRequestContext);
		if (projection) await shutdownRuntime.drainSessionEventPublications(projection);
		projectionLifetime.detach?.();
		projection?.dispose();
	} });
	const projection = await projectionReady;
	if (projectionLifetime.closing) throw new Error("Gateway closed during session projection startup");
	if (projection) {
		projectionLifetime.detach = runtime.attachSessionRowProjection(projection);
		await projection.ensureMaterialized();
		if (projectionLifetime.closing) throw new Error("Gateway closed during session projection startup");
	}
	gatewayRequestContext.requestEntryLifetime = runtime.requestEntryLifetime;
	bindApprovalPublicationContext(gatewayRequestContext);
	if (!runtime.opts.updateCanary) await attachInitialGatewayLifetimeSidecars({
		scheduler: runtime.scheduler,
		chatMetadataLifecycle,
		gatewayRequestContext,
		flushPendingSessionsChangedEvents: shutdownRuntime.flushPendingSessionsChangedEvents,
		minimalTestGateway,
		logWarning: (message) => log.warn(message),
		...!workerPlacementRuntime && githubPublicationRuntime ? { reconcileGitHubPublications: githubPublicationRuntime.reconcilePublications } : {},
		publishSidecars: runtimeState.gatewayLifetimeSidecars.publish
	});
	pluginGatewayContext.current = gatewayRequestContext;
	gatewayRequestContext.dispatchHookAgentTurn = async (pluginId, hookParams) => {
		const transport = runtime.transportBridge.current();
		if (!transport) throw new Error("Gateway listener must start before plugin hook dispatch");
		return await transport.dispatchHookAgentTurn(pluginId, hookParams);
	};
	const { createGatewayInstanceRuntime } = await import("./server-instance-runtime-DBHYPeA3.mjs");
	const gatewayInstanceRuntime = createGatewayInstanceRuntime({
		getContext: () => gatewayRequestContext,
		getMethodRegistry: () => getAttachedGatewayMethodRegistry(),
		isDispatchAvailable: () => startupState.dispatchReady && !lifecycle.closePreludeStarted,
		logError: (message) => log.error(message),
		prepareRestartRecovery: runtime.channelManager.recoverAutostartSuppression
	});
	gatewayInstanceRuntimeRef.current = gatewayInstanceRuntime;
	gatewayRequestContext.resolveGatewayContext = () => gatewayInstanceRuntime.isAvailable() ? gatewayRequestContext : void 0;
	bindLegacyPluginSdkResourceHost(gatewayRequestContext.resolveGatewayContext, runtime.sdkResourceHost);
	bindGatewayContextResolver(gatewayRequestContext.resolveGatewayContext, runtime.resolvePluginGatewayContext);
	const hostLifecycle = params.hostLifecycle;
	if (hostLifecycle) gatewayRequestContext.hostLifecycle = {
		externalRestart: hostLifecycle.externalRestart,
		getShutdownBudget: () => hostLifecycle.getShutdownBudget?.(),
		request: (action, assertCaller) => hostLifecycle.request(action, () => {
			if (!gatewayInstanceRuntime.isAvailable()) throw new Error("Gateway lifecycle is unavailable for this closed instance. Reconnect and retry.");
			assertCaller();
		})
	};
	gatewayRequestContext.approvalEvents = gatewayInstanceRuntime.approvalEvents;
	gatewayRequestContext.recoveryRuntime = gatewayInstanceRuntime.recovery;
	bindGatewayContextResolver(gatewayInstanceRuntime.recovery, gatewayRequestContext.resolveGatewayContext);
	gatewayRequestContext.createAgentTurnFacade = gatewayInstanceRuntime.createAgentTurnFacade;
	return {
		...runtime,
		chatMetadataLifecycle,
		gatewayRequestContext,
		gatewayInstanceRuntime
	};
}
//#endregion
//#region src/gateway/server-cron-lazy.ts
/** Creates a cron state proxy that imports the real cron service on first use. */
function createLazyGatewayCronState(params) {
	const spawnBroker = getSpawnBroker();
	const runWithReadOnlyWorkers = captureSqliteReadOnlyWorkerScope();
	const env = params.env ?? process.env;
	const storePath = resolveCronJobsStorePathFromConfig(params.cfg, env);
	const cronEnabled = env.OPENCLAW_SKIP_CRON !== "1" && (params.cfg.cron?.enabled ?? true);
	let loaded = null;
	let stopped = false;
	let exitWatcherHandoff;
	let exitWatcherHandoffStop;
	let lifecycleGeneration = 0;
	let schedulingPaused = false;
	const schedulingResumeWaiters = /* @__PURE__ */ new Set();
	const releaseSchedulingResumeWaiters = () => {
		const waiters = Array.from(schedulingResumeWaiters);
		schedulingResumeWaiters.clear();
		for (const resolve of waiters) resolve();
	};
	const waitForSchedulingResume = async () => {
		if (!schedulingPaused) return;
		await new Promise((resolve) => {
			schedulingResumeWaiters.add(resolve);
		});
	};
	const cronStateLoader = createLazyPromiseLoader(() => import("./server-cron-Bc4tfTHW.mjs").then(({ buildGatewayCronService }) => {
		loaded = {
			state: runWithSpawnBroker(spawnBroker, () => runWithReadOnlyWorkers(() => buildGatewayCronService(params))),
			phase: "idle",
			startPromise: null,
			startGeneration: null,
			schedulingPaused: false,
			underlyingStartAttempted: false
		};
		if (schedulingPaused) {
			loaded.state.cron.pauseScheduling();
			loaded.schedulingPaused = true;
		}
		return loaded;
	}), { cacheRejections: true });
	const load = async () => {
		if (loaded) return loaded;
		return await cronStateLoader.load();
	};
	const bindCron = createLazyRuntimeMethodBinder(load);
	const stopResolvedCron = async (resolved) => {
		resolved.phase = "stopped";
		resolved.underlyingStartAttempted = false;
		if (exitWatcherHandoff) await (exitWatcherHandoffStop ??= exitWatcherHandoff.stopOwner());
		else if (resolved.state.cron.stopAndDrain) await resolved.state.cron.stopAndDrain();
		else {
			resolved.state.cron.stop();
			await resolved.state.stopStreamWatchers();
		}
	};
	const stopLoadedCronAndDrain = async (handoff) => {
		stopped = true;
		exitWatcherHandoff ??= handoff;
		lifecycleGeneration += 1;
		releaseSchedulingResumeWaiters();
		const loading = cronStateLoader.peek();
		const resolved = loaded ?? (loading ? await loading : null);
		if (resolved) await stopResolvedCron(resolved);
	};
	const cron = {
		async start() {
			stopped = false;
			const generation = lifecycleGeneration;
			const startCancelled = () => stopped || generation !== lifecycleGeneration;
			const resolved = await load();
			const hasStarted = () => resolved.phase === "started";
			if (startCancelled()) return;
			if (hasStarted()) return;
			if (resolved.startPromise) {
				const pendingGeneration = resolved.startGeneration;
				try {
					await resolved.startPromise;
				} catch (err) {
					if (pendingGeneration === generation) throw err;
				}
				if (startCancelled() || hasStarted()) return;
				if (pendingGeneration !== generation) {
					await cron.start();
					return;
				}
			}
			resolved.phase = "starting";
			resolved.startGeneration = generation;
			const startPromise = (async () => {
				await waitForSchedulingResume();
				if (startCancelled()) {
					resolved.phase = "stopped";
					return;
				}
				if (resolved.schedulingPaused) {
					resolved.state.cron.resumeScheduling();
					resolved.schedulingPaused = false;
				}
				resolved.underlyingStartAttempted = true;
				try {
					await resolved.state.cron.start();
				} catch (err) {
					resolved.phase = startCancelled() ? "stopped" : "idle";
					throw err;
				}
				if (startCancelled()) {
					await stopResolvedCron(resolved);
					return;
				}
				if (schedulingPaused) {
					resolved.state.cron.pauseScheduling();
					resolved.schedulingPaused = true;
				}
				try {
					if (resolved.state.cronEnabled) await Promise.all([resolved.state.reconcileExitWatchers(), resolved.state.reconcileStreamWatchers()]);
				} catch (err) {
					resolved.phase = startCancelled() ? "stopped" : "started";
					throw err;
				}
				if (startCancelled()) {
					await stopResolvedCron(resolved);
					return;
				}
				resolved.phase = "started";
			})();
			resolved.startPromise = startPromise;
			try {
				await startPromise;
			} finally {
				if (resolved.startPromise === startPromise) {
					resolved.startPromise = null;
					resolved.startGeneration = null;
				}
			}
		},
		stop() {
			stopped = true;
			lifecycleGeneration += 1;
			releaseSchedulingResumeWaiters();
			if (loaded) {
				loaded.phase = "stopped";
				loaded.underlyingStartAttempted = false;
				loaded.state.cron.stop();
				return;
			}
			const loading = cronStateLoader.peek();
			if (loading) loading.then((resolved) => {
				if (!stopped) return;
				resolved.phase = "stopped";
				resolved.underlyingStartAttempted = false;
				resolved.state.cron.stop();
			}).catch(() => {});
		},
		async stopAndDrain() {
			await stopLoadedCronAndDrain();
		},
		pauseScheduling() {
			schedulingPaused = true;
			if (loaded) {
				loaded.state.cron.pauseScheduling();
				loaded.schedulingPaused = true;
			}
		},
		resumeScheduling() {
			schedulingPaused = false;
			releaseSchedulingResumeWaiters();
			if (loaded && loaded.schedulingPaused && loaded.underlyingStartAttempted) {
				loaded.state.cron.resumeScheduling();
				loaded.schedulingPaused = false;
			}
		},
		getSuspensionBlockerCount() {
			const loadedBlockers = loaded?.state.cron.getSuspensionBlockerCount?.() ?? 0;
			return loaded?.phase === "starting" ? Math.max(1, loadedBlockers) : loadedBlockers;
		},
		status: bindCron(({ state }) => state.cron.status.bind(state.cron)),
		list: bindCron(({ state }) => state.cron.list.bind(state.cron)),
		listPage: bindCron(({ state }) => state.cron.listPage.bind(state.cron)),
		add: bindCron(({ state }) => state.cron.add.bind(state.cron)),
		update: bindCron(({ state }) => state.cron.update.bind(state.cron)),
		updateWithPrecondition: bindCron(({ state }) => state.cron.updateWithPrecondition.bind(state.cron)),
		remove: bindCron(({ state }) => state.cron.remove.bind(state.cron)),
		removeStaleJobFamily: bindCron(({ state }) => state.cron.removeStaleJobFamily.bind(state.cron)),
		async removeAgentJobsTransactional(agentId, commit) {
			return await (await load()).state.cron.removeAgentJobsTransactional(agentId, commit);
		},
		quiesceJobs: bindCron(({ state }) => state.cron.quiesceJobs.bind(state.cron)),
		run: bindCron(({ state }) => state.cron.run.bind(state.cron)),
		enqueueRun: bindCron(({ state }) => state.cron.enqueueRun.bind(state.cron)),
		waitForManualRun: bindCron(({ state }) => state.cron.waitForManualRun.bind(state.cron)),
		getJob(id) {
			return loaded?.state.cron.getJob(id);
		},
		readJob: bindCron(({ state }) => state.cron.readJob.bind(state.cron)),
		async readScratch(id, options) {
			options?.assertCurrent?.();
			const current = await load();
			options?.assertCurrent?.();
			return await current.state.cron.readScratch(id, options);
		},
		writeScratch: bindCron(({ state }) => state.cron.writeScratch.bind(state.cron)),
		getDefaultAgentId() {
			return loaded?.state.cron.getDefaultAgentId();
		},
		async prepareWake() {
			await load();
		},
		wake(opts) {
			if (!loaded) {
				load();
				return { ok: false };
			}
			return loaded.state.cron.wake(opts);
		}
	};
	return {
		cron,
		storePath,
		cronEnabled,
		prepareExitWatcherHandoff: async () => {
			const loading = cronStateLoader.peek();
			const handoff = await (loaded ?? (loading ? await loading : null))?.state.prepareExitWatcherHandoff?.();
			if (!handoff) return;
			return {
				...handoff,
				stopOwner: async () => {
					await stopLoadedCronAndDrain(handoff);
				}
			};
		},
		reconcileExitWatchers: bindCron(({ state }) => state.reconcileExitWatchers.bind(state)),
		reconcileStreamWatchers: bindCron(({ state }) => state.reconcileStreamWatchers.bind(state)),
		async stopStreamWatchers() {
			await loaded?.state.stopStreamWatchers();
		},
		reconcileSystemJobs: bindCron(({ state }) => state.reconcileSystemJobs.bind(state))
	};
}
//#endregion
//#region src/gateway/server-cron-reconciled.ts
function createGatewayCronReconciliation(params) {
	let activeAbortController;
	const supersedeActive = () => {
		activeAbortController?.abort();
		activeAbortController = void 0;
	};
	return {
		arm: ({ reason, config, cronState }) => {
			supersedeActive();
			const abortController = new AbortController();
			activeAbortController = abortController;
			const cron = cronState.cron;
			const event = {
				reason,
				enabled: cronState.cronEnabled
			};
			let completed = false;
			return { complete: async () => {
				if (completed) return;
				completed = true;
				if (params.isClosing() || abortController.signal.aborted) return;
				await params.runHook(event, {
					port: params.port,
					config,
					workspaceDir: params.workspaceDir,
					getCron: () => cron,
					abortSignal: abortController.signal
				});
			} };
		},
		invalidate: supersedeActive
	};
}
//#endregion
//#region src/gateway/server-sidecar-owners.ts
function createGatewaySidecarStopOwner() {
	let registered = /* @__PURE__ */ new Set();
	let activeStop = null;
	let failure;
	let phase = "open";
	let cleanupBudget;
	const remove = (sidecar) => {
		registered.delete(sidecar);
	};
	const publish = (...sidecars) => {
		if (phase === "sealed") throw new Error("cannot publish a Gateway sidecar after shutdown sealed its owner");
		for (const sidecar of sidecars) registered.add(sidecar);
		if (phase === "closing") stop().catch(() => {});
		return () => sidecars.forEach(remove);
	};
	const beginClose = () => {
		cleanupBudget ??= getProcessCleanupBudget();
		if (phase === "open") phase = "closing";
	};
	const stop = () => {
		beginClose();
		if (activeStop) return activeStop;
		const stopping = Promise.resolve().then(async () => {
			const failedSidecars = /* @__PURE__ */ new Set();
			failure = void 0;
			try {
				for (;;) {
					const sidecars = [...registered].filter((sidecar) => !failedSidecars.has(sidecar));
					if (sidecars.length === 0) break;
					sidecars.forEach(remove);
					let pending = sidecars;
					let results = [];
					for (let attempt = 0; attempt < 2; attempt += 1) {
						results = await Promise.allSettled(pending.map(async (sidecar) => await runWithProcessCleanupBudget(cleanupBudget, () => sidecar.stop())));
						pending = pending.filter((_sidecar, index) => results[index]?.status === "rejected");
						if (pending.length === 0) break;
					}
					sidecars.forEach(remove);
					if (pending.length > 0) {
						const rejected = results.find((result) => result.status === "rejected");
						failure ??= rejected?.reason instanceof Error ? rejected.reason : new Error(String(rejected?.reason));
						for (const sidecar of pending) failedSidecars.add(sidecar);
					}
				}
				if (failure) {
					registered = /* @__PURE__ */ new Set([...failedSidecars, ...registered]);
					throw failure;
				}
			} finally {
				activeStop = null;
			}
		});
		activeStop = stopping;
		stopping.catch(() => {});
		return stopping;
	};
	const sealAndJoin = async () => {
		for (let pending = activeStop; pending; pending = activeStop) try {
			await pending;
		} catch (error) {
			failure ??= error instanceof Error ? error : new Error(String(error));
		}
		phase = "sealed";
		if (failure || registered.size > 0) throw failure ?? /* @__PURE__ */ new Error("Gateway sidecar cleanup did not complete");
	};
	return {
		publish,
		remove,
		snapshot: () => [...registered],
		beginClose,
		stop,
		sealAndJoin
	};
}
//#endregion
//#region src/gateway/server-runtime-handles.ts
/** Creates gateway mutable state with inert handles that are safe to stop before startup finishes. */
function createGatewayServerMutableState() {
	return {
		discovery: null,
		maintenance: null,
		stopMediaCleanup: () => waitForMediaCleanupDrains({ timeoutMs: MEDIA_CLEANUP_STOP_TIMEOUT_MS }),
		heartbeatRunner: createNoopHeartbeatRunner(),
		stopDeliveryRecovery: async () => {},
		stopGatewayUpdateCheck: async () => {},
		tailscaleCleanup: null,
		postReadySidecars: createGatewaySidecarStopOwner(),
		gatewayLifetimeSidecars: createGatewaySidecarStopOwner(),
		skillsChangeUnsub: async () => {},
		channelHealthMonitor: null,
		configReloader: {
			stop: async () => {},
			applyPluginLifecycleChange: async () => {
				throw new Error("Plugin lifecycle is unavailable before Gateway startup completes.");
			},
			isConfigReloadSettled: () => false
		},
		reconcileAuditPolicy: null,
		agentUnsub: null,
		heartbeatUnsub: null,
		transcriptUnsub: null,
		lifecycleUnsub: null
	};
}
//#endregion
//#region src/gateway/server-live-state.ts
/** Creates gateway live state with fresh mutable runtime handles. */
function createGatewayServerLiveState(params) {
	return {
		...createGatewayServerMutableState(),
		hooksConfig: params.hooksConfig,
		hookClientIpConfig: params.hookClientIpConfig,
		cronState: params.cronState,
		controlUiSessionPullRequests: void 0,
		sessionViewerPresence: void 0,
		pluginServices: null,
		gatewayMethods: params.gatewayMethods
	};
}
//#endregion
//#region src/gateway/server-plugin-runtime-generation.ts
/** One Gateway owner fences every plugin publication across startup and hot replacement. */
function createGatewayPluginRuntimeGeneration(params) {
	let current;
	let latestReservation;
	let reloadStatus;
	let pending;
	const createClaim = () => {
		const claim = Object.freeze({
			isCurrent: () => current === claim && pending === void 0,
			waitForUnblocked: async () => {
				for (;;) {
					const reservation = pending;
					if (current !== claim || !reservation) return claim.isCurrent();
					await reservation.settled.promise;
				}
			},
			publish: (publication) => {
				if (!claim.isCurrent()) return false;
				publication();
				return true;
			}
		});
		return claim;
	};
	current = createClaim();
	return {
		getReloadStatus: () => reloadStatus,
		currentClaim: () => current,
		currentServices: () => params.getServices(),
		publishServices: (claim, services) => claim.publish(() => params.setServices(services)),
		reserve: () => {
			if (pending) throw new Error("a Gateway plugin runtime replacement is already pending");
			const reservation = {
				claim: createClaim(),
				settled: createDeferredCore()
			};
			const previousReloadStatus = reloadStatus;
			latestReservation = reservation.claim;
			pending = reservation;
			const settle = (accepted) => {
				if (pending !== reservation) return;
				if (accepted) current = reservation.claim;
				pending = void 0;
				reservation.settled.resolve();
			};
			return Object.freeze({
				claim: reservation.claim,
				commit: () => settle(true),
				reject: () => settle(false),
				setReloadStatus: (status) => {
					if (latestReservation === reservation.claim) reloadStatus = status;
				},
				finishReload: (outcome, pluginIds, registry, unavailablePluginIds, reportFailure) => {
					if (latestReservation !== reservation.claim) return;
					if (outcome === "unchanged") {
						reloadStatus = previousReloadStatus;
						return;
					}
					const restoredIds = outcome === "restored" ? new Set(registry.plugins.filter((record) => record.status === "loaded" && (record.format === "bundle" || getPluginInstance(record)?.acceptingCalls)).map((record) => record.id)) : pluginIds;
					const failedIds = new Set(previousReloadStatus?.phase === "failed" ? previousReloadStatus.pluginIds.filter((id) => !pluginIds.has(id) || !restoredIds.has(id)) : []);
					for (const id of pluginIds) if (outcome === "failed" || outcome === "restored" && unavailablePluginIds.has(id) && !restoredIds.has(id)) failedIds.add(id);
					reloadStatus = failedIds.size ? {
						phase: "failed",
						pluginIds: [...failedIds].toSorted(),
						reason: "Plugin activation or recovery failed. Retry openclaw plugins reload <id> after admitted work settles, or restart the Gateway. Inspect the Gateway log for the failure."
					} : void 0;
					if (outcome === "failed" && reloadStatus?.reason) reportFailure?.(reloadStatus.reason);
				}
			});
		}
	};
}
//#endregion
//#region src/gateway/server-qa-diagnostic-timings.ts
const QA_DIAGNOSTIC_ABORT_MS_ENV = "QA_DIAGNOSTIC_STUCK_SESSION_ABORT_MS";
const MIN_QA_DIAGNOSTIC_ABORT_MS = 3e4;
function resolveQaDiagnosticHeartbeatTimings(env) {
	if (env.OPENCLAW_ENABLE_PRIVATE_QA_CLI !== "1" || env.OPENCLAW_GATEWAY_HOST_LIFELINE?.trim() !== "stdin") return;
	const raw = env[QA_DIAGNOSTIC_ABORT_MS_ENV]?.trim();
	if (!raw || !/^\d+$/.test(raw)) return;
	const stuckSessionAbortMs = Number(raw);
	if (!Number.isSafeInteger(stuckSessionAbortMs) || stuckSessionAbortMs < MIN_QA_DIAGNOSTIC_ABORT_MS) return;
	return {
		stuckSessionWarnMs: Math.max(15e3, Math.floor(stuckSessionAbortMs / 2)),
		stuckSessionAbortMs
	};
}
//#endregion
//#region src/gateway/server-request-entry.ts
function isPendingNodeCompletion({ req, client, context }) {
	if (client?.connect.role !== "node" || !client.connId || !isRecord(req.params)) return false;
	const invokeId = req.method === "node.invoke.progress" ? req.params.invokeId : req.method === "node.invoke.result" ? req.params.id : void 0;
	return typeof invokeId === "string" && typeof req.params.nodeId === "string" && context.nodeRegistry.isInvokeCurrent(invokeId, req.params.nodeId, client.connId);
}
/** One Gateway's preparation leases; handler execution belongs to its existing runtime owner. */
var GatewayRequestEntryLifetime = class {
	constructor() {
		this.stopping = new AbortController();
		this.active = /* @__PURE__ */ new Set();
		this.sealed = false;
		this.signal = this.stopping.signal;
	}
	enter(options) {
		let released = false;
		const assertOpen = () => {
			if (released || this.sealed || this.signal.aborted && !isPendingNodeCompletion(options)) throw new Error("Gateway request entry is closed");
		};
		assertOpen();
		const settled = createDeferredCore();
		this.active.add(settled.promise);
		return {
			assertOpen,
			release: () => {
				if (released) return;
				released = true;
				this.active.delete(settled.promise);
				settled.resolve();
			}
		};
	}
	beginClose() {
		this.stopping.abort();
	}
	async waitForPendingEntries() {
		await Promise.all(this.active);
	}
	async sealAndJoin() {
		this.sealed = true;
		await this.waitForPendingEntries();
	}
};
//#endregion
//#region src/gateway/session-viewer-presence.ts
function normalizedSessionKeys(sessionKeys) {
	return [...new Set(sessionKeys.map((key) => key.trim()).filter(Boolean))].toSorted();
}
/** Owns one replace-set per websocket connection until empty declaration or disconnect. */
function createSessionViewerPresenceDeclarations(deps) {
	const declarations = /* @__PURE__ */ new Map();
	let stopped = false;
	const replace = (connId, sessionKeys) => {
		if (stopped) return [];
		const normalizedConnId = connId.trim();
		const client = deps.clients.getByConnectionId(normalizedConnId);
		if (!client || client.invalidated || client.socket.readyState !== 1) return [];
		const next = normalizedSessionKeys(sessionKeys);
		const previous = declarations.get(normalizedConnId) ?? [];
		if (previous.length === next.length && previous.every((key, index) => key === next[index])) return next;
		if (next.length === 0) declarations.delete(normalizedConnId);
		else declarations.set(normalizedConnId, next);
		if (client.presenceKey) {
			upsertPresence(client.presenceKey, { watchedSessions: next.length > 0 ? [...next] : void 0 });
			if (next.length > 0) recordClientPresenceActivity(deps.clients, client);
			deps.publishPresence();
		}
		return next;
	};
	const unsubscribe = (connId) => {
		const normalizedConnId = connId.trim();
		if (normalizedConnId) declarations.delete(normalizedConnId);
	};
	const stop = () => {
		stopped = true;
		declarations.clear();
	};
	return {
		replace,
		unsubscribe,
		stop
	};
}
//#endregion
//#region src/gateway/server-lifecycle.ts
async function prepareGatewayLifecycle(params) {
	const { runtime, port, log, logCron, shutdownRuntime } = params;
	const requestEntryLifetime = new GatewayRequestEntryLifetime();
	const { minimalTestGateway, transportBridge, sessionMessageSubscribers, isConnectionActive, clients, mentionInbox, broadcast, cfgAtStart, pluginRuntime, authRateLimiter, nodeReapprovalCoordinator, channelManager, deps, initialHooksConfig, initialHookClientIpConfig, runtimeStateRef, gatewayInstanceRuntimeRef, startupState, readinessEventLoopHealth, browserAuthRateLimiter, chatRunState, chatAbortControllers, chatQueuedTurns, removeChatRun, agentRunSeq, listActiveGatewayMethods, broadcastToConnIds, getBufferedAmount, sessionEventSubscribers, watchNodeRequestHandler, defaultWorkspaceDir, desktopSessionRegistry, nodeDesktopStreamBroker, bindDeviceNodeControl, bindWorkerNodeDesktopControl, workerPlacementRuntime, lifecycle } = runtime;
	const restartRecoveryCandidates = /* @__PURE__ */ new Map();
	const nodeDesktopServiceRef = {};
	const { createGatewayNodeSessionRuntime } = await import("./server-node-session-runtime-CqnqO3AZ.mjs");
	const { nodeWorkerSupervisorTransport, ...nodeRuntime } = createGatewayNodeSessionRuntime({
		broadcast,
		sessionEventSubscribers,
		sessionMessageSubscribers,
		listRegisteredNodePluginToolCommands: () => pluginRuntime.registry.nodeHostCommands,
		getConfig: getRuntimeConfig,
		onRunnerStateChanged: (nodeId, change) => {
			if (change.availabilityChanged) workerPlacementRuntime?.runnerAvailability.markChanged();
			if (change.inventoryChanged || change.availabilityChanged) workerPlacementRuntime?.scheduleNodeWorkspaceRetention(nodeId);
		},
		onPairingInvalidated: ({ nodeId, connId }) => {
			nodeDesktopServiceRef.current?.stopNode(nodeId);
			upsertPresence(nodeId, { reason: "disconnect" });
			commitPresence(nodeId, connId);
			runtime.publishPresence();
			removeRemoteNodeInfoForConnection(nodeId, connId);
		},
		onPairingGenerationChanged: ({ nodeId }) => {
			nodeDesktopServiceRef.current?.stopNode(nodeId);
		}
	});
	const { nodeRegistry, nodeSendToSession, nodeUnsubscribeAll } = nodeRuntime;
	const stopNodeConnectionNotifications = startNodeConnectionNotifications(nodeRegistry, runtime.scheduler);
	const nodeDesktopService = (await import("./node-source-hfOJbvLY.mjs")).createNodeDesktopService({
		getConfig: getRuntimeConfig,
		nodeRegistry,
		desktopRegistry: desktopSessionRegistry,
		streamBroker: nodeDesktopStreamBroker
	});
	nodeDesktopServiceRef.current = nodeDesktopService;
	workerPlacementRuntime?.bindNodeWorkerAvailability((nodeId, options) => waitForNodeWorkerSupervisor(nodeRegistry, nodeId, options));
	bindDeviceNodeControl?.(nodeWorkerSupervisorTransport);
	bindWorkerNodeDesktopControl?.(nodeWorkerSupervisorTransport);
	const { createWatchNodeHttpRuntime } = await import("./watch-node-http-DSxGu2Hj.mjs");
	const watchNodeHttpRuntime = createWatchNodeHttpRuntime({
		nodeRegistry,
		getConfig: getRuntimeConfig,
		broadcast,
		rateLimiter: authRateLimiter,
		nodeReapprovalCoordinator,
		onDeviceTokensReplaced: (deviceId, roles) => {
			const context = runtime.resolvePluginGatewayContext();
			if (!context) throw new Error("Gateway request context is unavailable during device setup");
			retireDeviceTokenClients(context, deviceId, roles, "device-token-rotated");
		},
		onNodeConnected: (session) => {
			upsertPresence(session.nodeId, {
				connectionId: session.connId,
				host: session.displayName ?? session.clientId ?? session.nodeId,
				clientId: session.clientId,
				ip: session.remoteIp,
				version: session.version,
				platform: session.platform,
				deviceFamily: session.deviceFamily,
				modelIdentifier: session.modelIdentifier,
				mode: session.clientMode,
				deviceId: session.nodeId,
				roles: ["node"],
				scopes: [],
				instanceId: session.nodeId,
				reason: "connect"
			}, { pending: false });
			runtime.publishPresence();
			recordRemoteNodeInfo({
				nodeId: session.nodeId,
				connId: session.connId,
				displayName: session.displayName,
				platform: session.platform,
				deviceFamily: session.deviceFamily,
				commands: session.commands,
				remoteIp: session.remoteIp,
				pairingGeneration: session.pairingGeneration
			});
		},
		onNodeDisconnected: (nodeId) => {
			upsertPresence(nodeId, { reason: "disconnect" });
			runtime.publishPresence();
			removeRemoteNodeInfo(nodeId);
			nodeUnsubscribeAll(nodeId);
			clearNodeWakeState(nodeId);
		},
		onError: (message, error) => log.warn(`${message}: ${String(error)}`)
	});
	watchNodeRequestHandler.current = watchNodeHttpRuntime.handleRequest;
	const { TerminalSessionManager, DEFAULT_TERMINAL_DETACH_SECONDS } = await import("./session-manager-KArgwyOG.mjs");
	const { createTerminalSessionTransport } = await import("./gateway-transport-BFWZ9htS.mjs");
	const terminalSessions = new TerminalSessionManager({
		...createTerminalSessionTransport(broadcastToConnIds, getBufferedAmount),
		detachGraceMs: (cfgAtStart.gateway?.terminal?.detachedSessionTimeoutSeconds ?? DEFAULT_TERMINAL_DETACH_SECONDS) * 1e3
	});
	applyGatewayLaneConcurrency(resolveGatewayLaneConcurrency(cfgAtStart), { gatewayStart: true });
	runtimeStateRef.current = createGatewayServerLiveState({
		hooksConfig: initialHooksConfig,
		hookClientIpConfig: initialHookClientIpConfig,
		cronState: createLazyGatewayCronState({
			scheduler: runtime.scheduler,
			cfg: cfgAtStart,
			deps,
			broadcast,
			resolveGatewayContext: runtime.resolvePluginGatewayContext,
			resolvePluginRegistry: () => pluginRuntime.registry
		}),
		gatewayMethods: listActiveGatewayMethods(pluginRuntime.baseGatewayMethods)
	});
	const runtimeState = runtimeStateRef.current;
	const pluginRuntimeGeneration = createGatewayPluginRuntimeGeneration({
		getServices: () => runtimeState.pluginServices,
		setServices: (services) => {
			runtimeState.pluginServices = services;
		}
	});
	const unavailableGatewayMethods = new Set(minimalTestGateway ? [] : STARTUP_UNAVAILABLE_GATEWAY_METHODS);
	const kernel = {
		pluginRuntimeGeneration,
		pluginMetadata: params.pluginMetadata,
		setDispatchReady: (ready) => {
			startupState.dispatchReady = ready;
		},
		markSidecarsReady: () => {
			startupState.sidecarsReady = true;
		},
		unlockStartupMethods: () => {
			for (const method of STARTUP_UNAVAILABLE_GATEWAY_METHODS) unavailableGatewayMethods.delete(method);
		},
		publishMethodSurface: (methods) => {
			runtimeState.gatewayMethods.splice(0, runtimeState.gatewayMethods.length, ...methods);
		},
		setEarlyRuntimeHandles: (handles) => {
			runtimeState.skillsChangeUnsub = handles.skillsChangeUnsub;
		},
		swapDiscovery: (next) => {
			const previous = runtimeState.discovery;
			runtimeState.discovery = next;
			return previous;
		},
		setScheduledServiceHandles: (handles) => {
			runtimeState.heartbeatRunner = handles.heartbeatRunner;
			runtimeState.stopDeliveryRecovery = handles.stopDeliveryRecovery;
		},
		setPostAttachHandles: (handles) => {
			runtimeState.stopGatewayUpdateCheck = handles.stopGatewayUpdateCheck;
		},
		setTailscaleCleanup: (cleanup) => {
			runtimeState.tailscaleCleanup = cleanup;
		},
		setConfigReloaderHandle: (configReloader) => {
			runtimeState.configReloader = configReloader;
		},
		getReloadState: () => ({
			hooksConfig: runtimeState.hooksConfig,
			hookClientIpConfig: runtimeState.hookClientIpConfig,
			heartbeatRunner: runtimeState.heartbeatRunner,
			cronState: runtimeState.cronState
		}),
		setReloadHookState: (next) => {
			runtimeState.hooksConfig = next.hooksConfig;
			runtimeState.hookClientIpConfig = next.hookClientIpConfig;
		},
		setHeartbeatRunner: (next) => {
			runtimeState.heartbeatRunner = next;
		},
		getCronService: () => runtimeState.cronState.cron,
		swapCronState: (next) => {
			const previous = runtimeState.cronState;
			runtimeState.cronState = next;
			deps.cron = next.cron;
			return previous;
		},
		setChannelHealthMonitor: (next) => {
			runtimeState.channelHealthMonitor = next;
		},
		applyPluginLifecycleChange: (change) => runtimeState.configReloader.applyPluginLifecycleChange(change),
		getConfigReloaderHotReloadStatus: () => runtimeState.configReloader.hotReloadStatus?.(),
		setMaintenanceHandles: (handles) => {
			runtimeState.maintenance = handles;
			runtimeState.stopMediaCleanup = handles.stopMediaCleanup;
		}
	};
	runtimeState.controlUiSessionPullRequests = createControlUiSessionPullRequestSubscriptions({
		scheduler: runtime.scheduler,
		getSessionRowProjection: runtime.getSessionRowProjection,
		broadcastToConnIds,
		isConnectionActive,
		prepareRead: async (connId, session) => {
			const client = clients.getByConnectionId(connId);
			return client ? await prepareControlUiSessionPrRead({
				client,
				...session,
				getRuntimeConfig,
				getSessionRowProjection: runtime.getSessionRowProjection,
				isCurrentClient: () => clients.getByConnectionId(connId) === client
			}) : void 0;
		}
	});
	runtimeState.sessionViewerPresence = createSessionViewerPresenceDeclarations({
		clients,
		publishPresence: runtime.publishPresence
	});
	deps.cron = runtimeState.cronState.cron;
	const pluginHostServices = { get cron() {
		return kernel.getCronService();
	} };
	const cronReconciliation = createGatewayCronReconciliation({
		port,
		workspaceDir: defaultWorkspaceDir,
		isClosing: () => lifecycle.closePreludeStarted,
		runHook: async (event, ctx) => {
			try {
				const hookRunner = (await import("./hooks-CPQpZQVr.mjs")).createHookRunner(pluginRuntime.registry);
				if (hookRunner.hasHooks("cron_reconciled")) await hookRunner.runCronReconciled(event, ctx);
			} catch (err) {
				logCron.error(`cron_reconciled hook failed: ${String(err)}`);
			}
		}
	});
	let deliveryRecoveryStopPromise = null;
	const stopDeliveryRecoveryForClose = () => deliveryRecoveryStopPromise ??= runtimeState.stopDeliveryRecovery();
	let mediaCleanupStopPromise = null;
	const stopMediaCleanupForClose = () => mediaCleanupStopPromise ??= runtimeState.stopMediaCleanup();
	const healthWork = new AsyncWorkScope();
	const markClosePreludeStarted = (options) => {
		if (lifecycle.closePreludeStarted) return params.pluginMetadata.beginClose();
		const prelude = params.pluginMetadata.beginClose();
		const notice = resolveGatewayShutdownNotice(options);
		lifecycle.closePreludeStarted = true;
		markGatewaySuspendExiting();
		authRateLimiter.dispose();
		browserAuthRateLimiter.dispose();
		runtime.scheduler.beginClose();
		runtimeState.maintenance?.stopPeriodicTasks();
		runtime.connectionWork.beginClose(notice.restartExpectedMs !== void 0 ? createAgentRunRestartAbortError() : void 0);
		requestEntryLifetime.beginClose();
		mentionInbox.dispose();
		healthWork.beginClose();
		broadcast("shutdown", notice);
		connectionDependentSidecarStopOwner.beginClose();
		stopDeliveryRecoveryForClose();
		stopMediaCleanupForClose();
		runtimeState.stopGatewayUpdateCheck().catch(() => {});
		runtimeState.controlUiSessionPullRequests?.stop();
		runtimeState.sessionViewerPresence?.stop();
		runtime.stopPresencePublications();
		kernel.setDispatchReady(false);
		gatewayInstanceRuntimeRef.current?.close();
		cronReconciliation.invalidate();
		return prelude;
	};
	let configReloaderStopPromise = null;
	const stopConfigReloaderForClose = () => configReloaderStopPromise ??= runtimeState.configReloader.stop();
	const beginClosePrelude = async (options) => {
		fenceSessionSuspensionWritesForGatewayShutdown();
		await markClosePreludeStarted(options);
		await Promise.all([
			requestEntryLifetime.waitForPendingEntries(),
			stopDeliveryRecoveryForClose(),
			stopMediaCleanupForClose(),
			runtimeState.stopGatewayUpdateCheck(),
			stopConfigReloaderForClose().catch(() => {}),
			runtimeState.maintenance?.stopPeriodicTasks().catch(() => {}),
			runtimeState.controlUiSessionPullRequests?.stop(),
			healthWork.drain(),
			mentionInbox.dispose()
		]);
	};
	const runClosePrelude = async () => {
		await beginClosePrelude();
		stopNodeConnectionNotifications();
		watchNodeHttpRuntime.close();
		await shutdownRuntime.runGatewayClosePrelude({
			stopDiagnostics: stopGatewayDiagnosticHeartbeat,
			skillsChangeUnsub: runtimeState.skillsChangeUnsub,
			disposeAuthRateLimiter: () => {
				authRateLimiter.dispose();
				nodeReapprovalCoordinator.dispose();
			},
			disposeBrowserAuthRateLimiter: () => browserAuthRateLimiter.dispose(),
			stopChannelHealthMonitor: async () => {
				const monitor = runtimeState?.channelHealthMonitor;
				monitor?.shutdown();
				await monitor?.waitForIdle();
			},
			stopReadinessEventLoopHealth: readinessEventLoopHealth.stop,
			closeMcpServer: shutdownRuntime.closeMcpLoopbackServer
		});
	};
	const { getRuntimeSnapshot, startChannels, startChannel, stopChannel, markChannelLoggedOut } = channelManager;
	const refreshGatewayHealthSnapshotWithRuntime = (optsResult) => {
		if (healthWork.isClosing) return Promise.reject(/* @__PURE__ */ new Error("Gateway health refresh owner is closed"));
		return healthWork.track(() => refreshGatewayHealthSnapshot({
			...optsResult,
			getRuntimeSnapshot,
			getEventLoopHealth: readinessEventLoopHealth.snapshot,
			getConfigReloaderHotReloadStatus: kernel.getConfigReloaderHotReloadStatus,
			getSessionRowProjection: runtime.getSessionRowProjection
		}));
	};
	const connectionDependentSidecarStopOwner = createGatewaySidecarStopOwner();
	const stopConnectionDependentSidecars = async () => {
		try {
			await connectionDependentSidecarStopOwner.stop();
		} finally {
			await connectionDependentSidecarStopOwner.sealAndJoin();
		}
	};
	const postReadySidecarStopOwner = runtimeState.postReadySidecars;
	const gatewayLifetimeSidecarStopOwner = runtimeState.gatewayLifetimeSidecars;
	const sealAndJoinRegisteredSidecarStops = async () => {
		const failure = (await Promise.allSettled([postReadySidecarStopOwner.sealAndJoin(), gatewayLifetimeSidecarStopOwner.sealAndJoin()])).find((result) => result.status === "rejected");
		if (failure) throw failure.reason;
	};
	const prepareClose = async (optsValue) => {
		await beginClosePrelude(optsValue);
		const preparation = await shutdownRuntime.prepareGatewayClose({
			resolveGatewayContext: runtime.resolvePluginGatewayContext,
			chatRunState,
			chatAbortControllers,
			chatQueuedTurns,
			restartRecoveryCandidates,
			removeChatRun,
			agentRunSeq,
			broadcast,
			nodeSendToSession: (sessionKey, event, payload, opts) => {
				nodeSendToSession(sessionKey, event, payload, opts);
			},
			resolveActiveSessionIdForKey: resolveActiveEmbeddedRunSessionId,
			markMainSessionsAbortedForRestart: async (restart) => {
				await shutdownRuntime.markRestartAbortedMainSessions({
					cfg: getRuntimeConfig(),
					...restart
				});
			},
			getPendingReplyCount: getTotalPendingReplies,
			updateCheckStop: runtimeState.stopGatewayUpdateCheck,
			configReloader: { stop: stopConfigReloaderForClose }
		}, optsValue);
		return async () => {
			const channelIds = listLoadedChannelPluginsForRegistry(pluginRuntime.registry).map((plugin) => plugin.id);
			const transport = transportBridge.current();
			const contextLifetime = getGatewayContextLifetime(runtime.resolvePluginGatewayContext);
			try {
				await transport?.portalService.closeAll();
			} finally {
				await withPluginRuntimeRegistryScope(pluginRuntime.registry, () => shutdownRuntime.completeGatewayClose({
					resolveGatewayContext: runtime.resolvePluginGatewayContext,
					closePluginRegistry: (onRetirement) => pluginRuntime.close(onRetirement),
					pluginMetadata: {
						beginClose: params.pluginMetadata.beginClose,
						close: async (...args) => {
							try {
								return await params.pluginMetadata.close(...args);
							} finally {
								contextLifetime.abort(/* @__PURE__ */ new Error("Gateway closed; plugin runtime unavailable."));
							}
						}
					},
					bonjourStop: kernel.swapDiscovery(null)?.stop ?? null,
					tailscaleCleanup: runtimeState.tailscaleCleanup,
					clearSecretsRuntimeSnapshot: clearSecretsRuntimeSnapshotState,
					channelIds,
					stopChannel,
					pluginServices: runtimeState.pluginServices,
					cron: runtimeState.cronState.cron,
					stopCronMaintenance: shutdownRuntime.stopCronMaintenance,
					heartbeatRunner: runtimeState.heartbeatRunner,
					maintenance: runtimeState.maintenance,
					stopMediaCleanup: stopMediaCleanupForClose,
					agentUnsub: runtimeState.agentUnsub,
					heartbeatUnsub: runtimeState.heartbeatUnsub,
					transcriptUnsub: runtimeState.transcriptUnsub,
					lifecycleUnsub: runtimeState.lifecycleUnsub,
					chatRunState,
					clients,
					finishRequestEntries: () => requestEntryLifetime.sealAndJoin(),
					drainSdkWork: () => params.sdkResourceHost.drainWork(),
					stopScheduler: () => runtime.scheduler.stop(),
					closeSdkResources: () => params.sdkResourceHost.close(),
					...transport ? {
						wss: transport.wss,
						httpServer: transport.httpServer,
						httpServers: transport.httpServers
					} : {},
					drainActiveSessionsForShutdown: shutdownRuntime.drainActiveSessionsForShutdown,
					disposeAllBundleLspRuntimes: shutdownRuntime.disposeAllBundleLspRuntimes,
					drainRetainedOpenAiEmbeddingProviders: shutdownRuntime.drainRetainedOpenAiEmbeddingProviders,
					stopGmailWatcher: shutdownRuntime.stopGmailWatcher,
					disposeAllCodeModeRuns: shutdownRuntime.disposeAllCodeModeRuns,
					closeProviderTransportDispatcherPool: shutdownRuntime.closeProviderTransportDispatcherPool
				}, preparation));
			}
			await requestEntryLifetime.sealAndJoin();
			await shutdownRuntime.waitForPluginCacheRetirement();
		};
	};
	const closeStepOwner = {
		connectionWork: runtime.connectionWork,
		stopConnectionDependentSidecars,
		stopRegisteredGatewayLifetimeSidecars: gatewayLifetimeSidecarStopOwner.stop,
		stopRegisteredPostReadySidecars: postReadySidecarStopOwner.stop,
		runClosePrelude,
		sealAndJoinRegisteredSidecarStops
	};
	const closeOnStartupFailure = async () => {
		runtime.startupTrace.close();
		await runGatewayCloseSteps({
			owner: closeStepOwner,
			close: await prepareClose({ reason: "gateway startup failed" }),
			onError: (message) => log.error(message)
		});
	};
	stopGatewayDiagnosticHeartbeat();
	const configureDiagnostics = (config) => {
		if (lifecycle.closePreludeStarted) return;
		const enabled = isDiagnosticsEnabled(config);
		setDiagnosticsEnabledForProcess(enabled);
		if (!enabled) {
			stopGatewayDiagnosticHeartbeat();
			return;
		}
		startGatewayDiagnosticHeartbeat(runtime.scheduler, void 0, {
			getConfig: getRuntimeConfig,
			startupGraceMs: 6e4,
			testTimings: resolveQaDiagnosticHeartbeatTimings(process.env),
			sampleLiveness: () => {
				const sample = readinessEventLoopHealth.persistentDegradationSnapshot();
				if (!sample || sample.degradedSinceMs == null) return null;
				return {
					reasons: sample.reasons,
					intervalMs: sample.intervalMs,
					degradedSinceMs: sample.degradedSinceMs,
					eventLoopDelayP99Ms: sample.delayP99Ms,
					eventLoopDelayMaxMs: sample.delayMaxMs,
					eventLoopUtilization: sample.utilization,
					cpuCoreRatio: sample.cpuCoreRatio
				};
			}
		});
	};
	configureDiagnostics(cfgAtStart);
	return {
		...runtime,
		...closeStepOwner,
		sdkResourceHost: params.sdkResourceHost,
		configureDiagnostics,
		requestEntryLifetime,
		subscribeSessionMessageEvents: sessionMessageSubscribers.subscribe,
		unsubscribeSessionMessageEvents: sessionMessageSubscribers.unsubscribe,
		restartRecoveryCandidates,
		...nodeRuntime,
		nodeDesktopService,
		watchNodeHttpRuntime,
		terminalSessions,
		runtimeState,
		unavailableGatewayMethods,
		kernel,
		pluginHostServices,
		shutdownRuntime,
		lifecycle,
		cronReconciliation,
		beginClosePrelude,
		getRuntimeSnapshot,
		startChannels,
		startChannel,
		stopChannel,
		markChannelLoggedOut,
		refreshGatewayHealthSnapshotWithRuntime,
		registerConnectionDependentSidecars: connectionDependentSidecarStopOwner.publish,
		unregisterConnectionDependentSidecar: connectionDependentSidecarStopOwner.remove,
		registerPostReadySidecars: postReadySidecarStopOwner.publish,
		registerGatewayLifetimeSidecars: gatewayLifetimeSidecarStopOwner.publish,
		prepareClose: async (options) => {
			const close = await params.sdkResourceHost.run(() => prepareClose(options));
			return () => params.sdkResourceHost.run(close);
		},
		closeOnStartupFailure: () => params.sdkResourceHost.run(closeOnStartupFailure)
	};
}
//#endregion
//#region src/gateway/node-reapproval-coordinator.ts
const pendingNodeReapprovalAttempts = new KeyedAsyncQueue();
function buildRequestFingerprint(input) {
	const permissions = input.permissions ? Object.fromEntries(Object.entries(input.permissions).toSorted(([left], [right]) => left.localeCompare(right))) : void 0;
	return JSON.stringify({
		nodeId: input.nodeId.trim(),
		clientId: input.clientId,
		clientMode: input.clientMode,
		displayName: input.displayName,
		platform: input.platform,
		version: input.version,
		coreVersion: input.coreVersion,
		uiVersion: input.uiVersion,
		deviceFamily: input.deviceFamily,
		modelIdentifier: input.modelIdentifier,
		caps: input.caps && normalizeSortedUniqueTrimmedStringList(input.caps),
		commands: input.commands && normalizeSortedUniqueTrimmedStringList(input.commands),
		permissions,
		remoteIp: input.remoteIp,
		silent: Boolean(input.silent)
	});
}
/** Creates the gateway-lifetime owner for paired-node reapproval write limits. */
function createNodeReapprovalCoordinator(config, { scheduler }) {
	const limiter = createGatewayAuthRateLimiter({
		...config,
		exemptLoopback: false
	}, {
		scheduler,
		id: "auth/node-reapproval"
	});
	const requestStates = /* @__PURE__ */ new Map();
	let disposed = false;
	const executeRequest = async ({ input, cleanupClaim, baseDir }) => {
		if (disposed) return null;
		const reused = await reusePendingNodePairingForReconnect(input, cleanupClaim, baseDir);
		if (reused) return reused;
		const nodeId = input.nodeId.trim();
		const identityKey = buildRateLimitIdentityKey("node", nodeId);
		if (!limiter.check(identityKey, "node-reapproval").allowed) return null;
		const result = await requestNodePairing(input, baseDir);
		limiter.recordFailure(identityKey, AUTH_RATE_LIMIT_SCOPE_NODE_REAPPROVAL);
		return result;
	};
	const enqueueRequest = (nodeId, state, initial) => {
		pendingNodeReapprovalAttempts.enqueue(`node-reapproval:${nodeId}`, async () => {
			const queued = initial ?? state.queued;
			if (!initial) state.queued = void 0;
			if (!queued) return;
			try {
				queued.deferred.resolve(await executeRequest(queued.params));
				for (const follower of queued.followers) follower.resolve(null);
			} catch (error) {
				queued.deferred.reject(error);
				for (const follower of queued.followers) follower.reject(error);
			} finally {
				if (requestStates.get(nodeId) === state && !state.queued) requestStates.delete(nodeId);
			}
		});
	};
	return {
		updateConfig: (next) => limiter.updateConfig({
			...next,
			exemptLoopback: false
		}),
		request(params) {
			if (disposed) return Promise.resolve(null);
			const nodeId = params.input.nodeId.trim();
			const fingerprint = buildRequestFingerprint(params.input);
			const state = requestStates.get(nodeId);
			if (!state) {
				const deferred = createDeferredCore();
				const nextState = {};
				requestStates.set(nodeId, nextState);
				enqueueRequest(nodeId, nextState, {
					fingerprint,
					params,
					deferred,
					followers: []
				});
				return deferred.promise;
			}
			if (state.queued?.fingerprint === fingerprint) {
				const follower = createDeferredCore();
				state.queued.params = params;
				state.queued.followers.push(follower);
				return follower.promise;
			}
			const deferred = createDeferredCore();
			if (state.queued) {
				state.queued.deferred.resolve(null);
				for (const follower of state.queued.followers) follower.resolve(null);
				state.queued = {
					fingerprint,
					params,
					deferred,
					followers: []
				};
			} else {
				state.queued = {
					fingerprint,
					params,
					deferred,
					followers: []
				};
				enqueueRequest(nodeId, state);
			}
			return deferred.promise;
		},
		async finalizeCleanup(claim) {
			return await pendingNodeReapprovalAttempts.enqueue(`node-reapproval:${claim.nodeId}`, async () => await finalizeNodePairingCleanupClaim(claim));
		},
		dispose() {
			disposed = true;
			for (const state of requestStates.values()) {
				state.queued?.deferred.resolve(null);
				for (const follower of state.queued?.followers ?? []) follower.resolve(null);
			}
			requestStates.clear();
			limiter.dispose();
		}
	};
}
//#endregion
//#region src/gateway/event-web-push.ts
const EVENT_PUSH_TTL_SECONDS = 300;
const defaultLog = createSubsystemLogger("gateway/web-push");
function resolveEventWebPushNotification(event, payload) {
	const value = isRecord(payload) ? payload : null;
	if (!value) return null;
	if (event === "question.requested") {
		const id = normalizeWebPushDisplayLabel(value.id) ?? "pending";
		const questionId = normalizeOptionalString(value.id);
		return {
			category: "agent-question",
			title: "OpenClaw needs an answer",
			body: "An agent has a question for you.",
			tag: `openclaw-question-${id}`,
			...questionId ? { path: `ask/${encodeURIComponent(questionId)}` } : {}
		};
	}
	if (event === "chat" && value.state === "final" && value.yielded !== true && !isTranscriptOnlyOpenClawAssistantMessage(value.message)) return {
		category: "agent-finished",
		title: "OpenClaw agent finished",
		body: "An agent completed its response.",
		tag: `openclaw-agent-finished-${normalizeWebPushDisplayLabel(value.runId) ?? "finished"}`
	};
	if (event === "cron" && value.action === "finished" && value.status === "error") {
		const job = isRecord(value.job) ? value.job : null;
		const jobId = normalizeOptionalString(value.jobId);
		const jobTag = normalizeWebPushDisplayLabel(jobId) ?? "failed";
		const jobName = normalizeWebPushDisplayLabel(job?.name);
		const query = new URLSearchParams();
		if (jobId) {
			query.set("job", jobId);
			const runId = normalizeOptionalString(value.runId) ?? (typeof value.runAtMs === "number" && Number.isSafeInteger(value.runAtMs) && value.runAtMs >= 0 ? createCronExecutionId(jobId, value.runAtMs) : void 0);
			if (runId) query.set("run", runId);
		}
		return {
			category: "scheduled-task-failed",
			title: "OpenClaw scheduled task failed",
			body: "A scheduled task needs attention.",
			...jobName ? { identifiedBody: `${jobName} needs attention.` } : {},
			tag: `openclaw-cron-failed-${jobTag}`,
			path: `automations${query.size ? `?${query}` : ""}`
		};
	}
	return null;
}
/** Routes attention events to offline browsers without expanding live session visibility. */
function createEventWebPushDelivery(params) {
	const log = params.log ?? defaultLog;
	const deliver = (notification, event, payload, opts, mention) => {
		(async () => {
			if (!await hasBoundWebPushSubscriptions(params.stateDir)) return;
			const sender = await prepareWebPushNotificationSender(params.stateDir);
			const agentId = normalizeOptionalString(opts?.agentId ?? (isRecord(payload) ? payload.agentId : void 0));
			const sessionKeys = opts?.sessionKeys ?? [];
			const groupedResults = await withCurrentWebPushAuthority({
				...params,
				sessionKeys,
				agentId,
				preparePublication: mention?.prepare
			}, (authority) => {
				const { cfg } = authority;
				const recipientProfileId = mention && authority.profile?.readCurrentIdentity(mention.recipientProfileId)?.profileId;
				if (mention && !recipientProfileId) return;
				const sessionKey = mention?.sessionKey ?? sessionKeys[0];
				const sessionPath = sessionKey ? buildControlUiSessionPath({
					namespace: "chat",
					sessionKey,
					fallbackAgentId: agentId,
					mainKey: cfg.session?.mainKey,
					exactKey: true
				}) : void 0;
				if (mention && !sessionPath) return;
				const path = notification.path ?? sessionPath?.slice(1) ?? "sessions";
				const url = resolveControlUiWebPushUrl(cfg, path);
				const targets = listCurrentWebPushTargets({
					...authority,
					requiredScopes: notification.category === "agent-question" ? [READ_SCOPE, QUESTIONS_SCOPE] : [READ_SCOPE],
					...mention ? { visibilityScopes: [ADMIN_SCOPE] } : {}
				});
				const agentLabel = normalizeWebPushDisplayLabel(agentId);
				const groups = /* @__PURE__ */ new Map();
				for (const target of targets) {
					if (mention && target.userProfileId !== recipientProfileId) continue;
					const { preferences } = target;
					if (!webPushCategoryEnabled(preferences, notification.category) || isWebPushQuietHours(preferences) || !webPushAgentAllowed(preferences, agentId)) continue;
					const client = webPushTargetClient(target);
					if (sessionKeys.length > 0 && !canReceiveSessionEvent({
						cfg,
						client,
						prepared: webPushSessionAccess(authority, client),
						sessionKeys,
						...agentId ? { agentId } : {},
						event,
						payload
					})) continue;
					if (cfg.gateway?.roles && sessionKeys.length === 0) continue;
					const title = `${preferences.label ? `${preferences.label} · ` : ""}${notification.title}`;
					const body = preferences.detailLevel === "private" ? notification.body : notification.identifiedBody ?? (agentLabel ? `${agentLabel}: ${notification.body}` : notification.body);
					const key = JSON.stringify({
						title,
						body
					});
					const group = groups.get(key) ?? {
						title,
						body,
						subscriptions: []
					};
					group.subscriptions.push(target.subscription);
					groups.set(key, group);
				}
				if (mention && !mention.isCurrent()) return;
				const topic = createHash("sha256").update(notification.tag).digest("base64url").slice(0, 32);
				return { start: () => Promise.all([...groups.values()].map((group) => sender({
					subscriptions: group.subscriptions,
					payload: {
						title: group.title,
						body: group.body,
						tag: notification.tag,
						renotify: false,
						url
					},
					deliveryOptions: {
						TTL: EVENT_PUSH_TTL_SECONDS,
						urgency: notification.category.includes("failed") ? "high" : "normal",
						topic
					}
				}))) };
			});
			if (!groupedResults) return;
			const results = groupedResults.flat();
			const failed = results.filter((result) => !result.ok).length;
			if (failed > 0) log.warn("event Web Push delivery failed", {
				category: notification.category,
				attempted: results.length,
				failed
			});
		})().catch(() => {
			log.warn("event Web Push delivery could not complete", { category: notification.category });
		});
	};
	return {
		handleEvent(event, payload, opts) {
			const notification = resolveEventWebPushNotification(event, payload);
			if (notification) deliver(notification, event, payload, opts);
		},
		deliverMention(mention) {
			const senderLabel = normalizeWebPushDisplayLabel(mention.senderLabel) ?? "Someone";
			const sessionTitle = normalizeWebPushDisplayLabel(mention.sessionTitle);
			const id = createHash("sha256").update(mention.id).digest("base64url");
			deliver({
				category: "human-mentioned",
				title: "OpenClaw mention",
				body: "Someone mentioned you in a conversation.",
				identifiedBody: `${senderLabel} mentioned you${sessionTitle ? ` in ${sessionTitle}` : ""}.`,
				tag: `openclaw-mention-${id}`
			}, "human-mentioned", void 0, {
				agentId: mention.agentId,
				sessionKeys: [mention.sessionKey]
			}, mention);
		}
	};
}
//#endregion
//#region src/plugins/compat/mention-inbox-deprecation.ts
function warnMentionInboxDeprecation(method) {
	const pluginId = pluginInstanceInvocation.getStore()?.instance.pluginId;
	warnSessionPersistenceDeprecation(`mentionInbox.${method}`, `mentionInbox.${method}Async`, pluginId === void 0 ? void 0 : { pluginId });
}
//#endregion
//#region src/gateway/human-mention-policy.ts
const MAX_DIRECTORY_PROFILES = 1e4;
function scopesAllowRead(scopes) {
	return roleScopesAllow({
		role: "operator",
		requestedScopes: [READ_SCOPE],
		allowedScopes: scopes
	});
}
/** UI labels are text, never identity or an email-address fallback. */
function humanMentionDisplayLabel(label, profileId) {
	const text = label?.replace(/[\p{Cc}\p{Cf}]/gu, " ").replace(/\s+/gu, " ").trim();
	return truncateUtf16Safe(text || `Person ${profileId.slice(0, 8)}`, 256);
}
function createHumanMentionPolicy(params) {
	let active = true;
	let profileVersion = -1;
	const displays = /* @__PURE__ */ new Map();
	let directory;
	let eligibleDirectory;
	function synchronizeProfileVersion() {
		const version = readUserProfileVersion();
		if (profileVersion !== version) {
			profileVersion = version;
			displays.clear();
			directory = void 0;
			eligibleDirectory = void 0;
		}
	}
	function needsDirectoryPreparation() {
		synchronizeProfileVersion();
		return active && !directory;
	}
	async function prepareDirectory() {
		if (!needsDirectoryPreparation()) return;
		const version = profileVersion;
		const prepared = await readUserProfileDirectory(MAX_DIRECTORY_PROFILES);
		if (active && version === readUserProfileVersion()) directory = prepared;
	}
	function readProfile(profileId) {
		synchronizeProfileVersion();
		let profile = displays.get(profileId);
		if (!profile) {
			profile = resolveCurrentUserProfileDisplay(profileId);
			pruneMapToMaxSize(displays, 9999);
			displays.set(profileId, profile);
		}
		return profile.kind === "resolved" ? profile : void 0;
	}
	function identify(client, cfg) {
		if (!client?.connect || client.invalidated === true || client.internal?.syntheticClient || (client.connect.role ?? "operator") !== "operator" || !scopesAllowRead(client.connect.scopes ?? [])) return err(errorShape(ErrorCodes.FORBIDDEN, "Human mentions require a signed-in operator."));
		const verifiedProfile = client.authenticatedUserProfile;
		if (!verifiedProfile?.profileId) return err(client.authenticatedGitHubIdentitySync ? authenticatedProfileUnavailableError() : errorShape(ErrorCodes.FORBIDDEN, "Human mentions require a verified user profile. Sign in to use mentions."));
		const profile = readProfile(verifiedProfile.profileId);
		if (!profile) return err(authenticatedProfileUnavailableError());
		const policy = resolveOperatorRolePolicyForProfile(profile.profileId, cfg);
		if (policy && !scopesAllowRead(policy.scopes)) return err(errorShape(ErrorCodes.FORBIDDEN, "Your operator role cannot read mentions."));
		const admin = client.connect.scopes?.includes("operator.admin") && (!policy || policy.scopes.includes("operator.admin"));
		const { entryFilter } = prepareSessionSharing({
			cfg,
			client: {
				connect: {
					...client.connect,
					scopes: admin ? [ADMIN_SCOPE] : [READ_SCOPE]
				},
				internal: { operatorRoleActor: {
					kind: "operator",
					profileId: profile.profileId
				} }
			}
		});
		return ok({
			profile,
			canRead: (target) => entryFilter?.(target.sessionKey, target.entry) ?? true
		});
	}
	function recipientProfile(profileId, target, cfg) {
		const profile = readProfile(profileId);
		if (!profile || target.entry.incognito === true || isIncognitoSessionKey(target.sessionKey)) return;
		const policy = resolveOperatorRolePolicyForProfile(profile.profileId, cfg);
		const scopes = policy?.scopes ?? ["operator.read"];
		if (!scopesAllowRead(scopes)) return;
		if (scopes.includes("operator.admin")) return profile;
		return createProfileSessionEntryFilter({
			profileId: profile.profileId,
			sessionCap: policy?.sessions.others
		})(target.sessionKey, target.entry) ? profile : void 0;
	}
	function resolveContext(client, input, cfg) {
		const identified = identify(client, cfg);
		if (!identified.ok) return identified;
		const requester = identified.value;
		if ("sessionKey" in input) {
			const agent = resolveRequestedSessionAgentId(cfg, input.sessionKey, input.agentId);
			if (!agent.ok) return err(agent.error);
			const resolved = resolveSessionSharingTarget({
				cfg,
				sessionKey: input.sessionKey,
				agentId: agent.agentId
			});
			const target = resolved && {
				agentId: resolved.agentId,
				sessionKey: resolved.canonicalKey,
				entry: {
					createdActor: resolved.entry.createdActor,
					visibility: resolved.entry.visibility,
					incognito: resolved.entry.incognito
				}
			};
			if (!target || !requester.canRead(target)) return err(errorShape(ErrorCodes.INVALID_REQUEST, "Session was not found."));
			return ok({
				target,
				profile: requester.profile
			});
		}
		const agent = resolveRequestedSessionAgentId(cfg, void 0, input.agentId);
		if (!agent.ok) return err(agent.error);
		const creationError = authorizeGatewaySessionCreation({
			cfg,
			profileId: requester.profile.profileId,
			agentId: agent.agentId
		});
		if (creationError) return err(creationError);
		const visibility = resolveSessionVisibility({ visibility: input.visibility });
		if (!isSessionVisibilityAllowed(cfg, visibility)) return err(errorShape(ErrorCodes.INVALID_REQUEST, "This session visibility is disabled."));
		return ok({
			profile: requester.profile,
			target: {
				agentId: agent.agentId,
				entry: {
					visibility,
					createdActor: resolveOperatorSessionCreation({ authenticatedUserProfile: requester.profile }).actor
				}
			}
		});
	}
	return {
		recordCommittedInvolvement(input) {
			const involvementConfig = params.getRuntimeConfig();
			const involvementTarget = resolveSessionSharingTarget({
				cfg: involvementConfig,
				sessionKey: input.sessionKey,
				agentId: input.agentId
			});
			if (involvementTarget?.entry.sessionId === input.sessionId && involvementTarget.entry.incognito !== true && !isIncognitoSessionKey(involvementTarget.canonicalKey)) {
				const sender = readProfile(input.senderProfileId);
				const mentionedProfiles = input.recipientProfileIds.flatMap((id) => {
					const recipient = recipientProfile(id, {
						agentId: involvementTarget.agentId,
						sessionKey: involvementTarget.canonicalKey,
						entry: involvementTarget.entry
					}, involvementConfig);
					return sender && recipient && sender.profileId !== recipient.profileId ? [recipient.profileId] : [];
				});
				updateSessionProfileInvolvement({
					agentId: involvementTarget.agentId,
					sessionKey: involvementTarget.storeKey,
					storePath: involvementTarget.storePath
				}, {
					expectedSessionId: input.sessionId,
					profileIds: mentionedProfiles,
					change: {
						kind: "mention",
						source: input.committedSource
					}
				});
			}
		},
		identify,
		prepareDirectory,
		needsDirectoryPreparation,
		readProfile,
		recipientProfile,
		invalidateDirectory() {
			eligibleDirectory = void 0;
		},
		dispose() {
			active = false;
			displays.clear();
			directory = void 0;
			eligibleDirectory = void 0;
		},
		mentionable(client, input) {
			const cfg = params.getRuntimeConfig();
			const context = resolveContext(client, input, cfg);
			if (!context.ok) return context;
			const { target, profile } = context.value;
			if (!directory) throw new Error("The mention directory has not been prepared.");
			const key = JSON.stringify([
				profileVersion,
				target,
				cfg.gateway?.roles
			]);
			if (eligibleDirectory?.key !== key) eligibleDirectory = {
				key,
				users: directory.profiles.flatMap(({ id, logins }) => {
					const candidate = recipientProfile(id, target, cfg);
					return candidate ? [{
						profileId: candidate.profileId,
						displayName: humanMentionDisplayLabel(candidate.label, candidate.profileId),
						avatarUrl: candidate.avatarUrl,
						logins,
						online: false
					}] : [];
				}),
				truncated: directory.truncated
			};
			const query = input.query?.trim().toLocaleLowerCase() ?? "";
			const users = eligibleDirectory.users.filter((candidate) => candidate.profileId !== profile.profileId && (!query || candidate.displayName.toLocaleLowerCase().includes(query) || candidate.logins.some((login) => login.toLocaleLowerCase().includes(query))));
			const names = /* @__PURE__ */ new Map();
			for (const candidate of users) names.set(candidate.displayName, (names.get(candidate.displayName) ?? 0) + 1);
			const online = /* @__PURE__ */ new Set();
			for (const connected of params.getClients()) {
				const id = connected.authenticatedUserProfile?.profileId;
				if (id && !connected.internal?.syntheticClient) {
					const current = readProfile(id);
					if (current) online.add(current.profileId);
				}
			}
			const projected = users.map((candidate) => ({
				profileId: candidate.profileId,
				displayName: (names.get(candidate.displayName) ?? 0) > 1 ? `${truncateUtf16Safe(candidate.displayName, 244)} (${candidate.profileId.slice(0, 8)})` : candidate.displayName,
				avatarUrl: candidate.avatarUrl,
				online: online.has(candidate.profileId)
			}));
			projected.sort((left, right) => Number(right.online) - Number(left.online) || left.displayName.localeCompare(right.displayName) || left.profileId.localeCompare(right.profileId));
			return ok({
				users: projected.slice(0, 100),
				truncated: eligibleDirectory.truncated || projected.length > 100
			});
		},
		validateRecipients(client, input, profileIds) {
			if (profileIds.length === 0) return ok([]);
			const cfg = params.getRuntimeConfig();
			const context = resolveContext(client, input, cfg);
			if (!context.ok) return context;
			const { target, profile } = context.value;
			const recipients = /* @__PURE__ */ new Set();
			for (const id of profileIds) {
				const candidate = recipientProfile(id, target, cfg);
				if (!candidate || candidate.profileId === profile.profileId || profileIds.length > 10) return err(errorShape(ErrorCodes.INVALID_REQUEST, "One or more mentioned people are unavailable. Select the recipients again."));
				recipients.add(candidate.profileId);
			}
			return ok([...recipients]);
		}
	};
}
//#endregion
//#region src/gateway/mention-inbox-input.ts
function hasValidMentionReferences(input) {
	const references = [
		input.sourceId,
		input.sessionId,
		input.messageId,
		input.senderProfileId,
		...input.recipientProfileIds
	];
	return input.recipientProfileIds.length <= 10 && input.sessionKey.length <= 512 && references.every((value) => Boolean(value) && value.length <= 256);
}
//#endregion
//#region src/gateway/mention-inbox-presentation.ts
function formatMentionSessionTitle(entry) {
	return truncateUtf16Safe((deriveSessionTitle(entry) ?? "Conversation").replace(/[\p{Cc}\p{Cf}]/gu, " ").replace(/\s+/gu, " ").trim(), 256) || "Conversation";
}
function formatMentionExcerpt(excerpt) {
	return excerpt ? truncateUtf16Safe(flattenMarkdownToPlainText(truncateUtf16Safe(excerpt, 2048)).replace(/[\p{Cc}\p{Cf}]/gu, " ").replace(/\s+/gu, " ").trim(), 280) : void 0;
}
function mentionInboxUnavailable(log) {
	log?.warn("The mention Inbox could not read or save its current state. Reconnect to retry.");
	return err(errorShape(ErrorCodes.UNAVAILABLE, "The mention Inbox is unavailable. Reconnect to retry.", { retryable: true }));
}
//#endregion
//#region src/gateway/mention-inbox-projection.ts
const MAX_GLOBAL_ITEMS = 1e4;
function createMentionProjection(snapshot) {
	const next = {
		head: { ...snapshot.head },
		items: /* @__PURE__ */ new Map(),
		itemsByProfile: /* @__PURE__ */ new Map(),
		processed: /* @__PURE__ */ new Map(),
		dirtySources: /* @__PURE__ */ new Set(),
		nextExpiryAt: Infinity,
		profileVersion: -1
	};
	for (const stored of snapshot.sources) {
		const source = {
			key: stored.key,
			sequence: stored.sequence,
			expiresAt: stored.expiresAt,
			recipients: /* @__PURE__ */ new Map()
		};
		next.processed.set(source.key, source);
		next.nextExpiryAt = Math.min(next.nextExpiryAt, source.expiresAt);
		for (const [profileId, id] of stored.recipients) {
			const item = id && stored.message ? {
				id,
				recipientProfileId: profileId,
				source,
				message: stored.message
			} : null;
			source.recipients.set(profileId, item);
			if (item) {
				next.items.set(item.id, item);
				indexMentionItem(next, item, false);
			}
		}
	}
	return next;
}
function createMentionMutationProjection(state, profileIds) {
	if (!profileIds) {
		const draft = createMentionProjection({
			head: state.head,
			sources: [...state.processed.values()].map(serializeMentionSource)
		});
		draft.profileVersion = state.profileVersion;
		return {
			draft,
			sourceIndex: draft.processed,
			itemLimit: MAX_GLOBAL_ITEMS,
			publish(head) {
				draft.head = head;
				draft.dirtySources.clear();
				return draft;
			}
		};
	}
	const draft = {
		...state,
		head: { ...state.head },
		processed: /* @__PURE__ */ new Map(),
		items: /* @__PURE__ */ new Map(),
		itemsByProfile: /* @__PURE__ */ new Map(),
		dirtySources: /* @__PURE__ */ new Set()
	};
	const include = (item) => {
		if (draft.items.has(item.id)) return;
		let source = draft.processed.get(item.source.key);
		if (!source) {
			source = {
				...item.source,
				recipients: new Map(item.source.recipients)
			};
			draft.processed.set(source.key, source);
		}
		const copy = {
			...item,
			source
		};
		source.recipients.set(item.recipientProfileId, copy);
		draft.items.set(item.id, copy);
		indexMentionItem(draft, copy, false);
	};
	const oldest = state.items.values();
	for (let index = 0; index < 10; index++) {
		const item = oldest.next().value;
		if (!item) break;
		include(item);
	}
	for (const profileId of profileIds) for (const item of state.itemsByProfile.get(profileId) ?? []) include(item);
	const omittedItems = state.items.size - draft.items.size;
	return {
		draft,
		sourceIndex: state.processed,
		itemLimit: MAX_GLOBAL_ITEMS - omittedItems,
		publish(head) {
			for (const key of draft.dirtySources) {
				const incoming = draft.processed.get(key);
				const previous = state.processed.get(key);
				if (previous) {
					for (const [profileId, item] of previous.recipients) if (item && incoming?.recipients.get(profileId)?.id !== item.id) removeMentionItem(state, item);
				}
				if (!incoming) {
					state.processed.delete(key);
					continue;
				}
				const source = previous ?? incoming;
				const recipients = /* @__PURE__ */ new Map();
				for (const [profileId, item] of incoming.recipients) {
					const retained = previous?.recipients.get(profileId);
					if (item && retained?.id === item.id) recipients.set(profileId, retained);
					else {
						recipients.set(profileId, item);
						if (item) {
							item.source = source;
							state.items.set(item.id, item);
							indexMentionItem(state, item, false);
						}
					}
				}
				source.recipients = recipients;
				source.sequence = incoming.sequence;
				source.expiresAt = incoming.expiresAt;
				state.processed.set(key, source);
			}
			state.head = head;
			state.nextExpiryAt = draft.nextExpiryAt;
			state.profileVersion = draft.profileVersion;
			state.dirtySources.clear();
			return state;
		}
	};
}
function serializeMentionSource(source) {
	const message = [...source.recipients.values()].find((item) => item !== null)?.message;
	return {
		key: source.key,
		sequence: source.sequence,
		expiresAt: source.expiresAt,
		recipients: [...source.recipients].map(([profileId, item]) => [profileId, item?.id ?? null]),
		...message ? { message } : {}
	};
}
function removeMentionItem(draft, item) {
	const { items, itemsByProfile, dirtySources } = draft;
	if (!item || !items.delete(item.id)) return;
	const profileItems = itemsByProfile.get(item.recipientProfileId);
	profileItems?.delete(item);
	if (profileItems?.size === 0) itemsByProfile.delete(item.recipientProfileId);
	item.source.recipients.set(item.recipientProfileId, null);
	dirtySources.add(item.source.key);
}
function trimMentionItems(draft, retained, limit) {
	const oldest = retained.values();
	while (retained.size > limit) removeMentionItem(draft, oldest.next().value);
}
function indexMentionItem(draft, item, trim = true) {
	const { itemsByProfile } = draft;
	const retained = itemsByProfile.get(item.recipientProfileId) ?? /* @__PURE__ */ new Set();
	retained.add(item);
	itemsByProfile.set(item.recipientProfileId, retained);
	if (trim) trimMentionItems(draft, retained, 100);
}
function expireMentionItems(draft, now) {
	const { processed, dirtySources, nextExpiryAt } = draft;
	if (now < nextExpiryAt) return;
	let next = Infinity;
	for (const [key, source] of processed) {
		if (source.expiresAt > now) {
			next = Math.min(next, source.expiresAt);
			continue;
		}
		for (const item of source.recipients.values()) removeMentionItem(draft, item);
		processed.delete(key);
		dirtySources.add(key);
	}
	draft.nextExpiryAt = next;
}
function reconcileMentionProfiles(draft, version, canonicalProfileId) {
	const { processed, dirtySources, items, itemsByProfile } = draft;
	if (version === draft.profileVersion) return;
	draft.profileVersion = version;
	for (const source of processed.values()) {
		const recipients = /* @__PURE__ */ new Map();
		for (const [profileId, item] of source.recipients) {
			const canonical = canonicalProfileId(profileId);
			if (canonical !== profileId || recipients.has(canonical)) dirtySources.add(source.key);
			if (!recipients.has(canonical)) {
				recipients.set(canonical, item);
				if (item) item.recipientProfileId = canonical;
				continue;
			}
			const previous = recipients.get(canonical);
			if (item === null && previous) {
				items.delete(previous.id);
				recipients.set(canonical, null);
			} else if (item) items.delete(item.id);
		}
		source.recipients = recipients;
	}
	itemsByProfile.clear();
	for (const item of items.values()) indexMentionItem(draft, item);
}
//#endregion
//#region src/gateway/mention-inbox-recording.ts
const log$6 = createSubsystemLogger("gateway/mentions");
function createMentionInputRecorder(params) {
	const { policy } = params;
	return function applyCommittedInput(input, draft, guards, bounds) {
		const { processed, head, dirtySources, items } = draft;
		const cfg = params.getRuntimeConfig();
		const resolved = resolveSessionSharingTarget({
			cfg,
			sessionKey: input.sessionKey,
			agentId: input.agentId
		});
		if (!resolved || resolved.entry.sessionId !== input.sessionId || resolved.entry.incognito === true || isIncognitoSessionKey(resolved.canonicalKey)) {
			log$6.debug("Skipped mention delivery because its committed session changed.");
			return [];
		}
		guards.push(() => {
			const current = resolveSessionSharingTarget({
				cfg: params.getRuntimeConfig(),
				sessionKey: input.sessionKey,
				agentId: input.agentId
			});
			if (!current || current.entry.sessionId !== input.sessionId || current.entry.incognito === true || current.canonicalKey !== resolved.canonicalKey || current.storePath !== resolved.storePath || current.entry.visibility !== resolved.entry.visibility) throw new Error("Committed mention session changed before commit");
		});
		const sourceKey = createHash("sha256").update(JSON.stringify([
			resolved.agentId,
			resolved.canonicalKey,
			input.sessionId,
			input.sourceId
		])).digest("hex");
		if (bounds.sourceIndex.has(sourceKey)) return [];
		if (bounds.sourceIndex.size >= 1e4) {
			params.onCapacityReached();
			return [];
		}
		const now = params.now();
		const source = {
			key: sourceKey,
			sequence: head.nextSequence++,
			expiresAt: now + MENTION_RETENTION_MS,
			recipients: /* @__PURE__ */ new Map()
		};
		processed.set(sourceKey, source);
		dirtySources.add(sourceKey);
		draft.nextExpiryAt = Math.min(draft.nextExpiryAt, source.expiresAt);
		const sender = policy.readProfile(input.senderProfileId);
		const target = {
			agentId: resolved.agentId,
			sessionKey: resolved.canonicalKey,
			entry: resolved.entry
		};
		const excerpt = formatMentionExcerpt(input.excerpt);
		const message = {
			sessionId: input.sessionId,
			content: {
				senderProfileId: sender?.profileId ?? input.senderProfileId,
				sessionKey: target.sessionKey,
				agentId: target.agentId,
				messageId: input.messageId,
				createdAt: now,
				...excerpt ? { excerpt } : {}
			}
		};
		const created = [];
		let unavailableRecipients = 0;
		for (const profileId of input.recipientProfileIds) {
			const recipient = policy.recipientProfile(profileId, target, cfg);
			const canonicalId = recipient?.profileId ?? profileId;
			if (source.recipients.has(canonicalId)) continue;
			source.recipients.set(canonicalId, null);
			if (!sender || !recipient || sender.profileId === recipient.profileId) {
				unavailableRecipients += 1;
				continue;
			}
			const item = {
				id: randomUUID(),
				recipientProfileId: recipient.profileId,
				source,
				message
			};
			items.set(item.id, item);
			source.recipients.set(recipient.profileId, item);
			indexMentionItem(draft, item);
			trimMentionItems(draft, items, bounds.itemLimit);
			created.push(item);
		}
		if (unavailableRecipients > 0) log$6.debug(`Skipped ${unavailableRecipients} unavailable mention recipients for committed input.`);
		return created;
	};
}
//#endregion
//#region src/gateway/mention-inbox-worker.ts
async function readMentionSnapshot(context, revision) {
	const reply = await executeExistingOpenClawStateRead({
		path: context.admission.databasePath,
		env: context.environment
	}, {
		type: "mentions.snapshot",
		input: revision
	}, {
		context,
		current: true
	});
	context.admission.assertCurrent();
	if (!reply) return revision === 0 ? void 0 : {
		head: {
			revision: 0,
			nextSequence: 0
		},
		sources: []
	};
	if (!reply.ok) {
		const error = new Error(reply.message);
		retainOpenClawStateWorkerErrorPayload(error, reply.error);
		throw hydrateOpenClawStateWorkerError(error, { includeOrdinary: true });
	}
	if (reply.type !== "mentions.snapshot") throw new Error("Unexpected Mention Inbox snapshot reply");
	return reply.snapshot;
}
async function commitMentionChanges(context, input, assertCurrent) {
	const captured = structuredClone(input);
	let admission;
	try {
		return await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
			type: "mentions.mutate",
			input: captured
		}), {
			assertCurrent,
			createAdmission: () => {
				admission = createSqliteWorkerOperationAdmission((_request, grant) => {
					context.admission.assertCurrent();
					assertCurrent();
					grant();
				});
				return {
					admission,
					nativeLocations: [context.admission.databasePath]
				};
			}
		});
	} catch (error) {
		const facts = admission?.committed?.facts;
		if (isRecord(facts) && facts.kind === "committed" && isRecord(facts.head) && facts.head.revision === captured.expectedHead.revision + (captured.changes.length ? 1 : 0) && facts.head.nextSequence === captured.nextSequence) return {
			kind: "committed",
			head: {
				revision: facts.head.revision,
				nextSequence: facts.head.nextSequence
			}
		};
		throw error;
	}
}
//#endregion
//#region src/gateway/mention-inbox.native.ts
function mutateNativeMentionSnapshot(context, params) {
	context.admission.assertCurrent();
	return runWithSqliteWorkerStateContext(context, () => runOpenClawStateWriteTransaction(({ db }) => {
		const snapshot = readMentionStoreSnapshot(-1, db);
		if (!snapshot) throw new Error("Mention snapshot is unavailable inside its transaction");
		const draft = createMentionProjection(snapshot);
		expireMentionItems(draft, params.now());
		reconcileMentionProfiles(draft, readUserProfileVersion(), params.canonicalProfileId);
		params.apply(draft);
		const changes = new Map([...draft.dirtySources].map((key) => {
			const source = draft.processed.get(key);
			return [key, source ? serializeMentionSource(source) : void 0];
		}));
		draft.head = writeMentionStoreChanges(db, draft.head, changes);
		draft.dirtySources.clear();
		stageSqliteTransactionState(db, {
			stage: () => {},
			rollback: () => {},
			commit: () => params.publish(draft),
			prepareObservers: params.notify
		});
		return draft;
	}, {
		path: context.admission.databasePath,
		env: context.environment
	}, { operationLabel: "mentions.sdk.write" }));
}
//#endregion
//#region src/gateway/mention-inbox.ts
const log$5 = createSubsystemLogger("gateway/mentions");
/** Durable sources own retention and replay; each Gateway keeps disposable projection indexes. */
function createMentionInbox(params) {
	const scheduler = params.scheduler.scope();
	const policy = createHumanMentionPolicy(params);
	const context = captureOpenClawStateWorkerContext();
	const acceptedWork = new AsyncWorkScope();
	let state = createMentionProjection({
		head: {
			revision: -1,
			nextSequence: 0
		},
		sources: []
	});
	let tail = Promise.resolve();
	let closing = false;
	let needsSynchronization = true;
	let nativeRevision = 0;
	let sessionRevision = 0;
	const views = /* @__PURE__ */ new WeakMap();
	const connectedTargets = /* @__PURE__ */ new Map();
	let targetConfig;
	let capacityReported = false;
	let profileInvalidationPending = false;
	const applyCommittedInput = createMentionInputRecorder({
		getRuntimeConfig: () => params.getRuntimeConfig(),
		now: scheduler.now,
		policy,
		onCapacityReached() {
			if (!capacityReported) {
				log$5.warn("Mention retention reached its replay budget; new mention alerts are skipped until retained sources expire.");
				capacityReported = true;
			}
		}
	});
	function assertActive() {
		if (closing || scheduler.signal.aborted) throw new Error("Mention Inbox is closed");
		context.admission.assertCurrent();
	}
	async function enqueue(operation) {
		assertActive();
		const pending = acceptedWork.track(() => tail.then(() => {
			context.admission.assertCurrent();
			return operation();
		}));
		tail = pending.then(() => void 0, () => void 0);
		return await pending;
	}
	async function synchronize() {
		for (;;) {
			context.admission.assertCurrent();
			const revision = nativeRevision;
			const snapshot = await readMentionSnapshot(context, needsSynchronization ? -1 : state.head.revision);
			context.admission.assertCurrent();
			if (revision !== nativeRevision) continue;
			if (snapshot) state = createMentionProjection(snapshot);
			needsSynchronization = false;
			return Boolean(snapshot);
		}
	}
	async function mutate(operation, selectProfiles) {
		try {
			await synchronize();
			for (;;) {
				const revision = nativeRevision;
				const expectedHead = { ...state.head };
				const now = scheduler.now();
				const maintenance = now >= state.nextExpiryAt || state.profileVersion !== readUserProfileVersion();
				const prepared = createMentionMutationProjection(state, maintenance ? void 0 : selectProfiles?.());
				const { draft } = prepared;
				expireMentionItems(draft, now);
				if (prepared.sourceIndex.size < 1e4) capacityReported = false;
				reconcileMentionProfiles(draft, readUserProfileVersion(), (id) => policy.readProfile(id)?.profileId ?? id);
				const guards = [];
				const result = operation(draft, guards, prepared);
				const profiles = readUserProfileVersion();
				const access = readGatewayAccessRevision();
				const sessions = sessionRevision;
				const config = params.getRuntimeConfig();
				const assertCurrent = () => {
					context.admission.assertCurrent();
					if (profiles !== readUserProfileVersion() || access !== readGatewayAccessRevision() || sessions !== sessionRevision || config !== params.getRuntimeConfig()) throw new Error("Mention authority changed before commit");
					for (const guard of guards) guard();
				};
				const receipt = await commitMentionChanges(context, {
					expectedHead,
					nextSequence: draft.head.nextSequence,
					changes: [...draft.dirtySources].map((key) => {
						const source = draft.processed.get(key);
						return [key, source ? serializeMentionSource(source) : void 0];
					})
				}, assertCurrent);
				if (receipt.kind === "conflict") {
					context.admission.assertCurrent();
					if (revision === nativeRevision) state = createMentionProjection(receipt.snapshot);
					else await synchronize();
					continue;
				}
				context.admission.assertCurrent();
				if (revision === nativeRevision) {
					state = prepared.publish(receipt.head);
					needsSynchronization = false;
				} else await synchronize();
				return result;
			}
		} catch (error) {
			needsSynchronization = true;
			throw error;
		}
	}
	async function maintain() {
		const changed = await synchronize();
		const maintenance = scheduler.now() >= state.nextExpiryAt || state.profileVersion !== readUserProfileVersion();
		if (maintenance) await mutate(() => void 0);
		return changed || maintenance;
	}
	function currentTarget(item, cfg, targets, projection = state) {
		const { source, message } = item;
		const { agentId, sessionKey, senderProfileId } = message.content;
		if (projection.items.get(item.id) !== item || source.expiresAt <= scheduler.now()) return;
		const key = JSON.stringify([agentId, sessionKey]);
		let resolved = targets?.get(key)?.target;
		if (resolved === void 0) {
			resolved = resolveSessionSharingTarget({
				cfg,
				sessionKey,
				agentId
			});
			if (targets?.size === 1e4) targets.clear();
			targets?.set(key, {
				sessionKey,
				target: resolved
			});
		}
		if (!resolved || resolved.entry.sessionId !== message.sessionId) return;
		const target = {
			agentId: resolved.agentId,
			sessionKey: resolved.canonicalKey,
			entry: resolved.entry
		};
		const recipient = policy.recipientProfile(item.recipientProfileId, target, cfg);
		const sender = policy.readProfile(senderProfileId);
		return recipient && recipient.profileId !== sender?.profileId ? {
			target,
			recipient,
			sender
		} : void 0;
	}
	function projectItem(item, current) {
		const { content } = item.message;
		return {
			...content,
			id: item.id,
			expiresAt: item.source.expiresAt,
			senderProfileId: current.sender?.profileId ?? content.senderProfileId,
			senderLabel: humanMentionDisplayLabel(current.sender?.label, content.senderProfileId),
			...current.sender ? { senderAvatarUrl: current.sender.avatarUrl } : {},
			sessionTitle: formatMentionSessionTitle(current.target.entry)
		};
	}
	function readView(client, cfg = params.getRuntimeConfig(), remember = true, targets = /* @__PURE__ */ new Map(), projection = state) {
		const identified = policy.identify(client, cfg);
		if (!identified.ok) return identified;
		const requester = identified.value;
		const visible = [];
		const profileItems = projection.itemsByProfile.get(requester.profile.profileId);
		for (const item of [...profileItems ?? []].toReversed()) {
			const current = currentTarget(item, cfg, targets, projection);
			if (current && requester.canRead(current.target)) visible.push(projectItem(item, current));
		}
		const signature = createHash("sha256").update(JSON.stringify([requester.profile.profileId, visible])).digest("hex");
		const previous = client && views.get(client);
		const revision = previous ? previous.revision + Number(signature !== previous.signature) : 0;
		if (client && remember) views.set(client, {
			signature,
			revision
		});
		return ok({
			gatewayInstanceId: params.gatewayInstanceId,
			revision,
			items: visible
		});
	}
	function refreshConnectedViews() {
		if (scheduler.signal.aborted) return;
		const cfg = params.getRuntimeConfig();
		if (targetConfig !== cfg) {
			connectedTargets.clear();
			targetConfig = cfg;
		}
		for (const client of params.getClients()) {
			if (!client.connId) continue;
			const previous = views.get(client);
			const result = readView(client, cfg, true, connectedTargets);
			if (!result.ok || (previous ? previous.revision === result.value.revision : result.value.items.length === 0)) continue;
			params.broadcastToConnIds("mentions.changed", {
				gatewayInstanceId: params.gatewayInstanceId,
				revision: result.value.revision
			}, /* @__PURE__ */ new Set([client.connId]));
		}
	}
	function scheduleExpiry(retryAfterMs) {
		if (closing || scheduler.signal.aborted || state.processed.size === 0 && retryAfterMs === void 0) return;
		scheduler.schedule({
			id: `mentions:expiry:${params.gatewayInstanceId}`,
			mode: "earliest",
			...retryAfterMs === void 0 ? { atMs: state.nextExpiryAt } : { delayMs: retryAfterMs },
			run: refresh
		});
	}
	async function refresh() {
		if (closing || scheduler.signal.aborted) return;
		try {
			await enqueue(async () => {
				await maintain();
				context.admission.assertCurrent();
				refreshConnectedViews();
				scheduleExpiry();
			});
		} catch {
			log$5.warn("Unable to refresh the mention Inbox; current reads will retry.");
			scheduleExpiry(6e4);
		}
	}
	function invalidateTargets(sessionKey) {
		if (!sessionKey) {
			connectedTargets.clear();
			return;
		}
		for (const [key, cached] of connectedTargets) if (cached.sessionKey === sessionKey || cached.target?.storeKeys.includes(sessionKey)) connectedTargets.delete(key);
	}
	function invalidateAsync(sessionKey) {
		invalidateTargets(sessionKey);
		policy.invalidateDirectory();
		return refresh();
	}
	const stopRows = sessionChanges.subscribeFacts((change) => {
		if (!("facts" in change) || !change.facts || ![
			"participants",
			"category",
			"owner",
			"unchanged"
		].includes(change.facts.kind) || change.factsInvalidated) sessionRevision++;
		invalidateTargets("sessionKey" in change ? change.sessionKey : void 0);
	});
	const stopProfiles = onUserProfilesChanged(() => {
		if (profileInvalidationPending) return;
		profileInvalidationPending = true;
		queueMicrotask(() => {
			profileInvalidationPending = false;
			invalidateAsync();
		});
	});
	const stopSessions = onSessionIdentityMutation(() => {
		sessionRevision++;
		invalidateAsync();
	});
	function readOperation(operation) {
		if (!closing && !scheduler.signal.aborted) try {
			return operation();
		} catch {
			return mentionInboxUnavailable(log$5);
		}
		return mentionInboxUnavailable();
	}
	function mutateNative(apply, notify) {
		nativeRevision++;
		needsSynchronization = true;
		return mutateNativeMentionSnapshot(context, {
			now: scheduler.now,
			canonicalProfileId: (id) => policy.readProfile(id)?.profileId ?? id,
			apply: (current) => {
				assertActive();
				apply(current);
			},
			publish: (current) => {
				if (!scheduler.signal.aborted && current.head.revision >= state.head.revision) {
					state = current;
					needsSynchronization = false;
				}
			},
			notify: () => {
				if (!scheduler.signal.aborted) {
					refreshConnectedViews();
					scheduleExpiry();
					notify?.();
				}
			}
		});
	}
	function legacy(client, ids) {
		warnMentionInboxDeprecation(ids ? "dismiss" : "list");
		return readOperation(() => {
			const draft = mutateNative((current) => {
				if (ids) dismissItems(current, client, ids);
			});
			return readView(client, params.getRuntimeConfig(), true, /* @__PURE__ */ new Map(), draft);
		});
	}
	function invalidate(sessionKey) {
		warnMentionInboxDeprecation("invalidate");
		invalidateTargets(sessionKey);
		policy.invalidateDirectory();
		if (closing || scheduler.signal.aborted) return;
		try {
			mutateNative(() => {});
		} catch {
			log$5.warn("Unable to refresh the mention Inbox; current reads will retry.");
			scheduleExpiry(6e4);
		}
	}
	function dismissItems(draft, client, ids) {
		const current = readView(client, params.getRuntimeConfig(), false, /* @__PURE__ */ new Map(), draft);
		if (current.ok) {
			const owned = new Set(current.value.items.map((item) => item.id));
			for (const id of ids) if (owned.has(id)) removeMentionItem(draft, draft.items.get(id));
		}
		return current;
	}
	function prepareCommittedInput(input) {
		if (input.recipientProfileIds.length === 0) return false;
		context.admission.assertCurrent();
		if (!hasValidMentionReferences(input)) {
			log$5.warn("Skipped mention delivery with invalid committed references.");
			return false;
		}
		policy.recordCommittedInvolvement(input);
		return true;
	}
	function publishCommittedMentions(committed) {
		if (scheduler.signal.aborted || !params.onMentionCreated) return;
		for (const item of committed) {
			const retained = state.items.get(item.id);
			const current = retained && currentTarget(retained, params.getRuntimeConfig());
			if (!retained || !current) continue;
			const projected = projectItem(retained, current);
			params.onMentionCreated({
				id: item.id,
				recipientProfileId: current.recipient.profileId,
				sessionKey: projected.sessionKey,
				agentId: projected.agentId,
				senderLabel: projected.senderLabel,
				sessionTitle: projected.sessionTitle,
				prepare: () => enqueue(async () => {
					await maintain();
				}),
				isCurrent: () => {
					try {
						if (scheduler.signal.aborted) return false;
						if (needsSynchronization) return false;
						const latest = state.items.get(item.id);
						return Boolean(latest && currentTarget(latest, params.getRuntimeConfig()));
					} catch {
						return false;
					}
				}
			});
		}
	}
	async function dispose() {
		closing = true;
		await tail;
		await acceptedWork.drain();
		scheduler.beginClose();
		stopProfiles();
		stopSessions();
		stopRows();
		connectedTargets.clear();
		policy.dispose();
		state.items.clear();
		state.itemsByProfile.clear();
		state.processed.clear();
		await scheduler.stop();
		unregister();
	}
	const unregister = registerOpenClawStateDatabaseAsyncResource({ async close(identity) {
		if (!identity || identity.key === context.admission.identity.key || identity.canonicalPath === context.admission.identity.canonicalPath) await dispose();
	} });
	refresh();
	return {
		async mentionable(client, input, publish) {
			let preparationFailure;
			try {
				while (policy.needsDirectoryPreparation()) await policy.prepareDirectory();
			} catch {
				preparationFailure = mentionInboxUnavailable(log$5);
			}
			publish(preparationFailure ?? readOperation(() => policy.mentionable(client, input)));
		},
		validateRecipients: (...args) => readOperation(() => policy.validateRecipients(...args)),
		list: (client) => legacy(client),
		dismiss: (client, ids) => legacy(client, ids),
		async listAsync(client, publish) {
			let failure;
			try {
				await enqueue(async () => {
					if (await maintain()) refreshConnectedViews();
					scheduleExpiry();
				});
			} catch {
				failure = mentionInboxUnavailable(log$5);
			}
			publish(failure ?? readOperation(() => readView(client)));
		},
		async dismissAsync(client, ids, publish) {
			let failure;
			try {
				const selectedIds = [...ids];
				await enqueue(async () => {
					const result = await mutate((draft, guards) => {
						const current = dismissItems(draft, client, selectedIds);
						if (current.ok) {
							const identity = client?.authenticatedUserProfile?.profileId;
							const scopes = JSON.stringify(client?.connect.scopes);
							const role = client?.connect.role;
							guards.push(() => {
								if (client?.invalidated || client?.internal?.syntheticClient || role !== client?.connect.role || identity !== client?.authenticatedUserProfile?.profileId || scopes !== JSON.stringify(client?.connect.scopes)) throw new Error("Mention caller changed before dismissal");
							});
						}
						return current;
					}, () => {
						const requester = policy.identify(client, params.getRuntimeConfig());
						return requester.ok ? [requester.value.profile.profileId] : [];
					});
					refreshConnectedViews();
					scheduleExpiry();
					if (!result.ok) failure = result;
				});
			} catch {
				failure = mentionInboxUnavailable(log$5);
			}
			publish(failure ?? readOperation(() => readView(client)));
		},
		recordCommittedInput(input) {
			warnMentionInboxDeprecation("recordCommittedInput");
			if (closing || scheduler.signal.aborted) return;
			try {
				if (!prepareCommittedInput(input)) return;
				let committed = [];
				mutateNative((draft) => {
					committed = applyCommittedInput(input, draft, [], {
						sourceIndex: draft.processed,
						itemLimit: MAX_GLOBAL_ITEMS
					});
				}, () => {
					try {
						publishCommittedMentions(committed);
					} catch {
						log$5.warn("Mention delivery could not be completed; the posted message is unchanged.");
					}
				});
			} catch {
				log$5.warn("Mention delivery could not be completed; the posted message is unchanged.");
			}
		},
		recordCommittedInputAsync(committedInput) {
			const input = {
				...committedInput,
				recipientProfileIds: [...committedInput.recipientProfileIds],
				committedSource: { ...committedInput.committedSource }
			};
			return enqueue(async () => {
				if (!prepareCommittedInput(input)) return;
				const committed = await mutate((draft, guards, bounds) => applyCommittedInput(input, draft, guards, bounds), () => input.recipientProfileIds.map((id) => policy.readProfile(id)?.profileId ?? id));
				context.admission.assertCurrent();
				refreshConnectedViews();
				scheduleExpiry();
				publishCommittedMentions(committed);
			}).catch(() => {
				log$5.warn("Mention delivery could not be completed; the posted message is unchanged.");
			});
		},
		invalidate,
		invalidateAsync,
		dispose
	};
}
//#endregion
//#region src/gateway/server-broadcast-live-text.ts
const log$4 = createSubsystemLogger("gateway/broadcast");
/** Socket-owned queues and receipts share the run's retirement and subscription lifecycle. */
function createGatewayLiveTextDelivery(params) {
	const deliveries = /* @__PURE__ */ new WeakMap();
	const publications = /* @__PURE__ */ new WeakMap();
	const deliveryFor = (client) => {
		let state = deliveries.get(client);
		if (!state || state.socket !== client.socket) {
			if (state) retireDelivery(state);
			state = {
				socket: client.socket,
				retired: false,
				inFlight: 0,
				draining: false,
				bytes: 0,
				groups: /* @__PURE__ */ new Map(),
				pending: /* @__PURE__ */ new Set()
			};
			deliveries.set(client, state);
		}
		return state;
	};
	const bufferedBytes = (state) => state.socket.bufferedAmount + state.bytes;
	const takePending = (state, entry) => {
		state.pending.delete(entry);
		const group = state.groups.get(entry.group);
		group.entries.delete(entry.key);
		if (!group.entries.size && !group.receipts.size) {
			entry.group.removeEventListener("abort", group.retire);
			state.groups.delete(entry.group);
		}
		state.bytes -= entry.bytes;
	};
	const retireDelivery = (state) => {
		state.retired = true;
		for (const [signal, group] of state.groups) signal.removeEventListener("abort", group.retire);
		state.groups.clear();
		state.pending.clear();
		state.bytes = 0;
		if (state.close) {
			state.socket.off("close", state.close);
			state.close = void 0;
		}
	};
	const groupFor = (state, signal) => {
		if (!state.close) {
			state.close = () => retireDelivery(state);
			state.socket.once("close", state.close);
		}
		let group = state.groups.get(signal);
		if (!group) {
			const entries = /* @__PURE__ */ new Map();
			const receipts = /* @__PURE__ */ new Map();
			const retire = () => {
				receipts.clear();
				for (const pending of entries.values()) takePending(state, pending);
				state.groups.delete(signal);
			};
			group = {
				entries,
				receipts,
				retire
			};
			state.groups.set(signal, group);
			signal.addEventListener("abort", retire, { once: true });
		}
		return group;
	};
	params.sessionMessageSubscribers?.onChange((sessionKey, connId) => {
		const client = params.clients.getByConnectionId(connId);
		const state = client && deliveries.get(client);
		for (const group of state?.groups.values() ?? []) for (const [key, receipt] of group.receipts) if (receipt.sessionKeys.includes(sessionKey)) group.receipts.delete(key);
	});
	const drain = (state, group) => {
		if (state.retired || state.draining) return;
		state.draining = true;
		try {
			for (const entry of state.pending) {
				if (group ? entry.group !== group : state.inFlight !== 0) {
					if (group) continue;
					break;
				}
				takePending(state, entry);
				try {
					entry.send();
				} catch (err) {
					log$4.error(`broadcast pending send failed: ${formatErrorMessage(err)}`);
				}
			}
		} finally {
			state.draining = false;
		}
	};
	const publish = (live) => {
		if (!live?.projection || live.group.aborted) return;
		let streams = publications.get(live.group);
		if (!streams) {
			streams = /* @__PURE__ */ new Map();
			publications.set(live.group, streams);
			live.group.addEventListener("abort", () => publications.delete(live.group), { once: true });
		}
		const latest = streams.get(live.projection.key);
		const previous = latest?.sourceEpoch === live.sourceEpoch ? latest : void 0;
		const publication = {
			key: live.projection.key,
			sourceEpoch: live.sourceEpoch,
			previous: previous?.revision,
			revision: {},
			version: live.projection.version,
			text: live.projection.text?.snapshot,
			snapshot: live.projection.snapshot || !Object.is(previous?.version, live.projection.version) || live.projection.text !== void 0 && !isLiveTextAppend(previous?.text, live.projection.text)
		};
		streams.set(publication.key, publication);
		return publication;
	};
	return {
		deliveryFor,
		bufferedBytes,
		takePending,
		retireDelivery,
		drain,
		publish,
		pending: (state, group, key) => state.groups.get(group)?.entries.get(key),
		enqueue: (state, entry) => {
			groupFor(state, entry.group).entries.set(entry.key, entry);
			state.pending.add(entry);
			state.bytes += entry.bytes;
		},
		coalescePublication: (publication, previous) => publication && {
			...publication,
			previous: previous ? previous.previous : publication.previous,
			snapshot: publication.snapshot || previous?.snapshot || previous !== void 0 && previous.revision !== publication.previous
		},
		canSendDelta: (state, live, publication) => {
			const receipt = publication && live && state.groups.get(live.group)?.receipts.get(publication.key);
			return Boolean(publication && receipt && receipt.revision === publication.previous && Object.is(receipt.version, publication.version) && !publication.snapshot);
		},
		recordReceipt: (state, sessionKeys, live, publication) => {
			if (publication && live && !live.group.aborted) groupFor(state, live.group).receipts.set(publication.key, {
				revision: publication.revision,
				version: publication.version,
				sessionKeys
			});
		}
	};
}
//#endregion
//#region src/gateway/server-broadcast-narration.ts
const NARRATION_INTERVAL_MS = 2e3;
/** Per-session pacing retains only the newest publication, never token queues. */
function createGatewayNarrationDelivery(params) {
	const connections = /* @__PURE__ */ new WeakMap();
	const projections = /* @__PURE__ */ new WeakMap();
	const groups = /* @__PURE__ */ new WeakMap();
	const subscribers = params.sessionMessageSubscribers;
	const isNarration = (connId, keys) => {
		let subscribed = false;
		for (const key of keys) if (subscribers?.get(key).has(connId)) {
			if (!subscribers.getNarration(key).has(connId)) return false;
			subscribed = true;
		}
		return subscribed;
	};
	const cancelPending = (state) => {
		clearTimeout(state.timer);
		state.timer = void 0;
		state.retirePending?.();
		state.retirePending = void 0;
		state.pending = void 0;
	};
	const connectionFor = (client) => {
		const existing = connections.get(client);
		if (existing?.socket === client.socket) return existing;
		existing?.close();
		const socket = client.socket;
		const sessions = /* @__PURE__ */ new Map();
		const close = () => {
			for (const state of sessions.values()) cancelPending(state);
			sessions.clear();
			socket.off("close", close);
			connections.delete(client);
		};
		const connection = {
			socket,
			sessions,
			close
		};
		connections.set(client, connection);
		socket.once("close", close);
		return connection;
	};
	subscribers?.onChange((key, connId) => {
		const client = params.clients.getByConnectionId(connId);
		const connection = client && connections.get(client);
		if (!connection) return;
		for (const [sessionKey, state] of connection.sessions) if (state.subscriptionKeys.includes(key)) {
			cancelPending(state);
			connection.sessions.delete(sessionKey);
		}
		if (connection.sessions.size === 0) connection.close();
	});
	const projectionFor = (payload, sessionKey, explicitAgentId) => {
		const existing = projections.get(payload);
		if (existing && existing.explicitAgentId === explicitAgentId) return existing;
		const agentId = normalizeOptionalLowercaseString(explicitAgentId ?? payload.agentId) ?? parseAgentSessionKey(sessionKey)?.agentId;
		const projection = {
			explicitAgentId,
			agentId,
			key: `${sessionKey.length}:${sessionKey}${agentId ?? ""}`
		};
		projections.set(payload, projection);
		return projection;
	};
	const project = (payload, projection) => {
		if (projection.digest) return projection.digest;
		const visible = stripInternalRuntimeContext(sanitizeAssistantVisibleTextWithProfile(extractAssistantPhaseText(payload.message) ?? "", "internal-scaffolding", payload.state === "delta"), { streaming: payload.state === "delta" });
		const digest = {
			sessionKey: String(payload.sessionKey),
			runId: String(payload.runId),
			...projection.agentId ? { agentId: projection.agentId } : {},
			text: sliceUtf16Safe(visible, -16384)
		};
		projection.digest = digest;
		return digest;
	};
	const flush = (client, connection, state) => {
		const pending = state.pending;
		cancelPending(state);
		if (!pending || client.socket !== connection.socket || !params.clients.has(client)) return;
		const { payload, projection, sessionKeys, opts } = pending;
		const live = opts?.liveText;
		if (!isNarration(client.connId, sessionKeys) || live?.group.aborted) return;
		try {
			if (live?.isCurrent?.() === false) return;
		} catch {
			return;
		}
		const digest = project(payload, projection);
		if (state.last?.runId === digest.runId && state.last.text === digest.text) return;
		state.lastSentAt = Date.now();
		state.last = digest;
		params.send("session.narration", digest, /* @__PURE__ */ new Set([client.connId]), {
			sessionKeys,
			agentId: projection.agentId,
			dropIfSlow: true,
			sessionSubscriptionVerified: true
		});
	};
	return {
		isNarration,
		consume: (client, event, payload, sessionKeys, opts) => {
			if (!isRecord(payload) || !isNarration(client.connId, sessionKeys)) return false;
			if (event === "agent") {
				if (payload.stream === "assistant" || payload.stream === "thinking") return true;
				if (payload.stream === "item" && isRecord(payload.data) && payload.data.phase === "update" && (payload.data.kind === "preamble" || payload.data.kind === "answer_candidate" && payload.data.status === "candidate")) return true;
			}
			if (typeof payload.sessionKey !== "string") return false;
			const projection = projectionFor(payload, payload.sessionKey, opts?.agentId);
			const key = projection.key;
			const pendingState = connections.get(client)?.sessions.get(key);
			if (pendingState?.pending && (typeof payload.runId === "string" && payload.runId.trim().length > 0 && payload.runId !== pendingState.pending.payload.runId || (event === "agent" || event === "session.tool") && payload.stream === "tool" && isRecord(payload.data) && typeof payload.data.name === "string" && payload.data.name.trim().length > 0)) cancelPending(pendingState);
			if (event !== "chat" || typeof payload.runId !== "string") return false;
			const delta = payload.state === "delta";
			const terminal = payload.state === "final" || payload.state === "error" || payload.state === "aborted";
			if (!delta && !terminal) return false;
			const connection = connectionFor(client);
			const state = connection.sessions.get(key) ?? { subscriptionKeys: sessionKeys };
			state.subscriptionKeys = sessionKeys;
			connection.sessions.set(key, state);
			if (isRecord(payload.message)) {
				state.retirePending?.();
				state.retirePending = void 0;
				state.pending = {
					payload,
					projection,
					sessionKeys,
					opts
				};
				const signal = opts?.liveText?.group;
				if (signal) {
					let states = groups.get(signal);
					if (!states) {
						states = /* @__PURE__ */ new Set();
						groups.set(signal, states);
						const pendingStates = states;
						signal.addEventListener("abort", () => {
							for (const pending of pendingStates) cancelPending(pending);
							groups.delete(signal);
						}, { once: true });
					}
					states.add(state);
					const pendingStates = states;
					state.retirePending = () => pendingStates.delete(state);
				}
			}
			if (terminal) {
				if (state.pending?.payload.runId === payload.runId) flush(client, connection, state);
			} else if (state.pending) {
				const delay = NARRATION_INTERVAL_MS - (Date.now() - (state.lastSentAt ?? -Infinity));
				if (delay <= 0) flush(client, connection, state);
				else if (!state.timer) {
					state.timer = setTimeout(() => flush(client, connection, state), delay);
					state.timer.unref?.();
				}
			}
			return delta;
		}
	};
}
//#endregion
//#region src/gateway/server-broadcast-scopes.ts
const EVENT_SCOPE_GUARDS = {
	agent: [SESSION_READ_SCOPE],
	chat: [SESSION_READ_SCOPE],
	"chat.metadata.changed": [SESSION_READ_SCOPE],
	"board.changed": [READ_SCOPE],
	"board.command": [READ_SCOPE],
	"progressCard.changed": [SESSION_READ_SCOPE],
	"ui.command": [READ_SCOPE],
	"chat.send_timing": [READ_SCOPE],
	"chat.side_result": [SESSION_READ_SCOPE],
	cron: [READ_SCOPE],
	health: [],
	"exec.approval.requested": [APPROVALS_SCOPE],
	"exec.approval.resolved": [APPROVALS_SCOPE],
	"question.requested": [QUESTIONS_SCOPE],
	"question.resolved": [QUESTIONS_SCOPE],
	heartbeat: [],
	"plugin.approval.requested": [APPROVALS_SCOPE],
	"plugin.approval.resolved": [APPROVALS_SCOPE],
	"openclaw.approval.requested": [APPROVALS_SCOPE],
	"openclaw.approval.resolved": [APPROVALS_SCOPE],
	presence: [READ_SCOPE],
	shutdown: [],
	"gateway.suspension": [],
	tick: [],
	"talk.event": [READ_SCOPE],
	"talk.mode": [TALK_SCOPE],
	"talk.voice.change": [TALK_SCOPE],
	task: [READ_SCOPE],
	"task.suggestion": [READ_SCOPE],
	"update.available": [],
	[GATEWAY_EVENT_UPDATE_RUN_CHANGED]: [ADMIN_SCOPE],
	"config.changed": [READ_SCOPE],
	"users.prefs.changed": [SESSION_READ_SCOPE],
	"mentions.changed": [READ_SCOPE],
	"skills.changed": [READ_SCOPE],
	"plugins.changed": [READ_SCOPE],
	"plugins.install.progress": [ADMIN_SCOPE],
	"voicewake.changed": [READ_SCOPE],
	"voicewake.routing.changed": [READ_SCOPE],
	[GATEWAY_EVENT_DEVICE_PAIR_CHANGED]: [PAIRING_SCOPE],
	"device.pair.requested": [PAIRING_SCOPE],
	"device.pair.resolved": [PAIRING_SCOPE],
	"device.pair.setup.completed": [PAIRING_SCOPE],
	"device.pair.setup.deliveryUncertain": [PAIRING_SCOPE],
	"node.pair.requested": [PAIRING_SCOPE],
	"node.pair.resolved": [PAIRING_SCOPE],
	"node.presence": [READ_SCOPE],
	"node.hostStats": [READ_SCOPE],
	[GATEWAY_EVENT_NODE_RUNNER_INVENTORY_CHANGED]: [READ_SCOPE],
	"sessions.catalog.host": [READ_SCOPE],
	"sessions.changed": [SESSION_READ_SCOPE],
	"controlUi.sessionPullRequests.changed": [READ_SCOPE],
	"plugins.controlUi.changed": [READ_SCOPE],
	"mcp.app.resourceUpdated": [READ_SCOPE],
	"mcp.app.hostContextChanged": [READ_SCOPE],
	"session.approval": [APPROVALS_SCOPE],
	"session.message": [SESSION_READ_SCOPE],
	"session.narration": [SESSION_READ_SCOPE],
	"session.observer": [SESSION_READ_SCOPE],
	"session.operation": [READ_SCOPE],
	"session.sharing": [READ_SCOPE],
	"session.sharing.evidence": [READ_SCOPE],
	"session.suggestion": [SESSION_READ_SCOPE],
	"session.reaction": [SESSION_READ_SCOPE],
	"session.typing": [SESSION_READ_SCOPE],
	"session.tool": [SESSION_READ_SCOPE],
	"terminal.data": [ADMIN_SCOPE],
	"terminal.exit": [ADMIN_SCOPE],
	"portal.changed": [READ_SCOPE]
};
const SESSION_CATALOG_INVALIDATIONS = /* @__PURE__ */ new Set([
	"delete",
	"groups",
	"sharing",
	"profile-identity"
]);
function isSessionReadInvalidation(event, payload, targeted) {
	if (isProxy(payload) || !isRecord(payload)) return false;
	const prototype = Object.getPrototypeOf(payload);
	if (prototype !== null && prototype !== Object.prototype || "toJSON" in payload) return false;
	const fields = Object.entries(Object.getOwnPropertyDescriptors(payload));
	return event === "sessions.changed" && targeted && Object.hasOwn(payload, "reason") && fields.every(([key, field]) => "value" in field && (key === "reason" && SESSION_CATALOG_INVALIDATIONS.has(field.value) || key === "ts" && typeof field.value === "number" && Number.isFinite(field.value)));
}
function modelMetadataInvalidationFragment(payload) {
	if (isProxy(payload) || !isRecord(payload)) return;
	const prototype = Object.getPrototypeOf(payload);
	if (prototype !== null && prototype !== Object.prototype || "toJSON" in payload) return;
	const keys = Reflect.ownKeys(payload);
	if (keys.length === 0) return ",\"payload\":{}";
	const fields = {};
	for (const key of keys) {
		if (key !== "modelSelectionChanged" && key !== "modelCatalogChanged" && key !== "authChanged") return;
		const field = Object.getOwnPropertyDescriptor(payload, key);
		if (!field?.enumerable || !("value" in field) || typeof field.value !== "boolean" || key === "modelSelectionChanged" && !field.value) return;
		fields[key] = field.value;
	}
	return `,"payload":${JSON.stringify(fields)}`;
}
function hasEventScope(client, event, explicitPluginScope, ownRunQuestion = false, hasSessionReadContext) {
	if (client.connectionKind === "worker") return false;
	const role = client.connect.role ?? "operator";
	const scopes = Array.isArray(client.connect.scopes) ? client.connect.scopes : [];
	const required = EVENT_SCOPE_GUARDS[event];
	const pluginScope = explicitPluginScope || (!required && event.startsWith("plugin.") ? "operator.write" : void 0);
	if (pluginScope) return role === "operator" && operatorScopeSatisfied(pluginScope, scopes);
	if (!required) return false;
	return required.length === 0 || role === "operator" && (required.some((scope) => operatorScopeSatisfied(scope, scopes) && (scope !== "operator.sessions.read" || operatorScopeSatisfied("operator.read", scopes) || hasSessionReadContext?.() === true)) || ownRunQuestion && operatorScopeSatisfied("operator.sessions.write", scopes));
}
//#endregion
//#region src/gateway/server-broadcast.ts
const log$3 = createSubsystemLogger("gateway/broadcast");
const SESSION_SUBSCRIPTION_EVENTS = /* @__PURE__ */ new Set([
	"agent",
	"chat",
	"chat.side_result",
	"session.observer",
	"session.narration",
	"session.tool"
]);
const rawJSON = "rawJSON" in JSON && typeof JSON.rawJSON === "function" ? JSON.rawJSON : void 0;
function serializeFrameField(name, value, messageStrings, serializeSession) {
	const shareSession = serializeSession !== void 0 && isRecord(value) && !("toJSON" in value) && !("toJSON" in Object.prototype);
	const field = { [name]: value };
	const sessionJSON = shareSession ? serializeSession() : void 0;
	let payload;
	const messageObjects = messageStrings ? /* @__PURE__ */ new WeakSet() : void 0;
	let fieldJSON;
	const session = shareSession ? value.session : void 0;
	if (shareSession) value.session = void 0;
	try {
		fieldJSON = JSON.stringify(field, messageStrings && function(key, current) {
			if (this === field) payload = current;
			else if (this === payload && key === "message" || messageObjects.has(this)) {
				if (typeof current === "string" && current.length >= 1024) {
					const encoded = messageStrings.values.get(current);
					if (encoded !== void 0) return encoded;
					if (messageStrings.capture) {
						const prepared = rawJSON(JSON.stringify(current));
						messageStrings.values.set(current, prepared);
						return prepared;
					}
				} else if (current !== null && typeof current === "object") messageObjects.add(current);
			}
			return current;
		});
	} finally {
		if (shareSession) value.session = session;
	}
	if (shareSession) {
		const separator = fieldJSON.endsWith("{}}") ? "" : ",";
		return `,${fieldJSON.slice(1, -2)}${separator}"session":${sessionJSON}}`;
	}
	return fieldJSON.startsWith(`{"${name}":`) ? `,${fieldJSON.slice(1, -1)}` : "";
}
function resolveBroadcastSessionScope(payload, explicit, explicitAgentId) {
	if (!payload || typeof payload !== "object" || Array.isArray(payload)) return {
		sessionKeys: explicit ?? [],
		...explicitAgentId ? { agentId: explicitAgentId } : {}
	};
	const record = payload;
	const source = [
		record,
		record.suggestion,
		record.request
	].find((candidate) => typeof candidate?.sessionKey === "string" && candidate.sessionKey.trim());
	const sessionKey = typeof source?.sessionKey === "string" ? source.sessionKey.trim() : "";
	const agentId = explicitAgentId ?? (typeof source?.agentId === "string" ? source.agentId.trim() || void 0 : void 0);
	return {
		sessionKeys: explicit?.length ? explicit : sessionKey ? [sessionKey] : [],
		...agentId ? { agentId } : {}
	};
}
const MAX_SERVER_FRAME_HEADER_BYTES = 10;
const MAX_RECIPIENT_PROFILE_FIELD_BYTES = Buffer.byteLength(",\"recipientProfileId\":\"\"") + 768;
function frameWithSequence(base, seq, payload, recipientProfileId) {
	const recipient = recipientProfileId === void 0 ? "" : `,"recipientProfileId":${JSON.stringify(recipientProfileId)}`;
	return `{"type":"event","event":${base.eventJSON}${payload},"seq":${seq}${base.stateVersionFragment}${recipient}}`;
}
function createGatewayBroadcaster(params) {
	const clientSeq = /* @__PURE__ */ new WeakMap();
	const reportedSlowPayloadClients = /* @__PURE__ */ new WeakSet();
	const delivery = createGatewayLiveTextDelivery(params);
	const narration = createGatewayNarrationDelivery({
		...params,
		send: (event, payload, connIds, opts) => broadcastInternal(event, payload, opts, connIds)
	});
	const isCurrent = (predicate) => {
		try {
			return predicate?.() !== false;
		} catch {
			return false;
		}
	};
	const broadcastInternal = (event, payload, opts, targetConnIds, explicitPluginScope, retained) => {
		if (!retained && event === "sessions.changed") queuePluginSessionsChanged(payload);
		const live = opts?.liveText;
		const publication = retained ? retained.publication : delivery.publish(live);
		if (params.clients.size === 0) return;
		const { sessionKeys, agentId } = resolveBroadcastSessionScope(payload, opts?.sessionKeys, opts?.agentId);
		const isTargeted = Boolean(targetConnIds);
		const presencePayload = event === "presence" ? payload : void 0;
		const metadataInvalidation = event === "chat.metadata.changed" ? modelMetadataInvalidationFragment(payload) : void 0;
		let sessionReadContext;
		const hasSessionReadContext = () => sessionReadContext ??= event === "users.prefs.changed" && isTargeted || params.canReceiveSessionEvent !== void 0 && sessionKeys.length > 0 && sessionKeys.every((key) => key.trim().length > 0) || metadataInvalidation !== void 0 || isSessionReadInvalidation(event, payload, isTargeted);
		let projectPresence;
		let presenceFragments;
		let projectSession;
		let skipSourcePayload = false;
		let sessionProjectionPrepared = false;
		let outboundEventLogged = false;
		let lastFrameSequence = 0;
		let lastFrameRecipientProfileId;
		let lastFrame;
		let lastPayloadFragment;
		const frames = retained?.frames ?? {};
		let mergedFrames;
		const getFrameFields = () => frames.fields ??= {
			eventJSON: JSON.stringify(event),
			stateVersionFragment: opts?.stateVersion === void 0 ? "" : serializeFrameField("stateVersion", opts.stateVersion)
		};
		const frameBaseFor = (value) => ({
			...getFrameFields(),
			payloadFragment: value === payload && metadataInvalidation !== void 0 ? metadataInvalidation : presencePayload ? "" : serializeFrameField("payload", value)
		});
		const getFrameBase = () => {
			return frames.snapshot ??= frameBaseFor(payload);
		};
		const sessionSubscriptionVerified = opts?.sessionSubscriptionVerified === true;
		const isSessionSubscriptionEvent = SESSION_SUBSCRIPTION_EVENTS.has(event);
		const sessionMessageSubscribers = params.sessionMessageSubscribers;
		let sessionSubscriberConnIdsByKey;
		const recipients = retained ? [retained.client] : targetConnIds ? params.clients.getByConnectionIds(targetConnIds) : params.clients;
		const messageStrings = rawJSON && event === "session.message" && !retained && (targetConnIds?.size ?? params.clients.size) > 1 ? {
			values: /* @__PURE__ */ new Map(),
			capture: true
		} : void 0;
		for (const c of recipients) {
			if (!params.clients.has(c) || retained && c.socket !== retained.socket || c.invalidated === true || c.socket.readyState !== 1 || opts?.excludeClientCapability && hasGatewayClientCap(c.connect.caps, opts.excludeClientCapability)) continue;
			const questionRecipient = event === "question.requested" || event === "question.resolved" ? opts?.questionRecipient : void 0;
			if (!hasEventScope(c, event, explicitPluginScope, questionRecipient !== void 0 && !operatorScopeSatisfied("operator.questions", c.connect.scopes ?? []), hasSessionReadContext)) continue;
			if (event === "chat.metadata.changed" && !operatorScopeSatisfied("operator.read", c.connect.scopes ?? []) && metadataInvalidation === void 0) continue;
			if (questionRecipient && !isCurrent(() => questionRecipient(c))) continue;
			if ((event === "session.typing" || sessionSubscriptionVerified || (isBrowserCopilotClient(c.connect.client) || hasGatewayClientCap(c.connect.caps, GATEWAY_CLIENT_CAPS.SESSION_SCOPED_EVENTS)) && isSessionSubscriptionEvent) && !(isTargeted && sessionSubscriptionVerified && !retained)) {
				if (!sessionKeys.length || !sessionMessageSubscribers) continue;
				sessionSubscriberConnIdsByKey ??= [];
				let subscribed = false;
				let sessionKeyIndex = 0;
				for (const sessionKey of sessionKeys) {
					if ((sessionSubscriberConnIdsByKey[sessionKeyIndex] ??= sessionMessageSubscribers.get(sessionKey)).has(c.connId)) {
						subscribed = true;
						break;
					}
					sessionKeyIndex += 1;
				}
				if (!subscribed) continue;
			}
			if (!questionRecipient && sessionKeys.length > 0 && params.canReceiveSessionEvent && !params.canReceiveSessionEvent(c, sessionKeys, agentId, event, payload)) continue;
			if (retained && !isCurrent(live?.isCurrent) || live?.coalesce && live.group.aborted) continue;
			if (event === "session.narration" && !narration.isNarration(c.connId, sessionKeys) || (event === "chat" || event === "agent" || event === "session.tool" || event === "session.observer") && narration.consume(c, event, payload, sessionKeys, opts)) continue;
			if (!outboundEventLogged) {
				outboundEventLogged = true;
				logWs("out", "event", () => {
					const logMeta = {
						event,
						seq: "per-client",
						clients: params.clients.size,
						targets: targetConnIds ? targetConnIds.size : void 0,
						dropIfSlow: opts?.dropIfSlow,
						presenceVersion: opts?.stateVersion?.presence,
						healthVersion: opts?.stateVersion?.health
					};
					if (event === "agent") Object.assign(logMeta, summarizeAgentEventForWsLog(payload));
					return logMeta;
				});
			}
			const state = delivery.deliveryFor(c);
			if (live && !live.coalesce) delivery.drain(state, live.group);
			if (state.retired) continue;
			const nextSeq = (clientSeq.get(c) ?? 0) + 1;
			const bufferedAmount = delivery.bufferedBytes(state);
			const slow = bufferedAmount > MAX_BUFFERED_BYTES;
			if (!slow) reportedSlowPayloadClients.delete(c);
			else if (!reportedSlowPayloadClients.has(c)) {
				reportedSlowPayloadClients.add(c);
				logRejectedLargePayload({
					surface: "gateway.ws.outbound_buffer",
					bytes: bufferedAmount,
					limitBytes: MAX_BUFFERED_BYTES,
					reason: opts?.dropIfSlow ? "ws_send_buffer_drop" : "ws_send_buffer_close"
				});
			}
			if (slow && opts?.dropIfSlow) {
				clientSeq.set(c, nextSeq);
				continue;
			}
			if (slow) {
				delivery.retireDelivery(state);
				closeGatewayTransportWithGrace(state.socket, 1008, "slow consumer");
				continue;
			}
			if (!retained && live?.coalesce && state.inFlight > 0) {
				let previous = delivery.pending(state, live.group, live.coalesce.key);
				if (previous && !isCurrent(previous.isCurrent)) {
					delivery.takePending(state, previous);
					previous = void 0;
				}
				try {
					const cached = previous ? mergedFrames?.get(previous.payload) : void 0;
					const nextPayload = cached ? cached.payload : previous ? live.coalesce.merge(previous.payload, payload) : payload;
					const prepared = cached?.frames ?? (nextPayload === payload ? frames : {});
					if (previous && !cached && nextPayload !== payload) (mergedFrames ??= /* @__PURE__ */ new Map()).set(previous.payload, {
						payload: nextPayload,
						frames: prepared
					});
					if (prepared.reservedBytes === void 0) {
						const projection = live.projection;
						const estimator = projection?.snapshotBytes;
						const base = estimator && projection ? prepared.delta ??= frameBaseFor(projection.delta(nextPayload)) : prepared.snapshot ??= frameBaseFor(nextPayload);
						const payloadBytes = Buffer.byteLength(base.payloadFragment);
						const fieldPrefixBytes = Buffer.byteLength(",\"payload\":");
						prepared.fields = getFrameFields();
						prepared.reservedBytes = Buffer.byteLength(frameWithSequence(base, Number.MAX_SAFE_INTEGER, "")) + (estimator ? fieldPrefixBytes + estimator(nextPayload, payloadBytes - fieldPrefixBytes) : payloadBytes) + MAX_SERVER_FRAME_HEADER_BYTES + MAX_RECIPIENT_PROFILE_FIELD_BYTES;
					}
					const bytes = prepared.reservedBytes;
					if (delivery.bufferedBytes(state) - (previous?.bytes ?? 0) + bytes <= 52428800) {
						if (previous) delivery.takePending(state, previous);
						const socket = c.socket;
						const queuedPublication = delivery.coalescePublication(publication, previous?.publication);
						const entry = {
							group: live.group,
							key: live.coalesce.key,
							payload: nextPayload,
							bytes,
							isCurrent: live.isCurrent,
							publication: queuedPublication,
							send: () => broadcastInternal(event, nextPayload, opts, targetConnIds, explicitPluginScope, {
								client: c,
								socket,
								frames: prepared,
								publication: queuedPublication
							})
						};
						delivery.enqueue(state, entry);
						continue;
					}
				} catch (err) {
					log$3.error(`broadcast serialization failed for event ${event}: ${formatErrorMessage(err)}`);
					return;
				}
				delivery.drain(state, live.group);
				broadcastInternal(event, payload, opts, targetConnIds, explicitPluginScope, {
					client: c,
					socket: c.socket,
					frames,
					publication
				});
				continue;
			}
			const useDelta = delivery.canSendDelta(state, live, publication);
			const projection = live?.projection;
			const getDeliveryFrameBase = () => useDelta && projection ? frames.delta ??= frameBaseFor(projection.delta(payload)) : getFrameBase();
			let frame;
			let delivered;
			try {
				if (!sessionProjectionPrepared) {
					getFrameFields();
					let canSkipSourcePayload = false;
					if (!retained && (event === "session.message" || event === "sessions.changed") && !isProxy(payload) && isRecord(payload)) {
						const prototype = Object.getPrototypeOf(payload);
						canSkipSourcePayload = (prototype === null || prototype === Object.prototype) && !("toJSON" in payload);
					}
					if (!canSkipSourcePayload) getDeliveryFrameBase();
					projectSession = params.prepareSessionEventProjection?.(event, payload, {
						sessionKeys,
						agentId,
						...opts?.prepareSessionProjection ? { prepareSessionProjection: opts.prepareSessionProjection } : {}
					});
					skipSourcePayload = canSkipSourcePayload && projectSession !== void 0;
					sessionProjectionPrepared = true;
				}
				const base = skipSourcePayload ? getFrameFields() : getDeliveryFrameBase();
				let payloadFragment = skipSourcePayload ? "" : getDeliveryFrameBase().payloadFragment;
				if (presencePayload) {
					if (!params.preparePresenceProjection) throw new Error("presence recipient projection unavailable");
					projectPresence ??= params.preparePresenceProjection(presencePayload.presence);
					const projectedPayload = {
						...presencePayload,
						presence: projectPresence(c)
					};
					const reusable = Object.keys(projectedPayload).length === 1 && !("toJSON" in projectedPayload);
					const cached = reusable ? presenceFragments?.get(projectedPayload.presence) : void 0;
					payloadFragment = cached ?? serializeFrameField("payload", projectedPayload);
					if (reusable && cached === void 0) (presenceFragments ??= /* @__PURE__ */ new Map()).set(projectedPayload.presence, payloadFragment);
				}
				if (projectSession) {
					const projected = projectSession(c);
					if (projected === void 0) continue;
					payloadFragment = serializeFrameField("payload", projected.payload, messageStrings?.capture || messageStrings?.values.size ? messageStrings : void 0, projected.serializeSession);
					delivered = projected.delivered;
					if (messageStrings) messageStrings.capture = false;
				}
				const recipientProfileId = (c.connect.role ?? "operator") === "operator" ? c.preparedRecipientProfileId : void 0;
				if (!presencePayload && !projectSession && lastFrame !== void 0 && lastPayloadFragment === payloadFragment && lastFrameSequence === nextSeq && lastFrameRecipientProfileId === recipientProfileId) frame = lastFrame;
				else {
					frame = frameWithSequence(base, nextSeq, payloadFragment, recipientProfileId);
					if (!presencePayload && !projectSession) {
						if (!retained && (targetConnIds?.size ?? params.clients.size) > 1) frame = Buffer.from(frame);
						lastFrameSequence = nextSeq;
						lastFrameRecipientProfileId = recipientProfileId;
						lastPayloadFragment = payloadFragment;
						lastFrame = frame;
					}
				}
			} catch (err) {
				log$3.error(`broadcast serialization failed for event ${event}: ${formatErrorMessage(err)}`);
				return;
			}
			clientSeq.set(c, nextSeq);
			delivery.recordReceipt(state, sessionKeys, live, publication);
			state.inFlight += 1;
			let finished = false;
			const sent = (err) => {
				if (finished) return;
				finished = true;
				state.inFlight -= 1;
				if (state.retired) return;
				if (err) {
					delivery.retireDelivery(state);
					log$3.error(`broadcast send failed conn=${c.connId}: ${formatErrorMessage(err)}`, { event });
					state.socket.terminate();
				} else delivery.drain(state);
			};
			try {
				delivered?.();
				if (typeof frame === "string") state.socket.send(frame, sent);
				else state.socket.send(frame, { binary: false }, sent);
			} catch (err) {
				sent(err instanceof Error ? err : new Error(String(err)));
			}
		}
	};
	const broadcast = (event, payload, opts) => {
		params.onBroadcast?.(event, payload, opts);
		broadcastInternal(event, payload, opts);
	};
	const broadcastToConnIds = (event, payload, connIds, opts) => {
		broadcastInternal(event, payload, opts, connIds);
	};
	const getBufferedAmount = (connId) => {
		const client = params.clients.getByConnectionId(connId);
		if (!client || client.invalidated || client.socket.readyState !== 1) return;
		const state = delivery.deliveryFor(client);
		return state.retired ? void 0 : delivery.bufferedBytes(state);
	};
	const broadcastPluginEvent = (event, payload, scope) => {
		if (!event.startsWith("plugin.") || event.startsWith("plugin.approval.")) throw new Error(`invalid plugin gateway event: ${event}`);
		if (scope !== "operator.read" && scope !== "operator.write" && scope !== "operator.admin") throw new Error("invalid plugin gateway event scope");
		broadcastInternal(event, payload, void 0, void 0, scope);
	};
	return {
		broadcast,
		broadcastToConnIds,
		broadcastPluginEvent,
		getBufferedAmount
	};
}
//#endregion
//#region src/gateway/server/client-registry.ts
var GatewayClientRegistry = class extends Set {
	#byConnectionId = /* @__PURE__ */ new Map();
	#subscribers = /* @__PURE__ */ new Set();
	#nextOrder = 0;
	#onRemove;
	#activeRequests = /* @__PURE__ */ new Map();
	get authorityClients() {
		return { [Symbol.iterator]: () => (/* @__PURE__ */ new Set([...this, ...this.#activeRequests.keys()])).values() };
	}
	retainRequest(client) {
		this.#activeRequests.set(client, (this.#activeRequests.get(client) ?? 0) + 1);
		let released = false;
		return () => {
			if (released) return;
			released = true;
			const remaining = this.#activeRequests.get(client) - 1;
			if (remaining === 0) this.#activeRequests.delete(client);
			else this.#activeRequests.set(client, remaining);
		};
	}
	constructor(clients, onRemove) {
		super();
		this.#onRemove = onRemove;
		for (const client of clients ?? []) this.add(client);
	}
	add(client) {
		if (!this.has(client)) {
			this.#byConnectionId.set(client.connId, {
				client,
				order: this.#nextOrder++
			});
			super.add(client);
			this.#publish();
		}
		return this;
	}
	delete(client) {
		if (!super.delete(client)) return false;
		this.#onRemove?.(client);
		if (this.#byConnectionId.get(client.connId)?.client === client) this.#byConnectionId.delete(client.connId);
		this.#publish();
		return true;
	}
	clear() {
		if (this.size === 0) return;
		for (const client of this) this.#onRemove?.(client);
		super.clear();
		this.#byConnectionId.clear();
		this.#publish();
	}
	subscribe(listener) {
		this.#subscribers.add(listener);
		return () => this.#subscribers.delete(listener);
	}
	#publish() {
		for (const listener of this.#subscribers) listener();
	}
	getByConnectionId(connId) {
		return this.#byConnectionId.get(connId)?.client;
	}
	getByConnectionIds(connIds) {
		const indexed = [];
		for (const connId of connIds) {
			const entry = this.#byConnectionId.get(connId);
			if (entry) indexed.push(entry);
		}
		if (indexed.length > 1) indexed.sort((a, b) => a.order - b.order);
		return indexed.map((entry) => entry.client);
	}
};
//#endregion
//#region src/gateway/server-connection-state.ts
/** Creates transport-independent connection, subscription, and run state. */
function createGatewayConnectionState(params) {
	const loadRuntimeConfig = params.getRuntimeConfig ?? (() => params.cfg);
	let sessionRowProjection;
	let ancestorReferences = /* @__PURE__ */ new WeakMap();
	const clients = new GatewayClientRegistry(void 0, (client) => {
		ancestorReferences.delete(client);
	});
	const forgetConnectionAncestors = (connId) => {
		const client = clients.getByConnectionId(connId);
		if (client) ancestorReferences.delete(client);
	};
	const forgetAncestor = (key) => {
		for (const client of clients) ancestorReferences.get(client)?.forget(key);
	};
	const isConnectionActive = (connId) => {
		const client = clients.getByConnectionId(connId);
		return Boolean(client && !client.invalidated && !client.connectionSignal?.aborted);
	};
	const sessionEventSubscribers = createSessionEventSubscriberRegistry(isConnectionActive, forgetConnectionAncestors);
	const sessionMessageSubscribers = createSessionMessageSubscriberRegistry(isConnectionActive, forgetConnectionAncestors);
	const eventWebPush = createEventWebPushDelivery({ getRuntimeConfig: loadRuntimeConfig });
	const gatewayBroadcaster = createGatewayBroadcaster({
		clients,
		preparePresenceProjection: (presence) => createPresenceRecipientProjection({
			cfg: loadRuntimeConfig(),
			presence,
			projection: sessionRowProjection
		}),
		sessionMessageSubscribers,
		canReceiveSessionEvent: (client, sessionKeys, agentId, event, payload) => {
			try {
				const projection = sessionRowProjection;
				const cfg = loadRuntimeConfig();
				const policyConfig = projection?.getPolicyConfig() ?? cfg;
				const prepared = projection ? {
					sharing: prepareProjectedSessionSharing({
						cfg: policyConfig,
						client,
						isMember: (target, identity) => projection.hasMembership(target.storePath, target.storeKey, identity)
					}),
					target: (key, owner) => {
						const scope = resolveSessionEventAgentScope(cfg, key, owner);
						return scope?.[1] ? projection.sharingTarget({
							key,
							agentId: scope[1]
						}) : null;
					}
				} : void 0;
				return canReceiveSessionEvent({
					cfg,
					policyConfig,
					client,
					sessionKeys,
					agentId,
					event,
					payload,
					...prepared ? { prepared } : {}
				});
			} catch {
				return false;
			}
		},
		prepareSessionEventProjection(event, payload, eventScope) {
			const projection = sessionRowProjection;
			if (!projection) return;
			let projectedAgentRuns;
			let registrations = [];
			let projectRun;
			return (eventScope.prepareSessionProjection ?? prepareSessionEventProjection(projection))(event, payload, eventScope, {
				isCurrentProjection: (owner) => owner === sessionRowProjection,
				resolveAgentScope: (key, agentId) => resolveSessionEventAgentScope(loadRuntimeConfig(), key, agentId),
				forgetAncestors: (key) => {
					if (key !== void 0) forgetAncestor(key);
					else ancestorReferences = /* @__PURE__ */ new WeakMap();
				},
				references: (client) => {
					let references = ancestorReferences.get(client);
					if (!references) {
						references = new SessionAncestorReferences();
						ancestorReferences.set(client, references);
					}
					return references;
				},
				forgetConnectionAncestors: (client) => ancestorReferences.delete(client),
				getRunProjector: () => {
					if (!projectRun || registrations.length !== chatAbortControllers.size || registrations.some(([runId, previous]) => {
						const current = chatAbortControllers.get(runId);
						return !current || current.sessionKey !== previous.sessionKey || current.sessionId !== previous.sessionId || current.agentId !== previous.agentId || current.projectSessionActive !== previous.projectSessionActive || current.controlUiVisible !== previous.controlUiVisible;
					}) || projectedAgentRuns !== projection.state.rowContext.projectedAgentRuns) {
						registrations = Array.from(chatAbortControllers, ([runId, entry]) => [runId, { ...entry }]);
						projectedAgentRuns = projection.state.rowContext.projectedAgentRuns;
						projectRun = createVisibleActiveSessionRunProjector({ chatAbortControllers: new Map(registrations) }, projectedAgentRuns);
					}
					return projectRun;
				}
			});
		},
		onBroadcast: (event, payload, opts) => eventWebPush.handleEvent(event, payload, opts ? {
			agentId: opts.agentId,
			sessionKeys: opts.sessionKeys
		} : void 0)
	});
	const mentionInbox = createMentionInbox({
		scheduler: params.scheduler,
		gatewayInstanceId: params.bootId,
		getRuntimeConfig: loadRuntimeConfig,
		*getClients() {
			for (const client of clients) if (!client.invalidated && client.socket.readyState === 1 && (client.connect.role ?? "operator") === "operator") yield client;
		},
		broadcastToConnIds: gatewayBroadcaster.broadcastToConnIds,
		onMentionCreated: eventWebPush.deliverMention
	});
	const agentRunSeq = /* @__PURE__ */ new Map();
	const dedupe = /* @__PURE__ */ new Map();
	const chatRunState = createChatRunState(isConnectionActive);
	const chatRunRegistry = chatRunState.registry;
	const addChatRun = chatRunRegistry.add;
	const removeChatRun = chatRunRegistry.remove;
	const chatAbortControllers = /* @__PURE__ */ new Map();
	const chatQueuedTurns = /* @__PURE__ */ new Map();
	const toolEventRecipients = chatRunState.toolEventRecipients;
	return {
		getSessionRowProjection: () => sessionRowProjection,
		attachSessionRowProjection(projection) {
			sessionRowProjection = projection;
			ancestorReferences = /* @__PURE__ */ new WeakMap();
			const unsubscribe = sessionChanges.subscribeFacts((change) => {
				if ("all" in change) ancestorReferences = /* @__PURE__ */ new WeakMap();
				else if (change.factsInvalidated || change.facts && change.facts.kind !== "unchanged") forgetAncestor(change.sessionKey);
			});
			return () => {
				unsubscribe();
				if (sessionRowProjection === projection) {
					sessionRowProjection = void 0;
					ancestorReferences = /* @__PURE__ */ new WeakMap();
				}
			};
		},
		clients,
		forgetConnectionAncestors,
		connectionWork: new GatewayConnectionWork(),
		mentionInbox,
		isConnectionActive,
		...gatewayBroadcaster,
		agentRunSeq,
		dedupe,
		chatRunState,
		addChatRun,
		removeChatRun,
		chatAbortControllers,
		chatQueuedTurns,
		toolEventRecipients,
		sessionEventSubscribers,
		sessionMessageSubscribers
	};
}
//#endregion
//#region src/gateway/server-transport-bridge.ts
/** Late-bound transport facts consumed by the socket-free Gateway kernel. */
function createGatewayTransportBridge() {
	let current;
	return {
		attach: (transport) => {
			current = transport;
		},
		current: () => current,
		getPortalService: () => current?.portalService,
		getTailscaleIngressEndpoint: () => current?.getTailscaleIngressEndpoint(),
		getMcpAppSandboxPort: () => current?.getMcpAppSandboxPort(),
		ensureSandboxHostPort: async () => {
			if (!current) throw new Error("Gateway listener must start before the sandbox host");
			return await current.ensureSandboxHostPort();
		}
	};
}
//#endregion
//#region src/gateway/server/event-loop-health.ts
const EVENT_LOOP_MONITOR_RESOLUTION_MS = 20;
const EVENT_LOOP_DELAY_WARN_MS = 1e3;
const EVENT_LOOP_UTILIZATION_WARN = .95;
const CPU_CORE_RATIO_WARN = .9;
const PERSISTENT_DEGRADATION_WARN_AFTER_MS = 6e4;
const LOAD_DEGRADATION_DELAY_COEVIDENCE_MS = 25;
const SUSTAINED_LOAD_SAMPLE_MIN_INTERVAL_MS = 1e3;
const WORKER_CPU_SAMPLE_BUDGET_MS = 100;
function roundMetric(value, digits = 3) {
	if (!Number.isFinite(value)) return 0;
	const factor = 10 ** digits;
	return Math.round(value * factor) / factor;
}
function nanosecondsToMilliseconds(value) {
	return roundMetric(value / 1e6, 1);
}
function readMainThreadCpuUsage() {
	try {
		const usage = isMainThread && typeof process.threadCpuUsage === "function" ? process.threadCpuUsage() : void 0;
		return cpuUsageDelta(usage, {
			user: 0,
			system: 0
		}) === void 0 ? void 0 : usage;
	} catch {
		return;
	}
}
function cpuUsageDelta(current, previous) {
	if (!current || !previous) return;
	const user = current.user - previous.user;
	const system = current.system - previous.system;
	return Number.isFinite(user + system) && user >= 0 && system >= 0 ? user + system : void 0;
}
function readHostCpuTimes() {
	try {
		const times = cpus().map((cpu) => cpu.times);
		return times.length && times.every((cpu) => [
			cpu.user,
			cpu.nice,
			cpu.sys,
			cpu.idle,
			cpu.irq
		].every((value) => Number.isFinite(value) && value >= 0)) ? times : void 0;
	} catch {
		return;
	}
}
function hostCpuUtilization(current, previous) {
	if (!current || !previous || current.length !== previous.length) return;
	let total = 0;
	let idle = 0;
	for (const [index, cpu] of current.entries()) {
		const before = previous[index];
		for (const key of [
			"user",
			"nice",
			"sys",
			"idle",
			"irq"
		]) {
			const delta = cpu[key] - before[key];
			if (delta < 0) return;
			total += delta;
			if (key === "idle") idle += delta;
		}
	}
	return total > 0 && Number.isFinite(total) ? roundMetric((total - idle) / total) : void 0;
}
function classifyGatewayEventLoopHealthReasons(metrics) {
	const reasons = [];
	if (metrics.delayP99Ms >= EVENT_LOOP_DELAY_WARN_MS || metrics.delayMaxMs >= EVENT_LOOP_DELAY_WARN_MS) reasons.push("event_loop_delay");
	if (metrics.intervalMs < SUSTAINED_LOAD_SAMPLE_MIN_INTERVAL_MS) return reasons;
	if (!(metrics.delayP99Ms >= LOAD_DEGRADATION_DELAY_COEVIDENCE_MS || metrics.delayMaxMs >= LOAD_DEGRADATION_DELAY_COEVIDENCE_MS)) return reasons;
	if (metrics.utilization >= EVENT_LOOP_UTILIZATION_WARN) reasons.push("event_loop_utilization");
	if (metrics.cpuCoreRatio >= CPU_CORE_RATIO_WARN) reasons.push("cpu");
	return reasons;
}
function createGatewayEventLoopHealthMonitor(deps) {
	const { scheduler } = deps;
	const nowMs = deps.now ?? performance.now.bind(performance);
	const readCpuUsage = deps.cpuUsage ?? process.cpuUsage.bind(process);
	const readEventLoopUtilization = deps.eventLoopUtilization ?? performance.eventLoopUtilization.bind(performance);
	let histogram = null;
	let lastSampleAt = nowMs();
	let lastWallAt = lastSampleAt;
	let lastCpuUsage = readCpuUsage();
	let lastMainThreadCpuUsage = readMainThreadCpuUsage();
	let lastHostCpuTimes = readHostCpuTimes();
	let lastEventLoopUtilization = readEventLoopUtilization();
	let lastSnapshot;
	let firstDegradedAtMs = null;
	let lastWorkerCpuWindow;
	let cancelWorkerCpuSample;
	const captureWorkerCpu = (at, health) => {
		cancelWorkerCpuSample?.();
		const previous = lastWorkerCpuWindow;
		lastWorkerCpuWindow = void 0;
		if (process.versions.bun || typeof Worker.prototype.cpuUsage !== "function") return;
		const { workers, revision } = getTrackedWorkerCpuSources();
		const accept = (usage) => {
			if (revision !== getTrackedWorkerCpuSources().revision) return;
			lastWorkerCpuWindow = {
				at,
				revision,
				usage
			};
			if (!health || lastSnapshot !== health || !previous || previous.revision !== revision || at - previous.at !== health.intervalMs) return;
			let total = 0;
			for (const [index, current] of usage.entries()) {
				const delta = cpuUsageDelta(current, previous.usage[index]);
				if (delta === void 0) return;
				total += delta;
			}
			const workerCoreRatio = roundMetric(total / (health.intervalMs * 1e3));
			const mainThreadCoreRatio = health.cpuBreakdown?.mainThreadCoreRatio;
			lastSnapshot = {
				...health,
				cpuBreakdown: {
					...health.cpuBreakdown,
					workerCoreRatio,
					...mainThreadCoreRatio === void 0 ? {} : { otherThreadsCoreRatio: roundMetric(Math.max(0, health.cpuCoreRatio - mainThreadCoreRatio - workerCoreRatio)) }
				}
			};
		};
		if (!workers.length) {
			accept([]);
			return;
		}
		let active = true;
		cancelWorkerCpuSample = () => {
			active = false;
		};
		const readings = workers.map(async (worker) => {
			try {
				return await worker.cpuUsage();
			} catch {
				return;
			}
		});
		Promise.all(readings).then((usage) => {
			if (!active || nowMs() - at > WORKER_CPU_SAMPLE_BUDGET_MS) return;
			const valid = usage.filter((value) => value !== void 0 && cpuUsageDelta(value, {
				user: 0,
				system: 0
			}) !== void 0);
			if (valid.length === workers.length) accept(valid);
		});
	};
	try {
		histogram = createHistogram({
			lowest: 1e3,
			figures: 3
		});
	} catch {
		histogram = null;
	}
	const sample = () => {
		if (!histogram) return;
		const now = nowMs();
		histogram.record(BigInt(Math.max(1, Math.round((now - lastSampleAt) * 1e6))));
		lastSampleAt = now;
		const intervalMs = Math.max(1, now - lastWallAt);
		const delayMaxMs = nanosecondsToMilliseconds(histogram.max);
		if (delayMaxMs < EVENT_LOOP_DELAY_WARN_MS && intervalMs < SUSTAINED_LOAD_SAMPLE_MIN_INTERVAL_MS) return;
		const delayP99Ms = nanosecondsToMilliseconds(histogram.percentile(99));
		const cpuUsage = readCpuUsage(lastCpuUsage);
		const currentEventLoopUtilization = readEventLoopUtilization();
		const utilization = roundMetric(readEventLoopUtilization(currentEventLoopUtilization, lastEventLoopUtilization).utilization);
		const cpuCoreRatio = roundMetric(roundMetric((cpuUsage.user + cpuUsage.system) / 1e3, 1) / intervalMs);
		const mainThreadCpuUsage = readMainThreadCpuUsage();
		const mainThreadDelta = cpuUsageDelta(mainThreadCpuUsage, lastMainThreadCpuUsage);
		lastMainThreadCpuUsage = mainThreadCpuUsage;
		const hostCpuTimes = readHostCpuTimes();
		const hostUtilization = hostCpuUtilization(hostCpuTimes, lastHostCpuTimes);
		lastHostCpuTimes = hostCpuTimes;
		const reasons = classifyGatewayEventLoopHealthReasons({
			intervalMs,
			delayP99Ms,
			delayMaxMs,
			utilization,
			cpuCoreRatio
		});
		const degraded = reasons.length > 0;
		if (degraded) firstDegradedAtMs ??= now;
		else firstDegradedAtMs = null;
		const health = {
			degraded,
			degradedSinceMs: firstDegradedAtMs === null ? null : Math.max(0, Math.round(now - firstDegradedAtMs)),
			reasons,
			intervalMs,
			delayP99Ms,
			delayMaxMs,
			utilization,
			cpuCoreRatio,
			cpuBreakdown: {
				...mainThreadDelta === void 0 ? {} : { mainThreadCoreRatio: roundMetric(mainThreadDelta / (intervalMs * 1e3)) },
				...hostUtilization === void 0 ? {} : { hostUtilization },
				...hostCpuTimes ? { hostCpuCount: hostCpuTimes.length } : {}
			}
		};
		histogram.reset();
		lastWallAt = now;
		lastCpuUsage = readCpuUsage();
		lastEventLoopUtilization = currentEventLoopUtilization;
		lastSnapshot = health;
		captureWorkerCpu(now, health);
		if (areDiagnosticsEnabledForProcess() && hasInternalDiagnosticEventInterest("gateway.event_loop.sample")) runWithDiagnosticTraceContext(void 0, () => emitInternalDiagnosticEvent({
			type: "gateway.event_loop.sample",
			intervalMs,
			delayMaxMs
		}));
	};
	const samplingJob = histogram ? scheduler.schedule({
		id: "event-loop-health",
		atMs: scheduler.now() + EVENT_LOOP_MONITOR_RESOLUTION_MS,
		everyMs: EVENT_LOOP_MONITOR_RESOLUTION_MS,
		run: sample
	}) : void 0;
	if (histogram) captureWorkerCpu(lastWallAt);
	const reset = () => {
		histogram?.reset();
		lastSampleAt = nowMs();
		lastWallAt = lastSampleAt;
		lastCpuUsage = readCpuUsage();
		lastMainThreadCpuUsage = readMainThreadCpuUsage();
		lastHostCpuTimes = readHostCpuTimes();
		lastEventLoopUtilization = readEventLoopUtilization();
		lastSnapshot = void 0;
		firstDegradedAtMs = null;
		cancelWorkerCpuSample?.();
		lastWorkerCpuWindow = void 0;
		if (histogram) captureWorkerCpu(lastWallAt);
	};
	return {
		snapshot: () => lastSnapshot,
		persistentDegradationSnapshot: () => {
			const current = lastSnapshot;
			return current?.degradedSinceMs != null && current.degradedSinceMs >= PERSISTENT_DEGRADATION_WARN_AFTER_MS ? current : void 0;
		},
		reset,
		stop: () => {
			samplingJob?.cancel();
			histogram = null;
			cancelWorkerCpuSample?.();
			lastWorkerCpuWindow = void 0;
			lastSnapshot = void 0;
			firstDegradedAtMs = null;
		}
	};
}
//#endregion
//#region src/gateway/server/presence-events.ts
const log$2 = createSubsystemLogger("gateway/presence");
/** One Gateway owns fixed publication windows; authoritative reads never wait for them. */
function createPresencePublisher(params) {
	const scheduler = params.scheduler.scope();
	let pending = false;
	let version = 0;
	const schedule = () => {
		if (!scheduler.signal.aborted && !pending) {
			pending = true;
			scheduler.schedule({
				id: "presence/publication",
				delayMs: 200,
				run: flush
			});
		}
	};
	const flush = async () => {
		let publishedVersion = version;
		try {
			for (let preparation = params.prepare(); preparation; preparation = params.prepare()) {
				await preparation;
				if (scheduler.signal.aborted) return;
			}
			publishedVersion = version;
			params.broadcast("presence", { presence: listSystemPresence() }, {
				dropIfSlow: true,
				stateVersion: {
					presence: publishedVersion,
					health: params.getHealthVersion()
				}
			});
		} catch (error) {
			log$2.warn(`Presence publication failed: ${formatErrorMessage(error)}`);
		} finally {
			pending = false;
			if (version !== publishedVersion) schedule();
		}
	};
	return {
		publish: () => {
			if (!scheduler.signal.aborted) {
				version = params.incrementPresenceVersion();
				schedule();
			}
		},
		stop: scheduler.beginClose
	};
}
//#endregion
//#region src/gateway/server/readiness.ts
const DEFAULT_READINESS_CACHE_TTL_MS = 1e3;
/** Startup waits for admission settlement; readiness retains its own agent policy. */
function createStartupChecker(deps, getAgentDatabaseAdmissionRefusals) {
	return () => {
		const uptimeMs = Date.now() - deps.startedAt;
		if (deps.getGatewayDraining?.()) return {
			ok: false,
			status: "draining",
			uptimeMs
		};
		const pendingReason = deps.getStartupPending?.() ? deps.getStartupPendingReason?.() ?? "startup-sidecars" : getAgentDatabaseAdmissionRefusals?.().some((refusal) => refusal.code === "agent-database-inspection-pending") ? "agent-database-inspection" : void 0;
		if (pendingReason !== void 0) return {
			ok: false,
			status: "starting",
			uptimeMs,
			pendingReason
		};
		return {
			ok: true,
			status: "started",
			uptimeMs
		};
	};
}
function shouldIgnoreReadinessFailure(accountSnapshot, health) {
	if (health.reason === "unmanaged" || health.reason === "stale-socket") return true;
	const restartableReason = health.reason === "not-running" || health.reason === "ingress-unavailable";
	const inRestartHandoff = accountSnapshot.restartPending === true && accountSnapshot.running !== true;
	return restartableReason && inRestartHandoff;
}
/** Create a cached readiness checker over channel runtime health. */
function createReadinessChecker(deps) {
	const { channelManager, startedAt } = deps;
	const getStartup = createStartupChecker(deps);
	const cacheTtlMs = Math.max(0, deps.cacheTtlMs ?? DEFAULT_READINESS_CACHE_TTL_MS);
	let cachedAt = 0;
	let cachedState = null;
	const readReadiness = (agentDatabases) => {
		const startup = getStartup();
		const uptimeMs = startup.uptimeMs;
		const now = startedAt + uptimeMs;
		if (startup.status === "starting") return {
			ready: false,
			failing: [startup.pendingReason],
			uptimeMs
		};
		if (startup.status === "draining") return {
			ready: false,
			failing: ["gateway-draining"],
			uptimeMs
		};
		const stateDatabaseFailure = deps.getStateDatabaseFailure?.();
		if (stateDatabaseFailure) {
			cachedState = null;
			return {
				ready: false,
				failing: ["state-database"],
				stateDatabase: { reason: stateDatabaseFailure.message },
				uptimeMs
			};
		}
		const failedAgents = agentDatabases?.filter((refusal) => deps.allowPendingAgentDatabases === false || refusal.code !== "agent-database-inspection-pending");
		if (failedAgents?.length) {
			cachedState = null;
			return {
				ready: false,
				failing: failedAgents.map(({ agentId }) => `agent-database:${agentId}`),
				uptimeMs
			};
		}
		const pluginReload = deps.getPluginReloadStatus?.();
		if (pluginReload) {
			cachedState = null;
			return {
				ready: false,
				failing: ["plugin-reload"],
				pluginReload,
				uptimeMs
			};
		}
		if (cachedState && !isFutureDateTimestampMs(cachedAt, { nowMs: now }) && now - cachedAt < cacheTtlMs) return {
			...cachedState,
			uptimeMs
		};
		if (deps.shouldSkipChannelReadiness?.()) return {
			ready: true,
			failing: [],
			uptimeMs
		};
		const snapshot = channelManager.getRuntimeSnapshot();
		const globallyAutostartSuppressed = channelManager.getAutostartSuppression() !== null;
		const failing = [];
		const suppressed = [];
		for (const [channelId, accounts] of Object.entries(snapshot.channelAccounts)) {
			if (!accounts) continue;
			const autostartSuppressed = globallyAutostartSuppressed || channelManager.isAmbientAutostartSuppressed(channelId);
			for (const accountSnapshot of Object.values(accounts)) {
				if (!accountSnapshot) continue;
				const health = evaluateChannelHealth(accountSnapshot, {
					now,
					staleEventThresholdMs: DEFAULT_CHANNEL_STALE_EVENT_THRESHOLD_MS,
					channelConnectGraceMs: DEFAULT_CHANNEL_CONNECT_GRACE_MS,
					channelId
				});
				if (!health.healthy && autostartSuppressed && health.reason === "not-running") {
					if (!suppressed.includes(channelId)) suppressed.push(channelId);
					continue;
				}
				if (!health.healthy && !shouldIgnoreReadinessFailure(accountSnapshot, health)) {
					failing.push(channelId);
					break;
				}
			}
		}
		cachedAt = now;
		cachedState = {
			ready: failing.length === 0,
			failing,
			...suppressed.length > 0 ? { suppressed } : {}
		};
		return {
			...cachedState,
			uptimeMs
		};
	};
	return () => {
		const agentDatabases = deps.getAgentDatabaseAdmissionRefusals?.();
		const result = readReadiness(agentDatabases);
		const getEventLoopHealth = deps.getEventLoopHealth;
		const eventLoop = getEventLoopHealth?.();
		return {
			...result,
			...agentDatabases?.length ? { agentDatabases } : {},
			...eventLoop ? { eventLoop } : {}
		};
	};
}
//#endregion
//#region src/gateway/server-runtime-state-prepare.ts
async function prepareGatewayKernelState(params) {
	const { bootstrap, scheduler, bootId, port, opts, log, logChannels, logHooks, logPlugins, gatewayRuntime, resolveChannelRuntime: getChannelRuntime, loadWorkerEnvironmentStartupModule, loadWorkerPlacementStartupModule } = params;
	const { pluginBootstrap, workerEnvironmentStartup, startupTrace, cfgAtStart, resolvedStartupAuthOverride, startupTailscaleOverride, ambientAutostartSuppressedChannelIds, minimalTestGateway, pluginGatewayContext, resolvePluginGatewayContext } = bootstrap;
	const pluginRuntime = Object.assign(params.pluginRegistryOwner, { baseGatewayMethods: pluginBootstrap.baseGatewayMethods });
	const listGatewayStartupChannelPlugins = (registry = pluginRuntime.registry) => listLoadedChannelPluginsForRegistry(registry);
	const desktopSessionRegistry = createDesktopSessionRegistry();
	const nodeDesktopStreamBroker = (await startupTrace.measure("node-desktop.runtime-import", () => import("./node-stream-broker-B8-C2-GL.mjs"))).createNodeDesktopStreamBroker();
	const hostDesktopService = (await startupTrace.measure("host-desktop.runtime-import", () => import("./host-source-DETvs-6O.mjs"))).createHostDesktopService({
		getConfig: () => getRuntimeConfig().desktop?.host,
		registry: desktopSessionRegistry
	});
	const gatewayComputerService = (await startupTrace.measure("computer.runtime-import", () => import("./computer-service-7JJpjGR0.mjs"))).createGatewayComputerService({
		getConfig: getRuntimeConfig,
		getPluginRegistry: () => pluginRuntime.registry,
		hostDesktopService
	});
	const workerEnvironmentRuntime = workerEnvironmentStartup ? await startupTrace.measure("worker-environments.runtime-imports", async () => {
		return await (await loadWorkerEnvironmentStartupModule()).createGatewayWorkerEnvironmentRuntime({
			scheduler,
			getPluginRegistry: () => pluginRuntime.registry,
			getPortalRuntime: () => pluginGatewayContext.current,
			resolveGatewayContext: resolvePluginGatewayContext,
			desktopSessionRegistry,
			nodeDesktopStreamBroker,
			startup: workerEnvironmentStartup,
			log
		});
	}) : {};
	const { workerEnvironmentService, workerLiveEvents, nodeWorkerGatewayNamespace, nodeWorkerBundleRetention, runtimeInstall, bindDeviceNodeControl, bindWorkerNodeDesktopControl, bindNodeWorkspaceBindingResolver, handleNodeWorkerBundleTransferRequest, handleWorkerBootstrapArtifactTransferRequest, handleNodeWorkspaceTransferRequest } = workerEnvironmentRuntime;
	const workerDispatchAuthority = { revoke: (_params) => {
		throw new Error("Worker dispatch authority revocation is not ready");
	} };
	const workerPlacementModule = workerEnvironmentStartup ? await startupTrace.measure("worker-environments.placement-module", loadWorkerPlacementStartupModule) : void 0;
	const getCommittedRuntimeConfig = () => {
		const context = resolvePluginGatewayContext();
		if (!context) throw new GatewayOperatorAccessUnavailableError();
		return (context.getCommittedRuntimeConfig ?? context.getRuntimeConfig)();
	};
	const githubPublicationRuntime = workerEnvironmentStartup && workerPlacementModule ? workerPlacementModule.createGatewayGitHubPublicationRuntime({
		placements: workerEnvironmentStartup.placementStore,
		getCommittedRuntimeConfig,
		warn: (message) => log.warn(message)
	}) : void 0;
	const workerPlacement = workerEnvironmentService && workerEnvironmentStartup && nodeWorkerGatewayNamespace && workerPlacementModule ? await startupTrace.measure("worker-environments.placement-runtime", async () => workerPlacementModule.createGatewayWorkerPlacementRuntime({
		scheduler,
		placements: workerEnvironmentStartup.placementStore,
		getCommittedRuntimeConfig,
		environments: workerEnvironmentService,
		gatewayNamespace: nodeWorkerGatewayNamespace,
		nodeWorkerBundleRetention,
		getSessionChangeContext: () => pluginGatewayContext.current,
		persistAbandonedPartial: async ({ sessionId, sessionKey, agentId, runId }) => {
			const text = connectionState.chatRunState.resolveBuffer(runId, { final: true }).text;
			if (!text.trim()) return;
			const { captureAbortedPartial, persistAbortedPartials } = await import("./chat-transcript-persistence.runtime.js");
			await persistAbortedPartials({
				context: { logGateway: log },
				snapshots: [captureAbortedPartial({
					sessionKey,
					sessionId,
					agentId,
					runId,
					text,
					abortOrigin: "placement-abandon"
				})]
			});
		},
		cancelSessionWork: async (request) => {
			const context = pluginGatewayContext.current;
			if (!context) throw new Error("Worker session cancellation is not ready");
			const { cancelGatewayWorkerSessionWork } = await import("./server-worker-placement-cancel-DVP9DewO.mjs");
			await cancelGatewayWorkerSessionWork(context, request);
		},
		revokeSessionAuthority: (request) => workerDispatchAuthority.revoke(request),
		info: (message) => log.info(message),
		warn: (message) => log.warn(message),
		...githubPublicationRuntime ? { githubPublicationRuntime } : {}
	})) : void 0;
	const workerPlacementRuntime = workerPlacement ? {
		...workerPlacement,
		runtimeInstall
	} : void 0;
	if (workerPlacementRuntime && workerEnvironmentService) {
		const { createDevicePlacementDemandReader } = await import("./device-placement-demand-6Z3QTZJ7.mjs");
		Object.assign(workerPlacementRuntime.dispatchService, { getAdmittedDeviceSessionCounts: createDevicePlacementDemandReader({
			resolveGatewayContext: resolvePluginGatewayContext,
			placements: workerPlacementRuntime.placements,
			environments: workerEnvironmentService
		}) });
		bindNodeWorkspaceBindingResolver?.(workerPlacementRuntime.resolveNodeWorkspaceBinding);
		workerEnvironmentRuntime.bindWorkerSessionDispatch?.(workerPlacementRuntime.dispatchService.dispatch);
	}
	const bindDeviceNodeRuntime = bindDeviceNodeControl ? (transport) => {
		bindDeviceNodeControl(transport);
		workerPlacementRuntime?.bindNodeWorkerSupervisorTransport(transport);
	} : void 0;
	const workerPlacementControlAvailable = workerPlacementRuntime?.dispatchService;
	const channelLogs = Object.fromEntries(listGatewayStartupChannelPlugins().map((plugin) => [plugin.id, logChannels.child(plugin.id)]));
	const channelRuntimeEnvs = Object.fromEntries(Object.entries(channelLogs).map(([id, logger]) => [id, runtimeForLogger(logger)]));
	const listStartupChannelGatewayMethods = (registry = pluginRuntime.registry) => {
		const methods = [];
		for (const plugin of listGatewayStartupChannelPlugins(registry)) {
			methods.push(...plugin.gatewayMethods ?? []);
			for (const descriptor of plugin.gatewayMethodDescriptors ?? []) methods.push(descriptor.name);
		}
		return methods;
	};
	const listActiveGatewayMethods = (nextBaseGatewayMethods) => uniqueStrings([...nextBaseGatewayMethods, ...listStartupChannelGatewayMethods()]).filter((method) => (workerPlacementControlAvailable || method !== "sessions.dispatch") && (workerPlacementControlAvailable || method !== "sessions.reclaim" && method !== "sessions.move") && (workerEnvironmentService || method !== "desktop.launch" && method !== "worker.desktop.observe" && method !== "worker.desktop.launch"));
	const runtimeConfig = await startupTrace.measure("runtime.config", async () => {
		const { resolveGatewayRuntimeConfig } = await import("./server-runtime-config-BsU0LcxA.mjs");
		return resolveGatewayRuntimeConfig({
			cfg: cfgAtStart,
			port,
			bind: opts.bind,
			host: opts.host,
			controlUiEnabled: opts.controlUiEnabled,
			auth: resolvedStartupAuthOverride,
			tailscale: startupTailscaleOverride
		});
	});
	const { bindHost, controlUiEnabled, controlUiBasePath, controlUiRoot: controlUiRootOverride, resolvedAuth, tailscaleConfig, tailscaleMode } = runtimeConfig;
	if (bootstrap.generatedStartupAuthToken && isLoopbackHost(bindHost)) {
		const { ensureStartupLocalCliPairing } = await startupTrace.measure("runtime.local-cli-pairing-import", () => import("./startup-local-cli-pairing-EWV7rISb.mjs"));
		const pairingResult = await startupTrace.measure("runtime.local-cli-pairing", () => ensureStartupLocalCliPairing());
		if (pairingResult === "created") log.info("runtime-only gateway auth paired the local CLI device before readiness");
		else if (pairingResult === "unavailable") log.warn("runtime-only gateway auth could not prepare local CLI device credentials; configure gateway.auth.token or gateway.auth.password for CLI access");
	}
	const getResolvedAuth = () => resolveGatewayAuth({
		authConfig: getActiveSecretsRuntimeConfigSnapshot()?.config.gateway?.auth ?? getRuntimeConfig().gateway?.auth,
		authOverride: resolvedStartupAuthOverride,
		env: process.env,
		tailscaleMode
	});
	const resolveSharedGatewaySessionGenerationForConfig = (config) => resolveSharedGatewaySessionGeneration(resolveGatewayAuth({
		authConfig: config.gateway?.auth,
		authOverride: resolvedStartupAuthOverride,
		env: process.env,
		tailscaleMode
	}), config.gateway?.trustedProxies);
	const resolveCurrentSharedGatewaySessionGeneration = () => resolveSharedGatewaySessionGeneration(getResolvedAuth(), getRuntimeConfig().gateway?.trustedProxies);
	const resolveSharedGatewaySessionGenerationForRuntimeSnapshot = () => resolveSharedGatewaySessionGenerationForConfig(getRuntimeConfig());
	const sharedGatewaySessionGenerationState = new SharedGatewaySessionGenerationState({
		current: resolveCurrentSharedGatewaySessionGeneration(),
		required: null
	});
	const initialHooksConfig = runtimeConfig.hooksConfig;
	const initialHookClientIpConfig = resolveHookClientIpConfig(cfgAtStart);
	const rateLimitConfig = cfgAtStart.gateway?.auth?.rateLimit;
	const authRateLimiter = createGatewayAuthRateLimiter(rateLimitConfig, {
		scheduler,
		id: "auth/main"
	});
	const browserAuthRateLimiter = createGatewayAuthRateLimiter({
		...rateLimitConfig,
		exemptLoopback: false
	}, {
		scheduler,
		id: "auth/browser"
	});
	const nodeReapprovalCoordinator = createNodeReapprovalCoordinator(rateLimitConfig, { scheduler });
	const controlUiRootLifecycle = await startupTrace.measure("control-ui.root", () => createGatewayControlUiRootLifecycle({
		controlUiRootOverride,
		controlUiEnabled,
		gatewayRuntime,
		log
	}));
	const { createTerminalLaunchPolicy } = await startupTrace.measure("terminal.launch-import", () => import("./launch-mdZZvail.mjs"));
	const terminalLaunchPolicy = createTerminalLaunchPolicy(cfgAtStart);
	const { runDefaultChannelSetupWizard, runDefaultSetupWizard } = await startupTrace.measure("gateway.wizard-imports", () => import("./wizard-C3azZY5y.mjs"));
	const wizardRunner = opts.wizardRunner ?? runDefaultSetupWizard;
	const channelWizardRunner = opts.channelWizardRunner ?? runDefaultChannelSetupWizard;
	const { wizardSessions, findRunningWizard, purgeWizardSession } = createWizardSessionTracker();
	const systemAgentSessions = /* @__PURE__ */ new Map();
	const deps = createDefaultDeps();
	const runtimeStateRef = { current: null };
	const cronStartState = { handled: false };
	const gatewayTls = await startupTrace.measure("tls.runtime", () => loadGatewayTlsServerRuntime(cfgAtStart.gateway?.tls, log.child("tls")));
	const serverStartedAt = Date.now();
	const readinessEventLoopHealth = createGatewayEventLoopHealthMonitor({ scheduler });
	const startupState = {
		sidecarsReady: minimalTestGateway,
		pendingReason: "startup-sidecars",
		dispatchReady: false
	};
	const lifecycle = { closePreludeStarted: false };
	const startupAccountStarts = createDeferredCore();
	const gatewayInstanceRuntimeRef = { current: void 0 };
	const { createChannelManager } = await startupTrace.measure("gateway.channel-manager-import", () => import("./server-channels-CiQPjQ2M.mjs"));
	const channelManager = createChannelManager({
		scheduler,
		getRuntimeConfig,
		resolveGatewayContext: resolvePluginGatewayContext,
		channelLogs,
		channelRuntimeEnvs,
		resolveChannelRuntime: getChannelRuntime,
		getPluginRegistry: () => pluginRuntime.registry,
		startupTrace,
		deferStartupAccountStartsUntil: startupAccountStarts.promise,
		getNativeApprovalRuntime: () => gatewayInstanceRuntimeRef.current?.nativeApprovals,
		ambientAutostartSuppressedChannelIds,
		...opts.tryRecoverChannelAutostartSuppression ? { tryRecoverAutostartSuppression: opts.tryRecoverChannelAutostartSuppression } : {},
		isClosing: () => lifecycle.closePreludeStarted
	});
	channelManager.setAutostartSuppression(opts.channelAutostartSuppression ?? null);
	const sidecarStartup = opts.sidecarStartup ?? "start";
	const isGatewayStartupPending = () => !startupState.sidecarsReady && !lifecycle.closePreludeStarted;
	const startupCheckerDeps = {
		startedAt: serverStartedAt,
		getStartupPending: isGatewayStartupPending,
		getStartupPendingReason: () => startupState.pendingReason,
		getGatewayDraining: () => lifecycle.closePreludeStarted || isGatewayWorkAdmissionClosed()
	};
	const getStartup = createStartupChecker(startupCheckerDeps, listAgentDatabaseAdmissionRefusals);
	const getReadiness = createReadinessChecker({
		channelManager,
		...startupCheckerDeps,
		getEventLoopHealth: readinessEventLoopHealth.snapshot,
		getStateDatabaseFailure: () => openClawStateDatabaseCache.getOpenClawStateDatabaseRecordedFailure(resolveDatabasePath()),
		allowPendingAgentDatabases: !opts.updateCanary,
		getAgentDatabaseAdmissionRefusals: () => {
			const cfg = getRuntimeConfig();
			return listAgentDatabaseAdmissionRefusals().filter((refusal) => !canIsolateAgentDatabase(cfg, refusal.agentId));
		},
		getPluginReloadStatus: params.getPluginReloadStatus,
		shouldSkipChannelReadiness: isChannelStartupSuppressedByEnvironment
	});
	const watchNodeRequestHandler = {};
	log.info("starting HTTP server...");
	const connectionState = await startupTrace.measure("runtime.state", () => createGatewayConnectionState({
		scheduler,
		bootId,
		cfg: cfgAtStart,
		getRuntimeConfig
	}));
	const transportBridge = createGatewayTransportBridge();
	const presencePublisher = createPresencePublisher({
		scheduler,
		broadcast: connectionState.broadcast,
		incrementPresenceVersion,
		getHealthVersion,
		prepare: () => {
			const projection = connectionState.getSessionRowProjection();
			return projection?.needsMembershipPreparation() ? projection.prepareMembership() : void 0;
		}
	});
	const createHttpTransportOptions = () => ({
		scheduler: params.scheduler,
		cfg: cfgAtStart,
		getRuntimeConfig,
		bindHost,
		port,
		controlUiEnabled: opts.controlUiEnabled,
		controlUiBasePath,
		controlUiRoot: controlUiRootLifecycle.state,
		openAiChatCompletionsEnabled: opts.openAiChatCompletionsEnabled,
		openResponsesEnabled: opts.openResponsesEnabled,
		resolvedAuth,
		rateLimiter: authRateLimiter,
		joinRateLimiter: browserAuthRateLimiter,
		isTerminalEnabled: terminalLaunchPolicy.isEnabled,
		gatewayTls,
		getResolvedAuth,
		hooksConfig: () => runtimeStateRef.current === null ? initialHooksConfig : runtimeStateRef.current.hooksConfig,
		getHookClientIpConfig: () => runtimeStateRef.current?.hookClientIpConfig ?? initialHookClientIpConfig,
		pluginRegistry: pluginRuntime.registry,
		getPluginRouteRegistry: () => pluginRuntime.registry,
		isStartupPluginRuntimeReady: () => startupState.sidecarsReady,
		getGatewayRequestContext: resolvePluginGatewayContext,
		deps,
		log,
		logHooks,
		logPlugins,
		getReadiness,
		getStartup,
		isStartupPending: isGatewayStartupPending,
		handleWatchNodeRequest: async (req, res) => await watchNodeRequestHandler.current?.(req, res) ?? false,
		handleNodeWorkerBundleTransferRequest,
		handleWorkerBootstrapArtifactTransferRequest,
		handleNodeWorkspaceTransferRequest,
		workerIngressEnabled: Boolean(workerEnvironmentService),
		desktopSessionRegistry,
		nodeDesktopStreamBroker,
		clients: connectionState.clients,
		tailscaleMode
	});
	return {
		...bootstrap,
		scheduler,
		bootId,
		pluginRuntime,
		workerEnvironmentService,
		workerLiveEvents,
		bindDeviceNodeControl: bindDeviceNodeRuntime,
		bindWorkerNodeDesktopControl,
		workerDispatchAuthority,
		workerPlacementRuntime,
		githubPublicationRuntime,
		githubPublicationService: githubPublicationRuntime?.coordinator,
		workerPlacementControlAvailable,
		desktopSessionRegistry,
		nodeDesktopStreamBroker,
		hostDesktopService,
		gatewayComputerService,
		channelLogs,
		channelRuntimeEnvs,
		listStartupChannelGatewayMethods,
		listActiveGatewayMethods,
		bindHost,
		controlUiRootLifecycle,
		controlUiBasePath,
		resolvedAuth,
		tailscaleConfig,
		tailscaleMode,
		getResolvedAuth,
		resolveSharedGatewaySessionGenerationForConfig,
		resolveSharedGatewaySessionGenerationForRuntimeSnapshot,
		sharedGatewaySessionGenerationState,
		initialHooksConfig,
		initialHookClientIpConfig,
		authRateLimiter,
		browserAuthRateLimiter,
		nodeReapprovalCoordinator,
		terminalLaunchPolicy,
		wizardRunner,
		channelWizardRunner,
		wizardSessions,
		findRunningWizard,
		purgeWizardSession,
		systemAgentSessions,
		deps,
		runtimeStateRef,
		cronStartState,
		gatewayTls,
		readinessEventLoopHealth,
		startupState,
		lifecycle,
		releaseStartupAccountStarts: startupAccountStarts.resolve,
		gatewayInstanceRuntimeRef,
		channelManager,
		sidecarStartup,
		isGatewayStartupPending,
		pluginGatewayContext,
		watchNodeRequestHandler,
		createHttpTransportOptions,
		transportBridge,
		...connectionState,
		publishPresence: presencePublisher.publish,
		stopPresencePublications: presencePublisher.stop
	};
}
//#endregion
//#region src/gateway/startup-control-ui-origins.ts
/**
* Seeds runtime-only Control UI origins when a non-loopback gateway bind would
* otherwise reject the browser that just opened the local UI.
*/
async function maybeSeedControlUiAllowedOriginsAtStartup(params) {
	const seeded = ensureControlUiAllowedOriginsForNonLoopbackBind(params.config, {
		isContainerEnvironment,
		runtimeBind: params.runtimeBind,
		runtimePort: params.runtimePort
	});
	if (!seeded.seededOrigins || !seeded.bind) return {
		config: params.config,
		seededAllowedOrigins: false
	};
	params.log.info(`gateway: seeded gateway.controlUi.allowedOrigins ${JSON.stringify(seeded.seededOrigins)} for bind=${seeded.bind} (required since v2026.2.26; see issue #29385). Applied for this runtime without writing config; add other origins to gateway.controlUi.allowedOrigins if needed.`);
	return {
		config: seeded.config,
		seededAllowedOrigins: true
	};
}
//#endregion
//#region src/gateway/server-startup-bootstrap.ts
async function prepareGatewayServerBootstrap(input) {
	try {
		var _usingCtx$1 = _usingCtx();
		const { port, opts, log, logSecrets, loadWorkerEnvironmentStartupModule } = input;
		const { assertConfiguredWorkspaceStateReady } = await import("./workspace-state-dirs-C4Mg9nzg.mjs");
		process.env.OPENCLAW_GATEWAY_PORT = String(port);
		const envBeforeStartupConfigLoad = { ...process.env };
		const formatRuntimeGatewayAuthTokenWarning = input.formatRuntimeGatewayAuthTokenWarning;
		const traceOriginAt = opts.processStartedAt ?? opts.startupStartedAt;
		const startupElapsedMs = typeof traceOriginAt === "number" ? Math.max(0, Date.now() - traceOriginAt) : 0;
		const startupTrace = createGatewayStartupTrace(log, performance.now() - startupElapsedMs, opts.updateCanary);
		const startupTraceOwner = _usingCtx$1.u({
			transferred: false,
			[Symbol.dispose]() {
				if (!this.transferred) startupTrace.close();
			}
		});
		if (startupElapsedMs > 0) startupTrace.mark("process.bootstrap");
		const startupConfigSnapshotRead = await withArtifactPreservingStateReads(async () => {
			if (!resumeGatewayRestartTraceFromEnv(process.env, [["source", "env"]])) {
				const restartHandoff = readGatewayRestartHandoffSync();
				resumeGatewayRestartTraceFromHandoff(restartHandoff?.restartTrace, [
					["source", restartHandoff?.source],
					["restartKind", restartHandoff?.restartKind],
					["supervisorMode", restartHandoff?.supervisorMode]
				]);
			}
			const read = opts.startupConfigSnapshotRead ?? await startupTrace.measure("config.snapshot.read", () => readConfigFileSnapshotWithPluginMetadata({
				observe: false,
				measure: (name, run) => startupTrace.measure(name, run)
			}));
			await assertConfiguredWorkspaceStateReady({ cfg: captureConfigOverrideApplier()(read.snapshot.config) });
			return read;
		});
		const inspectStateOwnership = async (signal) => {
			normalizeStateDirEnv(process.env);
			await assertOpenClawStateWriteAllowedAtPath({
				databasePath: resolveOpenClawStateSqlitePath(process.env),
				env: process.env,
				signal
			});
		};
		await withSqliteReadOnlyWorkerScope(async () => {
			await startupTrace.measure("state.ownership", () => opts.startupOperation ? opts.startupOperation(inspectStateOwnership) : inspectStateOwnership());
			const { OPENCLAW_DATABASE_SCHEMA_DOCS_URL, OpenClawDatabaseSchemaPreflightError, preflightOpenClawDatabaseSchemas } = await startupTrace.measure("state.runtime-imports", () => import("./openclaw-database-preflight-ClnnU5e8.mjs"));
			const inspectDatabaseSchemas = (signal) => preflightOpenClawDatabaseSchemas({
				signal,
				env: process.env,
				reuseStartupSchemaPreparation: true,
				onAgentInspection: (stats) => startupTrace.detail("state.schema-preflight", Object.entries(stats))
			});
			const databaseSchemas = await startupTrace.measure("state.schema-preflight", () => opts.startupOperation ? opts.startupOperation(inspectDatabaseSchemas) : inspectDatabaseSchemas());
			if (databaseSchemas.incompatible.length > 0) throw new OpenClawDatabaseSchemaPreflightError(databaseSchemas.incompatible);
			for (const database of databaseSchemas.indeterminate) log.warn("database schema preflight could not inspect database; continuing to real open", {
				kind: database.kind,
				path: database.path,
				reason: database.reason,
				docsUrl: OPENCLAW_DATABASE_SCHEMA_DOCS_URL
			});
		});
		const { ensureGlobalUndiciEnvProxyDispatcher } = await startupTrace.measure("runtime.network-imports", () => import("./undici-global-dispatcher-Bc52ZoF-.mjs"));
		await startupTrace.measure("runtime.network-bootstrap", ensureGlobalUndiciEnvProxyDispatcher);
		const minimalTestGateway = isVitestRuntimeEnv() && process.env.OPENCLAW_TEST_MINIMAL_GATEWAY === "1";
		const ambientEnvTriggers = opts.ambientEnvTriggers ?? "suppress";
		logAcceptedEnvOption({
			key: "OPENCLAW_RAW_STREAM",
			description: "raw stream logging enabled"
		});
		logAcceptedEnvOption({
			key: "OPENCLAW_RAW_STREAM_PATH",
			description: "raw stream log path override"
		});
		if (!minimalTestGateway && !opts.updateCanary) await startupTrace.measure("runtime.agent-cli", () => prepareGatewayAgentCliShim());
		const startupConfigModulePromise = startupTrace.measure("config.runtime-imports", () => import("./server-startup-config-C-CwKwXh.mjs"));
		const loadStartupPluginsModule = createLazyPromise(() => import("./server-startup-plugins-CkEW30_b.mjs"), { cacheRejections: true });
		const { applyGatewayAuthOverridesForStartupPreflight, loadGatewayStartupConfigSnapshot } = await startupConfigModulePromise;
		const startupConfigLoad = await startupTrace.measure("config.snapshot", () => loadGatewayStartupConfigSnapshot({
			minimalTestGateway,
			ambientEnvTriggers,
			log,
			measure: (name, run) => startupTrace.measure(name, run),
			initialSnapshotRead: startupConfigSnapshotRead
		}));
		const configSnapshot = startupConfigLoad.snapshot;
		const startupAuthOverride = opts.auth ? structuredClone(opts.auth) : void 0;
		const startupTailscaleOverride = opts.tailscale ? structuredClone(opts.tailscale) : void 0;
		const controlUiSeed = minimalTestGateway ? {
			config: configSnapshot.config,
			seededAllowedOrigins: false
		} : await startupTrace.measure("control-ui.seed", () => maybeSeedControlUiAllowedOriginsAtStartup({
			config: configSnapshot.config,
			log,
			runtimeBind: opts.bind,
			runtimePort: port
		}));
		if (controlUiSeed.seededAllowedOrigins) copyConfigResolutionFacts(configSnapshot.config, controlUiSeed.config);
		const startupConfigSnapshot = controlUiSeed.seededAllowedOrigins ? {
			...configSnapshot,
			runtimeConfig: controlUiSeed.config,
			config: controlUiSeed.config
		} : configSnapshot;
		const emitSecretsStateEvent = (code, message, cfg) => {
			const text = `[${code}] ${message}`;
			try {
				const target = resolveSystemMainSessionTarget(cfg);
				enqueueSystemEvent(text, withSystemEventOwner({
					sessionKey: target.sessionKey,
					contextKey: code
				}, target.agentId));
			} catch (error) {
				logSecrets.warn(`${text} not delivered: ${formatErrorMessage(error)}`);
			}
		};
		const { createRuntimeSecretsActivator } = await startupConfigModulePromise;
		const activateRuntimeSecrets = createRuntimeSecretsActivator({
			logSecrets,
			emitStateEvent: emitSecretsStateEvent,
			beforeSnapshotPublication: async (config) => {
				const { publishCanonicalUserChannelPolicy } = await import("./user-channel-identity-operations-BGvZWIy5.mjs");
				await publishCanonicalUserChannelPolicy(config?.gateway, config?.commands?.ownerAllowFrom);
			},
			...startupConfigLoad.pluginMetadataSnapshot ? { pluginMetadataSnapshot: startupConfigLoad.pluginMetadataSnapshot } : {}
		});
		const startupActivationSourceConfig = configSnapshot.sourceConfig;
		const startupRuntimeConfig = captureConfigOverrideApplier()(startupConfigSnapshot.config);
		startupTrace.setConfig(startupRuntimeConfig);
		const { prepareGatewayStartupConfig } = await import("./server-startup-config-helpers-DQq9EQGE.mjs");
		const authBootstrap = await startupTrace.measure("config.auth", () => prepareGatewayStartupConfig({
			configSnapshot: startupConfigSnapshot,
			authOverride: startupAuthOverride,
			tailscaleOverride: startupTailscaleOverride,
			activateRuntimeSecrets,
			log,
			measure: (name, run, measureOptions) => startupTrace.measure(name, run, measureOptions)
		}), { omitErrorMessage: true });
		const cfgAtStart = authBootstrap.cfg;
		startupTrace.setConfig(cfgAtStart);
		if (!opts.updateCanary) try {
			const cleanup = await startupTrace.measure("agents.github-profile-cleanup", async () => {
				const { cleanupRetiredManagedGitHubProfiles } = await import("./github-tool-profile-cleanup-BQXPL02k.mjs");
				return await cleanupRetiredManagedGitHubProfiles({
					config: cfgAtStart,
					env: process.env
				});
			});
			for (const warning of cleanup.warnings) log.warn(`managed GitHub profile cleanup: ${warning}`);
		} catch (error) {
			log.warn(`managed GitHub profile cleanup failed: ${formatErrorMessage(error)}`);
		}
		if (authBootstrap.generatedToken) log.warn(formatRuntimeGatewayAuthTokenWarning());
		const trustedProxyDeviceAutoApprove = cfgAtStart.gateway?.auth?.trustedProxy?.deviceAutoApprove;
		if (cfgAtStart.gateway?.auth?.mode === "trusted-proxy" && trustedProxyDeviceAutoApprove?.enabled === true && trustedProxyDeviceAutoApprove.scopes?.some((scope) => scope.trim() === "operator.admin")) log.warn("SECURITY WARNING: gateway.auth.trustedProxy.deviceAutoApprove.scopes includes operator.admin; every proxy-authenticated user can auto-approve a new operator device with full admin, and requests without scopes receive full admin automatically. Remove operator.admin and grant admin per identity via gateway.auth.identityScopes instead.");
		const resolvedStartupAuthOverride = startupAuthOverride ? Object.fromEntries([
			"mode",
			"token",
			"password",
			"allowTailscale",
			"rateLimit",
			"trustedProxy"
		].flatMap((key) => {
			if (startupAuthOverride[key] === void 0) return [];
			if ((key === "token" || key === "password") && isSecretRef(startupAuthOverride[key])) return [];
			const resolvedValue = cfgAtStart.gateway?.auth?.[key];
			return resolvedValue === void 0 ? [] : [[key, structuredClone(resolvedValue)]];
		})) : void 0;
		const startupAuthSecretRefOverride = startupAuthOverride ? {
			...isSecretRef(startupAuthOverride.token) ? { token: structuredClone(startupAuthOverride.token) } : {},
			...isSecretRef(startupAuthOverride.password) ? { password: structuredClone(startupAuthOverride.password) } : {}
		} : void 0;
		const reloadAuthOverride = authBootstrap.generatedToken ? mergeGatewayAuthConfig(resolvedStartupAuthOverride, { token: authBootstrap.generatedToken }) : resolvedStartupAuthOverride;
		setDiagnosticsEnabledForProcess(isDiagnosticsEnabled(cfgAtStart));
		setGatewayRestartPolicy({ allowExternal: isRestartEnabled(cfgAtStart) });
		setPreRestartDeferralCheck(() => createGatewayActiveWorkSnapshot().counts.totalActive);
		const seededControlUiAllowedOrigins = controlUiSeed.seededAllowedOrigins ? cfgAtStart.gateway?.controlUi?.allowedOrigins : void 0;
		const applyFixedGatewayOverlays = (config) => {
			const runtimeConfig = applyGatewayAuthOverridesForStartupPreflight(config, {
				auth: authBootstrap.generatedToken && config.gateway?.auth?.mode === void 0 ? {
					mode: authBootstrap.auth.mode,
					...reloadAuthOverride
				} : reloadAuthOverride,
				tailscale: startupTailscaleOverride
			});
			if (!seededControlUiAllowedOrigins || runtimeConfig.gateway?.controlUi?.allowedOrigins !== void 0 || resolveControlUiAllowedOrigins(runtimeConfig).length > 0) return runtimeConfig;
			const withOrigins = {
				...runtimeConfig,
				gateway: {
					...runtimeConfig.gateway,
					controlUi: {
						...runtimeConfig.gateway?.controlUi,
						allowedOrigins: seededControlUiAllowedOrigins
					}
				}
			};
			copyConfigResolutionFacts(runtimeConfig, withOrigins);
			return withOrigins;
		};
		const applyReloadableGatewayAuthRefs = (config) => {
			if (!startupAuthSecretRefOverride?.token && !startupAuthSecretRefOverride?.password) return config;
			const next = {
				...config,
				gateway: {
					...config.gateway,
					auth: mergeGatewayAuthConfig(config.gateway?.auth, startupAuthSecretRefOverride)
				}
			};
			copyConfigResolutionFactsExcept(config, next, [...startupAuthSecretRefOverride.token !== void 0 ? ["gateway.auth.token"] : [], ...startupAuthSecretRefOverride.password !== void 0 ? ["gateway.auth.password"] : []]);
			return next;
		};
		const prepareReloadCandidate = async (params) => {
			const previousSourceConfig = params.previousSourceConfig ?? getRuntimeConfigSourceSnapshot() ?? configSnapshot.sourceConfig;
			assertGatewayConfigEnvSelectionUnchanged(previousSourceConfig, params.sourceConfig);
			const runtimeEnv = prepareConfigRuntimeEnv({
				previousConfig: previousSourceConfig,
				nextConfig: params.sourceConfig
			});
			const metadata = startupConfigLoad.pluginMetadataSnapshot;
			const activationConfig = minimalTestGateway ? params.sourceConfig : resolveGatewayReloadPluginActivationCandidate({
				sourceConfig: params.sourceConfig,
				env: runtimeEnv.env,
				...metadata?.manifestRegistry ? { manifestRegistry: metadata.manifestRegistry } : {},
				discovery: metadata?.discovery,
				ambientEnvTriggers
			});
			const applyCandidateOverrides = captureConfigOverrideApplier();
			const reapplyCompareOverlays = (config) => {
				const applied = applyCandidateOverrides(mergeActivationSectionsIntoRuntimeConfig({
					runtimeConfig: config,
					activationConfig
				}));
				copyConfigResolutionFacts(config, applied);
				return applied;
			};
			const reapplyRuntimeOverlays = (config) => applyFixedGatewayOverlays(applyReloadableGatewayAuthRefs(reapplyCompareOverlays(config)));
			const runtimeConfig = reapplyRuntimeOverlays(params.runtimeConfig);
			await assertConfiguredWorkspaceStateReady({
				cfg: runtimeConfig,
				env: runtimeEnv.env
			});
			return {
				runtimeConfig,
				compareConfig: reapplyCompareOverlays(params.sourceConfig),
				runtimeEnv,
				reapplyRuntimeOverlays,
				reapplyCompareOverlays
			};
		};
		setAppliedRuntimeConfigSnapshot(cfgAtStart, configSnapshot.sourceConfig);
		applyLoggingConfig(cfgAtStart.logging);
		initializePublishedConfigRuntimeEnv(configSnapshot.sourceConfig, {
			ownedEnv: collectConfigRuntimeEnvOwnership(configSnapshot.sourceConfig, envBeforeStartupConfigLoad, process.env),
			preserveExistingOwnership: true
		});
		const workerEnvironmentStartup = minimalTestGateway || opts.updateCanary ? void 0 : await startupTrace.measure("worker-environments.store-import", async () => {
			return await (await loadWorkerEnvironmentStartupModule()).loadGatewayWorkerEnvironmentStartupState();
		});
		const { prepareGatewayPluginBootstrap, runGatewayStartupMaintenance } = await startupTrace.measure("plugins.bootstrap-imports", loadStartupPluginsModule);
		const pluginGatewayContext = { current: void 0 };
		const resolvePluginGatewayContext = () => pluginGatewayContext.current;
		if (opts.updateCanary) log.warn("candidate gateway: session catalogs and maintenance deferred until activation");
		else await startupTrace.measure("startup.maintenance", () => runGatewayStartupMaintenance({
			cfgAtStart,
			startupRuntimeConfig,
			minimalTestGateway,
			log
		}));
		publishSystemEventStoreConfig(cfgAtStart);
		const pluginBootstrap = await startupTrace.measure("plugins.bootstrap", async () => {
			if (!opts.updateCanary) {
				const { initSubagentRegistry } = await import("./subagent-registry-DXEFX54X.mjs");
				await initSubagentRegistry();
			}
			return prepareGatewayPluginBootstrap({
				cfgAtStart,
				activationSourceConfig: startupActivationSourceConfig,
				pluginMetadataSnapshot: startupConfigLoad.pluginMetadataSnapshot,
				workerProviderIds: workerEnvironmentStartup?.durableProviderIds ?? [],
				minimalTestGateway,
				ambientEnvTriggers,
				log
			});
		});
		const { gatewayPluginConfigAtStart, defaultWorkspaceDir, pluginWorkspaceDir, startupPluginIds, pluginManifestRecords, pluginMetadataSnapshot, pluginLookUpTable, baseMethods, ambientAutostartSuppressedChannelIds } = pluginBootstrap;
		copyConfigResolutionFacts(cfgAtStart, gatewayPluginConfigAtStart);
		setAppliedRuntimeConfigSnapshot(gatewayPluginConfigAtStart, configSnapshot.sourceConfig);
		const coreGatewayMethodNames = listCoreGatewayMethodNames();
		const existingPluginMetadataSnapshot = getGatewayPluginMetadataSnapshot();
		const currentPluginMetadataSnapshot = existingPluginMetadataSnapshot ?? pluginMetadataSnapshot;
		if (existingPluginMetadataSnapshot) selectCurrentPluginMetadataCache(getPluginMetadataSnapshotCache(existingPluginMetadataSnapshot));
		else setGatewayPluginMetadataSnapshot(currentPluginMetadataSnapshot, {
			config: startupActivationSourceConfig,
			compatibleConfigs: [
				startupRuntimeConfig,
				cfgAtStart,
				gatewayPluginConfigAtStart
			],
			env: process.env,
			workspaceDir: pluginWorkspaceDir
		});
		if (pluginLookUpTable) {
			const metrics = pluginLookUpTable.metrics;
			startupTrace.detail("plugins.lookup-table", [
				["registrySnapshotMs", metrics.registrySnapshotMs],
				["manifestRegistryMs", metrics.manifestRegistryMs],
				["startupPlanMs", metrics.startupPlanMs],
				["ownerMapsMs", metrics.ownerMapsMs],
				["totalMs", metrics.totalMs],
				["indexPlugins", String(metrics.indexPluginCount)],
				["indexPluginCount", metrics.indexPluginCount],
				["manifestPlugins", String(metrics.manifestPluginCount)],
				["manifestPluginCount", metrics.manifestPluginCount],
				["startupPlugins", String(metrics.startupPluginCount)],
				["startupPluginCount", metrics.startupPluginCount]
			]);
		}
		startupTraceOwner.transferred = true;
		return {
			opts,
			minimalTestGateway,
			ambientEnvTriggers,
			startupTrace,
			loadStartupPluginsModule,
			configSnapshot,
			startupConfigLoad,
			startupActivationSourceConfig,
			startupRuntimeConfig,
			cfgAtStart,
			generatedStartupAuthToken: authBootstrap.generatedToken !== void 0,
			resolvedStartupAuthOverride,
			startupTailscaleOverride,
			applyFixedGatewayOverlays,
			prepareReloadCandidate,
			workerEnvironmentStartup,
			pluginGatewayContext,
			resolvePluginGatewayContext,
			pluginBootstrap,
			gatewayPluginConfigAtStart,
			defaultWorkspaceDir,
			pluginWorkspaceDir,
			startupPluginIds,
			pluginManifestRecords,
			pluginMetadataSnapshot: currentPluginMetadataSnapshot,
			pluginLookUpTable,
			baseMethods,
			ambientAutostartSuppressedChannelIds,
			coreGatewayMethodNames,
			activateRuntimeSecrets
		};
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		_usingCtx$1.d();
	}
}
//#endregion
//#region src/gateway/server-kernel.ts
const loadGatewayModelCatalogModule = createLazyRuntimeModule(() => import("./server-model-catalog-Ddvx5Igb.mjs"));
const bindGatewayModelCatalog = createLazyRuntimeMethodBinder(loadGatewayModelCatalogModule);
const loadWorkerEnvironmentStartupModule = createLazyRuntimeModule(() => import("./server-worker-environment-startup-BGALN_Oh.mjs"));
const loadWorkerPlacementStartupModule = createLazyRuntimeModule(() => import("./server-worker-placement-startup-DUw8yKmm.mjs"));
const loadGatewayStartupEarlyModule = createLazyRuntimeModule(() => import("./server-startup-early-DXRtT8JE.mjs"));
const loadGatewayPluginBootstrapModule = createLazyRuntimeModule(() => import("./server-plugin-bootstrap-1F8xCAft.mjs"));
const loadGatewayShutdownModule = createLazyRuntimeModule(() => import("./server-shutdown.runtime.js"));
const log$1 = createSubsystemLogger("gateway");
const logDiscovery = log$1.child("discovery");
const logTailscale$1 = log$1.child("tailscale");
const logChannels$1 = log$1.child("channels");
const logHealth$1 = log$1.child("health");
const logCron$1 = log$1.child("cron");
const logReload$1 = log$1.child("reload");
const logHooks$1 = log$1.child("hooks");
const logPlugins = log$1.child("plugins");
const logWsControl$1 = log$1.child("ws");
const logSecrets = log$1.child("secrets");
const gatewayKernelLogs = {
	log: log$1,
	logTailscale: logTailscale$1,
	logChannels: logChannels$1,
	logHealth: logHealth$1,
	logCron: logCron$1,
	logReload: logReload$1,
	logHooks: logHooks$1,
	logWsControl: logWsControl$1
};
const gatewayRuntime = runtimeForLogger(log$1);
const getChannelRuntime = createLazyRuntimeModule(() => import("./runtime-channel-BONHx3V9.mjs").then(({ createRuntimeChannel }) => createRuntimeChannel()));
const loadGatewayModelCatalog = bindGatewayModelCatalog((mod) => mod.loadGatewayModelCatalog);
const loadGatewayModelCatalogSnapshot = bindGatewayModelCatalog((mod) => mod.loadGatewayModelCatalogSnapshot);
const readPreparedGatewayModelCatalog = bindGatewayModelCatalog((mod) => mod.readPreparedGatewayModelCatalog);
const readPreparedGatewayModelCatalogBatch = bindGatewayModelCatalog((mod) => mod.readPreparedGatewayModelCatalogBatch);
const loadPreparedGatewayModelCatalogSnapshot = bindGatewayModelCatalog((mod) => mod.loadPreparedGatewayModelCatalogSnapshot);
const readPreparedGatewayModelCatalogOwnerSnapshot = bindGatewayModelCatalog((mod) => mod.readPreparedGatewayModelCatalogOwnerSnapshot);
registerGatewayModelCatalogPrivateAccess(loadGatewayModelCatalogSnapshot, {
	loadDeferred: (params) => loadPreparedGatewayModelCatalogSnapshot(params),
	readPrepared: readPreparedGatewayModelCatalogOwnerSnapshot
});
function formatRuntimeGatewayAuthTokenWarning() {
	const base = "Gateway auth token was missing. Generated a runtime token for this startup without changing config; restart will generate a different token.";
	if (!isNixMode && resolveIsConfigReadOnly()) return `${base} Set gateway.auth.token in your external config source and redeploy.`;
	if (!isNixMode) return `${base} Persist one with \`openclaw config set gateway.auth.mode token\` and \`openclaw config set gateway.auth.token <token>\`.`;
	return [
		base,
		"In Nix mode, set gateway.auth.token in your Nix-managed OpenClaw config and rebuild.",
		"For the first-party Nix flow, see https://github.com/openclaw/nix-openclaw#quick-start and https://docs.openclaw.ai/install/nix."
	].join(" ");
}
/** Builds the Gateway kernel and internal dispatch surface without creating HTTP servers. */
async function createGatewayKernel(port = 18789, opts = {}, options = {}) {
	const scheduler = new GatewayScheduler();
	const sdkResourceHost = options.sdkResourceHost ?? new LegacyPluginSdkResourceHost();
	sdkResourceHost.bindScheduler(scheduler);
	return await sdkResourceHost.run(() => createGatewayKernelWithSdkHost(port, opts, options, sdkResourceHost, scheduler));
}
async function createGatewayKernelWithSdkHost(port, opts, options, sdkResourceHost, scheduler) {
	const suppliedBootId = opts.bootId;
	if (suppliedBootId !== void 0 && (suppliedBootId.trim() !== suppliedBootId || !suppliedBootId || suppliedBootId.length > 96)) throw new Error("Gateway boot ID must contain 1 to 96 characters");
	const bootId = suppliedBootId ?? randomUUID();
	captureRemoteModelCatalogStartupSnapshot();
	const { cancelPreparedModelRuntimeRefresh } = await import("./prepared-model-runtime-BnpMlDe5.mjs");
	ensureOpenClawCliOnPath();
	const pluginMetadata = retainGatewayPluginMetadata(scheduler, async () => {
		cancelPreparedModelRuntimeRefresh();
	});
	let pluginRegistryOwner;
	let lifecycleRuntime;
	let kernelState;
	let closeStartupTrace;
	let startupError;
	try {
		const bootstrap = await pluginMetadata.runBootstrap(() => prepareGatewayServerBootstrap({
			port,
			opts,
			log: log$1,
			logSecrets,
			loadWorkerEnvironmentStartupModule,
			formatRuntimeGatewayAuthTokenWarning
		}));
		closeStartupTrace = bootstrap.startupTrace.close;
		pluginRegistryOwner = createPluginRegistryOwner(bootstrap.pluginBootstrap.pluginRegistry, bootstrap.pluginBootstrap.pluginWorkspaceDir);
		pluginMetadata.publish(bootstrap.pluginMetadataSnapshot);
		const preparedPluginRegistryOwner = pluginRegistryOwner;
		const runtime = await bootstrap.startupTrace.measure("gateway.kernel-state", () => prepareGatewayKernelState({
			bootstrap,
			scheduler,
			bootId,
			pluginRegistryOwner: preparedPluginRegistryOwner,
			getPluginReloadStatus: () => lifecycleRuntime?.kernel.pluginRuntimeGeneration.getReloadStatus(),
			port,
			opts,
			log: log$1,
			logChannels: logChannels$1,
			logHooks: logHooks$1,
			logPlugins,
			gatewayRuntime,
			resolveChannelRuntime: getChannelRuntime,
			loadWorkerEnvironmentStartupModule,
			loadWorkerPlacementStartupModule
		}));
		kernelState = runtime;
		bindLegacyPluginSdkResourceHost(runtime.resolvePluginGatewayContext, sdkResourceHost);
		const shutdownRuntime = await runtime.startupTrace.measure("gateway.shutdown-runtime-import", async () => (await loadGatewayShutdownModule()).prepareGatewayShutdownRuntime());
		const preparedLifecycleRuntime = await runtime.startupTrace.measure("gateway.lifecycle", () => prepareGatewayLifecycle({
			runtime,
			sdkResourceHost,
			pluginMetadata,
			port,
			log: log$1,
			logCron: logCron$1,
			shutdownRuntime
		}));
		lifecycleRuntime = preparedLifecycleRuntime;
		const databaseStartupAdmission = getAgentDatabaseStartupAdmission();
		if (databaseStartupAdmission) preparedLifecycleRuntime.registerGatewayLifetimeSidecars(databaseStartupAdmission.adopt());
		await setTimeout$1(0, void 0, { signal: runtime.connectionWork.signal });
		runtime.connectionWork.signal.throwIfAborted();
		if (bootstrap.cfgAtStart.gateway?.tls?.enabled && !runtime.gatewayTls.enabled) throw new Error(runtime.gatewayTls.error ?? "gateway tls: failed to enable");
		const coreRuntime = await runtime.startupTrace.measure("gateway.core-runtime", () => startGatewayCoreRuntime({
			lifecycleRuntime: preparedLifecycleRuntime,
			port,
			log: log$1,
			logDiscovery,
			logHealth: logHealth$1,
			logChannels: logChannels$1,
			loadGatewayStartupEarlyModule,
			loadGatewayPluginBootstrapModule,
			loadGatewayModelCatalog,
			loadGatewayModelCatalogSnapshot,
			readPreparedGatewayModelCatalog,
			readPreparedGatewayModelCatalogBatch
		}));
		if (!options.deferEarlyRuntime) await coreRuntime.startEarlyRuntime();
		await pluginMetadata.waitForRetirement();
		return await runtime.startupTrace.measure("gateway.request-runtime", () => prepareGatewayKernelRequestRuntime({
			coreRuntime,
			log: log$1,
			logHealth: logHealth$1,
			hostLifecycle: opts.hostLifecycle
		}));
	} catch (error) {
		startupError = error;
	}
	return await rethrowGatewayStartupError(startupError, async () => {
		scheduler.beginClose();
		await pluginMetadata.beginClose();
		if (lifecycleRuntime) await lifecycleRuntime.closeOnStartupFailure();
		else {
			closeStartupTrace?.();
			await kernelState?.mentionInbox.dispose();
			await scheduler.stop();
			await sdkResourceHost.drainWork();
			const cleanupErrors = [];
			const releaseMetadata = async (retireRegistry) => {
				try {
					await sdkResourceHost.close();
				} catch (cleanupError) {
					if (hasRetainedPluginRuntimeCloseError(cleanupError)) throw cleanupError;
					cleanupErrors.push(cleanupError);
				}
				return pluginMetadata.close(async (retire) => {
					await closePreparedModelRuntimeSnapshots();
					await retire();
					for (const cleanup of [clearGatewayAgentCliShim, clearSecretsRuntimeSnapshotState]) try {
						cleanup();
					} catch (cleanupError) {
						cleanupErrors.push(cleanupError);
					}
				}, retireRegistry);
			};
			try {
				await (pluginRegistryOwner ? pluginRegistryOwner.close(releaseMetadata) : releaseMetadata());
			} catch (cleanupError) {
				cleanupErrors.push(cleanupError);
			}
			if (cleanupErrors.length === 1) throw cleanupErrors[0];
			if (cleanupErrors.length > 1) throw new AggregateError(cleanupErrors, "Gateway startup cleanup failed", { cause: cleanupErrors[0] });
		}
	});
}
//#endregion
//#region src/gateway/mcp-app-sandbox-http.ts
function handleMcpAppSandboxHttpRequest(req, res) {
	let url;
	try {
		url = new URL(req.url ?? "/", "http://localhost");
	} catch {
		respondPlainText(res, 400, "Bad Request");
		return true;
	}
	if (url.pathname !== "/mcp-app-sandbox" || req.method !== "GET" && req.method !== "HEAD") return false;
	let csp;
	try {
		csp = decodeSandboxHostCsp(url.searchParams.get("csp"));
	} catch {
		respondPlainText(res, 400, "invalid MCP App sandbox policy");
		return true;
	}
	const { html, headers, version } = buildSandboxHostDocument(csp);
	res.statusCode = 200;
	for (const [name, value] of Object.entries(headers)) res.setHeader(name, value);
	res.setHeader("Cache-Control", url.searchParams.get("v") === version ? "public, max-age=31536000, immutable" : "no-store");
	res.setHeader("Content-Length", String(Buffer.byteLength(html)));
	res.end(req.method === "HEAD" ? void 0 : html);
	return true;
}
/** Dedicated listener: only the proxy and explicitly public renderer assets, never Gateway data. */
function createSandboxHostHttpServer(tlsOptions, resolvePluginRegistry) {
	const readersByEpoch = /* @__PURE__ */ new WeakMap();
	const serveResource = async (req, res) => {
		const registry = resolvePluginRegistry?.();
		const epoch = registry ? capturePluginRegistryLifecycleEpoch(registry) : void 0;
		if (!registry || !epoch || req.method !== "GET" && req.method !== "HEAD") {
			respondPlainText(res, 404, "Not Found");
			return;
		}
		let readers = readersByEpoch.get(epoch);
		if (!readers) {
			readers = /* @__PURE__ */ new Map();
			for (const { definition } of registry.boardWidgetContentKinds.values()) {
				const read = definition.resources.readPublicResource;
				if (read) for (const resourcePath of definition.resources.paths) readers.set(resourcePath, read);
			}
			readersByEpoch.set(epoch, readers);
		}
		const pathname = new URL(req.url ?? "/", "http://localhost").pathname;
		const reader = readers.get(pathname);
		const resource = reader ? await reader(pathname) : void 0;
		if (!resource || resolvePluginRegistry?.() !== registry || !isPluginRegistryLifecycleEpochActive(registry, epoch)) {
			respondPlainText(res, 404, "Not Found");
			return;
		}
		res.statusCode = 200;
		res.setHeader("Content-Type", resource.contentType);
		res.setHeader("Content-Length", String(resource.body.byteLength));
		res.setHeader("Cache-Control", "no-cache");
		res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
		res.setHeader("X-Content-Type-Options", "nosniff");
		res.end(req.method === "HEAD" ? void 0 : resource.body);
	};
	const handler = (req, res) => {
		if (handleMcpAppSandboxHttpRequest(req, res)) return;
		if (!resolvePluginRegistry) {
			respondPlainText(res, 404, "Not Found");
			return;
		}
		serveResource(req, res).catch(() => respondPlainText(res, 503, "Renderer resource unavailable"));
	};
	return tlsOptions ? createServer$1(tlsOptions, handler) : createServer(handler);
}
//#endregion
//#region src/gateway/server-http-modules.ts
const getControlUiModule = createLazyRuntimeModule(() => import("./control-ui-hWxPfncQ.mjs"));
const getControlUiPluginAssetsModule = createLazyRuntimeModule(() => import("./control-ui-plugin-assets-Dw9jbnq4.mjs"));
const getCanvasServeModule = createLazyRuntimeModule(() => import("./serve.runtime.js"));
const getBoardHttpModule = createLazyRuntimeModule(() => import("./board-http-DGJ8snuP.mjs"));
const getEmbeddingsHttpModule = createLazyRuntimeModule(() => import("./embeddings-http-g-DE5ao7.mjs"));
const getManagedMediaAttachmentsModule = createLazyRuntimeModule(() => import("./managed-image-attachments-Dw1dKNTm.mjs"));
const getArtifactDownloadsModule = createLazyRuntimeModule(() => import("./artifact-downloads-FrxIRqZm.mjs"));
const getMcpAppStandaloneModule = createLazyRuntimeModule(() => import("./mcp-app-standalone-XDPJf6XU.mjs"));
const getModelsHttpModule = createLazyRuntimeModule(() => import("./models-http-DQOZ9aDH.mjs"));
const getOpenAiHttpModule = createLazyRuntimeModule(() => import("./openai-http-CFJs7bPH.mjs"));
const getOpenResponsesHttpModule = createLazyRuntimeModule(() => import("./openresponses-http-DjAmuFan.mjs"));
const getSessionHistoryHttpModule = createLazyRuntimeModule(() => import("./sessions-history-http-Da1m6CDZ.mjs"));
const getSessionKillHttpModule = createLazyRuntimeModule(() => import("./session-kill-http-D3kwWynW.mjs"));
const getToolsInvokeHttpModule = createLazyRuntimeModule(() => import("./tools-invoke-http-B67MKZB0.mjs"));
const getUserProfilesHttpModule = createLazyRuntimeModule(() => import("./user-profiles-http-B8yDjIfD.mjs"));
const getDevicePairingJoinHttpModule = createLazyRuntimeModule(() => import("./device-pairing-join-http-DF4gWA0L.mjs"));
const getPluginNodeCapabilityAuthModule = createLazyRuntimeModule(() => import("./plugin-node-capability-auth-B3LwZSTb.mjs"));
const getHttpAuthUtilsModule = createLazyRuntimeModule(() => import("./http-auth-utils-D2JcaFhq.mjs"));
const getPluginRouteRuntimeScopesModule = createLazyRuntimeModule(() => import("./plugin-route-runtime-scopes-Odc7xgNO.mjs"));
//#endregion
//#region src/channels/plugins/gateway-auth-bypass.ts
const GATEWAY_AUTH_API_ARTIFACT_BASENAME = "gateway-auth-api.js";
const MISSING_PUBLIC_SURFACE_PREFIX = "Unable to resolve bundled plugin public surface ";
/** Resolves to null when the plugin is not activated or ships no gateway auth artifact. */
async function loadChannelGatewayAuthApi(channelId) {
	try {
		return await tryLoadActivatedBundledPluginPublicSurfaceModule({
			dirName: channelId,
			artifactBasename: GATEWAY_AUTH_API_ARTIFACT_BASENAME
		});
	} catch (error) {
		if (error instanceof Error && error.message.startsWith(MISSING_PUBLIC_SURFACE_PREFIX)) return null;
		throw error;
	}
}
/**
* Resolves configured gateway auth bypass paths from a channel plugin artifact.
*/
async function resolveBundledChannelGatewayAuthBypassPaths(params) {
	return ((await loadChannelGatewayAuthApi(params.channelId))?.resolveGatewayAuthBypassPaths?.({ cfg: params.cfg }) ?? []).flatMap((path) => typeof path === "string" && path.trim() ? [path.trim()] : []);
}
//#endregion
//#region src/gateway/server-http-plugin-auth.ts
let pluginGatewayAuthBypassPathsCache = /* @__PURE__ */ new WeakMap();
registerPluginMetadataProcessMemoLifecycleClear(() => {
	pluginGatewayAuthBypassPathsCache = /* @__PURE__ */ new WeakMap();
});
async function resolvePluginGatewayAuthBypassPaths(configSnapshot) {
	const paths = /* @__PURE__ */ new Set();
	for (const channelId of Object.keys(configSnapshot.channels ?? {})) for (const path of await resolveBundledChannelGatewayAuthBypassPaths({
		channelId,
		cfg: configSnapshot
	})) paths.add(path);
	return paths;
}
function getCachedPluginGatewayAuthBypassPaths(configSnapshot) {
	const cache = pluginGatewayAuthBypassPathsCache;
	const cached = cache.get(configSnapshot);
	if (cached) return cached;
	const resolved = resolvePluginGatewayAuthBypassPaths(configSnapshot).catch((error) => {
		cache.delete(configSnapshot);
		throw error;
	});
	cache.set(configSnapshot, resolved);
	return resolved;
}
function shouldEnforceDefaultPluginGatewayAuth(pathContext) {
	return pathContext.malformedEncoding || pathContext.decodePassLimitReached || isProtectedPluginRoutePathFromContext(pathContext);
}
//#endregion
//#region src/gateway/server-http-upgrades.ts
function rejectUpgradeAuth(socket, auth) {
	if (auth.rateLimited) {
		const retryAfterSeconds = auth.retryAfterMs && auth.retryAfterMs > 0 ? Math.ceil(auth.retryAfterMs / 1e3) : void 0;
		const body = JSON.stringify({ error: {
			message: "Too many failed authentication attempts. Please try again later.",
			type: "rate_limited"
		} });
		rejectWebSocketUpgrade(socket, {
			status: 429,
			body: {
				contentType: "application/json; charset=utf-8",
				text: body
			},
			headers: retryAfterSeconds ? { "Retry-After": String(retryAfterSeconds) } : void 0
		});
		return;
	}
	if (auth.reason === "proxy_attribution_required") {
		const body = JSON.stringify({ error: {
			message: `Proxy client attribution is required. ${PROXY_ATTRIBUTION_GUIDANCE}`,
			type: PROXY_ATTRIBUTION_REQUIRED_REASON
		} });
		rejectWebSocketUpgrade(socket, {
			status: 403,
			body: {
				contentType: "application/json; charset=utf-8",
				text: body
			}
		});
		return;
	}
	rejectWebSocketUpgrade(socket, { status: 401 });
}
function handleBudgetedGatewayWebSocketUpgrade(params) {
	const { req, socket, head, wss, preauthConnectionBudget, preauthBudgetKey, ingressName } = params;
	const allowsRestartStartupPreauth = ingressName === "Gateway" && isGatewayRestartDraining() && getGatewaySuspendAdmissionPhase() === "accepting" && params.isStartupPending?.() === true;
	if (isGatewayWorkAdmissionClosed() && !allowsRestartStartupPreauth && (ingressName === "Worker" || !isGatewaySuspendControlAvailable())) {
		rejectGatewayUpgradeServiceUnavailable(socket, `${ingressName} websocket admission closed`);
		return;
	}
	if (wss.listenerCount("connection") === 0) {
		rejectGatewayUpgradeServiceUnavailable(socket, `${ingressName} websocket handlers unavailable`);
		return;
	}
	if (!preauthConnectionBudget.acquire(preauthBudgetKey)) {
		rejectGatewayUpgradeServiceUnavailable(socket, "Too many unauthenticated sockets");
		return;
	}
	let budgetTransferred = false;
	const releaseUpgradeBudget = () => {
		if (!budgetTransferred) {
			budgetTransferred = true;
			preauthConnectionBudget.release(preauthBudgetKey);
		}
	};
	socket.once("close", releaseUpgradeBudget);
	try {
		wss.handleUpgrade(req, socket, head, (ws) => {
			const ingressSocket = ws;
			ingressSocket["__openclawPreauthBudgetKey"] = preauthBudgetKey;
			params.prepareSocket?.(ingressSocket);
			wss.emit("connection", ws, req);
			if (ingressSocket["__openclawPreauthBudgetClaimed"]) {
				budgetTransferred = true;
				socket.off("close", releaseUpgradeBudget);
			}
		});
	} catch (error) {
		socket.off("close", releaseUpgradeBudget);
		releaseUpgradeBudget();
		throw error;
	}
}
/** Attaches WebSocket and plugin-upgrade routing to an already-created HTTP server. */
function attachGatewayUpgradeHandler(opts) {
	const { httpServer, wss, handlePluginUpgrade, shouldEnforcePluginGatewayAuth, resolvePluginNodeCapabilityRoute, clients, preauthConnectionBudget, resolvedAuth, rateLimiter, publicRateLimiter, workerIngressEnabled, log } = opts;
	const getResolvedAuth = opts.getResolvedAuth ?? (() => resolvedAuth);
	httpServer.on("upgrade", (req, socket, head) => {
		socket.once("error", () => socket.destroy());
		markGatewayIngressTransport(req, opts.ingressTransport ?? { kind: "ordinary" });
		const handleUpgrade = async () => {
			const configSnapshot = getRuntimeConfig();
			const trustedProxies = configSnapshot.gateway?.trustedProxies ?? [];
			const allowRealIpFallback = configSnapshot.gateway?.allowRealIpFallback === true;
			const ingressAttribution = prepareGatewayIngressAttribution({
				req,
				trustedProxies,
				allowRealIpFallback
			});
			const requestClientIp = ingressAttribution.kind === "unattributable-proxy" ? ingressAttribution.remoteAddress : ingressAttribution.clientIp;
			const originalRequestPath = URL.parse(req.url ?? "/", "http://localhost")?.pathname;
			const originalWorkerGatewayRoute = originalRequestPath ? classifyWorkerGatewayPath(originalRequestPath) : "outside";
			if (originalWorkerGatewayRoute !== "outside" && ingressAttribution.kind === "unattributable-proxy") {
				opts.reportUnattributableProxy?.(ingressAttribution);
				rejectUpgradeAuth(socket, {
					ok: false,
					reason: ingressAttribution.reason
				});
				return;
			}
			if (originalWorkerGatewayRoute === "worker" && !workerIngressEnabled) {
				rejectGatewayUpgradeServiceUnavailable(socket, "Worker websocket ingress unavailable");
				return;
			}
			if (originalWorkerGatewayRoute === "worker") {
				const rateCheck = publicRateLimiter?.check(requestClientIp, AUTH_RATE_LIMIT_SCOPE_WORKER_ADMISSION);
				if (rateCheck && !rateCheck.allowed) {
					rejectUpgradeAuth(socket, {
						ok: false,
						reason: "rate_limited",
						rateLimited: true,
						retryAfterMs: rateCheck.retryAfterMs
					});
					return;
				}
				try {
					handleBudgetedGatewayWebSocketUpgrade({
						req,
						socket,
						head,
						wss,
						preauthConnectionBudget,
						preauthBudgetKey: requestClientIp,
						ingressName: "Worker",
						prepareSocket: (workerSocket) => {
							workerSocket[GATEWAY_WS_CONNECTION_KIND_PROPERTY] = "worker";
							markPublicWorkerIngress(workerSocket, {
								clientIp: requestClientIp,
								rateLimiter: publicRateLimiter
							});
						}
					});
				} catch {
					throw new Error("public worker websocket upgrade failed");
				}
				return;
			}
			if (originalWorkerGatewayRoute !== "outside") {
				rejectWebSocketUpgrade(socket, { status: 404 });
				return;
			}
			const scopedNodeCapability = normalizePluginNodeCapabilityScopedUrl(req.url ?? "/");
			if (scopedNodeCapability.malformedScopedPath) {
				rejectUpgradeAuth(socket, {
					ok: false,
					reason: "unauthorized"
				});
				return;
			}
			if (scopedNodeCapability.rewrittenUrl) req.url = scopedNodeCapability.rewrittenUrl;
			const resolvedAuthLocal = getResolvedAuth();
			const requestPath = scopedNodeCapability.pathname;
			const pathContext = resolvePluginRoutePathContext(requestPath);
			if (classifyWorkerGatewayPath(requestPath) !== "outside") {
				rejectWebSocketUpgrade(socket, { status: 404 });
				return;
			}
			const nodeCapability = resolvePluginNodeCapabilityRoute?.(pathContext);
			if (ingressAttribution.kind === "unattributable-proxy") {
				opts.reportUnattributableProxy?.(ingressAttribution);
				if (nodeCapability || !opts.isPluginAuthenticatedRoute?.(pathContext)) {
					rejectUpgradeAuth(socket, {
						ok: false,
						reason: ingressAttribution.reason
					});
					return;
				}
			}
			if (nodeCapability) {
				const { authorizePluginNodeCapabilityRequest } = await getPluginNodeCapabilityAuthModule();
				const ok = await authorizePluginNodeCapabilityRequest({
					req,
					auth: resolvedAuthLocal,
					trustedProxies,
					allowRealIpFallback,
					clients,
					nodeCapability,
					capability: scopedNodeCapability.capability,
					malformedScopedPath: scopedNodeCapability.malformedScopedPath,
					rateLimiter
				});
				if (!ok.ok) {
					rejectUpgradeAuth(socket, ok);
					return;
				}
			}
			if (handlePluginUpgrade) {
				let pluginGatewayAuthSatisfied = false;
				let pluginGatewayRequestAuth;
				let pluginGatewayRequestOperatorScopes;
				if ((shouldEnforcePluginGatewayAuth ?? shouldEnforceDefaultPluginGatewayAuth)(pathContext) && !(await getCachedPluginGatewayAuthBypassPaths(configSnapshot)).has(requestPath)) {
					const { checkGatewayHttpRequestAuth } = await getHttpAuthUtilsModule();
					const authCheck = await checkGatewayHttpRequestAuth({
						req,
						auth: resolvedAuthLocal,
						trustedProxies,
						allowRealIpFallback,
						rateLimiter,
						cfg: configSnapshot,
						getRuntimeConfig,
						getResolvedAuth
					});
					if (!authCheck.ok) {
						rejectUpgradeAuth(socket, authCheck.authResult);
						return;
					}
					pluginGatewayAuthSatisfied = true;
					pluginGatewayRequestAuth = authCheck.requestAuth;
					const { resolvePluginRouteRuntimeOperatorScopes } = await getPluginRouteRuntimeScopesModule();
					pluginGatewayRequestOperatorScopes = resolvePluginRouteRuntimeOperatorScopes(req, authCheck.requestAuth);
				}
				if (pluginGatewayRequestAuth?.hasCurrentClientAuthority?.() === false) {
					rejectUpgradeAuth(socket, {
						ok: false,
						reason: "unauthorized"
					});
					return;
				}
				if (await handlePluginUpgrade(req, socket, head, pathContext, {
					gatewayAuthSatisfied: pluginGatewayAuthSatisfied,
					gatewayRequestAuth: pluginGatewayRequestAuth,
					gatewayRequestOperatorScopes: pluginGatewayRequestOperatorScopes,
					gatewayRequestClientIp: requestClientIp
				})) return;
			}
			if (ingressAttribution.kind === "unattributable-proxy") {
				rejectUpgradeAuth(socket, {
					ok: false,
					reason: ingressAttribution.reason
				});
				return;
			}
			if (requestPath === "/desktop/observe" || requestPath === "/desktop/audio") {
				if (!opts.desktopSessionRegistry) {
					rejectGatewayUpgradeServiceUnavailable(socket, "desktop observe unavailable");
					return;
				}
				if (isGatewayWorkAdmissionClosed()) {
					rejectGatewayUpgradeServiceUnavailable(socket, "Gateway websocket admission closed");
					return;
				}
				if (requestPath === "/desktop/audio") {
					const { handleDesktopAudioUpgrade } = await import("./audio-bridge-CDOMX2IZ.mjs");
					handleDesktopAudioUpgrade(req, socket, head);
					return;
				}
				const { handleDesktopObserveUpgrade } = await import("./observe-bridge-BLWwOQAC.mjs");
				handleDesktopObserveUpgrade(req, socket, head, { registry: opts.desktopSessionRegistry });
				return;
			}
			if (requestPath === "/node-desktop/attach" || requestPath === "/node-portal/attach") {
				const context = opts.getGatewayRequestContext?.();
				if (!opts.nodeDesktopStreamBroker || !context) {
					rejectGatewayUpgradeServiceUnavailable(socket, `node ${requestPath === "/node-desktop/attach" ? "desktop" : "portal"} attach unavailable`);
					return;
				}
				if (isGatewayWorkAdmissionClosed()) {
					rejectGatewayUpgradeServiceUnavailable(socket, "Gateway websocket admission closed");
					return;
				}
				await opts.nodeDesktopStreamBroker.handleUpgrade(req, socket, head, context.nodeRegistry);
				return;
			}
			try {
				handleBudgetedGatewayWebSocketUpgrade({
					req,
					socket,
					head,
					wss,
					preauthConnectionBudget,
					preauthBudgetKey: requestClientIp,
					ingressName: "Gateway",
					isStartupPending: opts.isStartupPending
				});
			} catch {
				throw new Error("gateway websocket upgrade failed");
			}
		};
		runHttpConnectionRequest(req, () => runWithDiagnosticTraceContext(createDiagnosticTraceContext(), handleUpgrade), "upgrade").catch((err) => {
			const remoteAddress = socket.remoteAddress ?? "unknown";
			const errorMessage = err instanceof Error ? err.message : String(err);
			log?.warn(`ws upgrade error from ${remoteAddress}: ${errorMessage}`);
			rejectWebSocketUpgrade(socket, { status: 503 });
		});
	});
}
//#endregion
//#region src/gateway/control-ui-image-http-routes.ts
/** Resource owners stay lazy until their authenticated image route is requested. */
const CONTROL_UI_IMAGE_HTTP_ROUTES = [
	[[
		"pluginIcon",
		"pluginActivityIcon",
		"catalogIcon",
		"linkFavicon"
	], createLazyRuntimeNamedExport(() => import("./plugin-icon-http-CTvMLB3v.mjs"), "handlePluginIconHttpRequest")],
	[["pluginThemeArt"], createLazyRuntimeNamedExport(() => import("./plugin-theme-art-http-BUxlt5tK.mjs"), "handlePluginThemeArtHttpRequest")],
	[["workspaceIcon"], createLazyRuntimeNamedExport(() => import("./workspace-icon-http-DjXIq_Tp.mjs"), "handleWorkspaceIconHttpRequest")],
	[["channelAvatar"], createLazyRuntimeNamedExport(() => import("./channel-avatar-http-4-wTxy6g.mjs"), "handleChannelAvatarHttpRequest")]
];
//#endregion
//#region src/gateway/control-ui-public-session.ts
const PUBLIC_SESSION_RATE_WINDOW_MS = 6e4;
const PUBLIC_SESSION_CLIENT_REQUEST_LIMIT = 20;
const PUBLIC_SESSION_PUBLICATION_REQUEST_LIMIT = 120;
const PUBLIC_SESSION_MAX_CLIENTS = 4096;
const PUBLIC_SESSION_MAX_PUBLICATIONS = 2048;
const PUBLIC_SESSION_MAX_CONCURRENT_READS = 8;
const PUBLIC_SESSION_MAX_CONCURRENT_READS_PER_PUBLICATION = 2;
function admitRateWindow(windows, key, limit, maxEntries, now) {
	const cutoff = now - PUBLIC_SESSION_RATE_WINDOW_MS;
	let window = windows.get(key);
	if (!window) {
		if (windows.size >= maxEntries) for (const [candidateKey, candidate] of windows) {
			candidate.timestamps = candidate.timestamps.filter((timestamp) => timestamp > cutoff);
			if (candidate.timestamps.length === 0) windows.delete(candidateKey);
		}
		if (windows.size >= maxEntries) pruneMapToMaxSize(windows, maxEntries - 1);
		window = { timestamps: [] };
		windows.set(key, window);
	}
	window.timestamps = window.timestamps.filter((timestamp) => timestamp > cutoff);
	const oldest = window.timestamps[0];
	if (window.timestamps.length >= limit && oldest !== void 0) return Math.max(1, oldest + PUBLIC_SESSION_RATE_WINDOW_MS - now);
	window.timestamps.push(now);
}
/** Creates the fixed, process-local abuse boundary for anonymous transcript reads. */
function createControlUiPublicSessionRequestGate() {
	const clientWindows = /* @__PURE__ */ new Map();
	const publicationWindows = /* @__PURE__ */ new Map();
	const activeByPublication = /* @__PURE__ */ new Map();
	const inFlight = /* @__PURE__ */ new Map();
	const configIds = /* @__PURE__ */ new WeakMap();
	let nextConfigId = 1;
	let activeReads = 0;
	const configId = (config) => {
		const existing = configIds.get(config);
		if (existing !== void 0) return existing;
		const created = nextConfigId++;
		configIds.set(config, created);
		return created;
	};
	return {
		admitClient(clientKey) {
			const retryMs = admitRateWindow(clientWindows, clientKey, PUBLIC_SESSION_CLIENT_REQUEST_LIMIT, PUBLIC_SESSION_MAX_CLIENTS, Date.now());
			return retryMs === void 0 ? { kind: "ok" } : {
				kind: "rate-limited",
				retryAfterSeconds: Math.ceil(retryMs / 1e3)
			};
		},
		async run(params) {
			const now = Date.now();
			const publicationRetryMs = admitRateWindow(publicationWindows, params.publicationKey, PUBLIC_SESSION_PUBLICATION_REQUEST_LIMIT, PUBLIC_SESSION_MAX_PUBLICATIONS, now);
			if (publicationRetryMs !== void 0) return {
				kind: "rate-limited",
				retryAfterSeconds: Math.ceil(publicationRetryMs / 1e3)
			};
			const inFlightKey = `${configId(params.config)}:${params.requestKey}`;
			const existing = inFlight.get(inFlightKey);
			if (existing) return {
				kind: "ok",
				value: await existing
			};
			const publicationActive = activeByPublication.get(params.publicationKey) ?? 0;
			if (activeReads >= PUBLIC_SESSION_MAX_CONCURRENT_READS || publicationActive >= PUBLIC_SESSION_MAX_CONCURRENT_READS_PER_PUBLICATION) return { kind: "unavailable" };
			activeReads += 1;
			activeByPublication.set(params.publicationKey, publicationActive + 1);
			const pending = Promise.resolve().then(params.work);
			inFlight.set(inFlightKey, pending);
			try {
				return {
					kind: "ok",
					value: await pending
				};
			} finally {
				inFlight.delete(inFlightKey);
				activeReads -= 1;
				const remaining = (activeByPublication.get(params.publicationKey) ?? 1) - 1;
				if (remaining > 0) activeByPublication.set(params.publicationKey, remaining);
				else activeByPublication.delete(params.publicationKey);
			}
		}
	};
}
function isControlUiPublicSessionPath(pathname, basePath) {
	return pathname === `${basePath}/share/session`;
}
function hasSingleHttpsForwardedProto(req) {
	const value = req.headers["x-forwarded-proto"];
	return typeof value === "string" && value.trim().toLowerCase() === "https";
}
async function serveControlUiPublicSession(req, res, url, basePath, cfg, requestGate, clientKey, secureIngress, publicOrigin) {
	res.setHeader("Cache-Control", "no-store");
	res.setHeader("X-Robots-Tag", "noindex, nofollow");
	res.setHeader("Content-Security-Policy", "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'");
	const unavailable = (status, retryAfterSeconds = 1) => {
		const body = status === 404 ? "This public session is unavailable." : status === 429 ? "Too many public session requests. Please retry later." : "This public session is temporarily unavailable. Please retry.";
		res.statusCode = status;
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		res.setHeader("Content-Length", Buffer.byteLength(body));
		if (status === 429 || status === 503) res.setHeader("Retry-After", String(retryAfterSeconds));
		res.end(req.method === "HEAD" ? void 0 : body);
	};
	const publicShare = parseControlUiPublicSessionShareUrl(url, basePath);
	const origin = resolveControlUiShareOrigin(req, publicOrigin);
	const offsetText = url.searchParams.get("offset") ?? "0";
	const offset = Number(offsetText);
	if (req.method !== "GET" && req.method !== "HEAD" || !publicShare || !origin || !cfg || url.searchParams.getAll("offset").length > 1 || !/^(?:0|[1-9][0-9]{0,9})$/u.test(offsetText)) {
		unavailable(404);
		return;
	}
	if (!secureIngress) {
		unavailable(404);
		return;
	}
	if (req.method === "HEAD") {
		res.statusCode = 405;
		res.setHeader("Allow", "GET");
		res.setHeader("Content-Length", "0");
		res.end();
		return;
	}
	const clientAdmission = requestGate.admitClient(clientKey);
	if (clientAdmission.kind === "rate-limited") {
		unavailable(429, clientAdmission.retryAfterSeconds);
		return;
	}
	try {
		const { resolvePublicSessionShareToken } = await import("./control-ui-public-session-token-CL2pX0tP.mjs");
		const locator = resolvePublicSessionShareToken(publicShare.token);
		if (!locator) {
			unavailable(404);
			return;
		}
		const { isPublicSessionShareActive, readPublicSessionShare } = await import("./control-ui-public-session-read-CpUN2JS_.mjs");
		const { renderPublicSessionDocument } = await import("./control-ui-public-session-render-LSuxBmWt.mjs");
		const admitted = await requestGate.run({
			publicationKey: locator.shareId,
			requestKey: JSON.stringify([
				createHash("sha256").update(publicShare.token).digest("base64url"),
				offset,
				origin
			]),
			config: cfg,
			work: async () => {
				const session = await readPublicSessionShare(cfg, locator, { offset });
				if (!session) return null;
				const latestUrl = buildControlUiPublicSessionSharePath({
					basePath,
					token: publicShare.token
				});
				const canonicalUrl = publicOrigin || req.socket instanceof TLSSocket ? `${origin}${latestUrl}` : void 0;
				return renderPublicSessionDocument({
					...session,
					latestUrl,
					...canonicalUrl ? { canonicalUrl } : {},
					isLatest: offset === 0,
					...session.olderOffset !== void 0 ? { olderUrl: `${latestUrl}&offset=${session.olderOffset}` } : {},
					cardUrl: `${origin}${basePath}/share/card.png`
				});
			}
		});
		if (admitted.kind === "rate-limited") {
			unavailable(429, admitted.retryAfterSeconds);
			return;
		}
		if (admitted.kind === "unavailable") {
			unavailable(503);
			return;
		}
		const body = admitted.value;
		if (!body || !isPublicSessionShareActive(cfg, locator)) {
			unavailable(404);
			return;
		}
		res.statusCode = 200;
		res.setHeader("Content-Type", "text/html; charset=utf-8");
		res.setHeader("Content-Length", Buffer.byteLength(body));
		res.end(body);
	} catch {
		unavailable(503);
	}
}
function createControlUiPublicSessionRoute() {
	const requestGate = createControlUiPublicSessionRequestGate();
	return {
		matches: isControlUiPublicSessionPath,
		reject(res) {
			respondNotFound(res);
			return true;
		},
		async serve(params) {
			const url = params.req.url ? new URL(params.req.url, "http://localhost") : void 0;
			if (!url) {
				respondNotFound(params.res);
				return true;
			}
			const publicOrigin = resolveGatewayPublicOrigin(params.config);
			const advertisedHttps = publicOrigin?.startsWith("https://") === true;
			const trustedProxyHttps = params.ingress.kind === "trusted-proxy" && advertisedHttps && hasSingleHttpsForwardedProto(params.req);
			const managedHttps = (params.ingress.kind === "tailscale-serve" || params.ingress.kind === "tailscale-funnel") && advertisedHttps;
			const secureIngress = params.req.socket instanceof TLSSocket || params.ingress.kind === "direct-local" && isLoopbackHost(resolveHostName(params.req.headers.host)) || trustedProxyHttps || managedHttps;
			await serveControlUiPublicSession(params.req, params.res, url, params.basePath, params.config, requestGate, params.ingress.rateLimit.subject.key, secureIngress, publicOrigin);
			return true;
		}
	};
}
//#endregion
//#region src/gateway/server-http-probes.ts
async function shouldIncludeGatewayProbeDetails(params) {
	if (readPreparedGatewayIngressAttribution(params.req)?.kind === "direct-local" || !readPreparedGatewayIngressAttribution(params.req) && isLocalDirectRequest(params.req)) return true;
	if (params.resolvedAuth.mode === "none") return false;
	const { getBearerToken, resolveHttpBrowserOriginPolicy } = await getHttpAuthUtilsModule();
	const bearerToken = getBearerToken(params.req);
	return (await authorizeHttpGatewayConnect({
		auth: params.resolvedAuth,
		connectAuth: bearerToken ? {
			token: bearerToken,
			password: bearerToken
		} : null,
		req: params.req,
		trustedProxies: params.trustedProxies,
		allowRealIpFallback: params.allowRealIpFallback,
		rateLimiter: params.rateLimiter,
		browserOriginPolicy: resolveHttpBrowserOriginPolicy(params.req)
	})).ok;
}
function startupProbeBody(result, includeDetails) {
	if (!includeDetails) return JSON.stringify({
		ok: result.ok,
		status: result.status
	});
	return JSON.stringify({
		ok: result.ok,
		status: result.status,
		version: resolveRuntimeServiceVersion(process.env),
		uptimeMs: result.uptimeMs,
		...result.status === "starting" ? { pendingReason: result.pendingReason } : {}
	});
}
/** Handles live/ready/startup probe endpoints before normal gateway routing. */
async function handleGatewayProbeRequest(req, res, requestPath, resolvedAuth, trustedProxies, allowRealIpFallback, rateLimiter, getReadiness, getStartup) {
	const status = classifyGatewayProbePath(requestPath);
	if (status === "namespace" || status === "outside") return false;
	const method = (req.method ?? "GET").toUpperCase();
	if (method !== "GET" && method !== "HEAD") {
		res.statusCode = 405;
		res.setHeader("Allow", "GET, HEAD");
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		res.end("Method Not Allowed");
		return true;
	}
	res.setHeader("Content-Type", "application/json; charset=utf-8");
	res.setHeader("Cache-Control", "no-store");
	let statusCode;
	let body;
	if (status === "ready" && getReadiness) {
		const includeDetails = await shouldIncludeGatewayProbeDetails({
			req,
			resolvedAuth,
			trustedProxies,
			allowRealIpFallback,
			rateLimiter
		});
		try {
			const result = getReadiness();
			statusCode = result.ready ? 200 : 503;
			body = JSON.stringify(includeDetails ? result : { ready: result.ready });
		} catch {
			statusCode = 503;
			body = JSON.stringify(includeDetails ? {
				ready: false,
				failing: ["internal"],
				uptimeMs: 0
			} : { ready: false });
		}
	} else if (status === "startup") {
		const includeDetails = await shouldIncludeGatewayProbeDetails({
			req,
			resolvedAuth,
			trustedProxies,
			allowRealIpFallback,
			rateLimiter
		});
		try {
			const result = getStartup?.() ?? {
				ok: true,
				status: "started",
				uptimeMs: 0
			};
			statusCode = result.ok ? 200 : 503;
			body = startupProbeBody(result, includeDetails);
		} catch {
			const result = {
				ok: false,
				status: "starting",
				uptimeMs: 0,
				pendingReason: "internal"
			};
			statusCode = 503;
			body = startupProbeBody(result, includeDetails);
		}
	} else {
		statusCode = 200;
		body = JSON.stringify({
			ok: true,
			status
		});
	}
	res.statusCode = statusCode;
	res.setHeader("Content-Length", String(Buffer.byteLength(body)));
	res.end(method === "HEAD" ? void 0 : body);
	return true;
}
//#endregion
//#region src/gateway/worker-environments/node-worker-bundle-transfer-http.ts
function handleNodeWorkerBundleTransferHttpRequest(params) {
	return handleArtifactTransferHttpRequest({
		...params,
		classifyPath: classifyNodeWorkerBundleTransferPath,
		routePrefix: `${NODE_WORKER_BUNDLE_TRANSFER_PATH}/bundles/`
	});
}
//#endregion
//#region src/gateway/worker-environments/worker-bootstrap-artifact-transfer-http.ts
function handleWorkerBootstrapArtifactTransferHttpRequest(params) {
	return handleArtifactTransferHttpRequest({
		...params,
		classifyPath: classifyWorkerBootstrapArtifactTransferPath,
		routePrefix: `${WORKER_BOOTSTRAP_ARTIFACT_TRANSFER_PATH}/artifacts/`
	});
}
//#endregion
//#region src/gateway/server-http.ts
/** Creates the gateway HTTP/HTTPS server and ordered request-stage router. */
function createGatewayHttpServer(opts) {
	const { clients, controlUiBasePath, controlUiRoot, handleHooksRequest, handlePluginRequest, shouldEnforcePluginGatewayAuth, resolvePluginNodeCapabilityRoute, resolvedAuth, rateLimiter, joinRateLimiter, getReadiness, getStartup } = opts;
	const getResolvedAuth = opts.getResolvedAuth ?? (() => resolvedAuth);
	const loadGatewayConfig = opts.getRuntimeConfig ?? getRuntimeConfig;
	const controlUiRouteBasePath = controlUiBasePath && controlUiBasePath !== "/" ? controlUiBasePath.replace(/\/$/, "") : "";
	const pluginAssetRoot = controlUiPluginAssetRoot(controlUiRouteBasePath);
	const publicSessionRoute = createControlUiPublicSessionRoute();
	const handleServerRequest = (req, res, expectation) => {
		markGatewayIngressTransport(req, opts.ingressTransport ?? { kind: "ordinary" });
		runHttpConnectionRequest(req, () => runWithDiagnosticTraceContext(createDiagnosticTraceContext(), () => handleRequest(req, res, expectation)), res).catch((error) => {
			console.error("[gateway-http] failed to finalize request:", error);
			if (!res.destroyed) res.destroy(error instanceof Error ? error : void 0);
		});
	};
	const httpServer = opts.testListener ?? (opts.tlsOptions ? createServer$1(opts.tlsOptions) : createServer());
	httpServer.on("request", handleServerRequest);
	httpServer.on("checkContinue", (req, res) => handleServerRequest(req, res, "continue"));
	httpServer.on("checkExpectation", (req, res) => handleServerRequest(req, res, "reject"));
	httpServer.on("connect", (req, socket) => {
		runHttpConnectionRequest(req, async () => {
			socket.destroy();
		}, "upgrade");
	});
	async function handleRequest(req, res, expectation) {
		if (getWebhookLegacyListener(req)) {
			try {
				if (!await handlePluginRequest?.(req, res) && !res.writableEnded && !res.destroyed) {
					res.writeHead(404);
					res.end();
				}
			} catch (error) {
				console.error("[gateway-http] legacy plugin request failed:", error);
				res.destroy(error instanceof Error ? error : void 0);
			}
			return;
		}
		setDefaultSecurityHeaders(res, getRuntimeConfigSnapshot()?.gateway?.http?.securityHeaders);
		if (expectation === "reject") {
			res.writeHead(417);
			res.end();
			return;
		}
		if (expectation === "continue") res.writeContinue();
		if (isWebSocketUpgradeRequest(req)) return;
		if (req.headers.upgrade !== void 0) {
			res.statusCode = 400;
			res.setHeader("Connection", "close");
			res.setHeader("Content-Type", "text/plain; charset=utf-8");
			res.end("Bad Request");
			return;
		}
		try {
			const requestPath = URL.parse(req.url ?? "/", "http://localhost")?.pathname;
			if (requestPath === void 0) {
				sendGatewayAuthFailure(res, {
					ok: false,
					reason: "unauthorized"
				});
				return;
			}
			if (classifyGatewayProbePath(requestPath) === "live") {
				await handleGatewayProbeRequest(req, res, requestPath, resolvedAuth, [], false, rateLimiter, getReadiness, getStartup);
				return;
			}
			const configSnapshot = loadGatewayConfig();
			const controlUiEnabled = opts.controlUiEnabled ?? configSnapshot.gateway?.controlUi?.enabled ?? true;
			const openAiChatCompletionsConfig = configSnapshot.gateway?.http?.endpoints?.chatCompletions;
			const openResponsesConfig = configSnapshot.gateway?.http?.endpoints?.responses;
			const openAiChatCompletionsEnabled = opts.openAiChatCompletionsEnabled ?? openAiChatCompletionsConfig?.enabled ?? false;
			const openResponsesEnabled = opts.openResponsesEnabled ?? openResponsesConfig?.enabled ?? false;
			const openAiCompatEnabled = openAiChatCompletionsEnabled || openResponsesEnabled;
			const trustedProxies = configSnapshot.gateway?.trustedProxies ?? [];
			const allowRealIpFallback = configSnapshot.gateway?.allowRealIpFallback === true;
			const ingressAttribution = prepareGatewayIngressAttribution({
				req,
				trustedProxies,
				allowRealIpFallback,
				tailscaleWhois: (ip) => readTailscaleWhoisIdentity(ip, void 0, {
					cacheTtlMs: 0,
					errorTtlMs: 0
				})
			});
			const scopedNodeCapability = normalizePluginNodeCapabilityScopedUrl(req.url ?? "/");
			if (scopedNodeCapability.malformedScopedPath) {
				sendGatewayAuthFailure(res, {
					ok: false,
					reason: "unauthorized"
				});
				return;
			}
			if (scopedNodeCapability.rewrittenUrl) req.url = scopedNodeCapability.rewrittenUrl;
			const scopedRequestPath = scopedNodeCapability.pathname;
			const pluginPathContext = resolvePluginRoutePathContext(scopedRequestPath);
			const nodeCapability = resolvePluginNodeCapabilityRoute?.(pluginPathContext);
			if (ingressAttribution.kind === "unattributable-proxy") {
				opts.reportUnattributableProxy?.(ingressAttribution);
				if (!nodeCapability && handlePluginRequest && opts.isPluginAuthenticatedRoute?.(pluginPathContext) && await handlePluginRequest(req, res, pluginPathContext, { gatewayRequestClientIp: ingressAttribution.remoteAddress })) return;
				sendGatewayAuthFailure(res, {
					ok: false,
					reason: ingressAttribution.reason
				});
				return;
			}
			const requestClientIp = ingressAttribution.clientIp;
			const resolvedAuthValue = getResolvedAuth();
			const routeAuth = {
				auth: resolvedAuthValue,
				cfg: configSnapshot,
				getRuntimeConfig: loadGatewayConfig,
				getResolvedAuth,
				trustedProxies,
				allowRealIpFallback,
				rateLimiter
			};
			const operatorAuth = () => ({
				...routeAuth,
				resolveGatewayContext: opts.getGatewayRequestContext?.()?.resolveGatewayContext
			});
			const controlUiRouteOptions = {
				basePath: controlUiBasePath,
				config: configSnapshot,
				...routeAuth
			};
			const loadControlUi = () => {
				const url = req.url ? new URL(req.url, "http://localhost") : void 0;
				return url && (url.pathname === resolveAssistantMediaRoutePath(controlUiBasePath) || classifyControlUiRequest({
					basePath: normalizeControlUiBasePath(controlUiBasePath),
					pathname: url.pathname,
					search: url.search,
					method: req.method,
					accept: req.headers.accept
				}).kind !== "not-control-ui") ? getControlUiModule() : void 0;
			};
			const handleControlUiRequest = async () => (await loadControlUi())?.handleControlUiHttpRequest(req, res, {
				...controlUiRouteOptions,
				terminalEnabled: opts.isTerminalEnabled?.() ?? isTerminalConfigEnabled(configSnapshot),
				agentId: resolveAssistantAgentId(configSnapshot),
				root: controlUiRoot
			}) ?? false;
			const handleStandaloneControlUiRequest = async () => {
				if (!controlUiEnabled || !await handleControlUiRequest()) respondNotFound(res);
				return true;
			};
			const requestStages = [() => handleGatewayProbeRequest(req, res, scopedRequestPath, resolvedAuthValue, trustedProxies, allowRealIpFallback, rateLimiter, getReadiness, getStartup)];
			const addRequestStage = (enabled, stage, admitted = false) => {
				if (enabled) requestStages.push(admitted ? () => runWithGatewayHttpWorkAdmission(res, stage) : stage);
			};
			const addAdmittedStage = (enabled, stage) => addRequestStage(enabled, stage, true);
			addRequestStage(classifyWorkerGatewayPath(scopedRequestPath) !== "outside", () => {
				respondNotFound(res);
				return true;
			});
			addAdmittedStage(classifyWorkerBootstrapArtifactTransferPath(scopedRequestPath) !== "outside", () => handleWorkerBootstrapArtifactTransferHttpRequest({
				req,
				res,
				clientIp: ingressAttribution.rateLimit.subject.key,
				rateLimiter: joinRateLimiter,
				callback: opts.handleWorkerBootstrapArtifactTransferRequest
			}));
			addAdmittedStage(classifyNodeWorkerBundleTransferPath(scopedRequestPath) !== "outside", () => handleNodeWorkerBundleTransferHttpRequest({
				req,
				res,
				clientIp: ingressAttribution.rateLimit.subject.key,
				rateLimiter: joinRateLimiter,
				callback: opts.handleNodeWorkerBundleTransferRequest
			}));
			addAdmittedStage(classifyNodeWorkspaceTransferPath(scopedRequestPath) !== "outside", () => handleNodeWorkspaceTransferHttpRequest({
				req,
				res,
				clientIp: ingressAttribution.rateLimit.subject.key,
				rateLimiter: joinRateLimiter,
				callback: opts.handleNodeWorkspaceTransferRequest
			}));
			const devicePairingJoinShortcode = parseDevicePairingJoinRequestPath(scopedRequestPath);
			if (devicePairingJoinShortcode !== null) addAdmittedStage(true, async () => (await getDevicePairingJoinHttpModule()).handleDevicePairingJoinHttpRequest({
				req,
				res,
				shortcode: devicePairingJoinShortcode,
				clientIp: ingressAttribution.rateLimit.subject.key,
				rateLimiter: joinRateLimiter
			}));
			addAdmittedStage(scopedRequestPath === PROVIDER_OAUTH_CALLBACK_PATH, () => handleProviderOAuthCallback(req, res));
			addAdmittedStage(scopedRequestPath.startsWith("/api/artifacts/download/") || controlUiRouteBasePath.length > 0 && scopedRequestPath.startsWith(`${controlUiRouteBasePath}/api/artifacts/download/`), async () => (await getArtifactDownloadsModule()).handleArtifactDownloadHttpRequest(req, res, {
				clients,
				basePath: controlUiRouteBasePath
			}));
			addAdmittedStage(req.method === "GET" && scopedRequestPath === "/oauth/mcp/callback" && Boolean(opts.handleMcpOAuthCallbackRequest), () => opts.handleMcpOAuthCallbackRequest?.(req, res) ?? false);
			addRequestStage(true, () => handleHooksRequest(req, res));
			addAdmittedStage(Boolean(opts.handleWatchNodeRequest) && scopedRequestPath.startsWith("/api/nodes/watch/"), () => opts.handleWatchNodeRequest?.(req, res) ?? false);
			addAdmittedStage(openAiCompatEnabled && (scopedRequestPath === "/v1/models" || scopedRequestPath.startsWith("/v1/models/")), async () => (await getModelsHttpModule()).handleOpenAiModelsHttpRequest(req, res, routeAuth));
			addAdmittedStage(openAiCompatEnabled && scopedRequestPath === "/v1/embeddings", async () => (await getEmbeddingsHttpModule()).handleOpenAiEmbeddingsHttpRequest(req, res, routeAuth));
			addAdmittedStage(scopedRequestPath === "/tools/invoke", async () => (await getToolsInvokeHttpModule()).handleToolsInvokeHttpRequest(req, res, operatorAuth()));
			addAdmittedStage(/^\/sessions\/[^/]+\/kill$/.test(scopedRequestPath), async () => (await getSessionKillHttpModule()).handleSessionKillHttpRequest(req, res, routeAuth));
			addAdmittedStage(/^\/sessions\/[^/]+\/history$/.test(scopedRequestPath), async () => (await getSessionHistoryHttpModule()).handleSessionHistoryHttpRequest(req, res, {
				...routeAuth,
				getCommittedRuntimeConfig: () => opts.getGatewayRequestContext?.()?.getCommittedRuntimeConfig?.() ?? loadGatewayConfig()
			}));
			addAdmittedStage(scopedRequestPath.startsWith("/__openclaw__/board/"), async () => (await getBoardHttpModule()).handleBoardHttpRequest(req, res, { resolveGatewayContext: opts.getGatewayRequestContext?.()?.resolveGatewayContext }));
			addAdmittedStage(scopedRequestPath.startsWith(pluginAssetRoot), async () => {
				if (!controlUiEnabled) {
					respondNotFound(res);
					return true;
				}
				return await (await getControlUiPluginAssetsModule()).handleControlUiPluginAssetRequest(req, res, controlUiRouteOptions);
			});
			addAdmittedStage(parseControlUiUserAvatarPath(scopedRequestPath, controlUiRouteBasePath).matched, async () => (await getUserProfilesHttpModule()).handleUserProfileAvatarHttpRequest(req, res, scopedRequestPath, {
				...routeAuth,
				basePath: controlUiRouteBasePath
			}));
			addAdmittedStage(openResponsesEnabled && scopedRequestPath === "/v1/responses", async () => (await getOpenResponsesHttpModule()).handleOpenResponsesHttpRequest(req, res, {
				...operatorAuth(),
				config: openResponsesConfig
			}));
			addAdmittedStage(openAiChatCompletionsEnabled && scopedRequestPath === "/v1/chat/completions", async () => (await getOpenAiHttpModule()).handleOpenAiHttpRequest(req, res, {
				...operatorAuth(),
				config: openAiChatCompletionsConfig
			}));
			const approvalDocument = isControlUiApprovalDocumentPath({
				basePath: controlUiBasePath,
				pathname: scopedRequestPath
			});
			const focusDocument = isControlUiFocusPath(scopedRequestPath, controlUiBasePath);
			const publicSessionPath = publicSessionRoute.matches(scopedRequestPath, controlUiRouteBasePath);
			addRequestStage(!controlUiEnabled && publicSessionPath, () => publicSessionRoute.reject(res));
			addAdmittedStage(controlUiEnabled && publicSessionPath, () => publicSessionRoute.serve({
				req,
				res,
				basePath: controlUiRouteBasePath,
				config: configSnapshot,
				ingress: ingressAttribution
			}));
			addRequestStage(approvalDocument || isControlUiSharePath(scopedRequestPath, controlUiRouteBasePath) && !publicSessionPath, handleStandaloneControlUiRequest);
			addRequestStage(Boolean(nodeCapability), async () => {
				const { authorizePluginNodeCapabilityRequest } = await getPluginNodeCapabilityAuthModule();
				const ok = await authorizePluginNodeCapabilityRequest({
					req,
					auth: resolvedAuthValue,
					trustedProxies,
					allowRealIpFallback,
					clients,
					nodeCapability,
					capability: scopedNodeCapability.capability,
					malformedScopedPath: scopedNodeCapability.malformedScopedPath,
					rateLimiter
				});
				if (!ok.ok) {
					sendGatewayAuthFailure(res, ok);
					return true;
				}
				return false;
			});
			addRequestStage(Boolean(nodeCapability) && isCoreCanvasHostEnabled(configSnapshot) && isCanvasDocumentHttpPath(scopedRequestPath), async () => (await getCanvasServeModule()).handleCanvasDocumentHttpRequest(req, res));
			addRequestStage(controlUiEnabled && isControlUiPluginManagerRequest({
				basePath: controlUiBasePath,
				pathname: scopedRequestPath,
				method: req.method
			}), handleControlUiRequest);
			const mcpAppRoute = classifyMcpAppStandalonePath(scopedRequestPath);
			addAdmittedStage(configSnapshot.mcp?.apps?.enabled === true && (mcpAppRoute === "shell" || mcpAppRoute === "view"), async () => {
				return await (await getMcpAppStandaloneModule()).handleMcpAppStandaloneHttpRequest(req, res, {
					sandboxPort: configSnapshot.mcp?.apps?.sandboxPort,
					sandboxOrigin: configSnapshot.mcp?.apps?.sandboxOrigin
				});
			});
			if (handlePluginRequest) {
				let pluginGatewayAuthSatisfied = false;
				let pluginGatewayRequestAuth;
				let pluginRequestOperatorScopes;
				requestStages.push(async () => {
					if (!(shouldEnforcePluginGatewayAuth ?? shouldEnforceDefaultPluginGatewayAuth)(pluginPathContext) || (await getCachedPluginGatewayAuthBypassPaths(configSnapshot)).has(scopedRequestPath)) return false;
					const { authorizePluginGatewayHttpRequestOrReply } = await getHttpAuthUtilsModule();
					const { resolvePluginRouteRuntimeOperatorScopes } = await getPluginRouteRuntimeScopesModule();
					const authResult = await authorizePluginGatewayHttpRequestOrReply({
						req,
						res,
						...routeAuth,
						requestPath: scopedRequestPath,
						resolveOperatorScopes: resolvePluginRouteRuntimeOperatorScopes
					});
					if (!authResult) return true;
					pluginGatewayAuthSatisfied = true;
					pluginGatewayRequestAuth = authResult.requestAuth;
					pluginRequestOperatorScopes = authResult.operatorScopes;
					return false;
				}, () => {
					if (pluginGatewayRequestAuth?.hasCurrentClientAuthority?.() === false) {
						sendGatewayAuthFailure(res, {
							ok: false,
							reason: "unauthorized"
						});
						return true;
					}
					return handlePluginRequest(req, res, pluginPathContext, {
						gatewayAuthSatisfied: pluginGatewayAuthSatisfied,
						gatewayRequestAuth: pluginGatewayRequestAuth,
						gatewayRequestOperatorScopes: pluginRequestOperatorScopes,
						gatewayRequestClientIp: requestClientIp
					});
				});
			}
			addRequestStage(focusDocument, handleStandaloneControlUiRequest);
			addRequestStage(scopedRequestPath.startsWith("/api/chat/media/outgoing/") || controlUiRouteBasePath.length > 0 && scopedRequestPath.startsWith(`${controlUiRouteBasePath}/api/chat/media/outgoing/`), async () => (await getManagedMediaAttachmentsModule()).handleManagedOutgoingMediaHttpRequest(req, res, {
				...routeAuth,
				basePath: controlUiRouteBasePath
			}));
			for (const [routes, loadHandler] of CONTROL_UI_IMAGE_HTTP_ROUTES) addRequestStage(controlUiEnabled && routes.some((route) => parseControlUiResourcePath(route, scopedRequestPath, controlUiRouteBasePath).matched), async () => (await loadHandler())(req, res, {
				...controlUiRouteOptions,
				sessionRowProjectionOwner: opts.getGatewayRequestContext?.()?.sessionRowProjectionOwner
			}));
			addRequestStage(scopedRequestPath === resolveAssistantMediaRoutePath(controlUiBasePath), async () => (await loadControlUi())?.handleControlUiAssistantMediaRequest(req, res, {
				...controlUiRouteOptions,
				agentId: resolveAssistantAgentId(configSnapshot)
			}) ?? false);
			addRequestStage(controlUiEnabled, async () => (await loadControlUi())?.handleControlUiAvatarRequest(req, res, controlUiRouteOptions) ?? false);
			addRequestStage(controlUiEnabled, handleControlUiRequest);
			for (const stage of requestStages) if (await stage() || res.destroyed || res.writableEnded) return;
			if (opts.isStartupPluginRuntimeReady?.() === false) {
				res.setHeader("Cache-Control", "no-store");
				res.setHeader("Retry-After", "1");
				respondPlainText(res, 503, "Plugin runtime is starting");
				return;
			}
			respondNotFound(res);
		} catch (err) {
			if (finishGatewayHttpAuthorityError(res, err)) return;
			console.error("[gateway-http] unhandled error in request handler:", err);
			finishFailedGatewayHttpResponse(res);
		}
	}
	return httpServer;
}
//#endregion
//#region src/gateway/server/plugin-legacy-listeners.ts
const endpointKey = ({ host, port }) => `${host ?? "<unspecified>"}:${port}`;
/** Compatibility ports share Gateway dispatch and the route owner's existing handoff leases. */
function startPluginLegacyListeners(params) {
	const listeners = /* @__PURE__ */ new Map();
	const ownedListeners = /* @__PURE__ */ new Set();
	const runInGatewayContext = AsyncLocalStorage.snapshot();
	let stopped = false;
	let queued = false;
	const close = ({ server, controller }, force = false) => {
		controller.abort();
		server.close();
		if (force) server.closeAllConnections();
	};
	const reconcile = () => {
		queued = false;
		if (stopped) return;
		const endpoints = /* @__PURE__ */ new Map();
		for (const route of params.getRegistry().httpRoutes) for (const endpoint of route.legacyListeners ?? []) {
			const key = endpointKey(endpoint);
			if (!endpoints.has(key) || !route.legacyListenerHandoffs?.includes(endpoint)) endpoints.set(key, endpoint);
		}
		for (const [key, listener] of listeners) if (!endpoints.has(key)) {
			listeners.delete(key);
			close(listener);
		}
		for (const [key, endpoint] of endpoints) {
			const existing = listeners.get(key);
			if (existing) {
				existing.endpoint = endpoint;
				const timeouts = endpoint.timeouts ?? existing.defaultTimeouts;
				existing.server.headersTimeout = timeouts.headers;
				existing.server.requestTimeout = timeouts.request;
				existing.server.setTimeout(timeouts.socket);
				continue;
			}
			const server = createServer();
			const controller = new AbortController();
			const listener = {
				server,
				controller,
				endpoint,
				defaultTimeouts: {
					headers: server.headersTimeout,
					request: server.requestTimeout,
					socket: server.timeout
				}
			};
			ownedListeners.add(listener);
			server.once("close", () => {
				ownedListeners.delete(listener);
				if (listeners.get(key) === listener) listeners.delete(key);
				const index = params.httpServers.indexOf(server);
				if (index !== -1) params.httpServers.splice(index, 1);
			});
			if (endpoint.timeouts) {
				server.headersTimeout = endpoint.timeouts.headers;
				server.requestTimeout = endpoint.timeouts.request;
				server.setTimeout(endpoint.timeouts.socket);
			}
			server.on("request", (req, res) => {
				const activeEndpoint = listener.endpoint;
				if (activeEndpoint.health && req.url === activeEndpoint.health.path) {
					runHttpConnectionRequest(req, async () => {
						if (activeEndpoint.health?.contentType) res.setHeader("Content-Type", activeEndpoint.health.contentType);
						res.writeHead(200);
						res.end("ok");
					}, res).catch((error) => res.destroy(error instanceof Error ? error : void 0));
					return;
				}
				markPluginHttpLegacyListener(req, activeEndpoint);
				params.gatewayServer.emit("request", req, res);
			});
			server.on("error", (error) => {
				if (listeners.get(key) === listener) listeners.delete(key);
				close(listener, true);
				params.warn(`Legacy webhook listener ${key} failed: ${String(error)}. The Gateway webhook route remains available; update the external callback or reverse proxy to the Gateway port.`);
			});
			if (endpoint.port === 0) server.once("listening", () => {
				const address = server.address();
				if (address && typeof address !== "string") params.warn(`Legacy webhook port 0 selected ${address.address}:${address.port}; this port changes on restart. Update the external callback or reverse proxy to the Gateway port.`);
			});
			listeners.set(key, listener);
			params.httpServers.push(server);
			try {
				server.listen({
					port: endpoint.port,
					host: endpoint.host,
					signal: controller.signal
				});
			} catch (error) {
				server.emit("error", error);
			}
		}
	};
	const stopWatching = onPluginHttpRoutesChanged(() => {
		if (!queued && !stopped) {
			queued = true;
			queueMicrotask(() => runInGatewayContext(reconcile));
		}
	});
	const stop = () => {
		if (stopped) return;
		stopped = true;
		stopWatching();
		params.gatewayServer.off("close", stop);
		for (const listener of ownedListeners) close(listener, true);
		listeners.clear();
	};
	params.gatewayServer.once("close", stop);
	reconcile();
	return stop;
}
//#endregion
//#region src/gateway/server/preauth-connection-budget.ts
const DEFAULT_MAX_PREAUTH_CONNECTIONS_PER_IP = 128;
const UNKNOWN_CLIENT_IP_BUDGET_KEY = "__openclaw_unknown_client_ip__";
function getMaxPreauthConnectionsPerIpFromEnv(env = process.env) {
	const configured = env.OPENCLAW_MAX_PREAUTH_CONNECTIONS_PER_IP || (isVitestRuntimeEnv(env) ? env.OPENCLAW_TEST_MAX_PREAUTH_CONNECTIONS_PER_IP : void 0);
	return parseStrictPositiveInteger(configured) ?? DEFAULT_MAX_PREAUTH_CONNECTIONS_PER_IP;
}
function createPreauthConnectionBudget(limit = getMaxPreauthConnectionsPerIpFromEnv()) {
	const maxConnectionsPerIp = resolveIntegerOption(limit, getMaxPreauthConnectionsPerIpFromEnv(), { min: 1 });
	const counts = /* @__PURE__ */ new Map();
	const normalizeBudgetKey = (clientIp) => {
		return clientIp?.trim() || UNKNOWN_CLIENT_IP_BUDGET_KEY;
	};
	return {
		acquire(clientIp) {
			const ip = normalizeBudgetKey(clientIp);
			const next = (counts.get(ip) ?? 0) + 1;
			if (next > maxConnectionsPerIp) return false;
			counts.set(ip, next);
			return true;
		},
		release(clientIp) {
			const ip = normalizeBudgetKey(clientIp);
			const current = counts.get(ip);
			if (current === void 0) return;
			if (current <= 1) {
				counts.delete(ip);
				return;
			}
			counts.set(ip, current - 1);
		}
	};
}
//#endregion
//#region src/gateway/server-runtime-state.ts
const loadGatewayPluginsHttpModule = async () => await import("./plugins-http-D8bG4Hgq.mjs");
function hasMatchingGatewayPluginRoute(registry, pathContext, requiresUpgrade) {
	if (!pathContext) return (registry.httpRoutes ?? []).length > 0;
	const matchingRoutes = findMatchingPluginHttpRoutes(registry, pathContext);
	return requiresUpgrade ? matchingRoutes.some((route) => typeof route.handleUpgrade === "function") : matchingRoutes.length > 0;
}
/** Creates the HTTP/WebSocket transport for one gateway start. */
async function createGatewayHttpTransport(params) {
	const spawnBroker = getSpawnBroker();
	const runWithReadOnlyWorkers = captureSqliteReadOnlyWorkerScope();
	if (params.testListener) {
		const address = params.testListener.address();
		if (params.gatewayTls?.enabled || params.bindHost !== "127.0.0.1" || !address || typeof address === "string" || address.address !== params.bindHost || address.port !== params.port) throw new Error("Test Gateway listener must own the configured HTTP loopback endpoint");
	}
	const loadRuntimeConfig = params.getRuntimeConfig ?? (() => params.cfg);
	const resolvePluginRouteRegistry = () => params.getPluginRouteRegistry?.() ?? params.pluginRegistry;
	let loadedHooksRequestHandler = null;
	let loadedHookDispatcher;
	const getHookDispatcher = async () => {
		const { createGatewayHookDispatcher } = await import("./hooks-DnDXYVKu.mjs");
		return loadedHookDispatcher ??= runWithSpawnBroker(spawnBroker, () => runWithReadOnlyWorkers(() => createGatewayHookDispatcher({
			deps: params.deps,
			logHooks: params.logHooks,
			...params.getGatewayRequestContext ? { resolveGatewayContext: params.getGatewayRequestContext } : {}
		})));
	};
	const handleHooksRequest = async (req, res) => {
		const hooksConfig = params.hooksConfig();
		if (!hooksConfig) return false;
		const url = new URL(req.url ?? "/", "http://localhost");
		const basePath = hooksConfig.basePath;
		if (url.pathname !== basePath && !url.pathname.startsWith(`${basePath}/`)) return false;
		return await runWithGatewayHttpWorkAdmission(res, async () => {
			if (!loadedHooksRequestHandler) {
				const { createGatewayHooksRequestHandler } = await import("./hooks-DnDXYVKu.mjs");
				loadedHooksRequestHandler = createGatewayHooksRequestHandler({
					scheduler: params.scheduler,
					deps: params.deps,
					dispatcher: await getHookDispatcher(),
					getHooksConfig: params.hooksConfig,
					getClientIpConfig: params.getHookClientIpConfig,
					bindHost: params.bindHost,
					port: params.port,
					logHooks: params.logHooks,
					...params.getGatewayRequestContext ? { resolveGatewayContext: params.getGatewayRequestContext } : {}
				});
			}
			return await loadedHooksRequestHandler(req, res);
		});
	};
	const handleMcpOAuthCallbackRequest = async (req, res) => {
		const { handleMcpOAuthCallback } = await import("./mcp-oauth-callback-DBnUewRj.mjs");
		return await handleMcpOAuthCallback(req, res, {
			config: loadRuntimeConfig(),
			log: params.log
		});
	};
	let loadedPluginRequestHandler = null;
	let loadedPluginUpgradeHandler = null;
	const handlePluginRequest = async (req, res, pathContext, dispatchContext) => {
		if (loadedPluginRequestHandler) return await loadedPluginRequestHandler(req, res, pathContext, dispatchContext);
		if (!hasMatchingGatewayPluginRoute(resolvePluginRouteRegistry(), pathContext, false)) return false;
		const { createGatewayPluginRequestHandler } = await loadGatewayPluginsHttpModule();
		loadedPluginRequestHandler = createGatewayPluginRequestHandler({
			registry: params.pluginRegistry,
			getRouteRegistry: resolvePluginRouteRegistry,
			log: params.logPlugins,
			getGatewayRequestContext: params.getGatewayRequestContext
		});
		return await loadedPluginRequestHandler(req, res, pathContext, dispatchContext);
	};
	const handlePluginUpgrade = async (req, socket, head, pathContext, dispatchContext) => {
		if (loadedPluginUpgradeHandler) return await loadedPluginUpgradeHandler(req, socket, head, pathContext, dispatchContext);
		if (!hasMatchingGatewayPluginRoute(resolvePluginRouteRegistry(), pathContext, true)) return false;
		const { createGatewayPluginUpgradeHandler } = await loadGatewayPluginsHttpModule();
		loadedPluginUpgradeHandler = createGatewayPluginUpgradeHandler({
			registry: params.pluginRegistry,
			getRouteRegistry: resolvePluginRouteRegistry,
			log: params.logPlugins,
			getGatewayRequestContext: params.getGatewayRequestContext
		});
		return await loadedPluginUpgradeHandler(req, socket, head, pathContext, dispatchContext);
	};
	const shouldEnforcePluginGatewayAuth = (pathContext) => {
		return shouldEnforceGatewayAuthForPluginPath(resolvePluginRouteRegistry(), pathContext);
	};
	const isPluginAuthenticatedRoute = (pathContext) => {
		return isPluginAuthenticatedRoutePath(resolvePluginRouteRegistry(), pathContext);
	};
	const resolvePluginNodeCapabilityRoute = (pathContext) => {
		const coreCanvasCapability = isCoreCanvasHostEnabled(loadRuntimeConfig()) ? resolveCanvasNodeCapability(pathContext.candidates) : void 0;
		if (coreCanvasCapability) return coreCanvasCapability;
		return findMatchingPluginNodeCapabilityRoute(resolvePluginRouteRegistry(), pathContext)?.nodeCapability;
	};
	const managedTailscaleMode = params.tailscaleMode && params.tailscaleMode !== "off" ? params.tailscaleMode : void 0;
	const bindHosts = await resolveGatewayListenHosts(params.bindHost);
	if (!isLoopbackHost(params.bindHost)) params.log.warn("⚠️  Gateway is binding to a non-loopback address. Ensure authentication is configured before exposing to public networks.");
	if (params.cfg.gateway?.controlUi?.dangerouslyAllowHostHeaderOriginFallback === true) params.log.warn("⚠️  gateway.controlUi.dangerouslyAllowHostHeaderOriginFallback=true is enabled. Host-header origin fallback weakens origin checks and should only be used as break-glass.");
	const wss = new WebSocketServer({
		noServer: true,
		maxPayload: MAX_PREAUTH_PAYLOAD_BYTES,
		allowSynchronousEvents: false,
		perMessageDeflate: false
	});
	const preauthConnectionBudget = createPreauthConnectionBudget();
	const httpServers = [];
	const gatewayHttpServers = [];
	const httpBindHosts = [];
	const portalService = createGatewayPortalService({
		httpBindHosts,
		httpServers,
		ingress: params.cfg.gateway?.portals?.ingress,
		managedTailscale: Boolean(managedTailscaleMode),
		gatewayOrigins: [params.cfg.gateway?.publicOrigin, ...params.cfg.gateway?.controlUi?.allowedOrigins ?? []].filter((origin) => Boolean(origin)),
		...params.gatewayTls?.enabled ? { tlsOptions: params.gatewayTls.tlsOptions } : {}
	});
	const reportUnattributableProxy = createGatewayUnattributableProxyReporter(params.log);
	const createGatewayListener = (ingressTransport, tlsOptions, testListener) => {
		const httpServer = createGatewayHttpServer({
			testListener,
			clients: params.clients,
			controlUiEnabled: params.controlUiEnabled,
			controlUiBasePath: params.controlUiBasePath,
			controlUiRoot: params.controlUiRoot,
			openAiChatCompletionsEnabled: params.openAiChatCompletionsEnabled,
			openResponsesEnabled: params.openResponsesEnabled,
			handleWatchNodeRequest: params.handleWatchNodeRequest,
			handleHooksRequest,
			handleMcpOAuthCallbackRequest,
			handlePluginRequest,
			shouldEnforcePluginGatewayAuth,
			isPluginAuthenticatedRoute,
			resolvePluginNodeCapabilityRoute,
			resolvedAuth: params.resolvedAuth,
			getResolvedAuth: params.getResolvedAuth,
			rateLimiter: params.rateLimiter,
			joinRateLimiter: params.joinRateLimiter,
			handleNodeWorkerBundleTransferRequest: params.handleNodeWorkerBundleTransferRequest,
			handleWorkerBootstrapArtifactTransferRequest: params.handleWorkerBootstrapArtifactTransferRequest,
			handleNodeWorkspaceTransferRequest: params.handleNodeWorkspaceTransferRequest,
			getReadiness: params.getReadiness,
			getStartup: params.getStartup,
			getRuntimeConfig: loadRuntimeConfig,
			getGatewayRequestContext: params.getGatewayRequestContext,
			isStartupPluginRuntimeReady: params.isStartupPluginRuntimeReady,
			isTerminalEnabled: params.isTerminalEnabled,
			tlsOptions,
			ingressTransport,
			reportUnattributableProxy
		});
		attachGatewayUpgradeHandler({
			httpServer,
			wss,
			handlePluginUpgrade,
			shouldEnforcePluginGatewayAuth,
			isPluginAuthenticatedRoute,
			resolvePluginNodeCapabilityRoute,
			clients: params.clients,
			preauthConnectionBudget,
			resolvedAuth: params.resolvedAuth,
			getResolvedAuth: params.getResolvedAuth,
			rateLimiter: params.rateLimiter,
			publicRateLimiter: params.joinRateLimiter,
			workerIngressEnabled: params.workerIngressEnabled,
			log: params.log,
			desktopSessionRegistry: params.desktopSessionRegistry,
			nodeDesktopStreamBroker: params.nodeDesktopStreamBroker,
			getGatewayRequestContext: params.getGatewayRequestContext,
			isStartupPending: params.isStartupPending,
			ingressTransport,
			reportUnattributableProxy
		});
		return httpServer;
	};
	for (const host of bindHosts) {
		const httpServer = createGatewayListener({ kind: "ordinary" }, params.gatewayTls?.enabled ? params.gatewayTls.tlsOptions : void 0, host === params.bindHost ? params.testListener : void 0);
		gatewayHttpServers.push(httpServer);
		httpServers.push(httpServer);
	}
	const tailscaleHttpServer = managedTailscaleMode ? createGatewayListener({
		kind: "managed-tailscale",
		mode: managedTailscaleMode
	}, void 0) : void 0;
	if (tailscaleHttpServer) httpServers.push(tailscaleHttpServer);
	let tailscaleIngressEndpoint;
	const httpServer = gatewayHttpServers[0];
	if (!httpServer) throw new Error("Gateway HTTP server failed to start");
	let mcpAppSandboxPort;
	let sandboxHostStartPromise = null;
	let startListeningPromise = null;
	let startListeningComplete = false;
	const startSandboxHost = async () => {
		if (params.updateCanary) throw new Error("Sandbox host is disabled during update validation");
		if (sandboxHostStartPromise) return await sandboxHostStartPromise;
		sandboxHostStartPromise = (async () => {
			if (httpBindHosts.length === 0) throw new Error("Gateway listener must start before the sandbox host");
			const sandboxPort = resolveSandboxHostPort(params.port, params.cfg.mcp?.apps?.sandboxPort);
			const sandboxServers = bindHosts.map(() => createSandboxHostHttpServer(params.gatewayTls?.enabled ? params.gatewayTls.tlsOptions : void 0, resolvePluginRouteRegistry));
			httpServers.push(...sandboxServers);
			try {
				for (const host of httpBindHosts) {
					const server = sandboxServers[bindHosts.indexOf(host)];
					if (!server) throw new Error(`Missing sandbox host HTTP server for bind host ${host}`);
					await listenGatewayHttpServer({
						httpServer: server,
						bindHost: host,
						port: sandboxPort,
						retryEaddrinuse: false,
						serviceName: "MCP App sandbox",
						endpointScheme: params.gatewayTls?.enabled ? "https" : "http"
					});
				}
			} catch (error) {
				await Promise.all(sandboxServers.map((server) => new Promise((resolve) => {
					if (!server.listening) {
						resolve();
						return;
					}
					server.close(() => resolve());
				})));
				for (const server of sandboxServers) {
					const index = httpServers.indexOf(server);
					if (index >= 0) httpServers.splice(index, 1);
				}
				throw error;
			}
			mcpAppSandboxPort = sandboxPort;
			return sandboxPort;
		})();
		const startAttempt = sandboxHostStartPromise;
		startAttempt.catch(() => {
			if (sandboxHostStartPromise === startAttempt) sandboxHostStartPromise = null;
		});
		return await startAttempt;
	};
	const ensureSandboxHostPort = async () => {
		if (!startListeningComplete) {
			if (!startListeningPromise) throw new Error("Gateway listener must start before the sandbox host");
			await startListeningPromise;
		}
		return await startSandboxHost();
	};
	const startListening = async () => {
		if (startListeningPromise) {
			await startListeningPromise;
			return;
		}
		startListeningPromise = (async () => {
			if (tailscaleHttpServer) {
				await listenGatewayHttpServer({
					httpServer: tailscaleHttpServer,
					bindHost: "127.0.0.1",
					port: 0,
					retryEaddrinuse: false,
					serviceName: "Tailscale gateway ingress"
				});
				const address = tailscaleHttpServer.address();
				if (!address || typeof address === "string") throw new Error("Tailscale gateway ingress failed to resolve its loopback port");
				tailscaleIngressEndpoint = {
					host: "127.0.0.1",
					port: address.port
				};
				await params.prepareManagedTailscaleIngress?.(tailscaleIngressEndpoint);
			}
			const requiredAlias = params.bindHost !== "127.0.0.1" && bindHosts.includes("127.0.0.1") ? "127.0.0.1" : void 0;
			const listenOrder = requiredAlias ? [requiredAlias, ...bindHosts.filter((host) => host !== requiredAlias)] : bindHosts;
			const boundHosts = /* @__PURE__ */ new Set();
			for (const host of listenOrder) {
				const index = bindHosts.indexOf(host);
				const server = gatewayHttpServers[index];
				if (!server) throw new Error(`Missing gateway HTTP server for bind host ${host}`);
				const requiredLoopbackAlias = host === requiredAlias;
				try {
					if (server !== params.testListener) await listenGatewayHttpServer({
						httpServer: server,
						bindHost: host,
						port: params.port,
						retryEaddrinuse: !requiredLoopbackAlias
					});
					boundHosts.add(host);
				} catch (err) {
					if (host === bindHosts[0] || requiredLoopbackAlias) throw err;
					params.log.warn(`gateway: failed to bind loopback alias ${host}:${params.port} (${String(err)})`);
				}
			}
			httpBindHosts.push(...bindHosts.filter((host) => boundHosts.has(host)));
			if (httpBindHosts.length === 0) throw new Error("Gateway HTTP server failed to start");
			if (!params.updateCanary) await portalService.startIngress();
			if (!params.updateCanary && params.cfg.mcp?.apps?.enabled === true) await startSandboxHost();
			if (!params.updateCanary) startPluginLegacyListeners({
				gatewayServer: httpServer,
				httpServers,
				getRegistry: resolvePluginRouteRegistry,
				warn: (message) => params.logPlugins.warn(message)
			});
			startListeningComplete = true;
		})();
		await startListeningPromise;
	};
	return {
		httpServer,
		httpServers,
		httpBindHosts,
		startListening,
		wss,
		preauthConnectionBudget,
		portalService,
		getTailscaleIngressEndpoint: () => tailscaleIngressEndpoint,
		getMcpAppSandboxPort: () => mcpAppSandboxPort,
		ensureSandboxHostPort,
		dispatchHookAgentTurn: async (pluginId, hookParams) => await (await getHookDispatcher()).dispatchHookAgentTurn(hookParams, pluginId)
	};
}
//#endregion
//#region src/gateway/server-agent-database-startup.ts
/** Finish only the deferred agent's preparation before its admission owner recovers it. */
function activateGatewayAgentDatabaseStartup(params) {
	const broker = getSpawnBroker();
	params.admission?.activate({
		isCurrent: params.isCurrent,
		prepareAgent: ({ agentId, paths, env, signal, assertCurrent }) => runWithSpawnBroker(broker, async () => {
			const [{ runStartupSessionMigration }, { refreshPreparedModelRuntimeSnapshots, getPreparedModelRuntimeSnapshot }, { listConfiguredOwnerInputs }, { getActiveSecretsRuntimeSnapshot, getActiveSecretsRuntimeSnapshotRevision, refreshActiveSecretsRuntimeSnapshotForConfig }] = await Promise.all([
				import("./server-startup-session-migration-Bf0A_vIi.mjs"),
				import("./prepared-model-runtime-BnpMlDe5.mjs"),
				import("./prepared-model-runtime.configured-IuNrCYJs.mjs"),
				import("./runtime-D0jb4vxR.mjs")
			]);
			assertCurrent();
			const beforeConfig = params.getConfig();
			const previousSecretsRevision = getActiveSecretsRuntimeSnapshotRevision();
			const previousSecrets = getActiveSecretsRuntimeSnapshot();
			const configuredPaths = resolveConfiguredAgentDatabaseTargets(beforeConfig, { env }).filter((target) => target.agentId === agentId);
			if (configuredPaths.length === 0 || paths.some((pathname) => !configuredPaths.some((target) => isSameOpenClawAgentDatabasePath(target.path, pathname)))) throw new Error(`Agent ${agentId} database configuration changed during startup inspection`);
			if (!previousSecrets || !await refreshActiveSecretsRuntimeSnapshotForConfig({
				sourceConfig: previousSecrets.sourceConfig,
				includeAuthStoreRefs: true,
				assertCurrent: () => {
					signal.throwIfAborted();
					assertCurrent();
					if (!params.isCurrent() || params.getConfig() !== beforeConfig || getActiveSecretsRuntimeSnapshotRevision() !== previousSecretsRevision) throw new Error(`Agent ${agentId} secrets preparation was superseded`);
				}
			})) throw new Error(`Agent ${agentId} secrets preparation could not publish`);
			const cfg = params.getConfig();
			const secretsRevision = getActiveSecretsRuntimeSnapshotRevision();
			const secrets = getActiveSecretsRuntimeSnapshot();
			const authDatabasePath = resolveAuthProfileDatabasePath(resolveAgentDir(cfg, agentId, env));
			if (secretsRevision !== previousSecretsRevision + 1 || !secrets?.authStores.some((entry) => isSameOpenClawAgentDatabasePath(entry.databasePath, authDatabasePath))) throw new Error(`Agent ${agentId} secrets preparation has not published its auth store`);
			let preparedInput;
			const assertPreparationCurrent = () => {
				signal.throwIfAborted();
				assertCurrent();
				if (!params.isCurrent() || params.getConfig() !== cfg || getActiveSecretsRuntimeSnapshotRevision() !== secretsRevision) throw new Error(`Agent ${agentId} startup preparation was superseded`);
				if (preparedInput && !getPreparedModelRuntimeSnapshot(preparedInput)) throw new Error(`Agent ${agentId} model preparation has not published`);
			};
			const agentIds = /* @__PURE__ */ new Set([agentId]);
			assertPreparationCurrent();
			await withAgentDatabasePreparationGuard(assertPreparationCurrent, async () => {
				await runStartupSessionMigration({
					cfg,
					env,
					agentIds,
					assertCurrent: assertPreparationCurrent,
					log: params.log
				});
				assertPreparationCurrent();
				const pluginMetadataSnapshot = params.getPluginMetadataSnapshot();
				await withPluginRuntimeRegistryScope(params.getPluginRegistry(), () => refreshPreparedModelRuntimeSnapshots(cfg, {
					agentIds,
					catalogMode: "static",
					allowGatewaySubagentBinding: true,
					...pluginMetadataSnapshot ? { pluginMetadataSnapshot } : {},
					isPublicationCurrent: () => {
						try {
							assertPreparationCurrent();
							return true;
						} catch {
							return false;
						}
					}
				}));
				preparedInput = listConfiguredOwnerInputs(cfg, void 0, true).find((input) => input.agentId === agentId);
				if (!preparedInput) throw new Error(`Agent ${agentId} model preparation is no longer configured`);
				assertPreparationCurrent();
			});
		})
	});
}
//#endregion
//#region src/gateway/server-tls-renewal.ts
/** Renew only the running listener's accepted paths; TLS topology remains startup-owned. */
function startGatewayTlsRenewal(params) {
	const { runtime } = params;
	const scheduler = params.scheduler.scope();
	const options = runtime.tlsOptions;
	if (!runtime.enabled || !options || scheduler.signal.aborted) return;
	const paths = [
		runtime.certPath,
		runtime.keyPath,
		runtime.caPath
	].filter((value) => Boolean(value));
	let enabled = params.enabled;
	let epoch = 0;
	let refreshJob;
	let pending = Promise.resolve();
	const isCurrent = (expected) => enabled && !scheduler.signal.aborted && epoch === expected;
	const requestRefresh = () => {
		const expected = ++epoch;
		refreshJob?.cancel();
		if (!isCurrent(expected)) {
			if (!enabled && !scheduler.signal.aborted) params.log.info("gateway TLS renewal deferred (gateway.reload.mode=off)");
			return;
		}
		refreshJob = scheduler.schedule({
			id: "gateway:tls-renewal",
			delayMs: 300,
			run: () => pending = pending.then(async () => {
				if (!isCurrent(expected)) return;
				const next = await loadGatewayTlsServerRuntime({
					enabled: true,
					autoGenerate: false,
					certPath: runtime.certPath,
					keyPath: runtime.keyPath,
					caPath: runtime.caPath
				});
				if (!isCurrent(expected)) return;
				if (!next.enabled || !next.tlsOptions) throw new Error(next.error ?? "TLS renewal did not produce listener material");
				if (isDeepStrictEqual(options, next.tlsOptions)) return;
				for (const server of params.servers) if (server instanceof Server) server.setSecureContext(next.tlsOptions);
				Object.assign(options, next.tlsOptions);
				runtime.fingerprintSha256 = next.fingerprintSha256;
				await params.onRenewed().catch((error) => {
					params.log.warn(`gateway TLS renewed but discovery refresh failed: ${String(error)}`);
				});
				params.log.info("gateway TLS certificate renewed without restarting listeners");
			}).catch((error) => {
				if (isCurrent(expected)) params.log.warn(`gateway TLS renewal failed; keeping accepted material: ${String(error)}`);
			})
		});
	};
	for (const path of paths) watchFile(path, {
		interval: 1e3,
		persistent: false
	}, requestRefresh);
	requestRefresh();
	return {
		setEnabled: (next) => {
			if (enabled !== next) {
				enabled = next;
				requestRefresh();
			}
		},
		async stop() {
			scheduler.beginClose();
			for (const path of paths) unwatchFile(path, requestRefresh);
			await scheduler.stop();
		}
	};
}
//#endregion
//#region src/gateway/server/client-human-presence.ts
function hasAuthenticatedControlUiIdentity(clients) {
	return [...clients].some((client) => !client.invalidated && client.socket.readyState === 1 && client.internal?.authenticatedControlUi === true && Boolean(client.authenticatedUserId || client.authenticatedUserProfile) && authorizeOperatorScopesForMethod("sessions.create", Array.isArray(client.connect.scopes) ? client.connect.scopes : []).allowed && isBrowserOperatorUiClient(client.connect.client));
}
/** Bind live Control UI demand and cleanup before requests and reconciliation start. */
async function startWorkerHumanPresence(params) {
	const { clients, service, log } = params;
	let present = hasAuthenticatedControlUiIdentity(clients);
	const invalidationSubscriptions = /* @__PURE__ */ new Map();
	const refresh = () => {
		const next = hasAuthenticatedControlUiIdentity(clients);
		if (next !== present) {
			present = next;
			service.setHumanPresence(next).catch((error) => log.warn(`prepared-pool human presence update failed: ${String(error)}`));
		}
	};
	const observeClients = () => {
		for (const [client, unsubscribe] of invalidationSubscriptions) if (!clients.has(client)) {
			unsubscribe();
			invalidationSubscriptions.delete(client);
		}
		for (const client of clients) if (!invalidationSubscriptions.has(client)) invalidationSubscriptions.set(client, onGatewayPolicyClientInvalidated(client, refresh));
		refresh();
	};
	const unsubscribe = clients.subscribe(observeClients);
	observeClients();
	params.registerSidecar({ stop: () => {
		unsubscribe();
		for (const stop of invalidationSubscriptions.values()) stop();
		invalidationSubscriptions.clear();
	} });
	await service.setHumanPresence(present);
}
//#endregion
//#region src/gateway/server-startup-finish.ts
const [POST_READY_MAINTENANCE_DELAY_MS, RETAINED_PLUGIN_CLEANUP_DELAY_MS] = [250, 3e4];
async function finishGatewayStartup(params) {
	const { kernelRuntime: runtime, port, bootId, opts, log, logHealth, logWsControl, logHooks, logChannels, logCron, logReload, loadGatewayStartupPostAttachModule } = params;
	const { minimalTestGateway, deps, runtimeState, kernel, startupTrace, broadcast, broadcastToConnIds, clients, sharedGatewaySessionGenerationState, workerEnvironmentService, workerPlacementRuntime, terminalLaunchPolicy, terminalSessions, nodeRegistry, nodeDesktopService, startChannel, stopChannel, getAttachedGatewayMethodRegistry, lifecycle, startupState, pluginRuntime, resolvePluginGatewayContext, gatewayTls, bindHost, getResolvedAuth, authRateLimiter, browserAuthRateLimiter, nodeReapprovalCoordinator, isGatewayStartupPending, attachedGatewayExtraHandlers, startListening, loadStartupPluginsModule, gatewayPluginConfigAtStart, startupActivationSourceConfig, defaultWorkspaceDir, coreGatewayMethodNames, pluginHostServices, baseMethods, startupPluginIds, pluginManifestRecords, pluginMetadataSnapshot, pluginLookUpTable, ambientEnvTriggers, prepareAttachedPluginRuntime, refreshAttachedGatewayDiscovery, wss, startChannels, broadcastPluginEvent, controlUiRootLifecycle, sidecarStartup, startEarlyRuntime, cfgAtStart, preauthConnectionBudget, releaseStartupAccountStarts, cronReconciliation, cronStartState, prepareReloadCandidate, configSnapshot, channelManager, activateRuntimeSecrets, applyFixedGatewayOverlays, resolveSharedGatewaySessionGenerationForConfig, stopRegisteredPostReadySidecars, registerPostReadySidecars, registerGatewayLifetimeSidecars, registerConnectionDependentSidecars, unregisterConnectionDependentSidecar, chatMetadataLifecycle, gatewayRequestContext, gatewayInstanceRuntime, getPluginMetadataSnapshot, getPluginNodeCapabilities } = runtime;
	const startupPluginRuntimeClaim = kernel.pluginRuntimeGeneration.currentClaim();
	const databaseStartupAdmission = getAgentDatabaseStartupAdmission();
	const activateAgentDatabases = () => {
		if (databaseStartupAdmission && !opts.updateCanary && !lifecycle.closePreludeStarted) activateGatewayAgentDatabaseStartup({
			admission: databaseStartupAdmission,
			getConfig: getRuntimeConfig,
			getPluginRegistry: () => pluginRuntime.registry,
			getPluginMetadataSnapshot,
			isCurrent: () => !lifecycle.closePreludeStarted,
			log
		});
	};
	const getReadiness = runtime.createHttpTransportOptions().getReadiness;
	const { attachGatewayWsConnectionHandler } = await startupTrace.measure("gateway.ws-imports", () => import("./ws-connection-DwFrCybX.mjs"));
	if (workerEnvironmentService) await startWorkerHumanPresence({
		clients,
		service: workerEnvironmentService,
		log,
		registerSidecar: registerGatewayLifetimeSidecars
	});
	await startupTrace.measure("gateway.ws-attach", () => attachGatewayWsConnectionHandler({
		wss,
		clients,
		connectionWork: runtime.connectionWork,
		bootId,
		preauthConnectionBudget,
		port,
		gatewayHost: bindHost ?? void 0,
		pluginSurfaceScheme: gatewayTls.enabled ? "https" : "http",
		getPluginNodeCapabilities,
		getResolvedAuth,
		getRequiredSharedGatewaySessionGeneration: sharedGatewaySessionGenerationState.reader,
		rateLimiter: authRateLimiter,
		browserRateLimiter: browserAuthRateLimiter,
		nodeReapprovalCoordinator,
		isStartupPending: isGatewayStartupPending,
		isPendingWorkerNodeSetup: workerEnvironmentService?.hasPendingNodeEnrollmentSetup,
		admitsNodeSetupCompletion: workerEnvironmentService?.admitsNodeSetupCompletion,
		gatewayMethods: runtimeState.gatewayMethods,
		events: GATEWAY_EVENTS,
		logGateway: log,
		logHealth,
		logWsControl,
		extraHandlers: attachedGatewayExtraHandlers,
		getMethodRegistry: () => getAttachedGatewayMethodRegistry(),
		...workerEnvironmentService ? { workerConnectionService: workerEnvironmentService } : {},
		broadcast,
		refreshHealthSnapshot: gatewayRequestContext.refreshHealthSnapshot,
		buildRequestContext: () => gatewayRequestContext
	}));
	await startupTrace.measure("http.listen", () => startListening());
	kernel.setDispatchReady(true);
	startupTrace.mark("http.bound");
	const earlyRuntime = await startEarlyRuntime();
	const sessionDeliveryRecoveryMaxEnqueuedAt = Date.now();
	let postAttachRuntimeReturned = false;
	let scheduledServicesActivated = false;
	const loadScheduledServicesModule = createLazyPromise(() => import("./server-runtime-services-Cvgjth3s.mjs"), { cacheRejections: true });
	const activateScheduledServicesWhenReady = () => {
		if (opts.updateCanary || lifecycle.closePreludeStarted || !postAttachRuntimeReturned || !startupState.sidecarsReady || scheduledServicesActivated) return;
		scheduledServicesActivated = true;
		loadScheduledServicesModule().then((gatewayRuntimeServices) => {
			if (lifecycle.closePreludeStarted) return;
			const activated = gatewayRuntimeServices.activateGatewayScheduledServices({
				scheduler: runtime.scheduler,
				minimalTestGateway,
				cfgAtStart,
				deps,
				sessionDeliveryRecoveryMaxEnqueuedAt,
				cronEnabled: runtimeState.cronState.cronEnabled,
				log,
				resolveGatewayContext: resolvePluginGatewayContext
			});
			kernel.setScheduledServiceHandles(activated);
		});
	};
	const { createGatewayServerActiveWorkInspectors } = await startupTrace.measure("gateway.active-work-import", () => import("./server-active-work-nyCymGp_.mjs"));
	const activeWorkInspectors = createGatewayServerActiveWorkInspectors(gatewayRequestContext);
	const trackStartupWork = (run) => {
		const operation = Promise.resolve().then(() => run(runtime.connectionWork.signal));
		return runtime.connectionWork.track(() => operation);
	};
	const postAttachHandles = await trackStartupWork(() => startupTrace.measure("runtime.post-attach", () => loadGatewayStartupPostAttachModule().then(({ startGatewayPostAttachRuntime }) => startGatewayPostAttachRuntime({
		scheduler: runtime.scheduler,
		minimalTestGateway,
		updateCanary: opts.updateCanary,
		cfgAtStart,
		getConfig: getRuntimeConfig,
		port,
		log,
		isNixMode,
		startupStartedAt: opts.startupStartedAt,
		broadcastToConnIds,
		getClientConnIds: gatewayRequestContext.getClientConnIds,
		broadcastPluginEvent,
		controlUiRootLifecycle,
		gatewayPluginConfigAtStart,
		activationSourceConfig: startupActivationSourceConfig,
		pluginManifestRecords,
		...pluginMetadataSnapshot ? { pluginMetadataSnapshot } : {},
		pluginRuntimeClaim: startupPluginRuntimeClaim,
		getCurrentPluginRegistry: () => pluginRuntime.registry,
		getCurrentPluginServices: () => kernel.pluginRuntimeGeneration.currentServices(),
		getCurrentPluginMetadataSnapshot: getPluginMetadataSnapshot,
		getCurrentActivationSourceConfig: getRuntimeConfigSourceSnapshot,
		ambientEnvTriggers,
		pluginRegistry: pluginRuntime.registry,
		defaultWorkspaceDir,
		deps,
		startChannels,
		recoveryRuntime: gatewayInstanceRuntime.recovery,
		isRestartRecoverySuppressed: () => channelManager.getAutostartSuppression() !== null,
		resolveGatewayContext: gatewayRequestContext.resolveGatewayContext,
		logHooks,
		logChannels,
		unlockStartupMethods: kernel.unlockStartupMethods,
		refreshChatMetadata: chatMetadataLifecycle.refresh,
		loadStartupPlugins: async () => {
			const { loadGatewayStartupPluginRuntime } = await loadStartupPluginsModule();
			return loadGatewayStartupPluginRuntime({
				cfg: gatewayPluginConfigAtStart,
				activationSourceConfig: startupActivationSourceConfig,
				workspaceDir: runtime.pluginWorkspaceDir,
				log,
				baseMethods,
				coreGatewayMethodNames,
				hostServices: pluginHostServices,
				startupPluginIds,
				pluginLookUpTable,
				startupTrace,
				ambientEnvTriggers,
				resolveGatewayContext: resolvePluginGatewayContext,
				pluginRuntimeClaim: startupPluginRuntimeClaim,
				getCurrentPluginRegistry: () => pluginRuntime.registry
			});
		},
		onStartupPluginsLoading: () => {
			startupState.pendingReason = "startup-sidecars";
		},
		onStartupPluginsLoaded: async (loaded) => {
			const activationCleanup = [];
			const prepared = await prepareAttachedPluginRuntime(loaded, (completion) => activationCleanup.push(completion));
			try {
				if (lifecycle.closePreludeStarted || !startupPluginRuntimeClaim.publish(prepared.publish)) return false;
				startupState.pendingReason = "startup-sidecars";
				prepared.afterCommit();
				const nodeCapabilitySurfaces = indexPluginNodeCapabilitySurfaces(getPluginNodeCapabilities());
				for (const client of clients) reconcileClientPluginNodeCapabilities(client, nodeCapabilitySurfaces);
				await refreshAttachedGatewayDiscovery(loaded.pluginRegistry, startupPluginRuntimeClaim);
				return true;
			} finally {
				await Promise.allSettled(activationCleanup);
			}
		},
		getCronService: kernel.getCronService,
		onChannelsStarted: () => {
			releaseStartupAccountStarts();
		},
		onPluginServices: (pluginServices) => {
			kernel.pluginRuntimeGeneration.publishServices(startupPluginRuntimeClaim, pluginServices);
		},
		onPostReadySidecars: registerPostReadySidecars,
		onGatewayLifetimeSidecars: registerGatewayLifetimeSidecars,
		trackStartupWork,
		unregisterConnectionDependentSidecar,
		...workerPlacementRuntime ? { startWorkerEnvironmentRuntime: async () => {
			if (lifecycle.closePreludeStarted) return null;
			return await workerPlacementRuntime.startRuntime({
				isClosePreludeStarted: () => lifecycle.closePreludeStarted,
				registerSidecar: (sidecar) => {
					registerConnectionDependentSidecars(sidecar);
				},
				unregisterSidecar: unregisterConnectionDependentSidecar
			});
		} } : {},
		onSidecarsReady: () => {
			kernel.markSidecarsReady();
			activateAgentDatabases();
			activateScheduledServicesWhenReady();
		},
		getReadiness,
		isClosing: () => lifecycle.closePreludeStarted,
		startupTrace,
		sidecarStartup,
		waitForPostReadyWork: params.waitForPostReadyWork,
		activeWorkInspectors
	}))));
	kernel.setPostAttachHandles(postAttachHandles);
	if (minimalTestGateway) activateAgentDatabases();
	startupTrace.detail("memory.ready", [...collectGatewayProcessMemoryUsageMb(), ...minimalTestGateway ? [] : await collectGatewayWorkerPoolMetrics()]);
	if (getReadiness().ready) {
		startupTrace.mark("ready");
		if (sidecarStartup === "defer") logGatewayReady({
			getReadiness,
			log
		});
	}
	finishGatewayRestartTrace("restart.ready", collectGatewayProcessMemoryUsageMb());
	if (opts.updateCanary) return { startupSettled: postAttachHandles.startupSettled };
	if (!minimalTestGateway) {
		const { startOpenClawDatabaseIntegrityVerifier } = await import("./openclaw-database-verify-CQ3WUmlC.mjs");
		registerGatewayLifetimeSidecars(startOpenClawDatabaseIntegrityVerifier({ env: process.env }));
	}
	postAttachRuntimeReturned = true;
	activateScheduledServicesWhenReady();
	const { startManagedGatewayConfigReloader } = await import("./server-reload-managed-DTtcDLH2.mjs");
	const assertRuntimeSecurityConfig = (cfg, env) => {
		assertGatewayRuntimeSecurityConfig({
			cfg,
			port,
			bindHost,
			controlUiEnabled: opts.controlUiEnabled ?? cfg.gateway?.controlUi?.enabled ?? true,
			tailscaleMode: runtime.tailscaleMode,
			resolvedAuth: resolveGatewayAuth({
				authConfig: cfg.gateway?.auth,
				tailscaleMode: runtime.tailscaleMode,
				env
			})
		});
	};
	const tlsRenewal = startGatewayTlsRenewal({
		scheduler: runtime.scheduler,
		runtime: gatewayTls,
		servers: runtime.httpServers,
		enabled: cfgAtStart.gateway?.reload?.mode !== "off",
		onRenewed: async () => runtimeState.discovery?.update({ gatewayTlsFingerprintSha256: gatewayTls.fingerprintSha256 }),
		log: log.child("tls")
	});
	if (tlsRenewal) registerGatewayLifetimeSidecars(tlsRenewal);
	let appliedCustomPluginUiEnabled = gatewayPluginConfigAtStart.gateway?.controlUi?.experimental?.customPlugins === true;
	const configReloaderParams = {
		scheduler: runtime.scheduler,
		onReloadEnabledChange: tlsRenewal?.setEnabled,
		configRevisionProjector: gatewayRequestContext.configRevisionProjector,
		resolveGatewayContext: resolvePluginGatewayContext,
		minimalTestGateway,
		initialConfig: cfgAtStart,
		initialPluginInstallRecords: pluginMetadataSnapshot?.index.installRecords,
		initialCompareConfig: configSnapshot.sourceConfig,
		initialSnapshotRawHash: configSnapshot.exists ? hashConfigRaw(configSnapshot.raw) : null,
		initialAuthoredConfig: configSnapshot.parsed,
		initialIncludedPaths: configSnapshot.includedPaths ?? [],
		initialSnapshotValid: configSnapshot.valid,
		initialSnapshotIssues: configSnapshot.issues,
		watchPath: configSnapshot.path,
		readSnapshot: readConfigFileSnapshotForRuntimeTransaction,
		promoteSnapshot: promoteConfigSnapshotToLastKnownGood,
		subscribeToWrites: (listener) => registerConfigWriteListener(listener, {
			ownsRuntimeActivationFor: configSnapshot.path,
			prepareSnapshot: opts.prepareConfigSnapshot,
			preCommitRuntimePreflight: async (sourceConfig, runtimeRefresh) => {
				const candidate = await prepareReloadCandidate({
					runtimeConfig: sourceConfig,
					sourceConfig
				});
				const prepared = await activateRuntimeSecrets(candidate.runtimeConfig, {
					reason: "reload",
					activate: false,
					env: candidate.runtimeEnv.env,
					includeAuthStoreRefs: runtimeRefresh?.includeAuthStoreRefs
				});
				const previousConfig = getRuntimeConfig();
				const plan = buildGatewayReloadPlan(diffGatewayReloadPaths(getRuntimeConfigSourceSnapshot() ?? configSnapshot.sourceConfig, sourceConfig, listConfigReloadRefinementPrefixes()), {
					previousConfig,
					candidateConfig: prepared.config
				});
				if (runtimeRefresh?.requireImmediateApplication) {
					if (prepared.config.gateway?.reload?.mode === "off") throw new Error("The saved sign-in is inactive because Gateway reload is disabled. Enable config reload and restart the Gateway before retrying it.");
					if (plan.restartGateway || plan.reloadPlugins) throw new Error(plan.reloadPlugins ? "Update or enable the selected provider plugin in Plugins, then retry this saved sign-in. Your current connection is unchanged." : "Apply the required Gateway settings update separately, then retry this saved sign-in. Your current connection is unchanged.");
				}
				if (!plan.restartGateway) assertRuntimeSecurityConfig(prepared.config, candidate.runtimeEnv.env);
				return candidate;
			}
		}),
		deps,
		broadcast,
		getState: kernel.getReloadState,
		setState: (nextState) => {
			kernel.setReloadHookState(nextState);
			kernel.setHeartbeatRunner(nextState.heartbeatRunner);
			if (kernel.swapCronState(nextState.cronState) !== nextState.cronState) cronStartState.handled = true;
		},
		getPluginMetadataSnapshot,
		getPluginRegistry: () => runtime.pluginRuntime.registry,
		startChannel,
		stopChannel,
		getChannelAutostartSuppression: channelManager.getAutostartSuppression,
		stopPostReadySidecars: stopRegisteredPostReadySidecars,
		reloadPlugins: kernel.reloadPlugins,
		reloadPluginServices: async (config, serviceIds) => {
			const services = runtimeState.pluginServices;
			if (!services) throw new Error("Plugin services are not attached");
			await services.reload(config, serviceIds);
		},
		logHooks,
		logChannels,
		logCron,
		logReload,
		cronReconciliation,
		onCronRestart: () => {
			cronStartState.handled = true;
		},
		prepareTerminalConfig: (plan, nextConfig) => {
			terminalLaunchPolicy.prepareConfig(nextConfig, { restartPending: plan.restartGateway });
		},
		reconcileRuntimePolicy: async (nextConfig, phase) => {
			terminalSessions.closeDisallowedAgents((agentId) => terminalLaunchPolicy.resolve(agentId).ok);
			if (phase !== "committed") return;
			terminalSessions.updateDetachGraceMs((nextConfig.gateway?.terminal?.detachedSessionTimeoutSeconds ?? 300) * 1e3);
			disconnectDisallowedGatewayPolicyClients(clients.authorityClients, nextConfig);
			for (const nodeSession of nodeRegistry.refreshRuntimePolicy(nextConfig)) refreshConnectedNodeSurfaceCaches({
				context: gatewayRequestContext,
				nodeSession
			});
			const failed = (await Promise.allSettled([
				runtime.hostDesktopService.reconcileRuntimePolicy(),
				runtime.gatewayComputerService.reconcileRuntimePolicy(),
				workerEnvironmentService?.reconcileDesktopPolicy(),
				nodeDesktopService.reconcileRuntimePolicy(),
				runtimeState.discovery?.update({ mdnsMode: nextConfig.discovery?.mdns?.mode }),
				(async () => {
					const customPluginUiEnabled = nextConfig.gateway?.controlUi?.experimental?.customPlugins === true;
					if (customPluginUiEnabled !== appliedCustomPluginUiEnabled) {
						const { listControlUiPluginCatalog } = await import("./control-ui-plugin-assets-Dw9jbnq4.mjs");
						const catalog = await listControlUiPluginCatalog();
						broadcast("plugins.controlUi.changed", { revision: catalog.revision });
						appliedCustomPluginUiEnabled = customPluginUiEnabled;
					}
				})()
			])).find((result) => result.status === "rejected");
			if (failed) throw failed.reason;
		},
		commitRuntimePolicy: (nextConfig) => {
			controlUiRootLifecycle.setEnabled(opts.controlUiEnabled ?? nextConfig.gateway?.controlUi?.enabled ?? true);
			runtime.configureDiagnostics(nextConfig);
			runtimeState.reconcileAuditPolicy?.(nextConfig);
			const rateLimit = nextConfig.gateway?.auth?.rateLimit;
			authRateLimiter.updateConfig(rateLimit);
			browserAuthRateLimiter.updateConfig({
				...rateLimit,
				exemptLoopback: false
			});
			nodeReapprovalCoordinator.updateConfig(rateLimit);
			terminalLaunchPolicy.commitConfig();
			workerEnvironmentService?.schedulePreparedRefill();
		},
		acceptTerminalConfig: terminalLaunchPolicy.acceptConfig,
		channelManager,
		activateRuntimeSecrets,
		assertRuntimeSecurityConfig,
		prepareConfigCandidate: prepareReloadCandidate,
		applyRuntimeConfigOverrides: applyFixedGatewayOverlays,
		resolveSharedGatewaySessionGenerationForConfig,
		sharedGatewaySessionGenerationState,
		clients,
		...opts.hotReloadRecovery ? { requestRecoveryRestart: opts.hotReloadRecovery } : {},
		restartRecoveryAvailable: opts.hotReloadRecovery !== void 0
	};
	if (lifecycle.closePreludeStarted) return { startupSettled: postAttachHandles.startupSettled };
	const configReloader = startManagedGatewayConfigReloader(configReloaderParams);
	kernel.setConfigReloaderHandle(configReloader);
	await configReloader.ready;
	if (lifecycle.closePreludeStarted) return { startupSettled: postAttachHandles.startupSettled };
	await promoteConfigSnapshotToLastKnownGood(configSnapshot).catch((err) => {
		log.warn(`gateway: failed to promote config last-known-good backup: ${String(err)}`);
	});
	if (!minimalTestGateway) {
		const gatewayRuntimeServices = await loadScheduledServicesModule();
		gatewayRuntimeServices.scheduleGatewayPostReadyMaintenance({
			scheduler: runtime.scheduler,
			signal: runtime.connectionWork.signal,
			delayMs: POST_READY_MAINTENANCE_DELAY_MS,
			isClosing: () => lifecycle.closePreludeStarted,
			startMaintenance: async () => {
				await params.waitForPostReadyWork();
				if (lifecycle.closePreludeStarted) return null;
				return earlyRuntime.startMaintenance(activeWorkInspectors);
			},
			applyMaintenance: async (maintenance) => {
				if (lifecycle.closePreludeStarted) {
					await clearGatewayMaintenanceHandles(maintenance);
					return;
				}
				kernel.setMaintenanceHandles(maintenance);
				maintenance.startMediaCleanup();
			},
			shouldStartCron: () => !lifecycle.closePreludeStarted && !cronStartState.handled,
			markCronStartHandled: () => {
				cronStartState.handled = true;
			},
			cronState: runtimeState.cronState,
			cronReconciliation,
			cronConfig: cfgAtStart,
			logCron,
			log,
			recordPostReadyMemory: () => {
				startupTrace.detail("memory.post-ready", collectGatewayProcessMemoryUsageMb());
			}
		});
		const startupInstallPaths = [...Object.values(pluginMetadataSnapshot?.index.installRecords ?? {}).flatMap((record) => record.installPath ? [record.installPath] : []), ...pluginMetadataSnapshot?.plugins.flatMap((record) => record.setupSource ? [
			record.rootDir,
			record.source,
			record.setupSource
		] : [record.rootDir, record.source]) ?? []];
		registerGatewayLifetimeSidecars(gatewayRuntimeServices.scheduleGatewayIdleTask({
			id: "maintenance:retained-plugin-generations",
			scheduler: runtime.scheduler,
			delayMs: RETAINED_PLUGIN_CLEANUP_DELAY_MS,
			retryDelayMs: RETAINED_PLUGIN_CLEANUP_DELAY_MS,
			isClosing: () => lifecycle.closePreludeStarted,
			isBusy: () => getActiveGatewayRootWorkCount({ excludeCurrent: true }) > 0,
			run: async () => {
				const { cleanupRetainedPluginInstallGenerations } = await import("./server-retained-plugin-cleanup-Cb4yXXlW.mjs");
				await cleanupRetainedPluginInstallGenerations({
					log,
					startupInstallPaths
				});
			},
			log,
			errorMessage: "retained npm generation cleanup failed"
		}));
		registerGatewayLifetimeSidecars(gatewayRuntimeServices.scheduleGatewayIdleTask({
			id: "maintenance:sqlite-snapshots",
			scheduler: runtime.scheduler,
			delayMs: RETAINED_PLUGIN_CLEANUP_DELAY_MS,
			retryDelayMs: RETAINED_PLUGIN_CLEANUP_DELAY_MS,
			isClosing: () => lifecycle.closePreludeStarted,
			isBusy: () => getActiveGatewayRootWorkCount({ excludeCurrent: true }) > 0,
			repeatDelayMs: 9e5,
			run: async () => {
				const { reclaimAbandonedSqliteSnapshotsAsync } = await import("./sqlite-snapshot-staging-CPfFW3PN.mjs");
				await reclaimAbandonedSqliteSnapshotsAsync();
			},
			log,
			errorMessage: "SQLite snapshot staging cleanup failed"
		}));
	} else startupTrace.detail("memory.post-ready", collectGatewayProcessMemoryUsageMb());
	return { startupSettled: postAttachHandles.startupSettled };
}
//#endregion
//#region src/gateway/server-start.ts
const loadGatewayStartupPostAttachModule = createLazyRuntimeModule(() => import("./server-startup-post-attach-BajaQAjw.mjs"));
const { log, logTailscale, logChannels, logHealth, logCron, logReload, logHooks, logWsControl } = gatewayKernelLogs;
const POST_READY_WORK_START_DELAY_MS = 500;
async function startGatewayServerCore(port = 18789, opts = {}) {
	const sdkResourceHost = new LegacyPluginSdkResourceHost();
	const start = (signal) => runOutsideAsyncWorkScope(() => startGatewayServerWithSdkHost(port, opts, sdkResourceHost, signal));
	return await sdkResourceHost.run(() => opts.startupOperation ? opts.startupOperation(start) : start());
}
async function startGatewayServerWithSdkHost(port, opts, sdkResourceHost, signal) {
	const { promise: postReadyWorkBarrier, resolve: releasePostReadyWork } = createDeferredCore();
	const gatewayKernel = await createGatewayKernel(port, opts, {
		deferEarlyRuntime: true,
		sdkResourceHost
	});
	bumpSkillsSnapshotVersion({ reason: "manual" });
	if (!gatewayKernel.minimalTestGateway) beginMacOSSystemCaWarmupOnce({ log });
	let startupSettled;
	let tailscaleStopping;
	let stopStartingTailscale;
	const { beginClosePrelude, closeOnStartupFailure, prepareClose, terminalSessions, shutdownRuntime } = gatewayKernel;
	try {
		const transport = await createGatewayHttpTransport({
			...gatewayKernel.createHttpTransportOptions(),
			updateCanary: opts.updateCanary,
			...!gatewayKernel.minimalTestGateway && gatewayKernel.tailscaleMode !== "off" ? { prepareManagedTailscaleIngress: async (backend) => {
				const { startGatewayTailscaleExposure } = await import("./server-tailscale-Cj1L69zf.mjs");
				const cleanup = await startGatewayTailscaleExposure({
					tailscaleMode: gatewayKernel.tailscaleMode,
					preserveFunnel: gatewayKernel.tailscaleConfig.preserveFunnel ?? false,
					port,
					backend,
					controlUiBasePath: gatewayKernel.controlUiBasePath,
					logTailscale,
					signal
				});
				gatewayKernel.kernel.setTailscaleCleanup(cleanup);
				stopStartingTailscale = () => {
					tailscaleStopping ??= cleanup?.();
					tailscaleStopping?.catch(() => {});
				};
				signal?.addEventListener("abort", stopStartingTailscale, { once: true });
				if (signal?.aborted) {
					stopStartingTailscale();
					signal.throwIfAborted();
				}
			} } : {}
		});
		gatewayKernel.transportBridge.attach(transport);
		startupSettled = (await finishGatewayStartup({
			kernelRuntime: {
				...gatewayKernel,
				...transport
			},
			port,
			opts,
			bootId: gatewayKernel.bootId,
			log,
			logHealth,
			logWsControl,
			logHooks,
			logChannels,
			logCron,
			logReload,
			loadGatewayStartupPostAttachModule,
			waitForPostReadyWork: () => postReadyWorkBarrier
		})).startupSettled;
		signal?.throwIfAborted();
	} catch (err) {
		releasePostReadyWork();
		return await rethrowGatewayStartupError(err, closeOnStartupFailure);
	} finally {
		if (stopStartingTailscale) signal?.removeEventListener("abort", stopStartingTailscale);
		await tailscaleStopping;
	}
	startupSettled.then(() => {
		if (gatewayKernel.lifecycle.closePreludeStarted) return;
		gatewayKernel.scheduler.schedule({
			id: "startup:post-ready-work",
			delayMs: POST_READY_WORK_START_DELAY_MS,
			run: releasePostReadyWork
		});
	}, () => {});
	let closePromise;
	return {
		startupSettled,
		getTailscaleIngressEndpoint: gatewayKernel.transportBridge.getTailscaleIngressEndpoint,
		close: (optsLocal) => {
			if (!closePromise) closePromise = sdkResourceHost.run(async () => {
				const prelude = beginClosePrelude(optsLocal);
				releasePostReadyWork();
				await prelude;
				const close = await prepareClose(optsLocal);
				await runGatewayCloseSteps({
					owner: gatewayKernel,
					close,
					disposeTerminalSessions: () => terminalSessions.disposeAll(),
					runStopHooks: async () => {
						await shutdownRuntime.runGlobalGatewayStopSafely({
							registry: gatewayKernel.pluginRuntime.registry,
							event: { reason: optsLocal?.reason ?? "gateway stopping" },
							ctx: { port },
							onError: (error) => log.warn(`gateway_stop hook failed: ${formatErrorMessage(error)}`)
						});
					},
					onError: (message) => log.error(message)
				});
			}).catch((error) => {
				if (hasRetainedPluginRuntimeCloseError(error)) closePromise = void 0;
				throw error;
			});
			return closePromise;
		}
	};
}
//#endregion
export { startGatewayServerCore };
