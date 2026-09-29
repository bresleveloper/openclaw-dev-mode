import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { m as readNonBlankString } from "./string-coerce-CIXf7egm.mjs";
import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { k as withTimeout } from "./fs-safe-BAPek8At.mjs";
import { r as racePromiseWithAbortSignal } from "./abort-signal-Z3A36sLL.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CUi_tcgF.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { n as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHI12YH5.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-DJbkHzN8.mjs";
import { i as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { r as tableExists } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { s as withExistingOpenClawStateDatabaseArtifactPreservingReadOnly, t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { t as OpenClawStateLeaseAcquisitionError } from "./openclaw-state-lease-error-BXipLxiQ.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { i as resolveIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-C2YxM4Tj.mjs";
import { t as sessionChanges } from "./session-row-changes-xuu0eHng.mjs";
import { t as parseDurationMs } from "./parse-duration-DBWI377R.mjs";
import { C as ensureRepositoryGitHubPublicationSchema, S as ensurePersonalGitHubPublicationSchema, c as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase, v as ensureGitHubPublicationSchema } from "./openclaw-state-db-BFK9cMiV.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./config-Ciq2mxdN.mjs";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.mjs";
import { s as WORKER_ADMISSION_DEADLINE_MS } from "./worker-process-protocol-B6pCNPWA.mjs";
import { k as NODE_WORKER_WORKSPACE_RETAIN_COMMAND } from "./node-commands-BLhGKTZa.mjs";
import { s as getGatewayRestartDrainSignal } from "./gateway-work-admission-CHv_0noy.mjs";
import { i as matchesAgentDatabaseReadCandidatePath } from "./openclaw-agent-db-resources-o9110hVL.mjs";
import { m as readOpenIncognitoAgentDatabaseGeneration } from "./openclaw-agent-db-lifecycle-D7S9DdJC.mjs";
import { d as retainOpenClawAgentDatabaseReadCandidates } from "./openclaw-agent-db-CaQAStOA.mjs";
import { a as prepareOpenClawAgentDatabaseRegistrySnapshotRead } from "./openclaw-agent-db-registry-listing-CHFiKgU_.mjs";
import { o as readUserGitHubConnection, s as resolvePersonalGitHubOwner } from "./user-github-connections-Bepgzp4W.mjs";
import { r as GatewayOperatorAccessUnavailableError } from "./operator-access-policy-Dh1MoHMy.mjs";
import { c as resolveUnsuffixedSqliteTargetFromSessionStorePath, u as captureSessionStoreReadCandidate } from "./session-sqlite-target-Dcog4O-M.mjs";
import { o as normalizeSqliteSessionKey } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
import { n as emitSessionLifecycleEvent, r as onSessionIdentityMutation } from "./session-lifecycle-events-DiXxneBV.mjs";
import { s as captureCanonicalSessionReaderContinuation } from "./session-canonical-key-BBylVEaq.mjs";
import { Z as getSessionRepositoryWorkspaceStore } from "./session-accessor.sqlite-entry-store-BU493wVJ.mjs";
import { S as runExclusiveSessionStoreWrite, _ as startSessionWorkAdmissionInterruption, f as interruptSessionWorkAdmissions, g as runExclusiveSessionLifecycleMutation, h as isSessionWorkAdmissionActive, i as closeSessionWorkAdmissions, n as beginSessionWorkAdmission, t as SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS } from "./session-lifecycle-admission-Pys9TN37.mjs";
import { s as gitNullConfigPath } from "./git-exec-B6ZpVpQV.mjs";
import { T as resolveSessionStorePathForScope, d as patchSessionEntryCore, l as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-BB2Zsfho.mjs";
import { a as registerSessionMaintenancePreserveKeysProvider } from "./store-maintenance-runtime-C9xB-eDV.mjs";
import { c as readLatestSessionTranscriptReport, s as appendSessionTranscriptReport } from "./session-accessor-l-4ZHvKn.mjs";
import { i as resolveSessionStoreKey, n as resolveSessionStoreAgentId } from "./session-store-key-BoleEY7N.mjs";
import { n as readSessionIdentityEvidenceBatch } from "./session-accessor.sqlite-entry-availability-B64pRX3U.mjs";
import { n as prepareSessionStoreTargetInventory } from "./session-store-target-inventory-BnUpfTCG.mjs";
import { a as withSessionHistoryWorkerDatabases, o as withSessionHistoryWorkerReadCandidates } from "./session-transcript-worker-runtime-BF6L8Gm-.mjs";
import { a as createAgentRunDirectAbortError } from "./run-termination-Cd1iJzC7.mjs";
import { d as resolveSessionWorkStartError } from "./lifecycle-WWQJH57y.mjs";
import { i as resolveControlUiSessionUrl } from "./control-ui-link-base-CQdQgsxo.mjs";
import { n as isFailedWorkerPlacementEnvironmentGone } from "./session-placement-lifecycle-DAKgxrlj.mjs";
import { _ as resolvePlacementTurnEnvironment, a as isForceAbandonedWorkerPlacement, h as reportPlacementTransition, i as isCurrentPlacementTurnClaim, m as projectWorkerSessionTurnClaim, p as placementTurnOwner, t as FORCED_WORKER_ABANDONMENT_ERROR, v as sameWorkerSessionTurnClaim, y as serializeWorkerSessionTurnClaim } from "./placement-record-CB6gcJKw.mjs";
import { a as recoverWorkerWorkspaceReconciliation, t as applyStagedWorkerWorkspace } from "./workspace-reconcile-BoiN2pej.mjs";
import { o as isCurrentWorkerWorkspacePendingResultOwner, t as ActiveTurnClaimError } from "./placement-turn-claims-lHILSuHT.mjs";
import { t as boundedWorkerError } from "./worker-error-Bd42UcqN.mjs";
import { t as SessionWorkspaceReservationBusyError } from "./placement-workspace-reservation-bdeiq4od.mjs";
import { a as projectWorkspaceResultConflict, i as formatWorkspaceConflictSummary, n as WORKSPACE_CONFLICT_TRANSCRIPT_TYPE, r as WORKSPACE_RECOVERY_FAILURE_TRANSCRIPT_TYPE, t as WORKSPACE_CONFLICT_CLEARED_TRANSCRIPT_TYPE } from "./workspace-conflicts-CQVfTI04.mjs";
import { l as resolveNodeCommandAllowlist } from "./node-command-policy-CnGfXM76.mjs";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-DDuAGjCc.mjs";
import { o as hasPendingFollowupQueueWork } from "./state-B1aZH2hx.mjs";
import { A as readWorkerPlacementIdentity, O as createWorkerPlacementRunnerAvailabilityReader } from "./session-row-prepared-read-C3rQ5FB0.mjs";
import "./session-sharing-C4w_but1.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.mjs";
import "./device-provider-identity-v6nXqNq_.mjs";
import "./session-utils-CJ7A982R.mjs";
import { p as resolveConfiguredGitHubToolIdentity, u as preparePersonalGitHubPublicationIdentity } from "./github-tool-identity-BOF32-1s.mjs";
import { t as clearSessionQueues } from "./cleanup-CaqS6FX1.mjs";
import { n as resolveWorkerPlacementDestination } from "./placement-destination-CngAq5ZE.mjs";
import { t as resolveGitCoauthorAttribution } from "./git-coauthor-attribution-BPpTL3Cn.mjs";
import { n as installSessionPlacementAdmissionProvider } from "./session-placement-admission-Gs1bL6J1.mjs";
import { a as managedWorktrees } from "./service-JxB03j7i.mjs";
import { n as acquireWorktreeRunLease } from "./run-lease-DZ87OGDN.mjs";
import { c as resolveGitHubPublicationWorktreeOwner, d as insertGitHubPublicationSessionLifecycle, f as readGitHubPublicationSessionLifecycle, g as matchesGitHubPublicationRequester, h as encodeGitHubPublicationRequester, i as prepareCurrentGitHubPublicationIdentity, l as resolveLocalGitHubPublicationWorktreeOwner, m as decodeGitHubPublicationRequester, n as currentGitHubPublicationConfig, p as readGitHubPublicationSessionLifecycleInWorker, r as matchesCurrentGitHubPublicationIdentity, s as resolveGitHubPublicationWorkspaceOwner, t as assertExpectedSharedGitHubPublisher, u as sameGitHubPublicationWorkspace } from "./github-publication-availability-CE1CFSwV.mjs";
import { a as personalGitHubStatus, i as requestCurrentPersonalGitHubRefresh } from "./github-oauth-lifecycle-B8jl-6oa.mjs";
import { c as resolveGitHubPublicationFailure, i as GitHubPublicationSessionChangedError, n as GitHubPublicationKnownFailure, o as GitHubPublicationWorkspaceChangedError, r as GitHubPublicationRequesterUnavailableError, s as rejectGitHubPublicationSelection, t as GitHubPublicationBranchChangedError } from "./github-publication-failure-B1jd4XaP.mjs";
import { i as parseNodeWorkerWorkspaceRetainResult } from "./node-workspace-retain-protocol-DrMK-4I_.mjs";
import { a as hasWorkerWorkspaceResultRef, c as preparedWorkerWorkspaceResultRef, f as workerWorkspaceResultRef, i as deleteWorkerWorkspaceResultCleanupRefs, n as cleanupWorkerWorkspaceResultRef, o as isWorkerWorkspaceResultCleanupRef, r as deleteStagedWorkerWorkspaceResult, t as applyStagedWorkerWorkspaceResult, u as restoreStagedWorkerWorkspaceResultFromCleanup } from "./workspace-result-staging-Cy039j72.mjs";
import { a as githubPublicationBaseFetchArgs, l as parseGitHubPublicationBaseBranch, n as readGitHubRepositoryPublicationBlob, o as githubPublicationBaseLineageArgs, r as readGitHubRepositoryPublicationMetadata, s as githubPublicationBaseLookupArgs, u as parseGitHubPublicationBaseRef } from "./github-repository-publication-snapshot-BsI_wN-N.mjs";
import { t as emitAgentRunStatusEvent } from "./agent-run-status-events-CxQDXWoO.mjs";
import { r as emitSessionsChanged } from "./session-change-event-DF8JnIsM.mjs";
import { n as resolveGitHubRepositoryTarget } from "./github-repository-target-Dzw_8VNK.mjs";
import { a as readProjectCheckoutRemoteHead, i as ProjectCloneError, t as materializeProjectClone } from "./project-clone-5R1HzM6y.mjs";
import { t as prepareSessionWorktree } from "./session-worktree-preparation-UPe9S0T9.mjs";
import { t as parseGitHubRemoteUrl } from "./github-remote-CloOx2kv.mjs";
import { n as WorkerRunnerUnavailableError, r as WorkerTunnelOwnerDisconnectedError, t as WorkerRunnerCapacityError } from "./tunnel-contract-C4XjTxW-.mjs";
import { a as withSessionRepositoryCheckpoint, i as stageSessionRepositoryCheckpoint } from "./session-repository-checkpoints-CYPVSe_l.mjs";
import { a as isUnavailableEnvironment, c as createDevicePlacementAuthority, i as isExactAttachedEnvironment, l as resolveDevicePlacementEligibility, n as createPlacementFailureActions, o as workerDisappearanceError, r as isCurrentActiveWorkerEnvironment, s as DevicePlacementUnavailableError } from "./placement-dispatch-failure-BRq2hfyf.mjs";
import { i as supportsCurrentWorkerLaunch, n as StaleWorkerBuildError, o as verifyWorkerAdmissionHandshake } from "./admission-BzZXJ5YD.mjs";
import { t as matchesWorkerPlacementTarget } from "./placement-reclaim-contract-BNCBrypU.mjs";
import { a as recoverGitHubPublicationBranchAndIndex, i as assertGitHubPublicationRefCasCompleted, n as restoreGitHubPublicationRequester, o as updateGitHubPublicationBranchAndIndex, r as GitHubPublicationRecoveryPendingError } from "./github-publication-requester-Y6oZYu3w.mjs";
import { n as readWorkerProjectPreparation } from "./preparation-identity-B9ncl7Bw.mjs";
import { t as listRetainedWorkerBundleHashes } from "./worker-bundle-retention-CjTcc8Ny.mjs";
import { a as captureGitHubPublicationWorkspaceSnapshot, c as githubPublicationRemoteHeadArgs, d as requirePublicationCommand, f as runPublicationCommand, h as prepareGitHubPublicationWorkflowGuard, i as assertSafeGitPublicationWorkspace, l as githubPublicationUpdateRefArgs, m as hasRepositoryGitHubPublicationWorkflowChanges, n as appendGitHubPublicationMessage, o as createGitHubPublicationCommandRunner, p as assertGitHubPublicationWorkflowChangesAllowed, r as assertGitHubPublicationBranchRef, s as githubPublicationPushArgs, t as prepareRepositoryPublicationRestore, u as hasGitHubPublicationWorkflowChanges } from "./github-repository-publication-restore-Crq0h3Jq.mjs";
import { i as repositoryGitHubPublicationDigest, n as listRepositoryGitHubPublicationsInDatabase, t as checkRepositoryGitHubPublication } from "./github-repository-publication.kernel-B5cAALar.mjs";
import { a as WorkerRuntimeRefreshPendingError, c as deriveEnvironmentIntent, r as readWorkerProjectSnapshot, s as WorkerPlacementAdmissionTargetError } from "./project-preparation-BjFR8zqw.mjs";
import { t as prepareWorkerGitHubBinding } from "./worker-github-binding-BAay-o87.mjs";
import { _ as recoverSessionWorkspaceCheckpoint, a as executeLocalTurn, c as requireActivePlacement, d as waitForPendingWorkerResult, g as createWorkerWorkspaceReconcileRequest, h as settleStagedWorkspaceResult, i as claimWorkerTurn, l as resolvePlacementIdentity, m as finalizeWorkspaceResultConflicts, n as WorkerWorkspaceReconciliationError, p as createWorkspaceResultJournal, r as failHandedOffTurn, s as releaseClaimIfOwned, t as WorkerTurnExecutionError, u as waitForInitialWorkerPlacement, v as sessionWorkspaceRoot } from "./worker-turn-failure-BrC70-vF.mjs";
import { r as verifyReconciledWorkspaceFinal, t as WorkerWorkspaceFinalFenceError } from "./workspace-finalize-DL6iiqwy.mjs";
import { n as createWorkerTurnRunOwner } from "./worker-turn-run-owner-CqYpY-LW.mjs";
import { isDeepStrictEqual } from "node:util";
import os from "node:os";
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
//#region src/gateway/github-publication-shared-read.ts
function readSharedGitHubPublicationSession(session, loaded) {
	const entry = loaded.entry;
	if (!entry || loaded.agentId !== session.agentId || loaded.canonicalKey !== session.sessionKey || entry.sessionId !== session.sessionId || session.lifecycleRevision !== void 0 && (entry.lifecycleRevision ?? null) !== session.lifecycleRevision) throw new GitHubPublicationSessionChangedError();
	return entry;
}
/** Execution resolvers open mutable stores. Observation uses their recorded owners on this reader. */
function readSharedGitHubPublicationWorkspace(db, session, entry) {
	if (entry.archivedAt !== void 0) return;
	const query = getNodeSqliteKysely(db);
	if (entry.repositoryWorkspaceId) {
		const workspace = tableExists(db, "session_repository_workspaces") ? executeSqliteQueryTakeFirstSync(db, query.selectFrom("session_repository_workspaces").selectAll().where("workspace_id", "=", entry.repositoryWorkspaceId)) : void 0;
		if (!workspace || workspace.agent_id !== session.agentId || workspace.session_key !== session.sessionKey) throw new Error("GitHub publication session repository owner is unavailable.");
		return {
			kind: "repository",
			workspaceId: workspace.workspace_id,
			branch: workspace.branch
		};
	}
	if (!entry.worktree?.id) return;
	const worktree = tableExists(db, "worktrees") ? executeSqliteQueryTakeFirstSync(db, query.selectFrom("worktrees").select([
		"id",
		"branch",
		"repo_root",
		"repo_fingerprint"
	]).where("owner_kind", "=", "session").where("owner_id", "=", session.sessionKey).where("removed_at", "is", null).orderBy("created_at", "desc").limit(1)) : void 0;
	if (!worktree || worktree.id !== entry.worktree.id || worktree.branch !== entry.worktree.branch || worktree.repo_root !== entry.worktree.repoRoot) throw new Error("GitHub publication session worktree owner is unavailable.");
	return {
		kind: "worktree",
		worktreeId: worktree.id,
		branch: worktree.branch,
		repositoryFingerprint: worktree.repo_fingerprint
	};
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
/** Shared observation never initializes schema, prepares identity, or resumes publication. */
function readSharedGitHubPublicationRequest(session, selector, entry) {
	return withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(({ db }) => runSqliteDeferredTransactionSync(db, () => {
		if (!tableExists(db, "github_publication_requests")) return;
		let selection = githubPublicationDatabase(db).selectFrom("github_publication_requests").selectAll("github_publication_requests").where("session_key", "=", session.sessionKey).where("agent_id", "=", session.agentId);
		if ("requestId" in selector) {
			selection = selection.where("github_publication_requests.request_id", "=", selector.requestId);
			const row = executeSqliteQueryTakeFirstSync(db, selection);
			if (!row) return;
			checkSharedWorktreeReceipt(row);
			if (row.status === "published" || row.status === "failed") return row;
		} else if (selector.idempotencyKey !== void 0) selection = selection.where("idempotency_key", "=", selector.idempotencyKey);
		const hasLifecycle = tableExists(db, "github_publication_session_lifecycles");
		const ordered = selection.leftJoin("github_publication_session_lifecycles as lifecycle", (join) => join.onRef("lifecycle.request_id", "=", "github_publication_requests.request_id").on("lifecycle.publication_kind", "=", "shared")).where((eb) => eb.or([eb("lifecycle.request_id", "is not", null), eb("github_publication_requests.status", "not in", ["published", "failed"])])).select(["lifecycle.request_id as lifecycle_request_id", "lifecycle.lifecycle_revision"]).orderBy("created_at_ms", "desc").orderBy("github_publication_requests.request_id", "desc").limit(64);
		const candidate = hasLifecycle ? executeSqliteQueryTakeFirstSync(db, ordered.limit(1)) : void 0;
		if (!(hasLifecycle ? candidate : executeSqliteQueryTakeFirstSync(db, selection.where("status", "not in", ["published", "failed"]).limit(1)))) return;
		const workspace = readSharedGitHubPublicationWorkspace(db, session, entry);
		if (workspace?.kind !== "worktree") return;
		if (!candidate) throw new Error("GitHub publication session binding is unavailable.");
		const revision = entry.lifecycleRevision ?? null;
		const matchesWorkspace = (row) => row.session_id === session.sessionId && row.lifecycle_revision === revision && row.worktree_id === workspace.worktreeId && row.repository_fingerprint === workspace.repositoryFingerprint && row.branch === workspace.branch;
		if (candidate.lifecycle_request_id !== null && matchesWorkspace(candidate)) {
			checkSharedWorktreeReceipt(candidate);
			return candidate;
		}
		let cursor;
		for (;;) {
			const after = cursor;
			const page = after ? ordered.where((eb) => eb.or([eb("created_at_ms", "<", after.created_at_ms), eb.and([eb("created_at_ms", "=", after.created_at_ms), eb("github_publication_requests.request_id", "<", after.request_id)])])) : ordered;
			const rows = executeSqliteQuerySync(db, page).rows;
			for (const row of rows) {
				checkSharedWorktreeReceipt(row);
				if (row.lifecycle_request_id === null) throw new Error("GitHub publication session binding is unavailable.");
				if (matchesWorkspace(row)) return row;
			}
			if (rows.length < 64) return;
			cursor = rows[rows.length - 1];
		}
	}));
}
function checkSharedWorktreeReceipt(row) {
	assertReadableSharedGitHubPublication(row);
	if (row.request_digest !== digestGitHubPublicationRequest({
		sessionId: row.session_id,
		idempotencyKey: row.idempotency_key,
		title: row.title ?? void 0,
		body: row.body ?? void 0
	})) throw new Error("GitHub publication receipt is corrupt.");
}
/** A malformed terminal row must not project as a new, pending publication. */
function assertReadableSharedGitHubPublication(row) {
	if (![
		"agent-override",
		"system-configured",
		"system-detected"
	].includes(row.identity_source) || !Number.isSafeInteger(row.identity_account_id) || row.identity_account_id <= 0 || !row.identity_login || ![
		"requested",
		"publishing",
		"published",
		"failed"
	].includes(row.status) || row.status === "published" && (!row.pull_request_url || !row.repository || !row.branch || !row.head_commit) || row.status === "failed" && (!row.error_code || !PUBLICATION_FAILURE_CODES.has(row.error_code) || !row.next_action)) throw new Error("Shared GitHub publication receipt is corrupt.");
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
				usage: {
					input: 0,
					output: 0,
					cacheRead: 0,
					cacheWrite: 0,
					totalTokens: 0,
					cost: {
						input: 0,
						output: 0,
						cacheRead: 0,
						cacheWrite: 0,
						total: 0
					}
				},
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
function githubPublicationPullRequestLookupArgs(params) {
	const marker = JSON.stringify(params.marker);
	return [
		"gh",
		"api",
		"--hostname",
		"github.com",
		"--method",
		"GET",
		`repos/${params.repository}/pulls`,
		"-f",
		`head=${params.owner}:${params.branch}`,
		"-f",
		`base=${params.baseBranch}`,
		"-f",
		"state=all",
		"--paginate",
		"--jq",
		`map({url: .html_url, userId: .user.id, state: .state, body: (if ((.body // "") | contains(${marker})) then ${marker} else "" end), headSha: .head.sha, headRef: .head.ref, baseRef: .base.ref}) | tojson`
	];
}
function githubPublicationCreatePullRequestArgs(repository) {
	return [
		"gh",
		"api",
		"--hostname",
		"github.com",
		"--method",
		"POST",
		`repos/${repository}/pulls`,
		"--input",
		"-"
	];
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
function resolveGitHubPublicationPullRequest(candidates, params) {
	const exact = candidates.filter((candidate) => candidate.userId === params.accountId && candidate.headSha === params.headCommit && candidate.headRef === params.branch && candidate.baseRef === params.baseBranch);
	return exact.find((candidate) => candidate.state === "open") ?? exact.find((candidate) => candidate.state === "closed" && candidate.body.includes(params.marker));
}
async function findGitHubPublicationPullRequest(params) {
	const identity = await params.refreshIdentity();
	params.assertCurrent();
	const candidates = parseGitHubPublicationPullRequests(await requirePublicationCommand(githubPublicationPullRequestLookupArgs({
		repository: params.repository,
		owner: params.pushOwner,
		branch: params.branch,
		baseBranch: params.baseBranch,
		marker: params.marker
	}), { env: identity.env }));
	const found = resolveGitHubPublicationPullRequest(candidates, {
		accountId: identity.account.accountId,
		headCommit: params.headCommit,
		branch: params.branch,
		baseBranch: params.baseBranch,
		marker: params.marker
	});
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
	const raw = await requirePublicationCommand([
		"gh",
		"api",
		"--hostname",
		"github.com",
		"--method",
		"GET",
		`repos/${params.pushRepository}/git/commits/${params.headCommit}`
	], { env: identity.env });
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
			"gh",
			"api",
			"--hostname",
			"github.com",
			"--method",
			"GET",
			`repos/${params.pushRepository}/compare/${params.headCommit}...${head}?per_page=1`,
			"--jq",
			"{sha: .merge_base_commit.sha}"
		], { env: currentIdentity.env }));
		if (!isRecord(comparison) || typeof comparison.sha !== "string" || !objectId.test(comparison.sha)) throw new Error("GitHub publication ancestry observation is invalid.");
		return comparison.sha === params.headCommit;
	};
	const lookupIdentity = await params.refreshIdentity();
	params.assertCurrent();
	const candidates = parseGitHubPublicationPullRequests(await requirePublicationCommand(githubPublicationPullRequestLookupArgs({
		repository: params.repository,
		owner: params.pushOwner,
		branch: params.branch,
		baseBranch: params.baseBranch,
		marker: params.marker
	}), { env: lookupIdentity.env }));
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
	const refs = JSON.parse(await requirePublicationCommand([
		"gh",
		"api",
		"--hostname",
		"github.com",
		"--method",
		"GET",
		`repos/${params.pushRepository}/git/matching-refs/heads/${encodeURIComponent(params.branch)}`
	], { env: refIdentity.env }));
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
	assertCurrent();
	const repositoryIdentity = await managedWorktrees.resolveRepositoryIdentity(worktree.path);
	assertCurrent();
	if (repositoryIdentity.checkoutRoot !== worktree.path || repositoryIdentity.repoRoot !== worktree.repoRoot || repositoryIdentity.fingerprint !== worktree.repoFingerprint) throw new GitHubPublicationWorkspaceChangedError("GitHub publication workspace repository changed.");
	const remote = parseGitHubRemoteUrl(repositoryIdentity.originUrl);
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
		"github.com",
		`repos/${pushRepository}`,
		"--jq",
		"{fork, default_branch, parent: {name: .parent.name, default_branch: .parent.default_branch, owner: {login: .parent.owner.login}}}"
	], { env: params.identity.env });
	assertCurrent();
	const value = JSON.parse(raw);
	const target = isRecord(value) ? resolveGitHubRepositoryTarget(value, remote) : void 0;
	if (!target) throw new Error("GitHub repository response omitted its publication target.");
	const repository = `${target.pullRequest.owner}/${target.pullRequest.repo}`;
	const baseBranch = target.fork ? target.pullRequest.defaultBranch : parseGitHubPublicationBaseBranch(worktree.baseRef, target.pullRequest.defaultBranch);
	if (!target.fork && branch === baseBranch) throw new GitHubPublicationWorkspaceChangedError("GitHub publication branch changed to its pull request base.");
	return {
		pushRepository,
		repository,
		branch,
		baseBranch,
		pushOwner: target.push.owner
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
		const { pushRepository, repository, branch, baseBranch, pushOwner } = await prepareGitHubPublicationTarget({
			worktree,
			identity,
			assertCurrent: assertAuthority
		});
		if (params.target && (params.target.pushRepository !== pushRepository || params.target.repository !== repository || params.target.baseBranch !== baseBranch)) throw new GitHubPublicationWorkspaceChangedError("GitHub publication accepted repository target changed.");
		const remoteBaseResult = await run(githubPublicationBaseLookupArgs(repository, baseBranch), { env: identity.env });
		if (remoteBaseResult.code !== 0) throw new Error("GitHub publication workspace base branch could not be verified.");
		const remoteBaseSha = parseGitHubPublicationBaseRef(remoteBaseResult.stdout.toString("utf8"), baseBranch);
		await step(() => assertSafeGitPublicationWorkspace(worktree.path, runPublicationCommand));
		identity = await refreshIdentity();
		const baseTransportEnv = {
			...identity.env,
			GIT_CONFIG_GLOBAL: gitNullConfigPath(),
			GIT_CONFIG_SYSTEM: gitNullConfigPath()
		};
		if ((await run(githubPublicationBaseFetchArgs(repository, remoteBaseSha), {
			cwd: worktree.path,
			env: baseTransportEnv
		})).code !== 0) throw new Error("GitHub publication workspace base could not be materialized.");
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
		const httpsRemote = `https://github.com/${pushRepository}.git`;
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
			if ((await run(githubPublicationBaseFetchArgs(pushRepository, remoteHead), {
				cwd: worktree.path,
				env: transportEnv
			})).code !== 0) throw new Error("GitHub publication remote branch could not be verified.");
			const ancestry = await run(githubPublicationBaseLineageArgs(remoteHead, headCommit), { cwd: worktree.path });
			if (ancestry.code === 1) throw new GitHubPublicationBranchChangedError();
			if (ancestry.code !== 0) throw new Error("GitHub publication remote branch could not be verified.");
		}
		const existingPullRequest = await step(findPullRequest);
		const assertWorkflowAuthority = await prepareGitHubPublicationWorkflowGuard(params.assertWorkflowChangesAllowed, () => hasGitHubPublicationWorkflowChanges({
			cwd: worktree.path,
			comparisonCommit: expectedRemoteHead || lineage.stdout.toString("utf8").trim(),
			workspaceTree,
			run
		}));
		const assertAction = () => {
			assertWorkflowAuthority();
			assertAuthority();
		};
		assertAction();
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
		const attribution = resolveGitCoauthorAttribution({
			agentId: row.agent_id,
			config,
			excludeAccountId: identity.account.accountId,
			sessionKey: row.session_key,
			storePath: loaded.storePath
		});
		const contributorCredit = attribution?.logins.map((login) => `- @${login}`).join("\n");
		const messageLines = currentMessage.split(/\r?\n/u);
		if (existingPullRequest && remoteHead === headCommit && currentTree === workspaceTree && sourceIndexTree === workspaceTree && messageLines.some((line) => line.startsWith(`${PUBLICATION_MARKER}: `)) && (attribution?.trailers ?? []).every((trailer) => messageLines.includes(trailer))) return params.projectResult(params.complete(row, {
			requestId: row.request_id,
			status: "published",
			url: existingPullRequest,
			repository,
			branch,
			headCommit
		}));
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
			const created = await runPublicationCommand(githubPublicationCreatePullRequestArgs(repository), {
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
		return params.projectResult(params.complete(row, {
			requestId: row.request_id,
			status: "published",
			url: pullRequestUrl,
			repository,
			branch,
			headCommit
		}));
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
//#region src/gateway/github-personal-publication.ts
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
		const code = row.session_id !== session.sessionId || !lifecycle || lifecycle.lifecycle_revision !== (session.lifecycleRevision ?? null) ? "session_changed" : connection.generation !== row.connection_generation || connection.account?.accountId !== row.identity_account_id || connection.account.login.toLowerCase() !== row.identity_login.toLowerCase() ? "identity_changed" : null;
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
				recordEffect: (effect, observed) => execution.recordEffect(effect, observed),
				interrupt: () => execution.interrupt()
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
function createSharedGitHubPublicationReadMethods(readReceipt) {
	const readShared = (session, selector) => readReceipt(session, selector, readSharedGitHubPublicationSession(session, loadGatewaySessionEntryReadOnly(session.sessionKey, { agentId: session.agentId })));
	return {
		sharedStatus(session, requestId) {
			const row = readShared(session, { requestId });
			return row ? {
				result: projectGitHubPublicationResult(row),
				confirmation: null
			} : void 0;
		},
		latestShared(session, idempotencyKey) {
			const row = readShared(session, { idempotencyKey });
			return row ? {
				result: projectGitHubPublicationResult(row),
				confirmation: null
			} : null;
		}
	};
}
function createGitHubPublicationCoordinatorMethods(params) {
	const { readById, requestForClaim, sameWorktree, processRow } = params;
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
			const pending = new Set(params.placements.listPendingWorkspaceResults().map((result) => result.sessionId));
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
				results.push(await processRow(row, () => params.placements.validateWorkspaceResultClaim(claim)));
			}
			const deferred = executeSqliteQuerySync(db, githubPublicationDatabase(db).selectFrom("github_publication_requests").selectAll().where("session_id", "=", claim.sessionId).where("claim_id", "is", null).where("status", "=", "requested").orderBy("created_at_ms")).rows;
			for (const row of deferred) results.push(await processRow(row, () => params.placements.validateWorkspaceResultClaim(claim)));
			return results;
		},
		deferOrphanedRequests() {
			if (!hasGitHubPublicationStore()) return;
			const pending = new Set(params.placements.listPendingWorkspaceResults().map((row) => `${row.sessionId}\0${row.claimId}\0${row.runId}`));
			const db = openOpenClawStateDatabase().db;
			deferGitHubPublicationRequests(executeSqliteQuerySync(db, githubPublicationDatabase(db).selectFrom("github_publication_requests").selectAll().where("status", "in", ["requested", "publishing"]).orderBy("created_at_ms")).rows.filter((row) => {
				if (row.claim_id === null) return false;
				const ownerKey = `${row.session_id}\0${row.claim_id}\0${row.run_id}`;
				const liveClaim = params.placements.get(row.session_id)?.turnClaim;
				const stillLive = liveClaim?.claimId === row.claim_id && liveClaim.runId === row.run_id && liveClaim.generation === row.placement_generation;
				return !pending.has(ownerKey) && !stillLive;
			}).map((row) => row.request_id));
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
		...createSharedGitHubPublicationReadMethods(readSharedGitHubPublicationRequest),
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
function apiArgs(endpoint, method = "GET") {
	return [
		"gh",
		"api",
		"--hostname",
		"github.com",
		"--method",
		method,
		endpoint,
		...method === "GET" ? [] : ["--input", "-"]
	];
}
async function api(endpoint, identity, assertCurrent, body) {
	assertCurrent();
	const raw = await requirePublicationCommand(apiArgs(endpoint, body === void 0 ? "GET" : "POST"), {
		env: identity.env,
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
	const remote = parseGitHubRemoteUrl(workspace.url);
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
		assertCurrent();
		const lineage = await requirePublicationCommand([
			...apiArgs("repos/" + repository + "/compare/" + snapshot.baseCommit + "..." + remoteBase + "?per_page=1"),
			"--jq",
			"{sha: .merge_base_commit.sha}"
		], { env: identity.env });
		assertCurrent();
		const mergeBase = objectSha(JSON.parse(lineage));
		let headCommit = row.head_commit;
		const verifyCommit = (value) => {
			if (!isRecord(value) || objectSha(value.tree) !== snapshot.workspaceTree || !Array.isArray(value.parents) || value.parents.length !== 1 || objectSha(value.parents[0]) !== (row.previous_head_commit ?? snapshot.baseCommit) || typeof value.message !== "string" || !value.message.split(/\r?\n/u).includes("OpenClaw-Publication: " + row.request_id)) throw new GitHubPublicationWorkspaceChangedError("GitHub publication commit does not match its accepted checkpoint.");
			return objectSha(value);
		};
		if (headCommit) {
			if (verifyCommit(await api(endpoint + "commits/" + headCommit, identity, assertCurrent)) !== headCommit) throw new Error("GitHub publication commit identity changed.");
		}
		const observeHead = async () => {
			const observedIdentity = await refreshIdentity();
			const raw = await requirePublicationCommand(apiArgs(endpoint + "matching-refs/heads/" + encodeURIComponent(branch)), { env: observedIdentity.env });
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
			readTree: (owner, sha) => api("repos/" + owner + "/git/trees/" + sha, identity, assertCurrent)
		}));
		const assertAction = () => {
			assertWorkflowAuthority();
			assertCurrent();
		};
		assertAction();
		const config = currentGitHubPublicationConfig();
		const attribution = resolveGitCoauthorAttribution({
			agentId: row.agent_id,
			config,
			excludeAccountId: identity.account.accountId,
			sessionKey: row.session_key,
			storePath: params.storePath
		});
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
			const result = await runPublicationCommand(apiArgs("graphql", "POST"), {
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
			const created = await runPublicationCommand(githubPublicationCreatePullRequestArgs(repository), {
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
/** Filter the mixed table before decoding; a private request ID never grants shared access. */
function readSharedRepositoryGitHubPublication(session, selector, entry) {
	return withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(({ db }) => runSqliteDeferredTransactionSync(db, () => {
		if (!tableExists(db, table)) return;
		let selection = query(db).selectFrom(table).selectAll().where("owner_profile_id", "is", null).where("session_key", "=", session.sessionKey).where("agent_id", "=", session.agentId);
		if ("requestId" in selector) {
			selection = selection.where("request_id", "=", selector.requestId);
			const row = executeSqliteQueryTakeFirstSync(db, selection);
			if (!row) return;
			checkRepositoryGitHubPublication(row);
			assertReadableSharedGitHubPublication(row);
			if (terminalRepositoryGitHubPublication(row)) return row;
		} else {
			if (selector.idempotencyKey !== void 0) selection = selection.where("idempotency_key", "=", selector.idempotencyKey);
			if (!executeSqliteQueryTakeFirstSync(db, selection.limit(1))) return;
		}
		const workspace = readSharedGitHubPublicationWorkspace(db, session, entry);
		if (workspace?.kind !== "repository") return;
		const revision = entry.lifecycleRevision ?? null;
		const ordered = selection.orderBy("created_at_ms", "desc").orderBy("request_id", "desc").limit(64);
		let cursor;
		for (;;) {
			const after = cursor;
			const page = after ? ordered.where((eb) => eb.or([eb("created_at_ms", "<", after.created_at_ms), eb.and([eb("created_at_ms", "=", after.created_at_ms), eb("request_id", "<", after.request_id)])])) : ordered;
			const rows = executeSqliteQuerySync(db, page).rows;
			for (const row of rows) {
				checkRepositoryGitHubPublication(row);
				assertReadableSharedGitHubPublication(row);
				if (row.session_id === session.sessionId && row.session_lifecycle_revision === revision && row.workspace_id === workspace.workspaceId && row.branch === workspace.branch) return row;
			}
			if (rows.length < 64) return;
			cursor = rows[rows.length - 1];
		}
	}));
}
function listRepositoryGitHubPublications(filter = {}) {
	return listRepositoryGitHubPublicationsInDatabase(openOpenClawStateDatabase().db, filter);
}
async function readPendingRepositoryGitHubPublication(input) {
	const context = captureOpenClawStateWorkerContext();
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-BgU7tLf5.mjs");
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
function repositoryOwner(session) {
	const owner = resolveGitHubPublicationWorkspaceOwner(session);
	if (owner.kind !== "repository") throw new Error("GitHub publication repository owner changed.");
	return owner;
}
function resolveReceiptOwner(row) {
	const loaded = loadGatewaySessionEntryReadOnly(row.session_key, { agentId: row.agent_id });
	const workspace = getSessionRepositoryWorkspaceStore().get(row.workspace_id);
	if (loaded.entry?.sessionId !== row.session_id || (loaded.entry.lifecycleRevision ?? null) !== row.session_lifecycle_revision || loaded.canonicalKey !== row.session_key || loaded.agentId !== row.agent_id || loaded.entry.archivedAt !== void 0 || !workspace || workspace.agentId !== row.agent_id || workspace.sessionKey !== row.session_key || workspace.branch !== row.branch || loaded.entry.repositoryWorkspaceId !== row.workspace_id) return;
	return {
		loaded,
		workspace
	};
}
function assertReceiptOwner(row) {
	const owner = resolveReceiptOwner(row);
	if (!owner) throw new GitHubPublicationSessionChangedError();
	return owner;
}
async function captureCheckpoint(row, assertCurrent, use) {
	const { workspace } = assertReceiptOwner(row);
	if (!workspace.checkpointRef) throw new Error("GitHub publication is waiting for the first accepted repository checkpoint.");
	const assertSelected = () => {
		assertCurrent();
		assertReceiptOwner(row);
		const current = getSessionRepositoryWorkspaceStore().get(workspace.workspaceId);
		if (current?.revision !== workspace.revision || current.checkpointRef !== workspace.checkpointRef) throw new Error("GitHub publication checkpoint changed during preparation.");
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
		const { assertCurrent, refreshIdentity } = createGitHubPublicationExecutionIdentity({
			row,
			validateAuthority: () => {
				assertCustody();
				return execution.ownsExecution();
			},
			assertWorkspace: () => {
				assertReceiptOwner(row);
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
					if (!resolveReceiptOwner(row)) {
						failStaleRepositoryGitHubPublication(row, () => Boolean(resolveReceiptOwner(row)));
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
		deferOrphanedRequests() {
			const pending = placements.listPendingWorkspaceResults();
			deferRepositoryGitHubPublicationClaims(listRepositoryGitHubPublications({
				ownerProfileId: null,
				pending: true
			}).filter((row) => {
				if (!row.claim_id) return false;
				const placement = placements.get(row.session_id);
				const claim = placement ? exactClaimForPlacement(placement) : void 0;
				return !(claim && matchesRepositoryGitHubPublicationClaim(row, claim)) && !pending.some((result) => result.sessionId === row.session_id && result.claimId === row.claim_id && result.runId === row.run_id);
			}).map((row) => row.request_id));
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
	const personalStatus = (row, action, session) => {
		action.assertCurrent();
		if (row.owner_profile_id !== action.owner || row.session_key !== session.sessionKey || row.agent_id !== session.agentId) throw new Error("My GitHub publication was not found for this profile and session.");
		const executing = row.execution_id !== null && row.gateway_instance_id === instanceId && active.get(row.request_id) === row.execution_id;
		const pending = !terminalRepositoryGitHubPublication(row) && !executing;
		const connection = pending ? personalGitHubStatus(action) : null;
		if (pending && (row.session_id !== session.sessionId || row.session_lifecycle_revision !== (session.lifecycleRevision ?? null) || !resolveReceiptOwner(row) || connection?.generation !== row.connection_generation || connection.account?.accountId !== row.identity_account_id || connection.account.login.toLowerCase() !== row.identity_login.toLowerCase())) return {
			result: projectGitHubPublicationResult({
				...row,
				status: "failed",
				error_code: row.session_id !== session.sessionId || row.session_lifecycle_revision !== (session.lifecycleRevision ?? null) || !resolveReceiptOwner(row) ? "session_changed" : "identity_changed",
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
	const execute = async (initial, context) => {
		let row = requireRepositoryGitHubPublication(initial.request_id);
		if (terminalRepositoryGitHubPublication(row)) return projectGitHubPublicationResult(row);
		const { assertCustody, action } = context;
		assertCustody();
		const { loaded } = assertReceiptOwner(row);
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
			assertReceiptOwner(row);
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
					assertReceiptOwner(row);
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
				if (row.owner_profile_id === null && !assertReceiptOwner(row).workspace.checkpointRef) return projectGitHubPublicationResult(row);
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
		const initial = repositoryOwner(session);
		const assertCurrent = () => {
			requester.assertCurrent();
			const placement = claim ? placements.get(session.sessionId) : void 0;
			if (!sameGitHubPublicationWorkspace(initial, repositoryOwner(session)) || claim && (!placement || claim.sessionId !== session.sessionId || placement.agentId !== session.agentId || placement.sessionKey !== session.sessionKey || !resolvePlacementTurnEnvironment(placement, claim))) throw new Error("GitHub publication session authority changed.");
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
				return personalStatus(existing, action, action).result;
			}
			const bound = bindPersonalGitHubPublicationSelection(action, selected, {
				idempotencyKey: input.idempotencyKey,
				hasRequest: () => Boolean(requestByKey(action.sessionId, input.idempotencyKey, action.owner))
			});
			return await placements.withRepositoryWorkspaceReservation(action, async (assertReservation) => {
				const initial = repositoryOwner(action);
				const assertCurrent = () => {
					action.assertCurrent();
					assertReservation();
					bound.assertCurrent();
					if (!sameGitHubPublicationWorkspace(initial, repositoryOwner(action))) throw new Error("My GitHub repository owner changed.");
				};
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
			}).filter((candidate) => candidate.claim_id === null || matchesRepositoryGitHubPublicationClaim(candidate, claim))) results.push(await placements.withWorkspaceExclusion(row.session_id, async (assertOwned) => await execute(row, { assertCustody: () => {
				assertOwned();
				if (!placements.validateWorkspaceResultClaim(claim)) throw new Error("GitHub publication lost its workspace result claim.");
			} })));
			return results;
		},
		...createRepositoryGitHubPublicationRecovery({
			placements,
			getCommittedRuntimeConfig,
			isExecuting: (requestId) => active.has(requestId),
			execute: (row, assertCustody) => execute(row, { assertCustody })
		}),
		...createSharedGitHubPublicationReadMethods(readSharedRepositoryGitHubPublication),
		personalStatus(action, session, requestId) {
			const row = readRepositoryGitHubPublication(requestId);
			return row ? personalStatus(row, action, session) : void 0;
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
			return personalStatus(row, action, session);
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
		params.placements.closeWorkerTurnToolAdmission(claim);
		const rows = listGitHubPublicationsForClaim(claim, { pendingOnly: true });
		if (rows.length === 0) return;
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
		requestForClaim: (request) => resolveGitHubPublicationWorkspaceOwner({
			sessionId: request.claim.sessionId,
			sessionKey: request.sessionKey,
			agentId: request.agentId
		}).kind === "repository" ? repository.requestForClaim(request) : requestForClaim(request),
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
		requestPersonalForSession(...args) {
			return resolveGitHubPublicationWorkspaceOwner(args[1]).kind === "repository" ? repository.requestPersonalForSession(...args) : personal.requestPersonalForSession(...args);
		},
		sharedStatus(...args) {
			return repository.sharedStatus(...args) ?? methods.sharedStatus(...args);
		},
		latestShared(...args) {
			return repository.latestShared(...args) ?? methods.latestShared(...args);
		},
		personalStatus(...args) {
			return repository.hasRequest(args[2]) ? repository.personalStatus(...args) : personal.personalStatus(...args);
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
		deferOrphanedRequests() {
			methods.deferOrphanedRequests();
			repository.deferOrphanedRequests();
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
			coordinator.deferOrphanedRequests();
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
	return params.environments.subscribeMachineShapeChanged((profileId) => {
		const context = params.getSessionChangeContext?.();
		if (!context) return;
		for (const placement of params.placements.list()) if (readWorkerPlacementIdentity(placement, params.environments)?.profileId === profileId) emitSessionsChanged(context, {
			reason: "placement",
			sessionKey: placement.sessionKey,
			agentId: placement.agentId
		});
	});
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
//#region src/gateway/server-worker-placement-session-target.ts
var WorkerDispatchTargetChangedError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.code = "invalid_state";
	}
};
async function runWorkerPlacementSessionBarrier(params) {
	const target = params.sessionRuntime.resolveGatewaySessionStoreTargetWithStore({
		cfg: params.getConfig(),
		key: params.sessionKey,
		agentId: params.agentId,
		clone: false,
		exactRead: true
	});
	return await runExclusiveSessionLifecycleMutation({
		scope: target.storePath,
		identities: [
			params.sessionKey,
			target.canonicalKey,
			...target.storeKeys,
			params.sessionId
		],
		signal: params.signal,
		run: async () => {
			const { config, target: currentTarget, entry, workspace } = resolveWorkerPlacementSessionTarget({
				sessionRuntime: params.sessionRuntime,
				config: params.getConfig(),
				sessionId: params.sessionId,
				sessionKey: params.sessionKey,
				agentId: params.agentId,
				expectedTarget: target,
				errorMessage: `Session ${params.sessionKey} changed before cloud worker ${params.action}. Retry.`
			});
			if (entry.archivedAt !== void 0) throw new WorkerDispatchTargetChangedError(`Session ${params.sessionKey} was archived before cloud worker ${params.action}. Retry.`);
			const currentRuntime = params.sessionRuntime.resolveWorkerPlacementSessionRuntime({
				cfg: config,
				entry,
				agentId: currentTarget.agentId,
				sessionKey: currentTarget.canonicalKey
			});
			if (params.sessionRuntime.resolveWorkerPlacementExecutionMode(currentRuntime) !== params.executionMode) throw new WorkerDispatchTargetChangedError(`Session ${params.sessionKey} runtime changed to ${currentRuntime} before cloud worker ${params.action}. Retry.`);
			return await params.run(workspace);
		}
	});
}
/** Keep canonical session identity and its durable workspace owner in one lifecycle fence. */
function resolveWorkerPlacementSessionTarget(params) {
	const target = params.sessionRuntime.resolveGatewaySessionStoreTargetWithStore({
		cfg: params.config,
		key: params.sessionKey,
		agentId: params.agentId,
		clone: false,
		exactRead: true
	});
	const entry = params.sessionRuntime.resolveCanonicalSessionEntryFromStoreKeys(target.store, target.storeKeys);
	const expected = params.expectedTarget;
	const targetChangedError = () => expected ? new WorkerDispatchTargetChangedError(params.errorMessage) : new Error(params.errorMessage);
	if (expected && (target.storePath !== expected.storePath || target.canonicalKey !== expected.canonicalKey || target.agentId !== expected.agentId)) throw targetChangedError();
	if (!entry || entry.sessionId !== params.sessionId) throw targetChangedError();
	if (entry.repositoryWorkspaceId) {
		const repository = getSessionRepositoryWorkspaceStore().get(entry.repositoryWorkspaceId);
		if (!repository || repository.agentId !== target.agentId || repository.sessionKey !== target.canonicalKey || entry.worktree) throw targetChangedError();
		return {
			config: params.config,
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
		config: params.config,
		target,
		entry,
		worktree,
		workspace: {
			kind: "local",
			path: worktree.path
		}
	};
}
const loadWorkerPlacementSessionRuntimeModule = createLazyRuntimeModule(async () => {
	const [placementSessionRuntime, { managedWorktrees }, sessionUtils] = await Promise.all([
		import("./placement-session-runtime-ClNA3QWt.mjs"),
		import("./service-BSrAmEtE.mjs"),
		import("./session-utils-DrtAZgUw.mjs")
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
function createWorkerPlacementNodeWorkspaceBindingResolver(options) {
	return async (binding) => {
		const placement = options.placements.get(binding.sessionId);
		if (!placement || placement.state !== "active" && placement.state !== "draining" && placement.state !== "reconciling" || placement.environmentId !== binding.environmentId || placement.activeOwnerEpoch !== binding.ownerEpoch) return;
		const workspace = await options.resolveWorkspace({
			sessionId: placement.sessionId,
			sessionKey: placement.sessionKey,
			agentId: placement.agentId
		});
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
//#region src/gateway/server-worker-placement-move-barrier.ts
function createGatewayWorkerPlacementMoveBarrier(params) {
	return async ({ sessionId, sessionKey, agentId, sourceDisposition, authorize, signal, begin }) => {
		const sessionRuntime = await params.loadSessionRuntime();
		const target = sessionRuntime.resolveGatewaySessionStoreTargetWithStore({
			cfg: getRuntimeConfig(),
			key: sessionKey,
			agentId,
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
		await runExclusiveSessionLifecycleMutation({
			scope: target.storePath,
			identities: lifecycleIdentities,
			signal,
			prepare: async () => {
				resolveWorkerPlacementSessionTarget({
					sessionRuntime,
					config: getRuntimeConfig(),
					sessionId,
					sessionKey,
					agentId,
					expectedTarget: target,
					errorMessage: `Session ${sessionKey} changed before placement move. Retry.`
				});
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
				clearSessionQueues(lifecycleIdentities);
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
				if (!await interruptSessionWorkAdmissions({
					scope: target.storePath,
					identities: lifecycleIdentities,
					timeoutMs: 15e3
				})) throw new Error(`Session ${sessionKey} is still active; placement move interrupted`);
				await params.placements.waitForTurnClaimRelease(sessionId, { timeoutMs: SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS });
				await runExclusiveSessionStoreWrite(target.storePath, async () => {}, { reentrant: true });
			},
			run: async () => {
				if (!begun) throw new Error(`Session ${sessionKey} placement move barrier did not start`);
			}
		});
		if (!begun) throw new Error(`Session ${sessionKey} placement move barrier did not complete`);
		return begun;
	};
}
//#endregion
//#region src/gateway/server-worker-placement-move-destination.ts
function createGatewayWorkerPlacementMoveDestinationResolver(params) {
	return async (identity, moveTarget) => {
		if (moveTarget.kind === "gateway") return;
		const sessionRuntime = await params.loadSessionRuntime();
		const { config, target, entry } = resolveWorkerPlacementSessionTarget({
			sessionRuntime,
			config: params.getConfig(),
			...identity,
			errorMessage: `Session ${identity.sessionKey} changed before placement move recovery.`
		});
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
		let workspace;
		let reclaimedPlacement;
		await runExclusiveSessionLifecycleMutation({
			scope: target.storePath,
			identities: lifecycleIdentities,
			prepare: async (lifecycle) => {
				beforeDrain?.();
				const resolved = resolveWorkerPlacementSessionTarget({
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
				workspace = resolved.workspace;
				const assertCurrent = () => {
					authorize?.();
					resolveWorkerPlacementSessionTarget({
						sessionRuntime,
						config: getRuntimeConfig(),
						sessionId,
						sessionKey,
						agentId,
						expectedTarget: target,
						errorMessage: `Session ${sessionKey} changed before cloud worker stop. Retry.`
					});
				};
				await cancelAndDrain(lifecycle.closeWorkAdmissions, assertCurrent);
			},
			run: async () => {
				if (!workspace) throw new Error(`Session ${sessionKey} cloud worker stop barrier did not prepare`);
				authorize?.();
				beforeDrain?.();
				const placement = begin();
				reclaimedPlacement = await reclaim(workspace, placement, authorize);
				params.revokeSessionAuthority({
					sessionId,
					sessionKeys: lifecycleIdentities
				});
			}
		});
		if (!reclaimedPlacement) throw new Error(`Session ${sessionKey} cloud worker stop barrier did not complete`);
		return reclaimedPlacement;
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
				clone: false,
				exactRead: true
			});
			const currentEntry = sessionRuntime.resolveCanonicalSessionEntryFromStoreKeys(currentTarget.store, currentTarget.storeKeys);
			if (currentTarget.storePath !== target.storePath || currentTarget.canonicalKey !== target.canonicalKey || currentTarget.agentId !== target.agentId || currentEntry?.sessionId !== sessionId) throw new WorkerDispatchTargetChangedError(`Session ${sessionKey} changed before failed cloud worker cleanup. Retry.`);
			authorize?.();
		};
		let reclaimedPlacement;
		await runExclusiveSessionLifecycleMutation({
			scope: target.storePath,
			identities: lifecycleIdentities,
			prepare: async (lifecycle) => {
				assertCurrent();
				if (params.placements.get(sessionId)?.state === "failed") await cancelAndDrain(lifecycle.closeWorkAdmissions, assertCurrent);
			},
			run: async () => {
				assertCurrent();
				reclaimedPlacement = await reclaim(authorize);
			}
		});
		if (!reclaimedPlacement) throw new Error(`Session ${sessionKey} failed cloud worker cleanup did not complete`);
		return reclaimedPlacement;
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
		const references = params.placements.list().filter((placement) => placement.environmentId === environmentId);
		if (references.length > 1) throw new Error(`Worker environment ${environmentId} has multiple placement owners`);
		const owner = references[0];
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
	const prepared = prepareSessionStoreTargetInventory(cfg, disk.map(({ probe }) => probe.agentId), env);
	const registryRead = prepareOpenClawAgentDatabaseRegistrySnapshotRead({ env });
	const nativeReaders = retainOpenClawAgentDatabaseReadCandidates(prepared.candidates.flatMap((candidate) => [candidate, {
		...candidate,
		path: candidate.physicalPath
	}]), env);
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
	let assertRegistryCurrent;
	const unsubscribe = sessionChanges.subscribe((change) => {
		if ("all" in change || !change.storePath) {
			changed = true;
			return;
		}
		const pathname = resolveUnsuffixedSqliteTargetFromSessionStorePath(change.storePath).path;
		changed ||= prepared.candidates.some((candidate) => matchesAgentDatabaseReadCandidatePath(candidate, pathname) || matchesAgentDatabaseReadCandidatePath({
			...candidate,
			path: candidate.physicalPath
		}, pathname));
	});
	try {
		await withSessionHistoryWorkerReadCandidates(prepared.candidates, async (discovery) => {
			let inventory = await discovery.readTargetInventory({
				...prepared,
				registeredDatabases: { status: "deferred" }
			});
			if (inventory.kind === "session-target-registry-required") {
				const registry = await registryRead.read();
				assertRegistryCurrent = registry.assertCurrent;
				registry.assertCurrent();
				discovery.assertCurrent();
				inventory = await discovery.readTargetInventory({
					...prepared,
					registeredDatabases: registry.result.status === "available" ? registry.result.entries : { status: "unavailable" }
				});
				if (inventory.kind === "session-target-registry-required") throw new Error("Session target discovery requested registry rows twice");
			}
			assertRegistryCurrent?.();
			discovery.assertCurrent();
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
						sessionKey: normalizeSqliteSessionKey(probe.sessionKey)
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
					assertRegistryCurrent?.();
					discovery.assertCurrent();
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
		assertRegistryCurrent?.();
		for (const candidate of prepared.candidates) if (captureSessionStoreReadCandidate(candidate.path, candidate.scope).physicalPath !== candidate.physicalPath) throw new Error("Session store alias changed during discovery; retry the read.");
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
	const orphanedJournals = params.placements.pruneOrphanedWorkspaceReconciliations({ retainFailedOwner: (recoveryError) => recoveryError.startsWith(FORCED_WORKER_ABANDONMENT_ERROR) });
	for (const owner of orphanedJournals) workerPlacementLog.warn(`discarded orphaned cloud workspace journal for ${owner.sessionId}`);
	for (const owner of params.placements.listWorkspaceReconciliationOwners()) try {
		const placement = params.placements.getWorkspaceReconciliationPlacement(owner);
		if (!placement) throw new Error(`Cloud workspace journal has no matching owner: ${owner.sessionId}`);
		const workspace = await params.resolveWorkspace({
			sessionId: placement.sessionId,
			sessionKey: placement.sessionKey,
			agentId: placement.agentId
		});
		if (workspace.kind !== "local") throw new Error("Repository checkpoints cannot own a local worktree reconciliation journal");
		const journal = params.placements.loadWorkspaceReconciliation(owner);
		if (!journal) continue;
		await recoverWorkerWorkspaceReconciliation({
			root: workspace.path,
			journal
		});
		params.placements.abortWorkspaceReconciliation(owner);
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
	const repositories = getSessionRepositoryWorkspaceStore();
	const repository = repositories.get(workspaceId);
	if (!repository || repository.agentId !== params.agentId || repository.sessionKey !== initial.canonicalKey || !repository.baseCommit) throw new Error("Repository workspace has no pinned source; retry its cloud preparation");
	const remote = parseGitHubRemoteUrl(repository.url);
	if (!remote) throw new Error("Repository workspace has no GitHub source");
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
		if (currentBranch.unsettled || currentBranch.head?.pushed_head_commit !== published?.pushed_head_commit || current.storePath !== initial.storePath || current.canonicalKey !== initial.canonicalKey || current.entry?.sessionId !== params.sessionId || current.entry.lifecycleRevision !== initial.entry?.lifecycleRevision || current.entry.repositoryWorkspaceId !== workspaceId || repositories.get(workspaceId)?.revision !== repository.revision) throw new Error("Repository workspace changed during Gateway materialization; retry move");
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
		token: github?.token
	}).catch((error) => {
		if (error instanceof ProjectCloneError && error.failure === "auth_required") throw new ProjectCloneError(error.failure, "GitHub could not authenticate this repository with the selected shared GitHub identity. Check its repository access or reconnect it in Settings, then retry the Gateway move.");
		throw error;
	});
	assertCurrent();
	const { step, require: command, run } = createGitHubPublicationCommandRunner(assertCurrent);
	const cloneOptions = {
		signal: params.signal,
		token: github?.token
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
					load: () => void 0,
					begin: assertCurrent,
					commit: assertCurrent,
					abort: () => {}
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
const TERMINAL_ENVIRONMENT_STATES = /* @__PURE__ */ new Set([
	"destroyed",
	"failed",
	"orphaned"
]);
function nodeEnvironments(options, nodeId) {
	return options.environments.list().filter((environment) => environment.nodeDeviceId === nodeId);
}
function bundleStatusTargetForNode(options, nodeId) {
	return nodeEnvironments(options, nodeId).filter((environment) => environment.bootstrapReceipt !== null && !TERMINAL_ENVIRONMENT_STATES.has(environment.state)).toSorted((left, right) => right.createdAtMs - left.createdAtMs || left.environmentId.localeCompare(right.environmentId))[0]?.bootstrapReceipt;
}
function snapshotBundleHashesForNode(options, nodeId) {
	const environments = nodeEnvironments(options, nodeId);
	const environmentIds = new Set(environments.map((environment) => environment.environmentId));
	return listRetainedWorkerBundleHashes({
		environments,
		placements: options.placements.list().filter((placement) => placement.environmentId !== null && environmentIds.has(placement.environmentId))
	});
}
function snapshotEntriesForNode(options, nodeId) {
	const placements = new Map(options.placements.list().map((placement) => [placement.sessionId, placement]));
	const pendingResults = new Map(options.placements.listPendingWorkspaceResults().map((result) => [result.sessionId, result]));
	return nodeEnvironments(options, nodeId).flatMap((environment) => {
		if (TERMINAL_ENVIRONMENT_STATES.has(environment.state) || environment.nodeDeviceId !== nodeId || environment.attachedSessionIds.length !== 1) return [];
		const sessionId = environment.attachedSessionIds[0];
		const placement = placements.get(sessionId);
		const pending = pendingResults.get(sessionId);
		const unsettled = placement?.turnClaim || pending?.environmentId === environment.environmentId && pending.ownerEpoch === environment.ownerEpoch;
		const exactManifest = (placement?.state === "starting" || placement?.state === "active" || placement?.state === "draining" || placement?.state === "reconciling") && !unsettled && placement.environmentId === environment.environmentId && placement.workspaceBaseManifestRef && (placement.activeOwnerEpoch === environment.ownerEpoch || placement.state === "starting") ? [.../* @__PURE__ */ new Set([placement.workspaceBaseManifestRef, ...options.additionalManifestRefs?.(placement) ?? []])].toSorted() : null;
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
	const publishSnapshot = async (currentTransport, node) => {
		const bundleRetention = options.bundleRetention;
		let currentBuild = bundleRetention && !bundleRetention.isEnvironmentOwnedNode(node.nodeId) ? await bundleRetention.currentBuild() : void 0;
		if (bundleRetention?.isEnvironmentOwnedNode(node.nodeId)) currentBuild = void 0;
		const isCurrent = () => !stopped && transport === currentTransport && currentTransport.isCurrent(node) && (!currentBuild || !bundleRetention.isEnvironmentOwnedNode(node.nodeId));
		if (!isCurrent()) return;
		const retainedBundleHashes = [.../* @__PURE__ */ new Set([...snapshotBundleHashesForNode(options, node.nodeId), ...currentBuild ? [currentBuild.bundleHash] : []])].toSorted();
		const bundleRetentionSupported = node.workerHost.bundleRetention === 1;
		const bundleStatusSupported = node.workerHost.bundleStatus === 1;
		const baseInput = {
			version: 1,
			gatewayNamespace: options.gatewayNamespace,
			controllerId,
			sequence: sequence += 1,
			retain: snapshotEntriesForNode(options, node.nodeId)
		};
		const priorGeneration = acknowledgedBundleGenerationByNode.get(node.nodeId);
		const acknowledgedBundleGeneration = priorGeneration?.connId === node.connId ? priorGeneration.generation : void 0;
		const retentionInput = {
			...baseInput,
			bundleHashes: retainedBundleHashes,
			...acknowledgedBundleGeneration !== void 0 ? { acknowledgedBundleGeneration } : {}
		};
		const bundleHashesFit = retainedBundleHashes.length <= 4096 && Buffer.byteLength(JSON.stringify(retentionInput), "utf8") <= 1048576;
		const bundleStatusTarget = bundleStatusSupported ? currentBuild ?? bundleStatusTargetForNode(options, node.nodeId) : void 0;
		const statusInput = bundleStatusTarget && retainedBundleHashes.includes(bundleStatusTarget.bundleHash) ? {
			...retentionInput,
			bundleStatusHash: bundleStatusTarget.bundleHash
		} : void 0;
		const statusInputFits = statusInput !== void 0 && Buffer.byteLength(JSON.stringify(statusInput), "utf8") <= 1048576;
		const input = bundleRetentionSupported && bundleHashesFit ? statusInput && statusInputFits ? statusInput : retentionInput : baseInput;
		const previousBundleStatus = currentTransport.getBundleStatus?.(node.nodeId);
		if (!input.bundleStatusHash || previousBundleStatus && previousBundleStatus.bundleHash !== input.bundleStatusHash) currentTransport.acceptBundleStatus?.(node, void 0);
		if (bundleRetentionSupported && !bundleHashesFit) options.warn(`Node bundle retention skipped (${node.nodeId}): ${retainedBundleHashes.length} retained hashes exceed the bounded maintenance request`);
		for (;;) {
			const result = await currentTransport.invoke({
				node,
				command: NODE_WORKER_WORKSPACE_RETAIN_COMMAND,
				params: input,
				timeoutMs: RETAIN_COMMAND_TIMEOUT_MS,
				signal: abortController.signal,
				isDispatchAuthorized: isCurrent
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
				const currentStatusTarget = requestedBundleHash ? currentBuild ?? bundleStatusTargetForNode(options, node.nodeId) : void 0;
				const statusTargetMatches = currentStatusTarget != null && requestedBundleHash !== void 0 && currentStatusTarget.bundleHash === requestedBundleHash;
				if (retained.applied && statusTargetMatches && bundleStatus?.bundleHash === requestedBundleHash && currentStatusTarget && bundleStatus) currentTransport.acceptBundleStatus?.(node, {
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
		const previous = observations.get(placement.sessionId);
		const previousStatus = previous && hasExactBinding(previous, current) ? previous.snapshot.status : void 0;
		const snapshotChanged = !previous || !hasExactBinding(previous, current) || previous.snapshot.status !== snapshot.status || previous.snapshot.availableBytes !== snapshot.availableBytes || previous.snapshot.totalBytes !== snapshot.totalBytes || previous.snapshot.observedAtMs !== snapshot.observedAtMs;
		observations.set(placement.sessionId, candidate);
		if (snapshotChanged) observationVersion += 1;
		if (previousStatus !== snapshot.status && (previousStatus !== void 0 || snapshot.status !== "ok")) emitSessionLifecycleEvent({
			sessionKey: placement.sessionKey,
			agentId: placement.agentId,
			reason: "worker-disk-space"
		});
	};
	const sweep = async () => {
		const active = params.placements.list().filter((placement) => placement.state === "active");
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
/** Serializes reconciliation sweeps against dispatches and deduplicates exact requests. */
function coordinateWorkerPlacementDispatch(service, admitDispatch, recoverInitialPlacement, reportReconciliation) {
	const activeDispatches = /* @__PURE__ */ new Set();
	let placementFence;
	const reconciliationSweeps = /* @__PURE__ */ new Set();
	const dispatchIdleWaiters = /* @__PURE__ */ new Set();
	const enterMaintenance = async (admission) => {
		admission.admitted = true;
		await Promise.allSettled(admission.reclaims);
		admission.reclaims.clear();
	};
	const prepareReclaim = async (predecessor, settled) => {
		const precedingEffects = [];
		for (let fence = predecessor; fence; fence = fence.predecessor) {
			if (fence.kind === "exclusive" || fence.kind === "maintenance" && fence.admission.admitted) {
				precedingEffects.push(fence.promise);
				break;
			}
			if (fence.kind === "reclaim") precedingEffects.push(fence.operation);
			else fence.admission.reclaims.add(settled);
		}
		await Promise.allSettled(precedingEffects);
	};
	const waitForDispatchIdle = () => {
		if (activeDispatches.size === 0) return Promise.resolve();
		return new Promise((resolve) => {
			dispatchIdleWaiters.add(resolve);
		});
	};
	const runReconciliation = (operation, full = true) => {
		const existing = full && [...reconciliationSweeps].find((sweep) => sweep.full);
		if (existing) return existing.promise;
		const predecessor = placementFence;
		const recoveryReady = createDeferredCore();
		const sweep = {
			kind: "maintenance",
			predecessor,
			admission: {
				admitted: false,
				reclaims: /* @__PURE__ */ new Set()
			},
			dispatchCohort: predecessor?.dispatchCohort ?? [...activeDispatches],
			full,
			recoveryReady: recoveryReady.promise,
			promise: Promise.resolve(),
			acceptingJoins: true,
			joinedRecoveries: /* @__PURE__ */ new Set()
		};
		const settleRecoveries = () => {
			sweep.acceptingJoins = false;
			recoveryReady.resolve();
			return Promise.allSettled(sweep.joinedRecoveries);
		};
		const execute = async () => {
			recoveryReady.resolve();
			try {
				await operation();
			} finally {
				await settleRecoveries();
			}
		};
		const current = (async () => {
			try {
				if (predecessor) await predecessor.promise.catch(() => void 0);
				await waitForDispatchIdle();
				await enterMaintenance(sweep.admission);
				await (reportReconciliation ? reportReconciliation(execute) : execute());
			} finally {
				await settleRecoveries();
				reconciliationSweeps.delete(sweep);
				if (placementFence === sweep) placementFence = void 0;
			}
		})();
		sweep.promise = current;
		reconciliationSweeps.add(sweep);
		placementFence = sweep;
		return current;
	};
	const runExclusivePlacementOperation = (operation, options = {}) => {
		const { signal } = options;
		const predecessor = placementFence;
		const predecessorSettled = predecessor?.promise.catch(() => void 0);
		const maintenanceAdmission = options.kind === "recovery" ? {
			admitted: false,
			reclaims: /* @__PURE__ */ new Set()
		} : void 0;
		const reclaimSettled = options.kind === "reclaim" ? createDeferredCore() : void 0;
		const reclaimReady = reclaimSettled && prepareReclaim(predecessor, reclaimSettled.promise);
		const ready = (async () => {
			if (predecessorSettled) await predecessorSettled;
			await waitForDispatchIdle();
		})();
		const current = (async () => {
			await racePromiseWithAbortSignal(reclaimReady ?? ready, signal);
			signal?.throwIfAborted();
			if (maintenanceAdmission) {
				await enterMaintenance(maintenanceAdmission);
				signal?.throwIfAborted();
			}
			return await operation();
		})();
		if (reclaimSettled) current.then(() => reclaimSettled.resolve(), () => reclaimSettled.resolve());
		const barrier = Promise.allSettled([ready, current]).then(() => void 0);
		const exclusive = {
			...maintenanceAdmission ? {
				kind: "maintenance",
				predecessor,
				admission: maintenanceAdmission
			} : reclaimSettled ? {
				kind: "reclaim",
				predecessor,
				operation: current
			} : { kind: "exclusive" },
			promise: barrier,
			dispatchCohort: options.kind === "recovery" ? predecessor?.dispatchCohort ?? [...activeDispatches] : []
		};
		placementFence = exclusive;
		barrier.then(() => {
			if (placementFence === exclusive) placementFence = void 0;
		});
		return current;
	};
	const runPlacementOperation = async (operation, signal) => {
		for (;;) {
			signal?.throwIfAborted();
			const pendingFence = placementFence;
			if (!pendingFence || pendingFence.dispatchCohort.some((id) => activeDispatches.has(id))) break;
			await racePromiseWithAbortSignal(pendingFence.promise.catch(() => void 0), signal);
		}
		const operationId = Symbol("dispatch");
		activeDispatches.add(operationId);
		try {
			return await operation();
		} finally {
			activeDispatches.delete(operationId);
			if (activeDispatches.size === 0) {
				const waiters = [...dispatchIdleWaiters];
				dispatchIdleWaiters.clear();
				for (const resolve of waiters) resolve();
			}
		}
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
	return {
		isPlacementOperationInFlight: (sessionId) => operationsInFlight.has(sessionId),
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
				return await admitDispatch(request, (signal) => runPlacementOperation(() => service.dispatch(request, report, authorize, signal), signal), authorize, callerSignal);
			}, onTransition);
			const { operation } = tracked;
			registerOperation({
				kind: "dispatch",
				request,
				...tracked
			});
			return await operation;
		},
		forceDestroyEnvironment: (environmentId, onCleanupError) => runExclusivePlacementOperation(() => service.forceDestroyEnvironment(environmentId, onCleanupError)),
		move: async (request, onTransition, authorize) => {
			const inFlight = pendingOperations(request.sessionId).find((pending) => pending.kind === "move");
			if (inFlight) {
				if (!isDeepStrictEqual(inFlight.request, request)) throw new Error(`Session ${request.sessionKey} is already moving to another target`);
				return await joinOperation(inFlight.operation, authorize);
			}
			const predecessors = pendingOperations(request.sessionId).filter((pending) => pending.kind === "reclaim");
			const tracked = trackPlacementOperation(async (report) => {
				await Promise.allSettled(predecessors.map((pending) => pending.operation));
				return await admitDispatch(request, (signal) => runExclusivePlacementOperation(() => service.move(request, report, authorize, signal), { signal }), authorize);
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
			const tracked = trackPlacementOperation((report) => service.reclaim(request, authorize, beforeDrain, (run) => runExclusivePlacementOperation(run, { kind: "reclaim" }), operations.length ? {
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
		reconcile: (mode) => runReconciliation(() => service.reconcile(mode)),
		reconcileActive: (environmentId) => environmentId === void 0 ? runReconciliation(() => service.reconcileActive()) : runReconciliation(() => service.reconcileActive(environmentId), false),
		resumeProvisioning: (placement, reconcileEnvironmentCore) => {
			const inFlight = pendingOperations(placement.sessionId).find((pending) => pending.kind === "recovery" && isDeepStrictEqual(pending.request, placement));
			if (inFlight?.kind === "recovery") return inFlight.foreground;
			const sweep = [...reconciliationSweeps].find((candidate) => candidate.acceptingJoins);
			const ready = createDeferredCore();
			const foreground = createDeferredCore();
			let providerSettlement = Promise.resolve();
			let providerPending = false;
			const recover = async () => {
				ready.resolve();
				await foreground.promise;
			};
			let queued;
			if (sweep) {
				queued = (async () => {
					if (sweep.predecessor) await sweep.predecessor.promise.catch(() => void 0);
					await waitForDispatchIdle();
					await sweep.recoveryReady;
					await enterMaintenance(sweep.admission);
					await recover();
				})();
				sweep.joinedRecoveries.add(queued);
			} else queued = runExclusivePlacementOperation(recover, { kind: "recovery" });
			queued.catch(ready.reject);
			const tracked = trackPlacementOperation(async (report) => {
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
						await racePromiseWithAbortSignal(ready.promise, signal);
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
				}).catch(async (error) => {
					if (error instanceof WorkerPlacementAdmissionTargetError) await ready.promise;
					throw error;
				}));
			});
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
//#region src/gateway/worker-environments/placement-teardown.ts
/** Close the workspace-result fence, then advance the exact drained owner into reconciliation. */
function completeDrainedWorkspaceTeardown(params) {
	const drained = params.placements.completeWorkspaceResultAndReleaseTurn(params.turnClaim);
	if (drained.state !== "draining" || drained.environmentId !== params.environmentId || drained.activeOwnerEpoch !== params.ownerEpoch) throw new Error(`Session ${params.turnClaim.sessionId} lost its drained placement owner`);
	const reconciling = params.placements.startReconcile({
		sessionId: drained.sessionId,
		environmentId: params.environmentId,
		ownerEpoch: params.ownerEpoch,
		expectedGeneration: drained.generation
	});
	if (reconciling.state !== "reconciling") throw new Error(`Session ${params.turnClaim.sessionId} did not enter reconciliation`);
	return params.complete(reconciling);
}
function completeMovedWorkspaceTeardown(params) {
	const completed = completeDrainedWorkspaceTeardown({
		...params,
		complete: (reconciling) => params.placements.completePlacementMoveSourceToLocal({
			operationId: params.operationId,
			sessionId: reconciling.sessionId,
			expectedGeneration: reconciling.generation
		})
	});
	if (completed.state !== "local") throw new Error(`Session ${params.turnClaim.sessionId} move did not finish local`);
	return completed;
}
function completeReclaimedWorkspaceTeardown(params) {
	const completed = completeDrainedWorkspaceTeardown({
		...params,
		complete: (reconciling) => params.placements.transition({
			sessionId: reconciling.sessionId,
			from: "reconciling",
			to: "reclaimed",
			expectedGeneration: reconciling.generation
		})
	});
	if (completed.state !== "reclaimed") throw new Error(`Session ${params.turnClaim.sessionId} teardown did not finish reclaimed`);
	return completed;
}
//#endregion
//#region src/gateway/worker-environments/placement-dispatch-pending-results.ts
const log$1 = createSubsystemLogger("gateway/worker-placement");
async function resolvePriorWorkspaceResultConflict(resolve, placement) {
	if (placement.workspaceResultConflict) return placement.workspaceResultConflict;
	const lookup = await resolve(placement);
	if (lookup.kind === "conflict") return lookup.conflict;
	if (lookup.kind === "unknown") log$1.warn(`Cloud workspace conflict state unknown sessionId=${boundedWorkerError(placement.sessionId, 128)} reason=${lookup.reason}; preserving prior conflict state`);
}
async function prepareAcceptedPublication(deps, claim) {
	if (deps.prepareAcceptedWorkspacePublication) await deps.prepareAcceptedWorkspacePublication(claim).catch(() => void 0);
}
function completeRecoveredWorkspaceTeardown(params) {
	const move = params.placements.getPlacementMove(params.placement.sessionId);
	return move ? completeMovedWorkspaceTeardown({
		placements: params.placements,
		turnClaim: params.turnClaim,
		environmentId: params.placement.environmentId,
		ownerEpoch: params.placement.activeOwnerEpoch,
		operationId: move.operationId
	}) : completeReclaimedWorkspaceTeardown({
		placements: params.placements,
		turnClaim: params.turnClaim,
		environmentId: params.placement.environmentId,
		ownerEpoch: params.placement.activeOwnerEpoch
	});
}
async function recoverPendingWorkspaceResults(deps, cleanupOrphans, environmentId) {
	const { environments, failure, placements } = deps;
	const resolveWorkspace = async (placement, pending) => {
		const workspace = await deps.resolveWorkspace(placement);
		if (!pending.repositoryWorkspaceId) return workspace;
		const repository = getSessionRepositoryWorkspaceStore().get(pending.repositoryWorkspaceId);
		if (!repository || repository.agentId !== placement.agentId || repository.sessionKey !== placement.sessionKey || workspace.kind === "repository" && workspace.repository.workspaceId !== pending.repositoryWorkspaceId) throw new Error("Pending repository checkpoint lost its exact session workspace owner");
		return {
			kind: "repository",
			repository
		};
	};
	const prepareGatewayMove = async (placement, turnClaim) => {
		const move = placements.getPlacementMove(placement.sessionId);
		if (move?.target.kind !== "gateway") return;
		await deps.prepareGatewayMove?.({
			sessionId: placement.sessionId,
			sessionKey: placement.sessionKey,
			agentId: placement.agentId,
			assertCurrent: () => {
				if (!placements.validateWorkspaceResultClaim(turnClaim) || placements.getPlacementMove(placement.sessionId)?.operationId !== move.operationId) throw new Error("Recovered Gateway move lost its workspace result owner");
			}
		});
	};
	const destroyPendingEnvironment = async (placement) => {
		const current = environments.get(placement.environmentId);
		if (current && current.state !== "destroyed" && (current.ownerEpoch === placement.activeOwnerEpoch || current.destroyRequestedAtMs !== null)) await environments.destroy(placement.environmentId);
	};
	const stagedResultOwners = /* @__PURE__ */ new Set();
	for (const pending of placements.listPendingWorkspaceResults()) {
		if (pending.stagedResultRef) stagedResultOwners.add(pending.sessionId);
		const sameGatewayInstance = pending.gatewayInstanceId === placements.workspaceResultInstanceId();
		if (sameGatewayInstance && pending.recoveryRequestedAtMs === null) continue;
		const placement = placements.get(pending.sessionId);
		if (environmentId !== void 0 && placement?.environmentId !== environmentId) continue;
		if (placements.getPlacementMove(pending.sessionId)?.abandonSource) continue;
		try {
			const pendingPlacement = placement?.state === "active" || placement?.state === "draining" ? placement : void 0;
			const turnClaim = pendingPlacement && pendingPlacement.environmentId === pending.environmentId && pendingPlacement.activeOwnerEpoch === pending.ownerEpoch ? {
				sessionId: pendingPlacement.sessionId,
				claimId: pending.claimId,
				runId: pending.runId,
				placementGeneration: pending.placementGeneration,
				owner: placementTurnOwner(pendingPlacement)
			} : void 0;
			if (!pendingPlacement || !turnClaim || !placements.validateWorkspaceResultClaim(turnClaim)) {
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
					const failed = placements.failWorkspaceResultAndReleaseTurn(pending, /* @__PURE__ */ new Error(`Pending cloud workspace result has no active claim: ${pending.sessionId}`));
					if (failed.state === "failed") await failure.retryFailedTeardown(failed);
				} else placements.abandonWorkspaceResult(pending);
				continue;
			}
			let active = pendingPlacement;
			const workspace = await resolveWorkspace(active, pending);
			const root = sessionWorkspaceRoot(workspace);
			const priorWorkspaceResultConflict = await resolvePriorWorkspaceResultConflict(deps.resolveWorkspaceResultConflict, active);
			const canonicalStagedResultRef = workerWorkspaceResultRef(turnClaim.claimId);
			let stagedResultRef = pending.stagedResultRef;
			if (!stagedResultRef && await hasWorkerWorkspaceResultRef({
				root,
				stagedResultRef: canonicalStagedResultRef
			})) {
				placements.recordStagedWorkspaceResult(turnClaim, canonicalStagedResultRef, workspace.kind === "repository" ? workspace.repository.workspaceId : void 0);
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
			if (environment?.state === "attached" && (environment.attachedSessionIds.length !== 1 || environment.attachedSessionIds[0] !== active.sessionId)) continue;
			const canPreserveEnvironment = () => {
				const current = placements.get(pending.sessionId);
				const currentEnvironment = environments.get(pending.environmentId);
				return current?.state === "active" && current.generation === pending.placementGeneration && current.environmentId === pending.environmentId && current.activeOwnerEpoch === pending.ownerEpoch && Boolean(currentEnvironment?.nodeDeviceId) && currentEnvironment?.nodeDeviceId === environment?.nodeDeviceId && currentEnvironment?.leaseId === environment?.leaseId && isCurrentActiveWorkerEnvironment(current, currentEnvironment) && !placements.getPlacementMove(pending.sessionId) && !(pending.claimId === pending.runId && pending.claimId.startsWith("reclaim-"));
			};
			const preserveEnvironment = canPreserveEnvironment();
			const assertPreservedEnvironment = () => {
				if (preserveEnvironment && (!canPreserveEnvironment() || !placements.validateWorkspaceResultClaim(turnClaim))) throw new Error("Recovered workspace result lost its active environment owner");
			};
			const completeResult = () => {
				assertPreservedEnvironment();
				return preserveEnvironment ? placements.completeWorkspaceResultAndReleaseTurn(turnClaim) : completeRecoveredWorkspaceTeardown({
					placements,
					placement: active,
					turnClaim
				});
			};
			if (preserveEnvironment && !sameGatewayInstance) {
				await environments.stopTunnel(active.environmentId, active.activeOwnerEpoch);
				assertPreservedEnvironment();
			}
			const teardownRequired = !preserveEnvironment && (!sameGatewayInstance || Boolean(stagedResultRef) || pending.workspaceAcceptedAtMs !== null && environment?.state === "destroyed");
			if (active.state === "active" && teardownRequired) {
				const draining = placements.startWorkspaceResultDrain(turnClaim);
				if (draining.state !== "draining") throw new Error(`Pending workspace result did not drain session ${active.sessionId}`);
				active = draining;
			}
			const stagedResultExists = stagedResultRef ? await hasWorkerWorkspaceResultRef({
				root,
				stagedResultRef
			}) : false;
			if (stagedResultRef && !stagedResultExists) {
				if (workspace.kind === "repository") throw new Error("Repository checkpoint is missing; restore its artifact before retrying recovery");
				if (pending.workspaceAcceptedAtMs === null) continue;
				if (turnClaim.owner.kind === "worker") await placements.closeWorkerTurnToolState(turnClaim);
				if (!preserveEnvironment) {
					await prepareGatewayMove(active, turnClaim);
					await destroyPendingEnvironment(active);
				}
				await prepareAcceptedPublication(deps, turnClaim);
				await deps.publishAcceptedWorkspace?.(turnClaim);
				completeResult();
				if (!preserveEnvironment) await environments.stopTunnel(active.environmentId, active.activeOwnerEpoch).catch(() => void 0);
				continue;
			}
			const owner = {
				sessionId: active.sessionId,
				environmentId: active.environmentId,
				ownerEpoch: active.activeOwnerEpoch,
				placementGeneration: pending.placementGeneration
			};
			const journal = {
				load: () => placements.loadWorkspaceReconciliation(owner),
				begin: (next) => placements.beginWorkspaceReconciliation(owner, next),
				commit: (manifestRef) => {
					assertPreservedEnvironment();
					return placements.updateWorkspaceBaseManifest({
						claim: turnClaim,
						manifestRef
					});
				},
				abort: () => placements.abortWorkspaceReconciliation(owner)
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
							if (!placements.validateWorkspaceResultClaim(turnClaim)) throw new Error("Recovered repository checkpoint lost its placement owner");
						},
						onAccepted: journal.commit
					});
					else {
						const interrupted = journal.load();
						const alreadyApplied = interrupted?.appliedManifestRef !== void 0;
						if (interrupted && !alreadyApplied) {
							await recoverWorkerWorkspaceReconciliation({
								root,
								journal: interrupted
							});
							journal.abort();
						}
						const reconciliation = await applyStagedWorkerWorkspaceResult({
							root,
							stagedResultRef: ownedStagedResultRef,
							expectedBaseManifestRef: active.workspaceBaseManifestRef,
							alreadyAccepted: pending.workspaceAcceptedAtMs !== null || alreadyApplied,
							journal
						});
						await reconciliation.verifyLocalStable();
						conflictPaths = reconciliation.conflictPaths;
					}
					if (pending.workspaceAcceptedAtMs === null) {
						await prepareAcceptedPublication(deps, turnClaim);
						assertPreservedEnvironment();
						placements.acceptWorkspaceResult(turnClaim);
					}
					if (conflictPaths.length > 0 && isWorkerWorkspaceResultCleanupRef(ownedStagedResultRef)) {
						await restoreStagedWorkerWorkspaceResultFromCleanup({
							root,
							cleanupRef: ownedStagedResultRef,
							stagedResultRef: canonicalStagedResultRef
						});
						ownedStagedResultRef = canonicalStagedResultRef;
					}
					const finalized = await finalizeWorkspaceResultConflicts({
						placements,
						turnClaim,
						conflictPaths,
						priorConflict: priorWorkspaceResultConflict,
						stagedResultRef: ownedStagedResultRef,
						workspace,
						report: async (report) => await deps.reportWorkspaceResultConflict({
							sessionId: active.sessionId,
							sessionKey: active.sessionKey,
							agentId: active.agentId,
							...report
						})
					});
					await deps.publishAcceptedWorkspace?.(turnClaim);
					await settleStagedWorkspaceResult({
						placements,
						turnClaim,
						workspace,
						stagedResultRef: ownedStagedResultRef,
						conflictRetained: finalized.conflictRetained,
						beforeComplete: async () => {
							if (!preserveEnvironment) {
								await prepareGatewayMove(active, turnClaim);
								await destroyPendingEnvironment(active);
							}
						},
						complete: completeResult
					});
					if (!preserveEnvironment) await environments.stopTunnel(active.environmentId, active.activeOwnerEpoch).catch(() => void 0);
				});
				continue;
			}
			if (!isCurrentActiveWorkerEnvironment(active, environment)) {
				if (hasPreparedResult) continue;
				if (pending.workspaceAcceptedAtMs !== null && environment?.state === "destroyed") {
					await prepareAcceptedPublication(deps, turnClaim);
					await deps.publishAcceptedWorkspace?.(turnClaim);
					await prepareGatewayMove(active, turnClaim);
					completeRecoveredWorkspaceTeardown({
						placements,
						placement: active,
						turnClaim
					});
					continue;
				}
				const failed = placements.failWorkspaceResultAndReleaseTurn(pending, workerDisappearanceError(environment) ?? /* @__PURE__ */ new Error(`Pending cloud workspace result lost its worker: ${pending.sessionId}`));
				if (failed.state === "failed") await failure.retryFailedTeardown(failed);
				continue;
			}
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
					const reconciliation = await tunnel.reconcileWorkspace(createWorkerWorkspaceReconcileRequest({
						workspace,
						remoteWorkspaceDir: active.remoteWorkspaceDir,
						baseManifestRef: active.workspaceBaseManifestRef,
						journal,
						stagedResult: {
							ref: canonicalStagedResultRef,
							record: (ref) => placements.recordStagedWorkspaceResult(turnClaim, ref, workspace.kind === "repository" ? workspace.repository.workspaceId : void 0)
						},
						assertCurrent: () => {
							if (!placements.validateWorkspaceResultClaim(turnClaim)) throw new Error("Recovered workspace result lost its placement owner");
						}
					}));
					const applied = await verifyReconciledWorkspaceFinal(reconciliation, quiescence);
					await prepareAcceptedPublication(deps, turnClaim);
					assertPreservedEnvironment();
					placements.acceptWorkspaceResult(turnClaim);
					const recordedStagedResultRef = placements.listPendingWorkspaceResults(turnClaim.sessionId).find((result) => result.sessionId === turnClaim.sessionId && result.claimId === turnClaim.claimId && result.runId === turnClaim.runId)?.stagedResultRef;
					const conflictPaths = applied?.conflictPaths ?? [];
					if (conflictPaths.length > 0 && !recordedStagedResultRef) throw new Error("Recovered cloud workspace conflict has no staged result reference");
					const finalized = await finalizeWorkspaceResultConflicts({
						placements,
						turnClaim,
						conflictPaths,
						priorConflict: priorWorkspaceResultConflict,
						stagedResultRef: recordedStagedResultRef,
						workspace,
						report: async (report) => await deps.reportWorkspaceResultConflict({
							sessionId: active.sessionId,
							sessionKey: active.sessionKey,
							agentId: active.agentId,
							...report
						})
					});
					await deps.publishAcceptedWorkspace?.(turnClaim);
					await settleStagedWorkspaceResult({
						placements,
						turnClaim,
						workspace,
						stagedResultRef: recordedStagedResultRef,
						conflictRetained: finalized.conflictRetained,
						beforeComplete: async () => {
							if (!preserveEnvironment) await prepareGatewayMove(active, turnClaim);
							if (sameGatewayInstance || preserveEnvironment) {
								assertPreservedEnvironment();
								await quiescence.resume();
							} else await environments.destroy(active.environmentId);
							quiescenceHandled = true;
						},
						...sameGatewayInstance && !preserveEnvironment ? {} : { complete: completeResult },
						afterComplete: async () => {
							if (!sameGatewayInstance && !preserveEnvironment) await environments.stopTunnel(active.environmentId, active.activeOwnerEpoch).catch(() => void 0);
						}
					});
				} finally {
					if (!quiescenceHandled) await quiescence.resume();
				}
			});
		} catch (error) {
			try {
				const current = placements.get(pending.sessionId);
				const currentPending = placements.listPendingWorkspaceResults(pending.sessionId).find((candidate) => candidate.sessionId === pending.sessionId && candidate.environmentId === pending.environmentId && candidate.ownerEpoch === pending.ownerEpoch && candidate.placementGeneration === pending.placementGeneration && candidate.claimId === pending.claimId && candidate.runId === pending.runId && candidate.gatewayInstanceId === pending.gatewayInstanceId);
				if (currentPending && isCurrentWorkerWorkspacePendingResultOwner(current, currentPending)) await deps.reportWorkspaceResultRecoveryFailure?.({
					sessionId: current.sessionId,
					sessionKey: current.sessionKey,
					agentId: current.agentId,
					error: boundedWorkerError(error)
				});
			} catch {}
		}
	}
	if (cleanupOrphans) {
		const retainedRefs = () => new Set(placements.listPendingWorkspaceResults().flatMap((pending) => pending.stagedResultRef ? [cleanupWorkerWorkspaceResultRef(pending.stagedResultRef)] : []));
		const cleanedWorkspaceRoots = /* @__PURE__ */ new Set();
		for (const placement of placements.list()) try {
			const workspace = await deps.resolveWorkspace(placement);
			if (workspace.kind === "repository") continue;
			const root = workspace.path;
			if (!cleanedWorkspaceRoots.has(root)) {
				cleanedWorkspaceRoots.add(root);
				await deleteWorkerWorkspaceResultCleanupRefs({
					root,
					retainedRefs
				});
			}
		} catch {}
	}
	return /* @__PURE__ */ new Set([...stagedResultOwners, ...placements.listPendingWorkspaceResults().map((pending) => pending.sessionId)]);
}
//#endregion
//#region src/gateway/worker-environments/placement-dispatch-recovery.ts
const log = createSubsystemLogger("gateway/worker-placement");
function activePlacementExecutionError(placement, environment, environments) {
	const provisionedMode = environment.profileSnapshot.executionMode;
	if (provisionedMode !== void 0 && provisionedMode !== placement.executionMode) return /* @__PURE__ */ new Error("Active worker placement execution mode does not match its environment");
	if (placement.executionMode === "worker-turn" && !environment.nodeDeviceId) return /* @__PURE__ */ new Error("Active worker-turn placement requires a node lease");
	if (!environments.supportsProviderExecutionMode(environment.providerId, placement.executionMode)) return /* @__PURE__ */ new Error(`Worker provider ${environment.providerId} does not support ${placement.executionMode} placement`);
}
function blockingWorkspaceJournalSessions(placements) {
	const sessions = /* @__PURE__ */ new Set();
	for (const owner of placements.listWorkspaceReconciliationOwners()) if (placements.getWorkspaceReconciliationPlacement(owner)) sessions.add(owner.sessionId);
	return sessions;
}
function createPlacementRecoveryActions(deps) {
	const { environments, failure, placements } = deps;
	const interruptedClaims = new Set(placements.list().flatMap((placement) => {
		const claim = projectWorkerSessionTurnClaim(placement);
		return claim ? [serializeWorkerSessionTurnClaim(claim)] : [];
	}));
	let orphanCleanupPending = false;
	const reconcileActivePlacement = async (initialPlacement, mode) => {
		let placement = initialPlacement;
		let environment = environments.get(placement.environmentId);
		const claim = projectWorkerSessionTurnClaim(placement);
		const interrupted = claim && interruptedClaims.has(serializeWorkerSessionTurnClaim(claim));
		if ((mode === "restart" || interrupted) && placement.turnClaim) {
			if (claim && interrupted && environment?.nodeDeviceId && isCurrentActiveWorkerEnvironment(placement, environment) && !placements.getPlacementMove(placement.sessionId)) try {
				await environments.stopTunnel(placement.environmentId, placement.activeOwnerEpoch);
				await placements.closeWorkerTurnToolState(claim);
				const current = placements.get(placement.sessionId);
				const currentEnvironment = environments.get(placement.environmentId);
				if (current?.state !== "active" || current.generation !== placement.generation || currentEnvironment?.nodeDeviceId !== environment.nodeDeviceId || !isCurrentActiveWorkerEnvironment(current, currentEnvironment) || placements.getPlacementMove(placement.sessionId)) throw new Error("Interrupted worker owner changed while stopping");
				const released = placements.releaseTurn(claim);
				if (released.state !== "active") throw new Error("Interrupted worker placement changed during recovery");
				interruptedClaims.delete(serializeWorkerSessionTurnClaim(claim));
				placement = released;
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
	const reconcile = async (mode) => {
		if (mode === "startup") {
			const reconciled = await runTasksWithConcurrency({
				tasks: placements.listForReconcile().flatMap(({ environmentId, state }) => environmentId && state !== "failed" && state !== "reclaimed" ? [() => environments.reconcileEnvironment(environmentId)] : []),
				limit: 8,
				errorMode: "stop"
			});
			if (reconciled.hasError) throw reconciled.firstError;
		} else await environments.reconcileOnce();
		const pendingResultOwners = await recoverPendingWorkspaceResults(deps, mode !== "startup");
		orphanCleanupPending = mode === "startup";
		const journalOwners = blockingWorkspaceJournalSessions(placements);
		const moveOwners = await deps.recoverPlacementMoves?.() ?? /* @__PURE__ */ new Set();
		for (const placement of placements.listForReconcile()) {
			if (journalOwners.has(placement.sessionId) || pendingResultOwners.has(placement.sessionId) || moveOwners.has(placement.sessionId)) continue;
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
				await reconcileActivePlacement(placement, "restart");
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
	const reconcileActive = async (environmentId) => {
		await environments.reconcileOnce(environmentId);
		const cleanupOrphans = orphanCleanupPending && environmentId === void 0;
		const pendingResultOwners = await recoverPendingWorkspaceResults(deps, cleanupOrphans, environmentId);
		if (cleanupOrphans) orphanCleanupPending = false;
		const journalOwners = blockingWorkspaceJournalSessions(placements);
		const moveOwners = await deps.recoverPlacementMoves?.(environmentId) ?? /* @__PURE__ */ new Set();
		for (const placement of placements.listForReconcile()) {
			if (journalOwners.has(placement.sessionId) || pendingResultOwners.has(placement.sessionId) || moveOwners.has(placement.sessionId)) continue;
			if (environmentId !== void 0 && placement.environmentId !== environmentId) continue;
			if (placement.state === "failed") {
				await failure.retryFailedTeardown(placement);
				continue;
			}
			if (placement.state !== "active") continue;
			await reconcileActivePlacement(placement, "runtime");
		}
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
			}
		});
	};
	const synced = repository.checkpointRef ? await withSessionRepositoryCheckpoint({
		workspaceId: repository.workspaceId,
		includePublication: true
	}, sync) : await sync();
	params.assertCurrent();
	if (synced.mode !== "repository") throw new Error("Repository preparation did not return a repository workspace");
	if (prepared && (synced.baseCommit !== prepared.baseCommit || synced.baseManifestRef !== prepared.sourceManifestRef || synced.remoteWorkspaceDir !== prepared.workspaceDir)) throw new Error("Repository preparation changed its attested prepared workspace");
	if (!repository.baseCommit || !repository.baseManifestHash) repository = store.bindBase({
		workspaceId: repository.workspaceId,
		expectedRevision: repository.revision,
		baseCommit: synced.baseCommit,
		baseManifestHash: synced.baseManifestRef,
		assertCurrent: params.assertCurrent
	});
	else if (repository.baseCommit !== synced.baseCommit || repository.baseManifestHash !== synced.baseManifestRef) throw new Error("Repository preparation changed the pinned source baseline");
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
		if (!reconciliation.publishStagedResult) throw new Error("Repository preparation did not stage a durable checkpoint");
		await reconciliation.publishStagedResult();
		params.assertCurrent();
		return {
			...synced,
			manifestRef: reconciliation.manifestRef
		};
	} finally {
		try {
			await reconciliation?.discardPreparedStagedResult?.();
		} finally {
			await quiescence.resume();
		}
	}
}
//#endregion
//#region src/gateway/worker-environments/placement-dispatch-startup.ts
function createWorkerPlacementDispatchStartup(options) {
	const { environments, failure, placements } = options;
	const retainInterruptedProvisioning = async (owned, error) => {
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
			if (!environment.nodeDeviceId || !environment.leaseId || !environment.bootstrapReceipt || !supportsCurrentWorkerLaunch(environment.bootstrapReceipt) || !verifyWorkerAdmissionHandshake(environment.bootstrapReceipt, expectedBuild)) continue;
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
		let placement = placements.transition({
			sessionId: request.sessionId,
			from: "provisioning",
			to: "syncing",
			expectedGeneration: params.placement.generation,
			patch: {
				environmentId: provisioned.environmentId,
				workerBundleHash: provisioned.bundleHash
			}
		});
		options.reportTransition(params.onTransition, placement);
		params.signal?.throwIfAborted();
		const syncingPlacement = placement;
		const assertAttachmentCurrent = () => {
			params.signal?.throwIfAborted();
			params.authorize?.();
			const current = placements.get(request.sessionId);
			if (current?.state !== "syncing" || current.generation !== syncingPlacement.generation || current.sessionKey !== request.sessionKey || current.agentId !== request.agentId || current.executionMode !== request.executionMode || current.environmentId !== provisioned.environmentId || current.turnClaim !== null) throw new Error("Worker workspace preparation lost its exact placement owner");
			if (admittedNode && !options.isCurrentNodePlacement?.(admittedNode.node, admittedNode.requirement, request.executionMode)) throw new Error("Worker dispatch lost its current node authority before attachment");
		};
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
		let stoppingTunnel;
		const stopAttemptTunnel = () => {
			stoppingTunnel ??= environments.stopTunnel(provisioned.environmentId, ownerEpoch);
			stoppingTunnel.catch(() => void 0);
		};
		params.signal?.addEventListener("abort", stopAttemptTunnel, { once: true });
		try {
			const tunnel = await environments.startTunnel({
				environmentId: provisioned.environmentId,
				ownerEpoch
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
				...gitAuthor ? { gitAuthor } : {}
			});
			assertSyncOwner();
			params.signal?.throwIfAborted();
			params.authorize?.();
			placement = placements.transition({
				sessionId: request.sessionId,
				from: "syncing",
				to: "starting",
				expectedGeneration: placement.generation,
				patch: {
					workspaceBaseManifestRef: synced.manifestRef,
					remoteWorkspaceDir: synced.remoteWorkspaceDir
				}
			});
			options.reportTransition(params.onTransition, placement);
			const startingPlacement = placement;
			await requireNodePlacementEligibility(request, requireAttachedEnvironment(), admittedNode?.node);
			requireAttachedEnvironment();
			const activate = () => {
				requireAttachedEnvironment();
				if (admittedNode && !options.isCurrentNodePlacement?.(admittedNode.node, admittedNode.requirement, request.executionMode)) throw new Error("Worker dispatch lost its current node connection, pairing generation, or command authorization before activation");
				const active = placements.transition({
					sessionId: request.sessionId,
					from: "starting",
					to: "active",
					expectedGeneration: startingPlacement.generation,
					patch: { activeOwnerEpoch: ownerEpoch }
				});
				if (active.state !== "active") throw new Error("Worker dispatch activation did not produce an active placement");
				activated = true;
				params.signal?.removeEventListener("abort", stopAttemptTunnel);
				options.reportTransition(params.onTransition, active);
				return active;
			};
			const activePlacement = params.recovery ? activate() : await options.runActivationBarrier({
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
		} finally {
			params.signal?.removeEventListener("abort", stopAttemptTunnel);
			if (!activated && params.signal?.aborted) await environments.stopTunnel(provisioned.environmentId, ownerEpoch);
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
			options.reportTransition(onTransition, next);
		};
		report(placement);
		const handleRecoveryFailure = async (error) => {
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
					run: async (workspace) => {
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
//#region src/gateway/worker-environments/placement-force-abandon.ts
function reportWorkerAbandonmentCleanupError(onCleanupError, error) {
	try {
		onCleanupError?.(error);
	} catch {}
}
async function forceAbandonWorkerEnvironment(params) {
	const { environmentId, placements } = params;
	const recoveryError = FORCED_WORKER_ABANDONMENT_ERROR;
	const journalOwners = params.placements.listWorkspaceReconciliationOwners().filter((owner) => owner.environmentId === environmentId);
	const journalCleanups = [];
	const retainedJournalSessions = /* @__PURE__ */ new Set();
	for (const owner of journalOwners) {
		const placement = placements.get(owner.sessionId);
		const isCurrentOwner = (placement?.state === "active" || placement?.state === "draining") && placement.generation === owner.placementGeneration;
		const isForceFailedOwner = placement?.state === "failed" && placement.recoveryError.startsWith(recoveryError) && placement.generation > owner.placementGeneration;
		if (placement && (isCurrentOwner || isForceFailedOwner) && placement.environmentId === owner.environmentId && placement.activeOwnerEpoch === owner.ownerEpoch) try {
			const journal = placements.loadWorkspaceReconciliation(owner, isForceFailedOwner ? { allowFailedOwner: true } : void 0);
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
	for (const pending of placements.listPendingWorkspaceResults()) if (pending.environmentId === environmentId) {
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
			placements.failWorkspaceResultAndReleaseTurn(pending, recoveryError);
		} else placements.abandonWorkspaceResult(pending);
	}
	for (const placement of placements.listForReconcile()) {
		if (placement.environmentId !== environmentId) continue;
		let current = placements.get(placement.sessionId);
		if (current?.state === "active") current = placements.startDrain({
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
			current = placements.startReconcile({
				sessionId: current.sessionId,
				environmentId: current.environmentId,
				ownerEpoch: current.activeOwnerEpoch,
				expectedGeneration: current.generation,
				forceLocalClaim: true
			});
		}
		if (current && (current.state !== "failed" || current.recoveryError !== recoveryError)) placements.fail({
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
		placements.abortWorkspaceReconciliation(owner, { force: true });
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
		await forceAbandonWorkerEnvironment({
			placements,
			environmentId,
			resolveWorkspace: options.resolveWorkspace,
			onCleanupError
		});
		try {
			return await (abandonment ? environments.destroy(environmentId, abandonment) : environments.destroy(environmentId));
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
	const recover = async (intent) => {
		try {
			let placement = options.placements.get(intent.sessionId);
			if (!placement) throw new Error(`Session ${intent.sessionId} placement move lost its session placement`);
			const identity = {
				sessionId: placement.sessionId,
				sessionKey: placement.sessionKey,
				agentId: placement.agentId
			};
			if (intent.abandonSource) {
				if (intent.target.kind !== "gateway") throw new Error(`Session ${identity.sessionKey} abandonment intent has a non-Gateway target`);
				if (placement.state === "local") {
					options.placements.cancelPlacementMove({
						operationId: intent.operationId,
						sessionId: intent.sessionId
					});
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
				options.placements.cancelPlacementMove({
					operationId: intent.operationId,
					sessionId: intent.sessionId
				});
				return;
			} else if (placement.state === "draining") {
				const local = await options.reclaimSource(identity, intent);
				if (local.state !== "local") throw new Error(`Session ${identity.sessionKey} move recovery did not return local`);
				placement = local;
			} else if (placement.state === "reconciling") {
				const environment = options.environments.get(placement.environmentId);
				if (environment && environment.state !== "destroyed" && environment.state !== "failed" && environment.state !== "orphaned") return;
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
				if (options.placements.getPlacementMove(intent.sessionId)) options.placements.cancelPlacementMove({
					operationId: intent.operationId,
					sessionId: intent.sessionId
				});
				return;
			}
			options.placements.fail({
				sessionId: placement.sessionId,
				expectedGeneration: placement.generation,
				recoveryError: RESTART_AUTHORITY_EXPIRED
			});
			options.placements.cancelPlacementMove({
				operationId: intent.operationId,
				sessionId: intent.sessionId
			});
		} catch (error) {
			recordError(intent, error);
			throw error;
		}
	};
	const recoverAll = async (environmentId) => {
		const protectedSessions = /* @__PURE__ */ new Set();
		for (const intent of options.placements.listPlacementMoves()) {
			const placement = options.placements.get(intent.sessionId);
			if (environmentId !== void 0 && intent.source.environmentId !== environmentId && placement?.environmentId !== environmentId) continue;
			const state = placement?.state;
			if (intent.abandonSource && state !== "local" || state === "draining" || state === "reconciling") protectedSessions.add(intent.sessionId);
			await recover(intent).catch(() => void 0);
		}
		return protectedSessions;
	};
	return {
		move,
		recoverAll
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
		begin: () => {
			const current = placements.get(request.sessionId);
			if (current?.state === "reclaimed" && current.sessionKey === request.sessionKey && current.agentId === request.agentId) return current;
			if (current?.state !== "active" && current?.state !== "draining" || current.turnClaim) throw new Error(`Session ${request.sessionKey} cannot stop cloud worker from placement ${current?.state ?? "missing"}`);
			const environment = environments.get(current.environmentId);
			if (!isExactAttachedEnvironment(environment, current)) throw new Error("Active cloud worker does not match its session placement");
			if (current.state === "draining") return current;
			const draining = placements.startDrain({
				sessionId: current.sessionId,
				environmentId: current.environmentId,
				ownerEpoch: current.activeOwnerEpoch,
				expectedGeneration: current.generation
			});
			if (draining.state !== "draining") throw new Error(`Session ${request.sessionKey} did not enter draining placement`);
			reportPlacementTransition(onTransition, draining);
			return draining;
		},
		reclaim: async (workspace, current, reauthorize) => {
			if (current.state === "reclaimed") return current;
			const root = sessionWorkspaceRoot(workspace);
			const journalOwner = {
				sessionId: current.sessionId,
				environmentId: current.environmentId,
				ownerEpoch: current.activeOwnerEpoch,
				placementGeneration: current.generation
			};
			const reclaimClaimId = `reclaim-${randomUUID()}`;
			const reclaimClaim = placements.claimReclaimWorkspaceResult({
				sessionId: current.sessionId,
				sessionKey: current.sessionKey,
				agentId: current.agentId,
				claimId: reclaimClaimId,
				runId: reclaimClaimId,
				owner: placementTurnOwner(current)
			});
			const reclaimResultRef = workerWorkspaceResultRef(reclaimClaim.claimId);
			let manifestAccepted = false;
			const journal = {
				load: () => placements.loadWorkspaceReconciliation(journalOwner),
				begin: (next) => placements.beginWorkspaceReconciliation(journalOwner, next),
				commit: (manifestRef) => {
					placements.updateWorkspaceBaseManifest({
						claim: reclaimClaim,
						manifestRef
					});
					manifestAccepted = true;
				},
				abort: () => placements.abortWorkspaceReconciliation(journalOwner)
			};
			const cancelUnstagedFailedReclaim = async (allowCommitted) => {
				await options.workspaceOperations.run(current.environmentId, async () => {
					const stillOwnsEmptyResult = () => {
						const owned = placements.get(current.sessionId);
						const currentEnvironment = environments.get(current.environmentId);
						const pendingResult = placements.listPendingWorkspaceResults(reclaimClaim.sessionId).find((pending) => pending.sessionId === reclaimClaim.sessionId && pending.claimId === reclaimClaim.claimId && pending.runId === reclaimClaim.runId);
						return (allowCommitted || !manifestAccepted) && owned?.state === "draining" && owned.turnClaim?.claimId === reclaimClaim.claimId && reclaimClaim.owner.environmentId === current.environmentId && reclaimClaim.owner.ownerEpoch === current.activeOwnerEpoch && currentEnvironment?.state === "attached" && currentEnvironment.ownerEpoch === reclaimClaim.owner.ownerEpoch && currentEnvironment.attachedSessionIds.length === 1 && currentEnvironment.attachedSessionIds[0] === owned.sessionId && pendingResult?.workspaceAcceptedAtMs === null && pendingResult.stagedResultRef === null;
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
						await placements.closeWorkerTurnToolState(reclaimClaim);
						placements.cancelWorkspaceResultAndReleaseTurn(reclaimClaim);
					}
				});
			};
			const finishReclaim = async () => {
				const pending = journal.load();
				if (pending) {
					reauthorize?.();
					if (workspace.kind !== "local") throw new Error("Repository checkpoints cannot own a local reconciliation journal");
					await recoverWorkerWorkspaceReconciliation({
						root,
						journal: pending
					});
					reauthorize?.();
					journal.abort();
				}
				reauthorize?.();
				const tunnel = await environments.startTunnel({
					environmentId: current.environmentId,
					ownerEpoch: current.activeOwnerEpoch
				});
				const reclaimed = await options.workspaceOperations.run(current.environmentId, async () => {
					const assertCurrent = () => {
						reauthorize?.();
						const owned = placements.get(current.sessionId);
						if (owned?.state !== "draining" || owned.generation !== current.generation || owned.environmentId !== current.environmentId || owned.activeOwnerEpoch !== current.activeOwnerEpoch || owned.turnClaim?.claimId !== reclaimClaim.claimId || !placements.validateWorkspaceResultClaim(reclaimClaim)) throw new Error("Cloud worker stop lost its placement owner before reconciliation");
					};
					assertCurrent();
					reauthorize?.();
					const quiescence = await tunnel.quiesceWorkspace(current.remoteWorkspaceDir);
					try {
						reauthorize?.();
						const reconciliation = await tunnel.reconcileWorkspace(createWorkerWorkspaceReconcileRequest({
							workspace,
							remoteWorkspaceDir: current.remoteWorkspaceDir,
							baseManifestRef: current.workspaceBaseManifestRef,
							journal,
							stagedResult: {
								ref: reclaimResultRef,
								record: (ref) => placements.recordStagedWorkspaceResult(reclaimClaim, ref, workspace.kind === "repository" ? workspace.repository.workspaceId : void 0)
							},
							assertCurrent
						}));
						const applied = await verifyReconciledWorkspaceFinal(reconciliation, quiescence);
						if (reconciliation.changed && !manifestAccepted) throw new Error("Cloud worker stop did not commit its reconciled workspace");
						reauthorize?.();
						placements.acceptWorkspaceResult(reclaimClaim);
						const recordedStagedResultRef = placements.listPendingWorkspaceResults(reclaimClaim.sessionId).find((result) => result.sessionId === reclaimClaim.sessionId && result.claimId === reclaimClaim.claimId && result.runId === reclaimClaim.runId)?.stagedResultRef;
						const conflictPaths = applied?.conflictPaths ?? [];
						if (conflictPaths.length > 0 && !recordedStagedResultRef) throw new Error("Cloud worker stop conflict has no staged result reference");
						const priorWorkspaceResultConflict = await resolvePriorWorkspaceResultConflict(options.resolveWorkspaceResultConflict, current);
						reauthorize?.();
						const finalized = await finalizeWorkspaceResultConflicts({
							placements,
							turnClaim: reclaimClaim,
							conflictPaths,
							priorConflict: priorWorkspaceResultConflict,
							stagedResultRef: recordedStagedResultRef,
							retainPriorConflict: !reconciliation.changed,
							workspace,
							report: async (report) => await options.reportWorkspaceResultConflict({
								sessionId: current.sessionId,
								sessionKey: current.sessionKey,
								agentId: current.agentId,
								...report
							})
						});
						reauthorize?.();
						return await settleStagedWorkspaceResult({
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
							complete: () => {
								const completed = moveIntent ? completeMovedWorkspaceTeardown({
									placements,
									turnClaim: reclaimClaim,
									environmentId: current.environmentId,
									ownerEpoch: current.activeOwnerEpoch,
									operationId: moveIntent.operationId
								}) : completeReclaimedWorkspaceTeardown({
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
				await cancelUnstagedFailedReclaim(error instanceof WorkerWorkspaceFinalFenceError && error.reclaimDisposition === "retry").catch(() => void 0);
				const pendingReclaimResult = placements.listPendingWorkspaceResults(reclaimClaim.sessionId).find((pending) => pending.sessionId === reclaimClaim.sessionId && pending.claimId === reclaimClaim.claimId && pending.runId === reclaimClaim.runId);
				if (pendingReclaimResult && pendingReclaimResult.workspaceAcceptedAtMs !== null) placements.handoffWorkspaceResultRecovery(reclaimClaim);
				throw error;
			}
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
		failure,
		reportTransition: reportPlacementTransition
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
		recoverPlacementMoves: (environmentId) => moveService.recoverAll(environmentId)
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
				startDispatch: () => {
					placement = placements.startDispatch({
						sessionId: request.sessionId,
						sessionKey: request.sessionKey,
						agentId: request.agentId,
						executionMode: request.executionMode
					});
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
			placement = prepared?.placement ?? placements.transition({
				sessionId: request.sessionId,
				from: "requested",
				to: "provisioning",
				expectedGeneration: placement.generation,
				patch: { environmentId: expectedEnvironmentId }
			});
			reportPlacementTransition(onTransition, placement);
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
						failedPlacement = failure.cancelProvisioning(failedPlacement, initial);
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
					const local = placements.transition({
						sessionId: request.sessionId,
						from: "failed",
						to: "local",
						expectedGeneration: failed.generation
					});
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
		const checkSource = () => {
			beforeDrain?.(pendingOperations?.currentPlacement());
			assertGatewayRecoverySource();
		};
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
		const pendingSessions = /* @__PURE__ */ new Set([...options.placements.listPendingWorkspaceResults().map((result) => result.sessionId), ...options.placements.listWorkspaceReconciliationOwners().map((owner) => owner.sessionId)]);
		for (const placement of options.placements.listForReconcile()) {
			if (placement.state !== "active" || placement.turnClaim) continue;
			const environment = options.environments.get(placement.environmentId);
			const suspendAfter = environment && profiles[environment.profileId]?.suspendAfter;
			if (!environment || !suspendAfter) continue;
			if (now() - placement.updatedAtMs < parseDurationMs(suspendAfter)) continue;
			if (pendingSessions.has(placement.sessionId) || options.placements.getPlacementMove(placement.sessionId) || options.isPlacementOperationInFlight?.(placement.sessionId)) continue;
			try {
				const request = {
					sessionId: placement.sessionId,
					sessionKey: placement.sessionKey,
					agentId: placement.agentId
				};
				const hasSessionWork = await getSessionWorkAdmissionCheck?.(request);
				const beforeDrain = () => {
					const current = options.placements.get(placement.sessionId);
					if (options.getConfig().cloudWorkers?.profiles?.[environment.profileId]?.suspendAfter !== suspendAfter || hasSessionWork?.() || current?.state !== "active" || current.generation !== placement.generation || current.environmentId !== placement.environmentId || current.activeOwnerEpoch !== placement.activeOwnerEpoch || current.updatedAtMs !== placement.updatedAtMs || current.turnClaim) throw new WorkerPlacementAutoSuspendBusyError();
				};
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
//#region src/gateway/worker-environments/reclaimed-placement-redispatch.ts
function createReclaimedPlacementRedispatch(params) {
	return async (placement, { assertCurrent, signal }) => {
		signal?.throwIfAborted();
		assertCurrent();
		const previousEnvironment = params.environments.get(placement.environmentId);
		if (!previousEnvironment) throw new Error(`Reclaimed worker placement has no environment record: ${placement.environmentId}`);
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
			const assertOwner = () => {
				params.assertCurrent();
				const entry = loadSessionEntryReadOnly({
					...params,
					storePath
				});
				const current = placements.get(params.sessionId);
				const currentEnvironment = environments.get(placement.environmentId);
				if (entry?.sessionId !== params.sessionId || entry.repositoryWorkspaceId !== workspace.repository.workspaceId || workspace.repository.agentId !== params.agentId || workspace.repository.sessionKey !== params.sessionKey || current?.state !== "active" || current.agentId !== params.agentId || current.sessionKey !== params.sessionKey || current.generation !== placement.generation || current.environmentId !== placement.environmentId || current.activeOwnerEpoch !== placement.activeOwnerEpoch || current.remoteWorkspaceDir !== placement.remoteWorkspaceDir || !isCurrentActiveWorkerEnvironment(current, currentEnvironment) || currentEnvironment?.leaseId !== environment?.leaseId) throw new Error("Repository workspace edit lost its exact session placement owner");
			};
			assertOwner();
			const claim = placements.claimWorkspaceMutationResult({
				sessionId: params.sessionId,
				sessionKey: params.sessionKey,
				agentId: params.agentId,
				claimId: `workspace-mutation-${randomUUID()}`,
				owner: placementTurnOwner(placement)
			});
			const assertCurrent = () => {
				assertOwner();
				if (!placements.validateWorkspaceResultClaim(claim)) throw new Error("Repository workspace edit lost its result custody");
			};
			try {
				assertCurrent();
				const result = await params.mutate(assertCurrent);
				assertCurrent();
				if (!result.changed) {
					placements.acceptWorkspaceResult(claim);
					placements.completeWorkspaceResultAndReleaseTurn(claim);
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
						turnClaim: claim
					});
					const reconciliation = await tunnel.reconcileWorkspace(createWorkerWorkspaceReconcileRequest({
						workspace,
						remoteWorkspaceDir: placement.remoteWorkspaceDir,
						baseManifestRef: placement.workspaceBaseManifestRef,
						journal: journal.adapter,
						stagedResult: {
							ref: stagedResultRef,
							record: (ref) => placements.recordStagedWorkspaceResult(claim, ref, workspace.repository.workspaceId)
						},
						assertCurrent
					}));
					await verifyReconciledWorkspaceFinal(reconciliation, quiescence);
					assertCurrent();
					if (!journal.wasAccepted()) throw new Error("Repository workspace edit was not durably accepted");
					placements.acceptWorkspaceResult(claim);
					await settleStagedWorkspaceResult({
						placements,
						turnClaim: claim,
						workspace,
						stagedResultRef,
						conflictRetained: false,
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
				if (placements.validateWorkspaceResultClaim(claim)) placements.handoffWorkspaceResultRecovery(claim);
				throw error;
			}
		});
	} };
}
//#endregion
//#region src/gateway/worker-environments/worker-turn-launcher.ts
const loadWorkerTurnExecution = createLazyRuntimeModule(() => import("./worker-turn-execution-DHXzd9H4.mjs"));
const loadRemoteExecTurn = createLazyRuntimeModule(() => import("./workspace-result-finalize-DMdslcIY.mjs"));
const loadPlacementSandbox = createLazyRuntimeModule(() => import("./placement-sandbox-DtKUHGqz.mjs"));
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
		recoverTerminalTurn(session) {
			const active = activeWorkerTurns.get(session.sessionId);
			return active && (!session.sessionKey || active.sessionKey === session.sessionKey) ? active.recoverTerminal?.() : void 0;
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
		async executeLocalTurn(claim, runLocal) {
			return await executeLocalTurn({
				claim,
				placements: options.placements,
				runLocal
			});
		},
		async executeTurn(claim, inputTurn, runLocal, onAdmitted, assertRunCurrent) {
			const current = options.placements.get(claim.sessionId);
			if (!current && inputTurn.modelRun === true && !claim.sessionKey?.trim()) return await runLocal();
			if (!current || current.state === "local") return await executeLocalTurn({
				claim,
				placements: options.placements,
				runLocal
			});
			const hasPendingWorkspaceResultToSettle = (sessionId, runId) => options.placements.listPendingWorkspaceResults(sessionId).some((pending) => pending.sessionId === sessionId && (pending.runId !== runId || !options.placements.get(sessionId)?.turnClaim));
			let identity = resolvePlacementIdentity(claim, current);
			let routablePlacement = current;
			let assertInitialSetupCurrent;
			const assertAdmissionCurrent = () => {
				inputTurn.abortSignal?.throwIfAborted();
				assertRunCurrent?.();
				assertInitialSetupCurrent?.();
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
					emitAgentRunStatusEvent({
						runId: claim.runId,
						phase: "provisioning_environment",
						sessionKey: identity.sessionKey,
						agentId: identity.agentId
					});
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
				if (routablePlacement.state === "reclaimed") {
					emitAgentRunStatusEvent({
						runId: claim.runId,
						phase: "provisioning_environment",
						sessionKey: identity.sessionKey,
						agentId: identity.agentId
					});
					routablePlacement = await options.redispatchReclaimed(routablePlacement, {
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
				if (hasPendingWorkspaceResultToSettle(identity.sessionId, claim.runId)) {
					await waitForPendingWorkerResult({
						placements: options.placements,
						sessionId: identity.sessionId,
						...turn.abortSignal ? { signal: turn.abortSignal } : {}
					});
					assertAdmissionCurrent();
					const refreshed = options.placements.get(identity.sessionId);
					if (!refreshed) throw new Error("Cloud worker placement disappeared after workspace reconciliation");
					if (refreshed.state === "local") return await executeLocalTurn({
						claim,
						placements: options.placements,
						runLocal
					});
					routablePlacement = refreshed;
					continue;
				}
				placement = requireActivePlacement(routablePlacement);
				if (placement.executionMode === "remote-exec") try {
					turnClaim = options.placements.claimTurn({
						...identity,
						claimId: randomUUID(),
						runId: claim.runId,
						owner: placementTurnOwner(placement)
					});
				} catch (error) {
					if (!(error instanceof ActiveTurnClaimError) || !hasPendingWorkspaceResultToSettle(identity.sessionId, claim.runId)) throw error;
					await waitForPendingWorkerResult({
						placements: options.placements,
						sessionId: identity.sessionId,
						...turn.abortSignal ? { signal: turn.abortSignal } : {}
					});
					assertAdmissionCurrent();
					const refreshed = options.placements.get(identity.sessionId);
					if (!refreshed) throw new Error("Cloud worker placement disappeared after workspace reconciliation", { cause: error });
					if (refreshed.state === "local") return await executeLocalTurn({
						claim,
						placements: options.placements,
						runLocal
					});
					routablePlacement = refreshed;
					continue;
				}
				else {
					const admitted = await claimWorkerTurn({
						placements: options.placements,
						identity,
						placement,
						runId: claim.runId,
						isCancellationRequested: (activeClaim) => {
							const active = activeWorkerTurns.get(activeClaim.sessionId);
							return Boolean(active?.signal?.aborted && sameWorkerSessionTurnClaim(active.claim, activeClaim));
						},
						...turn.abortSignal ? { signal: turn.abortSignal } : {}
					});
					if (!admitted) {
						assertAdmissionCurrent();
						const refreshed = options.placements.get(identity.sessionId);
						if (!refreshed) throw new Error("Cloud worker placement disappeared after workspace reconciliation");
						if (refreshed.state === "local") return await executeLocalTurn({
							claim,
							placements: options.placements,
							runLocal
						});
						routablePlacement = refreshed;
						continue;
					}
					placement = admitted.placement;
					turnClaim = admitted.turnClaim;
				}
				let workspace;
				try {
					assertAdmissionCurrent();
					workspace = await options.resolveWorkspace(identity);
					assertAdmissionCurrent();
				} catch (error) {
					await releaseClaimIfOwned(options.placements, turnClaim);
					throw error;
				}
				const remoteExec = placement.executionMode === "remote-exec";
				if (remoteExec) {
					const refreshed = options.placements.get(claim.sessionId);
					if (refreshed?.state !== "active" || refreshed.executionMode !== "remote-exec" || refreshed.environmentId !== placement.environmentId || refreshed.activeOwnerEpoch !== placement.activeOwnerEpoch || refreshed.generation !== turnClaim.placementGeneration) {
						await releaseClaimIfOwned(options.placements, turnClaim);
						throw new Error("Remote-exec placement changed during turn admission");
					}
					placement = refreshed;
				}
				let activeWorkerTurn;
				let handedOff = false;
				let terminalAtMs;
				try {
					const execute = remoteExec ? (await loadRemoteExecTurn()).executeRemoteExecTurn : (await loadWorkerTurnExecution()).executeWorkerTurn;
					assertAdmissionCurrent();
					if (!matchesWorkerPlacementTarget(options.placements.get(turnClaim.sessionId), placement) || !options.placements.validateTurnClaim(turnClaim)) throw new Error("Worker placement changed while loading turn execution");
					if (!remoteExec) {
						activeWorkerTurn = createWorkerTurnRunOwner({
							placements: options.placements,
							claim: turnClaim,
							sessionKey: placement.sessionKey,
							turn
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
					if (!admissionReported) {
						onAdmitted?.();
						admissionReported = true;
					}
					return await execute({
						environments: options.environments,
						onHandoff: () => {
							handedOff = true;
						},
						onTerminal: () => {
							terminalAtMs = Date.now();
						},
						placement,
						placements: options.placements,
						workspace,
						...options.prepareAcceptedWorkspacePublication ? { prepareAcceptedWorkspacePublication: options.prepareAcceptedWorkspacePublication } : {},
						...options.publishAcceptedWorkspace ? { publishAcceptedWorkspace: options.publishAcceptedWorkspace } : {},
						workspaceOperations: options.workspaceOperations,
						turn,
						turnClaim,
						runLocal,
						assertRunCurrent: remoteExec ? assertRunCurrent : assertAdmissionCurrent
					});
				} catch (error) {
					const disconnectedBeforeHandoff = !handedOff && (error instanceof WorkerTunnelOwnerDisconnectedError || error instanceof WorkerRunnerUnavailableError);
					if (error instanceof StaleWorkerBuildError || error instanceof WorkerRuntimeRefreshPendingError || disconnectedBeforeHandoff) {
						const canRecoverAdmission = !handedOff && options.placements.validateTurnClaim(turnClaim) && !options.placements.listPendingWorkspaceResults(placement.sessionId).some((pending) => pending.sessionId === placement.sessionId);
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
								try {
									emitAgentRunStatusEvent({
										runId: claim.runId,
										phase: "provisioning_environment",
										sessionKey: identity.sessionKey,
										agentId: identity.agentId
									});
									await options.waitForAdmissionNode({
										placement,
										signal: reconnectSignal,
										assertCurrent: () => {
											reconnectSignal.throwIfAborted();
											assertAdmissionCurrent();
											const waitingPlacement = options.placements.get(placement.sessionId);
											if (!matchesWorkerPlacementTarget(waitingPlacement, placement) || waitingPlacement?.turnClaim || waitingPlacement?.sessionKey !== identity.sessionKey || waitingPlacement?.agentId !== identity.agentId || waitingPlacement?.executionMode !== placement.executionMode || options.placements.listPendingWorkspaceResults(placement.sessionId).length > 0) throw new Error("Worker placement changed while waiting for node admission", { cause: error });
										}
									});
								} finally {
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
					const pendingWorkspaceResult = options.placements.listPendingWorkspaceResults(turnClaim.sessionId).find((pending) => pending.sessionId === turnClaim.sessionId && pending.claimId === turnClaim.claimId && pending.runId === turnClaim.runId);
					if (pendingWorkspaceResult) {
						if (turnClaim.owner.kind === "local") options.placements.failWorkspaceResultAndReleaseTurn(pendingWorkspaceResult, error);
						else options.placements.handoffWorkspaceResultRecovery(turnClaim);
						await options.reconcileActivePlacement(placement.environmentId);
						throw error;
					}
					if (error instanceof WorkerRunnerCapacityError || error instanceof WorkerRunnerUnavailableError && !handedOff || !remoteExec && handedOff && turn.abortSignal?.aborted || error instanceof WorkerWorkspaceReconciliationError && !handedOff || error instanceof WorkerTurnExecutionError && options.placements.validateTurnClaim(turnClaim)) {
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
	const tails = /* @__PURE__ */ new Map();
	return { async run(environmentId, operation) {
		const result = (tails.get(environmentId) ?? Promise.resolve()).catch(() => void 0).then(operation);
		const tail = result.then(() => void 0, () => void 0);
		tails.set(environmentId, tail);
		tail.finally(() => {
			if (tails.get(environmentId) === tail) tails.delete(environmentId);
		});
		return await result;
	} };
}
//#endregion
//#region src/gateway/worker-workspace-conflict-transcript.ts
function createWorkerWorkspaceConflictTranscriptHandlers(loadSessionRuntime) {
	async function withWorkerTranscript(identity, run, missingMessage, strictIdentity = false) {
		const runtime = await loadSessionRuntime();
		const target = runtime.resolveGatewaySessionStoreTargetWithStore({
			cfg: getRuntimeConfig(),
			key: identity.sessionKey,
			agentId: identity.agentId,
			clone: false,
			exactRead: true
		});
		const lostSession = () => {
			if (missingMessage) throw new Error(`${missingMessage} lost session ${identity.sessionId}`);
			return err("session-unavailable");
		};
		if (runtime.resolveCanonicalSessionEntryFromStoreKeys(target.store, target.storeKeys)?.sessionId !== identity.sessionId || strictIdentity && (target.canonicalKey !== identity.sessionKey || target.agentId !== identity.agentId)) return lostSession();
		const result = await run({
			agentId: target.agentId,
			sessionId: identity.sessionId,
			sessionKey: target.canonicalKey,
			storePath: target.storePath
		});
		return result.ok ? ok(result.value) : lostSession();
	}
	return {
		resolveWorkspaceResultConflict: async (identity) => {
			const result = await withWorkerTranscript(identity, (target) => readLatestSessionTranscriptReport(target, [WORKSPACE_CONFLICT_TRANSCRIPT_TYPE, WORKSPACE_CONFLICT_CLEARED_TRANSCRIPT_TYPE]));
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
		reportWorkspaceResultConflict: async (conflict) => {
			await withWorkerTranscript(conflict, (target) => appendSessionTranscriptReport(target, {
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
		reportWorkspaceResultRecoveryFailure: async (recovery) => {
			await withWorkerTranscript(recovery, (target) => appendSessionTranscriptReport(target, {
				kind: "custom",
				customTypes: [WORKSPACE_RECOVERY_FAILURE_TRANSCRIPT_TYPE],
				selectReport: (latestRecovery) => {
					const error = boundedWorkerError(recovery.error, 768);
					const content = `Cloud workspace recovery attempt failed: ${error}. OpenClaw preserved the result and will retry.`;
					if (latestRecovery?.content !== content) return {
						customType: WORKSPACE_RECOVERY_FAILURE_TRANSCRIPT_TYPE,
						content,
						display: true,
						details: { error }
					};
				}
			}), "Cloud workspace recovery", true);
		}
	};
}
//#endregion
//#region src/gateway/server-worker-placement-startup.ts
const WORKER_PLACEMENT_RECONCILE_INTERVAL_MS = 6e4;
const loadWorkerWorkspacePreflight = createLazyRuntimeModule(async () => {
	const { preflightWorkerWorkspace } = await import("./workspace-sync-preflight-C_leyUKW.mjs");
	return preflightWorkerWorkspace;
});
function createGatewayGitHubPublicationRuntime(params) {
	return createGitHubPublicationRuntime({
		placements: params.placements,
		getCommittedRuntimeConfig: params.getCommittedRuntimeConfig,
		loadSessionRuntime: loadWorkerPlacementSessionRuntimeModule,
		warn: params.warn
	});
}
function createGatewayWorkerPlacementRuntime(params) {
	let nodeWorkerSupervisorTransport;
	let stopped = false;
	const runtimeRefresh = createWorkerRuntimeRefreshWaiter({
		environments: params.environments,
		isStopping: () => stopped
	});
	const workspaceOperations = createWorkerWorkspaceOperationCoordinator();
	const { coordinator: githubPublication, prepareAcceptedWorkspacePublication, publishAcceptedWorkspace, reconcilePublications } = params.githubPublicationRuntime ?? createGatewayGitHubPublicationRuntime(params);
	const diskSpace = createWorkerPlacementDiskSpaceMonitor({
		placements: params.placements,
		environments: params.environments,
		warn: params.warn
	});
	const workspaceConflictHandlers = createWorkerWorkspaceConflictTranscriptHandlers(loadWorkerPlacementSessionRuntimeModule);
	const nodeWorkspaceRetention = createNodeWorkspaceRetainCoordinator({
		bundleRetention: params.nodeWorkerBundleRetention,
		gatewayNamespace: params.gatewayNamespace,
		placements: params.placements,
		environments: params.environments,
		additionalManifestRefs: (placement) => {
			const entry = loadSessionEntryReadOnly({
				...placement,
				storePath: resolveSessionStorePathForScope(placement)
			});
			if (entry?.sessionId !== placement.sessionId || !entry.repositoryWorkspaceId) return [];
			const repository = getSessionRepositoryWorkspaceStore().get(entry.repositoryWorkspaceId);
			return repository?.agentId === placement.agentId && repository.sessionKey === placement.sessionKey && repository.baseManifestHash ? [repository.baseManifestHash] : [];
		},
		warn: params.warn
	});
	const runnerAvailability = createWorkerPlacementRunnerAvailabilityReader({
		environments: params.environments,
		hasCurrentDeviceRunner: (deviceId) => nodeWorkerSupervisorTransport?.hasCurrentRunner(deviceId) === true
	});
	const reclaimBarriers = createGatewayWorkerPlacementReclaimBarriers({
		placements: params.placements,
		loadSessionRuntime: loadWorkerPlacementSessionRuntimeModule,
		cancelSessionWork: params.cancelSessionWork,
		revokeSessionAuthority: params.revokeSessionAuthority
	});
	const runMoveBarrier = createGatewayWorkerPlacementMoveBarrier({
		placements: params.placements,
		loadSessionRuntime: loadWorkerPlacementSessionRuntimeModule,
		persistAbandonedPartial: params.persistAbandonedPartial,
		revokeSessionAuthority: params.revokeSessionAuthority
	});
	const resolveWorkspace = async ({ sessionId, sessionKey, agentId }) => {
		const { workspace } = resolveWorkerPlacementSessionTarget({
			sessionRuntime: await loadWorkerPlacementSessionRuntimeModule(),
			config: getRuntimeConfig(),
			sessionId,
			sessionKey,
			agentId,
			errorMessage: `Session ${sessionKey} dispatch requires a session-owned workspace`
		});
		return workspace;
	};
	const resolveDevicePlacementRequirement = async (identity) => {
		const sessionRuntime = await loadWorkerPlacementSessionRuntimeModule();
		const { config, target, entry } = resolveWorkerPlacementSessionTarget({
			sessionRuntime,
			config: getRuntimeConfig(),
			...identity,
			errorMessage: `Session ${identity.sessionKey} changed before node-backed placement recovery`
		});
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
		...workspaceConflictHandlers,
		...reclaimBarriers,
		runLocalBarrier: async ({ sessionId, sessionKey, agentId, executionMode, authorize, signal, startDispatch }) => {
			const sessionRuntime = await loadWorkerPlacementSessionRuntimeModule();
			const { resolveWorkerPlacementExecutionMode, resolveGatewaySessionStoreTargetWithStore, resolveWorkerPlacementSessionRuntime } = sessionRuntime;
			const target = resolveGatewaySessionStoreTargetWithStore({
				cfg: getRuntimeConfig(),
				key: sessionKey,
				agentId,
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
			await runExclusiveSessionLifecycleMutation({
				scope: target.storePath,
				identities: lifecycleIdentities,
				signal,
				prepare: async () => {
					const { config: currentConfig, target: currentTarget, entry: currentEntry, workspace } = resolveWorkerPlacementSessionTarget({
						sessionRuntime,
						config: getRuntimeConfig(),
						sessionId,
						sessionKey,
						agentId,
						expectedTarget: target,
						errorMessage: `Session ${sessionKey} changed before cloud worker dispatch. Retry.`
					});
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
					authorize?.();
					placement = startDispatch();
					clearSessionQueues(lifecycleIdentities);
					params.revokeSessionAuthority({
						sessionId,
						sessionKeys: lifecycleIdentities
					});
					if (!await interruptSessionWorkAdmissions({
						scope: target.storePath,
						identities: lifecycleIdentities,
						timeoutMs: 15e3
					})) throw new Error(`Session ${sessionKey} is still active; dispatch stopped`);
					await params.placements.waitForTurnClaimRelease(sessionId, { timeoutMs: SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS });
					await runExclusiveSessionStoreWrite(target.storePath, async () => {}, { reentrant: true });
				},
				run: async () => {
					if (!placement) throw new Error(`Session ${sessionKey} dispatch barrier did not start`);
				}
			});
			if (!placement) throw new Error(`Session ${sessionKey} dispatch barrier did not complete`);
			return placement;
		},
		runActivationBarrier: async ({ authorize, activate, ...identity }) => await runWorkerPlacementSessionBarrier({
			sessionRuntime: await loadWorkerPlacementSessionRuntimeModule(),
			getConfig: getRuntimeConfig,
			...identity,
			action: "activation",
			run: () => {
				authorize?.();
				return activate();
			}
		}),
		runRecoveryBarrier: async ({ environmentId, expectedGeneration, run, ...identity }) => await runWorkerPlacementSessionBarrier({
			sessionRuntime: await loadWorkerPlacementSessionRuntimeModule(),
			getConfig: getRuntimeConfig,
			...identity,
			action: "recovery",
			run: async (workspace) => {
				const placement = params.placements.get(identity.sessionId);
				if (placement?.state !== "provisioning" || placement.generation !== expectedGeneration || placement.environmentId !== environmentId) throw new WorkerDispatchTargetChangedError(`Session ${identity.sessionKey} placement changed before cloud worker recovery. Retry.`);
				await run(workspace);
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
		redispatchReclaimed: createReclaimedPlacementRedispatch({
			environments: params.environments,
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
		let placementReconcileInterval;
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
		const sweepActivePlacements = () => {
			reconcileActivePlacements().then(() => {
				if (stopped || placementIdleSuspend.current) return;
				trackOperation(placementIdleSuspend, publishPlacementChanges(() => placementIdleSweep.sweep()), "Worker placement auto-suspend sweep failed");
			}, () => void 0);
			sweepDiskSpace();
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
				pending.then(reconcileActivePlacements, reconcileActivePlacements);
			}
		});
		let stopPromise;
		const sidecar = { stop: () => {
			if (stopPromise) return stopPromise;
			if (!stopped) {
				stopped = true;
				params.environments.stopNodeEnrollmentWaits?.();
				clearInterval(placementReconcileInterval);
				placementReconcileInterval = void 0;
				unsubscribeMachineShape();
				uninstallSessionIdentityMutation();
				uninstallSessionMaintenancePreservation();
				uninstallPlacementAdmission();
			}
			const currentStop = (async () => {
				await Promise.allSettled([
					placementReconcile.current,
					diskSpaceSweep.current,
					placementIdleSuspend.current
				].filter((operation) => operation !== void 0));
				await nodeWorkspaceRetention.stop();
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
			placementReconcileInterval = setInterval(sweepActivePlacements, WORKER_PLACEMENT_RECONCILE_INTERVAL_MS);
			placementReconcileInterval.unref?.();
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
