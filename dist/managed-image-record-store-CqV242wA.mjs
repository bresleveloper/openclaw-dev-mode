import { n as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHI12YH5.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { c as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BFK9cMiV.mjs";
import { a as managedImageRecordToRow, i as managedImageRecordFromRow, o as managedImageRecordsEqual, t as MANAGED_IMAGE_RECORD_COLUMNS } from "./managed-image-record-store.kernel-jj61quyd.mjs";
//#region src/gateway/managed-image-record-store.ts
const MANAGED_OUTGOING_ORIGINALS_SUBDIR = "outgoing/originals";
function stateDatabaseOptions(stateDir) {
	return stateDir ? { env: {
		...process.env,
		OPENCLAW_STATE_DIR: stateDir
	} } : { env: process.env };
}
function captureManagedImageReadContext(stateDir) {
	const env = cloneEnvWithPlatformSemantics(process.env);
	if (stateDir) env.OPENCLAW_STATE_DIR = stateDir;
	return captureOpenClawStateWorkerContext({ env });
}
async function readManagedImageRecord(attachmentId, stateDir) {
	const context = captureManagedImageReadContext(stateDir);
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-BgU7tLf5.mjs");
	return await executeOpenClawStateWorker(context, {
		type: "managedImages.read",
		input: { attachmentId }
	});
}
async function listManagedImageRecordEntries(params) {
	const context = captureManagedImageReadContext(params.stateDir);
	const sessionKey = params.sessionKey;
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-BgU7tLf5.mjs");
	return await executeOpenClawStateWorker(context, {
		type: "managedImages.entries",
		input: { sessionKey }
	});
}
async function listManagedImageOriginalMediaIds(stateDir) {
	const context = captureManagedImageReadContext(stateDir);
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-BgU7tLf5.mjs");
	return await executeOpenClawStateWorker(context, {
		type: "managedImages.originalMediaIds",
		input: void 0
	});
}
function insertManagedImageRecord(record, stateDir) {
	runOpenClawStateWriteTransaction(({ db }) => {
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("managed_outgoing_image_records").values(managedImageRecordToRow(record)));
	}, stateDatabaseOptions(stateDir));
}
/** Promote a transient record atomically so concurrent message commits cannot lose state. */
function attachManagedImageRecordToMessage(params) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		const stateDb = getNodeSqliteKysely(db);
		const row = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("managed_outgoing_image_records").select(MANAGED_IMAGE_RECORD_COLUMNS).where("attachment_id", "=", params.attachmentId).where("session_key", "=", params.sessionKey));
		if (!row) return false;
		if (row.cleanup_pending === 1) return false;
		const current = managedImageRecordFromRow(row);
		if (current.messageId === params.messageId && current.retentionClass === "history") return true;
		const next = {
			...current,
			messageId: params.messageId,
			retentionClass: "history",
			updatedAt: params.updatedAt
		};
		const nextRow = managedImageRecordToRow(next);
		executeSqliteQuerySync(db, stateDb.updateTable("managed_outgoing_image_records").set({
			message_id: nextRow.message_id,
			retention_class: nextRow.retention_class,
			updated_at: nextRow.updated_at,
			record_json: nextRow.record_json
		}).where("attachment_id", "=", params.attachmentId));
		return true;
	}, stateDatabaseOptions(params.stateDir));
}
/** Claim only the exact row cleanup planned against; concurrent updates win. */
function claimManagedImageRecordCleanupIfCurrent(planned, stateDir) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		const stateDb = getNodeSqliteKysely(db);
		const row = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("managed_outgoing_image_records").select(MANAGED_IMAGE_RECORD_COLUMNS).where("attachment_id", "=", planned.attachmentId));
		if (!row || row.cleanup_pending === 1 || !managedImageRecordsEqual(managedImageRecordFromRow(row), planned)) return false;
		executeSqliteQuerySync(db, stateDb.updateTable("managed_outgoing_image_records").set({ cleanup_pending: 1 }).where("attachment_id", "=", planned.attachmentId));
		return true;
	}, stateDatabaseOptions(stateDir));
}
/** Delete a durably claimed row only after its attachment file is gone. */
function deleteClaimedManagedImageRecord(planned, stateDir) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		const stateDb = getNodeSqliteKysely(db);
		const row = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("managed_outgoing_image_records").select(MANAGED_IMAGE_RECORD_COLUMNS).where("attachment_id", "=", planned.attachmentId));
		if (!row || row.cleanup_pending !== 1 || !managedImageRecordsEqual(managedImageRecordFromRow(row), planned)) return false;
		executeSqliteQuerySync(db, stateDb.deleteFrom("managed_outgoing_image_records").where("attachment_id", "=", planned.attachmentId));
		return true;
	}, stateDatabaseOptions(stateDir));
}
//#endregion
export { insertManagedImageRecord as a, readManagedImageRecord as c, deleteClaimedManagedImageRecord as i, attachManagedImageRecordToMessage as n, listManagedImageOriginalMediaIds as o, claimManagedImageRecordCleanupIfCurrent as r, listManagedImageRecordEntries as s, MANAGED_OUTGOING_ORIGINALS_SUBDIR as t };
