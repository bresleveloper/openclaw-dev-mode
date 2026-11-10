import "./home-dir-CtsdYvX3.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { r as resolveActivePluginInstallRoots, t as hasActivePluginInstallRoots } from "./install-root-context-cuIncTSC.mjs";
//#region src/plugin-sdk/state-paths.ts
/** Keep shared plugin resources on their operator root when runtime state is redirected. */
function resolveManagedResourceStateDir() {
	return hasActivePluginInstallRoots() ? resolveActivePluginInstallRoots().stateDir : resolveStateDir();
}
//#endregion
export { resolveManagedResourceStateDir as t };
