import { o as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-1BXD1G3l.mjs";
import { n as getPluginRegistryState } from "./runtime-state-Cd-Ga9cg.mjs";
//#region src/plugins/plugin-command-registry.ts
function resolveSelectedPluginCommandRegistry() {
	const state = getPluginRegistryState();
	return state?.registrationContext?.registry ?? getPluginRuntimeGatewayRequestScope()?.pluginRegistry ?? state?.activeRegistry ?? null;
}
function listRegisteredPluginCommands(registry) {
	return registry.commands.map((entry) => ({
		...entry.command,
		pluginId: entry.pluginId,
		pluginName: entry.pluginName,
		pluginRoot: entry.rootDir,
		trustedOwnerStatusExposure: entry.trustedOwnerStatusExposure
	}));
}
//#endregion
export { resolveSelectedPluginCommandRegistry as n, listRegisteredPluginCommands as t };
