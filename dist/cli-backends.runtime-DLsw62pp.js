import { t as getActiveRuntimePluginRegistry } from "./active-runtime-registry-CaDgql0z.js";
//#region src/plugins/cli-backends.runtime.ts
/** Resolves CLI backends from the active runtime plugin registry. */
function resolveRuntimeCliBackends() {
	return (getActiveRuntimePluginRegistry()?.cliBackends ?? []).map((entry) => Object.assign({}, entry.backend, { pluginId: entry.pluginId }));
}
//#endregion
export { resolveRuntimeCliBackends as t };
