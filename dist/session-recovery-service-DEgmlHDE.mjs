import { n as resolveGlobalMap } from "./global-singleton-Dc_stLtU.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { c as normalizeSessionDeliveryState } from "./delivery-context.shared-CW8dxG7X.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import "./user-profile-constants-DfyZS95p.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { a as runQueuedStoreWrite } from "./openclaw-agent-write-admission-b9fAKekK.mjs";
import { l as resolveCreatorSandbox, n as authorizeGatewaySessionCreation } from "./operator-role-policy-Bt6aG_wj.mjs";
import { n as buildSessionCreationStamp, r as inheritSessionCreationPolicy } from "./session-entry-provenance-C-JyMH54.mjs";
import { g as runExclusiveSessionLifecycleMutation, h as isSessionWorkAdmissionActive, i as closeSessionWorkAdmissions, x as normalizeSessionIdentities } from "./session-lifecycle-admission-Pys9TN37.mjs";
import { r as mergeSessionEntry } from "./types-ByCc34Vn.mjs";
import { J as recoverSessionEntryFromRestartTombstone } from "./session-accessor-C05KQ5A3.mjs";
import { g as inheritSessionSelection } from "./session-accessor.reset-b9w8ccQ2.mjs";
import { a as createAgentRunDirectAbortError } from "./run-termination-Cd1iJzC7.mjs";
import { d as isEmbeddedAgentRunActive } from "./runs-ciDkXIOQ.mjs";
import { n as buildMainSessionRecoveryClearPatch } from "./main-session-recovery-clear-H7IP1700.mjs";
import { n as inspectMainRestartRecoveryRolloverEligibility, o as isMainSessionRecoveryReconciliationCandidate } from "./main-session-recovery-state-uW-wldbD.mjs";
import { i as prepareSessionWorkerPlacementMutationCheck, o as prepareSessionWorkerPlacementStop } from "./session-placement-lifecycle-DAKgxrlj.mjs";
import { a as resolveGatewaySessionStoreTarget } from "./session-utils-store-lookup-CVR56ULk.mjs";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-DqGvpsY3.mjs";
import "./session-utils-AxixtEyo.mjs";
import { t as recordSessionCreated } from "./session-created-lHTOLS92.mjs";
import "./embedded-agent-mYH3aiyf.mjs";
import { t as markOrphanedMainSessionForRecovery } from "./main-session-restart-recovery-marking-BoPMUIXA.mjs";
import { t as resolvePluginSessionOwnershipError } from "./session-plugin-ownership-BAwSgzgQ.mjs";
import { t as buildDashboardSessionKey } from "./session-create-service-yGvu8Ia2.mjs";
import { randomUUID } from "node:crypto";
//#region src/gateway/session-recovery-entry.ts
/** Builds the fresh runtime identity paired with a recovered transcript. */
function buildRestartRecoverySuccessorEntry(params) {
	const source = params.source;
	const entry = mergeSessionEntry(void 0, {
		...inheritSessionSelection(source),
		...buildSessionCreationStamp({
			via: "operator",
			...params.creation
		}),
		delivery: normalizeSessionDeliveryState(),
		sessionId: params.sessionId,
		previousSessionId: source.sessionId,
		spawnDepth: 0,
		...source.agentHarnessId ? { agentHarnessId: source.agentHarnessId } : {},
		...source.modelSelectionLocked === true ? { modelSelectionLocked: true } : {},
		...source.pluginOwnerId ? { pluginOwnerId: source.pluginOwnerId } : {},
		...source.visibility ? { visibility: source.visibility } : {},
		...source.spawnedCwd ? { spawnedCwd: source.spawnedCwd } : {},
		...source.execHost ? { execHost: source.execHost } : {},
		...source.execNode ? { execNode: source.execNode } : {},
		...source.execCwd ? { execCwd: source.execCwd } : {}
	});
	return {
		...entry,
		...buildMainSessionRecoveryClearPatch(entry),
		sessionId: params.sessionId
	};
}
//#endregion
//#region src/gateway/session-recovery-service.ts
const recoveryQueues = resolveGlobalMap(Symbol.for("openclaw.sessionRecoveryQueues"));
function recoveryConflictError(reason) {
	const unavailable = reason === "successor-missing" || reason === "transcript-missing";
	return errorShape(unavailable ? ErrorCodes.UNAVAILABLE : ErrorCodes.INVALID_REQUEST, unavailable ? "Session recovery state is incomplete." : "Session changed before recovery; refresh and retry.", { details: { reason } });
}
/** Reconcile dead recovery ownership before a new send can replace its delivery claim. */
async function reconcileOrphanedGatewaySessionRecovery(params) {
	const { entry: initialSource, target } = params;
	const identities = [...target.storeKeys, initialSource.sessionId];
	if (!isMainSessionRecoveryReconciliationCandidate(initialSource) || isSessionWorkAdmissionActive(target.storePath, identities)) return;
	const readSource = () => loadGatewaySessionEntryReadOnly(target.canonicalKey, { agentId: target.agentId }).entry;
	return await runExclusiveSessionLifecycleMutation({
		scope: target.storePath,
		identities,
		run: async () => {
			if (isSessionWorkAdmissionActive(target.storePath, identities)) return;
			const assertPlacementCurrent = prepareSessionWorkerPlacementMutationCheck({
				context: params.workerPlacementContext,
				sessionId: initialSource.sessionId
			});
			const assertCurrent = () => {
				params.commitGuard?.();
				assertPlacementCurrent();
				const current = readSource();
				const ownershipError = resolvePluginSessionOwnershipError({
					action: "recover",
					entry: current,
					key: target.canonicalKey,
					pluginOwnerId: params.authorizedPluginId
				});
				if (ownershipError) throw new Error(ownershipError.message);
				if (current?.sessionId !== initialSource.sessionId || current.status !== initialSource.status || current.abortedLastRun !== initialSource.abortedLastRun || current.lifecycleRevision !== initialSource.lifecycleRevision || current.activeWriterRunId !== initialSource.activeWriterRunId || current.mainRestartRecovery?.cycleId !== initialSource.mainRestartRecovery?.cycleId || current.mainRestartRecovery?.revision !== initialSource.mainRestartRecovery?.revision || isSessionWorkAdmissionActive(target.storePath, identities)) throw new Error("Session changed before recovery; refresh and retry.");
			};
			return (await markOrphanedMainSessionForRecovery({
				target: {
					...target,
					sessionKey: target.canonicalKey
				},
				expectedSessionId: initialSource.sessionId,
				expectedLifecycleRevision: initialSource.lifecycleRevision,
				cfg: params.cfg,
				assertCommitAllowed: assertCurrent
			})).marked > 0 ? readSource() : void 0;
		}
	});
}
/** Owns explicit restart recovery from authorization through continuation launch. */
async function recoverGatewaySession(params) {
	const sourceTarget = resolveGatewaySessionStoreTarget({
		cfg: params.cfg,
		key: params.key,
		...params.agentId ? { agentId: params.agentId } : {}
	});
	const readSource = () => loadGatewaySessionEntryReadOnly(sourceTarget.canonicalKey, { agentId: sourceTarget.agentId }).entry;
	const initialSource = readSource();
	if (!initialSource?.sessionId) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, "Session recovery source was not found.")
	};
	if (isMainSessionRecoveryReconciliationCandidate(initialSource)) {
		const repaired = await reconcileOrphanedGatewaySessionRecovery({
			...params,
			target: sourceTarget,
			entry: initialSource
		});
		if (!repaired) return {
			ok: false,
			error: errorShape(ErrorCodes.INVALID_REQUEST, "Session recovery is unavailable while the source still has active work.")
		};
		const continuation = await params.launchContinuation({
			agentId: sourceTarget.agentId,
			idempotencyKey: `restart-recovery-reconcile:${repaired.sessionId}:${repaired.mainRestartRecovery?.cycleId}`,
			sessionId: repaired.sessionId,
			sessionKey: sourceTarget.canonicalKey,
			storePath: sourceTarget.storePath
		});
		return {
			ok: true,
			agentId: sourceTarget.agentId,
			created: false,
			sourceKey: sourceTarget.canonicalKey,
			successorEntry: repaired,
			successorKey: sourceTarget.canonicalKey,
			continuation
		};
	}
	const initialEligibility = inspectMainRestartRecoveryRolloverEligibility(initialSource);
	if (!initialEligibility.eligible && initialEligibility.reason !== "already_recovered") return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, "Session recovery requires a restart-tombstoned session.")
	};
	const recovery = initialSource.mainRestartRecovery;
	if (!recovery?.tombstone) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, "Session is not recoverable.")
	};
	const generatedSuccessorKey = buildDashboardSessionKey(sourceTarget.agentId);
	const successorTarget = resolveGatewaySessionStoreTarget({
		cfg: params.cfg,
		key: generatedSuccessorKey,
		agentId: sourceTarget.agentId
	});
	const successorSessionId = randomUUID();
	const resolveCurrentSource = () => {
		params.commitGuard?.();
		const currentSource = readSource();
		const currentOwnershipError = resolvePluginSessionOwnershipError({
			action: "recover",
			entry: currentSource,
			key: sourceTarget.canonicalKey,
			pluginOwnerId: params.authorizedPluginId
		});
		if (currentOwnershipError) return {
			ok: false,
			error: currentOwnershipError
		};
		if (!currentSource?.sessionId || currentSource.sessionId !== initialSource.sessionId || currentSource.lifecycleRevision !== initialSource.lifecycleRevision || currentSource.mainRestartRecovery?.cycleId !== recovery.cycleId || !currentSource.mainRestartRecovery.tombstone?.recoveredSessionKey && currentSource.mainRestartRecovery.revision !== recovery.revision) return {
			ok: false,
			error: recoveryConflictError("source-changed")
		};
		if (!currentSource.mainRestartRecovery?.tombstone?.recoveredSessionKey) {
			const creationError = authorizeGatewaySessionCreation({
				cfg: params.cfg,
				agentId: sourceTarget.agentId,
				...params.operatorRoleActor ? { actor: params.operatorRoleActor } : { profileId: params.requestingOperatorProfileId }
			});
			if (creationError) return {
				ok: false,
				error: creationError
			};
		}
		if (isEmbeddedAgentRunActive(currentSource.sessionId) || isSessionWorkAdmissionActive(sourceTarget.storePath, [sourceTarget.canonicalKey, currentSource.sessionId])) return {
			ok: false,
			error: errorShape(ErrorCodes.INVALID_REQUEST, "Session recovery is unavailable while the source still has active work.")
		};
		return {
			ok: true,
			source: currentSource
		};
	};
	const assertCurrent = () => {
		const current = resolveCurrentSource();
		if (!current.ok) throw new Error(current.error.message);
	};
	const sourceIdentities = [
		...sourceTarget.storeKeys,
		sourceTarget.canonicalKey,
		initialSource.sessionId
	];
	const stopFailure = (error) => errorShape(ErrorCodes.UNAVAILABLE, `Session recovery cannot safely stop/reclaim its cloud worker: ${formatErrorMessage(error)} Stop cloud worker or call sessions.reclaim, then retry recovery.`, { retryable: true });
	const commitRecovery = async () => {
		let release = () => {};
		try {
			const prepared = await runExclusiveSessionLifecycleMutation({
				scope: sourceTarget.storePath,
				identities: sourceIdentities,
				run: async () => {
					const current = resolveCurrentSource();
					if (!current.ok) return current;
					let stop;
					try {
						if (!current.source.mainRestartRecovery?.tombstone?.recoveredSessionKey) stop = prepareSessionWorkerPlacementStop({
							action: "recover",
							agentId: sourceTarget.agentId,
							authorize: assertCurrent,
							context: params.workerPlacementContext,
							sessionId: initialSource.sessionId,
							sessionKey: sourceTarget.canonicalKey
						}).stop;
					} catch (error) {
						return {
							ok: false,
							error: stopFailure(error)
						};
					}
					release = closeSessionWorkAdmissions({
						scope: sourceTarget.storePath,
						identities: sourceIdentities,
						reason: createAgentRunDirectAbortError()
					});
					return {
						...current,
						stop
					};
				}
			});
			if (!prepared.ok) return prepared;
			let assertPlacementCurrent;
			if (prepared.stop) try {
				await prepared.stop();
				assertPlacementCurrent = prepareSessionWorkerPlacementMutationCheck({
					context: params.workerPlacementContext,
					sessionId: initialSource.sessionId
				});
			} catch (error) {
				const current = resolveCurrentSource();
				return current.ok ? {
					ok: false,
					error: stopFailure(error)
				} : current;
			}
			return await runExclusiveSessionLifecycleMutation({
				targets: [{
					scope: sourceTarget.storePath,
					identities: sourceIdentities
				}, {
					scope: successorTarget.storePath,
					identities: [successorTarget.canonicalKey, successorSessionId]
				}],
				prepare: async () => release(),
				run: async () => {
					const settled = resolveCurrentSource();
					if (!settled.ok) return settled;
					const currentSource = settled.source;
					const commitGuard = () => {
						assertCurrent();
						assertPlacementCurrent?.();
					};
					commitGuard();
					const successorEntry = buildRestartRecoverySuccessorEntry({
						sessionId: successorSessionId,
						source: currentSource,
						creation: params.actor ? {
							actor: params.actor,
							sandbox: params.actor.id === "gateway-owner" ? currentSource.sandbox : resolveCreatorSandbox(params.cfg, params)
						} : inheritSessionCreationPolicy(currentSource)
					});
					const result = await recoverSessionEntryFromRestartTombstone({
						agentId: sourceTarget.agentId,
						...params.actor ? { archivedBy: params.actor } : {},
						commitGuard,
						expected: {
							cycleId: recovery.cycleId,
							lifecycleRevision: initialSource.lifecycleRevision,
							revision: recovery.revision,
							sessionId: initialSource.sessionId,
							...normalizeOptionalString(initialSource.pluginOwnerId) ? { pluginOwnerId: initialSource.pluginOwnerId } : {}
						},
						sourceTarget,
						storePath: sourceTarget.storePath,
						successorEntry,
						successorTarget
					});
					if (result.status === "conflict") return {
						ok: false,
						error: recoveryConflictError(result.reason)
					};
					return {
						ok: true,
						created: result.status === "created",
						successorEntry: result.successorEntry,
						successorKey: result.successorKey
					};
				}
			});
		} finally {
			release();
		}
	};
	const committed = await runQueuedStoreWrite({
		queues: recoveryQueues,
		storePath: normalizeSessionIdentities(sourceTarget.storePath, [sourceTarget.canonicalKey])[0],
		label: "recoverGatewaySession",
		fn: commitRecovery
	});
	if (!committed.ok) return committed;
	if (committed.created) recordSessionCreated(params.cfg, {
		sessionKey: committed.successorKey,
		entry: committed.successorEntry,
		agentId: sourceTarget.agentId
	});
	const continuation = await params.launchContinuation({
		agentId: sourceTarget.agentId,
		idempotencyKey: `restart-recovery-rollover:${committed.successorEntry.sessionId}`,
		sessionId: committed.successorEntry.sessionId,
		sessionKey: committed.successorKey,
		storePath: sourceTarget.storePath
	});
	return {
		ok: true,
		agentId: sourceTarget.agentId,
		created: committed.created,
		sourceKey: sourceTarget.canonicalKey,
		successorEntry: committed.successorEntry,
		successorKey: committed.successorKey,
		continuation
	};
}
//#endregion
export { recoverGatewaySession as n, reconcileOrphanedGatewaySessionRecovery as t };
