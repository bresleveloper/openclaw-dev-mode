import { o as resolveNodePairingState } from "./device-pairing-identity-f0QUXRJo.mjs";
//#region src/infra/device-pairing-binding.ts
function prepareDevicePairingBinding(deviceId, device) {
	const state = resolveNodePairingState(device);
	return {
		deviceId,
		binding: state ? {
			identity: state.identity.key,
			...state.generation ? { generation: state.generation.key } : {}
		} : null
	};
}
//#endregion
export { prepareDevicePairingBinding as t };
