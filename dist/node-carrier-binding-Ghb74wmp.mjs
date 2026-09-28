//#region src/gateway/worker-environments/node-carrier-binding.ts
function snapshotWorkerNodeCarrierBinding(record, message, ownerEpoch = record?.ownerEpoch) {
	if (!record || record.state !== "ready" && record.state !== "idle" && record.state !== "attached" || record.destroyRequestedAtMs !== null || !record.leaseId || !record.nodeDeviceId || record.sshEndpoint !== null || record.ownerEpoch !== ownerEpoch) throw new Error(message);
	return {
		environmentId: record.environmentId,
		leaseId: record.leaseId,
		nodeDeviceId: record.nodeDeviceId,
		ownerEpoch: record.ownerEpoch
	};
}
function isWorkerNodeCarrierBindingCurrent(current, binding) {
	return Boolean(current && (current.state === "ready" || current.state === "idle" || current.state === "attached") && current.destroyRequestedAtMs === null && current.leaseId === binding.leaseId && current.nodeDeviceId === binding.nodeDeviceId && current.sshEndpoint === null && current.ownerEpoch === binding.ownerEpoch);
}
//#endregion
export { snapshotWorkerNodeCarrierBinding as n, isWorkerNodeCarrierBindingCurrent as t };
