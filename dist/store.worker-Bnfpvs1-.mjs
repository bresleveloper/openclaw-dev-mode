import { r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { i as tableExists } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { t as SkillLibraryError } from "./skill-library-error-z-Nwz4n5.mjs";
import { i as requestSqliteWorkerOperationAdmission, r as deferSqliteWorkerCommitReceipt } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import "./user-profile-list-CtETKur7.mjs";
import { a as recordSkillLibraryEvent, c as requireSkillLibraryUpload, d as selectSkillLibraryOwner, f as selectSkillLibraryRevisionMetadata, l as requireSkillLibraryUploadMetadata, n as assertSkillLibraryRevision, o as requireSkillLibraryEntry, p as skillLibraryDb, r as ensureSkillLibrarySchema, s as requireSkillLibraryProfile, t as assertSkillLibraryNameAvailable, u as resolveSkillLibraryActor } from "./store-BeSK43aH.mjs";
import { t as skillLibraryReceipt } from "./receipt-DmfbA7G3.mjs";
import { randomUUID } from "node:crypto";
//#region src/skills/library/service.kernel.ts
function hydrateSkillLibraryWorkerAuthority(input, profileDependencies) {
	return {
		...input,
		profileDependencies,
		getConfig: () => input.config,
		assertCurrent() {}
	};
}
function publishSkillLibraryInDatabase(db, input) {
	const { params, skillId, bundle, uploadId } = input;
	const authority = hydrateSkillLibraryWorkerAuthority(input.authority);
	const actor = requireSkillLibraryProfile(db, authority);
	if (uploadId) {
		const upload = requireSkillLibraryUploadMetadata(db, uploadId, authority);
		if (upload.slug !== params.slug) throw new SkillLibraryError("NOT_FOUND", "Upload slug changed; start the import again.");
		if (upload.published_skill_id) return skillLibraryReceipt(requireSkillLibraryEntry(db, upload.published_skill_id, authority), "unchanged");
	}
	const current = params.skillId ? requireSkillLibraryEntry(db, skillId, authority, true) : void 0;
	if (current) assertSkillLibraryRevision(current, params.expectedRevision);
	const owner = current ? current.ownerProfileId : actor;
	assertSkillLibraryNameAvailable(db, owner, params.slug, skillId);
	if (current?.revision === bundle.revision && current.slug === params.slug) return skillLibraryReceipt(current, "unchanged");
	const now = Date.now();
	const kysely = skillLibraryDb(db);
	executeSqliteQuerySync(db, kysely.insertInto("skill_library_revisions").values({
		skill_id: skillId,
		revision: bundle.revision,
		description: bundle.description,
		files_json: bundle.filesJson,
		created_at: now
	}).onConflict((conflict) => conflict.columns(["skill_id", "revision"]).doNothing()));
	if (current) executeSqliteQuerySync(db, kysely.updateTable("skill_library_entries").set({
		slug: params.slug,
		current_revision: bundle.revision,
		updated_at: now
	}).where("skill_id", "=", skillId));
	else executeSqliteQuerySync(db, kysely.insertInto("skill_library_entries").values({
		skill_id: skillId,
		owner_profile_id: actor,
		author_profile_id: actor,
		slug: params.slug,
		current_revision: bundle.revision,
		shared: 0,
		enabled: 1,
		removed: 0,
		created_at: now,
		updated_at: now
	}));
	recordSkillLibraryEvent(db, skillId, bundle.revision, current ? "save" : "create", actor);
	if (uploadId) executeSqliteQuerySync(db, kysely.updateTable("skill_library_uploads").set({ published_skill_id: skillId }).where("upload_id", "=", uploadId));
	return skillLibraryReceipt(requireSkillLibraryEntry(db, skillId, authority));
}
function mutateSkillLibraryInDatabase(db, input) {
	const { params } = input;
	const authority = hydrateSkillLibraryWorkerAuthority(input.authority);
	if (!tableExists(db, "skill_library_entries")) throw new SkillLibraryError("NOT_FOUND", "Skill not found.");
	const current = requireSkillLibraryEntry(db, params.skillId, authority, true);
	const actor = requireSkillLibraryProfile(db, authority);
	assertSkillLibraryRevision(current, params.expectedRevision);
	const changes = {};
	switch (params.action) {
		case "share":
		case "unshare":
			if (params.action === "unshare" && current.ownerProfileId === null) throw new SkillLibraryError("FORBIDDEN", "Team-owned skills cannot become personal through unshare.");
			changes.shared = Number(params.action === "share");
			break;
		case "transfer":
			if (!resolveSkillLibraryActor(db, authority).admin) throw new SkillLibraryError("FORBIDDEN", "Transfer to team ownership requires a Gateway administrator.");
			assertSkillLibraryNameAvailable(db, null, current.slug, current.skillId);
			changes.owner_profile_id = null;
			changes.shared = 1;
			break;
		case "enable":
		case "disable":
			changes.enabled = Number(params.action === "enable");
			break;
		case "remove":
			changes.removed = 1;
			break;
		case "rollback":
			if (!params.revision || !selectSkillLibraryRevisionMetadata(db, current.skillId, params.revision)) throw new SkillLibraryError("NOT_FOUND", "Choose a published revision from this skill's history.");
			changes.current_revision = params.revision;
	}
	executeSqliteQuerySync(db, skillLibraryDb(db).updateTable("skill_library_entries").set({
		...changes,
		updated_at: Date.now()
	}).where("skill_id", "=", current.skillId));
	recordSkillLibraryEvent(db, current.skillId, changes.current_revision ?? current.revision, params.action, actor);
	return skillLibraryReceipt(requireSkillLibraryEntry(db, current.skillId, authority), params.action === "remove" ? "removed" : "published");
}
//#endregion
//#region src/skills/library/import.kernel.ts
const MAX_CHUNK_BYTES = 262144;
const MAX_ACTIVE_UPLOADS = 32;
function prepareSkillLibraryUploadChunk(params) {
	if (params.action === "begin") return;
	const bytes = Buffer.from(params.data, "base64");
	if (!bytes.length || bytes.length > MAX_CHUNK_BYTES || bytes.toString("base64") !== params.data) throw new SkillLibraryError("INVALID_BUNDLE", "Invalid upload chunk; send canonical base64, at most 256 KiB decoded.");
	return bytes;
}
function uploadSkillLibraryInDatabase(db, input, bytes) {
	const { params } = input;
	const authority = hydrateSkillLibraryWorkerAuthority(input.authority);
	if (params.action === "begin") {
		const actor = requireSkillLibraryProfile(db, authority);
		const kysely = skillLibraryDb(db);
		executeSqliteQuerySync(db, kysely.deleteFrom("skill_library_uploads").where("expires_at", "<=", Date.now()));
		const activeUploads = executeSqliteQuerySync(db, kysely.selectFrom("skill_library_uploads").select("owner_profile_id").where("published_skill_id", "is", null).limit(MAX_ACTIVE_UPLOADS)).rows;
		if (activeUploads.length >= MAX_ACTIVE_UPLOADS || activeUploads.filter((upload) => selectSkillLibraryOwner(db, upload.owner_profile_id)?.id === actor).length >= MAX_ACTIVE_UPLOADS / 2) throw new SkillLibraryError("LIMIT", "Active import limit reached for your profile or the Gateway. Finish an existing import or retry after it expires.");
		const uploadId = randomUUID();
		executeSqliteQuerySync(db, kysely.insertInto("skill_library_uploads").values({
			upload_id: uploadId,
			owner_profile_id: actor,
			slug: params.slug,
			size_bytes: params.sizeBytes,
			sha256: params.sha256,
			archive_blob: Buffer.alloc(0),
			expires_at: Date.now() + 36e5,
			published_skill_id: null
		}));
		return {
			uploadId,
			offset: 0,
			maxChunkBytes: MAX_CHUNK_BYTES
		};
	}
	if (!bytes) throw new SkillLibraryError("INVALID_BUNDLE", "Upload chunk bytes were not prepared.");
	const upload = requireSkillLibraryUpload(db, params.uploadId, authority);
	const current = Buffer.from(upload.archive_blob);
	if (upload.published_skill_id || params.offset !== current.length || current.length + bytes.length > upload.size_bytes) throw new SkillLibraryError("CONFLICT", "Upload offset changed or upload completed. Start a new import.");
	const next = Buffer.concat([current, bytes]);
	executeSqliteQuerySync(db, skillLibraryDb(db).updateTable("skill_library_uploads").set({ archive_blob: next }).where("upload_id", "=", params.uploadId));
	return {
		uploadId: params.uploadId,
		offset: next.length,
		maxChunkBytes: MAX_CHUNK_BYTES
	};
}
//#endregion
//#region src/skills/library/store.worker.ts
const admit = (stage, facts) => requestSqliteWorkerOperationAdmission({
	stage,
	facts
});
const skillLibraryOperations = {
	"skillLibrary.publish": (input, { open, stateOptions }) => {
		const options = {
			database: open(),
			...stateOptions()
		};
		ensureSkillLibrarySchema(options, admit);
		return runOpenClawStateWriteTransaction(({ db }) => {
			admit("transaction");
			const result = publishSkillLibraryInDatabase(db, input);
			admit("commit", result);
			const authority = hydrateSkillLibraryWorkerAuthority(input.authority);
			requireSkillLibraryProfile(db, authority);
			if (input.uploadId) requireSkillLibraryUploadMetadata(db, input.uploadId, authority);
			deferSqliteWorkerCommitReceipt(db, result);
			return result;
		}, options, { operationLabel: "skills.library.publish" });
	},
	"skillLibrary.mutate": (input, { open, stateOptions }) => runOpenClawStateWriteTransaction(({ db }) => {
		admit("transaction");
		const result = mutateSkillLibraryInDatabase(db, input);
		admit("commit", result);
		requireSkillLibraryProfile(db, hydrateSkillLibraryWorkerAuthority(input.authority));
		deferSqliteWorkerCommitReceipt(db, result);
		return result;
	}, {
		database: open(),
		...stateOptions()
	}, { operationLabel: "skills.library.mutate" }),
	"skillLibrary.upload": (input, { open, stateOptions }) => {
		const bytes = prepareSkillLibraryUploadChunk(input.params);
		const options = {
			database: open(),
			...stateOptions()
		};
		requireSkillLibraryProfile(options.database.db, hydrateSkillLibraryWorkerAuthority(input.authority));
		ensureSkillLibrarySchema(options, admit);
		return runOpenClawStateWriteTransaction(({ db }) => {
			admit("transaction");
			const result = uploadSkillLibraryInDatabase(db, input, bytes);
			admit("commit", result);
			requireSkillLibraryUploadMetadata(db, result.uploadId, hydrateSkillLibraryWorkerAuthority(input.authority));
			deferSqliteWorkerCommitReceipt(db, result);
			return result;
		}, options, { operationLabel: "skills.library.upload" });
	}
};
//#endregion
export { skillLibraryOperations };
