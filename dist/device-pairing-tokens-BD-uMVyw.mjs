import { n as executeDevicePairingMutation, t as DevicePairingAuthorityRefusedError } from "./device-pairing-worker-CI-Kr0jq.mjs";
import { s as withDevicePairingLock } from "./device-pairing-store-readonly-Dw6Eqbnn.mjs";
//#region src/infra/device-pairing-tokens.ts
async function verifyDeviceToken(params) {
	const { baseDir, ...input } = params;
	return await withDevicePairingLock(() => executeDevicePairingMutation({
		type: "devicePairing.verifyToken",
		input: {
			...input,
			nowMs: Date.now()
		}
	}, { baseDir }));
}
async function ensureDeviceToken(params) {
	const { baseDir, isIssuanceCurrent, ...input } = params;
	return await withDevicePairingLock(() => executeDevicePairingMutation({
		type: "devicePairing.ensureToken",
		input: {
			...input,
			nowMs: Date.now()
		}
	}, {
		baseDir,
		onAuthorityRefused: () => null,
		assertCurrent: () => {
			if (isIssuanceCurrent?.() === false) throw new DevicePairingAuthorityRefusedError("Device token issuance authority changed");
		}
	}));
}
async function rotateDeviceToken(params) {
	const { baseDir, ...input } = params;
	return await withDevicePairingLock(() => executeDevicePairingMutation({
		type: "devicePairing.rotateToken",
		input: {
			...input,
			nowMs: Date.now()
		}
	}, { baseDir }));
}
async function revokeDeviceToken(params) {
	const { baseDir, ...input } = params;
	return await withDevicePairingLock(() => executeDevicePairingMutation({
		type: "devicePairing.revokeToken",
		input: {
			...input,
			nowMs: Date.now()
		}
	}, { baseDir }));
}
//#endregion
export { verifyDeviceToken as i, revokeDeviceToken as n, rotateDeviceToken as r, ensureDeviceToken as t };
