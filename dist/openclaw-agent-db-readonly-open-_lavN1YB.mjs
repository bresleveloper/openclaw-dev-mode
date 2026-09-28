import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { t as clearNodeSqliteKyselyCacheForDatabase } from "./kysely-sync-cache-state-CFxglP-_.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-BO6jRFcG.mjs";
import { d as sqlitePrimaryResultCode } from "./sqlite-error-diagnostics-C8UyxYRx.mjs";
import { t as readExistingAgentSchemaMeta } from "./openclaw-agent-db-metadata-CUXsFwAM.mjs";
import { o as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-dESpOAuZ.mjs";
import { a as resolveOpenClawAgentSqlitePath, r as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-C2YxM4Tj.mjs";
import { a as registerOpenClawAgentDatabaseIdentity, o as classifyOpenClawAgentDatabaseReadError } from "./openclaw-agent-db-identity-DLTnzTd_.mjs";
import { n as assertExistingAgentSchemaOwner, r as assertSupportedAgentSchemaVersion, t as assertCanonicalAgentPersistenceVersion } from "./openclaw-agent-db-schema-read-B7E3mJp3.mjs";
import fs from "node:fs";
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
	const userVersion = assertSupportedAgentSchemaVersion(database.db, database.path);
	assertCanonicalAgentPersistenceVersion(database.db, database.path, userVersion);
	const schemaMeta = readExistingAgentSchemaMeta(database.db);
	if (!schemaMeta) return false;
	assertExistingAgentSchemaOwner(schemaMeta, database.agentId, database.path);
	return true;
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
	if (!fs.existsSync(pathname)) return {
		found: false,
		reason: "database-missing"
	};
	const db = openNodeSqliteDatabase(pathname, {
		readOnly: true,
		timeout: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
		...behavior.allowExtension ? { allowExtension: true } : {}
	});
	let closed = false;
	const close = () => {
		if (closed) return;
		clearNodeSqliteKyselyCacheForDatabase(db);
		if (db.isOpen) db.close();
		closed = true;
	};
	try {
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
		return {
			found: true,
			database
		};
	} catch (error) {
		close();
		throw error;
	}
}
//#endregion
export { withFreshOpenClawAgentDatabaseReadOnly as i, openOpenClawAgentDatabaseReadOnly as n, readOpenClawAgentDatabase as r, hasOpenClawAgentReadOnlySchema as t };
