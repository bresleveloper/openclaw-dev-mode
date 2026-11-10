import { r as assertExistingDatabaseIdentity } from "../sqlite-worker-identity-DLqVBf5J.mjs";
import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "../openclaw-state-db-contract-QlwTsE6j.mjs";
import { n as formatSqliteErrorCodeSuffix } from "../sqlite-error-diagnostics-BBfTUJBR.mjs";
import { o as serializeSqliteFileGeneration } from "../sqlite-file-generation-Cmk6kG35.mjs";
import { constants, setPriority } from "node:os";
//#region src/state/openclaw-database-verify.worker.ts
const DATABASE_VERIFY_CHILD_ARG = "--openclaw-database-verify-child";
function formatVerifyError(error) {
	return `${error instanceof Error ? `${error.name}: ${error.message}` : String(error)}${formatSqliteErrorCodeSuffix(error)}`;
}
async function verifyOpenClawDatabase(target) {
	const [integrity, source] = await Promise.all([import("../sqlite-integrity-DRNNINc1.mjs"), import("../sqlite-source-handle-B_V_vUmh.mjs")]);
	if (target.confirm) {
		const confirmation = integrity.confirmSqliteFileIntegrity(target.path, target.label);
		if (confirmation.status === "healthy") return {
			path: target.path,
			ok: true,
			generation: serializeSqliteFileGeneration(confirmation.generation)
		};
		return {
			path: target.path,
			ok: false,
			error: formatVerifyError(confirmation.error),
			terminal: confirmation.terminal,
			...confirmation.terminal ? { generation: serializeSqliteFileGeneration(confirmation.generation) } : {}
		};
	}
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
		const assertIdentity = () => {
			if (target.identity) assertExistingDatabaseIdentity(target.path, `file:${target.identity}`);
		};
		assertIdentity();
		source.withSqliteSourceReadDatabase(target.path, "source", (reader) => {
			try {
				assertIdentity();
				reader.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS}; BEGIN;`);
				integrity.assertSqliteIntegrity(reader, target.label, target.check === "full" ? "integrity_check" : "quick_check");
				reader.exec("ROLLBACK;");
				assertIdentity();
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
if (sendToParent) process.once("message", (targets) => {
	(async () => {
		try {
			if (targets.some((target) => target.check === "full")) try {
				setPriority(process.pid, constants.priority.PRIORITY_LOW);
			} catch {}
			const results = await verifyOpenClawDatabases(targets);
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
if (process.argv[2] === "--openclaw-database-verify-sync" && process.argv[3]) {
	const pathname = process.argv[3];
	verifyOpenClawDatabases([{
		path: pathname,
		kind: "agent",
		label: pathname,
		check: "full"
	}]).then(([result]) => {
		process.exitCode = result?.ok ? 0 : 1;
	}).catch(() => {
		process.exitCode = 1;
	});
}
//#endregion
export { verifyOpenClawDatabases };
