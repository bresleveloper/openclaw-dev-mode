import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { r as hasOpenClawStateTablesBeyondStartupCheckpoint } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { i as isSqliteSchemaVersionError } from "./sqlite-user-version-ZJ4dPMsi.mjs";
import { c as resolveOpenClawStateSqlitePath, r as resolveDatabasePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { a as PluginStateStoreError } from "./openclaw-state-worker-error-Cmtk9G4_.mjs";
import { a as isTerminalSqliteIntegrityError } from "./sqlite-integrity-GtqcmwG3.mjs";
import { d as isOpenClawStateDatabaseOpen } from "./openclaw-state-db-cache-BKCnj4of.mjs";
import { f as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { l as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-D1jWDzK3.mjs";
import { s as createPluginStateError } from "./plugin-state-store.kernel-DUORZ5yM.mjs";
//#region src/plugin-state/plugin-state-store.database.ts
function wrapPluginStateError(error, operation, fallbackCode, message, pathname = resolveOpenClawStateSqlitePath(process.env)) {
	if (error instanceof PluginStateStoreError) return error;
	let publicMessage = message;
	if (fallbackCode === "PLUGIN_STATE_OPEN_FAILED") {
		if (isSqliteSchemaVersionError(error)) publicMessage += "\nThe state database uses a newer schema. Run an OpenClaw build that supports it.";
		else if (error instanceof Error && isTerminalSqliteIntegrityError(error)) publicMessage += "\nDatabase integrity verification failed. Restore or repair the state database, then run openclaw doctor --fix.";
	}
	return createPluginStateError({
		code: fallbackCode,
		operation,
		message: publicMessage,
		path: pathname,
		cause: error
	});
}
function openPluginStateDatabase(operation = "open", options = {}) {
	const env = options.env ?? process.env;
	const pathname = resolveOpenClawStateSqlitePath(env);
	try {
		return openOpenClawStateDatabase(options);
	} catch (error) {
		throw wrapPluginStateError(error, operation, "PLUGIN_STATE_OPEN_FAILED", "Failed to open the plugin state database.", pathname);
	}
}
function isMissingPluginStateTableError(error) {
	return error instanceof Error && hasErrnoCode(error, "ERR_SQLITE_ERROR") && error.message === "no such table: plugin_state_entries";
}
/** Read plugin state without joining the shared writable database lifecycle. */
function withPluginStateDatabaseReadOnly(operationName, operation, options = {}) {
	const pathname = resolveDatabasePath(options);
	let operationStarted = false;
	try {
		return withExistingOpenClawStateDatabaseReadOnly(({ db, path }) => {
			operationStarted = true;
			try {
				return operation({
					db,
					path
				});
			} catch (error) {
				if (isMissingPluginStateTableError(error)) {
					if (!hasOpenClawStateTablesBeyondStartupCheckpoint(db)) return;
				}
				throw error;
			}
		}, options);
	} catch (error) {
		if (!operationStarted) throw wrapPluginStateError(error, operationName, "PLUGIN_STATE_OPEN_FAILED", "Failed to open the plugin state database.", pathname);
		throw error;
	}
}
function runWriteTransaction(operation, write, options = {}) {
	if (!isOpenClawStateDatabaseOpen(resolveOpenClawStateSqlitePath(options.env ?? process.env))) openPluginStateDatabase(operation, options);
	return runOpenClawStateWriteTransaction(write, options, { operationLabel: `pluginState.${operation}` });
}
//#endregion
export { withPluginStateDatabaseReadOnly as n, wrapPluginStateError as r, runWriteTransaction as t };
