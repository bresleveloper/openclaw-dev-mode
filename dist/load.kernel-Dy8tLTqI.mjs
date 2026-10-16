import { o as asRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { a as fingerprintCronRuntimeRows, i as fingerprintCronJobRows, n as deleteCronJobRowInDatabase, o as loadCronRows, s as loadedCronStoreFromRows } from "./row-codec-DgIrj0Uv.mjs";
import { n as repairCronRuntimeAuthorityRows, t as loadCronRuntimeAuthorities } from "./runtime-authority-store-Dhn3MVqB.mjs";
//#region src/cron/store/load.kernel.ts
function isRetiredCollectionReview(row) {
	return row.payload_kind === "skillCollectionReview" || asRecord(safeParseJsonRecord(row.job_json)?.payload).kind === "skillCollectionReview";
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
		jobsFingerprint: fingerprintCronJobRows(rows),
		runtimeFingerprint: fingerprintCronRuntimeRows(rows)
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
export { loadCronStoreFromDatabase as t };
