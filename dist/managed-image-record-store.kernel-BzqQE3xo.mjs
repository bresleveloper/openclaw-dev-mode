import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { i as requestSqliteWorkerOperationAdmission, r as deferSqliteWorkerCommitReceipt } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
//#region src/gateway/managed-image-record-store.kernel.ts
const MANAGED_IMAGE_RECORD_COLUMNS = [
	"attachment_id",
	"session_key",
	"agent_id",
	"message_id",
	"created_at",
	"updated_at",
	"retention_class",
	"alt",
	"original_media_root",
	"original_media_id",
	"original_media_subdir",
	"original_content_type",
	"original_width",
	"original_height",
	"original_size_bytes",
	"original_filename",
	"cleanup_pending"
];
function managedImageRecordToRow(record) {
	return {
		attachment_id: record.attachmentId,
		session_key: record.sessionKey,
		agent_id: record.agentId ?? null,
		message_id: record.messageId,
		created_at: record.createdAt,
		updated_at: record.updatedAt ?? null,
		retention_class: record.retentionClass ?? null,
		alt: record.alt,
		original_media_root: record.original.mediaRoot,
		original_media_id: record.original.mediaId,
		original_media_subdir: record.original.mediaSubdir,
		original_content_type: record.original.contentType,
		original_width: record.original.width,
		original_height: record.original.height,
		original_size_bytes: record.original.sizeBytes,
		original_filename: record.original.filename,
		record_json: JSON.stringify(record)
	};
}
function managedImageRecordFromRow(row) {
	return {
		attachmentId: row.attachment_id,
		sessionKey: row.session_key,
		...row.agent_id ? { agentId: row.agent_id } : {},
		messageId: row.message_id,
		createdAt: row.created_at,
		...row.updated_at ? { updatedAt: row.updated_at } : {},
		...row.retention_class === "history" || row.retention_class === "transient" ? { retentionClass: row.retention_class } : {},
		alt: row.alt,
		original: {
			mediaRoot: row.original_media_root,
			mediaId: row.original_media_id,
			mediaSubdir: row.original_media_subdir,
			contentType: row.original_content_type,
			width: row.original_width,
			height: row.original_height,
			sizeBytes: row.original_size_bytes,
			filename: row.original_filename
		}
	};
}
function managedImageRecordsEqual(left, right) {
	return JSON.stringify(left) === JSON.stringify(right);
}
function readManagedImageRecordInDatabase(db, attachmentId) {
	const row = executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("managed_outgoing_image_records").select(MANAGED_IMAGE_RECORD_COLUMNS).where("attachment_id", "=", attachmentId).where("cleanup_pending", "=", 0));
	return row ? managedImageRecordFromRow(row) : null;
}
function listManagedImageRecordEntriesInDatabase(db, sessionKey) {
	let query = getNodeSqliteKysely(db).selectFrom("managed_outgoing_image_records").select(MANAGED_IMAGE_RECORD_COLUMNS);
	if (sessionKey) query = query.where("session_key", "=", sessionKey);
	return executeSqliteQuerySync(db, query.orderBy("created_at", "desc").orderBy("attachment_id", "asc")).rows.map((row) => ({
		record: managedImageRecordFromRow(row),
		cleanupPending: row.cleanup_pending === 1
	}));
}
function listManagedImageOriginalMediaIdsInDatabase(db) {
	return executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("managed_outgoing_image_records").select([
		"original_media_id",
		"original_width",
		"original_height",
		"original_size_bytes",
		"cleanup_pending"
	]).orderBy("created_at", "desc").orderBy("attachment_id", "asc")).rows.map((row) => row.original_media_id);
}
function insertManagedImageRecordInDatabase(db, record) {
	executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("managed_outgoing_image_records").values(managedImageRecordToRow(record)));
	return true;
}
/** Promote a transient record atomically so concurrent message commits cannot lose state. */
function attachManagedImageRecordInDatabase(db, params) {
	const stateDb = getNodeSqliteKysely(db);
	const row = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("managed_outgoing_image_records").select(MANAGED_IMAGE_RECORD_COLUMNS).where("attachment_id", "=", params.attachmentId).where("session_key", "=", params.sessionKey));
	if (!row || row.cleanup_pending === 1) return false;
	const current = managedImageRecordFromRow(row);
	if (current.messageId === params.messageId && current.retentionClass === "history") return true;
	const nextRow = managedImageRecordToRow({
		...current,
		messageId: params.messageId,
		retentionClass: "history",
		updatedAt: params.updatedAt
	});
	executeSqliteQuerySync(db, stateDb.updateTable("managed_outgoing_image_records").set({
		message_id: nextRow.message_id,
		retention_class: nextRow.retention_class,
		updated_at: nextRow.updated_at,
		record_json: nextRow.record_json
	}).where("attachment_id", "=", params.attachmentId));
	return true;
}
/** Claim only the exact row cleanup planned against; concurrent updates win. */
function claimManagedImageRecordCleanupInDatabase(db, planned) {
	const stateDb = getNodeSqliteKysely(db);
	const row = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("managed_outgoing_image_records").select(MANAGED_IMAGE_RECORD_COLUMNS).where("attachment_id", "=", planned.attachmentId));
	if (!row || row.cleanup_pending === 1 || !managedImageRecordsEqual(managedImageRecordFromRow(row), planned)) return false;
	executeSqliteQuerySync(db, stateDb.updateTable("managed_outgoing_image_records").set({ cleanup_pending: 1 }).where("attachment_id", "=", planned.attachmentId));
	return true;
}
/** Delete a durably claimed row only after its attachment file is gone. */
function deleteClaimedManagedImageRecordInDatabase(db, planned) {
	const stateDb = getNodeSqliteKysely(db);
	const row = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("managed_outgoing_image_records").select(MANAGED_IMAGE_RECORD_COLUMNS).where("attachment_id", "=", planned.attachmentId));
	if (!row || row.cleanup_pending !== 1 || !managedImageRecordsEqual(managedImageRecordFromRow(row), planned)) return false;
	executeSqliteQuerySync(db, stateDb.deleteFrom("managed_outgoing_image_records").where("attachment_id", "=", planned.attachmentId));
	return true;
}
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
const managedImageRecordOperations = {
	"managedImages.insert": mutation("managedImages.insert", insertManagedImageRecordInDatabase),
	"managedImages.attach": mutation("managedImages.attach", attachManagedImageRecordInDatabase),
	"managedImages.claimCleanup": mutation("managedImages.claimCleanup", claimManagedImageRecordCleanupInDatabase),
	"managedImages.deleteClaimed": mutation("managedImages.deleteClaimed", deleteClaimedManagedImageRecordInDatabase),
	"managedImages.read": ({ attachmentId }, { open }) => readManagedImageRecordInDatabase(open().db, attachmentId),
	"managedImages.entries": ({ sessionKey }, { open }) => listManagedImageRecordEntriesInDatabase(open().db, sessionKey),
	"managedImages.originalMediaIds": (_input, { open }) => listManagedImageOriginalMediaIdsInDatabase(open().db)
};
//#endregion
export { managedImageRecordsEqual as i, managedImageRecordOperations as n, managedImageRecordToRow as r, managedImageRecordFromRow as t };
