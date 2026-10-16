import { n as readGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { r as enableNodeSqliteKyselyStatementCache } from "./kysely-sync-cache-state-eUau8Jaa.mjs";
import { o as runSqliteReadOperationSync, t as admitSqliteSchema } from "./sqlite-schema-facts-CG0Tk84j.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-XIcwmOrl.mjs";
import { d as sqlitePrimaryResultCode } from "./sqlite-error-diagnostics-DCvjvszg.mjs";
import { t as readExistingAgentSchemaMeta } from "./openclaw-agent-db-metadata-r_rNkHrE.mjs";
import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-Cm9fKF2T.mjs";
import { s as isDeletedAgentDatabasePath } from "./agent-database-readers-DAuOtcuZ.mjs";
import { C as classifyOpenClawAgentDatabaseReadError, T as recordOpenClawAgentDatabaseReadOpenFailure, y as registerOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { o as readOpenClawDatabaseQuarantineFailure } from "./openclaw-quarantine-store-BMO9c1KL.mjs";
import { c as resolveOpenClawAgentSqlitePath, i as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { n as assertExistingAgentSchemaOwner, r as assertSupportedAgentSchemaVersion, t as assertCanonicalAgentPersistenceVersion } from "./openclaw-agent-db-schema-read-8tLHX1g8.mjs";
import fs from "node:fs";
//#region src/state/openclaw-agent-db-terminal.ts
/** Read the existing damage latch without acquiring the writable database lifecycle. */
function assertAgentDatabaseTerminalOpenAllowed(pathname) {
	const failure = readGlobalSingleton(Symbol.for("openclaw.agentDatabaseLifecycle"))?.terminal.get(pathname);
	if (failure) throw failure;
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
/** Recheck committed admission facts before using an existing read-only connection. */
function hasOpenClawAgentReadOnlySchema(database) {
	return runSqliteReadOperationSync(database.db, () => {
		const userVersion = assertSupportedAgentSchemaVersion(database.db, database.path);
		assertCanonicalAgentPersistenceVersion(database.db, database.path, userVersion);
		const schemaMeta = readExistingAgentSchemaMeta(database.db);
		if (!schemaMeta) return false;
		assertExistingAgentSchemaOwner(schemaMeta, database.agentId, database.path);
		return true;
	});
}
/** Fresh-only callers do not need the writable runtime's process-held connection cache. */
function withFreshOpenClawAgentDatabaseReadOnly(operation, options, behavior = {}) {
	const opened = openOpenClawAgentDatabaseReadOnly(options, behavior);
	if (!opened.found) return opened;
	try {
		return readOpenClawAgentDatabase(opened.database, operation);
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
	assertAgentDatabaseTerminalOpenAllowed(pathname);
	const persistedQuarantine = readOpenClawDatabaseQuarantineFailure("agent", pathname, { env: options.env });
	if (persistedQuarantine) {
		recordOpenClawAgentDatabaseReadOpenFailure(persistedQuarantine);
		throw persistedQuarantine;
	}
	let db;
	try {
		db = openNodeSqliteDatabase(pathname, {
			readOnly: true,
			timeout: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
			...behavior.allowExtension ? { allowExtension: true } : {}
		});
	} catch (error) {
		recordOpenClawAgentDatabaseReadOpenFailure(error);
		throw error;
	}
	let closed = false;
	const close = () => {
		if (closed) return;
		if (db.isOpen) db.close();
		closed = true;
	};
	try {
		enableNodeSqliteKyselyStatementCache(db);
		registerOpenClawAgentDatabaseIdentity(db);
		const database = {
			agentId,
			db,
			path: pathname,
			close
		};
		if (!hasOpenClawAgentReadOnlySchema(database)) {
			close();
			return {
				found: false,
				reason: "schema-missing"
			};
		}
		admitSqliteSchema(db);
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
export { assertAgentDatabaseTerminalOpenAllowed as a, withFreshOpenClawAgentDatabaseReadOnly as i, openOpenClawAgentDatabaseReadOnly as n, readOpenClawAgentDatabase as r, hasOpenClawAgentReadOnlySchema as t };
