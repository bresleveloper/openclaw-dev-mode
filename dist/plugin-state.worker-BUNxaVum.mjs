import { n as captureOpenClawStateDatabaseReadAdmission } from "./openclaw-state-db-cache-BKCnj4of.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { c as deleteExpiredPluginStateEntries, h as lookupPluginStateEntry, l as deletePluginStateEntry, o as countLivePluginStateNamespaceEntries } from "./plugin-state-store.kernel-DUORZ5yM.mjs";
import { a as movePluginStateEntries, f as registerPluginStateEntry, n as consumePluginStateEntry, o as registerPluginStateEntryIfAbsent, r as deletePluginStateEntryIfEqual, t as clearPluginStateNamespace } from "./plugin-state-store.mutations-BHk3kTNw.mjs";
import { c as observePluginStateEntry, n as listPluginStateEntriesInKeyRange, o as registerPluginStateSequencedJournalEntryInDatabase, r as lookupPluginStateEntries, s as compareAndApplyPluginStateEntry, t as listPluginStateEntries } from "./plugin-state-store.reads-EtvC7OHQ.mjs";
import { n as withPluginStateDatabaseReadOnly, r as wrapPluginStateError } from "./plugin-state-store.database-VwspSyEa.mjs";
import { n as pluginStateWorkerOperations } from "./plugin-state-worker-contract-BGdodjwz.mjs";
import { t as capturePluginStateWorkerFailure } from "./plugin-state-worker-errors-Xq7iJ5DH.mjs";
import { a as selectRuntimeHealthClearKeys } from "./runtime-health-records-BfEYoX08.mjs";
import { r as requestSessionEntriesCurrentAdmission } from "./session-entry-current-admission.worker-DStXV6pd.mjs";
//#region src/plugin-state/runtime-health-store.kernel.ts
function findRuntimeHealthClearKeys(store, params) {
	return selectRuntimeHealthClearKeys(listPluginStateEntries(store, params), params.processId, params.selection);
}
function hasRuntimeHealthEntriesToClear(store, params) {
	return findRuntimeHealthClearKeys(store, params).length > 0;
}
/** The caller owns the transaction spanning current-row selection and deletion. */
function clearRuntimeHealthEntries(store, params) {
	for (const key of findRuntimeHealthClearKeys(store, params)) deletePluginStateEntry(store.db, {
		...params,
		key
	});
}
//#endregion
//#region src/plugin-state/plugin-state.worker.ts
function executePluginStateCommand(command, options, openDatabase, hasRetainedDatabase) {
	const description = pluginStateWorkerOperations[command.type];
	const admit = (stage) => requestSessionEntriesCurrentAdmission(command.input?.sessionEntryCurrentSources, {
		stage,
		facts: void 0
	});
	const failure = (error) => err(capturePluginStateWorkerFailure(wrapPluginStateError(error, description.operation, description.code, description.message, options.path)));
	if (command.type === "pluginState.lookup" || command.type === "pluginState.lookupMany" || command.type === "pluginState.entries" || command.type === "pluginState.entriesInKeyRange" || command.type === "pluginState.count") try {
		switch (command.type) {
			case "pluginState.lookup": return ok(withPluginStateDatabaseReadOnly("lookup", (store) => lookupPluginStateEntry(store, command.input), options));
			case "pluginState.lookupMany": {
				const rows = withPluginStateDatabaseReadOnly("lookup", (store) => lookupPluginStateEntries(store, command.input), options) ?? command.input.keys.map(() => ok(void 0));
				return ok(rows.map((row) => row.ok ? row : err(capturePluginStateWorkerFailure(row.error))));
			}
			case "pluginState.entriesInKeyRange": return ok(withPluginStateDatabaseReadOnly("entries", (store) => listPluginStateEntriesInKeyRange(store, command.input), options) ?? []);
			case "pluginState.entries": return ok(withPluginStateDatabaseReadOnly("entries", (store) => listPluginStateEntries(store, command.input), options) ?? []);
			case "pluginState.count": return ok(withPluginStateDatabaseReadOnly("count", ({ db }) => countLivePluginStateNamespaceEntries(db, {
				...command.input,
				now: Date.now()
			}), options) ?? 0);
		}
	} catch (error) {
		return failure(error);
	}
	if (command.type === "pluginState.clearRuntimeHealth") try {
		if (!withPluginStateDatabaseReadOnly("entries", (store) => hasRuntimeHealthEntriesToClear(store, command.input), options)) return ok(void 0);
	} catch (error) {
		return failure(error);
	}
	let database;
	try {
		database = openDatabase();
	} catch (error) {
		return err(capturePluginStateWorkerFailure(wrapPluginStateError(error, description.operation, hasRetainedDatabase ? description.code : "PLUGIN_STATE_OPEN_FAILED", hasRetainedDatabase ? description.message : "Failed to open the plugin state database.", options.path)));
	}
	try {
		return ok(runOpenClawStateWriteTransaction((store) => {
			admit("transaction");
			const result = (() => {
				switch (command.type) {
					case "pluginState.appendJournal": return registerPluginStateSequencedJournalEntryInDatabase(store, command.input);
					case "pluginState.observe": return observePluginStateEntry(store, command.input, captureOpenClawStateDatabaseReadAdmission(store.path).identity.key);
					case "pluginState.compareUpdate":
					case "pluginState.compareDelete": return compareAndApplyPluginStateEntry(store, command.input, captureOpenClawStateDatabaseReadAdmission(store.path).identity.key);
					case "pluginState.moveEntries": return movePluginStateEntries(store, command.input);
					case "pluginState.register": return registerPluginStateEntry(store, command.input);
					case "pluginState.registerIfAbsent": return registerPluginStateEntryIfAbsent(store, command.input);
					case "pluginState.deleteIfEqual": return deletePluginStateEntryIfEqual(store, command.input);
					case "pluginState.consume": return consumePluginStateEntry(store, command.input);
					case "pluginState.delete": return deletePluginStateEntry(store.db, command.input) > 0;
					case "pluginState.clear": return clearPluginStateNamespace(store.db, command.input);
					case "pluginState.clearRuntimeHealth": return clearRuntimeHealthEntries(store, command.input);
					case "pluginState.sweep": return deleteExpiredPluginStateEntries(store.db, Date.now());
					default: throw new Error("Plugin-state read command entered its write path");
				}
			})();
			admit("commit");
			return result;
		}, {
			...options,
			database
		}));
	} catch (error) {
		return failure(error);
	}
}
//#endregion
export { executePluginStateCommand };
