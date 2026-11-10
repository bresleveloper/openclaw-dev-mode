//#region src/plugin-state/plugin-state-operation-error.ts
/** Prepared state lost authority before the next external effect began. */
var PluginStateOperationInvalidatedError = class extends Error {
	constructor() {
		super("Plugin state operation receipt is no longer current");
		this.name = "PluginStateOperationInvalidatedError";
	}
};
//#endregion
export { PluginStateOperationInvalidatedError as t };
