import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { _ as registerOpenClawStateDatabaseAsyncResource, v as registerOpenClawStateDatabaseLifecycleListener } from "./openclaw-state-db-cache-Ci98mtX8.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { n as getActiveOpenClawStateDatabaseReadSnapshot, t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { n as createAsyncLock } from "./json-files-C0HSMh2Z.mjs";
import { t as sessionChanges } from "./session-row-changes-xuu0eHng.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-CG5jL3tH.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-YAl4mP45.mjs";
import { n as reserveWorkerEnvironmentNativePublication } from "./store-native-publication-DNMm5oc5.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/infra/device-pairing-card-renderer.ts
let pairedCardRendererCache;
function invalidatePairedCardRendererCache() {
	pairedCardRendererCache = void 0;
}
/** The pairing publication owner invalidates this projection after committed mutations. */
function readPairedCardRendererCache(stateDir, load) {
	if (pairedCardRendererCache?.stateDir !== stateDir) pairedCardRendererCache = {
		stateDir,
		value: load()
	};
	return pairedCardRendererCache.value;
}
//#endregion
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
			if (captured.revision !== revision) captured.epoch++;
			if (complete || captured.revision !== revision) {
				captured.rows.clear();
				captured.complete = false;
			}
			captured.revision = revision;
			install(rows);
			captured.complete ||= complete;
			captured.blocked = false;
			return true;
		},
		beginMutation() {
			captured.epoch++;
			captured.blocked = true;
			const mutation = {};
			captured.mutation = mutation;
			return {
				publish(receipt) {
					if (publications.get(path) !== captured || captured.mutation !== mutation) return;
					if (receipt.beforeRevision !== captured.revision) {
						captured.complete = false;
						captured.rows.clear();
					}
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
					}
				}
			};
		},
		servicePending(service) {
			captured.pending.add(service);
			return () => captured.pending.delete(service);
		}
	};
}
/** Unknown facts suppress use without declaring an otherwise live node revoked. */
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
//#region src/infra/device-pairing-worker.ts
const DevicePairingAuthorityRefusedError = resolveGlobalSingleton(Symbol.for("openclaw.devicePairingAuthorityRefusedError"), () => class extends Error {
	constructor(message = "Device pairing authority changed") {
		super(message);
	}
});
function admissionFacts(value) {
	if (!Array.isArray(value) || !value.every((entry) => isRecord(entry) && typeof entry.kind === "string")) throw new Error("Invalid pairing admission facts");
	return value;
}
function commitReceipt(value) {
	if (!isRecord(value) || value.kind !== "devicePairing" || typeof value.beforeRevision !== "string" || typeof value.revision !== "string" || !Array.isArray(value.changed) || !value.changed.every((entry) => isRecord(entry) && typeof entry.deviceId === "string" && (entry.binding === null || isRecord(entry.binding) && typeof entry.binding.identity === "string" && (entry.binding.generation === void 0 || typeof entry.binding.generation === "string")))) throw new Error("Invalid pairing commit receipt");
	let tokensReplaced;
	if (value.tokensReplaced !== void 0) {
		const replaced = value.tokensReplaced;
		if (!isRecord(replaced) || typeof replaced.deviceId !== "string" || !Array.isArray(replaced.roles) || !replaced.roles.every((role) => typeof role === "string")) throw new Error("Invalid pairing token replacement receipt");
		tokensReplaced = {
			deviceId: replaced.deviceId,
			roles: replaced.roles
		};
	}
	let workerEnvironment;
	if (value.workerEnvironment !== void 0) {
		const environment = value.workerEnvironment;
		if (!isRecord(environment) || typeof environment.environmentId !== "string" || typeof environment.nodeDeviceId !== "string" || typeof environment.updatedAtMs !== "number") throw new Error("Invalid pairing worker-environment receipt");
		workerEnvironment = {
			environmentId: environment.environmentId,
			nodeDeviceId: environment.nodeDeviceId,
			updatedAtMs: environment.updatedAtMs
		};
	}
	return {
		kind: "devicePairing",
		beforeRevision: value.beforeRevision,
		revision: value.revision,
		...tokensReplaced ? { tokensReplaced } : {},
		...workerEnvironment ? { workerEnvironment } : {},
		changed: value.changed.map((entry) => ({
			deviceId: entry.deviceId,
			binding: entry.binding === null ? null : {
				identity: entry.binding.identity,
				...entry.binding.generation === void 0 ? {} : { generation: entry.binding.generation }
			}
		}))
	};
}
function executeDevicePairingMutation(command, options = {}) {
	const context = captureOpenClawStateWorkerContext(options.baseDir ? { env: {
		...process.env,
		OPENCLAW_STATE_DIR: options.baseDir
	} } : {});
	const captured = structuredClone(command);
	return withDevicePairingLock(async () => {
		context.admission.assertCurrent();
		options.assertCurrent?.();
		const publication = captureDevicePairingPublication(context.admission);
		const mutation = publication.beginMutation();
		let admission;
		let published = false;
		let publishEnvironment;
		const install = () => {
			const committed = admission?.committed;
			if (committed && !published) {
				const receipt = commitReceipt(committed.facts);
				const environment = receipt.workerEnvironment;
				let environmentPublished = false;
				if (environment && publishEnvironment) {
					context.admission.assertCurrent();
					environmentPublished = publishEnvironment(environment.environmentId, {
						nodeDeviceId: environment.nodeDeviceId,
						updatedAtMs: environment.updatedAtMs
					});
				}
				mutation.publish(receipt);
				invalidatePairedCardRendererCache();
				published = true;
				if (environmentPublished) sessionChanges.emit({
					all: true,
					scope: "worker-environments"
				});
				if (receipt.tokensReplaced) options.onTokensReplaced?.(receipt.tokensReplaced.deviceId, receipt.tokensReplaced.roles);
			}
		};
		const removeService = publication.servicePending(install);
		try {
			return await runOpenClawStateWorkerOperation(context, async (scope) => {
				try {
					return await scope.execute(captured);
				} finally {
					install();
				}
			}, {
				assertCurrent: options.assertCurrent,
				createAdmission: () => {
					let committed = false;
					admission = createSqliteWorkerOperationAdmission((request, grant) => {
						if (committed || request.stage !== "transaction" && request.stage !== "commit") throw new Error("Pairing admission requested out of order");
						context.admission.assertCurrent();
						options.assertCurrent?.();
						for (const facts of admissionFacts(request.facts)) options.admit?.(facts);
						if (request.stage === "commit" && captured.type === "bootstrap.consume") publishEnvironment = reserveWorkerEnvironmentNativePublication(context.admission.identity);
						if (!grant()) throw new DevicePairingAuthorityRefusedError();
						committed = request.stage === "commit";
					});
					return {
						admission,
						nativeLocations: [context.admission.databasePath]
					};
				}
			});
		} finally {
			try {
				install();
			} finally {
				mutation.finish(!admission || admission.settlement?.kind === "completed");
				removeService();
			}
		}
	});
}
/** Start the privileged effect in the same interval that publishes its pairing facts. */
async function withCurrentDevicePairingSnapshot(baseDir, prepare) {
	return (await withDevicePairingLock(async () => {
		const { paired } = await listDevicePairingStoreRecordsReadOnly(baseDir, true);
		return { value: prepare(paired)?.start() };
	})).value;
}
//#endregion
export { loadBoundDeviceBootstrapContextReadOnly as a, getPublishedPairedDeviceBinding as c, readPairedCardRendererCache as d, listDevicePairingStoreRecordsReadOnly as i, withDevicePairingLock as l, executeDevicePairingMutation as n, loadPairedDevicePairingStoreRecordReadOnly as o, withCurrentDevicePairingSnapshot as r, loadPendingDevicePairingStoreRecordReadOnly as s, DevicePairingAuthorityRefusedError as t, invalidatePairedCardRendererCache as u };
