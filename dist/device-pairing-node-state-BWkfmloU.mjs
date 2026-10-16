import { o as getPublishedPairedDeviceBinding } from "./device-pairing-store-readonly-Dw6Eqbnn.mjs";
import { n as hasEffectivePairedDeviceRole, o as resolveNodePairingState } from "./device-pairing-identity-f0QUXRJo.mjs";
import { t as getPairedDevice } from "./device-pairing-Drmq_Czv.mjs";
import { t as prepareDevicePairingBinding } from "./device-pairing-binding-CABhM8EO.mjs";
//#region src/infra/device-pairing-node-state.ts
/** Project only authenticated node-role bindings from the caller's loaded device snapshot. */
function projectPairedDeviceNodeBindings(pairedDevices) {
	const bindings = /* @__PURE__ */ new Map();
	for (const device of pairedDevices) {
		const { binding } = prepareDevicePairingBinding(device.deviceId, device);
		if (binding) bindings.set(device.deviceId, binding);
	}
	return bindings;
}
async function captureNodePairingState(nodeId, baseDir) {
	return resolveNodePairingState(await getPairedDevice(nodeId, baseDir));
}
async function resolveCurrentPairedDeviceNodeBinding(nodeId) {
	await getPairedDevice(nodeId);
	return getPublishedPairedDeviceBinding(nodeId.trim()) ?? void 0;
}
function isPairedDeviceNodeBindingCurrent(nodeId, expected) {
	const current = getPublishedPairedDeviceBinding(nodeId.trim());
	return Boolean(current && current.identity === expected.identity && (!expected.generation || current.generation === expected.generation));
}
async function captureNodePairingGeneration(nodeId) {
	return (await captureNodePairingState(nodeId))?.generation ?? null;
}
/** Binds a connected session to the exact device key and node token used for authentication. */
async function captureAuthenticatedNodePairingState(params) {
	const device = await getPairedDevice(params.nodeId, params.baseDir);
	if (!device || device.publicKey !== params.publicKey || device.tokens?.node?.token !== params.token || !hasEffectivePairedDeviceRole(device, "node")) return null;
	const state = resolveNodePairingState(device);
	return state ? {
		...state,
		approvedSurface: {
			caps: device.nodeSurface?.caps ?? [],
			commands: device.nodeSurface?.commands ?? [],
			permissions: device.nodeSurface?.permissions
		}
	} : null;
}
async function isNodePairingGenerationCurrent(generation) {
	await getPairedDevice(generation.nodeId);
	return getPublishedPairedDeviceBinding(generation.nodeId)?.generation === generation.key;
}
//#endregion
export { isPairedDeviceNodeBindingCurrent as a, isNodePairingGenerationCurrent as i, captureNodePairingGeneration as n, projectPairedDeviceNodeBindings as o, captureNodePairingState as r, resolveCurrentPairedDeviceNodeBinding as s, captureAuthenticatedNodePairingState as t };
