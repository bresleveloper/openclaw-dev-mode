import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { i as getAdmittedSqliteSchemaFacts } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { t as SkillLibraryError } from "./skill-library-error-z-Nwz4n5.mjs";
import { u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { t as createSqliteSchemaEnsurer } from "./sqlite-schema-ensure-CwIgvH1h.mjs";
import { t as getOpenClawStateFeatureSchemaSql } from "./openclaw-state-feature-schema-CYc16G0w.mjs";
import { i as openOpenClawStateDatabase, u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { r as authorizeOperatorScopesForRequiredScope } from "./method-scopes-Bcx3NDQr.mjs";
import "./skill-library-Bgib5R_8.mjs";
import { S as userProfilesDb, h as selectResolvedUserProfileMetadataById, p as selectResolvedUserProfile } from "./user-profiles-internal-CBUpoSHj.mjs";
import { _ as selectStoredGitHubIdentities, c as selectUserProfileDisplaysInDatabase } from "./user-profile-identity.read-DXpuvx74.mjs";
import { p as resolveOperatorRolePolicyForAssignment } from "./operator-role-policy-Coro3qc5.mjs";
import { t as chunkItems } from "./chunk-items-2QWieLm-.mjs";
import { randomUUID } from "node:crypto";
function sanitizeSkillCommandName(raw) {
	return normalizeLowercaseStringOrEmpty(raw).replace(/[^a-z0-9_]+/g, "_").replace(/_+/g, "_").replace(/^_+|_+$/g, "").slice(0, 32) || "skill";
}
//#endregion
//#region src/skills/library/command-name.ts
/** Fits native 32-character limits without truncating the stable 80-bit identity suffix. */
function managedSkillCommandName(slug, skillId) {
	return `s_${slug.replace(/-+/g, "_").slice(0, 9).replace(/_+$/, "")}_${skillId.replaceAll("-", "").slice(0, 20)}`;
}
/** Explicit references must never resolve a different bundle that copied a managed command name. */
function assertUnambiguousManagedSkillNames(entries) {
	const managed = new Set(entries.filter((entry) => entry.skill.source === "openclaw-library").map((entry) => entry.skill.name));
	if (!managed.size) return;
	const seen = /* @__PURE__ */ new Set();
	for (const entry of entries) {
		const name = sanitizeSkillCommandName(entry.skill.name);
		if (managed.has(name) && seen.has(name)) throw new Error(`Skill command ${name} is ambiguous. Rename the conflicting workspace skill or detach the managed skill before retrying.`);
		seen.add(name);
	}
}
//#endregion
//#region src/skills/library/store.ts
const skillLibraryDb = (db) => getNodeSqliteKysely(db);
const ensured = /* @__PURE__ */ new WeakMap();
const ensureSkillLibrarySchemaInDatabase = createSqliteSchemaEnsurer(() => getOpenClawStateFeatureSchemaSql("skill_library_entries"), { tables: [
	"skill_library_entries",
	"skill_library_revisions",
	"skill_library_events",
	"skill_library_uploads"
] });
function ensureSkillLibrarySchema(options, admit) {
	const database = openOpenClawStateDatabase(options);
	const facts = getAdmittedSqliteSchemaFacts(database.db);
	if (facts && ensured.get(database.db) === facts) return;
	runOpenClawStateWriteTransaction(({ db: transactionDb }) => {
		admit("transaction");
		ensureSkillLibrarySchemaInDatabase(transactionDb);
		admit("commit");
	}, {
		...options,
		database
	}, { operationLabel: "skills.library.schema" });
	const initialized = getAdmittedSqliteSchemaFacts(database.db);
	if (initialized) ensured.set(database.db, initialized);
}
function readSkillLibraryStore(read, options) {
	if (options.database) return tableExists(options.database.db, "skill_library_entries") ? read(options.database.db) : void 0;
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => tableExists(db, "skill_library_entries") ? read(db) : void 0, options);
}
function resolveSkillLibraryActor(db, authority) {
	authority.assertCurrent();
	const config = authority.getConfig();
	if (authority.profileId) authority.profileDependencies?.add(authority.profileId);
	const profile = authority.profileId && tableExists(db, "user_profiles") ? selectResolvedUserProfileMetadataById(db, authority.profileId) : void 0;
	if (authority.profileId && !profile) throw new SkillLibraryError("AUTHORITY_EXPIRED", "Your Gateway profile is no longer available. Sign in again before accessing the library.");
	if (profile) authority.profileDependencies?.add(profile.id);
	return resolveSkillLibraryActorFromProfile(authority, config, profile ? {
		id: profile.id,
		role: profile.role ?? null,
		githubLogin: config.gateway?.roles?.assignments?.byGithubLogin ? selectStoredGitHubIdentities(db, [profile.id]).get(profile.id)?.primary?.login ?? null : null
	} : void 0);
}
/** Apply the same role ceiling to current worker rows or the Gateway's committed profile facts. */
function resolveSkillLibraryActorFromProfile(authority, config, profile) {
	const ceiling = resolveOperatorRolePolicyForAssignment(profile?.id, profile?.role ?? null, config, profile?.githubLogin ?? null)?.scopes;
	const permits = (scope) => authorizeOperatorScopesForRequiredScope(scope, [...authority.scopes]).allowed && (!ceiling || authorizeOperatorScopesForRequiredScope(scope, ceiling).allowed);
	return {
		profileId: profile?.id,
		admin: permits("operator.admin"),
		read: permits("operator.read") || permits("operator.write"),
		write: Boolean(profile) && permits("operator.write")
	};
}
function requireSkillLibraryProfile(db, authority) {
	const actor = resolveSkillLibraryActor(db, authority);
	if (!actor.profileId) throw new SkillLibraryError("IDENTITY_REQUIRED", "Sign in with a durable Gateway profile to use a personal skill library. Shared-token administrators can use workspace skills.");
	if (!actor.write) throw new SkillLibraryError("FORBIDDEN", "Your current Gateway role cannot change skills.");
	return actor.profileId;
}
function requireSelectedSkillLibraryUpload(db, uploadId, authority, query) {
	const actor = requireSkillLibraryProfile(db, authority);
	const upload = executeSqliteQueryTakeFirstSync(db, query.where("upload_id", "=", uploadId));
	const owner = upload && selectSkillLibraryOwner(db, upload.owner_profile_id)?.id;
	if (upload) authority.profileDependencies?.add(upload.owner_profile_id);
	if (owner) authority.profileDependencies?.add(owner);
	if (!upload || upload.expires_at <= Date.now() || owner !== actor) throw new SkillLibraryError("NOT_FOUND", "Upload not found for your profile, or expired. Start a new import.");
	return upload;
}
function requireSkillLibraryUpload(db, uploadId, authority) {
	return requireSelectedSkillLibraryUpload(db, uploadId, authority, skillLibraryDb(db).selectFrom("skill_library_uploads").selectAll());
}
function requireSkillLibraryUploadMetadata(db, uploadId, authority) {
	return requireSelectedSkillLibraryUpload(db, uploadId, authority, skillLibraryDb(db).selectFrom("skill_library_uploads").select([
		"owner_profile_id",
		"expires_at",
		"slug",
		"published_skill_id"
	]));
}
function skillLibraryRevisionQuery(db, skillId, revision) {
	return skillLibraryDb(db).selectFrom("skill_library_revisions").where("skill_id", "=", skillId).where("revision", "=", revision);
}
function selectSkillLibraryRevisionMetadata(db, skillId, revision) {
	return executeSqliteQueryTakeFirstSync(db, skillLibraryRevisionQuery(db, skillId, revision).select("description"));
}
function selectSkillLibraryOwner(db, profileId) {
	return selectResolvedUserProfile(db, profileId, userProfilesDb(db).selectFrom("user_profiles").select([
		"id",
		"display_name",
		"merged_into"
	]));
}
function canonicalOwner(db, owner) {
	return owner && tableExists(db, "user_profiles") ? selectSkillLibraryOwner(db, owner)?.id ?? owner : owner;
}
function projectSkillLibraryList({ entries: catalog, profileId, defaultSelectionNotice: _notice, ...presentation }, { scope } = {}) {
	const entries = catalog.filter((entry) => (scope !== "mine" || profileId && entry.ownerProfileId === profileId) && (scope !== "team" || entry.shared || entry.ownerProfileId === null));
	return {
		...presentation,
		entries,
		profileId,
		defaultSelectionLimit: 64,
		...profileId && entries.filter((entry) => entry.enabled && (entry.ownerProfileId === profileId || entry.ownerProfileId === null || entry.shared)).length > 64 ? { defaultSelectionNotice: "New sessions select up to 64 enabled skills, personal skills first and then stable ID order. In a session, detach a selected skill to make room and attach another from the library." } : {}
	};
}
/** Prepared facts live only for this synchronous read in the caller's snapshot. */
function selectSkillLibraryEntries(db, authority, params = {}, actor = resolveSkillLibraryActor(db, authority)) {
	let query = skillLibraryDb(db).selectFrom("skill_library_entries as entry").leftJoin("skill_library_revisions as revision", (join) => join.onRef("revision.skill_id", "=", "entry.skill_id").on((eb) => eb("revision.revision", "=", params.revision ?? eb.ref("entry.current_revision")))).selectAll("entry").select(["revision.description", "revision.revision"]);
	query = params.skillId ? query.where("entry.skill_id", "=", params.skillId) : query.where("entry.removed", "=", 0);
	if (params.enabledOnly) query = query.where("entry.enabled", "=", 1);
	const rows = executeSqliteQuerySync(db, query.orderBy("entry.slug").orderBy("entry.skill_id")).rows;
	const ownerIds = [...new Set(rows.flatMap((row) => row.owner_profile_id ? [row.owner_profile_id] : []))];
	function readOwners(ids) {
		const owners = /* @__PURE__ */ new Map();
		if (tableExists(db, "user_profiles")) for (const batch of chunkItems(ids, 500)) for (const [id, owner] of selectUserProfileDisplaysInDatabase(db, batch)) owners.set(id, owner);
		return owners;
	}
	const owners = readOwners(ownerIds);
	const labels = readOwners([...new Set([...owners.values()].flatMap((owner) => owner?.merged_into ? [owner.id] : []))]);
	for (const id of ownerIds) {
		authority.profileDependencies?.add(id);
		authority.profileDependencies?.add(owners.get(id)?.id ?? id);
	}
	return rows.flatMap((row) => {
		const profile = row.owner_profile_id === null ? void 0 : owners.get(row.owner_profile_id);
		const owner = profile?.id ?? row.owner_profile_id;
		if (!row.revision || row.description === null || !actor.read || !params.selectedBySession && !actor.admin && owner !== actor.profileId && !row.shared && owner !== null) return [];
		return [{
			skillId: row.skill_id,
			slug: row.slug,
			name: managedSkillCommandName(row.slug, row.skill_id),
			ownerLabel: owner === null ? "Team" : (labels.get(owner) ?? profile)?.display_name ?? owner,
			description: row.description,
			ownerProfileId: owner,
			authorProfileId: row.author_profile_id,
			shared: row.shared === 1,
			enabled: row.enabled === 1,
			removed: row.removed === 1,
			revision: row.revision,
			createdAt: row.created_at,
			updatedAt: row.updated_at,
			canEdit: actor.write && (authority.namespace !== "personal" && actor.admin || owner !== null && actor.profileId === owner)
		}];
	});
}
function requireSkillLibraryEntry(db, skillId, authority, write = false, actor = resolveSkillLibraryActor(db, authority)) {
	const [entry] = selectSkillLibraryEntries(db, authority, { skillId }, actor);
	if (!entry) throw new SkillLibraryError("NOT_FOUND", "Skill not found in your accessible library.");
	if (write && !entry.canEdit) {
		requireSkillLibraryProfile(db, authority);
		throw new SkillLibraryError("FORBIDDEN", authority.namespace === "personal" ? "Personal authoring can change only your own skills. Use the administrator UI or CLI for team management." : "Only the skill's owner or a Gateway administrator can change it.");
	}
	if (write && entry.removed) throw new SkillLibraryError("NOT_FOUND", "Removed skills cannot be edited or selected again; pinned revisions remain available to their sessions.");
	return entry;
}
function assertSkillLibraryRevision(entry, expected) {
	if (entry.revision !== expected) throw new SkillLibraryError("CONFLICT", "Skill changed. Read the current revision and review your edit before saving again.", entry.revision);
}
function assertSkillLibraryNameAvailable(db, owner, slug, exceptId) {
	if (executeSqliteQuerySync(db, skillLibraryDb(db).selectFrom("skill_library_entries").selectAll().where("slug", "=", slug).where("removed", "=", 0)).rows.some((row) => row.skill_id !== exceptId && canonicalOwner(db, row.owner_profile_id) === owner)) throw new SkillLibraryError("NAME_CONFLICT", `A skill named "${slug}" already exists in this library. Choose a different slug; existing skills were preserved.`);
}
function recordSkillLibraryEvent(db, skillId, revision, action, actorProfileId) {
	executeSqliteQuerySync(db, skillLibraryDb(db).insertInto("skill_library_events").values({
		event_id: randomUUID(),
		skill_id: skillId,
		revision,
		action,
		actor_profile_id: actorProfileId,
		created_at: Date.now()
	}));
}
//#endregion
export { sanitizeSkillCommandName as _, readSkillLibraryStore as a, requireSkillLibraryProfile as c, resolveSkillLibraryActor as d, resolveSkillLibraryActorFromProfile as f, assertUnambiguousManagedSkillNames as g, skillLibraryDb as h, projectSkillLibraryList as i, requireSkillLibraryUpload as l, selectSkillLibraryRevisionMetadata as m, assertSkillLibraryRevision as n, recordSkillLibraryEvent as o, selectSkillLibraryOwner as p, ensureSkillLibrarySchema as r, requireSkillLibraryEntry as s, assertSkillLibraryNameAvailable as t, requireSkillLibraryUploadMetadata as u };
