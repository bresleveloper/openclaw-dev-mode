//#region src/cron/store/scheduler-config.worker.ts
const snapshots = /* @__PURE__ */ new Map();
/** Install between commands, before any synchronous transaction starts. */
function installCronSchedulerSnapshot(storeKey, snapshot, databasePath) {
	const key = JSON.stringify([databasePath, storeKey]);
	const current = snapshots.get(key);
	if (!current || snapshot.version > current.version) {
		snapshots.set(key, snapshot);
		return snapshot;
	}
	return current;
}
function getCronSchedulerSnapshot(storeKey, databasePath) {
	return snapshots.get(JSON.stringify([databasePath, storeKey]));
}
function removeCronSchedulerSnapshot(storeKey, databasePath) {
	snapshots.delete(JSON.stringify([databasePath, storeKey]));
}
//#endregion
export { installCronSchedulerSnapshot as n, removeCronSchedulerSnapshot as r, getCronSchedulerSnapshot as t };
