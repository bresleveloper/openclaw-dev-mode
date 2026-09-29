import { f as asSafeIntegerInRange } from "./number-coercion-CLj0HTDM.mjs";
import "./src-CZ2wJvNB.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-C7YSvZ9t.mjs";
import { t as stableStringify } from "./stable-stringify-CkQ0IEj1.mjs";
import { l as normalizeOptionalString, m as readNonBlankString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { i as resolveRequiredHomeDir, o as resolveUserPath, t as expandHomePrefix } from "./home-dir-BKwhAL2c.mjs";
import { i as isPidDefinitelyDead, t as getFileLockProcessStartTime } from "./pid-alive-CXdZEzr_.mjs";
import { n as asFsSafeFileLockRoot, r as createFileLockManager } from "./file-lock-manager-xRAOv56w.mjs";
import { d as sameFileIdentity, n as assertNoSymlinkParents } from "./fs-safe-advanced-CJC-NYf3.mjs";
import { w as root$1 } from "./fs-safe-BAPek8At.mjs";
import { Jn as string, Kt as custom, Lt as boolean, Nt as array, Pn as number, Sn as looseObject, sr as unknown, xn as literal } from "./schemas-BOYIvvln.mjs";
import { t as resolveIdentityPathViaExistingAncestorSync } from "./boundary-path-BzetEUdq.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { n as isErrno, t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { a as isWithinDir } from "./path-safety-0BfxAYBQ.mjs";
import { n as normalizeAgentId, t as isValidAgentId } from "./agent-id-GA8mwdTG.mjs";
import { E as listAgentEntries, O as listAgentIds } from "./agent-scope-config-IQKOEtZ4.mjs";
import { C as resolveOAuthDir, E as resolveStateDir, p as resolveConfigPath, w as resolveLegacyStateDirs } from "./paths-DehQwyE0.mjs";
import { i as normalizeMainKey, n as buildAgentMainSessionKey, t as DEFAULT_MAIN_KEY } from "./session-key-CUi_tcgF.mjs";
import { A as parseAgentSessionKey, O as normalizeSessionKeyPreservingOpaquePeerIds, n as LEGACY_IMPLICIT_AGENT_ID } from "./session-key-CBvmC8zz.mjs";
import { t as DEFAULT_ACCOUNT_ID } from "./account-id-B1bfbA5J.mjs";
import { n as resolveSessionStoreCompatibilityAgentId } from "./legacy.default-agent-owner-B5Sofm47.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { n as sanitizeForLog } from "./ansi-CWsy0bu4.mjs";
import { n as readFileWindowFullySync, t as readFileWindowFully } from "./file-read-Csm265gq.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-BO6jRFcG.mjs";
import { i as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { t as readExistingAgentSchemaMeta } from "./openclaw-agent-db-metadata-CUXsFwAM.mjs";
import { t as coerceRequiredSqliteNumber } from "./sqlite-number-DM1AypRG.mjs";
import { n as sha256Hex } from "./node-crypto-Df3MIs6V.mjs";
import { a as sha256FileSync, i as sha256File } from "./crypto-digest-D9Nqq3c7.mjs";
import { t as resolveRuntimeWorkerArgv } from "./runtime-worker-url-B4o9tqvO.mjs";
import { c as closeOpenClawStateDatabaseByPathAsync } from "./openclaw-state-db-cache-Ci98mtX8.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { s as quoteSqliteIdentifier } from "./sqlite-schema-sql-5Wa9sNMr.mjs";
import { Ct as estimateAcpSessionRowBytes, St as estimateAcpEventRowBytes } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import { i as resolveSqliteDatabaseFilePaths, t as SQLITE_SIDECAR_SUFFIXES } from "./sqlite-files-eRv24eIu.mjs";
import { a as withArtifactPreservingStateReads, s as withExistingOpenClawStateDatabaseArtifactPreservingReadOnly } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { t as resolveRuntimeProcessEntrypointUrl } from "./runtime-process-url-q9v1M311.mjs";
import { c as resolveWorkspaceStateIdentity } from "./workspace-state-identity-CmGr5k4K.mjs";
import { n as readConfigMachineState } from "./config-machine-state-BfMkd608.mjs";
import { t as CHANNEL_IDS } from "./ids-NACrHrny.mjs";
import { a as resolveLegacyInstalledPluginIndexStorePath } from "./installed-plugin-record-match-CPrj3NTo.mjs";
import "./installed-plugin-index-store-Col5DnQ-.mjs";
import { f as collectRelevantDoctorPluginIds, i as isPluginDoctorMigrationDeferred, l as resolveLivePluginDoctorStateMigrationInventory, s as listPluginDoctorSessionStoreAgentIds, u as resolvePluginDoctorStateMigrationInventory } from "./doctor-contract-registry-6tw5Ndqt.mjs";
import { l as resolveSessionStorePathCore, n as resolveAgentsDirFromSessionStorePath } from "./paths-CcMbq5NY.mjs";
import { t as isPerAgentSessionStoreConfig } from "./session-store-config-caBszKSJ.mjs";
import { t as resolvePersistedSessionStoreOwner } from "./session-store-owner-DBafeUlR.mjs";
import { c as runOpenClawStateWriteTransaction, o as repairOpenClawStateDatabaseSchema, r as openOpenClawStateDatabase, s as repairOpenClawStateDatabaseSchemaIfNeeded } from "./openclaw-state-db-BFK9cMiV.mjs";
import { f as syncDirectoryIfSupported, i as pinDirectory, s as requireDirectorySync } from "./directory-durability-BKe2aOQN.mjs";
import { t as detectOpenClawStateDatabaseSchemaMigrations } from "./openclaw-state-db-schema-discovery-DeDrkSPY.mjs";
import { a as recordLegacyMigrationRun, i as recordLegacyMigrationReceipt, n as readLegacyMigrationReceipt, o as recordLegacyMigrationSource, r as readLegacyMigrationReceiptFromDatabase, s as resolveLegacyMigrationSourceKey, t as markLegacyMigrationSourceRemoved } from "./state-migrations.receipts-D6lbWbKJ.mjs";
import { a as readDeferredPluginMigrations } from "./deferred-plugin-migrations-DZuh_dkr.mjs";
import { t as createSqliteAuditRecordStore } from "./sqlite-audit-record-store-CJXR3a08.mjs";
import { n as CONFIG_AUDIT_SCOPE, t as CONFIG_AUDIT_MAX_ENTRIES } from "./io.audit-CcH6Zt2-.mjs";
import { a as hashConfigRaw } from "./io.read-helpers-N26RjV2V.mjs";
import { n as importConfigMachineState } from "./config-machine-state-write-CSLKAek3.mjs";
import { n as isLockOwnerDefinitelyStale } from "./stale-lock-file-DDEYOm3C.mjs";
import { s as withFileLock } from "./file-lock-BmQQ9PQF.mjs";
import "./file-lock-DJoMQumt.mjs";
import { n as formatConfigIssueLines } from "./issue-format-BQNShMey.mjs";
import { t as createConfigIO } from "./io.factory-ChIex6Yh.mjs";
import { p as readCurrentConfigForResolution } from "./io.runtime-BN-rPaec.mjs";
import "./io-DuIKUcsW.mjs";
import { r as acquireGatewayLock } from "./gateway-lock-CYjRlApN.mjs";
import { i as parseRestartSentinelEnvelope, o as readRestartSentinelRowSync, u as writeRestartSentinelRowSync } from "./restart-sentinel-store-CrOabuW6.mjs";
import { t as pathMayExistSync } from "./path-existence-ZQl5cy75.mjs";
import { t as mcpOAuthStoreKeyFromLegacyFileName } from "./mcp-oauth-identity-BzvKk5cf.mjs";
import "./mcp-oauth-store-BXszHQwn.mjs";
import { n as parseMcpOAuthStoreJson } from "./mcp-oauth-store.kernel-C5WU4FAG.mjs";
import { l as resolveSharedMainAuthAgentDir, n as inspectSharedAuthStoreOwnership, o as resolveSharedAuthStoreOwnership, r as noteCommittedSharedAuthStoreOwnership } from "./path-resolve-Bm8Ih2d_.mjs";
import { n as SHARED_AUTH_STORE_STATE_KEY, p as closeAuthProfileReadPool } from "./sqlite-json-DYv-pIUa.mjs";
import "./openclaw-agent-db-schema-helpers-D9qnl2Yp.mjs";
import { l as listAgentDatabaseAdmissionRefusals } from "./agent-database-admission-BFwcs62N.mjs";
import { o as closeOpenClawAgentDatabaseByPathAsync } from "./openclaw-agent-db-lifecycle-D7S9DdJC.mjs";
import { f as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-CaQAStOA.mjs";
import { n as inspectOpenClawRegisteredAgentDatabases } from "./openclaw-agent-db-registry-listing-CHFiKgU_.mjs";
import "./openclaw-agent-db-registry-CCrn1pMl.mjs";
import { C as inspectSharedAuthLegacyRowsReadOnly, S as hasPendingSharedAuthCleanup, T as readSharedAuthLegacyRowsFromDatabase, m as resolveAuthProfileDatabaseOwnerId, w as inspectSharedAuthLegacySourceFile, x as SharedAuthStoreSourceInspectionError } from "./sqlite-BIg_k8qE.mjs";
import { n as canonicalizeMainSessionAlias } from "./main-session-De-bcoks.mjs";
import { a as resolveLegacyStandaloneAgentDir, i as recordCompletedLegacyAgentDirMigration, r as legacyAgentQuarantineNotices, t as resolveInstallAgentDir } from "./install-agent-dir-s2lS9PY8.mjs";
import { n as isUpdateRehearsalReadOnlyPath, r as resolveUpdateRehearsalRoot } from "./update-rehearsal-paths-5kPjh__X.mjs";
import { a as readWorkspaceStateSnapshot, d as isSafeWorkspaceAttestationFilename, m as registerWorkspaceStateAliasesInTransaction, u as WORKSPACE_LEGACY_STATE_MIGRATION_KIND } from "./workspace-state-store-DTZ2RTNw.mjs";
import { n as formatDoctorStateRepairFailure } from "./state-repair-message-B5Bu99oR.mjs";
import { f as resolveLegacyWorkspaceSourcePaths, l as legacyWorkspaceSiblingAttestationMayExist, o as WORKSPACE_DOCTOR_CLAIM_SUFFIX, r as LEGACY_WORKSPACE_ATTESTATION_MAX_BYTES, t as LEGACY_WORKSPACE_ATTESTATION_DIRNAME } from "./workspace-legacy-state-6xtqRcEJ.mjs";
import { t as normalizePersistedSessionEntryShape } from "./store-entry-shape-CWorLqwJ.mjs";
import { a as resolveAllAgentSessionStoreTargetsSync, f as listConfiguredSessionStoreAgentIds, i as resolveAllAgentSessionStoreCandidateTargetsSync, l as resolveSessionStoreTargets, s as resolveConfiguredAgentDatabaseTargets } from "./targets-Dmb8-YXN.mjs";
import { _t as recordLegacyAcpMigrationCompletion, dt as readLegacyAcpMigrationContext, gt as prepareLegacyAcpMigrationSource, ht as legacyAcpMigrationSourceKey, mt as legacyAcpMigrationBindingMatches, pt as hasLegacyAcpMigrationCompletion } from "./session-accessor.sqlite-entry-store-BU493wVJ.mjs";
import { t as getChannelPlugin } from "./registry-D3wOWFDo.mjs";
import { n as createRetainedAgentDatabaseMatcher } from "./agent-deletion-discovery-CV9Iu45w.mjs";
import { l as selectAcpSessionRowForStoreEntry } from "./session-meta-keys-BA3YapJY.mjs";
import { r as normalizeConversationRef, t as currentConversationBindingRow$1 } from "./current-conversation-binding-row-De9sUoDf.mjs";
import { o as writeAcpSessionMetaForMigration } from "./session-meta-BxRb6CVY.mjs";
import { s as getMediaDir } from "./store-CqRcb7T5.mjs";
import { a as updateChannelPairingStateSnapshot, c as resolveAllowFromAccountId, l as safeAccountKey, s as dedupePreserveOrder, u as getPairingAdapter } from "./pairing-store-sqlite-CHi0Cj47.mjs";
import { F as ensureMeetingTranscriptsSchema, k as sessionFromRow } from "./store-sqlite-write-C8OaAvQF.mjs";
import { a as transcriptSessionExportKey, i as safeTranscriptPathSegment, n as TRANSCRIPT_EXPORT_FILE_NAMES, o as transcriptSessionSelector, s as renderTranscriptsMarkdown, t as TranscriptsStore } from "./store-K2ivV-ir.mjs";
import { i as resolveChannelDefaultAccountId } from "./helpers-t_ym8v5h.mjs";
import { n as listLegacyPairingStoreFiles } from "./pairing-files-BJQEMPCI.mjs";
import { C as rewriteRegistryWorktreePathsForMigration, b as listRegistryWorktreesForMigration, s as discardLegacyRegistryWorktrees, v as listLegacyRegistryWorktreesForMigration } from "./registry-UFMGRqcd.mjs";
import { n as SYSTEM_AGENT_AUDIT_SCOPE, t as SYSTEM_AGENT_AUDIT_MAX_ENTRIES } from "./audit-Dw5g9WOB.mjs";
import { t as migrateLegacyMainSessionKeys } from "./legacy-main-session-migration-BPxU1EXi.mjs";
import { n as LEGACY_NODE_HOST_CONFIG_FILE, r as NODE_HOST_CONFIG_KEY, t as LEGACY_NODE_HOST_CONFIG_CLAIM_SUFFIX, u as normalizeNodeHostCloudflareAccessConfig } from "./config-DLlmgxee.mjs";
import { t as withLegacyMigrationStateLock } from "./state-migrations.lock-CC3fInLn.mjs";
import { n as migrateLegacyDeviceAuth, t as detectLegacyDeviceAuth } from "./state-migrations.device-auth-D1cL2oRm.mjs";
import { n as detectLegacyDeviceIdentity, t as migrateLegacyDeviceIdentity } from "./state-migrations.device-identity-DMKiBBmt.mjs";
import { a as legacyMigrationSourceOrClaimMayExist, c as readLegacyMigrationSourceSnapshotSync, i as claimLegacyMigrationSourceClaims, l as resolveLegacyMigrationRelativePath, n as assertLegacyMigrationSourceUnchanged, o as legacyMigrationSourceSnapshotsMatch, r as claimAndRemoveLegacyMigrationSource, s as readLegacyMigrationSourceSnapshot, t as LegacyMigrationSourceClaim, u as restoreLegacyMigrationSourceClaims } from "./state-migrations.source-snapshot-Bzxgpz55.mjs";
import { n as migrateLegacyExecApprovals, t as detectLegacyExecApprovals } from "./state-migrations.exec-approvals-BsdONJp4.mjs";
import { n as listWorkspaceStateDirs } from "./workspace-state-dirs-CH7J4WYg.mjs";
import { c as recordLegacyAuditRawCheckpoint, d as prepareLegacyAuditRecords, f as serializePreparedAuditRecords, g as legacyAuditSourceGenerationKey, i as findPreviousLegacyAuditRawCheckpoint, l as restoreInterruptedAuditRecoveryArchive, m as hasLegacyAuditRawCheckpointCapacity, n as auditRecoveryCheckpointPrefixMatches, p as detectLegacyAuditLogs, r as finalizeLegacyAuditRecoveryArchive, s as readLegacyAuditSourceSnapshot, t as withLegacyAuditMigrationLease, u as scrubLegacyAuditRecoveryArchive } from "./state-migrations.audit-coordination-MRV0x_ps.mjs";
import { r as saveLegacySessionStore } from "./state-migrations.legacy-session-store-BJKmjQA9.mjs";
import { a as readSessionStoreJson5, i as parseSessionStoreJson5, n as existsDir, o as safeReadDir, r as migrationFileExists, t as ensureMigrationDir } from "./state-migrations.fs-BCymriz5.mjs";
import { t as EMPTY_LEGACY_SESSION_SURFACES } from "./legacy-session-surfaces.types-BmAZdMse.mjs";
import { n as detectLegacyDeliveryQueueFiles } from "./delivery-queue-legacy-files-DNIBi5Wk.mjs";
import { c as normalizeApnsEnvironment, f as normalizeCanonicalApnsRegistration, i as isValidApnsNodeId, l as normalizeApnsNodeId, t as apnsRegistrationFromRow, v as apnsRegistrationToRow } from "./push-apns-store-9CGb-HCs.mjs";
import { t as migrateLegacyConfigMachineState } from "./state-migrations.config-machine-state-CZGp7S6u.mjs";
import { i as prepareDeferredPluginSessionImportReader, n as deferredPluginSessionStoreIds, o as preserveDeferredPluginSessionSource } from "./deferred-plugin-session-sources-BIJY3F_m.mjs";
import { a as mergeNotices, i as logStateMigrationResult, n as createLegacyStateMigrationStepReceipt, r as formatStartupMigrationFailure } from "./state-migrations.messages-Sd7IFIbe.mjs";
import { a as managedImageRecordToRow, i as managedImageRecordFromRow, o as managedImageRecordsEqual } from "./managed-image-record-store.kernel-jj61quyd.mjs";
import { t as MANAGED_OUTGOING_ORIGINALS_SUBDIR } from "./managed-image-record-store-CqV242wA.mjs";
import { n as collectPluginDoctorStateMigrationPlans, r as runPluginDoctorStateMigrationPlans } from "./state-migrations.plugin-doctor-v4lrykhV.mjs";
import { _ as resolveLegacyTaskRunsSidecarPath, f as migrateLegacyTaskStateSidecars, g as resolveLegacyPluginStateSidecarPath, h as resolveLegacyFlowRunsSidecarPath, n as TASK_STATE_SQLITE_SIDECAR_SUFFIXES, o as hasPendingSqliteSidecarArchive, r as archiveLegacyImportSource, t as PLUGIN_STATE_SQLITE_SIDECAR_SUFFIXES } from "./state-migrations.storage-DpFCNszC.mjs";
import { n as migrateLegacyPluginStateSidecar, t as migrateLegacyInstalledPluginIndex } from "./state-migrations.plugin-state-Cv7GW2Cy.mjs";
import { c as resolvePendingLegacyStateDirMigrationPaths, o as resolveLegacyProfileWorkspaceMigrationPaths, r as migrateLegacyProfileWorkspace, s as resolvePendingLegacyProfileWorkspaceMigrationPaths, t as autoMigrateLegacyStateDir } from "./state-migrations.state-dir-MerZo4Hg.mjs";
import { t as migrateLegacyMediaPersistence } from "./state-migrations.media-persistence-G8ST6Pun.mjs";
import { n as normalizeVoiceWakeRoutingConfig } from "./voicewake-routing-Dh15APAj.mjs";
import { a as createWebPushVapidKeyPair, c as isValidWebPushKey, d as webPushSubscriptionsEqual, l as webPushSubscriptionFromRow, n as WEB_PUSH_VAPID_STATE_KEY, o as hashWebPushEndpoint, s as isValidWebPushEndpoint, u as webPushSubscriptionToRow } from "./push-web-store.records-B7ppsd_i.mjs";
import { i as ensureWebPushSubscriptionBindingColumns } from "./push-web-store.kernel-DCV7A944.mjs";
import { a as resolveWorkspaceMigrationSourceKey, i as readReceipt, n as createWorkspaceSetupFingerprint } from "./state-migrations.workspace-setup-receipts-AknVdDoS.mjs";
import fs, { createReadStream, lstatSync } from "node:fs";
import { TextDecoder as TextDecoder$1, isDeepStrictEqual } from "node:util";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { execFile } from "node:child_process";
import os from "node:os";
import { StringDecoder } from "node:string_decoder";
import { createHash, randomUUID } from "node:crypto";
import { gunzipSync } from "node:zlib";
import { OAuthClientInformationSchema, OAuthMetadataSchema, OAuthProtectedResourceMetadataSchema, OAuthTokensSchema, OpenIdProviderDiscoveryMetadataSchema } from "@modelcontextprotocol/sdk/shared/auth.js";
import { createInterface } from "node:readline";
import { root } from "@openclaw/fs-safe";
//#region src/infra/state-migrations.acp-replay.ts
const LEGACY_LEDGER_VERSION = 1;
const LEGACY_LEDGER_LOCK_OPTIONS = {
	retries: {
		retries: 8,
		factor: 2,
		minTimeout: 50,
		maxTimeout: 5e3,
		randomize: true
	},
	stale: 15e3,
	staleRecovery: "fail-closed"
};
const legacyAcpReplayRecordSchema = custom(isRecord);
const legacyAcpReplayUpdateSchema = legacyAcpReplayRecordSchema.refine((update) => typeof update.sessionUpdate === "string");
const legacyAcpReplayEventSchema = looseObject({
	seq: number().refine(Number.isInteger).refine((value) => value >= 1),
	at: number().finite(),
	sessionId: string(),
	sessionKey: string(),
	runId: unknown().optional(),
	update: legacyAcpReplayUpdateSchema
});
const legacyAcpReplaySessionSchema = looseObject({
	sessionId: string(),
	sessionKey: string(),
	cwd: string(),
	complete: boolean(),
	createdAt: number().finite(),
	updatedAt: number().finite(),
	nextSeq: number().refine(Number.isInteger).refine((value) => value >= 1),
	events: array(unknown())
});
const legacyAcpReplayLedgerSchema = looseObject({
	version: literal(LEGACY_LEDGER_VERSION),
	sessions: legacyAcpReplayRecordSchema
});
function resolveLegacyAcpReplayLedgerPath(stateDir) {
	return path.join(stateDir, "acp", "event-ledger.json");
}
function resolveLegacyAcpReplayClaimPath(sourcePath) {
	return `${sourcePath}.doctor-import`;
}
/** Detect the retired ledger only when an explicit doctor flow opts in. */
function detectLegacyAcpReplayLedger(params) {
	const sourcePath = resolveLegacyAcpReplayLedgerPath(params.stateDir);
	const claimPath = resolveLegacyAcpReplayClaimPath(sourcePath);
	return {
		sourcePath,
		hasLegacy: params.doctorOnlyStateMigrations === true && (fs.existsSync(sourcePath) || fs.existsSync(claimPath))
	};
}
function parseLegacyEvent(raw, sessionId) {
	const parsed = legacyAcpReplayEventSchema.safeParse(raw);
	if (!parsed.success || parsed.data.sessionId !== sessionId) throw new Error(`legacy ACP replay session ${sessionId} contains an invalid event`);
	const event = parsed.data;
	if (event.runId !== void 0 && (typeof event.runId !== "string" || event.runId.length === 0)) throw new Error(`legacy ACP replay session ${sessionId} contains an invalid run id`);
	return {
		seq: event.seq,
		at: event.at,
		sessionId,
		sessionKey: event.sessionKey,
		...typeof event.runId === "string" ? { runId: event.runId } : {},
		update: structuredClone(event.update)
	};
}
function parseLegacySession(raw, expectedSessionId) {
	const parsed = legacyAcpReplaySessionSchema.safeParse(raw);
	if (!parsed.success || parsed.data.sessionId !== expectedSessionId) throw new Error(`legacy ACP replay session ${expectedSessionId} is invalid`);
	const session = parsed.data;
	const events = session.events.map((event) => parseLegacyEvent(event, expectedSessionId));
	const sequences = new Set(events.map((event) => event.seq));
	const maxSeq = events.reduce((max, event) => Math.max(max, event.seq), 0);
	if (sequences.size !== events.length || session.nextSeq <= maxSeq) throw new Error(`legacy ACP replay session ${expectedSessionId} has invalid sequencing`);
	return {
		sessionId: expectedSessionId,
		sessionKey: session.sessionKey,
		cwd: session.cwd,
		complete: session.complete,
		createdAt: session.createdAt,
		updatedAt: session.updatedAt,
		nextSeq: session.nextSeq,
		events: events.toSorted((left, right) => left.seq - right.seq)
	};
}
function parseLegacyLedger(raw) {
	const parsed = legacyAcpReplayLedgerSchema.safeParse(JSON.parse(raw));
	if (!parsed.success) throw new Error("legacy ACP replay ledger must be a version 1 JSON object");
	return Object.entries(parsed.data.sessions).map(([sessionId, session]) => parseLegacySession(session, sessionId));
}
function sourceIdentity(stat, raw) {
	return {
		dev: stat.dev,
		ino: stat.ino,
		mtimeMs: stat.mtimeMs,
		sha256: createHash("sha256").update(raw).digest("hex"),
		size: stat.size
	};
}
function reconcileCanonicalSession(db, session) {
	const replayDb = getNodeSqliteKysely(db);
	const stored = executeSqliteQueryTakeFirstSync(db, replayDb.selectFrom("acp_replay_sessions").select([
		"session_key",
		"cwd",
		"complete",
		"created_at",
		"updated_at",
		"next_seq",
		"estimated_bytes"
	]).where("session_id", "=", session.sessionId));
	if (!stored || stored.session_key !== session.sessionKey || stored.cwd !== session.cwd || stored.complete !== (session.complete ? 1 : 0) || stored.created_at !== session.createdAt || stored.updated_at !== session.updatedAt || stored.next_seq !== session.nextSeq) return false;
	const storedEvents = executeSqliteQuerySync(db, replayDb.selectFrom("acp_replay_events").select([
		"seq",
		"at",
		"session_key",
		"run_id",
		"update_json",
		"estimated_bytes"
	]).where("session_id", "=", session.sessionId).orderBy("seq", "asc")).rows;
	if (storedEvents.length !== session.events.length) return false;
	const expectedEventBytes = [];
	for (const [index, event] of session.events.entries()) {
		const storedEvent = storedEvents[index];
		if (!storedEvent) return false;
		let storedUpdate;
		try {
			storedUpdate = JSON.parse(storedEvent.update_json);
		} catch {
			return false;
		}
		if (storedEvent.seq !== event.seq || storedEvent.at !== event.at || storedEvent.session_key !== event.sessionKey || storedEvent.run_id !== (event.runId ?? null) || !isDeepStrictEqual(storedUpdate, event.update)) return false;
		expectedEventBytes.push(estimateAcpEventRowBytes({
			...event,
			updateJson: storedEvent.update_json
		}));
	}
	for (const [index, event] of session.events.entries()) {
		const expectedBytes = expectedEventBytes[index];
		if (expectedBytes !== void 0 && storedEvents[index]?.estimated_bytes !== expectedBytes) executeSqliteQuerySync(db, replayDb.updateTable("acp_replay_events").set({ estimated_bytes: expectedBytes }).where("session_id", "=", session.sessionId).where("seq", "=", event.seq));
	}
	const expectedSessionBytes = estimateAcpSessionRowBytes(session) + expectedEventBytes.reduce((sum, value) => sum + value, 0);
	if (stored.estimated_bytes !== expectedSessionBytes) executeSqliteQuerySync(db, replayDb.updateTable("acp_replay_sessions").set({ estimated_bytes: expectedSessionBytes }).where("session_id", "=", session.sessionId));
	return true;
}
/** Import, verify, and remove the retired JSON ledger during explicit doctor repair. */
async function migrateLegacyAcpReplayLedger(params) {
	const changes = [];
	const warnings = [];
	if (!params.detected.hasLegacy) return {
		changes,
		warnings
	};
	try {
		const result = await withFileLock(params.detected.sourcePath, LEGACY_LEDGER_LOCK_OPTIONS, async () => {
			const claimPath = resolveLegacyAcpReplayClaimPath(params.detected.sourcePath);
			const resumedClaim = fs.existsSync(claimPath);
			const activePath = resumedClaim ? claimPath : params.detected.sourcePath;
			const before = await fs$1.lstat(activePath);
			if (!before.isFile() || before.isSymbolicLink()) throw new Error("legacy ACP replay source is not a regular non-symlink file");
			const raw = await fs$1.readFile(activePath, "utf8");
			const identity = sourceIdentity(before, raw);
			const sessions = parseLegacyLedger(raw);
			let importedSessions = 0;
			let importedEvents = 0;
			let retainedSessions = 0;
			let claimedThisRun = false;
			try {
				if (!resumedClaim) {
					await fs$1.rename(params.detected.sourcePath, claimPath);
					claimedThisRun = true;
					const claimedStat = await fs$1.lstat(claimPath);
					const claimedRaw = await fs$1.readFile(claimPath, "utf8");
					if (!legacyMigrationSourceSnapshotsMatch(identity, sourceIdentity(claimedStat, claimedRaw))) throw new Error("legacy ACP replay source changed while doctor was claiming it");
				}
				runOpenClawStateWriteTransaction(({ db }) => {
					const replayDb = getNodeSqliteKysely(db);
					const missingSessions = [];
					for (const session of sessions) {
						if (executeSqliteQueryTakeFirstSync(db, replayDb.selectFrom("acp_replay_sessions").select("session_id").where("session_id", "=", session.sessionId))) {
							if (!reconcileCanonicalSession(db, session)) throw new Error(`canonical ACP replay session ${session.sessionId} conflicts with the legacy source`);
							retainedSessions += 1;
							continue;
						}
						missingSessions.push(session);
					}
					for (const session of missingSessions) {
						let estimatedBytes = estimateAcpSessionRowBytes(session);
						executeSqliteQuerySync(db, replayDb.insertInto("acp_replay_sessions").values({
							session_id: session.sessionId,
							session_key: session.sessionKey,
							cwd: session.cwd,
							complete: session.complete ? 1 : 0,
							created_at: session.createdAt,
							updated_at: session.updatedAt,
							next_seq: session.nextSeq,
							estimated_bytes: estimatedBytes
						}));
						for (const event of session.events) {
							const updateJson = JSON.stringify(event.update);
							const eventBytes = estimateAcpEventRowBytes({
								...event,
								updateJson
							});
							executeSqliteQuerySync(db, replayDb.insertInto("acp_replay_events").values({
								session_id: event.sessionId,
								seq: event.seq,
								at: event.at,
								session_key: event.sessionKey,
								run_id: event.runId ?? null,
								update_json: updateJson,
								estimated_bytes: eventBytes
							}));
							estimatedBytes += eventBytes;
							importedEvents += 1;
						}
						executeSqliteQuerySync(db, replayDb.updateTable("acp_replay_sessions").set({ estimated_bytes: estimatedBytes }).where("session_id", "=", session.sessionId));
						if (!reconcileCanonicalSession(db, session)) throw new Error(`failed verifying imported ACP replay session ${session.sessionId}`);
						importedSessions += 1;
					}
				}, { env: {
					...process.env,
					OPENCLAW_STATE_DIR: params.stateDir
				} });
				await fs$1.unlink(claimPath);
				return {
					importedSessions,
					importedEvents,
					retainedSessions,
					pendingSource: fs.existsSync(params.detected.sourcePath)
				};
			} catch (error) {
				if (claimedThisRun && !fs.existsSync(params.detected.sourcePath)) await fs$1.rename(claimPath, params.detected.sourcePath).catch(() => {});
				throw error;
			}
		});
		changes.push(`Migrated ${result.importedSessions} ACP replay session(s) and ${result.importedEvents} event(s) → shared SQLite state`);
		if (result.retainedSessions > 0) changes.push(`Kept ${result.retainedSessions} existing ACP replay session(s) from shared SQLite state`);
		changes.push(`Removed retired ACP replay ledger ${params.detected.sourcePath}`);
		if (result.pendingSource) warnings.push(`A newer ACP replay ledger remains at ${params.detected.sourcePath}; rerun doctor to migrate it`);
	} catch (error) {
		warnings.push(`Failed migrating legacy ACP replay ledger ${params.detected.sourcePath}: ${String(error)}`);
	}
	return {
		changes,
		warnings
	};
}
//#endregion
//#region src/infra/legacy-json-object-stream.ts
const JSON_WHITESPACE = /* @__PURE__ */ new Set([
	" ",
	"	",
	"\r",
	"\n"
]);
var JsonCharacterCursor = class {
	constructor(chunks) {
		this.chunk = "";
		this.offset = 0;
		this.chunks = chunks[Symbol.asyncIterator]();
	}
	async fill() {
		while (this.offset >= this.chunk.length) {
			const next = await this.chunks.next();
			if (next.done) return false;
			this.chunk = next.value;
			this.offset = 0;
		}
		return true;
	}
	async peek() {
		return await this.fill() ? this.chunk[this.offset] ?? null : null;
	}
	async take() {
		if (!await this.fill()) return null;
		return this.chunk[this.offset++] ?? null;
	}
	async skipWhitespace() {
		while (true) {
			const next = await this.peek();
			if (next === null || !JSON_WHITESPACE.has(next)) return;
			await this.take();
		}
	}
};
function parseLegacyJson(raw) {
	try {
		return JSON.parse(raw);
	} catch {
		throw new Error("legacy JSON store contains invalid JSON");
	}
}
async function expectCharacter(cursor, expected) {
	await cursor.skipWhitespace();
	if (await cursor.take() !== expected) throw new Error(`expected ${JSON.stringify(expected)} in legacy JSON store`);
}
async function readJsonString(cursor) {
	await cursor.skipWhitespace();
	if (await cursor.take() !== "\"") throw new Error("expected string in legacy JSON store");
	let raw = "\"";
	let escaped = false;
	while (true) {
		const character = await cursor.take();
		if (character === null) throw new Error("unterminated string in legacy JSON store");
		raw += character;
		if (escaped) {
			escaped = false;
			continue;
		}
		if (character === "\\") {
			escaped = true;
			continue;
		}
		if (character === "\"") {
			const parsed = parseLegacyJson(raw);
			if (typeof parsed !== "string") throw new Error("invalid string in legacy JSON store");
			return parsed;
		}
	}
}
async function readJsonObject(cursor) {
	await cursor.skipWhitespace();
	if (await cursor.take() !== "{") throw new Error("legacy JSON entries must be objects");
	let raw = "{";
	let depth = 1;
	let escaped = false;
	let inString = false;
	while (depth > 0) {
		const character = await cursor.take();
		if (character === null) throw new Error("unterminated object in legacy JSON store");
		raw += character;
		if (inString) {
			if (escaped) escaped = false;
			else if (character === "\\") escaped = true;
			else if (character === "\"") inString = false;
			continue;
		}
		if (character === "\"") inString = true;
		else if (character === "{") depth += 1;
		else if (character === "}") depth -= 1;
	}
	return parseLegacyJson(raw);
}
async function parseSinglePropertyObject(params) {
	const cursor = new JsonCharacterCursor(params.chunks);
	await expectCharacter(cursor, "{");
	if (await readJsonString(cursor) !== params.property) throw new Error(`legacy JSON store must contain only ${params.property}`);
	await expectCharacter(cursor, ":");
	await expectCharacter(cursor, "{");
	await cursor.skipWhitespace();
	if (await cursor.peek() !== "}") while (true) {
		const key = await readJsonString(cursor);
		await expectCharacter(cursor, ":");
		params.onEntry(key, await readJsonObject(cursor));
		await cursor.skipWhitespace();
		const separator = await cursor.take();
		if (separator === "}") break;
		if (separator !== ",") throw new Error("expected comma or object end in legacy JSON store");
	}
	else await cursor.take();
	await expectCharacter(cursor, "}");
	await cursor.skipWhitespace();
	if (await cursor.take() !== null) throw new Error("legacy JSON store has trailing content");
}
async function* decodeUtf8Chunks(params) {
	const decoder = new TextDecoder("utf-8", { fatal: true });
	const stream = params.handle.createReadStream({
		autoClose: false,
		start: 0
	});
	for await (const rawChunk of stream) {
		const chunk = Buffer.isBuffer(rawChunk) ? rawChunk : Buffer.from(rawChunk);
		params.hash.update(chunk);
		params.onBytes(chunk.byteLength);
		const text = decoder.decode(chunk, { stream: true });
		if (text) yield text;
	}
	const tail = decoder.decode();
	if (tail) yield tail;
}
function assertStableRead(before, after, bytesRead) {
	if (before.dev !== after.dev || before.ino !== after.ino || before.mtimeMs !== after.mtimeMs || before.size !== after.size || bytesRead !== after.size) throw new Error("legacy JSON store changed while it was being read");
}
/** Hash a safely opened file, optionally parsing its single object property entry by entry. */
async function readLegacyJsonObjectStream(params) {
	const opened = await params.stateRoot.open(params.relativePath, {
		hardlinks: "reject",
		symlinks: "reject"
	});
	const hash = createHash("sha256");
	let size = 0;
	try {
		const before = opened.stat;
		if (params.property && params.onEntry) await parseSinglePropertyObject({
			chunks: decodeUtf8Chunks({
				handle: opened.handle,
				hash,
				onBytes: (length) => {
					size += length;
				}
			}),
			property: params.property,
			onEntry: params.onEntry
		});
		else {
			const stream = opened.handle.createReadStream({
				autoClose: false,
				start: 0
			});
			for await (const rawChunk of stream) {
				const chunk = Buffer.isBuffer(rawChunk) ? rawChunk : Buffer.from(rawChunk);
				hash.update(chunk);
				size += chunk.byteLength;
			}
		}
		const after = await opened.handle.stat();
		assertStableRead(before, after, size);
		return {
			dev: after.dev,
			ino: after.ino,
			mtimeMs: after.mtimeMs,
			sha256: hash.digest("hex"),
			size
		};
	} catch (error) {
		if (error instanceof TypeError && /encoded data was not valid/i.test(error.message)) throw new Error("legacy JSON store is not valid UTF-8", { cause: error });
		throw error;
	} finally {
		await opened[Symbol.asyncDispose]();
	}
}
//#endregion
//#region src/infra/state-migrations.json-fields.ts
function assertAllowedJsonFields(value, allowed, label, options = {}) {
	const unexpected = Object.keys(value).find((key) => !allowed.has(key));
	if (unexpected !== void 0) {
		const field = unexpected === "" ? "\"\"" : unexpected;
		const detail = options.reportField === false ? "an unexpected field" : `unexpected field ${options.fieldPrefix ?? ""}${field}`;
		throw new Error(`${label} has ${detail}`);
	}
}
//#endregion
//#region src/infra/state-migrations.apns.ts
const LEGACY_APNS_REGISTRATION_PATH = "push/apns-registrations.json";
const APNS_DOCTOR_CLAIM_SUFFIX = ".doctor-importing";
const MIGRATION_KIND$6 = "legacy-apns-registrations-json";
const MAX_LEGACY_APNS_UPDATED_AT_MS = 864e13;
const DIRECT_REGISTRATION_KEYS = /* @__PURE__ */ new Set([
	"nodeId",
	"transport",
	"token",
	"topic",
	"environment",
	"updatedAtMs"
]);
const RELAY_REGISTRATION_KEYS = /* @__PURE__ */ new Set([
	"nodeId",
	"transport",
	"relayHandle",
	"sendGrant",
	"installationId",
	"topic",
	"environment",
	"distribution",
	"updatedAtMs",
	"relayOrigin",
	"tokenDebugSuffix"
]);
function resolveLegacyApnsPath(stateDir) {
	return path.join(stateDir, LEGACY_APNS_REGISTRATION_PATH);
}
/** Detect the retired APNs store only when an explicit Doctor flow opts in. */
function detectLegacyApnsRegistrations(params) {
	const sourcePath = resolveLegacyApnsPath(params.stateDir);
	return {
		sourcePath,
		hasLegacy: params.doctorOnlyStateMigrations === true && legacyMigrationSourceOrClaimMayExist(sourcePath, APNS_DOCTOR_CLAIM_SUFFIX)
	};
}
function relativeLegacyPath$1(stateDir, filePath) {
	return resolveLegacyMigrationRelativePath(stateDir, filePath, "APNs", false);
}
async function readLegacySourceSnapshot$3(stateRoot, stateDir, sourcePath, onEntry) {
	return {
		sourcePath,
		...await readLegacyJsonObjectStream({
			stateRoot,
			relativePath: relativeLegacyPath$1(stateDir, sourcePath),
			...onEntry ? {
				property: "registrationsByNodeId",
				onEntry
			} : {}
		})
	};
}
function isValidLegacyApnsTimestamp(value) {
	return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 && value <= MAX_LEGACY_APNS_UPDATED_AT_MS;
}
function parseLegacyApnsRegistration(rawNodeId, rawRegistration, env) {
	if (!isRecord(rawRegistration)) throw new Error("legacy APNs registration is not an object");
	const transport = rawRegistration.transport ?? "direct";
	if (transport !== "direct" && transport !== "relay") throw new Error("legacy APNs registration has invalid transport");
	assertAllowedJsonFields(rawRegistration, transport === "relay" ? RELAY_REGISTRATION_KEYS : DIRECT_REGISTRATION_KEYS, "legacy APNs registration", { reportField: false });
	const normalizedNodeId = normalizeApnsNodeId(rawNodeId);
	if (!isValidApnsNodeId(normalizedNodeId)) throw new Error("legacy APNs registration has an invalid node id");
	if (!isValidLegacyApnsTimestamp(rawRegistration.updatedAtMs)) throw new Error("legacy APNs registration has an invalid updated timestamp");
	const candidate = transport === "direct" ? {
		...rawRegistration,
		transport,
		environment: normalizeApnsEnvironment(rawRegistration.environment) ?? "sandbox"
	} : {
		...rawRegistration,
		transport
	};
	const registration = normalizeCanonicalApnsRegistration(candidate, env);
	const invalidRelayOrigin = transport === "relay" && Object.hasOwn(rawRegistration, "relayOrigin") && (!registration || registration.transport !== "relay" || !registration.relayOrigin);
	const invalidTokenDebugSuffix = transport === "relay" && Object.hasOwn(rawRegistration, "tokenDebugSuffix") && typeof rawRegistration.tokenDebugSuffix !== "string";
	if (!registration || registration.nodeId !== normalizedNodeId || invalidRelayOrigin || invalidTokenDebugSuffix) throw new Error("legacy APNs registration is invalid");
	return [normalizedNodeId, registration];
}
function importAndRecordReceipt$2(params) {
	const sourceKey = resolveLegacyMigrationSourceKey("apns-json", params.sourcePath);
	const runId = `${sourceKey}:${params.snapshot.sha256.slice(0, 16)}`;
	const now = Date.now();
	return runOpenClawStateWriteTransaction(({ db }) => {
		const stateDb = getNodeSqliteKysely(db);
		if (readLegacyMigrationReceiptFromDatabase(db, sourceKey)) return {
			sourceKey,
			imported: 0,
			preserved: 0,
			suppressed: 0,
			receiptAuthoritative: true
		};
		let imported = 0;
		let preserved = 0;
		let suppressed = 0;
		const expectedNodeIds = [];
		for (const [nodeId, registration] of params.registrations) {
			const existing = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("apns_registrations").selectAll().where("node_id", "=", nodeId));
			const tombstone = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("apns_registration_tombstones").select("node_id").where("node_id", "=", nodeId));
			if (existing && tombstone) throw new Error("APNs state has both a registration and deletion tombstone");
			if (existing) {
				apnsRegistrationFromRow(existing);
				preserved += 1;
				expectedNodeIds.push(nodeId);
			} else if (tombstone) suppressed += 1;
			else {
				executeSqliteQuerySync(db, stateDb.insertInto("apns_registrations").values(apnsRegistrationToRow(registration)));
				imported += 1;
				expectedNodeIds.push(nodeId);
			}
		}
		for (const nodeId of expectedNodeIds) {
			const verified = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("apns_registrations").selectAll().where("node_id", "=", nodeId));
			if (!verified) throw new Error("SQLite verification failed for an APNs registration");
			apnsRegistrationFromRow(verified);
		}
		const reportJson = JSON.stringify({
			source: MIGRATION_KIND$6,
			target: "apns_registrations",
			sourceSha256: params.snapshot.sha256,
			sourceRecordCount: params.registrations.size,
			importedRecordCount: imported,
			preservedSqliteRecordCount: preserved,
			suppressedDeletedRecordCount: suppressed
		});
		recordLegacyMigrationReceipt(db, {
			sourceKey,
			migrationKind: MIGRATION_KIND$6,
			sourcePath: params.sourcePath,
			targetTable: "apns_registrations",
			sourceSha256: params.snapshot.sha256,
			sourceSizeBytes: params.snapshot.size,
			sourceRecordCount: params.registrations.size,
			runId,
			now,
			reportJson
		});
		return {
			sourceKey,
			imported,
			preserved,
			suppressed,
			receiptAuthoritative: false
		};
	}, { env: params.env });
}
async function cleanupReceiptAuthoritativeSources$1(params) {
	let removed = 0;
	for (const candidate of [params.sourcePath, `${params.sourcePath}${APNS_DOCTOR_CLAIM_SUFFIX}`]) {
		if (!await params.stateRoot.exists(relativeLegacyPath$1(params.stateDir, candidate))) continue;
		await readLegacySourceSnapshot$3(params.stateRoot, params.stateDir, candidate);
		if (params.removeSource) await params.removeSource(candidate);
		else await params.stateRoot.remove(relativeLegacyPath$1(params.stateDir, candidate));
		removed += 1;
	}
	if (!params.receipt.removedSource || removed > 0) markLegacyMigrationSourceRemoved(params.receipt.sourceKey, params.env);
	return removed;
}
async function migrateWithExclusiveStateOwnership$5(params) {
	const changes = [];
	const warnings = [];
	const notices = [];
	if (!params.detected.hasLegacy) return {
		changes,
		warnings
	};
	const sourcePath = params.detected.sourcePath;
	const source = new LegacyMigrationSourceClaim({
		stateRoot: params.stateRoot,
		stateDir: params.stateDir,
		sourcePath,
		label: "APNs",
		includeFilePath: false,
		claimSuffix: APNS_DOCTOR_CLAIM_SUFFIX,
		readSnapshot: (snapshotPath) => readLegacySourceSnapshot$3(params.stateRoot, params.stateDir, snapshotPath)
	});
	await source.recoverLinkedMove();
	const receipt = readLegacyMigrationReceipt(resolveLegacyMigrationSourceKey("apns-json", params.detected.sourcePath), params.env);
	if (receipt) {
		try {
			if (await cleanupReceiptAuthoritativeSources$1({
				...params,
				sourcePath: params.detected.sourcePath,
				receipt
			}) > 0) notices.push("Discarded retired APNs JSON state already covered by its SQLite receipt.");
		} catch (error) {
			warnings.push(`APNs state is in SQLite, but legacy cleanup failed: ${String(error)}`);
		}
		return notices.length > 0 ? {
			changes,
			warnings,
			notices
		} : {
			changes,
			warnings
		};
	}
	const hasSource = await source.exists();
	const hasClaim = await source.exists(true);
	if (hasSource && hasClaim) return {
		changes,
		warnings: ["Failed migrating legacy APNs state: source and interrupted claim both exist."]
	};
	const activePath = hasSource ? sourcePath : hasClaim ? source.claimPath : null;
	if (!activePath) return {
		changes,
		warnings
	};
	let snapshot;
	const registrations = /* @__PURE__ */ new Map();
	try {
		snapshot = await readLegacySourceSnapshot$3(params.stateRoot, params.stateDir, activePath, (rawNodeId, rawRegistration) => {
			const [nodeId, registration] = parseLegacyApnsRegistration(rawNodeId, rawRegistration, params.env);
			if (registrations.has(nodeId)) throw new Error("legacy APNs registration has a duplicate node id");
			registrations.set(nodeId, registration);
		});
	} catch (error) {
		warnings.push(`Failed reading legacy APNs state: ${String(error)}`);
		return {
			changes,
			warnings
		};
	}
	if (activePath === sourcePath) try {
		snapshot = await source.claim({
			snapshot,
			mismatchMessage: "legacy APNs source changed before Doctor could claim it",
			beforeClaim: params.beforeClaim
		});
	} catch (error) {
		const restoreError = await source.restore();
		warnings.push(`Failed migrating legacy APNs state: ${String(error)}${restoreError ? `; restore failure: ${restoreError}` : ""}`);
		return {
			changes,
			warnings
		};
	}
	let result;
	try {
		result = importAndRecordReceipt$2({
			env: params.env,
			sourcePath,
			snapshot,
			registrations
		});
	} catch (error) {
		const restoreError = await source.restore();
		warnings.push(`Failed migrating legacy APNs state: ${String(error)}${restoreError ? `; restore failure: ${restoreError}` : ""}`);
		return {
			changes,
			warnings
		};
	}
	try {
		await source.remove({
			removeSource: params.removeSource,
			sourceReappearedMessage: "legacy APNs source reappeared during import"
		});
		markLegacyMigrationSourceRemoved(result.sourceKey, params.env);
	} catch (error) {
		warnings.push(`APNs state is in SQLite, but legacy cleanup failed: ${String(error)}`);
		return {
			changes,
			warnings
		};
	}
	changes.push(`Migrated ${result.imported} APNs registration${result.imported === 1 ? "" : "s"} to SQLite.`);
	if (result.preserved > 0) notices.push(`Preserved ${result.preserved} canonical SQLite APNs registration${result.preserved === 1 ? "" : "s"}.`);
	if (result.suppressed > 0) notices.push(`Kept ${result.suppressed} deleted APNs registration${result.suppressed === 1 ? "" : "s"} retired.`);
	notices.push("Removed retired APNs JSON state after verified SQLite import.");
	return {
		changes,
		warnings,
		notices
	};
}
/** Import the retired APNs store while excluding old Gateways that can recreate it. */
async function migrateLegacyApnsRegistrations(params) {
	if (!params.detected.hasLegacy) return {
		changes: [],
		warnings: []
	};
	return await withLegacyMigrationStateLock({
		stateDir: params.stateDir,
		env: params.env,
		label: "legacy APNs state",
		releaseLabel: "APNs",
		errorLabel: "Failed reading legacy APNs state",
		run: async (env) => {
			const stateRoot = await root(params.stateDir, {
				hardlinks: "reject",
				symlinks: "reject"
			});
			return await migrateWithExclusiveStateOwnership$5({
				...params,
				env,
				stateRoot
			});
		}
	});
}
//#endregion
//#region src/infra/state-migrations.audit-sanitized.ts
async function writeRecoveredSanitizedAuditArchive(params) {
	const current = await params.root.exists(params.relativePath) ? await readLegacyAuditSourceSnapshot(params.root, params.relativePath) : void 0;
	let desired;
	if (params.previousCheckpoint) {
		if (!current || current.rawBytes.length < params.previousCheckpoint.sanitizedSize) {
			params.warnings.push(`Skipped ${params.sourceLabel} recovery because its sanitized archive is missing or truncated`);
			return false;
		}
		const checkpointedPrefix = current.rawBytes.subarray(0, params.previousCheckpoint.sanitizedSize);
		if (createHash("sha256").update(checkpointedPrefix).digest("hex") !== params.previousCheckpoint.sanitizedContentHash) {
			params.warnings.push(`Skipped ${params.sourceLabel} recovery because its sanitized archive changed after checkpoint`);
			return false;
		}
		desired = Buffer.concat([checkpointedPrefix, Buffer.from(params.candidateRecordsJsonl, "utf8")]);
		if (current.rawBytes.equals(desired)) return true;
		const currentIsVerifiedDesiredPrefix = desired.subarray(0, current.rawBytes.length).equals(current.rawBytes);
		if (current.rawBytes.length !== params.previousCheckpoint.sanitizedSize && !currentIsVerifiedDesiredPrefix) {
			params.warnings.push(`Skipped ${params.sourceLabel} recovery because its sanitized archive has an uncheckpointed tail`);
			return false;
		}
	} else {
		desired = Buffer.from(params.allRecordsJsonl, "utf8");
		if (current?.rawBytes.equals(desired)) return true;
	}
	await params.root.write(params.relativePath, desired, {
		mkdir: false,
		mode: 384
	});
	return true;
}
//#endregion
//#region src/infra/state-migrations.audit-logs.ts
function legacyAuditClaimPathForArchive(sourcePath, sanitizedArchivePath) {
	const archivePrefix = `${sourcePath}.migrated`;
	if (!sanitizedArchivePath.startsWith(archivePrefix)) throw new Error(`Invalid legacy audit archive path ${sanitizedArchivePath}`);
	const generationSuffix = sanitizedArchivePath.slice(archivePrefix.length);
	return path.join(path.dirname(sourcePath), `.${path.basename(sourcePath)}.doctor-importing${generationSuffix}`);
}
const AUDIT_SKIP_RECOVERY_GUIDANCE = "Preserve the legacy source and any sanitized companion for recovery; see https://docs.openclaw.ai/cli/update/repair-and-recovery#skipped-legacy-audit-recovery. Other repairs can continue; this warning repeats until the archive is resolved.";
async function resolveAuditArchiveRelativePaths(root, sourceRelativePath) {
	const directoryPath = path.join(root.rootReal, path.dirname(sourceRelativePath));
	const baseName = path.basename(sourceRelativePath).replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
	const archivePattern = new RegExp(`^${baseName}\\.migrated(?:\\.([2-9]|[1-9][0-9]+))?(?:\\.raw)?$`, "u");
	const claimPattern = new RegExp(`^\\.${baseName}\\.doctor-importing(?:\\.([2-9]|[1-9][0-9]+))?$`, "u");
	let latestGeneration = 0n;
	for (const entry of fs.readdirSync(directoryPath)) {
		const match = archivePattern.exec(entry) ?? claimPattern.exec(entry);
		if (!match) continue;
		const generation = BigInt(match[1] ?? "1");
		if (generation > latestGeneration) latestGeneration = generation;
	}
	const generation = latestGeneration + 1n;
	const sanitized = `${sourceRelativePath}.migrated${generation === 1n ? "" : `.${generation}`}`;
	return {
		sanitized,
		raw: `${sanitized}.raw`,
		resumeSanitized: false
	};
}
async function secureAuditArchiveFile(params) {
	try {
		const opened = await params.root.openWritable(params.relativePath, { writeMode: "update" });
		try {
			await opened.handle.chmod(384);
			await opened.handle.sync();
		} finally {
			await opened.handle.close();
		}
		return true;
	} catch (error) {
		params.warnings.push(`Failed securing ${params.label} legacy source: ${String(error)}`);
		return false;
	}
}
async function archiveLegacyAuditClaim(params) {
	let moved = false;
	let sanitizedCreated = false;
	const archivePaths = params.archivePaths;
	try {
		if (archivePaths.resumeSanitized) await params.root.write(archivePaths.sanitized, params.sanitizedJsonl, {
			mkdir: false,
			mode: 384
		});
		else await params.root.create(archivePaths.sanitized, params.sanitizedJsonl, { mode: 384 });
		sanitizedCreated = true;
		if (!await secureAuditArchiveFile({
			root: params.root,
			relativePath: archivePaths.sanitized,
			label: `sanitized ${params.source.label}`,
			warnings: params.warnings
		})) return { moved: false };
		await params.root.move(params.claimRelativePath, archivePaths.raw);
		if (!await secureAuditArchiveFile({
			root: params.root,
			relativePath: archivePaths.raw,
			label: `raw archived ${params.source.label}`,
			warnings: params.warnings
		})) {
			try {
				await params.root.move(archivePaths.raw, params.claimRelativePath);
			} catch (error) {
				params.warnings.push(`Failed restoring unsecured ${params.source.label} legacy source: ${String(error)}`);
			}
			return { moved: false };
		}
		moved = true;
		const scrubbedSnapshot = await scrubLegacyAuditRecoveryArchive({
			root: params.root,
			relativePath: archivePaths.raw,
			expectedSnapshot: params.snapshot,
			label: params.source.label,
			warnings: params.warnings
		});
		params.changes.push(`Archived sanitized ${params.source.label} legacy source → ${path.join(path.dirname(params.source.logicalSourcePath), path.basename(archivePaths.sanitized))}; ${scrubbedSnapshot ? "scrubbed same-inode append recovery archive" : "retained same-inode append recovery archive for Doctor retry"} → ${path.join(path.dirname(params.source.logicalSourcePath), path.basename(archivePaths.raw))}`);
		return {
			moved: true,
			rawRelativePath: archivePaths.raw,
			...scrubbedSnapshot ? { scrubbedSnapshot } : {}
		};
	} catch (error) {
		params.warnings.push(`Failed archiving ${params.source.label} ${params.source.logicalSourcePath}: ${String(error)}`);
	} finally {
		if (!moved && sanitizedCreated) await params.root.remove(archivePaths.sanitized).catch(() => void 0);
	}
	return {
		moved,
		...moved ? { rawRelativePath: archivePaths.raw } : {}
	};
}
async function restoreOrPreserveLegacyAuditClaim(params) {
	try {
		if (!await params.root.exists(params.claimRelativePath)) return;
		if (!await params.root.exists(params.sourceRelativePath)) {
			await params.root.move(params.claimRelativePath, params.sourceRelativePath);
			await secureAuditArchiveFile({
				root: params.root,
				relativePath: params.sourceRelativePath,
				label: params.source.label,
				warnings: params.warnings
			});
			return;
		}
		await params.root.move(params.claimRelativePath, params.archivePaths.raw);
		await secureAuditArchiveFile({
			root: params.root,
			relativePath: params.archivePaths.raw,
			label: `preserved ${params.source.label}`,
			warnings: params.warnings
		});
		params.warnings.push(`Preserved claimed ${params.source.label} at ${path.join(path.dirname(params.source.logicalSourcePath), path.basename(params.archivePaths.raw))} because an old writer recreated ${params.source.logicalSourcePath}`);
	} catch (error) {
		params.warnings.push(`Failed restoring claimed ${params.source.label} ${params.source.logicalSourcePath}: ${String(error)}`);
	}
}
async function migrateLegacyAuditLogSource(params) {
	const changes = [];
	const warnings = [];
	const sourceResult = {
		changes,
		warnings,
		outcome: "refused"
	};
	const result = (outcome) => {
		sourceResult.outcome = outcome;
		return sourceResult;
	};
	const root = await root$1(params.stateDir, {
		hardlinks: "reject",
		maxBytes: Number.MAX_SAFE_INTEGER,
		mkdir: false,
		mode: 384,
		symlinks: "reject"
	});
	const sourceRelativePath = path.relative(path.resolve(params.stateDir), params.source.logicalSourcePath);
	const detectedRelativePath = path.relative(path.resolve(params.stateDir), params.source.sourcePath);
	const quarantine = async (observed) => {
		const relativePath = `${detectedRelativePath}.quarantined-${(/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/gu, "-")}-${randomUUID()}`;
		const quarantinePath = path.join(params.stateDir, relativePath);
		const mismatch = `expected append-only growth; observed ${observed}`;
		try {
			await root.move(detectedRelativePath, relativePath);
		} catch (error) {
			warnings.push(`Skipped ${params.source.label} recovery: ${mismatch}. Could not quarantine ${params.source.sourcePath}: ${String(error)}. Left the archive in place; other repairs can continue.`);
			return result("skipped");
		}
		warnings.push(`Quarantined ${params.source.label} recovery archive → ${quarantinePath}: ${mismatch}. Kept sanitized history and existing SQLite records; other repairs can continue.`);
		await syncDirectoryIfSupported(path.dirname(quarantinePath)).catch((error) => {
			warnings.push(`Failed syncing quarantine directory for ${quarantinePath}: ${String(error)}`);
		});
		return result("quarantined");
	};
	let archivePaths;
	let claimRelativePath = detectedRelativePath;
	if (params.source.storage === "active") {
		archivePaths = await resolveAuditArchiveRelativePaths(root, sourceRelativePath);
		claimRelativePath = path.relative(path.resolve(params.stateDir), legacyAuditClaimPathForArchive(params.source.logicalSourcePath, path.join(params.stateDir, archivePaths.sanitized)));
		await root.move(detectedRelativePath, claimRelativePath);
	} else if (params.source.storage === "claim") {
		if (!params.source.sanitizedArchivePath || !params.source.rawArchivePath) throw new Error(`Missing reserved archive generation for ${params.source.sourcePath}`);
		const sanitized = path.relative(path.resolve(params.stateDir), params.source.sanitizedArchivePath);
		const raw = path.relative(path.resolve(params.stateDir), params.source.rawArchivePath);
		archivePaths = {
			sanitized,
			raw,
			resumeSanitized: await root.exists(sanitized) && !await root.exists(raw)
		};
	}
	let claimFinalized = params.source.storage === "raw-archive";
	try {
		if (!await secureAuditArchiveFile({
			root,
			relativePath: claimRelativePath,
			label: `claimed ${params.source.label}`,
			warnings
		})) return result("refused");
		const rawArchiveRelativePath = archivePaths?.raw ?? detectedRelativePath;
		if (!hasLegacyAuditRawCheckpointCapacity(params.stateDir, rawArchiveRelativePath)) {
			warnings.push(`Skipped ${params.source.label} migration because durable raw-archive checkpoint capacity is exhausted; left the legacy source in place. ${AUDIT_SKIP_RECOVERY_GUIDANCE}`);
			return result("skipped");
		}
		if (!await restoreInterruptedAuditRecoveryArchive({
			root,
			relativePath: claimRelativePath,
			label: params.source.label,
			warnings
		})) return result("refused");
		const snapshot = await readLegacyAuditSourceSnapshot(root, claimRelativePath);
		const sourceGeneration = legacyAuditSourceGenerationKey(rawArchiveRelativePath);
		const sanitizedRelativePath = params.source.storage === "raw-archive" && params.source.sanitizedArchivePath ? path.relative(path.resolve(params.stateDir), params.source.sanitizedArchivePath) : void 0;
		const previousCheckpoint = params.source.storage === "raw-archive" ? findPreviousLegacyAuditRawCheckpoint(params.stateDir, rawArchiveRelativePath) : void 0;
		if (previousCheckpoint && !auditRecoveryCheckpointPrefixMatches(snapshot, previousCheckpoint)) return await quarantine(`archive changed other than by append (${snapshot.size} bytes; checkpoint ${previousCheckpoint.size} bytes)`);
		if (params.source.storage === "raw-archive" && !previousCheckpoint) {
			if (!sanitizedRelativePath) throw new Error(`Missing sanitized archive path for ${params.source.sourcePath}`);
			if (snapshot.size === 0 && await root.exists(sanitizedRelativePath) && (await readLegacyAuditSourceSnapshot(root, sanitizedRelativePath)).size > 0) return await quarantine("an empty raw archive without a checkpoint beside retained sanitized history");
			const firstContentByte = snapshot.rawBytes.findIndex((byte) => byte !== 32 && byte !== 9 && byte !== 10 && byte !== 13);
			if (snapshot.rawBytes.length > 0 && firstContentByte !== 0) {
				warnings.push(`Skipped ${params.source.label} recovery because its checkpointless raw archive begins with ambiguous whitespace; left the archive in place. ${AUDIT_SKIP_RECOVERY_GUIDANCE}`);
				return result("skipped");
			}
		}
		const prepared = prepareLegacyAuditRecords(params.source, snapshot.raw, sourceGeneration, previousCheckpoint?.recordOrdinalBase ?? 0);
		if (!prepared.ok) {
			warnings.push(...prepared.warnings);
			return result("refused");
		}
		if (previousCheckpoint && prepared.records.length < previousCheckpoint.recordCount) return await quarantine("fewer records than the raw archive checkpoint");
		const env = {
			...process.env,
			OPENCLAW_STATE_DIR: params.stateDir
		};
		const maxEntries = params.source.kind === "config" ? CONFIG_AUDIT_MAX_ENTRIES : SYSTEM_AGENT_AUDIT_MAX_ENTRIES;
		const store = createSqliteAuditRecordStore({
			scope: params.source.kind === "config" ? CONFIG_AUDIT_SCOPE : SYSTEM_AGENT_AUDIT_SCOPE,
			maxEntries,
			env
		});
		const existingEntries = store.entries();
		const existingKeys = new Set(existingEntries.map((entry) => entry.key));
		let candidateRecords = previousCheckpoint ? prepared.records.slice(previousCheckpoint.recordCount) : prepared.records;
		if (!previousCheckpoint && candidateRecords === prepared.records) {
			const lastRetainedSourceIndex = prepared.records.findLastIndex((record) => existingKeys.has(record.key));
			if (lastRetainedSourceIndex >= 0) candidateRecords = prepared.records.slice(lastRetainedSourceIndex + 1);
		}
		const missing = candidateRecords.filter((record) => !existingKeys.has(record.key));
		store.registerLegacyMany(missing);
		const importedKeys = new Set(store.entries().map((entry) => entry.key));
		const retainedNewRows = missing.filter((record) => importedKeys.has(record.key)).length;
		const retentionNote = retainedNewRows === missing.length ? "" : `; ${retainedNewRows} retained after bounded retention`;
		if (params.source.storage === "raw-archive") {
			if (!sanitizedRelativePath) throw new Error(`Missing sanitized archive path for ${params.source.sourcePath}`);
			if (!await writeRecoveredSanitizedAuditArchive({
				sourceLabel: params.source.label,
				root,
				relativePath: sanitizedRelativePath,
				allRecordsJsonl: prepared.sanitizedJsonl,
				candidateRecordsJsonl: serializePreparedAuditRecords(candidateRecords),
				previousCheckpoint,
				warnings
			})) return result("refused");
			if (previousCheckpoint?.phase !== "merge-intent" || candidateRecords.length > 0) {
				if (!await recordLegacyAuditRawCheckpoint({
					stateDir: params.stateDir,
					rawPath: params.source.sourcePath,
					rawRelativePath: claimRelativePath,
					sanitizedRelativePath,
					root,
					snapshot,
					phase: "merge-intent",
					recordCount: prepared.records.length,
					recordOrdinalBase: previousCheckpoint?.recordOrdinalBase ?? 0,
					warnings
				})) return result("refused");
			}
			if (!await secureAuditArchiveFile({
				root,
				relativePath: sanitizedRelativePath,
				label: `sanitized ${params.source.label}`,
				warnings
			})) return result("refused");
			if (missing.length > 0) changes.push(`Recovered ${missing.length} later ${params.source.label} row(s) from ${params.source.sourcePath}${retentionNote}`);
			const scrubbedSnapshot = await scrubLegacyAuditRecoveryArchive({
				root,
				relativePath: claimRelativePath,
				expectedSnapshot: snapshot,
				label: params.source.label,
				warnings
			});
			if (!scrubbedSnapshot) return result("refused");
			const scrubbedRecords = prepareLegacyAuditRecords(params.source, scrubbedSnapshot.raw, legacyAuditSourceGenerationKey(rawArchiveRelativePath));
			if (!scrubbedRecords.ok) {
				warnings.push(...scrubbedRecords.warnings);
				warnings.push(`Retained uncheckpointed ${params.source.label} recovery archive; rerun openclaw doctor --fix`);
				return result("refused");
			}
			if (scrubbedRecords.records.length !== 0) {
				warnings.push(`A legacy ${params.source.label} writer appended during recovery; rerun openclaw doctor --fix to import the retained rows`);
				return result("refused");
			}
			const checkpointed = await recordLegacyAuditRawCheckpoint({
				stateDir: params.stateDir,
				rawPath: params.source.sourcePath,
				rawRelativePath: claimRelativePath,
				sanitizedRelativePath,
				root,
				snapshot: scrubbedSnapshot,
				phase: "raw",
				recordCount: 0,
				recordOrdinalBase: (previousCheckpoint?.recordOrdinalBase ?? 0) + Math.max(previousCheckpoint?.recordCount ?? 0, prepared.records.length),
				warnings
			});
			if (checkpointed) await finalizeLegacyAuditRecoveryArchive({
				root,
				relativePath: claimRelativePath
			}).catch((error) => {
				warnings.push(`Failed removing completed ${params.source.label} recovery journal: ${String(error)}`);
			});
			return result(checkpointed ? "completed" : "refused");
		}
		if (!archivePaths) throw new Error(`Missing archive generation for ${params.source.sourcePath}`);
		changes.push(`Migrated ${params.source.label} -> shared SQLite state (${missing.length} new row(s)${retentionNote})`);
		const archived = await archiveLegacyAuditClaim({
			source: params.source,
			claimRelativePath,
			archivePaths,
			snapshot,
			sanitizedJsonl: prepared.sanitizedJsonl,
			root,
			changes,
			warnings
		});
		claimFinalized = archived.moved;
		if (!archived.moved || !archived.rawRelativePath) {
			changes.pop();
			return result("refused");
		}
		if (!archived.scrubbedSnapshot) return result("refused");
		const scrubbedRecords = prepareLegacyAuditRecords(params.source, archived.scrubbedSnapshot.raw, legacyAuditSourceGenerationKey(archived.rawRelativePath));
		if (!scrubbedRecords.ok) {
			warnings.push(...scrubbedRecords.warnings);
			warnings.push(`Retained uncheckpointed ${params.source.label} recovery archive; rerun openclaw doctor --fix`);
			return result("refused");
		}
		if (scrubbedRecords.records.length !== 0) {
			warnings.push(`A legacy ${params.source.label} writer appended during migration; rerun openclaw doctor --fix to import the retained rows`);
			return result("refused");
		}
		const rawPath = path.join(params.stateDir, archived.rawRelativePath);
		const checkpointed = await recordLegacyAuditRawCheckpoint({
			stateDir: params.stateDir,
			rawPath,
			rawRelativePath: archived.rawRelativePath,
			sanitizedRelativePath: archivePaths.sanitized,
			root,
			snapshot: archived.scrubbedSnapshot,
			phase: "raw",
			recordCount: 0,
			recordOrdinalBase: prepared.records.length,
			warnings
		});
		if (checkpointed) await finalizeLegacyAuditRecoveryArchive({
			root,
			relativePath: archived.rawRelativePath
		}).catch((error) => {
			warnings.push(`Failed removing completed ${params.source.label} recovery journal: ${String(error)}`);
		});
		if (await root.exists(sourceRelativePath) && !params.recreatedSourceScheduled) warnings.push(`An old writer recreated ${params.source.label} at ${params.source.logicalSourcePath}; rerun openclaw doctor --fix to import the retained rows`);
		return result(checkpointed ? "completed" : "refused");
	} finally {
		if (!claimFinalized && params.source.storage === "active" && archivePaths) {
			const warningCount = warnings.length;
			await restoreOrPreserveLegacyAuditClaim({
				source: params.source,
				claimRelativePath,
				sourceRelativePath,
				archivePaths,
				root,
				warnings
			});
			if (warnings.length > warningCount) sourceResult.outcome = "refused";
		}
	}
}
async function migrateLegacyAuditLogs(params) {
	const changes = [];
	const warnings = [];
	let hasRefusal = false;
	if (params.detected.sources.length === 0) return {
		changes,
		warnings
	};
	const env = {
		...process.env,
		OPENCLAW_STATE_DIR: params.stateDir
	};
	let lock;
	try {
		lock = await acquireGatewayLock({
			allowInTests: true,
			env,
			pollIntervalMs: 25,
			role: "sqlite-maintenance",
			timeoutMs: 250
		});
	} catch (error) {
		warnings.push(`Skipped legacy audit migration because exclusive state ownership is unavailable: ${String(error)}`);
		return {
			changes,
			warnings
		};
	}
	if (!lock) {
		warnings.push("Skipped legacy audit migration because exclusive state ownership is unavailable");
		return {
			changes,
			warnings
		};
	}
	try {
		await lock.run(() => withLegacyAuditMigrationLease(params.stateDir, async () => {
			const blockedLogicalSources = /* @__PURE__ */ new Set();
			for (const [index, source] of params.detected.sources.entries()) {
				if (blockedLogicalSources.has(source.logicalSourcePath)) continue;
				try {
					const recreatedSourceScheduled = params.detected.sources.slice(index + 1).some((candidate) => candidate.storage === "active" && candidate.logicalSourcePath === source.logicalSourcePath);
					const result = await migrateLegacyAuditLogSource({
						source,
						stateDir: params.stateDir,
						...recreatedSourceScheduled ? { recreatedSourceScheduled: true } : {}
					});
					changes.push(...result.changes);
					warnings.push(...result.warnings);
					if (result.outcome === "refused" || result.outcome === "completed" && result.warnings.length > 0) hasRefusal = true;
					if (result.outcome === "refused" || result.outcome === "skipped") blockedLogicalSources.add(source.logicalSourcePath);
				} catch (error) {
					hasRefusal = true;
					warnings.push(`Failed migrating ${source.label}: ${String(error)}`);
					blockedLogicalSources.add(source.logicalSourcePath);
				}
			}
		}));
	} catch (error) {
		hasRefusal = true;
		warnings.push(`Skipped legacy audit migration because coordination failed: ${String(error)}`);
	} finally {
		await lock.release();
	}
	return {
		changes,
		warnings,
		...warnings.length > 0 && !hasRefusal ? {
			warningDisposition: "recoverable",
			...changes.length === 0 ? { outcome: "skipped" } : {}
		} : {}
	};
}
//#endregion
//#region src/infra/state-migrations.channel-pairing.ts
const PAIRING_SUFFIX = "-pairing.json";
const ALLOW_FROM_SUFFIX = "-allowFrom.json";
function detectLegacyChannelPairingState(params) {
	let directoryEntries = [];
	try {
		directoryEntries = fs.readdirSync(params.sourceDir, { withFileTypes: true });
	} catch (err) {
		if (err.code !== "ENOENT") throw err;
	}
	const files = directoryEntries.filter((entry) => entry.isFile() && (entry.name.endsWith(PAIRING_SUFFIX) || entry.name.endsWith(ALLOW_FROM_SUFFIX))).map((entry) => entry.name).toSorted();
	const pairedChannelIds = files.filter((filename) => filename.endsWith(PAIRING_SUFFIX)).map((filename) => filename.slice(0, -13));
	const configuredChannelIds = params.configuredChannelIds ?? [];
	const accountDiscoveryDeferred = params.deferConfiguredAccountDiscovery === true && files.some((filename) => {
		if (!filename.endsWith(ALLOW_FROM_SUFFIX)) return false;
		const stem = filename.slice(0, -15);
		return configuredChannelIds.some((channelId) => !(CHANNEL_IDS.includes(channelId) && stem === `${channelId}-default`) && (stem === channelId || stem.startsWith(`${channelId}-`)));
	});
	const accounts = !accountDiscoveryDeferred && files.some((filename) => filename.endsWith(ALLOW_FROM_SUFFIX)) ? params.resolveAccounts?.() : void 0;
	const knownChannelIds = dedupePreserveOrder([
		...CHANNEL_IDS,
		...configuredChannelIds,
		...pairedChannelIds
	]).toSorted((left, right) => right.length - left.length || left.localeCompare(right));
	return {
		sourceDir: params.sourceDir,
		files,
		knownChannelIds,
		defaultAccountIds: { ...accounts?.defaultAccountIds },
		accountIds: Object.fromEntries(Object.entries(accounts?.accountIds ?? {}).map(([channel, accountIds]) => [channel, dedupePreserveOrder(accountIds.map((accountId) => resolveAllowFromAccountId(accountId)))])),
		accountDiscoveryDeferred,
		hasLegacy: files.length > 0
	};
}
function parsePairingFilename(filename) {
	return filename.endsWith(PAIRING_SUFFIX) ? filename.slice(0, -13) : null;
}
function findCaseFoldedAllowFromCollisions(filenames, knownChannelIds) {
	const firstFilenameByKey = /* @__PURE__ */ new Map();
	const collisions = /* @__PURE__ */ new Set();
	for (const filename of filenames) {
		if (!filename.endsWith(ALLOW_FROM_SUFFIX)) continue;
		const stem = filename.slice(0, -15);
		for (const channel of knownChannelIds) {
			if (!stem.startsWith(`${channel}-`)) continue;
			const collisionKey = `${channel}\0${stem.slice(channel.length + 1).toLowerCase()}`;
			const firstFilename = firstFilenameByKey.get(collisionKey);
			if (firstFilename) {
				collisions.add(firstFilename);
				collisions.add(filename);
			} else firstFilenameByKey.set(collisionKey, filename);
		}
	}
	return collisions;
}
function parseAllowFromFilename(filename, knownChannelIds, defaultAccountIds, accountIds) {
	if (!filename.endsWith(ALLOW_FROM_SUFFIX)) return null;
	const stem = filename.slice(0, -15);
	const targets = [];
	let hasAccountCollision = false;
	for (const channel of knownChannelIds) {
		if (stem === channel) {
			targets.push({
				channel,
				accountId: normalizeOptionalString(defaultAccountIds[channel]) ?? "default"
			});
			continue;
		}
		if (!stem.startsWith(`${channel}-`)) continue;
		const accountKey = stem.slice(channel.length + 1);
		const matchingAccountIds = (accountIds[channel] ?? []).filter((accountId) => {
			try {
				safeAccountKey(accountId);
				if (accountId === "default" && accountKey !== "default") return false;
				return accountId.toLowerCase() === accountKey.toLowerCase();
			} catch {
				return false;
			}
		});
		if (matchingAccountIds.length === 1 && matchingAccountIds[0]) targets.push({
			channel,
			accountId: matchingAccountIds[0]
		});
		else if (matchingAccountIds.length > 1) hasAccountCollision = true;
		else if (accountKey === "default" && CHANNEL_IDS.includes(channel)) targets.push({
			channel,
			accountId: DEFAULT_ACCOUNT_ID
		});
	}
	if (hasAccountCollision || targets.length > 1) return {
		target: null,
		reason: "ambiguous"
	};
	return targets[0] ? { target: targets[0] } : {
		target: null,
		reason: "unresolved"
	};
}
function normalizeLegacyPairingRequest(value) {
	if (!isRecord(value)) return null;
	const id = normalizeOptionalString(value.id);
	const code = normalizeOptionalString(value.code);
	const createdAt = normalizeOptionalString(value.createdAt);
	const lastSeenAt = normalizeOptionalString(value.lastSeenAt) ?? createdAt;
	if (!id || !code || !createdAt || !lastSeenAt) return null;
	const meta = isRecord(value.meta) ? Object.fromEntries(Object.entries(value.meta).map(([key, entry]) => [key, normalizeOptionalString(entry) ?? ""]).filter(([, entry]) => Boolean(entry))) : void 0;
	return {
		id,
		code,
		createdAt,
		lastSeenAt,
		...meta && Object.keys(meta).length ? { meta } : {}
	};
}
function readLegacyPairingRequests(filePath) {
	try {
		const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
		if (!isRecord(parsed) || !Array.isArray(parsed.requests)) return null;
		return parsed.requests.flatMap((entry) => {
			const request = normalizeLegacyPairingRequest(entry);
			return request ? [request] : [];
		});
	} catch {
		return null;
	}
}
function normalizeAllowEntry(channel, value) {
	const raw = typeof value === "string" || typeof value === "number" ? String(value).trim() : "";
	if (!raw || raw === "*") return "";
	let adapter;
	try {
		adapter = getPairingAdapter(channel);
	} catch {
		adapter = null;
	}
	const normalized = adapter?.normalizeAllowEntry ? adapter.normalizeAllowEntry(raw) : raw;
	const entry = normalizeOptionalString(normalized) ?? "";
	return entry === "*" ? "" : entry;
}
function readLegacyAllowFrom(filePath, channel) {
	try {
		const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
		const values = Array.isArray(parsed) ? parsed : isRecord(parsed) && Array.isArray(parsed.allowFrom) ? parsed.allowFrom : null;
		if (!values) return null;
		return dedupePreserveOrder(values.map((value) => normalizeAllowEntry(channel, value)).filter(Boolean));
	} catch {
		return null;
	}
}
function mergePairingRequests(current, legacy) {
	const merged = current.slice();
	const keys = new Set(current.map((request) => `${resolveAllowFromAccountId(request.meta?.accountId)}\0${request.id}`));
	for (const request of legacy) {
		const key = `${resolveAllowFromAccountId(request.meta?.accountId)}\0${request.id}`;
		if (!keys.has(key)) {
			keys.add(key);
			merged.push(request);
		}
	}
	return merged;
}
function removeImportedSource(filePath, warnings) {
	try {
		fs.rmSync(filePath, { force: true });
		return true;
	} catch (err) {
		warnings.push(`Imported legacy channel pairing state but failed removing ${filePath}: ${String(err)}`);
		return false;
	}
}
function migrateLegacyChannelPairingState(params) {
	const changes = [];
	const warnings = [];
	const caseFoldedCollisions = findCaseFoldedAllowFromCollisions(params.detected.files, params.detected.knownChannelIds);
	for (const filename of params.detected.files) {
		const filePath = path.join(params.detected.sourceDir, filename);
		const pairingChannel = parsePairingFilename(filename);
		if (pairingChannel) {
			const requests = readLegacyPairingRequests(filePath);
			if (!requests) {
				warnings.push(`Legacy channel pairing file unreadable; left in place at ${filePath}`);
				continue;
			}
			updateChannelPairingStateSnapshot(pairingChannel, params.env, (state) => {
				state.requests = mergePairingRequests(state.requests, requests);
			});
			removeImportedSource(filePath, warnings);
			changes.push(`Migrated ${requests.length} ${pairingChannel} pairing request(s) → shared SQLite state`);
			continue;
		}
		const allowTarget = parseAllowFromFilename(filename, params.detected.knownChannelIds, params.detected.defaultAccountIds, params.detected.accountIds);
		if (!allowTarget) continue;
		const hasCaseFoldedCollision = caseFoldedCollisions.has(filename);
		if (hasCaseFoldedCollision || !allowTarget.target) {
			const reason = hasCaseFoldedCollision || allowTarget.reason === "ambiguous" ? "ambiguous" : "unresolved";
			warnings.push(`Legacy channel allowFrom channel/account is ${reason}; left in place at ${filePath}`);
			continue;
		}
		const entries = readLegacyAllowFrom(filePath, allowTarget.target.channel);
		if (!entries) {
			warnings.push(`Legacy channel allowFrom file unreadable; left in place at ${filePath}`);
			continue;
		}
		const accountId = resolveAllowFromAccountId(allowTarget.target.accountId);
		updateChannelPairingStateSnapshot(allowTarget.target.channel, params.env, (state) => {
			state.allowFrom ??= {};
			state.allowFrom[accountId] = dedupePreserveOrder([...state.allowFrom[accountId] ?? [], ...entries]);
		});
		removeImportedSource(filePath, warnings);
		changes.push(`Migrated ${entries.length} ${allowTarget.target.channel}/${accountId} allowFrom entr${entries.length === 1 ? "y" : "ies"} → shared SQLite state`);
	}
	return {
		changes,
		warnings
	};
}
//#endregion
//#region src/infra/state-migrations.commitments.ts
const LEGACY_COMMITMENTS_PATH = "commitments/commitments.json";
const DOCTOR_CLAIM_SUFFIX$3 = ".doctor-discarding";
const MAX_LEGACY_COMMITMENTS_BYTES = 16777216;
const MIGRATION_KIND$5 = "legacy-commitments-json";
const LEGACY_STORE_KEYS = /* @__PURE__ */ new Set(["version", "commitments"]);
const utf8Decoder$3 = new TextDecoder("utf-8", { fatal: true });
function resolveLegacyCommitmentsPath(stateDir) {
	return path.join(stateDir, LEGACY_COMMITMENTS_PATH);
}
/** Detect the exact retired store only when an explicit Doctor flow opts in. */
async function detectLegacyCommitments(params) {
	const sourcePath = resolveLegacyCommitmentsPath(params.stateDir);
	let hasPendingReceipt = false;
	if (params.doctorOnlyStateMigrations === true && !legacyMigrationSourceOrClaimMayExist(sourcePath, DOCTOR_CLAIM_SUFFIX$3)) try {
		const receipt = withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(({ db }) => readLegacyMigrationReceiptFromDatabase(db, resolveLegacyMigrationSourceKey("commitments-json", sourcePath)), { env: params.env });
		hasPendingReceipt = receipt !== void 0 && receipt !== null && !receipt.removedSource;
	} catch {}
	return {
		sourcePath,
		hasLegacy: params.doctorOnlyStateMigrations === true && (legacyMigrationSourceOrClaimMayExist(sourcePath, DOCTOR_CLAIM_SUFFIX$3) || hasPendingReceipt)
	};
}
function parseLegacyCommitments(buffer) {
	let parsed;
	try {
		parsed = JSON.parse(utf8Decoder$3.decode(buffer));
	} catch {
		throw new Error("retired commitments store is not valid UTF-8 JSON");
	}
	if (!isRecord(parsed) || parsed.version !== 1 || !Array.isArray(parsed.commitments) || Object.keys(parsed).some((key) => !LEGACY_STORE_KEYS.has(key))) throw new Error("retired commitments store must contain only version 1 and a commitments array");
	return parsed.commitments.length;
}
async function readLegacyCommitmentsSnapshot(params) {
	const snapshot = await readLegacyMigrationSourceSnapshot({
		...params,
		maxBytes: MAX_LEGACY_COMMITMENTS_BYTES,
		label: "commitments"
	});
	return {
		...snapshot,
		recordCount: parseLegacyCommitments(snapshot.buffer)
	};
}
function recordDiscardDecision(params) {
	const sourceKey = resolveLegacyMigrationSourceKey("commitments-json", params.sourcePath);
	const runId = `${sourceKey}:${params.snapshot.sha256.slice(0, 16)}`;
	const now = Date.now();
	let recreated = false;
	runOpenClawStateWriteTransaction(({ db }) => {
		recreated = readLegacyMigrationReceiptFromDatabase(db, sourceKey)?.removedSource === true;
		const reportJson = JSON.stringify({
			source: MIGRATION_KIND$5,
			target: null,
			decision: "retired-source-discarded",
			sourceSha256: params.snapshot.sha256,
			sourceRecordCount: params.snapshot.recordCount,
			importedRecordCount: 0,
			archivedRecordCount: 0,
			exportedRecordCount: 0
		});
		recordLegacyMigrationReceipt(db, {
			sourceKey,
			migrationKind: MIGRATION_KIND$5,
			sourcePath: params.sourcePath,
			targetTable: "commitments",
			sourceSha256: params.snapshot.sha256,
			sourceSizeBytes: params.snapshot.size,
			sourceRecordCount: params.snapshot.recordCount,
			runId,
			now,
			reportJson,
			upsert: true
		});
	}, { env: params.env }, { operationLabel: "state-migration.commitments" });
	return {
		recreated,
		sourceKey
	};
}
async function migrateWithExclusiveStateOwnership$4(params) {
	const sourcePath = params.detected.sourcePath;
	const sourceKey = resolveLegacyMigrationSourceKey("commitments-json", sourcePath);
	const source = new LegacyMigrationSourceClaim({
		stateRoot: params.stateRoot,
		stateDir: params.stateDir,
		sourcePath,
		label: "commitments",
		claimSuffix: DOCTOR_CLAIM_SUFFIX$3,
		readSnapshot: (candidate) => readLegacyCommitmentsSnapshot({
			stateRoot: params.stateRoot,
			stateDir: params.stateDir,
			sourcePath: candidate
		})
	});
	try {
		await source.recover("retired commitments source conflicts with its interrupted Doctor claim");
		if (!await source.exists()) {
			const receipt = readLegacyMigrationReceipt(sourceKey, params.env);
			if (receipt && !receipt.removedSource) try {
				markLegacyMigrationSourceRemoved(sourceKey, params.env, "state-migration.commitments");
				return {
					changes: ["Finalized the retired commitments JSON discard receipt."],
					warnings: []
				};
			} catch (error) {
				return {
					changes: [],
					warnings: [`Retired commitments JSON was removed, but its receipt could not be finalized: ${String(error)}`]
				};
			}
			return {
				changes: [],
				warnings: []
			};
		}
	} catch (error) {
		return {
			changes: [],
			warnings: [`Failed recovering retired commitments JSON: ${String(error)}`]
		};
	}
	let snapshot;
	try {
		snapshot = await source.read();
		params.beforeVerify?.();
		if (!legacyMigrationSourceSnapshotsMatch(snapshot, await source.read())) throw new Error("retired commitments source changed after Doctor loaded it");
	} catch (error) {
		return {
			changes: [],
			warnings: [`Failed reading retired commitments JSON: ${String(error)}`]
		};
	}
	try {
		await source.claim({
			snapshot,
			mismatchMessage: "retired commitments source changed before Doctor could claim it",
			beforeClaim: params.beforeClaim
		});
	} catch (error) {
		const restoreError = await source.restore();
		return {
			changes: [],
			warnings: [`Failed claiming retired commitments JSON: ${String(error)}${restoreError ? `; restore failure: ${restoreError}` : ""}`]
		};
	}
	let decision;
	try {
		decision = recordDiscardDecision({
			env: params.env,
			sourcePath,
			snapshot
		});
	} catch (error) {
		const restoreError = await source.restore();
		return {
			changes: [],
			warnings: [`Failed recording retired commitments discard: ${String(error)}${restoreError ? `; restore failure: ${restoreError}` : ""}`]
		};
	}
	try {
		if (!legacyMigrationSourceSnapshotsMatch(snapshot, await source.read(true))) throw new Error("retired commitments Doctor claim changed before cleanup");
		await source.remove({
			removeSource: params.removeSource,
			sourceReappearedMessage: "retired commitments source reappeared during cleanup",
			sourceRemainingMessage: "retired commitments source remains after cleanup",
			claimRemainingMessage: "retired commitments Doctor claim remains after cleanup"
		});
	} catch (error) {
		return {
			changes: [],
			warnings: [`Retired commitments discard was recorded, but cleanup failed: ${String(error)}`]
		};
	}
	const warnings = [];
	try {
		markLegacyMigrationSourceRemoved(decision.sourceKey, params.env, "state-migration.commitments");
	} catch (error) {
		warnings.push(`Retired commitments JSON was removed, but its receipt could not be finalized: ${String(error)}`);
	}
	const rowLabel = snapshot.recordCount === 1 ? "row" : "rows";
	return {
		changes: [decision.recreated ? `Discarded recreated retired commitments JSON with ${snapshot.recordCount} ${rowLabel}; no data was imported, archived, or exported.` : `Discarded retired commitments JSON with ${snapshot.recordCount} ${rowLabel}; no data was imported, archived, or exported.`],
		warnings
	};
}
/** Discard retired persistent state while excluding active Gateway owners. */
async function migrateLegacyCommitments(params) {
	if (!params.detected.hasLegacy) return {
		changes: [],
		warnings: []
	};
	return await withLegacyMigrationStateLock({
		stateDir: params.stateDir,
		env: params.env,
		label: "retired commitments JSON",
		releaseLabel: "Commitments",
		errorLabel: "Failed retiring commitments JSON",
		retryGuidance: "Stop the Gateway, then run `openclaw doctor --fix` again.",
		run: async (env) => {
			const stateRoot = await root(params.stateDir, {
				hardlinks: "reject",
				maxBytes: MAX_LEGACY_COMMITMENTS_BYTES,
				symlinks: "reject"
			});
			return await migrateWithExclusiveStateOwnership$4({
				...params,
				env,
				stateRoot
			});
		}
	});
}
//#endregion
//#region src/infra/state-migrations.debug-proxy.ts
const DEBUG_PROXY_SQLITE_SIDECAR_SUFFIXES = [
	"",
	"-shm",
	"-wal",
	"-journal"
];
var LegacyDebugProxyBlobConflictError = class extends Error {
	constructor(blobId) {
		super(`legacy debug proxy blob conflicts with shared state: ${blobId}`);
		this.blobId = blobId;
	}
};
var LegacyDebugProxySessionConflictError = class extends Error {
	constructor(sessionId) {
		super(`legacy debug proxy session conflicts with shared state: ${sessionId}`);
		this.sessionId = sessionId;
	}
};
function fileExists(filePath) {
	try {
		return fs.statSync(filePath).isFile();
	} catch {
		return false;
	}
}
function dirExists(dirPath) {
	try {
		return fs.statSync(dirPath).isDirectory();
	} catch {
		return false;
	}
}
function resolveLegacyDebugProxyCapturePaths(stateDir) {
	const rootDir = path.join(stateDir, "debug-proxy");
	return {
		sourcePath: path.join(rootDir, "capture.sqlite"),
		blobDir: path.join(rootDir, "blobs")
	};
}
function hasPendingSqliteArchive(sourcePath) {
	return !fileExists(sourcePath) && fileExists(`${sourcePath}.migrated`) && DEBUG_PROXY_SQLITE_SIDECAR_SUFFIXES.some((suffix) => suffix !== "" && fileExists(`${sourcePath}${suffix}`));
}
function detectLegacyDebugProxyCaptureSidecar(stateDir, env = process.env) {
	const paths = resolveLegacyDebugProxyCapturePaths(stateDir);
	if (path.resolve(paths.sourcePath) === path.resolve(resolveOpenClawStateSqlitePath({
		...env,
		OPENCLAW_STATE_DIR: stateDir
	}))) return {
		...paths,
		hasLegacy: false
	};
	const hasArchivedDatabase = fileExists(`${paths.sourcePath}.migrated`);
	return {
		...paths,
		hasLegacy: fileExists(paths.sourcePath) || hasPendingSqliteArchive(paths.sourcePath) || hasArchivedDatabase && dirExists(paths.blobDir)
	};
}
function listSqliteColumns(db, table) {
	const rows = db.prepare(`PRAGMA table_info(${table})`).all();
	return new Set(rows.flatMap((row) => typeof row.name === "string" ? [row.name] : []));
}
function assertTableColumns(db, table, expected) {
	const columns = listSqliteColumns(db, table);
	const missing = expected.filter((column) => !columns.has(column));
	if (missing.length > 0) throw new Error(`legacy ${table} table is missing ${missing.join(", ")}`);
}
function normalizeSqliteInteger(value) {
	return value === null ? null : coerceRequiredSqliteNumber(value);
}
function readLegacyDebugProxyCapture(params) {
	const db = openNodeSqliteDatabase(params.sourcePath, { readOnly: true });
	try {
		assertTableColumns(db, "capture_sessions", [
			"id",
			"started_at",
			"ended_at",
			"mode",
			"source_scope",
			"source_process",
			"proxy_url",
			"db_path",
			"blob_dir"
		]);
		assertTableColumns(db, "capture_events", [
			"session_id",
			"ts",
			"source_scope",
			"source_process",
			"protocol",
			"direction",
			"kind",
			"flow_id",
			"method",
			"host",
			"path",
			"status",
			"close_code",
			"content_type",
			"headers_json",
			"data_text",
			"data_blob_id",
			"data_sha256",
			"error_text",
			"meta_json"
		]);
		const sessions = db.prepare(`SELECT id, started_at, ended_at, mode, source_scope, source_process, proxy_url, blob_dir
         FROM capture_sessions
         ORDER BY started_at ASC, id ASC`).all();
		const events = db.prepare(`SELECT
           session_id, ts, source_scope, source_process, protocol, direction, kind, flow_id,
           method, host, path, status, close_code, content_type, headers_json, data_text,
           data_blob_id, data_sha256, error_text, meta_json
         FROM capture_events
         ORDER BY ts ASC, id ASC`).all();
		const sessionIds = new Set(sessions.map((session) => session.id));
		for (const event of events) {
			if (sessionIds.has(event.session_id)) continue;
			sessions.push({
				id: event.session_id,
				started_at: event.ts,
				ended_at: null,
				mode: "implicit",
				source_scope: event.source_scope,
				source_process: event.source_process,
				proxy_url: null,
				blob_dir: params.blobDir
			});
			sessionIds.add(event.session_id);
		}
		const blobEvents = /* @__PURE__ */ new Map();
		for (const event of events) {
			if (!event.data_blob_id) continue;
			const rows = blobEvents.get(event.data_blob_id) ?? [];
			rows.push(event);
			blobEvents.set(event.data_blob_id, rows);
		}
		const blobDirBySession = new Map(sessions.map((session) => [session.id, session.blob_dir]));
		const usedBlobDirs = /* @__PURE__ */ new Set();
		const blobs = [];
		for (const [blobId, referencingEvents] of blobEvents) {
			const candidateBlobDirs = [.../* @__PURE__ */ new Set([...referencingEvents.map((event) => blobDirBySession.get(event.session_id) ?? params.blobDir), params.blobDir])];
			const blobPath = candidateBlobDirs.map((blobDir) => path.join(blobDir, `${blobId}.bin.gz`)).find(fileExists) ?? path.join(candidateBlobDirs[0] ?? params.blobDir, `${blobId}.bin.gz`);
			const data = fs.readFileSync(blobPath);
			const raw = gunzipSync(data);
			const sha256 = sha256Hex(raw);
			if (sha256.slice(0, 24) !== blobId) throw new Error(`legacy debug proxy blob hash mismatch: ${blobPath}`);
			usedBlobDirs.add(path.dirname(blobPath));
			blobs.push({
				blobId,
				contentType: referencingEvents.find((event) => event.content_type)?.content_type ?? null,
				encoding: "gzip",
				sizeBytes: raw.byteLength,
				sha256,
				data,
				createdAt: Math.min(...referencingEvents.map((event) => normalizeSqliteInteger(event.ts) ?? 0))
			});
		}
		return {
			sessions,
			events,
			blobs,
			blobDirs: [...usedBlobDirs]
		};
	} finally {
		db.close();
	}
}
function eventValues(event) {
	return [
		event.session_id,
		normalizeSqliteInteger(event.ts),
		event.source_scope,
		event.source_process,
		event.protocol,
		event.direction,
		event.kind,
		event.flow_id,
		event.method,
		event.host,
		event.path,
		normalizeSqliteInteger(event.status),
		normalizeSqliteInteger(event.close_code),
		event.content_type,
		event.headers_json,
		event.data_text,
		event.data_blob_id,
		event.data_sha256,
		event.error_text,
		event.meta_json
	];
}
function eventKey(values) {
	return JSON.stringify(values);
}
function archiveLegacyDebugProxySqlite(params) {
	const existingSources = DEBUG_PROXY_SQLITE_SIDECAR_SUFFIXES.map((suffix) => `${params.sourcePath}${suffix}`).filter(fileExists);
	if (existingSources.length === 0) return;
	const resolutions = [];
	for (const sourcePath of existingSources) {
		const archivedPath = `${sourcePath}.migrated`;
		try {
			if (fileExists(archivedPath)) {
				if (fs.readFileSync(sourcePath).equals(fs.readFileSync(archivedPath))) {
					fs.rmSync(sourcePath, { force: true });
					resolutions.push({
						sourcePath,
						targetPath: archivedPath,
						removed: true
					});
					continue;
				}
				let index = 2;
				while (fs.existsSync(`${sourcePath}.migrated.${index}`)) index++;
				const nextArchivePath = `${sourcePath}.migrated.${index}`;
				fs.renameSync(sourcePath, nextArchivePath);
				resolutions.push({
					sourcePath,
					targetPath: nextArchivePath,
					removed: false
				});
				continue;
			}
			fs.renameSync(sourcePath, archivedPath);
			resolutions.push({
				sourcePath,
				targetPath: archivedPath,
				removed: false
			});
		} catch (err) {
			params.warnings.push(`Failed archiving debug proxy capture sidecar ${sourcePath}: ${String(err)}`);
			return;
		}
	}
	if (resolutions.every((resolution) => !resolution.removed && resolution.targetPath === `${resolution.sourcePath}.migrated`)) {
		params.changes.push(`Archived debug proxy capture sidecar legacy source → ${params.sourcePath}.migrated`);
		return;
	}
	for (const resolution of resolutions) params.changes.push(resolution.removed ? `Removed already-archived debug proxy capture sidecar legacy source ${resolution.sourcePath}` : `Archived debug proxy capture sidecar legacy source → ${resolution.targetPath}`);
}
function archiveLegacyDebugProxyBlobs(params) {
	if (!dirExists(params.blobDir)) return;
	const archivePath = `${params.blobDir}.migrated`;
	try {
		let targetPath = archivePath;
		if (dirExists(archivePath)) {
			let index = 2;
			while (fs.existsSync(`${params.blobDir}.migrated.${index}`)) index++;
			targetPath = `${params.blobDir}.migrated.${index}`;
		}
		fs.renameSync(params.blobDir, targetPath);
		params.changes.push(`Archived debug proxy capture blobs → ${targetPath}`);
	} catch (err) {
		params.warnings.push(`Failed archiving debug proxy capture blobs ${params.blobDir}: ${String(err)}`);
	}
}
function migrateLegacyDebugProxyCaptureSidecar(params) {
	const detected = params.detected ?? detectLegacyDebugProxyCaptureSidecar(params.stateDir);
	const changes = [];
	const warnings = [];
	if (!detected.hasLegacy) return {
		changes,
		warnings
	};
	if (!fileExists(detected.sourcePath)) {
		archiveLegacyDebugProxySqlite({
			sourcePath: detected.sourcePath,
			changes,
			warnings
		});
		if (fileExists(`${detected.sourcePath}.migrated`)) archiveLegacyDebugProxyBlobs({
			blobDir: detected.blobDir,
			changes,
			warnings
		});
		return {
			changes,
			warnings
		};
	}
	let legacy;
	try {
		legacy = readLegacyDebugProxyCapture(detected);
	} catch (err) {
		return {
			changes,
			warnings: [`Failed reading debug proxy capture sidecar ${detected.sourcePath}: ${String(err)}`]
		};
	}
	try {
		runOpenClawStateWriteTransaction(({ db }) => {
			const selectBlob = db.prepare(`SELECT encoding, size_bytes AS sizeBytes, sha256, data
           FROM capture_blobs
           WHERE blob_id = ?`);
			const insertBlob = db.prepare(`INSERT INTO capture_blobs (
            blob_id, content_type, encoding, size_bytes, sha256, data, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`);
			for (const blob of legacy.blobs) {
				const existing = selectBlob.get(blob.blobId);
				if (existing) {
					if (existing.encoding !== blob.encoding || Number(existing.sizeBytes) !== blob.sizeBytes || existing.sha256 !== blob.sha256 || !existing.data || !Buffer.from(existing.data).equals(blob.data)) throw new LegacyDebugProxyBlobConflictError(blob.blobId);
					continue;
				}
				insertBlob.run(blob.blobId, blob.contentType, blob.encoding, blob.sizeBytes, blob.sha256, blob.data, blob.createdAt);
			}
			const selectSession = db.prepare(`SELECT
            started_at AS startedAt,
            ended_at AS endedAt,
            mode,
            source_scope AS sourceScope,
            source_process AS sourceProcess,
            proxy_url AS proxyUrl
           FROM capture_sessions
           WHERE id = ?`);
			const insertSession = db.prepare(`INSERT INTO capture_sessions (
            id, started_at, ended_at, mode, source_scope, source_process, proxy_url
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`);
			for (const session of legacy.sessions) {
				const values = [
					session.id,
					normalizeSqliteInteger(session.started_at),
					normalizeSqliteInteger(session.ended_at),
					session.mode,
					session.source_scope,
					session.source_process,
					session.proxy_url
				];
				const existing = selectSession.get(session.id);
				if (existing) {
					const expected = {
						startedAt: values[1],
						endedAt: values[2],
						mode: values[3],
						sourceScope: values[4],
						sourceProcess: values[5],
						proxyUrl: values[6]
					};
					if (JSON.stringify(existing) !== JSON.stringify(expected)) throw new LegacyDebugProxySessionConflictError(session.id);
					continue;
				}
				insertSession.run(...values);
			}
			const existingEventCount = db.prepare(`SELECT COUNT(*) AS count
           FROM capture_events
           WHERE session_id IS ? AND ts IS ? AND source_scope IS ? AND source_process IS ?
             AND protocol IS ? AND direction IS ? AND kind IS ? AND flow_id IS ?
             AND method IS ? AND host IS ? AND path IS ? AND status IS ? AND close_code IS ?
             AND content_type IS ? AND headers_json IS ? AND data_text IS ? AND data_blob_id IS ?
             AND data_sha256 IS ? AND error_text IS ? AND meta_json IS ?
          `);
			const insertEvent = db.prepare(`INSERT INTO capture_events (
            session_id, ts, source_scope, source_process, protocol, direction, kind, flow_id,
            method, host, path, status, close_code, content_type, headers_json, data_text,
            data_blob_id, data_sha256, error_text, meta_json
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
			const existingCounts = /* @__PURE__ */ new Map();
			const seenCounts = /* @__PURE__ */ new Map();
			for (const event of legacy.events) {
				const values = eventValues(event);
				const key = eventKey(values);
				const seenCount = (seenCounts.get(key) ?? 0) + 1;
				seenCounts.set(key, seenCount);
				let existingCount = existingCounts.get(key);
				if (existingCount === void 0) {
					const row = existingEventCount.get(...values);
					existingCount = Number(row?.count ?? 0);
					existingCounts.set(key, existingCount);
				}
				if (seenCount > existingCount) insertEvent.run(...values);
			}
		}, { env: {
			...process.env,
			OPENCLAW_STATE_DIR: params.stateDir
		} });
		changes.push(`Migrated ${legacy.sessions.length} debug proxy capture ${legacy.sessions.length === 1 ? "session" : "sessions"}, ${legacy.events.length} ${legacy.events.length === 1 ? "event" : "events"}, and ${legacy.blobs.length} ${legacy.blobs.length === 1 ? "blob" : "blobs"} → shared SQLite state`);
	} catch (err) {
		const detail = err instanceof LegacyDebugProxyBlobConflictError ? `blob ${err.blobId} already exists with different data` : err instanceof LegacyDebugProxySessionConflictError ? `session ${err.sessionId} already exists with different data` : String(err);
		return {
			changes,
			warnings: [`Failed migrating debug proxy capture sidecar ${detected.sourcePath}: ${detail}`]
		};
	}
	archiveLegacyDebugProxySqlite({
		sourcePath: detected.sourcePath,
		changes,
		warnings
	});
	if (!fileExists(detected.sourcePath) && fileExists(`${detected.sourcePath}.migrated`)) {
		archiveLegacyDebugProxyBlobs({
			blobDir: detected.blobDir,
			changes,
			warnings
		});
		for (const blobDir of legacy.blobDirs) {
			if (path.resolve(blobDir) === path.resolve(detected.blobDir) || !dirExists(blobDir)) continue;
			warnings.push(`Left migrated debug proxy capture blobs in stored session directory: ${blobDir}`);
		}
	}
	return {
		changes,
		warnings
	};
}
//#endregion
//#region src/infra/state-migrations.legacy-owner.ts
const DEFERRED_LEGACY_OWNER_MESSAGE = "Deferred legacy agent/session migration: select an agent owner";
function tryResolveDoctorSessionMigrationAgentId(cfg, migrationAgentId) {
	return migrationAgentId ?? (!isPerAgentSessionStoreConfig(cfg.session?.store) ? resolveSessionStoreCompatibilityAgentId(cfg) : void 0);
}
/** A migration destination is not proof that runtime consumes the source. */
function classifyLegacyOwnerFindings(params) {
	const requiredWarnings = [...params.requiredWarnings];
	const advisoryWarnings = [];
	for (const { source, inspection, outsideSnapshot } of params.agentInspections) {
		if (inspection.status !== "failed") continue;
		(source.standalone && !outsideSnapshot && params.usesLegacyRuntimeDirectory() ? requiredWarnings : advisoryWarnings).push(inspection.warning);
	}
	const warnings = [
		...requiredWarnings,
		...advisoryWarnings,
		...params.deferredSessions || params.deferredAgentDir && params.doctorOnlyStateMigrations === true ? [DEFERRED_LEGACY_OWNER_MESSAGE] : []
	];
	const notices = params.deferredAgentDir && params.doctorOnlyStateMigrations !== true ? [DEFERRED_LEGACY_OWNER_MESSAGE] : [];
	return {
		warnings,
		notices,
		...requiredWarnings.length === 0 && (warnings.length > 0 || notices.length > 0) ? {
			warningDisposition: "recoverable",
			outcome: "deferred"
		} : {}
	};
}
//#endregion
//#region src/infra/first-line-read.ts
const HEADER_CHUNK_BYTES = 8192;
const HEADER_MAX_CHARS = 1048576;
/** Reads the first newline-terminated line of a file, or undefined when there is none. */
function readFirstLineSync(filePath) {
	const fd = fs.openSync(filePath, "r");
	try {
		const decoder = new StringDecoder("utf8");
		const chunk = Buffer.alloc(HEADER_CHUNK_BYTES);
		let carry = "";
		for (let position = 0;;) {
			const bytesRead = readFileWindowFullySync(fd, chunk, position);
			if (bytesRead <= 0) {
				carry += decoder.end();
				return carry.length > 0 ? carry : void 0;
			}
			position += bytesRead;
			carry += decoder.write(chunk.subarray(0, bytesRead));
			const newline = carry.indexOf("\n");
			if (newline >= 0) return carry.slice(0, newline);
			if (carry.length > HEADER_MAX_CHARS) return;
		}
	} finally {
		fs.closeSync(fd);
	}
}
//#endregion
//#region src/infra/state-migrations.acp-session-metadata.ts
/** Retained JSON is input history, not authority to reopen a completed ACP import. */
function importLegacyAcpSessionMetadata(params) {
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey) return false;
	const source = prepareLegacyAcpMigrationSource(params);
	const now = params.now?.() ?? Date.now();
	return runOpenClawStateWriteTransaction((database) => {
		if (hasLegacyAcpMigrationCompletion(database.db, source)) return false;
		const coreTarget = params.readVerifiedCoreImport(database.db, params.agentId);
		let imported = true;
		if (coreTarget) {
			const { entry: canonical, sources } = readLegacyAcpMigrationContext({
				agentId: params.agentId,
				storePath: coreTarget.sqlitePath,
				sessionKey,
				env: params.env
			});
			imported = legacyAcpMigrationBindingMatches(source, canonical) && !selectAcpSessionRowForStoreEntry(database.db, sessionKey, params.agentId, params.cfg, canonical);
			if (imported && !sources.some((recorded) => legacyAcpMigrationSourceKey(recorded) === legacyAcpMigrationSourceKey(source) && recorded.sourceSha256 === source.sourceSha256)) throw new Error("Retained ACP import has no matching recorded source provenance; metadata was not replayed.");
		}
		if (imported) writeAcpSessionMetaForMigration({
			...params,
			sessionKey,
			database,
			now: () => now
		});
		if (params.preserveSource) recordLegacyAcpMigrationCompletion(database.db, source, now);
		return imported;
	}, { env: params.env }, { operationLabel: "state.import-legacy-acp-metadata" });
}
//#endregion
//#region src/infra/state-migrations.session-store-paths.ts
function resolveSessionStorePathRelationship(left, right) {
	if (left === right) return "same";
	try {
		return sameFileIdentity(fs.statSync(left, { bigint: true }), fs.statSync(right, { bigint: true })) ? "same" : "different";
	} catch (err) {
		if (!hasErrnoCode(err, "ENOENT") && !hasErrnoCode(err, "ENOTDIR")) return "unknown";
		const resolvedLeft = resolvePathThroughExistingParents(left);
		const resolvedRight = resolvePathThroughExistingParents(right);
		if (resolvedLeft === void 0 || resolvedRight === void 0) return "unknown";
		return resolvedLeft === resolvedRight ? "same" : "different";
	}
}
function sessionStorePathsMatch(left, right) {
	return resolveSessionStorePathRelationship(left, right) !== "different";
}
function resolvePathThroughExistingParents(filePath) {
	const resolvedPath = path.resolve(filePath);
	const suffix = [path.basename(resolvedPath)];
	let parentPath = path.dirname(resolvedPath);
	while (true) try {
		return path.join(fs.realpathSync.native(parentPath), ...suffix);
	} catch (err) {
		if (!hasErrnoCode(err, "ENOENT") && !hasErrnoCode(err, "ENOTDIR")) return;
		const nextParent = path.dirname(parentPath);
		if (nextParent === parentPath) return;
		suffix.unshift(path.basename(parentPath));
		parentPath = nextParent;
	}
}
function sessionStorePathIsFinalSymlink(storePath) {
	try {
		return fs.lstatSync(storePath).isSymbolicLink();
	} catch {
		return false;
	}
}
function sessionStorePathsHaveDistinctEntries(left, right) {
	if (left === right) return false;
	try {
		if (fs.lstatSync(left).isSymbolicLink() || fs.lstatSync(right).isSymbolicLink()) return true;
		return fs.realpathSync.native(left) !== fs.realpathSync.native(right);
	} catch (err) {
		if (!hasErrnoCode(err, "ENOENT") && !hasErrnoCode(err, "ENOTDIR")) return true;
		const resolvedLeft = resolvePathThroughExistingParents(left);
		const resolvedRight = resolvePathThroughExistingParents(right);
		return resolvedLeft === void 0 || resolvedLeft !== resolvedRight;
	}
}
function resolveSessionStoreAliasPlan(storePath, candidatePaths) {
	let hasDistinctEntries = false;
	let hasFinalSymlink = sessionStorePathIsFinalSymlink(storePath);
	let hasUnresolvedIdentity = false;
	for (const candidatePath of candidatePaths) {
		const relationship = resolveSessionStorePathRelationship(storePath, candidatePath);
		if (relationship === "different") continue;
		if (relationship === "unknown") {
			hasUnresolvedIdentity = true;
			continue;
		}
		hasFinalSymlink ||= sessionStorePathIsFinalSymlink(candidatePath);
		if (sessionStorePathsHaveDistinctEntries(storePath, candidatePath)) hasDistinctEntries = true;
	}
	return {
		hasDistinctAliases: hasFinalSymlink || hasDistinctEntries || hasUnresolvedIdentity,
		hasFinalSymlink,
		hasUnresolvedIdentity
	};
}
//#endregion
//#region src/infra/state-migrations.session-surfaces.ts
function isSurfaceGroupKey(key) {
	return key.includes(":group:") || key.includes(":channel:");
}
function isLegacyGroupKey(key, surfaces = []) {
	const trimmed = key.trim();
	if (!trimmed) return false;
	const lower = normalizeLowercaseStringOrEmpty(trimmed);
	if (lower.startsWith("group:") || lower.startsWith("channel:")) return true;
	for (const surface of surfaces) if (surface.isLegacyGroupSessionKey?.(trimmed)) return true;
	return false;
}
//#endregion
//#region src/infra/state-migrations.session-store.ts
function isLegacyDefaultMainAliasKey(key, mainKey) {
	const lower = normalizeLowercaseStringOrEmpty(key.trim());
	const canonicalMainKey = normalizeMainKey(mainKey);
	return lower === `agent:main:main` || lower === `agent:main:${canonicalMainKey}`;
}
function resolveCanonicalAgentSessionOwner(key) {
	const parsed = parseAgentSessionKey(key);
	if (parsed === null || !isValidAgentId(parsed.agentId) || normalizeAgentId(parsed.agentId) !== parsed.agentId) return;
	return parsed.agentId;
}
function canonicalizeSessionKeyForAgent(params) {
	const raw = params.key.trim();
	if (!raw) return raw;
	const rawLower = normalizeLowercaseStringOrEmpty(raw);
	const legacyDefaultMainAlias = isLegacyDefaultMainAliasKey(rawLower, params.mainKey);
	const configuredAgentId = normalizeAgentId(params.agentId);
	const canonicalRowOwner = resolveCanonicalAgentSessionOwner(raw);
	const candidateOwner = params.preserveCanonicalAgentOwner ? canonicalRowOwner : void 0;
	const agentId = (candidateOwner === "main" && configuredAgentId !== "main" && legacyDefaultMainAlias ? void 0 : candidateOwner) ?? configuredAgentId;
	const normalized = normalizeSessionKeyPreservingOpaquePeerIds(raw);
	if (rawLower === "global" || rawLower === "unknown") return rawLower;
	if (params.preserveForeignMainAliases && legacyDefaultMainAlias) return params.key;
	const canonicalMain = canonicalizeMainSessionAlias({
		cfg: { session: {
			scope: params.scope,
			mainKey: params.mainKey
		} },
		agentId,
		sessionKey: normalized
	});
	if (params.scope === "global" && canonicalMain === "global") return canonicalMain;
	if (params.preserveAmbiguousKeys && (!canonicalRowOwner || legacyDefaultMainAlias)) return params.key;
	if (params.skipCrossAgentRemap) {
		const parsed = parseAgentSessionKey(raw);
		if (parsed && normalizeAgentId(parsed.agentId) !== agentId) return normalized;
		if (agentId !== "main" && (rawLower === "main" || rawLower === params.mainKey)) return rawLower;
	}
	if (canonicalMain !== normalized) return normalizeLowercaseStringOrEmpty(canonicalMain);
	const defaultPrefix = `agent:${LEGACY_IMPLICIT_AGENT_ID}:`;
	if (rawLower.startsWith(defaultPrefix) && agentId !== "main" && !params.skipCrossAgentRemap) {
		const rest = rawLower.slice(defaultPrefix.length);
		if (rest === "main" || rest === params.mainKey) {
			const remapped = `agent:${agentId}:${rest}`;
			const canonicalized = canonicalizeMainSessionAlias({
				cfg: { session: {
					scope: params.scope,
					mainKey: params.mainKey
				} },
				agentId,
				sessionKey: remapped
			});
			return normalizeLowercaseStringOrEmpty(canonicalized);
		}
	}
	if (rawLower.startsWith("agent:") && canonicalRowOwner) return normalized;
	if (rawLower.startsWith("subagent:")) {
		const rest = raw.slice(9);
		return normalizeLowercaseStringOrEmpty(`agent:${agentId}:subagent:${rest}`);
	}
	for (const surface of params.legacySessionSurfaces ?? []) {
		const canonicalized = surface.canonicalizeLegacySessionKey?.({
			key: raw,
			agentId
		});
		const normalizedCanonicalized = normalizeSessionKeyPreservingOpaquePeerIds(canonicalized);
		if (normalizedCanonicalized) return normalizedCanonicalized;
	}
	if (rawLower.startsWith("group:") || rawLower.startsWith("channel:")) return normalizeLowercaseStringOrEmpty(`agent:${agentId}:unknown:${raw}`);
	if (isSurfaceGroupKey(raw)) return `agent:${agentId}:${normalized}`;
	return normalizeSessionKeyPreservingOpaquePeerIds(`agent:${agentId}:${raw}`);
}
function pickLatestLegacyDirectEntry(store, legacySessionSurfaces = []) {
	let best = null;
	let bestUpdated = -1;
	for (const [key, entry] of Object.entries(store)) {
		if (!entry || typeof entry !== "object") continue;
		const normalized = key.trim();
		if (!normalized) continue;
		const normalizedLower = normalizeLowercaseStringOrEmpty(normalized);
		if (normalizedLower === "global") continue;
		if (normalizedLower.startsWith("agent:")) continue;
		if (normalizedLower.startsWith("subagent:")) continue;
		if (isLegacyGroupKey(normalized, legacySessionSurfaces) || isSurfaceGroupKey(normalized)) continue;
		const updatedAt = typeof entry.updatedAt === "number" ? entry.updatedAt : 0;
		if (updatedAt > bestUpdated) {
			bestUpdated = updatedAt;
			best = entry;
		}
	}
	return best;
}
function normalizeSessionEntry(entry, sessionKey) {
	const { room, ...entryWithoutRoom } = entry;
	const shaped = normalizePersistedSessionEntryShape(entryWithoutRoom, { sessionKey });
	if (!shaped) return null;
	const normalized = { ...shaped };
	if (typeof normalized.sessionId === "string") normalized.updatedAt = typeof normalized.updatedAt === "number" && Number.isFinite(normalized.updatedAt) ? normalized.updatedAt : Date.now();
	if (typeof normalized.groupChannel !== "string" && typeof room === "string") normalized.groupChannel = room;
	return normalized;
}
function resolveUpdatedAt(entry) {
	return typeof entry.updatedAt === "number" && Number.isFinite(entry.updatedAt) ? entry.updatedAt : 0;
}
function selectNewerSessionEntry(params) {
	if (!params.existing) return params.incoming;
	const existingUpdated = resolveUpdatedAt(params.existing);
	const incomingUpdated = resolveUpdatedAt(params.incoming);
	if (incomingUpdated > existingUpdated) return params.incoming;
	if (incomingUpdated < existingUpdated) return params.existing;
	return params.preferIncomingOnTie ? params.incoming : params.existing;
}
function canonicalizeSessionStore(params) {
	const canonical = Object.create(null);
	const meta = /* @__PURE__ */ new Map();
	const legacyKeys = [];
	for (const [key, entry] of Object.entries(params.store)) {
		if (!entry || typeof entry !== "object") continue;
		const canonicalKey = canonicalizeSessionKeyForAgent({
			key,
			agentId: params.agentId,
			mainKey: params.mainKey,
			scope: params.scope,
			skipCrossAgentRemap: params.skipCrossAgentRemap,
			preserveCanonicalAgentOwner: params.preserveCanonicalAgentOwner,
			preserveAmbiguousKeys: params.preserveAmbiguousKeys,
			preserveForeignMainAliases: params.preserveForeignMainAliases,
			legacySessionSurfaces: params.legacySessionSurfaces
		});
		const isCanonical = canonicalKey === key;
		if (!isCanonical) legacyKeys.push(key);
		const existing = canonical[canonicalKey];
		if (!existing) {
			canonical[canonicalKey] = entry;
			meta.set(canonicalKey, {
				isCanonical,
				updatedAt: resolveUpdatedAt(entry)
			});
			continue;
		}
		const existingMeta = meta.get(canonicalKey);
		const incomingUpdated = resolveUpdatedAt(entry);
		const existingUpdated = existingMeta?.updatedAt ?? resolveUpdatedAt(existing);
		if (incomingUpdated > existingUpdated) {
			canonical[canonicalKey] = entry;
			meta.set(canonicalKey, {
				isCanonical,
				updatedAt: incomingUpdated
			});
			continue;
		}
		if (incomingUpdated < existingUpdated) continue;
		if (existingMeta?.isCanonical && !isCanonical) continue;
		if (!existingMeta?.isCanonical && isCanonical) {
			canonical[canonicalKey] = entry;
			meta.set(canonicalKey, {
				isCanonical,
				updatedAt: incomingUpdated
			});
			continue;
		}
	}
	return {
		store: canonical,
		legacyKeys
	};
}
function isAmbiguousSharedStoreKey(key, mainKey, scope) {
	const raw = key.trim();
	const lower = normalizeLowercaseStringOrEmpty(raw);
	if (!raw || lower === "global" || lower === "unknown") return false;
	if (scope === "global" && canonicalizeMainSessionAlias({
		cfg: { session: {
			scope,
			mainKey
		} },
		agentId: "main",
		sessionKey: lower
	}) === "global") return false;
	return !resolveCanonicalAgentSessionOwner(raw) || isLegacyDefaultMainAliasKey(lower, mainKey);
}
function aliasedSessionStoreMigrationWarning(params) {
	return `Deferred ${params.subject} ${params.count} ambiguous session key(s) in aliased store ${params.storePath}; remove filesystem aliases or configure one canonical session.store path, then rerun openclaw doctor --fix`;
}
function unresolvedSessionStoreIdentityWarning(subject, storePath) {
	return `Deferred ${subject} for ${storePath}; filesystem identity could not be established for every configured store path. Restore path access or configure one canonical session.store path, then rerun openclaw doctor --fix`;
}
function distinctSessionStoreAliasWarning(subject, storePath) {
	return `Deferred ${subject} in aliased store ${storePath}; atomic replacement cannot update distinct filesystem aliases as one operation. Remove filesystem aliases or configure one canonical session.store path, then rerun openclaw doctor --fix`;
}
function resolveStaleLegacySessionFile(params) {
	if (!params.entry || typeof params.entry !== "object" || Array.isArray(params.entry)) return;
	const entry = params.entry;
	const rawSessionFile = entry.sessionFile;
	if (typeof rawSessionFile !== "string") return;
	const legacySessionFile = path.isAbsolute(rawSessionFile) ? path.resolve(rawSessionFile) : path.resolve(params.legacyDir, rawSessionFile);
	const relative = path.relative(path.resolve(params.legacyDir), legacySessionFile);
	if (relative.startsWith("..") || path.isAbsolute(relative) || migrationFileExists(legacySessionFile)) return;
	if (safeReadDir(path.dirname(params.legacyDir)).some((dirent) => dirent.isDirectory() && dirent.name.startsWith(`${path.basename(params.legacyDir)}.legacy-`) && migrationFileExists(path.join(path.dirname(params.legacyDir), dirent.name, path.basename(legacySessionFile))))) return;
	const parsed = path.parse(path.basename(legacySessionFile));
	if (safeReadDir(params.targetDir).some((dirent) => dirent.isFile() && dirent.name.startsWith(`${parsed.name}.legacy-`) && dirent.name.endsWith(parsed.ext))) return;
	const targetSessionFile = path.join(params.targetDir, path.basename(legacySessionFile));
	if (!migrationFileExists(targetSessionFile) || typeof entry.sessionId !== "string") return;
	const readFirstLine = () => readFirstLineSync(targetSessionFile);
	try {
		const firstLine = readFirstLine();
		const header = firstLine ? JSON.parse(firstLine) : void 0;
		if (!header || typeof header !== "object" || Array.isArray(header)) return;
		if (header.type === "session") return header.id === entry.sessionId ? targetSessionFile : void 0;
		return (path.basename(entry.sessionId) === entry.sessionId ? `${entry.sessionId}.jsonl` : void 0) === path.basename(targetSessionFile) ? targetSessionFile : void 0;
	} catch {
		return;
	}
}
function sessionStoreMayNeedCanonicalization(params) {
	const storeAgentIds = new Set([...params.storeAgentIds].map((id) => normalizeAgentId(id)));
	const hasNonMainAgent = [...storeAgentIds].some((id) => id !== LEGACY_IMPLICIT_AGENT_ID);
	for (const key of Object.keys(params.store)) {
		const rawKey = key.trim();
		if (rawKey !== key) return true;
		if (!rawKey) continue;
		const lowerKey = normalizeLowercaseStringOrEmpty(rawKey);
		if (lowerKey !== rawKey) return true;
		if (lowerKey === "global" || lowerKey === "unknown") continue;
		if (params.preserveForeignMainAliases && isLegacyDefaultMainAliasKey(lowerKey, params.mainKey)) return true;
		if (lowerKey === "main" || lowerKey === params.mainKey) return true;
		if (lowerKey.startsWith("subagent:")) return true;
		if (lowerKey.startsWith("group:") || lowerKey.startsWith("channel:")) return true;
		if (!lowerKey.startsWith("agent:")) return true;
		const rowOwner = resolveCanonicalAgentSessionOwner(rawKey);
		if (!rowOwner) return true;
		const agentMainAlias = `agent:${rowOwner}:${DEFAULT_MAIN_KEY}`;
		const agentMainKey = `agent:${rowOwner}:${params.mainKey}`;
		if (lowerKey === agentMainAlias && (params.mainKey !== "main" || params.scope === "global")) return true;
		if (lowerKey === agentMainKey && params.scope === "global") return true;
		if (lowerKey === `agent:main:main` && (params.mainKey !== "main" || hasNonMainAgent || params.scope === "global")) return true;
		if (lowerKey === `agent:main:${params.mainKey}` && hasNonMainAgent && !storeAgentIds.has("main")) return true;
	}
	return false;
}
function listLegacySessionKeys(params) {
	const legacy = [];
	for (const key of Object.keys(params.store)) if (canonicalizeSessionKeyForAgent({
		key,
		agentId: params.agentId,
		mainKey: params.mainKey,
		scope: params.scope,
		skipCrossAgentRemap: params.preserveAmbiguousKeys,
		preserveCanonicalAgentOwner: params.preserveAmbiguousKeys,
		preserveAmbiguousKeys: params.preserveAmbiguousKeys,
		preserveForeignMainAliases: params.preserveForeignMainAliases,
		legacySessionSurfaces: params.legacySessionSurfaces
	}) !== key) legacy.push(key);
	return legacy;
}
function removeDirIfEmpty(dir) {
	if (!existsDir(dir) || safeReadDir(dir).length > 0) return;
	try {
		fs.rmdirSync(dir);
	} catch {}
}
async function migrateOrphanedSessionKeys(params) {
	const changes = [];
	const warnings = [];
	const recoverableWarnings = [];
	const env = params.env ?? process.env;
	let preparedLegacySessionSurfaces;
	const resolveLegacySessionSurfaces = () => preparedLegacySessionSurfaces ??= typeof params.legacySessionSurfaces === "function" ? params.legacySessionSurfaces() : params.legacySessionSurfaces;
	const stateDir = resolveStateDir(env);
	const mainKey = normalizeMainKey(params.cfg.session?.mainKey);
	const scope = params.cfg.session?.scope;
	const storeConfig = params.cfg.session?.store;
	const persistedStoreOwner = resolvePersistedSessionStoreOwner(params.cfg);
	const pendingPluginMigrations = readDeferredPluginMigrations({ env });
	const persistedStoreAgentId = persistedStoreOwner.kind === "configured" ? persistedStoreOwner.agentId : void 0;
	const persistedStorePath = persistedStoreAgentId && storeConfig ? resolveStorePathFromTemplate(storeConfig, persistedStoreAgentId, env) : void 0;
	const pluginAgentIds = params.additionalAgentIds ?? listPluginDoctorSessionStoreAgentIds({
		config: params.cfg,
		env,
		pluginIds: collectRelevantDoctorPluginIds(params.cfg)
	});
	const pluginAgentIdSet = new Set(pluginAgentIds.map((id) => normalizeAgentId(id)));
	const storeMap = /* @__PURE__ */ new Map();
	const storeAliasCandidates = /* @__PURE__ */ new Map();
	const addToStoreMap = (p, id) => {
		try {
			if (p.endsWith(".sqlite") || !fs.statSync(p, { throwIfNoEntry: false })?.isFile()) return;
		} catch {}
		const ownerId = persistedStoreAgentId && persistedStorePath && sessionStorePathsMatch(p, persistedStorePath) ? persistedStoreAgentId : id;
		const storePath = [...storeMap.keys()].find((candidate) => sessionStorePathsMatch(candidate, p)) ?? p;
		const aliasCandidates = storeAliasCandidates.get(storePath) ?? /* @__PURE__ */ new Set([storePath]);
		aliasCandidates.add(p);
		storeAliasCandidates.set(storePath, aliasCandidates);
		storeMap.set(storePath, (storeMap.get(storePath) ?? /* @__PURE__ */ new Set()).add(ownerId));
	};
	for (const configuredAgentId of listConfiguredSessionStoreAgentIds(params.cfg)) {
		const id = normalizeAgentId(configuredAgentId);
		addToStoreMap(storeConfig ? resolveStorePathFromTemplate(storeConfig, id, env) : path.join(stateDir, "agents", id, "sessions", "sessions.json"), id);
	}
	for (const pluginAgentId of pluginAgentIds) {
		const id = normalizeAgentId(pluginAgentId);
		addToStoreMap(storeConfig ? resolveStorePathFromTemplate(storeConfig, id, env) : path.join(stateDir, "agents", id, "sessions", "sessions.json"), id);
	}
	const agentsDir = path.join(stateDir, "agents");
	if (existsDir(agentsDir)) {
		for (const dirEntry of safeReadDir(agentsDir)) if (dirEntry.isDirectory()) {
			const diskAgentId = normalizeAgentId(dirEntry.name);
			if (diskAgentId) addToStoreMap(path.join(agentsDir, diskAgentId, "sessions", "sessions.json"), diskAgentId);
		}
	}
	for (const [mappedStorePath, storeAgentIds] of storeMap) {
		if ([...storeAgentIds].some((agentId) => preserveDeferredPluginSessionSource({
			cfg: params.cfg,
			env,
			target: {
				agentId,
				storePath: mappedStorePath
			},
			pending: pendingPluginMigrations
		}))) continue;
		const storePaths = storeAliasCandidates.get(mappedStorePath) ?? /* @__PURE__ */ new Set([mappedStorePath]);
		const storePath = [...storePaths].find((candidate) => migrationFileExists(candidate));
		if (!storePath) continue;
		const pluginForeignMainAliasRisk = [...storeAgentIds].some((id) => pluginAgentIdSet.has(id) && id !== "main");
		let parsed;
		try {
			parsed = parseSessionStoreJson5(fs.readFileSync(storePath, "utf-8"));
		} catch (err) {
			warnings.push(`Could not read ${storePath}: ${String(err)}`);
			continue;
		}
		if (!parsed.ok || !sessionStoreMayNeedCanonicalization({
			store: parsed.store,
			storeAgentIds,
			mainKey,
			scope,
			preserveForeignMainAliases: pluginForeignMainAliasRisk
		})) continue;
		const legacySessionSurfaces = resolveLegacySessionSurfaces();
		if (legacySessionSurfaces.failures.length > 0) return {
			changes,
			warnings: [
				...warnings,
				...recoverableWarnings,
				...legacySessionSurfaces.failures
			]
		};
		let working = parsed.store;
		let totalLegacy = 0;
		const storeAliases = resolveSessionStoreAliasPlan(storePath, storePaths);
		const hasDistinctAliases = storeAliases.hasDistinctAliases;
		const preserveAmbiguousKeys = storeAgentIds.size > 1;
		const preservedAmbiguousKeyCount = Object.keys(working).filter((key) => preserveAmbiguousKeys && isAmbiguousSharedStoreKey(key, mainKey, scope) || pluginForeignMainAliasRisk && isLegacyDefaultMainAliasKey(key, mainKey)).length;
		if (storeAliases.hasUnresolvedIdentity) {
			warnings.push(unresolvedSessionStoreIdentityWarning("session key migration", storePath));
			continue;
		}
		if (hasDistinctAliases && preservedAmbiguousKeyCount > 0) {
			warnings.push(aliasedSessionStoreMigrationWarning({
				subject: "migration of",
				count: preservedAmbiguousKeyCount,
				storePath
			}));
			continue;
		}
		if (storeAliases.hasFinalSymlink) {
			warnings.push(`Deferred session key migration in final-component symlink store ${storePath}; configure one canonical session.store path, then rerun openclaw doctor --fix`);
			continue;
		}
		if (hasDistinctAliases) {
			warnings.push(distinctSessionStoreAliasWarning("session key migration", storePath));
			continue;
		}
		for (const storeAgentId of storeAgentIds) {
			const { store: canonicalized, legacyKeys } = canonicalizeSessionStore({
				store: working,
				agentId: storeAgentId,
				mainKey,
				scope,
				skipCrossAgentRemap: preserveAmbiguousKeys,
				preserveCanonicalAgentOwner: true,
				preserveAmbiguousKeys,
				preserveForeignMainAliases: pluginForeignMainAliasRisk,
				legacySessionSurfaces: legacySessionSurfaces.surfaces
			});
			working = canonicalized;
			totalLegacy += legacyKeys.length;
		}
		if (preservedAmbiguousKeyCount > 0) recoverableWarnings.push(`Preserved ${preservedAmbiguousKeyCount} ambiguous session key(s) in potentially shared store ${storePath}`);
		if (totalLegacy === 0) continue;
		const normalized = Object.create(null);
		for (const [key, entry] of Object.entries(working)) {
			const ne = normalizeSessionEntry(entry, key);
			if (ne) normalized[key] = ne;
		}
		try {
			await saveSessionStoreStrict(storePath, normalized);
			changes.push(`Canonicalized ${totalLegacy} orphaned session key(s) in ${storePath}`);
		} catch (err) {
			warnings.push(`Failed to write canonicalized store ${storePath}: ${String(err)}`);
		}
	}
	return {
		changes,
		warnings: [...warnings, ...recoverableWarnings],
		...warnings.length === 0 && recoverableWarnings.length > 0 ? { warningDisposition: "recoverable" } : {}
	};
}
async function migrateLegacyAcpSessionMetadata(params) {
	const changes = [];
	const warnings = [];
	const env = params.env ?? process.env;
	if (params.legacySessionSurfaces.failures.length > 0) return {
		changes,
		warnings: [...params.legacySessionSurfaces.failures]
	};
	const now = params.now ?? (() => Date.now());
	const pending = readDeferredPluginMigrations({ env });
	const stateDir = resolveStateDir(env);
	const storeConfig = params.cfg.session?.store;
	const pluginAgentIds = params.pluginSessionStoreAgentIds ?? listPluginDoctorSessionStoreAgentIds({
		config: params.cfg,
		env,
		pluginIds: collectRelevantDoctorPluginIds(params.cfg)
	});
	const normalizedPluginAgentIds = new Set(pluginAgentIds.map((id) => normalizeAgentId(id)));
	const declaredAgentIds = /* @__PURE__ */ new Set([...listConfiguredSessionStoreAgentIds(params.cfg).map((id) => normalizeAgentId(id)), ...normalizedPluginAgentIds]);
	const declaredTargets = [...declaredAgentIds].map((agentId) => ({
		agentId,
		storePath: storeConfig ? resolveStorePathFromTemplate(storeConfig, agentId, env) : path.join(stateDir, "agents", agentId, "sessions", "sessions.json")
	}));
	const pluginTargets = declaredTargets.filter(({ agentId }) => agentId !== "main" && normalizedPluginAgentIds.has(agentId));
	const configuredAgents = listAgentEntries(params.cfg);
	const configuredAgentIds = new Set(configuredAgents.flatMap((entry) => entry?.id ? [normalizeAgentId(entry.id)] : []));
	const targets = resolveLegacyAcpMetadataSessionStoreTargets([...declaredAgentIds].some((agentId) => !configuredAgentIds.has(agentId)) ? {
		...params.cfg,
		agents: {
			...params.cfg.agents,
			list: [...configuredAgents, ...[...declaredAgentIds].filter((agentId) => !configuredAgentIds.has(agentId)).map((id) => ({ id }))]
		}
	} : params.cfg, env);
	const mainKey = normalizeMainKey(params.cfg.session?.mainKey);
	const scope = params.cfg.session?.scope;
	const storeGroups = [];
	for (const target of targets) {
		if (!migrationFileExists(target.storePath)) continue;
		const group = storeGroups.find(({ target: existing }) => sessionStorePathsMatch(existing.storePath, target.storePath));
		const matchingDeclaredTargets = declaredTargets.filter((declaredTarget) => sessionStorePathsMatch(target.storePath, declaredTarget.storePath));
		if (group) {
			group.agentIds.add(normalizeAgentId(target.agentId));
			group.aliasCandidates.add(target.storePath);
			for (const declaredTarget of matchingDeclaredTargets) {
				group.agentIds.add(declaredTarget.agentId);
				group.aliasCandidates.add(declaredTarget.storePath);
			}
			continue;
		}
		storeGroups.push({
			target,
			agentIds: /* @__PURE__ */ new Set([normalizeAgentId(target.agentId), ...matchingDeclaredTargets.map((declaredTarget) => declaredTarget.agentId)]),
			aliasCandidates: /* @__PURE__ */ new Set([target.storePath, ...matchingDeclaredTargets.map((declaredTarget) => declaredTarget.storePath)])
		});
	}
	for (const { target, agentIds, aliasCandidates } of storeGroups) {
		const storePath = target.storePath;
		if (deferredPluginSessionStoreIds({
			target,
			pending
		}).some(isPluginDoctorMigrationDeferred)) continue;
		const preserveSource = preserveDeferredPluginSessionSource({
			cfg: params.cfg,
			env,
			target,
			pending
		});
		const storeAliases = resolveSessionStoreAliasPlan(storePath, aliasCandidates);
		const pluginForeignMainAliasRisk = pluginTargets.some((pluginTarget) => sessionStorePathsMatch(storePath, pluginTarget.storePath));
		let parsed;
		try {
			parsed = readSessionStoreJson5(storePath);
		} catch (err) {
			warnings.push(`Could not read ${storePath}: ${String(err)}`);
			continue;
		}
		if (!parsed.ok) continue;
		const ambiguousKeyCount = Object.keys(parsed.store).filter((key) => isAmbiguousSharedStoreKey(key, mainKey, scope) || pluginForeignMainAliasRisk && isLegacyDefaultMainAliasKey(key, mainKey)).length;
		const hasLegacyAcpMetadata = Object.entries(parsed.store).some(([sessionKey, entry]) => normalizeSessionEntry(entry, sessionKey)?.acp !== void 0);
		if (hasLegacyAcpMetadata && storeAliases.hasUnresolvedIdentity) {
			warnings.push(unresolvedSessionStoreIdentityWarning("ACP metadata migration", storePath));
			continue;
		}
		if (hasLegacyAcpMetadata && storeAliases.hasFinalSymlink) {
			warnings.push(`Deferred ACP metadata migration in final-component symlink store ${storePath}; configure one canonical session.store path, then rerun openclaw doctor --fix`);
			continue;
		}
		if (hasLegacyAcpMetadata && storeAliases.hasDistinctAliases) {
			warnings.push(ambiguousKeyCount > 0 ? aliasedSessionStoreMigrationWarning({
				subject: "ACP metadata migration for",
				count: ambiguousKeyCount,
				storePath
			}) : distinctSessionStoreAliasWarning("ACP metadata migration", storePath));
			continue;
		}
		const readVerifiedCoreImport = prepareDeferredPluginSessionImportReader({
			cfg: params.cfg,
			target,
			env
		});
		const normalized = Object.create(null);
		let migrated = 0;
		let consumed = 0;
		let preserved = 0;
		for (const [sessionKey, entry] of Object.entries(parsed.store)) {
			const normalizedEntry = normalizeSessionEntry(entry, sessionKey);
			if (!normalizedEntry) continue;
			if (normalizedEntry.acp) {
				const ambiguousSharedStoreKey = isAmbiguousSharedStoreKey(sessionKey, mainKey, scope);
				const ambiguousMultiOwnerKey = agentIds.size > 1 && ambiguousSharedStoreKey;
				const foreignMainAlias = pluginForeignMainAliasRisk && isLegacyDefaultMainAliasKey(sessionKey, mainKey);
				if (ambiguousMultiOwnerKey || foreignMainAlias) {
					preserved++;
					normalized[sessionKey] = normalizedEntry;
					continue;
				}
				const rowAgentId = resolveCanonicalAgentSessionOwner(sessionKey) ?? target.agentId;
				const canonicalSessionKey = canonicalizeSessionKeyForAgent({
					key: sessionKey,
					agentId: rowAgentId,
					mainKey,
					scope,
					skipCrossAgentRemap: true,
					legacySessionSurfaces: params.legacySessionSurfaces.surfaces
				});
				const imported = importLegacyAcpSessionMetadata({
					sourcePath: storePath,
					sourceSessionKey: sessionKey,
					preserveSource,
					cfg: params.cfg,
					agentId: rowAgentId,
					readVerifiedCoreImport,
					sessionKey: canonicalSessionKey,
					sessionId: normalizedEntry.sessionId,
					lifecycleRevision: normalizedEntry.lifecycleRevision,
					meta: normalizedEntry.acp,
					env,
					now
				});
				delete normalizedEntry.acp;
				consumed++;
				if (imported) migrated++;
			}
			normalized[sessionKey] = normalizedEntry;
		}
		if (preserved > 0) warnings.push(`Preserved ACP metadata for ${preserved} ambiguous session key(s) in potentially shared store ${storePath}`);
		if (consumed === 0 || preserveSource && migrated === 0) continue;
		try {
			if (!preserveSource) await saveSessionStoreStrict(storePath, normalized);
			changes.push(migrated > 0 ? `Migrated ${migrated} ACP session metadata ${migrated === 1 ? "row" : "rows"} → shared SQLite state` : `Removed previously imported ACP metadata from ${storePath}`);
		} catch (err) {
			warnings.push(`Failed to write ACP metadata migration source ${storePath}: ${String(err)}`);
		}
	}
	return {
		changes,
		warnings
	};
}
function resolveLegacyAcpMetadataSessionStoreTargets(cfg, env) {
	const stateDir = resolveStateDir(env);
	const agentsDirs = /* @__PURE__ */ new Set([path.join(stateDir, "agents")]);
	const targets = /* @__PURE__ */ new Map();
	const addTarget = (agentId, storePath) => {
		if (storePath.endsWith(".sqlite") || !isManagedLegacySessionStorePathSafe(storePath)) return;
		const agentsDir = resolveAgentsDirFromSessionStorePath(storePath);
		if (agentsDir) agentsDirs.add(agentsDir);
		if (!targets.has(storePath)) targets.set(storePath, {
			agentId,
			storePath
		});
	};
	for (const target of resolveAllAgentSessionStoreTargetsSync(cfg, { env })) addTarget(target.agentId, target.storePath);
	for (const target of resolveSessionStoreTargets(cfg, { allAgents: true }, { env })) addTarget(target.agentId, target.storePath);
	for (const agentsDir of agentsDirs) {
		if (!existsDir(agentsDir)) continue;
		for (const entry of safeReadDir(agentsDir)) {
			if (!entry.isDirectory()) continue;
			const agentId = normalizeAgentId(entry.name);
			const normalizedDirName = normalizeLowercaseStringOrEmpty(entry.name);
			if (agentId === "main" && normalizedDirName !== agentId) continue;
			addTarget(agentId, path.join(agentsDir, entry.name, "sessions", "sessions.json"));
		}
	}
	return [...targets.values()];
}
function isManagedLegacySessionStorePathSafe(storePath) {
	const resolvedStorePath = path.resolve(storePath);
	const agentsDir = resolveAgentsDirFromSessionStorePath(resolvedStorePath);
	if (!agentsDir) return true;
	if (!migrationFileExists(resolvedStorePath)) return true;
	try {
		const stat = fs.lstatSync(resolvedStorePath);
		if (stat.isSymbolicLink() || !stat.isFile()) return false;
		const resolvedAgentsDir = path.resolve(agentsDir);
		const realStorePath = fs.realpathSync.native(resolvedStorePath);
		const realAgentsDir = fs.realpathSync.native(resolvedAgentsDir);
		return isWithinDir(realAgentsDir, realStorePath);
	} catch {
		return false;
	}
}
function resolveStorePathFromTemplate(template, agentId, env) {
	const expand = (s) => s.startsWith("~") ? expandHomePrefix(s, {
		env: env ?? process.env,
		homedir: os.homedir
	}) : s;
	if (template.includes("{agentId}")) return path.resolve(expand(template.replaceAll("{agentId}", agentId)));
	return path.resolve(expand(template));
}
function mergeSessionStoreAliasPlans(left, right) {
	if (!left) return right;
	return {
		hasDistinctAliases: left.hasDistinctAliases || right.hasDistinctAliases,
		hasFinalSymlink: left.hasFinalSymlink || right.hasFinalSymlink,
		hasUnresolvedIdentity: left.hasUnresolvedIdentity || right.hasUnresolvedIdentity
	};
}
async function saveSessionStoreStrict(storePath, store) {
	await saveLegacySessionStore(storePath, store, {
		requireWriteSuccess: true,
		skipMaintenance: true
	});
}
function resolveSessionStoreOwnership(params) {
	const targetStorePath = path.join(params.stateDir, "agents", params.targetAgentId, "sessions", "sessions.json");
	const configuredStore = params.cfg.session?.store;
	const resolveAgentStorePath = (agentId) => configuredStore ? resolveStorePathFromTemplate(configuredStore, agentId, params.env) : path.join(params.stateDir, "agents", agentId, "sessions", "sessions.json");
	const preserveForeignMainAliases = params.pluginSessionStoreAgentIds.some((pluginAgentId) => {
		const id = normalizeAgentId(pluginAgentId);
		if (id === "main") return false;
		return sessionStorePathsMatch(resolveAgentStorePath(id), targetStorePath);
	});
	const configuredOwnerStorePaths = [.../* @__PURE__ */ new Set([...listConfiguredSessionStoreAgentIds(params.cfg).map((id) => normalizeAgentId(id)), ...params.pluginSessionStoreAgentIds.map((id) => normalizeAgentId(id))])].map(resolveAgentStorePath);
	const preserveAmbiguousKeys = configuredOwnerStorePaths.filter((storePath) => sessionStorePathsMatch(storePath, targetStorePath)).length > 1;
	const candidateStorePaths = [...configuredOwnerStorePaths];
	const agentsDir = path.join(params.stateDir, "agents");
	for (const entry of safeReadDir(agentsDir)) if (entry.isDirectory()) candidateStorePaths.push(path.join(agentsDir, entry.name, "sessions", "sessions.json"));
	return {
		preserveAmbiguousKeys,
		preserveForeignMainAliases,
		targetStoreAliases: resolveSessionStoreAliasPlan(targetStorePath, candidateStorePaths)
	};
}
//#endregion
//#region src/infra/state-migrations.legacy-sessions.ts
const LEGACY_AGENT_DATABASE_BASENAME = "openclaw-agent.sqlite";
function legacyAgentInspectionFailure(subject, error) {
	return {
		status: "failed",
		warning: `Failed inspecting ${subject}: ${String(error)}`
	};
}
function inspectLegacyAgentDir(legacyDir) {
	let entries;
	try {
		entries = fs.readdirSync(legacyDir, { withFileTypes: true });
	} catch (error) {
		if (isErrno(error) && error.code === "ENOENT") return { status: "empty" };
		return legacyAgentInspectionFailure(`legacy agent directory ${legacyDir}`, error);
	}
	if (entries.length === 0) return { status: "empty" };
	const databasePath = path.join(legacyDir, LEGACY_AGENT_DATABASE_BASENAME);
	const databaseFiles = new Set(resolveSqliteDatabaseFilePaths(databasePath).map((pathname) => path.basename(pathname)));
	const hasFilePayload = entries.some((entry) => !databaseFiles.has(entry.name));
	if (!entries.some((entry) => databaseFiles.has(entry.name))) return { status: hasFilePayload ? "payload" : "empty" };
	if (!migrationFileExists(databasePath)) return legacyAgentInspectionFailure(`legacy agent database ${databasePath}`, "main database is missing or not a regular file");
	let database;
	try {
		const opened = openNodeSqliteDatabase(databasePath, { readOnly: true });
		database = opened;
		const schemaOwner = readExistingAgentSchemaMeta(opened);
		if (!schemaOwner || schemaOwner.role !== "agent") return legacyAgentInspectionFailure(`legacy agent database ${databasePath}`, "agent schema ownership metadata is missing");
		if (!schemaOwner.agentId) return legacyAgentInspectionFailure(`legacy agent database ${databasePath}`, "agent schema owner is missing or blank");
		return { status: opened.prepare(`SELECT name FROM pragma_table_list
         WHERE schema = 'main' AND type IN ('table', 'virtual')
           AND substr(name, 1, 7) <> 'sqlite_'
           AND name NOT IN ('schema_meta', 'session_key_contract', 'memory_index_state')`).all().flatMap((row) => row && typeof row === "object" && "name" in row && typeof row.name === "string" ? [row.name] : []).some((name) => opened.prepare(`SELECT 1 FROM ${quoteSqliteIdentifier(name)} LIMIT 1`).get()) || hasFilePayload ? "payload" : "empty" };
	} catch (error) {
		return legacyAgentInspectionFailure(`legacy agent database ${databasePath}`, error);
	} finally {
		database?.close();
	}
}
function normalizeMergedSessionStore(merged, protectedKeys) {
	const store = Object.create(null);
	let rejectedProtectedKeyCount = 0;
	for (const [key, entry] of Object.entries(merged)) {
		const normalizedEntry = normalizeSessionEntry(entry, key);
		if (!normalizedEntry) {
			if (protectedKeys.has(key)) rejectedProtectedKeyCount++;
			continue;
		}
		store[key] = normalizedEntry;
	}
	return {
		store,
		rejectedProtectedKeyCount
	};
}
async function migrateLegacySessions(detected, now, options) {
	const changes = [];
	const warnings = [];
	const recoverableWarnings = [];
	if (!detected.sessions.hasLegacy) return {
		changes,
		warnings
	};
	if (options.legacySessionSurfaces.failures.length > 0) return {
		changes,
		warnings: [...options.legacySessionSurfaces.failures]
	};
	if (readDeferredPluginMigrations({ env: {
		...process.env,
		OPENCLAW_STATE_DIR: detected.stateDir
	} }).length > 0) return {
		changes,
		warnings,
		notices: ["Preserved legacy session sources until pending plugin migrations complete; Doctor still imports and verifies canonical sessions."]
	};
	ensureMigrationDir(detected.sessions.targetDir);
	const legacyParsed = migrationFileExists(detected.sessions.legacyStorePath) ? readSessionStoreJson5(detected.sessions.legacyStorePath) : {
		store: {},
		ok: true
	};
	const targetParsed = migrationFileExists(detected.sessions.targetStorePath) ? readSessionStoreJson5(detected.sessions.targetStorePath) : {
		store: {},
		ok: true
	};
	const legacyStore = legacyParsed.store;
	const targetStore = targetParsed.store;
	if (detected.sessions.targetStoreAliases.hasUnresolvedIdentity) {
		warnings.push(unresolvedSessionStoreIdentityWarning("legacy session migration", detected.sessions.targetStorePath));
		return {
			changes,
			warnings
		};
	}
	if (detected.sessions.targetStoreAliases.hasFinalSymlink) {
		warnings.push(`Deferred legacy session migration in final-component symlink store ${detected.sessions.targetStorePath}; configure one canonical session.store path, then rerun openclaw doctor --fix`);
		return {
			changes,
			warnings
		};
	}
	const ambiguousAliasedKeys = new Set([...Object.keys(targetStore), ...Object.keys(legacyStore)].filter((key) => isAmbiguousSharedStoreKey(key, detected.targetMainKey, detected.targetScope) || detected.sessions.preserveForeignMainAliases && isLegacyDefaultMainAliasKey(key, detected.targetMainKey)));
	if (detected.sessions.targetStoreAliases.hasDistinctAliases) {
		warnings.push(ambiguousAliasedKeys.size > 0 ? aliasedSessionStoreMigrationWarning({
			subject: "migration of",
			count: ambiguousAliasedKeys.size,
			storePath: detected.sessions.targetStorePath
		}) : distinctSessionStoreAliasWarning("legacy session migration", detected.sessions.targetStorePath));
		return {
			changes,
			warnings
		};
	}
	const canonicalizedTarget = canonicalizeSessionStore({
		store: targetStore,
		agentId: detected.targetAgentId,
		mainKey: detected.targetMainKey,
		scope: detected.targetScope,
		skipCrossAgentRemap: detected.sessions.preserveAmbiguousKeys,
		preserveCanonicalAgentOwner: true,
		preserveAmbiguousKeys: detected.sessions.preserveAmbiguousKeys,
		preserveForeignMainAliases: detected.sessions.preserveForeignMainAliases,
		legacySessionSurfaces: options.legacySessionSurfaces.surfaces
	});
	const canonicalizedLegacy = canonicalizeSessionStore({
		store: legacyStore,
		agentId: detected.targetAgentId,
		mainKey: detected.targetMainKey,
		scope: detected.targetScope,
		preserveCanonicalAgentOwner: true,
		preserveForeignMainAliases: detected.sessions.preserveForeignMainAliases,
		legacySessionSurfaces: options.legacySessionSurfaces.surfaces
	});
	const targetKeys = new Set(Object.keys(canonicalizedTarget.store));
	const preservedLegacyForeignMainAliasCount = detected.sessions.preserveForeignMainAliases ? Object.keys(legacyStore).filter((key) => isLegacyDefaultMainAliasKey(key, detected.targetMainKey)).length : 0;
	let repairedStaleSessionFiles = false;
	for (const entry of Object.values(canonicalizedTarget.store)) {
		const targetSessionFile = resolveStaleLegacySessionFile({
			entry,
			legacyDir: detected.sessions.legacyDir,
			targetDir: detected.sessions.targetDir
		});
		if (targetSessionFile) {
			entry.sessionFile = targetSessionFile;
			repairedStaleSessionFiles = true;
		}
	}
	const merged = Object.create(null);
	for (const [key, entry] of Object.entries(canonicalizedTarget.store)) merged[key] = entry;
	for (const [key, entry] of Object.entries(canonicalizedLegacy.store)) merged[key] = selectNewerSessionEntry({
		existing: merged[key],
		incoming: entry,
		preferIncomingOnTie: false
	});
	const mainKey = buildAgentMainSessionKey({
		agentId: detected.targetAgentId,
		mainKey: detected.targetMainKey
	});
	let migratedDirectChatKey;
	if (!merged[mainKey]) {
		const latest = pickLatestLegacyDirectEntry(legacyStore, options.legacySessionSurfaces.surfaces);
		if (latest?.sessionId) {
			merged[mainKey] = latest;
			migratedDirectChatKey = mainKey;
		}
	}
	if (!legacyParsed.ok) warnings.push(`Legacy sessions store unreadable; left in place at ${detected.sessions.legacyStorePath}`);
	let targetReadable = !migrationFileExists(detected.sessions.targetStorePath) || targetParsed.ok;
	if (!targetReadable) {
		if (options.recoverCorruptTargetStore) {
			const archivedTargetPath = `${detected.sessions.targetStorePath}.corrupt-${now()}`;
			try {
				fs.renameSync(detected.sessions.targetStorePath, archivedTargetPath);
				changes.push(`Archived corrupt target sessions store → ${archivedTargetPath}`);
				targetReadable = true;
			} catch (err) {
				warnings.push(`Target sessions store unreadable; failed to archive ${detected.sessions.targetStorePath}: ${String(err)}`);
			}
		} else warnings.push(`Target sessions store unreadable; left untouched to avoid overwriting at ${detected.sessions.targetStorePath}. Run openclaw doctor --fix to archive it and retry the legacy merge.`);
	}
	if (targetReadable && (legacyParsed.ok || targetParsed.ok) && (Object.keys(legacyStore).length > 0 || Object.keys(targetStore).length > 0)) {
		const normalized = normalizeMergedSessionStore(merged, targetKeys);
		if (normalized.rejectedProtectedKeyCount > 0) {
			warnings.push(`Refused legacy session migration because normalization rejected ${normalized.rejectedProtectedKeyCount} existing target session ${normalized.rejectedProtectedKeyCount === 1 ? "key" : "keys"}; left ${detected.sessions.targetStorePath} and ${detected.sessions.legacyStorePath} in place. Repair the conflicting rows, then rerun openclaw doctor --fix.`);
			return {
				changes,
				warnings
			};
		}
		await saveSessionStoreStrict(detected.sessions.targetStorePath, normalized.store);
		if (migratedDirectChatKey) changes.push(`Migrated latest direct-chat session → ${migratedDirectChatKey}`);
		changes.push(`Merged sessions store → ${detected.sessions.targetStorePath}`);
		if (preservedLegacyForeignMainAliasCount > 0) recoverableWarnings.push(`Preserved ${preservedLegacyForeignMainAliasCount} ambiguous session key(s) while importing legacy sessions into ${detected.sessions.targetStorePath}`);
		if (canonicalizedTarget.legacyKeys.length > 0) changes.push(`Canonicalized ${canonicalizedTarget.legacyKeys.length} legacy session key(s)`);
		if (repairedStaleSessionFiles) changes.push("Repaired migrated session transcript paths");
	}
	if (!targetReadable) return {
		changes,
		warnings
	};
	const entries = safeReadDir(detected.sessions.legacyDir);
	for (const entry of entries) {
		if (!entry.isFile()) continue;
		if (entry.name === "sessions.json") continue;
		const from = path.join(detected.sessions.legacyDir, entry.name);
		let to = path.join(detected.sessions.targetDir, entry.name);
		if (migrationFileExists(to)) {
			const parsed = path.parse(entry.name);
			to = path.join(detected.sessions.targetDir, `${parsed.name}.legacy-${now()}${parsed.ext}`);
		}
		try {
			fs.renameSync(from, to);
			changes.push(`Moved ${entry.name} → agents/${detected.targetAgentId}/sessions`);
		} catch (err) {
			warnings.push(`Failed moving ${from}: ${String(err)}`);
		}
	}
	if (legacyParsed.ok && targetReadable) try {
		if (migrationFileExists(detected.sessions.legacyStorePath)) fs.rmSync(detected.sessions.legacyStorePath, { force: true });
	} catch {}
	removeDirIfEmpty(detected.sessions.legacyDir);
	if (safeReadDir(detected.sessions.legacyDir).filter((e) => e.isFile()).length > 0) {
		const backupDir = `${detected.sessions.legacyDir}.legacy-${now()}`;
		try {
			fs.renameSync(detected.sessions.legacyDir, backupDir);
			warnings.push(`Left legacy sessions at ${backupDir}`);
		} catch {}
	}
	return {
		changes,
		warnings: [...warnings, ...recoverableWarnings],
		...warnings.length === 0 && recoverableWarnings.length > 0 && changes.length > 0 ? { warningDisposition: "recoverable" } : {}
	};
}
function planLegacyAgentDir(sourceRoot, targetRoot) {
	const families = [];
	function plan(relative, blocked) {
		const source = path.join(sourceRoot, relative);
		const target = path.join(targetRoot, relative);
		const entries = fs.readdirSync(source, { withFileTypes: true });
		const targetStat = blocked ? void 0 : fs.lstatSync(target, { throwIfNoEntry: false });
		const targetBlocked = blocked || Boolean(targetStat && !targetStat.isDirectory());
		const names = new Map(entries.map((entry) => [entry.name, entry]));
		const targetEntries = targetStat?.isDirectory() ? fs.readdirSync(target, { withFileTypes: true }) : [];
		const bases = new Set([...entries, ...targetEntries].flatMap((entry) => {
			if (entry.isDirectory()) return [];
			const name = entry.name;
			const suffix = SQLITE_SIDECAR_SUFFIXES.find((candidate) => name.endsWith(candidate));
			return suffix ? [name.slice(0, -suffix.length)] : /\.(?:sqlite3?|db)$/i.test(name) ? [name] : [];
		}));
		const reserved = /* @__PURE__ */ new Set();
		const result = [];
		for (const base of bases) {
			const members = resolveSqliteDatabaseFilePaths(base).filter((name) => names.has(name));
			if (members.length === 0) continue;
			const family = {
				kind: "sqlite",
				relative: path.join(relative, base),
				files: members.map((name) => path.join(relative, name))
			};
			members.forEach((name) => reserved.add(name));
			families.push(family);
			result.push(family);
		}
		for (const entry of entries) {
			if (reserved.has(entry.name)) continue;
			const child = path.join(relative, entry.name);
			if (entry.isDirectory()) {
				const before = families.length;
				const children = plan(child, targetBlocked);
				result.push({
					kind: "directory",
					relative: child,
					entries: children,
					families: families.slice(before)
				});
			} else result.push({
				kind: "file",
				relative: child
			});
		}
		return result;
	}
	return {
		entries: plan("", false),
		families
	};
}
async function migrateLegacyAgentDir(detected, now) {
	const changes = [];
	const warnings = [];
	const deferred = [];
	const sqliteFamilies = [];
	const { targetDir, sources } = detected.agentDir;
	if (!detected.agentDir.hasLegacy || !targetDir) return {
		changes,
		warnings
	};
	const destination = path.relative(detected.stateDir, targetDir).replaceAll(path.sep, "/");
	for (const { legacyDir, standalone, boundaryRoot } of sources) {
		const conflicts = [];
		const duplicates = [];
		const directories = [];
		const movedFiles = [];
		let plan;
		let sourceRoot = legacyDir;
		let targetRoot = targetDir;
		let retainedRoot = legacyDir;
		let quarantined = false;
		let preserveSource = false;
		function merge(entry) {
			const relative = entry.relative;
			const from = path.join(sourceRoot, relative);
			const to = path.join(targetRoot, relative);
			if (entry.kind === "sqlite") return;
			if (relative === ".legacy-agent-dir-migration.json") {
				conflicts.push(relative);
				return;
			}
			const source = fs.lstatSync(from);
			const target = fs.lstatSync(to, { throwIfNoEntry: false });
			if (!target && (entry.kind !== "directory" || entry.families.length === 0)) {
				if (preserveSource) {
					if (source.isFile()) fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
					else fs.cpSync(from, to, {
						recursive: true,
						force: false,
						errorOnExist: true,
						verbatimSymlinks: true
					});
				} else {
					fs.renameSync(from, to);
					movedFiles.push({
						sourcePath: from,
						destinationPath: to
					});
				}
				changes.push(`${preserveSource ? "Copied" : "Moved"} agent file ${relative} → ${destination}`);
			} else if (entry.kind === "directory" && (!target || target.isDirectory())) {
				if (!target) {
					fs.mkdirSync(to, { mode: source.mode & 4095 });
					fs.chmodSync(to, source.mode & 4095);
				}
				for (const child of entry.entries) merge(child);
				directories.push(relative);
			} else if (source.isFile() && target?.isFile() && source.size === target.size && fs.readFileSync(from).equals(fs.readFileSync(to))) duplicates.push(relative);
			else if (entry.kind === "directory" && entry.families.length > 0) warnings.push(`Kept legacy directory ${from}: destination ${to} is not a directory; its SQLite families remain in place.`);
			else conflicts.push(relative);
		}
		try {
			sourceRoot = fs.realpathSync(legacyDir);
			retainedRoot = sourceRoot;
			if (!fs.lstatSync(legacyDir).isDirectory() || !isPathInside(boundaryRoot, sourceRoot)) return {
				changes,
				...sqliteFamilies.length > 0 ? { sqliteFamilies } : {},
				...deferred.length > 0 ? { deferred } : {},
				warnings: [...warnings, `Refused legacy agent migration from ${legacyDir}: source escaped its declared directory boundary.`]
			};
			const owner = migrationFileExists(path.join(legacyDir, LEGACY_AGENT_DATABASE_BASENAME)) ? resolveInstallAgentDir({}, { agentDir: legacyDir }).directory.owner : void 0;
			const ownerMismatch = owner !== void 0 && owner !== detected.targetAgentId;
			if (ownerMismatch) {
				deferred.push({
					reason: "owner-mismatch",
					recordedOwner: owner,
					configuredOwner: detected.targetAgentId,
					path: legacyDir
				});
				warnings.push(`Deferred legacy agent migration at ${legacyDir}: recorded owner ${owner} differs from configured owner ${detected.targetAgentId}. Keep using the existing store; ownership transfer requires a later release.`);
			}
			plan = planLegacyAgentDir(sourceRoot, targetDir);
			preserveSource = plan.families.length > 0;
			for (const family of plan.families) {
				const database = path.join(sourceRoot, family.relative);
				const files = family.files.map((file) => path.join(sourceRoot, file));
				const target = path.join(targetDir, family.relative);
				sqliteFamilies.push({
					database,
					files,
					destination: target,
					outcome: "deferred",
					reason: "sqlite-family"
				});
				warnings.push(`Deferred SQLite family ${database} (${files.join(", ")}) → ${target}: the store keeps being used from its current location; a later release moves it.`);
			}
			if (ownerMismatch) continue;
			const stateRoot = fs.realpathSync(detected.stateDir);
			ensureMigrationDir(targetDir);
			targetRoot = fs.realpathSync(targetDir);
			if (!fs.lstatSync(targetDir).isDirectory() || isPathInside(sourceRoot, targetRoot) || isPathInside(targetRoot, sourceRoot) || sourceRoot === targetRoot) return {
				changes,
				...sqliteFamilies.length > 0 ? { sqliteFamilies } : {},
				...deferred.length > 0 ? { deferred } : {},
				warnings: [...warnings, `Refused legacy agent migration from ${legacyDir} to ${targetDir}: overlapping directories or root symlinks could move canonical data.`]
			};
			for (const entry of plan.entries) merge(entry);
			if (preserveSource) continue;
			const backupDir = path.join(stateRoot, `agent.legacy-${now()}-${randomUUID()}`);
			const quarantineParent = fs.realpathSync(path.dirname(backupDir));
			if (quarantineParent !== stateRoot && !isPathInside(stateRoot, quarantineParent)) throw new Error(`Quarantine parent escaped the state directory: ${quarantineParent}`);
			fs.renameSync(sourceRoot, backupDir);
			retainedRoot = backupDir;
			quarantined = true;
			for (const relative of duplicates) fs.unlinkSync(path.join(backupDir, relative));
			for (const relative of directories) removeDirIfEmpty(path.join(backupDir, relative));
			if (conflicts.length > 0) {
				changes.push(`Quarantined ${conflicts.length} conflicting agent path(s) → ${backupDir}`);
				for (const relative of conflicts) warnings.push(`Kept ${path.join(targetDir, relative)}; quarantined legacy copy at ${path.join(backupDir, relative)}`);
			} else fs.rmdirSync(backupDir);
			if (standalone) recordCompletedLegacyAgentDirMigration(sourceRoot, targetRoot);
		} catch (error) {
			if (!quarantined) for (const move of movedFiles.toReversed()) try {
				if (fs.lstatSync(move.sourcePath, { throwIfNoEntry: false })) throw new Error(`Source was recreated: ${move.sourcePath}`, { cause: error });
				fs.renameSync(move.destinationPath, move.sourcePath);
			} catch (restoreError) {
				warnings.push(`Could not restore ${move.sourcePath}; preserved at ${move.destinationPath}: ${String(restoreError)}`);
			}
			warnings.push(`Could not finish legacy agent migration: ${String(error)}. Any remaining source is preserved at ${retainedRoot}. Rerun openclaw doctor --fix after resolving this error.`);
		} finally {
			if (preserveSource) for (const relative of conflicts) warnings.push(`Kept ${path.join(targetDir, relative)}; legacy copy remains at ${path.join(sourceRoot, relative)} with the deferred SQLite store.`);
		}
	}
	return {
		changes,
		warnings,
		warningDisposition: "recoverable",
		...sqliteFamilies.length > 0 ? { sqliteFamilies } : {},
		...deferred.length > 0 ? { deferred } : {},
		...deferred.length > 0 || sqliteFamilies.length > 0 ? { outcome: "deferred" } : {}
	};
}
//#endregion
//#region src/infra/state-migrations.managed-outgoing-images.ts
const LEGACY_RECORD_MAX_BYTES = 1048576;
const DEFAULT_TRANSIENT_TTL_MS = 9e5;
const ATTACHMENT_ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const DOCTOR_CLAIM_MARKER = ".json.doctor-importing-";
const DOCTOR_CLAIM_SUFFIX_RE = /^\d+-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const RECORD_KEYS = /* @__PURE__ */ new Set([
	"attachmentId",
	"sessionKey",
	"agentId",
	"messageId",
	"createdAt",
	"updatedAt",
	"retentionClass",
	"alt",
	"original"
]);
const ORIGINAL_KEYS = /* @__PURE__ */ new Set([
	"path",
	"contentType",
	"width",
	"height",
	"sizeBytes",
	"filename"
]);
function resolveLegacyManagedOutgoingImageRecordsDir(stateDir) {
	return path.join(stateDir, "media", "outgoing", "records");
}
function sourceNameFromDoctorClaim(name) {
	const markerIndex = name.indexOf(DOCTOR_CLAIM_MARKER);
	if (markerIndex < 0) return null;
	const attachmentId = name.slice(0, markerIndex);
	const suffix = name.slice(markerIndex + 23);
	return ATTACHMENT_ID_RE.test(attachmentId) && DOCTOR_CLAIM_SUFFIX_RE.test(suffix) ? `${attachmentId}.json` : null;
}
function isLegacyManagedImageSourceName(name) {
	return name.endsWith(".json") || sourceNameFromDoctorClaim(name) !== null;
}
function detectLegacyManagedOutgoingImages(params) {
	const sourceDir = resolveLegacyManagedOutgoingImageRecordsDir(params.stateDir);
	let hasLegacy = false;
	if (params.doctorOnlyStateMigrations === true) try {
		hasLegacy = fs.readdirSync(sourceDir).some(isLegacyManagedImageSourceName);
	} catch {
		hasLegacy = false;
	}
	return {
		sourceDir,
		hasLegacy
	};
}
function recoverInterruptedDoctorClaims(sourceDir) {
	for (const claimName of fs.readdirSync(sourceDir).toSorted()) {
		const sourceName = sourceNameFromDoctorClaim(claimName);
		if (!sourceName) continue;
		const claimPath = path.join(sourceDir, claimName);
		const sourcePath = path.join(sourceDir, sourceName);
		const claimSnapshot = readLegacySourceSnapshot$2(claimPath);
		if (!fs.existsSync(sourcePath)) {
			fs.renameSync(claimPath, sourcePath);
			continue;
		}
		const sourceSnapshot = readLegacySourceSnapshot$2(sourcePath);
		if (sourceSnapshot.size !== claimSnapshot.size || sourceSnapshot.sha256 !== claimSnapshot.sha256) throw new Error(`interrupted managed image claim conflicts with ${sourcePath}`);
		fs.unlinkSync(claimPath);
	}
}
function readLegacySourceSnapshot$2(sourcePath) {
	return readLegacyMigrationSourceSnapshotSync({
		sourcePath,
		label: "managed image",
		maxBytes: LEGACY_RECORD_MAX_BYTES
	});
}
function nullableNonNegativeInteger(value) {
	if (value === null) return null;
	return asSafeIntegerInRange(value, { min: 0 });
}
function parseLegacyManagedImageRecord(params) {
	const raw = JSON.parse(params.snapshot.raw);
	if (!isRecord(raw) || !isRecord(raw.original)) throw new Error("legacy managed image record must be an object");
	assertAllowedJsonFields(raw, RECORD_KEYS, "legacy managed image record");
	assertAllowedJsonFields(raw.original, ORIGINAL_KEYS, "legacy managed image record", { fieldPrefix: "original." });
	const attachmentId = readNonBlankString(raw.attachmentId);
	const sessionKey = readNonBlankString(raw.sessionKey);
	const agentId = readNonBlankString(raw.agentId);
	const messageId = raw.messageId === null ? null : readNonBlankString(raw.messageId);
	const createdAt = readNonBlankString(raw.createdAt);
	const updatedAt = readNonBlankString(raw.updatedAt);
	const alt = typeof raw.alt === "string" ? raw.alt : void 0;
	const retentionClass = raw.retentionClass;
	const originalPath = readNonBlankString(raw.original.path);
	const contentType = readNonBlankString(raw.original.contentType);
	const width = nullableNonNegativeInteger(raw.original.width);
	const height = nullableNonNegativeInteger(raw.original.height);
	const sizeBytes = nullableNonNegativeInteger(raw.original.sizeBytes);
	const filename = raw.original.filename === null ? null : readNonBlankString(raw.original.filename);
	if (!attachmentId || !ATTACHMENT_ID_RE.test(attachmentId) || path.basename(params.snapshot.sourcePath) !== `${attachmentId}.json` || !sessionKey || raw.agentId !== void 0 && !agentId || raw.messageId !== null && messageId === void 0 || !createdAt || !Number.isFinite(Date.parse(createdAt)) || raw.updatedAt !== void 0 && (!updatedAt || !Number.isFinite(Date.parse(updatedAt))) || retentionClass !== void 0 && retentionClass !== "transient" && retentionClass !== "history" || alt === void 0 || !originalPath || !contentType || width === void 0 || height === void 0 || sizeBytes === void 0 || raw.original.filename !== null && filename === void 0) throw new Error(`legacy managed image record is invalid: ${params.snapshot.sourcePath}`);
	const resolvedOriginalPath = path.resolve(originalPath);
	const mediaRoot = path.dirname(path.dirname(path.dirname(resolvedOriginalPath)));
	if (!(/* @__PURE__ */ new Set([path.resolve(params.stateDir, "media"), path.resolve(getMediaDir())])).has(mediaRoot) || path.dirname(resolvedOriginalPath) !== path.join(mediaRoot, "outgoing/originals")) throw new Error("legacy managed image original is outside managed outgoing storage");
	const mediaId = path.basename(resolvedOriginalPath);
	if (!mediaId || mediaId === "." || mediaId === "..") throw new Error("legacy managed image original has an invalid media id");
	return {
		snapshot: params.snapshot,
		originalPath: resolvedOriginalPath,
		record: {
			attachmentId,
			sessionKey,
			...agentId ? { agentId } : {},
			messageId: messageId ?? null,
			createdAt,
			...updatedAt ? { updatedAt } : {},
			...retentionClass === "transient" || retentionClass === "history" ? { retentionClass } : {},
			alt,
			original: {
				mediaRoot,
				mediaId,
				mediaSubdir: MANAGED_OUTGOING_ORIGINALS_SUBDIR,
				contentType,
				width,
				height,
				sizeBytes,
				filename: filename ?? null
			}
		}
	};
}
function restoreClaimedSources(claimed) {
	const restoreErrors = [];
	for (const entry of claimed.toReversed()) {
		if (!fs.existsSync(entry.claimPath)) continue;
		if (fs.existsSync(entry.sourcePath)) {
			restoreErrors.push(`source path already exists: ${entry.sourcePath}`);
			continue;
		}
		try {
			fs.renameSync(entry.claimPath, entry.sourcePath);
		} catch (error) {
			restoreErrors.push(String(error));
		}
	}
	return restoreErrors;
}
function appendRestoreFailures(error, restoreErrors) {
	return `${String(error)}${restoreErrors.length > 0 ? `; restore failures: ${restoreErrors.join("; ")}` : ""}`;
}
function claimLegacySources(params) {
	params.beforeClaim?.();
	const claimed = [];
	try {
		for (const parsed of params.records) {
			const sourcePath = parsed.snapshot.sourcePath;
			const claimPath = `${sourcePath}.doctor-importing-${process.pid}-${randomUUID()}`;
			fs.renameSync(sourcePath, claimPath);
			claimed.push({
				claimPath,
				sourcePath,
				parsed
			});
			const claimedSnapshot = readLegacySourceSnapshot$2(claimPath);
			if (!legacyMigrationSourceSnapshotsMatch(claimedSnapshot, parsed.snapshot)) throw new Error(`legacy managed image source changed before doctor claimed it: ${sourcePath}`);
		}
		return claimed;
	} catch (error) {
		throw new Error(appendRestoreFailures(error, restoreClaimedSources(claimed)), { cause: error });
	}
}
function verifyClaimedSources(claimed) {
	for (const entry of claimed) {
		const claimedSnapshot = readLegacySourceSnapshot$2(entry.claimPath);
		if (!legacyMigrationSourceSnapshotsMatch(claimedSnapshot, entry.parsed.snapshot)) throw new Error(`claimed legacy managed image source changed: ${entry.sourcePath}`);
		if (fs.existsSync(entry.sourcePath)) throw new Error(`legacy managed image source was replaced while doctor imported it`);
	}
}
function removeClaimedSources$1(params) {
	try {
		for (const entry of params.claimed) (params.removeSource ?? fs.unlinkSync)(entry.claimPath);
	} catch (error) {
		throw new Error(appendRestoreFailures(error, restoreClaimedSources(params.claimed)), { cause: error });
	}
}
function isExpiredTransient(record, nowMs, transientTtlMs) {
	const createdAtMs = Date.parse(record.createdAt);
	return record.messageId === null && Number.isFinite(createdAtMs) && nowMs - createdAtMs >= transientTtlMs;
}
function rollbackImportedRecords(params) {
	try {
		runOpenClawStateWriteTransaction(({ db }) => {
			const stateDb = getNodeSqliteKysely(db);
			for (const parsed of params.records) {
				const row = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("managed_outgoing_image_records").selectAll().where("attachment_id", "=", parsed.record.attachmentId));
				if (!row || row.cleanup_pending === 1 || !managedImageRecordsEqual(managedImageRecordFromRow(row), parsed.record)) continue;
				executeSqliteQuerySync(db, stateDb.deleteFrom("managed_outgoing_image_records").where("attachment_id", "=", parsed.record.attachmentId));
			}
		}, { env: {
			...process.env,
			OPENCLAW_STATE_DIR: params.stateDir
		} });
		return null;
	} catch (error) {
		return String(error);
	}
}
/** Import, verify, and remove retired record JSON during explicit Doctor repair. */
function migrateLegacyManagedOutgoingImages(params) {
	const changes = [];
	const warnings = [];
	if (!params.detected.hasLegacy) return {
		changes,
		warnings
	};
	let parsedRecords;
	try {
		const sourceDirStat = fs.lstatSync(params.detected.sourceDir);
		if (!sourceDirStat.isDirectory() || sourceDirStat.isSymbolicLink()) throw new Error("legacy managed image records owner is not a regular directory");
		recoverInterruptedDoctorClaims(params.detected.sourceDir);
		parsedRecords = fs.readdirSync(params.detected.sourceDir).filter((name) => name.endsWith(".json")).toSorted().map((name) => parseLegacyManagedImageRecord({
			snapshot: readLegacySourceSnapshot$2(path.join(params.detected.sourceDir, name)),
			stateDir: params.stateDir
		}));
	} catch (error) {
		warnings.push(`Failed reading legacy managed outgoing image state: ${String(error)}`);
		return {
			changes,
			warnings
		};
	}
	const nowMs = params.nowMs ?? Date.now();
	const transientTtlMs = params.transientTtlMs ?? DEFAULT_TRANSIENT_TTL_MS;
	const discardedIds = /* @__PURE__ */ new Set();
	const insertedRecords = [];
	let claimed;
	try {
		claimed = claimLegacySources({
			records: parsedRecords,
			beforeClaim: params.beforeClaim
		});
	} catch (error) {
		warnings.push(`Failed claiming legacy managed outgoing image state: ${String(error)}`);
		return {
			changes,
			warnings
		};
	}
	try {
		runOpenClawStateWriteTransaction(({ db }) => {
			const stateDb = getNodeSqliteKysely(db);
			for (const parsed of parsedRecords) {
				const existing = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("managed_outgoing_image_records").selectAll().where("attachment_id", "=", parsed.record.attachmentId));
				if (existing) {
					if (!managedImageRecordsEqual(managedImageRecordFromRow(existing), parsed.record)) throw new Error(`legacy managed image record conflicts with shared SQLite state: ${parsed.record.attachmentId}`);
					continue;
				}
				if (isExpiredTransient(parsed.record, nowMs, transientTtlMs)) {
					discardedIds.add(parsed.record.attachmentId);
					continue;
				}
				executeSqliteQuerySync(db, stateDb.insertInto("managed_outgoing_image_records").values(managedImageRecordToRow(parsed.record)));
				insertedRecords.push(parsed);
			}
		}, { env: {
			...process.env,
			OPENCLAW_STATE_DIR: params.stateDir
		} });
	} catch (error) {
		warnings.push(`Failed migrating legacy managed outgoing image state: ${appendRestoreFailures(error, restoreClaimedSources(claimed))}`);
		return {
			changes,
			warnings
		};
	}
	try {
		params.beforeVerify?.();
		const database = openOpenClawStateDatabase({ env: {
			...process.env,
			OPENCLAW_STATE_DIR: params.stateDir
		} });
		const stateDb = getNodeSqliteKysely(database.db);
		for (const parsed of parsedRecords) {
			const row = executeSqliteQueryTakeFirstSync(database.db, stateDb.selectFrom("managed_outgoing_image_records").selectAll().where("attachment_id", "=", parsed.record.attachmentId));
			if (discardedIds.has(parsed.record.attachmentId)) {
				if (row) throw new Error(`discarded transient record unexpectedly exists: ${parsed.record.attachmentId}`);
			} else if (!row || !managedImageRecordsEqual(managedImageRecordFromRow(row), parsed.record)) throw new Error(`managed image verification failed: ${parsed.record.attachmentId}`);
		}
		verifyClaimedSources(claimed);
	} catch (error) {
		const rollbackError = rollbackImportedRecords({
			records: insertedRecords,
			stateDir: params.stateDir
		});
		const restoreErrors = restoreClaimedSources(claimed);
		warnings.push(`Failed verifying legacy managed outgoing image migration: ${appendRestoreFailures(error, restoreErrors)}` + (rollbackError ? `; SQLite rollback failure: ${rollbackError}` : ""));
		return {
			changes,
			warnings
		};
	}
	let deletedExpiredFiles = 0;
	try {
		for (const parsed of parsedRecords) {
			if (!discardedIds.has(parsed.record.attachmentId)) continue;
			fs.rmSync(parsed.originalPath, { force: true });
			deletedExpiredFiles += 1;
		}
	} catch (error) {
		warnings.push(`Failed deleting expired legacy managed image attachments: ${appendRestoreFailures(error, restoreClaimedSources(claimed))}`);
		return {
			changes,
			warnings
		};
	}
	try {
		removeClaimedSources$1({
			claimed,
			removeSource: params.removeSource
		});
	} catch (error) {
		warnings.push(`Migrated managed outgoing images but could not remove legacy JSON: ${String(error)}`);
		return {
			changes,
			warnings
		};
	}
	try {
		fs.rmdirSync(params.detected.sourceDir);
	} catch {}
	const importedCount = parsedRecords.length - discardedIds.size;
	if (importedCount > 0) changes.push(`Migrated ${importedCount} managed outgoing image record(s) → shared SQLite state`);
	if (discardedIds.size > 0) changes.push(`Discarded ${discardedIds.size} expired managed outgoing image record(s)` + (deletedExpiredFiles > 0 ? ` and ${deletedExpiredFiles} attachment file(s)` : ""));
	changes.push("Removed legacy managed outgoing image JSON after SQLite verification");
	return {
		changes,
		warnings
	};
}
//#endregion
//#region src/infra/state-migrations.mcp-oauth-format.ts
const MAX_TIMESTAMP_MS = 864e13;
const STORE_KEYS = /* @__PURE__ */ new Set([
	"clientInformation",
	"tokens",
	"tokenExpiresAt",
	"codeVerifier",
	"discoveryState",
	"lastAuthorizationUrl",
	"redirectUrl",
	"state"
]);
const DISCOVERY_KEYS = /* @__PURE__ */ new Set([
	"authorizationServerUrl",
	"authorizationServerMetadata",
	"resourceMetadata",
	"resourceMetadataUrl"
]);
function assertOnlyKeys(value, allowed, label) {
	if (Object.keys(value).some((key) => !allowed.has(key))) throw new Error(`${label} has an unexpected field`);
}
function parseSafeUrl(value, label) {
	if (typeof value !== "string") throw new Error(`${label} is not a string`);
	let parsed;
	try {
		parsed = new URL(value);
	} catch {
		throw new Error(`${label} is not a valid URL`);
	}
	if ([
		"javascript:",
		"data:",
		"vbscript:"
	].includes(parsed.protocol)) throw new Error(`${label} uses an unsafe URL scheme`);
	return value;
}
function parseDiscoveryState(value) {
	if (!isRecord(value)) throw new Error("legacy MCP OAuth discovery state is not an object");
	assertOnlyKeys(value, DISCOVERY_KEYS, "legacy MCP OAuth discovery state");
	const result = { authorizationServerUrl: parseSafeUrl(value.authorizationServerUrl, "legacy MCP OAuth authorization server URL") };
	if (value.authorizationServerMetadata !== void 0) {
		const oauth = OAuthMetadataSchema.safeParse(value.authorizationServerMetadata);
		const oidc = oauth.success ? null : OpenIdProviderDiscoveryMetadataSchema.safeParse(value.authorizationServerMetadata);
		if (!oauth.success && !oidc?.success) throw new Error("legacy MCP OAuth authorization server metadata is invalid");
		result.authorizationServerMetadata = value.authorizationServerMetadata;
	}
	if (value.resourceMetadata !== void 0) {
		if (!OAuthProtectedResourceMetadataSchema.safeParse(value.resourceMetadata).success) throw new Error("legacy MCP OAuth resource metadata is invalid");
		result.resourceMetadata = value.resourceMetadata;
	}
	if (value.resourceMetadataUrl !== void 0) result.resourceMetadataUrl = parseSafeUrl(value.resourceMetadataUrl, "legacy MCP OAuth resource metadata URL");
	return result;
}
function parseLegacyMcpOAuthStore(value) {
	if (!isRecord(value)) throw new Error("legacy MCP OAuth store is not an object");
	assertOnlyKeys(value, STORE_KEYS, "legacy MCP OAuth store");
	const result = {};
	if (value.clientInformation !== void 0) {
		if (!OAuthClientInformationSchema.safeParse(value.clientInformation).success) throw new Error("legacy MCP OAuth client information is invalid");
		result.clientInformation = value.clientInformation;
	}
	if (value.tokens !== void 0) {
		if (!OAuthTokensSchema.safeParse(value.tokens).success) throw new Error("legacy MCP OAuth tokens are invalid");
		result.tokens = value.tokens;
	}
	if (value.tokenExpiresAt !== void 0) {
		if (typeof value.tokenExpiresAt !== "number" || !Number.isFinite(value.tokenExpiresAt) || value.tokenExpiresAt < 0 || value.tokenExpiresAt > MAX_TIMESTAMP_MS) throw new Error("legacy MCP OAuth token expiry is invalid");
		if (result.tokens !== void 0) result.tokenExpiresAt = value.tokenExpiresAt;
	}
	if (value.codeVerifier !== void 0) {
		if (typeof value.codeVerifier !== "string" || value.codeVerifier.length === 0) throw new Error("legacy MCP OAuth code verifier is invalid");
		result.codeVerifier = value.codeVerifier;
	}
	if (value.discoveryState !== void 0) result.discoveryState = parseDiscoveryState(value.discoveryState);
	if (value.lastAuthorizationUrl !== void 0) result.lastAuthorizationUrl = parseSafeUrl(value.lastAuthorizationUrl, "legacy MCP OAuth authorization URL");
	if (value.redirectUrl !== void 0) result.redirectUrl = parseSafeUrl(value.redirectUrl, "legacy MCP OAuth redirect URL");
	return result;
}
//#endregion
//#region src/infra/state-migrations.mcp-oauth-lock-stale.ts
const LEGACY_LOCK_STALE_MS = 6e4;
function parseLockPayload(raw) {
	return safeParseJsonRecord(raw) ?? null;
}
/** Classify only retired-runtime owners whose age and process identity are provably stale. */
function isDefinitelyStaleLegacyMcpOAuthLock(params) {
	const payload = parseLockPayload(params.raw);
	if (!payload) return false;
	const pid = payload.pid;
	const createdAt = payload.createdAt;
	const starttime = payload.starttime;
	if (typeof pid !== "number" || !Number.isSafeInteger(pid) || pid <= 0 || typeof createdAt !== "string" || starttime !== void 0 && (typeof starttime !== "number" || !Number.isSafeInteger(starttime) || starttime < 0)) return false;
	const createdAtMs = Date.parse(createdAt);
	const ageMs = (params.nowMs ?? Date.now()) - createdAtMs;
	if (!Number.isFinite(createdAtMs) || new Date(createdAtMs).toISOString() !== createdAt || !Number.isFinite(ageMs) || ageMs < LEGACY_LOCK_STALE_MS) return false;
	return isLockOwnerDefinitelyStale({
		payload,
		isPidDefinitelyDead: params.isPidDefinitelyDead ?? isPidDefinitelyDead,
		getProcessStartTime: params.getProcessStartTime ?? getFileLockProcessStartTime
	});
}
//#endregion
//#region src/infra/state-migrations.mcp-oauth-lock.ts
const LOCK_RETRIES = 20;
const LOCK_RETRY_FACTOR = 1.3;
const LOCK_RETRY_MIN_MS = 25;
const LOCK_RETRY_MAX_MS = 500;
const MCP_OAUTH_LOCKS = createFileLockManager("openclaw.mcp-oauth-legacy-migration");
function createLockPayload() {
	const payload = {
		pid: process.pid,
		createdAt: (/* @__PURE__ */ new Date()).toISOString(),
		nonce: randomUUID()
	};
	const starttime = getFileLockProcessStartTime(process.pid);
	if (starttime !== null) payload.starttime = starttime;
	return payload;
}
function readLegacyRawPayload(payload) {
	return payload && typeof payload === "object" && "raw" in payload && typeof payload.raw === "string" ? payload.raw : "";
}
/** Share the retired runtime's sidecar protocol without leaving the pinned state root. */
async function withRootBoundedLegacyFileLock(params, run) {
	const targetPath = path.resolve(params.stateRoot.rootReal, params.targetRelativePath);
	return await MCP_OAUTH_LOCKS.withLock(targetPath, {
		lockPath: `${targetPath}.lock`,
		lockRoot: asFsSafeFileLockRoot(params.stateRoot),
		retry: {
			retries: LOCK_RETRIES,
			factor: LOCK_RETRY_FACTOR,
			minTimeout: LOCK_RETRY_MIN_MS,
			maxTimeout: LOCK_RETRY_MAX_MS
		},
		staleRecovery: "fail-closed",
		payload: createLockPayload,
		parsePayload: (raw) => ({ raw }),
		shouldReclaim: ({ payload }) => isDefinitelyStaleLegacyMcpOAuthLock({ raw: readLegacyRawPayload(payload) })
	}, run);
}
//#endregion
//#region src/infra/state-migrations.mcp-oauth.ts
const LEGACY_MCP_OAUTH_DIR = "mcp-oauth";
const DOCTOR_CLAIM_SUFFIX$2 = ".doctor-importing";
const MIGRATION_KIND$4 = "legacy-mcp-oauth-json";
const MAX_LEGACY_STORE_BYTES = 4194304;
const utf8Decoder$2 = new TextDecoder("utf-8", { fatal: true });
function parseLegacyMcpOAuthJson(buffer) {
	try {
		return JSON.parse(utf8Decoder$2.decode(buffer));
	} catch {
		throw new Error("legacy MCP OAuth store contains invalid JSON");
	}
}
function exactLegacyBaseName(name) {
	const baseName = name.endsWith(DOCTOR_CLAIM_SUFFIX$2) ? name.slice(0, -17) : name;
	return mcpOAuthStoreKeyFromLegacyFileName(baseName) ? baseName : null;
}
function exactLegacyBaseNames(entries) {
	const baseNames = /* @__PURE__ */ new Set();
	for (const entry of entries) {
		const baseName = exactLegacyBaseName(entry.name);
		if (baseName) baseNames.add(baseName);
	}
	return Array.from(baseNames).toSorted();
}
function listLegacySourcePaths(sourceDir) {
	return exactLegacyBaseNames(fs.readdirSync(sourceDir, { withFileTypes: true })).map((baseName) => path.join(sourceDir, baseName));
}
async function listLegacySourcePathsFromRoot(params) {
	return exactLegacyBaseNames(await params.stateRoot.list(LEGACY_MCP_OAUTH_DIR, { withFileTypes: true })).map((baseName) => path.join(params.stateDir, LEGACY_MCP_OAUTH_DIR, baseName));
}
/** Detect exact retired MCP OAuth filenames only for an explicit Doctor flow. */
function detectLegacyMcpOAuthStores(params) {
	const sourceDir = path.join(params.stateDir, LEGACY_MCP_OAUTH_DIR);
	if (params.doctorOnlyStateMigrations !== true) return {
		sourceDir,
		sourcePaths: [],
		hasLegacy: false
	};
	try {
		const sourcePaths = listLegacySourcePaths(sourceDir);
		return {
			sourceDir,
			sourcePaths,
			hasLegacy: sourcePaths.length > 0
		};
	} catch {
		return {
			sourceDir,
			sourcePaths: [],
			hasLegacy: pathMayExistSync(sourceDir)
		};
	}
}
function relativeLegacyPath(stateDir, filePath) {
	return resolveLegacyMigrationRelativePath(stateDir, filePath, "MCP OAuth", false);
}
async function readLegacySourceSnapshot$1(stateRoot, stateDir, sourcePath, options = {}) {
	const snapshot = await readLegacyMigrationSourceSnapshot({
		stateRoot,
		stateDir,
		sourcePath,
		maxBytes: MAX_LEGACY_STORE_BYTES,
		label: "MCP OAuth"
	});
	const parsed = options.parseStore === false ? {} : parseLegacyMcpOAuthStore(parseLegacyMcpOAuthJson(snapshot.buffer));
	return {
		...snapshot,
		store: parsed
	};
}
function storeKeyForSource(sourcePath) {
	const storeKey = mcpOAuthStoreKeyFromLegacyFileName(path.basename(sourcePath));
	if (!storeKey) throw new Error("legacy MCP OAuth filename is invalid");
	return storeKey;
}
function importAndRecordReceipt$1(params) {
	const sourceKey = resolveLegacyMigrationSourceKey("mcp-oauth-json", params.sourcePath);
	const storeKey = storeKeyForSource(params.sourcePath);
	const runId = `${sourceKey}:${params.snapshot.sha256.slice(0, 16)}`;
	const now = Date.now();
	return runOpenClawStateWriteTransaction(({ db }) => {
		const stateDb = getNodeSqliteKysely(db);
		if (readLegacyMigrationReceiptFromDatabase(db, sourceKey)) return {
			sourceKey,
			imported: false
		};
		const existingStore = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("mcp_oauth_stores").selectAll().where("store_key", "=", storeKey));
		let importedLegacyState;
		if (existingStore) {
			if (existingStore.format_version !== 1) throw new Error("canonical MCP OAuth store has an unsupported format version");
			const canonicalStore = parseMcpOAuthStoreJson(storeKey, existingStore.store_json);
			const canMergeLegacyState = canonicalStore.credentialState === "uninitialized";
			const legacyStore = { ...params.snapshot.store };
			if (canonicalStore.pendingAuthorizationChallenge?.resourceMetadataUrl) delete legacyStore.discoveryState;
			importedLegacyState = canMergeLegacyState && Object.keys(legacyStore).some((key) => !Object.hasOwn(canonicalStore, key));
			if (importedLegacyState) {
				const mergedStore = {
					...legacyStore,
					...canonicalStore
				};
				delete mergedStore.credentialState;
				executeSqliteQuerySync(db, stateDb.updateTable("mcp_oauth_stores").set({
					store_json: JSON.stringify(mergedStore),
					updated_at: now
				}).where("store_key", "=", storeKey));
			}
		} else {
			importedLegacyState = true;
			executeSqliteQuerySync(db, stateDb.insertInto("mcp_oauth_stores").values({
				store_key: storeKey,
				format_version: 1,
				store_json: JSON.stringify(params.snapshot.store),
				updated_at: now
			}));
		}
		const verified = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("mcp_oauth_stores").selectAll().where("store_key", "=", storeKey));
		if (!verified || verified.format_version !== 1) throw new Error("SQLite verification failed for an MCP OAuth store");
		parseMcpOAuthStoreJson(storeKey, verified.store_json);
		const reportJson = JSON.stringify({
			source: MIGRATION_KIND$4,
			target: "mcp_oauth_stores",
			storeKey,
			sourceSha256: params.snapshot.sha256,
			importedRecordCount: importedLegacyState ? 1 : 0,
			preservedSqliteRecordCount: existingStore ? 1 : 0
		});
		recordLegacyMigrationReceipt(db, {
			sourceKey,
			migrationKind: MIGRATION_KIND$4,
			sourcePath: params.sourcePath,
			targetTable: "mcp_oauth_stores",
			sourceSha256: params.snapshot.sha256,
			sourceSizeBytes: params.snapshot.size,
			sourceRecordCount: 1,
			runId,
			now,
			reportJson
		});
		return {
			sourceKey,
			imported: importedLegacyState
		};
	}, { env: params.env });
}
async function cleanupReceiptAuthoritativeSources(params) {
	let removed = 0;
	for (const candidate of [params.sourcePath, `${params.sourcePath}${DOCTOR_CLAIM_SUFFIX$2}`]) {
		if (!await params.stateRoot.exists(relativeLegacyPath(params.stateDir, candidate))) continue;
		await readLegacySourceSnapshot$1(params.stateRoot, params.stateDir, candidate, { parseStore: false });
		if (params.removeSource) await params.removeSource(candidate);
		else await params.stateRoot.remove(relativeLegacyPath(params.stateDir, candidate));
		removed += 1;
	}
	if (!params.receipt.removedSource || removed > 0) markLegacyMigrationSourceRemoved(params.receipt.sourceKey, params.env);
	return removed;
}
async function migrateOneStore(params) {
	const changes = [];
	const warnings = [];
	const notices = [];
	const source = new LegacyMigrationSourceClaim({
		stateRoot: params.stateRoot,
		stateDir: params.stateDir,
		sourcePath: params.sourcePath,
		label: "MCP OAuth",
		includeFilePath: false,
		claimSuffix: DOCTOR_CLAIM_SUFFIX$2,
		readSnapshot: (snapshotPath) => readLegacySourceSnapshot$1(params.stateRoot, params.stateDir, snapshotPath)
	});
	await source.recoverLinkedMove();
	const receipt = readLegacyMigrationReceipt(resolveLegacyMigrationSourceKey("mcp-oauth-json", params.sourcePath), params.env);
	if (receipt) {
		try {
			if (await cleanupReceiptAuthoritativeSources({
				...params,
				receipt
			}) > 0) changes.push("Discarded recreated retired MCP OAuth JSON without importing it.");
		} catch (error) {
			warnings.push(`MCP OAuth state is in SQLite, but legacy cleanup failed: ${String(error)}`);
		}
		return notices.length > 0 ? {
			changes,
			warnings,
			notices
		} : {
			changes,
			warnings
		};
	}
	const hasSource = await source.exists();
	const hasClaim = await source.exists(true);
	if (hasSource && hasClaim) return {
		changes,
		warnings: [`Failed migrating legacy MCP OAuth store ${path.basename(params.sourcePath)}: source and interrupted claim both exist.`]
	};
	const activePath = hasSource ? params.sourcePath : hasClaim ? source.claimPath : null;
	if (!activePath) return {
		changes,
		warnings
	};
	let snapshot;
	try {
		snapshot = await readLegacySourceSnapshot$1(params.stateRoot, params.stateDir, activePath);
	} catch (error) {
		warnings.push(`Failed reading legacy MCP OAuth store ${path.basename(params.sourcePath)}: ${String(error)}`);
		return {
			changes,
			warnings
		};
	}
	if (activePath === params.sourcePath) try {
		snapshot = await source.claim({
			snapshot,
			mismatchMessage: "legacy MCP OAuth source changed before Doctor could claim it",
			beforeClaim: () => params.beforeClaim?.(params.sourcePath)
		});
	} catch (error) {
		const restoreError = await source.restore();
		warnings.push(`Failed migrating legacy MCP OAuth store ${path.basename(params.sourcePath)}: ${String(error)}${restoreError ? `; restore failure: ${restoreError}` : ""}`);
		return {
			changes,
			warnings
		};
	}
	let result;
	try {
		result = importAndRecordReceipt$1({
			env: params.env,
			sourcePath: params.sourcePath,
			snapshot
		});
	} catch (error) {
		const restoreError = await source.restore();
		warnings.push(`Failed migrating legacy MCP OAuth store ${path.basename(params.sourcePath)}: ${String(error)}${restoreError ? `; restore failure: ${restoreError}` : ""}`);
		return {
			changes,
			warnings
		};
	}
	try {
		if (await source.exists()) throw new Error("legacy MCP OAuth source reappeared during import");
		const finalSnapshot = await source.read(true);
		if (!legacyMigrationSourceSnapshotsMatch(snapshot, finalSnapshot)) throw new Error("legacy MCP OAuth claim changed after SQLite import");
		await source.remove({
			removeSource: params.removeSource,
			claimRemainingMessage: "legacy MCP OAuth Doctor claim remains after cleanup",
			skipSourceCheck: true
		});
		markLegacyMigrationSourceRemoved(result.sourceKey, params.env);
	} catch (error) {
		warnings.push(`MCP OAuth state is in SQLite, but legacy cleanup failed: ${String(error)}`);
		return {
			changes,
			warnings
		};
	}
	changes.push(result.imported ? `Migrated MCP OAuth store ${path.basename(params.sourcePath)} to SQLite.` : `Preserved canonical SQLite MCP OAuth store for ${path.basename(params.sourcePath)}.`);
	notices.push("Removed retired MCP OAuth JSON after verified SQLite import.");
	return {
		changes,
		warnings,
		notices
	};
}
async function migrateWithExclusiveStateOwnership$3(params) {
	const changes = [];
	const warnings = [];
	const notices = [];
	let sourcePaths;
	try {
		sourcePaths = await listLegacySourcePathsFromRoot(params);
	} catch (error) {
		const code = error.code;
		if (code === "ENOENT" || code === "not-found") return {
			changes,
			warnings
		};
		return {
			changes,
			warnings: [`Failed reading legacy MCP OAuth directory: ${String(error)}`]
		};
	}
	for (const sourcePath of sourcePaths) try {
		params.beforeLegacyLock?.(sourcePath);
		const result = await withRootBoundedLegacyFileLock({
			stateRoot: params.stateRoot,
			targetRelativePath: relativeLegacyPath(params.stateDir, sourcePath)
		}, async () => await migrateOneStore({
			...params,
			sourcePath
		}));
		changes.push(...result.changes);
		warnings.push(...result.warnings);
		notices.push(...result.notices ?? []);
	} catch (error) {
		const staleGuidance = error.code === "file_lock_stale" ? " Verify no older OpenClaw process is running, remove the retired .lock sidecar, and rerun Doctor." : "";
		warnings.push(`Failed locking legacy MCP OAuth store ${path.basename(sourcePath)}: ${String(error)}.${staleGuidance}`);
	}
	return notices.length > 0 ? {
		changes,
		warnings,
		notices
	} : {
		changes,
		warnings
	};
}
/** Import retired MCP OAuth stores while excluding old Gateways that can recreate them. */
async function migrateLegacyMcpOAuthStores(params) {
	if (!params.detected.hasLegacy) return {
		changes: [],
		warnings: []
	};
	return await withLegacyMigrationStateLock({
		stateDir: params.stateDir,
		env: params.env,
		label: "legacy MCP OAuth stores",
		releaseLabel: "MCP OAuth",
		errorLabel: "Failed reading legacy MCP OAuth state",
		run: async (env) => {
			const stateRoot = await root(params.stateDir, {
				hardlinks: "reject",
				maxBytes: MAX_LEGACY_STORE_BYTES,
				symlinks: "reject"
			});
			return await migrateWithExclusiveStateOwnership$3({
				...params,
				env,
				stateRoot
			});
		}
	});
}
//#endregion
//#region src/infra/state-migrations.meeting-transcripts-database.ts
function migrationDb(db) {
	return getNodeSqliteKysely(db);
}
//#endregion
//#region src/infra/state-migrations.meeting-transcripts-files.ts
const LEGACY_UTTERANCE_STAGE_BATCH_SIZE = 256;
function isRecordedCanonicalTranscriptExport(params) {
	const entries = fs.readdirSync(params.sessionDir, { withFileTypes: true });
	for (const entry of entries) {
		const canonicalName = entry.name.toLowerCase();
		if (!TRANSCRIPT_EXPORT_FILE_NAMES.has(canonicalName)) continue;
		const filePath = path.join(params.sessionDir, entry.name);
		const stat = fs.lstatSync(filePath);
		if (stat.isSymbolicLink() || !stat.isFile()) return false;
		const expectedHash = params.manifest[canonicalName];
		if (params.pending?.has(canonicalName) !== true && (!expectedHash || sha256FileSync(filePath) !== expectedHash)) return false;
	}
	return true;
}
function hasMatchingRecordedTranscriptArtifact(params) {
	for (const entry of fs.readdirSync(params.sessionDir, { withFileTypes: true })) {
		const canonicalName = entry.name.toLowerCase();
		const expectedHash = params.manifest[canonicalName];
		if (!TRANSCRIPT_EXPORT_FILE_NAMES.has(canonicalName) || !expectedHash) continue;
		const filePath = path.join(params.sessionDir, entry.name);
		const stat = fs.lstatSync(filePath);
		if (!stat.isSymbolicLink() && stat.isFile() && sha256FileSync(filePath) === expectedHash) return true;
	}
	return false;
}
async function validateMeetingTranscriptRoot(rootDir, options = {}) {
	try {
		const stat = await fs$1.lstat(rootDir);
		if (stat.isSymbolicLink() || !stat.isDirectory()) throw new Error(`meeting transcript root must be a regular directory: ${rootDir}`);
		return true;
	} catch (error) {
		if (isRecord(error) && error.code === "ENOENT" && options.allowMissing === true) return false;
		throw error;
	}
}
function parseSession(value, sourcePath) {
	if (!isRecord(value) || typeof value.sessionId !== "string" || !value.sessionId) throw new Error(`invalid transcripts metadata sessionId at ${sourcePath}`);
	if (typeof value.startedAt !== "string" || !value.startedAt) throw new Error(`invalid transcripts metadata startedAt at ${sourcePath}`);
	if (!isRecord(value.source) || typeof value.source.providerId !== "string") throw new Error(`invalid transcripts metadata source at ${sourcePath}`);
	if (value.title !== void 0 && typeof value.title !== "string") throw new Error(`invalid transcripts metadata title at ${sourcePath}`);
	if (value.stoppedAt !== void 0 && typeof value.stoppedAt !== "string") throw new Error(`invalid transcripts metadata stoppedAt at ${sourcePath}`);
	if (value.metadata !== void 0 && !isRecord(value.metadata)) throw new Error(`invalid transcripts metadata payload at ${sourcePath}`);
	return value;
}
function parseUtterance(value, sourcePath, lineNumber) {
	if (!isRecord(value) || typeof value.text !== "string") throw new Error(`invalid transcript utterance at ${sourcePath}:${lineNumber}`);
	if (value.speaker !== void 0 && (!isRecord(value.speaker) || typeof value.speaker.label !== "string")) throw new Error(`invalid transcript speaker at ${sourcePath}:${lineNumber}`);
	return value;
}
function parseSummary(value, sourcePath) {
	if (!isRecord(value) || typeof value.sessionId !== "string" || typeof value.title !== "string" || typeof value.generatedAt !== "string" || typeof value.overview !== "string" || !Array.isArray(value.transcript) || !Array.isArray(value.decisions) || !Array.isArray(value.actionItems) || !Array.isArray(value.risks) || !Number.isSafeInteger(value.utteranceCount) || value.utteranceCount < 0) throw new Error(`invalid transcripts summary at ${sourcePath}`);
	return value;
}
function legacyTranscriptRelativeDir(session) {
	const date = session.startedAt.match(/^(\d{4}-\d{2}-\d{2})T/)?.[1];
	if (!date) throw new Error(`legacy transcript startedAt has no date: ${session.startedAt}`);
	const legacySegment = session.sessionId.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "session";
	return path.normalize(path.join(date, legacySegment));
}
async function optionalRegularFile(filePath) {
	try {
		const stat = await fs$1.lstat(filePath);
		if (stat.isSymbolicLink() || !stat.isFile()) throw new Error(`legacy transcript source must be a regular file: ${filePath}`);
		return true;
	} catch (error) {
		if (isRecord(error) && error.code === "ENOENT") return false;
		throw error;
	}
}
function openLegacyMeetingTranscriptStage(databasePath) {
	const database = openNodeSqliteDatabase(databasePath);
	database.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE staged_utterances (
      stage_key TEXT NOT NULL,
      sequence INTEGER NOT NULL,
      utterance_json TEXT NOT NULL,
      PRIMARY KEY (stage_key, sequence)
    ) STRICT;
  `);
	return database;
}
/**
* Disposes the stage this module opened. The stage holds only rebuildable
* scratch bytes, so its disposal is advisory: every failure is returned as a
* warning for the caller to report next to the migration's real outcome instead
* of replacing it.
*/
function disposeLegacyMeetingTranscriptStage(params) {
	const warnings = [];
	try {
		params.database?.close();
	} catch (error) {
		warnings.push(`Could not close the meeting transcript migration stage database: ${String(error)}`);
	}
	if (!params.databasePath) return warnings;
	for (const file of [
		params.databasePath,
		`${params.databasePath}-shm`,
		`${params.databasePath}-wal`
	]) try {
		fs.rmSync(file, { force: true });
	} catch (error) {
		warnings.push(`Could not remove the disposable meeting transcript migration file ${file}: ${String(error)}`);
	}
	return warnings;
}
async function stageUtterances(params) {
	const filePath = params.filePath;
	if (!await optionalRegularFile(filePath)) return 0;
	const stream = createReadStream(filePath, { encoding: "utf8" });
	const lines = createInterface({
		input: stream,
		crlfDelay: Infinity
	});
	let lineNumber = 0;
	let sequence = 0;
	let pending = [];
	const insert = params.stageDatabase.prepare("INSERT INTO staged_utterances (stage_key, sequence, utterance_json) VALUES (?, ?, ?)");
	const flush = () => {
		if (pending.length === 0) return;
		params.stageDatabase.exec("BEGIN IMMEDIATE");
		try {
			for (const utteranceJson of pending) {
				insert.run(params.stageKey, sequence, utteranceJson);
				sequence += 1;
			}
			params.stageDatabase.exec("COMMIT");
			pending = [];
		} catch (error) {
			params.stageDatabase.exec("ROLLBACK");
			throw error;
		}
	};
	try {
		for await (const line of lines) {
			lineNumber += 1;
			if (!line.trim()) continue;
			const utterance = parseUtterance(JSON.parse(line), filePath, lineNumber);
			pending.push(JSON.stringify(utterance));
			if (pending.length >= LEGACY_UTTERANCE_STAGE_BATCH_SIZE) flush();
		}
		flush();
	} finally {
		lines.close();
		stream.destroy();
	}
	return sequence;
}
function readStagedMeetingTranscriptUtterances(params) {
	return params.stageDatabase.prepare("SELECT utterance_json FROM staged_utterances WHERE stage_key = ? AND sequence >= ? ORDER BY sequence ASC LIMIT ?").all(params.stageKey, params.start, params.limit).map((row) => JSON.parse(String(row.utterance_json)));
}
async function snapshotFile(filePath) {
	if (!await optionalRegularFile(filePath)) return { sizeBytes: 0 };
	const stat = await fs$1.stat(filePath);
	return {
		hash: await sha256File(filePath),
		sizeBytes: stat.size
	};
}
async function snapshotSourceFiles(files) {
	return await Promise.all(files.map(snapshotFile));
}
function sourceFilesHash(files, snapshots) {
	return sha256Hex(snapshots.map((snapshot, index) => `${path.basename(files[index] ?? "")}\0${snapshot.hash ?? "-"}`).join("\n"));
}
async function snapshotLegacyMeetingTranscriptSession(params) {
	const sourceDir = path.join(params.rootDir, params.relativeDir);
	const sourceStat = await fs$1.lstat(sourceDir);
	if (sourceStat.isSymbolicLink() || !sourceStat.isDirectory()) throw new Error(`legacy transcript session must be a regular directory: ${sourceDir}`);
	const metadataPath = path.join(sourceDir, "metadata.json");
	const transcriptPath = path.join(sourceDir, "transcript.jsonl");
	const summaryJsonPath = path.join(sourceDir, "summary.json");
	const summaryMarkdownPath = path.join(sourceDir, "summary.md");
	const files = [
		metadataPath,
		transcriptPath,
		summaryJsonPath,
		summaryMarkdownPath
	];
	const beforeSnapshots = await snapshotSourceFiles(files);
	if (!beforeSnapshots[0]?.hash) throw new Error(`legacy transcript session is missing metadata.json: ${sourceDir}`);
	const session = parseSession(JSON.parse(await fs$1.readFile(metadataPath, "utf8")), metadataPath);
	const expectedRelativeDir = legacyTranscriptRelativeDir(session);
	if (path.normalize(params.relativeDir) !== expectedRelativeDir) throw new Error(`legacy transcript selector mismatch at ${sourceDir}: expected ${expectedRelativeDir}`);
	const utteranceCount = await stageUtterances({
		filePath: transcriptPath,
		stageDatabase: params.stageDatabase,
		stageKey: params.relativeDir
	});
	const hasSummaryJson = await optionalRegularFile(summaryJsonPath);
	const hasSummaryMarkdown = await optionalRegularFile(summaryMarkdownPath);
	const summary = hasSummaryJson ? parseSummary(JSON.parse(await fs$1.readFile(summaryJsonPath, "utf8")), summaryJsonPath) : void 0;
	const markdown = hasSummaryMarkdown ? await fs$1.readFile(summaryMarkdownPath, "utf8") : summary ? renderTranscriptsMarkdown(summary) : void 0;
	if (summary && summary.sessionId !== session.sessionId) throw new Error(`legacy transcript summary session mismatch at ${summaryJsonPath}`);
	const fileSnapshots = await snapshotSourceFiles(files);
	if (fileSnapshots.some((snapshot, index) => snapshot.hash !== beforeSnapshots[index]?.hash || snapshot.sizeBytes !== beforeSnapshots[index]?.sizeBytes)) throw new Error(`legacy transcript files changed while being staged: ${sourceDir}`);
	const sourceHash = sourceFilesHash(files, fileSnapshots);
	return {
		sourceDir,
		relativeDir: params.relativeDir,
		stageKey: params.relativeDir,
		session,
		utteranceCount,
		summary,
		markdown,
		sourceHash,
		sourceSizeBytes: fileSnapshots.reduce((total, file) => total + file.sizeBytes, 0)
	};
}
async function hasLegacyTranscriptArtifacts(directory) {
	const entries = await fs$1.readdir(directory, { withFileTypes: true });
	let found = false;
	for (const entry of entries) {
		if (!TRANSCRIPT_EXPORT_FILE_NAMES.has(entry.name.toLowerCase())) continue;
		const stat = await fs$1.lstat(path.join(directory, entry.name));
		if (stat.isSymbolicLink() || !stat.isFile()) throw new Error(`legacy transcript source must be a regular file: ${directory}`);
		found = true;
	}
	return found;
}
async function listLegacyMeetingTranscriptDirs(rootDir, mode) {
	if (!await validateMeetingTranscriptRoot(rootDir, { allowMissing: true })) return [];
	let dateEntries;
	try {
		dateEntries = await fs$1.readdir(rootDir, { withFileTypes: true });
	} catch (error) {
		if (isRecord(error) && error.code === "ENOENT") return [];
		throw error;
	}
	const include = async (directory) => mode === "sessions" ? await optionalRegularFile(path.join(directory, "metadata.json")) : await hasLegacyTranscriptArtifacts(directory);
	const sessions = [];
	if (await include(rootDir)) sessions.push(".");
	for (const dateEntry of dateEntries.toSorted((a, b) => a.name.localeCompare(b.name))) {
		if (!/^\d{4}-\d{2}-\d{2}$/.test(dateEntry.name)) continue;
		if (dateEntry.isSymbolicLink()) throw new Error(`legacy transcript date directory cannot be a symlink: ${dateEntry.name}`);
		if (!dateEntry.isDirectory()) continue;
		const dateDir = path.join(rootDir, dateEntry.name);
		if (await include(dateDir)) sessions.push(dateEntry.name);
		const sessionEntries = await fs$1.readdir(dateDir, { withFileTypes: true });
		for (const sessionEntry of sessionEntries.toSorted((a, b) => a.name.localeCompare(b.name))) {
			if (sessionEntry.isSymbolicLink()) throw new Error(`legacy transcript session cannot be a symlink: ${sessionEntry.name}`);
			if (sessionEntry.isDirectory() && await include(path.join(dateDir, sessionEntry.name))) sessions.push(path.join(dateEntry.name, sessionEntry.name));
		}
	}
	return sessions;
}
async function listLegacyMeetingTranscriptSessionDirs(rootDir) {
	return await listLegacyMeetingTranscriptDirs(rootDir, "sessions");
}
async function listLegacyMeetingTranscriptArtifactDirs(rootDir) {
	return await listLegacyMeetingTranscriptDirs(rootDir, "artifacts");
}
async function archivePartialMeetingTranscriptArtifacts(params) {
	const moves = [];
	const sourceDirs = /* @__PURE__ */ new Set();
	for (const relativeDir of params.relativeDirs) {
		const sourceDir = path.join(params.sourceRoot, relativeDir);
		if (relativeDir !== ".") sourceDirs.add(sourceDir);
		const destinationDir = path.join(params.recoveryRoot, relativeDir);
		for (const entry of await fs$1.readdir(sourceDir, { withFileTypes: true })) {
			if (!TRANSCRIPT_EXPORT_FILE_NAMES.has(entry.name.toLowerCase())) continue;
			const source = path.join(sourceDir, entry.name);
			const stat = await fs$1.lstat(source);
			if (stat.isSymbolicLink() || !stat.isFile()) throw new Error(`legacy transcript source must be a regular file: ${sourceDir}`);
			const destination = path.join(destinationDir, entry.name);
			try {
				await fs$1.lstat(destination);
				throw new Error(`partial transcript recovery destination already exists: ${destination}`);
			} catch (error) {
				if (!(isRecord(error) && error.code === "ENOENT")) throw error;
			}
			moves.push({
				source,
				destination
			});
		}
	}
	for (const destinationDir of new Set(moves.map((move) => path.dirname(move.destination)))) await fs$1.mkdir(destinationDir, { recursive: true });
	const moved = [];
	try {
		for (const move of moves) {
			await fs$1.rename(move.source, move.destination);
			moved.push(move);
		}
	} catch (error) {
		const rollbackErrors = [];
		for (const move of moved.toReversed()) try {
			await fs$1.rename(move.destination, move.source);
		} catch (rollbackError) {
			rollbackErrors.push(String(rollbackError));
		}
		if (rollbackErrors.length > 0) throw new Error(`partial transcript recovery failed and rollback was incomplete; inspect ${params.recoveryRoot}: ${String(error)}; rollback errors: ${rollbackErrors.join("; ")}`, { cause: error });
		throw error;
	}
	for (const sourceDir of [...sourceDirs].toSorted((a, b) => b.length - a.length)) await fs$1.rmdir(sourceDir).catch(() => void 0);
}
async function rehashLegacyMeetingTranscriptSnapshots(snapshots) {
	for (const snapshot of snapshots) {
		const files = [
			"metadata.json",
			"transcript.jsonl",
			"summary.json",
			"summary.md"
		].map((fileName) => path.join(snapshot.sourceDir, fileName));
		if (sourceFilesHash(files, await snapshotSourceFiles(files)) !== snapshot.sourceHash) return false;
	}
	return true;
}
async function archiveLegacyMeetingTranscriptSnapshots(params) {
	await validateMeetingTranscriptRoot(params.sourceRoot);
	const currentRelativeDirs = await listLegacyMeetingTranscriptSessionDirs(params.sourceRoot);
	const expectedRelativeDirs = params.expectedRelativeDirs.toSorted((a, b) => a.localeCompare(b));
	if (JSON.stringify(currentRelativeDirs) !== JSON.stringify(expectedRelativeDirs)) throw new Error("legacy transcript session tree changed before archive");
	await fs$1.rename(params.sourceRoot, params.archiveRoot);
	try {
		if (!await rehashLegacyMeetingTranscriptSnapshots(params.snapshots.map((snapshot) => ({
			...snapshot,
			sourceDir: path.join(params.archiveRoot, path.relative(params.sourceRoot, snapshot.sourceDir) || ".")
		})))) throw new Error("legacy transcript files changed at the archive boundary");
		await restoreCanonicalMeetingTranscriptExports({
			sourceRoot: params.sourceRoot,
			archiveRoot: params.archiveRoot,
			migratedSourcePaths: params.snapshots.map((snapshot) => snapshot.sourceDir),
			canonicalRelativeDirs: params.canonicalRelativeDirs
		});
	} catch (error) {
		throw new LegacyMeetingTranscriptArchiveMovedError(error);
	}
	return params.archiveRoot;
}
var LegacyMeetingTranscriptArchiveMovedError = class extends Error {
	constructor(cause) {
		super(`legacy transcript source moved but canonical export restoration failed: ${String(cause)}`);
		this.name = "LegacyMeetingTranscriptArchiveMovedError";
	}
};
async function restoreCanonicalMeetingTranscriptExports(params) {
	await validateMeetingTranscriptRoot(params.archiveRoot);
	if (!await validateMeetingTranscriptRoot(params.sourceRoot, { allowMissing: true })) {
		await fs$1.mkdir(params.sourceRoot, { recursive: true });
		await validateMeetingTranscriptRoot(params.sourceRoot);
	}
	const migratedRelativeDirs = new Set(params.migratedSourcePaths.map((sourcePath) => path.relative(params.sourceRoot, sourcePath) || "."));
	for (const relativeDir of params.canonicalRelativeDirs) {
		const archiveRelative = path.relative(path.resolve(params.archiveRoot), path.resolve(params.archiveRoot, relativeDir));
		const sourceRelative = path.relative(path.resolve(params.sourceRoot), path.resolve(params.sourceRoot, relativeDir));
		if (!archiveRelative || archiveRelative.startsWith("..") || path.isAbsolute(archiveRelative) || !sourceRelative || sourceRelative.startsWith("..") || path.isAbsolute(sourceRelative)) throw new Error(`canonical transcript export path escaped its root: ${relativeDir}`);
		if (migratedRelativeDirs.has(relativeDir)) continue;
		const source = path.join(params.archiveRoot, relativeDir);
		const destination = path.join(params.sourceRoot, relativeDir);
		try {
			const sourceStat = await fs$1.lstat(source);
			if (sourceStat.isSymbolicLink() || !sourceStat.isDirectory()) throw new Error(`canonical transcript export source is not a directory: ${source}`);
			await assertNoSymlinkParents({
				rootDir: params.archiveRoot,
				targetPath: source,
				allowMissing: false,
				messagePrefix: "Canonical transcript export source"
			});
		} catch (error) {
			if (!(isRecord(error) && error.code === "ENOENT")) throw error;
			const destinationStat = await fs$1.lstat(destination);
			if (destinationStat.isSymbolicLink() || !destinationStat.isDirectory()) throw new Error(`canonical transcript export destination is not a directory: ${destination}`, { cause: error });
			await assertNoSymlinkParents({
				rootDir: params.sourceRoot,
				targetPath: destination,
				allowMissing: false,
				messagePrefix: "Canonical transcript export destination"
			});
			continue;
		}
		try {
			const destinationStat = await fs$1.lstat(destination);
			if (destinationStat.isSymbolicLink() || !destinationStat.isDirectory()) throw new Error(`canonical transcript export destination is not a directory: ${destination}`);
			await assertNoSymlinkParents({
				rootDir: params.sourceRoot,
				targetPath: destination,
				allowMissing: false,
				messagePrefix: "Canonical transcript export destination"
			});
			const readMetadata = async (directory) => parseSession(JSON.parse(await fs$1.readFile(path.join(directory, "metadata.json"), "utf8")), path.join(directory, "metadata.json"));
			const [sourceMetadata, destinationMetadata] = await Promise.all([readMetadata(source), readMetadata(destination)]);
			if (sourceMetadata.sessionId !== destinationMetadata.sessionId || sourceMetadata.startedAt !== destinationMetadata.startedAt) throw new Error(`canonical transcript export destination changed identity: ${destination}`);
			continue;
		} catch (error) {
			if (!(isRecord(error) && error.code === "ENOENT")) throw error;
		}
		await assertNoSymlinkParents({
			rootDir: params.sourceRoot,
			targetPath: destination,
			allowMissing: true,
			messagePrefix: "Canonical transcript export destination"
		});
		await fs$1.mkdir(path.dirname(destination), { recursive: true });
		await fs$1.rename(source, destination);
	}
}
async function archiveDivergentMeetingTranscriptExport(params) {
	const source = path.join(params.sourceRoot, params.relativeDir);
	const destination = path.join(params.recoveryRoot, params.relativeDir);
	await fs$1.mkdir(path.dirname(destination), { recursive: true });
	await fs$1.rename(source, destination);
	return destination;
}
//#endregion
//#region src/infra/state-migrations.meeting-transcripts-detection.ts
function hasLegacyArtifactsSync(directory) {
	const entries = fs.readdirSync(directory, { withFileTypes: true });
	let found = false;
	for (const entry of entries) {
		if (!TRANSCRIPT_EXPORT_FILE_NAMES.has(entry.name.toLowerCase())) continue;
		const stat = fs.lstatSync(path.join(directory, entry.name));
		if (stat.isSymbolicLink() || !stat.isFile()) throw new Error(`legacy transcript source must be a regular file: ${directory}`);
		found = true;
	}
	return found;
}
function resolveMeetingTranscriptExportOwnership(params) {
	const exact = params.state.exportOwnership.get(params.selector);
	if (exact) return exact;
	const folded = params.state.exportOwnershipByFoldedSelector.get(params.selector.toLowerCase());
	if (!folded || folded.length === 0) return;
	try {
		const metadataEntries = fs.readdirSync(params.sessionDir, { withFileTypes: true }).filter((entry) => entry.name.toLowerCase() === "metadata.json");
		if (metadataEntries.length > 0) {
			if (metadataEntries.length !== 1) return;
			const metadataPath = path.join(params.sessionDir, metadataEntries[0].name);
			const stat = fs.lstatSync(metadataPath);
			if (stat.isSymbolicLink() || !stat.isFile()) return;
			const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
			const matches = folded.filter((ownership) => metadata.sessionId === ownership.sessionId && metadata.startedAt === ownership.startedAt);
			return matches.length === 1 ? matches[0] : void 0;
		}
	} catch {
		return;
	}
	const manifestMatches = folded.filter((ownership) => {
		try {
			const canonicalDir = path.join(params.sourceRoot, ownership.selector);
			const canonicalStat = fs.statSync(canonicalDir);
			const observedStat = fs.statSync(params.sessionDir);
			if (canonicalStat.dev !== observedStat.dev || canonicalStat.ino !== observedStat.ino) return false;
			return hasMatchingRecordedTranscriptArtifact({
				sessionDir: params.sessionDir,
				manifest: ownership.manifest
			});
		} catch {
			return false;
		}
	});
	return manifestMatches.length === 1 ? manifestMatches[0] : void 0;
}
function detectLegacyMeetingTranscripts(params) {
	const sourceDir = path.join(params.stateDir, "transcripts");
	if (params.doctorOnlyStateMigrations !== true) return {
		sourceDir,
		hasLegacy: false,
		pendingImportCount: 0
	};
	const databaseState = readMeetingTranscriptMigrationDetectionState({
		env: {
			...params.env ?? process.env,
			OPENCLAW_STATE_DIR: params.stateDir
		},
		artifactPreservingReadOnly: params.artifactPreservingReadOnly
	});
	const pendingImportCount = databaseState.pendingImportCount;
	const needsDatabaseRepair = pendingImportCount > 0 || databaseState.hasOversizedSessionSlugs;
	try {
		const rootStat = fs.lstatSync(sourceDir);
		if (rootStat.isSymbolicLink() || !rootStat.isDirectory()) throw new Error(`meeting transcript root must be a regular directory: ${sourceDir}`);
		const dateEntries = fs.readdirSync(sourceDir, { withFileTypes: true });
		const sourceSelectors = hasLegacyArtifactsSync(sourceDir) ? ["."] : [];
		for (const dateEntry of dateEntries) {
			if (!/^\d{4}-\d{2}-\d{2}$/.test(dateEntry.name)) continue;
			if (dateEntry.isSymbolicLink()) throw new Error(`legacy transcript date directory cannot be a symlink: ${dateEntry.name}`);
			if (!dateEntry.isDirectory()) continue;
			const dateDir = path.join(sourceDir, dateEntry.name);
			if (hasLegacyArtifactsSync(dateDir)) sourceSelectors.push(dateEntry.name);
			for (const entry of fs.readdirSync(dateDir, { withFileTypes: true })) {
				if (entry.isSymbolicLink()) throw new Error(`legacy transcript session cannot be a symlink: ${entry.name}`);
				if (entry.isDirectory() && hasLegacyArtifactsSync(path.join(dateDir, entry.name))) sourceSelectors.push(`${dateEntry.name}/${entry.name}`);
			}
		}
		return {
			sourceDir,
			hasLegacy: sourceSelectors.some((selector) => {
				const ownership = resolveMeetingTranscriptExportOwnership({
					state: databaseState,
					selector,
					sessionDir: path.join(sourceDir, selector),
					sourceRoot: sourceDir
				});
				return !ownership || !isRecordedCanonicalTranscriptExport({
					sessionDir: path.join(sourceDir, selector),
					manifest: ownership.manifest,
					pending: ownership.pending
				});
			}) || needsDatabaseRepair,
			pendingImportCount
		};
	} catch (error) {
		if (isRecord(error) && error.code === "ENOENT") return {
			sourceDir,
			hasLegacy: needsDatabaseRepair,
			pendingImportCount
		};
		throw error;
	}
}
function readMeetingTranscriptMigrationDetectionState(params) {
	const empty = () => ({
		exportOwnership: /* @__PURE__ */ new Map(),
		exportOwnershipByFoldedSelector: /* @__PURE__ */ new Map(),
		pendingImportCount: 0,
		hasOversizedSessionSlugs: false
	});
	const read = ({ db: database }) => {
		const tables = new Set(database.prepare("SELECT name FROM sqlite_schema WHERE type = 'table' AND name IN ('meeting_transcript_sessions', 'migration_sources')").all().map((row) => String(row.name)));
		const exportOwnership = /* @__PURE__ */ new Map();
		const exportOwnershipByFoldedSelector = /* @__PURE__ */ new Map();
		let hasOversizedSessionSlugs = false;
		if (tables.has("meeting_transcript_sessions")) {
			const rows = database.prepare("SELECT session_id, started_at, selector, session_slug, export_manifest_json, export_pending_json FROM meeting_transcript_sessions").all();
			for (const row of rows) {
				hasOversizedSessionSlugs ||= String(row.session_slug).length > 255;
				const selector = String(row.selector);
				const parsed = JSON.parse(String(row.export_manifest_json));
				if (isRecord(parsed)) {
					const ownership = {
						selector,
						sessionId: String(row.session_id),
						startedAt: String(row.started_at),
						manifest: parsed,
						pending: new Set(JSON.parse(String(row.export_pending_json)))
					};
					exportOwnership.set(selector, ownership);
					const foldedSelector = selector.toLowerCase();
					const foldedOwners = exportOwnershipByFoldedSelector.get(foldedSelector) ?? [];
					foldedOwners.push(ownership);
					exportOwnershipByFoldedSelector.set(foldedSelector, foldedOwners);
				}
			}
		}
		const pendingRow = tables.has("migration_sources") ? database.prepare("SELECT COUNT(*) AS count FROM migration_sources WHERE migration_kind = ? AND status = ? AND removed_source = 0").get("meeting-transcripts-files-v1", "imported") : void 0;
		return {
			exportOwnership,
			exportOwnershipByFoldedSelector,
			pendingImportCount: typeof pendingRow?.count === "number" ? pendingRow.count : 0,
			hasOversizedSessionSlugs
		};
	};
	if (params.artifactPreservingReadOnly) return withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(read, { env: params.env }) ?? empty();
	const databasePath = resolveOpenClawStateSqlitePath(params.env);
	if (!fs.existsSync(databasePath)) return empty();
	const database = openNodeSqliteDatabase(databasePath, { readOnly: true });
	try {
		return read({ db: database });
	} finally {
		database.close();
	}
}
//#endregion
//#region src/infra/state-migrations.meeting-transcripts-insert.ts
function insertMeetingTranscriptSnapshots(params) {
	runOpenClawStateWriteTransaction(({ db: database }) => {
		const db = migrationDb(database);
		recordLegacyMigrationRun(database, {
			runId: params.runId,
			startedAt: params.now,
			finishedAt: null,
			status: "imported",
			reportJson: JSON.stringify({
				format: "meeting-transcripts-files-v1",
				sessions: params.snapshots.length,
				utterances: params.snapshots.reduce((total, snapshot) => total + snapshot.utteranceCount, 0),
				archiveRoot: params.archiveRoot,
				canonicalRelativeDirs: params.canonicalRelativeDirs
			})
		});
		for (const snapshot of params.snapshots) {
			executeSqliteQuerySync(database, db.insertInto("meeting_transcript_sessions").values({
				session_id: snapshot.session.sessionId,
				started_at: snapshot.session.startedAt,
				selector: transcriptSessionSelector(snapshot.session),
				export_key: transcriptSessionExportKey(snapshot.session),
				session_slug: safeTranscriptPathSegment(snapshot.session.sessionId),
				provider_id: snapshot.session.source.providerId,
				title: snapshot.session.title ?? null,
				source_json: JSON.stringify(snapshot.session.source),
				stopped_at: snapshot.session.stoppedAt ?? null,
				metadata_json: snapshot.session.metadata ? JSON.stringify(snapshot.session.metadata) : null,
				export_manifest_json: "{}",
				export_pending_json: "[]",
				next_utterance_seq: snapshot.utteranceCount,
				created_at_ms: params.now,
				updated_at_ms: params.now
			}));
			if (snapshot.utteranceCount > 0) for (let start = 0; start < snapshot.utteranceCount; start += 64) {
				const chunk = readStagedMeetingTranscriptUtterances({
					stageDatabase: params.stageDatabase,
					stageKey: snapshot.stageKey,
					start,
					limit: 64
				});
				executeSqliteQuerySync(database, db.insertInto("meeting_transcript_utterances").values(chunk.map((utterance, offset) => ({
					session_id: snapshot.session.sessionId,
					session_started_at: snapshot.session.startedAt,
					sequence: start + offset,
					utterance_id: utterance.id ?? null,
					started_at: utterance.startedAt ?? null,
					ended_at: utterance.endedAt ?? null,
					speaker_id: utterance.speaker?.id ?? null,
					speaker_label: utterance.speaker?.label ?? null,
					text: utterance.text,
					final: utterance.final === void 0 ? null : utterance.final ? 1 : 0,
					metadata_json: utterance.metadata ? JSON.stringify(utterance.metadata) : null
				}))));
			}
			if (snapshot.summary !== void 0 || snapshot.markdown !== void 0) executeSqliteQuerySync(database, db.insertInto("meeting_transcript_summaries").values({
				session_id: snapshot.session.sessionId,
				session_started_at: snapshot.session.startedAt,
				generated_at: snapshot.summary?.generatedAt ?? null,
				summary_json: snapshot.summary ? JSON.stringify(snapshot.summary) : null,
				markdown: snapshot.markdown ?? null,
				utterance_count: snapshot.summary?.utteranceCount ?? snapshot.utteranceCount
			}));
			recordLegacyMigrationSource(database, {
				sourceKey: resolveLegacyMigrationSourceKey("meeting-transcripts", snapshot.sourceDir),
				migrationKind: "meeting-transcripts-files-v1",
				sourcePath: snapshot.sourceDir,
				targetTable: "meeting_transcript_sessions",
				sourceSha256: snapshot.sourceHash,
				sourceSizeBytes: snapshot.sourceSizeBytes,
				sourceRecordCount: snapshot.utteranceCount,
				runId: params.runId,
				status: "imported",
				importedAt: params.now,
				reportJson: JSON.stringify({ selector: transcriptSessionSelector(snapshot.session) }),
				upsert: true,
				updateReportOnConflict: false
			});
		}
	}, { env: {
		...params.env,
		OPENCLAW_STATE_DIR: params.stateDir
	} }, { operationLabel: "meeting-transcripts.legacy-import" });
}
//#endregion
//#region src/infra/state-migrations.meeting-transcripts-verify.ts
function storedUtteranceFromRow(row) {
	const utterance = {
		sessionId: row.session_id,
		text: row.text
	};
	if (row.utterance_id !== null) utterance.id = row.utterance_id;
	if (row.started_at !== null) utterance.startedAt = row.started_at;
	if (row.ended_at !== null) utterance.endedAt = row.ended_at;
	if (row.speaker_label !== null) {
		const speaker = { label: row.speaker_label };
		if (row.speaker_id !== null) speaker.id = row.speaker_id;
		utterance.speaker = speaker;
	}
	if (row.final !== null) utterance.final = row.final === 1;
	if (row.metadata_json) utterance.metadata = JSON.parse(row.metadata_json);
	return utterance;
}
async function verifyImportedMeetingTranscriptSnapshots(params) {
	const selectUtterances = params.database.prepare(`
    SELECT
      ended_at,
      final,
      metadata_json,
      session_id,
      speaker_id,
      speaker_label,
      started_at,
      text,
      utterance_id
    FROM meeting_transcript_utterances
    WHERE session_id = ? AND session_started_at = ?
    ORDER BY sequence ASC
    LIMIT ? OFFSET ?
  `);
	for (const snapshot of params.snapshots) {
		const session = await params.store.readSession(transcriptSessionSelector(snapshot.session));
		if (!session || stableStringify(session) !== stableStringify(snapshot.session)) throw new Error(`meeting transcript import verification failed: ${snapshot.relativeDir}`);
		for (let start = 0; start < snapshot.utteranceCount; start += 64) {
			const expected = readStagedMeetingTranscriptUtterances({
				stageDatabase: params.stageDatabase,
				stageKey: snapshot.stageKey,
				start,
				limit: 64
			});
			const actual = selectUtterances.all(snapshot.session.sessionId, snapshot.session.startedAt, 64, start).map((row) => storedUtteranceFromRow(row));
			if (stableStringify(actual) !== stableStringify(expected)) throw new Error(`meeting transcript import verification failed: ${snapshot.relativeDir}`);
		}
		const summary = await params.store.readSummary(session);
		if (stableStringify(summary.summary) !== stableStringify(snapshot.summary) || stableStringify(summary.markdown?.trimEnd()) !== stableStringify(snapshot.markdown?.trimEnd())) throw new Error(`meeting transcript summary verification failed: ${snapshot.relativeDir}`);
	}
}
//#endregion
//#region src/infra/state-migrations.meeting-transcripts.ts
function resolveArchiveRoot(sourceRoot, now) {
	const base = `${sourceRoot}.migrated-${new Date(now).toISOString().replace(/[:.]/g, "-")}`;
	return fs.existsSync(base) ? `${base}-${randomUUID()}` : base;
}
function rollbackImportedSnapshots(params) {
	runOpenClawStateWriteTransaction(({ db: database }) => {
		const db = migrationDb(database);
		for (const snapshot of params.snapshots) executeSqliteQuerySync(database, db.deleteFrom("meeting_transcript_sessions").where("session_id", "=", snapshot.session.sessionId).where("started_at", "=", snapshot.session.startedAt));
		executeSqliteQuerySync(database, db.deleteFrom("migration_sources").where("last_run_id", "=", params.runId));
		executeSqliteQuerySync(database, db.deleteFrom("migration_runs").where("id", "=", params.runId));
	}, { env: {
		...params.env,
		OPENCLAW_STATE_DIR: params.stateDir
	} }, { operationLabel: "meeting-transcripts.legacy-import.rollback" });
}
function finishPendingMigration(params) {
	runOpenClawStateWriteTransaction(({ db: database }) => {
		const db = migrationDb(database);
		executeSqliteQuerySync(database, db.updateTable("migration_sources").set({
			status: "archived",
			removed_source: 1
		}).where("last_run_id", "=", params.runId).where("migration_kind", "=", "meeting-transcripts-files-v1"));
		const run = executeSqliteQueryTakeFirstSync(database, db.selectFrom("migration_runs").select("report_json").where("id", "=", params.runId));
		const report = run ? JSON.parse(run.report_json) : {};
		executeSqliteQuerySync(database, db.updateTable("migration_runs").set({
			finished_at: params.now,
			status: "completed",
			report_json: JSON.stringify({
				...report,
				archiveRoot: params.archiveRoot
			})
		}).where("id", "=", params.runId));
	}, { env: {
		...params.env,
		OPENCLAW_STATE_DIR: params.stateDir
	} }, { operationLabel: "meeting-transcripts.legacy-import.finish" });
}
function isStrictRelativePathWithinRoot(root, relativePath) {
	if (!relativePath || relativePath === "." || path.isAbsolute(relativePath)) return false;
	const resolvedRoot = path.resolve(root);
	const resolvedPath = path.resolve(resolvedRoot, relativePath);
	const relative = path.relative(resolvedRoot, resolvedPath);
	return Boolean(relative && !relative.startsWith("..") && !path.isAbsolute(relative));
}
async function snapshotPendingImportRun(params) {
	const snapshots = [];
	let hashesMatch = true;
	for (const source of params.run.sources) {
		const relativeDir = path.relative(params.sourceRoot, source.sourcePath) || ".";
		if (relativeDir.startsWith("..") || path.isAbsolute(relativeDir)) throw new Error(`pending meeting transcript source escaped its root: ${source.sourcePath}`);
		const snapshot = await snapshotLegacyMeetingTranscriptSession({
			rootDir: params.snapshotRoot,
			relativeDir,
			stageDatabase: params.stageDatabase
		});
		snapshots.push(snapshot);
		hashesMatch &&= snapshot.sourceHash === source.sourceHash;
	}
	return {
		snapshots,
		hashesMatch
	};
}
function readPendingImportRuns(params) {
	const database = openOpenClawStateDatabase({ env: {
		...params.env,
		OPENCLAW_STATE_DIR: params.stateDir
	} });
	const db = migrationDb(database.db);
	const rows = executeSqliteQuerySync(database.db, db.selectFrom("migration_sources as source").innerJoin("migration_runs as run", "run.id", "source.last_run_id").select([
		"source.last_run_id as run_id",
		"source.source_path",
		"source.source_sha256",
		"run.report_json as run_report_json"
	]).where("source.migration_kind", "=", "meeting-transcripts-files-v1").where("source.status", "=", "imported").where("source.removed_source", "=", 0).orderBy("source.source_path", "asc")).rows;
	const runs = /* @__PURE__ */ new Map();
	for (const row of rows) {
		const report = JSON.parse(row.run_report_json);
		const format = report.format;
		const archiveRoot = report.archiveRoot;
		const canonicalRelativeDirs = report.canonicalRelativeDirs;
		if (typeof archiveRoot !== "string" || format !== "meeting-transcripts-files-v1" || !archiveRoot.startsWith(`${params.sourceRoot}.migrated-`) || !Array.isArray(canonicalRelativeDirs) || !canonicalRelativeDirs.every((relativeDir) => typeof relativeDir === "string" && isStrictRelativePathWithinRoot(params.sourceRoot, relativeDir)) || typeof row.source_sha256 !== "string") throw new Error(`invalid pending meeting transcript migration receipt: ${row.run_id}`);
		const run = runs.get(row.run_id) ?? {
			runId: row.run_id,
			archiveRoot,
			canonicalRelativeDirs,
			sources: []
		};
		if (run.archiveRoot !== archiveRoot || JSON.stringify(run.canonicalRelativeDirs) !== JSON.stringify(canonicalRelativeDirs)) throw new Error(`conflicting meeting transcript archive receipts: ${row.run_id}`);
		run.sources.push({
			sourcePath: row.source_path,
			sourceHash: row.source_sha256
		});
		runs.set(row.run_id, run);
	}
	return [...runs.values()];
}
async function listCanonicalMeetingTranscriptExportDirs(params) {
	const state = readMeetingTranscriptMigrationDetectionState({ env: params.env });
	return (await listLegacyMeetingTranscriptArtifactDirs(params.rootDir)).filter((relativeDir) => {
		const selector = relativeDir.split(path.sep).join("/");
		const sessionDir = path.join(params.rootDir, relativeDir);
		const ownership = resolveMeetingTranscriptExportOwnership({
			state,
			selector,
			sessionDir,
			sourceRoot: params.rootDir
		});
		return Boolean(ownership && isRecordedCanonicalTranscriptExport({
			sessionDir,
			manifest: ownership.manifest,
			pending: ownership.pending
		}));
	});
}
async function resumePendingImports(params) {
	const runs = readPendingImportRuns(params);
	if (runs.length === 0) return;
	const changes = [];
	const warnings = [];
	for (const run of runs) {
		if (fs.existsSync(run.archiveRoot)) {
			try {
				const archived = await snapshotPendingImportRun({
					run,
					snapshotRoot: run.archiveRoot,
					sourceRoot: params.sourceRoot,
					stageDatabase: params.stageDatabase
				});
				if (!archived.hashesMatch) throw new Error("archived source hashes do not match migration receipts");
				const database = openOpenClawStateDatabase({ env: {
					...params.env,
					OPENCLAW_STATE_DIR: params.stateDir
				} });
				await verifyImportedMeetingTranscriptSnapshots({
					store: params.store,
					snapshots: archived.snapshots,
					stageDatabase: params.stageDatabase,
					database: database.db
				});
				await restoreCanonicalMeetingTranscriptExports({
					sourceRoot: params.sourceRoot,
					archiveRoot: run.archiveRoot,
					migratedSourcePaths: run.sources.map((source) => source.sourcePath),
					canonicalRelativeDirs: run.canonicalRelativeDirs
				});
				finishPendingMigration({
					runId: run.runId,
					archiveRoot: run.archiveRoot,
					now: Date.now(),
					env: params.env,
					stateDir: params.stateDir
				});
				changes.push(`Finalized interrupted meeting transcript archive → ${run.archiveRoot}`);
			} catch (error) {
				warnings.push(`Pending meeting transcript migration ${run.runId} archive could not be verified or restored; left its rows and files for recovery: ${String(error)}`);
			}
			continue;
		}
		if (!fs.existsSync(params.sourceRoot)) {
			warnings.push(`Pending meeting transcript migration ${run.runId} has neither source tree nor archive`);
			continue;
		}
		const canonicalRelativeDirs = [.../* @__PURE__ */ new Set([...run.canonicalRelativeDirs, ...await listCanonicalMeetingTranscriptExportDirs({
			rootDir: params.sourceRoot,
			env: {
				...params.env,
				OPENCLAW_STATE_DIR: params.stateDir
			}
		})])];
		const expectedRelativeDirs = [.../* @__PURE__ */ new Set([...run.sources.map((source) => path.relative(params.sourceRoot, source.sourcePath) || "."), ...canonicalRelativeDirs])].toSorted((a, b) => a.localeCompare(b));
		const pending = await snapshotPendingImportRun({
			run,
			snapshotRoot: params.sourceRoot,
			sourceRoot: params.sourceRoot,
			stageDatabase: params.stageDatabase
		});
		if (!pending.hashesMatch) {
			warnings.push(`Pending meeting transcript migration ${run.runId} source tree changed; left its imported rows and files for manual recovery`);
			continue;
		}
		const database = openOpenClawStateDatabase({ env: {
			...params.env,
			OPENCLAW_STATE_DIR: params.stateDir
		} });
		await verifyImportedMeetingTranscriptSnapshots({
			store: params.store,
			snapshots: pending.snapshots,
			stageDatabase: params.stageDatabase,
			database: database.db
		});
		await archiveLegacyMeetingTranscriptSnapshots({
			sourceRoot: params.sourceRoot,
			snapshots: pending.snapshots,
			expectedRelativeDirs,
			canonicalRelativeDirs,
			archiveRoot: run.archiveRoot
		});
		finishPendingMigration({
			runId: run.runId,
			archiveRoot: run.archiveRoot,
			now: Date.now(),
			env: params.env,
			stateDir: params.stateDir
		});
		changes.push(`Resumed and archived meeting transcript migration → ${run.archiveRoot}`);
	}
	return {
		changes,
		warnings
	};
}
async function migrateLegacyMeetingTranscripts(params) {
	const detected = params.detected;
	if (!detected?.hasLegacy) return {
		changes: [],
		warnings: []
	};
	const env = params.env ?? process.env;
	let lock;
	try {
		lock = await acquireGatewayLock({
			allowInTests: true,
			env: {
				...env,
				OPENCLAW_STATE_DIR: params.stateDir
			},
			role: "sqlite-maintenance",
			timeoutMs: 5e3
		});
	} catch (error) {
		return {
			changes: [],
			warnings: [`Skipped meeting transcript migration because exclusive state ownership is unavailable: ${String(error)}`]
		};
	}
	if (!lock) return {
		changes: [],
		warnings: ["Skipped meeting transcript migration because exclusive state ownership is unavailable"]
	};
	let stageDatabase;
	let stagePath;
	const recoveryChanges = [];
	let result;
	try {
		result = await lock.run(async () => {
			fs.mkdirSync(params.stateDir, { recursive: true });
			stagePath = path.join(params.stateDir, `.meeting-transcripts-migration-${randomUUID()}.sqlite`);
			const stage = openLegacyMeetingTranscriptStage(stagePath);
			stageDatabase = stage;
			await validateMeetingTranscriptRoot(detected.sourceDir, { allowMissing: true });
			const databaseOptions = { env: {
				...env,
				OPENCLAW_STATE_DIR: params.stateDir
			} };
			ensureMeetingTranscriptsSchema(databaseOptions);
			const repaired = runOpenClawStateWriteTransaction(({ db: database }) => {
				const db = migrationDb(database);
				const rows = executeSqliteQuerySync(database, db.selectFrom("meeting_transcript_sessions").selectAll().where(({ fn, eb }) => eb(fn("length", ["session_slug"]), ">", 255)).orderBy("session_id")).rows;
				for (const row of rows) {
					const session = sessionFromRow(row);
					executeSqliteQuerySync(database, db.updateTable("meeting_transcript_sessions").set({
						selector: transcriptSessionSelector(session),
						session_slug: safeTranscriptPathSegment(session.sessionId),
						export_key: transcriptSessionExportKey(session)
					}).where("session_id", "=", row.session_id).where("started_at", "=", row.started_at));
				}
				return rows.length;
			}, databaseOptions, { operationLabel: "meeting-transcripts.oversized-projections" });
			if (repaired > 0) recoveryChanges.push(`Repaired ${repaired} oversized meeting transcript export name${repaired === 1 ? "" : "s"} in SQLite`);
			const store = new TranscriptsStore(detected.sourceDir, databaseOptions);
			const resumed = await resumePendingImports({
				env,
				stateDir: params.stateDir,
				sourceRoot: detected.sourceDir,
				store,
				stageDatabase: stage
			});
			if (resumed) return {
				changes: [...recoveryChanges, ...resumed.changes],
				warnings: resumed.warnings
			};
			const now = params.now?.() ?? Date.now();
			const relativeDirs = await listLegacyMeetingTranscriptArtifactDirs(detected.sourceDir);
			const sessionRelativeDirs = await listLegacyMeetingTranscriptSessionDirs(detected.sourceDir);
			const sessionRelativeDirSet = new Set(sessionRelativeDirs);
			const detectionState = readMeetingTranscriptMigrationDetectionState({ env: {
				...env,
				OPENCLAW_STATE_DIR: params.stateDir
			} });
			const legacyRelativeDirs = [];
			const partialRelativeDirs = [];
			const divergentExportDirs = [];
			for (const relativeDir of relativeDirs) {
				const ownership = resolveMeetingTranscriptExportOwnership({
					state: detectionState,
					selector: relativeDir.split(path.sep).join("/"),
					sessionDir: path.join(detected.sourceDir, relativeDir),
					sourceRoot: detected.sourceDir
				});
				if (ownership && isRecordedCanonicalTranscriptExport({
					sessionDir: path.join(detected.sourceDir, relativeDir),
					manifest: ownership.manifest,
					pending: ownership.pending
				})) continue;
				if (ownership) divergentExportDirs.push({
					relativeDir,
					ownerSelector: ownership.selector
				});
				else if (!sessionRelativeDirSet.has(relativeDir)) partialRelativeDirs.push(relativeDir);
				else legacyRelativeDirs.push(relativeDir);
			}
			const snapshots = [];
			for (const relativeDir of legacyRelativeDirs) snapshots.push(await snapshotLegacyMeetingTranscriptSession({
				rootDir: detected.sourceDir,
				relativeDir,
				stageDatabase: stage
			}));
			for (const snapshot of snapshots) {
				const database = openOpenClawStateDatabase(databaseOptions);
				if (executeSqliteQueryTakeFirstSync(database.db, migrationDb(database.db).selectFrom("meeting_transcript_sessions").select("session_id").where("session_id", "=", snapshot.session.sessionId).where("started_at", "=", snapshot.session.startedAt))) throw new Error(`legacy transcript conflicts with canonical SQLite state: ${snapshot.relativeDir}`);
			}
			if (divergentExportDirs.length > 0) {
				const recoveryRoot = `${detected.sourceDir}.exports-recovered-${new Date(now).toISOString().replace(/[:.]/g, "-")}`;
				for (const { relativeDir, ownerSelector } of divergentExportDirs) {
					const session = await store.readSession(ownerSelector);
					if (!session) throw new Error(`divergent transcript export has no SQLite owner: ${relativeDir}`);
					await archiveDivergentMeetingTranscriptExport({
						sourceRoot: detected.sourceDir,
						relativeDir,
						recoveryRoot
					});
					recoveryChanges.push(`Archived modified meeting transcript export ${relativeDir} → ${recoveryRoot}`);
					await store.materializeSessionArtifacts(session, "all");
				}
			}
			if (snapshots.length === 0 && partialRelativeDirs.length > 0) {
				const recoveryRoot = `${detected.sourceDir}.partials-recovered-${new Date(now).toISOString().replace(/[:.]/g, "-")}`;
				await archivePartialMeetingTranscriptArtifacts({
					sourceRoot: detected.sourceDir,
					relativeDirs: partialRelativeDirs,
					recoveryRoot
				});
				recoveryChanges.push(`Archived ${partialRelativeDirs.length} incomplete meeting transcript director${partialRelativeDirs.length === 1 ? "y" : "ies"} → ${recoveryRoot}`);
			}
			const expectedArchiveRelativeDirs = await listLegacyMeetingTranscriptSessionDirs(detected.sourceDir);
			if (snapshots.length === 0) return {
				changes: recoveryChanges,
				warnings: []
			};
			const runId = randomUUID();
			const archiveRoot = resolveArchiveRoot(detected.sourceDir, now);
			const canonicalRelativeDirs = await listCanonicalMeetingTranscriptExportDirs({
				rootDir: detected.sourceDir,
				env: {
					...env,
					OPENCLAW_STATE_DIR: params.stateDir
				}
			});
			insertMeetingTranscriptSnapshots({
				snapshots,
				runId,
				now,
				archiveRoot,
				canonicalRelativeDirs,
				stageDatabase: stage,
				env,
				stateDir: params.stateDir
			});
			try {
				await verifyImportedMeetingTranscriptSnapshots({
					store,
					snapshots,
					stageDatabase: stage,
					database: openOpenClawStateDatabase(databaseOptions).db
				});
				if (!await rehashLegacyMeetingTranscriptSnapshots(snapshots)) {
					rollbackImportedSnapshots({
						snapshots,
						runId,
						env,
						stateDir: params.stateDir
					});
					return {
						changes: recoveryChanges,
						warnings: ["Legacy meeting transcript files changed after import; rolled back SQLite rows and left every source in place for a Doctor retry"]
					};
				}
			} catch (error) {
				rollbackImportedSnapshots({
					snapshots,
					runId,
					env,
					stateDir: params.stateDir
				});
				throw error;
			}
			params.testHooks?.afterImport?.();
			let archiveRootAfterMove;
			try {
				archiveRootAfterMove = await archiveLegacyMeetingTranscriptSnapshots({
					sourceRoot: detected.sourceDir,
					snapshots,
					expectedRelativeDirs: expectedArchiveRelativeDirs,
					canonicalRelativeDirs,
					archiveRoot
				});
			} catch (error) {
				if (error instanceof LegacyMeetingTranscriptArchiveMovedError) return {
					changes: [...recoveryChanges, `Imported ${snapshots.length} meeting transcript session${snapshots.length === 1 ? "" : "s"} into shared SQLite state`],
					warnings: [`Meeting transcript archive needs Doctor resume after moving the source tree: ${String(error)}`]
				};
				rollbackImportedSnapshots({
					snapshots,
					runId,
					env,
					stateDir: params.stateDir
				});
				return {
					changes: recoveryChanges,
					warnings: [`Failed archiving verified legacy meeting transcripts; rolled back SQLite rows and left every source in place for Doctor retry: ${String(error)}`]
				};
			}
			params.testHooks?.afterArchive?.();
			finishPendingMigration({
				runId,
				archiveRoot: archiveRootAfterMove,
				now,
				env,
				stateDir: params.stateDir
			});
			const utteranceCount = snapshots.reduce((total, snapshot) => total + snapshot.utteranceCount, 0);
			return {
				changes: [
					...recoveryChanges,
					`Migrated ${snapshots.length} meeting transcript session${snapshots.length === 1 ? "" : "s"} and ${utteranceCount} utterance${utteranceCount === 1 ? "" : "s"} to shared SQLite state`,
					`Archived legacy meeting transcript files → ${archiveRootAfterMove}`
				],
				warnings: []
			};
		});
	} catch (error) {
		result = {
			changes: recoveryChanges,
			warnings: [`Failed migrating meeting transcripts: ${String(error)}`]
		};
	}
	const warnings = [...result.warnings, ...disposeLegacyMeetingTranscriptStage({
		database: stageDatabase,
		databasePath: stagePath
	})];
	let releaseError;
	try {
		await lock.release();
	} catch (error) {
		releaseError = error;
	}
	if (releaseError) warnings.push(`Meeting transcript migration lock release failed: ${formatErrorMessage(releaseError)}`);
	return {
		changes: result.changes,
		warnings,
		...result.warnings.length === 0 && !releaseError && warnings.length > 0 ? { warningDisposition: "recoverable" } : {}
	};
}
//#endregion
//#region src/infra/state-migrations.node-host.ts
const LEGACY_NODE_HOST_MAX_BYTES = 65536;
const CONFIG_KEYS = /* @__PURE__ */ new Set([
	"version",
	"nodeId",
	"token",
	"displayName",
	"gateway"
]);
const GATEWAY_KEYS = /* @__PURE__ */ new Set([
	"host",
	"port",
	"tls",
	"tlsFingerprint",
	"contextPath"
]);
/** Detect retired node-host state only when an explicit Doctor flow opts in. */
function detectLegacyNodeHostConfig(params) {
	const sourcePath = path.join(params.stateDir, LEGACY_NODE_HOST_CONFIG_FILE);
	return {
		sourcePath,
		hasLegacy: params.doctorOnlyStateMigrations === true && legacyMigrationSourceOrClaimMayExist(sourcePath, ".doctor-importing")
	};
}
function optionalLegacyString(value, label) {
	if (value === void 0) return;
	if (typeof value !== "string" || !value.trim()) throw new Error(`${label} must be a non-empty string`);
	return value.trim();
}
function optionalLegacyContextPath(value) {
	if (value === void 0) return;
	if (typeof value !== "string") throw new Error("legacy node-host gateway contextPath must be a string");
	return value.trim() || void 0;
}
function parseLegacyGateway(value) {
	if (value === void 0) return;
	if (!isRecord(value)) throw new Error("legacy node-host gateway must be an object");
	assertAllowedJsonFields(value, GATEWAY_KEYS, "legacy node-host gateway");
	const port = value.port;
	if (port !== void 0 && (typeof port !== "number" || !Number.isSafeInteger(port) || port <= 0 || port > 65535)) throw new Error("legacy node-host gateway port is invalid");
	if (value.tls !== void 0 && typeof value.tls !== "boolean") throw new Error("legacy node-host gateway tls must be a boolean");
	const gateway = {
		host: optionalLegacyString(value.host, "legacy node-host gateway host"),
		port,
		tls: value.tls,
		tlsFingerprint: optionalLegacyString(value.tlsFingerprint, "legacy node-host gateway tlsFingerprint"),
		contextPath: optionalLegacyContextPath(value.contextPath)
	};
	return Object.values(gateway).some((entry) => entry !== void 0) ? gateway : void 0;
}
function parseLegacyNodeHostConfig(snapshot) {
	const parsed = JSON.parse(snapshot.raw);
	if (!isRecord(parsed)) throw new Error("legacy node-host config must be an object");
	assertAllowedJsonFields(parsed, CONFIG_KEYS, "legacy node-host config");
	if (parsed.version !== 1) throw new Error("legacy node-host config version must be 1");
	if (typeof parsed.nodeId !== "string" || !parsed.nodeId.trim()) throw new Error("legacy node-host nodeId must be a non-empty string");
	if (parsed.token !== void 0 && typeof parsed.token !== "string") throw new Error("legacy node-host token must be a string when present");
	return {
		config: {
			version: 1,
			nodeId: parsed.nodeId.trim(),
			displayName: optionalLegacyString(parsed.displayName, "legacy node-host displayName"),
			gateway: parseLegacyGateway(parsed.gateway)
		},
		updatedAtMs: Math.max(0, Math.floor(snapshot.mtimeMs))
	};
}
function nullableNonEmptyString(value, label) {
	if (value === null || value === void 0) return;
	if (typeof value !== "string" || !value.trim()) throw new Error(`invalid node-host SQLite row: ${label} must not be empty`);
	return value.trim();
}
function rowToCanonicalState(row) {
	const value = JSON.parse(row.value_json);
	if (!isRecord(value) || value.version !== 1 || typeof value.nodeId !== "string" || !value.nodeId.trim()) throw new Error("invalid canonical node-host SQLite identity");
	if (!Number.isSafeInteger(row.updated_at_ms) || row.updated_at_ms < 0) throw new Error("invalid canonical node-host SQLite timestamp");
	const storedGateway = value.gateway;
	if (storedGateway !== void 0 && !isRecord(storedGateway)) throw new Error("invalid canonical node-host SQLite gateway");
	const gatewayPort = storedGateway?.port;
	if (gatewayPort !== void 0 && (typeof gatewayPort !== "number" || !Number.isSafeInteger(gatewayPort) || gatewayPort <= 0 || gatewayPort > 65535)) throw new Error("invalid canonical node-host SQLite gateway port");
	const gatewayTls = storedGateway?.tls;
	if (gatewayTls !== void 0 && typeof gatewayTls !== "boolean") throw new Error("invalid canonical node-host SQLite gateway tls");
	if (value.installedAppsSharing !== void 0 && typeof value.installedAppsSharing !== "boolean") throw new Error("invalid canonical node-host SQLite installed-app sharing");
	const cloudflareAccess = normalizeNodeHostCloudflareAccessConfig(storedGateway?.cloudflareAccess);
	const gateway = {
		host: nullableNonEmptyString(storedGateway?.host, "gateway_host"),
		port: typeof gatewayPort === "number" ? gatewayPort : void 0,
		tls: typeof gatewayTls === "boolean" ? gatewayTls : void 0,
		tlsFingerprint: nullableNonEmptyString(storedGateway?.tlsFingerprint, "gateway_tls_fingerprint"),
		contextPath: nullableNonEmptyString(storedGateway?.contextPath, "gateway_context_path"),
		...cloudflareAccess ? { cloudflareAccess } : {}
	};
	return {
		config: {
			version: 1,
			nodeId: value.nodeId.trim(),
			displayName: nullableNonEmptyString(value.displayName, "display_name"),
			gateway: Object.values(gateway).some((entry) => entry !== void 0) ? gateway : void 0,
			installedAppsSharing: value.installedAppsSharing === true
		},
		updatedAtMs: row.updated_at_ms
	};
}
function configsEqual(left, right) {
	return left.nodeId === right.nodeId && left.displayName === right.displayName && left.gateway?.host === right.gateway?.host && left.gateway?.port === right.gateway?.port && left.gateway?.tls === right.gateway?.tls && left.gateway?.tlsFingerprint === right.gateway?.tlsFingerprint && left.gateway?.contextPath === right.gateway?.contextPath && JSON.stringify(left.gateway?.cloudflareAccess) === JSON.stringify(right.gateway?.cloudflareAccess);
}
function writeCanonicalState(db, state) {
	const row = {
		state_key: NODE_HOST_CONFIG_KEY,
		value_json: JSON.stringify({
			...state.config,
			installedAppsSharing: state.config.installedAppsSharing ?? false
		}),
		updated_at_ms: state.updatedAtMs
	};
	const { state_key: _stateKey, ...updates } = row;
	executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("config_machine_state").values(row).onConflict((conflict) => conflict.column("state_key").doUpdateSet(updates)));
}
function migrateIntoDatabase$1(params) {
	let imported = false;
	let preservedCanonical = false;
	runOpenClawStateWriteTransaction(({ db }) => {
		const stateDb = getNodeSqliteKysely(db);
		const row = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("config_machine_state").selectAll().where("state_key", "=", NODE_HOST_CONFIG_KEY));
		const existing = row ? rowToCanonicalState(row) : null;
		if (existing && existing.config.nodeId !== params.legacy.config.nodeId) throw new Error("legacy node-host nodeId conflicts with canonical SQLite identity");
		let expected = params.legacy;
		if (existing) {
			if (configsEqual(existing.config, params.legacy.config)) expected = existing.updatedAtMs >= params.legacy.updatedAtMs ? existing : params.legacy;
			else if (existing.updatedAtMs === params.legacy.updatedAtMs) throw new Error("legacy node-host config diverges at the same timestamp");
			else if (existing.updatedAtMs > params.legacy.updatedAtMs) {
				expected = existing;
				preservedCanonical = true;
			}
		}
		if (!existing || !configsEqual(existing.config, expected.config) || existing.updatedAtMs !== expected.updatedAtMs) {
			if (expected === params.legacy && existing?.config.installedAppsSharing) expected = {
				...expected,
				config: {
					...expected.config,
					installedAppsSharing: true
				}
			};
			writeCanonicalState(db, expected);
			imported = expected.updatedAtMs === params.legacy.updatedAtMs;
		}
		const verifiedRow = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("config_machine_state").selectAll().where("state_key", "=", NODE_HOST_CONFIG_KEY));
		if (!verifiedRow) throw new Error("SQLite verification failed for node-host config");
		const verified = rowToCanonicalState(verifiedRow);
		if (!configsEqual(verified.config, expected.config) || verified.updatedAtMs !== expected.updatedAtMs) throw new Error("SQLite verification failed for node-host config");
	}, { env: params.env });
	return {
		imported,
		preservedCanonical
	};
}
async function migrateWithExclusiveStateOwnership$2(params) {
	if (!params.detected.hasLegacy) return {
		changes: [],
		warnings: []
	};
	const changes = [];
	const warnings = [];
	const notices = [];
	const sourcePath = params.detected.sourcePath;
	const source = new LegacyMigrationSourceClaim({
		stateRoot: params.stateRoot,
		stateDir: params.stateDir,
		sourcePath,
		label: "node-host",
		claimSuffix: LEGACY_NODE_HOST_CONFIG_CLAIM_SUFFIX,
		readSnapshot: (snapshotPath) => readLegacyMigrationSourceSnapshot({
			stateRoot: params.stateRoot,
			stateDir: params.stateDir,
			sourcePath: snapshotPath,
			maxBytes: LEGACY_NODE_HOST_MAX_BYTES,
			label: "node-host",
			hashDecodedText: true
		})
	});
	let snapshot;
	let legacy;
	try {
		await source.recover("interrupted node-host Doctor claim conflicts with its source");
		if (!await source.exists()) return {
			changes,
			warnings
		};
		snapshot = await source.read();
		legacy = parseLegacyNodeHostConfig(snapshot);
		params.beforeVerify?.();
		if (!legacyMigrationSourceSnapshotsMatch(await source.read(), snapshot)) throw new Error("legacy node-host source changed after Doctor loaded it");
	} catch (error) {
		warnings.push(`Failed reading legacy node-host state: ${String(error)}`);
		return {
			changes,
			warnings
		};
	}
	try {
		await source.claim({
			snapshot,
			mismatchMessage: "legacy node-host source changed before Doctor could claim it",
			beforeClaim: params.beforeClaim
		});
	} catch (error) {
		const restoreError = await source.restore();
		warnings.push(`Failed migrating legacy node-host state: ${String(error)}${restoreError ? `; restore failure: ${restoreError}` : ""}`);
		return {
			changes,
			warnings
		};
	}
	let result;
	try {
		result = migrateIntoDatabase$1({
			env: params.env,
			legacy
		});
	} catch (error) {
		const restoreError = await source.restore();
		warnings.push(`Failed migrating legacy node-host state: ${String(error)}${restoreError ? `; restore failure: ${restoreError}` : ""}`);
		return {
			changes,
			warnings
		};
	}
	try {
		await source.remove({
			removeSource: params.removeSource,
			sourceReappearedMessage: `legacy node-host source reappeared during import: ${sourcePath}`,
			remainingMessage: "legacy node-host source or Doctor claim remains after cleanup"
		});
	} catch (error) {
		warnings.push(`Node-host state is in SQLite, but legacy cleanup failed: ${String(error)}`);
		return {
			changes,
			warnings
		};
	}
	changes.push(result.preservedCanonical ? "Kept newer canonical node-host SQLite state." : result.imported ? "Migrated node-host config to shared SQLite state." : "Verified node-host config in shared SQLite state.");
	notices.push("Removed retired node.json after verified SQLite import.");
	return {
		changes,
		warnings,
		notices
	};
}
/** Import retired node-host state while excluding active Gateway/state maintenance owners. */
async function migrateLegacyNodeHostConfig(params) {
	if (!params.detected.hasLegacy) return {
		changes: [],
		warnings: []
	};
	return await withLegacyMigrationStateLock({
		stateDir: params.stateDir,
		env: params.env,
		label: "legacy node-host state",
		releaseLabel: "Node-host",
		errorLabel: "Failed reading legacy node-host state",
		retryGuidance: "Stop the Gateway and node host, then run `openclaw doctor --fix` again.",
		run: async (env) => {
			const stateRoot = await root(params.stateDir, {
				hardlinks: "reject",
				maxBytes: LEGACY_NODE_HOST_MAX_BYTES,
				symlinks: "reject"
			});
			return await migrateWithExclusiveStateOwnership$2({
				...params,
				env,
				stateRoot
			});
		}
	});
}
//#endregion
//#region src/infra/state-migrations.types.ts
const LEGACY_STATE_MIGRATION_PLAN_SCHEMA_VERSION = "openclaw.legacyStateMigrationPlan.v1";
//#endregion
//#region src/infra/state-migrations.plan.ts
function migrationStepPlan(step) {
	return {
		id: step.id,
		phase: step.phase,
		source: step.source,
		target: step.target,
		requiredness: step.requiredness,
		reversibility: step.reversibility,
		...step.refusal ? { refusal: step.refusal } : {}
	};
}
function createBlockedLegacyStateMigrationStepReceipts(params) {
	const originatingRefusal = params.blocker.originatingRefusal ?? (params.blocker.refusal && {
		stepId: params.blocker.id,
		...params.blocker.refusal
	});
	return params.steps.map((step) => {
		const message = `Migration step "${step.id}" was not run because prior step "${params.blocker.id}" refused execution.`;
		const independentRefusal = step.inspectRefusal?.();
		const receipt = {
			...migrationStepPlan(step),
			outcome: "refused",
			changes: [],
			warnings: independentRefusal ? [independentRefusal.message, message] : [message],
			refusal: independentRefusal ?? {
				code: "blocked-by-prior-refusal",
				message
			},
			...originatingRefusal ? { originatingRefusal: { ...originatingRefusal } } : {}
		};
		params.onStepReceipt?.(receipt);
		return receipt;
	});
}
function closeMigrationPlanTail(steps, blocker) {
	const blockerIndex = steps.indexOf(blocker);
	return steps.map((step, index) => {
		const plannedStep = migrationStepPlan(step);
		if (index > blockerIndex) plannedStep.refusal = {
			code: "blocked-by-prior-refusal",
			message: `Migration step "${step.id}" is blocked by prior refusal at "${blocker.id}".`
		};
		return plannedStep;
	});
}
function digest(value) {
	return `sha256:${createHash("sha256").update(stableStringify(value)).digest("hex")}`;
}
async function captureLegacyStateSnapshotIdentity(params) {
	const worker = resolveRuntimeProcessEntrypointUrl("stateMigrationSnapshot");
	const input = JSON.stringify(params);
	return new Promise((resolve) => {
		let result;
		let inputError;
		let failure = "Snapshot worker returned no result";
		const child = execFile(process.execPath, [...resolveRuntimeWorkerArgv(worker), "--openclaw-state-snapshot"], { encoding: "utf8" }, (error, stdout, stderr) => {
			if (error) {
				failure = `${formatErrorMessage(error)}${stderr ? `\n${stderr.trim()}` : ""}`;
				return;
			}
			try {
				const parsed = JSON.parse(stdout);
				if (!isRecord(parsed) || !Array.isArray(parsed.warnings) || !parsed.warnings.every((warning) => typeof warning === "string") || parsed.configDigest !== void 0 && typeof parsed.configDigest !== "string" || parsed.stateDigest !== void 0 && typeof parsed.stateDigest !== "string") throw new Error("Snapshot worker returned an invalid identity");
				result = {
					...typeof parsed.configDigest === "string" ? { configDigest: parsed.configDigest } : {},
					...typeof parsed.stateDigest === "string" ? { stateDigest: parsed.stateDigest } : {},
					warnings: parsed.warnings
				};
			} catch (parseError) {
				failure = formatErrorMessage(parseError);
			}
		});
		child.stdin?.once("error", (error) => {
			inputError = error;
		});
		child.stdin?.end(input);
		child.once("close", () => {
			if (inputError) {
				result = void 0;
				failure = `${failure}; writing snapshot input: ${formatErrorMessage(inputError)}`;
			}
			resolve(result ?? { warnings: [`Could not bind copied snapshot: ${failure}`] });
		});
	});
}
async function readLegacyStateMigrationPlanConfig(params) {
	const warnings = [];
	const logger = {
		error: (...values) => warnings.push(values.map(String).join(" ")),
		warn: (...values) => warnings.push(values.map(String).join(" "))
	};
	try {
		const { snapshot, writeOptions } = await createConfigIO({
			configPath: params.configPath,
			env: params.env,
			homedir: () => params.homeDir,
			logger,
			observe: false,
			pluginValidation: "core-only",
			shellEnvFallback: "defer"
		}).readConfigFileSnapshotForWrite();
		if (!snapshot.exists) warnings.push(`Snapshot config does not exist: ${params.configPath}`);
		warnings.push(...formatConfigIssueLines([
			...snapshot.issues,
			...snapshot.legacyIssues,
			...snapshot.warnings
		], "", { normalizeRoot: true }));
		const rootHash = hashConfigRaw(snapshot.raw);
		const configIncludedPaths = [...new Set(snapshot.includedPaths?.map((inputPath) => path.resolve(inputPath)) ?? [])].filter((includePath) => includePath !== path.resolve(snapshot.path)).toSorted();
		const includes = Object.entries(writeOptions.includeFileHashesForWrite ?? {}).map(([includePath, includeHash]) => ({
			path: path.resolve(includePath),
			hash: includeHash
		})).toSorted((left, right) => left.path.localeCompare(right.path));
		return {
			config: snapshot.sourceConfig,
			configDigest: digest({
				root: {
					path: path.resolve(snapshot.path),
					hash: rootHash
				},
				includes,
				inputPaths: [path.resolve(snapshot.path), ...configIncludedPaths],
				resolved: snapshot.sourceConfig
			}),
			configIncludedPaths,
			rootDigest: `sha256:${rootHash}`,
			configInputHashes: {
				root: rootHash,
				includes
			},
			warnings
		};
	} catch (error) {
		warnings.push(`Could not inspect snapshot config: ${formatErrorMessage(error)}`);
		return {
			config: {},
			configIncludedPaths: [],
			warnings
		};
	}
}
function normalizeEndpoint(endpoint) {
	return endpoint.kind === "owner" ? endpoint : {
		...endpoint,
		path: path.resolve(endpoint.path)
	};
}
function remapMigrationEndpointRoot(endpoint, sourceRoot, targetRoot) {
	if (endpoint.kind === "owner") return endpoint;
	const endpointPath = path.resolve(endpoint.path);
	const source = path.resolve(sourceRoot);
	if (endpointPath !== source && !isPathInside(source, endpointPath)) return endpoint;
	return {
		...endpoint,
		path: path.resolve(targetRoot, path.relative(source, endpointPath))
	};
}
function createLegacyStateMigrationCallerEnv(params) {
	const env = { ...params.env ?? process.env };
	for (const key of [
		"OPENCLAW_HOME",
		"OPENCLAW_OAUTH_DIR",
		"STATE_DIRECTORY"
	]) delete env[key];
	env.HOME = path.resolve(params.snapshot.homeDir);
	env.USERPROFILE = env.HOME;
	env.OPENCLAW_CONFIG_PATH = path.resolve(params.snapshot.configPath);
	return env;
}
function createLegacyStateMigrationPlanEnv(params) {
	const env = createLegacyStateMigrationCallerEnv(params);
	env.OPENCLAW_STATE_DIR = path.resolve(params.snapshot.stateDir);
	return env;
}
function createLegacyStateMigrationPlan(params) {
	const candidate = {
		root: path.resolve(params.candidate.root),
		version: params.candidate.version,
		artifact: {
			outcome: "deferred",
			refusal: {
				code: "candidate-artifact-digest-required",
				message: "Candidate artifact content identity must be supplied by the staged-candidate owner."
			}
		}
	};
	const snapshot = {
		homeDir: path.resolve(params.snapshot.homeDir),
		configPath: path.resolve(params.snapshot.configPath),
		stateDir: path.resolve(params.snapshot.stateDir),
		...params.snapshot.configDigest ? { configDigest: params.snapshot.configDigest } : {},
		...params.snapshot.stateDigest ? { stateDigest: params.snapshot.stateDigest } : {}
	};
	const stepIds = /* @__PURE__ */ new Set();
	const steps = params.steps.map((step) => {
		if (stepIds.has(step.id)) throw new Error(`duplicate legacy state migration step id: ${step.id}`);
		stepIds.add(step.id);
		return {
			...step,
			source: step.source.map(normalizeEndpoint),
			target: step.target.map(normalizeEndpoint),
			outcome: step.refusal !== void 0 ? "deferred" : step.requiredness === "not-required" ? "skipped" : "planned"
		};
	});
	const warnings = [...params.warnings ?? [], ...params.advisoryWarnings ?? []];
	const candidateRefusal = candidate.artifact.outcome === "deferred" ? candidate.artifact.refusal : void 0;
	const refusal = params.refusal ?? (params.warnings?.length ? {
		code: "migration-planning-warning",
		message: params.warnings.join("\n")
	} : candidateRefusal);
	const plan = {
		schemaVersion: LEGACY_STATE_MIGRATION_PLAN_SCHEMA_VERSION,
		mutationAllowed: false,
		outcome: refusal ? "refused" : "planned",
		warnings,
		...refusal ? { refusal } : {},
		mode: params.mode,
		candidate,
		snapshot,
		steps
	};
	return {
		...plan,
		planDigest: digest(plan)
	};
}
function refuseLegacyStateMigrationPlan(plan, refusal) {
	const { planDigest: _planDigest, ...unsignedPlan } = plan;
	const warnings = unsignedPlan.warnings.includes(refusal.message) ? unsignedPlan.warnings : [...unsignedPlan.warnings, refusal.message];
	return createLegacyStateMigrationPlan({
		mode: unsignedPlan.mode,
		candidate: unsignedPlan.candidate,
		snapshot: unsignedPlan.snapshot,
		steps: unsignedPlan.steps.map(({ outcome: _outcome, ...step }) => step),
		warnings,
		refusal
	});
}
//#endregion
//#region src/infra/state-migrations.prelude.ts
/** Ordered shared migration preparation and its frozen source endpoints. */
function buildUnresolvedBlockedPreludeSteps(mode, invocationPurpose) {
	return [
		...mode === "doctor" ? ["media-persistence"] : [],
		...invocationPurpose === "doctor" ? ["transcript-directives"] : [],
		...mode === "doctor" ? [
			"profile-workspace",
			"plugin-migration-preparation",
			"orphan-session-keys"
		] : []
	].map((id) => ({
		id,
		phase: "shared",
		source: [],
		target: [],
		requiredness: "conditional",
		reversibility: "checkpoint-required",
		run: () => ({
			changes: [],
			warnings: []
		})
	}));
}
function uniqueMigrationEndpoints(endpoints) {
	const seen = /* @__PURE__ */ new Set();
	return endpoints.filter((endpoint) => {
		const key = endpoint.kind === "owner" ? `owner\0${endpoint.id}` : `${endpoint.kind}\0${endpoint.path}`;
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}
function createDeferredPluginSessionStoreRefusal(endpoints) {
	return endpoints.length > 0 ? {
		code: "plugin-planning-deferred",
		message: "Plugin session migrations will be checked with the update."
	} : void 0;
}
function createConfigMigrationSources(configPath, includedPaths) {
	return uniqueMigrationEndpoints([configPath, ...includedPaths].map((inputPath) => ({
		kind: "path",
		path: path.resolve(inputPath)
	})));
}
function inspectOrphanSessionStoreEndpoints(params) {
	try {
		const paths = resolveAllAgentSessionStoreCandidateTargetsSync(params.config, {
			env: params.env,
			registeredDatabases: params.registeredDatabases
		}).map((target) => target.storePath);
		for (const agentId of params.pluginSessionStoreAgentIds) paths.push(resolveSessionStorePathCore(params.config.session?.store, {
			agentId,
			env: params.env
		}));
		return {
			endpoints: uniqueMigrationEndpoints(paths.filter((storePath) => !storePath.endsWith(".sqlite")).map((storePath) => ({
				kind: "path",
				path: storePath
			}))),
			warnings: []
		};
	} catch (error) {
		return {
			endpoints: [{
				kind: "owner",
				id: "core:session-store-targets"
			}],
			warnings: [`Could not inspect session migration targets: ${String(error)}`]
		};
	}
}
function buildLegacyStateMigrationPreludeSteps(params) {
	const stateEnv = {
		...params.env,
		OPENCLAW_STATE_DIR: params.stateDir
	};
	const stateDatabase = {
		kind: "sqlite",
		path: resolveOpenClawStateSqlitePath(stateEnv)
	};
	const configSources = createConfigMigrationSources(params.configPath, params.configIncludedPaths);
	const agentPersistence = uniqueMigrationEndpoints([
		stateDatabase,
		{
			kind: "path",
			path: path.join(params.stateDir, "agents")
		},
		...params.agentDatabaseTargets.map(({ path: databasePath }) => ({
			kind: "sqlite",
			path: databasePath
		}))
	]);
	const sharedStep = (id, source, target, run, refusal, requiredness = "conditional") => ({
		id,
		phase: "shared",
		source,
		target,
		requiredness,
		reversibility: "checkpoint-required",
		collectNotices: id === "profile-workspace",
		...refusal ? { refusal } : {},
		run
	});
	const agentMigrationOptions = {
		configuredAgentDatabaseTargets: params.agentDatabaseTargets,
		env: stateEnv,
		preparedDiscovery: params.agentDatabaseMigrationDiscovery
	};
	let preparedTargets;
	const steps = [];
	if (params.mode === "doctor") steps.push(sharedStep("media-persistence", agentPersistence, agentPersistence, () => migrateLegacyMediaPersistence({
		...agentMigrationOptions,
		onPreparedTargets: (targets) => {
			preparedTargets = targets;
		}
	})));
	if (params.invocationPurpose === "doctor") steps.push(sharedStep("transcript-directives", agentPersistence, agentPersistence, async () => {
		const { migrateHistoricalTranscriptDirectives } = await import("./state-migrations.transcript-directives-DHU6VC0M.mjs");
		return await migrateHistoricalTranscriptDirectives({
			...agentMigrationOptions,
			preparedTargets
		});
	}));
	if (params.mode !== "doctor") return steps;
	const profileParams = {
		config: params.config,
		env: params.env,
		homedir: params.homedir
	};
	const profileWorkspace = (params.readOnlyPlanning ? resolveLegacyProfileWorkspaceMigrationPaths : resolvePendingLegacyProfileWorkspaceMigrationPaths)(profileParams);
	const profileRefusal = profileWorkspace && params.readOnlyPlanning ? {
		code: "profile-workspace-snapshot-deferred",
		message: "Profile workspace migration is outside the bound state root and requires a separately bound snapshot."
	} : void 0;
	steps.push(sharedStep("profile-workspace", profileWorkspace ? [{
		kind: "path",
		path: profileWorkspace.source
	}] : [], profileWorkspace ? [{
		kind: "path",
		path: profileWorkspace.target
	}] : [], () => migrateLegacyProfileWorkspace(profileParams), profileRefusal, profileWorkspace ? "conditional" : "not-required"));
	if (params.pluginPreparation) steps.push(params.pluginPreparation);
	const orphanSessionStores = params.orphanSessionStores;
	if (!orphanSessionStores) {
		steps.push(...buildUnresolvedBlockedPreludeSteps(params.mode, params.invocationPurpose).filter((step) => step.id === "orphan-session-keys"));
		return steps;
	}
	const deferredPluginOwners = params.deferredPluginSessionStoreEndpoints ?? [];
	const orphanTargets = uniqueMigrationEndpoints([...orphanSessionStores.endpoints, ...deferredPluginOwners]);
	const pluginRefusal = orphanSessionStores.warnings.length > 0 ? {
		code: "session-target-discovery-failed",
		message: orphanSessionStores.warnings.join("\n")
	} : createDeferredPluginSessionStoreRefusal(deferredPluginOwners);
	steps.push(sharedStep("orphan-session-keys", uniqueMigrationEndpoints([...configSources, ...orphanTargets]), orphanTargets, () => orphanSessionStores.warnings.length > 0 ? {
		changes: [],
		warnings: orphanSessionStores.warnings
	} : migrateOrphanedSessionKeys({
		cfg: params.config,
		env: stateEnv,
		additionalAgentIds: params.pluginSessionStoreAgentIds,
		legacySessionSurfaces: params.legacySessionSurfaces
	}), pluginRefusal));
	return steps;
}
//#endregion
//#region src/infra/state-migrations.rescue-pending.ts
function resolveLegacyRescuePendingPaths(stateDir) {
	return ["crestodian", "openclaw"].map((owner) => path.join(stateDir, owner, "rescue-pending"));
}
function isSafeLegacyOwnerDirectory(stateDir, sourcePath) {
	const ownerPath = path.dirname(sourcePath);
	try {
		const owner = fs.lstatSync(ownerPath);
		return owner.isDirectory() && !owner.isSymbolicLink() && path.resolve(path.dirname(ownerPath)) === path.resolve(stateDir);
	} catch {
		return false;
	}
}
/** Detect retired security capabilities only during an explicit doctor run. */
function detectLegacyRescuePending(params) {
	const sourcePaths = resolveLegacyRescuePendingPaths(params.stateDir);
	return {
		sourcePaths,
		hasLegacy: params.doctorOnlyStateMigrations === true && sourcePaths.some((sourcePath) => fs.existsSync(sourcePath))
	};
}
/** Discard retired one-shot capabilities; importing them could reactivate stale writes. */
function discardLegacyRescuePending(params) {
	if (!params.detected.hasLegacy) return {
		changes: [],
		warnings: []
	};
	const removed = [];
	const warnings = [];
	for (const sourcePath of resolveLegacyRescuePendingPaths(params.stateDir)) {
		if (!fs.existsSync(sourcePath)) continue;
		if (!isSafeLegacyOwnerDirectory(params.stateDir, sourcePath)) {
			warnings.push(`Refused to remove retired rescue approvals through unsafe path ${sourcePath}`);
			continue;
		}
		try {
			fs.rmSync(sourcePath, {
				recursive: true,
				force: true
			});
			removed.push(sourcePath);
		} catch (error) {
			warnings.push(`Failed removing retired rescue approvals at ${sourcePath}: ${String(error)}`);
		}
	}
	return {
		changes: removed.length > 0 ? [`Discarded retired system-agent rescue approvals from ${removed.join(", ")}`] : [],
		warnings
	};
}
//#endregion
//#region src/infra/state-migrations.restart-sentinel.ts
const LEGACY_RESTART_SENTINEL_FILENAME = "restart-sentinel.json";
const DOCTOR_CLAIM_SUFFIX$1 = ".doctor-importing";
const MAX_LEGACY_RESTART_SENTINEL_BYTES = 4194304;
const MIGRATION_KIND$3 = "legacy-restart-sentinel-json";
const utf8Decoder$1 = new TextDecoder("utf-8", { fatal: true });
/** Detect the exact retired file for startup preflight and explicit Doctor alike. */
function detectLegacyRestartSentinel(params) {
	const sourcePath = path.join(params.stateDir, LEGACY_RESTART_SENTINEL_FILENAME);
	return {
		sourcePath,
		hasLegacy: legacyMigrationSourceOrClaimMayExist(sourcePath, DOCTOR_CLAIM_SUFFIX$1)
	};
}
function parseLegacyEnvelope(snapshot) {
	try {
		return parseRestartSentinelEnvelope(JSON.parse(utf8Decoder$1.decode(snapshot.buffer)));
	} catch {
		return null;
	}
}
function decideAndRecordMigration(params) {
	const sourceKey = resolveLegacyMigrationSourceKey("restart-sentinel-json", params.sourcePath);
	const runId = `${sourceKey}:${params.snapshot.sha256.slice(0, 16)}`;
	const now = Date.now();
	return runOpenClawStateWriteTransaction(({ db }) => {
		const receipt = readLegacyMigrationReceiptFromDatabase(db, sourceKey);
		const before = readRestartSentinelRowSync(db);
		let decision;
		if (receipt) decision = "receipt-authoritative";
		else if (!params.envelope) decision = "malformed-legacy-discarded";
		else if (before.kind === "valid") decision = "canonical-preserved";
		else {
			const written = writeRestartSentinelRowSync(db, params.envelope.payload);
			const verified = readRestartSentinelRowSync(db);
			if (verified.kind !== "valid" || verified.sentinel.revision !== written.revision || !isDeepStrictEqual(verified.sentinel.payload, params.envelope.payload)) throw new Error("SQLite verification failed for the restart sentinel migration");
			decision = before.kind === "invalid" ? "invalid-canonical-repaired" : "legacy-imported";
		}
		const reportJson = JSON.stringify({
			source: MIGRATION_KIND$3,
			target: "gateway_restart_sentinel",
			decision,
			sourceSha256: params.snapshot.sha256,
			sourceValid: params.envelope !== null,
			importedRecordCount: decision === "legacy-imported" || decision === "invalid-canonical-repaired" ? 1 : 0,
			preservedSqliteRecordCount: decision === "canonical-preserved" ? 1 : 0
		});
		recordLegacyMigrationReceipt(db, {
			sourceKey,
			migrationKind: MIGRATION_KIND$3,
			sourcePath: params.sourcePath,
			targetTable: "gateway_restart_sentinel",
			sourceSha256: params.snapshot.sha256,
			sourceSizeBytes: params.snapshot.size,
			sourceRecordCount: params.envelope ? 1 : 0,
			runId,
			now,
			reportJson,
			upsert: true
		});
		return {
			decision,
			sourceKey
		};
	}, { env: params.env });
}
async function recoverInterruptedClaim$1(params) {
	await params.source.recoverLinkedMove();
	if (!await params.source.exists(true)) return;
	if (!await params.source.exists()) {
		const restoreError = await params.source.restore();
		if (restoreError) throw new Error(restoreError);
		return;
	}
	if (!readLegacyMigrationReceipt(resolveLegacyMigrationSourceKey("restart-sentinel-json", params.source.sourcePath), params.env)) throw new Error("legacy restart sentinel source and interrupted claim both exist");
	await params.source.read(true);
	await params.source.remove({ skipSourceCheck: true });
}
function decisionChange(decision) {
	switch (decision) {
		case "legacy-imported": return "Imported the legacy restart sentinel into shared SQLite state.";
		case "invalid-canonical-repaired": return "Replaced an invalid SQLite restart sentinel with validated legacy state.";
		case "canonical-preserved": return "Preserved the canonical SQLite restart sentinel and discarded conflicting legacy JSON.";
		case "malformed-legacy-discarded": return "Discarded malformed retired restart sentinel JSON without importing it.";
		case "receipt-authoritative": return "Discarded recreated retired restart sentinel JSON using its migration receipt.";
	}
	return decision;
}
async function migrateWithExclusiveStateOwnership$1(params) {
	const changes = [];
	const warnings = [];
	const notices = [];
	const sourcePath = params.detected.sourcePath;
	const source = new LegacyMigrationSourceClaim({
		stateRoot: params.stateRoot,
		stateDir: params.stateDir,
		sourcePath,
		label: "restart sentinel",
		includeFilePath: false,
		claimSuffix: DOCTOR_CLAIM_SUFFIX$1,
		readSnapshot: (snapshotPath) => readLegacyMigrationSourceSnapshot({
			stateRoot: params.stateRoot,
			stateDir: params.stateDir,
			sourcePath: snapshotPath,
			maxBytes: MAX_LEGACY_RESTART_SENTINEL_BYTES,
			label: "restart sentinel"
		})
	});
	try {
		await recoverInterruptedClaim$1({
			source,
			env: params.env
		});
	} catch (error) {
		return {
			changes,
			warnings: [`Failed recovering a legacy restart sentinel Doctor claim: ${String(error)}`]
		};
	}
	if (!await source.exists()) return {
		changes,
		warnings
	};
	let snapshot;
	try {
		snapshot = await source.read();
	} catch (error) {
		return {
			changes,
			warnings: [`Failed reading the legacy restart sentinel: ${String(error)}`]
		};
	}
	const envelope = parseLegacyEnvelope(snapshot);
	try {
		params.beforeVerify?.();
		const current = await source.read();
		if (!legacyMigrationSourceSnapshotsMatch(current, snapshot)) throw new Error("legacy restart sentinel changed after migration loaded it");
		await source.claim({
			snapshot,
			mismatchMessage: "legacy restart sentinel changed before migration could claim it",
			beforeClaim: params.beforeClaim
		});
	} catch (error) {
		const restoreError = await source.restore();
		return {
			changes,
			warnings: [`Failed claiming the legacy restart sentinel: ${String(error)}${restoreError ? `; restore failure: ${restoreError}` : ""}`]
		};
	}
	let result;
	try {
		result = decideAndRecordMigration({
			env: params.env,
			sourcePath,
			snapshot,
			envelope
		});
	} catch (error) {
		const restoreError = await source.restore();
		return {
			changes,
			warnings: [`Failed migrating the legacy restart sentinel: ${String(error)}${restoreError ? `; restore failure: ${restoreError}` : ""}`]
		};
	}
	try {
		await source.remove({
			removeSource: params.removeSource,
			sourceReappearedMessage: "legacy restart sentinel reappeared during migration cleanup",
			remainingMessage: "legacy restart sentinel remains after migration cleanup"
		});
	} catch (error) {
		warnings.push(`Legacy restart sentinel cleanup failed: ${String(error)}`);
		return {
			changes,
			warnings
		};
	}
	try {
		markLegacyMigrationSourceRemoved(result.sourceKey, params.env);
	} catch (error) {
		warnings.push(`Legacy restart sentinel was removed, but its receipt could not be finalized: ${String(error)}`);
	}
	changes.push(decisionChange(result.decision));
	notices.push("Removed retired restart-sentinel.json after recording its migration decision.");
	return {
		changes,
		warnings,
		notices
	};
}
/** Import or retire the old file under exclusive state ownership. */
async function migrateLegacyRestartSentinel(params) {
	const detected = params.detected;
	if (!detected?.hasLegacy) return {
		changes: [],
		warnings: []
	};
	return await withLegacyMigrationStateLock({
		stateDir: params.stateDir,
		env: params.env,
		label: "the legacy restart sentinel",
		releaseLabel: "Restart sentinel",
		errorLabel: "Failed reading the legacy restart sentinel",
		retryGuidance: "Stop the Gateway, then run `openclaw doctor --fix` again.",
		run: async (env) => {
			const stateRoot = await root(params.stateDir, {
				hardlinks: "reject",
				maxBytes: MAX_LEGACY_RESTART_SENTINEL_BYTES,
				symlinks: "reject"
			});
			return await migrateWithExclusiveStateOwnership$1({
				...params,
				detected,
				env,
				stateRoot
			});
		}
	});
}
//#endregion
//#region src/infra/state-migrations.runtime-state.ts
const VOICEWAKE_TRIGGERS_STATE_KEY = "voicewake.triggers";
const VOICEWAKE_ROUTING_STATE_KEY = "voicewake.routing";
const DEFAULT_VOICEWAKE_TRIGGERS = [
	"openclaw",
	"claude",
	"computer"
];
function resolveLegacyVoiceWakeTriggersPath(stateDir) {
	return path.join(stateDir, "settings", "voicewake.json");
}
function resolveLegacyVoiceWakeRoutingPath(stateDir) {
	return path.join(stateDir, "settings", "voicewake-routing.json");
}
function readLegacyJsonObject(sourcePath) {
	return JSON.parse(fs.readFileSync(sourcePath, "utf8"));
}
/** Import and archive legacy JSON only after its synchronous SQLite commit succeeds. */
function migrateLegacyJsonState(params) {
	const changes = [];
	const warnings = [];
	if (!migrationFileExists(params.sourcePath)) return {
		changes,
		warnings
	};
	let value;
	try {
		value = params.normalize(readLegacyJsonObject(params.sourcePath));
	} catch (err) {
		const advisory = params.recoverableReadFailure?.(err);
		if (advisory) return {
			changes,
			warnings: [advisory],
			warningDisposition: "recoverable"
		};
		warnings.push(`Failed reading legacy ${params.label} ${params.sourcePath}: ${String(err)}`);
		return {
			changes,
			warnings
		};
	}
	if (params.shouldMigrate && !params.shouldMigrate(value)) return {
		changes,
		warnings
	};
	let outcome;
	try {
		outcome = runOpenClawStateWriteTransaction(({ db }) => params.migrate(db, value), { env: {
			...process.env,
			OPENCLAW_STATE_DIR: params.stateDir
		} });
	} catch (err) {
		warnings.push(`Failed migrating legacy ${params.label}: ${String(err)}`);
		return {
			changes,
			warnings
		};
	}
	changes.push(...outcome.changes);
	if (params.retire) params.retire({
		sourcePath: params.sourcePath,
		changes,
		warnings
	});
	else archiveLegacyImportSource({
		sourcePath: params.sourcePath,
		label: params.label,
		changes,
		warnings
	});
	return outcome.notices?.length ? {
		changes,
		warnings,
		notices: outcome.notices
	} : {
		changes,
		warnings
	};
}
function normalizeLegacyVoiceWakeTriggers(input) {
	const rec = input && typeof input === "object" ? input : {};
	const triggers = Array.isArray(rec.triggers) ? rec.triggers.flatMap((entry) => typeof entry === "string" ? [entry.trim()] : []).filter((entry) => entry.length > 0) : [];
	return triggers.length > 0 ? triggers : DEFAULT_VOICEWAKE_TRIGGERS;
}
function importLegacyVoiceWakeMachineState(database, key, value) {
	const db = getNodeSqliteKysely(database);
	const existing = executeSqliteQueryTakeFirstSync(database, db.selectFrom("config_machine_state").select("value_json").where("state_key", "=", key));
	if (existing) return {
		current: JSON.parse(existing.value_json),
		imported: false
	};
	executeSqliteQuerySync(database, db.insertInto("config_machine_state").values({
		state_key: key,
		value_json: JSON.stringify(value),
		updated_at_ms: Date.now()
	}));
	return {
		current: value,
		imported: true
	};
}
function migrateLegacyVoiceWakeSettings(params) {
	const triggerMigration = migrateLegacyJsonState({
		sourcePath: params.detected.triggersPath,
		stateDir: params.stateDir,
		label: "voice wake triggers",
		normalize: normalizeLegacyVoiceWakeTriggers,
		shouldMigrate: (triggers) => triggers.length > 0,
		migrate(db, triggers) {
			const imported = importLegacyVoiceWakeMachineState(db, VOICEWAKE_TRIGGERS_STATE_KEY, triggers);
			if (!imported.imported) return {
				changes: [],
				...JSON.stringify(imported.current) === JSON.stringify(triggers) ? {} : { notices: [`Kept shared SQLite voice wake triggers because legacy file differs: ${params.detected.triggersPath}`] }
			};
			return { changes: [`Migrated ${triggers.length} voice wake ${triggers.length === 1 ? "trigger" : "triggers"} → shared SQLite state`] };
		}
	});
	const routingMigration = migrateLegacyJsonState({
		sourcePath: params.detected.routingPath,
		stateDir: params.stateDir,
		label: "voice wake routing",
		normalize: normalizeVoiceWakeRoutingConfig,
		shouldMigrate: Boolean,
		migrate(db, routingConfig) {
			const imported = importLegacyVoiceWakeMachineState(db, VOICEWAKE_ROUTING_STATE_KEY, {
				...routingConfig,
				updatedAtMs: Date.now()
			});
			if (!imported.imported) {
				const existing = normalizeVoiceWakeRoutingConfig(imported.current);
				return {
					changes: [],
					...JSON.stringify(existing.defaultTarget) === JSON.stringify(routingConfig.defaultTarget) && JSON.stringify(existing.routes) === JSON.stringify(routingConfig.routes) ? {} : { notices: [`Kept shared SQLite voice wake routing because legacy file differs: ${params.detected.routingPath}`] }
				};
			}
			return { changes: [`Migrated voice wake routing config with ${routingConfig.routes.length} ${routingConfig.routes.length === 1 ? "route" : "routes"} → shared SQLite state`] };
		}
	});
	const changes = [...triggerMigration.changes, ...routingMigration.changes];
	const warnings = [...triggerMigration.warnings, ...routingMigration.warnings];
	const notices = [...triggerMigration.notices ?? [], ...routingMigration.notices ?? []];
	return notices.length > 0 ? {
		changes,
		warnings,
		notices
	} : {
		changes,
		warnings
	};
}
function resolveLegacyConfigHealthPath(stateDir) {
	return path.join(stateDir, "logs", "config-health.json");
}
function normalizeLegacyConfigHealthEntry(configPath, input) {
	if (!configPath.trim() || !input || typeof input !== "object" || Array.isArray(input)) return null;
	const entry = input;
	const lastKnownGoodJson = entry.lastKnownGood && typeof entry.lastKnownGood === "object" ? JSON.stringify(entry.lastKnownGood) : null;
	const lastPromotedGoodJson = entry.lastPromotedGood && typeof entry.lastPromotedGood === "object" ? JSON.stringify(entry.lastPromotedGood) : null;
	const lastObservedSuspiciousSignature = typeof entry.lastObservedSuspiciousSignature === "string" ? entry.lastObservedSuspiciousSignature : null;
	if (!lastKnownGoodJson && !lastPromotedGoodJson && !lastObservedSuspiciousSignature) return null;
	return {
		configPath,
		lastKnownGoodJson,
		lastPromotedGoodJson,
		lastObservedSuspiciousSignature
	};
}
function normalizeLegacyConfigHealthFile(input) {
	const entries = (input && typeof input === "object" ? input : {}).entries;
	if (!entries || typeof entries !== "object" || Array.isArray(entries)) return [];
	return Object.entries(entries).flatMap(([configPath, entry]) => {
		const normalized = normalizeLegacyConfigHealthEntry(configPath, entry);
		return normalized ? [normalized] : [];
	}).toSorted((a, b) => a.configPath.localeCompare(b.configPath));
}
function configHealthRow(entry) {
	return {
		config_path: entry.configPath,
		last_known_good_json: entry.lastKnownGoodJson,
		last_promoted_good_json: entry.lastPromotedGoodJson,
		last_observed_suspicious_signature: entry.lastObservedSuspiciousSignature,
		updated_at_ms: Date.now()
	};
}
function retireLegacyConfigHealthSource(params) {
	const archivedPath = `${params.sourcePath}.migrated`;
	if (!migrationFileExists(archivedPath)) {
		archiveLegacyImportSource({
			sourcePath: params.sourcePath,
			label: "config health state",
			changes: params.changes,
			warnings: params.warnings
		});
		return;
	}
	try {
		fs.rmSync(params.sourcePath, { force: true });
		params.changes.push("Removed regenerated config health legacy source");
	} catch (err) {
		params.warnings.push(`Failed removing regenerated config health legacy source: ${String(err)}`);
	}
}
function migrateLegacyConfigHealth(params) {
	return migrateLegacyJsonState({
		sourcePath: params.detected.sourcePath,
		stateDir: params.stateDir,
		label: "config health state",
		normalize: normalizeLegacyConfigHealthFile,
		retire: retireLegacyConfigHealthSource,
		migrate(db, entries) {
			const stateDb = getNodeSqliteKysely(db);
			const existing = executeSqliteQuerySync(db, stateDb.selectFrom("config_health_entries").select([
				"config_path",
				"last_known_good_json",
				"last_promoted_good_json",
				"last_observed_suspicious_signature"
			])).rows;
			const existingByPath = new Map(existing.map((row) => [row.config_path, row]));
			const entriesToInsert = [];
			let reconciledCount = 0;
			for (const entry of entries) {
				const existingEntry = existingByPath.get(entry.configPath);
				if (!existingEntry) {
					entriesToInsert.push(entry);
					continue;
				}
				const lastKnownGoodJson = existingEntry.last_known_good_json ?? entry.lastKnownGoodJson;
				const lastPromotedGoodJson = existingEntry.last_promoted_good_json ?? entry.lastPromotedGoodJson;
				if (lastKnownGoodJson === existingEntry.last_known_good_json && lastPromotedGoodJson === existingEntry.last_promoted_good_json) continue;
				executeSqliteQuerySync(db, stateDb.updateTable("config_health_entries").set({
					last_known_good_json: lastKnownGoodJson,
					last_promoted_good_json: lastPromotedGoodJson,
					updated_at_ms: Date.now()
				}).where("config_path", "=", entry.configPath));
				reconciledCount += 1;
			}
			if (entriesToInsert.length > 0) executeSqliteQuerySync(db, stateDb.insertInto("config_health_entries").values(entriesToInsert.map(configHealthRow)));
			const changes = [];
			if (entriesToInsert.length > 0) changes.push(`Migrated ${entriesToInsert.length} config health ${entriesToInsert.length === 1 ? "entry" : "entries"} → shared SQLite state`);
			if (reconciledCount > 0) changes.push(`Reconciled ${reconciledCount} config health ${reconciledCount === 1 ? "entry" : "entries"} → shared SQLite state`);
			return { changes };
		}
	});
}
function resolveLegacyPluginBindingApprovalsPath(env, homedir) {
	return path.join(resolveRequiredHomeDir(env, homedir), ".openclaw", "plugin-binding-approvals.json");
}
function pluginBindingApprovalScopeKey(entry) {
	return [
		entry.pluginRoot,
		normalizeLowercaseStringOrEmpty(entry.channel),
		entry.accountId
	].join("::");
}
function normalizeLegacyPluginBindingApprovalEntry(input) {
	const entry = input && typeof input === "object" ? input : {};
	const pluginRoot = typeof entry.pluginRoot === "string" ? entry.pluginRoot.trim() : "";
	const pluginId = typeof entry.pluginId === "string" ? entry.pluginId.trim() : "";
	const channel = typeof entry.channel === "string" ? normalizeLowercaseStringOrEmpty(entry.channel) : "";
	const accountId = typeof entry.accountId === "string" && entry.accountId.trim() ? entry.accountId.trim() : "default";
	if (!pluginRoot || !pluginId || !channel) return null;
	return {
		pluginRoot,
		pluginId,
		pluginName: typeof entry.pluginName === "string" ? entry.pluginName : void 0,
		channel,
		accountId,
		approvedAt: typeof entry.approvedAt === "number" && Number.isFinite(entry.approvedAt) ? Math.floor(entry.approvedAt) : Date.now()
	};
}
function normalizeLegacyPluginBindingApprovalsFile(input) {
	const file = input && typeof input === "object" ? input : {};
	if (file.version !== 1 || !Array.isArray(file.approvals)) return [];
	const approvals = /* @__PURE__ */ new Map();
	for (const item of file.approvals) {
		const entry = normalizeLegacyPluginBindingApprovalEntry(item);
		if (!entry) continue;
		approvals.set(pluginBindingApprovalScopeKey(entry), entry);
	}
	return [...approvals.values()].toSorted((a, b) => pluginBindingApprovalScopeKey(a).localeCompare(pluginBindingApprovalScopeKey(b)));
}
function pluginBindingApprovalRow(entry) {
	return {
		plugin_root: entry.pluginRoot,
		channel: entry.channel,
		account_id: entry.accountId,
		plugin_id: entry.pluginId,
		plugin_name: entry.pluginName ?? null,
		approved_at: entry.approvedAt
	};
}
function pluginBindingApprovalComparable(entry) {
	return JSON.stringify(pluginBindingApprovalRow(entry));
}
function migrateLegacyPluginBindingApprovals(params) {
	if (!params.detected.hasLegacy) return {
		changes: [],
		warnings: []
	};
	return migrateLegacyJsonState({
		sourcePath: params.detected.sourcePath,
		stateDir: params.stateDir,
		label: "plugin binding approvals",
		normalize: normalizeLegacyPluginBindingApprovalsFile,
		migrate(db, approvals) {
			const stateDb = getNodeSqliteKysely(db);
			const existing = executeSqliteQuerySync(db, stateDb.selectFrom("plugin_binding_approvals").select([
				"plugin_root",
				"channel",
				"account_id",
				"plugin_id",
				"plugin_name",
				"approved_at"
			])).rows;
			const existingByKey = new Map(existing.map((row) => [pluginBindingApprovalScopeKey({
				pluginRoot: row.plugin_root,
				channel: row.channel,
				accountId: row.account_id
			}), JSON.stringify(row)]));
			const approvalsToInsert = [];
			let conflictCount = 0;
			for (const approval of approvals) {
				const existingApprovalJson = existingByKey.get(pluginBindingApprovalScopeKey(approval));
				if (existingApprovalJson === void 0) approvalsToInsert.push(approval);
				else if (existingApprovalJson !== pluginBindingApprovalComparable(approval)) conflictCount += 1;
			}
			if (approvalsToInsert.length > 0) executeSqliteQuerySync(db, stateDb.insertInto("plugin_binding_approvals").values(approvalsToInsert.map(pluginBindingApprovalRow)));
			return {
				changes: approvalsToInsert.length > 0 ? [`Migrated ${approvalsToInsert.length} plugin binding ${approvalsToInsert.length === 1 ? "approval" : "approvals"} → shared SQLite state`] : [],
				...conflictCount > 0 ? { notices: [`Kept shared SQLite plugin binding approvals because ${conflictCount} ${conflictCount === 1 ? "legacy approval conflicts" : "legacy approvals conflict"}: ${params.detected.sourcePath}`] } : {}
			};
		}
	});
}
function resolveLegacyCurrentConversationBindingsPath(stateDir) {
	return path.join(stateDir, "bindings", "current-conversations.json");
}
function currentConversationBindingKey(ref) {
	const normalized = normalizeConversationRef(ref);
	return [
		normalized.channel,
		normalized.accountId,
		normalized.parentConversationId ?? "",
		normalized.conversationId
	].join("␟");
}
function normalizeLegacyCurrentConversationBindingRecord(input) {
	const record = input && typeof input === "object" ? input : {};
	if (!record.conversation?.conversationId) return null;
	const conversation = normalizeConversationRef(record.conversation);
	const targetSessionKey = typeof record.targetSessionKey === "string" ? record.targetSessionKey.trim() : "";
	if (!targetSessionKey) return null;
	const targetKind = record.targetKind === "subagent" ? "subagent" : "session";
	const status = record.status === "ending" || record.status === "ended" ? record.status : "active";
	const boundAt = typeof record.boundAt === "number" && Number.isFinite(record.boundAt) ? Math.floor(record.boundAt) : Date.now();
	const expiresAt = typeof record.expiresAt === "number" && Number.isFinite(record.expiresAt) ? Math.floor(record.expiresAt) : void 0;
	return {
		bindingId: `generic:${currentConversationBindingKey(conversation)}`,
		targetSessionKey,
		targetKind,
		conversation,
		status,
		boundAt,
		...expiresAt !== void 0 ? { expiresAt } : {},
		...record.metadata && typeof record.metadata === "object" && !Array.isArray(record.metadata) ? { metadata: record.metadata } : {}
	};
}
function normalizeLegacyCurrentConversationBindingFile(input) {
	const file = input && typeof input === "object" ? input : {};
	if (file.version !== 1 || !Array.isArray(file.bindings)) return [];
	const records = /* @__PURE__ */ new Map();
	for (const item of file.bindings) {
		const record = normalizeLegacyCurrentConversationBindingRecord(item);
		if (!record) continue;
		records.set(currentConversationBindingKey(record.conversation), record);
	}
	return [...records.values()].toSorted((a, b) => a.bindingId.localeCompare(b.bindingId));
}
function currentConversationBindingRow(record) {
	const conversation = normalizeConversationRef(record.conversation);
	return currentConversationBindingRow$1(record, conversation, currentConversationBindingKey(conversation));
}
function migrateLegacyCurrentConversationBindings(params) {
	return migrateLegacyJsonState({
		sourcePath: params.detected.sourcePath,
		stateDir: params.stateDir,
		label: "current-conversation bindings",
		normalize: normalizeLegacyCurrentConversationBindingFile,
		migrate(db, records) {
			const stateDb = getNodeSqliteKysely(db);
			const existing = executeSqliteQuerySync(db, stateDb.selectFrom("current_conversation_bindings").select(["binding_key", "record_json"])).rows;
			const existingByKey = new Map(existing.map((row) => [row.binding_key, row.record_json]));
			const recordsToInsert = [];
			let conflictCount = 0;
			for (const record of records) {
				const existingRecordJson = existingByKey.get(currentConversationBindingKey(record.conversation));
				if (existingRecordJson === void 0) recordsToInsert.push(record);
				else if (existingRecordJson !== JSON.stringify(record)) conflictCount += 1;
			}
			if (recordsToInsert.length > 0) executeSqliteQuerySync(db, stateDb.insertInto("current_conversation_bindings").values(recordsToInsert.map(currentConversationBindingRow)));
			return {
				changes: recordsToInsert.length > 0 ? [`Migrated ${recordsToInsert.length} current-conversation ${recordsToInsert.length === 1 ? "binding" : "bindings"} → shared SQLite state`] : [],
				...conflictCount > 0 ? { notices: [`Kept shared SQLite current-conversation bindings because ${conflictCount} ${conflictCount === 1 ? "legacy binding conflicts" : "legacy bindings conflict"}: ${params.detected.sourcePath}`] } : {}
			};
		}
	});
}
//#endregion
//#region src/infra/state-migrations.shared-auth-store.ts
/** Doctor-owned staged relocation of legacy shared auth rows into shared SQLite state. */
const MIGRATION_KIND$2 = "shared-auth-store-state-db";
const AUTH_JSON_MIGRATION_KIND = "auth-profile-json-to-sqlite-v2";
const SOURCE_STORE_KEY = "primary";
const TARGET_STORE_KEY = "shared";
function sourceMigrationKey(sourcePath, sourceTable) {
	return `shared-auth-store:${createHash("sha256").update(path.resolve(sourcePath)).update("\0").update(sourceTable).digest("hex")}`;
}
async function readSourceSnapshot(params) {
	if (inspectSharedAuthLegacySourceFile(params.sourcePath).status === "missing") return {
		rows: {
			store: null,
			state: null
		},
		size: null
	};
	try {
		const rows = runOpenClawAgentWriteTransaction(({ db }) => readSharedAuthLegacyRowsFromDatabase(db), {
			agentId: resolveAuthProfileDatabaseOwnerId(path.dirname(params.sourcePath)),
			path: params.sourcePath,
			env: params.env
		}, { operationLabel: "state-migration.shared-auth-source-read" });
		closeAuthProfileReadPool({
			kind: "database",
			databasePath: params.sourcePath
		});
		await closeOpenClawAgentDatabaseByPathAsync(params.sourcePath);
		return {
			rows,
			size: fs.statSync(params.sourcePath).size
		};
	} catch (error) {
		throw new SharedAuthStoreSourceInspectionError(params.sourcePath, "read", error);
	}
}
function readTargetRows(database) {
	const db = getNodeSqliteKysely(database);
	const cells = executeSqliteQuerySync(database, db.selectFrom("config_machine_state").select([
		"state_key",
		"value_json",
		"updated_at_ms"
	]).where("state_key", "in", ["authProfiles.store", "authProfiles.state"])).rows;
	const store = cells.find((cell) => cell.state_key === "authProfiles.store");
	const state = cells.find((cell) => cell.state_key === "authProfiles.state");
	return {
		store: store ? {
			store_json: store.value_json,
			updated_at: store.updated_at_ms
		} : null,
		state: state ? {
			state_json: state.value_json,
			updated_at: state.updated_at_ms
		} : null
	};
}
function rowDigest(row) {
	return createHash("sha256").update(JSON.stringify(row)).digest("hex");
}
function rowsMatch(left, right) {
	return JSON.stringify(left) === JSON.stringify(right);
}
function storeConflicts(sourceRow, targetRow) {
	const source = safeParseJsonRecord(sourceRow.store_json);
	const target = safeParseJsonRecord(targetRow.store_json);
	if (!source || !target || typeof source.version !== "number" || !Number.isFinite(source.version) || source.version <= 0 || !isRecord(source.profiles) || !isRecord(target.profiles)) return ["invalid credential payload"];
	const conflicts = isDeepStrictEqual({
		...source,
		profiles: target.profiles
	}, target) ? [] : ["store metadata differs"];
	for (const id of [.../* @__PURE__ */ new Set([...Object.keys(source.profiles), ...Object.keys(target.profiles)])].toSorted()) {
		const inSource = Object.hasOwn(source.profiles, id);
		const inTarget = Object.hasOwn(target.profiles, id);
		if (inSource && !isRecord(source.profiles[id]) || inTarget && !isRecord(target.profiles[id])) conflicts.push(`${JSON.stringify(id)}: malformed credential`);
		else if (inSource && !inTarget) conflicts.push(`${JSON.stringify(id)}: missing from target`);
		else if (inSource && !isDeepStrictEqual(source.profiles[id], target.profiles[id])) conflicts.push(`${JSON.stringify(id)}: credential differs`);
	}
	return conflicts;
}
function assertRowsMatch(expected, actual, label) {
	if (expected.store !== null && !rowsMatch(expected.store, actual.store) || expected.state !== null && !rowsMatch(expected.state, actual.state)) throw new Error(`shared auth relocation ${label} verification failed`);
}
function recordMigrationLedger(params) {
	const db = getNodeSqliteKysely(params.database);
	const entries = [{
		sourceTable: "auth_profile_store",
		targetTable: "auth_profile_stores",
		row: params.sourceRows.store
	}, {
		sourceTable: "auth_profile_state",
		targetTable: "auth_profile_state",
		row: params.sourceRows.state
	}].map((entry) => {
		const sourceKey = sourceMigrationKey(params.sourcePath, entry.sourceTable);
		const pending = entry.row ? void 0 : executeSqliteQueryTakeFirstSync(params.database, db.selectFrom("migration_sources").select([
			"source_sha256",
			"source_record_count",
			"source_size_bytes"
		]).where("source_key", "=", sourceKey).where("removed_source", "=", 0));
		return Object.assign(entry, {
			sourceKey,
			sourceSha256: pending?.source_sha256 ?? rowDigest(entry.row),
			sourceRecordCount: pending?.source_record_count ?? Number(entry.row !== null),
			sourceSizeBytes: pending?.source_size_bytes ?? params.sourceSize
		});
	});
	const runHash = createHash("sha256");
	for (const entry of entries) runHash.update(entry.sourceSha256);
	const runId = `shared-auth-store:${runHash.digest("hex").slice(0, 24)}`;
	recordLegacyMigrationRun(params.database, {
		runId,
		startedAt: params.now,
		finishedAt: params.stage === "completed" ? params.now : null,
		status: params.stage,
		reportJson: JSON.stringify({
			source: MIGRATION_KIND$2,
			target: "auth_profile_stores,auth_profile_state",
			stage: params.stage,
			importedRecordCount: entries.reduce((count, entry) => count + entry.sourceRecordCount, 0)
		}),
		upsert: true
	});
	for (const entry of entries) recordLegacyMigrationSource(params.database, {
		sourceKey: entry.sourceKey,
		migrationKind: MIGRATION_KIND$2,
		sourcePath: params.sourcePath,
		targetTable: entry.targetTable,
		sourceSha256: entry.sourceSha256,
		sourceSizeBytes: entry.sourceSizeBytes,
		sourceRecordCount: entry.sourceRecordCount,
		runId,
		status: params.stage,
		importedAt: params.now,
		reportJson: JSON.stringify({
			source: entry.sourceTable,
			target: entry.targetTable,
			stage: params.stage,
			sourceSha256: entry.sourceSha256,
			importedRecordCount: entry.sourceRecordCount
		}),
		upsert: true
	});
	if (params.stage === "completed") executeSqliteQuerySync(params.database, db.updateTable("migration_sources").set({ removed_source: 1 }).where("source_key", "in", entries.map((entry) => entry.sourceKey)));
}
function rewriteAuthJsonMigrationReceipts(database, sourceDatabasePath, targetDatabasePath) {
	const db = getNodeSqliteKysely(database);
	const receipts = executeSqliteQuerySync(database, db.selectFrom("migration_sources").select([
		"source_key",
		"last_run_id",
		"target_table",
		"report_json"
	]).where("migration_kind", "=", AUTH_JSON_MIGRATION_KIND)).rows;
	for (const receipt of receipts) {
		let report;
		try {
			report = JSON.parse(receipt.report_json);
		} catch {
			continue;
		}
		if (typeof report.targetDatabasePath !== "string" || path.resolve(report.targetDatabasePath) !== path.resolve(sourceDatabasePath) || receipt.target_table !== "auth_profile_store" && receipt.target_table !== "auth_profile_state") continue;
		const targetTable = receipt.target_table === "auth_profile_store" ? "auth_profile_stores" : "auth_profile_state";
		const reportJson = JSON.stringify({
			...report,
			relocatedFromDatabasePath: report.targetDatabasePath,
			targetDatabasePath,
			targetTable,
			targetStoreKey: TARGET_STORE_KEY
		});
		executeSqliteQuerySync(database, db.updateTable("migration_sources").set({
			target_table: targetTable,
			report_json: reportJson
		}).where("source_key", "=", receipt.source_key));
		executeSqliteQuerySync(database, db.updateTable("migration_runs").set({ report_json: reportJson }).where("id", "=", receipt.last_run_id));
	}
}
function copyRowsToState(params) {
	return runOpenClawStateWriteTransaction(({ db: database, path: targetDatabasePath }) => {
		const db = getNodeSqliteKysely(database);
		const target = readTargetRows(database);
		const conflicts = params.sourceRows.store && target.store && !rowsMatch(params.sourceRows.store, target.store) ? storeConflicts(params.sourceRows.store, target.store).map((detail) => `auth_profile_store[primary] -> config_machine_state[authProfiles.store]: ${detail}`) : [];
		if (params.sourceRows.state && target.state && !rowsMatch(params.sourceRows.state, target.state)) conflicts.push("auth_profile_state[primary] -> config_machine_state[authProfiles.state]: runtime state or timestamp differs");
		if (conflicts.length > 0) throw new Error(`shared auth rows conflict with the relocation target: ${conflicts.join("; ")}. Back up source ${JSON.stringify(params.sourcePath)} and target ${JSON.stringify(targetDatabasePath)} with OpenClaw stopped. Preserve target-only profiles, copy missing source profiles into the target, and reconcile differing entries/metadata/state locally; then rerun openclaw doctor --fix. No auth rows were changed.`);
		if (params.sourceRows.store && !target.store) executeSqliteQuerySync(database, db.insertInto("config_machine_state").values({
			state_key: "authProfiles.store",
			value_json: params.sourceRows.store.store_json,
			updated_at_ms: params.sourceRows.store.updated_at
		}));
		if (params.sourceRows.state && !target.state) executeSqliteQuerySync(database, db.insertInto("config_machine_state").values({
			state_key: "authProfiles.state",
			value_json: params.sourceRows.state.state_json,
			updated_at_ms: params.sourceRows.state.updated_at
		}));
		const canonicalRows = readTargetRows(database);
		assertRowsMatch({
			store: target.store ?? params.sourceRows.store,
			state: target.state ?? params.sourceRows.state
		}, canonicalRows, "copy");
		rewriteAuthJsonMigrationReceipts(database, params.sourcePath, targetDatabasePath);
		recordMigrationLedger({
			...params,
			database,
			stage: "copied"
		});
		return canonicalRows;
	}, { env: params.env }, { operationLabel: "state-migration.shared-auth-copy" });
}
function advanceMigration(params) {
	const flipping = params.stage === "ownership-flipped";
	const flipped = flipping && resolveSharedAuthStoreOwnership(params.env).location !== "state-db";
	runOpenClawStateWriteTransaction(({ db: database }) => {
		assertRowsMatch(params.rows, readTargetRows(database), params.stage);
		if (flipping) {
			const db = getNodeSqliteKysely(database);
			const ownership = {
				value_json: JSON.stringify({ location: "state-db" }),
				updated_at_ms: params.now
			};
			executeSqliteQuerySync(database, db.insertInto("config_machine_state").values({
				state_key: SHARED_AUTH_STORE_STATE_KEY,
				...ownership
			}).onConflict((conflict) => conflict.column("state_key").doUpdateSet(ownership)));
		}
		recordMigrationLedger({
			...params,
			database
		});
	}, { env: params.env }, { operationLabel: flipping ? "state-migration.shared-auth-ownership" : "state-migration.shared-auth-finalize" });
	if (flipping) noteCommittedSharedAuthStoreOwnership({ location: "state-db" }, params.env);
	return flipped;
}
async function cleanupSourceRows(params) {
	if (inspectSharedAuthLegacySourceFile(params.sourcePath).status === "missing") return false;
	try {
		const removed = runOpenClawAgentWriteTransaction(({ db: database }) => {
			const db = getNodeSqliteKysely(database);
			const before = readSharedAuthLegacyRowsFromDatabase(database);
			executeSqliteQuerySync(database, db.deleteFrom("auth_profile_store").where("store_key", "=", SOURCE_STORE_KEY));
			executeSqliteQuerySync(database, db.deleteFrom("auth_profile_state").where("state_key", "=", SOURCE_STORE_KEY));
			const after = readSharedAuthLegacyRowsFromDatabase(database);
			if (after.store || after.state) throw new Error("legacy shared auth rows remain after cleanup");
			return before.store !== null || before.state !== null;
		}, {
			agentId: resolveAuthProfileDatabaseOwnerId(path.dirname(params.sourcePath)),
			path: params.sourcePath,
			env: params.env
		}, { operationLabel: "state-migration.shared-auth-cleanup" });
		closeAuthProfileReadPool({
			kind: "database",
			databasePath: params.sourcePath
		});
		await closeOpenClawAgentDatabaseByPathAsync(params.sourcePath);
		return removed;
	} catch (error) {
		throw new SharedAuthStoreSourceInspectionError(params.sourcePath, "clean", error);
	}
}
/** Detect relocation or unfinished cleanup only in the explicit Doctor repair path. */
function detectSharedAuthStoreMigration(params) {
	const env = {
		...params.env ?? process.env,
		OPENCLAW_STATE_DIR: params.stateDir
	};
	const sourcePath = path.join(resolveSharedMainAuthAgentDir(env), "openclaw-agent.sqlite");
	if (params.doctorOnlyStateMigrations !== true) return {
		sourcePath,
		hasLegacy: false
	};
	if (fs.existsSync(sourcePath) && withArtifactPreservingStateReads(() => createRetainedAgentDatabaseMatcher(env, () => [])(sourcePath, "main"))) return {
		sourcePath,
		hasLegacy: true,
		held: true
	};
	const hasLegacy = (params.artifactPreservingReadOnly ? inspectSharedAuthStoreOwnership(env) : resolveSharedAuthStoreOwnership(env)).location === "legacy-main" || hasPendingSharedAuthCleanup(env, sourcePath, params);
	if (hasLegacy) inspectSharedAuthLegacyRowsReadOnly(sourcePath, params);
	return {
		sourcePath,
		hasLegacy
	};
}
/** Converge copy, ownership, and cleanup while excluding live Gateway writers. */
async function migrateSharedAuthStore(params) {
	if (!params.detected.hasLegacy) return {
		changes: [],
		warnings: []
	};
	if (params.detected.held) return {
		changes: [],
		warnings: [`Shared auth migration skipped: store held for agent main at ${sanitizeForLog(params.detected.sourcePath)}; run openclaw doctor --fix after restoring the agent.`],
		outcome: "skipped",
		warningDisposition: "recoverable"
	};
	return await withLegacyMigrationStateLock({
		stateDir: params.stateDir,
		env: params.env,
		label: "legacy shared auth store",
		releaseLabel: "Shared auth store",
		errorLabel: "Failed relocating the shared auth store",
		beforeRelease: async () => {
			try {
				closeAuthProfileReadPool({
					kind: "database",
					databasePath: params.detected.sourcePath
				});
			} finally {
				await closeOpenClawAgentDatabaseByPathAsync(params.detected.sourcePath);
			}
		},
		run: async (env) => {
			const now = params.now?.() ?? Date.now();
			const source = await readSourceSnapshot({
				env,
				sourcePath: params.detected.sourcePath
			});
			const snapshot = {
				env,
				sourcePath: params.detected.sourcePath,
				sourceSize: source.size,
				sourceRows: source.rows,
				now
			};
			const rows = copyRowsToState(snapshot);
			const ownershipFlipped = advanceMigration({
				...snapshot,
				rows,
				stage: "ownership-flipped"
			});
			const sourceCleaned = await cleanupSourceRows({
				env,
				sourcePath: params.detected.sourcePath
			});
			const relocatedRows = rows.store !== null || rows.state !== null || sourceCleaned;
			advanceMigration({
				...snapshot,
				rows,
				stage: "completed"
			});
			return {
				changes: [...ownershipFlipped && relocatedRows ? ["Relocated shared auth profiles into shared SQLite state."] : [], ...sourceCleaned && !ownershipFlipped ? ["Completed legacy shared auth row cleanup."] : []],
				warnings: [],
				...ownershipFlipped && rows.store !== null ? { notices: ["The main agent no longer owns shared credentials and can now be deleted."] } : {}
			};
		}
	});
}
//#endregion
//#region src/infra/state-migrations.state-schema.ts
function describeStateSchemaMigration(migration) {
	switch (migration.kind) {
		case "agent-databases-composite-primary-key": return "agent database registry primary key → agent_id,path";
		case "audit-events-v2": return "audit event ledger → versioned message lifecycle schema";
		case "commitments-retirement-v7": return "retired commitments storage → discarded rows, table, and indexes";
		case "worker-placement-execution-mode-v8": return "cloud worker placements → execution-mode claims";
		case "agent-databases-relative-paths-v9": return "agent database registry paths → state-relative storage";
		case "state-table-retirement-v10": return "retired shared-state tables → removed tables and indexes";
		case "state-table-retirement-v11": return "retired skill curator tables → removed tables and indexes";
		case "singleton-state-foldin-v12": return "singleton state tables → shared configuration state";
		case "state-consolidation-v13": return "cron jobs and subagent runs → canonical JSON storage";
		case "creator-namespace-v14": return "historical cron creators → unknown source attribution";
		case "conversation-binding-targets-v15": return "conversation bindings → exact target keys without agent/session projections";
		case "skill-workshop-directory-ownership-v16": return "Skill Workshop ownership → per-agent directory containment";
		case "prepared-worker-ownership-v17": return "prepared workers → one-use capacity and fixed workspace ownership";
		case "github-publication-requester-authority-v18": return "GitHub publication receipts → original requesting authority";
		case "operator-approvals-system-agent": return "operator approvals → OpenClaw system changes";
		case "session-watch-cursor-provenance-v4": return "session watch cursors → provenance column";
		case "strict-tables-v3": return "tables → SQLite STRICT typing";
	}
	return migration.kind;
}
function createStateSchemaMigrationStep(params) {
	const stateEnv = {
		...params.env,
		OPENCLAW_STATE_DIR: params.stateDir
	};
	const database = {
		kind: "sqlite",
		path: resolveOpenClawStateSqlitePath(stateEnv)
	};
	return {
		id: "state-schema",
		phase: "shared",
		source: [database],
		target: [database],
		requiredness: params.requiredness,
		reversibility: "checkpoint-required",
		run: async () => {
			const result = params.mode === "doctor" ? repairOpenClawStateDatabaseSchema({ env: stateEnv }) : repairOpenClawStateDatabaseSchemaIfNeeded({ env: stateEnv }, params.mode === "doctor-preparation" ? "doctor" : params.mode);
			await closeOpenClawStateDatabaseByPathAsync(database.path);
			return result;
		}
	};
}
//#endregion
//#region src/infra/state-migrations.subagent-registry-db.ts
const MIGRATION_KIND$1 = "legacy-subagent-registry-json";
/** Records the irreversible retirement decision before Doctor removes the claimed file. */
function recordLegacySubagentRegistryDiscard(params) {
	const sourceKey = `subagent-json:${createHash("sha256").update(params.sourcePath).digest("hex")}`;
	const now = Date.now();
	const runId = `${sourceKey}:${params.sourceSha256.slice(0, 16)}`;
	let decision = "retired-source-discarded";
	runOpenClawStateWriteTransaction(({ db }) => {
		if (readLegacyMigrationReceiptFromDatabase(db, sourceKey)) decision = "receipt-authoritative";
		const reportJson = JSON.stringify({
			source: MIGRATION_KIND$1,
			target: "subagent_runs",
			decision,
			sourceSha256: params.sourceSha256,
			importedRecordCount: 0,
			reason: "retired transient state is never imported into the canonical SQLite registry"
		});
		recordLegacyMigrationReceipt(db, {
			sourceKey,
			migrationKind: MIGRATION_KIND$1,
			sourcePath: params.sourcePath,
			targetTable: "subagent_runs",
			sourceSha256: params.sourceSha256,
			sourceSizeBytes: params.sourceSize,
			sourceRecordCount: null,
			runId,
			now,
			reportJson,
			upsert: true
		});
	}, { env: params.env });
	return {
		decision,
		sourceKey
	};
}
//#endregion
//#region src/infra/state-migrations.subagent-registry.ts
const LEGACY_SUBAGENT_REGISTRY_MAX_BYTES = 16777216;
const DOCTOR_CLAIM_SUFFIX = ".doctor-importing";
function resolveLegacySubagentRegistryPath(stateDir) {
	return path.join(stateDir, "subagents", "runs.json");
}
/** Detect retired subagent state only when an explicit Doctor flow opts in. */
function detectLegacySubagentRegistry(params) {
	const sourcePath = resolveLegacySubagentRegistryPath(params.stateDir);
	return {
		sourcePath,
		hasLegacy: params.doctorOnlyStateMigrations === true && legacyMigrationSourceOrClaimMayExist(sourcePath)
	};
}
async function recoverInterruptedClaim(params) {
	await params.source.recoverLinkedMove();
	if (!await params.source.exists(true)) return;
	const claimed = await params.source.read(true);
	if (!await params.source.exists()) {
		const restoreError = await params.source.restore();
		if (restoreError) throw new Error(restoreError);
		return;
	}
	await params.source.read();
	const result = recordLegacySubagentRegistryDiscard({
		env: params.env,
		sourcePath: params.source.sourcePath,
		sourceSha256: claimed.sha256,
		sourceSize: claimed.size
	});
	await params.source.remove({ skipSourceCheck: true });
	markLegacyMigrationSourceRemoved(result.sourceKey, params.env);
}
async function migrateWithExclusiveStateOwnership(params) {
	const changes = [];
	const warnings = [];
	const notices = [];
	const sourcePath = params.detected.sourcePath;
	const source = new LegacyMigrationSourceClaim({
		stateRoot: params.stateRoot,
		stateDir: params.stateDir,
		sourcePath,
		label: "subagent registry",
		claimSuffix: DOCTOR_CLAIM_SUFFIX,
		readSnapshot: (snapshotPath) => readLegacyMigrationSourceSnapshot({
			stateRoot: params.stateRoot,
			stateDir: params.stateDir,
			sourcePath: snapshotPath,
			maxBytes: LEGACY_SUBAGENT_REGISTRY_MAX_BYTES,
			label: "subagent registry"
		})
	});
	if (!params.detected.hasLegacy) return {
		changes,
		warnings
	};
	let snapshot;
	try {
		await recoverInterruptedClaim({
			source,
			env: params.env
		});
		if (!await source.exists()) return {
			changes,
			warnings
		};
		snapshot = await source.read();
	} catch (error) {
		warnings.push(`Failed reading legacy subagent registry: ${String(error)}`);
		return {
			changes,
			warnings
		};
	}
	try {
		params.beforeVerify?.();
		const current = await source.read();
		if (!legacyMigrationSourceSnapshotsMatch(current, snapshot)) throw new Error("legacy subagent registry changed after Doctor loaded it");
		await source.claim({
			snapshot,
			mismatchMessage: "legacy subagent registry changed before Doctor could claim it",
			beforeClaim: params.beforeClaim
		});
	} catch (error) {
		const restoreError = await source.restore();
		warnings.push(`Failed migrating legacy subagent registry: ${String(error)}${restoreError ? `; restore failure: ${restoreError}` : ""}`);
		return {
			changes,
			warnings
		};
	}
	let result;
	try {
		result = recordLegacySubagentRegistryDiscard({
			env: params.env,
			sourcePath: snapshot.sourcePath,
			sourceSha256: snapshot.sha256,
			sourceSize: snapshot.size
		});
	} catch (error) {
		const restoreError = await source.restore();
		warnings.push(`Failed migrating legacy subagent registry: ${String(error)}${restoreError ? `; restore failure: ${restoreError}` : ""}`);
		return {
			changes,
			warnings
		};
	}
	try {
		await source.remove({
			removeSource: params.removeSource,
			sourceReappearedMessage: `legacy subagent registry reappeared during retirement: ${sourcePath}`,
			sourceRemainingMessage: `legacy subagent registry reappeared during cleanup: ${sourcePath}`,
			claimRemainingMessage: `legacy subagent registry Doctor claim remains after cleanup: ${source.claimPath}`
		});
	} catch (error) {
		warnings.push(`Legacy subagent registry retirement cleanup failed: ${String(error)}`);
		return {
			changes,
			warnings
		};
	}
	try {
		markLegacyMigrationSourceRemoved(result.sourceKey, params.env);
	} catch (error) {
		warnings.push(`Legacy subagent registry was removed, but its receipt could not be finalized: ${String(error)}`);
	}
	changes.push(result.decision === "receipt-authoritative" ? "Discarded recreated retired subagent JSON without importing it." : "Discarded retired subagent JSON without importing transient run state.");
	notices.push("Removed retired subagents/runs.json after the discard decision was recorded.");
	return {
		changes,
		warnings,
		notices
	};
}
/** Discard retired transient state while excluding active Gateway owners. */
async function migrateLegacySubagentRegistry(params) {
	if (!params.detected.hasLegacy) return {
		changes: [],
		warnings: []
	};
	return await withLegacyMigrationStateLock({
		stateDir: params.stateDir,
		env: params.env,
		label: "legacy subagent registry",
		releaseLabel: "Subagent registry",
		errorLabel: "Failed reading legacy subagent registry",
		retryGuidance: "Stop the Gateway, then run `openclaw doctor --fix` again.",
		run: async (env) => {
			const stateRoot = await root(params.stateDir, {
				hardlinks: "reject",
				maxBytes: LEGACY_SUBAGENT_REGISTRY_MAX_BYTES,
				symlinks: "reject"
			});
			return await migrateWithExclusiveStateOwnership({
				...params,
				env,
				stateRoot
			});
		}
	});
}
//#endregion
//#region src/infra/state-migrations.tui-last-session.ts
const LEGACY_RECORD_KEYS = /* @__PURE__ */ new Set(["sessionKey", "updatedAt"]);
const TUI_LAST_SESSION_STATE_KEY_PREFIX = "tui.lastSession.";
function resolveLegacyTuiLastSessionPath(stateDir) {
	return path.join(stateDir, "tui", "last-session.json");
}
/** Detect retired TUI state only when an explicit doctor flow opts in. */
function detectLegacyTuiLastSessions(params) {
	const sourcePath = resolveLegacyTuiLastSessionPath(params.stateDir);
	return {
		sourcePath,
		hasLegacy: params.doctorOnlyStateMigrations === true && fs.existsSync(sourcePath)
	};
}
function readLegacySourceSnapshot(sourcePath) {
	return readLegacyMigrationSourceSnapshotSync({
		sourcePath,
		label: "TUI last-session",
		followSymlinks: true
	});
}
function assertLegacySourceUnchanged(sourcePath, expected) {
	assertLegacyMigrationSourceUnchanged({
		sourcePath,
		snapshot: expected,
		label: "TUI last-session",
		followSymlinks: true
	});
}
function isHeartbeatSessionKey(sessionKey) {
	return sessionKey.toLowerCase().endsWith(":heartbeat");
}
function parseLegacyTuiLastSessions(raw) {
	const parsed = JSON.parse(raw);
	if (!isRecord(parsed)) throw new Error("legacy TUI last-session store must be a JSON object");
	const records = [];
	for (const [scopeKey, value] of Object.entries(parsed)) {
		if (!scopeKey || scopeKey.trim() !== scopeKey) throw new Error("legacy TUI last-session store contains an invalid scope key");
		if (!isRecord(value)) throw new Error(`legacy TUI last-session record ${scopeKey} must be an object`);
		assertAllowedJsonFields(value, LEGACY_RECORD_KEYS, `legacy TUI last-session record ${scopeKey}`);
		const sessionKey = value.sessionKey;
		const updatedAt = value.updatedAt;
		if (typeof sessionKey !== "string" || !sessionKey || sessionKey.trim() !== sessionKey || sessionKey === "unknown") throw new Error(`legacy TUI last-session record ${scopeKey} has an invalid session key`);
		if (!Number.isSafeInteger(updatedAt) || updatedAt < 0) throw new Error(`legacy TUI last-session record ${scopeKey} has an invalid timestamp`);
		records.push({
			scopeKey,
			sessionKey,
			updatedAt
		});
	}
	return records;
}
function rowMatches(row, expected) {
	return row?.value_json === JSON.stringify(expected.sessionKey) && row.updated_at_ms === expected.updatedAt;
}
function readLegacyTuiSource(sourcePath) {
	try {
		const snapshot = readLegacySourceSnapshot(sourcePath);
		return {
			ok: true,
			snapshot,
			records: parseLegacyTuiLastSessions(snapshot.raw)
		};
	} catch (error) {
		return {
			ok: false,
			refusal: {
				code: "step-refused",
				message: `Failed reading legacy TUI last-session state ${sourcePath}: ${String(error)}`
			}
		};
	}
}
/** Report invalid input after an earlier refusal without admitting this owner's writes. */
function inspectLegacyTuiLastSessionRefusal(detected) {
	if (!detected.hasLegacy) return;
	const source = readLegacyTuiSource(detected.sourcePath);
	return source.ok ? void 0 : source.refusal;
}
/** Import, verify, and remove the retired JSON store during an explicit doctor repair. */
function migrateLegacyTuiLastSessions(params) {
	const changes = [];
	const warnings = [];
	const notices = [];
	if (!params.detected.hasLegacy) return {
		changes,
		warnings
	};
	const source = readLegacyTuiSource(params.detected.sourcePath);
	if (!source.ok) {
		warnings.push(source.refusal.message);
		return {
			changes,
			warnings
		};
	}
	const { snapshot, records } = source;
	const activeRecords = records.filter((record) => !isHeartbeatSessionKey(record.sessionKey));
	const discardedHeartbeatCount = records.length - activeRecords.length;
	const expectedRows = /* @__PURE__ */ new Map();
	let importedCount = 0;
	let supersededCount = 0;
	try {
		assertLegacySourceUnchanged(params.detected.sourcePath, snapshot);
		runOpenClawStateWriteTransaction(({ db }) => {
			const tuiDb = getNodeSqliteKysely(db);
			for (const record of activeRecords) {
				const stateKey = `${TUI_LAST_SESSION_STATE_KEY_PREFIX}${record.scopeKey}`;
				const existing = executeSqliteQueryTakeFirstSync(db, tuiDb.selectFrom("config_machine_state").select(["value_json", "updated_at_ms"]).where("state_key", "=", stateKey));
				if (!existing) {
					executeSqliteQuerySync(db, tuiDb.insertInto("config_machine_state").values({
						state_key: stateKey,
						value_json: JSON.stringify(record.sessionKey),
						updated_at_ms: record.updatedAt
					}));
					expectedRows.set(record.scopeKey, record);
					importedCount += 1;
					continue;
				}
				const existingSessionKey = JSON.parse(existing.value_json);
				if (existing.updated_at_ms === record.updatedAt) {
					if (existingSessionKey !== record.sessionKey) throw new Error(`scope ${record.scopeKey} has divergent JSON and SQLite pointers at the same timestamp`);
					expectedRows.set(record.scopeKey, record);
					continue;
				}
				if (existing.updated_at_ms > record.updatedAt) {
					expectedRows.set(record.scopeKey, {
						scopeKey: record.scopeKey,
						sessionKey: existingSessionKey,
						updatedAt: existing.updated_at_ms
					});
					supersededCount += 1;
					continue;
				}
				executeSqliteQuerySync(db, tuiDb.updateTable("config_machine_state").set({
					value_json: JSON.stringify(record.sessionKey),
					updated_at_ms: record.updatedAt
				}).where("state_key", "=", stateKey));
				expectedRows.set(record.scopeKey, record);
				importedCount += 1;
			}
		}, { env: {
			...process.env,
			OPENCLAW_STATE_DIR: params.stateDir
		} });
	} catch (error) {
		warnings.push(`Failed migrating legacy TUI last-session state: ${String(error)}`);
		return {
			changes,
			warnings
		};
	}
	try {
		params.beforeVerify?.();
		const database = openOpenClawStateDatabase({ env: {
			...process.env,
			OPENCLAW_STATE_DIR: params.stateDir
		} });
		const tuiDb = getNodeSqliteKysely(database.db);
		for (const expected of expectedRows.values()) if (!rowMatches(executeSqliteQueryTakeFirstSync(database.db, tuiDb.selectFrom("config_machine_state").select(["value_json", "updated_at_ms"]).where("state_key", "=", `${TUI_LAST_SESSION_STATE_KEY_PREFIX}${expected.scopeKey}`)), expected)) throw new Error(`SQLite verification failed for scope ${expected.scopeKey}`);
		assertLegacySourceUnchanged(params.detected.sourcePath, snapshot);
	} catch (error) {
		warnings.push(`Failed verifying legacy TUI last-session migration: ${String(error)}`);
		return {
			changes,
			warnings
		};
	}
	try {
		claimAndRemoveLegacyMigrationSource({
			sourcePath: params.detected.sourcePath,
			snapshot,
			label: "TUI last-session",
			followSymlinks: true,
			beforeClaim: params.beforeClaim,
			removeSource: params.removeSource
		});
	} catch (error) {
		warnings.push(`Migrated TUI last-session state but could not remove legacy source ${params.detected.sourcePath}: ${String(error)}`);
		return {
			changes,
			warnings
		};
	}
	if (importedCount > 0) changes.push(`Migrated ${importedCount} TUI last-session pointer(s) → shared SQLite state`);
	if (discardedHeartbeatCount > 0) changes.push(`Discarded ${discardedHeartbeatCount} legacy heartbeat TUI restore pointer(s)`);
	changes.push("Removed legacy TUI last-session JSON after SQLite verification");
	if (supersededCount > 0) notices.push(`Kept ${supersededCount} newer shared SQLite TUI last-session pointer(s) over legacy JSON`);
	return notices.length > 0 ? {
		changes,
		warnings,
		notices
	} : {
		changes,
		warnings
	};
}
//#endregion
//#region src/infra/state-migrations.update-check.ts
const UPDATE_CHECK_STATE_KEY = "update.checkState";
const UPDATE_CHECK_STATE_FIELDS = [
	"lastCheckedAt",
	"lastNotifiedVersion",
	"lastNotifiedTag",
	"lastAvailableVersion",
	"lastAvailableTag",
	"autoInstallId",
	"autoFirstSeenVersion",
	"autoFirstSeenTag",
	"autoFirstSeenAt",
	"autoLastAttemptVersion",
	"autoLastAttemptAt",
	"autoLastSuccessVersion",
	"autoLastSuccessAt"
];
function resolveLegacyUpdateCheckPath(stateDir) {
	return path.join(stateDir, "update-check.json");
}
function normalizeLegacyUpdateCheckState(input) {
	const record = input && typeof input === "object" ? input : {};
	return Object.fromEntries(UPDATE_CHECK_STATE_FIELDS.map((field) => {
		const value = record[field];
		return [field, typeof value === "string" && value.trim().length > 0 ? value : void 0];
	}));
}
function legacyUpdateCheckStateMatches(existing, state) {
	return UPDATE_CHECK_STATE_FIELDS.every((field) => state[field] === existing[field]);
}
function migrateLegacyUpdateCheckState(params) {
	return migrateLegacyJsonState({
		sourcePath: params.detected.sourcePath,
		stateDir: params.stateDir,
		label: "update-check state",
		normalize: normalizeLegacyUpdateCheckState,
		recoverableReadFailure(error) {
			return readConfigMachineState(UPDATE_CHECK_STATE_KEY, { env: {
				...process.env,
				OPENCLAW_STATE_DIR: params.stateDir
			} }) === void 0 ? void 0 : `Skipped unreadable legacy update-check state; kept canonical update timing. Run openclaw doctor --fix to retry. ${params.detected.sourcePath}: ${String(error)}`;
		},
		migrate(_db, state) {
			const options = { env: {
				...process.env,
				OPENCLAW_STATE_DIR: params.stateDir
			} };
			if (importConfigMachineState([[UPDATE_CHECK_STATE_KEY, state]], options).kept.length > 0) {
				const existing = readConfigMachineState(UPDATE_CHECK_STATE_KEY, options);
				return {
					changes: [],
					...existing && legacyUpdateCheckStateMatches(existing, state) ? {} : { notices: [`Kept shared SQLite update-check state because legacy cache differs: ${params.detected.sourcePath}`] }
				};
			}
			return { changes: ["Migrated update-check state → shared SQLite state"] };
		}
	});
}
//#endregion
//#region src/infra/state-migrations.web-push-parse.ts
const SUBSCRIPTION_STORE_KEYS = /* @__PURE__ */ new Set(["subscriptionsByEndpointHash"]);
const SUBSCRIPTION_KEYS = /* @__PURE__ */ new Set([
	"subscriptionId",
	"endpoint",
	"keys",
	"createdAtMs",
	"updatedAtMs"
]);
const PUSH_KEYS = /* @__PURE__ */ new Set(["p256dh", "auth"]);
const VAPID_KEYS = /* @__PURE__ */ new Set([
	"publicKey",
	"privateKey",
	"subject"
]);
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function parseLegacySubscriptions(raw) {
	const parsed = JSON.parse(raw);
	if (!isRecord(parsed) || !isRecord(parsed.subscriptionsByEndpointHash)) throw new Error("legacy Web Push subscriptions must be an object");
	assertAllowedJsonFields(parsed, SUBSCRIPTION_STORE_KEYS, "legacy Web Push subscriptions store");
	const subscriptions = /* @__PURE__ */ new Map();
	const subscriptionIds = /* @__PURE__ */ new Set();
	for (const [endpointHash, rawSubscription] of Object.entries(parsed.subscriptionsByEndpointHash)) {
		if (!isRecord(rawSubscription) || !isRecord(rawSubscription.keys)) throw new Error("legacy Web Push subscription is not an object");
		assertAllowedJsonFields(rawSubscription, SUBSCRIPTION_KEYS, "legacy Web Push subscription");
		assertAllowedJsonFields(rawSubscription.keys, PUSH_KEYS, "legacy Web Push subscription keys");
		const { subscriptionId, endpoint, createdAtMs, updatedAtMs } = rawSubscription;
		const p256dh = rawSubscription.keys.p256dh;
		const auth = rawSubscription.keys.auth;
		if (typeof subscriptionId !== "string" || !UUID_RE.test(subscriptionId) || typeof endpoint !== "string" || !isValidWebPushEndpoint(endpoint) || hashWebPushEndpoint(endpoint) !== endpointHash || !isValidWebPushKey(p256dh) || !isValidWebPushKey(auth) || typeof createdAtMs !== "number" || !Number.isSafeInteger(createdAtMs) || createdAtMs < 0 || typeof updatedAtMs !== "number" || !Number.isSafeInteger(updatedAtMs) || updatedAtMs < createdAtMs) throw new Error("legacy Web Push subscription is invalid");
		if (subscriptionIds.has(subscriptionId)) throw new Error("legacy Web Push subscriptions contain a duplicate subscription id");
		subscriptionIds.add(subscriptionId);
		subscriptions.set(endpointHash, {
			subscriptionId,
			endpoint,
			keys: {
				p256dh,
				auth
			},
			createdAtMs,
			updatedAtMs
		});
	}
	return subscriptions;
}
function parseLegacyVapidKeys(raw, env) {
	const parsed = JSON.parse(raw);
	if (!isRecord(parsed)) throw new Error("legacy Web Push VAPID keys must be an object");
	assertAllowedJsonFields(parsed, VAPID_KEYS, "legacy Web Push VAPID keys");
	if (parsed.subject !== void 0 && typeof parsed.subject !== "string") throw new Error("legacy Web Push VAPID keys are invalid");
	const subject = normalizeOptionalString(parsed.subject) ?? normalizeOptionalString(env.OPENCLAW_VAPID_SUBJECT) ?? "https://openclaw.ai";
	if (!isValidWebPushKey(parsed.publicKey) || !isValidWebPushKey(parsed.privateKey) || subject.length > 512) throw new Error("legacy Web Push VAPID keys are invalid");
	return createWebPushVapidKeyPair(parsed.publicKey, parsed.privateKey, subject);
}
//#endregion
//#region src/infra/state-migrations.web-push.ts
const LEGACY_SUBSCRIPTIONS_MAX_BYTES = 4194304;
const LEGACY_VAPID_KEYS_MAX_BYTES = 65536;
function resolveLegacyWebPushPaths(stateDir) {
	return {
		subscriptionsPath: path.join(stateDir, "push", "web-push-subscriptions.json"),
		vapidKeysPath: path.join(stateDir, "push", "vapid-keys.json")
	};
}
function detectLegacyWebPush(params) {
	const paths = resolveLegacyWebPushPaths(params.stateDir);
	return {
		...paths,
		hasLegacy: params.doctorOnlyStateMigrations === true && (legacyMigrationSourceOrClaimMayExist(paths.subscriptionsPath) || legacyMigrationSourceOrClaimMayExist(paths.vapidKeysPath))
	};
}
function createLegacySourceClaim$1(stateRoot, stateDir, sourcePath, maxBytes) {
	return new LegacyMigrationSourceClaim({
		stateRoot,
		stateDir,
		sourcePath,
		label: "Web Push",
		readSnapshot: (snapshotPath) => readLegacyMigrationSourceSnapshot({
			stateRoot,
			stateDir,
			sourcePath: snapshotPath,
			maxBytes,
			label: "Web Push",
			hashDecodedText: true
		})
	});
}
async function readLegacyState(stateRoot, stateDir, detected, env) {
	const subscriptionsSource = createLegacySourceClaim$1(stateRoot, stateDir, detected.subscriptionsPath, LEGACY_SUBSCRIPTIONS_MAX_BYTES);
	const vapidSource = createLegacySourceClaim$1(stateRoot, stateDir, detected.vapidKeysPath, LEGACY_VAPID_KEYS_MAX_BYTES);
	await subscriptionsSource.recover("interrupted Web Push doctor claim conflicts with its source");
	await vapidSource.recover("interrupted Web Push doctor claim conflicts with its source");
	const sources = [];
	let subscriptions = /* @__PURE__ */ new Map();
	let vapidKeys = null;
	if (await subscriptionsSource.exists()) {
		const snapshot = await subscriptionsSource.read();
		subscriptions = parseLegacySubscriptions(snapshot.raw);
		sources.push({
			claim: subscriptionsSource,
			snapshot
		});
	}
	if (await vapidSource.exists()) {
		const snapshot = await vapidSource.read();
		vapidKeys = parseLegacyVapidKeys(snapshot.raw, env);
		sources.push({
			claim: vapidSource,
			snapshot
		});
	}
	return {
		subscriptions,
		vapidKeys,
		sources
	};
}
async function assertSourcesUnchanged(sources) {
	for (const { claim, snapshot } of sources) if (!legacyMigrationSourceSnapshotsMatch(await claim.read(), snapshot)) throw new Error("legacy Web Push source changed after doctor loaded it");
}
function mergedSubscription(params) {
	const { existing, legacy } = params;
	const createdAtMs = Math.min(existing.createdAtMs, legacy.createdAtMs);
	if (existing.updatedAtMs === legacy.updatedAtMs) {
		const normalizedExisting = {
			...existing,
			createdAtMs
		};
		const normalizedLegacy = {
			...legacy,
			createdAtMs
		};
		if (!webPushSubscriptionsEqual(normalizedExisting, normalizedLegacy)) throw new Error("Web Push subscription diverges at the same timestamp");
		return normalizedExisting;
	}
	return {
		...existing.updatedAtMs > legacy.updatedAtMs ? existing : legacy,
		createdAtMs
	};
}
function findSubscriptionById(db, subscriptionId) {
	return executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("web_push_subscriptions").selectAll().where("subscription_id", "=", subscriptionId));
}
function writeSubscription(db, endpointHash, subscription) {
	const row = webPushSubscriptionToRow({
		endpointHash,
		subscription
	});
	executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("web_push_subscriptions").values(row).onConflict((conflict) => conflict.column("endpoint_hash").doUpdateSet({
		subscription_id: row.subscription_id,
		endpoint: row.endpoint,
		p256dh: row.p256dh,
		auth: row.auth,
		created_at_ms: row.created_at_ms,
		updated_at_ms: row.updated_at_ms
	})));
}
function migrateIntoDatabase(params) {
	let importedSubscriptions = 0;
	let importedVapidKeys = false;
	runOpenClawStateWriteTransaction(({ db }) => {
		ensureWebPushSubscriptionBindingColumns(db);
		const webPushDb = getNodeSqliteKysely(db);
		const expectedSubscriptions = /* @__PURE__ */ new Map();
		for (const [endpointHash, legacySubscription] of params.legacy.subscriptions) {
			const existingRow = executeSqliteQueryTakeFirstSync(db, webPushDb.selectFrom("web_push_subscriptions").selectAll().where("endpoint_hash", "=", endpointHash));
			if (existingRow && existingRow.endpoint !== legacySubscription.endpoint) throw new Error("Web Push endpoint hash collision during legacy import");
			const existing = existingRow ? webPushSubscriptionFromRow(existingRow) : null;
			const expected = existing ? mergedSubscription({
				existing,
				legacy: legacySubscription
			}) : legacySubscription;
			const conflictingIdRow = findSubscriptionById(db, expected.subscriptionId);
			if (conflictingIdRow && conflictingIdRow.endpoint_hash !== endpointHash) throw new Error("Web Push subscription id conflicts with another endpoint");
			if (!existing || !webPushSubscriptionsEqual(existing, expected)) {
				writeSubscription(db, endpointHash, expected);
				importedSubscriptions += 1;
			}
			expectedSubscriptions.set(endpointHash, expected);
		}
		let expectedVapidKeys = null;
		if (params.legacy.vapidKeys) {
			const existingVapidRow = executeSqliteQueryTakeFirstSync(db, webPushDb.selectFrom("config_machine_state").select("value_json").where("state_key", "=", WEB_PUSH_VAPID_STATE_KEY));
			if (existingVapidRow) {
				const existingVapidKeys = JSON.parse(existingVapidRow.value_json);
				if (existingVapidKeys.publicKey !== params.legacy.vapidKeys.publicKey || existingVapidKeys.privateKey !== params.legacy.vapidKeys.privateKey) throw new Error("legacy Web Push VAPID identity conflicts with SQLite");
				expectedVapidKeys = existingVapidKeys;
			} else {
				executeSqliteQuerySync(db, webPushDb.insertInto("config_machine_state").values({
					state_key: WEB_PUSH_VAPID_STATE_KEY,
					value_json: JSON.stringify(params.legacy.vapidKeys),
					updated_at_ms: params.nowMs
				}));
				expectedVapidKeys = params.legacy.vapidKeys;
				importedVapidKeys = true;
			}
		}
		for (const [endpointHash, expected] of expectedSubscriptions) {
			const row = executeSqliteQueryTakeFirstSync(db, webPushDb.selectFrom("web_push_subscriptions").selectAll().where("endpoint_hash", "=", endpointHash));
			if (!row || !webPushSubscriptionsEqual(webPushSubscriptionFromRow(row), expected)) throw new Error("SQLite verification failed for a Web Push subscription");
		}
		if (expectedVapidKeys) {
			const row = executeSqliteQueryTakeFirstSync(db, webPushDb.selectFrom("config_machine_state").select("value_json").where("state_key", "=", WEB_PUSH_VAPID_STATE_KEY));
			const persisted = row ? JSON.parse(row.value_json) : void 0;
			if (!persisted || persisted.publicKey !== expectedVapidKeys.publicKey || persisted.privateKey !== expectedVapidKeys.privateKey || persisted.subject !== expectedVapidKeys.subject) throw new Error("SQLite verification failed for the Web Push VAPID identity");
		}
	}, { env: {
		...process.env,
		OPENCLAW_STATE_DIR: params.stateDir
	} });
	return {
		importedSubscriptions,
		importedVapidKeys
	};
}
async function removeClaimedSources(params) {
	for (const claim of params.claimed) if (await claim.exists()) throw new Error(`legacy Web Push source reappeared during import: ${claim.sourcePath}`);
	for (const claim of params.claimed) await claim.remove({
		removeSource: params.removeSource,
		skipSourceCheck: true
	});
}
async function migrateLegacyWebPushWithExclusiveStateOwnership(params) {
	const changes = [];
	const warnings = [];
	const notices = [];
	if (!params.detected.hasLegacy) return {
		changes,
		warnings
	};
	let legacy;
	try {
		legacy = await readLegacyState(params.stateRoot, params.stateDir, params.detected, params.env);
	} catch (error) {
		warnings.push(`Failed reading legacy Web Push state: ${String(error)}`);
		return {
			changes,
			warnings
		};
	}
	let claimed;
	try {
		params.beforeVerify?.();
		await assertSourcesUnchanged(legacy.sources);
		await claimLegacyMigrationSourceClaims(legacy.sources, {
			beforeClaim: params.beforeClaim,
			mismatchMessage: "legacy Web Push source changed before doctor could claim it"
		});
		claimed = legacy.sources.map(({ claim }) => claim);
	} catch (error) {
		warnings.push(`Failed migrating legacy Web Push state: ${String(error)}`);
		return {
			changes,
			warnings
		};
	}
	let result;
	try {
		result = migrateIntoDatabase({
			stateDir: params.stateDir,
			legacy,
			nowMs: Date.now()
		});
	} catch (error) {
		const restoreErrors = await restoreLegacyMigrationSourceClaims(claimed);
		warnings.push(`Failed migrating legacy Web Push state: ${String(error)}${restoreErrors.length > 0 ? `; restore failures: ${restoreErrors.join("; ")}` : ""}`);
		return {
			changes,
			warnings
		};
	}
	try {
		await removeClaimedSources({
			claimed,
			removeSource: params.removeSource
		});
	} catch (error) {
		warnings.push(`Web Push state is in SQLite, but legacy cleanup failed: ${String(error)}`);
		return {
			changes,
			warnings
		};
	}
	changes.push(`Migrated ${result.importedSubscriptions} Web Push subscription${result.importedSubscriptions === 1 ? "" : "s"} to SQLite.`);
	if (result.importedVapidKeys) changes.push("Migrated the Web Push VAPID identity to SQLite.");
	notices.push("Removed retired Web Push JSON state after verified SQLite import.");
	return {
		changes,
		warnings,
		notices
	};
}
async function migrateLegacyWebPush(params) {
	if (!params.detected.hasLegacy) return {
		changes: [],
		warnings: []
	};
	return await withLegacyMigrationStateLock({
		stateDir: params.stateDir,
		env: params.env,
		label: "legacy Web Push state",
		releaseLabel: "Web Push",
		errorLabel: "Failed reading legacy Web Push state",
		run: async (env) => {
			const stateRoot = await root(params.stateDir, {
				hardlinks: "reject",
				maxBytes: LEGACY_SUBSCRIPTIONS_MAX_BYTES,
				symlinks: "reject"
			});
			return await migrateLegacyWebPushWithExclusiveStateOwnership({
				...params,
				env,
				stateRoot
			});
		}
	});
}
//#endregion
//#region src/infra/state-migrations.workspace-setup-files.ts
const SETUP_MAX_BYTES = 65536;
const CLAIM_SUFFIX$1 = WORKSPACE_DOCTOR_CLAIM_SUFFIX;
const utf8Decoder = new TextDecoder$1("utf-8", { fatal: true });
async function readBoundedRegularFile(params) {
	const opened = await params.sourceRoot.open(params.relativePath, {
		hardlinks: "reject",
		symlinks: "reject"
	});
	try {
		const before = opened.stat;
		if (!before.isFile() || before.nlink !== 1 || !Number.isSafeInteger(before.size) || before.size < 0 || before.size > params.maxBytes) throw new Error("legacy workspace source is not a safe regular file");
		const buffer = Buffer.alloc(before.size);
		const bytesRead = await readFileWindowFully(opened.handle, buffer, 0);
		if (bytesRead !== buffer.length) throw new Error("legacy workspace source ended unexpectedly");
		const after = await opened.handle.stat();
		if (!after.isFile() || after.nlink !== 1 || after.dev !== before.dev || after.ino !== before.ino || after.size !== before.size || after.mtimeMs !== before.mtimeMs || after.ctimeMs !== before.ctimeMs || bytesRead !== after.size) throw new Error("legacy workspace source changed while reading");
		let raw;
		try {
			raw = utf8Decoder.decode(buffer);
		} catch {
			throw new Error("legacy workspace source is not valid UTF-8");
		}
		return {
			sourcePath: params.sourcePath,
			dev: after.dev,
			ino: after.ino,
			mtimeMs: after.mtimeMs,
			sha256: createHash("sha256").update(buffer).digest("hex"),
			size: after.size,
			raw,
			buffer
		};
	} finally {
		await opened[Symbol.asyncDispose]();
	}
}
async function archiveWorkspaceSetupSource(sourceRoot, source, snapshot, existingArchivePath) {
	const archivePath = existingArchivePath ?? `${source.sourcePath}.migrated.${snapshot.sha256}.${randomUUID()}`;
	const relativePath = path.relative(source.rootDir, archivePath);
	if (!existingArchivePath) {
		const parent = await pinDirectory(await sourceRoot.resolve(path.dirname(relativePath)));
		try {
			await sourceRoot.create(relativePath, snapshot.buffer, {
				mode: 384,
				renameIdentity: "verify-content-with-lock"
			});
			const archive = await sourceRoot.open(relativePath, {
				hardlinks: "reject",
				symlinks: "reject"
			});
			try {
				await archive.handle.sync();
			} finally {
				await archive[Symbol.asyncDispose]();
			}
			requireDirectorySync(await parent.sync(), "Workspace setup archive directory");
		} finally {
			await parent.close();
		}
	}
	if ((await readBoundedRegularFile({
		sourceRoot,
		relativePath,
		sourcePath: archivePath,
		maxBytes: SETUP_MAX_BYTES
	})).sha256 !== snapshot.sha256) throw new Error(`workspace setup backup differs from the claimed source: ${archivePath}`);
	return archivePath;
}
function createLegacySourceClaim(sourceRoot, source) {
	return new LegacyMigrationSourceClaim({
		stateRoot: sourceRoot,
		stateDir: source.rootDir,
		sourcePath: source.sourcePath,
		label: "workspace",
		claimSuffix: CLAIM_SUFFIX$1,
		formatError: formatErrorMessage,
		readSnapshot: (sourcePath) => readBoundedRegularFile({
			sourceRoot,
			relativePath: sourcePath === source.sourcePath ? source.relativePath : `${source.relativePath}${CLAIM_SUFFIX$1}`,
			sourcePath,
			maxBytes: source.kind === "setup" ? SETUP_MAX_BYTES : LEGACY_WORKSPACE_ATTESTATION_MAX_BYTES
		})
	});
}
//#endregion
//#region src/infra/state-migrations.workspace-setup-store.ts
const MIGRATION_KIND = WORKSPACE_LEGACY_STATE_MIGRATION_KIND;
function parseIsoTimestamp(value, field) {
	if (value === void 0) return;
	if (typeof value !== "string" || value.length === 0) throw new Error(`legacy workspace setup ${field} is invalid`);
	const parsed = new Date(value);
	if (!Number.isFinite(parsed.getTime()) || parsed.toISOString() !== value) throw new Error(`legacy workspace setup ${field} is invalid`);
	return value;
}
function parseSetup(raw) {
	let value;
	try {
		value = JSON.parse(raw);
	} catch {
		throw new Error("legacy workspace setup contains invalid JSON");
	}
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("legacy workspace setup is not an object");
	const record = value;
	const allowed = /* @__PURE__ */ new Set([
		"version",
		"bootstrapSeededAt",
		"setupCompletedAt",
		"onboardingCompletedAt"
	]);
	if (Object.keys(record).some((key) => !allowed.has(key))) throw new Error("legacy workspace setup has an unexpected field");
	if (record.version !== void 0 && record.version !== 1) throw new Error("legacy workspace setup has an unsupported version");
	const bootstrapSeededAt = parseIsoTimestamp(record.bootstrapSeededAt, "bootstrap timestamp");
	const setupCompletedAt = parseIsoTimestamp(record.setupCompletedAt, "completion timestamp");
	const onboardingCompletedAt = parseIsoTimestamp(record.onboardingCompletedAt, "legacy completion timestamp");
	if (setupCompletedAt && onboardingCompletedAt && setupCompletedAt !== onboardingCompletedAt) throw new Error("legacy workspace setup has conflicting completion timestamps");
	const parsed = {
		...bootstrapSeededAt ? { bootstrapSeededAt } : {},
		...setupCompletedAt ?? onboardingCompletedAt ? { setupCompletedAt: setupCompletedAt ?? onboardingCompletedAt } : {}
	};
	return {
		kind: "setup",
		value: parsed,
		recordCount: Number(Boolean(parsed.bootstrapSeededAt)) + Number(Boolean(parsed.setupCompletedAt))
	};
}
function parseAttestation(snapshot) {
	const lines = snapshot.raw.split(/\r?\n/);
	if (lines.at(-1) === "") lines.pop();
	if (lines[0] !== "openclaw-workspace-attestation:v1" || lines.length < 2) throw new Error("legacy workspace attestation has an invalid header");
	parseIsoTimestamp(lines[1], "attestation timestamp");
	const generatedHashes = /* @__PURE__ */ new Map();
	for (const line of lines.slice(2)) {
		const match = /^generated:([^:]+):([a-f0-9]{64})$/.exec(line);
		if (!match?.[1] || !match[2] || !isSafeWorkspaceAttestationFilename(match[1])) throw new Error("legacy workspace attestation has an invalid generated hash");
		if (generatedHashes.has(match[1])) throw new Error("legacy workspace attestation has a duplicate generated hash");
		generatedHashes.set(match[1], match[2]);
	}
	const attestedAtMs = Math.trunc(snapshot.mtimeMs);
	if (!Number.isSafeInteger(attestedAtMs) || attestedAtMs < 0) throw new Error("legacy workspace attestation has an invalid modification time");
	return {
		kind: "attestation",
		value: {
			attestedAtMs,
			generatedHashes
		},
		recordCount: 1 + generatedHashes.size
	};
}
function parseSource(source, snapshot) {
	return source.kind === "setup" ? parseSetup(snapshot.raw) : parseAttestation(snapshot);
}
function mapsEqual(left, right) {
	if (left.size !== right.size) return false;
	for (const [key, value] of left) if (right.get(key) !== value) return false;
	return true;
}
function canonicalFingerprint(value) {
	return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}
function attestationFingerprint(params) {
	return canonicalFingerprint({
		kind: "attestation",
		attestedAtMs: params.attestedAtMs,
		generatedHashes: [...params.generatedHashes.entries()].toSorted(([left], [right]) => left.localeCompare(right))
	});
}
function receiptPreservesAuthority(receipt, expectedFingerprint) {
	const report = receipt ? safeParseJsonRecord(receipt.reportJson) : void 0;
	return report?.authoritative === true && report.canonicalFingerprint === expectedFingerprint;
}
function findMigrationAuthority(params) {
	const rows = executeSqliteQuerySync(params.db, params.kysely.selectFrom("migration_sources").select("report_json").where("migration_kind", "=", MIGRATION_KIND).where("target_table", "=", params.source.kind === "setup" ? "workspace_setup_state" : "workspace_attestations")).rows;
	let bestPriority = null;
	for (const row of rows) {
		if (!row.report_json) continue;
		try {
			const report = JSON.parse(row.report_json);
			if (report.workspaceKey !== params.source.workspaceKey || report.sourceKind !== params.source.kind || report.canonicalFingerprint !== params.fingerprint || report.authoritative !== true || typeof report.sourcePriority !== "number" || !Number.isSafeInteger(report.sourcePriority) || report.sourcePriority < 0) continue;
			bestPriority = bestPriority === null ? report.sourcePriority : Math.min(bestPriority, report.sourcePriority);
		} catch {}
	}
	return bestPriority === null ? null : { priority: bestPriority };
}
function canonicalCoversParsedSource(params) {
	const { db } = openOpenClawStateDatabase({ env: params.env });
	return runSqliteDeferredTransactionSync(db, () => {
		const kysely = getNodeSqliteKysely(db);
		if (params.source.kind === "setup" && params.parsed.kind === "setup") {
			const row = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("workspace_setup_state").selectAll().where("workspace_key", "=", params.source.workspaceKey));
			return row?.version === 1 && row.workspace_path === params.source.workspaceDir;
		}
		if (params.source.kind !== "attestation" || params.parsed.kind !== "attestation") return false;
		const row = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("workspace_setup_state").select("attested_at_ms").where("workspace_key", "=", params.source.workspaceKey));
		if (!row || row.attested_at_ms == null) return false;
		if (row.attested_at_ms > params.parsed.value.attestedAtMs) return true;
		if (row.attested_at_ms < params.parsed.value.attestedAtMs) return false;
		const hashes = new Map(executeSqliteQuerySync(db, kysely.selectFrom("workspace_generated_bootstrap_hashes").select(["filename", "sha256"]).where("workspace_key", "=", params.source.workspaceKey)).rows.map((hashRow) => [hashRow.filename, hashRow.sha256]));
		if (mapsEqual(hashes, params.parsed.value.generatedHashes)) return true;
		const fingerprint = attestationFingerprint({
			attestedAtMs: row.attested_at_ms,
			generatedHashes: hashes
		});
		const authority = findMigrationAuthority({
			db,
			kysely,
			source: params.source,
			fingerprint
		});
		return Boolean(authority && authority.priority <= params.source.priority);
	});
}
function importAndRecordReceipt(params) {
	const key = resolveWorkspaceMigrationSourceKey(params.source);
	const runId = `${key}:${params.snapshot.sha256.slice(0, 16)}`;
	const now = Date.now();
	return runOpenClawStateWriteTransaction((database) => {
		const { db } = database;
		const kysely = getNodeSqliteKysely(db);
		const existingReceipt = readLegacyMigrationReceiptFromDatabase(db, key);
		if (existingReceipt && (existingReceipt.sourceSha256 !== params.previousReceipt?.sha256 || existingReceipt.removedSource !== params.previousReceipt?.removedSource)) throw new Error("workspace migration receipt appeared concurrently; retry Doctor");
		let imported = false;
		const differences = [];
		let resolution;
		let verifiedFingerprint;
		if (params.parsed.kind === "setup") {
			if (!params.source.workspaceDir) throw new Error("legacy workspace setup has no workspace path");
			const existing = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("workspace_setup_state").selectAll().where("workspace_key", "=", params.source.workspaceKey));
			if (existing && existing.version != null) {
				if (existing.workspace_path !== params.source.workspaceDir || existing.version !== 1) throw new Error("legacy workspace setup conflicts with canonical SQLite state");
				const existingFingerprint = createWorkspaceSetupFingerprint(existing);
				for (const [milestone, canonical] of [["bootstrapSeededAt", existing.bootstrap_seeded_at], ["setupCompletedAt", existing.setup_completed_at]]) {
					const legacy = params.parsed.value[milestone];
					if (legacy !== void 0 && legacy !== canonical) differences.push(`${milestone} legacy=${JSON.stringify(legacy)} canonical=${JSON.stringify(canonical)}`);
				}
				resolution = differences.length > 0 ? "superseded" : "verified";
				verifiedFingerprint = existingFingerprint;
			} else {
				if (existing?.workspace_path != null && existing.workspace_path !== params.source.workspaceDir) throw new Error("legacy workspace setup conflicts with canonical SQLite state");
				const setupColumns = {
					workspace_path: params.source.workspaceDir,
					version: 1,
					bootstrap_seeded_at: params.parsed.value.bootstrapSeededAt ?? null,
					setup_completed_at: params.parsed.value.setupCompletedAt ?? null,
					updated_at: now
				};
				executeSqliteQuerySync(db, kysely.insertInto("workspace_setup_state").values({
					workspace_key: params.source.workspaceKey,
					...setupColumns
				}).onConflict((conflict) => conflict.column("workspace_key").doUpdateSet(setupColumns)));
				imported = true;
				resolution = existing ? "merged" : "inserted";
				verifiedFingerprint = createWorkspaceSetupFingerprint(setupColumns);
			}
			const verified = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("workspace_setup_state").selectAll().where("workspace_key", "=", params.source.workspaceKey));
			const actualFingerprint = verified && verified.workspace_path != null ? createWorkspaceSetupFingerprint(verified) : null;
			if (!verified || actualFingerprint !== verifiedFingerprint) throw new Error("SQLite verification failed for workspace setup state");
		} else {
			const parsedAttestation = params.parsed.value;
			const insertGeneratedHashes = () => {
				const hashes = [...parsedAttestation.generatedHashes.entries()].toSorted(([a], [b]) => a.localeCompare(b));
				if (hashes.length > 0) executeSqliteQuerySync(db, kysely.insertInto("workspace_generated_bootstrap_hashes").values(hashes.map(([filename, sha256]) => ({
					workspace_key: params.source.workspaceKey,
					filename,
					sha256
				}))));
			};
			const incomingFingerprint = attestationFingerprint({
				attestedAtMs: parsedAttestation.attestedAtMs,
				generatedHashes: parsedAttestation.generatedHashes
			});
			const existingRow = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("workspace_setup_state").selectAll().where("workspace_key", "=", params.source.workspaceKey));
			const existing = existingRow && existingRow.attested_at_ms != null ? { attested_at_ms: existingRow.attested_at_ms } : null;
			if (existing) {
				const rows = executeSqliteQuerySync(db, kysely.selectFrom("workspace_generated_bootstrap_hashes").select(["filename", "sha256"]).where("workspace_key", "=", params.source.workspaceKey)).rows;
				const existingHashes = new Map(rows.map((row) => [row.filename, row.sha256]));
				const existingFingerprint = attestationFingerprint({
					attestedAtMs: existing.attested_at_ms,
					generatedHashes: existingHashes
				});
				const replaceExistingAttestation = () => {
					executeSqliteQuerySync(db, kysely.updateTable("workspace_setup_state").set({
						attested_at_ms: parsedAttestation.attestedAtMs,
						attestation_updated_at_ms: now
					}).where("workspace_key", "=", params.source.workspaceKey));
					executeSqliteQuerySync(db, kysely.deleteFrom("workspace_generated_bootstrap_hashes").where("workspace_key", "=", params.source.workspaceKey));
					insertGeneratedHashes();
				};
				if (existing.attested_at_ms === parsedAttestation.attestedAtMs && mapsEqual(existingHashes, parsedAttestation.generatedHashes)) {
					resolution = "verified";
					verifiedFingerprint = existingFingerprint;
				} else if (existing.attested_at_ms > parsedAttestation.attestedAtMs) {
					resolution = "superseded";
					verifiedFingerprint = existingFingerprint;
				} else if (existing.attested_at_ms === parsedAttestation.attestedAtMs) {
					const authority = findMigrationAuthority({
						db,
						kysely,
						source: params.source,
						fingerprint: existingFingerprint
					});
					if (!authority) throw new Error("legacy workspace attestation conflicts with canonical SQLite state");
					if (params.source.priority < authority.priority) {
						replaceExistingAttestation();
						imported = true;
						resolution = "replaced";
						verifiedFingerprint = incomingFingerprint;
					} else {
						resolution = "superseded";
						verifiedFingerprint = existingFingerprint;
					}
				} else {
					replaceExistingAttestation();
					imported = true;
					resolution = "replaced";
					verifiedFingerprint = incomingFingerprint;
				}
			} else {
				executeSqliteQuerySync(db, kysely.insertInto("workspace_setup_state").values({
					workspace_key: params.source.workspaceKey,
					workspace_path: params.source.workspaceDir ?? null,
					attested_at_ms: parsedAttestation.attestedAtMs,
					attestation_updated_at_ms: now
				}).onConflict((conflict) => conflict.column("workspace_key").doUpdateSet({
					attested_at_ms: parsedAttestation.attestedAtMs,
					attestation_updated_at_ms: now
				})));
				insertGeneratedHashes();
				imported = true;
				resolution = "inserted";
				verifiedFingerprint = incomingFingerprint;
			}
			const verifiedRow = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("workspace_setup_state").select("attested_at_ms").where("workspace_key", "=", params.source.workspaceKey));
			const verified = verifiedRow && verifiedRow.attested_at_ms != null ? { attested_at_ms: verifiedRow.attested_at_ms } : null;
			const verifiedHashes = new Map(executeSqliteQuerySync(db, kysely.selectFrom("workspace_generated_bootstrap_hashes").select(["filename", "sha256"]).where("workspace_key", "=", params.source.workspaceKey)).rows.map((row) => [row.filename, row.sha256]));
			const actualFingerprint = verified ? attestationFingerprint({
				attestedAtMs: verified.attested_at_ms,
				generatedHashes: verifiedHashes
			}) : null;
			if (!verified || actualFingerprint !== verifiedFingerprint) throw new Error("SQLite verification failed for workspace attestation state");
		}
		if (params.source.workspaceDir) registerWorkspaceStateAliasesInTransaction({
			database,
			workspaceDirs: [params.source.workspaceDir, params.source.workspaceAliasPath ?? params.source.workspaceDir],
			identity: {
				workspaceKey: params.source.workspaceKey,
				workspacePath: params.source.workspaceDir
			},
			updatedAtMs: now
		});
		const targetTable = params.parsed.kind === "setup" ? "workspace_setup_state" : "workspace_attestations";
		const reportJson = JSON.stringify({
			source: MIGRATION_KIND,
			sourceKind: params.parsed.kind,
			target: targetTable,
			workspaceKey: params.source.workspaceKey,
			sourceSha256: params.snapshot.sha256,
			sourceRecordCount: params.parsed.recordCount,
			sourcePriority: params.source.priority,
			canonicalFingerprint: verifiedFingerprint,
			authoritative: resolution === "inserted" || resolution === "replaced" || receiptPreservesAuthority(existingReceipt, verifiedFingerprint),
			resolution,
			imported,
			...params.archivePath ? {
				archivePath: params.archivePath,
				differences
			} : {}
		});
		recordLegacyMigrationReceipt(db, {
			sourceKey: key,
			migrationKind: MIGRATION_KIND,
			sourcePath: params.source.sourcePath,
			targetTable,
			sourceSha256: params.snapshot.sha256,
			sourceSizeBytes: params.snapshot.size,
			sourceRecordCount: params.parsed.recordCount,
			runId,
			now,
			reportJson,
			upsert: existingReceipt !== null
		});
		return {
			sourceKey: key,
			imported,
			differences
		};
	}, { env: params.env });
}
//#endregion
//#region src/infra/state-migrations.workspace-setup.ts
const CLAIM_SUFFIX = WORKSPACE_DOCTOR_CLAIM_SUFFIX;
function createLegacySource(params) {
	const rootDir = path.resolve(params.rootDir);
	const sourcePath = path.resolve(params.sourcePath);
	const relativePath = path.relative(rootDir, sourcePath);
	if (!relativePath || relativePath === ".." || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath)) throw new Error("legacy workspace source is outside its migration root");
	return {
		...params,
		rootDir,
		relativePath,
		sourcePath
	};
}
function listOrphanAttestationSources(params) {
	const sources = [];
	const stateDirs = [.../* @__PURE__ */ new Set([params.stateDir, ...resolveLegacyStateDirs(params.homedir)])];
	for (const [priority, stateDir] of stateDirs.entries()) {
		const attestationDir = path.join(stateDir, LEGACY_WORKSPACE_ATTESTATION_DIRNAME);
		let entries;
		try {
			entries = fs.readdirSync(attestationDir, { withFileTypes: true });
		} catch (error) {
			if (error.code === "ENOENT") continue;
			sources.push({ ...createLegacySource({
				kind: "attestation",
				rootDir: stateDir,
				sourcePath: attestationDir,
				workspaceKey: "unreadable-attestation-directory",
				priority
			}) });
			continue;
		}
		for (const entry of entries) {
			const match = /^([a-f0-9]{64})\.attested(?:\.doctor-importing)?$/.exec(entry.name);
			if (!match?.[1]) continue;
			const sourceName = entry.name.endsWith(CLAIM_SUFFIX) ? entry.name.slice(0, -CLAIM_SUFFIX.length) : entry.name;
			sources.push(createLegacySource({
				kind: "attestation",
				rootDir: stateDir,
				sourcePath: path.join(attestationDir, sourceName),
				workspaceKey: match[1],
				priority
			}));
		}
	}
	return sources;
}
function addLegacyWorkspaceSources(params) {
	const identity = resolveWorkspaceStateIdentity(params.workspaceDir);
	const paths = resolveLegacyWorkspaceSourcePaths(params.workspaceDir, {
		env: params.env,
		homedir: params.homedir
	});
	for (const [priority, sourcePath] of paths.setupStatePaths.entries()) if (legacyMigrationSourceOrClaimMayExist(sourcePath)) params.add(createLegacySource({
		kind: "setup",
		rootDir: sourcePath.endsWith("openclaw-workspace-state.json") ? path.dirname(sourcePath) : path.dirname(path.dirname(sourcePath)),
		sourcePath,
		workspaceKey: identity.workspaceKey,
		workspaceDir: identity.workspacePath,
		workspaceAliasPath: paths.workspacePath,
		priority
	}));
	for (const [priority, sourcePath] of paths.stateDirAttestationPaths.entries()) if (legacyMigrationSourceOrClaimMayExist(sourcePath)) params.add(createLegacySource({
		kind: "attestation",
		rootDir: path.dirname(path.dirname(sourcePath)),
		sourcePath,
		workspaceKey: identity.workspaceKey,
		workspaceDir: identity.workspacePath,
		workspaceAliasPath: paths.workspacePath,
		priority
	}));
	for (const [index, sourcePath] of paths.siblingAttestationPaths.entries()) {
		if (!pathMayExistSync(`${sourcePath}${CLAIM_SUFFIX}`) && !legacyWorkspaceSiblingAttestationMayExist(sourcePath)) continue;
		params.add(createLegacySource({
			kind: "attestation",
			rootDir: path.dirname(sourcePath),
			sourcePath,
			workspaceKey: identity.workspaceKey,
			workspaceDir: identity.workspacePath,
			workspaceAliasPath: paths.workspacePath,
			priority: paths.stateDirAttestationPaths.length + index
		}));
	}
}
/** Detect retired workspace files only when an explicit Doctor flow opts in. */
async function detectLegacyWorkspaceState(params) {
	if (params.doctorOnlyStateMigrations !== true) return {
		sources: [],
		hasLegacy: false
	};
	const { listLegacySkillWorkshopWorkspaceDirs } = await import("./doctor-skill-workshop-sources-CYUWLW4y.mjs");
	const env = {
		...params.env ?? process.env,
		OPENCLAW_STATE_DIR: params.stateDir
	};
	const homedir = params.homedir ?? os.homedir;
	const byPath = /* @__PURE__ */ new Map();
	const rehearsalInventoryPaths = /* @__PURE__ */ new Set();
	const add = (source) => {
		if (isUpdateRehearsalReadOnlyPath(source.sourcePath, env)) {
			for (const sourcePath of [source.sourcePath, `${source.sourcePath}${CLAIM_SUFFIX}`]) if (pathMayExistSync(sourcePath)) rehearsalInventoryPaths.add(sourcePath);
			return;
		}
		const key = `${source.kind}:${path.resolve(source.sourcePath)}`;
		const existing = byPath.get(key);
		const sourceIsConfigured = source.workspaceDir !== void 0;
		const existingIsConfigured = existing?.workspaceDir !== void 0;
		if (!existing || sourceIsConfigured && !existingIsConfigured || sourceIsConfigured === existingIsConfigured && source.priority < existing.priority) byPath.set(key, source);
	};
	const workspaceDirs = new Set(await listWorkspaceStateDirs({
		cfg: params.cfg,
		env,
		homedir,
		stateDir: params.stateDir
	}));
	const sharedWorkspace = params.cfg.agents?.defaults?.workspace?.trim();
	if (sharedWorkspace) workspaceDirs.add(resolveUserPath(sharedWorkspace, env, homedir));
	const configuredPaths = new Set([...workspaceDirs].map((directory) => resolveWorkspaceStateIdentity(directory).workspacePath));
	const historicalWorkspaceDirs = [];
	for (const workspaceDir of await listLegacySkillWorkshopWorkspaceDirs(params.cfg, env)) {
		const canonicalPath = resolveWorkspaceStateIdentity(workspaceDir).workspacePath;
		if (!configuredPaths.has(canonicalPath) && !isUpdateRehearsalReadOnlyPath(workspaceDir, env)) historicalWorkspaceDirs.push(workspaceDir);
		workspaceDirs.add(workspaceDir);
	}
	for (const workspaceDir of workspaceDirs) addLegacyWorkspaceSources({
		workspaceDir,
		env,
		homedir,
		add
	});
	for (const source of listOrphanAttestationSources({
		stateDir: params.stateDir,
		homedir
	})) add(source);
	const sources = [...byPath.values()].toSorted((left, right) => left.priority - right.priority || left.workspaceKey.localeCompare(right.workspaceKey) || left.sourcePath.localeCompare(right.sourcePath));
	return {
		sources,
		hasLegacy: sources.length > 0 || historicalWorkspaceDirs.length > 0 || rehearsalInventoryPaths.size > 0,
		...historicalWorkspaceDirs.length > 0 ? { historicalWorkspaceDirs } : {},
		...rehearsalInventoryPaths.size > 0 ? { rehearsalInventoryPaths: [...rehearsalInventoryPaths] } : {}
	};
}
function assertConfiguredWorkspaceIdentity(source) {
	if (!source.workspaceAliasPath) return;
	if (!source.workspaceDir) throw new Error("configured legacy workspace source has no canonical path");
	const current = resolveWorkspaceStateIdentity(source.workspaceAliasPath);
	if (current.workspaceKey !== source.workspaceKey || current.workspacePath !== source.workspaceDir) throw new Error("configured workspace identity changed during Doctor migration");
}
async function cleanupReceiptSource(params) {
	try {
		assertConfiguredWorkspaceIdentity(params.source);
		const sourceClaim = params.sourceClaim;
		const { hasSource, hasClaim } = params;
		if (!hasSource && !hasClaim) {
			if (!params.receipt.removedSource) markLegacyMigrationSourceRemoved(params.receipt.sourceKey, params.env);
			return {
				changes: [],
				warnings: []
			};
		}
		if (hasSource && hasClaim) return {
			changes: [],
			warnings: ["Workspace state is in SQLite, but source and interrupted claim both exist."]
		};
		let snapshot = await sourceClaim.read(hasClaim);
		let claimedByThisRun = false;
		if (hasSource) {
			try {
				snapshot = await sourceClaim.claim({
					snapshot,
					mismatchMessage: "legacy workspace source changed before Doctor could claim it"
				});
			} catch (error) {
				await sourceClaim.restore();
				throw error;
			}
			claimedByThisRun = true;
		}
		const parsed = parseSource(params.source, snapshot);
		if (!params.receipt.sha256 || snapshot.sha256 !== params.receipt.sha256 || !canonicalCoversParsedSource({
			source: params.source,
			parsed,
			env: params.env
		})) {
			if (claimedByThisRun) await sourceClaim.restore();
			return {
				changes: [],
				warnings: ["Workspace state is in SQLite, but the retired source now conflicts."]
			};
		}
		const notices = [];
		if (parsed.kind === "setup") {
			const archivePath = await archiveWorkspaceSetupSource(params.sourceRoot, params.source, snapshot, params.receipt.archivePath);
			if (!params.receipt.archivePath) {
				const imported = importAndRecordReceipt({
					source: params.source,
					snapshot,
					parsed,
					env: params.env,
					previousReceipt: params.receipt,
					archivePath
				});
				notices.push(`Archived legacy workspace setup state at ${archivePath}.`, ...imported.differences);
			}
		}
		const unchanged = await sourceClaim.read(true);
		if (!legacyMigrationSourceSnapshotsMatch(snapshot, unchanged)) {
			if (claimedByThisRun) await sourceClaim.restore();
			throw new Error("legacy workspace claim changed before cleanup");
		}
		assertConfiguredWorkspaceIdentity(params.source);
		await sourceClaim.remove({ skipSourceCheck: true });
		markLegacyMigrationSourceRemoved(params.receipt.sourceKey, params.env);
		return {
			changes: [],
			warnings: [],
			notices: [...notices, "Discarded retired workspace state already covered by its SQLite receipt."]
		};
	} catch (error) {
		return {
			changes: [],
			warnings: [`Workspace state is in SQLite, but legacy cleanup failed at ${params.source.sourcePath}: ${formatErrorMessage(error)}`]
		};
	}
}
async function migrateOneSource(params) {
	let sourceClaim;
	let sourceRoot;
	const unreadable = (error) => ({
		changes: [],
		warnings: [params.historical ? `Preserved historical Workshop workspace setup at ${params.source.sourcePath} for manual review: ${formatErrorMessage(error)}.` : formatDoctorStateRepairFailure(`Failed reading legacy workspace state at ${params.source.sourcePath}: ${formatErrorMessage(error)}`, "Stop the Gateway. Restore this source or its .doctor-importing claim from a verified backup, or rename the unreadable source or claim with a .rejected-<timestamp> suffix to retain its bytes if its setup/attestation history can be discarded. Then rerun openclaw doctor --fix against the same state/config.")],
		...params.historical ? { warningDisposition: "recoverable" } : {}
	});
	try {
		if (isUpdateRehearsalReadOnlyPath(params.source.sourcePath, params.env)) throw new Error("Legacy workspace source is outside the update rehearsal root.");
		assertConfiguredWorkspaceIdentity(params.source);
		sourceRoot = await root(params.source.rootDir, {
			hardlinks: "reject",
			symlinks: "reject"
		});
		sourceClaim = createLegacySourceClaim(sourceRoot, params.source);
	} catch (error) {
		return unreadable(error);
	}
	const receipt = readReceipt(params.source, params.env);
	let hasSource;
	let hasClaim;
	try {
		await sourceClaim.recoverLinkedMove();
		hasSource = await sourceClaim.exists();
		hasClaim = await sourceClaim.exists(true);
	} catch (error) {
		return unreadable(error);
	}
	if (receipt && !(receipt.removedSource && hasSource !== hasClaim)) return cleanupReceiptSource({
		sourceRoot,
		sourceClaim,
		source: params.source,
		receipt,
		env: params.env,
		hasSource,
		hasClaim
	});
	if (hasSource && hasClaim) {
		if (params.historical) return unreadable(/* @__PURE__ */ new Error("source and interrupted claim both exist"));
		return {
			changes: [],
			warnings: ["Failed migrating legacy workspace state: source and interrupted claim both exist."]
		};
	}
	if (!hasSource && !hasClaim) return {
		changes: [],
		warnings: []
	};
	let operation;
	let claimAttempted = false;
	let imported;
	let archivePath;
	try {
		let snapshot = await sourceClaim.read(!hasSource);
		const discardEmptyAttestation = params.source.kind === "attestation" && path.basename(path.dirname(params.source.sourcePath)) === "workspace-attestations" && snapshot.size === 0;
		const parsed = discardEmptyAttestation ? void 0 : parseSource(params.source, snapshot);
		operation = discardEmptyAttestation ? `discarding empty reserved workspace attestation at ${params.source.sourcePath}` : "migrating legacy workspace state";
		if (hasSource) {
			claimAttempted = true;
			snapshot = await sourceClaim.claim({
				snapshot,
				beforeClaim: () => {
					params.beforeClaim?.(params.source);
					assertConfiguredWorkspaceIdentity(params.source);
				},
				mismatchMessage: "legacy workspace source changed before Doctor could claim it"
			});
		}
		if (parsed) {
			if (parsed.kind === "setup") archivePath = await archiveWorkspaceSetupSource(sourceRoot, params.source, snapshot);
			assertConfiguredWorkspaceIdentity(params.source);
			imported = importAndRecordReceipt({
				source: params.source,
				snapshot,
				parsed,
				env: params.env,
				previousReceipt: receipt ?? void 0,
				archivePath
			});
		}
		if (await sourceClaim.exists()) throw new Error("legacy workspace source reappeared during import");
		const unchanged = await sourceClaim.read(true);
		if (!legacyMigrationSourceSnapshotsMatch(snapshot, unchanged)) throw new Error("legacy workspace claim changed after import");
		assertConfiguredWorkspaceIdentity(params.source);
		await sourceClaim.remove({
			removeSource: params.removeSource,
			skipSourceCheck: true
		});
		if (imported) markLegacyMigrationSourceRemoved(imported.sourceKey, params.env);
	} catch (error) {
		if (imported) return {
			changes: [],
			warnings: [`Workspace state is in SQLite, but legacy cleanup failed at ${params.source.sourcePath}: ${formatErrorMessage(error)}`]
		};
		if (!operation) return unreadable(error);
		const restoreError = claimAttempted ? await sourceClaim.restore() : null;
		return {
			changes: [],
			warnings: [`Failed ${operation}: ${formatErrorMessage(error)}${restoreError ? `; restore failure: ${restoreError}` : ""}`]
		};
	}
	if (!imported) return {
		changes: [`Discarded empty reserved workspace attestation at ${params.source.sourcePath}.`],
		warnings: []
	};
	const label = params.source.kind === "setup" ? "workspace setup state" : "workspace attestation";
	return {
		changes: [imported.imported ? `Migrated ${label} to SQLite.` : `Verified canonical SQLite ${label}.`],
		warnings: [],
		notices: [
			...archivePath ? [`Archived legacy workspace setup state at ${archivePath}.`] : [],
			...imported.differences,
			"Removed retired workspace state after verified SQLite import."
		]
	};
}
/** Import retired workspace files while excluding Gateways that can recreate them. */
async function migrateLegacyWorkspaceState(params) {
	const detected = params.detected;
	if (!detected?.hasLegacy) return {
		changes: [],
		warnings: []
	};
	return await withLegacyMigrationStateLock({
		stateDir: params.stateDir,
		env: params.env,
		label: "legacy workspace state",
		releaseLabel: "Workspace",
		formatAcquireError: formatErrorMessage,
		run: async (env) => {
			const changes = [];
			const warnings = [];
			const outsideRootLegacyFileCount = detected.rehearsalInventoryPaths?.length ?? 0;
			const notices = outsideRootLegacyFileCount > 0 ? [`rehearsal: ${outsideRootLegacyFileCount} legacy files outside the rehearsal root left untouched`] : [];
			const historical = new Map((detected.historicalWorkspaceDirs ?? []).map((directory) => [resolveWorkspaceStateIdentity(directory).workspacePath, directory]));
			const unavailableWorkshopWorkspaces = /* @__PURE__ */ new Map();
			let blockingWarnings = 0;
			for (const source of detected.sources) {
				const result = await migrateOneSource({
					source,
					env,
					historical: source.workspaceDir !== void 0 && historical.has(source.workspaceDir),
					...params.beforeClaim ? { beforeClaim: params.beforeClaim } : {},
					...params.removeSource ? { removeSource: params.removeSource } : {}
				});
				changes.push(...result.changes);
				warnings.push(...result.warnings);
				notices.push(...result.notices ?? []);
				if (result.warningDisposition === "recoverable" && source.workspaceDir) unavailableWorkshopWorkspaces.set(source.workspaceDir, result.warnings.join("\n"));
				else blockingWarnings += result.warnings.length;
			}
			for (const [workspacePath, workspaceDir] of historical) {
				if (unavailableWorkshopWorkspaces.has(workspacePath)) continue;
				const snapshot = await readWorkspaceStateSnapshot(workspaceDir, {
					env,
					readOnly: true
				});
				if (!snapshot.setupExists && !snapshot.attestation) {
					const warning = `Historical Workshop workspace ${workspaceDir} has no usable setup state. Preserved its files; obsolete proposals will be retired and unfinished recovery retained for manual review.`;
					unavailableWorkshopWorkspaces.set(workspacePath, warning);
					warnings.push(warning);
				}
			}
			return {
				changes,
				warnings,
				...notices.length > 0 ? { notices } : {},
				...outsideRootLegacyFileCount > 0 ? { rehearsal: { outsideRootLegacyFileCount } } : {},
				...warnings.length > 0 && blockingWarnings === 0 ? { warningDisposition: "recoverable" } : {},
				...unavailableWorkshopWorkspaces.size > 0 ? { unavailableWorkshopWorkspaces } : {}
			};
		}
	});
}
//#endregion
//#region src/infra/state-migrations.doctor.ts
const autoMigrateChecked = /* @__PURE__ */ new Set();
function hasCustomAgentDirOverride(env) {
	return Boolean(env.OPENCLAW_AGENT_DIR?.trim() || env.PI_CODING_AGENT_DIR?.trim());
}
function resolveConcreteBindingAccountId(value) {
	if (typeof value !== "string") return;
	const accountId = value.trim();
	return accountId && accountId !== "*" ? accountId : void 0;
}
async function detectManagedWorktreeStateMigration(params) {
	const rawRoot = path.join(params.stateDir, "worktrees");
	const stateEnv = {
		...params.env,
		OPENCLAW_STATE_DIR: params.stateDir
	};
	const databaseExists = migrationFileExists(resolveOpenClawStateSqlitePath(stateEnv));
	const legacyIds = params.doctorOnlyStateMigrations === true && databaseExists ? listLegacyRegistryWorktreesForMigration(stateEnv, { artifactPreservingReadOnly: params.artifactPreservingReadOnly }).map((worktree) => worktree.id) : [];
	const hasLegacy = legacyIds.length > 0;
	let canonicalRoot;
	try {
		canonicalRoot = await fs$1.realpath(rawRoot);
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
		try {
			canonicalRoot = path.join(await fs$1.realpath(params.stateDir), "worktrees");
		} catch (stateDirError) {
			if (stateDirError.code === "ENOENT") return {
				hasLegacy,
				legacyIds,
				pathRewrites: []
			};
			throw stateDirError;
		}
	}
	if (rawRoot === canonicalRoot || !databaseExists) return {
		hasLegacy,
		legacyIds,
		pathRewrites: []
	};
	return {
		hasLegacy,
		legacyIds,
		pathRewrites: listRegistryWorktreesForMigration(stateEnv, { artifactPreservingReadOnly: params.artifactPreservingReadOnly }).flatMap((row) => {
			const fromPath = path.join(rawRoot, row.repoFingerprint, row.name);
			return row.path === fromPath ? [{
				id: row.id,
				fromPath,
				toPath: path.join(canonicalRoot, row.repoFingerprint, row.name)
			}] : [];
		})
	};
}
async function detectLegacyStateMigrations(params) {
	const env = params.env ?? process.env;
	const homedir = params.homedir ?? os.homedir;
	const stateDir = resolveStateDir(env, homedir);
	const oauthDir = resolveOAuthDir(env, stateDir);
	const detectSessionFiles = params.mode !== "automatic";
	const installAgentDir = resolveInstallAgentDir((resolutionEnv) => readCurrentConfigForResolution({
		config: params.cfg,
		env: resolutionEnv
	}), {
		env,
		homedir
	});
	const migrationTarget = installAgentDir.migrationTarget;
	const migrationAgentId = migrationTarget?.owner;
	const sessionMigrationAgentId = tryResolveDoctorSessionMigrationAgentId(params.cfg, migrationAgentId);
	const targetAgentId = migrationAgentId ?? sessionMigrationAgentId ?? "main";
	const rawMainKey = params.cfg.session?.mainKey;
	const targetMainKey = typeof rawMainKey === "string" && rawMainKey.trim().length > 0 ? rawMainKey.trim() : DEFAULT_MAIN_KEY;
	const targetScope = params.cfg.session?.scope;
	const sessionsLegacyDir = path.join(stateDir, "sessions");
	const sessionsLegacyStorePath = path.join(sessionsLegacyDir, "sessions.json");
	const sessionsTargetDir = path.join(stateDir, "agents", targetAgentId, "sessions");
	const sessionsTargetStorePath = path.join(sessionsTargetDir, "sessions.json");
	const pluginConfig = params.pluginDoctorConfig ?? params.cfg;
	const pluginPlanningEnabled = params.pluginPlanning !== "deferred";
	const pluginSessionStoreAgentIds = params.pluginSessionStoreAgentIds ?? (pluginPlanningEnabled ? listPluginDoctorSessionStoreAgentIds({
		config: pluginConfig,
		env,
		pluginIds: collectRelevantDoctorPluginIds(pluginConfig)
	}) : []);
	const currentSessionStoreOwnership = detectSessionFiles && sessionMigrationAgentId ? resolveSessionStoreOwnership({
		cfg: params.cfg,
		env,
		stateDir,
		targetAgentId: sessionMigrationAgentId,
		pluginSessionStoreAgentIds
	}) : {
		preserveAmbiguousKeys: true,
		preserveForeignMainAliases: true,
		targetStoreAliases: {
			hasDistinctAliases: false,
			hasFinalSymlink: false,
			hasUnresolvedIdentity: false
		}
	};
	const sessionStoreOwnership = {
		preserveAmbiguousKeys: params.sessionStoreOwnership?.preserveAmbiguousKeys === true || currentSessionStoreOwnership.preserveAmbiguousKeys,
		preserveForeignMainAliases: params.sessionStoreOwnership?.preserveForeignMainAliases === true || currentSessionStoreOwnership.preserveForeignMainAliases,
		targetStoreAliases: mergeSessionStoreAliasPlans(params.sessionStoreOwnership?.targetStoreAliases, currentSessionStoreOwnership.targetStoreAliases)
	};
	const { preserveForeignMainAliases } = sessionStoreOwnership;
	const hasLegacySessions = detectSessionFiles && (migrationFileExists(sessionsLegacyStorePath) || safeReadDir(sessionsLegacyDir).some((e) => e.isFile() && e.name.endsWith(".jsonl")));
	const targetSessionParsed = detectSessionFiles && migrationFileExists(sessionsTargetStorePath) ? readSessionStoreJson5(sessionsTargetStorePath) : {
		store: {},
		ok: true
	};
	const legacySessionSurfaces = detectSessionFiles ? params.legacySessionSurfaces : EMPTY_LEGACY_SESSION_SURFACES;
	const legacyKeys = targetSessionParsed.ok && legacySessionSurfaces.failures.length === 0 ? listLegacySessionKeys({
		store: targetSessionParsed.store,
		agentId: targetAgentId,
		mainKey: targetMainKey,
		scope: targetScope,
		preserveAmbiguousKeys: sessionStoreOwnership.preserveAmbiguousKeys,
		preserveForeignMainAliases,
		legacySessionSurfaces: legacySessionSurfaces.surfaces
	}) : [];
	const hasStaleSessionFiles = targetSessionParsed.ok && Object.values(targetSessionParsed.store).some((entry) => Boolean(resolveStaleLegacySessionFile({
		entry,
		legacyDir: sessionsLegacyDir,
		targetDir: sessionsTargetDir
	})));
	const targetAgentDir = migrationTarget?.dir;
	const targetAgentIdentity = targetAgentDir ? resolveIdentityPathViaExistingAncestorSync(targetAgentDir) : void 0;
	const rehearsalRoot = resolveUpdateRehearsalRoot(env);
	const seenAgentSources = /* @__PURE__ */ new Set();
	const legacyAgentInspections = [{
		legacyDir: resolveLegacyStandaloneAgentDir(homedir),
		standalone: true
	}, {
		legacyDir: path.join(stateDir, "agent"),
		standalone: false
	}].filter(({ legacyDir }) => {
		const identity = resolveIdentityPathViaExistingAncestorSync(legacyDir);
		if (identity === targetAgentIdentity || seenAgentSources.has(identity)) return false;
		seenAgentSources.add(identity);
		return true;
	}).map((source) => {
		const outsideSnapshot = Boolean(isUpdateRehearsalReadOnlyPath(source.legacyDir, env) || params.artifactPreservingReadOnly && listMigrationEndpointsOutsideRoot([{
			kind: "path",
			path: source.legacyDir
		}], stateDir).length > 0);
		return {
			source,
			inspection: outsideSnapshot ? lstatSync(source.legacyDir, { throwIfNoEntry: false }) ? {
				status: "failed",
				warning: `Legacy agent source is outside the copied state snapshot: ${source.legacyDir}. Run openclaw doctor --fix on the original installation.`
			} : { status: "empty" } : inspectLegacyAgentDir(source.legacyDir),
			outsideSnapshot
		};
	});
	const legacyAgentSources = legacyAgentInspections.flatMap(({ source, inspection }) => inspection.status === "payload" ? [{
		...source,
		boundaryRoot: resolveIdentityPathViaExistingAncestorSync(rehearsalRoot ?? (source.standalone ? path.dirname(source.legacyDir) : stateDir))
	}] : []);
	const hasLegacyAgentDir = legacyAgentSources.length > 0;
	const pluginStateSidecarPath = resolveLegacyPluginStateSidecarPath(stateDir);
	const hasPluginStateSidecar = migrationFileExists(pluginStateSidecarPath);
	const hasPendingPluginStateSidecarArchive = hasPendingSqliteSidecarArchive(pluginStateSidecarPath, PLUGIN_STATE_SQLITE_SIDECAR_SUFFIXES);
	const pluginInstallIndexPath = resolveLegacyInstalledPluginIndexStorePath({ stateDir });
	const hasPluginInstallIndex = migrationFileExists(pluginInstallIndexPath);
	const debugProxyCaptureSidecar = detectLegacyDebugProxyCaptureSidecar(stateDir, env);
	const stateSchemaMigrations = detectOpenClawStateDatabaseSchemaMigrations({ env: {
		...env,
		OPENCLAW_STATE_DIR: stateDir
	} }, { artifactPreservingReadOnly: params.artifactPreservingReadOnly });
	const worktrees = await detectManagedWorktreeStateMigration({
		env,
		stateDir,
		doctorOnlyStateMigrations: params.doctorOnlyStateMigrations,
		artifactPreservingReadOnly: params.artifactPreservingReadOnly
	});
	const taskRunsSidecarPath = resolveLegacyTaskRunsSidecarPath(stateDir);
	const flowRunsSidecarPath = resolveLegacyFlowRunsSidecarPath(stateDir);
	const hasPendingTaskRunsSidecarArchive = hasPendingSqliteSidecarArchive(taskRunsSidecarPath, TASK_STATE_SQLITE_SIDECAR_SUFFIXES);
	const hasPendingFlowRunsSidecarArchive = hasPendingSqliteSidecarArchive(flowRunsSidecarPath, TASK_STATE_SQLITE_SIDECAR_SUFFIXES);
	const hasTaskStateSidecars = migrationFileExists(taskRunsSidecarPath) || migrationFileExists(flowRunsSidecarPath) || hasPendingTaskRunsSidecarArchive || hasPendingFlowRunsSidecarArchive;
	const deliveryQueues = detectLegacyDeliveryQueueFiles(stateDir);
	const pairingStoreFiles = params.mode === "automatic" ? [] : await listLegacyPairingStoreFiles(stateDir);
	const voiceWake = {
		triggersPath: resolveLegacyVoiceWakeTriggersPath(stateDir),
		routingPath: resolveLegacyVoiceWakeRoutingPath(stateDir)
	};
	const hasVoiceWake = migrationFileExists(voiceWake.triggersPath) || migrationFileExists(voiceWake.routingPath);
	const updateCheck = { sourcePath: resolveLegacyUpdateCheckPath(stateDir) };
	const hasUpdateCheck = migrationFileExists(updateCheck.sourcePath);
	const configHealth = { sourcePath: resolveLegacyConfigHealthPath(stateDir) };
	const hasConfigHealth = migrationFileExists(configHealth.sourcePath);
	const pluginBindingApprovals = { sourcePath: resolveLegacyPluginBindingApprovalsPath(env, homedir) };
	const hasPluginBindingApprovals = path.resolve(path.dirname(pluginBindingApprovals.sourcePath)) === path.resolve(stateDir) && migrationFileExists(pluginBindingApprovals.sourcePath);
	const currentConversationBindings = { sourcePath: resolveLegacyCurrentConversationBindingsPath(stateDir) };
	const hasCurrentConversationBindings = migrationFileExists(currentConversationBindings.sourcePath);
	const detectDoctorOwnedState = (detect) => detect({
		stateDir,
		doctorOnlyStateMigrations: params.doctorOnlyStateMigrations
	});
	const tuiLastSessions = detectDoctorOwnedState(detectLegacyTuiLastSessions);
	const commitments = await detectLegacyCommitments({
		stateDir,
		env,
		doctorOnlyStateMigrations: params.doctorOnlyStateMigrations
	});
	const auditLogs = detectDoctorOwnedState(detectLegacyAuditLogs);
	const acpReplayLedger = detectDoctorOwnedState(detectLegacyAcpReplayLedger);
	const managedOutgoingImages = detectDoctorOwnedState(detectLegacyManagedOutgoingImages);
	const apns = detectDoctorOwnedState(detectLegacyApnsRegistrations);
	const deviceAuth = detectDoctorOwnedState(detectLegacyDeviceAuth);
	const sharedAuthStore = detectSharedAuthStoreMigration({
		stateDir,
		env,
		doctorOnlyStateMigrations: stateSchemaMigrations.length === 0 && params.doctorOnlyStateMigrations === true,
		artifactPreservingReadOnly: params.artifactPreservingReadOnly
	});
	const deviceIdentity = detectLegacyDeviceIdentity({
		stateDir,
		env,
		doctorOnlyStateMigrations: params.doctorOnlyStateMigrations,
		allowLegacyDeviceIdentityImport: params.allowLegacyDeviceIdentityImport
	});
	const execApprovals = detectDoctorOwnedState(detectLegacyExecApprovals);
	const mcpOauth = detectDoctorOwnedState(detectLegacyMcpOAuthStores);
	const meetingTranscripts = detectLegacyMeetingTranscripts({
		stateDir,
		env,
		doctorOnlyStateMigrations: params.doctorOnlyStateMigrations,
		artifactPreservingReadOnly: params.artifactPreservingReadOnly
	});
	const restartSentinel = detectLegacyRestartSentinel({ stateDir });
	const workspace = await detectLegacyWorkspaceState({
		cfg: params.cfg,
		stateDir,
		env,
		homedir,
		doctorOnlyStateMigrations: params.doctorOnlyStateMigrations
	});
	const webPush = detectDoctorOwnedState(detectLegacyWebPush);
	const nodeHost = detectDoctorOwnedState(detectLegacyNodeHostConfig);
	const subagentRegistry = detectDoctorOwnedState(detectLegacySubagentRegistry);
	const rescuePending = detectDoctorOwnedState(detectLegacyRescuePending);
	const channelPairing = detectLegacyChannelPairingState({
		sourceDir: oauthDir,
		configuredChannelIds: Object.keys(params.cfg.channels ?? {}),
		deferConfiguredAccountDiscovery: !pluginPlanningEnabled,
		resolveAccounts: () => {
			const configuredChannels = Object.entries(params.cfg.channels ?? {});
			let migrationOwnerConfig = params.cfg;
			if (migrationAgentId && listAgentIds(params.cfg).length > 1 && params.cfg.agents) {
				const agents = structuredClone(params.cfg.agents);
				delete agents.ownership;
				for (const [agentId, entry] of Object.entries(agents.entries ?? {})) entry.default = normalizeAgentId(agentId) === targetAgentId;
				for (const entry of agents.list ?? []) entry.default = normalizeAgentId(entry.id) === targetAgentId;
				migrationOwnerConfig = {
					...params.cfg,
					agents
				};
			}
			const configuredAccountIds = Object.fromEntries(configuredChannels.map(([channelId, value]) => {
				const channelConfig = value && typeof value === "object" && !Array.isArray(value) ? value : void 0;
				const accountIds = [
					...(pluginPlanningEnabled ? getChannelPlugin(channelId) : void 0)?.config.listAccountIds(params.cfg) ?? [],
					...channelConfig?.accounts && typeof channelConfig.accounts === "object" && !Array.isArray(channelConfig.accounts) ? Object.keys(channelConfig.accounts) : [],
					...typeof channelConfig?.defaultAccount === "string" ? [channelConfig.defaultAccount] : [],
					...(params.cfg.bindings ?? []).flatMap((binding) => {
						const accountId = binding.match?.channel === channelId ? resolveConcreteBindingAccountId(binding.match.accountId) : void 0;
						return accountId ? [accountId] : [];
					})
				];
				return [channelId, Array.from(new Set(accountIds.map((entry) => entry.trim()).filter(Boolean)))];
			}));
			return {
				defaultAccountIds: Object.fromEntries(configuredChannels.flatMap(([channelId, value]) => {
					const boundAccountId = params.cfg.bindings?.find((binding) => normalizeAgentId(binding.agentId) === targetAgentId && binding.match?.channel === channelId && resolveConcreteBindingAccountId(binding.match.accountId) !== void 0)?.match.accountId;
					const concreteBoundAccountId = resolveConcreteBindingAccountId(boundAccountId);
					if (concreteBoundAccountId) return [[channelId, concreteBoundAccountId]];
					const defaultAccount = value && typeof value === "object" && !Array.isArray(value) ? value.defaultAccount : void 0;
					if (typeof defaultAccount === "string" && defaultAccount.trim()) return [[channelId, defaultAccount.trim()]];
					const plugin = pluginPlanningEnabled ? getChannelPlugin(channelId) : void 0;
					if (plugin) return [[channelId, resolveChannelDefaultAccountId({
						plugin,
						cfg: migrationOwnerConfig
					})]];
					return [[channelId, configuredAccountIds[channelId]?.toSorted()[0] ?? "default"]];
				})),
				accountIds: configuredAccountIds
			};
		}
	});
	const pluginPlanWarnings = [];
	const pluginPlans = stateSchemaMigrations.length > 0 || !pluginPlanningEnabled ? [] : (await collectPluginDoctorStateMigrationPlans({
		config: pluginConfig,
		env,
		stateDir,
		oauthDir
	}, {
		includeDoctorOnly: params.doctorOnlyStateMigrations === true,
		warnings: pluginPlanWarnings,
		validateDeclarations: false
	})).plans;
	const sessionsHaveLegacy = Boolean(sessionMigrationAgentId) && (hasLegacySessions || legacyKeys.length > 0 || hasStaleSessionFiles);
	const agentDirHasLegacy = Boolean(migrationAgentId) && hasLegacyAgentDir;
	const deferredSessions = !sessionMigrationAgentId && (hasLegacySessions || legacyKeys.length > 0 || hasStaleSessionFiles);
	const deferredAgentDir = !migrationAgentId && hasLegacyAgentDir;
	const ownerFindings = classifyLegacyOwnerFindings({
		requiredWarnings: [...pluginPlanWarnings, ...legacySessionSurfaces.failures],
		agentInspections: legacyAgentInspections,
		usesLegacyRuntimeDirectory: () => installAgentDir.optionalDirectory?.migrationState === "legacy",
		deferredSessions,
		deferredAgentDir,
		doctorOnlyStateMigrations: params.doctorOnlyStateMigrations
	});
	const preview = [];
	if (sessionsHaveLegacy && hasLegacySessions) preview.push(`- Sessions: ${sessionsLegacyDir} → ${sessionsTargetDir}`);
	if (sessionsHaveLegacy && legacyKeys.length > 0) preview.push(`- Sessions: canonicalize legacy keys in ${sessionsTargetStorePath}`);
	if (sessionsHaveLegacy && hasStaleSessionFiles) preview.push(`- Sessions: repair migrated transcript paths in ${sessionsTargetStorePath}`);
	if (agentDirHasLegacy) preview.push(...legacyAgentSources.map(({ legacyDir }) => `- Agent dir: ${legacyDir} → ${targetAgentDir}`));
	if (hasPluginStateSidecar) preview.push(`- Plugin state sidecar: ${pluginStateSidecarPath} → shared SQLite state`);
	else if (hasPendingPluginStateSidecarArchive) preview.push(`- Plugin state sidecar: finish archive cleanup for ${pluginStateSidecarPath}`);
	if (hasPluginInstallIndex) preview.push(`- Plugin install index: ${pluginInstallIndexPath} → shared SQLite state`);
	if (debugProxyCaptureSidecar.hasLegacy) preview.push(`- Debug proxy capture sidecar: ${debugProxyCaptureSidecar.sourcePath} → shared SQLite state`);
	if (stateSchemaMigrations.length > 0) {
		for (const migration of stateSchemaMigrations) preview.push(`- Shared SQLite schema: ${describeStateSchemaMigration(migration)}`);
		preview.push("- Rerun doctor after shared SQLite schema repair to detect plugin state migrations");
	}
	if (worktrees.hasLegacy) preview.push("- Managed worktrees: discard rows without provisioned-file ledgers");
	if (worktrees.pathRewrites.length > 0) preview.push(`- Managed worktrees: canonicalize ${worktrees.pathRewrites.length} persisted ${worktrees.pathRewrites.length === 1 ? "path" : "paths"} for symlinked state directories`);
	if (migrationFileExists(taskRunsSidecarPath)) preview.push(`- Task registry sidecar: ${taskRunsSidecarPath} → shared SQLite state`);
	else if (hasPendingTaskRunsSidecarArchive) preview.push(`- Task registry sidecar: finish archive cleanup for ${taskRunsSidecarPath}`);
	if (migrationFileExists(flowRunsSidecarPath)) preview.push(`- Task flow sidecar: ${flowRunsSidecarPath} → shared SQLite state`);
	else if (hasPendingFlowRunsSidecarArchive) preview.push(`- Task flow sidecar: finish archive cleanup for ${flowRunsSidecarPath}`);
	const stateMigrationPreviews = [
		[sharedAuthStore.hasLegacy, "- Shared auth store: legacy main-agent rows → shared SQLite state"],
		[deliveryQueues.hasLegacy, "- Delivery queues: legacy JSON queue files → shared SQLite state"],
		[hasVoiceWake, "- Voice Wake settings: legacy JSON files → shared SQLite state"],
		[hasUpdateCheck, "- Update-check state: legacy JSON file → shared SQLite state"],
		[hasConfigHealth, "- Config health state: legacy JSON file → shared SQLite state"],
		[hasPluginBindingApprovals, "- Plugin binding approvals: legacy JSON file → shared SQLite state"],
		[hasCurrentConversationBindings, "- Current-conversation bindings: legacy JSON file → shared SQLite state"],
		[tuiLastSessions.hasLegacy, "- TUI last-session pointers: legacy JSON file → shared SQLite state"],
		[commitments.hasLegacy, "- Commitments: discard retired commitments/commitments.json rows without import, archive, or export"],
		...auditLogs.sources.map((source) => [true, `- ${source.label}: legacy JSONL file → shared SQLite state`]),
		[acpReplayLedger.hasLegacy, "- ACP replay ledger: legacy JSON file → shared SQLite state"],
		[managedOutgoingImages.hasLegacy, "- Managed outgoing images: legacy record JSON → shared SQLite state"],
		[apns.hasLegacy, "- APNs registrations: legacy JSON → shared SQLite state"],
		[deviceAuth.hasLegacy, "- Device auth tokens: legacy JSON → shared SQLite state"],
		[deviceIdentity.hasLegacy, "- Primary device identity: legacy JSON → shared SQLite state"],
		[deviceIdentity.hasInvalidCanonical && !deviceIdentity.hasLegacy, "- Primary device identity: invalid SQLite row → new device identity"],
		[execApprovals.hasLegacy, "- Exec approvals: legacy JSON → shared SQLite state"],
		[mcpOauth.hasLegacy, "- MCP OAuth credentials: legacy JSON → shared SQLite state"],
		[meetingTranscripts.hasLegacy, "- Meeting transcripts: legacy JSON/JSONL files → shared SQLite state"],
		[restartSentinel.hasLegacy, "- Restart sentinel: legacy JSON → shared SQLite state"],
		[workspace.hasLegacy, "- Workspace setup and attestations: legacy files → shared SQLite state"],
		[webPush.hasLegacy, "- Web Push subscriptions and VAPID identity: legacy JSON → shared SQLite state"],
		[nodeHost.hasLegacy, "- Node-host config: legacy node.json → shared SQLite state"],
		[subagentRegistry.hasLegacy, "- Subagent runs: discard retired transient subagents/runs.json state"],
		[rescuePending.hasLegacy, "- System-agent rescue approvals: discard retired pending JSON capabilities"],
		[channelPairing.hasLegacy, "- Channel pairing state: legacy JSON files → shared SQLite state"],
		[pairingStoreFiles.length > 0, "- Device and node pairing: legacy JSON files → shared SQLite state"]
	];
	for (const [hasLegacy, message] of stateMigrationPreviews) if (hasLegacy) preview.push(message);
	if (pluginPlans.length > 0) preview.push(...pluginPlans.flatMap((plan) => plan.preview));
	return {
		doctorOnlyStateMigrations: params.doctorOnlyStateMigrations === true,
		targetAgentId,
		targetMainKey,
		targetScope,
		stateDir,
		oauthDir,
		pluginSessionStoreAgentIds,
		sessions: {
			legacyDir: sessionsLegacyDir,
			legacyStorePath: sessionsLegacyStorePath,
			targetDir: sessionsTargetDir,
			targetStorePath: sessionsTargetStorePath,
			hasLegacy: sessionsHaveLegacy,
			legacyKeys: sessionMigrationAgentId ? legacyKeys : [],
			preserveAmbiguousKeys: sessionStoreOwnership.preserveAmbiguousKeys,
			preserveForeignMainAliases,
			targetStoreAliases: sessionStoreOwnership.targetStoreAliases
		},
		agentDir: {
			sources: legacyAgentSources,
			targetDir: targetAgentDir,
			hasLegacy: agentDirHasLegacy
		},
		pluginPlans: {
			hasLegacy: pluginPlans.length > 0,
			plans: pluginPlans
		},
		pluginStateSidecar: {
			sourcePath: pluginStateSidecarPath,
			hasLegacy: hasPluginStateSidecar || hasPendingPluginStateSidecarArchive
		},
		pluginInstallIndex: {
			sourcePath: pluginInstallIndexPath,
			hasLegacy: hasPluginInstallIndex
		},
		debugProxyCaptureSidecar,
		stateSchema: {
			hasLegacy: stateSchemaMigrations.length > 0,
			preview: stateSchemaMigrations.map((migration) => migration.path)
		},
		sharedAuthStore,
		worktrees,
		taskStateSidecars: {
			taskRunsPath: taskRunsSidecarPath,
			flowRunsPath: flowRunsSidecarPath,
			hasLegacy: hasTaskStateSidecars
		},
		deliveryQueues,
		pairingStores: {
			sourcePaths: pairingStoreFiles,
			hasLegacy: pairingStoreFiles.length > 0
		},
		voiceWake: {
			...voiceWake,
			hasLegacy: hasVoiceWake
		},
		updateCheck: {
			...updateCheck,
			hasLegacy: hasUpdateCheck
		},
		configHealth: {
			...configHealth,
			hasLegacy: hasConfigHealth
		},
		pluginBindingApprovals: {
			...pluginBindingApprovals,
			hasLegacy: hasPluginBindingApprovals
		},
		currentConversationBindings: {
			...currentConversationBindings,
			hasLegacy: hasCurrentConversationBindings
		},
		tuiLastSessions,
		commitments,
		auditLogs,
		acpReplayLedger,
		managedOutgoingImages,
		apns,
		deviceAuth,
		deviceIdentity,
		execApprovals,
		mcpOauth,
		meetingTranscripts,
		restartSentinel,
		workspace,
		webPush,
		nodeHost,
		subagentRegistry,
		rescuePending,
		channelPairing,
		...ownerFindings,
		notices: [...ownerFindings.notices, ...legacyAgentQuarantineNotices(stateDir, targetAgentId)],
		preview
	};
}
const unresolvedMigrationStepLayout = [
	[
		"device-auth",
		"shared",
		"all"
	],
	[
		"device-identity",
		"shared",
		"all"
	],
	[
		"meeting-transcripts",
		"shared",
		"all"
	],
	[
		"managed-worktrees",
		"shared",
		"all"
	],
	[
		"shared-auth-store",
		"shared",
		"all"
	],
	[
		"plugin-state-sidecar",
		"shared",
		"all"
	],
	[
		"debug-proxy-capture",
		"shared",
		"all"
	],
	[
		"task-state-sidecars",
		"shared",
		"all"
	],
	[
		"voice-wake",
		"shared",
		"all"
	],
	[
		"update-check",
		"shared",
		"all"
	],
	[
		"config-health",
		"shared",
		"all"
	],
	[
		"plugin-binding-approvals",
		"shared",
		"all"
	],
	[
		"current-conversation-bindings",
		"shared",
		"all"
	],
	[
		"delivery-queues",
		"shared",
		"doctor"
	],
	[
		"pairing-stores",
		"shared",
		"doctor"
	],
	[
		"tui-last-session",
		"final",
		"doctor"
	],
	[
		"commitments",
		"final",
		"doctor"
	],
	[
		"audit-logs",
		"final",
		"doctor"
	],
	[
		"acp-replay-ledger",
		"final",
		"doctor"
	],
	[
		"managed-outgoing-images",
		"final",
		"doctor"
	],
	[
		"apns-registrations",
		"final",
		"doctor"
	],
	[
		"exec-approvals",
		"final",
		"doctor"
	],
	[
		"mcp-oauth",
		"final",
		"doctor"
	],
	[
		"restart-sentinel",
		"final",
		"all"
	],
	[
		"workspace-state",
		"final",
		"all"
	],
	[
		"web-push",
		"final",
		"doctor"
	],
	[
		"node-host",
		"final",
		"doctor"
	],
	[
		"subagent-registry",
		"final",
		"doctor"
	],
	[
		"rescue-pending",
		"final",
		"doctor"
	],
	[
		"skill-workshop",
		"final",
		"doctor"
	],
	[
		"channel-pairing",
		"final",
		"doctor"
	],
	[
		"plugin-doctor-state",
		"final",
		"all"
	],
	[
		"sessions",
		"final",
		"doctor-agent"
	],
	[
		"legacy-main-session-keys",
		"final",
		"automatic"
	],
	[
		"acp-session-metadata",
		"final",
		"doctor-agent"
	],
	[
		"agent-dir",
		"final",
		"agent"
	],
	[
		"plugin-doctor-post-session-state",
		"final",
		"doctor"
	]
];
function buildPlannedPluginStateMigrationDescriptor(params) {
	const actions = params.inventory.descriptors.filter((descriptor) => descriptor.phase === params.phase && (params.mode === "doctor" || descriptor.doctorOnly !== true));
	const unresolvedPluginIds = params.inventory.unresolvedPluginIds;
	const source = [...actions.map((descriptor) => ({
		kind: "owner",
		id: `plugin:${descriptor.pluginId}:${descriptor.id}`
	})), ...unresolvedPluginIds.map((pluginId) => ({
		kind: "owner",
		id: `plugin:${pluginId}:state-migrations`
	}))];
	return {
		actions,
		source,
		target: [.../* @__PURE__ */ new Set([...actions.map((descriptor) => descriptor.pluginId), ...unresolvedPluginIds])].map((pluginId) => ({
			kind: "owner",
			id: `plugin:${pluginId}:doctor-state`
		})),
		requiredness: source.length > 0 || params.inventory.resolutionFailure ? "conditional" : "not-required",
		...params.inventory.resolutionFailure ? { refusal: params.inventory.resolutionFailure } : unresolvedPluginIds.length > 0 ? { refusal: {
			code: "plugin-planning-deferred",
			message: `Plugin migration identities are not declared for: ${unresolvedPluginIds.join(", ")}.`
		} } : {}
	};
}
function buildUnresolvedBlockedMigrationSteps(params) {
	return unresolvedMigrationStepLayout.flatMap(([id, phase, scope]) => {
		if (!(scope === "all" || id === "agent-dir" && Boolean(params.env.OPENCLAW_AGENT_DIR) || scope === "doctor" && params.mode === "doctor" || scope === "automatic" && params.mode === "automatic" || scope === "doctor-agent" && params.mode === "doctor" && !params.skipAgentScopedMigrations || scope === "agent" && !params.skipAgentScopedMigrations)) return [];
		const pluginDescriptor = (id === "plugin-doctor-state" || id === "plugin-doctor-post-session-state") && params.pluginStateMigrationInventory ? buildPlannedPluginStateMigrationDescriptor({
			inventory: params.pluginStateMigrationInventory,
			mode: params.mode,
			...id === "plugin-doctor-post-session-state" ? { phase: "after-session-repair" } : {}
		}) : void 0;
		return [{
			id,
			phase,
			source: pluginDescriptor?.source ?? [],
			target: pluginDescriptor?.target ?? [],
			requiredness: pluginDescriptor?.requiredness ?? "conditional",
			reversibility: "checkpoint-required",
			...id === "tui-last-session" ? { inspectRefusal: () => inspectLegacyTuiLastSessionRefusal(detectLegacyTuiLastSessions({
				stateDir: params.stateDir,
				doctorOnlyStateMigrations: true
			})) } : {},
			run: () => ({
				changes: [],
				warnings: []
			})
		}];
	});
}
function createPluginInstallIndexStep(params) {
	return {
		id: "plugin-install-index",
		phase: "shared",
		source: [{
			kind: "path",
			path: resolveLegacyInstalledPluginIndexStorePath(params)
		}],
		target: [{
			kind: "sqlite",
			path: resolveOpenClawStateSqlitePath({
				...params.env,
				OPENCLAW_STATE_DIR: params.stateDir
			})
		}],
		requiredness: params.hasLegacy ? "required" : "not-required",
		reversibility: "checkpoint-required",
		collectNotices: true,
		run: () => migrateLegacyInstalledPluginIndex({ stateDir: params.stateDir })
	};
}
function createAgentTargetDiscoveryStep(params) {
	return {
		id: "agent-migration-targets",
		phase: "shared",
		source: [
			...createConfigMigrationSources(params.configPath, params.configIncludedPaths),
			{
				kind: "sqlite",
				path: resolveOpenClawStateSqlitePath({
					...params.env,
					OPENCLAW_STATE_DIR: params.stateDir
				})
			},
			{
				kind: "path",
				path: path.join(params.stateDir, "agents")
			}
		],
		target: [],
		requiredness: "required",
		reversibility: "not-applicable",
		...params.refusal ? { refusal: params.refusal } : {},
		run: params.run
	};
}
function createConfigMachineStateStep(params) {
	const stateEnv = {
		...params.env,
		OPENCLAW_STATE_DIR: params.stateDir
	};
	return {
		id: "config-machine-state",
		phase: "shared",
		source: createConfigMigrationSources(params.configPath, params.configIncludedPaths),
		target: [{
			kind: "sqlite",
			path: resolveOpenClawStateSqlitePath(stateEnv)
		}],
		requiredness: "conditional",
		reversibility: "checkpoint-required",
		run: () => migrateLegacyConfigMachineState({
			config: params.config,
			env: stateEnv
		})
	};
}
function createMigrationDetectionStep(params) {
	return {
		id: "migration-detection",
		phase: "shared",
		source: [...createConfigMigrationSources(params.configPath, params.configIncludedPaths), {
			kind: "path",
			path: params.stateDir
		}],
		target: [],
		requiredness: "required",
		reversibility: "not-applicable",
		...params.refusal ? { refusal: params.refusal } : {},
		run: params.run
	};
}
function createPluginMigrationPreparationStep(params) {
	return {
		id: "plugin-migration-preparation",
		phase: "shared",
		source: [...createConfigMigrationSources(params.configPath, params.configIncludedPaths), ...params.pluginIds.map((pluginId) => ({
			kind: "owner",
			id: `plugin:${pluginId}`
		}))],
		target: [],
		requiredness: "required",
		reversibility: "not-applicable",
		...params.refusal ? { refusal: params.refusal } : {},
		run: params.run
	};
}
function listMigrationEndpointsOutsideRoot(endpoints, root) {
	const resolvedRoot = path.resolve(root);
	const identityRoot = resolveIdentityPathViaExistingAncestorSync(resolvedRoot);
	return uniqueMigrationEndpoints(endpoints.filter((endpoint) => {
		if (endpoint.kind === "owner") return false;
		const resolvedPath = path.resolve(endpoint.path);
		const identityPath = resolveIdentityPathViaExistingAncestorSync(resolvedPath);
		return resolvedPath !== resolvedRoot && !isPathInside(resolvedRoot, resolvedPath) || identityPath !== identityRoot && !isPathInside(identityRoot, identityPath);
	}));
}
function createSessionTargetOutsideSnapshotRefusal(endpoints) {
	return {
		code: "session-target-outside-snapshot",
		message: `Configured session migration endpoints are outside the copied state root and require a separately bound snapshot: ${endpoints.map((endpoint) => endpoint.kind === "owner" ? endpoint.id : path.resolve(endpoint.path)).toSorted().join(", ")}`
	};
}
function createDeferredPluginSessionStoreEndpoints(config, inventory) {
	const knownPluginIds = new Set(inventory.knownPluginIds);
	const sessionStoreOwnerPluginIds = new Set(inventory.sessionStoreOwnerPluginIds);
	return collectRelevantDoctorPluginIds(config).filter((pluginId) => !knownPluginIds.has(pluginId) || sessionStoreOwnerPluginIds.has(pluginId)).map((pluginId) => ({
		kind: "owner",
		id: `plugin:${pluginId}:session-store`
	}));
}
function createPluginMigrationPreparationRefusal(params) {
	if (params.deferredSessionStoreEndpoints.length === 0 && params.inventory.unresolvedPluginIds.length === 0) return;
	return {
		code: "plugin-planning-deferred",
		message: "Plugin migration preparation requires plugin and session-store descriptors for the new version."
	};
}
function resolveConfiguredSessionStoreEndpoints(config, env) {
	return uniqueMigrationEndpoints([.../* @__PURE__ */ new Set([...listConfiguredSessionStoreAgentIds(config), resolveSessionStoreCompatibilityAgentId(config)])].map((agentId) => ({
		kind: "path",
		path: resolveSessionStorePathCore(config.session?.store, {
			agentId,
			env
		})
	})));
}
function bindAgentDatabaseTargetsToStateRoot(targets, stateDir) {
	const outsideEndpoints = listMigrationEndpointsOutsideRoot(targets.map(({ path: databasePath }) => ({
		kind: "sqlite",
		path: databasePath
	})), stateDir);
	const outsidePaths = new Set(outsideEndpoints.flatMap((endpoint) => endpoint.kind === "owner" ? [] : [path.resolve(endpoint.path)]));
	if (outsidePaths.size === 0) return {
		targets: [...targets],
		outsideEndpoints: []
	};
	return {
		targets: targets.filter((target) => !outsidePaths.has(path.resolve(target.path))),
		outsideEndpoints,
		refusal: createSessionTargetOutsideSnapshotRefusal(outsideEndpoints)
	};
}
function buildLegacyStateMigrationSteps(params) {
	const { detected, env } = params;
	const stateDir = detected.stateDir;
	const stateDatabase = {
		kind: "sqlite",
		path: resolveOpenClawStateSqlitePath({
			...env,
			OPENCLAW_STATE_DIR: stateDir
		})
	};
	const now = params.now ?? (() => Date.now());
	const isDoctor = params.mode === "doctor";
	const repairSessionFiles = isDoctor && !params.skipAgentScopedMigrations;
	const pathEndpoints = (...paths) => paths.flatMap((entry) => entry ? [{
		kind: "path",
		path: entry
	}] : []);
	const sqliteEndpoints = (...paths) => paths.flatMap((entry) => entry ? [{
		kind: "sqlite",
		path: entry
	}] : []);
	const pluginSessionStoreAgentIds = detected.pluginSessionStoreAgentIds;
	const legacySessionStores = params.legacySessionStoreEndpoints ?? inspectOrphanSessionStoreEndpoints({
		config: params.sessionConfig ?? params.config,
		env,
		pluginSessionStoreAgentIds
	}).endpoints;
	const agentDatabases = params.agentDatabaseEndpoints ?? [{
		kind: "owner",
		id: "configured-agent-databases"
	}];
	const canonicalSessionStores = uniqueMigrationEndpoints([...legacySessionStores, ...agentDatabases]);
	const pluginMigrationMode = detected.doctorOnlyStateMigrations === true ? "doctor" : "automatic";
	const plannedPluginDescriptor = params.pluginStateMigrationInventory ? buildPlannedPluginStateMigrationDescriptor({
		inventory: params.pluginStateMigrationInventory,
		mode: pluginMigrationMode
	}) : void 0;
	const plannedPostSessionPluginDescriptor = params.pluginStateMigrationInventory ? buildPlannedPluginStateMigrationDescriptor({
		inventory: params.pluginStateMigrationInventory,
		mode: pluginMigrationMode,
		phase: "after-session-repair"
	}) : void 0;
	const pluginMigrationSources = plannedPluginDescriptor ? plannedPluginDescriptor.source : (detected.pluginPlans?.plans ?? []).map((plan) => ({
		kind: "owner",
		id: `plugin:${plan.pluginId}:${plan.migration.id}`
	}));
	const pluginMigrationTargets = plannedPluginDescriptor ? plannedPluginDescriptor.target : [...new Set((detected.pluginPlans?.plans ?? []).map((plan) => plan.pluginId))].map((pluginId) => ({
		kind: "owner",
		id: `plugin:${pluginId}:doctor-state`
	}));
	const stepSpecs = {
		"managed-worktrees": [
			[stateDatabase, ...[.../* @__PURE__ */ new Set([...detected.worktrees.legacyIds, ...detected.worktrees.pathRewrites.map((rewrite) => rewrite.id)])].toSorted().map((id) => ({
				kind: "owner",
				id: `core:managed-worktree:${id}`
			}))],
			isDoctor && detected.worktrees.hasLegacy || detected.worktrees.pathRewrites.length > 0,
			[stateDatabase]
		],
		"shared-auth-store": [detected.sharedAuthStore.sourcePath ? [{
			kind: "sqlite",
			path: detected.sharedAuthStore.sourcePath
		}] : [], detected.sharedAuthStore.sourcePath ? "conditional" : false],
		"plugin-state-sidecar": [detected.pluginStateSidecar.sourcePath ? [{
			kind: "sqlite",
			path: detected.pluginStateSidecar.sourcePath
		}] : [], detected.pluginStateSidecar.hasLegacy],
		"debug-proxy-capture": [pathEndpoints(detected.debugProxyCaptureSidecar.sourcePath, detected.debugProxyCaptureSidecar.blobDir), detected.debugProxyCaptureSidecar.hasLegacy],
		"task-state-sidecars": [sqliteEndpoints(detected.taskStateSidecars.taskRunsPath, detected.taskStateSidecars.flowRunsPath), detected.taskStateSidecars.hasLegacy],
		"delivery-queues": [[...pathEndpoints(detected.deliveryQueues.outboundPath, detected.deliveryQueues.sessionPath), stateDatabase], detected.deliveryQueues.hasLegacy ? true : "conditional"],
		"pairing-stores": [pathEndpoints(...detected.pairingStores.sourcePaths), detected.pairingStores.hasLegacy],
		"voice-wake": [pathEndpoints(detected.voiceWake.triggersPath, detected.voiceWake.routingPath), detected.voiceWake.hasLegacy],
		"update-check": [pathEndpoints(detected.updateCheck.sourcePath), detected.updateCheck.hasLegacy],
		"config-health": [pathEndpoints(detected.configHealth.sourcePath), detected.configHealth.hasLegacy],
		"plugin-binding-approvals": [pathEndpoints(detected.pluginBindingApprovals.sourcePath), detected.pluginBindingApprovals.hasLegacy],
		"current-conversation-bindings": [pathEndpoints(detected.currentConversationBindings.sourcePath), detected.currentConversationBindings.hasLegacy],
		"tui-last-session": [pathEndpoints(detected.tuiLastSessions.sourcePath), detected.tuiLastSessions.hasLegacy],
		commitments: [pathEndpoints(detected.commitments?.sourcePath), detected.commitments?.hasLegacy === true],
		"audit-logs": [pathEndpoints(...detected.auditLogs.sources.map((source) => source.sourcePath)), detected.auditLogs.hasLegacy],
		"acp-replay-ledger": [pathEndpoints(detected.acpReplayLedger.sourcePath), detected.acpReplayLedger.hasLegacy],
		"managed-outgoing-images": [pathEndpoints(detected.managedOutgoingImages.sourceDir), detected.managedOutgoingImages.hasLegacy],
		"apns-registrations": [pathEndpoints(detected.apns.sourcePath), detected.apns.hasLegacy],
		"device-auth": [pathEndpoints(detected.deviceAuth.sourcePath), detected.deviceAuth.hasLegacy],
		"device-identity": [pathEndpoints(detected.deviceIdentity.sourcePath, detected.deviceIdentity.claimPath, detected.deviceIdentity.nativeClaimPath), detected.deviceIdentity.hasLegacy || detected.deviceIdentity.hasInvalidCanonical],
		"exec-approvals": [pathEndpoints(detected.execApprovals.sourcePath), detected.execApprovals.hasLegacy],
		"mcp-oauth": [pathEndpoints(detected.mcpOauth.sourceDir, ...detected.mcpOauth.sourcePaths), detected.mcpOauth.hasLegacy],
		"meeting-transcripts": [[...pathEndpoints(detected.meetingTranscripts?.sourceDir), stateDatabase], detected.meetingTranscripts?.hasLegacy === true],
		"workspace-state": [pathEndpoints(...detected.workspace.sources.map((source) => source.sourcePath)), detected.workspace.hasLegacy],
		"skill-workshop": [
			[
				stateDatabase,
				...pathEndpoints(path.join(stateDir, "skill-workshop")),
				{
					kind: "owner",
					id: "core:skill-workshop"
				}
			],
			"conditional",
			[stateDatabase, {
				kind: "owner",
				id: "core:skill-workshop"
			}]
		],
		"web-push": [pathEndpoints(detected.webPush.subscriptionsPath, detected.webPush.vapidKeysPath), detected.webPush.hasLegacy],
		"node-host": [pathEndpoints(detected.nodeHost.sourcePath), detected.nodeHost.hasLegacy],
		"subagent-registry": [pathEndpoints(detected.subagentRegistry.sourcePath), detected.subagentRegistry.hasLegacy],
		"rescue-pending": [
			pathEndpoints(...detected.rescuePending.sourcePaths),
			detected.rescuePending.hasLegacy,
			[],
			"checkpoint-required"
		],
		"restart-sentinel": [pathEndpoints(detected.restartSentinel?.sourcePath), detected.restartSentinel?.hasLegacy === true],
		"channel-pairing": [pathEndpoints(...detected.channelPairing.files.map((file) => path.join(detected.channelPairing.sourceDir, file))), detected.channelPairing.hasLegacy],
		"plugin-doctor-state": [
			pluginMigrationSources,
			plannedPluginDescriptor?.requiredness ?? detected.pluginPlans?.hasLegacy === true,
			pluginMigrationTargets
		],
		"plugin-doctor-post-session-state": [
			plannedPostSessionPluginDescriptor?.source ?? [],
			plannedPostSessionPluginDescriptor?.requiredness ?? false,
			plannedPostSessionPluginDescriptor?.target ?? []
		],
		sessions: [
			pathEndpoints(detected.sessions.legacyDir, detected.sessions.legacyStorePath),
			detected.sessions.hasLegacy,
			pathEndpoints(detected.sessions.targetDir, detected.sessions.targetStorePath)
		],
		"legacy-main-session-keys": [
			canonicalSessionStores,
			"conditional",
			canonicalSessionStores
		],
		"acp-session-metadata": [
			legacySessionStores,
			"conditional",
			uniqueMigrationEndpoints([...legacySessionStores, stateDatabase])
		],
		"agent-dir": [
			pathEndpoints(...detected.agentDir.sources.map(({ legacyDir }) => legacyDir)),
			detected.agentDir.hasLegacy,
			pathEndpoints(detected.agentDir.targetDir)
		]
	};
	const requiredness = (required) => typeof required === "string" ? required : required ? "required" : "not-required";
	const descriptor = (id, phase) => {
		const [source, required, target = [stateDatabase], reversibility = "checkpoint-required"] = stepSpecs[id];
		return {
			id,
			phase,
			source,
			target,
			requiredness: requiredness(required),
			reversibility
		};
	};
	const sharedStep = (id, run, collectNotices = false) => ({
		...descriptor(id, "shared"),
		run,
		collectNotices
	});
	const finalStep = (id, run, collectNotices = false, refusal) => ({
		...descriptor(id, "final"),
		...refusal ? { refusal } : {},
		run,
		collectNotices
	});
	const ownerStep = (id, detection, migrate, phase = "final", collectNotices = true) => ({
		...descriptor(id, phase),
		collectNotices,
		run: () => migrate({
			detected: detection,
			env,
			stateDir
		})
	});
	const managedWorktreePrelude = [sharedStep("managed-worktrees", () => {
		const stateEnv = {
			...env,
			OPENCLAW_STATE_DIR: stateDir
		};
		const discardedWorktrees = isDoctor && detected.worktrees.hasLegacy ? discardLegacyRegistryWorktrees(stateEnv, detected.worktrees.legacyIds) : 0;
		const canonicalizedWorktrees = rewriteRegistryWorktreePathsForMigration(stateEnv, detected.worktrees.pathRewrites);
		return {
			changes: [...discardedWorktrees > 0 ? [`Discarded ${discardedWorktrees} legacy managed worktree ${discardedWorktrees === 1 ? "row" : "rows"}; affected worktrees will provision fresh on next use`] : [], ...canonicalizedWorktrees > 0 ? [`Canonicalized ${canonicalizedWorktrees} managed worktree ${canonicalizedWorktrees === 1 ? "path" : "paths"} for symlinked state directories`] : []],
			warnings: []
		};
	})];
	const sharedSteps = [
		ownerStep("shared-auth-store", detected.sharedAuthStore, migrateSharedAuthStore, "shared"),
		sharedStep("plugin-state-sidecar", () => migrateLegacyPluginStateSidecar({ stateDir })),
		ownerStep("debug-proxy-capture", detected.debugProxyCaptureSidecar, migrateLegacyDebugProxyCaptureSidecar, "shared", false),
		sharedStep("task-state-sidecars", () => migrateLegacyTaskStateSidecars({ stateDir })),
		ownerStep("voice-wake", detected.voiceWake, migrateLegacyVoiceWakeSettings, "shared"),
		ownerStep("update-check", detected.updateCheck, migrateLegacyUpdateCheckState, "shared"),
		ownerStep("config-health", detected.configHealth, migrateLegacyConfigHealth, "shared", false),
		ownerStep("plugin-binding-approvals", detected.pluginBindingApprovals, migrateLegacyPluginBindingApprovals, "shared"),
		ownerStep("current-conversation-bindings", detected.currentConversationBindings, migrateLegacyCurrentConversationBindings, "shared")
	];
	const eagerStateSteps = [
		ownerStep("device-auth", detected.deviceAuth, migrateLegacyDeviceAuth, "shared"),
		sharedStep("device-identity", () => migrateLegacyDeviceIdentity({
			detected: detected.deviceIdentity,
			env,
			stateDir,
			doctorOnlyStateMigrations: isDoctor,
			allowLegacyDeviceIdentityImport: params.allowLegacyDeviceIdentityImport
		}), true),
		sharedStep("meeting-transcripts", () => migrateLegacyMeetingTranscripts({
			detected: detected.meetingTranscripts,
			env,
			stateDir,
			now
		}), true)
	];
	const doctorStateSteps = isDoctor ? [
		{
			...sharedStep("delivery-queues", async () => {
				const { migrateDoctorDeliveryQueues } = await import("./doctor-outbound-delivery-cxmAPkLC.mjs");
				return migrateDoctorDeliveryQueues({
					cfg: params.config,
					stateDir,
					env
				});
			}),
			runWithoutFileDetection: true
		},
		sharedStep("pairing-stores", async () => {
			const { migrateDoctorPairingStores } = await import("./state-migrations.pairing-CC8_e_xh.mjs");
			return migrateDoctorPairingStores({
				stateDir,
				env,
				cfg: params.config
			});
		}),
		{
			...ownerStep("tui-last-session", detected.tuiLastSessions, migrateLegacyTuiLastSessions),
			inspectRefusal: () => inspectLegacyTuiLastSessionRefusal(detected.tuiLastSessions)
		},
		...detected.commitments ? [ownerStep("commitments", detected.commitments, migrateLegacyCommitments)] : [],
		ownerStep("audit-logs", detected.auditLogs, migrateLegacyAuditLogs),
		ownerStep("acp-replay-ledger", detected.acpReplayLedger, migrateLegacyAcpReplayLedger),
		ownerStep("managed-outgoing-images", detected.managedOutgoingImages, migrateLegacyManagedOutgoingImages),
		ownerStep("apns-registrations", detected.apns, migrateLegacyApnsRegistrations),
		ownerStep("exec-approvals", detected.execApprovals, migrateLegacyExecApprovals),
		ownerStep("mcp-oauth", detected.mcpOauth, migrateLegacyMcpOAuthStores)
	] : [];
	const doctorFinalSteps = isDoctor ? [
		ownerStep("web-push", detected.webPush, migrateLegacyWebPush),
		ownerStep("node-host", detected.nodeHost, migrateLegacyNodeHostConfig),
		ownerStep("subagent-registry", detected.subagentRegistry, migrateLegacySubagentRegistry),
		ownerStep("rescue-pending", detected.rescuePending, discardLegacyRescuePending, "final", false)
	] : [];
	const channelPairingRefusal = detected.channelPairing.accountDiscoveryDeferred ? {
		code: "plugin-planning-deferred",
		message: "Channel pairing account discovery is deferred to plugin validation."
	} : void 0;
	let unavailableWorkshopWorkspaces;
	const finalSteps = [
		ownerStep("restart-sentinel", detected.restartSentinel, migrateLegacyRestartSentinel),
		{
			...ownerStep("workspace-state", detected.workspace, async (options) => {
				if (isDoctor) await params.beforeWorkspaceStateMigration?.(params.sessionConfig ?? params.config);
				const result = await migrateLegacyWorkspaceState(options);
				unavailableWorkshopWorkspaces = result.unavailableWorkshopWorkspaces;
				return result;
			}),
			runWithoutFileDetection: isDoctor && params.beforeWorkspaceStateMigration !== void 0
		},
		...doctorFinalSteps,
		...isDoctor ? [{
			...finalStep("skill-workshop", async () => {
				const { migrateLegacySkillWorkshopProposals } = await import("./doctor-skill-workshop-sqlite-B8rrZ2Au.mjs");
				return migrateLegacySkillWorkshopProposals({
					config: params.sessionConfig ?? params.config,
					env: {
						...env,
						OPENCLAW_STATE_DIR: stateDir
					},
					unavailableWorkspaceDirs: unavailableWorkshopWorkspaces
				});
			}),
			runWithoutFileDetection: true
		}, finalStep("channel-pairing", channelPairingRefusal ? () => ({
			changes: [],
			warnings: [channelPairingRefusal.message]
		}) : () => migrateLegacyChannelPairingState({
			detected: detected.channelPairing,
			env: {
				...env,
				OPENCLAW_STATE_DIR: stateDir
			}
		}), false, channelPairingRefusal)] : [],
		finalStep("plugin-doctor-state", () => plannedPluginDescriptor?.refusal ? {
			changes: [],
			warnings: [plannedPluginDescriptor.refusal.message]
		} : runPluginDoctorStateMigrationPlans({
			detected,
			config: params.config,
			env,
			...plannedPluginDescriptor ? { plannedActions: plannedPluginDescriptor.actions.map((action) => ({
				pluginId: action.pluginId,
				id: action.id
			})) } : {}
		}), true, plannedPluginDescriptor?.refusal)
	];
	if (repairSessionFiles) finalSteps.push(finalStep("sessions", () => migrateLegacySessions(detected, now, {
		recoverCorruptTargetStore: params.recoverCorruptTargetStore,
		legacySessionSurfaces: params.legacySessionSurfaces
	})));
	if (!isDoctor) {
		const legacySessionStoreRefusal = params.legacySessionStoreRefusal;
		finalSteps.push({
			...finalStep("legacy-main-session-keys", legacySessionStoreRefusal ? () => ({
				changes: [],
				warnings: [legacySessionStoreRefusal.message]
			}) : async () => {
				return {
					changes: [],
					warnings: [],
					notices: (await migrateLegacyMainSessionKeys({
						cfg: params.sessionConfig ?? params.config,
						env,
						mode: "detect",
						now
					})).warnings
				};
			}, true, legacySessionStoreRefusal),
			runWithoutFileDetection: true
		});
	}
	if (repairSessionFiles) finalSteps.push({
		...finalStep("acp-session-metadata", () => migrateLegacyAcpSessionMetadata({
			cfg: params.sessionConfig ?? params.config,
			env: isDoctor ? {
				...env,
				OPENCLAW_STATE_DIR: stateDir
			} : env,
			now,
			pluginSessionStoreAgentIds,
			legacySessionSurfaces: params.legacySessionSurfaces
		})),
		runWithoutFileDetection: true
	});
	if (!params.skipAgentScopedMigrations || env.OPENCLAW_AGENT_DIR) finalSteps.push(finalStep("agent-dir", () => migrateLegacyAgentDir(detected, now)));
	if (isDoctor && plannedPostSessionPluginDescriptor && params.deferPostSessionPluginMigrations !== false) {
		finalSteps.push(finalStep("plugin-doctor-post-session-state", () => ({
			changes: [],
			warnings: []
		}), true, plannedPostSessionPluginDescriptor.refusal));
		const step = finalSteps.at(-1);
		if (!step || step.id !== "plugin-doctor-post-session-state") throw new Error("legacy state migration plan is missing its post-session plugin step");
		step.deferredExecution = {
			kind: "post-session-plugin",
			plannedActions: plannedPostSessionPluginDescriptor.actions.map(({ pluginId, id }) => ({
				pluginId,
				id
			}))
		};
	}
	return [
		createStateSchemaMigrationStep({
			stateDir,
			env,
			mode: params.mode,
			requiredness: detected.stateSchema.hasLegacy ? "required" : "conditional"
		}),
		createPluginInstallIndexStep({
			stateDir,
			env,
			hasLegacy: detected.pluginInstallIndex.hasLegacy
		}),
		...eagerStateSteps,
		...managedWorktreePrelude,
		...sharedSteps,
		...doctorStateSteps,
		...finalSteps
	];
}
/**
* Inspect a copied state/config snapshot without loading plugins or acquiring write authority.
* Plugin action identities come from manifests; undeclared owners remain an explicit refusal.
*/
async function planLegacyStateMigrationsReadOnly(params) {
	const invocationPurpose = params.invocationPurpose ?? (params.mode === "doctor" ? "doctor" : "startup");
	const expectedConfigDigest = params.snapshot.configDigest;
	const expectedStateDigest = params.snapshot.stateDigest;
	const requestedSnapshot = {
		homeDir: path.resolve(params.snapshot.homeDir),
		configPath: path.resolve(params.snapshot.configPath),
		stateDir: path.resolve(params.snapshot.stateDir)
	};
	const callerEnv = createLegacyStateMigrationCallerEnv({
		env: params.env,
		snapshot: requestedSnapshot
	});
	const rawOAuthDir = (params.env ?? process.env).OPENCLAW_OAUTH_DIR?.trim();
	const callerOAuthDir = rawOAuthDir ? resolveOAuthDir({
		...callerEnv,
		OPENCLAW_OAUTH_DIR: rawOAuthDir
	}, requestedSnapshot.stateDir) : void 0;
	const oauthDirOutsideSnapshot = callerOAuthDir !== void 0 && path.resolve(callerOAuthDir) !== requestedSnapshot.stateDir && !isPathInside(requestedSnapshot.stateDir, callerOAuthDir);
	const pendingStateDirMigration = resolvePendingLegacyStateDirMigrationPaths({
		env: callerEnv,
		homedir: () => requestedSnapshot.homeDir
	});
	const identityBefore = await captureLegacyStateSnapshotIdentity(requestedSnapshot);
	const env = createLegacyStateMigrationPlanEnv({
		env: params.env,
		snapshot: requestedSnapshot
	});
	if (callerOAuthDir && !oauthDirOutsideSnapshot) env.OPENCLAW_OAUTH_DIR = callerOAuthDir;
	const configBefore = await readLegacyStateMigrationPlanConfig({
		configPath: requestedSnapshot.configPath,
		homeDir: requestedSnapshot.homeDir,
		env
	});
	const snapshot = {
		...requestedSnapshot,
		...configBefore.configDigest ? { configDigest: configBefore.configDigest } : {},
		...identityBefore.stateDigest ? { stateDigest: identityBefore.stateDigest } : {}
	};
	if (identityBefore.warnings.length > 0 || !configBefore.configDigest) {
		const warnings = [
			...params.initialWarnings ?? [],
			...identityBefore.warnings,
			...configBefore.warnings
		];
		return createLegacyStateMigrationPlan({
			mode: params.mode,
			candidate: params.candidate,
			snapshot,
			steps: [],
			warnings,
			refusal: {
				code: "snapshot-identity-unavailable",
				message: warnings.join("\n")
			}
		});
	}
	if (identityBefore.configDigest !== configBefore.rootDigest) {
		const message = "Copied config changed while migration planning was starting.";
		return createLegacyStateMigrationPlan({
			mode: params.mode,
			candidate: params.candidate,
			snapshot,
			steps: [],
			warnings: [
				...params.initialWarnings ?? [],
				...configBefore.warnings,
				message
			],
			refusal: {
				code: "snapshot-identity-changed",
				message
			}
		});
	}
	const mismatchedSnapshotDigests = [expectedConfigDigest && expectedConfigDigest !== configBefore.configDigest ? "config" : void 0, expectedStateDigest && expectedStateDigest !== identityBefore.stateDigest ? "state" : void 0].filter((label) => label !== void 0);
	if (mismatchedSnapshotDigests.length > 0) {
		const message = `Caller-provided copied ${mismatchedSnapshotDigests.join(" and ")} digest did not match the observed snapshot.`;
		return createLegacyStateMigrationPlan({
			mode: params.mode,
			candidate: params.candidate,
			snapshot,
			steps: [],
			warnings: [...params.initialWarnings ?? [], message],
			refusal: {
				code: "snapshot-identity-mismatch",
				message
			}
		});
	}
	const pluginStateMigrationInventory = resolvePluginDoctorStateMigrationInventory({
		config: configBefore.config,
		env,
		candidateRoot: params.candidate.root,
		artifactPreservingReadOnly: true
	});
	const pluginInstallIndexStep = createPluginInstallIndexStep({
		stateDir: snapshot.stateDir,
		env,
		hasLegacy: migrationFileExists(resolveLegacyInstalledPluginIndexStorePath({ stateDir: snapshot.stateDir }))
	});
	if (pendingStateDirMigration && path.resolve(pendingStateDirMigration.source) !== requestedSnapshot.stateDir) {
		const message = `Pending legacy state root is outside the copied state snapshot: ${pendingStateDirMigration.source}`;
		return createLegacyStateMigrationPlan({
			mode: params.mode,
			candidate: params.candidate,
			snapshot,
			steps: [],
			warnings: [...params.initialWarnings ?? [], message],
			refusal: {
				code: "state-dir-source-outside-snapshot",
				message
			}
		});
	}
	const outsideSharedAuthSources = params.mode === "doctor" ? listMigrationEndpointsOutsideRoot([{
		kind: "sqlite",
		path: path.join(resolveSharedMainAuthAgentDir(env), "openclaw-agent.sqlite")
	}], snapshot.stateDir) : [];
	if (callerOAuthDir && oauthDirOutsideSnapshot || outsideSharedAuthSources.length > 0) {
		const refusal = callerOAuthDir && oauthDirOutsideSnapshot ? {
			code: "oauth-dir-outside-snapshot",
			message: `Configured OAuth migration directory is outside the copied state snapshot: ${callerOAuthDir}`
		} : {
			code: "shared-auth-source-outside-snapshot",
			message: "Selected shared-auth migration source is outside the copied state snapshot."
		};
		const detectionStep = createMigrationDetectionStep({
			configPath: snapshot.configPath,
			configIncludedPaths: configBefore.configIncludedPaths,
			stateDir: snapshot.stateDir,
			refusal,
			run: () => ({
				changes: [],
				warnings: [refusal.message]
			})
		});
		detectionStep.source = uniqueMigrationEndpoints([
			...detectionStep.source,
			...callerOAuthDir && oauthDirOutsideSnapshot ? [{
				kind: "path",
				path: callerOAuthDir
			}] : [],
			...outsideSharedAuthSources
		]);
		const steps = [
			createStateSchemaMigrationStep({
				stateDir: snapshot.stateDir,
				env,
				mode: params.mode,
				requiredness: "conditional"
			}),
			pluginInstallIndexStep,
			createConfigMachineStateStep({
				config: configBefore.config,
				configPath: snapshot.configPath,
				configIncludedPaths: configBefore.configIncludedPaths,
				stateDir: snapshot.stateDir,
				env
			}),
			createAgentTargetDiscoveryStep({
				configPath: snapshot.configPath,
				configIncludedPaths: configBefore.configIncludedPaths,
				stateDir: snapshot.stateDir,
				env,
				run: () => ({
					changes: [],
					warnings: []
				})
			}),
			...buildUnresolvedBlockedPreludeSteps(params.mode, invocationPurpose),
			detectionStep,
			...buildUnresolvedBlockedMigrationSteps({
				mode: params.mode,
				stateDir: snapshot.stateDir,
				env,
				skipAgentScopedMigrations: hasCustomAgentDirOverride(env),
				pluginStateMigrationInventory
			})
		];
		return createLegacyStateMigrationPlan({
			mode: params.mode,
			candidate: params.candidate,
			snapshot,
			steps: closeMigrationPlanTail(steps, detectionStep),
			warnings: [
				...params.initialWarnings ?? [],
				...configBefore.warnings,
				refusal.message
			],
			refusal
		});
	}
	const outsideSessionStoreEndpoints = listMigrationEndpointsOutsideRoot(resolveConfiguredSessionStoreEndpoints(configBefore.config, env), snapshot.stateDir);
	if (outsideSessionStoreEndpoints.length > 0) {
		const refusal = createSessionTargetOutsideSnapshotRefusal(outsideSessionStoreEndpoints);
		const discoveryStep = createAgentTargetDiscoveryStep({
			configPath: snapshot.configPath,
			configIncludedPaths: configBefore.configIncludedPaths,
			stateDir: snapshot.stateDir,
			env,
			refusal,
			run: () => ({
				changes: [],
				warnings: [refusal.message]
			})
		});
		discoveryStep.source = uniqueMigrationEndpoints([...discoveryStep.source, ...outsideSessionStoreEndpoints]);
		const blockedSteps = [
			createStateSchemaMigrationStep({
				stateDir: snapshot.stateDir,
				env,
				mode: params.mode,
				requiredness: "conditional"
			}),
			pluginInstallIndexStep,
			createConfigMachineStateStep({
				config: configBefore.config,
				configPath: snapshot.configPath,
				configIncludedPaths: configBefore.configIncludedPaths,
				stateDir: snapshot.stateDir,
				env
			}),
			discoveryStep,
			...buildUnresolvedBlockedPreludeSteps(params.mode, invocationPurpose),
			createMigrationDetectionStep({
				configPath: snapshot.configPath,
				configIncludedPaths: configBefore.configIncludedPaths,
				stateDir: snapshot.stateDir,
				run: () => ({
					changes: [],
					warnings: []
				})
			}),
			...buildUnresolvedBlockedMigrationSteps({
				mode: params.mode,
				stateDir: snapshot.stateDir,
				env,
				skipAgentScopedMigrations: hasCustomAgentDirOverride(env),
				pluginStateMigrationInventory
			})
		];
		return createLegacyStateMigrationPlan({
			mode: params.mode,
			candidate: params.candidate,
			snapshot,
			steps: closeMigrationPlanTail(blockedSteps, discoveryStep),
			warnings: [...params.initialWarnings ?? [], ...configBefore.warnings],
			refusal
		});
	}
	const doctorOnlyStateMigrations = params.mode === "doctor";
	const legacySessionSurfaces = params.legacySessionSurfaces ?? EMPTY_LEGACY_SESSION_SURFACES;
	let detected;
	try {
		detected = await detectLegacyStateMigrations({
			cfg: configBefore.config,
			mode: params.mode,
			env,
			homedir: () => snapshot.homeDir,
			pluginSessionStoreAgentIds: [],
			doctorOnlyStateMigrations,
			pluginPlanning: "deferred",
			artifactPreservingReadOnly: true,
			legacySessionSurfaces
		});
	} catch (error) {
		const message = `Could not inspect copied state migrations: ${String(error)}`;
		return createLegacyStateMigrationPlan({
			mode: params.mode,
			candidate: params.candidate,
			snapshot,
			steps: [],
			warnings: [
				...params.initialWarnings ?? [],
				...configBefore.warnings,
				message
			],
			refusal: {
				code: "migration-detection-failed",
				message
			}
		});
	}
	const planningWarnings = [
		...params.initialWarnings ?? [],
		...configBefore.warnings,
		...detected.warningDisposition === "recoverable" ? [] : detected.warnings
	];
	let agentDatabaseTargets = [];
	let registeredDatabases = [];
	let agentTargetRefusal;
	let agentTargetRefusalEndpoints = [];
	try {
		registeredDatabases = await inspectOpenClawRegisteredAgentDatabases({
			env,
			includeIncompatibleSchemaVersions: true
		});
		agentDatabaseTargets = hasCustomAgentDirOverride(env) ? [] : resolveConfiguredAgentDatabaseTargets(configBefore.config, {
			env,
			registeredDatabases
		});
		const boundTargets = bindAgentDatabaseTargetsToStateRoot(agentDatabaseTargets, snapshot.stateDir);
		agentDatabaseTargets = boundTargets.targets;
		if (boundTargets.refusal) {
			planningWarnings.push(boundTargets.refusal.message);
			agentTargetRefusal = boundTargets.refusal;
			agentTargetRefusalEndpoints = boundTargets.outsideEndpoints;
		}
	} catch (error) {
		const message = `Could not resolve configured agent migration targets: ${String(error)}`;
		planningWarnings.push(message);
		agentTargetRefusal = {
			code: "agent-target-discovery-failed",
			message
		};
	}
	const pluginIds = collectRelevantDoctorPluginIds(configBefore.config);
	const deferredPluginSessionStores = createDeferredPluginSessionStoreEndpoints(configBefore.config, pluginStateMigrationInventory);
	const copiedSessionStores = inspectOrphanSessionStoreEndpoints({
		config: configBefore.config,
		env,
		pluginSessionStoreAgentIds: [],
		registeredDatabases
	});
	planningWarnings.push(...copiedSessionStores.warnings);
	const sessionTargetRefusal = copiedSessionStores.warnings.length > 0 ? {
		code: "session-target-discovery-failed",
		message: copiedSessionStores.warnings.join("\n")
	} : createDeferredPluginSessionStoreRefusal(deferredPluginSessionStores);
	const skipAgentScopedMigrations = hasCustomAgentDirOverride(env);
	const mainSteps = buildLegacyStateMigrationSteps({
		mode: params.mode,
		detected,
		config: configBefore.config,
		env,
		agentDatabaseEndpoints: agentDatabaseTargets.map(({ path: databasePath }) => ({
			kind: "sqlite",
			path: databasePath
		})),
		legacySessionStoreEndpoints: uniqueMigrationEndpoints([...copiedSessionStores.endpoints, ...deferredPluginSessionStores]),
		legacySessionStoreRefusal: sessionTargetRefusal,
		skipAgentScopedMigrations,
		pluginStateMigrationInventory,
		legacySessionSurfaces
	});
	for (const step of mainSteps) if (step.id === "skill-workshop") step.refusal = {
		code: "skill-workshop-planning-deferred",
		message: "Skill Workshop relocation requires separately bound workspace and skill targets."
	};
	const [stateSchemaStep, plannedPluginInstallIndexStep, ...remainingMainSteps] = mainSteps;
	if (!stateSchemaStep || stateSchemaStep.id !== "state-schema") throw new Error("legacy state migration plan is missing its state-schema prelude");
	if (plannedPluginInstallIndexStep?.id !== "plugin-install-index") throw new Error("legacy state migration plan is missing its plugin-install-index prelude");
	const pluginPreparationRefusal = createPluginMigrationPreparationRefusal({
		inventory: pluginStateMigrationInventory,
		deferredSessionStoreEndpoints: deferredPluginSessionStores
	});
	const plannedAgentTargetDiscoveryStep = createAgentTargetDiscoveryStep({
		configPath: snapshot.configPath,
		configIncludedPaths: configBefore.configIncludedPaths,
		stateDir: snapshot.stateDir,
		env,
		refusal: agentTargetRefusal,
		run: () => ({
			changes: [],
			warnings: agentTargetRefusal ? [agentTargetRefusal.message] : []
		})
	});
	plannedAgentTargetDiscoveryStep.source = uniqueMigrationEndpoints([...plannedAgentTargetDiscoveryStep.source, ...agentTargetRefusalEndpoints]);
	const migrationDetectionStep = createMigrationDetectionStep({
		configPath: snapshot.configPath,
		configIncludedPaths: configBefore.configIncludedPaths,
		stateDir: snapshot.stateDir,
		refusal: detected.warnings.length > 0 && detected.warningDisposition !== "recoverable" ? {
			code: "migration-detection-warning",
			message: detected.warnings.join("\n")
		} : void 0,
		run: () => ({
			changes: [],
			warnings: detected.warnings
		})
	});
	const steps = [
		stateSchemaStep,
		plannedPluginInstallIndexStep,
		createConfigMachineStateStep({
			config: configBefore.config,
			configPath: snapshot.configPath,
			configIncludedPaths: configBefore.configIncludedPaths,
			stateDir: snapshot.stateDir,
			env
		}),
		plannedAgentTargetDiscoveryStep,
		...buildLegacyStateMigrationPreludeSteps({
			mode: params.mode,
			invocationPurpose,
			config: configBefore.config,
			configPath: snapshot.configPath,
			configIncludedPaths: configBefore.configIncludedPaths,
			stateDir: snapshot.stateDir,
			env,
			homedir: () => snapshot.homeDir,
			agentDatabaseTargets,
			orphanSessionStores: copiedSessionStores,
			pluginSessionStoreAgentIds: [],
			legacySessionSurfaces,
			deferredPluginSessionStoreEndpoints: deferredPluginSessionStores,
			readOnlyPlanning: true,
			...params.mode === "doctor" ? { pluginPreparation: createPluginMigrationPreparationStep({
				configPath: snapshot.configPath,
				configIncludedPaths: configBefore.configIncludedPaths,
				pluginIds,
				refusal: pluginPreparationRefusal,
				run: () => ({
					changes: [],
					warnings: pluginPreparationRefusal ? [pluginPreparationRefusal.message] : []
				})
			}) } : {}
		}),
		migrationDetectionStep,
		...remainingMainSteps
	].map(migrationStepPlan);
	if (detected.stateSchema.hasLegacy) {
		const sharedAuthStep = steps.find((step) => step.id === "shared-auth-store");
		if (sharedAuthStep) {
			sharedAuthStep.requiredness = "conditional";
			sharedAuthStep.refusal = {
				code: "state-schema-planning-deferred",
				message: "Shared auth migration inspection is deferred until the copied state schema is repaired."
			};
		}
	}
	if (sessionTargetRefusal) {
		for (const step of steps) if (step.id === "acp-session-metadata") step.refusal = sessionTargetRefusal;
	}
	const channelPairingStep = steps.find((step) => step.id === "channel-pairing");
	if (channelPairingStep && detected.channelPairing.accountDiscoveryDeferred) {
		channelPairingStep.requiredness = "conditional";
		channelPairingStep.refusal = {
			code: "plugin-planning-deferred",
			message: "Channel pairing accounts will be checked with the updated plugins."
		};
	}
	const firstRefusalIndex = steps.findIndex((step) => step.refusal !== void 0);
	const firstRefusal = steps[firstRefusalIndex];
	if (firstRefusal) for (const step of steps.slice(firstRefusalIndex + 1)) step.refusal = {
		code: "blocked-by-prior-refusal",
		message: `Migration step "${step.id}" is blocked by prior refusal at "${firstRefusal.id}".`
	};
	const stateDirRefusal = pendingStateDirMigration ? {
		code: "state-dir-planning-deferred",
		message: "Legacy state-root relocation must complete before copied-state migrations are planned."
	} : void 0;
	const plannedSteps = pendingStateDirMigration ? [{
		id: "state-dir",
		phase: "shared",
		source: [{
			kind: "path",
			path: pendingStateDirMigration.source
		}],
		target: [{
			kind: "path",
			path: pendingStateDirMigration.target
		}],
		requiredness: "required",
		reversibility: "checkpoint-required",
		refusal: stateDirRefusal
	}, ...steps.map((step) => ({
		...step,
		source: step.source.map((endpoint) => remapMigrationEndpointRoot(endpoint, pendingStateDirMigration.source, pendingStateDirMigration.target)),
		target: step.target.map((endpoint) => remapMigrationEndpointRoot(endpoint, pendingStateDirMigration.source, pendingStateDirMigration.target)),
		refusal: {
			code: "blocked-by-prior-refusal",
			message: `Migration step "${step.id}" is deferred until legacy state-root relocation is complete.`
		}
	}))] : steps;
	const plan = createLegacyStateMigrationPlan({
		mode: params.mode,
		candidate: params.candidate,
		snapshot,
		steps: plannedSteps,
		warnings: planningWarnings,
		advisoryWarnings: detected.warningDisposition === "recoverable" ? detected.warnings : [],
		...stateDirRefusal ? { refusal: stateDirRefusal } : {}
	});
	const identityAfter = await captureLegacyStateSnapshotIdentity({
		...requestedSnapshot,
		configInputHashes: configBefore.configInputHashes
	});
	if (identityAfter.warnings.length > 0) return refuseLegacyStateMigrationPlan(plan, {
		code: "snapshot-identity-unavailable",
		message: identityAfter.warnings.join("\n")
	});
	if (identityAfter.configDigest !== configBefore.rootDigest || identityBefore.stateDigest !== identityAfter.stateDigest) return refuseLegacyStateMigrationPlan(plan, {
		code: "snapshot-identity-changed",
		message: "Copied config or state changed while migration planning was in progress."
	});
	return plan;
}
function refusedStepReceipt(step, error) {
	const message = error instanceof Error ? error.message : String(error);
	return {
		...migrationStepPlan(step),
		outcome: "refused",
		changes: [],
		warnings: [message],
		refusal: {
			code: "step-threw",
			message
		}
	};
}
async function runLegacyStateMigrationSteps(steps, onStepReceipt, shouldRun, options) {
	const sources = [];
	const sharedSources = [];
	const finalSources = [];
	const sharedNoticeSources = [];
	const finalNoticeSources = [];
	const entries = [];
	const receipts = [];
	const deferredSteps = [];
	let haltedBy;
	for (let index = 0; index < steps.length; index += 1) {
		const step = steps[index];
		if (!step) continue;
		const refusedDependencies = [...options?.refusedAgentDatabasePaths ?? []].filter((databasePath) => step.deferredExecution?.kind === "post-session-plugin" || step.reversibility !== "not-applicable" && [...step.source, ...step.target].some((endpoint) => endpoint.kind !== "owner" && (path.resolve(endpoint.path) === databasePath || endpoint.kind === "path" && isPathInside(endpoint.path, databasePath))));
		if (refusedDependencies.length > 0) {
			const message = `Migration step "${step.id}" was not run because it requires refused agent database(s): ${refusedDependencies.join(", ")}.`;
			const result = {
				changes: [],
				warnings: [message]
			};
			const receipt = {
				...migrationStepPlan(step),
				outcome: "refused",
				...result,
				refusal: {
					code: "blocked-by-agent-database-refusal",
					message
				},
				refusedAgentDatabasePaths: refusedDependencies
			};
			entries.push({
				id: step.id,
				result
			});
			receipts.push(receipt);
			onStepReceipt?.(receipt);
			sources.push(result);
			(step.phase === "shared" ? sharedSources : finalSources).push(result);
			continue;
		}
		if (step.deferredExecution) {
			deferredSteps.push(step);
			continue;
		}
		if (shouldRun && !shouldRun(step) && step.requiredness === "not-required") {
			const receipt = {
				...migrationStepPlan(step),
				outcome: "skipped",
				changes: [],
				warnings: []
			};
			receipts.push(receipt);
			onStepReceipt?.(receipt);
			continue;
		}
		let result;
		try {
			result = await step.run();
		} catch (error) {
			const receipt = refusedStepReceipt(step, error);
			result = {
				changes: [],
				warnings: receipt.warnings
			};
			entries.push({
				id: step.id,
				result
			});
			receipts.push(receipt);
			onStepReceipt?.(receipt);
			options?.onUnexpectedFailure?.(error);
			sources.push(result);
			(step.phase === "shared" ? sharedSources : finalSources).push(result);
			haltedBy = receipt;
			receipts.push(...createBlockedLegacyStateMigrationStepReceipts({
				steps: steps.slice(index + 1),
				blocker: receipt,
				onStepReceipt
			}));
			break;
		}
		const receipt = createLegacyStateMigrationStepReceipt(migrationStepPlan(step), result);
		entries.push({
			id: step.id,
			result
		});
		receipts.push(receipt);
		onStepReceipt?.(receipt);
		sources.push(result);
		(step.phase === "shared" ? sharedSources : finalSources).push(result);
		if (step.collectNotices) (step.phase === "shared" ? sharedNoticeSources : finalNoticeSources).push(result);
		if (receipt.outcome === "refused") {
			if (step.id === "media-persistence" && result.refusedAgentDatabasePaths?.length && options?.refusedAgentDatabasePaths) {
				for (const databasePath of result.refusedAgentDatabasePaths) options.refusedAgentDatabasePaths.add(path.resolve(databasePath));
				continue;
			}
			haltedBy = receipt;
			receipts.push(...createBlockedLegacyStateMigrationStepReceipts({
				steps: steps.slice(index + 1),
				blocker: receipt,
				onStepReceipt
			}));
			break;
		}
	}
	return {
		sources,
		sharedSources,
		finalSources,
		sharedNoticeSources,
		finalNoticeSources,
		entries,
		receipts,
		deferredSteps,
		haltedBy
	};
}
function completedPluginMigrationFields(sources) {
	const completedPluginIds = [...new Set(sources.flatMap((source) => source.completedPluginIds ?? []))].toSorted();
	const requiredPluginIds = [...new Set(sources.flatMap((source) => source.requiredPluginIds ?? []))].toSorted();
	const statelessPluginIds = [...new Set(sources.flatMap((source) => source.statelessPluginIds ?? []))].toSorted();
	return {
		...completedPluginIds.length > 0 ? { completedPluginIds } : {},
		...requiredPluginIds.length > 0 ? { requiredPluginIds } : {},
		...statelessPluginIds.length > 0 ? { statelessPluginIds } : {}
	};
}
/** Admit preflight's shared-state writers through the same schema step as later migrations. */
async function prepareLegacyStateDatabaseSchema(env) {
	const { receipts } = await runLegacyStateMigrationSteps([createStateSchemaMigrationStep({
		stateDir: resolveStateDir(env),
		env,
		mode: "doctor-preparation",
		requiredness: "conditional"
	})]);
	return receipts[0];
}
async function runLegacyStateMigrations(params) {
	const detected = params.detected;
	const env = params.env ?? process.env;
	const config = params.config ?? {};
	const legacySessionSurfaces = params.legacySessionSurfaces;
	const buildSteps = (pluginStateMigrationInventory) => buildLegacyStateMigrationSteps({
		mode: "doctor",
		detected,
		config,
		env,
		now: params.now,
		recoverCorruptTargetStore: params.recoverCorruptTargetStore,
		pluginStateMigrationInventory,
		deferPostSessionPluginMigrations: false,
		legacySessionSurfaces
	});
	const [stateSchemaStep, pluginInstallIndexStep, ...remainingSteps] = buildSteps();
	if (!stateSchemaStep || stateSchemaStep.id !== "state-schema") throw new Error("legacy state migration plan is missing its state-schema prelude");
	if (pluginInstallIndexStep?.id !== "plugin-install-index") throw new Error("legacy state migration plan is missing its plugin-install-index prelude");
	const preparation = await runLegacyStateMigrationSteps([stateSchemaStep, pluginInstallIndexStep], params.onStepReceipt);
	if (preparation.haltedBy) {
		const notices = mergeNotices(preparation.sources);
		return {
			changes: preparation.sources.flatMap((source) => source.changes),
			warnings: preparation.sources.flatMap((source) => source.warnings),
			...notices.length > 0 ? { notices } : {},
			mode: "doctor",
			stepReceipts: [...preparation.receipts, ...createBlockedLegacyStateMigrationStepReceipts({
				steps: remainingSteps,
				blocker: preparation.haltedBy,
				onStepReceipt: params.onStepReceipt
			})]
		};
	}
	const migrations = await runLegacyStateMigrationSteps(buildSteps(resolveLivePluginDoctorStateMigrationInventory({
		config,
		env
	})).slice(2), params.onStepReceipt);
	const notices = mergeNotices([
		...preparation.sources,
		...migrations.sharedNoticeSources,
		...migrations.finalNoticeSources
	]);
	return {
		mode: "doctor",
		...completedPluginMigrationFields(migrations.sources),
		stepReceipts: [...preparation.receipts, ...migrations.receipts],
		changes: [...preparation.sources, ...migrations.sources].flatMap((source) => source.changes),
		warnings: [.../* @__PURE__ */ new Set([
			...preparation.sources.flatMap((source) => source.warnings),
			...detected.warnings,
			...migrations.sources.flatMap((source) => source.warnings)
		])],
		...notices.length > 0 ? { notices } : {}
	};
}
/** Run canonical startup migrations and explicit Doctor-owned file repairs. */
async function autoMigrateLegacyState(params) {
	let failure;
	const result = await executeLegacyStateMigrations(params, (error) => {
		failure ??= { error };
	});
	if (params.doctorOnlyStateMigrations !== true && failure) throw failure.error;
	return result;
}
async function executeLegacyStateMigrations(params, onUnexpectedFailure) {
	const env = params.env ?? process.env;
	const homedir = params.homedir ?? os.homedir;
	const mode = params.doctorOnlyStateMigrations === true ? "doctor" : "automatic";
	const invocationPurpose = params.invocationPurpose ?? (mode === "doctor" ? "doctor" : "startup");
	const useStartupOnceCache = mode === "automatic" && invocationPurpose === "startup";
	const executionOptions = {
		onUnexpectedFailure,
		refusedAgentDatabasePaths: new Set(mode === "automatic" ? listAgentDatabaseAdmissionRefusals({ env }).flatMap((refusal) => refusal.paths.map((pathname) => path.resolve(pathname))) : [])
	};
	const initialStateDir = resolveStateDir(env, homedir);
	const checkKey = `${path.resolve(initialStateDir)}\0${mode}`;
	if (useStartupOnceCache && autoMigrateChecked.has(checkKey)) return {
		mode,
		migrated: false,
		skipped: true,
		changes: [],
		warnings: [],
		stepReceipts: []
	};
	if (useStartupOnceCache) autoMigrateChecked.add(checkKey);
	const pluginDoctorConfig = params.pluginDoctorConfig ?? params.cfg;
	const configIncludedPaths = params.configIncludedPaths ?? [];
	const configuredPluginIds = collectRelevantDoctorPluginIds(pluginDoctorConfig);
	let pluginStateMigrationInventory = resolveLivePluginDoctorStateMigrationInventory({
		config: pluginDoctorConfig,
		env
	});
	let pluginInstallIndexStep = createPluginInstallIndexStep({
		stateDir: initialStateDir,
		env,
		hasLegacy: migrationFileExists(resolveLegacyInstalledPluginIndexStorePath({ stateDir: initialStateDir }))
	});
	const pendingStateDirMigration = resolvePendingLegacyStateDirMigrationPaths({
		env,
		homedir
	});
	const stateDirStep = pendingStateDirMigration ? {
		id: "state-dir",
		phase: "shared",
		source: [{
			kind: "path",
			path: pendingStateDirMigration.source
		}],
		target: [{
			kind: "path",
			path: pendingStateDirMigration.target
		}],
		requiredness: "required",
		reversibility: "checkpoint-required",
		run: async () => {
			const result = await autoMigrateLegacyStateDir({
				env,
				homedir,
				log: params.log
			});
			const stillPending = resolvePendingLegacyStateDirMigrationPaths({
				env,
				homedir
			});
			return stillPending ? {
				...result,
				warnings: [...result.warnings, `State directory migration remains pending (${stillPending.source} → ${stillPending.target}).`]
			} : result;
		}
	} : void 0;
	const stateDirMigration = stateDirStep ? await runLegacyStateMigrationSteps([stateDirStep], params.onStepReceipt, void 0, executionOptions) : void 0;
	const stateDirResult = stateDirMigration?.entries[0]?.result ?? {
		changes: [],
		warnings: []
	};
	const stateDir = resolveStateDir(env, homedir);
	if (useStartupOnceCache) autoMigrateChecked.add(`${path.resolve(stateDir)}\0${mode}`);
	const stateEnv = {
		...env,
		OPENCLAW_STATE_DIR: stateDir
	};
	const stateSchemaOptions = { env: stateEnv };
	const configPath = resolveConfigPath(env, stateDir, homedir);
	let agentDatabaseTargets = [];
	let preparedSessionStores;
	let pluginSessionStoreAgentIds = [];
	let legacySessionSurfaces = EMPTY_LEGACY_SESSION_SURFACES;
	let sessionStoreOwnership;
	let detected;
	const pluginPreparation = createPluginMigrationPreparationStep({
		configPath,
		configIncludedPaths,
		pluginIds: configuredPluginIds,
		run: async () => {
			if (pluginStateMigrationInventory.resolutionFailure) {
				pluginPreparation.refusal = pluginStateMigrationInventory.resolutionFailure;
				return {
					changes: [],
					warnings: [pluginPreparation.refusal.message]
				};
			}
			pluginSessionStoreAgentIds = listPluginDoctorSessionStoreAgentIds({
				config: pluginDoctorConfig,
				env,
				pluginIds: configuredPluginIds
			});
			legacySessionSurfaces = params.legacySessionSurfaces ?? (await import("./legacy-session-surfaces--zzIt7mK.mjs")).prepareLegacySessionSurfaces({
				config: params.cfg,
				env
			});
			const ownershipAgentId = tryResolveDoctorSessionMigrationAgentId(params.cfg, resolveInstallAgentDir((resolutionEnv) => readCurrentConfigForResolution({
				config: params.cfg,
				env: resolutionEnv
			}), {
				env,
				homedir
			}).migrationTarget?.owner);
			sessionStoreOwnership = ownershipAgentId ? resolveSessionStoreOwnership({
				cfg: params.cfg,
				env,
				stateDir,
				targetAgentId: ownershipAgentId,
				pluginSessionStoreAgentIds
			}) : void 0;
			return {
				changes: [],
				warnings: [...legacySessionSurfaces.failures]
			};
		}
	});
	const buildPreludeSteps = (overrides) => buildLegacyStateMigrationPreludeSteps({
		mode,
		invocationPurpose,
		config: params.cfg,
		configPath,
		configIncludedPaths,
		stateDir,
		env,
		homedir,
		agentDatabaseTargets,
		agentDatabaseMigrationDiscovery: params.agentDatabaseMigrationDiscovery,
		orphanSessionStores: overrides?.orphanSessionStores,
		pluginSessionStoreAgentIds: overrides?.pluginSessionStoreAgentIds ?? pluginSessionStoreAgentIds,
		legacySessionSurfaces: overrides?.legacySessionSurfaces ?? legacySessionSurfaces,
		...mode === "doctor" ? { pluginPreparation } : {}
	});
	const createDetectionStep = () => createMigrationDetectionStep({
		configPath,
		configIncludedPaths,
		stateDir,
		run: async () => {
			detected = await detectLegacyStateMigrations({
				cfg: params.cfg,
				mode,
				pluginDoctorConfig: params.pluginDoctorConfig,
				...mode === "doctor" ? { pluginSessionStoreAgentIds } : {},
				sessionStoreOwnership,
				env,
				homedir: params.homedir,
				doctorOnlyStateMigrations: mode === "doctor",
				allowLegacyDeviceIdentityImport: params.allowLegacyDeviceIdentityImport,
				legacySessionSurfaces
			});
			return {
				changes: [],
				warnings: detected.warnings,
				warningDisposition: detected.warningDisposition,
				outcome: detected.outcome,
				...detected.notices.length > 0 ? { notices: detected.notices } : {}
			};
		}
	});
	const buildDetectedMigrationSteps = (migrationDetection) => {
		const hasCustomAgentDir = hasCustomAgentDirOverride(env);
		const discoveredSessionStores = preparedSessionStores ?? inspectOrphanSessionStoreEndpoints({
			config: params.cfg,
			env: stateEnv,
			pluginSessionStoreAgentIds: migrationDetection.pluginSessionStoreAgentIds
		});
		const legacySessionStoreRefusal = discoveredSessionStores.warnings.length > 0 ? {
			code: "session-target-discovery-failed",
			message: discoveredSessionStores.warnings.join("\n")
		} : void 0;
		return buildLegacyStateMigrationSteps({
			mode,
			detected: migrationDetection,
			config: pluginDoctorConfig,
			sessionConfig: params.cfg,
			env,
			now: params.now,
			agentDatabaseEndpoints: agentDatabaseTargets.map(({ path: databasePath }) => ({
				kind: "sqlite",
				path: databasePath
			})),
			legacySessionStoreEndpoints: discoveredSessionStores.endpoints,
			legacySessionStoreRefusal,
			recoverCorruptTargetStore: params.recoverCorruptTargetStore,
			skipAgentScopedMigrations: hasCustomAgentDir,
			allowLegacyDeviceIdentityImport: params.allowLegacyDeviceIdentityImport,
			pluginStateMigrationInventory,
			legacySessionSurfaces,
			beforeWorkspaceStateMigration: params.beforeWorkspaceStateMigration
		}).filter((step) => step.id !== "state-schema" && step.id !== "plugin-install-index");
	};
	const completeBlockedPlanReceipts = async (paramsForBlockedPlan) => {
		const receipts = [...paramsForBlockedPlan.receipts, ...createBlockedLegacyStateMigrationStepReceipts({
			steps: paramsForBlockedPlan.pendingPreludeSteps,
			blocker: paramsForBlockedPlan.blocker,
			onStepReceipt: params.onStepReceipt
		})];
		const blockedSteps = [createMigrationDetectionStep({
			configPath,
			configIncludedPaths,
			stateDir,
			run: () => ({
				changes: [],
				warnings: []
			})
		}), ...buildUnresolvedBlockedMigrationSteps({
			mode,
			stateDir,
			env,
			skipAgentScopedMigrations: hasCustomAgentDirOverride(env),
			pluginStateMigrationInventory
		})];
		receipts.push(...createBlockedLegacyStateMigrationStepReceipts({
			steps: blockedSteps,
			blocker: paramsForBlockedPlan.blocker,
			onStepReceipt: params.onStepReceipt
		}));
		return receipts;
	};
	let stateSchemaStep = createStateSchemaMigrationStep({
		stateDir,
		env,
		mode,
		requiredness: "conditional"
	});
	const configMachineStateStep = createConfigMachineStateStep({
		config: pluginDoctorConfig,
		configPath,
		configIncludedPaths,
		stateDir,
		env
	});
	const agentTargetDiscoveryStep = createAgentTargetDiscoveryStep({
		configPath,
		configIncludedPaths,
		stateDir,
		env,
		run: () => {
			try {
				agentDatabaseTargets = hasCustomAgentDirOverride(env) ? [] : resolveConfiguredAgentDatabaseTargets(params.cfg, { env: stateEnv });
				return {
					changes: [],
					warnings: []
				};
			} catch (error) {
				if (mode === "automatic") throw error;
				const message = `Could not resolve configured agent migration targets: ${String(error)}`;
				agentTargetDiscoveryStep.refusal = {
					code: "agent-target-discovery-failed",
					message
				};
				return {
					changes: [],
					warnings: [message]
				};
			}
		}
	});
	if (stateDirMigration?.haltedBy && stateDirStep) {
		const notices = mergeNotices([stateDirResult]);
		logStateMigrationResult({
			changes: stateDirResult.changes,
			warnings: stateDirResult.warnings,
			notices
		}, params.log);
		return {
			mode,
			migrated: stateDirResult.changes.length > 0,
			skipped: false,
			changes: stateDirResult.changes,
			warnings: stateDirResult.warnings,
			stepReceipts: await completeBlockedPlanReceipts({
				receipts: stateDirMigration.receipts,
				blocker: stateDirMigration.haltedBy,
				pendingPreludeSteps: [
					stateSchemaStep,
					pluginInstallIndexStep,
					configMachineStateStep,
					agentTargetDiscoveryStep,
					...buildUnresolvedBlockedPreludeSteps(mode, invocationPurpose)
				]
			}),
			...notices.length > 0 ? { notices } : {}
		};
	}
	pluginInstallIndexStep = createPluginInstallIndexStep({
		stateDir,
		env: stateEnv,
		hasLegacy: migrationFileExists(resolveLegacyInstalledPluginIndexStorePath({ stateDir }))
	});
	try {
		if (detectOpenClawStateDatabaseSchemaMigrations(stateSchemaOptions).length > 0) stateSchemaStep = createStateSchemaMigrationStep({
			stateDir,
			env,
			mode,
			requiredness: "required"
		});
	} catch {}
	const stateSchemaMigration = await runLegacyStateMigrationSteps([stateSchemaStep, pluginInstallIndexStep], params.onStepReceipt, void 0, executionOptions);
	const stateSchemaResult = stateSchemaMigration.entries[0]?.result ?? {
		changes: [],
		warnings: []
	};
	const stateSchema = {
		changes: [...stateDirResult.changes, ...stateSchemaMigration.sources.flatMap((source) => source.changes)],
		warnings: [...stateDirResult.warnings, ...stateSchemaMigration.sources.flatMap((source) => source.warnings)],
		notices: mergeNotices([stateDirResult, ...stateSchemaMigration.sources])
	};
	stateSchemaMigration.receipts.unshift(...stateDirMigration?.receipts ?? []);
	if (stateSchemaMigration.haltedBy) {
		if (mode !== "doctor" && stateSchemaResult.warnings.length > 0) onUnexpectedFailure(new Error(formatStartupMigrationFailure(stateSchemaResult.warnings)));
		const pendingPreludeSteps = [
			configMachineStateStep,
			agentTargetDiscoveryStep,
			...buildUnresolvedBlockedPreludeSteps(mode, invocationPurpose)
		];
		return {
			mode,
			migrated: stateSchema.changes.length > 0,
			skipped: false,
			changes: stateSchema.changes,
			warnings: stateSchema.warnings,
			...stateSchema.notices?.length ? { notices: stateSchema.notices } : {},
			stepReceipts: await completeBlockedPlanReceipts({
				receipts: stateSchemaMigration.receipts,
				blocker: stateSchemaMigration.haltedBy,
				pendingPreludeSteps
			})
		};
	}
	if (stateSchema.changes.length > 0) pluginStateMigrationInventory = resolveLivePluginDoctorStateMigrationInventory({
		config: pluginDoctorConfig,
		env
	});
	const configMachineStateMigration = await runLegacyStateMigrationSteps([configMachineStateStep], params.onStepReceipt, void 0, executionOptions);
	const configMachineState = configMachineStateMigration.entries[0]?.result ?? {
		changes: [],
		warnings: []
	};
	if (configMachineStateMigration.haltedBy) return {
		mode,
		migrated: stateSchema.changes.length > 0,
		skipped: false,
		changes: stateSchema.changes,
		warnings: [...stateSchema.warnings, ...configMachineState.warnings],
		...stateSchema.notices?.length ? { notices: stateSchema.notices } : {},
		stepReceipts: await completeBlockedPlanReceipts({
			receipts: [...stateSchemaMigration.receipts, ...configMachineStateMigration.receipts],
			blocker: configMachineStateMigration.haltedBy,
			pendingPreludeSteps: [agentTargetDiscoveryStep, ...buildUnresolvedBlockedPreludeSteps(mode, invocationPurpose)]
		})
	};
	const agentTargetDiscovery = await runLegacyStateMigrationSteps([agentTargetDiscoveryStep], params.onStepReceipt, void 0, executionOptions);
	const agentTargetResult = agentTargetDiscovery.entries[0]?.result ?? {
		changes: [],
		warnings: []
	};
	if (agentTargetDiscovery.haltedBy) {
		const changes = [...stateSchema.changes, ...configMachineState.changes];
		return {
			mode,
			migrated: changes.length > 0,
			skipped: false,
			changes,
			warnings: [
				...stateSchema.warnings,
				...configMachineState.warnings,
				...agentTargetResult.warnings
			],
			...stateSchema.notices?.length ? { notices: stateSchema.notices } : {},
			stepReceipts: await completeBlockedPlanReceipts({
				receipts: [
					...stateSchemaMigration.receipts,
					...configMachineStateMigration.receipts,
					...agentTargetDiscovery.receipts
				],
				blocker: agentTargetDiscovery.haltedBy,
				pendingPreludeSteps: buildUnresolvedBlockedPreludeSteps(mode, invocationPurpose)
			})
		};
	}
	const initialPreludeSteps = buildPreludeSteps({
		pluginSessionStoreAgentIds: [],
		legacySessionSurfaces: EMPTY_LEGACY_SESSION_SURFACES
	});
	const preludeReceipts = [...configMachineStateMigration.receipts, ...agentTargetDiscovery.receipts];
	const runPreludeStep = async (steps, id) => {
		const step = steps.find((candidate) => candidate.id === id);
		if (!step) return {
			changes: [],
			warnings: []
		};
		const execution = await runLegacyStateMigrationSteps([step], params.onStepReceipt, void 0, executionOptions);
		preludeReceipts.push(...execution.receipts);
		return {
			...execution.entries[0]?.result ?? {
				changes: [],
				warnings: []
			},
			haltedBy: execution.haltedBy
		};
	};
	const pendingPreludeAfter = (steps, blockerId) => {
		const blockerIndex = steps.findIndex((step) => step.id === blockerId);
		return blockerIndex < 0 ? [] : steps.slice(blockerIndex + 1);
	};
	const mediaPersistence = await runPreludeStep(initialPreludeSteps, "media-persistence");
	const transcriptDirectives = !mediaPersistence.haltedBy ? await runPreludeStep(initialPreludeSteps, "transcript-directives") : {
		changes: [],
		warnings: [],
		haltedBy: void 0
	};
	const persistenceRefusal = mediaPersistence.haltedBy ?? transcriptDirectives.haltedBy;
	if (persistenceRefusal) {
		const blocker = persistenceRefusal;
		return {
			mode,
			migrated: stateSchema.changes.length > 0 || configMachineState.changes.length > 0 || transcriptDirectives.changes.length > 0 || mediaPersistence.changes.length > 0,
			skipped: false,
			changes: [
				...stateSchema.changes,
				...configMachineState.changes,
				...transcriptDirectives.changes,
				...mediaPersistence.changes
			],
			warnings: [
				...stateSchema.warnings,
				...transcriptDirectives.warnings,
				...mediaPersistence.warnings
			],
			...stateSchema.notices?.length ? { notices: stateSchema.notices } : {},
			stepReceipts: await completeBlockedPlanReceipts({
				receipts: [...stateSchemaMigration.receipts, ...preludeReceipts],
				blocker,
				pendingPreludeSteps: pendingPreludeAfter(initialPreludeSteps, blocker.id)
			})
		};
	}
	const profileWorkspace = await runPreludeStep(initialPreludeSteps, "profile-workspace");
	if (profileWorkspace.haltedBy) {
		const completed = [
			stateSchema,
			configMachineState,
			mediaPersistence,
			transcriptDirectives
		];
		const changes = completed.flatMap((result) => result.changes);
		const warnings = [...completed.flatMap((result) => result.warnings), ...profileWorkspace.warnings];
		const notices = mergeNotices(completed);
		logStateMigrationResult({
			changes,
			warnings,
			notices
		}, params.log);
		const blocker = profileWorkspace.haltedBy;
		return {
			mode,
			migrated: changes.length > 0,
			skipped: false,
			changes,
			warnings,
			...notices.length > 0 ? { notices } : {},
			stepReceipts: await completeBlockedPlanReceipts({
				receipts: [...stateSchemaMigration.receipts, ...preludeReceipts],
				blocker,
				pendingPreludeSteps: pendingPreludeAfter(initialPreludeSteps, blocker.id)
			})
		};
	}
	const pluginPreparationResult = await runPreludeStep(initialPreludeSteps, "plugin-migration-preparation");
	if (pluginPreparationResult.haltedBy) {
		const completed = [
			stateSchema,
			configMachineState,
			mediaPersistence,
			transcriptDirectives,
			profileWorkspace
		];
		const blocker = pluginPreparationResult.haltedBy;
		return {
			mode,
			migrated: completed.some((result) => result.changes.length > 0),
			skipped: false,
			changes: completed.flatMap((result) => result.changes),
			warnings: [...completed.flatMap((result) => result.warnings), ...pluginPreparationResult.warnings],
			...stateSchema.notices?.length ? { notices: stateSchema.notices } : {},
			stepReceipts: await completeBlockedPlanReceipts({
				receipts: [...stateSchemaMigration.receipts, ...preludeReceipts],
				blocker,
				pendingPreludeSteps: pendingPreludeAfter(initialPreludeSteps, blocker.id)
			})
		};
	}
	if (mode === "doctor") preparedSessionStores = inspectOrphanSessionStoreEndpoints({
		config: params.cfg,
		env: stateEnv,
		pluginSessionStoreAgentIds
	});
	const orphanKeys = await runPreludeStep(buildPreludeSteps({ orphanSessionStores: preparedSessionStores }), "orphan-session-keys");
	if (orphanKeys.changes.length > 0) preparedSessionStores = void 0;
	if (orphanKeys.haltedBy) {
		const completed = [
			stateSchema,
			configMachineState,
			mediaPersistence,
			transcriptDirectives,
			profileWorkspace,
			orphanKeys
		];
		const blocker = orphanKeys.haltedBy;
		return {
			mode,
			migrated: completed.some((result) => result.changes.length > 0),
			skipped: false,
			changes: completed.flatMap((result) => result.changes),
			warnings: completed.flatMap((result) => result.warnings),
			...stateSchema.notices?.length ? { notices: stateSchema.notices } : {},
			stepReceipts: await completeBlockedPlanReceipts({
				receipts: [...stateSchemaMigration.receipts, ...preludeReceipts],
				blocker,
				pendingPreludeSteps: []
			})
		};
	}
	const detectionExecution = await runLegacyStateMigrationSteps([createDetectionStep()], params.onStepReceipt, void 0, executionOptions);
	preludeReceipts.push(...detectionExecution.receipts);
	if (detectionExecution.haltedBy || !detected) {
		preludeReceipts.push(...createBlockedLegacyStateMigrationStepReceipts({
			steps: buildUnresolvedBlockedMigrationSteps({
				mode,
				stateDir,
				env,
				skipAgentScopedMigrations: hasCustomAgentDirOverride(env),
				pluginStateMigrationInventory
			}),
			blocker: detectionExecution.receipts[0],
			onStepReceipt: params.onStepReceipt
		}));
		const completed = [
			stateSchema,
			configMachineState,
			mediaPersistence,
			transcriptDirectives,
			profileWorkspace,
			orphanKeys,
			...detectionExecution.sources
		];
		const changes = completed.flatMap((result) => result.changes);
		const warnings = [...new Set(completed.flatMap((result) => result.warnings))];
		const notices = mergeNotices(completed);
		logStateMigrationResult({
			changes,
			warnings,
			notices
		}, params.log);
		return {
			mode,
			migrated: changes.length > 0,
			skipped: false,
			changes,
			warnings,
			stepReceipts: [...stateSchemaMigration.receipts, ...preludeReceipts],
			...notices.length > 0 ? { notices } : {}
		};
	}
	const hasCustomAgentDir = hasCustomAgentDirOverride(env);
	const migrationSteps = buildDetectedMigrationSteps(detected);
	const eagerMigrationStepIds = /* @__PURE__ */ new Set([
		"device-auth",
		"device-identity",
		"meeting-transcripts"
	]);
	const eagerMigrationSteps = migrationSteps.filter((step) => eagerMigrationStepIds.has(step.id));
	const remainingMigrationSteps = migrationSteps.filter((step) => !eagerMigrationStepIds.has(step.id));
	const eagerMigrations = await runLegacyStateMigrationSteps(eagerMigrationSteps, params.onStepReceipt, void 0, executionOptions);
	if (eagerMigrations.haltedBy) {
		const completed = [
			stateSchema,
			configMachineState,
			mediaPersistence,
			transcriptDirectives,
			profileWorkspace,
			orphanKeys,
			...eagerMigrations.sources
		];
		const changes = completed.flatMap((result) => result.changes);
		const warnings = [.../* @__PURE__ */ new Set([...completed.flatMap((result) => result.warnings), ...detected.warnings])];
		const notices = mergeNotices([detected, ...completed]);
		logStateMigrationResult({
			changes,
			warnings,
			notices
		}, params.log);
		return {
			mode,
			migrated: changes.length > 0,
			skipped: hasCustomAgentDir,
			changes,
			warnings,
			stepReceipts: [
				...stateSchemaMigration.receipts,
				...preludeReceipts,
				...eagerMigrations.receipts,
				...createBlockedLegacyStateMigrationStepReceipts({
					steps: remainingMigrationSteps,
					blocker: eagerMigrations.haltedBy,
					onStepReceipt: params.onStepReceipt
				})
			],
			...notices.length > 0 ? { notices } : {}
		};
	}
	const eagerResult = (id) => eagerMigrations.entries.find((entry) => entry.id === id)?.result ?? {
		changes: [],
		warnings: []
	};
	const deviceAuth = eagerResult("device-auth");
	const deviceIdentity = eagerResult("device-identity");
	const meetingTranscripts = eagerResult("meeting-transcripts");
	const initialMigrationSources = [
		profileWorkspace,
		stateSchema,
		transcriptDirectives,
		mediaPersistence,
		configMachineState,
		orphanKeys
	];
	const initialMigrationWarnings = [
		...initialMigrationSources.slice(0, -1).flatMap((source) => source.warnings),
		...detected.warnings,
		...orphanKeys.warnings
	];
	if (mode === "automatic" && !hasCustomAgentDir && !detected.sessions.hasLegacy && !detected.agentDir.hasLegacy && !detected.pluginPlans?.hasLegacy && !detected.pluginStateSidecar.hasLegacy && !detected.pluginInstallIndex.hasLegacy && !detected.debugProxyCaptureSidecar.hasLegacy && !detected.stateSchema.hasLegacy && !detected.sharedAuthStore.hasLegacy && !detected.worktrees.hasLegacy && detected.worktrees.pathRewrites.length === 0 && !detected.taskStateSidecars.hasLegacy && !detected.deliveryQueues.hasLegacy && !detected.voiceWake.hasLegacy && !detected.updateCheck.hasLegacy && !detected.configHealth.hasLegacy && !detected.pluginBindingApprovals.hasLegacy && !detected.currentConversationBindings.hasLegacy && !detected.deviceAuth.hasLegacy && !detected.restartSentinel?.hasLegacy && !detected.workspace.hasLegacy && !detected.channelPairing.hasLegacy) {
		const fastPathMigrations = await runLegacyStateMigrationSteps(remainingMigrationSteps, params.onStepReceipt, (step) => step.runWithoutFileDetection === true, executionOptions);
		const alwaysRunSources = fastPathMigrations.sources;
		const completedSources = [
			...initialMigrationSources,
			...alwaysRunSources,
			deviceAuth,
			deviceIdentity,
			meetingTranscripts
		];
		const changes = completedSources.flatMap((source) => source.changes);
		const warnings = [.../* @__PURE__ */ new Set([...initialMigrationWarnings, ...[
			...alwaysRunSources,
			deviceAuth,
			deviceIdentity,
			meetingTranscripts
		].flatMap((source) => source.warnings)])];
		const notices = mergeNotices([
			detected,
			...initialMigrationSources,
			...alwaysRunSources,
			deviceAuth,
			deviceIdentity
		]);
		logStateMigrationResult({
			changes,
			warnings,
			notices
		}, params.log);
		return {
			mode,
			migrated: changes.length > 0,
			skipped: false,
			changes,
			warnings,
			...completedPluginMigrationFields(completedSources),
			stepReceipts: [
				...stateSchemaMigration.receipts,
				...preludeReceipts,
				...eagerMigrations.receipts,
				...fastPathMigrations.receipts
			],
			...notices.length > 0 ? { notices } : {}
		};
	}
	const migrations = await runLegacyStateMigrationSteps(remainingMigrationSteps, params.onStepReceipt, void 0, executionOptions);
	const deferredPostSessionStep = migrations.deferredSteps.find((step) => step.deferredExecution?.kind === "post-session-plugin");
	const completedSources = [
		...initialMigrationSources,
		...migrations.sharedSources,
		deviceAuth,
		deviceIdentity,
		...hasCustomAgentDir ? [] : [meetingTranscripts],
		...migrations.finalSources
	];
	const changes = completedSources.flatMap((source) => source.changes);
	const warnings = [.../* @__PURE__ */ new Set([
		...initialMigrationWarnings,
		...migrations.sharedSources.flatMap((source) => source.warnings),
		...deviceAuth.warnings,
		...deviceIdentity.warnings,
		...hasCustomAgentDir ? [] : meetingTranscripts.warnings,
		...migrations.finalSources.flatMap((source) => source.warnings)
	])];
	const notices = mergeNotices([
		detected,
		...initialMigrationSources,
		...migrations.sharedNoticeSources,
		deviceAuth,
		deviceIdentity,
		meetingTranscripts,
		...migrations.finalNoticeSources
	]);
	logStateMigrationResult({
		changes,
		warnings,
		notices
	}, params.log);
	return {
		mode,
		migrated: changes.length > 0 || meetingTranscripts.changes.length > 0,
		skipped: hasCustomAgentDir,
		changes,
		warnings,
		...completedPluginMigrationFields(completedSources),
		stepReceipts: [
			...stateSchemaMigration.receipts,
			...preludeReceipts,
			...eagerMigrations.receipts,
			...migrations.receipts
		],
		...deferredPostSessionStep?.deferredExecution ? { postSessionPluginMigration: {
			step: migrationStepPlan(deferredPostSessionStep),
			plannedActions: deferredPostSessionStep.deferredExecution.plannedActions
		} } : {},
		...notices.length > 0 ? { notices } : {}
	};
}
//#endregion
export { runLegacyStateMigrations as a, prepareLegacyStateDatabaseSchema as i, detectLegacyStateMigrations as n, refuseLegacyStateMigrationPlan as o, planLegacyStateMigrationsReadOnly as r, autoMigrateLegacyState as t };
