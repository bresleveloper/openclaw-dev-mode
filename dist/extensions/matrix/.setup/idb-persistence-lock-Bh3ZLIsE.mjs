//#region extensions/matrix/src/matrix/sdk/idb-persistence-lock.ts
const MATRIX_IDB_PERSIST_INTERVAL_MS = 6e4;
const MATRIX_IDB_SNAPSHOT_LOCK_OPTIONS = {
	retries: {
		retries: 18,
		factor: 2,
		minTimeout: 50,
		maxTimeout: 5e3,
		randomize: true
	},
	stale: 3e5
};
//#endregion
export { MATRIX_IDB_SNAPSHOT_LOCK_OPTIONS as n, MATRIX_IDB_PERSIST_INTERVAL_MS as t };
