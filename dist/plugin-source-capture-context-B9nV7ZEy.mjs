import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { a as runWithPluginExecutionFrame, n as createPluginExecutionFrame, r as getPluginExecutionFrame } from "./plugin-instance-invocation-CH4zOUb4.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/plugins/plugin-source-capture-context.ts
function getPluginSourceCaptureStorage() {
	return getPluginExecutionFrame()?.sourceCaptureStorage;
}
function resolvePluginSourceCaptureStorage(stateDir, placement) {
	const inherited = stateDir === void 0 ? getPluginSourceCaptureStorage() : void 0;
	return Object.freeze({
		stateDir: path.resolve(stateDir ?? inherited?.stateDir ?? resolveStateDir()),
		placement: placement ?? inherited?.placement ?? "state"
	});
}
/** Capture storage outlives an inspection's private database and never redirects its writers. */
function withPluginSourceCaptureStorage(storage, run) {
	const current = getPluginExecutionFrame();
	return runWithPluginExecutionFrame(createPluginExecutionFrame({
		...current,
		sourceCaptureStorage: resolvePluginSourceCaptureStorage(storage.stateDir, storage.placement)
	}, current), run);
}
const runInPluginSourceCaptureContext = resolveGlobalSingleton(Symbol.for("openclaw.pluginSourceCaptureContext"), () => AsyncLocalStorage.snapshot());
/** Executable CLI ownership follows profile selection to each acquired capture root. */
const pluginSourceCaptureMaintenance = resolveGlobalSingleton(Symbol.for("openclaw.pluginSourceCaptureMaintenance"), () => new AsyncLocalStorage());
//#endregion
export { withPluginSourceCaptureStorage as a, runInPluginSourceCaptureContext as i, pluginSourceCaptureMaintenance as n, resolvePluginSourceCaptureStorage as r, getPluginSourceCaptureStorage as t };
