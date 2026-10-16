import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { r as resolveGlobalMap } from "./global-singleton-0m-JziJW.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { a as isSqliteLockError } from "./sqlite-error-diagnostics-DCvjvszg.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { v as registerOpenClawStateDatabaseLifecycleListener } from "./openclaw-state-db-cache-BKCnj4of.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { r as isWorkspaceJournalReceipt } from "./openclaw-state-read-worker-Dz7y6uEu.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { l as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-D1jWDzK3.mjs";
import { u as reserveSqliteWorkerInputPreparation } from "./sqlite-worker-store-CsIRv3py.mjs";
import { n as sessionChanges } from "./session-row-changes-BcJIdta8.mjs";
import { t as withOpenClawStateLease } from "./openclaw-state-lease-CdKflcqg.mjs";
import { n as assertSessionEntryCurrentAdmission } from "./session-entry-current-admission-Cvdu1qxp.mjs";
import { s as getGatewayRestartDrainSignal } from "./gateway-work-admission-rc4ZgKq_.mjs";
import { n as matchesWorkerPlacementTarget } from "./placement-target-B4CmGwso.mjs";
import { c as normalizeIdentity, h as required, i as isCurrentPlacementTurnClaim, s as normalizeEpoch, u as normalizeWorkerPlacementExecutionMode } from "./placement-record-BfcBeilz.mjs";
import { _ as readPlacementWorkspaceResultAuthority, a as query, b as stagePlacementWorkspaceJournalWorkerPublication, d as preparePlacementTurnClaimAuthority, f as preparePlacementWorkspaceResultAuthority, i as getRequired, l as isPlacementTurnToolAuthorized, n as find, p as publishPlacementTurnClaimCleared, r as fromRow, s as updateTransition, u as observePlacementAuthority, v as stagePlacementTurnClaimWorkerPublication, x as stagePlacementWorkspaceResultWorkerPublication, y as stagePlacementTurnToolWorkerPublication } from "./placement-row-codec-DzKFQEtn.mjs";
import { t as createPlacementWorkerMutation } from "./placement-worker-mutation-BBWzgFFJ.mjs";
import { n as reserveWorkerEnvironmentNativePublication } from "./store-native-publication-BFCYOamu.mjs";
import { n as AcceptedWorkspacePublicationIndeterminateError } from "./workspace-reconcile-DEtkg-5s.mjs";
import { c as listPendingWorkerWorkspaceResultsInDatabase, l as readWorkerWorkspaceReconciliationFacts } from "./placement-workspace-result-Dw6JZ899.mjs";
import { t as createPlacementMoveOps } from "./placement-move-intent-DuwDH85-.mjs";
import { t as boundedWorkerError } from "./worker-error-DmRBUSui.mjs";
import { f as prepareWorkerTurnClaimClosed, h as registerWorkerTurnClaimClosedHandler, n as attachWorkerTurnExecutionIdentityStore } from "./placement-turn-claim-events-BCSz3C5d.mjs";
import { i as workspaceReservationQuery, n as SessionWorkspaceReservationBusyError, t as PERSONAL_SCOPE } from "./placement-workspace-reservation.kernel-DAyC6kqY.mjs";
import { n as createPlacementTurnClaimOps, t as ActiveTurnClaimError } from "./placement-turn-claims-DXE2X7tY.mjs";
import { n as consumePreparedEnvironment } from "./prepared-environment-store-CJjZID0w.mjs";
import { a as projectWorkspaceResultConflict } from "./workspace-conflicts-CQVfTI04.mjs";
import { serialize } from "node:v8";
import { randomUUID } from "node:crypto";
import { Type } from "typebox";
import { Value } from "typebox/value";
//#region src/gateway/worker-environments/placement-dispatch-store.ts
function readDispatchTurnClaim(value) {
	if (value === null) return null;
	if (!isRecord(value) || value.owner !== "local" || typeof value.claimId !== "string" || !value.claimId || typeof value.runId !== "string" || !value.runId || typeof value.generation !== "number" || !Number.isSafeInteger(value.generation) || value.generation < 0 || value.ownerEpoch !== null) throw new Error("Worker placement dispatch commit has an invalid predecessor claim");
	return {
		owner: "local",
		claimId: value.claimId,
		runId: value.runId,
		generation: value.generation,
		ownerEpoch: null
	};
}
function readDispatchReceipt(value, identity, executionMode) {
	if (!isRecord(value) || value.state !== "requested" || value.sessionId !== identity.sessionId || value.agentId !== identity.agentId || value.sessionKey !== identity.sessionKey || value.executionMode !== executionMode) throw new Error("Worker placement dispatch receipt has a different identity");
	const metadata = {
		environmentId: null,
		activeOwnerEpoch: null,
		workspaceBaseManifestRef: null,
		remoteWorkspaceDir: null,
		workerBundleHash: null,
		lastTranscriptAckCursor: null,
		lastLiveEventAckCursor: null,
		recoveryError: null,
		terminalReason: null,
		terminalAtMs: null
	};
	if (Object.keys(metadata).some((key) => value[key] !== null)) throw new Error("Worker placement dispatch receipt retains worker metadata");
	const number = (key) => {
		const field = value[key];
		if (typeof field !== "number" || !Number.isSafeInteger(field) || field < 0) throw new Error(`Worker placement dispatch receipt has an invalid ${key}`);
		return field;
	};
	return {
		...identity,
		...metadata,
		state: "requested",
		executionMode,
		generation: number("generation"),
		createdAtMs: number("createdAtMs"),
		updatedAtMs: number("updatedAtMs"),
		stateChangedAtMs: number("stateChangedAtMs"),
		turnClaim: readDispatchTurnClaim(value.turnClaim)
	};
}
async function startWorkerPlacementDispatch(path, placement, nowMs, assertCurrent) {
	const context = captureOpenClawStateWorkerContext({ path });
	const captured = structuredClone(placement);
	const identity = normalizeIdentity(captured);
	const executionMode = normalizeWorkerPlacementExecutionMode(captured.executionMode);
	return createPlacementWorkerMutation({
		context,
		label: "Worker placement dispatch",
		nativeLocation: context.admission.databasePath,
		orderedAdmission: true,
		assertCurrent,
		stageCommit(facts) {
			return stagePlacementTurnClaimWorkerPublication(context.admission.identity, {
				...identity,
				state: "requested",
				executionMode,
				environmentId: null,
				activeOwnerEpoch: null,
				turnClaim: readDispatchTurnClaim(facts)
			});
		},
		readReceipt(facts, publication) {
			publication?.commit();
			return readDispatchReceipt(facts, identity, executionMode);
		}
	}).run((scope) => scope.execute({
		type: "workerPlacements.startDispatch",
		input: {
			placement: captured,
			nowMs
		}
	}));
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
			let published = false;
			const mutation = createPlacementWorkerMutation({
				context,
				label: "Placement claim",
				nativeLocation: runtime.path,
				assertCurrent,
				admissionFacts(request) {
					if (request.stage !== "transaction" && request.stage !== "commit") return request.facts;
					const admitted = assertSessionEntryCurrentAdmission(request, capturedEntryCheck);
					if (current) {
						if (!isReceipt(admitted.facts)) throw new Error("Placement admission has no current placement facts");
						current.assertPlacementCurrent(admitted.facts.placement, admitted.facts.placementMove);
					}
					return admitted.facts;
				},
				readReceipt: (facts) => isReceipt(facts) ? facts : void 0,
				stageCommit(facts) {
					if (!isReceipt(facts)) throw new Error("Placement claim commit has no receipt");
					prepared = facts;
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
					const publication = facts.placement && !workspaceOnly ? stagePlacementTurnClaimWorkerPublication(context.admission.identity, facts.placement, resultFacts) : stagePlacementWorkspaceResultWorkerPublication(context.admission.identity, sessionId, resultFacts);
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
					if (published) return;
					published = true;
					if (receipt.placement) {
						close?.();
						if (receipt.environmentActivation) sessionChanges.emit({
							all: true,
							scope: "worker-environments"
						});
						if (command.type !== "placementTurns.transition" && command.type !== "placementTurns.startReconcile" && command.type !== "placementTurns.fail" && (command.type !== "placementTurns.startDrain" || command.input.workspaceBaseManifestRef !== void 0)) sessionChanges.emit({
							agentId: receipt.placement.agentId,
							sessionKey: receipt.placement.sessionKey
						});
					}
				},
				async recoverUnknown(error, publication) {
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
			}
		}
	}
	return {
		async transition(input, assertCurrent) {
			return requirePlacement(await execute({
				type: "placementTurns.transition",
				input: {
					...input,
					nowMs: runtime.now?.()
				}
			}, assertCurrent), "Placement transition");
		},
		async startDrain(input, assertCurrent) {
			return requirePlacement(await execute({
				type: "placementTurns.startDrain",
				input: {
					...input,
					nowMs: runtime.now?.()
				}
			}, assertCurrent), "Placement drain");
		},
		async startReconcile(input, assertCurrent) {
			return requirePlacement(await execute({
				type: "placementTurns.startReconcile",
				input: {
					...input,
					nowMs: runtime.now?.()
				}
			}, assertCurrent), "Placement reconciliation");
		},
		async fail(input, assertCurrent) {
			return requirePlacement(await execute({
				type: "placementTurns.fail",
				input: {
					...input,
					nowMs: runtime.now?.()
				}
			}, assertCurrent), "Placement failure");
		},
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
		async startWorkspaceResultDrain(claim, assertCurrent) {
			return requirePlacement(await execute({
				type: "placementTurns.drainResult",
				input: {
					claim,
					nowMs: runtime.now?.()
				}
			}, assertCurrent), "Workspace result drain");
		},
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
		async handoffRuntimeRefreshResult({ claim, expectedGeneration, gatewayInstanceId }, assertCurrent) {
			return requirePlacement(await execute({
				type: "placementTurns.handoffRuntimeRefreshResult",
				input: {
					claim,
					expectedGeneration,
					gatewayInstanceId,
					nowMs: runtime.now?.() ?? Date.now()
				}
			}, assertCurrent), "Worker runtime refresh handoff");
		},
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
		async releaseTurn(claim, assertCurrent) {
			return requirePlacement(await execute({
				type: "placementTurns.release",
				input: {
					claim,
					nowMs: runtime.now?.()
				}
			}, assertCurrent), "Placement turn release");
		},
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
		let published = false;
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
					for (const owner of receipt.owners) publications.push(stagePlacementWorkspaceJournalWorkerPublication(context.admission.identity, owner.sessionId));
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
				if (!published) {
					published = true;
					sessionChanges.emitBatch(receipt.changes);
				}
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
function assertReconciled(db, identity, workspace) {
	const placement = find(db, identity.sessionId);
	if (placement && (placement.agentId !== identity.agentId || placement.sessionKey !== identity.sessionKey)) throw new Error("The session workspace placement identity changed.");
	if (placement && (placement.state !== "local" && placement.state !== "reclaimed" && !(workspace === "repository" && (placement.state === "active" || placement.state === "failed")) || placement.turnClaim)) throw new SessionWorkspaceReservationBusyError(workspace === "repository" ? "The repository checkpoint is busy; finish the current turn or worker operation before publishing." : "My GitHub publication requires an idle local workspace; finish the turn and reclaim remote work first.");
	const pending = executeSqliteQueryTakeFirstSync(db, workspaceReservationQuery(db).selectFrom("worker_workspace_pending_results").select("session_id").where("session_id", "=", identity.sessionId));
	const reconciliation = executeSqliteQueryTakeFirstSync(db, workspaceReservationQuery(db).selectFrom("worker_workspace_reconciliations").select("session_id").where("session_id", "=", identity.sessionId));
	if (pending || reconciliation) throw new SessionWorkspaceReservationBusyError("The session workspace is still reconciling; wait for reclaim to finish before publishing with My GitHub.");
}
function createPlacementWorkspaceReservationOps(runtime) {
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
			assertReconciled(runtime.read(), identity, workspace);
			const initial = find(runtime.read(), identity.sessionId);
			const assertCurrent = () => {
				assertPublisherExclusion();
				assertOwned();
				assertReconciled(runtime.read(), identity, workspace);
				const current = find(runtime.read(), identity.sessionId);
				if (!matchesWorkerPlacementTarget(current, initial)) throw new Error("The session workspace placement changed during publication.");
			};
			return await run(assertCurrent);
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
			context.admission.assertCurrent();
			return listPendingWorkerWorkspaceResultsInDatabase(runtime.read(), sessionId);
		},
		/** @deprecated Await getWorkspaceResultReconcilingSessionIdsAsync. */
		getWorkspaceResultReconcilingSessionIds(sessionIds) {
			context.admission.assertCurrent();
			const ids = [...new Set(sessionIds.map((sessionId) => required(sessionId, "session id")))];
			return readWorkerWorkspaceReconciliationFacts(runtime.read(), ids).reconcilingSessionIds;
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
const RETIRABLE_PLACEMENT_STATES = [
	"local",
	"requested",
	"reclaimed",
	"failed"
];
function exactConflictPath(value) {
	if (typeof value !== "string" || value.length === 0) throw new Error("Worker placement conflict path is required");
	return value;
}
function createWorkerSessionPlacementStore(options = {}) {
	const path = (options.database ?? openOpenClawStateDatabase()).path;
	const now = options.now ?? Date.now;
	const runtime = {
		path,
		instanceId: randomUUID(),
		now,
		read: () => openOpenClawStateDatabase({ path }).db,
		write: (operation) => runOpenClawStateWriteTransaction(({ db }) => operation(db), { path })
	};
	const { read, write } = runtime;
	const { clearLocalTurnClaimsAfterRestart, waitForTurnClaimRelease, validateTurnClaim } = createPlacementTurnClaimOps(runtime);
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
		...createPlacementWorkspaceReservationOps(runtime),
		clearLocalTurnClaimsAfterRestart,
		waitForTurnClaimRelease,
		validateTurnClaim,
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
		...createPlacementMoveOps(runtime),
		...createPlacementWorkspaceJournalWorkerOps({
			path,
			now: options.now
		}),
		...createPlacementWorkspaceResultReader(runtime, (ids) => store.readProjection(ids, { current: true })),
		registerTurnClaimClosedHandler(handler) {
			return registerWorkerTurnClaimClosedHandler(path, handler);
		},
		get(sessionId) {
			return withWorkspaceResultConflict(find(read(), required(sessionId, "session id")));
		},
		prepareTurnClaimAuthority(claim) {
			return preparePlacementTurnClaimAuthority(path, claim, (sessionIds) => store.readProjection(sessionIds, { current: true }));
		},
		async prepareRuntimeRefresh(sessionIdInput) {
			const sessionId = required(sessionIdInput, "session id");
			const observation = observePlacementAuthority(path, sessionId);
			try {
				const result = await executeExistingOpenClawStateRead({ path }, {
					type: "workers.placementProjection",
					sessionIds: [sessionId],
					conflictBindings: []
				}, { current: true });
				if (!result?.ok || result.type !== "workers.placementProjection") throw new Error("Worker placement projection source is unavailable");
				observation.assertCurrent();
				return {
					placement: result.result.projection.placements.get(sessionId),
					move: result.result.projection.moves.get(sessionId),
					pendingResult: result.result.projection.pendingResults.get(sessionId),
					...observation
				};
			} catch (error) {
				observation.release();
				throw error;
			}
		},
		async readProjection(sessionIds, readOptions = {}) {
			const requestedIds = new Map(sessionIds.map((id) => [id, required(id, "session id")]));
			const ids = [...new Set(requestedIds.values())];
			const conflicts = new Map(ids.flatMap((id) => {
				const conflict = workspaceResultConflicts.get(id);
				return conflict ? [[id, conflict]] : [];
			}));
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
			const { projection, conflictSessionIds } = result.result;
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
		async readRecoveryCandidates() {
			const result = await executeExistingOpenClawStateRead({ path }, { type: "workers.placementRecoveryCandidates" }, { current: true });
			if (!result || !result.ok || result.type !== "workers.placementRecoveryCandidates") throw new Error("Worker placement recovery candidates source is unavailable");
			return result.candidates;
		},
		getMany(sessionIds) {
			const normalizedIds = [...new Set(sessionIds.map((sessionId) => required(sessionId, "session id")))];
			const records = /* @__PURE__ */ new Map();
			const db = read();
			for (let offset = 0; offset < normalizedIds.length; offset += 250) {
				const chunk = normalizedIds.slice(offset, offset + 250);
				for (const row of executeSqliteQuerySync(db, query(db).selectFrom("worker_session_placements").selectAll().where("session_id", "in", chunk)).rows) {
					const record = fromRow(row);
					records.set(record.sessionId, withWorkspaceResultConflict(record));
				}
			}
			return records;
		},
		retireSessionPlacement(input) {
			const sessionId = required(input.sessionId, "session id");
			if (!RETIRABLE_PLACEMENT_STATES.includes(input.expectedState)) throw new Error(`Cannot retire worker session placement from ${input.expectedState}`);
			write((db) => {
				if (executeSqliteQuerySync(db, query(db).deleteFrom("worker_session_placements").where("session_id", "=", sessionId).where("state", "=", input.expectedState).where("transition_generation", "=", input.expectedGeneration).where("turn_claim_owner", "is", null).where("turn_claim_id", "is", null).where("turn_claim_run_id", "is", null).where("turn_claim_generation", "is", null).where("turn_claim_owner_epoch", "is", null)).numAffectedRows !== 1n) throw new Error(`Worker session placement ${sessionId} changed before retirement`);
				publishPlacementTurnClaimCleared(db, sessionId);
			});
			workspaceResultConflicts.delete(sessionId);
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
		bindPreparedEnvironment(input) {
			return write((db) => {
				const nowMs = now();
				const current = consumePreparedEnvironment(db, input, nowMs);
				return current ? updateTransition(db, current, "provisioning", { environmentId: input.environmentId }, nowMs) : void 0;
			});
		},
		startDispatch(input, dispatchOptions = {}) {
			return startWorkerPlacementDispatch(path, input, now(), dispatchOptions.assertCurrent);
		},
		adoptActive(input) {
			const sessionId = required(input.sessionId, "session id");
			const environmentId = required(input.environmentId, "environment id");
			const ownerEpoch = normalizeEpoch(input.ownerEpoch, "active owner epoch");
			const current = getRequired(read(), sessionId);
			if (current.state !== "active" || current.environmentId !== environmentId || current.activeOwnerEpoch !== ownerEpoch || input.expectedGeneration !== void 0 && current.generation !== input.expectedGeneration) throw new Error(`Cannot adopt stale worker placement for session ${sessionId}`);
			return current;
		},
		listForReconcile(sessionKey) {
			const db = read();
			let select = query(db).selectFrom("worker_session_placements").selectAll().where("state", "not in", ["local", "reclaimed"]);
			if (sessionKey !== void 0) select = select.where("session_key", "=", sessionKey);
			return executeSqliteQuerySync(db, select.orderBy("updated_at_ms").orderBy("session_id")).rows.map((row) => withWorkspaceResultConflict(fromRow(row)));
		},
		list() {
			const db = read();
			return executeSqliteQuerySync(db, query(db).selectFrom("worker_session_placements").selectAll().orderBy("session_id")).rows.map((row) => withWorkspaceResultConflict(fromRow(row)));
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
