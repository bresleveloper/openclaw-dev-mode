import { i as executeSqliteQuerySync, o as getNodeSqliteKysely, s as iterateSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { r as projectRepositoryGitHubPublicationStatus, t as checkRepositoryGitHubPublication } from "./github-repository-publication.kernel-DPeRC71q.mjs";
//#region src/gateway/github-repository-publication-read.worker.ts
const table = "github_repository_publication_requests";
const query = (db) => getNodeSqliteKysely(db);
function selectRepositoryGitHubPublications(db, filter) {
	let selection = query(db).selectFrom(table).selectAll();
	for (const [column, value] of [
		["session_id", filter.sessionId],
		["session_key", filter.sessionKey],
		["agent_id", filter.agentId],
		["workspace_id", filter.workspaceId],
		["owner_profile_id", filter.ownerProfileId],
		["idempotency_key", filter.idempotencyKey]
	]) if (value !== void 0) selection = selection.where(column, value === null ? "is" : "=", value);
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
export { readPendingRepositoryGitHubPublicationInDatabase as n, listRepositoryGitHubPublicationsInDatabase as t };
