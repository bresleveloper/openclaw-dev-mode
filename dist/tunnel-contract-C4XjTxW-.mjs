import { _ as NODE_WORKER_CAPACITY_EXHAUSTED_ERROR_CODE } from "./node-commands-BLhGKTZa.mjs";
//#region src/gateway/worker-environments/tunnel-contract.ts
/** A disconnected node cannot hide an unfinished or failed local sibling cleanup. */
async function joinWorkerTunnelStops(operations) {
	const errors = (await Promise.allSettled(operations.filter((operation) => operation !== void 0))).flatMap((outcome) => outcome.status === "rejected" ? [outcome.reason] : []);
	if (errors.length === 1 || errors.length > 1 && errors.every((error) => error instanceof WorkerTunnelOwnerDisconnectedError)) throw errors[0];
	if (errors.length > 1) throw new AggregateError(errors, "Worker tunnel cleanup failed");
}
var WorkerTunnelOwnerDisconnectedError = class extends Error {
	constructor(message = "Worker tunnel owner is no longer connected") {
		super(message);
		this.name = "WorkerTunnelOwnerDisconnectedError";
	}
};
var WorkerRunnerUnavailableError = class extends Error {
	constructor() {
		super("The device runner is offline. Reconnect it, retry later, or bring the session back to this gateway.");
		this.code = "runner-offline";
		this.name = "WorkerRunnerUnavailableError";
	}
};
var WorkerRunnerCapacityError = class extends Error {
	constructor() {
		super("device worker capacity remained full");
		this.code = NODE_WORKER_CAPACITY_EXHAUSTED_ERROR_CODE;
		this.name = "WorkerRunnerCapacityError";
	}
};
//#endregion
export { joinWorkerTunnelStops as i, WorkerRunnerUnavailableError as n, WorkerTunnelOwnerDisconnectedError as r, WorkerRunnerCapacityError as t };
