import { l as withDevicePairingLock, n as executeDevicePairingMutation, t as DevicePairingAuthorityRefusedError } from "./device-pairing-worker-DPa4iZOd.mjs";
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
	return await withDevicePairingLock(async () => {
		try {
			return await executeDevicePairingMutation({
				type: "devicePairing.ensureToken",
				input: {
					...input,
					nowMs: Date.now()
				}
			}, {
				baseDir,
				assertCurrent: () => {
					if (isIssuanceCurrent?.() === false) throw new DevicePairingAuthorityRefusedError("Device token issuance authority changed");
				}
			});
		} catch (error) {
			if (error instanceof DevicePairingAuthorityRefusedError) return null;
			throw error;
		}
	});
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
