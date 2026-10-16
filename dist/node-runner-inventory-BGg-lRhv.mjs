import { ni as NEVER } from "./json-schema-processors-C6KO_BFy.mjs";
import { Et as _enum, Jn as string, Nt as array, nr as tuple, or as union, sr as unknown, tr as transform, xn as literal } from "./schemas-BOYIvvln.mjs";
import { r as parseWorkerCapacity } from "./worker-capacity-ChjgV5BU.mjs";
import "./worker-admission-CNeLWzVQ.mjs";
import { a as workerProtocolObject } from "./protocol-record-CQCXx-YV.mjs";
//#region src/infra/node-runner-inventory.ts
const NODE_RUNNER_INVENTORY_UPDATE_METHOD = "node.runnerInventory.update";
const NODE_WORKER_SUPERVISOR_PROTOCOL_FEATURE = "node-worker-supervisor-v6";
const RETIRED_NODE_WORKER_SUPERVISOR_PROTOCOL_FEATURES = [
	"node-worker-supervisor-v1",
	"node-worker-supervisor-v2",
	"node-worker-supervisor-v3",
	"node-worker-supervisor-v4",
	"node-worker-supervisor-v5"
];
const NODE_WORKER_HOST_DISABLED_REASON_MAX_LENGTH = 1024;
const LEGACY_NODE_WORKER_LAUNCH_TOOL_NAMES = Object.freeze([
	"read",
	"write",
	"edit",
	"apply_patch",
	"exec",
	"process",
	"browser",
	"computer",
	"skill_workshop",
	"sessions_spawn",
	"sessions_send",
	"portal"
]);
const NODE_RUNNER_UPDATE_REQUIRED_ISSUE = {
	code: "update-required",
	action: "update-and-reconnect",
	updateCommand: "openclaw update",
	headlessReconnectCommand: "openclaw node restart"
};
const CapacitySnapshot = transform((value, context) => {
	const capacity = parseWorkerCapacity(value);
	if (!capacity) {
		context.addIssue({
			code: "custom",
			message: "invalid worker capacity"
		});
		return NEVER;
	}
	return capacity;
});
const LaunchToolNames = array(string().min(1).max(64)).max(64).refine((names) => new Set(names).size === names.length);
const WorkerHost = union([workerProtocolObject({
	enabled: literal(false),
	reason: string().max(NODE_WORKER_HOST_DISABLED_REASON_MAX_LENGTH).refine((value) => value.trim().length > 0).optional()
}), workerProtocolObject({
	enabled: literal(true),
	capacity: CapacitySnapshot,
	bundlePrewarm: literal(1).optional(),
	bundleRetention: literal(1).optional(),
	bundleStatus: literal(1).optional(),
	portalStream: literal(1).optional(),
	environmentSession: literal(1).optional(),
	statusWait: literal(1).optional(),
	preparedWorkspace: literal(1).optional(),
	capturedExecPolicy: literal(true).optional(),
	workspaceQuiescence: literal(1).optional(),
	launchToolNames: LaunchToolNames.optional(),
	idleRetention: literal(true).optional()
}).refine((host) => (host.bundleStatus === void 0 || host.bundleRetention !== void 0) && (host.capacity.reclaimableIdle === void 0 || host.idleRetention === true))]).transform((host) => {
	for (const [key, value] of Object.entries(host)) if (value === void 0) Reflect.deleteProperty(host, key);
	return host;
});
const RunnerInventory = union([
	workerProtocolObject({ protocolFeatures: tuple([]).readonly() }),
	workerProtocolObject({
		protocolFeatures: tuple([_enum(RETIRED_NODE_WORKER_SUPERVISOR_PROTOCOL_FEATURES)]).readonly(),
		workerRuns: unknown().optional(),
		workerHost: unknown().optional()
	}).refine((value) => Object.keys(value).length <= 2).transform(({ protocolFeatures }) => ({ protocolFeatures })),
	workerProtocolObject({
		protocolFeatures: tuple([literal(NODE_WORKER_SUPERVISOR_PROTOCOL_FEATURE)]).readonly(),
		workerHost: WorkerHost
	})
]);
/** Parses the closed reconnect-scoped node-host runner declaration. */
function parseNodeRunnerInventoryDeclaration(value) {
	return RunnerInventory.safeParse(value).data ?? null;
}
function formatNodeRunnerInventoryIssue(nodeId, issue) {
	return issue.code === "worker-host-unavailable" ? `device worker node ${nodeId} cannot host sessions: ${issue.message}` : `device worker node ${nodeId} requires an update before it can host sessions; run ${issue.updateCommand}, then reconnect it (for a headless node, run ${issue.headlessReconnectCommand})`;
}
var NodeRunnerUpdateRequiredError = class extends Error {
	constructor(nodeId) {
		super(formatNodeRunnerInventoryIssue(nodeId, NODE_RUNNER_UPDATE_REQUIRED_ISSUE));
		this.code = "node_runner_update_required";
		this.name = "NodeRunnerUpdateRequiredError";
	}
};
function createNodeRunnerInventoryIssueError(nodeId, issue) {
	return issue.code === "update-required" ? new NodeRunnerUpdateRequiredError(nodeId) : new Error(formatNodeRunnerInventoryIssue(nodeId, issue));
}
/** Worker execution requires the node to preserve the Gateway's captured exec policy. */
function resolveNodeWorkerExecutionIssue(workerHost) {
	return workerHost.enabled && workerHost.capturedExecPolicy !== true ? NODE_RUNNER_UPDATE_REQUIRED_ISSUE : void 0;
}
function resolveNodeWorkerLaunchToolNames(workerHost) {
	return workerHost?.enabled && workerHost.launchToolNames || LEGACY_NODE_WORKER_LAUNCH_TOOL_NAMES;
}
//#endregion
export { createNodeRunnerInventoryIssueError as a, resolveNodeWorkerExecutionIssue as c, NODE_WORKER_SUPERVISOR_PROTOCOL_FEATURE as i, resolveNodeWorkerLaunchToolNames as l, NODE_RUNNER_UPDATE_REQUIRED_ISSUE as n, formatNodeRunnerInventoryIssue as o, NODE_WORKER_HOST_DISABLED_REASON_MAX_LENGTH as r, parseNodeRunnerInventoryDeclaration as s, NODE_RUNNER_INVENTORY_UPDATE_METHOD as t };
