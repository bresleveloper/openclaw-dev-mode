import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import "./worker-admission-BB3C4gz4.mjs";
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
const NODE_WORKER_CAPACITY_MAX = 1024;
const NODE_RUNNER_UPDATE_REQUIRED_ISSUE = {
	code: "update-required",
	action: "update-and-reconnect",
	updateCommand: "openclaw update",
	headlessReconnectCommand: "openclaw node restart"
};
function parseCapacitySnapshot(value) {
	if (!isRecord(value)) return null;
	const keys = Object.keys(value);
	const total = value.total;
	const available = value.available;
	return keys.length === 2 && keys.includes("total") && keys.includes("available") && typeof total === "number" && typeof available === "number" && Number.isSafeInteger(total) && Number.isSafeInteger(available) && total >= 1 && total <= 1024 && available >= 0 && available <= total ? {
		total,
		available
	} : null;
}
function parseWorkerHostDeclaration(value) {
	if (!isRecord(value) || typeof value.enabled !== "boolean") return null;
	const keys = Object.keys(value);
	if (!value.enabled) return keys.length === 1 && keys[0] === "enabled" ? { enabled: false } : null;
	const capacity = parseCapacitySnapshot(value.capacity);
	if (!capacity || keys.length < 2 || keys.length > 9 || !keys.includes("enabled") || !keys.includes("capacity") || keys.some((key) => key !== "enabled" && key !== "capacity" && key !== "bundlePrewarm" && key !== "bundleRetention" && key !== "bundleStatus" && key !== "portalStream" && key !== "environmentSession" && key !== "preparedWorkspace" && key !== "capturedExecPolicy") || value.bundlePrewarm !== void 0 && value.bundlePrewarm !== 1 || value.bundleRetention !== void 0 && value.bundleRetention !== 1 || value.bundleStatus !== void 0 && value.bundleStatus !== 1 || value.portalStream !== void 0 && value.portalStream !== 1 || value.environmentSession !== void 0 && value.environmentSession !== 1 || value.preparedWorkspace !== void 0 && value.preparedWorkspace !== 1 || value.capturedExecPolicy !== void 0 && value.capturedExecPolicy !== true || value.bundleStatus !== void 0 && value.bundleRetention === void 0) return null;
	return {
		enabled: true,
		capacity,
		...value.bundlePrewarm === 1 ? { bundlePrewarm: 1 } : {},
		...value.bundleRetention === 1 ? { bundleRetention: 1 } : {},
		...value.bundleStatus === 1 ? { bundleStatus: 1 } : {},
		...value.portalStream === 1 ? { portalStream: 1 } : {},
		...value.environmentSession === 1 ? { environmentSession: 1 } : {},
		...value.preparedWorkspace === 1 ? { preparedWorkspace: 1 } : {},
		...value.capturedExecPolicy === true ? { capturedExecPolicy: true } : {}
	};
}
/** Parses the closed reconnect-scoped node-host runner declaration. */
function parseNodeRunnerInventoryDeclaration(value) {
	if (!isRecord(value) || !Array.isArray(value.protocolFeatures)) return null;
	const keys = Object.keys(value);
	if (value.protocolFeatures.length === 0) return keys.length === 1 && keys.includes("protocolFeatures") ? { protocolFeatures: [] } : null;
	if (value.protocolFeatures.length !== 1) return null;
	const feature = value.protocolFeatures[0];
	const retiredFeature = RETIRED_NODE_WORKER_SUPERVISOR_PROTOCOL_FEATURES.find((candidate) => candidate === feature);
	if (retiredFeature) return keys.length <= 2 && keys.every((key) => key === "protocolFeatures" || key === "workerRuns" || key === "workerHost") ? { protocolFeatures: [retiredFeature] } : null;
	if (feature !== "node-worker-supervisor-v6" || keys.length !== 2) return null;
	const workerHost = parseWorkerHostDeclaration(value.workerHost);
	return workerHost ? {
		protocolFeatures: [NODE_WORKER_SUPERVISOR_PROTOCOL_FEATURE],
		workerHost
	} : null;
}
function formatNodeRunnerUpdateRequired(nodeId, issue) {
	return `device worker node ${nodeId} requires an update before it can host sessions; run ${issue.updateCommand}, then reconnect it (for a headless node, run ${issue.headlessReconnectCommand})`;
}
/** Worker execution requires the node to preserve the Gateway's captured exec policy. */
function resolveNodeWorkerExecutionIssue(workerHost) {
	return workerHost.enabled && workerHost.capturedExecPolicy !== true ? NODE_RUNNER_UPDATE_REQUIRED_ISSUE : void 0;
}
//#endregion
export { formatNodeRunnerUpdateRequired as a, NODE_WORKER_SUPERVISOR_PROTOCOL_FEATURE as i, NODE_RUNNER_UPDATE_REQUIRED_ISSUE as n, parseNodeRunnerInventoryDeclaration as o, NODE_WORKER_CAPACITY_MAX as r, resolveNodeWorkerExecutionIssue as s, NODE_RUNNER_INVENTORY_UPDATE_METHOD as t };
