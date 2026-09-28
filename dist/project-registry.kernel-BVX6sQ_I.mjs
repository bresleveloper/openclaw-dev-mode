import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { t as createOpenClawStateSchemaEnsurer } from "./openclaw-state-feature-schema-DBVCGotT.mjs";
//#region src/agents/worktrees/name.ts
const WORKTREE_NAME_MAX_LENGTH = 64;
/** Converts a short human-readable title into a valid managed-worktree name. */
function slugifyWorktreeTitle(title) {
	const slug = title.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
	if (slug.length <= WORKTREE_NAME_MAX_LENGTH) return slug || void 0;
	const truncated = slug.slice(0, WORKTREE_NAME_MAX_LENGTH);
	const wordBoundary = truncated.lastIndexOf("-");
	return wordBoundary > 0 ? truncated.slice(0, wordBoundary) : truncated;
}
//#endregion
//#region src/projects/project-registry.kernel.ts
const PROJECT_ID_MAX_LENGTH = 64;
const ensureProjectRegistrySchema = createOpenClawStateSchemaEnsurer({
	table: "projects",
	operationLabel: "projects.registry.schema.ensure"
});
function rowToProject(row) {
	return {
		id: row.id,
		displayName: row.display_name,
		repoRoot: row.repo_root,
		...row.origin_url ? { originUrl: row.origin_url } : {},
		source: row.source
	};
}
function allocateProjectId(base, existing) {
	if (!existing.has(base)) return base;
	for (let suffixNumber = 2;; suffixNumber += 1) {
		const suffix = `-${suffixNumber}`;
		const candidate = `${base.slice(0, PROJECT_ID_MAX_LENGTH - suffix.length).replace(/-+$/u, "")}${suffix}`;
		if (!existing.has(candidate)) return candidate;
	}
}
function insertProjectRegistryInDatabase(database, input) {
	const db = getNodeSqliteKysely(database);
	const sameRoot = executeSqliteQueryTakeFirstSync(database, db.selectFrom("projects").selectAll().where("repo_root", "=", input.repoRoot));
	if (sameRoot) return rowToProject(sameRoot);
	if (input.source === "cloned" && input.originUrl) {
		const duplicate = executeSqliteQueryTakeFirstSync(database, db.selectFrom("projects").selectAll().where("origin_url", "=", input.originUrl));
		if (duplicate) return rowToProject(duplicate);
	}
	const existing = new Set(executeSqliteQuerySync(database, db.selectFrom("projects").select("id")).rows.map((row) => row.id));
	const id = allocateProjectId(slugifyWorktreeTitle(input.displayName) ?? "project", existing);
	const now = Date.now();
	const row = {
		id,
		display_name: input.displayName,
		repo_root: input.repoRoot,
		origin_url: input.originUrl ?? null,
		source: input.source,
		created_at_ms: now,
		updated_at_ms: now
	};
	executeSqliteQuerySync(database, db.insertInto("projects").values(row));
	return rowToProject(row);
}
function listProjectRegistryInDatabase(database) {
	const db = getNodeSqliteKysely(database);
	return executeSqliteQuerySync(database, db.selectFrom("projects").selectAll()).rows.map(rowToProject);
}
function resolveProjectRegistryInDatabase(database, id) {
	const db = getNodeSqliteKysely(database);
	const row = executeSqliteQueryTakeFirstSync(database, db.selectFrom("projects").selectAll().where("id", "=", id));
	return row ? rowToProject(row) : void 0;
}
function resolveRecordedProjectRootInDatabase(database, repoRoot) {
	const db = getNodeSqliteKysely(database);
	return executeSqliteQueryTakeFirstSync(database, db.selectFrom("projects").select("repo_root").where("repo_root", "=", repoRoot))?.repo_root;
}
function matchesProjectRecord(row, project) {
	return row.id === project.id && row.repo_root === project.repoRoot && row.source === project.source && (row.origin_url ?? void 0) === project.originUrl;
}
function readMatchingProjectRow(database, project) {
	const db = getNodeSqliteKysely(database);
	const row = executeSqliteQueryTakeFirstSync(database, db.selectFrom("projects").selectAll().where("id", "=", project.id));
	return row && matchesProjectRecord(row, project) ? row : void 0;
}
function resolveProjectCloneRefreshOwnerInDatabase(database, project) {
	const current = readMatchingProjectRow(database, project);
	return current?.source === "cloned" ? rowToProject(current) : void 0;
}
function removeProjectRegistryInDatabase(database, project) {
	if (!readMatchingProjectRow(database, project)) return false;
	const db = getNodeSqliteKysely(database);
	return executeSqliteQuerySync(database, db.deleteFrom("projects").where("id", "=", project.id)).numAffectedRows === 1n;
}
function removeProjectCheckoutReferenceInDatabase(database, project) {
	const db = getNodeSqliteKysely(database);
	const current = executeSqliteQueryTakeFirstSync(database, db.selectFrom("projects").selectAll().where("id", "=", project.id));
	if (!current) return "missing";
	if (current.source !== "cloned" || current.repo_root !== project.repoRoot) return "changed";
	executeSqliteQuerySync(database, db.deleteFrom("projects").where("id", "=", project.id));
	const sibling = executeSqliteQueryTakeFirstSync(database, db.selectFrom("projects").selectAll().where("repo_root", "=", project.repoRoot).orderBy("id", "asc"));
	if (!sibling) return "final";
	if (sibling.source === "registered") executeSqliteQuerySync(database, db.updateTable("projects").set({
		source: "cloned",
		origin_url: sibling.origin_url ?? current.origin_url,
		updated_at_ms: Date.now()
	}).where("id", "=", sibling.id));
	return "remaining";
}
//#endregion
export { removeProjectRegistryInDatabase as a, resolveRecordedProjectRootInDatabase as c, removeProjectCheckoutReferenceInDatabase as i, slugifyWorktreeTitle as l, insertProjectRegistryInDatabase as n, resolveProjectCloneRefreshOwnerInDatabase as o, listProjectRegistryInDatabase as r, resolveProjectRegistryInDatabase as s, ensureProjectRegistrySchema as t };
