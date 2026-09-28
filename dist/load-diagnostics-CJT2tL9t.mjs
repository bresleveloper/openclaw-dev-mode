import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/plugins/load-diagnostics.ts
const diagnostics = resolveGlobalSingleton(Symbol.for("openclaw.pluginLoadDiagnostics"), () => new AsyncLocalStorage());
/** Retain observed failures after temporary inspection registries have been released. */
function withPluginLoadDiagnostics(run) {
	const observed = [];
	return diagnostics.run(observed, () => run(observed));
}
function recordPluginLoadDiagnostic(diagnostic) {
	diagnostics.getStore()?.push(diagnostic);
}
//#endregion
export { withPluginLoadDiagnostics as n, recordPluginLoadDiagnostic as t };
