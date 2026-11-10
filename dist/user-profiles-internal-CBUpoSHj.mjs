import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as isPostgresSqlConnection } from "./sql-connection-DmQzXTVz.mjs";
import { s as stageSqliteTransactionState } from "./sqlite-post-commit-22SfWsLt.mjs";
import { i as getAdmittedSqliteSchemaFacts } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, m as expressionBuilder, n as createSqliteQueryCache, o as getNodeSqliteKysely, u as prepareSqliteQueryTakeFirstSync } from "./kysely-sync-9fPQaMlh.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { a as tableExists, n as ensureColumn, o as tableHasColumn } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { r as ensureStatePostgresFragment } from "./openclaw-state-db-engine-DST3Q_pv.mjs";
import { t as GATEWAY_OWNER_PROFILE_ID } from "./user-profile-constants-DfyZS95p.mjs";
import { t as createSqliteSchemaEnsurer } from "./sqlite-schema-ensure-CwIgvH1h.mjs";
import { t as getOpenClawStateFeatureSchemaSql } from "./openclaw-state-feature-schema-CYc16G0w.mjs";
import { i as openOpenClawStateDatabase, u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { _ as stageUserProfileEmailBindingChange } from "./user-profile-events-CXjmX5Qy.mjs";
import { a as generateSecureUuid } from "./secure-random-DxCgeORs.mjs";
import { i as USER_PROFILE_AVATAR_MIME_TYPES } from "./avatar-limits-2506OuP3.mjs";
//#region src/state/user-profile-mutation.ts
/** Worker-only admission augments the existing transaction; native one-shots keep its kernel. */
function runUserProfileWriteTransaction(operation, options, transactionOptions) {
	return runOpenClawStateWriteTransaction((database) => options.mutation ? options.mutation.runTransaction(database.db, () => operation(database)) : operation(database), options, transactionOptions);
}
function isUserProfileMutationPublication(value) {
	return isRecord(value) && value.kind === "user-profile-mutation";
}
//#endregion
//#region src/state/user-profiles-schema.ts
const ensureUserProfileTables = createSqliteSchemaEnsurer(() => getOpenClawStateFeatureSchemaSql("user_profiles"), {
	tables: [
		"user_profiles",
		"user_profile_emails",
		"user_profile_identities"
	],
	indexes: ["idx_user_profile_emails_profile_id"]
});
const ensureUserProfileIdentityIndexes = createSqliteSchemaEnsurer(() => getOpenClawStateFeatureSchemaSql("user_profile_identities", { endMarker: "ON user_profile_identities(authorization_id);" }), {
	tables: ["user_profile_identities"],
	indexes: ["idx_user_profile_identities_profile_id", "idx_user_profile_identities_authorization"]
});
var UserProfileNotFoundError = class extends Error {
	constructor(profileId) {
		super(`user profile not found: ${profileId}`);
		this.profileId = profileId;
		this.name = "UserProfileNotFoundError";
	}
};
var UserProfileMergeError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "UserProfileMergeError";
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
	runUserProfileWriteTransaction(({ db }) => {
		if (isPostgresSqlConnection(db)) ensureStatePostgresFragment(db, "user_profiles");
		else ensureUserProfileTables(db);
		ensureColumn(db, "user_profile_identities", "canonical_login TEXT");
		ensureColumn(db, "user_profile_identities", "authorization_id TEXT");
		ensureColumn(db, "user_profile_identities", "authorization_basis_json TEXT");
		if (!isPostgresSqlConnection(db)) ensureUserProfileIdentityIndexes(db);
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
	}, options, { operationLabel: "user-profiles.schema.ensure" });
	rememberEnsuredSchema(database.db, ensuredDatabases);
}
function ensureUserProfileRoleSchema(options, database = openOpenClawStateDatabase(options)) {
	if (tableHasColumn(database.db, "user_profiles", "role")) return;
	ensureUserProfilesSchema(options, database);
	if (tableHasColumn(database.db, "user_profiles", "role")) return;
	runOpenClawStateWriteTransaction(({ db }) => ensureColumn(db, "user_profiles", "role TEXT"), options, { operationLabel: "user-profiles.role.schema.ensure" });
}
//#endregion
//#region src/state/user-profiles-internal.ts
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
function selectUserProfileEmailAlias(db, email) {
	return executeSqliteQueryTakeFirstSync(db, userProfilesDb(db).selectFrom("user_profile_emails").select("profile_id").where("email", "=", email));
}
function selectUserProfileEmails(db, profileId) {
	return executeSqliteQuerySync(db, userProfilesDb(db).selectFrom("user_profile_emails").select("email").where("profile_id", "=", profileId).orderBy("email", "asc")).rows.map(({ email }) => email);
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
	const query = userProfilesDb(db).selectFrom("user_profiles").select([...userProfileDisplaySelection, ...tableHasColumn(db, "user_profiles", "role") ? ["role"] : []]).select((eb) => tableExists(db, "user_profile_identities") ? eb.selectFrom("user_profile_identities").select("user_profiles.created_at").where("provider", "=", "gateway.local").where("subject", "=", "owner").whereRef("profile_id", "=", "user_profiles.id").where("user_profiles.id", "=", GATEWAY_OWNER_PROFILE_ID).$asScalar().as("gateway_owner_created_at") : eb.val(null).as("gateway_owner_created_at"));
	return executeSqliteQuerySync(db, ids ? query.where("id", "in", ids) : query).rows.map(({ gateway_owner_created_at, ...row }) => [row.id, {
		...row,
		...gateway_owner_created_at == null ? {} : { gatewayOwnerCreatedAt: gateway_owner_created_at }
	}]);
}
function normalizeUserProfileAvatarMime(value) {
	return USER_PROFILE_AVATAR_MIME_TYPES.find((candidate) => candidate === value) ?? null;
}
function selectResolvedUserProfile(db, profileId, query) {
	return readResolvedUserProfile(profileId, (id) => executeSqliteQueryTakeFirstSync(db, typeof query === "function" ? query(id) : query.where("id", "=", id)));
}
function readResolvedUserProfile(profileId, read) {
	const profile = read(profileId);
	if (!profile?.merged_into) return profile;
	return read(profile.merged_into) ?? profile;
}
function selectResolvedUserProfileById(db, profileId) {
	return selectResolvedUserProfile(db, profileId, userProfilesDb(db).selectFrom("user_profiles").selectAll());
}
const metadataReader = createSqliteQueryCache((db) => prepareSqliteQueryTakeFirstSync(db, (parameter) => userProfilesDb(db).selectFrom("user_profiles").select((eb) => [
	"id",
	"display_name",
	eb.case().when(eb.fn("typeof", ["avatar"]), "=", "blob").then(null).else(eb.ref("avatar")).end().as("avatar"),
	"avatar_mime",
	"avatar_sha256",
	"merged_into",
	"role",
	"created_at",
	"updated_at"
]).where("id", "=", parameter((id) => id))));
/** Keep native row validation while omitting avatar payloads from metadata reads. */
function selectResolvedUserProfileMetadataById(db, profileId) {
	if (!tableHasColumn(db, "user_profiles", "role")) return selectResolvedUserProfileById(db, profileId);
	return readResolvedUserProfile(profileId, metadataReader(db));
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
function selectProfileAvatarMetadata(db, profileId) {
	const schema = getAdmittedSqliteSchemaFacts(db);
	if (!schema) throw new Error("Profile avatar reads require admitted schema facts");
	if (!schema.tableSql.get("user_profiles")) return;
	return selectResolvedUserProfile(db, profileId, userProfilesDb(db).selectFrom("user_profiles").select([...userProfileDisplaySelection, "created_at"]).select((eb) => [tableHasColumn(db, "user_profiles", "role") ? "role" : eb.val(null).as("role"), eb.fn("length", ["avatar"]).as("avatar_byte_length")]));
}
function inspectProfileAvatarInDatabase(db, profileId) {
	return runSqliteDeferredTransactionSync(db, () => {
		const profile = selectProfileAvatarMetadata(db, profileId);
		const mime = normalizeUserProfileAvatarMime(profile?.avatar_mime ?? null);
		const avatar = profile?.has_avatar && mime && profile.avatar_sha256 ? {
			mime,
			sha256: profile.avatar_sha256,
			updatedAt: profile.updated_at,
			byteLength: profile.avatar_byte_length ?? 0
		} : void 0;
		return {
			profile: profile && toUserProfile(profile),
			hasAvatar: profile?.has_avatar === 1,
			avatar,
			emails: profile && !avatar ? selectUserProfileEmails(db, profile.id) : []
		};
	});
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
		githubLogin: profile.githubLogin ?? null,
		aliases: new Set([...resident.values()].filter((row) => row.id === profile.id || row.merged_into === profile.id).map((row) => row.id))
	};
}
/** Bind a canonical account and its original email lifetimes to the retained catalog owner. */
function bindPreparedUserProfileIdentity(profileId, catalog, emailTargets) {
	const { rows, bindings } = catalog;
	const initial = emailTargets === void 0 ? [...bindings.byEmail.values()].filter((binding) => binding.profileId === profileId) : [...new Set(emailTargets)].map((email) => bindings.byEmail.get(email));
	const ids = Object.freeze(initial.flatMap((binding) => binding?.bindingId ? [binding.bindingId] : []).toSorted());
	const assertCurrent = (requiredEmailBindingIds = [], requiredGithubAccountIds) => {
		catalog.assertCurrent(profileId);
		if (resolveCatalogProfile(rows, profileId)?.id !== profileId || requiredEmailBindingIds.some((id) => bindings.byId.get(id) !== profileId)) throw new UserProfileNotFoundError(profileId);
		if (requiredGithubAccountIds?.length) {
			const accounts = new Set(rows.get(profileId)?.githubAccountIds);
			if (requiredGithubAccountIds.some((accountId) => !accounts.has(accountId))) throw new UserProfileNotFoundError(profileId);
		}
	};
	function readCurrentProfile(requiredEmailBindingIds, requiredGithubAccountIds) {
		assertCurrent(requiredEmailBindingIds, requiredGithubAccountIds);
		return {
			profileId,
			assignedRole: rows.get(profileId)?.role || null,
			githubLogin: rows.get(profileId)?.githubLogin ?? null
		};
	}
	return {
		readCurrentProfile,
		get emailBindingIds() {
			assertCurrent();
			if (initial.some((binding) => !binding || binding.profileId !== profileId || binding.bindingId === null)) throw new UserProfileNotFoundError(profileId);
			return ids;
		},
		readCurrentFacts(requiredEmailBindingIds) {
			const profile = readCurrentProfile(requiredEmailBindingIds);
			const githubAccountIds = rows.get(profileId)?.githubAccountIds;
			const aliases = /* @__PURE__ */ new Set([profileId]);
			for (const row of rows.values()) if (row.merged_into === profileId) aliases.add(row.id);
			return {
				profile: {
					profileId: profile.profileId,
					emails: [...bindings.emailsByProfile.get(profileId) ?? []].toSorted(),
					...githubAccountIds ? { githubAccountIds: [...githubAccountIds] } : {},
					assignedRole: profile.assignedRole,
					githubLogin: profile.githubLogin
				},
				aliases
			};
		},
		release: catalog.release
	};
}
//#endregion
export { UserProfileMergeError as C, ensureUserProfilesSchema as D, ensureUserProfileRoleSchema as E, isUserProfileMutationPublication as O, userProfilesDb as S, UserProfileOwnerError as T, selectUserProfileEmails as _, inspectProfileAvatarInDatabase as a, userProfileAvatarPresence as b, projectUserProfileDisplay as c, resolveCatalogProfile as d, selectProfileDisplayEntries as f, selectUserProfileEmailAlias as g, selectResolvedUserProfileMetadataById as h, insertUserProfile as i, runUserProfileWriteTransaction as k, requireResolvedUserProfileById as l, selectResolvedUserProfileById as m, bindPreparedUserProfileIdentity as n, matchUserProfileReference as o, selectResolvedUserProfile as p, formatUserProfileAvatarEtag as r, projectCatalogUserProfileIdentity as s, applyUserProfileEmailBinding as t, requireResolvedUserProfileMetadataById as u, setUserProfileEmailBinding as v, UserProfileNotFoundError as w, userProfileDisplaySelection as x, toUserProfile as y };
