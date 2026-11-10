import { m as readNonBlankString } from "./string-coerce-1VuiLaaR.mjs";
import { d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import { t as runInDetachedAsyncContext } from "./detached-async-context-D04NzekX.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { a as runOutsideAsyncWorkScope, t as AsyncWorkScope } from "./async-work-scope-BH2yUdBz.mjs";
import "./src-Djeo9OvP.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { o as racePromiseWithAbortSignal } from "./src-Bzfi3cQM.mjs";
import { t as isAbortError } from "./abort-signal-C9DFO3n5.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { r as withArtifactPreservingStateReads } from "./artifact-preserving-state-reads-CSUBkGbZ.mjs";
import { a as withGitProcessOperation } from "./spawn-diagnostics-CvEKrJ76.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { s as matchesAgentDatabaseReadCandidatePath } from "./agent-database-readers-DSwi8tar.mjs";
import { o as registerOpenClawAgentDatabaseAsyncResource } from "./openclaw-agent-db-resources-DIwq7LM6.mjs";
import { A as withTimeout } from "./fs-safe-6Z4UiMS4.mjs";
import { t as OpenClawStateLeaseAcquisitionError } from "./openclaw-state-lease-error-BPKnfJ8N.mjs";
import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { i as createLazyRuntimeNamedExport, r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { i as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { n as captureOpenClawStateReadWorkerContext, r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { a as sessionChanges, i as sessionChangeScopeAffectsStoredRows } from "./session-row-changes-vFaNnKNM.mjs";
import { f as sessionEntryCommitGuardOptions, o as composeSessionSourceAssertion, s as createDynamicSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { N as tryBeginGatewayRootWorkAdmission, l as getGatewayRestartDrainSignal, s as getActiveGatewayRootWorkCount } from "./gateway-work-admission-FWbk4b3p.mjs";
import { a as resolveUnsuffixedSqliteTargetFromSessionStorePath } from "./session-sqlite-target-paths-DufdR-Na.mjs";
import { s as retainOpenClawAgentDatabaseReadCandidates } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { t as parseDurationMs } from "./parse-duration-B7MSnEK8.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import { A as NODE_WORKER_WORKSPACE_RETAIN_COMMAND } from "./node-commands-Bxo-2Y4j.mjs";
import { i as isSessionStoreReadCandidateCurrent, r as captureSessionStoreReadCandidate } from "./session-store-read-candidates-CmVF2223.mjs";
import { o as resolveSessionStorePathForScope } from "./session-store-path-BQkYPc4_.mjs";
import { a as createAgentRunDirectAbortError, u as isAgentRunRestartAbortReason } from "./run-termination-Dwf1ksjA.mjs";
import { a as resolveSessionWorkStartError } from "./session-work-start-Sz_vqYld.mjs";
import { l as makeZeroUsageSnapshot } from "./usage-BqbJmOEZ.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-CUxN9KZj.mjs";
import { A as projectSessionSharingEntry, _ as retainPreparedSessionGenerationFacts, v as retainPreparedSessionSharingFacts } from "./session-accessor.sqlite-entry-cache-publication-state-4Z0giEC3.mjs";
import { n as emitSessionLifecycleEvent, r as onSessionIdentityMutation } from "./session-lifecycle-events-76OxWRqj.mjs";
import { o as captureCanonicalSessionReaderContinuation } from "./session-canonical-key-B7chVWi3.mjs";
import { a as readCapturedSessionActorEntry, n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { n as captureMemoryExactSessionReader } from "./session-accessor.memory-exact-read-UNAhvKNR.mjs";
import { s as withSessionHistoryWorkerDatabases } from "./session-transcript-worker-runtime-DyHfVUVm.mjs";
import { t as assertCapturedSessionEntryReadSource } from "./session-entry-read-source-CtAlEtSu.mjs";
import { i as prepareSessionStoreTargetInventory } from "./session-store-target-inventory-BkD5HoDI.mjs";
import { t as prepareSessionStoreTargetInventoryRead } from "./session-store-target-runtime-D11id0W-.mjs";
import { i as readSessionEntryReadOnlyInWorker, l as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { n as appendSessionTranscriptReport } from "./session-accessor-Czw4l8kI.mjs";
import { D as getSessionRepositoryWorkspaceStore } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { S as runExclusiveSessionLifecycleMutation, T as startSessionWorkAdmissionInterruption, _ as interruptSessionWorkAdmissions, b as isSessionWorkAdmissionActive, k as runExclusiveSessionStoreWrite, o as closeSessionWorkAdmissions, t as SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS, v as isCompetingSessionWorkAdmissionActive } from "./session-lifecycle-admission-BihxXo5j.mjs";
import { i as githubPublicationReceipts, o as withGitHubPublicationWorkerReceipt } from "./github-publication-receipts-WUg6AvYk.mjs";
import { i as resolveSessionStoreAgentId, o as resolveSessionStoreKey } from "./session-store-key-DKpto8R6.mjs";
import { o as patchSessionEntryCore } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import "./config-B3oiWDlr.mjs";
import { i as registerSessionMaintenancePreserveKeysProvider } from "./store-maintenance-preserve-BGAXgKIR.mjs";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.mjs";
import "./lifecycle-CKc8qk3B.mjs";
import { i as resolveConfiguredGitHubHost, n as githubRepositoryUrl } from "./github-host-N2fYlLEb.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-Cdqn6r49.mjs";
import { n as captureSessionMutationRouting } from "./session-sharing-preparation-DAfvBDLL.mjs";
import { t as loadGatewaySessionEntryReadOnlyInWorker } from "./session-utils-store-worker-u3lCvEEg.mjs";
import "./session-sharing-DuL10izq.mjs";
import { n as captureSessionEntrySourceAssertion, t as captureSessionEntryMetadataRead } from "./session-entry-source-authority-CY_NaTk4.mjs";
import { n as resolveGitHubHost } from "./github-host-runtime-D306-ub0.mjs";
import { f as resolveConfiguredGitHubToolIdentity, l as preparePersonalGitHubPublicationIdentity } from "./github-tool-identity-BEdbceu6.mjs";
import { a as personalGitHubStatusAsync, i as requestCurrentPersonalGitHubRefresh, o as UserGitHubConnectionAuthorityChangedError, s as prepareUserGitHubConnection } from "./github-oauth-lifecycle-BAlR2l66.mjs";
import { l as gitNullConfigPath } from "./git-exec-CvORirty.mjs";
import { t as acquireWorktreeRunLease } from "./run-lease-D02SNP3d.mjs";
import { a as matchesCurrentGitHubPublicationIdentity, c as prepareGitHubPublicationRepositoryIdentity, d as readGitHubPublicationWorktreeOwner, f as readLocalGitHubPublicationWorktreeOwner, h as readGitHubPublicationSessionLifecycleInWorker, l as prepareGitHubPublicationSession, m as prepareGitHubPublicationSessionLifecycle, n as currentGitHubPublicationConfig, o as prepareCurrentGitHubPublicationIdentity, p as sameGitHubPublicationWorkspace, r as hasGitHubPublicationRepositoryWorkspace, t as assertExpectedSharedGitHubPublisher, u as prepareGitHubPublicationWorkspaceOwner } from "./github-publication-availability-DsIV42qE.mjs";
import { a as GitHubPublicationSessionChangedError, c as rejectGitHubPublicationSelection, i as GitHubPublicationRequesterUnavailableError, l as resolveGitHubPublicationFailure, n as GitHubPublicationCreditChangedError, r as GitHubPublicationKnownFailure, s as GitHubPublicationWorkspaceChangedError, t as GitHubPublicationBranchChangedError } from "./github-publication-failure-ByPq2Muc.mjs";
import { i as updateGitHubPublicationBranchAndIndex, n as assertGitHubPublicationRefCasCompleted, r as recoverGitHubPublicationBranchAndIndex, t as GitHubPublicationRecoveryPendingError } from "./github-publication-git-index-4ApBmbV1.mjs";
import { t as parseGitHubRemoteUrl } from "./github-remote-rTdEnJZN.mjs";
import { t as prepareGitHubPublicationFact } from "./worker-github-binding-BYK7FikM.mjs";
import { r as GatewayOperatorAccessUnavailableError } from "./operator-access-policy-D9L4Y9uO.mjs";
import { l as hasPendingFollowupQueueWork } from "./state-DNPW_vEt.mjs";
import { n as captureSessionEntryCurrentRead } from "./session-entry-current-runtime-Dwzq8LTI.mjs";
import { g as getReplyOperationSessionReader } from "./reply-run-registry.state-Hn_UqZjq.mjs";
import { f as markDiagnosticRunProgress } from "./diagnostic-run-activity-CaoGYSHp.mjs";
import { n as emitSessionsChanged } from "./session-change-event-0LxChmzi.mjs";
import { n as isTerminalWorkerEnvironmentState } from "./state-DfozG-Xp.mjs";
import "./node-runner-inventory-tKxQBAdF.mjs";
import { r as supportsCurrentWorkerLaunch, t as sameWorkerBuild } from "./worker-build-identity-CtiTzbZN.mjs";
import { c as measureGatewayRestartTrace, s as measureGatewayCloseStep } from "./restart-trace-BTv1cWuA.mjs";
import { t as boundedWorkerError } from "./worker-error-BrVatFit.mjs";
import { i as recoverWorkerWorkspaceReconciliation, n as AcceptedWorkspacePublicationIndeterminateError, t as applyStagedWorkerWorkspace } from "./workspace-reconcile-BuXOoPIv.mjs";
import { i as resolveControlUiSessionUrl } from "./control-ui-link-base-C4cbCE5S.mjs";
import "./device-provider-identity-v6nXqNq_.mjs";
import { i as isFailedWorkerPlacementEnvironmentGone, n as isCurrentActiveWorkerEnvironment, o as matchesWorkerPlacementTarget, r as isExactAttachedEnvironment, t as assertWorkerSandboxEnvironment } from "./placement-target-BGdJpPtJ.mjs";
import { n as canRedispatchFailedWorkerPlacement, r as ensureWorkerSessionPlacement } from "./session-placement-lifecycle-CAT_zN-p.mjs";
import { l as resolveNodeCommandAllowlist } from "./node-command-policy-CCKsZy54.mjs";
import { i as assertRequiredWorkerMove, n as assertRequiredWorkerDispatch, t as RequiredWorkerProfileError } from "./required-worker-profile-B0DIhkdC.mjs";
import { t as retainGatewaySessionEntryReadOnly } from "./session-utils-read-lifetime-CQKtyavc.mjs";
import { t as prepareSessionWorktree } from "./session-worktree-preparation-M6dhYMsR.mjs";
import { n as resolveWorkerPlacementDestination } from "./placement-destination-r3SrB0gE.mjs";
import { n as clearSessionLifecycleQueues } from "./cleanup-CjvcBZOl.mjs";
import { c as withRequiredSessionPlacement, n as installSessionPlacementAdmissionProvider } from "./session-placement-admission-DV-Z5szH.mjs";
import { t as prepareGitCoauthorAttribution } from "./git-coauthor-attribution-oOt34ShF.mjs";
import { i as parseNodeWorkerWorkspaceRetainResult } from "./node-workspace-retain-protocol-hYopQhIS.mjs";
import { t as WORKER_ADMISSION_DEADLINE_MS } from "./worker-connection-contract-BLrCYghU.mjs";
import { a as hasWorkerWorkspaceResultRef, c as preparedWorkerWorkspaceResultRef, f as workerWorkspaceResultRef, i as deleteWorkerWorkspaceResultCleanupRefs, n as cleanupWorkerWorkspaceResultRef, o as isWorkerWorkspaceResultCleanupRef, r as deleteStagedWorkerWorkspaceResult, t as applyStagedWorkerWorkspaceResult, u as restoreStagedWorkerWorkspaceResultFromCleanup } from "./workspace-result-staging-CYU_4-6b.mjs";
import { i as readGitHubRepositoryPublicationMetadata, r as readGitHubRepositoryPublicationBlob, s as parseGitHubPublicationBaseBranch } from "./github-repository-publication-snapshot-BUzIX2Zd.mjs";
import "./device-folder-Bc207Mdx.mjs";
import { _ as resolvePlacementTurnEnvironment, a as isForceAbandonedWorkerPlacement, f as placementTurnOwner, h as reportPlacementTransition, i as isCurrentPlacementTurnClaim, m as projectWorkerSessionTurnClaim, p as projectPlacementTurnClaim, t as FORCED_WORKER_ABANDONMENT_ERROR, v as sameWorkerSessionTurnClaim, y as serializeWorkerSessionTurnClaim } from "./placement-record-CBaaHws5.mjs";
import { L as isCurrentWorkerWorkspacePendingResultOwner, z as matchesWorkspaceResultClaim } from "./placement-row-codec-DhdW6tSs.mjs";
import { n as SessionWorkspaceReservationBusyError } from "./placement-workspace-reservation.kernel-Bjfj6oO6.mjs";
import { r as findPendingWorkerWorkspaceResult } from "./placement-workspace-result--lykq2r1.mjs";
import { t as ActiveTurnClaimError } from "./placement-turn-claims-DLDd9nfQ.mjs";
import { t as emitAgentRunStatusEvent } from "./agent-run-status-events-5OyxJInq.mjs";
import { a as resolveWorkerPlacementSessionStoreTarget, i as loadWorkerPlacementSessionRuntimeModule, n as createWorkerPlacementNodeWorkspaceBindingResolver, o as resolveWorkerPlacementSessionTarget, r as createWorkerWorkspaceRecoveryPreparer, s as runWorkerPlacementSessionBarrier, t as WorkerDispatchTargetChangedError } from "./server-worker-placement-session-target-CLJyKcFG.mjs";
import { a as readProjectCheckoutRemoteHead, i as ProjectCloneError, t as materializeProjectClone } from "./project-clone-DK_Wghok.mjs";
import { t as sessionLog } from "./session-log-BKA9lku6.mjs";
import { n as startSlowRequestDiagnostics } from "./slow-request-diagnostics-Ba6xRXbV.mjs";
import { n as resolveGitHubRepositoryTarget } from "./github-repository-target-Dd_mrAkV.mjs";
import { n as encodeGitHubPublicationRequester, r as matchesGitHubPublicationRequester, t as decodeGitHubPublicationRequester } from "./github-publication-requester-DXNenk0m.mjs";
import { a as bindGitHubPublicationSourceLifetime, i as bindGitHubPublicationSource, r as restoreGitHubPublicationRequester, t as isGitHubPublicationRequesterV2 } from "./github-publication-requester-Det-4INz.mjs";
import { a as withSessionRepositoryCheckpoint, i as stageSessionRepositoryCheckpoint } from "./session-repository-checkpoints-C4TGwsPq.mjs";
import { t as createWorkerPlacementRunnerAvailabilityReader } from "./placement-projector-DKN6sMLO.mjs";
import { t as raceNodeWorkerOperation } from "./node-worker-abort--EyODQgV.mjs";
import { n as WorkerRunnerUnavailableError, r as WorkerTunnelOwnerDisconnectedError, t as WorkerRunnerCapacityError } from "./tunnel-contract-DJT0nCJA.mjs";
import { a as DevicePlacementUnavailableError, i as workerDisappearanceError, n as createPlacementFailureActions, o as createDevicePlacementAuthority, r as isUnavailableEnvironment, s as resolveDevicePlacementEligibility } from "./placement-dispatch-failure-CV1534pY.mjs";
import { n as StaleWorkerBuildError } from "./admission-C4XP6xqG.mjs";
import { n as readWorkerPreparation, r as readWorkerProjectPreparation } from "./preparation-identity.schema-D-YjGy-J.mjs";
import { t as listRetainedWorkerBundleHashes } from "./worker-bundle-retention-gD9d5rT1.mjs";
import { a as matchesGitHubPublicationIdentityRow, i as digestGitHubPublicationRequest, n as readPendingRepositoryGitHubPublication, o as projectGitHubPublicationResult, r as terminalRepositoryGitHubPublication, t as personalGitHubRequestDigest } from "./github-personal-publication-store-B5tEN2Tb.mjs";
import { i as repositoryGitHubPublicationDigest, n as matchesRepositoryGitHubPublicationClaim } from "./github-repository-publication.kernel-DPeRC71q.mjs";
import { _ as runPublicationCommand, a as captureGitHubPublicationWorkspaceSnapshot, b as prepareGitHubPublicationWorkflowGuard, c as githubPublicationPushArgs, d as hasGitHubPublicationMessageFooter, f as hasGitHubPublicationWorkflowChanges, g as requirePublicationCommand, h as requireGitHubPublicationCommit, i as assertSafeGitPublicationWorkspace, l as githubPublicationRemoteHeadArgs, m as readGitHubPublicationCoauthorTrailers, n as appendGitHubPublicationMessage, o as createGitHubPublicationCommandRunner, p as readGitHubPublicationBaseSha, r as assertGitHubPublicationBranchRef, s as githubPublicationApiArgs, t as prepareRepositoryPublicationRestore, u as githubPublicationUpdateRefArgs, v as assertGitHubPublicationWorkflowChangesAllowed, y as hasRepositoryGitHubPublicationWorkflowChanges } from "./github-repository-publication-restore-CV7Spj2u.mjs";
import { n as deriveEnvironmentIntent, t as WorkerPlacementAdmissionTargetError } from "./service-contract-BIUGNku3.mjs";
import { t as createGatewayWorkerDispatchAdmission } from "./server-worker-placement-dispatch-admission-DwFO4Cjr.mjs";
import { t as parseNodeWorkerResponse } from "./node-worker-response-DW3BYzaY.mjs";
import { a as WorkerRuntimeRefreshPendingError, i as runWorkerProjectLifecycle, l as hasForcedWorkerEnvironmentAbandonment, r as readWorkerProjectSnapshot } from "./project-preparation-DqnEf_tb.mjs";
import { C as createWorkerWorkspaceReconcileRequest, S as settleStagedWorkspaceResult, T as sessionWorkspaceRoot, a as assertWorkerPlacementCompactionAllowed, b as finalizeWorkspaceResultConflicts, c as executeLocalTurn, d as releaseClaimIfOwned, f as requireActivePlacement, g as waitForPendingWorkerResult, h as waitForInitialWorkerPlacement, i as prepareWorkerTurnFailure, l as hasWorkerResultToSettle, m as resolveWorkerPlacementRuntimeOverride, n as WorkerWorkspaceReconciliationError, o as claimWorkerTurn, p as resolvePlacementIdentity, r as failHandedOffTurn, s as createRequiredWorkerTurnAdmission, t as WorkerTurnExecutionError, v as waitForWorkerRuntimeRefresh, w as recoverSessionWorkspaceCheckpoint, x as resolvePriorWorkspaceResultConflict, y as createWorkspaceResultJournal } from "./worker-turn-failure-CRrG7zhu.mjs";
import { r as verifyReconciledWorkspaceFinal, t as WorkerWorkspaceFinalFenceError } from "./workspace-finalize-B3_4vOFy.mjs";
import { n as createWorkerTurnRunOwner, r as prepareWorkerTurnReplyDelivery } from "./worker-turn-run-owner-BAjZ0NE-.mjs";
import { randomUUID } from "node:crypto";
import os from "node:os";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/state/github-publication-worker.ts
async function readGitHubPublicationInWorker(command) {
	const context = captureOpenClawStateReadWorkerContext();
	const captured = structuredClone(command);
	const result = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute(captured), { existingOnly: true });
	context.admission.assertCurrent();
	return result;
}
/** A publication execution retains FIFO writes through native settlement. */
function createGitHubPublicationWorkerScope(context) {
	const work = new AsyncWorkScope();
	let tail = Promise.resolve();
	let closed = false;
	const assertSource = () => {
		context.admission.assertCurrent();
		if (closed) throw new Error("GitHub publication scope is closed.");
	};
	const enqueue = (operation) => {
		assertSource();
		const result = work.track(() => tail.then(() => {
			assertSource();
			return operation();
		}));
		tail = result.then(() => void 0, () => void 0);
		return result;
	};
	return {
		signal: work.signal,
		assertCurrent: assertSource,
		async close() {
			closed = true;
			await work.drain();
		},
		async mutate(command, assertCurrent, publish, source) {
			const commandSnapshot = structuredClone(command);
			const expectedKind = commandSnapshot.type === "githubPublications.insert" ? commandSnapshot.input.kind : commandSnapshot.type.slice(19);
			const readReceipt = (facts) => {
				if (!isRecord(facts) || facts.operationId !== commandSnapshot.input.operationId || facts.operation !== commandSnapshot.input.operation || !Array.isArray(facts.rows) || facts.kind !== expectedKind) throw new Error("GitHub publication receipt differs from its command.");
				return facts;
			};
			if (source) return enqueue(async () => {
				let retainedSource;
				try {
					assertCurrent();
					retainedSource = typeof source === "function" ? await source() : source;
					assertCurrent();
					const binding = bindGitHubPublicationSource(retainedSource);
					if (binding.context.admission.databasePath !== context.admission.databasePath || binding.context.admission.identity.key !== context.admission.identity.key || binding.context.admission.identity.birthtime !== context.admission.identity.birthtime) throw new Error("GitHub publication destination changed before dispatch.");
					const captured = structuredClone({
						...commandSnapshot,
						input: {
							...commandSnapshot.input,
							source: binding.predicate
						}
					});
					let admission;
					let receipt;
					let settled = Promise.resolve();
					const accept = (facts) => {
						receipt = readReceipt(facts);
						try {
							assertSource();
						} catch {
							return;
						}
						publish(receipt);
					};
					return await runOpenClawStateWorkerOperation(binding.context, async (scope) => {
						const outcome = await scope.execute(captured).then(() => ({ ok: true }), (error) => ({
							ok: false,
							error
						}));
						await settled;
						if (admission?.committed) {
							if (!receipt) throw new Error("GitHub publication committed facts were not installed.");
							return receipt;
						}
						if (!outcome.ok) throw outcome.error;
						throw new Error("GitHub publication mutation has no committed receipt.");
					}, {
						assertCurrent: assertSource,
						createAdmission(operation) {
							settled = operation.settled;
							const retained = withGitHubPublicationWorkerReceipt(binding.createAdmission, binding.context, accept)(operation);
							admission = retained.admission;
							return retained;
						}
					});
				} finally {
					await retainedSource?.release();
				}
			});
			const captured = commandSnapshot;
			let admission;
			let settled = Promise.resolve();
			const check = () => {
				assertSource();
				assertCurrent();
			};
			return enqueue(() => runOpenClawStateWorkerOperation(context, async (scope) => {
				const outcome = await scope.execute(captured).then(() => ({ ok: true }), (error) => ({
					ok: false,
					error
				}));
				await settled;
				const committed = admission?.committed;
				if (committed) return readReceipt(committed.facts);
				if (!outcome.ok) throw outcome.error;
				throw new Error("GitHub publication mutation has no committed receipt.");
			}, {
				assertCurrent: check,
				createAdmission: (operation) => {
					settled = operation.settled;
					const mutationAdmission = createSqliteWorkerOperationAdmission(() => {
						throw new Error("GitHub publication bookkeeping requires no source admission.");
					});
					admission = mutationAdmission;
					return withGitHubPublicationWorkerReceipt(() => ({
						admission: mutationAdmission,
						nativeLocations: [context.admission.databasePath]
					}), context, (facts) => {
						const receipt = readReceipt(facts);
						try {
							assertSource();
						} catch {
							return;
						}
						publish(receipt);
					})(operation);
				}
			}));
		}
	};
}
//#endregion
//#region src/gateway/github-publication-store-async.ts
function publish(receipt) {
	for (const change of receipt.changes) emitSessionLifecycleEvent({
		...change,
		reason: "github-publication"
	});
}
function mutationScope() {
	return createGitHubPublicationWorkerScope(captureOpenClawStateWorkerContext());
}
async function personalMutation(scope, input, authority) {
	const receipt = await withMutationAuthority(authority, (assertCurrent, source) => scope.mutate({
		type: "githubPublications.personal",
		input: {
			...input,
			operationId: randomUUID()
		}
	}, assertCurrent, publish, source));
	if (receipt.kind !== "personal") throw new Error("Invalid personal publication receipt.");
	return receipt.rows;
}
async function repositoryMutation(scope, input, authority) {
	const receipt = await withMutationAuthority(authority, (assertCurrent, source) => scope.mutate({
		type: "githubPublications.repository",
		input: {
			...input,
			operationId: randomUUID()
		}
	}, assertCurrent, publish, source));
	if (receipt.kind !== "repository") throw new Error("Invalid repository publication receipt.");
	return receipt.rows;
}
async function sharedMutation(scope, input, authority) {
	const receipt = await withMutationAuthority(authority, (assertCurrent, source) => scope.mutate({
		type: "githubPublications.shared",
		input: {
			...input,
			operationId: randomUUID()
		}
	}, assertCurrent, publish, source));
	if (receipt.kind !== "shared") throw new Error("Invalid shared publication receipt.");
	return receipt.rows;
}
function requireRow(rows) {
	if (!rows[0]) throw new Error("GitHub publication transition returned no receipt.");
	return rows[0];
}
function withMutationAuthority(authority, operation) {
	if (typeof authority === "function") return operation(authority);
	const assertCurrent = () => {
		authority.assertCustody();
		authority.assertAction();
	};
	return operation(assertCurrent, () => authority.prepareSource());
}
function effects(apply) {
	return {
		updateHead: (headCommit) => apply({
			operation: "updateHead",
			headCommit
		}),
		complete: (result) => apply({
			operation: "complete",
			result
		}),
		async recordEffect(effect, observed) {
			await apply({
				operation: "recordEffect",
				effect,
				observed
			});
		},
		interrupt: () => apply({ operation: "interrupt" })
	};
}
async function claimPersonalGitHubPublicationAsync(row, instanceId, authority) {
	const scope = mutationScope();
	const executionId = randomUUID();
	const identity = {
		row,
		instanceId,
		executionId
	};
	return {
		row: {
			...requireRow(await personalMutation(scope, {
				operation: "claim",
				...identity
			}, authority)),
			gateway_instance_id: instanceId,
			execution_id: executionId
		},
		ownsExecution() {
			scope.assertCurrent();
			return true;
		},
		...effects(async (transition) => {
			return requireRow(await personalMutation(scope, {
				...identity,
				...transition
			}, () => authority.assertCustody()));
		})
	};
}
async function claimRepositoryGitHubPublicationAsync(row, instanceId, authority) {
	const scope = mutationScope();
	const executionId = randomUUID();
	const identity = {
		row,
		instanceId,
		executionId
	};
	return {
		row: {
			...requireRow(await repositoryMutation(scope, {
				operation: "claim",
				...identity
			}, () => authority.assertCustody())),
			gateway_instance_id: instanceId,
			execution_id: executionId
		},
		ownsExecution() {
			scope.assertCurrent();
			return true;
		},
		...effects(async (transition) => {
			return requireRow(await repositoryMutation(scope, {
				...identity,
				...transition
			}, () => authority.assertCustody()));
		})
	};
}
async function claimGitHubPublicationExecutionAsync(requestId, instanceId, assertCustody) {
	return requireRow(await sharedMutation(mutationScope(), {
		operation: "claim",
		requestId,
		instanceId
	}, assertCustody));
}
function createGitHubPublicationExecutionStoreAsync(instanceId, authority) {
	const scope = mutationScope();
	return {
		async bindWorkspaceSnapshot(input) {
			return requireRow(await sharedMutation(scope, {
				operation: "bindWorkspaceSnapshot",
				input,
				instanceId
			}, authority));
		},
		async updatePublishingFacts(input) {
			return requireRow(await sharedMutation(scope, {
				operation: "updatePublishingFacts",
				input,
				instanceId
			}, () => authority.assertCustody()));
		},
		async complete(row, result) {
			return requireRow(await sharedMutation(scope, {
				operation: "complete",
				row,
				result,
				instanceId
			}, () => authority.assertCustody()));
		}
	};
}
async function bindRepositoryGitHubPublicationCheckpointAsync(row, checkpoint, authority) {
	return requireRow(await repositoryMutation(mutationScope(), {
		operation: "checkpoint",
		row,
		checkpoint
	}, authority));
}
async function failRepositoryGitHubPublicationPreparationAsync(row, nextAction, assertCustody) {
	return requireRow(await repositoryMutation(mutationScope(), {
		operation: "failPreparation",
		row,
		nextAction
	}, assertCustody));
}
async function failStaleRepositoryGitHubPublicationAsync(row, assertCustody) {
	await repositoryMutation(mutationScope(), {
		operation: "retire",
		row
	}, assertCustody);
}
async function deferRepositoryGitHubPublicationClaimsAsync(selection, assertCurrent) {
	await repositoryMutation(mutationScope(), {
		operation: "defer",
		selection
	}, assertCurrent);
}
async function deferGitHubPublicationRequestsAsync(selection, assertCurrent) {
	await sharedMutation(mutationScope(), {
		operation: "defer",
		selection
	}, assertCurrent);
}
async function requirePersonalGitHubPublicationConfirmationAsync(instanceId, assertCurrent) {
	const scope = mutationScope();
	await personalMutation(scope, {
		operation: "restart",
		instanceId
	}, assertCurrent ?? scope.assertCurrent);
}
async function runGitHubPublicationMaintenanceAsync(input, assertCurrent) {
	const scope = mutationScope();
	await scope.mutate({
		type: "githubPublications.maintenance",
		input: {
			...input,
			operationId: randomUUID()
		}
	}, assertCurrent ?? scope.assertCurrent, publish);
}
async function readPersonalGitHubPublicationAsync(owner, request) {
	const result = await readGitHubPublicationInWorker({
		type: "githubPublications.personalRead",
		input: {
			owner,
			request
		}
	});
	return result?.type === "githubPublications.personalRead" ? result.row : void 0;
}
async function listRepositoryGitHubPublicationsAsync(input = {}) {
	const result = await readGitHubPublicationInWorker({
		type: "githubPublications.repositoryList",
		input
	});
	return result?.type === "githubPublications.repositoryList" ? result.rows : [];
}
async function readRepositoryGitHubPublicationAsync(requestId) {
	const result = await readGitHubPublicationInWorker({
		type: "githubPublications.repositoryRead",
		input: { requestId }
	});
	return result?.type === "githubPublications.repositoryRead" ? result.row : void 0;
}
async function readRepositoryGitHubPublicationBranchAsync(input) {
	const result = await readGitHubPublicationInWorker({
		type: "githubPublications.branch",
		input
	});
	return result?.type === "githubPublications.branch" ? result.branch : {
		head: void 0,
		unsettled: false
	};
}
async function listUnreportedPersonalGitHubPublicationsAsync() {
	const result = await readGitHubPublicationInWorker({
		type: "githubPublications.unreported",
		input: void 0
	});
	return result?.type === "githubPublications.unreported" ? result.rows : [];
}
async function listGitHubPublicationsForClaimAsync(claim, options = {}) {
	const result = await readGitHubPublicationInWorker({
		type: "githubPublications.claimRequests",
		input: {
			claim,
			...options
		}
	});
	return result?.type === "githubPublications.claimRequests" ? result.rows : [];
}
async function listSharedGitHubPublicationsAsync(input = {}) {
	const result = await readGitHubPublicationInWorker({
		type: "githubPublications.sharedList",
		input
	});
	return result?.type === "githubPublications.sharedList" ? result.rows : [];
}
async function bindAcceptedGitHubPublicationClaimSnapshotAsync(input, assertCustody) {
	return requireRow(await sharedMutation(mutationScope(), {
		operation: "bindAcceptedSnapshot",
		input
	}, assertCustody));
}
async function readGitHubPublicationRequestAsync(input) {
	const result = await readGitHubPublicationInWorker({
		type: "githubPublications.sharedRead",
		input
	});
	return result?.type === "githubPublications.sharedRead" ? result.row : void 0;
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
async function reportGitHubPublicationTranscript(loadSessionRuntime, coordinator, params) {
	const lifecycleRevision = await coordinator.readReportLifecycleAsync(params);
	const memory = captureSessionActorStorageOwner(params, {
		assertCurrent() {},
		authorize() {}
	});
	const { target, entry } = memory ? {
		target: {
			agentId: memory.agentId,
			canonicalKey: params.sessionKey,
			storePath: memory.path
		},
		entry: readCapturedSessionActorEntry(memory, params.sessionKey)
	} : await (async () => {
		const runtime = await loadSessionRuntime();
		const target = await runtime.resolveGatewaySessionStoreTargetInWorker({
			cfg: readRuntimeConfig(),
			key: params.sessionKey,
			agentId: params.agentId
		});
		return {
			target,
			entry: runtime.resolveCanonicalSessionEntryFromStoreKeys(target.store, target.storeKeys)
		};
	})();
	if (entry && target.canonicalKey === params.sessionKey && (entry.sessionId !== params.sessionId || (entry.lifecycleRevision ?? null) !== lifecycleRevision)) {
		await coordinator.markReportedAsync(params.result.requestId);
		return;
	}
	if (entry?.sessionId !== params.sessionId || target.canonicalKey !== params.sessionKey) throw new Error("GitHub publication transcript owner changed");
	const appended = await appendSessionTranscriptReport({
		agentId: target.agentId,
		sessionId: params.sessionId,
		sessionKey: target.canonicalKey,
		storePath: target.storePath,
		expectedLifecycleRevision: lifecycleRevision ?? void 0
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
	await coordinator.markReportedAsync(params.result.requestId);
}
//#endregion
//#region src/gateway/github-repository-publication-workspace.ts
async function prepareRepositoryOwner(session) {
	const current = await prepareGitHubPublicationWorkspaceOwner(session);
	return Object.assign(current.currentRepository, { release: current.release });
}
async function prepareReceiptOwner(row) {
	const session = await prepareGitHubPublicationSession(row.session_key, { agentId: row.agent_id });
	try {
		return {
			...await getSessionRepositoryWorkspaceStore().prepare(row.workspace_id),
			session,
			release: () => session.release()
		};
	} catch (error) {
		session.release();
		throw error;
	}
}
function resolveReceiptOwner(row, prepared) {
	let loaded;
	try {
		loaded = prepared.session.readCurrent();
	} catch (error) {
		if (error instanceof GitHubPublicationSessionChangedError) return;
		throw error;
	}
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
async function captureCheckpoint(row, assertCurrent, use, authority) {
	try {
		var _usingCtx$17 = _usingCtx();
		let checkpointRef = row.checkpoint_ref;
		let assertSelected = assertCurrent;
		let releaseOwner;
		_usingCtx$17.u({ [Symbol.dispose]: () => releaseOwner?.() });
		if (!checkpointRef) {
			const preparedOwner = await prepareReceiptOwner(row);
			releaseOwner = preparedOwner.release;
			assertCurrent();
			const { workspace } = assertReceiptOwner(row, preparedOwner);
			checkpointRef = workspace.checkpointRef ?? null;
			if (!checkpointRef) throw new Error("GitHub publication is waiting for the first accepted repository checkpoint.");
			assertSelected = () => {
				assertCurrent();
				const { workspace: current } = assertReceiptOwner(row, preparedOwner);
				if (current.revision !== workspace.revision || current.checkpointRef !== workspace.checkpointRef) throw new Error("GitHub publication checkpoint changed during preparation.");
			};
		}
		const selectedAuthority = {
			...authority,
			assertAction: assertSelected
		};
		return await withSessionRepositoryCheckpoint({
			workspaceId: row.workspace_id,
			checkpointRef: checkpointRef ?? void 0,
			includePublication: true
		}, async (payload) => {
			assertSelected();
			if (row.checkpoint_ref && (!payload.publicationStagingRoot || !payload.publicationDigest || payload.publicationDigest !== row.checkpoint_digest)) throw new Error("GitHub publication accepted checkpoint is unavailable.");
			if (!payload.publicationStagingRoot || !payload.publicationDigest) return projectGitHubPublicationResult(await failRepositoryGitHubPublicationPreparationAsync(row, "Save a new checkpoint and request publication again. If capture remains unavailable, resolve any merge conflicts and review the repository's Git clean filters and transport configuration. Your session changes remain recoverable.", () => selectedAuthority.assertCustody()));
			const { snapshot } = await readGitHubRepositoryPublicationMetadata(payload.publicationStagingRoot, payload.publicationDigest);
			assertSelected();
			return await use({
				checkpoint_ref: checkpointRef,
				checkpoint_digest: payload.publicationDigest,
				source_head_commit: snapshot.baseCommit,
				source_index_tree: snapshot.baseTree,
				workspace_tree: snapshot.workspaceTree
			}, {
				snapshot,
				snapshotRoot: payload.publicationStagingRoot,
				authority: selectedAuthority
			});
		});
	} catch (_) {
		_usingCtx$17.e = _;
	} finally {
		_usingCtx$17.d();
	}
}
//#endregion
//#region src/gateway/github-personal-publication-status.ts
function isPendingPersonalPublication(receipt, executing) {
	const { row } = receipt;
	return receipt.kind === "repository" ? !terminalRepositoryGitHubPublication(row) && !executing : row.status === "needs_confirmation" || (row.status === "requested" || row.status === "publishing") && !executing;
}
async function preparePersonalRepositoryPublicationStatus(requestId) {
	const row = await readRepositoryGitHubPublicationAsync(requestId);
	if (!row || row.owner_profile_id === null || terminalRepositoryGitHubPublication(row)) return;
	const repository = await prepareReceiptOwner(row);
	return {
		requestId: row.request_id,
		workspaceId: row.workspace_id,
		repository,
		release: repository.release
	};
}
/** Source owners supply liveness; personal status never grants execution authority. */
function presentPersonalGitHubPublicationStatus(receipt, action, session, executing, connection, lifecycle) {
	const { row } = receipt;
	const pending = isPendingPersonalPublication(receipt, executing);
	let repositoryOwner;
	if (receipt.kind === "repository") {
		action.assertCurrent();
		if (row.owner_profile_id !== action.owner || row.session_key !== session.sessionKey || row.agent_id !== session.agentId) throw new Error("My GitHub publication was not found for this profile and session.");
		if (pending) {
			const { prepared } = receipt;
			if (!prepared || prepared.requestId !== row.request_id || prepared.workspaceId !== receipt.row.workspace_id) throw new Error("My GitHub publication source changed; refresh its status.");
			repositoryOwner = resolveReceiptOwner(receipt.row, prepared.repository);
		}
	}
	const sessionChanged = row.session_id !== session.sessionId || (receipt.kind === "repository" ? receipt.row.session_lifecycle_revision !== (session.lifecycleRevision ?? null) || !repositoryOwner : session.archivedAt != null || !lifecycle || lifecycle.lifecycle_revision !== (session.lifecycleRevision ?? null));
	const code = !pending ? null : sessionChanged ? "session_changed" : connection?.generation !== row.connection_generation || connection.account?.accountId !== row.identity_account_id || connection.account.login.toLowerCase() !== row.identity_login.toLowerCase() ? "identity_changed" : null;
	if (code) return {
		result: projectGitHubPublicationResult({
			...row,
			status: "failed",
			error_code: code,
			next_action: receipt.kind === "repository" ? "Review the original account and any recorded GitHub effects, then create a new publication for the current session." : code === "session_changed" ? "This request belongs to an earlier session incarnation. Review any recorded GitHub effects and create a new publication for the current session." : "The original My GitHub selection changed or is unavailable. Review any recorded GitHub effects, reconnect if needed, and create a new publication."
		}),
		confirmation: null
	};
	const result = projectGitHubPublicationResult(pending ? {
		...row,
		status: "needs_confirmation"
	} : row);
	if (!pending || receipt.kind === "repository" && (!row.connection_generation || !row.push_repository || !row.repository || !row.base_branch || !row.source_head_commit || !row.source_index_tree || !row.workspace_tree)) return {
		result,
		confirmation: null
	};
	return {
		result,
		confirmation: {
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
async function presentPersonalGitHubPublicationStatusAsync(receipt, action, session, executing) {
	const pending = isPendingPersonalPublication(receipt, executing);
	const [connection, lifecycle] = await Promise.all([pending ? personalGitHubStatusAsync(action) : null, pending && receipt.kind === "worktree" ? readGitHubPublicationSessionLifecycleInWorker({
		publicationKind: "personal",
		requestId: receipt.row.request_id
	}) : null]);
	action.assertCurrent();
	return presentPersonalGitHubPublicationStatus(receipt, action, session, executing, connection, lifecycle ?? null);
}
function createRepositoryPersonalPublicationStatus(instanceId, active) {
	return (row, action, session, prepared) => presentPersonalGitHubPublicationStatusAsync({
		kind: "repository",
		row,
		prepared
	}, action, session, row.execution_id !== null && row.gateway_instance_id === instanceId && active.get(row.request_id) === row.execution_id);
}
//#endregion
//#region src/gateway/github-publication-content.ts
async function prepareGitHubPublicationContent(params) {
	const { row } = params;
	const config = currentGitHubPublicationConfig();
	const prepared = await prepareGitCoauthorAttribution({
		agentId: row.agent_id,
		config,
		excludeAccountId: params.accountId,
		sessionKey: row.session_key,
		sessionId: row.session_id,
		storePath: params.storePath
	});
	const title = row.title?.trim() || `Publish ${row.branch}`;
	const trailers = prepared.attribution?.trailers ?? [];
	const credit = prepared.attribution?.logins.map((login) => `- @${login}`).join("\n");
	return {
		title,
		trailers,
		commitMessage: `${appendGitHubPublicationMessage(credit ? `${title}\n\nWorked on by:\n${credit}` : title, [...trailers, `OpenClaw-Publication: ${row.request_id}`])}\n`,
		assertAction: () => {
			params.assertCurrent();
			if (!prepared.isCurrent()) throw new GitHubPublicationCreditChangedError();
		},
		pullRequestBody() {
			const sessionUrl = resolveControlUiSessionUrl(config, {
				sessionKey: row.session_key,
				fallbackAgentId: row.agent_id,
				exactKey: true
			});
			const participants = credit ? `\n\n## Worked on by\n\n${credit}` : "";
			const footer = sessionUrl?.startsWith("https://") ? `\n\n---\n[View the OpenClaw team session](${sessionUrl})` : "";
			return `${params.description}${participants}\n\n<!-- openclaw-publication:${row.request_id} -->${footer}`;
		}
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
async function readGitHubPublicationApi(params, endpoint, args = []) {
	const identity = await params.refreshIdentity();
	params.assertCurrent();
	return {
		identity,
		raw: await requirePublicationCommand([...githubPublicationApiArgs(endpoint, "GET", identity.host ?? params.host ?? resolveGitHubHost()), ...args], { env: identity.env })
	};
}
async function loadGitHubPublicationPullRequests(params) {
	const marker = JSON.stringify(params.marker);
	const { identity, raw } = await readGitHubPublicationApi(params, `repos/${params.repository}/pulls`, [
		"-f",
		`head=${params.pushOwner}:${params.branch}`,
		"-f",
		`base=${params.baseBranch}`,
		"-f",
		"state=all",
		"--paginate",
		"--jq",
		`map({url: .html_url, userId: .user.id, state: .state, body: (if ((.body // "") | contains(${marker})) then ${marker} else "" end), headSha: .head.sha, headRef: .head.ref, baseRef: .base.ref}) | tojson`
	]);
	return {
		identity,
		candidates: parseGitHubPublicationPullRequests(raw)
	};
}
/** Parses the complete authenticated PR lookup; one malformed candidate invalidates the response. */
function parseGitHubPublicationPullRequests(raw) {
	let pages;
	try {
		pages = raw.split(/\r?\n/u).map((page) => JSON.parse(page));
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
		await params.recordObserved?.(found.url);
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
	const { raw } = await readGitHubPublicationApi(params, `repos/${params.pushRepository}/git/commits/${params.headCommit}`);
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
		const { raw: comparisonRaw } = await readGitHubPublicationApi(params, `repos/${params.pushRepository}/compare/${params.headCommit}...${head}?per_page=1`, ["--jq", "{sha: .merge_base_commit.sha}"]);
		const comparison = JSON.parse(comparisonRaw);
		if (!isRecord(comparison) || typeof comparison.sha !== "string" || !objectId.test(comparison.sha)) throw new Error("GitHub publication ancestry observation is invalid.");
		return comparison.sha === params.headCommit;
	};
	const { identity: lookupIdentity, candidates } = await loadGitHubPublicationPullRequests(params);
	let unrelated = false;
	for (const candidate of candidates) {
		if (candidate.userId !== lookupIdentity.account.accountId || candidate.headRef !== params.branch || candidate.baseRef !== params.baseBranch || !candidate.body.includes(params.marker) && !params.knownPullRequestUrls.includes(candidate.url) && !(params.pushOnly && candidate.state === "open")) continue;
		if (await includesCommit(candidate.headSha)) {
			await params.recordObserved?.(candidate.url);
			return candidate.url;
		}
		unrelated = true;
	}
	if (!params.pushOnly || unrelated) throw new Error("The original GitHub pull request has not been confirmed.");
	if (params.pushOnly === "observed") return;
	const { raw: refsRaw } = await readGitHubPublicationApi(params, `repos/${params.pushRepository}/git/matching-refs/heads/${encodeURIComponent(params.branch)}`);
	const refs = JSON.parse(refsRaw);
	if (!Array.isArray(refs)) throw new Error("GitHub publication branch observation is invalid.");
	const ref = refs.find((value) => isRecord(value) && value.ref === `refs/heads/${params.branch}`);
	if (!isRecord(ref) || !isRecord(ref.object) || typeof ref.object.sha !== "string" || !await includesCommit(ref.object.sha)) throw new Error("The original GitHub push has not been confirmed.");
	await params.recordPushObserved?.(params.headCommit);
}
//#endregion
//#region src/gateway/github-publication-recovery.ts
async function recoverGitHubPublicationWorkspace(row, worktree, run, assertCustody) {
	if (worktree.id !== row.worktree_id || worktree.removedAt !== void 0 || worktree.repoFingerprint !== row.repository_fingerprint || worktree.branch !== row.branch || !row.source_head_commit || !row.workspace_tree) return;
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
	const result = await executeExistingOpenClawStateRead({}, {
		type: "githubPublication.knownPullRequestUrls",
		input: {
			worktree_id: row.worktree_id,
			repository_fingerprint: row.repository_fingerprint,
			repository: row.repository,
			branch: row.branch,
			base_branch: row.base_branch,
			identity_account_id: row.identity_account_id,
			pull_request_url: row.pull_request_url
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
/** Lost requester authority permits receipt reconciliation, never a publication retry. */
async function reconcileGitHubPublication(params) {
	const row = params.initial;
	if (row.status === "published" || row.status === "failed") return projectGitHubPublicationResult(row);
	if (!row.repository || !row.base_branch || !row.head_commit || !row.source_head_commit || !row.workspace_tree) return;
	let worktreeOwner;
	let releaseWorktree;
	const { assertCurrent, refreshIdentity } = createGitHubPublicationExecutionIdentity({
		row,
		identity: params.identity,
		validateAuthority: params.validateCustody,
		assertWorkspace: () => {
			worktreeOwner.assertCurrent();
		}
	});
	let url;
	try {
		worktreeOwner = await readLocalGitHubPublicationWorktreeOwner(row);
		releaseWorktree = worktreeOwner.release;
		const { worktree } = worktreeOwner;
		assertCurrent();
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
	} finally {
		releaseWorktree?.();
	}
	if (!url) return;
	return projectGitHubPublicationResult(await params.complete(row, {
		requestId: row.request_id,
		status: "published",
		url,
		repository: row.repository,
		branch: row.branch,
		headCommit: row.head_commit
	}));
}
async function executeGitHubPublication(params) {
	try {
		var _usingCtx$16 = _usingCtx();
		const { initial } = params;
		if (initial.status === "published" || initial.status === "failed") return projectGitHubPublicationResult(initial);
		let pullRequestPending = false;
		let effectDispatched = false;
		let row = initial;
		let worktreeOwner;
		_usingCtx$16.u({ [Symbol.dispose]: () => worktreeOwner?.release() });
		const currentWorktree = () => {
			if (!worktreeOwner) throw new GitHubPublicationRecoveryPendingError("GitHub publication workspace authority could not be verified; retry recovery.");
			return worktreeOwner.assertCurrent();
		};
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
			worktreeOwner = await readLocalGitHubPublicationWorktreeOwner(initial);
			const { loaded, worktree } = worktreeOwner;
			await custodyCommands.step(() => assertSafeGitPublicationWorkspace(worktree.path, runPublicationCommand));
			await recoverGitHubPublicationWorkspace(initial, worktree, custodyCommands.require, assertCustody);
			if (params.prepareAuthority) await params.prepareAuthority();
			let sourceHeadCommit = row.source_head_commit;
			let sourceIndexTree = row.source_index_tree;
			let workspaceTree = row.workspace_tree;
			if (!sourceHeadCommit || !sourceIndexTree || !workspaceTree) {
				const snapshot = await captureGitHubPublicationWorkspaceSnapshot({
					cwd: worktree.path,
					assertCurrent: assertAuthority
				});
				row = await params.bindWorkspaceSnapshot({
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
					if (isAbortError(error)) throw error;
					throw new GitHubPublicationRecoveryPendingError("My GitHub workspace snapshot could not be verified; retry confirmation after local Git operations finish.", { cause: error });
				}
				if (snapshot.workspaceTree !== workspaceTree || snapshot.sourceIndexTree !== sourceIndexTree && snapshot.sourceIndexTree !== workspaceTree) throw new GitHubPublicationWorkspaceChangedError("GitHub publication workspace changed after its accepted snapshot.");
			}
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
			const [initialHead, currentTree, parents, ...message] = (await command([
				"git",
				"show",
				"-s",
				"--no-show-signature",
				"--format=%H%n%T%n%P%n%B",
				"HEAD"
			], { cwd: worktree.path })).split("\n");
			let headCommit = initialHead;
			const currentMessage = message.join("\n").trim();
			const findPullRequest = () => findGitHubPublicationPullRequest({
				repository,
				pushOwner,
				branch,
				baseBranch,
				host: githubHost,
				headCommit,
				marker: pullRequestMarker,
				refreshIdentity,
				recordObserved: async (url) => {
					await params.recordEffect?.("pull_request", { url });
					pullRequestPending = false;
				},
				assertCurrent: assertAuthority
			});
			const markerPresent = currentMessage.split(/\r?\n/u).includes(marker);
			if (markerPresent) {
				if (parents.split(" ", 1)[0] !== sourceHeadCommit || currentTree !== workspaceTree) throw new GitHubPublicationWorkspaceChangedError("GitHub publication workspace changed after its accepted snapshot.");
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
				const ancestry = await run([
					"git",
					"merge-base",
					"--is-ancestor",
					remoteHead,
					headCommit
				], { cwd: worktree.path });
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
			row = await params.updatePublishingFacts({
				row,
				repository,
				branch,
				baseBranch,
				sourceHeadCommit,
				workspaceTree,
				headCommit
			});
			const content = await prepareGitHubPublicationContent({
				row,
				storePath: loaded.storePath,
				accountId: identity.account.accountId,
				assertCurrent: assertPublicationAction,
				description: (row.body?.trim() || "Published by the Gateway after authoritative workspace reconciliation.").replace(/(?:\s*---\s*\n\[View the OpenClaw team session\]\([^\r\n)]*\)\s*)+$/u, "").replace(/(?:^|\n\n)## Worked on by\n\n(?:- @[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})\n)*- @[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})(?=\n\n|$)/gu, "").trimEnd()
			});
			const { assertAction } = content;
			const completePublished = async (url, publishedHead) => projectGitHubPublicationResult(await params.complete(row, {
				requestId: row.request_id,
				status: "published",
				url,
				repository,
				branch,
				headCommit: publishedHead
			}));
			assertAction();
			if (markerPresent && remoteHead !== headCommit && !hasGitHubPublicationMessageFooter(currentMessage, content.trailers, marker)) throw new GitHubPublicationCreditChangedError();
			const messageLines = currentMessage.split(/\r?\n/u);
			if (existingPullRequest && remoteHead === headCommit && currentTree === workspaceTree && sourceIndexTree === workspaceTree && messageLines.some((line) => line.startsWith(`${PUBLICATION_MARKER}: `))) {
				const trailers = await readGitHubPublicationCoauthorTrailers({
					cwd: worktree.path,
					headCommit,
					command
				});
				assertAction();
				if (content.trailers.every((trailer) => trailers.includes(trailer))) return await completePublished(existingPullRequest, headCommit);
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
					input: content.commitMessage,
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
			row = await params.updatePublishingFacts({
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
				await params.recordEffect?.("push");
				effectDispatched = true;
				const pushed = await runPublicationCommand(pushArgs, {
					cwd: worktree.path,
					env: transportEnv,
					beforeRun: assertAction
				});
				await params.recordEffect?.("push", pushed.code === 0 ? { headCommit } : {});
				assertAuthority();
				identity = await refreshIdentity();
				transportEnv = {
					...identity.env,
					GIT_CONFIG_GLOBAL: gitNullConfigPath(),
					GIT_CONFIG_SYSTEM: gitNullConfigPath()
				};
				remoteHead = await step(observeRemoteHead);
				if (remoteHead !== headCommit) throw new Error(pushed.code === 0 ? "GitHub push verification failed." : "GitHub push was rejected.");
				await params.recordEffect?.("push", { headCommit });
			}
			let pullRequestUrl = await findPullRequest();
			if (!pullRequestUrl) {
				const body = content.pullRequestBody();
				identity = await refreshIdentity();
				assertAction();
				await params.recordEffect?.("pull_request");
				pullRequestPending = true;
				effectDispatched = true;
				const created = await runPublicationCommand(githubPublicationApiArgs(`repos/${repository}/pulls`, "POST", githubHost), {
					env: identity.env,
					beforeRun: assertAction,
					input: JSON.stringify({
						title: content.title,
						body,
						head: `${pushOwner}:${branch}`,
						base: baseBranch,
						draft: true
					})
				});
				if (created.code === 0) {
					let value;
					try {
						value = JSON.parse(created.stdout.toString("utf8"));
					} catch (error) {
						throw new Error("GitHub pull request creation returned invalid JSON", { cause: error });
					}
					if (!isRecord(value)) throw new Error("GitHub pull request creation returned an invalid response");
					pullRequestUrl = readNonBlankString(value.html_url);
				}
				await params.recordEffect?.("pull_request", pullRequestUrl ? { url: pullRequestUrl } : {});
				if (!pullRequestUrl) {
					assertAuthority();
					pullRequestUrl = await findPullRequest();
				}
			}
			if (!pullRequestUrl) throw new Error("GitHub pull request creation was rejected.");
			if (pullRequestPending) await params.recordEffect?.("pull_request", { url: pullRequestUrl });
			return await completePublished(pullRequestUrl, headCommit);
		} catch (error) {
			if (isAbortError(error) || error instanceof GitHubPublicationRequesterUnavailableError || error instanceof GatewayOperatorAccessUnavailableError) throw error;
			if (error instanceof GitHubPublicationRecoveryPendingError) throw error;
			if (error instanceof GitHubPublicationAuthorityLostError && params.defer) return projectGitHubPublicationResult(await params.defer(initial));
			if (params.interrupt && (effectDispatched || initial.last_effect) && !(error instanceof GitHubPublicationKnownFailure)) {
				assertAuthority();
				return projectGitHubPublicationResult(await params.interrupt());
			}
			if (!params.interrupt && (effectDispatched || initial.head_commit) && !(error instanceof GitHubPublicationKnownFailure)) throw new GitHubPublicationRecoveryPendingError("GitHub publication is unconfirmed; retry recovery before requesting another publication. Recorded effects are retained.", { cause: error });
			const failure = resolveGitHubPublicationFailure(error);
			const result = projectGitHubPublicationResult(await params.complete(initial, {
				requestId: initial.request_id,
				status: "failed",
				code: failure.code,
				message: "GitHub publication failed.",
				nextAction: failure.nextAction
			}));
			if (error instanceof SessionMutationAuthorizationChangedError) throw error;
			return result;
		} finally {
			worktreeOwner?.release();
		}
	} catch (_) {
		_usingCtx$16.e = _;
	} finally {
		_usingCtx$16.d();
	}
}
//#endregion
//#region src/gateway/github-publication-request-async.ts
async function insert(input, source) {
	const binding = bindGitHubPublicationSource(source);
	const scope = createGitHubPublicationWorkerScope(binding.context);
	try {
		return await scope.mutate({
			type: "githubPublications.insert",
			input: {
				...input,
				operation: "insert",
				operationId: randomUUID(),
				source: binding.predicate
			}
		}, scope.assertCurrent, (receipt) => {
			for (const change of receipt.changes) emitSessionLifecycleEvent({
				...change,
				reason: "github-publication"
			});
		}, source);
	} finally {
		await scope.close();
		await source.release();
	}
}
/** Receipt and lifecycle binding share the source-fenced destination transaction. */
async function insertGitHubPublicationRequestAsync(input, source) {
	const receipt = await insert({
		kind: "shared",
		input
	}, source);
	if (receipt.kind !== "shared" || !receipt.rows[0]) throw new Error("GitHub publication request receipt is unavailable.");
	return receipt.rows[0];
}
async function insertPersonalGitHubPublicationAsync(row, lifecycleRevision, source) {
	const receipt = await insert({
		kind: "personal",
		row,
		lifecycleRevision
	}, source);
	if (receipt.kind !== "personal" || !receipt.rows[0]) throw new Error("Personal GitHub publication request receipt is unavailable.");
	return receipt.rows[0];
}
async function insertRepositoryGitHubPublicationAsync(row, source) {
	const receipt = await insert({
		kind: "repository",
		row
	}, source);
	if (receipt.kind !== "repository" || !receipt.rows[0]) throw new Error("Repository GitHub publication request receipt is unavailable.");
	return receipt.rows[0];
}
//#endregion
//#region src/gateway/github-personal-publication.ts
function assertPersonalGitHubPublicationReplay(existing, input, selected) {
	if (existing.connection_generation !== selected.generation || existing.identity_account_id !== selected.account.accountId || existing.identity_login.toLowerCase() !== selected.account.login.toLowerCase() || existing.title !== (input.title ?? null) || existing.body !== (input.body ?? null)) throw new Error("My GitHub publication idempotency key was reused with a different selection.");
}
async function bindPersonalGitHubPublicationSelection(action, selected, preparation) {
	const rejectRevokedConnection = (error) => {
		if (!(error instanceof UserGitHubConnectionAuthorityChangedError)) throw error;
		rejectGitHubPublicationSelection("My GitHub identity changed; review the current account before publishing again.", preparation);
	};
	let prepared = await prepareUserGitHubConnection(action.owner).catch(rejectRevokedConnection);
	const assertCurrent = () => {
		action.assertCurrent();
		let record;
		try {
			record = prepared.read();
		} catch (error) {
			rejectRevokedConnection(error);
		}
		if (record?.generation !== selected.generation || record.selection.kind !== "connected" || record.selection.accountId !== selected.account.accountId || record.selection.login.toLowerCase() !== selected.account.login.toLowerCase()) rejectGitHubPublicationSelection("My GitHub identity changed; review the current account before publishing again.", preparation);
		return record.selection;
	};
	const initial = assertCurrent();
	return {
		owner: action.owner,
		profileId: initial.profileId,
		accountId: initial.accountId,
		assertCurrent,
		async refresh() {
			prepared = await prepareUserGitHubConnection(action.owner).catch(rejectRevokedConnection);
			assertCurrent();
		}
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
		await bound.refresh();
	} catch {
		await bound.refresh();
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
function createPersonalGitHubPublicationCoordinator(placements, assertRuntimeCurrent = captureOpenClawStateWorkerContext().admission.assertCurrent, runtimeSignal) {
	const prepareSource = async (action, selector) => {
		const source = await action.prepareSource(selector);
		try {
			assertRuntimeCurrent();
			return runtimeSignal ? bindGitHubPublicationSourceLifetime(source, runtimeSignal) : source;
		} catch (error) {
			await source.release();
			throw error;
		}
	};
	const instanceId = placements.workspaceResultInstanceId();
	const active = /* @__PURE__ */ new Map();
	const status = async (row, action, session) => presentPersonalGitHubPublicationStatusAsync({
		kind: "worktree",
		row
	}, action, session, row.gateway_instance_id === instanceId && row.execution_id !== null && active.get(row.request_id) === row.execution_id);
	const withWorkspace = async (action, run) => {
		action.assertCurrent();
		return await placements.withLocalWorkspaceReservation(action, async (assertReservation) => {
			try {
				var _usingCtx$15 = _usingCtx();
				const worktreeOwner = await readGitHubPublicationWorktreeOwner(action);
				_usingCtx$15.u({ [Symbol.dispose]: () => worktreeOwner.release() });
				const { worktree } = worktreeOwner;
				action.assertCurrent();
				assertReservation();
				const lease = await acquireWorktreeRunLease(worktree.id, { exclusive: true });
				const assertCustody = () => {
					assertReservation();
					const current = worktreeOwner.assertCurrent();
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
						assertCustody,
						worktree
					});
				} finally {
					await lease.release();
				}
			} catch (_) {
				_usingCtx$15.e = _;
			} finally {
				_usingCtx$15.d();
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
		const bound = await bindPersonalGitHubPublicationSelection(action, selected);
		const assertCurrent = () => {
			bound.assertCurrent();
			workspace.assertCurrent();
			if (bound.profileId !== row.identity_profile_id || action.sessionId !== row.session_id || action.owner !== row.owner_profile_id) throw new Error("My GitHub publication owner changed.");
		};
		assertCurrent();
		const execution = await claimPersonalGitHubPublicationAsync(row, instanceId, {
			assertAction: assertCurrent,
			assertCustody: assertRuntimeCurrent,
			prepareSource: () => prepareSource(action, {
				agentId: row.agent_id,
				sessionKey: row.session_key,
				sessionId: row.session_id,
				lifecycleRevision: action.lifecycleRevision,
				worktreeId: row.worktree_id,
				personalOwnerProfileId: action.owner
			})
		});
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
				await execution.interrupt();
			} catch {}
			throw error;
		} finally {
			active.delete(row.request_id);
		}
	};
	const methods = {
		async requestPersonalForSession(input, action) {
			if (input.selection?.source !== "personal" || input.idempotencyKey.length > 128) throw new Error("My GitHub publication requires an explicit bounded account selection.");
			const selected = input.selection;
			action.assertCurrent();
			const request = {
				sessionId: action.sessionId,
				idempotencyKey: input.idempotencyKey
			};
			const existing = await readPersonalGitHubPublicationAsync(action.owner, request);
			action.assertCurrent();
			if (existing) {
				assertPersonalGitHubPublicationReplay(existing, input, selected);
				action.assertCurrent();
				return (await status(existing, action, action)).result;
			}
			const bound = await bindPersonalGitHubPublicationSelection(action, selected, {
				idempotencyKey: input.idempotencyKey,
				hasRequest: () => Boolean(existing)
			});
			return await withWorkspace(action, async (workspace) => {
				const assertCurrent = () => {
					workspace.assertCurrent();
					bound.assertCurrent();
				};
				const { worktree } = workspace;
				assertCurrent();
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
				const source = await prepareSource(action, {
					agentId: action.agentId,
					sessionKey: action.sessionKey,
					sessionId: action.sessionId,
					lifecycleRevision: action.lifecycleRevision,
					personalOwnerProfileId: action.owner,
					worktreeId: worktree.id
				});
				let accepted;
				try {
					assertCurrent();
					accepted = await insertPersonalGitHubPublicationAsync(row, action.lifecycleRevision, source);
				} finally {
					await source.release();
				}
				return await execute(action, accepted, workspace);
			});
		},
		async personalStatusAsync(action, session, requestId) {
			action.assertCurrent();
			const row = await readPersonalGitHubPublicationAsync(action.owner, { requestId });
			action.assertCurrent();
			if (!row || row.session_key !== session.sessionKey || row.agent_id !== session.agentId) throw new Error("My GitHub publication was not found for this profile and session.");
			return status(row, action, session);
		},
		async personalPending(action, session) {
			action.assertCurrent();
			const row = await readPersonalGitHubPublicationAsync(action.owner, {
				sessionKey: session.sessionKey,
				agentId: session.agentId
			});
			action.assertCurrent();
			return row ? status(row, action, session) : null;
		},
		async confirmPersonal(input, action) {
			action.assertCurrent();
			const request = { requestId: input.requestId };
			const lifecycleRequest = {
				publicationKind: "personal",
				requestId: input.requestId
			};
			const [row, lifecycle] = await Promise.all([readPersonalGitHubPublicationAsync(action.owner, request), readGitHubPublicationSessionLifecycleInWorker(lifecycleRequest)]);
			action.assertCurrent();
			if (!row || row.session_id !== action.sessionId || !(row.status === "published" || row.status === "failed") && (!lifecycle || lifecycle.lifecycle_revision !== action.lifecycleRevision) || row.request_digest !== input.requestDigest || row.connection_generation !== input.generation || row.identity_account_id !== input.account.accountId || row.identity_login.toLowerCase() !== input.account.login.toLowerCase()) throw new Error("My GitHub confirmation no longer matches the original request.");
			if (row.status === "published" || row.status === "failed") return projectGitHubPublicationResult(row);
			if (active.has(row.request_id)) throw new Error("My GitHub publication is still running; wait for its result.");
			await bindPersonalGitHubPublicationSelection(action, input);
			return await withWorkspace(action, async (workspace) => await execute(action, row, workspace));
		}
	};
	return {
		...methods,
		/** @deprecated Await personalStatusAsync; final compatibility day: 2026-12-31; removal in the first January 2027 stable release. */
		personalStatus(_action, _session, _requestId) {
			warnPluginSdkDeprecation({
				family: "github-publication",
				compatibility: "This method no longer performs publication work; use its replacement.",
				method: "personalStatus",
				replacement: "personalStatusAsync"
			});
			throw new Error("GitHub publication requires awaiting personalStatusAsync.");
		},
		/** @deprecated Use requestPersonalForSessionV2; final compatibility day: 2026-12-31; removal in the first January 2027 stable release. */
		async requestPersonalForSession(_input, _action) {
			warnPluginSdkDeprecation({
				family: "github-publication",
				compatibility: "This method no longer performs publication work; use its replacement.",
				method: "requestPersonalForSession",
				replacement: "requestPersonalForSessionV2"
			});
			throw new Error("GitHub publication requires requestPersonalForSessionV2 with a host-prepared V2 action.");
		},
		/** @deprecated Use confirmPersonalV2; final compatibility day: 2026-12-31; removal in the first January 2027 stable release. */
		async confirmPersonal(_input, _action) {
			warnPluginSdkDeprecation({
				family: "github-publication",
				compatibility: "This method no longer performs publication work; use its replacement.",
				method: "confirmPersonal",
				replacement: "confirmPersonalV2"
			});
			throw new Error("GitHub publication requires confirmPersonalV2 with a host-prepared V2 action.");
		},
		requestPersonalForSessionV2(input, action) {
			if (action.version !== 2) throw new GitHubPublicationRequesterUnavailableError();
			return methods.requestPersonalForSession(input, action);
		},
		confirmPersonalV2(input, action) {
			if (action.version !== 2) throw new GitHubPublicationRequesterUnavailableError();
			return methods.confirmPersonal(input, action);
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
async function readSharedGitHubPublication(session, selector) {
	try {
		var _usingCtx$14 = _usingCtx();
		const capturedSelector = { ...selector };
		let workspaceIndependent = false;
		const memory = captureSessionEntryMetadataRead(session, () => {});
		const context = memory ? captureOpenClawStateReadWorkerContext() : void 0;
		const observe = async (entry) => {
			const result = await withArtifactPreservingStateReads(() => executeExistingOpenClawStateRead(context ? {
				path: context.admission.databasePath,
				env: context.environment
			} : {}, {
				type: "githubPublication.sharedObservation",
				input: {
					session,
					selector: capturedSelector,
					entry: workspaceSelection(entry)
				}
			}, {
				current: true,
				preferIndependentWarmRead: true,
				...context && { context }
			}));
			if (result && (!result.ok || result.type !== "githubPublication.sharedObservation")) throw new Error("Shared GitHub publication observation is unavailable.");
			const row = result?.row;
			workspaceIndependent = "requestId" in capturedSelector && (!row || row.status === "published" || row.status === "failed");
			return row;
		};
		if (memory) {
			const readCurrent = () => {
				const entry = memory.readCurrent();
				if (!entry || entry.sessionId !== session.sessionId || session.lifecycleRevision !== void 0 && (entry.lifecycleRevision ?? null) !== session.lifecycleRevision) throw new GitHubPublicationSessionChangedError();
				return entry;
			};
			const entry = readCurrent();
			const row = await observe(entry);
			context.admission.assertCurrent();
			const current = readCurrent();
			if (!workspaceIndependent && !isDeepStrictEqual(workspaceSelection(entry), workspaceSelection(current))) throw new GitHubPublicationSessionChangedError();
			return row;
		}
		const selected = _usingCtx$14.u(await prepareGitHubPublicationSession(session.sessionKey, {
			agentId: session.agentId,
			fields: [
				"sessionId",
				"lifecycleRevision",
				"owner",
				"createdActor",
				"visibility",
				"incognito"
			]
		}));
		const entry = selected.loaded.entry;
		if (!entry || selected.loaded.agentId !== session.agentId || selected.loaded.canonicalKey !== session.sessionKey || entry.sessionId !== session.sessionId || session.lifecycleRevision !== void 0 && (entry.lifecycleRevision ?? null) !== session.lifecycleRevision) throw new GitHubPublicationSessionChangedError();
		const row = await observe(entry);
		const current = selected.readCurrent().entry;
		if (!current || current.sessionId !== entry.sessionId || current.lifecycleRevision !== entry.lifecycleRevision || !workspaceIndependent && !isDeepStrictEqual(workspaceSelection(entry), workspaceSelection(current))) throw new GitHubPublicationSessionChangedError();
		return row;
	} catch (_) {
		_usingCtx$14.e = _;
	} finally {
		_usingCtx$14.d();
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
function createGitHubPublicationCoordinatorMethods(params) {
	const { sameWorktree, processRow } = params;
	const requestForSession = async (input) => {
		try {
			var _usingCtx$13 = _usingCtx();
			if (input.selection?.source === "personal") throw new Error("My GitHub publication requires direct personal authorization.");
			const expected = input.selection?.expected;
			const assertRequester = input.requester.assertCurrent;
			if (!input.sessionKey) throw new Error("GitHub publication requires an authoritative session.");
			assertRequester();
			const sessionId = _usingCtx$13.u(await prepareGitHubPublicationSession(input.sessionKey, {
				cfg: params.getCommittedRuntimeConfig(),
				agentId: input.agentId,
				assertCurrent: params.assertCurrent
			})).loaded.entry?.sessionId;
			if (!sessionId) throw new Error("GitHub publication session changed.");
			const initialAuthority = await readGitHubPublicationWorktreeOwner({
				sessionId,
				sessionKey: input.sessionKey,
				agentId: input.agentId
			});
			_usingCtx$13.u({ [Symbol.dispose]: () => initialAuthority.release() });
			const loaded = initialAuthority.loaded;
			const lifecycleRevision = loaded.entry?.lifecycleRevision ?? null;
			const session = {
				sessionId,
				sessionKey: loaded.canonicalKey,
				agentId: input.agentId,
				lifecycleRevision
			};
			const placement = await params.placements.getAsync(sessionId);
			assertRequester();
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
				initialAuthority.assertCurrent();
				const current = params.placements.get(sessionId);
				if (!(capturePlacement ? current?.state === capturePlacement.state && current.generation === capturePlacement.generation && current.updatedAtMs === capturePlacement.updatedAtMs && !current.turnClaim : current === void 0)) throw new Error("GitHub publication session authority changed during snapshot.");
			};
			const claim = placement ? exactClaimForPlacement(placement) : void 0;
			if (claim && input.expectedRunId && claim.runId === input.expectedRunId) {
				const claimRequest = {
					expectedPublisher: expected,
					claim,
					sessionKey: loaded.canonicalKey,
					agentId: input.agentId,
					idempotencyKey: input.idempotencyKey,
					requester: input.requester,
					...input.title ? { title: input.title } : {},
					...input.body ? { body: input.body } : {}
				};
				const accepted = await params.requestForClaimV2(claimRequest);
				assertRequester();
				if (placement?.state !== "local") return accepted;
				const row = await readGitHubPublicationRequestInWorker(accepted.requestId);
				if (!row) throw new Error("GitHub publication request disappeared.");
				return await processRow(row, () => params.placements.validateTurnClaim(claim), input.requester.assertInvocationCurrent, input.requester.signal);
			}
			if (claim && placement?.state === "local") throw new Error(input.expectedRunId ? "GitHub publication run identity changed." : "GitHub publication cannot join another active session turn.");
			const deferred = placement !== void 0 && placement.state !== "local";
			const worktreeOwner = initialAuthority;
			const { worktree } = worktreeOwner;
			assertRequester();
			const requestDigest = digestGitHubPublicationRequest({
				sessionId,
				idempotencyKey: input.idempotencyKey,
				title: input.title,
				body: input.body
			});
			const existing = await readGitHubPublicationRequestAsync({
				sessionId,
				idempotencyKey: input.idempotencyKey
			});
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
				if (!lifecycle || lifecycle.lifecycle_revision !== lifecycleRevision) return await processRow(existing, validateLocalExecution, input.requester.assertInvocationCurrent, input.requester.signal);
			}
			assertRequester();
			const identity = await prepareCurrentGitHubPublicationIdentity(input.agentId);
			assertRequester();
			assertExpectedSharedGitHubPublisher(expected, {
				source: identity.source,
				...identity.account
			}, existing ? void 0 : {
				idempotencyKey: input.idempotencyKey,
				hasRequest: () => Boolean(existing)
			});
			const insertSessionRequest = async (snapshot) => {
				const now = Date.now();
				const requestId = randomUUID();
				assertRequester();
				{
					worktreeOwner.assertCurrent();
					const source = await input.requester.prepareSource({
						agentId: session.agentId,
						sessionKey: session.sessionKey,
						sessionId,
						lifecycleRevision,
						worktreeId: worktree.id
					});
					try {
						assertRequester();
						worktreeOwner.assertCurrent();
						if (snapshot) assertCaptureAuthority();
						bindGitHubPublicationSourceLifetime(source, params.signal);
						return await insertGitHubPublicationRequestAsync({
							request: {
								sessionKey: loaded.canonicalKey,
								agentId: input.agentId,
								idempotencyKey: input.idempotencyKey,
								title: input.title,
								body: input.body
							},
							requestId,
							requestDigest,
							now,
							identity: {
								source: identity.source,
								profileId: identity.profileId,
								account: identity.account
							},
							worktree: {
								id: worktree.id,
								repoFingerprint: worktree.repoFingerprint,
								branch: worktree.branch
							},
							sessionId,
							lifecycleRevision,
							requester: input.requester.snapshot,
							snapshot
						}, source);
					} finally {
						await source.release();
					}
				}
			};
			if (deferred) {
				worktreeOwner.assertCurrent();
				return projectGitHubPublicationResult(await insertSessionRequest());
			}
			const snapshot = existing?.source_head_commit && existing.source_index_tree && existing.workspace_tree ? {
				sourceHeadCommit: existing.source_head_commit,
				sourceIndexTree: existing.source_index_tree,
				workspaceTree: existing.workspace_tree
			} : await captureGitHubPublicationWorkspaceSnapshot({
				cwd: worktree.path,
				assertCurrent: assertCaptureAuthority
			});
			assertCaptureAuthority();
			worktreeOwner.assertCurrent();
			const row = await insertSessionRequest(snapshot);
			return await processRow(row, validateLocalExecution, input.requester.assertInvocationCurrent, input.requester.signal);
		} catch (_) {
			_usingCtx$13.e = _;
		} finally {
			_usingCtx$13.d();
		}
	};
	return {
		requestForSessionV2: (input) => {
			if (!isGitHubPublicationRequesterV2(input.requester)) throw new Error("GitHub publication requires a host-prepared V2 requester.");
			params.assertCurrent();
			return requestForSession(input);
		},
		async resumeSessionRequests() {
			const rows = await listSharedGitHubPublicationsAsync({
				claimNull: true,
				pending: true
			});
			params.assertCurrent();
			const pending = new Set((await params.placements.listPendingWorkspaceResultsAsync()).map((result) => result.sessionId));
			const failures = [];
			const blockedWorktrees = /* @__PURE__ */ new Set();
			const placements = await params.placements.getManyAsync(rows.map((row) => row.session_id));
			for (const row of rows) {
				if (blockedWorktrees.has(row.worktree_id) || pending.has(row.session_id) || placements.get(row.session_id)?.turnClaim) continue;
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
			const rows = await listGitHubPublicationsForClaimAsync(claim);
			await deferGitHubPublicationRequestsAsync({
				kind: "claimMissingSnapshot",
				claim
			}, params.assertCurrent);
			const results = [];
			for (const row of rows) {
				if (!row.source_head_commit || !row.source_index_tree || !row.workspace_tree) continue;
				await params.placements.prepareWorkspaceResultClaim(claim);
				results.push(await processRow(row, () => params.placements.validateWorkspaceResultClaim(claim)));
			}
			const deferred = await listSharedGitHubPublicationsAsync({
				sessionId: claim.sessionId,
				claimNull: true,
				status: "requested"
			});
			for (const row of deferred) {
				await params.placements.prepareWorkspaceResultClaim(claim);
				results.push(await processRow(row, () => params.placements.validateWorkspaceResultClaim(claim)));
			}
			return results;
		},
		async deferOrphanedRequestsAsync() {
			await deferGitHubPublicationRequestsAsync({ kind: "orphaned" }, params.assertCurrent);
		},
		async listUnreportedResultsAsync() {
			const personal = await listUnreportedPersonalGitHubPublicationsAsync();
			const shared = await listSharedGitHubPublicationsAsync({
				pending: false,
				unreported: true
			});
			params.assertCurrent();
			return [...personal, ...shared.map((row) => ({
				sessionId: row.session_id,
				sessionKey: row.session_key,
				agentId: row.agent_id,
				result: projectGitHubPublicationResult(row)
			}))];
		},
		async sharedStatus(session, requestId) {
			const row = await readSharedGitHubPublication(session, { requestId });
			return row ? {
				result: projectGitHubPublicationResult(row),
				confirmation: null
			} : void 0;
		},
		async latestShared(session, idempotencyKey, isSuperseded) {
			const row = await readSharedGitHubPublication(session, { idempotencyKey });
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
		},
		async readAsync(requestId) {
			const row = await readGitHubPublicationRequestAsync({ requestId });
			return row ? projectGitHubPublicationResult(row) : void 0;
		}
	};
}
//#endregion
//#region src/gateway/github-publication-workspace.ts
function sameWorktree(row, worktree) {
	return row.worktree_id === worktree.id && row.repository_fingerprint === worktree.repoFingerprint && row.branch === worktree.branch;
}
async function prepareGitHubPublicationClaimWorkspace(params, claim) {
	try {
		var _usingCtx$12 = _usingCtx();
		await params.placements.closeWorkerTurnToolAdmission(claim);
		const rows = await listGitHubPublicationsForClaimAsync(claim, { pendingOnly: true });
		if (rows.length === 0) return;
		await params.placements.prepareWorkspaceResultClaim(claim);
		const first = rows[0];
		const worktreeOwner = _usingCtx$12.u(await readGitHubPublicationWorktreeOwner({
			sessionId: first.session_id,
			sessionKey: first.session_key,
			agentId: first.agent_id,
			expected: {
				worktreeId: first.worktree_id,
				repositoryFingerprint: first.repository_fingerprint,
				branch: first.branch
			}
		}));
		const { worktree } = worktreeOwner;
		if (!params.placements.validateWorkspaceResultClaim(claim)) throw new Error("GitHub publication lost its workspace result claim before snapshot.");
		for (const row of rows) if (!sameWorktree(row, worktree)) throw new Error("GitHub publication worktree changed before accepted snapshot.");
		const bound = rows.find((row) => row.source_head_commit && row.source_index_tree && row.workspace_tree);
		if (bound) {
			for (const row of rows) if ((row.source_head_commit || row.source_index_tree || row.workspace_tree) && (row.source_head_commit !== bound.source_head_commit || row.source_index_tree !== bound.source_index_tree || row.workspace_tree !== bound.workspace_tree)) throw new Error("GitHub publication accepted workspace snapshot changed.");
			if (rows.every((row) => row.source_head_commit && row.source_index_tree && row.workspace_tree)) return;
		}
		const snapshot = await captureGitHubPublicationWorkspaceSnapshot({
			cwd: worktree.path,
			assertCurrent: () => {
				worktreeOwner.assertCurrent();
				if (!params.placements.validateWorkspaceResultClaim(claim)) throw new Error("GitHub publication lost its workspace result claim during snapshot.");
			}
		});
		for (const row of rows) await bindAcceptedGitHubPublicationClaimSnapshotAsync({
			row,
			claim,
			...snapshot
		}, () => {
			params.assertCurrent();
			if (!params.placements.validateWorkspaceResultClaim(claim)) throw new Error("GitHub publication lost its workspace result claim.");
		});
	} catch (_) {
		_usingCtx$12.e = _;
	} finally {
		_usingCtx$12.d();
	}
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
			if (headCommit && observed === headCommit) await execution.recordEffect("push", { headCommit });
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
		const content = await prepareGitHubPublicationContent({
			row,
			storePath: params.storePath,
			accountId: identity.account.accountId,
			assertCurrent: assertPublicationAction,
			description: row.body?.trim() || "Published by the Gateway from the accepted repository checkpoint."
		});
		const { assertAction } = content;
		assertAction();
		if (headCommit && remoteHead !== headCommit && !hasGitHubPublicationMessageFooter(preparedCommitMessage ?? "", content.trailers, "OpenClaw-Publication: " + row.request_id)) throw new GitHubPublicationCreditChangedError();
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
				message: content.commitMessage
			}));
			await execution.updateHead(headCommit);
		}
		if (remoteHead !== headCommit) {
			identity = await refreshIdentity();
			assertAction();
			await execution.recordEffect("push");
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
			await execution.recordEffect("push", succeeded ? { headCommit } : {});
			assertCurrent();
			remoteHead = await observeHead();
			if (remoteHead !== headCommit) throw new Error("GitHub push verification failed.");
		}
		let url = await findPullRequest();
		if (!url) {
			const body = content.pullRequestBody();
			identity = await refreshIdentity();
			assertAction();
			await execution.recordEffect("pull_request");
			dispatched = true;
			const created = await runPublicationCommand(githubPublicationApiArgs(`repos/${repository}/pulls`, "POST", identity.host ?? resolveGitHubHost()), {
				env: identity.env,
				beforeRun: assertAction,
				input: JSON.stringify({
					title: content.title,
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
			await execution.recordEffect("pull_request", url ? { url } : {});
			if (!url) {
				assertCurrent();
				url = await findPullRequest();
			}
		}
		if (!url) throw new Error("GitHub pull request creation was rejected.");
		return projectGitHubPublicationResult(await execution.complete({
			requestId: row.request_id,
			status: "published",
			url,
			repository,
			branch,
			headCommit
		}));
	} catch (error) {
		if (error instanceof GitHubPublicationRequesterUnavailableError || error instanceof GatewayOperatorAccessUnavailableError || error instanceof GitHubPublicationRecoveryPendingError) throw error;
		if (dispatched && !(error instanceof GitHubPublicationKnownFailure)) {
			const interrupted = await execution.interrupt();
			if (error instanceof SessionMutationAuthorizationChangedError) throw error;
			return projectGitHubPublicationResult(interrupted);
		}
		const failure = resolveGitHubPublicationFailure(error);
		return projectGitHubPublicationResult(await execution.complete({
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
	if (row.last_effect !== null || !requester && row.head_commit !== null) try {
		var _usingCtx$11 = _usingCtx();
		if (!row.repository || !row.push_repository || !row.base_branch || !row.head_commit || !row.source_head_commit || !row.workspace_tree) throw new GitHubPublicationRecoveryPendingError("GitHub publication's recorded effects lack the facts needed for recovery; inspect the original target before requesting another publication.");
		const preparedOwner = await prepareReceiptOwner(row);
		_usingCtx$11.u({ [Symbol.dispose]: () => preparedOwner.release() });
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
		if (url) return projectGitHubPublicationResult(await execution.complete({
			requestId: row.request_id,
			status: "published",
			url,
			repository: row.repository,
			branch: row.branch,
			headCommit: row.head_commit
		}));
	} catch (_) {
		_usingCtx$11.e = _;
	} finally {
		_usingCtx$11.d();
	}
	return projectGitHubPublicationResult(await execution.complete({
		requestId: row.request_id,
		status: "failed",
		...error.failure,
		message: error.message
	}));
}
function createRepositoryGitHubPublicationRecovery(params) {
	const { placements } = params;
	return {
		async prepareClaimWorkspace(claim) {
			const assertCurrent = () => {
				if (!placements.validateWorkspaceResultClaim(claim)) throw new Error("GitHub publication lost its workspace result claim.");
			};
			const pending = await listRepositoryGitHubPublicationsAsync({
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
						params.assertCurrent();
						assertCurrent();
						requester.assertCurrent();
					};
					await captureCheckpoint(row, assertPreparation, async (facts, prepared) => {
						await bindRepositoryGitHubPublicationCheckpointAsync(row, facts, prepared.authority);
					}, {
						assertAction() {
							params.assertCurrent();
							assertCurrent();
							requester.signal.throwIfAborted();
						},
						assertCustody() {
							params.assertCurrent();
							assertCurrent();
						},
						prepareSource: () => requester.prepareSource({
							agentId: row.agent_id,
							sessionKey: row.session_key,
							sessionId: row.session_id,
							lifecycleRevision: row.session_lifecycle_revision,
							repositoryWorkspaceId: row.workspace_id,
							repositoryBranch: row.branch
						})
					});
				} finally {
					requester.release();
				}
			} catch (error) {
				if (!(error instanceof GitHubPublicationRequesterUnavailableError)) throw error;
			}
		},
		async resumeSessionRequests() {
			const failures = [];
			const rows = await listRepositoryGitHubPublicationsAsync({
				ownerProfileId: null,
				pending: true
			});
			const currentPlacements = await placements.getManyAsync(rows.map((row) => row.session_id));
			for (const row of rows) try {
				if (currentPlacements.get(row.session_id)?.turnClaim || params.isExecuting(row.request_id)) continue;
				await placements.withRepositoryWorkspaceReservation({
					sessionId: row.session_id,
					sessionKey: row.session_key,
					agentId: row.agent_id
				}, async (assertCurrent) => {
					try {
						var _usingCtx3 = _usingCtx();
						const preparedOwner = await prepareReceiptOwner(row);
						_usingCtx3.u({ [Symbol.dispose]: () => preparedOwner.release() });
						assertCurrent();
						if (!resolveReceiptOwner(row, preparedOwner)) {
							await failStaleRepositoryGitHubPublicationAsync(row, params.assertCurrent);
							return;
						}
						await params.execute(row, assertCurrent);
					} catch (_) {
						_usingCtx3.e = _;
					} finally {
						_usingCtx3.d();
					}
				});
			} catch (error) {
				if (error instanceof SessionWorkspaceReservationBusyError || error instanceof OpenClawStateLeaseAcquisitionError && error.outcome.kind === "held") continue;
				failures.push(new Error(`Publication ${row.request_id}: ${formatErrorMessage(error)}`, { cause: error }));
			}
			if (failures.length > 0) throw new AggregateError(failures, failures.map((error) => error.message).join("; "));
		},
		async deferOrphanedRequestsAsync() {
			if ((await listRepositoryGitHubPublicationsAsync({
				ownerProfileId: null,
				pending: true
			})).length === 0) return;
			await deferRepositoryGitHubPublicationClaimsAsync({ kind: "orphaned" }, params.assertCurrent);
		}
	};
}
async function readRepositoryGitHubPublicationInWorker(requestId) {
	const result = await readGitHubPublicationInWorker({
		type: "githubPublications.repositoryRead",
		input: { requestId }
	});
	if (result?.type !== "githubPublications.repositoryRead") throw new Error("GitHub repository publication receipt is unavailable.");
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
//#region src/gateway/github-repository-publication-execution.ts
function createRepositoryGitHubPublicationExecution(params) {
	const { instanceId, active, getCommittedRuntimeConfig, prepareSource } = params;
	return async (initial, context) => {
		try {
			var _usingCtx$10 = _usingCtx();
			let row = initial;
			if (terminalRepositoryGitHubPublication(row)) return projectGitHubPublicationResult(row);
			const { assertCustody, action } = context;
			assertCustody();
			const preparedOwner = await prepareReceiptOwner(row);
			_usingCtx$10.u({ [Symbol.dispose]: () => preparedOwner.release() });
			assertCustody();
			context.assertCurrent?.();
			const { loaded } = assertReceiptOwner(row, preparedOwner);
			const bound = action && row.connection_generation ? await bindPersonalGitHubPublicationSelection(action, {
				generation: row.connection_generation,
				account: {
					accountId: row.identity_account_id,
					login: row.identity_login
				}
			}) : void 0;
			if (row.owner_profile_id !== null !== Boolean(bound) || bound && bound.profileId !== row.identity_profile_id) throw new Error("My GitHub publication owner changed.");
			let requester;
			let releaseRequester;
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
			const authority = {
				assertAction: assertExecution,
				assertCustody: params.assertCurrent,
				prepareSource: () => prepareSource(action ?? getRequester(), {
					agentId: row.agent_id,
					sessionKey: row.session_key,
					sessionId: row.session_id,
					lifecycleRevision: row.session_lifecycle_revision,
					repositoryWorkspaceId: row.workspace_id,
					repositoryBranch: row.branch,
					...action ? { personalOwnerProfileId: action.owner } : {}
				})
			};
			let execution;
			const claimExecution = async () => {
				if (!execution) {
					execution = await claimRepositoryGitHubPublicationAsync(row, instanceId, authority);
					active.set(row.request_id, execution.row.execution_id);
				}
				return execution;
			};
			try {
				if (row.owner_profile_id === null) {
					if (context.requester && isGitHubPublicationRequesterV2(context.requester) && encodeGitHubPublicationRequester(context.requester.snapshot) === row.requester_authority_json) requester = context.requester;
					else {
						const restored = await restoreGitHubPublicationRequester(row.requester_authority_json, {
							sessionKey: row.session_key,
							agentId: row.agent_id
						}, getCommittedRuntimeConfig);
						requester = restored;
						releaseRequester = restored.release;
					}
				}
				assertExecution();
				if (!row.checkpoint_ref && row.owner_profile_id === null && !assertReceiptOwner(row, preparedOwner).workspace.checkpointRef) return projectGitHubPublicationResult(row);
				return await captureCheckpoint(row, assertExecution, async (facts, prepared) => {
					if (!row.checkpoint_ref) row = await bindRepositoryGitHubPublicationCheckpointAsync(row, facts, prepared.authority);
					assertExecution();
					return await executeRepositoryGitHubPublication({
						execution: await claimExecution(),
						snapshot: prepared.snapshot,
						snapshotRoot: prepared.snapshotRoot,
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
				}, authority);
			} catch (error) {
				if (row.owner_profile_id === null && error instanceof GitHubPublicationRequesterUnavailableError) return await settleDeniedRepositoryGitHubPublication({
					execution: await claimExecution(),
					assertCustody,
					error
				});
				if (execution?.ownsExecution()) await execution.interrupt();
				throw error;
			} finally {
				releaseRequester?.();
				if (execution) active.delete(row.request_id);
			}
		} catch (_) {
			_usingCtx$10.e = _;
		} finally {
			_usingCtx$10.d();
		}
	};
}
//#endregion
//#region src/gateway/github-repository-publication.ts
function createRepositoryGitHubPublicationCoordinator(params) {
	const { placements, getCommittedRuntimeConfig } = params;
	const prepareSource = async (requester, selector) => {
		const source = await requester.prepareSource(selector);
		try {
			params.assertCurrent();
			return bindGitHubPublicationSourceLifetime(source, params.signal);
		} catch (error) {
			await source.release();
			throw error;
		}
	};
	const instanceId = placements.workspaceResultInstanceId();
	const active = /* @__PURE__ */ new Map();
	const personalStatus = createRepositoryPersonalPublicationStatus(instanceId, active);
	const execute = createRepositoryGitHubPublicationExecution({
		instanceId,
		active,
		prepareSource,
		getCommittedRuntimeConfig,
		assertCurrent: params.assertCurrent
	});
	const makeRow = async (input) => {
		const { head: previous } = await readRepositoryGitHubPublicationBranchAsync({
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
		try {
			var _usingCtx$9 = _usingCtx();
			const requester = input.requester;
			requester.assertCurrent();
			const requesterAuthorityJson = encodeGitHubPublicationRequester(requester.snapshot);
			if (!input.sessionKey) throw new Error("GitHub publication requires an authoritative session.");
			const loaded = _usingCtx$9.u(await prepareGitHubPublicationSession(input.sessionKey, {
				cfg: getCommittedRuntimeConfig(),
				agentId: input.agentId,
				assertCurrent: params.assertCurrent
			})).loaded;
			requester.assertCurrent();
			if (!loaded.entry?.sessionId) throw new Error("GitHub publication session changed.");
			const session = {
				sessionId: loaded.entry.sessionId,
				lifecycleRevision: loaded.entry.lifecycleRevision ?? null,
				sessionKey: loaded.canonicalKey,
				agentId: input.agentId
			};
			const currentOwner = await prepareRepositoryOwner(session);
			_usingCtx$9.u({ [Symbol.dispose]: () => currentOwner.release() });
			const initial = currentOwner();
			const assertCurrent = () => {
				requester.assertCurrent();
				const placement = claim ? placements.get(session.sessionId) : void 0;
				if (!sameGitHubPublicationWorkspace(initial, currentOwner()) || claim && (!placement || claim.sessionId !== session.sessionId || placement.agentId !== session.agentId || placement.sessionKey !== session.sessionKey || !resolvePlacementTurnEnvironment(placement, claim))) throw new Error("GitHub publication session authority changed.");
			};
			assertCurrent();
			const [existing] = await listRepositoryGitHubPublicationsAsync({
				sessionId: session.sessionId,
				idempotencyKey: input.idempotencyKey,
				ownerProfileId: null
			});
			assertCurrent();
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
				hasRequest: () => Boolean(existing)
			});
			if (existing) {
				if (!matchesGitHubPublicationIdentityRow(existing, identity)) throw new Error("GitHub publication identity changed.");
				return existing;
			}
			const target = await prepareRepositoryGitHubPublicationTarget(initial.workspace, identity, assertCurrent);
			assertCurrent();
			const row = await makeRow({
				session,
				workspace: initial.workspace,
				request: input,
				identity,
				target,
				claim,
				requesterAuthorityJson
			});
			const source = await prepareSource(requester, {
				...session,
				repositoryWorkspaceId: row.workspace_id,
				repositoryBranch: row.branch
			});
			try {
				assertCurrent();
				return await insertRepositoryGitHubPublicationAsync(row, source);
			} finally {
				await source.release();
			}
		} catch (_) {
			_usingCtx$9.e = _;
		} finally {
			_usingCtx$9.d();
		}
	};
	return {
		async requestForClaimV2(input) {
			const expected = input.expectedPublisher;
			if (expected?.source === "personal") throw new Error("My GitHub publication requires direct personal authorization.");
			const row = await admitShared({
				...input,
				selection: {
					source: "shared",
					...expected ? { expected: {
						source: expected.source,
						accountId: expected.accountId,
						login: expected.login
					} } : {}
				}
			}, input.claim);
			return projectGitHubPublicationResult(row);
		},
		async requestForSessionV2(input) {
			try {
				var _usingCtx3 = _usingCtx();
				if (input.selection?.source === "personal") throw new Error("My GitHub publication requires direct personal authorization.");
				const loaded = _usingCtx3.u(await prepareGitHubPublicationSession(input.sessionKey, {
					cfg: getCommittedRuntimeConfig(),
					agentId: input.agentId,
					assertCurrent: params.assertCurrent
				})).loaded;
				const placement = loaded.entry?.sessionId ? await placements.getAsync(loaded.entry.sessionId) : void 0;
				input.requester.assertCurrent();
				const currentClaim = placement ? exactClaimForPlacement(placement) : void 0;
				if (input.expectedRunId !== void 0 && input.expectedRunId !== currentClaim?.runId) throw new Error("GitHub publication run identity changed.");
				const claim = input.expectedRunId !== void 0 ? currentClaim : void 0;
				const row = await admitShared(input, claim);
				if (terminalRepositoryGitHubPublication(row) || claim || (await placements.getAsync(row.session_id))?.turnClaim) return projectGitHubPublicationResult(row);
				return await placements.withRepositoryWorkspaceReservation({
					sessionId: row.session_id,
					sessionKey: row.session_key,
					agentId: row.agent_id
				}, async (assertCustody) => await execute(row, {
					assertCustody,
					assertCurrent: input.requester.assertInvocationCurrent,
					requester: input.requester
				}));
			} catch (_) {
				_usingCtx3.e = _;
			} finally {
				_usingCtx3.d();
			}
		},
		async requestPersonalForSessionV2(input, action) {
			if (input.selection?.source !== "personal" || input.idempotencyKey.length > 128) throw new Error("My GitHub publication requires an explicit bounded account selection.");
			const selected = input.selection;
			action.assertCurrent();
			const [existing] = await listRepositoryGitHubPublicationsAsync({
				sessionId: action.sessionId,
				idempotencyKey: input.idempotencyKey,
				ownerProfileId: action.owner
			});
			action.assertCurrent();
			if (existing) try {
				var _usingCtx4 = _usingCtx();
				assertPersonalGitHubPublicationReplay(existing, input, selected);
				const prepared = await preparePersonalRepositoryPublicationStatus(existing.request_id);
				_usingCtx4.u({ [Symbol.dispose]: () => prepared?.release() });
				action.assertCurrent();
				return (await personalStatus(existing, action, action, prepared)).result;
			} catch (_) {
				_usingCtx4.e = _;
			} finally {
				_usingCtx4.d();
			}
			const bound = await bindPersonalGitHubPublicationSelection(action, selected, {
				idempotencyKey: input.idempotencyKey,
				hasRequest: () => Boolean(existing)
			});
			return await placements.withRepositoryWorkspaceReservation(action, async (assertReservation) => {
				try {
					var _usingCtx5 = _usingCtx();
					const currentOwner = await prepareRepositoryOwner(action);
					_usingCtx5.u({ [Symbol.dispose]: () => currentOwner.release() });
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
					const candidate = await makeRow({
						session: action,
						workspace: initial.workspace,
						request: input,
						identity,
						target,
						action,
						generation: selected.generation,
						requesterAuthorityJson: null
					});
					const source = await prepareSource(action, {
						agentId: action.agentId,
						sessionKey: action.sessionKey,
						sessionId: action.sessionId,
						lifecycleRevision: action.lifecycleRevision,
						personalOwnerProfileId: action.owner,
						repositoryWorkspaceId: candidate.workspace_id,
						repositoryBranch: candidate.branch
					});
					let row;
					try {
						assertCurrent();
						row = await insertRepositoryGitHubPublicationAsync(candidate, source);
					} finally {
						await source.release();
					}
					return await execute(row, {
						assertCustody: assertReservation,
						assertCurrent,
						action
					});
				} catch (_) {
					_usingCtx5.e = _;
				} finally {
					_usingCtx5.d();
				}
			});
		},
		async processClaim(claim) {
			const results = [];
			for (const row of (await listRepositoryGitHubPublicationsAsync({
				sessionId: claim.sessionId,
				ownerProfileId: null,
				pending: true
			})).filter((candidate) => candidate.claim_id === null || matchesRepositoryGitHubPublicationClaim(candidate, claim))) {
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
			assertCurrent: params.assertCurrent,
			isExecuting: (requestId) => active.has(requestId),
			execute: (row, assertCustody) => execute(row, { assertCustody })
		}),
		preparePersonalStatus: preparePersonalRepositoryPublicationStatus,
		async personalStatusAsync(action, session, requestId, prepared) {
			const row = await readRepositoryGitHubPublicationAsync(requestId);
			params.assertCurrent();
			return row ? personalStatus(row, action, session, prepared) : void 0;
		},
		async personalPending(action, session) {
			try {
				var _usingCtx6 = _usingCtx();
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
				const prepared = await preparePersonalRepositoryPublicationStatus(row.request_id);
				_usingCtx6.u({ [Symbol.dispose]: () => prepared?.release() });
				action.assertCurrent();
				return await personalStatus(row, action, session, prepared);
			} catch (_) {
				_usingCtx6.e = _;
			} finally {
				_usingCtx6.d();
			}
		},
		async confirmPersonalV2(input, action) {
			action.assertCurrent();
			const row = await readRepositoryGitHubPublicationAsync(input.requestId);
			action.assertCurrent();
			if (!row || row.owner_profile_id !== action.owner || row.session_id !== action.sessionId || !terminalRepositoryGitHubPublication(row) && row.session_lifecycle_revision !== action.lifecycleRevision || row.session_key !== action.sessionKey || row.agent_id !== action.agentId || row.request_digest !== input.requestDigest || row.connection_generation !== input.generation || row.identity_account_id !== input.account.accountId || row.identity_login.toLowerCase() !== input.account.login.toLowerCase()) throw new Error("My GitHub confirmation no longer matches the original request.");
			if (terminalRepositoryGitHubPublication(row)) return projectGitHubPublicationResult(row);
			if (active.has(row.request_id)) throw new Error("My GitHub publication is still running; wait for its result.");
			if (!row.checkpoint_ref) throw new Error("GitHub publication has no accepted checkpoint.");
			await bindPersonalGitHubPublicationSelection(action, input);
			return await placements.withRepositoryWorkspaceReservation(action, async (assertReservation) => await execute(row, {
				assertCustody: assertReservation,
				assertCurrent: action.assertCurrent,
				action
			}));
		},
		async readAsync(requestId) {
			const row = await readRepositoryGitHubPublicationAsync(requestId);
			params.assertCurrent();
			return row && row.owner_profile_id === null ? projectGitHubPublicationResult(row) : void 0;
		},
		async hasRequestAsync(requestId) {
			const row = await readRepositoryGitHubPublicationAsync(requestId);
			params.assertCurrent();
			return Boolean(row);
		},
		async listUnreportedResultsAsync() {
			const rows = await listRepositoryGitHubPublicationsAsync({
				pending: false,
				unreported: true
			});
			params.assertCurrent();
			return rows.map((row) => ({
				sessionId: row.session_id,
				sessionKey: row.session_key,
				agentId: row.agent_id,
				result: projectGitHubPublicationResult(row)
			}));
		}
	};
}
//#endregion
//#region src/gateway/github-publication.ts
const activePublicationExecutions = /* @__PURE__ */ new Map();
function refuseLegacyPublication(method, replacement, guidance = "and await completion") {
	warnPluginSdkDeprecation({
		family: "github-publication",
		compatibility: "This method no longer performs publication work; use its replacement.",
		method,
		replacement
	});
	throw new Error(`Use ${replacement} ${guidance}.`);
}
function sameClaim(row, claim) {
	return row.claim_id === claim.claimId && row.run_id === claim.runId && row.placement_generation === claim.placementGeneration && row.environment_id === (claim.owner.environmentId ?? null) && row.owner_epoch === (claim.owner.ownerEpoch ?? null);
}
function createGitHubPublicationCoordinator(params) {
	const instanceId = params.placements.workspaceResultInstanceId();
	const scope = createGitHubPublicationWorkerScope(captureOpenClawStateWorkerContext());
	const assertCurrent = params.assertCurrent ?? scope.assertCurrent;
	const signal = params.signal ?? scope.signal;
	const requestForClaim = async (request) => {
		try {
			var _usingCtx$8 = _usingCtx();
			const assertRequester = request.requester.assertCurrent;
			const placement = await params.placements.getAsync(request.claim.sessionId);
			assertRequester();
			if (!params.placements.validateTurnClaim(request.claim)) throw new Error("GitHub publication lost the live session turn claim.");
			if (!placement || placement.sessionKey !== request.sessionKey || placement.agentId !== request.agentId) throw new Error("GitHub publication session identity changed.");
			const admitted = _usingCtx$8.u(await readGitHubPublicationWorktreeOwner({
				sessionId: request.claim.sessionId,
				sessionKey: request.sessionKey,
				agentId: request.agentId
			}));
			assertRequester();
			const identity = await prepareCurrentGitHubPublicationIdentity(request.agentId);
			assertRequester();
			const existing = await readGitHubPublicationRequestAsync({
				sessionId: request.claim.sessionId,
				idempotencyKey: request.idempotencyKey
			});
			assertRequester();
			assertExpectedSharedGitHubPublisher(request.expectedPublisher, {
				source: identity.source,
				...identity.account
			}, {
				idempotencyKey: request.idempotencyKey,
				hasRequest: () => Boolean(existing)
			});
			const worktreeOwner = admitted;
			const { worktree } = worktreeOwner;
			assertRequester();
			if (!params.placements.validateTurnClaim(request.claim)) throw new Error("GitHub publication lost the live session turn claim after verification.");
			if (!matchesCurrentGitHubPublicationIdentity({
				agentId: request.agentId,
				identity
			})) throw new Error("GitHub publication identity changed.");
			const requestDigest = digestGitHubPublicationRequest({
				sessionId: request.claim.sessionId,
				idempotencyKey: request.idempotencyKey,
				title: request.title,
				body: request.body
			});
			const now = Date.now();
			const requestId = randomUUID();
			const input = {
				request: {
					sessionKey: request.sessionKey,
					agentId: request.agentId,
					idempotencyKey: request.idempotencyKey,
					title: request.title,
					body: request.body
				},
				requestId,
				requestDigest,
				now,
				identity: {
					source: identity.source,
					profileId: identity.profileId,
					account: identity.account
				},
				worktree: {
					id: worktree.id,
					repoFingerprint: worktree.repoFingerprint,
					branch: worktree.branch
				},
				sessionId: request.claim.sessionId,
				lifecycleRevision: admitted.loaded.entry?.lifecycleRevision ?? null,
				requester: request.requester.snapshot,
				claim: request.claim
			};
			let row;
			{
				const source = await request.requester.prepareSource({
					agentId: request.agentId,
					sessionKey: request.sessionKey,
					sessionId: request.claim.sessionId,
					lifecycleRevision: input.lifecycleRevision,
					worktreeId: worktree.id
				});
				try {
					assertCurrent();
					assertRequester();
					worktreeOwner.assertCurrent();
					if (!params.placements.validateTurnClaim(request.claim) || !matchesCurrentGitHubPublicationIdentity({
						agentId: request.agentId,
						identity
					})) throw new Error("GitHub publication authority changed before recording.");
					bindGitHubPublicationSourceLifetime(source, signal);
					row = await insertGitHubPublicationRequestAsync(input, source);
				} finally {
					await source.release();
				}
			}
			if (!sameClaim(row, request.claim)) throw new Error("GitHub publication idempotency key was reused.");
			return projectGitHubPublicationResult(row);
		} catch (_) {
			_usingCtx$8.e = _;
		} finally {
			_usingCtx$8.d();
		}
	};
	const processRow = (initial, validateExecution, assertInvocationCurrent, invocationSignal) => {
		if (initial.status === "published" || initial.status === "failed") return Promise.resolve(projectGitHubPublicationResult(initial));
		const executionKey = `${instanceId}\0${initial.request_id}`;
		return getOrCreatePromise(activePublicationExecutions, executionKey, () => params.placements.withWorkspaceExclusion(initial.session_id, async (assertOwned) => {
			const assertCustody = () => {
				assertCurrent();
				assertOwned();
			};
			const claimed = await claimGitHubPublicationExecutionAsync(initial.request_id, instanceId, assertCurrent);
			if (claimed.status === "published" || claimed.status === "failed") return projectGitHubPublicationResult(claimed);
			const lease = await acquireWorktreeRunLease(claimed.worktree_id);
			const validateCustody = () => {
				assertCustody();
				return validateExecution();
			};
			let effect;
			let dispatched = false;
			let requester;
			let lifecycleRevision;
			const revokeInvocation = () => requester?.release();
			invocationSignal?.addEventListener("abort", revokeInvocation, { once: true });
			signal.addEventListener("abort", revokeInvocation, { once: true });
			const getRequester = () => {
				if (!requester) throw new GitHubPublicationRequesterUnavailableError();
				return requester;
			};
			const executionStore = createGitHubPublicationExecutionStoreAsync(instanceId, {
				assertCustody: assertCurrent,
				assertAction() {
					assertCustody();
					signal.throwIfAborted();
					invocationSignal?.throwIfAborted();
					getRequester().signal.throwIfAborted();
				},
				async prepareSource() {
					signal.throwIfAborted();
					invocationSignal?.throwIfAborted();
					assertInvocationCurrent?.();
					if (!validateCustody() || lifecycleRevision === void 0) throw new GitHubPublicationAuthorityLostError("GitHub publication source custody changed.");
					const source = await getRequester().prepareSource({
						agentId: claimed.agent_id,
						sessionKey: claimed.session_key,
						sessionId: claimed.session_id,
						lifecycleRevision,
						worktreeId: claimed.worktree_id
					});
					try {
						invocationSignal?.throwIfAborted();
						assertInvocationCurrent?.();
						if (!validateCustody()) throw new GitHubPublicationAuthorityLostError("GitHub publication source custody changed.");
						return source;
					} catch (error) {
						await source.release();
						throw error;
					}
				}
			});
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
						invocationSignal?.throwIfAborted();
						signal.throwIfAborted();
						requester = await restoreGitHubPublicationRequester(lifecycle?.requester_authority_json, {
							sessionKey: claimed.session_key,
							agentId: claimed.agent_id
						}, params.getCommittedRuntimeConfig);
						lifecycleRevision = lifecycle?.lifecycle_revision;
						signal.throwIfAborted();
						invocationSignal?.throwIfAborted();
					},
					validateAuthority: () => {
						if (!validateCustody()) return false;
						getRequester().assertCurrent();
						assertInvocationCurrent?.();
						return true;
					},
					recordEffect: (kind, observed) => {
						dispatched ||= observed === void 0;
						effect = {
							kind,
							status: observed?.headCommit || observed?.url ? "observed" : "dispatched",
							...observed
						};
					},
					bindWorkspaceSnapshot: (input) => executionStore.bindWorkspaceSnapshot(input),
					updatePublishingFacts: (input) => executionStore.updatePublishingFacts(input),
					complete: (row, result) => executionStore.complete(row, result),
					defer: async (row) => {
						await deferGitHubPublicationRequestsAsync({
							kind: "request",
							row
						}, assertCurrent);
						const deferred = await readGitHubPublicationRequestInWorker(row.request_id);
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
						complete: (row, result) => executionStore.complete(row, result),
						pushOnly: claimed.head_commit === null && effect?.kind === "push" ? effect.status === "observed" && effect.headCommit === current.head_commit ? "observed" : "dispatched" : void 0
					});
					if (observed) return observed;
				}
				if (!validateCustody()) throw new GitHubPublicationAuthorityLostError("GitHub publication execution custody changed during reconciliation.");
				return projectGitHubPublicationResult(await executionStore.complete(current, {
					requestId: current.request_id,
					status: "failed",
					...error.failure,
					message: error.message
				}));
			} finally {
				signal.removeEventListener("abort", revokeInvocation);
				invocationSignal?.removeEventListener("abort", revokeInvocation);
				requester?.release();
				await lease.release();
			}
		}), { evictOnSettled: true });
	};
	const repository = createRepositoryGitHubPublicationCoordinator({
		...params,
		assertCurrent,
		signal
	});
	const personal = createPersonalGitHubPublicationCoordinator(params.placements, assertCurrent, signal);
	const methods = createGitHubPublicationCoordinatorMethods({
		placements: params.placements,
		assertCurrent,
		requestForClaimV2: requestForClaim,
		getCommittedRuntimeConfig: params.getCommittedRuntimeConfig,
		signal,
		sameWorktree,
		processRow
	});
	return {
		...methods,
		...personal,
		/** @deprecated Use requestForClaimV2; final compatibility day: 2026-12-31; removal in the first January 2027 stable release. */
		requestForClaim: async (_request) => {
			return refuseLegacyPublication("requestForClaim", "requestForClaimV2", "with a host-prepared requester");
		},
		requestForClaimV2: async (request) => {
			if (!isGitHubPublicationRequesterV2(request.requester)) throw new Error("GitHub publication requires a host-prepared V2 requester.");
			assertCurrent();
			return await hasGitHubPublicationRepositoryWorkspace({
				sessionId: request.claim.sessionId,
				sessionKey: request.sessionKey,
				agentId: request.agentId
			}) ? repository.requestForClaimV2(request) : requestForClaim(request);
		},
		async prepareClaimWorkspace(claim) {
			await prepareGitHubPublicationClaimWorkspace({
				placements: params.placements,
				assertCurrent
			}, claim);
			await repository.prepareClaimWorkspace(claim);
		},
		/** @deprecated Use deferClaimPreparationAsync; final compatibility day: 2026-12-31; removal in the first January 2027 stable release. */
		deferClaimPreparation(_claim) {
			return refuseLegacyPublication("deferClaimPreparation", "deferClaimPreparationAsync");
		},
		async deferClaimPreparationAsync(claim) {
			await runGitHubPublicationMaintenanceAsync({
				operation: "deferClaim",
				claim
			}, assertCurrent);
		},
		/** @deprecated Use requestForSessionV2; final compatibility day: 2026-12-31; removal in the first January 2027 stable release. */
		async requestForSession(_input) {
			return refuseLegacyPublication("requestForSession", "requestForSessionV2", "with a host-prepared requester");
		},
		async requestForSessionV2(input) {
			if (!isGitHubPublicationRequesterV2(input.requester)) throw new Error("GitHub publication requires a host-prepared V2 requester.");
			assertCurrent();
			if (!input.sessionKey) throw new Error("GitHub publication requires an authoritative session.");
			return (await loadGatewaySessionEntryReadOnlyInWorker({
				cfg: params.getCommittedRuntimeConfig(),
				key: input.sessionKey,
				agentId: input.agentId,
				assertActive: assertCurrent
			})).entry?.repositoryWorkspaceId ? repository.requestForSessionV2(input) : methods.requestForSessionV2(input);
		},
		/** @deprecated Use requestPersonalForSessionV2; final compatibility day: 2026-12-31; removal in the first January 2027 stable release. */
		async requestPersonalForSession(..._args) {
			return refuseLegacyPublication("requestPersonalForSession", "requestPersonalForSessionV2", "with a host-prepared action");
		},
		async requestPersonalForSessionV2(...args) {
			return await hasGitHubPublicationRepositoryWorkspace(args[1]) ? repository.requestPersonalForSessionV2(...args) : personal.requestPersonalForSessionV2(...args);
		},
		preparePersonalStatus: repository.preparePersonalStatus,
		/** @deprecated Use personalStatusAsync and await completion. */
		personalStatus(..._args) {
			return refuseLegacyPublication("personalStatus", "personalStatusAsync");
		},
		async personalStatusAsync(...args) {
			return await repository.personalStatusAsync(...args) ?? personal.personalStatusAsync(args[0], args[1], args[2]);
		},
		async personalPending(...args) {
			return await repository.personalPending(...args) ?? personal.personalPending(...args);
		},
		/** @deprecated Use confirmPersonalV2; final compatibility day: 2026-12-31; removal in the first January 2027 stable release. */
		confirmPersonal(..._args) {
			return refuseLegacyPublication("confirmPersonal", "confirmPersonalV2", "with a host-prepared action");
		},
		async confirmPersonalV2(...args) {
			return await repository.hasRequestAsync(args[0].requestId) ? repository.confirmPersonalV2(...args) : personal.confirmPersonalV2(...args);
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
		/** @deprecated Use deferOrphanedRequestsAsync; final compatibility day: 2026-12-31; removal in the first January 2027 stable release. */
		deferOrphanedRequests() {
			return refuseLegacyPublication("deferOrphanedRequests", "deferOrphanedRequestsAsync");
		},
		async deferOrphanedRequestsAsync() {
			await methods.deferOrphanedRequestsAsync();
			await repository.deferOrphanedRequestsAsync();
		},
		/** @deprecated Use listUnreportedResultsAsync; final compatibility day: 2026-12-31; removal in the first January 2027 stable release. */
		listUnreportedResults() {
			return refuseLegacyPublication("listUnreportedResults", "listUnreportedResultsAsync");
		},
		async listUnreportedResultsAsync() {
			return [...await methods.listUnreportedResultsAsync(), ...await repository.listUnreportedResultsAsync()];
		},
		/** @deprecated Use readAsync and await completion. */
		read(_requestId) {
			return refuseLegacyPublication("read", "readAsync");
		},
		async readAsync(requestId) {
			return await repository.readAsync(requestId) ?? methods.readAsync(requestId);
		},
		async readReportLifecycleAsync(report) {
			const requestId = report.result.requestId;
			const row = await readRepositoryGitHubPublicationAsync(requestId);
			assertCurrent();
			if (row) return row.session_lifecycle_revision;
			const lifecycle = await prepareGitHubPublicationSessionLifecycle({
				publicationKind: report.result.publisher?.source === "personal" ? "personal" : "shared",
				requestId
			});
			assertCurrent();
			const binding = lifecycle.readCurrent();
			if (!binding) throw new Error("GitHub publication transcript lifecycle is unavailable.");
			return binding.lifecycle_revision;
		},
		/** @deprecated Use markReportedAsync; final compatibility day: 2026-12-31; removal in the first January 2027 stable release. */
		markReported(_requestId) {
			return refuseLegacyPublication("markReported", "markReportedAsync");
		},
		async markReportedAsync(requestId) {
			await runGitHubPublicationMaintenanceAsync({
				operation: "report",
				requestId
			}, assertCurrent);
		}
	};
}
//#endregion
//#region src/gateway/github-publication-runtime.ts
function createGitHubPublicationRuntime(params) {
	const context = captureOpenClawStateWorkerContext();
	const scope = createGitHubPublicationWorkerScope(context);
	const pendingRequests = /* @__PURE__ */ new Set();
	let pendingKnown = false;
	let reconcileNeeded = true;
	let loadingUpdates;
	const updatePending = (key, pending) => {
		if (pending) pendingRequests.add(key);
		else pendingRequests.delete(key);
		loadingUpdates?.set(key, pending);
	};
	const stopFacts = githubPublicationReceipts.subscribeFacts((change) => {
		if (change.kind === "unknown" && change.identity === context.admission.identity.key) {
			pendingKnown = false;
			reconcileNeeded = true;
		}
		if (change.kind !== "committed" || change.receipt.source.identity !== context.admission.identity.key) return;
		for (const [key, fact] of change.receipt.facts) if (fact.kind === "unknown") {
			pendingKnown = false;
			reconcileNeeded = true;
		} else if (fact.kind === "absent") updatePending(key, false);
		else if (fact.kind === "postimage" && "status" in fact.value) {
			const row = fact.value;
			updatePending(key, (row.status === "requested" || row.status === "publishing") && row.identity_source !== "personal" || (row.status === "published" || row.status === "failed") && row.reported_at_ms === null);
			reconcileNeeded = true;
		}
	});
	const loadPendingRequests = async () => {
		const updates = /* @__PURE__ */ new Map();
		loadingUpdates = updates;
		pendingKnown = true;
		try {
			const [shared, repository] = await Promise.all([listSharedGitHubPublicationsAsync({ pending: true }), listRepositoryGitHubPublicationsAsync({
				ownerProfileId: null,
				pending: true
			})]);
			pendingRequests.clear();
			for (const row of shared) pendingRequests.add(JSON.stringify(["shared", row.request_id]));
			for (const row of repository) pendingRequests.add(JSON.stringify(["repository", row.request_id]));
			for (const [key, pending] of updates) updatePending(key, pending);
		} catch (error) {
			pendingKnown = false;
			throw error;
		} finally {
			loadingUpdates = void 0;
		}
	};
	const coordinator = createGitHubPublicationCoordinator({
		...params,
		assertCurrent: scope.assertCurrent,
		signal: scope.signal
	});
	const ready = requirePersonalGitHubPublicationConfirmationAsync(params.placements.workspaceResultInstanceId(), scope.assertCurrent);
	ready.catch(() => {});
	const reportDeferred = async (publication) => {
		try {
			await reportGitHubPublicationTranscript(params.loadSessionRuntime, coordinator, publication);
			return true;
		} catch (error) {
			params.warn(`GitHub publication result reporting deferred for ${publication.sessionId}: ${formatErrorMessage(error)}`);
			return false;
		}
	};
	const prepareAcceptedWorkspacePublication = async (claim) => {
		await ready;
		try {
			await coordinator.prepareClaimWorkspace(claim);
		} catch {
			await coordinator.deferClaimPreparationAsync(claim);
		}
	};
	const publishAcceptedWorkspace = async (claim) => {
		await ready;
		const placement = await params.placements.getAsync(claim.sessionId);
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
		await ready;
		if (!pendingKnown) await loadPendingRequests();
		if (!reconcileNeeded && pendingRequests.size === 0) return;
		reconcileNeeded = false;
		try {
			await coordinator.deferOrphanedRequestsAsync();
			await coordinator.resumeSessionRequests();
		} catch (error) {
			reconcileNeeded = true;
			params.warn(`GitHub publication recovery deferred: ${formatErrorMessage(error)}`);
		}
		try {
			for (const publication of await coordinator.listUnreportedResultsAsync()) if (!await reportDeferred(publication)) reconcileNeeded = true;
		} catch (error) {
			reconcileNeeded = true;
			throw error;
		}
	};
	return {
		ready,
		close: () => {
			stopFacts();
			return scope.close();
		},
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
	return async (operation) => {
		let context;
		try {
			context = params.getSessionChangeContext?.();
		} catch (error) {
			warnPlacementChangeFailure(error);
		}
		if (!context) return await operation();
		const changed = /* @__PURE__ */ new Map();
		const unsubscribe = params.placements.subscribeChanges((placement) => {
			changed.set(placement.sessionId, placement);
		});
		try {
			return await operation();
		} finally {
			unsubscribe();
			for (const placement of changed.values()) try {
				emitSessionsChanged(context, {
					reason: "placement",
					sessionKey: placement.sessionKey,
					agentId: placement.agentId
				});
			} catch (error) {
				warnPlacementChangeFailure(error);
			}
		}
	};
}
function subscribeGatewayWorkerPlacementMetadataChanges(params) {
	const profiles = /* @__PURE__ */ new Set();
	const nodes = /* @__PURE__ */ new Set();
	let stopped = false;
	let pending;
	const schedule = () => {
		if (stopped || !params.getSessionChangeContext?.()) return;
		if (pending) return;
		pending = Promise.resolve().then(async () => {
			try {
				while (profiles.size || nodes.size) {
					const batch = [...profiles];
					const changedNodes = new Set(nodes);
					profiles.clear();
					nodes.clear();
					try {
						const placements = new Map((batch.length ? await params.placements.readChangeSnapshot(batch) : []).map((placement) => [placement.sessionId, placement]));
						if (changedNodes.size) {
							const identities = await params.placements.readChangeSnapshot();
							const projection = await params.placements.readProjection(identities.filter((row) => row.state === "active").map((row) => row.sessionId), { current: true });
							for (const placement of projection.placements.values()) {
								const runner = params.runnerAvailability.read(placement, projection.environments.get(placement.environmentId ?? "") ?? null);
								if (runner?.deviceId && changedNodes.has(runner.deviceId)) placements.set(placement.sessionId, placement);
							}
						}
						const context = params.getSessionChangeContext?.();
						if (stopped || !context) return;
						for (const placement of placements.values()) emitSessionsChanged(context, {
							reason: "placement",
							sessionKey: placement.sessionKey,
							sessionId: placement.sessionId,
							agentId: placement.agentId
						}, { accessChanged: false });
					} catch (error) {
						try {
							params.warn(`Worker placement metadata change reporting failed: ${formatErrorMessage(error)}`);
						} catch {}
					}
				}
			} finally {
				pending = void 0;
			}
		});
	};
	const unsubscribe = params.environments.subscribeMachineShapeChanged((profileId) => {
		profiles.add(profileId);
		schedule();
	});
	return {
		runnerChanged(nodeId) {
			if (stopped) return;
			nodes.add(nodeId);
			schedule();
		},
		async stop() {
			stopped = true;
			profiles.clear();
			nodes.clear();
			unsubscribe();
			await pending;
		}
	};
}
//#endregion
//#region src/gateway/server-worker-placement-move-barrier.ts
async function runWorkerPlacementHandoff(params, request, sessionRuntime, begin) {
	const { sessionId, sessionKey, agentId, action, signal } = request;
	const target = await resolveWorkerPlacementSessionStoreTarget(sessionRuntime, readRuntimeConfig(), request);
	const lifecycleIdentities = [
		sessionKey,
		target.canonicalKey,
		...target.storeKeys,
		sessionId
	];
	let begun;
	return await runExclusiveSessionLifecycleMutation(`placement-${action}`, {
		scope: target.storePath,
		identities: lifecycleIdentities,
		signal,
		prepare: async () => {
			try {
				var _usingCtx$7 = _usingCtx();
				const resolved = _usingCtx$7.u(await resolveWorkerPlacementSessionTarget({
					sessionRuntime,
					config: readRuntimeConfig(),
					sessionId,
					sessionKey,
					agentId,
					expectedTarget: target,
					errorMessage: `Session ${sessionKey} changed before ${action === "dispatch" ? "cloud worker dispatch" : "placement move"}. Retry.`
				}));
				resolved.assertCurrent(readRuntimeConfig());
				if (action === "dispatch" && isCompetingSessionWorkAdmissionActive(target.storePath, lifecycleIdentities)) throw new Error(`Session ${sessionKey} is busy with active work; wait for the turn to finish and retry dispatch.`);
				begun = await begin(resolved);
				if (action === "dispatch" && request.requiredProfile) return;
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
				if (request.sourceDisposition === "abandon") {
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
				})) throw new Error(`Session ${sessionKey} is still active; ${action === "dispatch" ? "dispatch stopped" : "placement move interrupted"}`);
				await params.placements.waitForTurnClaimRelease(sessionId, {
					timeoutMs: SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS,
					signal
				});
				await runExclusiveSessionStoreWrite(target.storePath, async () => {}, { reentrant: true });
			} catch (_) {
				_usingCtx$7.e = _;
			} finally {
				_usingCtx$7.d();
			}
		},
		run: async () => begun
	});
}
function createGatewayWorkerPlacementMoveBarrier(params) {
	return async (request) => runWorkerPlacementHandoff(params, {
		...request,
		action: "move"
	}, await params.loadSessionRuntime(), async ({ workspace }) => {
		if (workspace.kind === "device-folder") throw new Error("Device folders cannot move or Continue on Gateway; reconnect the original device or start a new session.");
		request.authorize?.();
		return await request.begin(async (runId) => {
			if (params.persistAbandonedPartial) {
				const { sessionId, sessionKey, agentId } = request;
				await params.persistAbandonedPartial({
					sessionId,
					sessionKey,
					agentId,
					runId
				});
				request.authorize?.();
			}
		});
	});
}
//#endregion
//#region src/gateway/server-worker-placement-local-dispatch.ts
const loadWorkerWorkspacePreflight = createLazyRuntimeNamedExport(() => import("./workspace-sync-preflight-CbbOz9D9.mjs"), "preflightWorkerWorkspace");
function createGatewayWorkerPlacementLocalDispatchBarrier(params) {
	return async (request) => {
		const sessionRuntime = await loadWorkerPlacementSessionRuntimeModule();
		const { sessionId, sessionKey, executionMode, requiredProfile, signal, authorize, startDispatch } = request;
		return await runWorkerPlacementHandoff(params, {
			...request,
			action: "dispatch"
		}, sessionRuntime, async ({ config, target, entry, workspace, assertCurrent }) => {
			if (entry.archivedAt !== void 0) throw new WorkerDispatchTargetChangedError(`Session ${sessionKey} was archived before cloud worker dispatch. Retry.`);
			const runtime = await sessionRuntime.resolveWorkerPlacementSessionRuntimeAsync({
				cfg: config,
				entry,
				agentId: target.agentId,
				sessionKey: target.canonicalKey,
				assertCurrent: () => assertCurrent(readRuntimeConfig())
			});
			if (sessionRuntime.resolveWorkerPlacementExecutionMode(runtime) !== executionMode) throw new WorkerDispatchTargetChangedError(`Session ${sessionKey} runtime changed to ${runtime} before cloud worker dispatch. Retry.`);
			if (workspace.kind === "local") await (await loadWorkerWorkspacePreflight())({
				localPath: workspace.path,
				signal
			});
			if (requiredProfile) await params.placements.getAsync(sessionId);
			assertCurrent(readRuntimeConfig());
			authorize?.();
			if (requiredProfile && (readRuntimeConfig().cloudWorkers?.requiredProfile !== requiredProfile || params.placements.get(sessionId)?.turnClaim)) throw new WorkerDispatchTargetChangedError("Required worker admission changed or a local turn is still active.");
			return await startDispatch();
		});
	};
}
//#endregion
//#region src/gateway/server-worker-placement-manifest-refs.ts
async function prepareWorkerPlacementRepositoryManifestRefs(placement) {
	const memory = captureMemoryExactSessionReader(placement);
	const scope = {
		...placement,
		storePath: resolveSessionStorePathForScope(placement)
	};
	let active = true;
	const release = () => {
		active = false;
	};
	try {
		const entry = memory ? memory.read(placement.sessionKey) : await readSessionEntryReadOnlyInWorker(scope);
		if (entry?.sessionId !== placement.sessionId) {
			release();
			return Object.assign(() => null, { [Symbol.dispose]: release });
		}
		const prepared = entry.repositoryWorkspaceId ? await getSessionRepositoryWorkspaceStore().prepare(entry.repositoryWorkspaceId) : void 0;
		return Object.assign(() => {
			if (!active) return null;
			if (!prepared) return [];
			try {
				const repository = prepared.current();
				return repository?.agentId === placement.agentId && repository.sessionKey === placement.sessionKey && repository.baseManifestHash ? [repository.baseManifestHash] : null;
			} catch {
				return null;
			}
		}, { [Symbol.dispose]: release });
	} catch (error) {
		release();
		throw error;
	}
}
//#endregion
//#region src/gateway/server-worker-placement-move-destination.ts
function createGatewayWorkerPlacementMoveDestinationResolver(params) {
	return async (identity, moveTarget) => {
		try {
			var _usingCtx$6 = _usingCtx();
			if (moveTarget.kind === "gateway") return;
			const sessionRuntime = await params.loadSessionRuntime();
			const { config, target, entry, assertCurrent } = _usingCtx$6.u(await resolveWorkerPlacementSessionTarget({
				sessionRuntime,
				config: params.getConfig(),
				...identity,
				errorMessage: `Session ${identity.sessionKey} changed before placement move recovery.`
			}));
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
			const runtime = await sessionRuntime.resolveWorkerPlacementSessionRuntimeAsync({
				cfg: config,
				entry,
				agentId: target.agentId,
				sessionKey: target.canonicalKey,
				assertCurrent: () => assertCurrent(params.getConfig())
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
		} catch (_) {
			_usingCtx$6.e = _;
		} finally {
			_usingCtx$6.d();
		}
	};
}
//#endregion
//#region src/gateway/server-worker-placement-reclaim.ts
function createGatewayWorkerPlacementReclaimBarriers(params) {
	const resolveLifecycleContext = async ({ sessionId, sessionKey, agentId }) => {
		const sessionRuntime = await params.loadSessionRuntime();
		const config = readRuntimeConfig();
		const target = await resolveWorkerPlacementSessionStoreTarget(sessionRuntime, config, {
			sessionKey,
			agentId
		});
		const assertRoutingCurrent = captureSessionMutationRouting(config, () => new WorkerDispatchTargetChangedError(`Session ${sessionKey} changed before cloud worker stop. Retry.`), [{
			sessionKey,
			agentId,
			preserveQualifiedAddress: true
		}]);
		let retained;
		let active = true;
		let unregister = () => {};
		const release = () => {
			if (!active) return;
			active = false;
			retained?.release();
			unregister();
		};
		const assertActive = () => {
			if (!active) throw new WorkerDispatchTargetChangedError(`Session ${sessionKey} changed before cloud worker stop. Retry.`);
		};
		const metadata = captureSessionEntryMetadataRead({
			sessionKey: target.canonicalKey,
			agentId: target.agentId,
			storePath: target.storePath
		}, assertActive);
		const selectedKey = target.storeKeys.find((key) => target.store[key]) ?? target.canonicalKey;
		const preparedEntry = target.store[selectedKey];
		const source = target.capturedReadSource;
		try {
			if (!metadata) {
				if (!preparedEntry || !source || typeof source.databaseIdentity !== "string") throw new WorkerDispatchTargetChangedError(`Session ${sessionKey} changed before cloud worker stop. Retry.`);
				retained = retainPreparedSessionGenerationFacts({
					databaseIdentity: `file:${source.databaseIdentity}`,
					sessionKey: selectedKey,
					entry: preparedEntry
				});
				unregister = registerOpenClawAgentDatabaseAsyncResource({
					agentId: source.agentId,
					path: source.path,
					revoke: release,
					close: async () => release()
				});
			}
		} catch (error) {
			release();
			throw error;
		}
		const readCurrentTarget = () => {
			assertActive();
			if (!metadata) assertRoutingCurrent(readRuntimeConfig());
			if (source) assertCapturedSessionEntryReadSource(source);
			const generation = retained?.readCurrent();
			const entry = metadata ? metadata.readCurrent() : generation;
			return {
				...target,
				entry
			};
		};
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
				const entry = sessionRuntime.resolveCanonicalSessionEntryFromStoreKeys(target.store, target.storeKeys);
				await params.cancelSessionWork({
					sessionId,
					sessionKeys: lifecycleIdentities,
					agentId,
					session: {
						ok: true,
						value: {
							cfg: config,
							storePath: target.storePath,
							canonicalKey: target.canonicalKey,
							agentId: target.agentId,
							entry
						}
					},
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
			readCurrentTarget,
			lifecycleIdentities,
			cancelAndDrain,
			[Symbol.dispose]: release
		};
	};
	const runReclaimPreparation = async ({ sessionId, sessionKey, agentId, authorize, beforeDrain, pendingOperations, run }) => {
		try {
			var _usingCtx$5 = _usingCtx();
			const { sessionRuntime, target, readCurrentTarget, lifecycleIdentities, cancelAndDrain } = _usingCtx$5.u(await resolveLifecycleContext({
				sessionId,
				sessionKey,
				agentId
			}));
			const revision = sessionRuntime.resolveCanonicalSessionEntryFromStoreKeys(target.store, target.storeKeys)?.lifecycleRevision ?? null;
			const assertTargetCurrent = () => {
				const current = readCurrentTarget();
				const currentEntry = current.entry;
				if (current.storePath !== target.storePath || current.canonicalKey !== target.canonicalKey || current.agentId !== target.agentId || currentEntry?.sessionId !== sessionId || (currentEntry.lifecycleRevision ?? null) !== revision) throw new WorkerDispatchTargetChangedError(`Session ${sessionKey} changed before cloud worker stop. Retry.`);
			};
			const assertCurrent = Object.assign(() => {
				authorize?.();
				assertTargetCurrent();
			}, {
				assertWorkerLifetime: () => (authorize?.assertWorkerLifetime ?? authorize)?.(),
				assertWorkerGrant: () => {
					(authorize?.assertWorkerGrant ?? authorize)?.();
					assertTargetCurrent();
				}
			});
			const placement = await params.placements.getAsync(sessionId);
			assertCurrent();
			beforeDrain?.();
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
		} catch (_) {
			_usingCtx$5.e = _;
		} finally {
			_usingCtx$5.d();
		}
	};
	const runReclaimBarrier = async ({ sessionId, sessionKey, agentId, authorize, beforeDrain, begin, reclaim }) => {
		try {
			var _usingCtx3 = _usingCtx();
			const { sessionRuntime, target, lifecycleIdentities, cancelAndDrain } = _usingCtx3.u(await resolveLifecycleContext({
				sessionId,
				sessionKey,
				agentId
			}));
			const resolveReclaimTarget = () => resolveWorkerPlacementSessionTarget({
				sessionRuntime,
				config: readRuntimeConfig(),
				sessionId,
				sessionKey,
				agentId,
				expectedTarget: target,
				errorMessage: `Session ${sessionKey} changed before cloud worker stop. Retry.`
			});
			let assertBindingCurrent;
			let preparedTarget;
			try {
				return await runExclusiveSessionLifecycleMutation("placement-reclaim", {
					scope: target.storePath,
					identities: lifecycleIdentities,
					prepare: async (lifecycle) => {
						beforeDrain?.();
						const resolved = preparedTarget = await resolveReclaimTarget();
						const placement = await params.placements.getAsync(sessionId);
						authorize?.();
						resolved.assertBindingCurrent(readRuntimeConfig());
						if (placement?.state !== "active" && placement?.state !== "draining" && placement?.state !== "reclaimed") throw new Error(`Session ${sessionKey} cannot stop cloud worker from placement ${placement?.state ?? "missing"}`);
						assertBindingCurrent = () => {
							authorize?.();
							resolved.assertBindingCurrent(readRuntimeConfig());
						};
						await cancelAndDrain(lifecycle.closeWorkAdmissions, assertBindingCurrent);
					},
					run: async () => {
						try {
							var _usingCtx4 = _usingCtx();
							if (!assertBindingCurrent) throw new Error(`Session ${sessionKey} cloud worker stop barrier did not prepare`);
							assertBindingCurrent();
							const resolved = _usingCtx4.u(await resolveReclaimTarget());
							assertBindingCurrent();
							beforeDrain?.();
							resolved.assertCurrent(readRuntimeConfig());
							const assertDrainCurrent = () => {
								assertBindingCurrent?.();
								resolved.assertBindingCurrent(readRuntimeConfig());
							};
							const placement = await begin(assertDrainCurrent);
							assertDrainCurrent();
							const reclaimedPlacement = await reclaim(resolved.workspace, placement, assertDrainCurrent);
							params.revokeSessionAuthority({
								sessionId,
								sessionKeys: lifecycleIdentities
							});
							return reclaimedPlacement;
						} catch (_) {
							_usingCtx4.e = _;
						} finally {
							_usingCtx4.d();
						}
					}
				});
			} finally {
				preparedTarget?.[Symbol.dispose]();
			}
		} catch (_) {
			_usingCtx3.e = _;
		} finally {
			_usingCtx3.d();
		}
	};
	const runFailedReclaimBarrier = async ({ sessionId, sessionKey, agentId, authorize, reclaim }) => {
		try {
			var _usingCtx5 = _usingCtx();
			const { target, readCurrentTarget, lifecycleIdentities, cancelAndDrain } = _usingCtx5.u(await resolveLifecycleContext({
				sessionId,
				sessionKey,
				agentId
			}));
			const assertCurrent = () => {
				const currentTarget = readCurrentTarget();
				const currentEntry = currentTarget.entry;
				if (currentTarget.storePath !== target.storePath || currentTarget.canonicalKey !== target.canonicalKey || currentTarget.agentId !== target.agentId || currentEntry?.sessionId !== sessionId) throw new WorkerDispatchTargetChangedError(`Session ${sessionKey} changed before failed cloud worker cleanup. Retry.`);
				authorize?.();
			};
			return await runExclusiveSessionLifecycleMutation("placement-failed-reclaim", {
				scope: target.storePath,
				identities: lifecycleIdentities,
				prepare: async (lifecycle) => {
					const placement = await params.placements.getAsync(sessionId);
					assertCurrent();
					if (placement?.state === "failed") await cancelAndDrain(lifecycle.closeWorkAdmissions, assertCurrent);
				},
				run: async () => {
					assertCurrent();
					return await reclaim(authorize);
				}
			});
		} catch (_) {
			_usingCtx5.e = _;
		} finally {
			_usingCtx5.d();
		}
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
		const owner = await params.placements.readEnvironmentOwner(environmentId);
		if (params.isStopping()) return;
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
/** Memory evidence is read once after durable discovery, without opening or acquiring an owner. */
async function readPlacementSessionIdentityEvidence(cfg, input) {
	const selected = captureSessionActorStorageOwner({});
	const capturedEnv = cloneEnvWithPlatformSemantics(selected ? {
		...process.env,
		OPENCLAW_STATE_DIR: path.resolve(selected.path, "../../../..")
	} : process.env);
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
	const readIncognito = () => {
		const entriesByAgent = /* @__PURE__ */ new Map();
		for (const { probe, index } of incognito) {
			const agentId = normalizeAgentId(probe.agentId);
			let entries = entriesByAgent.get(agentId);
			if (!entries) {
				entries = captureMemoryExactSessionReader({
					...probe,
					agentId,
					env
				})?.entries("list") ?? [];
				entriesByAgent.set(agentId, entries);
			}
			const exact = entries.find(({ sessionKey }) => sessionKey === normalizeStoreSessionKey(probe.sessionKey));
			if (exact?.entry.sessionId === probe.sessionId) {
				results[index] = {
					status: "current",
					sessionKey: exact.sessionKey
				};
				continue;
			}
			const matches = entries.filter(({ entry }) => entry.sessionId === probe.sessionId);
			results[index] = matches.length > 1 ? {
				status: "unknown",
				reason: "ambiguous"
			} : matches[0] ? {
				status: "current",
				sessionKey: matches[0].sessionKey
			} : { status: "absent" };
		}
	};
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
							continuation: continuations.find(({ path: continuationPath, owner }) => continuationPath === group.database.path && owner.receipt.agentId === group.database.agentId)?.owner.receipt
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
		for (const candidate of candidates) if (!isSessionStoreReadCandidateCurrent(candidate)) throw new Error("Session store alias changed during discovery; retry the read.");
		for (const { owner } of continuations) owner.assertCurrent();
		if (changed) {
			for (const { index } of disk) if (results[index]?.status === "absent") results[index] = {
				status: "unknown",
				reason: "read-failed"
			};
		}
		readIncognito();
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
		const cfg = readRuntimeConfig();
		const identities = placements.flatMap((placement) => resolvePlacementSessionIdentities(cfg, placement));
		const subjects = new Map(placements.map((placement) => [placement, {
			agentId: placement.agentId,
			sessionId: placement.sessionId,
			sessionKey: placement.sessionKey,
			evidence: "absent"
		}]));
		const evidence = await readPlacementSessionIdentityEvidence(cfg, identities.map((identity) => ({
			agentId: identity.agentId,
			sessionId: identity.placement.sessionId,
			sessionKey: identity.sessionKey
		})));
		for (const [index, result] of evidence.entries()) {
			const placement = identities[index]?.placement;
			const subject = placement && subjects.get(placement);
			if (subject && subject.evidence !== "current" && result.status !== "absent") subject.evidence = result.status;
		}
		return async (placement) => {
			const subject = subjects.get(placement);
			if (!subject || subject.agentId !== placement.agentId || subject.sessionId !== placement.sessionId || subject.sessionKey !== placement.sessionKey) return "unknown";
			return subject.evidence;
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
	const initial = await retainGatewaySessionEntryReadOnly(params.sessionKey, params.agentId, (previous, current) => previous.repositoryWorkspaceId === current.repositoryWorkspaceId, params.cfg);
	try {
		return await materializeCapturedRepositoryWorkspace(params, initial, () => {
			if (!initial.isCurrentAtResponse()) throw new Error("Repository workspace changed during Gateway materialization; retry move");
		});
	} finally {
		initial.release();
	}
}
async function materializeCapturedRepositoryWorkspace(params, initial, assertEntryCurrent) {
	if (initial.entry?.sessionId !== params.sessionId) throw new Error("Session changed before repository materialization");
	const workspaceId = initial.entry.repositoryWorkspaceId;
	if (!workspaceId) return;
	const preparedRepository = await getSessionRepositoryWorkspaceStore().prepare(workspaceId);
	const repository = preparedRepository.workspace;
	if (!repository || repository.agentId !== params.agentId || repository.sessionKey !== initial.canonicalKey || !repository.baseCommit) throw new Error("Repository workspace has no pinned source; retry its cloud preparation");
	const githubHost = resolveConfiguredGitHubHost(params.cfg);
	const remote = parseGitHubRemoteUrl(repository.url, githubHost);
	if (!remote) throw new Error(`Repository workspace does not match the configured GitHub host (${githubHost}); restore its GitHub configuration before retrying the Gateway move`);
	const selected = await readRepositoryGitHubPublicationBranchAsync({
		workspaceId,
		branch: repository.branch,
		pushRepository: `${remote.owner}/${remote.repo}`
	});
	const published = selected.head;
	if (selected.unsettled) throw new Error("Repository publication is awaiting a GitHub effect observation; retry the Gateway move after publication settles");
	const assertOtherOwners = () => {
		params.signal?.throwIfAborted();
		if (preparedRepository.current()?.revision !== repository.revision) throw new Error("Repository workspace changed during Gateway materialization; retry move");
	};
	const assertEntry = (current) => {
		if (current?.sessionId !== params.sessionId || current.lifecycleRevision !== initial.entry?.lifecycleRevision || current.repositoryWorkspaceId !== workspaceId) throw new Error("Repository workspace changed during Gateway materialization; retry move");
	};
	const entrySource = captureSessionEntrySourceAssertion({
		scope: {
			agentId: params.agentId,
			sessionKey: initial.canonicalKey,
			storePath: initial.storePath
		},
		readSource: initial.capturedReadSource,
		fields: [
			"sessionId",
			"lifecycleRevision",
			"repositoryWorkspaceId"
		],
		expected: initial.entry,
		assertCurrent: assertEntryCurrent,
		refuse: () => {
			throw new Error("Repository workspace changed during Gateway materialization; retry move");
		}
	});
	const assertCurrent = composeSessionSourceAssertion([params.assertCurrent, entrySource], (assertSources) => {
		assertSources();
		assertOtherOwners();
	});
	assertCurrent();
	const github = (await prepareGitHubPublicationFact({
		sessionId: params.sessionId,
		sessionKey: initial.canonicalKey,
		agentId: params.agentId,
		assertCurrent: () => {
			assertCurrent();
			return true;
		}
	}))?.github;
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
			assertEntry(current);
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
			...sessionEntryCommitGuardOptions(composeSessionSourceAssertion([assertCurrent, assertSourceCurrent])),
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
function snapshotEntriesForNode(options, nodeId, preparedManifestRefs, preparedPlacements) {
	return nodeEnvironments(options, nodeId).flatMap((environment) => {
		if (isTerminalWorkerEnvironmentState(environment.state) || environment.attachedSessionIds.length !== 1) return [];
		const sessionId = environment.attachedSessionIds[0];
		const facts = preparedPlacements.get(sessionId);
		facts?.assertCurrent();
		const placement = facts?.placement;
		const pending = facts?.pendingResult;
		const unsettled = !facts || placement?.turnClaim || pending?.environmentId === environment.environmentId && pending.ownerEpoch === environment.ownerEpoch;
		const additional = (placement?.state === "starting" || placement?.state === "active" || placement?.state === "draining" || placement?.state === "reconciling") && !unsettled && placement.environmentId === environment.environmentId && placement.workspaceBaseManifestRef && (placement.activeOwnerEpoch === environment.ownerEpoch || placement.state === "starting") ? options.additionalManifestRefs ? preparedManifestRefs.get(sessionId)?.() ?? null : [] : null;
		const exactManifest = placement?.workspaceBaseManifestRef === "device-folder:no-manifest" ? [] : additional !== null && placement?.workspaceBaseManifestRef ? [.../* @__PURE__ */ new Set([placement.workspaceBaseManifestRef, ...additional])].toSorted() : null;
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
		const isCurrent = () => !stopped && transport === currentTransport && currentTransport.isCurrent(node) && (!hostBuild || !bundleRetention?.isEnvironmentOwnedNode(node.nodeId));
		const preparedManifestRefs = /* @__PURE__ */ new Map();
		try {
			if (options.additionalManifestRefs) {
				const environmentIds = new Set(nodeEnvironments(options, node.nodeId).map((environment) => environment.environmentId));
				for (const { placement } of preparedPlacements.values()) if (placement?.environmentId && environmentIds.has(placement.environmentId)) {
					const current = await options.additionalManifestRefs(placement);
					preparedManifestRefs.set(placement.sessionId, current);
				}
			}
			const inventory = await options.placements.prepareMaintenancePlacements();
			const placements = (() => {
				try {
					inventory.assertCurrent();
					return inventory.placements;
				} finally {
					inventory.release();
				}
			})();
			const environments = nodeEnvironments(options, node.nodeId);
			const retainCurrentBuild = currentBuild && (hostBuild || environments.some((environment) => !isTerminalWorkerEnvironmentState(environment.state) && environment.bootstrapReceipt?.bundleHash !== currentBuild.bundleHash));
			const environmentIds = new Set(environments.map((environment) => environment.environmentId));
			const retainedBundleHashes = [.../* @__PURE__ */ new Set([...listRetainedWorkerBundleHashes({
				environments,
				placements: placements.filter((placement) => placement.environmentId !== null && environmentIds.has(placement.environmentId))
			}), ...retainCurrentBuild ? [currentBuild.bundleHash] : []])].toSorted();
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
			const bundleStatusTarget = node.workerHost.bundleStatus === 1 ? hostBuild ?? bundleStatusTargetForNode(options, node.nodeId) : void 0;
			const previousBundleStatus = currentTransport.getBundleStatus?.(node.nodeId);
			const statusInput = bundleStatusTarget && retainedBundleHashes.includes(bundleStatusTarget.bundleHash) && (previousBundleStatus?.bundleHash !== bundleStatusTarget.bundleHash || previousBundleStatus.status.status !== "installed") ? {
				...retentionInput,
				bundleStatusHash: bundleStatusTarget.bundleHash
			} : void 0;
			const input = bundleRetentionSupported && bundlePreparationError === void 0 && bundleHashesFit ? statusInput && Buffer.byteLength(JSON.stringify(statusInput), "utf8") <= 1048576 ? statusInput : retentionInput : baseInput;
			if (!bundleStatusTarget || !input.bundleHashes?.includes(bundleStatusTarget.bundleHash) || previousBundleStatus && previousBundleStatus.bundleHash !== bundleStatusTarget.bundleHash) currentTransport.acceptBundleStatus?.(node, void 0);
			if (bundlePreparationError !== void 0) options.warn(`Node bundle retention skipped (${node.nodeId}): ${bundlePreparationError}`);
			else if (bundleRetentionSupported && !bundleHashesFit) options.warn(`Node bundle retention skipped (${node.nodeId}): ${retainedBundleHashes.length} retained hashes exceed the bounded maintenance request`);
			for (;;) {
				const isDispatchAuthorized = () => {
					try {
						return isCurrent() && isDeepStrictEqual(input.retain, snapshotEntriesForNode(options, node.nodeId, preparedManifestRefs, preparedPlacements));
					} catch {
						return false;
					}
				};
				if (!isDispatchAuthorized()) return;
				const result = await currentTransport.invoke({
					node,
					command: NODE_WORKER_WORKSPACE_RETAIN_COMMAND,
					params: input,
					timeoutMs: RETAIN_COMMAND_TIMEOUT_MS,
					signal: abortController.signal,
					isDispatchAuthorized,
					isCompletionAuthorized: isCurrent
				});
				if (!isCurrent()) return;
				if (!result.ok) throw new Error(result.error?.message ?? `workspace retain command failed (${result.error?.code ?? "unknown"})`);
				const payload = parseNodeWorkerResponse(result.payloadJSON || "null", "workspace retain command");
				const retained = parseNodeWorkerWorkspaceRetainResult(payload);
				if (!retained) throw new Error("workspace retain command violated its private result contract");
				if (retained.applied && retained.bundleGeneration !== void 0) acknowledgedBundleGenerationByNode.set(node.nodeId, {
					connId: node.connId,
					generation: retained.bundleGeneration
				});
				if (!retained.applied || !retained.hasMore) {
					const bundleStatus = retained.bundleStatus;
					if (retained.applied && bundleStatusTarget && bundleStatus && bundleStatus.bundleHash === input.bundleStatusHash) currentTransport.acceptBundleStatus?.(node, {
						bundleHash: bundleStatusTarget.bundleHash,
						status: bundleStatus.status === "installed" ? {
							status: "installed",
							version: bundleStatusTarget.openclawVersion
						} : { status: "missing" }
					});
					else if (input.bundleStatusHash) currentTransport.acceptBundleStatus?.(node, void 0);
					return;
				}
			}
		} finally {
			for (const read of preparedManifestRefs.values()) read[Symbol.dispose]();
		}
	};
	const publishSnapshot = async (currentTransport, node) => {
		const prepared = /* @__PURE__ */ new Map();
		try {
			const sessionIds = new Set(nodeEnvironments(options, node.nodeId).flatMap((environment) => !isTerminalWorkerEnvironmentState(environment.state) && environment.attachedSessionIds.length === 1 ? environment.attachedSessionIds : []));
			for (const sessionId of sessionIds) prepared.set(sessionId, await options.placements.prepareRuntimeRefresh(sessionId));
			await publishPreparedSnapshot(currentTransport, node, prepared);
		} finally {
			for (const facts of prepared.values()) facts.release();
		}
	};
	const schedule = (nodeId) => {
		if (stopped) return Promise.resolve();
		const target = nodeId || void 0;
		pendingNodes.add(target);
		if (!started || !transport) return Promise.resolve();
		const previous = operations.get(nodeId);
		if (previous) return previous;
		const run = async () => {
			do {
				pendingNodes.delete(target);
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
			} while (pendingNodes.has(target));
		};
		const operation = runOutsideAsyncWorkScope(run).finally(() => {
			operations.delete(nodeId);
			if (!stopped && pendingNodes.has(target)) schedule(nodeId);
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
			const targets = pendingNodes.has(void 0) ? [void 0] : [...pendingNodes];
			pendingNodes.clear();
			return Promise.all((targets.length ? targets : [void 0]).map(schedule)).then(() => void 0);
		},
		schedule,
		async stop() {
			stopped = true;
			started = false;
			abortController.abort(/* @__PURE__ */ new Error("node workspace retention stopped"));
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
const IDLE_DISK_SPACE_REFRESH_MS = 9e5;
const DISK_SPACE_RETRY_MS = 6e4;
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
	if (typeof value !== "string" || !/^(?:0|[1-9]\d*)$/u.test(value)) throw new Error(`Worker disk-space check returned an invalid ${field}`);
	const parsed = BigInt(value);
	if (parsed > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error(`Worker disk-space check ${field} exceeds the protocol limit`);
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
		throw new Error("Worker disk-space check returned invalid JSON");
	}
	if (!isRecord(value)) throw new Error("Worker disk-space check returned an invalid result");
	const availableBytes = parseSafeByteCount(value.availableBytes, "available byte count");
	const totalBytes = parseSafeByteCount(value.totalBytes, "total byte count");
	if (availableBytes > totalBytes) throw new Error("Worker disk-space check returned more available bytes than total bytes");
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
	let dirty = true;
	let nextSweepAtMs = 0;
	let lastRunnerVersion = -1;
	const read = (placement) => {
		const observation = observations.get(placement.sessionId);
		return observation && hasExactBinding(observation, placement) ? observation.snapshot : void 0;
	};
	const probe = async (placement) => {
		const stale = staleBindings.get(placement.sessionId);
		if (stale && hasExactBinding(stale, placement)) return;
		if (params.runnerAvailability.read(placement)?.status === "offline") return;
		const runnerVersion = params.runnerAvailability.version();
		const previousObservation = observations.get(placement.sessionId);
		if (previousObservation && hasExactBinding(previousObservation, placement) && previousObservation.updatedAtMs === placement.updatedAtMs && previousObservation.runnerVersion === runnerVersion && now() - previousObservation.snapshot.observedAtMs < IDLE_DISK_SPACE_REFRESH_MS) return;
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
		if (result.termination !== "exit" || result.code !== 0) throw new Error("Worker disk-space check command failed");
		const snapshot = parseDiskSpaceProbe(result.stdout, Math.max(0, Math.min(Number.MAX_SAFE_INTEGER, Math.floor(now()))));
		const candidate = {
			...placement,
			snapshot,
			runnerVersion
		};
		const previous = read(placement);
		observations.set(placement.sessionId, candidate);
		if (!previous || previous.availableBytes !== snapshot.availableBytes || previous.totalBytes !== snapshot.totalBytes || previous.observedAtMs !== snapshot.observedAtMs) observationVersion += 1;
		if (previous?.status !== snapshot.status && (previous || snapshot.status !== "ok")) emitSessionLifecycleEvent({
			sessionKey: placement.sessionKey,
			agentId: placement.agentId,
			reason: "worker-disk-space"
		});
	};
	const sweep = async () => {
		if (!dirty && now() < nextSweepAtMs && lastRunnerVersion === params.runnerAvailability.version()) return;
		dirty = false;
		lastRunnerVersion = params.runnerAvailability.version();
		nextSweepAtMs = now() + DISK_SPACE_RETRY_MS;
		const inventory = await params.placements.prepareMaintenancePlacements();
		let active;
		try {
			active = inventory.placements.filter((placement) => placement.state === "active");
		} finally {
			inventory.release();
		}
		const activeBySession = new Map(active.map((placement) => [placement.sessionId, placement]));
		for (const [sessionId, observation] of observations) if (!hasExactBinding(observation, activeBySession.get(sessionId))) {
			observations.delete(sessionId);
			observationVersion += 1;
		}
		for (const [sessionId, binding] of staleBindings) if (!hasExactBinding(binding, activeBySession.get(sessionId))) staleBindings.delete(sessionId);
		const tasks = active.map((placement) => () => probe(placement));
		await runTasksWithConcurrency({
			tasks,
			limit: DISK_SPACE_PROBE_CONCURRENCY,
			onTaskError: (error, index) => {
				const placement = active[index];
				if (placement && error instanceof StaleWorkerBuildError) staleBindings.set(placement.sessionId, { ...placement });
				params.warn(`Worker disk-space check failed${placement ? ` (${placement.sessionId})` : ""}: ${formatErrorMessage(error)}`);
			}
		});
		nextSweepAtMs = Math.min(Infinity, ...active.map((placement) => {
			const stale = staleBindings.get(placement.sessionId);
			if (stale && hasExactBinding(stale, placement) || params.runnerAvailability.read(placement)?.status === "offline") return Infinity;
			const observation = observations.get(placement.sessionId);
			return observation && hasExactBinding(observation, placement) ? Math.max(now() + DISK_SPACE_RETRY_MS, observation.snapshot.observedAtMs + IDLE_DISK_SPACE_REFRESH_MS) : now() + DISK_SPACE_RETRY_MS;
		}));
	};
	return {
		read,
		sweep,
		invalidate() {
			dirty = true;
		},
		nextSweepAtMs: () => dirty || lastRunnerVersion !== params.runnerAvailability.version() ? now() + DISK_SPACE_RETRY_MS : nextSweepAtMs,
		version: () => observationVersion
	};
}
//#endregion
//#region src/gateway/worker-environments/placement-authorization.ts
/** Keep prepared grant authority attached while callers add signal or provider checks. */
function composePlacementAuthorization(source, check) {
	return Object.assign(() => {
		check();
		source?.();
	}, {
		assertWorkerGrant: () => {
			check();
			(source?.assertWorkerGrant ?? source)?.();
		},
		assertWorkerLifetime: () => {
			check();
			(source?.assertWorkerLifetime ?? source)?.();
		}
	});
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
function coordinateWorkerPlacementDispatch(service, admitDispatch, recoverInitialPlacement, reportReconciliation, sessionPreparation) {
	const sessionTails = /* @__PURE__ */ new Map();
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
		if (sessionIds.some((key) => sessionTails.has(key) || operationsInFlight.has(key))) {
			if (!wait || sessionIds.length !== 1) return false;
			if (operationsInFlight.has(sessionIds[0])) {
				await run("results-only");
				return true;
			}
		}
		const admission = reserveSessions(sessionIds);
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
	const runAfterStops = async (request, run, authorize, callerSignal) => {
		const predecessors = pendingOperations(request.sessionId).filter((pending) => pending.kind === "reclaim");
		await racePromiseWithAbortSignal(Promise.allSettled(predecessors.map((pending) => pending.operation)), callerSignal);
		return await admitDispatch(request, (signal, assertSessionCurrent) => runSessionOperation(request.sessionId, signal, () => run(composePlacementAuthorization(authorize, () => assertSessionCurrent?.()), signal)), authorize, callerSignal);
	};
	const coordinator = {
		async ensurePlacement(params) {
			if (!sessionPreparation) throw new Error("Session placement preparation is unavailable");
			return await ensureWorkerSessionPlacement({
				...sessionPreparation,
				...params,
				dispatch: coordinator.dispatch,
				waitForInitialPlacement: coordinator.waitForInitialPlacement,
				startDispatch: async (request, onTransition, authorize, signal) => {
					const started = createDeferredCore();
					const requestedHandoff = createDeferredCore();
					const releaseAuthority = params.retainDispatch?.();
					const operation = coordinator.dispatch(request, (placement) => {
						started.resolve(placement);
						onTransition?.(placement);
					}, authorize, signal, (dispatchSignal) => racePromiseWithAbortSignal(requestedHandoff.promise, dispatchSignal));
					if (releaseAuthority) operation.then(releaseAuthority, releaseAuthority);
					operation.catch((error) => {
						try {
							sessionPreparation.warn("Worker setup failed: " + String(error));
						} catch {}
					});
					try {
						await Promise.race([started.promise, operation]);
						return { release: () => requestedHandoff.resolve() };
					} catch (error) {
						requestedHandoff.resolve();
						throw error;
					}
				}
			});
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
			let nextOwner = createDeferredCore();
			const observe = (owner) => nextOwner.resolve(matchesOwner(owner) ? owner : void 0);
			const waiters = setupWaiters.get(placement.sessionId) ?? /* @__PURE__ */ new Set();
			waiters.add(observe);
			setupWaiters.set(placement.sessionId, waiters);
			try {
				if (initialOwner) nextOwner.resolve(initialOwner);
				else if (recover) recover().catch(nextOwner.reject);
				for (;;) {
					const owner = await racePromiseWithAbortSignal(nextOwner.promise, signal);
					if (!owner) throw missingOwner();
					nextOwner = createDeferredCore();
					const completed = await racePromiseWithAbortSignal(owner.operation, signal);
					if (completed) return completed;
					if (!completed && recover && owner.kind === "recovery" && matchesWorkerPlacementTarget(owner.currentPlacement(), placement)) continue;
					throw new Error("Worker setup did not publish a ready placement. Inspect the setup recovery error.");
				}
			} finally {
				waiters.delete(observe);
				if (waiters.size === 0) setupWaiters.delete(placement.sessionId);
			}
		},
		dispatch: async (request, onTransition, authorize, callerSignal, awaitRequestedHandoff) => {
			callerSignal?.throwIfAborted();
			const inFlight = pendingOperations(request.sessionId).find((pending) => pending.kind === "dispatch");
			if (inFlight) {
				if (!isDeepStrictEqual(inFlight.request, request)) throw new Error(`Session ${request.sessionKey} is already dispatching another request`);
				return await racePromiseWithAbortSignal(joinOperation(inFlight.operation, authorize), callerSignal);
			}
			const tracked = trackPlacementOperation((report) => runAfterStops(request, (current, signal) => service.dispatch(request, report, current, signal, awaitRequestedHandoff), authorize, callerSignal), onTransition);
			registerOperation({
				kind: "dispatch",
				request,
				...tracked
			});
			return await tracked.operation;
		},
		forceDestroyEnvironment: async (environmentId, onCleanupError) => {
			const sessionIds = new Set(await service.readEnvironmentSessionIds(environmentId));
			for (const sessionId of service.getEnvironmentAttachedSessionIds(environmentId)) sessionIds.add(sessionId);
			for (const [sessionId, operations] of operationsInFlight) if ([...operations].some((entry) => entry.currentPlacement()?.environmentId === environmentId)) sessionIds.add(sessionId);
			const admission = reserveSessions([...sessionIds]);
			return await admission.hold((async () => {
				await admission.ready;
				return await service.forceDestroyEnvironment(environmentId, onCleanupError);
			})());
		},
		move: async (request, onTransition, authorize) => {
			const inFlight = pendingOperations(request.sessionId).find((pending) => pending.kind === "move");
			if (inFlight) {
				if (!isDeepStrictEqual(inFlight.request, request)) throw new Error(`Session ${request.sessionKey} is already moving to another target`);
				return await joinOperation(inFlight.operation, authorize);
			}
			const tracked = trackPlacementOperation((report) => runAfterStops(request, (current, signal) => service.move(request, report, current, signal), authorize), onTransition);
			registerOperation({
				kind: "move",
				request,
				...tracked
			});
			return await tracked.operation;
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
			registerOperation({
				kind: "reclaim",
				request,
				...tracked
			});
			return await tracked.operation;
		},
		getEnvironmentAttachedSessionIds: (environmentId) => service.getEnvironmentAttachedSessionIds(environmentId),
		readEnvironmentSessionIds: (environmentId) => service.readEnvironmentSessionIds(environmentId),
		isInterruptedTurn: service.isInterruptedTurn,
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
				}, report, (runRecovery) => admitDispatch(placement, async (signal, assertSessionCurrent) => {
					try {
						signal?.throwIfAborted();
						assertSessionCurrent?.();
						const recovered = await runRecovery(signal);
						assertSessionCurrent?.();
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
	return coordinator;
}
//#endregion
//#region src/gateway/worker-environments/placement-dispatch-orphan-cleanup.ts
async function cleanupPendingWorkspaceResultOrphans(deps, admit, pass) {
	if (getActiveGatewayRootWorkCount({ excludeCurrent: true }) > 0) return false;
	const { placements } = deps;
	const { completedRoots, rootsBySession } = pass;
	const workspaceSessions = /* @__PURE__ */ new Map();
	for (const placement of pass.placements) {
		let root = rootsBySession.get(placement.sessionId);
		if (root === void 0) try {
			const workspace = await deps.resolveWorkspace(placement);
			root = workspace.kind === "local" ? workspace.path : null;
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
//#region src/gateway/worker-environments/placement-dispatch-pending-move.ts
/** Carry the prepared Move's authority across the caller's final teardown await. */
function createPendingGatewayMovePreparation(deps) {
	const { placements } = deps;
	return async (placement, turnClaim, assertCurrent) => {
		const move = (await placements.readProjection([placement.sessionId], { current: true })).moves.get(placement.sessionId);
		if (move?.target.kind !== "gateway") return;
		const assertMoveCurrent = () => {
			assertCurrent();
			assertRequiredWorkerMove(readRuntimeConfig(), move.target);
			if (!placements.validateWorkspaceResultClaim(turnClaim)) throw new Error("Recovered Gateway move lost its workspace result owner");
		};
		assertMoveCurrent();
		await deps.prepareGatewayMove?.({
			sessionId: placement.sessionId,
			sessionKey: placement.sessionKey,
			agentId: placement.agentId,
			assertCurrent: assertMoveCurrent
		});
		assertMoveCurrent();
		return assertMoveCurrent;
	};
}
//#endregion
//#region src/gateway/worker-environments/placement-teardown.ts
async function completeRecoveredWorkspaceTeardown(params) {
	const move = await params.placements.getPlacementMoveAsync(params.placement.sessionId);
	return completeWorkerWorkspaceTeardown({
		placements: params.placements,
		turnClaim: params.turnClaim,
		environmentId: params.placement.environmentId,
		ownerEpoch: params.placement.activeOwnerEpoch,
		move: params.destination === "reclaimed" ? void 0 : move,
		currentCheck: params.currentCheck
	});
}
/** Close the workspace-result fence, then advance the exact drained owner into reconciliation. */
async function completeWorkerWorkspaceTeardown(params) {
	const drained = await params.placements.completeWorkspaceResultAndReleaseTurn(params.turnClaim, void 0, params.currentCheck);
	if (drained.state !== "draining" || drained.environmentId !== params.environmentId || drained.activeOwnerEpoch !== params.ownerEpoch) throw new Error(`Session ${params.turnClaim.sessionId} lost its drained placement owner`);
	const reconciling = await params.placements.startReconcile({
		sessionId: drained.sessionId,
		environmentId: params.environmentId,
		ownerEpoch: params.ownerEpoch,
		expectedGeneration: drained.generation
	});
	if (reconciling.state !== "reconciling") throw new Error(`Session ${params.turnClaim.sessionId} did not enter reconciliation`);
	const move = params.move;
	if (move) try {
		const completed = await params.placements.completePlacementMoveSourceToLocal({
			operationId: move.operationId,
			sessionId: reconciling.sessionId,
			expectedGeneration: reconciling.generation
		}, { assertCurrent: () => assertRequiredWorkerMove(readRuntimeConfig(), move.target) });
		if (completed.state !== "local") throw new Error(`Session ${params.turnClaim.sessionId} move did not finish local`);
		return completed;
	} catch (error) {
		if (!(error instanceof RequiredWorkerProfileError)) throw error;
	}
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
	const prepareGatewayMove = createPendingGatewayMovePreparation(deps);
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
					if (workspace.kind === "device-folder") {
						await environments.stopTunnel(active.environmentId, active.activeOwnerEpoch);
						recovery.assertCurrent();
						await placements.acceptWorkspaceResult(turnClaim, recovery.assertCurrent);
						await placements.closeWorkerTurnToolState(turnClaim);
						if (active.state === "draining") {
							await environments.destroy(active.environmentId);
							await completeRecoveredWorkspaceTeardown({
								placements,
								placement: active,
								turnClaim
							});
						} else await placements.completeWorkspaceResultAndReleaseTurn(turnClaim, recovery.assertCurrent);
						return;
					}
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
					const blockedMove = projection.moves.get(pending.sessionId);
					const preserveBlockedMove = blockedMove?.target.kind === "gateway" && Boolean(readRuntimeConfig().cloudWorkers?.requiredProfile);
					const finishBlockedMove = preserveBlockedMove && pending.workspaceAcceptedAtMs !== null && environment?.state === "destroyed";
					const canPreserveEnvironment = (current, move) => {
						const currentEnvironment = environments.get(pending.environmentId);
						if (preserveBlockedMove) return current?.state === "draining" && isCurrentWorkerWorkspacePendingResultOwner(current, pending) && current.environmentId === pending.environmentId && current.activeOwnerEpoch === pending.ownerEpoch && move?.operationId === blockedMove?.operationId && move?.source.generation + 1 === current.generation && move.source.environmentId === current.environmentId && move.source.ownerEpoch === current.activeOwnerEpoch && (finishBlockedMove ? currentEnvironment?.state === "destroyed" : Boolean(readRuntimeConfig().cloudWorkers?.requiredProfile) && isCurrentActiveWorkerEnvironment(current, currentEnvironment));
						return current?.state === "active" && current.generation === pending.placementGeneration && current.environmentId === pending.environmentId && current.activeOwnerEpoch === pending.ownerEpoch && Boolean(currentEnvironment?.nodeDeviceId) && currentEnvironment?.nodeDeviceId === environment?.nodeDeviceId && currentEnvironment?.leaseId === environment?.leaseId && isCurrentActiveWorkerEnvironment(current, currentEnvironment) && move === null && !reclaimResult;
					};
					const preserveEnvironment = !finishBlockedMove && canPreserveEnvironment(active, blockedMove ?? null);
					const currentCheck = { assertPlacementCurrent(current, move) {
						if ((preserveEnvironment || finishBlockedMove) && !canPreserveEnvironment(current, move)) throw new Error("Recovered workspace result lost its active environment owner");
					} };
					const assertPreservedEnvironment = () => {
						recovery.assertCurrent();
						if (preserveEnvironment && (!canPreserveEnvironment(active, blockedMove ?? null) || !placements.validateWorkspaceResultClaim(turnClaim))) throw new Error("Recovered workspace result lost its active environment owner");
					};
					const destroyResultEnvironment = async () => {
						if (!preserveEnvironment && !finishBlockedMove) {
							const assertMoveCurrent = await prepareGatewayMove(active, turnClaim, recovery.assertCurrent);
							await destroyPendingEnvironment(active, assertMoveCurrent ?? recovery.assertCurrent);
						}
					};
					const completeResult = () => {
						assertPreservedEnvironment();
						return preserveEnvironment ? placements.completeWorkspaceResultAndReleaseTurn(turnClaim, recovery.assertCurrent, currentCheck) : completeRecoveredWorkspaceTeardown({
							placements,
							placement: active,
							turnClaim,
							...finishBlockedMove ? {
								destination: "reclaimed",
								currentCheck
							} : {}
						});
					};
					const settleRecoveredResult = async (result, completion = {
						beforeComplete: destroyResultEnvironment,
						complete: completeResult
					}) => {
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
					const teardownRequired = !preserveEnvironment && (!sameGatewayInstance || reclaimResult || Boolean(stagedResultRef) || pending.workspaceAcceptedAtMs !== null && (workspace.kind === "local" || environment?.state === "destroyed"));
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
					const acceptedUnstaged = workspace.kind === "local" && !stagedResultRef && pending.workspaceAcceptedAtMs !== null;
					if (acceptedUnstaged || stagedResultRef && !stagedResultExists) {
						if (workspace.kind === "repository") throw new Error("Repository checkpoint is missing; restore its artifact before retrying recovery");
						if (pending.workspaceAcceptedAtMs === null) return;
						if (acceptedUnstaged) {
							await prepareAcceptedPublication(deps, turnClaim);
							await settleRecoveredResult({
								stagedResultRef: null,
								conflictPaths: [],
								retainPriorConflict: reclaimResult
							});
						} else {
							if (turnClaim.owner.kind === "worker") {
								recovery.assertCurrent();
								await placements.closeWorkerTurnToolState(turnClaim);
							}
							await destroyResultEnvironment();
							await prepareAcceptedPublication(deps, turnClaim);
							await deps.publishAcceptedWorkspace?.(turnClaim);
							await completeResult();
						}
						if (!preserveEnvironment) await environments.stopTunnel(active.environmentId, active.activeOwnerEpoch).catch(() => void 0);
						return;
					}
					const { adapter: journal } = createWorkspaceResultJournal({
						placement: {
							...active,
							generation: pending.placementGeneration
						},
						placements,
						turnClaim,
						assertCurrent: recovery.assertCurrent,
						assertCommitCurrent: assertPreservedEnvironment,
						current: currentCheck
					});
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
							((finishBlockedMove ? recovery.assertCurrent : await prepareGatewayMove(active, turnClaim, recovery.assertCurrent)) ?? recovery.assertCurrent)();
							await completeResult();
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
									const assertMoveCurrent = !preserveEnvironment ? await prepareGatewayMove(active, turnClaim, recovery.assertCurrent) : void 0;
									if (sameGatewayInstance && !reclaimResult || preserveEnvironment) {
										assertPreservedEnvironment();
										await quiescence.resume();
									} else {
										recovery.assertCurrent();
										assertMoveCurrent?.();
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
						const currentFacts = await placements.readProjection([pending.sessionId], { current: true });
						const current = currentFacts.placements.get(pending.sessionId);
						const candidate = currentFacts.pendingResults.get(pending.sessionId);
						const currentPending = candidate && candidate.sessionId === pending.sessionId && candidate.environmentId === pending.environmentId && candidate.ownerEpoch === pending.ownerEpoch && candidate.placementGeneration === pending.placementGeneration && candidate.claimId === pending.claimId && candidate.runId === pending.runId && candidate.gatewayInstanceId === pending.gatewayInstanceId ? candidate : void 0;
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
	const failedPlacements = /* @__PURE__ */ new Map();
	for (const placement of await placements.listForReconcileAsync()) if (placement.environmentId === environmentId && placement.workspaceBaseManifestRef === "device-folder:no-manifest") throw new Error("Device folders cannot be abandoned onto the Gateway; reconnect the device and stop its session instead.");
	const recoveryError = FORCED_WORKER_ABANDONMENT_ERROR;
	const journalOwners = (await params.placements.listWorkspaceReconciliationOwners()).filter((owner) => owner.environmentId === environmentId);
	const journalCleanups = [];
	const retainedJournalSessions = /* @__PURE__ */ new Set();
	for (const owner of journalOwners) {
		const placement = await placements.getAsync(owner.sessionId);
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
		const placement = await placements.getAsync(pending.sessionId);
		if (isCurrentWorkerWorkspacePendingResultOwner(placement, pending)) {
			const finalRef = pending.stagedResultRef ?? workerWorkspaceResultRef(pending.claimId);
			stagedResultCleanups.push({
				placement,
				refs: [finalRef, preparedWorkerWorkspaceResultRef(finalRef)],
				repositoryWorkspaceId: pending.repositoryWorkspaceId
			});
			const claim = projectPlacementTurnClaim(placement);
			if (claim && claim.claimId === pending.claimId && claim.runId === pending.runId) await placements.closeWorkerTurnToolState(claim);
			await placements.failWorkspaceResultAndReleaseTurn(pending, recoveryError);
		} else await placements.abandonWorkspaceResult(pending);
	}
	for (const placement of await placements.listForReconcileAsync()) {
		if (placement.environmentId !== environmentId) continue;
		let current = placement;
		if (current?.state === "active") current = await placements.startDrain({
			sessionId: current.sessionId,
			environmentId: current.environmentId,
			ownerEpoch: current.activeOwnerEpoch,
			expectedGeneration: current.generation
		});
		if (current?.state === "draining") {
			const claim = projectPlacementTurnClaim(current);
			if (claim) await placements.closeWorkerTurnToolState(claim);
			current = await placements.startReconcile({
				sessionId: current.sessionId,
				environmentId: current.environmentId,
				ownerEpoch: current.activeOwnerEpoch,
				expectedGeneration: current.generation,
				forceLocalClaim: true
			});
		}
		if (current && (current.state !== "failed" || current.recoveryError !== recoveryError)) current = await placements.fail({
			sessionId: current.sessionId,
			expectedGeneration: current.generation,
			recoveryError
		});
		failedPlacements.set(current.sessionId, current);
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
		if (workspace.kind !== "local") continue;
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
	return failedPlacements;
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
function createPlacementRecoveryActions(deps, initialPlacements) {
	const { environments, failure, placements } = deps;
	const interruptedClaims = new Set(initialPlacements.flatMap((placement) => {
		const claim = projectWorkerSessionTurnClaim(placement);
		return claim ? [serializeWorkerSessionTurnClaim(claim)] : [];
	}));
	const isInterruptedTurn = (placement) => {
		const claim = projectWorkerSessionTurnClaim(placement);
		return Boolean(claim && interruptedClaims.has(serializeWorkerSessionTurnClaim(claim)));
	};
	let orphanCleanupPending;
	const reconcileActivePlacement = async (initialPlacement, mode, facts) => {
		let placement = initialPlacement;
		let environment = environments.get(placement.environmentId);
		const claim = projectWorkerSessionTurnClaim(placement);
		const interrupted = isInterruptedTurn(placement);
		if ((mode === "restart" || interrupted) && placement.turnClaim) {
			if (claim && interrupted && environment?.nodeDeviceId && isCurrentActiveWorkerEnvironment(placement, environment) && !facts.moves.has(placement.sessionId)) try {
				await environments.stopTunnel(placement.environmentId, placement.activeOwnerEpoch);
				await placements.closeWorkerTurnToolState(claim);
				const currentFacts = await placements.readProjection([placement.sessionId], { current: true });
				const current = currentFacts.placements.get(placement.sessionId);
				const currentEnvironment = environments.get(placement.environmentId);
				if (current?.state !== "active" || current.generation !== placement.generation || currentEnvironment?.nodeDeviceId !== environment.nodeDeviceId || !isCurrentActiveWorkerEnvironment(current, currentEnvironment) || currentFacts.moves.has(placement.sessionId)) throw new Error("Interrupted worker owner changed while stopping");
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
		if (placement.workspaceBaseManifestRef === "device-folder:no-manifest" && (!environment || workerDisappearanceError(environment) || isUnavailableEnvironment(environment))) return;
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
			await placements.adoptActive({
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
		if (mode === "startup") orphanCleanupPending = initialPlacements.length > 0 ? {
			placements: initialPlacements,
			rootsBySession: /* @__PURE__ */ new Map(),
			completedRoots: /* @__PURE__ */ new Set()
		} : void 0;
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
		reconcileActive,
		isInterruptedTurn
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
		if (error instanceof WorkerPlacementAdmissionTargetError || error instanceof WorkerDispatchTargetChangedError || !options.isShuttingDown?.()) return;
		const current = await placements.getAsync(owned.sessionId);
		if (current?.state !== "provisioning" || current.state !== owned.state || current.generation !== owned.generation || current.environmentId !== owned.environmentId) return;
		const environment = current.environmentId ? environments.get(current.environmentId) : void 0;
		if (!environment || !isPendingProvisioningEnvironment(environment, current.environmentId)) return;
		await environments.recordError(environment, error);
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
	const github = prepared ? void 0 : (await prepareGitHubPublicationFact({
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		assertCurrent: () => {
			params.assertCurrent();
			return true;
		}
	}))?.github;
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
	params.markPhase?.("repositorySync");
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
	params.markPhase?.("repositoryQuiesce");
	const quiescence = await params.tunnel.quiesceWorkspace(synced.remoteWorkspaceDir);
	let reconciliation;
	try {
		params.assertCurrent();
		params.markPhase?.("repositoryReconcile");
		reconciliation = await params.tunnel.reconcileWorkspace({
			remoteWorkspaceDir: synced.remoteWorkspaceDir,
			baseManifestRef: synced.baseManifestRef,
			source: {
				kind: "repository",
				markPhase: params.markPhase,
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
		params.markPhase?.("repositoryQuiescenceRenewal");
		await quiescence.assertActive();
		params.markPhase?.("repositoryVerification");
		await reconciliation.verifyStable();
		params.markPhase?.("repositoryLocalVerification");
		await reconciliation.verifyLocalStable();
		params.assertCurrent();
		params.markPhase?.("repositoryAcceptance");
		await reconciliation.publishStagedResult();
		params.assertCurrent();
		return {
			...synced,
			manifestRef: reconciliation.manifestRef
		};
	} finally {
		params.markPhase?.("repositoryCleanup");
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
			config: readRuntimeConfig()
		});
		if (!eligibility.ok) throw new DevicePlacementUnavailableError(request.deviceId, eligibility.error);
	};
	const requireNodePlacementEligibility = async (request, environment) => {
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
			requirement,
			executionMode: request.executionMode,
			config: readRuntimeConfig()
		});
		if (!eligibility.ok) throw new DevicePlacementUnavailableError(deviceId, eligibility.error);
		return {
			node: eligibility.node,
			requirement: {
				...requirement,
				consumesWorkerSlot: false
			}
		};
	};
	const bindPreparedPlacement = async (params) => {
		const preparation = readWorkerPreparation(params.intent.profileSnapshot);
		if (!preparation || params.intent.preparationKey !== preparation.key) return;
		const assertCurrent = composePlacementAuthorization(params.assertCurrent, () => {
			environments.assertPreparedIntentCurrent(params.request.profileId, params.intent);
		});
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
			if (!admittedNode || !options.isCurrentNodePlacement?.(admittedNode.node, admittedNode.requirement, params.request.executionMode)) continue;
			const { node, requirement } = admittedNode;
			const placement = await placements.bindPreparedEnvironment({
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
				assertCurrent: composePlacementAuthorization(assertCurrent, () => {
					if (!options.isCurrentNodePlacement?.(node, requirement, params.request.executionMode)) throw new Error("Prepared worker lost its current node authority before binding");
				})
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
		params.markPhase?.("attach");
		if (params.workspace.kind === "device-folder" && (params.environment.nodeDeviceId !== params.workspace.deviceId || request.deviceId !== params.workspace.deviceId || request.executionMode !== "worker-turn")) throw new Error("Device folders require an OpenClaw worker on their original paired device");
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
			if (current?.state !== "syncing" || current.generation !== syncingPlacement.generation || current.environmentId !== provisioned.environmentId || current.turnClaim !== null) throw new Error("Worker workspace preparation lost its exact placement owner");
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
			params.markPhase?.("tunnel");
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
				if (!attachedEnvironment || attachedEnvironment.state !== "attached" || attachedEnvironment.destroyRequestedAtMs !== null || attachedEnvironment.ownerEpoch !== ownerEpoch || attachedEnvironment.attachedSessionIds.length !== 1 || attachedEnvironment.attachedSessionIds[0] !== request.sessionId || attachedEnvironment.nodeDeviceId !== params.environment.nodeDeviceId) throw new Error("Worker dispatch lost its exact environment owner before activation");
				return attachedEnvironment;
			};
			const assertSyncOwner = () => {
				assertAttachmentCurrent();
				requireAttachedEnvironment();
			};
			const preparation = readWorkerProjectPreparation(params.environment.profileSnapshot.project);
			let lifecycleHomeDir;
			let assertPreparedBindingCurrent;
			let preparedRepository;
			if (preparation) {
				params.markPhase?.("bind");
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
				lifecycleHomeDir = prepared.homeDir;
				assertPreparedBindingCurrent = prepared.assertCurrent;
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
			params.markPhase?.("repositoryStartup");
			const synced = params.workspace.kind === "device-folder" ? await tunnel.syncWorkspace({
				source: params.workspace,
				sessionId: request.sessionId,
				sessionKey: request.sessionKey,
				generation: placement.generation,
				authorize: assertSyncOwner
			}) : params.workspace.kind === "repository" ? await syncSessionRepositoryWorkspace({
				markPhase: params.markPhase,
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
			if (params.workspace.kind === "device-folder" !== (synced.manifestRef === "device-folder:no-manifest")) throw new Error("Workspace preparation returned a mismatched device-folder manifest marker");
			assertSyncOwner();
			const runProjectLifecycleCommand = environments.runProjectLifecycleCommand;
			if (preparation?.recipe && preparation.runSetupScript !== false) {
				params.markPhase?.("lifecycleCommands");
				await runWorkerProjectLifecycle({
					recipe: preparation.recipe,
					tunnel,
					workspaceDir: synced.remoteWorkspaceDir,
					homeDir: lifecycleHomeDir,
					runSetupCommand: runProjectLifecycleCommand ? (command) => runProjectLifecycleCommand(provisioned.environmentId, ownerEpoch, command) : void 0,
					postCreate: params.environment.lastActivatedAtMs === null,
					assertCurrent: () => {
						assertSyncOwner();
						assertPreparedBindingCurrent?.();
					},
					signal: params.signal
				});
			}
			params.markPhase?.("activation");
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
				options.onActivated?.(request, activePlacement);
			} catch {}
			try {
				environments.schedulePreparedRefill(provisioned.environmentId);
			} catch {}
			return activePlacement;
		} catch (error) {
			activationIndeterminate = error instanceof AcceptedWorkspacePublicationIndeterminateError;
			throw error;
		} finally {
			params.markPhase?.("cleanup");
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
			if (!current || current.state !== "provisioning" && current.state !== "syncing" && current.state !== "starting" || current.state !== recoveryOwnedPlacement.state || current.generation !== recoveryOwnedPlacement.generation || current.environmentId !== environmentId) return;
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
		if ((await placements.listForReconcileAsync()).some((placement) => placement.environmentId === environmentId && placement.workspaceBaseManifestRef === "device-folder:no-manifest")) throw new Error("Device folders cannot be abandoned onto the Gateway; reconnect the device and stop its session instead.");
		const environment = environments.get(environmentId);
		const sessionId = environment?.attachedSessionIds[0];
		const abandonment = environment?.providerId === "device" && environment.nodeDeviceId && environment.sharedHost !== false && environment.attachedSessionIds.length === 1 && sessionId ? {
			sessionId,
			ownerEpoch: environment.ownerEpoch
		} : void 0;
		try {
			return await environments.destroy(environmentId, abandonment, async () => {
				await forceAbandonWorkerEnvironment({
					placements,
					environmentId,
					resolveWorkspace: options.resolveWorkspace,
					onCleanupError
				});
			});
		} catch (error) {
			const current = environments.get(environmentId);
			if (!current || !isUnavailableEnvironment(current)) throw error;
			reportWorkerAbandonmentCleanupError(onCleanupError, error);
			return current;
		}
	});
	const validateAbandonSource = (request, current) => {
		if (current?.state !== "active" && !isForceAbandonedWorkerPlacement(current) || current.generation !== request.source.generation || current.environmentId !== request.source.environmentId || current.activeOwnerEpoch !== request.source.ownerEpoch) throw new Error(`Cannot abandon stale worker placement for session ${request.sessionKey}`);
		if (isForceAbandonedWorkerPlacement(current)) return;
		const runner = options.runnerAvailability.read(current);
		if (!runner) throw new Error("Continue on Gateway can abandon only an active paired-device placement with a known runner binding");
		if (runner.status === "available") throw new Error("Device runner is available; use Move session so OpenClaw can reconcile its workspace safely");
	};
	const abandonSource = async (request, intent, authorize, expectedSource) => {
		const fenced = await options.workspaceOperations.run(intent.source.environmentId, async () => {
			const { placement: current, move } = await placements.getWithMoveAsync(request.sessionId);
			authorize?.();
			if (!current || expectedSource !== void 0 && !matchesWorkerPlacementTarget(current, expectedSource) || current.state !== "active" && current.state !== "draining" && current.state !== "reconciling" && current.state !== "failed" || current.sessionKey !== request.sessionKey || current.agentId !== request.agentId || current.environmentId !== intent.source.environmentId || current.activeOwnerEpoch !== intent.source.ownerEpoch || move?.operationId !== intent.operationId || !move.abandonSource || move.target.kind !== "gateway" || move.source.generation !== intent.source.generation || move.source.environmentId !== intent.source.environmentId || move.source.ownerEpoch !== intent.source.ownerEpoch) throw new Error(`Session ${request.sessionKey} abandonment source changed before teardown`);
			const failed = (await forceAbandonWorkerEnvironment({
				placements,
				environmentId: intent.source.environmentId,
				resolveWorkspace: options.resolveWorkspace
			})).get(request.sessionId);
			if (!isForceAbandonedWorkerPlacement(failed)) throw new Error(`Session ${request.sessionKey} abandonment did not fence its remote owner`);
			const assertCurrent = () => {
				authorize?.();
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
			return failed;
		});
		authorize?.();
		if (fenced?.state !== "failed") throw new Error(`Session ${request.sessionKey} abandonment did not fence its remote owner`);
		const local = await placements.completeAbandonedPlacementMoveSourceToLocal({
			operationId: intent.operationId,
			sessionId: intent.sessionId,
			expectedGeneration: fenced.generation,
			expectedRecoveryError: FORCED_WORKER_ABANDONMENT_ERROR
		}, { assertCurrent: authorize });
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
	const recordError = async (intent, error) => {
		await options.placements.recordPlacementMoveError({
			operationId: intent.operationId,
			sessionId: intent.sessionId,
			error: error instanceof Error ? error.message : String(error)
		});
	};
	const move = async (request, onTransition, authorize, signal) => {
		const assertCurrent = composePlacementAuthorization(authorize, () => {
			signal?.throwIfAborted();
			assertRequiredWorkerMove(readRuntimeConfig(), request.target);
		});
		let intent;
		let local;
		try {
			assertCurrent();
			if (request.abandonSource && request.target.kind !== "gateway") throw new Error("Source abandonment is available only when continuing on the Gateway");
			const destination = request.target.kind === "gateway" ? void 0 : await options.resolveDestination(request, request.target);
			if (request.target.kind !== "gateway" && !destination) throw new Error(`Session ${request.sessionKey} worker move target is unavailable`);
			assertCurrent();
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
					if (request.abandonSource) {
						const { placement, move: existingMove } = await options.placements.getWithMoveAsync(request.sessionId);
						if (!existingMove) {
							options.validateAbandonSource(request, placement);
							const claim = placement ? projectWorkerSessionTurnClaim(placement) : void 0;
							if (claim && prepareNew) {
								await prepareNew(claim.runId);
								const current = await options.placements.getAsync(request.sessionId);
								if (!current || !isCurrentPlacementTurnClaim(current, claim)) throw new Error(`Session ${request.sessionKey} abandonment worker turn changed; retry`);
								options.validateAbandonSource(request, current);
							}
						}
					}
					assertCurrent();
					const started = await options.placements.beginPlacementMove(moveRequest, {
						assertCurrent,
						...request.abandonSource ? { assertNewSource: (placement) => options.validateAbandonSource(request, placement) } : {}
					});
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
			if (local.state === "reclaimed") assertRequiredWorkerMove(readRuntimeConfig(), intent.target);
			if (local.state !== "local") throw new Error(`Session ${request.sessionKey} move did not return to local placement`);
			if (!destination) return local;
			const active = await options.dispatch({
				sessionId: request.sessionId,
				sessionKey: request.sessionKey,
				agentId: request.agentId,
				...destination,
				idempotencyKey: `session-move:${intent.operationId}:dispatch`
			}, onTransition, assertCurrent, signal);
			const completed = await options.placements.completePlacementMoveToWorker({
				operationId: intent.operationId,
				sessionId: request.sessionId,
				expectedGeneration: active.generation,
				environmentId: active.environmentId,
				ownerEpoch: active.activeOwnerEpoch
			}, { assertCurrent });
			if (completed.state !== "active") throw new Error(`Session ${request.sessionKey} move did not finish active`);
			return completed;
		} catch (error) {
			if (intent && local?.state === "local" && signal?.aborted && error === signal.reason) {
				if (await options.placements.cancelPlacementMove({
					operationId: intent.operationId,
					sessionId: request.sessionId,
					expectedLocalGeneration: local.generation
				})) return local;
			}
			const durableIntent = intent ?? await options.placements.getPlacementMoveAsync(request.sessionId);
			if (durableIntent) await recordError(durableIntent, error);
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
			const assertDestination = () => assertRequiredWorkerMove(readRuntimeConfig(), intent.target);
			if (intent.abandonSource) {
				if (intent.target.kind !== "gateway") throw new Error(`Session ${identity.sessionKey} abandonment intent has a non-Gateway target`);
				if (placement.state === "local") {
					await options.placements.cancelPlacementMove(intent);
					return;
				}
				assertDestination();
				await options.abandonSource(identity, intent, assertDestination);
				return;
			}
			if (placement.state === "failed") {
				if (!isFailedWorkerPlacementEnvironmentGone({
					environmentService: options.environments,
					placement
				})) throw new Error(`Session ${identity.sessionKey} failed move environment must finish teardown before retry`);
				await options.placements.cancelPlacementMove(intent);
				return;
			} else if (placement.state === "draining") {
				assertDestination();
				const local = await options.reclaimSource(identity, intent, assertDestination);
				if (local.state === "reclaimed") return;
				if (local.state !== "local") throw new Error(`Session ${identity.sessionKey} move recovery did not return local`);
				placement = local;
			} else if (placement.state === "reconciling") {
				const environment = options.environments.get(placement.environmentId);
				if (environment && !isTerminalWorkerEnvironmentState(environment.state)) return;
				const assertCurrent = assertDestination;
				assertCurrent();
				if (intent.target.kind === "gateway") {
					await options.prepareGatewayMove?.({
						...identity,
						assertCurrent
					});
					assertCurrent();
				}
				placement = await options.placements.completePlacementMoveSourceToLocal({
					operationId: intent.operationId,
					sessionId: intent.sessionId,
					expectedGeneration: placement.generation
				}, { assertCurrent });
			} else if (placement.state === "active") {
				if (placement.environmentId === intent.source.environmentId && placement.activeOwnerEpoch === intent.source.ownerEpoch) throw new Error(`Session ${identity.sessionKey} move recovery found an active source`);
				await options.placements.completePlacementMoveToWorker({
					operationId: intent.operationId,
					sessionId: intent.sessionId,
					expectedGeneration: placement.generation,
					environmentId: placement.environmentId,
					ownerEpoch: placement.activeOwnerEpoch
				});
				return;
			} else if (placement.state !== "local") return;
			if (intent.target.kind === "gateway") {
				if (await options.placements.getPlacementMoveAsync(intent.sessionId)) await options.placements.cancelPlacementMove(intent);
				return;
			}
			await options.placements.fail({
				sessionId: placement.sessionId,
				expectedGeneration: placement.generation,
				recoveryError: RESTART_AUTHORITY_EXPIRED
			});
			await options.placements.cancelPlacementMove(intent);
		} catch (error) {
			await recordError(intent, error);
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
	return async (request, moveIntent, authorize, beforeDrain, onTransition) => await options.runReclaimBarrier({
		...request,
		authorize,
		beforeDrain,
		begin: async (assertCurrent) => {
			const current = await placements.getAsync(request.sessionId);
			assertCurrent?.();
			beforeDrain?.assertCurrent?.();
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
			if (workspace.kind === "device-folder") {
				if (moveIntent || request.recoverToGateway) throw new Error("Device folders cannot move to the Gateway; reconnect the original device.");
				const claimId = `reclaim-${randomUUID()}`;
				const claim = await placements.claimReclaimWorkspaceResult({
					sessionId: current.sessionId,
					sessionKey: current.sessionKey,
					agentId: current.agentId,
					claimId,
					runId: claimId,
					owner: placementTurnOwner(current)
				}, void 0, reauthorize);
				reauthorize?.();
				await placements.acceptWorkspaceResult(claim);
				await placements.closeWorkerTurnToolState(claim);
				reauthorize?.();
				await environments.destroy(current.environmentId);
				const completed = await completeWorkerWorkspaceTeardown({
					placements,
					turnClaim: claim,
					environmentId: current.environmentId,
					ownerEpoch: current.activeOwnerEpoch
				});
				reportPlacementTransition(onTransition, completed);
				await environments.stopTunnel(current.environmentId, current.activeOwnerEpoch).catch(() => void 0);
				return completed;
			}
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
				try {
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
									record: (ref, workspaceId) => {
										assertCurrent();
										return placements.recordStagedWorkspaceResult(reclaimClaim, ref, workspaceId, assertCurrent);
									}
								},
								assertCurrent
							}));
							const applied = await verifyReconciledWorkspaceFinal(reconciliation, quiescence);
							if (reconciliation.changed && !wasAccepted()) throw new Error("Cloud worker stop did not commit its reconciled workspace");
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
									const completed = await completeWorkerWorkspaceTeardown({
										placements,
										turnClaim: reclaimClaim,
										environmentId: current.environmentId,
										ownerEpoch: current.activeOwnerEpoch,
										move: moveIntent
									});
									reportPlacementTransition(onTransition, completed);
									return completed;
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
	}, options.initialPlacements);
	const dispatch = async (request, onTransition, authorize, signal, awaitRequestedHandoff) => {
		try {
			var _usingCtx$4 = _usingCtx();
			const diagnostics = _usingCtx$4.u(startSlowRequestDiagnostics(sessionLog, "slow placement dispatch", "sessions.dispatch", "admission"));
			const assertCurrent = composePlacementAuthorization(authorize, () => {
				signal?.throwIfAborted();
				assertRequiredWorkerDispatch(readRuntimeConfig(), request);
			});
			assertCurrent();
			let placement;
			try {
				signal?.throwIfAborted();
				placement = await options.runLocalBarrier({
					sessionId: request.sessionId,
					sessionKey: request.sessionKey,
					agentId: request.agentId,
					executionMode: request.executionMode,
					authorize: assertCurrent,
					requiredProfile: request.requiredProfile,
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
				await awaitRequestedHandoff?.(signal);
				assertCurrent();
				if (!request.deviceId && request.devicePlacement?.requiredNodeCommands.length && environments.requiresNodeEnrollment?.(request.profileId, request.inheritedProfile?.providerId)) {
					const allowlist = resolveNodeCommandAllowlist(readRuntimeConfig());
					const deniedCommand = request.devicePlacement.requiredNodeCommands.find((command) => !allowlist.has(command));
					if (deniedCommand) throw new Error(`cloud worker node command ${deniedCommand} is not enabled; add it to gateway.nodes.commands.allow and approve the command on the node`);
				}
				diagnostics?.mark("workspacePreparation");
				const workspace = await options.resolveWorkspace(request);
				if (workspace.kind === "device-folder" && (request.deviceId !== workspace.deviceId || request.executionMode !== "worker-turn")) throw new Error("Device folders require an explicit dispatch to their original paired device using the OpenClaw harness.");
				if (workspace.kind === "repository" && !request.deviceId && environments.requiresNodeEnrollment?.(request.profileId, request.inheritedProfile?.providerId) !== true) throw new Error("Repository cloud sessions require a managed-node cloud provider or paired node. Choose one and retry dispatch.");
				const projectPath = workspace.kind === "local" ? workspace.path : void 0;
				await startup.validateDevicePlacement(request);
				assertCurrent();
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
				diagnostics?.mark("reserveClaim");
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
				if (!prepared) diagnostics?.mark("provision");
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
					markPhase: diagnostics?.mark,
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
				diagnostics?.mark("cleanup");
				if (error instanceof AcceptedWorkspacePublicationIndeterminateError) throw error;
				try {
					if (placement && await startup.retainInterruptedProvisioning(placement, error)) throw error;
					const current = placement ? await placements.getAsync(request.sessionId) : void 0;
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
					const finalPlacement = await placements.getAsync(request.sessionId);
					if (finalPlacement) reportPlacementTransition(onTransition, finalPlacement);
				}
				throw error;
			}
		} catch (_) {
			_usingCtx$4.e = _;
		} finally {
			_usingCtx$4.d();
		}
	};
	const reclaimOnce = createWorkerPlacementReclaim(options);
	const reclaimCurrent = async (request, authorize, beforeDrain, initial, completedOperation, onTransition) => {
		const { placement: current, move } = await placements.getWithMoveAsync(request.sessionId);
		authorize?.();
		beforeDrain?.();
		if (current?.state === "draining" && move?.abandonSource) {
			if (move.target.kind !== "gateway" || move.sessionId !== current.sessionId || current.sessionKey !== request.sessionKey || current.agentId !== request.agentId || current.generation !== move.source.generation + 1 || current.environmentId !== move.source.environmentId || current.activeOwnerEpoch !== move.source.ownerEpoch) throw new Error("Abandoned cloud worker move changed before Stop cleanup");
			return await options.runFailedReclaimBarrier({
				...request,
				authorize,
				reclaim: async (reauthorize) => {
					const local = await abandonment.abandonSource(request, move, reauthorize, current);
					reportPlacementTransition(onTransition, local);
					return local;
				}
			});
		}
		if (current?.state === "reclaimed") return current;
		if (current?.state === "local" && matchesWorkerPlacementTarget(current, completedOperation)) return current;
		const owned = current?.state === "local" && initial?.state === "failed" ? initial : current;
		if (owned?.state === "failed" || owned?.state === "provisioning") return await options.runFailedReclaimBarrier({
			...request,
			authorize,
			reclaim: async (reauthorize) => {
				let failedPlacement = await placements.getAsync(request.sessionId);
				reauthorize?.();
				if (request.recoverToGateway) beforeDrain?.();
				if (owned.state === "provisioning") {
					failedPlacement = await failure.cancelProvisioning(failedPlacement, initial, reauthorize);
					reportPlacementTransition(onTransition, failedPlacement);
				}
				if (failedPlacement?.state === "local" && owned.state === "failed" && failedPlacement.generation === owned.generation + 1 && failedPlacement.sessionKey === request.sessionKey && failedPlacement.agentId === request.agentId) return failedPlacement;
				if (failedPlacement?.state !== "failed") throw new Error("Failed cloud worker placement changed during reclaim");
				const cleanupError = await failure.retryFailedTeardown(failedPlacement, reauthorize);
				const failed = await placements.getAsync(request.sessionId);
				if (failed?.state !== "failed") throw new Error("Failed cloud worker placement changed during reclaim");
				if (!isFailedWorkerPlacementEnvironmentGone({
					environmentService: environments,
					placement: failed
				})) throw new Error(cleanupError ?? "Failed cloud worker environment cleanup is still pending");
				const assertCurrent = request.recoverToGateway ? composePlacementAuthorization(reauthorize, () => beforeDrain?.()) : void 0;
				if (assertCurrent) {
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
				}, assertCurrent);
				if (local.state !== "local") throw new Error("Failed cloud worker reclaim did not produce a local placement");
				reportPlacementTransition(onTransition, local);
				return local;
			}
		});
		return await reclaimOnce(request, void 0, authorize, beforeDrain, onTransition);
	};
	const reclaim = async (request, authorize, beforeDrain, serialize = async (run) => await run(), pendingOperations, onTransition) => {
		const assertGatewayRecoverySource = (captured) => {
			if (request.recoverToGateway && readRuntimeConfig().cloudWorkers?.requiredProfile) throw new RequiredWorkerProfileError("Gateway recovery is disabled by the required worker profile policy; Stop retains the workspace for remote recovery.");
			if (!request.recoverToGateway) return;
			const source = captured ?? placements.get(request.sessionId);
			if (source?.state !== "failed" || source.generation !== request.recoverToGateway.expectedGeneration || source.sessionKey !== request.sessionKey || source.agentId !== request.agentId) throw new Error(`Session ${request.sessionKey} changed before Gateway recovery. Retry.`);
			if (!isFailedWorkerPlacementEnvironmentGone({
				environmentService: environments,
				placement: source
			})) throw new Error("Failed cloud worker environment cleanup is still pending; use Stop cloud worker");
		};
		const initial = await placements.getAsync(request.sessionId);
		authorize?.();
		beforeDrain?.();
		assertGatewayRecoverySource(initial);
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
		isInterruptedTurn: recovery.isInterruptedTurn,
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
		const memory = captureSessionActorStorageOwner({
			sessionKey,
			agentId
		}, {
			assertCurrent() {},
			authorize() {}
		});
		if (memory) {
			const identities = [sessionKey, sessionId];
			return () => isSessionWorkAdmissionActive(memory.path, identities) || hasPendingFollowupQueueWork(identities);
		}
		const target = await (await loadSessionRuntime()).resolveGatewaySessionStoreTargetInWorker({
			cfg: options.getConfig(),
			key: sessionKey,
			agentId
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
		await options.reportChanges(async () => {
			const candidates = await options.placements.readRecoveryCandidates();
			const projection = await options.placements.readProjection(candidates.map(({ sessionId }) => sessionId), { current: true });
			for (const { sessionId } of candidates) {
				const placement = projection.placements.get(sessionId);
				if (placement?.state !== "active" || placement.turnClaim) continue;
				const environment = options.environments.get(placement.environmentId);
				const suspendAfter = environment && profiles[environment.profileId]?.suspendAfter;
				if (!environment || !suspendAfter) continue;
				if (now() - placement.updatedAtMs < parseDurationMs(suspendAfter)) continue;
				if (projection.workspaceRecoveryPendingSessionIds.has(placement.sessionId) || projection.moves.has(placement.sessionId) || options.isPlacementOperationInFlight?.(placement.sessionId)) continue;
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
		});
	} };
}
//#endregion
//#region src/gateway/worker-environments/placement-session-retirement.ts
function createPlacementSessionRetirement(deps) {
	const pending = /* @__PURE__ */ new Set();
	let fullScanPending = true;
	const markPending = (sessionId) => {
		pending.add(sessionId);
	};
	const invalidateAll = () => {
		fullScanPending = true;
	};
	const installMaintenancePreservation = (placements) => {
		const unsubscribeFacts = sessionChanges.subscribeFacts((change) => {
			if ("all" in change) {
				if (change.scope === "config" || change.scope === "worker-environments" || sessionChangeScopeAffectsStoredRows(change)) invalidateAll();
			} else if (change.factsInvalidated === true && change.scope !== "transcript" && sessionChangeScopeAffectsStoredRows(change)) invalidateAll();
		});
		const unregisterPreservation = registerSessionMaintenancePreserveKeysProvider(async () => {
			const prepared = await placements.prepareMaintenancePlacements();
			return {
				capture: () => prepared.placements.flatMap((placement) => placement.state === "failed" && isFailedWorkerPlacementEnvironmentGone({
					environmentService: deps.environments,
					placement
				}) ? [] : [placement.sessionKey]),
				dispose: prepared.release
			};
		});
		return () => {
			unsubscribeFacts();
			unregisterPreservation();
		};
	};
	const retireCurrent = async (placement) => {
		if (placement.turnClaim) return false;
		if (placement.environmentId !== null && placement.state !== "reclaimed" && (placement.state !== "failed" || !isFailedWorkerPlacementEnvironmentGone({
			environmentService: deps.environments,
			placement
		}))) return false;
		if (placement.state === "provisioning") return false;
		await deps.placements.retireSessionPlacementAsync({
			sessionId: placement.sessionId,
			expectedState: placement.state,
			expectedGeneration: placement.generation
		});
		if (placement.state === "requested") deps.warn(`Retired ownerless worker placement ${placement.sessionId} because its authoritative session is absent (${placement.state}@${placement.generation})`);
		return true;
	};
	const reconcilePlacement = async (placement, resolveSessionEvidence) => {
		const evidence = await resolveSessionEvidence(placement);
		if (evidence !== "absent") return evidence === "current";
		let current = await deps.placements.getAsync(placement.sessionId);
		if (!current) return true;
		try {
			if (await retireCurrent(current)) return true;
		} catch {
			return false;
		}
		const environmentId = current.environmentId;
		if (!environmentId) return false;
		try {
			await deps.forceDestroyEnvironment(environmentId, (error) => {
				deps.warn(`Worker placement orphan cleanup deferred for ${current?.sessionId ?? placement.sessionId}: ${String(error)}`);
			});
		} catch (error) {
			deps.warn(`Worker placement orphan teardown failed for ${current.sessionId}: ${String(error)}`);
			return false;
		}
		current = await deps.placements.getAsync(placement.sessionId);
		if (!current) return true;
		try {
			return await retireCurrent(current);
		} catch {
			return false;
		}
	};
	const reconcile = async () => {
		const readAll = fullScanPending;
		const sessionIds = [...pending];
		fullScanPending = false;
		pending.clear();
		if (!readAll && sessionIds.length === 0) return;
		try {
			const placements = readAll ? await deps.placements.listAsync() : [...(await deps.placements.getManyAsync(sessionIds)).values()];
			if (placements.length === 0) return;
			await deps.reportChanges(async () => {
				const resolveSessionEvidence = await deps.createSessionEvidenceResolver(placements);
				for (const placement of placements) try {
					if (!await reconcilePlacement(placement, resolveSessionEvidence)) markPending(placement.sessionId);
				} catch (error) {
					markPending(placement.sessionId);
					deps.warn(`Worker placement session evidence check failed for ${placement.sessionId}: ${String(error)}`);
				}
			});
		} catch (error) {
			fullScanPending ||= readAll;
			sessionIds.forEach(markPending);
			throw error;
		}
	};
	return {
		reconcile,
		markPending,
		installMaintenancePreservation
	};
}
//#endregion
//#region src/gateway/worker-environments/repository-workspace-mutation.ts
function createRepositoryWorkspaceMutationService(options) {
	const { placements, environments } = options;
	return { async mutate(params) {
		const scope = {
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			sessionId: params.sessionId,
			storePath: resolveSessionStorePathForScope(params)
		};
		const source = captureSessionEntryMetadataRead(scope, params.assertCurrent);
		const assertCallerCurrent = () => {
			source?.assertCurrent();
			params.assertCurrent();
		};
		const placement = await placements.getAsync(params.sessionId);
		assertCallerCurrent();
		if (placement?.state !== "active") throw new Error("Repository workspace editing requires an active cloud placement");
		return await options.workspaceOperations.run(placement.environmentId, async () => {
			try {
				var _usingCtx$3 = _usingCtx();
				let facts;
				let active = true;
				let unregister = () => {};
				const release = () => {
					active = false;
					facts?.release();
					unregister();
				};
				const retained = _usingCtx$3.u({
					[Symbol.dispose]: release,
					assertCurrent() {
						if (!active) throw new Error("Repository workspace session source is unavailable");
					}
				});
				assertCallerCurrent();
				const workspace = await options.resolveWorkspace(params);
				if (workspace.kind !== "repository") throw new Error("Session no longer owns a cloud repository workspace");
				const environment = environments.get(placement.environmentId);
				if (!isCurrentActiveWorkerEnvironment(placement, environment)) throw new Error("Repository workspace environment is no longer current");
				const assertEntryCurrent = (entry) => {
					params.assertEntryCurrent?.(entry);
					if (entry?.sessionId !== params.sessionId || entry.repositoryWorkspaceId !== workspace.repository.workspaceId || workspace.repository.agentId !== params.agentId || workspace.repository.sessionKey !== params.sessionKey) throw new Error("Repository workspace edit lost its exact session placement owner");
				};
				const currentEntry = await withSessionEntryReadOnlyInWorker(scope, assertCallerCurrent, async (read, owner) => {
					if (!read.ok) throw toErrorObject(read.error, "Repository workspace session read failed");
					assertEntryCurrent(read.value);
					if (owner.kind === "file") {
						if (!facts) throw new Error("Repository workspace session source is unavailable");
						facts.initialize({
							entry: read.value && projectSessionSharingEntry(read.value),
							membership: /* @__PURE__ */ new Set()
						});
					}
					return captureSessionEntryCurrentRead(scope, owner);
				}, (database, identity) => {
					facts = retainPreparedSessionSharingFacts({
						databaseIdentity: identity.key,
						sessionKey: scope.sessionKey,
						acquiring: true
					});
					unregister = registerOpenClawAgentDatabaseAsyncResource({
						...database,
						revoke: release,
						close: async () => release()
					});
				});
				const assertPlacementCurrent = (current) => {
					const currentEnvironment = environments.get(placement.environmentId);
					if (current?.state !== "active" || current.agentId !== params.agentId || current.sessionKey !== params.sessionKey || current.generation !== placement.generation || current.environmentId !== placement.environmentId || current.activeOwnerEpoch !== placement.activeOwnerEpoch || current.remoteWorkspaceDir !== placement.remoteWorkspaceDir || !isCurrentActiveWorkerEnvironment(current, currentEnvironment) || currentEnvironment?.leaseId !== environment?.leaseId) throw new Error("Repository workspace edit lost its exact session placement owner");
				};
				const assertWorkerCurrent = () => {
					assertCallerCurrent();
					currentEntry.assertSourceCurrent();
					retained.assertCurrent();
					assertEntryCurrent(currentEntry.kind === "file" ? facts?.readCurrent()?.entry : currentEntry.readCurrent());
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
								record: (ref, workspaceId) => placements.recordStagedWorkspaceResult(claim, ref, workspaceId, assertWorkerCurrent, currentCheck)
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
			} catch (_) {
				_usingCtx$3.e = _;
			} finally {
				_usingCtx$3.d();
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
		const requiredProfile = readRuntimeConfig().cloudWorkers?.requiredProfile;
		return await params.dispatch({
			...identity,
			profileId,
			...requiredProfile ? { requiredProfile } : {},
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
const loadWorkerTurnExecution = createLazyRuntimeModule(() => import("./worker-turn-execution-YoZmElaN.mjs"));
const loadRemoteExecTurn = createLazyRuntimeModule(() => import("./workspace-result-finalize-Cw2nG4wG.mjs"));
const loadPlacementSandbox = createLazyRuntimeModule(() => import("./placement-sandbox-C4PGASkq.mjs"));
function createWorkerSessionTurnPlacementProvider(options) {
	const activeWorkerTurns = /* @__PURE__ */ new Map();
	const requiredAdmission = createRequiredWorkerTurnAdmission(options);
	return {
		withRequiredSession: options.withRequiredSession,
		usesWorkerInference: requiredAdmission.usesWorkerInference,
		resolveRuntimeOverride: (identity) => resolveWorkerPlacementRuntimeOverride(options.placements, identity),
		assertCompactionSuccessorAllowed: ({ currentTarget }) => assertWorkerPlacementCompactionAllowed(options.placements.get(currentTarget.sessionId)),
		async recoverTerminalTurn(session, assertCurrent) {
			const active = activeWorkerTurns.get(session.sessionId);
			return active && (!session.sessionKey || active.sessionKey === session.sessionKey) ? await active.recoverTerminal?.(() => {
				assertCurrent?.();
				if (activeWorkerTurns.get(session.sessionId) !== active) throw new Error("Terminal worker recovery lost its active run owner");
			}) : void 0;
		},
		async prepareSandbox(params) {
			try {
				var _usingCtx$2 = _usingCtx();
				const cleanup = _usingCtx$2.u(new DisposableStack());
				const prepared = await options.placements.prepareRuntimeRefresh(params.sessionId);
				cleanup.defer(prepared.release);
				const retain = (sandbox, assertCurrent = prepared.assertCurrent) => {
					const lifetime = cleanup.move();
					return {
						sandbox,
						assertCurrent,
						[Symbol.dispose]: () => lifetime.dispose()
					};
				};
				const placement = prepared.placement;
				if (placement?.state !== "active" || placement.executionMode !== "remote-exec" || placement.agentId !== params.agentId || placement.sessionKey !== params.sessionKey) return retain(null);
				const workspace = await options.resolveWorkspace({
					sessionId: placement.sessionId,
					agentId: placement.agentId,
					sessionKey: placement.sessionKey
				});
				prepared.assertCurrent();
				const { createRemoteExecPlacementSandbox } = await loadPlacementSandbox();
				prepared.assertCurrent();
				const sandbox = await createRemoteExecPlacementSandbox({
					config: params.config,
					environments: options.environments,
					workspaceDir: workspace.kind === "local" ? workspace.path : placement.remoteWorkspaceDir,
					placement
				});
				const assertCurrent = () => {
					prepared.assertCurrent();
					const environment = options.environments.get(placement.environmentId);
					assertWorkerSandboxEnvironment(environment, placement, sandbox);
				};
				assertCurrent();
				return retain(sandbox, assertCurrent);
			} catch (_) {
				_usingCtx$2.e = _;
			} finally {
				_usingCtx$2.d();
			}
		},
		executeLocalTurn: (claim, runLocal, assertCurrent) => {
			requiredAdmission.assertLocalAllowed();
			return executeLocalTurn({
				claim,
				placements: options.placements,
				runLocal,
				assertCurrent
			});
		},
		async executeTurn(claim, inputTurn, runLocal, onAdmitted, assertRunCurrent) {
			const previous = activeWorkerTurns.get(claim.sessionId);
			const reply = await prepareWorkerTurnReplyDelivery(previous, inputTurn);
			const execution = withRequiredSessionPlacement(claim, {
				config: inputTurn.config,
				assertCurrent: assertRunCurrent,
				signal: inputTurn.abortSignal
			}, async () => {
				try {
					var _usingCtx3 = _usingCtx();
					const restartSignal = getGatewayRestartDrainSignal();
					const assertCurrent = composeSessionSourceAssertion([assertRunCurrent], (assertSource) => {
						inputTurn.abortSignal?.throwIfAborted();
						assertSource();
					});
					const runLocalTurn = (preparedPlacement) => executeLocalTurn({
						claim,
						placements: options.placements,
						runLocal,
						preparedPlacement,
						sessionReader: getReplyOperationSessionReader(inputTurn.replyOperation),
						assertCurrent
					});
					const prepared = await options.placements.prepareRuntimeRefresh(claim.sessionId);
					try {
						assertCurrent();
						prepared.assertCurrent();
					} catch (error) {
						prepared.release();
						throw error;
					}
					const current = prepared.placement;
					if (!current && inputTurn.modelRun === true && !claim.sessionKey?.trim()) {
						prepared.release();
						return await runLocal();
					}
					if (!current || current.state === "local") return await runLocalTurn(prepared);
					prepared.release();
					let identity = resolvePlacementIdentity(claim, current);
					const reportProvisioning = () => emitAgentRunStatusEvent({
						runId: claim.runId,
						phase: "provisioning_environment",
						sessionKey: identity.sessionKey,
						agentId: identity.agentId
					});
					let initialSetup;
					_usingCtx3.a({ [Symbol.asyncDispose]: async () => initialSetup?.release() });
					const initialSetupSource = createDynamicSessionSourceAssertion(() => initialSetup?.assertCurrent, () => {
						throw new Error("Worker setup authority changed during turn admission");
					});
					const assertAdmissionCurrent = composeSessionSourceAssertion([assertRunCurrent, initialSetupSource], (assertSources) => {
						inputTurn.abortSignal?.throwIfAborted();
						assertSources();
					});
					const readRoutablePlacement = async (message, cause) => {
						const refreshed = await options.placements.getAsync(identity.sessionId);
						assertAdmissionCurrent();
						if (!refreshed) throw new Error(message, cause === void 0 ? void 0 : { cause });
						return refreshed;
					};
					let placement;
					let turnClaim;
					let recoveredAdmission = false;
					let admissionReported = false;
					let userMessagePersisted = inputTurn.suppressNextUserMessagePersistence === true;
					let preparedResultPending = Boolean(prepared.pendingResult && (prepared.pendingResult.runId !== claim.runId || !current.turnClaim));
					let routablePlacement = await requiredAdmission.recoverInterruptedTurn(current, inputTurn, assertAdmissionCurrent);
					for (;;) {
						if (routablePlacement.state === "local") return await runLocalTurn();
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
							preparedResultPending = void 0;
							const ready = await waitForInitialWorkerPlacement({
								placements: options.placements,
								placement: routablePlacement,
								turn,
								wait: options.waitForInitialPlacement,
								assertRunCurrent
							});
							routablePlacement = ready.placement;
							const previousSetup = initialSetup;
							initialSetup = ready;
							await previousSetup?.release();
						}
						if (routablePlacement.state === "reclaimed" || routablePlacement.state === "failed" && routablePlacement.activeOwnerEpoch !== null) {
							reportProvisioning();
							preparedResultPending = void 0;
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
						const resultPending = preparedResultPending ?? await hasWorkerResultToSettle(options.placements, identity.sessionId, claim.runId);
						preparedResultPending = void 0;
						if (resultPending) {
							await waitForPendingWorkerResult({
								placements: options.placements,
								sessionId: identity.sessionId,
								...turn.abortSignal ? { signal: turn.abortSignal } : {}
							});
							routablePlacement = await readRoutablePlacement("Cloud worker placement disappeared after workspace reconciliation");
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
							routablePlacement = await readRoutablePlacement("Cloud worker placement disappeared while waiting for runtime refresh");
							continue;
						}
						const assertClaimCurrent = () => {
							assertAdmissionCurrent();
							if (options.environments.readRuntimeRefresh?.(environmentId)) throw new WorkerRuntimeRefreshPendingError("Worker runtime refresh started during turn admission");
						};
						const remoteExec = placement.executionMode === "remote-exec";
						let admitted;
						try {
							admitted = await claimWorkerTurn({
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
							const refreshing = error instanceof WorkerRuntimeRefreshPendingError;
							if (!refreshing) {
								if (!remoteExec || !(error instanceof ActiveTurnClaimError) || !await hasWorkerResultToSettle(options.placements, identity.sessionId, claim.runId)) throw error;
								await waitForPendingWorkerResult({
									placements: options.placements,
									sessionId: identity.sessionId,
									...turn.abortSignal ? { signal: turn.abortSignal } : {}
								});
							}
							routablePlacement = await readRoutablePlacement(refreshing ? "Cloud worker placement disappeared during runtime refresh admission" : "Cloud worker placement disappeared after workspace reconciliation", error);
							continue;
						}
						if (!admitted) {
							routablePlacement = await readRoutablePlacement("Cloud worker placement disappeared after workspace reconciliation");
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
							try {
								var _usingCtx4 = _usingCtx();
								if (!remoteExec) {
									activeWorkerTurn = await createWorkerTurnRunOwner({
										placements: options.placements,
										claim: turnClaim,
										sessionKey: placement.sessionKey,
										turn,
										isReplyDelivered: reply.isDelivered,
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
								const placementReadCleanup = _usingCtx4.u(new DisposableStack());
								const placementRead = await options.placements.prepareSessionPlacement(turnClaim.sessionId);
								placementReadCleanup.defer(placementRead.release);
								const readPreparedPlacement = (assertAdmission) => {
									turn.abortSignal?.throwIfAborted();
									assertAdmission();
									const preparedPlacement = placementRead.current();
									requiredAdmission.assertCurrent(preparedPlacement);
									if (preparedPlacement?.state !== "active" || preparedPlacement.executionMode !== placement.executionMode || !matchesWorkerPlacementTarget(preparedPlacement, placement) || !isCurrentPlacementTurnClaim(preparedPlacement, turnClaim)) throw new Error("Worker placement changed while loading turn execution");
									return preparedPlacement;
								};
								const assertPreparationCurrent = Object.assign(() => readPreparedPlacement(assertAdmissionCurrent), composeSessionSourceAssertion([assertAdmissionCurrent], readPreparedPlacement));
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
								const { withWorkerTurnTranscriptDatabase } = await import("./worker-turn-transcript-target-BN0w9W9-.mjs");
								assertPreparationCurrent();
								const executionOptions = {
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
									onReply: reply.deliver,
									placement,
									placements: options.placements,
									workspace,
									prepareAcceptedWorkspacePublication: options.prepareAcceptedWorkspacePublication,
									publishAcceptedWorkspace: options.publishAcceptedWorkspace,
									workspaceOperations: options.workspaceOperations,
									turn,
									turnClaim,
									runLocal,
									assertRunCurrent: remoteExec ? assertCurrent : assertPreparationCurrent
								};
								return await withWorkerTurnTranscriptDatabase(turn, {
									assertCurrent: assertPreparationCurrent,
									prepareAuthority: () => options.placements.prepareTurnClaimAuthority(turnClaim),
									signal: turn.abortSignal
								}, () => execute(executionOptions));
							} catch (_) {
								_usingCtx4.e = _;
							} finally {
								_usingCtx4.d();
							}
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
									await initialSetup?.release();
									initialSetup = void 0;
									if (!recoveredAdmission) {
										const waitTimeoutMs = Math.min(WORKER_ADMISSION_DEADLINE_MS, turn.timeoutMs);
										if (waitTimeoutMs <= 0) throw new WorkerRunnerUnavailableError();
										const reconnect = new AbortController();
										const reconnectSignal = turn.abortSignal ? AbortSignal.any([turn.abortSignal, reconnect.signal]) : reconnect.signal;
										const timeout = setTimeout(() => reconnect.abort(new WorkerRunnerUnavailableError()), waitTimeoutMs);
										timeout.unref?.();
										try {
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
											}
										} finally {
											clearTimeout(timeout);
										}
									}
								}
								if (!disconnectedBeforeHandoff) await options.reconcileActivePlacement(placement.environmentId);
								const reconciled = await options.placements.getAsync(placement.sessionId);
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
							await prepareWorkerTurnFailure(options, placement, {
								...identity,
								...turnClaim
							}, error, assertCurrent, turn.abortSignal, handedOff && !remoteExec ? options.persistAbandonedPartial : void 0);
							if (error instanceof WorkerRunnerCapacityError || error instanceof WorkerRunnerUnavailableError && !handedOff || !remoteExec && handedOff && turn.abortSignal?.aborted && (!terminalReceiptRequired || terminalAtMs !== void 0) || error instanceof WorkerWorkspaceReconciliationError && !handedOff || error instanceof WorkerTurnExecutionError && options.placements.validateTurnClaim(turnClaim)) {
								await releaseClaimIfOwned(options.placements, turnClaim);
								throw error;
							}
							const settledPlacement = await options.placements.getAsync(turnClaim.sessionId);
							if ((remoteExec || error instanceof WorkerTurnExecutionError) && settledPlacement?.state === "active" && settledPlacement.environmentId === placement.environmentId && settledPlacement.activeOwnerEpoch === placement.activeOwnerEpoch && settledPlacement.turnClaim === null) throw error;
							if (handedOff) {
								const terminalOwner = activeWorkerTurn;
								await failHandedOffTurn({
									environments: options.environments,
									placements: options.placements,
									placement,
									turnClaim,
									error,
									terminal: terminalOwner && terminalAtMs !== void 0 ? {
										observedAtMs: terminalAtMs,
										registerRecovery: (recover) => {
											terminalOwner.recoverTerminal = recover;
										}
									} : void 0
								});
							} else await releaseClaimIfOwned(options.placements, turnClaim);
							throw error;
						} finally {
							activeWorkerTurn?.dispose();
							if (activeWorkerTurn && activeWorkerTurns.get(turnClaim.sessionId) === activeWorkerTurn) activeWorkerTurns.delete(turnClaim.sessionId);
						}
					}
				} catch (_) {
					_usingCtx3.e = _;
				} finally {
					await _usingCtx3.d();
				}
			});
			return await reply.wait(execution);
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
const loadRequiredWorkerPreparation = createLazyRuntimeModule(() => import("./server-worker-required-profile-B5qwDzeY.mjs"));
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
	let scheduleDiskSpaceSweep;
	const runtimeRefresh = createWorkerRuntimeRefreshWaiter({
		environments: params.environments,
		isStopping: () => stopped
	});
	const workspaceOperations = createWorkerWorkspaceOperationCoordinator();
	const { ready: githubPublicationReady, close: closeGitHubPublication, coordinator: githubPublication, prepareAcceptedWorkspacePublication, publishAcceptedWorkspace, reconcilePublications } = params.githubPublicationRuntime ?? createGatewayGitHubPublicationRuntime(params);
	const withPreparedRecovery = createWorkerWorkspaceRecoveryPreparer({
		loadSessionRuntime: loadWorkerPlacementSessionRuntimeModule,
		getConfig: readRuntimeConfig
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
	let metadataChanges;
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
		loadSessionRuntime: loadWorkerPlacementSessionRuntimeModule,
		persistAbandonedPartial: params.persistAbandonedPartial,
		revokeSessionAuthority: params.revokeSessionAuthority
	});
	const resolveWorkspace = async ({ sessionId, sessionKey, agentId }) => {
		try {
			var _usingCtx$1 = _usingCtx();
			const sessionRuntime = await loadWorkerPlacementSessionRuntimeModule();
			const { workspace, assertCurrent } = _usingCtx$1.u(await resolveWorkerPlacementSessionTarget({
				sessionRuntime,
				config: readRuntimeConfig(),
				sessionId,
				sessionKey,
				agentId,
				errorMessage: `Session ${sessionKey} dispatch requires a session-owned workspace`
			}));
			assertCurrent(readRuntimeConfig());
			return workspace;
		} catch (_) {
			_usingCtx$1.e = _;
		} finally {
			_usingCtx$1.d();
		}
	};
	const resolveDevicePlacementRequirement = async (identity) => {
		try {
			var _usingCtx3 = _usingCtx();
			const sessionRuntime = await loadWorkerPlacementSessionRuntimeModule();
			const { config, target, entry, assertCurrent } = _usingCtx3.u(await resolveWorkerPlacementSessionTarget({
				sessionRuntime,
				config: readRuntimeConfig(),
				...identity,
				errorMessage: `Session ${identity.sessionKey} changed before node-backed placement recovery`
			}));
			assertCurrent(readRuntimeConfig());
			const runtime = await sessionRuntime.resolveWorkerPlacementSessionRuntimeAsync({
				cfg: config,
				entry,
				agentId: target.agentId,
				sessionKey: target.canonicalKey,
				assertCurrent: () => assertCurrent(readRuntimeConfig())
			});
			const { executionMode, devicePlacement } = sessionRuntime.resolveWorkerPlacementCapabilities(runtime);
			if (executionMode !== identity.executionMode || !devicePlacement) throw new Error(`runtime ${runtime} no longer supports this node-backed placement; select a compatible runtime or continue on the Gateway`);
			return devicePlacement;
		} catch (_) {
			_usingCtx3.e = _;
		} finally {
			_usingCtx3.d();
		}
	};
	const resolveNodeWorkspaceBinding = createWorkerPlacementNodeWorkspaceBindingResolver({
		placements: params.placements,
		resolveWorkspace
	});
	const publishPlacementChanges = createGatewayWorkerPlacementChangePublisher(params);
	const dispatchService = coordinateWorkerPlacementDispatch(createWorkerPlacementDispatchService({
		placements: params.placements,
		initialPlacements: params.initialPlacements,
		environments: params.environments,
		isShuttingDown: () => stopped || params.environments.isStopping() || getGatewayRestartDrainSignal().aborted,
		runnerAvailability,
		resolveDevicePlacementRequirement,
		isCurrentNodePlacement: createDevicePlacementAuthority(() => nodeWorkerSupervisorTransport),
		withPreparedRecovery,
		...reclaimBarriers,
		runLocalBarrier: createGatewayWorkerPlacementLocalDispatchBarrier({
			placements: params.placements,
			revokeSessionAuthority: params.revokeSessionAuthority
		}),
		runActivationBarrier: async ({ authorize, activate, ...identity }) => await runWorkerPlacementSessionBarrier({
			sessionRuntime: await loadWorkerPlacementSessionRuntimeModule(),
			getConfig: readRuntimeConfig,
			...identity,
			action: "activation",
			run: (_workspace, assertCurrent) => {
				authorize?.();
				return activate(assertCurrent);
			}
		}),
		runRecoveryBarrier: async ({ environmentId, expectedGeneration, run, ...identity }) => await runWorkerPlacementSessionBarrier({
			sessionRuntime: await loadWorkerPlacementSessionRuntimeModule(),
			getConfig: readRuntimeConfig,
			...identity,
			action: "recovery",
			run: async (workspace, assertCurrent) => {
				const placement = await params.placements.getAsync(identity.sessionId);
				assertCurrent();
				if (placement?.state !== "provisioning" || placement.generation !== expectedGeneration || placement.environmentId !== environmentId) throw new WorkerDispatchTargetChangedError(`Session ${identity.sessionKey} placement changed before cloud worker recovery. Retry.`);
				await run(workspace, assertCurrent);
			}
		}),
		onActivated: ({ sessionId }, placement) => {
			const environment = params.environments.get(placement.environmentId);
			if (environment?.state === "attached" && environment.ownerEpoch === placement.activeOwnerEpoch && environment.attachedSessionIds.length === 1 && environment.attachedSessionIds[0] === sessionId && environment.nodeDeviceId) nodeWorkspaceRetention.schedule(environment.nodeDeviceId);
		},
		runMoveBarrier,
		resolveMoveDestination: createGatewayWorkerPlacementMoveDestinationResolver({
			environments: params.environments,
			getConfig: readRuntimeConfig,
			loadSessionRuntime: loadWorkerPlacementSessionRuntimeModule
		}),
		resolveWorkspace,
		prepareGatewayMove: (identity) => params.placements.withWorkspaceExclusion(identity.sessionId, async (assertOwned) => await materializeSessionRepositoryWorkspaceOnGateway({
			cfg: readRuntimeConfig(),
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
			config: readRuntimeConfig(),
			agentId,
			scope: "agent"
		}) ?? resolveConfiguredGitHubToolIdentity({
			config: readRuntimeConfig(),
			agentId,
			scope: "system"
		}))?.gitAuthor
	}), createGatewayWorkerDispatchAdmission(), createWorkerPlacementInitialRecovery({
		...params,
		isStopping: () => stopped || params.environments.isStopping() || getGatewayRestartDrainSignal().aborted
	}), publishPlacementChanges, {
		placements: params.placements,
		environments: params.environments,
		warn: params.warn,
		redispatchPlacement: (...args) => redispatchPlacement(...args)
	});
	const redispatchPlacement = createWorkerPlacementRedispatch({
		placements: params.placements,
		dispatch: dispatchService.dispatch,
		resolveDevicePlacementRequirement
	});
	const withRequiredSession = async (...args) => {
		if (!readRuntimeConfig().cloudWorkers?.requiredProfile) return await args[1](() => {});
		const { createRequiredWorkerSessionPreparation } = await loadRequiredWorkerPreparation();
		return await createRequiredWorkerSessionPreparation({
			getConfig: readRuntimeConfig,
			dispatch: { ensurePlacement: (request) => dispatchService.ensurePlacement({
				...request,
				onTransition: (placement) => {
					const context = params.getSessionChangeContext?.();
					if (context) emitSessionsChanged(context, {
						reason: "dispatch",
						sessionKey: placement.sessionKey,
						agentId: placement.agentId
					});
				}
			}) }
		})(...args);
	};
	const placementIdleSweep = createWorkerPlacementIdleSweep({
		placements: params.placements,
		environments: params.environments,
		dispatch: dispatchService,
		reportChanges: publishPlacementChanges,
		getConfig: readRuntimeConfig,
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
		reportChanges: publishPlacementChanges,
		warn: params.warn
	});
	const admissionProvider = createWorkerSessionTurnPlacementProvider({
		withRequiredSession,
		environments: params.environments,
		placements: params.placements,
		resolveWorkspace,
		reconcileActivePlacement: async (id) => await dispatchService.reconcileActive(id),
		isInterruptedTurn: dispatchService.isInterruptedTurn,
		waitForAdmissionNode: runtimeRefresh.wait,
		waitForInitialPlacement: dispatchService.waitForInitialPlacement,
		redispatchPlacement,
		workspaceOperations,
		prepareAcceptedWorkspacePublication,
		publishAcceptedWorkspace,
		persistAbandonedPartial: params.persistAbandonedPartial
	});
	const startRuntime = async (hooks) => {
		if (hooks.isClosePreludeStarted()) return null;
		const uninstallPlacementAdmission = installSessionPlacementAdmissionProvider(admissionProvider);
		const changes = subscribeGatewayWorkerPlacementMetadataChanges({
			...params,
			runnerAvailability
		});
		metadataChanges = changes;
		const uninstallPlacementChanges = params.placements.subscribeChanges((placement) => {
			sessionRetirement.markPending(placement.sessionId);
			diskSpace.invalidate();
			scheduleDiskSpaceSweep?.();
		});
		const uninstallConfigChanges = sessionChanges.subscribeFacts((change) => {
			if ("all" in change && (typeof change.scope !== "string" || change.scope === "stores" || change.scope === "config" || change.scope === "worker-environments")) {
				diskSpace.invalidate();
				scheduleDiskSpaceSweep?.();
			}
		});
		const scope = scheduler.scope();
		const operations = /* @__PURE__ */ new Map();
		const uninstallEnvironmentReconcileGuard = installWorkerPlacementReconcileGuard({
			placements: params.placements,
			environments: params.environments,
			dispatch: dispatchService,
			isStopping: () => stopped
		});
		const uninstallSessionMaintenancePreservation = sessionRetirement.installMaintenancePreservation(params.placements);
		const trackOperation = (key, current, failureMessage) => {
			operations.set(key, current);
			const clearCurrent = () => {
				if (operations.get(key) === current) operations.delete(key);
			};
			current.then(clearCurrent, (error) => {
				params.warn(`${failureMessage}: ${formatErrorMessage(error)}`);
				clearCurrent();
			});
			return current;
		};
		const reconcileActivePlacements = () => {
			if (stopped) return Promise.resolve();
			return operations.get("reconcile") ?? trackOperation("reconcile", (async () => {
				await measureGatewayRestartTrace("worker-placement.reconcile.session-retirement", () => sessionRetirement.reconcile());
				if (stopped) return;
				await measureGatewayRestartTrace("worker-placement.reconcile.active", () => dispatchService.reconcileActive());
				if (stopped) return;
				await measureGatewayRestartTrace("worker-placement.reconcile.publications", () => reconcilePublications());
				nodeWorkspaceRetention.schedule();
			})(), "Worker placement reconcile sweep failed");
		};
		const sweepDiskSpace = () => {
			if (stopped) return Promise.resolve();
			return operations.get("disk-space") ?? trackOperation("disk-space", diskSpace.sweep().finally(() => scheduleDiskSpaceSweep?.()), "Worker disk-space sweep failed");
		};
		scheduleDiskSpaceSweep = () => {
			const atMs = diskSpace.nextSweepAtMs();
			if (!stopped && Number.isFinite(atMs)) scope.schedule({
				id: "worker-placements:disk-space",
				atMs,
				mode: "earliest",
				run: () => sweepDiskSpace().catch(() => {})
			});
		};
		const sweepActivePlacements = async () => {
			try {
				await reconcileActivePlacements();
				if (stopped || operations.has("auto-suspend")) return;
				await trackOperation("auto-suspend", placementIdleSweep.sweep(), "Worker placement auto-suspend sweep failed");
			} catch {}
		};
		const uninstallSessionIdentityMutation = onSessionIdentityMutation((mutation) => runInDetachedAsyncContext(() => {
			const previousSessionId = mutation.previous.sessionId;
			const currentSessionId = "current" in mutation ? mutation.current.sessionId : void 0;
			if (previousSessionId && previousSessionId !== currentSessionId) {
				sessionRetirement.markPending(previousSessionId);
				const pending = operations.get("reconcile");
				if (!pending) {
					reconcileActivePlacements();
					return;
				}
				const resume = () => {
					reconcileActivePlacements();
				};
				pending.then(resume, resume);
			}
		}));
		let stopPromise;
		const sidecar = { stop: () => {
			if (stopPromise) return stopPromise;
			if (!stopped) {
				stopped = true;
				params.environments.beginClose();
				scope.beginClose();
				uninstallSessionIdentityMutation();
				uninstallPlacementChanges();
				uninstallConfigChanges();
				uninstallSessionMaintenancePreservation();
				uninstallPlacementAdmission();
			}
			const currentStop = (async () => {
				await Promise.allSettled([
					measureGatewayCloseStep("shutdown.worker-placement.changes", () => changes.stop()),
					measureGatewayCloseStep("shutdown.worker-placement.github-ready", () => githubPublicationReady),
					...Array.from(operations, ([name, operation]) => measureGatewayCloseStep(`shutdown.worker-placement.${name}`, () => operation))
				]);
				await measureGatewayCloseStep("shutdown.worker-placement.github-close", closeGitHubPublication);
				await measureGatewayCloseStep("shutdown.worker-placement.workspace-retention", () => nodeWorkspaceRetention.stop());
				await measureGatewayCloseStep("shutdown.worker-placement.scope", () => scope.stop());
				await measureGatewayCloseStep("shutdown.worker-placement.environments", () => params.environments.stop());
				await measureGatewayCloseStep("shutdown.worker-placement.reconcile-guard", uninstallEnvironmentReconcileGuard);
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
			await githubPublicationReady;
			for (const reconcile of [() => recoverGatewayWorkerPlacementWorkspaces({
				placements: params.placements,
				resolveWorkspace
			}), async () => {
				await measureGatewayRestartTrace("worker-placement.startup.active", () => dispatchService.reconcile("startup"));
				if (!stopped) await measureGatewayRestartTrace("worker-placement.startup.publications", () => reconcilePublications());
			}]) {
				const current = reconcile();
				operations.set("reconcile", current);
				try {
					await current;
				} finally {
					if (operations.get("reconcile") === current) operations.delete("reconcile");
				}
				if (hooks.isClosePreludeStarted()) return await stopBeforeReady();
			}
			nodeWorkspaceRetention.start();
			if (hooks.isClosePreludeStarted()) return await stopBeforeReady();
			params.environments.start();
			if (hooks.isClosePreludeStarted()) return await stopBeforeReady();
			trackOperation("reconcile", sessionRetirement.reconcile(), "Worker placement reconcile sweep failed");
			sweepDiskSpace();
			const atMs = scope.now() + WORKER_PLACEMENT_RECONCILE_INTERVAL_MS;
			scope.schedule({
				id: "worker-placements:reconcile",
				atMs,
				everyMs: WORKER_PLACEMENT_RECONCILE_INTERVAL_MS,
				run: sweepActivePlacements
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
		dispatchService: Object.assign(dispatchService, { withRequiredSession }),
		admissionProvider,
		diskSpace,
		runnerAvailability: {
			...runnerAvailability,
			markChanged(nodeId) {
				runnerAvailability.markChanged();
				metadataChanges?.runnerChanged(nodeId);
				scheduleDiskSpaceSweep?.();
			}
		},
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
