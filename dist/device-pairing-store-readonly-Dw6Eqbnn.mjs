import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { n as createAsyncLock } from "./json-files-C5mNTScg.mjs";
import { _ as registerOpenClawStateDatabaseAsyncResource, v as registerOpenClawStateDatabaseLifecycleListener } from "./openclaw-state-db-cache-BKCnj4of.mjs";
import { n as getActiveOpenClawStateDatabaseReadSnapshot, t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
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
//#region src/infra/device-pairing-publication.ts
const publications = resolveGlobalSingleton(Symbol.for("openclaw.devicePairingPublications"), () => {
	const state = /* @__PURE__ */ new Map();
	registerOpenClawStateDatabaseAsyncResource({
		phase: "after-resources",
		async close(identity) {
			for (const [path, publication] of state) if (!identity || publication.identity === identity.key || publication.canonicalPath === identity.canonicalPath) state.delete(path);
		}
	});
	registerOpenClawStateDatabaseLifecycleListener((event) => {
		if (event.kind === "opened") return;
		for (const [path, publication] of state) if (path === event.path || publication.identity === event.identity?.key) state.delete(path);
	});
	return state;
});
function captureDevicePairingPublication(admission) {
	const path = admission.databasePath;
	const { identity } = admission;
	let publication = publications.get(identity.key) ?? publications.get(identity.canonicalPath);
	if (publication && publication.identity !== identity.key) {
		for (const [alias, current] of publications) if (current === publication) publications.delete(alias);
		publication = void 0;
	}
	if (!publication) publication = {
		identity: identity.key,
		canonicalPath: identity.canonicalPath,
		epoch: 0,
		blocked: false,
		complete: false,
		rows: /* @__PURE__ */ new Map(),
		pending: /* @__PURE__ */ new Set()
	};
	publications.set(path, publication);
	publications.set(identity.canonicalPath, publication);
	publications.set(identity.key, publication);
	const captured = publication;
	const epoch = captured.epoch;
	const install = (rows) => {
		for (const row of rows) captured.rows.set(row.deviceId, row.binding ? { ...row.binding } : null);
	};
	return {
		isCurrent: () => publications.get(path) === captured && captured.epoch === epoch && !captured.mutation,
		completeRevision: () => !captured.blocked && captured.complete ? captured.revision : void 0,
		fail() {
			if (publications.get(path) === captured && captured.epoch === epoch) captured.blocked = true;
		},
		publish(revision, rows, complete = false) {
			if (publications.get(path) !== captured || captured.epoch !== epoch || captured.mutation) return false;
			if (!rows) {
				if (captured.revision !== revision || !captured.complete) throw new Error("Pairing publication cannot reuse an unknown revision");
				captured.blocked = false;
				return true;
			}
			if (captured.revision !== revision) {
				captured.epoch++;
				captured.complete = false;
			}
			if (complete) captured.rows.clear();
			captured.revision = revision;
			install(rows);
			captured.complete ||= complete;
			captured.blocked = false;
			return true;
		},
		beginMutation() {
			captured.epoch++;
			const mutation = {};
			captured.mutation = mutation;
			return {
				publish(receipt) {
					if (publications.get(path) !== captured || captured.mutation !== mutation) return;
					captured.complete &&= receipt.beforeRevision === captured.revision;
					install(receipt.changed);
					captured.revision = receipt.revision;
					captured.blocked = false;
					captured.mutation = void 0;
					captured.epoch++;
				},
				finish(settled) {
					if (settled && captured.mutation === mutation) {
						captured.mutation = void 0;
						captured.epoch++;
					} else if (!settled && captured.mutation === mutation) captured.blocked = true;
				}
			};
		},
		servicePending(service) {
			captured.pending.add(service);
			return () => captured.pending.delete(service);
		}
	};
}
/**
* Unknown facts suppress use without declaring an otherwise live node revoked.
* In-flight writes are not unknown: rows stay authoritative until COMMIT, and the pending
* services below install a committed receipt before this read. Gateway revocations also
* retire live clients directly.
*/
function getPublishedPairedDeviceBinding(deviceId, baseDir) {
	const path = resolveOpenClawStateSqlitePath(baseDir ? {
		...process.env,
		OPENCLAW_STATE_DIR: baseDir
	} : process.env);
	const publication = publications.get(path);
	for (const service of publication?.pending ?? []) service();
	if (!publication || publication.blocked || !publication.complete && !publication.rows.has(deviceId)) throw new Error("Device pairing authority requires a current worker publication");
	const binding = publication.rows.get(deviceId);
	return binding ? { ...binding } : null;
}
//#endregion
//#region src/infra/device-pairing-store-readonly.ts
async function readPairing(command, baseDir, current = false) {
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
		let reply;
		try {
			reply = await executeExistingOpenClawStateRead(selected, command.type === "devicePairing.list" && !snapshot ? {
				...command,
				publishedRevision: publication.completeRevision()
			} : command, { current });
		} catch (error) {
			if (!snapshot) publication.fail();
			throw error;
		}
		context.admission.assertCurrent();
		if (snapshot) return { reply };
		if (!publication.isCurrent()) return;
		if (reply?.ok && "bindings" in reply) publication.publish(reply.revision, reply.bindings, reply.type === "devicePairing.list");
		else if (!reply) publication.publish("missing", [], true);
		return { reply };
	};
	const observed = await read();
	if (observed) return observed.reply;
	return withDevicePairingLock(async () => {
		const refreshed = await read();
		if (!refreshed) throw new Error("Device pairing read publication was replaced");
		return refreshed.reply;
	});
}
/** Readers never create, migrate, or synchronously open the shared database. */
async function listDevicePairingStoreRecordsReadOnly(baseDir, current = false) {
	const reply = await readPairing({
		type: "devicePairing.list",
		nowMs: Date.now()
	}, baseDir, current);
	if (!reply) return {
		pending: [],
		paired: []
	};
	if (!reply.ok || reply.type !== "devicePairing.list") throw new Error("Unexpected pairing list reply");
	return reply.list;
}
async function loadPairedDevicePairingStoreRecordReadOnly(deviceId, baseDir) {
	const reply = await readPairing({
		type: "devicePairing.lookup",
		deviceId: deviceId.trim()
	}, baseDir, true);
	if (!reply) return null;
	if (!reply.ok || reply.type !== "devicePairing.lookup") throw new Error("Unexpected pairing lookup reply");
	return reply.device;
}
async function loadPendingDevicePairingStoreRecordReadOnly(requestId, baseDir) {
	const reply = await readPairing({
		type: "devicePairing.pending",
		requestId,
		nowMs: Date.now()
	}, baseDir, true);
	if (!reply) return null;
	if (!reply.ok || reply.type !== "devicePairing.pending") throw new Error("Unexpected pending pairing reply");
	return reply.pending;
}
async function loadBoundDeviceBootstrapContextReadOnly(input, baseDir) {
	const reply = await readPairing({
		type: "devicePairing.bootstrapContext",
		input
	}, baseDir, true);
	if (!reply) return null;
	if (!reply.ok || reply.type !== "devicePairing.bootstrapContext") throw new Error("Unexpected bootstrap context reply");
	return reply.context;
}
//#endregion
export { captureDevicePairingPublication as a, loadPendingDevicePairingStoreRecordReadOnly as i, loadBoundDeviceBootstrapContextReadOnly as n, getPublishedPairedDeviceBinding as o, loadPairedDevicePairingStoreRecordReadOnly as r, withDevicePairingLock as s, listDevicePairingStoreRecordsReadOnly as t };
