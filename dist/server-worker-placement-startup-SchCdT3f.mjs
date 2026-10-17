import { m as readNonBlankString } from "./string-coerce-1VuiLaaR.mjs";
import { u as toErrorObject } from "./error-coercion-CvJK4lmH.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import "./src-CdRlGRnW.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { A as withTimeout } from "./fs-safe-BUXBSN-4.mjs";
import { o as racePromiseWithAbortSignal } from "./src-D1BHGNTj.mjs";
import "./abort-signal-QqAmLWTl.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { i as tableExists } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-CQ_AyDCk.mjs";
import { r as withGitProcessOperation } from "./spawn-diagnostics-BltWCplw.mjs";
import { t as OpenClawStateLeaseAcquisitionError } from "./openclaw-state-lease-error-Ds9BTWol.mjs";
import { c as matchesAgentDatabaseReadCandidatePath } from "./agent-database-readers-DAuOtcuZ.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import { c as gitNullConfigPath } from "./git-exec-rH66305f.mjs";
import { _ as isOpenClawAgentDatabasePathCurrent } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { a as registerOpenClawAgentDatabaseAsyncResource } from "./openclaw-agent-db-resources-x2MmUEok.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { o as withArtifactPreservingStateReads, t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { s as resolveIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { l as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase, w as resolveUnsuffixedSqliteTargetFromSessionStorePath } from "./openclaw-state-db-D1jWDzK3.mjs";
import { l as ensureGitHubPublicationSchema, m as ensureRepositoryGitHubPublicationSchema, p as ensurePersonalGitHubPublicationSchema } from "./openclaw-state-db-schema-additive-CzAgdzE5.mjs";
import { n as sessionChanges } from "./session-row-changes-BcJIdta8.mjs";
import { t as parseDurationMs } from "./parse-duration-C4JaJvt9.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import "./config-9720xhC5.mjs";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.mjs";
import { g as readOpenIncognitoAgentDatabaseGeneration } from "./openclaw-agent-db-lifecycle-BJiYtXuW.mjs";
import { l as retainOpenClawAgentDatabaseReadCandidates } from "./openclaw-agent-db-DBug3LUA.mjs";
import { n as captureSessionTranscriptTargetBinding } from "./transcript-target-binding-WjVavOYj.mjs";
import { p as withSessionTranscriptWriteAssertion } from "./transcript-write-context-m7NE2aEm.mjs";
import { a as getActiveGatewayRootWorkCount, k as tryBeginGatewayRootWorkAdmission, s as getGatewayRestartDrainSignal } from "./gateway-work-admission-rc4ZgKq_.mjs";
import { k as NODE_WORKER_WORKSPACE_RETAIN_COMMAND } from "./node-commands-BLhGKTZa.mjs";
import { r as GatewayOperatorAccessUnavailableError } from "./operator-access-policy-DIBw5efa.mjs";
import { t as retainOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C4wDuLrp.mjs";
import { c as captureSessionStoreReadCandidate } from "./session-sqlite-target-Cnk9g9d0.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-Bb_svqyv.mjs";
import { _ as resolveSessionStorePathForScope, c as withSessionHistoryWorkerDatabases } from "./session-transcript-worker-runtime-CTwaPfeT.mjs";
import { m as createSessionEntryRevisionGuard } from "./internal-session-key-CPayZwJR.mjs";
import { s as captureCanonicalSessionReaderContinuation } from "./session-canonical-key-D1TSJMmX.mjs";
import { n as emitSessionLifecycleEvent, r as onSessionIdentityMutation } from "./session-lifecycle-events-qdejgRzS.mjs";
import { k as getSessionRepositoryWorkspaceStore } from "./session-accessor.sqlite-entry-store-Ca60AZ39.mjs";
import { _ as startSessionWorkAdmissionInterruption, f as interruptSessionWorkAdmissions, g as runExclusiveSessionLifecycleMutation, h as isSessionWorkAdmissionActive, i as closeSessionWorkAdmissions, n as beginSessionWorkAdmission, t as SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS, x as runExclusiveSessionStoreWrite } from "./session-lifecycle-admission-GoxISURZ.mjs";
import { o as loadSessionEntryReadOnly, s as patchSessionEntryCore, y as prepareSessionStoreTargetInventoryRead } from "./session-accessor.sqlite-entry-DjT1nXRD.mjs";
import { r as prepareSessionStoreTargetInventory } from "./session-store-target-inventory-Dj6Sq0En.mjs";
import { s as registerSessionMaintenancePreserveKeysProvider } from "./store-maintenance-runtime-CBCUEU3e.mjs";
import { i as readSessionEntriesFromStoreInWorker, u as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-B3Aup1sL.mjs";
import { i as readLatestSessionTranscriptReport, n as appendSessionTranscriptReport } from "./session-accessor-CQ-g9yb2.mjs";
import { a as resolveSessionStoreKey, r as resolveSessionStoreAgentId } from "./session-store-key-Ci099tm9.mjs";
import { n as readSessionIdentityEvidenceBatch } from "./session-accessor.sqlite-entry-availability-e5MoUhsa.mjs";
import { l as makeZeroUsageSnapshot } from "./usage-XmAH1cfG.mjs";
import { r as createSessionTranscriptOwnerPredicate } from "./session-accessor.sqlite-transcript-write-guard-Dit9k70E.mjs";
import { f as markDiagnosticRunProgress } from "./diagnostic-run-activity-BlCpLag4.mjs";
import { a as createAgentRunDirectAbortError, u as isAgentRunRestartAbortReason } from "./run-termination-DGv2EKii.mjs";
import { o as resolveSessionWorkStartError } from "./lifecycle-DdaXH8bC.mjs";
import { i as resolveControlUiSessionUrl } from "./control-ui-link-base-Dz9JPCN-.mjs";
import "./device-provider-identity-v6nXqNq_.mjs";
import { n as matchesWorkerPlacementTarget, t as isFailedWorkerPlacementEnvironmentGone } from "./placement-target-B4CmGwso.mjs";
import { n as canRedispatchFailedWorkerPlacement } from "./session-placement-lifecycle-D5GPja58.mjs";
import { _ as sameWorkerSessionTurnClaim, a as isForceAbandonedWorkerPlacement, f as placementTurnOwner, g as resolvePlacementTurnEnvironment, i as isCurrentPlacementTurnClaim, m as reportPlacementTransition, p as projectWorkerSessionTurnClaim, t as FORCED_WORKER_ABANDONMENT_ERROR, v as serializeWorkerSessionTurnClaim } from "./placement-record-BfcBeilz.mjs";
import { C as matchesWorkspaceResultClaim, S as isCurrentWorkerWorkspacePendingResultOwner } from "./placement-row-codec-DzKFQEtn.mjs";
import { f as isTerminalWorkerEnvironmentState } from "./store-validation-BhdOaJpU.mjs";
import { i as recoverWorkerWorkspaceReconciliation, n as AcceptedWorkspacePublicationIndeterminateError, t as applyStagedWorkerWorkspace } from "./workspace-reconcile-DEtkg-5s.mjs";
import { r as findPendingWorkerWorkspaceResult } from "./placement-workspace-result-Dw6JZ899.mjs";
import { t as boundedWorkerError } from "./worker-error-DmRBUSui.mjs";
import { n as SessionWorkspaceReservationBusyError } from "./placement-workspace-reservation.kernel-DAyC6kqY.mjs";
import { t as ActiveTurnClaimError } from "./placement-turn-claims-DXE2X7tY.mjs";
import { a as projectWorkspaceResultConflict, i as formatWorkspaceConflictSummary, n as WORKSPACE_CONFLICT_TRANSCRIPT_TYPE, r as WORKSPACE_RECOVERY_FAILURE_TRANSCRIPT_TYPE, t as WORKSPACE_CONFLICT_CLEARED_TRANSCRIPT_TYPE } from "./workspace-conflicts-CQVfTI04.mjs";
import { i as resolveConfiguredGitHubHost, n as githubRepositoryUrl } from "./github-host-CaivEi-a.mjs";
import { n as resolveGitHubHost } from "./github-host-runtime-B1RbT0q5.mjs";
import { p as resolveConfiguredGitHubToolIdentity, u as preparePersonalGitHubPublicationIdentity } from "./github-tool-identity-2S4ost1l.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.mjs";
import { t as parseGitHubRemoteUrl } from "./github-remote-CfQwrdOt.mjs";
import { c as hasPendingFollowupQueueWork } from "./state-Dcv8BBPd.mjs";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-DrLraxiU.mjs";
import "./session-sharing-50mq9oo9.mjs";
import { l as resolveNodeCommandAllowlist } from "./node-command-policy-DgjgVMrc.mjs";
import { a as managedWorktrees } from "./service-CeHCpuXV.mjs";
import { t as acquireWorktreeRunLease } from "./run-lease-CixZzbdu.mjs";
import { t as prepareSessionWorktree } from "./session-worktree-preparation-BRooBLzr.mjs";
import { n as resolveWorkerPlacementDestination } from "./placement-destination-BjDihjRT.mjs";
import { n as clearSessionLifecycleQueues } from "./cleanup-BpxFFEMQ.mjs";
import { t as prepareGitCoauthorAttribution } from "./git-coauthor-attribution-DKOEMoTb.mjs";
import { n as installSessionPlacementAdmissionProvider } from "./session-placement-admission-BtajgBsg.mjs";
import { _ as encodeGitHubPublicationRequester, a as prepareCurrentGitHubPublicationIdentity, c as prepareGitHubPublicationRepositoryIdentity, d as resolveLocalGitHubPublicationWorktreeOwner, f as sameGitHubPublicationWorkspace, g as decodeGitHubPublicationRequester, h as readGitHubPublicationSessionLifecycleInWorker, i as matchesCurrentGitHubPublicationIdentity, l as prepareGitHubPublicationWorkspaceOwner, m as readGitHubPublicationSessionLifecycle, n as currentGitHubPublicationConfig, p as insertGitHubPublicationSessionLifecycle, t as assertExpectedSharedGitHubPublisher, u as resolveGitHubPublicationWorktreeOwner, v as matchesGitHubPublicationRequester } from "./github-publication-availability-haOm1sSo.mjs";
import { a as personalGitHubStatus, i as requestCurrentPersonalGitHubRefresh } from "./github-oauth-lifecycle-CxoSdLOZ.mjs";
import { o as readUserGitHubConnection, s as resolvePersonalGitHubOwner } from "./user-github-connections-spLT1Bzo.mjs";
import { a as GitHubPublicationSessionChangedError, c as rejectGitHubPublicationSelection, i as GitHubPublicationRequesterUnavailableError, l as resolveGitHubPublicationFailure, n as GitHubPublicationCreditChangedError, r as GitHubPublicationKnownFailure, s as GitHubPublicationWorkspaceChangedError, t as GitHubPublicationBranchChangedError } from "./github-publication-failure-3qOmYAmh.mjs";
import "./session-utils-N4Q5NAko.mjs";
import "./node-runner-inventory-BGg-lRhv.mjs";
import { i as parseNodeWorkerWorkspaceRetainResult } from "./node-workspace-retain-protocol-DrMK-4I_.mjs";
import { t as sameWorkerBuild } from "./worker-build-identity-D_c48Wx_.mjs";
import { s as WORKER_ADMISSION_DEADLINE_MS } from "./worker-process-protocol-B79uIRyP.mjs";
import { a as hasWorkerWorkspaceResultRef, c as preparedWorkerWorkspaceResultRef, f as workerWorkspaceResultRef, i as deleteWorkerWorkspaceResultCleanupRefs, n as cleanupWorkerWorkspaceResultRef, o as isWorkerWorkspaceResultCleanupRef, r as deleteStagedWorkerWorkspaceResult, t as applyStagedWorkerWorkspaceResult, u as restoreStagedWorkerWorkspaceResultFromCleanup } from "./workspace-result-staging-BH0OcWj7.mjs";
import { i as readGitHubRepositoryPublicationMetadata, r as readGitHubRepositoryPublicationBlob, s as githubPublicationBaseLineageArgs, u as parseGitHubPublicationBaseBranch } from "./github-repository-publication-snapshot-BcNvA0c6.mjs";
import { n as captureSessionEntryCurrentRead } from "./session-entry-current-runtime-B4GNjdPn.mjs";
import { t as emitAgentRunStatusEvent } from "./agent-run-status-events-DOlcA8dE.mjs";
import { r as emitSessionsChanged } from "./session-change-event-CooG4AKR.mjs";
import { a as readProjectCheckoutRemoteHead, i as ProjectCloneError, t as materializeProjectClone } from "./project-clone-C7OBrO47.mjs";
import { n as resolveGitHubRepositoryTarget } from "./github-repository-target-Dd_mrAkV.mjs";
import { t as retainGatewaySessionEntryReadOnly } from "./session-utils-read-lifetime-G3aYt8Jc.mjs";
import { a as withSessionRepositoryCheckpoint, i as stageSessionRepositoryCheckpoint } from "./session-repository-checkpoints-CL_yOF0O.mjs";
import { t as raceNodeWorkerOperation } from "./node-worker-abort-NUh8GahC.mjs";
import { n as WorkerRunnerUnavailableError, r as WorkerTunnelOwnerDisconnectedError, t as WorkerRunnerCapacityError } from "./tunnel-contract-C4XjTxW-.mjs";
import { a as isUnavailableEnvironment, c as createDevicePlacementAuthority, i as isExactAttachedEnvironment, l as resolveDevicePlacementEligibility, n as createPlacementFailureActions, o as workerDisappearanceError, r as isCurrentActiveWorkerEnvironment, s as DevicePlacementUnavailableError } from "./placement-dispatch-failure-DdhrxsOO.mjs";
import { a as supportsCurrentWorkerLaunch, n as StaleWorkerBuildError } from "./admission-CC4bcfcY.mjs";
import { t as createWorkerPlacementRunnerAvailabilityReader } from "./placement-projector-B2Va-t9n.mjs";
import { a as recoverGitHubPublicationBranchAndIndex, i as assertGitHubPublicationRefCasCompleted, n as restoreGitHubPublicationRequester, o as updateGitHubPublicationBranchAndIndex, r as GitHubPublicationRecoveryPendingError } from "./github-publication-requester-SJKvzuKs.mjs";
import { n as readWorkerProjectPreparation } from "./preparation-identity-E2cX74EF.mjs";
import { t as listRetainedWorkerBundleHashes } from "./worker-bundle-retention-C7JTK3Gw.mjs";
import { _ as runPublicationCommand, a as captureGitHubPublicationWorkspaceSnapshot, b as prepareGitHubPublicationWorkflowGuard, c as githubPublicationPushArgs, d as hasGitHubPublicationMessageFooter, f as hasGitHubPublicationWorkflowChanges, g as requirePublicationCommand, h as requireGitHubPublicationCommit, i as assertSafeGitPublicationWorkspace, l as githubPublicationRemoteHeadArgs, m as readGitHubPublicationCoauthorTrailers, n as appendGitHubPublicationMessage, o as createGitHubPublicationCommandRunner, p as readGitHubPublicationBaseSha, r as assertGitHubPublicationBranchRef, s as githubPublicationApiArgs, t as prepareRepositoryPublicationRestore, u as githubPublicationUpdateRefArgs, v as assertGitHubPublicationWorkflowChangesAllowed, y as hasRepositoryGitHubPublicationWorkflowChanges } from "./github-repository-publication-restore-6K1If_ft.mjs";
import { i as repositoryGitHubPublicationDigest, n as listRepositoryGitHubPublicationsInDatabase, t as checkRepositoryGitHubPublication } from "./github-repository-publication.kernel-pqfSn5w4.mjs";
import { c as hasForcedWorkerEnvironmentAbandonment, d as deriveEnvironmentIntent, i as WorkerRuntimeRefreshPendingError, r as readWorkerProjectSnapshot, u as WorkerPlacementAdmissionTargetError } from "./project-preparation-BUPA5OH4.mjs";
import { t as prepareWorkerGitHubBinding } from "./worker-github-binding-BJi_0Ma2.mjs";
import { _ as createWorkerWorkspaceReconcileRequest, a as executeLocalTurn, c as requireActivePlacement, d as waitForPendingWorkerResult, g as settleStagedWorkspaceResult, h as finalizeWorkspaceResultConflicts, i as claimWorkerTurn, l as resolvePlacementIdentity, m as createWorkspaceResultJournal, n as WorkerWorkspaceReconciliationError, p as waitForWorkerRuntimeRefresh, r as failHandedOffTurn, s as releaseClaimIfOwned, t as WorkerTurnExecutionError, u as waitForInitialWorkerPlacement, v as recoverSessionWorkspaceCheckpoint, y as sessionWorkspaceRoot } from "./worker-turn-failure-XMbwIVIE.mjs";
import { r as verifyReconciledWorkspaceFinal, t as WorkerWorkspaceFinalFenceError } from "./workspace-finalize-C9y2aw_N.mjs";
import { n as createWorkerTurnRunOwner } from "./worker-turn-run-owner-DA4GaoKM.mjs";
import os from "node:os";
import { isDeepStrictEqual } from "node:util";
import { createHash, randomUUID } from "node:crypto";
//#region src/gateway/github-publication-execution-effects.ts
/** A receipt's execution closure records effects even when their awaited response outlives admission. */
function createGitHubPublicationExecutionEffects(params) {
	const { write } = params;
	return {
		updateHead(headCommit) {
			return write({ head_commit: headCommit }, true);
		},
		complete(result) {
			if (result.status === "published") return write({
				status: "published",
				head_commit: result.headCommit,
				pull_request_url: result.url,
				error_code: null,
				next_action: null
			}, false);
			if (result.status !== "failed") throw new Error("GitHub publication result is not terminal.");
			return write({
				status: "failed",
				error_code: result.code,
				next_action: result.nextAction
			}, result.code !== "session_changed" && (result.code !== "identity_changed" || params.interruptedStatus === "needs_confirmation"));
		},
		recordEffect(effect, observed) {
			write({
				last_effect: effect,
				effect_state: observed?.headCommit || observed?.url ? "observed" : "dispatched",
				...observed?.headCommit ? { head_commit: observed.headCommit } : {},
				...observed?.url ? { pull_request_url: observed.url } : {}
			}, !observed);
		},
		interrupt() {
			return write({
				status: params.interruptedStatus,
				error_code: null,
				next_action: null
			}, false);
		}
	};
}
//#endregion
//#region src/gateway/github-publication-events.ts
/** The existing transaction owner discards these observers on rollback, including savepoints. */
function deferSharedGitHubPublicationChanged(db, row) {
	if (row.identity_source === "personal" || row.owner_profile_id != null) return;
	deferSqlitePostCommitPublication(db, () => {
		emitSessionLifecycleEvent({
			sessionKey: row.session_key,
			agentId: row.agent_id,
			reason: "github-publication"
		});
	});
}
//#endregion
//#region src/gateway/github-publication-store.ts
const PUBLICATION_FAILURE_CODES = /* @__PURE__ */ new Set([
	"identity_changed",
	"identity_unavailable",
	"session_changed",
	"workspace_changed",
	"not_git",
	"not_github",
	"no_changes",
	"push_rejected",
	"github_rejected",
	"unavailable"
]);
function publicationFailureCode(value) {
	return PUBLICATION_FAILURE_CODES.has(value) ? value : "unavailable";
}
const githubPublicationDatabase = (db) => getNodeSqliteKysely(db);
function ensureGitHubPublicationStore() {
	ensureGitHubPublicationSchema(openOpenClawStateDatabase().db);
}
function hasGitHubPublicationStore() {
	return tableExists(openOpenClawStateDatabase().db, "github_publication_requests");
}
function readGitHubPublicationRequest(db, request) {
	const query = githubPublicationDatabase(db).selectFrom("github_publication_requests").selectAll();
	return executeSqliteQueryTakeFirstSync(db, "requestId" in request ? query.where("request_id", "=", request.requestId) : query.where("session_id", "=", request.sessionId).where("idempotency_key", "=", request.idempotencyKey));
}
function listGitHubPublicationsForClaim(claim, options = {}) {
	const db = openOpenClawStateDatabase().db;
	let query = githubPublicationDatabase(db).selectFrom("github_publication_requests").selectAll().where("session_id", "=", claim.sessionId).where("claim_id", "=", claim.claimId).where("run_id", "=", claim.runId).orderBy("created_at_ms");
	if (options.pendingOnly) query = query.where("status", "in", ["requested", "publishing"]);
	return executeSqliteQuerySync(db, query).rows;
}
function claimGitHubPublicationExecution(requestId, gatewayInstanceId) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		const query = githubPublicationDatabase(db);
		const current = readGitHubPublicationRequest(db, { requestId });
		if (!current) throw new Error("GitHub publication request disappeared.");
		if (current.status === "published" || current.status === "failed") return current;
		let update = query.updateTable("github_publication_requests").set({
			status: "publishing",
			gateway_instance_id: gatewayInstanceId,
			updated_at_ms: Date.now()
		}).where("request_id", "=", current.request_id).where("status", "=", current.status);
		update = current.gateway_instance_id ? update.where("gateway_instance_id", "=", current.gateway_instance_id) : update.where("gateway_instance_id", "is", null);
		const claimed = executeSqliteQueryTakeFirstSync(db, update.returningAll());
		if (!claimed) throw new Error("GitHub publication execution ownership changed.");
		deferSharedGitHubPublicationChanged(db, claimed);
		return claimed;
	}, void 0, { operationLabel: "github-publication.claim" });
}
function matchesGitHubPublicationIdentityRow(row, identity) {
	return row.identity_source === identity.source && row.identity_profile_id === (identity.profileId ?? null) && row.identity_account_id === identity.account.accountId && row.identity_login.toLowerCase() === identity.account.login.toLowerCase();
}
/** Insert/replay shared intent inside the caller's admission transaction. */
function insertGitHubPublicationRequest(db, input) {
	input.assertCurrent();
	const { request, identity, worktree, claim, snapshot } = input;
	const query = githubPublicationDatabase(db);
	const inserted = executeSqliteQuerySync(db, query.insertInto("github_publication_requests").values({
		request_id: input.requestId,
		idempotency_key: request.idempotencyKey,
		request_digest: input.requestDigest,
		session_id: input.sessionId,
		session_key: request.sessionKey,
		agent_id: request.agentId,
		worktree_id: worktree.id,
		repository_fingerprint: worktree.repoFingerprint,
		claim_id: claim?.claimId ?? null,
		run_id: claim?.runId ?? null,
		environment_id: claim?.owner.environmentId ?? null,
		owner_epoch: claim?.owner.ownerEpoch ?? null,
		placement_generation: claim?.placementGeneration ?? null,
		identity_source: identity.source,
		identity_profile_id: identity.profileId ?? null,
		identity_account_id: identity.account.accountId,
		identity_login: identity.account.login,
		title: request.title ?? null,
		body: request.body ?? null,
		branch: worktree.branch,
		source_head_commit: snapshot?.sourceHeadCommit ?? null,
		source_index_tree: snapshot?.sourceIndexTree ?? null,
		workspace_tree: snapshot?.workspaceTree ?? null,
		created_at_ms: input.now,
		status: "requested",
		gateway_instance_id: null,
		repository: null,
		base_branch: null,
		head_commit: null,
		pull_request_url: null,
		error_code: null,
		next_action: null,
		updated_at_ms: input.now,
		reported_at_ms: null
	}).onConflict((conflict) => conflict.columns(["session_id", "idempotency_key"]).doNothing()));
	if (inserted.numAffectedRows === 1n) insertGitHubPublicationSessionLifecycle(db, {
		publicationKind: "shared",
		requestId: input.requestId,
		lifecycleRevision: input.lifecycleRevision,
		requester: input.requester
	});
	const stored = readGitHubPublicationRequest(db, {
		sessionId: input.sessionId,
		idempotencyKey: request.idempotencyKey
	});
	if (!stored || stored.request_digest !== input.requestDigest || !matchesGitHubPublicationIdentityRow(stored, identity) || stored.worktree_id !== worktree.id || stored.repository_fingerprint !== worktree.repoFingerprint || stored.branch !== worktree.branch) throw new Error("GitHub publication idempotency key was reused.");
	if (stored.status !== "published" && stored.status !== "failed") {
		const requester = decodeGitHubPublicationRequester(readGitHubPublicationSessionLifecycle({
			publicationKind: "shared",
			requestId: stored.request_id
		}, db)?.requester_authority_json);
		if (!requester || !matchesGitHubPublicationRequester(requester, input.requester)) throw new Error("GitHub publication requester changed; use a new idempotency key.");
	}
	input.assertCurrent();
	if (inserted.numAffectedRows === 1n) deferSharedGitHubPublicationChanged(db, stored);
	return stored;
}
/** Named execution transitions share one instance-bound write owner. */
function createGitHubPublicationExecutionStore(instanceId) {
	const errors = {
		"bind-workspace": "GitHub publication workspace snapshot changed before execution.",
		begin: "GitHub publication state changed before execution.",
		complete: "GitHub publication state changed before completion."
	};
	const write = (row, values, transition) => runOpenClawStateWriteTransaction(({ db }) => {
		if (!values) throw new Error("GitHub publication terminal result is invalid.");
		let update = githubPublicationDatabase(db).updateTable("github_publication_requests").set({
			...values,
			updated_at_ms: Date.now()
		}).where("request_id", "=", row.request_id).where("status", "=", "publishing").where("gateway_instance_id", "=", instanceId);
		if (transition === "bind-workspace") update = update.where("source_head_commit", "is", null).where("source_index_tree", "is", null).where("workspace_tree", "is", null);
		const updated = executeSqliteQueryTakeFirstSync(db, update.returningAll());
		if (!updated) throw new Error(errors[transition]);
		deferSharedGitHubPublicationChanged(db, updated);
		return updated;
	}, void 0, { operationLabel: `github-publication.${transition}` });
	return {
		bindWorkspaceSnapshot: (input) => {
			return write(input.row, {
				source_head_commit: input.sourceHeadCommit,
				source_index_tree: input.sourceIndexTree,
				workspace_tree: input.workspaceTree
			}, "bind-workspace");
		},
		updatePublishingFacts: (input) => {
			return write(input.row, {
				repository: input.repository,
				branch: input.branch,
				base_branch: input.baseBranch,
				source_head_commit: input.sourceHeadCommit,
				workspace_tree: input.workspaceTree,
				head_commit: input.headCommit
			}, "begin");
		},
		complete: (row, result) => {
			const values = result.status === "published" ? {
				status: "published",
				pull_request_url: result.url,
				repository: result.repository,
				branch: result.branch,
				head_commit: result.headCommit,
				error_code: null,
				next_action: null
			} : result.status === "failed" ? {
				status: "failed",
				pull_request_url: null,
				error_code: result.code,
				next_action: result.nextAction
			} : void 0;
			return write(row, values, "complete");
		}
	};
}
function deferGitHubPublicationRequests(requestIds) {
	if (requestIds.length === 0) return;
	runOpenClawStateWriteTransaction(({ db }) => {
		const query = githubPublicationDatabase(db);
		const updatedAtMs = Date.now();
		for (const requestId of requestIds) {
			const changed = executeSqliteQuerySync(db, query.updateTable("github_publication_requests").set({
				claim_id: null,
				run_id: null,
				environment_id: null,
				owner_epoch: null,
				placement_generation: null,
				status: "requested",
				gateway_instance_id: null,
				updated_at_ms: updatedAtMs
			}).where("request_id", "=", requestId).where("status", "in", ["requested", "publishing"]).returning([
				"session_key",
				"agent_id",
				"identity_source"
			])).rows;
			for (const row of changed) deferSharedGitHubPublicationChanged(db, row);
		}
	}, void 0, { operationLabel: "github-publication.defer" });
}
function isGitHubPublicationExecutionOwner(requestId, gatewayInstanceId) {
	ensureGitHubPublicationStore();
	const db = openOpenClawStateDatabase().db;
	const row = executeSqliteQuerySync(db, githubPublicationDatabase(db).selectFrom("github_publication_requests").select(["status", "gateway_instance_id"]).where("request_id", "=", requestId)).rows[0];
	return row?.status === "publishing" && row.gateway_instance_id === gatewayInstanceId;
}
function digestGitHubPublicationRequest(params) {
	return createHash("sha256").update(JSON.stringify({
		sessionId: params.sessionId,
		idempotencyKey: params.idempotencyKey,
		title: params.title ?? null,
		body: params.body ?? null
	})).digest("hex");
}
function projectGitHubPublicationResult(row) {
	const effect = (row.last_effect === "push" || row.last_effect === "pull_request") && (row.effect_state === "dispatched" || row.effect_state === "observed") ? { effect: {
		kind: row.last_effect,
		status: row.effect_state,
		...row.head_commit ? { headCommit: row.head_commit } : {},
		...row.pull_request_url ? { url: row.pull_request_url } : {}
	} } : {};
	const common = {
		requestId: row.request_id,
		publisher: {
			source: row.identity_source === "personal" || row.identity_source === "agent-override" || row.identity_source === "system-configured" ? row.identity_source : "system-detected",
			accountId: row.identity_account_id,
			login: row.identity_login
		},
		...effect
	};
	if (row.status === "published" && row.pull_request_url && row.repository && row.branch) return {
		...common,
		status: "published",
		url: row.pull_request_url,
		repository: row.repository,
		branch: row.branch,
		headCommit: row.head_commit ?? "unknown"
	};
	if (row.status === "failed" && row.error_code && row.next_action) return {
		...common,
		status: "failed",
		code: publicationFailureCode(row.error_code),
		message: "GitHub publication failed.",
		nextAction: row.next_action
	};
	if (row.status === "needs_confirmation") return {
		...common,
		status: "needs_confirmation",
		message: "Confirm the original My GitHub account, target, and workspace to continue this interrupted publication. Already-dispatched GitHub effects may have completed; confirmation checks them before retrying."
	};
	return {
		...common,
		status: row.status === "publishing" ? "publishing" : "requested",
		message: row.status === "publishing" ? "The Gateway is publishing the reconciled workspace." : row.identity_source === "personal" ? "My GitHub publication was accepted for the selected account and workspace." : "Publication was accepted. Finish the turn so the Gateway can reconcile and publish the workspace."
	};
}
//#endregion
//#region src/gateway/github-personal-publication-store.ts
const table$1 = "github_personal_publication_requests";
const query$1 = (db) => getNodeSqliteKysely(db);
function personalGitHubRequestDigest(row) {
	return createHash("sha256").update(JSON.stringify([
		row.request_id,
		row.owner_profile_id,
		row.session_id,
		row.session_key,
		row.agent_id,
		row.idempotency_key,
		row.connection_generation,
		row.identity_source,
		row.identity_profile_id,
		row.identity_account_id,
		row.identity_login,
		row.worktree_id,
		row.repository_fingerprint,
		row.push_repository,
		row.repository,
		row.branch,
		row.base_branch,
		row.source_head_commit,
		row.source_index_tree,
		row.workspace_tree,
		row.title,
		row.body,
		row.created_at_ms
	])).digest("hex");
}
function assertOwner(owner) {
	if (resolvePersonalGitHubOwner(owner) !== owner) throw new Error("My GitHub publication owner changed.");
}
/** Ownership is checked before every lookup; request IDs and digests are never bearer authority. */
function readPersonalGitHubPublication(owner, request) {
	assertOwner(owner);
	const db = openOpenClawStateDatabase().db;
	if (!tableExists(db, table$1)) return;
	let selection = query$1(db).selectFrom(table$1).selectAll().where("owner_profile_id", "=", owner);
	selection = "requestId" in request ? selection.where("request_id", "=", request.requestId) : "sessionId" in request ? selection.where("session_id", "=", request.sessionId).where("idempotency_key", "=", request.idempotencyKey) : selection.where("session_key", "=", request.sessionKey).where("agent_id", "=", request.agentId).where("status", "in", [
		"requested",
		"publishing",
		"needs_confirmation"
	]).orderBy("created_at_ms", "desc").orderBy("request_id", "desc").limit(1);
	const row = executeSqliteQueryTakeFirstSync(db, selection);
	if (row && (row.identity_source !== "personal" || row.request_digest !== personalGitHubRequestDigest(row))) throw new Error("My GitHub publication receipt is corrupt; create a new publication request.");
	return row;
}
function personalGitHubPublicationStatus(row, executing) {
	const projected = (row.status === "requested" || row.status === "publishing") && !executing ? {
		...row,
		status: "needs_confirmation"
	} : row;
	return {
		result: projectGitHubPublicationResult(projected),
		confirmation: projected.status !== "needs_confirmation" ? null : {
			requestDigest: row.request_digest,
			generation: row.connection_generation,
			account: {
				accountId: row.identity_account_id,
				login: row.identity_login
			},
			pushRepository: row.push_repository,
			repository: row.repository,
			branch: row.branch,
			baseBranch: row.base_branch,
			sourceHeadCommit: row.source_head_commit,
			sourceIndexTree: row.source_index_tree,
			workspaceTree: row.workspace_tree
		}
	};
}
function insertPersonalGitHubPublication(row, lifecycleRevision, assertCurrent) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		assertCurrent();
		assertOwner(row.owner_profile_id);
		ensurePersonalGitHubPublicationSchema(db);
		executeSqliteQuerySync(db, query$1(db).insertInto(table$1).values(row));
		insertGitHubPublicationSessionLifecycle(db, {
			publicationKind: "personal",
			requestId: row.request_id,
			lifecycleRevision
		});
		return row;
	}, void 0, { operationLabel: "github-personal-publication.request" });
}
/** One execution closure owns writes; a later socket must explicitly confirm before claiming. */
function claimPersonalGitHubPublication(row, instanceId, assertCurrent) {
	const executionId = randomUUID();
	const claimed = runOpenClawStateWriteTransaction(({ db }) => {
		assertCurrent();
		assertOwner(row.owner_profile_id);
		if (executeSqliteQuerySync(db, query$1(db).updateTable(table$1).set({
			status: "publishing",
			gateway_instance_id: instanceId,
			execution_id: executionId,
			updated_at_ms: Date.now()
		}).where("owner_profile_id", "=", row.owner_profile_id).where("request_id", "=", row.request_id).where("request_digest", "=", row.request_digest).where("status", "=", row.status).where("execution_id", row.execution_id === null ? "is" : "=", row.execution_id)).numAffectedRows !== 1n) throw new Error("My GitHub publication execution changed.");
		return {
			...row,
			status: "publishing",
			gateway_instance_id: instanceId,
			execution_id: executionId
		};
	}, void 0, { operationLabel: "github-personal-publication.claim" });
	const ownsExecution = () => {
		const latest = readPersonalGitHubPublication(row.owner_profile_id, { requestId: row.request_id });
		return latest?.status === "publishing" && latest.gateway_instance_id === instanceId && latest.execution_id === executionId && latest.request_digest === row.request_digest;
	};
	const write = (values, requireAction) => runOpenClawStateWriteTransaction(({ db }) => {
		if (requireAction) assertCurrent();
		const current = executeSqliteQueryTakeFirstSync(db, query$1(db).selectFrom(table$1).selectAll().where("owner_profile_id", "=", row.owner_profile_id).where("request_id", "=", row.request_id));
		if (!current || current.request_digest !== row.request_digest || personalGitHubRequestDigest(current) !== row.request_digest) throw new Error("My GitHub publication receipt changed during execution.");
		const updated = executeSqliteQueryTakeFirstSync(db, query$1(db).updateTable(table$1).set({
			...values,
			updated_at_ms: Date.now()
		}).where("owner_profile_id", "=", row.owner_profile_id).where("request_id", "=", row.request_id).where("status", "=", "publishing").where("gateway_instance_id", "=", instanceId).where("execution_id", "=", executionId).returningAll());
		if (!updated) throw new Error("My GitHub publication execution is no longer current.");
		return updated;
	}, void 0, { operationLabel: "github-personal-publication.record" });
	return {
		row: claimed,
		ownsExecution,
		...createGitHubPublicationExecutionEffects({
			write,
			interruptedStatus: "needs_confirmation"
		})
	};
}
function requirePersonalGitHubPublicationConfirmation(instanceId) {
	const database = openOpenClawStateDatabase();
	if (!tableExists(database.db, table$1)) return;
	runOpenClawStateWriteTransaction(({ db }) => {
		executeSqliteQuerySync(db, query$1(db).updateTable(table$1).set({
			status: "needs_confirmation",
			updated_at_ms: Date.now()
		}).where("status", "in", ["requested", "publishing"]).where((eb) => eb.or([eb("gateway_instance_id", "is", null), eb("gateway_instance_id", "!=", instanceId)])));
	}, void 0, { operationLabel: "github-personal-publication.restart" });
}
function listUnreportedPersonalGitHubPublications() {
	const db = openOpenClawStateDatabase().db;
	if (!tableExists(db, table$1)) return [];
	return executeSqliteQuerySync(db, query$1(db).selectFrom(table$1).selectAll().where("status", "in", ["published", "failed"]).where("reported_at_ms", "is", null).orderBy("updated_at_ms")).rows.map((row) => {
		if (row.request_digest !== personalGitHubRequestDigest(row)) throw new Error("My GitHub publication receipt is corrupt; reconnect and create a new request.");
		return {
			sessionId: row.session_id,
			sessionKey: row.session_key,
			agentId: row.agent_id,
			result: projectGitHubPublicationResult(row)
		};
	});
}
function markPersonalGitHubPublicationReported(requestId) {
	const database = openOpenClawStateDatabase();
	if (!tableExists(database.db, table$1)) return;
	runOpenClawStateWriteTransaction(({ db }) => {
		executeSqliteQuerySync(db, query$1(db).updateTable(table$1).set({ reported_at_ms: Date.now() }).where("request_id", "=", requestId).where("status", "in", ["published", "failed"]));
	}, void 0, { operationLabel: "github-personal-publication.report" });
}
//#endregion
//#region src/gateway/github-publication-transcript.ts
const GITHUB_PUBLICATION_RESPONSE_PREFIX = "github-publication:";
function formatGitHubPublicationResult(result) {
	const publisher = result.publisher;
	const source = publisher?.source === "personal" ? "My GitHub" : publisher?.source === "agent-override" ? "Agent override" : "System";
	const acting = publisher ? ` Using @${publisher.login} (${source}).` : "";
	switch (result.status) {
		case "published": return `Published ${result.repository} branch ${result.branch}: ${result.url}${acting}`;
		case "failed": return `GitHub publication failed: ${result.message} ${result.nextAction}${acting}`;
		case "publishing":
		case "requested":
		case "needs_confirmation": return `${result.message}${acting}`;
	}
	return result;
}
function createGitHubPublicationTranscriptReporter(loadSessionRuntime, coordinator) {
	return async (params) => {
		const runtime = await loadSessionRuntime();
		const target = runtime.resolveGatewaySessionStoreTargetWithStore({
			cfg: getRuntimeConfig(),
			key: params.sessionKey,
			agentId: params.agentId,
			clone: false
		});
		if (runtime.resolveCanonicalSessionEntryFromStoreKeys(target.store, target.storeKeys)?.sessionId !== params.sessionId || target.canonicalKey !== params.sessionKey) throw new Error("GitHub publication transcript owner changed");
		const appended = await appendSessionTranscriptReport({
			agentId: target.agentId,
			sessionId: params.sessionId,
			sessionKey: target.canonicalKey,
			storePath: target.storePath
		}, {
			kind: "assistant",
			message: {
				role: "assistant",
				content: [{
					type: "text",
					text: formatGitHubPublicationResult(params.result)
				}],
				api: "openai-responses",
				provider: "openclaw",
				model: "gateway-publication",
				responseId: `${GITHUB_PUBLICATION_RESPONSE_PREFIX}${params.result.requestId}`,
				usage: makeZeroUsageSnapshot(),
				stopReason: "stop",
				timestamp: Date.now()
			}
		});
		if (!appended.ok) throw new Error("GitHub publication transcript owner changed", { cause: appended.error });
		coordinator.markReported(params.result.requestId);
	};
}
//#endregion
//#region src/gateway/github-publication-execution-identity.ts
var GitHubPublicationAuthorityLostError = class extends Error {};
/** Credentials are a fixed snapshot; live workspace, action, and execution owners authorize use. */
function createGitHubPublicationExecutionIdentity(params) {
	let active;
	const assertCurrent = () => {
		if (!params.validateAuthority()) throw new GitHubPublicationAuthorityLostError("GitHub publication session authority changed.");
		params.assertWorkspace();
		if (active && !(params.identity ? params.identity.isCurrent(active) : matchesCurrentGitHubPublicationIdentity({
			agentId: params.row.agent_id,
			identity: active
		}))) throw new Error("GitHub publication identity changed.");
	};
	return {
		assertCurrent,
		refreshIdentity: async () => {
			assertCurrent();
			const identity = await (params.identity?.prepare() ?? prepareCurrentGitHubPublicationIdentity(params.row.agent_id));
			assertCurrent();
			if (!matchesGitHubPublicationIdentityRow(params.row, identity)) throw new Error("GitHub publication identity changed.");
			active = identity;
			assertCurrent();
			return identity;
		}
	};
}
//#endregion
//#region src/gateway/github-publication-pull-requests.ts
async function loadGitHubPublicationPullRequests(params) {
	const identity = await params.refreshIdentity();
	params.assertCurrent();
	const marker = JSON.stringify(params.marker);
	return {
		identity,
		candidates: parseGitHubPublicationPullRequests(await requirePublicationCommand([
			...githubPublicationApiArgs(`repos/${params.repository}/pulls`, "GET", identity.host ?? params.host ?? resolveGitHubHost()),
			"-f",
			`head=${params.pushOwner}:${params.branch}`,
			"-f",
			`base=${params.baseBranch}`,
			"-f",
			"state=all",
			"--paginate",
			"--jq",
			`map({url: .html_url, userId: .user.id, state: .state, body: (if ((.body // "") | contains(${marker})) then ${marker} else "" end), headSha: .head.sha, headRef: .head.ref, baseRef: .base.ref}) | tojson`
		], { env: identity.env }))
	};
}
/** Parses the complete authenticated PR lookup; one malformed candidate invalidates the response. */
function parseGitHubPublicationPullRequests(raw) {
	let pages;
	try {
		pages = raw.trim().split(/\r?\n/u).map((page) => JSON.parse(page));
	} catch (error) {
		throw new Error("GitHub pull request lookup returned invalid JSON.", { cause: error });
	}
	const candidates = [];
	for (const page of pages) {
		if (!Array.isArray(page)) throw new Error("GitHub pull request lookup returned an invalid response.");
		candidates.push(...page);
	}
	return candidates.map((candidate) => {
		if (!isRecord(candidate)) throw new Error("GitHub pull request lookup returned an invalid candidate.");
		const userId = candidate.userId;
		const url = readNonBlankString(candidate.url);
		const state = candidate.state;
		const body = candidate.body;
		const headSha = readNonBlankString(candidate.headSha);
		const headRef = readNonBlankString(candidate.headRef);
		const baseRef = readNonBlankString(candidate.baseRef);
		if (!Number.isSafeInteger(userId) || Number(userId) < 1 || !url || state !== "open" && state !== "closed" || typeof body !== "string" || !headSha || !headRef || !baseRef) throw new Error("GitHub pull request lookup returned an invalid candidate.");
		return {
			userId: Number(userId),
			url,
			state,
			body,
			headSha,
			headRef,
			baseRef
		};
	});
}
async function findGitHubPublicationPullRequest(params) {
	const { identity, candidates } = await loadGitHubPublicationPullRequests(params);
	const exact = candidates.filter((candidate) => candidate.userId === identity.account.accountId && candidate.headSha === params.headCommit && candidate.headRef === params.branch && candidate.baseRef === params.baseBranch);
	const found = exact.find((candidate) => candidate.state === "open") ?? exact.find((candidate) => candidate.state === "closed" && candidate.body.includes(params.marker));
	if (found) {
		params.recordObserved?.(found.url);
		if (found.state === "closed") {
			params.assertCurrent();
			throw new GitHubPublicationKnownFailure("GitHub pull request was closed before publication completed.", {
				code: "github_rejected",
				nextAction: "Reopen the closed pull request or retry to create a new publication request."
			});
		}
	}
	const occupied = candidates.find((candidate) => candidate.state === "open" && candidate.headRef === params.branch && candidate.baseRef === params.baseBranch);
	if (occupied && occupied.userId !== identity.account.accountId) throw new GitHubPublicationKnownFailure("GitHub pull request is owned by another account.", {
		code: "github_rejected",
		nextAction: "Check pull-request permission for the effective account, then retry."
	});
	if (found) return found.url;
	params.assertCurrent();
}
/** Observe only the saved request's commit and PR; an absent response proves no non-execution. */
async function reconcileGitHubPublicationPullRequest(params) {
	const identity = await params.refreshIdentity();
	params.assertCurrent();
	const raw = await requirePublicationCommand(githubPublicationApiArgs(`repos/${params.pushRepository}/git/commits/${params.headCommit}`, "GET", identity.host ?? params.host ?? resolveGitHubHost()), { env: identity.env });
	params.assertCurrent();
	const commit = JSON.parse(raw);
	const objectId = /^[a-f0-9]{40}(?:[a-f0-9]{24})?$/iu;
	if (!isRecord(commit) || commit.sha !== params.headCommit || !isRecord(commit.tree) || typeof commit.tree.sha !== "string" || !objectId.test(commit.tree.sha) || !Array.isArray(commit.parents) || typeof commit.message !== "string") throw new Error("GitHub publication commit observation is invalid.");
	const parents = commit.parents.map((parent) => {
		if (!isRecord(parent) || typeof parent.sha !== "string" || !objectId.test(parent.sha)) throw new Error("GitHub publication commit observation is invalid.");
		return parent.sha;
	});
	if (commit.tree.sha !== params.workspaceTree || parents.length !== 1 || parents[0] !== params.parentCommit || !commit.message.split(/\r?\n/u).includes(`OpenClaw-Publication: ${params.requestId}`)) return;
	const includesCommit = async (head) => {
		if (head === params.headCommit) return true;
		if (!objectId.test(head)) throw new Error("GitHub publication head observation is invalid.");
		const currentIdentity = await params.refreshIdentity();
		params.assertCurrent();
		const comparison = JSON.parse(await requirePublicationCommand([
			...githubPublicationApiArgs(`repos/${params.pushRepository}/compare/${params.headCommit}...${head}?per_page=1`, "GET", currentIdentity.host ?? params.host ?? resolveGitHubHost()),
			"--jq",
			"{sha: .merge_base_commit.sha}"
		], { env: currentIdentity.env }));
		if (!isRecord(comparison) || typeof comparison.sha !== "string" || !objectId.test(comparison.sha)) throw new Error("GitHub publication ancestry observation is invalid.");
		return comparison.sha === params.headCommit;
	};
	const { identity: lookupIdentity, candidates } = await loadGitHubPublicationPullRequests(params);
	let unrelated = false;
	for (const candidate of candidates) {
		if (candidate.userId !== lookupIdentity.account.accountId || candidate.headRef !== params.branch || candidate.baseRef !== params.baseBranch || !candidate.body.includes(params.marker) && !params.knownPullRequestUrls.includes(candidate.url) && !(params.pushOnly && candidate.state === "open")) continue;
		if (await includesCommit(candidate.headSha)) {
			params.recordObserved?.(candidate.url);
			return candidate.url;
		}
		unrelated = true;
	}
	if (!params.pushOnly || unrelated) throw new Error("The original GitHub pull request has not been confirmed.");
	if (params.pushOnly === "observed") return;
	const refIdentity = await params.refreshIdentity();
	params.assertCurrent();
	const refs = JSON.parse(await requirePublicationCommand(githubPublicationApiArgs(`repos/${params.pushRepository}/git/matching-refs/heads/${encodeURIComponent(params.branch)}`, "GET", refIdentity.host ?? params.host ?? resolveGitHubHost()), { env: refIdentity.env }));
	if (!Array.isArray(refs)) throw new Error("GitHub publication branch observation is invalid.");
	const ref = refs.find((value) => isRecord(value) && value.ref === `refs/heads/${params.branch}`);
	if (!isRecord(ref) || !isRecord(ref.object) || typeof ref.object.sha !== "string" || !await includesCommit(ref.object.sha)) throw new Error("The original GitHub push has not been confirmed.");
	params.recordPushObserved?.(params.headCommit);
}
//#endregion
//#region src/gateway/github-publication-recovery.ts
async function recoverGitHubPublicationWorkspace(row, run, assertCustody) {
	const worktree = managedWorktrees.findLiveById(row.worktree_id);
	if (worktree?.repoFingerprint !== row.repository_fingerprint || worktree.branch !== row.branch || !row.source_head_commit || !row.workspace_tree) return;
	await recoverGitHubPublicationBranchAndIndex({
		cwd: worktree.path,
		requestId: row.request_id,
		branch: row.branch,
		sourceHeadCommit: row.source_head_commit,
		workspaceTree: row.workspace_tree,
		assertCustody,
		run
	});
}
async function readKnownGitHubPublicationPullRequestUrls(row) {
	const { worktree_id, repository_fingerprint, repository, branch, base_branch, identity_account_id, pull_request_url } = row;
	const result = await executeExistingOpenClawStateRead({}, {
		type: "githubPublication.knownPullRequestUrls",
		input: {
			worktree_id,
			repository_fingerprint,
			repository,
			branch,
			base_branch,
			identity_account_id,
			pull_request_url
		}
	}, { current: true });
	if (!result?.ok || result.type !== "githubPublication.knownPullRequestUrls") throw new Error("GitHub publication receipt history is unavailable.");
	return result.urls;
}
async function readGitHubPublicationRequestInWorker(requestId) {
	const result = await executeExistingOpenClawStateRead({}, {
		type: "githubPublication.request",
		requestId
	}, { current: true });
	if (!result?.ok || result.type !== "githubPublication.request") throw new Error("GitHub publication receipt is unavailable.");
	return result.row;
}
//#endregion
//#region src/gateway/github-publication-target.ts
/** Resolve the authoritative Git remote and GitHub PR parent with the selected publisher. */
async function prepareGitHubPublicationTarget(params) {
	const { worktree, assertCurrent } = params;
	const githubHost = params.identity.host ?? resolveGitHubHost();
	const repositoryIdentity = await prepareGitHubPublicationRepositoryIdentity(params);
	const remote = parseGitHubRemoteUrl(repositoryIdentity.originUrl, githubHost);
	if (!remote || !/^[A-Za-z0-9_.-]+$/u.test(remote.owner) || !/^[A-Za-z0-9_.-]+$/u.test(remote.repo)) throw new Error("GitHub publication requires a GitHub remote.");
	const pushRepository = `${remote.owner}/${remote.repo}`;
	const branch = await requirePublicationCommand([
		"git",
		"symbolic-ref",
		"--quiet",
		"--short",
		"HEAD"
	], { cwd: worktree.path });
	assertCurrent();
	if (branch !== worktree.branch) throw new GitHubPublicationWorkspaceChangedError("GitHub publication branch changed.");
	const raw = await requirePublicationCommand([
		"gh",
		"api",
		"--hostname",
		githubHost,
		`repos/${pushRepository}`,
		"--jq",
		"{fork, default_branch, parent: {name: .parent.name, default_branch: .parent.default_branch, owner: {login: .parent.owner.login}}}"
	], { env: params.identity.env });
	assertCurrent();
	const value = JSON.parse(raw);
	const target = resolveGitHubRepositoryTarget(value, remote);
	if (!target) throw new Error("GitHub repository response omitted its publication target.");
	const repository = `${target.pullRequest.owner}/${target.pullRequest.repo}`;
	const baseBranch = target.fork ? target.pullRequest.defaultBranch : parseGitHubPublicationBaseBranch(worktree.baseRef, target.pullRequest.defaultBranch);
	if (!target.fork && branch === baseBranch) throw new GitHubPublicationWorkspaceChangedError("GitHub publication branch changed to its pull request base.");
	return {
		pushRepository,
		repository,
		branch,
		baseBranch,
		pushOwner: target.push.owner,
		githubHost
	};
}
//#endregion
//#region src/gateway/github-publication-executor.ts
const PUBLICATION_MARKER = "OpenClaw-Publication";
function parseJsonObject(value, label) {
	let parsed;
	try {
		parsed = JSON.parse(value);
	} catch (error) {
		throw new Error(`${label} returned invalid JSON`, { cause: error });
	}
	if (!isRecord(parsed)) throw new Error(`${label} returned an invalid response`);
	return parsed;
}
/** Lost requester authority permits receipt reconciliation, never a publication retry. */
async function reconcileGitHubPublication(params) {
	const row = params.initial;
	if (row.status === "published" || row.status === "failed") return params.projectResult(row);
	if (!row.repository || !row.base_branch || !row.head_commit || !row.source_head_commit || !row.workspace_tree) return;
	const { assertCurrent, refreshIdentity } = createGitHubPublicationExecutionIdentity({
		row,
		identity: params.identity,
		validateAuthority: params.validateCustody,
		assertWorkspace: () => {
			resolveLocalGitHubPublicationWorktreeOwner(row);
		}
	});
	let url;
	try {
		assertCurrent();
		const { worktree } = resolveLocalGitHubPublicationWorktreeOwner(row);
		const target = await prepareGitHubPublicationTarget({
			worktree,
			identity: await refreshIdentity(),
			assertCurrent
		});
		if (target.repository !== row.repository || target.branch !== row.branch || target.baseBranch !== row.base_branch) throw new Error("GitHub publication's original target is unavailable.");
		const knownPullRequestUrls = await readKnownGitHubPublicationPullRequestUrls(row);
		assertCurrent();
		url = await reconcileGitHubPublicationPullRequest({
			requestId: row.request_id,
			pushRepository: target.pushRepository,
			repository: row.repository,
			pushOwner: target.pushOwner,
			branch: row.branch,
			baseBranch: row.base_branch,
			headCommit: row.head_commit,
			workspaceTree: row.workspace_tree,
			parentCommit: row.source_head_commit,
			marker: `<!-- openclaw-publication:${row.request_id} -->`,
			knownPullRequestUrls,
			refreshIdentity,
			assertCurrent,
			pushOnly: params.pushOnly
		});
	} catch (error) {
		throw new GitHubPublicationRecoveryPendingError("GitHub publication is unconfirmed; restore read access to the original target and retry recovery. Recorded effects are retained.", { cause: error });
	}
	if (!url) return;
	return params.projectResult(params.complete(row, {
		requestId: row.request_id,
		status: "published",
		url,
		repository: row.repository,
		branch: row.branch,
		headCommit: row.head_commit
	}));
}
async function executeGitHubPublication(params) {
	const { initial } = params;
	if (initial.status === "published" || initial.status === "failed") return params.projectResult(initial);
	let pullRequestPending = false;
	let effectDispatched = false;
	let row = initial;
	const currentWorktree = () => resolveLocalGitHubPublicationWorktreeOwner(initial);
	const assertCustody = () => {
		if (!params.validateCustody()) throw new GitHubPublicationAuthorityLostError("GitHub publication execution custody changed.");
		currentWorktree();
	};
	const custodyCommands = createGitHubPublicationCommandRunner(assertCustody);
	const { assertCurrent: assertAuthority, refreshIdentity } = createGitHubPublicationExecutionIdentity({
		row: initial,
		identity: params.identity,
		validateAuthority: params.validateAuthority,
		assertWorkspace: () => {
			currentWorktree();
		}
	});
	const { step, run, require: command } = createGitHubPublicationCommandRunner(assertAuthority);
	try {
		const { loaded, worktree } = currentWorktree();
		await custodyCommands.step(() => assertSafeGitPublicationWorkspace(worktree.path, runPublicationCommand));
		await recoverGitHubPublicationWorkspace(initial, custodyCommands.require, assertCustody);
		if (params.prepareAuthority) await params.prepareAuthority();
		let sourceHeadCommit = row.source_head_commit;
		let sourceIndexTree = row.source_index_tree;
		let workspaceTree = row.workspace_tree;
		if (!sourceHeadCommit || !sourceIndexTree || !workspaceTree) {
			const snapshot = await captureGitHubPublicationWorkspaceSnapshot({
				cwd: worktree.path,
				assertCurrent: assertAuthority
			});
			row = params.bindWorkspaceSnapshot({
				row,
				...snapshot
			});
			sourceHeadCommit = snapshot.sourceHeadCommit;
			sourceIndexTree = snapshot.sourceIndexTree;
			workspaceTree = snapshot.workspaceTree;
		}
		if (row.identity_source === "personal") {
			let snapshot;
			try {
				snapshot = await captureGitHubPublicationWorkspaceSnapshot({
					cwd: worktree.path,
					assertCurrent: assertAuthority
				});
			} catch (error) {
				throw new GitHubPublicationRecoveryPendingError("My GitHub workspace snapshot could not be verified; retry confirmation after local Git operations finish.", { cause: error });
			}
			if (snapshot.workspaceTree !== workspaceTree || snapshot.sourceIndexTree !== sourceIndexTree && snapshot.sourceIndexTree !== workspaceTree) throw new GitHubPublicationWorkspaceChangedError("GitHub publication workspace changed after its accepted snapshot.");
		}
		let headCommit = await command([
			"git",
			"rev-parse",
			"--verify",
			"HEAD^{commit}"
		], { cwd: worktree.path });
		let identity = await refreshIdentity();
		const { pushRepository, repository, branch, baseBranch, pushOwner, githubHost } = await prepareGitHubPublicationTarget({
			worktree,
			identity,
			assertCurrent: assertAuthority
		});
		if (params.target && (params.target.pushRepository !== pushRepository || params.target.repository !== repository || params.target.baseBranch !== baseBranch)) throw new GitHubPublicationWorkspaceChangedError("GitHub publication accepted repository target changed.");
		const remoteBaseSha = await readGitHubPublicationBaseSha(run, repository, baseBranch, githubHost, identity.env);
		await step(() => assertSafeGitPublicationWorkspace(worktree.path, runPublicationCommand));
		identity = await refreshIdentity();
		const baseTransportEnv = {
			...identity.env,
			GIT_CONFIG_GLOBAL: gitNullConfigPath(),
			GIT_CONFIG_SYSTEM: gitNullConfigPath()
		};
		await requireGitHubPublicationCommit(run, repository, remoteBaseSha, githubHost, worktree.path, baseTransportEnv, "GitHub publication workspace base could not be materialized.");
		const lineage = await run([
			"git",
			"merge-base",
			sourceHeadCommit,
			remoteBaseSha
		], { cwd: worktree.path });
		if (lineage.code === 1) throw new GitHubPublicationKnownFailure("GitHub publication histories are unrelated.", {
			code: "workspace_changed",
			nextAction: "The accepted commit and pull request base have no shared Git history. Preserve your work and apply the intended changes to a session branch based on the target repository before publishing again."
		});
		if (lineage.code !== 0) throw new Error("GitHub publication workspace base lineage could not be verified.");
		if (await command([
			"git",
			"rev-parse",
			`${remoteBaseSha}^{tree}`
		], { cwd: worktree.path }) === workspaceTree) throw new GitHubPublicationKnownFailure("GitHub publication has no changes to publish.", {
			code: "no_changes",
			nextAction: "Make or restore a repository change, then retry."
		});
		const marker = `${PUBLICATION_MARKER}: ${row.request_id}`;
		const pullRequestMarker = `<!-- openclaw-publication:${row.request_id} -->`;
		const findPullRequest = () => findGitHubPublicationPullRequest({
			repository,
			pushOwner,
			branch,
			baseBranch,
			host: githubHost,
			headCommit,
			marker: pullRequestMarker,
			refreshIdentity,
			recordObserved: (url) => {
				params.recordEffect?.("pull_request", { url });
				pullRequestPending = false;
			},
			assertCurrent: assertAuthority
		});
		const currentMessage = await command([
			"git",
			"show",
			"-s",
			"--format=%B",
			"HEAD"
		], { cwd: worktree.path });
		const markerPresent = currentMessage.split(/\r?\n/u).includes(marker);
		const currentTree = await command([
			"git",
			"rev-parse",
			"HEAD^{tree}"
		], { cwd: worktree.path });
		if (markerPresent) {
			if (await command([
				"git",
				"rev-parse",
				"HEAD^"
			], { cwd: worktree.path }) !== sourceHeadCommit || currentTree !== workspaceTree) throw new GitHubPublicationWorkspaceChangedError("GitHub publication workspace changed after its accepted snapshot.");
		} else if (headCommit !== sourceHeadCommit) throw new GitHubPublicationWorkspaceChangedError("GitHub publication workspace changed after its accepted snapshot.");
		const httpsRemote = githubRepositoryUrl(pushRepository, githubHost);
		identity = await refreshIdentity();
		let transportEnv = {
			...identity.env,
			GIT_CONFIG_GLOBAL: gitNullConfigPath(),
			GIT_CONFIG_SYSTEM: gitNullConfigPath()
		};
		const observeRemoteHead = async () => {
			const result = await run(githubPublicationRemoteHeadArgs(httpsRemote, branch), {
				cwd: worktree.path,
				env: transportEnv
			});
			if (result.code !== 0) throw new Error("GitHub publication remote branch could not be verified.");
			const observed = result.stdout.toString("utf8").trim();
			if (!observed) return "";
			const fields = observed.split(/\s+/u);
			if (fields.length !== 2 || fields[1] !== `refs/heads/${branch}` || !/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/iu.test(fields[0])) throw new Error("GitHub publication remote branch could not be verified.");
			return fields[0];
		};
		const expectedRemoteHead = await step(observeRemoteHead);
		let remoteHead = expectedRemoteHead;
		if (remoteHead && remoteHead !== headCommit) {
			await requireGitHubPublicationCommit(run, pushRepository, remoteHead, githubHost, worktree.path, transportEnv, "GitHub publication remote branch could not be verified.");
			const ancestry = await run(githubPublicationBaseLineageArgs(remoteHead, headCommit), { cwd: worktree.path });
			if (ancestry.code === 1) throw new GitHubPublicationBranchChangedError();
			if (ancestry.code !== 0) throw new Error("GitHub publication remote branch could not be verified.");
		}
		const existingPullRequest = await step(findPullRequest);
		const assertWorkflowAuthority = await prepareGitHubPublicationWorkflowGuard(params.assertWorkflowChangesAllowed, () => hasGitHubPublicationWorkflowChanges({
			cwd: worktree.path,
			comparisonCommit: expectedRemoteHead || lineage.stdout.toString("utf8").trim(),
			ancestryCommit: expectedRemoteHead || sourceHeadCommit,
			targetCommit: remoteBaseSha,
			workspaceTree,
			run
		}));
		const assertPublicationAction = () => {
			assertWorkflowAuthority();
			assertAuthority();
		};
		assertPublicationAction();
		row = params.updatePublishingFacts({
			row,
			repository,
			branch,
			baseBranch,
			sourceHeadCommit,
			workspaceTree,
			headCommit
		});
		const config = currentGitHubPublicationConfig();
		const preparedAttribution = await prepareGitCoauthorAttribution({
			agentId: row.agent_id,
			config,
			excludeAccountId: identity.account.accountId,
			sessionKey: row.session_key,
			sessionId: row.session_id,
			storePath: loaded.storePath
		});
		const attribution = preparedAttribution.attribution;
		const assertAction = () => {
			assertPublicationAction();
			if (!preparedAttribution.isCurrent()) throw new GitHubPublicationCreditChangedError();
		};
		const completePublished = (url, publishedHead) => params.projectResult(params.complete(row, {
			requestId: row.request_id,
			status: "published",
			url,
			repository,
			branch,
			headCommit: publishedHead
		}));
		assertAction();
		if (markerPresent && remoteHead !== headCommit && !hasGitHubPublicationMessageFooter(currentMessage, attribution?.trailers ?? [], marker)) throw new GitHubPublicationCreditChangedError();
		const contributorCredit = attribution?.logins.map((login) => `- @${login}`).join("\n");
		const messageLines = currentMessage.split(/\r?\n/u);
		if (existingPullRequest && remoteHead === headCommit && currentTree === workspaceTree && sourceIndexTree === workspaceTree && messageLines.some((line) => line.startsWith(`${PUBLICATION_MARKER}: `))) {
			const trailers = await readGitHubPublicationCoauthorTrailers({
				cwd: worktree.path,
				headCommit,
				command
			});
			assertAction();
			if ((attribution?.trailers ?? []).every((trailer) => trailers.includes(trailer))) return completePublished(existingPullRequest, headCommit);
		}
		const previousBranchHead = headCommit;
		let updateBranchRef;
		if (!markerPresent) {
			await command([
				"git",
				"cat-file",
				"-e",
				`${workspaceTree}^{tree}`
			], { cwd: worktree.path });
			const title = row.title?.trim() || `Publish ${branch}`;
			const commitBody = contributorCredit ? `${title}\n\nWorked on by:\n${contributorCredit}` : title;
			const message = appendGitHubPublicationMessage(commitBody, [...attribution?.trailers ?? [], marker]);
			const timestamp = new Date(row.created_at_ms).toISOString();
			identity = await refreshIdentity();
			const authorEnv = {
				...identity.env,
				GIT_AUTHOR_NAME: identity.account.login,
				GIT_COMMITTER_NAME: identity.account.login,
				GIT_AUTHOR_EMAIL: `${identity.account.accountId}+${identity.account.login}@users.noreply.github.com`,
				GIT_COMMITTER_EMAIL: `${identity.account.accountId}+${identity.account.login}@users.noreply.github.com`,
				GIT_AUTHOR_DATE: timestamp,
				GIT_COMMITTER_DATE: timestamp
			};
			const commit = await requirePublicationCommand([
				"git",
				"commit-tree",
				"--no-gpg-sign",
				workspaceTree,
				"-p",
				headCommit
			], {
				cwd: worktree.path,
				env: authorEnv,
				input: `${message}\n`,
				beforeRun: assertAction
			});
			assertAuthority();
			await assertGitHubPublicationBranchRef(branch, async (argv) => (await run(argv, { cwd: worktree.path })).code ?? -1);
			const previousHead = headCommit;
			updateBranchRef = async () => {
				const result = await runPublicationCommand(githubPublicationUpdateRefArgs(branch, commit, previousHead), {
					cwd: worktree.path,
					beforeRun: assertAuthority
				});
				assertGitHubPublicationRefCasCompleted(result);
			};
			headCommit = commit;
		}
		await updateGitHubPublicationBranchAndIndex({
			cwd: worktree.path,
			requestId: row.request_id,
			branch,
			previousHead: previousBranchHead,
			sourceIndexTree,
			workspaceTree,
			headCommit,
			env: identity.env,
			assertCurrent: assertAuthority,
			assertCustody,
			run: custodyCommands.require,
			...updateBranchRef ? { updateRef: updateBranchRef } : {}
		});
		row = params.updatePublishingFacts({
			row,
			repository,
			branch,
			baseBranch,
			sourceHeadCommit,
			workspaceTree,
			headCommit
		});
		await step(() => assertSafeGitPublicationWorkspace(worktree.path, runPublicationCommand));
		identity = await refreshIdentity();
		transportEnv = {
			...identity.env,
			GIT_CONFIG_GLOBAL: gitNullConfigPath(),
			GIT_CONFIG_SYSTEM: gitNullConfigPath()
		};
		const pushArgs = githubPublicationPushArgs(httpsRemote, headCommit, branch, expectedRemoteHead);
		remoteHead = await step(observeRemoteHead);
		if (remoteHead !== headCommit) {
			if (remoteHead !== expectedRemoteHead) throw new GitHubPublicationBranchChangedError();
			assertAction();
			params.recordEffect?.("push");
			effectDispatched = true;
			const pushed = await runPublicationCommand(pushArgs, {
				cwd: worktree.path,
				env: transportEnv,
				beforeRun: assertAction
			});
			params.recordEffect?.("push", pushed.code === 0 ? { headCommit } : {});
			assertAuthority();
			identity = await refreshIdentity();
			transportEnv = {
				...identity.env,
				GIT_CONFIG_GLOBAL: gitNullConfigPath(),
				GIT_CONFIG_SYSTEM: gitNullConfigPath()
			};
			remoteHead = await step(observeRemoteHead);
			if (remoteHead !== headCommit) throw new Error(pushed.code === 0 ? "GitHub push verification failed." : "GitHub push was rejected.");
			params.recordEffect?.("push", { headCommit });
		}
		let pullRequestUrl = await findPullRequest();
		if (!pullRequestUrl) {
			const sessionUrl = resolveControlUiSessionUrl(config, {
				sessionKey: row.session_key,
				fallbackAgentId: row.agent_id,
				exactKey: true
			});
			const body = `${(row.body?.trim() || "Published by the Gateway after authoritative workspace reconciliation.").replace(/(?:\s*---\s*\n\[View the OpenClaw team session\]\([^\r\n)]*\)\s*)+$/u, "").replace(/(?:^|\n\n)## Worked on by\n\n(?:- @[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})\n)*- @[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})(?=\n\n|$)/gu, "").trimEnd()}${contributorCredit ? `\n\n## Worked on by\n\n${contributorCredit}` : ""}\n\n${pullRequestMarker}${sessionUrl?.startsWith("https://") ? `\n\n---\n[View the OpenClaw team session](${sessionUrl})` : ""}`;
			identity = await refreshIdentity();
			assertAction();
			params.recordEffect?.("pull_request");
			pullRequestPending = true;
			effectDispatched = true;
			const created = await runPublicationCommand(githubPublicationApiArgs(`repos/${repository}/pulls`, "POST", githubHost), {
				env: identity.env,
				beforeRun: assertAction,
				input: JSON.stringify({
					title: row.title?.trim() || `Publish ${branch}`,
					body,
					head: `${pushOwner}:${branch}`,
					base: baseBranch,
					draft: true
				})
			});
			if (created.code === 0) pullRequestUrl = readNonBlankString(parseJsonObject(created.stdout.toString("utf8"), "GitHub pull request creation").html_url);
			params.recordEffect?.("pull_request", pullRequestUrl ? { url: pullRequestUrl } : {});
			if (!pullRequestUrl) {
				assertAuthority();
				pullRequestUrl = await findPullRequest();
			}
		}
		if (!pullRequestUrl) throw new Error("GitHub pull request creation was rejected.");
		if (pullRequestPending) params.recordEffect?.("pull_request", { url: pullRequestUrl });
		return completePublished(pullRequestUrl, headCommit);
	} catch (error) {
		if (error instanceof GitHubPublicationRequesterUnavailableError || error instanceof GatewayOperatorAccessUnavailableError) throw error;
		if (error instanceof GitHubPublicationRecoveryPendingError) throw error;
		if (error instanceof GitHubPublicationAuthorityLostError && params.defer) return params.projectResult(params.defer(initial));
		if (params.interrupt && (effectDispatched || initial.last_effect) && !(error instanceof GitHubPublicationKnownFailure)) {
			assertAuthority();
			return params.projectResult(params.interrupt());
		}
		if (!params.interrupt && (effectDispatched || initial.head_commit) && !(error instanceof GitHubPublicationKnownFailure)) throw new GitHubPublicationRecoveryPendingError("GitHub publication is unconfirmed; retry recovery before requesting another publication. Recorded effects are retained.", { cause: error });
		const failure = resolveGitHubPublicationFailure(error);
		const result = params.projectResult(params.complete(initial, {
			requestId: initial.request_id,
			status: "failed",
			code: failure.code,
			message: "GitHub publication failed.",
			nextAction: failure.nextAction
		}));
		if (error instanceof SessionMutationAuthorizationChangedError) throw error;
		return result;
	}
}
//#endregion
//#region src/gateway/github-repository-publication-store.ts
const checkpointColumns = [
	"checkpoint_ref",
	"checkpoint_digest",
	"source_head_commit",
	"source_index_tree",
	"workspace_tree"
];
const table = "github_repository_publication_requests";
const query = (db) => getNodeSqliteKysely(db);
function changed(db, row) {
	checkRepositoryGitHubPublication(row);
	deferSharedGitHubPublicationChanged(db, row);
	return row;
}
function listRepositoryGitHubPublications(filter = {}) {
	return listRepositoryGitHubPublicationsInDatabase(openOpenClawStateDatabase().db, filter);
}
async function readPendingRepositoryGitHubPublication(input) {
	const context = captureOpenClawStateWorkerContext();
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-RW5P1VzC.mjs");
	return await executeOpenClawStateWorker(context, {
		type: "githubRepository.personalPending",
		input
	});
}
/** A pushed branch outlives its publisher and the request's PR outcome. */
function readRepositoryGitHubPublicationBranch(input) {
	const rows = listRepositoryGitHubPublications({ workspaceId: input.workspaceId }).filter((row) => row.branch === input.branch && row.push_repository === input.pushRepository);
	const pushed = rows.filter((row) => row.pushed_head_commit !== null);
	const ancestors = new Set(pushed.map((row) => row.previous_head_commit));
	return {
		head: pushed.findLast((row) => !ancestors.has(row.pushed_head_commit)),
		unsettled: rows.some((row) => !terminalRepositoryGitHubPublication(row) && row.effect_state === "dispatched")
	};
}
function readRepositoryGitHubPublication(requestId) {
	return readRepositoryGitHubPublicationInDatabase(openOpenClawStateDatabase().db, requestId);
}
function readRepositoryGitHubPublicationInDatabase(db, requestId) {
	if (!tableExists(db, table)) return;
	const row = executeSqliteQueryTakeFirstSync(db, query(db).selectFrom(table).selectAll().where("request_id", "=", requestId));
	return row ? checkRepositoryGitHubPublication(row) : void 0;
}
function requireRepositoryGitHubPublication(requestId) {
	const row = readRepositoryGitHubPublication(requestId);
	if (!row) throw new Error("GitHub publication request no longer exists.");
	return row;
}
function insertRepositoryGitHubPublication(row, assertCurrent) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		assertCurrent();
		ensureRepositoryGitHubPublicationSchema(db);
		checkRepositoryGitHubPublication(row);
		const inserted = executeSqliteQuerySync(db, query(db).insertInto(table).values(row).onConflict((conflict) => conflict.doNothing()));
		const stored = executeSqliteQueryTakeFirstSync(db, query(db).selectFrom(table).selectAll().where("session_id", "=", row.session_id).where("idempotency_key", "=", row.idempotency_key).where("owner_profile_id", row.owner_profile_id === null ? "is" : "=", row.owner_profile_id));
		if (!stored || [
			"session_key",
			"session_lifecycle_revision",
			"agent_id",
			"workspace_id",
			"owner_profile_id",
			"connection_generation",
			"identity_source",
			"identity_profile_id",
			"identity_account_id",
			"identity_login",
			"title",
			"body",
			"claim_id",
			"run_id",
			"placement_generation",
			"environment_id",
			"owner_epoch"
		].some((key) => stored[key] !== row[key])) throw new Error("GitHub publication idempotency key was reused.");
		if (stored.requester_authority_json !== row.requester_authority_json) {
			const original = decodeGitHubPublicationRequester(stored.requester_authority_json);
			const current = decodeGitHubPublicationRequester(row.requester_authority_json);
			if (!original || !current || !matchesGitHubPublicationRequester(original, current)) throw new Error("GitHub publication idempotency key was reused.");
		}
		checkRepositoryGitHubPublication(stored);
		assertCurrent();
		if (inserted.numAffectedRows === 1n) deferSharedGitHubPublicationChanged(db, stored);
		return stored;
	}, void 0, { operationLabel: "github-repository-publication.request" });
}
function bindRepositoryGitHubPublicationCheckpoint(row, checkpoint, assertCurrent) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		assertCurrent();
		const current = readRepositoryGitHubPublication(row.request_id);
		if (!current || current.request_digest !== row.request_digest || current.status !== "requested") throw new Error("GitHub publication checkpoint owner changed.");
		if (current.checkpoint_ref !== null) {
			if (checkpointColumns.some((key) => current[key] !== checkpoint[key])) throw new Error("GitHub publication accepted checkpoint changed.");
			return current;
		}
		const bound = {
			...current,
			...checkpoint,
			updated_at_ms: Date.now()
		};
		bound.request_digest = repositoryGitHubPublicationDigest(bound);
		const updated = executeSqliteQueryTakeFirstSync(db, query(db).updateTable(table).set(bound).where("request_id", "=", row.request_id).where("checkpoint_ref", "is", null).where("request_digest", "=", current.request_digest).returningAll());
		if (!updated) throw new Error("GitHub publication checkpoint ownership changed.");
		assertCurrent();
		return changed(db, updated);
	}, void 0, { operationLabel: "github-repository-publication.checkpoint" });
}
function failRepositoryGitHubPublicationPreparation(row, nextAction, assertCurrent) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		assertCurrent();
		const updated = executeSqliteQueryTakeFirstSync(db, query(db).updateTable(table).set({
			status: "failed",
			error_code: "unavailable",
			next_action: nextAction,
			updated_at_ms: Date.now()
		}).where("request_id", "=", row.request_id).where("request_digest", "=", row.request_digest).where("status", "=", "requested").where("checkpoint_ref", "is", null).where("execution_id", "is", null).returningAll());
		if (!updated) throw new Error("GitHub publication preparation owner changed.");
		assertCurrent();
		return changed(db, updated);
	}, void 0, { operationLabel: "github-repository-publication.unavailable" });
}
function claimRepositoryGitHubPublication(row, instanceId, authority) {
	const executionId = randomUUID();
	const claimed = runOpenClawStateWriteTransaction(({ db }) => {
		authority.assertCustody();
		const current = readRepositoryGitHubPublication(row.request_id);
		if (!current || current.request_digest !== row.request_digest || terminalRepositoryGitHubPublication(current)) throw new Error("GitHub publication receipt changed.");
		const updated = executeSqliteQueryTakeFirstSync(db, query(db).updateTable(table).set({
			status: "publishing",
			gateway_instance_id: instanceId,
			execution_id: executionId,
			updated_at_ms: Date.now()
		}).where("request_id", "=", row.request_id).where("request_digest", "=", row.request_digest).where("status", "=", row.status).where("execution_id", row.execution_id === null ? "is" : "=", row.execution_id).returningAll());
		if (!updated) throw new Error("GitHub publication execution changed.");
		authority.assertCustody();
		return changed(db, updated);
	}, void 0, { operationLabel: "github-repository-publication.claim" });
	const ownsExecution = () => {
		const current = readRepositoryGitHubPublication(row.request_id);
		return current?.status === "publishing" && current.gateway_instance_id === instanceId && current.execution_id === executionId && current.request_digest === row.request_digest;
	};
	const write = (values, requireAction) => runOpenClawStateWriteTransaction(({ db }) => {
		if (requireAction) {
			authority.assertCustody();
			authority.assertCurrent();
			if (!row.checkpoint_ref || !row.checkpoint_digest || !row.workspace_tree) throw new Error("GitHub publication requires its accepted checkpoint.");
		}
		const current = readRepositoryGitHubPublication(row.request_id);
		if (!current || current.request_digest !== row.request_digest) throw new Error("GitHub publication receipt changed.");
		const retainPullRequest = values.last_effect === "push" && current.last_effect === "pull_request";
		const updated = executeSqliteQueryTakeFirstSync(db, query(db).updateTable(table).set({
			...values,
			...retainPullRequest ? {
				last_effect: current.last_effect,
				effect_state: current.effect_state
			} : {},
			updated_at_ms: Date.now()
		}).where("request_id", "=", row.request_id).where("request_digest", "=", row.request_digest).where("status", "=", "publishing").where("gateway_instance_id", "=", instanceId).where("execution_id", "=", executionId).returningAll());
		if (!updated) throw new Error("GitHub publication execution is no longer current.");
		if (requireAction) {
			authority.assertCustody();
			authority.assertCurrent();
		}
		return changed(db, updated);
	}, void 0, { operationLabel: "github-repository-publication.record" });
	const effects = createGitHubPublicationExecutionEffects({
		write,
		interruptedStatus: row.owner_profile_id === null ? "requested" : "needs_confirmation"
	});
	return {
		row: claimed,
		ownsExecution,
		...effects,
		recordEffect(...[effect, observed]) {
			if (effect === "push" && observed?.headCommit) write({
				last_effect: "push",
				effect_state: "observed",
				head_commit: observed.headCommit,
				pushed_head_commit: observed.headCommit
			}, false);
			else effects.recordEffect(effect, observed);
		}
	};
}
function markRepositoryGitHubPublicationReported(requestId) {
	const database = openOpenClawStateDatabase().db;
	if (!tableExists(database, table)) return;
	runOpenClawStateWriteTransaction(({ db }) => {
		executeSqliteQuerySync(db, query(db).updateTable(table).set({ reported_at_ms: Date.now() }).where("request_id", "=", requestId).where("status", "in", ["published", "failed"]));
	}, void 0, { operationLabel: "github-repository-publication.report" });
}
function failStaleRepositoryGitHubPublication(row, sessionIsCurrent) {
	runOpenClawStateWriteTransaction(({ db }) => {
		const current = readRepositoryGitHubPublication(row.request_id);
		if (!current || terminalRepositoryGitHubPublication(current) || current.request_digest !== row.request_digest || sessionIsCurrent()) return;
		const updated = executeSqliteQueryTakeFirstSync(db, query(db).updateTable(table).set({
			status: "failed",
			error_code: "session_changed",
			next_action: "Review any recorded GitHub effects, then request publication from a current session.",
			execution_id: null,
			gateway_instance_id: null,
			updated_at_ms: Date.now()
		}).where("request_id", "=", row.request_id).where("request_digest", "=", row.request_digest).returningAll());
		if (updated) changed(db, updated);
	}, void 0, { operationLabel: "github-repository-publication.retire" });
}
function deferRepositoryGitHubPublicationClaims(requestIds) {
	if (requestIds.length === 0) return;
	runOpenClawStateWriteTransaction(({ db }) => {
		const updated = executeSqliteQuerySync(db, query(db).updateTable(table).set({
			claim_id: null,
			run_id: null,
			environment_id: null,
			owner_epoch: null,
			placement_generation: null,
			updated_at_ms: Date.now()
		}).where("request_id", "in", requestIds).where("owner_profile_id", "is", null).where("status", "in", ["requested", "publishing"]).returningAll()).rows;
		for (const row of updated) changed(db, row);
	}, void 0, { operationLabel: "github-repository-publication.defer" });
}
function terminalRepositoryGitHubPublication(row) {
	return row.status === "published" || row.status === "failed";
}
//#endregion
//#region src/gateway/github-repository-publication-workspace.ts
async function prepareRepositoryOwner(session) {
	const current = await prepareGitHubPublicationWorkspaceOwner(session);
	return () => {
		const owner = current();
		if (owner.kind !== "repository") throw new Error("GitHub publication repository owner changed.");
		return owner;
	};
}
function resolveReceiptOwner(row, prepared) {
	const loaded = loadGatewaySessionEntryReadOnly(row.session_key, { agentId: row.agent_id });
	const workspace = prepared.current();
	if (loaded.entry?.sessionId !== row.session_id || (loaded.entry.lifecycleRevision ?? null) !== row.session_lifecycle_revision || loaded.canonicalKey !== row.session_key || loaded.agentId !== row.agent_id || loaded.entry.archivedAt !== void 0 || !workspace || workspace.workspaceId !== row.workspace_id || workspace.agentId !== row.agent_id || workspace.sessionKey !== row.session_key || workspace.branch !== row.branch || loaded.entry.repositoryWorkspaceId !== row.workspace_id) return;
	return {
		loaded,
		workspace
	};
}
function assertReceiptOwner(row, prepared) {
	const owner = resolveReceiptOwner(row, prepared);
	if (!owner) throw new GitHubPublicationSessionChangedError();
	return owner;
}
async function captureCheckpoint(row, assertCurrent, use) {
	const preparedOwner = await getSessionRepositoryWorkspaceStore().prepare(row.workspace_id);
	assertCurrent();
	const { workspace } = assertReceiptOwner(row, preparedOwner);
	if (!workspace.checkpointRef) throw new Error("GitHub publication is waiting for the first accepted repository checkpoint.");
	const assertSelected = () => {
		assertCurrent();
		const { workspace: current } = assertReceiptOwner(row, preparedOwner);
		if (current.revision !== workspace.revision || current.checkpointRef !== workspace.checkpointRef) throw new Error("GitHub publication checkpoint changed during preparation.");
	};
	return await withSessionRepositoryCheckpoint({
		workspaceId: workspace.workspaceId,
		checkpointRef: workspace.checkpointRef,
		includePublication: true
	}, async (payload) => {
		assertSelected();
		if (!payload.publicationStagingRoot || !payload.publicationDigest) return projectGitHubPublicationResult(failRepositoryGitHubPublicationPreparation(row, "Save a new checkpoint and request publication again. If capture remains unavailable, resolve any merge conflicts and review the repository's Git clean filters and transport configuration. Your session changes remain recoverable.", assertSelected));
		const { snapshot } = await readGitHubRepositoryPublicationMetadata(payload.publicationStagingRoot, payload.publicationDigest);
		assertSelected();
		return await use({
			checkpoint_ref: workspace.checkpointRef,
			checkpoint_digest: payload.publicationDigest,
			source_head_commit: snapshot.baseCommit,
			source_index_tree: snapshot.baseTree,
			workspace_tree: snapshot.workspaceTree
		}, {
			snapshot,
			snapshotRoot: payload.publicationStagingRoot,
			checkpointRef: workspace.checkpointRef,
			digest: payload.publicationDigest
		});
	});
}
//#endregion
//#region src/gateway/github-personal-publication.ts
/** Personal receipt status shares account policy; execution custody stays with its coordinator. */
function createPersonalRepositoryPublicationStatusReader(isExecuting) {
	const preparePersonalStatus = async (requestId) => {
		const row = readRepositoryGitHubPublication(requestId);
		return row && row.owner_profile_id !== null && !terminalRepositoryGitHubPublication(row) ? {
			requestId: row.request_id,
			workspaceId: row.workspace_id,
			repository: await getSessionRepositoryWorkspaceStore().prepare(row.workspace_id)
		} : void 0;
	};
	const personalStatus = (row, action, session, prepared) => {
		action.assertCurrent();
		if (row.owner_profile_id !== action.owner || row.session_key !== session.sessionKey || row.agent_id !== session.agentId) throw new Error("My GitHub publication was not found for this profile and session.");
		const executing = isExecuting(row);
		const pending = !terminalRepositoryGitHubPublication(row) && !executing;
		if (pending && (!prepared || prepared.requestId !== row.request_id || prepared.workspaceId !== row.workspace_id)) throw new Error("My GitHub publication source changed; refresh its status.");
		const currentOwner = pending && prepared ? resolveReceiptOwner(row, prepared.repository) : void 0;
		const connection = pending ? personalGitHubStatus(action) : null;
		if (pending && (row.session_id !== session.sessionId || row.session_lifecycle_revision !== (session.lifecycleRevision ?? null) || !currentOwner || connection?.generation !== row.connection_generation || connection.account?.accountId !== row.identity_account_id || connection.account.login.toLowerCase() !== row.identity_login.toLowerCase())) return {
			result: projectGitHubPublicationResult({
				...row,
				status: "failed",
				error_code: row.session_id !== session.sessionId || row.session_lifecycle_revision !== (session.lifecycleRevision ?? null) || !currentOwner ? "session_changed" : "identity_changed",
				next_action: "Review the original account and any recorded GitHub effects, then create a new publication for the current session."
			}),
			confirmation: null
		};
		return {
			result: projectGitHubPublicationResult(pending ? {
				...row,
				status: "needs_confirmation"
			} : row),
			confirmation: pending && row.connection_generation && row.push_repository && row.repository && row.base_branch && row.source_head_commit && row.source_index_tree && row.workspace_tree ? {
				requestDigest: row.request_digest,
				generation: row.connection_generation,
				account: {
					accountId: row.identity_account_id,
					login: row.identity_login
				},
				pushRepository: row.push_repository,
				repository: row.repository,
				branch: row.branch,
				baseBranch: row.base_branch,
				sourceHeadCommit: row.source_head_commit,
				sourceIndexTree: row.source_index_tree,
				workspaceTree: row.workspace_tree
			} : null
		};
	};
	return {
		preparePersonalStatus,
		personalStatus
	};
}
function assertPersonalGitHubPublicationReplay(existing, input, selected) {
	if (existing.connection_generation !== selected.generation || existing.identity_account_id !== selected.account.accountId || existing.identity_login.toLowerCase() !== selected.account.login.toLowerCase() || existing.title !== (input.title ?? null) || existing.body !== (input.body ?? null)) throw new Error("My GitHub publication idempotency key was reused with a different selection.");
}
function bindPersonalGitHubPublicationSelection(action, selected, preparation) {
	const assertCurrent = () => {
		action.assertCurrent();
		const record = readUserGitHubConnection(action.owner);
		if (record?.generation !== selected.generation || record.selection.kind !== "connected" || record.selection.accountId !== selected.account.accountId || record.selection.login.toLowerCase() !== selected.account.login.toLowerCase()) rejectGitHubPublicationSelection("My GitHub identity changed; review the current account before publishing again.", preparation);
		return record.selection;
	};
	const initial = assertCurrent();
	return {
		owner: action.owner,
		profileId: initial.profileId,
		accountId: initial.accountId,
		assertCurrent
	};
}
async function preparePersonalGitHubPublicationSelection(bound, assertWorkspace) {
	const assertCurrent = () => {
		bound.assertCurrent();
		assertWorkspace();
	};
	assertCurrent();
	try {
		await requestCurrentPersonalGitHubRefresh(bound.owner);
	} catch {
		assertCurrent();
		throw new Error("My GitHub credentials are unavailable; reconnect My GitHub before publishing.");
	}
	assertCurrent();
	return await preparePersonalGitHubPublicationIdentity({
		profileId: bound.profileId,
		accountId: bound.accountId,
		assertCurrent
	});
}
function createPersonalGitHubPublicationCoordinator(placements) {
	const instanceId = placements.workspaceResultInstanceId();
	const active = /* @__PURE__ */ new Map();
	const status = (row, action, session) => {
		const projected = personalGitHubPublicationStatus(row, row.gateway_instance_id === instanceId && row.execution_id !== null && active.get(row.request_id) === row.execution_id);
		if (projected.result.status !== "needs_confirmation") return projected;
		const connection = personalGitHubStatus(action);
		const lifecycle = readGitHubPublicationSessionLifecycle({
			publicationKind: "personal",
			requestId: row.request_id
		});
		const code = row.session_id !== session.sessionId || session.archivedAt != null || !lifecycle || lifecycle.lifecycle_revision !== (session.lifecycleRevision ?? null) ? "session_changed" : connection.generation !== row.connection_generation || connection.account?.accountId !== row.identity_account_id || connection.account.login.toLowerCase() !== row.identity_login.toLowerCase() ? "identity_changed" : null;
		if (!code) return projected;
		return {
			result: projectGitHubPublicationResult({
				...row,
				status: "failed",
				error_code: code,
				next_action: code === "session_changed" ? "This request belongs to an earlier session incarnation. Review any recorded GitHub effects and create a new publication for the current session." : "The original My GitHub selection changed or is unavailable. Review any recorded GitHub effects, reconnect if needed, and create a new publication."
			}),
			confirmation: null
		};
	};
	const withWorkspace = async (action, run) => {
		action.assertCurrent();
		return await placements.withLocalWorkspaceReservation(action, async (assertReservation) => {
			const worktree = resolveGitHubPublicationWorktreeOwner(action).worktree;
			const lease = await acquireWorktreeRunLease(worktree.id, { exclusive: true });
			const assertCustody = () => {
				assertReservation();
				const current = resolveGitHubPublicationWorktreeOwner({
					...action,
					expected: {
						worktreeId: worktree.id,
						repositoryFingerprint: worktree.repoFingerprint,
						branch: worktree.branch
					}
				});
				const workStartError = resolveSessionWorkStartError(action.sessionKey, current.loaded.entry, { expectedSessionId: action.sessionId });
				if (workStartError) throw new Error(workStartError);
			};
			const assertCurrent = () => {
				action.assertCurrent();
				assertCustody();
			};
			try {
				assertCurrent();
				return await run({
					assertCurrent,
					assertCustody
				});
			} finally {
				await lease.release();
			}
		});
	};
	const execute = async (action, row, workspace) => {
		const selected = {
			generation: row.connection_generation,
			account: {
				accountId: row.identity_account_id,
				login: row.identity_login
			}
		};
		const bound = bindPersonalGitHubPublicationSelection(action, selected);
		const assertCurrent = () => {
			bound.assertCurrent();
			workspace.assertCurrent();
			if (bound.profileId !== row.identity_profile_id || action.sessionId !== row.session_id || action.owner !== row.owner_profile_id) throw new Error("My GitHub publication owner changed.");
		};
		assertCurrent();
		const execution = claimPersonalGitHubPublication(row, instanceId, assertCurrent);
		active.set(row.request_id, execution.row.execution_id);
		try {
			return await executeGitHubPublication({
				initial: execution.row,
				validateAuthority: () => {
					assertCurrent();
					return execution.ownsExecution();
				},
				validateCustody: () => {
					workspace.assertCustody();
					return execution.ownsExecution();
				},
				assertWorkflowChangesAllowed: assertCurrent,
				identity: {
					prepare: async () => await preparePersonalGitHubPublicationSelection(bound, workspace.assertCurrent),
					isCurrent: (identity) => {
						assertCurrent();
						return identity.source === "personal" && identity.profileId === bound.profileId && identity.account.accountId === selected.account.accountId;
					}
				},
				target: {
					pushRepository: row.push_repository,
					repository: row.repository,
					baseBranch: row.base_branch
				},
				projectResult: projectGitHubPublicationResult,
				bindWorkspaceSnapshot: () => {
					throw new Error("My GitHub publication is missing its accepted snapshot.");
				},
				updatePublishingFacts: (facts) => {
					assertCurrent();
					if (facts.repository !== row.repository || facts.branch !== row.branch || facts.baseBranch !== row.base_branch || facts.sourceHeadCommit !== row.source_head_commit || facts.workspaceTree !== row.workspace_tree) throw new Error("My GitHub publication accepted workspace changed.");
					return execution.updateHead(facts.headCommit);
				},
				complete: (_row, result) => execution.complete(result),
				recordEffect: execution.recordEffect.bind(execution),
				interrupt: execution.interrupt.bind(execution)
			});
		} catch (error) {
			try {
				execution.interrupt();
			} catch {}
			throw error;
		} finally {
			active.delete(row.request_id);
		}
	};
	return {
		async requestPersonalForSession(input, action) {
			if (input.selection?.source !== "personal" || input.idempotencyKey.length > 128) throw new Error("My GitHub publication requires an explicit bounded account selection.");
			const selected = input.selection;
			action.assertCurrent();
			const readRequest = () => readPersonalGitHubPublication(action.owner, {
				sessionId: action.sessionId,
				idempotencyKey: input.idempotencyKey
			});
			const existing = readRequest();
			if (existing) {
				assertPersonalGitHubPublicationReplay(existing, input, selected);
				action.assertCurrent();
				return status(existing, action, action).result;
			}
			const bound = bindPersonalGitHubPublicationSelection(action, selected, {
				idempotencyKey: input.idempotencyKey,
				hasRequest: () => Boolean(readRequest())
			});
			return await withWorkspace(action, async (workspace) => {
				const assertCurrent = () => {
					workspace.assertCurrent();
					bound.assertCurrent();
				};
				const worktree = resolveGitHubPublicationWorktreeOwner(action).worktree;
				const identity = await preparePersonalGitHubPublicationSelection(bound, workspace.assertCurrent);
				const target = await prepareGitHubPublicationTarget({
					worktree,
					identity,
					assertCurrent
				});
				const snapshot = await captureGitHubPublicationWorkspaceSnapshot({
					cwd: worktree.path,
					assertCurrent
				});
				assertCurrent();
				const now = Date.now();
				const row = {
					request_id: randomUUID(),
					owner_profile_id: action.owner,
					connection_generation: selected.generation,
					idempotency_key: input.idempotencyKey,
					request_digest: "",
					session_id: action.sessionId,
					session_key: action.sessionKey,
					agent_id: action.agentId,
					worktree_id: worktree.id,
					repository_fingerprint: worktree.repoFingerprint,
					identity_source: "personal",
					identity_profile_id: identity.profileId,
					identity_account_id: identity.account.accountId,
					identity_login: identity.account.login,
					title: input.title ?? null,
					body: input.body ?? null,
					status: "requested",
					gateway_instance_id: instanceId,
					execution_id: null,
					push_repository: target.pushRepository,
					repository: target.repository,
					branch: target.branch,
					base_branch: target.baseBranch,
					source_head_commit: snapshot.sourceHeadCommit,
					source_index_tree: snapshot.sourceIndexTree,
					workspace_tree: snapshot.workspaceTree,
					head_commit: null,
					pull_request_url: null,
					error_code: null,
					next_action: null,
					last_effect: null,
					effect_state: null,
					created_at_ms: now,
					updated_at_ms: now,
					reported_at_ms: null
				};
				row.request_digest = personalGitHubRequestDigest(row);
				return await execute(action, insertPersonalGitHubPublication(row, action.lifecycleRevision, assertCurrent), workspace);
			});
		},
		personalStatus(action, session, requestId) {
			action.assertCurrent();
			const row = readPersonalGitHubPublication(action.owner, { requestId });
			if (!row || row.session_key !== session.sessionKey || row.agent_id !== session.agentId) throw new Error("My GitHub publication was not found for this profile and session.");
			return status(row, action, session);
		},
		personalPending(action, session) {
			action.assertCurrent();
			const row = readPersonalGitHubPublication(action.owner, {
				sessionKey: session.sessionKey,
				agentId: session.agentId
			});
			return row ? status(row, action, session) : null;
		},
		async confirmPersonal(input, action) {
			action.assertCurrent();
			const row = readPersonalGitHubPublication(action.owner, { requestId: input.requestId });
			const lifecycle = readGitHubPublicationSessionLifecycle({
				publicationKind: "personal",
				requestId: input.requestId
			});
			if (!row || row.session_id !== action.sessionId || !(row.status === "published" || row.status === "failed") && (!lifecycle || lifecycle.lifecycle_revision !== action.lifecycleRevision) || row.request_digest !== input.requestDigest || row.connection_generation !== input.generation || row.identity_account_id !== input.account.accountId || row.identity_login.toLowerCase() !== input.account.login.toLowerCase()) throw new Error("My GitHub confirmation no longer matches the original request.");
			if (row.status === "published" || row.status === "failed") return projectGitHubPublicationResult(row);
			if (active.has(row.request_id)) throw new Error("My GitHub publication is still running; wait for its result.");
			bindPersonalGitHubPublicationSelection(action, input);
			return await withWorkspace(action, async (workspace) => await execute(action, row, workspace));
		}
	};
}
//#endregion
//#region src/gateway/github-publication-shared-read.ts
function workspaceSelection(entry) {
	return {
		archivedAt: entry.archivedAt,
		repositoryWorkspaceId: entry.repositoryWorkspaceId,
		lifecycleRevision: entry.lifecycleRevision,
		...entry.worktree ? { worktree: {
			id: entry.worktree.id,
			branch: entry.worktree.branch,
			repoRoot: entry.worktree.repoRoot
		} } : {}
	};
}
/** Observation retains the selected session while the existing-only shared reader runs. */
async function readSharedGitHubPublication(kind, session, selector) {
	const capturedSelector = { ...selector };
	let workspaceIndependent = false;
	const selected = retainGatewaySessionEntryReadOnly(session.sessionKey, session.agentId, (previous, current) => workspaceIndependent || isDeepStrictEqual(workspaceSelection(previous), workspaceSelection(current)));
	try {
		const entry = selected.entry;
		if (!entry || selected.agentId !== session.agentId || selected.canonicalKey !== session.sessionKey || entry.sessionId !== session.sessionId || session.lifecycleRevision !== void 0 && (entry.lifecycleRevision ?? null) !== session.lifecycleRevision) throw new GitHubPublicationSessionChangedError();
		const result = await withArtifactPreservingStateReads(() => executeExistingOpenClawStateRead({}, {
			type: "githubPublication.sharedObservation",
			input: {
				kind,
				session,
				selector: capturedSelector,
				entry: workspaceSelection(entry)
			}
		}, {
			current: true,
			preferIndependentWarmRead: true
		}));
		if (result && (!result.ok || result.type !== "githubPublication.sharedObservation")) throw new Error("Shared GitHub publication observation is unavailable.");
		const row = result?.row;
		workspaceIndependent = "requestId" in capturedSelector && (!row || row.status === "published" || row.status === "failed");
		if (!selected.isCurrentAtResponse()) throw new GitHubPublicationSessionChangedError();
		return row;
	} finally {
		selected.release();
	}
}
//#endregion
//#region src/gateway/github-publication-coordinator-methods.ts
function exactClaimForPlacement(placement) {
	const claim = placement.turnClaim;
	if (claim?.owner !== "local") return projectWorkerSessionTurnClaim(placement);
	return {
		sessionId: placement.sessionId,
		claimId: claim.claimId,
		runId: claim.runId,
		placementGeneration: claim.generation,
		owner: {
			kind: "local",
			...placement.environmentId ? { environmentId: placement.environmentId } : {},
			...placement.activeOwnerEpoch !== null ? { ownerEpoch: placement.activeOwnerEpoch } : {}
		}
	};
}
function createSharedGitHubPublicationReadMethods(kind) {
	return {
		async sharedStatus(session, requestId) {
			const row = await readSharedGitHubPublication(kind, session, { requestId });
			return row ? {
				result: projectGitHubPublicationResult(row),
				confirmation: null
			} : void 0;
		},
		async latestShared(session, idempotencyKey, isSuperseded) {
			const row = await readSharedGitHubPublication(kind, session, { idempotencyKey });
			if (row?.status === "failed" && idempotencyKey === void 0 && isSuperseded && await isSuperseded({
				repository: row.repository,
				branch: row.branch,
				source_head_commit: row.source_head_commit,
				workspace_tree: row.workspace_tree
			})) return null;
			return row ? {
				result: projectGitHubPublicationResult(row),
				confirmation: null
			} : null;
		}
	};
}
function createGitHubPublicationCoordinatorMethods(params) {
	const { readById, requestForClaim, sameWorktree, processRow } = params;
	const deferOrphanedRequestsWithPendingResults = (results) => {
		const pending = new Set(results.map((row) => `${row.sessionId}\0${row.claimId}\0${row.runId}`));
		const db = openOpenClawStateDatabase().db;
		deferGitHubPublicationRequests(executeSqliteQuerySync(db, githubPublicationDatabase(db).selectFrom("github_publication_requests").selectAll().where("status", "in", ["requested", "publishing"]).orderBy("created_at_ms")).rows.filter((row) => {
			if (row.claim_id === null) return false;
			const ownerKey = `${row.session_id}\0${row.claim_id}\0${row.run_id}`;
			const liveClaim = params.placements.get(row.session_id)?.turnClaim;
			const stillLive = liveClaim?.claimId === row.claim_id && liveClaim.runId === row.run_id && liveClaim.generation === row.placement_generation;
			return !pending.has(ownerKey) && !stillLive;
		}).map((row) => row.request_id));
	};
	return {
		async requestForSession(input) {
			if (input.selection?.source === "personal") throw new Error("My GitHub publication requires direct personal authorization.");
			const expected = input.selection?.expected;
			const assertRequester = input.requester.assertCurrent;
			ensureGitHubPublicationStore();
			if (!input.sessionKey) throw new Error("GitHub publication requires an authoritative session.");
			assertRequester();
			const sessionId = loadGatewaySessionEntryReadOnly(input.sessionKey, { agentId: input.agentId }).entry?.sessionId;
			if (!sessionId) throw new Error("GitHub publication session changed.");
			const loaded = resolveGitHubPublicationWorktreeOwner({
				sessionId,
				sessionKey: input.sessionKey,
				agentId: input.agentId
			}).loaded;
			const lifecycleRevision = loaded.entry?.lifecycleRevision ?? null;
			const placement = params.placements.get(sessionId);
			const validateLocalExecution = () => {
				const current = params.placements.get(sessionId);
				return (!current || current.state === "local") && !current?.turnClaim;
			};
			const capturePlacement = placement ? {
				state: placement.state,
				generation: placement.generation,
				updatedAtMs: placement.updatedAtMs
			} : null;
			const assertCaptureAuthority = () => {
				assertRequester();
				resolveGitHubPublicationWorktreeOwner({
					sessionId,
					sessionKey: loaded.canonicalKey,
					agentId: input.agentId,
					lifecycleRevision
				});
				const current = params.placements.get(sessionId);
				if (!(capturePlacement ? current?.state === capturePlacement.state && current.generation === capturePlacement.generation && current.updatedAtMs === capturePlacement.updatedAtMs && !current.turnClaim : current === void 0)) throw new Error("GitHub publication session authority changed during snapshot.");
			};
			const claim = placement ? exactClaimForPlacement(placement) : void 0;
			if (claim && input.expectedRunId && claim.runId === input.expectedRunId) {
				const accepted = await requestForClaim({
					expectedPublisher: expected,
					claim,
					sessionKey: loaded.canonicalKey,
					agentId: input.agentId,
					idempotencyKey: input.idempotencyKey,
					requester: input.requester,
					...input.title ? { title: input.title } : {},
					...input.body ? { body: input.body } : {}
				});
				assertRequester();
				if (placement?.state !== "local") return accepted;
				const row = readById(accepted.requestId);
				if (!row) throw new Error("GitHub publication request disappeared.");
				return await processRow(row, () => params.placements.validateTurnClaim(claim), input.requester.assertInvocationCurrent);
			}
			if (claim && placement?.state === "local") throw new Error(input.expectedRunId ? "GitHub publication run identity changed." : "GitHub publication cannot join another active session turn.");
			const deferred = placement !== void 0 && placement.state !== "local";
			const { worktree } = resolveGitHubPublicationWorktreeOwner({
				sessionId,
				sessionKey: loaded.canonicalKey,
				agentId: input.agentId
			});
			const requestDigest = digestGitHubPublicationRequest({
				sessionId,
				idempotencyKey: input.idempotencyKey,
				title: input.title,
				body: input.body
			});
			const database = openOpenClawStateDatabase().db;
			const readRequest = () => readGitHubPublicationRequest(database, {
				sessionId,
				idempotencyKey: input.idempotencyKey
			});
			const existing = readRequest();
			if (existing) {
				if (existing.request_digest !== requestDigest || !sameWorktree(existing, worktree)) throw new Error("GitHub publication idempotency key was reused.");
				if (existing.status === "published" || existing.status === "failed") {
					const result = projectGitHubPublicationResult(existing);
					assertExpectedSharedGitHubPublisher(expected, result.publisher);
					return result;
				}
				const lifecycle = await readGitHubPublicationSessionLifecycleInWorker({
					publicationKind: "shared",
					requestId: existing.request_id
				}).catch((cause) => {
					throw new GitHubPublicationRecoveryPendingError("GitHub publication requester metadata is unavailable; retry the existing request.", { cause });
				});
				input.requester.assertInvocationCurrent();
				if (!lifecycle || lifecycle.lifecycle_revision !== lifecycleRevision) return await processRow(existing, validateLocalExecution, input.requester.assertInvocationCurrent);
			}
			assertRequester();
			const identity = await prepareCurrentGitHubPublicationIdentity(input.agentId);
			assertRequester();
			assertExpectedSharedGitHubPublisher(expected, {
				source: identity.source,
				...identity.account
			}, existing ? void 0 : {
				idempotencyKey: input.idempotencyKey,
				hasRequest: () => Boolean(readRequest())
			});
			const insertSessionRequest = (snapshot) => {
				const now = Date.now();
				const requestId = randomUUID();
				assertRequester();
				return runOpenClawStateWriteTransaction(({ db }) => {
					return insertGitHubPublicationRequest(db, {
						request: {
							...input,
							sessionKey: loaded.canonicalKey
						},
						requestId,
						requestDigest,
						now,
						identity,
						worktree,
						sessionId,
						lifecycleRevision,
						requester: input.requester.snapshot,
						assertCurrent: () => {
							assertRequester();
							resolveGitHubPublicationWorktreeOwner({
								sessionId,
								sessionKey: loaded.canonicalKey,
								agentId: input.agentId,
								lifecycleRevision,
								expected: {
									worktreeId: worktree.id,
									repositoryFingerprint: worktree.repoFingerprint,
									branch: worktree.branch
								}
							});
						},
						snapshot
					});
				}, void 0, { operationLabel: "github-publication.request-session" });
			};
			if (deferred) {
				resolveGitHubPublicationWorktreeOwner({
					sessionId,
					sessionKey: loaded.canonicalKey,
					agentId: input.agentId,
					lifecycleRevision,
					expected: {
						worktreeId: worktree.id,
						repositoryFingerprint: worktree.repoFingerprint,
						branch: worktree.branch
					}
				});
				return projectGitHubPublicationResult(insertSessionRequest());
			}
			const current = params.placements.get(sessionId);
			if (current && current.state !== "local" || current?.turnClaim) throw new Error("GitHub publication session authority changed after verification.");
			const snapshot = existing?.source_head_commit && existing.source_index_tree && existing.workspace_tree ? {
				sourceHeadCommit: existing.source_head_commit,
				sourceIndexTree: existing.source_index_tree,
				workspaceTree: existing.workspace_tree
			} : await captureGitHubPublicationWorkspaceSnapshot({
				cwd: worktree.path,
				assertCurrent: assertCaptureAuthority
			});
			assertCaptureAuthority();
			resolveGitHubPublicationWorktreeOwner({
				sessionId,
				sessionKey: loaded.canonicalKey,
				agentId: input.agentId,
				expected: {
					worktreeId: worktree.id,
					repositoryFingerprint: worktree.repoFingerprint,
					branch: worktree.branch
				}
			});
			const row = insertSessionRequest(snapshot);
			return await processRow(row, validateLocalExecution, input.requester.assertInvocationCurrent);
		},
		async resumeSessionRequests() {
			if (!hasGitHubPublicationStore()) return;
			const db = openOpenClawStateDatabase().db;
			const rows = executeSqliteQuerySync(db, githubPublicationDatabase(db).selectFrom("github_publication_requests").selectAll().where("claim_id", "is", null).where("status", "in", ["requested", "publishing"]).orderBy("created_at_ms")).rows;
			const pending = new Set((await params.placements.listPendingWorkspaceResultsAsync()).map((result) => result.sessionId));
			const failures = [];
			const blockedWorktrees = /* @__PURE__ */ new Set();
			for (const row of rows) {
				if (blockedWorktrees.has(row.worktree_id) || pending.has(row.session_id) || params.placements.get(row.session_id)?.turnClaim) continue;
				try {
					await processRow(row, () => {
						return !params.placements.get(row.session_id)?.turnClaim && !pending.has(row.session_id);
					});
				} catch (error) {
					blockedWorktrees.add(row.worktree_id);
					failures.push(new Error(`Publication ${row.request_id}: ${formatErrorMessage(error)}`, { cause: error }));
				}
			}
			if (failures.length > 0) throw new AggregateError(failures, failures.map((error) => error.message).join("; "));
		},
		async processClaim(claim) {
			ensureGitHubPublicationStore();
			const db = openOpenClawStateDatabase().db;
			const rows = listGitHubPublicationsForClaim(claim);
			deferGitHubPublicationRequests(rows.filter((row) => !row.source_head_commit || !row.source_index_tree || !row.workspace_tree).map((row) => row.request_id));
			const results = [];
			for (const row of rows) {
				if (!row.source_head_commit || !row.source_index_tree || !row.workspace_tree) continue;
				await params.placements.prepareWorkspaceResultClaim(claim);
				results.push(await processRow(row, () => params.placements.validateWorkspaceResultClaim(claim)));
			}
			const deferred = executeSqliteQuerySync(db, githubPublicationDatabase(db).selectFrom("github_publication_requests").selectAll().where("session_id", "=", claim.sessionId).where("claim_id", "is", null).where("status", "=", "requested").orderBy("created_at_ms")).rows;
			for (const row of deferred) {
				await params.placements.prepareWorkspaceResultClaim(claim);
				results.push(await processRow(row, () => params.placements.validateWorkspaceResultClaim(claim)));
			}
			return results;
		},
		/** @deprecated Await deferOrphanedRequestsAsync; retained for released plugin contexts. */
		deferOrphanedRequests() {
			if (!hasGitHubPublicationStore()) return;
			deferOrphanedRequestsWithPendingResults(params.placements.listPendingWorkspaceResults());
		},
		async deferOrphanedRequestsAsync() {
			if (!hasGitHubPublicationStore()) return;
			deferOrphanedRequestsWithPendingResults(await params.placements.listPendingWorkspaceResultsAsync());
		},
		listUnreportedResults() {
			const personal = listUnreportedPersonalGitHubPublications();
			if (!hasGitHubPublicationStore()) return personal;
			const db = openOpenClawStateDatabase().db;
			return [...personal, ...executeSqliteQuerySync(db, githubPublicationDatabase(db).selectFrom("github_publication_requests").selectAll().where("status", "in", ["published", "failed"]).where("reported_at_ms", "is", null).orderBy("updated_at_ms")).rows.map((row) => ({
				sessionId: row.session_id,
				sessionKey: row.session_key,
				agentId: row.agent_id,
				result: projectGitHubPublicationResult(row)
			}))];
		},
		...createSharedGitHubPublicationReadMethods("worktree"),
		read(requestId) {
			const row = readById(requestId);
			return row ? projectGitHubPublicationResult(row) : void 0;
		},
		markReported(requestId) {
			markPersonalGitHubPublicationReported(requestId);
			ensureGitHubPublicationStore();
			runOpenClawStateWriteTransaction(({ db }) => {
				executeSqliteQuerySync(db, githubPublicationDatabase(db).updateTable("github_publication_requests").set({
					reported_at_ms: Date.now(),
					updated_at_ms: Date.now()
				}).where("request_id", "=", requestId).where("reported_at_ms", "is", null));
			}, void 0, { operationLabel: "github-publication.report" });
		}
	};
}
//#endregion
//#region src/gateway/github-repository-publication-executor.ts
async function api(endpoint, identity, assertCurrent, body) {
	assertCurrent();
	const raw = await requirePublicationCommand(githubPublicationApiArgs(endpoint, body === void 0 ? "GET" : "POST", identity.host ?? resolveGitHubHost()), {
		env: identity.env,
		beforeRun: assertCurrent,
		...body === void 0 ? {} : { input: JSON.stringify(body) }
	});
	assertCurrent();
	return JSON.parse(raw);
}
function objectSha(value) {
	if (!isRecord(value) || typeof value.sha !== "string" || !/^[a-f0-9]{40}$/u.test(value.sha)) throw new Error("GitHub returned an invalid Git object identity.");
	return value.sha;
}
async function prepareRepositoryGitHubPublicationTarget(workspace, identity, assertCurrent) {
	const githubHost = identity.host ?? resolveGitHubHost();
	const remote = parseGitHubRemoteUrl(workspace.url, githubHost);
	if (!remote || !/^[A-Za-z0-9_.-]+$/u.test(remote.owner) || !/^[A-Za-z0-9_.-]+$/u.test(remote.repo)) throw new Error("GitHub publication requires a GitHub remote.");
	const pushRepository = remote.owner + "/" + remote.repo;
	const value = await api("repos/" + pushRepository, identity, assertCurrent);
	const target = resolveGitHubRepositoryTarget(value, remote);
	if (!target) throw new Error("GitHub repository response omitted its publication target.");
	let baseBranch = target.fork ? target.pullRequest.defaultBranch : parseGitHubPublicationBaseBranch(workspace.requestedRef ?? "HEAD", target.pullRequest.defaultBranch);
	if (!target.fork && baseBranch !== target.pullRequest.defaultBranch) {
		const refs = await api("repos/" + pushRepository + "/git/matching-refs/heads/" + encodeURIComponent(baseBranch), identity, assertCurrent);
		if (!Array.isArray(refs)) throw new Error("GitHub publication base branch lookup was invalid.");
		if (!refs.some((ref) => isRecord(ref) && ref.ref === "refs/heads/" + baseBranch)) baseBranch = target.pullRequest.defaultBranch;
	}
	if (workspace.branch === baseBranch) throw new GitHubPublicationWorkspaceChangedError("GitHub publication branch is its pull request base.");
	return {
		pushRepository,
		repository: target.pullRequest.owner + "/" + target.pullRequest.repo,
		baseBranch
	};
}
/** GitHub receives only accepted normalized objects; the Gateway never fetches source history. */
async function executeRepositoryGitHubPublication(params) {
	const { execution, snapshot } = params;
	const row = execution.row;
	const { assertCurrent, refreshIdentity } = createGitHubPublicationExecutionIdentity({
		row,
		identity: params.identity,
		assertWorkspace: params.assertWorkspace,
		validateAuthority: () => params.validateAuthority() && execution.ownsExecution()
	});
	let dispatched = row.last_effect !== null;
	try {
		assertCurrent();
		const { push_repository: pushRepository, repository, base_branch: baseBranch, branch } = row;
		if (!pushRepository || !repository || !baseBranch || snapshot.baseCommit !== row.source_head_commit || snapshot.baseTree !== row.source_index_tree || snapshot.workspaceTree !== row.workspace_tree) throw new GitHubPublicationWorkspaceChangedError("GitHub publication accepted checkpoint changed.");
		let identity = await refreshIdentity();
		const endpoint = "repos/" + pushRepository + "/git/";
		const sourceRepository = await api("repos/" + pushRepository, identity, assertCurrent);
		if (!isRecord(sourceRepository) || typeof sourceRepository.node_id !== "string" || !sourceRepository.node_id) throw new Error("GitHub publication repository identity is unavailable.");
		const base = await api(endpoint + "commits/" + snapshot.baseCommit, identity, assertCurrent);
		if (!isRecord(base) || objectSha(base.tree) !== snapshot.baseTree || objectSha(base) !== snapshot.baseCommit) throw new GitHubPublicationWorkspaceChangedError("GitHub publication pinned repository base changed.");
		const baseRef = await api("repos/" + repository + "/git/ref/heads/" + encodeURIComponent(baseBranch), identity, assertCurrent);
		if (!isRecord(baseRef) || baseRef.ref !== "refs/heads/" + baseBranch) throw new Error("GitHub publication workspace base branch could not be verified.");
		const remoteBase = objectSha(baseRef.object);
		const readMergeBase = async (source) => {
			const lineage = await requirePublicationCommand([
				...githubPublicationApiArgs("repos/" + repository + "/compare/" + source + "..." + remoteBase + "?per_page=1", "GET", identity.host ?? resolveGitHubHost()),
				"--jq",
				"{sha: .merge_base_commit.sha}"
			], {
				env: identity.env,
				beforeRun: assertCurrent
			});
			assertCurrent();
			return objectSha(JSON.parse(lineage));
		};
		const mergeBase = await readMergeBase(snapshot.baseCommit);
		let headCommit = row.head_commit;
		let preparedCommitMessage;
		const verifyCommit = (value) => {
			if (!isRecord(value) || objectSha(value.tree) !== snapshot.workspaceTree || !Array.isArray(value.parents) || value.parents.length !== 1 || objectSha(value.parents[0]) !== (row.previous_head_commit ?? snapshot.baseCommit) || typeof value.message !== "string" || !value.message.split(/\r?\n/u).includes("OpenClaw-Publication: " + row.request_id)) throw new GitHubPublicationWorkspaceChangedError("GitHub publication commit does not match its accepted checkpoint.");
			preparedCommitMessage = value.message;
			return objectSha(value);
		};
		if (headCommit) {
			if (verifyCommit(await api(endpoint + "commits/" + headCommit, identity, assertCurrent)) !== headCommit) throw new Error("GitHub publication commit identity changed.");
		}
		const observeHead = async () => {
			const observedIdentity = await refreshIdentity();
			const raw = await requirePublicationCommand(githubPublicationApiArgs(endpoint + "matching-refs/heads/" + encodeURIComponent(branch), "GET", observedIdentity.host ?? resolveGitHubHost()), { env: observedIdentity.env });
			const value = JSON.parse(raw);
			if (!Array.isArray(value)) throw new Error("GitHub branch observation was invalid.");
			const ref = value.find((entry) => isRecord(entry) && entry.ref === "refs/heads/" + branch);
			const observed = isRecord(ref) ? objectSha(ref.object) : null;
			if (headCommit && observed === headCommit) execution.recordEffect("push", { headCommit });
			assertCurrent();
			return observed;
		};
		let remoteHead = await observeHead();
		if (remoteHead !== row.previous_head_commit && (!headCommit || remoteHead !== headCommit)) throw new GitHubPublicationBranchChangedError();
		const comparisonCommit = row.previous_head_commit ?? mergeBase;
		const comparisonRepository = row.previous_head_commit ? pushRepository : repository;
		const comparison = comparisonRepository === pushRepository && comparisonCommit === snapshot.baseCommit ? base : await api("repos/" + comparisonRepository + "/git/commits/" + comparisonCommit, identity, assertCurrent);
		if (!isRecord(comparison) || objectSha(comparison) !== comparisonCommit) throw new Error("GitHub publication comparison commit changed.");
		if (snapshot.workspaceTree === objectSha(comparison.tree)) throw new GitHubPublicationKnownFailure("GitHub publication has no changes to publish.", {
			code: "no_changes",
			nextAction: "Make or restore a repository change, then retry."
		});
		const pushOwner = pushRepository.split("/")[0];
		const marker = "<!-- openclaw-publication:" + row.request_id + " -->";
		const findPullRequest = () => findGitHubPublicationPullRequest({
			repository,
			pushOwner,
			branch,
			baseBranch,
			headCommit: headCommit ?? snapshot.baseCommit,
			marker,
			host: identity.host ?? resolveGitHubHost(),
			refreshIdentity,
			assertCurrent,
			recordObserved: (url) => execution.recordEffect("pull_request", { url })
		});
		await findPullRequest();
		const assertWorkflowAuthority = await prepareGitHubPublicationWorkflowGuard(params.assertWorkflowChangesAllowed, () => hasRepositoryGitHubPublicationWorkflowChanges({
			snapshot,
			sourceRepository: pushRepository,
			comparisonRepository,
			comparisonTree: objectSha(comparison.tree),
			readUpstream: async () => {
				if (mergeBase !== snapshot.baseCommit && mergeBase !== remoteBase) return;
				const ancestor = row.previous_head_commit ? await readMergeBase(row.previous_head_commit) : mergeBase;
				const readTreeSha = async (commit) => {
					const value = await api("repos/" + repository + "/git/commits/" + commit, identity, assertCurrent);
					if (!isRecord(value) || objectSha(value) !== commit) throw new Error("GitHub publication workflow commit changed.");
					return objectSha(value.tree);
				};
				const [ancestorTree, targetTree] = await Promise.all([readTreeSha(ancestor), readTreeSha(remoteBase)]);
				return {
					repository,
					ancestorTree,
					targetTree
				};
			},
			readTree: (owner, sha) => api("repos/" + owner + "/git/trees/" + sha, identity, assertCurrent)
		}));
		const assertPublicationAction = () => {
			assertWorkflowAuthority();
			assertCurrent();
		};
		assertPublicationAction();
		const config = currentGitHubPublicationConfig();
		const preparedAttribution = await prepareGitCoauthorAttribution({
			agentId: row.agent_id,
			config,
			excludeAccountId: identity.account.accountId,
			sessionKey: row.session_key,
			sessionId: row.session_id,
			storePath: params.storePath
		});
		const attribution = preparedAttribution.attribution;
		const assertAction = () => {
			assertPublicationAction();
			if (!preparedAttribution.isCurrent()) throw new GitHubPublicationCreditChangedError();
		};
		assertAction();
		if (headCommit && remoteHead !== headCommit && !hasGitHubPublicationMessageFooter(preparedCommitMessage ?? "", attribution?.trailers ?? [], "OpenClaw-Publication: " + row.request_id)) throw new GitHubPublicationCreditChangedError();
		const credit = attribution?.logins.map((login) => "- @" + login).join("\n");
		const title = row.title?.trim() || "Publish " + branch;
		if (!headCommit) {
			const shas = [...new Set(snapshot.entries.flatMap((entry) => entry.sha !== null && entry.mode !== "160000" ? [entry.sha] : []))];
			identity = await refreshIdentity();
			const uploaded = await runTasksWithConcurrency({
				limit: 4,
				errorMode: "stop",
				tasks: shas.map((sha) => async () => {
					assertCurrent();
					const bytes = await readGitHubRepositoryPublicationBlob(params.snapshotRoot, sha);
					assertCurrent();
					if (objectSha(await api(endpoint + "blobs", identity, assertAction, {
						content: bytes.toString("base64"),
						encoding: "base64"
					})) !== sha) throw new Error("GitHub publication blob content changed.");
				})
			});
			if (uploaded.hasError) throw uploaded.firstError;
			if ((snapshot.entries.length === 0 ? snapshot.baseTree : objectSha(await api(endpoint + "trees", identity, assertAction, {
				base_tree: snapshot.baseTree,
				tree: snapshot.entries.map((entry) => ({
					path: entry.path,
					mode: entry.mode,
					type: entry.mode === "160000" ? "commit" : "blob",
					sha: entry.sha
				}))
			}))) !== snapshot.workspaceTree) throw new GitHubPublicationWorkspaceChangedError("GitHub publication normalized tree changed.");
			const author = {
				name: identity.account.login,
				email: identity.account.accountId + "+" + identity.account.login + "@users.noreply.github.com",
				date: new Date(row.created_at_ms).toISOString()
			};
			headCommit = verifyCommit(await api(endpoint + "commits", identity, assertAction, {
				tree: snapshot.workspaceTree,
				parents: [row.previous_head_commit ?? snapshot.baseCommit],
				author,
				committer: author,
				message: appendGitHubPublicationMessage(credit ? title + "\n\nWorked on by:\n" + credit : title, [...attribution?.trailers ?? [], "OpenClaw-Publication: " + row.request_id]) + "\n"
			}));
			execution.updateHead(headCommit);
		}
		if (remoteHead !== headCommit) {
			identity = await refreshIdentity();
			assertAction();
			execution.recordEffect("push");
			dispatched = true;
			const result = await runPublicationCommand(githubPublicationApiArgs("graphql", "POST", identity.host ?? resolveGitHubHost()), {
				env: identity.env,
				beforeRun: assertAction,
				input: JSON.stringify({
					query: "mutation($input: UpdateRefsInput!) { updateRefs(input: $input) { clientMutationId } }",
					variables: { input: {
						repositoryId: sourceRepository.node_id,
						clientMutationId: row.request_id,
						refUpdates: [{
							name: "refs/heads/" + branch,
							beforeOid: remoteHead ?? "0".repeat(40),
							afterOid: headCommit,
							force: false
						}]
					} }
				})
			});
			let succeeded = false;
			if (result.code === 0) {
				const reply = JSON.parse(result.stdout.toString("utf8"));
				succeeded = isRecord(reply) && !reply.errors && isRecord(reply.data) && isRecord(reply.data.updateRefs) && reply.data.updateRefs.clientMutationId === row.request_id;
			}
			execution.recordEffect("push", succeeded ? { headCommit } : {});
			assertCurrent();
			remoteHead = await observeHead();
			if (remoteHead !== headCommit) throw new Error("GitHub push verification failed.");
		}
		let url = await findPullRequest();
		if (!url) {
			const sessionUrl = resolveControlUiSessionUrl(config, {
				sessionKey: row.session_key,
				fallbackAgentId: row.agent_id,
				exactKey: true
			});
			const body = (row.body?.trim() || "Published by the Gateway from the accepted repository checkpoint.") + (credit ? "\n\n## Worked on by\n\n" + credit : "") + "\n\n" + marker + (sessionUrl?.startsWith("https://") ? "\n\n---\n[View the OpenClaw team session](" + sessionUrl + ")" : "");
			identity = await refreshIdentity();
			assertAction();
			execution.recordEffect("pull_request");
			dispatched = true;
			const created = await runPublicationCommand(githubPublicationApiArgs(`repos/${repository}/pulls`, "POST", identity.host ?? resolveGitHubHost()), {
				env: identity.env,
				beforeRun: assertAction,
				input: JSON.stringify({
					title,
					body,
					head: pushOwner + ":" + branch,
					base: baseBranch,
					draft: true
				})
			});
			if (created.code === 0) {
				const value = JSON.parse(created.stdout.toString("utf8"));
				if (isRecord(value) && typeof value.html_url === "string") url = value.html_url;
			}
			execution.recordEffect("pull_request", url ? { url } : {});
			if (!url) {
				assertCurrent();
				url = await findPullRequest();
			}
		}
		if (!url) throw new Error("GitHub pull request creation was rejected.");
		return projectGitHubPublicationResult(execution.complete({
			requestId: row.request_id,
			status: "published",
			url,
			repository,
			branch,
			headCommit
		}));
	} catch (error) {
		if (error instanceof GitHubPublicationRequesterUnavailableError || error instanceof GatewayOperatorAccessUnavailableError) throw error;
		if (dispatched && !(error instanceof GitHubPublicationKnownFailure)) {
			const interrupted = execution.interrupt();
			if (error instanceof SessionMutationAuthorizationChangedError) throw error;
			return projectGitHubPublicationResult(interrupted);
		}
		const failure = resolveGitHubPublicationFailure(error);
		return projectGitHubPublicationResult(execution.complete({
			requestId: row.request_id,
			status: "failed",
			...failure,
			message: "GitHub publication failed."
		}));
	}
}
//#endregion
//#region src/gateway/github-repository-publication-recovery.ts
async function settleDeniedRepositoryGitHubPublication(params) {
	const { execution, assertCustody, error } = params;
	assertCustody();
	if (!execution.ownsExecution()) throw new GitHubPublicationRecoveryPendingError("GitHub publication execution custody changed during reconciliation.");
	const row = await readRepositoryGitHubPublicationInWorker(execution.row.request_id).catch((cause) => {
		throw new GitHubPublicationRecoveryPendingError("GitHub publication receipt is unavailable; retry recovery.", { cause });
	});
	assertCustody();
	if (!row || !execution.ownsExecution()) throw new GitHubPublicationRecoveryPendingError("GitHub publication execution custody changed during reconciliation.");
	const requester = decodeGitHubPublicationRequester(row.requester_authority_json);
	if (row.last_effect !== null || !requester && row.head_commit !== null) {
		if (!row.repository || !row.push_repository || !row.base_branch || !row.head_commit || !row.source_head_commit || !row.workspace_tree) throw new GitHubPublicationRecoveryPendingError("GitHub publication's recorded effects lack the facts needed for recovery; inspect the original target before requesting another publication.");
		const preparedOwner = await getSessionRepositoryWorkspaceStore().prepare(row.workspace_id);
		assertCustody();
		const { assertCurrent, refreshIdentity } = createGitHubPublicationExecutionIdentity({
			row,
			validateAuthority: () => {
				assertCustody();
				return execution.ownsExecution();
			},
			assertWorkspace: () => {
				assertReceiptOwner(row, preparedOwner);
			}
		});
		let url;
		try {
			assertCurrent();
			const knownPullRequestUrls = await readKnownRepositoryGitHubPublicationPullRequestUrls(row);
			assertCurrent();
			url = await reconcileGitHubPublicationPullRequest({
				requestId: row.request_id,
				pushRepository: row.push_repository,
				repository: row.repository,
				pushOwner: row.push_repository.split("/")[0],
				branch: row.branch,
				baseBranch: row.base_branch,
				headCommit: row.head_commit,
				workspaceTree: row.workspace_tree,
				parentCommit: row.previous_head_commit ?? row.source_head_commit,
				marker: `<!-- openclaw-publication:${row.request_id} -->`,
				knownPullRequestUrls,
				refreshIdentity,
				assertCurrent,
				pushOnly: requester && row.last_effect === "push" ? row.effect_state === "observed" && row.pushed_head_commit === row.head_commit ? "observed" : "dispatched" : void 0,
				recordPushObserved: (headCommit) => execution.recordEffect("push", { headCommit }),
				recordObserved: (observedUrl) => execution.recordEffect("pull_request", { url: observedUrl })
			});
		} catch (observationError) {
			throw new GitHubPublicationRecoveryPendingError("GitHub publication is unconfirmed; restore read access to the original target and retry recovery. Recorded effects are retained.", { cause: observationError });
		}
		if (url) return projectGitHubPublicationResult(execution.complete({
			requestId: row.request_id,
			status: "published",
			url,
			repository: row.repository,
			branch: row.branch,
			headCommit: row.head_commit
		}));
	}
	return projectGitHubPublicationResult(execution.complete({
		requestId: row.request_id,
		status: "failed",
		...error.failure,
		message: error.message
	}));
}
function matchesRepositoryGitHubPublicationClaim(row, claim) {
	return row.environment_id !== null && row.owner_epoch !== null && row.session_id === claim.sessionId && row.claim_id === claim.claimId && row.run_id === claim.runId && row.placement_generation === claim.placementGeneration && row.environment_id === (claim.owner.environmentId ?? null) && row.owner_epoch === (claim.owner.ownerEpoch ?? null);
}
function createRepositoryGitHubPublicationRecovery(params) {
	const { placements } = params;
	const deferOrphanedRequestsWithPendingResults = (pending) => {
		deferRepositoryGitHubPublicationClaims(listRepositoryGitHubPublications({
			ownerProfileId: null,
			pending: true
		}).filter((row) => {
			if (!row.claim_id) return false;
			const placement = placements.get(row.session_id);
			const claim = placement ? exactClaimForPlacement(placement) : void 0;
			return !(claim && matchesRepositoryGitHubPublicationClaim(row, claim)) && !pending.some((result) => result.sessionId === row.session_id && result.claimId === row.claim_id && result.runId === row.run_id);
		}).map((row) => row.request_id));
	};
	return {
		async prepareClaimWorkspace(claim) {
			const assertCurrent = () => {
				if (!placements.validateWorkspaceResultClaim(claim)) throw new Error("GitHub publication lost its workspace result claim.");
			};
			const pending = listRepositoryGitHubPublications({
				sessionId: claim.sessionId,
				ownerProfileId: null,
				pending: true
			});
			for (const row of pending.filter((candidate) => !candidate.checkpoint_ref && (candidate.claim_id === null || matchesRepositoryGitHubPublicationClaim(candidate, claim)))) try {
				await placements.prepareWorkspaceResultClaim(claim);
				const requester = await restoreGitHubPublicationRequester(row.requester_authority_json, {
					sessionKey: row.session_key,
					agentId: row.agent_id
				}, params.getCommittedRuntimeConfig);
				try {
					const assertPreparation = () => {
						assertCurrent();
						requester.assertCurrent();
					};
					await captureCheckpoint(row, assertPreparation, async (facts) => {
						bindRepositoryGitHubPublicationCheckpoint(row, facts, assertPreparation);
					});
				} finally {
					requester.release();
				}
			} catch (error) {
				if (!(error instanceof GitHubPublicationRequesterUnavailableError)) throw error;
			}
		},
		deferClaimPreparation(claim) {
			deferRepositoryGitHubPublicationClaims(listRepositoryGitHubPublications({
				sessionId: claim.sessionId,
				ownerProfileId: null,
				pending: true
			}).filter((row) => matchesRepositoryGitHubPublicationClaim(row, claim)).map((row) => row.request_id));
		},
		async resumeSessionRequests() {
			const failures = [];
			for (let row of listRepositoryGitHubPublications({
				ownerProfileId: null,
				pending: true
			})) try {
				if (placements.get(row.session_id)?.turnClaim || params.isExecuting(row.request_id)) continue;
				await placements.withRepositoryWorkspaceReservation({
					sessionId: row.session_id,
					sessionKey: row.session_key,
					agentId: row.agent_id
				}, async (assertCurrent) => {
					row = requireRepositoryGitHubPublication(row.request_id);
					if (terminalRepositoryGitHubPublication(row)) return;
					const workspaceId = row.workspace_id;
					const preparedOwner = await getSessionRepositoryWorkspaceStore().prepare(workspaceId);
					assertCurrent();
					row = requireRepositoryGitHubPublication(row.request_id);
					if (terminalRepositoryGitHubPublication(row)) return;
					if (row.workspace_id !== workspaceId) throw new GitHubPublicationRecoveryPendingError("GitHub publication repository source changed during recovery.");
					if (!resolveReceiptOwner(row, preparedOwner)) {
						failStaleRepositoryGitHubPublication(row, () => Boolean(resolveReceiptOwner(row, preparedOwner)));
						return;
					}
					await params.execute(row, assertCurrent);
				});
			} catch (error) {
				if (error instanceof SessionWorkspaceReservationBusyError || error instanceof OpenClawStateLeaseAcquisitionError && error.outcome.kind === "held") continue;
				failures.push(new Error(`Publication ${row.request_id}: ${formatErrorMessage(error)}`, { cause: error }));
			}
			if (failures.length > 0) throw new AggregateError(failures, failures.map((error) => error.message).join("; "));
		},
		/** @deprecated Await deferOrphanedRequestsAsync; retained for released plugin contexts. */
		deferOrphanedRequests() {
			deferOrphanedRequestsWithPendingResults(placements.listPendingWorkspaceResults());
		},
		async deferOrphanedRequestsAsync() {
			deferOrphanedRequestsWithPendingResults(await placements.listPendingWorkspaceResultsAsync());
		}
	};
}
async function readRepositoryGitHubPublicationInWorker(requestId) {
	const result = await executeExistingOpenClawStateRead({}, {
		type: "githubRepository.request",
		requestId
	}, { current: true });
	if (!result?.ok || result.type !== "githubRepository.request") throw new Error("GitHub repository publication receipt is unavailable.");
	return result.row;
}
async function readKnownRepositoryGitHubPublicationPullRequestUrls(row) {
	const { workspace_id, push_repository, repository, branch, base_branch, identity_account_id, pull_request_url } = row;
	const result = await executeExistingOpenClawStateRead({}, {
		type: "githubRepository.knownPullRequestUrls",
		input: {
			workspace_id,
			push_repository,
			repository,
			branch,
			base_branch,
			identity_account_id,
			pull_request_url
		}
	}, { current: true });
	if (!result?.ok || result.type !== "githubRepository.knownPullRequestUrls") throw new Error("GitHub repository publication receipt history is unavailable.");
	return result.urls;
}
//#endregion
//#region src/gateway/github-repository-publication.ts
function createRepositoryGitHubPublicationCoordinator(params) {
	const { placements, getCommittedRuntimeConfig } = params;
	const instanceId = placements.workspaceResultInstanceId();
	const active = /* @__PURE__ */ new Map();
	const requestByKey = (sessionId, key, owner) => listRepositoryGitHubPublications({
		sessionId,
		idempotencyKey: key,
		ownerProfileId: owner
	})[0];
	const { preparePersonalStatus, personalStatus } = createPersonalRepositoryPublicationStatusReader((row) => row.execution_id !== null && row.gateway_instance_id === instanceId && active.get(row.request_id) === row.execution_id);
	const execute = async (initial, context) => {
		let row = requireRepositoryGitHubPublication(initial.request_id);
		if (terminalRepositoryGitHubPublication(row)) return projectGitHubPublicationResult(row);
		const { assertCustody, action } = context;
		assertCustody();
		const preparedOwner = await getSessionRepositoryWorkspaceStore().prepare(row.workspace_id);
		assertCustody();
		row = requireRepositoryGitHubPublication(initial.request_id);
		if (terminalRepositoryGitHubPublication(row)) return projectGitHubPublicationResult(row);
		const { loaded } = assertReceiptOwner(row, preparedOwner);
		const bound = action && row.connection_generation ? bindPersonalGitHubPublicationSelection(action, {
			generation: row.connection_generation,
			account: {
				accountId: row.identity_account_id,
				login: row.identity_login
			}
		}) : void 0;
		if (row.owner_profile_id !== null !== Boolean(bound) || bound && bound.profileId !== row.identity_profile_id) throw new Error("My GitHub publication owner changed.");
		let requester;
		const getRequester = () => {
			if (!requester) throw new GitHubPublicationRequesterUnavailableError();
			return requester;
		};
		const assertExecution = () => {
			assertReceiptOwner(row, preparedOwner);
			assertCustody();
			if (row.owner_profile_id === null) getRequester().assertCurrent();
			context.assertCurrent?.();
			bound?.assertCurrent();
		};
		let execution;
		const claimExecution = () => {
			if (!execution) {
				execution = claimRepositoryGitHubPublication(row, instanceId, {
					assertCustody,
					assertCurrent: assertExecution
				});
				active.set(row.request_id, execution.row.execution_id);
			}
			return execution;
		};
		const publish = async (captured) => {
			assertExecution();
			if (captured.checkpointRef !== row.checkpoint_ref || captured.digest !== row.checkpoint_digest) throw new Error("GitHub publication accepted checkpoint changed.");
			return await executeRepositoryGitHubPublication({
				execution: claimExecution(),
				snapshot: captured.snapshot,
				snapshotRoot: captured.snapshotRoot,
				storePath: loaded.storePath,
				assertWorkflowChangesAllowed: bound ? assertExecution : () => assertGitHubPublicationWorkflowChangesAllowed(getRequester()),
				assertWorkspace: () => {
					assertReceiptOwner(row, preparedOwner);
				},
				validateAuthority: () => {
					assertExecution();
					return true;
				},
				...bound ? { identity: {
					prepare: () => preparePersonalGitHubPublicationSelection(bound, assertExecution),
					isCurrent: (identity) => {
						assertExecution();
						return identity.source === "personal" && identity.profileId === bound.profileId && identity.account.accountId === row.identity_account_id;
					}
				} } : {}
			});
		};
		try {
			if (row.owner_profile_id === null) requester = await restoreGitHubPublicationRequester(row.requester_authority_json, {
				sessionKey: row.session_key,
				agentId: row.agent_id
			}, getCommittedRuntimeConfig);
			assertExecution();
			if (!row.checkpoint_ref) {
				if (row.owner_profile_id === null && !assertReceiptOwner(row, preparedOwner).workspace.checkpointRef) return projectGitHubPublicationResult(row);
				return await captureCheckpoint(row, assertExecution, async (facts, prepared) => {
					row = bindRepositoryGitHubPublicationCheckpoint(row, facts, assertExecution);
					return await publish(prepared);
				});
			}
			return await withSessionRepositoryCheckpoint({
				workspaceId: row.workspace_id,
				checkpointRef: row.checkpoint_ref,
				includePublication: true
			}, async (payload) => {
				assertExecution();
				if (!payload.publicationStagingRoot || !payload.publicationDigest || payload.publicationDigest !== row.checkpoint_digest) throw new Error("GitHub publication accepted checkpoint is unavailable.");
				const { snapshot } = await readGitHubRepositoryPublicationMetadata(payload.publicationStagingRoot, payload.publicationDigest);
				return await publish({
					snapshot,
					snapshotRoot: payload.publicationStagingRoot,
					checkpointRef: row.checkpoint_ref,
					digest: payload.publicationDigest
				});
			});
		} catch (error) {
			if (row.owner_profile_id === null && error instanceof GitHubPublicationRequesterUnavailableError) return await settleDeniedRepositoryGitHubPublication({
				execution: claimExecution(),
				assertCustody,
				error
			});
			if (execution?.ownsExecution()) execution.interrupt();
			throw error;
		} finally {
			requester?.release();
			if (execution) active.delete(row.request_id);
		}
	};
	const makeRow = (input) => {
		const { head: previous } = readRepositoryGitHubPublicationBranch({
			workspaceId: input.workspace.workspaceId,
			branch: input.workspace.branch,
			pushRepository: input.target.pushRepository
		});
		const now = Date.now();
		const row = {
			request_id: randomUUID(),
			idempotency_key: input.request.idempotencyKey,
			request_digest: "",
			session_id: input.session.sessionId,
			session_lifecycle_revision: input.session.lifecycleRevision ?? null,
			session_key: input.session.sessionKey,
			agent_id: input.session.agentId,
			workspace_id: input.workspace.workspaceId,
			owner_profile_id: input.action?.owner ?? null,
			connection_generation: input.generation ?? null,
			identity_source: input.identity.source,
			identity_profile_id: input.identity.profileId ?? null,
			identity_account_id: input.identity.account.accountId,
			identity_login: input.identity.account.login,
			requester_authority_json: input.requesterAuthorityJson,
			title: input.request.title ?? null,
			body: input.request.body ?? null,
			push_repository: input.target.pushRepository,
			repository: input.target.repository,
			base_branch: input.target.baseBranch,
			branch: input.workspace.branch,
			previous_head_commit: previous?.pushed_head_commit ?? null,
			claim_id: input.claim?.claimId ?? null,
			run_id: input.claim?.runId ?? null,
			environment_id: input.claim?.owner.environmentId ?? null,
			owner_epoch: input.claim?.owner.ownerEpoch ?? null,
			placement_generation: input.claim?.placementGeneration ?? null,
			checkpoint_ref: null,
			checkpoint_digest: null,
			source_head_commit: null,
			source_index_tree: null,
			workspace_tree: null,
			status: "requested",
			execution_id: null,
			gateway_instance_id: null,
			head_commit: null,
			pushed_head_commit: null,
			pull_request_url: null,
			last_effect: null,
			effect_state: null,
			error_code: null,
			next_action: null,
			created_at_ms: now,
			updated_at_ms: now,
			reported_at_ms: null
		};
		row.request_digest = repositoryGitHubPublicationDigest(row);
		return row;
	};
	const admitShared = async (input, claim) => {
		const requester = input.requester;
		requester.assertCurrent();
		const requesterAuthorityJson = encodeGitHubPublicationRequester(requester.snapshot);
		if (!input.sessionKey) throw new Error("GitHub publication requires an authoritative session.");
		const loaded = loadGatewaySessionEntryReadOnly(input.sessionKey, { agentId: input.agentId });
		if (!loaded.entry?.sessionId) throw new Error("GitHub publication session changed.");
		const session = {
			sessionId: loaded.entry.sessionId,
			lifecycleRevision: loaded.entry.lifecycleRevision ?? null,
			sessionKey: loaded.canonicalKey,
			agentId: input.agentId
		};
		const currentOwner = await prepareRepositoryOwner(session);
		const initial = currentOwner();
		const assertCurrent = () => {
			requester.assertCurrent();
			const placement = claim ? placements.get(session.sessionId) : void 0;
			if (!sameGitHubPublicationWorkspace(initial, currentOwner()) || claim && (!placement || claim.sessionId !== session.sessionId || placement.agentId !== session.agentId || placement.sessionKey !== session.sessionKey || !resolvePlacementTurnEnvironment(placement, claim))) throw new Error("GitHub publication session authority changed.");
		};
		assertCurrent();
		const existing = requestByKey(session.sessionId, input.idempotencyKey, null);
		if (existing && (existing.workspace_id !== initial.workspace.workspaceId || existing.title !== (input.title ?? null) || existing.body !== (input.body ?? null))) throw new Error("GitHub publication idempotency key was reused.");
		const expected = input.selection?.source === "shared" ? input.selection.expected : void 0;
		if (existing && terminalRepositoryGitHubPublication(existing)) {
			const result = projectGitHubPublicationResult(existing);
			assertExpectedSharedGitHubPublisher(expected, result.publisher);
			return existing;
		}
		if (existing) {
			const original = decodeGitHubPublicationRequester(existing.requester_authority_json);
			if (!original || !matchesGitHubPublicationRequester(original, requester.snapshot)) throw new Error("GitHub publication idempotency key was reused by a different requester.");
		}
		const identity = await prepareCurrentGitHubPublicationIdentity(input.agentId);
		assertCurrent();
		assertExpectedSharedGitHubPublisher(expected, {
			source: identity.source,
			...identity.account
		}, existing ? void 0 : {
			idempotencyKey: input.idempotencyKey,
			hasRequest: () => Boolean(requestByKey(session.sessionId, input.idempotencyKey, null))
		});
		if (existing) {
			if (!matchesGitHubPublicationIdentityRow(existing, identity)) throw new Error("GitHub publication identity changed.");
			return existing;
		}
		const target = await prepareRepositoryGitHubPublicationTarget(initial.workspace, identity, assertCurrent);
		assertCurrent();
		return insertRepositoryGitHubPublication(makeRow({
			session,
			workspace: initial.workspace,
			request: input,
			identity,
			target,
			claim,
			requesterAuthorityJson
		}), assertCurrent);
	};
	return {
		async requestForClaim(input) {
			const expected = input.expectedPublisher;
			if (expected?.source === "personal") throw new Error("My GitHub publication requires direct personal authorization.");
			return projectGitHubPublicationResult(await admitShared({
				...input,
				selection: {
					source: "shared",
					...expected ? { expected: {
						source: expected.source,
						accountId: expected.accountId,
						login: expected.login
					} } : {}
				}
			}, input.claim));
		},
		async requestForSession(input) {
			if (input.selection?.source === "personal") throw new Error("My GitHub publication requires direct personal authorization.");
			const loaded = loadGatewaySessionEntryReadOnly(input.sessionKey, { agentId: input.agentId });
			const placement = loaded.entry?.sessionId ? placements.get(loaded.entry.sessionId) : void 0;
			const currentClaim = placement ? exactClaimForPlacement(placement) : void 0;
			if (input.expectedRunId !== void 0 && input.expectedRunId !== currentClaim?.runId) throw new Error("GitHub publication run identity changed.");
			const claim = input.expectedRunId !== void 0 ? currentClaim : void 0;
			const row = await admitShared(input, claim);
			if (terminalRepositoryGitHubPublication(row) || claim || placements.get(row.session_id)?.turnClaim) return projectGitHubPublicationResult(row);
			return await placements.withRepositoryWorkspaceReservation({
				sessionId: row.session_id,
				sessionKey: row.session_key,
				agentId: row.agent_id
			}, async (assertCustody) => await execute(row, {
				assertCustody,
				assertCurrent: input.requester.assertInvocationCurrent
			}));
		},
		async requestPersonalForSession(input, action) {
			if (input.selection?.source !== "personal" || input.idempotencyKey.length > 128) throw new Error("My GitHub publication requires an explicit bounded account selection.");
			const selected = input.selection;
			action.assertCurrent();
			const existing = requestByKey(action.sessionId, input.idempotencyKey, action.owner);
			if (existing) {
				assertPersonalGitHubPublicationReplay(existing, input, selected);
				const prepared = await preparePersonalStatus(existing.request_id);
				return personalStatus(requireRepositoryGitHubPublication(existing.request_id), action, action, prepared).result;
			}
			const bound = bindPersonalGitHubPublicationSelection(action, selected, {
				idempotencyKey: input.idempotencyKey,
				hasRequest: () => Boolean(requestByKey(action.sessionId, input.idempotencyKey, action.owner))
			});
			return await placements.withRepositoryWorkspaceReservation(action, async (assertReservation) => {
				const currentOwner = await prepareRepositoryOwner(action);
				const initial = currentOwner();
				const assertCurrent = () => {
					action.assertCurrent();
					assertReservation();
					bound.assertCurrent();
					if (!sameGitHubPublicationWorkspace(initial, currentOwner())) throw new Error("My GitHub repository owner changed.");
				};
				assertCurrent();
				const identity = await preparePersonalGitHubPublicationSelection(bound, assertCurrent);
				const target = await prepareRepositoryGitHubPublicationTarget(initial.workspace, identity, assertCurrent);
				const row = insertRepositoryGitHubPublication(makeRow({
					session: action,
					workspace: initial.workspace,
					request: input,
					identity,
					target,
					action,
					generation: selected.generation,
					requesterAuthorityJson: null
				}), assertCurrent);
				return await execute(row, {
					assertCustody: assertReservation,
					assertCurrent,
					action
				});
			});
		},
		async processClaim(claim) {
			const results = [];
			for (const row of listRepositoryGitHubPublications({
				sessionId: claim.sessionId,
				ownerProfileId: null,
				pending: true
			}).filter((candidate) => candidate.claim_id === null || matchesRepositoryGitHubPublicationClaim(candidate, claim))) {
				await placements.prepareWorkspaceResultClaim(claim);
				results.push(await placements.withWorkspaceExclusion(row.session_id, async (assertOwned) => await execute(row, { assertCustody: () => {
					assertOwned();
					if (!placements.validateWorkspaceResultClaim(claim)) throw new Error("GitHub publication lost its workspace result claim.");
				} })));
			}
			return results;
		},
		...createRepositoryGitHubPublicationRecovery({
			placements,
			getCommittedRuntimeConfig,
			isExecuting: (requestId) => active.has(requestId),
			execute: (row, assertCustody) => execute(row, { assertCustody })
		}),
		...createSharedGitHubPublicationReadMethods("repository"),
		preparePersonalStatus,
		personalStatus(action, session, requestId, prepared) {
			const row = readRepositoryGitHubPublication(requestId);
			return row ? personalStatus(row, action, session, prepared) : void 0;
		},
		async personalPending(action, session) {
			action.assertCurrent();
			const row = await readPendingRepositoryGitHubPublication({
				ownerProfileId: action.owner,
				sessionKey: session.sessionKey,
				agentId: session.agentId
			});
			if (!row) {
				action.assertCurrent();
				return null;
			}
			const prepared = await preparePersonalStatus(row.request_id);
			return personalStatus(requireRepositoryGitHubPublication(row.request_id), action, session, prepared);
		},
		async confirmPersonal(input, action) {
			action.assertCurrent();
			const row = readRepositoryGitHubPublication(input.requestId);
			if (!row || row.owner_profile_id !== action.owner || row.session_id !== action.sessionId || !terminalRepositoryGitHubPublication(row) && row.session_lifecycle_revision !== action.lifecycleRevision || row.session_key !== action.sessionKey || row.agent_id !== action.agentId || row.request_digest !== input.requestDigest || row.connection_generation !== input.generation || row.identity_account_id !== input.account.accountId || row.identity_login.toLowerCase() !== input.account.login.toLowerCase()) throw new Error("My GitHub confirmation no longer matches the original request.");
			if (terminalRepositoryGitHubPublication(row)) return projectGitHubPublicationResult(row);
			if (active.has(row.request_id)) throw new Error("My GitHub publication is still running; wait for its result.");
			if (!row.checkpoint_ref) throw new Error("GitHub publication has no accepted checkpoint.");
			bindPersonalGitHubPublicationSelection(action, input);
			return await placements.withRepositoryWorkspaceReservation(action, async (assertReservation) => await execute(row, {
				assertCustody: assertReservation,
				assertCurrent: action.assertCurrent,
				action
			}));
		},
		read(requestId) {
			const row = readRepositoryGitHubPublication(requestId);
			return row && row.owner_profile_id === null ? projectGitHubPublicationResult(row) : void 0;
		},
		hasRequest: (requestId) => Boolean(readRepositoryGitHubPublication(requestId)),
		listUnreportedResults: () => listRepositoryGitHubPublications({
			pending: false,
			unreported: true
		}).map((row) => ({
			sessionId: row.session_id,
			sessionKey: row.session_key,
			agentId: row.agent_id,
			result: projectGitHubPublicationResult(row)
		})),
		markReported: markRepositoryGitHubPublicationReported
	};
}
//#endregion
//#region src/gateway/github-publication.ts
const activePublicationExecutions = /* @__PURE__ */ new Map();
function sameWorktree(row, worktree) {
	return row.worktree_id === worktree.id && row.repository_fingerprint === worktree.repoFingerprint && row.branch === worktree.branch;
}
function sameClaim(row, claim) {
	return row.claim_id === claim.claimId && row.run_id === claim.runId && row.placement_generation === claim.placementGeneration && row.environment_id === (claim.owner.environmentId ?? null) && row.owner_epoch === (claim.owner.ownerEpoch ?? null);
}
function assertStoredClaim(db, request) {
	const row = executeSqliteQuerySync(db, githubPublicationDatabase(db).selectFrom("worker_session_placements").select([
		"agent_id",
		"session_key",
		"state",
		"environment_id",
		"active_owner_epoch",
		"turn_claim_owner",
		"turn_claim_id",
		"turn_claim_run_id",
		"turn_claim_generation",
		"turn_claim_owner_epoch"
	]).where("session_id", "=", request.claim.sessionId)).rows[0];
	const ownerMatches = request.claim.owner.kind === "worker" ? row?.turn_claim_owner === "worker" && row.environment_id === request.claim.owner.environmentId && row.active_owner_epoch === request.claim.owner.ownerEpoch && row.turn_claim_owner_epoch === request.claim.owner.ownerEpoch : row?.turn_claim_owner === "local";
	if (!row || row.state !== "active" && row.state !== "draining" && row.state !== "local" || row.agent_id !== request.agentId || row.session_key !== request.sessionKey || row.turn_claim_id !== request.claim.claimId || row.turn_claim_run_id !== request.claim.runId || row.turn_claim_generation !== request.claim.placementGeneration || !ownerMatches) throw new Error("GitHub publication turn authority changed before recording.");
}
function createGitHubPublicationCoordinator(params) {
	const instanceId = params.placements.workspaceResultInstanceId();
	const readById = (requestId) => {
		ensureGitHubPublicationStore();
		const db = openOpenClawStateDatabase().db;
		return readGitHubPublicationRequest(db, { requestId });
	};
	const requestForClaim = async (request) => {
		ensureGitHubPublicationStore();
		const assertRequester = request.requester.assertCurrent;
		assertRequester();
		if (!params.placements.validateTurnClaim(request.claim)) throw new Error("GitHub publication lost the live session turn claim.");
		const placement = params.placements.get(request.claim.sessionId);
		if (!placement || placement.sessionKey !== request.sessionKey || placement.agentId !== request.agentId) throw new Error("GitHub publication session identity changed.");
		const admitted = resolveGitHubPublicationWorktreeOwner({
			sessionId: request.claim.sessionId,
			sessionKey: request.sessionKey,
			agentId: request.agentId
		});
		assertRequester();
		const identity = await prepareCurrentGitHubPublicationIdentity(request.agentId);
		assertRequester();
		assertExpectedSharedGitHubPublisher(request.expectedPublisher, {
			source: identity.source,
			...identity.account
		}, {
			idempotencyKey: request.idempotencyKey,
			hasRequest: () => Boolean(readGitHubPublicationRequest(openOpenClawStateDatabase().db, {
				sessionId: request.claim.sessionId,
				idempotencyKey: request.idempotencyKey
			}))
		});
		if (!params.placements.validateTurnClaim(request.claim)) throw new Error("GitHub publication lost the live session turn claim after verification.");
		const { worktree } = resolveGitHubPublicationWorktreeOwner({
			sessionId: request.claim.sessionId,
			sessionKey: request.sessionKey,
			agentId: request.agentId,
			lifecycleRevision: admitted.loaded.entry?.lifecycleRevision ?? null
		});
		const requestDigest = digestGitHubPublicationRequest({
			sessionId: request.claim.sessionId,
			idempotencyKey: request.idempotencyKey,
			title: request.title,
			body: request.body
		});
		const now = Date.now();
		const requestId = randomUUID();
		return projectGitHubPublicationResult(runOpenClawStateWriteTransaction(({ db }) => {
			assertStoredClaim(db, request);
			const stored = insertGitHubPublicationRequest(db, {
				request,
				requestId,
				requestDigest,
				now,
				identity,
				worktree,
				sessionId: request.claim.sessionId,
				lifecycleRevision: admitted.loaded.entry?.lifecycleRevision ?? null,
				requester: request.requester.snapshot,
				assertCurrent: () => {
					assertRequester();
					assertStoredClaim(db, request);
					resolveGitHubPublicationWorktreeOwner({
						sessionId: request.claim.sessionId,
						sessionKey: request.sessionKey,
						agentId: request.agentId,
						lifecycleRevision: admitted.loaded.entry?.lifecycleRevision ?? null,
						expected: {
							worktreeId: worktree.id,
							repositoryFingerprint: worktree.repoFingerprint,
							branch: worktree.branch
						}
					});
				},
				claim: request.claim
			});
			if (!sameClaim(stored, request.claim)) throw new Error("GitHub publication idempotency key was reused.");
			return stored;
		}, void 0, { operationLabel: "github-publication.request" }));
	};
	const { bindWorkspaceSnapshot, updatePublishingFacts, complete } = createGitHubPublicationExecutionStore(instanceId);
	const bindAcceptedClaimSnapshot = (input) => runOpenClawStateWriteTransaction(({ db }) => {
		assertStoredClaim(db, {
			claim: input.claim,
			sessionKey: input.row.session_key,
			agentId: input.row.agent_id
		});
		const query = githubPublicationDatabase(db);
		const current = readGitHubPublicationRequest(db, { requestId: input.row.request_id });
		if (!current || current.claim_id !== input.claim.claimId || current.run_id !== input.claim.runId || current.status !== "requested" && current.status !== "publishing") throw new Error("GitHub publication workspace snapshot owner changed.");
		if (current.source_head_commit || current.source_index_tree || current.workspace_tree) {
			if (current.source_head_commit !== input.sourceHeadCommit || current.source_index_tree !== input.sourceIndexTree || current.workspace_tree !== input.workspaceTree) throw new Error("GitHub publication accepted workspace snapshot changed.");
			return current;
		}
		const updated = executeSqliteQueryTakeFirstSync(db, query.updateTable("github_publication_requests").set({
			source_head_commit: input.sourceHeadCommit,
			source_index_tree: input.sourceIndexTree,
			workspace_tree: input.workspaceTree,
			updated_at_ms: Date.now()
		}).where("request_id", "=", input.row.request_id).where("source_head_commit", "is", null).where("source_index_tree", "is", null).where("workspace_tree", "is", null).returningAll());
		if (!updated) throw new Error("GitHub publication accepted workspace snapshot changed.");
		deferSharedGitHubPublicationChanged(db, updated);
		return updated;
	}, void 0, { operationLabel: "github-publication.bind-accepted-workspace" });
	const processRow = (initial, validateExecution, assertInvocationCurrent) => {
		if (initial.status === "published" || initial.status === "failed") return Promise.resolve(projectGitHubPublicationResult(initial));
		const executionKey = `${instanceId}\0${initial.request_id}`;
		return getOrCreatePromise(activePublicationExecutions, executionKey, () => {
			const claimed = claimGitHubPublicationExecution(initial.request_id, instanceId);
			if (claimed.status === "published" || claimed.status === "failed") return Promise.resolve(projectGitHubPublicationResult(claimed));
			return params.placements.withWorkspaceExclusion(claimed.session_id, async (assertOwned) => {
				const lease = await acquireWorktreeRunLease(claimed.worktree_id);
				const validateCustody = () => {
					assertOwned();
					return validateExecution() && isGitHubPublicationExecutionOwner(claimed.request_id, instanceId);
				};
				let effect;
				let dispatched = false;
				let requester;
				const getRequester = () => {
					if (!requester) throw new GitHubPublicationRequesterUnavailableError();
					return requester;
				};
				try {
					assertOwned();
					return await executeGitHubPublication({
						initial: claimed,
						validateCustody,
						assertWorkflowChangesAllowed: () => assertGitHubPublicationWorkflowChangesAllowed(getRequester()),
						prepareAuthority: async () => {
							if (!validateCustody()) throw new GitHubPublicationAuthorityLostError("GitHub publication execution custody changed before requester preparation.");
							const lifecycle = await readGitHubPublicationSessionLifecycleInWorker({
								publicationKind: "shared",
								requestId: claimed.request_id
							}).catch((cause) => {
								throw new GitHubPublicationRecoveryPendingError("GitHub publication requester metadata is unavailable; retry recovery.", { cause });
							});
							if (!validateCustody()) throw new GitHubPublicationAuthorityLostError("GitHub publication execution custody changed during requester preparation.");
							assertInvocationCurrent?.();
							requester = await restoreGitHubPublicationRequester(lifecycle?.requester_authority_json, {
								sessionKey: claimed.session_key,
								agentId: claimed.agent_id
							}, params.getCommittedRuntimeConfig);
						},
						validateAuthority: () => {
							if (!validateCustody()) return false;
							getRequester().assertCurrent();
							assertInvocationCurrent?.();
							return true;
						},
						projectResult: projectGitHubPublicationResult,
						recordEffect: (kind, observed) => {
							dispatched ||= observed === void 0;
							effect = {
								kind,
								status: observed?.headCommit || observed?.url ? "observed" : "dispatched",
								...observed
							};
						},
						bindWorkspaceSnapshot,
						updatePublishingFacts,
						complete,
						defer: (row) => {
							deferGitHubPublicationRequests([row.request_id]);
							const deferred = readById(row.request_id);
							if (!deferred) throw new Error("GitHub publication request disappeared.");
							return deferred;
						}
					});
				} catch (error) {
					if (!(error instanceof GitHubPublicationRequesterUnavailableError)) throw error;
					if (!validateCustody()) throw new GitHubPublicationAuthorityLostError("GitHub publication execution custody changed before reconciliation.");
					const current = await readGitHubPublicationRequestInWorker(claimed.request_id).catch((cause) => {
						throw new GitHubPublicationRecoveryPendingError("GitHub publication receipt is unavailable; retry recovery.", { cause });
					});
					if (!current || !validateCustody()) throw new GitHubPublicationAuthorityLostError("GitHub publication execution custody changed during reconciliation.");
					if (claimed.head_commit !== null || dispatched) {
						const observed = await reconcileGitHubPublication({
							initial: current,
							validateCustody,
							projectResult: projectGitHubPublicationResult,
							complete,
							pushOnly: claimed.head_commit === null && effect?.kind === "push" ? effect.status === "observed" && effect.headCommit === current.head_commit ? "observed" : "dispatched" : void 0
						});
						if (observed) return observed;
					}
					if (!validateCustody()) throw new GitHubPublicationAuthorityLostError("GitHub publication execution custody changed during reconciliation.");
					return projectGitHubPublicationResult(complete(current, {
						requestId: current.request_id,
						status: "failed",
						...error.failure,
						message: error.message
					}));
				} finally {
					requester?.release();
					await lease.release();
				}
			});
		}, { evictOnSettled: true });
	};
	const prepareClaimWorkspace = async (claim) => {
		ensureGitHubPublicationStore();
		await params.placements.closeWorkerTurnToolAdmission(claim);
		const rows = listGitHubPublicationsForClaim(claim, { pendingOnly: true });
		if (rows.length === 0) return;
		await params.placements.prepareWorkspaceResultClaim(claim);
		if (!params.placements.validateWorkspaceResultClaim(claim)) throw new Error("GitHub publication lost its workspace result claim before snapshot.");
		const first = rows[0];
		const { worktree } = resolveGitHubPublicationWorktreeOwner({
			sessionId: first.session_id,
			sessionKey: first.session_key,
			agentId: first.agent_id,
			expected: {
				worktreeId: first.worktree_id,
				repositoryFingerprint: first.repository_fingerprint,
				branch: first.branch
			}
		});
		for (const row of rows) if (!sameWorktree(row, worktree)) throw new Error("GitHub publication worktree changed before accepted snapshot.");
		const bound = rows.find((row) => row.source_head_commit && row.source_index_tree && row.workspace_tree);
		if (bound) {
			for (const row of rows) if ((row.source_head_commit || row.source_index_tree || row.workspace_tree) && (row.source_head_commit !== bound.source_head_commit || row.source_index_tree !== bound.source_index_tree || row.workspace_tree !== bound.workspace_tree)) throw new Error("GitHub publication accepted workspace snapshot changed.");
			if (rows.every((row) => row.source_head_commit && row.source_index_tree && row.workspace_tree)) return;
		}
		const snapshot = await captureGitHubPublicationWorkspaceSnapshot({
			cwd: worktree.path,
			assertCurrent: () => {
				if (!params.placements.validateWorkspaceResultClaim(claim)) throw new Error("GitHub publication lost its workspace result claim during snapshot.");
			}
		});
		for (const row of rows) bindAcceptedClaimSnapshot({
			row,
			claim,
			...snapshot
		});
	};
	const deferClaimPreparation = (claim) => {
		ensureGitHubPublicationStore();
		deferGitHubPublicationRequests(listGitHubPublicationsForClaim(claim, { pendingOnly: true }).map((row) => row.request_id));
	};
	const repository = createRepositoryGitHubPublicationCoordinator(params);
	const personal = createPersonalGitHubPublicationCoordinator(params.placements);
	const methods = createGitHubPublicationCoordinatorMethods({
		placements: params.placements,
		readById,
		requestForClaim,
		sameWorktree,
		processRow
	});
	return {
		...methods,
		...personal,
		requestForClaim: async (request) => (await prepareGitHubPublicationWorkspaceOwner({
			sessionId: request.claim.sessionId,
			sessionKey: request.sessionKey,
			agentId: request.agentId
		}))().kind === "repository" ? repository.requestForClaim(request) : requestForClaim(request),
		async prepareClaimWorkspace(claim) {
			await prepareClaimWorkspace(claim);
			await repository.prepareClaimWorkspace(claim);
		},
		deferClaimPreparation(claim) {
			deferClaimPreparation(claim);
			repository.deferClaimPreparation(claim);
		},
		requestForSession(input) {
			return loadGatewaySessionEntryReadOnly(input.sessionKey, { agentId: input.agentId }).entry?.repositoryWorkspaceId ? repository.requestForSession(input) : methods.requestForSession(input);
		},
		async requestPersonalForSession(...args) {
			return (await prepareGitHubPublicationWorkspaceOwner(args[1]))().kind === "repository" ? repository.requestPersonalForSession(...args) : personal.requestPersonalForSession(...args);
		},
		async sharedStatus(...args) {
			return await repository.sharedStatus(...args) ?? await methods.sharedStatus(...args);
		},
		async latestShared(...args) {
			return await repository.latestShared(...args) ?? await methods.latestShared(...args);
		},
		preparePersonalStatus: repository.preparePersonalStatus,
		personalStatus(...args) {
			return repository.hasRequest(args[2]) ? repository.personalStatus(...args) : personal.personalStatus(args[0], args[1], args[2]);
		},
		async personalPending(...args) {
			return await repository.personalPending(...args) ?? personal.personalPending(...args);
		},
		confirmPersonal(...args) {
			return repository.hasRequest(args[0].requestId) ? repository.confirmPersonal(...args) : personal.confirmPersonal(...args);
		},
		async processClaim(claim) {
			return [...await methods.processClaim(claim), ...await repository.processClaim(claim)];
		},
		async resumeSessionRequests() {
			const failures = [];
			for (const coordinator of [methods, repository]) try {
				await coordinator.resumeSessionRequests();
			} catch (error) {
				failures.push(error);
			}
			if (failures.length > 0) throw new AggregateError(failures, failures.map((error) => error instanceof Error ? error.message : String(error)).join("; "));
		},
		/** @deprecated Await deferOrphanedRequestsAsync; retained for released plugin contexts. */
		deferOrphanedRequests() {
			methods.deferOrphanedRequests();
			repository.deferOrphanedRequests();
		},
		async deferOrphanedRequestsAsync() {
			await methods.deferOrphanedRequestsAsync();
			await repository.deferOrphanedRequestsAsync();
		},
		listUnreportedResults() {
			return [...methods.listUnreportedResults(), ...repository.listUnreportedResults()];
		},
		read(requestId) {
			return repository.read(requestId) ?? methods.read(requestId);
		},
		markReported(requestId) {
			methods.markReported(requestId);
			repository.markReported(requestId);
		}
	};
}
//#endregion
//#region src/gateway/github-publication-runtime.ts
function createGitHubPublicationRuntime(params) {
	const coordinator = createGitHubPublicationCoordinator(params);
	requirePersonalGitHubPublicationConfirmation(params.placements.workspaceResultInstanceId());
	const report = createGitHubPublicationTranscriptReporter(params.loadSessionRuntime, coordinator);
	const reportDeferred = async (publication) => {
		try {
			await report(publication);
		} catch (error) {
			params.warn(`GitHub publication result reporting deferred for ${publication.sessionId}: ${formatErrorMessage(error)}`);
		}
	};
	const prepareAcceptedWorkspacePublication = async (claim) => {
		try {
			await coordinator.prepareClaimWorkspace(claim);
		} catch {
			coordinator.deferClaimPreparation(claim);
		}
	};
	const publishAcceptedWorkspace = async (claim) => {
		const placement = params.placements.get(claim.sessionId);
		if (!placement) {
			params.warn(`GitHub publication deferred because placement ${claim.sessionId} disappeared.`);
			return;
		}
		let results;
		try {
			results = await coordinator.processClaim(claim);
		} catch (error) {
			params.warn(`GitHub publication deferred for ${claim.sessionId}: ${formatErrorMessage(error)}`);
			throw error;
		}
		for (const result of results) {
			if (result.status !== "published" && result.status !== "failed") continue;
			await reportDeferred({
				sessionId: placement.sessionId,
				sessionKey: placement.sessionKey,
				agentId: placement.agentId,
				result
			});
		}
	};
	const reconcilePublications = async () => {
		try {
			await coordinator.deferOrphanedRequestsAsync();
			await coordinator.resumeSessionRequests();
		} catch (error) {
			params.warn(`GitHub publication recovery deferred: ${formatErrorMessage(error)}`);
		}
		for (const publication of coordinator.listUnreportedResults()) await reportDeferred(publication);
	};
	return {
		coordinator,
		prepareAcceptedWorkspacePublication,
		publishAcceptedWorkspace,
		reconcilePublications
	};
}
//#endregion
//#region src/gateway/server-worker-placement-change-events.ts
function createGatewayWorkerPlacementChangePublisher(params) {
	const warnPlacementChangeFailure = (error) => {
		try {
			params.warn(`Worker placement session change reporting failed: ${formatErrorMessage(error)}`);
		} catch {}
	};
	const snapshotPlacements = async () => new Map((await params.placements.readChangeSnapshot()).map((placement) => [placement.sessionId, placement]));
	return async (operation) => {
		let context;
		let before;
		try {
			context = params.getSessionChangeContext?.();
			if (context) before = await snapshotPlacements();
		} catch (error) {
			warnPlacementChangeFailure(error);
		}
		if (!context || !before) return await operation();
		try {
			return await operation();
		} finally {
			try {
				const after = await snapshotPlacements();
				for (const [sessionId, previous] of before) {
					const current = after.get(sessionId);
					if (current && current.state === previous.state && current.generation === previous.generation && current.updatedAtMs === previous.updatedAtMs && current.sessionKey === previous.sessionKey && current.agentId === previous.agentId) {
						after.delete(sessionId);
						continue;
					}
					if (!current) after.set(sessionId, previous);
				}
				for (const placement of after.values()) try {
					emitSessionsChanged(context, {
						reason: "placement",
						sessionKey: placement.sessionKey,
						agentId: placement.agentId
					});
				} catch (error) {
					warnPlacementChangeFailure(error);
				}
			} catch (error) {
				warnPlacementChangeFailure(error);
			}
		}
	};
}
function subscribeGatewayWorkerMachineShapeChanges(params) {
	const profiles = /* @__PURE__ */ new Set();
	let stopped = false;
	let pending;
	const unsubscribe = params.environments.subscribeMachineShapeChanged((profileId) => {
		if (stopped || !params.getSessionChangeContext?.()) return;
		profiles.add(profileId);
		if (pending) return;
		pending = Promise.resolve().then(async () => {
			try {
				while (profiles.size) {
					const batch = [...profiles];
					profiles.clear();
					try {
						const placements = await params.placements.readChangeSnapshot(batch);
						const context = params.getSessionChangeContext?.();
						if (stopped || !context) return;
						for (const placement of placements) emitSessionsChanged(context, {
							reason: "placement",
							sessionKey: placement.sessionKey,
							agentId: placement.agentId
						});
					} catch (error) {
						try {
							params.warn(`Worker machine metadata change reporting failed: ${formatErrorMessage(error)}`);
						} catch {}
					}
				}
			} finally {
				pending = void 0;
			}
		});
	});
	return async () => {
		stopped = true;
		profiles.clear();
		unsubscribe();
		await pending;
	};
}
//#endregion
//#region src/gateway/server-worker-placement-dispatch-admission.ts
function createGatewayWorkerDispatchAdmission(loadSessionRuntime) {
	return async (request, run, authorize, callerSignal) => {
		callerSignal?.throwIfAborted();
		const runtime = await loadSessionRuntime();
		const resolve = () => runtime.resolveGatewaySessionStoreTargetWithStore({
			cfg: getRuntimeConfig(),
			key: request.sessionKey,
			agentId: request.agentId,
			preserveQualifiedAddress: true,
			clone: false,
			exactRead: true
		});
		const target = resolve();
		const revision = runtime.resolveCanonicalSessionEntryFromStoreKeys(target.store, target.storeKeys)?.lifecycleRevision ?? null;
		const controller = new AbortController();
		const signal = callerSignal ? AbortSignal.any([callerSignal, controller.signal]) : controller.signal;
		const admission = await beginSessionWorkAdmission({
			scope: target.storePath,
			identities: [
				request.sessionKey,
				target.canonicalKey,
				...target.storeKeys,
				request.sessionId
			],
			onInterrupt: (reason) => controller.abort(reason),
			signal,
			assertAllowed: () => {
				authorize?.();
				signal.throwIfAborted();
				const current = resolve();
				const currentEntry = runtime.resolveCanonicalSessionEntryFromStoreKeys(current.store, current.storeKeys);
				if (current.storePath !== target.storePath || current.canonicalKey !== target.canonicalKey || current.agentId !== target.agentId || currentEntry?.sessionId !== request.sessionId || (currentEntry.lifecycleRevision ?? null) !== revision || currentEntry.archivedAt !== void 0) throw new WorkerPlacementAdmissionTargetError(`Session ${request.sessionKey} changed before cloud worker dispatch. Retry.`);
			}
		});
		try {
			return await admission.run(() => run(signal));
		} finally {
			admission.release();
		}
	};
}
//#endregion
//#region src/gateway/worker-workspace-conflict-transcript.ts
function createWorkerWorkspaceConflictTranscriptHandlers(target, assertCurrent) {
	async function withWorkerTranscript(run, missingMessage) {
		assertCurrent();
		const lostSession = () => {
			if (missingMessage) throw new Error(`${missingMessage} lost session ${target.sessionId}`);
			return err("session-unavailable");
		};
		const result = await withSessionTranscriptWriteAssertion(target, assertCurrent, run);
		assertCurrent();
		return result.ok ? ok(result.value) : lostSession();
	}
	return {
		resolveConflict: async () => {
			const result = await withWorkerTranscript(() => readLatestSessionTranscriptReport(target, [WORKSPACE_CONFLICT_TRANSCRIPT_TYPE, WORKSPACE_CONFLICT_CLEARED_TRANSCRIPT_TYPE]));
			if (!result.ok) return {
				kind: "unknown",
				reason: result.error
			};
			const transcriptEntry = result.value;
			if (transcriptEntry?.customType !== "cloud-workspace-conflict") return { kind: "absent" };
			const details = transcriptEntry.details;
			if (Array.isArray(details?.paths) && details.paths.length > 0 && details.paths.every((entryPath) => typeof entryPath === "string" && entryPath.length > 0) && typeof details.stagedResultRef === "string" && (details.totalCount === void 0 || Number.isSafeInteger(details.totalCount) && details.totalCount >= details.paths.length) && /^refs\/openclaw\/worker-results\/[A-Za-z0-9-]+$/u.test(details.stagedResultRef)) return {
				kind: "conflict",
				conflict: projectWorkspaceResultConflict(details.paths, details.stagedResultRef, details.totalCount)
			};
			return {
				kind: "unknown",
				reason: "malformed-report"
			};
		},
		reportConflict: async (conflict) => {
			await withWorkerTranscript(() => appendSessionTranscriptReport(target, {
				kind: "custom",
				customTypes: [WORKSPACE_CONFLICT_TRANSCRIPT_TYPE, WORKSPACE_CONFLICT_CLEARED_TRANSCRIPT_TYPE],
				selectReport: (latestConflictEntry) => {
					if ("cleared" in conflict) {
						if (latestConflictEntry?.customType !== "cloud-workspace-conflict-cleared") return {
							customType: WORKSPACE_CONFLICT_CLEARED_TRANSCRIPT_TYPE,
							content: "A later cloud workspace result superseded the previous conflict.",
							display: false
						};
						return;
					}
					const projectedConflict = projectWorkspaceResultConflict(conflict.paths, conflict.stagedResultRef, conflict.totalCount);
					const details = latestConflictEntry?.details;
					if (!(latestConflictEntry?.customType === "cloud-workspace-conflict" && details?.stagedResultRef === projectedConflict.stagedResultRef && details.totalCount === projectedConflict.totalCount && Array.isArray(details.paths) && JSON.stringify(details.paths) === JSON.stringify(projectedConflict.paths))) return {
						customType: WORKSPACE_CONFLICT_TRANSCRIPT_TYPE,
						content: formatWorkspaceConflictSummary(projectedConflict.paths, projectedConflict.stagedResultRef, projectedConflict.totalCount),
						display: true,
						details: projectedConflict
					};
				}
			}), "Recovered cloud workspace conflict");
		},
		reportFailure: async (failure) => {
			await withWorkerTranscript(() => appendSessionTranscriptReport(target, {
				kind: "custom",
				customTypes: [WORKSPACE_RECOVERY_FAILURE_TRANSCRIPT_TYPE],
				selectReport: (latestRecovery) => {
					const error = boundedWorkerError(failure, 768);
					const content = `Cloud workspace recovery attempt failed: ${error}. OpenClaw preserved the result and will retry.`;
					if (latestRecovery?.content !== content) return {
						customType: WORKSPACE_RECOVERY_FAILURE_TRANSCRIPT_TYPE,
						content,
						display: true,
						details: { error }
					};
				}
			}), "Cloud workspace recovery");
		}
	};
}
//#endregion
//#region src/gateway/server-worker-placement-session-target.ts
var WorkerDispatchTargetChangedError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.code = "invalid_state";
	}
};
function createWorkerWorkspaceRecoveryPreparer(options) {
	return async (identity, assertOwnerCurrent, run) => {
		assertOwnerCurrent();
		const sessionRuntime = await options.loadSessionRuntime();
		assertOwnerCurrent();
		const resolved = await resolveWorkerPlacementSessionTarget({
			sessionRuntime,
			config: options.getConfig(),
			...identity,
			errorMessage: `Session ${identity.sessionKey} changed before workspace recovery`
		});
		assertOwnerCurrent();
		resolved.assertCurrent(options.getConfig());
		const { target, entry, workspace } = resolved;
		if (target.agentId !== identity.agentId || target.canonicalKey !== identity.sessionKey || !target.readSource) throw new WorkerDispatchTargetChangedError("Workspace recovery lost its exact session target");
		const binding = {
			...captureSessionTranscriptTargetBinding({
				...identity,
				storePath: target.readSource.path
			}),
			defaultAgentId: target.readSource.agentId
		};
		const retained = retainOpenClawAgentDatabaseReadOnly(target.readSource);
		if (!retained.found) throw new WorkerDispatchTargetChangedError("Workspace recovery session store is unavailable");
		let released = false;
		const completion = createDeferredCore();
		const controller = new AbortController();
		let unregister = () => {};
		const release = () => {
			if (released) return;
			released = true;
			unregister();
			retained.claim.release();
		};
		const assertSourceCurrent = () => {
			controller.signal.throwIfAborted();
			assertOwnerCurrent();
			if (released || !retained.claim.isCurrent() || !isOpenClawAgentDatabasePathCurrent(retained.database)) throw new WorkerDispatchTargetChangedError("Workspace recovery session source changed");
		};
		try {
			unregister = registerOpenClawAgentDatabaseAsyncResource({
				agentId: retained.database.agentId,
				path: retained.database.path,
				revoke: () => controller.abort(new WorkerDispatchTargetChangedError("Workspace recovery was revoked")),
				close: () => completion.promise
			});
			const prepared = await readSessionEntriesFromStoreInWorker({
				agentId: target.readSource.agentId,
				storePath: target.readSource.path,
				env: binding.env,
				sessionKeys: [identity.sessionKey]
			});
			assertSourceCurrent();
			const preparedEntry = prepared.entries.find((candidate) => candidate.sessionKey === identity.sessionKey)?.entry;
			if (preparedEntry?.sessionId !== identity.sessionId || preparedEntry.lifecycleRevision !== entry.lifecycleRevision) throw new WorkerDispatchTargetChangedError("Workspace recovery session generation changed");
			const transcriptTarget = {
				...binding,
				expectedLifecycleRevision: preparedEntry.lifecycleRevision,
				expectedWriterRunId: preparedEntry.activeWriterRunId
			};
			const assertCurrent = createSessionEntryRevisionGuard(retained.database.db, assertSourceCurrent, createSessionTranscriptOwnerPredicate(retained.database, {
				sessionKey: identity.sessionKey,
				sessionId: identity.sessionId,
				lifecycleRevision: preparedEntry.lifecycleRevision,
				activeWriterRunId: preparedEntry.activeWriterRunId
			}));
			assertCurrent();
			resolved.assertCurrent(options.getConfig());
			return await withSessionTranscriptWriteAssertion(transcriptTarget, assertCurrent, () => run({
				workspace,
				assertCurrent,
				...createWorkerWorkspaceConflictTranscriptHandlers(transcriptTarget, assertCurrent)
			}));
		} finally {
			release();
			completion.resolve();
		}
	};
}
async function runWorkerPlacementSessionBarrier(params) {
	const target = params.sessionRuntime.resolveGatewaySessionStoreTargetWithStore({
		cfg: params.getConfig(),
		key: params.sessionKey,
		agentId: params.agentId,
		preserveQualifiedAddress: true,
		clone: false,
		exactRead: true
	});
	const operation = params.action === "activation" ? "placement-activate" : "placement-recover";
	return await runExclusiveSessionLifecycleMutation(operation, {
		scope: target.storePath,
		identities: [
			params.sessionKey,
			target.canonicalKey,
			...target.storeKeys,
			params.sessionId
		],
		signal: params.signal,
		run: async () => {
			const { target: currentTarget, entry, workspace, assertCurrent } = await resolveWorkerPlacementSessionTarget({
				sessionRuntime: params.sessionRuntime,
				config: params.getConfig(),
				sessionId: params.sessionId,
				sessionKey: params.sessionKey,
				agentId: params.agentId,
				expectedTarget: target,
				errorMessage: `Session ${params.sessionKey} changed before cloud worker ${params.action}. Retry.`
			});
			params.signal?.throwIfAborted();
			assertCurrent(params.getConfig());
			if (entry.archivedAt !== void 0) throw new WorkerDispatchTargetChangedError(`Session ${params.sessionKey} was archived before cloud worker ${params.action}. Retry.`);
			const assertPlacementCurrent = () => {
				params.signal?.throwIfAborted();
				const config = params.getConfig();
				assertCurrent(config);
				const currentRuntime = params.sessionRuntime.resolveWorkerPlacementSessionRuntime({
					cfg: config,
					entry,
					agentId: currentTarget.agentId,
					sessionKey: currentTarget.canonicalKey
				});
				if (params.sessionRuntime.resolveWorkerPlacementExecutionMode(currentRuntime) !== params.executionMode) throw new WorkerDispatchTargetChangedError(`Session ${params.sessionKey} runtime changed to ${currentRuntime} before cloud worker ${params.action}. Retry.`);
			};
			assertPlacementCurrent();
			return await params.run(workspace, assertPlacementCurrent);
		}
	});
}
/** Keep canonical session identity and its durable workspace owner in one lifecycle fence. */
async function resolveWorkerPlacementSessionTarget(params) {
	const initialTarget = params.sessionRuntime.resolveGatewaySessionStoreTargetWithStore({
		cfg: params.config,
		key: params.sessionKey,
		agentId: params.agentId,
		preserveQualifiedAddress: true,
		clone: false,
		exactRead: true
	});
	const initialEntry = params.sessionRuntime.resolveCanonicalSessionEntryFromStoreKeys(initialTarget.store, initialTarget.storeKeys);
	const expected = params.expectedTarget ?? initialTarget;
	const targetChangedError = () => params.expectedTarget ? new WorkerDispatchTargetChangedError(params.errorMessage) : new Error(params.errorMessage);
	if (initialTarget.storePath !== expected.storePath || initialTarget.canonicalKey !== expected.canonicalKey || initialTarget.agentId !== expected.agentId || !initialEntry || initialEntry.sessionId !== params.sessionId) throw targetChangedError();
	const initialIdentity = {
		lifecycleRevision: initialEntry.lifecycleRevision,
		archivedAt: initialEntry.archivedAt,
		worktreeId: initialEntry.worktree?.id,
		repositoryWorkspaceId: initialEntry.repositoryWorkspaceId
	};
	const prepared = initialIdentity.repositoryWorkspaceId ? await getSessionRepositoryWorkspaceStore().prepare(initialIdentity.repositoryWorkspaceId) : void 0;
	const resolveBinding = (config = params.config) => {
		const target = params.sessionRuntime.resolveGatewaySessionStoreTargetWithStore({
			cfg: config,
			key: params.sessionKey,
			agentId: params.agentId,
			preserveQualifiedAddress: true,
			clone: false,
			exactRead: true
		});
		const entry = params.sessionRuntime.resolveCanonicalSessionEntryFromStoreKeys(target.store, target.storeKeys);
		if (target.storePath !== expected.storePath || target.canonicalKey !== expected.canonicalKey || target.agentId !== expected.agentId) throw targetChangedError();
		if (!entry || entry.sessionId !== params.sessionId || entry.lifecycleRevision !== initialIdentity.lifecycleRevision || entry.archivedAt !== initialIdentity.archivedAt || entry.worktree?.id !== initialIdentity.worktreeId || entry.repositoryWorkspaceId !== initialIdentity.repositoryWorkspaceId) throw targetChangedError();
		if (entry.repositoryWorkspaceId) {
			prepared?.assertSourceCurrent();
			const repository = prepared?.workspace;
			if (!repository || repository.workspaceId !== entry.repositoryWorkspaceId || repository.agentId !== target.agentId || repository.sessionKey !== target.canonicalKey || entry.worktree) throw targetChangedError();
			return {
				config,
				target,
				entry,
				worktree: void 0,
				workspace: {
					kind: "repository",
					repository
				}
			};
		}
		const worktree = params.sessionRuntime.managedWorktrees.findLiveByOwner("session", target.canonicalKey);
		if (!entry.worktree?.id || !worktree || worktree.id !== entry.worktree.id || worktree.ownerId !== target.canonicalKey) throw targetChangedError();
		return {
			config,
			target,
			entry,
			worktree,
			workspace: {
				kind: "local",
				path: worktree.path
			}
		};
	};
	const resolveCurrent = (config = params.config) => {
		const selected = resolveBinding(config);
		if (selected.workspace.kind === "repository" && prepared?.current()?.revision !== selected.workspace.repository.revision) throw targetChangedError();
		return selected;
	};
	return {
		...resolveCurrent(),
		assertBindingCurrent: (config) => {
			resolveBinding(config);
		},
		assertCurrent: (config) => {
			resolveCurrent(config);
		}
	};
}
const loadWorkerPlacementSessionRuntimeModule = createLazyRuntimeModule(async () => {
	const [placementSessionRuntime, { managedWorktrees }, sessionUtils] = await Promise.all([
		import("./placement-session-runtime-DRrSOJXK.mjs"),
		import("./service-obfLq1v6.mjs"),
		import("./session-utils-Lz35_6Mu.mjs")
	]);
	return {
		resolveWorkerPlacementExecutionMode: placementSessionRuntime.resolveWorkerPlacementExecutionMode,
		resolveWorkerPlacementCapabilities: placementSessionRuntime.resolveWorkerPlacementCapabilities,
		managedWorktrees,
		resolveWorkerPlacementSessionRuntime: placementSessionRuntime.resolveWorkerPlacementSessionRuntime,
		resolveCanonicalSessionEntryFromStoreKeys: sessionUtils.resolveCanonicalSessionEntryFromStoreKeys,
		resolveGatewaySessionStoreTargetWithStore: sessionUtils.resolveGatewaySessionStoreTargetWithStore
	};
});
async function prepareWorkerPlacementRepositoryManifestRefs(placement) {
	const readEntry = () => loadSessionEntryReadOnly({
		...placement,
		storePath: resolveSessionStorePathForScope(placement)
	});
	const entry = readEntry();
	if (entry?.sessionId !== placement.sessionId) return () => null;
	const prepared = entry.repositoryWorkspaceId ? await getSessionRepositoryWorkspaceStore().prepare(entry.repositoryWorkspaceId) : void 0;
	return () => {
		const current = readEntry();
		if (current?.sessionId !== placement.sessionId || current.lifecycleRevision !== entry.lifecycleRevision || current.repositoryWorkspaceId !== entry.repositoryWorkspaceId) return null;
		if (!prepared) return [];
		try {
			const repository = prepared.current();
			return repository?.agentId === placement.agentId && repository.sessionKey === placement.sessionKey && repository.baseManifestHash ? [repository.baseManifestHash] : null;
		} catch {
			return null;
		}
	};
}
function createWorkerPlacementNodeWorkspaceBindingResolver(options) {
	return async (binding) => {
		const placement = options.placements.get(binding.sessionId);
		if (!placement || placement.state !== "active" && placement.state !== "draining" && placement.state !== "reconciling" || placement.environmentId !== binding.environmentId || placement.activeOwnerEpoch !== binding.ownerEpoch) return;
		const workspace = await options.resolveWorkspace({
			sessionId: placement.sessionId,
			sessionKey: placement.sessionKey,
			agentId: placement.agentId
		});
		const current = options.placements.get(binding.sessionId);
		if (current?.state !== placement.state || current.generation !== placement.generation || current.environmentId !== binding.environmentId || current.activeOwnerEpoch !== binding.ownerEpoch || current.sessionKey !== placement.sessionKey || current.agentId !== placement.agentId || current.remoteWorkspaceDir !== placement.remoteWorkspaceDir || current.workspaceBaseManifestRef !== placement.workspaceBaseManifestRef) return;
		if (workspace.kind === "repository" && (!workspace.repository.baseCommit || !workspace.repository.baseManifestHash)) throw new Error("Attached repository workspace has no pinned baseline");
		return {
			source: workspace.kind === "local" ? {
				kind: "local",
				path: workspace.path
			} : {
				kind: "repository",
				baseCommit: workspace.repository.baseCommit,
				baseManifestRef: workspace.repository.baseManifestHash
			},
			manifestRef: placement.workspaceBaseManifestRef,
			remoteWorkspaceDir: placement.remoteWorkspaceDir,
			sessionKey: placement.sessionKey
		};
	};
}
//#endregion
//#region src/gateway/server-worker-placement-local-dispatch.ts
const loadWorkerWorkspacePreflight = createLazyRuntimeModule(async () => {
	const { preflightWorkerWorkspace } = await import("./workspace-sync-preflight-0cpn64VU.mjs");
	return preflightWorkerWorkspace;
});
function createGatewayWorkerPlacementLocalDispatchBarrier(params) {
	return async ({ sessionId, sessionKey, agentId, executionMode, authorize, signal, startDispatch }) => {
		const sessionRuntime = await loadWorkerPlacementSessionRuntimeModule();
		const { resolveWorkerPlacementExecutionMode, resolveGatewaySessionStoreTargetWithStore, resolveWorkerPlacementSessionRuntime } = sessionRuntime;
		const target = resolveGatewaySessionStoreTargetWithStore({
			cfg: getRuntimeConfig(),
			key: sessionKey,
			agentId,
			preserveQualifiedAddress: true,
			clone: false,
			exactRead: true
		});
		const lifecycleIdentities = [
			sessionKey,
			target.canonicalKey,
			...target.storeKeys,
			sessionId
		];
		let placement;
		return await runExclusiveSessionLifecycleMutation("placement-dispatch", {
			scope: target.storePath,
			identities: lifecycleIdentities,
			signal,
			prepare: async () => {
				const { config: currentConfig, target: currentTarget, entry: currentEntry, workspace, assertCurrent } = await resolveWorkerPlacementSessionTarget({
					sessionRuntime,
					config: getRuntimeConfig(),
					sessionId,
					sessionKey,
					agentId,
					expectedTarget: target,
					errorMessage: `Session ${sessionKey} changed before cloud worker dispatch. Retry.`
				});
				assertCurrent(getRuntimeConfig());
				if (currentEntry.archivedAt !== void 0) throw new WorkerDispatchTargetChangedError(`Session ${sessionKey} was archived before cloud worker dispatch. Retry.`);
				const currentRuntime = resolveWorkerPlacementSessionRuntime({
					cfg: currentConfig,
					entry: currentEntry,
					agentId: currentTarget.agentId,
					sessionKey: currentTarget.canonicalKey
				});
				if (resolveWorkerPlacementExecutionMode(currentRuntime) !== executionMode) throw new WorkerDispatchTargetChangedError(`Session ${sessionKey} runtime changed to ${currentRuntime} before cloud worker dispatch. Retry.`);
				if (workspace.kind === "local") await (await loadWorkerWorkspacePreflight())({
					localPath: workspace.path,
					signal
				});
				assertCurrent(getRuntimeConfig());
				authorize?.();
				placement = await startDispatch();
				clearSessionLifecycleQueues({
					keys: lifecycleIdentities,
					agentId: currentTarget.agentId,
					sessionKey: currentTarget.canonicalKey,
					sessionId,
					assertCurrent: () => {}
				});
				params.revokeSessionAuthority({
					sessionId,
					sessionKeys: lifecycleIdentities
				});
				await params.awaitTurnClaimRelease(sessionId, async () => {
					if (!await interruptSessionWorkAdmissions({
						scope: target.storePath,
						identities: lifecycleIdentities,
						timeoutMs: 15e3
					})) throw new Error(`Session ${sessionKey} is still active; dispatch stopped`);
					await params.placements.waitForTurnClaimRelease(sessionId, {
						timeoutMs: SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS,
						signal
					});
				});
				await runExclusiveSessionStoreWrite(target.storePath, async () => {}, { reentrant: true });
			},
			run: async () => {
				if (!placement) throw new Error(`Session ${sessionKey} dispatch barrier did not start`);
				return placement;
			}
		});
	};
}
//#endregion
//#region src/gateway/server-worker-placement-move-barrier.ts
function createGatewayWorkerPlacementMoveBarrier(params) {
	return async ({ sessionId, sessionKey, agentId, sourceDisposition, authorize, signal, begin }) => {
		const sessionRuntime = await params.loadSessionRuntime();
		const target = sessionRuntime.resolveGatewaySessionStoreTargetWithStore({
			cfg: getRuntimeConfig(),
			key: sessionKey,
			agentId,
			preserveQualifiedAddress: true,
			clone: false,
			exactRead: true
		});
		const lifecycleIdentities = [
			sessionKey,
			target.canonicalKey,
			...target.storeKeys,
			sessionId
		];
		let begun;
		return await runExclusiveSessionLifecycleMutation("placement-move", {
			scope: target.storePath,
			identities: lifecycleIdentities,
			signal,
			prepare: async () => {
				const resolved = await resolveWorkerPlacementSessionTarget({
					sessionRuntime,
					config: getRuntimeConfig(),
					sessionId,
					sessionKey,
					agentId,
					expectedTarget: target,
					errorMessage: `Session ${sessionKey} changed before placement move. Retry.`
				});
				resolved.assertCurrent(getRuntimeConfig());
				authorize?.();
				begun = await begin(async (runId) => {
					if (params.persistAbandonedPartial) {
						await params.persistAbandonedPartial({
							sessionId,
							sessionKey,
							agentId,
							runId
						});
						authorize?.();
					}
				});
				clearSessionLifecycleQueues({
					keys: lifecycleIdentities,
					agentId: resolved.target.agentId,
					sessionKey: resolved.target.canonicalKey,
					sessionId,
					assertCurrent: () => {}
				});
				params.revokeSessionAuthority({
					sessionId,
					sessionKeys: lifecycleIdentities
				});
				if (sourceDisposition === "abandon") {
					startSessionWorkAdmissionInterruption({
						scope: target.storePath,
						identities: lifecycleIdentities
					});
					return;
				}
				await params.awaitTurnClaimRelease(sessionId, async () => {
					if (!await interruptSessionWorkAdmissions({
						scope: target.storePath,
						identities: lifecycleIdentities,
						timeoutMs: 15e3
					})) throw new Error(`Session ${sessionKey} is still active; placement move interrupted`);
					await params.placements.waitForTurnClaimRelease(sessionId, {
						timeoutMs: SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS,
						signal
					});
				});
				await runExclusiveSessionStoreWrite(target.storePath, async () => {}, { reentrant: true });
			},
			run: async () => {
				if (!begun) throw new Error(`Session ${sessionKey} placement move barrier did not start`);
				return begun;
			}
		});
	};
}
//#endregion
//#region src/gateway/server-worker-placement-move-destination.ts
function createGatewayWorkerPlacementMoveDestinationResolver(params) {
	return async (identity, moveTarget) => {
		if (moveTarget.kind === "gateway") return;
		const sessionRuntime = await params.loadSessionRuntime();
		const { config, target, entry, assertCurrent } = await resolveWorkerPlacementSessionTarget({
			sessionRuntime,
			config: params.getConfig(),
			...identity,
			errorMessage: `Session ${identity.sessionKey} changed before placement move recovery.`
		});
		assertCurrent(params.getConfig());
		const destination = resolveWorkerPlacementDestination({
			cfg: config,
			...moveTarget.kind === "profile" ? {
				profileId: moveTarget.profileId,
				machineClass: moveTarget.machineClass,
				os: moveTarget.os
			} : { deviceId: moveTarget.deviceId }
		});
		if (!destination.ok || !destination.value) throw new Error(destination.ok ? "worker move target is missing" : destination.error);
		const runtime = sessionRuntime.resolveWorkerPlacementSessionRuntime({
			cfg: config,
			entry,
			agentId: target.agentId,
			sessionKey: target.canonicalKey
		});
		const { executionMode, devicePlacement } = sessionRuntime.resolveWorkerPlacementCapabilities(runtime);
		if (!executionMode) throw new Error(`Runtime ${runtime} lacks cloud placement support`);
		if (moveTarget.kind === "profile") {
			if (!params.environments.supportsExecutionMode(moveTarget.profileId, executionMode)) throw new Error(`worker profile ${moveTarget.profileId} does not support ${executionMode} placement; select a compatible worker provider`);
		} else {
			const eligibility = await resolveDevicePlacementEligibility({
				environmentService: params.environments,
				deviceId: moveTarget.deviceId,
				runtimeId: runtime,
				executionMode,
				requirement: devicePlacement,
				config
			});
			if (!eligibility.ok) throw new Error(eligibility.error);
		}
		assertCurrent(params.getConfig());
		return {
			executionMode,
			...destination.value,
			...devicePlacement ? { devicePlacement } : {}
		};
	};
}
//#endregion
//#region src/gateway/server-worker-placement-reclaim.ts
function createGatewayWorkerPlacementReclaimBarriers(params) {
	const resolveLifecycleContext = async ({ sessionId, sessionKey, agentId }) => {
		const sessionRuntime = await params.loadSessionRuntime();
		const target = sessionRuntime.resolveGatewaySessionStoreTargetWithStore({
			cfg: getRuntimeConfig(),
			key: sessionKey,
			agentId,
			preserveQualifiedAddress: true,
			clone: false,
			exactRead: true
		});
		const lifecycleIdentities = [
			sessionKey,
			target.canonicalKey,
			...target.storeKeys,
			sessionId
		];
		const cancelAndDrain = async (closeWorkAdmissions, assertCurrent, assertCancellationCurrent = assertCurrent, pendingSettlement) => {
			const reason = createAgentRunDirectAbortError();
			assertCurrent();
			closeWorkAdmissions(reason);
			let released;
			let interruptionStarted = false;
			let interruptionError;
			const interrupt = () => {
				if (interruptionStarted) return;
				interruptionStarted = true;
				try {
					assertCurrent();
					released = startSessionWorkAdmissionInterruption({
						reason,
						scope: target.storePath,
						identities: lifecycleIdentities
					}).released;
				} catch (error) {
					interruptionError = toErrorObject(error, "Session work interruption failed");
				}
			};
			const settled = pendingSettlement?.then(() => void 0, () => void 0);
			try {
				await params.cancelSessionWork({
					sessionId,
					sessionKeys: lifecycleIdentities,
					agentId,
					assertCurrent: assertCancellationCurrent,
					...pendingSettlement ? { onCancellationStarted: interrupt } : {}
				});
				interrupt();
				await settled;
				if (interruptionError !== void 0) throw interruptionError;
				assertCurrent();
				await withTimeout(released, SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS, "session work admission drain");
			} catch (error) {
				if (interruptionStarted) await settled;
				throw error;
			}
			await params.placements.waitForTurnClaimRelease(sessionId, { timeoutMs: SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS });
			await runExclusiveSessionStoreWrite(target.storePath, async () => {}, { reentrant: true });
		};
		return {
			sessionRuntime,
			target,
			lifecycleIdentities,
			cancelAndDrain
		};
	};
	const runReclaimPreparation = async ({ sessionId, sessionKey, agentId, authorize, beforeDrain, pendingOperations, run }) => {
		const { sessionRuntime, target, lifecycleIdentities, cancelAndDrain } = await resolveLifecycleContext({
			sessionId,
			sessionKey,
			agentId
		});
		const revision = sessionRuntime.resolveCanonicalSessionEntryFromStoreKeys(target.store, target.storeKeys)?.lifecycleRevision ?? null;
		const assertCurrent = () => {
			authorize?.();
			const current = sessionRuntime.resolveGatewaySessionStoreTargetWithStore({
				cfg: getRuntimeConfig(),
				key: sessionKey,
				agentId,
				preserveQualifiedAddress: true,
				clone: false,
				exactRead: true
			});
			const currentEntry = sessionRuntime.resolveCanonicalSessionEntryFromStoreKeys(current.store, current.storeKeys);
			if (current.storePath !== target.storePath || current.canonicalKey !== target.canonicalKey || current.agentId !== target.agentId || currentEntry?.sessionId !== sessionId || (currentEntry.lifecycleRevision ?? null) !== revision) throw new WorkerDispatchTargetChangedError(`Session ${sessionKey} changed before cloud worker stop. Retry.`);
		};
		assertCurrent();
		beforeDrain?.();
		const placement = params.placements.get(sessionId);
		const pending = pendingOperations?.isCurrent() ? pendingOperations : void 0;
		const dispatch = pending?.hasPendingDispatch() === true;
		if (!dispatch && (!placement || placement.state === "local" || placement.state === "reclaimed")) {
			await pending?.settled;
			assertCurrent();
			return await run(assertCurrent);
		}
		const release = closeSessionWorkAdmissions({
			scope: target.storePath,
			identities: lifecycleIdentities,
			reason: createAgentRunDirectAbortError()
		});
		try {
			const cancelRunningWork = placement?.state === "active" || placement?.state === "draining" || placement?.state === "failed";
			if (dispatch || cancelRunningWork) await cancelAndDrain(() => {}, assertCurrent, () => {
				assertCurrent();
				const current = params.placements.get(sessionId);
				const captured = pending?.currentPlacement();
				const expected = captured && (!placement || captured.generation > placement.generation) ? captured : placement;
				if ((expected || pending) && !matchesWorkerPlacementTarget(current, expected)) throw new WorkerDispatchTargetChangedError(`Session ${sessionKey} cloud worker changed before cancellation. Retry.`);
			}, pending?.settled);
			else await pending?.settled;
			assertCurrent();
			return await run(assertCurrent);
		} finally {
			release();
		}
	};
	const runReclaimBarrier = async ({ sessionId, sessionKey, agentId, authorize, beforeDrain, begin, reclaim }) => {
		const { sessionRuntime, target, lifecycleIdentities, cancelAndDrain } = await resolveLifecycleContext({
			sessionId,
			sessionKey,
			agentId
		});
		let assertBindingCurrent;
		return await runExclusiveSessionLifecycleMutation("placement-reclaim", {
			scope: target.storePath,
			identities: lifecycleIdentities,
			prepare: async (lifecycle) => {
				beforeDrain?.();
				const resolved = await resolveWorkerPlacementSessionTarget({
					sessionRuntime,
					config: getRuntimeConfig(),
					sessionId,
					sessionKey,
					agentId,
					expectedTarget: target,
					errorMessage: `Session ${sessionKey} changed before cloud worker stop. Retry.`
				});
				const placement = params.placements.get(sessionId);
				if (placement?.state !== "active" && placement?.state !== "draining" && placement?.state !== "reclaimed") throw new Error(`Session ${sessionKey} cannot stop cloud worker from placement ${placement?.state ?? "missing"}`);
				assertBindingCurrent = () => {
					authorize?.();
					resolved.assertBindingCurrent(getRuntimeConfig());
				};
				await cancelAndDrain(lifecycle.closeWorkAdmissions, assertBindingCurrent);
			},
			run: async () => {
				if (!assertBindingCurrent) throw new Error(`Session ${sessionKey} cloud worker stop barrier did not prepare`);
				assertBindingCurrent();
				const resolved = await resolveWorkerPlacementSessionTarget({
					sessionRuntime,
					config: getRuntimeConfig(),
					sessionId,
					sessionKey,
					agentId,
					expectedTarget: target,
					errorMessage: `Session ${sessionKey} changed before cloud worker stop. Retry.`
				});
				assertBindingCurrent();
				beforeDrain?.();
				resolved.assertCurrent(getRuntimeConfig());
				const assertDrainCurrent = () => {
					assertBindingCurrent?.();
					resolved.assertCurrent(getRuntimeConfig());
				};
				const placement = await begin(assertDrainCurrent);
				assertDrainCurrent();
				const reclaimedPlacement = await reclaim(resolved.workspace, placement, assertDrainCurrent);
				params.revokeSessionAuthority({
					sessionId,
					sessionKeys: lifecycleIdentities
				});
				return reclaimedPlacement;
			}
		});
	};
	const runFailedReclaimBarrier = async ({ sessionId, sessionKey, agentId, authorize, reclaim }) => {
		const { sessionRuntime, target, lifecycleIdentities, cancelAndDrain } = await resolveLifecycleContext({
			sessionId,
			sessionKey,
			agentId
		});
		const assertCurrent = () => {
			const currentTarget = sessionRuntime.resolveGatewaySessionStoreTargetWithStore({
				cfg: getRuntimeConfig(),
				key: sessionKey,
				agentId,
				preserveQualifiedAddress: true,
				clone: false,
				exactRead: true
			});
			const currentEntry = sessionRuntime.resolveCanonicalSessionEntryFromStoreKeys(currentTarget.store, currentTarget.storeKeys);
			if (currentTarget.storePath !== target.storePath || currentTarget.canonicalKey !== target.canonicalKey || currentTarget.agentId !== target.agentId || currentEntry?.sessionId !== sessionId) throw new WorkerDispatchTargetChangedError(`Session ${sessionKey} changed before failed cloud worker cleanup. Retry.`);
			authorize?.();
		};
		return await runExclusiveSessionLifecycleMutation("placement-failed-reclaim", {
			scope: target.storePath,
			identities: lifecycleIdentities,
			prepare: async (lifecycle) => {
				assertCurrent();
				if (params.placements.get(sessionId)?.state === "failed") await cancelAndDrain(lifecycle.closeWorkAdmissions, assertCurrent);
			},
			run: async () => {
				assertCurrent();
				return await reclaim(authorize);
			}
		});
	};
	return {
		runReclaimPreparation,
		runReclaimBarrier,
		runFailedReclaimBarrier
	};
}
//#endregion
//#region src/gateway/server-worker-placement-reconcile-guard.ts
function createWorkerPlacementInitialRecovery(params) {
	return async (placement) => {
		const current = params.placements.get(placement.sessionId);
		if (params.isStopping() || !placement.environmentId || !current || !matchesWorkerPlacementTarget(current, placement) || current.sessionKey !== placement.sessionKey || current.agentId !== placement.agentId || current.executionMode !== placement.executionMode) throw new Error("Worker placement changed before initial setup recovery");
		await params.environments.reconcileEnvironment(placement.environmentId);
	};
}
function installWorkerPlacementReconcileGuard(params) {
	return params.environments.installReconcileEnvironmentGuard(async (environmentId, reconcileEnvironmentCore) => {
		if (params.isStopping()) return;
		const sessionIds = (await params.placements.readChangeSnapshot()).map(({ sessionId }) => sessionId);
		const facts = await params.placements.readProjection(sessionIds, { current: true });
		if (params.isStopping()) return;
		const references = [...facts.placements.values()].filter((placement) => placement.environmentId === environmentId);
		if (references.length > 1) throw new Error(`Worker environment ${environmentId} has multiple placement owners`);
		const owner = references[0];
		if (owner && params.dispatch.hasPendingPlacementLifecycleOperation(owner.sessionId)) return;
		if (owner?.state === "provisioning") {
			await params.dispatch.resumeProvisioning(owner, reconcileEnvironmentCore);
			return;
		}
		const environment = params.environments.get(environmentId);
		if (owner && (environment?.state === "requested" || environment?.state === "provisioning" || environment?.state === "bootstrapping") && (owner.state !== "failed" || owner.turnClaim !== null || owner.activeOwnerEpoch !== null || environment.destroyRequestedAtMs === null)) throw new Error(`Worker environment ${environmentId} provisioning owner is ${owner.state}`);
		await reconcileEnvironmentCore();
	});
}
//#endregion
//#region src/gateway/server-worker-placement-runtime-refresh.ts
/** Bind pre-handoff admission to this Gateway's node registry and lifetime. */
function createWorkerRuntimeRefreshWaiter(params) {
	let waitForNode;
	const wait = async ({ placement, signal, assertCurrent }) => {
		const environment = params.environments.get(placement.environmentId);
		if (!environment?.nodeDeviceId) return;
		if (!waitForNode) throw new Error("Worker node availability runtime is unavailable");
		const waitingSignal = AbortSignal.any([signal, getGatewayRestartDrainSignal()]);
		const assertWaitingCurrent = () => {
			waitingSignal.throwIfAborted();
			assertCurrent();
			const current = params.environments.get(placement.environmentId);
			if (params.isStopping() || params.environments.isStopping() || current?.state !== "attached" || current.ownerEpoch !== placement.activeOwnerEpoch || current.nodeDeviceId !== environment.nodeDeviceId || current.leaseId !== environment.leaseId || current.destroyRequestedAtMs !== null || current.attachedSessionIds.length !== 1 || current.attachedSessionIds[0] !== placement.sessionId) throw new Error("Worker admission lost its environment while waiting for reconnect");
		};
		assertWaitingCurrent();
		await waitForNode(environment.nodeDeviceId, {
			signal: waitingSignal,
			assertCurrent: assertWaitingCurrent
		});
		assertWaitingCurrent();
	};
	return {
		wait,
		bind: (bound) => {
			waitForNode = bound;
		}
	};
}
//#endregion
//#region src/config/sessions/session-placement-evidence.ts
/** Whole evidence preparation keeps native incognito and disk-backed custody distinct. */
async function readPlacementSessionIdentityEvidence(cfg, input) {
	const capturedEnv = cloneEnvWithPlatformSemantics(process.env);
	const env = {
		...capturedEnv,
		OPENCLAW_STATE_DIR: resolveStateDir(capturedEnv)
	};
	const probes = input.map((probe) => ({ ...probe }));
	const results = probes.map(() => ({ status: "absent" }));
	const incognito = probes.flatMap((probe, index) => isIncognitoSessionKey(probe.sessionKey) ? [{
		probe,
		index
	}] : []);
	const nativeProbes = incognito.map(({ probe }) => ({
		...probe,
		env,
		storePath: resolveIncognitoOpenClawAgentSqlitePath({
			agentId: probe.agentId,
			env
		})
	}));
	const readIncognito = () => {
		const native = readSessionIdentityEvidenceBatch(nativeProbes);
		for (const [offset, item] of incognito.entries()) results[item.index] = expectDefined(native[offset], "incognito evidence");
	};
	const incognitoGeneration = readOpenIncognitoAgentDatabaseGeneration();
	const disk = probes.flatMap((probe, index) => !isIncognitoSessionKey(probe.sessionKey) ? [{
		probe,
		index
	}] : []);
	if (disk.length === 0) {
		readIncognito();
		return results;
	}
	const prepareDisk = () => {
		const { candidates, ...prepared } = prepareSessionStoreTargetInventory(cfg, disk.map(({ probe }) => probe.agentId), env);
		return {
			candidates,
			prepared,
			inventoryRead: prepareSessionStoreTargetInventoryRead({
				...prepared,
				candidates
			}),
			nativeReaders: retainOpenClawAgentDatabaseReadCandidates(candidates.flatMap((candidate) => [candidate, {
				...candidate,
				path: candidate.physicalPath
			}]), env)
		};
	};
	let diskPreparation;
	try {
		diskPreparation = prepareDisk();
	} catch {
		for (const { index } of disk) results[index] = {
			status: "unknown",
			reason: "read-failed"
		};
		readIncognito();
		return results;
	}
	const { candidates, prepared, inventoryRead, nativeReaders } = diskPreparation;
	const continuations = [];
	const releaseContinuations = () => {
		for (const { owner } of continuations.toReversed()) owner.release();
		nativeReaders.release();
	};
	try {
		for (const database of nativeReaders.databases) {
			const physicalPath = captureSessionStoreReadCandidate(database.path).physicalPath;
			const owner = captureCanonicalSessionReaderContinuation(database);
			if (owner) continuations.push({
				path: physicalPath,
				owner
			});
		}
	} catch (error) {
		releaseContinuations();
		throw error;
	}
	let changed = false;
	const unsubscribe = sessionChanges.subscribe((change) => {
		if ("all" in change || !change.storePath) {
			changed = true;
			return;
		}
		const pathname = resolveUnsuffixedSqliteTargetFromSessionStorePath(change.storePath).path;
		changed ||= candidates.some((candidate) => matchesAgentDatabaseReadCandidatePath(candidate, pathname) || matchesAgentDatabaseReadCandidatePath({
			...candidate,
			path: candidate.physicalPath
		}, pathname));
	});
	try {
		await inventoryRead.withRead(async (inventory, assertDiscoveryCurrent) => {
			const agents = new Map(inventory.agents.map((agent) => [agent.agentId, agent]));
			const groups = /* @__PURE__ */ new Map();
			for (const { probe, index } of disk) {
				const observed = agents.get(normalizeAgentId(probe.agentId));
				if (!observed || !observed.result.available) {
					results[index] = observed?.result.available === false && observed.result.reason === "database-missing" ? { status: "absent" } : {
						status: "unknown",
						reason: "read-failed"
					};
					continue;
				}
				for (const { database } of observed.reads) {
					const key = JSON.stringify(database);
					const group = groups.get(key) ?? {
						database,
						identities: [],
						indexes: []
					};
					group.identities.push({
						sessionId: probe.sessionId,
						sessionKey: normalizeStoreSessionKey(probe.sessionKey)
					});
					group.indexes.push(index);
					groups.set(key, group);
				}
			}
			const reads = [...groups.values()];
			return await withSessionHistoryWorkerDatabases(reads.map(({ database }) => ({
				...database,
				env
			})), async (owners) => {
				const assertCurrent = () => {
					assertDiscoveryCurrent();
					for (const owner of owners) owner.assertCurrent();
				};
				assertCurrent();
				for (const [index, group] of reads.entries()) {
					let evidence;
					try {
						evidence = await expectDefined(owners[index], "retained evidence reader").readIdentityEvidence({
							identities: group.identities,
							env: prepared.env,
							continuation: continuations.find(({ path, owner }) => path === group.database.path && owner.receipt.agentId === group.database.agentId)?.owner.receipt
						});
					} catch (error) {
						assertCurrent();
						if (error instanceof AggregateError) throw error;
						evidence = group.identities.map(() => ({
							status: "unknown",
							reason: "read-failed"
						}));
					}
					assertCurrent();
					for (const [offset, evidenceResult] of evidence.entries()) {
						const resultIndex = expectDefined(group.indexes[offset], "evidence subject");
						if (results[resultIndex]?.status !== "current" && evidenceResult.status !== "absent") results[resultIndex] = evidenceResult;
					}
				}
				assertCurrent();
				return results;
			});
		});
		inventoryRead.assertRegistryCurrent();
		for (const candidate of candidates) if (captureSessionStoreReadCandidate(candidate.path, candidate.scope).physicalPath !== candidate.physicalPath) throw new Error("Session store alias changed during discovery; retry the read.");
		for (const { owner } of continuations) owner.assertCurrent();
		if (changed) {
			for (const { index } of disk) if (results[index]?.status === "absent") results[index] = {
				status: "unknown",
				reason: "read-failed"
			};
		}
		if (incognitoGeneration !== readOpenIncognitoAgentDatabaseGeneration()) for (const { index } of incognito) results[index] = {
			status: "unknown",
			reason: "read-failed"
		};
		else readIncognito();
		return results;
	} finally {
		unsubscribe();
		releaseContinuations();
	}
}
//#endregion
//#region src/gateway/server-worker-placement-session-evidence.ts
const log$2 = createSubsystemLogger("gateway/placement-session-evidence");
function resolvePlacementSessionIdentities(cfg, placement) {
	const requestedAgentId = normalizeAgentId(placement.agentId);
	const parsedKey = parseAgentSessionKey(placement.sessionKey);
	const canonicalKey = resolveSessionStoreKey({
		cfg,
		sessionKey: placement.sessionKey,
		storeAgentId: requestedAgentId
	});
	const canonicalAgentId = canonicalKey === "global" || canonicalKey === "unknown" || !parsedKey ? requestedAgentId : resolveSessionStoreAgentId(cfg, canonicalKey);
	const canonical = {
		placement,
		agentId: canonicalAgentId,
		sessionKey: canonicalKey
	};
	if (!parsedKey) return [canonical];
	const persistedAgentId = normalizeAgentId(parsedKey.agentId);
	if (persistedAgentId === canonicalAgentId) return [canonical];
	return [canonical, {
		placement,
		agentId: persistedAgentId,
		sessionKey: placement.sessionKey
	}];
}
async function createWorkerPlacementSessionEvidenceResolver(placements) {
	try {
		const cfg = getRuntimeConfig();
		const identities = placements.flatMap((placement) => resolvePlacementSessionIdentities(cfg, placement));
		const subjects = new Map(placements.map((placement) => [placement, {
			agentId: placement.agentId,
			sessionId: placement.sessionId,
			sessionKey: placement.sessionKey
		}]));
		const evidence = await readPlacementSessionIdentityEvidence(cfg, identities.map((identity) => ({
			agentId: identity.agentId,
			sessionId: identity.placement.sessionId,
			sessionKey: identity.sessionKey
		})));
		const evidenceByPlacement = new Map(placements.map((placement) => [placement, "absent"]));
		for (const [index, result] of evidence.entries()) {
			const placement = identities[index]?.placement;
			if (!placement) continue;
			if ((evidenceByPlacement.get(placement) ?? "unknown") !== "current" && result.status !== "absent") evidenceByPlacement.set(placement, result.status);
		}
		return async (placement) => {
			const subject = subjects.get(placement);
			if (!subject || subject.agentId !== placement.agentId || subject.sessionId !== placement.sessionId || subject.sessionKey !== placement.sessionKey) return "unknown";
			return evidenceByPlacement.get(placement) ?? "unknown";
		};
	} catch (error) {
		log$2.warn("worker placement session evidence resolution failed; treating all as unknown", { error });
		return async () => "unknown";
	}
}
//#endregion
//#region src/gateway/server-worker-placement-workspace-recovery.ts
const workerPlacementLog = createSubsystemLogger("gateway/worker-placement");
async function recoverGatewayWorkerPlacementWorkspaces(params) {
	const orphanedJournals = await params.placements.pruneOrphanedWorkspaceReconciliations();
	for (const owner of orphanedJournals) workerPlacementLog.warn(`discarded orphaned cloud workspace journal for ${owner.sessionId}`);
	for (const owner of await params.placements.listWorkspaceReconciliationOwners()) try {
		const placement = await params.placements.getWorkspaceReconciliationPlacement(owner);
		if (!placement) throw new Error(`Cloud workspace journal has no matching owner: ${owner.sessionId}`);
		const workspace = await params.resolveWorkspace({
			sessionId: placement.sessionId,
			sessionKey: placement.sessionKey,
			agentId: placement.agentId
		});
		if (workspace.kind !== "local") throw new Error("Repository checkpoints cannot own a local worktree reconciliation journal");
		const journal = await params.placements.loadWorkspaceReconciliation(owner);
		if (!journal) continue;
		await recoverWorkerWorkspaceReconciliation({
			root: workspace.path,
			journal
		});
		await params.placements.abortWorkspaceReconciliation(owner);
	} catch (error) {
		workerPlacementLog.error(`cloud workspace recovery deferred for ${owner.sessionId}: ${formatErrorMessage(error)}`);
	}
}
//#endregion
//#region src/gateway/session-repository-materialization.ts
/** Explicit Gateway moves and failed-placement recovery restore only accepted source results. */
async function materializeSessionRepositoryWorkspaceOnGateway(params) {
	const initial = loadGatewaySessionEntryReadOnly(params.sessionKey, { agentId: params.agentId });
	if (initial.entry?.sessionId !== params.sessionId) throw new Error("Session changed before repository materialization");
	const workspaceId = initial.entry.repositoryWorkspaceId;
	if (!workspaceId) return;
	const preparedRepository = await getSessionRepositoryWorkspaceStore().prepare(workspaceId);
	const repository = preparedRepository.workspace;
	if (!repository || repository.agentId !== params.agentId || repository.sessionKey !== initial.canonicalKey || !repository.baseCommit) throw new Error("Repository workspace has no pinned source; retry its cloud preparation");
	const githubHost = resolveConfiguredGitHubHost(params.cfg);
	const remote = parseGitHubRemoteUrl(repository.url, githubHost);
	if (!remote) throw new Error(`Repository workspace does not match the configured GitHub host (${githubHost}); restore its GitHub configuration before retrying the Gateway move`);
	const branch = () => readRepositoryGitHubPublicationBranch({
		workspaceId,
		branch: repository.branch,
		pushRepository: `${remote.owner}/${remote.repo}`
	});
	const selected = branch();
	const published = selected.head;
	if (selected.unsettled) throw new Error("Repository publication is awaiting a GitHub effect observation; retry the Gateway move after publication settles");
	const assertCurrent = () => {
		params.signal?.throwIfAborted();
		params.assertCurrent();
		const currentBranch = branch();
		const current = loadGatewaySessionEntryReadOnly(params.sessionKey, { agentId: params.agentId });
		if (currentBranch.unsettled || currentBranch.head?.pushed_head_commit !== published?.pushed_head_commit || current.storePath !== initial.storePath || current.canonicalKey !== initial.canonicalKey || current.entry?.sessionId !== params.sessionId || current.entry.lifecycleRevision !== initial.entry?.lifecycleRevision || current.entry.repositoryWorkspaceId !== workspaceId || preparedRepository.current()?.revision !== repository.revision) throw new Error("Repository workspace changed during Gateway materialization; retry move");
	};
	assertCurrent();
	const github = await prepareWorkerGitHubBinding({
		sessionId: params.sessionId,
		sessionKey: initial.canonicalKey,
		agentId: params.agentId,
		assertCurrent: () => {
			assertCurrent();
			return true;
		}
	});
	assertCurrent();
	const project = await materializeProjectClone({
		cfg: params.cfg,
		gitUrl: repository.url,
		requiredCommit: published?.pushed_head_commit ?? repository.baseCommit
	}, {
		signal: params.signal,
		token: github?.token,
		assertCurrent
	}).catch((error) => {
		if (error instanceof ProjectCloneError && error.failure === "auth_required") throw new ProjectCloneError(error.failure, "GitHub could not authenticate this repository with the selected shared GitHub identity. Check its repository access or reconnect it in Settings, then retry the Gateway move.");
		throw error;
	});
	assertCurrent();
	const { step, require: command, run } = createGitHubPublicationCommandRunner(assertCurrent, "session.materialize");
	const cloneOptions = {
		signal: params.signal,
		token: github?.token,
		assertCurrent
	};
	const source = {
		url: repository.url,
		target: project.repoRoot
	};
	if (await step(() => readProjectCheckoutRemoteHead({
		...source,
		branch: repository.branch
	}, cloneOptions)) !== (published?.pushed_head_commit ?? void 0)) throw new Error("Repository publication branch differs from its recorded push; review the remote branch before retrying the Gateway move");
	const requestedBase = parseGitHubPublicationBaseBranch(repository.requestedRef ?? "HEAD", "HEAD");
	const baseRef = published?.base_branch ?? (requestedBase !== "HEAD" && await step(() => readProjectCheckoutRemoteHead({
		...source,
		branch: requestedBase
	}, cloneOptions)) ? requestedBase : "HEAD");
	if (published?.pushed_head_commit) {
		const head = published.pushed_head_commit;
		const [tree, parent, ...message] = (await command([
			"git",
			"show",
			"-s",
			"--format=%T%n%P%n%B",
			head
		], { cwd: project.repoRoot })).split("\n");
		if ((await run([
			"git",
			"merge-base",
			"--is-ancestor",
			repository.baseCommit,
			head
		], { cwd: project.repoRoot })).code !== 0 || tree !== published.workspace_tree || parent !== (published.previous_head_commit ?? repository.baseCommit) || !message.includes(`OpenClaw-Publication: ${published.request_id}`)) throw new Error("Recorded repository publication commit could not be verified; review publication before retrying the Gateway move");
	}
	const prepared = await prepareSessionWorktree({
		cfg: params.cfg,
		target: {
			agentId: params.agentId,
			key: initial.canonicalKey,
			storePath: initial.storePath,
			entry: initial.entry,
			projectId: project.id,
			sandboxRequired: initial.entry.sandbox === "required"
		},
		workspace: project.repoRoot,
		name: repository.workspaceId,
		baseRef,
		checkoutCommit: repository.baseCommit,
		runSetupScript: false,
		signal: params.signal,
		commitGuard: assertCurrent
	});
	if (!prepared.ok) throw new Error(prepared.error.message);
	const workspace = prepared.value;
	const root = workspace.spawnedCwd;
	if (!root || !workspace.worktree) throw new Error("Repository materialization did not create a managed worktree");
	const git = (args) => command([
		"git",
		"-c",
		`core.hooksPath=${os.devNull}`,
		"-c",
		"core.fsmonitor=false",
		...args
	], {
		cwd: root,
		env: {
			GIT_CONFIG_GLOBAL: gitNullConfigPath(),
			GIT_CONFIG_SYSTEM: gitNullConfigPath()
		}
	});
	const alignPublication = async () => {
		if (published?.pushed_head_commit) await git([
			"reset",
			"--mixed",
			"--no-refresh",
			published.pushed_head_commit
		]);
	};
	let bound = false;
	try {
		await step(() => assertSafeGitPublicationWorkspace(root, run));
		const currentHead = await git([
			"rev-parse",
			"--verify",
			"HEAD^{commit}"
		]);
		if (await git([
			"symbolic-ref",
			"--quiet",
			"HEAD"
		]) !== `refs/heads/${repository.branch}` || currentHead !== repository.baseCommit && currentHead !== published?.pushed_head_commit) throw new Error("Gateway worktree changed before repository restoration; review its local commits before retrying move");
		if (repository.checkpointRef) await withSessionRepositoryCheckpoint({
			workspaceId,
			includePublication: true
		}, async (snapshot) => {
			assertCurrent();
			const applied = await applyStagedWorkerWorkspace({
				...snapshot,
				acceptance: { kind: "reconcile" },
				root,
				journal: {
					load: async () => void 0,
					begin: async () => assertCurrent(),
					commit: async () => assertCurrent(),
					abort: async () => {}
				}
			});
			if (applied.conflictPaths.length || applied.manifestRef !== repository.manifestHash) throw new Error("Repository changes could not be fully restored; retry the Gateway move");
			await applied.verifyLocalStable();
			await alignPublication();
			for (const restore of await prepareRepositoryPublicationRestore({
				...snapshot,
				...published?.pushed_head_commit ? { indexBase: {
					root,
					commit: published.pushed_head_commit,
					assertCurrent
				} } : {}
			})) await command(restore.argv, {
				cwd: root,
				input: restore.input
			});
			await applied.verifyLocalStable();
			assertCurrent();
		});
		else await alignPublication();
		const bind = async (assertSourceCurrent) => await patchSessionEntryCore({
			agentId: params.agentId,
			sessionKey: initial.canonicalKey,
			storePath: initial.storePath
		}, (current) => {
			assertCurrent();
			assertSourceCurrent();
			return {
				...current,
				repositoryWorkspaceId: void 0,
				projectId: project.id,
				spawnedCwd: workspace.spawnedCwd,
				sessionRoot: workspace.sessionRoot,
				worktree: workspace.worktree
			};
		}, {
			replaceEntry: true,
			assertCommitAllowed: () => {
				assertCurrent();
				assertSourceCurrent();
			},
			requireWriteSuccess: true,
			skipMaintenance: true,
			onCommitted: () => {
				bound = true;
			}
		});
		if (!(workspace.withCommit ? await workspace.withCommit(bind) : await bind(() => {}))) throw new Error("Session disappeared before repository materialization committed");
	} finally {
		if (!bound) await workspace.rollback?.();
	}
}
//#endregion
//#region src/gateway/worker-environments/node-workspace-retain-coordinator.ts
const RETAIN_COMMAND_TIMEOUT_MS = 6e5;
function nodeEnvironments(options, nodeId) {
	return options.environments.list().filter((environment) => environment.nodeDeviceId === nodeId);
}
function bundleStatusTargetForNode(options, nodeId) {
	return nodeEnvironments(options, nodeId).filter((environment) => environment.bootstrapReceipt !== null && !isTerminalWorkerEnvironmentState(environment.state)).toSorted((left, right) => right.createdAtMs - left.createdAtMs || left.environmentId.localeCompare(right.environmentId))[0]?.bootstrapReceipt;
}
function snapshotBundleHashesForNode(options, environments) {
	const environmentIds = new Set(environments.map((environment) => environment.environmentId));
	return listRetainedWorkerBundleHashes({
		environments,
		placements: options.placements.list().filter((placement) => placement.environmentId !== null && environmentIds.has(placement.environmentId))
	});
}
function snapshotEntriesForNode(options, nodeId, preparedManifestRefs, preparedPlacements) {
	const placements = new Map(options.placements.list().map((placement) => [placement.sessionId, placement]));
	return nodeEnvironments(options, nodeId).flatMap((environment) => {
		if (isTerminalWorkerEnvironmentState(environment.state) || environment.attachedSessionIds.length !== 1) return [];
		const sessionId = environment.attachedSessionIds[0];
		const placement = placements.get(sessionId);
		const facts = preparedPlacements.get(sessionId);
		const pending = facts?.pendingResult;
		let factsCurrent = false;
		if (facts) try {
			facts.assertCurrent();
			factsCurrent = isDeepStrictEqual(facts.placement, placement);
		} catch {}
		const unsettled = !factsCurrent || placement?.turnClaim || pending?.environmentId === environment.environmentId && pending.ownerEpoch === environment.ownerEpoch;
		const hasExactManifestOwner = placement?.state === "starting" || placement?.state === "active" || placement?.state === "draining" || placement?.state === "reconciling";
		const prepared = preparedManifestRefs.get(sessionId);
		const additionalManifestRefs = () => {
			if (!options.additionalManifestRefs) return [];
			if (!prepared || !isDeepStrictEqual(prepared.placement, placement)) return null;
			return prepared.current();
		};
		const additional = hasExactManifestOwner && !unsettled && placement.environmentId === environment.environmentId && placement.workspaceBaseManifestRef && (placement.activeOwnerEpoch === environment.ownerEpoch || placement.state === "starting") ? additionalManifestRefs() : null;
		const exactManifest = additional !== null && placement?.workspaceBaseManifestRef ? [.../* @__PURE__ */ new Set([placement.workspaceBaseManifestRef, ...additional])].toSorted() : null;
		return [{
			environmentId: environment.environmentId,
			sessionId,
			generation: environment.ownerEpoch,
			manifestRefs: exactManifest
		}];
	}).toSorted((left, right) => left.environmentId.localeCompare(right.environmentId) || left.sessionId.localeCompare(right.sessionId) || left.generation - right.generation);
}
function createNodeWorkspaceRetainCoordinator(options) {
	const controllerId = randomUUID();
	const abortController = new AbortController();
	const pendingNodes = /* @__PURE__ */ new Set();
	const acknowledgedBundleGenerationByNode = /* @__PURE__ */ new Map();
	let transport;
	let sequence = 0;
	let pendingAll = false;
	const operations = /* @__PURE__ */ new Map();
	let started = false;
	let stopped = false;
	const publishPreparedSnapshot = async (currentTransport, node, preparedPlacements) => {
		const bundleRetention = options.bundleRetention;
		const bundleRetentionSupported = node.workerHost.bundleRetention === 1;
		let bundlePreparationError;
		const currentBuild = bundleRetentionSupported && bundleRetention ? await bundleRetention.currentBuild().catch((error) => {
			bundlePreparationError = error instanceof Error ? error.message : String(error);
		}) : void 0;
		const hostBuild = bundleRetention && !bundleRetention.isEnvironmentOwnedNode(node.nodeId) ? currentBuild : void 0;
		const isCurrent = () => !stopped && transport === currentTransport && currentTransport.isCurrent(node) && (!hostBuild || !bundleRetention.isEnvironmentOwnedNode(node.nodeId));
		if (!isCurrent()) return;
		const preparedManifestRefs = /* @__PURE__ */ new Map();
		if (options.additionalManifestRefs) {
			const environmentIds = new Set(nodeEnvironments(options, node.nodeId).map((environment) => environment.environmentId));
			for (const placement of options.placements.list()) if (placement.environmentId && environmentIds.has(placement.environmentId)) {
				const captured = { ...placement };
				const current = await options.additionalManifestRefs(placement);
				if (!isCurrent()) return;
				preparedManifestRefs.set(placement.sessionId, {
					placement: captured,
					current
				});
			}
		}
		const environments = nodeEnvironments(options, node.nodeId);
		const retainCurrentBuild = currentBuild && (hostBuild || environments.some((environment) => !isTerminalWorkerEnvironmentState(environment.state) && environment.bootstrapReceipt?.bundleHash !== currentBuild.bundleHash));
		const retainedBundleHashes = [.../* @__PURE__ */ new Set([...snapshotBundleHashesForNode(options, environments), ...retainCurrentBuild ? [currentBuild.bundleHash] : []])].toSorted();
		const bundleStatusSupported = node.workerHost.bundleStatus === 1;
		const baseInput = {
			version: 1,
			gatewayNamespace: options.gatewayNamespace,
			controllerId,
			sequence: sequence += 1,
			retain: snapshotEntriesForNode(options, node.nodeId, preparedManifestRefs, preparedPlacements)
		};
		const priorGeneration = acknowledgedBundleGenerationByNode.get(node.nodeId);
		const acknowledgedBundleGeneration = priorGeneration?.connId === node.connId ? priorGeneration.generation : void 0;
		const retentionInput = {
			...baseInput,
			bundleHashes: retainedBundleHashes,
			...acknowledgedBundleGeneration !== void 0 ? { acknowledgedBundleGeneration } : {}
		};
		const bundleHashesFit = retainedBundleHashes.length <= 4096 && Buffer.byteLength(JSON.stringify(retentionInput), "utf8") <= 1048576;
		const bundleStatusTarget = bundleStatusSupported ? hostBuild ?? bundleStatusTargetForNode(options, node.nodeId) : void 0;
		const statusInput = bundleStatusTarget && retainedBundleHashes.includes(bundleStatusTarget.bundleHash) ? {
			...retentionInput,
			bundleStatusHash: bundleStatusTarget.bundleHash
		} : void 0;
		const statusInputFits = statusInput !== void 0 && Buffer.byteLength(JSON.stringify(statusInput), "utf8") <= 1048576;
		const input = bundleRetentionSupported && bundlePreparationError === void 0 && bundleHashesFit ? statusInput && statusInputFits ? statusInput : retentionInput : baseInput;
		const previousBundleStatus = currentTransport.getBundleStatus?.(node.nodeId);
		if (!input.bundleStatusHash || previousBundleStatus && previousBundleStatus.bundleHash !== input.bundleStatusHash) currentTransport.acceptBundleStatus?.(node, void 0);
		if (bundlePreparationError !== void 0) options.warn(`Node bundle retention skipped (${node.nodeId}): ${bundlePreparationError}`);
		else if (bundleRetentionSupported && !bundleHashesFit) options.warn(`Node bundle retention skipped (${node.nodeId}): ${retainedBundleHashes.length} retained hashes exceed the bounded maintenance request`);
		for (;;) {
			const isDispatchAuthorized = () => isCurrent() && isDeepStrictEqual(input.retain, snapshotEntriesForNode(options, node.nodeId, preparedManifestRefs, preparedPlacements));
			if (!isDispatchAuthorized()) {
				currentTransport.acceptBundleStatus?.(node, void 0);
				return;
			}
			const result = await currentTransport.invoke({
				node,
				command: NODE_WORKER_WORKSPACE_RETAIN_COMMAND,
				params: input,
				timeoutMs: RETAIN_COMMAND_TIMEOUT_MS,
				signal: abortController.signal,
				isDispatchAuthorized
			});
			if (!isCurrent()) return;
			if (!result.ok) throw new Error(result.error?.message ?? `workspace retain command failed (${result.error?.code ?? "unknown"})`);
			let payload;
			try {
				payload = result.payloadJSON ? JSON.parse(result.payloadJSON) : void 0;
			} catch {
				throw new Error("workspace retain command returned malformed JSON");
			}
			const retained = parseNodeWorkerWorkspaceRetainResult(payload);
			if (!retained) throw new Error("workspace retain command violated its private result contract");
			if (retained.applied && retained.bundleGeneration !== void 0) acknowledgedBundleGenerationByNode.set(node.nodeId, {
				connId: node.connId,
				generation: retained.bundleGeneration
			});
			if (!retained.applied || !retained.hasMore) {
				const bundleStatus = retained.bundleStatus;
				const requestedBundleHash = input.bundleStatusHash;
				const currentStatusTarget = requestedBundleHash ? hostBuild ?? bundleStatusTargetForNode(options, node.nodeId) : void 0;
				if (retained.applied && currentStatusTarget && bundleStatus && currentStatusTarget.bundleHash === requestedBundleHash && bundleStatus.bundleHash === requestedBundleHash) currentTransport.acceptBundleStatus?.(node, {
					bundleHash: currentStatusTarget.bundleHash,
					status: bundleStatus.status === "installed" ? {
						status: "installed",
						version: currentStatusTarget.openclawVersion
					} : { status: "missing" }
				});
				else if (input.bundleStatusHash) currentTransport.acceptBundleStatus?.(node, void 0);
				return;
			}
		}
	};
	const publishSnapshot = async (currentTransport, node) => {
		const prepared = /* @__PURE__ */ new Map();
		try {
			const sessionIds = new Set(nodeEnvironments(options, node.nodeId).flatMap((environment) => !isTerminalWorkerEnvironmentState(environment.state) && environment.attachedSessionIds.length === 1 ? environment.attachedSessionIds : []));
			for (const sessionId of sessionIds) {
				prepared.set(sessionId, await options.placements.prepareRuntimeRefresh(sessionId));
				if (stopped || transport !== currentTransport || !currentTransport.isCurrent(node)) return;
			}
			await publishPreparedSnapshot(currentTransport, node, prepared);
		} finally {
			for (const facts of prepared.values()) facts.release();
		}
	};
	const schedule = (nodeId) => {
		if (stopped) return Promise.resolve();
		if (nodeId) pendingNodes.add(nodeId);
		else pendingAll = true;
		if (!started || !transport) return Promise.resolve();
		const previous = operations.get(nodeId);
		if (previous) return previous;
		const run = async () => {
			do {
				if (nodeId) pendingNodes.delete(nodeId);
				else pendingAll = false;
				const currentTransport = transport;
				if (!currentTransport || stopped) return;
				try {
					const nodes = await currentTransport.listCurrentNodes();
					if (stopped || transport !== currentTransport) continue;
					if (nodeId) {
						const node = nodes.find((candidate) => candidate.nodeId === nodeId);
						if (node && currentTransport.isCurrent(node)) await publishSnapshot(currentTransport, node);
					} else await Promise.all(nodes.map((node) => schedule(node.nodeId)));
				} catch (error) {
					options.warn(`Node workspace retain publication failed (${nodeId ?? "inventory"}): ${error instanceof Error ? error.message : String(error)}`);
				}
			} while (nodeId ? pendingNodes.has(nodeId) : pendingAll);
		};
		const operation = run().finally(() => {
			operations.delete(nodeId);
			if (!stopped && (nodeId ? pendingNodes.has(nodeId) : pendingAll)) schedule(nodeId);
		});
		operations.set(nodeId, operation);
		return operation;
	};
	return {
		bindTransport(next) {
			transport = next;
			if (started) schedule();
		},
		start() {
			started = true;
			const targets = pendingAll ? [void 0] : [...pendingNodes];
			pendingAll = false;
			pendingNodes.clear();
			return Promise.all((targets.length ? targets : [void 0]).map(schedule)).then(() => void 0);
		},
		schedule,
		async stop() {
			stopped = true;
			started = false;
			abortController.abort(/* @__PURE__ */ new Error("node workspace retention stopped"));
			pendingAll = false;
			pendingNodes.clear();
			await Promise.all(operations.values());
		}
	};
}
//#endregion
//#region src/gateway/worker-environments/placement-disk-space.ts
const MIB = 1048576;
const GIB = 1024 * MIB;
const DISK_SPACE_PROBE_CONCURRENCY = 8;
const DISK_SPACE_PROBE_TIMEOUT_MS = 3e4;
const REMOTE_DISK_SPACE_PROBE_JS = String.raw`
const fs = require("node:fs");
fs.statfs(process.argv[1], { bigint: true }, (error, stats) => {
  if (error) throw error;
  process.stdout.write(JSON.stringify({
    availableBytes: String(stats.bavail * stats.bsize),
    totalBytes: String(stats.blocks * stats.bsize),
  }));
});
`.trim();
function hasExactBinding(observation, placement) {
	return placement?.state === "active" && placement.sessionId === observation.sessionId && placement.generation === observation.generation && placement.environmentId === observation.environmentId && placement.activeOwnerEpoch === observation.activeOwnerEpoch;
}
function parseSafeByteCount(value, field) {
	if (typeof value !== "string" || !/^(?:0|[1-9]\d*)$/u.test(value)) throw new Error(`Worker disk-space probe returned an invalid ${field}`);
	const parsed = BigInt(value);
	if (parsed > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error(`Worker disk-space probe ${field} exceeds the protocol limit`);
	return Number(parsed);
}
function classifyDiskSpace(availableBytes, totalBytes) {
	const available = BigInt(availableBytes);
	const total = BigInt(totalBytes);
	const used = total - available;
	if (availableBytes < 100 * MIB || total > 0n && used * 100n >= total * 98n && availableBytes < GIB) return "critical";
	if (availableBytes < 500 * MIB || total > 0n && used * 100n >= total * 95n && availableBytes < 5 * GIB) return "warning";
	return "ok";
}
function parseDiskSpaceProbe(stdout, observedAtMs) {
	let value;
	try {
		value = JSON.parse(stdout);
	} catch {
		throw new Error("Worker disk-space probe returned invalid JSON");
	}
	if (!isRecord(value)) throw new Error("Worker disk-space probe returned an invalid result");
	const availableBytes = parseSafeByteCount(value.availableBytes, "available byte count");
	const totalBytes = parseSafeByteCount(value.totalBytes, "total byte count");
	if (availableBytes > totalBytes) throw new Error("Worker disk-space probe returned more available bytes than total bytes");
	return {
		status: classifyDiskSpace(availableBytes, totalBytes),
		availableBytes,
		totalBytes,
		observedAtMs
	};
}
function createWorkerPlacementDiskSpaceMonitor(params) {
	const observations = /* @__PURE__ */ new Map();
	const staleBindings = /* @__PURE__ */ new Map();
	const now = params.now ?? Date.now;
	let observationVersion = 0;
	const read = (placement) => {
		const observation = observations.get(placement.sessionId);
		return observation && hasExactBinding(observation, placement) ? observation.snapshot : void 0;
	};
	const probe = async (placement) => {
		const stale = staleBindings.get(placement.sessionId);
		if (stale && hasExactBinding(stale, placement)) return;
		if (params.runnerAvailability.read(placement)?.status === "offline") return;
		const result = await (await params.environments.startTunnel({
			environmentId: placement.environmentId,
			ownerEpoch: placement.activeOwnerEpoch
		})).runWorkspaceCommand({
			transportRetry: "idempotent",
			argv: [
				"node",
				"-e",
				REMOTE_DISK_SPACE_PROBE_JS,
				placement.remoteWorkspaceDir
			],
			timeoutMs: DISK_SPACE_PROBE_TIMEOUT_MS
		});
		if (result.termination !== "exit" || result.code !== 0) throw new Error("Worker disk-space probe command failed");
		const snapshot = parseDiskSpaceProbe(result.stdout, Math.max(0, Math.min(Number.MAX_SAFE_INTEGER, Math.floor(now()))));
		const current = params.placements.get(placement.sessionId);
		const candidate = {
			...placement,
			snapshot
		};
		if (!hasExactBinding(candidate, current)) return;
		const previous = read(current);
		observations.set(placement.sessionId, candidate);
		if (!previous || previous.availableBytes !== snapshot.availableBytes || previous.totalBytes !== snapshot.totalBytes || previous.observedAtMs !== snapshot.observedAtMs) observationVersion += 1;
		if (previous?.status !== snapshot.status && (previous || snapshot.status !== "ok")) emitSessionLifecycleEvent({
			sessionKey: placement.sessionKey,
			agentId: placement.agentId,
			reason: "worker-disk-space"
		});
	};
	const sweep = async () => {
		const identities = await params.placements.readChangeSnapshot();
		const projection = await params.placements.readProjection(identities.map(({ sessionId }) => sessionId), { current: true });
		const active = identities.map(({ sessionId }) => projection.placements.get(sessionId)).filter((placement) => placement?.state === "active");
		for (const [sessionId, observation] of observations) if (!hasExactBinding(observation, params.placements.get(sessionId))) {
			observations.delete(sessionId);
			observationVersion += 1;
		}
		for (const [sessionId, binding] of staleBindings) if (!hasExactBinding(binding, params.placements.get(sessionId))) staleBindings.delete(sessionId);
		const tasks = active.map((placement) => () => probe(placement));
		await runTasksWithConcurrency({
			tasks,
			limit: DISK_SPACE_PROBE_CONCURRENCY,
			onTaskError: (error, index) => {
				const placement = active[index];
				if (placement && error instanceof StaleWorkerBuildError) staleBindings.set(placement.sessionId, { ...placement });
				params.warn(`Worker disk-space probe failed${placement ? ` (${placement.sessionId})` : ""}: ${formatErrorMessage(error)}`);
			}
		});
	};
	return {
		read,
		sweep,
		version: () => observationVersion
	};
}
//#endregion
//#region src/gateway/worker-environments/placement-dispatch-coordinator.ts
function trackPlacementOperation(run, onTransition) {
	let current;
	let completed;
	const record = (placement) => {
		current = {
			state: placement.state,
			generation: placement.generation,
			environmentId: placement.environmentId,
			activeOwnerEpoch: placement.activeOwnerEpoch
		};
	};
	return {
		superseded: new AbortController(),
		currentPlacement: () => current,
		completedPlacement: () => completed,
		operation: run((placement) => {
			record(placement);
			onTransition?.({ ...placement });
		}).then((placement) => {
			if (placement) {
				record(placement);
				completed = current;
			}
			return placement;
		})
	};
}
/** Orders placement work per session and deduplicates exact lifecycle requests. */
function coordinateWorkerPlacementDispatch(service, admitDispatch, recoverInitialPlacement, reportReconciliation) {
	const sessionTails = /* @__PURE__ */ new Map();
	const claimWaits = /* @__PURE__ */ new Map();
	const pendingTargetedRecoveries = /* @__PURE__ */ new Map();
	const lendRecovery = (loan, run) => {
		const recovery = loan.settled.then(() => run("results-only"));
		loan.settled = recovery.then(() => void 0, () => void 0);
		return recovery;
	};
	const reserveSessions = (sessionIds) => {
		const keys = [...new Set(sessionIds)];
		const ready = Promise.all(keys.map((key) => sessionTails.get(key) ?? Promise.resolve())).then(() => void 0);
		const settled = createDeferredCore();
		const tail = ready.then(() => settled.promise);
		for (const key of keys) sessionTails.set(key, tail);
		tail.then(() => {
			for (const key of keys) if (sessionTails.get(key) === tail) sessionTails.delete(key);
		});
		return {
			ready,
			hold(operation) {
				operation.then(() => settled.resolve(), () => settled.resolve());
				return operation;
			}
		};
	};
	const recoveryAdmission = (wait) => async (sessionIds, run) => {
		const targetedSession = wait && sessionIds.length === 1 ? sessionIds[0] : void 0;
		const claimWait = targetedSession === void 0 ? void 0 : claimWaits.get(targetedSession);
		if (claimWait) {
			await lendRecovery(claimWait, run);
			return true;
		}
		if (!wait && sessionIds.some((key) => sessionTails.has(key) || operationsInFlight.has(key))) return false;
		const admission = reserveSessions(sessionIds);
		if (targetedSession !== void 0) {
			const completion = createDeferredCore();
			const pending = pendingTargetedRecoveries.get(targetedSession) ?? /* @__PURE__ */ new Set();
			let started = false;
			const start = (loan) => {
				if (started) return;
				started = true;
				pending.delete(start);
				if (pending.size === 0) pendingTargetedRecoveries.delete(targetedSession);
				(loan ? lendRecovery(loan, run) : Promise.resolve().then(() => run())).then(completion.resolve, completion.reject);
			};
			pending.add(start);
			pendingTargetedRecoveries.set(targetedSession, pending);
			admission.ready.then(() => start());
			await admission.hold(completion.promise);
			return true;
		}
		await admission.hold((async () => {
			await admission.ready;
			await run();
		})());
		return true;
	};
	const tryRecovery = recoveryAdmission(false);
	const waitRecovery = recoveryAdmission(true);
	let fullSweep;
	const runReconciliation = (operation, full = true) => {
		if (full && fullSweep) return fullSweep;
		const current = reportReconciliation ? reportReconciliation(operation) : operation();
		if (full) {
			fullSweep = current;
			const release = () => {
				if (fullSweep === current) fullSweep = void 0;
			};
			current.then(release, release);
		}
		return current;
	};
	const operationsInFlight = /* @__PURE__ */ new Map();
	const setupWaiters = /* @__PURE__ */ new Map();
	const pendingOperations = (sessionId) => [...operationsInFlight.get(sessionId) ?? []];
	const registerOperation = (record) => {
		const pending = operationsInFlight.get(record.request.sessionId) ?? /* @__PURE__ */ new Set();
		for (const predecessor of pending) predecessor.superseded.abort(/* @__PURE__ */ new Error("Worker setup was superseded by another placement operation"));
		pending.add(record);
		operationsInFlight.set(record.request.sessionId, pending);
		for (const observe of setupWaiters.get(record.request.sessionId) ?? []) observe(record);
		const release = () => {
			pending.delete(record);
			if (pending.size === 0) operationsInFlight.delete(record.request.sessionId);
		};
		record.operation.then(release, release);
	};
	const joinOperation = async (operation, authorize) => {
		authorize?.();
		const result = await operation;
		authorize?.();
		return result;
	};
	const runSessionOperation = (sessionId, signal, run) => {
		signal?.throwIfAborted();
		const admission = reserveSessions([sessionId]);
		return admission.hold((async () => {
			await racePromiseWithAbortSignal(admission.ready, signal);
			signal?.throwIfAborted();
			return await run();
		})());
	};
	return {
		async awaitTurnClaimRelease(sessionId, wait) {
			const claimWait = { settled: Promise.resolve() };
			claimWaits.set(sessionId, claimWait);
			try {
				for (const start of pendingTargetedRecoveries.get(sessionId) ?? []) start(claimWait);
				await wait();
			} finally {
				claimWaits.delete(sessionId);
				await claimWait.settled;
			}
		},
		isPlacementOperationInFlight: (sessionId) => operationsInFlight.has(sessionId),
		hasPendingPlacementLifecycleOperation: (sessionId) => pendingOperations(sessionId).some((operation) => operation.kind !== "recovery"),
		getPendingDeviceDispatchCount(deviceId, excludeSessionId) {
			let count = 0;
			for (const [sessionId, operations] of operationsInFlight) {
				if (sessionId === excludeSessionId) continue;
				for (const operation of operations) if (operation.kind === "dispatch" && operation.request.executionMode === "worker-turn" && operation.request.deviceId === deviceId) count += 1;
			}
			return count;
		},
		async waitForInitialPlacement(placement, signal) {
			signal?.throwIfAborted();
			const pending = pendingOperations(placement.sessionId);
			const matchesOwner = (owner) => (owner.kind === "dispatch" || owner.kind === "recovery") && owner.request.sessionKey === placement.sessionKey && owner.request.agentId === placement.agentId && matchesWorkerPlacementTarget(owner.currentPlacement() ?? (owner.kind === "recovery" ? owner.request : void 0), placement);
			const missingOwner = () => /* @__PURE__ */ new Error("Worker setup has no matching live dispatch owner. Wait for recovery or explicitly retry setup.");
			const initialOwner = pending.length === 1 ? pending[0] : void 0;
			const recover = recoverInitialPlacement && placement.state === "provisioning" && placement.environmentId ? () => recoverInitialPlacement(placement) : void 0;
			if (pending.length ? !initialOwner || !matchesOwner(initialOwner) : !recover) throw missingOwner();
			const superseded = new AbortController();
			let recoveryFailure;
			const waitSignal = signal ? AbortSignal.any([signal, superseded.signal]) : superseded.signal;
			let nextOwner = createDeferredCore();
			const observe = (owner) => {
				if (pendingOperations(placement.sessionId).length !== 1 || !matchesOwner(owner)) superseded.abort(missingOwner());
				else nextOwner.resolve(owner);
			};
			const waiters = setupWaiters.get(placement.sessionId) ?? /* @__PURE__ */ new Set();
			waiters.add(observe);
			setupWaiters.set(placement.sessionId, waiters);
			try {
				if (initialOwner) nextOwner.resolve(initialOwner);
				else if (recover) recover().catch((error) => {
					recoveryFailure = { error };
					superseded.abort(error);
				});
				for (;;) {
					const owner = await racePromiseWithAbortSignal(nextOwner.promise, waitSignal);
					nextOwner = createDeferredCore();
					const ownerSignal = AbortSignal.any([waitSignal, owner.superseded.signal]);
					const completed = await racePromiseWithAbortSignal(owner.operation, ownerSignal);
					ownerSignal.throwIfAborted();
					if (completed && matchesWorkerPlacementTarget(owner.completedPlacement(), completed)) return completed;
					if (!completed && recover && owner.kind === "recovery" && matchesWorkerPlacementTarget(owner.currentPlacement(), placement)) continue;
					throw new Error("Worker setup did not publish a ready placement. Inspect the setup recovery error.");
				}
			} catch (error) {
				throw recoveryFailure ? recoveryFailure.error : error;
			} finally {
				waiters.delete(observe);
				if (waiters.size === 0) setupWaiters.delete(placement.sessionId);
			}
		},
		dispatch: async (request, onTransition, authorize, callerSignal) => {
			callerSignal?.throwIfAborted();
			const inFlight = pendingOperations(request.sessionId).find((pending) => pending.kind === "dispatch");
			if (inFlight) {
				if (!isDeepStrictEqual(inFlight.request, request)) throw new Error(`Session ${request.sessionKey} is already dispatching another request`);
				return await racePromiseWithAbortSignal(joinOperation(inFlight.operation, authorize), callerSignal);
			}
			const predecessors = pendingOperations(request.sessionId).filter((pending) => pending.kind === "reclaim");
			const tracked = trackPlacementOperation(async (report) => {
				await racePromiseWithAbortSignal(Promise.allSettled(predecessors.map((pending) => pending.operation)), callerSignal);
				return await admitDispatch(request, (signal) => runSessionOperation(request.sessionId, signal, () => service.dispatch(request, report, authorize, signal)), authorize, callerSignal);
			}, onTransition);
			const { operation } = tracked;
			registerOperation({
				kind: "dispatch",
				request,
				...tracked
			});
			return await operation;
		},
		forceDestroyEnvironment: async (environmentId, onCleanupError) => {
			const knownSessionIds = new Set(service.getEnvironmentAttachedSessionIds(environmentId));
			for (const [sessionId, operations] of operationsInFlight) if ([...operations].some((operation) => operation.currentPlacement()?.environmentId === environmentId)) knownSessionIds.add(sessionId);
			const admission = reserveSessions([...knownSessionIds]);
			return await admission.hold((async () => {
				const sessionIds = await service.readEnvironmentSessionIds(environmentId);
				return await reserveSessions(sessionIds.filter((sessionId) => !knownSessionIds.has(sessionId) && !sessionTails.has(sessionId) && !operationsInFlight.has(sessionId))).hold((async () => {
					await admission.ready;
					return await service.forceDestroyEnvironment(environmentId, onCleanupError);
				})());
			})());
		},
		move: async (request, onTransition, authorize) => {
			const inFlight = pendingOperations(request.sessionId).find((pending) => pending.kind === "move");
			if (inFlight) {
				if (!isDeepStrictEqual(inFlight.request, request)) throw new Error(`Session ${request.sessionKey} is already moving to another target`);
				return await joinOperation(inFlight.operation, authorize);
			}
			const predecessors = pendingOperations(request.sessionId).filter((pending) => pending.kind === "reclaim");
			const tracked = trackPlacementOperation(async (report) => {
				await Promise.allSettled(predecessors.map((pending) => pending.operation));
				return await admitDispatch(request, (signal) => runSessionOperation(request.sessionId, signal, () => service.move(request, report, authorize, signal)), authorize);
			}, onTransition);
			const { operation } = tracked;
			registerOperation({
				kind: "move",
				request,
				...tracked
			});
			return await operation;
		},
		reclaim: async (request, authorize, beforeDrain) => {
			const operations = pendingOperations(request.sessionId).filter((operation) => operation.request.sessionKey === request.sessionKey && operation.request.agentId === request.agentId);
			const hasPendingDispatch = () => operations.some((operation) => operation.kind !== "reclaim" && operationsInFlight.get(request.sessionId)?.has(operation));
			const isPending = () => operations.some((operation) => operationsInFlight.get(request.sessionId)?.has(operation));
			const latestPlacement = (read) => operations.reduce((latest, pending) => {
				const current = pending[read]();
				return current && (!latest || current.generation > latest.generation) ? current : latest;
			}, void 0);
			const tracked = trackPlacementOperation((report) => service.reclaim(request, authorize, beforeDrain, (run) => runSessionOperation(request.sessionId, void 0, run), operations.length ? {
				isCurrent: isPending,
				hasPendingDispatch,
				currentPlacement: () => latestPlacement("currentPlacement"),
				completedPlacement: () => latestPlacement("completedPlacement"),
				settled: Promise.allSettled(operations.map((pending) => pending.operation))
			} : void 0, report));
			const { operation } = tracked;
			registerOperation({
				kind: "reclaim",
				request,
				...tracked
			});
			return await operation;
		},
		getEnvironmentAttachedSessionIds: (environmentId) => service.getEnvironmentAttachedSessionIds(environmentId),
		readEnvironmentSessionIds: (environmentId) => service.readEnvironmentSessionIds(environmentId),
		reconcile: (mode) => runReconciliation(() => service.reconcile(mode, tryRecovery)),
		reconcileActive: (environmentId) => environmentId === void 0 ? runReconciliation(() => service.reconcileActive(void 0, tryRecovery)) : runReconciliation(() => service.reconcileActive(environmentId, waitRecovery), false),
		resumeProvisioning: (placement, reconcileEnvironmentCore) => {
			const inFlight = pendingOperations(placement.sessionId).find((pending) => pending.kind === "recovery" && isDeepStrictEqual(pending.request, placement));
			if (inFlight?.kind === "recovery") return inFlight.foreground;
			const admission = reserveSessions([placement.sessionId]);
			const foreground = createDeferredCore();
			let providerSettlement = Promise.resolve();
			let providerPending = false;
			const tracked = trackPlacementOperation(async (report) => {
				await admission.ready;
				return await service.resumeProvisioning(placement, async (signal) => {
					await reconcileEnvironmentCore(signal, (settled) => {
						providerSettlement = settled;
						providerPending = true;
						const markSettled = () => {
							if (providerSettlement === settled) providerPending = false;
						};
						settled.then(markSettled, markSettled);
					});
				}, report, (runRecovery) => admitDispatch(placement, async (signal) => {
					try {
						signal?.throwIfAborted();
						const recovered = await runRecovery(signal);
						if (providerPending) foreground.resolve(recovered);
						return recovered;
					} catch (error) {
						if (providerPending) foreground.reject(error);
						throw error;
					} finally {
						await providerSettlement;
					}
				}));
			});
			admission.hold(tracked.operation);
			registerOperation({
				kind: "recovery",
				request: placement,
				...tracked,
				foreground: foreground.promise
			});
			tracked.operation.then(foreground.resolve, foreground.reject);
			return foreground.promise;
		}
	};
}
//#endregion
//#region src/gateway/worker-environments/placement-dispatch-orphan-cleanup.ts
async function cleanupPendingWorkspaceResultOrphans(deps, admit, pass) {
	if (getActiveGatewayRootWorkCount({ excludeCurrent: true }) > 0) return false;
	const { placements } = deps;
	const { completedRoots, rootsBySession } = pass;
	const workspaceSessions = /* @__PURE__ */ new Map();
	for (const placement of await placements.readChangeSnapshot()) {
		let root = rootsBySession.get(placement.sessionId);
		if (root === void 0) try {
			const workspace = await deps.resolveWorkspace(placement);
			root = workspace.kind === "repository" ? null : workspace.path;
			rootsBySession.set(placement.sessionId, root);
		} catch {
			continue;
		}
		if (root === null) continue;
		const sessionIds = workspaceSessions.get(root) ?? [];
		sessionIds.push(placement.sessionId);
		workspaceSessions.set(root, sessionIds);
	}
	let complete = true;
	let remaining = 8;
	for (const [root, sessionIds] of workspaceSessions) {
		if (completedRoots.has(root)) continue;
		if (remaining === 0 || getActiveGatewayRootWorkCount({ excludeCurrent: true }) > 0) return false;
		const idleAdmission = tryBeginGatewayRootWorkAdmission("idle-task");
		if (!idleAdmission) return false;
		try {
			let deferred = false;
			complete = await idleAdmission.run(() => admit(sessionIds, async () => {
				if (getActiveGatewayRootWorkCount({ excludeCurrent: true }) > 0) {
					deferred = true;
					return;
				}
				remaining -= 1;
				await withGitProcessOperation("workspace.result-cleanup", () => deleteWorkerWorkspaceResultCleanupRefs({
					root,
					retainedRefs: async () => {
						const candidates = await placements.readRecoveryCandidates();
						const facts = await placements.readProjection(candidates.map(({ sessionId }) => sessionId), { current: true });
						return new Set([...facts.pendingResults.values()].flatMap((pending) => pending.stagedResultRef ? [cleanupWorkerWorkspaceResultRef(pending.stagedResultRef)] : []));
					}
				}));
				completedRoots.add(root);
			})) && !deferred && complete;
		} catch {
			completedRoots.add(root);
		} finally {
			idleAdmission.release();
		}
	}
	return complete;
}
//#endregion
//#region src/gateway/worker-environments/placement-teardown.ts
function completeRecoveredWorkspaceTeardown(params) {
	const move = params.placements.getPlacementMove(params.placement.sessionId);
	const owner = {
		placements: params.placements,
		turnClaim: params.turnClaim,
		environmentId: params.placement.environmentId,
		ownerEpoch: params.placement.activeOwnerEpoch
	};
	return move ? completeMovedWorkspaceTeardown({
		...owner,
		operationId: move.operationId
	}) : completeReclaimedWorkspaceTeardown(owner);
}
/** Close the workspace-result fence, then advance the exact drained owner into reconciliation. */
async function startDrainedWorkspaceReconciliation(params) {
	const drained = await params.placements.completeWorkspaceResultAndReleaseTurn(params.turnClaim);
	if (drained.state !== "draining" || drained.environmentId !== params.environmentId || drained.activeOwnerEpoch !== params.ownerEpoch) throw new Error(`Session ${params.turnClaim.sessionId} lost its drained placement owner`);
	const reconciling = await params.placements.startReconcile({
		sessionId: drained.sessionId,
		environmentId: params.environmentId,
		ownerEpoch: params.ownerEpoch,
		expectedGeneration: drained.generation
	});
	if (reconciling.state !== "reconciling") throw new Error(`Session ${params.turnClaim.sessionId} did not enter reconciliation`);
	return reconciling;
}
async function completeMovedWorkspaceTeardown(params) {
	const reconciling = await startDrainedWorkspaceReconciliation(params);
	const completed = params.placements.completePlacementMoveSourceToLocal({
		operationId: params.operationId,
		sessionId: reconciling.sessionId,
		expectedGeneration: reconciling.generation
	});
	if (completed.state !== "local") throw new Error(`Session ${params.turnClaim.sessionId} move did not finish local`);
	return completed;
}
async function completeReclaimedWorkspaceTeardown(params) {
	const reconciling = await startDrainedWorkspaceReconciliation(params);
	const completed = await params.placements.transition({
		sessionId: reconciling.sessionId,
		from: "reconciling",
		to: "reclaimed",
		expectedGeneration: reconciling.generation
	});
	if (completed.state !== "reclaimed") throw new Error(`Session ${params.turnClaim.sessionId} teardown did not finish reclaimed`);
	return completed;
}
//#endregion
//#region src/gateway/worker-environments/placement-dispatch-pending-results.ts
const log$1 = createSubsystemLogger("gateway/worker-placement");
async function resolvePriorWorkspaceResultConflict(resolve, placement) {
	if (placement.workspaceResultConflict) return placement.workspaceResultConflict;
	const lookup = await resolve();
	if (lookup.kind === "conflict") return lookup.conflict;
	if (lookup.kind === "unknown") log$1.warn(`Cloud workspace conflict state unknown sessionId=${boundedWorkerError(placement.sessionId, 128)} reason=${lookup.reason}; preserving prior conflict state`);
}
async function prepareAcceptedPublication(deps, claim) {
	await deps.prepareAcceptedWorkspacePublication?.(claim).catch(() => void 0);
}
async function recoverPendingWorkspaceResults(deps, projection, environmentId) {
	const { environments, failure, placements } = deps;
	const resolveWorkspace = async (placement, pending, preparedWorkspace) => {
		const workspace = preparedWorkspace ?? await deps.resolveWorkspace(placement);
		if (!pending.repositoryWorkspaceId) return workspace;
		const repository = await getSessionRepositoryWorkspaceStore().get(pending.repositoryWorkspaceId);
		if (!repository || repository.agentId !== placement.agentId || repository.sessionKey !== placement.sessionKey || workspace.kind === "repository" && workspace.repository.workspaceId !== pending.repositoryWorkspaceId) throw new Error("Pending repository checkpoint lost its exact session workspace owner");
		return {
			kind: "repository",
			repository
		};
	};
	const prepareGatewayMove = async (placement, turnClaim, assertCurrent) => {
		const move = (await placements.readProjection([placement.sessionId], { current: true })).moves.get(placement.sessionId);
		if (move?.target.kind !== "gateway") return;
		await deps.prepareGatewayMove?.({
			sessionId: placement.sessionId,
			sessionKey: placement.sessionKey,
			agentId: placement.agentId,
			assertCurrent: () => {
				assertCurrent();
				if (!placements.validateWorkspaceResultClaim(turnClaim) || placements.getPlacementMove(placement.sessionId)?.operationId !== move.operationId) throw new Error("Recovered Gateway move lost its workspace result owner");
			}
		});
	};
	const destroyPendingEnvironment = async (placement, assertCurrent) => {
		assertCurrent();
		const current = environments.get(placement.environmentId);
		if (current && current.state !== "destroyed" && (current.ownerEpoch === placement.activeOwnerEpoch || current.destroyRequestedAtMs !== null)) await environments.destroy(placement.environmentId);
	};
	const stagedResultOwners = /* @__PURE__ */ new Set();
	for (const pending of projection.pendingResults.values()) {
		if (pending.stagedResultRef) stagedResultOwners.add(pending.sessionId);
		const sameGatewayInstance = pending.gatewayInstanceId === placements.workspaceResultInstanceId();
		const reclaimResult = pending.claimId === pending.runId && pending.claimId.startsWith("reclaim-");
		if (sameGatewayInstance && pending.recoveryRequestedAtMs === null) continue;
		const placement = projection.placements.get(pending.sessionId);
		if (environmentId !== void 0 && placement?.environmentId !== environmentId) continue;
		if (projection.moves.get(pending.sessionId)?.abandonSource) continue;
		try {
			const pendingPlacement = placement?.state === "active" || placement?.state === "draining" ? placement : void 0;
			const turnClaim = pendingPlacement && pendingPlacement.environmentId === pending.environmentId && pendingPlacement.activeOwnerEpoch === pending.ownerEpoch ? {
				sessionId: pendingPlacement.sessionId,
				claimId: pending.claimId,
				runId: pending.runId,
				placementGeneration: pending.placementGeneration,
				owner: placementTurnOwner(pendingPlacement)
			} : void 0;
			if (!pendingPlacement || !turnClaim || !matchesWorkspaceResultClaim(pendingPlacement, pending, turnClaim)) {
				if (pending.stagedResultRef && pending.workspaceAcceptedAtMs === null) continue;
				if (pending.stagedResultRef) {
					if (!placement) throw new Error(`Staged cloud workspace result lost its placement: ${pending.sessionId}`);
					const workspace = await resolveWorkspace(placement, pending);
					if (workspace.kind === "local") await deleteStagedWorkerWorkspaceResult({
						root: workspace.path,
						stagedResultRef: pending.stagedResultRef
					});
				}
				if (placement?.state === "active" || placement?.state === "draining") {
					const failed = await placements.failWorkspaceResultAndReleaseTurn(pending, /* @__PURE__ */ new Error(`Pending cloud workspace result has no active claim: ${pending.sessionId}`));
					if (failed.state === "failed") await failure.retryFailedTeardown(failed);
				} else await placements.abandonWorkspaceResult(pending);
				continue;
			}
			await placements.prepareWorkspaceResultClaim(turnClaim);
			await deps.withPreparedRecovery(pendingPlacement, () => {
				if (!placements.validateWorkspaceResultClaim(turnClaim)) throw new Error("Workspace recovery lost its durable result owner");
			}, async (recovery) => {
				try {
					let active = pendingPlacement;
					const workspace = await resolveWorkspace(active, pending, recovery.workspace);
					recovery.assertCurrent();
					const root = sessionWorkspaceRoot(workspace);
					const priorWorkspaceResultConflict = await resolvePriorWorkspaceResultConflict(recovery.resolveConflict, active);
					const canonicalStagedResultRef = workerWorkspaceResultRef(turnClaim.claimId);
					let stagedResultRef = pending.stagedResultRef;
					if (!stagedResultRef && await hasWorkerWorkspaceResultRef({
						root,
						stagedResultRef: canonicalStagedResultRef
					})) {
						recovery.assertCurrent();
						await placements.recordStagedWorkspaceResult(turnClaim, canonicalStagedResultRef, workspace.kind === "repository" ? workspace.repository.workspaceId : void 0, recovery.assertCurrent);
						recovery.assertCurrent();
						stagedResultRef = canonicalStagedResultRef;
						stagedResultOwners.add(pending.sessionId);
					}
					if (workspace.kind === "local" && stagedResultRef && pending.workspaceAcceptedAtMs !== null) {
						if (!await hasWorkerWorkspaceResultRef({
							root,
							stagedResultRef
						})) {
							const cleanupRef = cleanupWorkerWorkspaceResultRef(stagedResultRef);
							if (await hasWorkerWorkspaceResultRef({
								root,
								stagedResultRef: cleanupRef
							})) stagedResultRef = cleanupRef;
						}
					}
					const hasPreparedResult = !stagedResultRef && await hasWorkerWorkspaceResultRef({
						root,
						stagedResultRef: preparedWorkerWorkspaceResultRef(canonicalStagedResultRef)
					});
					const environment = environments.get(active.environmentId);
					if (environment?.state === "attached" && (environment.attachedSessionIds.length !== 1 || environment.attachedSessionIds[0] !== active.sessionId)) return;
					const canPreserveEnvironment = (current, move) => {
						const currentEnvironment = environments.get(pending.environmentId);
						return current?.state === "active" && current.generation === pending.placementGeneration && current.environmentId === pending.environmentId && current.activeOwnerEpoch === pending.ownerEpoch && Boolean(currentEnvironment?.nodeDeviceId) && currentEnvironment?.nodeDeviceId === environment?.nodeDeviceId && currentEnvironment?.leaseId === environment?.leaseId && isCurrentActiveWorkerEnvironment(current, currentEnvironment) && move === null && !reclaimResult;
					};
					const currentPreservesEnvironment = () => canPreserveEnvironment(placements.get(pending.sessionId), placements.getPlacementMove(pending.sessionId) ?? null);
					const preserveEnvironment = currentPreservesEnvironment();
					const currentCheck = { assertPlacementCurrent(current, move) {
						if (preserveEnvironment && !canPreserveEnvironment(current, move)) throw new Error("Recovered workspace result lost its active environment owner");
					} };
					const assertPreservedEnvironment = () => {
						recovery.assertCurrent();
						if (preserveEnvironment && (!currentPreservesEnvironment() || !placements.validateWorkspaceResultClaim(turnClaim))) throw new Error("Recovered workspace result lost its active environment owner");
					};
					const completeResult = () => {
						assertPreservedEnvironment();
						return preserveEnvironment ? placements.completeWorkspaceResultAndReleaseTurn(turnClaim, recovery.assertCurrent, currentCheck) : completeRecoveredWorkspaceTeardown({
							placements,
							placement: active,
							turnClaim
						});
					};
					const settleRecoveredResult = async (result, completion) => {
						const finalized = await finalizeWorkspaceResultConflicts({
							assertCurrent: recovery.assertCurrent,
							placements,
							turnClaim,
							...result,
							priorConflict: priorWorkspaceResultConflict,
							workspace,
							report: recovery.reportConflict
						});
						await deps.publishAcceptedWorkspace?.(turnClaim);
						await settleStagedWorkspaceResult({
							assertCurrent: recovery.assertCurrent,
							placements,
							turnClaim,
							workspace,
							stagedResultRef: result.stagedResultRef,
							conflictRetained: finalized.conflictRetained,
							...completion
						});
					};
					if (preserveEnvironment && !sameGatewayInstance) {
						recovery.assertCurrent();
						await environments.stopTunnel(active.environmentId, active.activeOwnerEpoch);
						assertPreservedEnvironment();
					}
					const teardownRequired = !preserveEnvironment && (!sameGatewayInstance || reclaimResult || Boolean(stagedResultRef) || pending.workspaceAcceptedAtMs !== null && environment?.state === "destroyed");
					if (active.state === "active" && teardownRequired) {
						recovery.assertCurrent();
						const draining = await placements.startWorkspaceResultDrain(turnClaim, recovery.assertCurrent);
						if (draining.state !== "draining") throw new Error(`Pending workspace result did not drain session ${active.sessionId}`);
						active = draining;
					}
					const stagedResultExists = stagedResultRef ? await hasWorkerWorkspaceResultRef({
						root,
						stagedResultRef
					}) : false;
					if (stagedResultRef && !stagedResultExists) {
						if (workspace.kind === "repository") throw new Error("Repository checkpoint is missing; restore its artifact before retrying recovery");
						if (pending.workspaceAcceptedAtMs === null) return;
						if (turnClaim.owner.kind === "worker") {
							recovery.assertCurrent();
							await placements.closeWorkerTurnToolState(turnClaim);
						}
						if (!preserveEnvironment) {
							await prepareGatewayMove(active, turnClaim, recovery.assertCurrent);
							await destroyPendingEnvironment(active, recovery.assertCurrent);
						}
						await prepareAcceptedPublication(deps, turnClaim);
						await deps.publishAcceptedWorkspace?.(turnClaim);
						await completeResult();
						if (!preserveEnvironment) await environments.stopTunnel(active.environmentId, active.activeOwnerEpoch).catch(() => void 0);
						return;
					}
					const owner = {
						sessionId: active.sessionId,
						environmentId: active.environmentId,
						ownerEpoch: active.activeOwnerEpoch,
						placementGeneration: pending.placementGeneration
					};
					const journal = {
						load: () => placements.loadWorkspaceReconciliation(owner, void 0, recovery.assertCurrent),
						begin: (next) => {
							recovery.assertCurrent();
							return placements.beginWorkspaceReconciliation(owner, next, recovery.assertCurrent);
						},
						commit: async (manifestRef) => {
							assertPreservedEnvironment();
							await placements.updateWorkspaceBaseManifest({
								claim: turnClaim,
								manifestRef
							}, recovery.assertCurrent, currentCheck);
						},
						abort: () => {
							recovery.assertCurrent();
							return placements.abortWorkspaceReconciliation(owner, void 0, recovery.assertCurrent);
						}
					};
					if (stagedResultRef) {
						let ownedStagedResultRef = stagedResultRef;
						await deps.workspaceOperations.run(active.environmentId, async () => {
							assertPreservedEnvironment();
							if (!placements.validateWorkspaceResultClaim(turnClaim)) throw new Error("Recovered workspace result lost its placement owner");
							let conflictPaths = [];
							if (workspace.kind === "repository") await recoverSessionWorkspaceCheckpoint({
								workspace,
								checkpointRef: ownedStagedResultRef,
								assertCurrent: () => {
									recovery.assertCurrent();
									if (!placements.validateWorkspaceResultClaim(turnClaim)) throw new Error("Recovered repository checkpoint lost its placement owner");
								},
								onAccepted: journal.commit
							});
							else {
								const interrupted = await journal.load();
								const alreadyApplied = interrupted?.appliedManifestRef !== void 0;
								if (interrupted && !alreadyApplied) {
									await recoverWorkerWorkspaceReconciliation({
										root,
										journal: interrupted,
										assertCurrent: recovery.assertCurrent
									});
									await journal.abort();
								}
								const reconciliation = await applyStagedWorkerWorkspaceResult({
									root,
									stagedResultRef: ownedStagedResultRef,
									expectedBaseManifestRef: active.workspaceBaseManifestRef,
									alreadyAccepted: pending.workspaceAcceptedAtMs !== null || alreadyApplied,
									journal,
									assertCurrent: recovery.assertCurrent
								});
								await reconciliation.verifyLocalStable();
								conflictPaths = reconciliation.conflictPaths;
							}
							if (pending.workspaceAcceptedAtMs === null) {
								await prepareAcceptedPublication(deps, turnClaim);
								assertPreservedEnvironment();
								await placements.acceptWorkspaceResult(turnClaim, recovery.assertCurrent);
							}
							if (conflictPaths.length > 0 && isWorkerWorkspaceResultCleanupRef(ownedStagedResultRef)) {
								await restoreStagedWorkerWorkspaceResultFromCleanup({
									root,
									cleanupRef: ownedStagedResultRef,
									stagedResultRef: canonicalStagedResultRef,
									assertCurrent: recovery.assertCurrent
								});
								ownedStagedResultRef = canonicalStagedResultRef;
							}
							await settleRecoveredResult({
								stagedResultRef: ownedStagedResultRef,
								conflictPaths
							}, {
								beforeComplete: async () => {
									if (!preserveEnvironment) {
										await prepareGatewayMove(active, turnClaim, recovery.assertCurrent);
										await destroyPendingEnvironment(active, recovery.assertCurrent);
									}
								},
								complete: completeResult
							});
							if (!preserveEnvironment) await environments.stopTunnel(active.environmentId, active.activeOwnerEpoch).catch(() => void 0);
						});
						return;
					}
					if (!isCurrentActiveWorkerEnvironment(active, environment)) {
						if (hasPreparedResult) return;
						if (pending.workspaceAcceptedAtMs !== null && environment?.state === "destroyed") {
							await prepareAcceptedPublication(deps, turnClaim);
							await deps.publishAcceptedWorkspace?.(turnClaim);
							await prepareGatewayMove(active, turnClaim, recovery.assertCurrent);
							recovery.assertCurrent();
							await completeRecoveredWorkspaceTeardown({
								placements,
								placement: active,
								turnClaim
							});
							return;
						}
						recovery.assertCurrent();
						const failed = await placements.failWorkspaceResultAndReleaseTurn(pending, workerDisappearanceError(environment) ?? /* @__PURE__ */ new Error(`Pending cloud workspace result lost its worker: ${pending.sessionId}`), recovery.assertCurrent);
						if (failed.state === "failed") await failure.retryFailedTeardown(failed);
						return;
					}
					recovery.assertCurrent();
					const tunnel = await environments.startTunnel({
						environmentId: active.environmentId,
						ownerEpoch: active.activeOwnerEpoch
					});
					await deps.workspaceOperations.run(active.environmentId, async () => {
						assertPreservedEnvironment();
						if (!placements.validateWorkspaceResultClaim(turnClaim)) throw new Error("Recovered workspace result lost its placement owner");
						const quiescence = await tunnel.quiesceWorkspace(active.remoteWorkspaceDir);
						let quiescenceHandled = false;
						try {
							assertPreservedEnvironment();
							const reconciliation = await tunnel.reconcileWorkspace(createWorkerWorkspaceReconcileRequest({
								workspace,
								remoteWorkspaceDir: active.remoteWorkspaceDir,
								baseManifestRef: active.workspaceBaseManifestRef,
								journal,
								stagedResult: {
									ref: canonicalStagedResultRef,
									record: (ref) => {
										recovery.assertCurrent();
										return placements.recordStagedWorkspaceResult(turnClaim, ref, workspace.kind === "repository" ? workspace.repository.workspaceId : void 0, recovery.assertCurrent);
									}
								},
								assertCurrent: () => {
									recovery.assertCurrent();
									if (!placements.validateWorkspaceResultClaim(turnClaim)) throw new Error("Recovered workspace result lost its placement owner");
								}
							}));
							const applied = await verifyReconciledWorkspaceFinal(reconciliation, quiescence);
							await prepareAcceptedPublication(deps, turnClaim);
							assertPreservedEnvironment();
							await placements.acceptWorkspaceResult(turnClaim, recovery.assertCurrent);
							const recordedPending = (await placements.readProjection([turnClaim.sessionId], { current: true })).pendingResults.get(turnClaim.sessionId);
							const recordedStagedResultRef = recordedPending?.sessionId === turnClaim.sessionId && recordedPending.claimId === turnClaim.claimId && recordedPending.runId === turnClaim.runId ? recordedPending.stagedResultRef : void 0;
							const conflictPaths = applied?.conflictPaths ?? [];
							if (conflictPaths.length > 0 && !recordedStagedResultRef) throw new Error("Recovered cloud workspace conflict has no staged result reference");
							await settleRecoveredResult({
								stagedResultRef: recordedStagedResultRef,
								conflictPaths,
								retainPriorConflict: reclaimResult && !reconciliation.changed
							}, {
								beforeComplete: async () => {
									if (!preserveEnvironment) await prepareGatewayMove(active, turnClaim, recovery.assertCurrent);
									if (sameGatewayInstance && !reclaimResult || preserveEnvironment) {
										assertPreservedEnvironment();
										await quiescence.resume();
									} else {
										recovery.assertCurrent();
										await environments.destroy(active.environmentId);
									}
									quiescenceHandled = true;
								},
								...sameGatewayInstance && !reclaimResult && !preserveEnvironment ? {} : { complete: completeResult },
								afterComplete: async () => {
									if ((!sameGatewayInstance || reclaimResult) && !preserveEnvironment) await environments.stopTunnel(active.environmentId, active.activeOwnerEpoch).catch(() => void 0);
								}
							});
						} finally {
							if (!quiescenceHandled) await quiescence.resume();
						}
					});
				} catch (error) {
					try {
						const pendingResults = await placements.listPendingWorkspaceResultsAsync(pending.sessionId);
						const current = placements.get(pending.sessionId);
						const currentPending = pendingResults.find((candidate) => candidate.sessionId === pending.sessionId && candidate.environmentId === pending.environmentId && candidate.ownerEpoch === pending.ownerEpoch && candidate.placementGeneration === pending.placementGeneration && candidate.claimId === pending.claimId && candidate.runId === pending.runId && candidate.gatewayInstanceId === pending.gatewayInstanceId);
						if (currentPending && isCurrentWorkerWorkspacePendingResultOwner(current, currentPending)) await recovery.reportFailure(boundedWorkerError(error));
					} catch {}
				}
			});
		} catch (error) {
			log$1.warn(`Cloud workspace recovery deferred: ${boundedWorkerError(error)}`);
		}
	}
	return stagedResultOwners;
}
//#endregion
//#region src/gateway/worker-environments/placement-force-abandon.ts
function reportWorkerAbandonmentCleanupError(onCleanupError, error) {
	try {
		onCleanupError?.(error);
	} catch {}
}
async function forceAbandonWorkerEnvironment(params) {
	const { environmentId, placements } = params;
	const recoveryError = FORCED_WORKER_ABANDONMENT_ERROR;
	const journalOwners = (await params.placements.listWorkspaceReconciliationOwners()).filter((owner) => owner.environmentId === environmentId);
	const journalCleanups = [];
	const retainedJournalSessions = /* @__PURE__ */ new Set();
	for (const owner of journalOwners) {
		const placement = placements.get(owner.sessionId);
		const isCurrentOwner = (placement?.state === "active" || placement?.state === "draining") && placement.generation === owner.placementGeneration;
		const isForceFailedOwner = placement?.state === "failed" && placement.recoveryError.startsWith(recoveryError) && placement.generation > owner.placementGeneration;
		if (placement && (isCurrentOwner || isForceFailedOwner) && placement.environmentId === owner.environmentId && placement.activeOwnerEpoch === owner.ownerEpoch) try {
			const journal = await placements.loadWorkspaceReconciliation(owner, isForceFailedOwner ? { allowFailedOwner: true } : void 0);
			if (journal) journalCleanups.push({
				owner,
				placement,
				journal
			});
		} catch (error) {
			reportWorkerAbandonmentCleanupError(params.onCleanupError, error);
			retainedJournalSessions.add(owner.sessionId);
		}
	}
	const stagedResultCleanups = [];
	for (const pending of await placements.listPendingWorkspaceResultsAsync()) if (pending.environmentId === environmentId) {
		const placement = placements.get(pending.sessionId);
		if (isCurrentWorkerWorkspacePendingResultOwner(placement, pending)) {
			const finalRef = pending.stagedResultRef ?? workerWorkspaceResultRef(pending.claimId);
			stagedResultCleanups.push({
				placement,
				refs: [finalRef, preparedWorkerWorkspaceResultRef(finalRef)],
				repositoryWorkspaceId: pending.repositoryWorkspaceId
			});
			const claim = placement.turnClaim;
			if (claim && claim.claimId === pending.claimId && claim.runId === pending.runId) await placements.closeWorkerTurnToolState({
				sessionId: placement.sessionId,
				claimId: claim.claimId,
				runId: claim.runId,
				placementGeneration: claim.generation,
				owner: placementTurnOwner(placement)
			});
			await placements.failWorkspaceResultAndReleaseTurn(pending, recoveryError);
		} else await placements.abandonWorkspaceResult(pending);
	}
	for (const placement of placements.listForReconcile()) {
		if (placement.environmentId !== environmentId) continue;
		let current = placements.get(placement.sessionId);
		if (current?.state === "active") current = await placements.startDrain({
			sessionId: current.sessionId,
			environmentId: current.environmentId,
			ownerEpoch: current.activeOwnerEpoch,
			expectedGeneration: current.generation
		});
		if (current?.state === "draining") {
			if (current.turnClaim) await placements.closeWorkerTurnToolState({
				sessionId: current.sessionId,
				claimId: current.turnClaim.claimId,
				runId: current.turnClaim.runId,
				placementGeneration: current.turnClaim.generation,
				owner: placementTurnOwner(current)
			});
			current = await placements.startReconcile({
				sessionId: current.sessionId,
				environmentId: current.environmentId,
				ownerEpoch: current.activeOwnerEpoch,
				expectedGeneration: current.generation,
				forceLocalClaim: true
			});
		}
		if (current && (current.state !== "failed" || current.recoveryError !== recoveryError)) await placements.fail({
			sessionId: current.sessionId,
			expectedGeneration: current.generation,
			recoveryError
		});
	}
	for (const cleanup of journalCleanups) {
		if (cleanup.journal.appliedManifestRef) continue;
		try {
			const workspace = await params.resolveWorkspace(cleanup.placement);
			if (workspace.kind !== "local") throw new Error("Repository workspace cannot own a local rollback journal");
			await recoverWorkerWorkspaceReconciliation({
				root: workspace.path,
				journal: cleanup.journal
			});
		} catch (error) {
			reportWorkerAbandonmentCleanupError(params.onCleanupError, error);
			retainedJournalSessions.add(cleanup.owner.sessionId);
		}
	}
	for (const owner of journalOwners) {
		if (retainedJournalSessions.has(owner.sessionId)) continue;
		await placements.abortWorkspaceReconciliation(owner, { force: true });
	}
	for (const cleanup of stagedResultCleanups) try {
		if (cleanup.repositoryWorkspaceId) continue;
		const workspace = await params.resolveWorkspace(cleanup.placement);
		if (workspace.kind === "repository") continue;
		const root = workspace.path;
		for (const stagedResultRef of cleanup.refs) if (await hasWorkerWorkspaceResultRef({
			root,
			stagedResultRef
		})) await deleteStagedWorkerWorkspaceResult({
			root,
			stagedResultRef
		});
	} catch (error) {
		reportWorkerAbandonmentCleanupError(params.onCleanupError, error);
	}
}
//#endregion
//#region src/gateway/worker-environments/placement-dispatch-recovery.ts
const log = createSubsystemLogger("gateway/worker-placement");
const admitRecovery = async (_sessionIds, run) => {
	await run();
	return true;
};
function activePlacementExecutionError(placement, environment, environments) {
	const provisionedMode = environment.profileSnapshot.executionMode;
	if (provisionedMode !== void 0 && provisionedMode !== placement.executionMode) return /* @__PURE__ */ new Error("Active worker placement execution mode does not match its environment");
	if (placement.executionMode === "worker-turn" && !environment.nodeDeviceId) return /* @__PURE__ */ new Error("Active worker-turn placement requires a node lease");
	if (!environments.supportsProviderExecutionMode(environment.providerId, placement.executionMode)) return /* @__PURE__ */ new Error(`Worker provider ${environment.providerId} does not support ${placement.executionMode} placement`);
}
function createPlacementRecoveryActions(deps) {
	const { environments, failure, placements } = deps;
	const interruptedClaims = new Set(placements.list().flatMap((placement) => {
		const claim = projectWorkerSessionTurnClaim(placement);
		return claim ? [serializeWorkerSessionTurnClaim(claim)] : [];
	}));
	let orphanCleanupPending;
	const reconcileActivePlacement = async (initialPlacement, mode, facts) => {
		let placement = initialPlacement;
		let environment = environments.get(placement.environmentId);
		const claim = projectWorkerSessionTurnClaim(placement);
		const interrupted = claim && interruptedClaims.has(serializeWorkerSessionTurnClaim(claim));
		if ((mode === "restart" || interrupted) && placement.turnClaim) {
			if (claim && interrupted && environment?.nodeDeviceId && isCurrentActiveWorkerEnvironment(placement, environment) && !facts.moves.has(placement.sessionId)) try {
				await environments.stopTunnel(placement.environmentId, placement.activeOwnerEpoch);
				await placements.closeWorkerTurnToolState(claim);
				const current = placements.get(placement.sessionId);
				const currentEnvironment = environments.get(placement.environmentId);
				if (current?.state !== "active" || current.generation !== placement.generation || currentEnvironment?.nodeDeviceId !== environment.nodeDeviceId || !isCurrentActiveWorkerEnvironment(current, currentEnvironment) || placements.getPlacementMove(placement.sessionId)) throw new Error("Interrupted worker owner changed while stopping");
				await placements.retainInterruptedTurnWorkspace(claim, () => {
					const releaseEnvironment = environments.get(placement.environmentId);
					if (!isCurrentActiveWorkerEnvironment(placement, releaseEnvironment)) throw new Error("Interrupted worker owner changed before workspace recovery");
				});
				await recoverPendingWorkspaceResults(deps, await placements.readProjection([placement.sessionId], { current: true }), placement.environmentId);
				const recovered = (await placements.readProjection([placement.sessionId], { current: true })).placements.get(placement.sessionId);
				if (recovered?.state !== "active" || !matchesWorkerPlacementTarget(recovered, placement) || recovered.turnClaim) return;
				interruptedClaims.delete(serializeWorkerSessionTurnClaim(claim));
				placement = recovered;
				environment = environments.get(placement.environmentId);
			} catch (error) {
				log.warn(`Interrupted cloud worker is waiting for recovery: ${boundedWorkerError(error)}`);
				return;
			}
			else {
				const error = /* @__PURE__ */ new Error("Active worker turn claim cannot be proven live after gateway restart");
				await failure.failActive(placement, error, { forceClaimFence: true });
				return;
			}
		}
		const disappearance = workerDisappearanceError(environment);
		if (disappearance || environment && isUnavailableEnvironment(environment)) {
			await failure.reclaimActive(placement, environment, disappearance ?? /* @__PURE__ */ new Error(`Active worker environment is ${environment?.state}`));
			return;
		}
		if (!environment || !isCurrentActiveWorkerEnvironment(placement, environment)) {
			await failure.reclaimActive(placement, environment, /* @__PURE__ */ new Error("Active worker placement does not match its environment owner"));
			return;
		}
		if (mode === "runtime") {
			const executionError = activePlacementExecutionError(placement, environment, environments);
			if (executionError) await failure.failActive(placement, executionError, { forceClaimFence: true });
			return;
		}
		try {
			const executionError = activePlacementExecutionError(placement, environment, environments);
			if (executionError) throw executionError;
			if (!environment.nodeDeviceId) await environments.startTunnel({
				environmentId: environment.environmentId,
				ownerEpoch: environment.ownerEpoch
			});
			placements.adoptActive({
				sessionId: placement.sessionId,
				expectedGeneration: placement.generation,
				environmentId: environment.environmentId,
				ownerEpoch: environment.ownerEpoch
			});
		} catch (error) {
			if (error instanceof WorkerRuntimeRefreshPendingError) return;
			await failure.failActive(placement, error);
		}
	};
	const recoverSession = async (sessionId, mode, environmentId, resultsOnly) => {
		let facts = await placements.readProjection([sessionId], { current: true });
		const stagedOwners = await recoverPendingWorkspaceResults(deps, facts, environmentId);
		if (resultsOnly === "results-only") return;
		facts = await placements.readProjection([sessionId], { current: true });
		const blocked = stagedOwners.has(sessionId) || facts.pendingResults.has(sessionId) || facts.workspaceJournalOwnerSessionIds.has(sessionId);
		const moveOwners = await deps.recoverPlacementMoves?.(facts, environmentId) ?? /* @__PURE__ */ new Set();
		if (blocked || moveOwners.has(sessionId)) return;
		facts = await placements.readProjection([sessionId], { current: true });
		for (const placement of facts.placements.values()) {
			if (environmentId !== void 0 && placement.environmentId !== environmentId) continue;
			if (mode === "runtime") {
				if (placement.state === "failed") await failure.retryFailedTeardown(placement);
				else if (placement.state === "active") await reconcileActivePlacement(placement, "runtime", facts);
				continue;
			}
			if (placement.state === "local" || placement.state === "reclaimed") continue;
			if (placement.state === "provisioning") {
				const environment = placement.environmentId ? environments.get(placement.environmentId) : void 0;
				const exactEnvironment = environment?.environmentId === placement.environmentId ? environment : void 0;
				if (exactEnvironment && exactEnvironment.destroyRequestedAtMs === null && (exactEnvironment.state === "requested" || exactEnvironment.state === "provisioning" || exactEnvironment.state === "bootstrapping" || (exactEnvironment.state === "ready" || exactEnvironment.state === "idle") && supportsCurrentWorkerLaunch(exactEnvironment.bootstrapReceipt))) continue;
				await failure.teardownEnvironment({
					placement,
					environmentId: exactEnvironment?.environmentId ?? null,
					ownerEpoch: exactEnvironment?.ownerEpoch ?? null,
					primaryError: /* @__PURE__ */ new Error(exactEnvironment ? `Provisioning worker environment cannot be recovered from ${exactEnvironment.state}` : "Provisioning worker environment record is missing")
				});
				continue;
			}
			if (placement.state === "active") {
				await reconcileActivePlacement(placement, "restart", facts);
				continue;
			}
			if (placement.state === "failed") {
				if (mode !== "startup") await failure.retryFailedTeardown(placement);
				continue;
			}
			const error = /* @__PURE__ */ new Error(`Worker dispatch interrupted in ${placement.state}`);
			if (placement.state === "draining") {
				await failure.failDraining(placement, error, { forceClaimFence: true });
				continue;
			}
			await failure.teardownEnvironment({
				placement,
				environmentId: placement.environmentId,
				ownerEpoch: placement.activeOwnerEpoch,
				primaryError: error
			});
		}
	};
	const reconcile = async (mode, admit = admitRecovery) => {
		if (mode === "startup") {
			for (const { sessionId } of await placements.readRecoveryCandidates()) {
				let abandonedEnvironmentId;
				await admit([sessionId], async () => {
					const facts = await placements.readProjection([sessionId], { current: true });
					const placement = facts.placements.get(sessionId);
					if (!placement || facts.moves.has(sessionId)) return;
					const environment = placement.environmentId ? environments.get(placement.environmentId) : void 0;
					if ((placement.state === "active" || placement.state === "draining" || placement.state === "reconciling") && environment && hasForcedWorkerEnvironmentAbandonment(environment) && environment.ownerEpoch === placement.activeOwnerEpoch) {
						await deps.workspaceOperations.run(environment.environmentId, async () => {
							await forceAbandonWorkerEnvironment({
								...deps,
								environmentId: environment.environmentId
							});
						});
						abandonedEnvironmentId = environment.environmentId;
						return;
					}
					if (placement.state !== "draining" || placement.turnClaim || facts.pendingResults.has(sessionId)) return;
					const claimId = `reclaim-${randomUUID()}`;
					const claim = await placements.claimReclaimWorkspaceResult({
						sessionId: placement.sessionId,
						sessionKey: placement.sessionKey,
						agentId: placement.agentId,
						claimId,
						runId: claimId,
						owner: placementTurnOwner(placement)
					}, (recoveryClaim) => environments.fenceWorkerTurnForRecovery(recoveryClaim));
					await placements.handoffWorkspaceResultRecovery(claim);
				});
				const environmentId = abandonedEnvironmentId;
				if (environmentId) await deps.workspaceOperations.run(environmentId, () => environments.reconcileEnvironment(environmentId));
			}
			const reconciled = await runTasksWithConcurrency({
				tasks: (await placements.readRecoveryCandidates()).flatMap(({ environmentId, state }) => environmentId && state !== "failed" && state !== "local" && state !== "reclaimed" ? [() => environments.reconcileEnvironment(environmentId)] : []),
				limit: 8,
				errorMode: "stop"
			});
			if (reconciled.hasError) throw reconciled.firstError;
		} else await environments.reconcileOnce();
		const candidates = await placements.readRecoveryCandidates();
		if (mode === "startup") orphanCleanupPending = {
			rootsBySession: /* @__PURE__ */ new Map(),
			completedRoots: /* @__PURE__ */ new Set()
		};
		for (const { sessionId } of candidates) await admit([sessionId], () => recoverSession(sessionId, mode ?? "restart"));
		if (mode !== "startup" && orphanCleanupPending && await cleanupPendingWorkspaceResultOrphans(deps, admit, orphanCleanupPending)) orphanCleanupPending = void 0;
	};
	const reconcileActive = async (environmentId, admit = admitRecovery) => {
		await environments.reconcileOnce(environmentId);
		for (const candidate of await placements.readRecoveryCandidates()) {
			if (environmentId !== void 0 && candidate.environmentId !== environmentId && candidate.moveSourceEnvironmentId !== environmentId) continue;
			await admit([candidate.sessionId], (mode) => recoverSession(candidate.sessionId, "runtime", environmentId, mode));
		}
		if (orphanCleanupPending && environmentId === void 0 && await cleanupPendingWorkspaceResultOrphans(deps, admit, orphanCleanupPending)) orphanCleanupPending = void 0;
	};
	return {
		reconcile,
		reconcileActive
	};
}
//#endregion
//#region src/gateway/worker-environments/placement-dispatch-provisioning.ts
function isPendingProvisioningEnvironment(environment, environmentId) {
	return environment?.environmentId === environmentId && environment.destroyRequestedAtMs === null && (environment.state === "requested" || environment.state === "provisioning" || environment.state === "bootstrapping");
}
function createInterruptedWorkerProvisioningRetainer(options) {
	const { environments, placements } = options;
	return async (owned, error) => {
		const current = placements.get(owned.sessionId);
		if (error instanceof WorkerPlacementAdmissionTargetError || error instanceof WorkerDispatchTargetChangedError || !options.isShuttingDown?.() || current?.state !== "provisioning" || current.state !== owned.state || current.generation !== owned.generation || current.environmentId !== owned.environmentId || current.sessionKey !== owned.sessionKey || current.agentId !== owned.agentId || current.executionMode !== owned.executionMode) return;
		const environment = current.environmentId ? environments.get(current.environmentId) : void 0;
		if (!environment || !isPendingProvisioningEnvironment(environment, current.environmentId)) return;
		const assertCurrent = () => {
			const latest = placements.get(owned.sessionId);
			if (latest?.state !== current.state || latest.generation !== current.generation || latest.environmentId !== current.environmentId || latest.sessionKey !== current.sessionKey || latest.agentId !== current.agentId || latest.executionMode !== current.executionMode || !isPendingProvisioningEnvironment(environments.get(environment.environmentId), current.environmentId)) throw new Error("Worker provisioning owner changed before shutdown retention");
		};
		await environments.recordError(environment, error, assertCurrent);
		assertCurrent();
		return current;
	};
}
function requireProvisionedEnvironment(environment, expectedEnvironmentId, executionMode, environments) {
	if (environment.state !== "ready" && environment.state !== "idle" || environment.environmentId !== expectedEnvironmentId || environment.destroyRequestedAtMs !== null || !environment.bootstrapReceipt || !supportsCurrentWorkerLaunch(environment.bootstrapReceipt)) throw new Error(`Worker environment is not dispatchable with the current worker launch contract: ${environment.state}`);
	if (environment.profileSnapshot.executionMode !== void 0 && environment.profileSnapshot.executionMode !== executionMode || executionMode === "worker-turn" && environment.profileSnapshot.executionMode !== void 0 && !environment.nodeDeviceId || !environments.supportsProviderExecutionMode(environment.providerId, executionMode)) throw new Error("Worker environment does not support the placement's exact execution mode");
	return {
		environmentId: environment.environmentId,
		ownerEpoch: environment.ownerEpoch,
		bundleHash: environment.bootstrapReceipt.bundleHash
	};
}
//#endregion
//#region src/gateway/worker-environments/repository-workspace-startup.ts
/** Prepare source on the worker and durably accept its initial state before activation. */
async function syncSessionRepositoryWorkspace(params) {
	const store = getSessionRepositoryWorkspaceStore();
	let repository = params.repository;
	const prepared = params.preparedRepository;
	if (prepared && repository.baseCommit && prepared.baseCommit !== repository.baseCommit) throw new Error("Prepared repository does not match the pinned session commit");
	if (prepared && repository.baseManifestHash && prepared.sourceManifestRef !== repository.baseManifestHash) throw new Error("Prepared repository does not match the pinned source manifest");
	if (params.recovery && !prepared && !repository.checkpointRef && repository.runSetupScript) throw new Error("Repository setup was interrupted before its first checkpoint. Retry dispatch with an administrator to authorize setup again.");
	if (!prepared && !repository.checkpointRef && repository.runSetupScript && params.runSetupScript !== true) throw new Error("Repository setup requires administrator authorization; retry dispatch as an administrator.");
	params.assertCurrent();
	const github = prepared ? void 0 : await prepareWorkerGitHubBinding({
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		assertCurrent: () => {
			params.assertCurrent();
			return true;
		}
	});
	params.assertCurrent();
	const source = {
		kind: "repository",
		url: repository.url,
		ref: repository.requestedRef ?? void 0,
		branch: repository.branch,
		baseCommit: repository.baseCommit ?? prepared?.baseCommit,
		...prepared ? { prepared } : {},
		runSetupScript: !prepared && !repository.checkpointRef && repository.runSetupScript && params.runSetupScript === true,
		...github ? { gitToken: github.token } : {}
	};
	const sync = async (checkpoint) => {
		params.assertCurrent();
		return await params.tunnel.syncWorkspace({
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			generation: params.generation,
			gitAuthor: params.gitAuthor,
			source: {
				...source,
				...checkpoint ? { checkpoint } : {}
			},
			authorize: params.assertCurrent
		});
	};
	const synced = repository.checkpointRef ? await withSessionRepositoryCheckpoint({
		workspaceId: repository.workspaceId,
		includePublication: true
	}, sync) : await sync();
	params.assertCurrent();
	if (synced.mode !== "repository") throw new Error("Repository preparation did not return a repository workspace");
	if (prepared && (synced.baseCommit !== prepared.baseCommit || synced.baseManifestRef !== prepared.sourceManifestRef || synced.remoteWorkspaceDir !== prepared.workspaceDir)) throw new Error("Repository preparation changed its attested prepared workspace");
	if (!repository.baseCommit || !repository.baseManifestHash) {
		repository = await store.bindBase({
			workspaceId: repository.workspaceId,
			expectedRevision: repository.revision,
			baseCommit: synced.baseCommit,
			baseManifestHash: synced.baseManifestRef,
			assertCurrent: params.assertCurrent
		});
		params.assertCurrent();
	} else if (repository.baseCommit !== synced.baseCommit || repository.baseManifestHash !== synced.baseManifestRef) throw new Error("Repository preparation changed the pinned source baseline");
	if (repository.checkpointRef) {
		if (synced.manifestRef !== repository.manifestHash) throw new Error("Repository preparation did not restore the accepted checkpoint");
		return synced;
	}
	const quiescence = await params.tunnel.quiesceWorkspace(synced.remoteWorkspaceDir);
	let reconciliation;
	try {
		params.assertCurrent();
		reconciliation = await params.tunnel.reconcileWorkspace({
			remoteWorkspaceDir: synced.remoteWorkspaceDir,
			baseManifestRef: synced.baseManifestRef,
			source: {
				kind: "repository",
				authorize: params.assertCurrent,
				referenceManifestRef: synced.manifestRef,
				prepareCheckpoint: (payload) => stageSessionRepositoryCheckpoint({
					...payload,
					workspaceId: repository.workspaceId,
					expectedRevision: repository.revision,
					assertCurrent: params.assertCurrent
				})
			}
		});
		await quiescence.assertActive();
		await reconciliation.verifyStable();
		await reconciliation.verifyLocalStable();
		params.assertCurrent();
		await reconciliation.publishStagedResult();
		params.assertCurrent();
		return {
			...synced,
			manifestRef: reconciliation.manifestRef
		};
	} finally {
		try {
			await reconciliation?.discardPreparedStagedResult();
		} finally {
			await quiescence.resume();
		}
	}
}
//#endregion
//#region src/gateway/worker-environments/placement-dispatch-startup.ts
function createWorkerPlacementDispatchStartup(options) {
	const { environments, failure, placements } = options;
	const retainInterruptedProvisioning = createInterruptedWorkerProvisioningRetainer(options);
	const validateDevicePlacement = async (request) => {
		if (!request.deviceId) return;
		const eligibility = await resolveDevicePlacementEligibility({
			environmentService: environments,
			deviceId: request.deviceId,
			requirement: request.devicePlacement,
			executionMode: request.executionMode,
			config: getRuntimeConfig()
		});
		if (!eligibility.ok) throw new DevicePlacementUnavailableError(request.deviceId, eligibility.error);
	};
	const requireNodePlacementEligibility = async (request, environment, admittedNode) => {
		const deviceId = environment.nodeDeviceId;
		if (!deviceId) return;
		const requirement = request.devicePlacement ?? (options.resolveDevicePlacementRequirement ? await options.resolveDevicePlacementRequirement({
			sessionId: request.sessionId,
			sessionKey: request.sessionKey,
			agentId: request.agentId,
			executionMode: request.executionMode
		}) : void 0);
		if (!requirement) throw new Error("Node-backed cloud placement has no authoritative runtime requirement");
		const eligibility = await resolveDevicePlacementEligibility({
			environmentService: environments,
			deviceId,
			requirement: admittedNode ? {
				...requirement,
				consumesWorkerSlot: false
			} : requirement,
			executionMode: request.executionMode,
			config: getRuntimeConfig(),
			...admittedNode ? { currentNode: admittedNode } : {}
		});
		if (!eligibility.ok) throw admittedNode ? new Error(eligibility.error) : new DevicePlacementUnavailableError(deviceId, eligibility.error);
		return {
			node: eligibility.node,
			requirement: {
				...requirement,
				consumesWorkerSlot: false
			}
		};
	};
	const bindPreparedPlacement = async (params) => {
		const preparation = readWorkerProjectPreparation(params.intent.profileSnapshot.project);
		if (!preparation || params.intent.preparationKey !== preparation.key) return;
		const assertCurrent = () => {
			params.assertCurrent();
			environments.assertPreparedIntentCurrent(params.request.profileId, params.intent);
		};
		assertCurrent();
		const expectedBuild = {
			bundleHash: preparation.artifacts.workerBundleHash,
			openclawVersion: preparation.artifacts.openclawVersion,
			protocolFeatures: preparation.artifacts.protocolFeatures
		};
		for (const environment of environments.getPreparedCandidates(params.intent)) {
			if (!environment.nodeDeviceId || !environment.leaseId || !environment.bootstrapReceipt || !supportsCurrentWorkerLaunch(environment.bootstrapReceipt) || !sameWorkerBuild(environment.bootstrapReceipt, expectedBuild)) continue;
			let admittedNode;
			try {
				admittedNode = await requireNodePlacementEligibility(params.request, environment);
			} catch {
				assertCurrent();
				continue;
			}
			assertCurrent();
			const remainsSelectable = () => environments.getPreparedCandidates(params.intent).some((candidate) => candidate.environmentId === environment.environmentId && candidate.ownerEpoch === environment.ownerEpoch);
			if (!admittedNode || !options.isCurrentNodePlacement?.(admittedNode.node, admittedNode.requirement, params.request.executionMode) || !remainsSelectable()) continue;
			const { node, requirement } = admittedNode;
			const placement = placements.bindPreparedEnvironment({
				sessionId: params.request.sessionId,
				sessionKey: params.request.sessionKey,
				agentId: params.request.agentId,
				executionMode: params.request.executionMode,
				expectedGeneration: params.placement.generation,
				environmentId: environment.environmentId,
				ownerEpoch: environment.ownerEpoch,
				providerId: params.intent.providerId,
				profileId: params.request.profileId,
				preparationKey: preparation.key,
				nodeDeviceId: environment.nodeDeviceId,
				leaseId: environment.leaseId,
				bundleHash: expectedBuild.bundleHash,
				assertCurrent: () => {
					assertCurrent();
					if (!remainsSelectable()) throw new Error("Prepared worker is no longer available under the current pool policy");
					if (!options.isCurrentNodePlacement?.(node, requirement, params.request.executionMode)) throw new Error("Prepared worker lost its current node authority before binding");
				}
			});
			if (placement) return {
				placement,
				environment,
				admittedNode
			};
		}
	};
	const continueProvisionedDispatch = async (params) => {
		if (params.placement.state !== "provisioning") throw new Error("Worker dispatch continuation requires a provisioning placement");
		const { request } = params;
		params.signal?.throwIfAborted();
		const provisioned = requireProvisionedEnvironment(params.environment, params.expectedEnvironmentId, request.executionMode, environments);
		const admittedNode = params.admittedNode ?? await requireNodePlacementEligibility(request, params.environment);
		params.signal?.throwIfAborted();
		params.authorize?.();
		const assertRequestCurrent = () => {
			params.signal?.throwIfAborted();
			params.authorize?.();
		};
		let placement = await placements.transition({
			sessionId: request.sessionId,
			from: "provisioning",
			to: "syncing",
			expectedGeneration: params.placement.generation,
			patch: {
				environmentId: provisioned.environmentId,
				workerBundleHash: provisioned.bundleHash
			}
		}, assertRequestCurrent);
		reportPlacementTransition(params.onTransition, placement);
		params.signal?.throwIfAborted();
		const syncingPlacement = placement;
		const assertAttachmentCurrent = () => {
			params.signal?.throwIfAborted();
			params.authorize?.();
			const current = placements.get(request.sessionId);
			if (current?.state !== "syncing" || current.generation !== syncingPlacement.generation || current.sessionKey !== request.sessionKey || current.agentId !== request.agentId || current.executionMode !== request.executionMode || current.environmentId !== provisioned.environmentId || current.turnClaim !== null) throw new Error("Worker workspace preparation lost its exact placement owner");
			if (admittedNode && !options.isCurrentNodePlacement?.(admittedNode.node, admittedNode.requirement, request.executionMode)) throw new Error("Worker dispatch lost its current node authority before attachment");
		};
		assertAttachmentCurrent();
		const credential = await environments.attachSession({
			environmentId: provisioned.environmentId,
			ownerEpoch: provisioned.ownerEpoch,
			sessionId: request.sessionId,
			...params.environment.preparation ? { placementBinding: {
				sessionId: request.sessionId,
				sessionKey: request.sessionKey,
				agentId: request.agentId,
				executionMode: request.executionMode,
				generation: placement.generation,
				preparationKey: params.environment.preparation.key,
				assertCurrent: assertAttachmentCurrent
			} } : {}
		});
		params.signal?.throwIfAborted();
		params.authorize?.();
		const ownerEpoch = credential.ownerEpoch;
		let activated = false;
		let activationIndeterminate = false;
		let stoppingTunnel;
		const stopAttemptTunnel = () => {
			stoppingTunnel ??= environments.stopTunnel(provisioned.environmentId, ownerEpoch);
			stoppingTunnel.catch(() => void 0);
		};
		params.signal?.addEventListener("abort", stopAttemptTunnel, { once: true });
		try {
			const tunnel = await environments.startTunnel({
				environmentId: provisioned.environmentId,
				ownerEpoch,
				authorize: assertAttachmentCurrent
			});
			params.signal?.throwIfAborted();
			params.authorize?.();
			const gitAuthor = options.resolveGitAuthor?.(request.agentId);
			const project = readWorkerProjectSnapshot(params.environment.profileSnapshot.project);
			const requireAttachedEnvironment = () => {
				params.signal?.throwIfAborted();
				const attachedEnvironment = environments.get(provisioned.environmentId);
				if (!attachedEnvironment || attachedEnvironment.state !== "attached" || attachedEnvironment.destroyRequestedAtMs !== null || attachedEnvironment.ownerEpoch !== ownerEpoch || attachedEnvironment.attachedSessionIds.length !== 1 || attachedEnvironment.attachedSessionIds[0] !== request.sessionId || attachedEnvironment.nodeDeviceId !== params.environment.nodeDeviceId || attachedEnvironment.leaseId !== params.environment.leaseId || attachedEnvironment.bootstrapReceipt?.bundleHash !== provisioned.bundleHash) throw new Error("Worker dispatch lost its exact environment owner before activation");
				return attachedEnvironment;
			};
			const assertSyncOwner = () => {
				assertAttachmentCurrent();
				requireAttachedEnvironment();
			};
			const preparation = readWorkerProjectPreparation(params.environment.profileSnapshot.project);
			let preparedRepository;
			if (preparation) {
				const prepared = await environments.bindPreparedWorkspace({
					environmentId: provisioned.environmentId,
					ownerEpoch,
					sessionId: request.sessionId,
					sessionKey: request.sessionKey,
					preparationKey: preparation.key,
					cacheKey: preparation.cacheKey,
					signal: params.signal,
					assertCurrent: assertSyncOwner
				});
				assertSyncOwner();
				if (project && "source" in project) {
					if (params.workspace.kind !== "repository" || project.source.url !== params.workspace.repository.url) throw new Error("Prepared repository does not match this session's source");
					preparedRepository = {
						baseCommit: project.baseCommit,
						workspaceDir: prepared.workspaceDir,
						sourceManifestRef: prepared.sourceManifestRef,
						preparedManifestRef: prepared.preparedManifestRef
					};
				}
			}
			const synced = params.workspace.kind === "repository" ? await syncSessionRepositoryWorkspace({
				repository: params.workspace.repository,
				preparedRepository,
				tunnel,
				sessionId: request.sessionId,
				sessionKey: request.sessionKey,
				agentId: request.agentId,
				generation: placement.generation,
				gitAuthor,
				runSetupScript: request.runSetupScript,
				recovery: params.recovery,
				assertCurrent: assertSyncOwner
			}) : await tunnel.syncWorkspace({
				source: {
					kind: "local",
					path: params.workspace.path,
					...project ? { projectKey: project.key } : {}
				},
				sessionId: request.sessionId,
				sessionKey: request.sessionKey,
				generation: placement.generation,
				...gitAuthor ? { gitAuthor } : {},
				authorize: assertSyncOwner
			});
			assertSyncOwner();
			params.signal?.throwIfAborted();
			params.authorize?.();
			const assertActivationCurrent = () => {
				assertRequestCurrent();
				requireAttachedEnvironment();
				if (admittedNode && !options.isCurrentNodePlacement?.(admittedNode.node, admittedNode.requirement, request.executionMode)) throw new Error("Worker dispatch lost its current node connection, pairing generation, or command authorization before activation");
			};
			placement = await placements.transition({
				sessionId: request.sessionId,
				from: "syncing",
				to: "starting",
				expectedGeneration: placement.generation,
				patch: {
					workspaceBaseManifestRef: synced.manifestRef,
					remoteWorkspaceDir: synced.remoteWorkspaceDir
				}
			}, assertActivationCurrent);
			reportPlacementTransition(params.onTransition, placement);
			const startingPlacement = placement;
			await requireNodePlacementEligibility(request, requireAttachedEnvironment(), admittedNode?.node);
			requireAttachedEnvironment();
			const activate = async (assertLifecycleCurrent) => {
				const active = await placements.transition({
					sessionId: request.sessionId,
					from: "starting",
					to: "active",
					expectedGeneration: startingPlacement.generation,
					patch: { activeOwnerEpoch: ownerEpoch }
				}, () => {
					assertActivationCurrent();
					assertLifecycleCurrent?.();
				});
				if (active.state !== "active") throw new Error("Worker dispatch activation did not produce an active placement");
				activated = true;
				params.signal?.removeEventListener("abort", stopAttemptTunnel);
				reportPlacementTransition(params.onTransition, active);
				return active;
			};
			const activePlacement = params.recovery ? await activate() : await options.runActivationBarrier({
				sessionId: request.sessionId,
				sessionKey: request.sessionKey,
				agentId: request.agentId,
				executionMode: request.executionMode,
				authorize: params.authorize,
				signal: params.signal,
				activate
			});
			try {
				options.onActivated?.(request);
			} catch {}
			try {
				environments.schedulePreparedRefill(provisioned.environmentId);
			} catch {}
			return activePlacement;
		} catch (error) {
			activationIndeterminate = error instanceof AcceptedWorkspacePublicationIndeterminateError;
			throw error;
		} finally {
			params.signal?.removeEventListener("abort", stopAttemptTunnel);
			if (!activated && !activationIndeterminate && params.signal?.aborted) await environments.stopTunnel(provisioned.environmentId, ownerEpoch);
			await stoppingTunnel;
		}
	};
	const resumeProvisioning = async (placement, reconcileEnvironmentCore, onTransition, runAdmitted = (run) => run()) => {
		const environmentId = placement.environmentId;
		let recoveryRunStarted = false;
		let interruptedByShutdown = false;
		let result;
		let recoveryOwnedPlacement = placement;
		const report = (next) => {
			recoveryOwnedPlacement = next;
			reportPlacementTransition(onTransition, next);
		};
		report(placement);
		const handleRecoveryFailure = async (error) => {
			if (error instanceof AcceptedWorkspacePublicationIndeterminateError) throw error;
			const retained = await retainInterruptedProvisioning(recoveryOwnedPlacement, error);
			if (retained) {
				report(retained);
				interruptedByShutdown = true;
				throw error;
			}
			const current = placements.get(placement.sessionId);
			if (!current || current.state !== "provisioning" && current.state !== "syncing" && current.state !== "starting" || current.state !== recoveryOwnedPlacement.state || current.generation !== recoveryOwnedPlacement.generation || current.environmentId !== environmentId || current.sessionKey !== placement.sessionKey || current.agentId !== placement.agentId || current.executionMode !== placement.executionMode) return;
			const environment = environmentId ? environments.get(environmentId) : void 0;
			if (recoveryRunStarted && current.state === "provisioning" && isPendingProvisioningEnvironment(environment, environmentId)) return;
			const exactEnvironment = environment?.environmentId === environmentId ? environment : null;
			const failed = await failure.teardownEnvironment({
				placement: current,
				environmentId: exactEnvironment?.environmentId ?? null,
				ownerEpoch: exactEnvironment?.ownerEpoch ?? null,
				primaryError: error
			});
			report(failed);
			return failed;
		};
		const recover = async (signal) => {
			try {
				if (!environmentId) throw new Error("Provisioning worker placement has no environment owner");
				await options.runRecoveryBarrier({
					sessionId: placement.sessionId,
					sessionKey: placement.sessionKey,
					agentId: placement.agentId,
					executionMode: placement.executionMode,
					environmentId,
					expectedGeneration: placement.generation,
					signal,
					run: async (workspace, assertCurrent) => {
						recoveryRunStarted = true;
						try {
							signal?.throwIfAborted();
							const initialEnvironment = environments.get(environmentId);
							if (initialEnvironment?.environmentId !== environmentId) throw new Error("Provisioning worker environment record is missing");
							if (initialEnvironment.destroyRequestedAtMs !== null) throw new Error("Provisioning worker environment destruction was requested");
							await reconcileEnvironmentCore(signal);
							signal?.throwIfAborted();
							const current = placements.get(placement.sessionId);
							if (current?.state !== "provisioning" || current.generation !== placement.generation || current.environmentId !== environmentId) throw new Error("Provisioning worker placement changed during restart recovery");
							const environment = environments.get(environmentId);
							if (environment?.environmentId !== environmentId) throw new Error("Provisioning worker environment record is missing");
							if (isPendingProvisioningEnvironment(environment, environmentId)) return;
							let devicePlacement;
							if (environment.nodeDeviceId) {
								if (!options.resolveDevicePlacementRequirement) throw new Error("Node-backed recovery has no authoritative runtime requirement");
								devicePlacement = await options.resolveDevicePlacementRequirement({
									sessionId: placement.sessionId,
									sessionKey: placement.sessionKey,
									agentId: placement.agentId,
									executionMode: placement.executionMode
								});
							}
							result = await continueProvisionedDispatch({
								request: {
									sessionId: placement.sessionId,
									sessionKey: placement.sessionKey,
									agentId: placement.agentId,
									profileId: environment.profileId,
									executionMode: placement.executionMode,
									...devicePlacement ? { devicePlacement } : {},
									...environment.providerId === "device" && environment.nodeDeviceId ? { deviceId: environment.nodeDeviceId } : {}
								},
								placement: current,
								environment,
								expectedEnvironmentId: environmentId,
								workspace,
								onTransition: report,
								signal,
								authorize: assertCurrent,
								recovery: true
							});
						} catch (error) {
							result = await handleRecoveryFailure(error);
						}
					}
				});
			} catch (error) {
				if (interruptedByShutdown) throw error;
				result = await handleRecoveryFailure(error);
			}
			return result;
		};
		try {
			return await runAdmitted(recover);
		} catch (error) {
			if (interruptedByShutdown || !(error instanceof WorkerPlacementAdmissionTargetError)) throw error;
			return await handleRecoveryFailure(error);
		}
	};
	return {
		bindPreparedPlacement,
		validateDevicePlacement,
		continueProvisionedDispatch,
		retainInterruptedProvisioning,
		resumeProvisioning
	};
}
//#endregion
//#region src/gateway/worker-environments/placement-move-abandon.ts
function createWorkerPlacementMoveAbandonment(options) {
	const { environments, placements } = options;
	const forceDestroyEnvironment = async (environmentId, onCleanupError) => await options.workspaceOperations.run(environmentId, async () => {
		const environment = environments.get(environmentId);
		const sessionId = environment?.attachedSessionIds[0];
		const abandonment = environment?.providerId === "device" && environment.nodeDeviceId && environment.sharedHost !== false && environment.attachedSessionIds.length === 1 && sessionId ? {
			sessionId,
			ownerEpoch: environment.ownerEpoch
		} : void 0;
		try {
			return await environments.destroy(environmentId, abandonment, () => forceAbandonWorkerEnvironment({
				placements,
				environmentId,
				resolveWorkspace: options.resolveWorkspace,
				onCleanupError
			}));
		} catch (error) {
			const current = environments.get(environmentId);
			if (!current || !isUnavailableEnvironment(current)) throw error;
			reportWorkerAbandonmentCleanupError(onCleanupError, error);
			return current;
		}
	});
	const validateAbandonSource = (request) => {
		const current = placements.get(request.sessionId);
		if (current?.state !== "active" && !isForceAbandonedWorkerPlacement(current) || current.generation !== request.source.generation || current.environmentId !== request.source.environmentId || current.activeOwnerEpoch !== request.source.ownerEpoch) throw new Error(`Cannot abandon stale worker placement for session ${request.sessionKey}`);
		if (isForceAbandonedWorkerPlacement(current)) return;
		const runner = options.runnerAvailability.read(current);
		if (!runner) throw new Error("Continue on Gateway can abandon only an active paired-device placement with a known runner binding");
		if (runner.status === "available") throw new Error("Device runner is available; use Move session so OpenClaw can reconcile its workspace safely");
	};
	const abandonSource = async (request, intent, authorize) => {
		const current = placements.get(request.sessionId);
		if (!current || current.state !== "active" && current.state !== "draining" && current.state !== "reconciling" && current.state !== "failed" || current.environmentId !== intent.source.environmentId || current.activeOwnerEpoch !== intent.source.ownerEpoch) throw new Error(`Session ${request.sessionKey} abandonment source changed before teardown`);
		await options.workspaceOperations.run(intent.source.environmentId, async () => {
			await forceAbandonWorkerEnvironment({
				placements,
				environmentId: intent.source.environmentId,
				resolveWorkspace: options.resolveWorkspace
			});
			const failed = placements.get(request.sessionId);
			if (!isForceAbandonedWorkerPlacement(failed)) throw new Error(`Session ${request.sessionKey} abandonment did not fence its remote owner`);
			const assertCurrent = () => {
				authorize?.();
				const latest = placements.get(request.sessionId);
				if (!isForceAbandonedWorkerPlacement(latest) || latest.generation !== failed.generation || latest.environmentId !== intent.source.environmentId || latest.activeOwnerEpoch !== intent.source.ownerEpoch || placements.getPlacementMove(request.sessionId)?.operationId !== intent.operationId) throw new Error(`Session ${request.sessionKey} abandonment source changed during Gateway preparation`);
			};
			assertCurrent();
			if (intent.target.kind === "gateway") {
				if (options.prepareGatewayMove) await options.prepareGatewayMove({
					...request,
					assertCurrent
				});
				else if ((await options.resolveWorkspace(failed)).kind === "repository") throw new Error("Repository workspace Gateway materialization is unavailable");
				assertCurrent();
			}
			if (environments.get(intent.source.environmentId)) await environments.destroy(intent.source.environmentId, {
				sessionId: intent.sessionId,
				ownerEpoch: intent.source.ownerEpoch,
				authorize: assertCurrent
			});
		});
		authorize?.();
		const failed = placements.get(request.sessionId);
		if (failed?.state !== "failed") throw new Error(`Session ${request.sessionKey} abandonment did not fence its remote owner`);
		const local = placements.completeAbandonedPlacementMoveSourceToLocal({
			operationId: intent.operationId,
			sessionId: intent.sessionId,
			expectedGeneration: failed.generation,
			expectedRecoveryError: FORCED_WORKER_ABANDONMENT_ERROR
		});
		if (local.state !== "local") throw new Error(`Session ${request.sessionKey} abandonment did not finish on the Gateway`);
		return local;
	};
	return {
		abandonSource,
		forceDestroyEnvironment,
		validateAbandonSource
	};
}
//#endregion
//#region src/gateway/worker-environments/placement-move-service.ts
const RESTART_AUTHORITY_EXPIRED = "Cloud worker move request authority expired after Gateway restart; retry move";
function createWorkerPlacementMoveService(options) {
	const recordError = (intent, error) => {
		options.placements.recordPlacementMoveError({
			operationId: intent.operationId,
			sessionId: intent.sessionId,
			error: error instanceof Error ? error.message : String(error)
		});
	};
	const move = async (request, onTransition, authorize, signal) => {
		const assertCurrent = signal ? () => {
			signal.throwIfAborted();
			authorize?.();
		} : authorize;
		let intent;
		let local;
		try {
			signal?.throwIfAborted();
			if (request.abandonSource && request.target.kind !== "gateway") throw new Error("Source abandonment is available only when continuing on the Gateway");
			const destination = request.target.kind === "gateway" ? void 0 : await options.resolveDestination(request, request.target);
			if (request.target.kind !== "gateway" && !destination) throw new Error(`Session ${request.sessionKey} worker move target is unavailable`);
			intent = (await options.runMoveBarrier({
				sessionId: request.sessionId,
				sessionKey: request.sessionKey,
				agentId: request.agentId,
				sourceDisposition: request.abandonSource ? "abandon" : "reconcile",
				authorize: assertCurrent,
				signal,
				begin: async (prepareNew) => {
					const moveRequest = {
						sessionId: request.sessionId,
						source: request.source,
						target: request.target,
						...request.abandonSource ? { abandonSource: true } : {}
					};
					if (request.abandonSource && !options.placements.getPlacementMove(request.sessionId)) {
						options.validateAbandonSource(request);
						const placement = options.placements.get(request.sessionId);
						const claim = placement ? projectWorkerSessionTurnClaim(placement) : void 0;
						if (claim && prepareNew) {
							await prepareNew(claim.runId);
							const current = options.placements.get(request.sessionId);
							if (!current || !isCurrentPlacementTurnClaim(current, claim)) throw new Error(`Session ${request.sessionKey} abandonment worker turn changed; retry`);
							options.validateAbandonSource(request);
						}
					}
					const started = options.placements.beginPlacementMove(moveRequest);
					if (started.placement.state !== "draining" && !(request.abandonSource && isForceAbandonedWorkerPlacement(started.placement))) throw new Error(`Session ${request.sessionKey} placement move is already in ${started.placement.state}`);
					reportPlacementTransition(onTransition, started.placement);
					return {
						...started,
						placement: started.placement
					};
				}
			})).intent;
			local = request.abandonSource ? await options.abandonSource(request, intent, assertCurrent) : await options.reclaimSource(request, intent, assertCurrent, onTransition);
			if (request.abandonSource) reportPlacementTransition(onTransition, local);
			if (local.state !== "local") throw new Error(`Session ${request.sessionKey} move did not return to local placement`);
			if (!destination) return local;
			const active = await options.dispatch({
				sessionId: request.sessionId,
				sessionKey: request.sessionKey,
				agentId: request.agentId,
				...destination,
				idempotencyKey: `session-move:${intent.operationId}:dispatch`
			}, onTransition, assertCurrent, signal);
			const completed = options.placements.completePlacementMoveToWorker({
				operationId: intent.operationId,
				sessionId: request.sessionId,
				expectedGeneration: active.generation,
				environmentId: active.environmentId,
				ownerEpoch: active.activeOwnerEpoch
			});
			if (completed.state !== "active") throw new Error(`Session ${request.sessionKey} move did not finish active`);
			return completed;
		} catch (error) {
			if (intent && local?.state === "local" && signal?.aborted && error === signal.reason && matchesWorkerPlacementTarget(options.placements.get(request.sessionId), local)) {
				options.placements.cancelPlacementMove({
					operationId: intent.operationId,
					sessionId: request.sessionId
				});
				return local;
			}
			const durableIntent = intent ?? options.placements.getPlacementMove(request.sessionId);
			if (durableIntent) recordError(durableIntent, error);
			throw error;
		}
	};
	const recover = async (intent, initialPlacement) => {
		try {
			let placement = initialPlacement;
			if (!placement) throw new Error(`Session ${intent.sessionId} placement move lost its session placement`);
			const identity = {
				sessionId: placement.sessionId,
				sessionKey: placement.sessionKey,
				agentId: placement.agentId
			};
			if (intent.abandonSource) {
				if (intent.target.kind !== "gateway") throw new Error(`Session ${identity.sessionKey} abandonment intent has a non-Gateway target`);
				if (placement.state === "local") {
					options.placements.cancelPlacementMove(intent);
					return;
				}
				await options.abandonSource(identity, intent);
				return;
			}
			if (placement.state === "failed") {
				if (!isFailedWorkerPlacementEnvironmentGone({
					environmentService: options.environments,
					placement
				})) throw new Error(`Session ${identity.sessionKey} failed move environment must finish teardown before retry`);
				options.placements.cancelPlacementMove(intent);
				return;
			} else if (placement.state === "draining") {
				const local = await options.reclaimSource(identity, intent);
				if (local.state !== "local") throw new Error(`Session ${identity.sessionKey} move recovery did not return local`);
				placement = local;
			} else if (placement.state === "reconciling") {
				const environment = options.environments.get(placement.environmentId);
				if (environment && !isTerminalWorkerEnvironmentState(environment.state)) return;
				const source = placement;
				const assertCurrent = () => {
					const current = options.placements.get(intent.sessionId);
					if (!matchesWorkerPlacementTarget(current, source) || options.placements.getPlacementMove(intent.sessionId)?.operationId !== intent.operationId) throw new Error(`Session ${identity.sessionKey} move recovery lost its source owner`);
				};
				if (intent.target.kind === "gateway") {
					await options.prepareGatewayMove?.({
						...identity,
						assertCurrent
					});
					assertCurrent();
				}
				placement = options.placements.completePlacementMoveSourceToLocal({
					operationId: intent.operationId,
					sessionId: intent.sessionId,
					expectedGeneration: placement.generation
				});
			} else if (placement.state === "active") {
				if (placement.environmentId === intent.source.environmentId && placement.activeOwnerEpoch === intent.source.ownerEpoch) throw new Error(`Session ${identity.sessionKey} move recovery found an active source`);
				options.placements.completePlacementMoveToWorker({
					operationId: intent.operationId,
					sessionId: intent.sessionId,
					expectedGeneration: placement.generation,
					environmentId: placement.environmentId,
					ownerEpoch: placement.activeOwnerEpoch
				});
				return;
			} else if (placement.state !== "local") return;
			if (intent.target.kind === "gateway") {
				if (options.placements.getPlacementMove(intent.sessionId)) options.placements.cancelPlacementMove(intent);
				return;
			}
			await options.placements.fail({
				sessionId: placement.sessionId,
				expectedGeneration: placement.generation,
				recoveryError: RESTART_AUTHORITY_EXPIRED
			});
			options.placements.cancelPlacementMove(intent);
		} catch (error) {
			recordError(intent, error);
			throw error;
		}
	};
	const recoverSession = async (projection, environmentId) => {
		const protectedSessions = /* @__PURE__ */ new Set();
		for (const intent of projection.moves.values()) {
			const placement = projection.placements.get(intent.sessionId);
			if (environmentId !== void 0 && intent.source.environmentId !== environmentId && placement?.environmentId !== environmentId) continue;
			const state = placement?.state;
			if (intent.abandonSource && state !== "local" || state === "draining" || state === "reconciling") protectedSessions.add(intent.sessionId);
			await recover(intent, placement).catch(() => void 0);
		}
		return protectedSessions;
	};
	return {
		move,
		recoverSession
	};
}
//#endregion
//#region src/gateway/worker-environments/placement-reclaim.ts
function createWorkerPlacementReclaim(options) {
	const { environments, placements } = options;
	const reclaimOnce = async (request, moveIntent, authorize, beforeDrain, onTransition) => await options.runReclaimBarrier({
		...request,
		authorize,
		beforeDrain,
		begin: async (assertCurrent) => {
			const current = placements.get(request.sessionId);
			if (current?.state === "reclaimed" && current.sessionKey === request.sessionKey && current.agentId === request.agentId) return current;
			if (current?.state !== "active" && current?.state !== "draining" || current.turnClaim) throw new Error(`Session ${request.sessionKey} cannot stop cloud worker from placement ${current?.state ?? "missing"}`);
			const environment = environments.get(current.environmentId);
			if (!isExactAttachedEnvironment(environment, current)) throw new Error("Active cloud worker does not match its session placement");
			if (current.state === "draining") return current;
			let draining;
			try {
				draining = await placements.startDrain({
					sessionId: current.sessionId,
					environmentId: current.environmentId,
					ownerEpoch: current.activeOwnerEpoch,
					expectedGeneration: current.generation,
					expectedUpdatedAtMs: current.updatedAtMs,
					requireUnclaimed: true
				}, () => {
					assertCurrent?.();
					beforeDrain?.assertCurrent?.();
					if (!isExactAttachedEnvironment(environments.get(current.environmentId), current)) throw new Error("Active cloud worker does not match its session placement");
				});
			} catch (error) {
				if (!(error instanceof AcceptedWorkspacePublicationIndeterminateError)) beforeDrain?.();
				throw error;
			}
			if (draining.state !== "draining") throw new Error(`Session ${request.sessionKey} did not enter draining placement`);
			reportPlacementTransition(onTransition, draining);
			return draining;
		},
		reclaim: async (workspace, current, reauthorize) => {
			if (current.state === "reclaimed") return current;
			const root = sessionWorkspaceRoot(workspace);
			const journalPlacement = { ...current };
			const reclaimClaimId = `reclaim-${randomUUID()}`;
			const reclaimClaim = await placements.claimReclaimWorkspaceResult({
				sessionId: current.sessionId,
				sessionKey: current.sessionKey,
				agentId: current.agentId,
				claimId: reclaimClaimId,
				runId: reclaimClaimId,
				owner: placementTurnOwner(current)
			}, void 0, reauthorize);
			return await options.withPreparedRecovery(current, () => {
				reauthorize?.();
				if (!placements.validateWorkspaceResultClaim(reclaimClaim)) throw new Error("Cloud worker stop lost its durable result owner");
			}, async (recovery) => {
				if (recovery.workspace.kind !== workspace.kind || sessionWorkspaceRoot(recovery.workspace) !== sessionWorkspaceRoot(workspace)) throw new Error("Cloud worker stop workspace changed during preparation");
				const reclaimResultRef = workerWorkspaceResultRef(reclaimClaim.claimId);
				const { adapter: journal, wasAccepted } = createWorkspaceResultJournal({
					placement: journalPlacement,
					placements,
					turnClaim: reclaimClaim,
					assertCurrent: recovery.assertCurrent
				});
				const cancelUnstagedFailedReclaim = async (allowCommitted) => {
					await options.workspaceOperations.run(current.environmentId, async () => {
						const stillOwnsEmptyResult = () => {
							const owned = placements.get(current.sessionId);
							const currentEnvironment = environments.get(current.environmentId);
							const pendingResult = placements.preparedWorkspaceResult(reclaimClaim);
							return (allowCommitted || !wasAccepted()) && owned?.state === "draining" && owned.turnClaim?.claimId === reclaimClaim.claimId && reclaimClaim.owner.environmentId === current.environmentId && reclaimClaim.owner.ownerEpoch === current.activeOwnerEpoch && currentEnvironment?.state === "attached" && currentEnvironment.ownerEpoch === reclaimClaim.owner.ownerEpoch && currentEnvironment.attachedSessionIds.length === 1 && currentEnvironment.attachedSessionIds[0] === owned.sessionId && pendingResult?.workspaceAcceptedAtMs === null && pendingResult.stagedResultRef === null;
						};
						if (!stillOwnsEmptyResult()) return;
						const [canonicalExists, preparedExists] = await Promise.all([hasWorkerWorkspaceResultRef({
							root,
							stagedResultRef: reclaimResultRef
						}), hasWorkerWorkspaceResultRef({
							root,
							stagedResultRef: preparedWorkerWorkspaceResultRef(reclaimResultRef)
						})]);
						if (!canonicalExists && !preparedExists && stillOwnsEmptyResult()) {
							recovery.assertCurrent();
							await placements.closeWorkerTurnToolState(reclaimClaim);
							recovery.assertCurrent();
							await placements.cancelWorkspaceResultAndReleaseTurn(reclaimClaim, void 0, reauthorize);
						}
					});
				};
				const finishReclaim = async () => {
					const pending = await journal.load();
					if (pending) {
						reauthorize?.();
						if (workspace.kind !== "local") throw new Error("Repository checkpoints cannot own a local reconciliation journal");
						await recoverWorkerWorkspaceReconciliation({
							root,
							journal: pending,
							assertCurrent: recovery.assertCurrent
						});
						reauthorize?.();
						await journal.abort();
					}
					recovery.assertCurrent();
					const tunnel = await environments.startTunnel({
						environmentId: current.environmentId,
						ownerEpoch: current.activeOwnerEpoch
					});
					const reclaimed = await options.workspaceOperations.run(current.environmentId, async () => {
						const assertCurrent = () => {
							recovery.assertCurrent();
							reauthorize?.();
							const owned = placements.preparedWorkspaceResultPlacement(reclaimClaim);
							if (owned?.state !== "draining" || owned.generation !== current.generation || owned.environmentId !== current.environmentId || owned.activeOwnerEpoch !== current.activeOwnerEpoch || owned.turnClaim?.claimId !== reclaimClaim.claimId || !placements.validateWorkspaceResultClaim(reclaimClaim)) throw new Error("Cloud worker stop lost its placement owner before reconciliation");
						};
						assertCurrent();
						reauthorize?.();
						const quiescence = await tunnel.quiesceWorkspace(current.remoteWorkspaceDir);
						try {
							assertCurrent();
							const reconciliation = await tunnel.reconcileWorkspace(createWorkerWorkspaceReconcileRequest({
								workspace,
								remoteWorkspaceDir: current.remoteWorkspaceDir,
								baseManifestRef: current.workspaceBaseManifestRef,
								journal,
								stagedResult: {
									ref: reclaimResultRef,
									record: (ref) => {
										assertCurrent();
										return placements.recordStagedWorkspaceResult(reclaimClaim, ref, workspace.kind === "repository" ? workspace.repository.workspaceId : void 0, assertCurrent);
									}
								},
								assertCurrent
							}));
							const applied = await verifyReconciledWorkspaceFinal(reconciliation, quiescence);
							if (reconciliation.changed && !wasAccepted()) throw new Error("Cloud worker stop did not commit its reconciled workspace");
							reauthorize?.();
							assertCurrent();
							await placements.acceptWorkspaceResult(reclaimClaim, reauthorize);
							const recordedStagedResultRef = (await findPendingWorkerWorkspaceResult(placements, reclaimClaim))?.stagedResultRef;
							const conflictPaths = applied?.conflictPaths ?? [];
							if (conflictPaths.length > 0 && !recordedStagedResultRef) throw new Error("Cloud worker stop conflict has no staged result reference");
							const priorWorkspaceResultConflict = await resolvePriorWorkspaceResultConflict(recovery.resolveConflict, current);
							reauthorize?.();
							const finalized = await finalizeWorkspaceResultConflicts({
								assertCurrent: recovery.assertCurrent,
								placements,
								turnClaim: reclaimClaim,
								conflictPaths,
								priorConflict: priorWorkspaceResultConflict,
								stagedResultRef: recordedStagedResultRef,
								retainPriorConflict: !reconciliation.changed,
								workspace,
								report: recovery.reportConflict
							});
							reauthorize?.();
							return await settleStagedWorkspaceResult({
								assertCurrent: recovery.assertCurrent,
								placements,
								turnClaim: reclaimClaim,
								workspace,
								stagedResultRef: recordedStagedResultRef,
								conflictRetained: finalized.conflictRetained,
								beforeComplete: async () => {
									assertCurrent();
									if (workspace.kind === "repository" && moveIntent?.target.kind === "gateway") {
										if (!options.prepareGatewayMove) throw new Error("Repository workspace materialization is unavailable");
										await options.prepareGatewayMove({
											sessionId: current.sessionId,
											sessionKey: current.sessionKey,
											agentId: current.agentId,
											assertCurrent
										});
										assertCurrent();
									}
									await environments.destroy(current.environmentId);
								},
								complete: async () => {
									const completed = moveIntent ? await completeMovedWorkspaceTeardown({
										placements,
										turnClaim: reclaimClaim,
										environmentId: current.environmentId,
										ownerEpoch: current.activeOwnerEpoch,
										operationId: moveIntent.operationId
									}) : await completeReclaimedWorkspaceTeardown({
										placements,
										turnClaim: reclaimClaim,
										environmentId: current.environmentId,
										ownerEpoch: current.activeOwnerEpoch
									});
									reportPlacementTransition(onTransition, completed);
									return completed;
								},
								validateCompleted: (completed) => {
									const expectedState = moveIntent ? "local" : "reclaimed";
									if (completed.state !== expectedState) throw new Error(`Cloud worker teardown did not produce ${expectedState} placement`);
								}
							});
						} finally {
							if (isExactAttachedEnvironment(environments.get(current.environmentId), current)) await quiescence.resume();
						}
					});
					if (reclaimed.state !== "local" && reclaimed.state !== "reclaimed") throw new Error("Cloud worker teardown produced a nonterminal placement");
					try {
						await environments.stopTunnel(current.environmentId, current.activeOwnerEpoch);
					} catch {}
					return reclaimed;
				};
				try {
					return await finishReclaim();
				} catch (error) {
					if (error instanceof AcceptedWorkspacePublicationIndeterminateError) throw error;
					await cancelUnstagedFailedReclaim(error instanceof WorkerWorkspaceFinalFenceError && error.reclaimDisposition === "retry").catch(() => void 0);
					const pendingReclaimResult = await findPendingWorkerWorkspaceResult(placements, reclaimClaim);
					if (pendingReclaimResult && pendingReclaimResult.workspaceAcceptedAtMs !== null) await placements.handoffWorkspaceResultRecovery(reclaimClaim);
					throw error;
				}
			});
		}
	});
	return reclaimOnce;
}
//#endregion
//#region src/gateway/worker-environments/placement-dispatch.ts
function createWorkerPlacementDispatchService(options) {
	const { environments, placements } = options;
	const failure = createPlacementFailureActions({
		environments,
		placements
	});
	const startup = createWorkerPlacementDispatchStartup({
		...options,
		failure
	});
	const recoveryEnvironments = {
		...environments,
		destroy: environments.requestDestroy
	};
	const recovery = createPlacementRecoveryActions({
		...options,
		environments: recoveryEnvironments,
		failure: createPlacementFailureActions({
			environments: recoveryEnvironments,
			placements
		}),
		recoverPlacementMoves: (projection, environmentId) => moveService.recoverSession(projection, environmentId)
	});
	const dispatch = async (request, onTransition, authorize, signal) => {
		const assertCurrent = () => {
			signal?.throwIfAborted();
			authorize?.();
		};
		let placement;
		try {
			signal?.throwIfAborted();
			placement = await options.runLocalBarrier({
				sessionId: request.sessionId,
				sessionKey: request.sessionKey,
				agentId: request.agentId,
				executionMode: request.executionMode,
				authorize: assertCurrent,
				signal,
				startDispatch: async () => {
					placement = await placements.startDispatch({
						sessionId: request.sessionId,
						sessionKey: request.sessionKey,
						agentId: request.agentId,
						executionMode: request.executionMode,
						...request.expectedPlacement ? { expectedPlacement: request.expectedPlacement } : {}
					}, { assertCurrent });
					reportPlacementTransition(onTransition, placement);
					return placement;
				}
			});
			if (!request.deviceId && request.devicePlacement?.requiredNodeCommands.length && environments.requiresNodeEnrollment?.(request.profileId, request.inheritedProfile?.providerId)) {
				const allowlist = resolveNodeCommandAllowlist(getRuntimeConfig());
				const deniedCommand = request.devicePlacement.requiredNodeCommands.find((command) => !allowlist.has(command));
				if (deniedCommand) throw new Error(`cloud worker node command ${deniedCommand} is not enabled; add it to gateway.nodes.commands.allow and approve the command on the node`);
			}
			await startup.validateDevicePlacement(request);
			signal?.throwIfAborted();
			const workspace = await options.resolveWorkspace(request);
			if (workspace.kind === "repository" && !request.deviceId && environments.requiresNodeEnrollment?.(request.profileId, request.inheritedProfile?.providerId) !== true) throw new Error("Repository cloud sessions require a managed-node cloud provider or paired node. Choose one and retry dispatch.");
			const projectPath = workspace.kind === "local" ? workspace.path : void 0;
			await startup.validateDevicePlacement(request);
			const preparedIntent = !request.deviceId ? await environments.prepareProjectIntent(request.profileId, {
				machineClass: request.machineClass,
				executionMode: request.executionMode,
				projectPath,
				...workspace.kind === "repository" ? { repository: {
					agentId: request.agentId,
					url: workspace.repository.url,
					ref: workspace.repository.requestedRef ?? void 0,
					baseCommit: workspace.repository.baseCommit ?? void 0
				} } : {},
				inherited: request.inheritedProfile,
				signal,
				os: request.os,
				runSetupScript: workspace.kind === "repository" ? workspace.repository.runSetupScript && request.runSetupScript !== false : request.runSetupScript,
				setupAuthorized: request.runSetupScript !== void 0
			}) : void 0;
			assertCurrent();
			const prepared = preparedIntent ? await startup.bindPreparedPlacement({
				request,
				placement,
				intent: preparedIntent,
				assertCurrent
			}) : void 0;
			assertCurrent();
			const idempotencyKey = request.idempotencyKey ?? `session-dispatch:${request.sessionId}:${placement.generation}`;
			const expectedEnvironmentId = prepared?.environment.environmentId ?? deriveEnvironmentIntent(idempotencyKey).environmentId;
			placement = prepared?.placement ?? await placements.transition({
				sessionId: request.sessionId,
				from: "requested",
				to: "provisioning",
				expectedGeneration: placement.generation,
				patch: { environmentId: expectedEnvironmentId }
			}, assertCurrent);
			reportPlacementTransition(onTransition, placement);
			assertCurrent();
			const environment = prepared ? prepared.environment : await environments.createWithRequest({
				profileId: request.profileId,
				idempotencyKey,
				machineClass: request.machineClass,
				executionMode: request.executionMode,
				projectPath,
				signal,
				os: request.os,
				runSetupScript: request.runSetupScript,
				admittedIntent: preparedIntent,
				inheritedProfile: request.inheritedProfile
			});
			return await startup.continueProvisionedDispatch({
				request,
				placement,
				environment,
				expectedEnvironmentId,
				workspace,
				onTransition,
				authorize: assertCurrent,
				signal,
				...prepared ? { admittedNode: prepared.admittedNode } : {}
			});
		} catch (error) {
			if (error instanceof AcceptedWorkspacePublicationIndeterminateError) throw error;
			try {
				if (placement && await startup.retainInterruptedProvisioning(placement, error)) throw error;
				const current = placement ? placements.get(request.sessionId) : void 0;
				if (current && current.state !== "local" && current.state !== "reclaimed") {
					if (current.state === "active") await failure.failActive(current, error);
					else {
						const currentEnvironment = current.environmentId ? environments.get(current.environmentId) : void 0;
						const ownedEnvironment = currentEnvironment?.environmentId === current.environmentId ? currentEnvironment : void 0;
						await failure.teardownEnvironment({
							placement: current,
							environmentId: ownedEnvironment?.environmentId ?? null,
							ownerEpoch: ownedEnvironment?.ownerEpoch ?? null,
							primaryError: error
						});
					}
				}
			} finally {
				const finalPlacement = placements.get(request.sessionId);
				if (finalPlacement) reportPlacementTransition(onTransition, finalPlacement);
			}
			throw error;
		}
	};
	const reclaimOnce = createWorkerPlacementReclaim(options);
	const reclaimCurrent = async (request, authorize, beforeDrain, initial, completedOperation, onTransition) => {
		authorize?.();
		beforeDrain?.();
		const current = placements.get(request.sessionId);
		if (current?.state === "reclaimed") return current;
		if (current?.state === "local" && matchesWorkerPlacementTarget(current, completedOperation)) return current;
		try {
			const owned = current?.state === "local" && initial?.state === "failed" ? initial : current;
			if (owned?.state === "failed" || owned?.state === "provisioning") return await options.runFailedReclaimBarrier({
				...request,
				authorize,
				reclaim: async (reauthorize) => {
					if (request.recoverToGateway) beforeDrain?.();
					let failedPlacement = placements.get(request.sessionId);
					if (owned.state === "provisioning") {
						failedPlacement = await failure.cancelProvisioning(failedPlacement, initial, reauthorize);
						reportPlacementTransition(onTransition, failedPlacement);
					}
					if (failedPlacement?.state === "local" && owned.state === "failed" && failedPlacement.generation === owned.generation + 1 && failedPlacement.sessionKey === request.sessionKey && failedPlacement.agentId === request.agentId) return failedPlacement;
					if (failedPlacement?.state !== "failed") throw new Error("Failed cloud worker placement changed during reclaim");
					const cleanupError = await failure.retryFailedTeardown(failedPlacement, reauthorize);
					const failed = placements.get(request.sessionId);
					if (failed?.state !== "failed") throw new Error("Failed cloud worker placement changed during reclaim");
					if (!isFailedWorkerPlacementEnvironmentGone({
						environmentService: environments,
						placement: failed
					})) throw new Error(cleanupError ?? "Failed cloud worker environment cleanup is still pending");
					if (request.recoverToGateway) {
						const assertCurrent = () => {
							reauthorize?.();
							beforeDrain?.();
						};
						assertCurrent();
						if (options.prepareGatewayMove) await options.prepareGatewayMove({
							...request,
							assertCurrent
						});
						else if ((await options.resolveWorkspace(request)).kind === "repository") throw new Error("Repository workspace Gateway materialization is unavailable");
						assertCurrent();
					}
					const local = await placements.transition({
						sessionId: request.sessionId,
						from: "failed",
						to: "local",
						expectedGeneration: failed.generation
					}, request.recoverToGateway ? reauthorize : void 0);
					if (local.state !== "local") throw new Error("Failed cloud worker reclaim did not produce a local placement");
					reportPlacementTransition(onTransition, local);
					return local;
				}
			});
			return await reclaimOnce(request, void 0, authorize, beforeDrain, onTransition);
		} catch (error) {
			const completed = placements.get(request.sessionId);
			if (error instanceof WorkerTunnelOwnerDisconnectedError && completed?.state === "reclaimed") return completed;
			throw error;
		}
	};
	const reclaim = async (request, authorize, beforeDrain, serialize = async (run) => await run(), pendingOperations, onTransition) => {
		const assertGatewayRecoverySource = () => {
			if (!request.recoverToGateway) return;
			const source = placements.get(request.sessionId);
			if (source?.state !== "failed" || source.generation !== request.recoverToGateway.expectedGeneration || source.sessionKey !== request.sessionKey || source.agentId !== request.agentId) throw new Error(`Session ${request.sessionKey} changed before Gateway recovery. Retry.`);
			if (!isFailedWorkerPlacementEnvironmentGone({
				environmentService: environments,
				placement: source
			})) throw new Error("Failed cloud worker environment cleanup is still pending; use Stop cloud worker");
		};
		authorize?.();
		beforeDrain?.();
		assertGatewayRecoverySource();
		const initial = placements.get(request.sessionId);
		if (initial) reportPlacementTransition(onTransition, initial);
		const checkSource = Object.assign(() => {
			beforeDrain?.(pendingOperations?.currentPlacement());
			assertGatewayRecoverySource();
		}, { assertCurrent: beforeDrain?.assertCurrent });
		return await options.runReclaimPreparation({
			...request,
			authorize,
			beforeDrain: checkSource,
			pendingOperations,
			run: (reauthorize) => serialize(() => reclaimCurrent(request, reauthorize, checkSource, initial, pendingOperations?.completedPlacement(), onTransition))
		});
	};
	const abandonment = createWorkerPlacementMoveAbandonment(options);
	const moveService = createWorkerPlacementMoveService({
		placements,
		environments,
		runMoveBarrier: options.runMoveBarrier,
		dispatch,
		reclaimSource: (request, intent, authorize, onTransition) => reclaimOnce(request, intent, authorize, void 0, onTransition),
		validateAbandonSource: abandonment.validateAbandonSource,
		abandonSource: abandonment.abandonSource,
		resolveDestination: options.resolveMoveDestination,
		prepareGatewayMove: options.prepareGatewayMove
	});
	return {
		dispatch,
		forceDestroyEnvironment: abandonment.forceDestroyEnvironment,
		getEnvironmentAttachedSessionIds: (environmentId) => environments.get(environmentId)?.attachedSessionIds ?? [],
		async readEnvironmentSessionIds(environmentId) {
			const sessionIds = (await placements.readChangeSnapshot()).map(({ sessionId }) => sessionId);
			const facts = await placements.readProjection(sessionIds, { current: true });
			return [.../* @__PURE__ */ new Set([
				...environments.get(environmentId)?.attachedSessionIds ?? [],
				...[...facts.placements.values()].filter((placement) => placement.environmentId === environmentId).map(({ sessionId }) => sessionId),
				...[...facts.moves.values()].filter((move) => move.source.environmentId === environmentId).map(({ sessionId }) => sessionId)
			])];
		},
		move: moveService.move,
		reclaim,
		reconcile: recovery.reconcile,
		reconcileActive: recovery.reconcileActive,
		resumeProvisioning: startup.resumeProvisioning
	};
}
//#endregion
//#region src/gateway/worker-environments/placement-idle-sweep.ts
var WorkerPlacementAutoSuspendBusyError = class extends Error {};
function createWorkerPlacementIdleSweep(options) {
	const now = options.now ?? Date.now;
	const loadSessionRuntime = options.loadSessionRuntime;
	const getSessionWorkAdmissionCheck = options.getSessionWorkAdmissionCheck ?? (loadSessionRuntime && (async ({ sessionId, sessionKey, agentId }) => {
		const target = (await loadSessionRuntime()).resolveGatewaySessionStoreTargetWithStore({
			cfg: options.getConfig(),
			key: sessionKey,
			agentId,
			clone: false
		});
		const identities = [
			sessionKey,
			target.canonicalKey,
			...target.storeKeys,
			sessionId
		];
		return () => isSessionWorkAdmissionActive(target.storePath, identities) || hasPendingFollowupQueueWork(identities);
	}));
	return { async sweep() {
		const profiles = options.getConfig().cloudWorkers?.profiles;
		if (!profiles || !Object.values(profiles).some((profile) => profile.suspendAfter)) return;
		const candidates = await options.placements.readRecoveryCandidates();
		const projection = await options.placements.readProjection(candidates.map(({ sessionId }) => sessionId), { current: true });
		for (const { sessionId } of candidates) {
			const placement = projection.placements.get(sessionId);
			if (placement?.state !== "active" || placement.turnClaim) continue;
			const environment = options.environments.get(placement.environmentId);
			const suspendAfter = environment && profiles[environment.profileId]?.suspendAfter;
			if (!environment || !suspendAfter) continue;
			if (now() - placement.updatedAtMs < parseDurationMs(suspendAfter)) continue;
			if (projection.workspaceRecoveryPendingSessionIds.has(placement.sessionId) || options.placements.getPlacementMove(placement.sessionId) || options.isPlacementOperationInFlight?.(placement.sessionId)) continue;
			try {
				const request = {
					sessionId: placement.sessionId,
					sessionKey: placement.sessionKey,
					agentId: placement.agentId
				};
				const hasSessionWork = await getSessionWorkAdmissionCheck?.(request);
				const assertCurrent = () => {
					if (options.getConfig().cloudWorkers?.profiles?.[environment.profileId]?.suspendAfter !== suspendAfter || hasSessionWork?.()) throw new WorkerPlacementAutoSuspendBusyError();
				};
				const beforeDrain = Object.assign(() => {
					assertCurrent();
					const current = options.placements.get(placement.sessionId);
					if (current?.state !== "active" || current.generation !== placement.generation || current.environmentId !== placement.environmentId || current.activeOwnerEpoch !== placement.activeOwnerEpoch || current.updatedAtMs !== placement.updatedAtMs || current.turnClaim) throw new WorkerPlacementAutoSuspendBusyError();
				}, { assertCurrent });
				await options.dispatch.reclaim(request, void 0, beforeDrain);
				options.info(`auto-suspended ${placement.sessionKey} after ${suspendAfter} idle; wakes on next message`);
			} catch (error) {
				if (error instanceof WorkerPlacementAutoSuspendBusyError) continue;
				options.warn(`Worker auto-suspend failed (${placement.sessionKey}): ${formatErrorMessage(error)}`);
			}
		}
	} };
}
//#endregion
//#region src/gateway/worker-environments/placement-session-retirement.ts
function createPlacementSessionRetirement(deps) {
	const retireCurrent = (placement) => {
		if (placement.turnClaim) return false;
		if (placement.environmentId !== null && placement.state !== "reclaimed" && (placement.state !== "failed" || !isFailedWorkerPlacementEnvironmentGone({
			environmentService: deps.environments,
			placement
		}))) return false;
		if (placement.state === "provisioning") return false;
		deps.placements.retireSessionPlacement({
			sessionId: placement.sessionId,
			expectedState: placement.state,
			expectedGeneration: placement.generation
		});
		if (placement.state === "requested") deps.warn(`Retired ownerless worker placement ${placement.sessionId} because its authoritative session is absent (${placement.state}@${placement.generation})`);
		return true;
	};
	const reconcilePlacement = async (placement, resolveSessionEvidence) => {
		if (await resolveSessionEvidence(placement) !== "absent") return;
		let current = deps.placements.get(placement.sessionId);
		if (!current) return;
		try {
			if (retireCurrent(current)) return;
		} catch {
			return;
		}
		const environmentId = current.environmentId;
		if (!environmentId) return;
		try {
			await deps.forceDestroyEnvironment(environmentId, (error) => {
				deps.warn(`Worker placement orphan cleanup deferred for ${current?.sessionId ?? placement.sessionId}: ${String(error)}`);
			});
		} catch (error) {
			deps.warn(`Worker placement orphan teardown failed for ${current.sessionId}: ${String(error)}`);
			return;
		}
		current = deps.placements.get(placement.sessionId);
		if (!current) return;
		try {
			retireCurrent(current);
		} catch {}
	};
	const reconcile = async () => {
		const placements = deps.placements.list();
		const resolveSessionEvidence = await deps.createSessionEvidenceResolver(placements);
		for (const placement of placements) try {
			await reconcilePlacement(placement, resolveSessionEvidence);
		} catch (error) {
			deps.warn(`Worker placement session evidence check failed for ${placement.sessionId}: ${String(error)}`);
		}
	};
	return { reconcile };
}
//#endregion
//#region src/gateway/worker-environments/repository-workspace-mutation.ts
function createRepositoryWorkspaceMutationService(options) {
	const { placements, environments } = options;
	return { async mutate(params) {
		params.assertCurrent();
		const placement = placements.get(params.sessionId);
		if (placement?.state !== "active") throw new Error("Repository workspace editing requires an active cloud placement");
		return await options.workspaceOperations.run(placement.environmentId, async () => {
			params.assertCurrent();
			const workspace = await options.resolveWorkspace(params);
			if (workspace.kind !== "repository") throw new Error("Session no longer owns a cloud repository workspace");
			const environment = environments.get(placement.environmentId);
			if (!isCurrentActiveWorkerEnvironment(placement, environment)) throw new Error("Repository workspace environment is no longer current");
			const storePath = resolveSessionStorePathForScope(params);
			const scope = {
				agentId: params.agentId,
				sessionKey: params.sessionKey,
				sessionId: params.sessionId,
				storePath
			};
			const assertEntryCurrent = (entry) => {
				params.assertEntryCurrent?.(entry);
				if (entry?.sessionId !== params.sessionId || entry.repositoryWorkspaceId !== workspace.repository.workspaceId || workspace.repository.agentId !== params.agentId || workspace.repository.sessionKey !== params.sessionKey) throw new Error("Repository workspace edit lost its exact session placement owner");
			};
			const currentEntry = await withSessionEntryReadOnlyInWorker(scope, params.assertCurrent, async (read, owner) => {
				if (!read.ok) throw toErrorObject(read.error, "Repository workspace session read failed");
				assertEntryCurrent(read.value);
				return captureSessionEntryCurrentRead(scope, owner);
			});
			const assertPlacementCurrent = (current) => {
				const currentEnvironment = environments.get(placement.environmentId);
				if (current?.state !== "active" || current.agentId !== params.agentId || current.sessionKey !== params.sessionKey || current.generation !== placement.generation || current.environmentId !== placement.environmentId || current.activeOwnerEpoch !== placement.activeOwnerEpoch || current.remoteWorkspaceDir !== placement.remoteWorkspaceDir || !isCurrentActiveWorkerEnvironment(current, currentEnvironment) || currentEnvironment?.leaseId !== environment?.leaseId) throw new Error("Repository workspace edit lost its exact session placement owner");
			};
			const assertWorkerCurrent = () => {
				params.assertCurrent();
				currentEntry.assertSourceCurrent();
				if (currentEntry.kind !== "file") assertEntryCurrent(currentEntry.readCurrent());
			};
			const currentCheck = {
				...currentEntry.kind === "file" ? { sessionEntry: {
					source: currentEntry.source,
					assertCurrent: assertEntryCurrent
				} } : {},
				assertPlacementCurrent
			};
			const assertOwner = () => {
				assertWorkerCurrent();
				assertEntryCurrent(loadSessionEntryReadOnly(scope));
				assertPlacementCurrent(placements.get(params.sessionId));
			};
			assertOwner();
			const claim = await placements.claimWorkspaceMutationResult({
				sessionId: params.sessionId,
				sessionKey: params.sessionKey,
				agentId: params.agentId,
				claimId: `workspace-mutation-${randomUUID()}`,
				owner: placementTurnOwner(placement)
			}, assertWorkerCurrent, currentCheck);
			const assertCurrent = () => {
				assertOwner();
				if (!placements.validateWorkspaceResultClaim(claim)) throw new Error("Repository workspace edit lost its result custody");
			};
			try {
				assertCurrent();
				const result = await params.mutate(assertCurrent);
				assertCurrent();
				if (!result.changed) {
					await placements.acceptWorkspaceResult(claim, assertWorkerCurrent, currentCheck);
					await placements.completeWorkspaceResultAndReleaseTurn(claim, assertWorkerCurrent, currentCheck);
					return result.value;
				}
				const tunnel = await environments.startTunnel({
					environmentId: placement.environmentId,
					ownerEpoch: placement.activeOwnerEpoch
				});
				assertCurrent();
				if (tunnel.environmentId !== placement.environmentId || tunnel.ownerEpoch !== placement.activeOwnerEpoch) throw new Error("Repository workspace capture tunnel owner changed");
				const quiescence = await tunnel.quiesceWorkspace(placement.remoteWorkspaceDir);
				let resumed = false;
				try {
					assertCurrent();
					const stagedResultRef = workerWorkspaceResultRef(claim.claimId);
					const journal = createWorkspaceResultJournal({
						placement,
						placements,
						turnClaim: claim,
						assertCurrent: assertWorkerCurrent,
						current: currentCheck
					});
					const reconciliation = await tunnel.reconcileWorkspace(createWorkerWorkspaceReconcileRequest({
						workspace,
						remoteWorkspaceDir: placement.remoteWorkspaceDir,
						baseManifestRef: placement.workspaceBaseManifestRef,
						journal: journal.adapter,
						stagedResult: {
							ref: stagedResultRef,
							record: (ref) => placements.recordStagedWorkspaceResult(claim, ref, workspace.repository.workspaceId, assertWorkerCurrent, currentCheck)
						},
						assertCurrent
					}));
					await verifyReconciledWorkspaceFinal(reconciliation, quiescence);
					assertCurrent();
					if (!journal.wasAccepted()) throw new Error("Repository workspace edit was not durably accepted");
					await placements.acceptWorkspaceResult(claim, assertWorkerCurrent, currentCheck);
					await settleStagedWorkspaceResult({
						assertCurrent,
						placements,
						turnClaim: claim,
						workspace,
						stagedResultRef,
						conflictRetained: false,
						complete: () => placements.completeWorkspaceResultAndReleaseTurn(claim, assertWorkerCurrent, currentCheck),
						beforeComplete: async () => {
							await quiescence.resume();
							resumed = true;
							assertCurrent();
						}
					});
					return result.value;
				} finally {
					if (!resumed) await quiescence.resume();
				}
			} catch (error) {
				if (placements.validateWorkspaceResultClaim(claim)) await placements.handoffWorkspaceResultRecovery(claim);
				throw error;
			}
		});
	} };
}
//#endregion
//#region src/gateway/worker-environments/worker-placement-redispatch.ts
function createWorkerPlacementRedispatch(params) {
	return async (placement, { assertCurrent, signal }) => {
		signal?.throwIfAborted();
		assertCurrent();
		const projection = await params.placements.readProjection([placement.sessionId], { current: true });
		signal?.throwIfAborted();
		assertCurrent();
		const current = projection.placements.get(placement.sessionId);
		if (!matchesWorkerPlacementTarget(current, placement) || current?.agentId !== placement.agentId || current.sessionKey !== placement.sessionKey) throw new Error("Worker placement changed before automatic recovery");
		const previousEnvironment = placement.environmentId ? projection.environments.get(placement.environmentId) : void 0;
		if (!previousEnvironment) throw new Error(`Worker placement has no environment record: ${placement.environmentId}. Choose where the session should continue.`);
		if (placement.state === "failed" && !canRedispatchFailedWorkerPlacement(placement, previousEnvironment)) throw new Error(`Worker recovery is not ready: ${placement.recoveryError}`);
		const { profileId, providerId, profileSnapshot, nodeDeviceId } = previousEnvironment;
		const { sessionId, sessionKey, agentId, executionMode } = placement;
		const identity = {
			sessionId,
			sessionKey,
			agentId,
			executionMode
		};
		let devicePlacement;
		if (nodeDeviceId) {
			if (!params.resolveDevicePlacementRequirement) throw new Error("Node-backed redispatch has no authoritative runtime requirement");
			devicePlacement = await params.resolveDevicePlacementRequirement(identity);
		}
		return await params.dispatch({
			...identity,
			profileId,
			expectedPlacement: {
				state: placement.state,
				generation: placement.generation,
				environmentId: placement.environmentId,
				activeOwnerEpoch: placement.activeOwnerEpoch
			},
			...devicePlacement ? { devicePlacement } : {},
			...providerId === "device" && nodeDeviceId ? { deviceId: nodeDeviceId } : {},
			inheritedProfile: {
				providerId,
				profileSnapshot
			}
		}, void 0, assertCurrent, signal);
	};
}
//#endregion
//#region src/gateway/worker-environments/worker-turn-launcher.ts
const loadWorkerTurnExecution = createLazyRuntimeModule(() => import("./worker-turn-execution-BMYJ1p5s.mjs"));
const loadRemoteExecTurn = createLazyRuntimeModule(() => import("./workspace-result-finalize-D4OPgWQ-.mjs"));
const loadPlacementSandbox = createLazyRuntimeModule(() => import("./placement-sandbox-nO_6jXrm.mjs"));
var WorkerRuntimeRefreshInFlightError = class extends Error {};
function createWorkerSessionTurnPlacementProvider(options) {
	const activeWorkerTurns = /* @__PURE__ */ new Map();
	return {
		resolveRuntimeOverride(identity) {
			const placement = options.placements.get(identity.sessionId);
			return placement && placement.state !== "local" && placement.executionMode === "worker-turn" && (identity.agentId === void 0 || placement.agentId === identity.agentId) && (identity.sessionKey === void 0 || placement.sessionKey === identity.sessionKey) ? "openclaw" : void 0;
		},
		assertCompactionSuccessorAllowed({ currentTarget }) {
			const placement = options.placements.get(currentTarget.sessionId);
			if (placement && placement.state !== "local") throw new Error("Compaction cannot change the session ID while a worker placement owns this session. Keep the same session ID, or move the session back to the Gateway before retrying.");
		},
		async recoverTerminalTurn(session, assertCurrent) {
			const active = activeWorkerTurns.get(session.sessionId);
			return active && (!session.sessionKey || active.sessionKey === session.sessionKey) ? await active.recoverTerminal?.(() => {
				assertCurrent?.();
				if (activeWorkerTurns.get(session.sessionId) !== active) throw new Error("Terminal worker recovery lost its active run owner");
			}) : void 0;
		},
		async resolveSandbox(params) {
			const placement = options.placements.get(params.sessionId);
			if (placement?.state !== "active" || placement.executionMode !== "remote-exec" || placement.agentId !== params.agentId || placement.sessionKey !== params.sessionKey) return null;
			const assertCurrentPlacement = (phase) => {
				const current = options.placements.get(params.sessionId);
				if (!matchesWorkerPlacementTarget(current, placement) || current?.executionMode !== "remote-exec" || current.agentId !== placement.agentId || current.sessionKey !== placement.sessionKey) throw new Error(`Remote-exec placement changed while preparing its ${phase}`);
			};
			const workspace = await options.resolveWorkspace({
				sessionId: placement.sessionId,
				agentId: placement.agentId,
				sessionKey: placement.sessionKey
			});
			assertCurrentPlacement("managed workspace");
			const { createRemoteExecPlacementSandbox } = await loadPlacementSandbox();
			assertCurrentPlacement("sandbox");
			const sandbox = await createRemoteExecPlacementSandbox({
				config: params.config,
				environments: options.environments,
				workspaceDir: workspace.kind === "local" ? workspace.path : placement.remoteWorkspaceDir,
				placement
			});
			assertCurrentPlacement("sandbox");
			const currentEnvironment = options.environments.get(placement.environmentId);
			if (currentEnvironment?.state !== "attached" || currentEnvironment.environmentId !== placement.environmentId || currentEnvironment.ownerEpoch !== placement.activeOwnerEpoch || currentEnvironment.attachedSessionIds.length !== 1 || currentEnvironment.attachedSessionIds[0] !== placement.sessionId || sandbox.backendId === "node" && currentEnvironment.nodeDeviceId !== sandbox.placementNodeId) throw new Error("Remote-exec environment changed while preparing its sandbox");
			return sandbox;
		},
		async executeLocalTurn(claim, runLocal, assertCurrent) {
			return await executeLocalTurn({
				claim,
				placements: options.placements,
				runLocal,
				assertCurrent
			});
		},
		async executeTurn(claim, inputTurn, runLocal, onAdmitted, assertRunCurrent) {
			const restartSignal = getGatewayRestartDrainSignal();
			const runLocalTurn = () => executeLocalTurn({
				claim,
				placements: options.placements,
				runLocal,
				assertCurrent: () => {
					inputTurn.abortSignal?.throwIfAborted();
					assertRunCurrent?.();
				}
			});
			const current = options.placements.get(claim.sessionId);
			if (!current && inputTurn.modelRun === true && !claim.sessionKey?.trim()) return await runLocal();
			if (!current || current.state === "local") return await runLocalTurn();
			const hasPendingWorkspaceResultToSettle = async (sessionId, runId) => (await options.placements.listPendingWorkspaceResultsAsync(sessionId)).some((pending) => pending.sessionId === sessionId && (pending.runId !== runId || !options.placements.get(sessionId)?.turnClaim));
			let identity = resolvePlacementIdentity(claim, current);
			const reportProvisioning = () => emitAgentRunStatusEvent({
				runId: claim.runId,
				phase: "provisioning_environment",
				sessionKey: identity.sessionKey,
				agentId: identity.agentId
			});
			let routablePlacement = current;
			let assertInitialSetupCurrent;
			const assertAdmissionCurrent = () => {
				inputTurn.abortSignal?.throwIfAborted();
				assertRunCurrent?.();
				assertInitialSetupCurrent?.();
			};
			const readRoutablePlacement = (message, cause) => {
				assertAdmissionCurrent();
				const refreshed = options.placements.get(identity.sessionId);
				if (!refreshed) throw new Error(message, cause === void 0 ? void 0 : { cause });
				return refreshed;
			};
			let placement;
			let turnClaim;
			let recoveredAdmission = false;
			let admissionReported = false;
			let userMessagePersisted = inputTurn.suppressNextUserMessagePersistence === true;
			for (;;) {
				let turn = inputTurn;
				assertAdmissionCurrent();
				if ([
					"requested",
					"provisioning",
					"syncing",
					"starting"
				].includes(routablePlacement.state)) {
					if (!options.waitForInitialPlacement) throw new Error("Worker setup has no live dispatch owner. Wait for recovery or explicitly retry setup.");
					reportProvisioning();
					const ready = await waitForInitialWorkerPlacement({
						placements: options.placements,
						placement: routablePlacement,
						turn,
						wait: options.waitForInitialPlacement,
						assertRunCurrent
					});
					routablePlacement = ready.placement;
					assertInitialSetupCurrent = ready.assertCurrent;
				}
				if (routablePlacement.state === "reclaimed" || routablePlacement.state === "failed" && routablePlacement.activeOwnerEpoch !== null) {
					reportProvisioning();
					routablePlacement = await options.redispatchPlacement(routablePlacement, {
						assertCurrent: assertAdmissionCurrent,
						signal: inputTurn.abortSignal
					});
					assertAdmissionCurrent();
					identity = resolvePlacementIdentity({
						...claim,
						agentId: identity.agentId,
						sessionKey: identity.sessionKey
					}, routablePlacement);
				}
				if (await hasPendingWorkspaceResultToSettle(identity.sessionId, claim.runId)) {
					await waitForPendingWorkerResult({
						placements: options.placements,
						sessionId: identity.sessionId,
						...turn.abortSignal ? { signal: turn.abortSignal } : {}
					});
					const refreshed = readRoutablePlacement("Cloud worker placement disappeared after workspace reconciliation");
					if (refreshed.state === "local") return await runLocalTurn();
					routablePlacement = refreshed;
					continue;
				}
				placement = requireActivePlacement(routablePlacement);
				const environmentId = placement.environmentId;
				const refresh = options.environments.readRuntimeRefresh?.(environmentId);
				if (refresh) {
					reportProvisioning();
					await waitForWorkerRuntimeRefresh({
						refresh,
						...turn.abortSignal ? { signal: turn.abortSignal } : {},
						timeoutMs: turn.timeoutMs,
						onProgress: () => markDiagnosticRunProgress({
							sessionId: identity.sessionId,
							sessionKey: identity.sessionKey,
							runId: claim.runId,
							reason: "worker:runtime_refresh"
						})
					});
					const refreshed = readRoutablePlacement("Cloud worker placement disappeared while waiting for runtime refresh");
					if (refreshed.state === "local") return await runLocalTurn();
					routablePlacement = refreshed;
					continue;
				}
				const assertClaimCurrent = () => {
					assertAdmissionCurrent();
					if (options.environments.readRuntimeRefresh?.(environmentId)) throw new WorkerRuntimeRefreshInFlightError("Worker runtime refresh started during turn admission");
				};
				const remoteExec = placement.executionMode === "remote-exec";
				let admitted;
				try {
					if (remoteExec) admitted = {
						placement,
						turnClaim: await options.placements.claimTurn({
							...identity,
							claimId: randomUUID(),
							runId: claim.runId,
							owner: placementTurnOwner(placement)
						}, assertClaimCurrent)
					};
					else admitted = await claimWorkerTurn({
						placements: options.placements,
						identity,
						placement,
						runId: claim.runId,
						assertCurrent: assertClaimCurrent,
						isCancellationRequested: (activeClaim) => {
							const active = activeWorkerTurns.get(activeClaim.sessionId);
							return Boolean(active?.signal?.aborted && sameWorkerSessionTurnClaim(active.claim, activeClaim));
						},
						...turn.abortSignal ? { signal: turn.abortSignal } : {}
					});
				} catch (error) {
					const refreshing = error instanceof WorkerRuntimeRefreshInFlightError;
					if (!refreshing) {
						if (!remoteExec || !(error instanceof ActiveTurnClaimError) || !await hasPendingWorkspaceResultToSettle(identity.sessionId, claim.runId)) throw error;
						await waitForPendingWorkerResult({
							placements: options.placements,
							sessionId: identity.sessionId,
							...turn.abortSignal ? { signal: turn.abortSignal } : {}
						});
					}
					const refreshed = readRoutablePlacement(refreshing ? "Cloud worker placement disappeared during runtime refresh admission" : "Cloud worker placement disappeared after workspace reconciliation", error);
					if (refreshed.state === "local") return await runLocalTurn();
					routablePlacement = refreshed;
					continue;
				}
				if (!admitted) {
					const refreshed = readRoutablePlacement("Cloud worker placement disappeared after workspace reconciliation");
					if (refreshed.state === "local") return await runLocalTurn();
					routablePlacement = refreshed;
					continue;
				}
				placement = admitted.placement;
				turnClaim = admitted.turnClaim;
				let activeWorkerTurn;
				let handedOff = false;
				let terminalReceiptRequired = false;
				let terminalAtMs;
				let workspaceResolutionFailed = false;
				try {
					if (!remoteExec) {
						activeWorkerTurn = await createWorkerTurnRunOwner({
							placements: options.placements,
							claim: turnClaim,
							sessionKey: placement.sessionKey,
							turn,
							assertCurrent: assertAdmissionCurrent
						});
						activeWorkerTurn.signal.throwIfAborted();
						turn = {
							...turn,
							abortSignal: activeWorkerTurn.signal,
							...userMessagePersisted ? { suppressNextUserMessagePersistence: true } : {},
							onUserMessagePersisted: (message) => {
								userMessagePersisted = true;
								inputTurn.onUserMessagePersisted?.(message);
							}
						};
						activeWorkerTurns.set(turnClaim.sessionId, activeWorkerTurn);
					}
					const assertPreparationCurrent = () => {
						turn.abortSignal?.throwIfAborted();
						assertAdmissionCurrent();
						const preparedPlacement = options.placements.get(turnClaim.sessionId);
						if (preparedPlacement?.state !== "active" || preparedPlacement.executionMode !== placement.executionMode || !matchesWorkerPlacementTarget(preparedPlacement, placement) || !options.placements.validateTurnClaim(turnClaim)) throw new Error("Worker placement changed while loading turn execution");
						return preparedPlacement;
					};
					assertPreparationCurrent();
					if (!remoteExec && !admissionReported) {
						onAdmitted?.();
						admissionReported = true;
					}
					assertPreparationCurrent();
					let workspace;
					try {
						workspace = await raceNodeWorkerOperation(options.resolveWorkspace(identity), turn.abortSignal);
					} catch (error) {
						workspaceResolutionFailed = true;
						await releaseClaimIfOwned(options.placements, turnClaim);
						throw error;
					}
					placement = assertPreparationCurrent();
					const execute = remoteExec ? (await raceNodeWorkerOperation(loadRemoteExecTurn(), turn.abortSignal)).executeRemoteExecTurn : (await raceNodeWorkerOperation(loadWorkerTurnExecution(), turn.abortSignal)).executeWorkerTurn;
					assertPreparationCurrent();
					return await execute({
						environments: options.environments,
						onHandoff: (custody) => {
							if (!admissionReported) {
								onAdmitted?.();
								admissionReported = true;
							}
							handedOff = true;
							terminalReceiptRequired = custody?.requiresTerminalReceipt === true;
						},
						onTerminal: () => {
							terminalAtMs = Date.now();
						},
						placement,
						placements: options.placements,
						workspace,
						prepareAcceptedWorkspacePublication: options.prepareAcceptedWorkspacePublication,
						publishAcceptedWorkspace: options.publishAcceptedWorkspace,
						workspaceOperations: options.workspaceOperations,
						turn,
						turnClaim,
						runLocal,
						assertRunCurrent: remoteExec ? assertRunCurrent : assertPreparationCurrent
					});
				} catch (error) {
					if (workspaceResolutionFailed || error instanceof AcceptedWorkspacePublicationIndeterminateError) throw error;
					const abortReason = turn.abortSignal?.reason;
					if (!remoteExec && restartSignal.aborted && isAgentRunRestartAbortReason(abortReason)) throw abortReason;
					const disconnectedBeforeHandoff = !handedOff && (error instanceof WorkerTunnelOwnerDisconnectedError || error instanceof WorkerRunnerUnavailableError);
					if (error instanceof StaleWorkerBuildError || error instanceof WorkerRuntimeRefreshPendingError || disconnectedBeforeHandoff) {
						const pendingResults = await options.placements.listPendingWorkspaceResultsAsync(placement.sessionId);
						const canRecoverAdmission = !handedOff && options.placements.validateTurnClaim(turnClaim) && !pendingResults.some((pending) => pending.sessionId === placement.sessionId);
						if (canRecoverAdmission) {
							try {
								assertAdmissionCurrent();
								turn.abortSignal?.throwIfAborted();
							} finally {
								await releaseClaimIfOwned(options.placements, turnClaim);
							}
							assertAdmissionCurrent();
							turn.abortSignal?.throwIfAborted();
							assertInitialSetupCurrent = void 0;
							if (!recoveredAdmission) {
								const waitTimeoutMs = Math.min(WORKER_ADMISSION_DEADLINE_MS, turn.timeoutMs);
								if (waitTimeoutMs <= 0) throw new WorkerRunnerUnavailableError();
								const reconnect = new AbortController();
								const reconnectSignal = turn.abortSignal ? AbortSignal.any([turn.abortSignal, reconnect.signal]) : reconnect.signal;
								const timeout = setTimeout(() => reconnect.abort(new WorkerRunnerUnavailableError()), waitTimeoutMs);
								timeout.unref?.();
								const admissionFacts = await options.placements.prepareRuntimeRefresh(placement.sessionId);
								try {
									markDiagnosticRunProgress({
										sessionId: placement.sessionId,
										sessionKey: identity.sessionKey,
										runId: claim.runId,
										reason: "worker:runtime_refresh"
									});
									reportProvisioning();
									await options.waitForAdmissionNode({
										placement,
										signal: reconnectSignal,
										assertCurrent: () => {
											reconnectSignal.throwIfAborted();
											assertAdmissionCurrent();
											admissionFacts.assertCurrent();
											const waitingPlacement = options.placements.get(placement.sessionId);
											if (!matchesWorkerPlacementTarget(waitingPlacement, placement) || waitingPlacement?.turnClaim || waitingPlacement?.sessionKey !== identity.sessionKey || waitingPlacement?.agentId !== identity.agentId || waitingPlacement?.executionMode !== placement.executionMode || admissionFacts.pendingResult) throw new Error("Worker placement changed while waiting for node admission", { cause: error });
										}
									});
								} finally {
									admissionFacts.release();
									clearTimeout(timeout);
								}
							}
						}
						if (!disconnectedBeforeHandoff) await options.reconcileActivePlacement(placement.environmentId);
						const reconciled = options.placements.get(placement.sessionId);
						if (canRecoverAdmission) {
							assertAdmissionCurrent();
							turn.abortSignal?.throwIfAborted();
						}
						const refreshedInPlace = reconciled?.state === "active" && matchesWorkerPlacementTarget(reconciled, placement) && reconciled.turnClaim === null && (disconnectedBeforeHandoff || reconciled.workerBundleHash !== placement.workerBundleHash) && reconciled.remoteWorkspaceDir === placement.remoteWorkspaceDir;
						const reclaimedSameOwner = reconciled?.state === "reclaimed" && reconciled.environmentId === placement.environmentId && reconciled.activeOwnerEpoch === placement.activeOwnerEpoch && reconciled.generation === placement.generation + 3;
						if (canRecoverAdmission && !recoveredAdmission && (refreshedInPlace || reclaimedSameOwner) && reconciled.executionMode === placement.executionMode && reconciled.agentId === identity.agentId && reconciled.sessionKey === identity.sessionKey) {
							assertAdmissionCurrent();
							recoveredAdmission = true;
							routablePlacement = reconciled;
							continue;
						}
						if (canRecoverAdmission && reconciled?.state === "reclaimed") throw error;
						if (reconciled) requireActivePlacement(reconciled);
					}
					const pendingWorkspaceResult = await findPendingWorkerWorkspaceResult(options.placements, turnClaim);
					if (pendingWorkspaceResult) {
						if (turnClaim.owner.kind === "local") await options.placements.failWorkspaceResultAndReleaseTurn(pendingWorkspaceResult, error);
						else await options.placements.handoffWorkspaceResultRecovery(turnClaim);
						await options.reconcileActivePlacement(placement.environmentId);
						throw error;
					}
					if (error instanceof WorkerRunnerCapacityError || error instanceof WorkerRunnerUnavailableError && !handedOff || !remoteExec && handedOff && turn.abortSignal?.aborted && (!terminalReceiptRequired || terminalAtMs !== void 0) || error instanceof WorkerWorkspaceReconciliationError && !handedOff || error instanceof WorkerTurnExecutionError && options.placements.validateTurnClaim(turnClaim)) {
						await releaseClaimIfOwned(options.placements, turnClaim);
						throw error;
					}
					const settledPlacement = options.placements.get(turnClaim.sessionId);
					if ((remoteExec || error instanceof WorkerTurnExecutionError) && settledPlacement?.state === "active" && settledPlacement.environmentId === placement.environmentId && settledPlacement.activeOwnerEpoch === placement.activeOwnerEpoch && settledPlacement.turnClaim === null) throw error;
					if (handedOff) {
						const terminalOwner = activeWorkerTurn;
						await failHandedOffTurn({
							environments: options.environments,
							placements: options.placements,
							placement,
							turnClaim,
							error,
							...terminalOwner && terminalAtMs !== void 0 ? { terminal: {
								observedAtMs: terminalAtMs,
								registerRecovery: (recover) => {
									terminalOwner.recoverTerminal = recover;
								}
							} } : {}
						});
					} else await releaseClaimIfOwned(options.placements, turnClaim);
					throw error;
				} finally {
					activeWorkerTurn?.dispose();
					if (activeWorkerTurn && activeWorkerTurns.get(turnClaim.sessionId) === activeWorkerTurn) activeWorkerTurns.delete(turnClaim.sessionId);
				}
			}
		}
	};
}
//#endregion
//#region src/gateway/worker-environments/workspace-operation-coordinator.ts
/** Serializes local workspace mutation and forced teardown per environment. */
function createWorkerWorkspaceOperationCoordinator() {
	const queue = new KeyedAsyncQueue();
	return { async run(environmentId, operation, signal) {
		let entered = false;
		const result = queue.enqueue(environmentId, () => {
			signal?.throwIfAborted();
			entered = true;
			return operation();
		});
		try {
			return await raceNodeWorkerOperation(result, signal);
		} catch (error) {
			if (entered) return await result;
			throw error;
		}
	} };
}
//#endregion
//#region src/gateway/server-worker-placement-startup.ts
const WORKER_PLACEMENT_RECONCILE_INTERVAL_MS = 6e4;
function createGatewayGitHubPublicationRuntime(params) {
	return createGitHubPublicationRuntime({
		placements: params.placements,
		getCommittedRuntimeConfig: params.getCommittedRuntimeConfig,
		loadSessionRuntime: loadWorkerPlacementSessionRuntimeModule,
		warn: params.warn
	});
}
function createGatewayWorkerPlacementRuntime(params) {
	const { scheduler } = params;
	let nodeWorkerSupervisorTransport;
	let stopped = false;
	const runtimeRefresh = createWorkerRuntimeRefreshWaiter({
		environments: params.environments,
		isStopping: () => stopped
	});
	const workspaceOperations = createWorkerWorkspaceOperationCoordinator();
	const { coordinator: githubPublication, prepareAcceptedWorkspacePublication, publishAcceptedWorkspace, reconcilePublications } = params.githubPublicationRuntime ?? createGatewayGitHubPublicationRuntime(params);
	const withPreparedRecovery = createWorkerWorkspaceRecoveryPreparer({
		loadSessionRuntime: loadWorkerPlacementSessionRuntimeModule,
		getConfig: getRuntimeConfig
	});
	const nodeWorkspaceRetention = createNodeWorkspaceRetainCoordinator({
		bundleRetention: params.nodeWorkerBundleRetention,
		gatewayNamespace: params.gatewayNamespace,
		placements: params.placements,
		environments: params.environments,
		additionalManifestRefs: prepareWorkerPlacementRepositoryManifestRefs,
		warn: params.warn
	});
	const runnerAvailability = createWorkerPlacementRunnerAvailabilityReader({
		environments: params.environments,
		hasCurrentDeviceRunner: (deviceId) => nodeWorkerSupervisorTransport?.hasCurrentRunner(deviceId) === true
	});
	const diskSpace = createWorkerPlacementDiskSpaceMonitor({
		placements: params.placements,
		environments: params.environments,
		runnerAvailability,
		warn: params.warn
	});
	const reclaimBarriers = createGatewayWorkerPlacementReclaimBarriers({
		placements: params.placements,
		loadSessionRuntime: loadWorkerPlacementSessionRuntimeModule,
		cancelSessionWork: params.cancelSessionWork,
		revokeSessionAuthority: params.revokeSessionAuthority
	});
	const runMoveBarrier = createGatewayWorkerPlacementMoveBarrier({
		placements: params.placements,
		awaitTurnClaimRelease: (sessionId, wait) => dispatchService.awaitTurnClaimRelease(sessionId, wait),
		loadSessionRuntime: loadWorkerPlacementSessionRuntimeModule,
		persistAbandonedPartial: params.persistAbandonedPartial,
		revokeSessionAuthority: params.revokeSessionAuthority
	});
	const resolveWorkspace = async ({ sessionId, sessionKey, agentId }) => {
		const { workspace, assertCurrent } = await resolveWorkerPlacementSessionTarget({
			sessionRuntime: await loadWorkerPlacementSessionRuntimeModule(),
			config: getRuntimeConfig(),
			sessionId,
			sessionKey,
			agentId,
			errorMessage: `Session ${sessionKey} dispatch requires a session-owned workspace`
		});
		assertCurrent(getRuntimeConfig());
		return workspace;
	};
	const resolveDevicePlacementRequirement = async (identity) => {
		const sessionRuntime = await loadWorkerPlacementSessionRuntimeModule();
		const { config, target, entry, assertCurrent } = await resolveWorkerPlacementSessionTarget({
			sessionRuntime,
			config: getRuntimeConfig(),
			...identity,
			errorMessage: `Session ${identity.sessionKey} changed before node-backed placement recovery`
		});
		assertCurrent(getRuntimeConfig());
		const runtime = sessionRuntime.resolveWorkerPlacementSessionRuntime({
			cfg: config,
			entry,
			agentId: target.agentId,
			sessionKey: target.canonicalKey
		});
		const { executionMode, devicePlacement } = sessionRuntime.resolveWorkerPlacementCapabilities(runtime);
		if (executionMode !== identity.executionMode || !devicePlacement) throw new Error(`runtime ${runtime} no longer supports this node-backed placement; select a compatible runtime or continue on the Gateway`);
		return devicePlacement;
	};
	const resolveNodeWorkspaceBinding = createWorkerPlacementNodeWorkspaceBindingResolver({
		placements: params.placements,
		resolveWorkspace
	});
	const publishPlacementChanges = createGatewayWorkerPlacementChangePublisher(params);
	const dispatchService = coordinateWorkerPlacementDispatch(createWorkerPlacementDispatchService({
		placements: params.placements,
		environments: params.environments,
		isShuttingDown: () => stopped || params.environments.isStopping() || getGatewayRestartDrainSignal().aborted,
		runnerAvailability,
		resolveDevicePlacementRequirement,
		isCurrentNodePlacement: createDevicePlacementAuthority(() => nodeWorkerSupervisorTransport),
		withPreparedRecovery,
		...reclaimBarriers,
		runLocalBarrier: createGatewayWorkerPlacementLocalDispatchBarrier({
			placements: params.placements,
			awaitTurnClaimRelease: (sessionId, wait) => dispatchService.awaitTurnClaimRelease(sessionId, wait),
			revokeSessionAuthority: params.revokeSessionAuthority
		}),
		runActivationBarrier: async ({ authorize, activate, ...identity }) => await runWorkerPlacementSessionBarrier({
			sessionRuntime: await loadWorkerPlacementSessionRuntimeModule(),
			getConfig: getRuntimeConfig,
			...identity,
			action: "activation",
			run: (_workspace, assertCurrent) => {
				authorize?.();
				return activate(assertCurrent);
			}
		}),
		runRecoveryBarrier: async ({ environmentId, expectedGeneration, run, ...identity }) => await runWorkerPlacementSessionBarrier({
			sessionRuntime: await loadWorkerPlacementSessionRuntimeModule(),
			getConfig: getRuntimeConfig,
			...identity,
			action: "recovery",
			run: async (workspace, assertCurrent) => {
				const placement = params.placements.get(identity.sessionId);
				if (placement?.state !== "provisioning" || placement.generation !== expectedGeneration || placement.environmentId !== environmentId) throw new WorkerDispatchTargetChangedError(`Session ${identity.sessionKey} placement changed before cloud worker recovery. Retry.`);
				await run(workspace, assertCurrent);
			}
		}),
		onActivated: ({ sessionId }) => {
			const placement = params.placements.get(sessionId);
			if (placement?.state !== "active") return;
			const environment = params.environments.get(placement.environmentId);
			if (environment?.state === "attached" && environment.ownerEpoch === placement.activeOwnerEpoch && environment.attachedSessionIds.length === 1 && environment.attachedSessionIds[0] === sessionId && environment.nodeDeviceId) nodeWorkspaceRetention.schedule(environment.nodeDeviceId);
		},
		runMoveBarrier,
		resolveMoveDestination: createGatewayWorkerPlacementMoveDestinationResolver({
			environments: params.environments,
			getConfig: getRuntimeConfig,
			loadSessionRuntime: loadWorkerPlacementSessionRuntimeModule
		}),
		resolveWorkspace,
		prepareGatewayMove: (identity) => params.placements.withWorkspaceExclusion(identity.sessionId, async (assertOwned) => await materializeSessionRepositoryWorkspaceOnGateway({
			cfg: getRuntimeConfig(),
			...identity,
			assertCurrent: () => {
				assertOwned();
				identity.assertCurrent();
			}
		})),
		workspaceOperations,
		prepareAcceptedWorkspacePublication,
		publishAcceptedWorkspace,
		resolveGitAuthor: (agentId) => (resolveConfiguredGitHubToolIdentity({
			config: getRuntimeConfig(),
			agentId,
			scope: "agent"
		}) ?? resolveConfiguredGitHubToolIdentity({
			config: getRuntimeConfig(),
			agentId,
			scope: "system"
		}))?.gitAuthor
	}), createGatewayWorkerDispatchAdmission(loadWorkerPlacementSessionRuntimeModule), createWorkerPlacementInitialRecovery({
		...params,
		isStopping: () => stopped || params.environments.isStopping() || getGatewayRestartDrainSignal().aborted
	}), publishPlacementChanges);
	const placementIdleSweep = createWorkerPlacementIdleSweep({
		placements: params.placements,
		environments: params.environments,
		dispatch: dispatchService,
		getConfig: getRuntimeConfig,
		info: params.info ?? params.warn,
		warn: params.warn,
		isPlacementOperationInFlight: (sessionId) => dispatchService.isPlacementOperationInFlight(sessionId),
		loadSessionRuntime: loadWorkerPlacementSessionRuntimeModule
	});
	const sessionRetirement = createPlacementSessionRetirement({
		placements: params.placements,
		environments: params.environments,
		forceDestroyEnvironment: dispatchService.forceDestroyEnvironment,
		createSessionEvidenceResolver: createWorkerPlacementSessionEvidenceResolver,
		warn: params.warn
	});
	const admissionProvider = createWorkerSessionTurnPlacementProvider({
		environments: params.environments,
		placements: params.placements,
		resolveWorkspace,
		reconcileActivePlacement: async (id) => await dispatchService.reconcileActive(id),
		waitForAdmissionNode: runtimeRefresh.wait,
		waitForInitialPlacement: dispatchService.waitForInitialPlacement,
		redispatchPlacement: createWorkerPlacementRedispatch({
			placements: params.placements,
			dispatch: dispatchService.dispatch,
			resolveDevicePlacementRequirement
		}),
		workspaceOperations,
		prepareAcceptedWorkspacePublication,
		publishAcceptedWorkspace
	});
	const startRuntime = async (hooks) => {
		if (hooks.isClosePreludeStarted()) return null;
		const uninstallPlacementAdmission = installSessionPlacementAdmissionProvider(admissionProvider);
		const unsubscribeMachineShape = subscribeGatewayWorkerMachineShapeChanges(params);
		const scope = scheduler.scope();
		const placementReconcile = { current: void 0 };
		const diskSpaceSweep = { current: void 0 };
		const placementIdleSuspend = { current: void 0 };
		const uninstallEnvironmentReconcileGuard = installWorkerPlacementReconcileGuard({
			placements: params.placements,
			environments: params.environments,
			dispatch: dispatchService,
			isStopping: () => stopped
		});
		const uninstallSessionMaintenancePreservation = registerSessionMaintenancePreserveKeysProvider(() => params.placements.listForReconcile().flatMap((placement) => placement.state === "failed" && isFailedWorkerPlacementEnvironmentGone({
			environmentService: params.environments,
			placement
		}) ? [] : [placement.sessionKey]));
		const trackOperation = (slot, current, failureMessage) => {
			slot.current = current;
			const clearCurrent = () => {
				if (slot.current === current) slot.current = void 0;
			};
			current.then(clearCurrent, (error) => {
				params.warn(`${failureMessage}: ${formatErrorMessage(error)}`);
				clearCurrent();
			});
			return current;
		};
		const reconcileActivePlacements = () => {
			if (stopped) return Promise.resolve();
			if (placementReconcile.current) return placementReconcile.current;
			return trackOperation(placementReconcile, (async () => {
				await publishPlacementChanges(() => sessionRetirement.reconcile());
				await dispatchService.reconcileActive();
				await reconcilePublications();
				nodeWorkspaceRetention.schedule();
			})(), "Worker placement reconcile sweep failed");
		};
		const sweepDiskSpace = () => {
			if (stopped) return Promise.resolve();
			if (diskSpaceSweep.current) return diskSpaceSweep.current;
			return trackOperation(diskSpaceSweep, diskSpace.sweep(), "Worker disk-space sweep failed");
		};
		const sweepActivePlacements = async () => {
			try {
				await reconcileActivePlacements();
				if (stopped || placementIdleSuspend.current) return;
				await trackOperation(placementIdleSuspend, publishPlacementChanges(() => placementIdleSweep.sweep()), "Worker placement auto-suspend sweep failed");
			} catch {}
		};
		const uninstallSessionIdentityMutation = onSessionIdentityMutation((mutation) => {
			const previousSessionId = mutation.previous.sessionId;
			const currentSessionId = "current" in mutation ? mutation.current.sessionId : void 0;
			if (previousSessionId && previousSessionId !== currentSessionId) {
				const pending = placementReconcile.current;
				if (!pending) {
					reconcileActivePlacements();
					return;
				}
				const resume = () => {
					reconcileActivePlacements();
				};
				pending.then(resume, resume);
			}
		});
		let stopPromise;
		const sidecar = { stop: () => {
			if (stopPromise) return stopPromise;
			if (!stopped) {
				stopped = true;
				params.environments.stopNodeEnrollmentWaits?.();
				scope.beginClose();
				uninstallSessionIdentityMutation();
				uninstallSessionMaintenancePreservation();
				uninstallPlacementAdmission();
			}
			const currentStop = (async () => {
				await Promise.allSettled([
					unsubscribeMachineShape(),
					placementReconcile.current,
					diskSpaceSweep.current,
					placementIdleSuspend.current
				].filter((operation) => operation !== void 0));
				await nodeWorkspaceRetention.stop();
				await scope.stop();
				await params.environments.stop();
				await uninstallEnvironmentReconcileGuard();
			})();
			stopPromise = currentStop;
			currentStop.catch(() => {
				if (stopPromise === currentStop) stopPromise = void 0;
			});
			return currentStop;
		} };
		hooks.registerSidecar(sidecar);
		const stopBeforeReady = async () => {
			await sidecar.stop();
			hooks.unregisterSidecar(sidecar);
			return null;
		};
		try {
			for (const reconcile of [() => recoverGatewayWorkerPlacementWorkspaces({
				placements: params.placements,
				resolveWorkspace
			}), async () => {
				await dispatchService.reconcile("startup");
				await reconcilePublications();
			}]) {
				const current = reconcile();
				placementReconcile.current = current;
				try {
					await current;
				} finally {
					if (placementReconcile.current === current) placementReconcile.current = void 0;
				}
				if (hooks.isClosePreludeStarted()) return await stopBeforeReady();
			}
			nodeWorkspaceRetention.start();
			if (hooks.isClosePreludeStarted()) return await stopBeforeReady();
			params.environments.start();
			if (hooks.isClosePreludeStarted()) return await stopBeforeReady();
			trackOperation(placementReconcile, publishPlacementChanges(() => sessionRetirement.reconcile()), "Worker placement reconcile sweep failed");
			sweepDiskSpace();
			const atMs = scope.now() + WORKER_PLACEMENT_RECONCILE_INTERVAL_MS;
			scope.schedule({
				id: "worker-placements:reconcile",
				atMs,
				everyMs: WORKER_PLACEMENT_RECONCILE_INTERVAL_MS,
				run: sweepActivePlacements
			});
			scope.schedule({
				id: "worker-placements:disk-space",
				atMs,
				everyMs: WORKER_PLACEMENT_RECONCILE_INTERVAL_MS,
				run: () => sweepDiskSpace().catch(() => {})
			});
			return sidecar;
		} catch (error) {
			try {
				await stopBeforeReady();
			} catch (cleanupError) {
				params.warn(`Worker placement cleanup after startup failure failed: ${formatErrorMessage(cleanupError)}`);
			}
			throw error;
		}
	};
	return {
		dispatchService,
		admissionProvider,
		diskSpace,
		runnerAvailability,
		placements: params.placements,
		githubPublication,
		repositoryWorkspaceMutationService: createRepositoryWorkspaceMutationService({
			placements: params.placements,
			environments: params.environments,
			workspaceOperations,
			resolveWorkspace
		}),
		resolveNodeWorkspaceBinding,
		bindNodeWorkerSupervisorTransport: (transport) => {
			nodeWorkerSupervisorTransport = transport;
			nodeWorkspaceRetention.bindTransport(transport);
		},
		bindNodeWorkerAvailability: runtimeRefresh.bind,
		scheduleNodeWorkspaceRetention: (nodeId) => nodeWorkspaceRetention.schedule(nodeId),
		startRuntime
	};
}
//#endregion
export { createGatewayGitHubPublicationRuntime, createGatewayWorkerPlacementRuntime };
