//#region src/node-host/node-worker-journal.types.ts
function nodeWorkerTurnMatchesIdentity(receipt, expected) {
	return receipt.launchId === expected.launchId && receipt.planHash === expected.planHash && receipt.environmentId === expected.environmentId && receipt.sessionId === expected.sessionId && receipt.ownerEpoch === expected.ownerEpoch && receipt.placementGeneration === expected.placementGeneration && receipt.runId === expected.runId;
}
//#endregion
export { nodeWorkerTurnMatchesIdentity as t };
