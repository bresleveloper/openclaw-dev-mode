import { r as resolveGlobalMap } from "./global-singleton-DrXvEBww.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { a as isSqliteLockError } from "./sqlite-error-diagnostics-BBfTUJBR.mjs";
import { b as registerOpenClawStateDatabaseLifecycleListener } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { a as sessionChanges } from "./session-row-changes-vFaNnKNM.mjs";
import { l as getGatewayRestartDrainSignal } from "./gateway-work-admission-FWbk4b3p.mjs";
import { i as openOpenClawStateDatabase } from "./openclaw-state-db-BtDOU_3j.mjs";
import { l as reserveSqliteWorkerInputPreparation } from "./sqlite-worker-store-Bzw_c0pA.mjs";
import { i as runOpenClawStateWorkerOperation, n as executeOpenClawStateWorker } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { _ as removeTurnClaimReleaseWaiter, g as registerWorkerTurnClaimClosedHandler, n as attachWorkerTurnExecutionIdentityStore, p as prepareWorkerTurnClaimClosed, y as waitersFor } from "./placement-turn-claim-events-C-F0mgX3.mjs";
import { n as assertSessionEntryCurrentAdmission } from "./session-entry-current-admission-DvCCyjlG.mjs";
import { t as withOpenClawStateLease } from "./openclaw-state-lease-B69mLcu_.mjs";
import { n as emitSessionLifecycleEvent } from "./session-lifecycle-events-76OxWRqj.mjs";
import { n as reserveWorkerEnvironmentNativePublication } from "./store-native-publication-BmUHu_Dk.mjs";
import { t as boundedWorkerError } from "./worker-error-BrVatFit.mjs";
import { n as AcceptedWorkspacePublicationIndeterminateError } from "./workspace-reconcile-BuXOoPIv.mjs";
import { a as projectWorkspaceResultConflict } from "./workspace-conflicts-CQVfTI04.mjs";
import { c as normalizeIdentity, g as required, i as isCurrentPlacementTurnClaim, m as projectWorkerSessionTurnClaim, s as normalizeEpoch, u as normalizeWorkerPlacementExecutionMode } from "./placement-record-CBaaHws5.mjs";
import { A as readPlacementReplica, B as subscribePlacementChanges, F as stagePlacementWorkspaceJournalWorkerPublication, I as stagePlacementWorkspaceResultWorkerPublication, M as stagePlacementRetirementWorkerPublication, N as stagePlacementTurnClaimWorkerPublication, O as readPlacementProjection, P as stagePlacementTurnToolWorkerPublication, S as projectLocalPlacementTurnClaim, _ as preparePlacementAuthorityRead, b as preparePlacementWorkspaceResultAuthority, g as isPublishedPlacementTurnClaimCurrent, h as isPlacementTurnToolAuthorized, j as readPlacementWorkspaceResultAuthority, k as readPlacementRecoveryCandidates, m as capturePlacementReplicaRead, v as preparePlacementPreservationRead, x as prepareSessionPlacementRead, y as preparePlacementTurnClaimAuthority } from "./placement-row-codec-DhdW6tSs.mjs";
import { t as createPlacementWorkerMutation } from "./placement-worker-mutation-DSJSnrd8.mjs";
import { n as SessionWorkspaceReservationBusyError, t as PERSONAL_SCOPE } from "./placement-workspace-reservation.kernel-Bjfj6oO6.mjs";
import { t as ActiveTurnClaimError } from "./placement-turn-claims-DLDd9nfQ.mjs";
import { randomUUID } from "node:crypto";
import { serialize } from "node:v8";
import { Type } from "typebox";
import { Value } from "typebox/value";
//#region src/gateway/worker-environments/placement-lifecycle-store.ts
function isReceipt$1(value) {
	return isRecord(value) && typeof value.sessionId === "string" && (value.placement === void 0 || isRecord(value.placement) && value.placement.sessionId === value.sessionId) && (value.intent === void 0 || isRecord(value.intent) && value.intent.sessionId === value.sessionId);
}
function createPlacementLifecycleWorkerOps(runtime) {
	const context = captureOpenClawStateWorkerContext({ path: runtime.path });
	const execute = (command, assertCurrent, assertNewSource) => {
		command.input = {
			...command.input,
			nowMs: runtime.now?.() ?? (command.type === "workerPlacements.startDispatch" ? Date.now() : void 0)
		};
		const captured = structuredClone(command);
		captured.input.sessionId = required(captured.input.sessionId, "session id");
		const readReceipt = (facts) => {
			if (!isReceipt$1(facts) || facts.sessionId !== captured.input.sessionId) return;
			return facts;
		};
		const dispatch = captured.type === "workerPlacements.startDispatch";
		let newSource;
		return createPlacementWorkerMutation({
			context,
			label: dispatch ? "Worker placement dispatch" : "Worker placement lifecycle",
			nativeLocation: context.admission.databasePath,
			orderedAdmission: true,
			assertCurrent: dispatch ? assertCurrent : assertCurrent?.assertWorkerLifetime ?? assertCurrent,
			assertGrantCurrent: dispatch ? assertCurrent : assertCurrent?.assertWorkerGrant ?? assertCurrent,
			admissionFacts(request) {
				if (request.stage === "transaction" && assertNewSource) {
					const facts = request.facts;
					if (!isReceipt$1(facts) || facts.sessionId !== captured.input.sessionId || !facts.placement) throw new Error("Worker placement move admission has a different source");
					newSource = facts.joined ? void 0 : facts.placement;
				}
				if (newSource) assertNewSource?.(newSource);
				return request.facts;
			},
			stageCommit(committed, nativeSettlement) {
				const facts = readReceipt(committed);
				if (!facts) throw new Error("Worker placement lifecycle receipt has a different session");
				if (facts.joined || facts.changed === false || captured.type === "workerPlacements.bindPrepared" && !facts.placement) return;
				const publication = facts.retired ? stagePlacementRetirementWorkerPublication(context.admission.identity, facts.sessionId, facts.retired, nativeSettlement, facts.retiredIdentity) : facts.placement ? stagePlacementTurnClaimWorkerPublication(context.admission.identity, facts.placement, void 0, void 0, facts.placement, void 0, nativeSettlement) : stagePlacementWorkspaceJournalWorkerPublication(context.admission.identity, facts.sessionId);
				const environment = facts.environment;
				if (!environment) return publication;
				const publishEnvironment = reserveWorkerEnvironmentNativePublication(context.admission.identity);
				return {
					...publication,
					commit() {
						publishEnvironment?.(environment.environmentId, environment.patch);
						publication.commit();
					}
				};
			},
			readReceipt(facts, publication) {
				if (dispatch) publication?.commit();
				return readReceipt(facts);
			},
			publish(receipt) {
				if (captured.type === "workerPlacements.retire") runtime.onRetired(receipt.sessionId);
				if (receipt.changed === true || receipt.moveRemoved || captured.type === "workerPlacements.completeMove") sessionChanges.emit({
					all: true,
					scope: "worker-placements"
				});
				if (receipt.environment) sessionChanges.emit({
					all: true,
					scope: "worker-environments"
				});
			}
		}).run((scope) => scope.execute(captured));
	};
	const placement = (receipt) => {
		if (!receipt.placement) throw new Error("Worker placement lifecycle receipt is missing its placement");
		return receipt.placement;
	};
	return {
		async clearLocalTurnClaimsAfterRestartAsync() {
			const placements = await executeOpenClawStateWorker(context, {
				type: "workerPlacements.clearLocalTurnClaims",
				input: { nowMs: runtime.now?.() }
			});
			for (const clearedPlacement of placements) stagePlacementTurnClaimWorkerPublication(context.admission.identity, clearedPlacement, void 0, clearedPlacement.state, clearedPlacement).commit();
			return placements.length;
		},
		async startDispatch(input, guard = {}) {
			return placement(await execute({
				type: "workerPlacements.startDispatch",
				input: {
					...input,
					...normalizeIdentity(input),
					executionMode: normalizeWorkerPlacementExecutionMode(input.executionMode)
				}
			}, guard.assertCurrent));
		},
		async beginPlacementMove(input, guard = {}) {
			const receipt = await execute({
				type: "workerPlacements.beginMove",
				input
			}, guard.assertCurrent, guard.assertNewSource);
			if (!receipt.intent || receipt.joined === void 0) throw new Error("Worker placement move receipt is missing its intent");
			return {
				intent: receipt.intent,
				placement: placement(receipt),
				joined: receipt.joined
			};
		},
		async recordPlacementMoveError(input) {
			return (await execute({
				type: "workerPlacements.moveError",
				input
			})).changed === true;
		},
		async cancelPlacementMove(input, guard = {}) {
			return (await execute({
				type: "workerPlacements.cancelMove",
				input
			}, guard.assertCurrent)).changed === true;
		},
		async completePlacementMoveSourceToLocal(input, guard = {}) {
			return placement(await execute({
				type: "workerPlacements.completeMoveSource",
				input
			}, guard.assertCurrent));
		},
		async completeAbandonedPlacementMoveSourceToLocal(input, guard = {}) {
			return placement(await execute({
				type: "workerPlacements.completeAbandonedMoveSource",
				input
			}, guard.assertCurrent));
		},
		async completePlacementMoveToWorker(input, guard = {}) {
			return placement(await execute({
				type: "workerPlacements.completeMove",
				input
			}, guard.assertCurrent));
		},
		async bindPreparedEnvironment({ assertCurrent, ...input }) {
			return (await execute({
				type: "workerPlacements.bindPrepared",
				input
			}, assertCurrent)).placement;
		},
		async retireSessionPlacementAsync(input, guard = {}) {
			await execute({
				type: "workerPlacements.retire",
				input
			}, guard.assertCurrent);
		}
	};
}
//#endregion
//#region src/gateway/worker-environments/placement-read-publication.ts
const publications = /* @__PURE__ */ new WeakMap();
/** Receipt facts last only through their committed notification, never as turn authority. */
function preparePlacementProjectionPublication(identity, projection) {
	let publishedChange;
	return {
		publish(change) {
			publishedChange = change;
			publications.set(change, {
				identity,
				projection
			});
		},
		release() {
			if (publishedChange) publications.delete(publishedChange);
			publishedChange = void 0;
		}
	};
}
function readPublishedPlacementProjection(identity, change) {
	const published = publications.get(change);
	return published?.identity.key === identity.key && published.identity.birthtime === identity.birthtime ? published.projection : void 0;
}
//#endregion
//#region src/gateway/worker-environments/placement-read-store.ts
function createPlacementReadStore(params) {
	const context = captureOpenClawStateWorkerContext({ path: params.path });
	const decorate = (records) => {
		context.admission.assertCurrent();
		return records.map((record) => params.withWorkspaceResultConflict(record));
	};
	const read = async (sessionIds) => {
		const publish = capturePlacementReplicaRead(context.admission.identity);
		const records = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
			type: "workerPlacements.read",
			input: { sessionIds }
		}));
		const decorated = decorate(records);
		publish(records, sessionIds);
		return decorated;
	};
	const getManyAsync = async (sessionIds) => {
		const ids = [...new Set(sessionIds.map((id) => required(id, "session id")))];
		context.admission.assertCurrent();
		const cached = ids.map((id) => readPlacementReplica(context.admission.identity, id));
		if (cached.every((entry) => entry !== void 0)) {
			const records = cached.flatMap((entry) => entry.placement ? [structuredClone(entry.placement)] : []);
			return new Map(decorate(records).map((record) => [record.sessionId, record]));
		}
		const records = ids.length ? await read(ids) : [];
		return new Map(records.map((record) => [record.sessionId, record]));
	};
	return {
		getManyAsync,
		async getAsync(sessionId) {
			const id = required(sessionId, "session id");
			return (await getManyAsync([id])).get(id);
		},
		async getWithMoveAsync(sessionId) {
			const id = required(sessionId, "session id");
			const publish = capturePlacementReplicaRead(context.admission.identity);
			const result = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
				type: "workerPlacements.readWithMove",
				input: { sessionId: id }
			}));
			publish(result.placement ? [result.placement] : [], [id]);
			const [placement] = decorate(result.placement ? [result.placement] : []);
			return {
				...result,
				placement
			};
		},
		listAsync: () => read(),
		async getPlacementMoveAsync(sessionId) {
			const id = required(sessionId, "move session id");
			const move = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
				type: "workerPlacements.readMove",
				input: { sessionId: id }
			}));
			context.admission.assertCurrent();
			return move;
		},
		async listForReconcileAsync(sessionKey) {
			const publish = capturePlacementReplicaRead(context.admission.identity);
			const records = decorate(await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
				type: "workerPlacements.readReconcile",
				input: { sessionKey }
			})));
			publish(records);
			return records;
		}
	};
}
//#endregion
//#region src/gateway/worker-environments/placement-session-tool-operations.receipt.ts
const OperationStartSchema = Type.Union([
	Type.Object({
		kind: Type.Literal("execute"),
		operationSeed: Type.String()
	}),
	Type.Object({
		kind: Type.Literal("completed"),
		resultJson: Type.String()
	}),
	Type.Object({ kind: Type.Literal("in-progress") }),
	Type.Object({ kind: Type.Literal("unknown") }),
	Type.Object({ kind: Type.Literal("capacity") }),
	Type.Object({ kind: Type.Literal("conflict") }),
	Type.Object({ kind: Type.Literal("unauthorized") })
]);
const PlacementSessionToolReceiptSchema = Type.Object({
	result: Type.Optional(OperationStartSchema),
	changed: Type.Optional(Type.Boolean()),
	recovered: Type.Optional(Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	})),
	toolNames: Type.Optional(Type.Union([Type.Array(Type.String()), Type.Null()]))
});
//#endregion
//#region src/gateway/worker-environments/placement-session-tool-operations.ts
const waiters = resolveGlobalMap(Symbol.for("openclaw.workerSessionToolOperationWaiters"), (registered) => {
	const error = /* @__PURE__ */ new Error("Gateway lifecycle ended while waiting for worker session operations");
	for (const waiting of registered.values()) waiting.changed.resolve(error);
	registered.clear();
});
registerOpenClawStateDatabaseLifecycleListener((event) => {
	if (event.kind === "opened") return;
	for (const [id, waiting] of waiters) {
		if (waiting.path !== (event.identity?.canonicalPath ?? event.path)) continue;
		waiters.delete(id);
		const error = /* @__PURE__ */ new Error("Worker session operation database owner retired");
		waiting.error = error;
		waiting.changed.resolve(error);
	}
});
function createPlacementSessionToolOperationOps(runtime) {
	const context = captureOpenClawStateWorkerContext({ path: runtime.path });
	const key = (sessionId, claimId) => `${context.admission.identity.key}\0${sessionId}\0${claimId}`;
	const waitingFor = (id) => waiters.get(id) ?? {
		path: context.admission.identity.canonicalPath,
		changed: createDeferredCore(),
		subscribers: 0
	};
	const stageTools = (claim, toolNames = null) => stagePlacementTurnToolWorkerPublication(context.admission.identity, {
		claim,
		toolNames
	});
	const signal = (sessionId, claimId, error) => {
		const id = key(sessionId, claimId);
		const waiting = waitingFor(id);
		if (error) {
			waiting.error = error;
			waiters.set(id, waiting);
		} else if (!waiting.error) waiters.delete(id);
		waiting.changed.resolve(waiting.error);
	};
	async function execute(inputCommand, assertCurrent, admissionFence) {
		const command = structuredClone(inputCommand);
		const mutation = createPlacementWorkerMutation({
			context,
			label: "Worker session operation",
			nativeLocation: runtime.path,
			assertCurrent,
			readReceipt: (facts) => Value.Check(PlacementSessionToolReceiptSchema, facts) ? facts : void 0,
			stageCommit(facts) {
				if (!Value.Check(PlacementSessionToolReceiptSchema, facts)) throw new Error("Worker session operation commit has no receipt");
				if (facts.toolNames === void 0) return;
				if (command.type !== "placementTools.authorize" && command.type !== "placementTools.seal" && command.type !== "placementTools.clear") throw new Error("Worker session receipt has unexpected tool authority");
				return stageTools(command.input.args[0], facts.toolNames);
			},
			publish(receipt) {
				if (receipt.changed && (command.type === "placementTools.complete" || command.type === "placementTools.abandon")) {
					const operation = command.input.args[0];
					signal(operation.sourceSessionId, operation.sourceClaimId);
				}
			},
			recoverUnknown(error, publication) {
				publication?.invalidate();
				try {
					context.admission.assertCurrent();
				} catch {
					throw error;
				}
				const recoveryError = new Error(command.type === "placementTools.begin" ? "Worker session operation admission outcome is unknown; restart recovery is required" : "Worker session operation outcome is unknown; restart recovery is required", { cause: error });
				if (command.type === "placementTools.complete" || command.type === "placementTools.abandon" || command.type === "placementTools.bindChild") {
					const operation = command.input.args[0];
					signal(operation.sourceSessionId, operation.sourceClaimId, recoveryError);
				} else if (command.type === "placementTools.begin") {
					const { claim } = command.input.args[0];
					stageTools(claim).invalidate();
					signal(claim.sessionId, claim.claimId, recoveryError);
				}
			}
		});
		try {
			return await mutation.run((scope) => scope.execute(command));
		} finally {
			admissionFence?.rollback();
		}
	}
	const input = (args) => ({
		args,
		instanceId: runtime.instanceId,
		nowMs: runtime.now?.()
	});
	const closeAdmission = async (claim) => {
		context.admission.assertCurrent();
		await execute({
			type: "placementTools.seal",
			input: input([claim])
		}, void 0, stageTools(claim));
	};
	return {
		async authorizeWorkerTurnTools(claim, names, assertCurrent) {
			await execute({
				type: "placementTools.authorize",
				input: input([claim, names])
			}, assertCurrent);
		},
		isWorkerTurnToolAuthorized(claim, name) {
			try {
				context.admission.assertCurrent();
			} catch {
				return false;
			}
			return isPlacementTurnToolAuthorized(context.admission.identity, claim, name);
		},
		closeWorkerTurnToolAdmission: closeAdmission,
		async closeWorkerTurnToolState(claim) {
			await closeAdmission(claim);
			for (;;) {
				const id = key(claim.sessionId, claim.claimId);
				const waiting = waitingFor(id);
				waiting.subscribers++;
				waiters.set(id, waiting);
				try {
					if ((await execute({
						type: "placementTools.clear",
						input: input([claim])
					})).changed) {
						waiters.delete(id);
						return;
					}
					if (waiting.error) throw waiting.error;
					const error = await waiting.changed.promise;
					if (error) throw error;
				} finally {
					waiting.subscribers--;
					if (!waiting.error && waiting.subscribers === 0 && waiters.get(id) === waiting) waiters.delete(id);
				}
			}
		},
		async beginWorkerSessionToolOperation(params, assertCurrent) {
			const receipt = await execute({
				type: "placementTools.begin",
				input: input([params])
			}, assertCurrent);
			if (!receipt.result) throw new Error("Worker session operation admission receipt is missing");
			return receipt.result;
		},
		async bindWorkerSessionToolOperationChild(...args) {
			return (await execute({
				type: "placementTools.bindChild",
				input: input(args)
			})).changed === true;
		},
		async completeWorkerSessionToolOperation(...args) {
			return (await execute({
				type: "placementTools.complete",
				input: input(args)
			})).changed === true;
		},
		async abandonWorkerSessionToolOperation(...args) {
			return (await execute({
				type: "placementTools.abandon",
				input: input(args)
			})).changed === true;
		},
		async recoverWorkerSessionToolOperationsAfterRestart() {
			return (await execute({
				type: "placementTools.recover",
				input: input([])
			})).recovered ?? 0;
		}
	};
}
//#endregion
//#region src/gateway/worker-environments/placement-turn-claims-store.ts
const log = createSubsystemLogger("gateway/placement");
function isReceipt(value) {
	return isRecord(value) && (value.placement === void 0 || isRecord(value.placement) && typeof value.placement.sessionId === "string" && typeof value.placement.agentId === "string" && typeof value.placement.sessionKey === "string") && (value.claim === void 0 || isRecord(value.claim) && typeof value.claim.claimId === "string") && (value.closedClaim === void 0 || isRecord(value.closedClaim) && typeof value.closedClaim.claimId === "string") && (value.environmentActivation === void 0 || isRecord(value.environmentActivation) && typeof value.environmentActivation.environmentId === "string" && typeof value.environmentActivation.lastActivatedAtMs === "number");
}
function requirePlacement(receipt, operation) {
	if (!receipt.placement) throw new Error(`${operation} receipt is missing its placement`);
	return receipt.placement;
}
function createPlacementTurnClaimWorkerOps(runtime) {
	const context = captureOpenClawStateWorkerContext({ path: runtime.path });
	async function execute(input, assertCurrent, current, beforePublish) {
		const entryCheck = current?.sessionEntry;
		const capturedEntryCheck = entryCheck ? {
			source: { ...entryCheck.source },
			assertCurrent: (facts) => entryCheck.assertCurrent(facts)
		} : void 0;
		const command = { ...input };
		const sessionId = "claim" in input.input ? input.input.claim.sessionId : "pending" in input.input ? input.input.pending.sessionId : input.input.sessionId;
		if ("claim" in command.input) {
			const { claimId, runId, owner: requestedOwner } = command.input.claim;
			const { kind, environmentId, ownerEpoch } = requestedOwner;
			const claim = {
				sessionId,
				claimId,
				runId,
				owner: kind === "local" ? {
					kind,
					environmentId,
					ownerEpoch
				} : {
					kind,
					environmentId,
					ownerEpoch
				}
			};
			if (command.type === "placementTurns.claim" || command.type === "placementTurns.claimReclaimResult" || command.type === "placementTurns.claimMutationResult") {
				const { agentId, sessionKey } = command.input.claim;
				command.input = {
					...command.input,
					claim: {
						...claim,
						agentId,
						sessionKey
					}
				};
			} else {
				const { placementGeneration } = command.input.claim;
				command.input = {
					...command.input,
					claim: {
						...claim,
						placementGeneration
					}
				};
			}
		} else command.input = structuredClone(command.input);
		if (command.type === "placementTurns.recordStagedResult" || command.type === "placementTurns.updateWorkspaceBaseManifest" || command.type === "placementTurns.claimMutationResult" || command.type === "placementTurns.acceptResult" || command.type === "placementTurns.completeResult") command.input = {
			...command.input,
			sessionEntryCurrentSource: capturedEntryCheck?.source
		};
		let close = command.type === "placementTurns.release" || command.type === "placementTurns.releaseIfOwned" || command.type === "placementTurns.completeResult" || command.type === "placementTurns.cancelResult" ? prepareWorkerTurnClaimClosed(runtime.path, command.input.claim) : void 0;
		let reportedContention = false;
		for (;;) {
			let prepared;
			let previousState;
			let projectionPublication;
			const mutation = createPlacementWorkerMutation({
				context,
				label: "Placement claim",
				nativeLocation: runtime.path,
				assertCurrent,
				admissionFacts(request) {
					if (request.stage !== "transaction" && request.stage !== "commit") return request.facts;
					const admitted = assertSessionEntryCurrentAdmission(request, capturedEntryCheck);
					if (!isReceipt(admitted.facts)) throw new Error("Placement admission has no current placement facts");
					if (request.stage === "transaction") previousState = admitted.facts.placement ? admitted.facts.placement.state : null;
					current?.assertPlacementCurrent(admitted.facts.placement, admitted.facts.placementMove);
					return admitted.facts;
				},
				readReceipt: (facts) => isReceipt(facts) ? facts : void 0,
				stageCommit(facts, nativeSettlement) {
					if (!isReceipt(facts)) throw new Error("Placement claim commit has no receipt");
					prepared = facts;
					if (facts.placement && (command.type === "placementTurns.claim" || command.type === "placementTurns.release" || command.type === "placementTurns.releaseIfOwned")) facts.projection ??= projectLocalPlacementTurnClaim(context.admission.identity, facts.placement);
					if (facts.projection) projectionPublication = preparePlacementProjectionPublication(context.admission.identity, facts.projection);
					if (command.type === "placementTurns.releaseIfOwned" && !facts.placement) return;
					if (facts.claim) beforePublish?.(facts.claim);
					const workspaceOnly = command.type === "placementTurns.updateAckCursors" || command.type === "placementTurns.recordStagedResult" || command.type === "placementTurns.updateWorkspaceBaseManifest" || command.type === "placementTurns.markResultPending" || command.type === "placementTurns.acceptResult" || command.type === "placementTurns.handoffResult" || command.type === "placementTurns.abandonResult";
					if (facts.placement && facts.placement.sessionId !== sessionId) throw new Error("Workspace result receipt has a different owner");
					if (facts.closedClaim) {
						if (facts.closedClaim.sessionId !== sessionId) throw new Error("Placement closure receipt has a different owner");
						close = prepareWorkerTurnClaimClosed(runtime.path, facts.closedClaim);
					}
					const resultFacts = facts.placement && facts.workspaceResult !== void 0 ? {
						placement: facts.placement,
						pendingResult: facts.workspaceResult ?? void 0
					} : void 0;
					const activation = facts.environmentActivation;
					if (activation && (facts.placement?.state !== "active" || facts.placement.environmentId !== activation.environmentId)) throw new Error("Placement activation receipt has a different environment owner");
					const publication = facts.placement && !workspaceOnly ? stagePlacementTurnClaimWorkerPublication(context.admission.identity, facts.placement, resultFacts, previousState, facts.placement, facts.projection ? {
						projection: facts.projection,
						conflictSessionIds: /* @__PURE__ */ new Set()
					} : void 0, nativeSettlement, command.type === "placementTurns.claim" || command.type === "placementTurns.release" || command.type === "placementTurns.releaseIfOwned" || command.type === "placementTurns.claimReclaimResult" || command.type === "placementTurns.claimMutationResult" || command.type === "placementTurns.completeResult" || command.type === "placementTurns.cancelResult") : stagePlacementWorkspaceResultWorkerPublication(context.admission.identity, sessionId, resultFacts);
					if (!activation) return publication;
					const publishEnvironment = reserveWorkerEnvironmentNativePublication(context.admission.identity);
					return {
						...publication,
						commit() {
							publishEnvironment?.(activation.environmentId, { lastActivatedAtMs: activation.lastActivatedAtMs });
							publication.commit();
						}
					};
				},
				publish(receipt) {
					if (receipt.placement) {
						close?.();
						if (receipt.environmentActivation) sessionChanges.emit({
							all: true,
							scope: "worker-environments"
						});
						if (command.type !== "placementTurns.transition" && command.type !== "placementTurns.startReconcile" && command.type !== "placementTurns.fail" && (command.type !== "placementTurns.startDrain" || command.input.workspaceBaseManifestRef !== void 0)) {
							const change = {
								agentId: receipt.placement.agentId,
								sessionKey: receipt.placement.sessionKey
							};
							try {
								projectionPublication?.publish(change);
								sessionChanges.emit(change);
							} finally {
								projectionPublication?.release();
							}
						}
						if (close && receipt.placement.turnClaim === null && receipt.workspaceResult === null) emitSessionLifecycleEvent({
							sessionKey: receipt.placement.sessionKey,
							agentId: receipt.placement.agentId,
							reason: "placement",
							scope: "runtime"
						});
					}
				},
				async recoverUnknown(error, publication) {
					projectionPublication?.release();
					if (command.type !== "placementTurns.claim" && command.type !== "placementTurns.release" && command.type !== "placementTurns.releaseIfOwned") {
						publication?.invalidate();
						throw new AcceptedWorkspacePublicationIndeterminateError("commit", error, /* @__PURE__ */ new Error("Workspace result settlement is unavailable"));
					}
					const reply = await (async () => {
						try {
							context.admission.assertCurrent();
							return await executeExistingOpenClawStateRead({ path: runtime.path }, {
								type: "workers.placementProjection",
								sessionIds: [command.input.claim.sessionId],
								conflictBindings: []
							}, { current: true });
						} catch (readError) {
							if (command.type === "placementTurns.claim" && prepared?.claim) try {
								await execute({
									type: "placementTurns.releaseIfOwned",
									input: {
										claim: prepared.claim,
										nowMs: runtime.now?.()
									}
								});
								publication?.rollback();
							} catch (cleanupError) {
								throw new AggregateError([
									error,
									readError,
									cleanupError
								], "Placement turn claim custody could not be settled; restart recovery is required", { cause: cleanupError });
							}
							throw new AggregateError([error, readError], "Placement turn outcome readback failed", { cause: readError });
						}
					})();
					context.admission.assertCurrent();
					if (!reply?.ok || reply.type !== "workers.placementProjection") throw error;
					const placement = reply.result.projection.placements.get(command.input.claim.sessionId);
					if (command.type === "placementTurns.claim" ? placement && prepared?.claim && isCurrentPlacementTurnClaim(placement, prepared.claim) : !placement || !isCurrentPlacementTurnClaim(placement, command.input.claim)) {
						if (prepared) return prepared;
					}
					publication?.rollback();
				}
			});
			try {
				return await mutation.run((scope) => scope.execute(command));
			} catch (error) {
				if (command.type === "placementTurns.releaseIfOwned" && !mutation.transactionGranted && !mutation.commitGranted && mutation.settlement?.kind !== "unknown" && isSqliteLockError(error)) {
					context.admission.assertCurrent();
					if (!reportedContention) {
						reportedContention = true;
						log.warn("Turn claim release is waiting for the state database", {
							sessionId: command.input.claim.sessionId,
							runId: command.input.claim.runId,
							error
						});
					}
					continue;
				}
				if (error instanceof Error && error.name === "ActiveTurnClaimError") throw new ActiveTurnClaimError(sessionId);
				throw error;
			} finally {
				projectionPublication?.release();
			}
		}
	}
	const placementOperation = (operation, command) => async (input, assertCurrent) => requirePlacement(await execute(command(input), assertCurrent), operation);
	return {
		transition: placementOperation("Placement transition", (input) => ({
			type: "placementTurns.transition",
			input: {
				...input,
				nowMs: runtime.now?.()
			}
		})),
		startDrain: placementOperation("Placement drain", (input) => ({
			type: "placementTurns.startDrain",
			input: {
				...input,
				nowMs: runtime.now?.()
			}
		})),
		startReconcile: placementOperation("Placement reconciliation", (input) => ({
			type: "placementTurns.startReconcile",
			input: {
				...input,
				nowMs: runtime.now?.()
			}
		})),
		fail: placementOperation("Placement failure", (input) => ({
			type: "placementTurns.fail",
			input: {
				...input,
				nowMs: runtime.now?.()
			}
		})),
		async failWorkspaceResultAndReleaseTurn(pending, error, assertCurrent) {
			return requirePlacement(await execute({
				type: "placementTurns.failResult",
				input: {
					pending,
					recoveryError: boundedWorkerError(error),
					nowMs: runtime.now?.()
				}
			}, assertCurrent), "Workspace result failure");
		},
		async claimReclaimWorkspaceResult(input, beforePublish, assertCurrent) {
			const receipt = await execute({
				type: "placementTurns.claimReclaimResult",
				input: {
					claim: input,
					gatewayInstanceId: runtime.instanceId,
					nowMs: runtime.now?.()
				}
			}, assertCurrent, void 0, beforePublish);
			if (!receipt.claim) throw new Error("Workspace result claim receipt is missing its claim");
			return receipt.claim;
		},
		async claimWorkspaceMutationResult(input, assertCurrent, current) {
			const receipt = await execute({
				type: "placementTurns.claimMutationResult",
				input: {
					claim: {
						...input,
						runId: input.claimId
					},
					gatewayInstanceId: runtime.instanceId,
					nowMs: runtime.now?.()
				}
			}, assertCurrent, current);
			if (!receipt.claim) throw new Error("Workspace result claim receipt is missing its claim");
			return receipt.claim;
		},
		async markWorkspaceResultPending(claim, assertCurrent) {
			await execute({
				type: "placementTurns.markResultPending",
				input: {
					claim,
					gatewayInstanceId: runtime.instanceId,
					nowMs: runtime.now?.()
				}
			}, assertCurrent);
		},
		async acceptWorkspaceResult(claim, assertCurrent, current) {
			await execute({
				type: "placementTurns.acceptResult",
				input: {
					claim,
					nowMs: runtime.now?.()
				}
			}, assertCurrent, current);
		},
		async handoffWorkspaceResultRecovery(claim, assertCurrent) {
			await execute({
				type: "placementTurns.handoffResult",
				input: {
					claim,
					gatewayInstanceId: runtime.instanceId,
					nowMs: runtime.now?.()
				}
			}, assertCurrent);
		},
		async abandonWorkspaceResult(pending, assertCurrent) {
			await execute({
				type: "placementTurns.abandonResult",
				input: { pending }
			}, assertCurrent);
		},
		startWorkspaceResultDrain: placementOperation("Workspace result drain", (claim) => ({
			type: "placementTurns.drainResult",
			input: {
				claim,
				nowMs: runtime.now?.()
			}
		})),
		async completeWorkspaceResultAndReleaseTurn(claim, assertCurrent, current) {
			return requirePlacement(await execute({
				type: "placementTurns.completeResult",
				input: {
					claim,
					nowMs: runtime.now?.()
				}
			}, assertCurrent, current), "Workspace result completion");
		},
		async cancelWorkspaceResultAndReleaseTurn(claim, options, assertCurrent) {
			return requirePlacement(await execute({
				type: "placementTurns.cancelResult",
				input: {
					claim,
					reason: options?.reason,
					gatewayInstanceId: runtime.instanceId,
					nowMs: runtime.now?.()
				}
			}, assertCurrent), "Workspace result cancellation");
		},
		async updateAckCursors(input, assertCurrent) {
			return requirePlacement(await execute({
				type: "placementTurns.updateAckCursors",
				input: {
					...input,
					gatewayInstanceId: runtime.instanceId,
					nowMs: runtime.now?.()
				}
			}, assertCurrent, { assertPlacementCurrent(placement) {
				if (!placement || !isCurrentPlacementTurnClaim(placement, input.claim)) throw new Error(`Cannot ACK stale worker turn for session ${input.claim.sessionId}`);
			} }), "Worker ACK");
		},
		async updateWorkspaceBaseManifest(input, assertCurrent, current) {
			return requirePlacement(await execute({
				type: "placementTurns.updateWorkspaceBaseManifest",
				input: {
					...input,
					nowMs: runtime.now?.()
				}
			}, assertCurrent, current), "Workspace journal commit");
		},
		async recordStagedWorkspaceResult(claim, stagedResultRef, repositoryWorkspaceId, assertCurrent, current) {
			await execute({
				type: "placementTurns.recordStagedResult",
				input: {
					claim,
					stagedResultRef,
					repositoryWorkspaceId
				}
			}, assertCurrent, current);
		},
		async retainInterruptedTurnWorkspace(claim, assertCurrent) {
			await execute({
				type: "placementTurns.recoverWorkspace",
				input: {
					claim,
					gatewayInstanceId: runtime.instanceId,
					nowMs: runtime.now?.()
				}
			}, assertCurrent);
		},
		handoffRuntimeRefreshResult: placementOperation("Worker runtime refresh handoff", ({ claim, expectedGeneration, gatewayInstanceId }) => ({
			type: "placementTurns.handoffRuntimeRefreshResult",
			input: {
				claim,
				expectedGeneration,
				gatewayInstanceId,
				nowMs: runtime.now?.() ?? Date.now()
			}
		})),
		async claimTurn(input, assertCurrent) {
			const receipt = await execute({
				type: "placementTurns.claim",
				input: {
					claim: input,
					nowMs: runtime.now?.()
				}
			}, assertCurrent);
			if (!receipt.claim) throw new Error("Placement turn claim receipt is missing its claim");
			return receipt.claim;
		},
		releaseTurn: placementOperation("Placement turn release", (claim) => ({
			type: "placementTurns.release",
			input: {
				claim,
				nowMs: runtime.now?.()
			}
		})),
		async releaseTurnIfOwned(claim) {
			await execute({
				type: "placementTurns.releaseIfOwned",
				input: {
					claim,
					nowMs: runtime.now?.()
				}
			});
		}
	};
}
//#endregion
//#region src/gateway/worker-environments/placement-turn-wait.ts
/** Register before the worker read so a release cannot be lost while the read is pending. */
function waitForPlacementTurnClaimRelease(path, sessionIdInput, options, read) {
	const sessionId = required(sessionIdInput, "session id");
	if (options.timeoutMs !== void 0 && (!Number.isSafeInteger(options.timeoutMs) || options.timeoutMs < 0)) return Promise.reject(/* @__PURE__ */ new Error("Worker session turn claim wait timeout must be a non-negative integer"));
	return new Promise((resolve, reject) => {
		let settled = false;
		let timer;
		const finish = (error) => {
			if (settled) return;
			settled = true;
			if (timer) clearTimeout(timer);
			options.signal?.removeEventListener("abort", onAbort);
			removeTurnClaimReleaseWaiter(path, sessionId, finish);
			if (error) reject(error);
			else resolve();
		};
		const onAbort = () => finish(/* @__PURE__ */ new Error(`Turn claim wait aborted for session ${sessionId}`));
		waitersFor(path, sessionId).add(finish);
		options.signal?.addEventListener("abort", onAbort, { once: true });
		if (options.signal?.aborted) {
			onAbort();
			return;
		}
		if (options.timeoutMs !== void 0) timer = setTimeout(() => finish(/* @__PURE__ */ new Error(`Timed out waiting for session ${sessionId} turn claim release`)), options.timeoutMs);
		read(sessionId).then((placement) => {
			if (!placement?.turnClaim) finish();
		}, (error) => finish(error instanceof Error ? error : new Error(String(error))));
	});
}
//#endregion
//#region src/gateway/worker-environments/placement-workspace-journal.types.ts
function isJournalOwner(value) {
	return isRecord(value) && typeof value.sessionId === "string" && typeof value.environmentId === "string" && typeof value.ownerEpoch === "number" && typeof value.placementGeneration === "number";
}
function isWorkspaceJournalReceipt(value) {
	return isRecord(value) && (value.type === "placementJournals.begin" || value.type === "placementJournals.abort" || value.type === "placementJournals.prune") && Array.isArray(value.owners) && value.owners.every(isJournalOwner) && Array.isArray(value.changes) && value.changes.every((change) => isRecord(change) && (change.all === true && change.scope === "worker-placements" || typeof change.agentId === "string" && typeof change.sessionKey === "string"));
}
//#endregion
//#region src/gateway/worker-environments/placement-workspace-journal-store.ts
function createPlacementWorkspaceJournalWorkerOps(runtime) {
	const context = captureOpenClawStateWorkerContext({ path: runtime.path });
	async function read(command, assertCurrent) {
		context.admission.assertCurrent();
		assertCurrent?.();
		const reply = await executeExistingOpenClawStateRead({ path: runtime.path }, command, { current: true });
		context.admission.assertCurrent();
		assertCurrent?.();
		if (reply?.ok && reply.type === command.type) switch (reply.type) {
			case "placementJournals.owners":
			case "placementJournals.placement":
			case "placementJournals.load": return reply;
		}
		throw new Error("Worker workspace journal reader is unavailable");
	}
	async function execute(command, assertCurrent, preparation) {
		const readReceipt = (facts) => isWorkspaceJournalReceipt(facts) && facts.type === command.type ? facts : void 0;
		const mutation = createPlacementWorkerMutation({
			context,
			label: "Worker workspace journal",
			nativeLocation: runtime.path,
			assertCurrent() {
				assertCurrent?.();
				preparation?.assertCurrent();
			},
			readReceipt,
			stageCommit(facts) {
				const receipt = readReceipt(facts);
				if (!receipt) throw new Error("Worker workspace journal commit has an invalid receipt");
				const publications = [];
				const rollback = () => publications.forEach((publication) => publication.rollback());
				try {
					for (const owner of receipt.owners) publications.push(stagePlacementWorkspaceJournalWorkerPublication(context.admission.identity, owner.sessionId, command.type === "placementJournals.begin"));
				} catch (error) {
					rollback();
					throw error;
				}
				return {
					commit: () => publications.forEach((publication) => publication.commit()),
					rollback,
					invalidate: () => publications.forEach((publication) => publication.invalidate())
				};
			},
			publish(receipt) {
				sessionChanges.emitBatch(receipt.changes);
			}
		});
		try {
			return await mutation.run((scope) => preparation ? preparation.handoff(() => scope.execute(command)) : scope.execute(command));
		} finally {
			preparation?.release();
		}
	}
	return {
		async getWorkspaceReconciliationPlacement(owner, assertCurrent) {
			const reply = await read({
				type: "placementJournals.placement",
				owner: { ...owner }
			}, assertCurrent);
			if (reply.type !== "placementJournals.placement") throw new Error("Unexpected workspace journal placement reply");
			return reply.placement;
		},
		async listWorkspaceReconciliationOwners(assertCurrent) {
			const reply = await read({ type: "placementJournals.owners" }, assertCurrent);
			if (reply.type !== "placementJournals.owners") throw new Error("Unexpected workspace journal owners reply");
			return reply.owners;
		},
		async loadWorkspaceReconciliation(owner, options = {}, assertCurrent) {
			const reply = await read({
				type: "placementJournals.load",
				owner: { ...owner },
				allowFailedOwner: options.allowFailedOwner
			}, assertCurrent);
			if (reply.type !== "placementJournals.load") throw new Error("Unexpected workspace journal load reply");
			return reply.journal;
		},
		async beginWorkspaceReconciliation(owner, journal, assertCurrent) {
			const input = {
				owner: { ...owner },
				journal,
				nowMs: runtime.now?.()
			};
			const metadataBytes = serialize({
				type: "placementJournals.begin",
				input: {
					...input,
					journal: {
						...journal,
						basePack: /* @__PURE__ */ new Uint8Array()
					}
				}
			}).byteLength;
			const preparation = reserveSqliteWorkerInputPreparation(metadataBytes + journal.basePack.byteLength);
			try {
				await execute({
					type: "placementJournals.begin",
					input: structuredClone(input)
				}, assertCurrent, preparation);
			} finally {
				preparation.release();
			}
		},
		async abortWorkspaceReconciliation(owner, options = {}, assertCurrent) {
			await execute({
				type: "placementJournals.abort",
				input: {
					owner: { ...owner },
					force: options.force
				}
			}, assertCurrent);
		},
		async pruneOrphanedWorkspaceReconciliations(assertCurrent) {
			return (await execute({
				type: "placementJournals.prune",
				input: {}
			}, assertCurrent)).owners;
		}
	};
}
//#endregion
//#region src/gateway/worker-environments/placement-workspace-reservation.ts
const SCOPE = "session-workspace-action";
function assertReconciled(facts, identity, workspace) {
	const placement = facts.placements.get(identity.sessionId);
	const pending = facts.pendingResults.has(identity.sessionId);
	const reconciling = facts.workspaceRecoveryPendingSessionIds.has(identity.sessionId);
	if (placement && (placement.agentId !== identity.agentId || placement.sessionKey !== identity.sessionKey)) throw new Error("The session workspace placement identity changed.");
	if (placement && (placement.state !== "local" && placement.state !== "reclaimed" && !(workspace === "repository" && (placement.state === "active" || placement.state === "failed")) || placement.turnClaim)) throw new SessionWorkspaceReservationBusyError(workspace === "repository" ? "The repository checkpoint is busy; finish the current turn or worker operation before publishing." : "My GitHub publication requires an idle local workspace; finish the turn and reclaim remote work first.");
	if (pending || reconciling) throw new SessionWorkspaceReservationBusyError("The session workspace is still reconciling; wait for reclaim to finish before publishing with My GitHub.");
}
function createPlacementWorkspaceReservationOps(runtime, read) {
	const signal = getGatewayRestartDrainSignal();
	const withReservation = async (scope, sessionId, run) => await withOpenClawStateLease({
		scope,
		key: sessionId,
		database: {
			scope: "shared",
			options: { path: runtime.path }
		},
		leaseMs: 6e4,
		waitMs: 0,
		leaseLabel: "session publication exclusion",
		signal
	}, async (lease) => await run(() => lease.assertOwned()));
	const withWorkspaceExclusion = (sessionId, run) => withReservation(SCOPE, sessionId, run);
	const withWorkspaceReservation = async (identity, workspace, run) => {
		return await withWorkspaceExclusion(identity.sessionId, async (assertPublisherExclusion) => await withReservation(PERSONAL_SCOPE, identity.sessionId, async (assertOwned) => {
			const prepared = await preparePlacementAuthorityRead(runtime.path, identity.sessionId, () => read(identity.sessionId));
			try {
				assertReconciled(prepared.value, identity, workspace);
				const assertCurrent = () => {
					assertPublisherExclusion();
					assertOwned();
					prepared.assertCurrent();
				};
				return await run(assertCurrent);
			} finally {
				prepared.release();
			}
		}));
	};
	return {
		withWorkspaceExclusion,
		withLocalWorkspaceReservation: (identity, run) => withWorkspaceReservation(identity, "local", run),
		withRepositoryWorkspaceReservation: (identity, run) => withWorkspaceReservation(identity, "repository", run)
	};
}
//#endregion
//#region src/gateway/worker-environments/placement-workspace-result-store.ts
function createPlacementWorkspaceResultReader(runtime, read) {
	const context = captureOpenClawStateWorkerContext({ path: runtime.path });
	const current = (claim) => {
		context.admission.assertCurrent();
		return readPlacementWorkspaceResultAuthority(context.admission.identity, claim);
	};
	return {
		workspaceResultInstanceId: () => runtime.instanceId,
		async prepareWorkspaceResultClaim(claim) {
			context.admission.assertCurrent();
			await preparePlacementWorkspaceResultAuthority(runtime.path, claim, read);
			context.admission.assertCurrent();
		},
		validateWorkspaceResultClaim: (claim) => Boolean(current(claim)),
		preparedWorkspaceResult: (claim) => current(claim)?.pendingResult,
		preparedWorkspaceResultPlacement: (claim) => current(claim)?.placement,
		/** @deprecated Await listPendingWorkspaceResultsAsync; retained for released plugin contexts. */
		listPendingWorkspaceResults(sessionId) {
			warnPluginSdkDeprecation({
				family: "worker-placement-sync-readers",
				method: "listPendingWorkspaceResults",
				replacement: "listPendingWorkspaceResultsAsync",
				compatibility: "Synchronous placement inventory reads now fail with migration guidance."
			});
			throw new Error("Await listPendingWorkspaceResultsAsync; synchronous placement inventory reads are no longer supported.");
		},
		/** @deprecated Await getWorkspaceResultReconcilingSessionIdsAsync. */
		getWorkspaceResultReconcilingSessionIds(sessionIds) {
			warnPluginSdkDeprecation({
				family: "worker-placement-sync-readers",
				method: "getWorkspaceResultReconcilingSessionIds",
				replacement: "getWorkspaceResultReconcilingSessionIdsAsync",
				compatibility: "Synchronous placement inventory reads now fail with migration guidance."
			});
			throw new Error("Await getWorkspaceResultReconcilingSessionIdsAsync; synchronous placement inventory reads are no longer supported.");
		},
		async getWorkspaceResultReconcilingSessionIdsAsync(sessionIds) {
			context.admission.assertCurrent();
			const projection = await read([...new Set(sessionIds.map((sessionId) => required(sessionId, "session id")))]);
			context.admission.assertCurrent();
			return projection.workspaceResultReconcilingSessionIds;
		},
		async listPendingWorkspaceResultsAsync(sessionId) {
			context.admission.assertCurrent();
			const reply = await executeExistingOpenClawStateRead({ path: context.admission.databasePath }, {
				type: "workers.placementPendingResults",
				sessionId
			}, { current: true });
			context.admission.assertCurrent();
			if (!reply?.ok || reply.type !== "workers.placementPendingResults") throw new Error("Worker workspace results are unavailable");
			return reply.pendingResults;
		}
	};
}
//#endregion
//#region src/gateway/worker-environments/placement-store.ts
function exactConflictPath(value) {
	if (typeof value !== "string" || value.length === 0) throw new Error("Worker placement conflict path is required");
	return value;
}
function createWorkerSessionPlacementStore(options = {}) {
	const path = (options.database ?? openOpenClawStateDatabase()).path;
	const now = options.now ?? Date.now;
	const context = captureOpenClawStateWorkerContext({ path });
	const runtime = {
		path,
		instanceId: randomUUID(),
		now
	};
	const workspaceResultConflicts = /* @__PURE__ */ new Map();
	const withWorkspaceResultConflict = (record) => {
		if (!record) return;
		const conflict = workspaceResultConflicts.get(record.sessionId)?.conflict;
		return conflict ? {
			...record,
			workspaceResultConflict: conflict
		} : record;
	};
	const store = {
		subscribeChanges(listener) {
			return subscribePlacementChanges(context.admission.identity, listener);
		},
		...createPlacementReadStore({
			path,
			withWorkspaceResultConflict
		}),
		...createPlacementWorkspaceReservationOps(runtime, (sessionId) => store.readProjection([sessionId], { current: true })),
		/** @deprecated Await clearLocalTurnClaimsAfterRestartAsync; removed in the next Plugin SDK major. */
		clearLocalTurnClaimsAfterRestart() {
			warnPluginSdkDeprecation({
				family: "worker-placement-sync-writers",
				method: "clearLocalTurnClaimsAfterRestart",
				replacement: "clearLocalTurnClaimsAfterRestartAsync",
				compatibility: "Synchronous placement writes now fail with migration guidance; await the replacement."
			});
			throw new Error("Await clearLocalTurnClaimsAfterRestartAsync; synchronous placement writes are no longer supported.");
		},
		waitForTurnClaimRelease: (sessionId, waitOptions) => waitForPlacementTurnClaimRelease(path, sessionId, waitOptions, (id) => store.getAsync(id)),
		validateTurnClaim(claim) {
			context.admission.assertCurrent();
			return isPublishedPlacementTurnClaimCurrent(context.admission.identity, claim);
		},
		readWorkerTurnClaim(binding) {
			context.admission.assertCurrent();
			const record = readPlacementReplica(context.admission.identity, binding.sessionId)?.placement;
			const claim = record ? projectWorkerSessionTurnClaim(record) : void 0;
			return claim?.owner.environmentId === binding.environmentId && claim.owner.ownerEpoch === binding.ownerEpoch && isPublishedPlacementTurnClaimCurrent(context.admission.identity, claim) ? claim : void 0;
		},
		...createPlacementSessionToolOperationOps({
			path,
			instanceId: runtime.instanceId,
			now: options.now
		}),
		...createPlacementTurnClaimWorkerOps({
			path,
			instanceId: runtime.instanceId,
			now: options.now
		}),
		...createPlacementLifecycleWorkerOps({
			path,
			now: options.now,
			onRetired: (sessionId) => workspaceResultConflicts.delete(sessionId)
		}),
		...createPlacementWorkspaceJournalWorkerOps({
			path,
			now: options.now
		}),
		...createPlacementWorkspaceResultReader(runtime, (ids) => store.readProjection(ids, { current: true })),
		registerTurnClaimClosedHandler(handler) {
			return registerWorkerTurnClaimClosedHandler(path, handler);
		},
		/** @deprecated Await getAsync for cold reads; this method uses only prepared in-process facts. */
		get(sessionId) {
			warnPluginSdkDeprecation({
				family: "worker-placement-sync-readers",
				method: "get",
				replacement: "getAsync",
				compatibility: "Synchronous reads use committed in-process receipts; cold or inventory reads require the async replacement."
			});
			context.admission.assertCurrent();
			const cached = readPlacementReplica(context.admission.identity, required(sessionId, "session id"));
			if (!cached) throw new Error("Await getAsync to read a placement without a committed in-process receipt.");
			return withWorkspaceResultConflict(structuredClone(cached.placement));
		},
		prepareTurnClaimAuthority(claim) {
			return preparePlacementTurnClaimAuthority(path, claim, (sessionIds) => store.readProjection(sessionIds, { current: true }));
		},
		async prepareRuntimeRefresh(sessionIdInput) {
			const sessionId = required(sessionIdInput, "session id");
			const { value: projection, ...observation } = await preparePlacementAuthorityRead(path, sessionId, () => store.readProjection([sessionId], { current: true }));
			return {
				placement: projection.placements.get(sessionId),
				move: projection.moves.get(sessionId),
				pendingResult: projection.pendingResults.get(sessionId),
				...observation
			};
		},
		prepareSessionPlacement(sessionIdInput) {
			const sessionId = required(sessionIdInput, "session id");
			return prepareSessionPlacementRead(path, sessionId, () => store.getAsync(sessionId));
		},
		async prepareMaintenancePlacements() {
			return await preparePlacementPreservationRead(path, async () => {
				const result = await executeExistingOpenClawStateRead({ path }, { type: "workers.placementPreservation" }, { current: true });
				if (!result || !result.ok || result.type !== "workers.placementPreservation") throw new Error("Worker placement preservation source is unavailable");
				return result.placements;
			});
		},
		async readProjection(sessionIds, readOptions = {}) {
			const requestedIds = new Map(sessionIds.map((id) => [id, required(id, "session id")]));
			const ids = [...new Set(requestedIds.values())];
			const conflicts = new Map(ids.flatMap((id) => {
				const conflict = workspaceResultConflicts.get(id);
				return conflict ? [[id, conflict]] : [];
			}));
			const loadProjection = async () => {
				const publish = capturePlacementReplicaRead(context.admission.identity);
				const result = await executeExistingOpenClawStateRead({ path }, {
					type: "workers.placementProjection",
					sessionIds: ids,
					conflictBindings: [...conflicts.values()].map(({ placement, claim }) => ({
						placement: {
							sessionId: placement.sessionId,
							generation: placement.generation,
							environmentId: placement.environmentId,
							activeOwnerEpoch: placement.activeOwnerEpoch
						},
						claim: { ...claim }
					}))
				}, readOptions);
				if (!result || !result.ok || result.type !== "workers.placementProjection") throw new Error("Worker placement projection source is unavailable");
				publish(result.result.projection.placements.values(), ids);
				return result.result;
			};
			const singleSessionId = ids.length === 1 ? ids[0] : void 0;
			const { projection, conflictSessionIds } = singleSessionId !== void 0 && conflicts.size === 0 ? await readPlacementProjection(path, singleSessionId, loadProjection) : await loadProjection();
			const placements = new Map(projection.placements);
			for (const [id, captured] of conflicts) {
				const record = placements.get(id);
				if (record && conflictSessionIds.has(id) && workspaceResultConflicts.get(id) === captured) placements.set(id, {
					...record,
					workspaceResultConflict: captured.conflict
				});
			}
			const byRequestedId = (records) => {
				const requested = /* @__PURE__ */ new Map();
				for (const [original, normalized] of requestedIds) {
					const value = records.get(normalized);
					if (value !== void 0) requested.set(original, value);
				}
				return requested;
			};
			const byRequestedSet = (normalizedSessionIds) => new Set([...requestedIds].flatMap(([original, normalized]) => normalizedSessionIds.has(normalized) ? [original] : []));
			return {
				...projection,
				placements: byRequestedId(placements),
				moves: byRequestedId(projection.moves),
				pendingResults: byRequestedId(projection.pendingResults),
				workspaceJournalOwnerSessionIds: byRequestedSet(projection.workspaceJournalOwnerSessionIds),
				workspaceResultReconcilingSessionIds: byRequestedSet(projection.workspaceResultReconcilingSessionIds),
				workspaceRecoveryPendingSessionIds: byRequestedSet(projection.workspaceRecoveryPendingSessionIds)
			};
		},
		readPublishedProjection(change) {
			const projection = readPublishedPlacementProjection(context.admission.identity, change);
			if (!projection) return;
			try {
				context.admission.assertCurrent();
				return projection;
			} catch {
				return;
			}
		},
		async readEnvironmentOwner(environmentId) {
			const result = await executeExistingOpenClawStateRead({ path }, {
				type: "workers.placementEnvironmentOwner",
				environmentId: required(environmentId, "environment id")
			}, { current: true });
			if (!result || !result.ok || result.type !== "workers.placementEnvironmentOwner") throw new Error("Worker placement environment owner source is unavailable");
			return result.placement;
		},
		async readRecoveryCandidates() {
			return await readPlacementRecoveryCandidates(path, async () => {
				const result = await executeExistingOpenClawStateRead({ path }, { type: "workers.placementRecoveryCandidates" }, { current: true });
				if (!result || !result.ok || result.type !== "workers.placementRecoveryCandidates") throw new Error("Worker placement recovery candidates source is unavailable");
				return result.candidates;
			});
		},
		/** @deprecated Await getManyAsync; retained through the next Plugin SDK major. */
		getMany(sessionIds) {
			warnPluginSdkDeprecation({
				family: "worker-placement-sync-readers",
				method: "getMany",
				replacement: "getManyAsync",
				compatibility: "Synchronous reads use committed in-process receipts; cold or inventory reads require the async replacement."
			});
			const records = /* @__PURE__ */ new Map();
			for (const sessionId of sessionIds) {
				const record = store.get(sessionId);
				if (record) records.set(record.sessionId, record);
			}
			return records;
		},
		/** @deprecated Await retireSessionPlacementAsync; removed in the next Plugin SDK major. */
		retireSessionPlacement(input) {
			warnPluginSdkDeprecation({
				family: "worker-placement-sync-writers",
				method: "retireSessionPlacement",
				replacement: "retireSessionPlacementAsync",
				compatibility: "Synchronous placement writes now fail with migration guidance; await the replacement."
			});
			throw new Error("Await retireSessionPlacementAsync; synchronous placement writes are no longer supported.");
		},
		recordWorkspaceResultConflict(claim, conflict) {
			const current = store.preparedWorkspaceResultPlacement(claim);
			if (!current) throw new Error(`Session ${claim.sessionId} workspace result conflict owner changed`);
			if (!conflict) {
				workspaceResultConflicts.delete(claim.sessionId);
				sessionChanges.emit({
					agentId: current.agentId,
					sessionKey: current.sessionKey
				});
				return;
			}
			const paths = conflict.paths.map(exactConflictPath);
			const stagedResultRef = required(conflict.stagedResultRef, "staged result ref");
			if (paths.length === 0 || !/^refs\/openclaw\/worker-results\/[A-Za-z0-9-]+$/u.test(stagedResultRef)) throw new Error("Cloud workspace result conflict projection is invalid");
			workspaceResultConflicts.set(claim.sessionId, {
				conflict: projectWorkspaceResultConflict(paths, stagedResultRef, conflict.totalCount),
				placement: current,
				claim: { ...claim }
			});
			sessionChanges.emit({
				agentId: current.agentId,
				sessionKey: current.sessionKey
			});
		},
		async adoptActive(input) {
			const sessionId = required(input.sessionId, "session id");
			const environmentId = required(input.environmentId, "environment id");
			const ownerEpoch = normalizeEpoch(input.ownerEpoch, "active owner epoch");
			const current = await store.getAsync(sessionId);
			if (current?.state !== "active" || current.environmentId !== environmentId || current.activeOwnerEpoch !== ownerEpoch || input.expectedGeneration !== void 0 && current.generation !== input.expectedGeneration) throw new Error(`Cannot adopt stale worker placement for session ${sessionId}`);
			return current;
		},
		/** @deprecated Await listForReconcileAsync; retained through the next Plugin SDK major. */
		listForReconcile(sessionKey) {
			warnPluginSdkDeprecation({
				family: "worker-placement-sync-readers",
				method: "listForReconcile",
				replacement: "listForReconcileAsync",
				compatibility: "Synchronous reads use committed in-process receipts; cold or inventory reads require the async replacement."
			});
			throw new Error("Await listForReconcileAsync; synchronous placement inventory reads are no longer supported.");
		},
		/** @deprecated Await listAsync; retained through the next Plugin SDK major. */
		list() {
			warnPluginSdkDeprecation({
				family: "worker-placement-sync-readers",
				method: "list",
				replacement: "listAsync",
				compatibility: "Synchronous reads use committed in-process receipts; cold or inventory reads require the async replacement."
			});
			throw new Error("Await listAsync; synchronous placement inventory reads are no longer supported.");
		},
		async readChangeSnapshot(profileIds) {
			const reply = await executeExistingOpenClawStateRead({ path }, {
				type: "workerPlacements.changeSnapshot",
				profileIds: profileIds ? [...profileIds] : void 0
			}, { current: true });
			if (!reply || !reply.ok || reply.type !== "workerPlacements.changeSnapshot") throw new Error("Worker placement change snapshot is unavailable");
			return reply.placements;
		}
	};
	attachWorkerTurnExecutionIdentityStore(store, path);
	return store;
}
//#endregion
export { createWorkerSessionPlacementStore as t };
