import { c as readSourceJournalMode, l as readSourceSidecars, r as isSqliteReadOnlyError, t as SqliteSourceChangedError } from "./sqlite-readonly-location-Cz5jsVbC.mjs";
import { t as withSqliteSourceReadDatabase } from "./sqlite-source-handle-BWHiHQXK.mjs";
import fs from "node:fs";
//#region src/infra/sqlite-readonly-inspection.ts
/** Inspect in a dedicated child: closing a source in the caller can release its POSIX locks. */
function tryInspectSqliteReadOnlyInProcess(pathname, inspect, options = {}) {
	const canonicalPath = fs.realpathSync.native(pathname);
	let mode;
	try {
		mode = readSourceJournalMode(canonicalPath);
	} catch (error) {
		if (error instanceof SqliteSourceChangedError) return;
		throw error;
	}
	const sidecars = readSourceSidecars(canonicalPath);
	const closedWal = options.allowClosedWal && !sidecars.wal && !sidecars.shm && !sidecars.journal;
	if (mode === "empty" || mode === "wal" && !(sidecars.wal && sidecars.shm) && !closedWal) return;
	return withSqliteSourceReadDatabase(canonicalPath, "source", (database) => {
		try {
			database.exec("PRAGMA busy_timeout = 30000; PRAGMA trusted_schema = OFF; BEGIN;");
			database.prepare("PRAGMA schema_version;").get();
		} catch (error) {
			let currentMode;
			try {
				currentMode = readSourceJournalMode(canonicalPath);
			} catch (inspectionError) {
				if (inspectionError instanceof SqliteSourceChangedError) return;
				throw inspectionError;
			}
			const currentSidecars = readSourceSidecars(canonicalPath);
			if (currentMode === "wal" && !(currentSidecars.wal && currentSidecars.shm) || currentMode === "rollback" && currentSidecars.journal && isSqliteReadOnlyError(error)) return;
			throw error;
		}
		const value = inspect(database);
		database.exec("ROLLBACK;");
		return { value };
	});
}
//#endregion
export { tryInspectSqliteReadOnlyInProcess as t };
