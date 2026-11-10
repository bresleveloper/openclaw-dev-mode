import { n as recordModelFallbackStop } from "./model-fallback-stop-BtVvqU7l.mjs";
//#region src/worker/worker-node-loss.ts
var WorkerNodeLostError = class extends Error {
	constructor(options) {
		super("The node disconnected before the turn finished. Tool effects may be unknown; verify state before retrying.", options);
		this.code = "node-lost";
		this.canContinue = false;
		this.name = "WorkerNodeLostError";
		recordModelFallbackStop(this);
	}
};
//#endregion
export { WorkerNodeLostError as t };
