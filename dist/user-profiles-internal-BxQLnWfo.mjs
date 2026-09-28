import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { c as prepareSqliteQueryTakeFirstSync, d as expressionBuilder, i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { i as stageSqliteTransactionState } from "./sqlite-post-commit-DJbkHzN8.mjs";
import { i as tableHasColumn, t as ensureColumn } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { v as registerOpenClawStateDatabaseLifecycleListener } from "./openclaw-state-db-cache-Ci98mtX8.mjs";
import { n as registerListener, t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
import { t as sessionChanges } from "./session-row-changes-xuu0eHng.mjs";
import { c as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { i as USER_PROFILE_AVATAR_MIME_TYPES } from "./avatar-limits-2506OuP3.mjs";
import { a as generateSecureUuid } from "./secure-random-BJtJxP9Y.mjs";
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
function authorityStore(identity) {
	let store = changes.authorityStores.get(identity.key);
	if (!store) {
		store = {
			revision: {},
			identityRevision: {},
			profiles: /* @__PURE__ */ new Map(),
			profileIdentities: /* @__PURE__ */ new Map(),
			channelIdentities: /* @__PURE__ */ new Map(),
			pending: /* @__PURE__ */ new Map(),
			uncertain: /* @__PURE__ */ new Set()
		};
		changes.authorityStores.set(identity.key, store);
	}
	return store;
}
function observeAuthorityLifecycle() {
	if (changes.authorityLifecycleRegistered) return;
	changes.authorityLifecycleRegistered = true;
	registerOpenClawStateDatabaseLifecycleListener((event) => {
		if (event.kind === "opened") changes.authorityHandles.set(event.database.db, authorityStore(event.identity));
		else if (event.identity) changes.authorityStores.delete(event.identity.key);
	});
}
/** Authority revisions belong to the profile writer, independently of display notifications. */
function publishUserProfileAuthorityChange(db, ...profileIds) {
	observeAuthorityLifecycle();
	const store = changes.authorityHandles.get(db);
	if (!store || profileIds.length === 0) return;
	const commit = () => {
		store.revision = {};
		for (const profileId of profileIds) store.profiles.set(profileId, {});
	};
	if (!stageSqliteTransactionState(db, {
		stage: () => {},
		rollback: () => {},
		commit
	})) commit();
}
/** Only changed merge pointers invalidate account selection; roles and login grants do not. */
function publishUserProfileIdentityChange(db, ...profileIds) {
	observeAuthorityLifecycle();
	const store = changes.authorityHandles.get(db);
	if (!store || profileIds.length === 0) return;
	const commit = () => {
		store.identityRevision = {};
		for (const profileId of profileIds) store.profileIdentities.set(profileId, {});
	};
	if (!stageSqliteTransactionState(db, {
		stage: () => {},
		rollback: () => {},
		commit
	})) commit();
}
function publishUserChannelIdentityAuthorityChange(db, subject) {
	observeAuthorityLifecycle();
	const store = changes.authorityHandles.get(db);
	if (!store) return;
	const commit = () => {
		store.revision = {};
		store.channelIdentities.set(subject, {});
	};
	if (!stageSqliteTransactionState(db, {
		stage: () => {},
		rollback: () => {},
		commit
	})) commit();
}
const mutationKey = (kind, id) => JSON.stringify([kind, id]);
/** Close affected preparation before granting COMMIT; settlement, not delivery, reopens it. */
function fenceUserProfileMutationAuthority(admission, changed) {
	observeAuthorityLifecycle();
	admission.assertCurrent();
	const store = authorityStore(admission.identity);
	const keys = [
		...changed.profiles.map((id) => mutationKey("profile", id)),
		...changed.identities.map((id) => mutationKey("identity", id)),
		...changed.channels.map((id) => mutationKey("channel", id))
	];
	if (changed.profiles.length || changed.channels.length) store.revision = {};
	if (changed.identities.length) store.identityRevision = {};
	changed.profiles.forEach((id) => store.profiles.set(id, {}));
	changed.identities.forEach((id) => store.profileIdentities.set(id, {}));
	changed.channels.forEach((id) => store.channelIdentities.set(id, {}));
	const pending = createDeferredCore();
	for (const key of keys) {
		const entries = store.pending.get(key) ?? /* @__PURE__ */ new Set();
		store.pending.set(key, entries);
		entries.add(pending.promise);
	}
	let settled = false;
	return { settle(known) {
		if (settled) return;
		settled = true;
		for (const key of keys) {
			if (!known) store.uncertain.add(key);
			const entries = store.pending.get(key);
			entries?.delete(pending.promise);
			if (entries?.size === 0) store.pending.delete(key);
		}
		pending.resolve();
	} };
}
/** A read is qualified once; retained assertions inspect only owner-held memory. */
async function captureUserProfileAuthorityRead(admission, subject, dependency = "authority") {
	observeAuthorityLifecycle();
	const store = authorityStore(admission.identity);
	const subjectKey = subject === void 0 ? void 0 : mutationKey("channel", subject);
	const profileKind = dependency === "identity" ? "identity" : "profile";
	const pending = [];
	for (const [key, entries] of store.pending) if (key === subjectKey || key.startsWith(`["${profileKind}",`)) for (const entry of entries) pending.push(entry);
	if (pending.length) await Promise.all(pending);
	admission.assertCurrent();
	const subjectIsSettled = () => subjectKey === void 0 || !store.uncertain.has(subjectKey) && !store.pending.get(subjectKey)?.size;
	if (!subjectIsSettled()) throw new UserProfileMutationUnsettledError("pending");
	const currentRevision = () => dependency === "identity" ? store.identityRevision : store.revision;
	const profileRevisions = dependency === "identity" ? store.profileIdentities : store.profiles;
	const revision = currentRevision();
	return {
		/** Current-fact readers tolerate settled changes, but never borrow an unknown mutation. */
		assertSettled(profileIds) {
			admission.assertCurrent();
			if (changes.authorityStores.get(admission.identity.key) !== store) throw new Error("Profile authority store changed");
			for (const id of typeof profileIds === "string" ? [profileIds] : profileIds) {
				const key = mutationKey(profileKind, id);
				if (store.uncertain.has(key)) throw new UserProfileMutationUnsettledError("uncertain");
				if (store.pending.get(key)?.size) throw new UserProfileMutationUnsettledError("pending");
			}
			if (!subjectIsSettled()) throw new UserProfileMutationUnsettledError("pending");
		},
		bind(profileIds) {
			admission.assertCurrent();
			if (changes.authorityStores.get(admission.identity.key) !== store || currentRevision() !== revision || !subjectIsSettled()) return;
			const profiles = (typeof profileIds === "string" ? [profileIds] : profileIds).map((id) => ({
				id,
				key: mutationKey(profileKind, id),
				revision: profileRevisions.get(id)
			}));
			if (profiles.some(({ key }) => store.uncertain.has(key))) throw new UserProfileMutationUnsettledError("uncertain");
			if (profiles.some(({ key }) => store.pending.get(key)?.size)) return;
			const identity = subject === void 0 ? void 0 : store.channelIdentities.get(subject);
			return () => {
				try {
					admission.assertCurrent();
					return changes.authorityStores.get(admission.identity.key) === store && profiles.every((profile) => profileRevisions.get(profile.id) === profile.revision && !store.uncertain.has(profile.key) && !store.pending.get(profile.key)?.size) && (subject === void 0 || store.channelIdentities.get(subject) === identity) && subjectIsSettled();
				} catch {
					return false;
				}
			};
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
//#region src/state/user-profile-mutation.ts
/** Worker-only admission augments the existing transaction; native one-shots keep its kernel. */
function runUserProfileWriteTransaction(operation, options, transactionOptions) {
	return runOpenClawStateWriteTransaction((database) => options.mutation ? options.mutation.runTransaction(database.db, () => operation(database)) : operation(database), options, transactionOptions);
}
function isDisplayRow(value) {
	return isRecord(value) && typeof value.id === "string" && typeof value.updated_at === "number" && (value.has_avatar === 0 || value.has_avatar === 1) && [
		"display_name",
		"avatar_mime",
		"avatar_sha256",
		"merged_into"
	].every((key) => value[key] === null || typeof value[key] === "string") && (value.role === void 0 || value.role === null || typeof value.role === "string");
}
function isDisplayEntries(value) {
	return Array.isArray(value) && value.every((entry) => Array.isArray(entry) && entry.length === 2 && typeof entry[0] === "string" && (entry[1] === void 0 || isDisplayRow(entry[1]) && entry[1].id === entry[0]));
}
function isEmailBinding(value, email) {
	return value === null || isRecord(value) && value.email === email && typeof value.profileId === "string" && (value.bindingId === null || typeof value.bindingId === "string");
}
function isUserProfileMutationPublication(value) {
	return isRecord(value) && value.kind === "user-profile-mutation" && Number.isSafeInteger(value.sequence) && isRecord(value.changes) && [
		value.changes.profiles,
		value.changes.identities,
		value.changes.channels
	].every((keys) => Array.isArray(keys) && keys.every((key) => typeof key === "string")) && isDisplayEntries(value.before) && isDisplayEntries(value.after) && Array.isArray(value.emailBindings) && value.emailBindings.every((change) => isRecord(change) && typeof change.email === "string" && isEmailBinding(change.before, change.email) && isEmailBinding(change.after, change.email));
}
//#endregion
//#region src/state/user-profiles-schema.ts
const USER_PROFILES_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS user_profiles (
  id TEXT NOT NULL PRIMARY KEY,
  display_name TEXT,
  primary_github_account_id INTEGER,
  avatar BLOB,
  avatar_mime TEXT,
  avatar_sha256 TEXT,
  merged_into TEXT,
  role TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS user_profile_emails (
  email TEXT NOT NULL PRIMARY KEY,
  profile_id TEXT NOT NULL,
  binding_id TEXT,
  created_at INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_user_profile_emails_profile_id
  ON user_profile_emails(profile_id);

CREATE TABLE IF NOT EXISTS user_profile_identities (
  provider TEXT NOT NULL,
  subject TEXT NOT NULL,
  profile_id TEXT NOT NULL,
  canonical_login TEXT,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (provider, subject)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_user_profile_identities_profile_id
  ON user_profile_identities(profile_id);
`;
var UserProfileNotFoundError = class extends Error {
	constructor(profileId) {
		super(`user profile not found: ${profileId}`);
		this.profileId = profileId;
		this.name = "UserProfileNotFoundError";
	}
};
var UserProfileOwnerError = class extends Error {
	constructor(code) {
		super(code === "repair-required" ? "the shared owner profile requires repair; run openclaw doctor --fix and reconnect" : code === "merge" ? "the shared owner profile cannot be merged; sign in with a personal identity instead" : "the shared owner profile is not governed by operator roles");
		this.code = code;
		this.name = "UserProfileOwnerError";
	}
};
const ensuredDatabases = /* @__PURE__ */ new WeakSet();
const roleEnsuredDatabases = /* @__PURE__ */ new WeakSet();
function rememberEnsuredSchema(database, cache) {
	if (cache.has(database)) return;
	const remember = () => {
		cache.add(database);
	};
	if (!stageSqliteTransactionState(database, {
		stage: remember,
		rollback: () => {
			cache.delete(database);
		},
		commit: remember
	})) remember();
}
function ensureUserProfilesSchema(options, database = openOpenClawStateDatabase(options)) {
	if (ensuredDatabases.has(database.db)) return;
	let hasRoleColumn = false;
	runUserProfileWriteTransaction(({ db }) => {
		db.exec(USER_PROFILES_SCHEMA_SQL);
		ensureColumn(db, "user_profile_identities", "canonical_login TEXT");
		ensureColumn(db, "user_profiles", "primary_github_account_id INTEGER");
		ensureColumn(db, "user_profile_emails", "binding_id TEXT");
		const kysely = getNodeSqliteKysely(db);
		const unboundEmails = executeSqliteQuerySync(db, kysely.selectFrom("user_profile_emails").select(["email", "profile_id"]).where("binding_id", "is", null)).rows;
		const profiles = [...new Set(unboundEmails.map((row) => row.profile_id))];
		options.mutation?.before(db, ...profiles);
		for (const { email, profile_id } of unboundEmails) {
			const bindingId = generateSecureUuid();
			executeSqliteQuerySync(db, kysely.updateTable("user_profile_emails").set({ binding_id: bindingId }).where("email", "=", email).where("binding_id", "is", null));
			stageUserProfileEmailBindingChange(db, email, {
				email,
				profileId: profile_id,
				bindingId
			});
		}
		options.mutation?.publish(...profiles);
		hasRoleColumn = tableHasColumn(db, "user_profiles", "role");
	}, options, { operationLabel: "user-profiles.schema.ensure" });
	rememberEnsuredSchema(database.db, ensuredDatabases);
	if (hasRoleColumn) rememberEnsuredSchema(database.db, roleEnsuredDatabases);
}
function ensureUserProfileRoleSchema(options, database = openOpenClawStateDatabase(options)) {
	if (roleEnsuredDatabases.has(database.db)) return;
	ensureUserProfilesSchema(options, database);
	if (roleEnsuredDatabases.has(database.db)) return;
	runOpenClawStateWriteTransaction(({ db }) => ensureColumn(db, "user_profiles", "role TEXT"), options, { operationLabel: "user-profiles.role.schema.ensure" });
	rememberEnsuredSchema(database.db, roleEnsuredDatabases);
}
function hasEnsuredUserProfileRoleSchema(database) {
	return roleEnsuredDatabases.has(database);
}
//#endregion
//#region src/state/user-profiles-internal.ts
const metadataReaders = /* @__PURE__ */ new WeakMap();
function insertUserProfile(db, displayName, now, mutation) {
	const row = {
		id: generateSecureUuid(),
		display_name: displayName,
		avatar: null,
		avatar_mime: null,
		avatar_sha256: null,
		merged_into: null,
		created_at: now,
		updated_at: now
	};
	mutation?.before(db, row.id);
	executeSqliteQuerySync(db, userProfilesDb(db).insertInto("user_profiles").values(row));
	return row;
}
function toUserProfile(row) {
	return {
		id: row.id,
		displayName: row.display_name,
		avatarMime: normalizeUserProfileAvatarMime(row.avatar_mime),
		mergedInto: row.merged_into,
		...row.role ? { role: row.role } : {},
		createdAt: row.created_at,
		updatedAt: row.updated_at
	};
}
const userProfileAvatarPresence = expressionBuilder()("avatar", "is not", null).as("has_avatar");
function userProfilesDb(db) {
	return getNodeSqliteKysely(db);
}
/** Keep each exact binding and its profile's email projection in the same committed update. */
function applyUserProfileEmailBinding(bindings, email, binding) {
	const previous = bindings.byEmail.get(email);
	if (previous) {
		if (previous.bindingId) bindings.byId.delete(previous.bindingId);
		const emails = bindings.emailsByProfile.get(previous.profileId);
		emails?.delete(email);
		if (emails?.size === 0) bindings.emailsByProfile.delete(previous.profileId);
	}
	if (binding) {
		bindings.byEmail.set(email, binding);
		if (binding.bindingId) bindings.byId.set(binding.bindingId, binding.profileId);
		const emails = bindings.emailsByProfile.get(binding.profileId) ?? /* @__PURE__ */ new Set();
		emails.add(email);
		bindings.emailsByProfile.set(binding.profileId, emails);
	} else bindings.byEmail.delete(email);
	return previous?.profileId;
}
/** A binding survives same-owner refreshes; an actual transfer starts a new lifetime. */
function setUserProfileEmailBinding(db, email, profileId, now) {
	const bindingId = generateSecureUuid();
	if (executeSqliteQuerySync(db, userProfilesDb(db).insertInto("user_profile_emails").values({
		email,
		profile_id: profileId,
		binding_id: bindingId,
		created_at: now
	}).onConflict((conflict) => conflict.column("email").doUpdateSet({
		profile_id: profileId,
		binding_id: bindingId
	}).where("user_profile_emails.profile_id", "!=", profileId))).numAffectedRows === 1n) stageUserProfileEmailBindingChange(db, email, {
		email,
		profileId,
		bindingId
	});
}
const userProfileDisplaySelection = [
	"id",
	"display_name",
	"avatar_mime",
	"avatar_sha256",
	"merged_into",
	"updated_at",
	userProfileAvatarPresence
];
function selectProfileDisplayEntries(db, ids) {
	const query = userProfilesDb(db).selectFrom("user_profiles").select([...userProfileDisplaySelection, ...hasEnsuredUserProfileRoleSchema(db) || tableHasColumn(db, "user_profiles", "role") ? ["role"] : []]);
	return executeSqliteQuerySync(db, ids ? query.where("id", "in", ids) : query).rows.map((row) => [row.id, { ...row }]);
}
function normalizeUserProfileAvatarMime(value) {
	return USER_PROFILE_AVATAR_MIME_TYPES.find((candidate) => candidate === value) ?? null;
}
function selectResolvedUserProfile(db, profileId, query) {
	return readResolvedUserProfile(profileId, (id) => executeSqliteQueryTakeFirstSync(db, query.where("id", "=", id)));
}
function readResolvedUserProfile(profileId, read) {
	const profile = read(profileId);
	if (!profile?.merged_into) return profile;
	return read(profile.merged_into) ?? profile;
}
function selectResolvedUserProfileById(db, profileId) {
	return selectResolvedUserProfile(db, profileId, userProfilesDb(db).selectFrom("user_profiles").selectAll());
}
/** Keep native row validation while omitting avatar payloads from metadata reads. */
function selectResolvedUserProfileMetadataById(db, profileId) {
	if (!hasEnsuredUserProfileRoleSchema(db)) return selectResolvedUserProfileById(db, profileId);
	let read = metadataReaders.get(db);
	if (!read) {
		read = prepareSqliteQueryTakeFirstSync(db, (parameter) => userProfilesDb(db).selectFrom("user_profiles").select((eb) => [
			"id",
			"display_name",
			eb.case().when(eb.fn("typeof", ["avatar"]), "=", "blob").then(null).else(eb.ref("avatar")).end().as("avatar"),
			"avatar_mime",
			"avatar_sha256",
			"merged_into",
			"role",
			"created_at",
			"updated_at"
		]).where("id", "=", parameter((id) => id)));
		metadataReaders.set(db, read);
	}
	return readResolvedUserProfile(profileId, read);
}
function requireResolvedUserProfileMetadataById(db, profileId) {
	const profile = selectResolvedUserProfileMetadataById(db, profileId);
	if (!profile) throw new UserProfileNotFoundError(profileId);
	return profile;
}
function requireResolvedUserProfileById(db, profileId) {
	const profile = selectResolvedUserProfileById(db, profileId);
	if (!profile) throw new UserProfileNotFoundError(profileId);
	return profile;
}
function formatUserProfileAvatarEtag(sha256, mime) {
	return `"${sha256}-${mime.slice(6)}"`;
}
function getProfileAvatar(profileId, options = {}) {
	ensureUserProfilesSchema(options);
	const profile = selectResolvedUserProfileById(openOpenClawStateDatabase(options).db, profileId);
	const mime = normalizeUserProfileAvatarMime(profile?.avatar_mime ?? null);
	return profile?.avatar && mime && profile.avatar_sha256 ? {
		bytes: profile.avatar,
		mime,
		sha256: profile.avatar_sha256,
		updatedAt: profile.updated_at
	} : void 0;
}
function projectUserProfileDisplay(profile) {
	const avatarMime = normalizeUserProfileAvatarMime(profile.avatar_mime);
	return {
		id: profile.id,
		displayName: profile.display_name,
		avatarRevision: profile.avatar_sha256 && avatarMime ? `${profile.avatar_sha256}-${avatarMime.slice(6)}` : String(profile.updated_at),
		hasAvatar: profile.has_avatar === 1
	};
}
/** Prefix references navigate display rows; they never select an authentication identity. */
function matchUserProfileReference(reference, exact, readMatches) {
	if (exact !== void 0 || !/^[0-9a-f]{8,32}$/.test(reference)) return ok(exact);
	const prefix = [
		0,
		8,
		12,
		16,
		20
	].map((start, index, offsets) => reference.slice(start, offsets[index + 1])).filter(Boolean).join("-");
	const matches = new Set(readMatches(prefix));
	return matches.size > 1 ? err("ambiguous") : ok(matches.values().next().value);
}
function resolveCatalogProfile(rows, id) {
	const raw = rows.get(id);
	return rows.get(raw?.merged_into ?? id) ?? raw;
}
/** Project exact identity facts from the catalogue owner's current rows. */
function projectCatalogUserProfileIdentity(resident, profileId) {
	const profile = resolveCatalogProfile(resident, profileId);
	return profile && {
		profileId: profile.id,
		role: profile.role ?? null,
		aliases: new Set([...resident.values()].filter((row) => row.id === profile.id || row.merged_into === profile.id).map((row) => row.id))
	};
}
//#endregion
export { emitUserProfilesChanged as A, readUserProfileVersion as B, ensureUserProfileRoleSchema as C, runUserProfileWriteTransaction as D, isUserProfileMutationPublication as E, publishUserProfileAliasChange as F, publishUserProfileAuthorityChange as I, publishUserProfileIdentityChange as L, onUserProfileEmailBindingChanged as M, onUserProfilesChanged as N, UserProfileMutationUnsettledError as O, publishUserChannelIdentityAuthorityChange as P, readUserProfileAliasRevision as R, UserProfileOwnerError as S, hasEnsuredUserProfileRoleSchema as T, stageUserProfileEmailBindingChange as V, toUserProfile as _, matchUserProfileReference as a, userProfilesDb as b, projectUserProfileDisplay as c, resolveCatalogProfile as d, selectProfileDisplayEntries as f, setUserProfileEmailBinding as g, selectResolvedUserProfileMetadataById as h, insertUserProfile as i, fenceUserProfileMutationAuthority as j, captureUserProfileAuthorityRead as k, requireResolvedUserProfileById as l, selectResolvedUserProfileById as m, formatUserProfileAvatarEtag as n, normalizeUserProfileAvatarMime as o, selectResolvedUserProfile as p, getProfileAvatar as r, projectCatalogUserProfileIdentity as s, applyUserProfileEmailBinding as t, requireResolvedUserProfileMetadataById as u, userProfileAvatarPresence as v, ensureUserProfilesSchema as w, UserProfileNotFoundError as x, userProfileDisplaySelection as y, readUserProfileEmailBindingRevision as z };
