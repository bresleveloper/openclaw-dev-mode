import { d as readCodexPluginConfig } from "./config-parsing-DsWSCPHO.mjs";
import { n as isCodexAppServerProxyLaunch } from "./launch-args-DbFCehO7.mjs";
import { i as resolveCodexAppServerHomeScope } from "./config-options-l737cwJB.mjs";
import "./config-DEC5R1wk.mjs";
import { n as resolveCodexAppServerRuntimeOptions } from "./config-runtime-Be4ZqerX.mjs";
//#region extensions/codex/src/app-server/bounded-turn-isolation.ts
function resolveCodexBoundedTurnIsolation(options) {
	const pluginConfig = readCodexPluginConfig(options.pluginConfig);
	const homeScope = resolveCodexAppServerHomeScope({ appServer: pluginConfig.appServer });
	const { start } = resolveCodexAppServerRuntimeOptions({ pluginConfig: options.pluginConfig });
	return start.transport === "stdio" && (homeScope === "agent" || options.requireIsolatedAuth === true) && !isCodexAppServerProxyLaunch(start.args) ? "private-stdio" : "configured-transport";
}
//#endregion
export { resolveCodexBoundedTurnIsolation as t };
