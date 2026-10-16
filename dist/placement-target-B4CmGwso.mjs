//#region src/gateway/worker-environments/placement-target.ts
function matchesWorkerPlacementTarget(current, expected) {
	return current?.state === expected?.state && current?.generation === expected?.generation && current?.environmentId === expected?.environmentId && current?.activeOwnerEpoch === expected?.activeOwnerEpoch;
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
export { matchesWorkerPlacementTarget as n, isFailedWorkerPlacementEnvironmentGone as t };
