import { r as supportsCurrentWorkerLaunch } from "./worker-build-identity-CtiTzbZN.mjs";
//#region src/gateway/worker-environments/placement-target.ts
function matchesWorkerPlacementTarget(current, expected) {
	return current?.state === expected?.state && current?.generation === expected?.generation && current?.environmentId === expected?.environmentId && current?.activeOwnerEpoch === expected?.activeOwnerEpoch;
}
function isExactAttachedEnvironment(environment, placement) {
	return Boolean(environment && environment.environmentId === placement.environmentId && environment.state === "attached" && environment.destroyRequestedAtMs === null && isWorkerEnvironmentAttachedTo(environment, placement));
}
function isWorkerEnvironmentAttachedTo(environment, placement) {
	return environment?.state === "attached" && environment.ownerEpoch === placement.activeOwnerEpoch && environment.attachedSessionIds.length === 1 && environment.attachedSessionIds[0] === placement.sessionId;
}
function assertWorkerSandboxEnvironment(environment, placement, sandbox) {
	if (!isWorkerEnvironmentAttachedTo(environment, placement) || environment.environmentId !== placement.environmentId || sandbox.backendId === "node" && environment.nodeDeviceId !== sandbox.placementNodeId) throw new Error("Remote-exec environment changed while preparing its sandbox");
}
function isCurrentActiveWorkerEnvironment(placement, environment) {
	return isExactAttachedEnvironment(environment, placement) && environment?.bootstrapReceipt?.bundleHash === placement.workerBundleHash && supportsCurrentWorkerLaunch(environment?.bootstrapReceipt);
}
function isFailedWorkerPlacementEnvironmentGone(params) {
	if (params.placement.environmentId === null) return true;
	if (!params.environmentService) return false;
	try {
		const environment = params.environmentService.get(params.placement.environmentId);
		return environment === void 0 || environment.state === "destroyed" || environment.state === "failed" && environment.leaseId === null;
	} catch {
		return false;
	}
}
//#endregion
export { isWorkerEnvironmentAttachedTo as a, isFailedWorkerPlacementEnvironmentGone as i, isCurrentActiveWorkerEnvironment as n, matchesWorkerPlacementTarget as o, isExactAttachedEnvironment as r, assertWorkerSandboxEnvironment as t };
