import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { g as isFutureDateTimestampMs, j as resolveIntegerOption, w as parseStrictPositiveInteger } from "./number-coercion-CkhMiRw8.mjs";
import { a as extractErrorCode, l as readErrorName, s as formatErrorMessage } from "./error-coercion-BwMr25F8.mjs";
import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { a as runOutsideAsyncWorkScope, t as AsyncWorkScope } from "./async-work-scope-BH2yUdBz.mjs";
import { p as getPluginMetadataSnapshotCache } from "./plugin-cache-BbahpD-b.mjs";
import { i as pluginInstanceInvocation } from "./plugin-instance-invocation-DjfKDZW8.mjs";
import { r as resolveOpenClawPackageRootSync } from "./openclaw-root-CPodxfi3.mjs";
import { c as isVitestRuntimeEnv, n as isTruthyEnvValue, r as logAcceptedEnvOption } from "./env-DbG527wb.mjs";
import "./src-Djeo9OvP.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { u as normalizeSortedUniqueTrimmedStringList, y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { c as isSecretRef } from "./ref-contract-Bfd9_-Lp.mjs";
import "./types.secrets-Dgbd2kyP.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { S as resolveIsConfigReadOnly, l as isNixMode, u as normalizeStateDirEnv } from "./paths-orClZ-2Z.mjs";
import { a as registerSecretValueForRedaction } from "./secret-redaction-registry-C0-kg1Rg.mjs";
import { t as formatErrorMessage$1 } from "./errors-DPfGDWk1.mjs";
import { d as withPluginRuntimeRegistryScope, f as bindGatewayContextResolver, h as getGatewayContextLifetime } from "./gateway-request-scope-1BXD1G3l.mjs";
import { i as hasRetainedPluginRuntimeCloseError } from "./runtime-close-error-DOUCCb00.mjs";
import { n as bindLegacyPluginSdkResourceHost, t as LegacyPluginSdkResourceHost } from "./legacy-sdk-resource-host-DBY7FuQ8.mjs";
import { t as bumpSkillsSnapshotVersion } from "./refresh-state-DoFid57J.mjs";
import { r as closePreparedModelRuntimeSnapshots } from "./prepared-model-runtime.lifecycle-wUGazXvM.mjs";
import { P as runWithDiagnosticTraceContext, T as createDiagnosticTraceContext, b as setDiagnosticsEnabledForProcess, o as emitInternalDiagnosticEvent, p as isDiagnosticsEnabled, q as hasInternalDiagnosticEventInterest, t as areDiagnosticsEnabledForProcess } from "./diagnostic-events-C91J-XX8.mjs";
import { t as applyLoggingConfig } from "./logger-DR3u4tgD.mjs";
import { n as runtimeForLogger, t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { n as runWithMainThreadTask, t as createMainThreadStallMonitor } from "./main-thread-stall-BJxVH-It.mjs";
import { t as GatewayScheduler } from "./gateway-scheduler-DzQtXKjV.mjs";
import { i as prepareGatewayAgentCliShim, t as clearGatewayAgentCliShim } from "./openclaw-cli-shim-NzMcmIk3.mjs";
import { t as ensureOpenClawCliOnPath } from "./path-env-CEnHRj9k.mjs";
import { l as resolveRuntimeServiceVersion, s as resolveRuntimeServiceBuildId } from "./version-jg_14gWz.mjs";
import { c as initializePublishedConfigRuntimeEnv, i as collectConfigRuntimeEnvOwnership, l as prepareConfigRuntimeEnv } from "./config-env-vars-BHneg24Q.mjs";
import { c as resolveOpenClawStateSqlitePath, r as resolveDatabasePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { r as getTrackedWorkerCpuSources } from "./worker-cpu-c5lFIb1t.mjs";
import { t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-22SfWsLt.mjs";
import { _ as withSqliteReadOnlyWorkerScope } from "./sqlite-readonly-worker-C2DDLw_y.mjs";
import { n as runWithSpawnBroker, t as getSpawnBroker } from "./context-JTQRB4fe.mjs";
import { r as withArtifactPreservingStateReads } from "./artifact-preserving-state-reads-CSUBkGbZ.mjs";
import { t as captureSqliteReadOnlyWorkerScope } from "./sqlite-readonly-worker-context-DNk9aB7C.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { a as isSameOpenClawAgentDatabasePath, s as resolveIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { b as registerOpenClawStateDatabaseLifecycleListener, m as openClawStateDatabaseCache, y as registerOpenClawStateDatabaseAsyncResource } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { f as ModelAccountConnectAuthorityError, p as ModelAccountConnectInputError } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { r as createLazyPromiseLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { i as createLazyRuntimeNamedExport, n as createLazyRuntimeMethodBinder, r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { i as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { E as setAppliedRuntimeConfigSnapshot, g as readRuntimeConfig, l as getRuntimeConfigSourceSnapshot, o as getRuntimeConfigSnapshot } from "./runtime-snapshot-BBYDJbw9.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { r as assertOpenClawStateWriteAllowedAtPath } from "./openclaw-state-ownership-SRnMuR_a.mjs";
import { o as prepareRemoteModelCatalogStartupSnapshot } from "./remote-overlay-ClWDV070.mjs";
import { i as getGatewayPluginMetadataSnapshot, s as selectCurrentPluginMetadataCache } from "./current-plugin-metadata-state-jN_Zk4yK.mjs";
import { n as registerPluginMetadataProcessMemoLifecycleClear, r as retainGatewayPluginMetadata } from "./plugin-metadata-lifecycle-C2eV0eNq.mjs";
import { a as sessionChanges } from "./session-row-changes-vFaNnKNM.mjs";
import { r as copyConfigResolutionFacts } from "./resolution-facts-D_pto3MV.mjs";
import { j as validateAgentRunDelegatedAuthority } from "./agent-run-registry-gmaPgO-n.mjs";
import { i as isIncognitoSessionKey, t as resolveIncognitoSessionExpiresAt } from "./incognito-session-key-BWpn88lo.mjs";
import { I as buildControlUiSessionPath, M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { t as isControlUiFocusPath } from "./focus-DxRHZNgd.mjs";
import { n as getPluginInstance } from "./plugin-instance-scope-BoTOTPL4.mjs";
import { M as onPluginHttpRoutesChanged, a as createPluginRegistryOwner } from "./runtime-DkPagH0y.mjs";
import { o as listLoadedChannelPluginsForRegistry } from "./registry-loaded-B-WQB-l0.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { t as dedupeByKey } from "./dedupe-by-key-DnqEVrst.mjs";
import { c as setGatewayPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-BK2DY7Lo.mjs";
import { r as flushDiagnosticsTimeline } from "./diagnostics-timeline-BgymzmGj.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-DET-4y9k.mjs";
import { a as hasGatewayClientCap, t as GATEWAY_CLIENT_CAPS } from "./client-info-BgcoFakQ.mjs";
import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import "./sessions-CVESrViJ.mjs";
import { W as isUserModelAuthProfileId } from "./user-model-account-authority-DFFjC5J5.mjs";
import { d as getGatewaySuspendAdmissionPhase, h as isGatewayWorkAdmissionClosed, p as isGatewayRestartDraining, s as getActiveGatewayRootWorkCount } from "./gateway-work-admission-FWbk4b3p.mjs";
import { i as hashConfigRaw } from "./io.read-helpers-KYk5dB53.mjs";
import { m as listAgentDatabaseAdmissionRefusals, r as canIsolateAgentDatabase } from "./agent-database-admission-CeDA0ojh.mjs";
import { i as onInternalSessionTranscriptUpdate } from "./transcript-events-D3brcRJS.mjs";
import { v as resolveAuthProfileDatabasePath } from "./sqlite-BlFpr2YD.mjs";
import { c as onUserProfilesChanged, g as readUserProfileVersion, r as captureUserProfileModelAccountLinksAuthority } from "./user-profile-events-CXjmX5Qy.mjs";
import { f as resolveSharedMainAuthAgentDir } from "./path-resolve-21Orzn6B.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { a as getActiveSecretsRuntimeConfigSnapshot, i as clearSecretsRuntimeSnapshotState } from "./runtime-state-DDDhACod.mjs";
import { n as getAgentDatabaseStartupAdmission, t as AgentDatabaseStartupSupersededError } from "./agent-database-startup-DQZqWc4z.mjs";
import { t as isCoreCanvasHostEnabled } from "./config-DvrkJSoS.mjs";
import { i as withCoreCanvasNodeCapability, n as isCanvasDocumentHttpPath, r as resolveCanvasNodeCapability } from "./constants-Cm4bJJ1Q.mjs";
import { d as captureConfigOverrideApplier, t as createConfigIO } from "./io.factory-B5D3Sy_M.mjs";
import { t as resolveGatewayPublicOrigin } from "./gateway-public-origin-BcHLka2A.mjs";
import { a as resolveControlUiAllowedOrigins, n as ensureControlUiAllowedOriginsForNonLoopbackBind } from "./gateway-control-ui-origins-Di731Cdm.mjs";
import { a as READ_SCOPE, c as TALK_SCOPE, i as QUESTIONS_SCOPE, n as APPROVALS_SCOPE, o as SESSION_READ_SCOPE, r as PAIRING_SCOPE, t as ADMIN_SCOPE } from "./operator-scopes-BO7_XQCg.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import { n as assertGatewayConfigEnvSelectionUnchanged } from "./gateway-env-selection-CVppArD2.mjs";
import { c as readConfigFileSnapshotForRuntimeTransaction, i as promoteConfigSnapshotToLastKnownGood, u as readConfigFileSnapshotWithPluginMetadata, y as registerConfigWriteListener } from "./io.runtime-Ds5uC0Bf.mjs";
import "./io-DIF-KW3P.mjs";
import { t as adoptPluginHttpRouteHandoffs } from "./http-registry-eGHR5upq.mjs";
import { s as resolveMessageActionTurnCapability } from "./message-action-turn-capability-CbQswcwc.mjs";
import { t as extractAssistantPhaseText } from "./chat-message-content-C-d0FKNG.mjs";
import { o as captureWorkerTurnClaimCurrentness } from "./placement-turn-claim-events-C-F0mgX3.mjs";
import { d as revokeAttachGrantsForSession, t as GatewayConnectionWork } from "./server-connection-work-CPT9-wld.mjs";
import { a as roleScopesAllow, n as operatorScopeSatisfied } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { n as authorizeOperatorScopesForMethod } from "./method-scopes-Bcx3NDQr.mjs";
import { c as listCoreGatewayMethodNames, n as createCoreGatewayMethodDescriptors, r as isCoreGatewayMethodClassified, t as STARTUP_UNAVAILABLE_GATEWAY_METHODS } from "./core-method-policy-BdmwLcmW.mjs";
import { n as createGatewayMethodRegistry, t as createGatewayMethodDescriptorsFromHandlers } from "./registry-DRhwbWWk.mjs";
import { t as isContainerEnvironment } from "./container-environment-e2wGNmXf.mjs";
import { _ as resolveGatewayListenHosts, d as isTrustedProxyAddress, r as isLocalDirectRequest, s as isLoopbackHost } from "./net-CjQwRK-V.mjs";
import { n as isBrowserOperatorUiClient, t as isBrowserCopilotClient } from "./message-channel-DmAdWHmL.mjs";
import { t as memorySessionActorOwners } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { l as withSystemEventOwner } from "./system-event-ownership-DAgHWXZ1.mjs";
import { i as publishSystemEventStoreConfig } from "./session-store-path-BQkYPc4_.mjs";
import { s as enqueueSystemEvent } from "./system-events-Bf4ozS7L.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { _ as readGatewayAccessRevision, m as resolveOperatorRolePolicyForProfile, n as authorizeGatewaySessionCreation } from "./operator-role-policy-Coro3qc5.mjs";
import { c as resolveSystemMainSessionTarget } from "./main-session-CHYPkxYr.mjs";
import { r as onSessionIdentityMutation } from "./session-lifecycle-events-76OxWRqj.mjs";
import { i as decodeSandboxHostCsp, n as buildSandboxHostDocument, o as resolveSandboxHostPort } from "./sandbox-host-dr8HnvFE.mjs";
import { g as stripInternalRuntimeContext } from "./internal-runtime-context-DLJtDQoI.mjs";
import { t as flattenMarkdownToPlainText } from "./markdown-plain-text-D0Mjik_o.mjs";
import { l as sanitizeAssistantVisibleTextWithProfile } from "./assistant-visible-text-DZwixI8b.mjs";
import { c as isTranscriptOnlyOpenClawAssistantMessage } from "./transcript-only-openclaw-assistant-Dn9Tr_eT.mjs";
import { o as runWithSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { s as resolveConfiguredAgentDatabaseTargets, t as isConfiguredAgentDatabaseTarget } from "./targets-DJGC6v85.mjs";
import { v as updateSessionProfileInvolvementAsync } from "./session-accessor-Czw4l8kI.mjs";
import { t as warnSessionPersistenceDeprecation } from "./session-persistence-deprecation-BRA1CvXF.mjs";
import { n as beginSessionWorkAdmission } from "./session-lifecycle-admission-BihxXo5j.mjs";
import { o as resolveSessionEventAgentScope, r as resolveRequestedSessionAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import { a as resolveSessionStoreIdentity } from "./session-store-key-DKpto8R6.mjs";
import "./sessions-CnzPI1yx.mjs";
import { i as tryLoadActivatedBundledPluginPublicSurfaceModule } from "./facade-runtime-aXETij2D.mjs";
import { a as upsertPresence, n as listSystemPresence, t as commitPresence } from "./system-presence-Di2OrVHO.mjs";
import { f as buildRateLimitIdentityKey, p as createGatewayAuthRateLimiter, s as AUTH_RATE_LIMIT_SCOPE_NODE_REAPPROVAL, u as AUTH_RATE_LIMIT_SCOPE_WORKER_ADMISSION } from "./auth-rate-limit-ByL4y2DQ.mjs";
import { s as readTailscaleWhoisIdentity } from "./tailscale-DIe8yR1S.mjs";
import { a as getRemoteControlUiIngressContext, c as prepareGatewayIngressAttribution, i as createGatewayUnattributableProxyReporter, n as PROXY_ATTRIBUTION_REQUIRED_REASON, r as assertRemoteControlUiIngressCurrent, s as markGatewayIngressTransport, t as PROXY_ATTRIBUTION_GUIDANCE, u as readPreparedGatewayIngressAttribution } from "./ingress-attribution-CP_2XS9r.mjs";
import { n as mergeGatewayAuthConfig, r as resolveGatewayAuth } from "./auth-resolve-BLx2Z8Ad.mjs";
import { r as authorizeHttpGatewayConnect } from "./auth-fv7y-hds.mjs";
import { i as GATEWAY_EVENT_UPDATE_RUN_CHANGED, n as GATEWAY_EVENT_NODE_RUNNER_INVENTORY_CHANGED, t as GATEWAY_EVENT_DEVICE_PAIR_CHANGED } from "./events-ds0bML-H.mjs";
import { t as authenticatedProfileUnavailableError } from "./gateway-client-identity-DXWhtQve.mjs";
import { _ as resolveSessionVisibility, g as resolveSessionSharingTargetAsync, p as isSessionVisibilityAllowed } from "./session-sharing-policy-vx7GWqzs.mjs";
import { n as getSessionRowProjection } from "./session-row-projection-access-BUm5f-cY.mjs";
import { t as notifyGatewayWorkMetricsChanged } from "./gateway-work-metrics-events-SooEjUbR.mjs";
import { i as prepareTalkConnectionClose } from "./session-registry-nF17nW_H.mjs";
import { n as createProfileSessionEntryFilter, o as prepareProjectedSessionSharing, s as prepareSessionSharing, t as canReceiveSessionEvent } from "./session-sharing-read-B9_xLej9.mjs";
import "./session-sharing-DuL10izq.mjs";
import { n as prepareSessionSharingRead } from "./session-sharing-target-read-DwJlM38W.mjs";
import { t as createPresenceRecipientProjection } from "./presence-projection-bio8SjzA.mjs";
import { a as incrementPresenceVersion, i as getPresenceVersion, o as refreshGatewayHealthSnapshot, r as getHealthVersion } from "./health-state-DhfLHtHh.mjs";
import { i as onGatewayPolicyClientInvalidated } from "./ws-policy-close-2inJAtve.mjs";
import { c as normalizePluginNodeCapabilityScopedUrl, d as reconcileClientPluginNodeCapabilities, o as indexPluginNodeCapabilitySurfaces } from "./plugin-node-capability-3KBblmAq.mjs";
import { n as resolvePluginRoutePathContext, t as isProtectedPluginRoutePathFromContext } from "./path-context-B0Rya5D6.mjs";
import { t as findMatchingPluginHttpRoutes } from "./route-match-BMEx2Cif.mjs";
import { n as listPluginNodeCapabilities, t as findMatchingPluginNodeCapabilityRoute } from "./route-capability-D3mP9gle.mjs";
import { n as invalidateSharedReadResponses } from "./shared-read-responses-Dazz7RX_.mjs";
import { t as resolveGrantExpiryDaysConfig } from "./standing-grant-expiry-config-CqUe6ux8.mjs";
import { i as retireQuestionChannelGateway } from "./question-channel-runtime-DgJgVgIZ.mjs";
import { i as closeGatewayDeviceRevocation } from "./device-revocation-DpGQRUdo.mjs";
import { t as shouldUseGatewayOwnerProfile } from "./gateway-owner-profile-XemZih0r.mjs";
import { t as deriveSessionTitle } from "./session-utils-core-DYhQWF9T.mjs";
import { n as createGatewayChatMetadataLifecycle, t as broadcastChatMetadataChanged } from "./server-chat-metadata-lifecycle-MfuAG3Bn.mjs";
import { s as subscribeSecretStoreChanges } from "./secret-store-hidden-github-BnB_SZXU.mjs";
import { i as purgeExpiredSecretStoreEntries, n as getSecretStoreExpiryDeadline } from "./secret-store-d5UF_g7X.mjs";
import { d as runHttpConnectionRequest } from "./http-body-DZQjJc2J.mjs";
import { n as installActiveGitHubOAuthLifecycle, t as createGitHubOAuthLifecycle } from "./github-oauth-lifecycle-BAlR2l66.mjs";
import { a as prepareWorktreeRunEndClose } from "./run-end-lifecycle-DPl2TsZ4.mjs";
import { n as startGitHubPublicationDiscovery } from "./github-publication-discovery-Byp0fSsI.mjs";
import { v as closeAuthProfileUsage } from "./store-BPXZsh12.mjs";
import { a as listUserModelAccounts, d as readUserModelAccountSummary, h as setUserProfileAuthLink, o as listUserProfileAuthLinks, s as listUserProfileAuthLinksAsync, t as clearUserProfileAuthLink } from "./user-model-accounts-CrjNQiMH.mjs";
import { a as classifyMcpAppStandalonePath, c as classifyWorkerBootstrapArtifactTransferPath, i as classifyGatewayProbePath, l as classifyWorkerGatewayPath, o as classifyNodeWorkerBundleTransferPath, r as WORKER_BOOTSTRAP_ARTIFACT_TRANSFER_PATH, s as classifyNodeWorkspaceTransferPath } from "./gateway-http-route-contracts-jBtizxKU.mjs";
import { r as GatewayOperatorAccessUnavailableError } from "./operator-access-policy-D9L4Y9uO.mjs";
import { a as resolveDiscoverableProviderOwnerPluginIds } from "./providers-3h1HIigh.mjs";
import { c as ensureAuthProfileStoreWithoutExternalProfilesAsync, s as ensureAuthProfileStoreWithoutExternalProfiles } from "./store-runtime-CwqGD12G.mjs";
import { i as resolveManifestProviderAuthChoices } from "./provider-auth-choices-D2ZKE-Sc.mjs";
import { t as runProviderPluginAuthMethodUnpersisted } from "./provider-auth-method-B-a08sP-.mjs";
import { c as readUserModelAccountSummaryAsync, i as listUserModelAccountsAsync, l as setUserProfileAuthLinkAsync, n as connectUserModelAccountAsync, o as readSelectedUserModelAccountAsync, t as clearUserProfileAuthLinkAsync } from "./user-model-account-operations-DIqTwy80.mjs";
import { n as sanitizeWizardStepForClient, t as WizardSession } from "./session-BK80iJWA.mjs";
import { r as queuePluginSessionsChanged } from "./gateway-events-BQc8kPt3.mjs";
import { l as controlUiPluginAssetRoot } from "./control-ui-plugin-tabs-y8H4PDI0.mjs";
import { n as resolveControlUiWebPushUrl, t as normalizeControlUiBasePath } from "./control-ui-shared-DqFhbHR8.mjs";
import { a as parseControlUiUserAvatarPath, i as parseControlUiResourcePath, o as resolveAssistantMediaRoutePath } from "./control-ui-resource-routes-B42sqIG-.mjs";
import "./control-ui-contract-IX_0OA0h.mjs";
import { t as resolveCurrentUserProfileDisplay } from "./current-user-profile-display-84IsFWS2.mjs";
import { n as runWithProcessCleanupBudget, t as getProcessCleanupBudget } from "./cleanup-budget-B-yQr9sD.mjs";
import { o as resolveAssistantAgentId } from "./assistant-avatar-DB_cUu5U.mjs";
import { n as SessionAncestorReferences, t as prepareSessionEventProjection } from "./session-event-projection-CYD_kL8k.mjs";
import { o as resolveActiveEmbeddedRunSessionId } from "./active-run-projections-Crpg2l0z.mjs";
import { f as startGatewayDiagnosticHeartbeat, p as stopGatewayDiagnosticHeartbeat } from "./diagnostic-Dz-YV3uh.mjs";
import { i as resolveCronJobsStorePathFromConfigAsync } from "./paths-C7jZRDkL.mjs";
import { t as createVisibleActiveSessionRunProjector } from "./session-active-runs-CAoWtmWT.mjs";
import { t as attachSessionChangeEventLifetime } from "./session-change-event-0LxChmzi.mjs";
import { n as readPreparedServerMethodModelCatalogs } from "./optional-model-catalog-CdAVHxWe.mjs";
import { n as prepareSandboxRegistryClose } from "./registry-lifecycle-COPxA84A.mjs";
import { n as fenceSessionSuspensionWritesForGatewayShutdown } from "./session-suspension-CAhJSkXK.mjs";
import { t as getTotalPendingReplies } from "./dispatcher-registry-CPznLgPI.mjs";
import "./command-queue-Dvag6gVL.mjs";
import { t as createGatewayActiveWorkSnapshot } from "./gateway-active-work-_DX5iUkP.mjs";
import { a as isGatewaySuspendControlAvailable, o as markGatewaySuspendExiting } from "./gateway-suspend-coordinator-DPGYs58l.mjs";
import { c as removeRemoteNodeInfoForConnection, i as recordRemoteNodeInfo, s as removeRemoteNodeInfo } from "./remote-CgYoyov-.mjs";
import { f as requestNodePairing, p as reusePendingNodePairingForReconnect, r as finalizeNodePairingCleanupClaim } from "./device-pairing-node-C7M5fQRZ.mjs";
import { t as prepareControlUiSessionPrRead } from "./control-ui-session-pr-read-CfmRdkBJ.mjs";
import { t as createControlUiSessionPullRequestSubscriptions } from "./control-ui-session-pr-subscriptions-BVyPVROo.mjs";
import { a as retireDeviceTokenClients, i as startNodeConnectionNotifications, t as disconnectDisallowedGatewayPolicyClients } from "./ws-origin-policy-uEg2XA7h.mjs";
import { f as publishHooksTokenEnvKey } from "./hooks-C6wwC8eA.mjs";
import { h as waitForNodeWorkerSupervisor } from "./node-registry-private-Dv3TwbYd.mjs";
import { i as clearNodeWakeState } from "./node-wake-state-CWVR-GCk.mjs";
import { f as resumeGatewayRestartTraceFromEnv, i as finishGatewayRestartTrace, n as collectGatewayProcessMemoryUsageMb, p as resumeGatewayRestartTraceFromHandoff, s as measureGatewayCloseStep } from "./restart-trace-BTv1cWuA.mjs";
import { n as applyGatewayLaneConcurrency, r as resolveGatewayLaneConcurrency, t as resolveHookClientIpConfig } from "./hook-client-ip-config-CF5RxZ17.mjs";
import { r as waitForMediaCleanupDrains, t as MEDIA_CLEANUP_STOP_TIMEOUT_MS } from "./server-media-cleanup-lifecycle-BDAQKVyV.mjs";
import { n as createNoopHeartbeatRunner, t as clearGatewayMaintenanceHandles } from "./server-maintenance-lifecycle-sBQZSAcp.mjs";
import { t as GatewayClientRequestError } from "./request-error-CnPCYq3A.mjs";
import { a as runGatewayCloseSteps, i as rethrowGatewayStartupError, r as resolveGatewayShutdownNotice } from "./server-shutdown-DFAyEigO.mjs";
import { a as MAX_PREAUTH_PAYLOAD_BYTES, i as MAX_BUFFERED_BYTES } from "./server-constants-B-cmoH_0.mjs";
import { t as recordClientPresenceActivity } from "./client-presence-BvtSzFrY.mjs";
import { r as registerGatewayModelCatalogPrivateAccess } from "./server-model-catalog-auth-d5Ty5VGR.mjs";
import { t as createDefaultDeps } from "./deps-CHvP-bJh.mjs";
import { i as loadOrCreateProcessDeviceIdentityAsync } from "./device-identity-async-BBs_AIYT.mjs";
import { n as loadGatewayTlsServerRuntime } from "./gateway-B50cq0yH.mjs";
import { r as createDesktopSessionRegistry } from "./session-registry-CRQIxzho.mjs";
import { t as createCronExecutionId } from "./run-id-kGde0n7U.mjs";
import { _ as webPushAgentAllowed, f as isWebPushQuietHours, m as normalizeWebPushDisplayLabel, v as webPushCategoryEnabled } from "./push-web-store.records-Bum4pQI9.mjs";
import { r as prepareWebPushNotificationSender, s as hasBoundWebPushSubscriptions } from "./push-web-BTMTakTG.mjs";
import { i as withCurrentWebPushAuthority, n as webPushSessionAccess, r as webPushTargetClient, t as listCurrentWebPushTargets } from "./web-push-authority-BMaaFG0X.mjs";
import { r as readUserProfileDirectory } from "./user-profile-reads-DnSqXcRI.mjs";
import { n as resolveOperatorSessionCreation } from "./session-creation-provenance-CZ3I7AOG.mjs";
import { n as MENTION_RETENTION_MS, r as getMentionStoreHeadAdmission } from "./mention-inbox-store-Dju8nmmI.mjs";
import { n as logRejectedLargePayload } from "./diagnostic-payload-BJUCTxkN.mjs";
import { t as isLiveTextAppend } from "./live-text-continuity-CerU9eca.mjs";
import { t as closeGatewayTransportWithGrace } from "./connection-transport-close-DgczQaNw.mjs";
import { n as logWs, r as summarizeAgentEventForWsLog } from "./ws-log-BIFX57Bv.mjs";
import { a as createSessionMessageSubscriberRegistry, i as createSessionEventSubscriberRegistry, r as createChatRunState } from "./server-chat-state-BW_LW3dq.mjs";
import { i as respondPlainText, r as respondNotFound } from "./control-ui-http-utils-CpDIFFwm.mjs";
import { t as createGatewayControlUiRootLifecycle } from "./server-control-ui-root-DH7UOjd4.mjs";
import { t as SharedGatewaySessionGenerationState } from "./server-shared-auth-generation-CqbvG8L5.mjs";
import { t as isChannelStartupSuppressedByEnvironment } from "./server-sidecar-startup-mode-BZT1Vmld.mjs";
import { r as createWizardSessionTracker } from "./server-wizard-sessions-CH5iw7Uu.mjs";
import { c as parseNativeCpuProfile, l as sanitizeDiagnosticProfileFrame, s as hasProfilerConflict } from "./diagnostic-profile-DB4AK5tF.mjs";
import { n as DEFAULT_CHANNEL_STALE_EVENT_THRESHOLD_MS, r as evaluateChannelHealth, t as DEFAULT_CHANNEL_CONNECT_GRACE_MS } from "./channel-health-policy-cv1tBUoD.mjs";
import { t as resolveSharedGatewaySessionGeneration } from "./ws-shared-generation-BeRsGF9T.mjs";
import { n as isRestartEnabled } from "./commands.flags-DCgrWS7a.mjs";
import { r as readGatewayRestartHandoff } from "./restart-handoff-DGK45tDN.mjs";
import { d as setGatewayRestartPolicy, f as setPreRestartDeferralCheck } from "./restart-B5lVkjlo.mjs";
import { n as resolveGatewayReloadPluginActivationCandidate, t as mergeActivationSectionsIntoRuntimeConfig } from "./plugin-activation-runtime-config-DNccnd-0.mjs";
import { t as resolveGatewayStartupSourceConfig } from "./server-startup-secret-surfaces-B3NAu0Tn.mjs";
import { t as createGatewayStartupTrace } from "./server-startup-trace-D_q4lWuA.mjs";
import { n as WebSocketServer } from "./websocket-CGHaToS5.mjs";
import { t as rejectWebSocketUpgrade } from "./websocket-upgrade-reject-D2Ac4nen.mjs";
import { i as listenGatewayHttpServer, t as createGatewayPortalService } from "./portal-service-3Aa4OnnY.mjs";
import { t as bindGatewayControlUiIngressHost } from "./remote-control-ui-ingress-host-CPHalUyp.mjs";
import "./node-desktop-stream-BZM2AiRA.mjs";
import { a as runWithGatewayHttpWorkAdmission, i as rejectGatewayUpgradeServiceUnavailable, r as shouldEnforceGatewayAuthForPluginPath, t as isPluginAuthenticatedRoutePath } from "./route-auth-D_HT25M4.mjs";
import { i as markPublicWorkerIngress, t as GATEWAY_WS_CONNECTION_KIND_PROPERTY } from "./ws-types-099MIJxx.mjs";
import "./artifact-download-CXaDlLGk.mjs";
import { n as parseDevicePairingJoinRequestPath } from "./join-code-B_OfdZ-j.mjs";
import { r as markPluginHttpLegacyListener, t as getWebhookLegacyListener } from "./http-legacy-listener-CLzHXHtG.mjs";
import { n as NODE_WORKER_BUNDLE_TRANSFER_PATH } from "./node-bundle-install-protocol-BNwb6M3N.mjs";
import { t as parseControlUiUserBackgroundPath } from "./control-ui-user-background-route-eOz68x04.mjs";
import { n as isControlUiApprovalDocumentPath, r as isControlUiPluginManagerRequest, t as classifyControlUiRequest } from "./control-ui-routing-uAI8BQgZ.mjs";
import { t as parseControlUiSessionPath } from "./parse-DyPBPdLM.mjs";
import { a as parseControlUiPublicSessionShareUrl, i as parseControlUiPublicSessionCardUrl, n as buildControlUiPublicSessionCardPath, r as buildControlUiPublicSessionSharePath } from "./public-share-aG2ajaph.mjs";
import { n as buildPublicSessionMediaBaseUrl } from "./control-ui-public-session-project-BdcQ5aRP.mjs";
import { t as isSecurePublicSessionIngress } from "./control-ui-public-session-ingress-C0YCOnAV.mjs";
import { t as PUBLIC_SESSION_CONTENT_SECURITY_POLICY } from "./control-ui-public-session-render-NfQNyGuT.mjs";
import { n as resolveControlUiShareOrigin, t as isControlUiSharePath } from "./control-ui-share-DxzTW02e.mjs";
import { n as controlUiSessionEntryPath } from "./control-ui-session-entry-path-mAdcjKkp.mjs";
import { t as isTerminalConfigEnabled } from "./enabled-BSjeiWpO.mjs";
import { c as sendGatewayAuthFailure, h as setDefaultSecurityHeaders, n as finishFailedGatewayHttpResponse, r as isWebSocketUpgradeRequest } from "./http-common-DyL3AdjD.mjs";
import { a as finishGatewayHttpAuthorityError, o as runGatewayHttpRequest } from "./http-request-authority-Dyt1S0uG.mjs";
import { i as handleProviderOAuthCallback, t as PROVIDER_OAUTH_CALLBACK_PATH } from "./provider-browser-auth-Dq6ILb54.mjs";
import { t as resolveRemoteControlUiHttpRoute } from "./remote-control-ui-http-routing-Ds1eVWd-.mjs";
import { n as handleArtifactTransferHttpRequest } from "./artifact-transfer-http-wUbIv9tB.mjs";
import { n as handleNodeWorkspaceTransferHttpRequest } from "./node-workspace-transfer-http-BV-PtQwi.mjs";
import { r as listConfigReloadRefinementPrefixes, s as diffGatewayReloadPaths, t as buildGatewayReloadPlan } from "./config-reload-plan-B6NE-M4X.mjs";
import { t as GATEWAY_EVENTS } from "./server-methods-list-B1Ihr5Aw.mjs";
import { n as refreshConnectedNodeSurfaceCaches } from "./nodes.read-BAsflx2P.mjs";
import { t as assertGatewayRuntimeSecurityConfig } from "./server-runtime-config-DMkOSMz0.mjs";
import { n as logGatewayReady, t as beginMacOSSystemCaWarmupOnce } from "./system-ca-warmup-DLRWPjgu.mjs";
import { t as collectGatewayWorkerPoolMetrics } from "./process-vitals-DUtOksxO.mjs";
import "./session-limits-BqiIRDwa.mjs";
import { unwatchFile, watchFile } from "node:fs";
import { versions } from "node:process";
import { createHash, randomUUID } from "node:crypto";
import { cpus } from "node:os";
import { Worker, isMainThread } from "node:worker_threads";
import { AsyncLocalStorage } from "node:async_hooks";
import { isDeepStrictEqual } from "node:util";
import { monitorEventLoopDelay, performance as performance$1 } from "node:perf_hooks";
import { setTimeout as setTimeout$1 } from "node:timers/promises";
import { isProxy } from "node:util/types";
import * as v8 from "node:v8";
import { TLSSocket } from "node:tls";
import { createServer as createServer$1 } from "node:http";
import { Server, createServer as createServer$2 } from "node:https";
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
			let startOutcomes = await manager.startChannel(channelId, accountId, {
				reason: "host-thaw",
				preserveManualStop: true
			});
			let startOutcome = startOutcomes.get(accountId);
			let restarted = manager.getRuntimeSnapshot(snapshotOptions).channelAccounts[channelId]?.[accountId];
			if (startOutcome?.status === "retry" && restarted?.restartPending === true && manager.isAccountListed(channelId, accountId)) {
				startOutcomes = await manager.startChannel(channelId, accountId, {
					reason: "host-thaw",
					preserveManualStop: true
				});
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
	const { lifecycleRuntime: runtime, port, log, logDiscovery, logHealth, logChannels, loadGatewayModelCatalog, loadGatewayModelCatalogSnapshot, readPreparedGatewayModelCatalog, readPreparedGatewayModelCatalogBatch } = input;
	const { minimalTestGateway, cfgAtStart, gatewayTls, bindHost, tailscaleMode, nodeRegistry, pluginRuntime, broadcast, nodeSendToAllSubscribed, refreshGatewayHealthSnapshotWithRuntime, dedupe, chatAbortControllers, chatQueuedTurns, restartRecoveryCandidates, chatRunState, removeChatRun, agentRunSeq, nodeHasSessionSubscribers, nodeSendToSession, runtimeState, kernel, startupTrace, channelManager, readinessEventLoopHealth, workerDispatchAuthority, clients, sharedGatewaySessionGenerationState, resolveSharedGatewaySessionGenerationForConfig, sessionMessageSubscribers, sessionEventSubscribers, toolEventRecipients, broadcastToConnIds, controlUiBasePath, workerEnvironmentService, workerPlacementControlAvailable, desktopSessionRegistry, gatewayComputerService, listStartupChannelGatewayMethods, workerEnvironmentStartup, activateRuntimeSecrets } = runtime;
	runtime.registerGatewayLifetimeSidecars({
		preparePluginReload: gatewayComputerService.preparePluginReload,
		stop: async () => {
			await gatewayComputerService.close();
			await desktopSessionRegistry.stopAll();
		}
	});
	const secretEgressProxy = cfgAtStart.secrets?.egressProxy?.enabled === true ? await import("./runtime-DGbDNPCj.mjs").then((egressRuntime) => egressRuntime.startGatewaySecretEgressProxy({
		...cfgAtStart.secrets?.egressProxy?.allowedHosts !== void 0 ? { allowedHosts: cfgAtStart.secrets.egressProxy.allowedHosts } : {},
		...cfgAtStart.secrets?.egressProxy?.bypassHosts ? { bypassHosts: cfgAtStart.secrets.egressProxy.bypassHosts } : {}
	})) : void 0;
	if (secretEgressProxy) runtime.registerGatewayLifetimeSidecars(secretEgressProxy);
	const sendNodeSessionEvent = (sessionKey, event, payload, opts) => {
		nodeSendToSession(sessionKey, event, payload, opts);
	};
	let pendingThawRestartTargets;
	let earlyRuntimePromise;
	const startEarlyRuntime = () => earlyRuntimePromise ??= startupTrace.measure("runtime.early", () => import("./server-startup-early-C1ROh8uI.mjs").then(({ startGatewayEarlyRuntime }) => startGatewayEarlyRuntime({
		scheduler: runtime.scheduler,
		getCronStorePath: () => runtimeState.cronState.storePath,
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
		getPluginMetadataSnapshot: () => runtime.pluginMetadataSnapshot,
		pluginRuntimeClaim: kernel.pluginRuntimeGeneration.currentClaim(),
		broadcast,
		maintenance: {
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
			nodeSendToSession: sendNodeSessionEvent
		},
		getRuntimeConfig: readRuntimeConfig,
		startupTrace
	}))).then((earlyRuntime) => {
		kernel.setEarlyRuntimeHandles(earlyRuntime);
		return earlyRuntime;
	});
	const [{ startGatewayEventSubscriptions }, { startGatewayChannelHealthMonitor }] = await startupTrace.measure("runtime.post-early-imports", () => Promise.all([import("./server-runtime-subscriptions-9gqVg886.mjs"), import("./server-runtime-startup-services-CMvSi82p.mjs")]));
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
	const { createOperatorApprovalSessionEventRuntime } = await import("./operator-approval-session-events-ByTHkxW5.mjs");
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
		const [{ createGatewayAuxHandlers }, { coreGatewayHandlers: coreGatewayHandlersLocal }] = await Promise.all([import("./server-aux-handlers-DoxuUpvb.mjs"), import("./server-methods-Ccl2iWnl.mjs")]);
		return {
			...createGatewayAuxHandlers({
				scheduler: runtime.scheduler,
				log,
				chatAbortControllers,
				hasRunAbortMarker: (runId) => chatRunState.hasAbortMarker(runId),
				getNativeApprovalRouteCoordinator: () => runtime.gatewayInstanceRuntimeRef.current?.nativeApprovals.routeCoordinator,
				resolveGrantDefaultExpiresAtMs: (nowMs) => {
					const days = resolveGrantExpiryDaysConfig(readRuntimeConfig());
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
	await approvalRuntime.ready;
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
			...nextPluginRegistry.gatewayMethodDescriptors,
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
	const getPluginNodeCapabilities = () => withCoreCanvasNodeCapability(listPluginNodeCapabilities(pluginRuntime.registry), isCoreCanvasHostEnabled(readRuntimeConfig()));
	const prepareAttachedPluginRuntime = async (loaded, trackActivationCleanup) => {
		const { activatePluginRegistry } = await import("./loader-shared-Cirl12e1.mjs");
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
				invalidateSharedReadResponses(broadcast);
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
		const { reloadGatewayPlugins } = await import("./server-plugin-reload-DirWjXzN.mjs");
		return reloadGatewayPlugins({
			runtime,
			port,
			log,
			loadGatewayPluginBootstrapModule: () => import("./server-plugin-bootstrap-BlOLeVNG.mjs"),
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
//#region src/plugins/compat/model-account-connect-deprecation.ts
function warnModelAccountConnectDeprecation(method) {
	const pluginId = pluginInstanceInvocation.getStore()?.instance.pluginId;
	warnSessionPersistenceDeprecation(`modelAccountConnectService.${method}`, `modelAccountConnectService.${method}Async`, {
		pluginId,
		family: "model-account-connect"
	});
}
//#endregion
//#region src/plugins/personal-account-auth.ts
/** Personal auth is opt-in; discovery never enables, installs, or imports host credentials. */
function listPersonalAccountAuthChoices(config) {
	const metadataSnapshot = resolvePluginMetadataSnapshot({ config });
	const choices = resolveManifestProviderAuthChoices({
		config,
		metadataSnapshot,
		includeUntrustedWorkspacePlugins: false
	}).filter((choice) => choice.personalAccount);
	const allowed = new Set(resolveDiscoverableProviderOwnerPluginIds({
		config,
		pluginIds: choices.map((choice) => choice.pluginId),
		registry: metadataSnapshot.index,
		manifestRegistry: metadataSnapshot.manifestRegistry,
		normalizePluginId: metadataSnapshot.normalizePluginId,
		includeUntrustedWorkspacePlugins: false
	}));
	return choices.filter((choice) => allowed.has(choice.pluginId));
}
async function resolvePersonalAccountAuthMethod(config, providerId, methodId) {
	const choice = listPersonalAccountAuthChoices(config).find((entry) => entry.providerId === providerId && entry.methodId === methodId);
	if (!choice) return;
	const { resolvePluginProvidersCore } = await import("./providers.runtime.js");
	return resolvePluginProvidersCore({
		config,
		onlyPluginIds: [choice.pluginId],
		mode: "setup",
		cache: true,
		activate: false,
		includeUntrustedWorkspacePlugins: false
	}).find((entry) => entry.pluginId === choice.pluginId && entry.id === providerId)?.auth.find((method) => method.id === methodId);
}
//#endregion
//#region src/gateway/model-account-connect.ts
const CONNECT_TTL_MS = 9e5;
const MAX_ACTIVE_CONNECTS = 8;
const MAX_RETAINED_CONNECTS = 64;
function matchesLiteralCredential(credential, existing) {
	if (credential.provider !== existing.provider) return false;
	return credential.type === "api_key" && existing.type === "api_key" ? credential.key === existing.key : credential.type === "token" && existing.type === "token" && credential.token === existing.token;
}
async function resolveOwnedAccountProvider(owner, authProfileId, context) {
	return requireOwnedAccountProvider(await readUserModelAccountSummaryAsync({
		profileId: owner,
		authProfileId
	}, { context }));
}
function requireOwnedAccountProvider(account) {
	if (!account) throw new ModelAccountConnectInputError("Select an account from your personal account list, or add it first.");
	return account.provider;
}
async function resolveLinkableAuthProfileProvider(cfg, owner, authProfileId, context) {
	if (isUserModelAuthProfileId(authProfileId)) return resolveOwnedAccountProvider(owner, authProfileId, context);
	return (await ensureAuthProfileStoreWithoutExternalProfilesAsync(resolveSharedMainAuthAgentDir(), { readOnly: true })).profiles[authProfileId]?.provider ?? cfg.auth?.profiles?.[authProfileId]?.provider;
}
function resolveSharedAuthProfileProvider(cfg, authProfileId) {
	return ensureAuthProfileStoreWithoutExternalProfiles(resolveSharedMainAuthAgentDir(), { readOnly: true }).profiles[authProfileId]?.provider ?? cfg.auth?.profiles?.[authProfileId]?.provider;
}
function requireLinkableProvider(provider, authProfileId) {
	if (!provider) throw new ModelAccountConnectInputError(`unknown auth profile "${authProfileId}"; sign the account in first with "openclaw models auth login --provider <id> --profile-id ${authProfileId}", then link it`);
	return provider;
}
/** One Gateway lifetime owns sign-in steps and authority; provider methods only stage credentials. */
function createModelAccountConnectService(options) {
	const operations = /* @__PURE__ */ new Map();
	let stopped = false;
	const pendingWrites = /* @__PURE__ */ new Set();
	let writeTail = Promise.resolve();
	const retainWrite = (write) => {
		const pending = runOutsideAsyncWorkScope(() => writeTail.then(write));
		writeTail = pending.catch(() => {});
		pendingWrites.add(pending);
		pending.finally(() => pendingWrites.delete(pending)).catch(() => {});
		return pending;
	};
	const finish = (operation, result) => {
		if (operation.terminal && result.status !== "connected") return operation.terminal;
		operation.terminal = result;
		clearTimeout(operation.timeout);
		operation.session?.cancel();
		return result;
	};
	const snapshot = (operation, roles) => {
		if (operation.terminal) return operation.terminal;
		if (operation.expiresAtMs <= Date.now()) return finish(operation, { status: "expired" });
		try {
			operation.action.assertCurrent(roles);
			operation.answerAction?.assertCurrent(roles);
		} catch {
			return finish(operation, {
				status: "failed",
				reason: "authority"
			});
		}
	};
	const assertRunning = (action) => {
		if (stopped) throw new ModelAccountConnectAuthorityError();
		action.assertCurrent();
	};
	const assertLive = (operation, roles) => {
		if (stopped && !operation.settlement || operations.get(operation.id) !== operation || snapshot(operation, roles)) throw new ModelAccountConnectAuthorityError();
	};
	const resultSnapshot = (operation) => {
		const result = snapshot(operation);
		if (!result) {
			const step = operation.session?.getCurrentStep();
			return {
				status: "pending",
				...step ? { step: sanitizeWizardStepForClient(step) } : {}
			};
		}
		return result;
	};
	const projectResult = (action, operation) => {
		const result = resultSnapshot(operation);
		if (result.status !== "connected") return result;
		assertRunning(action);
		return {
			...result,
			links: listUserProfileAuthLinks(operation.owner)
		};
	};
	const projectResultAsync = async (action, operation) => {
		const result = resultSnapshot(operation);
		if (result.status !== "connected") return result;
		assertRunning(action);
		const links = await listUserProfileAuthLinksAsync(operation.owner);
		assertRunning(action);
		return {
			...result,
			links
		};
	};
	const findOperation = (action, connectId) => {
		assertRunning(action);
		const operation = operations.get(connectId);
		return operation?.owner === action.owner ? operation : void 0;
	};
	const supersede = (owner, provider, previous = operations.values()) => {
		for (const operation of previous) if (operation.owner === owner && operation.provider === provider) finish(operation, { status: "cancelled" });
	};
	const changeLink = async (action, operation, target) => {
		assertRunning(action);
		const context = captureOpenClawStateWorkerContext();
		const previous = [...operations.values()];
		return retainWrite(async () => {
			const provider = operation === "unlink" ? target : operation === "select" ? await resolveOwnedAccountProvider(action.owner, target, context) : requireLinkableProvider(await resolveLinkableAuthProfileProvider(options.getConfig(), action.owner, target, context), target);
			if (operation !== "unlink") action.assertCurrent();
			const input = {
				profileId: action.owner,
				provider,
				authorityProfileIds: action.actorProfileId ? [action.actorProfileId] : [],
				assertCurrent: action.assertCurrent
			};
			const links = operation !== "unlink" ? await setUserProfileAuthLinkAsync({
				...input,
				authProfileId: target
			}, { context }) : await clearUserProfileAuthLinkAsync(input, { context });
			supersede(action.owner, provider, previous);
			options.onChanged?.();
			action.assertCurrent();
			return { links };
		});
	};
	const setLinkNative = (action, provider, authProfileId) => {
		const links = setUserProfileAuthLink({
			profileId: action.owner,
			provider,
			authProfileId,
			assertCurrent: () => assertRunning(action)
		});
		supersede(action.owner, provider);
		options.onChanged?.();
		return { links };
	};
	const cancelOperation = (action, connectId) => {
		const operation = findOperation(action, connectId);
		if (operation) {
			snapshot(operation);
			finish(operation, { status: "cancelled" });
		}
		return operation;
	};
	const beginClose = () => {
		stopped = true;
		for (const operation of operations.values()) if (operation.settlement) operation.session?.cancel();
		else finish(operation, { status: "cancelled" });
	};
	return {
		/** @deprecated Await listLinksAsync; final compatibility day: 2026-12-31; removal in the first January 2027 stable release. */
		listLinks(action) {
			warnModelAccountConnectDeprecation("listLinks");
			assertRunning(action);
			return { links: listUserProfileAuthLinks(action.owner) };
		},
		/** @deprecated Await linkAsync; final compatibility day: 2026-12-31; removal in the first January 2027 stable release. */
		link(action, authProfileId) {
			warnModelAccountConnectDeprecation("link");
			assertRunning(action);
			const provider = isUserModelAuthProfileId(authProfileId) ? requireOwnedAccountProvider(readUserModelAccountSummary({
				profileId: action.owner,
				authProfileId
			})) : resolveSharedAuthProfileProvider(options.getConfig(), authProfileId);
			return setLinkNative(action, requireLinkableProvider(provider, authProfileId), authProfileId);
		},
		/** @deprecated Await unlinkAsync; final compatibility day: 2026-12-31; removal in the first January 2027 stable release. */
		unlink(action, provider) {
			warnModelAccountConnectDeprecation("unlink");
			assertRunning(action);
			const links = clearUserProfileAuthLink({
				profileId: action.owner,
				provider,
				assertCurrent: () => assertRunning(action)
			});
			supersede(action.owner, provider);
			options.onChanged?.();
			return { links };
		},
		/** @deprecated Await listAsync; final compatibility day: 2026-12-31; removal in the first January 2027 stable release. */
		list(action, cursor) {
			warnModelAccountConnectDeprecation("list");
			assertRunning(action);
			return {
				profileId: action.owner,
				...listUserModelAccounts({
					profileId: action.owner,
					cursor
				}),
				links: listUserProfileAuthLinks(action.owner)
			};
		},
		/** @deprecated Await selectAsync; final compatibility day: 2026-12-31; removal in the first January 2027 stable release. */
		select(action, authProfileId) {
			warnModelAccountConnectDeprecation("select");
			assertRunning(action);
			return setLinkNative(action, requireOwnedAccountProvider(readUserModelAccountSummary({
				profileId: action.owner,
				authProfileId
			})), authProfileId);
		},
		/** @deprecated Await statusAsync; final compatibility day: 2026-12-31; removal in the first January 2027 stable release. */
		status(action, connectId) {
			warnModelAccountConnectDeprecation("status");
			const operation = findOperation(action, connectId);
			return operation ? projectResult(action, operation) : { status: "expired" };
		},
		/** @deprecated Await cancelAsync; final compatibility day: 2026-12-31; removal in the first January 2027 stable release. */
		cancel(action, connectId) {
			warnModelAccountConnectDeprecation("cancel");
			const operation = cancelOperation(action, connectId);
			return operation ? projectResult(action, operation) : { status: "expired" };
		},
		async listLinksAsync(action) {
			assertRunning(action);
			const links = await listUserProfileAuthLinksAsync(action.owner);
			assertRunning(action);
			return { links };
		},
		async linkAsync(action, authProfileId) {
			return changeLink(action, "link", authProfileId);
		},
		unlinkAsync(action, provider) {
			return changeLink(action, "unlink", provider);
		},
		async listAsync(action, cursor) {
			assertRunning(action);
			const context = captureOpenClawStateWorkerContext();
			const linksCurrent = captureUserProfileModelAccountLinksAuthority(context.admission, action.owner);
			const accounts = await listUserModelAccountsAsync({
				profileId: action.owner,
				cursor
			}, { context });
			const links = await listUserProfileAuthLinksAsync(action.owner, { context });
			assertRunning(action);
			if (!linksCurrent()) throw new Error("Personal account selection changed while listing accounts; retry the request.");
			return {
				profileId: action.owner,
				...accounts,
				links
			};
		},
		catalog(action) {
			assertRunning(action);
			const providers = /* @__PURE__ */ new Map();
			for (const choice of listPersonalAccountAuthChoices(options.getConfig())) {
				let provider = providers.get(choice.providerId);
				if (!provider) {
					provider = {
						id: choice.providerId,
						label: choice.groupLabel ?? choice.providerId,
						methods: []
					};
					providers.set(choice.providerId, provider);
				}
				if (!provider.methods.some((method) => method.id === choice.methodId)) provider.methods.push({
					id: choice.methodId,
					label: choice.choiceLabel,
					...choice.choiceHint ? { hint: choice.choiceHint } : {}
				});
			}
			assertRunning(action);
			return { providers: [...providers.values()] };
		},
		async selectAsync(action, authProfileId) {
			return changeLink(action, "select", authProfileId);
		},
		async start(action, provider, methodId) {
			assertRunning(action);
			const context = captureOpenClawStateWorkerContext();
			for (const operation of operations.values()) snapshot(operation);
			supersede(action.owner, provider);
			if ([...operations.values()].filter((operation) => !operation.terminal).length >= MAX_ACTIVE_CONNECTS) throw new Error("Too many model-account sign-ins are in progress; try again shortly.");
			for (const [id, operation] of operations) {
				if (operations.size < MAX_RETAINED_CONNECTS) break;
				if (operation.terminal) operations.delete(id);
			}
			const id = randomUUID();
			const operation = {
				id,
				owner: action.owner,
				provider,
				action,
				expiresAtMs: Date.now() + CONNECT_TTL_MS,
				timeout: setTimeout(() => finish(operation, { status: "expired" }), CONNECT_TTL_MS)
			};
			operation.timeout.unref();
			operations.set(id, operation);
			let resolvedMethod;
			try {
				resolvedMethod = await resolvePersonalAccountAuthMethod(options.getConfig(), provider, methodId);
				assertLive(operation);
				if (!resolvedMethod) throw new ModelAccountConnectInputError("This sign-in method is unavailable for personal accounts. Choose a method from Connected accounts.");
			} catch (error) {
				snapshot(operation);
				finish(operation, {
					status: "failed",
					reason: "unavailable"
				});
				throw error;
			}
			const method = resolvedMethod;
			operation.session = new WizardSession(async (prompter, signal) => {
				await Promise.resolve();
				let failure = "exchange";
				try {
					assertLive(operation);
					const selected = await readSelectedUserModelAccountAsync(operation.owner, provider, { context });
					assertLive(operation);
					const result = await runProviderPluginAuthMethodUnpersisted({
						config: {},
						env: {},
						existingProfiles: selected ? [{
							profileId: selected.id,
							credential: selected.credential
						}] : [],
						method,
						prompter,
						signal,
						assertCurrent: () => assertLive(operation),
						isRemote: true,
						secretInputMode: "plaintext",
						allowSecretRefPrompt: false,
						runtime: {
							log: () => {},
							error: () => {},
							exit: () => {
								throw new Error("Provider sign-in stopped.");
							}
						}
					});
					assertLive(operation);
					const profile = result.profiles[0];
					if (result.profiles.length !== 1 || !profile || profile.credential.provider !== provider || profile.secretStorage) {
						finish(operation, {
							status: "failed",
							reason: "identity"
						});
						return;
					}
					failure = "unavailable";
					operation.settlement = retainWrite(async () => {
						const connected = await connectUserModelAccountAsync({
							ownerProfileId: operation.owner,
							credential: profile.credential,
							matchesCredential: (existing) => (method.matchesPersonalAccount ?? matchesLiteralCredential)(profile.credential, existing),
							authorityProfileIds: [...new Set([operation.action, operation.answerAction].flatMap((current) => current?.actorProfileId ? [current.actorProfileId] : []))],
							assertCurrent: (roles) => assertLive(operation, roles)
						}, { context });
						finish(operation, {
							status: "connected",
							authProfileId: connected.authProfileId
						});
						options.onChanged?.();
					});
					await operation.settlement;
				} catch {
					snapshot(operation);
					finish(operation, {
						status: "failed",
						reason: failure
					});
				}
			});
			return {
				connectId: id,
				expiresAtMs: operation.expiresAtMs
			};
		},
		async statusAsync(action, connectId) {
			const operation = findOperation(action, connectId);
			return operation ? projectResultAsync(action, operation) : { status: "expired" };
		},
		async answer(action, connectId, stepId, value) {
			const operation = findOperation(action, connectId);
			if (!operation) return { status: "expired" };
			if (snapshot(operation)) return projectResultAsync(action, operation);
			const step = operation.session?.getCurrentStep();
			if (!operation.session || step?.id !== stepId || step.type === "progress") {
				const result = await projectResultAsync(action, operation);
				return result.status === "pending" ? {
					...result,
					error: "This step has changed. Follow the current sign-in instructions."
				} : result;
			}
			if (step.sensitive && typeof value === "string") registerSecretValueForRedaction(value);
			operation.answerAction = action;
			const error = await operation.session.answer(stepId, value);
			assertRunning(action);
			const result = await projectResultAsync(action, operation);
			if (error && result.status === "pending" && result.step?.id === stepId) return {
				...result,
				error: "That answer is not valid. Check the sign-in instructions and try again."
			};
			return result;
		},
		async cancelAsync(action, connectId) {
			const operation = cancelOperation(action, connectId);
			return operation ? projectResultAsync(action, operation) : { status: "expired" };
		},
		supersede: (owner, provider) => supersede(owner, provider),
		async stop() {
			beginClose();
			await Promise.allSettled(pendingWrites);
			operations.clear();
		}
	};
}
//#endregion
//#region src/gateway/session-incognito-lifetime.ts
const CLEANUP_RETRY_MS = 6e4;
/** Deadlines come from committed actor state; deletion owns transport and session cleanup. */
function startIncognitoActorSessionLifetime(params) {
	const { owner } = params;
	const scheduler = params.scheduler.scope();
	const authority = {
		assertCurrent() {},
		authorize() {}
	};
	const deadlines = /* @__PURE__ */ new Map();
	let active = true;
	const forget = (sessionKey) => {
		deadlines.get(sessionKey)?.job?.cancel();
		deadlines.delete(sessionKey);
	};
	const schedule = (deadline, delayMs) => {
		const retained = { ...deadline };
		deadlines.set(deadline.sessionKey, retained);
		retained.job = scheduler.schedule({
			id: `incognito-expiry:${deadline.sessionKey}`,
			...delayMs === void 0 ? { atMs: deadline.expiresAt } : { delayMs },
			run: async () => {
				let actor;
				try {
					actor = await owner.acquireExisting(deadline.sessionKey, {
						assertCurrent() {},
						assertReadable() {}
					});
					if (!actor) {
						if (deadlines.get(deadline.sessionKey) === retained) forget(deadline.sessionKey);
						return;
					}
					const binding = {
						actor,
						authority,
						agentId: owner.agentId,
						path: owner.path
					};
					await runWithSessionActorStorage(binding, () => params.deleteSession(deadline, binding));
					if (deadlines.get(deadline.sessionKey) === retained) forget(deadline.sessionKey);
				} catch {
					let entry;
					try {
						entry = owner.readSession(deadline.sessionKey, authority)?.entry;
					} catch {}
					if (deadlines.get(deadline.sessionKey) !== retained) return;
					if (active && entry?.sessionId === deadline.sessionId) {
						params.logWarning("Incognito session expiry could not finish cleanup; will retry.");
						schedule(deadline, CLEANUP_RETRY_MS);
					} else forget(deadline.sessionKey);
				} finally {
					await actor?.release();
				}
			}
		});
	};
	const observeSession = (sessionKey, entry) => {
		const expiresAt = entry && resolveIncognitoSessionExpiresAt(entry);
		if (!entry || expiresAt === void 0) {
			forget(sessionKey);
			return;
		}
		if (deadlines.get(sessionKey)?.sessionId === entry.sessionId) return;
		forget(sessionKey);
		schedule({
			sessionKey,
			sessionId: entry.sessionId,
			agentId: owner.agentId,
			expiresAt
		});
	};
	const observe = (change) => {
		if (!active) return;
		if (change && "sessionKey" in change) {
			if (change.agentId === owner.agentId && change.storePath === owner.path) observeSession(change.sessionKey, owner.readSession(change.sessionKey, authority)?.entry);
			return;
		}
		const current = owner.listSessions(authority);
		const keys = new Set(current.map((state) => state.target.sessionKey));
		for (const key of deadlines.keys()) if (!keys.has(key)) forget(key);
		for (const state of current) observeSession(state.target.sessionKey, state.entry);
	};
	const runInOwner = AsyncLocalStorage.snapshot();
	const unsubscribe = sessionChanges.subscribeProjection((change) => runInOwner(() => observe(change)));
	observe();
	return { async stop() {
		active = false;
		unsubscribe();
		scheduler.beginClose();
		await scheduler.stop();
		deadlines.clear();
	} };
}
/** Follow existing memory owners without creating sessions or retaining database workers. */
function startIncognitoSessionLifetime(params) {
	const env = {
		...params.env ?? process.env,
		OPENCLAW_STATE_DIR: resolveStateDir(params.env ?? process.env)
	};
	const retained = /* @__PURE__ */ new Map();
	const stopping = /* @__PURE__ */ new Set();
	const retire = (owner, sidecar) => {
		retained.delete(owner);
		const stopped = Promise.resolve(sidecar.stop()).catch(() => {
			params.logWarning("Incognito expiry could not finish stopping its memory owner.");
		});
		stopping.add(stopped);
		stopped.finally(() => stopping.delete(stopped));
	};
	const observe = () => {
		const owners = memorySessionActorOwners.list().filter((owner) => owner.path === resolveIncognitoOpenClawAgentSqlitePath({
			agentId: owner.agentId,
			env
		}));
		for (const [owner, sidecar] of retained) if (!owners.includes(owner)) retire(owner, sidecar);
		for (const owner of owners) {
			if (retained.has(owner)) continue;
			retained.set(owner, startIncognitoActorSessionLifetime({
				...params,
				owner,
				async deleteSession(deadline) {
					const { deleteGatewaySession } = await import("./sessions-delete-2L3bUMPM.mjs");
					const result = await deleteGatewaySession({
						params: {
							key: deadline.sessionKey,
							agentId: deadline.agentId,
							expectedSessionId: deadline.sessionId
						},
						client: null,
						context: params.context
					});
					if (!result.ok) throw new Error(result.error.message);
				}
			}));
		}
	};
	const runInOwner = AsyncLocalStorage.snapshot();
	const unsubscribe = sessionChanges.subscribeProjection(() => runInOwner(observe));
	observe();
	return { async stop() {
		unsubscribe();
		for (const [owner, sidecar] of retained) retire(owner, sidecar);
		await Promise.all(stopping);
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
	if (!params.minimalTestGateway) {
		const { startSessionCostUsageProjectionLifetime } = await import("./session-cost-usage-lifetime-ChI-urSh.mjs");
		params.publishSidecars(startSessionCostUsageProjectionLifetime({
			getConfig: params.gatewayRequestContext.getRuntimeConfig,
			warn: params.logWarning
		}));
	}
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
		getPersistedConfig: () => createConfigIO().loadConfigAsync(),
		warn: params.logWarning
	});
	params.gatewayRequestContext.githubOAuthService = githubOAuth;
	const uninstallGitHubOAuth = installActiveGitHubOAuthLifecycle(githubOAuth);
	if (!params.minimalTestGateway) {
		params.publishSidecars(startGitHubPublicationDiscovery({
			scheduler: params.scheduler,
			projection: getSessionRowProjection(params.gatewayRequestContext)
		}));
		githubOAuth.start();
	}
	params.publishSidecars({ stop: async () => {
		uninstallGitHubOAuth();
		await githubOAuth.stop();
		if (params.gatewayRequestContext.githubOAuthService === githubOAuth) delete params.gatewayRequestContext.githubOAuthService;
	} });
	if (!params.minimalTestGateway) {
		const expiryScheduler = params.scheduler.scope();
		let warned = false;
		let running = false;
		const scheduleExpiry = (atMs) => {
			if (!expiryScheduler.signal.aborted) expiryScheduler.schedule({
				id: "maintenance:secret-expiry",
				atMs,
				mode: "earliest",
				run: sweep
			});
		};
		const sweep = async () => {
			if (running) return;
			running = true;
			try {
				await purgeExpiredSecretStoreEntries();
				warned = false;
				const next = getSecretStoreExpiryDeadline();
				if (next !== null) scheduleExpiry(next ?? expiryScheduler.now());
			} catch {
				if (!warned) {
					params.logWarning("Secret store expiry cleanup failed; will retry.");
					warned = true;
				}
				scheduleExpiry(expiryScheduler.now() + 6e4);
			} finally {
				running = false;
			}
		};
		const unsubscribe = subscribeSecretStoreChanges(() => scheduleExpiry(expiryScheduler.now()));
		const unsubscribeLifecycle = registerOpenClawStateDatabaseLifecycleListener((event) => {
			if (event.kind !== "opened") scheduleExpiry(expiryScheduler.now());
		});
		expiryScheduler.signal.addEventListener("abort", () => {
			unsubscribe();
			unsubscribeLifecycle();
		}, { once: true });
		params.publishSidecars(expiryScheduler);
		scheduleExpiry(expiryScheduler.now());
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
/** Prepares request bindings and the one-shot initializer shared by startup and transports. */
async function prepareGatewayKernelRequestRuntime(params) {
	const { coreRuntime: runtime, log, logHealth } = params;
	const { minimalTestGateway, runtimeState, bindApprovalPublicationContext, startupTrace, workerPlacementRuntime, githubPublicationRuntime, pluginGatewayContext, getAttachedGatewayMethodRegistry, gatewayInstanceRuntimeRef, startupState, shutdownRuntime } = runtime;
	const [chatMetadataLifecycle, configRevisionProjector] = await Promise.all([startupTrace.measure("gateway.chat-metadata-lifecycle", () => createGatewayChatMetadataLifecycle({
		getConfig: readRuntimeConfig,
		log
	})), startupTrace.measure("gateway.config-revision-key", async () => {
		const { loadGatewayConfigRevisionProjector } = await import("./config-revision-token-DnPXDYXs.mjs");
		return loadGatewayConfigRevisionProjector({ env: process.env });
	})]);
	const gatewayRequestContext = await startupTrace.measure("gateway.request-context", async () => {
		const { createGatewayRequestContext } = await import("./server-request-context-DahsPh4a.mjs");
		return createGatewayRequestContext({
			runtime,
			configRevisionProjector,
			chatMetadataLifecycle,
			log,
			logHealth
		});
	});
	const projectionReady = runtime.opts.updateCanary ? void 0 : startupTrace.measure("sessions.projection", async () => {
		const { createSessionRowProjection } = await import("./session-row-projection-DgaaSSk_.mjs");
		return createSessionRowProjection({
			cfg: readRuntimeConfig(),
			getConfig: readRuntimeConfig,
			getPolicyConfig: gatewayRequestContext.getCommittedRuntimeConfig ?? readRuntimeConfig,
			getModelCatalog: () => readPreparedServerMethodModelCatalogs(gatewayRequestContext, listAgentIds(readRuntimeConfig())),
			context: gatewayRequestContext,
			placementFactsReader: runtime.workerEnvironmentStartup?.placementStore
		});
	});
	projectionReady?.catch(() => {});
	let requestRuntimeReady;
	const projectionLifetime = { closing: false };
	runtime.registerGatewayLifetimeSidecars({ stop: async () => {
		projectionLifetime.closing = true;
		retireQuestionChannelGateway(runtime.connectionWork.signal);
		closeGatewayDeviceRevocation(gatewayRequestContext);
		await gatewayRequestContext.scopeUpgradeCoordinator?.close();
		const projection = await projectionReady?.catch(() => void 0);
		await shutdownRuntime.flushPendingSessionsChangedEvents(gatewayRequestContext);
		if (projection) await shutdownRuntime.drainSessionEventPublications(projection);
		projectionLifetime.detach?.();
		projection?.dispose();
	} });
	const initializeRequestRuntime = AsyncLocalStorage.bind(async () => {
		const projection = await projectionReady;
		if (projectionLifetime.closing) throw new Error("Gateway closed during session projection startup");
		if (projection) {
			projectionLifetime.detach = runtime.attachSessionRowProjection(projection);
			if (shouldUseGatewayOwnerProfile({
				role: "operator",
				authMethod: runtime.getResolvedAuth().mode,
				rolesConfigured: Boolean(readRuntimeConfig().gateway?.roles)
			})) try {
				await startupTrace.measure("gateway.owner-profile", async () => {
					const [{ ensureCanonicalGatewayOwnerProfile }, { resolveHostAccountName }] = await Promise.all([import("./user-profile-writes-BZ_BS-Lq.mjs"), import("./host-account-name-C-_43MLQ.mjs")]);
					await ensureCanonicalGatewayOwnerProfile(resolveHostAccountName);
				});
			} catch (error) {
				log.warn(`Gateway owner profile preparation failed: ${formatErrorMessage$1(error)}`);
			}
			await startupTrace.measure("sessions.materialize", () => projection.ensureMaterialized());
			if (projectionLifetime.closing) throw new Error("Gateway closed during session projection startup");
		}
		if (!runtime.opts.updateCanary) await startupTrace.measure("gateway.lifetime-sidecars", () => attachInitialGatewayLifetimeSidecars({
			scheduler: runtime.scheduler,
			chatMetadataLifecycle,
			gatewayRequestContext,
			flushPendingSessionsChangedEvents: shutdownRuntime.flushPendingSessionsChangedEvents,
			minimalTestGateway,
			logWarning: (message) => log.warn(message),
			...!workerPlacementRuntime && githubPublicationRuntime ? { reconcileGitHubPublications: githubPublicationRuntime.reconcilePublications } : {},
			publishSidecars: runtimeState.gatewayLifetimeSidecars.publish
		}));
	});
	const ensureRequestRuntimeReady = () => requestRuntimeReady ??= initializeRequestRuntime();
	gatewayRequestContext.requestEntryLifetime = runtime.requestEntryLifetime;
	bindApprovalPublicationContext(gatewayRequestContext);
	pluginGatewayContext.current = gatewayRequestContext;
	gatewayRequestContext.dispatchHookAgentTurn = async (pluginId, hookParams) => {
		const transport = runtime.transportBridge.current();
		if (!transport) throw new Error("Gateway listener must start before plugin hook dispatch");
		return await transport.dispatchHookAgentTurn(pluginId, hookParams);
	};
	const { createGatewayInstanceRuntime } = await startupTrace.measure("gateway.instance-runtime-import", () => import("./server-instance-runtime-DYouxu0V.mjs"));
	const gatewayInstanceRuntime = createGatewayInstanceRuntime({
		getContext: () => gatewayRequestContext,
		getMethodRegistry: () => getAttachedGatewayMethodRegistry(),
		isDispatchAvailable: () => startupState.dispatchReady,
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
			if (runtime.requestEntryLifetime.signal.aborted || !gatewayInstanceRuntime.isAvailable()) throw new Error("Gateway lifecycle is unavailable for this closed instance. Reconnect and retry.");
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
		gatewayInstanceRuntime,
		ensureRequestRuntimeReady
	};
}
//#endregion
//#region src/gateway/server-cron-lazy.ts
/** Creates a cron state proxy that imports the real cron service on first use. */
function createLazyGatewayCronState(params) {
	const spawnBroker = getSpawnBroker();
	const runWithReadOnlyWorkers = captureSqliteReadOnlyWorkerScope();
	const env = params.env ?? process.env;
	const storePath = params.storePath;
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
	const cronStateLoader = createLazyPromiseLoader(() => import("./server-cron-By9y0bDg.mjs").then(({ buildGatewayCronService }) => {
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
	const bindStartedCron = createLazyRuntimeMethodBinder(async () => {
		const resolved = await load();
		if (!stopped) await cron.start();
		return resolved;
	});
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
		run: bindStartedCron(({ state }) => state.cron.run.bind(state.cron)),
		enqueueRun: bindStartedCron(({ state }) => state.cron.enqueueRun.bind(state.cron)),
		waitForManualRun: bindCron(({ state }) => state.cron.waitForManualRun.bind(state.cron)),
		readEventSources: bindCron(({ state }) => state.cron.readEventSources.bind(state.cron)),
		runEvent: bindCron(({ state }) => state.cron.runEvent.bind(state.cron)),
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
		async wake(opts) {
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
//#region src/gateway/server-diagnostics.ts
/** The Gateway lifetime owns diagnostics configuration and its heartbeat job. */
function createGatewayDiagnosticsConfigurator(params) {
	stopGatewayDiagnosticHeartbeat();
	return (config) => {
		if (params.isClosing()) return;
		const enabled = isDiagnosticsEnabled(config);
		setDiagnosticsEnabledForProcess(enabled);
		notifyGatewayWorkMetricsChanged();
		if (!enabled) {
			stopGatewayDiagnosticHeartbeat();
			return;
		}
		startGatewayDiagnosticHeartbeat(params.scheduler, void 0, {
			getConfig: readRuntimeConfig,
			startupGraceMs: 6e4,
			testTimings: resolveQaDiagnosticHeartbeatTimings(process.env),
			sampleLiveness: () => {
				const sample = params.sampleLiveness();
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
		sealAndJoin,
		async stopAndJoin() {
			try {
				await stop();
			} finally {
				await sealAndJoin();
			}
		}
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
			if (released || this.sealed || this.signal.aborted && !isPendingNodeCompletion(options)) throw new GatewayClientRequestError({
				code: ErrorCodes.UNAVAILABLE,
				message: "Gateway request entry is closed",
				retryable: true
			});
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
/** Owns one replace-set per websocket connection until empty declaration or disconnect. */
function createSessionViewerPresenceDeclarations(deps) {
	const declarations = /* @__PURE__ */ new Map();
	let stopped = false;
	const replace = (connId, sessionKeys) => {
		if (stopped) return [];
		const normalizedConnId = connId.trim();
		const client = deps.clients.getByConnectionId(normalizedConnId);
		if (!client || client.invalidated || client.socket.readyState !== 1) return [];
		const next = [...new Set(sessionKeys.map((key) => key.trim()).filter(Boolean))].toSorted();
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
	/** True only while an open connection of this paired device currently renders the session. */
	const isViewedOnDevice = (deviceId, sessionKey) => {
		for (const [connId, sessionKeys] of declarations) {
			if (!sessionKeys.includes(sessionKey)) continue;
			const client = deps.clients.getByConnectionId(connId);
			if (client && !client.invalidated && !client.connectionSignal?.aborted && client.socket.readyState === 1 && normalizeOptionalString(client.connect.device?.id) === deviceId) return true;
		}
		return false;
	};
	const stop = () => {
		stopped = true;
		declarations.clear();
	};
	return {
		replace,
		unsubscribe,
		isViewedOnDevice,
		stop
	};
}
//#endregion
//#region src/gateway/terminal/open-admission.ts
/** Gateway lifecycle custody includes pending spawns until their backend settles. */
async function withAgentTerminalOpenAdmission(request, run) {
	const interrupted = new AbortController();
	const signal = request.signal ? AbortSignal.any([request.signal, interrupted.signal]) : interrupted.signal;
	let admission;
	try {
		admission = await beginSessionWorkAdmission({
			agentId: request.agentId,
			scope: `agent:${request.agentId}`,
			identities: request.owner.kind === "agent" ? [request.owner.agentSessionKey, request.owner.agentSessionId] : [request.owner.connId],
			signal,
			assertAllowed: () => signal.throwIfAborted(),
			onInterrupt: (reason) => interrupted.abort(reason)
		});
	} catch (error) {
		return {
			ok: false,
			code: "closed",
			message: error instanceof Error ? error.message : String(error)
		};
	}
	try {
		return await admission.run(() => run({
			...request,
			signal
		}));
	} finally {
		admission.release();
	}
}
//#endregion
//#region src/gateway/server-lifecycle.ts
async function prepareGatewayLifecycle(params) {
	const { runtime, port, log, logCron, shutdownRuntime } = params;
	const requestEntryLifetime = new GatewayRequestEntryLifetime();
	const worktreeRunEnd = prepareWorktreeRunEndClose();
	const sandboxRegistry = prepareSandboxRegistryClose();
	const talkClose = prepareTalkConnectionClose(runtime.clients, log);
	const { minimalTestGateway, transportBridge, sessionMessageSubscribers, isConnectionActive, clients, mentionInbox, broadcast, cfgAtStart, cronStorePath, pluginRuntime, authRateLimiter, nodeReapprovalCoordinator, channelManager, deps, initialHooksConfig, initialHookClientIpConfig, runtimeStateRef, gatewayInstanceRuntimeRef, startupState, readinessEventLoopHealth, browserAuthRateLimiter, chatRunState, chatAbortControllers, chatQueuedTurns, removeChatRun, agentRunSeq, listActiveGatewayMethods, broadcastToConnIds, getBufferedAmount, sessionEventSubscribers, watchNodeRequestHandler, defaultWorkspaceDir, desktopSessionRegistry, nodeDesktopStreamBroker, bindDeviceNodeControl, bindWorkerNodeDesktopControl, workerPlacementRuntime, lifecycle } = runtime;
	const restartRecoveryCandidates = /* @__PURE__ */ new Map();
	const nodeDesktopServiceRef = {};
	const { createGatewayNodeSessionRuntime } = await import("./server-node-session-runtime-BAYGjy_L.mjs");
	const { nodeWorkerSupervisorTransport, ...nodeRuntime } = createGatewayNodeSessionRuntime({
		broadcast,
		sessionEventSubscribers,
		sessionMessageSubscribers,
		listRegisteredNodePluginToolCommands: () => pluginRuntime.registry.nodeHostCommands,
		getConfig: readRuntimeConfig,
		onRunnerStateChanged: (nodeId, change) => {
			if (change.availabilityChanged) {
				workerPlacementRuntime?.runnerAvailability.markChanged(nodeId);
				workerPlacementRuntime?.scheduleNodeWorkspaceRetention(nodeId);
			}
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
	const nodeDesktopService = (await import("./node-source-BnH08DGO.mjs")).createNodeDesktopService({
		getConfig: readRuntimeConfig,
		nodeRegistry,
		desktopRegistry: desktopSessionRegistry,
		streamBroker: nodeDesktopStreamBroker
	});
	nodeDesktopServiceRef.current = nodeDesktopService;
	workerPlacementRuntime?.bindNodeWorkerAvailability((nodeId, options) => waitForNodeWorkerSupervisor(nodeRegistry, nodeId, options));
	bindDeviceNodeControl?.(nodeWorkerSupervisorTransport);
	bindWorkerNodeDesktopControl?.(nodeWorkerSupervisorTransport);
	const { createWatchNodeHttpRuntime } = await import("./watch-node-http-DoRn6y4L.mjs");
	const watchNodeHttpRuntime = createWatchNodeHttpRuntime({
		nodeRegistry,
		getConfig: readRuntimeConfig,
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
	const { TerminalSessionManager, DEFAULT_TERMINAL_DETACH_SECONDS } = await import("./session-manager-C3BadwcA.mjs");
	const { createTerminalSessionTransport } = await import("./gateway-transport-BFWZ9htS.mjs");
	const terminalSessions = new TerminalSessionManager({
		withOpenAdmission: withAgentTerminalOpenAdmission,
		...createTerminalSessionTransport(broadcastToConnIds, getBufferedAmount),
		detachGraceMs: (cfgAtStart.gateway?.terminal?.detachedSessionTimeoutSeconds ?? DEFAULT_TERMINAL_DETACH_SECONDS) * 1e3
	});
	applyGatewayLaneConcurrency(resolveGatewayLaneConcurrency(cfgAtStart), { gatewayStart: true });
	runtimeStateRef.current = createGatewayServerLiveState({
		hooksConfig: initialHooksConfig,
		hookClientIpConfig: initialHookClientIpConfig,
		cronState: createLazyGatewayCronState({
			scheduler: runtime.scheduler,
			storePath: cronStorePath,
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
			publishHooksTokenEnvKey(next.hooksConfig);
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
				getRuntimeConfig: readRuntimeConfig,
				getSessionRowProjection: runtime.getSessionRowProjection,
				isCurrentClient: () => clients.getByConnectionId(connId) === client
			}) : void 0;
		}
	});
	runtimeState.sessionViewerPresence = createSessionViewerPresenceDeclarations({
		clients,
		publishPresence: runtime.publishPresence
	});
	runtime.attachSessionViewerPresence(runtimeState.sessionViewerPresence);
	deps.cron = runtimeState.cronState.cron;
	const cronReconciliation = createGatewayCronReconciliation({
		port,
		workspaceDir: defaultWorkspaceDir,
		isClosing: () => lifecycle.closePreludeStarted,
		runHook: async (event, ctx) => {
			try {
				const hookRunner = (await import("./hooks-eJl0RQi-.mjs")).createHookRunner(pluginRuntime.registry);
				if (hookRunner.hasHooks("cron_reconciled")) await hookRunner.runCronReconciled(event, ctx);
			} catch (err) {
				logCron.error(`cron_reconciled hook failed: ${String(err)}`);
			}
		}
	});
	let mediaCleanupStopPromise = null;
	const stopMediaCleanupForClose = () => mediaCleanupStopPromise ??= runtimeState.stopMediaCleanup();
	let modelAccountStopPromise;
	const stopModelAccountsForClose = () => modelAccountStopPromise ??= runtime.resolvePluginGatewayContext()?.modelAccountConnectService?.stop();
	const healthWork = new AsyncWorkScope();
	const markClosePreludeStarted = (options) => {
		fenceSessionSuspensionWritesForGatewayShutdown();
		if (lifecycle.closePreludeStarted) return params.pluginMetadata.beginClose();
		const prelude = params.pluginMetadata.beginClose();
		const notice = resolveGatewayShutdownNotice(options);
		lifecycle.closePreludeStarted = true;
		markGatewaySuspendExiting();
		authRateLimiter.dispose();
		browserAuthRateLimiter.dispose();
		worktreeRunEnd.beginClose();
		sandboxRegistry.beginClose();
		talkClose.beginClose();
		stopModelAccountsForClose();
		closeAuthProfileUsage(params.sdkResourceHost);
		runtime.scheduler.beginClose();
		runtimeState.maintenance?.stopPeriodicTasks();
		requestEntryLifetime.beginClose();
		mentionInbox.dispose();
		healthWork.beginClose();
		broadcast("shutdown", notice);
		connectionDependentSidecarStopOwner.beginClose();
		runtimeState.stopDeliveryRecovery();
		stopMediaCleanupForClose();
		runtimeState.stopGatewayUpdateCheck().catch(() => {});
		stopConfigReloaderForClose().catch(() => {});
		runtimeState.controlUiSessionPullRequests?.stop();
		runtimeState.sessionViewerPresence?.stop();
		runtime.stopPresencePublications();
		cronReconciliation.invalidate();
		return prelude;
	};
	let configReloaderStopPromise = null;
	const stopConfigReloaderForClose = () => configReloaderStopPromise ??= runtimeState.configReloader.stop();
	const step = (name, run) => measureGatewayCloseStep(`restart.close.${name}`, run);
	const drainClosePersistence = () => Promise.all([
		step("auth-profile-usage", () => closeAuthProfileUsage(params.sdkResourceHost)),
		step("model-accounts", stopModelAccountsForClose),
		step("mention-inbox", () => mentionInbox.dispose()),
		step("sandbox-registry", () => sandboxRegistry.drain()),
		step("talk-persistence", () => talkClose.drain())
	]);
	const beginClosePrelude = async (options) => {
		await step("prelude-fence", () => markClosePreludeStarted(options));
		await Promise.all([
			drainClosePersistence(),
			step("pending-request-entries", () => requestEntryLifetime.waitForPendingEntries()),
			step("delivery-recovery", runtimeState.stopDeliveryRecovery),
			step("media-cleanup", stopMediaCleanupForClose),
			step("update-check", () => runtimeState.stopGatewayUpdateCheck()),
			step("config-reloader", () => stopConfigReloaderForClose().catch(() => {})),
			step("periodic-maintenance", () => runtimeState.maintenance?.stopPeriodicTasks().catch(() => {})),
			step("session-pull-requests", () => runtimeState.controlUiSessionPullRequests?.stop()),
			step("health-work", () => healthWork.drain())
		]);
	};
	let exitAfterClose = false;
	const runClosePrelude = async () => {
		await beginClosePrelude();
		stopNodeConnectionNotifications();
		watchNodeHttpRuntime.close();
		await shutdownRuntime.runGatewayClosePrelude({
			stopDiagnostics: stopGatewayDiagnosticHeartbeat,
			skillsChangeUnsub: () => runtimeState.skillsChangeUnsub({ exitAfterClose }),
			disposeNodeReapproval: () => nodeReapprovalCoordinator.dispose(),
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
	const stopConnectionDependentSidecars = connectionDependentSidecarStopOwner.stopAndJoin;
	const postReadySidecarStopOwner = runtimeState.postReadySidecars;
	const gatewayLifetimeSidecarStopOwner = runtimeState.gatewayLifetimeSidecars;
	const sealAndJoinRegisteredSidecarStops = async () => {
		const failure = (await Promise.allSettled([postReadySidecarStopOwner.sealAndJoin(), gatewayLifetimeSidecarStopOwner.sealAndJoin()])).find((result) => result.status === "rejected");
		if (failure) throw failure.reason;
	};
	const prepareClose = async (optsValue) => {
		exitAfterClose = optsValue?.exitAfterClose === true;
		await markClosePreludeStarted(optsValue);
		const preparation = await shutdownRuntime.prepareGatewayClose({
			resolveGatewayContext: runtime.resolvePluginGatewayContext,
			preparePluginRegistryClose: () => pluginRuntime.prepareClose(),
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
					cfg: readRuntimeConfig(),
					...restart
				});
			},
			cancelReceivedWork: (reason) => {
				runtime.connectionWork.beginClose(reason);
				kernel.setDispatchReady(false);
				gatewayInstanceRuntimeRef.current?.close();
			},
			getPendingReplyCount: getTotalPendingReplies,
			disposeAllCodeModeRuns: shutdownRuntime.disposeAllCodeModeRuns,
			updateCheckStop: runtimeState.stopGatewayUpdateCheck,
			configReloader: { stop: stopConfigReloaderForClose }
		}, optsValue);
		await beginClosePrelude(optsValue);
		return async () => {
			const channelIds = listLoadedChannelPluginsForRegistry(pluginRuntime.registry).map((plugin) => plugin.id);
			const transport = transportBridge.current();
			const contextLifetime = getGatewayContextLifetime(runtime.resolvePluginGatewayContext);
			try {
				await measureGatewayCloseStep("restart.close.portal-service", () => transport?.portalService.closeAll());
			} finally {
				await withPluginRuntimeRegistryScope(pluginRuntime.registry, () => shutdownRuntime.completeGatewayClose({
					retainSharedState: optsValue?.retainSharedState,
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
					drainWorktreeRunEnd: () => worktreeRunEnd.drain(),
					drainRetainedOpenAiEmbeddingProviders: shutdownRuntime.drainRetainedOpenAiEmbeddingProviders,
					stopGmailWatcher: shutdownRuntime.stopGmailWatcher,
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
	const configureDiagnostics = createGatewayDiagnosticsConfigurator({
		scheduler: runtime.scheduler,
		isClosing: () => lifecycle.closePreludeStarted,
		sampleLiveness: readinessEventLoopHealth.persistentDegradationSnapshot
	});
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
		pluginHostServices: { get cron() {
			return kernel.getCronService();
		} },
		shutdownRuntime,
		lifecycle,
		cronReconciliation,
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
				const result = await executeRequest(queued.params);
				for (const [index, waiter] of queued.waiters.entries()) waiter.resolve(index === 0 ? result : null);
			} catch (error) {
				for (const waiter of queued.waiters) waiter.reject(error);
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
			let state = requestStates.get(nodeId);
			const deferred = createDeferredCore();
			if (state?.queued?.fingerprint === fingerprint) {
				state.queued.params = params;
				state.queued.waiters.push(deferred);
			} else {
				const queued = {
					fingerprint,
					params,
					waiters: [deferred]
				};
				if (!state) {
					state = {};
					requestStates.set(nodeId, state);
					enqueueRequest(nodeId, state, queued);
				} else {
					const previous = state.queued;
					state.queued = queued;
					if (previous) for (const waiter of previous.waiters) waiter.resolve(null);
					else enqueueRequest(nodeId, state);
				}
			}
			return deferred.promise;
		},
		async finalizeCleanup(claim) {
			return await pendingNodeReapprovalAttempts.enqueue(`node-reapproval:${claim.nodeId}`, async () => await finalizeNodePairingCleanupClaim(claim));
		},
		dispose() {
			disposed = true;
			for (const state of requestStates.values()) for (const waiter of state.queued?.waiters ?? []) waiter.resolve(null);
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
		let stage = "subscriptions";
		(async () => {
			if (!await hasBoundWebPushSubscriptions(params.stateDir)) return;
			stage = "sender";
			const sender = await prepareWebPushNotificationSender(params.stateDir);
			stage = "authority";
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
				const viewedSessionKey = sessionKeys.length === 1 ? sessionKeys[0] : void 0;
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
					if (notification.category === "agent-finished" && viewedSessionKey !== void 0 && params.viewers?.isViewedOnDevice(target.subscription.deviceId, viewedSessionKey) === true) continue;
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
				return { start: () => {
					stage = "delivery";
					return Promise.all([...groups.values()].map((group) => sender({
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
					})));
				} };
			});
			if (!groupedResults) return;
			const results = groupedResults.flat();
			const failed = results.filter((result) => !result.ok).length;
			if (failed > 0) log.warn("event Web Push delivery failed", {
				category: notification.category,
				attempted: results.length,
				failed
			});
		})().catch((error) => {
			log.warn("event Web Push delivery could not complete", {
				category: notification.category,
				stage,
				error: formatErrorMessage(error),
				errorName: readErrorName(error),
				errorCode: extractErrorCode(error),
				stack: error instanceof Error ? error.stack : void 0,
				retry: false
			});
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
	warnSessionPersistenceDeprecation(`mentionInbox.${method}`, `mentionInbox.${method}Async`, {
		pluginId,
		family: "mention-inbox",
		compatibility: "Legacy recording queues work after commit; await recordCommittedInputAsync for completion. Synchronous reads, dismissals, and invalidation reject calls with async migration guidance."
	});
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
			if (profile.kind === "resolved") {
				pruneMapToMaxSize(displays, 9999);
				displays.set(profileId, profile);
			}
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
	function resolveContext(client, input, cfg, prepared) {
		const identified = identify(client, cfg);
		if (!identified.ok) return identified;
		const requester = identified.value;
		if ("sessionKey" in input) {
			const agent = resolveRequestedSessionAgentId(cfg, input.sessionKey, input.agentId);
			if (!agent.ok) return err(agent.error);
			const resolved = prepared ? prepared.readTarget() : params.readSessionTarget(input.sessionKey, agent.agentId);
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
	function involvedProfiles(input, target, cfg) {
		if (target?.entry.sessionId === input.sessionId && target.entry.incognito !== true && !isIncognitoSessionKey(target.canonicalKey)) {
			const sender = readProfile(input.senderProfileId);
			return input.recipientProfileIds.flatMap((id) => {
				const recipient = recipientProfile(id, {
					agentId: target.agentId,
					sessionKey: target.canonicalKey,
					entry: target.entry
				}, cfg);
				return sender && recipient && sender.profileId !== recipient.profileId ? [recipient.profileId] : [];
			});
		}
		return [];
	}
	return {
		async prepareContext(input) {
			if (!("sessionKey" in input)) return {
				readTarget: () => null,
				release() {}
			};
			const cfg = params.getRuntimeConfig();
			const agent = resolveRequestedSessionAgentId(cfg, input.sessionKey, input.agentId);
			if (!agent.ok) return {
				readTarget: () => null,
				release() {}
			};
			const prepared = await prepareSessionSharingRead({
				cfg,
				sessionKey: input.sessionKey,
				agentId: agent.agentId
			});
			return {
				readTarget: () => prepared.readCurrent(params.getRuntimeConfig()).target,
				release: prepared.release
			};
		},
		async recordCommittedInvolvementAsync(input, facts) {
			const cfg = params.getRuntimeConfig();
			if (!resolveRequestedSessionAgentId(cfg, input.sessionKey, input.agentId).ok || isIncognitoSessionKey(input.sessionKey)) return;
			const target = facts.readCurrent(params.getRuntimeConfig()).target;
			const profileIds = involvedProfiles(input, target, params.getRuntimeConfig());
			if (!target || !profileIds.length) return;
			if (!await updateSessionProfileInvolvementAsync({
				agentId: target.agentId,
				sessionKey: target.storeKey,
				storePath: target.storePath
			}, {
				expectedSessionId: input.sessionId,
				expectedEntry: target.entry,
				profileIds,
				change: {
					kind: "mention",
					source: input.committedSource
				},
				assertCurrent() {
					const currentCfg = params.getRuntimeConfig();
					const current = facts.readCurrent(currentCfg).target;
					if (!active || !isDeepStrictEqual(involvedProfiles(input, current, currentCfg), profileIds)) throw new Error("Committed mention authority changed before involvement commit");
				}
			})) throw new Error("Committed mention involvement was refused for a changed session");
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
		mentionable(client, input, prepared) {
			const cfg = params.getRuntimeConfig();
			const context = resolveContext(client, input, cfg, prepared);
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
		validateRecipients(client, input, profileIds, prepared) {
			if (profileIds.length === 0) return ok([]);
			const cfg = params.getRuntimeConfig();
			const context = resolveContext(client, input, cfg, prepared);
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
//#region src/gateway/mention-inbox-recording.ts
const log$7 = createSubsystemLogger("gateway/mentions");
function prepareCommittedMentionInput(input) {
	if (input.recipientProfileIds.length === 0 || isIncognitoSessionKey(input.sessionKey)) return false;
	if (!hasValidMentionReferences(input)) {
		log$7.warn("Skipped mention delivery with invalid committed references.");
		return false;
	}
	return true;
}
function createMentionInputRecorder(params) {
	const { policy } = params;
	return function applyCommittedInput(input, draft, guards, bounds, readTarget) {
		const { processed, head, dirtySources, items } = draft;
		const cfg = params.getRuntimeConfig();
		const resolved = readTarget();
		if (!resolved || resolved.entry.sessionId !== input.sessionId || resolved.entry.incognito === true || isIncognitoSessionKey(resolved.canonicalKey)) {
			log$7.debug("Skipped mention delivery because its committed session changed.");
			return [];
		}
		guards.push(() => {
			const current = readTarget();
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
		if (unavailableRecipients > 0) log$7.debug(`Skipped ${unavailableRecipients} unavailable mention recipients for committed input.`);
		return created;
	};
}
//#endregion
//#region src/gateway/mention-inbox-targets.ts
/** One bounded set of retained sharing facts for the Inbox's current view. */
function createMentionTargetCache(params) {
	const connectedTargets = /* @__PURE__ */ new Map();
	const targetAliases = /* @__PURE__ */ new Map();
	function readTarget(sessionKey, agentId) {
		const key = JSON.stringify([agentId, sessionKey]);
		const prepared = connectedTargets.get(targetAliases.get(key) ?? key);
		if (!prepared) return null;
		try {
			const current = prepared.facts.readCurrent(params.getRuntimeConfig()).target;
			return current ? {
				...prepared.target,
				...current,
				entry: {
					...prepared.target.entry,
					...current.entry
				}
			} : null;
		} catch {
			return null;
		}
	}
	async function prepareTarget(sessionKey, agentId) {
		const key = JSON.stringify([agentId, sessionKey]);
		if (readTarget(sessionKey, agentId)) return;
		removeTarget(targetAliases.get(key) ?? key);
		const cfg = params.getRuntimeConfig();
		const target = await resolveSessionSharingTargetAsync({
			cfg,
			sessionKey,
			agentId
		});
		if (!target) return;
		const canonicalKey = JSON.stringify([target.agentId, target.canonicalKey]);
		if (readTarget(target.canonicalKey, target.agentId)) {
			targetAliases.set(key, canonicalKey);
			connectedTargets.get(canonicalKey).aliases.add(key);
			return;
		}
		removeTarget(canonicalKey);
		if (connectedTargets.size >= 1e4) pruneTargets(key);
		const prepared = {
			sessionKey,
			target,
			facts: await prepareSessionSharingRead({
				cfg,
				sessionKey,
				agentId: target.agentId
			}),
			aliases: /* @__PURE__ */ new Set([key])
		};
		connectedTargets.set(canonicalKey, prepared);
		targetAliases.set(key, canonicalKey);
	}
	async function prepareTargets() {
		for (const item of params.readItems()) {
			const { sessionKey, agentId } = item.message.content;
			await prepareTarget(sessionKey, agentId);
		}
	}
	function removeTarget(key) {
		const prepared = connectedTargets.get(key);
		if (!prepared) return;
		prepared.facts.release();
		connectedTargets.delete(key);
		for (const alias of prepared.aliases) targetAliases.delete(alias);
	}
	function pruneTargets(additionalKey) {
		const retained = /* @__PURE__ */ new Set();
		for (const item of params.readItems()) {
			const { agentId, sessionKey } = item.message.content;
			const key = JSON.stringify([agentId, sessionKey]);
			retained.add(targetAliases.get(key) ?? key);
		}
		if (additionalKey) retained.add(targetAliases.get(additionalKey) ?? additionalKey);
		for (const key of connectedTargets.keys()) if (!retained.has(key)) removeTarget(key);
	}
	function invalidateTargets(sessionKey) {
		if (!sessionKey) {
			for (const prepared of connectedTargets.values()) prepared.facts.release();
			connectedTargets.clear();
			targetAliases.clear();
			return;
		}
		for (const [key, cached] of connectedTargets) if (cached.sessionKey === sessionKey || cached.target?.storeKeys.includes(sessionKey)) removeTarget(key);
	}
	return {
		readTarget,
		prepareTarget,
		prepareTargets,
		invalidateTargets
	};
}
//#endregion
//#region src/gateway/mention-inbox-worker.ts
async function readMentionSnapshot(context, revision) {
	context.admission.assertCurrent();
	if (revision >= 0 && getMentionStoreHeadAdmission(context.admission.databasePath)?.revision === revision) return;
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
//#region src/gateway/mention-inbox.ts
const log$6 = createSubsystemLogger("gateway/mentions");
/** Durable sources own retention and replay; each Gateway keeps disposable projection indexes. */
function createMentionInbox(params) {
	const scheduler = params.scheduler.scope();
	const context = captureOpenClawStateWorkerContext();
	const acceptedWork = new AsyncWorkScope();
	let state = createMentionProjection({
		head: {
			revision: -1,
			nextSequence: 0
		},
		sources: []
	});
	const { readTarget, prepareTarget, prepareTargets, invalidateTargets } = createMentionTargetCache({
		getRuntimeConfig: () => params.getRuntimeConfig(),
		readItems: () => state.items.values()
	});
	const policy = createHumanMentionPolicy({
		...params,
		readSessionTarget: readTarget
	});
	let tail = Promise.resolve();
	let closing = false;
	let needsSynchronization = true;
	let sessionRevision = 0;
	let refreshRetryAt = 0;
	let refreshRetryMs = 0;
	const views = /* @__PURE__ */ new WeakMap();
	let capacityReported = false;
	let profileInvalidationPending = false;
	const applyCommittedInput = createMentionInputRecorder({
		getRuntimeConfig: () => params.getRuntimeConfig(),
		now: () => scheduler.now(),
		policy,
		onCapacityReached() {
			if (!capacityReported) {
				log$6.warn("Mention retention reached its replay budget; new mention alerts are skipped until retained sources expire.");
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
		const snapshot = await readMentionSnapshot(context, needsSynchronization ? -1 : state.head.revision);
		if (snapshot) state = createMentionProjection(snapshot);
		needsSynchronization = false;
		return Boolean(snapshot);
	}
	async function mutate(operation, selectProfiles) {
		try {
			await synchronize();
			for (;;) {
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
				if (draft.dirtySources.size === 0) {
					state = prepared.publish(expectedHead);
					return result;
				}
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
					state = createMentionProjection(receipt.snapshot);
					continue;
				}
				context.admission.assertCurrent();
				state = prepared.publish(receipt.head);
				needsSynchronization = false;
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
	function currentTarget(item, cfg, projection = state) {
		const { source, message } = item;
		const { agentId, sessionKey, senderProfileId } = message.content;
		if (projection.items.get(item.id) !== item || source.expiresAt <= scheduler.now()) return;
		const resolved = readTarget(sessionKey, agentId);
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
	function readView(client, cfg, remember, projection = state) {
		const identified = policy.identify(client, cfg);
		if (!identified.ok) return identified;
		const requester = identified.value;
		const visible = [];
		const profileItems = projection.itemsByProfile.get(requester.profile.profileId);
		for (const item of [...profileItems ?? []].toReversed()) {
			const current = currentTarget(item, cfg, projection);
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
	function publishConnectedViews() {
		if (scheduler.signal.aborted) return;
		const cfg = params.getRuntimeConfig();
		for (const client of params.getClients()) {
			if (!client.connId) continue;
			const previous = views.get(client);
			const result = readView(client, cfg, true);
			if (!result.ok || (previous ? previous.revision === result.value.revision : result.value.items.length === 0)) continue;
			params.broadcastToConnIds("mentions.changed", {
				gatewayInstanceId: params.gatewayInstanceId,
				revision: result.value.revision
			}, /* @__PURE__ */ new Set([client.connId]));
		}
	}
	async function refreshConnectedViews() {
		await prepareTargets();
		publishConnectedViews();
	}
	function scheduleExpiry() {
		if (closing || scheduler.signal.aborted || state.processed.size === 0 && refreshRetryAt === 0) return;
		scheduler.schedule({
			id: `mentions:expiry:${params.gatewayInstanceId}`,
			atMs: refreshRetryAt || state.nextExpiryAt,
			run: refresh
		});
	}
	async function refresh() {
		if (closing || scheduler.signal.aborted) return;
		const started = performance.now();
		let phase = "admission";
		try {
			await enqueue(async () => {
				if (scheduler.now() < refreshRetryAt) return;
				phase = "maintenance";
				await maintain();
				context.admission.assertCurrent();
				phase = "sharing";
				await prepareTargets();
				phase = "publication";
				publishConnectedViews();
				refreshRetryAt = 0;
				refreshRetryMs = 0;
				scheduleExpiry();
			});
		} catch (error) {
			if (closing || scheduler.signal.aborted) return;
			refreshRetryMs = Math.min(refreshRetryMs ? refreshRetryMs * 2 : 6e4, 9e5);
			refreshRetryAt = scheduler.now() + refreshRetryMs;
			log$6.warn(`Unable to refresh the mention Inbox; current reads will retry. phase=${phase} error=${readErrorName(error) || "unknown"} code=${extractErrorCode(error) ?? "unknown"} elapsedMs=${Math.round(performance.now() - started)} retryAfterMs=${refreshRetryMs} cause=${formatErrorMessage(error, { includeCode: true })}`, { source: context.admission.databasePath });
			scheduleExpiry();
		}
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
			return mentionInboxUnavailable(log$6);
		}
		return mentionInboxUnavailable();
	}
	function legacyError(method) {
		warnMentionInboxDeprecation(method);
		return errorShape(ErrorCodes.UNAVAILABLE, `mentionInbox.${method} is unavailable; await mentionInbox.${method}Async instead.`);
	}
	function dismissItems(draft, client, ids) {
		const current = readView(client, params.getRuntimeConfig(), false, draft);
		if (current.ok) {
			const owned = new Set(current.value.items.map((item) => item.id));
			for (const id of ids) if (owned.has(id)) removeMentionItem(draft, draft.items.get(id));
		}
		return current;
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
					await prepareTargets();
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
		invalidateTargets();
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
	function recordCommittedInputAsync(committedInput) {
		const input = {
			...committedInput,
			recipientProfileIds: [...committedInput.recipientProfileIds],
			committedSource: { ...committedInput.committedSource }
		};
		return enqueue(async () => {
			if (!prepareCommittedMentionInput(input)) return;
			const cfg = params.getRuntimeConfig();
			const { agentId } = resolveSessionStoreIdentity({
				cfg,
				sessionKey: input.sessionKey,
				agentId: input.agentId
			});
			const prepared = await prepareSessionSharingRead({
				cfg,
				sessionKey: input.sessionKey,
				agentId
			});
			try {
				await policy.recordCommittedInvolvementAsync(input, prepared);
				const committed = await mutate((draft, guards, bounds) => applyCommittedInput(input, draft, guards, bounds, () => prepared.readCurrent(params.getRuntimeConfig()).target), () => input.recipientProfileIds.map((id) => policy.readProfile(id)?.profileId ?? id));
				context.admission.assertCurrent();
				await refreshConnectedViews();
				scheduleExpiry();
				publishCommittedMentions(committed);
			} finally {
				prepared.release();
			}
		}).catch(() => {
			log$6.warn("Mention delivery could not be completed; the posted message is unchanged.");
		});
	}
	return {
		async mentionable(client, input, publish) {
			let preparationFailure;
			try {
				while (policy.needsDirectoryPreparation()) await policy.prepareDirectory();
			} catch {
				preparationFailure = mentionInboxUnavailable(log$6);
			}
			try {
				if ("sessionKey" in input) await prepareTarget(input.sessionKey, input.agentId);
			} catch {
				preparationFailure = mentionInboxUnavailable(log$6);
			}
			publish(preparationFailure ?? readOperation(() => policy.mentionable(client, input)));
		},
		validateRecipients(client, input, profileIds) {
			warnMentionInboxDeprecation("validateRecipients");
			return readOperation(() => policy.validateRecipients(client, input, profileIds));
		},
		async validateRecipientsAsync(client, input, profileIds) {
			try {
				const prepared = await policy.prepareContext(input);
				try {
					return readOperation(() => policy.validateRecipients(client, input, profileIds, prepared));
				} finally {
					prepared.release();
				}
			} catch {
				return mentionInboxUnavailable(log$6);
			}
		},
		list: () => err(legacyError("list")),
		dismiss: () => err(legacyError("dismiss")),
		async listAsync(client, publish) {
			let failure;
			try {
				await enqueue(async () => {
					const changed = await maintain();
					await prepareTargets();
					if (changed) publishConnectedViews();
					scheduleExpiry();
				});
			} catch {
				failure = mentionInboxUnavailable(log$6);
			}
			publish(failure ?? readOperation(() => readView(client, params.getRuntimeConfig(), true)));
		},
		async dismissAsync(client, ids, publish) {
			let failure;
			try {
				const selectedIds = [...ids];
				await enqueue(async () => {
					await maintain();
					await prepareTargets();
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
					await refreshConnectedViews();
					scheduleExpiry();
					if (!result.ok) failure = result;
				});
			} catch {
				failure = mentionInboxUnavailable(log$6);
			}
			publish(failure ?? readOperation(() => readView(client, params.getRuntimeConfig(), true)));
		},
		recordCommittedInput(input) {
			warnMentionInboxDeprecation("recordCommittedInput");
			if (closing || scheduler.signal.aborted) return;
			const captured = structuredClone(input);
			const record = () => void recordCommittedInputAsync(captured);
			const database = openClawStateDatabaseCache.getOpenClawStateDatabaseIfOpenAtPath(context.admission.identity.canonicalPath);
			if (!database || !deferSqlitePostCommitPublication(database.db, record)) record();
		},
		recordCommittedInputAsync,
		invalidate() {
			throw new Error(legacyError("invalidate").message);
		},
		invalidateAsync,
		dispose
	};
}
//#endregion
//#region src/gateway/server-broadcast-live-text.ts
const log$5 = createSubsystemLogger("gateway/broadcast");
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
					log$5.error(`broadcast pending send failed: ${formatErrorMessage$1(err)}`);
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
	subscribers?.onChange((key, connId, baselineOnly) => {
		const client = params.clients.getByConnectionId(connId);
		const connection = client && connections.get(client);
		if (baselineOnly || !connection) return;
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
			if (isRecord(payload.message)) state.pending = {
				payload,
				projection,
				sessionKeys,
				opts
			};
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
	"agent.identity.changed": [READ_SCOPE],
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
/** Classify source envelopes without invoking getters, toJSON, or Proxy traps. */
function isPlainEventPayload(payload) {
	if (isProxy(payload) || !isRecord(payload)) return false;
	const prototype = Object.getPrototypeOf(payload);
	return (prototype === null || prototype === Object.prototype) && !("toJSON" in payload);
}
function isSessionReadInvalidation(event, payload, targeted) {
	if (!isPlainEventPayload(payload)) return false;
	const fields = Object.entries(Object.getOwnPropertyDescriptors(payload));
	return event === "sessions.changed" && targeted && Object.hasOwn(payload, "reason") && fields.every(([key, field]) => "value" in field && (key === "reason" && SESSION_CATALOG_INVALIDATIONS.has(field.value) || key === "ts" && typeof field.value === "number" && Number.isFinite(field.value)));
}
function modelMetadataInvalidationFragment(payload) {
	if (!isPlainEventPayload(payload)) return;
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
const log$4 = createSubsystemLogger("gateway/broadcast");
const SESSION_SUBSCRIPTION_EVENTS = /* @__PURE__ */ new Set([
	"agent",
	"chat",
	"chat.side_result",
	"session.observer",
	"session.narration",
	"session.tool"
]);
function serializeFrameField(name, value, serializeSession, serializeMessage) {
	const envelope = serializeSession ? value : void 0;
	const projected = envelope && !("toJSON" in envelope) && !("toJSON" in Object.prototype) ? envelope : void 0;
	const sessionJSON = projected ? serializeSession?.() : void 0;
	const messageBytes = projected ? serializeMessage?.() : void 0;
	const session = projected?.session;
	const message = projected?.message;
	if (projected) {
		projected.session = void 0;
		if (messageBytes) projected.message = void 0;
	}
	let fieldJSON;
	try {
		fieldJSON = JSON.stringify({ [name]: value });
	} finally {
		if (projected) {
			projected.session = session;
			if (messageBytes) projected.message = message;
		}
	}
	if (projected) {
		const separator = fieldJSON.endsWith("{}}") ? "" : ",";
		const prefix = `,${fieldJSON.slice(1, -2)}${separator}`;
		const suffix = `"session":${sessionJSON}}`;
		return messageBytes ? {
			prefix,
			message: messageBytes,
			suffix
		} : `${prefix}${suffix}`;
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
	let prefix = `{"type":"event","event":${base.eventJSON}`;
	let suffix = `,"seq":${seq}${base.stateVersionFragment}${recipient}}`;
	if (typeof payload === "string") return `${prefix}${payload}${suffix}`;
	const bytes = Buffer.isBuffer(payload) ? payload : payload.message;
	if (!Buffer.isBuffer(payload)) {
		prefix += payload.prefix;
		suffix = payload.suffix + suffix;
	}
	const frame = Buffer.allocUnsafe(Buffer.byteLength(prefix) + bytes.length + Buffer.byteLength(suffix));
	const offset = frame.write(prefix);
	bytes.copy(frame, offset);
	frame.write(suffix, offset + bytes.length);
	return frame;
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
		if (!retained) invalidateSharedReadResponses(broadcast, event);
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
		let sessionFragments;
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
			payloadFragment: presencePayload ? "" : Buffer.from(value === payload && metadataInvalidation !== void 0 ? metadataInvalidation : serializeFrameField("payload", value))
		});
		const sessionSubscriptionVerified = opts?.sessionSubscriptionVerified === true;
		const isSessionSubscriptionEvent = SESSION_SUBSCRIPTION_EVENTS.has(event);
		const sessionMessageSubscribers = params.sessionMessageSubscribers;
		let sessionSubscriberConnIdsByKey;
		const recipients = retained ? [retained.client] : targetConnIds ? params.clients.getByConnectionIds(targetConnIds) : params.clients;
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
					log$4.error(`broadcast serialization failed for event ${event}: ${formatErrorMessage$1(err)}`);
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
			const getDeliveryFrameBase = () => useDelta && projection ? frames.delta ??= frameBaseFor(projection.delta(payload)) : frames.snapshot ??= frameBaseFor(payload);
			let frame;
			let delivered;
			try {
				if (!sessionProjectionPrepared) {
					getFrameFields();
					const canSkipSourcePayload = !retained && (event === "session.message" || event === "sessions.changed") && isPlainEventPayload(payload);
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
					payloadFragment = (reusable ? presenceFragments?.get(projectedPayload.presence) : void 0) ?? serializeFrameField("payload", projectedPayload);
					if (reusable && typeof payloadFragment === "string") {
						payloadFragment = Buffer.from(payloadFragment);
						(presenceFragments ??= /* @__PURE__ */ new Map()).set(projectedPayload.presence, payloadFragment);
					}
				}
				if (projectSession) {
					const projected = projectSession(c);
					if (projected === void 0) continue;
					payloadFragment = projected.serializeSession && sessionFragments?.get(projected.payload) || serializeFrameField("payload", projected.payload, projected.serializeSession, projected.serializeMessage);
					if (projected.serializeSession) (sessionFragments ??= /* @__PURE__ */ new Map()).set(projected.payload, payloadFragment);
					delivered = projected.delivered;
				}
				const recipientProfileId = (c.connect.role ?? "operator") === "operator" ? c.preparedRecipientProfileId : void 0;
				if (lastFrame !== void 0 && lastFrameSequence === nextSeq && lastFrameRecipientProfileId === recipientProfileId && lastPayloadFragment === payloadFragment) frame = lastFrame;
				else {
					frame = frameWithSequence(base, nextSeq, payloadFragment, recipientProfileId);
					lastFrameSequence = nextSeq;
					lastFrameRecipientProfileId = recipientProfileId;
					lastPayloadFragment = payloadFragment;
					lastFrame = frame;
				}
			} catch (err) {
				log$4.error(`broadcast serialization failed for event ${event}: ${formatErrorMessage$1(err)}`);
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
					log$4.error(`broadcast send failed conn=${c.connId}: ${formatErrorMessage$1(err)}`, { event });
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
	let sessionViewers;
	const eventWebPush = createEventWebPushDelivery({
		getRuntimeConfig: loadRuntimeConfig,
		viewers: { isViewedOnDevice: (deviceId, sessionKey) => sessionViewers?.isViewedOnDevice(deviceId, sessionKey) === true }
	});
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
				if (!prepared) return false;
				return canReceiveSessionEvent({
					cfg,
					policyConfig,
					client,
					sessionKeys,
					agentId,
					event,
					payload,
					prepared
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
				if (!("all" in change) && change.scope === "acp") return;
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
		attachSessionViewerPresence(declarations) {
			sessionViewers = declarations;
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
//#region src/logging/diagnostic-stall-flight-recorder.ts
const WINDOW_MS = 5e3;
const SAMPLE_MS = 10;
const MAX_SAMPLES = 1024;
const MAX_PROFILE_BYTES = 1048576;
/** Two short native profiles retain recent stacks without a listener or on-demand heap scan. */
function createStallFlightRecorder(warn, now = () => performance$1.now()) {
	let active;
	let previous;
	let startedAt = 0;
	let disabled = !isMainThread || typeof v8.startCpuProfile !== "function" || Boolean(versions.bun) || Number(versions.node.split(".")[0]) < 26;
	let packageRoot = null;
	const stop = () => {
		disabled = true;
		previous = void 0;
		const handle = active;
		active = void 0;
		try {
			handle?.[Symbol.dispose]();
		} catch {
			warn("stall flight recorder unavailable: profiler-cleanup-failed");
		}
	};
	const start = () => v8.startCpuProfile({
		sampleInterval: SAMPLE_MS,
		maxBufferSize: MAX_SAMPLES
	});
	try {
		if (!disabled) disabled = hasProfilerConflict() || Boolean(process.getBuiltinModule("inspector")?.url()) || Boolean(process.getBuiltinModule("trace_events")?.getEnabledCategories());
		if (!disabled) {
			packageRoot = resolveOpenClawPackageRootSync({ moduleUrl: import.meta.url });
			active = start();
			startedAt = now();
		}
	} catch {
		disabled = true;
		warn("stall flight recorder unavailable: profiler-start-failed");
	}
	return {
		sample(stallMs = 0) {
			if (disabled || !active || stallMs === 0 && now() - startedAt < WINDOW_MS) return;
			try {
				const old = active;
				active = start();
				startedAt = now();
				const current = {
					json: old.stop(),
					endedAt: now()
				};
				const windows = previous ? [previous, current] : [current];
				previous = current.json.length <= MAX_PROFILE_BYTES ? current : void 0;
				if (!stallMs) return;
				const counts = /* @__PURE__ */ new Map();
				let samples = 0;
				let truncated = false;
				for (const window of windows) {
					if (window.json.length > MAX_PROFILE_BYTES) {
						truncated = true;
						continue;
					}
					const profile = parseNativeCpuProfile(window.json);
					const nodes = new Map(profile.nodes.map((node) => [node.id, node]));
					const parents = /* @__PURE__ */ new Map();
					for (const node of profile.nodes) for (const child of node.children ?? []) parents.set(child, node.id);
					let at = profile.startTime;
					const cutoff = profile.endTime - (stallMs + 100 - (now() - window.endedAt)) * 1e3;
					truncated ||= (profile.samples?.length ?? 0) >= MAX_SAMPLES;
					for (const [index, id] of (profile.samples ?? []).entries()) {
						at += profile.timeDeltas?.[index] ?? 0;
						if (at < cutoff) continue;
						samples++;
						const seen = /* @__PURE__ */ new Set();
						let cursor = id;
						while (cursor !== void 0) {
							const node = nodes.get(cursor);
							if (!node) break;
							const { callFrame: frame } = sanitizeDiagnosticProfileFrame(node.callFrame, packageRoot);
							if (frame.url || frame.functionName === "[native]" || frame.functionName === "(garbage collector)") {
								const label = `${frame.functionName || "(anonymous)"}@${frame.url}:${frame.lineNumber + 1}`.slice(0, 240);
								if (!seen.has(label)) {
									seen.add(label);
									counts.set(label, (counts.get(label) ?? 0) + 1);
								}
							}
							cursor = parents.get(cursor);
						}
					}
				}
				const frames = [...counts].toSorted((a, b) => b[1] - a[1]).slice(0, 8);
				return `windowMs=${Math.round(stallMs + 100)} samples=${samples} intervalMs=${SAMPLE_MS} truncated=${truncated} inclusive=${JSON.stringify(frames)}`;
			} catch {
				stop();
				warn("stall flight recorder unavailable: profiler-capture-failed");
				return;
			}
		},
		stop
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
const IDLE_SAMPLE_INTERVAL_MS = 1e4;
const WORKER_CPU_SAMPLE_BUDGET_MS = 100;
const log$3 = createSubsystemLogger("gateway/event-loop");
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
	const nowMs = deps.now ?? performance$1.now.bind(performance$1);
	const readCpuUsage = deps.cpuUsage ?? process.cpuUsage.bind(process);
	const readEventLoopUtilization = deps.eventLoopUtilization ?? performance$1.eventLoopUtilization.bind(performance$1);
	const flightRecorder = createStallFlightRecorder((message) => log$3.warn(message), nowMs);
	const stalls = createMainThreadStallMonitor(nowMs);
	let unattributedDelayMs = 0;
	let histogram = null;
	let histogramEnabled = true;
	let sampleDueAt = 0;
	let lastWallAt = nowMs();
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
		histogram = monitorEventLoopDelay({ resolution: EVENT_LOOP_MONITOR_RESOLUTION_MS });
		histogram.enable();
	} catch {
		histogram = null;
	}
	const sample = () => {
		if (!histogram) return;
		const now = nowMs();
		const attributed = stalls.drain();
		const delayMaxMs = Math.max(histogramEnabled ? nanosecondsToMilliseconds(histogram.max) : Math.max(0, now - sampleDueAt), attributed.delayMaxMs);
		let longestStallMs = attributed.stalls.length === 0 ? unattributedDelayMs : 0;
		for (const stall of attributed.stalls) longestStallMs = Math.max(longestStallMs, stall.elapsedMs);
		const profile = flightRecorder.sample(longestStallMs);
		if (unattributedDelayMs > 0 && attributed.stalls.length === 0) log$3.warn(`main-thread stall: elapsedMs=${Math.round(unattributedDelayMs)} task=unattributed`);
		unattributedDelayMs = delayMaxMs > EVENT_LOOP_DELAY_WARN_MS && attributed.stalls.length === 0 ? delayMaxMs : 0;
		for (const stall of attributed.stalls) log$3.warn(`main-thread stall: elapsedMs=${Math.round(stall.elapsedMs)} task=${JSON.stringify(stall.task.slice(0, 160))} taskMs=${Math.round(stall.taskMs)}`);
		if (profile) log$3.warn(`main-thread stall profile: ${profile}`);
		const intervalMs = Math.max(1, now - lastWallAt);
		if (attributed.dropped > 0) log$3.warn(`main-thread stall: omitted=${attributed.dropped} pendingLimit=8`);
		if (delayMaxMs < EVENT_LOOP_DELAY_WARN_MS && intervalMs < SUSTAINED_LOAD_SAMPLE_MIN_INTERVAL_MS) {
			samplingJob = scheduleSample(SUSTAINED_LOAD_SAMPLE_MIN_INTERVAL_MS - intervalMs);
			return;
		}
		const delayP99Ms = histogramEnabled ? nanosecondsToMilliseconds(histogram.percentile(99)) : 0;
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
		samplingJob = scheduleSample(!degraded && deps.isIdle?.() && !hasInternalDiagnosticEventInterest("gateway.event_loop.sample") ? IDLE_SAMPLE_INTERVAL_MS : SUSTAINED_LOAD_SAMPLE_MIN_INTERVAL_MS);
	};
	const scheduleSample = (delayMs) => {
		const enableHistogram = delayMs !== IDLE_SAMPLE_INTERVAL_MS;
		if (histogram && histogramEnabled !== enableHistogram) {
			histogramEnabled = enableHistogram;
			if (enableHistogram) {
				histogram.reset();
				histogram.enable();
			} else histogram.disable();
		}
		const job = scheduler.schedule({
			id: "event-loop-health",
			delayMs,
			phase: delayMs === IDLE_SAMPLE_INTERVAL_MS ? "maintenance" : void 0,
			run: () => queueMicrotask(sample)
		});
		sampleDueAt = nowMs() + (job.atMs - scheduler.now());
		return job;
	};
	let samplingJob = histogram ? scheduleSample(SUSTAINED_LOAD_SAMPLE_MIN_INTERVAL_MS) : void 0;
	if (histogram) captureWorkerCpu(lastWallAt);
	const reset = () => {
		stalls.reset();
		unattributedDelayMs = 0;
		histogram?.reset();
		lastWallAt = nowMs();
		lastCpuUsage = readCpuUsage();
		lastMainThreadCpuUsage = readMainThreadCpuUsage();
		lastHostCpuTimes = readHostCpuTimes();
		lastEventLoopUtilization = readEventLoopUtilization();
		lastSnapshot = void 0;
		firstDegradedAtMs = null;
		cancelWorkerCpuSample?.();
		lastWorkerCpuWindow = void 0;
		if (histogram) {
			captureWorkerCpu(lastWallAt);
			samplingJob = scheduleSample(SUSTAINED_LOAD_SAMPLE_MIN_INTERVAL_MS);
		}
	};
	return {
		snapshot: () => lastSnapshot,
		persistentDegradationSnapshot: () => {
			const current = lastSnapshot;
			return current?.degradedSinceMs != null && current.degradedSinceMs >= PERSISTENT_DEGRADATION_WARN_AFTER_MS ? current : void 0;
		},
		reset,
		stop: () => {
			flightRecorder.stop();
			stalls.stop();
			samplingJob?.cancel();
			histogram?.disable();
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
			log$2.warn(`Presence publication failed: ${formatErrorMessage$1(error)}`);
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
			coreReady: false,
			failing: [startup.pendingReason],
			uptimeMs
		};
		if (startup.status === "draining") return {
			ready: false,
			coreReady: false,
			failing: ["gateway-draining"],
			uptimeMs
		};
		const stateDatabaseFailure = deps.getStateDatabaseFailure?.();
		if (stateDatabaseFailure) {
			cachedState = null;
			return {
				ready: false,
				coreReady: false,
				failing: ["state-database"],
				stateDatabase: { reason: stateDatabaseFailure.message },
				uptimeMs
			};
		}
		if (agentDatabases?.length) {
			cachedState = null;
			return {
				ready: false,
				coreReady: false,
				failing: agentDatabases.map(({ agentId }) => `agent-database:${agentId}`),
				uptimeMs
			};
		}
		const pluginReload = deps.getPluginReloadStatus?.();
		if (pluginReload) {
			cachedState = null;
			return {
				ready: false,
				coreReady: false,
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
			coreReady: true,
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
			coreReady: true,
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
	const { bootstrap, scheduler, bootId, port, opts, log, logChannels, logHooks, logPlugins, gatewayRuntime, resolveChannelRuntime: getChannelRuntime } = params;
	const { pluginBootstrap, workerEnvironmentStartup, startupTrace, cfgAtStart, resolvedStartupAuthOverride, startupTailscaleOverride, ambientAutostartSuppressedChannelIds, minimalTestGateway, pluginGatewayContext, resolvePluginGatewayContext } = bootstrap;
	const pluginRuntime = Object.assign(params.pluginRegistryOwner, { baseGatewayMethods: pluginBootstrap.baseGatewayMethods });
	const listGatewayStartupChannelPlugins = (registry = pluginRuntime.registry) => listLoadedChannelPluginsForRegistry(registry);
	const desktopSessionRegistry = createDesktopSessionRegistry();
	const nodeDesktopStreamBroker = (await startupTrace.measure("node-desktop.runtime-import", () => import("./node-stream-broker-D_yIocgs.mjs"))).createNodeDesktopStreamBroker();
	const hostDesktopService = (await startupTrace.measure("host-desktop.runtime-import", () => import("./host-source-DI2h8iZL.mjs"))).createHostDesktopService({
		getConfig: () => readRuntimeConfig().desktop?.host,
		registry: desktopSessionRegistry
	});
	const gatewayComputerService = (await startupTrace.measure("computer.runtime-import", () => import("./computer-service-DRXc-LRW.mjs"))).createGatewayComputerService({
		getConfig: readRuntimeConfig,
		getPluginRegistry: () => pluginRuntime.registry,
		hostDesktopService
	});
	await startupTrace.measure("device-identity", () => loadOrCreateProcessDeviceIdentityAsync().catch(() => {}));
	const workerEnvironmentRuntime = workerEnvironmentStartup ? await startupTrace.measure("worker-environments.runtime-imports", async () => {
		return await (await import("./server-worker-environment-startup-BXaYv3pJ.mjs")).createGatewayWorkerEnvironmentRuntime({
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
	const workerPlacementModule = workerEnvironmentStartup ? await startupTrace.measure("worker-environments.placement-module", () => import("./server-worker-placement-startup-DVsKH9o4.mjs")) : void 0;
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
		initialPlacements: await workerEnvironmentStartup.placementStore.listAsync(),
		getCommittedRuntimeConfig,
		environments: workerEnvironmentService,
		gatewayNamespace: nodeWorkerGatewayNamespace,
		nodeWorkerBundleRetention,
		getSessionChangeContext: () => pluginGatewayContext.current,
		persistAbandonedPartial: async (request) => {
			const partial = connectionState.chatRunState.resolveBuffer(request.runId, { final: true });
			const text = partial.displayText ?? partial.text;
			if (!text.trim() && !request.missingToolResultText) return;
			const transcript = await import("./chat-transcript-persistence.runtime.js");
			await transcript.persistAbortedPartials({
				context: { logGateway: log },
				missingToolResultText: request.missingToolResultText,
				snapshots: [transcript.captureAbortedPartial({
					...request,
					text,
					abortOrigin: "placement-abandon",
					session: await transcript.prepareChatAbortSessionSnapshot({
						cfg: getCommittedRuntimeConfig(),
						key: request.sessionKey,
						agentId: request.agentId
					})
				})]
			});
		},
		cancelSessionWork: async (request) => {
			const context = pluginGatewayContext.current;
			if (!context) throw new Error("Worker session cancellation is not ready");
			const { cancelGatewayWorkerSessionWork } = await import("./server-worker-placement-cancel-DxvjS_4j.mjs");
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
		const { createDevicePlacementDemandReader, createDevicePlacementDemandReaderAsync } = await import("./device-placement-demand-B2YHJIWY.mjs");
		const demandSources = {
			resolveGatewayContext: resolvePluginGatewayContext,
			placements: workerPlacementRuntime.placements,
			environments: workerEnvironmentService
		};
		Object.assign(workerPlacementRuntime.dispatchService, {
			getAdmittedDeviceSessionCounts: createDevicePlacementDemandReader(demandSources),
			getAdmittedDeviceSessionCountsAsync: createDevicePlacementDemandReaderAsync(demandSources)
		});
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
		const { resolveGatewayRuntimeConfig } = await import("./server-runtime-config-BvVuVNZ6.mjs");
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
		const { ensureStartupLocalCliPairing } = await startupTrace.measure("runtime.local-cli-pairing-import", () => import("./startup-local-cli-pairing-sqe1NCOT.mjs"));
		const pairingResult = await startupTrace.measure("runtime.local-cli-pairing", () => ensureStartupLocalCliPairing());
		if (pairingResult === "created") log.info("runtime-only gateway auth paired the local CLI device before readiness");
		else if (pairingResult === "unavailable") log.warn("runtime-only gateway auth could not prepare local CLI device credentials; configure gateway.auth.token or gateway.auth.password for CLI access");
	}
	const getResolvedAuth = () => resolveGatewayAuth({
		authConfig: getActiveSecretsRuntimeConfigSnapshot()?.config.gateway?.auth ?? readRuntimeConfig().gateway?.auth,
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
	const resolveCurrentSharedGatewaySessionGeneration = () => resolveSharedGatewaySessionGeneration(getResolvedAuth(), readRuntimeConfig().gateway?.trustedProxies);
	const resolveSharedGatewaySessionGenerationForRuntimeSnapshot = () => resolveSharedGatewaySessionGenerationForConfig(readRuntimeConfig());
	const sharedGatewaySessionGenerationState = new SharedGatewaySessionGenerationState({
		current: resolveCurrentSharedGatewaySessionGeneration(),
		required: null
	});
	const initialHooksConfig = runtimeConfig.hooksConfig;
	publishHooksTokenEnvKey(initialHooksConfig);
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
	const { createTerminalLaunchPolicy } = await startupTrace.measure("terminal.launch-import", () => import("./launch-CvUpRf-B.mjs"));
	const terminalLaunchPolicy = createTerminalLaunchPolicy(cfgAtStart);
	const { runDefaultChannelSetupWizard, runDefaultSetupWizard } = await startupTrace.measure("gateway.wizard-imports", () => import("./wizard-5LlEuXLr.mjs"));
	const wizardRunner = opts.wizardRunner ?? runDefaultSetupWizard;
	const channelWizardRunner = opts.channelWizardRunner ?? runDefaultChannelSetupWizard;
	const { wizardSessions, findRunningWizard, purgeWizardSession } = createWizardSessionTracker();
	const systemAgentSessions = /* @__PURE__ */ new Map();
	const deps = createDefaultDeps();
	const runtimeStateRef = { current: null };
	const cronStartState = { handled: false };
	const gatewayTls = await startupTrace.measure("tls.runtime", () => loadGatewayTlsServerRuntime(cfgAtStart.gateway?.tls, log.child("tls")));
	const serverStartedAt = Date.now();
	const readinessEventLoopHealth = createGatewayEventLoopHealthMonitor({
		scheduler,
		isIdle: () => getActiveGatewayRootWorkCount({ excludeCurrent: true }) === 0
	});
	const startupState = {
		sidecarsReady: minimalTestGateway,
		postAttachSettled: false,
		pendingReason: "startup-sidecars",
		dispatchReady: false
	};
	const lifecycle = { closePreludeStarted: false };
	const startupAccountStarts = createDeferredCore();
	const gatewayInstanceRuntimeRef = { current: void 0 };
	const { createChannelManager } = await startupTrace.measure("gateway.channel-manager-import", () => import("./server-channels-D7r4ZPU_.mjs"));
	const channelManager = createChannelManager({
		scheduler,
		getRuntimeConfig: readRuntimeConfig,
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
	const isGatewayStartupPending = () => (!startupState.dispatchReady || !startupState.sidecarsReady || !startupState.postAttachSettled) && !lifecycle.closePreludeStarted;
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
		getAgentDatabaseAdmissionRefusals: () => {
			const cfg = readRuntimeConfig();
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
		getRuntimeConfig: readRuntimeConfig
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
		getRuntimeConfig: readRuntimeConfig,
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
		const { assertConfiguredWorkspaceStateReady } = await import("./workspace-state-dirs-BTAEPnuh.mjs");
		process.env.OPENCLAW_GATEWAY_PORT = String(port);
		const envBeforeStartupConfigLoad = { ...process.env };
		const formatRuntimeGatewayAuthTokenWarning = input.formatRuntimeGatewayAuthTokenWarning;
		const traceOriginAt = opts.processStartedAt ?? opts.startupStartedAt;
		const startupElapsedMs = typeof traceOriginAt === "number" ? Math.max(0, Date.now() - traceOriginAt) : 0;
		const startupTrace = createGatewayStartupTrace(log, performance$1.now() - startupElapsedMs, opts.updateCanary);
		const startupTraceOwner = _usingCtx$1.u({
			transferred: false,
			[Symbol.dispose]() {
				if (!this.transferred) startupTrace.close();
			}
		});
		if (startupElapsedMs > 0) startupTrace.mark("process.bootstrap");
		const startupConfigSnapshotRead = await withArtifactPreservingStateReads(async () => {
			if (!resumeGatewayRestartTraceFromEnv(process.env, [["source", "env"]]) && isTruthyEnvValue(process.env.OPENCLAW_GATEWAY_RESTART_TRACE)) {
				const restartHandoff = await readGatewayRestartHandoff();
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
			const { OPENCLAW_DATABASE_SCHEMA_DOCS_URL, OpenClawDatabaseSchemaPreflightError, preflightOpenClawDatabaseSchemas } = await startupTrace.measure("state.runtime-imports", () => import("./openclaw-database-preflight-D3lTU13W.mjs"));
			const inspectDatabaseSchemas = (signal) => preflightOpenClawDatabaseSchemas({
				signal,
				env: process.env,
				reuseStartupSchemaPreparation: true,
				agentAdmissionConfig: captureConfigOverrideApplier()(startupConfigSnapshotRead.snapshot.config),
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
		const { ensureGlobalUndiciEnvProxyDispatcher } = await startupTrace.measure("runtime.network-imports", () => import("./undici-global-dispatcher-BEHy_gBa.mjs"));
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
		const startupConfigModulePromise = startupTrace.measure("config.runtime-imports", () => import("./server-startup-config-DfF1Vbap.mjs"));
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
				logSecrets.warn(`${text} not delivered: ${formatErrorMessage$1(error)}`);
			}
		};
		const { createRuntimeSecretsActivator } = await startupConfigModulePromise;
		const activateRuntimeSecrets = createRuntimeSecretsActivator({
			logSecrets,
			emitStateEvent: emitSecretsStateEvent,
			beforeSnapshotPublication: async (config) => {
				const { publishCanonicalUserChannelPolicy } = await import("./user-channel-identity-operations-DRUFTAkb.mjs");
				await publishCanonicalUserChannelPolicy(config?.gateway, config?.commands?.ownerAllowFrom);
			},
			...startupConfigLoad.pluginMetadataSnapshot ? { pluginMetadataSnapshot: startupConfigLoad.pluginMetadataSnapshot } : {}
		});
		const startupActivationSourceConfig = configSnapshot.sourceConfig;
		const startupRuntimeConfig = captureConfigOverrideApplier()(startupConfigSnapshot.config);
		startupTrace.setConfig(startupRuntimeConfig);
		const { prepareGatewayStartupConfig } = await import("./server-startup-config-helpers-BCL5PfBN.mjs");
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
				const { cleanupRetiredManagedGitHubProfiles } = await import("./github-tool-profile-cleanup-CR-ZKqHK.mjs");
				return await cleanupRetiredManagedGitHubProfiles({
					config: cfgAtStart,
					env: process.env
				});
			});
			for (const warning of cleanup.warnings) log.warn(`managed GitHub profile cleanup: ${warning}`);
		} catch (error) {
			log.warn(`managed GitHub profile cleanup failed: ${formatErrorMessage$1(error)}`);
		}
		if (authBootstrap.generatedToken) log.warn(formatRuntimeGatewayAuthTokenWarning());
		const trustedProxyDeviceAutoApprove = cfgAtStart.gateway?.auth?.trustedProxy?.deviceAutoApprove;
		if (cfgAtStart.gateway?.auth?.mode === "trusted-proxy" && trustedProxyDeviceAutoApprove?.enabled === true && trustedProxyDeviceAutoApprove.scopes?.some((scope) => scope.trim() === "operator.admin")) log.warn("SECURITY WARNING: gateway.auth.trustedProxy.deviceAutoApprove.scopes includes operator.admin; every proxy-authenticated user can auto-approve a new operator device with full admin, and requests without scopes receive full admin automatically. Remove operator.admin and grant admin per identity via gateway.auth.identityScopes instead.");
		let resolvedStartupAuthOverride;
		let startupAuthSecretRefOverride;
		if (startupAuthOverride) {
			resolvedStartupAuthOverride = {};
			startupAuthSecretRefOverride = {};
			for (const key of [
				"mode",
				"token",
				"password",
				"allowTailscale",
				"rateLimit",
				"trustedProxy"
			]) {
				const override = startupAuthOverride[key];
				if (override === void 0) continue;
				if ((key === "token" || key === "password") && isSecretRef(override)) {
					startupAuthSecretRefOverride[key] = structuredClone(override);
					continue;
				}
				const resolvedValue = cfgAtStart.gateway?.auth?.[key];
				if (resolvedValue !== void 0) Object.assign(resolvedStartupAuthOverride, { [key]: structuredClone(resolvedValue) });
			}
		}
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
		const applyReloadableGatewayAuthRefs = (config) => startupAuthSecretRefOverride?.token || startupAuthSecretRefOverride?.password ? applyGatewayAuthOverridesForStartupPreflight(config, { auth: startupAuthSecretRefOverride }) : config;
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
			const reapplyRuntimeOverlays = (config) => resolveGatewayStartupSourceConfig(applyFixedGatewayOverlays(applyReloadableGatewayAuthRefs(reapplyCompareOverlays(config))), runtimeEnv.env);
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
		await setAppliedRuntimeConfigSnapshot(cfgAtStart, configSnapshot.sourceConfig);
		applyLoggingConfig(cfgAtStart.logging);
		initializePublishedConfigRuntimeEnv(configSnapshot.sourceConfig, {
			ownedEnv: collectConfigRuntimeEnvOwnership(configSnapshot.sourceConfig, envBeforeStartupConfigLoad, process.env),
			preserveExistingOwnership: true
		});
		const preparations = [
			minimalTestGateway || opts.updateCanary ? Promise.resolve(void 0) : startupTrace.measure("worker-environments.store-import", async () => {
				return await (await loadWorkerEnvironmentStartupModule()).loadGatewayWorkerEnvironmentStartupState();
			}),
			(async () => {
				if (opts.updateCanary) log.warn("candidate gateway: session catalogs and maintenance deferred until activation");
				if (minimalTestGateway || opts.updateCanary) return [];
				await startupTrace.measure("state.desktop-approval-admission", async () => {
					const { migrateLegacyDesktopStreamOptOuts } = await import("./device-pairing-node-desktop-migration-CUVGAXqA.mjs");
					const retired = await migrateLegacyDesktopStreamOptOuts(cfgAtStart);
					if (retired > 0) log.warn(`Preserved disabled desktop access for ${retired} paired node(s); approve their updated desktop capability to enable sharing.`);
				});
				return startupTrace.measure("sessions.admission", async () => {
					const { prepareGatewayStartupSessions } = await import("./server-startup-session-migration-Dge_JkbM.mjs");
					return prepareGatewayStartupSessions({
						cfg: cfgAtStart,
						env: process.env,
						log
					});
				});
			})(),
			startupTrace.measure("plugins.bootstrap-imports", () => import("./server-startup-plugins-CKrPrccB.mjs")),
			startupTrace.measure("cron.store-path", () => resolveCronJobsStorePathFromConfigAsync(cfgAtStart))
		];
		await Promise.allSettled(preparations);
		const [workerEnvironmentStartup, startupSessionDatabases, { prepareGatewayPluginBootstrap }, cronStorePath] = await Promise.all(preparations);
		const pluginGatewayContext = { current: void 0 };
		const resolvePluginGatewayContext = () => pluginGatewayContext.current;
		publishSystemEventStoreConfig(cfgAtStart);
		const pluginBootstrap = await startupTrace.measure("plugins.bootstrap", async () => {
			if (!opts.updateCanary) {
				const { initSubagentRegistry } = await import("./subagent-registry-BSZR34Tv.mjs");
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
		await setAppliedRuntimeConfigSnapshot(gatewayPluginConfigAtStart, configSnapshot.sourceConfig);
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
			configSnapshot,
			startupConfigLoad,
			startupActivationSourceConfig,
			startupRuntimeConfig,
			startupSessionDatabases,
			cronStorePath,
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
const loadGatewayModelCatalogModule = createLazyRuntimeModule(() => import("./server-model-catalog-BvOzwZza.mjs"));
const bindGatewayModelCatalog = createLazyRuntimeMethodBinder(loadGatewayModelCatalogModule);
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
const getChannelRuntime = createLazyRuntimeModule(() => import("./runtime-channel-DRX-SAph.mjs").then(({ createRuntimeChannel }) => createRuntimeChannel()));
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
	const [, { cancelPreparedModelRuntimeRefresh }] = await Promise.all([prepareRemoteModelCatalogStartupSnapshot(), import("./prepared-model-runtime-Dd6wQg9H.mjs")]);
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
			loadWorkerEnvironmentStartupModule: () => import("./server-worker-environment-startup-BXaYv3pJ.mjs"),
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
			resolveChannelRuntime: getChannelRuntime
		}));
		kernelState = runtime;
		bindLegacyPluginSdkResourceHost(runtime.resolvePluginGatewayContext, sdkResourceHost);
		const shutdownRuntime = await runtime.startupTrace.measure("gateway.shutdown-runtime-import", async () => (await import("./server-shutdown.runtime.js")).prepareGatewayShutdownRuntime());
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
			loadGatewayModelCatalog,
			loadGatewayModelCatalogSnapshot,
			readPreparedGatewayModelCatalog,
			readPreparedGatewayModelCatalogBatch
		}));
		if (!options.deferEarlyRuntime) await coreRuntime.startEarlyRuntime();
		await pluginMetadata.waitForRetirement();
		const requestRuntime = await runtime.startupTrace.measure("gateway.request-runtime", () => prepareGatewayKernelRequestRuntime({
			coreRuntime,
			log: log$1,
			logHealth: logHealth$1,
			hostLifecycle: opts.hostLifecycle
		}));
		if (!options.deferRequestRuntime) await requestRuntime.ensureRequestRuntimeReady();
		return requestRuntime;
	} catch (error) {
		startupError = error;
	}
	return await rethrowGatewayStartupError(startupError, async () => {
		const prelude = pluginMetadata.beginClose();
		scheduler.beginClose();
		await prelude;
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
	const url = URL.parse(req.url ?? "/", "http://localhost");
	if (!url) {
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
	const ingress = getRemoteControlUiIngressContext(req);
	assertRemoteControlUiIngressCurrent(ingress);
	const { html, headers, version } = buildSandboxHostDocument(csp, ingress ? [ingress.publicOrigin, ...ingress.frameAncestors] : void 0);
	res.statusCode = 200;
	for (const [name, value] of Object.entries(headers)) res.setHeader(name, value);
	res.setHeader("Cache-Control", url.searchParams.get("v") === version ? "public, max-age=31536000, immutable" : "no-store");
	res.setHeader("Content-Length", String(Buffer.byteLength(html)));
	res.end(req.method === "HEAD" ? void 0 : html);
	return true;
}
/** Dedicated listener: only the proxy and explicitly public renderer assets, never Gateway data. */
function createSandboxHostHttpServer(tlsOptions, resolvePluginRegistry) {
	const handler = createSandboxHostHttpRequestHandler(resolvePluginRegistry);
	const listener = (req, res) => {
		handler(req, res);
	};
	return tlsOptions ? createServer$2(tlsOptions, listener) : createServer$1(listener);
}
/** Shared dedicated-surface owner for listener and virtual ingress transports. */
function createSandboxHostHttpRequestHandler(resolvePluginRegistry) {
	const readersByRegistry = /* @__PURE__ */ new WeakMap();
	const serveResource = async (req, res) => {
		const registry = resolvePluginRegistry?.();
		if (!registry || req.method !== "GET" && req.method !== "HEAD") {
			respondPlainText(res, 404, "Not Found");
			return;
		}
		let readers = readersByRegistry.get(registry);
		if (!readers) {
			readers = /* @__PURE__ */ new Map();
			for (const { definition } of registry.boardWidgetContentKinds.values()) {
				const read = definition.resources.readPublicResource;
				if (read) for (const resourcePath of definition.resources.paths) readers.set(resourcePath, read);
			}
			readersByRegistry.set(registry, readers);
		}
		const pathname = new URL(req.url ?? "/", "http://localhost").pathname;
		const reader = readers.get(pathname);
		const resource = reader ? await reader(pathname) : void 0;
		assertRemoteControlUiIngressCurrent(getRemoteControlUiIngressContext(req));
		if (!resource) {
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
	return async (req, res) => {
		const ingress = getRemoteControlUiIngressContext(req);
		assertRemoteControlUiIngressCurrent(ingress);
		if (handleMcpAppSandboxHttpRequest(req, res)) return;
		if (!resolvePluginRegistry) {
			respondPlainText(res, 404, "Not Found");
			return;
		}
		try {
			await serveResource(req, res);
		} catch {
			if (ingress) try {
				assertRemoteControlUiIngressCurrent(ingress);
			} catch {
				res.destroy();
				return;
			}
			respondPlainText(res, 503, "Renderer resource unavailable");
		}
	};
}
//#endregion
//#region src/gateway/server-http-modules.ts
const getControlUiModule = createLazyRuntimeModule(() => import("./control-ui-DQtSZlZc.mjs"));
const getControlUiPluginAssetsModule = createLazyRuntimeModule(() => import("./control-ui-plugin-assets-Bg3Uwvw2.mjs"));
const getCanvasServeModule = createLazyRuntimeModule(() => import("./serve.runtime.js"));
const getBoardHttpModule = createLazyRuntimeModule(() => import("./board-http-Bu6qH-dx.mjs"));
const getEmbeddingsHttpModule = createLazyRuntimeModule(() => import("./embeddings-http-BDnoqNZN.mjs"));
const getManagedMediaAttachmentsModule = createLazyRuntimeModule(() => import("./managed-image-attachments-Bg-PvYB8.mjs"));
const getArtifactDownloadsModule = createLazyRuntimeModule(() => import("./artifact-downloads-yZr5EAXF.mjs"));
const getMcpAppStandaloneModule = createLazyRuntimeModule(() => import("./mcp-app-standalone-DtERICCe.mjs"));
const getModelsHttpModule = createLazyRuntimeModule(() => import("./models-http-BL4V6gsJ.mjs"));
const getOpenAiHttpModule = createLazyRuntimeModule(() => import("./openai-http-CjnM-GEO.mjs"));
const getOpenResponsesHttpModule = createLazyRuntimeModule(() => import("./openresponses-http-BjdIg0Ex.mjs"));
const getSessionHistoryHttpModule = createLazyRuntimeModule(() => import("./sessions-history-http-wIV_Zenu.mjs"));
const getSessionKillHttpModule = createLazyRuntimeModule(() => import("./session-kill-http-wRkYzfjw.mjs"));
const getToolsInvokeHttpModule = createLazyRuntimeModule(() => import("./tools-invoke-http-Bc08ycLI.mjs"));
const getDevicePairingJoinHttpModule = createLazyRuntimeModule(() => import("./device-pairing-join-http-CVmEfHzw.mjs"));
const getPluginNodeCapabilityAuthModule = createLazyRuntimeModule(() => import("./plugin-node-capability-auth-B4mLTqH0.mjs"));
const getHttpAuthUtilsModule = createLazyRuntimeModule(() => import("./http-auth-utils-CdYuTXAm.mjs"));
const getPluginRouteRuntimeScopesModule = createLazyRuntimeModule(() => import("./plugin-route-runtime-scopes-3fq4HOA1.mjs"));
const getNativeHookRelayModule = createLazyRuntimeModule(() => import("./native-hook-relay-http-_KPNQQ9X.mjs"));
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
/** Physical and virtual transports share upgrade admission and route ownership. */
function attachGatewayUpgradeHandler(opts) {
	const { wss, handlePluginUpgrade, shouldEnforcePluginGatewayAuth, resolvePluginNodeCapabilityRoute, clients, preauthConnectionBudget, resolvedAuth, rateLimiter, publicRateLimiter, workerIngressEnabled, log } = opts;
	const getResolvedAuth = opts.getResolvedAuth ?? (() => resolvedAuth);
	const handle = async (req, socket, head) => {
		socket.once("error", () => socket.destroy());
		const remoteIngress = getRemoteControlUiIngressContext(req);
		if (!remoteIngress) markGatewayIngressTransport(req, opts.ingressTransport ?? { kind: "ordinary" });
		const handleUpgrade = async () => {
			await opts.waitForRequestRuntime?.();
			const configSnapshot = readRuntimeConfig();
			assertRemoteControlUiIngressCurrent(remoteIngress);
			if (remoteIngress) {
				const path = URL.parse(req.url ?? "/", remoteIngress.publicOrigin)?.pathname;
				const mainPath = (opts.controlUiBasePath ?? "") || "/";
				if (req.headers.origin !== remoteIngress.publicOrigin || !path || ![
					mainPath,
					"/desktop/observe",
					"/desktop/audio",
					"/browser/screencast"
				].includes(path)) {
					rejectWebSocketUpgrade(socket, { status: 403 });
					return;
				}
			}
			const trustedProxies = configSnapshot.gateway?.trustedProxies ?? [];
			const allowRealIpFallback = configSnapshot.gateway?.allowRealIpFallback === true;
			const ingressAttribution = prepareGatewayIngressAttribution({
				req,
				trustedProxies,
				allowRealIpFallback
			});
			const requestClientIp = ingressAttribution.kind === "unattributable-proxy" ? ingressAttribution.remoteAddress : ingressAttribution.clientIp;
			const preauthBudgetKey = ingressAttribution.kind === "remote-forwarded" ? ingressAttribution.rateLimit.subject.key : requestClientIp;
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
			if (handlePluginUpgrade && (!remoteIngress || requestPath === "/browser/screencast")) {
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
						getRuntimeConfig: readRuntimeConfig,
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
				assertRemoteControlUiIngressCurrent(remoteIngress);
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
					const { handleDesktopAudioUpgrade } = await import("./audio-bridge-DEzA_WB7.mjs");
					assertRemoteControlUiIngressCurrent(remoteIngress);
					handleDesktopAudioUpgrade(req, socket, head);
					return;
				}
				const { handleDesktopObserveUpgrade } = await import("./observe-bridge-DwYpVqhW.mjs");
				assertRemoteControlUiIngressCurrent(remoteIngress);
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
			assertRemoteControlUiIngressCurrent(remoteIngress);
			if (remoteIngress && requestPath !== (opts.controlUiBasePath || "/")) {
				rejectWebSocketUpgrade(socket, { status: 404 });
				return;
			}
			try {
				handleBudgetedGatewayWebSocketUpgrade({
					req,
					socket,
					head,
					wss,
					preauthConnectionBudget,
					preauthBudgetKey,
					ingressName: "Gateway",
					isStartupPending: opts.isStartupPending
				});
			} catch {
				throw new Error("gateway websocket upgrade failed");
			}
		};
		await runHttpConnectionRequest(req, () => runWithDiagnosticTraceContext(createDiagnosticTraceContext(), handleUpgrade), "upgrade").catch((err) => {
			const remoteAddress = socket.remoteAddress ?? "unknown";
			const errorMessage = err instanceof Error ? err.message : String(err);
			log?.warn(`ws upgrade error from ${remoteAddress}: ${errorMessage}`);
			rejectWebSocketUpgrade(socket, { status: 503 });
		});
	};
	opts.httpServer.on("upgrade", (req, socket, head) => {
		handle(req, socket, head);
	});
	return handle;
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
	], createLazyRuntimeNamedExport(() => import("./plugin-icon-http-CIe74UjI.mjs"), "handlePluginIconHttpRequest")],
	[["pluginThemeArt"], createLazyRuntimeNamedExport(() => import("./plugin-theme-art-http-Dm2ob7C3.mjs"), "handlePluginThemeArtHttpRequest")],
	[["workspaceIcon"], createLazyRuntimeNamedExport(() => import("./workspace-icon-http-DVr6IJR-.mjs"), "handleWorkspaceIconHttpRequest")],
	[["channelAvatar"], createLazyRuntimeNamedExport(() => import("./channel-avatar-http-Dgu3rK55.mjs"), "handleChannelAvatarHttpRequest")]
];
/** Personal images use their private authenticated owners even without dashboard hosting. */
const CONTROL_UI_USER_IMAGE_HTTP_ROUTES = [[parseControlUiUserBackgroundPath, createLazyRuntimeNamedExport(() => import("./user-background-http-CpDSSlCN.mjs"), "handleUserBackgroundHttpRequest")], [parseControlUiUserAvatarPath, createLazyRuntimeNamedExport(() => import("./user-profiles-http-ZMz6gAx1.mjs"), "handleUserProfileAvatarHttpRequest")]];
//#endregion
//#region src/gateway/control-ui-public-session-cache.ts
const MAX_ENTRIES = 128;
const MAX_BYTES = 16777216;
/** The route owns this bounded derived cache; publication authority is never cached here. */
function createPublicSessionRepresentationCache() {
	const entries = /* @__PURE__ */ new Map();
	let bytes = 0;
	let active = true;
	const remove = (key, entry) => {
		entry.current = false;
		bytes -= entry.bytes;
		entries.delete(key);
	};
	const invalidate = (sessionKey, runtimeOnly = false) => {
		for (const [key, entry] of entries) if ((!sessionKey || entry.sessionKey === sessionKey) && (!runtimeOnly || entry.kind === "card")) remove(key, entry);
	};
	const stop = [sessionChanges.subscribe((change) => {
		const runtimeOnly = change.scope === "runtime" || change.scope === "agent-runs" || change.scope === "subagent-runs";
		invalidate("sessionKey" in change ? change.sessionKey : void 0, runtimeOnly);
	}), onInternalSessionTranscriptUpdate((update) => invalidate(update.target?.sessionKey ?? update.sessionKey))];
	return {
		get(key, config) {
			const entry = entries.get(key);
			if (!active || !entry) return;
			if (entry.config !== config) {
				remove(key, entry);
				return;
			}
			if (entry.representation) {
				entries.delete(key);
				entries.set(key, entry);
			}
			return entry.representation;
		},
		begin(key, sessionKey, config, kind) {
			const previous = entries.get(key);
			if (previous) remove(key, previous);
			while (entries.size >= MAX_ENTRIES) {
				const oldest = entries.entries().next().value;
				if (!oldest) break;
				remove(...oldest);
			}
			const entry = {
				sessionKey,
				kind,
				config,
				current: active,
				bytes: 0
			};
			const isCurrent = () => active && entry.current;
			if (active) entries.set(key, entry);
			return {
				isCurrent,
				complete(body) {
					if (!isCurrent()) return;
					if (entry.representation) return entry.representation;
					const representation = {
						body,
						etag: `"${createHash("sha256").update(body).digest("base64url")}"`,
						isCurrent
					};
					const size = Buffer.byteLength(body);
					if (size > MAX_BYTES) {
						remove(key, entry);
						return representation;
					}
					for (const [oldestKey, oldest] of entries) {
						if (bytes + size <= MAX_BYTES) break;
						remove(oldestKey, oldest);
					}
					if (entry.current) {
						entry.bytes = size;
						entry.representation = representation;
						bytes += size;
					}
					return representation;
				},
				cancel() {
					if (entry.current) remove(key, entry);
				}
			};
		},
		dispose() {
			active = false;
			for (const unsubscribe of stop) unsubscribe();
			invalidate();
		}
	};
}
//#endregion
//#region src/gateway/control-ui-public-session-admission.ts
const PUBLIC_SESSION_RATE_WINDOW_MS = 6e4;
const PUBLIC_SESSION_CLIENT_REQUEST_LIMIT = 120;
const PUBLIC_SESSION_PUBLICATION_REQUEST_LIMIT = 240;
const PUBLIC_SESSION_MAX_CLIENTS = 4096;
const PUBLIC_SESSION_MAX_PUBLICATIONS = 2048;
const PUBLIC_SESSION_MAX_CONCURRENT_READS = 8;
const PUBLIC_SESSION_MAX_CONCURRENT_READS_PER_PUBLICATION = 2;
const PUBLIC_SESSION_MAX_QUEUED_READS = 32;
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
	const cache = createPublicSessionRepresentationCache();
	let active = true;
	const configIds = /* @__PURE__ */ new WeakMap();
	let nextConfigId = 1;
	let activeReads = 0;
	const queued = [];
	const hasCapacity = (publicationKey) => activeReads < PUBLIC_SESSION_MAX_CONCURRENT_READS && (activeByPublication.get(publicationKey) ?? 0) < PUBLIC_SESSION_MAX_CONCURRENT_READS_PER_PUBLICATION;
	const reserve = (publicationKey) => {
		activeReads++;
		activeByPublication.set(publicationKey, (activeByPublication.get(publicationKey) ?? 0) + 1);
		return () => {
			activeReads--;
			const remaining = (activeByPublication.get(publicationKey) ?? 1) - 1;
			if (remaining) activeByPublication.set(publicationKey, remaining);
			else activeByPublication.delete(publicationKey);
			for (let index = 0; index < queued.length;) {
				if (!active || activeReads >= PUBLIC_SESSION_MAX_CONCURRENT_READS) break;
				const next = queued[index];
				if (!hasCapacity(next.publicationKey)) {
					index++;
					continue;
				}
				queued.splice(index, 1);
				next.resolve(reserve(next.publicationKey));
			}
		};
	};
	const acquire = (publicationKey) => {
		if (!active) return Promise.resolve(void 0);
		if (hasCapacity(publicationKey)) return Promise.resolve(reserve(publicationKey));
		if (queued.length >= PUBLIC_SESSION_MAX_QUEUED_READS) return Promise.resolve(void 0);
		return new Promise((resolve) => {
			queued.push({
				publicationKey,
				resolve
			});
		});
	};
	const configId = (config) => {
		const existing = configIds.get(config);
		if (existing !== void 0) return existing;
		const created = nextConfigId++;
		configIds.set(config, created);
		return created;
	};
	return {
		dispose() {
			active = false;
			cache.dispose();
			for (const next of queued.splice(0)) next.resolve(void 0);
			clientWindows.clear();
			publicationWindows.clear();
		},
		admitClient(clientKey) {
			const retryMs = admitRateWindow(clientWindows, clientKey, PUBLIC_SESSION_CLIENT_REQUEST_LIMIT, PUBLIC_SESSION_MAX_CLIENTS, Date.now());
			return retryMs === void 0 ? { kind: "ok" } : {
				kind: "rate-limited",
				retryAfterSeconds: Math.ceil(retryMs / 1e3)
			};
		},
		async run(params) {
			if (!active) return { kind: "unavailable" };
			const now = Date.now();
			const publicationRetryMs = admitRateWindow(publicationWindows, params.publicationKey, PUBLIC_SESSION_PUBLICATION_REQUEST_LIMIT, PUBLIC_SESSION_MAX_PUBLICATIONS, now);
			if (publicationRetryMs !== void 0) return {
				kind: "rate-limited",
				retryAfterSeconds: Math.ceil(publicationRetryMs / 1e3)
			};
			const inFlightKey = `${configId(params.config)}:${params.kind}:${params.requestKey}`;
			const cached = cache.get(inFlightKey, params.config);
			if (cached) return {
				kind: "ok",
				value: cached
			};
			const existing = inFlight.get(inFlightKey);
			if (existing) {
				const value = await existing;
				return value === void 0 ? { kind: "unavailable" } : {
					kind: "ok",
					value
				};
			}
			const build = cache.begin(inFlightKey, params.sessionKey, params.config, params.kind);
			const pending = (async () => {
				const release = await acquire(params.publicationKey);
				if (!release) {
					build.cancel();
					return;
				}
				try {
					if (!build.isCurrent()) return;
					const body = await params.work();
					if (body === null) {
						build.cancel();
						return null;
					}
					return build.complete(body);
				} catch (error) {
					build.cancel();
					throw error;
				} finally {
					release();
				}
			})();
			inFlight.set(inFlightKey, pending);
			try {
				const value = await pending;
				return value === void 0 ? { kind: "unavailable" } : {
					kind: "ok",
					value
				};
			} finally {
				inFlight.delete(inFlightKey);
			}
		}
	};
}
//#endregion
//#region src/gateway/control-ui-public-session.ts
function isControlUiPublicSessionPath(pathname, basePath) {
	return pathname === `${basePath}/share/session` || pathname === `${basePath}/share/session/card.png`;
}
async function serveControlUiPublicSession(params) {
	const { req, res, basePath, config: cfg, projection, gate: requestGate } = params;
	const url = req.url ? new URL(req.url, "http://localhost") : void 0;
	if (!url) {
		respondNotFound(res);
		return true;
	}
	const publicOrigin = resolveGatewayPublicOrigin(cfg);
	const isCard = url.pathname === `${basePath}/share/session/card.png`;
	const secureIngress = isSecurePublicSessionIngress(req, params.ingress, publicOrigin);
	res.setHeader("Cache-Control", "no-store");
	res.setHeader("X-Robots-Tag", "noindex, nofollow");
	res.setHeader("Content-Security-Policy", PUBLIC_SESSION_CONTENT_SECURITY_POLICY);
	const unavailable = (status, retryAfterSeconds = 1) => {
		if (isCard) return params.card.fallback().then(() => true);
		const body = status === 404 ? "This public session is unavailable." : status === 429 ? "Too many public session requests. Please retry later." : "This public session is temporarily unavailable. Please retry.";
		res.statusCode = status;
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		res.setHeader("Content-Length", Buffer.byteLength(body));
		if (status === 429 || status === 503) res.setHeader("Retry-After", String(retryAfterSeconds));
		res.end(req.method === "HEAD" ? void 0 : body);
		return true;
	};
	const publicShare = isCard ? parseControlUiPublicSessionCardUrl(url, basePath) : parseControlUiPublicSessionShareUrl(url, basePath);
	const origin = resolveControlUiShareOrigin(req, publicOrigin);
	const offsetText = url.searchParams.get("offset") ?? "0";
	const offset = Number(offsetText);
	if (req.method !== "GET" && req.method !== "HEAD" || !publicShare || !origin || !cfg || url.searchParams.getAll("offset").length > 1 || !/^(?:0|[1-9][0-9]{0,9})$/u.test(offsetText)) return unavailable(404);
	if (!secureIngress) return unavailable(404);
	if (req.method === "HEAD") {
		if (isCard) return unavailable(404);
		res.statusCode = 405;
		res.setHeader("Allow", "GET");
		res.setHeader("Content-Length", "0");
		res.end();
		return true;
	}
	const clientAdmission = requestGate.admitClient(params.ingress.rateLimit.subject.key);
	if (clientAdmission.kind === "rate-limited") return unavailable(429, clientAdmission.retryAfterSeconds);
	try {
		const { resolvePublicSessionShareToken } = await import("./control-ui-public-session-token-B21WKmy0.mjs");
		const locator = await resolvePublicSessionShareToken(publicShare.token);
		if (!locator) return unavailable(404);
		if (!projection) return unavailable(503);
		if (isCard) {
			const { servePublicSessionCardRepresentation } = await import("./control-ui-public-session-card-response-BwyE4H-v.mjs");
			return await servePublicSessionCardRepresentation({
				...params,
				locator,
				projection,
				host: new URL(origin).host,
				token: publicShare.token
			});
		}
		const { servePublicSessionRepresentation } = await import("./control-ui-public-session-response-CR3xwPfV.mjs");
		const latestUrl = buildControlUiPublicSessionSharePath({
			basePath,
			token: publicShare.token
		});
		const canonicalUrl = publicOrigin || req.socket instanceof TLSSocket ? `${origin}${latestUrl}` : void 0;
		return await servePublicSessionRepresentation({
			...params,
			locator,
			projection,
			offset,
			requestKey: JSON.stringify([
				createHash("sha256").update(publicShare.token).digest("base64url"),
				offset,
				origin
			]),
			document: {
				latestUrl,
				mediaBaseUrl: buildPublicSessionMediaBaseUrl(basePath, publicShare.token),
				canonicalUrl,
				assetBasePath: basePath,
				cardUrl: `${origin}${buildControlUiPublicSessionCardPath({
					basePath,
					token: publicShare.token
				})}`
			},
			olderUrl: (olderOffset) => `${latestUrl}&offset=${olderOffset}`,
			unavailable
		});
	} catch {
		return unavailable(503);
	}
}
//#endregion
//#region src/gateway/control-ui-session-routes.ts
/** One HTTP-server lifetime for public document work and protected app handoffs. */
function createControlUiSessionRoutes(options) {
	const basePath = normalizeControlUiBasePath(options.controlUiBasePath);
	let gate;
	let renderer;
	const publicGate = () => gate ??= createControlUiPublicSessionRequestGate();
	return {
		matches(pathname, rawUrl) {
			if (isControlUiPublicSessionPath(pathname, basePath) || pathname === `${basePath}/share/session/media` || pathname === controlUiSessionEntryPath(basePath)) return true;
			if (!pathname.startsWith(`${basePath}/chat/`) || pathname === `${basePath}/chat/`) return false;
			const target = parseControlUiSessionPath(pathname, basePath);
			const query = new URL(rawUrl ?? pathname, "http://localhost").searchParams;
			return !(target?.kind === "main" && [
				"catalog",
				"host",
				"thread"
			].every((key) => query.getAll(key).length === 1 && query.get(key)?.trim()));
		},
		reject(res) {
			respondNotFound(res);
			return true;
		},
		dispose() {
			gate?.dispose();
			renderer?.then((current) => current.dispose());
		},
		async serve(params) {
			const { req, res, config } = params;
			const pathname = new URL(req.url ?? "/", "http://localhost").pathname;
			const projection = getSessionRowProjection(options.getGatewayRequestContext?.());
			const serveApp = async (path, isCurrent) => {
				const originalUrl = req.url;
				req.url = path;
				try {
					return await (await getControlUiModule()).handleControlUiHttpRequest(req, res, {
						...params,
						basePath,
						root: options.controlUiRoot,
						terminalEnabled: options.isTerminalEnabled?.() ?? isTerminalConfigEnabled(config),
						agentId: resolveAssistantAgentId(config),
						sessionEntryPath: path,
						isSessionEntryCurrent: isCurrent
					});
				} finally {
					req.url = originalUrl;
				}
			};
			if (pathname === `${basePath}/share/session/media`) return (await import("./control-ui-public-session-media-khAOBIa7.mjs")).serveControlUiPublicSessionMedia({
				...params,
				basePath,
				projection,
				gate: publicGate()
			});
			if (isControlUiPublicSessionPath(pathname, basePath)) return serveControlUiPublicSession({
				...params,
				basePath,
				projection,
				gate: publicGate(),
				card: {
					pullRequests: options.getGatewayRequestContext?.()?.controlUiSessionPullRequests,
					render: async (card) => {
						renderer ??= import("./control-ui-public-session-card-CBiblfDu.mjs").then((module) => module.createPublicSessionCardRenderer());
						return (await renderer).render(card);
					},
					fallback: async () => {
						res.setHeader("Cache-Control", "no-store");
						const { readControlUiRootAsset } = await import("./server-control-ui-root-D1heRHwn.mjs");
						const root = options.controlUiRoot;
						const body = (root && (root.kind === "bundled" || root.kind === "resolved") ? await readControlUiRootAsset(root, "social-card.png", true) : void 0)?.file.body;
						if (!body) {
							respondNotFound(res);
							return;
						}
						res.statusCode = 200;
						res.setHeader("Content-Type", "image/png");
						res.setHeader("Content-Length", body.byteLength);
						res.end(req.method === "HEAD" ? void 0 : body);
					}
				}
			});
			if (pathname !== controlUiSessionEntryPath(basePath)) return (await import("./control-ui-public-chat-D-8o68MU.mjs")).serveControlUiPublicChat({
				...params,
				basePath,
				projection,
				gate: publicGate(),
				serveApp
			});
			return (await import("./control-ui-session-entry-DhAWLZNt.mjs")).serveControlUiSessionEntry({
				...params,
				basePath,
				projection,
				serveApp
			});
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
		buildId: resolveRuntimeServiceBuildId(),
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
	if (status === "ready" && getReadiness || status === "startup") {
		const includeDetails = await shouldIncludeGatewayProbeDetails({
			req,
			resolvedAuth,
			trustedProxies,
			allowRealIpFallback,
			rateLimiter
		});
		const readiness = status === "ready" ? getReadiness : void 0;
		try {
			if (readiness) {
				const result = readiness();
				statusCode = result.ready ? 200 : 503;
				body = JSON.stringify(includeDetails ? result : { ready: result.ready });
			} else {
				const result = getStartup?.() ?? {
					ok: true,
					status: "started",
					uptimeMs: 0
				};
				statusCode = result.ok ? 200 : 503;
				body = startupProbeBody(result, includeDetails);
			}
		} catch {
			statusCode = 503;
			body = readiness ? JSON.stringify(includeDetails ? {
				ready: false,
				coreReady: false,
				failing: ["internal"],
				uptimeMs: 0
			} : { ready: false }) : startupProbeBody({
				ok: false,
				status: "starting",
				uptimeMs: 0,
				pendingReason: "internal"
			}, includeDetails);
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
//#region src/gateway/server-http-request.ts
/** Listener and service transports enter the same admission and route owner. */
function createGatewayHttpRequestHandler(opts) {
	const { clients, controlUiBasePath, controlUiRoot, handleHooksRequest, handlePluginRequest, shouldEnforcePluginGatewayAuth, resolvePluginNodeCapabilityRoute, resolvedAuth, rateLimiter, joinRateLimiter, getReadiness, getStartup } = opts;
	const getResolvedAuth = opts.getResolvedAuth ?? (() => resolvedAuth);
	const loadGatewayConfig = opts.getRuntimeConfig ?? readRuntimeConfig;
	const controlUiRouteBasePath = controlUiBasePath && controlUiBasePath !== "/" ? controlUiBasePath.replace(/\/$/, "") : "";
	const pluginAssetRoot = controlUiPluginAssetRoot(controlUiRouteBasePath);
	const publicSessionRoute = createControlUiSessionRoutes(opts);
	const handleServerRequest = (req, res, expectation) => {
		if (!getRemoteControlUiIngressContext(req)) markGatewayIngressTransport(req, opts.ingressTransport ?? { kind: "ordinary" });
		return runGatewayHttpRequest(req, res, opts.httpRequestLifetime, () => runWithDiagnosticTraceContext(createDiagnosticTraceContext(), () => runWithMainThreadTask("gateway:http", () => handleRequest(req, res, expectation)))).catch((error) => {
			console.error("[gateway-http] failed to finalize request:", error);
			if (!res.destroyed) res.destroy(error instanceof Error ? error : void 0);
		});
	};
	async function handleRequest(req, res, expectation) {
		const remoteIngress = getRemoteControlUiIngressContext(req);
		assertRemoteControlUiIngressCurrent(remoteIngress);
		if (getWebhookLegacyListener(req)) {
			try {
				if (!await handlePluginRequest?.(req, res) && !res.writableEnded && !res.destroyed) {
					res.writeHead(404);
					res.end();
				}
			} catch (error) {
				if (finishGatewayHttpAuthorityError(res, error)) return;
				console.error("[gateway-http] legacy plugin request failed:", error);
				res.destroy(error instanceof Error ? error : void 0);
				return "failed";
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
			const remoteRoute = remoteIngress ? resolveRemoteControlUiHttpRoute(req, controlUiRouteBasePath, remoteIngress.resolvePrincipal().scopes) : void 0;
			if (remoteIngress && !remoteRoute) {
				respondNotFound(res);
				return;
			}
			const probeKind = classifyGatewayProbePath(requestPath);
			if (probeKind === "live") {
				await handleGatewayProbeRequest(req, res, requestPath, resolvedAuth, [], false, rateLimiter, getReadiness, getStartup);
				return;
			}
			if (probeKind === "outside" || probeKind === "namespace") await opts.waitForRequestRuntime?.();
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
			const resolvedAuthValue = getResolvedAuth();
			if (!remoteIngress && (ingressAttribution.kind !== "unattributable-proxy" || isTrustedProxyAddress(ingressAttribution.remoteAddress, trustedProxies)) && await handleGatewayProbeRequest(req, res, scopedRequestPath, resolvedAuthValue, trustedProxies, allowRealIpFallback, rateLimiter, getReadiness, getStartup)) return;
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
			const requestStages = [];
			const addRequestStage = (enabled, stage, admitted = false, remoteOwner) => {
				if (enabled && (!remoteIngress || remoteOwner === remoteRoute)) requestStages.push(admitted ? () => runWithGatewayHttpWorkAdmission(res, stage) : stage);
			};
			const addAdmittedStage = (enabled, stage, remoteOwner) => addRequestStage(enabled, stage, true, remoteOwner);
			addRequestStage(classifyWorkerGatewayPath(scopedRequestPath) !== "outside", () => {
				respondNotFound(res);
				return true;
			});
			const transferRequest = {
				req,
				res,
				clientIp: ingressAttribution.rateLimit.subject.key,
				rateLimiter: joinRateLimiter
			};
			addAdmittedStage(scopedRequestPath.startsWith("/__openclaw__/native-hook"), async () => (await getNativeHookRelayModule()).handleNativeHookRelayHttpRequest(transferRequest));
			addAdmittedStage(classifyWorkerBootstrapArtifactTransferPath(scopedRequestPath) !== "outside", () => handleArtifactTransferHttpRequest({
				classifyPath: classifyWorkerBootstrapArtifactTransferPath,
				routePrefix: `${WORKER_BOOTSTRAP_ARTIFACT_TRANSFER_PATH}/artifacts/`,
				...transferRequest,
				callback: opts.handleWorkerBootstrapArtifactTransferRequest
			}));
			addAdmittedStage(classifyNodeWorkerBundleTransferPath(scopedRequestPath) !== "outside", () => handleArtifactTransferHttpRequest({
				classifyPath: classifyNodeWorkerBundleTransferPath,
				routePrefix: `${NODE_WORKER_BUNDLE_TRANSFER_PATH}/bundles/`,
				...transferRequest,
				callback: opts.handleNodeWorkerBundleTransferRequest
			}));
			addAdmittedStage(classifyNodeWorkspaceTransferPath(scopedRequestPath) !== "outside", () => handleNodeWorkspaceTransferHttpRequest({
				...transferRequest,
				callback: opts.handleNodeWorkspaceTransferRequest
			}));
			const devicePairingJoinShortcode = parseDevicePairingJoinRequestPath(scopedRequestPath);
			if (devicePairingJoinShortcode !== null) addAdmittedStage(true, async () => (await getDevicePairingJoinHttpModule()).handleDevicePairingJoinHttpRequest({
				...transferRequest,
				shortcode: devicePairingJoinShortcode
			}));
			addAdmittedStage(scopedRequestPath === PROVIDER_OAUTH_CALLBACK_PATH, () => handleProviderOAuthCallback(req, res));
			addAdmittedStage(scopedRequestPath.startsWith("/api/artifacts/download/") || controlUiRouteBasePath.length > 0 && scopedRequestPath.startsWith(`${controlUiRouteBasePath}/api/artifacts/download/`), async () => (await getArtifactDownloadsModule()).handleArtifactDownloadHttpRequest(req, res, {
				clients,
				basePath: controlUiRouteBasePath
			}), "artifact");
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
			addAdmittedStage(scopedRequestPath.startsWith("/__openclaw__/board/"), async () => (await getBoardHttpModule()).handleBoardHttpRequest(req, res, { resolveGatewayContext: opts.getGatewayRequestContext?.()?.resolveGatewayContext }), "board");
			addAdmittedStage(scopedRequestPath.startsWith(pluginAssetRoot), async () => {
				if (!controlUiEnabled) {
					respondNotFound(res);
					return true;
				}
				return await (await getControlUiPluginAssetsModule()).handleControlUiPluginAssetRequest(req, res, controlUiRouteOptions);
			}, "native-assets");
			for (const [parse, loadHandler] of CONTROL_UI_USER_IMAGE_HTTP_ROUTES) addAdmittedStage(parse(scopedRequestPath, controlUiRouteBasePath).matched, async () => (await loadHandler())(req, res, scopedRequestPath, {
				...routeAuth,
				basePath: controlUiRouteBasePath
			}), "resource");
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
			const publicSessionPath = publicSessionRoute.matches(scopedRequestPath, req.url);
			addRequestStage(!controlUiEnabled && publicSessionPath, () => publicSessionRoute.reject(res));
			addAdmittedStage(controlUiEnabled && publicSessionPath, () => publicSessionRoute.serve({
				...routeAuth,
				req,
				res,
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
			}), handleControlUiRequest, false, "document");
			const mcpAppRoute = classifyMcpAppStandalonePath(scopedRequestPath);
			addAdmittedStage(configSnapshot.mcp?.apps?.enabled === true && (mcpAppRoute === "shell" || mcpAppRoute === "view"), async () => {
				return await (await getMcpAppStandaloneModule()).handleMcpAppStandaloneHttpRequest(req, res, {
					sandboxPort: configSnapshot.mcp?.apps?.sandboxPort,
					sandboxOrigin: configSnapshot.mcp?.apps?.sandboxOrigin
				});
			});
			if (handlePluginRequest && (!remoteIngress || remoteRoute === "plugin-panel")) {
				let pluginAuthorization = null;
				requestStages.push(async () => {
					if (!remoteIngress && (!(shouldEnforcePluginGatewayAuth ?? shouldEnforceDefaultPluginGatewayAuth)(pluginPathContext) || (await getCachedPluginGatewayAuthBypassPaths(configSnapshot)).has(scopedRequestPath))) return false;
					const { authorizePluginGatewayHttpRequestOrReply } = await getHttpAuthUtilsModule();
					const { resolvePluginRouteRuntimeOperatorScopes } = await getPluginRouteRuntimeScopesModule();
					pluginAuthorization = await authorizePluginGatewayHttpRequestOrReply({
						req,
						res,
						...routeAuth,
						requestPath: scopedRequestPath,
						resolveOperatorScopes: resolvePluginRouteRuntimeOperatorScopes
					});
					return !pluginAuthorization;
				}, () => {
					if (pluginAuthorization?.requestAuth.hasCurrentClientAuthority?.() === false) {
						sendGatewayAuthFailure(res, {
							ok: false,
							reason: "unauthorized"
						});
						return true;
					}
					return handlePluginRequest(req, res, pluginPathContext, {
						gatewayAuthSatisfied: pluginAuthorization !== null,
						gatewayRequestAuth: pluginAuthorization?.requestAuth,
						gatewayRequestOperatorScopes: pluginAuthorization?.operatorScopes,
						gatewayRequestClientIp: requestClientIp
					});
				});
			}
			addRequestStage(focusDocument, handleStandaloneControlUiRequest, false, "document");
			addRequestStage(scopedRequestPath.startsWith("/api/chat/media/outgoing/") || controlUiRouteBasePath.length > 0 && scopedRequestPath.startsWith(`${controlUiRouteBasePath}/api/chat/media/outgoing/`), async () => (await getManagedMediaAttachmentsModule()).handleManagedOutgoingMediaHttpRequest(req, res, {
				...routeAuth,
				basePath: controlUiRouteBasePath
			}), false, "outgoing-media");
			for (const [routes, loadHandler] of CONTROL_UI_IMAGE_HTTP_ROUTES) addRequestStage(controlUiEnabled && routes.some((route) => parseControlUiResourcePath(route, scopedRequestPath, controlUiRouteBasePath).matched), async () => (await loadHandler())(req, res, {
				...controlUiRouteOptions,
				sessionRowProjectionOwner: opts.getGatewayRequestContext?.()?.sessionRowProjectionOwner
			}), false, "resource");
			addRequestStage(scopedRequestPath === resolveAssistantMediaRoutePath(controlUiBasePath), async () => (await loadControlUi())?.handleControlUiAssistantMediaRequest(req, res, {
				...controlUiRouteOptions,
				agentId: resolveAssistantAgentId(configSnapshot)
			}) ?? false, false, "assistant-media");
			addRequestStage(controlUiEnabled, async () => (await loadControlUi())?.handleControlUiAvatarRequest(req, res, controlUiRouteOptions) ?? false, false, "resource");
			addRequestStage(controlUiEnabled, handleControlUiRequest, false, "document");
			for (const stage of requestStages) {
				assertRemoteControlUiIngressCurrent(remoteIngress);
				if (await stage() || res.destroyed || res.writableEnded) return;
			}
			assertRemoteControlUiIngressCurrent(remoteIngress);
			if (opts.isStartupPluginRuntimeReady?.() === false) {
				res.setHeader("Cache-Control", "no-store");
				res.setHeader("Retry-After", "1");
				respondPlainText(res, 503, "Plugin runtime is starting");
				return;
			}
			respondNotFound(res);
			return;
		} catch (err) {
			if (finishGatewayHttpAuthorityError(res, err)) return;
			console.error("[gateway-http] unhandled error in request handler:", err);
			finishFailedGatewayHttpResponse(res);
			return "failed";
		}
	}
	return Object.assign(handleServerRequest, { dispose: () => publicSessionRoute.dispose() });
}
//#endregion
//#region src/gateway/server-http.ts
const requestHandlers = /* @__PURE__ */ new WeakMap();
function getGatewayHttpRequestHandler(server) {
	const handler = requestHandlers.get(server);
	if (!handler) throw new Error("Gateway HTTP owner is unavailable");
	return handler;
}
function createGatewayHttpServer(opts) {
	const handler = createGatewayHttpRequestHandler(opts);
	const server = opts.testListener ?? (opts.tlsOptions ? createServer$2(opts.tlsOptions) : createServer$1());
	requestHandlers.set(server, handler);
	server.on("request", (req, res) => void handler(req, res));
	server.once("close", () => handler.dispose());
	server.on("checkContinue", (req, res) => void handler(req, res, "continue"));
	server.on("checkExpectation", (req, res) => void handler(req, res, "reject"));
	server.on("connect", (req, socket) => {
		runHttpConnectionRequest(req, async () => {
			socket.destroy();
		}, "upgrade");
	});
	return server;
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
			const server = createServer$1();
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
const loadGatewayPluginsHttpModule = async () => await import("./plugins-http-ClHQ45E4.mjs");
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
		const { createGatewayHookDispatcher } = await import("./hooks-Dja0v6WM.mjs");
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
				const { createGatewayHooksRequestHandler } = await import("./hooks-Dja0v6WM.mjs");
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
		const { handleMcpOAuthCallback } = await import("./mcp-oauth-callback-CVg-Nde8.mjs");
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
	if (!isLoopbackHost(params.bindHost)) params.log.warn("⚠️  Gateway is binding to a non-loopback address. Configure authentication before exposing to public networks.");
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
	let controlUiUpgradeHandler;
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
			waitForRequestRuntime: params.waitForRequestRuntime,
			isStartupPluginRuntimeReady: params.isStartupPluginRuntimeReady,
			httpRequestLifetime: params.httpRequestLifetime,
			isTerminalEnabled: params.isTerminalEnabled,
			tlsOptions,
			ingressTransport,
			reportUnattributableProxy
		});
		const upgradeHandler = attachGatewayUpgradeHandler({
			httpServer,
			controlUiBasePath: params.controlUiBasePath,
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
			waitForRequestRuntime: params.waitForRequestRuntime,
			isStartupPending: params.isStartupPending,
			ingressTransport,
			reportUnattributableProxy
		});
		if (ingressTransport.kind === "ordinary") controlUiUpgradeHandler ??= upgradeHandler;
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
	if (params.getGatewayRequestContext && controlUiUpgradeHandler) {
		const gatewayLifetime = getGatewayContextLifetime(params.getGatewayRequestContext).signal;
		const requestLifetime = params.httpRequestLifetime?.requestEntryLifetime?.signal;
		bindGatewayControlUiIngressHost(params.getGatewayRequestContext, {
			resolveGatewayContext: params.getGatewayRequestContext,
			controlUiBasePath: params.controlUiBasePath,
			getResolvedAuth: params.getResolvedAuth,
			getRuntimeConfig: loadRuntimeConfig,
			handleRequest: getGatewayHttpRequestHandler(httpServer),
			handleUpgrade: controlUiUpgradeHandler,
			handleSandboxRequest: createSandboxHostHttpRequestHandler(resolvePluginRouteRegistry),
			signal: requestLifetime ? AbortSignal.any([gatewayLifetime, requestLifetime]) : gatewayLifetime
		});
	}
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
			params.onListening?.();
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
function assertAgentDatabaseConfiguration(cfg, agentId, paths, env) {
	const targets = resolveConfiguredAgentDatabaseTargets(cfg, {
		env,
		agentId
	});
	if (paths.some((pathname) => !isConfiguredAgentDatabaseTarget(targets, agentId, pathname))) throw new Error(`Agent ${agentId} database configuration changed during startup inspection`);
}
/** Finish only the deferred agent's preparation before its admission owner recovers it. */
function activateGatewayAgentDatabaseStartup(params) {
	const broker = getSpawnBroker();
	const createPreparationGuard = (agentId, paths, env, signal, assertCurrent) => {
		let cfg;
		return () => {
			signal.throwIfAborted();
			assertCurrent();
			if (!params.isCurrent()) throw new Error(`Agent ${agentId} startup preparation was superseded`);
			const currentConfig = params.getConfig();
			if (currentConfig !== cfg) {
				assertAgentDatabaseConfiguration(currentConfig, agentId, paths, env);
				cfg = currentConfig;
			}
		};
	};
	params.admission?.activate({
		isCurrent: params.isCurrent,
		preparationReady: params.preparationReady,
		openAgent: ({ agentId, paths, env, signal, assertCurrent }) => runWithSpawnBroker(broker, async () => {
			const { prepareOpenClawAgentDatabaseExecution } = await import("./openclaw-agent-execution-lyxyLljQ.mjs");
			const assertOpenCurrent = createPreparationGuard(agentId, paths, env, signal, assertCurrent);
			assertOpenCurrent();
			for (const pathname of paths) await prepareOpenClawAgentDatabaseExecution({
				agentId,
				path: pathname,
				env
			}, assertOpenCurrent, signal);
		}),
		migrateAgent: ({ agentId, paths, env, signal, assertCurrent }) => runWithSpawnBroker(broker, async () => {
			const { prepareGatewayStartupSessions } = await import("./server-startup-session-migration-Dge_JkbM.mjs");
			const assertMigrationCurrent = createPreparationGuard(agentId, paths, env, signal, assertCurrent);
			const databases = await prepareGatewayStartupSessions({
				cfg: params.getConfig(),
				env,
				agentIds: /* @__PURE__ */ new Set([agentId]),
				assertCurrent: assertMigrationCurrent,
				log: params.log
			});
			assertMigrationCurrent();
			return { maintain: () => runWithSpawnBroker(broker, async () => {
				await params.waitForPostReadyWork();
				const { runGatewaySessionStartupMaintenance } = await import("./server-startup-session-migration-Dge_JkbM.mjs");
				await runGatewaySessionStartupMaintenance({
					databases,
					signal,
					assertCurrent: createPreparationGuard(agentId, paths, env, signal, () => signal.throwIfAborted()),
					log: params.log
				});
			}) };
		}),
		publishAgent: ({ agentId, paths, env, signal, assertCurrent, phase }) => runWithSpawnBroker(broker, async () => {
			phase("secrets");
			const [{ refreshPreparedModelRuntimeSnapshots, getPreparedModelRuntimeSnapshot }, { listConfiguredOwnerInputs }, { getActiveSecretsRuntimeSnapshot, getActiveSecretsRuntimeSnapshotRevision, refreshActiveSecretsRuntimeSnapshotForConfig }] = await Promise.all([
				import("./prepared-model-runtime-Dd6wQg9H.mjs"),
				import("./prepared-model-runtime.configured-DA0Av3Vo.mjs"),
				import("./runtime-B_N0bpgX.mjs")
			]);
			assertCurrent();
			const beforeConfig = params.getConfig();
			assertAgentDatabaseConfiguration(beforeConfig, agentId, paths, env);
			if (!listAgentIds(beforeConfig).includes(agentId)) return;
			const previousSecretsRevision = getActiveSecretsRuntimeSnapshotRevision();
			const previousSecrets = getActiveSecretsRuntimeSnapshot();
			if (!previousSecrets || !await refreshActiveSecretsRuntimeSnapshotForConfig({
				sourceConfig: previousSecrets.sourceConfig,
				runtimeSourceConfig: getRuntimeConfigSourceSnapshot() ?? void 0,
				includeAuthStoreRefs: true,
				assertCurrent: () => {
					signal.throwIfAborted();
					assertCurrent();
					if (!params.isCurrent() || params.getConfig() !== beforeConfig || getActiveSecretsRuntimeSnapshotRevision() !== previousSecretsRevision) throw new AgentDatabaseStartupSupersededError(agentId, "secrets");
				}
			})) throw new Error(`Agent ${agentId} secrets preparation could not publish`);
			const cfg = params.getConfig();
			const secretsRevision = getActiveSecretsRuntimeSnapshotRevision();
			const secrets = getActiveSecretsRuntimeSnapshot();
			const authDatabasePath = resolveAuthProfileDatabasePath(resolveAgentDir(cfg, agentId, env));
			if (secretsRevision !== previousSecretsRevision + 1 || !secrets?.authStores.some((entry) => isSameOpenClawAgentDatabasePath(entry.databasePath, authDatabasePath))) throw new Error(`Agent ${agentId} secrets preparation has not published its auth store`);
			let preparedInput = void 0;
			const assertPreparationCurrent = () => {
				signal.throwIfAborted();
				assertCurrent();
				if (!params.isCurrent() || params.getConfig() !== cfg || getActiveSecretsRuntimeSnapshotRevision() !== secretsRevision) throw new AgentDatabaseStartupSupersededError(agentId, "startup");
				if (preparedInput && !getPreparedModelRuntimeSnapshot(preparedInput)) throw new Error(`Agent ${agentId} model preparation has not published`);
			};
			const agentIds = /* @__PURE__ */ new Set([agentId]);
			assertPreparationCurrent();
			phase("models");
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
	const { kernelRuntime: runtime, port, opts, log, logHealth, logWsControl, logHooks, logChannels, logCron, logReload } = params;
	const { minimalTestGateway, deps, runtimeState, kernel, startupTrace, broadcast, broadcastToConnIds, clients, sharedGatewaySessionGenerationState, workerEnvironmentService, workerPlacementRuntime, terminalLaunchPolicy, terminalSessions, nodeRegistry, nodeDesktopService, startChannel, stopChannel, getAttachedGatewayMethodRegistry, lifecycle, startupState, pluginRuntime, resolvePluginGatewayContext, gatewayTls, bindHost, getResolvedAuth, authRateLimiter, browserAuthRateLimiter, nodeReapprovalCoordinator, isGatewayStartupPending, attachedGatewayExtraHandlers, startListening, gatewayPluginConfigAtStart, startupActivationSourceConfig, defaultWorkspaceDir, coreGatewayMethodNames, pluginHostServices, baseMethods, startupPluginIds, pluginManifestRecords, pluginMetadataSnapshot, pluginLookUpTable, ambientEnvTriggers, prepareAttachedPluginRuntime, refreshAttachedGatewayDiscovery, wss, startChannels, broadcastPluginEvent, controlUiRootLifecycle, sidecarStartup, startEarlyRuntime, cfgAtStart, preauthConnectionBudget, releaseStartupAccountStarts, cronReconciliation, cronStartState, prepareReloadCandidate, configSnapshot, channelManager, activateRuntimeSecrets, applyFixedGatewayOverlays, resolveSharedGatewaySessionGenerationForConfig, stopRegisteredPostReadySidecars, registerPostReadySidecars, registerGatewayLifetimeSidecars, registerConnectionDependentSidecars, unregisterConnectionDependentSidecar, chatMetadataLifecycle, gatewayRequestContext, gatewayInstanceRuntime, getPluginMetadataSnapshot, getPluginNodeCapabilities } = runtime;
	const startupPluginRuntimeClaim = kernel.pluginRuntimeGeneration.currentClaim();
	const databaseStartupAdmission = getAgentDatabaseStartupAdmission();
	const databasePreparationReady = createDeferredCore();
	const getReadiness = runtime.createHttpTransportOptions().getReadiness;
	const { attachGatewayWsConnectionHandler } = await startupTrace.measure("gateway.ws-imports", () => import("./ws-connection-CiRNWTJA.mjs"));
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
		bootId: params.bootId,
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
	startupTrace.mark("http.bound");
	const requestRuntimeReady = runtime.ensureRequestRuntimeReady().then(async () => {
		flushDiagnosticsTimeline();
		kernel.setDispatchReady(true);
		if (!minimalTestGateway && !opts.updateCanary) {
			const { startOpenClawDatabaseIntegrityVerifier } = await import("./openclaw-database-verify-Bsajqf-4.mjs");
			registerGatewayLifetimeSidecars(startOpenClawDatabaseIntegrityVerifier({ env: process.env }));
		}
		if (databaseStartupAdmission && !opts.updateCanary && !lifecycle.closePreludeStarted) activateGatewayAgentDatabaseStartup({
			admission: databaseStartupAdmission,
			preparationReady: databasePreparationReady.promise,
			waitForPostReadyWork: params.waitForPostReadyWork,
			getConfig: readRuntimeConfig,
			getPluginRegistry: () => pluginRuntime.registry,
			getPluginMetadataSnapshot,
			isCurrent: () => !lifecycle.closePreludeStarted,
			log
		});
	});
	const earlyRuntimeReady = startEarlyRuntime();
	await Promise.allSettled([requestRuntimeReady, earlyRuntimeReady]);
	await requestRuntimeReady;
	const earlyRuntime = await earlyRuntimeReady;
	const sessionDeliveryRecoveryMaxEnqueuedAt = Date.now();
	let postAttachRuntimeReturned = false;
	let scheduledServicesActivated = false;
	const activateScheduledServicesWhenReady = () => {
		if (opts.updateCanary || lifecycle.closePreludeStarted || !postAttachRuntimeReturned || !startupState.sidecarsReady || scheduledServicesActivated) return;
		scheduledServicesActivated = true;
		import("./server-runtime-services-BXWf17hm.mjs").then((gatewayRuntimeServices) => {
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
	const { startGatewayActiveWork } = await startupTrace.measure("gateway.active-work-import", () => import("./server-work-metrics-BLgNEEEK.mjs"));
	const activeWorkInspectors = startGatewayActiveWork(runtime, log);
	const trackStartupWork = (run) => {
		const operation = Promise.resolve().then(() => run(runtime.connectionWork.signal));
		return runtime.connectionWork.track(() => operation);
	};
	let postAttachSpanSettled = false;
	let postAttachSidecarsReady = false;
	const postAttachHandles = await trackStartupWork(() => startupTrace.measure("runtime.post-attach", () => import("./server-startup-post-attach-SvJIJgC-.mjs").then(({ startGatewayPostAttachRuntime }) => startGatewayPostAttachRuntime({
		scheduler: runtime.scheduler,
		minimalTestGateway,
		updateCanary: opts.updateCanary,
		cfgAtStart,
		getConfig: readRuntimeConfig,
		port,
		log,
		isNixMode,
		startupStartedAt: opts.startupStartedAt,
		broadcastToConnIds,
		broadcast,
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
			const { loadGatewayStartupPluginRuntime } = await import("./server-startup-plugins-CKrPrccB.mjs");
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
		onChannelsStarted: releaseStartupAccountStarts,
		onPluginServices: (pluginServices) => kernel.pluginRuntimeGeneration.publishServices(startupPluginRuntimeClaim, pluginServices),
		onPostReadySidecars: registerPostReadySidecars,
		onGatewayLifetimeSidecars: registerGatewayLifetimeSidecars,
		trackStartupWork,
		unregisterConnectionDependentSidecar,
		...workerPlacementRuntime ? { startWorkerEnvironmentRuntime: async () => {
			if (lifecycle.closePreludeStarted) return null;
			databasePreparationReady.resolve();
			return await workerPlacementRuntime.startRuntime({
				isClosePreludeStarted: () => lifecycle.closePreludeStarted,
				registerSidecar: registerConnectionDependentSidecars,
				unregisterSidecar: unregisterConnectionDependentSidecar
			});
		} } : {},
		onSidecarsReady: () => {
			postAttachSidecarsReady = true;
			if (sidecarStartup === "defer" || postAttachSpanSettled) kernel.markSidecarsReady();
			databasePreparationReady.resolve();
			activateScheduledServicesWhenReady();
		},
		getReadiness,
		isClosing: () => lifecycle.closePreludeStarted,
		startupTrace,
		sidecarStartup,
		waitForPostReadyWork: params.waitForPostReadyWork,
		activeWorkInspectors
	}))));
	flushDiagnosticsTimeline();
	postAttachSpanSettled = true;
	startupState.postAttachSettled = true;
	if (postAttachSidecarsReady && sidecarStartup !== "defer") kernel.markSidecarsReady();
	kernel.setPostAttachHandles(postAttachHandles);
	if (minimalTestGateway) databasePreparationReady.resolve();
	startupTrace.detail("memory.ready", [...collectGatewayProcessMemoryUsageMb(), ...minimalTestGateway ? [] : await startupTrace.measure("runtime.worker-pool-metrics", collectGatewayWorkerPoolMetrics)]);
	if (getReadiness().ready) {
		startupTrace.mark("ready");
		logGatewayReady({
			getReadiness,
			log
		}, opts.updateCanary ? "candidate gateway ready; autonomous sidecars suppressed" : void 0);
	}
	finishGatewayRestartTrace("restart.ready", collectGatewayProcessMemoryUsageMb());
	if (opts.updateCanary) return { startupSettled: postAttachHandles.startupSettled };
	postAttachRuntimeReturned = true;
	activateScheduledServicesWhenReady();
	const { startManagedGatewayConfigReloader } = await import("./server-reload-managed-BsrXF0AT.mjs");
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
				const previousConfig = readRuntimeConfig();
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
						const { listControlUiPluginCatalog } = await import("./control-ui-plugin-assets-Bg3Uwvw2.mjs");
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
		const gatewayRuntimeServices = await import("./server-runtime-services-BXWf17hm.mjs");
		gatewayRuntimeServices.scheduleGatewayPostReadyMaintenance({
			scheduler: runtime.scheduler,
			signal: runtime.connectionWork.signal,
			delayMs: POST_READY_MAINTENANCE_DELAY_MS,
			isClosing: () => lifecycle.closePreludeStarted,
			waitForPostReadyWork: params.waitForPostReadyWork,
			startupMaintenance: runtime,
			startMaintenance: () => earlyRuntime.startMaintenance(activeWorkInspectors, resolvePluginGatewayContext),
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
			repeatDelayMs: 36e5,
			isClosing: () => lifecycle.closePreludeStarted,
			isBusy: () => getActiveGatewayRootWorkCount({ excludeCurrent: true }) > 0,
			run: async () => {
				await params.waitForPostReadyWork();
				const { cleanupGatewayRetiredPluginArtifacts } = await import("./server-retained-plugin-cleanup-BpBB4al4.mjs");
				await cleanupGatewayRetiredPluginArtifacts({
					log,
					startupInstallPaths,
					startupConfig: cfgAtStart,
					signal: runtime.connectionWork.signal,
					assertCurrent: () => {
						if (lifecycle.closePreludeStarted) throw runtime.connectionWork.signal.reason ?? /* @__PURE__ */ new Error("Gateway is closing");
					}
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
				const { reclaimAbandonedSqliteSnapshotsAsync } = await import("./sqlite-snapshot-reclamation-B5K9hTIZ.mjs");
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
		deferRequestRuntime: true,
		sdkResourceHost
	});
	bumpSkillsSnapshotVersion({ reason: "manual" });
	if (!gatewayKernel.minimalTestGateway) beginMacOSSystemCaWarmupOnce({ log });
	let startupSettled;
	let tailscaleStopping;
	let stopStartingTailscale;
	const { closeOnStartupFailure, prepareClose, terminalSessions, shutdownRuntime } = gatewayKernel;
	try {
		const transport = await createGatewayHttpTransport({
			...gatewayKernel.createHttpTransportOptions(),
			httpRequestLifetime: gatewayKernel.gatewayRequestContext,
			waitForRequestRuntime: gatewayKernel.ensureRequestRuntimeReady,
			updateCanary: opts.updateCanary,
			onListening: opts.gatewayStateOwner?.markListening,
			...!gatewayKernel.minimalTestGateway && gatewayKernel.tailscaleMode !== "off" ? { prepareManagedTailscaleIngress: async (backend) => {
				const { startGatewayTailscaleExposure } = await import("./server-tailscale-B7pL4A17.mjs");
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
				const preparedClose = prepareClose(optsLocal);
				releasePostReadyWork();
				await runGatewayCloseSteps({
					owner: gatewayKernel,
					close: await preparedClose,
					disposeTerminalSessions: () => terminalSessions.disposeAll(),
					runStopHooks: async () => {
						await shutdownRuntime.runGlobalGatewayStopSafely({
							registry: gatewayKernel.pluginRuntime.registry,
							event: { reason: optsLocal?.reason ?? "gateway stopping" },
							ctx: { port },
							onError: (error) => log.warn(`gateway_stop hook failed: ${formatErrorMessage$1(error)}`)
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
