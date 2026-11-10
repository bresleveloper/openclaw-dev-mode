import { a as resolveCodexAppServerStartOptionsForAgent } from "./.setup/config-options-l737cwJB.mjs";
import { d as resolveManagedCodexClientVersion, g as CODEX_APP_SERVER_VERSION } from "./.setup/managed-binary-CN7ii1MZ.mjs";
import "./.setup/config-DEC5R1wk.mjs";
import { n as resolveCodexAppServerRuntimeOptions } from "./.setup/config-runtime-Be4ZqerX.mjs";
//#region extensions/codex/client-version-api.ts
/**
* Codex client version for ChatGPT model discovery: the version of the binary
* managed turns run, so listed models match what the backend accepts for them.
* Custom commands and remote app-servers keep reporting the bundled pin.
*/
async function resolveCodexClientVersion(params) {
	const { start } = resolveCodexAppServerRuntimeOptions({
		pluginConfig: params.config?.plugins?.entries?.codex?.config,
		env: params.env
	});
	if (start.transport !== "stdio" || start.commandSource !== "managed") return CODEX_APP_SERVER_VERSION;
	const agentStart = params.agentDir ? resolveCodexAppServerStartOptionsForAgent({
		startOptions: start,
		agentDir: params.agentDir,
		env: params.env
	}) : start;
	return resolveManagedCodexClientVersion(agentStart.managedCommandOrder ?? "package-first");
}
//#endregion
export { resolveCodexClientVersion };
