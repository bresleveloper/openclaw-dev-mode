import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { t as createSqliteAuditRecordStore } from "./sqlite-audit-record-store-CJXR3a08.mjs";
import { n as restoreCronLoadError, r as serializeCronLoadError } from "./load.kernel-bWRpwlYl.mjs";
import { a as loadCronRows, m as upsertCronJobRow, n as deleteCronJobRowInDatabase, o as loadedCronStoreFromRows, p as updateCronRuntimeRows, u as replaceCronRows } from "./row-codec-mXerryYi.mjs";
import { n as repairCronRuntimeAuthorityRows, r as replaceCronRuntimeAuthorityRows, t as loadCronRuntimeAuthorities } from "./runtime-authority-store-DtWVDIFC.mjs";
import { t as cronStoreKey } from "./key-BBZ40bDq.mjs";
import { t as resolveCronJobConfigRevision } from "./config-revision-DtL_Z8FS.mjs";
import { isDeepStrictEqual } from "node:util";
import { createHash } from "node:crypto";
//#region src/cron/store/quarantine.ts
/** Durable malformed-cron recovery records stored in the shared SQLite database. */
function cronQuarantineScope(storePath) {
	return `cron.quarantine:${cronStoreKey(storePath)}`;
}
function cronQuarantineEntryKey(entry) {
	const identity = JSON.stringify({
		sourceIndex: entry.sourceIndex,
		reason: entry.reason,
		job: entry.job ?? null,
		raw: entry.raw ?? null,
		state: entry.state ?? null,
		updatedAtMs: entry.updatedAtMs ?? null,
		scheduleIdentity: entry.scheduleIdentity ?? null
	});
	return createHash("sha256").update(identity).digest("hex");
}
/** Deletes quarantine rows inside the caller-owned SQLite transaction. */
function deleteCronQuarantinedJobsFromDatabase(params) {
	if (params.entries.length === 0) return;
	const scope = cronQuarantineScope(params.storePath);
	for (const entry of params.entries) executeSqliteQuerySync(params.database, getNodeSqliteKysely(params.database).deleteFrom("diagnostic_events").where("scope", "=", scope).where("event_key", "=", cronQuarantineEntryKey(entry)));
}
/** Reads quarantined cron rows without creating or migrating a state database. */
function loadCronQuarantinedJobs(storePath, env = process.env) {
	const scope = cronQuarantineScope(storePath);
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("diagnostic_events").select("payload_json").where("scope", "=", scope).orderBy("sequence", "asc")).rows.map((row) => JSON.parse(row.payload_json)), { env }) ?? [];
}
/** Writes recovery records into the caller-owned SQLite transaction when provided. */
function saveCronQuarantinedJobs(params) {
	if (params.entries.length === 0) return;
	const store = createSqliteAuditRecordStore({
		scope: cronQuarantineScope(params.storePath),
		maxEntries: Number.MAX_SAFE_INTEGER,
		...params.database ? { database: params.database } : {}
	});
	const records = params.entries.map((entry) => {
		const quarantinedAtMs = "quarantinedAtMs" in entry ? entry.quarantinedAtMs : params.nowMs;
		return {
			key: cronQuarantineEntryKey(entry),
			value: {
				...entry,
				quarantinedAtMs
			},
			createdAt: quarantinedAtMs
		};
	});
	store.registerLegacyMany(records);
}
//#endregion
//#region src/cron/store/save-error.ts
var CronJobsStoreChangedError = class extends Error {
	constructor(storePath) {
		super(`Cron store at ${storePath} changed after it was read; reload it before writing`);
		this.name = "CronJobsStoreChangedError";
	}
};
function serializeCronSaveError(error, storePath) {
	return error instanceof CronJobsStoreChangedError ? {
		kind: "store-changed",
		storePath
	} : {
		kind: "other",
		error: serializeCronLoadError(error)
	};
}
function restoreCronSaveError(error) {
	return error.kind === "store-changed" ? new CronJobsStoreChangedError(error.storePath) : restoreCronLoadError(error.error);
}
//#endregion
//#region src/cron/store/save.kernel.ts
function mergeCronRuntimeChanges(previous, next, current) {
	const merged = structuredClone(current);
	for (const key of /* @__PURE__ */ new Set([...Object.keys(previous), ...Object.keys(next)])) {
		if (isDeepStrictEqual(Reflect.get(previous, key), Reflect.get(next, key))) continue;
		if (Object.hasOwn(next, key)) Reflect.set(merged, key, structuredClone(Reflect.get(next, key)));
		else Reflect.deleteProperty(merged, key);
	}
	if (previous.runningAtMs !== next.runningAtMs) merged.runningReceiptId = next.runningAtMs === current.runningAtMs ? current.runningReceiptId : next.runningReceiptId;
	return merged;
}
function mergeCronRuntimeAuthority(previous, next, current) {
	const merged = { ...next };
	const source = !isDeepStrictEqual(previous.runtimeAuthority, next.runtimeAuthority) || previous.runtimeAuthorityRecoveryRequired !== next.runtimeAuthorityRecoveryRequired ? next : current;
	if (source.runtimeAuthority) merged.runtimeAuthority = source.runtimeAuthority;
	else delete merged.runtimeAuthority;
	if (source.runtimeAuthorityRecoveryRequired === true) merged.runtimeAuthorityRecoveryRequired = true;
	else delete merged.runtimeAuthorityRecoveryRequired;
	return merged;
}
function prepareCronStoreChanges(previous, next) {
	const previousById = new Map(previous.jobs.map((job) => [job.id, job]));
	const nextById = new Map(next.jobs.map((job) => [job.id, job]));
	return {
		previousById,
		nextById,
		changedIds: new Set([.../* @__PURE__ */ new Set([...previousById.keys(), ...nextById.keys()])].filter((jobId) => !isDeepStrictEqual(previousById.get(jobId), nextById.get(jobId))))
	};
}
/** Applies prepared changes inside the caller's synchronous write transaction. */
function saveCronStoreChangesInDatabase(db, storeKey, resolvedStorePath, prepared, opts, hooks) {
	const { previousById, nextById, changedIds } = prepared;
	const rows = loadCronRows(db, storeKey);
	const rowsById = new Map(rows.map((row) => [row.job_id, row]));
	const currentJobs = loadedCronStoreFromRows(rows).store.jobs;
	const authority = loadCronRuntimeAuthorities({
		db,
		storeKey,
		jobs: currentJobs
	});
	if (authority.repairJobIds.length > 0) repairCronRuntimeAuthorityRows({
		db,
		storeKey,
		jobs: currentJobs,
		jobIds: authority.repairJobIds
	});
	const currentById = new Map(currentJobs.map((job) => [job.id, job]));
	hooks?.beforeWrite?.(db);
	let nextSortOrder = rows.reduce((max, row) => Math.max(max, row.sort_order), -1) + 1;
	for (const jobId of changedIds) {
		const before = previousById.get(jobId);
		const after = nextById.get(jobId);
		const current = currentById.get(jobId);
		if (before && current && resolveCronJobConfigRevision(current) !== resolveCronJobConfigRevision(before)) throw new CronJobsStoreChangedError(resolvedStorePath);
		if (!after) {
			if (current) deleteCronJobRowInDatabase(db, storeKey, jobId);
			currentById.delete(jobId);
			continue;
		}
		if (before) {
			if (!current) throw new CronJobsStoreChangedError(resolvedStorePath);
		} else if (current && opts?.preserveConcurrentAdds) continue;
		else if (current) throw new CronJobsStoreChangedError(resolvedStorePath);
		const merged = current ? {
			...mergeCronRuntimeAuthority(before ?? after, after, current),
			state: mergeCronRuntimeChanges(before?.state ?? {}, after.state, current.state),
			updatedAtMs: Math.max(after.updatedAtMs, current.updatedAtMs)
		} : after;
		const persisted = upsertCronJobRow(db, storeKey, merged, rowsById.get(jobId)?.sort_order ?? nextSortOrder++);
		replaceCronRuntimeAuthorityRows({
			db,
			storeKey,
			jobs: [persisted]
		});
		currentById.set(jobId, persisted);
	}
	hooks?.afterWrite?.(db);
	return {
		version: 1,
		jobs: [...currentById.values()]
	};
}
function replaceCronStoreRowsInDatabase(db, storeKey, store, preserveRuntimeState) {
	const replaced = replaceCronRows(db, storeKey, store, { preserveRuntimeState });
	replaceCronRuntimeAuthorityRows({
		db,
		storeKey,
		jobs: replaced.jobs,
		preserveExistingForJobIds: preserveRuntimeState ? replaced.existingJobIds : void 0,
		writeMissingForJobIds: preserveRuntimeState ? replaced.legacyAuthorityJobIds : void 0
	});
}
function isCronRuntimeOnlySave(opts) {
	return opts?.stateOnly === true && !opts.quarantine?.entries.length && !opts.deleteQuarantineEntries?.length;
}
/** Persists a validated store inside the caller's synchronous write transaction. */
function saveCronStoreInDatabase(database, storeKey, store, opts, hooks) {
	const stateOnly = isCronRuntimeOnlySave(opts);
	hooks?.beforeWrite?.(database.db);
	if (opts?.quarantine?.entries.length) saveCronQuarantinedJobs({
		storePath: storeKey,
		entries: opts.quarantine.entries,
		nowMs: opts.quarantine.nowMs,
		database
	});
	if (opts?.deleteQuarantineEntries?.length) deleteCronQuarantinedJobsFromDatabase({
		database: database.db,
		storePath: storeKey,
		entries: opts.deleteQuarantineEntries
	});
	if (stateOnly) {
		updateCronRuntimeRows(database.db, storeKey, store);
		hooks?.afterWrite?.(database.db);
		return;
	}
	replaceCronStoreRowsInDatabase(database.db, storeKey, store, opts?.preserveRuntimeState === true);
	hooks?.afterWrite?.(database.db);
}
//#endregion
export { saveCronStoreInDatabase as a, serializeCronSaveError as c, saveCronQuarantinedJobs as d, saveCronStoreChangesInDatabase as i, deleteCronQuarantinedJobsFromDatabase as l, prepareCronStoreChanges as n, CronJobsStoreChangedError as o, replaceCronStoreRowsInDatabase as r, restoreCronSaveError as s, isCronRuntimeOnlySave as t, loadCronQuarantinedJobs as u };
