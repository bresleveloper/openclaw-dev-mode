//#region extensions/msteams/src/runtime.ts
const { setRuntime: setMSTeamsRuntime, getRuntime: getMSTeamsRuntime, tryGetRuntime: getOptionalMSTeamsRuntime } = (0, require("openclaw/plugin-sdk/runtime-store").createPluginRuntimeStore)({
	pluginId: "msteams",
	errorMessage: "MSTeams runtime not initialized"
});
//#endregion
Object.defineProperty(exports, "getMSTeamsRuntime", {
	enumerable: true,
	get: function() {
		return getMSTeamsRuntime;
	}
});
Object.defineProperty(exports, "getOptionalMSTeamsRuntime", {
	enumerable: true,
	get: function() {
		return getOptionalMSTeamsRuntime;
	}
});
Object.defineProperty(exports, "setMSTeamsRuntime", {
	enumerable: true,
	get: function() {
		return setMSTeamsRuntime;
	}
});
