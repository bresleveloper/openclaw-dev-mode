import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { createHash } from "node:crypto";
//#region src/gateway/github-publication-receipt.ts
const PUBLICATION_FAILURE_CODES = /* @__PURE__ */ new Set([
	"identity_changed",
	"identity_unavailable",
	"session_changed",
	"workspace_changed",
	"not_git",
	"not_github",
	"no_changes",
	"push_rejected",
	"github_rejected",
	"unavailable"
]);
function publicationFailureCode(value) {
	return PUBLICATION_FAILURE_CODES.has(value) ? value : "unavailable";
}
function matchesGitHubPublicationIdentityRow(row, identity) {
	return row.identity_source === identity.source && row.identity_profile_id === (identity.profileId ?? null) && row.identity_account_id === identity.account.accountId && row.identity_login.toLowerCase() === identity.account.login.toLowerCase();
}
function digestGitHubPublicationRequest(params) {
	return createHash("sha256").update(JSON.stringify({
		sessionId: params.sessionId,
		idempotencyKey: params.idempotencyKey,
		title: params.title ?? null,
		body: params.body ?? null
	})).digest("hex");
}
function projectGitHubPublicationResult(row) {
	const effect = (row.last_effect === "push" || row.last_effect === "pull_request") && (row.effect_state === "dispatched" || row.effect_state === "observed") ? { effect: {
		kind: row.last_effect,
		status: row.effect_state,
		...row.head_commit ? { headCommit: row.head_commit } : {},
		...row.pull_request_url ? { url: row.pull_request_url } : {}
	} } : {};
	const common = {
		requestId: row.request_id,
		publisher: {
			source: row.identity_source === "personal" || row.identity_source === "agent-override" || row.identity_source === "system-configured" ? row.identity_source : "system-detected",
			accountId: row.identity_account_id,
			login: row.identity_login
		},
		...effect
	};
	if (row.status === "published" && row.pull_request_url && row.repository && row.branch) return {
		...common,
		status: "published",
		url: row.pull_request_url,
		repository: row.repository,
		branch: row.branch,
		headCommit: row.head_commit ?? "unknown"
	};
	if (row.status === "failed" && row.error_code && row.next_action) return {
		...common,
		status: "failed",
		code: publicationFailureCode(row.error_code),
		message: "GitHub publication failed.",
		nextAction: row.next_action
	};
	if (row.status === "needs_confirmation") return {
		...common,
		status: "needs_confirmation",
		message: "Confirm the original My GitHub account, target, and workspace to continue this interrupted publication. Already-dispatched GitHub effects may have completed; confirmation checks them before retrying."
	};
	return {
		...common,
		status: row.status === "publishing" ? "publishing" : "requested",
		message: row.status === "publishing" ? "The Gateway is publishing the reconciled workspace." : row.identity_source === "personal" ? "My GitHub publication was accepted for the selected account and workspace." : "Publication was accepted. Finish the turn so the Gateway can reconcile and publish the workspace."
	};
}
//#endregion
//#region src/gateway/github-repository-publication-store.ts
async function readPendingRepositoryGitHubPublication(input) {
	const context = captureOpenClawStateWorkerContext();
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
	return await executeOpenClawStateWorker(context, {
		type: "githubRepository.personalPending",
		input
	});
}
function terminalRepositoryGitHubPublication(row) {
	return row.status === "published" || row.status === "failed";
}
//#endregion
//#region src/gateway/github-personal-publication-store.ts
function personalGitHubRequestDigest(row) {
	return createHash("sha256").update(JSON.stringify([
		row.request_id,
		row.owner_profile_id,
		row.session_id,
		row.session_key,
		row.agent_id,
		row.idempotency_key,
		row.connection_generation,
		row.identity_source,
		row.identity_profile_id,
		row.identity_account_id,
		row.identity_login,
		row.worktree_id,
		row.repository_fingerprint,
		row.push_repository,
		row.repository,
		row.branch,
		row.base_branch,
		row.source_head_commit,
		row.source_index_tree,
		row.workspace_tree,
		row.title,
		row.body,
		row.created_at_ms
	])).digest("hex");
}
//#endregion
export { matchesGitHubPublicationIdentityRow as a, digestGitHubPublicationRequest as i, readPendingRepositoryGitHubPublication as n, projectGitHubPublicationResult as o, terminalRepositoryGitHubPublication as r, personalGitHubRequestDigest as t };
