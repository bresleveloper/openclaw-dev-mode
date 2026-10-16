import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { n as assertOpenClawStateLeaseWorkerOwnedInTransaction } from "./openclaw-state-lease-worker-Bfyut3YB.mjs";
import { n as clawPackageLifecycleLeaseKey } from "./claw-package-lifecycle-lease-key-DptsqXVg.mjs";
import { i as selectMcpRefs, r as rowToRef } from "./mcp-records-F-n78kde.mjs";
import { a as updateClawPackageRefStatusInDatabase, r as readClawOrphanWorkspaceInDatabase, t as readClawInstallRecordFromDatabase } from "./provenance-read.kernel-B_3aRsEz.mjs";
//#region src/claws/provenance-write.worker.ts
const clawProvenanceOperations = {
	"clawProvenance.packageStatus": (input, { open, stateOptions }) => runOpenClawStateWriteTransaction(({ db }) => {
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
		assertOpenClawStateLeaseWorkerOwnedInTransaction(db, input.lease);
		const row = executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("claw_package_refs").select([
			"relationship",
			"origin",
			"independent_owner",
			"package_integrity"
		]).where("agent_id", "=", ref.agentId).where("package_kind", "=", ref.kind).where("package_source", "=", ref.source).where("package_ref", "=", ref.ref).where("package_version", "=", ref.version));
		if (!row || row.package_integrity !== ref.integrity || row.relationship !== ref.relationship || row.origin !== ref.origin || Boolean(row.independent_owner) !== ref.independentOwner) throw new Error(`Package ${ref.ref}@${ref.version} ownership changed before its status write.`);
		const result = updateClawPackageRefStatusInDatabase(db, ref, input.status, input.nowMs ?? Date.now());
		assertOpenClawStateLeaseWorkerOwnedInTransaction(db, input.lease, "write", "commit");
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
