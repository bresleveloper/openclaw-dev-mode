import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { _ as resolveConfigDir } from "./utils-aKqR_F_U.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import os from "node:os";
//#region src/plugins/install-root-context.ts
const pluginInstallRootContext = resolveGlobalSingleton(Symbol.for("openclaw.pluginInstallRootContext"), () => new AsyncLocalStorage());
/** Resolve the ordinary operator-owned plugin roots before a run redirects state. */
function resolvePluginInstallRoots(env = process.env, homedir = os.homedir) {
	const configDir = resolveConfigDir(env, homedir);
	return Object.freeze({
		extensionsDir: path.join(configDir, "extensions"),
		gitDir: path.join(configDir, "git"),
		npmDir: path.join(configDir, "npm"),
		stateDir: resolveStateDir(env, homedir)
	});
}
/** Return run-pinned install roots, or resolve the caller's ordinary roots. */
function resolveActivePluginInstallRoots(env = process.env, homedir = os.homedir) {
	return pluginInstallRootContext.getStore() ?? resolvePluginInstallRoots(env, homedir);
}
/** Artifact paths do not need the state directory's legacy-location filesystem probes. */
function resolveActivePluginInstallDir(kind, env = process.env, homedir = os.homedir) {
	const roots = pluginInstallRootContext.getStore();
	return roots ? roots[`${kind}Dir`] : path.join(resolveConfigDir(env, homedir), kind);
}
/** Return whether the current run pinned operator-owned plugin install roots. */
function hasActivePluginInstallRoots() {
	return pluginInstallRootContext.getStore() !== void 0;
}
/**
* Keep plugin discovery on one operator-owned install generation while a run
* redirects OPENCLAW_STATE_DIR for ephemeral sessions and runtime state.
*/
function withPluginInstallRoots(roots, run) {
	return pluginInstallRootContext.run(roots, run);
}
//#endregion
export { withPluginInstallRoots as a, resolvePluginInstallRoots as i, resolveActivePluginInstallDir as n, resolveActivePluginInstallRoots as r, hasActivePluginInstallRoots as t };
