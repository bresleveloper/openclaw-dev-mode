import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as freezeJsonSnapshot } from "./immutable-data-DqJSDH8t.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { b as registerOpenClawStateDatabaseLifecycleListener, y as registerOpenClawStateDatabaseAsyncResource } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
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
/** Native pairing writers retire the node projection after their transaction commits. */
function invalidateDevicePairingNodeSnapshot(path) {
	const publication = publications.get(path);
	if (publication) {
		publication.epoch++;
		publication.nodes = void 0;
	}
}
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
		readNodes() {
			for (const service of captured.pending) service();
			return publications.get(path) === captured && !captured.blocked && !captured.mutation && captured.complete ? captured.nodes : void 0;
		},
		fail() {
			if (publications.get(path) === captured && captured.epoch === epoch) {
				captured.blocked = true;
				captured.nodes = void 0;
			}
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
				captured.nodes = void 0;
				captured.complete = false;
			}
			if (complete) captured.rows.clear();
			captured.revision = revision;
			install(rows);
			captured.complete ||= complete;
			captured.blocked = false;
			return true;
		},
		prepareNodes(revision, paired) {
			if (publications.get(path) !== captured || captured.blocked || captured.mutation || !captured.complete || captured.revision !== revision) throw new Error("Device pairing nodes require a current worker publication");
			if (!captured.nodes) {
				const bindings = /* @__PURE__ */ new Map();
				for (const [deviceId, binding] of captured.rows) if (binding) bindings.set(deviceId, Object.freeze({ ...binding }));
				captured.nodes = Object.freeze({
					paired: freezeJsonSnapshot(paired),
					bindings
				});
			}
			return captured.nodes;
		},
		beginMutation() {
			captured.epoch++;
			const mutation = {};
			captured.mutation = mutation;
			return {
				publish(receipt) {
					if (publications.get(path) !== captured || captured.mutation !== mutation) return;
					captured.complete &&= receipt.beforeRevision === captured.revision;
					if (receipt.revision !== captured.revision) captured.nodes = void 0;
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
export { getPublishedPairedDeviceBinding as n, invalidateDevicePairingNodeSnapshot as r, captureDevicePairingPublication as t };
