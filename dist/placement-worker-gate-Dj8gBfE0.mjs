import { u as getWorkerTurnExecutionIdentityCapability } from "./placement-turn-claim-events-C-F0mgX3.mjs";
import { m as projectWorkerSessionTurnClaim, p as projectPlacementTurnClaim, y as serializeWorkerSessionTurnClaim } from "./placement-record-CBaaHws5.mjs";
import { L as isCurrentWorkerWorkspacePendingResultOwner } from "./placement-row-codec-DhdW6tSs.mjs";
import { r as findPendingWorkerWorkspaceResult } from "./placement-workspace-result--lykq2r1.mjs";
//#region src/gateway/worker-environments/placement-worker-gate.ts
function claimForOwnerRevocation(record, binding) {
	if (record?.state !== "active" && record?.state !== "draining" || record.environmentId !== binding.environmentId || record.activeOwnerEpoch !== binding.ownerEpoch) return;
	return projectPlacementTurnClaim(record);
}
function createWorkerSessionPlacementGate(store, options = {}) {
	const recoveryOnlyClaims = new Set((options.recoveryPlacements ?? []).flatMap((record) => {
		const claim = projectWorkerSessionTurnClaim(record);
		return claim ? [serializeWorkerSessionTurnClaim(claim)] : [];
	}));
	const validateWorkerTurn = (claim) => !recoveryOnlyClaims.has(serializeWorkerSessionTurnClaim(claim)) && (getWorkerTurnExecutionIdentityCapability(store, claim) !== void 0 || store.validateTurnClaim(claim));
	const fenceWorkerTurnForRecovery = (claim) => {
		if (claim.owner.kind === "worker") recoveryOnlyClaims.add(serializeWorkerSessionTurnClaim(claim));
	};
	return {
		fenceWorkerTurnForRecovery,
		async prepareWorkerRuntimeRefresh(binding) {
			let prepared = await store.prepareRuntimeRefresh(binding.sessionId);
			const assertCurrent = () => prepared.assertCurrent();
			const release = () => prepared.release();
			const readRefreshOwner = () => {
				const { placement, pendingResult } = prepared;
				const reclaimResult = placement?.state === "draining" && pendingResult && pendingResult.claimId === pendingResult.runId && pendingResult.claimId.startsWith("reclaim-") && (pendingResult.gatewayInstanceId !== store.workspaceResultInstanceId() || pendingResult.recoveryRequestedAtMs !== null) && isCurrentWorkerWorkspacePendingResultOwner(placement, pendingResult) ? pendingResult : void 0;
				if (placement?.state !== "active" && !reclaimResult || !placement || placement.environmentId !== binding.environmentId || placement.activeOwnerEpoch !== binding.ownerEpoch || prepared.move) throw new Error("Worker runtime refresh lost its placement recovery owner");
				const claim = projectWorkerSessionTurnClaim(placement);
				if (!reclaimResult && placement.turnClaim && (!claim || !recoveryOnlyClaims.has(serializeWorkerSessionTurnClaim(claim)))) throw new Error("Worker runtime refresh is waiting for the current turn to finish");
				assertCurrent();
				return {
					placement,
					pendingResult,
					reclaimResult,
					claim
				};
			};
			try {
				let owner = readRefreshOwner();
				if (!owner.reclaimResult && owner.claim && owner.pendingResult?.gatewayInstanceId === store.workspaceResultInstanceId() && owner.pendingResult.recoveryRequestedAtMs === null && isCurrentWorkerWorkspacePendingResultOwner(owner.placement, owner.pendingResult)) {
					prepared.release();
					await store.handoffRuntimeRefreshResult({
						claim: owner.claim,
						expectedGeneration: owner.placement.generation,
						gatewayInstanceId: store.workspaceResultInstanceId()
					});
					prepared = await store.prepareRuntimeRefresh(binding.sessionId);
					owner = readRefreshOwner();
				}
				if (owner.reclaimResult && owner.claim) fenceWorkerTurnForRecovery(owner.claim);
				return {
					generation: owner.placement.generation,
					...owner.reclaimResult ? { reclaimResult: owner.reclaimResult } : {},
					assertCurrent,
					release
				};
			} catch (error) {
				release();
				throw error;
			}
		},
		readWorkerTurnClaim: (binding) => store.readWorkerTurnClaim(binding),
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
		async updateAckCursors(input) {
			const assertCurrent = () => {
				if (recoveryOnlyClaims.has(serializeWorkerSessionTurnClaim(input.claim))) throw new Error(`Cannot ACK stale worker turn for session ${input.claim.sessionId}`);
				input.assertCurrent?.();
			};
			await store.updateAckCursors({
				claim: input.claim,
				...input.transcriptSeq === void 0 ? {} : { transcript: input.transcriptSeq },
				...input.liveSeq === void 0 ? {} : { liveEvent: input.liveSeq }
			}, assertCurrent);
		},
		async prepareWorkspaceResultOwnerRevocation(binding, error, assertCurrent) {
			const claim = claimForOwnerRevocation(await store.getAsync(binding.sessionId), binding);
			if (!claim) return;
			const pending = await findPendingWorkerWorkspaceResult(store, claim);
			assertCurrent?.();
			if (!pending || pending.gatewayInstanceId !== store.workspaceResultInstanceId()) return;
			if (claim.owner.kind === "local" && pending.stagedResultRef === null && pending.workspaceAcceptedAtMs === null) {
				await store.failWorkspaceResultAndReleaseTurn(pending, error, assertCurrent);
				return;
			}
			await store.handoffWorkspaceResultRecovery(claim, assertCurrent);
		},
		registerTurnClaimClosedHandler: (handler) => store.registerTurnClaimClosedHandler(handler)
	};
}
//#endregion
export { createWorkerSessionPlacementGate };
