//#region src/worker/worker-build-identity.ts
function sameWorkerProtocolFeatures(left, right) {
	const normalizedLeft = left.toSorted();
	const normalizedRight = right.toSorted();
	return normalizedLeft.length === normalizedRight.length && normalizedLeft.every((value, index) => value === normalizedRight[index]);
}
/** Compares the exact worker build while treating protocol features as an unordered set. */
function sameWorkerBuild(left, right) {
	return left.bundleHash === right.bundleHash && left.openclawVersion === right.openclawVersion && sameWorkerProtocolFeatures(left.protocolFeatures, right.protocolFeatures);
}
//#endregion
export { sameWorkerProtocolFeatures as n, sameWorkerBuild as t };
