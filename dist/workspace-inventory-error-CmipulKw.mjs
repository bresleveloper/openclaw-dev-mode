//#region src/gateway/worker-environments/workspace-inventory-error.ts
var WorkerWorkspacePreflightError = class extends Error {
	constructor(message) {
		super(message);
		this.code = "invalid_state";
		this.name = "WorkerWorkspacePreflightError";
	}
};
const workspaceInventoryError = (message) => new WorkerWorkspacePreflightError(message);
//#endregion
export { workspaceInventoryError as t };
