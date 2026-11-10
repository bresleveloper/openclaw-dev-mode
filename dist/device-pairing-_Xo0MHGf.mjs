import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { c as isProgressCardRendererClient } from "./message-channel-DmAdWHmL.mjs";
import { a as invalidatePairedCardRendererCache, n as executeDevicePairingMutation, o as readPairedCardRendererCache, t as DevicePairingAuthorityRefusedError } from "./device-pairing-worker-DLHLJ4yt.mjs";
import { i as loadPendingDevicePairingStoreRecordReadOnly, o as withDevicePairingLock, r as loadPairedDevicePairingStoreRecordReadOnly, t as listDevicePairingStoreRecordsReadOnly } from "./device-pairing-store-readonly-Cbi-VDom.mjs";
import { u as loadDevicePairingStateForMutation, w as persistDevicePairingStoreState } from "./device-pairing-identity-BRtdqCdi.mjs";
import path from "node:path";
//#region src/infra/device-pairing-resolution.ts
const waiters = resolveGlobalSingleton(Symbol.for("openclaw.devicePairingResolutionWaiters"), () => /* @__PURE__ */ new Map());
function waitForDevicePairingResolution(request, options) {
	if (options.signal.aborted) return Promise.resolve(void 0);
	const stateDir = path.resolve(options.baseDir ?? resolveStateDir());
	const listeners = waiters.get(stateDir) ?? /* @__PURE__ */ new Set();
	waiters.set(stateDir, listeners);
	return new Promise((resolve) => {
		let timer;
		const finish = (decision) => {
			clearTimeout(timer);
			options.signal.removeEventListener("abort", abort);
			listeners.delete(waiter);
			if (listeners.size === 0) waiters.delete(stateDir);
			resolve(decision);
		};
		const abort = () => finish();
		const refresh = (expiresAtMs) => {
			clearTimeout(timer);
			timer = setTimeout(() => finish("expired"), Math.max(0, expiresAtMs - Date.now()));
			timer.unref();
		};
		const waiter = {
			...request,
			resolve: finish,
			refresh
		};
		refresh(options.expiresAtMs);
		listeners.add(waiter);
		options.signal.addEventListener("abort", abort, { once: true });
	});
}
function refreshDevicePairingResolutionWaiters(request, expiresAtMs, baseDir) {
	const listeners = waiters.get(path.resolve(baseDir ?? resolveStateDir()));
	for (const waiter of listeners ?? []) if (waiter.requestId === request.requestId && waiter.deviceId === request.deviceId) waiter.refresh(expiresAtMs);
}
function publishDevicePairingResolution(request, decision, baseDir) {
	const listeners = waiters.get(path.resolve(baseDir ?? resolveStateDir()));
	for (const waiter of listeners ?? []) if (waiter.requestId === request.requestId && waiter.deviceId === request.deviceId) waiter.resolve(decision);
}
//#endregion
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
async function requestDevicePairing(req, baseDir, onPending) {
	return await withDevicePairingLock(async () => {
		const pairing = await executeDevicePairingMutation({
			type: "devicePairing.request",
			input: {
				request: req,
				nowMs: Date.now()
			}
		}, { baseDir });
		for (const superseded of pairing.superseded ?? []) publishDevicePairingResolution(superseded, "superseded", baseDir);
		refreshDevicePairingResolutionWaiters(pairing.request, pairing.expiresAtMs, baseDir);
		onPending?.(pairing);
		return pairing;
	});
}
async function rejectDevicePairing(requestId, baseDir) {
	return await withDevicePairingLock(async () => {
		const rejected = await executeDevicePairingMutation({
			type: "devicePairing.reject",
			input: {
				requestId,
				nowMs: Date.now()
			}
		}, { baseDir });
		if (rejected) publishDevicePairingResolution(rejected, "rejected", baseDir);
		return rejected;
	});
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
		return await executeDevicePairingMutation({
			type: "devicePairing.pruneSilent",
			input: {
				deviceId: params.deviceId,
				protectedDeviceIds: params.protectedDeviceIds ?? [],
				nowMs: params.nowMs ?? Date.now()
			}
		}, {
			baseDir: params.baseDir,
			onAuthorityRefused: () => [],
			admit: (facts) => {
				if (facts.kind === "pairing-prune" && facts.deviceIds.some((deviceId) => params.isDeviceConnected?.(deviceId))) throw new DevicePairingAuthorityRefusedError("Pairing prune candidate connected before commit");
			}
		});
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
			patch
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
export { listDevicePairingReadOnly as a, removePairedDevice as c, updatePairedDeviceMetadata as d, updatePairedDevicePresence as f, waitForDevicePairingResolution as h, listDevicePairing as i, removePairedDeviceRole as l, publishDevicePairingResolution as m, getPendingDevicePairing as n, pruneSupersededSilentPairedDevices as o, withPairedDeviceRecords as p, hasPairedCardRenderer as r, rejectDevicePairing as s, getPairedDevice as t, requestDevicePairing as u };
