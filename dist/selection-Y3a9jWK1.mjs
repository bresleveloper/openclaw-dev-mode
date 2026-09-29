import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { c as readFileDescriptorBoundedSync, o as openRootFileSync } from "./boundary-file-read-D-Aa04On.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { r as tableExists } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { tt as OPENCLAW_STATE_SCHEMA_SQL } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import { t as executeExistingOpenClawStateRead, u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { c as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { r as authorizeOperatorScopesForRequiredScope } from "./method-scopes-C7g7eSZh.mjs";
import { r as SKILL_LIBRARY_MAX_FILE_BYTES } from "./skill-library-C7RO5Y8q.mjs";
import { b as userProfilesDb, h as selectResolvedUserProfileMetadataById, p as selectResolvedUserProfile } from "./user-profiles-internal-BxQLnWfo.mjs";
import { f as resolveOperatorRolePolicyForAssignment } from "./operator-role-policy-BNrKHiJ3.mjs";
import { i as resolveSkillManifestMetadata, n as resolveSkillInvocationPolicy, t as parseSkillFrontmatter } from "./frontmatter-2H_F0IFB.mjs";
import { t as materializeSkill } from "./skill-materializer-CO_mTDvv.mjs";
import { f as SkillLibraryError, l as skillLibraryRevisionDir, s as readSkillLibraryManifestTree } from "./bundle-rcLpsHEc.mjs";
import fs from "node:fs";
import path from "node:path";
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
//#region src/skills/library/selection-read.ts
async function readSkillLibrarySelectionDescriptions(selections, options) {
	const result = await executeExistingOpenClawStateRead(options, {
		type: "skills.library.descriptions",
		input: selections.map(({ skillId, revision }) => ({
			skillId,
			revision
		}))
	});
	if (result === void 0) return;
	if (result.ok && result.type === "skills.library.descriptions") return result.value;
	throw new Error("Unexpected skill library descriptions result");
}
async function readSkillLibrarySelectionManifests(selections, options) {
	if (!selections.length) return [];
	const result = await executeExistingOpenClawStateRead(options, {
		type: "skills.library.manifests",
		input: selections.map(({ skillId, revision }) => ({
			skillId,
			revision
		}))
	});
	if (result === void 0) return;
	if (result.ok && result.type === "skills.library.manifests") return result.value;
	throw new Error("Unexpected skill library manifests result");
}
//#endregion
//#region src/skills/library/selection-read.kernel.ts
function revisionBatchQuery(db, selections) {
	return getNodeSqliteKysely(db).selectFrom("skill_library_revisions").where((eb) => eb.or(selections.map((pin) => eb.and([eb("skill_id", "=", pin.skillId), eb("revision", "=", pin.revision)]))));
}
/** Resolve a bounded session selection in its original order, including repeated pins. */
function selectSkillLibraryRevisionMetadataBatch(db, selections) {
	const rows = executeSqliteQuerySync(db, revisionBatchQuery(db, selections).select([
		"skill_id",
		"revision",
		"description"
	])).rows;
	const metadata = new Map(rows.map((row) => [JSON.stringify([row.skill_id, row.revision]), { description: row.description }]));
	return selections.map((pin) => metadata.get(JSON.stringify([pin.skillId, pin.revision])));
}
//#endregion
//#region src/skills/library/store.ts
const skillLibraryDb = (db) => getNodeSqliteKysely(db);
const ensured = /* @__PURE__ */ new WeakSet();
function ensureSkillLibrarySchema(options) {
	const { db } = openOpenClawStateDatabase(options);
	if (ensured.has(db)) return;
	const start = OPENCLAW_STATE_SCHEMA_SQL.indexOf("CREATE TABLE IF NOT EXISTS skill_library_entries (");
	const end = OPENCLAW_STATE_SCHEMA_SQL.indexOf("-- End profile-owned skill library.", start);
	if (start < 0 || end < start) throw new Error("Canonical skill library schema missing.");
	runOpenClawStateWriteTransaction(({ db: transactionDb }) => {
		transactionDb.exec(OPENCLAW_STATE_SCHEMA_SQL.slice(start, end));
	}, options, { operationLabel: "skills.library.schema" });
	ensured.add(db);
}
function readSkillLibraryStore(read, options) {
	if (options.database) return tableExists(options.database.db, "skill_library_entries") ? read(options.database.db) : void 0;
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => tableExists(db, "skill_library_entries") ? read(db) : void 0, options);
}
function resolveSkillLibraryActor(db, authority) {
	authority.assertCurrent();
	const profile = authority.profileId && tableExists(db, "user_profiles") ? selectResolvedUserProfileMetadataById(db, authority.profileId) : void 0;
	if (authority.profileId && !profile) throw new SkillLibraryError("AUTHORITY_EXPIRED", "Your Gateway profile is no longer available. Sign in again before accessing the library.");
	const ceiling = resolveOperatorRolePolicyForAssignment(profile?.id, profile?.role ?? null, authority.getConfig())?.scopes;
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
	if (!upload || upload.expires_at <= Date.now() || selectSkillLibraryOwner(db, upload.owner_profile_id)?.id !== actor) throw new SkillLibraryError("NOT_FOUND", "Upload not found for your profile, or expired. Start a new import.");
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
function selectSkillLibraryRevision(db, skillId, revision) {
	return executeSqliteQueryTakeFirstSync(db, skillLibraryRevisionQuery(db, skillId, revision).selectAll());
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
//#region src/skills/library/selection.ts
const preparedSelections = /* @__PURE__ */ new WeakMap();
/** Only uncommitted human seeds carry this closure. Persisted session pins intentionally do not. */
function assertPreparedSkillLibrarySelection(selections) {
	if (selections) preparedSelections.get(selections)?.();
}
const selectedEntryCache = /* @__PURE__ */ new Map();
/** Async preparation retains pin values even when a caller later edits its snapshot. */
function captureSkillLibrarySelection(selections) {
	return selections.map(({ skillId, revision, name, ownerProfileId }) => ({
		skillId,
		revision,
		name,
		ownerProfileId
	}));
}
/** The session owner has already authorized this exact immutable pin. */
async function readSelectedSkillLibraryFiles(selection, options = {}) {
	const metadata = readSkillLibraryStore((db) => selectSkillLibraryRevision(db, selection.skillId, selection.revision), options);
	if (!metadata) throw new SkillLibraryError("NOT_FOUND", "Selected skill revision is unavailable.");
	return await readSkillLibraryManifestTree(skillLibraryRevisionDir(selection.skillId, selection.revision, options.env), metadata.files_json, selection.revision);
}
/** Called only by a fresh human-session admission, never from creator/assignee attribution. */
function seedSkillLibrarySelection(authority, options = {}) {
	if (!authority.profileId) return [];
	const result = readSkillLibraryStore((db) => {
		const actor = resolveSkillLibraryActor(db, authority);
		if (!actor.profileId) return [];
		return executeSqliteQuerySync(db, skillLibraryDb(db).selectFrom("skill_library_entries").selectAll().where("removed", "=", 0).where("enabled", "=", 1).orderBy("skill_id")).rows.flatMap((row) => {
			const entry = projectSkillLibraryEntry(db, row, authority);
			if (!entry || entry.ownerProfileId !== actor.profileId && entry.ownerProfileId !== null && !entry.shared) return [];
			return [{
				skillId: entry.skillId,
				revision: entry.revision,
				name: entry.name,
				ownerProfileId: entry.ownerProfileId
			}];
		}).toSorted((a, b) => Number(b.ownerProfileId === actor.profileId) - Number(a.ownerProfileId === actor.profileId)).slice(0, 64);
	}, options) ?? [];
	if (result.length) preparedSelections.set(result, () => {
		authority.assertCurrent();
		if (!readSkillLibraryStore((db) => {
			for (const pin of result) {
				const entry = requireSkillLibraryEntry(db, pin.skillId, authority);
				if (entry.removed || !entry.enabled || !selectSkillLibraryRevisionMetadata(db, pin.skillId, pin.revision)) throw new SkillLibraryError("CONFLICT", "Default skill access changed during session creation. Retry to select current defaults.");
			}
			return true;
		}, options)) throw new SkillLibraryError("CONFLICT", "Default skill library changed during session creation; retry.");
	});
	return result;
}
/** Session mutation authorization is separate; this checks the collaborator's library access. */
function changeSkillLibrarySelection(authority, current, params, options = {}) {
	if (params.action !== "refresh" && !params.skillId) throw new SkillLibraryError("INVALID_BUNDLE", "attach/detach requires skillId.");
	if (params.action === "detach") {
		authority.assertCurrent();
		return current.filter((item) => item.skillId !== params.skillId);
	}
	const result = readSkillLibraryStore((db) => {
		const next = new Map(current.map((item) => [item.skillId, item]));
		const ids = params.skillId ? [params.skillId] : current.map((item) => item.skillId);
		for (const skillId of ids) {
			const entry = requireSkillLibraryEntry(db, skillId, authority);
			if (entry.removed) throw new SkillLibraryError("NOT_FOUND", "Removed skill cannot be selected. Existing pinned selections remain available.");
			const revision = params.revision ?? entry.revision;
			if (!selectSkillLibraryRevisionMetadata(db, skillId, revision)) throw new SkillLibraryError("NOT_FOUND", "Skill revision not found.");
			next.set(skillId, {
				skillId,
				revision,
				name: entry.name,
				ownerProfileId: entry.ownerProfileId
			});
		}
		if (next.size > 64) throw new SkillLibraryError("LIMIT", "A session can select at most 64 library skills.");
		return [...next.values()].toSorted((a, b) => a.skillId < b.skillId ? -1 : a.skillId > b.skillId ? 1 : 0);
	}, options);
	if (!result) throw new SkillLibraryError("NOT_FOUND", "Skill library is empty.");
	return result;
}
/** Resolve already-authorized pins only when rebuilding a snapshot, independent of current sharing. */
function loadSkillLibrarySelection(selections, options = {}) {
	if (!selections.length) return [];
	const cacheKey = JSON.stringify([
		resolveStateDir(options.env),
		options.path,
		selections
	]);
	const cached = selectedEntryCache.get(cacheKey);
	if (cached) return [...cached];
	if (selections.length > 64) throw new SkillLibraryError("LIMIT", "Invalid session skill selection.");
	return cacheSkillLibrarySelection(cacheKey, readSkillLibraryStore((db) => materializeSkillLibrarySelection(selections, selectSkillLibraryRevisionMetadataBatch(db, selections), options.env), options));
}
/** Prepare immutable pins without borrowing a caller's synchronous database handle. */
async function prepareSkillLibrarySelection(inputSelections, options, assertCurrent) {
	assertCurrent();
	if (!inputSelections.length) return [];
	const selections = captureSkillLibrarySelection(inputSelections);
	const cacheKey = JSON.stringify([
		resolveStateDir(options.env),
		options.path,
		selections
	]);
	const cached = selectedEntryCache.get(cacheKey);
	if (cached) return [...cached];
	if (selections.length > 64) throw new SkillLibraryError("LIMIT", "Invalid session skill selection.");
	const revisions = await readSkillLibrarySelectionDescriptions(selections, options);
	assertCurrent();
	return cacheSkillLibrarySelection(cacheKey, revisions && materializeSkillLibrarySelection(selections, revisions, options.env));
}
function materializeSkillLibrarySelection(selections, revisions, env) {
	return selections.map((selection, index) => {
		const revision = revisions[index];
		if (!revision) throw new SkillLibraryError("NOT_FOUND", "A pinned skill revision is unavailable; restore the library artifact or detach it explicitly.");
		const baseDir = skillLibraryRevisionDir(selection.skillId, selection.revision, env);
		const filePath = path.join(baseDir, "SKILL.md");
		const opened = openRootFileSync({
			absolutePath: filePath,
			rootPath: baseDir,
			boundaryLabel: "skill library revision",
			maxBytes: SKILL_LIBRARY_MAX_FILE_BYTES,
			rejectHardlinks: true,
			symlinks: "reject"
		});
		if (!opened.ok) throw new SkillLibraryError("INVALID_BUNDLE", "Pinned skill instructions could not be read; restore the library artifact or detach it explicitly.", void 0, { cause: opened.error });
		let content;
		try {
			content = readFileDescriptorBoundedSync(opened.fd, SKILL_LIBRARY_MAX_FILE_BYTES).toString("utf8");
		} finally {
			fs.closeSync(opened.fd);
		}
		const frontmatter = parseSkillFrontmatter(content);
		const metadata = resolveSkillManifestMetadata(frontmatter);
		const invocation = resolveSkillInvocationPolicy(frontmatter);
		const name = selection.name;
		return {
			skill: materializeSkill({
				content,
				frontmatter,
				name,
				description: revision.description,
				baseDir,
				filePath,
				source: "openclaw-library",
				sourceOptions: { source: "openclaw-library" }
			}),
			frontmatter,
			invocation,
			metadata: {
				skillKey: name,
				os: metadata?.os,
				requires: metadata?.requires
			},
			disableCommandDispatch: true,
			syncSourceDir: baseDir,
			syncDirName: `library-${selection.skillId}-${selection.revision}`
		};
	});
}
function cacheSkillLibrarySelection(cacheKey, entries) {
	if (!entries) throw new SkillLibraryError("NOT_FOUND", "Pinned skill library is unavailable; restore it before running this session.");
	selectedEntryCache.set(cacheKey, entries);
	if (selectedEntryCache.size > 32) selectedEntryCache.delete(selectedEntryCache.keys().next().value);
	return [...entries];
}
//#endregion
export { skillLibraryDb as C, sanitizeSkillCommandName as E, selectSkillLibraryRow as S, assertUnambiguousManagedSkillNames as T, requireSkillLibraryUploadMetadata as _, prepareSkillLibrarySelection as a, selectSkillLibraryRevision as b, assertSkillLibraryNameAvailable as c, projectSkillLibraryEntry as d, readSkillLibraryStore as f, requireSkillLibraryUpload as g, requireSkillLibraryProfile as h, loadSkillLibrarySelection as i, assertSkillLibraryRevision as l, requireSkillLibraryEntry as m, captureSkillLibrarySelection as n, readSelectedSkillLibraryFiles as o, recordSkillLibraryEvent as p, changeSkillLibrarySelection as r, seedSkillLibrarySelection as s, assertPreparedSkillLibrarySelection as t, ensureSkillLibrarySchema as u, resolveSkillLibraryActor as v, readSkillLibrarySelectionManifests as w, selectSkillLibraryRevisionMetadata as x, selectSkillLibraryOwner as y };
