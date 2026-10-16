//#region src/gateway/desktop/computer-owner.ts
/** One physical execution belongs to one exact admitted-run claim. */
function computerRunOwner(authority) {
	return JSON.stringify([
		"agent",
		authority.operationalRunInstance.instanceId,
		authority.operationalRunInstance.runId,
		authority.lifecycleGeneration,
		authority.claimId
	]);
}
//#endregion
export { computerRunOwner as t };
