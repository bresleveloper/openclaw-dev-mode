import { n as readGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { i as resolveRuntimeWorkerUrl, n as resolveRuntimeWorkerArgv } from "./runtime-worker-url-CvMrvFI1.mjs";
import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-QlwTsE6j.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-BMmG9cQl.mjs";
import { r as enableNodeSqliteKyselyStatementCache } from "./kysely-sync-cache-state-Dc7tna9E.mjs";
import { Q as hasPendingAgentStartupColumns } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { i as getAdmittedSqliteSchemaFacts, p as runSqliteReadOperationSync, t as admitSqliteSchema } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { d as sqlitePrimaryResultCode } from "./sqlite-error-diagnostics-BBfTUJBR.mjs";
import { a as readSqliteInspectionBudget } from "./sqlite-readonly-worker-C2DDLw_y.mjs";
import { n as isArtifactPreservingStateRead } from "./artifact-preserving-state-reads-CSUBkGbZ.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { o as isDeletedAgentDatabasePath } from "./agent-database-readers-DSwi8tar.mjs";
import { c as resolveOpenClawAgentSqlitePath, r as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { c as registerOpenClawAgentDatabaseSyncResource } from "./openclaw-agent-db-resources-DIwq7LM6.mjs";
import { r as readOpenClawDatabaseQuarantineFailure } from "./openclaw-quarantine-store-DTWp4-ja.mjs";
import { o as runSqliteReadSnapshotSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { t as SqliteSchemaMismatchError } from "./sqlite-schema-issues-BnRd2KGO.mjs";
import { r as readExistingAgentSchemaMeta } from "./openclaw-agent-db-metadata-90thy9YD.mjs";
import { t as openSqliteReadOnlyDatabase } from "./sqlite-snapshot-source-DQdkM3YQ.mjs";
import { o as registerOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { D as classifyOpenClawAgentDatabaseReadError, k as recordOpenClawAgentDatabaseReadOpenFailure, t as adoptOpenClawAgentDatabaseSchema, u as hasOpenClawAgentCanonicalValidation, w as assertCanonicalSessionValidationSchema, x as loadOpenClawAgentCanonicalValidationReceipt } from "./openclaw-agent-db-validation-cache-9WCf6XyJ.mjs";
import { i as assertSupportedAgentSchemaVersion, r as assertExistingAgentSchemaOwner, t as assertCanonicalAgentPersistenceVersion } from "./openclaw-agent-db-schema-read-CX4aGKRI.mjs";
import { t as assertSqliteIntegrityInWorker } from "./sqlite-integrity-worker-DyRlMgGE.mjs";
import fs from "node:fs";
import { isMainThread } from "node:worker_threads";
import { spawnSync } from "node:child_process";
//#region src/state/openclaw-agent-db-terminal.ts
function terminalLatch() {
	return readGlobalSingleton(Symbol.for("openclaw.agentDatabaseLifecycle"))?.terminal;
}
/** Read the existing damage latch without acquiring the writable database lifecycle. */
function assertAgentDatabaseTerminalOpenAllowed(pathname) {
	const failure = terminalLatch()?.get(pathname);
	if (failure) throw failure;
}
/** Only latched integrity failures need a fresh native check after external repair. */
function revalidateAgentDatabaseTerminalOpen(pathname) {
	const latch = terminalLatch();
	const failure = latch?.peek(pathname);
	if (latch && failure?.name === "SqliteIntegrityError") {
		const workerUrl = resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.databaseVerify);
		const child = spawnSync(process.execPath, [
			...resolveRuntimeWorkerArgv(workerUrl),
			"--openclaw-database-verify-sync",
			pathname
		], {
			timeout: readSqliteInspectionBudget("integrity check", pathname).timeoutMs,
			killSignal: "SIGKILL",
			stdio: "ignore"
		});
		if (child.error || child.status !== 0) throw failure;
		latch.clear(pathname);
	}
	assertAgentDatabaseTerminalOpenAllowed(pathname);
}
async function revalidateAgentDatabaseTerminalOpenAsync(pathname, assertCurrent, signal = new AbortController().signal) {
	const latch = terminalLatch();
	const failure = latch?.peek(pathname);
	if (latch && failure?.name === "SqliteIntegrityError") {
		await assertSqliteIntegrityInWorker(pathname, OPENCLAW_SQLITE_BUSY_TIMEOUT_MS, signal);
		assertCurrent?.();
		if (latch.peek(pathname) === failure) latch.clear(pathname);
	}
	assertCurrent?.();
	assertAgentDatabaseTerminalOpenAllowed(pathname);
}
//#endregion
//#region src/state/openclaw-agent-db-readonly-open.ts
function readOpenClawAgentDatabase(database, operation) {
	try {
		return {
			found: true,
			value: operation(database)
		};
	} catch (error) {
		throw sqlitePrimaryResultCode(error) === 1 ? classifyOpenClawAgentDatabaseReadError(database.db, error) : error;
	}
}
function hasAdmittedAgentReadOnlySchema(database) {
	const userVersion = assertSupportedAgentSchemaVersion(database.db, database.path);
	const schemaMeta = readExistingAgentSchemaMeta(database.db);
	assertCanonicalAgentPersistenceVersion(database.db, database.path, userVersion);
	if (!schemaMeta) return false;
	assertExistingAgentSchemaOwner(schemaMeta, database.agentId, database.path);
	assertCanonicalSessionValidationSchema(database.db);
	return true;
}
/** Recheck admission and consume retained rows in the same fresh synchronous scope. */
function hasOpenClawAgentReadOnlySchema(database, onAdmitted) {
	return runSqliteReadOperationSync(database.db, () => {
		if (!hasAdmittedAgentReadOnlySchema(database)) return false;
		onAdmitted?.();
		return true;
	});
}
/** Admit ownership and consume its rows in the same freshly pinned snapshot. */
function readOpenClawAgentDatabaseSnapshot(database, operation) {
	return {
		found: true,
		value: runSqliteReadSnapshotSync(database.db, () => readOpenClawAgentDatabase(database, operation).value)
	};
}
/** Fresh-only callers do not need the writable runtime's process-held connection cache. */
function withFreshOpenClawAgentDatabaseReadOnly(operation, options, behavior = {}) {
	const opened = openOpenClawAgentDatabaseReadOnly(options, behavior);
	if (!opened.found) return opened;
	try {
		return behavior.snapshot ? readOpenClawAgentDatabaseSnapshot(opened.database, operation) : readOpenClawAgentDatabase(opened.database, operation);
	} finally {
		opened.database.close();
	}
}
/** Open one existing agent database without creating, registering, migrating, or adopting it. */
function openOpenClawAgentDatabaseReadOnly(options, behavior = {}) {
	const agentId = normalizeAgentId(options.agentId);
	const pathname = resolveOpenClawAgentSqlitePath({
		...options,
		agentId
	});
	if (isIncognitoOpenClawAgentSqlitePath(pathname, {
		agentId,
		env: options.env
	})) return {
		found: false,
		reason: "database-missing"
	};
	if (isDeletedAgentDatabasePath(pathname) || !fs.existsSync(pathname)) return {
		found: false,
		reason: "database-missing"
	};
	revalidateAgentDatabaseTerminalOpen(pathname);
	const persistedQuarantine = readOpenClawDatabaseQuarantineFailure("agent", pathname, { env: options.env });
	if (persistedQuarantine) {
		recordOpenClawAgentDatabaseReadOpenFailure(persistedQuarantine);
		throw persistedQuarantine;
	}
	let db;
	try {
		db = openSqliteReadOnlyDatabase(pathname, {
			timeout: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
			...behavior.allowExtension ? { allowExtension: true } : {}
		});
	} catch (error) {
		recordOpenClawAgentDatabaseReadOpenFailure(error);
		throw error;
	}
	let closed = false;
	let unregister;
	const close = () => {
		if (closed) return;
		if (db.isOpen) db.close();
		closed = true;
		unregister?.();
		unregister = void 0;
	};
	try {
		enableNodeSqliteKyselyStatementCache(db);
		registerOpenClawAgentDatabaseIdentity(db);
		const privatePath = isArtifactPreservingStateRead("agent", pathname) ? db.location() : void 0;
		const database = {
			agentId,
			db,
			path: privatePath ?? pathname,
			close
		};
		if (!(adoptOpenClawAgentDatabaseSchema(database) || runSqliteReadOperationSync(db, () => {
			admitSqliteSchema(db);
			if (!hasAdmittedAgentReadOnlySchema(database)) return false;
			const schema = getAdmittedSqliteSchemaFacts(database.db);
			if (schema && hasPendingAgentStartupColumns(schema.tableSql)) throw new SqliteSchemaMismatchError(`OpenClaw agent database ${database.path} requires writable startup admission before session reads; restart the Gateway or run openclaw doctor --fix.`);
			return true;
		}))) {
			close();
			return {
				found: false,
				reason: "schema-missing"
			};
		}
		if (!isMainThread) {
			loadOpenClawAgentCanonicalValidationReceipt(database);
			hasOpenClawAgentCanonicalValidation(database);
		}
		if (behavior.lifecycle === "agent") unregister = registerOpenClawAgentDatabaseSyncResource({
			agentId,
			path: pathname,
			revoke: close,
			close
		});
		return {
			found: true,
			database
		};
	} catch (error) {
		close();
		recordOpenClawAgentDatabaseReadOpenFailure(error);
		throw error;
	}
}
//#endregion
export { withFreshOpenClawAgentDatabaseReadOnly as a, revalidateAgentDatabaseTerminalOpenAsync as c, readOpenClawAgentDatabaseSnapshot as i, openOpenClawAgentDatabaseReadOnly as n, assertAgentDatabaseTerminalOpenAllowed as o, readOpenClawAgentDatabase as r, revalidateAgentDatabaseTerminalOpen as s, hasOpenClawAgentReadOnlySchema as t };
