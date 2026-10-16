import { D as resolveExpiresAtMsFromDurationMs, g as isFutureDateTimestampMs, o as asDateTimestampMs } from "./number-coercion-CuVhdCBs.mjs";
import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { i as SkillUploadRequestError } from "./openclaw-state-worker-error-Cmtk9G4_.mjs";
import { y as requireOpenClawStateDatabaseIdentity } from "./openclaw-state-db-cache-BKCnj4of.mjs";
import { i as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { l as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-D1jWDzK3.mjs";
import { randomUUID } from "node:crypto";
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
function openSkillUploadDatabase(options) {
	const database = openOpenClawStateDatabase(options);
	return {
		database,
		kysely: getNodeSqliteKysely(database.db)
	};
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
	const { database, kysely } = openSkillUploadDatabase(options);
	const row = executeSqliteQueryTakeFirstSync(database.db, selectSkillUploadMetadata(kysely).where("upload_id", "=", uploadId));
	if (!row) throw new SkillUploadRequestError(`upload not found: ${uploadId}`);
	return row;
}
function assertNotExpired(row, nowMs, options) {
	const validNow = asDateTimestampMs(nowMs);
	if (validNow === void 0) throw new SkillUploadRequestError("upload has expired");
	if (!isFutureDateTimestampMs(row.expires_at, { nowMs: validNow })) {
		runOpenClawStateWriteTransaction(({ db }) => deleteExpiredSkillUploadUnlessLeasedInDatabase(db, {
			uploadId: row.upload_id,
			nowMs: Date.now()
		}), options);
		throw new SkillUploadRequestError("upload has expired");
	}
}
//#endregion
//#region src/skills/lifecycle/upload-store-commit.ts
function assembleArchive(chunks, expectedSize) {
	let offset = 0;
	const buffers = [];
	for (const chunk of chunks) {
		const bytes = chunk.chunk_blob;
		if (chunk.byte_offset !== offset || chunk.size_bytes !== bytes.length || bytes.length < 1) throw new SkillUploadRequestError("uploaded archive chunks are incomplete");
		buffers.push(bytes);
		offset += bytes.length;
	}
	if (offset !== expectedSize) throw new SkillUploadRequestError("uploaded archive chunks are incomplete");
	return Buffer.concat(buffers, expectedSize);
}
function toCommitResult(row, requestedSha) {
	if (!row.actual_sha256) throw new SkillUploadRequestError("committed upload is missing sha256");
	if (requestedSha && requestedSha !== row.actual_sha256) throw new SkillUploadRequestError("upload sha256 mismatch");
	return {
		uploadId: row.upload_id,
		receivedBytes: row.received_bytes,
		sha256: row.actual_sha256,
		expiresAt: row.expires_at
	};
}
function commitSkillUploadInDatabase(params, options, admit) {
	const { uploadId, requestedSha } = params;
	const row = requireUploadMetadata(uploadId, options);
	assertNotExpired(row, Date.now(), options);
	if (row.committed === 1) return toCommitResult(row, requestedSha);
	if (row.received_bytes !== row.size_bytes) throw new SkillUploadRequestError(`upload size mismatch: expected ${row.size_bytes}, got ${row.received_bytes}`);
	if (row.sha256 && requestedSha && row.sha256 !== requestedSha) throw new SkillUploadRequestError("upload sha256 does not match begin sha256");
	let archive;
	try {
		archive = assembleArchive(readSkillUploadArchiveChunks(uploadId, options), row.size_bytes);
	} catch (err) {
		const current = requireUploadMetadata(uploadId, options);
		if (current.committed === 1) {
			assertNotExpired(current, Date.now(), options);
			return toCommitResult(current, requestedSha);
		}
		throw err;
	}
	const actualSha256 = sha256Hex(archive);
	const expectedSha = requestedSha ?? row.sha256 ?? void 0;
	if (expectedSha && expectedSha !== actualSha256) throw new SkillUploadRequestError("upload sha256 mismatch");
	const outcome = runOpenClawStateWriteTransaction(({ db }) => {
		admit?.("transaction");
		const kysely = getNodeSqliteKysely(db);
		const current = executeSqliteQueryTakeFirstSync(db, selectSkillUploadMetadata(kysely).where("upload_id", "=", uploadId));
		if (!current) throw new SkillUploadRequestError(`upload not found: ${uploadId}`);
		const committedAt = Date.now();
		if (!isFutureDateTimestampMs(current.expires_at, { nowMs: committedAt })) {
			deleteExpiredSkillUploadUnlessLeasedInDatabase(db, {
				uploadId,
				nowMs: committedAt
			});
			admit?.("commit");
			return { expired: true };
		}
		if (current.committed === 1) {
			admit?.("commit");
			return {
				expired: false,
				result: toCommitResult(current, requestedSha)
			};
		}
		if (current.received_bytes !== current.size_bytes || current.size_bytes !== archive.length) throw new SkillUploadRequestError("uploaded archive chunks changed during commit");
		executeSqliteQuerySync(db, kysely.updateTable("skill_uploads").set({
			actual_sha256: actualSha256,
			archive_blob: archive,
			committed: 1,
			committed_at: committedAt
		}).where("upload_id", "=", uploadId));
		executeSqliteQuerySync(db, kysely.deleteFrom("skill_upload_chunks").where("upload_id", "=", uploadId));
		admit?.("commit");
		return {
			expired: false,
			result: {
				uploadId,
				receivedBytes: current.received_bytes,
				sha256: actualSha256,
				expiresAt: current.expires_at
			}
		};
	}, options);
	if (outcome.expired) throw new SkillUploadRequestError("upload has expired");
	return outcome.result;
}
//#endregion
//#region src/skills/lifecycle/upload-store.kernel.ts
function matchesBegin(row, params) {
	return row.kind === params.kind && row.slug === params.slug && row.force === (params.force ? 1 : 0) && row.size_bytes === params.sizeBytes && (row.sha256 ?? void 0) === params.sha256;
}
function beginSkillUploadInDatabase(params, options, admit) {
	const { slug, force, sizeBytes, sha256, keyHash, ttlMs } = params;
	return runOpenClawStateWriteTransaction(({ db }) => {
		admit?.("transaction");
		const createdAt = Date.now();
		const expiresAt = resolveExpiresAtMsFromDurationMs(ttlMs, { nowMs: createdAt });
		if (expiresAt === void 0) throw new SkillUploadRequestError("invalid upload expiry");
		const kysely = getNodeSqliteKysely(db);
		if (keyHash) {
			const existing = executeSqliteQueryTakeFirstSync(db, selectSkillUploadMetadata(kysely).where("idempotency_key_hash", "=", keyHash));
			if (existing) {
				if (!matchesBegin(existing, {
					kind: params.kind,
					slug,
					force,
					sizeBytes,
					sha256
				})) throw new SkillUploadRequestError("idempotencyKey conflicts with a different upload");
				if (isFutureDateTimestampMs(existing.expires_at, { nowMs: createdAt })) {
					admit?.("commit");
					return {
						uploadId: existing.upload_id,
						receivedBytes: existing.received_bytes,
						expiresAt: existing.expires_at
					};
				}
				if (hasLiveSkillUploadInstallLease(db, kysely, existing.upload_id, createdAt)) throw new SkillUploadRequestError("upload is already being installed");
				deleteSkillUploadState(db, kysely, existing.upload_id);
			}
		}
		if (executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("skill_uploads").select((eb) => eb.val(1).as("present")).where("expires_at", ">", createdAt).offset(31).limit(1))) throw new SkillUploadRequestError("too many active skill uploads");
		const uploadId = randomUUID();
		executeSqliteQuerySync(db, kysely.insertInto("skill_uploads").values({
			upload_id: uploadId,
			kind: params.kind,
			slug,
			force: force ? 1 : 0,
			size_bytes: sizeBytes,
			sha256: sha256 ?? null,
			actual_sha256: null,
			received_bytes: 0,
			archive_blob: Buffer.alloc(0),
			created_at: createdAt,
			expires_at: expiresAt,
			committed: 0,
			committed_at: null,
			idempotency_key_hash: keyHash ?? null
		}));
		admit?.("commit");
		return {
			uploadId,
			receivedBytes: 0,
			expiresAt
		};
	}, options);
}
function appendSkillUploadChunkInDatabase(params, options, admit) {
	const { uploadId, offset, decoded } = params;
	assertNotExpired(requireUploadMetadata(uploadId, options), Date.now(), options);
	return runOpenClawStateWriteTransaction(({ db }) => {
		admit?.("transaction");
		const kysely = getNodeSqliteKysely(db);
		const row = executeSqliteQueryTakeFirstSync(db, selectSkillUploadMetadata(kysely).where("upload_id", "=", uploadId));
		if (!row) throw new SkillUploadRequestError(`upload not found: ${uploadId}`);
		const validNow = asDateTimestampMs(Date.now());
		if (validNow === void 0 || !isFutureDateTimestampMs(row.expires_at, { nowMs: validNow })) throw new SkillUploadRequestError("upload has expired");
		if (row.committed === 1) throw new SkillUploadRequestError("upload is already committed");
		if (offset !== row.received_bytes) throw new SkillUploadRequestError(`upload offset mismatch: expected ${row.received_bytes}, got ${offset}`);
		const nextSize = row.received_bytes + decoded.length;
		if (nextSize > row.size_bytes) throw new SkillUploadRequestError("upload chunk exceeds declared size");
		executeSqliteQuerySync(db, kysely.insertInto("skill_upload_chunks").values({
			upload_id: uploadId,
			byte_offset: offset,
			size_bytes: decoded.length,
			chunk_blob: decoded
		}));
		executeSqliteQuerySync(db, kysely.updateTable("skill_uploads").set({ received_bytes: nextSize }).where("upload_id", "=", uploadId));
		admit?.("commit");
		return {
			uploadId,
			receivedBytes: nextSize,
			expiresAt: row.expires_at
		};
	}, options);
}
function claimSkillUploadInDatabase(params, options) {
	const { uploadId, leaseOwner, installLeaseMs } = params;
	assertNotExpired(requireUploadMetadata(uploadId, options), Date.now(), options);
	return runOpenClawStateWriteTransaction(({ db }) => {
		const kysely = getNodeSqliteKysely(db);
		const current = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("skill_uploads").selectAll().where("upload_id", "=", uploadId));
		if (!current) throw new SkillUploadRequestError(`upload not found: ${uploadId}`);
		const currentTime = Date.now();
		const validNow = asDateTimestampMs(currentTime);
		if (validNow === void 0 || !isFutureDateTimestampMs(current.expires_at, { nowMs: validNow })) throw new SkillUploadRequestError("upload has expired");
		if (current.committed !== 1) throw new SkillUploadRequestError("upload is not committed");
		if (!current.actual_sha256) throw new SkillUploadRequestError("committed upload is missing sha256");
		if (current.archive_blob.byteLength !== current.size_bytes) throw new SkillUploadRequestError("uploaded archive is missing or incomplete");
		executeSqliteQuerySync(db, kysely.deleteFrom("state_leases").where("scope", "=", SKILL_UPLOAD_LEASE_SCOPE).where("lease_key", "=", uploadId).where("expires_at", "<=", currentTime));
		if (executeSqliteQuerySync(db, kysely.insertInto("state_leases").values({
			scope: "skill-upload-install",
			lease_key: uploadId,
			owner: leaseOwner,
			expires_at: currentTime + installLeaseMs,
			heartbeat_at: currentTime,
			payload_json: null,
			created_at: currentTime,
			updated_at: currentTime
		}).onConflict((conflict) => conflict.doNothing())).numAffectedRows !== 1n) throw new SkillUploadRequestError("upload is already being installed");
		return current;
	}, options);
}
function listExpiredSkillUploadsInDatabase(_input, options) {
	const now = asDateTimestampMs(Date.now());
	if (now === void 0) return [];
	const { db } = options.database;
	return executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("skill_uploads").select("upload_id").where("expires_at", "<=", now)).rows.map((row) => row.upload_id);
}
function deleteExpiredSkillUploadInDatabase(params, options) {
	return runOpenClawStateWriteTransaction(({ db }) => deleteExpiredSkillUploadUnlessLeasedInDatabase(db, {
		uploadId: params.uploadId,
		nowMs: Date.now()
	}), options);
}
function releaseSkillUploadInDatabase(params, options) {
	runOpenClawStateWriteTransaction((current) => {
		if (requireOpenClawStateDatabaseIdentity(current).key !== params.sharedStateIdentity) throw new Error("Skill upload cleanup cannot adopt a replacement shared database");
		const { db } = current;
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).deleteFrom("state_leases").where("scope", "=", SKILL_UPLOAD_LEASE_SCOPE).where("lease_key", "=", params.uploadId).where("owner", "=", params.owner));
	}, options);
}
//#endregion
//#region src/skills/lifecycle/upload-store.worker.ts
const admit = (stage) => requestSqliteWorkerOperationAdmission({
	stage,
	facts: void 0
});
const skillUploadOperations = {
	"skillUploads.begin": (input, { open, stateOptions }) => beginSkillUploadInDatabase(input, {
		database: open(),
		...stateOptions()
	}, admit),
	"skillUploads.chunk": (input, { open, stateOptions }) => appendSkillUploadChunkInDatabase(input, {
		database: open(),
		...stateOptions()
	}, admit),
	"skillUploads.commit": (input, { open, stateOptions }) => commitSkillUploadInDatabase(input, {
		database: open(),
		...stateOptions()
	}, admit),
	"skillUploads.expired": (input, { open, stateOptions }) => listExpiredSkillUploadsInDatabase(input, {
		database: open(),
		...stateOptions()
	}),
	"skillUploads.deleteExpired": (input, { open, stateOptions }) => deleteExpiredSkillUploadInDatabase(input, {
		database: open(),
		...stateOptions()
	}),
	"skillUploads.claim": (input, { open, stateOptions }) => claimSkillUploadInDatabase(input, {
		database: open(),
		...stateOptions()
	}),
	"skillUploads.renew": (input, { open, stateOptions }) => renewSkillUploadInstallLease({
		...input,
		options: {
			database: open(),
			...stateOptions()
		}
	}),
	"skillUploads.consume": (input, { open, stateOptions }) => deleteOwnedSkillUpload(input.uploadId, input.owner, {
		database: open(),
		...stateOptions()
	}),
	"skillUploads.release": (input, { open, stateOptions }) => releaseSkillUploadInDatabase(input, {
		database: open(),
		...stateOptions()
	})
};
//#endregion
export { skillUploadOperations };
