import { o as asRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as hydrateOpenClawStateWorkerError, r as retainOpenClawStateWorkerErrorPayload, t as encodeOpenClawStateWorkerError } from "./openclaw-state-worker-error-DLFiBmPG.mjs";
import { a as loadCronRows, h as tryParseJsonObject, i as fingerprintCronJobRows, n as deleteCronJobRowInDatabase, o as loadedCronStoreFromRows } from "./row-codec-mXerryYi.mjs";
import { n as repairCronRuntimeAuthorityRows, t as loadCronRuntimeAuthorities } from "./runtime-authority-store-DtWVDIFC.mjs";
//#region src/cron/store/load-error.ts
function serializeCronLoadError(value) {
	const error = value instanceof Error ? value : new Error(String(value));
	const code = "code" in error ? error.code : void 0;
	const sharedState = encodeOpenClawStateWorkerError(error, { includeOrdinary: true });
	return {
		name: error.name,
		message: error.message,
		...typeof code === "string" || typeof code === "number" ? { code } : {},
		...sharedState ? { sharedState } : {}
	};
}
function restoreCronLoadError(value) {
	const error = Object.assign(new Error(value.message), {
		name: value.name,
		...value.code === void 0 ? {} : { code: value.code }
	});
	if (value.sharedState) retainOpenClawStateWorkerErrorPayload(error, value.sharedState);
	return hydrateOpenClawStateWorkerError(error, { includeOrdinary: true });
}
//#endregion
//#region src/cron/store/load.kernel.ts
function isRetiredCollectionReview(row) {
	return row.payload_kind === "skillCollectionReview" || asRecord(tryParseJsonObject(row.job_json)?.payload).kind === "skillCollectionReview";
}
function loadCronStoreFromDatabase(database, storeKey, writer) {
	let rows = loadCronRows(database, storeKey);
	const retiredIds = new Set(rows.filter(isRetiredCollectionReview).map((row) => row.job_id));
	if (!writer) rows = rows.filter((row) => !retiredIds.has(row.job_id));
	else if (retiredIds.size > 0) {
		if (writer.write((db) => {
			const current = loadCronRows(db, storeKey, retiredIds).filter(isRetiredCollectionReview);
			for (const row of current) deleteCronJobRowInDatabase(db, storeKey, row.job_id);
			return current.length;
		}, "cron.retire-collection-review") > 0) writer.committed();
		rows = loadCronRows(database, storeKey);
	}
	const loaded = loadedCronStoreFromRows(rows);
	if (rows.length > 0) {
		const authority = loadCronRuntimeAuthorities({
			db: database,
			storeKey,
			jobs: loaded.store.jobs
		});
		if (writer) repairLoadedCronRuntimeAuthority(writer, {
			storeKey,
			jobIds: authority.repairJobIds
		});
	}
	return !writer ? loaded : {
		...loaded,
		jobsFingerprint: fingerprintCronJobRows(rows)
	};
}
function repairLoadedCronRuntimeAuthority(writer, params) {
	if (params.jobIds.length === 0) return;
	if (writer.write((db) => {
		const rows = loadCronRows(db, params.storeKey, new Set(params.jobIds));
		if (rows.length === 0) return false;
		const loaded = loadedCronStoreFromRows(rows);
		return repairCronRuntimeAuthorityRows({
			db,
			storeKey: params.storeKey,
			jobs: loaded.store.jobs,
			jobIds: params.jobIds
		});
	}, "cron.runtime-authority-repair")) writer.committed();
}
//#endregion
export { restoreCronLoadError as n, serializeCronLoadError as r, loadCronStoreFromDatabase as t };
