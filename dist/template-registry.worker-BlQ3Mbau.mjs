import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { f as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { n as readStateLeaseProcessOwnerStatus, t as parseStateLeaseProcessOwner } from "./state-lease-process-owner-CPrBcVUW.mjs";
import { t as createOpenClawStateSchemaEnsurer } from "./openclaw-state-feature-schema-ensure-BdqUBvvX.mjs";
//#region src/agents/worktrees/template-registry.worker.ts
const TEMPLATE_READER_SCOPE = "core:managed-worktrees:template-readers";
const kyselyFor = (db) => getNodeSqliteKysely(db);
const ensureTemplateSchema = createOpenClawStateSchemaEnsurer({
	table: "worktree_templates",
	operationLabel: "agents.worktrees.templates.schema.ensure"
});
function rowToRecord(row) {
	if (row.status !== "preparing" && row.status !== "ready") throw new Error(`Invalid worktree template status: ${row.status}`);
	return {
		cacheKey: row.cache_key,
		id: row.id,
		repoRoot: row.repo_root,
		commonDir: row.common_dir,
		worktreeRoot: row.worktree_root,
		path: row.path,
		backend: row.backend,
		sourceCommit: row.source_commit,
		contentKey: row.content_key,
		status: row.status,
		createdAt: row.created_at,
		lastUsedAt: row.last_used_at
	};
}
function openTemplateDatabase(context) {
	const options = {
		...context.stateOptions(),
		database: context.open()
	};
	ensureTemplateSchema(options);
	return options;
}
function worktreeTemplateMutation(operationLabel, mutate) {
	return (input, context) => runOpenClawStateWriteTransaction(({ db }) => {
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: void 0
		});
		const result = mutate(db, input);
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: void 0
		});
		return result;
	}, openTemplateDatabase(context), { operationLabel });
}
function hasTemplateReaders(db, id) {
	const k = kyselyFor(db);
	const rows = executeSqliteQuerySync(db, k.selectFrom("state_leases").select([
		"lease_key",
		"owner",
		"payload_json"
	]).where("scope", "=", TEMPLATE_READER_SCOPE)).rows;
	let retained = false;
	for (const row of rows) {
		const payload = safeParseJsonRecord(row.payload_json ?? "");
		if (typeof payload?.template !== "string") throw new Error("Worktree template reader is unreadable; template retained");
		const owner = parseStateLeaseProcessOwner(row.payload_json);
		if (readStateLeaseProcessOwnerStatus(owner) === "dead") executeSqliteQuerySync(db, k.deleteFrom("state_leases").where("scope", "=", TEMPLATE_READER_SCOPE).where("lease_key", "=", row.lease_key).where("owner", "=", row.owner));
		else if (payload.template === id) retained = true;
	}
	return retained;
}
const worktreeTemplateOperations = {
	"worktrees.templates.read": ({ cacheKey }, context) => {
		const { db } = openTemplateDatabase(context).database;
		const row = executeSqliteQuerySync(db, kyselyFor(db).selectFrom("worktree_templates").selectAll().where("cache_key", "=", cacheKey)).rows[0];
		return row ? rowToRecord(row) : void 0;
	},
	"worktrees.templates.has": (_input, context) => {
		const { db } = openTemplateDatabase(context).database;
		return executeSqliteQuerySync(db, kyselyFor(db).selectFrom("worktree_templates").select("cache_key").limit(1)).rows.length > 0;
	},
	"worktrees.templates.list": (_input, context) => {
		const { db } = openTemplateDatabase(context).database;
		return executeSqliteQuerySync(db, kyselyFor(db).selectFrom("worktree_templates").selectAll().orderBy("last_used_at", "asc").orderBy("id", "asc")).rows.map(rowToRecord);
	},
	"worktrees.templates.reserve": worktreeTemplateMutation("worktrees.templates.reserve", (db, record) => {
		executeSqliteQuerySync(db, kyselyFor(db).insertInto("worktree_templates").values({
			cache_key: record.cacheKey,
			id: record.id,
			repo_root: record.repoRoot,
			common_dir: record.commonDir,
			worktree_root: record.worktreeRoot,
			path: record.path,
			backend: record.backend,
			source_commit: record.sourceCommit,
			content_key: record.contentKey,
			status: record.status,
			created_at: record.createdAt,
			last_used_at: record.lastUsedAt
		}));
	}),
	"worktrees.templates.ready": worktreeTemplateMutation("worktrees.templates.ready", (db, { id, now }) => executeSqliteQuerySync(db, kyselyFor(db).updateTable("worktree_templates").set({
		status: "ready",
		last_used_at: now
	}).where("id", "=", id).where("status", "=", "preparing")).numAffectedRows === 1n),
	"worktrees.templates.delete": worktreeTemplateMutation("worktrees.templates.delete", (db, { id }) => executeSqliteQuerySync(db, kyselyFor(db).deleteFrom("worktree_templates").where("id", "=", id)).numAffectedRows === 1n),
	"worktrees.templates.retainReader": worktreeTemplateMutation("worktrees.templates.retainReader", (db, input) => {
		const k = kyselyFor(db);
		const row = executeSqliteQuerySync(db, "id" in input ? k.selectFrom("worktree_templates").selectAll().where("id", "=", input.id) : k.selectFrom("worktree_templates").selectAll().where("cache_key", "=", input.selection.cacheKey).where("content_key", "=", input.selection.contentKey).where("backend", "=", input.selection.backend).where("status", "=", "ready")).rows[0];
		if (!row) return;
		const unpublish = "id" in input && input.unpublish;
		if ("selection" in input && !hasTemplateReaders(db, row.id)) return;
		if (unpublish && hasTemplateReaders(db, row.id)) return;
		if (unpublish) executeSqliteQuerySync(db, k.updateTable("worktree_templates").set({ status: "preparing" }).where("id", "=", row.id));
		const now = Date.now();
		executeSqliteQuerySync(db, kyselyFor(db).insertInto("state_leases").values({
			scope: TEMPLATE_READER_SCOPE,
			lease_key: input.key,
			owner: input.key,
			expires_at: null,
			heartbeat_at: null,
			payload_json: JSON.stringify({
				owner: input.owner,
				template: row.id
			}),
			created_at: now,
			updated_at: now
		}));
		return rowToRecord(row);
	}),
	"worktrees.templates.releaseReader": worktreeTemplateMutation("worktrees.templates.releaseReader", (db, { key }) => {
		executeSqliteQuerySync(db, kyselyFor(db).deleteFrom("state_leases").where("scope", "=", TEMPLATE_READER_SCOPE).where("lease_key", "=", key).where("owner", "=", key));
	}),
	"worktrees.templates.hasReaders": worktreeTemplateMutation("worktrees.templates.hasReaders", (db, { id }) => hasTemplateReaders(db, id))
};
//#endregion
export { worktreeTemplateOperations };
