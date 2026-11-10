import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as resolveGlobalMap } from "./global-singleton-DrXvEBww.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { i as runQueuedStoreWrite } from "./store-writer-queue-AKR6NnXM.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { a as sessionChanges } from "./session-row-changes-vFaNnKNM.mjs";
import "./user-profile-constants-DfyZS95p.mjs";
import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { V as inheritSessionSelection, nt as buildMainSessionRecoveryClearPatch } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { u as normalizeSessionIdentities } from "./session-agent-work-admission-D63nonbM.mjs";
import { a as createAgentRunDirectAbortError } from "./run-termination-Dwf1ksjA.mjs";
import { l as normalizeSessionDeliveryState } from "./delivery-context.shared-I8-iaaj1.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { l as resolveCreatorSandbox, n as authorizeGatewaySessionCreation } from "./operator-role-policy-Coro3qc5.mjs";
import { l as buildSessionCreationStamp, u as inheritSessionCreationPolicy } from "./session-entry-lineage-B7Mubzwj.mjs";
import { r as mergeSessionEntry } from "./types-BGDhC4_W.mjs";
import { l as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { w as recoverSessionEntryFromRestartTombstone } from "./session-accessor-Czw4l8kI.mjs";
import { S as runExclusiveSessionLifecycleMutation, b as isSessionWorkAdmissionActive, o as closeSessionWorkAdmissions } from "./session-lifecycle-admission-BihxXo5j.mjs";
import { t as invalidSessionRequest } from "./session-request-error-qLiiFHUD.mjs";
import { t as SessionMutationFactsUnavailableError } from "./session-sharing-incognito-DepuXzQy.mjs";
import { t as findCanonicalStoreMatch } from "./session-utils-store-selection-DIMLgaMc.mjs";
import { t as prepareSessionMutationFacts } from "./session-sharing-preparation-DAfvBDLL.mjs";
import { r as resolveGatewaySessionStoreTargetInWorker } from "./session-utils-store-worker-u3lCvEEg.mjs";
import { n as isEmbeddedAgentRunActive } from "./active-run-projections-Crpg2l0z.mjs";
import { o as isMainSessionRecoveryReconciliationCandidate, r as inspectMainRestartRecoveryRolloverEligibility } from "./main-session-recovery-state-sCZeKFHp.mjs";
import { c as prepareSessionWorkerPlacementStop, o as prepareSessionWorkerPlacementMutationCheckAsync } from "./session-placement-lifecycle-CAT_zN-p.mjs";
import { t as recordSessionCreated } from "./session-created-CHLwCn_J.mjs";
import "./embedded-agent-B8S-WtrO.mjs";
import { t as markOrphanedMainSessionForRecovery } from "./main-session-restart-recovery-marking-DWi60FXw.mjs";
import { t as resolvePluginSessionOwnershipError } from "./session-plugin-ownership-D5Z0-DHb.mjs";
import { t as buildDashboardSessionKey } from "./session-create-key-BJp-9Sd1.mjs";
import { randomUUID } from "node:crypto";
import path from "node:path";
//#region src/gateway/session-recovery-service.ts
const recoveryQueues = resolveGlobalMap(Symbol.for("openclaw.sessionRecoveryQueues"));
function recoveryConflictError(reason) {
	const unavailable = reason === "successor-missing" || reason === "transcript-missing";
	return errorShape(unavailable ? ErrorCodes.UNAVAILABLE : ErrorCodes.INVALID_REQUEST, unavailable ? "Session recovery state is incomplete." : "Session changed before recovery; refresh and retry.", { details: { reason } });
}
var SessionRecoverySourceChangedError = class extends Error {
	constructor(options) {
		super("Session changed before recovery; refresh and retry.", options);
		this.name = "SessionRecoverySourceChangedError";
	}
};
/** Keep full recovery metadata tied to the existing sharing/source publication lifetime. */
async function prepareRecoverySource(params) {
	const { target } = params;
	const facts = await prepareSessionMutationFacts({
		cfg: params.cfg,
		sessionKey: target.canonicalKey,
		agentId: target.agentId,
		allowMissing: true,
		storageReady: params.storageReady
	});
	let generation = 0;
	let selectedGeneration = -1;
	let selected;
	const sourcePaths = /* @__PURE__ */ new Set([path.resolve(target.storePath)]);
	const readFacts = () => {
		try {
			const current = facts.readCurrent(params.cfg);
			if (facts.storageTarget.agentId !== target.agentId || facts.storageTarget.canonicalKey !== target.canonicalKey || path.resolve(facts.storageTarget.storePath) !== path.resolve(target.storePath)) throw new SessionRecoverySourceChangedError();
			return current;
		} catch (error) {
			if (error instanceof SessionMutationFactsUnavailableError) throw new SessionRecoverySourceChangedError({ cause: error });
			throw error;
		}
	};
	try {
		const source = readFacts();
		if (source.sourcePath) sourcePaths.add(path.resolve(source.sourcePath));
	} catch (error) {
		facts.release();
		throw error;
	}
	const unsubscribe = sessionChanges.subscribeFacts((change) => {
		if (!("all" in change) && change.scope !== "acp" && change.storePath && sourcePaths.has(path.resolve(change.storePath)) && target.storeKeys.includes(change.sessionKey)) generation += 1;
	});
	const assertCurrent = () => {
		params.commitGuard?.();
		readFacts();
		if (selectedGeneration !== generation) throw new SessionRecoverySourceChangedError();
	};
	return {
		current() {
			assertCurrent();
			return selected;
		},
		async refresh() {
			params.commitGuard?.();
			const before = generation;
			const current = readFacts();
			if (!current.target) {
				selected = void 0;
				selectedGeneration = before;
				assertCurrent();
				return;
			}
			selected = await withSessionEntryReadOnlyInWorker({
				agentId: target.agentId,
				sessionKey: current.target.storeKey,
				storePath: current.sourcePath ?? target.storePath
			}, () => params.commitGuard?.(), async (result, owner) => {
				owner.assertCurrent();
				if (!result.ok) throw result.error;
				return result.value;
			});
			selectedGeneration = before;
			assertCurrent();
			return selected;
		},
		[Symbol.dispose]() {
			unsubscribe();
			facts.release();
		}
	};
}
/** Reconcile dead recovery ownership before a new send can replace its delivery claim. */
async function reconcileOrphanedGatewaySessionRecovery(params) {
	try {
		var _usingCtx$1 = _usingCtx();
		const { entry: initialSource, target } = params;
		const identities = [...target.storeKeys, initialSource.sessionId];
		if (!isMainSessionRecoveryReconciliationCandidate(initialSource) || isSessionWorkAdmissionActive(target.storePath, identities)) return;
		const source = _usingCtx$1.u(await prepareRecoverySource(params));
		return await runExclusiveSessionLifecycleMutation("recovery-mark", {
			scope: target.storePath,
			identities,
			run: async () => {
				if (isSessionWorkAdmissionActive(target.storePath, identities)) return;
				await source.refresh();
				const assertPlacementCurrent = await prepareSessionWorkerPlacementMutationCheckAsync({
					context: params.workerPlacementContext,
					sessionId: initialSource.sessionId
				});
				const assertCurrent = () => {
					assertPlacementCurrent();
					const current = source.current();
					params.commitGuard?.(current);
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
				})).marked > 0 ? await source.refresh() : void 0;
			}
		});
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		_usingCtx$1.d();
	}
}
/** Owns explicit restart recovery from authorization through continuation launch. */
async function recoverGatewaySession(params) {
	const sourceTarget = await resolveGatewaySessionStoreTargetInWorker({
		cfg: params.cfg,
		key: params.key,
		...params.agentId ? { agentId: params.agentId } : {},
		assertActive: params.commitGuard
	});
	const initialSource = findCanonicalStoreMatch(sourceTarget.store, sourceTarget.storeKeys)?.entry;
	if (!initialSource?.sessionId) return invalidSessionRequest("Session recovery source was not found.");
	if (isMainSessionRecoveryReconciliationCandidate(initialSource)) {
		const repaired = await reconcileOrphanedGatewaySessionRecovery({
			...params,
			target: sourceTarget,
			entry: initialSource
		});
		if (!repaired) return invalidSessionRequest("Session recovery is unavailable while the source still has active work.");
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
	if (!initialEligibility.eligible && initialEligibility.reason !== "already_recovered") return invalidSessionRequest("Session recovery requires a restart-tombstoned session.");
	const recovery = initialSource.mainRestartRecovery;
	if (!recovery?.tombstone) return invalidSessionRequest("Session is not recoverable.");
	const generatedSuccessorKey = buildDashboardSessionKey(sourceTarget.agentId);
	const successorTarget = await resolveGatewaySessionStoreTargetInWorker({
		cfg: params.cfg,
		key: generatedSuccessorKey,
		agentId: sourceTarget.agentId,
		assertActive: params.commitGuard
	});
	const successorSessionId = randomUUID();
	const sourceIdentities = [
		...sourceTarget.storeKeys,
		sourceTarget.canonicalKey,
		initialSource.sessionId
	];
	const stopFailure = (error) => errorShape(ErrorCodes.UNAVAILABLE, `Session recovery cannot safely stop/reclaim its cloud worker: ${formatErrorMessage(error)} Stop cloud worker or call sessions.reclaim, then retry recovery.`, { retryable: true });
	const storageReady = createDeferredCore();
	const sourcePreparation = prepareRecoverySource({
		...params,
		target: sourceTarget,
		storageReady: storageReady.promise
	});
	sourcePreparation.catch(() => {});
	const commitRecovery = async () => {
		storageReady.resolve();
		let release = () => {};
		try {
			try {
				var _usingCtx3 = _usingCtx();
				const source = _usingCtx3.u(await sourcePreparation);
				const resolveCurrentSource = () => {
					params.commitGuard?.();
					const currentSource = source.current();
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
					if (isEmbeddedAgentRunActive(currentSource.sessionId) || isSessionWorkAdmissionActive(sourceTarget.storePath, [sourceTarget.canonicalKey, currentSource.sessionId])) return invalidSessionRequest("Session recovery is unavailable while the source still has active work.");
					return {
						ok: true,
						source: currentSource
					};
				};
				const assertCurrent = () => {
					const current = resolveCurrentSource();
					if (!current.ok) throw new Error(current.error.message);
				};
				const prepared = await runExclusiveSessionLifecycleMutation("recovery-drain", {
					scope: sourceTarget.storePath,
					identities: sourceIdentities,
					run: async () => {
						await source.refresh();
						const current = resolveCurrentSource();
						if (!current.ok) return current;
						let stop;
						try {
							if (!current.source.mainRestartRecovery?.tombstone?.recoveredSessionKey) stop = (await prepareSessionWorkerPlacementStop({
								action: "recover",
								agentId: sourceTarget.agentId,
								authorize: assertCurrent,
								context: params.workerPlacementContext,
								sessionId: initialSource.sessionId,
								sessionKey: sourceTarget.canonicalKey
							})).stop;
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
					assertPlacementCurrent = await prepareSessionWorkerPlacementMutationCheckAsync({
						context: params.workerPlacementContext,
						sessionId: initialSource.sessionId
					});
				} catch (error) {
					await source.refresh();
					const current = resolveCurrentSource();
					return current.ok ? {
						ok: false,
						error: stopFailure(error)
					} : current;
				}
				return await runExclusiveSessionLifecycleMutation("recover", {
					targets: [{
						scope: sourceTarget.storePath,
						identities: sourceIdentities
					}, {
						scope: successorTarget.storePath,
						identities: [successorTarget.canonicalKey, successorSessionId]
					}],
					prepare: async () => release(),
					run: async () => {
						await source.refresh();
						const settled = resolveCurrentSource();
						if (!settled.ok) return settled;
						const currentSource = settled.source;
						const commitGuard = () => {
							assertCurrent();
							assertPlacementCurrent?.();
						};
						commitGuard();
						const creation = params.actor ? {
							actor: params.actor,
							sandbox: params.actor.id === "gateway-owner" ? currentSource.sandbox : resolveCreatorSandbox(params.cfg, params)
						} : inheritSessionCreationPolicy(currentSource);
						const entry = mergeSessionEntry(void 0, {
							...inheritSessionSelection(currentSource),
							...buildSessionCreationStamp({
								via: "operator",
								...creation
							}),
							delivery: normalizeSessionDeliveryState(),
							sessionId: successorSessionId,
							previousSessionId: currentSource.sessionId,
							spawnDepth: 0,
							...currentSource.agentHarnessId ? { agentHarnessId: currentSource.agentHarnessId } : {},
							...currentSource.modelSelectionLocked === true ? { modelSelectionLocked: true } : {},
							...currentSource.pluginOwnerId ? { pluginOwnerId: currentSource.pluginOwnerId } : {},
							...currentSource.visibility ? { visibility: currentSource.visibility } : {},
							...currentSource.communication ? { communication: { ...currentSource.communication } } : {},
							...currentSource.spawnedCwd ? { spawnedCwd: currentSource.spawnedCwd } : {},
							...currentSource.deviceFolder ? { deviceFolder: { ...currentSource.deviceFolder } } : {},
							...currentSource.execHost ? { execHost: currentSource.execHost } : {},
							...currentSource.execNode ? { execNode: currentSource.execNode } : {},
							...currentSource.execCwd ? { execCwd: currentSource.execCwd } : {}
						});
						const successorEntry = {
							...entry,
							...buildMainSessionRecoveryClearPatch(entry),
							sessionId: successorSessionId
						};
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
			} catch (_) {
				_usingCtx3.e = _;
			} finally {
				_usingCtx3.d();
			}
		} catch (error) {
			if (error instanceof SessionRecoverySourceChangedError || error instanceof SessionMutationFactsUnavailableError) return {
				ok: false,
				error: recoveryConflictError("source-changed")
			};
			throw error;
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
	if (committed.created) await recordSessionCreated(params.cfg, {
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
