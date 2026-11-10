//#region src/gateway/worker-environments/state.ts
const WORKER_ENVIRONMENT_TERMINAL_STATES = [
	"destroyed",
	"failed",
	"orphaned"
];
function isTerminalWorkerEnvironmentState(state) {
	return WORKER_ENVIRONMENT_TERMINAL_STATES.some((terminal) => terminal === state);
}
const TRANSITIONS = {
	requested: ["provisioning", "failed"],
	provisioning: [
		"bootstrapping",
		"ready",
		"draining",
		"failed"
	],
	bootstrapping: [
		"ready",
		"draining",
		"orphaned"
	],
	ready: [
		"bootstrapping",
		"attached",
		"idle",
		"draining",
		"orphaned"
	],
	attached: [
		"idle",
		"draining",
		"orphaned"
	],
	idle: [
		"bootstrapping",
		"attached",
		"draining",
		"orphaned"
	],
	draining: ["destroying", "orphaned"],
	destroying: [
		"destroyed",
		"failed",
		"orphaned"
	],
	destroyed: [],
	failed: [],
	orphaned: []
};
function parseWorkerEnvironmentState(value) {
	if (typeof value !== "string" || !Object.hasOwn(TRANSITIONS, value)) throw new Error(`Invalid persisted worker environment state: ${String(value)}`);
	return value;
}
function canTransitionWorkerEnvironment(from, to) {
	return TRANSITIONS[from].some((candidate) => candidate === to);
}
function workerEnvironmentStateRequiresLease(state) {
	return state !== "requested" && state !== "provisioning" && state !== "failed";
}
//#endregion
export { workerEnvironmentStateRequiresLease as i, isTerminalWorkerEnvironmentState as n, parseWorkerEnvironmentState as r, canTransitionWorkerEnvironment as t };
