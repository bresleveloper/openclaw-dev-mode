import { g as isFutureDateTimestampMs, j as resolveIntegerOption, w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as AsyncWorkScope } from "./async-work-scope-CWk2dk1h.mjs";
import { d as getPluginMetadataSnapshotCache } from "./plugin-cache-A1nT2dqa.mjs";
import "./src-CZ2wJvNB.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { n as hasRetainedPluginRuntimeCloseError } from "./runtime-close-error-CYO2S35x.mjs";
import { i as getGatewayContextLifetime, t as bindGatewayContextResolver } from "./gateway-context-binding-VqB7gkMe.mjs";
import { l as withPluginRuntimeRegistryScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { n as bindLegacyPluginSdkResourceHost, t as LegacyPluginSdkResourceHost } from "./legacy-sdk-resource-host-Bm9V3G-F.mjs";
import { n as createLazyPromise, r as createLazyPromiseLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { n as createLazyRuntimeMethodBinder, r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { n as isVitestRuntimeEnv } from "./test-runtime-env-mVzBKwSd.mjs";
import { n as isTruthyEnvValue, r as logAcceptedEnvOption } from "./env-C4a8LL2I.mjs";
import { Fn as object, Jn as string, Nt as array, Pn as number, nr as tuple } from "./schemas-BOYIvvln.mjs";
import { x as captureConfigOverrideApplier } from "./io.snapshot-BXuGbHpS.mjs";
import { h as sleep } from "./utils-aKqR_F_U.mjs";
import { n as isErrno } from "./errno-CkbDOfLk.mjs";
import { a as isWithinDir } from "./path-safety-0BfxAYBQ.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { O as listAgentIds, a as resolveAgentDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { E as resolveStateDir, b as resolveIsConfigReadOnly, l as isNixMode, u as normalizeStateDirEnv } from "./paths-DehQwyE0.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CUi_tcgF.mjs";
import { a as isControlUiApprovalDocumentPath, i as classifyControlUiRequest, n as resolveControlUiShareOrigin, o as isControlUiFocusDocumentPath, s as isControlUiPluginManagerRequest, t as isControlUiSharePath } from "./control-ui-share-CXVEqSAo.mjs";
import { i as buildControlUiSessionPath } from "./src-Da9425In.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { c as isSecretRef } from "./ref-contract-BVi3ykLT.mjs";
import "./types.secrets-B5xWSzLp.mjs";
import { i as copyConfigResolutionFactsExcept, r as copyConfigResolutionFacts } from "./resolution-facts-CSuKIPux.mjs";
import { t as getPluginInstance } from "./plugin-instance-scope-C9hxyH_A.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { G as hasInternalDiagnosticEventInterest, N as runWithDiagnosticTraceContext, a as emitInternalDiagnosticEvent, f as isDiagnosticsEnabled, t as areDiagnosticsEnabledForProcess, w as createDiagnosticTraceContext, y as setDiagnosticsEnabledForProcess } from "./diagnostic-events-CVabF32H.mjs";
import { t as applyLoggingConfig } from "./logger--ALOusOG.mjs";
import { r as runtimeForLogger, t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { l as resolveRuntimeServiceVersion, s as resolveRuntimeServiceBuildId } from "./version-BkM1aB4w.mjs";
import { d as prepareConfigRuntimeEnv, l as initializePublishedConfigRuntimeEnv, r as collectConfigRuntimeEnvOwnership } from "./config-env-vars-BHI12YH5.mjs";
import { i as getNodeSqliteKysely, l as sqliteStringSet, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { i as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { r as sha256HexPrefixCore } from "./node-crypto-Df3MIs6V.mjs";
import "./crypto-digest-D9Nqq3c7.mjs";
import { n as runWithSpawnBroker, t as getSpawnBroker } from "./context-5XyHo0If.mjs";
import { f as withSqliteReadOnlyWorkerScope } from "./sqlite-readonly-worker-CmkAsqCm.mjs";
import { t as copyFileHandle } from "./file-descriptor-C_0BsNDD.mjs";
import { p as openClawStateDatabaseCache } from "./openclaw-state-db-cache-Ci98mtX8.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { M as resolveDatabasePath } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import { o as assertOpenClawStateWriteAllowedAtPath } from "./openclaw-state-ownership-OLtsPpqu.mjs";
import { a as withArtifactPreservingStateReads, u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { n as getTrackedWorkerCpuSources } from "./worker-cpu-C_lnSdJe.mjs";
import { i as getGatewayPluginMetadataSnapshot, s as selectCurrentPluginMetadataCache } from "./current-plugin-metadata-state-CVuZDJ9_.mjs";
import { n as registerPluginMetadataProcessMemoLifecycleClear, r as retainGatewayPluginMetadata } from "./plugin-metadata-lifecycle-DtesR9-z.mjs";
import { c as setGatewayPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-BU2mC0-C.mjs";
import { n as ensureControlUiAllowedOriginsForNonLoopbackBind } from "./gateway-control-ui-origins-Cyu8k-XJ.mjs";
import { D as setAppliedRuntimeConfigSnapshot, s as getRuntimeConfigSnapshot, u as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-DbgWcCyV.mjs";
import { t as sessionChanges } from "./session-row-changes-xuu0eHng.mjs";
import { c as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BFK9cMiV.mjs";
import { c as sha256File } from "./directory-durability-BKe2aOQN.mjs";
import { a as hashConfigRaw, v as assertGatewayConfigEnvSelectionUnchanged } from "./io.read-helpers-N26RjV2V.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import { t as _usingCtx } from "./usingCtx-CoYZqMqE.mjs";
import { c as portalIngressConflictsWithOrigin, s as isValidPortalIngressDomain } from "./zod-schema-B-u3AXjg.mjs";
import { a as READ_SCOPE, c as TALK_SCOPE, i as QUESTIONS_SCOPE, n as APPROVALS_SCOPE, r as PAIRING_SCOPE, t as ADMIN_SCOPE } from "./operator-scopes-D-CL26h0.mjs";
import { a as hasGatewayClientCap, t as GATEWAY_CLIENT_CAPS } from "./client-info-B_ICKCYw.mjs";
import { n as captureRemoteModelCatalogStartupSnapshot } from "./model-catalog-BFaZ221R.mjs";
import { a as promoteConfigSnapshotToLastKnownGood, d as readConfigFileSnapshotWithPluginMetadata, l as readConfigFileSnapshotForRuntimeTransaction, r as getRuntimeConfig, y as registerConfigWriteListener } from "./io.runtime-BN-rPaec.mjs";
import "./io-DuIKUcsW.mjs";
import "./config-Ciq2mxdN.mjs";
import { n as GatewayLockError } from "./gateway-lock-CYjRlApN.mjs";
import { o as purgeExpiredSecretStoreEntries } from "./secret-store-BjhT4Kcc.mjs";
import { t as isContainerEnvironment } from "./container-environment-CNsJSTpY.mjs";
import { _ as resolveGatewayListenHosts, r as isLocalDirectRequest, s as isLoopbackHost, y as resolveHostName } from "./net-DU4aWKLv.mjs";
import { f as buildRateLimitIdentityKey, p as createAuthRateLimiter, s as AUTH_RATE_LIMIT_SCOPE_NODE_REAPPROVAL, u as AUTH_RATE_LIMIT_SCOPE_WORKER_ADMISSION } from "./auth-rate-limit-DuWYneOU.mjs";
import { n as claimTailscaleServePort, s as readTailscaleWhoisIdentity } from "./tailscale-BRIsmHIP.mjs";
import { a as prepareGatewayIngressAttribution, i as markGatewayIngressTransport, n as PROXY_ATTRIBUTION_REQUIRED_REASON, o as readPreparedGatewayIngressAttribution, r as createGatewayUnattributableProxyReporter, t as PROXY_ATTRIBUTION_GUIDANCE } from "./ingress-attribution-C5e071om.mjs";
import { n as resolveGatewayAuth } from "./auth-resolve-BeCTtDNQ.mjs";
import { r as authorizeHttpGatewayConnect } from "./auth-CRxiLJL8.mjs";
import { t as isBrowserCopilotClient } from "./message-channel-DDcHHhpX.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { a as roleScopesAllow, n as operatorScopeSatisfied } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { t as resolveGatewayPublicOrigin } from "./gateway-public-origin-BcHLka2A.mjs";
import { n as resolveControlUiWebPushUrl, t as normalizeControlUiBasePath } from "./control-ui-shared-DqFhbHR8.mjs";
import { n as loadGatewayTlsServerRuntime } from "./gateway-DTjFIb6X.mjs";
import { n as WebSocketServer } from "./websocket-CGHaToS5.mjs";
import { d as createCoreGatewayMethodDescriptors, f as isCoreGatewayMethodClassified, h as listCoreGatewayMethodNames, u as STARTUP_UNAVAILABLE_GATEWAY_METHODS } from "./method-scopes-C7g7eSZh.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import "./sessions-KsldKmtI.mjs";
import { n as isRestartEnabled } from "./commands.flags-BNJlVVgU.mjs";
import { i as runHttpConnectionRequest } from "./http-request-lifecycle-JdoSg2uH.mjs";
import { r as readGatewayRestartHandoffSync } from "./restart-handoff-Cb-qLJTf.mjs";
import { t as resolveAdvertisedLanHostCore } from "./advertised-lan-host-Dt_Dr31t.mjs";
import { a as getActiveGatewayRootWorkCount, c as getGatewaySuspendAdmissionPhase, f as isGatewayWorkAdmissionClosed, s as getGatewayRestartDrainSignal, u as isGatewayRestartDraining, y as runOutsideGatewayRootWorkAdmission } from "./gateway-work-admission-CHv_0noy.mjs";
import { a as isPackageProvenControlUiRootSync, c as resolveControlUiRootOverrideSync, i as inspectControlUiRootAssets, l as resolveControlUiRootSync, n as ensureControlUiAssetsBuilt } from "./control-ui-assets-C3-n9r4b.mjs";
import { a as capturePluginRegistryLifecycleEpoch, p as isPluginRegistryLifecycleEpochActive } from "./registry-lifecycle-BhTDZAHB.mjs";
import { a as createPluginRegistryOwner } from "./runtime-BvdPUus5.mjs";
import { a as listLoadedChannelPluginsForRegistry } from "./registry-loaded-CYq2sa_C.mjs";
import { a as runWithProcessCleanupBudget, i as getProcessCleanupBudget } from "./child-WoujtRwa.mjs";
import { i as tryLoadActivatedBundledPluginPublicSurfaceModule } from "./facade-runtime-CSNstsFk.mjs";
import { l as listAgentDatabaseAdmissionRefusals, p as withAgentDatabasePreparationGuard, r as canIsolateAgentDatabase } from "./agent-database-admission-BFwcs62N.mjs";
import { r as isSameOpenClawAgentDatabasePath } from "./openclaw-agent-db-registry-CCrn1pMl.mjs";
import { h as resolveAuthProfileDatabasePath } from "./sqlite-BIg_k8qE.mjs";
import { B as readUserProfileVersion, N as onUserProfilesChanged } from "./user-profiles-internal-BxQLnWfo.mjs";
import { s as withSystemEventOwner } from "./system-event-ownership-CHVGbaAW.mjs";
import { c as resolveSystemMainSessionTarget } from "./main-session-De-bcoks.mjs";
import { i as enqueueSystemEvent } from "./system-events-ANKIkU0W.mjs";
import { i as clearSecretsRuntimeSnapshotState, o as getActiveSecretsRuntimeConfigSnapshot } from "./runtime-state-CtZtwiOt.mjs";
import { i as decodeSandboxHostCsp, n as buildSandboxHostDocument, o as resolveSandboxHostPort } from "./sandbox-host-BqeXhFy-.mjs";
import { a as classifyMcpAppStandalonePath, c as classifyWorkerBootstrapArtifactTransferPath, i as classifyGatewayProbePath, l as classifyWorkerGatewayPath, o as classifyNodeWorkerBundleTransferPath, s as classifyNodeWorkspaceTransferPath } from "./gateway-http-route-contracts-jBtizxKU.mjs";
import { m as readUserProfileDirectory, s as resolveUserProfileId } from "./user-profiles-BA6bh7Le.mjs";
import { g as resolveOperatorSessionCreation, n as authorizeGatewaySessionCreation, p as resolveOperatorRolePolicyForProfile } from "./operator-role-policy-BNrKHiJ3.mjs";
import { r as GatewayOperatorAccessUnavailableError } from "./operator-access-policy-Dh1MoHMy.mjs";
import { r as closePreparedModelRuntimeSnapshots } from "./prepared-model-runtime.lifecycle-348wygR7.mjs";
import { r as onSessionIdentityMutation } from "./session-lifecycle-events-DiXxneBV.mjs";
import { s as resolveConfiguredAgentDatabaseTargets } from "./targets-Dmb8-YXN.mjs";
import { t as getAgentDatabaseStartupAdmission } from "./agent-database-startup-A1bI1F7Q.mjs";
import { s as isTranscriptOnlyOpenClawAssistantMessage } from "./transcript-only-openclaw-assistant-CVgy4bjA.mjs";
import { C as publishSystemEventStoreConfig } from "./session-accessor.sqlite-entry-BB2Zsfho.mjs";
import { K as updateSessionProfileInvolvement } from "./session-accessor-l-4ZHvKn.mjs";
import { i as MAX_BUFFERED_BYTES, o as MAX_PREAUTH_PAYLOAD_BYTES } from "./server-constants-Dx_kHnY5.mjs";
import { i as resolveSessionEventAgentScope, n as resolveRequestedSessionAgentId } from "./session-request-agent-DN7PUqhR.mjs";
import { o as createAgentRunRestartAbortError } from "./run-termination-Cd1iJzC7.mjs";
import { m as stopDiagnosticHeartbeat, p as startDiagnosticHeartbeat } from "./diagnostic-CT1lx7JC.mjs";
import { n as resolveCronJobsStorePathFromConfig } from "./paths-Bz2goYfd.mjs";
import "./store-CV1wrdMb.mjs";
import { i as resolveActiveEmbeddedRunSessionId, t as getActiveEmbeddedRunCount } from "./active-run-projections-BHX_SDCX.mjs";
import { d as setGatewayRestartPolicy, f as setPreRestartDeferralCheck } from "./restart-Bb4QxGMO.mjs";
import { c as getActiveBackgroundExecSessionCount } from "./bash-process-registry-CkYBcnWR.mjs";
import { t as getTotalPendingReplies } from "./dispatcher-registry-BAhstaE7.mjs";
import { s as getActiveCronJobCount } from "./active-jobs-BdNx3YyC.mjs";
import { s as getTotalQueueSize, u as isGatewayDraining } from "./command-queue-CaY517ob.mjs";
import "./sessions-DE4llkPV.mjs";
import { n as fenceSessionSuspensionWritesForGatewayShutdown } from "./session-suspension-DbQ3XvjC.mjs";
import { t as createAgentRuntimeApprovalAuthorityValidator } from "./agent-runtime-identity-token-C6L1CTtM.mjs";
import { i as retireQuestionChannelGateway } from "./question-channel-runtime-iX-d9p2G.mjs";
import { i as withCoreCanvasNodeCapability, n as isCanvasDocumentHttpPath, r as resolveCanvasNodeCapability } from "./constants-Cm4bJJ1Q.mjs";
import { d as resumeGatewayRestartTraceFromHandoff, i as finishGatewayRestartTrace, n as collectGatewayProcessMemoryUsageMb, u as resumeGatewayRestartTraceFromEnv } from "./restart-trace-CoBpLImx.mjs";
import { r as waitForMediaCleanupDrains, t as MEDIA_CLEANUP_STOP_TIMEOUT_MS } from "./server-media-cleanup-lifecycle-FrwOsNwk.mjs";
import { i as upsertPresence } from "./system-presence-BhyW53Ym.mjs";
import { a as createSessionMessageSubscriberRegistry, i as createSessionEventSubscriberRegistry, r as createChatRunState } from "./server-chat-state-DfVYc1CX.mjs";
import { a as rethrowGatewayStartupError, i as resolveGatewayShutdownNotice, o as runGatewayCloseSteps } from "./server-shutdown-D6UXm04-.mjs";
import { r as closeGatewayDeviceRevocation } from "./device-revocation-BMta3qGW.mjs";
import { t as SharedGatewaySessionGenerationState } from "./server-shared-auth-generation-aNODWb-9.mjs";
import "./node-desktop-stream-BZM2AiRA.mjs";
import { n as deriveSessionTitle } from "./session-utils-core-CcjzbK1i.mjs";
import { a as resolveAssistantAgentId } from "./assistant-avatar-D6yA4rZS.mjs";
import { a as parseControlUiUserAvatarPath, i as parseControlUiResourcePath, o as resolveAssistantMediaRoutePath } from "./control-ui-resource-routes-DVy_LnYu.mjs";
import "./control-ui-contract-Dup6xL62.mjs";
import { t as flattenMarkdownToPlainText } from "./markdown-plain-text-BIBtRgN0.mjs";
import { p as resolveCurrentUserProfileDisplay } from "./session-identity-projection-Bz5hvxHJ.mjs";
import { D as prepareProjectedSessionSharing, J as resolveSessionVisibility, K as resolveSessionSharingTarget, O as prepareSessionSharing, T as createProfileSessionEntryFilter, U as isSessionVisibilityAllowed, Z as authenticatedProfileUnavailableError, w as canReceiveSessionEvent } from "./session-sharing-C4w_but1.mjs";
import { i as resolveVisibleActiveSessionRunState } from "./session-active-runs-KvOWXexj.mjs";
import { i as prepareProjectedSessionPresentation } from "./session-list-read-result-Dqt3tLkp.mjs";
import { t as bumpSkillsSnapshotVersion } from "./refresh-state-NJJr9z6k.mjs";
import { r as prepareGatewayAgentCliShim, t as clearGatewayAgentCliShim } from "./openclaw-cli-shim-BjJciFCe.mjs";
import { t as isCoreCanvasHostEnabled } from "./config-VMD9Rb60.mjs";
import { n as installActiveGitHubOAuthLifecycle, t as createGitHubOAuthLifecycle } from "./github-oauth-lifecycle-B8jl-6oa.mjs";
import { c as removeRemoteNodeInfoForConnection, i as recordRemoteNodeInfo, s as removeRemoteNodeInfo } from "./remote-CsUTQjKZ.mjs";
import { f as requestNodePairing, p as reusePendingNodePairingForReconnect, r as finalizeNodePairingCleanupClaim } from "./device-pairing-node-DvH1kI0G.mjs";
import { t as ensureOpenClawCliOnPath } from "./path-env-j7HKgcii.mjs";
import { t as createLoopbackConnectOptions } from "./loopback-connect-VxGMocyw.mjs";
import { t as createDefaultDeps } from "./deps-BNm1BD0Q.mjs";
import { t as createCronExecutionId } from "./run-id-kGde0n7U.mjs";
import { n as logRejectedLargePayload } from "./diagnostic-payload-CxhAhghE.mjs";
import { f as waitForNodeWorkerSupervisor } from "./node-registry-private-DQxtvo06.mjs";
import { t as closeGatewayTransportWithGrace } from "./connection-transport-close-KmUFxJkO.mjs";
import { n as readPreparedServerMethodModelCatalogs } from "./optional-model-catalog-B-pbmxbf.mjs";
import { r as registerGatewayModelCatalogPrivateAccess } from "./server-model-catalog-auth-d5Ty5VGR.mjs";
import { c as normalizePluginNodeCapabilityScopedUrl, d as reconcileClientPluginNodeCapabilities, o as indexPluginNodeCapabilitySurfaces } from "./plugin-node-capability-BUbmEXwy.mjs";
import { n as mergeGatewayAuthConfig } from "./startup-auth-Cnh-psTn.mjs";
import { t as rejectWebSocketUpgrade } from "./websocket-upgrade-reject-D2Ac4nen.mjs";
import { t as getTailscalePublishedOrigin } from "./tailscale-published-origin-BvNdSLZR.mjs";
import { i as handleProviderOAuthCallback, t as PROVIDER_OAUTH_CALLBACK_PATH } from "./provider-browser-auth-pWTijt25.mjs";
import { t as adoptPluginHttpRouteHandoffs } from "./http-registry-fCJWQGrb.mjs";
import { u as revokeAttachGrantsForSession } from "./mcp-grant-store-C4TWuDzs.mjs";
import { n as controlUiPluginAssetRoot } from "./control-ui-plugin-assets-contract-BEmf5f0r.mjs";
import { a as resolvePluginRoutePathContext, i as isProtectedPluginRoutePathFromContext, t as findMatchingPluginHttpRoutes } from "./route-match-3ODu6iRN.mjs";
import { n as logWs, r as summarizeAgentEventForWsLog } from "./ws-log-DGu5Y--9.mjs";
import { b as respondPlainText, n as finishFailedGatewayHttpResponse, o as sendGatewayAuthFailure, p as setDefaultSecurityHeaders, r as isWebSocketUpgradeRequest, y as respondNotFound } from "./http-common-Ckbyca3h.mjs";
import { t as resolveSharedGatewaySessionGeneration } from "./ws-shared-generation-DTv5-s0n.mjs";
import { r as listConfigReloadRefinementPrefixes, s as diffGatewayReloadPaths, t as buildGatewayReloadPlan } from "./config-reload-plan-CGQS_zJR.mjs";
import { n as parseDevicePairingJoinRequestPath } from "./join-code-B_OfdZ-j.mjs";
import { t as assertGatewayRuntimeSecurityConfig } from "./server-runtime-config-C3kC9wFW.mjs";
import { _ as resolveEffectiveWebPushPreferences, f as WEB_PUSH_USER_PREFERENCES_KEY, h as normalizeWebPushDisplayLabel, p as isWebPushQuietHours, v as webPushAgentAllowed, y as webPushCategoryEnabled } from "./push-web-store.records-B7ppsd_i.mjs";
import { n as DEFAULT_CHANNEL_STALE_EVENT_THRESHOLD_MS, r as evaluateChannelHealth, t as DEFAULT_CHANNEL_CONNECT_GRACE_MS } from "./channel-health-policy-DnqLKLPL.mjs";
import { r as queuePluginSessionsChanged } from "./gateway-events-DP7ZxbjB.mjs";
import { t as buildGatewaySessionSnapshot } from "./session-event-payload-ErYjRK47.mjs";
import { t as attachSessionChangeEventLifetime } from "./session-change-event-DF8JnIsM.mjs";
import { n as createGatewayMethodRegistry, r as createPluginGatewayMethodDescriptors, t as createGatewayMethodDescriptorsFromHandlers } from "./registry-Cb2RFYbY.mjs";
import "./artifact-download-CXaDlLGk.mjs";
import { n as buildControlUiPublicSessionSharePath, r as parseControlUiPublicSessionShareUrl } from "./public-share-D2nZ1_dA.mjs";
import { t as isTerminalConfigEnabled } from "./enabled-BSjeiWpO.mjs";
import { n as resolveGatewayReloadPluginActivationCandidate, t as mergeActivationSectionsIntoRuntimeConfig } from "./plugin-activation-runtime-config-8zX3nnmq.mjs";
import { r as prepareWebPushNotificationSender, s as hasBoundWebPushSubscriptions } from "./push-web-B4o-WWaK.mjs";
import { n as getUserPreferences } from "./user-preferences-DdrP3G5o.mjs";
import { n as webPushTargetClient, r as withCurrentWebPushAuthority, t as listCurrentWebPushTargets } from "./web-push-authority-JoSk0kBN.mjs";
import { i as GATEWAY_EVENT_UPDATE_RUN_CHANGED, n as GATEWAY_EVENT_NODE_RUNNER_INVENTORY_CHANGED, t as GATEWAY_EVENT_DEVICE_PAIR_CHANGED } from "./events-J-3spXBQ.mjs";
import { t as createPresenceRecipientProjection } from "./presence-projection-vr_caGIS.mjs";
import { a as incrementPresenceVersion, i as getPresenceVersion, o as refreshGatewayHealthSnapshot, r as getHealthVersion } from "./health-state-D3F_eTYn.mjs";
import { t as collectGatewayWorkerPoolMetrics } from "./process-vitals-B7HHDUI0.mjs";
import { r as createModelAccountConnectService } from "./model-account-connect-CMUHZZob.mjs";
import { i as prepareControlUiSessionPrRead, t as createControlUiSessionPullRequestSubscriptions } from "./control-ui-session-pr-subscriptions-BdxJwHLd.mjs";
import { i as clearNodeWakeState } from "./node-wake-state-CWVR-GCk.mjs";
import { t as resolveGrantExpiryDaysConfig } from "./standing-grant-expiry-config-CqUe6ux8.mjs";
import { r as createWizardSessionTracker } from "./server-wizard-sessions-Bjw33MRW.mjs";
import { n as refreshConnectedNodeSurfaceCaches } from "./nodes.read-w22qtcyw.mjs";
import { t as broadcastPresenceSnapshot } from "./presence-events-gFR-cYCD.mjs";
import { n as createGatewayChatMetadataLifecycle, t as broadcastChatMetadataChanged } from "./server-chat-metadata-lifecycle-BBvPb79N.mjs";
import { n as listPluginNodeCapabilities, t as findMatchingPluginNodeCapabilityRoute } from "./route-capability-BlWqoZBl.mjs";
import { n as applyGatewayLaneConcurrency, r as resolveGatewayLaneConcurrency, t as resolveHookClientIpConfig } from "./hook-client-ip-config-CvkkVv9_.mjs";
import { n as clearGatewayMaintenanceHandles, t as createNoopHeartbeatRunner } from "./server-runtime-service-shared-DE-vorah.mjs";
import { t as recordClientPresenceActivity } from "./client-presence-eaaAZFbg.mjs";
import { i as disposeNodeConnectionNotifications, n as disconnectDisallowedGatewayPolicyClients, o as retireDeviceTokenClients } from "./ws-origin-policy-wQ19cqA5.mjs";
import { r as createDesktopSessionRegistry } from "./session-registry-CuBlkFuF.mjs";
import { t as createGatewayStartupTrace } from "./server-startup-trace-Dr4kvRe8.mjs";
import { a as runWithGatewayHttpWorkAdmission, i as rejectGatewayUpgradeServiceUnavailable, r as shouldEnforceGatewayAuthForPluginPath, t as isPluginAuthenticatedRoutePath } from "./route-auth-JLczms7i.mjs";
import { n as handleNodeWorkerBundleTransferHttpRequest } from "./node-worker-bundle-transfer-http-IxtB4IRO.mjs";
import { n as handleNodeWorkspaceTransferHttpRequest } from "./node-workspace-transfer-http-BZUnvTYh.mjs";
import { n as handleWorkerBootstrapArtifactTransferHttpRequest } from "./worker-bootstrap-artifact-transfer-http-r7DZWLu9.mjs";
import { i as markPublicWorkerIngress, t as GATEWAY_WS_CONNECTION_KIND_PROPERTY } from "./ws-types-099MIJxx.mjs";
import { t as GATEWAY_EVENTS } from "./server-methods-list-l7Hw2A6u.mjs";
import { n as logGatewayReady, t as beginMacOSSystemCaWarmupOnce } from "./system-ca-warmup-KllxRlOc.mjs";
import "./session-limits-BqiIRDwa.mjs";
import fs, { constants, unwatchFile, watchFile } from "node:fs";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";
import fs$1 from "node:fs/promises";
import net, { isIP } from "node:net";
import { cpus } from "node:os";
import { setTimeout as setTimeout$1 } from "node:timers/promises";
import { X509Certificate, createHash, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { createHistogram, performance } from "node:perf_hooks";
import { isProxy } from "node:util/types";
import { Worker, isMainThread } from "node:worker_threads";
import { createServer as createServer$1, request } from "node:http";
import { Server, createServer as createServer$2 } from "node:https";
import { TLSSocket } from "node:tls";
//#region src/gateway/channel-thaw-restart.ts
function snapshotRunningTargets(manager) {
	return Object.entries(manager.getRuntimeSnapshot({ inspectAccounts: false }).channelAccounts).flatMap(([channelId, accounts]) => Object.entries(accounts ?? {}).filter(([accountId, status]) => status?.running === true && manager.isAccountListed(channelId, accountId)).map(([accountId]) => ({
		channelId,
		accountId
	})));
}
function dedupeTargets(targets) {
	const seen = /* @__PURE__ */ new Set();
	return targets.filter((target) => {
		const key = `${target.channelId}:${target.accountId}`;
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}
/**
* Restarts running listed, non-manually-stopped channel accounts after a host
* thaw. Dead sockets from a freeze otherwise wait for the slow health sweep.
*/
async function restartRunningChannelAccounts(manager, opts, selection = { kind: "new-thaw" }) {
	const targets = selection.kind === "new-thaw" ? dedupeTargets([...selection.pendingTargets ?? [], ...snapshotRunningTargets(manager)]) : [...selection.targets];
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
	const { minimalTestGateway, cfgAtStart, gatewayTls, bindHost, tailscaleMode, nodeRegistry, pluginRuntime, broadcast, nodeSendToAllSubscribed, refreshGatewayHealthSnapshotWithRuntime, dedupe, chatAbortControllers, chatQueuedTurns, restartRecoveryCandidates, chatRunState, removeChatRun, agentRunSeq, nodeHasSessionSubscribers, nodeSendToSession, runtimeState, kernel, startupTrace, channelManager, readinessEventLoopHealth, workerDispatchAuthority, clients, sharedGatewaySessionGenerationState, resolveSharedGatewaySessionGenerationForConfig, sessionMessageSubscribers, sessionEventSubscribers, toolEventRecipients, broadcastToConnIds, terminalSessions, controlUiBasePath, workerEnvironmentService, workerPlacementDispatchAvailable, workerPlacementControlAvailable, desktopSessionRegistry, gatewayComputerService, listStartupChannelGatewayMethods, workerEnvironmentStartup, activateRuntimeSecrets } = runtime;
	runtime.registerGatewayLifetimeSidecars({
		preparePluginReload: gatewayComputerService.preparePluginReload,
		stop: async () => {
			await gatewayComputerService.close();
			await desktopSessionRegistry.stopAll();
		}
	});
	const secretEgressProxy = cfgAtStart.secrets?.egressProxy?.enabled === true ? await import("./runtime-_KxnuA4z.mjs").then((egressRuntime) => egressRuntime.startGatewaySecretEgressProxy({
		...cfgAtStart.secrets?.egressProxy?.allowedHosts !== void 0 ? { allowedHosts: cfgAtStart.secrets.egressProxy.allowedHosts } : {},
		...cfgAtStart.secrets?.egressProxy?.bypassHosts ? { bypassHosts: cfgAtStart.secrets.egressProxy.bypassHosts } : {}
	})) : void 0;
	if (secretEgressProxy) runtime.registerGatewayLifetimeSidecars(secretEgressProxy);
	let pendingThawRestartTargets;
	let earlyRuntimePromise;
	const startEarlyRuntime = () => earlyRuntimePromise ??= startupTrace.measure("runtime.early", () => loadGatewayStartupEarlyModule().then(({ startGatewayEarlyRuntime }) => startGatewayEarlyRuntime({
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
		refreshPresence: () => broadcastPresenceSnapshot({
			broadcast,
			incrementPresenceVersion,
			getHealthVersion
		}),
		resetEventLoopHealth: readinessEventLoopHealth.reset,
		logHealth,
		dedupe,
		chatAbortControllers,
		chatQueuedTurns,
		restartRecoveryCandidates,
		chatRunState,
		removeChatRun,
		agentRunSeq,
		nodeSendToSession,
		skillsRefreshDelayMs: runtimeState.skillsRefreshDelayMs,
		getSkillsRefreshTimer: () => runtimeState.skillsRefreshTimer,
		setSkillsRefreshTimer: (timer) => {
			runtimeState.skillsRefreshTimer = timer;
		},
		getRuntimeConfig,
		startupTrace
	}))).then((earlyRuntime) => {
		kernel.setEarlyRuntimeHandles(earlyRuntime);
		return earlyRuntime;
	});
	const [{ startGatewayEventSubscriptions }, { startGatewayChannelHealthMonitor }] = await startupTrace.measure("runtime.post-early-imports", () => Promise.all([import("./server-runtime-subscriptions-Z5cAfQUe.mjs"), import("./server-runtime-startup-services-CwEyOFw-.mjs")]));
	const { sessionCompanion, sessionObserver, sessionActivitySummaries, channelAdmissionAudit, ...runtimeSubscriptionUnsubs } = await startupTrace.measure("runtime.subscriptions", () => startGatewayEventSubscriptions({
		signal: runtime.connectionWork.signal,
		getSessionRowProjection: runtime.getSessionRowProjection,
		log,
		broadcast,
		broadcastToConnIds,
		nodeHasSessionSubscribers,
		nodeSendToSession,
		agentRunSeq,
		chatRunState,
		toolEventRecipients,
		sessionEventSubscribers,
		sessionMessageSubscribers,
		chatAbortControllers,
		restartRecoveryCandidates,
		terminalSessions,
		refreshConnectedUserProfiles: () => runtime.resolvePluginGatewayContext()?.refreshConnectedUserProfile?.()
	}));
	Object.assign(runtimeState, runtimeSubscriptionUnsubs);
	await startupTrace.measure("runtime.services", () => kernel.setChannelHealthMonitor(startGatewayChannelHealthMonitor({ channelManager })));
	const { createOperatorApprovalSessionEventRuntime } = await import("./operator-approval-session-events-qTefW2m-.mjs");
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
	const { execApprovalManager, questionManager, cancelRunBoundApprovals, forwardPluginApprovalRequest, forwardExecApprovalRequest, execApprovalIosPushDelivery, approvalWebPushDelivery, pluginApprovalIosPushDelivery, pluginApprovalManager, placementStandingGrants, systemAgentApprovalManager, bindApprovalPublicationContext, beginCloseApprovalObservers, stopOperatorInteractions, extraHandlers, coreGatewayHandlers } = await startupTrace.measure("gateway.handlers", async () => {
		const [{ createGatewayAuxHandlers }, { coreGatewayHandlers: coreGatewayHandlersLocal }] = await Promise.all([import("./server-aux-handlers-Cyn6YM_9.mjs"), import("./server-methods-CfKpZVSW.mjs")]);
		return {
			...createGatewayAuxHandlers({
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
		const coreDescriptors = createCoreGatewayMethodDescriptors(coreDescriptorHandlers).filter((descriptor) => (workerEnvironmentService || descriptor.name !== "environments.create" && descriptor.name !== "environments.destroy" && !descriptor.name.startsWith("environments.session.")) && (workerPlacementDispatchAvailable || descriptor.name !== "sessions.dispatch") && (workerPlacementControlAvailable || descriptor.name !== "sessions.reclaim" && descriptor.name !== "sessions.move") && (workerEnvironmentService || descriptor.name !== "desktop.launch" && descriptor.name !== "worker.desktop.observe" && descriptor.name !== "worker.desktop.launch"));
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
	const prepareAttachedPluginRuntime = async (loaded) => {
		const { activatePluginRegistry } = await import("./loader-shared-DcVB1XIr.mjs");
		const nextMethodRegistry = buildAttachedGatewayMethodRegistry(loaded.pluginRegistry);
		const nextMethods = uniqueStrings([...nextMethodRegistry.listAdvertisedMethods(), ...listStartupChannelGatewayMethods(loaded.pluginRegistry)]);
		const nextHandlerKeys = new Set(Object.keys(loaded.pluginRegistry.gatewayHandlers));
		return {
			publish: () => {
				adoptPluginHttpRouteHandoffs(pluginRuntime.registry, loaded.pluginRegistry);
				activatePluginRegistry(loaded.pluginRegistry, null, "gateway-bindable", runtime.pluginWorkspaceDir, pluginRuntime.registry);
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
		const { reloadGatewayPlugins } = await import("./server-plugin-reload-C_IbNw4I.mjs");
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
		execApprovalManager,
		questionManager,
		cancelRunBoundApprovals,
		forwardPluginApprovalRequest,
		forwardExecApprovalRequest,
		execApprovalIosPushDelivery,
		approvalWebPushDelivery,
		pluginApprovalIosPushDelivery,
		pluginApprovalManager,
		placementStandingGrants,
		systemAgentApprovalManager,
		bindApprovalPublicationContext,
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
//#region src/gateway/server-lifetime-sidecars.ts
const SECRET_STORE_EXPIRY_INTERVAL_MS = 6e4;
const GITHUB_PUBLICATION_RECONCILE_INTERVAL_MS = 6e4;
function startGitHubPublicationMaintenance(reconcile, logWarning) {
	let current;
	let stopped = false;
	const run = () => {
		if (stopped || current) return;
		const operation = reconcile().catch(() => logWarning("GitHub publication recovery failed; will retry.")).finally(() => {
			if (current === operation) current = void 0;
		});
		current = operation;
	};
	run();
	const interval = setInterval(run, GITHUB_PUBLICATION_RECONCILE_INTERVAL_MS);
	interval.unref?.();
	return { stop: async () => {
		stopped = true;
		clearInterval(interval);
		await current;
	} };
}
function startSecretStoreExpiryMaintenance(logWarning) {
	let warned = false;
	let current;
	let stopped = false;
	const purge = () => {
		if (stopped || current) return;
		current = purgeExpiredSecretStoreEntries().then(() => {
			warned = false;
		}).catch(() => {
			if (!warned) {
				logWarning("Secret store expiry cleanup failed; will retry.");
				warned = true;
			}
		}).finally(() => {
			current = void 0;
		});
	};
	purge();
	const interval = setInterval(purge, SECRET_STORE_EXPIRY_INTERVAL_MS);
	interval.unref?.();
	return { stop: async () => {
		stopped = true;
		clearInterval(interval);
		await current;
	} };
}
async function attachInitialGatewayLifetimeSidecars(params) {
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
	if (!params.minimalTestGateway) params.publishSidecars(startSecretStoreExpiryMaintenance(params.logWarning));
	if (params.reconcileGitHubPublications) params.publishSidecars(startGitHubPublicationMaintenance(params.reconcileGitHubPublications, params.logWarning));
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
		const { loadGatewayConfigRevisionProjector } = await import("./config-revision-token-CICshDGW.mjs");
		return loadGatewayConfigRevisionProjector({ env: process.env });
	});
	const gatewayRequestContext = await startupTrace.measure("gateway.request-context", async () => {
		const { createGatewayRequestContext } = await import("./server-request-context-DIC6jEhK.mjs");
		return createGatewayRequestContext({
			runtime,
			configRevisionProjector,
			chatMetadataLifecycle,
			log,
			logHealth
		});
	});
	const projectionReady = runtime.opts.updateCanary ? Promise.resolve(void 0) : startupTrace.measure("sessions.projection", async () => {
		const { createSessionRowProjection } = await import("./session-row-projection-DWbpE2rw.mjs");
		return createSessionRowProjection({
			cfg: getRuntimeConfig(),
			getConfig: getRuntimeConfig,
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
		projectionLifetime.detach?.();
		projection?.dispose();
	} });
	const projection = await projectionReady;
	if (projectionLifetime.closing) throw new Error("Gateway closed during session projection startup");
	if (projection) projectionLifetime.detach = runtime.attachSessionRowProjection(projection);
	gatewayRequestContext.requestEntryLifetime = runtime.requestEntryLifetime;
	bindApprovalPublicationContext(gatewayRequestContext);
	if (!runtime.opts.updateCanary) await attachInitialGatewayLifetimeSidecars({
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
	const { createGatewayInstanceRuntime } = await import("./server-instance-runtime-BHcr-U24.mjs");
	const gatewayInstanceRuntime = createGatewayInstanceRuntime({
		getContext: () => gatewayRequestContext,
		getMethodRegistry: () => getAttachedGatewayMethodRegistry(),
		isDispatchAvailable: () => startupState.dispatchReady && !lifecycle.closePreludeStarted,
		logError: (message) => log.error(message)
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
	const env = params.env ?? process.env;
	const storePath = resolveCronJobsStorePathFromConfig(params.cfg, env);
	const cronEnabled = env.OPENCLAW_SKIP_CRON !== "1" && params.cfg.cron?.enabled !== false;
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
	const cronStateLoader = createLazyPromiseLoader(() => import("./server-cron-CaHu2yle.mjs").then(({ buildGatewayCronService }) => {
		loaded = {
			state: runWithSpawnBroker(spawnBroker, () => buildGatewayCronService(params)),
			phase: "idle",
			startPromise: null,
			startGeneration: null,
			schedulingPaused: false,
			underlyingStartInFlight: false,
			underlyingStarted: false
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
	const stopResolvedCron = async (resolved) => {
		resolved.phase = "stopped";
		resolved.underlyingStarted = false;
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
				resolved.underlyingStartInFlight = true;
				try {
					await resolved.state.cron.start();
					resolved.underlyingStarted = true;
				} catch (err) {
					resolved.underlyingStarted = false;
					resolved.phase = startCancelled() ? "stopped" : "idle";
					throw err;
				} finally {
					resolved.underlyingStartInFlight = false;
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
				loaded.underlyingStarted = false;
				loaded.state.cron.stop();
				return;
			}
			const loading = cronStateLoader.peek();
			if (loading) loading.then((resolved) => {
				if (!stopped) return;
				resolved.phase = "stopped";
				resolved.underlyingStarted = false;
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
			if (loaded && loaded.schedulingPaused && (loaded.underlyingStarted || loaded.underlyingStartInFlight)) {
				loaded.state.cron.resumeScheduling();
				loaded.schedulingPaused = false;
			}
		},
		getSuspensionBlockerCount() {
			const loadedBlockers = loaded?.state.cron.getSuspensionBlockerCount?.() ?? 0;
			return loaded?.phase === "starting" ? Math.max(1, loadedBlockers) : loadedBlockers;
		},
		async status() {
			return await (await load()).state.cron.status();
		},
		async list(opts) {
			return await (await load()).state.cron.list(opts);
		},
		async listPage(opts, matchesJob) {
			return await (await load()).state.cron.listPage(opts, matchesJob);
		},
		async add(input, opts) {
			return await (await load()).state.cron.add(input, opts);
		},
		async update(id, patch, opts) {
			return await (await load()).state.cron.update(id, patch, opts);
		},
		async updateWithPrecondition(id, patch, precondition, opts) {
			return await (await load()).state.cron.updateWithPrecondition(id, patch, precondition, opts);
		},
		async remove(id, opts) {
			return await (await load()).state.cron.remove(id, opts);
		},
		async removeStaleJobFamily(family, opts) {
			return await (await load()).state.cron.removeStaleJobFamily(family, opts);
		},
		async removeAgentJobsTransactional(agentId, commit) {
			return await (await load()).state.cron.removeAgentJobsTransactional(agentId, commit);
		},
		async quiesceJobs(jobs, commitGuard) {
			await (await load()).state.cron.quiesceJobs(jobs, commitGuard);
		},
		async run(id, mode, opts) {
			return await (await load()).state.cron.run(id, mode, opts);
		},
		async enqueueRun(id, mode, opts) {
			return await (await load()).state.cron.enqueueRun(id, mode, opts);
		},
		getJob(id) {
			if (!loaded) return;
			return loaded.state.cron.getJob(id);
		},
		async readJob(id) {
			return await (await load()).state.cron.readJob(id);
		},
		async readScratch(id) {
			return await (await load()).state.cron.readScratch(id);
		},
		async writeScratch(id, write) {
			return await (await load()).state.cron.writeScratch(id, write);
		},
		getDefaultAgentId() {
			if (!loaded) return;
			return loaded.state.cron.getDefaultAgentId();
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
		async reconcileExitWatchers() {
			await (await load()).state.reconcileExitWatchers();
		},
		async reconcileStreamWatchers() {
			await (await load()).state.reconcileStreamWatchers();
		},
		async stopStreamWatchers() {
			await loaded?.state.stopStreamWatchers();
		},
		async reconcileSystemJobs() {
			return await (await load()).state.reconcileSystemJobs();
		}
	};
}
//#endregion
//#region src/gateway/server-cron-reconciled.ts
function createGatewayCronReconciliation(params) {
	let lifecycleGeneration = 0;
	let activeAbortController;
	const supersedeActive = () => {
		lifecycleGeneration += 1;
		activeAbortController?.abort();
		activeAbortController = void 0;
	};
	return {
		arm: ({ reason, config, cronState }) => {
			supersedeActive();
			const generation = lifecycleGeneration;
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
				if (params.isClosing() || generation !== lifecycleGeneration || abortController.signal.aborted) return;
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
		skillsRefreshTimer: null,
		skillsRefreshDelayMs: 3e4,
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
		lifecycleUnsub: null,
		taskUnsub: null
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
	if (!env.OPENCLAW_QA_PARENT_PID) return;
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
function sameKeys(left, right) {
	return left !== void 0 && left.length === right.length && left.every((key, index) => key === right[index]);
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
		const previous = declarations.get(normalizedConnId);
		if (sameKeys(previous, next) || previous === void 0 && next.length === 0) return next;
		if (next.length === 0) declarations.delete(normalizedConnId);
		else declarations.set(normalizedConnId, next);
		if (client.presenceKey) {
			upsertPresence(client.presenceKey, { watchedSessions: next.length > 0 ? [...next] : void 0 });
			if (next.length > 0) recordClientPresenceActivity(deps.clients, client);
			broadcastPresenceSnapshot(deps);
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
	const { minimalTestGateway, transportBridge, sessionMessageSubscribers, isConnectionActive, clients, mentionInbox, broadcast, cfgAtStart, pluginRuntime, authRateLimiter, nodeReapprovalCoordinator, channelManager, deps, initialHooksConfig, initialHookClientIpConfig, runtimeStateRef, gatewayInstanceRuntimeRef, startupState, readinessEventLoopHealth, browserAuthRateLimiter, chatRunState, chatAbortControllers, chatQueuedTurns, removeChatRun, agentRunSeq, listActiveGatewayMethods, broadcastToConnIds, getBufferedAmount, sessionEventSubscribers, watchNodeRequestHandler, defaultWorkspaceDir, activeTaskCount, desktopSessionRegistry, nodeDesktopStreamBroker, bindDeviceNodeControl, bindWorkerNodeDesktopControl, workerPlacementRuntime, lifecycle } = runtime;
	const restartRecoveryCandidates = /* @__PURE__ */ new Map();
	const nodeDesktopServiceRef = {};
	const { createGatewayNodeSessionRuntime } = await import("./server-node-session-runtime-CHv2nLfo.mjs");
	const { nodeRegistry, nodeWorkerSupervisorTransport, nodePresenceTimers, nodeHasSessionSubscribers, nodeSendToSession, nodeSendToAllSubscribed, nodeSubscribe, nodeUnsubscribe, nodeUnsubscribeAll, broadcastVoiceWakeChanged, broadcastVoiceWakeRoutingChanged, hasTalkNodeConnected } = createGatewayNodeSessionRuntime({
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
			broadcastPresenceSnapshot({
				broadcast,
				incrementPresenceVersion,
				getHealthVersion
			});
			removeRemoteNodeInfoForConnection(nodeId, connId);
		},
		onPairingGenerationChanged: ({ nodeId }) => {
			nodeDesktopServiceRef.current?.stopNode(nodeId);
		}
	});
	const nodeDesktopService = (await import("./node-source-BskS7cb2.mjs")).createNodeDesktopService({
		getConfig: getRuntimeConfig,
		nodeRegistry,
		desktopRegistry: desktopSessionRegistry,
		streamBroker: nodeDesktopStreamBroker
	});
	nodeDesktopServiceRef.current = nodeDesktopService;
	workerPlacementRuntime?.bindNodeWorkerAvailability((nodeId, options) => waitForNodeWorkerSupervisor(nodeRegistry, nodeId, options));
	bindDeviceNodeControl?.(nodeWorkerSupervisorTransport);
	bindWorkerNodeDesktopControl?.(nodeWorkerSupervisorTransport);
	const { createWatchNodeHttpRuntime } = await import("./watch-node-http-ByT0JzK-.mjs");
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
			});
			broadcastPresenceSnapshot({
				broadcast,
				incrementPresenceVersion,
				getHealthVersion
			});
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
			broadcastPresenceSnapshot({
				broadcast,
				incrementPresenceVersion,
				getHealthVersion
			});
			removeRemoteNodeInfo(nodeId);
			nodeUnsubscribeAll(nodeId);
			clearNodeWakeState(nodeId);
		},
		onError: (message, error) => log.warn(`${message}: ${String(error)}`)
	});
	watchNodeRequestHandler.current = watchNodeHttpRuntime.handleRequest;
	const { TerminalSessionManager, DEFAULT_TERMINAL_DETACH_SECONDS } = await import("./session-manager-DrOWZsL_.mjs");
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
			cfg: cfgAtStart,
			deps,
			broadcast,
			resolveGatewayContext: runtime.resolvePluginGatewayContext
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
			activeTaskCount.get = handles.getActiveTaskCount;
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
		swapHeartbeatRunner: (next) => {
			const previous = runtimeState.heartbeatRunner;
			runtimeState.heartbeatRunner = next;
			return previous;
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
		broadcastToConnIds,
		isConnectionActive,
		prepareRead: (connId, session) => {
			const client = clients.getByConnectionId(connId);
			return client ? prepareControlUiSessionPrRead({
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
		broadcast,
		incrementPresenceVersion,
		getHealthVersion
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
				const hookRunner = (await import("./hooks-zP87B-3J.mjs")).createHookRunner(pluginRuntime.registry);
				if (hookRunner.hasHooks("cron_reconciled")) await hookRunner.runCronReconciled(event, ctx);
			} catch (err) {
				logCron.error(`cron_reconciled hook failed: ${String(err)}`);
			}
		}
	});
	const postReadyState = { maintenanceTimer: null };
	let deliveryRecoveryStopPromise = null;
	const stopDeliveryRecoveryForClose = () => deliveryRecoveryStopPromise ??= runtimeState.stopDeliveryRecovery();
	let mediaCleanupStopPromise = null;
	const stopMediaCleanupForClose = () => mediaCleanupStopPromise ??= runtimeState.stopMediaCleanup();
	const healthWork = new AsyncWorkScope();
	const markClosePreludeStarted = (options) => {
		if (lifecycle.closePreludeStarted) return;
		params.pluginMetadata.beginClose();
		const notice = resolveGatewayShutdownNotice(options);
		lifecycle.closePreludeStarted = true;
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
		kernel.setDispatchReady(false);
		gatewayInstanceRuntimeRef.current?.close();
		cronReconciliation.invalidate();
		clearTimeout(postReadyState.maintenanceTimer ?? void 0);
		postReadyState.maintenanceTimer = null;
	};
	let configReloaderStopPromise = null;
	const stopConfigReloaderForClose = () => configReloaderStopPromise ??= runtimeState.configReloader.stop();
	const beginClosePrelude = async (options) => {
		fenceSessionSuspensionWritesForGatewayShutdown();
		markClosePreludeStarted(options);
		await Promise.all([
			requestEntryLifetime.waitForPendingEntries(),
			stopDeliveryRecoveryForClose(),
			stopMediaCleanupForClose(),
			runtimeState.stopGatewayUpdateCheck(),
			stopConfigReloaderForClose().catch(() => {}),
			runtimeState.maintenance?.stopPeriodicTasks().catch(() => {}),
			runtimeState.controlUiSessionPullRequests?.stop(),
			healthWork.drain()
		]);
	};
	const runClosePrelude = async () => {
		await beginClosePrelude();
		disposeNodeConnectionNotifications(nodeRegistry);
		watchNodeHttpRuntime.close();
		await shutdownRuntime.runGatewayClosePrelude({
			stopDiagnostics: stopDiagnosticHeartbeat,
			clearSkillsRefreshTimer: () => {
				if (!runtimeState?.skillsRefreshTimer) return;
				clearTimeout(runtimeState.skillsRefreshTimer);
				runtimeState.skillsRefreshTimer = null;
			},
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
			nodeSendToSession,
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
					heartbeatRunner: runtimeState.heartbeatRunner,
					stopTaskRegistryMaintenance: shutdownRuntime.stopTaskRegistryMaintenance,
					nodePresenceTimers,
					maintenance: runtimeState.maintenance,
					stopMediaCleanup: stopMediaCleanupForClose,
					agentUnsub: runtimeState.agentUnsub,
					heartbeatUnsub: runtimeState.heartbeatUnsub,
					transcriptUnsub: runtimeState.transcriptUnsub,
					lifecycleUnsub: runtimeState.lifecycleUnsub,
					taskUnsub: runtimeState.taskUnsub,
					chatRunState,
					clients,
					finishRequestEntries: () => requestEntryLifetime.sealAndJoin(),
					drainSdkWork: () => params.sdkResourceHost.drainWork(),
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
	const configureDiagnostics = (config) => {
		if (lifecycle.closePreludeStarted) return;
		const enabled = isDiagnosticsEnabled(config);
		setDiagnosticsEnabledForProcess(enabled);
		if (!enabled) {
			stopDiagnosticHeartbeat();
			return;
		}
		startDiagnosticHeartbeat(void 0, {
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
		nodeRegistry,
		nodeDesktopService,
		nodePresenceTimers,
		nodeHasSessionSubscribers,
		nodeSendToSession,
		nodeSendToAllSubscribed,
		nodeSubscribe,
		nodeUnsubscribe,
		nodeUnsubscribeAll,
		broadcastVoiceWakeChanged,
		broadcastVoiceWakeRoutingChanged,
		hasTalkNodeConnected,
		watchNodeHttpRuntime,
		terminalSessions,
		runtimeState,
		unavailableGatewayMethods,
		kernel,
		pluginHostServices,
		shutdownRuntime,
		lifecycle,
		postReadyState,
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
function normalizeFingerprintList(value) {
	return value ? [...new Set(value.map((entry) => entry.trim()).filter((entry) => entry.length > 0))].toSorted() : void 0;
}
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
		caps: normalizeFingerprintList(input.caps),
		commands: normalizeFingerprintList(input.commands),
		permissions,
		remoteIp: input.remoteIp,
		silent: Boolean(input.silent)
	});
}
/** Creates the gateway-lifetime owner for paired-node reapproval write limits. */
function createNodeReapprovalCoordinator(config) {
	const limiter = createAuthRateLimiter({
		...config,
		exemptLoopback: false
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
	if (event === "task" && value.action === "upserted") {
		const task = isRecord(value.task) ? value.task : null;
		if (task?.status !== "failed" && task?.status !== "timed_out" || task.runtime === "cron") return null;
		const taskId = normalizeWebPushDisplayLabel(task.id) ?? "failed";
		const taskTitle = normalizeWebPushDisplayLabel(task.title);
		return {
			category: "background-task-failed",
			title: "OpenClaw background task failed",
			body: "A background task needs attention.",
			...taskTitle ? { identifiedBody: `${taskTitle} needs attention.` } : {},
			tag: `openclaw-task-failed-${taskId}`
		};
	}
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
function preferenceFor(target, stateDir) {
	const profileId = target.userProfileId;
	const user = profileId ? getUserPreferences(profileId, [WEB_PUSH_USER_PREFERENCES_KEY], stateDir ? { env: {
		...process.env,
		OPENCLAW_STATE_DIR: stateDir
	} } : {})[WEB_PUSH_USER_PREFERENCES_KEY] : void 0;
	return resolveEffectiveWebPushPreferences({
		user,
		device: target.subscription.devicePreferences
	});
}
/** Routes attention events to offline browsers without expanding live session visibility. */
function createEventWebPushDelivery(params) {
	const log = params.log ?? defaultLog;
	const deliver = (notification, event, payload, opts, mention) => {
		(async () => {
			if (!await hasBoundWebPushSubscriptions(params.stateDir)) return;
			const sender = await prepareWebPushNotificationSender(params.stateDir);
			const groupedResults = await withCurrentWebPushAuthority(params.stateDir, (subscriptions, pairedDevices) => {
				const cfg = params.getRuntimeConfig();
				const recipientProfileId = mention && resolveUserProfileId(mention.recipientProfileId);
				if (mention && !recipientProfileId) return;
				const agentId = normalizeOptionalString(opts?.agentId ?? (isRecord(payload) ? payload.agentId : void 0));
				const sessionKeys = opts?.sessionKeys ?? [];
				const sessionKey = mention?.sessionKey ?? sessionKeys[0];
				const sessionPath = sessionKey ? buildControlUiSessionPath({
					namespace: "chat",
					sessionKey,
					fallbackAgentId: agentId,
					mainKey: cfg.session?.mainKey,
					exactKey: true
				}) : void 0;
				if (mention && !sessionPath) return;
				const path = notification.path ?? sessionPath?.slice(1) ?? (notification.category === "background-task-failed" ? "tasks" : "sessions");
				const url = resolveControlUiWebPushUrl(cfg, path);
				const targets = listCurrentWebPushTargets({
					cfg,
					subscriptions,
					requiredScopes: notification.category === "agent-question" ? [READ_SCOPE, QUESTIONS_SCOPE] : [READ_SCOPE],
					...mention ? { visibilityScopes: [ADMIN_SCOPE] } : {},
					pairedDevices
				});
				const agentLabel = normalizeWebPushDisplayLabel(agentId);
				const groups = /* @__PURE__ */ new Map();
				for (const target of targets) {
					if (mention && target.userProfileId !== recipientProfileId) continue;
					const preferences = preferenceFor(target, params.stateDir);
					if (!webPushCategoryEnabled(preferences, notification.category) || isWebPushQuietHours(preferences) || !webPushAgentAllowed(preferences, agentId)) continue;
					if (sessionKeys.length > 0 && !canReceiveSessionEvent({
						cfg,
						client: webPushTargetClient(target),
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
			if (displays.size >= MAX_DIRECTORY_PROFILES) {
				const oldest = displays.keys().next().value;
				if (oldest !== void 0) displays.delete(oldest);
			}
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
//#region src/gateway/mention-inbox-store.ts
const MENTION_RETENTION_MS = 6048e5;
const HEAD_KEY = "notifications.mentions.head";
const SOURCE_PREFIX = "notifications.mentions.source.";
const SOURCE_END = "notifications.mentions.source/";
const reference = string().min(1).max(256);
const timestamp = number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);
const headSchema = object({
	revision: timestamp,
	nextSequence: timestamp
});
const messageSchema = object({
	sessionId: reference,
	content: object({
		senderProfileId: reference,
		sessionKey: string().min(1).max(512),
		agentId: reference,
		messageId: reference,
		createdAt: timestamp,
		excerpt: string().max(280).optional()
	})
});
const sourceSchema = object({
	key: string().regex(/^[a-f0-9]{64}$/),
	sequence: timestamp,
	expiresAt: timestamp,
	recipients: array(tuple([reference, reference.nullable()])).max(10),
	message: messageSchema.optional()
});
/** The existing machine-state primary key owns lookup; this feature creates no schema. */
function readMentionStoreSnapshot(revision, activeDatabase) {
	const read = (database) => {
		const db = getNodeSqliteKysely(database);
		const headRow = executeSqliteQueryTakeFirstSync(database, db.selectFrom("config_machine_state").select("value_json").where("state_key", "=", HEAD_KEY));
		const head = headRow ? headSchema.parse(JSON.parse(headRow.value_json)) : {
			revision: 0,
			nextSequence: 0
		};
		if (head.revision === revision) return;
		const rows = executeSqliteQuerySync(database, db.selectFrom("config_machine_state").select(["state_key", "value_json"]).where("state_key", ">=", SOURCE_PREFIX).where("state_key", "<", SOURCE_END).limit(10001)).rows;
		if (rows.length > 1e4) throw new Error("Mention retention exceeds its source budget");
		const ids = /* @__PURE__ */ new Set();
		const sequences = /* @__PURE__ */ new Set();
		let itemCount = 0;
		const sources = rows.map((row) => {
			if (row.value_json.length > 32768) throw new Error("Mention source exceeds its record budget");
			const source = sourceSchema.parse(JSON.parse(row.value_json));
			if (row.state_key !== `${SOURCE_PREFIX}${source.key}` || source.sequence >= head.nextSequence || sequences.has(source.sequence) || new Set(source.recipients.map(([profileId]) => profileId)).size !== source.recipients.length) throw new Error("Invalid mention source identity");
			sequences.add(source.sequence);
			for (const [, id] of source.recipients) {
				if (id === null) continue;
				if (!source.message || ids.has(id)) throw new Error("Invalid retained mention");
				ids.add(id);
				itemCount++;
			}
			if (source.message && source.expiresAt !== source.message.content.createdAt + 6048e5) throw new Error("Invalid mention retention window");
			return source;
		});
		if (itemCount > 1e4) throw new Error("Mention retention exceeds its item budget");
		return {
			head,
			sources: sources.toSorted((left, right) => left.sequence - right.sequence)
		};
	};
	if (activeDatabase) return read(activeDatabase);
	const result = withExistingOpenClawStateDatabaseReadOnly(({ db }) => ({ snapshot: runSqliteDeferredTransactionSync(db, () => read(db), { operationLabel: "mentions.read" }) }));
	return result ? result.snapshot : revision === 0 ? void 0 : {
		head: {
			revision: 0,
			nextSequence: 0
		},
		sources: []
	};
}
/** Called inside the admitting Inbox's synchronous shared-state write transaction. */
function writeMentionStoreChanges(database, head, changes) {
	if (changes.size === 0) return head;
	const next = headSchema.parse({
		...head,
		revision: head.revision + 1
	});
	const db = getNodeSqliteKysely(database);
	const updatedAtMs = Date.now();
	const deletedKeys = [];
	const flushDeletes = () => {
		if (deletedKeys.length === 0) return;
		const deletion = db.deleteFrom("config_machine_state");
		executeSqliteQuerySync(database, deletedKeys.length === 1 ? deletion.where("state_key", "=", deletedKeys[0]) : deletion.where("state_key", "in", sqliteStringSet(deletedKeys)));
		deletedKeys.length = 0;
	};
	for (const [key, source] of changes) {
		const stateKey = `${SOURCE_PREFIX}${key}`;
		if (!source) {
			deletedKeys.push(stateKey);
			continue;
		}
		flushDeletes();
		const valueJson = JSON.stringify(source);
		executeSqliteQuerySync(database, db.insertInto("config_machine_state").values({
			state_key: stateKey,
			value_json: valueJson,
			updated_at_ms: updatedAtMs
		}).onConflict((conflict) => conflict.column("state_key").doUpdateSet({
			value_json: valueJson,
			updated_at_ms: updatedAtMs
		})));
	}
	flushDeletes();
	executeSqliteQuerySync(database, db.insertInto("config_machine_state").values({
		state_key: HEAD_KEY,
		value_json: JSON.stringify(next),
		updated_at_ms: updatedAtMs
	}).onConflict((conflict) => conflict.column("state_key").doUpdateSet({
		value_json: JSON.stringify(next),
		updated_at_ms: updatedAtMs
	})));
	return next;
}
//#endregion
//#region src/gateway/mention-inbox.ts
const MAX_GLOBAL_ITEMS = 1e4;
const log$4 = createSubsystemLogger("gateway/mentions");
/** Durable sources own retention and replay; each Gateway keeps disposable projection indexes. */
function createMentionInbox(params) {
	const policy = createHumanMentionPolicy(params);
	const items = /* @__PURE__ */ new Map();
	const itemsByProfile = /* @__PURE__ */ new Map();
	const processed = /* @__PURE__ */ new Map();
	const dirtySources = /* @__PURE__ */ new Set();
	let head = {
		revision: -1,
		nextSequence: 0
	};
	const views = /* @__PURE__ */ new WeakMap();
	const connectedTargets = /* @__PURE__ */ new Map();
	let targetConfig;
	let active = true;
	let profileVersion = readUserProfileVersion();
	let expiryTimer;
	let capacityReported = false;
	let profileInvalidationPending = false;
	let nextExpiryAt = Infinity;
	function synchronize(database) {
		const snapshot = readMentionStoreSnapshot(head.revision, database);
		if (!snapshot) return false;
		items.clear();
		itemsByProfile.clear();
		processed.clear();
		dirtySources.clear();
		nextExpiryAt = Infinity;
		for (const stored of snapshot.sources) {
			const source = {
				key: stored.key,
				sequence: stored.sequence,
				expiresAt: stored.expiresAt,
				recipients: /* @__PURE__ */ new Map()
			};
			processed.set(source.key, source);
			nextExpiryAt = Math.min(nextExpiryAt, source.expiresAt);
			for (const [profileId, id] of stored.recipients) {
				const item = id && stored.message ? {
					id,
					recipientProfileId: profileId,
					source,
					message: stored.message
				} : null;
				source.recipients.set(profileId, item);
				if (item) {
					items.set(item.id, item);
					indexItem(item, false);
				}
			}
		}
		head = snapshot.head;
		profileVersion = -1;
		return true;
	}
	function mutate(operation) {
		try {
			return runOpenClawStateWriteTransaction(({ db }) => {
				synchronize(db);
				expireItems();
				reconcileProfiles();
				const result = operation();
				const changes = /* @__PURE__ */ new Map();
				for (const key of dirtySources) {
					const source = processed.get(key);
					if (!source) {
						changes.set(key, void 0);
						continue;
					}
					const message = [...source.recipients.values()].find((item) => item !== null)?.message;
					changes.set(key, {
						key,
						sequence: source.sequence,
						expiresAt: source.expiresAt,
						recipients: [...source.recipients].map(([profileId, item]) => [profileId, item?.id ?? null]),
						...message ? { message } : {}
					});
				}
				head = writeMentionStoreChanges(db, head, changes);
				return result;
			}, {}, { operationLabel: "mentions.write" });
		} catch (error) {
			head = {
				revision: -1,
				nextSequence: 0
			};
			throw error;
		} finally {
			dirtySources.clear();
		}
	}
	function maintain() {
		const changed = synchronize();
		const maintenance = Date.now() >= nextExpiryAt || profileVersion !== readUserProfileVersion();
		if (maintenance) mutate(() => void 0);
		return changed || maintenance;
	}
	function removeItem(item) {
		if (!item || !items.delete(item.id)) return false;
		const profileItems = itemsByProfile.get(item.recipientProfileId);
		profileItems?.delete(item);
		if (profileItems?.size === 0) itemsByProfile.delete(item.recipientProfileId);
		item.source.recipients.set(item.recipientProfileId, null);
		dirtySources.add(item.source.key);
		return true;
	}
	function trimItems(retained, limit) {
		const oldest = retained.values();
		while (retained.size > limit) removeItem(oldest.next().value);
	}
	function indexItem(item, trim = true) {
		const retained = itemsByProfile.get(item.recipientProfileId) ?? /* @__PURE__ */ new Set();
		retained.add(item);
		itemsByProfile.set(item.recipientProfileId, retained);
		if (trim) trimItems(retained, 100);
	}
	function expireItems() {
		const now = Date.now();
		if (now < nextExpiryAt) return false;
		let changed = false;
		let next = Infinity;
		for (const [key, source] of processed) {
			if (source.expiresAt > now) {
				next = Math.min(next, source.expiresAt);
				continue;
			}
			for (const item of source.recipients.values()) changed = removeItem(item) || changed;
			processed.delete(key);
			dirtySources.add(key);
		}
		nextExpiryAt = next;
		if (processed.size < 1e4) capacityReported = false;
		return changed;
	}
	function reconcileProfiles() {
		const version = readUserProfileVersion();
		if (version === profileVersion) return;
		profileVersion = version;
		for (const source of processed.values()) {
			const recipients = /* @__PURE__ */ new Map();
			for (const [profileId, item] of source.recipients) {
				const canonical = policy.readProfile(profileId)?.profileId ?? profileId;
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
		for (const item of items.values()) indexItem(item);
	}
	function currentTarget(item, cfg, targets) {
		const { source, message } = item;
		const { agentId, sessionKey, senderProfileId } = message.content;
		if (!active || items.get(item.id) !== item || source.expiresAt <= Date.now()) return;
		const key = JSON.stringify([agentId, sessionKey]);
		let resolved = targets?.get(key)?.target;
		if (resolved === void 0) {
			resolved = resolveSessionSharingTarget({
				cfg,
				sessionKey,
				agentId
			});
			if (targets?.size === MAX_GLOBAL_ITEMS) targets.clear();
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
			sessionTitle: truncateUtf16Safe((deriveSessionTitle(current.target.entry) ?? "Conversation").replace(/[\p{Cc}\p{Cf}]/gu, " ").replace(/\s+/gu, " ").trim(), 256) || "Conversation"
		};
	}
	function readView(client, cfg = params.getRuntimeConfig(), remember = true, targets = /* @__PURE__ */ new Map()) {
		const identified = policy.identify(client, cfg);
		if (!identified.ok) return identified;
		const requester = identified.value;
		const visible = [];
		const profileItems = itemsByProfile.get(requester.profile.profileId);
		for (const item of [...profileItems ?? []].toReversed()) {
			const current = currentTarget(item, cfg, targets);
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
		if (expiryTimer || !active || processed.size === 0 && retryAfterMs === void 0) return;
		expiryTimer = setTimeout(() => {
			expiryTimer = void 0;
			refresh();
		}, retryAfterMs ?? Math.max(1, nextExpiryAt - Date.now()));
		expiryTimer.unref?.();
	}
	function refresh() {
		if (!active) return;
		try {
			maintain();
			refreshConnectedViews();
			scheduleExpiry();
		} catch {
			log$4.warn("Unable to refresh the mention Inbox; current reads will retry.");
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
	function invalidate(sessionKey) {
		invalidateTargets(sessionKey);
		policy.invalidateDirectory();
		refresh();
	}
	const stopRows = sessionChanges.subscribe((change) => invalidateTargets("sessionKey" in change ? change.sessionKey : void 0));
	const stopProfiles = onUserProfilesChanged(() => {
		if (profileInvalidationPending) return;
		profileInvalidationPending = true;
		queueMicrotask(() => {
			profileInvalidationPending = false;
			invalidate();
		});
	});
	const stopSessions = onSessionIdentityMutation(() => invalidate());
	function unavailable(warn = false) {
		if (warn) log$4.warn("The mention Inbox could not read or save its current state. Reconnect to retry.");
		return err(errorShape(ErrorCodes.UNAVAILABLE, "The mention Inbox is unavailable. Reconnect to retry.", { retryable: true }));
	}
	function readOperation(operation) {
		if (active) try {
			return operation();
		} catch {
			return unavailable(true);
		}
		return unavailable();
	}
	refresh();
	return {
		async mentionable(client, input, publish) {
			let preparationFailure;
			try {
				while (policy.needsDirectoryPreparation()) await policy.prepareDirectory();
			} catch {
				preparationFailure = unavailable(true);
			}
			publish(preparationFailure ?? readOperation(() => policy.mentionable(client, input)));
		},
		validateRecipients: (...args) => readOperation(() => policy.validateRecipients(...args)),
		list(client) {
			return readOperation(() => {
				if (maintain()) refreshConnectedViews();
				scheduleExpiry();
				return readView(client);
			});
		},
		dismiss(client, ids) {
			return readOperation(() => {
				const result = mutate(() => {
					const current = readView(client, params.getRuntimeConfig(), false);
					if (current.ok) {
						const owned = new Set(current.value.items.map((item) => item.id));
						for (const id of ids) if (owned.has(id)) removeItem(items.get(id));
					}
					return current;
				});
				if (!result.ok) return result;
				refresh();
				return readView(client);
			});
		},
		recordCommittedInput(input) {
			try {
				if (!active || input.recipientProfileIds.length === 0) return;
				const references = [
					input.sourceId,
					input.sessionId,
					input.messageId,
					input.senderProfileId,
					...input.recipientProfileIds
				];
				if (input.recipientProfileIds.length > 10 || input.sessionKey.length > 512 || references.some((value) => !value || value.length > 256)) {
					log$4.warn("Skipped mention delivery with invalid committed references.");
					return;
				}
				const committed = mutate(() => {
					const cfg = params.getRuntimeConfig();
					const resolved = resolveSessionSharingTarget({
						cfg,
						sessionKey: input.sessionKey,
						agentId: input.agentId
					});
					if (!resolved || resolved.entry.sessionId !== input.sessionId || resolved.entry.incognito === true || isIncognitoSessionKey(resolved.canonicalKey)) {
						log$4.debug("Skipped mention delivery because its committed session changed.");
						return [];
					}
					const senderProfile = policy.readProfile(input.senderProfileId);
					const mentionedProfiles = input.recipientProfileIds.flatMap((id) => {
						const recipient = policy.recipientProfile(id, {
							agentId: resolved.agentId,
							sessionKey: resolved.canonicalKey,
							entry: resolved.entry
						}, cfg);
						return senderProfile && recipient && senderProfile.profileId !== recipient.profileId ? [recipient.profileId] : [];
					});
					updateSessionProfileInvolvement({
						agentId: resolved.agentId,
						sessionKey: resolved.storeKey,
						storePath: resolved.storePath
					}, {
						expectedSessionId: input.sessionId,
						profileIds: mentionedProfiles,
						change: {
							kind: "mention",
							source: input.committedSource
						}
					});
					const sourceKey = createHash("sha256").update(JSON.stringify([
						resolved.agentId,
						resolved.canonicalKey,
						input.sessionId,
						input.sourceId
					])).digest("hex");
					if (processed.has(sourceKey)) return [];
					if (processed.size >= 1e4) {
						if (!capacityReported) {
							log$4.warn("Mention retention reached its replay budget; new mention alerts are skipped until retained sources expire.");
							capacityReported = true;
						}
						return [];
					}
					const now = Date.now();
					const source = {
						key: sourceKey,
						sequence: head.nextSequence++,
						expiresAt: now + MENTION_RETENTION_MS,
						recipients: /* @__PURE__ */ new Map()
					};
					processed.set(sourceKey, source);
					dirtySources.add(sourceKey);
					nextExpiryAt = Math.min(nextExpiryAt, source.expiresAt);
					const sender = policy.readProfile(input.senderProfileId);
					const target = {
						agentId: resolved.agentId,
						sessionKey: resolved.canonicalKey,
						entry: resolved.entry
					};
					const excerpt = input.excerpt ? truncateUtf16Safe(flattenMarkdownToPlainText(truncateUtf16Safe(input.excerpt, 2048)).replace(/[\p{Cc}\p{Cf}]/gu, " ").replace(/\s+/gu, " ").trim(), 280) : void 0;
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
						indexItem(item);
						trimItems(items, MAX_GLOBAL_ITEMS);
						created.push(item);
					}
					if (unavailableRecipients > 0) log$4.debug(`Skipped ${unavailableRecipients} unavailable mention recipients for committed input.`);
					return created;
				});
				refresh();
				if (!params.onMentionCreated) return;
				for (const item of committed) {
					const retained = items.get(item.id);
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
						isCurrent: () => {
							try {
								if (!active) return false;
								maintain();
								const latest = items.get(item.id);
								return Boolean(latest && currentTarget(latest, params.getRuntimeConfig()));
							} catch {
								return false;
							}
						}
					});
				}
			} catch {
				log$4.warn("Mention delivery could not be completed; the posted message is unchanged.");
			}
		},
		invalidate,
		dispose() {
			active = false;
			stopProfiles();
			stopSessions();
			stopRows();
			connectedTargets.clear();
			policy.dispose();
			if (expiryTimer) {
				clearTimeout(expiryTimer);
				expiryTimer = void 0;
			}
			items.clear();
			itemsByProfile.clear();
			processed.clear();
		}
	};
}
//#endregion
//#region src/gateway/server-broadcast-scopes.ts
const EVENT_SCOPE_GUARDS = {
	agent: [READ_SCOPE],
	chat: [READ_SCOPE],
	"chat.metadata.changed": [READ_SCOPE, "operator.sessions.read"],
	"board.changed": [READ_SCOPE],
	"board.command": [READ_SCOPE],
	"progressCard.changed": [READ_SCOPE],
	"ui.command": [READ_SCOPE],
	"chat.send_timing": [READ_SCOPE],
	"chat.side_result": [READ_SCOPE],
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
	"users.prefs.changed": [READ_SCOPE],
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
	"sessions.changed": [READ_SCOPE],
	"controlUi.sessionPullRequests.changed": [READ_SCOPE],
	"plugins.controlUi.changed": [READ_SCOPE],
	"session.approval": [APPROVALS_SCOPE],
	"session.message": [READ_SCOPE],
	"session.observer": [READ_SCOPE],
	"session.operation": [READ_SCOPE],
	"session.sharing": [READ_SCOPE],
	"session.sharing.evidence": [READ_SCOPE],
	"session.suggestion": [READ_SCOPE],
	"session.typing": [READ_SCOPE],
	"session.tool": [READ_SCOPE],
	"terminal.data": [ADMIN_SCOPE],
	"terminal.exit": [ADMIN_SCOPE],
	"portal.changed": [READ_SCOPE]
};
function hasEventScope(client, event, explicitPluginScope, ownRunQuestion = false) {
	if (client.connectionKind === "worker") return false;
	const role = client.connect.role ?? "operator";
	const scopes = Array.isArray(client.connect.scopes) ? client.connect.scopes : [];
	const required = EVENT_SCOPE_GUARDS[event];
	const pluginScope = explicitPluginScope || (!required && event.startsWith("plugin.") ? "operator.write" : void 0);
	if (pluginScope) return role === "operator" && operatorScopeSatisfied(pluginScope, scopes);
	if (!required) return false;
	return required.length === 0 || role === "operator" && (required.some((scope) => operatorScopeSatisfied(scope, scopes)) || ownRunQuestion && operatorScopeSatisfied("operator.sessions.write", scopes));
}
//#endregion
//#region src/gateway/server-broadcast.ts
const log$3 = createSubsystemLogger("gateway/broadcast");
const SESSION_SUBSCRIPTION_EVENTS = /* @__PURE__ */ new Set([
	"agent",
	"chat",
	"chat.side_result",
	"session.observer",
	"session.tool"
]);
function serializeFrameField(name, value) {
	const fieldJSON = JSON.stringify({ [name]: value });
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
	const deliveries = /* @__PURE__ */ new WeakMap();
	const deliveryFor = (client) => {
		let state = deliveries.get(client);
		if (!state || state.socket !== client.socket) {
			if (state) clearPending(state);
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
		if (!group.entries.size) {
			entry.group.removeEventListener("abort", group.retire);
			state.groups.delete(entry.group);
		}
		state.bytes -= entry.bytes;
	};
	const clearPending = (state) => {
		for (const entry of state.pending) takePending(state, entry);
	};
	const isCurrent = (predicate) => {
		try {
			return predicate?.() !== false;
		} catch {
			return false;
		}
	};
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
					log$3.error(`broadcast pending send failed: ${formatErrorMessage(err)}`);
				}
			}
		} finally {
			state.draining = false;
		}
	};
	const broadcastInternal = (event, payload, opts, targetConnIds, explicitPluginScope, retained) => {
		if (!retained && event === "sessions.changed") queuePluginSessionsChanged(payload);
		const live = opts?.liveText;
		if (params.clients.size === 0) return;
		const { sessionKeys, agentId } = resolveBroadcastSessionScope(payload, opts?.sessionKeys, opts?.agentId);
		const isTargeted = Boolean(targetConnIds);
		const presencePayload = event === "presence" ? payload : void 0;
		let projectPresence;
		let projectSession;
		let skipSourcePayload = false;
		let sessionProjectionPrepared = false;
		let outboundEventLogged = false;
		let lastFrameSequence = 0;
		let lastFrameRecipientProfileId;
		let lastFrame;
		let frameBase = retained?.base;
		let frameFields = retained?.base;
		let mergedFrames;
		const getFrameFields = () => frameFields ??= {
			eventJSON: JSON.stringify(event),
			stateVersionFragment: opts?.stateVersion === void 0 ? "" : serializeFrameField("stateVersion", opts.stateVersion)
		};
		const frameBaseFor = (value) => ({
			...getFrameFields(),
			payloadFragment: presencePayload ? "" : serializeFrameField("payload", value)
		});
		const getFrameBase = () => {
			return frameBase ??= frameBaseFor(payload);
		};
		const sessionSubscriptionVerified = opts?.sessionSubscriptionVerified === true;
		const isSessionSubscriptionEvent = SESSION_SUBSCRIPTION_EVENTS.has(event);
		const sessionMessageSubscribers = params.sessionMessageSubscribers;
		let sessionSubscriberConnIdsByKey;
		const recipients = retained ? [retained.client] : targetConnIds ? params.clients.getByConnectionIds(targetConnIds) : params.clients;
		for (const c of recipients) {
			if (!params.clients.has(c) || retained && c.socket !== retained.socket || c.invalidated === true || c.socket.readyState !== 1) continue;
			const questionRecipient = event === "question.requested" || event === "question.resolved" ? opts?.questionRecipient : void 0;
			if (!hasEventScope(c, event, explicitPluginScope, questionRecipient !== void 0 && !operatorScopeSatisfied("operator.questions", c.connect.scopes ?? []))) continue;
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
			const state = deliveryFor(c);
			if (live && !live.coalesce) drain(state, live.group);
			if (state.retired) continue;
			const nextSeq = (clientSeq.get(c) ?? 0) + 1;
			const bufferedAmount = bufferedBytes(state);
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
				state.retired = true;
				clearPending(state);
				closeGatewayTransportWithGrace(state.socket, 1008, "slow consumer");
				continue;
			}
			if (!retained && live?.coalesce && state.inFlight > 0) {
				let previous = state.groups.get(live.group)?.entries.get(live.coalesce.key);
				if (previous && !isCurrent(previous.isCurrent)) {
					takePending(state, previous);
					previous = void 0;
				}
				try {
					const cached = previous ? mergedFrames?.get(previous.payload) : void 0;
					const nextPayload = cached ? cached.payload : previous ? live.coalesce.merge(previous.payload, payload) : payload;
					const base = cached?.base ?? (nextPayload === payload ? getFrameBase() : frameBaseFor(nextPayload));
					if (previous && !cached && nextPayload !== payload) (mergedFrames ??= /* @__PURE__ */ new Map()).set(previous.payload, {
						payload: nextPayload,
						base
					});
					const bytes = base.reservedBytes ??= Buffer.byteLength(frameWithSequence(base, Number.MAX_SAFE_INTEGER, base.payloadFragment)) + MAX_SERVER_FRAME_HEADER_BYTES + MAX_RECIPIENT_PROFILE_FIELD_BYTES;
					if (bufferedBytes(state) - (previous?.bytes ?? 0) + bytes <= 52428800) {
						if (previous) takePending(state, previous);
						const socket = c.socket;
						const entry = {
							group: live.group,
							key: live.coalesce.key,
							payload: nextPayload,
							bytes,
							isCurrent: live.isCurrent,
							send: () => broadcastInternal(event, nextPayload, opts, targetConnIds, explicitPluginScope, {
								client: c,
								socket,
								base
							})
						};
						let group = state.groups.get(live.group);
						if (!group) {
							const entries = /* @__PURE__ */ new Map();
							const retire = () => {
								for (const pending of entries.values()) takePending(state, pending);
							};
							group = {
								entries,
								retire
							};
							state.groups.set(live.group, group);
							live.group.addEventListener("abort", retire, { once: true });
						}
						group.entries.set(entry.key, entry);
						state.pending.add(entry);
						state.bytes += bytes;
						continue;
					}
				} catch (err) {
					log$3.error(`broadcast serialization failed for event ${event}: ${formatErrorMessage(err)}`);
					return;
				}
				drain(state, live.group);
				broadcastInternal(event, payload, opts, targetConnIds, explicitPluginScope, {
					client: c,
					socket: c.socket,
					base: getFrameBase()
				});
				continue;
			}
			let frame;
			try {
				if (!sessionProjectionPrepared) {
					getFrameFields();
					let canSkipSourcePayload = false;
					if (!retained && (event === "session.message" || event === "sessions.changed") && !isProxy(payload) && isRecord(payload)) {
						const prototype = Object.getPrototypeOf(payload);
						canSkipSourcePayload = (prototype === null || prototype === Object.prototype) && !("toJSON" in payload);
					}
					if (!canSkipSourcePayload) getFrameBase();
					projectSession = params.prepareSessionEventProjection?.(event, payload, {
						sessionKeys,
						agentId
					});
					skipSourcePayload = canSkipSourcePayload && projectSession !== void 0;
					sessionProjectionPrepared = true;
				}
				const base = skipSourcePayload ? getFrameFields() : getFrameBase();
				let payloadFragment = frameBase?.payloadFragment ?? "";
				if (presencePayload) {
					if (!params.preparePresenceProjection) throw new Error("presence recipient projection unavailable");
					projectPresence ??= params.preparePresenceProjection(presencePayload.presence);
					payloadFragment = serializeFrameField("payload", {
						...presencePayload,
						presence: projectPresence(c)
					});
				}
				if (projectSession) {
					const projected = projectSession(c);
					if (projected === void 0) continue;
					payloadFragment = serializeFrameField("payload", projected);
				}
				const recipientProfileId = (c.connect.role ?? "operator") === "operator" ? c.preparedRecipientProfileId : void 0;
				if (!presencePayload && !projectSession && lastFrame !== void 0 && lastFrameSequence === nextSeq && lastFrameRecipientProfileId === recipientProfileId) frame = lastFrame;
				else {
					frame = frameWithSequence(base, nextSeq, payloadFragment, recipientProfileId);
					if (!presencePayload && !projectSession) {
						lastFrameSequence = nextSeq;
						lastFrameRecipientProfileId = recipientProfileId;
						lastFrame = frame;
					}
				}
			} catch (err) {
				log$3.error(`broadcast serialization failed for event ${event}: ${formatErrorMessage(err)}`);
				return;
			}
			clientSeq.set(c, nextSeq);
			state.inFlight += 1;
			let finished = false;
			const sent = (err) => {
				if (finished) return;
				finished = true;
				state.inFlight -= 1;
				if (state.retired) return;
				if (err) {
					state.retired = true;
					clearPending(state);
					log$3.error(`broadcast send failed conn=${c.connId}: ${formatErrorMessage(err)}`, { event });
					state.socket.terminate();
				} else drain(state);
			};
			try {
				state.socket.send(frame, sent);
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
		const state = deliveryFor(client);
		return state.retired ? void 0 : bufferedBytes(state);
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
//#region src/gateway/server-connection-work.ts
/** Owns received work and connection cleanup until this Gateway generation settles. */
var GatewayConnectionWork = class extends AsyncWorkScope {
	constructor(..._args) {
		super(..._args);
		this.spawnBroker = getSpawnBroker();
		this.connections = /* @__PURE__ */ new Set();
	}
	track(run) {
		return runWithSpawnBroker(this.spawnBroker, () => super.track(run));
	}
	trackCleanup(run) {
		return this.track(async () => {
			try {
				await run();
			} catch (error) {
				this.failure ??= { error };
				throw error;
			}
		});
	}
	registerConnection(close) {
		const closed = createDeferredCore();
		this.connections.add(close);
		this.track(() => closed.promise);
		return () => {
			this.connections.delete(close);
			closed.resolve();
		};
	}
	async drain() {
		this.beginClose();
		for (const close of this.connections) {
			this.connections.delete(close);
			try {
				close();
			} catch (error) {
				this.failure ??= { error };
			}
		}
		await super.drain();
		if (this.failure) throw new Error("Gateway connection work failed to close cleanly", { cause: this.failure.error });
	}
};
//#endregion
//#region src/gateway/server/client-registry.ts
var GatewayClientRegistry = class extends Set {
	#byConnectionId = /* @__PURE__ */ new Map();
	#nextOrder = 0;
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
	constructor(clients) {
		super();
		for (const client of clients ?? []) this.add(client);
	}
	add(client) {
		if (!this.has(client)) this.#byConnectionId.set(client.connId, {
			client,
			order: this.#nextOrder++
		});
		return super.add(client);
	}
	delete(client) {
		if (!super.delete(client)) return false;
		if (this.#byConnectionId.get(client.connId)?.client === client) this.#byConnectionId.delete(client.connId);
		return true;
	}
	clear() {
		super.clear();
		this.#byConnectionId.clear();
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
	const clients = new GatewayClientRegistry();
	const isConnectionActive = (connId) => {
		const client = clients.getByConnectionId(connId);
		return Boolean(client && !client.invalidated);
	};
	const sessionEventSubscribers = createSessionEventSubscriberRegistry(isConnectionActive);
	const sessionMessageSubscribers = createSessionMessageSubscriberRegistry(isConnectionActive);
	const eventWebPush = createEventWebPushDelivery({ getRuntimeConfig: loadRuntimeConfig });
	const gatewayBroadcaster = createGatewayBroadcaster({
		clients,
		preparePresenceProjection: (presence) => createPresenceRecipientProjection({
			cfg: loadRuntimeConfig(),
			presence
		}),
		sessionMessageSubscribers,
		canReceiveSessionEvent: (client, sessionKeys, agentId, event, payload) => {
			try {
				const projection = sessionRowProjection;
				const cfg = loadRuntimeConfig();
				const prepared = projection ? {
					sharing: prepareProjectedSessionSharing({
						cfg,
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
			if (!projection || event !== "sessions.changed" && event !== "session.message" || !isRecord(payload)) return;
			const source = payload;
			if (source.reason === "delete" || typeof source.sessionKey !== "string") return;
			const scope = resolveSessionEventAgentScope(loadRuntimeConfig(), source.sessionKey, typeof source.agentId === "string" ? source.agentId : eventScope.agentId);
			if (!scope?.[1] || !scope[0] && !scope[2] && !parseAgentSessionKey(source.sessionKey)) return;
			const query = {
				key: source.sessionKey,
				agentId: scope[1]
			};
			const record = projection.describe(query);
			if (!record || typeof source.sessionId === "string" && source.sessionId !== record.entry.sessionId) return () => void 0;
			const base = isRecord(source.session) ? source : {
				...buildGatewaySessionSnapshot({
					sessionRow: projection.snapshot(query).row,
					agentId: scope[0],
					includeSession: true
				}),
				...source
			};
			const sourceRow = base.session;
			if (!isRecord(sourceRow) || sourceRow.sessionId !== record.entry.sessionId || sourceRow.lifecycleRevision !== void 0 && sourceRow.lifecycleRevision !== record.entry.lifecycleRevision) return () => void 0;
			const now = Date.now();
			const ancestors = projection.ancestorRows(record);
			return (client) => {
				if (!projection.isCurrent(record)) return;
				const { projectedAgentRuns } = projection.state.rowContext;
				const presentation = prepareProjectedSessionPresentation(projection, client, now, (selection) => resolveVisibleActiveSessionRunState({
					...selection,
					context: { chatAbortControllers },
					projectedAgentRunIndex: projectedAgentRuns
				}));
				const enrichment = {
					includeDerivedTitles: true,
					includeLastMessage: true
				};
				const { row } = presentation.snapshot(query, enrichment);
				if (!row) return;
				return {
					...base,
					session: row,
					ancestorSessions: ancestors?.every((ancestor) => projection.isCurrent(ancestor)) ? ancestors.flatMap((ancestor) => {
						if (presentation.sharing.entryFilter?.(ancestor.key, ancestor.entry) === false) return [];
						const presented = presentation.present(ancestor, enrichment);
						return presented ? [presented] : [];
					}) : void 0,
					visibility: row.visibility,
					sharingRole: row.sharingRole,
					...isRecord(base.activitySummary) && row.activitySummary ? { activitySummary: {
						...base.activitySummary,
						canEnsure: row.activitySummary.canEnsure
					} } : {}
				};
			};
		},
		onBroadcast: (event, payload, opts) => eventWebPush.handleEvent(event, payload, opts)
	});
	const mentionInbox = createMentionInbox({
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
	const chatRunState = createChatRunState();
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
			return () => {
				if (sessionRowProjection === projection) sessionRowProjection = void 0;
			};
		},
		clients,
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
//#region src/gateway/control-ui-asset-manifest.ts
const CONTROL_UI_ASSET_MANIFEST_FILENAME = "asset-manifest.json";
function hashControlUiAssetManifestEntries(entries) {
	const hash = createHash("sha256");
	for (const entry of entries) {
		hash.update(entry.path);
		hash.update("\0");
		hash.update(String(entry.size));
		hash.update("\0");
		hash.update(entry.sha256);
		hash.update("\n");
	}
	return hash.digest("hex");
}
//#endregion
//#region src/gateway/control-ui-asset-manifest-parse.ts
const CONTROL_UI_ASSET_SHA256_PATTERN = /^[a-f0-9]{64}$/u;
const CONTROL_UI_ASSET_MANIFEST_MAX_ENTRIES = 8192;
const CONTROL_UI_ASSET_MANIFEST_MAX_FILE_BYTES = 67108864;
const CONTROL_UI_ASSET_MANIFEST_MAX_TOTAL_BYTES = 536870912;
function hasExactKeys(record, keys) {
	const actual = Object.keys(record);
	return actual.length === keys.length && actual.every((key) => keys.includes(key));
}
function isControlUiAssetManifestPath(value) {
	if (!value.startsWith("assets/") || value.includes("\\") || value.includes("\0")) return false;
	const normalized = path.posix.normalize(value);
	return normalized === value && !normalized.endsWith("/");
}
function parseControlUiAssetManifest(value) {
	if (!isRecord(value) || !hasExactKeys(value, [
		"assets",
		"generation",
		"version"
	])) return null;
	if (value.version !== 1 || typeof value.generation !== "string" || !CONTROL_UI_ASSET_SHA256_PATTERN.test(value.generation) || !Array.isArray(value.assets) || value.assets.length === 0 || value.assets.length > CONTROL_UI_ASSET_MANIFEST_MAX_ENTRIES) return null;
	const assets = [];
	const paths = /* @__PURE__ */ new Set();
	let totalBytes = 0;
	for (const candidate of value.assets) {
		if (!isRecord(candidate) || !hasExactKeys(candidate, [
			"path",
			"sha256",
			"size"
		])) return null;
		const assetPath = candidate.path;
		const size = candidate.size;
		const sha256 = candidate.sha256;
		if (typeof assetPath !== "string" || !isControlUiAssetManifestPath(assetPath) || paths.has(assetPath) || typeof size !== "number" || !Number.isSafeInteger(size) || size < 0 || size > CONTROL_UI_ASSET_MANIFEST_MAX_FILE_BYTES || typeof sha256 !== "string" || !CONTROL_UI_ASSET_SHA256_PATTERN.test(sha256)) return null;
		totalBytes += size;
		if (totalBytes > CONTROL_UI_ASSET_MANIFEST_MAX_TOTAL_BYTES) return null;
		paths.add(assetPath);
		assets.push({
			path: assetPath,
			sha256,
			size
		});
	}
	for (let index = 1; index < assets.length; index += 1) if (assets[index - 1].path.localeCompare(assets[index].path) > 0) return null;
	if (hashControlUiAssetManifestEntries(assets) !== value.generation) return null;
	return {
		version: 1,
		generation: value.generation,
		assets
	};
}
//#endregion
//#region src/gateway/control-ui-asset-retention.ts
const CONTROL_UI_RETAINED_GENERATION_LIMIT = 3;
const CONTROL_UI_RETAINED_ASSET_MAX_BYTES = 100663296;
const CONTROL_UI_GENERATION_PATTERN = /^[a-f0-9]{64}$/u;
const CONTROL_UI_STAGING_PATTERN = /^\.staging-[0-9]+-[a-f0-9-]+$/u;
const CONTROL_UI_STAGING_MAX_AGE_MS = 36e5;
const CONTROL_UI_MANIFEST_MAX_BYTES = 4194304;
const log$2 = createSubsystemLogger("gateway/control-ui-assets");
function resolveControlUiAssetCacheDir() {
	return path.join(resolveStateDir(), "cache", "control-ui-assets");
}
async function readCachedGeneration(directory, signal) {
	try {
		signal?.throwIfAborted();
		const stats = await fs$1.lstat(directory);
		if (stats.isSymbolicLink() || !stats.isDirectory()) return null;
		const realPath = await fs$1.realpath(directory);
		if (!isWithinDir(path.dirname(directory), realPath)) return null;
		const manifest = await readAssetManifest(realPath, signal);
		if (manifest.generation !== path.basename(directory)) return null;
		for (const asset of manifest.assets) await verifyAsset({
			entry: asset,
			signal,
			root: realPath,
			rootRealPath: realPath
		});
		const currentStats = await fs$1.lstat(directory);
		signal?.throwIfAborted();
		if (!sameDirectory(stats, currentStats)) return null;
		return {
			assetPaths: new Set(manifest.assets.map((asset) => asset.path)),
			bytes: manifest.assets.reduce((total, asset) => total + asset.size, 0),
			directory,
			generation: manifest.generation,
			stats: currentStats,
			realPath
		};
	} catch {
		signal?.throwIfAborted();
		return null;
	}
}
function sameDirectory(left, right) {
	return right.isDirectory() && !right.isSymbolicLink() && left.dev === right.dev && left.ino === right.ino;
}
function compareGenerations(left, right) {
	return right.stats.mtimeMs - left.stats.mtimeMs || left.generation.localeCompare(right.generation);
}
async function readCacheInventory(cacheDir, signal, verified = []) {
	const generations = [];
	const directories = /* @__PURE__ */ new Map();
	let cacheRealPath;
	let entries;
	try {
		signal?.throwIfAborted();
		cacheRealPath = await fs$1.realpath(cacheDir);
		entries = await fs$1.readdir(cacheRealPath, { withFileTypes: true });
	} catch {
		signal?.throwIfAborted();
		return {
			generations,
			directories
		};
	}
	const known = new Map(verified.map((generation) => [generation.generation, generation]));
	for (const entry of entries) {
		signal?.throwIfAborted();
		if (!entry.isDirectory() || entry.isSymbolicLink()) continue;
		const directory = path.join(cacheRealPath, entry.name);
		const stats = await fs$1.lstat(directory).catch(() => null);
		if (!stats || !stats.isDirectory() || stats.isSymbolicLink()) continue;
		directories.set(directory, stats);
		if (!CONTROL_UI_GENERATION_PATTERN.test(entry.name)) continue;
		const previous = known.get(entry.name);
		const generation = previous && sameDirectory(previous.stats, stats) ? {
			...previous,
			stats
		} : await readCachedGeneration(directory, signal);
		if (generation) generations.push(generation);
	}
	signal?.throwIfAborted();
	return {
		generations: generations.toSorted(compareGenerations),
		directories
	};
}
async function readAssetManifest(root, signal) {
	const manifestPath = path.join(root, CONTROL_UI_ASSET_MANIFEST_FILENAME);
	signal?.throwIfAborted();
	const stats = await fs$1.lstat(manifestPath);
	signal?.throwIfAborted();
	if (stats.isSymbolicLink() || !stats.isFile() || stats.size > CONTROL_UI_MANIFEST_MAX_BYTES) throw new Error(`Invalid Control UI asset manifest: ${manifestPath}`);
	const manifest = parseControlUiAssetManifest(JSON.parse(await fs$1.readFile(manifestPath, {
		encoding: "utf8",
		signal
	})));
	signal?.throwIfAborted();
	if (!manifest) throw new Error(`Invalid Control UI asset manifest: ${manifestPath}`);
	return manifest;
}
async function verifyAsset(params) {
	params.signal?.throwIfAborted();
	const sourcePath = path.resolve(params.root, params.entry.path);
	if (!isWithinDir(params.root, sourcePath)) throw new Error(`Unsafe Control UI asset path: ${params.entry.path}`);
	const expectedRealPath = await fs$1.realpath(sourcePath);
	if (!isWithinDir(params.rootRealPath, expectedRealPath)) throw new Error(`Unsafe Control UI asset path: ${params.entry.path}`);
	const initialStats = await fs$1.lstat(sourcePath);
	if (initialStats.isSymbolicLink() || !initialStats.isFile()) throw new Error(`Unsafe Control UI asset: ${params.entry.path}`);
	const source = await fs$1.open(sourcePath, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
	let destination;
	try {
		if (params.destination) destination = await fs$1.open(params.destination, constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | (constants.O_NOFOLLOW ?? 0), 384);
		const options = {
			maxBytes: params.entry.size,
			signal: params.signal
		};
		let bytes;
		let digest;
		if (destination) {
			const hash = createHash("sha256");
			bytes = await copyFileHandle(source, destination, {
				...options,
				onChunk: (chunk) => {
					hash.update(chunk);
				}
			});
			digest = hash.digest("hex");
		} else ({bytes, digest} = await sha256File(source, options));
		const openedStats = await source.stat();
		const currentStats = await fs$1.lstat(sourcePath);
		const currentRealPath = await fs$1.realpath(sourcePath);
		if (!openedStats.isFile() || openedStats.size !== params.entry.size || currentStats.isSymbolicLink() || !currentStats.isFile() || currentRealPath !== expectedRealPath || currentStats.dev !== openedStats.dev || currentStats.ino !== openedStats.ino || bytes !== params.entry.size || digest !== params.entry.sha256) throw new Error(`Control UI asset changed while being retained: ${params.entry.path}`);
		params.signal?.throwIfAborted();
	} finally {
		await Promise.allSettled([source.close(), destination?.close()]);
	}
}
async function publishGeneration(params) {
	const target = path.join(await fs$1.realpath(params.cacheDir), params.manifest.generation);
	const stats = await fs$1.lstat(target).catch((error) => {
		if (!isErrno(error) || error.code !== "ENOENT") throw error;
		return null;
	});
	const verified = stats && (params.verified && sameDirectory(params.verified.stats, stats) ? params.verified : await readCachedGeneration(target, params.signal));
	if (verified) {
		params.signal?.throwIfAborted();
		await fs$1.utimes(target, /* @__PURE__ */ new Date(), /* @__PURE__ */ new Date());
		return verified;
	}
	const staging = path.join(params.cacheDir, `.staging-${process.pid}-${randomUUID()}`);
	params.signal?.throwIfAborted();
	await fs$1.mkdir(staging, {
		recursive: false,
		mode: 448
	});
	try {
		const rootRealPath = await fs$1.realpath(params.root);
		let preparedDirectory;
		for (const entry of params.manifest.assets) {
			params.signal?.throwIfAborted();
			const destination = path.join(staging, entry.path);
			const directory = path.dirname(destination);
			if (directory !== preparedDirectory) {
				await fs$1.mkdir(directory, {
					recursive: true,
					mode: 448
				});
				preparedDirectory = directory;
			}
			await verifyAsset({
				destination,
				entry,
				signal: params.signal,
				root: params.root,
				rootRealPath
			});
		}
		params.signal?.throwIfAborted();
		await fs$1.writeFile(path.join(staging, CONTROL_UI_ASSET_MANIFEST_FILENAME), `${JSON.stringify(params.manifest)}\n`, {
			mode: 384,
			signal: params.signal
		});
		params.signal?.throwIfAborted();
		let collision;
		try {
			await fs$1.rename(staging, target);
		} catch (error) {
			const collisionCodes = process.platform === "win32" ? [
				"EEXIST",
				"ENOTEMPTY",
				"EPERM"
			] : ["EEXIST", "ENOTEMPTY"];
			if (!isErrno(error) || !collisionCodes.includes(error.code ?? "")) throw error;
			collision = error;
		}
		const published = await readCachedGeneration(target, params.signal);
		if (!published) throw collision ?? /* @__PURE__ */ new Error(`Invalid retained Control UI generation: ${target}`);
		params.signal?.throwIfAborted();
		await fs$1.utimes(target, /* @__PURE__ */ new Date(), /* @__PURE__ */ new Date());
		return published;
	} finally {
		await fs$1.rm(staging, {
			recursive: true,
			force: true
		});
	}
}
async function pruneRetainedGenerations(params) {
	const inventory = await readCacheInventory(params.cacheDir, params.signal, params.verified);
	const generations = inventory.generations.toSorted((left, right) => {
		if (left.generation === params.currentGeneration) return -1;
		if (right.generation === params.currentGeneration) return 1;
		return compareGenerations(left, right);
	});
	const retained = /* @__PURE__ */ new Set();
	let retainedBytes = 0;
	for (const generation of generations) if (retained.size < CONTROL_UI_RETAINED_GENERATION_LIMIT && retainedBytes + generation.bytes <= CONTROL_UI_RETAINED_ASSET_MAX_BYTES) {
		retained.add(generation.generation);
		retainedBytes += generation.bytes;
	}
	for (const [target, stats] of inventory.directories) {
		params.signal?.throwIfAborted();
		const name = path.basename(target);
		const generation = CONTROL_UI_GENERATION_PATTERN.test(name);
		const staleStaging = CONTROL_UI_STAGING_PATTERN.test(name) && params.now - stats.mtimeMs >= CONTROL_UI_STAGING_MAX_AGE_MS;
		if ((!generation || retained.has(name)) && !staleStaging) continue;
		const currentStats = await fs$1.lstat(target).catch(() => null);
		params.signal?.throwIfAborted();
		if (!currentStats || !sameDirectory(stats, currentStats) || stats.mtimeMs !== currentStats.mtimeMs) continue;
		const staging = path.join(params.cacheDir, `.staging-${process.pid}-${randomUUID()}`);
		let owned = false;
		let claimed = false;
		try {
			await fs$1.mkdir(staging, { mode: 448 });
			owned = true;
			params.signal?.throwIfAborted();
			await fs$1.rename(target, path.join(staging, name));
			claimed = true;
			await fs$1.rm(staging, {
				recursive: true,
				force: true
			});
			log$2.debug("Control UI asset pruning completed", {
				directory: target,
				outcome: "pruned"
			});
		} catch (error) {
			params.signal?.throwIfAborted();
			const gone = !claimed && await fs$1.lstat(target).then(() => false, (cause) => isErrno(cause) && cause.code === "ENOENT");
			log$2[gone ? "debug" : "warn"]("Control UI asset pruning outcome", {
				directory: target,
				outcome: gone ? "already-pruned" : "deferred",
				error: String(error)
			});
		} finally {
			if (owned && !claimed) await fs$1.rm(staging, {
				recursive: true,
				force: true
			}).catch((error) => {
				log$2.warn("Control UI asset pruning cleanup deferred", {
					directory: staging,
					outcome: "deferred",
					error: String(error)
				});
			});
		}
	}
	const survivors = [];
	for (const generation of inventory.generations) {
		if (!retained.has(generation.generation)) continue;
		const stats = await fs$1.lstat(generation.directory).catch(() => null);
		params.signal?.throwIfAborted();
		if (stats && sameDirectory(generation.stats, stats)) survivors.push({
			...generation,
			stats
		});
	}
	return survivors.toSorted(compareGenerations);
}
function createControlUiAssetRetention(root) {
	const cacheDir = resolveControlUiAssetCacheDir();
	let generations = [];
	let preparing;
	return {
		prepare({ signal } = {}) {
			preparing ??= (async () => {
				signal?.throwIfAborted();
				await fs$1.mkdir(cacheDir, {
					recursive: true,
					mode: 448
				});
				await fs$1.chmod(cacheDir, 448);
				const inventory = await readCacheInventory(cacheDir, signal);
				signal?.throwIfAborted();
				generations = inventory.generations;
				const verified = [...generations];
				const manifest = await readAssetManifest(root, signal);
				const manifestBytes = manifest.assets.reduce((total, asset) => total + asset.size, 0);
				if (manifestBytes <= CONTROL_UI_RETAINED_ASSET_MAX_BYTES) {
					const published = await publishGeneration({
						cacheDir,
						manifest,
						signal,
						root,
						verified: verified.find((entry) => entry.generation === manifest.generation)
					});
					verified.push(published);
				}
				const survivors = await pruneRetainedGenerations({
					cacheDir,
					verified,
					currentGeneration: manifestBytes <= CONTROL_UI_RETAINED_ASSET_MAX_BYTES ? manifest.generation : void 0,
					now: Date.now(),
					signal
				});
				signal?.throwIfAborted();
				generations = survivors;
			})().catch((error) => {
				preparing = void 0;
				throw error;
			});
			return preparing;
		},
		resolveAsset(assetPath) {
			for (const generation of generations) {
				if (!generation.assetPaths.has(assetPath)) continue;
				return {
					filePath: path.join(generation.directory, assetPath),
					rootPath: generation.directory,
					rootRealPath: generation.realPath
				};
			}
			return null;
		}
	};
}
//#endregion
//#region src/gateway/server-control-ui-root.ts
function resolveAutoRoot() {
	return resolveControlUiRootSync({
		moduleUrl: import.meta.url,
		argv1: process.argv[1],
		cwd: process.cwd()
	});
}
function prepareResolvedRootState({ root, configured = false, publicAssetBuildId, log }) {
	try {
		const bundled = !configured && isPackageProvenControlUiRootSync(root, {
			moduleUrl: import.meta.url,
			argv1: process.argv[1],
			cwd: process.cwd()
		});
		const resolvedRoot = {
			path: root,
			realPath: fs.realpathSync(root)
		};
		return bundled ? {
			kind: "bundled",
			...resolvedRoot,
			publicAssetBuildId,
			retainedAssets: createControlUiAssetRetention(root)
		} : {
			kind: "resolved",
			...resolvedRoot
		};
	} catch (error) {
		const message = `Control UI assets are unavailable at ${root}: ${error instanceof Error ? error.message : String(error)}`;
		log.warn(`gateway: ${message}`);
		return configured ? {
			kind: "invalid",
			path: path.resolve(root)
		} : { kind: "failed" };
	}
}
/** Prepare the stable root reference shared by every HTTP listener. */
function createGatewayControlUiRootLifecycle(params) {
	const expectedBuildId = resolveRuntimeServiceBuildId();
	let state = { kind: "preparing" };
	if (params.controlUiRootOverride) {
		const resolvedOverride = resolveControlUiRootOverrideSync(params.controlUiRootOverride);
		const resolvedOverridePath = path.resolve(params.controlUiRootOverride);
		if (!resolvedOverride) {
			params.log.warn(`gateway: controlUi.root not found at ${resolvedOverridePath}`);
			state = {
				kind: "invalid",
				path: resolvedOverridePath
			};
		} else state = prepareResolvedRootState({
			root: resolvedOverride,
			configured: true,
			log: params.log
		});
	} else if (params.controlUiEnabled) {
		const resolvedRoot = resolveAutoRoot();
		const assets = resolvedRoot ? inspectControlUiRootAssets(resolvedRoot, expectedBuildId) : null;
		state = resolvedRoot && assets?.kind === "ready" ? prepareResolvedRootState({
			root: resolvedRoot,
			publicAssetBuildId: assets.publicAssetBuildId,
			log: params.log
		}) : { kind: "preparing" };
	}
	let enabled = params.controlUiEnabled;
	let stopped = false;
	let preparation;
	const prepare = async (signal) => {
		const isStopped = () => stopped || signal.aborted;
		if (isStopped()) return;
		try {
			if (state.kind === "preparing") {
				const resolvedRoot = resolveAutoRoot();
				let assets = resolvedRoot ? inspectControlUiRootAssets(resolvedRoot, expectedBuildId) : null;
				if (assets?.kind !== "ready") {
					const result = await ensureControlUiAssetsBuilt(params.gatewayRuntime, {
						assetRoot: resolvedRoot ?? void 0,
						expectedBuildId,
						moduleUrl: import.meta.url,
						signal
					});
					if (isStopped()) return;
					if (!result.ok) {
						Object.assign(state, { kind: "failed" });
						params.log.warn(`gateway: ${result.message}`);
						return;
					}
					assets = result.assets;
				}
				Object.assign(state, prepareResolvedRootState({
					root: path.dirname(assets.indexPath),
					publicAssetBuildId: assets.publicAssetBuildId,
					log: params.log
				}));
			}
		} catch (error) {
			if (!isStopped()) {
				Object.assign(state, { kind: "failed" });
				const detail = error instanceof Error ? error.message : String(error);
				params.log.warn(`gateway: Control UI assets build failed: ${detail}`);
			}
			return;
		}
		if (state.kind === "bundled") await state.retainedAssets?.prepare({ signal }).catch((error) => {
			if (isStopped()) return;
			const detail = error instanceof Error ? error.message : String(error);
			params.log.warn(`gateway: Control UI asset retention failed: ${detail}`);
		});
	};
	const start = () => {
		if (!enabled || stopped) return Promise.resolve();
		if (preparation) return preparation.controller.signal.aborted ? preparation.promise.then(start) : preparation.promise;
		const controller = new AbortController();
		const signal = AbortSignal.any([controller.signal, getGatewayRestartDrainSignal()]);
		const promise = runOutsideGatewayRootWorkAdmission(() => Promise.resolve().then(() => prepare(signal))).finally(() => {
			preparation = void 0;
		});
		preparation = {
			controller,
			promise
		};
		return promise;
	};
	return {
		state,
		start,
		setEnabled: (nextEnabled) => {
			if (stopped || enabled === nextEnabled) return;
			enabled = nextEnabled;
			if (enabled) {
				if (state.kind === "failed") Object.assign(state, { kind: "preparing" });
				start();
			} else preparation?.controller.abort();
		},
		stop: async () => {
			stopped = true;
			preparation?.controller.abort();
			await preparation?.promise;
		}
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
function createGatewayEventLoopHealthMonitor(deps = {}) {
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
		const timeout = setTimeout(() => {
			active = false;
		}, WORKER_CPU_SAMPLE_BUDGET_MS);
		timeout.unref();
		cancelWorkerCpuSample = () => {
			active = false;
			clearTimeout(timeout);
		};
		const readings = workers.map(async (worker) => {
			try {
				return await worker.cpuUsage();
			} catch {
				return;
			}
		});
		Promise.all(readings).then((usage) => {
			clearTimeout(timeout);
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
	const timer = histogram ? setInterval(sample, EVENT_LOOP_MONITOR_RESOLUTION_MS) : void 0;
	timer?.unref();
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
			clearInterval(timer);
			histogram = null;
			cancelWorkerCpuSample?.();
			lastWorkerCpuWindow = void 0;
			lastSnapshot = void 0;
			firstDegradedAtMs = null;
		}
	};
}
//#endregion
//#region src/gateway/server/readiness.ts
const DEFAULT_READINESS_CACHE_TTL_MS = 1e3;
/** Create a startup checker that excludes downstream channel health. */
function createStartupChecker(deps) {
	return () => {
		const uptimeMs = Date.now() - deps.startedAt;
		if (deps.getGatewayDraining?.()) return {
			ok: false,
			status: "draining",
			uptimeMs
		};
		if (deps.getStartupPending?.()) return {
			ok: false,
			status: "starting",
			uptimeMs,
			pendingReason: deps.getStartupPendingReason?.() ?? "startup-sidecars"
		};
		return {
			ok: true,
			status: "started",
			uptimeMs
		};
	};
}
function shouldIgnoreReadinessFailure(accountSnapshot, health, autostartSuppressed) {
	if (health.reason === "unmanaged" || health.reason === "stale-socket") return true;
	if (autostartSuppressed && health.reason === "not-running") return true;
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
	return () => {
		const startup = getStartup();
		const uptimeMs = startup.uptimeMs;
		const now = startedAt + uptimeMs;
		if (startup.status === "starting") return withEventLoopHealth({
			ready: false,
			failing: [startup.pendingReason],
			uptimeMs
		}, deps.getEventLoopHealth);
		if (startup.status === "draining") return withEventLoopHealth({
			ready: false,
			failing: ["gateway-draining"],
			uptimeMs
		}, deps.getEventLoopHealth);
		const agentDatabases = deps.getAgentDatabaseAdmissionRefusals?.();
		if (agentDatabases?.length) {
			cachedState = null;
			return withEventLoopHealth({
				ready: false,
				failing: agentDatabases.map(({ agentId }) => `agent-database:${agentId}`),
				agentDatabases,
				uptimeMs
			}, deps.getEventLoopHealth);
		}
		const pluginReload = deps.getPluginReloadStatus?.();
		if (pluginReload) {
			cachedState = null;
			return withEventLoopHealth({
				ready: false,
				failing: ["plugin-reload"],
				pluginReload,
				uptimeMs
			}, deps.getEventLoopHealth);
		}
		if (cachedState && !isFutureDateTimestampMs(cachedAt, { nowMs: now }) && now - cachedAt < cacheTtlMs) return withEventLoopHealth({
			...cachedState,
			uptimeMs
		}, deps.getEventLoopHealth);
		if (deps.getStateDatabaseFailure?.()) return withEventLoopHealth({
			ready: false,
			failing: ["state-database"],
			uptimeMs
		}, deps.getEventLoopHealth);
		if (deps.shouldSkipChannelReadiness?.()) return withEventLoopHealth({
			ready: true,
			failing: [],
			uptimeMs
		}, deps.getEventLoopHealth);
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
				if (!health.healthy && !shouldIgnoreReadinessFailure(accountSnapshot, health, autostartSuppressed)) {
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
		return withEventLoopHealth({
			...cachedState,
			uptimeMs
		}, deps.getEventLoopHealth);
	};
}
function withEventLoopHealth(result, getEventLoopHealth) {
	const eventLoop = getEventLoopHealth?.();
	return eventLoop ? {
		...result,
		eventLoop
	} : result;
}
//#endregion
//#region src/gateway/server-runtime-state-prepare.ts
async function prepareGatewayKernelState(params) {
	const { bootstrap, bootId, port, opts, log, logChannels, logHooks, logPlugins, gatewayRuntime, resolveChannelRuntime: getChannelRuntime, loadWorkerEnvironmentStartupModule, loadWorkerPlacementStartupModule } = params;
	const { pluginBootstrap, workerEnvironmentStartup, startupTrace, cfgAtStart, resolvedStartupAuthOverride, startupTailscaleOverride, ambientAutostartSuppressedChannelIds, minimalTestGateway, pluginGatewayContext, resolvePluginGatewayContext } = bootstrap;
	const pluginRuntime = Object.assign(params.pluginRegistryOwner, { baseGatewayMethods: pluginBootstrap.baseGatewayMethods });
	const listGatewayStartupChannelPlugins = (registry = pluginRuntime.registry) => listLoadedChannelPluginsForRegistry(registry);
	const desktopSessionRegistry = createDesktopSessionRegistry();
	const nodeDesktopStreamBroker = (await startupTrace.measure("node-desktop.runtime-import", () => import("./node-stream-broker-6LJAm8R5.mjs"))).createNodeDesktopStreamBroker();
	const hostDesktopService = (await startupTrace.measure("host-desktop.runtime-import", () => import("./host-source-DQb1Z5IW.mjs"))).createHostDesktopService({
		getConfig: () => getRuntimeConfig().desktop?.host,
		registry: desktopSessionRegistry
	});
	const gatewayComputerService = (await startupTrace.measure("computer.runtime-import", () => import("./computer-service-Bz9CorXX.mjs"))).createGatewayComputerService({
		getConfig: getRuntimeConfig,
		getPluginRegistry: () => pluginRuntime.registry,
		hostDesktopService
	});
	const workerEnvironmentRuntime = workerEnvironmentStartup ? await startupTrace.measure("worker-environments.runtime-imports", async () => {
		return await (await loadWorkerEnvironmentStartupModule()).createGatewayWorkerEnvironmentRuntime({
			getPluginRegistry: () => pluginRuntime.registry,
			getPortalRuntime: () => pluginGatewayContext.current,
			resolveGatewayContext: resolvePluginGatewayContext,
			desktopSessionRegistry,
			nodeDesktopStreamBroker,
			startup: workerEnvironmentStartup,
			log
		});
	}) : {};
	const { workerEnvironmentService, workerLiveEvents, nodeWorkerGatewayNamespace, nodeWorkerBundleRetention, bindDeviceNodeControl, bindWorkerNodeDesktopControl, bindNodeWorkspaceBindingResolver, handleNodeWorkerBundleTransferRequest, handleWorkerBootstrapArtifactTransferRequest, handleNodeWorkspaceTransferRequest } = workerEnvironmentRuntime;
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
	const workerPlacementRuntime = workerEnvironmentService && workerEnvironmentStartup && nodeWorkerGatewayNamespace && workerPlacementModule ? await startupTrace.measure("worker-environments.placement-runtime", async () => workerPlacementModule.createGatewayWorkerPlacementRuntime({
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
			const { cancelGatewayWorkerSessionWork } = await import("./server-worker-placement-cancel-B3-PqlXq.mjs");
			await cancelGatewayWorkerSessionWork(context, request);
		},
		revokeSessionAuthority: (request) => workerDispatchAuthority.revoke(request),
		info: (message) => log.info(message),
		warn: (message) => log.warn(message),
		...githubPublicationRuntime ? { githubPublicationRuntime } : {}
	})) : void 0;
	if (workerPlacementRuntime && workerEnvironmentService) {
		const { createDevicePlacementDemandReader } = await import("./device-placement-demand-CgYgs8CE.mjs");
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
	const workerPlacementDispatchAvailable = workerPlacementControlAvailable;
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
	const listActiveGatewayMethods = (nextBaseGatewayMethods) => uniqueStrings([...nextBaseGatewayMethods, ...listStartupChannelGatewayMethods()]).filter((method) => (workerPlacementDispatchAvailable || method !== "sessions.dispatch") && (workerPlacementControlAvailable || method !== "sessions.reclaim" && method !== "sessions.move") && (workerEnvironmentService || method !== "desktop.launch" && method !== "worker.desktop.observe" && method !== "worker.desktop.launch"));
	const runtimeConfig = await startupTrace.measure("runtime.config", async () => {
		const { resolveGatewayRuntimeConfig } = await import("./server-runtime-config-N1jU5b6T.mjs");
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
		const { ensureStartupLocalCliPairing } = await startupTrace.measure("runtime.local-cli-pairing-import", () => import("./startup-local-cli-pairing-BbRqfTaX.mjs"));
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
	const preauthHandshakeTimeoutMs = void 0;
	const initialHooksConfig = runtimeConfig.hooksConfig;
	const initialHookClientIpConfig = resolveHookClientIpConfig(cfgAtStart);
	const rateLimitConfig = cfgAtStart.gateway?.auth?.rateLimit;
	const authRateLimiter = createAuthRateLimiter(rateLimitConfig);
	const browserAuthRateLimiter = createAuthRateLimiter({
		...rateLimitConfig,
		exemptLoopback: false
	});
	const nodeReapprovalCoordinator = createNodeReapprovalCoordinator(rateLimitConfig);
	const controlUiRootLifecycle = await startupTrace.measure("control-ui.root", () => createGatewayControlUiRootLifecycle({
		controlUiRootOverride,
		controlUiEnabled,
		gatewayRuntime,
		log
	}));
	const { createTerminalLaunchPolicy } = await startupTrace.measure("terminal.launch-import", () => import("./launch-DFrm7dl-.mjs"));
	const terminalLaunchPolicy = createTerminalLaunchPolicy(cfgAtStart);
	const { runDefaultChannelSetupWizard, runDefaultSetupWizard } = await startupTrace.measure("gateway.wizard-imports", () => import("./wizard-077MUUB-.mjs"));
	const wizardRunner = opts.wizardRunner ?? runDefaultSetupWizard;
	const channelWizardRunner = opts.channelWizardRunner ?? runDefaultChannelSetupWizard;
	const { wizardSessions, findRunningWizard, purgeWizardSession } = createWizardSessionTracker();
	const systemAgentSessions = /* @__PURE__ */ new Map();
	const deps = createDefaultDeps();
	const runtimeStateRef = { current: null };
	const cronStartState = { handled: false };
	const gatewayTls = await startupTrace.measure("tls.runtime", () => loadGatewayTlsServerRuntime(cfgAtStart.gateway?.tls, log.child("tls")));
	const serverStartedAt = Date.now();
	const readinessEventLoopHealth = createGatewayEventLoopHealthMonitor();
	const startupState = {
		sidecarsReady: minimalTestGateway,
		pendingReason: "startup-sidecars",
		dispatchReady: false
	};
	const lifecycle = { closePreludeStarted: false };
	let releaseStartupAccountStarts = () => {};
	const startupAccountStartsReady = new Promise((resolve) => {
		releaseStartupAccountStarts = resolve;
	});
	const gatewayInstanceRuntimeRef = { current: void 0 };
	const { createChannelManager } = await startupTrace.measure("gateway.channel-manager-import", () => import("./server-channels-BI-B_TQu.mjs"));
	const channelManager = createChannelManager({
		getRuntimeConfig,
		channelLogs,
		channelRuntimeEnvs,
		resolveChannelRuntime: getChannelRuntime,
		getPluginRegistry: () => pluginRuntime.registry,
		startupTrace,
		deferStartupAccountStartsUntil: startupAccountStartsReady,
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
		getGatewayDraining: () => lifecycle.closePreludeStarted || isGatewayDraining()
	};
	const getStartup = createStartupChecker(startupCheckerDeps);
	const getReadiness = createReadinessChecker({
		channelManager,
		...startupCheckerDeps,
		getEventLoopHealth: readinessEventLoopHealth.snapshot,
		getStateDatabaseFailure: () => openClawStateDatabaseCache.getOpenClawStateDatabaseRuntimeFailure(resolveDatabasePath()),
		getAgentDatabaseAdmissionRefusals: () => {
			const cfg = getRuntimeConfig();
			return listAgentDatabaseAdmissionRefusals().filter((refusal) => !canIsolateAgentDatabase(cfg, refusal.agentId));
		},
		getPluginReloadStatus: params.getPluginReloadStatus,
		shouldSkipChannelReadiness: () => isTruthyEnvValue(process.env.OPENCLAW_SKIP_CHANNELS) || isTruthyEnvValue(process.env.OPENCLAW_SKIP_PROVIDERS)
	});
	const watchNodeRequestHandler = {};
	log.info("starting HTTP server...");
	const connectionState = await startupTrace.measure("runtime.state", () => createGatewayConnectionState({
		bootId,
		cfg: cfgAtStart,
		getRuntimeConfig
	}));
	const transportBridge = createGatewayTransportBridge();
	const createHttpTransportOptions = () => ({
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
	const { clients, mentionInbox, broadcast, broadcastToConnIds, broadcastPluginEvent, getBufferedAmount, agentRunSeq, dedupe, chatRunState, addChatRun, removeChatRun, chatAbortControllers, chatQueuedTurns, toolEventRecipients, sessionEventSubscribers, sessionMessageSubscribers, isConnectionActive } = connectionState;
	return {
		...bootstrap,
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
		workerPlacementDispatchAvailable,
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
		preauthHandshakeTimeoutMs,
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
		releaseStartupAccountStarts,
		gatewayInstanceRuntimeRef,
		channelManager,
		sidecarStartup,
		isGatewayStartupPending,
		pluginGatewayContext,
		watchNodeRequestHandler,
		createHttpTransportOptions,
		transportBridge,
		connectionWork: connectionState.connectionWork,
		getSessionRowProjection: connectionState.getSessionRowProjection,
		attachSessionRowProjection: connectionState.attachSessionRowProjection,
		clients,
		mentionInbox,
		broadcast,
		broadcastToConnIds,
		broadcastPluginEvent,
		getBufferedAmount,
		agentRunSeq,
		dedupe,
		chatRunState,
		addChatRun,
		removeChatRun,
		chatAbortControllers,
		chatQueuedTurns,
		toolEventRecipients,
		sessionEventSubscribers,
		sessionMessageSubscribers,
		isConnectionActive
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
	params.log.info(buildSeededOriginsInfoLog(seeded.seededOrigins, seeded.bind));
	return {
		config: seeded.config,
		seededAllowedOrigins: true
	};
}
function buildSeededOriginsInfoLog(origins, bind) {
	return `gateway: seeded gateway.controlUi.allowedOrigins ${JSON.stringify(origins)} for bind=${bind} (required since v2026.2.26; see issue #29385). Applied for this runtime without writing config; add other origins to gateway.controlUi.allowedOrigins if needed.`;
}
//#endregion
//#region src/gateway/server-startup-bootstrap.ts
async function prepareGatewayServerBootstrap(input) {
	try {
		var _usingCtx$1 = _usingCtx();
		const { port, opts, log, logSecrets, loadWorkerEnvironmentStartupModule } = input;
		const { assertConfiguredWorkspaceStateReady } = await import("./workspace-state-dirs-aOPORgKV.mjs");
		process.env.OPENCLAW_GATEWAY_PORT = String(port);
		const envBeforeStartupConfigLoad = { ...process.env };
		const formatRuntimeGatewayAuthTokenWarning = input.formatRuntimeGatewayAuthTokenWarning;
		const traceOriginAt = opts.processStartedAt ?? opts.startupStartedAt;
		const startupElapsedMs = typeof traceOriginAt === "number" ? Math.max(0, Date.now() - traceOriginAt) : 0;
		const startupTrace = createGatewayStartupTrace(log, performance.now() - startupElapsedMs);
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
			const { OPENCLAW_DATABASE_SCHEMA_DOCS_URL, OpenClawDatabaseSchemaPreflightError, preflightOpenClawDatabaseSchemas } = await startupTrace.measure("state.runtime-imports", () => import("./openclaw-database-preflight-DwZaE6VW.mjs"));
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
		const { ensureGlobalUndiciEnvProxyDispatcher } = await startupTrace.measure("runtime.network-imports", () => import("./undici-global-dispatcher-1FrNSK-e.mjs"));
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
		const startupConfigModulePromise = startupTrace.measure("config.runtime-imports", () => import("./server-startup-config-uQI5brH6.mjs"));
		const loadStartupPluginsModule = createLazyPromise(() => import("./server-startup-plugins-DdOdksjM.mjs"), { cacheRejections: true });
		const { applyGatewayAuthOverridesForStartupPreflight, loadGatewayStartupConfigSnapshot } = await startupConfigModulePromise;
		const startupConfigLoad = await startupTrace.measure("config.snapshot", () => loadGatewayStartupConfigSnapshot({
			minimalTestGateway,
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
			...startupConfigLoad.pluginMetadataSnapshot ? { pluginMetadataSnapshot: startupConfigLoad.pluginMetadataSnapshot } : {}
		});
		const startupActivationSourceConfig = configSnapshot.sourceConfig;
		const startupRuntimeConfig = captureConfigOverrideApplier()(startupConfigSnapshot.config);
		startupTrace.setConfig(startupRuntimeConfig);
		const { prepareGatewayStartupConfig } = await startupConfigModulePromise;
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
				const { cleanupRetiredManagedGitHubProfiles } = await import("./github-tool-profile-cleanup-B_XAE6bE.mjs");
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
		const activeTaskCount = { get: () => 0 };
		setPreRestartDeferralCheck(() => getTotalQueueSize() + getTotalPendingReplies() + getActiveEmbeddedRunCount() + getActiveCronJobCount() + getActiveBackgroundExecSessionCount() + getActiveGatewayRootWorkCount({ excludeCurrent: true }) + activeTaskCount.get());
		const seededControlUiAllowedOrigins = controlUiSeed.seededAllowedOrigins ? cfgAtStart.gateway?.controlUi?.allowedOrigins : void 0;
		const applyFixedGatewayOverlays = (config) => {
			const runtimeConfig = applyGatewayAuthOverridesForStartupPreflight(config, {
				auth: authBootstrap.generatedToken && config.gateway?.auth?.mode === void 0 ? {
					mode: authBootstrap.auth.mode,
					...reloadAuthOverride
				} : reloadAuthOverride,
				tailscale: startupTailscaleOverride
			});
			if (!seededControlUiAllowedOrigins || runtimeConfig.gateway?.controlUi?.allowedOrigins !== void 0) return runtimeConfig;
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
		const pluginBootstrap = await startupTrace.measure("plugins.bootstrap", () => prepareGatewayPluginBootstrap({
			cfgAtStart,
			activationSourceConfig: startupActivationSourceConfig,
			pluginMetadataSnapshot: startupConfigLoad.pluginMetadataSnapshot,
			workerProviderIds: workerEnvironmentStartup?.durableProviderIds ?? [],
			minimalTestGateway,
			ambientEnvTriggers,
			log
		}));
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
			activeTaskCount,
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
const loadGatewayModelCatalogModule = createLazyRuntimeModule(() => import("./server-model-catalog-DJYKQfxa.mjs"));
const bindGatewayModelCatalog = createLazyRuntimeMethodBinder(loadGatewayModelCatalogModule);
const loadWorkerEnvironmentStartupModule = createLazyRuntimeModule(() => import("./server-worker-environment-startup-BxPDf-hX.mjs"));
const loadWorkerPlacementStartupModule = createLazyRuntimeModule(() => import("./server-worker-placement-startup-C4JrByc_.mjs"));
const loadGatewayStartupEarlyModule = createLazyRuntimeModule(() => import("./server-startup-early-DCgLCd67.mjs"));
const loadGatewayPluginBootstrapModule = createLazyRuntimeModule(() => import("./server-plugin-bootstrap-Bu_N_Xiu.mjs"));
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
const getChannelRuntime = createLazyRuntimeModule(() => import("./runtime-channel-CxoH96dt.mjs").then(({ createRuntimeChannel }) => createRuntimeChannel()));
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
	const sdkResourceHost = options.sdkResourceHost ?? new LegacyPluginSdkResourceHost();
	sdkResourceHost.assertOpen();
	return await sdkResourceHost.run(() => createGatewayKernelWithSdkHost(port, opts, options, sdkResourceHost));
}
async function createGatewayKernelWithSdkHost(port, opts, options, sdkResourceHost) {
	const suppliedBootId = opts.bootId;
	if (suppliedBootId !== void 0 && (suppliedBootId.trim() !== suppliedBootId || !suppliedBootId || suppliedBootId.length > 96)) throw new Error("Gateway boot ID must contain 1 to 96 characters");
	const bootId = suppliedBootId ?? randomUUID();
	captureRemoteModelCatalogStartupSnapshot();
	ensureOpenClawCliOnPath();
	const pluginMetadata = retainGatewayPluginMetadata();
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
		pluginMetadata.beginClose();
		if (lifecycleRuntime) await lifecycleRuntime.closeOnStartupFailure();
		else {
			closeStartupTrace?.();
			kernelState?.mentionInbox.dispose();
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
	return tlsOptions ? createServer$2(tlsOptions, handler) : createServer$1(handler);
}
//#endregion
//#region src/gateway/server/http-listen.ts
const EADDRINUSE_MAX_RETRIES = 20;
const EADDRINUSE_RETRY_INTERVAL_MS = 500;
async function closeServerQuietly(httpServer) {
	await new Promise((resolve) => {
		try {
			httpServer.close(() => resolve());
		} catch {
			resolve();
		}
	});
}
/** Listen on the configured gateway host/port, retrying transient EADDRINUSE windows. */
async function listenGatewayHttpServer(params) {
	const { httpServer, bindHost, port, retryEaddrinuse = true, serviceName = "gateway", endpointScheme = "ws" } = params;
	const maxRetries = retryEaddrinuse ? EADDRINUSE_MAX_RETRIES : 0;
	for (const attempt of Array.from({ length: maxRetries + 1 }, (_, index) => index)) try {
		await new Promise((resolve, reject) => {
			const onError = (err) => {
				httpServer.off("listening", onListening);
				reject(err);
			};
			const onListening = () => {
				httpServer.off("error", onError);
				resolve();
			};
			httpServer.once("error", onError);
			httpServer.once("listening", onListening);
			httpServer.listen(port, bindHost);
		});
		return;
	} catch (err) {
		const code = err.code;
		if (code === "EADDRINUSE" && attempt < maxRetries) {
			await closeServerQuietly(httpServer);
			await sleep(EADDRINUSE_RETRY_INTERVAL_MS);
			continue;
		}
		if (code === "EADDRINUSE") throw new GatewayLockError(`another ${serviceName} instance is already listening on ${endpointScheme}://${bindHost}:${port}`, err);
		throw new GatewayLockError(`failed to bind ${serviceName} socket on ${endpointScheme}://${bindHost}:${port}: ${String(err)}`, err);
	}
}
//#endregion
//#region src/gateway/portals/portal-http-proxy.ts
const PORTAL_AUTH_NAME = "openclaw_portal";
function portalAuthCookieName(listenPort) {
	return `${PORTAL_AUTH_NAME}_${listenPort}`;
}
const PORTAL_COOKIE_PREFIX = "oc_portal_";
const PORTAL_REFERRER_POLICY = "no-referrer";
const MAX_WEBSOCKET_RESPONSE_HEADER_BYTES = 65536;
const HOP_BY_HOP_HEADERS = /* @__PURE__ */ new Set([
	"connection",
	"keep-alive",
	"proxy-authenticate",
	"proxy-authorization",
	"proxy-connection",
	"te",
	"trailer",
	"transfer-encoding",
	"upgrade"
]);
function tokensEqual(candidate, expected) {
	if (!candidate) return false;
	const candidateBytes = Buffer.from(candidate);
	const expectedBytes = Buffer.from(expected);
	return candidateBytes.length === expectedBytes.length && timingSafeEqual(candidateBytes, expectedBytes);
}
function readPortalCookie(cookieHeader, listenPort) {
	const authCookieName = portalAuthCookieName(listenPort);
	for (const segment of cookieHeader?.split(";") ?? []) {
		const separator = segment.indexOf("=");
		if (separator < 0 || segment.slice(0, separator).trim() !== authCookieName) continue;
		return segment.slice(separator + 1).trim();
	}
}
function portalCookiePrefix(cookieNamespace) {
	return `${PORTAL_COOKIE_PREFIX}${cookieNamespace}_`;
}
function readTargetCookies(cookieHeader, cookieNamespace) {
	const prefix = portalCookiePrefix(cookieNamespace);
	return (cookieHeader?.split(";") ?? []).flatMap((segment) => {
		const separator = segment.indexOf("=");
		if (separator <= 0) return [];
		const name = segment.slice(0, separator).trim();
		if (!name.startsWith(prefix) || name.length === prefix.length) return [];
		return [`${name.slice(prefix.length)}=${segment.slice(separator + 1).trim()}`];
	}).join("; ") || void 0;
}
function rewriteTargetCookie(cookie, target) {
	const [cookiePair, ...attributes] = cookie.split(";");
	const separator = cookiePair?.indexOf("=") ?? -1;
	if (!cookiePair || separator <= 0) return;
	const name = cookiePair.slice(0, separator).trim();
	if (!name) return;
	const retainedAttributes = attributes.filter((attribute) => !/^\s*domain\s*=/iu.test(attribute));
	if (target.partitionedCookies) {
		if (!retainedAttributes.some((attribute) => /^\s*samesite\s*=/iu.test(attribute))) retainedAttributes.push(" SameSite=None");
		for (const attribute of ["Secure", "Partitioned"]) if (!retainedAttributes.some((value) => value.trim().toLowerCase() === attribute.toLowerCase())) retainedAttributes.push(` ${attribute}`);
	}
	const suffix = retainedAttributes.length > 0 ? `;${retainedAttributes.join(";")}` : "";
	return `${portalCookiePrefix(target.cookieNamespace)}${name}=${cookiePair.slice(separator + 1)}${suffix}`;
}
function parsePortalUrl(req) {
	try {
		return new URL(req.url ?? "/", "http://openclaw.invalid");
	} catch {
		return;
	}
}
function authorizePortalRequest(req, target) {
	const url = parsePortalUrl(req);
	if (tokensEqual(url?.searchParams.get(PORTAL_AUTH_NAME) ?? void 0, target.token)) {
		url?.searchParams.delete(PORTAL_AUTH_NAME);
		return {
			kind: "authorized",
			requestPath: `${url?.pathname ?? "/"}${url?.search ?? ""}`,
			setCookie: true
		};
	}
	if (tokensEqual(readPortalCookie(req.headers.cookie, target.listenPort), target.token)) {
		url?.searchParams.delete(PORTAL_AUTH_NAME);
		return {
			kind: "authorized",
			requestPath: `${url?.pathname ?? "/"}${url?.search ?? ""}`,
			setCookie: false
		};
	}
	return { kind: "unauthorized" };
}
function portalCookie(target, tls) {
	const sameSite = target.partitionedCookies ? "None; Partitioned" : "Lax";
	return `${portalAuthCookieName(target.listenPort)}=${target.token}; HttpOnly; SameSite=${sameSite}; Path=/${tls ? "; Secure" : ""}`;
}
function setProxyResponseHeader(res, name, value, target) {
	if (name !== "set-cookie") {
		res.setHeader(name, value);
		return;
	}
	const existing = res.getHeader("Set-Cookie");
	const existingCookies = existing === void 0 ? [] : Array.isArray(existing) ? existing : [existing];
	const rewrittenCookies = (Array.isArray(value) ? value : [String(value)]).flatMap((cookie) => {
		const rewritten = rewriteTargetCookie(cookie, target);
		return rewritten ? [rewritten] : [];
	});
	const cookies = [...existingCookies.map(String), ...rewrittenCookies];
	if (cookies.length > 0) res.setHeader("Set-Cookie", cookies);
}
function htmlResponse(res, statusCode, html, headOnly) {
	res.statusCode = statusCode;
	res.setHeader("Content-Type", "text/html; charset=utf-8");
	res.setHeader("Cache-Control", "no-store");
	res.setHeader("X-Content-Type-Options", "nosniff");
	res.setHeader("Referrer-Policy", PORTAL_REFERRER_POLICY);
	res.setHeader("Content-Length", String(Buffer.byteLength(html)));
	res.end(headOnly ? void 0 : html);
}
function respondPortalUnauthorized(req, res) {
	htmlResponse(res, 401, "<!doctype html><meta charset=utf-8><title>Private portal</title><p>This portal is private. Open it from the OpenClaw Control UI.</p>", req.method === "HEAD");
}
function portalWaitingHtml(targetPort) {
	return `<!doctype html><meta charset=utf-8><meta http-equiv="refresh" content="2"><title>Waiting for app</title><p>Waiting for the app on port ${targetPort}…</p>`;
}
function respondPortalWaiting(req, res, targetPort) {
	htmlResponse(res, 502, portalWaitingHtml(targetPort), req.method === "HEAD");
}
async function connectPortalTarget(target) {
	if (target.kind === "worker") return await target.connect();
	return net.connect(createLoopbackConnectOptions(target.port));
}
function connectionHeaderTokens(headers) {
	const value = headers.connection;
	const joined = Array.isArray(value) ? value.join(",") : value;
	return new Set((joined ?? "").split(",").map((token) => token.trim().toLowerCase()).filter(Boolean));
}
function proxyHeaders(headers, cookieNamespace) {
	const result = {};
	const connectionTokens = connectionHeaderTokens(headers);
	for (const [name, value] of Object.entries(headers)) {
		const normalized = name.toLowerCase();
		if (value === void 0 || HOP_BY_HOP_HEADERS.has(normalized) || connectionTokens.has(normalized)) continue;
		if (cookieNamespace !== void 0 && (normalized === "forwarded" || normalized === "x-real-ip" || normalized.startsWith("x-forwarded-") || normalized.startsWith("tailscale-") || normalized.startsWith("cf-access-"))) continue;
		if (normalized === "cookie" && cookieNamespace !== void 0) {
			const cookie = readTargetCookies(Array.isArray(value) ? value.join("; ") : value, cookieNamespace);
			if (cookie) result.cookie = cookie;
			continue;
		}
		if (normalized === "referer" && String(value).includes(`${PORTAL_AUTH_NAME}=`)) continue;
		result[normalized] = value;
	}
	return result;
}
function targetRequestHeaders(req, target, tls) {
	const headers = proxyHeaders(req.headers, target.cookieNamespace);
	const publicUrl = target.publicOrigin ? new URL(target.publicOrigin) : void 0;
	headers.host = `localhost:${target.target.kind === "local" ? target.target.port : target.target.remotePort}`;
	headers["x-forwarded-for"] = req.socket.remoteAddress ?? "";
	headers["x-forwarded-proto"] = tls ? "https" : "http";
	const publicHost = publicUrl?.host ?? req.headers.host;
	if (publicHost) headers["x-forwarded-host"] = publicHost;
	return headers;
}
function portalRedirect(location, req, target, tls) {
	if (!/^https?:\/\//iu.test(location) && !location.startsWith("//")) return location;
	const origin = target.publicOrigin ?? `${tls ? "https" : "http"}://${req.headers.host}`;
	try {
		const destination = new URL(location, origin);
		const targetPort = target.target.kind === "local" ? target.target.port : target.target.remotePort;
		const port = Number(destination.port || (destination.protocol === "https:" ? 443 : 80));
		if (![
			"localhost",
			"127.0.0.1",
			"[::1]"
		].includes(destination.hostname) || port !== targetPort || destination.username || destination.password) return location;
		const published = new URL(origin);
		destination.protocol = published.protocol;
		destination.host = published.host;
		destination.port = published.port;
		return destination.href;
	} catch {
		return location;
	}
}
/** Proxies one authorized portal request to its local or worker target. */
function handlePortalProxyRequest(params) {
	const { req, res, target, tls } = params;
	const authorization = authorizePortalRequest(req, target);
	if (authorization.kind === "unauthorized") {
		respondPortalUnauthorized(req, res);
		return;
	}
	if (authorization.setCookie) res.setHeader("Set-Cookie", portalCookie(target, tls));
	const headers = targetRequestHeaders(req, target, tls);
	const targetPort = target.target.kind === "local" ? target.target.port : target.target.remotePort;
	connectPortalTarget(target.target).then((targetSocket) => {
		if (req.aborted || res.destroyed) {
			targetSocket.destroy();
			return;
		}
		const proxyReq = request({
			hostname: "localhost",
			createConnection: () => targetSocket,
			port: targetPort,
			method: req.method,
			path: authorization.requestPath,
			headers
		});
		proxyReq.once("response", (proxyRes) => {
			for (const [name, value] of Object.entries(proxyHeaders(proxyRes.headers))) if (value !== void 0) {
				const forwarded = name === "location" && typeof value === "string" ? portalRedirect(value, req, target, tls) : value;
				setProxyResponseHeader(res, name, forwarded, target);
			}
			res.setHeader("Referrer-Policy", PORTAL_REFERRER_POLICY);
			res.statusCode = proxyRes.statusCode ?? 502;
			proxyRes.once("error", () => res.destroy());
			res.flushHeaders();
			proxyRes.pipe(res);
		});
		proxyReq.once("error", () => {
			if (!res.headersSent) respondPortalWaiting(req, res, targetPort);
			else res.destroy();
		});
		proxyReq.once("close", () => {
			if (target.target.kind === "worker" && !res.headersSent && !res.writableEnded) respondPortalWaiting(req, res, targetPort);
		});
		res.once("close", () => proxyReq.destroy());
		req.pipe(proxyReq);
	}, () => {
		if (!res.headersSent && !res.writableEnded && !res.destroyed) respondPortalWaiting(req, res, targetPort);
	});
}
function websocketHeaders(req, target, tls, requestPath) {
	const lines = [`${req.method ?? "GET"} ${requestPath} HTTP/1.1`];
	const headers = targetRequestHeaders(req, target, tls);
	headers.connection = "Upgrade";
	headers.upgrade = req.headers.upgrade;
	for (const [name, value] of Object.entries(headers)) {
		if (value === void 0) continue;
		for (const item of Array.isArray(value) ? value : [value]) lines.push(`${name}: ${item}`);
	}
	lines.push("", "");
	return lines.join("\r\n");
}
function rejectPortalUpgrade(socket) {
	socket.end("HTTP/1.1 401 Unauthorized\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Length: 12\r\nConnection: close\r\n\r\nUnauthorized");
}
function respondUpgradeWaiting(socket, targetPort) {
	const html = portalWaitingHtml(targetPort);
	socket.end(`HTTP/1.1 502 Bad Gateway\r
Content-Type: text/html; charset=utf-8\r
Cache-Control: no-store\r\nReferrer-Policy: ${PORTAL_REFERRER_POLICY}\r\nContent-Length: ${Buffer.byteLength(html)}\r\nConnection: close\r\n\r\n${html}`);
}
function forwardWebSocketResponse(targetSocket, browserSocket, target, onResponse) {
	let pending = Buffer.alloc(0);
	const onData = (chunk) => {
		pending = Buffer.concat([pending, chunk]);
		const headerEnd = pending.indexOf("\r\n\r\n");
		if (headerEnd < 0) {
			if (pending.length > MAX_WEBSOCKET_RESPONSE_HEADER_BYTES) {
				targetSocket.destroy();
				browserSocket.destroy();
			}
			return;
		}
		targetSocket.off("data", onData);
		const rewrittenLines = pending.subarray(0, headerEnd).toString("latin1").split("\r\n").flatMap((line) => {
			const separator = line.indexOf(":");
			if (separator <= 0 || line.slice(0, separator).trim().toLowerCase() !== "set-cookie") return [line];
			const rewritten = rewriteTargetCookie(line.slice(separator + 1).trimStart(), target);
			return rewritten ? [`${line.slice(0, separator)}: ${rewritten}`] : [];
		});
		onResponse();
		browserSocket.write(`${rewrittenLines.join("\r\n")}\r\n\r\n`);
		const remainder = pending.subarray(headerEnd + 4);
		if (remainder.length > 0) browserSocket.write(remainder);
		targetSocket.pipe(browserSocket);
	};
	targetSocket.on("data", onData);
}
/** Splices an authorized portal WebSocket upgrade into its local or worker target. */
function handlePortalProxyUpgrade(params) {
	const { req, socket, head, target, upgradedSockets, tls } = params;
	socket.once("error", () => socket.destroy());
	const authorization = authorizePortalRequest(req, target);
	if (authorization.kind !== "authorized") {
		rejectPortalUpgrade(socket);
		return;
	}
	const targetPort = target.target.kind === "local" ? target.target.port : target.target.remotePort;
	upgradedSockets.add(socket);
	socket.once("close", () => upgradedSockets.delete(socket));
	let responseStarted = false;
	const closeUpgrade = () => {
		if (target.target.kind === "worker" && !responseStarted && !socket.destroyed) {
			if (!socket.writableEnded) respondUpgradeWaiting(socket, targetPort);
			return;
		}
		socket.destroy();
	};
	connectPortalTarget(target.target).then((targetSocket) => {
		if (socket.destroyed) {
			targetSocket.destroy();
			return;
		}
		upgradedSockets.add(targetSocket);
		socket.once("close", () => targetSocket.destroy());
		targetSocket.once("close", () => {
			upgradedSockets.delete(targetSocket);
			closeUpgrade();
		});
		targetSocket.once("end", closeUpgrade);
		targetSocket.once("error", closeUpgrade);
		const spliceUpgrade = () => {
			forwardWebSocketResponse(targetSocket, socket, target, () => {
				responseStarted = true;
			});
			targetSocket.write(websocketHeaders(req, target, tls, authorization.requestPath));
			if (head.length > 0) targetSocket.write(head);
			socket.pipe(targetSocket);
		};
		if (target.target.kind === "worker") spliceUpgrade();
		else targetSocket.once("connect", spliceUpgrade);
	}, closeUpgrade);
}
//#endregion
//#region src/gateway/portals/portal-ingress.ts
/** Dedicated loopback ingress; registry lookup remains owned by the portal service. */
function createPortalIngress(params) {
	const server = createServer$1(params.request);
	server.on("upgrade", params.upgrade);
	let startup;
	let closed = false;
	return {
		start: () => {
			if (closed) return Promise.reject(/* @__PURE__ */ new Error("Portal ingress is closed"));
			if (!startup) {
				params.httpServers.push(server);
				startup = (async () => {
					try {
						await listenGatewayHttpServer({
							httpServer: server,
							bindHost: "127.0.0.1",
							port: params.port,
							retryEaddrinuse: false,
							serviceName: "portal ingress",
							endpointScheme: "http"
						});
						const address = server.address();
						if (!address || typeof address === "string") throw new Error("Portal ingress did not resolve its listener port");
						return address.port;
					} catch (error) {
						const index = params.httpServers.indexOf(server);
						if (index >= 0) params.httpServers.splice(index, 1);
						throw error;
					}
				})();
			}
			return startup;
		},
		close: async () => {
			closed = true;
			await startup?.catch(() => void 0);
			const index = params.httpServers.indexOf(server);
			if (index >= 0) params.httpServers.splice(index, 1);
			if (server.listening) await new Promise((resolve) => {
				server.close(() => resolve());
				server.closeAllConnections();
			});
		}
	};
}
/** Match only a single DNS hostname authority; forwarded headers never select a portal. */
function portalIngressHostname(host) {
	if (!host || !/^[a-z0-9.-]+(?::443)?$/iu.test(host)) return;
	return host.toLowerCase().replace(/:443$/u, "");
}
//#endregion
//#region src/gateway/portals/portal-tls-hostname.ts
/** Select a certificate-valid direct hostname without changing the listener or client URL. */
function resolvePortalTlsHostname(tlsOptions, gatewayOrigins, fallbackHost) {
	const material = Array.isArray(tlsOptions.cert) ? tlsOptions.cert[0] : tlsOptions.cert;
	if (!material) return fallbackHost;
	const certificate = new X509Certificate(material);
	const candidates = [];
	for (const origin of gatewayOrigins) try {
		candidates.push(new URL(origin).hostname.replace(/^\[|\]$/gu, ""));
	} catch {}
	candidates.push(fallbackHost.replace(/^\[|\]$/gu, ""));
	for (const match of (certificate.subjectAltName ?? "").matchAll(/(?:^|, )DNS:([a-z0-9.-]+)(?=, |$)/giu)) if (match[1]) candidates.push(match[1]);
	for (const candidate of candidates) if (isIP(candidate) ? certificate.checkIP(candidate) : certificate.checkHost(candidate, { subject: "never" })) return candidate.includes(":") ? `[${candidate}]` : candidate;
	return fallbackHost;
}
//#endregion
//#region src/gateway/portals/portal-service.ts
const PORTAL_PORT_ALLOCATION_ATTEMPTS = 10;
function removeServers(shared, owned) {
	for (const server of owned) {
		const index = shared.indexOf(server);
		if (index >= 0) shared.splice(index, 1);
	}
}
async function closeServers(servers) {
	await Promise.all(servers.map((server) => new Promise((resolve) => {
		if (!server.listening) {
			resolve();
			return;
		}
		server.close(() => resolve());
		server.closeAllConnections();
	})));
}
async function formatPortalHost(host) {
	const openableHost = (host === "0.0.0.0" || host === "::" ? await resolveAdvertisedLanHostCore().catch(() => null) : null) ?? (host === "0.0.0.0" ? "127.0.0.1" : host === "::" ? "::1" : host);
	return openableHost.includes(":") ? `[${openableHost}]` : openableHost;
}
/** Creates the gateway-lifetime registry and per-portal transport listeners. */
function createGatewayPortalService(params) {
	const entries = /* @__PURE__ */ new Map();
	const operations = /* @__PURE__ */ new Map();
	let closed = false;
	const isAvailable = (runtime) => !closed && !runtime.revoked && !runtime.ingressSignal?.aborted && (!runtime.claim || runtime.claim.isActive());
	const ingressDomain = params.ingress?.domain.toLowerCase();
	if (ingressDomain && (!isValidPortalIngressDomain(ingressDomain) || params.gatewayOrigins?.some((origin) => portalIngressConflictsWithOrigin(ingressDomain, origin)))) throw new Error("Portal ingress must use a valid separate DNS domain from the Gateway and Control UI");
	const lookupIngress = (host) => {
		const hostname = portalIngressHostname(host);
		if (!hostname || closed) return;
		for (const runtime of entries.values()) if (isAvailable(runtime) && runtime.portal.publicOrigin === `https://${hostname}`) return runtime;
	};
	const ingress = params.ingress ? createPortalIngress({
		port: params.ingress.port,
		httpServers: params.httpServers,
		request: (req, res) => {
			const runtime = lookupIngress(req.headers.host);
			if (!runtime) {
				res.writeHead(404);
				res.end("Unknown portal");
				return;
			}
			runtime.responses.add(res);
			res.once("close", () => runtime.responses.delete(res));
			handlePortalProxyRequest({
				req,
				res,
				target: runtime.portal,
				tls: true
			});
		},
		upgrade: (req, socket, head) => {
			const runtime = lookupIngress(req.headers.host);
			if (!runtime) {
				socket.destroy();
				return;
			}
			handlePortalProxyUpgrade({
				req,
				socket,
				head,
				target: runtime.portal,
				upgradedSockets: runtime.upgradedSockets,
				tls: true
			});
		}
	}) : void 0;
	const summarize = (portal) => {
		const tokenQuery = `openclaw_portal=${portal.token}`;
		const publicUrl = `${portal.publicOrigin}${portal.path ?? "/"}`;
		const openableUrl = new URL(publicUrl);
		openableUrl.searchParams.set("openclaw_portal", portal.token);
		return {
			id: portal.id,
			title: portal.title,
			port: portal.target.kind === "local" ? portal.target.port : portal.target.remotePort,
			listenPort: portal.listenPort,
			tokenQuery,
			url: openableUrl.toString(),
			publicUrl,
			...portal.path ? { path: portal.path } : {},
			...portal.description ? { description: portal.description } : {},
			...portal.origin ? { origin: portal.origin } : {},
			createdAtMs: portal.createdAtMs
		};
	};
	const serialize = async (id, operation) => {
		const result = (operations.get(id) ?? Promise.resolve()).then(operation, operation);
		const completion = result.then(() => void 0, () => void 0);
		operations.set(id, completion);
		try {
			return await result;
		} finally {
			if (operations.get(id) === completion) operations.delete(id);
		}
	};
	const closeEntry = async (id) => {
		const runtime = entries.get(id);
		if (!runtime) return;
		entries.delete(id);
		removeServers(params.httpServers, runtime.servers);
		for (const socket of runtime.upgradedSockets) socket.destroy();
		runtime.upgradedSockets.clear();
		for (const response of runtime.responses) response.destroy();
		runtime.responses.clear();
		runtime.detachIngressOwner?.();
		const failure = (await Promise.allSettled([
			closeServers(runtime.servers),
			Promise.resolve().then(() => runtime.claim?.stop()),
			Promise.resolve().then(() => runtime.onClose?.())
		])).find((result) => result.status === "rejected");
		if (failure?.status === "rejected") throw failure.reason;
	};
	const summarizeEntries = (selected) => Array.from(selected).filter(isAvailable).map(({ portal }) => summarize(portal)).toSorted((left, right) => left.createdAtMs - right.createdAtMs || left.id.localeCompare(right.id));
	return {
		startIngress: async () => {
			await ingress?.start();
		},
		open: async (input) => {
			const target = input.target ?? {
				kind: "local",
				port: input.targetPort
			};
			const targetPort = target.kind === "local" ? target.port : target.remotePort;
			const id = target.kind === "local" ? `p${targetPort}` : `p${targetPort}-worker-${sha256HexPrefixCore(target.environmentId, 32)}-${target.ownerEpoch}`;
			return await serialize(id, async () => {
				let releaseTarget = input.onClose;
				try {
					if (closed) throw new Error("portals unavailable");
					input.assertCurrent?.();
					let existing = entries.get(id);
					if (existing && !isAvailable(existing)) {
						await closeEntry(id);
						input.assertCurrent?.();
						if (closed) throw new Error("portals unavailable");
						existing = void 0;
					}
					if (existing) {
						existing.portal.title = input.title?.trim() || existing.portal.title;
						if (input.description !== void 0) existing.portal.description = input.description;
						if (input.path !== void 0) existing.portal.path = input.path;
						if (input.origin !== void 0) existing.portal.origin = input.origin;
						return summarize(existing.portal);
					}
					if (params.httpBindHosts.length === 0) throw new Error("Gateway listener must start before opening a portal");
					const managed = !ingress && params.managedTailscale ? getTailscalePublishedOrigin() : void 0;
					if (!ingress && params.managedTailscale && (!managed || managed.signal.aborted)) throw new Error("Private portal ingress unavailable: the managed Tailscale route is not active");
					const gatewayPublication = getTailscalePublishedOrigin();
					if (ingressDomain && gatewayPublication && portalIngressConflictsWithOrigin(ingressDomain, gatewayPublication.origin)) throw new Error("Portal ingress domain conflicts with the managed Gateway hostname");
					const bindHosts = managed ? ["127.0.0.1"] : params.httpBindHosts;
					const tlsOptions = managed ? void 0 : params.tlsOptions;
					const portal = {
						id,
						title: input.title?.trim() || `Port ${targetPort}`,
						...input.description ? { description: input.description } : {},
						...input.path ? { path: input.path } : {},
						...input.origin ? { origin: input.origin } : {},
						target,
						token: randomBytes(32).toString("hex"),
						cookieNamespace: randomBytes(16).toString("hex"),
						listenPort: 0,
						createdAtMs: Date.now(),
						publicOrigin: "",
						partitionedCookies: Boolean(ingress || managed || tlsOptions)
					};
					const upgradedSockets = /* @__PURE__ */ new Set();
					const responses = /* @__PURE__ */ new Set();
					const handler = (req, res) => {
						const runtime = entries.get(id);
						if (!runtime || runtime.portal !== portal || !isAvailable(runtime)) {
							res.writeHead(404);
							res.end("Unknown portal");
							return;
						}
						responses.add(res);
						res.once("close", () => responses.delete(res));
						handlePortalProxyRequest({
							req,
							res,
							target: portal,
							tls: Boolean(managed || tlsOptions)
						});
					};
					const servers = ingress ? [] : bindHosts.map(() => tlsOptions ? createServer$2(tlsOptions, handler) : createServer$1(handler));
					for (const server of servers) server.on("upgrade", (req, socket, head) => {
						const runtime = entries.get(id);
						if (!runtime || runtime.portal !== portal || !isAvailable(runtime)) {
							socket.destroy();
							return;
						}
						handlePortalProxyUpgrade({
							req,
							socket,
							head,
							target: portal,
							upgradedSockets,
							tls: Boolean(managed || tlsOptions)
						});
					});
					params.httpServers.push(...servers);
					let claim;
					try {
						if (ingress) {
							portal.listenPort = await ingress.start();
							if (target.kind === "local" && portal.listenPort === targetPort) throw new Error("Portal target port must differ from the portal ingress listener");
							portal.publicOrigin = `https://${randomBytes(16).toString("hex")}.${ingressDomain}`;
						} else {
							const primaryServer = servers[0];
							const primaryHost = bindHosts[0];
							if (!primaryServer || !primaryHost) throw new Error("Missing primary portal HTTP server");
							for (let attempt = 0; attempt < PORTAL_PORT_ALLOCATION_ATTEMPTS; attempt += 1) {
								await listenGatewayHttpServer({
									httpServer: primaryServer,
									bindHost: primaryHost,
									port: 0,
									retryEaddrinuse: false,
									serviceName: "portal",
									endpointScheme: tlsOptions ? "https" : "http"
								});
								const address = primaryServer.address();
								if (!address || typeof address === "string") throw new Error("Portal listener failed to resolve its port");
								if (target.kind === "worker" || address.port !== targetPort) {
									portal.listenPort = address.port;
									break;
								}
								await closeServers([primaryServer]);
							}
							if (portal.listenPort === 0) throw new Error(`Portal listener repeatedly allocated target port ${targetPort}`);
							for (const [index, host] of bindHosts.entries()) {
								if (index === 0) continue;
								const server = servers[index];
								if (!server) throw new Error(`Missing portal HTTP server for bind host ${host}`);
								await listenGatewayHttpServer({
									httpServer: server,
									bindHost: host,
									port: portal.listenPort,
									retryEaddrinuse: false,
									serviceName: "portal",
									endpointScheme: tlsOptions ? "https" : "http"
								});
							}
							if (managed) {
								const httpsPort = portal.listenPort;
								const gatewayUrl = new URL(managed.origin);
								if (httpsPort === Number(gatewayUrl.port || 443)) throw new Error("Portal HTTPS port conflicts with the Gateway origin");
								const assertServeCurrent = () => {
									input.assertCurrent?.();
									if (closed || managed.signal.aborted) throw new Error("Private portal ingress closed during startup");
								};
								assertServeCurrent();
								claim = await claimTailscaleServePort(portal.listenPort, httpsPort, assertServeCurrent);
								if (!claim.isActive() || managed.signal.aborted) throw new Error("Private portal ingress lost during startup");
								gatewayUrl.port = String(httpsPort);
								if (params.gatewayOrigins?.includes(gatewayUrl.origin)) throw new Error("Portal HTTPS origin conflicts with the Control UI");
								portal.publicOrigin = gatewayUrl.origin;
							} else {
								const bindHostname = await formatPortalHost(primaryHost);
								const hostname = tlsOptions ? resolvePortalTlsHostname(tlsOptions, params.gatewayOrigins ?? [], bindHostname) : bindHostname;
								portal.publicOrigin = `${tlsOptions ? "https" : "http"}://${hostname}:${portal.listenPort}`;
							}
						}
						if (closed) throw new Error("portals unavailable");
						input.assertCurrent?.();
						if (managed && (managed.signal.aborted || !claim?.isActive())) throw new Error("Private portal ingress lost before publication");
					} catch (error) {
						removeServers(params.httpServers, servers);
						for (const socket of upgradedSockets) socket.destroy();
						await Promise.all([closeServers(servers), claim?.stop()]);
						throw error;
					}
					const runtime = {
						portal,
						servers,
						upgradedSockets,
						...input.onClose ? { onClose: input.onClose } : {},
						claim,
						responses,
						ingressSignal: managed?.signal
					};
					entries.set(id, runtime);
					if (claim && managed) {
						const retire = () => {
							if (entries.get(id) === runtime) {
								runtime.revoked = true;
								serialize(id, async () => {
									if (entries.get(id) === runtime) await closeEntry(id);
								}).catch(() => void 0);
							}
						};
						managed.signal.addEventListener("abort", retire, { once: true });
						runtime.detachIngressOwner = () => managed.signal.removeEventListener("abort", retire);
						claim.exited.then(retire, retire);
					}
					releaseTarget = void 0;
					return summarize(portal);
				} finally {
					await releaseTarget?.();
				}
			});
		},
		list: () => summarizeEntries(entries.values()),
		listWorkerPortals: (environmentId, ownerEpoch) => summarizeEntries([...entries.values()].filter(({ portal }) => portal.target.kind === "worker" && portal.target.environmentId === environmentId && portal.target.ownerEpoch === ownerEpoch)),
		close: async (id, assertCurrent) => {
			await serialize(id, () => {
				assertCurrent?.();
				return closeEntry(id);
			});
		},
		closeWorkerPortals: async (environmentId, ownerEpoch) => {
			const environmentSuffix = `-worker-${sha256HexPrefixCore(environmentId, 32)}-`;
			const ids = [.../* @__PURE__ */ new Set([...entries.keys(), ...operations.keys()])].filter((id) => {
				const separator = id.indexOf(environmentSuffix);
				return separator >= 0 && (ownerEpoch === void 0 || id.slice(separator + environmentSuffix.length) === String(ownerEpoch));
			});
			await Promise.all(ids.map((id) => serialize(id, () => closeEntry(id))));
		},
		closeAll: async () => {
			closed = true;
			const ids = /* @__PURE__ */ new Set([...entries.keys(), ...operations.keys()]);
			try {
				await Promise.all([...ids].map((id) => serialize(id, () => closeEntry(id))));
			} finally {
				await ingress?.close();
			}
		}
	};
}
//#endregion
//#region src/gateway/control-ui-image-http-routes.ts
const getPluginIconHttpModule = createLazyRuntimeModule(() => import("./plugin-icon-http-sPbEpXCI.mjs"));
const getPluginThemeArtHttpModule = createLazyRuntimeModule(() => import("./plugin-theme-art-http-CE11-0y2.mjs"));
const getWorkspaceIconHttpModule = createLazyRuntimeModule(() => import("./workspace-icon-http-BHqXDfFq.mjs"));
const getChannelAvatarHttpModule = createLazyRuntimeModule(() => import("./channel-avatar-http-DfqW1Spu.mjs"));
/** Resource owners stay lazy until their authenticated image route is requested. */
const CONTROL_UI_IMAGE_HTTP_ROUTES = [
	[[
		"pluginIcon",
		"pluginActivityIcon",
		"catalogIcon",
		"linkFavicon"
	], async () => (await getPluginIconHttpModule()).handlePluginIconHttpRequest],
	[["pluginThemeArt"], async () => (await getPluginThemeArtHttpModule()).handlePluginThemeArtHttpRequest],
	[["workspaceIcon"], async () => (await getWorkspaceIconHttpModule()).handleWorkspaceIconHttpRequest],
	[["channelAvatar"], async () => (await getChannelAvatarHttpModule()).handleChannelAvatarHttpRequest]
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
		const { resolvePublicSessionShareToken } = await import("./control-ui-public-session-token-BqSoJgqp.mjs");
		const locator = resolvePublicSessionShareToken(publicShare.token);
		if (!locator) {
			unavailable(404);
			return;
		}
		const { isPublicSessionShareActive, readPublicSessionShare } = await import("./control-ui-public-session-read-CPOzMJor.mjs");
		const { renderPublicSessionDocument } = await import("./control-ui-public-session-render-D0xTR30A.mjs");
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
//#region src/gateway/server-http-modules.ts
const getControlUiModule = createLazyRuntimeModule(() => import("./control-ui-cyT1ao6J.mjs"));
const getControlUiPluginAssetsModule = createLazyRuntimeModule(() => import("./control-ui-plugin-assets-DWZ5opWN.mjs"));
const getCanvasServeModule = createLazyRuntimeModule(() => import("./serve.runtime.js"));
const getBoardHttpModule = createLazyRuntimeModule(() => import("./board-http-2gGQvPrK.mjs"));
const getEmbeddingsHttpModule = createLazyRuntimeModule(() => import("./embeddings-http-CVO-x9yf.mjs"));
const getManagedMediaAttachmentsModule = createLazyRuntimeModule(() => import("./managed-image-attachments-B7DNUWmy.mjs"));
const getArtifactDownloadsModule = createLazyRuntimeModule(() => import("./artifact-downloads-BfDmRqxC.mjs"));
const getMcpAppStandaloneModule = createLazyRuntimeModule(() => import("./mcp-app-standalone-mGbrAaWM.mjs"));
const getModelsHttpModule = createLazyRuntimeModule(() => import("./models-http-SB5WvbQU.mjs"));
const getOpenAiHttpModule = createLazyRuntimeModule(() => import("./openai-http-ChWyqjQc.mjs"));
const getOpenResponsesHttpModule = createLazyRuntimeModule(() => import("./openresponses-http-O6mxe56A.mjs"));
const getSessionHistoryHttpModule = createLazyRuntimeModule(() => import("./sessions-history-http-De_QVXMc.mjs"));
const getSessionKillHttpModule = createLazyRuntimeModule(() => import("./session-kill-http-CVG1mhmH.mjs"));
const getToolsInvokeHttpModule = createLazyRuntimeModule(() => import("./tools-invoke-http-BxhsgF86.mjs"));
const getUserProfilesHttpModule = createLazyRuntimeModule(() => import("./user-profiles-http-Cf1iFqSj.mjs"));
const getDevicePairingJoinHttpModule = createLazyRuntimeModule(() => import("./device-pairing-join-http-sMOAsFR7.mjs"));
const getPluginNodeCapabilityAuthModule$1 = createLazyRuntimeModule(() => import("./plugin-node-capability-auth-DFELL0o3.mjs"));
const getHttpAuthUtilsModule$2 = createLazyRuntimeModule(() => import("./http-auth-utils-DNHorRFY.mjs"));
const getPluginRouteRuntimeScopesModule$1 = createLazyRuntimeModule(() => import("./plugin-route-runtime-scopes-Dc7gXa1n.mjs"));
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
	const configuredChannels = configSnapshot.channels;
	if (!configuredChannels || Object.keys(configuredChannels).length === 0) return paths;
	for (const channelId of Object.keys(configuredChannels)) for (const path of await resolveBundledChannelGatewayAuthBypassPaths({
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
//#region src/gateway/server-http-probes.ts
const getHttpAuthUtilsModule$1 = createLazyRuntimeModule(() => import("./http-auth-utils-DNHorRFY.mjs"));
async function shouldIncludeGatewayProbeDetails(params) {
	if (readPreparedGatewayIngressAttribution(params.req)?.kind === "direct-local" || !readPreparedGatewayIngressAttribution(params.req) && isLocalDirectRequest(params.req, params.trustedProxies, params.allowRealIpFallback)) return true;
	if (params.resolvedAuth.mode === "none") return false;
	const { getBearerToken, resolveHttpBrowserOriginPolicy } = await getHttpAuthUtilsModule$1();
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
//#region src/gateway/server-http-upgrades.ts
const getPluginNodeCapabilityAuthModule = createLazyRuntimeModule(() => import("./plugin-node-capability-auth-DFELL0o3.mjs"));
const getHttpAuthUtilsModule = createLazyRuntimeModule(() => import("./http-auth-utils-DNHorRFY.mjs"));
const getPluginRouteRuntimeScopesModule = createLazyRuntimeModule(() => import("./plugin-route-runtime-scopes-Dc7gXa1n.mjs"));
function rejectUpgradeAuth(socket, auth) {
	if (auth.rateLimited) {
		const retryAfterSeconds = auth.retryAfterMs && auth.retryAfterMs > 0 ? Math.ceil(auth.retryAfterMs / 1e3) : void 0;
		const body = JSON.stringify({ error: {
			message: "Too many failed authentication attempts. Please try again later.",
			type: "rate_limited"
		} });
		socket.end([
			"HTTP/1.1 429 Too Many Requests",
			...retryAfterSeconds ? [`Retry-After: ${retryAfterSeconds}`] : [],
			"Content-Type: application/json; charset=utf-8",
			`Content-Length: ${Buffer.byteLength(body, "utf8")}`,
			"Connection: close",
			"",
			body
		].join("\r\n"), () => socket.destroy());
		return;
	}
	if (auth.reason === "proxy_attribution_required") {
		const body = JSON.stringify({ error: {
			message: `Proxy client attribution is required. ${PROXY_ATTRIBUTION_GUIDANCE}`,
			type: PROXY_ATTRIBUTION_REQUIRED_REASON
		} });
		socket.end([
			"HTTP/1.1 403 Forbidden",
			"Content-Type: application/json; charset=utf-8",
			`Content-Length: ${Buffer.byteLength(body, "utf8")}`,
			"Connection: close",
			"",
			body
		].join("\r\n"), () => socket.destroy());
		return;
	}
	rejectWebSocketUpgrade(socket, { status: 401 });
}
function handleBudgetedGatewayWebSocketUpgrade(params) {
	const { req, socket, head, wss, preauthConnectionBudget, preauthBudgetKey, ingressName } = params;
	const allowsRestartStartupPreauth = ingressName === "Gateway" && isGatewayRestartDraining() && getGatewaySuspendAdmissionPhase() === "accepting" && params.isStartupPending?.() === true;
	if (isGatewayWorkAdmissionClosed() && !allowsRestartStartupPreauth && (ingressName === "Worker" || isGatewayRestartDraining() || getGatewaySuspendAdmissionPhase() !== "draining" && getGatewaySuspendAdmissionPhase() !== "prepared")) {
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
			if (requestPath === "/desktop/observe") {
				if (!opts.desktopSessionRegistry) {
					rejectGatewayUpgradeServiceUnavailable(socket, "desktop observe unavailable");
					return;
				}
				if (isGatewayWorkAdmissionClosed()) {
					rejectGatewayUpgradeServiceUnavailable(socket, "Gateway websocket admission closed");
					return;
				}
				const { handleDesktopObserveUpgrade } = await import("./observe-bridge-CSkgehV0.mjs");
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
	const httpServer = opts.testListener ?? (opts.tlsOptions ? createServer$2(opts.tlsOptions) : createServer$1());
	httpServer.on("request", handleServerRequest);
	httpServer.on("checkContinue", (req, res) => handleServerRequest(req, res, "continue"));
	httpServer.on("checkExpectation", (req, res) => handleServerRequest(req, res, "reject"));
	httpServer.on("connect", (req, socket) => {
		runHttpConnectionRequest(req, async () => {
			socket.destroy();
		}, "upgrade");
	});
	async function handleRequest(req, res, expectation) {
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
				if (!controlUiEnabled) {
					respondNotFound(res);
					return true;
				}
				if (await handleControlUiRequest()) return true;
				respondNotFound(res);
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
			addAdmittedStage(/^\/sessions\/[^/]+\/history$/.test(scopedRequestPath), async () => (await getSessionHistoryHttpModule()).handleSessionHistoryHttpRequest(req, res, routeAuth));
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
			const focusDocument = isControlUiFocusDocumentPath({
				basePath: controlUiBasePath,
				pathname: scopedRequestPath
			});
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
				const { authorizePluginNodeCapabilityRequest } = await getPluginNodeCapabilityAuthModule$1();
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
			if (configSnapshot.mcp?.apps?.enabled === true && (mcpAppRoute === "shell" || mcpAppRoute === "view")) requestStages.push(async () => await runWithGatewayHttpWorkAdmission(res, async () => {
				return await (await getMcpAppStandaloneModule()).handleMcpAppStandaloneHttpRequest(req, res, {
					sandboxPort: configSnapshot.mcp?.apps?.sandboxPort,
					sandboxOrigin: configSnapshot.mcp?.apps?.sandboxOrigin
				});
			}));
			if (handlePluginRequest) {
				let pluginGatewayAuthSatisfied = false;
				let pluginGatewayRequestAuth;
				let pluginRequestOperatorScopes;
				requestStages.push(async () => {
					if (!(shouldEnforcePluginGatewayAuth ?? shouldEnforceDefaultPluginGatewayAuth)(pluginPathContext) || (await getCachedPluginGatewayAuthBypassPaths(configSnapshot)).has(scopedRequestPath)) return false;
					const { authorizePluginGatewayHttpRequestOrReply } = await getHttpAuthUtilsModule$2();
					const { resolvePluginRouteRuntimeOperatorScopes } = await getPluginRouteRuntimeScopesModule$1();
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
			for (const [routes, loadHandler] of CONTROL_UI_IMAGE_HTTP_ROUTES) addRequestStage(controlUiEnabled && routes.some((route) => parseControlUiResourcePath(route, scopedRequestPath, controlUiRouteBasePath).matched), async () => (await loadHandler())(req, res, controlUiRouteOptions));
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
			console.error("[gateway-http] unhandled error in request handler:", err);
			finishFailedGatewayHttpResponse(res);
		}
	}
	return httpServer;
}
//#endregion
//#region src/gateway/server/preauth-connection-budget.ts
const DEFAULT_MAX_PREAUTH_CONNECTIONS_PER_IP = 32;
const UNKNOWN_CLIENT_IP_BUDGET_KEY = "__openclaw_unknown_client_ip__";
function getMaxPreauthConnectionsPerIpFromEnv(env = process.env) {
	const configured = env.OPENCLAW_MAX_PREAUTH_CONNECTIONS_PER_IP || (isVitestRuntimeEnv(env) ? env.OPENCLAW_TEST_MAX_PREAUTH_CONNECTIONS_PER_IP : void 0);
	if (!configured) return DEFAULT_MAX_PREAUTH_CONNECTIONS_PER_IP;
	const parsed = parseStrictPositiveInteger(configured);
	if (parsed === void 0) return DEFAULT_MAX_PREAUTH_CONNECTIONS_PER_IP;
	return parsed;
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
const loadGatewayPluginsHttpModule = async () => await import("./plugins-http-Cf5UQ_Oe.mjs");
function hasMatchingGatewayPluginRoute(registry, pathContext, requiresUpgrade) {
	if (!pathContext) return (registry.httpRoutes ?? []).length > 0;
	const matchingRoutes = findMatchingPluginHttpRoutes(registry, pathContext);
	return requiresUpgrade ? matchingRoutes.some((route) => typeof route.handleUpgrade === "function") : matchingRoutes.length > 0;
}
/** Creates the HTTP/WebSocket transport for one gateway start. */
async function createGatewayHttpTransport(params) {
	const spawnBroker = getSpawnBroker();
	if (params.testListener) {
		const address = params.testListener.address();
		if (params.gatewayTls?.enabled || params.bindHost !== "127.0.0.1" || !address || typeof address === "string" || address.address !== params.bindHost || address.port !== params.port) throw new Error("Test Gateway listener must own the configured HTTP loopback endpoint");
	}
	const loadRuntimeConfig = params.getRuntimeConfig ?? (() => params.cfg);
	const resolvePluginRouteRegistry = () => params.getPluginRouteRegistry?.() ?? params.pluginRegistry;
	let loadedHooksRequestHandler = null;
	let loadedHookDispatcher;
	const getHookDispatcher = async () => {
		const { createGatewayHookDispatcher } = await import("./hooks-Bik-Tkm9.mjs");
		return loadedHookDispatcher ??= runWithSpawnBroker(spawnBroker, () => createGatewayHookDispatcher({
			deps: params.deps,
			logHooks: params.logHooks,
			...params.getGatewayRequestContext ? { resolveGatewayContext: params.getGatewayRequestContext } : {}
		}));
	};
	const handleHooksRequest = async (req, res) => {
		const hooksConfig = params.hooksConfig();
		if (!hooksConfig) return false;
		const url = new URL(req.url ?? "/", "http://localhost");
		const basePath = hooksConfig.basePath;
		if (url.pathname !== basePath && !url.pathname.startsWith(`${basePath}/`)) return false;
		return await runWithGatewayHttpWorkAdmission(res, async () => {
			if (!loadedHooksRequestHandler) {
				const { createGatewayHooksRequestHandler } = await import("./hooks-Bik-Tkm9.mjs");
				loadedHooksRequestHandler = createGatewayHooksRequestHandler({
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
		const { handleMcpOAuthCallback } = await import("./mcp-oauth-callback-DvUJMzux.mjs");
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
				import("./server-startup-session-migration-DoGt3pCv.mjs"),
				import("./prepared-model-runtime-DcL1zc7k.mjs"),
				import("./prepared-model-runtime.configured-D544LJum.mjs"),
				import("./runtime-Bttj9d8S.mjs")
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
	const options = runtime.tlsOptions;
	if (!runtime.enabled || !options || params.isClosing()) return;
	const paths = [
		runtime.certPath,
		runtime.keyPath,
		runtime.caPath
	].filter((value) => Boolean(value));
	let enabled = params.enabled;
	let stopped = false;
	let epoch = 0;
	let timer;
	let pending = Promise.resolve();
	const isCurrent = (expected) => !stopped && enabled && !params.isClosing() && epoch === expected;
	const requestRefresh = () => {
		const expected = ++epoch;
		clearTimeout(timer);
		if (!isCurrent(expected)) {
			if (!stopped && !enabled && !params.isClosing()) params.log.info("gateway TLS renewal deferred (gateway.reload.mode=off)");
			return;
		}
		timer = setTimeout(() => {
			timer = void 0;
			pending = pending.then(async () => {
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
			});
		}, 300);
		timer.unref?.();
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
			stopped = true;
			epoch += 1;
			clearTimeout(timer);
			for (const path of paths) unwatchFile(path, requestRefresh);
			await pending;
		}
	};
}
//#endregion
//#region src/gateway/server-startup-finish.ts
const [POST_READY_MAINTENANCE_DELAY_MS, RETAINED_PLUGIN_CLEANUP_DELAY_MS] = [250, 3e4];
async function finishGatewayStartup(params) {
	const { kernelRuntime: runtime, port, bootId, opts, log, logHealth, logWsControl, logHooks, logChannels, logCron, logReload, loadGatewayStartupPostAttachModule } = params;
	const { minimalTestGateway, deps, runtimeState, kernel, startupTrace, broadcast, broadcastToConnIds, clients, sharedGatewaySessionGenerationState, workerEnvironmentService, workerPlacementRuntime, terminalLaunchPolicy, terminalSessions, nodeRegistry, nodeDesktopService, startChannel, stopChannel, getAttachedGatewayMethodRegistry, lifecycle, startupState, pluginRuntime, resolvePluginGatewayContext, gatewayTls, bindHost, getResolvedAuth, authRateLimiter, browserAuthRateLimiter, nodeReapprovalCoordinator, preauthHandshakeTimeoutMs, isGatewayStartupPending, attachedGatewayExtraHandlers, startListening, loadStartupPluginsModule, gatewayPluginConfigAtStart, startupActivationSourceConfig, defaultWorkspaceDir, coreGatewayMethodNames, pluginHostServices, baseMethods, startupPluginIds, pluginManifestRecords, pluginMetadataSnapshot, pluginLookUpTable, ambientEnvTriggers, prepareAttachedPluginRuntime, refreshAttachedGatewayDiscovery, wss, httpBindHosts, startChannels, broadcastPluginEvent, controlUiBasePath, controlUiRootLifecycle, sidecarStartup, workerLiveEvents, startEarlyRuntime, cfgAtStart, preauthConnectionBudget, releaseStartupAccountStarts, cronReconciliation, postReadyState, cronStartState, prepareReloadCandidate, configSnapshot, channelManager, activateRuntimeSecrets, applyFixedGatewayOverlays, resolveSharedGatewaySessionGenerationForConfig, stopRegisteredPostReadySidecars, registerPostReadySidecars, registerGatewayLifetimeSidecars, registerConnectionDependentSidecars, unregisterConnectionDependentSidecar, chatMetadataLifecycle, gatewayRequestContext, gatewayInstanceRuntime, getPluginMetadataSnapshot, getPluginNodeCapabilities } = runtime;
	const startupPluginRuntimeClaim = kernel.pluginRuntimeGeneration.currentClaim();
	const databaseStartupAdmission = getAgentDatabaseStartupAdmission();
	const getReadiness = runtime.createHttpTransportOptions().getReadiness;
	const { attachGatewayWsConnectionHandler } = await startupTrace.measure("gateway.ws-imports", () => import("./ws-connection-CfeqSp3X.mjs"));
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
		preauthHandshakeTimeoutMs,
		isStartupPending: isGatewayStartupPending,
		isPendingWorkerNodeSetup: workerEnvironmentService?.hasPendingNodeEnrollmentSetup,
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
	const loadScheduledServicesModule = createLazyPromise(() => import("./server-runtime-services-BdKTtzWh.mjs"), { cacheRejections: true });
	const activateScheduledServicesWhenReady = () => {
		if (opts.updateCanary || lifecycle.closePreludeStarted || !postAttachRuntimeReturned || !startupState.sidecarsReady || scheduledServicesActivated) return;
		scheduledServicesActivated = true;
		loadScheduledServicesModule().then((gatewayRuntimeServices) => {
			if (lifecycle.closePreludeStarted) return;
			const activated = gatewayRuntimeServices.activateGatewayScheduledServices({
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
	const { createGatewayServerActiveWorkInspectors } = await startupTrace.measure("gateway.active-work-import", () => import("./server-active-work-DON_ahXR.mjs"));
	const activeWorkInspectors = createGatewayServerActiveWorkInspectors(gatewayRequestContext);
	const trackStartupWork = (run) => {
		const operation = Promise.resolve().then(() => run(runtime.connectionWork.signal));
		return runtime.connectionWork.track(() => operation);
	};
	const postAttachHandles = await trackStartupWork(() => startupTrace.measure("runtime.post-attach", () => loadGatewayStartupPostAttachModule().then(({ startGatewayPostAttachRuntime }) => startGatewayPostAttachRuntime({
		minimalTestGateway,
		updateCanary: opts.updateCanary,
		cfgAtStart,
		getConfig: getRuntimeConfig,
		bindHost,
		bindHosts: httpBindHosts,
		port,
		tlsEnabled: gatewayTls.enabled,
		log,
		isNixMode,
		startupStartedAt: opts.startupStartedAt,
		broadcastToConnIds,
		getClientConnIds: gatewayRequestContext.getClientConnIds,
		broadcastPluginEvent,
		controlUiBasePath,
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
			const prepared = await prepareAttachedPluginRuntime(loaded);
			if (lifecycle.closePreludeStarted || !startupPluginRuntimeClaim.publish(prepared.publish)) return false;
			startupState.pendingReason = "startup-sidecars";
			prepared.afterCommit();
			const nodeCapabilitySurfaces = indexPluginNodeCapabilitySurfaces(getPluginNodeCapabilities());
			for (const client of clients) reconcileClientPluginNodeCapabilities(client, nodeCapabilitySurfaces);
			await refreshAttachedGatewayDiscovery(loaded.pluginRegistry, startupPluginRuntimeClaim);
			return true;
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
	if (databaseStartupAdmission && !opts.updateCanary) postAttachHandles.startupSettled.then(() => {
		if (!lifecycle.closePreludeStarted) activateGatewayAgentDatabaseStartup({
			admission: databaseStartupAdmission,
			getConfig: getRuntimeConfig,
			getPluginRegistry: () => pluginRuntime.registry,
			getPluginMetadataSnapshot,
			isCurrent: () => !lifecycle.closePreludeStarted,
			log
		});
	}).catch((error) => {
		log.warn(`agent database startup preparation could not activate: ${String(error)}`);
	});
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
		const { startOpenClawDatabaseIntegrityVerifier } = await import("./openclaw-database-verify-GR1BZzpE.mjs");
		registerGatewayLifetimeSidecars(startOpenClawDatabaseIntegrityVerifier({ env: process.env }));
	}
	postAttachRuntimeReturned = true;
	activateScheduledServicesWhenReady();
	const { startManagedGatewayConfigReloader } = await import("./server-reload-managed-3rgo6OQF.mjs");
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
		runtime: gatewayTls,
		servers: runtime.httpServers,
		enabled: cfgAtStart.gateway?.reload?.mode !== "off",
		isClosing: () => lifecycle.closePreludeStarted,
		onRenewed: async () => {
			await runtimeState.discovery?.update({ gatewayTlsFingerprintSha256: gatewayTls.fingerprintSha256 });
		},
		log: log.child("tls")
	});
	if (tlsRenewal) registerGatewayLifetimeSidecars(tlsRenewal);
	let appliedCustomPluginUiEnabled = gatewayPluginConfigAtStart.gateway?.controlUi?.experimental?.customPlugins === true;
	const configReloaderParams = {
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
			kernel.swapHeartbeatRunner(nextState.heartbeatRunner);
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
						const { listControlUiPluginCatalog } = await import("./control-ui-plugin-assets-DWZ5opWN.mjs");
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
			workerLiveEvents?.rebindAll(nextConfig);
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
		postReadyState.maintenanceTimer = gatewayRuntimeServices.scheduleGatewayPostReadyMaintenance({
			delayMs: POST_READY_MAINTENANCE_DELAY_MS,
			isClosing: () => lifecycle.closePreludeStarted,
			onStarted: () => {
				postReadyState.maintenanceTimer = null;
			},
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
			delayMs: RETAINED_PLUGIN_CLEANUP_DELAY_MS,
			retryDelayMs: RETAINED_PLUGIN_CLEANUP_DELAY_MS,
			isClosing: () => lifecycle.closePreludeStarted,
			isBusy: () => getActiveGatewayRootWorkCount({ excludeCurrent: true }) > 0,
			run: async () => {
				const { cleanupRetainedPluginInstallGenerations } = await import("./server-retained-plugin-cleanup-biQJpXia.mjs");
				await cleanupRetainedPluginInstallGenerations({
					log,
					startupInstallPaths
				});
			},
			log,
			errorMessage: "retained npm generation cleanup failed"
		}));
		registerGatewayLifetimeSidecars(gatewayRuntimeServices.scheduleGatewayIdleTask({
			delayMs: RETAINED_PLUGIN_CLEANUP_DELAY_MS,
			retryDelayMs: RETAINED_PLUGIN_CLEANUP_DELAY_MS,
			isClosing: () => lifecycle.closePreludeStarted,
			isBusy: () => getActiveGatewayRootWorkCount({ excludeCurrent: true }) > 0,
			repeatDelayMs: 9e5,
			run: async () => {
				const { reclaimAbandonedSqliteSnapshotsAsync } = await import("./sqlite-snapshot-staging-DA8nyCLV.mjs");
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
const loadGatewayStartupPostAttachModule = createLazyRuntimeModule(() => import("./server-startup-post-attach-BintE5Pf.mjs"));
const { log, logTailscale, logChannels, logHealth, logCron, logReload, logHooks, logWsControl } = gatewayKernelLogs;
const POST_READY_WORK_START_DELAY_MS = 500;
async function startGatewayServerCore(port = 18789, opts = {}) {
	const sdkResourceHost = new LegacyPluginSdkResourceHost();
	return await sdkResourceHost.run(() => startGatewayServerWithSdkHost(port, opts, sdkResourceHost));
}
async function startGatewayServerWithSdkHost(port, opts, sdkResourceHost) {
	let releasePostReadyWork = () => {};
	const postReadyWorkBarrier = new Promise((resolve) => {
		releasePostReadyWork = resolve;
	});
	const gatewayKernel = await createGatewayKernel(port, opts, {
		deferEarlyRuntime: true,
		sdkResourceHost
	});
	bumpSkillsSnapshotVersion({ reason: "manual" });
	if (!gatewayKernel.minimalTestGateway) beginMacOSSystemCaWarmupOnce({ log });
	let startupSettled;
	const { beginClosePrelude, closeOnStartupFailure, prepareClose, terminalSessions, shutdownRuntime } = gatewayKernel;
	try {
		const transport = await createGatewayHttpTransport({
			...gatewayKernel.createHttpTransportOptions(),
			updateCanary: opts.updateCanary,
			...!gatewayKernel.minimalTestGateway && gatewayKernel.tailscaleMode !== "off" ? { prepareManagedTailscaleIngress: async (backend) => {
				const { startGatewayTailscaleExposure } = await import("./server-tailscale-DlwMLZK0.mjs");
				const cleanup = await startGatewayTailscaleExposure({
					tailscaleMode: gatewayKernel.tailscaleMode,
					preserveFunnel: gatewayKernel.tailscaleConfig.preserveFunnel ?? false,
					port,
					backend,
					controlUiBasePath: gatewayKernel.controlUiBasePath,
					logTailscale
				});
				gatewayKernel.kernel.setTailscaleCleanup(cleanup);
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
	} catch (err) {
		releasePostReadyWork();
		return await rethrowGatewayStartupError(err, closeOnStartupFailure);
	}
	let postReadyWorkTimer;
	startupSettled.then(() => {
		if (gatewayKernel.lifecycle.closePreludeStarted) return;
		postReadyWorkTimer = setTimeout(releasePostReadyWork, POST_READY_WORK_START_DELAY_MS);
		postReadyWorkTimer.unref?.();
	}, () => {});
	let closePromise;
	return {
		startupSettled,
		getTailscaleIngressEndpoint: gatewayKernel.transportBridge.getTailscaleIngressEndpoint,
		close: (optsLocal) => {
			if (!closePromise) closePromise = sdkResourceHost.run(async () => {
				const prelude = beginClosePrelude(optsLocal);
				clearTimeout(postReadyWorkTimer);
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
