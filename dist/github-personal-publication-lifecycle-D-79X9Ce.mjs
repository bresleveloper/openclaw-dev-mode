import { a as executeSqliteQueryTakeFirstSync, d as sqliteStringSet, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-Bzw_c0pA.mjs";
import { n as assertSessionEntryCurrentAdmission } from "./session-entry-current-admission-DvCCyjlG.mjs";
import { r as requestSessionEntryCurrentAdmission } from "./session-entry-current-admission.worker-DSV3cklJ.mjs";
import { a as withGitHubPublicationDeletionReceipt, r as deferGitHubPublicationDeletionReceipt } from "./github-publication-receipts-WUg6AvYk.mjs";
//#region src/state/github-personal-publication-lifecycle.ts
/** Capture historical receipts while the session still owns its logical keys. */
async function preparePersonalGitHubSessionReceiptDeletion(params) {
	params.assertCurrent?.();
	const context = captureOpenClawStateWorkerContext({ env: params.env });
	const generations = params.generations.map((generation) => ({ ...generation }));
	const input = {
		agentId: params.agentId,
		sessionKeys: [...new Set(generations.map((generation) => generation.sessionKey))]
	};
	const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
	const receipts = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "githubPublication.prepareSessionReceiptDeletion",
		input
	}), {
		assertCurrent: params.assertCurrent,
		existingOnly: true
	}) ?? {
		personal: [],
		repository: []
	};
	params.assertCurrent?.();
	return async ({ assertCurrent, sessionEntryCurrent, retainedSessionKeys } = {}) => {
		const selectedKeys = new Set(input.sessionKeys.filter((key) => !retainedSessionKeys?.has(key)));
		if (selectedKeys.size === 0) return;
		const assertAdmission = () => {
			context.admission.assertCurrent();
			assertCurrent?.();
		};
		await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
			type: "githubPublication.deleteSessionReceipts",
			input: {
				agentId: input.agentId,
				sessionKeys: [...selectedKeys],
				generations: generations.filter((generation) => selectedKeys.has(generation.sessionKey)),
				receipts: {
					personal: receipts.personal.filter((receipt) => selectedKeys.has(receipt.session_key)),
					repository: receipts.repository.filter((receipt) => selectedKeys.has(receipt.session_key))
				},
				sessionEntryCurrentSource: sessionEntryCurrent?.source
			}
		}), {
			existingOnly: true,
			assertCurrent: assertAdmission,
			createAdmission: withGitHubPublicationDeletionReceipt(createSqliteWorkerWriteAdmission((request) => {
				assertAdmission();
				assertSessionEntryCurrentAdmission(request, sessionEntryCurrent);
			}, [context.admission.databasePath]), context)
		});
	};
}
function readSessionReceiptDeletionIdentitiesInDatabase(database, params) {
	const read = (table) => params.sessionKeys.length && tableExists(database.db, table) ? executeSqliteQuerySync(database.db, getNodeSqliteKysely(database.db).selectFrom(table).select([
		"request_id",
		"session_id",
		"session_key",
		"created_at_ms"
	]).where("agent_id", "=", params.agentId).where("session_key", "in", sqliteStringSet(params.sessionKeys))).rows : [];
	return {
		personal: read("github_personal_publication_requests"),
		repository: read("github_repository_publication_requests")
	};
}
/** Exact historical receipts and late inserts for the removed generation share one SQL edge. */
function deletePersonalGitHubSessionReceiptsInDatabase(database, params) {
	const existing = ["github_personal_publication_requests", "github_repository_publication_requests"].filter((table) => tableExists(database.db, table));
	if (existing.length === 0 || params.sessionKeys.length === 0) return;
	const generations = new Map(params.generations.toReversed().map((generation) => [JSON.stringify([generation.sessionKey, generation.sessionId]), generation]));
	runOpenClawStateWriteTransaction(({ db }) => {
		requestSessionEntryCurrentAdmission(params.sessionEntryCurrentSource, {
			stage: "transaction",
			facts: void 0
		}, { lookup: "logical" });
		const query = getNodeSqliteKysely(db);
		const tombstones = /* @__PURE__ */ new Map();
		const hasLifecycles = tableExists(db, "github_publication_session_lifecycles");
		const current = readSessionReceiptDeletionIdentitiesInDatabase(database, params);
		for (const table of existing) {
			const historical = table === "github_personal_publication_requests" ? params.receipts.personal : params.receipts.repository;
			const captured = new Map(historical.map((receipt) => [receipt.request_id, receipt]));
			const selected = (table === "github_personal_publication_requests" ? current.personal : current.repository).filter((receipt) => {
				const previous = captured.get(receipt.request_id);
				if (previous && previous.session_id === receipt.session_id && previous.session_key === receipt.session_key && previous.created_at_ms === receipt.created_at_ms) return true;
				const generation = generations.get(JSON.stringify([receipt.session_key, receipt.session_id]));
				if (!generation) return false;
				const binding = table === "github_personal_publication_requests" ? hasLifecycles ? executeSqliteQueryTakeFirstSync(db, query.selectFrom("github_publication_session_lifecycles").select("lifecycle_revision").where("publication_kind", "=", "personal").where("request_id", "=", receipt.request_id)) : void 0 : executeSqliteQueryTakeFirstSync(db, query.selectFrom("github_repository_publication_requests").select("session_lifecycle_revision as lifecycle_revision").where("request_id", "=", receipt.request_id));
				return binding !== void 0 && binding.lifecycle_revision === generation.lifecycleRevision;
			}).map((receipt) => receipt.request_id);
			if (selected.length === 0) continue;
			if (table === "github_personal_publication_requests" && hasLifecycles) for (const requestId of selected) {
				const deleted = executeSqliteQuerySync(db, query.deleteFrom("github_publication_session_lifecycles").where("publication_kind", "=", "personal").where("request_id", "=", requestId).returning("request_id")).rows;
				for (const row of deleted) tombstones.set(JSON.stringify(["personal-lifecycle", row.request_id]), { kind: "absent" });
			}
			for (const requestId of selected) {
				const deleted = executeSqliteQuerySync(db, query.deleteFrom(table).where("request_id", "=", requestId).returning("request_id")).rows;
				for (const row of deleted) tombstones.set(JSON.stringify([table === "github_personal_publication_requests" ? "personal" : "repository", row.request_id]), { kind: "absent" });
			}
		}
		requestSessionEntryCurrentAdmission(params.sessionEntryCurrentSource, {
			stage: "commit",
			facts: void 0
		}, { lookup: "logical" });
		deferGitHubPublicationDeletionReceipt(db, tombstones);
	}, { database }, { operationLabel: "github-personal-publication.session-delete" });
}
//#endregion
export { preparePersonalGitHubSessionReceiptDeletion as n, readSessionReceiptDeletionIdentitiesInDatabase as r, deletePersonalGitHubSessionReceiptsInDatabase as t };
