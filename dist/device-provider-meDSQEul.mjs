import { a as formatNodeRunnerUpdateRequired } from "./node-runner-inventory-DTVspi93.mjs";
import { t as WorkerProviderError } from "./capability-provider.types-BsBg4rOj.mjs";
import { t as DEVICE_WORKER_PROVIDER_ID } from "./device-provider-identity-v6nXqNq_.mjs";
import { n as hasEffectivePairedDeviceRole } from "./device-pairing-identity-BnU9nqx2.mjs";
import "./device-pairing-DbLfxuuq.mjs";
import { t as createNodeWorkerLaunchAdapter } from "./node-launch-adapter-DTc3AjLt.mjs";
import { createHash } from "node:crypto";
//#region src/gateway/worker-environments/device-provider.ts
const DEVICE_WORKER_DORMANCY_MS = 12096e5;
const DEVICE_WORKER_AVAILABILITY = /* @__PURE__ */ new WeakMap();
const DEVICE_WORKER_RECONCILIATION = /* @__PURE__ */ new WeakMap();
function bindDeviceWorkerAvailability(service, resolveAvailability) {
	DEVICE_WORKER_AVAILABILITY.set(service, resolveAvailability);
}
async function resolveDeviceWorkerAvailability(service, deviceId) {
	const resolveAvailability = service ? DEVICE_WORKER_AVAILABILITY.get(service) : void 0;
	return resolveAvailability ? await resolveAvailability(deviceId) : { available: false };
}
function deviceUnavailableText(deviceId, availability) {
	if (availability.issue) return formatNodeRunnerUpdateRequired(deviceId, availability.issue);
	switch (availability.unavailableReason) {
		case "unpaired": return `device worker is not a paired node host: ${deviceId}`;
		case "disconnected": return `device worker node is not connected: ${deviceId}; reconnect it before retrying`;
		case "hosting-unavailable": return `device node ${deviceId} is connected but cannot host sessions; enable session hosting (nodeHost.workerRuns.enabled), update the node if needed, then reconnect it`;
		case "at-capacity": return `device worker is at capacity (all worker slots in use): ${deviceId}; stop an existing worker environment or retry when a slot is free`;
		default: return `device worker availability is unknown: ${deviceId}; verify the node host is paired and connected, then retry`;
	}
}
function bindDeviceWorkerReconciliation(service, reconcile) {
	DEVICE_WORKER_RECONCILIATION.set(service, reconcile);
}
async function reconcileDeviceWorker(service, deviceId) {
	const reconcile = service ? DEVICE_WORKER_RECONCILIATION.get(service) : void 0;
	return reconcile ? await reconcile(deviceId) : [];
}
function requireDeviceId(profile) {
	const deviceId = profile.device;
	if (typeof deviceId !== "string" || !deviceId.trim()) throw new WorkerProviderError("device worker profile requires a device setting");
	return deviceId.trim();
}
function hasPairedNodeRole(device) {
	return Boolean(device && hasEffectivePairedDeviceRole(device, "node"));
}
function isWithinDeviceDormancy(device, nowMs) {
	const disconnectedAtMs = device.nodeSurface?.lastDisconnectedAtMs;
	return disconnectedAtMs === void 0 || nowMs - disconnectedAtMs < DEVICE_WORKER_DORMANCY_MS;
}
function deviceLeaseId(deviceId, operationId) {
	return `device:${createHash("sha256").update(deviceId).digest("hex")}:${createHash("sha256").update(operationId).digest("hex").slice(0, 32)}`;
}
/** Core runtime for already-paired node hosts; pairing remains the durable trust owner. */
function createDeviceWorkerRuntime(options) {
	const now = options.now ?? Date.now;
	let nodeTransport;
	const launchAdapter = createNodeWorkerLaunchAdapter({ getTransport: () => nodeTransport });
	const resolveAvailability = async (deviceId) => {
		const [paired, connected] = await Promise.all([options.getPairedDevice(deviceId), nodeTransport?.getCurrentNode(deviceId)]);
		const current = connected && nodeTransport?.isCurrent(connected) ? connected : void 0;
		const unavailableReason = !hasPairedNodeRole(paired) ? "unpaired" : !current ? nodeTransport?.isConnected?.(deviceId) ? "hosting-unavailable" : "disconnected" : void 0;
		const issue = nodeTransport?.getIssue?.(deviceId);
		return {
			available: unavailableReason === void 0,
			...unavailableReason === void 0 && current ? { node: current } : {},
			...issue ? { issue } : {},
			...unavailableReason ? { unavailableReason } : {}
		};
	};
	const provider = {
		id: DEVICE_WORKER_PROVIDER_ID,
		supportedExecutionModes: ["worker-turn", "remote-exec"],
		provisionBeforeInstallation: true,
		resolveAllocation: async (profile, operationId) => ({
			leaseId: deviceLeaseId(requireDeviceId(profile), operationId),
			sharedHost: true
		}),
		provision: async (profile, operationId, provisionOptions) => {
			if (!provisionOptions?.assertCurrent) throw new WorkerProviderError("Device provisioning requires current Gateway allocation authority");
			provisionOptions.assertCurrent();
			const deviceId = requireDeviceId(profile);
			const availability = await resolveAvailability(deviceId);
			provisionOptions.assertCurrent();
			if (!availability.available) throw new WorkerProviderError(deviceUnavailableText(deviceId, availability));
			const allocation = await provider.resolveAllocation(profile, operationId);
			provisionOptions.assertCurrent();
			return {
				...allocation,
				node: { deviceId }
			};
		},
		inspect: async ({ profile }) => {
			const deviceId = requireDeviceId(profile);
			const paired = await options.getPairedDevice(deviceId);
			if (!hasPairedNodeRole(paired)) return { status: "unknown" };
			if (await nodeTransport?.getCurrentNode(deviceId)) return {
				status: "active",
				sharedHost: true
			};
			return isWithinDeviceDormancy(paired, now()) ? { status: "dormant" } : { status: "unknown" };
		},
		destroy: async () => {}
	};
	return {
		provider,
		resolveAvailability,
		launchNodeWorker: launchAdapter.launch,
		getNodeTransport: () => nodeTransport,
		bindNodeTransport: (transport) => {
			nodeTransport = transport;
		}
	};
}
//#endregion
export { reconcileDeviceWorker as a, deviceUnavailableText as i, bindDeviceWorkerReconciliation as n, resolveDeviceWorkerAvailability as o, createDeviceWorkerRuntime as r, bindDeviceWorkerAvailability as t };
