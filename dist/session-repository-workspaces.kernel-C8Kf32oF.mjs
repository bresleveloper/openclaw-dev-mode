import { a as executeSqliteQueryTakeFirstSync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { v as ensureSessionRepositoryWorkspaceSchema } from "./openclaw-state-db-schema-additive-Dk7csa7u.mjs";
import { n as repositoryWorkspacePublication } from "./session-repository-workspaces.receipts-CKIZXgWP.mjs";
import { randomUUID } from "node:crypto";
//#region src/state/session-repository-workspaces.kernel.ts
const table = "session_repository_workspaces";
const query = (db) => getNodeSqliteKysely(db);
const manifestPattern = /^sha256:[a-f0-9]{64}$/u;
const resultRefPattern = /^refs\/openclaw\/worker-results\/[A-Za-z0-9-]+$/u;
function bounded(value, field, limit) {
	const result = value.trim();
	if (!result || result.length > limit || /\p{Cc}/u.test(result)) throw new Error(`Repository workspace ${field} is invalid`);
	return result;
}
function project(row) {
	return {
		workspaceId: row.workspace_id,
		agentId: row.agent_id,
		sessionKey: row.session_key,
		url: row.url,
		requestedRef: row.requested_ref,
		runSetupScript: row.run_setup_script === 1,
		baseCommit: row.base_commit,
		baseManifestHash: row.base_manifest_hash,
		branch: row.branch,
		checkpointRef: row.checkpoint_ref,
		manifestHash: row.manifest_hash,
		revision: row.revision,
		createdAtMs: row.created_at_ms,
		updatedAtMs: row.updated_at_ms
	};
}
function readSessionRepositoryWorkspaceInDatabase(db, workspaceId) {
	if (!tableExists(db, table)) return;
	const row = executeSqliteQueryTakeFirstSync(db, query(db).selectFrom(table).selectAll().where("workspace_id", "=", workspaceId));
	return row ? project(row) : void 0;
}
function findSessionRepositoryWorkspaceInDatabase(db, owner) {
	if (!tableExists(db, table)) return;
	const row = executeSqliteQueryTakeFirstSync(db, query(db).selectFrom(table).selectAll().where("agent_id", "=", owner.agentId).where("session_key", "=", owner.sessionKey));
	return row ? project(row) : void 0;
}
function changed(db, workspace) {
	repositoryWorkspacePublication.stagePostimages(db, [workspace]);
	return {
		workspaceId: workspace.workspaceId,
		workspace,
		owner: {
			agentId: workspace.agentId,
			sessionKey: workspace.sessionKey
		},
		changed: true
	};
}
/** The caller owns the synchronous transaction and its live commit admission. */
function createSessionRepositoryWorkspaceInDatabase(db, input, nowMs) {
	const agentId = bounded(input.agentId, "agent id", 128);
	const sessionKey = bounded(input.sessionKey, "session key", 1024);
	const url = bounded(input.url, "URL", 4096);
	const requestedRef = input.requestedRef === void 0 ? null : bounded(input.requestedRef, "ref", 1024);
	const branch = input.branch === void 0 ? void 0 : bounded(input.branch, "branch", 256);
	if (!tableExists(db, table)) ensureSessionRepositoryWorkspaceSchema(db);
	const existing = findSessionRepositoryWorkspaceInDatabase(db, {
		agentId,
		sessionKey
	});
	if (existing) {
		if (existing.url !== url || existing.requestedRef !== requestedRef || branch !== void 0 && existing.branch !== branch) throw new Error("Session already owns a different repository workspace");
		return {
			...changed(db, existing),
			changed: false
		};
	}
	const workspaceId = randomUUID();
	const inserted = executeSqliteQueryTakeFirstSync(db, query(db).insertInto(table).values({
		workspace_id: workspaceId,
		agent_id: agentId,
		session_key: sessionKey,
		url,
		requested_ref: requestedRef,
		run_setup_script: input.runSetupScript ? 1 : 0,
		base_commit: null,
		base_manifest_hash: null,
		branch: branch ?? `openclaw/${workspaceId}`,
		checkpoint_ref: null,
		manifest_hash: null,
		revision: 0,
		created_at_ms: nowMs,
		updated_at_ms: nowMs
	}).returningAll());
	if (!inserted) throw new Error("Repository workspace creation failed");
	return changed(db, project(inserted));
}
function mutate(db, input, nowMs, values) {
	const current = readSessionRepositoryWorkspaceInDatabase(db, input.workspaceId);
	if (!current || current.revision !== input.expectedRevision) throw new Error("Repository workspace revision changed");
	if (!Number.isSafeInteger(current.revision + 1)) throw new Error("Repository workspace revision is exhausted");
	const patch = values(current);
	const updated = executeSqliteQueryTakeFirstSync(db, query(db).updateTable(table).set({
		...patch,
		revision: current.revision + 1,
		updated_at_ms: nowMs
	}).where("workspace_id", "=", input.workspaceId).where("revision", "=", input.expectedRevision).returningAll());
	if (!updated) throw new Error("Repository workspace revision changed");
	return changed(db, project(updated));
}
function bindSessionRepositoryWorkspaceBaseInDatabase(db, input, nowMs) {
	if (!/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u.test(input.baseCommit) || input.baseManifestHash !== void 0 && !manifestPattern.test(input.baseManifestHash)) throw new Error("Repository workspace base is invalid");
	return mutate(db, input, nowMs, (current) => {
		if (current.baseCommit !== null && current.baseCommit !== input.baseCommit || current.baseManifestHash !== null && input.baseManifestHash !== void 0 && current.baseManifestHash !== input.baseManifestHash) throw new Error("Repository workspace base changed");
		return {
			base_commit: input.baseCommit,
			...input.baseManifestHash ? { base_manifest_hash: input.baseManifestHash } : {}
		};
	});
}
function acceptSessionRepositoryWorkspaceCheckpointInDatabase(db, input, nowMs) {
	if (!resultRefPattern.test(input.checkpointRef) || !manifestPattern.test(input.manifestHash)) throw new Error("Repository workspace checkpoint is invalid");
	return mutate(db, input, nowMs, (current) => {
		if (!current.baseCommit || !current.baseManifestHash) throw new Error("Repository workspace base has not been captured");
		return {
			checkpoint_ref: input.checkpointRef,
			manifest_hash: input.manifestHash
		};
	});
}
function deleteSessionRepositoryWorkspaceInDatabase(db, workspaceId) {
	const deleted = tableExists(db, table) ? executeSqliteQueryTakeFirstSync(db, query(db).deleteFrom(table).where("workspace_id", "=", workspaceId).returningAll()) : void 0;
	repositoryWorkspacePublication.stageDeletions(db, [workspaceId]);
	return {
		workspaceId,
		workspace: void 0,
		owner: deleted ? {
			agentId: deleted.agent_id,
			sessionKey: deleted.session_key
		} : void 0,
		changed: deleted !== void 0
	};
}
//#endregion
export { findSessionRepositoryWorkspaceInDatabase as a, deleteSessionRepositoryWorkspaceInDatabase as i, bindSessionRepositoryWorkspaceBaseInDatabase as n, readSessionRepositoryWorkspaceInDatabase as o, createSessionRepositoryWorkspaceInDatabase as r, acceptSessionRepositoryWorkspaceCheckpointInDatabase as t };
