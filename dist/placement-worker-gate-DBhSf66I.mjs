import { f as placementTurnOwner, p as projectWorkerSessionTurnClaim, v as serializeWorkerSessionTurnClaim } from "./placement-record-BfcBeilz.mjs";
import { S as isCurrentWorkerWorkspacePendingResultOwner } from "./placement-row-codec-DzKFQEtn.mjs";
import { r as findPendingWorkerWorkspaceResult } from "./placement-workspace-result-Dw6JZ899.mjs";
import { u as getWorkerTurnExecutionIdentityCapability } from "./placement-turn-claim-events-BCSz3C5d.mjs";
//#region src/gateway/worker-environments/placement-worker-gate.ts
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
	const validateWorkerTurn = (claim) => !recoveryOnlyClaims.has(serializeWorkerSessionTurnClaim(claim)) && store.validateTurnClaim(claim);
	const fenceWorkerTurnForRecovery = (claim) => {
		if (claim.owner.kind === "worker") recoveryOnlyClaims.add(serializeWorkerSessionTurnClaim(claim));
	};
	return {
		fenceWorkerTurnForRecovery,
		async prepareWorkerRuntimeRefresh(binding) {
			let prepared = await store.prepareRuntimeRefresh(binding.sessionId);
			let preparedReleased = false;
			let claimAuthority;
			const assertClaimCurrent = () => {
				if (claimAuthority && !claimAuthority.isCurrent()) throw new Error("Worker runtime refresh lost its turn recovery owner");
			};
			const assertCurrent = () => {
				assertClaimCurrent();
				prepared.assertCurrent();
			};
			const release = () => {
				if (!preparedReleased) {
					preparedReleased = true;
					prepared.release();
				}
				claimAuthority?.release();
			};
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
					claimAuthority = await store.prepareTurnClaimAuthority(owner.claim);
					assertCurrent();
					prepared.release();
					preparedReleased = true;
					await store.handoffRuntimeRefreshResult({
						claim: owner.claim,
						expectedGeneration: owner.placement.generation,
						gatewayInstanceId: store.workspaceResultInstanceId()
					}, assertClaimCurrent);
					prepared = await store.prepareRuntimeRefresh(binding.sessionId);
					preparedReleased = false;
					const refreshed = readRefreshOwner();
					if (refreshed.placement.generation !== owner.placement.generation || !refreshed.pendingResult || refreshed.pendingResult.gatewayInstanceId !== store.workspaceResultInstanceId() || refreshed.pendingResult.recoveryRequestedAtMs === null || !isCurrentWorkerWorkspacePendingResultOwner(refreshed.placement, refreshed.pendingResult)) throw new Error("Worker runtime refresh lost its result recovery handoff");
					owner = refreshed;
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
		readWorkerTurnClaim(binding) {
			const record = store.get(binding.sessionId);
			const claim = record ? projectWorkerSessionTurnClaim(record) : void 0;
			return claim?.sessionId === binding.sessionId && claim.owner.environmentId === binding.environmentId && claim.owner.ownerEpoch === binding.ownerEpoch && store.validateTurnClaim(claim) ? claim : void 0;
		},
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
			assertCurrent();
		},
		async prepareWorkspaceResultOwnerRevocation(binding, error, assertCurrent) {
			const claim = claimForOwnerRevocation(store.get(binding.sessionId), binding);
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
