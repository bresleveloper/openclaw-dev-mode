import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { s as resolveNodeWorkerExecutionIssue } from "./node-runner-inventory-DTVspi93.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./config-Ciq2mxdN.mjs";
import { n as isFailedWorkerPlacementEnvironmentGone } from "./session-placement-lifecycle-DAKgxrlj.mjs";
import { p as placementTurnOwner } from "./placement-record-CB6gcJKw.mjs";
import { t as boundedWorkerError } from "./worker-error-Bd42UcqN.mjs";
import { d as resolveRequiredNodeCommandAuthority, l as resolveNodeCommandAllowlist, o as isNodeCommandAllowed } from "./node-command-policy-CnGfXM76.mjs";
import { n as readNodeSessionWithheldCommands } from "./node-registry-zajLqj5_.mjs";
import { i as deviceUnavailableText, o as resolveDeviceWorkerAvailability } from "./device-provider-meDSQEul.mjs";
import { i as supportsCurrentWorkerLaunch, t as STALE_WORKER_BUILD_REASON } from "./admission-BzZXJ5YD.mjs";
import { t as matchesWorkerPlacementTarget } from "./placement-reclaim-contract-BNCBrypU.mjs";
//#region src/gateway/worker-environments/device-placement-eligibility.ts
/** Revalidates the admitted connection and execution mode immediately before a placement write. */
function createDevicePlacementAuthority(getTransport) {
	return (node, requirement, executionMode) => {
		if (getTransport()?.isCurrent(node, requirement.consumesWorkerSlot, requirement.requiredNodeCommands, executionMode === "worker-turn") !== true) return false;
		const declaredCommands = [...node.commands];
		const allowlist = resolveNodeCommandAllowlist(getRuntimeConfig(), {
			commands: declaredCommands,
			approvedCommands: declaredCommands
		});
		return requirement.requiredNodeCommands.every((command) => isNodeCommandAllowed({
			command,
			declaredCommands,
			allowlist
		}).ok);
	};
}
/** Raised only before a dispatch begins workspace preparation. */
var DevicePlacementUnavailableError = class extends Error {
	constructor(deviceId, message) {
		super(message);
		this.deviceId = deviceId;
	}
};
async function resolveDevicePlacementEligibility(params) {
	const { deviceId, requirement } = params;
	if (!requirement) return {
		ok: false,
		error: `runtime ${params.runtimeId ?? "selection"} does not support paired-device placement; select a compatible runtime or cloud worker provider`
	};
	const availability = await resolveDeviceWorkerAvailability(params.environmentService, deviceId);
	if (!availability.available || !availability.node) return {
		ok: false,
		error: deviceUnavailableText(deviceId, availability)
	};
	const node = availability.node;
	const issue = params.executionMode === "worker-turn" ? resolveNodeWorkerExecutionIssue(node.workerHost) : void 0;
	if (issue) return {
		ok: false,
		error: deviceUnavailableText(deviceId, {
			available: false,
			issue
		}),
		issue
	};
	if (node.nodeId !== deviceId || params.currentNode && (params.currentNode.nodeId !== node.nodeId || params.currentNode.connId && params.currentNode.connId !== node.connId || params.currentNode.pairingGeneration && params.currentNode.pairingGeneration !== node.pairingGeneration)) return {
		ok: false,
		error: deviceUnavailableText(deviceId, {
			available: false,
			unavailableReason: "disconnected"
		})
	};
	const declaredCommands = [...node.commands];
	const allowlist = resolveNodeCommandAllowlist(params.config, {
		...params.currentNode?.platform ? { platform: params.currentNode.platform } : {},
		...params.currentNode?.deviceFamily ? { deviceFamily: params.currentNode.deviceFamily } : {},
		commands: declaredCommands,
		approvedCommands: declaredCommands
	});
	const requiredNodeCommand = resolveRequiredNodeCommandAuthority({
		requiredCommands: requirement.requiredNodeCommands,
		declaredCommands: params.currentNode?.declaredCommands ?? declaredCommands,
		effectiveCommands: params.currentNode?.commands ?? declaredCommands,
		withheldCommands: params.currentNode ? readNodeSessionWithheldCommands(params.currentNode) : [],
		allowlist
	});
	if (requiredNodeCommand && requiredNodeCommand.state !== "invocable") return {
		ok: false,
		error: `paired-device command ${requiredNodeCommand.command} is not enabled or approved for ${deviceId}; enable it in gateway.nodes.commands.allow and approve the command on the node`
	};
	if (requirement.consumesWorkerSlot && node.workerHost.capacity.available <= 0) return {
		ok: false,
		error: deviceUnavailableText(deviceId, {
			available: false,
			unavailableReason: "at-capacity"
		})
	};
	return {
		ok: true,
		availableSlots: node.workerHost.capacity.available,
		node
	};
}
//#endregion
//#region src/gateway/worker-environments/placement-dispatch-failure.ts
const RECOVERY_ERROR_LIMIT = 1024;
const log = createSubsystemLogger("gateway/worker-placement");
function canRetryDeviceDispatch(params) {
	const { error, attempted, current } = params;
	return error instanceof DevicePlacementUnavailableError && error.deviceId === params.deviceId && current?.state === "failed" && attempted?.state === "failed" && current.generation === attempted.generation && current.environmentId === attempted.environmentId && current.sessionId === params.sessionId && current.sessionKey === params.sessionKey && current.agentId === params.agentId && isFailedWorkerPlacementEnvironmentGone({
		environmentService: params.environments,
		placement: current
	});
}
function workerDisappearanceError(environment) {
	if (!environment) return /* @__PURE__ */ new Error("cloud worker disappeared: environment record missing");
	if (environment.state !== "destroyed" && environment.state !== "failed" && environment.state !== "orphaned") return;
	return /* @__PURE__ */ new Error(`cloud worker disappeared: ${environment.error ?? `environment state ${environment.state}`}`);
}
function isUnavailableEnvironment(environment) {
	return environment.state === "draining" || environment.state === "destroying" || environment.state === "destroyed" || environment.state === "failed" || environment.state === "orphaned";
}
function isExactAttachedEnvironment(environment, placement) {
	return Boolean(environment && environment.environmentId === placement.environmentId && environment.state === "attached" && environment.destroyRequestedAtMs === null && environment.ownerEpoch === placement.activeOwnerEpoch && environment.attachedSessionIds.length === 1 && environment.attachedSessionIds[0] === placement.sessionId);
}
function isCurrentActiveWorkerEnvironment(placement, environment) {
	return isExactAttachedEnvironment(environment, placement) && environment?.bootstrapReceipt?.bundleHash === placement.workerBundleHash && supportsCurrentWorkerLaunch(environment?.bootstrapReceipt);
}
function createPlacementFailureActions(deps) {
	const { environments, placements } = deps;
	const updateFailure = (placement, error) => placements.fail({
		sessionId: placement.sessionId,
		expectedGeneration: placement.generation,
		recoveryError: boundedWorkerError(error)
	});
	const cleanupEnvironment = async (params) => {
		const teardownErrors = [];
		params.authorize?.();
		try {
			await environments.stopTunnel(params.environmentId, params.ownerEpoch ?? void 0);
		} catch (error) {
			teardownErrors.push(`tunnel stop: ${boundedWorkerError(error)}`);
		}
		params.authorize?.();
		try {
			await environments.destroy(params.environmentId);
		} catch (error) {
			teardownErrors.push(`environment destroy: ${boundedWorkerError(error)}`);
		}
		return teardownErrors;
	};
	const teardownEnvironment = async (params) => {
		const environmentId = params.environmentId;
		const teardownErrors = environmentId ? await cleanupEnvironment({
			environmentId,
			ownerEpoch: params.ownerEpoch
		}) : [];
		const recoveryError = [boundedWorkerError(params.primaryError), ...teardownErrors].join("; ");
		return updateFailure(params.placement, new Error(truncateUtf16Safe(recoveryError, RECOVERY_ERROR_LIMIT)));
	};
	const cancelProvisioning = (placement, expected) => {
		if (expected?.state !== "provisioning" || !matchesWorkerPlacementTarget(placement, expected)) throw new Error("Provisioning cloud worker placement changed during reclaim");
		return updateFailure(expected, /* @__PURE__ */ new Error("Cloud worker provisioning canceled"));
	};
	const retryFailedTeardown = async (placement, authorize) => {
		if (!placement.environmentId) return;
		const environment = environments.get(placement.environmentId);
		if (!environment || environment.state === "destroyed" || environment.state === "failed" || environment.state === "orphaned") return;
		const teardownErrors = await cleanupEnvironment({
			environmentId: placement.environmentId,
			ownerEpoch: placement.activeOwnerEpoch,
			...authorize ? { authorize } : {}
		});
		if (teardownErrors.length > 0 && placement.recoveryError !== "Worker result abandoned by forced operator teardown") {
			const originalError = placement.terminalReason ?? placement.recoveryError;
			const recoveryError = boundedWorkerError([originalError, ...teardownErrors.filter((detail) => !originalError.includes(detail))].filter(Boolean).join("; "), RECOVERY_ERROR_LIMIT);
			if (recoveryError !== placement.recoveryError) placements.fail({
				sessionId: placement.sessionId,
				expectedGeneration: placement.generation,
				recoveryError
			});
		}
		return teardownErrors.length > 0 ? boundedWorkerError(teardownErrors.join("; ")) : void 0;
	};
	const startDrain = (placement) => {
		const draining = placements.startDrain({
			sessionId: placement.sessionId,
			environmentId: placement.environmentId,
			ownerEpoch: placement.activeOwnerEpoch,
			expectedGeneration: placement.generation
		});
		if (draining.state !== "draining") throw new Error("Worker placement drain did not produce a draining placement");
		return draining;
	};
	const startReconcile = (placement) => {
		const reconciling = placements.startReconcile({
			sessionId: placement.sessionId,
			environmentId: placement.environmentId,
			ownerEpoch: placement.activeOwnerEpoch,
			expectedGeneration: placement.generation
		});
		if (reconciling.state !== "reconciling") throw new Error("Worker placement reconcile did not produce a reconciling placement");
		return reconciling;
	};
	const finishReconcilingFailure = (placement, error, teardownErrors) => {
		const recoveryError = [boundedWorkerError(error), ...teardownErrors].join("; ");
		updateFailure(placement, new Error(truncateUtf16Safe(recoveryError, RECOVERY_ERROR_LIMIT)));
	};
	const failDraining = async (placement, error, options = {}) => {
		if (placement.turnClaim && !options.forceClaimFence) return;
		const current = placements.get(placement.sessionId);
		if (current?.state !== "draining") return;
		if (current.turnClaim) await placements.closeWorkerTurnToolState({
			sessionId: current.sessionId,
			claimId: current.turnClaim.claimId,
			runId: current.turnClaim.runId,
			placementGeneration: current.turnClaim.generation,
			owner: placementTurnOwner(current)
		});
		const reconciling = startReconcile(current);
		const teardownErrors = await cleanupEnvironment({
			environmentId: current.environmentId,
			ownerEpoch: current.activeOwnerEpoch
		});
		finishReconcilingFailure(reconciling, error, teardownErrors);
	};
	const reclaimActive = async (placement, environment, claimedTurnError) => {
		const draining = startDrain(placement);
		if (draining.turnClaim) {
			await failDraining(draining, claimedTurnError, { forceClaimFence: true });
			return;
		}
		const reconciling = startReconcile(draining);
		if (environment?.state === "failed" && environment.error === "Worker build does not match the current Gateway build; redispatch the session so its worker can bootstrap the current build before retrying." && environment.leaseId === null && !placements.listPendingWorkspaceResults(placement.sessionId).some((result) => result.sessionId === placement.sessionId)) {
			placements.transition({
				sessionId: reconciling.sessionId,
				from: "reconciling",
				to: "reclaimed",
				expectedGeneration: reconciling.generation
			});
			log.info(`Reclaimed idle cloud worker sessionId=${boundedWorkerError(placement.sessionId, 128)} environmentId=${boundedWorkerError(placement.environmentId, 128)}: ${STALE_WORKER_BUILD_REASON}`);
			return;
		}
		if (!environment || environment.state === "destroyed" || environment.state === "failed" || environment.state === "orphaned") {
			finishReconcilingFailure(reconciling, claimedTurnError, []);
			return;
		}
		const teardownErrors = await cleanupEnvironment({
			environmentId: placement.environmentId,
			ownerEpoch: placement.activeOwnerEpoch
		});
		if (teardownErrors.length > 0) {
			finishReconcilingFailure(reconciling, /* @__PURE__ */ new Error(`Worker reclaim teardown failed: ${teardownErrors.join("; ")}`), []);
			return;
		}
		placements.transition({
			sessionId: reconciling.sessionId,
			from: "reconciling",
			to: "reclaimed",
			expectedGeneration: reconciling.generation
		});
	};
	const failActive = async (placement, error, options = {}) => {
		const draining = startDrain(placement);
		await failDraining(draining, error, options);
	};
	return {
		cancelProvisioning,
		failActive,
		failDraining,
		reclaimActive,
		retryFailedTeardown,
		teardownEnvironment
	};
}
//#endregion
export { isUnavailableEnvironment as a, createDevicePlacementAuthority as c, isExactAttachedEnvironment as i, resolveDevicePlacementEligibility as l, createPlacementFailureActions as n, workerDisappearanceError as o, isCurrentActiveWorkerEnvironment as r, DevicePlacementUnavailableError as s, canRetryDeviceDispatch as t };
