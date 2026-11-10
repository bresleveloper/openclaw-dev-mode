import { i as sqlPublicationAnchor } from "./sql-connection-DmQzXTVz.mjs";
import { t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-22SfWsLt.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { a as deferSqliteWorkerCommitReceipt } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { d as ensureGitHubPublicationSessionLifecycleSchema, h as ensureRepositoryGitHubPublicationSchema, m as ensurePersonalGitHubPublicationSchema, u as ensureGitHubPublicationSchema } from "./openclaw-state-db-schema-additive-Dk7csa7u.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { n as emitSessionLifecycleEvent } from "./session-lifecycle-events-76OxWRqj.mjs";
import { i as githubPublicationReceipts, n as captureGitHubPublicationWorkerReceipt } from "./github-publication-receipts-WUg6AvYk.mjs";
import { c as resolvePersonalGitHubOwnerInDatabase } from "./user-github-connections.kernel-BAl3kDQK.mjs";
import { m as projectWorkerSessionTurnClaim } from "./placement-record-CBaaHws5.mjs";
import { s as readWorkerPlacementsInDatabase } from "./placement-row-codec-DhdW6tSs.mjs";
import { c as listPendingWorkerWorkspaceResultsInDatabase } from "./placement-workspace-result--lykq2r1.mjs";
import { n as encodeGitHubPublicationRequester, r as matchesGitHubPublicationRequester, t as decodeGitHubPublicationRequester } from "./github-publication-requester-DXNenk0m.mjs";
import { a as matchesGitHubPublicationIdentityRow, o as projectGitHubPublicationResult, r as terminalRepositoryGitHubPublication, t as personalGitHubRequestDigest } from "./github-personal-publication-store-B5tEN2Tb.mjs";
import { i as repositoryGitHubPublicationDigest, n as matchesRepositoryGitHubPublicationClaim, t as checkRepositoryGitHubPublication } from "./github-repository-publication.kernel-DPeRC71q.mjs";
import { a as assertGitHubPublicationConnectionSource, i as assertGitHubPublicationConnectionAdmissionSource, o as assertGitHubPublicationWorktreeSource, r as withGitHubPublicationSourceTransaction, t as assertGitHubPublicationWorkerSourceCurrent } from "./github-publication-source.worker-BorM-vVR.mjs";
import { t as listRepositoryGitHubPublicationsInDatabase } from "./github-repository-publication-read.worker-C5ryAbPm.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/state/github-publication-session-lifecycles.worker.ts
const table$2 = "github_publication_session_lifecycles";
const query$2 = (db) => getNodeSqliteKysely(db);
/** The receipt and its captured generation commit together; replay never rebinds it. */
function insertGitHubPublicationSessionLifecycle(db, input) {
	ensureGitHubPublicationSessionLifecycleSchema(db);
	const row = {
		publication_kind: input.publicationKind,
		request_id: input.requestId,
		lifecycle_revision: input.lifecycleRevision,
		requester_authority_json: input.requester ? encodeGitHubPublicationRequester(input.requester) : null
	};
	executeSqliteQuerySync(db, query$2(db).insertInto(table$2).values(row));
	githubPublicationReceipts.stageRow(sqlPublicationAnchor(db), `${input.publicationKind}-lifecycle`, row);
}
/** A missing binding is unproven; a retained NULL records an originally absent revision. */
function readGitHubPublicationSessionLifecycle(input, db) {
	return tableExists(db, table$2) ? executeSqliteQueryTakeFirstSync(db, query$2(db).selectFrom(table$2).select(["lifecycle_revision", "requester_authority_json"]).where("publication_kind", "=", input.publicationKind).where("request_id", "=", input.requestId)) : void 0;
}
//#endregion
//#region src/gateway/github-personal-publication-store.worker.ts
const table$1 = "github_personal_publication_requests";
const query$1 = (db) => getNodeSqliteKysely(db);
function assertOwner(db, owner) {
	if (resolvePersonalGitHubOwnerInDatabase(owner, db) !== owner) throw new Error("My GitHub publication owner changed.");
}
function readPersonalGitHubPublicationInDatabase(db, owner, request) {
	assertOwner(db, owner);
	if (!tableExists(db, table$1)) return;
	let selection = query$1(db).selectFrom(table$1).selectAll().where("owner_profile_id", "=", owner);
	selection = "requestId" in request ? selection.where("request_id", "=", request.requestId) : "sessionId" in request ? selection.where("session_id", "=", request.sessionId).where("idempotency_key", "=", request.idempotencyKey) : selection.where("session_key", "=", request.sessionKey).where("agent_id", "=", request.agentId).where("status", "in", [
		"requested",
		"publishing",
		"needs_confirmation"
	]).orderBy("created_at_ms", "desc").orderBy("request_id", "desc").limit(1);
	const row = executeSqliteQueryTakeFirstSync(db, selection);
	if (row && (row.identity_source !== "personal" || row.request_digest !== personalGitHubRequestDigest(row))) throw new Error("My GitHub publication receipt is corrupt; create a new publication request.");
	return row;
}
function insertPersonalGitHubPublicationInDatabase(database, row, lifecycleRevision, assertCurrent) {
	const { db } = database;
	assertCurrent();
	assertOwner(db, row.owner_profile_id);
	ensurePersonalGitHubPublicationSchema(db);
	executeSqliteQuerySync(db, query$1(db).insertInto(table$1).values(row));
	insertGitHubPublicationSessionLifecycle(db, {
		publicationKind: "personal",
		requestId: row.request_id,
		lifecycleRevision
	});
	githubPublicationReceipts.stageRow(db, "personal", row);
	return row;
}
function claimPersonalGitHubPublicationInDatabase(database, row, instanceId, executionId, assertCurrent) {
	const { db } = database;
	assertCurrent();
	assertOwner(db, row.owner_profile_id);
	const update = executeSqliteQueryTakeFirstSync(db, query$1(db).updateTable(table$1).set({
		status: "publishing",
		gateway_instance_id: instanceId,
		execution_id: executionId,
		updated_at_ms: Date.now()
	}).where("owner_profile_id", "=", row.owner_profile_id).where("request_id", "=", row.request_id).where("request_digest", "=", row.request_digest).where("status", "=", row.status).where("execution_id", row.execution_id === null ? "is" : "=", row.execution_id).returningAll());
	if (!update) throw new Error("My GitHub publication execution changed.");
	if (update.identity_source !== "personal" || update.request_digest !== personalGitHubRequestDigest(update)) throw new Error("My GitHub publication receipt changed during execution.");
	githubPublicationReceipts.stageRow(db, "personal", update);
	return {
		...update,
		gateway_instance_id: instanceId,
		execution_id: executionId
	};
}
/** One execution closure owns writes; a later socket must explicitly confirm before claiming. */
function writePersonalGitHubPublicationInDatabase(database, row, instanceId, executionId, values, requireAction, assertCurrent) {
	const { db } = database;
	if (requireAction) assertCurrent();
	const updated = executeSqliteQueryTakeFirstSync(db, query$1(db).updateTable(table$1).set({
		...values,
		updated_at_ms: Date.now()
	}).where("owner_profile_id", "=", row.owner_profile_id).where("request_id", "=", row.request_id).where("request_digest", "=", row.request_digest).where("status", "=", "publishing").where("gateway_instance_id", "=", instanceId).where("execution_id", "=", executionId).returningAll());
	if (!updated) throw new Error("My GitHub publication execution is no longer current.");
	githubPublicationReceipts.stageRow(db, "personal", updated);
	return updated;
}
function requirePersonalGitHubPublicationConfirmationInDatabase(database, instanceId) {
	if (!tableExists(database.db, table$1)) return [];
	const { db } = database;
	const rows = executeSqliteQuerySync(db, query$1(db).updateTable(table$1).set({
		status: "needs_confirmation",
		updated_at_ms: Date.now()
	}).where("status", "in", ["requested", "publishing"]).where((eb) => eb.or([eb("gateway_instance_id", "is", null), eb("gateway_instance_id", "!=", instanceId)])).returningAll()).rows;
	for (const row of rows) githubPublicationReceipts.stageRow(db, "personal", row);
	return rows;
}
function listUnreportedPersonalGitHubPublicationsInDatabase(db) {
	if (!tableExists(db, table$1)) return [];
	return executeSqliteQuerySync(db, query$1(db).selectFrom(table$1).selectAll().where("status", "in", ["published", "failed"]).where("reported_at_ms", "is", null).orderBy("updated_at_ms")).rows.map((row) => {
		if (row.request_digest !== personalGitHubRequestDigest(row)) throw new Error("My GitHub publication receipt is corrupt; reconnect and create a new request.");
		return {
			sessionId: row.session_id,
			sessionKey: row.session_key,
			agentId: row.agent_id,
			result: projectGitHubPublicationResult(row)
		};
	});
}
function markPersonalGitHubPublicationReportedInDatabase(database, requestId) {
	if (!tableExists(database.db, table$1)) return;
	const { db } = database;
	const row = executeSqliteQueryTakeFirstSync(db, query$1(db).updateTable(table$1).set({ reported_at_ms: Date.now() }).where("request_id", "=", requestId).where("status", "in", ["published", "failed"]).returningAll());
	if (row) githubPublicationReceipts.stageRow(db, "personal", row);
	return row;
}
//#endregion
//#region src/gateway/github-publication-events.ts
const workerChanges = new AsyncLocalStorage();
/** A worker carries the native owner's exact notifications with its commit receipt. */
function captureGitHubPublicationChanges(operation) {
	const changes = [];
	return {
		value: workerChanges.run(changes, operation),
		changes
	};
}
/** The existing transaction owner discards these observers on rollback, including savepoints. */
function deferSharedGitHubPublicationChanged(db, row) {
	if (row.identity_source === "personal" || row.owner_profile_id != null) return;
	const captured = workerChanges.getStore();
	if (captured) {
		captured.push({
			sessionKey: row.session_key,
			agentId: row.agent_id
		});
		return;
	}
	deferSqlitePostCommitPublication(db, () => {
		emitSessionLifecycleEvent({
			sessionKey: row.session_key,
			agentId: row.agent_id,
			reason: "github-publication"
		});
	});
}
//#endregion
//#region src/gateway/github-publication-store.worker.ts
const githubPublicationDatabase = (db) => getNodeSqliteKysely(db);
function readGitHubPublicationRequest(db, request) {
	const query = githubPublicationDatabase(db).selectFrom("github_publication_requests").selectAll();
	return executeSqliteQueryTakeFirstSync(db, "requestId" in request ? query.where("request_id", "=", request.requestId) : query.where("session_id", "=", request.sessionId).where("idempotency_key", "=", request.idempotencyKey));
}
function listGitHubPublicationsForClaimInDatabase(db, claim, options = {}) {
	if (!tableExists(db, "github_publication_requests")) return [];
	let query = githubPublicationDatabase(db).selectFrom("github_publication_requests").selectAll().where("session_id", "=", claim.sessionId).where("claim_id", "=", claim.claimId).where("run_id", "=", claim.runId).orderBy("created_at_ms");
	if (options.pendingOnly) query = query.where("status", "in", ["requested", "publishing"]);
	return executeSqliteQuerySync(db, query).rows;
}
function listSharedGitHubPublicationsInDatabase(db, filter) {
	if (!tableExists(db, "github_publication_requests")) return [];
	let query = githubPublicationDatabase(db).selectFrom("github_publication_requests").selectAll();
	if (filter.pending !== void 0) query = query.where("status", "in", filter.pending ? ["requested", "publishing"] : ["published", "failed"]);
	if (filter.status !== void 0) query = query.where("status", "=", filter.status);
	if (filter.claimNull !== void 0) query = query.where("claim_id", filter.claimNull ? "is" : "is not", null);
	if (filter.sessionId !== void 0) query = query.where("session_id", "=", filter.sessionId);
	if (filter.unreported) query = query.where("reported_at_ms", "is", null);
	return executeSqliteQuerySync(db, query.orderBy(filter.unreported ? "updated_at_ms" : "created_at_ms")).rows;
}
function markSharedGitHubPublicationReportedInDatabase(database, requestId) {
	if (!tableExists(database.db, "github_publication_requests")) return;
	const { db } = database;
	const updated = executeSqliteQueryTakeFirstSync(db, githubPublicationDatabase(db).updateTable("github_publication_requests").set({
		reported_at_ms: Date.now(),
		updated_at_ms: Date.now()
	}).where("request_id", "=", requestId).where("reported_at_ms", "is", null).returningAll());
	if (updated) githubPublicationReceipts.stageRow(db, "shared", updated);
	return updated;
}
function assertSharedGitHubPublicationClaimInDatabase(db, request) {
	const row = executeSqliteQuerySync(db, githubPublicationDatabase(db).selectFrom("worker_session_placements").select([
		"agent_id",
		"session_key",
		"state",
		"environment_id",
		"active_owner_epoch",
		"turn_claim_owner",
		"turn_claim_id",
		"turn_claim_run_id",
		"turn_claim_generation",
		"turn_claim_owner_epoch"
	]).where("session_id", "=", request.claim.sessionId)).rows[0];
	const ownerMatches = request.claim.owner.kind === "worker" ? row?.turn_claim_owner === "worker" && row.environment_id === request.claim.owner.environmentId && row.active_owner_epoch === request.claim.owner.ownerEpoch && row.turn_claim_owner_epoch === request.claim.owner.ownerEpoch : row?.turn_claim_owner === "local";
	if (!row || row.state !== "active" && row.state !== "draining" && row.state !== "local" || row.agent_id !== request.agentId || row.session_key !== request.sessionKey || row.turn_claim_id !== request.claim.claimId || row.turn_claim_run_id !== request.claim.runId || row.turn_claim_generation !== request.claim.placementGeneration || !ownerMatches) throw new Error("GitHub publication turn authority changed before recording.");
}
function claimGitHubPublicationExecutionInDatabase(database, requestId, gatewayInstanceId) {
	const { db } = database;
	const query = githubPublicationDatabase(db);
	const current = readGitHubPublicationRequest(db, { requestId });
	if (!current) throw new Error("GitHub publication request disappeared.");
	if (current.status === "published" || current.status === "failed") return current;
	let update = query.updateTable("github_publication_requests").set({
		status: "publishing",
		gateway_instance_id: gatewayInstanceId,
		updated_at_ms: Date.now()
	}).where("request_id", "=", current.request_id).where("status", "=", current.status);
	update = current.gateway_instance_id ? update.where("gateway_instance_id", "=", current.gateway_instance_id) : update.where("gateway_instance_id", "is", null);
	const claimed = executeSqliteQueryTakeFirstSync(db, update.returningAll());
	if (!claimed) throw new Error("GitHub publication execution ownership changed.");
	githubPublicationReceipts.stageRow(db, "shared", claimed);
	deferSharedGitHubPublicationChanged(db, claimed);
	return claimed;
}
/** Insert/replay shared intent inside the caller's admission transaction. */
function insertGitHubPublicationRequest(db, input) {
	input.assertCurrent();
	const { request, identity, worktree, claim, snapshot } = input;
	const query = githubPublicationDatabase(db);
	const inserted = executeSqliteQuerySync(db, query.insertInto("github_publication_requests").values({
		request_id: input.requestId,
		idempotency_key: request.idempotencyKey,
		request_digest: input.requestDigest,
		session_id: input.sessionId,
		session_key: request.sessionKey,
		agent_id: request.agentId,
		worktree_id: worktree.id,
		repository_fingerprint: worktree.repoFingerprint,
		claim_id: claim?.claimId ?? null,
		run_id: claim?.runId ?? null,
		environment_id: claim?.owner.environmentId ?? null,
		owner_epoch: claim?.owner.ownerEpoch ?? null,
		placement_generation: claim?.placementGeneration ?? null,
		identity_source: identity.source,
		identity_profile_id: identity.profileId ?? null,
		identity_account_id: identity.account.accountId,
		identity_login: identity.account.login,
		title: request.title ?? null,
		body: request.body ?? null,
		branch: worktree.branch,
		source_head_commit: snapshot?.sourceHeadCommit ?? null,
		source_index_tree: snapshot?.sourceIndexTree ?? null,
		workspace_tree: snapshot?.workspaceTree ?? null,
		created_at_ms: input.now,
		status: "requested",
		updated_at_ms: input.now
	}).onConflict((conflict) => conflict.columns(["session_id", "idempotency_key"]).doNothing()));
	if (inserted.numAffectedRows === 1n) insertGitHubPublicationSessionLifecycle(db, {
		publicationKind: "shared",
		requestId: input.requestId,
		lifecycleRevision: input.lifecycleRevision,
		requester: input.requester
	});
	const stored = readGitHubPublicationRequest(db, {
		sessionId: input.sessionId,
		idempotencyKey: request.idempotencyKey
	});
	if (!stored || stored.request_digest !== input.requestDigest || !matchesGitHubPublicationIdentityRow(stored, identity) || stored.worktree_id !== worktree.id || stored.repository_fingerprint !== worktree.repoFingerprint || stored.branch !== worktree.branch) throw new Error("GitHub publication idempotency key was reused.");
	if (stored.status !== "published" && stored.status !== "failed") {
		const requester = decodeGitHubPublicationRequester(readGitHubPublicationSessionLifecycle({
			publicationKind: "shared",
			requestId: stored.request_id
		}, db)?.requester_authority_json);
		if (!requester || !matchesGitHubPublicationRequester(requester, input.requester)) throw new Error("GitHub publication requester changed; use a new idempotency key.");
	}
	input.assertCurrent();
	if (inserted.numAffectedRows === 1n) {
		githubPublicationReceipts.stageRow(db, "shared", stored);
		deferSharedGitHubPublicationChanged(db, stored);
	}
	return stored;
}
function writeGitHubPublicationExecutionInDatabase(database, instanceId, row, values, transition) {
	const errors = {
		"bind-workspace": "GitHub publication workspace snapshot changed before execution.",
		begin: "GitHub publication state changed before execution.",
		complete: "GitHub publication state changed before completion."
	};
	const { db } = database;
	if (!values) throw new Error("GitHub publication terminal result is invalid.");
	let update = githubPublicationDatabase(db).updateTable("github_publication_requests").set({
		...values,
		updated_at_ms: Date.now()
	}).where("request_id", "=", row.request_id).where("status", "=", "publishing").where("gateway_instance_id", "=", instanceId);
	if (transition === "bind-workspace") update = update.where("source_head_commit", "is", null).where("source_index_tree", "is", null).where("workspace_tree", "is", null);
	const updated = executeSqliteQueryTakeFirstSync(db, update.returningAll());
	if (!updated) throw new Error(errors[transition]);
	githubPublicationReceipts.stageRow(db, "shared", updated);
	deferSharedGitHubPublicationChanged(db, updated);
	return updated;
}
function createGitHubPublicationExecutionStoreInDatabase(database, instanceId) {
	return createSharedExecutionTransitions((row, values, transition) => writeGitHubPublicationExecutionInDatabase(database, instanceId, row, values, transition));
}
function createSharedExecutionTransitions(write) {
	return {
		bindWorkspaceSnapshot: (input) => {
			return write(input.row, {
				source_head_commit: input.sourceHeadCommit,
				source_index_tree: input.sourceIndexTree,
				workspace_tree: input.workspaceTree
			}, "bind-workspace");
		},
		updatePublishingFacts: (input) => {
			return write(input.row, {
				repository: input.repository,
				branch: input.branch,
				base_branch: input.baseBranch,
				source_head_commit: input.sourceHeadCommit,
				workspace_tree: input.workspaceTree,
				head_commit: input.headCommit
			}, "begin");
		},
		complete: (row, result) => {
			return write(row, result.status === "published" ? {
				status: "published",
				pull_request_url: result.url,
				repository: result.repository,
				branch: result.branch,
				head_commit: result.headCommit,
				error_code: null,
				next_action: null
			} : result.status === "failed" ? {
				status: "failed",
				pull_request_url: null,
				error_code: result.code,
				next_action: result.nextAction
			} : void 0, "complete");
		}
	};
}
const sharedGitHubPublicationAuthorityColumns = [
	"request_id",
	"idempotency_key",
	"request_digest",
	"session_id",
	"session_key",
	"agent_id",
	"worktree_id",
	"repository_fingerprint",
	"claim_id",
	"run_id",
	"environment_id",
	"owner_epoch",
	"placement_generation",
	"identity_source",
	"identity_profile_id",
	"identity_account_id",
	"identity_login",
	"status",
	"gateway_instance_id",
	"repository",
	"branch",
	"base_branch",
	"source_head_commit",
	"source_index_tree",
	"workspace_tree",
	"head_commit",
	"pull_request_url",
	"error_code",
	"created_at_ms",
	"updated_at_ms",
	"reported_at_ms"
];
function deferGitHubPublicationRequestsInDatabase(database, requestIds) {
	if (requestIds.length === 0) return;
	const { db } = database;
	const query = githubPublicationDatabase(db);
	const updatedAtMs = Date.now();
	for (const requestId of requestIds) {
		const changed = executeSqliteQuerySync(db, query.updateTable("github_publication_requests").set({
			claim_id: null,
			run_id: null,
			environment_id: null,
			owner_epoch: null,
			placement_generation: null,
			status: "requested",
			gateway_instance_id: null,
			updated_at_ms: updatedAtMs
		}).where("request_id", "=", requestId).where("status", "in", ["requested", "publishing"]).returning(sharedGitHubPublicationAuthorityColumns)).rows;
		for (const row of changed) {
			githubPublicationReceipts.stageRow(db, "shared", row);
			deferSharedGitHubPublicationChanged(db, row);
		}
	}
}
function bindAcceptedGitHubPublicationClaimSnapshotInDatabase(database, input) {
	const { db } = database;
	assertSharedGitHubPublicationClaimInDatabase(db, {
		claim: input.claim,
		sessionKey: input.row.session_key,
		agentId: input.row.agent_id
	});
	const query = githubPublicationDatabase(db);
	const current = readGitHubPublicationRequest(db, { requestId: input.row.request_id });
	if (!current || current.claim_id !== input.claim.claimId || current.run_id !== input.claim.runId || current.status !== "requested" && current.status !== "publishing") throw new Error("GitHub publication workspace snapshot owner changed.");
	if (current.source_head_commit || current.source_index_tree || current.workspace_tree) {
		if (current.source_head_commit !== input.sourceHeadCommit || current.source_index_tree !== input.sourceIndexTree || current.workspace_tree !== input.workspaceTree) throw new Error("GitHub publication accepted workspace snapshot changed.");
		return current;
	}
	const updated = executeSqliteQueryTakeFirstSync(db, query.updateTable("github_publication_requests").set({
		source_head_commit: input.sourceHeadCommit,
		source_index_tree: input.sourceIndexTree,
		workspace_tree: input.workspaceTree,
		updated_at_ms: Date.now()
	}).where("request_id", "=", input.row.request_id).where("source_head_commit", "is", null).where("source_index_tree", "is", null).where("workspace_tree", "is", null).returningAll());
	if (!updated) throw new Error("GitHub publication accepted workspace snapshot changed.");
	githubPublicationReceipts.stageRow(db, "shared", updated);
	deferSharedGitHubPublicationChanged(db, updated);
	return updated;
}
//#endregion
//#region src/gateway/github-publication-defer.worker.ts
/** Selection shares the destination transaction with deferral, including pending-result custody. */
function selectGitHubPublicationDeferralsInDatabase(db, kind, selection) {
	if (selection.kind === "request") {
		if (kind !== "shared") throw new Error("Exact deferral requires a shared GitHub publication.");
		const expected = selection.row;
		const current = readGitHubPublicationRequest(db, { requestId: expected.request_id });
		return current && current.request_digest === expected.request_digest && current.claim_id === expected.claim_id && current.run_id === expected.run_id && current.environment_id === expected.environment_id && current.owner_epoch === expected.owner_epoch && current.placement_generation === expected.placement_generation && current.gateway_instance_id === expected.gateway_instance_id && (current.status === "requested" || current.status === "publishing") ? [current.request_id] : [];
	}
	if (selection.kind === "claim" || selection.kind === "claimMissingSnapshot") {
		if (selection.kind === "claimMissingSnapshot") {
			if (kind !== "shared") throw new Error("Missing-snapshot deferral requires a shared GitHub publication.");
			return listGitHubPublicationsForClaimInDatabase(db, selection.claim, { pendingOnly: true }).filter((row) => !row.source_head_commit || !row.source_index_tree || !row.workspace_tree).map((row) => row.request_id);
		}
		return (kind === "shared" ? listGitHubPublicationsForClaimInDatabase(db, selection.claim, { pendingOnly: true }) : listRepositoryGitHubPublicationsInDatabase(db, {
			sessionId: selection.claim.sessionId,
			ownerProfileId: null,
			pending: true
		}).filter((row) => matchesRepositoryGitHubPublicationClaim(row, selection.claim))).map((row) => row.request_id);
	}
	const rows = kind === "shared" ? listSharedGitHubPublicationsInDatabase(db, { pending: true }) : listRepositoryGitHubPublicationsInDatabase(db, {
		ownerProfileId: null,
		pending: true
	});
	if (!rows.length) return [];
	const pending = new Set(listPendingWorkerWorkspaceResultsInDatabase(db).map((row) => `${row.sessionId}\0${row.claimId}\0${row.runId}`));
	const placements = new Map(readWorkerPlacementsInDatabase(db, rows.map((row) => row.session_id)).map((row) => [row.sessionId, row]));
	return rows.flatMap((row) => {
		if (!row.claim_id || pending.has(`${row.session_id}\0${row.claim_id}\0${row.run_id}`)) return [];
		const placement = placements.get(row.session_id);
		const claim = placement?.turnClaim;
		let live = claim?.claimId === row.claim_id && claim.runId === row.run_id && claim.generation === row.placement_generation;
		if (kind === "repository" && live) live = Boolean(placement && (claim?.owner === "local" || projectWorkerSessionTurnClaim(placement)) && row.environment_id !== null && row.owner_epoch !== null && row.environment_id === placement.environmentId && row.owner_epoch === placement.activeOwnerEpoch);
		return live ? [] : [row.request_id];
	});
}
//#endregion
//#region src/gateway/github-publication-execution-effects.ts
/** Effect observations retain custody but never restore permission for another action. */
function githubPublicationEffectFacts(transition, interruptedStatus) {
	switch (transition.operation) {
		case "updateHead": return {
			values: { head_commit: transition.headCommit },
			requireAction: true
		};
		case "complete": {
			const { result } = transition;
			if (result.status === "published") return {
				values: {
					status: "published",
					head_commit: result.headCommit,
					pull_request_url: result.url,
					error_code: null,
					next_action: null
				},
				requireAction: false
			};
			if (result.status !== "failed") throw new Error("GitHub publication result is not terminal.");
			return {
				values: {
					status: "failed",
					error_code: result.code,
					next_action: result.nextAction
				},
				requireAction: result.code !== "session_changed" && (result.code !== "identity_changed" || interruptedStatus === "needs_confirmation")
			};
		}
		case "recordEffect": {
			const { effect, observed } = transition;
			return {
				values: {
					last_effect: effect,
					effect_state: observed?.headCommit || observed?.url ? "observed" : "dispatched",
					...observed?.headCommit ? { head_commit: observed.headCommit } : {},
					...observed?.url ? { pull_request_url: observed.url } : {}
				},
				requireAction: !observed
			};
		}
		case "interrupt": return {
			values: {
				status: interruptedStatus,
				error_code: null,
				next_action: null
			},
			requireAction: false
		};
	}
	throw new Error("Unknown GitHub publication effect transition.");
}
//#endregion
//#region src/gateway/github-repository-publication-store.worker.ts
const checkpointColumns = [
	"checkpoint_ref",
	"checkpoint_digest",
	"source_head_commit",
	"source_index_tree",
	"workspace_tree"
];
const table = "github_repository_publication_requests";
const query = (db) => getNodeSqliteKysely(db);
function changed(db, row) {
	checkRepositoryGitHubPublication(row);
	githubPublicationReceipts.stageRow(db, "repository", row);
	deferSharedGitHubPublicationChanged(db, row);
	return row;
}
function readRepositoryGitHubPublicationBranchInDatabase(db, input) {
	const rows = listRepositoryGitHubPublicationsInDatabase(db, { workspaceId: input.workspaceId }).filter((row) => row.branch === input.branch && row.push_repository === input.pushRepository);
	const pushed = rows.filter((row) => row.pushed_head_commit !== null);
	const ancestors = new Set(pushed.map((row) => row.previous_head_commit));
	return {
		head: pushed.findLast((row) => !ancestors.has(row.pushed_head_commit)),
		unsettled: rows.some((row) => !terminalRepositoryGitHubPublication(row) && row.effect_state === "dispatched")
	};
}
function readRepositoryGitHubPublicationInDatabase(db, requestId) {
	if (!tableExists(db, table)) return;
	const row = executeSqliteQueryTakeFirstSync(db, query(db).selectFrom(table).selectAll().where("request_id", "=", requestId));
	return row ? checkRepositoryGitHubPublication(row) : void 0;
}
function insertRepositoryGitHubPublicationInDatabase(database, row, assertCurrent) {
	const { db } = database;
	assertCurrent();
	ensureRepositoryGitHubPublicationSchema(db);
	checkRepositoryGitHubPublication(row);
	const inserted = executeSqliteQuerySync(db, query(db).insertInto(table).values(row).onConflict((conflict) => conflict.doNothing()));
	const stored = executeSqliteQueryTakeFirstSync(db, query(db).selectFrom(table).selectAll().where("session_id", "=", row.session_id).where("idempotency_key", "=", row.idempotency_key).where("owner_profile_id", row.owner_profile_id === null ? "is" : "=", row.owner_profile_id));
	if (!stored || [
		"session_key",
		"session_lifecycle_revision",
		"agent_id",
		"workspace_id",
		"owner_profile_id",
		"connection_generation",
		"identity_source",
		"identity_profile_id",
		"identity_account_id",
		"identity_login",
		"title",
		"body",
		"claim_id",
		"run_id",
		"placement_generation",
		"environment_id",
		"owner_epoch"
	].some((key) => stored[key] !== row[key])) throw new Error("GitHub publication idempotency key was reused.");
	if (stored.requester_authority_json !== row.requester_authority_json) {
		const original = decodeGitHubPublicationRequester(stored.requester_authority_json);
		const current = decodeGitHubPublicationRequester(row.requester_authority_json);
		if (!original || !current || !matchesGitHubPublicationRequester(original, current)) throw new Error("GitHub publication idempotency key was reused.");
	}
	checkRepositoryGitHubPublication(stored);
	assertCurrent();
	if (inserted.numAffectedRows === 1n) {
		githubPublicationReceipts.stageRow(db, "repository", stored);
		deferSharedGitHubPublicationChanged(db, stored);
	}
	return stored;
}
function bindRepositoryGitHubPublicationCheckpointInDatabase(database, row, checkpoint, assertCurrent) {
	const { db } = database;
	assertCurrent();
	const current = readRepositoryGitHubPublicationInDatabase(db, row.request_id);
	if (!current || current.request_digest !== row.request_digest || current.status !== "requested") throw new Error("GitHub publication checkpoint owner changed.");
	if (current.checkpoint_ref !== null) {
		if (checkpointColumns.some((key) => current[key] !== checkpoint[key])) throw new Error("GitHub publication accepted checkpoint changed.");
		return current;
	}
	const bound = {
		...current,
		...checkpoint,
		updated_at_ms: Date.now()
	};
	bound.request_digest = repositoryGitHubPublicationDigest(bound);
	const updated = executeSqliteQueryTakeFirstSync(db, query(db).updateTable(table).set(bound).where("request_id", "=", row.request_id).where("checkpoint_ref", "is", null).where("request_digest", "=", current.request_digest).returningAll());
	if (!updated) throw new Error("GitHub publication checkpoint ownership changed.");
	assertCurrent();
	return changed(db, updated);
}
function failRepositoryGitHubPublicationPreparationInDatabase(database, row, nextAction, assertCurrent) {
	const { db } = database;
	assertCurrent();
	const updated = executeSqliteQueryTakeFirstSync(db, query(db).updateTable(table).set({
		status: "failed",
		error_code: "unavailable",
		next_action: nextAction,
		updated_at_ms: Date.now()
	}).where("request_id", "=", row.request_id).where("request_digest", "=", row.request_digest).where("status", "=", "requested").where("checkpoint_ref", "is", null).where("execution_id", "is", null).returningAll());
	if (!updated) throw new Error("GitHub publication preparation owner changed.");
	assertCurrent();
	return changed(db, updated);
}
function writeRepositoryGitHubPublicationInDatabase(database, row, instanceId, executionId, values, requireAction, authority) {
	const { db } = database;
	if (requireAction) {
		authority.assertCustody();
		authority.assertCurrent();
		if (!row.checkpoint_ref || !row.checkpoint_digest || !row.workspace_tree) throw new Error("GitHub publication requires its accepted checkpoint.");
	}
	const updated = executeSqliteQueryTakeFirstSync(db, query(db).updateTable(table).set((eb) => ({
		...values.last_effect === "push" && values.head_commit ? {
			last_effect: "push",
			effect_state: "observed",
			head_commit: values.head_commit,
			pushed_head_commit: values.head_commit
		} : values,
		...values.last_effect === "push" ? {
			last_effect: eb.case().when("last_effect", "=", "pull_request").then(eb.ref("last_effect")).else(values.last_effect).end(),
			effect_state: eb.case().when("last_effect", "=", "pull_request").then(eb.ref("effect_state")).else(values.head_commit ? "observed" : values.effect_state ?? null).end()
		} : {},
		updated_at_ms: Date.now()
	})).where("request_id", "=", row.request_id).where("request_digest", "=", row.request_digest).where("status", "=", "publishing").where("gateway_instance_id", "=", instanceId).where("execution_id", "=", executionId).returningAll());
	if (!updated) throw new Error("GitHub publication execution is no longer current.");
	if (requireAction) {
		authority.assertCustody();
		authority.assertCurrent();
	}
	return changed(db, updated);
}
function claimRepositoryGitHubPublicationInDatabase(database, row, instanceId, executionId, authority) {
	const { db } = database;
	authority.assertCustody();
	if (terminalRepositoryGitHubPublication(row)) throw new Error("GitHub publication receipt changed.");
	const updated = executeSqliteQueryTakeFirstSync(db, query(db).updateTable(table).set({
		status: "publishing",
		gateway_instance_id: instanceId,
		execution_id: executionId,
		updated_at_ms: Date.now()
	}).where("request_id", "=", row.request_id).where("request_digest", "=", row.request_digest).where("status", "=", row.status).where("execution_id", row.execution_id === null ? "is" : "=", row.execution_id).returningAll());
	if (!updated) throw new Error("GitHub publication execution changed.");
	authority.assertCustody();
	return changed(db, updated);
}
function markRepositoryGitHubPublicationReportedInDatabase(database, requestId) {
	if (!tableExists(database.db, table)) return;
	const { db } = database;
	const row = executeSqliteQueryTakeFirstSync(db, query(db).updateTable(table).set({ reported_at_ms: Date.now() }).where("request_id", "=", requestId).where("status", "in", ["published", "failed"]).returningAll());
	if (row) githubPublicationReceipts.stageRow(db, "repository", row);
	return row;
}
function failStaleRepositoryGitHubPublicationInDatabase(database, row, sessionIsCurrent) {
	const { db } = database;
	const current = readRepositoryGitHubPublicationInDatabase(db, row.request_id);
	if (!current || terminalRepositoryGitHubPublication(current) || current.request_digest !== row.request_digest || sessionIsCurrent()) return;
	const updated = executeSqliteQueryTakeFirstSync(db, query(db).updateTable(table).set({
		status: "failed",
		error_code: "session_changed",
		next_action: "Review any recorded GitHub effects, then request publication from a current session.",
		execution_id: null,
		gateway_instance_id: null,
		updated_at_ms: Date.now()
	}).where("request_id", "=", row.request_id).where("request_digest", "=", row.request_digest).returningAll());
	if (updated) return changed(db, updated);
}
function deferRepositoryGitHubPublicationClaimsInDatabase(database, requestIds) {
	if (requestIds.length === 0) return [];
	const { db } = database;
	const updated = executeSqliteQuerySync(db, query(db).updateTable(table).set({
		claim_id: null,
		run_id: null,
		environment_id: null,
		owner_epoch: null,
		placement_generation: null,
		updated_at_ms: Date.now()
	}).where("request_id", "in", requestIds).where("owner_profile_id", "is", null).where("status", "in", ["requested", "publishing"]).returningAll()).rows;
	for (const row of updated) changed(db, row);
	return updated;
}
//#endregion
//#region src/state/github-publication-request.worker.ts
function assertRepositoryClaim(row, placement) {
	if (row.claim_id === null) return;
	if (!placement || placement.session_id !== row.session_id || placement.agent_id !== row.agent_id || placement.session_key !== row.session_key || ![
		"active",
		"draining",
		"local"
	].includes(placement.state) || placement.turn_claim_id !== row.claim_id || placement.turn_claim_run_id !== row.run_id || placement.turn_claim_generation !== row.placement_generation || placement.turn_claim_owner !== "local" && (placement.turn_claim_owner !== "worker" || placement.environment_id !== row.environment_id || placement.active_owner_epoch !== row.owner_epoch || placement.turn_claim_owner_epoch !== row.owner_epoch)) throw new Error("GitHub publication requested turn claim changed.");
}
function assertRequestedSource(input, source) {
	const { selector } = source;
	const session = input.kind === "shared" ? {
		sessionId: input.input.sessionId,
		sessionKey: input.input.request.sessionKey,
		agentId: input.input.request.agentId,
		lifecycleRevision: input.input.lifecycleRevision
	} : {
		sessionId: input.row.session_id,
		sessionKey: input.row.session_key,
		agentId: input.row.agent_id,
		lifecycleRevision: input.kind === "personal" ? input.lifecycleRevision : input.row.session_lifecycle_revision
	};
	if (selector.sessionId !== session.sessionId || selector.sessionKey !== session.sessionKey || selector.agentId !== session.agentId || selector.lifecycleRevision !== session.lifecycleRevision) throw new Error("GitHub publication requested session changed.");
	if (input.kind === "shared") {
		assertGitHubPublicationWorktreeSource(source, input.input.worktree);
		const actor = input.input.requester.actor;
		if ((actor.kind === "operator" ? actor.profileId : void 0) !== selector.profileId) throw new Error("GitHub publication requested actor changed.");
		return;
	}
	const { row } = input;
	if (input.kind === "personal") {
		assertGitHubPublicationWorktreeSource(source, {
			id: input.row.worktree_id,
			repoFingerprint: input.row.repository_fingerprint,
			branch: row.branch
		});
		assertGitHubPublicationConnectionAdmissionSource(source, input.row);
		return;
	}
	const workspace = source.expected.repositoryWorkspace;
	if (selector.repositoryWorkspaceId !== input.row.workspace_id || workspace?.workspaceId !== input.row.workspace_id || workspace.branch !== row.branch || workspace.agentId !== row.agent_id || workspace.sessionKey !== row.session_key) throw new Error("GitHub publication requested repository changed.");
	if (input.row.owner_profile_id !== null) {
		if (input.row.connection_generation === null || input.row.identity_profile_id === null) throw new Error("GitHub publication requested connection is unavailable.");
		assertGitHubPublicationConnectionAdmissionSource(source, {
			...input.row,
			owner_profile_id: input.row.owner_profile_id,
			connection_generation: input.row.connection_generation,
			identity_profile_id: input.row.identity_profile_id
		});
	}
	assertRepositoryClaim(input.row, source.expected.placement);
}
const publicationRequestOperations = { "githubPublications.insert": (input, { open }) => {
	const database = open();
	if (input.kind === "shared") ensureGitHubPublicationSchema(database.db);
	return withGitHubPublicationSourceTransaction(database, input.source, () => {
		const assertCurrent = () => assertGitHubPublicationWorkerSourceCurrent(database.db);
		assertCurrent();
		assertRequestedSource(input, input.source);
		const write = () => {
			const identity = {
				operationId: input.operationId,
				operation: input.operation
			};
			switch (input.kind) {
				case "shared": {
					const claim = input.input.claim;
					if (claim) {
						if (claim.sessionId !== input.input.sessionId) throw new Error("GitHub publication requested turn session changed.");
						assertSharedGitHubPublicationClaimInDatabase(database.db, {
							claim,
							sessionKey: input.input.request.sessionKey,
							agentId: input.input.request.agentId
						});
					}
					const row = insertGitHubPublicationRequest(database.db, {
						...input.input,
						assertCurrent
					});
					if (claim && (row.claim_id !== claim.claimId || row.run_id !== claim.runId || row.placement_generation !== claim.placementGeneration || row.environment_id !== (claim.owner.environmentId ?? null) || row.owner_epoch !== (claim.owner.ownerEpoch ?? null))) throw new Error("GitHub publication idempotency key was reused.");
					return {
						...identity,
						kind: "shared",
						rows: [row]
					};
				}
				case "personal": return {
					...identity,
					kind: "personal",
					rows: [insertPersonalGitHubPublicationInDatabase(database, input.row, input.lifecycleRevision, assertCurrent)]
				};
				case "repository": return {
					...identity,
					kind: "repository",
					rows: [insertRepositoryGitHubPublicationInDatabase(database, input.row, assertCurrent)]
				};
			}
			throw new Error("Unknown GitHub publication request kind.");
		};
		const receipt = captureGitHubPublicationWorkerReceipt(sqlPublicationAnchor(database.db), () => {
			const { value, changes } = captureGitHubPublicationChanges(write);
			return {
				...value,
				changes
			};
		});
		assertCurrent();
		deferSqliteWorkerCommitReceipt(sqlPublicationAnchor(database.db), receipt);
		return receipt;
	});
} };
//#endregion
//#region src/state/github-publication.read.worker.ts
const publicationReadOperations = {
	"githubPublications.sharedRead": (input, { open }) => {
		const { db } = open();
		return {
			type: "githubPublications.sharedRead",
			row: tableExists(db, "github_publication_requests") ? readGitHubPublicationRequest(db, input) : void 0
		};
	},
	"githubPublications.sharedList": (input, { open }) => ({
		type: "githubPublications.sharedList",
		rows: listSharedGitHubPublicationsInDatabase(open().db, input)
	}),
	"githubPublications.claimRequests": (input, { open }) => ({
		type: "githubPublications.claimRequests",
		rows: listGitHubPublicationsForClaimInDatabase(open().db, input.claim, input)
	}),
	"githubPublications.personalRead": (input, { open }) => ({
		type: "githubPublications.personalRead",
		row: readPersonalGitHubPublicationInDatabase(open().db, input.owner, input.request)
	}),
	"githubPublications.unreported": (_input, { open }) => ({
		type: "githubPublications.unreported",
		rows: listUnreportedPersonalGitHubPublicationsInDatabase(open().db)
	}),
	"githubPublications.repositoryList": (input, { open }) => ({
		type: "githubPublications.repositoryList",
		rows: listRepositoryGitHubPublicationsInDatabase(open().db, input)
	}),
	"githubPublications.repositoryRead": ({ requestId }, { open }) => ({
		type: "githubPublications.repositoryRead",
		row: readRepositoryGitHubPublicationInDatabase(open().db, requestId)
	}),
	"githubPublications.branch": (input, { open }) => ({
		type: "githubPublications.branch",
		branch: readRepositoryGitHubPublicationBranchInDatabase(open().db, input)
	})
};
//#endregion
//#region src/state/github-publication.worker.ts
function assertCustody(database) {
	if (!database.db.isOpen || !database.db.isTransaction) throw new Error("GitHub publication lost its destination transaction.");
}
function requiresSource(kind, input) {
	if (input.operation === "claim") return kind === "personal";
	return input.operation === "bindWorkspaceSnapshot" || input.operation === "checkpoint";
}
function mutate(database, operation, write, source) {
	const capture = () => captureGitHubPublicationWorkerReceipt(sqlPublicationAnchor(database.db), () => {
		const { value, changes } = captureGitHubPublicationChanges(write);
		return {
			...value,
			changes
		};
	});
	if (source) return withGitHubPublicationSourceTransaction(database, source, () => {
		assertGitHubPublicationWorkerSourceCurrent(database.db);
		const receipt = capture();
		assertMutationSource(database, receipt, source);
		assertGitHubPublicationWorkerSourceCurrent(database.db);
		deferSqliteWorkerCommitReceipt(sqlPublicationAnchor(database.db), receipt);
		return receipt;
	});
	return runOpenClawStateWriteTransaction(({ db }) => {
		const receipt = capture();
		deferSqliteWorkerCommitReceipt(sqlPublicationAnchor(db), receipt);
		return receipt;
	}, { database }, { operationLabel: `github-publication.${operation}` });
}
function assertMutationSource(database, result, source) {
	if (result.kind === "maintenance") return;
	const { selector } = source;
	for (const row of result.rows) if (row.session_id !== selector.sessionId || row.session_key !== selector.sessionKey || row.agent_id !== selector.agentId) throw new Error("GitHub publication transition source session changed.");
	if (result.kind === "repository") {
		for (const row of result.rows) {
			if (row.workspace_id !== selector.repositoryWorkspaceId || row.session_lifecycle_revision !== selector.lifecycleRevision || selector.repositoryBranch !== void 0 && row.branch !== selector.repositoryBranch) throw new Error("GitHub publication transition source repository changed.");
			const workspace = source.expected.repositoryWorkspace;
			if (workspace?.workspaceId !== row.workspace_id || workspace.agentId !== row.agent_id || workspace.sessionKey !== row.session_key || workspace.branch !== row.branch) throw new Error("GitHub publication transition source repository changed.");
			if (row.owner_profile_id !== null) {
				if (row.connection_generation === null || row.identity_profile_id === null) throw new Error("GitHub publication transition connection is unavailable.");
				assertGitHubPublicationConnectionSource(source, {
					...row,
					owner_profile_id: row.owner_profile_id,
					connection_generation: row.connection_generation,
					identity_profile_id: row.identity_profile_id
				});
			}
		}
		return;
	}
	for (const row of result.rows) {
		const lifecycle = readGitHubPublicationSessionLifecycle({
			publicationKind: result.kind,
			requestId: row.request_id
		}, database.db);
		if (!lifecycle || lifecycle.lifecycle_revision !== selector.lifecycleRevision) throw new Error("GitHub publication transition source lifecycle changed.");
		assertGitHubPublicationWorktreeSource(source, {
			id: row.worktree_id,
			repoFingerprint: row.repository_fingerprint,
			branch: row.branch
		});
	}
	if (result.kind === "personal") for (const row of result.rows) assertGitHubPublicationConnectionSource(source, row);
}
function personalMutation(database, input) {
	const admitted = () => assertGitHubPublicationWorkerSourceCurrent(database.db);
	switch (input.operation) {
		case "claim": return [claimPersonalGitHubPublicationInDatabase(database, input.row, input.instanceId, input.executionId, admitted)];
		case "updateHead":
		case "complete":
		case "recordEffect":
		case "interrupt": {
			const { values } = githubPublicationEffectFacts(input, "needs_confirmation");
			return [writePersonalGitHubPublicationInDatabase(database, input.row, input.instanceId, input.executionId, values, false, admitted)];
		}
		case "restart": return requirePersonalGitHubPublicationConfirmationInDatabase(database, input.instanceId);
		case "report": {
			const row = markPersonalGitHubPublicationReportedInDatabase(database, input.requestId);
			return row ? [row] : [];
		}
	}
	throw new Error("Unknown personal GitHub publication mutation.");
}
function repositoryMutation(database, input) {
	const admitted = () => assertGitHubPublicationWorkerSourceCurrent(database.db);
	const authority = {
		assertCurrent: admitted,
		assertCustody: () => assertCustody(database)
	};
	switch (input.operation) {
		case "claim": return [claimRepositoryGitHubPublicationInDatabase(database, input.row, input.instanceId, input.executionId, authority)];
		case "updateHead":
		case "complete":
		case "recordEffect":
		case "interrupt": {
			const { values } = githubPublicationEffectFacts(input, input.row.owner_profile_id === null ? "requested" : "needs_confirmation");
			return [writeRepositoryGitHubPublicationInDatabase(database, input.row, input.instanceId, input.executionId, values, false, authority)];
		}
		case "checkpoint": return [bindRepositoryGitHubPublicationCheckpointInDatabase(database, input.row, input.checkpoint, admitted)];
		case "failPreparation": return [failRepositoryGitHubPublicationPreparationInDatabase(database, input.row, input.nextAction, authority.assertCustody)];
		case "defer": return deferRepositoryGitHubPublicationClaimsInDatabase(database, selectGitHubPublicationDeferralsInDatabase(database.db, "repository", input.selection));
		case "retire": {
			const row = failStaleRepositoryGitHubPublicationInDatabase(database, input.row, () => false);
			return row ? [row] : [];
		}
		case "report": {
			const row = markRepositoryGitHubPublicationReportedInDatabase(database, input.requestId);
			return row ? [row] : [];
		}
	}
	throw new Error("Unknown repository GitHub publication mutation.");
}
function sharedMutation(database, input) {
	switch (input.operation) {
		case "bindAcceptedSnapshot": return [bindAcceptedGitHubPublicationClaimSnapshotInDatabase(database, input.input)];
		case "report": {
			const row = markSharedGitHubPublicationReportedInDatabase(database, input.requestId);
			return row ? [row] : [];
		}
		case "claim": return [claimGitHubPublicationExecutionInDatabase(database, input.requestId, input.instanceId)];
		case "defer":
			deferGitHubPublicationRequestsInDatabase(database, selectGitHubPublicationDeferralsInDatabase(database.db, "shared", input.selection));
			return [];
		case "bindWorkspaceSnapshot": return [createGitHubPublicationExecutionStoreInDatabase(database, input.instanceId).bindWorkspaceSnapshot(input.input)];
		case "updatePublishingFacts": return [createGitHubPublicationExecutionStoreInDatabase(database, input.instanceId).updatePublishingFacts(input.input)];
		case "complete": return [createGitHubPublicationExecutionStoreInDatabase(database, input.instanceId).complete(input.row, input.result)];
	}
	throw new Error("Unknown shared GitHub publication mutation.");
}
const publicationOperations = {
	...publicationReadOperations,
	...publicationRequestOperations,
	"githubPublications.maintenance": (input, { open }) => {
		const database = open();
		return mutate(database, input.operation, () => {
			if (input.operation === "report") {
				personalMutation(database, input);
				sharedMutation(database, input);
				repositoryMutation(database, input);
			} else {
				const deferred = {
					operation: "defer",
					selection: {
						kind: "claim",
						claim: input.claim
					}
				};
				sharedMutation(database, deferred);
				repositoryMutation(database, deferred);
			}
			return {
				operationId: input.operationId,
				operation: input.operation,
				kind: "maintenance",
				rows: []
			};
		});
	},
	"githubPublications.shared": (input, { open }) => {
		const database = open();
		if (requiresSource("shared", input) && !input.source) throw new Error("GitHub publication action requires a typed source.");
		return mutate(database, input.operation, () => ({
			operationId: input.operationId,
			operation: input.operation,
			kind: "shared",
			rows: sharedMutation(database, input)
		}), input.source);
	},
	"githubPublications.personal": (input, { open }) => {
		const database = open();
		if (requiresSource("personal", input) && !input.source) throw new Error("GitHub publication action requires a typed source.");
		return mutate(database, input.operation, () => ({
			operationId: input.operationId,
			operation: input.operation,
			kind: "personal",
			rows: personalMutation(database, input)
		}), input.source);
	},
	"githubPublications.repository": (input, { open }) => {
		const database = open();
		if (requiresSource("repository", input) && !input.source) throw new Error("GitHub publication action requires a typed source.");
		return mutate(database, input.operation, () => ({
			operationId: input.operationId,
			operation: input.operation,
			kind: "repository",
			rows: repositoryMutation(database, input)
		}), input.source);
	}
};
//#endregion
export { publicationOperations };
