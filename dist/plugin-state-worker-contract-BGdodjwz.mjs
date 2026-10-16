//#region src/plugin-state/plugin-state-worker-contract.ts
const pluginStateWorkerOperations = {
	"pluginState.appendJournal": {
		operation: "register",
		code: "PLUGIN_STATE_WRITE_FAILED",
		message: "Failed to register sequenced plugin state journal entry."
	},
	"pluginState.entriesInKeyRange": {
		operation: "entries",
		code: "PLUGIN_STATE_READ_FAILED",
		message: "Failed to list plugin state entries by key range."
	},
	"pluginState.moveEntries": {
		operation: "register",
		code: "PLUGIN_STATE_WRITE_FAILED",
		message: "Failed to move plugin state entries."
	},
	"pluginState.observe": {
		operation: "lookup",
		code: "PLUGIN_STATE_READ_FAILED",
		message: "Failed to observe plugin state entry."
	},
	"pluginState.compareUpdate": {
		operation: "register",
		code: "PLUGIN_STATE_WRITE_FAILED",
		message: "Failed to update plugin state entry."
	},
	"pluginState.compareDelete": {
		operation: "delete",
		code: "PLUGIN_STATE_WRITE_FAILED",
		message: "Failed to conditionally delete plugin state entry."
	},
	"pluginState.register": {
		operation: "register",
		code: "PLUGIN_STATE_WRITE_FAILED",
		message: "Failed to register plugin state entry."
	},
	"pluginState.registerIfAbsent": {
		operation: "register",
		code: "PLUGIN_STATE_WRITE_FAILED",
		message: "Failed to register plugin state entry."
	},
	"pluginState.deleteIfEqual": {
		operation: "delete",
		code: "PLUGIN_STATE_WRITE_FAILED",
		message: "Failed to conditionally delete plugin state entry."
	},
	"pluginState.lookup": {
		operation: "lookup",
		code: "PLUGIN_STATE_READ_FAILED",
		message: "Failed to read plugin state entry."
	},
	"pluginState.lookupMany": {
		operation: "lookup",
		code: "PLUGIN_STATE_READ_FAILED",
		message: "Failed to read plugin state entries."
	},
	"pluginState.consume": {
		operation: "consume",
		code: "PLUGIN_STATE_READ_FAILED",
		message: "Failed to consume plugin state entry."
	},
	"pluginState.delete": {
		operation: "delete",
		code: "PLUGIN_STATE_WRITE_FAILED",
		message: "Failed to delete plugin state entry."
	},
	"pluginState.entries": {
		operation: "entries",
		code: "PLUGIN_STATE_READ_FAILED",
		message: "Failed to list plugin state entries."
	},
	"pluginState.count": {
		operation: "count",
		code: "PLUGIN_STATE_READ_FAILED",
		message: "Failed to count plugin state entries."
	},
	"pluginState.clear": {
		operation: "clear",
		code: "PLUGIN_STATE_WRITE_FAILED",
		message: "Failed to clear plugin state namespace."
	},
	"pluginState.clearRuntimeHealth": {
		operation: "clear",
		code: "PLUGIN_STATE_WRITE_FAILED",
		message: "Failed to clear runtime health records."
	},
	"pluginState.sweep": {
		operation: "sweep",
		code: "PLUGIN_STATE_WRITE_FAILED",
		message: "Failed to sweep expired plugin state entries."
	}
};
/** Selects the plugin-state branch of the shared actor's typed command union. */
function isPluginStateWorkerCommand(command) {
	return Object.hasOwn(pluginStateWorkerOperations, command.type);
}
//#endregion
export { pluginStateWorkerOperations as n, isPluginStateWorkerCommand as t };
