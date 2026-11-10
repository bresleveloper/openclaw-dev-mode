import { n as getPublishedPairedDeviceBinding } from "./device-pairing-publication-Bz9OLkoc.mjs";
import { l as resolveNodePairingState, n as hasEffectivePairedDeviceRole } from "./device-pairing-identity-BRtdqCdi.mjs";
import { t as getPairedDevice } from "./device-pairing-_Xo0MHGf.mjs";
//#region src/infra/device-pairing-node-state.ts
async function resolveCurrentPairedDeviceNodeBinding(nodeId) {
	await getPairedDevice(nodeId);
	return getPublishedPairedDeviceBinding(nodeId.trim()) ?? void 0;
}
function isPairedDeviceNodeBindingCurrent(nodeId, expected) {
	const current = getPublishedPairedDeviceBinding(nodeId.trim());
	return Boolean(current && current.identity === expected.identity && (!expected.generation || current.generation === expected.generation));
}
async function captureNodePairingGeneration(nodeId) {
	return resolveNodePairingState(await getPairedDevice(nodeId))?.generation ?? null;
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
export { resolveCurrentPairedDeviceNodeBinding as a, isPairedDeviceNodeBindingCurrent as i, captureNodePairingGeneration as n, isNodePairingGenerationCurrent as r, captureAuthenticatedNodePairingState as t };
