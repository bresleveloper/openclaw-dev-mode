import { n as formatSqliteErrorCodeSuffix } from "../sqlite-error-diagnostics-C8UyxYRx.mjs";
import { o as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "../openclaw-state-db-contract-dESpOAuZ.mjs";
//#region src/state/openclaw-database-verify.worker.ts
const DATABASE_VERIFY_CHILD_ARG = "--openclaw-database-verify-child";
function isVerifyTarget(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return false;
	const target = value;
	return typeof target.path === "string" && (target.kind === "agent" || target.kind === "state") && typeof target.label === "string" && (target.check === void 0 || target.check === "quick");
}
function formatVerifyError(error) {
	return `${error instanceof Error ? `${error.name}: ${error.message}` : String(error)}${formatSqliteErrorCodeSuffix(error)}`;
}
async function verifyOpenClawDatabase(target) {
	const [sqlite, integrity, location, source] = await Promise.all([
		import("../node-sqlite-C__6Hlmr.mjs"),
		import("../sqlite-integrity-B5XPlk2W.mjs"),
		import("../sqlite-readonly-location-DAQi2Gd0.mjs"),
		import("../sqlite-source-handle-BMWF3rdE.mjs")
	]);
	let cleanup;
	let database;
	let result = await (async () => {
		try {
			if (target.check === "quick") {
				source.withSqliteSourceReadDatabase(target.path, "source", (reader) => {
					reader.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS}; BEGIN;`);
					integrity.assertSqliteIntegrity(reader, target.label, "quick_check");
					reader.exec("ROLLBACK;");
				});
				return {
					path: target.path,
					ok: true
				};
			}
			const prepared = await location.prepareSqliteReadOnlyLocationInProcess(target.path);
			cleanup = prepared.cleanupAsync;
			database = sqlite.openNodeSqliteDatabase(prepared.location, { readOnly: true });
			database.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS};`);
			integrity.assertSqliteIntegrity(database, target.label);
			return {
				path: target.path,
				ok: true
			};
		} catch (error) {
			const terminal = error instanceof Error && integrity.isTerminalSqliteIntegrityError(error);
			return {
				path: target.path,
				ok: false,
				error: formatVerifyError(error),
				terminal
			};
		}
	})();
	try {
		database?.close();
	} catch (error) {
		if (result.ok) result = {
			path: target.path,
			ok: false,
			error: formatVerifyError(error),
			terminal: false
		};
	} finally {
		await cleanup?.();
	}
	return result;
}
/** Verify database files serially so large agent scans never compete for I/O. */
async function verifyOpenClawDatabases(targets) {
	const results = [];
	for (const target of targets) results.push(await verifyOpenClawDatabase(target));
	return results;
}
const sendToParent = process.argv[2] === DATABASE_VERIFY_CHILD_ARG ? process.send?.bind(process) : void 0;
if (sendToParent) process.once("message", (message) => {
	(async () => {
		try {
			const results = await verifyOpenClawDatabases(Array.isArray(message) ? message.filter(isVerifyTarget) : []);
			await new Promise((resolve, reject) => {
				sendToParent(results, (error) => {
					if (error) reject(error);
					else resolve();
				});
			});
		} catch {
			process.exitCode = 1;
		} finally {
			process.disconnect?.();
		}
	})();
});
//#endregion
export { verifyOpenClawDatabases };
