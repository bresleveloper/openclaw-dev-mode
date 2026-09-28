import { a as iterateSqliteQuerySync, i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { r as tableExists } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { createHash } from "node:crypto";
//#region src/gateway/github-repository-publication.kernel.ts
const table = "github_repository_publication_requests";
const query = (db) => getNodeSqliteKysely(db);
function repositoryGitHubPublicationDigest(row) {
	return createHash("sha256").update(JSON.stringify([
		row.request_id,
		row.owner_profile_id,
		row.connection_generation,
		row.idempotency_key,
		row.session_id,
		row.session_lifecycle_revision,
		row.session_key,
		row.agent_id,
		row.workspace_id,
		row.identity_source,
		row.identity_profile_id,
		row.identity_account_id,
		row.identity_login,
		row.title,
		row.body,
		row.push_repository,
		row.repository,
		row.branch,
		row.base_branch,
		row.checkpoint_ref,
		row.checkpoint_digest,
		row.source_head_commit,
		row.source_index_tree,
		row.workspace_tree,
		row.previous_head_commit,
		row.created_at_ms,
		...row.requester_authority_json !== null ? [row.requester_authority_json] : []
	])).digest("hex");
}
function checkRepositoryGitHubPublication(row) {
	if (repositoryGitHubPublicationDigest(row) !== row.request_digest || row.identity_source === "personal" !== (row.owner_profile_id !== null) || row.owner_profile_id !== null && row.requester_authority_json !== null) throw new Error("GitHub repository publication receipt is corrupt.");
	return row;
}
function projectRepositoryGitHubPublicationStatus(row) {
	return {
		request_id: row.request_id,
		owner_profile_id: row.owner_profile_id,
		connection_generation: row.connection_generation,
		request_digest: row.request_digest,
		session_id: row.session_id,
		session_lifecycle_revision: row.session_lifecycle_revision,
		session_key: row.session_key,
		agent_id: row.agent_id,
		workspace_id: row.workspace_id,
		identity_source: row.identity_source,
		identity_account_id: row.identity_account_id,
		identity_login: row.identity_login,
		status: row.status,
		gateway_instance_id: row.gateway_instance_id,
		execution_id: row.execution_id,
		push_repository: row.push_repository,
		repository: row.repository,
		branch: row.branch,
		base_branch: row.base_branch,
		source_head_commit: row.source_head_commit,
		source_index_tree: row.source_index_tree,
		workspace_tree: row.workspace_tree,
		head_commit: row.head_commit,
		pull_request_url: row.pull_request_url,
		error_code: row.error_code,
		next_action: row.next_action,
		last_effect: row.last_effect,
		effect_state: row.effect_state
	};
}
function selectRepositoryGitHubPublications(db, filter) {
	let selection = query(db).selectFrom(table).selectAll();
	if (filter.sessionId !== void 0) selection = selection.where("session_id", "=", filter.sessionId);
	if (filter.sessionKey !== void 0) selection = selection.where("session_key", "=", filter.sessionKey);
	if (filter.agentId !== void 0) selection = selection.where("agent_id", "=", filter.agentId);
	if (filter.workspaceId !== void 0) selection = selection.where("workspace_id", "=", filter.workspaceId);
	if (filter.ownerProfileId !== void 0) selection = selection.where("owner_profile_id", filter.ownerProfileId === null ? "is" : "=", filter.ownerProfileId);
	if (filter.idempotencyKey !== void 0) selection = selection.where("idempotency_key", "=", filter.idempotencyKey);
	if (filter.pending !== void 0) selection = selection.where("status", "in", filter.pending ? [
		"requested",
		"publishing",
		"needs_confirmation"
	] : ["published", "failed"]);
	if (filter.unreported) selection = selection.where("reported_at_ms", "is", null);
	return selection.orderBy("updated_at_ms").orderBy("request_id");
}
function listRepositoryGitHubPublicationsInDatabase(db, filter) {
	if (!tableExists(db, table)) return [];
	return executeSqliteQuerySync(db, selectRepositoryGitHubPublications(db, filter)).rows.map(checkRepositoryGitHubPublication);
}
function readPendingRepositoryGitHubPublicationInDatabase(db, input) {
	if (!tableExists(db, table)) return;
	let latest;
	for (const row of iterateSqliteQuerySync(db, selectRepositoryGitHubPublications(db, {
		...input,
		pending: true
	}))) latest = checkRepositoryGitHubPublication(row);
	return latest && projectRepositoryGitHubPublicationStatus(latest);
}
//#endregion
export { repositoryGitHubPublicationDigest as i, listRepositoryGitHubPublicationsInDatabase as n, readPendingRepositoryGitHubPublicationInDatabase as r, checkRepositoryGitHubPublication as t };
