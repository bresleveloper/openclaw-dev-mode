import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { n as registerListener } from "./listeners-BogSNJ-R.mjs";
import { i as stageSqliteTransactionState } from "./sqlite-post-commit-CQ_AyDCk.mjs";
import { i as sha256StableValue } from "./node-crypto-BG4u3UnX.mjs";
import { y as requireOpenClawStateDatabaseIdentity } from "./openclaw-state-db-cache-BKCnj4of.mjs";
import { t as freezeJsonSnapshot } from "./immutable-data-MyNs7ITg.mjs";
import { n as sessionChanges } from "./session-row-changes-BcJIdta8.mjs";
import { f as isTerminalWorkerEnvironmentState, n as assertShape } from "./store-validation-BhdOaJpU.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { Buffer } from "node:buffer";
//#region src/gateway/worker-environments/store-commit-authority.ts
function digestWorkerEnvironmentAuthority(environment) {
	return sha256StableValue(environment ? {
		...environment,
		updatedAtMs: void 0,
		lastError: void 0
	} : null).digest;
}
function digestWorkerCredentialAuthority(credential) {
	return sha256StableValue(credential ?? null).digest;
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
function digestWorkerEnvironmentAttachmentAuthority(attachment) {
	return sha256StableValue(attachment ?? null).digest;
}
function createWorkerEnvironmentCommitAdmission(facts) {
	const environments = new Map(facts.environments.map((row) => [row.environmentId, row]));
	const credentials = new Map(facts.credentials.map((row) => [row.environmentId, row]));
	const attachments = new Map(facts.attachments.map((row) => [row.environmentId, row]));
	return facts.ids.map((environmentId) => ({
		environmentId,
		attachmentAuthority: digestWorkerEnvironmentAttachmentAuthority(attachments.get(environmentId)),
		environmentAuthority: digestWorkerEnvironmentAuthority(environments.get(environmentId)),
		credentialAuthority: digestWorkerCredentialAuthority(credentials.get(environmentId)),
		transferAuthority: encodeWorkerEnvironmentTransferAuthority(environments.get(environmentId), credentials.get(environmentId))
	}));
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
	return freezeJsonSnapshot({
		...row,
		...overlay.nodeDeviceId ? { nodeDeviceId: overlay.nodeDeviceId.value } : {},
		...overlay.updatedAtMs ? { updatedAtMs: overlay.updatedAtMs.value } : {},
		...overlay.preparation ? { preparation: overlay.preparation.value } : {},
		...overlay.lastActivatedAtMs ? { lastActivatedAtMs: overlay.lastActivatedAtMs.value } : {}
	});
}
function assertEnvironmentShape(record) {
	assertShape(record.state, record.leaseId, record.nodeDeviceId, record.sshEndpoint, record.desktop, record.bootstrapReceipt, record.attachedSessionIds);
}
const ownAdmission = new AsyncLocalStorage();
function createWorkerEnvironmentProjection() {
	const environments = /* @__PURE__ */ new Map();
	const credentials = /* @__PURE__ */ new Map();
	const attachments = /* @__PURE__ */ new Map();
	const attachmentAuthorities = /* @__PURE__ */ new Map();
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
	const assertReadable = (id, authority) => {
		assertActive();
		const mutation = pending.get(id);
		const unchanged = mutation?.[`${authority}AuthorityUnchanged`];
		if (mutation && mutation.token !== ownAdmission.getStore() && !unchanged) throw new Error(`Worker environment ${id} has an unsettled mutation; retry after it completes`);
	};
	const compare = (a, b) => a.createdAtMs - b.createdAtMs || Buffer.compare(Buffer.from(a.environmentId), Buffer.from(b.environmentId));
	const close = () => {
		active = false;
		environments.clear();
		credentials.clear();
		attachments.clear();
		attachmentAuthorities.clear();
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
			for (const { environmentId, environmentAuthority, credentialAuthority, transferAuthority, attachmentAuthority } of facts) {
				const previous = pending.get(environmentId);
				if (previous && previous.token !== token) throw new Error("Worker inventory mutation ordering was lost");
				pending.set(environmentId, {
					token,
					attachmentAuthorityUnchanged: attachmentAuthority === (attachmentAuthorities.get(environmentId) ?? digestWorkerEnvironmentAttachmentAuthority(void 0)),
					environmentAuthorityUnchanged: environmentAuthority === digestWorkerEnvironmentAuthority(environments.get(environmentId)),
					credentialAuthorityUnchanged: credentialAuthority === digestWorkerCredentialAuthority(credentials.get(environmentId)),
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
			return [...reconciliations].map(([token, recovery]) => Object.assign({ token }, recovery));
		},
		hasPendingReconciliation: () => reconciliations.size !== 0,
		release(token) {
			for (const [id, value] of pending) if (value.token === token) pending.delete(id);
			reconciliations.delete(token);
		},
		onCredentialRevoked(listener) {
			assertActive();
			return registerListener(revocationListeners, (environmentId) => listener(environmentId));
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
				attachmentAuthorities.delete(id);
				revisions.set(id, revision);
			}
			for (const [session, attachment] of attachments) if (changed.has(attachment.environmentId) && !retainedSessions.has(session)) attachments.delete(session);
			for (const row of facts.environments) if (changed.has(row.environmentId)) {
				const overlay = nativeOverlays.get(row.environmentId);
				if (overlay) {
					for (const field of nativeFields) if ((overlay[field]?.revision ?? -1) <= revision) delete overlay[field];
					if (!nativeFields.some((field) => overlay[field])) nativeOverlays.delete(row.environmentId);
				}
				environments.set(row.environmentId, overlay ? applyNativeOverlay(row, overlay) : freezeJsonSnapshot(row));
			}
			for (const id of changed) if (!environments.has(id)) nativeOverlays.delete(id);
			for (const row of facts.credentials) if (changed.has(row.environmentId)) credentials.set(row.environmentId, Object.freeze(row));
			for (const row of facts.attachments) if (changed.has(row.environmentId)) {
				attachments.set(row.sessionId, Object.freeze(row));
				attachmentAuthorities.set(row.environmentId, digestWorkerEnvironmentAttachmentAuthority(row));
			}
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
			const captured = freezeJsonSnapshot(structuredClone(patch));
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
			return [...environments.values()].filter((row) => row.preparation !== null);
		},
		hasNodeEnrollmentOwner(nodeId) {
			assertActive();
			for (const row of environments.values()) if (row.nodeDeviceId === nodeId && row.nodeSetupId !== null && !isTerminalWorkerEnvironmentState(row.state)) {
				assertReadable(row.environmentId, "environment");
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
				assertReadable(row.environmentId, "environment");
				matches += 1;
				if (matches === 2) return false;
			}
			return matches === 1;
		},
		get(id) {
			assertReadable(id, "environment");
			const record = environments.get(id);
			if (record) assertEnvironmentShape(record);
			return record;
		},
		transferOwner(id) {
			assertReadable(id, "transfer");
			const row = environments.get(id);
			if (!row) return;
			const credential = credentials.get(id);
			return {
				environment: {
					ownerEpoch: row.ownerEpoch,
					attachedSessionIds: row.attachedSessionIds,
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
			assertReadable(id, "credential");
			return credentials.get(id);
		},
		credentialByHash(hash) {
			assertActive();
			for (const row of credentials.values()) if (row.credentialHash === hash) {
				assertReadable(row.environmentId, "credential");
				return row;
			}
		},
		list(reconcile = false) {
			assertActive();
			sorted ??= freezeJsonSnapshot([...environments.values()].toSorted(compare));
			if (!reconcile) {
				sorted.forEach(assertEnvironmentShape);
				return sorted;
			}
			reconcilable ??= freezeJsonSnapshot(sorted.filter((row) => !isTerminalWorkerEnvironmentState(row.state)).toSorted((a, b) => Buffer.compare(Buffer.from(a.providerId), Buffer.from(b.providerId)) || compare(a, b)));
			reconcilable.forEach(assertEnvironmentShape);
			return reconcilable;
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
			return row;
		},
		attachments() {
			assertActive();
			return [...attachments.values()];
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
export { createWorkerEnvironmentCommitAdmission as i, reserveWorkerEnvironmentNativePublication as n, workerEnvironmentProjections as r, publishWorkerEnvironmentNativeMutation as t };
