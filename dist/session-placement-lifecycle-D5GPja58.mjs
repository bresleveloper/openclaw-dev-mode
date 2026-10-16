import { T as parseCronRunScopeSuffix } from "./session-key-C09ow4h0.mjs";
import "./device-provider-identity-v6nXqNq_.mjs";
import { n as matchesWorkerPlacementTarget, t as isFailedWorkerPlacementEnvironmentGone } from "./placement-target-B4CmGwso.mjs";
//#region src/gateway/worker-environments/session-placement-lifecycle.ts
var SessionWorkerPlacementMutationError = class extends Error {
	constructor(state, action, key) {
		super(`Session ${key} cannot ${action} while cloud worker placement is ${state}.`);
	}
};
var SessionWorkerPlacementStopError = class extends Error {
	constructor(state, action, key) {
		super(`Session ${key} cannot ${action} while cloud worker placement is ${state}. ${state === "failed" ? "Worker cleanup is still pending. Use Stop cloud worker to retry cleanup; if stopping fails, resolve the provider error before trying again." : "Wait for the cloud worker transition to finish before trying again."}`);
	}
};
function canRedispatchFailedWorkerPlacement(placement, environment) {
	return Boolean(placement.activeOwnerEpoch !== null && !placement.turnClaim && environment && environment.environmentId === placement.environmentId && (environment.providerId !== "device" || environment.nodeDeviceId) && isFailedWorkerPlacementEnvironmentGone({
		placement,
		environmentService: { get: () => environment }
	}));
}
function isWorkerPlacementSafeForMutation(context, placement) {
	if (placement.state === "failed") return isFailedWorkerPlacementEnvironmentGone({
		environmentService: context.workerEnvironmentService,
		placement
	});
	return placement.state === "local" || placement.state === "reclaimed";
}
function resolveWorkerPlacementArchiveRestoreError(params) {
	if (!params.placement || params.placement.state === "failed" && !params.placement.turnClaim || isWorkerPlacementSafeForMutation(params.context, params.placement)) return;
	return `Session ${params.key} cannot change archive state while cloud worker placement is ${params.placement.state}.`;
}
function resolveSessionWorkerPlacementMutationGuard(params) {
	const placement = readSessionWorkerPlacement(params);
	if (!placement) return { status: "allowed" };
	if (isWorkerPlacementSafeForMutation(params.context, placement)) {
		if (params.action === "reset") return {
			status: "retirement-required",
			sessionId: placement.sessionId,
			expectedState: placement.state,
			expectedGeneration: placement.generation
		};
		if (placement.state === "local" || params.action === "fork") return { status: "allowed" };
	}
	return {
		status: "blocked",
		error: new SessionWorkerPlacementMutationError(placement.state, params.action, params.key)
	};
}
function retireSessionWorkerPlacementBeforeMutation(params) {
	const guard = resolveSessionWorkerPlacementMutationGuard(params);
	if (guard.status !== "retirement-required") return guard.status === "blocked" ? guard.error : void 0;
	const retirementService = params.context.workerSessionPlacementService;
	if (!retirementService?.retireSessionPlacement) throw new Error("Worker session placement retirement service is unavailable");
	retirementService.retireSessionPlacement(guard);
}
function resolveSessionWorkerPlacementMutationError(params) {
	const guard = resolveSessionWorkerPlacementMutationGuard(params);
	return guard.status === "blocked" ? guard.error : void 0;
}
function readSessionWorkerPlacement(params) {
	return params.sessionId ? params.context.workerSessionPlacementService?.getMany([params.sessionId]).get(params.sessionId) : void 0;
}
function samePlacementOwner(expected, current) {
	return current?.sessionId === expected?.sessionId && current?.sessionKey === expected?.sessionKey && current?.agentId === expected?.agentId && matchesWorkerPlacementTarget(current, expected) && current?.executionMode === expected?.executionMode;
}
/** Retain the exact stopped placement across fallible workspace or session mutations. */
function prepareSessionWorkerPlacementMutationCheck(params, operation = "mutation") {
	const expected = readSessionWorkerPlacement(params);
	const assertCurrent = () => {
		const current = readSessionWorkerPlacement(params);
		if (!samePlacementOwner(expected, current) || current?.turnClaim || current && !isWorkerPlacementSafeForMutation(params.context, current)) throw new Error(`Worker session placement ${params.sessionId} changed before ${operation}`);
	};
	assertCurrent();
	return assertCurrent;
}
/** Archive visibility can change while a failed placement retains its physical cleanup. */
function prepareSessionWorkerPlacementArchiveCheck(params) {
	const expected = readSessionWorkerPlacement(params);
	if (expected?.state !== "failed") return {
		assertCurrent: prepareSessionWorkerPlacementMutationCheck(params),
		cleanupPending: false
	};
	const assertCurrent = () => {
		const current = readSessionWorkerPlacement(params);
		if (!samePlacementOwner(expected, current) || current?.turnClaim) throw new Error(`Worker session placement ${params.sessionId} changed before archive`);
	};
	assertCurrent();
	return {
		assertCurrent,
		cleanupPending: !isFailedWorkerPlacementEnvironmentGone({
			environmentService: params.context.workerEnvironmentService,
			placement: expected
		})
	};
}
/** Capture retirement without erasing cloud affinity before fallible session cleanup. */
function prepareSessionWorkerPlacementRetirement(params) {
	const expected = readSessionWorkerPlacement(params);
	const assertCurrent = prepareSessionWorkerPlacementMutationCheck(params, "retirement");
	const retire = params.context.workerSessionPlacementService?.retireSessionPlacement;
	if (expected && !retire) throw new Error("Worker session placement retirement service is unavailable");
	return {
		assertCurrent,
		retire: () => {
			if (!readSessionWorkerPlacement(params)) return;
			assertCurrent();
			if (expected && retire && isWorkerPlacementSafeForMutation(params.context, expected)) retire({
				sessionId: expected.sessionId,
				expectedState: expected.state,
				expectedGeneration: expected.generation
			});
		}
	};
}
/** Validate before cancellation; the returned stop remains bound to this placement across drains. */
function prepareSessionWorkerPlacementStop(params) {
	const { agentId, context, sessionId, sessionKey } = params;
	const expected = readSessionWorkerPlacement(params);
	const matches = (candidate) => candidate.sessionId === sessionId && (candidate.sessionKey === sessionKey || parseCronRunScopeSuffix(candidate.sessionKey).baseSessionKey === sessionKey) && candidate.agentId === agentId;
	if (expected && !matches(expected)) throw new Error(`Session ${sessionKey} cloud worker placement identity changed.`);
	if (expected && (expected.state === "reconciling" || params.action === "recover" && expected.state !== "active" && !isWorkerPlacementSafeForMutation(context, expected))) throw new SessionWorkerPlacementStopError(expected.state, params.action, sessionKey);
	const beforeDrain = (predecessor) => {
		params.authorize?.();
		const current = readSessionWorkerPlacement(params);
		if (!samePlacementOwner(expected && predecessor && predecessor.generation > expected.generation ? {
			...expected,
			...predecessor
		} : expected, current)) throw new Error(`Session ${sessionKey} cloud worker placement identity changed.`);
	};
	const stop = async () => {
		beforeDrain();
		if (!expected || params.action === "archive" && expected.state === "failed" || isWorkerPlacementSafeForMutation(context, expected) || !sessionId) return;
		if (!context.workerPlacementDispatchService?.reclaim) throw new Error(`Session ${sessionKey} cloud worker reclaim is unavailable.`);
		const reclaimed = await context.workerPlacementDispatchService.reclaim({
			agentId,
			sessionId,
			sessionKey: expected.sessionKey
		}, params.authorize, beforeDrain);
		params.authorize?.();
		const settled = readSessionWorkerPlacement(params);
		if (reclaimed.state !== "reclaimed" && reclaimed.state !== "local" || !matches(reclaimed) || !samePlacementOwner(reclaimed, settled)) throw new Error(`Session ${sessionKey} cloud worker reclaim identity changed.`);
	};
	return {
		stop,
		startBeforeDrain: expected?.state === "requested" || expected?.state === "provisioning" || expected?.state === "syncing" || expected?.state === "starting"
	};
}
//#endregion
export { prepareSessionWorkerPlacementRetirement as a, resolveWorkerPlacementArchiveRestoreError as c, prepareSessionWorkerPlacementMutationCheck as i, retireSessionWorkerPlacementBeforeMutation as l, canRedispatchFailedWorkerPlacement as n, prepareSessionWorkerPlacementStop as o, prepareSessionWorkerPlacementArchiveCheck as r, resolveSessionWorkerPlacementMutationError as s, SessionWorkerPlacementStopError as t };
