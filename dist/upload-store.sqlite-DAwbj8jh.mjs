import { g as isFutureDateTimestampMs, o as asDateTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { i as SkillUploadRequestError } from "./openclaw-state-worker-error-DLFiBmPG.mjs";
import { c as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
//#region src/skills/lifecycle/upload-store.sqlite.ts
const SKILL_UPLOAD_LEASE_SCOPE = "skill-upload-install";
function selectSkillUploadMetadata(kysely) {
	return kysely.selectFrom("skill_uploads").select([
		"upload_id",
		"kind",
		"slug",
		"force",
		"size_bytes",
		"sha256",
		"actual_sha256",
		"received_bytes",
		"created_at",
		"expires_at",
		"committed",
		"committed_at",
		"idempotency_key_hash"
	]);
}
function resolveSkillUploadDatabaseOptions(options) {
	return {
		...options.env ? { env: options.env } : {},
		...options.path ? { path: options.path } : {}
	};
}
function openSkillUploadDatabase(options) {
	const database = openOpenClawStateDatabase(options);
	return {
		database,
		kysely: getNodeSqliteKysely(database.db)
	};
}
function readSkillUploadMetadata(uploadId, options) {
	const { database, kysely } = openSkillUploadDatabase(options);
	return executeSqliteQueryTakeFirstSync(database.db, selectSkillUploadMetadata(kysely).where("upload_id", "=", uploadId));
}
function deleteSkillUploadState(db, kysely, uploadId) {
	executeSqliteQuerySync(db, kysely.deleteFrom("state_leases").where("scope", "=", SKILL_UPLOAD_LEASE_SCOPE).where("lease_key", "=", uploadId));
	executeSqliteQuerySync(db, kysely.deleteFrom("skill_uploads").where("upload_id", "=", uploadId));
}
function deleteOwnedSkillUpload(uploadId, owner, options) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		const kysely = getNodeSqliteKysely(db);
		if (!executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("skill_uploads").select("upload_id").where("upload_id", "=", uploadId))) return "missing";
		const lease = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("state_leases").select(["owner", "expires_at"]).where("scope", "=", SKILL_UPLOAD_LEASE_SCOPE).where("lease_key", "=", uploadId));
		if (!lease || lease.owner !== owner || lease.expires_at === null || lease.expires_at <= Date.now()) return "not-owner";
		deleteSkillUploadState(db, kysely, uploadId);
		return "deleted";
	}, options);
}
function hasLiveSkillUploadInstallLease(db, kysely, uploadId, nowMs) {
	return Boolean(executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("state_leases").select("lease_key").where("scope", "=", SKILL_UPLOAD_LEASE_SCOPE).where("lease_key", "=", uploadId).where("expires_at", ">", nowMs)));
}
function deleteExpiredSkillUploadUnlessLeased(params) {
	return runOpenClawStateWriteTransaction(({ db }) => deleteExpiredSkillUploadUnlessLeasedInDatabase(db, {
		uploadId: params.uploadId,
		nowMs: Date.now()
	}), params.options);
}
function deleteExpiredSkillUploadUnlessLeasedInDatabase(db, params) {
	const kysely = getNodeSqliteKysely(db);
	const row = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("skill_uploads").select("expires_at").where("upload_id", "=", params.uploadId));
	if (!row) return "missing";
	if (row.expires_at > params.nowMs) return "active";
	if (hasLiveSkillUploadInstallLease(db, kysely, params.uploadId, params.nowMs)) return "leased";
	deleteSkillUploadState(db, kysely, params.uploadId);
	return "deleted";
}
function renewSkillUploadInstallLease(params) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		const heartbeatAt = Date.now();
		const kysely = getNodeSqliteKysely(db);
		return executeSqliteQuerySync(db, kysely.updateTable("state_leases").set({
			heartbeat_at: heartbeatAt,
			expires_at: heartbeatAt + params.installLeaseMs,
			updated_at: heartbeatAt
		}).where("scope", "=", SKILL_UPLOAD_LEASE_SCOPE).where("lease_key", "=", params.uploadId).where("owner", "=", params.owner).where("expires_at", ">", heartbeatAt)).numAffectedRows === 1n;
	}, params.options);
}
function readSkillUploadArchiveChunks(uploadId, options) {
	const { database, kysely } = openSkillUploadDatabase(options);
	return executeSqliteQuerySync(database.db, kysely.selectFrom("skill_upload_chunks").select([
		"byte_offset",
		"size_bytes",
		"chunk_blob"
	]).where("upload_id", "=", uploadId).orderBy("byte_offset", "asc")).rows;
}
function requireUploadMetadata(uploadId, options) {
	const row = readSkillUploadMetadata(uploadId, options);
	if (!row) throw new SkillUploadRequestError(`upload not found: ${uploadId}`);
	return row;
}
function assertNotExpired(row, nowMs, options) {
	const validNow = asDateTimestampMs(nowMs);
	if (validNow === void 0) throw new SkillUploadRequestError("upload has expired");
	if (!isFutureDateTimestampMs(row.expires_at, { nowMs: validNow })) {
		deleteExpiredSkillUploadUnlessLeased({
			uploadId: row.upload_id,
			options
		});
		throw new SkillUploadRequestError("upload has expired");
	}
}
//#endregion
export { deleteSkillUploadState as a, renewSkillUploadInstallLease as c, selectSkillUploadMetadata as d, deleteOwnedSkillUpload as i, requireUploadMetadata as l, assertNotExpired as n, hasLiveSkillUploadInstallLease as o, deleteExpiredSkillUploadUnlessLeasedInDatabase as r, readSkillUploadArchiveChunks as s, SKILL_UPLOAD_LEASE_SCOPE as t, resolveSkillUploadDatabaseOptions as u };
