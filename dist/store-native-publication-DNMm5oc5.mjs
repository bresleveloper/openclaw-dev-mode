import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { u as normalizeSortedUniqueTrimmedStringList } from "./string-normalization-_gRhJUDw.mjs";
import { p as isValidSecretRef } from "./ref-contract-BVi3ykLT.mjs";
import { i as stageSqliteTransactionState } from "./sqlite-post-commit-DJbkHzN8.mjs";
import { i as sha256StableValue } from "./node-crypto-Df3MIs6V.mjs";
import { y as requireOpenClawStateDatabaseIdentity } from "./openclaw-state-db-cache-Ci98mtX8.mjs";
import { t as sessionChanges } from "./session-row-changes-xuu0eHng.mjs";
import "./worker-admission-BB3C4gz4.mjs";
import "./worker-protocol-primitives-vA8IesMt.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { Buffer } from "node:buffer";
//#region src/gateway/worker-environments/state.ts
const TRANSITIONS = {
	requested: ["provisioning", "failed"],
	provisioning: [
		"bootstrapping",
		"ready",
		"draining",
		"failed"
	],
	bootstrapping: [
		"ready",
		"draining",
		"orphaned"
	],
	ready: [
		"bootstrapping",
		"attached",
		"idle",
		"draining",
		"orphaned"
	],
	attached: [
		"idle",
		"draining",
		"orphaned"
	],
	idle: [
		"bootstrapping",
		"attached",
		"draining",
		"orphaned"
	],
	draining: ["destroying", "orphaned"],
	destroying: [
		"destroyed",
		"failed",
		"orphaned"
	],
	destroyed: [],
	failed: [],
	orphaned: []
};
function parseWorkerEnvironmentState(value) {
	if (typeof value !== "string" || !Object.hasOwn(TRANSITIONS, value)) throw new Error(`Invalid persisted worker environment state: ${String(value)}`);
	return value;
}
function canTransitionWorkerEnvironment(from, to) {
	return TRANSITIONS[from].some((candidate) => candidate === to);
}
function workerEnvironmentStateRequiresLease(state) {
	return state !== "requested" && state !== "provisioning" && state !== "failed";
}
//#endregion
//#region src/gateway/worker-environments/store-commit-authority.ts
function digestWorkerEnvironmentRecordAuthority(environment, credential) {
	return sha256StableValue([environment ? {
		...environment,
		updatedAtMs: void 0,
		lastError: void 0
	} : null, credential ?? null]).digest;
}
/** Equality facts only; transfer admission still checks the current owner and capability. */
function encodeWorkerEnvironmentTransferAuthority(environment, credential) {
	return JSON.stringify([environment ? [
		environment.state,
		environment.ownerEpoch,
		environment.destroyRequestedAtMs,
		environment.attachedSessionIds
	] : null, credential ? [credential.ownerEpoch, credential.sessionId] : null]);
}
function createWorkerEnvironmentCommitAdmission(facts) {
	const environments = new Map(facts.environments.map((row) => [row.environmentId, row]));
	const credentials = new Map(facts.credentials.map((row) => [row.environmentId, row]));
	return facts.ids.map((environmentId) => ({
		environmentId,
		recordAuthority: digestWorkerEnvironmentRecordAuthority(environments.get(environmentId), credentials.get(environmentId)),
		transferAuthority: encodeWorkerEnvironmentTransferAuthority(environments.get(environmentId), credentials.get(environmentId))
	}));
}
//#endregion
//#region src/gateway/worker-environments/store-validation.ts
const TERMINAL_STATES = [
	"destroyed",
	"failed",
	"orphaned"
];
const WORKER_BUNDLE_HASH_PATTERN = /^[a-f0-9]{64}$/u;
const MAX_HOST_KEY_LENGTH = 16384;
const MAX_SSH_FALLBACK_PORTS = 10;
const WORKER_CREDENTIAL_HASH_PATTERN = /^[A-Za-z0-9_-]{43}$/u;
const OPENSSH_HOST_KEY_TYPE_PATTERN = /^(?:ssh|ecdsa-sha2|sk-(?:ssh|ecdsa-sha2))-[A-Za-z0-9@._+-]+$/u;
const OPENSSH_HOST_KEY_DATA_PATTERN = /^[A-Za-z0-9+/]+={0,2}$/u;
function requireWorkerEnvironmentString(value, field) {
	if (typeof value !== "string" || !value.trim()) throw new Error(`Worker environment ${field} must be a non-empty string`);
	return value.trim();
}
function normalizeOpenSshHostKey(value) {
	if (typeof value !== "string" || value.length > MAX_HOST_KEY_LENGTH || value.includes("\n") || value.includes("\r")) throw new Error("Worker environment SSH host key must be one OpenSSH public-key line");
	const tokens = value.trim().split(/\s+/u);
	const [algorithm, encodedKey] = tokens;
	if (tokens.length !== 2 || !algorithm || !encodedKey || !OPENSSH_HOST_KEY_TYPE_PATTERN.test(algorithm) || !OPENSSH_HOST_KEY_DATA_PATTERN.test(encodedKey) || encodedKey.length % 4 !== 0) throw new Error("Worker environment SSH host key must use OpenSSH public-key format");
	return `${algorithm} ${encodedKey}`;
}
function normalizeBootstrapReceipt(value) {
	const bundleHash = requireWorkerEnvironmentString(value.bundleHash, "bootstrap bundle hash");
	if (!WORKER_BUNDLE_HASH_PATTERN.test(bundleHash)) throw new Error("Worker environment bootstrap bundle hash must be lowercase SHA-256 hex");
	if (!Array.isArray(value.protocolFeatures)) throw new Error("Worker environment bootstrap protocol features must be an array");
	if (value.protocolFeatures.length > 64 || value.protocolFeatures.some((feature) => typeof feature !== "string" || feature.trim().length > 128)) throw new Error("Worker environment bootstrap protocol features exceed admission limits");
	if (value.installKind !== void 0 && value.installKind !== "bundle" && value.installKind !== "local") throw new Error("Worker environment bootstrap install kind is invalid");
	return {
		bundleHash,
		openclawVersion: requireWorkerEnvironmentString(value.openclawVersion, "bootstrap OpenClaw version"),
		protocolFeatures: normalizeSortedUniqueTrimmedStringList(value.protocolFeatures),
		...value.installKind ? { installKind: value.installKind } : {}
	};
}
function normalizeCredentialHash(value) {
	const credentialHash = requireWorkerEnvironmentString(value, "credential hash");
	if (!WORKER_CREDENTIAL_HASH_PATTERN.test(credentialHash)) throw new Error("Worker credential hash must be a SHA-256 base64url digest");
	return credentialHash;
}
function normalizeSessionId(value) {
	if (value === null) return null;
	const sessionId = requireWorkerEnvironmentString(value, "credential session id");
	if (sessionId.length > 256) throw new Error("Worker credential session id exceeds the admission limit");
	return sessionId;
}
function normalizeAttachedSessionIds(value) {
	const sessionIds = normalizeSortedUniqueTrimmedStringList(value);
	for (const sessionId of sessionIds) if (sessionId.length > 256) throw new Error("Worker environment attached session id exceeds the admission limit");
	return sessionIds;
}
function assertCredentialSessionBinding(attachedSessionIds, sessionId) {
	if (sessionId !== (attachedSessionIds[0] ?? null)) throw new Error("Worker credential session does not match the environment attachment");
}
function normalizeRpcSetVersion(value) {
	if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 1) throw new Error("Worker credential RPC-set version must be a positive safe integer");
	return value;
}
function normalizeExpiry(value) {
	if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) throw new Error("Worker credential expiry must be a non-negative safe integer");
	return value;
}
function normalizeWorkerSshEndpoint(value) {
	const host = requireWorkerEnvironmentString(value.host, "SSH host");
	const user = requireWorkerEnvironmentString(value.user, "SSH user");
	const hostKey = normalizeOpenSshHostKey(value.hostKey);
	if (!Number.isSafeInteger(value.port) || value.port < 1 || value.port > 65535) throw new Error("Worker environment SSH port must be an integer from 1 through 65535");
	if (!isValidSecretRef(value.keyRef)) throw new Error("Worker environment SSH key must be a canonical SecretRef");
	if (value.fallbackPorts !== void 0 && !Array.isArray(value.fallbackPorts)) throw new Error("Worker environment SSH fallback ports must be an array");
	const seen = /* @__PURE__ */ new Set([value.port]);
	const fallbackPorts = [];
	for (const port of value.fallbackPorts ?? []) {
		if (!Number.isSafeInteger(port) || port < 1 || port > 65535) throw new Error("Worker environment SSH fallback ports must be integers from 1 through 65535");
		if (!seen.has(port)) {
			seen.add(port);
			fallbackPorts.push(port);
		}
	}
	if (fallbackPorts.length > MAX_SSH_FALLBACK_PORTS) throw new Error(`Worker environment SSH fallback ports cannot exceed ${MAX_SSH_FALLBACK_PORTS}`);
	return {
		host,
		port: value.port,
		...fallbackPorts.length > 0 ? { fallbackPorts } : {},
		user,
		hostKey,
		keyRef: { ...value.keyRef }
	};
}
function assertShape(state, leaseId, nodeDeviceId, sshEndpoint, desktop, bootstrapReceipt, attachedSessionIds) {
	if (sshEndpoint && nodeDeviceId) throw new Error("Worker environment cannot retain both SSH and node transports");
	if (workerEnvironmentStateRequiresLease(state)) {
		if (!leaseId) throw new Error(`Worker environment state ${state} requires a provider lease`);
		if (state === "bootstrapping" && !sshEndpoint) throw new Error("Worker environment bootstrap requires an SSH endpoint reference");
		if (state === "ready" && !sshEndpoint && !nodeDeviceId) throw new Error("Ready worker environment requires a transport binding");
	} else if (leaseId || sshEndpoint || desktop) throw new Error(`Worker environment state ${state} cannot retain a provider lease`);
	if (state === "bootstrapping" && bootstrapReceipt) throw new Error("Bootstrapping worker environment cannot retain a stale bootstrap receipt");
	if (state === "attached" && attachedSessionIds.length !== 1) throw new Error("Attached worker environment requires exactly one session id");
	if (state !== "attached" && attachedSessionIds.length !== 0) throw new Error("Only an attached worker environment may retain a session id");
}
//#endregion
//#region src/gateway/worker-environments/store-projection.ts
const nativeFields = [
	"nodeDeviceId",
	"updatedAtMs",
	"preparation",
	"lastActivatedAtMs"
];
function nativeField(previous, value, revision) {
	return value !== void 0 && revision > (previous?.revision ?? -1) ? {
		revision,
		value
	} : previous;
}
function applyNativeOverlay(row, overlay) {
	return {
		...row,
		...overlay.nodeDeviceId ? { nodeDeviceId: overlay.nodeDeviceId.value } : {},
		...overlay.updatedAtMs ? { updatedAtMs: overlay.updatedAtMs.value } : {},
		...overlay.preparation ? { preparation: overlay.preparation.value } : {},
		...overlay.lastActivatedAtMs ? { lastActivatedAtMs: overlay.lastActivatedAtMs.value } : {}
	};
}
function assertEnvironmentShape(record) {
	assertShape(record.state, record.leaseId, record.nodeDeviceId, record.sshEndpoint, record.desktop, record.bootstrapReceipt, record.attachedSessionIds);
}
const ownAdmission = new AsyncLocalStorage();
function createWorkerEnvironmentProjection() {
	const environments = /* @__PURE__ */ new Map();
	const credentials = /* @__PURE__ */ new Map();
	const attachments = /* @__PURE__ */ new Map();
	const revisions = /* @__PURE__ */ new Map();
	const nativeOverlays = /* @__PURE__ */ new Map();
	const pending = /* @__PURE__ */ new Map();
	const reconciliations = /* @__PURE__ */ new Map();
	const revocationListeners = /* @__PURE__ */ new Set();
	let sequence = 0;
	let version = 0;
	let active = true;
	let references = 0;
	let tail = Promise.resolve();
	let sorted;
	let reconcilable;
	const assertActive = () => {
		if (!active) throw new Error("Worker environment inventory has closed");
	};
	const assertReadable = (id, authority = "record") => {
		assertActive();
		const mutation = pending.get(id);
		const unchanged = authority !== "attachment" && mutation?.[`${authority}AuthorityUnchanged`];
		if (mutation && mutation.token !== ownAdmission.getStore() && !unchanged) throw new Error(`Worker environment ${id} has an unsettled mutation; retry after it completes`);
	};
	const compare = (a, b) => a.createdAtMs - b.createdAtMs || Buffer.compare(Buffer.from(a.environmentId), Buffer.from(b.environmentId));
	const close = () => {
		active = false;
		environments.clear();
		credentials.clear();
		attachments.clear();
		revisions.clear();
		nativeOverlays.clear();
		pending.clear();
		reconciliations.clear();
		revocationListeners.clear();
		sorted = void 0;
		reconcilable = void 0;
	};
	return {
		get active() {
			return active;
		},
		version: () => version,
		retain() {
			assertActive();
			references += 1;
			let released = false;
			return () => {
				if (released) return false;
				released = true;
				references -= 1;
				if (references !== 0) return false;
				close();
				return true;
			};
		},
		enqueue(operation) {
			assertActive();
			const result = tail.then(operation);
			tail = result.then(() => {}, () => {});
			return result;
		},
		async ready() {
			for (;;) {
				const current = tail;
				await current;
				assertActive();
				if (current === tail) return;
			}
		},
		nextSequence: () => ++sequence,
		withAdmission(token, callback) {
			return ownAdmission.run(token, callback);
		},
		fence(facts, token) {
			assertActive();
			for (const { environmentId, recordAuthority, transferAuthority } of facts) {
				const previous = pending.get(environmentId);
				if (previous && previous.token !== token) throw new Error("Worker inventory mutation ordering was lost");
				pending.set(environmentId, {
					token,
					recordAuthorityUnchanged: recordAuthority === digestWorkerEnvironmentRecordAuthority(environments.get(environmentId), credentials.get(environmentId)),
					transferAuthorityUnchanged: transferAuthority === encodeWorkerEnvironmentTransferAuthority(environments.get(environmentId), credentials.get(environmentId))
				});
			}
		},
		retainReconciliation(token, ids, error, revocationId) {
			assertActive();
			reconciliations.set(token, {
				ids: [...ids],
				error,
				revocationId
			});
		},
		pendingReconciliations() {
			assertActive();
			return [...reconciliations].map(([token, recovery]) => ({
				token,
				ids: recovery.ids,
				error: recovery.error,
				revocationId: recovery.revocationId
			}));
		},
		hasPendingReconciliation: () => reconciliations.size !== 0,
		release(token) {
			for (const [id, value] of pending) if (value.token === token) pending.delete(id);
			reconciliations.delete(token);
		},
		onCredentialRevoked(listener) {
			assertActive();
			const registration = (environmentId) => listener(environmentId);
			revocationListeners.add(registration);
			return () => {
				revocationListeners.delete(registration);
			};
		},
		publishCredentialRevoked(environmentId) {
			assertActive();
			for (const listener of revocationListeners) listener(environmentId);
		},
		install(facts, revision, notify = true) {
			assertActive();
			const changed = new Set(facts.ids.filter((id) => revision >= (revisions.get(id) ?? -1)));
			const retainedSessions = new Set(facts.attachments.filter((row) => changed.has(row.environmentId)).map((row) => row.sessionId));
			for (const id of changed) {
				environments.delete(id);
				credentials.delete(id);
				revisions.set(id, revision);
				for (const [session, attachment] of attachments) if (attachment.environmentId === id && !retainedSessions.has(session)) attachments.delete(session);
			}
			for (const row of facts.environments) if (changed.has(row.environmentId)) {
				const overlay = nativeOverlays.get(row.environmentId);
				if (overlay) {
					for (const field of nativeFields) if ((overlay[field]?.revision ?? -1) <= revision) delete overlay[field];
					if (!nativeFields.some((field) => overlay[field])) nativeOverlays.delete(row.environmentId);
				}
				environments.set(row.environmentId, overlay ? applyNativeOverlay(row, overlay) : row);
			}
			for (const id of changed) if (!environments.has(id)) nativeOverlays.delete(id);
			for (const row of facts.credentials) if (changed.has(row.environmentId)) credentials.set(row.environmentId, row);
			for (const row of facts.attachments) if (changed.has(row.environmentId)) attachments.set(row.sessionId, row);
			if (changed.size) {
				version += 1;
				sorted = void 0;
				reconcilable = void 0;
				if (notify) sessionChanges.emit({
					all: true,
					scope: "worker-environments"
				});
			}
		},
		publishPatch(id, patch, revision) {
			assertActive();
			if (revision <= (revisions.get(id) ?? -1)) return;
			const captured = structuredClone(patch);
			const previous = nativeOverlays.get(id);
			const overlay = {
				nodeDeviceId: nativeField(previous?.nodeDeviceId, captured.nodeDeviceId, revision),
				updatedAtMs: nativeField(previous?.updatedAtMs, captured.updatedAtMs, revision),
				preparation: nativeField(previous?.preparation, captured.preparation, revision),
				lastActivatedAtMs: nativeField(previous?.lastActivatedAtMs, captured.lastActivatedAtMs, revision)
			};
			nativeOverlays.set(id, overlay);
			const row = environments.get(id);
			if (row) environments.set(id, applyNativeOverlay(row, overlay));
			version += 1;
			sorted = void 0;
			reconcilable = void 0;
		},
		preparedRecords() {
			assertActive();
			return structuredClone([...environments.values()].filter((row) => row.preparation !== null));
		},
		hasNodeEnrollmentOwner(nodeId) {
			assertActive();
			for (const row of environments.values()) if (row.nodeDeviceId === nodeId && row.nodeSetupId !== null && ![
				"destroyed",
				"failed",
				"orphaned"
			].includes(row.state)) {
				assertReadable(row.environmentId);
				return true;
			}
			return false;
		},
		hasPendingNodeEnrollmentSetup(setup, device) {
			assertActive();
			const setupId = setup.trim();
			const deviceId = device.trim();
			if (!setupId || !deviceId) return false;
			let matches = 0;
			for (const row of environments.values()) if (row.nodeSetupId === setupId && row.destroyRequestedAtMs === null && (row.state === "provisioning" && row.nodeDeviceId === null || [
				"provisioning",
				"bootstrapping",
				"ready",
				"idle",
				"attached"
			].includes(row.state) && row.nodeDeviceId === deviceId)) {
				assertReadable(row.environmentId);
				matches += 1;
				if (matches === 2) return false;
			}
			return matches === 1;
		},
		get(id) {
			assertReadable(id);
			const record = environments.get(id);
			if (record) assertEnvironmentShape(record);
			return structuredClone(record);
		},
		transferOwner(id) {
			assertReadable(id, "transfer");
			const row = environments.get(id);
			if (!row) return;
			const credential = credentials.get(id);
			return {
				environment: {
					ownerEpoch: row.ownerEpoch,
					attachedSessionIds: [...row.attachedSessionIds],
					destroyRequestedAtMs: row.destroyRequestedAtMs,
					state: row.state
				},
				credential: credential ? {
					ownerEpoch: credential.ownerEpoch,
					expiresAtMs: credential.expiresAtMs,
					sessionId: credential.sessionId
				} : void 0
			};
		},
		credential(id) {
			assertReadable(id);
			return structuredClone(credentials.get(id));
		},
		credentialByHash(hash) {
			assertActive();
			const row = [...credentials.values()].find((entry) => entry.credentialHash === hash);
			if (row) assertReadable(row.environmentId);
			return structuredClone(row);
		},
		list(reconcile = false) {
			assertActive();
			sorted ??= [...environments.values()].toSorted(compare);
			if (!reconcile) {
				sorted.forEach(assertEnvironmentShape);
				return structuredClone(sorted);
			}
			reconcilable ??= sorted.filter((row) => ![
				"destroyed",
				"failed",
				"orphaned"
			].includes(row.state)).toSorted((a, b) => Buffer.compare(Buffer.from(a.providerId), Buffer.from(b.providerId)) || compare(a, b));
			reconcilable.forEach(assertEnvironmentShape);
			return structuredClone(reconcilable);
		},
		hasSessionAttachment(environmentId) {
			assertReadable(environmentId, "attachment");
			for (const row of attachments.values()) if (row.environmentId === environmentId) return true;
			return false;
		},
		attachment(sessionId) {
			assertActive();
			const row = attachments.get(sessionId);
			if (row) assertReadable(row.environmentId, "attachment");
			return structuredClone(row);
		},
		attachments() {
			assertActive();
			return structuredClone([...attachments.values()]);
		},
		close
	};
}
function createWorkerEnvironmentProjectionRegistry() {
	const owners = /* @__PURE__ */ new Map();
	const get = (identity) => {
		for (const [key, entry] of owners) {
			const current = entry.identity();
			if (key !== identity.key && current.key !== identity.key && !(current.key.startsWith("path:") && current.canonicalPath === identity.canonicalPath)) continue;
			if (!entry.owner.active) {
				owners.delete(key);
				return;
			}
			if (identity.key.startsWith("file:") && key !== identity.key) {
				owners.delete(key);
				owners.set(identity.key, entry);
			}
			return entry.owner;
		}
	};
	const remove = (owner) => {
		for (const [key, entry] of owners) if (entry.owner === owner) owners.delete(key);
	};
	return {
		get,
		acquire(identity) {
			const current = identity();
			const existing = get(current);
			if (existing) return existing;
			const owner = createWorkerEnvironmentProjection();
			owners.set(current.key, {
				owner,
				identity
			});
			return owner;
		},
		remove,
		invalidate(identity, pathname) {
			const owner = identity ? get(identity) : owners.get(`path:${pathname}`)?.owner;
			if (!owner) return;
			owner.close();
			remove(owner);
		},
		close() {
			for (const { owner } of owners.values()) owner.close();
			owners.clear();
		}
	};
}
const workerEnvironmentProjections = resolveGlobalSingleton(Symbol.for("openclaw.workerEnvironmentProjections"), createWorkerEnvironmentProjectionRegistry, (owners) => owners.close());
//#endregion
//#region src/gateway/worker-environments/store-native-publication.ts
/** Reserve order while the caller holds the physical writer lock or grants its worker commit. */
function reserveWorkerEnvironmentNativePublication(identity) {
	const owner = workerEnvironmentProjections.get(identity);
	if (!owner?.active) return;
	const revision = owner.nextSequence();
	return (environmentId, patch) => {
		if (!owner.active || workerEnvironmentProjections.get(identity) !== owner) return false;
		owner.publishPatch(environmentId, patch, revision);
		return true;
	};
}
/** Pairing and placement keep their atomic writes, then publish through the inventory owner. */
function publishWorkerEnvironmentNativeMutation(db, environmentId, patch) {
	const publish = reserveWorkerEnvironmentNativePublication(requireOpenClawStateDatabaseIdentity({ db }));
	if (!publish) return;
	const captured = structuredClone(patch);
	if (!stageSqliteTransactionState(db, {
		stage() {},
		rollback() {},
		commit() {
			publish(environmentId, captured);
		}
	})) throw new Error("Worker environment publication requires its owning transaction");
	sessionChanges.emit({
		all: true,
		scope: "worker-environments"
	}, db);
}
//#endregion
export { parseWorkerEnvironmentState as _, assertCredentialSessionBinding as a, normalizeBootstrapReceipt as c, normalizeRpcSetVersion as d, normalizeSessionId as f, canTransitionWorkerEnvironment as g, createWorkerEnvironmentCommitAdmission as h, TERMINAL_STATES as i, normalizeCredentialHash as l, requireWorkerEnvironmentString as m, reserveWorkerEnvironmentNativePublication as n, assertShape as o, normalizeWorkerSshEndpoint as p, workerEnvironmentProjections as r, normalizeAttachedSessionIds as s, publishWorkerEnvironmentNativeMutation as t, normalizeExpiry as u };
