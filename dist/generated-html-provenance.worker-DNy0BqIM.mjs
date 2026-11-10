import { i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { a as deferSqliteWorkerCommitReceipt, f as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { t as chunkItems } from "./chunk-items-2QWieLm-.mjs";
//#region src/media/generated-html-provenance.worker.ts
function mutation(type, apply) {
	return (input, { open }) => runOpenClawStateWriteTransaction(({ db }) => {
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: void 0
		});
		const result = apply(db, input);
		const receipt = {
			type,
			result
		};
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: receipt
		});
		deferSqliteWorkerCommitReceipt(db, receipt);
		return result;
	}, { database: open() }, { operationLabel: type });
}
const generatedHtmlProvenanceOperations = {
	"generatedHtmlProvenance.upsert": mutation("generatedHtmlProvenance.upsert", (db, row) => {
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("outbound_media_provenance").values(row).onConflict((conflict) => conflict.column("realpath").doUpdateSet(row)));
		return 1;
	}),
	"generatedHtmlProvenance.prune": mutation("generatedHtmlProvenance.prune", (db, rows) => {
		let removed = 0;
		for (const batch of chunkItems(rows, 100)) {
			const result = executeSqliteQuerySync(db, getNodeSqliteKysely(db).deleteFrom("outbound_media_provenance").where((eb) => eb.or(batch.map((row) => eb.and({
				realpath: row.realpath,
				kind: row.kind,
				version: row.version,
				sha256: row.sha256,
				size_bytes: row.size_bytes,
				created_at_ms: row.created_at_ms
			})))));
			removed += Number(result.numAffectedRows ?? 0);
		}
		return removed;
	})
};
//#endregion
export { generatedHtmlProvenanceOperations };
