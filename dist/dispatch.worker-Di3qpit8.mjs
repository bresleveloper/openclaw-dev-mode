import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { i as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { l as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-D1jWDzK3.mjs";
import { t as createOpenClawStateSchemaEnsurer } from "./openclaw-state-feature-schema-gpylD4Gq.mjs";
import { _ as worktreeGcRevision, d as getRegistryWorktreeProvisionedChunkInDatabase, f as getRegistryWorktreeProvisionedPathsInDatabase, g as rowToRecord$1, h as listRegistryWorktreesInDatabase, l as WORKTREE_RECORD_COLUMNS, m as listLiveRegistryWorktreeIdsInDatabase, n as releaseWorktreeRunLeaseInDatabase, p as getRegistryWorktreeProvisionedStateInDatabase, s as reapWorktreeRunLeasesInDatabase, t as admitWorktreeRunLeaseInDatabase, u as getRegistryWorktreeInDatabase } from "./run-lease-store.kernel-CMstqu0z.mjs";
import { t as hasLocalWorkspaceProjectionInDatabase } from "./local-workspace-store-BrnU7gz2.mjs";
//#region src/agents/worktrees/registry-retirement.worker.ts
function deferWorktreeCleanupInWorker({ observed, reason }, options) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: void 0
		});
		const current = getRegistryWorktreeInDatabase(db, observed.id);
		const revision = worktreeGcRevision(observed);
		if (!current || current.removedAt !== void 0 || worktreeGcRevision(current) !== revision) return false;
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("worktrees").set({ gc_protection_json: reason === null ? null : JSON.stringify({
			revision,
			reason
		}) }).where("id", "=", observed.id));
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: void 0
		});
		return true;
	}, options, { operationLabel: "worktrees.deferCleanup" });
}
function retireMissingWorktreeInWorker({ observed, removedAt }, options) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: void 0
		});
		if (hasLocalWorkspaceProjectionInDatabase(db, observed.id)) return {
			record: getRegistryWorktreeInDatabase(db, observed.id),
			protection: "local-workspace-projection"
		};
		const retired = executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("worktrees").set({ removed_at: removedAt }).where("id", "=", observed.id).where("removed_at", "is", null).where((eb) => eb.or([eb("snapshot_ref", "is", null), eb("snapshot_ref", "not like", "refs/openclaw/snapshots/exact-%")])).where("path", "=", observed.path).where("last_active_at", "=", observed.lastActiveAt).where("repo_root", "=", observed.repoRoot).where("repo_fingerprint", "=", observed.repoFingerprint).returning(WORKTREE_RECORD_COLUMNS)).rows[0];
		const record = retired ? rowToRecord$1(retired) : getRegistryWorktreeInDatabase(db, observed.id);
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: void 0
		});
		return { record };
	}, options, { operationLabel: "worktrees.retireMissing" });
}
//#endregion
//#region src/agents/worktrees/run-lease-store.worker.ts
function worktreeRunLeaseOperation(operationLabel, mutate) {
	return (input, context) => {
		const database = context.open();
		runOpenClawStateWriteTransaction(({ db }) => {
			requestSqliteWorkerOperationAdmission({
				stage: "transaction",
				facts: void 0
			});
			mutate(db, input);
			requestSqliteWorkerOperationAdmission({
				stage: "commit",
				facts: void 0
			});
		}, {
			...context.stateOptions(),
			database
		}, { operationLabel });
	};
}
//#endregion
//#region src/agents/worktrees/template-registry.ts
const ensureTemplateSchema = createOpenClawStateSchemaEnsurer({
	table: "worktree_templates",
	operationLabel: "agents.worktrees.templates.schema.ensure"
});
function kyselyFor(db) {
	return getNodeSqliteKysely(db);
}
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
function openTemplateDatabase(env) {
	ensureTemplateSchema({ env });
	return openOpenClawStateDatabase({ env }).db;
}
function readTemplate(env, cacheKey) {
	const db = openTemplateDatabase(env);
	const row = executeSqliteQuerySync(db, kyselyFor(db).selectFrom("worktree_templates").selectAll().where("cache_key", "=", cacheKey)).rows[0];
	return row ? rowToRecord(row) : void 0;
}
function hasTemplates(env) {
	const db = openTemplateDatabase(env);
	return executeSqliteQuerySync(db, kyselyFor(db).selectFrom("worktree_templates").select("cache_key").limit(1)).rows.length > 0;
}
function listTemplates(env) {
	const db = openTemplateDatabase(env);
	return executeSqliteQuerySync(db, kyselyFor(db).selectFrom("worktree_templates").selectAll().orderBy("last_used_at", "asc").orderBy("id", "asc")).rows.map(rowToRecord);
}
function mutateTemplate(env, commitGuard, operationLabel, mutate) {
	commitGuard();
	ensureTemplateSchema({ env });
	return runOpenClawStateWriteTransaction(({ db }) => {
		commitGuard();
		return mutate(db);
	}, { env }, { operationLabel });
}
/** Reserve before creating the artifact; an occupied slot must be retired first. */
function reserveTemplate(env, record, commitGuard) {
	mutateTemplate(env, commitGuard, "agents.worktrees.templates.reserve", (db) => {
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
	});
}
function markTemplateReady(env, id, now, commitGuard) {
	return mutateTemplate(env, commitGuard, "agents.worktrees.templates.ready", (db) => {
		return executeSqliteQuerySync(db, kyselyFor(db).updateTable("worktree_templates").set({
			status: "ready",
			last_used_at: now
		}).where("id", "=", id).where("status", "=", "preparing")).numAffectedRows === 1n;
	});
}
function touchTemplate(env, id, now, commitGuard) {
	return mutateTemplate(env, commitGuard, "agents.worktrees.templates.touch", (db) => {
		return executeSqliteQuerySync(db, kyselyFor(db).updateTable("worktree_templates").set({ last_used_at: now }).where("id", "=", id).where("status", "=", "ready")).numAffectedRows === 1n;
	});
}
/** A stale cleanup must never delete a replacement occupying the same cache key. */
function deleteTemplate(env, id, commitGuard) {
	return mutateTemplate(env, commitGuard, "agents.worktrees.templates.delete", (db) => {
		return executeSqliteQuerySync(db, kyselyFor(db).deleteFrom("worktree_templates").where("id", "=", id)).numAffectedRows === 1n;
	});
}
//#endregion
//#region src/agents/worktrees/template-registry.worker.ts
function worktreeTemplateMutation(operationLabel, mutate) {
	return (input, context) => {
		const database = context.open();
		const options = context.stateOptions();
		return runOpenClawStateWriteTransaction(() => {
			const result = mutate(options.env, input, () => {
				requestSqliteWorkerOperationAdmission({
					stage: "transaction",
					facts: void 0
				});
			});
			requestSqliteWorkerOperationAdmission({
				stage: "commit",
				facts: void 0
			});
			return result;
		}, {
			...options,
			database
		}, { operationLabel });
	};
}
//#endregion
//#region src/agents/worktrees/dispatch.worker.ts
const worktreeOperations = {
	"worktrees.get": ({ id }, { open }) => getRegistryWorktreeInDatabase(open().db, id),
	"worktrees.list": (input, { open }) => listRegistryWorktreesInDatabase(open().db, input),
	"worktrees.liveIds": (_input, { open }) => listLiveRegistryWorktreeIdsInDatabase(open().db),
	"worktrees.provisionedPaths": ({ id }, { open }) => getRegistryWorktreeProvisionedPathsInDatabase(open().db, id),
	"worktrees.provisionedState": ({ id }, { open }) => getRegistryWorktreeProvisionedStateInDatabase(open().db, id),
	"worktrees.provisionedChunk": (input, { open }) => getRegistryWorktreeProvisionedChunkInDatabase(open().db, input),
	"worktrees.retireMissing": (input, { open, stateOptions }) => retireMissingWorktreeInWorker(input, {
		...stateOptions(),
		database: open()
	}),
	"worktrees.deferCleanup": (input, { open, stateOptions }) => deferWorktreeCleanupInWorker(input, {
		...stateOptions(),
		database: open()
	}),
	"worktrees.admitRunLease": worktreeRunLeaseOperation("worktrees.admitRunLease", admitWorktreeRunLeaseInDatabase),
	"worktrees.releaseRunLease": worktreeRunLeaseOperation("worktrees.releaseRunLease", (db, { worktreeId, token }) => releaseWorktreeRunLeaseInDatabase(db, worktreeId, token)),
	"worktrees.reapRunLeases": worktreeRunLeaseOperation("worktrees.reapRunLeases", (db, { scopes }) => reapWorktreeRunLeasesInDatabase(db, scopes)),
	"worktrees.templates.read": ({ cacheKey }, { stateOptions }) => readTemplate(stateOptions().env, cacheKey),
	"worktrees.templates.has": (_input, { stateOptions }) => hasTemplates(stateOptions().env),
	"worktrees.templates.list": (_input, { stateOptions }) => listTemplates(stateOptions().env),
	"worktrees.templates.reserve": worktreeTemplateMutation("worktrees.templates.reserve", reserveTemplate),
	"worktrees.templates.ready": worktreeTemplateMutation("worktrees.templates.ready", (env, { id, now }, commitGuard) => markTemplateReady(env, id, now, commitGuard)),
	"worktrees.templates.touch": worktreeTemplateMutation("worktrees.templates.touch", (env, { id, now }, commitGuard) => touchTemplate(env, id, now, commitGuard)),
	"worktrees.templates.delete": worktreeTemplateMutation("worktrees.templates.delete", (env, { id }, commitGuard) => deleteTemplate(env, id, commitGuard))
};
//#endregion
export { worktreeOperations };
