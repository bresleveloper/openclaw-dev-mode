import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { t as createOpenClawStateSchemaEnsurer } from "./openclaw-state-feature-schema-gpylD4Gq.mjs";
import { n as assertOpenClawStateLeaseWorkerOwnedInTransaction } from "./openclaw-state-lease-worker-Bfyut3YB.mjs";
import { t as slugifyWorktreeTitle } from "./name-CNrUfUUC.mjs";
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
function insertProjectRegistryInDatabase(database, input) {
	const db = getNodeSqliteKysely(database);
	const sameRoot = executeSqliteQueryTakeFirstSync(database, db.selectFrom("projects").selectAll().where("repo_root", "=", input.repoRoot));
	if (sameRoot) return rowToProject(sameRoot);
	if (input.source === "cloned" && input.originUrl) {
		const duplicate = executeSqliteQueryTakeFirstSync(database, db.selectFrom("projects").selectAll().where("origin_url", "=", input.originUrl));
		if (duplicate) return rowToProject(duplicate);
	}
	const existing = new Set(executeSqliteQuerySync(database, db.selectFrom("projects").select("id")).rows.map((row) => row.id));
	const baseId = slugifyWorktreeTitle(input.displayName) ?? "project";
	let id = baseId;
	for (let suffixNumber = 2; existing.has(id); suffixNumber++) {
		const suffix = `-${suffixNumber}`;
		id = `${baseId.slice(0, PROJECT_ID_MAX_LENGTH - suffix.length).replace(/-+$/u, "")}${suffix}`;
	}
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
function readMatchingProjectRow(database, project) {
	const db = getNodeSqliteKysely(database);
	const row = executeSqliteQueryTakeFirstSync(database, db.selectFrom("projects").selectAll().where("id", "=", project.id));
	return row && row.id === project.id && row.repo_root === project.repoRoot && row.source === project.source && (row.origin_url ?? void 0) === project.originUrl ? row : void 0;
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
//#region src/projects/project-registry.worker.ts
function checkoutTransaction(operationLabel, operation) {
	return ({ project, lease }, { open, stateOptions }) => runOpenClawStateWriteTransaction(({ db }) => {
		if (lease.scope !== "projects.checkout" || lease.key !== project.repoRoot) throw new Error("Project registry write requires its checkout lifecycle lease");
		assertOpenClawStateLeaseWorkerOwnedInTransaction(db, lease);
		return operation(db, project);
	}, {
		database: open(),
		...stateOptions()
	}, { operationLabel });
}
function registryDatabase({ open, stateOptions }) {
	const database = open();
	ensureProjectRegistrySchema({
		database,
		...stateOptions()
	});
	return database.db;
}
const projectRegistryOperations = {
	"projects.findRoot": (input, context) => resolveRecordedProjectRootInDatabase(registryDatabase(context), input.repoRoot),
	"projects.list": (_input, context) => listProjectRegistryInDatabase(registryDatabase(context)),
	"projects.resolve": (input, context) => resolveProjectRegistryInDatabase(registryDatabase(context), input.id),
	"projects.insert": checkoutTransaction("projects.registry.insert", insertProjectRegistryInDatabase),
	"projects.remove": checkoutTransaction("projects.registry.remove", removeProjectRegistryInDatabase),
	"projects.resolveRefreshOwner": checkoutTransaction("projects.registry.refresh-owner.resolve", resolveProjectCloneRefreshOwnerInDatabase),
	"projects.removeCheckoutReference": checkoutTransaction("projects.registry.checkout-reference.remove", removeProjectCheckoutReferenceInDatabase)
};
//#endregion
export { projectRegistryOperations };
