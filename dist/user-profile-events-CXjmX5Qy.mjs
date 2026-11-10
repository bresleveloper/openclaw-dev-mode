import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { n as registerListener, t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
import { s as stageSqliteTransactionState } from "./sqlite-post-commit-22SfWsLt.mjs";
import { i as getAdmittedSqliteSchemaFacts } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { b as registerOpenClawStateDatabaseLifecycleListener, r as captureOpenClawStateDatabaseReadAdmission, y as registerOpenClawStateDatabaseAsyncResource } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { a as sessionChanges } from "./session-row-changes-vFaNnKNM.mjs";
import { t as readProfileAuthority } from "./user-profile-authority-BGrgUb8e.mjs";
//#region src/state/user-profile-events.ts
var UserProfileMutationUnsettledError = class extends Error {
	constructor(kind) {
		super(kind === "pending" ? "Profile authority mutation has not settled" : "Profile authority mutation requires canonical recovery");
		this.name = "UserProfileMutationUnsettledError";
	}
};
const changes = {
	version: 0,
	aliasRevision: 0,
	bindingRevision: 0,
	bindingListeners: /* @__PURE__ */ new Set(),
	listeners: /* @__PURE__ */ new Set(),
	authorityStores: /* @__PURE__ */ new Map(),
	authorityHandles: /* @__PURE__ */ new WeakMap(),
	authorityLifecycleRegistered: false
};
function isAuthorityStoreCurrent(store) {
	if (store.admission.identity.key !== store.identityKey || Atomics.load(new BigInt64Array(store.lifetime.revision), 0) !== store.lifetime.epoch) {
		Atomics.store(store.generation, 0, 0);
		return false;
	}
	return changes.authorityStores.get(store.admission.coordinationKey) === store;
}
function authorityStore(admission) {
	let store = changes.authorityStores.get(admission.coordinationKey);
	if (store && !isAuthorityStoreCurrent(store)) store = void 0;
	if (!store) {
		const lifetime = admission.captureIntegrity?.()?.lifetime;
		if (!lifetime) throw new Error("Profile authority requires canonical admission lifetime");
		const generation = new Int32Array(new SharedArrayBuffer(2 * Int32Array.BYTES_PER_ELEMENT));
		Atomics.store(generation, 0, 1);
		store = {
			admission,
			identityKey: admission.identity.key,
			lifetime: {
				revision: lifetime.revision,
				epoch: lifetime.epoch
			},
			generation,
			revision: 0,
			identityRevision: 0,
			profiles: /* @__PURE__ */ new Map(),
			profileIdentities: /* @__PURE__ */ new Map(),
			modelAccountLinks: /* @__PURE__ */ new Map(),
			channelIdentities: /* @__PURE__ */ new Map(),
			pending: /* @__PURE__ */ new Map()
		};
		changes.authorityStores.set(admission.coordinationKey, store);
	}
	return store;
}
function retireAuthorityStores(identityKey) {
	for (const [key, store] of changes.authorityStores) if (!identityKey || store.admission.identity.key === identityKey) {
		Atomics.store(store.generation, 0, 0);
		changes.authorityStores.delete(key);
	}
}
function observeAuthorityLifecycle() {
	if (changes.authorityLifecycleRegistered) return;
	changes.authorityLifecycleRegistered = true;
	registerOpenClawStateDatabaseAsyncResource({ async close(identity) {
		retireAuthorityStores(identity?.key);
	} });
	registerOpenClawStateDatabaseLifecycleListener((event) => {
		if (event.kind === "opened") changes.authorityHandles.set(event.database.db, authorityStore(captureOpenClawStateDatabaseReadAdmission(event.database.path)));
		else if (event.identity) retireAuthorityStores(event.identity.key);
	});
}
function authorityCell(store, kind, id) {
	let cell = store[kind].get(id);
	if (!cell) {
		cell = new Int32Array(new SharedArrayBuffer(2 * Int32Array.BYTES_PER_ELEMENT));
		store[kind].set(id, cell);
	}
	return cell;
}
function updateAuthorityStore(store, update) {
	if (Atomics.load(store.generation, 1) >= 2147483644) {
		Atomics.store(store.generation, 0, 0);
		return;
	}
	Atomics.add(store.generation, 1, 1);
	try {
		update();
	} finally {
		Atomics.add(store.generation, 1, 1);
	}
}
function advanceAuthorityCell(store, cell) {
	if (Atomics.load(cell, 0) === 2147483647) Atomics.store(store.generation, 0, 0);
	else Atomics.add(cell, 0, 1);
}
function authorityDescriptor(store, cells, bound = false) {
	return {
		generation: store.generation.buffer,
		lifetime: store.lifetime,
		entries: cells.map((cell) => ({
			state: cell.buffer,
			...bound ? { revision: Atomics.load(cell, 0) } : {}
		}))
	};
}
function authorityBinding(admission, store, descriptor) {
	return Object.assign(() => {
		try {
			admission.assertCurrent();
			return isAuthorityStoreCurrent(store) && readProfileAuthority(descriptor) === "current";
		} catch {
			return false;
		}
	}, { transferable: descriptor });
}
/** Authority revisions belong to the profile writer, independently of display notifications. */
function publishUserProfileAuthorityChange(db, ...profileIds) {
	const schema = profileIds.length ? getAdmittedSqliteSchemaFacts(db) : void 0;
	if (profileIds.length && !schema) throw new Error("Profile authority mutation requires admitted schema facts");
	if (schema && schema.userVersion >= 19 && schema.tables.has("user_profile_identities")) executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("user_profile_identities").set({
		authorization_id: null,
		authorization_basis_json: null
	}).where("profile_id", "in", profileIds));
	publishAuthorityStoreChange(db, "profiles", profileIds);
}
/** Only changed merge pointers invalidate account selection; roles and login grants do not. */
function publishUserProfileIdentityChange(db, ...profileIds) {
	publishAuthorityStoreChange(db, "profileIdentities", profileIds);
}
/** Default-link changes do not revoke explicit selections or saved session account pins. */
function publishUserProfileModelAccountLinksChange(db, ...profileIds) {
	publishAuthorityStoreChange(db, "modelAccountLinks", profileIds);
}
/** A retained catalog assertion consumes only the canonical writer’s committed facts. */
function captureUserProfileModelAccountLinksAuthority(admission, profileId) {
	observeAuthorityLifecycle();
	admission.assertCurrent();
	const store = authorityStore(admission);
	return authorityBinding(admission, store, authorityDescriptor(store, [
		authorityCell(store, "modelAccountLinks", profileId),
		authorityCell(store, "profileIdentities", profileId),
		authorityCell(store, "profiles", profileId)
	], true));
}
const mutationKey = (kind, id) => JSON.stringify([kind, id]);
function fenceAuthorityEntries(store, entries, advance) {
	const pending = createDeferredCore();
	updateAuthorityStore(store, () => {
		for (const { key, cell } of entries) {
			if (advance) advanceAuthorityCell(store, cell);
			if (Atomics.load(cell, 1) !== 2) Atomics.store(cell, 1, 1);
			const mutations = store.pending.get(key) ?? /* @__PURE__ */ new Set();
			store.pending.set(key, mutations);
			mutations.add(pending.promise);
		}
	});
	let settled = false;
	return { settle(known) {
		if (settled) return;
		settled = true;
		updateAuthorityStore(store, () => {
			for (const { key, cell } of entries) {
				const mutations = store.pending.get(key);
				mutations?.delete(pending.promise);
				if (mutations?.size === 0) store.pending.delete(key);
				if (!known) Atomics.store(cell, 1, 2);
				else if (Atomics.load(cell, 1) !== 2) Atomics.store(cell, 1, mutations?.size ? 1 : 0);
			}
		});
		pending.resolve();
	} };
}
/** Fence link readers until the original worker's native outcome is acknowledged. */
function fenceUserProfileModelAccountLinks(admission, profileId) {
	observeAuthorityLifecycle();
	admission.assertCurrent();
	const store = authorityStore(admission);
	const cell = authorityCell(store, "modelAccountLinks", profileId);
	const fence = fenceAuthorityEntries(store, [{
		key: mutationKey("modelAccountLinks", profileId),
		cell
	}], true);
	let settled = false;
	return { settle(known) {
		if (settled) return;
		settled = true;
		updateAuthorityStore(store, () => advanceAuthorityCell(store, cell));
		fence.settle(known);
	} };
}
function publishUserChannelIdentityAuthorityChange(db, subject) {
	publishAuthorityStoreChange(db, "channelIdentities", [subject]);
}
function publishAuthorityStoreChange(db, kind, ids) {
	observeAuthorityLifecycle();
	const store = changes.authorityHandles.get(db);
	if (!store || ids.length === 0) return;
	const mutationKind = {
		profiles: "profile",
		profileIdentities: "identity",
		channelIdentities: "channel",
		modelAccountLinks: "modelAccountLinks"
	};
	const entries = ids.map((id) => ({
		key: mutationKey(mutationKind[kind], id),
		cell: authorityCell(store, kind, id)
	}));
	let fence;
	const commit = () => {
		updateAuthorityStore(store, () => {
			if (kind === "profileIdentities") store.identityRevision += 1;
			else if (kind !== "modelAccountLinks") store.revision += 1;
			for (const { cell } of entries) advanceAuthorityCell(store, cell);
		});
		fence?.settle(true);
	};
	if (!stageSqliteTransactionState(db, {
		stage: () => {},
		prepareCommit: () => {
			fence ??= fenceAuthorityEntries(store, entries, false);
		},
		invalidate: () => fence?.settle(false),
		rollback: () => fence?.settle(true),
		commit
	})) throw new Error("Profile authority publication requires a managed transaction");
}
/** Close affected preparation before granting COMMIT; settlement, not delivery, reopens it. */
function fenceUserProfileMutationAuthority(admission, changed) {
	observeAuthorityLifecycle();
	admission.assertCurrent();
	const store = authorityStore(admission);
	const entries = [
		...changed.profiles.map((id) => ({
			key: mutationKey("profile", id),
			cell: authorityCell(store, "profiles", id)
		})),
		...changed.identities.map((id) => ({
			key: mutationKey("identity", id),
			cell: authorityCell(store, "profileIdentities", id)
		})),
		...changed.channels.map((id) => ({
			key: mutationKey("channel", id),
			cell: authorityCell(store, "channelIdentities", id)
		}))
	];
	if (changed.profiles.length || changed.channels.length) store.revision += 1;
	if (changed.identities.length) store.identityRevision += 1;
	return fenceAuthorityEntries(store, entries, true);
}
/** A read is qualified once; retained assertions inspect only owner-held memory. */
async function captureUserProfileAuthorityRead(admission, subject, dependency = "authority") {
	observeAuthorityLifecycle();
	const store = authorityStore(admission);
	const subjectKey = subject === void 0 ? void 0 : mutationKey("channel", subject);
	const profileKind = dependency === "identity" ? "identity" : "profile";
	const pending = [];
	for (const [key, entries] of store.pending) if (key === subjectKey || key.startsWith(`["${profileKind}",`)) for (const entry of entries) pending.push(entry);
	if (pending.length) await Promise.all(pending);
	admission.assertCurrent();
	const subjectCell = (value) => value === void 0 ? [] : [authorityCell(store, "channelIdentities", value)];
	const subjectIsSettled = (value = subject) => readProfileAuthority(authorityDescriptor(store, subjectCell(value))) === "current";
	if (!subjectIsSettled()) throw new UserProfileMutationUnsettledError("pending");
	const currentRevision = () => dependency === "identity" ? store.identityRevision : store.revision;
	const profileRevisions = dependency === "identity" ? "profileIdentities" : "profiles";
	const profileCells = (profileIds) => (typeof profileIds === "string" ? [profileIds] : profileIds).map((id) => authorityCell(store, profileRevisions, id));
	const revision = currentRevision();
	return {
		transferSettled(profileIds, boundSubject = subject) {
			admission.assertCurrent();
			if (!isAuthorityStoreCurrent(store)) throw new Error("Profile authority store changed");
			return authorityDescriptor(store, [...profileCells(profileIds), ...subjectCell(boundSubject)]);
		},
		/** Current-fact readers tolerate settled changes, but never borrow an unknown mutation. */
		assertSettled(profileIds) {
			admission.assertCurrent();
			const status = readProfileAuthority(authorityDescriptor(store, profileCells(profileIds)));
			if (!isAuthorityStoreCurrent(store) || status === "revoked") throw new Error("Profile authority store changed");
			if (status !== "current") throw new UserProfileMutationUnsettledError(status);
			if (!subjectIsSettled()) throw new UserProfileMutationUnsettledError("pending");
		},
		bind(profileIds, boundSubject = subject) {
			admission.assertCurrent();
			if (!isAuthorityStoreCurrent(store) || currentRevision() !== revision || !subjectIsSettled()) return;
			const cells = profileCells(profileIds);
			const status = readProfileAuthority(authorityDescriptor(store, cells));
			if (status === "uncertain") throw new UserProfileMutationUnsettledError("uncertain");
			if (status !== "current" || !subjectIsSettled(boundSubject)) return;
			return authorityBinding(admission, store, authorityDescriptor(store, [...cells, ...subjectCell(boundSubject)], true));
		}
	};
}
function onUserProfileEmailBindingChanged(listener) {
	return registerListener(changes.bindingListeners, listener);
}
/** Native writer facts become visible with the commit, before profile observers. */
function stageUserProfileEmailBindingChange(db, email, binding) {
	stageSqliteTransactionState(db, {
		stage: () => {},
		rollback: () => {},
		commit: () => {
			changes.bindingRevision += 1;
			for (const listener of changes.bindingListeners) listener({
				db,
				email,
				binding
			});
		}
	});
}
function readUserProfileEmailBindingRevision() {
	return changes.bindingRevision;
}
function readUserProfileVersion() {
	return changes.version;
}
function readUserProfileAliasRevision() {
	return changes.aliasRevision;
}
/** Publish only after a committed merge/unmerge; cosmetic profile updates preserve access. */
function publishUserProfileAliasChange() {
	changes.aliasRevision += 1;
}
function onUserProfilesChanged(listener) {
	return registerListener(changes.listeners, listener);
}
/** No profile data crosses this notification; readers reapply their own visibility policy. */
function emitUserProfilesChanged() {
	changes.version += 1;
	notifyListeners(changes.listeners, void 0);
	sessionChanges.emit({
		all: true,
		scope: "profiles"
	});
}
//#endregion
export { stageUserProfileEmailBindingChange as _, fenceUserProfileModelAccountLinks as a, onUserProfilesChanged as c, publishUserProfileAuthorityChange as d, publishUserProfileIdentityChange as f, readUserProfileVersion as g, readUserProfileEmailBindingRevision as h, emitUserProfilesChanged as i, publishUserChannelIdentityAuthorityChange as l, readUserProfileAliasRevision as m, captureUserProfileAuthorityRead as n, fenceUserProfileMutationAuthority as o, publishUserProfileModelAccountLinksChange as p, captureUserProfileModelAccountLinksAuthority as r, onUserProfileEmailBindingChanged as s, UserProfileMutationUnsettledError as t, publishUserProfileAliasChange as u };
