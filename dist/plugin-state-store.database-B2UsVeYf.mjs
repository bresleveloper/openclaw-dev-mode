import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { c as resolveOpenClawStateSqlitePath, r as resolveDatabasePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { i as sqlPublicationAnchor } from "./sql-connection-DmQzXTVz.mjs";
import { s as stageSqliteTransactionState } from "./sqlite-post-commit-22SfWsLt.mjs";
import { s as isTerminalSqliteIntegrityError } from "./sqlite-integrity-06TCB-az.mjs";
import { p as isOpenClawStateDatabaseOpen } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { r as hasOpenClawStateTablesBeyondStartupCheckpoint } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { i as isSqliteSchemaVersionError } from "./sqlite-user-version-Q7gNRxhK.mjs";
import { n as createPluginStateError, t as PluginStateStoreError } from "./plugin-state-error-Wxkh7e3f.mjs";
import { a as readTrackedStateDatabaseIdentity } from "./openclaw-state-db-handle-B6qa1Bui.mjs";
import { u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { i as openOpenClawStateDatabase, u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { n as beginPluginStatePublication } from "./plugin-state-publication-CI0IKkN0.mjs";
import "./plugin-state-store.types-CLUTlkgE.mjs";
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
	return error instanceof Error && (hasErrnoCode(error, "ERR_SQLITE_ERROR") && error.message === "no such table: plugin_state_entries" || hasErrnoCode(error, "42P01") && error.message === "relation \"plugin_state_entries\" does not exist");
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
	return runOpenClawStateWriteTransaction((store) => {
		const identity = readTrackedStateDatabaseIdentity(sqlPublicationAnchor(store.db))?.key;
		if (!identity) throw new Error("Plugin state writer has no admitted source");
		const publication = beginPluginStatePublication(() => identity);
		stageSqliteTransactionState(sqlPublicationAnchor(store.db), {
			stage() {},
			commit() {},
			prepareObservers: () => publication.finish("completed"),
			rollback: () => publication.finish("completed"),
			invalidate: () => publication.finish("unknown")
		});
		return write(store);
	}, options, { operationLabel: `pluginState.${operation}` });
}
//#endregion
export { wrapPluginStateError as i, runWriteTransaction as n, withPluginStateDatabaseReadOnly as r, isMissingPluginStateTableError as t };
