import { d as readCodexPluginConfig } from "./config-parsing-BQq-CHTF.mjs";
import { n as isCodexAppServerProxyLaunch } from "./launch-args-DbFCehO7.mjs";
import { i as resolveCodexAppServerHomeScope } from "./config-options-HG_Rr3W_.mjs";
import "./config-0Gxk3_eq.mjs";
import { n as resolveCodexAppServerRuntimeOptions } from "./config-runtime-cUYrqu_a.mjs";
//#region extensions/codex/src/app-server/bounded-turn-isolation.ts
function resolveCodexBoundedTurnIsolation(options) {
	const pluginConfig = readCodexPluginConfig(options.pluginConfig);
	const homeScope = resolveCodexAppServerHomeScope({ appServer: pluginConfig.appServer });
	const { start } = resolveCodexAppServerRuntimeOptions({ pluginConfig: options.pluginConfig });
	return start.transport === "stdio" && (homeScope === "agent" || options.requireIsolatedAuth === true) && !isCodexAppServerProxyLaunch(start.args) ? "private-stdio" : "configured-transport";
}
//#endregion
export { resolveCodexBoundedTurnIsolation as t };
