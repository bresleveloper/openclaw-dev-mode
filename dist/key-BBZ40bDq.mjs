import path from "node:path";
//#region src/cron/store/key.ts
/** Cron store key normalization for SQLite partitions. */
/** Returns the canonical per-file SQLite partition key for cron store rows. */
function cronStoreKey(storePath) {
	return path.resolve(storePath);
}
//#endregion
export { cronStoreKey as t };
