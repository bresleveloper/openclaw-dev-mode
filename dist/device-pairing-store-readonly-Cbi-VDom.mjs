import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { n as createAsyncLock } from "./json-files-DYmSFHoN.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { n as getActiveOpenClawStateDatabaseReadSnapshot, t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { t as captureDevicePairingPublication } from "./device-pairing-publication-Bz9OLkoc.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/infra/device-pairing-lock.ts
const owner = resolveGlobalSingleton(Symbol.for("openclaw.devicePairingLock"), () => ({
	lock: createAsyncLock(),
	current: new AsyncLocalStorage()
}));
/** Domain facades and their broker adapter share one admission interval. */
async function withDevicePairingLock(operate) {
	if (owner.current.getStore()?.active) return operate();
	return owner.lock(async () => {
		const scope = { active: true };
		try {
			return await owner.current.run(scope, operate);
		} finally {
			scope.active = false;
		}
	});
}
//#endregion
//#region src/infra/device-pairing-store-readonly.ts
async function readPairing(command, baseDir, current = false, prepareNodes = false) {
	const options = baseDir ? { env: {
		...process.env,
		OPENCLAW_STATE_DIR: baseDir
	} } : {};
	const context = captureOpenClawStateWorkerContext(options);
	const selected = {
		path: context.admission.databasePath,
		env: context.environment
	};
	const snapshot = current ? void 0 : getActiveOpenClawStateDatabaseReadSnapshot(selected);
	const read = async () => {
		const publication = captureDevicePairingPublication(context.admission);
		const nodes = prepareNodes && !snapshot ? publication.readNodes() : void 0;
		if (nodes) {
			context.admission.assertCurrent();
			return {
				reply: void 0,
				nodes
			};
		}
		let reply;
		try {
			const selectedCommand = command.type === "devicePairing.list" && !snapshot ? {
				...command,
				publishedRevision: publication.completeRevision()
			} : command;
			reply = await executeExistingOpenClawStateRead(selected, selectedCommand, { current });
		} catch (error) {
			if (!snapshot) publication.fail();
			throw error;
		}
		context.admission.assertCurrent();
		if (snapshot) return {
			reply,
			nodes: void 0
		};
		if (!publication.isCurrent()) return;
		if (reply && "bindings" in reply) publication.publish(reply.revision, reply.bindings, reply.type === "devicePairing.list");
		else if (!reply) publication.publish("missing", [], true);
		const preparedNodes = prepareNodes && (!reply || "list" in reply) ? publication.prepareNodes(reply?.revision ?? "missing", reply?.list.paired ?? []) : void 0;
		return {
			reply,
			nodes: preparedNodes
		};
	};
	const observed = await read();
	if (observed) return observed;
	return withDevicePairingLock(async () => {
		const refreshed = await read();
		if (!refreshed) throw new Error("Device pairing read publication was replaced");
		return refreshed;
	});
}
/** Current paired rows and prepared node bindings share the publication's revision and lifetime. */
async function readDevicePairingNodeSnapshot(baseDir) {
	const { nodes } = await readPairing({
		type: "devicePairing.list",
		nowMs: Date.now()
	}, baseDir, true, true);
	if (!nodes) throw new Error("Unexpected pairing node snapshot reply");
	return nodes;
}
/** Readers never create, migrate, or synchronously open the shared database. */
async function listDevicePairingStoreRecordsReadOnly(baseDir, current = false) {
	const { reply } = await readPairing({
		type: "devicePairing.list",
		nowMs: Date.now()
	}, baseDir, current);
	if (!reply) return {
		pending: [],
		paired: []
	};
	return reply.list;
}
async function loadPairedDevicePairingStoreRecordReadOnly(deviceId, baseDir) {
	const { reply } = await readPairing({
		type: "devicePairing.lookup",
		deviceId: deviceId.trim()
	}, baseDir, true);
	if (!reply) return null;
	return reply.device;
}
async function loadPendingDevicePairingStoreRecordReadOnly(requestId, baseDir) {
	const { reply } = await readPairing({
		type: "devicePairing.pending",
		requestId,
		nowMs: Date.now()
	}, baseDir, true);
	if (!reply) return null;
	return reply.pending;
}
async function loadBoundDeviceBootstrapContextReadOnly(input, baseDir) {
	const { reply } = await readPairing({
		type: "devicePairing.bootstrapContext",
		input
	}, baseDir, true);
	if (!reply) return null;
	return reply.context;
}
//#endregion
export { readDevicePairingNodeSnapshot as a, loadPendingDevicePairingStoreRecordReadOnly as i, loadBoundDeviceBootstrapContextReadOnly as n, withDevicePairingLock as o, loadPairedDevicePairingStoreRecordReadOnly as r, listDevicePairingStoreRecordsReadOnly as t };
