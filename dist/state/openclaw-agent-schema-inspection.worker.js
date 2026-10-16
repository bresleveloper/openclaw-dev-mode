import { c as readSourceJournalMode, l as readSourceSidecars, r as isSqliteReadOnlyError, t as SqliteSourceChangedError } from "../sqlite-readonly-location-OdGkIPCl.mjs";
import { i as setSqliteBusyTimeout } from "../sqlite-busy-timeout-DYrW2wFu.mjs";
import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "../openclaw-state-db-contract-Cm9fKF2T.mjs";
import { t as withSqliteSourceReadDatabase } from "../sqlite-source-handle-CLpCZnZK.mjs";
import { n as readSqliteIntegrityFileIdentity } from "../sqlite-file-generation-C_XgOkXx.mjs";
import { a as readOpenClawAgentIntegrityVerification, t as canReuseOpenClawAgentIntegrityVerification } from "../openclaw-quarantine-store-BMO9c1KL.mjs";
import { t as configureSqliteMaintenanceCache } from "../sqlite-maintenance-cache-AYpxl8JZ.mjs";
import { r as serializeAgentSchemaInspectionError } from "../openclaw-agent-schema-inspection-response-POotE-xY.mjs";
import { t as inspectAgentDatabaseSchema } from "../openclaw-agent-schema-inspection-DZGenSpy.mjs";
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
//#region src/state/openclaw-agent-schema-inspection.worker.ts
if (!process.send || !process.disconnect) throw new Error("Agent schema inspection requires parent IPC.");
const send = process.send.bind(process);
const disconnect = process.disconnect.bind(process);
process.on("message", (request) => {
	if (request.type === "close") {
		disconnect();
		return;
	}
	const { requestId, input, snapshot } = request;
	try {
		const readVerification = () => !snapshot && input.startupIntegrityStateDir ? readOpenClawAgentIntegrityVerification(input.pathname, { OPENCLAW_STATE_DIR: input.startupIntegrityStateDir }) : void 0;
		const inspect = (database, verification = readVerification()) => {
			setSqliteBusyTimeout(database, OPENCLAW_SQLITE_BUSY_TIMEOUT_MS);
			if (input.requireStartupMigrationReadiness) configureSqliteMaintenanceCache(database);
			return inspectAgentDatabaseSchema(database, {
				...input,
				startupIntegrityVerification: verification
			});
		};
		let inspection;
		if (snapshot) {
			readSqliteIntegrityFileIdentity(snapshot.pathname, snapshot.identity);
			inspection = withSqliteSourceReadDatabase(snapshot.pathname, "snapshot", (database) => {
				readSqliteIntegrityFileIdentity(snapshot.pathname, snapshot.identity);
				return inspect(database);
			});
			readSqliteIntegrityFileIdentity(snapshot.pathname, snapshot.identity);
		} else inspection = tryInspectSqliteReadOnlyInProcess(input.pathname, inspect, { allowClosedWal: canReuseOpenClawAgentIntegrityVerification(input.pathname, readVerification(), false) })?.value;
		send({
			requestId,
			ok: true,
			inspection: inspection ? {
				...inspection,
				...inspection.failure ? { failure: serializeAgentSchemaInspectionError(inspection.failure) } : {}
			} : null
		});
	} catch (error) {
		send({
			requestId,
			ok: false,
			error: serializeAgentSchemaInspectionError(error)
		});
	}
});
//#endregion
export {};
