import { n as isTransientSqliteBackupPath } from "./backup-volatile-filter-60qK_QQY.mjs";
import { basename } from "node:path";
//#region src/infra/sqlite-file-path.ts
/** Recognize database files and their lock-bearing SQLite companions without opening them. */
function isSqliteFilePath(filePath) {
	return /\.(?:sqlite3?|db)(?:-(?:wal|shm|journal))?$/i.test(basename(filePath)) || isTransientSqliteBackupPath(filePath);
}
//#endregion
export { isSqliteFilePath as t };
