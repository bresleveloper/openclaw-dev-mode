import { m as projectWorkerSessionTurnClaim, p as placementTurnOwner, y as serializeWorkerSessionTurnClaim } from "./placement-record-CB6gcJKw.mjs";
import { a as getWorkerTurnExecutionIdentityCapability } from "./placement-turn-claim-events-D2oaSWT4.mjs";
//#region src/gateway/worker-environments/placement-worker-gate.ts
function claimForBinding(record, binding) {
	const claim = record ? projectWorkerSessionTurnClaim(record) : void 0;
	return claim?.sessionId === binding.sessionId && claim.owner.environmentId === binding.environmentId && claim.owner.ownerEpoch === binding.ownerEpoch ? claim : void 0;
}
function claimForOwnerRevocation(record, binding) {
	if (record?.state !== "active" && record?.state !== "draining" || record.environmentId !== binding.environmentId || record.activeOwnerEpoch !== binding.ownerEpoch || !record.turnClaim) return;
	return {
		sessionId: record.sessionId,
		claimId: record.turnClaim.claimId,
		runId: record.turnClaim.runId,
		placementGeneration: record.turnClaim.generation,
		owner: placementTurnOwner(record)
	};
}
function createWorkerSessionPlacementGate(store, options = {}) {
	const recoveryOnlyClaims = new Set(options.rejectExistingWorkerClaims ? store.list().flatMap((record) => {
		const claim = projectWorkerSessionTurnClaim(record);
		return claim ? [serializeWorkerSessionTurnClaim(claim)] : [];
	}) : []);
	const isOperational = (claim) => !recoveryOnlyClaims.has(serializeWorkerSessionTurnClaim(claim)) && store.validateTurnClaim(claim);
	const readWorkerTurnClaim = (binding) => {
		const claim = claimForBinding(store.get(binding.sessionId), binding);
		return claim && store.validateTurnClaim(claim) ? claim : void 0;
	};
	const validateWorkerTurn = (claim) => isOperational(claim);
	return {
		assertWorkerRuntimeRefresh(binding) {
			const placement = store.get(binding.sessionId);
			if (placement?.state !== "active" || placement.environmentId !== binding.environmentId || placement.activeOwnerEpoch !== binding.ownerEpoch || store.getPlacementMove(binding.sessionId)) throw new Error("Worker runtime refresh lost its active placement owner");
			const claim = projectWorkerSessionTurnClaim(placement);
			if (placement.turnClaim && (!claim || !recoveryOnlyClaims.has(serializeWorkerSessionTurnClaim(claim)))) throw new Error("Worker runtime refresh is waiting for the current turn to finish");
			return placement.generation;
		},
		readWorkerTurnClaim,
		getExecutionIdentityCapability: (claim) => getWorkerTurnExecutionIdentityCapability(store, claim),
		validateWorkerTurn,
		readWorkerTurnLiveAckCursor(claim) {
			if (!validateWorkerTurn(claim)) throw new Error(`Cannot read ACK cursor for stale worker turn ${claim.sessionId}`);
			const placement = store.get(claim.sessionId);
			if (!placement) throw new Error(`Worker placement disappeared for session ${claim.sessionId}`);
			return placement.lastLiveEventAckCursor ?? 0;
		},
		isWorkerTurnToolAuthorized(claim, toolName) {
			return validateWorkerTurn(claim) && store.isWorkerTurnToolAuthorized(claim, toolName);
		},
		updateAckCursors(input) {
			if (!validateWorkerTurn(input.claim)) throw new Error(`Cannot ACK stale worker turn for session ${input.claim.sessionId}`);
			store.updateAckCursors({
				claim: input.claim,
				...input.transcriptSeq === void 0 ? {} : { transcript: input.transcriptSeq },
				...input.liveSeq === void 0 ? {} : { liveEvent: input.liveSeq }
			});
		},
		prepareWorkspaceResultOwnerRevocation(binding, error) {
			const claim = claimForOwnerRevocation(store.get(binding.sessionId), binding);
			if (!claim) return;
			const pending = store.listPendingWorkspaceResults(claim.sessionId).find((candidate) => candidate.sessionId === claim.sessionId && candidate.claimId === claim.claimId && candidate.runId === claim.runId);
			if (!pending) return;
			if (pending.gatewayInstanceId !== store.workspaceResultInstanceId()) return;
			if (claim.owner.kind === "local" && pending.stagedResultRef === null && pending.workspaceAcceptedAtMs === null) {
				store.failWorkspaceResultAndReleaseTurn(pending, error);
				return;
			}
			store.handoffWorkspaceResultRecovery(claim);
		},
		registerTurnClaimClosedHandler: (handler) => store.registerTurnClaimClosedHandler(handler)
	};
}
//#endregion
export { createWorkerSessionPlacementGate };
