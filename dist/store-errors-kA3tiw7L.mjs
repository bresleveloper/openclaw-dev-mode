//#region src/gateway/worker-environments/store-errors.ts
var WorkerEnvironmentInventoryClosedError = class extends Error {
	constructor() {
		super("Worker environment inventory has closed");
		this.name = "WorkerEnvironmentInventoryClosedError";
	}
};
//#endregion
export { WorkerEnvironmentInventoryClosedError as t };
