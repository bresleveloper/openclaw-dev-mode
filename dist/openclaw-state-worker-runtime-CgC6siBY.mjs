import { D as resolveExpiresAtMsFromDurationMs, N as resolveOptionalIntegerOption, g as isFutureDateTimestampMs, o as asDateTimestampMs, s as asFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString, s as normalizeNullableString } from "./string-coerce-CIXf7egm.mjs";
import { _ as normalizeUniqueTrimmedStringList } from "./string-normalization-_gRhJUDw.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { n as computeBackoff } from "./src-D4OikzaT.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { a as iterateSqliteQuerySync, c as prepareSqliteQueryTakeFirstSync, i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync, u as sql } from "./kysely-sync-Bn6Qrpbz.mjs";
import { a as isSqliteLockError } from "./sqlite-error-diagnostics-C8UyxYRx.mjs";
import { i as stageSqliteTransactionState, t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-DJbkHzN8.mjs";
import { i as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { t as SqliteSnapshotCleanupError } from "./sqlite-readonly-location-cleanup-uwwsHidB.mjs";
import { r as tableExists } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { n as normalizeSqliteNumber, t as coerceRequiredSqliteNumber } from "./sqlite-number-DM1AypRG.mjs";
import { n as sha256Hex } from "./node-crypto-Df3MIs6V.mjs";
import "./crypto-digest-D9Nqq3c7.mjs";
import { r as prepareSqliteReadOnlyLocationSync } from "./sqlite-snapshot-source-Bu0_ELYu.mjs";
import { i as sameSqliteFileGeneration, r as readStableSqliteFileGeneration } from "./sqlite-file-generation-bF3ZcoQs.mjs";
import { r as captureOpenClawStateDatabaseReadAdmission, y as requireOpenClawStateDatabaseIdentity } from "./openclaw-state-db-cache-Ci98mtX8.mjs";
import { t as extractSqliteTableSchema } from "./sqlite-schema-sql-5Wa9sNMr.mjs";
import { D as assertOpenClawStateDatabaseOwner, mt as upsertBoundDeliveryQueueEntryInDatabase, r as openOpenClawStateReadConnection, tt as OPENCLAW_STATE_SCHEMA_SQL, ut as loadDeliveryQueueEntryInDatabase } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import { t as buildApprovalResolutionRef } from "./approval-resolution-ref-BMBlVd2b.mjs";
import { l as isOpenClawStateWriteContentionError } from "./openclaw-state-ownership-OLtsPpqu.mjs";
import { a as withArtifactPreservingStateReads, d as withOpenClawStateDatabaseReadOnly, s as withExistingOpenClawStateDatabaseArtifactPreservingReadOnly, u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { i as SkillUploadRequestError, o as WorkerSessionAlreadyAttachedError, t as encodeOpenClawStateWorkerError } from "./openclaw-state-worker-error-DLFiBmPG.mjs";
import { n as readConfigMachineState } from "./config-machine-state-BfMkd608.mjs";
import { d as parseOfficialExternalPluginCatalogTimestamp, l as isOfficialExternalPluginCatalogSequence, n as HostedCatalogSignedFeedMonotonicityError } from "./official-external-plugin-catalog-source-CkmJlLAW.mjs";
import { I as withSharedStateWriteCoordinator, O as ensureWorkerEnvironmentNodeEnrollmentSchema, b as ensureMcpOAuthPendingSchema, c as runOpenClawStateWriteTransaction, l as runWithOpenClawStateBusyTimeout, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { a as readDeferredPluginMigrations } from "./deferred-plugin-migrations-DZuh_dkr.mjs";
import { i as requestSqliteWorkerOperationAdmission, r as deferSqliteWorkerCommitReceipt } from "./sqlite-worker-operation-admission-CG5jL3tH.mjs";
import { n as createSqliteAuditRecordKernel } from "./sqlite-audit-record-store-CJXR3a08.mjs";
import { r as readConfigHealthSnapshotInDatabase, t as patchConfigHealthEntryInDatabase } from "./io.health-state.kernel-gktZBgVh.mjs";
import { i as updateConfigMachineStateInDatabase, r as updateConfigMachineState, t as deleteConfigMachineState } from "./config-machine-state-write-CSLKAek3.mjs";
import { n as readRemoteModelCatalog } from "./remote-store-DaFxwDuJ.mjs";
import { n as purgeExpiredSecretStoreEntriesInDatabase } from "./secret-store-expiry.kernel-DNhBREic.mjs";
import { n as normalizeDeviceAuthScopes } from "./device-auth-C-STNejO.mjs";
import { a as readDeviceAuthTokensFromDatabase, c as storeOriginDeviceTokenInDatabase, i as readDeviceAuthTokenObservationFromDatabase, n as clearOriginDeviceTokenInDatabase, o as readOriginDeviceTokenObservationFromDatabase, s as storeDeviceAuthTokenInDatabase, t as clearDeviceAuthTokenFromDatabase } from "./device-auth-store.kernel-CYN-08F6.mjs";
import { o as normalizeDevicePublicKeyBase64Url } from "./device-identity-B_zMrBd6.mjs";
import { a as roleScopesAllow, i as resolveScopeOutsideRequestedRoles, r as resolveMissingRequestedScope } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { i as replaceMcpOAuthStoreInDatabase, r as readMcpOAuthStoreInDatabase, t as MCP_OAUTH_PENDING_STATE_TTL_MS } from "./mcp-oauth-store.kernel-C5WU4FAG.mjs";
import { n as applyMcpOAuthMutation } from "./mcp-oauth-store.mutations-Cefiu8lq.mjs";
import { l as readAuthProfileRows, m as isMissingDatabasePath, n as SHARED_AUTH_STORE_STATE_KEY } from "./sqlite-json-DYv-pIUa.mjs";
import { _ as readAgentProvenanceBatchInDatabase, g as listAgentProvenanceInDatabase, h as ensureAgentProvenanceSchema } from "./agent-deletion-journal-CZw0kGMX.mjs";
import { s as readRegisteredAgentDatabases } from "./openclaw-agent-db-registry-listing-CHFiKgU_.mjs";
import { S as UserProfileOwnerError, _ as toUserProfile, b as userProfilesDb, c as projectUserProfileDisplay, f as selectProfileDisplayEntries, h as selectResolvedUserProfileMetadataById, m as selectResolvedUserProfileById, u as requireResolvedUserProfileMetadataById, w as ensureUserProfilesSchema, x as UserProfileNotFoundError } from "./user-profiles-internal-BxQLnWfo.mjs";
import { c as readUserModelAuthProfile } from "./user-model-accounts-C87WCnZM.mjs";
import { E as observePluginStateEntry, I as countLivePluginStateNamespaceEntries, L as deleteExpiredPluginStateEntries, M as registerPluginStateEntry, R as deletePluginStateEntry, T as compareAndApplyPluginStateEntry, V as lookupPluginStateEntry, a as clearPluginStateNamespace, c as movePluginStateEntries, d as withPluginStateDatabaseReadOnly, f as wrapPluginStateError, h as lookupPluginStateEntries, i as pluginStateWorkerOperations, l as registerPluginStateEntryIfAbsent, m as listPluginStateEntriesInKeyRange, o as consumePluginStateEntry, p as listPluginStateEntries, r as isPluginStateWorkerCommand, s as deletePluginStateEntryIfEqual, t as capturePluginStateWorkerFailure, v as registerPluginStateSequencedJournalEntryInDatabase } from "./plugin-state-worker-errors-DPQ69K6p.mjs";
import { D as writeUserPreferences, E as readUserPreferences, g as readUserProfileEmailBindings, m as listUserProfilesSync, w as ensureUserPreferencesSchema, y as listUserProfileGitHubLogins } from "./user-profile-list-B5pNqyXa.mjs";
import { d as syncGitHubIdentity, n as ensureProfileForEmail, o as linkEmail, r as ensureProfileForTailscaleIdentity, t as ensureGatewayOwnerProfile, u as setUserProfileRole } from "./user-profiles-CRttx6hj.mjs";
import { a as userChannelIdentitySubject, i as unlinkUserChannelIdentity, n as linkUserChannelIdentity, t as UserChannelIdentityConflictError } from "./user-channel-identities-DJHsZMHD.mjs";
import { c as pluginBlobDeleteExpiredKeyInDatabase, d as pluginBlobRegisterInDatabase, f as wrapPluginBlobError, l as pluginBlobDeleteInDatabase, n as pluginBlobWorkerOperations, o as pluginBlobClearInDatabase, s as pluginBlobDeleteExpiredInDatabase, t as isPluginBlobWorkerCommand, u as pluginBlobRegisterIfAbsentInDatabase } from "./plugin-blob-worker-contract-CABc82se.mjs";
import { t as readClawInstallSchemaVersionRows } from "./provenance-runtime-read.kernel-BXAmUn6p.mjs";
import { r as serializeCronLoadError, t as loadCronStoreFromDatabase } from "./load.kernel-bWRpwlYl.mjs";
import { c as resolveExecApprovalsDisplayPath } from "./exec-approvals-config-C7iYNiP7.mjs";
import { t as applyExecAuthorizationCommit } from "./exec-approvals-authorization.kernel-DYisNIDQ.mjs";
import { n as assertNoPendingLegacyExecApprovals } from "./exec-approvals-migration-gate-GOr5zrOa.mjs";
import { c as serializeExecApprovals, l as snapshotFromExecApprovalsRow, n as assertExecApprovalsMutationAllowed, t as ExecApprovalsMutationFencedError, u as writeExecApprovalsConfigRow } from "./exec-approvals-sqlite-B0xu2OwW.mjs";
import { m as snapshotFromExecApprovalsDatabase } from "./exec-approvals-store-CTT-ox-I.mjs";
import { t as getSqliteWorkerStateContext } from "./sqlite-worker-state-context-C9ABaq_h.mjs";
import { n as assertOpenClawStateLeaseWorkerOwnedInTransaction } from "./openclaw-state-lease-worker-7PIEU0ow.mjs";
import { t as mutateSessionGroupCatalogInDatabase } from "./session-group-catalog.kernel-DD9IBaL5.mjs";
import { r as serializeAgentSchemaInspectionError } from "./openclaw-agent-schema-inspection-response-q57qjoFT.mjs";
import { r as persistInterruptedUpdateObservation } from "./update-run-interruption-store-BNvCRYfU.mjs";
import { l as recordSessionStateEventInDatabase, s as pruneSessionStateEventsInDatabase, t as listWatchedSessionUpstreamLinksInDatabase } from "./session-upstream-links.kernel-Cpo11-aI.mjs";
import { D as sameTaskBackingInstance, Dt as normalizeRestoredFlowRecord, Et as isTaskMirroredFlowSyncUnchanged, O as selectCurrentCanonicalTaskBacking, Ot as prepareTaskMirroredFlowSyncFromCurrent, R as findLatestTaskForFlowInSnapshot, S as createSubagentTaskBackingDetail, St as buildFlowRecord, U as normalizeTaskTimestamps, _ as upsertTaskDeliveryStateInDatabase, a as hasReadableTaskRegistrySchema, bt as areTaskFlowRecordsEqual, ct as bindTaskFlowRecord, d as readTaskRecord, dt as listTaskFlowViewRecordsForOwnerInDatabase, f as readTaskRegistryMutationSnapshotInDatabase, ft as readTaskFlowRecord, g as summarizeTaskRecordsForFlowInDatabase, gt as updateSelectedTaskFlowRecordInDatabase, h as readTaskViewRecordInDatabase, ht as syncTaskMirroredFlowRecordInDatabase, i as findTaskRecordByRunIdForViewInDatabase, k as applyTaskRecordPatch, l as listTaskRecordsForFlowReadInDatabase, lt as deleteTaskFlowRowInDatabase, mt as readTaskFlowViewRecordInDatabase, n as bindTaskRunExecutionInDatabase, p as readTaskRegistrySnapshot, pt as readTaskFlowRegistrySnapshot, s as listTaskRecordsByOwnerKeyInDatabase, st as bindTaskFlowExecutionInDatabase, t as bindTaskRecord, u as listTaskRecordsForOwnerReadInDatabase, ut as listTaskFlowRecordsForOwnerReadInDatabase, v as upsertTaskRunRowInDatabase, vt as upsertTaskFlowRowInDatabase, w as hasAuthoritativeTaskBackingFromRecords, wt as buildTaskMirroredFlowCreateFields, x as createManagedTaskBackingDetail, xt as assertControllerId, y as upsertTaskWithDeliveryStateInDatabase, yt as applyFlowPatch } from "./task-registry.store.kernel-BuNI8UuR.mjs";
import { n as isTerminalTaskFlow } from "./task-flow-registry.types-BidrdCoB.mjs";
import { c as parseTaskRuntime, l as parseTaskScopeKind, o as parseTaskDeliveryStatus, r as isTerminalTaskStatus, s as parseTaskNotifyPolicy, u as parseTaskStatus } from "./task-registry.types-CkM1jc3D.mjs";
import { i as createEmptyTaskStatusSummary, n as addTaskStatusSummaryRecord } from "./task-registry.summary-BJx95J9k.mjs";
import { n as restoreTaskExecutionSnapshot } from "./task-execution-owner-CARpGK5P.mjs";
import { i as writeSubagentRunValuesInDatabase } from "./subagent-registry.store.kernel-BoNquCdf.mjs";
import { n as isTaskFlowCancellationPending } from "./task-cancellation-state-7hPsgm-K.mjs";
import { f as captureTaskCreationEventTarget, l as prepareTaskAgentEventUpdate, n as selectExistingTaskForCreate, r as captureTaskAgentEventCommit, t as runTaskCreateOperation } from "./task-registry-create.operation-C5br7RkB.mjs";
import { c as runTaskRecordTransitionOperation, n as isOneTaskFlowEligible, o as updateTaskNotificationDelivery, r as acknowledgeTaskStateNotification, t as buildManagedFlowCancellationPatch } from "./task-initial-flow.rules-DO4-fPbE.mjs";
import { c as readCurrentConversationBindingResolutionInDatabase, l as readCurrentConversationBindingSelectionInDatabase, u as updateCurrentConversationBindingRecordInDatabase } from "./current-conversation-bindings.kernel-BU4rifLo.mjs";
import { r as normalizeChannel } from "./conversation-binding-session-key-B595E3Vw.mjs";
import { n as isParentFlowLinkError, t as assertParentFlowRecordLinkAllowed } from "./task-registry-parent-flow-rules-DMtL_vOT.mjs";
import { a as saveCronStoreInDatabase, c as serializeCronSaveError, i as saveCronStoreChangesInDatabase } from "./save.kernel-BmIaenr0.mjs";
import { t as resolveTaskFlowMaintenanceAction } from "./task-flow-maintenance-policy-D74gWLqm.mjs";
import { c as getDeliveryQueueEntriesOwnersInDatabase, d as prepareDeliveryQueueTerminalEntry, f as pruneExpiredDeliveryQueueTombstonesInDatabase, g as upsertDeliveryQueueEntryInDatabase, h as updateDeliveryQueueEntryInDatabase, l as getDeliveryQueueEntryOwnersInDatabase, m as terminalizePendingDeliveryQueueEntryInDatabase, o as deliveryQueueEntryNotFoundError, r as countFailedDeliveryQueueEntriesInDatabase, t as completeDeliveryQueueEntryInDatabase, u as loadDeliveryQueueEntriesInDatabase } from "./delivery-queue-sqlite.kernel-Pf7zU9zY.mjs";
import { n as recordExecutionDecisionFactInDatabase, t as pruneExpiredExecutionDecisionFactsInDatabase } from "./execution-decision-facts--8ty_5Z3.mjs";
import { r as processExecutionDecisionWorkInDatabase } from "./execution-decision-work-2rlltydX.mjs";
import { a as upsertDeliveryQueueEntryOnceAcrossNamespacesInDatabase, g as acceptedPreparedOutboundEntries, m as renewDeliveryQueueEntryPlatformSendLeaseInDatabase, o as ackDeliveryInDatabase, r as movePendingDeliveryQueueEntryNamespaceInDatabase, s as failPendingDeliveryInDatabase, t as commitStagedDeliveryQueueEntryOnceAcrossNamespacesInDatabase, u as claimDeliveryQueueEntryPlatformSendInDatabase } from "./delivery-queue-sqlite-namespace.kernel-CbSzRfE6.mjs";
import { n as collectEntrySpoolPaths } from "./delivery-queue-media-paths-BxTKmyok.mjs";
import { a as OUTBOUND_DELIVERY_QUEUE_NAME, i as OUTBOUND_DELIVERY_PREPARATION_QUEUE_NAME, n as LEGACY_OUTBOUND_DELIVERY_QUEUE_NAME, o as OUTBOUND_LEGACY_PREPARATION_QUEUE_NAME, r as OUTBOUND_DELIVERY_MIGRATION_QUEUE_NAME, t as DELIVERY_QUEUE_MEDIA_STAGING_QUEUE_NAME } from "./delivery-queue-namespaces-CO-cZrdV.mjs";
import { n as loadDeliveryQueueMediaRetentionSnapshotInDatabase } from "./delivery-queue-media-staging.kernel-CWmLB9kk.mjs";
import { _ as parseWorkerEnvironmentState, a as assertCredentialSessionBinding, c as normalizeBootstrapReceipt, d as normalizeRpcSetVersion, f as normalizeSessionId, g as canTransitionWorkerEnvironment, h as createWorkerEnvironmentCommitAdmission, i as TERMINAL_STATES, l as normalizeCredentialHash, m as requireWorkerEnvironmentString, o as assertShape, p as normalizeWorkerSshEndpoint, s as normalizeAttachedSessionIds, u as normalizeExpiry } from "./store-native-publication-DNMm5oc5.mjs";
import { c as workerEnvironmentPreparationColumns, o as readWorkerEnvironmentPreparation, r as createPreparedEnvironmentStoreOps, t as assertPreparedEnvironmentAttachment } from "./prepared-environment-store-OTAww-4q.mjs";
import { t as SESSION_DELIVERY_QUEUE_NAME } from "./session-delivery-queue.records-rYJIeHGW.mjs";
import { n as mapTaskFlowView } from "./task-domain-views-aWJ48vkZ.mjs";
import { A as summaryFromRow, C as meetingTranscriptSessionQuery, D as readTranscriptSummaryInputRevision, E as readStoredTranscriptSummaryRevision, F as ensureMeetingTranscriptsSchema, L as TranscriptsSummaryChangedError, M as utteranceFromRow, N as createPreparedTranscriptDateReader, O as readTranscriptSummaryKeys, S as meetingTranscriptDb, T as readRecentStoppedTranscriptSession, _ as readTranscriptEntry, a as writeMeetingTranscriptSummaryInDatabase, g as readStoredTranscriptNotes, h as readLatestTranscriptEntry, j as transcriptSummaryInputRevisionFromRow, k as sessionFromRow, m as queryTranscriptReadEntries, o as TranscriptLibraryError, v as readTranscriptLibraryEntry, w as meetingTranscriptUtteranceQuery, x as appendMeetingTranscriptUtterance } from "./store-sqlite-write-C8OaAvQF.mjs";
import { t as resolveNodePairApprovalScopes } from "./node-pairing-authz-KyMm4tmF.mjs";
import { f as validateSkillProposalRecord } from "./store-sqlite-record-B7LlWdpb.mjs";
import { r as ensureSkillWorkshopSchemaInDatabase } from "./store-sqlite-schema-DWgDn_pU.mjs";
import { n as listStoredSkillProposalEventsInDatabase, r as readAppliedSkillProposalEvents } from "./store-sqlite-event-Bc941MQA.mjs";
import { r as readSkillCuratorReviewStatus } from "./collection-review-state-Co_eCFXB.mjs";
import { _ as resolveDeviceProfileScopes, c as deviceBootstrapProfilesEqual, f as normalizeDeviceBootstrapHandoffProfile, g as resolveDeviceProfileRoleScopes, m as resolveBootstrapProfileScopesForRole, p as normalizeDeviceBootstrapProfile, r as CONTROL_UI_OWNER_BOOTSTRAP_PROFILE } from "./device-bootstrap-profile-CLBYuPAv.mjs";
import { A as resolveDevicePairingStoreRevision, C as persistDeviceBootstrapTokenRecords, D as updatePairedDeviceNodeSurfaceInTransaction, E as readDevicePairingStoreStateFromDatabase, O as updatePairedDevicePresenceInTransaction, S as loadPairedDevicePairingStoreRecordFromDatabase, T as pruneExpiredDevicePairSetupCompletionRecords, _ as sameDevicePairingStringSet, a as resolveNodePairingGeneration, b as loadDeviceBootstrapTokenRecords, c as loadDevicePairingStateForMutation, d as normalizeDevicePairingId, f as normalizeDevicePairingRole, g as resolveRequestedDeviceRoles, h as resolvePairingRequestExpiry, k as withDevicePairingStoreDatabase, l as mergeDevicePairingRoles, m as reconcilePendingPairingRequests, o as resolveNodePairingState, p as preserveDeviceRoleScopes, r as listApprovedPairedDeviceRoles, s as cloneDevicePairingTokens, t as clearNodePairingGenerationState, u as mergeDevicePairingScopes, v as confirmDevicePairSetupCompletionDeliveryInTransaction, w as persistDevicePairingStoreState, x as loadDevicePairSetupCompletionRecord, y as consumeDeviceBootstrapTokenWithSetupCompletionInTransaction } from "./device-pairing-identity-BnU9nqx2.mjs";
import { n as nextApnsRegistrationVersion } from "./push-apns-store-transaction--RBZ168D.mjs";
import { r as pruneExpiredPending } from "./pairing-files-BJQEMPCI.mjs";
import { n as listLiveRegistryWorktreeIdsInDatabase, r as listRegistryWorktreesInDatabase } from "./registry-read.kernel-DeJz6-H_.mjs";
import { c as toPublicPendingRequest, i as samePendingApprovalSurface, o as toPairedNode, r as refreshPendingNodeSurface, s as toPendingSnapshot, t as buildPendingNodeSurface } from "./device-pairing-node.records-6nbBdP9Q.mjs";
import { t as nodeWorkerTurnMatchesIdentity } from "./node-worker-journal.types-DlTJd-PJ.mjs";
import { d as ensureCronRunReceiptSchema, l as bindCronRunReceiptExecutionInDatabase } from "./run-receipt-store-DXbr_IpT.mjs";
import { t as DEVICE_BOOTSTRAP_TOKEN_TTL_MS } from "./device-bootstrap.worker-types-B_8ydFBr.mjs";
import { n as verifyPairingToken, t as generatePairingToken } from "./pairing-token-CzXJ-1-p.mjs";
import { n as resolveRoleTokenScopes, t as createDeviceAuthToken } from "./device-pairing-token-utils-DMt1Yqt3.mjs";
import { a as readNativeHookRelayBridgeSnapshotFromDatabase, i as pruneNativeHookRelayBridgeRecordsInDatabase, n as deleteNativeHookRelayBridgeRecordIfOwnedInDatabase, o as renewOrRestoreNativeHookRelayBridgeRecordInDatabase, r as listNativeHookRelayBridgeSnapshotsInDatabase, s as writeNativeHookRelayBridgeRecordInDatabase } from "./native-hook-relay-store.kernel-IocTopts.mjs";
import { c as allocateHostPort } from "./cell-profile-CMF_XQjA.mjs";
import { m as readApnsRegistrationsFromDatabase, p as readApnsRegistrationFromDatabase, v as apnsRegistrationToRow } from "./push-apns-store-9CGb-HCs.mjs";
import { n as listManagedImageOriginalMediaIdsInDatabase, r as listManagedImageRecordEntriesInDatabase, s as readManagedImageRecordInDatabase } from "./managed-image-record-store.kernel-jj61quyd.mjs";
import { r as WebPushSubscriptionBindingError } from "./push-web-store.records-B7ppsd_i.mjs";
import { a as findBoundWebPushSubscriptionByEndpointInDatabase, c as listBoundWebPushSubscriptionsInDatabase, d as listWebPushSubscriptionsInDatabase, f as prepareWebPushApprovalDeliveriesInDatabase, h as upsertWebPushSubscriptionInDatabase, l as listTerminalWebPushApprovalDeliveryIdsInDatabase, m as setWebPushSubscriptionPreferencesInDatabase, n as deleteWebPushApprovalDeliveryTargetsInDatabase, o as hasBoundWebPushSubscriptionsInDatabase, p as readPersistedVapidKeyPairInDatabase, r as deleteWebPushSubscriptionIfCurrentInDatabase, s as insertVapidKeyPairIfAbsentInDatabase, t as deleteBoundWebPushSubscriptionInDatabase, u as listWebPushApprovalDeliveryTargetsInDatabase } from "./push-web-store.kernel-DCV7A944.mjs";
import { n as formatAuditWriterRequestError, t as formatAuditWriterError } from "./audit-event-writer.errors-D1EE-LzM.mjs";
import { a as removeProjectRegistryInDatabase, c as resolveRecordedProjectRootInDatabase, n as insertProjectRegistryInDatabase, o as resolveProjectCloneRefreshOwnerInDatabase, r as listProjectRegistryInDatabase, s as resolveProjectRegistryInDatabase, t as ensureProjectRegistrySchema } from "./project-registry.kernel-BVX6sQ_I.mjs";
import { t as isOnboardingRecommendationWriteCommand } from "./onboarding-recommendations.contract.js";
import { A as stringifyPresentation, C as inputMatchesExistingRow, D as requireString, E as requireApprovalId, O as selectOperatorApprovalRow, S as hasApprovalLocatorNamespaceConflict, T as normalizeExecutionIdentityBinding, _ as OPERATOR_APPROVAL_TERMINAL_RETENTION_MS, b as denyCorruptPendingRow, d as expireDueOperatorApprovalsInDatabase, f as forceDenyOperatorApprovalInDatabase, g as OPERATOR_APPROVAL_MAX_LIST_LIMIT, h as OPERATOR_APPROVAL_EXECUTION_IDENTITY_SCHEMA_SQL, k as selectOperatorApprovalRowByLocator, m as resolveOperatorApprovalInDatabase, u as consumeOperatorApprovalAllowOnceInDatabase, w as isValidTimestamp, x as expirePendingRow, y as decodeOperatorApprovalRow } from "./operator-approval-store-ZXCDEDUV.mjs";
import { t as matchesOperatorApprovalReviewerBinding } from "./operator-approval-reviewer-binding-BAnifkBq.mjs";
import { c as AUDIT_EVENT_RETENTION_MS, d as recordAuditEventInDatabase, f as rowToAuditEvent, n as processExecutionIdentityAdmissionWorkInDatabase, o as pruneExpiredOutboundMessageProgressInDatabase, p as isOutboundMessageProgressInput, r as pruneExpiredExecutionIdentityContextsInDatabase, s as recordOutboundMessageProgressInDatabase, u as pruneExpiredAuditEventsInDatabase } from "./execution-identity-context-DECY7Bc9.mjs";
import { a as deleteSkillUploadState, c as renewSkillUploadInstallLease, d as selectSkillUploadMetadata, i as deleteOwnedSkillUpload, l as requireUploadMetadata, n as assertNotExpired, o as hasLiveSkillUploadInstallLease, r as deleteExpiredSkillUploadUnlessLeasedInDatabase, s as readSkillUploadArchiveChunks, t as SKILL_UPLOAD_LEASE_SCOPE } from "./upload-store.sqlite-DAwbj8jh.mjs";
import { r as readPendingRepositoryGitHubPublicationInDatabase } from "./github-repository-publication.kernel-B5cAALar.mjs";
import { t as normalizeWorkerDesktopEndpoint } from "./desktop-endpoint-B88FUkSW.mjs";
import { i as isNodeWorkerTerminalState, n as readNodeWorkerLaunchReceipt, r as settleNodeWorkerActiveTurns, t as NodeWorkerLaunchKernel } from "./node-worker-launch-store.kernel-YVRG5nuY.mjs";
import fs from "node:fs";
import { isDeepStrictEqual } from "node:util";
import { AsyncLocalStorage } from "node:async_hooks";
import { createHash, randomUUID } from "node:crypto";
//#region src/agents/harness/native-hook-relay-store.worker.ts
function executeNativeHookRelayMutation(command, options) {
	return runOpenClawStateWriteTransaction((database) => {
		switch (command.type) {
			case "nativeHookRelay.write":
			case "nativeHookRelay.renew":
				requestSqliteWorkerOperationAdmission({
					stage: "transaction",
					facts: void 0
				});
				return command.type === "nativeHookRelay.write" ? writeNativeHookRelayBridgeRecordInDatabase(database, command.input) : renewOrRestoreNativeHookRelayBridgeRecordInDatabase(database, command.input);
			case "nativeHookRelay.deleteOwned": return deleteNativeHookRelayBridgeRecordIfOwnedInDatabase(database, command.input);
			case "nativeHookRelay.prune": return pruneNativeHookRelayBridgeRecordsInDatabase(database, command.input.candidates, command.input.nowMs);
		}
	}, options);
}
//#endregion
//#region src/agents/mcp-oauth-store.worker.ts
/** Select this feature's commands from the typed shared-state wire contract. */
function isMcpOAuthWorkerCommand(command) {
	switch (command.type) {
		case "mcpOAuth.read":
		case "mcpOAuth.mutate":
		case "mcpOAuth.consumePending":
		case "mcpOAuth.writePending":
		case "mcpOAuth.deletePending":
		case "mcpOAuth.clear":
		case "mcpOAuth.clearPendingPrefix": return true;
		default: return false;
	}
}
function assertStoreLease(database, input, stage = "transaction") {
	if (input.identity.scope !== "core:mcp-oauth" || input.identity.key !== input.storeKey) throw new Error("MCP OAuth mutation requires its exact store lease");
	assertOpenClawStateLeaseWorkerOwnedInTransaction(database, input.identity, "write", stage);
}
const pendingSchemaDatabases = /* @__PURE__ */ new WeakSet();
function ensurePendingSchema(database) {
	if (pendingSchemaDatabases.has(database)) return;
	ensureMcpOAuthPendingSchema(database);
	deferSqlitePostCommitPublication(database, () => pendingSchemaDatabases.add(database));
}
/** Keep feature reads and writes on the shared-state worker's retained database. */
function executeMcpOAuthWorkerCommand(database, command) {
	if (command.type === "mcpOAuth.read") return readMcpOAuthStoreInDatabase(database.db, command.input);
	return runOpenClawStateWriteTransaction(({ db }) => {
		const result = executeMcpOAuthWriteInTransaction(db, command);
		if (command.type === "mcpOAuth.clearPendingPrefix") requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: void 0
		});
		else assertStoreLease(db, command.input, "commit");
		return result;
	}, {
		database,
		path: database.path,
		env: getSqliteWorkerStateContext().environment
	});
}
function executeMcpOAuthWriteInTransaction(database, command) {
	const kysely = getNodeSqliteKysely(database);
	if (command.type === "mcpOAuth.clearPendingPrefix") {
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: void 0
		});
		ensurePendingSchema(database);
		executeSqliteQuerySync(database, kysely.deleteFrom("mcp_oauth_pending_authorizations").where("store_key", "like", `${command.input}%`));
		return;
	}
	const { storeKey } = command.input;
	const assertOwned = () => assertStoreLease(database, command.input);
	if (command.type === "mcpOAuth.mutate") {
		const result = applyMcpOAuthMutation(readMcpOAuthStoreInDatabase(database, storeKey), command.input.mutation);
		replaceMcpOAuthStoreInDatabase(database, storeKey, result.store, assertOwned);
		return result;
	}
	assertOwned();
	ensurePendingSchema(database);
	const deletePending = () => {
		assertOwned();
		executeSqliteQuerySync(database, kysely.deleteFrom("mcp_oauth_pending_authorizations").where("store_key", "=", storeKey));
	};
	switch (command.type) {
		case "mcpOAuth.consumePending":
			assertOwned();
			return executeSqliteQuerySync(database, kysely.deleteFrom("mcp_oauth_pending_authorizations").where("store_key", "=", storeKey).where("state", "=", command.input.state).where("create_time", ">", Date.now() - MCP_OAUTH_PENDING_STATE_TTL_MS)).numAffectedRows === 1n;
		case "mcpOAuth.writePending": {
			const now = Date.now();
			assertOwned();
			executeSqliteQuerySync(database, kysely.deleteFrom("mcp_oauth_pending_authorizations").where("create_time", "<=", now - MCP_OAUTH_PENDING_STATE_TTL_MS));
			deletePending();
			assertOwned();
			executeSqliteQuerySync(database, kysely.insertInto("mcp_oauth_pending_authorizations").values({
				state: command.input.state,
				store_key: storeKey,
				create_time: now
			}));
			return;
		}
		case "mcpOAuth.deletePending":
			deletePending();
			return;
		case "mcpOAuth.clear":
			replaceMcpOAuthStoreInDatabase(database, storeKey, { credentialState: "cleared" }, assertOwned);
			deletePending();
			return;
	}
	throw new Error("Unknown MCP OAuth write command");
}
//#endregion
//#region src/audit/audit-event-read.kernel.ts
/** Connection-bound query kernel; production list reads execute only in the state worker. */
function listAuditEventsInDatabase(db, params) {
	const filters = params.filters ?? {};
	const retainedAfter = params.now - AUDIT_EVENT_RETENTION_MS;
	let query = getNodeSqliteKysely(db).selectFrom("audit_events").selectAll().where("occurred_at", ">=", retainedAfter).where("action", "not in", ["message.outbound.queued", "message.outbound.platform-started"]);
	if (params.cursor !== void 0) query = query.where("sequence", "<", params.cursor);
	if (filters.agentId) query = query.where("agent_id", "=", filters.agentId);
	if (filters.sessionKey) query = query.where("session_key", "=", filters.sessionKey);
	if (filters.runId) query = query.where("run_id", "=", filters.runId);
	if (filters.kind) query = query.where("kind", "=", filters.kind);
	else if (filters.includeMessages !== true) query = query.where("kind", "!=", "message");
	if (filters.status) query = query.where("status", "=", filters.status);
	if (filters.direction) query = query.where("direction", "=", filters.direction);
	if (filters.channel) query = query.where("channel", "=", filters.channel);
	if (filters.after !== void 0) query = query.where("occurred_at", ">=", filters.after);
	if (filters.before !== void 0) query = query.where("occurred_at", "<=", filters.before);
	const rows = executeSqliteQuerySync(db, query.orderBy("sequence", "desc").limit(params.limit + 1)).rows;
	const hasMore = rows.length > params.limit;
	const events = (hasMore ? rows.slice(0, params.limit) : rows).map(rowToAuditEvent);
	return {
		events,
		...hasMore && events.length > 0 ? { nextCursor: events[events.length - 1]?.sequence } : {}
	};
}
//#endregion
//#region src/audit/audit-event-writer.worker.ts
/** Execute one FIFO attempt on the shared actor, including fail-fast first use. */
function executeAuditWriterCommand(command, options, retainDatabase) {
	try {
		return runWithOpenClawStateBusyTimeout(() => {
			const database = {
				...options,
				database: retainDatabase()
			};
			if (command.type === "audit.writer.prune") {
				const maintenance = {
					events: pruneExpiredAuditEventsInDatabase,
					identity: pruneExpiredExecutionIdentityContextsInDatabase,
					decisions: pruneExpiredExecutionDecisionFactsInDatabase,
					progress: pruneExpiredOutboundMessageProgressInDatabase
				}[command.input];
				return {
					status: "settled",
					deleted: maintenance({ database })
				};
			}
			const request = command.input;
			if (request.type === "record-event") {
				if (isOutboundMessageProgressInput(request.input)) recordOutboundMessageProgressInDatabase(request.input, database);
				else recordAuditEventInDatabase(request.input, database);
			} else if (request.type === "record-execution-identity") processExecutionIdentityAdmissionWorkInDatabase(request.work, database);
			else if (request.type === "record-execution-decision-work") processExecutionDecisionWorkInDatabase(request.work, database);
			else recordExecutionDecisionFactInDatabase(request.receipt, database);
			return { status: "settled" };
		}, options, 0);
	} catch (error) {
		if (isOpenClawStateWriteContentionError(error)) return { status: "retry" };
		return {
			status: "settled",
			error: command.type === "audit.writer.process" ? formatAuditWriterRequestError(command.input, error) : formatAuditWriterError(error)
		};
	}
}
//#endregion
//#region src/commands/doctor-db-bloat.read.ts
function readSqliteBloatStats(pathname) {
	let fileBytes;
	try {
		fileBytes = fs.statSync(pathname, { throwIfNoEntry: false })?.size ?? 0;
	} catch {
		return null;
	}
	if (fileBytes <= 0) return null;
	let connection;
	try {
		connection = openOpenClawStateReadConnection(pathname, prepareSqliteReadOnlyLocationSync(pathname));
		const db = connection.database.db;
		const pageSize = readPragmaNumber(db, "page_size") ?? 4096;
		const freelistCount = readPragmaNumber(db, "freelist_count") ?? 0;
		const autoVacuum = readPragmaNumber(db, "auto_vacuum") ?? 0;
		return {
			fileBytes,
			freeBytes: freelistCount * pageSize,
			incrementalAutoVacuum: autoVacuum === 2
		};
	} catch (error) {
		if (error instanceof SqliteSnapshotCleanupError) throw error;
		return null;
	} finally {
		connection?.close();
	}
}
function readPragmaNumber(db, pragma) {
	const row = db.prepare(`PRAGMA ${pragma}`).get();
	return asFiniteNumber(row?.[pragma]) ?? null;
}
function readSqliteDatabaseBloat(params) {
	const results = [];
	const stateStats = readSqliteBloatStats(params.path);
	if (stateStats) results.push({
		label: "state DB",
		stats: stateStats
	});
	const registered = withArtifactPreservingStateReads(() => readRegisteredAgentDatabases(params, false));
	for (const entry of registered) {
		const stats = readSqliteBloatStats(entry.path);
		if (stats) results.push({
			label: `agent DB (${entry.agentId})`,
			stats
		});
	}
	return results;
}
//#endregion
//#region src/commands/doctor-skill-workshop-read.kernel.ts
function readWorkshopMigrationRecordsInDatabase(database, includeEvents) {
	let records = [];
	let appliedEvents = [];
	if (tableExists(database, "skill_workshop_proposals")) {
		const kysely = getNodeSqliteKysely(database);
		records = executeSqliteQuerySync(database, kysely.selectFrom("skill_workshop_proposals").select(["record_json", "owner_agent_id"])).rows.flatMap((row) => {
			try {
				const parsed = validateSkillProposalRecord(JSON.parse(row.record_json));
				return parsed.ok ? [{
					record: parsed.value,
					ownerAgentId: row.owner_agent_id
				}] : [];
			} catch {
				return [];
			}
		});
		if (includeEvents && tableExists(database, "skill_workshop_proposal_events")) appliedEvents = readAppliedSkillProposalEvents(database);
	}
	return {
		records,
		appliedEvents
	};
}
//#endregion
//#region src/cron/store/load.worker.ts
function loadMutableCronStoreInWorker(database, storeKey) {
	let repairCommits = 0;
	try {
		return {
			ok: true,
			loaded: loadCronStoreFromDatabase(database.db, storeKey, {
				write: (operation, operationLabel) => runOpenClawStateWriteTransaction(({ db }) => operation(db), {
					database,
					env: getSqliteWorkerStateContext().environment
				}, { operationLabel }),
				committed: () => {
					repairCommits += 1;
				}
			}),
			repairCommits
		};
	} catch (error) {
		return {
			ok: false,
			error: serializeCronLoadError(error),
			repairCommits
		};
	}
}
//#endregion
//#region src/cron/store/save.worker.ts
function executeCronStoreSaveCommand(command, database) {
	let committed = false;
	try {
		return {
			ok: true,
			value: runOpenClawStateWriteTransaction(({ db }) => {
				let value;
				if (command.type === "cron.saveChanges") value = saveCronStoreChangesInDatabase(db, command.input.storeKey, command.input.storeKey, command.input.changes, command.input.options);
				else saveCronStoreInDatabase(database, command.input.storeKey, command.input.store, command.input.options);
				deferSqlitePostCommitPublication(db, () => {
					committed = true;
				});
				return value;
			}, {
				database,
				env: getSqliteWorkerStateContext().environment
			}, command.type === "cron.saveChanges" ? { operationLabel: "cron.config-mutation" } : void 0),
			committed
		};
	} catch (error) {
		return {
			ok: false,
			error: serializeCronSaveError(error, command.input.storeKey),
			committed
		};
	}
}
//#endregion
//#region src/cron/store/dispatch.worker.ts
const loadRecovery = createLazyRuntimeModule(() => import("./run-recovery.worker-ybYQkKMQ.mjs"));
let recovery;
const loadMaintenance = createLazyRuntimeModule(() => import("./runtime-maintenance.worker-DPCFpAe6.mjs"));
let maintenance;
function prepareCronStateWorkerCommand(type) {
	if ((type === "cron.scheduleUnowned" || type === "cron.recordFailureAlertOutcome") && !maintenance) return loadMaintenance().then((loaded) => {
		maintenance = loaded;
	});
	if (type !== "cron.repairRun" || recovery) return;
	return loadRecovery().then((loaded) => {
		recovery = loaded;
	});
}
function isCronStateWorkerCommand(command) {
	switch (command.type) {
		case "cron.loadMutable":
		case "cron.initializeRunReceipts":
		case "cron.repairRun":
		case "cron.scheduleUnowned":
		case "cron.recordFailureAlertOutcome":
		case "cron.save":
		case "cron.saveChanges":
		case "cron.bindReceiptExecution": return true;
		default: return false;
	}
}
function executeCronStateCommand(command, database) {
	switch (command.type) {
		case "cron.loadMutable": return loadMutableCronStoreInWorker(database, command.input.storeKey);
		case "cron.repairRun":
			if (!recovery) throw new Error("Cron recovery worker is not prepared");
			return recovery.repairCronRunInWorker(database, command.input);
		case "cron.scheduleUnowned":
		case "cron.recordFailureAlertOutcome":
			if (!maintenance) throw new Error("Cron maintenance worker is not prepared");
			return command.type === "cron.scheduleUnowned" ? maintenance.scheduleUnownedCronJobsInWorker(database, command.input) : maintenance.recordCronFailureAlertOutcomeInWorker(database, command.input);
		case "cron.initializeRunReceipts": return runOpenClawStateWriteTransaction(({ db }) => {
			requestSqliteWorkerOperationAdmission({
				stage: "transaction",
				facts: void 0
			});
			ensureCronRunReceiptSchema(db);
			requestSqliteWorkerOperationAdmission({
				stage: "commit",
				facts: void 0
			});
		}, {
			database,
			path: database.path,
			env: getSqliteWorkerStateContext().environment
		}, { operationLabel: "cron.run-receipt.initialize" });
		case "cron.save":
		case "cron.saveChanges": return executeCronStoreSaveCommand(command, database);
		case "cron.bindReceiptExecution": return runOpenClawStateWriteTransaction(({ db }) => {
			requestSqliteWorkerOperationAdmission({
				stage: "transaction",
				facts: void 0
			});
			const result = bindCronRunReceiptExecutionInDatabase(db, command.input.handle, command.input.binding);
			requestSqliteWorkerOperationAdmission({
				stage: "commit",
				facts: void 0
			});
			return result;
		}, {
			database,
			path: database.path,
			env: getSqliteWorkerStateContext().environment
		}, { operationLabel: "cron.run-receipt.execution-binding" });
		default: throw new Error("Unknown Cron shared-state worker command");
	}
}
//#endregion
//#region src/fleet/registry.kernel.ts
const FLEET_OPERATION_LEASE_SCOPE = "fleet-cell-operation";
const FLEET_OPERATION_LEASE_TTL_MS = 3e5;
/** The live caller scope and this transaction jointly fence a queued cell mutation. */
function assertFleetCellOperationInDatabase(db, tenantId, owner) {
	if (owner === void 0) return;
	if (!executeSqliteQueryTakeFirstSync(db, kyselyFor(db).selectFrom("state_leases").select("owner").where("scope", "=", FLEET_OPERATION_LEASE_SCOPE).where("lease_key", "=", tenantId).where("owner", "=", owner).where("expires_at", ">", Date.now()))) throw new Error(`Fleet operation lease was lost for ${tenantId}.`);
}
function kyselyFor(db) {
	return getNodeSqliteKysely(db);
}
function recordToRow(record) {
	return {
		tenant_id: record.tenantId,
		created_at_ms: record.createdAtMs,
		image: record.image,
		runtime: record.runtime,
		host_port: record.hostPort,
		container_name: record.containerName,
		data_dir: record.dataDir
	};
}
function reserveFleetCellInDatabase(db, params) {
	const kysely = kyselyFor(db);
	if (executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("fleet_cells").select("tenant_id").where("tenant_id", "=", params.tenantId))) throw new Error(`Fleet cell already exists: ${params.tenantId}`);
	const usedPorts = executeSqliteQuerySync(db, kysely.selectFrom("fleet_cells").select("host_port")).rows.map((row) => row.host_port);
	const hostPort = allocateHostPort(usedPorts, params.requestedPort);
	const record = {
		tenantId: params.tenantId,
		createdAtMs: params.createdAtMs,
		image: params.image,
		runtime: params.runtime,
		hostPort,
		containerName: params.containerName,
		dataDir: params.dataDir
	};
	executeSqliteQuerySync(db, kysely.insertInto("fleet_cells").values(recordToRow(record)));
	return record;
}
function updateFleetCellImageInDatabase(db, tenantId, image) {
	if (executeSqliteQuerySync(db, kyselyFor(db).updateTable("fleet_cells").set({ image }).where("tenant_id", "=", tenantId)).numAffectedRows !== 1n) throw new Error(`Fleet cell disappeared before its image could be updated: ${tenantId}`);
}
function acquireFleetCellOperationInDatabase(db, params) {
	const nowMs = params.nowMs ?? Date.now();
	const expiresAt = nowMs + FLEET_OPERATION_LEASE_TTL_MS;
	const kysely = kyselyFor(db);
	executeSqliteQuerySync(db, kysely.deleteFrom("state_leases").where("scope", "=", FLEET_OPERATION_LEASE_SCOPE).where("lease_key", "=", params.tenantId).where("expires_at", "<=", nowMs));
	const existing = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("state_leases").select(["expires_at", "payload_json"]).where("scope", "=", FLEET_OPERATION_LEASE_SCOPE).where("lease_key", "=", params.tenantId));
	if (existing) {
		let operation = "fleet operation";
		try {
			const payload = existing.payload_json ? JSON.parse(existing.payload_json) : void 0;
			if (typeof payload === "object" && payload !== null && "operation" in payload && typeof payload.operation === "string") operation = `fleet ${payload.operation}`;
		} catch {}
		throw new Error(`Another ${operation} is already running for ${params.tenantId}; retry after ${new Date(existing.expires_at ?? expiresAt).toISOString()}.`);
	}
	executeSqliteQuerySync(db, kysely.insertInto("state_leases").values({
		scope: FLEET_OPERATION_LEASE_SCOPE,
		lease_key: params.tenantId,
		owner: params.owner,
		expires_at: expiresAt,
		heartbeat_at: nowMs,
		payload_json: JSON.stringify({ operation: params.operation }),
		created_at: nowMs,
		updated_at: nowMs
	}));
}
function heartbeatFleetCellOperationInDatabase(db, params) {
	const nowMs = params.nowMs ?? Date.now();
	const expiresAt = nowMs + FLEET_OPERATION_LEASE_TTL_MS;
	if (executeSqliteQuerySync(db, kyselyFor(db).updateTable("state_leases").set({
		expires_at: expiresAt,
		heartbeat_at: nowMs,
		updated_at: nowMs
	}).where("scope", "=", FLEET_OPERATION_LEASE_SCOPE).where("lease_key", "=", params.tenantId).where("owner", "=", params.owner).where("expires_at", ">", nowMs)).numAffectedRows !== 1n) throw new Error(`Fleet operation lease was lost for ${params.tenantId}.`);
}
function releaseFleetCellOperationInDatabase(db, params) {
	executeSqliteQuerySync(db, kyselyFor(db).deleteFrom("state_leases").where("scope", "=", FLEET_OPERATION_LEASE_SCOPE).where("lease_key", "=", params.tenantId).where("owner", "=", params.owner));
}
function deleteFleetCellInDatabase(db, tenantId) {
	executeSqliteQuerySync(db, kyselyFor(db).deleteFrom("fleet_cells").where("tenant_id", "=", tenantId));
}
//#endregion
//#region src/fleet/registry.worker.ts
function executeFleetRegistryCommand(command, options) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		switch (command.type) {
			case "fleet.cell.reserve":
				assertFleetCellOperationInDatabase(db, command.input.tenantId, command.input.operationOwner);
				return reserveFleetCellInDatabase(db, command.input);
			case "fleet.cell.updateImage":
				assertFleetCellOperationInDatabase(db, command.input.tenantId, command.input.operationOwner);
				return updateFleetCellImageInDatabase(db, command.input.tenantId, command.input.image);
			case "fleet.cell.delete":
				assertFleetCellOperationInDatabase(db, command.input.tenantId, command.input.operationOwner);
				return deleteFleetCellInDatabase(db, command.input.tenantId);
			case "fleet.operation.acquire": return acquireFleetCellOperationInDatabase(db, command.input);
			case "fleet.operation.heartbeat": return heartbeatFleetCellOperationInDatabase(db, command.input);
			case "fleet.operation.release": return releaseFleetCellOperationInDatabase(db, command.input);
		}
	}, options);
}
//#endregion
//#region src/gateway/operator-approval-store.kernel.ts
function insertOperatorApprovalInDatabase(params) {
	const input = params.approval;
	const id = requireApprovalId(input.id);
	const resolutionRef = buildApprovalResolutionRef({
		approvalId: id,
		approvalKind: input.kind
	});
	const runtimeEpoch = requireString(input.runtimeEpoch, "operator approval runtime epoch");
	if (!isValidTimestamp(input.createdAtMs) || !isValidTimestamp(input.expiresAtMs)) throw new Error("operator approval timestamps must be non-negative safe integers");
	if (input.expiresAtMs < input.createdAtMs) throw new Error("operator approval expiry cannot precede creation");
	const presentationJson = stringifyPresentation(input.presentation);
	if (input.presentation.kind !== input.kind) throw new Error("operator approval kind must match its safe presentation");
	const reviewerDeviceIdsJson = JSON.stringify(normalizeUniqueTrimmedStringList(input.reviewerDeviceIds));
	const audienceSessionKeys = normalizeUniqueTrimmedStringList(input.audienceSessionKeys);
	if (audienceSessionKeys.length > 64) throw new Error(`operator approval audience exceeds 64 sessions`);
	const audienceSessionKeysJson = JSON.stringify(audienceSessionKeys);
	const serialized = {
		presentationJson,
		reviewerDeviceIdsJson,
		audienceSessionKeysJson
	};
	const executionIdentityBinding = normalizeExecutionIdentityBinding(input);
	return runOpenClawStateWriteTransaction((database) => {
		const stateDb = getNodeSqliteKysely(database.db);
		executeSqliteQuerySync(database.db, stateDb.deleteFrom("operator_approvals").where("status", "!=", "pending").where("resolved_at_ms", "is not", null).where("resolved_at_ms", "<=", input.createdAtMs - OPERATOR_APPROVAL_TERMINAL_RETENTION_MS));
		if (hasApprovalLocatorNamespaceConflict({
			database,
			id,
			resolutionRef
		})) return { outcome: "conflict" };
		const source = input.source ?? {};
		const result = executeSqliteQuerySync(database.db, stateDb.insertInto("operator_approvals").values({
			approval_id: id,
			resolution_ref: resolutionRef,
			kind: input.kind,
			status: "pending",
			presentation_json: presentationJson,
			requested_by_device_id: normalizeNullableString(input.requester?.deviceId),
			requested_by_client_id: normalizeNullableString(input.requester?.clientId),
			requested_by_device_token_auth: input.requester?.deviceTokenAuth === true ? 1 : 0,
			reviewer_device_ids_json: reviewerDeviceIdsJson,
			source_agent_id: normalizeNullableString(source.agentId),
			source_session_key: normalizeNullableString(source.sessionKey),
			source_session_id: normalizeNullableString(source.sessionId),
			source_run_id: normalizeNullableString(source.runId),
			source_tool_call_id: normalizeNullableString(source.toolCallId),
			source_tool_name: normalizeNullableString(source.toolName),
			audience_session_keys_json: audienceSessionKeysJson,
			runtime_epoch: runtimeEpoch,
			created_at_ms: input.createdAtMs,
			expires_at_ms: input.expiresAtMs,
			updated_at_ms: input.createdAtMs,
			decision: null,
			terminal_reason: null,
			resolved_at_ms: null,
			resolver_kind: null,
			resolver_id: null,
			consumed_at_ms: null,
			consumed_by: null
		}).onConflict((conflict) => conflict.column("approval_id").doNothing()));
		const row = selectOperatorApprovalRow(database, id);
		if (!row) throw new Error(`operator approval '${id}' was not readable after insert`);
		const record = decodeOperatorApprovalRow(row);
		if (!record) {
			denyCorruptPendingRow({
				database,
				id,
				nowMs: input.createdAtMs,
				createdAtMs: row.created_at_ms
			});
			return { outcome: "conflict" };
		}
		if (result.numAffectedRows === 1n) {
			if (executionIdentityBinding) {
				database.db.exec(OPERATOR_APPROVAL_EXECUTION_IDENTITY_SCHEMA_SQL);
				executeSqliteQuerySync(database.db, stateDb.insertInto("operator_approval_execution_identities").values({
					approval_id: id,
					source_context_id: executionIdentityBinding.sourceContextId,
					source_execution_id: executionIdentityBinding.sourceExecutionId
				}));
			}
			return {
				outcome: "inserted",
				record
			};
		}
		if (!inputMatchesExistingRow(input, row, serialized)) return { outcome: "conflict" };
		if (executionIdentityBinding) {
			if (!tableExists(database.db, "operator_approval_execution_identities")) return { outcome: "conflict" };
			const existingBinding = executeSqliteQueryTakeFirstSync(database.db, stateDb.selectFrom("operator_approval_execution_identities").select(["source_context_id", "source_execution_id"]).where("approval_id", "=", id));
			if (existingBinding?.source_context_id !== executionIdentityBinding.sourceContextId || existingBinding.source_execution_id !== executionIdentityBinding.sourceExecutionId) return { outcome: "conflict" };
		}
		return {
			outcome: "existing",
			record
		};
	}, params.databaseOptions);
}
function getOperatorApprovalDetailedInDatabase(params) {
	const locator = requireApprovalId(params.id);
	return runOpenClawStateWriteTransaction((database) => {
		const nowMs = params.nowMs ?? Date.now();
		let row = params.allowTransportRef ? selectOperatorApprovalRowByLocator(database, locator) : selectOperatorApprovalRow(database, locator);
		if (!row) return { outcome: "not-found" };
		const id = row.approval_id;
		if (row.status === "pending" && row.expires_at_ms <= nowMs) {
			row = expirePendingRow({
				database,
				id,
				nowMs,
				createdAtMs: row.created_at_ms
			});
			if (!row) return { outcome: "not-found" };
		}
		const record = decodeOperatorApprovalRow(row);
		if (record) return {
			outcome: "found",
			record
		};
		denyCorruptPendingRow({
			database,
			id,
			nowMs,
			createdAtMs: row.created_at_ms
		});
		return params.allowTransportRef ? {
			outcome: "corrupt",
			id
		} : { outcome: "corrupt" };
	}, params.databaseOptions);
}
function listPendingOperatorApprovalsInDatabase(params = {}) {
	expireDueOperatorApprovalsInDatabase({
		nowMs: params.nowMs,
		databaseOptions: params.databaseOptions
	});
	return runOpenClawStateWriteTransaction((database) => {
		const nowMs = params.nowMs ?? Date.now();
		const stateDb = getNodeSqliteKysely(database.db);
		const resultLimit = Math.max(1, Math.min(params.limit ?? 1e3, OPERATOR_APPROVAL_MAX_LIST_LIMIT));
		const audienceSessionKey = params.audienceSessionKey === void 0 ? void 0 : requireString(params.audienceSessionKey, "operator approval audience session key");
		const requiresPostFilter = audienceSessionKey !== void 0 || params.reviewerDeviceId !== void 0;
		const records = [];
		let cursor;
		while (records.length < resultLimit) {
			let query = stateDb.selectFrom("operator_approvals").selectAll().where("status", "=", "pending").where("expires_at_ms", ">", nowMs).orderBy("created_at_ms", "asc").orderBy("approval_id", "asc").limit(requiresPostFilter ? 256 : resultLimit);
			if (params.kind) query = query.where("kind", "=", params.kind);
			if (params.sourceSessionKey) query = query.where("source_session_key", "=", params.sourceSessionKey);
			if (cursor) {
				const pageCursor = cursor;
				query = query.where((eb) => eb.or([eb("created_at_ms", ">", pageCursor.createdAtMs), eb.and([eb("created_at_ms", "=", pageCursor.createdAtMs), eb("approval_id", ">", pageCursor.id)])]));
			}
			const rows = executeSqliteQuerySync(database.db, query).rows;
			for (const row of rows) {
				const record = decodeOperatorApprovalRow(row);
				if (!record) {
					denyCorruptPendingRow({
						database,
						id: row.approval_id,
						nowMs,
						createdAtMs: row.created_at_ms
					});
					continue;
				}
				const matchesAudience = !audienceSessionKey || record.audienceSessionKeys.includes(audienceSessionKey);
				const matchesReviewer = params.reviewerDeviceId === void 0 || matchesOperatorApprovalReviewerBinding(record, params.reviewerDeviceId);
				if (matchesAudience && matchesReviewer) {
					records.push(record);
					if (records.length === resultLimit) break;
				}
			}
			const last = rows.at(-1);
			if (!requiresPostFilter || rows.length < 256 || !last) break;
			cursor = {
				createdAtMs: last.created_at_ms,
				id: last.approval_id
			};
		}
		return records;
	}, params.databaseOptions);
}
//#endregion
//#region src/gateway/operator-approval-store.worker.ts
function isOperatorApprovalCommand(command) {
	switch (command.type) {
		case "operatorApprovals.insert":
		case "operatorApprovals.get":
		case "operatorApprovals.pending":
		case "operatorApprovals.resolve":
		case "operatorApprovals.deny":
		case "operatorApprovals.expire":
		case "operatorApprovals.consume": return true;
		default: return false;
	}
}
function executeOperatorApprovalCommand(command, databaseOptions) {
	return runOpenClawStateWriteTransaction((database) => {
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: void 0
		});
		const options = {
			...databaseOptions,
			database
		};
		const execute = () => {
			switch (command.type) {
				case "operatorApprovals.insert": return insertOperatorApprovalInDatabase({
					...command.input,
					databaseOptions: options
				});
				case "operatorApprovals.get": return getOperatorApprovalDetailedInDatabase({
					...command.input,
					databaseOptions: options
				});
				case "operatorApprovals.pending": return listPendingOperatorApprovalsInDatabase({
					...command.input,
					databaseOptions: options
				});
				case "operatorApprovals.resolve": return resolveOperatorApprovalInDatabase({
					...command.input,
					databaseOptions: options
				});
				case "operatorApprovals.deny": return forceDenyOperatorApprovalInDatabase({
					...command.input,
					databaseOptions: options
				});
				case "operatorApprovals.expire": return expireDueOperatorApprovalsInDatabase({
					...command.input,
					databaseOptions: options
				});
				case "operatorApprovals.consume": return consumeOperatorApprovalAllowOnceInDatabase({
					...command.input,
					databaseOptions: options
				});
			}
			return command;
		};
		const result = execute();
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: void 0
		});
		return result;
	}, databaseOptions);
}
//#endregion
//#region src/gateway/worker-environments/store-worker-contract.ts
function isWorkerEnvironmentCommand(command) {
	return command.type.startsWith("workerEnvironments.");
}
//#endregion
//#region src/gateway/worker-environments/session-attachment-store.ts
const query$1 = (db) => getNodeSqliteKysely(db);
const WORKER_ENVIRONMENT_SESSION_ATTACHMENTS_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS worker_environment_session_attachments (
  session_id TEXT PRIMARY KEY,
  session_key TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  session_lifecycle_revision TEXT,
  environment_id TEXT NOT NULL UNIQUE,
  generation INTEGER NOT NULL CHECK (generation >= 1),
  created_at_ms INTEGER NOT NULL,
  last_used_at_ms INTEGER NOT NULL,
  closed_at_ms INTEGER,
  FOREIGN KEY (environment_id) REFERENCES worker_environments(environment_id) ON DELETE CASCADE
) STRICT;
CREATE INDEX IF NOT EXISTS worker_environment_session_attachments_session_key
ON worker_environment_session_attachments(agent_id, session_key);
`;
function fromRow(row) {
	return {
		sessionId: row.session_id,
		sessionKey: row.session_key,
		agentId: row.agent_id,
		...row.session_lifecycle_revision ? { sessionLifecycleRevision: row.session_lifecycle_revision } : {},
		environmentId: row.environment_id,
		generation: row.generation,
		createdAtMs: row.created_at_ms,
		lastUsedAtMs: row.last_used_at_ms,
		closedAtMs: row.closed_at_ms
	};
}
function get(db, sessionId) {
	const row = executeSqliteQueryTakeFirstSync(db, query$1(db).selectFrom("worker_environment_session_attachments").selectAll().where("session_id", "=", sessionId));
	return row ? fromRow(row) : void 0;
}
function readWorkerEnvironmentSessionAttachments(db, ids) {
	if (ids?.length === 0) return [];
	const rows = query$1(db).selectFrom("worker_environment_session_attachments").selectAll();
	return executeSqliteQuerySync(db, ids ? rows.where("environment_id", "in", ids) : rows).rows.map(fromRow);
}
function hasWorkerEnvironmentSessionAttachment(db, environmentId) {
	return Boolean(executeSqliteQueryTakeFirstSync(db, query$1(db).selectFrom("worker_environment_session_attachments").select("session_id").where("environment_id", "=", environmentId)));
}
function createWorkerEnvironmentSessionAttachmentStore(options) {
	const { read, write, now } = options;
	const assertIdentity = (record, expected) => {
		if (record.sessionId !== expected.sessionId || record.sessionKey !== expected.sessionKey || record.agentId !== expected.agentId) throw new Error("Conversation environment identity changed");
	};
	return {
		getSessionAttachmentRecord: (sessionId) => get(read(), sessionId),
		createSessionAttachmentIntent(input, assertCurrent) {
			return write((db) => {
				assertCurrent();
				const previous = get(db, input.sessionId);
				if (previous) {
					assertIdentity(previous, input);
					const environment = options.getEnvironment(db, previous.environmentId);
					if (environment && !["destroyed", "failed"].includes(environment.state)) throw new Error("Conversation already owns a worker environment; stop it before replacing it");
					if (previous.environmentId === input.environmentId) throw new Error("This environment request was already stopped; use a new idempotency key");
				}
				const environment = options.createIntent(db, input);
				if (environment.state !== "requested") throw new Error("Environment request already belongs to an earlier allocation");
				const at = now();
				executeSqliteQuerySync(db, query$1(db).insertInto("worker_environment_session_attachments").values({
					session_id: input.sessionId,
					session_key: input.sessionKey,
					agent_id: input.agentId,
					session_lifecycle_revision: input.sessionLifecycleRevision ?? null,
					environment_id: input.environmentId,
					generation: (previous?.generation ?? 0) + 1,
					created_at_ms: at,
					last_used_at_ms: at,
					closed_at_ms: null
				}).onConflict((oc) => oc.column("session_id").doUpdateSet({
					environment_id: input.environmentId,
					generation: (previous?.generation ?? 0) + 1,
					session_lifecycle_revision: input.sessionLifecycleRevision ?? null,
					created_at_ms: at,
					last_used_at_ms: at,
					closed_at_ms: null
				})));
				return {
					attachment: get(db, input.sessionId),
					environment
				};
			});
		},
		closeSessionAttachment(sessionId, assertCurrent = () => {}) {
			return write((db) => {
				assertCurrent();
				const current = get(db, sessionId);
				if (!current || current.closedAtMs !== null) return current;
				executeSqliteQuerySync(db, query$1(db).updateTable("worker_environment_session_attachments").set({ closed_at_ms: now() }).where("session_id", "=", sessionId));
				return get(db, sessionId);
			});
		},
		cancelSessionAttachmentReservation(record) {
			write((db) => {
				const current = get(db, record.sessionId);
				const environment = options.getEnvironment(db, record.environmentId);
				if (!current || current.environmentId !== record.environmentId || current.generation !== record.generation || !environment || environment.state !== "requested" || environment.leaseId !== null) throw new Error("Conversation environment reservation changed before cancellation");
				const at = now();
				executeSqliteQuerySync(db, query$1(db).updateTable("worker_environment_session_attachments").set({ closed_at_ms: current.closedAtMs ?? at }).where("session_id", "=", current.sessionId));
				executeSqliteQuerySync(db, query$1(db).updateTable("worker_environments").set({
					destroy_requested_at_ms: environment.destroyRequestedAtMs ?? at,
					teardown_terminal_state: "destroyed",
					updated_at_ms: at
				}).where("environment_id", "=", environment.environmentId).where("state", "=", "requested"));
			});
		},
		touchSessionAttachment(record, assertCurrent) {
			write((db) => {
				assertCurrent();
				const current = get(db, record.sessionId);
				if (!current || current.environmentId !== record.environmentId || current.generation !== record.generation || current.closedAtMs !== null) throw new Error("Conversation environment attachment is no longer current");
				executeSqliteQuerySync(db, query$1(db).updateTable("worker_environment_session_attachments").set({ last_used_at_ms: now() }).where("session_id", "=", record.sessionId));
			});
		}
	};
}
//#endregion
//#region src/gateway/worker-environments/terminal-environment-retention.ts
function normalizeLimit(value) {
	if (!Number.isSafeInteger(value) || value < 1 || value > 1e3) throw new Error("Worker environment prune limit must be between 1 and 1000");
	return value;
}
function pruneObservedTerminalWorkerEnvironments(params) {
	if (params.observed.length === 0) return 0;
	normalizeLimit(params.observed.length);
	return params.write((db) => {
		const currentQuery = getNodeSqliteKysely(db);
		let deleted = 0;
		for (const observed of params.observed) {
			const current = executeSqliteQueryTakeFirstSync(db, currentQuery.selectFrom("worker_environments").selectAll().where("environment_id", "=", observed.environment_id).where((eb) => eb.not(eb.exists(eb.selectFrom("worker_session_placements").select("session_id").whereRef("environment_id", "=", "worker_environments.environment_id")))));
			if (current && isDeepStrictEqual({ ...current }, { ...observed })) {
				const result = executeSqliteQuerySync(db, currentQuery.deleteFrom("worker_environments").where("environment_id", "=", observed.environment_id));
				deleted += Number(result.numAffectedRows ?? 0n);
			}
		}
		return deleted;
	});
}
//#endregion
//#region src/gateway/worker-environments/store-row-codec.ts
function teardownTerminalStateFrom(value) {
	if (value === null || value === "destroyed" || value === "failed") return value;
	throw new Error("Worker environment teardown terminal state is invalid");
}
function endpointFrom(row, fallbackPorts) {
	const { ssh_host: host, ssh_port: port, ssh_user: user, ssh_host_key: hostKey, ssh_key_ref_json: encoded } = row;
	if (host === null || port === null || user === null || hostKey === null || encoded === null) return null;
	return normalizeWorkerSshEndpoint({
		host,
		port,
		...fallbackPorts.length > 0 ? { fallbackPorts } : {},
		user,
		hostKey,
		keyRef: JSON.parse(encoded)
	});
}
function desktopFrom(row) {
	if (row.desktop_json === null) return null;
	return normalizeWorkerDesktopEndpoint(JSON.parse(row.desktop_json));
}
function bootstrapReceiptFrom(row) {
	const { bootstrap_bundle_hash: bundleHash, bootstrap_openclaw_version: openclawVersion, bootstrap_protocol_features_json: encodedFeatures, bootstrap_install_kind: installKind } = row;
	if (bundleHash === null && openclawVersion === null && encodedFeatures === null) return null;
	if (bundleHash === null || openclawVersion === null || encodedFeatures === null) throw new Error("Worker environment bootstrap receipt is incomplete");
	return normalizeBootstrapReceipt({
		bundleHash,
		openclawVersion,
		protocolFeatures: JSON.parse(encodedFeatures),
		...installKind === null ? {} : { installKind }
	});
}
function decodeWorkerEnvironmentRow(row, fallbackPorts) {
	const record = {
		environmentId: row.environment_id,
		providerId: row.provider_id,
		profileId: row.profile_id,
		profileSnapshot: JSON.parse(row.profile_snapshot_json),
		preparation: readWorkerEnvironmentPreparation(row),
		provisionOperationId: row.provision_operation_id,
		nodeSetupId: row.node_setup_id,
		nodeDeviceId: row.node_device_id,
		sharedHost: row.shared_host === null ? null : row.shared_host === 1,
		leaseId: row.lease_id,
		sshEndpoint: endpointFrom(row, fallbackPorts),
		desktop: desktopFrom(row),
		bootstrapReceipt: bootstrapReceiptFrom(row),
		ownerEpoch: row.owner_epoch,
		teardownTerminalState: teardownTerminalStateFrom(row.teardown_terminal_state),
		state: parseWorkerEnvironmentState(row.state),
		attachedSessionIds: normalizeAttachedSessionIds(JSON.parse(row.attached_session_ids_json)),
		createdAtMs: row.created_at_ms,
		updatedAtMs: row.updated_at_ms,
		stateChangedAtMs: row.state_changed_at_ms,
		lastActivatedAtMs: row.last_activated_at_ms,
		idleSinceAtMs: row.idle_since_at_ms,
		destroyRequestedAtMs: row.destroy_requested_at_ms,
		lastError: row.last_error
	};
	assertShape(record.state, record.leaseId, record.nodeDeviceId, record.sshEndpoint, record.desktop, record.bootstrapReceipt, record.attachedSessionIds);
	return record;
}
function credentialFromRow(row) {
	return {
		environmentId: row.environment_id,
		credentialHash: normalizeCredentialHash(row.credential_hash),
		bundleHash: row.bundle_hash,
		sessionId: row.session_id,
		rpcSetVersion: row.rpc_set_version,
		ownerEpoch: row.owner_epoch,
		expiresAtMs: row.expires_at_ms,
		deliveredAtMs: row.delivered_at_ms
	};
}
function json(value) {
	const encoded = JSON.stringify(value);
	if (encoded === void 0) throw new Error("Worker environment value must be JSON serializable");
	return encoded;
}
const queryWorkerEnvironmentStore = (db) => getNodeSqliteKysely(db);
function environmentRows(db) {
	return queryWorkerEnvironmentStore(db).selectFrom("worker_environments").selectAll("worker_environments").select((eb) => eb.selectFrom("worker_environment_ssh_fallback_ports").select(({ fn }) => fn.agg("json_group_array", ["port"]).orderBy("position").as("ports")).whereRef("worker_environment_ssh_fallback_ports.environment_id", "=", "worker_environments.environment_id").$asScalar().as("ssh_fallback_ports_json"));
}
function recordsFromRows(rows) {
	return rows.map((row) => decodeWorkerEnvironmentRow(row, JSON.parse(row.ssh_fallback_ports_json)));
}
function findWorkerEnvironment(db, environmentId) {
	const rows = executeSqliteQuerySync(db, environmentRows(db).where("worker_environments.environment_id", "=", environmentId)).rows;
	return recordsFromRows(rows)[0];
}
function findCredential(db, environmentId) {
	const row = executeSqliteQueryTakeFirstSync(db, queryWorkerEnvironmentStore(db).selectFrom("worker_environment_credentials").selectAll().where("environment_id", "=", environmentId));
	return row ? credentialFromRow(row) : void 0;
}
function getRequiredWorkerEnvironment(db, environmentId) {
	const record = findWorkerEnvironment(db, environmentId);
	if (!record) throw new Error(`Unknown worker environment: ${environmentId}`);
	return record;
}
function listRows(db) {
	const rows = executeSqliteQuerySync(db, environmentRows(db).orderBy("worker_environments.created_at_ms").orderBy("worker_environments.environment_id")).rows;
	return recordsFromRows(rows);
}
/** Prepared inside the owning transaction; absent rows are explicit deletion facts. */
function readWorkerEnvironmentFacts(db, ids) {
	const environments = ids ? ids.flatMap((id) => {
		const row = findWorkerEnvironment(db, id);
		return row ? [row] : [];
	}) : listRows(db);
	const credentialQuery = queryWorkerEnvironmentStore(db).selectFrom("worker_environment_credentials").selectAll();
	const credentials = ids?.length === 0 ? [] : executeSqliteQuerySync(db, ids ? credentialQuery.where("environment_id", "in", ids) : credentialQuery).rows.map(credentialFromRow);
	const attachments = readWorkerEnvironmentSessionAttachments(db, ids);
	return {
		ids: ids ? [...ids] : environments.map((row) => row.environmentId),
		environments,
		credentials,
		attachments
	};
}
//#endregion
//#region src/gateway/worker-environments/store-mutations.ts
function nextOwnerEpoch(ownerEpoch) {
	const next = ownerEpoch + 1;
	if (!Number.isSafeInteger(next)) throw new Error("Worker environment owner epoch is exhausted");
	return next;
}
function nextGlobalOwnerEpoch(db) {
	const latestEnvironment = executeSqliteQueryTakeFirstSync(db, queryWorkerEnvironmentStore(db).selectFrom("worker_environments").select(({ fn }) => fn.max("owner_epoch").as("owner_epoch")));
	const latestTranscriptCommit = executeSqliteQueryTakeFirstSync(db, queryWorkerEnvironmentStore(db).selectFrom("worker_transcript_commit_heads").select(({ fn }) => fn.max("run_epoch").as("run_epoch")));
	return nextOwnerEpoch(Math.max(latestEnvironment?.owner_epoch ?? 0, latestTranscriptCommit?.run_epoch ?? 0));
}
function updateRow(db, id, state, values) {
	if (executeSqliteQuerySync(db, queryWorkerEnvironmentStore(db).updateTable("worker_environments").set(values).where("environment_id", "=", id).where("state", "=", state)).numAffectedRows !== 1n) throw new Error(`Worker environment ${id} changed during update`);
}
function updateWorkerEnvironmentRecord(db, id, state, values) {
	updateRow(db, id, state, values);
	return getRequiredWorkerEnvironment(db, id);
}
function replaceSshFallbackPorts(db, environmentId, ports) {
	executeSqliteQuerySync(db, queryWorkerEnvironmentStore(db).deleteFrom("worker_environment_ssh_fallback_ports").where("environment_id", "=", environmentId));
	if (ports.length === 0) return;
	const rows = ports.map((port, position) => ({
		environment_id: environmentId,
		position,
		port
	}));
	executeSqliteQuerySync(db, queryWorkerEnvironmentStore(db).insertInto("worker_environment_ssh_fallback_ports").values(rows));
}
function revokeCredential(db, environmentId) {
	executeSqliteQuerySync(db, queryWorkerEnvironmentStore(db).deleteFrom("worker_environment_credentials").where("environment_id", "=", environmentId));
}
function upsertCredential(db, credential) {
	executeSqliteQuerySync(db, queryWorkerEnvironmentStore(db).insertInto("worker_environment_credentials").values(credential).onConflict((conflict) => conflict.column("environment_id").doUpdateSet({
		credential_hash: credential.credential_hash,
		bundle_hash: credential.bundle_hash,
		session_id: credential.session_id,
		rpc_set_version: credential.rpc_set_version,
		owner_epoch: credential.owner_epoch,
		expires_at_ms: credential.expires_at_ms,
		delivered_at_ms: credential.delivered_at_ms
	})));
}
function credentialInsert(params) {
	const sessionId = normalizeSessionId(params.input.sessionId);
	assertCredentialSessionBinding(params.attachedSessionIds, sessionId);
	const expiresAtMs = normalizeExpiry(params.input.expiresAtMs);
	if (expiresAtMs <= params.nowMs) throw new Error("Worker credential expiry must be in the future");
	return {
		environment_id: params.environmentId,
		credential_hash: normalizeCredentialHash(params.input.credentialHash),
		bundle_hash: params.bundleHash,
		session_id: sessionId,
		rpc_set_version: normalizeRpcSetVersion(params.input.rpcSetVersion),
		owner_epoch: params.ownerEpoch,
		expires_at_ms: expiresAtMs,
		delivered_at_ms: null
	};
}
function compareAttachmentAuthority(left, right) {
	if (left.ownerEpoch !== right.ownerEpoch) return left.ownerEpoch > right.ownerEpoch ? -1 : 1;
	if (left.stateChangedAtMs !== right.stateChangedAtMs) return left.stateChangedAtMs > right.stateChangedAtMs ? -1 : 1;
	if (left.environmentId === right.environmentId) return 0;
	return left.environmentId < right.environmentId ? -1 : 1;
}
function reconcileAttachedSessionOwners(db, nowMs) {
	const ownersBySession = /* @__PURE__ */ new Map();
	const changed = [];
	for (const record of listRows(db)) {
		if (record.state !== "attached" || record.destroyRequestedAtMs !== null) continue;
		const sessionId = record.attachedSessionIds[0];
		if (!sessionId) continue;
		const owners = ownersBySession.get(sessionId) ?? [];
		owners.push(record);
		ownersBySession.set(sessionId, owners);
	}
	for (const owners of ownersBySession.values()) {
		if (owners.length < 2) continue;
		const [, ...duplicates] = owners.toSorted(compareAttachmentAuthority);
		for (const duplicate of duplicates) {
			updateWorkerEnvironmentRecord(db, duplicate.environmentId, "attached", {
				owner_epoch: nextGlobalOwnerEpoch(db),
				state: "idle",
				attached_session_ids_json: json([]),
				updated_at_ms: nowMs,
				state_changed_at_ms: nowMs,
				idle_since_at_ms: nowMs
			});
			revokeCredential(db, duplicate.environmentId);
			changed.push(duplicate.environmentId);
		}
	}
	return changed;
}
//#endregion
//#region src/gateway/worker-environments/store-write.ts
function readTotalChanges(db) {
	const row = executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectNoFrom((eb) => eb.fn("total_changes", []).as("value")));
	if (typeof row?.value !== "number") throw new Error("SQLite did not return a numeric total_changes() value");
	return row.value;
}
//#endregion
//#region src/gateway/worker-environments/store-schema.ts
const ensuredDatabases = /* @__PURE__ */ new WeakSet();
const WORKER_ENVIRONMENT_SSH_FALLBACK_PORTS_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS worker_environment_ssh_fallback_ports (
  environment_id TEXT NOT NULL,
  position INTEGER NOT NULL CHECK (position >= 0 AND position <= 9),
  port INTEGER NOT NULL CHECK (port >= 1 AND port <= 65535),
  PRIMARY KEY (environment_id, position),
  UNIQUE (environment_id, port),
  FOREIGN KEY (environment_id) REFERENCES worker_environments(environment_id) ON DELETE CASCADE
) STRICT;
`;
/** The worker store prepares its additive companion tables together on first use. */
function ensureWorkerEnvironmentStoreSchema(database) {
	if (ensuredDatabases.has(database.db)) return;
	runOpenClawStateWriteTransaction(({ db }) => {
		db.exec(`${WORKER_ENVIRONMENT_SSH_FALLBACK_PORTS_SCHEMA_SQL}\n${WORKER_ENVIRONMENT_SESSION_ATTACHMENTS_SCHEMA_SQL}`);
	}, { database }, { operationLabel: "worker-environments.companion.schema.ensure" });
	const remember = () => {
		ensuredDatabases.add(database.db);
	};
	if (!stageSqliteTransactionState(database.db, {
		stage: remember,
		rollback: () => {
			ensuredDatabases.delete(database.db);
		},
		commit: remember
	})) remember();
}
//#endregion
//#region src/gateway/worker-environments/store-transitions.ts
function createWorkerEnvironmentTransitionOps({ now, write }) {
	return {
		refreshBootstrapReceipt(input) {
			const environmentId = requireWorkerEnvironmentString(input.environmentId, "id");
			const expectedReceipt = normalizeBootstrapReceipt(input.expectedBootstrapReceipt);
			const receipt = normalizeBootstrapReceipt(input.bootstrapReceipt);
			return write((db) => {
				input.assertCurrent();
				const current = getRequiredWorkerEnvironment(db, environmentId);
				if (current.state !== input.expectedState || current.ownerEpoch !== input.expectedOwnerEpoch || current.nodeDeviceId !== input.expectedNodeDeviceId || current.destroyRequestedAtMs !== null || !current.leaseId || !current.nodeDeviceId && !current.sshEndpoint || !isDeepStrictEqual(current.bootstrapReceipt, expectedReceipt)) throw new Error("Worker environment changed during runtime refresh");
				if (findCredential(db, environmentId)) throw new Error("Worker runtime refresh requires its previous credential to be revoked");
				const updatedAtMs = now();
				if (input.expectedState === "attached") {
					const attachedSessionId = current.attachedSessionIds[0];
					const placements = executeSqliteQuerySync(db, queryWorkerEnvironmentStore(db).selectFrom("worker_session_placements").selectAll().where("environment_id", "=", environmentId).where("state", "=", "active")).rows;
					const placement = placements.length === 1 ? placements[0] : void 0;
					if (current.attachedSessionIds.length !== 1 || !placement || placement.session_id !== attachedSessionId || placement.active_owner_epoch !== current.ownerEpoch || placement.transition_generation !== input.expectedPlacementGeneration || placement.worker_bundle_hash !== expectedReceipt.bundleHash) throw new Error("Worker placement changed during runtime refresh");
					if (executeSqliteQueryTakeFirstSync(db, queryWorkerEnvironmentStore(db).selectFrom("worker_session_placement_moves").select("session_id").where("session_id", "=", placement.session_id))) throw new Error("Cannot refresh a worker runtime while its session is moving");
					executeSqliteQuerySync(db, queryWorkerEnvironmentStore(db).updateTable("worker_session_placements").set({
						worker_bundle_hash: receipt.bundleHash,
						updated_at_ms: updatedAtMs
					}).where("session_id", "=", placement.session_id));
				}
				updateRow(db, environmentId, current.state, {
					bootstrap_bundle_hash: receipt.bundleHash,
					bootstrap_openclaw_version: receipt.openclawVersion,
					bootstrap_protocol_features_json: json(receipt.protocolFeatures),
					bootstrap_install_kind: receipt.installKind ?? null,
					updated_at_ms: updatedAtMs,
					last_error: null
				});
				return getRequiredWorkerEnvironment(db, environmentId);
			});
		},
		transition(input) {
			const { from, to, patch = {} } = input;
			if (!canTransitionWorkerEnvironment(from, to)) throw new Error(`Illegal worker environment transition: ${from} -> ${to}`);
			const environmentId = requireWorkerEnvironmentString(input.environmentId, "id");
			const updatedAtMs = now();
			return write((db) => {
				const current = getRequiredWorkerEnvironment(db, environmentId);
				if (current.state !== from) throw new Error(`Worker environment ${environmentId} state conflict: expected ${from}, found ${current.state}`);
				if (input.expectedOwnerEpoch !== void 0 && current.ownerEpoch !== input.expectedOwnerEpoch) throw new Error(`Worker environment ${environmentId} owner epoch changed`);
				if (to === "attached" && current.destroyRequestedAtMs !== null) throw new Error("Cannot attach worker after destroy is requested");
				if (to === "attached") {
					if (hasWorkerEnvironmentSessionAttachment(db, environmentId)) throw new Error("Conversation-attached environments cannot be adopted for session placement");
					const sessionId = patch.attachedSessionIds?.[0];
					if (current.preparation && !sessionId) throw new Error("Prepared worker attachment requires its exact session");
					if (sessionId) assertPreparedEnvironmentAttachment(db, current, sessionId, input.placementBinding);
				}
				const clearsLeaseAfterTeardownFailure = to === "failed" && from === "destroying";
				if (clearsLeaseAfterTeardownFailure && (current.destroyRequestedAtMs === null || current.teardownTerminalState !== "failed")) throw new Error("Failed bootstrap transition requires durable provider teardown intent");
				if (clearsLeaseAfterTeardownFailure && (patch.leaseId !== null || patch.sshEndpoint !== null)) throw new Error("Failed bootstrap transition requires explicit lease clearing after provider teardown");
				const leaseId = patch.leaseId === void 0 ? current.leaseId : patch.leaseId === null ? null : requireWorkerEnvironmentString(patch.leaseId, "lease id");
				if (current.leaseId && leaseId !== current.leaseId && !clearsLeaseAfterTeardownFailure) throw new Error("Worker environment provider lease id is immutable once persisted");
				const nodeDeviceId = patch.nodeDeviceId === void 0 ? current.nodeDeviceId ?? null : patch.nodeDeviceId === null ? null : requireWorkerEnvironmentString(patch.nodeDeviceId, "node device id");
				if (current.nodeDeviceId && nodeDeviceId !== current.nodeDeviceId && !clearsLeaseAfterTeardownFailure) throw new Error("Worker environment node device id is immutable once persisted");
				const sshEndpoint = patch.sshEndpoint === void 0 ? current.sshEndpoint : patch.sshEndpoint === null ? null : normalizeWorkerSshEndpoint(patch.sshEndpoint);
				const sharedHost = leaseId === null ? null : patch.sharedHost ?? current.sharedHost;
				const desktop = leaseId === null ? null : patch.desktop === void 0 ? current.desktop : patch.desktop === null ? null : normalizeWorkerDesktopEndpoint(patch.desktop);
				const acceptsBootstrapReceipt = to === "ready" && (from === "bootstrapping" || from === "provisioning" && sshEndpoint === null);
				if (to === "ready" && !acceptsBootstrapReceipt) throw new Error("Ready worker transition requires bootstrap proof or a node lease");
				if (patch.bootstrapReceipt !== void 0 && !acceptsBootstrapReceipt) throw new Error("Bootstrap receipt can only be recorded when a worker becomes ready");
				if (acceptsBootstrapReceipt && patch.bootstrapReceipt === void 0) throw new Error("Ready worker transition requires a bootstrap receipt");
				const acceptsAttachedCredential = to === "attached";
				const acceptsCredential = acceptsBootstrapReceipt || acceptsAttachedCredential;
				if (patch.credential !== void 0 && !acceptsCredential) throw new Error("Worker credential cannot be minted during this transition");
				if (acceptsCredential && patch.credential === void 0) throw new Error(`${to === "ready" ? "Ready" : "Attached"} worker transition requires a worker credential`);
				const clearsBootstrapReceipt = to === "bootstrapping" && (from === "ready" || from === "idle");
				const bootstrapReceipt = clearsBootstrapReceipt ? null : patch.bootstrapReceipt === void 0 ? current.bootstrapReceipt : normalizeBootstrapReceipt(patch.bootstrapReceipt);
				if (acceptsCredential && !bootstrapReceipt) throw new Error(`${to === "ready" ? "Ready" : "Attached"} worker requires bootstrap proof`);
				const attachedSessionIds = to !== "attached" ? [] : patch.attachedSessionIds === void 0 ? current.attachedSessionIds : normalizeAttachedSessionIds(patch.attachedSessionIds);
				assertShape(to, leaseId, nodeDeviceId, sshEndpoint, desktop, bootstrapReceipt, attachedSessionIds);
				const [attachedSessionId] = attachedSessionIds;
				if (to === "attached" && attachedSessionId) {
					const existingOwner = listRows(db).find((record) => record.environmentId !== environmentId && record.state === "attached" && record.destroyRequestedAtMs === null && record.attachedSessionIds[0] === attachedSessionId);
					if (existingOwner) throw new WorkerSessionAlreadyAttachedError(attachedSessionId, existingOwner.environmentId);
				}
				const revokesCredential = clearsBootstrapReceipt || to === "attached" || from === "attached" && to === "idle" || to === "draining" || to === "destroyed" || to === "failed" || to === "orphaned";
				const ownerEpoch = acceptsBootstrapReceipt ? Math.max(1, current.ownerEpoch) : acceptsAttachedCredential || (from === "ready" || from === "idle" || from === "attached") && (to === "bootstrapping" || from === "attached" && to === "idle" || to === "draining" || to === "destroyed" || to === "failed" || to === "orphaned") ? nextGlobalOwnerEpoch(db) : current.ownerEpoch;
				updateRow(db, environmentId, from, {
					lease_id: leaseId,
					node_device_id: nodeDeviceId,
					shared_host: sharedHost === null ? null : sharedHost ? 1 : 0,
					ssh_host: sshEndpoint?.host ?? null,
					ssh_port: sshEndpoint?.port ?? null,
					ssh_user: sshEndpoint?.user ?? null,
					ssh_host_key: sshEndpoint?.hostKey ?? null,
					ssh_key_ref_json: sshEndpoint ? json(sshEndpoint.keyRef) : null,
					desktop_json: desktop ? json(desktop) : null,
					bootstrap_bundle_hash: bootstrapReceipt?.bundleHash ?? null,
					bootstrap_openclaw_version: bootstrapReceipt?.openclawVersion ?? null,
					bootstrap_protocol_features_json: bootstrapReceipt ? json(bootstrapReceipt.protocolFeatures) : null,
					bootstrap_install_kind: bootstrapReceipt?.installKind ?? null,
					owner_epoch: ownerEpoch,
					state: to,
					attached_session_ids_json: json(attachedSessionIds),
					updated_at_ms: updatedAtMs,
					state_changed_at_ms: updatedAtMs,
					idle_since_at_ms: to === "idle" ? updatedAtMs : null,
					last_error: "lastError" in patch ? patch.lastError?.trim() || null : null
				});
				if (patch.sshEndpoint !== void 0) replaceSshFallbackPorts(db, environmentId, sshEndpoint?.fallbackPorts ?? []);
				if (revokesCredential) revokeCredential(db, environmentId);
				if (patch.credential && bootstrapReceipt) upsertCredential(db, credentialInsert({
					input: patch.credential,
					environmentId,
					bundleHash: bootstrapReceipt.bundleHash,
					attachedSessionIds,
					ownerEpoch,
					nowMs: updatedAtMs
				}));
				return getRequiredWorkerEnvironment(db, environmentId);
			});
		}
	};
}
//#endregion
//#region src/gateway/worker-environments/store.kernel.ts
function createWorkerEnvironmentStoreKernel(options) {
	const database = options.database;
	ensureWorkerEnvironmentStoreSchema(database);
	const now = options.now ?? Date.now;
	const read = () => database.db;
	const write = options.write;
	const writeCredential = (input) => {
		const environmentId = requireWorkerEnvironmentString(input.environmentId, "id");
		return write((db) => {
			const current = getRequiredWorkerEnvironment(db, environmentId);
			if (current.ownerEpoch !== input.expectedOwnerEpoch) throw new Error(`Worker environment ${environmentId} owner epoch changed`);
			if (current.state !== "ready" && current.state !== "idle" && current.state !== "attached") throw new Error(`Cannot mint worker credential in state ${current.state}`);
			if (current.destroyRequestedAtMs !== null) throw new Error("Cannot mint worker credential after destroy is requested");
			if (!current.bootstrapReceipt) throw new Error("Worker environment has no admitted bootstrap identity");
			const updatedAtMs = now();
			const ownerEpoch = Math.max(1, current.ownerEpoch);
			if (ownerEpoch !== current.ownerEpoch) updateWorkerEnvironmentRecord(db, environmentId, current.state, {
				owner_epoch: ownerEpoch,
				updated_at_ms: updatedAtMs
			});
			upsertCredential(db, credentialInsert({
				input,
				environmentId,
				bundleHash: current.bootstrapReceipt.bundleHash,
				attachedSessionIds: current.attachedSessionIds,
				ownerEpoch,
				nowMs: updatedAtMs
			}));
			const credential = findCredential(db, environmentId);
			if (!credential) throw new Error("Worker credential persistence failed");
			return credential;
		});
	};
	const createIntent = (db, input) => {
		const environmentId = requireWorkerEnvironmentString(input.environmentId, "id");
		const createdAtMs = now();
		executeSqliteQuerySync(db, queryWorkerEnvironmentStore(db).insertInto("worker_environments").values({
			environment_id: environmentId,
			provider_id: requireWorkerEnvironmentString(input.providerId, "provider id"),
			profile_id: requireWorkerEnvironmentString(input.profileId, "profile id"),
			profile_snapshot_json: json(input.profileSnapshot),
			...workerEnvironmentPreparationColumns(input.preparation),
			last_activated_at_ms: null,
			provision_operation_id: requireWorkerEnvironmentString(input.provisionOperationId, "provision operation id"),
			lease_id: null,
			node_setup_id: null,
			node_device_id: null,
			shared_host: null,
			ssh_host: null,
			ssh_port: null,
			ssh_user: null,
			ssh_host_key: null,
			ssh_key_ref_json: null,
			desktop_json: null,
			bootstrap_bundle_hash: null,
			bootstrap_openclaw_version: null,
			bootstrap_protocol_features_json: null,
			bootstrap_install_kind: null,
			owner_epoch: 0,
			teardown_terminal_state: null,
			state: "requested",
			created_at_ms: createdAtMs,
			updated_at_ms: createdAtMs,
			state_changed_at_ms: createdAtMs,
			idle_since_at_ms: null,
			destroy_requested_at_ms: null,
			last_error: null
		}));
		return getRequiredWorkerEnvironment(db, environmentId);
	};
	return {
		...createPreparedEnvironmentStoreOps({
			now,
			write,
			createIntent,
			get: findWorkerEnvironment
		}),
		...createWorkerEnvironmentSessionAttachmentStore({
			now,
			read,
			write,
			createIntent,
			getEnvironment: findWorkerEnvironment
		}),
		...createWorkerEnvironmentTransitionOps({
			now,
			write
		}),
		createIntent(input) {
			return write((db) => createIntent(db, input));
		},
		ensureNodeEnrollment(environmentIdInput) {
			const environmentId = requireWorkerEnvironmentString(environmentIdInput, "id");
			return write((db) => {
				ensureWorkerEnvironmentNodeEnrollmentSchema(db);
				const current = getRequiredWorkerEnvironment(db, environmentId);
				if (TERMINAL_STATES.includes(current.state) || current.destroyRequestedAtMs !== null) throw new Error(`Worker environment ${environmentId} cannot begin node enrollment`);
				const setupId = current.nodeSetupId ?? randomUUID();
				const completedDeviceId = executeSqliteQueryTakeFirstSync(db, queryWorkerEnvironmentStore(db).selectFrom("device_pair_setup_completions").select("device_id").where("setup_id", "=", setupId))?.device_id ?? null;
				if (current.nodeDeviceId !== null && completedDeviceId !== null && current.nodeDeviceId !== completedDeviceId) throw new Error(`Worker environment ${environmentId} node enrollment identity changed`);
				const nodeDeviceId = current.nodeDeviceId ?? completedDeviceId;
				if (current.nodeSetupId === setupId && current.nodeDeviceId === nodeDeviceId) return current;
				return updateWorkerEnvironmentRecord(db, environmentId, current.state, {
					node_setup_id: setupId,
					node_device_id: nodeDeviceId,
					updated_at_ms: now()
				});
			});
		},
		revokeEnvironmentCredential(input) {
			const environmentId = requireWorkerEnvironmentString(input.environmentId, "id");
			return write((db) => {
				if (input.expectedOwnerEpoch !== void 0 && getRequiredWorkerEnvironment(db, environmentId).ownerEpoch !== input.expectedOwnerEpoch) throw new Error(`Worker environment ${environmentId} owner epoch changed`);
				revokeCredential(db, environmentId);
			});
		},
		reconcileSharedHost(input) {
			const environmentId = requireWorkerEnvironmentString(input.environmentId, "id");
			const leaseId = requireWorkerEnvironmentString(input.leaseId, "lease id");
			return write((db) => {
				const current = getRequiredWorkerEnvironment(db, environmentId);
				if (current.state !== input.state || current.leaseId !== leaseId) throw new Error(`Worker environment ${environmentId} lease changed during inspection`);
				if (current.sharedHost === input.sharedHost) return current;
				return updateWorkerEnvironmentRecord(db, environmentId, current.state, {
					shared_host: input.sharedHost ? 1 : 0,
					updated_at_ms: now()
				});
			});
		},
		adoptProvisionCleanupFailure(input) {
			const environmentId = requireWorkerEnvironmentString(input.environmentId, "id");
			const leaseId = requireWorkerEnvironmentString(input.leaseId, "lease id");
			const lastError = requireWorkerEnvironmentString(input.lastError, "last error");
			return write((db) => {
				const current = getRequiredWorkerEnvironment(db, environmentId);
				if (current.state !== "provisioning" || current.leaseId !== null) throw new Error(`Worker environment ${environmentId} cannot adopt provision cleanup`);
				const updatedAtMs = now();
				return updateWorkerEnvironmentRecord(db, environmentId, current.state, {
					lease_id: leaseId,
					state: "destroying",
					updated_at_ms: updatedAtMs,
					state_changed_at_ms: updatedAtMs,
					destroy_requested_at_ms: current.destroyRequestedAtMs ?? updatedAtMs,
					teardown_terminal_state: current.teardownTerminalState ?? "failed",
					last_error: lastError
				});
			});
		},
		requestDestroy(input) {
			const environmentId = requireWorkerEnvironmentString(input.environmentId, "id");
			return write((db) => {
				const current = getRequiredWorkerEnvironment(db, environmentId);
				if (current.state !== input.state) throw new Error(`Worker environment ${environmentId} changed before destroy request`);
				if (current.destroyRequestedAtMs !== null) return current;
				const requestedAtMs = now();
				const terminalState = input.terminalState ?? "destroyed";
				return updateWorkerEnvironmentRecord(db, environmentId, input.state, {
					updated_at_ms: requestedAtMs,
					destroy_requested_at_ms: requestedAtMs,
					teardown_terminal_state: terminalState,
					...input.lastError === void 0 ? {} : { last_error: requireWorkerEnvironmentString(input.lastError, "last error") }
				});
			});
		},
		renewCredential(input) {
			return writeCredential(input);
		},
		markCredentialDelivered(input) {
			const environmentId = requireWorkerEnvironmentString(input.environmentId, "id");
			return write((db) => {
				const environment = getRequiredWorkerEnvironment(db, environmentId);
				const credential = findCredential(db, environmentId);
				if (!credential || environment.state !== "ready" && environment.state !== "idle" && environment.state !== "attached" || environment.destroyRequestedAtMs !== null || credential.credentialHash !== normalizeCredentialHash(input.credentialHash) || credential.ownerEpoch !== input.ownerEpoch || environment.ownerEpoch !== input.ownerEpoch || credential.sessionId !== normalizeSessionId(input.sessionId)) throw new Error(`Worker environment ${environmentId} credential changed`);
				const deliveredAtMs = normalizeExpiry(input.deliveredAtMs);
				if (deliveredAtMs >= credential.expiresAtMs) throw new Error("Expired worker credential cannot be marked delivered");
				if (executeSqliteQuerySync(db, queryWorkerEnvironmentStore(db).updateTable("worker_environment_credentials").set({ delivered_at_ms: deliveredAtMs }).where("environment_id", "=", environmentId).where("credential_hash", "=", credential.credentialHash).where("owner_epoch", "=", credential.ownerEpoch)).numAffectedRows !== 1n) throw new Error(`Worker environment ${environmentId} credential changed`);
			});
		},
		recordError(input) {
			return write((db) => updateWorkerEnvironmentRecord(db, requireWorkerEnvironmentString(input.environmentId, "id"), input.state, {
				updated_at_ms: now(),
				last_error: requireWorkerEnvironmentString(input.error, "last error")
			}));
		}
	};
}
//#endregion
//#region src/gateway/worker-environments/store.worker.ts
const admitted = () => {};
function executeWorkerEnvironmentCommand(command, database) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: void 0
		});
		const now = () => command.input.nowMs ?? Date.now();
		const store = createWorkerEnvironmentStoreKernel({
			database,
			now,
			write: (operation) => operation(db)
		});
		const changesBefore = readTotalChanges(db);
		const touched = /* @__PURE__ */ new Set();
		const touch = (id) => touched.add(id.trim());
		const receipt = {
			result: (() => {
				switch (command.type) {
					case "workerEnvironments.initialize":
						for (const id of reconcileAttachedSessionOwners(db, now())) touch(id);
						return;
					case "workerEnvironments.createIntent":
						touch(command.input.input.environmentId);
						return store.createIntent(command.input.input);
					case "workerEnvironments.ensureNodeEnrollment":
						touch(command.input.input);
						return store.ensureNodeEnrollment(command.input.input);
					case "workerEnvironments.revokeEnvironmentCredential":
						touch(command.input.input.environmentId);
						return store.revokeEnvironmentCredential(command.input.input);
					case "workerEnvironments.reconcileSharedHost":
						touch(command.input.input.environmentId);
						return store.reconcileSharedHost(command.input.input);
					case "workerEnvironments.adoptProvisionCleanupFailure":
						touch(command.input.input.environmentId);
						return store.adoptProvisionCleanupFailure(command.input.input);
					case "workerEnvironments.requestDestroy":
						touch(command.input.input.environmentId);
						return store.requestDestroy(command.input.input);
					case "workerEnvironments.refreshBootstrapReceipt":
						touch(command.input.input.environmentId);
						return store.refreshBootstrapReceipt({
							...command.input.input,
							assertCurrent: admitted
						});
					case "workerEnvironments.transition": {
						const input = command.input.input;
						touch(input.environmentId);
						return store.transition({
							...input,
							placementBinding: input.placementBinding ? {
								...input.placementBinding,
								assertCurrent: admitted
							} : void 0
						});
					}
					case "workerEnvironments.renewCredential":
						touch(command.input.input.environmentId);
						return store.renewCredential(command.input.input);
					case "workerEnvironments.markCredentialDelivered":
						touch(command.input.input.environmentId);
						return store.markCredentialDelivered(command.input.input);
					case "workerEnvironments.recordError":
						touch(command.input.input.environmentId);
						return store.recordError(command.input.input);
					case "workerEnvironments.ensurePreparedIntent": {
						const value = store.ensurePreparedIntent({
							...command.input.input,
							assertCurrent: admitted
						});
						touch(command.input.input.intent.environmentId);
						if (value) touch(value.environmentId);
						return value;
					}
					case "workerEnvironments.requestPreparedDestroy":
						touch(command.input.input.environmentId);
						return store.requestPreparedDestroy({
							...command.input.input,
							assertCurrent: admitted
						});
					case "workerEnvironments.createSessionAttachmentIntent": {
						const previous = store.getSessionAttachmentRecord(command.input.input.sessionId);
						if (previous) touch(previous.environmentId);
						touch(command.input.input.environmentId);
						return store.createSessionAttachmentIntent(command.input.input, admitted);
					}
					case "workerEnvironments.closeSessionAttachment": {
						const value = store.closeSessionAttachment(command.input.input, admitted);
						if (value) touch(value.environmentId);
						return value;
					}
					case "workerEnvironments.cancelSessionAttachmentReservation":
						touch(command.input.input.environmentId);
						return store.cancelSessionAttachmentReservation(command.input.input);
					case "workerEnvironments.touchSessionAttachment":
						touch(command.input.input.environmentId);
						return store.touchSessionAttachment(command.input.input, admitted);
					case "workerEnvironments.pruneTerminalEnvironments": {
						const { approved } = command.input.input;
						for (const row of approved) touch(row.environment_id);
						return pruneObservedTerminalWorkerEnvironments({
							observed: approved,
							write: (operation) => operation(db)
						});
					}
				}
			})(),
			changed: readTotalChanges(db) !== changesBefore,
			facts: readWorkerEnvironmentFacts(db, [...touched])
		};
		deferSqliteWorkerCommitReceipt(db, receipt);
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: createWorkerEnvironmentCommitAdmission(receipt.facts)
		});
		return receipt;
	}, { database }, { operationLabel: command.type });
}
//#endregion
//#region src/infra/outbound/delivery-queue-ack.worker.ts
function executeDeliveryQueueAck(input, writeOptions) {
	const { id, stateDir, options } = input;
	return options && "expectedPlatformSendAttemptId" in options ? runOpenClawStateWriteTransaction((writer) => ackDeliveryInDatabase(writer, id, stateDir, options), writeOptions, { operationLabel: `mutate owned ${OUTBOUND_DELIVERY_QUEUE_NAME} delivery platform send` }) : ackDeliveryInDatabase(writeOptions.database, id, stateDir, options);
}
//#endregion
//#region src/infra/outbound/delivery-queue-enqueue.worker.ts
function executeDeliveryQueueEnqueue(input, writeOptions) {
	const entry = JSON.parse(input.entryJson);
	const conflictQueueNames = [
		OUTBOUND_DELIVERY_MIGRATION_QUEUE_NAME,
		OUTBOUND_LEGACY_PREPARATION_QUEUE_NAME,
		LEGACY_OUTBOUND_DELIVERY_QUEUE_NAME
	];
	const transaction = { outcome: "unobserved" };
	try {
		return runOpenClawStateWriteTransaction((database) => {
			stageSqliteTransactionState(database.db, {
				stage: () => {
					transaction.outcome = "pending";
				},
				commit: () => {
					transaction.outcome = "committed";
				},
				rollback: () => {
					transaction.outcome = "rolled-back";
				}
			});
			if (input.kind === "random" && !input.mediaStageId) {
				upsertDeliveryQueueEntryInDatabase({
					queueName: OUTBOUND_DELIVERY_QUEUE_NAME,
					entry
				}, database);
				return "created";
			}
			if (input.kind === "prepared") return movePendingDeliveryQueueEntryNamespaceInDatabase(database, {
				sourceQueueName: OUTBOUND_DELIVERY_PREPARATION_QUEUE_NAME,
				destinationQueueName: OUTBOUND_DELIVERY_QUEUE_NAME,
				conflictQueueNames,
				expectedSourceEntry: JSON.parse(input.preparationJson),
				destinationEntry: entry,
				...input.mediaStageId ? {
					stagingQueueName: DELIVERY_QUEUE_MEDIA_STAGING_QUEUE_NAME,
					stagingId: input.mediaStageId
				} : {}
			});
			const params = {
				queueName: OUTBOUND_DELIVERY_QUEUE_NAME,
				conflictQueueNames: input.kind === "stable" ? [...conflictQueueNames, OUTBOUND_DELIVERY_PREPARATION_QUEUE_NAME] : [],
				entry
			};
			if (input.mediaStageId) return commitStagedDeliveryQueueEntryOnceAcrossNamespacesInDatabase(database, {
				...params,
				stagingId: input.mediaStageId,
				stagingQueueName: DELIVERY_QUEUE_MEDIA_STAGING_QUEUE_NAME
			});
			return upsertDeliveryQueueEntryOnceAcrossNamespacesInDatabase(database, params) ? "created" : "existing";
		}, writeOptions, { operationLabel: "enqueue outbound delivery" });
	} catch (cause) {
		if (transaction.outcome === "rolled-back") {
			const error = encodeOpenClawStateWorkerError(cause, { includeOrdinary: true });
			if (error) return {
				status: "not-published",
				error
			};
		}
		throw cause;
	}
}
//#endregion
//#region src/infra/outbound/delivery-queue-ownership.kernel.ts
const OUTBOUND_DELIVERY_NAMESPACE_DESCRIPTORS = [
	{
		queueName: OUTBOUND_DELIVERY_QUEUE_NAME,
		namespace: "prepared",
		retired: false
	},
	{
		queueName: OUTBOUND_DELIVERY_PREPARATION_QUEUE_NAME,
		namespace: "preparing",
		retired: true
	},
	{
		queueName: OUTBOUND_DELIVERY_MIGRATION_QUEUE_NAME,
		namespace: "migration",
		retired: true
	},
	{
		queueName: OUTBOUND_LEGACY_PREPARATION_QUEUE_NAME,
		namespace: "legacy-preparing",
		retired: true
	},
	{
		queueName: LEGACY_OUTBOUND_DELIVERY_QUEUE_NAME,
		namespace: "legacy",
		retired: true
	}
];
function findDeliveryIntentOwnersInDatabase(database, params) {
	const owners = getDeliveryQueueEntriesOwnersInDatabase(database, OUTBOUND_DELIVERY_NAMESPACE_DESCRIPTORS.map(({ queueName }) => queueName), params.ids);
	return params.ids.map((id) => {
		const namespaces = owners.get(id);
		for (const descriptor of OUTBOUND_DELIVERY_NAMESPACE_DESCRIPTORS) {
			const owner = namespaces?.get(descriptor.queueName);
			if (owner) return {
				...descriptor,
				...owner
			};
		}
		return null;
	});
}
//#endregion
//#region src/infra/outbound/delivery-queue-pending-failure.worker.ts
function executePendingDeliveryFailure(input, writeOptions) {
	const entry = JSON.parse(input.entryJson);
	const params = {
		...input,
		entry
	};
	const result = input.expectedPlatformSendAttemptId !== void 0 ? runOpenClawStateWriteTransaction((writer) => failPendingDeliveryInDatabase(writer, params, input.prepared), writeOptions, { operationLabel: `mutate owned ${OUTBOUND_DELIVERY_QUEUE_NAME} delivery platform send` }) : failPendingDeliveryInDatabase(writeOptions.database, params, input.prepared);
	return {
		result,
		spoolPaths: result.status === "failed" && input.retainSpoolArtifacts !== true ? collectEntrySpoolPaths(acceptedPreparedOutboundEntries(entry.preparedBatch).map((prepared) => prepared.payload), input.stateDir) : []
	};
}
//#endregion
//#region src/infra/outbound/delivery-queue-platform-lease.worker.ts
function executeDeliveryQueuePlatformLeaseCommand(command, options) {
	return runOpenClawStateWriteTransaction((database) => command.type === "deliveryQueue.claimPlatformSend" ? claimDeliveryQueueEntryPlatformSendInDatabase(database, command.input, command.input.claimId) : renewDeliveryQueueEntryPlatformSendLeaseInDatabase(database, command.input), options, { operationLabel: `${command.type === "deliveryQueue.claimPlatformSend" ? "claim" : "renew"} ${command.input.queueName} delivery platform send` });
}
//#endregion
//#region src/infra/delivery-queue.worker.ts
function isDeliveryQueueCommand(command) {
	return command.type === "deliveryQueue.claimPlatformSend" || command.type === "deliveryQueue.renewPlatformSendLease" || command.type === "deliveryQueue.ack" || command.type === "deliveryQueue.enqueue" || command.type === "deliveryQueue.failPending" || command.type === "deliveryQueue.countFailed" || command.type === "deliveryQueue.findIntentOwners" || command.type === "deliveryQueue.pruneTombstones" || command.type === "deliveryQueue.mediaRetentionSnapshot";
}
function executeDeliveryQueueCommand(command, options) {
	switch (command.type) {
		case "deliveryQueue.claimPlatformSend":
		case "deliveryQueue.renewPlatformSendLease": return executeDeliveryQueuePlatformLeaseCommand(command, options);
		case "deliveryQueue.ack": return executeDeliveryQueueAck(command.input, options);
		case "deliveryQueue.enqueue": return executeDeliveryQueueEnqueue(command.input, options);
		case "deliveryQueue.failPending": return executePendingDeliveryFailure(command.input, options);
		case "deliveryQueue.findIntentOwners": return findDeliveryIntentOwnersInDatabase(options.database, command.input);
		case "deliveryQueue.countFailed": return countFailedDeliveryQueueEntriesInDatabase(options.database);
		case "deliveryQueue.pruneTombstones": return pruneExpiredDeliveryQueueTombstonesInDatabase(options.database);
		case "deliveryQueue.mediaRetentionSnapshot": return loadDeliveryQueueMediaRetentionSnapshotInDatabase(options.database, command.input);
	}
}
//#endregion
//#region src/infra/device-pairing-mutation.worker.ts
const admission = new AsyncLocalStorage();
/** Recheck live host custody while the authoritative SQLite rows remain locked. */
function requestDevicePairingMutationAdmission(facts) {
	const requests = admission.getStore();
	if (!requests) throw new Error("Pairing mutation requires its worker transaction");
	const captured = structuredClone(facts);
	requestSqliteWorkerOperationAdmission({
		stage: "transaction",
		facts: [captured]
	});
	requests.push(captured);
}
function withDevicePairingMutationAdmission(operate) {
	return admission.run([], () => {
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: []
		});
		const result = operate();
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: admission.getStore()
		});
		return result;
	});
}
//#endregion
//#region src/infra/device-bootstrap.worker-kernel.ts
const DEVICE_PAIR_SETUP_COMPLETION_RETENTION_MS = 2 * DEVICE_BOOTSTRAP_TOKEN_TTL_MS;
function resolvePersistedBootstrapProfile(record) {
	return normalizeDeviceBootstrapProfile(record.profile);
}
function resolvePersistedRedeemedProfile(record) {
	return normalizeDeviceBootstrapProfile(record.redeemedProfile);
}
function resolvePersistedPendingProfile(record) {
	return record.pendingProfile ? normalizeDeviceBootstrapProfile(record.pendingProfile) : null;
}
function resolveRequestedBootstrapProfile(params) {
	return normalizeDeviceBootstrapProfile({
		roles: [params.role],
		scopes: resolveBootstrapProfileScopesForRole(params.role, params.scopes, params.purpose),
		purpose: params.purpose
	});
}
function bootstrapProfileAllowsRequest(params) {
	return params.allowedProfile.roles.includes(params.requestedRole) && roleScopesAllow({
		role: params.requestedRole,
		requestedScopes: params.requestedScopes,
		allowedScopes: params.allowedProfile.scopes
	});
}
function bootstrapProfileSatisfiesProfile(params) {
	for (const requiredRole of params.requiredProfile.roles) {
		if (!params.actualProfile.roles.includes(requiredRole)) return false;
		const requiredScopes = resolveBootstrapProfileScopesForRole(requiredRole, params.requiredProfile.scopes, params.requiredProfile.purpose);
		if (requiredScopes.length > 0 && !bootstrapProfileAllowsRequest({
			allowedProfile: params.actualProfile,
			requestedRole: requiredRole,
			requestedScopes: requiredScopes
		})) return false;
	}
	return true;
}
function normalizeBootstrapPublicKey(publicKey) {
	const trimmed = publicKey.trim();
	if (!trimmed) return "";
	if (trimmed.includes("BEGIN") || /[+/=]/.test(trimmed)) return normalizeDevicePublicKeyBase64Url(trimmed) ?? trimmed;
	return trimmed;
}
function loadState(nowMs) {
	const state = loadDeviceBootstrapTokenRecords();
	pruneExpiredPending(state, asDateTimestampMs(nowMs) ?? 0, DEVICE_BOOTSTRAP_TOKEN_TTL_MS);
	return state;
}
function issueDeviceBootstrapTokenRecord(params) {
	const state = loadState(params.nowMs);
	const token = generatePairingToken();
	const issuedAtMs = asDateTimestampMs(params.nowMs);
	const expiresAtMs = issuedAtMs === void 0 ? void 0 : resolveExpiresAtMsFromDurationMs(DEVICE_BOOTSTRAP_TOKEN_TTL_MS, { nowMs: issuedAtMs });
	if (issuedAtMs === void 0 || expiresAtMs === void 0) throw new Error("Device bootstrap token expiry could not be resolved.");
	const profile = params.profile;
	state[token] = {
		token,
		...params.setupId ? { setupId: params.setupId } : {},
		ts: issuedAtMs,
		profile,
		redeemedProfile: normalizeDeviceBootstrapProfile(void 0),
		issuedAtMs
	};
	persistDeviceBootstrapTokenRecords(state);
	return {
		token,
		expiresAtMs
	};
}
/** Reuse one environment-owned setup credential across provider replay. */
function ensureDevicePairSetupBootstrapToken(params) {
	const setupId = params.setupId.trim();
	if (!setupId) throw new Error("Device setup id must be non-empty.");
	const completion = loadDevicePairSetupCompletionRecord(setupId, params.nowMs);
	if (completion) return {
		status: "completed",
		setupId,
		deviceId: completion.deviceId
	};
	const state = loadState(params.nowMs);
	const existing = Object.values(state).find((record) => record.setupId === setupId);
	const profile = normalizeDeviceBootstrapHandoffProfile(params.profile);
	if (existing) {
		if (!deviceBootstrapProfilesEqual(existing.profile, profile)) throw new Error("Device setup profile changed during replay.");
		return {
			status: "pending",
			token: existing.token,
			expiresAtMs: existing.issuedAtMs + DEVICE_BOOTSTRAP_TOKEN_TTL_MS,
			setupId
		};
	}
	const issuedAtMs = asDateTimestampMs(params.nowMs);
	const expiresAtMs = issuedAtMs === void 0 ? void 0 : resolveExpiresAtMsFromDurationMs(DEVICE_BOOTSTRAP_TOKEN_TTL_MS, { nowMs: issuedAtMs });
	if (issuedAtMs === void 0 || expiresAtMs === void 0) throw new Error("Device bootstrap token expiry could not be resolved.");
	const token = generatePairingToken();
	state[token] = {
		token,
		setupId,
		ts: issuedAtMs,
		profile,
		redeemedProfile: normalizeDeviceBootstrapProfile(void 0),
		issuedAtMs
	};
	persistDeviceBootstrapTokenRecords(state);
	return {
		status: "pending",
		token,
		expiresAtMs,
		setupId
	};
}
/**
* Record that credential delivery is not yet known. Only cloud-worker setup
* keeps its device-bound bearer until delivery is confirmed, allowing the same
* worker to retry when its credential-bearing response never arrives.
*/
function consumeDeviceBootstrapTokenWithSetupCompletion(params, recordWorkerEnvironment) {
	const nowMs = params.nowMs;
	return consumeDeviceBootstrapTokenWithSetupCompletionInTransaction({
		token: params.token,
		deviceId: params.deviceId,
		completedAtMs: params.completedAtMs,
		recordWorkerEnvironment,
		oldestValidIssuedAtMs: nowMs - DEVICE_BOOTSTRAP_TOKEN_TTL_MS,
		retentionNowMs: nowMs,
		retainUntilMs: nowMs + DEVICE_PAIR_SETUP_COMPLETION_RETENTION_MS,
		pairedDeviceMatches: (pairedDevice, record) => {
			requestDevicePairingMutationAdmission({
				kind: "bootstrap.consume",
				pairedDevice,
				issuedAtMs: record.issuedAtMs
			});
			return true;
		}
	});
}
/** Confirm that the pairing client received the credential-bearing handoff response. */
function confirmDevicePairSetupCompletionDelivery(params) {
	return confirmDevicePairSetupCompletionDeliveryInTransaction({
		setupId: params.setupId,
		deviceId: params.deviceId,
		nowMs: params.nowMs
	});
}
/**
* Read the terminal outcome for one setup credential, or null while none is
* recorded. Shares this module's lock with issuance and revocation so a status
* query never observes a setup mid-settlement.
*/
function readDevicePairSetupCompletion(params) {
	return loadDevicePairSetupCompletionRecord(params.setupId, params.nowMs);
}
/** Remove retained setup outcomes independently of status requests or later pairings. */
function pruneExpiredDevicePairSetupCompletions(params) {
	return pruneExpiredDevicePairSetupCompletionRecords(params.nowMs);
}
/** Remove every outstanding bootstrap token from the pairing state file. */
function clearDeviceBootstrapTokens(params) {
	const state = loadState(params.nowMs);
	const removed = Object.keys(state).length;
	persistDeviceBootstrapTokenRecords({});
	return { removed };
}
/** Revoke one bootstrap token and return its record for best-effort restore flows. */
function revokeDeviceBootstrapToken(params) {
	const providedToken = params.token.trim();
	if (!providedToken) return { removed: false };
	const state = loadState(params.nowMs);
	const found = Object.entries(state).find(([, candidate]) => verifyPairingToken(providedToken, candidate.token));
	if (!found) return { removed: false };
	const [tokenKey, record] = found;
	delete state[tokenKey];
	persistDeviceBootstrapTokenRecords(state);
	return {
		removed: true,
		record
	};
}
/** Revoke bootstrap credentials inside the rejected request's pairing transaction. */
function revokeDeviceBootstrapTokensForDeviceInDatabase(database, params) {
	withDevicePairingStoreDatabase(database, () => {
		const deviceId = params.deviceId.trim();
		const publicKey = normalizeBootstrapPublicKey(params.publicKey);
		if (!deviceId || !publicKey) return;
		const state = loadState(params.nowMs);
		let removed = false;
		for (const [tokenKey, record] of Object.entries(state)) {
			const recordPublicKey = typeof record.publicKey === "string" ? normalizeBootstrapPublicKey(record.publicKey) : void 0;
			if (record.deviceId?.trim() === deviceId && recordPublicKey === publicKey) {
				delete state[tokenKey];
				removed = true;
			}
		}
		if (removed) persistDeviceBootstrapTokenRecords(state);
	});
}
/** Restore an uncorrelated bootstrap bearer when its credential response was not delivered. */
function restoreGenericDeviceBootstrapToken(params) {
	if (params.record.setupId) return false;
	const state = loadState(params.nowMs);
	state[params.record.token] = params.record;
	persistDeviceBootstrapTokenRecords(state);
	return true;
}
/** Record that one role/scope leg of a multi-role bootstrap handoff was redeemed. */
function redeemDeviceBootstrapTokenProfile(params) {
	const providedToken = params.token.trim();
	if (!providedToken) return {
		recorded: false,
		fullyRedeemed: false
	};
	const state = loadState(params.nowMs);
	const found = Object.entries(state).find(([, candidate]) => verifyPairingToken(providedToken, candidate.token));
	if (!found) return {
		recorded: false,
		fullyRedeemed: false
	};
	const [tokenKey, record] = found;
	const issuedProfile = resolvePersistedBootstrapProfile(record);
	requestDevicePairingMutationAdmission({
		kind: "bootstrap.token",
		issuedAtMs: record.issuedAtMs
	});
	const pendingProfile = resolvePersistedPendingProfile(record);
	const redeemedProfile = normalizeDeviceBootstrapProfile({
		roles: [...resolvePersistedRedeemedProfile(record).roles, params.role],
		scopes: [...resolvePersistedRedeemedProfile(record).scopes, ...resolveBootstrapProfileScopesForRole(params.role, params.scopes, issuedProfile.purpose)],
		purpose: issuedProfile.purpose
	});
	const nextPendingProfile = pendingProfile && !bootstrapProfileSatisfiesProfile({
		actualProfile: redeemedProfile,
		requiredProfile: pendingProfile
	}) ? pendingProfile : void 0;
	const nextRecord = {
		...record,
		profile: issuedProfile,
		redeemedProfile
	};
	if (nextPendingProfile) nextRecord.pendingProfile = nextPendingProfile;
	else delete nextRecord.pendingProfile;
	state[tokenKey] = nextRecord;
	persistDeviceBootstrapTokenRecords(state);
	return {
		recorded: true,
		fullyRedeemed: bootstrapProfileSatisfiesProfile({
			actualProfile: redeemedProfile,
			requiredProfile: issuedProfile
		})
	};
}
/** Verify a bootstrap token, bind it to the first device identity, and stage requested scopes. */
function verifyDeviceBootstrapToken(params) {
	const state = loadState(params.nowMs);
	const providedToken = params.token.trim();
	if (!providedToken) return {
		ok: false,
		reason: "bootstrap_token_invalid"
	};
	const found = Object.entries(state).find(([, candidate]) => verifyPairingToken(providedToken, candidate.token));
	if (!found) return {
		ok: false,
		reason: "bootstrap_token_invalid"
	};
	const [tokenKey, record] = found;
	const deviceId = params.deviceId.trim();
	const publicKey = normalizeBootstrapPublicKey(params.publicKey);
	const role = params.role.trim();
	if (!deviceId || !publicKey || !role) return {
		ok: false,
		reason: "bootstrap_token_invalid"
	};
	const allowedProfile = resolvePersistedBootstrapProfile(record);
	const requestedProfile = resolveRequestedBootstrapProfile({
		role,
		scopes: params.scopes,
		purpose: allowedProfile.purpose
	});
	if (allowedProfile.roles.length === 0 || deviceBootstrapProfilesEqual(allowedProfile, CONTROL_UI_OWNER_BOOTSTRAP_PROFILE) && !deviceBootstrapProfilesEqual(requestedProfile, CONTROL_UI_OWNER_BOOTSTRAP_PROFILE) || !bootstrapProfileAllowsRequest({
		allowedProfile,
		requestedRole: role,
		requestedScopes: params.scopes
	})) return {
		ok: false,
		reason: "bootstrap_token_invalid"
	};
	requestDevicePairingMutationAdmission({
		kind: "bootstrap.token",
		issuedAtMs: record.issuedAtMs
	});
	const boundDeviceId = record.deviceId?.trim();
	const boundPublicKey = typeof record.publicKey === "string" ? normalizeBootstrapPublicKey(record.publicKey) : void 0;
	if (boundDeviceId || boundPublicKey) {
		if (boundDeviceId !== deviceId || boundPublicKey !== publicKey) return {
			ok: false,
			reason: "bootstrap_token_invalid"
		};
		const pendingProfile = resolvePersistedPendingProfile(record);
		if (pendingProfile && !deviceBootstrapProfilesEqual(pendingProfile, requestedProfile)) return {
			ok: false,
			reason: "bootstrap_token_invalid"
		};
		state[tokenKey] = {
			...record,
			profile: allowedProfile,
			pendingProfile: pendingProfile ?? requestedProfile,
			deviceId,
			publicKey,
			lastUsedAtMs: params.nowMs
		};
		persistDeviceBootstrapTokenRecords(state);
		return { ok: true };
	}
	state[tokenKey] = {
		...record,
		profile: allowedProfile,
		pendingProfile: requestedProfile,
		deviceId,
		publicKey,
		lastUsedAtMs: params.nowMs
	};
	persistDeviceBootstrapTokenRecords(state);
	return { ok: true };
}
function executeDeviceBootstrapMutation(command, database, recordWorkerEnvironment) {
	return withDevicePairingStoreDatabase(database, () => {
		switch (command.type) {
			case "bootstrap.issue": return issueDeviceBootstrapTokenRecord(command.input);
			case "bootstrap.ensure": return ensureDevicePairSetupBootstrapToken(command.input);
			case "bootstrap.consume": return consumeDeviceBootstrapTokenWithSetupCompletion(command.input, recordWorkerEnvironment);
			case "bootstrap.confirm": return confirmDevicePairSetupCompletionDelivery(command.input);
			case "bootstrap.readCompletion": return readDevicePairSetupCompletion(command.input);
			case "bootstrap.prune": return pruneExpiredDevicePairSetupCompletions(command.input);
			case "bootstrap.clear": return clearDeviceBootstrapTokens(command.input);
			case "bootstrap.revoke": return revokeDeviceBootstrapToken(command.input);
			case "bootstrap.restore": return restoreGenericDeviceBootstrapToken(command.input);
			case "bootstrap.redeem": return redeemDeviceBootstrapTokenProfile(command.input);
			case "bootstrap.verify": return verifyDeviceBootstrapToken(command.input);
		}
		throw new Error("Unsupported device bootstrap command");
	});
}
//#endregion
//#region src/infra/device-pairing-binding.ts
function prepareDevicePairingBinding(deviceId, device) {
	const state = resolveNodePairingState(device);
	return {
		deviceId,
		binding: state ? {
			identity: state.identity.key,
			...state.generation ? { generation: state.generation.key } : {}
		} : null
	};
}
//#endregion
//#region src/infra/device-pairing-approval.kernel.ts
const OPERATOR_ROLE = "operator";
const OPERATOR_SCOPE_PREFIX = "operator.";
function mergeApprovalKind(existing, incoming) {
	if (incoming === "owner" || !existing) return incoming;
	if (existing.approvedVia === void 0) return incoming === "bootstrap" ? "bootstrap" : void 0;
	if (existing.approvedVia === "owner" || existing.approvedVia === "bootstrap") return existing.approvedVia;
	return incoming;
}
function buildApprovedPairedDevice(params) {
	return {
		deviceId: params.pending.deviceId,
		publicKey: params.pending.publicKey,
		displayName: params.accessMetadata?.displayName ?? params.pending.displayName,
		platform: params.pending.platform,
		deviceFamily: params.pending.deviceFamily,
		clientId: params.pending.clientId,
		clientMode: params.pending.clientMode,
		browserOrigin: params.pending.browserOrigin,
		role: params.pending.role,
		roles: params.roles,
		scopes: params.approvedScopes,
		approvedScopes: params.approvedScopes,
		remoteIp: params.accessMetadata?.remoteIp ?? params.pending.remoteIp,
		tokens: params.tokens,
		approvedVia: mergeApprovalKind(params.existing, params.approvedVia),
		...params.existing?.nodeSurface ? { nodeSurface: params.existing.nodeSurface } : {},
		...params.existing?.pendingNodeSurface ? { pendingNodeSurface: params.existing.pendingNodeSurface } : {},
		...params.existing?.operatorLabel ? { operatorLabel: params.existing.operatorLabel } : {},
		createdAtMs: params.existing?.createdAtMs ?? params.now,
		approvedAtMs: params.now,
		lastSeenAtMs: params.accessMetadata?.lastSeenAtMs ?? params.existing?.lastSeenAtMs,
		lastSeenReason: params.accessMetadata?.lastSeenReason ?? params.existing?.lastSeenReason
	};
}
function commitApprovedDevicePairing(params) {
	const { state, requestId, device, baseDir } = params;
	const existing = state.pairedByDeviceId[device.deviceId];
	const previousNodeGeneration = resolveNodePairingGeneration(existing ?? null);
	const nextNodeGeneration = resolveNodePairingGeneration(device);
	const nodePairingGenerationChanged = Boolean(previousNodeGeneration && previousNodeGeneration.key !== nextNodeGeneration?.key);
	clearNodePairingGenerationState(device, previousNodeGeneration);
	const installationIdentityChanged = Boolean(existing && existing.publicKey !== device.publicKey);
	delete state.pendingById[requestId];
	state.pairedByDeviceId[device.deviceId] = device;
	persistDevicePairingStoreState(state, baseDir, "both", installationIdentityChanged ? { clearApnsNodeIds: [device.deviceId] } : void 0);
	return {
		status: "approved",
		requestId,
		device,
		...nodePairingGenerationChanged ? { nodePairingGenerationChanged: true } : {}
	};
}
function resolveApprovedTokenScopes(params) {
	const pendingScopes = resolveRoleTokenScopes(params.role, params.pending.scopes);
	if (pendingScopes.length > 0) {
		const approvedBaseline = resolveRoleTokenScopes(params.role, params.existing?.approvedScopes ?? params.existing?.scopes);
		const requestedScopeDelta = params.existingToken && approvedBaseline.length > 0 ? pendingScopes.filter((scope) => !approvedBaseline.includes(scope)) : pendingScopes;
		if (requestedScopeDelta.length === 0 && params.existingToken) return resolveRoleTokenScopes(params.role, params.existingToken.scopes);
		return resolveRoleTokenScopes(params.role, mergeDevicePairingScopes(params.existingToken?.scopes, requestedScopeDelta));
	}
	return resolveRoleTokenScopes(params.role, params.existingToken?.scopes ?? params.approvedScopes ?? params.existing?.approvedScopes ?? params.existing?.scopes);
}
function withPendingDevicePairingApproval(requestId, nowMs, baseDir, approve) {
	const state = loadDevicePairingStateForMutation(nowMs, baseDir);
	const pending = state.pendingById[requestId];
	if (!pending) return null;
	const existing = state.pairedByDeviceId[pending.deviceId];
	requestDevicePairingMutationAdmission({
		kind: "pairing-approval",
		pending,
		existing
	});
	return approve(state, pending, existing);
}
/** Approve an authoritative pending row inside the admitted pairing transaction. */
function approveDevicePairingInWorker(requestId, options, nowMs, baseDir) {
	return withPendingDevicePairingApproval(requestId, nowMs, baseDir, (state, pendingRecord, existing) => {
		const autoApproveScopes = options?.autoApproveNewDeviceScopes;
		const requestedRoles = resolveRequestedDeviceRoles(pendingRecord);
		const trustedProxySameKeyDevice = options?.approvedVia === "trusted-proxy" && existing !== void 0 && existing.publicKey === pendingRecord.publicKey;
		if (autoApproveScopes && ((pendingRecord.isRepair || existing) && !trustedProxySameKeyDevice || !sameDevicePairingStringSet(requestedRoles, [OPERATOR_ROLE]))) return null;
		const pending = autoApproveScopes ? {
			...pendingRecord,
			scopes: [...autoApproveScopes]
		} : pendingRecord;
		const requestedScopes = normalizeDeviceAuthScopes(pending.scopes);
		const roleMismatchScope = resolveScopeOutsideRequestedRoles({
			requestedRoles,
			requestedScopes
		});
		if (roleMismatchScope) return {
			status: "forbidden",
			reason: "scope-outside-requested-roles",
			scope: roleMismatchScope
		};
		const now = nowMs;
		const roles = mergeDevicePairingRoles(existing?.roles, existing?.role, pending.roles, pending.role);
		const approvedScopes = mergeDevicePairingScopes(existing?.approvedScopes ?? existing?.scopes, pending.scopes);
		const tokens = existing?.tokens ? { ...existing.tokens } : {};
		const nextTokenScopesByRole = /* @__PURE__ */ new Map();
		for (const roleForToken of requestedRoles) {
			const existingToken = tokens[roleForToken];
			const nextScopes = resolveApprovedTokenScopes({
				role: roleForToken,
				pending,
				existingToken,
				approvedScopes,
				existing
			});
			nextTokenScopesByRole.set(roleForToken, nextScopes);
			if (roleForToken === OPERATOR_ROLE && nextScopes.length > 0) {
				const callerRequiredScopes = mergeDevicePairingScopes(resolveRoleTokenScopes(roleForToken, pending.scopes), nextScopes) ?? nextScopes;
				if (!options?.callerScopes) return {
					status: "forbidden",
					reason: "caller-scopes-required",
					scope: callerRequiredScopes[0]
				};
				const missingScope = resolveMissingRequestedScope({
					role: OPERATOR_ROLE,
					requestedScopes: callerRequiredScopes,
					allowedScopes: options.callerScopes
				});
				if (missingScope) return {
					status: "forbidden",
					reason: "caller-missing-scope",
					scope: missingScope
				};
			}
		}
		for (const [roleForToken, nextScopes] of nextTokenScopesByRole) {
			const existingToken = tokens[roleForToken];
			const tokenNow = nowMs;
			tokens[roleForToken] = createDeviceAuthToken({
				role: roleForToken,
				scopes: nextScopes,
				existing: existingToken,
				preserveExistingIssuer: true,
				now: tokenNow,
				rotatedAtMs: existingToken ? tokenNow : void 0
			});
		}
		return commitApprovedDevicePairing({
			state,
			requestId,
			device: buildApprovedPairedDevice({
				pending,
				existing,
				roles,
				approvedScopes,
				tokens,
				now,
				approvedVia: options?.approvedVia ?? "owner",
				accessMetadata: options?.accessMetadata
			}),
			baseDir
		});
	});
}
/** Approve one bounded bootstrap grant inside the admitted pairing transaction. */
function approveBootstrapDevicePairingInWorker(requestId, bootstrapProfile, options, nowMs, baseDir) {
	let replacedRoles = [];
	const approvedRoles = mergeDevicePairingRoles(bootstrapProfile.roles) ?? [];
	const approvedScopes = resolveDeviceProfileScopes(bootstrapProfile, approvedRoles);
	return {
		result: withPendingDevicePairingApproval(requestId, nowMs, baseDir, (state, pending, existing) => {
			const requestedRoles = resolveRequestedDeviceRoles(pending);
			const missingRole = requestedRoles.find((role) => !approvedRoles.includes(role));
			if (missingRole) return {
				status: "forbidden",
				reason: "bootstrap-role-not-allowed",
				role: missingRole
			};
			const requestedOperatorScopes = normalizeDeviceAuthScopes(pending.scopes).filter((scope) => scope.startsWith(OPERATOR_SCOPE_PREFIX));
			const missingScope = resolveMissingRequestedScope({
				role: OPERATOR_ROLE,
				requestedScopes: requestedOperatorScopes,
				allowedScopes: approvedScopes
			});
			if (missingScope) return {
				status: "forbidden",
				reason: "bootstrap-scope-not-allowed",
				scope: missingScope
			};
			const now = nowMs;
			const grantedRoles = requestedRoles;
			const grantedScopes = resolveDeviceProfileScopes(bootstrapProfile, grantedRoles, pending.scopes ?? []);
			const grantedRoleSet = new Set(grantedRoles);
			const preservedExistingScopes = (mergeDevicePairingRoles(existing?.roles, existing?.role) ?? []).flatMap((existingRole) => grantedRoleSet.has(existingRole) ? [] : preserveDeviceRoleScopes(existingRole, existing?.approvedScopes ?? existing?.scopes));
			const roles = mergeDevicePairingRoles(existing?.roles, existing?.role, pending.roles, pending.role);
			const nextApprovedScopes = mergeDevicePairingScopes(preservedExistingScopes, grantedScopes);
			const tokens = existing?.tokens ? { ...existing.tokens } : {};
			for (const roleForToken of grantedRoles) {
				const existingToken = tokens[roleForToken];
				const tokenScopes = roleForToken === OPERATOR_ROLE ? resolveDeviceProfileRoleScopes(bootstrapProfile, roleForToken, grantedScopes) : [];
				tokens[roleForToken] = createDeviceAuthToken({
					role: roleForToken,
					scopes: tokenScopes,
					existing: existingToken,
					now,
					...existingToken ? { rotatedAtMs: now } : {}
				});
			}
			const approved = commitApprovedDevicePairing({
				state,
				requestId,
				device: buildApprovedPairedDevice({
					pending,
					existing,
					roles,
					approvedScopes: nextApprovedScopes,
					tokens,
					now,
					approvedVia: "bootstrap",
					accessMetadata: options?.accessMetadata
				}),
				baseDir
			});
			replacedRoles = grantedRoles.filter((role) => existing?.tokens?.[role]);
			return approved;
		}),
		replacedRoles
	};
}
//#endregion
//#region src/infra/device-pairing-core.kernel.ts
function resolveRequestedScopes(input) {
	return normalizeDeviceAuthScopes(input.scopes);
}
function samePendingApprovalSnapshot(existing, incoming) {
	if (existing.publicKey !== incoming.publicKey) return false;
	if (existing.browserOrigin !== incoming.browserOrigin) return false;
	if (normalizeDevicePairingRole(existing.role) !== normalizeDevicePairingRole(incoming.role)) return false;
	if (!sameDevicePairingStringSet(resolveRequestedDeviceRoles(existing), resolveRequestedDeviceRoles(incoming)) || !sameDevicePairingStringSet(resolveRequestedScopes(existing), resolveRequestedScopes(incoming))) return false;
	return true;
}
function isStringSubset(subset, superset) {
	const supersetSet = new Set(superset);
	for (const value of subset) if (!supersetSet.has(value)) return false;
	return true;
}
function incomingApprovalCoveredByExisting(existing, incoming) {
	if (existing.publicKey !== incoming.publicKey) return false;
	if (existing.browserOrigin !== incoming.browserOrigin) return false;
	if (normalizeDevicePairingRole(existing.role) !== normalizeDevicePairingRole(incoming.role)) return false;
	const incomingRoles = resolveRequestedDeviceRoles(incoming);
	if (!isStringSubset(incomingRoles, resolveRequestedDeviceRoles(existing))) return false;
	const existingScopes = resolveRequestedScopes(existing);
	for (const scope of resolveRequestedScopes(incoming)) if (!incomingRoles.some((role) => roleScopesAllow({
		role,
		requestedScopes: [scope],
		allowedScopes: existingScopes
	}))) return false;
	return true;
}
function refreshPendingDevicePairingRequest(existing, incoming, isRepair, nowMs) {
	return {
		...existing,
		publicKey: incoming.publicKey,
		displayName: incoming.displayName ?? existing.displayName,
		platform: incoming.platform ?? existing.platform,
		deviceFamily: incoming.deviceFamily ?? existing.deviceFamily,
		clientId: incoming.clientId ?? existing.clientId,
		clientMode: incoming.clientMode ?? existing.clientMode,
		browserOrigin: existing.browserOrigin,
		remoteIp: incoming.remoteIp ?? existing.remoteIp,
		silent: Boolean(existing.silent && incoming.silent),
		isRepair: existing.isRepair || isRepair,
		ts: existing.ts,
		refreshedAtMs: nowMs
	};
}
function resolveSupersededPendingSilent(params) {
	return Boolean(params.incomingSilent && params.existing.every((pending) => pending.silent === true));
}
function toPublicPendingDevicePairingRequest(pending) {
	const { refreshedAtMs: _refreshedAtMs, ...request } = pending;
	return request;
}
function buildPendingDevicePairingRequest(params) {
	const role = normalizeDevicePairingRole(params.req.role) ?? void 0;
	return {
		requestId: params.requestId ?? randomUUID(),
		deviceId: params.deviceId,
		publicKey: params.req.publicKey,
		displayName: params.req.displayName,
		platform: params.req.platform,
		deviceFamily: params.req.deviceFamily,
		clientId: params.req.clientId,
		clientMode: params.req.clientMode,
		browserOrigin: params.req.browserOrigin,
		role,
		roles: mergeDevicePairingRoles(params.req.roles, role),
		scopes: mergeDevicePairingScopes(params.req.scopes),
		remoteIp: params.req.remoteIp,
		silent: params.req.silent,
		isRepair: params.isRepair,
		ts: params.nowMs
	};
}
/** Create or refresh a pending device pairing request for owner approval. */
function requestDevicePairingInWorker(req, nowMs, baseDir) {
	const state = loadDevicePairingStateForMutation(nowMs, baseDir);
	const deviceId = normalizeDevicePairingId(req.deviceId);
	if (!deviceId) throw new Error("deviceId required");
	const isRepair = Boolean(state.pairedByDeviceId[deviceId]);
	const pendingForDevice = Object.values(state.pendingById).filter((pending) => pending.deviceId === deviceId).toSorted((left, right) => right.ts - left.ts);
	const result = reconcilePendingPairingRequests({
		pendingById: state.pendingById,
		existing: pendingForDevice,
		incoming: req,
		canRefreshSingle: (existing, incoming) => samePendingApprovalSnapshot(existing, incoming) || incomingApprovalCoveredByExisting(existing, incoming),
		refreshSingle: (existing, incoming) => refreshPendingDevicePairingRequest(existing, incoming, isRepair, nowMs),
		buildReplacement: ({ existing, incoming }) => {
			const latestPending = existing[0];
			const mergedRoles = mergeDevicePairingRoles(...existing.flatMap((pending) => [pending.roles, pending.role]), incoming.roles, incoming.role);
			const mergedScopes = mergeDevicePairingScopes(...existing.map((pending) => pending.scopes), incoming.scopes);
			return buildPendingDevicePairingRequest({
				nowMs,
				deviceId,
				isRepair,
				req: {
					...incoming,
					role: normalizeDevicePairingRole(incoming.role) ?? latestPending?.role,
					roles: mergedRoles,
					scopes: mergedScopes,
					silent: resolveSupersededPendingSilent({
						existing,
						incomingSilent: incoming.silent
					})
				}
			});
		},
		persist: () => persistDevicePairingStoreState(state, baseDir, "pending")
	});
	const superseded = result.created ? pendingForDevice.filter((pending) => pending.requestId !== result.request.requestId).map((pending) => ({
		requestId: pending.requestId,
		deviceId: pending.deviceId
	})) : [];
	const publicResult = {
		...result,
		request: toPublicPendingDevicePairingRequest(result.request),
		expiresAtMs: resolvePairingRequestExpiry(result.request.refreshedAtMs ?? result.request.ts)
	};
	return superseded.length > 0 ? {
		...publicResult,
		superseded
	} : publicResult;
}
/** Reject a pending request and revoke matching bootstrap tokens for that device. */
function rejectDevicePairingInWorker(database, requestId, nowMs, baseDir) {
	const state = loadDevicePairingStateForMutation(nowMs, baseDir);
	const pending = state.pendingById[requestId];
	if (!pending) return null;
	delete state.pendingById[requestId];
	persistDevicePairingStoreState(state, baseDir, "pending");
	revokeDeviceBootstrapTokensForDeviceInDatabase(database, {
		deviceId: pending.deviceId,
		publicKey: pending.publicKey,
		nowMs
	});
	return {
		requestId,
		deviceId: pending.deviceId
	};
}
/** Remove a paired device and any pending repair requests for the same device id. */
function removePairedDeviceInWorker(deviceId, nowMs, baseDir) {
	const state = loadDevicePairingStateForMutation(nowMs, baseDir);
	const normalized = normalizeDevicePairingId(deviceId);
	if (!normalized || !state.pairedByDeviceId[normalized]) return null;
	delete state.pairedByDeviceId[normalized];
	for (const [requestId, pending] of Object.entries(state.pendingById)) if (pending.deviceId === normalized) delete state.pendingById[requestId];
	persistDevicePairingStoreState(state, baseDir, "both", { clearApnsNodeIds: [normalized] });
	return { deviceId: normalized };
}
function silentPairingClusterKey(device) {
	const clientId = device.clientId?.trim().toLowerCase() ?? "";
	const clientMode = device.clientMode?.trim().toLowerCase() ?? "";
	const displayName = device.displayName?.trim().toLowerCase() ?? "";
	if (!clientId && !clientMode && !displayName) return null;
	return `${clientId}\0${clientMode}\0${displayName}`;
}
const PRUNE_RECENT_APPROVAL_GRACE_MS = 6e4;
/**
* Remove silent-approved sibling records superseded by a newly approved silent
* pairing of the same client cluster. Only records whose latest approval was
* same-host local ("silent") are eligible, as anchor and as victim: local
* clients re-pair silently by construction and share the gateway host, so the
* metadata cluster key cannot match a different machine. Currently connected
* devices are skipped so concurrent sessions with distinct state dirs keep
* their tokens while live.
*/
function pruneSupersededSilentPairedDevicesInWorker(params) {
	const state = loadDevicePairingStateForMutation(params.nowMs, params.baseDir);
	const anchor = state.pairedByDeviceId[normalizeDevicePairingId(params.deviceId)];
	if (!anchor || anchor.approvedVia !== "silent") return [];
	const anchorKey = silentPairingClusterKey(anchor);
	if (!anchorKey) return [];
	const nowMs = params.nowMs;
	const protectedDeviceIds = new Set(params.protectedDeviceIds);
	const removed = [];
	for (const device of Object.values(state.pairedByDeviceId)) {
		if (device.deviceId === anchor.deviceId) continue;
		if (device.approvedVia !== "silent") continue;
		if (silentPairingClusterKey(device) !== anchorKey) continue;
		if (nowMs - device.approvedAtMs < PRUNE_RECENT_APPROVAL_GRACE_MS) continue;
		if (protectedDeviceIds.has(device.deviceId)) continue;
		delete state.pairedByDeviceId[device.deviceId];
		for (const [requestId, pending] of Object.entries(state.pendingById)) if (pending.deviceId === device.deviceId) delete state.pendingById[requestId];
		removed.push({
			deviceId: device.deviceId,
			roles: listApprovedPairedDeviceRoles(device)
		});
	}
	if (removed.length === 0) return [];
	requestDevicePairingMutationAdmission({
		kind: "pairing-prune",
		deviceIds: removed.map((entry) => entry.deviceId)
	});
	persistDevicePairingStoreState(state, params.baseDir, "both", { clearApnsNodeIds: removed.map((entry) => entry.deviceId) });
	return removed;
}
/** Remove one approved paired-device role while preserving unrelated role tokens. */
function removePairedDeviceRoleInWorker(params) {
	const state = loadDevicePairingStateForMutation(params.nowMs, params.baseDir);
	const normalizedDeviceId = normalizeDevicePairingId(params.deviceId);
	const role = normalizeDevicePairingRole(params.role);
	const device = state.pairedByDeviceId[normalizedDeviceId];
	if (!device || !role || !listApprovedPairedDeviceRoles(device).includes(role)) return null;
	const tokens = cloneDevicePairingTokens(device);
	delete tokens[role];
	const remainingRoles = listApprovedPairedDeviceRoles(device).filter((entry) => entry !== role);
	if (remainingRoles.length === 0) {
		for (const [requestId, pending] of Object.entries(state.pendingById)) if (pending.deviceId === normalizedDeviceId) delete state.pendingById[requestId];
		delete state.pairedByDeviceId[normalizedDeviceId];
		persistDevicePairingStoreState(state, params.baseDir, "both", { clearApnsNodeIds: [normalizedDeviceId] });
		return {
			deviceId: normalizedDeviceId,
			role,
			removedDevice: true
		};
	}
	for (const [requestId, pending] of Object.entries(state.pendingById)) {
		if (pending.deviceId !== normalizedDeviceId) continue;
		const pendingRoles = resolveRequestedDeviceRoles(pending);
		if (!pendingRoles.includes(role)) continue;
		const nextPendingRoles = pendingRoles.filter((entry) => entry !== role);
		if (nextPendingRoles.length === 0) {
			delete state.pendingById[requestId];
			continue;
		}
		const pendingScopes = Array.isArray(pending.scopes) ? mergeDevicePairingScopes(...nextPendingRoles.map((entry) => preserveDeviceRoleScopes(entry, pending.scopes))) : void 0;
		state.pendingById[requestId] = {
			...pending,
			role: nextPendingRoles[0],
			roles: nextPendingRoles,
			scopes: pendingScopes
		};
	}
	const scopeBaseline = device.approvedScopes ?? device.scopes;
	const preservedScopes = Array.isArray(scopeBaseline) ? mergeDevicePairingScopes(...remainingRoles.map((entry) => preserveDeviceRoleScopes(entry, scopeBaseline))) : void 0;
	const next = {
		...device,
		role: remainingRoles[0],
		roles: remainingRoles,
		...preservedScopes !== void 0 ? {
			scopes: preservedScopes,
			approvedScopes: preservedScopes
		} : {},
		tokens: Object.keys(tokens).length > 0 ? tokens : void 0
	};
	if (role === "node") {
		delete next.nodeSurface;
		delete next.pendingNodeSurface;
	}
	state.pairedByDeviceId[normalizedDeviceId] = next;
	persistDevicePairingStoreState(state, params.baseDir, "both");
	return {
		deviceId: normalizedDeviceId,
		role,
		removedDevice: false
	};
}
/** Update non-auth metadata for a paired device presence/status refresh. */
function updatePairedDeviceMetadataInWorker(deviceId, patch, nowMs, baseDir) {
	const state = loadDevicePairingStateForMutation(nowMs, baseDir);
	const normalizedDeviceId = normalizeDevicePairingId(deviceId);
	const existing = state.pairedByDeviceId[normalizedDeviceId];
	if (!existing) return false;
	const next = { ...existing };
	if ("displayName" in patch) next.displayName = patch.displayName;
	if ("operatorLabel" in patch) next.operatorLabel = patch.operatorLabel;
	if ("platform" in patch) next.platform = patch.platform;
	if ("clientId" in patch) next.clientId = patch.clientId;
	if ("clientMode" in patch) next.clientMode = patch.clientMode;
	if ("remoteIp" in patch) next.remoteIp = patch.remoteIp;
	if ("lastSeenAtMs" in patch) next.lastSeenAtMs = patch.lastSeenAtMs;
	if ("lastSeenReason" in patch) next.lastSeenReason = patch.lastSeenReason;
	state.pairedByDeviceId[normalizedDeviceId] = next;
	persistDevicePairingStoreState(state, baseDir, "paired");
	return true;
}
/** Update paired-device presence only while the authenticated node generation still owns it. */
function updatePairedDevicePresenceInWorker(deviceId, patch, expectedPairingGeneration, baseDir) {
	return updatePairedDevicePresenceInTransaction(deviceId, baseDir, (device) => {
		const currentPairingGeneration = resolveNodePairingGeneration(device);
		if (!device || expectedPairingGeneration.nodeId !== device.deviceId || currentPairingGeneration?.key !== expectedPairingGeneration.key) return {
			value: false,
			persist: false
		};
		return {
			value: true,
			persist: true,
			lastSeenAtMs: patch.lastSeenAtMs,
			lastSeenReason: patch.lastSeenReason
		};
	});
}
//#endregion
//#region src/infra/device-pairing-tokens.kernel.ts
const SHARED_GATEWAY_AUTH_ISSUER_KIND = "shared-gateway-auth";
const BROWSER_DEVICE_CLIENT_IDS = /* @__PURE__ */ new Set(["openclaw-control-ui", "webchat-ui"]);
const BROWSER_DEVICE_CLIENT_MODE = "webchat";
function getPairedDeviceFromState(state, deviceId) {
	return state.pairedByDeviceId[normalizeDevicePairingId(deviceId)] ?? null;
}
function isBrowserRelatedPairedDevice(device) {
	if (device.clientMode?.trim().toLowerCase() === BROWSER_DEVICE_CLIENT_MODE) return true;
	const clientId = device.clientId?.trim().toLowerCase();
	return clientId ? BROWSER_DEVICE_CLIENT_IDS.has(clientId) : false;
}
function deviceTokenIssuerMatches(entry, issuer) {
	if (!issuer) return !entry.issuer;
	return entry.issuer?.kind === issuer.kind && entry.issuer.generation === issuer.generation;
}
function resolveApprovedDeviceScopeBaseline(device) {
	const baseline = device.approvedScopes ?? device.scopes;
	if (!Array.isArray(baseline)) return null;
	return normalizeDeviceAuthScopes(baseline);
}
function scopesWithinApprovedDeviceBaseline(params) {
	if (!params.approvedScopes) return false;
	return roleScopesAllow({
		role: params.role,
		requestedScopes: params.scopes,
		allowedScopes: params.approvedScopes
	});
}
/** Verify a device role token, scope it to the approval baseline, and mark last use. */
function verifyDeviceTokenInWorker(params) {
	const state = loadDevicePairingStateForMutation(params.nowMs, params.baseDir);
	const device = getPairedDeviceFromState(state, params.deviceId);
	if (!device) return {
		ok: false,
		reason: "device-not-paired"
	};
	const role = normalizeDevicePairingRole(params.role);
	if (!role) return {
		ok: false,
		reason: "role-missing"
	};
	const entry = device.tokens?.[role];
	if (!entry) return {
		ok: false,
		reason: "token-missing"
	};
	if (entry.revokedAtMs) return {
		ok: false,
		reason: "token-revoked"
	};
	if (!verifyPairingToken(params.token, entry.token)) return {
		ok: false,
		reason: "token-mismatch"
	};
	if (entry.issuer?.kind === SHARED_GATEWAY_AUTH_ISSUER_KIND && entry.issuer.generation !== params.requiredSharedGatewaySessionGeneration) return {
		ok: false,
		reason: "issuer-generation-stale"
	};
	if (!entry.issuer && params.requiredSharedGatewaySessionGeneration !== void 0 && isBrowserRelatedPairedDevice(device)) return {
		ok: false,
		reason: "legacy-browser-token"
	};
	const approvedScopes = resolveApprovedDeviceScopeBaseline(device);
	if (!scopesWithinApprovedDeviceBaseline({
		role,
		scopes: entry.scopes,
		approvedScopes
	})) return {
		ok: false,
		reason: "scope-mismatch"
	};
	const requestedScopes = normalizeDeviceAuthScopes(params.scopes);
	if (!roleScopesAllow({
		role,
		requestedScopes,
		allowedScopes: entry.scopes
	})) return {
		ok: false,
		reason: "scope-mismatch"
	};
	const now = params.nowMs;
	entry.lastUsedAtMs = now;
	device.tokens ??= {};
	device.tokens[role] = entry;
	device.lastSeenAtMs = now;
	device.lastSeenReason = "device-token-auth";
	state.pairedByDeviceId[device.deviceId] = device;
	persistDevicePairingStoreState(state, params.baseDir, "paired");
	return entry.issuer ? {
		ok: true,
		issuer: entry.issuer
	} : { ok: true };
}
/** Return a reusable token for a role or issue one within the approved scope baseline. */
function ensureDeviceTokenInWorker(params) {
	const state = loadDevicePairingStateForMutation(params.nowMs, params.baseDir);
	requestDevicePairingMutationAdmission({ kind: "pairing-token-issuance" });
	const requestedScopes = normalizeDeviceAuthScopes(params.scopes);
	const context = resolveDeviceTokenUpdateContext({
		state,
		deviceId: params.deviceId,
		role: params.role
	});
	if (!context) return null;
	const { device, role, tokens, existing } = context;
	const previousNodeGeneration = resolveNodePairingGeneration(device);
	const approvedScopes = resolveApprovedDeviceScopeBaseline(device);
	if (!scopesWithinApprovedDeviceBaseline({
		role,
		scopes: requestedScopes,
		approvedScopes
	})) return null;
	if (existing && !existing.revokedAtMs) {
		const existingWithinApproved = scopesWithinApprovedDeviceBaseline({
			role,
			scopes: existing.scopes,
			approvedScopes
		});
		const issuerAllowsReuse = deviceTokenIssuerMatches(existing, params.issuer);
		if (existingWithinApproved && issuerAllowsReuse && roleScopesAllow({
			role,
			requestedScopes,
			allowedScopes: existing.scopes
		})) return existing;
	}
	const now = params.nowMs;
	const next = createDeviceAuthToken({
		role,
		scopes: requestedScopes,
		issuer: params.issuer,
		existing,
		now,
		rotatedAtMs: existing ? now : void 0
	});
	tokens[role] = next;
	device.tokens = tokens;
	clearNodePairingGenerationState(device, previousNodeGeneration);
	state.pairedByDeviceId[device.deviceId] = device;
	persistDevicePairingStoreState(state, params.baseDir, "paired");
	return next;
}
function resolveDeviceTokenUpdateContext(params) {
	const device = getPairedDeviceFromState(params.state, params.deviceId);
	if (!device) return null;
	const role = normalizeDevicePairingRole(params.role);
	if (!role) return null;
	if (!listApprovedPairedDeviceRoles(device).includes(role)) return null;
	const tokens = cloneDevicePairingTokens(device);
	return {
		device,
		role,
		tokens,
		existing: tokens[role]
	};
}
/** Rotate a role token inside the device's approved scope baseline. */
function rotateDeviceTokenInWorker(params) {
	const state = loadDevicePairingStateForMutation(params.nowMs, params.baseDir);
	const context = resolveDeviceTokenUpdateContext({
		state,
		deviceId: params.deviceId,
		role: params.role
	});
	if (!context) return {
		ok: false,
		reason: "unknown-device-or-role"
	};
	const { device, role, tokens, existing } = context;
	const previousNodeGeneration = resolveNodePairingGeneration(device);
	const requestedScopes = normalizeDeviceAuthScopes(params.scopes ?? existing?.scopes ?? device.scopes);
	const approvedScopes = resolveApprovedDeviceScopeBaseline(device);
	if (!approvedScopes) return {
		ok: false,
		reason: "missing-approved-scope-baseline"
	};
	if (!scopesWithinApprovedDeviceBaseline({
		role,
		scopes: requestedScopes,
		approvedScopes
	})) return {
		ok: false,
		reason: "scope-outside-approved-baseline"
	};
	if (params.callerScopes) {
		const missingScope = resolveMissingRequestedScope({
			role,
			requestedScopes,
			allowedScopes: params.callerScopes
		});
		if (missingScope) return {
			ok: false,
			reason: "caller-missing-scope",
			scope: missingScope
		};
	}
	const now = params.nowMs;
	const next = createDeviceAuthToken({
		role,
		scopes: requestedScopes,
		existing,
		preserveExistingIssuer: true,
		now,
		rotatedAtMs: now
	});
	tokens[role] = next;
	device.tokens = tokens;
	clearNodePairingGenerationState(device, previousNodeGeneration);
	state.pairedByDeviceId[device.deviceId] = device;
	const retiredNodeToken = role === "node" && params.scopes !== void 0 && requestedScopes.length === 0 && existing && !scopesWithinApprovedDeviceBaseline({
		role,
		scopes: existing.scopes,
		approvedScopes
	}) ? {
		deviceId: device.deviceId,
		expectedToken: existing.token
	} : void 0;
	persistDevicePairingStoreState(state, params.baseDir, "paired", { retiredNodeToken });
	return {
		ok: true,
		entry: next
	};
}
/** Revoke one active role token after optional caller-scope authorization. */
function revokeDeviceTokenInWorker(params) {
	const state = loadDevicePairingStateForMutation(params.nowMs, params.baseDir);
	const context = resolveDeviceTokenUpdateContext({
		state,
		deviceId: params.deviceId,
		role: params.role
	});
	if (!context || !context.existing) return {
		ok: false,
		reason: "unknown-device-or-role"
	};
	const { device, role, tokens, existing } = context;
	const previousNodeGeneration = resolveNodePairingGeneration(device);
	const targetScopes = normalizeDeviceAuthScopes(Array.isArray(existing.scopes) ? existing.scopes : device.scopes);
	if (params.callerScopes) {
		const missingScope = resolveMissingRequestedScope({
			role,
			requestedScopes: targetScopes,
			allowedScopes: params.callerScopes
		});
		if (missingScope) return {
			ok: false,
			reason: "caller-missing-scope",
			scope: missingScope
		};
	}
	const entry = {
		...existing,
		revokedAtMs: params.nowMs
	};
	tokens[role] = entry;
	device.tokens = tokens;
	clearNodePairingGenerationState(device, previousNodeGeneration);
	state.pairedByDeviceId[device.deviceId] = device;
	persistDevicePairingStoreState(state, params.baseDir, "paired");
	return {
		ok: true,
		entry
	};
}
//#endregion
//#region src/infra/device-pairing-core.worker.ts
function executeDevicePairingCoreMutation(command, database) {
	switch (command.type) {
		case "devicePairing.request": return requestDevicePairingInWorker(command.input.request, command.input.nowMs);
		case "devicePairing.reject": return rejectDevicePairingInWorker(database, command.input.requestId, command.input.nowMs);
		case "devicePairing.remove": return removePairedDeviceInWorker(command.input.deviceId, command.input.nowMs);
		case "devicePairing.pruneSilent": return pruneSupersededSilentPairedDevicesInWorker(command.input);
		case "devicePairing.removeRole": return removePairedDeviceRoleInWorker(command.input);
		case "devicePairing.updateMetadata": return updatePairedDeviceMetadataInWorker(command.input.deviceId, command.input.patch, command.input.nowMs);
		case "devicePairing.updatePresence": return updatePairedDevicePresenceInWorker(command.input.deviceId, command.input.patch, command.input.expectedPairingGeneration);
		case "devicePairing.approve": return approveDevicePairingInWorker(command.input.requestId, command.input.options, command.input.nowMs);
		case "devicePairing.approveBootstrap": return approveBootstrapDevicePairingInWorker(command.input.requestId, command.input.bootstrapProfile, { accessMetadata: command.input.accessMetadata }, command.input.nowMs);
		case "devicePairing.verifyToken": return verifyDeviceTokenInWorker(command.input);
		case "devicePairing.ensureToken": return ensureDeviceTokenInWorker(command.input);
		case "devicePairing.rotateToken": return rotateDeviceTokenInWorker(command.input);
		case "devicePairing.revokeToken": return revokeDeviceTokenInWorker(command.input);
	}
	throw new Error("Unsupported device pairing mutation");
}
//#endregion
//#region src/infra/device-pairing-node.worker.ts
function mutatePairedDevices(database, operate) {
	const state = readDevicePairingStoreStateFromDatabase(database.db);
	const result = operate(state.pairedByDeviceId);
	if (result.persist) persistDevicePairingStoreState(state, void 0, "paired");
	return result.value;
}
/** Root pairing admission holds the exact database transaction through all row decisions. */
function executeDevicePairingNodeMutation(command, database) {
	switch (command.type) {
		case "node.request": {
			const { req, nowMs } = command.input;
			const nodeId = req.nodeId.trim();
			if (!nodeId) throw new Error("nodeId required");
			return mutatePairedDevices(database, (paired) => {
				const device = paired[nodeId];
				if (!device) throw new Error("node pairing requires a paired device");
				requestDevicePairingMutationAdmission({
					kind: "node-surface",
					nodeId
				});
				const existing = device.pendingNodeSurface;
				if (existing && samePendingApprovalSurface(existing, {
					...req,
					nodeId
				})) {
					const refreshed = refreshPendingNodeSurface(existing, req, nowMs);
					device.pendingNodeSurface = refreshed;
					return {
						value: {
							status: "pending",
							request: toPublicPendingRequest(device, refreshed),
							created: false
						},
						persist: true
					};
				}
				const replacement = buildPendingNodeSurface({
					req: {
						...req,
						nodeId
					},
					nowMs
				});
				device.pendingNodeSurface = replacement;
				const superseded = existing ? [{
					requestId: existing.requestId,
					nodeId
				}] : [];
				return {
					value: {
						status: "pending",
						request: toPublicPendingRequest(device, replacement),
						created: true,
						...superseded.length > 0 ? { superseded } : {}
					},
					persist: true
				};
			});
		}
		case "node.finalizeCleanup": {
			const { observed } = command.input;
			return mutatePairedDevices(database, (paired) => {
				const device = paired[observed.nodeId.trim()];
				const pending = device?.pendingNodeSurface;
				if (!device || !pending || observed.requestId !== pending.requestId || observed.revision !== pending.revision) return {
					value: [],
					persist: false
				};
				requestDevicePairingMutationAdmission({
					kind: "node-pending",
					...toPendingSnapshot(device, pending)
				});
				delete device.pendingNodeSurface;
				return {
					value: [{
						requestId: pending.requestId,
						nodeId: device.deviceId
					}],
					persist: true
				};
			});
		}
		case "node.approve": {
			const { requestId, callerScopes, nowMs } = command.input;
			return mutatePairedDevices(database, (paired) => {
				const device = Object.values(paired).find((entry) => entry.pendingNodeSurface?.requestId === requestId);
				const pending = device?.pendingNodeSurface;
				if (!device || !pending) return {
					value: null,
					persist: false
				};
				requestDevicePairingMutationAdmission({
					kind: "node-pending",
					...toPendingSnapshot(device, pending)
				});
				const missingScope = resolveMissingRequestedScope({
					role: "operator",
					requestedScopes: resolveNodePairApprovalScopes(pending.commands ?? []),
					allowedScopes: callerScopes ?? []
				});
				if (missingScope) return {
					value: {
						status: "forbidden",
						missingScope
					},
					persist: false
				};
				const previousPairingGeneration = resolveNodePairingGeneration(device);
				const now = Math.max(nowMs, (device.nodeSurface?.approvedAtMs ?? -1) + 1);
				device.nodeSurface = {
					displayName: device.nodeSurface?.displayName ?? pending.displayName,
					version: pending.version,
					coreVersion: pending.coreVersion,
					uiVersion: pending.uiVersion,
					modelIdentifier: pending.modelIdentifier,
					caps: pending.caps,
					commands: pending.commands,
					permissions: pending.permissions,
					bins: device.nodeSurface?.bins,
					createdAtMs: device.nodeSurface?.createdAtMs ?? now,
					approvedAtMs: now,
					lastConnectedAtMs: device.nodeSurface?.lastConnectedAtMs,
					lastHostStats: device.nodeSurface?.lastHostStats
				};
				delete device.pendingNodeSurface;
				const nextPairingState = resolveNodePairingState(device);
				const nextPairingGeneration = nextPairingState?.generation?.key;
				if (!nextPairingState || !nextPairingGeneration) return {
					value: null,
					persist: false
				};
				clearNodePairingGenerationState(device, previousPairingGeneration);
				const node = toPairedNode(device);
				return node ? {
					value: {
						requestId,
						node,
						pairingIdentity: nextPairingState.identity.key,
						nextPairingGeneration,
						...previousPairingGeneration ? { previousPairingGeneration: previousPairingGeneration.key } : {}
					},
					persist: true
				} : {
					value: null,
					persist: false
				};
			});
		}
		case "node.reject": {
			const { requestId } = command.input;
			return mutatePairedDevices(database, (paired) => {
				const device = Object.values(paired).find((entry) => entry.pendingNodeSurface?.requestId === requestId);
				const pending = device?.pendingNodeSurface;
				if (!device || !pending) return {
					value: null,
					persist: false
				};
				requestDevicePairingMutationAdmission({
					kind: "node-pending",
					...toPendingSnapshot(device, pending)
				});
				delete device.pendingNodeSurface;
				return {
					value: {
						requestId,
						nodeId: device.deviceId
					},
					persist: true
				};
			});
		}
		case "node.rename": {
			const displayName = command.input.displayName.trim();
			if (!displayName) throw new Error("displayName required");
			return mutatePairedDevices(database, (paired) => {
				const device = paired[command.input.nodeId.trim()];
				if (!device?.nodeSurface) return {
					value: null,
					persist: false
				};
				requestDevicePairingMutationAdmission({
					kind: "node-surface",
					nodeId: device.deviceId,
					pairingGeneration: resolveNodePairingGeneration(device)?.key
				});
				device.nodeSurface = {
					...device.nodeSurface,
					displayName
				};
				return {
					value: toPairedNode(device),
					persist: true
				};
			});
		}
		case "node.recordConnection": {
			const { nodeId, connectedAtMs, expectedPairingGeneration } = command.input;
			return updatePairedDeviceNodeSurfaceInTransaction(nodeId, void 0, (device) => {
				if (!device?.nodeSurface || expectedPairingGeneration && (expectedPairingGeneration.nodeId !== device.deviceId || resolveNodePairingGeneration(device)?.key !== expectedPairingGeneration.key)) return {
					value: { recorded: false },
					persist: false
				};
				requestDevicePairingMutationAdmission({
					kind: "node-surface",
					nodeId: device.deviceId,
					pairingGeneration: resolveNodePairingGeneration(device)?.key
				});
				const firstConnection = device.nodeSurface.lastConnectedAtMs === void 0;
				const lastConnectedAtMs = Math.max(device.nodeSurface.lastConnectedAtMs ?? connectedAtMs, connectedAtMs);
				const clearsDisconnect = device.nodeSurface.lastDisconnectedAtMs !== void 0 && connectedAtMs > device.nodeSurface.lastDisconnectedAtMs;
				return {
					value: {
						recorded: true,
						firstConnection
					},
					persist: true,
					nodeSurface: {
						...device.nodeSurface,
						lastConnectedAtMs,
						...clearsDisconnect ? { lastDisconnectedAtMs: void 0 } : {}
					}
				};
			});
		}
		default: {
			const { nodeId, expectedPairingGeneration } = command.input;
			return updatePairedDeviceNodeSurfaceInTransaction(nodeId, void 0, (device) => {
				const surface = device?.nodeSurface;
				if (!device || !surface || expectedPairingGeneration.nodeId !== device.deviceId || resolveNodePairingGeneration(device)?.key !== expectedPairingGeneration.key) return {
					value: false,
					persist: false
				};
				if (command.type === "node.recordDisconnection" && (surface.lastConnectedAtMs !== command.input.connectedAtMs || command.input.disconnectedAtMs < command.input.connectedAtMs)) return {
					value: false,
					persist: false
				};
				requestDevicePairingMutationAdmission({
					kind: "node-surface",
					nodeId: device.deviceId,
					pairingGeneration: expectedPairingGeneration.key
				});
				switch (command.type) {
					case "node.recordDisconnection": return {
						value: true,
						persist: true,
						nodeSurface: {
							...surface,
							lastDisconnectedAtMs: Math.max(surface.lastDisconnectedAtMs ?? command.input.disconnectedAtMs, command.input.disconnectedAtMs)
						}
					};
					case "node.recordHostStats": return {
						value: true,
						persist: true,
						nodeSurface: {
							...surface,
							lastHostStats: command.input.hostStats
						}
					};
					case "node.updateBins": return {
						value: true,
						persist: true,
						nodeSurface: {
							...surface,
							bins: command.input.bins
						}
					};
					case "node.updateSessionHost": return {
						value: true,
						persist: true,
						nodeSurface: {
							...surface,
							sessionHost: command.input.sessionHost
						}
					};
				}
				throw new Error("Unsupported paired node surface mutation");
			});
		}
	}
}
//#endregion
//#region src/infra/device-pairing-dispatch.worker.ts
function execute(command, database, recordTokenReplacement, recordWorkerEnvironment) {
	switch (command.type) {
		case "devicePairing.request":
		case "devicePairing.reject":
		case "devicePairing.remove":
		case "devicePairing.pruneSilent":
		case "devicePairing.removeRole":
		case "devicePairing.updateMetadata":
		case "devicePairing.updatePresence":
		case "devicePairing.approve":
		case "devicePairing.verifyToken":
		case "devicePairing.ensureToken":
		case "devicePairing.rotateToken":
		case "devicePairing.revokeToken": return executeDevicePairingCoreMutation(command, database);
		case "devicePairing.approveBootstrap": {
			const result = executeDevicePairingCoreMutation(command, database);
			if (result.result?.status === "approved" && result.replacedRoles.length > 0) recordTokenReplacement({
				deviceId: result.result.device.deviceId,
				roles: result.replacedRoles
			});
			return result;
		}
		case "node.request":
		case "node.finalizeCleanup":
		case "node.approve":
		case "node.reject":
		case "node.recordConnection":
		case "node.recordDisconnection":
		case "node.recordHostStats":
		case "node.updateBins":
		case "node.updateSessionHost":
		case "node.rename": return executeDevicePairingNodeMutation(command, database);
		default: return executeDeviceBootstrapMutation(command, database, recordWorkerEnvironment);
	}
}
function executeDevicePairingMutationInWorker(command, database) {
	return runOpenClawStateWriteTransaction(() => withDevicePairingStoreDatabase(database, () => withDevicePairingMutationAdmission(() => {
		const before = readDevicePairingStoreStateFromDatabase(database.db).pairedByDeviceId;
		let tokensReplaced;
		let workerEnvironment;
		const result = execute(command, database, (facts) => {
			tokensReplaced = facts;
		}, (facts) => {
			workerEnvironment = facts;
		});
		const after = readDevicePairingStoreStateFromDatabase(database.db).pairedByDeviceId;
		const changed = [];
		for (const deviceId of /* @__PURE__ */ new Set([...Object.keys(before), ...Object.keys(after)])) if (JSON.stringify(before[deviceId]) !== JSON.stringify(after[deviceId])) changed.push(prepareDevicePairingBinding(deviceId, after[deviceId] ?? null));
		deferSqliteWorkerCommitReceipt(database.db, {
			kind: "devicePairing",
			beforeRevision: resolveDevicePairingStoreRevision(before),
			revision: resolveDevicePairingStoreRevision(after),
			changed,
			...tokensReplaced ? { tokensReplaced } : {},
			...workerEnvironment ? { workerEnvironment } : {}
		});
		return result;
	})), {
		database,
		env: getSqliteWorkerStateContext().environment
	});
}
//#endregion
//#region src/infra/device-pairing-worker-contract.ts
function isDevicePairingMutationCommand(command) {
	return command.type.startsWith("devicePairing.") || command.type.startsWith("node.") || command.type.startsWith("bootstrap.");
}
//#endregion
//#region src/infra/exec-approvals-authorization.worker.ts
function applyAuthorizationBatch(db, initial, items) {
	let current = initial;
	const outcomes = items.map((item) => {
		let next;
		try {
			next = applyExecAuthorizationCommit(structuredClone(current.file), item);
		} catch (error) {
			return {
				ok: false,
				message: error instanceof Error ? error.message : String(error)
			};
		}
		if (next !== null) {
			try {
				assertExecApprovalsMutationAllowed({
					db,
					current: current.file,
					next
				});
			} catch (error) {
				if (!(error instanceof ExecApprovalsMutationFencedError)) throw error;
				return {
					ok: false,
					message: error.message
				};
			}
			const raw = serializeExecApprovals(next);
			if (!current.exists || current.raw !== raw) current = snapshotFromExecApprovalsRow({
				path: current.path,
				row: { raw_json: raw }
			});
		}
		return {
			ok: true,
			snapshot: current
		};
	});
	return {
		snapshot: current,
		outcomes
	};
}
function commitExecAuthorizationsInWorker(input, options) {
	assertNoPendingLegacyExecApprovals({ env: options.env });
	const database = openOpenClawStateDatabase(options);
	const read = () => snapshotFromExecApprovalsDatabase(database.db, resolveExecApprovalsDisplayPath(options.env));
	const initial = read();
	const prepared = applyAuthorizationBatch(database.db, initial, input.items);
	if (prepared.snapshot.raw === initial.raw) return prepared.outcomes;
	return runOpenClawStateWriteTransaction(({ db }) => {
		const current = read();
		const committed = applyAuthorizationBatch(db, current, input.items);
		if (committed.snapshot.raw !== current.raw) writeExecApprovalsConfigRow({
			db,
			file: committed.snapshot.file,
			raw: committed.snapshot.raw ?? void 0
		});
		return committed.outcomes;
	}, {
		...options,
		database
	}, { operationLabel: "exec-approvals.commit-authorizations" });
}
//#endregion
//#region src/infra/outbound/current-conversation-bindings.worker.ts
/** Worker-local reads cannot inherit the host's retained discovery snapshot. */
function readCurrentConversationBindingSelectionInWorker(conversations, databasePath) {
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => readCurrentConversationBindingSelectionInDatabase(db, conversations), {
		path: databasePath,
		env: getSqliteWorkerStateContext().environment
	}) ?? conversations.map(() => null);
}
/** The caller holds the shared-state write transaction and current host admission. */
function touchCurrentConversationBindingInDatabase(db, input) {
	const conversation = input.conversation;
	return updateCurrentConversationBindingRecordInDatabase(db, conversation, (current) => {
		if (current?.bindingId !== input.bindingId) return current;
		if (!input.accountPolicy) return {
			...current,
			metadata: {
				...current.metadata,
				lastActivityAt: input.at
			}
		};
		const { idleTimeoutMs, maxAgeMs } = input.accountPolicy;
		const idleExpiresAt = idleTimeoutMs > 0 ? input.at + idleTimeoutMs : void 0;
		const maxAgeExpiresAt = maxAgeMs > 0 ? current.boundAt + maxAgeMs : void 0;
		return {
			bindingId: `${conversation.accountId}:${conversation.conversationId}`,
			targetSessionKey: current.targetSessionKey,
			targetKind: input.accountPolicy.targetKinds[current.targetKind],
			conversation,
			status: "active",
			boundAt: current.boundAt,
			expiresAt: idleExpiresAt != null && maxAgeExpiresAt != null ? Math.min(idleExpiresAt, maxAgeExpiresAt) : idleExpiresAt ?? maxAgeExpiresAt,
			metadata: {
				...current.metadata,
				agentId: typeof current.metadata?.agentId === "string" ? current.metadata.agentId : void 0,
				label: typeof current.metadata?.label === "string" ? current.metadata.label : void 0,
				boundBy: typeof current.metadata?.boundBy === "string" ? current.metadata.boundBy : void 0,
				lastActivityAt: input.at,
				idleTimeoutMs,
				maxAgeMs
			}
		};
	}).current;
}
function executeCurrentConversationBindingCommand(command, options) {
	if (command.type === "conversationBindings.resolve") {
		const result = readCurrentConversationBindingResolutionInDatabase(options.database.db, command.input);
		if (!result.repair) return result.record;
	}
	return runOpenClawStateWriteTransaction(({ db }) => {
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: void 0
		});
		const result = command.type === "conversationBindings.resolve" ? updateCurrentConversationBindingRecordInDatabase(db, command.input, (current) => current).current : touchCurrentConversationBindingInDatabase(db, command.input);
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: void 0
		});
		return result;
	}, options);
}
//#endregion
//#region src/infra/promotions-feed.kernel.ts
const PROMOTIONS_FEED_STATE_KEY = "clawhub.promotionsFeed";
function markPromotionSlugsNotifiedInDatabase(database, incoming, now) {
	updateConfigMachineStateInDatabase(database, PROMOTIONS_FEED_STATE_KEY, (existing) => ({
		etag: existing?.etag ?? null,
		sequence: existing?.sequence ?? null,
		payloadJson: existing?.payloadJson ?? null,
		lastCheckedAtMs: existing?.lastCheckedAtMs ?? null,
		notifiedSlugs: [.../* @__PURE__ */ new Set([...existing?.notifiedSlugs ?? [], ...incoming])].toSorted()
	}), now);
}
function recordPromotionClaimInDatabase(database, record) {
	const db = getNodeSqliteKysely(database);
	const values = {
		slug: record.slug,
		provider: record.provider,
		model_keys_json: record.modelKeysJson,
		ends_at_ms: record.endsAtMs,
		claimed_at_ms: record.claimedAtMs
	};
	executeSqliteQuerySync(database, db.insertInto("clawhub_promotion_claims").values(values).onConflict((conflict) => conflict.column("slug").doUpdateSet(values)));
}
//#endregion
//#region src/infra/promotions-feed.worker.ts
function executePromotionCommand(command, options, openDatabase) {
	if (command.type === "promotions.markNotified") {
		const stored = readConfigMachineState(PROMOTIONS_FEED_STATE_KEY, options);
		const known = new Set(stored?.notifiedSlugs ?? []);
		const incoming = command.input.slugs.filter((slug) => !known.has(slug));
		if (incoming.length > 0) runOpenClawStateWriteTransaction(({ db }) => markPromotionSlugsNotifiedInDatabase(db, incoming, command.input.now), {
			...options,
			database: openDatabase()
		}, { operationLabel: "config-machine-state.update" });
		return true;
	}
	return runOpenClawStateWriteTransaction(({ db }) => recordPromotionClaimInDatabase(db, command.input), {
		...options,
		database: openDatabase()
	});
}
//#endregion
//#region src/infra/push-apns-store.worker-contract.ts
function isApnsRegistrationWorkerCommand(command) {
	return command.type === "apns.registration.register" || command.type === "apns.registration.read" || command.type === "apns.registrations.read";
}
//#endregion
//#region src/infra/push-apns-store.worker.ts
function registerApnsRegistrationInDatabase(database, input) {
	const { candidate } = input;
	const { nodeId } = candidate;
	return runOpenClawStateWriteTransaction(({ db }) => {
		if (input.expectedPairingGeneration) {
			if (resolveNodePairingGeneration(loadPairedDevicePairingStoreRecordFromDatabase(db, nodeId))?.key !== input.expectedPairingGeneration) return { status: "pairing-changed" };
		}
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: void 0
		});
		const stateDb = getNodeSqliteKysely(db);
		const current = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("apns_registrations").select("updated_at_ms").where("node_id", "=", nodeId));
		const tombstone = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("apns_registration_tombstones").select("deleted_at_ms").where("node_id", "=", nodeId));
		const previousVersions = [current?.updated_at_ms, tombstone?.deleted_at_ms].filter((version) => version !== void 0);
		const next = {
			...candidate,
			updatedAtMs: nextApnsRegistrationVersion(nodeId, previousVersions, input.nowMs)
		};
		const row = apnsRegistrationToRow(next);
		const { token, relay_handle, send_grant, installation_id, relay_origin, distribution, token_debug_suffix } = row;
		executeSqliteQuerySync(db, stateDb.insertInto("apns_registrations").values(row).onConflict((conflict) => conflict.column("node_id").doUpdateSet({
			transport: row.transport,
			token,
			relay_handle,
			send_grant,
			installation_id,
			relay_origin,
			topic: row.topic,
			environment: row.environment,
			distribution,
			token_debug_suffix,
			updated_at_ms: row.updated_at_ms
		})));
		executeSqliteQuerySync(db, stateDb.deleteFrom("apns_registration_tombstones").where("node_id", "=", nodeId));
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: void 0
		});
		return {
			status: "registered",
			registration: next
		};
	}, {
		database,
		path: database.path,
		env: getSqliteWorkerStateContext().environment
	});
}
function executeApnsRegistrationCommand(command, database) {
	switch (command.type) {
		case "apns.registration.register": return registerApnsRegistrationInDatabase(database, command.input);
		case "apns.registration.read": return readApnsRegistrationFromDatabase(database.db, command.input);
		case "apns.registrations.read": return readApnsRegistrationsFromDatabase(database.db, command.input);
	}
	throw new Error("Unsupported APNs registration command");
}
//#endregion
//#region src/infra/push-web-store.worker.ts
function executeWebPushCommand(command, database) {
	switch (command.type) {
		case "webPush.findBoundWebPushSubscriptionByEndpoint": return findBoundWebPushSubscriptionByEndpointInDatabase({
			...command.input,
			database
		});
		case "webPush.setWebPushSubscriptionPreferences": return setWebPushSubscriptionPreferencesInDatabase({
			...command.input,
			database
		});
		case "webPush.listWebPushSubscriptions": return listWebPushSubscriptionsInDatabase(database);
		case "webPush.hasBoundWebPushSubscriptions": return hasBoundWebPushSubscriptionsInDatabase(database);
		case "webPush.listBoundWebPushSubscriptions": return listBoundWebPushSubscriptionsInDatabase(database);
		case "webPush.prepareWebPushApprovalDeliveries": return prepareWebPushApprovalDeliveriesInDatabase({
			...command.input,
			database
		});
		case "webPush.listWebPushApprovalDeliveryTargets": return listWebPushApprovalDeliveryTargetsInDatabase({
			...command.input,
			database
		});
		case "webPush.deleteWebPushApprovalDeliveryTargets": return deleteWebPushApprovalDeliveryTargetsInDatabase({
			...command.input,
			database
		});
		case "webPush.listTerminalWebPushApprovalDeliveryIds": return listTerminalWebPushApprovalDeliveryIdsInDatabase({
			...command.input,
			database
		});
		case "webPush.upsertWebPushSubscription": try {
			return { subscription: upsertWebPushSubscriptionInDatabase({
				...command.input,
				database
			}) };
		} catch (error) {
			if (error instanceof WebPushSubscriptionBindingError) return { bindingError: error.message };
			throw error;
		}
		case "webPush.deleteBoundWebPushSubscription": return deleteBoundWebPushSubscriptionInDatabase({
			...command.input,
			database
		});
		case "webPush.deleteWebPushSubscriptionIfCurrent": return deleteWebPushSubscriptionIfCurrentInDatabase({
			...command.input,
			database
		});
		case "webPush.insertVapidKeyPairIfAbsent": return insertVapidKeyPairIfAbsentInDatabase({
			...command.input,
			database
		});
	}
}
//#endregion
//#region src/infra/session-delivery-queue.worker-contract.ts
function isSessionDeliveryCommand(command) {
	return command.type === "sessionDelivery.enqueue" || command.type === "sessionDelivery.enqueueClaimed" || command.type === "sessionDelivery.releaseClaim" || command.type === "sessionDelivery.defer" || command.type === "sessionDelivery.advanceAgentRun" || command.type === "sessionDelivery.mergePreparedMedia" || command.type === "sessionDelivery.markAttemptStarted" || command.type === "sessionDelivery.markSettlement" || command.type === "sessionDelivery.complete" || command.type === "sessionDelivery.fail" || command.type === "sessionDelivery.load" || command.type === "sessionDelivery.list" || command.type === "sessionDelivery.moveToFailed";
}
//#endregion
//#region src/infra/session-delivery-queue.worker.ts
function readSessionDelivery(database, id) {
	return loadDeliveryQueueEntryInDatabase(database, SESSION_DELIVERY_QUEUE_NAME, id, "pending");
}
function executeSessionDeliveryCommand(command, database) {
	const readStatus = (id) => getDeliveryQueueEntryOwnersInDatabase(database, [SESSION_DELIVERY_QUEUE_NAME], id).get(SESSION_DELIVERY_QUEUE_NAME)?.status;
	const update = (id, transform) => updateDeliveryQueueEntryInDatabase(database, SESSION_DELIVERY_QUEUE_NAME, id, (entry) => transform(entry));
	switch (command.type) {
		case "sessionDelivery.enqueue":
			upsertBoundDeliveryQueueEntryInDatabase(command.input, database);
			return;
		case "sessionDelivery.enqueueClaimed": {
			const id = command.input.row.id;
			const claimed = upsertBoundDeliveryQueueEntryInDatabase(command.input, database);
			try {
				return {
					id,
					claimed,
					status: claimed ? "pending" : readStatus(id) ?? "completed"
				};
			} catch {
				return {
					id,
					claimed,
					status: "unknown"
				};
			}
		}
		case "sessionDelivery.releaseClaim":
			update(command.input.id, (entry) => ({
				...entry,
				availableAt: Date.now()
			}));
			return;
		case "sessionDelivery.defer": {
			const { id, delayMs } = command.input;
			update(id, (entry) => ({
				...entry,
				availableAt: Date.now() + Math.max(0, delayMs)
			}));
			return;
		}
		case "sessionDelivery.advanceAgentRun": {
			const { id, updates } = command.input;
			update(id, (entry) => entry.kind !== "agentTurn" ? entry : {
				...entry,
				agentRunAttempt: (entry.agentRunAttempt ?? 0) + 1,
				deliveryStartedAt: void 0,
				...updates?.message ? { message: updates.message } : {},
				...updates?.expectedMediaUrls ? { expectedMediaUrls: updates.expectedMediaUrls } : {},
				...updates?.suppressTextDelivery === true ? { suppressTextDelivery: true } : {}
			});
			return;
		}
		case "sessionDelivery.mergePreparedMedia": {
			const { id, mediaUrl, blocksJson } = command.input;
			let result = { source: "input" };
			update(id, (entry) => {
				if (entry.kind !== "agentTurn") return entry;
				const stored = entry.preparedMediaBlocks?.[mediaUrl];
				const blocks = stored ?? JSON.parse(blocksJson);
				if (stored != null) result = {
					source: "stored",
					blocks: stored
				};
				return {
					...entry,
					preparedMediaBlocks: {
						...entry.preparedMediaBlocks,
						[mediaUrl]: blocks
					}
				};
			});
			return result;
		}
		case "sessionDelivery.markAttemptStarted":
			if (!upsertBoundDeliveryQueueEntryInDatabase(command.input, database)) throw new Error(`Session delivery ${command.input.row.id} is no longer pending`);
			return;
		case "sessionDelivery.markSettlement": {
			const id = command.input.row.id;
			try {
				if (upsertBoundDeliveryQueueEntryInDatabase(command.input, database) || readStatus(id) === "completed") return;
				throw new Error(`Session delivery ${id} is no longer pending`);
			} catch (error) {
				try {
					if (readStatus(id) === "completed") return;
				} catch {}
				throw error;
			}
		}
		case "sessionDelivery.complete": {
			const { id } = command.input;
			try {
				completeDeliveryQueueEntryInDatabase(database, SESSION_DELIVERY_QUEUE_NAME, id);
			} catch (error) {
				try {
					if (readStatus(id) === "completed") return;
				} catch {}
				throw error;
			}
			return;
		}
		case "sessionDelivery.fail": {
			const { id, error, releaseAttemptOwnership } = command.input;
			update(id, (entry) => {
				const retryCount = entry.retryCount + 1;
				const now = Date.now();
				return {
					...entry,
					retryCount,
					...entry.kind === "agentTurn" ? { lastChargedAgentRunAttempt: entry.agentRunAttempt ?? 0 } : {},
					...releaseAttemptOwnership === true ? { deliveryStartedAt: void 0 } : {},
					lastAttemptAt: now,
					...entry.kind === "agentTurn" && entry.owner?.kind === "subagent_completion" ? { availableAt: now + computeBackoff({
						initialMs: 15e3,
						factor: 2,
						maxMs: 3e5,
						jitter: .2
					}, retryCount) } : {},
					lastError: error
				};
			});
			return;
		}
		case "sessionDelivery.load": return readSessionDelivery(database, command.input.id);
		case "sessionDelivery.list": return loadDeliveryQueueEntriesInDatabase(database, SESSION_DELIVERY_QUEUE_NAME);
		case "sessionDelivery.moveToFailed": {
			const { id } = command.input;
			try {
				const entry = readSessionDelivery(database, id);
				if (!entry) throw deliveryQueueEntryNotFoundError(SESSION_DELIVERY_QUEUE_NAME, id);
				if (terminalizePendingDeliveryQueueEntryInDatabase(database, prepareDeliveryQueueTerminalEntry({
					queueName: "session",
					id,
					entry
				})).status !== "terminalized") throw deliveryQueueEntryNotFoundError(SESSION_DELIVERY_QUEUE_NAME, id);
			} catch (error) {
				try {
					if (readStatus(id) === "failed") return;
				} catch {}
				throw error;
			}
		}
	}
}
//#endregion
//#region src/infra/telemetry-store.kernel.ts
const TELEMETRY_STATE_KEY = "telemetry.updateCheck";
function readTelemetryStateInWorker(options) {
	const state = readConfigMachineState(TELEMETRY_STATE_KEY, options);
	return state && isRecord(state) ? state : {};
}
function countRecentTelemetrySessionsInDatabase(database, sinceMs) {
	const db = getNodeSqliteKysely(database);
	return executeSqliteQueryTakeFirstSync(database, db.selectFrom("session_state_events").select((builder) => builder.fn.countAll().as("count")).where("kind", "=", "created").where("occurred_at", ">=", sinceMs))?.count ?? 0;
}
function persistTelemetrySuccessInDatabase(database, state, updatedAtMs) {
	return updateConfigMachineStateInDatabase(database, TELEMETRY_STATE_KEY, (current) => current?.lastPingAt !== void 0 && current.lastPingAt >= state.lastPingAt ? current : state, updatedAtMs);
}
//#endregion
//#region src/node-host/node-worker-journal.worker-contract.ts
function isNodeWorkerJournalCommand(command) {
	return Object.hasOwn(nodeWorkerJournalCommands, command.type);
}
const nodeWorkerJournalCommands = {
	"nodeWorker.launch.claimObservation": true,
	"nodeWorker.launch.claim": true,
	"nodeWorker.launch.listNonterminal": true,
	"nodeWorker.launch.nonterminalCount": true,
	"nodeWorker.launch.pruneExpiredTerminal": true,
	"nodeWorker.launch.get": true,
	"nodeWorker.launch.getMatching": true,
	"nodeWorker.launch.cleanupBinding": true,
	"nodeWorker.launch.finishCancelled": true,
	"nodeWorker.launch.markRunning": true,
	"nodeWorker.launch.finish": true,
	"nodeWorker.turn.claim": true,
	"nodeWorker.turn.get": true,
	"nodeWorker.turn.finish": true
};
//#endregion
//#region src/node-host/node-worker-turn-store.kernel.ts
const initializedDatabases = /* @__PURE__ */ new WeakSet();
const TERMINAL_RECEIPT_RETENTION_MS = 864e5;
const TERMINAL_PRUNE_BATCH_LIMIT = 256;
function query(database) {
	return getNodeSqliteKysely(database);
}
function ensureTurnSchema(database) {
	database.exec(extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL, "node_worker_turns", {
		endMarker: "\n  WHERE state = 'running';",
		errorMessage: "OpenClaw node worker turn schema marker is missing."
	}));
}
function readRow(database, turnId) {
	return executeSqliteQueryTakeFirstSync(database, query(database).selectFrom("node_worker_turns").selectAll().where("turn_id", "=", turnId));
}
function readReceipt(database, turnId) {
	let turn = readRow(database, turnId);
	if (!turn) return;
	const owner = readNodeWorkerLaunchReceipt(database, turn.owner_launch_id);
	if (!owner) throw new Error(`node worker turn ${turnId} has no physical owner`);
	if (turn.state === "running" && owner.state !== "pending" && owner.state !== "running") {
		settleNodeWorkerActiveTurns(database, owner);
		turn = readRow(database, turnId);
	}
	return turnReceiptFromRow(turn, owner);
}
function turnReceiptFromRow(turn, owner) {
	const state = turn.state === "running" && owner.state === "pending" ? "pending" : turn.state;
	if (state !== "pending" && state !== "running" && !isNodeWorkerTerminalState(state)) throw new Error(`invalid node worker turn state ${state}`);
	return {
		...owner,
		ownerLaunchId: turn.owner_launch_id,
		launchId: turn.turn_id,
		planHash: turn.plan_hash,
		runId: turn.run_id,
		state,
		resultJson: turn.result_json,
		errorText: turn.error_text,
		completedAtMs: turn.completed_at_ms,
		createdAtMs: turn.created_at_ms,
		updatedAtMs: turn.updated_at_ms
	};
}
function matchesProcess(receipt, supervisor, worker) {
	return receipt.supervisor.pid === supervisor.pid && receipt.supervisor.startTime === supervisor.startTime && receipt.worker?.pid === worker?.pid && receipt.worker?.startTime === worker?.startTime;
}
function pruneTerminal(database, nowMs, excludeTurnId) {
	executeSqliteQuerySync(database, query(database).deleteFrom("node_worker_turns").where("turn_id", "in", query(database).selectFrom("node_worker_turns").select("turn_id").where("completed_at_ms", "<=", Math.max(0, nowMs - TERMINAL_RECEIPT_RETENTION_MS)).where("turn_id", "!=", excludeTurnId).orderBy("completed_at_ms", "asc").orderBy("turn_id", "asc").limit(TERMINAL_PRUNE_BATCH_LIMIT)));
}
/** Immutable turn outcomes attached to a separately supervised physical worker. */
var NodeWorkerTurnKernel = class {
	constructor(options) {
		this.databaseOptions = options;
	}
	write(operationLabel, operation) {
		let initialized;
		const result = runOpenClawStateWriteTransaction(({ db }) => {
			requestSqliteWorkerOperationAdmission({
				stage: "transaction",
				facts: { kind: "node-worker-journal" }
			});
			if (!initializedDatabases.has(db)) {
				ensureTurnSchema(db);
				initialized = db;
			}
			return operation(db);
		}, this.databaseOptions, { operationLabel });
		if (initialized) initializedDatabases.add(initialized);
		return result;
	}
	claim(params) {
		const { claim, ownerLaunchId, supervisor } = params;
		const nowMs = params.nowMs ?? Date.now();
		return this.write("node-worker-turn.claim", (database) => {
			const existing = readReceipt(database, claim.launchId);
			if (existing) {
				if (!nodeWorkerTurnMatchesIdentity(existing, claim) || existing.gatewayNamespace !== claim.gatewayNamespace || existing.ownerLaunchId !== ownerLaunchId) throw new Error(`node worker turn ${claim.launchId} was replayed with a different plan or owner`);
				pruneTerminal(database, nowMs, claim.launchId);
				return {
					action: "replay",
					receipt: existing
				};
			}
			const owner = readNodeWorkerLaunchReceipt(database, ownerLaunchId);
			if (!owner || owner.state !== "pending" && owner.state !== "running" || !matchesProcess(owner, supervisor, params.worker ?? null) || owner.gatewayNamespace !== claim.gatewayNamespace || owner.environmentId !== claim.environmentId || owner.sessionId !== claim.sessionId || owner.ownerEpoch !== claim.ownerEpoch || owner.placementGeneration !== claim.placementGeneration || owner.state === "pending" && owner.launchId !== claim.launchId || owner.launchId === claim.launchId && (owner.state !== "pending" || owner.planHash !== claim.planHash || owner.runId !== claim.runId)) throw new Error(`node worker turn ${claim.launchId} does not match its live physical owner`);
			const turn = executeSqliteQueryTakeFirstSync(database, query(database).insertInto("node_worker_turns").values({
				turn_id: claim.launchId,
				owner_launch_id: ownerLaunchId,
				plan_hash: claim.planHash,
				run_id: claim.runId,
				state: "running",
				result_json: null,
				error_text: null,
				completed_at_ms: null,
				created_at_ms: nowMs,
				updated_at_ms: nowMs
			}).returningAll());
			pruneTerminal(database, nowMs, claim.launchId);
			return {
				action: "start",
				receipt: turnReceiptFromRow(turn, owner)
			};
		});
	}
	get(turnId) {
		return this.write("node-worker-turn.get", (database) => readReceipt(database, turnId));
	}
	finish(params) {
		return this.write("node-worker-turn.finish", (database) => {
			const receipt = readReceipt(database, params.expected.launchId);
			if (!receipt || !nodeWorkerTurnMatchesIdentity(receipt, params.expected) || receipt.ownerLaunchId !== params.ownerLaunchId) return;
			if (receipt.state !== "pending" && receipt.state !== "running" || !matchesProcess(receipt, params.supervisor, params.worker)) return receipt;
			const nowMs = params.nowMs ?? Date.now();
			const completedAtMs = Math.max(nowMs, receipt.createdAtMs, receipt.updatedAtMs);
			const turn = executeSqliteQueryTakeFirstSync(database, query(database).updateTable("node_worker_turns").set({
				state: params.state,
				result_json: params.state === "completed" ? params.resultJson ?? null : null,
				error_text: params.state === "completed" ? null : params.errorText ?? null,
				completed_at_ms: completedAtMs,
				updated_at_ms: completedAtMs
			}).where("turn_id", "=", receipt.launchId).where("state", "=", "running").returningAll());
			pruneTerminal(database, nowMs, receipt.launchId);
			return turnReceiptFromRow(turn, receipt);
		});
	}
};
//#endregion
//#region src/node-host/node-worker-journal.worker.ts
function executeNodeWorkerJournalCommand(command, options) {
	switch (command.type) {
		case "nodeWorker.launch.claimObservation": return new NodeWorkerLaunchKernel(options).claimObservation(...command.input);
		case "nodeWorker.launch.claim": return new NodeWorkerLaunchKernel(options).claim(...command.input);
		case "nodeWorker.launch.listNonterminal": return new NodeWorkerLaunchKernel(options).listNonterminal(...command.input);
		case "nodeWorker.launch.nonterminalCount": return new NodeWorkerLaunchKernel(options).nonterminalCount(...command.input);
		case "nodeWorker.launch.pruneExpiredTerminal": return new NodeWorkerLaunchKernel(options).pruneExpiredTerminal(...command.input);
		case "nodeWorker.launch.get": return new NodeWorkerLaunchKernel(options).get(...command.input);
		case "nodeWorker.launch.getMatching": return new NodeWorkerLaunchKernel(options).getMatching(...command.input);
		case "nodeWorker.launch.cleanupBinding": return new NodeWorkerLaunchKernel(options).cleanupBinding(...command.input);
		case "nodeWorker.launch.finishCancelled": return new NodeWorkerLaunchKernel(options).finishCancelled(...command.input);
		case "nodeWorker.launch.markRunning": return new NodeWorkerLaunchKernel(options).markRunning(...command.input);
		case "nodeWorker.launch.finish": return new NodeWorkerLaunchKernel(options).finish(...command.input);
		case "nodeWorker.turn.claim": return new NodeWorkerTurnKernel(options).claim(...command.input);
		case "nodeWorker.turn.get": return new NodeWorkerTurnKernel(options).get(...command.input);
		case "nodeWorker.turn.finish": return new NodeWorkerTurnKernel(options).finish(...command.input);
	}
	throw new Error("Unsupported node worker journal command");
}
//#endregion
//#region src/plugin-state/plugin-blob-store.worker.ts
function executePluginBlobCommand(command, databasePath, openDatabase) {
	const options = {
		path: databasePath,
		env: getSqliteWorkerStateContext().environment
	};
	const description = pluginBlobWorkerOperations[command.type];
	let opened = false;
	try {
		const database = openDatabase();
		opened = true;
		return runOpenClawStateWriteTransaction(({ db }) => {
			switch (command.type) {
				case "pluginBlob.register": return pluginBlobRegisterInDatabase(db, {
					...command.input,
					env: options.env
				});
				case "pluginBlob.registerIfAbsent": return pluginBlobRegisterIfAbsentInDatabase(db, {
					...command.input,
					env: options.env
				});
				case "pluginBlob.delete": return pluginBlobDeleteInDatabase(db, command.input);
				case "pluginBlob.deleteExpiredKey": return pluginBlobDeleteExpiredKeyInDatabase(db, {
					...command.input,
					env: options.env
				});
				case "pluginBlob.deleteExpired": return pluginBlobDeleteExpiredInDatabase(db, {
					...command.input,
					env: options.env
				});
				case "pluginBlob.clear": return pluginBlobClearInDatabase(db, command.input);
			}
		}, {
			...options,
			database
		});
	} catch (error) {
		throw wrapPluginBlobError(error, description.operation, opened ? "PLUGIN_BLOB_WRITE_FAILED" : "PLUGIN_BLOB_OPEN_FAILED", opened ? description.message : "Failed to open plugin blob store.", options.env, options.path);
	}
}
//#endregion
//#region src/plugin-state/plugin-state.worker.ts
function executePluginStateCommand(command, options, openDatabase, hasRetainedDatabase) {
	const description = pluginStateWorkerOperations[command.type];
	if (command.type === "pluginState.lookup" || command.type === "pluginState.lookupMany" || command.type === "pluginState.entries" || command.type === "pluginState.entriesInKeyRange" || command.type === "pluginState.count") try {
		switch (command.type) {
			case "pluginState.lookup": return ok(withPluginStateDatabaseReadOnly("lookup", (store) => lookupPluginStateEntry(store, command.input), options));
			case "pluginState.lookupMany": {
				const rows = withPluginStateDatabaseReadOnly("lookup", (store) => lookupPluginStateEntries(store, command.input), options) ?? command.input.keys.map(() => ok(void 0));
				return ok(rows.map((row) => row.ok ? row : err(capturePluginStateWorkerFailure(row.error))));
			}
			case "pluginState.entriesInKeyRange": return ok(withPluginStateDatabaseReadOnly("entries", (store) => listPluginStateEntriesInKeyRange(store, command.input), options) ?? []);
			case "pluginState.entries": return ok(withPluginStateDatabaseReadOnly("entries", (store) => listPluginStateEntries(store, command.input), options) ?? []);
			case "pluginState.count": return ok(withPluginStateDatabaseReadOnly("count", ({ db }) => countLivePluginStateNamespaceEntries(db, {
				...command.input,
				now: Date.now()
			}), options) ?? 0);
		}
	} catch (error) {
		return err(capturePluginStateWorkerFailure(wrapPluginStateError(error, description.operation, description.code, description.message, options.path)));
	}
	let database;
	try {
		database = openDatabase();
	} catch (error) {
		return err(capturePluginStateWorkerFailure(wrapPluginStateError(error, description.operation, hasRetainedDatabase ? description.code : "PLUGIN_STATE_OPEN_FAILED", hasRetainedDatabase ? description.message : "Failed to open the plugin state database.", options.path)));
	}
	try {
		return ok(runOpenClawStateWriteTransaction((store) => {
			requestSqliteWorkerOperationAdmission({
				stage: "transaction",
				facts: void 0
			});
			const result = (() => {
				switch (command.type) {
					case "pluginState.appendJournal": return registerPluginStateSequencedJournalEntryInDatabase(store, command.input);
					case "pluginState.observe": return observePluginStateEntry(store, command.input, captureOpenClawStateDatabaseReadAdmission(store.path).identity.key);
					case "pluginState.compareUpdate":
					case "pluginState.compareDelete": return compareAndApplyPluginStateEntry(store, command.input, captureOpenClawStateDatabaseReadAdmission(store.path).identity.key);
					case "pluginState.moveEntries": return movePluginStateEntries(store, command.input);
					case "pluginState.register": return registerPluginStateEntry(store, command.input);
					case "pluginState.registerIfAbsent": return registerPluginStateEntryIfAbsent(store, command.input);
					case "pluginState.deleteIfEqual": return deletePluginStateEntryIfEqual(store, command.input);
					case "pluginState.consume": return consumePluginStateEntry(store, command.input);
					case "pluginState.delete": return deletePluginStateEntry(store.db, command.input) > 0;
					case "pluginState.clear": return clearPluginStateNamespace(store.db, command.input);
					case "pluginState.sweep": return deleteExpiredPluginStateEntries(store.db, Date.now());
					default: throw new Error("Plugin-state read command entered its write path");
				}
			})();
			requestSqliteWorkerOperationAdmission({
				stage: "commit",
				facts: void 0
			});
			return result;
		}, {
			...options,
			database
		}));
	} catch (error) {
		return err(capturePluginStateWorkerFailure(wrapPluginStateError(error, description.operation, description.code, description.message, options.path)));
	}
}
//#endregion
//#region src/plugins/conversation-binding-state.kernel.ts
function readPluginBindingApprovalsInDatabase(db) {
	const approvalsDb = getNodeSqliteKysely(db);
	return executeSqliteQuerySync(db, approvalsDb.selectFrom("plugin_binding_approvals").select([
		"plugin_root",
		"plugin_id",
		"plugin_name",
		"channel",
		"account_id",
		"approved_at"
	]).orderBy("plugin_root", "asc").orderBy("channel", "asc").orderBy("account_id", "asc")).rows.map((row) => ({
		pluginRoot: row.plugin_root,
		pluginId: row.plugin_id,
		pluginName: row.plugin_name ?? void 0,
		channel: normalizeChannel(row.channel),
		accountId: normalizeOptionalString(row.account_id) ?? "default",
		approvedAt: row.approved_at
	}));
}
function upsertPluginBindingApprovalInDatabase(db, entry) {
	const row = {
		plugin_root: entry.pluginRoot,
		channel: normalizeChannel(entry.channel),
		account_id: entry.accountId.trim() || "default",
		plugin_id: entry.pluginId,
		plugin_name: entry.pluginName ?? null,
		approved_at: entry.approvedAt
	};
	const approvalsDb = getNodeSqliteKysely(db);
	executeSqliteQuerySync(db, approvalsDb.insertInto("plugin_binding_approvals").values(row).onConflict((conflict) => conflict.columns([
		"plugin_root",
		"channel",
		"account_id"
	]).doUpdateSet({
		plugin_id: (eb) => eb.ref("excluded.plugin_id"),
		plugin_name: (eb) => eb.ref("excluded.plugin_name"),
		approved_at: (eb) => eb.ref("excluded.approved_at")
	})));
}
//#endregion
//#region src/plugins/official-external-plugin-catalog-snapshot-store.kernel.ts
/** Connection-bound hosted catalog snapshot SQL and monotonicity checks. */
function rowToTrustState(row) {
	if (row.trust_mode !== "signed" || !row.trust_key_id || row.trust_signature_count === null || row.trust_threshold === null || !row.trust_verified_at) return;
	return {
		mode: "signed",
		signedBy: row.trust_key_id,
		signatureCount: coerceRequiredSqliteNumber(row.trust_signature_count),
		threshold: coerceRequiredSqliteNumber(row.trust_threshold),
		verifiedAt: row.trust_verified_at
	};
}
function decodeBase64Payload(payload) {
	const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
	return Buffer.from(normalized, "base64").toString("utf8");
}
function readMonotonicStateFromBody(body) {
	try {
		const document = JSON.parse(body);
		if (!isRecord(document)) return;
		const payload = typeof document.payload === "string" ? decodeBase64Payload(document.payload) : body;
		const feed = typeof document.payload === "string" ? JSON.parse(payload) : document;
		if (!isRecord(feed) || !isOfficialExternalPluginCatalogSequence(feed.sequence)) return;
		if (typeof feed.generatedAt !== "string" || parseOfficialExternalPluginCatalogTimestamp(feed.generatedAt) === void 0) return {
			sequence: feed.sequence,
			payloadSha256: createHash("sha256").update(payload).digest("hex")
		};
		return {
			sequence: feed.sequence,
			generatedAt: feed.generatedAt,
			payloadSha256: createHash("sha256").update(payload).digest("hex")
		};
	} catch {
		return;
	}
}
function isMonotonicRollback(params) {
	if (params.candidate.sequence < params.current.sequence) return true;
	if (params.candidate.sequence > params.current.sequence) return false;
	if (params.candidate.generatedAt === void 0 || params.current.generatedAt === void 0) return false;
	return Date.parse(params.candidate.generatedAt) < Date.parse(params.current.generatedAt);
}
function assertSignedSnapshotWriteIsMonotonic(params) {
	if (params.candidate?.mode !== "signed-feed" || params.current?.trust_mode !== "signed") return;
	const current = readMonotonicStateFromBody(params.current.body);
	if (!current) return;
	if (isMonotonicRollback({
		candidate: params.candidate,
		current
	})) throw new HostedCatalogSignedFeedMonotonicityError("hosted catalog signed feed sequence is older than current snapshot");
	if (params.candidate.sequence !== current.sequence || current.generatedAt === void 0) return;
	const candidate = readMonotonicStateFromBody(params.candidateBody);
	if (candidate?.sequence === params.candidate.sequence && candidate.payloadSha256 !== current.payloadSha256) throw new HostedCatalogSignedFeedMonotonicityError("hosted catalog signed feed payload changed without a sequence increment");
}
function rowToSnapshot(row) {
	if (!row) return null;
	const metadata = {
		url: row.feed_url,
		status: coerceRequiredSqliteNumber(row.status),
		checksum: row.checksum,
		...row.etag ? { etag: row.etag } : {},
		...row.last_modified ? { lastModified: row.last_modified } : {}
	};
	const trust = rowToTrustState(row);
	const storedMonotonic = trust ? readMonotonicStateFromBody(row.body) : void 0;
	const monotonic = storedMonotonic ? {
		mode: "signed-feed",
		sequence: storedMonotonic.sequence,
		...storedMonotonic.generatedAt ? { generatedAt: storedMonotonic.generatedAt } : {}
	} : void 0;
	return {
		body: row.body,
		metadata,
		savedAt: row.saved_at,
		...trust ? { trust } : {},
		...monotonic ? { monotonic } : {}
	};
}
function readHostedCatalogSnapshotInDatabase(db, url) {
	const stateDb = getNodeSqliteKysely(db);
	return rowToSnapshot(executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("official_external_plugin_catalog_snapshots").select([
		"feed_url",
		"body",
		"status",
		"etag",
		"last_modified",
		"checksum",
		"saved_at",
		"trust_mode",
		"trust_key_id",
		"trust_signature_count",
		"trust_threshold",
		"trust_verified_at"
	]).where("feed_url", "=", url)));
}
/** The caller owns the write transaction containing the reread and upsert. */
function writeHostedCatalogSnapshotInDatabase(db, snapshot, now) {
	const stateDb = getNodeSqliteKysely(db);
	const current = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("official_external_plugin_catalog_snapshots").select([
		"feed_url",
		"body",
		"status",
		"etag",
		"last_modified",
		"checksum",
		"saved_at",
		"trust_mode",
		"trust_key_id",
		"trust_signature_count",
		"trust_threshold",
		"trust_verified_at"
	]).where("feed_url", "=", snapshot.metadata.url));
	assertSignedSnapshotWriteIsMonotonic({
		candidate: snapshot.monotonic,
		candidateBody: snapshot.body,
		current
	});
	executeSqliteQuerySync(db, stateDb.insertInto("official_external_plugin_catalog_snapshots").values({
		feed_url: snapshot.metadata.url,
		body: snapshot.body,
		status: snapshot.metadata.status,
		etag: snapshot.metadata.etag ?? null,
		last_modified: snapshot.metadata.lastModified ?? null,
		checksum: snapshot.metadata.checksum,
		saved_at: snapshot.savedAt,
		updated_at_ms: now,
		trust_mode: snapshot.trust?.mode ?? null,
		trust_key_id: snapshot.trust?.signedBy ?? null,
		trust_signature_count: snapshot.trust?.signatureCount ?? null,
		trust_threshold: snapshot.trust?.threshold ?? null,
		trust_verified_at: snapshot.trust?.verifiedAt ?? null
	}).onConflict((conflict) => conflict.column("feed_url").doUpdateSet({
		body: snapshot.body,
		status: snapshot.metadata.status,
		etag: snapshot.metadata.etag ?? null,
		last_modified: snapshot.metadata.lastModified ?? null,
		checksum: snapshot.metadata.checksum,
		saved_at: snapshot.savedAt,
		updated_at_ms: now,
		trust_mode: snapshot.trust?.mode ?? null,
		trust_key_id: snapshot.trust?.signedBy ?? null,
		trust_signature_count: snapshot.trust?.signatureCount ?? null,
		trust_threshold: snapshot.trust?.threshold ?? null,
		trust_verified_at: snapshot.trust?.verifiedAt ?? null
	})));
}
//#endregion
//#region src/skills/lifecycle/upload-store-commit.ts
function assembleArchive(chunks, expectedSize) {
	let offset = 0;
	const buffers = [];
	for (const chunk of chunks) {
		const bytes = chunk.chunk_blob;
		if (chunk.byte_offset !== offset || chunk.size_bytes !== bytes.length || bytes.length < 1) throw new SkillUploadRequestError("uploaded archive chunks are incomplete");
		buffers.push(bytes);
		offset += bytes.length;
	}
	if (offset !== expectedSize) throw new SkillUploadRequestError("uploaded archive chunks are incomplete");
	return Buffer.concat(buffers, expectedSize);
}
function toCommitResult(row, requestedSha) {
	if (!row.actual_sha256) throw new SkillUploadRequestError("committed upload is missing sha256");
	if (requestedSha && requestedSha !== row.actual_sha256) throw new SkillUploadRequestError("upload sha256 mismatch");
	return {
		uploadId: row.upload_id,
		receivedBytes: row.received_bytes,
		sha256: row.actual_sha256,
		expiresAt: row.expires_at
	};
}
function commitSkillUploadInDatabase(params, options) {
	const { uploadId, requestedSha } = params;
	const row = requireUploadMetadata(uploadId, options);
	assertNotExpired(row, Date.now(), options);
	if (row.committed === 1) return toCommitResult(row, requestedSha);
	if (row.received_bytes !== row.size_bytes) throw new SkillUploadRequestError(`upload size mismatch: expected ${row.size_bytes}, got ${row.received_bytes}`);
	if (row.sha256 && requestedSha && row.sha256 !== requestedSha) throw new SkillUploadRequestError("upload sha256 does not match begin sha256");
	let archive;
	try {
		archive = assembleArchive(readSkillUploadArchiveChunks(uploadId, options), row.size_bytes);
	} catch (err) {
		const current = requireUploadMetadata(uploadId, options);
		if (current.committed === 1) {
			assertNotExpired(current, Date.now(), options);
			return toCommitResult(current, requestedSha);
		}
		throw err;
	}
	const actualSha256 = sha256Hex(archive);
	const expectedSha = requestedSha ?? row.sha256 ?? void 0;
	if (expectedSha && expectedSha !== actualSha256) throw new SkillUploadRequestError("upload sha256 mismatch");
	const outcome = runOpenClawStateWriteTransaction(({ db }) => {
		const kysely = getNodeSqliteKysely(db);
		const current = executeSqliteQueryTakeFirstSync(db, selectSkillUploadMetadata(kysely).where("upload_id", "=", uploadId));
		if (!current) throw new SkillUploadRequestError(`upload not found: ${uploadId}`);
		const committedAt = Date.now();
		if (!isFutureDateTimestampMs(current.expires_at, { nowMs: committedAt })) {
			deleteExpiredSkillUploadUnlessLeasedInDatabase(db, {
				uploadId,
				nowMs: committedAt
			});
			return { expired: true };
		}
		if (current.committed === 1) return {
			expired: false,
			result: toCommitResult(current, requestedSha)
		};
		if (current.received_bytes !== current.size_bytes || current.size_bytes !== archive.length) throw new SkillUploadRequestError("uploaded archive chunks changed during commit");
		executeSqliteQuerySync(db, kysely.updateTable("skill_uploads").set({
			actual_sha256: actualSha256,
			archive_blob: archive,
			committed: 1,
			committed_at: committedAt
		}).where("upload_id", "=", uploadId));
		executeSqliteQuerySync(db, kysely.deleteFrom("skill_upload_chunks").where("upload_id", "=", uploadId));
		return {
			expired: false,
			result: {
				uploadId,
				receivedBytes: current.received_bytes,
				sha256: actualSha256,
				expiresAt: current.expires_at
			}
		};
	}, options);
	if (outcome.expired) throw new SkillUploadRequestError("upload has expired");
	return outcome.result;
}
//#endregion
//#region src/skills/lifecycle/upload-store.kernel.ts
function matchesBegin(row, params) {
	return row.kind === params.kind && row.slug === params.slug && row.force === (params.force ? 1 : 0) && row.size_bytes === params.sizeBytes && (row.sha256 ?? void 0) === params.sha256;
}
function beginSkillUploadInDatabase(params, options) {
	const { slug, force, sizeBytes, sha256, keyHash, ttlMs } = params;
	return runOpenClawStateWriteTransaction(({ db }) => {
		const createdAt = Date.now();
		const expiresAt = resolveExpiresAtMsFromDurationMs(ttlMs, { nowMs: createdAt });
		if (expiresAt === void 0) throw new SkillUploadRequestError("invalid upload expiry");
		const kysely = getNodeSqliteKysely(db);
		if (keyHash) {
			const existing = executeSqliteQueryTakeFirstSync(db, selectSkillUploadMetadata(kysely).where("idempotency_key_hash", "=", keyHash));
			if (existing) {
				if (!matchesBegin(existing, {
					kind: params.kind,
					slug,
					force,
					sizeBytes,
					sha256
				})) throw new SkillUploadRequestError("idempotencyKey conflicts with a different upload");
				if (isFutureDateTimestampMs(existing.expires_at, { nowMs: createdAt })) return {
					uploadId: existing.upload_id,
					receivedBytes: existing.received_bytes,
					expiresAt: existing.expires_at
				};
				if (hasLiveSkillUploadInstallLease(db, kysely, existing.upload_id, createdAt)) throw new SkillUploadRequestError("upload is already being installed");
				deleteSkillUploadState(db, kysely, existing.upload_id);
			}
		}
		if (executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("skill_uploads").select((eb) => eb.val(1).as("present")).where("expires_at", ">", createdAt).offset(31).limit(1))) throw new SkillUploadRequestError("too many active skill uploads");
		const uploadId = randomUUID();
		executeSqliteQuerySync(db, kysely.insertInto("skill_uploads").values({
			upload_id: uploadId,
			kind: params.kind,
			slug,
			force: force ? 1 : 0,
			size_bytes: sizeBytes,
			sha256: sha256 ?? null,
			actual_sha256: null,
			received_bytes: 0,
			archive_blob: Buffer.alloc(0),
			created_at: createdAt,
			expires_at: expiresAt,
			committed: 0,
			committed_at: null,
			idempotency_key_hash: keyHash ?? null
		}));
		return {
			uploadId,
			receivedBytes: 0,
			expiresAt
		};
	}, options);
}
function appendSkillUploadChunkInDatabase(params, options) {
	const { uploadId, offset, decoded } = params;
	assertNotExpired(requireUploadMetadata(uploadId, options), Date.now(), options);
	return runOpenClawStateWriteTransaction(({ db }) => {
		const kysely = getNodeSqliteKysely(db);
		const row = executeSqliteQueryTakeFirstSync(db, selectSkillUploadMetadata(kysely).where("upload_id", "=", uploadId));
		if (!row) throw new SkillUploadRequestError(`upload not found: ${uploadId}`);
		const validNow = asDateTimestampMs(Date.now());
		if (validNow === void 0 || !isFutureDateTimestampMs(row.expires_at, { nowMs: validNow })) throw new SkillUploadRequestError("upload has expired");
		if (row.committed === 1) throw new SkillUploadRequestError("upload is already committed");
		if (offset !== row.received_bytes) throw new SkillUploadRequestError(`upload offset mismatch: expected ${row.received_bytes}, got ${offset}`);
		const nextSize = row.received_bytes + decoded.length;
		if (nextSize > row.size_bytes) throw new SkillUploadRequestError("upload chunk exceeds declared size");
		executeSqliteQuerySync(db, kysely.insertInto("skill_upload_chunks").values({
			upload_id: uploadId,
			byte_offset: offset,
			size_bytes: decoded.length,
			chunk_blob: decoded
		}));
		executeSqliteQuerySync(db, kysely.updateTable("skill_uploads").set({ received_bytes: nextSize }).where("upload_id", "=", uploadId));
		return {
			uploadId,
			receivedBytes: nextSize,
			expiresAt: row.expires_at
		};
	}, options);
}
function claimSkillUploadInDatabase(params, options) {
	const { uploadId, leaseOwner, installLeaseMs } = params;
	assertNotExpired(requireUploadMetadata(uploadId, options), Date.now(), options);
	return runOpenClawStateWriteTransaction(({ db }) => {
		const kysely = getNodeSqliteKysely(db);
		const current = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("skill_uploads").selectAll().where("upload_id", "=", uploadId));
		if (!current) throw new SkillUploadRequestError(`upload not found: ${uploadId}`);
		const currentTime = Date.now();
		const validNow = asDateTimestampMs(currentTime);
		if (validNow === void 0 || !isFutureDateTimestampMs(current.expires_at, { nowMs: validNow })) throw new SkillUploadRequestError("upload has expired");
		if (current.committed !== 1) throw new SkillUploadRequestError("upload is not committed");
		if (!current.actual_sha256) throw new SkillUploadRequestError("committed upload is missing sha256");
		if (current.archive_blob.byteLength !== current.size_bytes) throw new SkillUploadRequestError("uploaded archive is missing or incomplete");
		executeSqliteQuerySync(db, kysely.deleteFrom("state_leases").where("scope", "=", SKILL_UPLOAD_LEASE_SCOPE).where("lease_key", "=", uploadId).where("expires_at", "<=", currentTime));
		if (executeSqliteQuerySync(db, kysely.insertInto("state_leases").values({
			scope: "skill-upload-install",
			lease_key: uploadId,
			owner: leaseOwner,
			expires_at: currentTime + installLeaseMs,
			heartbeat_at: currentTime,
			payload_json: null,
			created_at: currentTime,
			updated_at: currentTime
		}).onConflict((conflict) => conflict.doNothing())).numAffectedRows !== 1n) throw new SkillUploadRequestError("upload is already being installed");
		return current;
	}, options);
}
function listExpiredSkillUploadsInDatabase(_input, options) {
	const now = asDateTimestampMs(Date.now());
	if (now === void 0) return [];
	const { db } = options.database;
	return executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("skill_uploads").select("upload_id").where("expires_at", "<=", now)).rows.map((row) => row.upload_id);
}
function deleteExpiredSkillUploadInDatabase(params, options) {
	return runOpenClawStateWriteTransaction(({ db }) => deleteExpiredSkillUploadUnlessLeasedInDatabase(db, {
		uploadId: params.uploadId,
		nowMs: Date.now()
	}), options);
}
function releaseSkillUploadInDatabase(params, options) {
	runOpenClawStateWriteTransaction((current) => {
		if (requireOpenClawStateDatabaseIdentity(current).key !== params.sharedStateIdentity) throw new Error("Skill upload cleanup cannot adopt a replacement shared database");
		const { db } = current;
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).deleteFrom("state_leases").where("scope", "=", SKILL_UPLOAD_LEASE_SCOPE).where("lease_key", "=", params.uploadId).where("owner", "=", params.owner));
	}, options);
}
//#endregion
//#region src/skills/lifecycle/upload-store.worker.ts
function isSkillUploadCommand(command) {
	return command.type === "skillUploads.begin" || command.type === "skillUploads.chunk" || command.type === "skillUploads.commit" || command.type === "skillUploads.expired" || command.type === "skillUploads.deleteExpired" || command.type === "skillUploads.claim" || command.type === "skillUploads.renew" || command.type === "skillUploads.consume" || command.type === "skillUploads.release";
}
function executeSkillUploadCommand(command, options) {
	switch (command.type) {
		case "skillUploads.begin": return beginSkillUploadInDatabase(command.input, options);
		case "skillUploads.chunk": return appendSkillUploadChunkInDatabase(command.input, options);
		case "skillUploads.commit": return commitSkillUploadInDatabase(command.input, options);
		case "skillUploads.expired": return listExpiredSkillUploadsInDatabase(command.input, options);
		case "skillUploads.deleteExpired": return deleteExpiredSkillUploadInDatabase(command.input, options);
		case "skillUploads.claim": return claimSkillUploadInDatabase(command.input, options);
		case "skillUploads.renew": return renewSkillUploadInstallLease({
			...command.input,
			options
		});
		case "skillUploads.consume": return deleteOwnedSkillUpload(command.input.uploadId, command.input.owner, options);
		case "skillUploads.release": return releaseSkillUploadInDatabase(command.input, options);
	}
}
//#endregion
//#region src/skills/workshop/curator.kernel.ts
function readSkillCuratorStateInDatabase(database, skillFiles) {
	const kysely = getNodeSqliteKysely(database.db);
	const reviewStatus = readSkillCuratorReviewStatus({ database });
	return {
		proposalRows: executeSqliteQuerySync(database.db, kysely.selectFrom("skill_workshop_proposals").selectAll().where("kind", "=", "create").where("status", "=", "applied").orderBy("applied_at", "asc").orderBy("proposal_id", "asc")).rows,
		usageRows: skillFiles.length ? executeSqliteQuerySync(database.db, kysely.selectFrom("skill_usage").select([
			"skill_file",
			"last_used_at_ms",
			"use_count"
		]).where("skill_file", "in", skillFiles)).rows : [],
		reviewStatus
	};
}
function recordSkillUsageInDatabase(database, event) {
	const kysely = getNodeSqliteKysely(database.db);
	executeSqliteQuerySync(database.db, kysely.insertInto("skill_usage").values({
		skill_file: event.skillFile,
		skill_key: event.skillKey,
		skill_name: event.skillName,
		skill_source: event.skillSource,
		first_used_at_ms: event.ts,
		last_used_at_ms: event.ts,
		use_count: 1,
		last_agent_id: event.agentId ?? null
	}).onConflict((conflict) => conflict.column("skill_file").doUpdateSet((eb) => ({
		skill_key: event.skillKey,
		skill_name: event.skillName,
		skill_source: event.skillSource,
		first_used_at_ms: eb.fn("min", [eb.ref("first_used_at_ms"), eb.val(event.ts)]),
		last_used_at_ms: eb.fn("max", [eb.ref("last_used_at_ms"), eb.val(event.ts)]),
		use_count: eb("use_count", "+", 1),
		last_agent_id: eb.case().when("last_used_at_ms", "<=", event.ts).then(event.agentId ?? null).else(eb.ref("last_agent_id")).end()
	}))));
}
//#endregion
//#region src/skills/workshop/store.worker.ts
function isSkillWorkshopCommand(command) {
	return command.type === "skills.curator.read" || command.type === "skills.usage.record" || command.type === "workshop.events.list";
}
function executeSkillWorkshopCommand(command, database, databasePath) {
	if (command.type === "skills.curator.read") return readSkillCuratorStateInDatabase(database, command.input.skillFiles);
	const options = {
		database,
		path: databasePath,
		env: getSqliteWorkerStateContext().environment
	};
	if (command.type === "skills.usage.record") return runOpenClawStateWriteTransaction((current) => recordSkillUsageInDatabase(current, command.input), options);
	ensureSkillWorkshopSchemaInDatabase(database, options);
	return listStoredSkillProposalEventsInDatabase(database.db, command.input);
}
//#endregion
//#region src/tasks/task-registry.worker-contract.ts
function isTaskRegistryWorkerCommand(command) {
	switch (command.type) {
		case "tasks.updateNotificationDelivery":
		case "tasks.acknowledgeStateChange":
		case "tasks.bindExecution":
		case "flows.bindExecution":
		case "tasks.observeAgentEvent":
		case "tasks.createRecord":
		case "tasks.finalizeActive":
		case "tasks.settleUnstarted":
		case "flows.createForTask":
		case "tasks.linkInitialFlow":
		case "flows.deleteUnlinkedForTask":
		case "flows.finalizeTaskCancellation":
		case "tasks.restore":
		case "flows.syncMirroredTask":
		case "flows.snapshot":
		case "flows.syncLiveMirroredTask":
		case "tasks.statusSummary":
		case "flows.runTask":
		case "flows.createManaged":
		case "flows.updateManaged":
		case "flows.current":
		case "flows.maintain":
		case "tasks.get":
		case "tasks.findByRunId":
		case "tasks.list":
		case "tasks.ownerRecords":
		case "tasks.resolve":
		case "flows.list":
		case "flows.views":
		case "flows.summary":
		case "flows.read":
		case "flows.detail": return true;
		default: return false;
	}
}
//#endregion
//#region src/tasks/task-flow-maintenance.worker.ts
const log$6 = createSubsystemLogger("tasks/task-flow-registry");
function maintainTaskFlowInDatabase(database, input) {
	let committed;
	try {
		return runOpenClawStateWriteTransaction(({ db }) => {
			requestSqliteWorkerOperationAdmission({
				stage: "transaction",
				facts: void 0
			});
			const maintain = () => {
				const stored = readTaskFlowRecord(db, input.flowId);
				if (!stored) return "unchanged";
				const current = normalizeRestoredFlowRecord(stored);
				if (current.revision !== input.expectedRevision) return "revision_conflict";
				const action = resolveTaskFlowMaintenanceAction(current, input.now, () => listTaskRecordsForFlowReadInDatabase(db, current.flowId).some(isTaskFlowCancellationPending));
				if (!action || action.kind !== input.action) return "unchanged";
				if (action.kind === "prune") {
					deleteTaskFlowRowInDatabase(db, current.flowId);
					return "pruned";
				}
				const result = updateSelectedTaskFlowRecordInDatabase(db, current, {
					expectedRevision: input.expectedRevision,
					patch: action.patch
				});
				if (!result.applied && result.reason === "invalid_patch") throw result.error;
				return result.applied ? "reconciled" : "unchanged";
			};
			const result = maintain();
			requestSqliteWorkerOperationAdmission({
				stage: "commit",
				facts: void 0
			});
			deferSqlitePostCommitPublication(db, () => {
				committed = result;
			});
			return result;
		}, {
			database,
			path: database.path,
			env: getSqliteWorkerStateContext().environment
		}, { operationLabel: "flows.maintain" });
	} catch (error) {
		if (committed !== void 0) {
			log$6.warn("Task-flow maintenance committed before cleanup failed", {
				flowId: input.flowId,
				error
			});
			return committed;
		}
		throw error;
	}
}
//#endregion
//#region src/tasks/task-registry-create.kernel.ts
/** Shared writer custody spans the operation; write owns each separate transaction. */
function createTaskRecordInDatabase(db, input, write, options) {
	const { params } = input;
	return runTaskCreateOperation(input, {
		readSelection: (identity) => {
			const parentFlowId = params.parentFlowId?.trim();
			assertParentFlowRecordLinkAllowed({
				...identity,
				parentFlowId
			}, parentFlowId && identity.scopeKind === "session" ? readTaskFlowRecord(db, parentFlowId) : void 0);
			const snapshot = readTaskRegistryMutationSnapshotInDatabase(db, {
				taskId: input.taskId,
				runId: params.runId,
				childSessionKey: params.childSessionKey
			});
			const existing = selectExistingTaskForCreate({
				...params,
				ownerKey: identity.ownerKey,
				scopeKind: identity.scopeKind,
				candidates: [...snapshot.tasks.values()],
				isTaskMirroredFlow: (flowId) => readTaskFlowRecord(db, flowId)?.syncMode === "task_mirrored"
			});
			return {
				existing,
				deliveryState: existing ? snapshot.deliveryStates.get(existing.taskId) : void 0
			};
		},
		write,
		upsertDelivery: (state) => upsertTaskDeliveryStateInDatabase(db, state),
		upsertTask: (task, deliveryState) => upsertTaskWithDeliveryStateInDatabase({ db }, {
			task,
			deliveryState
		}),
		deferCommit: (publish) => {
			deferSqlitePostCommitPublication(db, publish);
		},
		onCommitted: options.onCommitted,
		assertCurrent: options.assertCurrent,
		retainTaskCommit: options.retainTaskCommit
	});
}
//#endregion
//#region src/tasks/task-flow-managed-run-task.kernel.ts
var ManagedTaskCreationRefused = class extends Error {
	constructor(result) {
		super(result.reason);
		this.result = result;
	}
};
/** The caller holds shared writer custody; write retains the owner's separate transactions. */
function runManagedTaskInFlowInDatabase(db, input, write, onCommitted, admission) {
	const { params } = input;
	const readManagedFlow = () => {
		const storedFlow = readTaskFlowRecord(db, params.flowId);
		if (!storedFlow || normalizeOptionalString(storedFlow.ownerKey) !== normalizeOptionalString(input.callerOwnerKey)) throw new ManagedTaskCreationRefused({
			found: false,
			created: false,
			reason: "Flow not found."
		});
		const flow = normalizeRestoredFlowRecord(storedFlow);
		const reason = flow.syncMode !== "managed" ? "Flow does not accept managed child tasks." : flow.cancelRequestedAt != null ? "Flow cancellation has already been requested." : isTerminalTaskFlow(flow) ? `Flow is already ${flow.status}.` : void 0;
		if (reason) throw new ManagedTaskCreationRefused({
			found: true,
			created: false,
			reason,
			flow
		});
		return flow;
	};
	try {
		const flow = readManagedFlow();
		const childSessionKey = params.childSessionKey?.trim();
		const runId = params.runId?.trim();
		const readBacking = () => {
			const snapshot = readTaskRegistryMutationSnapshotInDatabase(db, {
				...params,
				taskId: input.taskId
			});
			const backing = childSessionKey && runId && (params.runtime === "acp" || params.runtime === "subagent") ? selectCurrentCanonicalTaskBacking({
				runtime: params.runtime,
				scopeKind: "session",
				ownerKey: flow.ownerKey,
				childSessionKey,
				runId,
				candidates: [...snapshot.tasks.values()],
				isTaskMirroredFlow: (flowId) => readTaskFlowRecord(db, flowId)?.syncMode === "task_mirrored"
			}) : void 0;
			if (childSessionKey && (params.runtime === "acp" || params.runtime === "subagent") && !backing) throw new ManagedTaskCreationRefused({
				found: true,
				created: false,
				reason: "Task backing ownership could not be verified.",
				flow
			});
			return backing;
		};
		const backing = readBacking();
		const createParams = {
			runtime: params.runtime,
			sourceId: params.sourceId,
			ownerKey: flow.ownerKey,
			scopeKind: "session",
			requesterOrigin: flow.requesterOrigin,
			parentFlowId: flow.flowId,
			childSessionKey: params.childSessionKey,
			parentTaskId: params.parentTaskId,
			agentId: params.agentId,
			runId: params.runId,
			label: params.label,
			task: params.task,
			preferMetadata: params.preferMetadata,
			notifyPolicy: params.notifyPolicy,
			deliveryStatus: params.deliveryStatus ?? "pending",
			detail: createManagedTaskBackingDetail(backing),
			status: params.status === "running" ? "running" : "queued",
			...params.status === "running" ? {
				startedAt: params.startedAt,
				lastEventAt: params.lastEventAt,
				progressSummary: params.progressSummary
			} : {}
		};
		const resultForTask = (receipt) => ({
			found: true,
			created: true,
			flow,
			task: receipt.task,
			taskMutation: receipt.mutation
		});
		return resultForTask(createTaskRecordInDatabase(db, {
			...input,
			params: createParams
		}, write, {
			retainTaskCommit: admission?.retainTaskCommit,
			assertCurrent: (existing) => {
				readManagedFlow();
				const currentBacking = readBacking();
				if (backing && (!currentBacking || currentBacking.task.taskId !== backing.task.taskId || !sameTaskBackingInstance(currentBacking.instance, backing.instance) || isTerminalTaskStatus(currentBacking.task.status) && (!existing || !isTerminalTaskStatus(existing.status)))) throw new ManagedTaskCreationRefused({
					found: true,
					created: false,
					reason: "Task backing ownership could not be verified.",
					flow
				});
				admission?.assertCurrent();
			},
			onCommitted: (commit) => {
				if (commit.kind === "task") onCommitted(resultForTask(commit.result));
			}
		}));
	} catch (error) {
		if (isParentFlowLinkError(error)) try {
			readManagedFlow();
		} catch (flowError) {
			if (flowError instanceof ManagedTaskCreationRefused) {
				onCommitted(flowError.result);
				return flowError.result;
			}
			throw flowError;
		}
		if (error instanceof ManagedTaskCreationRefused) {
			onCommitted(error.result);
			return error.result;
		}
		throw error;
	}
}
//#endregion
//#region src/tasks/task-initial-flow.kernel.ts
function assertWriteTransaction(db) {
	if (!db.isTransaction) throw new Error("Initial task-flow mutation requires a write transaction");
}
/** Each stage commits separately; the caller publishes before admitting the next stage. */
function createInitialTaskFlowInDatabase(db, input, assertCurrent) {
	assertWriteTransaction(db);
	const task = readTaskRecord(db, input.taskId);
	if (!task || !isOneTaskFlowEligible(task)) return {
		created: false,
		task: task ?? null
	};
	if (!input.flowId.trim() || readTaskFlowRecord(db, input.flowId)) throw new Error("Initial task flow requires an unused flow ID");
	const flow = {
		...buildFlowRecord(buildTaskMirroredFlowCreateFields({
			task,
			requesterOrigin: input.requesterOrigin
		})),
		flowId: input.flowId
	};
	assertCurrent?.({
		task,
		flow
	});
	upsertTaskFlowRowInDatabase(db, bindTaskFlowRecord(flow));
	return {
		created: true,
		task,
		flow
	};
}
function linkInitialTaskFlowInDatabase(db, input, assertCurrent) {
	assertWriteTransaction(db);
	const task = readTaskRecord(db, input.taskId) ?? null;
	const flow = readTaskFlowRecord(db, input.flow.flowId) ?? null;
	if (!task || !isOneTaskFlowEligible(task) || !flow || flow.syncMode !== "task_mirrored" || !areTaskFlowRecordsEqual(flow, input.flow)) return {
		linked: false,
		task,
		flow
	};
	assertParentFlowRecordLinkAllowed({
		ownerKey: task.ownerKey,
		scopeKind: task.scopeKind,
		parentFlowId: flow.flowId
	}, flow);
	const linked = applyTaskRecordPatch(task, { parentFlowId: flow.flowId }, input.now);
	assertCurrent?.({
		task,
		flow
	});
	upsertTaskRunRowInDatabase({ db }, bindTaskRecord(linked));
	return {
		linked: true,
		task: linked,
		previous: task,
		flow
	};
}
function deleteUnlinkedInitialTaskFlowInDatabase(db, input, assertCurrent) {
	assertWriteTransaction(db);
	const flow = readTaskFlowRecord(db, input.flow.flowId) ?? null;
	if (!flow || flow.syncMode !== "task_mirrored" || !areTaskFlowRecordsEqual(flow, input.flow)) return {
		deleted: false,
		flow
	};
	if (executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("task_runs").select("task_id").where((eb) => eb(eb.fn("trim", [eb.ref("parent_flow_id")]), "=", flow.flowId)).limit(1))) return {
		deleted: false,
		flow
	};
	assertCurrent?.({
		task: readTaskRecord(db, input.taskId) ?? null,
		flow
	});
	deleteTaskFlowRowInDatabase(db, flow.flowId);
	return {
		deleted: true,
		flow
	};
}
function finalizeInitialTaskManagedCancellationInDatabase(db, input, assertCurrent) {
	assertWriteTransaction(db);
	const task = readTaskRecord(db, input.taskId) ?? null;
	if (!task || task.parentFlowId?.trim() !== input.flowId) return {
		changed: false,
		task,
		flow: null
	};
	const stored = readTaskFlowRecord(db, input.flowId);
	if (!stored) return {
		changed: false,
		task,
		flow: null
	};
	const flow = normalizeRestoredFlowRecord(stored);
	const patch = buildManagedFlowCancellationPatch(task, flow, () => listTaskRecordsForFlowReadInDatabase(db, flow.flowId), input.now);
	if (!patch) return {
		changed: false,
		task,
		flow
	};
	const next = applyFlowPatch(flow, patch);
	assertCurrent?.({
		task,
		flow
	});
	upsertTaskFlowRowInDatabase(db, bindTaskFlowRecord(next));
	return {
		changed: true,
		task,
		flow: next,
		previous: flow
	};
}
//#endregion
//#region src/tasks/task-notification.kernel.ts
const log$5 = createSubsystemLogger("tasks/registry");
function taskNotificationOperations(db, taskId, write, options) {
	return {
		readCurrent() {
			if (!db.isTransaction) throw new Error("Task notification mutation requires a write transaction");
			const snapshot = readTaskRegistryMutationSnapshotInDatabase(db, { taskId });
			return {
				task: snapshot.tasks.get(taskId),
				deliveryState: snapshot.deliveryStates.get(taskId)
			};
		},
		write,
		assertCurrent: options.assertCurrent,
		upsertDelivery: (state) => upsertTaskDeliveryStateInDatabase(db, state),
		upsertTask: (task, deliveryState) => upsertTaskWithDeliveryStateInDatabase({ db }, {
			task,
			deliveryState
		}),
		deferCommit(publish) {
			if (!deferSqlitePostCommitPublication(db, publish)) throw new Error("Task notification mutation requires a post-commit publication owner");
		},
		onCommitted: options.onCommitted,
		onFailure(stage, error) {
			log$5.warn("Failed to persist task notification mutation", {
				taskId,
				stage,
				error
			});
		}
	};
}
function acknowledgeTaskStateNotificationInDatabase(db, input, write, options) {
	return acknowledgeTaskStateNotification(input, taskNotificationOperations(db, input.taskId, write, options));
}
function updateTaskNotificationDeliveryInDatabase(db, input, write, options) {
	return updateTaskNotificationDelivery(input, taskNotificationOperations(db, input.taskId, write, options));
}
//#endregion
//#region src/tasks/task-registry-transition.kernel.ts
function hasAuthoritativeTaskBackingInDatabase(db, task) {
	return hasAuthoritativeTaskBackingFromRecords(task, {
		isManagedFlow: (flowId) => readTaskFlowRecord(db, flowId)?.syncMode === "managed",
		resolveCurrentCanonicalBacking: (scope) => {
			const snapshot = readTaskRegistryMutationSnapshotInDatabase(db, {
				taskId: task.taskId,
				childSessionKey: scope.childSessionKey
			});
			return selectCurrentCanonicalTaskBacking({
				...scope,
				candidates: [...snapshot.tasks.values()],
				isTaskMirroredFlow: (flowId) => readTaskFlowRecord(db, flowId)?.syncMode === "task_mirrored"
			});
		}
	});
}
/** Worker settlement retains an exact task receipt and current host admission. */
function transitionTaskRecordInDatabase(db, input, write, options) {
	if (!input.expectedTask) throw new Error("Worker task transition requires an exact task persistence receipt");
	return runTaskRecordTransitionOperation(input, {
		readCurrent: () => {
			if (!db.isTransaction) throw new Error("Task transition requires a write transaction");
			return readTaskRecord(db, input.taskId);
		},
		hasAuthoritativeBacking: (task) => hasAuthoritativeTaskBackingInDatabase(db, task),
		write,
		upsertTask(task) {
			upsertTaskRunRowInDatabase({ db }, bindTaskRecord(task));
			return true;
		},
		deferCommit(publish) {
			if (!deferSqlitePostCommitPublication(db, publish)) throw new Error("Task transition requires a post-commit publication owner");
		},
		onCommitted: options.onCommitted,
		assertCurrent: options.assertCurrent
	});
}
//#endregion
//#region src/tasks/task-initial.worker.ts
const log$4 = createSubsystemLogger("tasks/registry");
function executeTaskInitialMutation(database, command) {
	let committed;
	const accept = (result) => {
		committed = { result };
	};
	const assertCurrent = () => requestSqliteWorkerOperationAdmission({
		stage: "transaction",
		facts: {
			kind: "task-registry-mutation",
			operation: command.type,
			taskId: command.input.taskId
		}
	});
	const write = (operation) => runOpenClawStateWriteTransaction(operation, {
		database,
		path: database.path,
		env: getSqliteWorkerStateContext().environment
	});
	try {
		return withSharedStateWriteCoordinator({
			databasePath: database.path,
			existing: database.db,
			operationLabel: command.type
		}, () => {
			if (command.type === "tasks.updateNotificationDelivery") return updateTaskNotificationDeliveryInDatabase(database.db, command.input, write, {
				assertCurrent,
				onCommitted: accept
			});
			if (command.type === "tasks.acknowledgeStateChange") return acknowledgeTaskStateNotificationInDatabase(database.db, command.input, write, {
				assertCurrent,
				onCommitted: accept
			});
			if (command.type === "tasks.createRecord") return createTaskRecordInDatabase(database.db, command.input, write, {
				assertCurrent,
				retainTaskCommit(taskId) {
					const task = readTaskRecord(database.db, taskId);
					if (task?.runId) deferSqliteWorkerCommitReceipt(database.db, captureTaskCreationEventTarget(task, command.type, command.input.taskId));
				},
				onCommitted(commit) {
					if (commit.kind === "task") accept(commit.result);
				}
			});
			return write(() => {
				let result;
				switch (command.type) {
					case "tasks.finalizeActive":
						result = transitionTaskRecordInDatabase(database.db, {
							kind: "state",
							...command.input
						}, (operation) => operation(), {
							assertCurrent,
							onCommitted() {}
						});
						break;
					case "tasks.settleUnstarted": {
						const task = readTaskRecord(database.db, command.input.taskId);
						result = task && (task.status === "queued" || task.status === "running") && task.endedAt === void 0 ? transitionTaskRecordInDatabase(database.db, {
							kind: "state",
							taskId: command.input.taskId,
							now: command.input.now,
							expectedTask: command.input.expectedTask,
							params: {
								...command.input.terminal,
								runId: command.input.expectedTask.runId,
								runtime: command.input.expectedTask.runtime,
								sessionKey: command.input.expectedTask.childSessionKey ?? command.input.expectedTask.ownerKey
							}
						}, (operation) => operation(), {
							assertCurrent,
							onCommitted() {}
						}) : null;
						break;
					}
					case "flows.createForTask":
						result = createInitialTaskFlowInDatabase(database.db, command.input, assertCurrent);
						break;
					case "tasks.linkInitialFlow":
						result = linkInitialTaskFlowInDatabase(database.db, command.input, assertCurrent);
						break;
					case "flows.deleteUnlinkedForTask":
						result = deleteUnlinkedInitialTaskFlowInDatabase(database.db, command.input, assertCurrent);
						break;
					case "flows.finalizeTaskCancellation": result = finalizeInitialTaskManagedCancellationInDatabase(database.db, command.input, assertCurrent);
				}
				deferSqlitePostCommitPublication(database.db, () => accept(result));
				return result;
			});
		});
	} catch (error) {
		if (committed) {
			log$4.warn("Initial task mutation committed before cleanup failed", {
				operation: command.type,
				taskId: command.input.taskId,
				error
			});
			return committed.result;
		}
		throw error;
	}
}
//#endregion
//#region src/tasks/task-registry-agent-event.worker.ts
function observeTaskAgentEventInDatabase(database, input) {
	let committed;
	try {
		return runOpenClawStateWriteTransaction(({ db }) => {
			const current = readTaskRecord(db, input.taskId);
			if (!current || !hasAuthoritativeTaskBackingInDatabase(db, current)) return null;
			const receipt = prepareTaskAgentEventUpdate(current, input);
			if (!receipt) return null;
			requestSqliteWorkerOperationAdmission({
				stage: "transaction",
				facts: {
					kind: "task-registry-mutation",
					operation: "tasks.observeAgentEvent",
					taskId: input.taskId
				}
			});
			const bound = bindTaskRecord(receipt.task);
			upsertTaskRunRowInDatabase({ db }, bound);
			deferSqliteWorkerCommitReceipt(db, captureTaskAgentEventCommit(receipt, bound));
			deferSqlitePostCommitPublication(db, () => {
				committed = receipt;
			});
			return receipt;
		}, {
			database,
			path: database.path,
			env: getSqliteWorkerStateContext().environment
		}, { operationLabel: "tasks.observeAgentEvent" });
	} catch (error) {
		if (committed) return {
			...committed,
			cleanupError: serializeAgentSchemaInspectionError(error)
		};
		throw error;
	}
}
//#endregion
//#region src/tasks/task-registry-live-flow.worker.ts
const log$3 = createSubsystemLogger("tasks/task-flow-registry");
function syncLiveTaskFlowInDatabase(database, params) {
	let admitted = false;
	let current;
	let committed;
	try {
		return runOpenClawStateWriteTransaction(({ db }) => {
			const task = readTaskRecord(db, params.taskId);
			if (!task || task.parentFlowId?.trim() !== params.flowId) return { kind: "not-selected" };
			const outcome = {
				kind: "result",
				result: {
					ok: true,
					flow: syncTaskMirroredFlowRecordInDatabase(db, task, (flow) => {
						current = flow;
						requestSqliteWorkerOperationAdmission({
							stage: "transaction",
							facts: {
								kind: "task-live-flow",
								...params,
								createdAt: task.createdAt
							}
						});
						admitted = true;
					}).flow
				}
			};
			deferSqlitePostCommitPublication(db, () => {
				committed = outcome;
			});
			return outcome;
		}, {
			database,
			path: database.path,
			env: getSqliteWorkerStateContext().environment
		}, { operationLabel: "task.flow.live-sync" });
	} catch (error) {
		if (committed) {
			log$3.warn("Live task-flow sync committed before cleanup failed", {
				...params,
				error
			});
			return committed;
		}
		if (error instanceof AggregateError) throw error;
		if (!admitted && isSqliteLockError(error) && database.db.isOpen && !database.db.isTransaction) return {
			kind: "retry",
			reason: "storage_contention"
		};
		if (!admitted || !current) throw error;
		log$3.warn("Failed to persist live task-flow sync", {
			...params,
			error
		});
		return {
			kind: "result",
			result: {
				ok: false,
				reason: "persist_failed",
				current
			}
		};
	}
}
//#endregion
//#region src/tasks/task-registry-restore.worker.ts
const log$2 = createSubsystemLogger("tasks/task-flow-registry");
function syncTaskMirroredFlowInDatabase(database, params) {
	let flowId = params.expectedParentFlowId?.trim();
	let committedFlow;
	const outcome = (result) => ({
		taskId: params.taskId,
		...flowId ? { flowId } : {},
		kind: "result",
		result
	});
	try {
		return withSharedStateWriteCoordinator({
			databasePath: database.path,
			existing: database.db,
			operationLabel: "task.flow.sync"
		}, () => {
			const snapshot = readTaskRegistrySnapshot(database);
			const task = snapshot.tasks.get(params.taskId);
			const currentParentFlowId = task?.parentFlowId?.trim();
			if (!task || !currentParentFlowId || params.expectedParentFlowId !== void 0 && currentParentFlowId !== flowId) return outcome({
				ok: true,
				flow: null
			});
			flowId = currentParentFlowId;
			if (findLatestTaskForFlowInSnapshot(snapshot.tasks, flowId)?.taskId !== task.taskId) return outcome({
				ok: true,
				flow: null
			});
			const stored = readTaskFlowRecord(database.db, flowId);
			if (!stored) return outcome({
				ok: true,
				flow: null
			});
			const current = normalizeRestoredFlowRecord(stored);
			if (current.syncMode !== "task_mirrored") return outcome({
				ok: true,
				flow: current
			});
			const prepared = prepareTaskMirroredFlowSyncFromCurrent(task, current);
			if (isTaskMirroredFlowSyncUnchanged(prepared)) return outcome({
				ok: true,
				flow: current
			});
			try {
				runOpenClawStateWriteTransaction(({ db }) => {
					requestSqliteWorkerOperationAdmission({
						stage: "transaction",
						facts: {
							kind: "task-restored-flow",
							taskId: task.taskId,
							flowId
						}
					});
					upsertTaskFlowRowInDatabase(db, bindTaskFlowRecord(prepared.next));
					deferSqlitePostCommitPublication(db, () => {
						committedFlow = prepared.next;
					});
				}, {
					database,
					path: database.path,
					env: getSqliteWorkerStateContext().environment
				});
				return outcome({
					ok: true,
					flow: prepared.next
				});
			} catch (error) {
				if (committedFlow) {
					log$2.warn("Task-mirrored flow sync committed before cleanup failed", {
						taskId: task.taskId,
						flowId,
						error
					});
					return outcome({
						ok: true,
						flow: committedFlow
					});
				}
				log$2.warn("Failed to persist task-mirrored flow sync", {
					taskId: task.taskId,
					flowId,
					error
				});
				return outcome({
					ok: false,
					reason: "persist_failed",
					current
				});
			}
		});
	} catch (error) {
		if (committedFlow) {
			log$2.warn("Task-mirrored flow sync committed before coordinator cleanup failed", {
				taskId: params.taskId,
				flowId,
				error
			});
			return outcome({
				ok: true,
				flow: committedFlow
			});
		}
		return {
			taskId: params.taskId,
			...flowId ? { flowId } : {},
			kind: "error",
			error: serializeAgentSchemaInspectionError(error)
		};
	}
}
/** Keep task settlement and best-effort parent-flow updates in their separate transactions. */
function restoreTaskRegistryInDatabase(database) {
	const restored = restoreTaskExecutionSnapshot({
		loadSnapshot: () => readTaskRegistrySnapshot(database),
		withMutation: (operation) => withSharedStateWriteCoordinator({
			databasePath: database.path,
			existing: database.db,
			operationLabel: "task.mutation"
		}, operation),
		upsertTaskWithDeliveryState: (params) => runOpenClawStateWriteTransaction((writer) => upsertTaskWithDeliveryStateInDatabase(writer, params), {
			database,
			path: database.path,
			env: getSqliteWorkerStateContext().environment
		})
	});
	const flowSyncs = restored.settledTasks.flatMap((task) => {
		const flowId = task.parentFlowId?.trim();
		return flowId ? [syncTaskMirroredFlowInDatabase(database, {
			taskId: task.taskId,
			expectedParentFlowId: flowId
		})] : [];
	});
	return {
		...restored,
		flowSyncs
	};
}
//#endregion
//#region src/tasks/task-registry.store.status.ts
const AUDIT_COLUMNS = [
	"runtime",
	"status",
	"delivery_status",
	"notify_policy",
	"created_at",
	"started_at",
	"ended_at",
	"last_event_at",
	"cleanup_after"
];
function earlierCronRow(left, right) {
	if (!left) return right;
	return right.createdAt < left.createdAt || right.createdAt === left.createdAt && Buffer.compare(Buffer.from(right.row.taskId), Buffer.from(left.row.taskId)) < 0 ? right : left;
}
function auditRecord(row) {
	return normalizeTaskTimestamps({
		runtime: parseTaskRuntime(row.runtime),
		status: parseTaskStatus(row.status),
		deliveryStatus: parseTaskDeliveryStatus(row.delivery_status),
		notifyPolicy: parseTaskNotifyPolicy(row.notify_policy),
		createdAt: normalizeSqliteNumber(row.created_at) ?? 0,
		startedAt: normalizeSqliteNumber(row.started_at),
		endedAt: normalizeSqliteNumber(row.ended_at),
		lastEventAt: normalizeSqliteNumber(row.last_event_at),
		cleanupAfter: normalizeSqliteNumber(row.cleanup_after)
	});
}
/** Fixed-size retained-history aggregates; only live reconciliation candidates leave the worker. */
function readTaskRegistryStatusSnapshot(database, now) {
	const result = {
		state: "ready",
		summary: createEmptyTaskStatusSummary(),
		candidates: [],
		cronRecoveryRows: /* @__PURE__ */ new Map()
	};
	const { db } = database;
	if (!hasReadableTaskRegistrySchema(db)) {
		result.state = "migration-required";
		return result;
	}
	return runSqliteDeferredTransactionSync(db, () => {
		const kysely = getNodeSqliteKysely(db);
		const candidate = sql`(status IN ('queued', 'running') OR
      (runtime = 'cron' AND status = 'lost' AND instr(lower(coalesce(error, '')), 'backing session missing') > 0))`;
		const columns = sql.join(AUDIT_COLUMNS.map((column) => sql.ref(column)));
		const candidates = sql`SELECT ${columns}, task_id, task_kind, source_id,
      owner_key, scope_kind, child_session_key, agent_id, run_id,
      CASE WHEN runtime = 'subagent' AND json_valid(detail_json) THEN
        CASE WHEN json_type(detail_json) = 'object'
          AND json_extract(detail_json, '$.kind') = 'task_backing_instance'
          AND json_extract(detail_json, '$.runtime') = 'subagent'
          AND json_type(detail_json, '$.generation') IN ('integer', 'real')
          AND json_extract(detail_json, '$.generation') BETWEEN 1 AND 9007199254740991
          AND json_extract(detail_json, '$.generation') = CAST(json_extract(detail_json, '$.generation') AS INTEGER)
        THEN json_extract(detail_json, '$.generation') END
      END AS backing_generation
      FROM task_runs NOT INDEXED WHERE ${candidate}`;
		for (const row of iterateSqliteQuerySync(db, { compile: () => candidates.compile(kysely) })) {
			const metadata = auditRecord(row);
			result.candidates.push({
				...metadata,
				taskId: row.task_id,
				task: "",
				ownerKey: row.owner_key,
				requesterSessionKey: row.owner_key,
				scopeKind: parseTaskScopeKind(row.scope_kind),
				...row.task_kind ? { taskKind: row.task_kind } : {},
				...row.source_id ? { sourceId: row.source_id } : {},
				...row.child_session_key ? { childSessionKey: row.child_session_key } : {},
				...row.agent_id ? { agentId: row.agent_id } : {},
				...row.run_id ? { runId: row.run_id } : {},
				...metadata.status === "lost" ? { error: "backing session missing" } : {},
				...row.backing_generation !== null ? { detail: createSubagentTaskBackingDetail(row.backing_generation) } : {}
			});
		}
		const candidateIds = new Set(result.candidates.map((task) => task.taskId));
		const cronLookups = /* @__PURE__ */ new Map();
		for (const task of result.candidates) {
			const jobId = task.runtime === "cron" ? task.sourceId?.trim() : void 0;
			if (!jobId) continue;
			let lookup = cronLookups.get(jobId);
			if (!lookup) {
				lookup = {
					taskIds: /* @__PURE__ */ new Map(),
					runIds: /* @__PURE__ */ new Map()
				};
				cronLookups.set(jobId, lookup);
			}
			lookup.taskIds.set(task.taskId, void 0);
			if (task.runId) lookup.runIds.set(task.runId, void 0);
		}
		const history = sql`SELECT ${columns}, task_id, source_id, run_id FROM task_runs NOT INDEXED`;
		for (const row of iterateSqliteQuerySync(db, { compile: () => history.compile(kysely) })) {
			const metadata = auditRecord(row);
			if (!candidateIds.has(row.task_id)) addTaskStatusSummaryRecord(result.summary, metadata, now);
			const lookup = row.runtime === "cron" && row.source_id ? cronLookups.get(row.source_id) : void 0;
			const runId = row.run_id;
			if (!lookup || !lookup.taskIds.has(row.task_id) && !lookup.runIds.has(runId ?? "")) continue;
			const match = {
				createdAt: row.created_at,
				row: {
					...metadata,
					taskId: row.task_id,
					task: "",
					ownerKey: "",
					requesterSessionKey: "",
					scopeKind: "system"
				}
			};
			if (lookup.taskIds.has(row.task_id)) lookup.taskIds.set(row.task_id, earlierCronRow(lookup.taskIds.get(row.task_id), match));
			if (runId && lookup.runIds.has(runId)) lookup.runIds.set(runId, earlierCronRow(lookup.runIds.get(runId), match));
		}
		for (const task of result.candidates) {
			const lookup = task.runtime === "cron" ? cronLookups.get(task.sourceId?.trim() ?? "") : void 0;
			if (!lookup) continue;
			const direct = lookup.taskIds.get(task.taskId);
			const byRun = task.runId ? lookup.runIds.get(task.runId) : void 0;
			const match = byRun ? earlierCronRow(direct, byRun) : direct;
			if (match) result.cronRecoveryRows.set(task.taskId, match.row);
		}
		return result;
	});
}
//#endregion
//#region src/tasks/task-registry.worker.ts
const log$1 = createSubsystemLogger("state/worker");
function executeTaskRegistryCommand(command, options, open) {
	if (command.type === "flows.maintain") return maintainTaskFlowInDatabase(open(), command.input);
	if (command.type === "tasks.bindExecution" || command.type === "flows.bindExecution") {
		const database = open();
		return runOpenClawStateWriteTransaction(({ db }) => {
			requestSqliteWorkerOperationAdmission({
				stage: "transaction",
				facts: void 0
			});
			const result = command.type === "tasks.bindExecution" ? bindTaskRunExecutionInDatabase(db, command.input.taskId, command.input.binding) : bindTaskFlowExecutionInDatabase(db, command.input.flowId, command.input.binding);
			requestSqliteWorkerOperationAdmission({
				stage: "commit",
				facts: void 0
			});
			return result;
		}, {
			...options,
			database
		}, { operationLabel: command.type === "tasks.bindExecution" ? "task.run.execution-binding" : "task.flow.execution-binding" });
	}
	if (command.type === "tasks.observeAgentEvent") return observeTaskAgentEventInDatabase(open(), command.input);
	if (command.type === "tasks.updateNotificationDelivery" || command.type === "tasks.acknowledgeStateChange" || command.type === "tasks.createRecord" || command.type === "tasks.finalizeActive" || command.type === "tasks.settleUnstarted" || command.type === "flows.createForTask" || command.type === "tasks.linkInitialFlow" || command.type === "flows.deleteUnlinkedForTask" || command.type === "flows.finalizeTaskCancellation") return executeTaskInitialMutation(open(), command);
	const listFlows = (db, ownerKey) => listTaskFlowRecordsForOwnerReadInDatabase(db, ownerKey).map(normalizeRestoredFlowRecord);
	const ownedFlow = (flow, ownerKey) => flow?.ownerKey.trim() === ownerKey ? normalizeRestoredFlowRecord(flow) : void 0;
	if (command.type === "tasks.statusSummary") {
		const read = () => withExistingOpenClawStateDatabaseReadOnly((database) => readTaskRegistryStatusSnapshot(database, command.input.now), options);
		return command.input.preserveSourceArtifacts ? withArtifactPreservingStateReads(read) : read();
	}
	if (command.type === "flows.runTask") {
		let committed;
		try {
			const database = open();
			return withSharedStateWriteCoordinator({
				databasePath: database.path,
				existing: database.db,
				operationLabel: "flows.runTask"
			}, () => runManagedTaskInFlowInDatabase(database.db, command.input, (operation) => runOpenClawStateWriteTransaction(operation, {
				...options,
				database
			}), (result) => {
				committed = result;
			}, {
				assertCurrent: () => requestSqliteWorkerOperationAdmission({
					stage: "transaction",
					facts: {
						kind: "task-registry-mutation",
						operation: command.type,
						taskId: command.input.taskId
					}
				}),
				retainTaskCommit(taskId) {
					const task = readTaskRecord(database.db, taskId);
					if (task?.runId) deferSqliteWorkerCommitReceipt(database.db, captureTaskCreationEventTarget(task, command.type, command.input.taskId));
				}
			}));
		} catch (error) {
			if (committed) {
				log$1.warn("Managed child task operation completed before cleanup failed", {
					flowId: command.input.params.flowId,
					error
				});
				return committed;
			}
			throw error;
		}
	}
	if (command.type === "flows.createManaged" || command.type === "flows.updateManaged") {
		let observed;
		let committed;
		try {
			const database = open();
			return runOpenClawStateWriteTransaction(({ db: writer }) => {
				let result;
				if (command.type === "flows.createManaged") {
					const flow = command.input.flow;
					if (flow.syncMode !== "managed") throw new Error("Worker creation requires a managed flow");
					assertControllerId(flow.controllerId);
					upsertTaskFlowRowInDatabase(writer, bindTaskFlowRecord(flow));
					result = flow;
				} else {
					observed = ownedFlow(readTaskFlowRecord(writer, command.input.flowId), command.input.ownerKey);
					result = !observed ? {
						applied: false,
						reason: "not_found"
					} : observed.syncMode !== "managed" || !observed.controllerId ? {
						applied: false,
						reason: "not_managed",
						current: observed
					} : updateSelectedTaskFlowRecordInDatabase(writer, observed, command.input);
				}
				deferSqlitePostCommitPublication(writer, () => {
					committed = result;
				});
				return result;
			}, {
				...options,
				database
			});
		} catch (error) {
			if (committed) {
				log$1.warn("Managed task-flow write committed before cleanup failed", {
					flowId: command.type === "flows.createManaged" ? command.input.flow.flowId : command.input.flowId,
					error
				});
				return committed;
			}
			if (command.type === "flows.createManaged") throw error;
			log$1.warn("Failed to persist managed task-flow update", {
				flowId: command.input.flowId,
				error
			});
			return {
				applied: false,
				reason: "persist_failed",
				...observed ? { current: observed } : {}
			};
		}
	}
	const database = open();
	if (command.type === "tasks.restore") return restoreTaskRegistryInDatabase(database);
	if (command.type === "flows.syncMirroredTask") return syncTaskMirroredFlowInDatabase(database, command.input);
	if (command.type === "flows.syncLiveMirroredTask") return syncLiveTaskFlowInDatabase(database, command.input);
	const { db } = database;
	return runSqliteDeferredTransactionSync(db, () => {
		switch (command.type) {
			case "flows.snapshot": return readTaskFlowRegistrySnapshot(db);
			case "tasks.get": return readTaskViewRecordInDatabase(db, command.input.taskId);
			case "tasks.findByRunId": return findTaskRecordByRunIdForViewInDatabase(db, command.input.runId);
			case "tasks.list": return listTaskRecordsForOwnerReadInDatabase(db, command.input.ownerKey);
			case "tasks.ownerRecords": return listTaskRecordsByOwnerKeyInDatabase(db, command.input.ownerKey);
			case "tasks.resolve": {
				const { ownerKey, token } = command.input;
				return {
					direct: readTaskViewRecordInDatabase(db, token),
					byRun: findTaskRecordByRunIdForViewInDatabase(db, token),
					related: listTaskRecordsForOwnerReadInDatabase(db, ownerKey, token)
				};
			}
			case "flows.list": return listFlows(db, command.input.ownerKey);
			case "flows.views": return listTaskFlowViewRecordsForOwnerInDatabase(db, command.input.ownerKey).map(normalizeRestoredFlowRecord).map(mapTaskFlowView);
			case "flows.summary": {
				const { ownerKey, flowId } = command.input;
				const flow = ownedFlow(readTaskFlowViewRecordInDatabase(db, flowId), ownerKey);
				return flow ? summarizeTaskRecordsForFlowInDatabase(db, flow.flowId) : void 0;
			}
			case "flows.current": {
				const flow = readTaskFlowRecord(db, command.input.flowId);
				return flow ? normalizeRestoredFlowRecord(flow) : void 0;
			}
			case "flows.read":
			case "flows.detail": {
				const { ownerKey, lookup, token } = command.input;
				const direct = token === void 0 ? void 0 : readTaskFlowRecord(db, token);
				let flow = ownedFlow(direct, ownerKey);
				if (!flow && (lookup === "latest" || lookup === "resolve" && token?.trim() === ownerKey)) {
					const flows = listFlows(db, ownerKey);
					flow = lookup === "resolve" ? flows.find((candidate) => !isTerminalTaskFlow(candidate)) ?? flows[0] : flows[0];
				}
				if (!flow) return;
				return command.type === "flows.detail" ? {
					flow,
					tasks: listTaskRecordsForFlowReadInDatabase(db, flow.flowId)
				} : flow;
			}
			default: throw new Error("Unknown shared-state SQLite command");
		}
	});
}
//#endregion
//#region src/transcripts/store-sqlite-read.ts
function readTranscriptExportOwnership(database, session) {
	return executeSqliteQueryTakeFirstSync(database, meetingTranscriptSessionQuery(database, session).select(["export_manifest_json", "export_pending_json"]));
}
function readTranscriptExportPathCollisions(database, exportKey) {
	return executeSqliteQuerySync(database, meetingTranscriptDb(database).selectFrom("meeting_transcript_sessions").select([
		"session_id",
		"started_at",
		"selector",
		"export_pending_json"
	]).where("export_key", "=", exportKey).orderBy("selector", "asc")).rows;
}
function readTranscriptExportPathOwners(database, exportKey) {
	return executeSqliteQuerySync(database, meetingTranscriptDb(database).selectFrom("meeting_transcript_sessions").select([
		"session_id",
		"started_at",
		"export_manifest_json",
		"export_pending_json"
	]).where("export_key", "=", exportKey).orderBy("selector", "asc")).rows;
}
const summarySnapshotQueries = /* @__PURE__ */ new WeakMap();
/** Runs inside the read worker's transaction so input and replacement basis agree. */
function readTranscriptSummarySnapshot(database, session, maxUtterances) {
	let read = summarySnapshotQueries.get(database);
	if (!read) {
		read = prepareSqliteQueryTakeFirstSync(database, (parameter) => meetingTranscriptDb(database).selectFrom("meeting_transcript_sessions").where("session_id", "=", parameter((value) => value.sessionId)).where("started_at", "=", parameter((value) => value.startedAt)).select([
			"next_utterance_seq",
			"title",
			"source_json",
			"metadata_json",
			"stopped_at",
			"created_at_ms",
			"updated_at_ms"
		]));
		summarySnapshotQueries.set(database, read);
	}
	const row = read(session);
	if (!row) return;
	const summaryRevision = readStoredTranscriptSummaryRevision(database, session);
	return {
		inputRevision: transcriptSummaryInputRevisionFromRow(row),
		nextSequence: row.next_utterance_seq,
		stoppedAt: row.stopped_at ?? void 0,
		summaryRevision: summaryRevision ?? "",
		utterances: readTranscriptUtterances(database, session, maxUtterances)
	};
}
function readTranscriptSessionEntries(database) {
	const rows = executeSqliteQuerySync(database, meetingTranscriptDb(database).selectFrom("meeting_transcript_sessions").selectAll().orderBy("started_at", "desc").orderBy("session_id", "asc")).rows;
	const summaryKeys = readTranscriptSummaryKeys(database);
	return rows.map((row) => ({
		session: sessionFromRow(row),
		selector: row.selector,
		hasSummary: summaryKeys.has(`${row.session_id}\0${row.started_at}`)
	}));
}
function readTranscriptSessionMatches(database, value) {
	const query = meetingTranscriptDb(database).selectFrom("meeting_transcript_sessions").selectAll().orderBy("started_at", "desc").limit(2);
	const matchedEntry = (row) => {
		const hasSummary = Boolean(executeSqliteQueryTakeFirstSync(database, meetingTranscriptDb(database).selectFrom("meeting_transcript_summaries").select("session_id").where("session_id", "=", row.session_id).where("session_started_at", "=", row.started_at).limit(1)));
		return {
			session: sessionFromRow(row),
			selector: row.selector,
			hasSummary,
			inputRevision: transcriptSummaryInputRevisionFromRow(row)
		};
	};
	const entries = (selection) => executeSqliteQuerySync(database, selection).rows.map(matchedEntry);
	const canonical = entries(query.where("selector", "=", value))[0];
	const date = value.match(/^(\d{4}-\d{2}-\d{2})\//u)?.[1];
	return {
		qualified: canonical ? [canonical] : date ? entries(query.where("session_id", "=", value.slice(11)).where("started_at", "like", `${date}T%`)) : [],
		unqualified: [...entries(query.where("session_id", "=", value)), ...entries(query.where("session_slug", "=", value).where("session_id", "!=", value))]
	};
}
function readTranscriptSessionByIdentity(database, session) {
	const row = executeSqliteQueryTakeFirstSync(database, meetingTranscriptSessionQuery(database, session).selectAll());
	return row ? sessionFromRow(row) : void 0;
}
function readTranscriptUtterances(database, session, maxUtterances) {
	const limit = resolveOptionalIntegerOption(maxUtterances, { min: 1 });
	const query = meetingTranscriptUtteranceQuery(database, session).selectAll();
	if (limit === void 0) return executeSqliteQuerySync(database, query.orderBy("sequence", "asc")).rows.map(utteranceFromRow);
	return executeSqliteQuerySync(database, query.orderBy("sequence", "desc").limit(limit)).rows.toReversed().map(utteranceFromRow);
}
function readStoredTranscriptSummary(database, session) {
	const row = executeSqliteQueryTakeFirstSync(database, meetingTranscriptDb(database).selectFrom("meeting_transcript_summaries").selectAll().where("session_id", "=", session.sessionId).where("session_started_at", "=", session.startedAt));
	if (!row) return {};
	const summary = summaryFromRow(row);
	return {
		...summary ? { summary } : {},
		...row.markdown !== null ? { markdown: row.markdown } : {}
	};
}
function readTranscriptJsonlDigest(database, session) {
	const query = meetingTranscriptUtteranceQuery(database, session).selectAll().orderBy("sequence", "asc");
	const digest = createHash("sha256");
	for (const row of iterateSqliteQuerySync(database, query)) digest.update(`${JSON.stringify(utteranceFromRow(row))}\n`);
	return digest.digest("hex");
}
//#endregion
//#region src/transcripts/store-worker-read.ts
/** Expected reader refusals retain their domain type; native failures use the shared codec. */
function executeTranscriptRead(target, command) {
	ensureMeetingTranscriptsSchema({
		...target,
		env: getSqliteWorkerStateContext().environment,
		readOnly: command.input.readOnly
	});
	const database = target.database.db;
	try {
		switch (command.type) {
			case "transcripts.readEntries": return {
				ok: true,
				value: queryTranscriptReadEntries(database, command.input.params, createPreparedTranscriptDateReader())
			};
			case "transcripts.exportOwnership": return {
				ok: true,
				value: readTranscriptExportOwnership(database, command.input.params.session)
			};
			case "transcripts.exportPathCollisions": return {
				ok: true,
				value: readTranscriptExportPathCollisions(database, command.input.params.exportKey)
			};
			case "transcripts.exportPathOwners": return {
				ok: true,
				value: readTranscriptExportPathOwners(database, command.input.params.exportKey)
			};
			case "transcripts.summarySnapshot": return {
				ok: true,
				value: runSqliteDeferredTransactionSync(database, () => readTranscriptSummarySnapshot(database, command.input.params.session, command.input.params.maxUtterances))
			};
			case "transcripts.sessionEntries": return {
				ok: true,
				value: runSqliteDeferredTransactionSync(database, () => readTranscriptSessionEntries(database))
			};
			case "transcripts.matches": return {
				ok: true,
				value: runSqliteDeferredTransactionSync(database, () => readTranscriptSessionMatches(database, command.input.params.value))
			};
			case "transcripts.session": return {
				ok: true,
				value: readTranscriptSessionByIdentity(database, command.input.params.session)
			};
			case "transcripts.entry": return {
				ok: true,
				value: readTranscriptEntry(database, command.input.params.selector, command.input.params.purpose)
			};
			case "transcripts.latest": return {
				ok: true,
				value: readLatestTranscriptEntry(database)
			};
			case "transcripts.notes": return {
				ok: true,
				value: readStoredTranscriptNotes(database, command.input.params.session, command.input.params.purpose)
			};
			case "transcripts.libraryEntry": return {
				ok: true,
				value: runSqliteDeferredTransactionSync(database, () => readTranscriptLibraryEntry(database, command.input.params))
			};
			case "transcripts.recentStopped": return {
				ok: true,
				value: readRecentStoppedTranscriptSession(database, command.input.params.source, command.input.params.stoppedAfter, command.input.params.stoppedBefore)
			};
			case "transcripts.summaryRevision": return {
				ok: true,
				value: readTranscriptSummaryInputRevision(database, command.input.params.session)
			};
			case "transcripts.utterances": return {
				ok: true,
				value: readTranscriptUtterances(database, command.input.params.session, command.input.params.maxUtterances)
			};
			case "transcripts.summary": return {
				ok: true,
				value: readStoredTranscriptSummary(database, command.input.params.session)
			};
			case "transcripts.exportDigest": return {
				ok: true,
				value: readTranscriptJsonlDigest(database, command.input.params.session)
			};
			default: throw new Error("Unknown transcript SQLite command");
		}
	} catch (error) {
		if (!(error instanceof TranscriptLibraryError)) throw error;
		return {
			ok: false,
			error: {
				type: error.type,
				message: error.message,
				maxBytes: error.maxBytes
			}
		};
	}
}
//#endregion
//#region src/transcripts/store-worker-write.ts
function executeTranscriptWrite(command, target) {
	const options = {
		...target,
		env: getSqliteWorkerStateContext().environment,
		readOnly: command.input.readOnly
	};
	ensureMeetingTranscriptsSchema(options);
	try {
		runOpenClawStateWriteTransaction(({ db }) => {
			requestSqliteWorkerOperationAdmission({
				stage: "transaction",
				facts: void 0
			});
			if (command.type === "transcripts.append") appendMeetingTranscriptUtterance({
				...command.input,
				database: db
			});
			else {
				const { session, summaryValues, guard } = command.input;
				writeMeetingTranscriptSummaryInDatabase(db, session, summaryValues, guard);
			}
			requestSqliteWorkerOperationAdmission({
				stage: "commit",
				facts: void 0
			});
		}, options, { operationLabel: command.type === "transcripts.append" ? "meeting-transcripts.utterance.append" : "meeting-transcripts.summary.write" });
		return command.type === "transcripts.writeSummary" ? { ok: true } : void 0;
	} catch (error) {
		if (command.type === "transcripts.writeSummary" && error instanceof TranscriptsSummaryChangedError) return {
			ok: false,
			reason: "changed"
		};
		throw error;
	}
}
//#endregion
//#region src/state/backup-run-records.kernel.ts
/** The caller owns one transaction for both insertion and retention. */
function recordBackupRunInDatabase(db, row) {
	const kysely = getNodeSqliteKysely(db);
	executeSqliteQuerySync(db, kysely.insertInto("backup_runs").values(row));
	executeSqliteQuerySync(db, kysely.deleteFrom("backup_runs").where("id", "in", kysely.selectFrom("backup_runs").select("id").orderBy("created_at", "desc").orderBy("id", "desc").limit(2147483647).offset(200)));
}
//#endregion
//#region src/state/onboarding-recommendations.kernel.ts
function matchesExpectedOnboardingRecommendations(current, expected) {
	return current.inventoryHash === expected.inventoryHash && JSON.stringify(current.matches) === JSON.stringify(expected.matches) && current.offeredAt === expected.offeredAt && current.acceptedAt === expected.acceptedAt && current.updatedAt === expected.updatedAt;
}
function writeOnboardingRecommendationsOffer(configKey, params, databaseOptions = {}) {
	const nowMs = params.nowMs;
	const inventoryHash = params.inventoryHash;
	const matches = params.matches;
	const acceptedAt = params.answered ? nowMs : null;
	return updateConfigMachineState(configKey, (existing) => {
		if (typeof existing?.acceptedAt === "number") return existing;
		return {
			inventoryHash,
			matches,
			offeredAt: nowMs,
			acceptedAt,
			updatedAt: nowMs
		};
	}, databaseOptions);
}
function acknowledgeOnboardingRecommendations(configKey, params = {}, databaseOptions = {}) {
	const nowMs = params.nowMs ?? Date.now();
	let acknowledged = null;
	updateConfigMachineState(configKey, (existing) => {
		if (!existing) return;
		if (params.expected && !matchesExpectedOnboardingRecommendations(existing, params.expected)) return existing;
		acknowledged = typeof existing.acceptedAt === "number" ? existing : {
			...existing,
			acceptedAt: nowMs,
			updatedAt: nowMs
		};
		return acknowledged;
	}, databaseOptions);
	return acknowledged;
}
function updatePendingOnboardingRecommendations(configKey, params, databaseOptions = {}) {
	const nowMs = params.nowMs;
	const matches = params.matches;
	let updated = null;
	updateConfigMachineState(configKey, (existing) => {
		if (!existing || typeof existing.acceptedAt === "number" || !matchesExpectedOnboardingRecommendations(existing, params.expected)) return existing;
		updated = {
			...existing,
			matches,
			updatedAt: nowMs
		};
		return updated;
	}, databaseOptions);
	return updated;
}
function clearPendingOnboardingRecommendations(configKey, params, databaseOptions = {}) {
	let cleared = false;
	updateConfigMachineState(configKey, (existing) => {
		if (!existing || existing.acceptedAt !== null || !matchesExpectedOnboardingRecommendations(existing, params.expected)) return existing;
		cleared = true;
	}, databaseOptions);
	return cleared;
}
function clearOnboardingRecommendations(configKey, databaseOptions = {}) {
	return deleteConfigMachineState(configKey, databaseOptions);
}
function executeOnboardingRecommendationCommand(command, database) {
	switch (command.type) {
		case "onboardingRecommendations.writeOffer": return writeOnboardingRecommendationsOffer(command.input.configKey, command.input.params, database);
		case "onboardingRecommendations.acknowledge": return acknowledgeOnboardingRecommendations(command.input.configKey, command.input.params, database);
		case "onboardingRecommendations.updatePending": return updatePendingOnboardingRecommendations(command.input.configKey, command.input.params, database);
		case "onboardingRecommendations.clearPending": return clearPendingOnboardingRecommendations(command.input.configKey, command.input.params, database);
		case "onboardingRecommendations.clear": return clearOnboardingRecommendations(command.input.configKey, database);
	}
	throw new Error("Unexpected onboarding recommendation write command");
}
//#endregion
//#region src/state/user-preferences.worker.ts
function executeUserPreferenceCommand(command, options) {
	ensureUserProfilesSchema(options);
	if (command.type === "userPreferences.write") {
		const { update } = command.input;
		if (update.serialized.length === 0 && update.deletionKeys.length === 0 && update.expected.length === 0) {
			const profile = selectResolvedUserProfileMetadataById(openOpenClawStateDatabase(options).db, command.input.profileId);
			return profile ? ok({ profileId: profile.id }) : void 0;
		}
		ensureUserPreferencesSchema(options);
		return runOpenClawStateWriteTransaction(({ db }) => {
			requestSqliteWorkerOperationAdmission({
				stage: "transaction",
				facts: void 0
			});
			const profile = selectResolvedUserProfileMetadataById(db, command.input.profileId);
			if (!profile) return;
			const result = writeUserPreferences(db, profile.id, command.input.update);
			requestSqliteWorkerOperationAdmission({
				stage: "commit",
				facts: void 0
			});
			return result.ok ? ok({ profileId: profile.id }) : result;
		}, options, { operationLabel: "users.preferences.set" });
	}
	if (command.input.keys?.length !== 0) ensureUserPreferencesSchema(options);
	const { db } = openOpenClawStateDatabase(options);
	return runSqliteDeferredTransactionSync(db, () => {
		const profile = selectResolvedUserProfileMetadataById(db, command.input.profileId);
		return profile ? {
			profileId: profile.id,
			entries: readUserPreferences(db, profile.id, command.input.keys)
		} : void 0;
	});
}
//#endregion
//#region src/state/user-channel-identities.worker.ts
function readUserChannelIdentityResult(operation) {
	try {
		return {
			ok: true,
			value: operation()
		};
	} catch (error) {
		if (error instanceof UserChannelIdentityConflictError) return {
			ok: false,
			kind: "conflict"
		};
		if (error instanceof UserProfileNotFoundError) return {
			ok: false,
			kind: "not-found"
		};
		if (error instanceof UserProfileOwnerError) return {
			ok: false,
			kind: "owner",
			code: error.code
		};
		throw error;
	}
}
function executeUserChannelIdentityChange(input, options) {
	const subject = userChannelIdentitySubject(input.identity);
	let changed = false;
	const mutationOptions = {
		...options,
		beforeChange(db) {
			changed = true;
			requestSqliteWorkerOperationAdmission({
				stage: "transaction",
				facts: {
					kind: "channel-identity",
					subject
				}
			});
			deferSqliteWorkerCommitReceipt(db, {
				kind: "channel-identity",
				subject
			});
		}
	};
	ensureUserProfilesSchema(options);
	return readUserChannelIdentityResult(() => runOpenClawStateWriteTransaction(() => {
		const value = input.action === "link" ? {
			kind: "linked",
			link: linkUserChannelIdentity(input.profileId, input.identity, mutationOptions)
		} : {
			kind: "unlinked",
			removed: unlinkUserChannelIdentity(input.profileId, input.identity, mutationOptions)
		};
		if (changed) requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: {
				kind: "channel-identity",
				subject
			}
		});
		return value;
	}, options, { operationLabel: "user-profiles.channel-identity-change" }));
}
//#endregion
//#region src/state/user-profile-writes.worker.ts
function isUserProfileWriteCommand(command) {
	return command.type === "userProfiles.setRole" || command.type === "userProfiles.linkEmail" || command.type === "userProfiles.ensureEmail" || command.type === "userProfiles.ensureTailscale" || command.type === "userProfiles.syncGitHub" || command.type === "userProfiles.ensureOwner";
}
function executeUserProfileWrite(command, options) {
	let pending;
	let sequence = 0;
	const committed = [];
	let linkedDisplay;
	const mutation = {
		runTransaction(db, operation) {
			if (pending) return operation();
			const current = {
				before: /* @__PURE__ */ new Map(),
				emailBindings: /* @__PURE__ */ new Map(),
				display: /* @__PURE__ */ new Set(),
				profiles: /* @__PURE__ */ new Set(),
				identities: /* @__PURE__ */ new Set()
			};
			pending = current;
			try {
				requestSqliteWorkerOperationAdmission({
					stage: "transaction",
					facts: {
						kind: "user-profile-write",
						operation: command.type
					}
				});
				const value = operation();
				if (command.type === "userProfiles.linkEmail") {
					const linked = requireResolvedUserProfileMetadataById(db, command.input.targetProfileId);
					const row = selectProfileDisplayEntries(db, [linked.id])[0]?.[1];
					if (!row) throw new UserProfileNotFoundError(linked.id);
					linkedDisplay = projectUserProfileDisplay(row);
				}
				const afterBindings = new Map(readUserProfileEmailBindings(db, [...current.before.keys()]).map((binding) => [binding.email, binding]));
				const emailBindings = [.../* @__PURE__ */ new Set([...current.emailBindings.keys(), ...afterBindings.keys()])].flatMap((email) => {
					const before = current.emailBindings.get(email) ?? null;
					const after = afterBindings.get(email) ?? null;
					if (before?.profileId === after?.profileId && before?.bindingId === after?.bindingId) return [];
					for (const binding of [before, after]) if (binding) {
						current.display.add(binding.profileId);
						current.profiles.add(binding.profileId);
					}
					return [{
						email,
						before,
						after
					}];
				});
				const ids = [...current.display];
				const after = new Map(ids.length ? selectProfileDisplayEntries(db, ids) : []);
				const publication = {
					kind: "user-profile-mutation",
					sequence: ++sequence,
					changes: {
						profiles: [...current.profiles],
						identities: [...current.identities],
						channels: []
					},
					before: ids.map((id) => {
						if (!current.before.has(id)) throw new Error("Profile publication requires its transaction's original row");
						return [id, current.before.get(id)];
					}),
					after: ids.map((id) => [id, after.get(id)]),
					emailBindings
				};
				requestSqliteWorkerOperationAdmission({
					stage: "commit",
					facts: publication
				});
				deferSqlitePostCommitPublication(db, () => committed.push(publication));
				deferSqliteWorkerCommitReceipt(db, {
					kind: "user-profile-commits",
					publications: [...committed, publication]
				});
				return value;
			} finally {
				pending = void 0;
			}
		},
		before(db, ...ids) {
			const current = pending;
			if (!current) throw new Error("Profile mutation requires its original transaction");
			const missing = ids.filter((id) => !current.before.has(id));
			const rows = new Map(missing.length ? selectProfileDisplayEntries(db, missing) : []);
			for (const id of missing) current.before.set(id, rows.get(id));
			for (const binding of readUserProfileEmailBindings(db, missing)) if (!current.emailBindings.has(binding.email)) current.emailBindings.set(binding.email, binding);
		},
		authority: (...ids) => ids.forEach((id) => pending?.profiles.add(id)),
		identity: (...ids) => ids.forEach((id) => pending?.identities.add(id)),
		publish: (...ids) => ids.forEach((id) => pending?.display.add(id))
	};
	const owned = {
		...options,
		mutation
	};
	try {
		switch (command.type) {
			case "userProfiles.setRole": return {
				ok: true,
				value: setUserProfileRole(command.input.profileId, command.input.role, owned)
			};
			case "userProfiles.linkEmail": {
				const profile = linkEmail(command.input.email, command.input.targetProfileId, owned);
				if (!linkedDisplay) throw new Error("Linked profile publication is unavailable");
				return {
					ok: true,
					value: {
						profile,
						display: linkedDisplay
					}
				};
			}
			case "userProfiles.ensureEmail": return {
				ok: true,
				value: ensureProfileForEmail(command.input.email, owned)
			};
			case "userProfiles.ensureTailscale": return {
				ok: true,
				value: ensureProfileForTailscaleIdentity(command.input, owned)
			};
			case "userProfiles.syncGitHub": return {
				ok: true,
				value: syncGitHubIdentity(command.input, owned)
			};
			case "userProfiles.ensureOwner": return {
				ok: true,
				value: ensureGatewayOwnerProfile(command.input.displayName, owned)
			};
		}
		return command;
	} catch (error) {
		if (error instanceof UserProfileNotFoundError) return {
			ok: false,
			kind: "not-found",
			profileId: error.profileId
		};
		if (error instanceof UserProfileOwnerError) return {
			ok: false,
			kind: "owner",
			code: error.code
		};
		throw error;
	}
}
//#endregion
//#region src/state/user-profiles.worker.ts
function executeUserProfileReadCommand(command, options) {
	if (command.type === "userProfiles.list") return listUserProfilesSync(options);
	const database = openOpenClawStateDatabase(options);
	ensureUserProfilesSchema(options, database);
	return runSqliteDeferredTransactionSync(database.db, () => {
		const profiles = listUserProfilesSync(options).filter((profile) => profile.mergedInto === null);
		const logins = listUserProfileGitHubLogins(options);
		return {
			profiles: profiles.slice(0, command.input.limit).map(({ id }) => ({
				id,
				logins: logins.get(id) ?? []
			})),
			truncated: profiles.length > command.input.limit
		};
	}, {
		databaseLabel: database.path,
		operationLabel: "user-profiles.directory"
	});
}
function executeUserProfileAvatarCommand(command, options) {
	if (command.type === "userProfiles.avatar.inspect") {
		const profile = selectResolvedUserProfileById(openOpenClawStateDatabase(options).db, command.input.profileId);
		return {
			profile: profile && toUserProfile(profile),
			hasAvatar: profile !== void 0 && profile.avatar !== null
		};
	}
	const { input } = command;
	const sha256 = createHash("sha256").update(input.bytes).digest("hex");
	return runOpenClawStateWriteTransaction(({ db }) => {
		const profile = selectResolvedUserProfileById(db, input.profileId);
		if (!profile) return { profile: void 0 };
		if (profile.avatar !== null) return { profile: toUserProfile(profile) };
		const before = selectProfileDisplayEntries(db, [profile.id])[0][1];
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: {
				kind: "profile-avatar",
				before
			}
		});
		executeSqliteQuerySync(db, userProfilesDb(db).updateTable("user_profiles").set({
			avatar: input.bytes,
			avatar_mime: input.mime,
			avatar_sha256: sha256,
			updated_at: input.now
		}).where("id", "=", profile.id));
		const committed = selectProfileDisplayEntries(db, [profile.id])[0][1];
		return {
			profile: toUserProfile({
				...profile,
				avatar_mime: input.mime,
				updated_at: input.now
			}),
			committed
		};
	}, options, { operationLabel: "user-profiles.adopt-avatar" });
}
function isUserProfileCommand(command) {
	return isUserProfileWriteCommand(command) || command.type === "userProfiles.list" || command.type === "userProfiles.directory" || command.type === "userProfiles.channelIdentity.change" || command.type === "userProfiles.avatar.inspect" || command.type === "userProfiles.avatar.adopt";
}
function executeUserProfileCommand(command, options) {
	if (isUserProfileWriteCommand(command)) return executeUserProfileWrite(command, options);
	if (command.type === "userProfiles.channelIdentity.change") return executeUserChannelIdentityChange(command.input, options);
	if (command.type === "userProfiles.list" || command.type === "userProfiles.directory") return executeUserProfileReadCommand(command, options);
	return executeUserProfileAvatarCommand(command, options);
}
//#endregion
//#region src/state/openclaw-state-worker-runtime.ts
const log = createSubsystemLogger("state/worker");
function executeSharedStateCommand(command, context, open, hasNativeDatabase) {
	if (command.type === "deviceAuth.prepare") return;
	if (isMcpOAuthWorkerCommand(command)) return executeMcpOAuthWorkerCommand(open(), command);
	if (command.type === "execApprovals.commitAuthorizations" || isOperatorApprovalCommand(command)) {
		const databaseOptions = {
			database: open(),
			path: context.databasePath,
			env: getSqliteWorkerStateContext().environment
		};
		return command.type === "execApprovals.commitAuthorizations" ? commitExecAuthorizationsInWorker(command.input, databaseOptions) : executeOperatorApprovalCommand(command, databaseOptions);
	}
	if (isDevicePairingMutationCommand(command)) return executeDevicePairingMutationInWorker(command, open());
	if (isWorkerEnvironmentCommand(command)) return executeWorkerEnvironmentCommand(command, open());
	if (command.type === "audit.events.list") return listAuditEventsInDatabase(open().db, command.input);
	if (command.type === "conversationBindings.readSelection") return readCurrentConversationBindingSelectionInWorker(command.input, context.databasePath);
	if (command.type === "audit.writer.process" || command.type === "audit.writer.prune") return executeAuditWriterCommand(command, {
		path: context.databasePath,
		env: getSqliteWorkerStateContext().environment
	}, open);
	if (command.type === "authProfiles.read" || command.type === "authProfiles.sharedOwnership" || command.type === "authProfiles.personal") {
		const read = () => {
			const options = {
				path: context.databasePath,
				env: getSqliteWorkerStateContext().environment
			};
			if (command.type === "authProfiles.sharedOwnership") return readConfigMachineState(SHARED_AUTH_STORE_STATE_KEY, options);
			if (command.type === "authProfiles.personal") return readUserModelAuthProfile(command.input.profileId, options);
			const missing = {
				store: {
					status: "missing",
					reason: "database"
				},
				state: {
					status: "missing",
					reason: "database"
				},
				cacheable: false
			};
			try {
				return withExistingOpenClawStateDatabaseReadOnly(({ db }) => readAuthProfileRows(db, context.databasePath, "shared-state"), options) ?? missing;
			} catch {
				return isMissingDatabasePath(context.databasePath) ? missing : {
					store: { status: "unreadable" },
					state: { status: "unreadable" },
					cacheable: false
				};
			}
		};
		return command.input.artifactPreserving ? withArtifactPreservingStateReads(read) : read();
	}
	if (command.type === "promotions.markNotified" || command.type === "promotions.recordClaim") return executePromotionCommand(command, {
		path: context.databasePath,
		env: getSqliteWorkerStateContext().environment
	}, open);
	if (command.type === "doctor.databaseBloat") return readSqliteDatabaseBloat({
		path: context.databasePath,
		env: getSqliteWorkerStateContext().environment
	});
	if (command.type === "telemetry.readState") return readTelemetryStateInWorker({
		path: context.databasePath,
		env: getSqliteWorkerStateContext().environment
	});
	if (command.type === "telemetry.countRecentSessions") return withExistingOpenClawStateDatabaseReadOnly(({ db }) => countRecentTelemetrySessionsInDatabase(db, command.input.sinceMs), {
		path: context.databasePath,
		env: getSqliteWorkerStateContext().environment
	}) ?? 0;
	if (command.type === "webPush.readPersistedVapidKeyPair") return readPersistedVapidKeyPairInDatabase({
		path: context.databasePath,
		env: getSqliteWorkerStateContext().environment
	});
	if (command.type === "webPush.findBoundWebPushSubscriptionByEndpoint" || command.type === "webPush.setWebPushSubscriptionPreferences" || command.type === "webPush.listWebPushSubscriptions" || command.type === "webPush.hasBoundWebPushSubscriptions" || command.type === "webPush.listBoundWebPushSubscriptions" || command.type === "webPush.prepareWebPushApprovalDeliveries" || command.type === "webPush.listWebPushApprovalDeliveryTargets" || command.type === "webPush.deleteWebPushApprovalDeliveryTargets" || command.type === "webPush.listTerminalWebPushApprovalDeliveryIds" || command.type === "webPush.upsertWebPushSubscription" || command.type === "webPush.deleteBoundWebPushSubscription" || command.type === "webPush.deleteWebPushSubscriptionIfCurrent" || command.type === "webPush.insertVapidKeyPairIfAbsent") return executeWebPushCommand(command, open());
	if (command.type === "nativeHookRelay.read") return withOpenClawStateDatabaseReadOnly((database) => readNativeHookRelayBridgeSnapshotFromDatabase({
		database,
		relayId: command.input.relayId
	})?.record, {
		path: context.databasePath,
		env: getSqliteWorkerStateContext().environment
	});
	if (isTaskRegistryWorkerCommand(command)) return executeTaskRegistryCommand(command, {
		path: context.databasePath,
		env: getSqliteWorkerStateContext().environment
	}, open);
	if (command.type === "doctor.workshopMigrationRecords.read") return withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(({ db }) => readWorkshopMigrationRecordsInDatabase(db, command.input.includeEvents), {
		path: context.databasePath,
		env: getSqliteWorkerStateContext().environment
	});
	if (command.type === "modelCatalog.remote.read") {
		const read = () => readRemoteModelCatalog({
			path: context.databasePath,
			env: getSqliteWorkerStateContext().environment
		});
		return command.input.artifactPreservingReadOnly ? withArtifactPreservingStateReads(read) : read();
	}
	if (command.type === "plugins.conversationBindingApprovals.read") return readPluginBindingApprovalsInDatabase(open().db);
	if (command.type === "plugins.conversationBindingApprovals.upsert") {
		const database = open();
		return runOpenClawStateWriteTransaction(({ db }) => upsertPluginBindingApprovalInDatabase(db, command.input), {
			database,
			path: context.databasePath,
			env: getSqliteWorkerStateContext().environment
		});
	}
	if (command.type === "updateRuns.reconcileInterrupted") return persistInterruptedUpdateObservation(command.input, {
		path: context.databasePath,
		env: getSqliteWorkerStateContext().environment
	}, (stage) => requestSqliteWorkerOperationAdmission({
		stage,
		facts: void 0
	}));
	if (command.type === "plugins.deferredMigrations.read") return readDeferredPluginMigrations({
		path: context.databasePath,
		env: getSqliteWorkerStateContext().environment,
		artifactPreservingReadOnly: command.input.artifactPreservingReadOnly
	});
	if (command.type === "claws.install-schema-versions") return (command.input.artifactPreservingReadOnly ? withExistingOpenClawStateDatabaseArtifactPreservingReadOnly : withExistingOpenClawStateDatabaseReadOnly)(({ db, path: pathname }) => {
		assertOpenClawStateDatabaseOwner(db, { pathname });
		return readClawInstallSchemaVersionRows(db);
	}, {
		path: context.databasePath,
		env: getSqliteWorkerStateContext().environment
	});
	if (command.type === "database.generationMatches") return sameSqliteFileGeneration(command.input.generation, readStableSqliteFileGeneration(context.databasePath));
	if (isOnboardingRecommendationWriteCommand(command)) return executeOnboardingRecommendationCommand(command, {
		database: open(),
		path: context.databasePath,
		env: getSqliteWorkerStateContext().environment
	});
	if (command.type === "userPreferences.read" || command.type === "userPreferences.write") return executeUserPreferenceCommand(command, {
		database: open(),
		path: context.databasePath,
		env: getSqliteWorkerStateContext().environment
	});
	if (isUserProfileCommand(command)) return executeUserProfileCommand(command, {
		database: open(),
		path: context.databasePath,
		env: getSqliteWorkerStateContext().environment
	});
	if (isPluginBlobWorkerCommand(command)) return executePluginBlobCommand(command, context.databasePath, open);
	if (isPluginStateWorkerCommand(command)) return executePluginStateCommand(command, {
		path: context.databasePath,
		env: getSqliteWorkerStateContext().environment
	}, open, hasNativeDatabase);
	if (command.type === "config.health.read") return (command.input.artifactPreserving ? withExistingOpenClawStateDatabaseArtifactPreservingReadOnly : withExistingOpenClawStateDatabaseReadOnly)(({ db }) => readConfigHealthSnapshotInDatabase(db), {
		path: context.databasePath,
		env: getSqliteWorkerStateContext().environment
	}) ?? {
		state: {},
		basis: {}
	};
	if (command.type === "deviceAuth.read" || command.type === "deviceAuth.readOrigin") {
		const read = (db) => command.type === "deviceAuth.read" ? readDeviceAuthTokenObservationFromDatabase(db, command.input) : readOriginDeviceTokenObservationFromDatabase(db, command.input);
		return command.input.readOnly ? withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(({ db }) => read(db), {
			path: context.databasePath,
			env: getSqliteWorkerStateContext().environment
		}) ?? {
			entry: null,
			expectedToken: null
		} : read(open().db);
	}
	const database = open();
	if (command.type === "githubRepository.personalPending") return readPendingRepositoryGitHubPublicationInDatabase(database.db, command.input);
	if (isSkillWorkshopCommand(command)) return executeSkillWorkshopCommand(command, database, context.databasePath);
	if (command.type === "deviceAuth.list") return readDeviceAuthTokensFromDatabase(database.db, command.input);
	if (command.type === "transcripts.append" || command.type === "transcripts.writeSummary") return executeTranscriptWrite(command, {
		database,
		path: context.databasePath
	});
	switch (command.type) {
		case "transcripts.readEntries":
		case "transcripts.exportOwnership":
		case "transcripts.exportPathCollisions":
		case "transcripts.exportPathOwners":
		case "transcripts.sessionEntries":
		case "transcripts.matches":
		case "transcripts.session":
		case "transcripts.entry":
		case "transcripts.latest":
		case "transcripts.notes":
		case "transcripts.libraryEntry":
		case "transcripts.recentStopped":
		case "transcripts.summaryRevision":
		case "transcripts.summarySnapshot":
		case "transcripts.utterances":
		case "transcripts.exportDigest":
		case "transcripts.summary": return executeTranscriptRead({
			database,
			path: context.databasePath
		}, command);
	}
	if (command.type === "managedImages.read") return readManagedImageRecordInDatabase(database.db, command.input.attachmentId);
	if (command.type === "managedImages.entries") return listManagedImageRecordEntriesInDatabase(database.db, command.input.sessionKey);
	if (command.type === "managedImages.originalMediaIds") return listManagedImageOriginalMediaIdsInDatabase(database.db);
	if (isApnsRegistrationWorkerCommand(command)) return executeApnsRegistrationCommand(command, database);
	if (command.type === "plugins.catalogSnapshot.read") return readHostedCatalogSnapshotInDatabase(database.db, command.input.url);
	if (command.type === "nativeHookRelay.listSnapshots") return listNativeHookRelayBridgeSnapshotsInDatabase(database);
	if (command.type === "nativeHookRelay.write" || command.type === "nativeHookRelay.renew" || command.type === "nativeHookRelay.deleteOwned" || command.type === "nativeHookRelay.prune") return executeNativeHookRelayMutation(command, {
		database,
		path: context.databasePath,
		env: getSqliteWorkerStateContext().environment
	});
	if (command.type === "sessionUpstream.listWatched") return listWatchedSessionUpstreamLinksInDatabase(database.db);
	if (isCronStateWorkerCommand(command)) return executeCronStateCommand(command, database);
	if (isSessionDeliveryCommand(command)) return executeSessionDeliveryCommand(command, database);
	const writeOptions = {
		database,
		path: context.databasePath,
		env: getSqliteWorkerStateContext().environment
	};
	if (command.type === "secrets.purge") return purgeExpiredSecretStoreEntriesInDatabase(command.input, writeOptions);
	if (command.type === "conversationBindings.resolve" || command.type === "conversationBindings.touch") return executeCurrentConversationBindingCommand(command, writeOptions);
	if (isNodeWorkerJournalCommand(command)) return executeNodeWorkerJournalCommand(command, writeOptions);
	if (command.type === "sessionGroups.mutate") return mutateSessionGroupCatalogInDatabase(database, command.input, writeOptions.env);
	if (isDeliveryQueueCommand(command)) return executeDeliveryQueueCommand(command, writeOptions);
	if (isSkillUploadCommand(command)) return executeSkillUploadCommand(command, writeOptions);
	if (command.type === "deviceAuth.store" || command.type === "deviceAuth.storeOrigin" || command.type === "deviceAuth.clear" || command.type === "deviceAuth.clearOrigin") return runOpenClawStateWriteTransaction(({ db }) => {
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: void 0
		});
		const result = command.type === "deviceAuth.store" ? storeDeviceAuthTokenInDatabase(db, command.input) : command.type === "deviceAuth.storeOrigin" ? storeOriginDeviceTokenInDatabase(db, command.input) : command.type === "deviceAuth.clear" ? clearDeviceAuthTokenFromDatabase(db, command.input) : clearOriginDeviceTokenInDatabase(db, command.input);
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: void 0
		});
		return result;
	}, writeOptions);
	if (command.type === "fleet.cell.reserve" || command.type === "fleet.cell.updateImage" || command.type === "fleet.cell.delete" || command.type === "fleet.operation.acquire" || command.type === "fleet.operation.heartbeat" || command.type === "fleet.operation.release") return executeFleetRegistryCommand(command, writeOptions);
	if (command.type === "agentProvenance.readBatch" || command.type === "agentProvenance.list") {
		ensureAgentProvenanceSchema(writeOptions);
		return command.type === "agentProvenance.readBatch" ? readAgentProvenanceBatchInDatabase(database.db, command.input.agentIds) : listAgentProvenanceInDatabase(database.db);
	}
	if (command.type === "telemetry.persistSuccess") return runOpenClawStateWriteTransaction(({ db }) => persistTelemetrySuccessInDatabase(db, command.input.state, command.input.updatedAtMs), writeOptions, { operationLabel: "config-machine-state.update" });
	if (command.type === "sessionState.recordGoalChange") return runOpenClawStateWriteTransaction(({ db }) => recordSessionStateEventInDatabase(db, command.input.event, command.input.now).notices, writeOptions);
	if (command.type === "sessionState.prune") return runOpenClawStateWriteTransaction(({ db }) => pruneSessionStateEventsInDatabase(db, command.input.now), writeOptions);
	if (command.type === "plugins.catalogSnapshot.write") try {
		runOpenClawStateWriteTransaction(({ db }) => writeHostedCatalogSnapshotInDatabase(db, command.input.snapshot, command.input.now), writeOptions);
		return { ok: true };
	} catch (error) {
		if (error instanceof HostedCatalogSignedFeedMonotonicityError) return {
			ok: false,
			message: error.message
		};
		throw error;
	}
	if (command.type === "subagents.persistChanges") {
		const { writeId, values, deleteRunIds } = command.input;
		let committed = false;
		try {
			runOpenClawStateWriteTransaction((writer) => {
				requestSqliteWorkerOperationAdmission({
					stage: "transaction",
					facts: writeId
				});
				writeSubagentRunValuesInDatabase(writer, values, deleteRunIds);
				requestSqliteWorkerOperationAdmission({
					stage: "commit",
					facts: writeId
				});
				deferSqlitePostCommitPublication(writer.db, () => {
					committed = true;
				});
			}, writeOptions);
		} catch (error) {
			if (!committed) throw error;
			log.warn("Subagent registry write committed before cleanup failed", { error });
		}
		return { writeId };
	}
	if (command.type === "backup.recordOutcome") return runOpenClawStateWriteTransaction(({ db }) => recordBackupRunInDatabase(db, command.input), writeOptions);
	if (command.type === "projects.findRoot") {
		ensureProjectRegistrySchema(writeOptions);
		return resolveRecordedProjectRootInDatabase(database.db, command.input.repoRoot);
	}
	if (command.type === "projects.list") {
		ensureProjectRegistrySchema(writeOptions);
		return listProjectRegistryInDatabase(database.db);
	}
	if (command.type === "worktrees.list" || command.type === "worktrees.liveIds") return command.type === "worktrees.list" ? listRegistryWorktreesInDatabase(database.db) : listLiveRegistryWorktreeIdsInDatabase(database.db);
	if (command.type === "projects.resolve") {
		ensureProjectRegistrySchema(writeOptions);
		return resolveProjectRegistryInDatabase(database.db, command.input.id);
	}
	if (command.type === "projects.insert") {
		ensureProjectRegistrySchema(writeOptions);
		return runOpenClawStateWriteTransaction(({ db }) => {
			const { project, lease } = command.input;
			if (lease.scope !== "projects.checkout" || lease.key !== project.repoRoot) throw new Error("Project registry mutation requires its checkout lifecycle lease");
			assertOpenClawStateLeaseWorkerOwnedInTransaction(db, lease);
			return insertProjectRegistryInDatabase(db, project);
		}, writeOptions, { operationLabel: "projects.registry.insert" });
	}
	if (command.type === "projects.resolveRefreshOwner") {
		ensureProjectRegistrySchema(writeOptions);
		return runOpenClawStateWriteTransaction(({ db }) => {
			const { project, lease } = command.input;
			if (lease.scope !== "projects.checkout" || lease.key !== project.repoRoot) throw new Error("Project refresh requires its checkout lifecycle lease");
			assertOpenClawStateLeaseWorkerOwnedInTransaction(db, lease);
			return resolveProjectCloneRefreshOwnerInDatabase(db, project);
		}, writeOptions, { operationLabel: "projects.registry.refresh-owner.resolve" });
	}
	if (command.type === "projects.remove") return runOpenClawStateWriteTransaction(({ db }) => {
		const { project, lease } = command.input;
		if (lease.scope !== "projects.checkout" || lease.key !== project.repoRoot) throw new Error("Project registry mutation requires its checkout lifecycle lease");
		assertOpenClawStateLeaseWorkerOwnedInTransaction(db, lease);
		return removeProjectRegistryInDatabase(db, project);
	}, writeOptions, { operationLabel: "projects.registry.remove" });
	if (command.type === "config.health.patch") {
		const { configPath, patch, expected, updatedAtMs } = command.input;
		return runOpenClawStateWriteTransaction(({ db }) => {
			return patchConfigHealthEntryInDatabase(db, configPath, patch, expected, updatedAtMs);
		}, writeOptions);
	}
	if (command.type === "diagnostic.register") {
		const { scope, maxEntries, record } = command.input;
		return runOpenClawStateWriteTransaction(({ db }) => {
			createSqliteAuditRecordKernel(db, {
				scope,
				maxEntries
			}).register(record);
		}, writeOptions);
	}
	throw new Error("Unknown shared-state SQLite command");
}
//#endregion
export { executeSharedStateCommand, prepareCronStateWorkerCommand as prepareSharedStateCommand };
