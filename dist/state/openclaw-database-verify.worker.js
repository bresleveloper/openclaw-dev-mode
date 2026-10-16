import { c as isRecord } from "../record-coerce-TIsquoVR.mjs";
import { n as formatSqliteErrorCodeSuffix } from "../sqlite-error-diagnostics-DCvjvszg.mjs";
import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "../openclaw-state-db-contract-Cm9fKF2T.mjs";
//#region src/state/openclaw-database-verify.worker.ts
const DATABASE_VERIFY_CHILD_ARG = "--openclaw-database-verify-child";
function isVerifyTarget(target) {
	return isRecord(target) && typeof target.path === "string" && (target.kind === "agent" || target.kind === "state") && typeof target.label === "string" && target.check === "quick";
}
function formatVerifyError(error) {
	return `${error instanceof Error ? `${error.name}: ${error.message}` : String(error)}${formatSqliteErrorCodeSuffix(error)}`;
}
async function verifyOpenClawDatabase(target) {
	const [integrity, source] = await Promise.all([import("../sqlite-integrity-DwvaRk-k.mjs"), import("../sqlite-source-handle-DG9Qx0TO.mjs")]);
	const failed = (error) => ({
		path: target.path,
		ok: false,
		error: formatVerifyError(error),
		terminal: error instanceof Error && integrity.isTerminalSqliteIntegrityError(error)
	});
	let result = {
		path: target.path,
		ok: true
	};
	try {
		source.withSqliteSourceReadDatabase(target.path, "source", (reader) => {
			try {
				reader.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS}; BEGIN;`);
				integrity.assertSqliteIntegrity(reader, target.label, "quick_check");
				reader.exec("ROLLBACK;");
			} catch (error) {
				result = failed(error);
			}
		});
	} catch (error) {
		if (result.ok) result = failed(error);
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
