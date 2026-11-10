//#region src/gateway/worker-environments/placement-inventory-changed-error.ts
var WorkerPlacementInventoryChangedError = class extends Error {
	constructor(sessionIds) {
		super("Worker placement inventory changed");
		this.sessionIds = sessionIds;
	}
};
//#endregion
export { WorkerPlacementInventoryChangedError as t };
