import { n as isCodexAppServerProxyLaunch } from "./launch-args-DWBRnfHh.mjs";
import "./config-B-xRmWRi.mjs";
import { n as resolveCodexAppServerRuntimeOptions } from "./config-runtime-DUl8J_Uu.mjs";
// extensions/codex/src/app-server/bounded-turn-isolation.ts
function resolveCodexBoundedTurnIsolation(options) {
	const { start } = resolveCodexAppServerRuntimeOptions({ pluginConfig: options.pluginConfig });
	return start.transport === "stdio" && (start.homeScope === "agent" || options.requireIsolatedAuth === true) && !isCodexAppServerProxyLaunch(start.args) ? "private-stdio" : "configured-transport";
}
export { resolveCodexBoundedTurnIsolation as t };
