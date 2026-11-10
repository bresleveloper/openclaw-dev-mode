//#region src/config/required-worker-profile.ts
var RequiredWorkerProfileError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.code = "invalid_profile";
	}
};
/** Configuration is intent; only the placement owner can attest an admitted destination. */
function assertRequiredWorkerSelection(config, selection) {
	const required = config.cloudWorkers?.requiredProfile;
	if (!required) return;
	if (selection.profileId !== void 0 && selection.profileId !== required || selection.catalogId !== void 0 || selection.deviceId !== void 0 || selection.autoDevice === true || selection.machineClass !== void 0 || selection.os !== void 0 || selection.execNode !== void 0 && selection.execNode !== null || selection.agentRuntime !== void 0 && selection.agentRuntime !== null && selection.agentRuntime !== "openclaw" && selection.agentRuntime !== "auto" && selection.agentRuntime !== "default") throw new RequiredWorkerProfileError(`Gateway policy requires worker profile "${required}" with the OpenClaw runtime; session execution overrides are not allowed.`);
}
function assertRequiredWorkerDispatch(config, request) {
	const required = config.cloudWorkers?.requiredProfile;
	if (!required) return;
	if (request.profileId !== required || request.executionMode !== "worker-turn" || request.machineClass !== void 0 || request.os !== void 0) throw new RequiredWorkerProfileError(`Gateway policy requires worker profile "${required}".`);
}
function assertRequiredWorkerMove(config, target) {
	const required = config.cloudWorkers?.requiredProfile;
	if (required && (target.kind !== "profile" || target.profileId !== required || target.machineClass !== void 0 || target.os !== void 0)) throw new RequiredWorkerProfileError("Session placement changes are disabled by the required worker profile policy.");
}
/** Sessionless helpers cannot acquire provider auth under a mandatory placement policy. */
function requiredWorkerHelperError(config, workerAdmitted = false) {
	return config.cloudWorkers?.requiredProfile && !workerAdmitted ? { error: "Sessionless model helpers are unsupported when cloudWorkers.requiredProfile is configured; run the task in a worker-backed session." } : void 0;
}
function assertRequiredWorkerLocalExecution(config, origin = "Local") {
	if (config.cloudWorkers?.requiredProfile) throw new Error(`${origin} execution is disabled by the required worker profile policy.`);
}
//#endregion
export { assertRequiredWorkerSelection as a, assertRequiredWorkerMove as i, assertRequiredWorkerDispatch as n, requiredWorkerHelperError as o, assertRequiredWorkerLocalExecution as r, RequiredWorkerProfileError as t };
