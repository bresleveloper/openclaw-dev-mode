import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { c as isProgressCardRendererClient } from "./message-channel-DDcHHhpX.mjs";
import { d as readPairedCardRendererCache, i as listDevicePairingStoreRecordsReadOnly, l as withDevicePairingLock, n as executeDevicePairingMutation, o as loadPairedDevicePairingStoreRecordReadOnly, s as loadPendingDevicePairingStoreRecordReadOnly, t as DevicePairingAuthorityRefusedError, u as invalidatePairedCardRendererCache } from "./device-pairing-worker-DPa4iZOd.mjs";
import { c as loadDevicePairingStateForMutation, w as persistDevicePairingStoreState } from "./device-pairing-identity-BnU9nqx2.mjs";
//#region src/infra/device-pairing.ts
/** Return whether this Gateway has a paired client that can render progress cards. */
function hasPairedCardRenderer(baseDir) {
	const stateDir = baseDir ?? resolveStateDir();
	return readPairedCardRendererCache(stateDir, () => listDevicePairingReadOnly(stateDir).then(({ paired }) => paired.some(isProgressCardRendererClient)).catch(() => false));
}
/** Boot/Doctor migrations retain their synchronous snapshot transaction under the pairing lock. */
async function withPairedDeviceRecords(baseDir, operate) {
	return await withDevicePairingLock(async () => {
		const state = loadDevicePairingStateForMutation(Date.now(), baseDir);
		const outcome = await operate(state.pairedByDeviceId);
		if (outcome.persist) {
			persistDevicePairingStoreState(state, baseDir, "paired");
			invalidatePairedCardRendererCache();
		}
		return outcome.value;
	});
}
function listDevicePairing(baseDir) {
	return listDevicePairingStoreRecordsReadOnly(baseDir, true);
}
/** List pairing state without creating or migrating shared state. */
function listDevicePairingReadOnly(baseDir) {
	return listDevicePairingStoreRecordsReadOnly(baseDir);
}
function getPairedDevice(deviceId, baseDir) {
	return loadPairedDevicePairingStoreRecordReadOnly(deviceId, baseDir);
}
function getPendingDevicePairing(requestId, baseDir) {
	return loadPendingDevicePairingStoreRecordReadOnly(requestId, baseDir);
}
async function requestDevicePairing(req, baseDir) {
	return await withDevicePairingLock(() => executeDevicePairingMutation({
		type: "devicePairing.request",
		input: {
			request: req,
			nowMs: Date.now()
		}
	}, { baseDir }));
}
async function rejectDevicePairing(requestId, baseDir) {
	return await withDevicePairingLock(() => executeDevicePairingMutation({
		type: "devicePairing.reject",
		input: {
			requestId,
			nowMs: Date.now()
		}
	}, { baseDir }));
}
async function removePairedDevice(deviceId, baseDir) {
	return await withDevicePairingLock(() => executeDevicePairingMutation({
		type: "devicePairing.remove",
		input: {
			deviceId,
			nowMs: Date.now()
		}
	}, { baseDir }));
}
async function pruneSupersededSilentPairedDevices(params) {
	return await withDevicePairingLock(async () => {
		const protectedDeviceIds = params.isDeviceConnected ? (await listDevicePairing(params.baseDir)).paired.filter((device) => params.isDeviceConnected?.(device.deviceId)).map((device) => device.deviceId) : [];
		try {
			return await executeDevicePairingMutation({
				type: "devicePairing.pruneSilent",
				input: {
					deviceId: params.deviceId,
					protectedDeviceIds,
					nowMs: params.nowMs ?? Date.now()
				}
			}, {
				baseDir: params.baseDir,
				admit: (facts) => {
					if (facts.kind === "pairing-prune" && facts.deviceIds.some((deviceId) => params.isDeviceConnected?.(deviceId))) throw new DevicePairingAuthorityRefusedError("Pairing prune candidate connected before commit");
				}
			});
		} catch (error) {
			if (error instanceof DevicePairingAuthorityRefusedError) return [];
			throw error;
		}
	});
}
async function removePairedDeviceRole(params) {
	return await withDevicePairingLock(() => executeDevicePairingMutation({
		type: "devicePairing.removeRole",
		input: {
			deviceId: params.deviceId,
			role: params.role,
			nowMs: Date.now()
		}
	}, { baseDir: params.baseDir }));
}
async function updatePairedDeviceMetadata(deviceId, patch, baseDir) {
	return await withDevicePairingLock(() => executeDevicePairingMutation({
		type: "devicePairing.updateMetadata",
		input: {
			deviceId,
			patch,
			nowMs: Date.now()
		}
	}, { baseDir }));
}
async function updatePairedDevicePresence(deviceId, patch, expectedPairingGeneration, baseDir) {
	return await executeDevicePairingMutation({
		type: "devicePairing.updatePresence",
		input: {
			deviceId,
			patch,
			expectedPairingGeneration
		}
	}, { baseDir });
}
//#endregion
export { listDevicePairingReadOnly as a, removePairedDevice as c, updatePairedDeviceMetadata as d, updatePairedDevicePresence as f, listDevicePairing as i, removePairedDeviceRole as l, getPendingDevicePairing as n, pruneSupersededSilentPairedDevices as o, withPairedDeviceRecords as p, hasPairedCardRenderer as r, rejectDevicePairing as s, getPairedDevice as t, requestDevicePairing as u };
