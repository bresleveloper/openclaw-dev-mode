import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";
//#region extensions/mattermost/src/runtime.ts
const { setRuntime: setMattermostRuntime, getRuntime: getMattermostRuntime, tryGetRuntime: getOptionalMattermostRuntime } = createPluginRuntimeStore({
	pluginId: "mattermost",
	errorMessage: "Mattermost runtime not initialized"
});
//#endregion
export { getOptionalMattermostRuntime as n, setMattermostRuntime as r, getMattermostRuntime as t };
