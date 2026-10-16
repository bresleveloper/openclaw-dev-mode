import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { i as tableExists } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { t as SkillLibraryError } from "./skill-library-error-z-Nwz4n5.mjs";
import { f as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { f as OPENCLAW_STATE_SCHEMA_SQL } from "./openclaw-state-db-legacy-backfills-BxTnDU05.mjs";
import { l as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-D1jWDzK3.mjs";
import { S as userProfilesDb, h as selectResolvedUserProfileMetadataById, p as selectResolvedUserProfile } from "./user-profiles-internal-DlO1LBbo.mjs";
import { O as selectStoredGitHubIdentities } from "./user-profile-list-CtETKur7.mjs";
import { f as resolveOperatorRolePolicyForAssignment } from "./operator-role-policy-BqPaarjx.mjs";
import { r as authorizeOperatorScopesForRequiredScope } from "./method-scopes-BrMPjfvW.mjs";
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
const ensured = /* @__PURE__ */ new WeakSet();
function ensureSkillLibrarySchema(options, admit) {
	const { db } = openOpenClawStateDatabase(options);
	if (ensured.has(db)) return;
	const start = OPENCLAW_STATE_SCHEMA_SQL.indexOf("CREATE TABLE IF NOT EXISTS skill_library_entries (");
	const end = OPENCLAW_STATE_SCHEMA_SQL.indexOf("-- End profile-owned skill library.", start);
	if (start < 0 || end < start) throw new Error("Canonical skill library schema missing.");
	runOpenClawStateWriteTransaction(({ db: transactionDb }) => {
		admit("transaction");
		transactionDb.exec(OPENCLAW_STATE_SCHEMA_SQL.slice(start, end));
		admit("commit");
	}, options, { operationLabel: "skills.library.schema" });
	ensured.add(db);
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
	const ceiling = resolveOperatorRolePolicyForAssignment(profile?.id, profile?.role ?? null, config, profile && config.gateway?.roles?.assignments?.byGithubLogin ? selectStoredGitHubIdentities(db, [profile.id]).get(profile.id)?.primary?.login ?? null : null)?.scopes;
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
function selectSkillLibraryRow(db, skillId) {
	return executeSqliteQueryTakeFirstSync(db, skillLibraryDb(db).selectFrom("skill_library_entries").selectAll().where("skill_id", "=", skillId));
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
function projectSkillLibraryEntry(db, row, authority, revision = row.current_revision, selectedBySession = false) {
	const actor = resolveSkillLibraryActor(db, authority);
	const owner = canonicalOwner(db, row.owner_profile_id);
	if (row.owner_profile_id) authority.profileDependencies?.add(row.owner_profile_id);
	if (owner) authority.profileDependencies?.add(owner);
	if (!actor.read || !selectedBySession && !actor.admin && owner !== actor.profileId && !row.shared && owner !== null) return;
	const metadata = selectSkillLibraryRevisionMetadata(db, row.skill_id, revision);
	if (!metadata) return;
	return {
		skillId: row.skill_id,
		slug: row.slug,
		name: managedSkillCommandName(row.slug, row.skill_id),
		ownerLabel: owner === null ? "Team" : selectSkillLibraryOwner(db, owner)?.display_name ?? owner,
		description: metadata.description,
		ownerProfileId: owner,
		authorProfileId: row.author_profile_id,
		shared: row.shared === 1,
		enabled: row.enabled === 1,
		removed: row.removed === 1,
		revision,
		createdAt: row.created_at,
		updatedAt: row.updated_at,
		canEdit: actor.write && (authority.namespace !== "personal" && actor.admin || owner !== null && actor.profileId === owner)
	};
}
function requireSkillLibraryEntry(db, skillId, authority, write = false) {
	const row = selectSkillLibraryRow(db, skillId);
	const entry = row && projectSkillLibraryEntry(db, row, authority);
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
export { recordSkillLibraryEvent as a, requireSkillLibraryUpload as c, selectSkillLibraryOwner as d, selectSkillLibraryRevisionMetadata as f, sanitizeSkillCommandName as h, readSkillLibraryStore as i, requireSkillLibraryUploadMetadata as l, assertUnambiguousManagedSkillNames as m, assertSkillLibraryRevision as n, requireSkillLibraryEntry as o, skillLibraryDb as p, ensureSkillLibrarySchema as r, requireSkillLibraryProfile as s, assertSkillLibraryNameAvailable as t, resolveSkillLibraryActor as u };
