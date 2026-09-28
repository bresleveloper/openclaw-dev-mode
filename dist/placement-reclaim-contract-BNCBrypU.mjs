//#region src/gateway/worker-environments/placement-reclaim-contract.ts
function matchesWorkerPlacementTarget(current, expected) {
	return current?.state === expected?.state && current?.generation === expected?.generation && current?.environmentId === expected?.environmentId && current?.activeOwnerEpoch === expected?.activeOwnerEpoch;
}
//#endregion
export { matchesWorkerPlacementTarget as t };
