import { i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { a as deferSqliteWorkerCommitReceipt, f as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { m as retireAgentDeletionJournalInDatabase, p as readAgentDeletionJournalAuthorityInDatabase } from "./agent-deletion-journal.read-BzRzPvBo.mjs";
import { a as agentProvenancePublication } from "./agent-provenance-Bj5CtKpW.mjs";
import { a as completeAgentDeletionJournalInDatabase, g as updateAgentDeletionJournalPathsInDatabase, h as readAgentDeletionJournalInDatabase, i as beginAgentDeletionJournalInDatabase, o as deleteAgentDeletionJournalInDatabase, s as handoffAgentDeletionJournalInDatabase, x as agentDeletionJournalPublication } from "./agent-deletion-journal-DpYVtbBb.mjs";
import { a as assertNoOpenClawAgentDatabaseLeases } from "./openclaw-agent-db-lease-Brvd0WI4.mjs";
import { r as unregisterOpenClawAgentDatabases } from "./openclaw-agent-db-registry-DuEPPF6m.mjs";
import { t as createOpenClawStateSchemaEnsurer } from "./openclaw-state-feature-schema-ensure-BdqUBvvX.mjs";
import { n as assertOpenClawStateLeaseWorkerOwnedInTransaction } from "./openclaw-state-lease-worker-D3xn0u2j.mjs";
import { t as readClawInstallRecordFromDatabase } from "./provenance-read.kernel-BWj46N6j.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/state/agent-provenance.schema.ts
const ensureAgentProvenanceSchema = createOpenClawStateSchemaEnsurer({
	table: "agent_provenance",
	operationLabel: "agent-provenance.schema.ensure"
});
//#endregion
//#region src/state/agent-deletion.worker.ts
/** The caller holds the real lease grant and this transaction's shared-state snapshot. */
function assertAgentDeletionWorkerPredicate(database, predicate, currentJournal) {
	const journal = currentJournal === void 0 ? readAgentDeletionJournalAuthorityInDatabase(database.db, predicate.agentId) : currentJournal;
	if (!journal || journal.agentId !== predicate.agentId || journal.operationId !== predicate.operationId || journal.cleanupCompleted) throw new Error(`Agent ${predicate.agentId} deletion no longer owns database cleanup.`);
	assertClawInstall(database, predicate);
}
function assertClawInstall(database, predicate) {
	if (predicate.expectedClawInstall !== void 0 && !isDeepStrictEqual(readClawInstallRecordFromDatabase(database.db, predicate.agentId) ?? null, predicate.expectedClawInstall)) throw Object.assign(/* @__PURE__ */ new Error(`Claw removal no longer owns agent ${predicate.agentId}.`), { code: "CLAW_INSTALL_CHANGED" });
}
function assertLease(database, lease, agentId, stage = "transaction") {
	if (lease.scope !== "core:agent-deletion" || lease.key !== agentId) throw new Error("Agent deletion requires its original target lease");
	assertOpenClawStateLeaseWorkerOwnedInTransaction(database.db, lease, "write", stage);
}
function guarded(guard, context, mutate, publication) {
	return context.write((database) => {
		assertLease(database, guard.lease, guard.predicate.agentId);
		assertAgentDeletionWorkerPredicate(database, guard.predicate);
		const { result: provenance, receipt } = agentDeletionJournalPublication.capture(database.db, () => agentProvenancePublication.capture(database.db, () => mutate(database)));
		const { result, receipt: provenanceReceipt } = provenance;
		assertLease(database, guard.lease, guard.predicate.agentId, "commit");
		if (publication?.journalChanged) deferSqliteWorkerCommitReceipt(database.db, {
			kind: "agent-deletion-mutated",
			agentId: guard.predicate.agentId,
			operationId: guard.predicate.operationId,
			unregisterDatabases: publication.unregisterDatabases === true,
			journalAuthority: agentDeletionJournalPublication.bound(receipt),
			provenanceAuthority: agentProvenancePublication.bound(provenanceReceipt)
		});
		return result;
	}, { operationLabel: "agent.deletion" });
}
const agentDeletionOperations = {
	"agentDeletion.claimCompleted": (input, context) => context.write((database) => {
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: void 0
		});
		const { result: claimed, receipt } = agentDeletionJournalPublication.capture(database.db, () => deleteAgentDeletionJournalInDatabase(database, input.agentId, input.operationId, true));
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: void 0
		});
		deferSqliteWorkerCommitReceipt(database.db, {
			kind: "agent-deletion-claimed",
			agentId: input.agentId,
			operationId: input.operationId,
			claimed,
			journalAuthority: agentDeletionJournalPublication.bound(receipt)
		});
		return claimed;
	}, { operationLabel: "agent.deletion.claim" }),
	"agentDeletion.read": (input, { open }) => readAgentDeletionJournalInDatabase(open(), input.agentId),
	"agentDeletion.begin": (input, context) => context.write((database) => {
		assertLease(database, input.lease, input.entry.agentId);
		assertClawInstall(database, {
			agentId: input.entry.agentId,
			expectedClawInstall: input.expectedClawInstall
		});
		ensureAgentProvenanceSchema({
			database,
			...context.stateOptions()
		});
		const { result, receipt } = agentDeletionJournalPublication.capture(database.db, () => beginAgentDeletionJournalInDatabase(database, input.entry, input.preserveDeleteFiles, input.recoveryOperationId));
		assertLease(database, input.lease, input.entry.agentId, "commit");
		deferSqliteWorkerCommitReceipt(database.db, {
			kind: "agent-deletion-began",
			agentId: input.entry.agentId,
			operationId: input.entry.operationId,
			journalAuthority: agentDeletionJournalPublication.bound(receipt)
		});
		return result;
	}, { operationLabel: "agent.deletion.begin" }),
	"agentDeletion.assertCurrent": (input, context) => guarded(input.guard, context, () => void 0),
	"agentDeletion.retire": (input, context) => guarded(input.guard, context, (database) => {
		const { agentId, operationId } = input.guard.predicate;
		if (!retireAgentDeletionJournalInDatabase(database, agentId, operationId)) throw new Error(`Failed to retire deletion journal for agent ${agentId}.`);
	}, { journalChanged: true }),
	"agentDeletion.assertNoDatabaseLeasesUnowned": (input, context) => assertNoOpenClawAgentDatabaseLeases(input.agentId, {
		database: context.open(),
		...context.stateOptions()
	}),
	"agentDeletion.assertNoDatabaseLeases": (input, context) => guarded(input.guard, context, (database) => assertNoOpenClawAgentDatabaseLeases(input.guard.predicate.agentId, {
		database,
		...context.stateOptions()
	})),
	"agentDeletion.fencePaths": (input, context) => guarded(input.guard, context, (database) => {
		const { agentId, operationId } = input.guard.predicate;
		if (!updateAgentDeletionJournalPathsInDatabase(database, agentId, operationId, input.paths.kind === "database" ? "database_paths_json" : "cleanup_paths_json", input.paths.paths)) throw new Error(`Failed to fence cleanup paths for agent ${agentId}.`);
	}, { journalChanged: true }),
	"agentDeletion.finish": (input, context) => guarded(input.guard, context, (database) => {
		const { agentId, operationId } = input.guard.predicate;
		if (input.unregisterDatabases) unregisterOpenClawAgentDatabases({
			agentId,
			database,
			env: context.stateOptions().env
		});
		if (!completeAgentDeletionJournalInDatabase(database, agentId, operationId)) throw new Error(`Failed to complete deletion journal for agent ${agentId}.`);
	}, {
		journalChanged: true,
		unregisterDatabases: input.unregisterDatabases
	}),
	"agentDeletion.rollback": (input, context) => guarded(input.guard, context, (database) => {
		const { agentId, operationId } = input.guard.predicate;
		if (!deleteAgentDeletionJournalInDatabase(database, agentId, operationId, false)) throw new Error(`Failed to roll back deletion journal for agent ${agentId}.`);
	}, { journalChanged: true }),
	"agentDeletion.releaseClawRows": (input, context) => guarded(input.guard, context, (database) => {
		const { agentId, operationId } = input.guard.predicate;
		if (input.complete) unregisterOpenClawAgentDatabases({
			agentId,
			database,
			env: context.stateOptions().env
		});
		const query = getNodeSqliteKysely(database.db);
		const paths = [...new Set(input.files.filter((file) => file.action !== "error").map((file) => file.path))];
		if (paths.length && tableExists(database.db, "claw_workspace_files")) executeSqliteQuerySync(database.db, query.deleteFrom("claw_workspace_files").where("agent_id", "=", agentId).where("target_path", "in", paths));
		if (!input.complete) return false;
		if (tableExists(database.db, "claw_package_refs")) executeSqliteQuerySync(database.db, query.deleteFrom("claw_package_refs").where("agent_id", "=", agentId));
		if (tableExists(database.db, "claw_installs")) executeSqliteQuerySync(database.db, query.deleteFrom("claw_installs").where("agent_id", "=", agentId));
		if (!completeAgentDeletionJournalInDatabase(database, agentId, operationId)) throw new Error(`Failed to complete deletion journal for agent ${agentId}.`);
		return true;
	}, {
		journalChanged: true,
		unregisterDatabases: input.complete
	}),
	"agentDeletion.handoffClawRetry": (input, context) => context.write((database) => {
		const { agentId, operationId } = input.guard.predicate;
		assertLease(database, input.guard.lease, agentId);
		const journal = readAgentDeletionJournalInDatabase(database, agentId);
		if (!journal || journal.operationId !== operationId || journal.cleanupCompleted || input.guard.predicate.expectedClawInstall !== void 0 && !isDeepStrictEqual(readClawInstallRecordFromDatabase(database.db, agentId) ?? null, input.guard.predicate.expectedClawInstall)) {
			assertLease(database, input.guard.lease, agentId, "commit");
			return false;
		}
		const result = executeSqliteQuerySync(database.db, getNodeSqliteKysely(database.db).updateTable("claw_installs").set({
			status: "partial",
			updated_at_ms: input.nowMs
		}).where("agent_id", "=", agentId));
		const { result: handedOff, receipt } = agentDeletionJournalPublication.capture(database.db, () => result.numAffectedRows === 1n && handoffAgentDeletionJournalInDatabase(database, agentId, operationId, input.retryOperationId));
		if (!handedOff) throw new Error(`Failed to hand off deletion journal for agent ${agentId}.`);
		assertLease(database, input.guard.lease, agentId, "commit");
		deferSqliteWorkerCommitReceipt(database.db, {
			kind: "agent-deletion-mutated",
			agentId,
			operationId,
			unregisterDatabases: false,
			journalAuthority: agentDeletionJournalPublication.bound(receipt)
		});
		return true;
	}, { operationLabel: "agent.deletion.handoff" })
};
//#endregion
export { assertAgentDeletionWorkerPredicate as n, ensureAgentProvenanceSchema as r, agentDeletionOperations as t };
