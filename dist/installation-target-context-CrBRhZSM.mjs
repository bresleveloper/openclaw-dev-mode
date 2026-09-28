import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { E as resolveStateDir, p as resolveConfigPath } from "./paths-DehQwyE0.mjs";
import { n as resolveDefaultAgentWorkspaceDir } from "./workspace-default-hMJcajDi.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/infra/installation-target-context.ts
const installationTargetContext = resolveGlobalSingleton(Symbol.for("openclaw.installationTargetContext"), () => new AsyncLocalStorage());
const LOCAL_INSTALLATION_TARGET_UNSUPPORTED = "This runtime cannot target the diagnosed local installation. Use the saved prompt with a suggested external or manual handoff on this machine.";
function resolveInstallationTarget(env = process.env) {
	const stateDir = resolveStateDir(env);
	return Object.freeze({
		stateDir,
		configPath: resolveConfigPath(env, stateDir),
		defaultWorkspaceDir: resolveDefaultAgentWorkspaceDir(env)
	});
}
function getInstallationTarget() {
	return installationTargetContext.getStore();
}
function installationTargetEnv(target) {
	return target ? Object.freeze({
		OPENCLAW_STATE_DIR: target.stateDir,
		OPENCLAW_CONFIG_PATH: target.configPath,
		OPENCLAW_WORKSPACE_DIR: target.defaultWorkspaceDir
	}) : void 0;
}
function withInstallationTarget(target, run) {
	return installationTargetContext.run(target ? Object.freeze({ ...target }) : void 0, run);
}
//#endregion
export { withInstallationTarget as a, resolveInstallationTarget as i, getInstallationTarget as n, installationTargetEnv as r, LOCAL_INSTALLATION_TARGET_UNSUPPORTED as t };
