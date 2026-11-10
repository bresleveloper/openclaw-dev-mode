import { r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { x as requireOpenClawStateDatabaseIdentity } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { a as deferSqliteWorkerCommitReceipt, f as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import "./session-key-CSDERtm3.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds, n as listAgentEntries } from "./agent-roster-gkYP38su.mjs";
import { h as readAgentDeletionJournalInDatabase, i as beginAgentDeletionJournalInDatabase, o as deleteAgentDeletionJournalInDatabase } from "./agent-deletion-journal-DpYVtbBb.mjs";
import { c as resolveSessionStorePathCore, d as resolveSessionTranscriptsDirForAgent } from "./paths-YgcBNLgG.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { r as isReservedSystemAgentId } from "./agent-id-BxGhTBRK.mjs";
import { _ as readRegisteredAgentDatabaseRows } from "./openclaw-agent-db-registry-listing-DCh0nEqi.mjs";
import { d as inspectOpenClawAgentDatabaseOwner } from "./openclaw-agent-db-lifecycle-Dodvmz4L.mjs";
import { n as resolveSessionStoreCompatibilityAgentId } from "./legacy.default-agent-owner-Blrs2q29.mjs";
import { o as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-DJQA0Ssz.mjs";
import { s as verifyOpenClawStateLeaseOwnership } from "./openclaw-state-lease-storage-CoE2b53O.mjs";
import { n as assertOpenClawStateLeaseWorkerOwnedInTransaction, r as assertOpenClawStateLeasesWorkerOwnedInTransaction } from "./openclaw-state-lease-worker-D3xn0u2j.mjs";
import { r as readClawOrphanWorkspaceInDatabase, t as readClawInstallRecordFromDatabase } from "./provenance-read.kernel-BWj46N6j.mjs";
import { n as assertAgentDeletionWorkerPredicate, r as ensureAgentProvenanceSchema } from "./agent-deletion.worker-Bp9lB6Sk.mjs";
import { n as clawPackageLifecycleLeaseKey } from "./claw-package-lifecycle-lease-key-DptsqXVg.mjs";
import { n as digestClawValue } from "./digest-CI8Suvd7.mjs";
import { n as assertAgentSessionStoreDeletionBlocker } from "./agent-delete-session-store-safety-ChjTvLx2.mjs";
import { t as assertAgentSessionStoreDeletionTargetsCurrent } from "./agent-delete-session-store-safety.targets-CZCCiYwJ.mjs";
import { i as selectMcpRefs, r as rowToRef } from "./mcp-records-BR16U2Ec.mjs";
import { t as updateClawPackageRefStatusInDatabase } from "./package-status.kernel-DwMHH78L.mjs";
import { r as serializeClawRemovalJournal } from "./removal-journal-contract-BwY0ztCU.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/agent-delete-session-store-safety.kernel.ts
/** The caller owns the current shared-state read or write transaction. */
function findAgentSessionStoreDeletionBlocker(database, cfg, agentId, env, targets) {
	if (!cfg.session?.store?.trim()) return;
	const id = normalizeAgentId(agentId);
	const defaultAgentId = resolveSessionStoreCompatibilityAgentId(cfg);
	if (targets) assertAgentSessionStoreDeletionTargetsCurrent(targets);
	const registeredDatabases = database ? readRegisteredAgentDatabaseRows(database.db, database.path, false) : [];
	for (const survivorId of listAgentIds(cfg)) {
		if (normalizeAgentId(survivorId) === id) continue;
		const storePath = resolveSessionStorePathCore(cfg.session.store, {
			agentId: survivorId,
			env
		});
		const target = resolveSqliteTargetFromSessionStorePath(storePath, {
			agentId: survivorId,
			defaultAgentId,
			env,
			registeredDatabases
		});
		const owner = inspectOpenClawAgentDatabaseOwner(target.path);
		if (owner.status === "owned" && owner.agentId === id) {
			if (targets) assertAgentSessionStoreDeletionTargetsCurrent(targets);
			return survivorId;
		}
	}
	if (targets) assertAgentSessionStoreDeletionTargetsCurrent(targets);
}
//#endregion
//#region src/claws/removal-journal.worker.ts
function mutateClawRemovalJournalInWorker(database, input, options) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		const { request } = input;
		if (isReservedSystemAgentId(request.agentId) || request.lease.scope !== "core:agent-deletion" || request.lease.key !== request.agentId || request.binding.statePath !== database.path || digestClawValue(input.config) !== request.configDigest) throw new Error("Claw journal mutation differs from its deletion owner or configuration.");
		const assertLease = () => {
			if (!isDeepStrictEqual(requireOpenClawStateDatabaseIdentity(database), request.sourceIdentity)) throw new Error("Claw journal mutation no longer owns its original physical database.");
			assertExistingDatabaseIdentity(database.path, request.sourceIdentity.key, request.sourceIdentity.birthtime);
			verifyOpenClawStateLeaseOwnership({
				...request.lease,
				leaseLabel: "agent deletion",
				transaction: db
			});
		};
		assertLease();
		const install = readClawInstallRecordFromDatabase(db, request.agentId);
		const previous = readAgentDeletionJournalInDatabase({ db }, request.agentId);
		if (digestClawValue(install ?? null) !== request.expectedInstallDigest || digestClawValue(serializeClawRemovalJournal(previous)) !== request.expectedJournalDigest) throw new Error("Claw install or deletion journal changed before mutation; preview removal again.");
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: { nonce: input.nonce }
		});
		assertLease();
		const nativeOptions = {
			...options,
			database
		};
		let journal;
		if (request.phase === "begin") {
			const safety = input.sessionStoreSafety;
			if (!safety || safety.agentId !== request.agentId) throw new Error("Claw journal mutation lost its session-store preparation");
			assertAgentSessionStoreDeletionBlocker(request.agentId, findAgentSessionStoreDeletionBlocker(database, safety.config, safety.agentId, safety.env, safety.targets));
			const fallbackWorkspace = install?.workspace ?? readClawOrphanWorkspaceInDatabase(db, request.agentId)?.workspace ?? "";
			const workspaceDir = listAgentEntries(input.config).find((entry) => entry.id === request.agentId)?.workspace ?? fallbackWorkspace;
			const agentDir = resolveAgentDir(input.config, request.agentId, options.env);
			const sessionsDir = resolveSessionTranscriptsDirForAgent(request.agentId, options.env);
			ensureAgentProvenanceSchema(nativeOptions);
			journal = beginAgentDeletionJournalInDatabase(database, {
				agentId: request.agentId,
				operationId: request.operationId,
				workspaceDir,
				agentDir,
				sessionsDir,
				deleteFiles: previous?.deleteFiles ?? false
			}).entry;
		} else {
			if (!previous || previous.operationId !== request.operationId || previous.cleanupCompleted || !deleteAgentDeletionJournalInDatabase(database, request.agentId, request.operationId, false)) throw new Error("Claw rollback no longer owns its deletion journal.");
			journal = null;
		}
		deferSqliteWorkerCommitReceipt(db, {
			nonce: input.nonce,
			journal: serializeClawRemovalJournal(journal)
		});
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: { nonce: input.nonce }
		});
		assertLease();
		return { nonce: input.nonce };
	}, {
		...options,
		database
	}, { operationLabel: "claw.removal-journal" });
}
//#endregion
//#region src/claws/provenance-write.worker.ts
const clawProvenanceOperations = {
	"clawProvenance.removalJournal": (input, { open, stateOptions }) => mutateClawRemovalJournalInWorker(open(), input, stateOptions()),
	"clawProvenance.packageStatus": (input, { open, stateOptions }) => runOpenClawStateWriteTransaction((database) => {
		const { db } = database;
		const ref = input.ref;
		const artifact = ref.kind === "plugin" ? {
			kind: ref.kind,
			source: ref.source,
			ref: ref.ref
		} : {
			kind: ref.kind,
			source: ref.source,
			ref: ref.ref,
			workspace: readClawInstallRecordFromDatabase(db, ref.agentId)?.workspace ?? readClawOrphanWorkspaceInDatabase(db, ref.agentId)?.workspace ?? ""
		};
		if (artifact.kind === "skill" && !artifact.workspace || input.lease.scope !== "claw-package-lifecycle" || input.lease.key !== clawPackageLifecycleLeaseKey(artifact)) throw new Error("Claw package claim does not match the held artifact lease");
		const assertLeases = (stage) => {
			if (input.deletion) {
				if (input.deletion.predicate.agentId !== ref.agentId || input.deletion.lease.scope !== "core:agent-deletion" || input.deletion.lease.key !== ref.agentId) throw new Error("Claw package write does not belong to its deletion");
				assertOpenClawStateLeasesWorkerOwnedInTransaction(db, [input.deletion.lease, input.lease], stage);
				assertAgentDeletionWorkerPredicate(database, input.deletion.predicate);
			} else assertOpenClawStateLeaseWorkerOwnedInTransaction(db, input.lease, "write", stage);
		};
		assertLeases("transaction");
		const row = executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("claw_package_refs").select([
			"relationship",
			"origin",
			"independent_owner",
			"package_integrity"
		]).where("agent_id", "=", ref.agentId).where("package_kind", "=", ref.kind).where("package_source", "=", ref.source).where("package_ref", "=", ref.ref).where("package_version", "=", ref.version));
		if (!row || row.package_integrity !== ref.integrity || row.relationship !== ref.relationship || row.origin !== ref.origin || Boolean(row.independent_owner) !== ref.independentOwner) throw new Error(`Package ${ref.ref}@${ref.version} ownership changed before its status write.`);
		const result = updateClawPackageRefStatusInDatabase(db, ref, input.status, input.nowMs ?? Date.now());
		assertLeases("commit");
		return result;
	}, {
		database: open(),
		...stateOptions()
	}),
	"clawProvenance.reconcileMcp": (input, { open, stateOptions }) => runOpenClawStateWriteTransaction(({ db }) => {
		const refs = executeSqliteQuerySync(db, selectMcpRefs(db).where("agent_id", "=", input.agentId).orderBy("name")).rows.map(rowToRef);
		for (const ref of refs) {
			if (ref.status !== "pending" || input.digests[ref.name] !== ref.configDigest) continue;
			const updatedAtMs = input.nowMs ?? Date.now();
			executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("claw_mcp_server_refs").set({
				status: "complete",
				error: null,
				updated_at_ms: updatedAtMs
			}).where("agent_id", "=", ref.agentId).where("name", "=", ref.name));
			ref.status = "complete";
			ref.updatedAtMs = updatedAtMs;
			delete ref.error;
		}
		return refs;
	}, {
		database: open(),
		...stateOptions()
	})
};
//#endregion
export { clawProvenanceOperations };
