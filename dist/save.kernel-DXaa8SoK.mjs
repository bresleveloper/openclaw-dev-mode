import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { F as prepareSqliteAuditRecord, P as createSqliteAuditRecordKernel } from "./openclaw-state-db-fast-path-CPAamWzU.mjs";
import { n as serializeCronLoadError, t as restoreCronLoadError } from "./load-error-DymNKrHv.mjs";
import { _ as upsertCronJobRow, d as replaceCronRows, g as updateCronRuntimeRows, n as deleteCronJobRowInDatabase, o as loadCronRows, s as loadedCronStoreFromRows } from "./row-codec-DgIrj0Uv.mjs";
import { a as hasCanonicalCronDeliveryMode } from "./delivery-codec-DMPX9PBc.mjs";
import { n as repairCronRuntimeAuthorityRows, r as replaceCronRuntimeAuthorityRows, t as loadCronRuntimeAuthorities } from "./runtime-authority-store-Dhn3MVqB.mjs";
import { t as cronStoreKey } from "./key-BBZ40bDq.mjs";
import { t as resolveCronJobConfigRevision } from "./config-revision-DVuJ106z.mjs";
import { isDeepStrictEqual } from "node:util";
import { createHash } from "node:crypto";
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
//#region src/cron/store/quarantine.kernel.ts
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
function prepareCronQuarantineRegistration(params) {
	const storeKey = cronStoreKey(params.storePath);
	const scope = cronQuarantineScope(storeKey);
	return {
		storeKey,
		records: params.entries.map((entry) => {
			const quarantinedAtMs = "quarantinedAtMs" in entry ? entry.quarantinedAtMs : params.nowMs;
			return prepareSqliteAuditRecord(scope, {
				key: cronQuarantineEntryKey(entry),
				value: {
					...entry,
					quarantinedAtMs
				},
				createdAt: quarantinedAtMs
			});
		})
	};
}
/** The caller owns the complete synchronous transaction, including other Cron changes. */
function registerCronQuarantineInDatabase(database, input) {
	if (input.records.length === 0) return;
	createSqliteAuditRecordKernel(database, {
		scope: cronQuarantineScope(input.storeKey),
		maxEntries: Number.MAX_SAFE_INTEGER
	}).registerLegacyMany(input.records);
}
/** Deletes quarantine rows inside the caller-owned SQLite transaction. */
function deleteCronQuarantinedJobsFromDatabase(params) {
	if (params.entries.length === 0) return;
	const scope = cronQuarantineScope(params.storePath);
	for (const entry of params.entries) executeSqliteQuerySync(params.database, getNodeSqliteKysely(params.database).deleteFrom("diagnostic_events").where("scope", "=", scope).where("event_key", "=", cronQuarantineEntryKey(entry)));
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
/** Both save modes fence only the definitions this mutation intends to change. */
function assertCronStoreChangesCurrent(prepared, currentById, resolvedStorePath, opts) {
	for (const jobId of prepared.changedIds) {
		const before = prepared.previousById.get(jobId);
		const after = prepared.nextById.get(jobId);
		const current = currentById.get(jobId);
		if (before && current && resolveCronJobConfigRevision(current) !== resolveCronJobConfigRevision(before) || after && before && !current || after && !before && current && !opts?.preserveConcurrentAdds) throw new CronJobsStoreChangedError(resolvedStorePath);
	}
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
	hooks?.hooks.beforeWrite?.(db, hooks.receiptSchema);
	assertCronStoreChangesCurrent(prepared, currentById, resolvedStorePath, opts);
	let nextSortOrder = rows.reduce((max, row) => Math.max(max, row.sort_order), -1) + 1;
	for (const jobId of changedIds) {
		const before = previousById.get(jobId);
		const after = nextById.get(jobId);
		const current = currentById.get(jobId);
		if (!after) {
			if (current) deleteCronJobRowInDatabase(db, storeKey, jobId);
			currentById.delete(jobId);
			continue;
		}
		if (!before && current && opts?.preserveConcurrentAdds) continue;
		const merged = current ? {
			...mergeCronRuntimeAuthority(before ?? after, after, current),
			state: mergeCronRuntimeChanges(before?.state ?? {}, after.state, current.state),
			updatedAtMs: Math.max(after.updatedAtMs, current.updatedAtMs)
		} : after;
		const persisted = upsertCronJobRow(db, storeKey, merged, rowsById.get(jobId)?.sort_order ?? nextSortOrder++);
		if (hasCanonicalCronDeliveryMode(persisted.delivery)) {
			replaceCronRuntimeAuthorityRows({
				db,
				storeKey,
				jobs: [persisted]
			});
			currentById.set(jobId, persisted);
		}
	}
	hooks?.hooks.afterWrite?.(db, hooks.receiptSchema);
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
		jobs: replaced.jobs.filter((job) => hasCanonicalCronDeliveryMode(job.delivery)),
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
	hooks?.hooks.beforeWrite?.(database.db, hooks.receiptSchema);
	if (opts?.quarantine?.entries.length) registerCronQuarantineInDatabase(database.db, prepareCronQuarantineRegistration({
		storePath: storeKey,
		...opts.quarantine
	}));
	if (opts?.deleteQuarantineEntries?.length) deleteCronQuarantinedJobsFromDatabase({
		database: database.db,
		storePath: storeKey,
		entries: opts.deleteQuarantineEntries
	});
	if (stateOnly) {
		updateCronRuntimeRows(database.db, storeKey, store);
		hooks?.hooks.afterWrite?.(database.db, hooks.receiptSchema);
		return;
	}
	replaceCronStoreRowsInDatabase(database.db, storeKey, store, opts?.preserveRuntimeState === true);
	hooks?.hooks.afterWrite?.(database.db, hooks.receiptSchema);
}
//#endregion
export { saveCronStoreInDatabase as a, CronJobsStoreChangedError as c, saveCronStoreChangesInDatabase as i, restoreCronSaveError as l, isCronRuntimeOnlySave as n, prepareCronQuarantineRegistration as o, prepareCronStoreChanges as r, registerCronQuarantineInDatabase as s, assertCronStoreChangesCurrent as t, serializeCronSaveError as u };
