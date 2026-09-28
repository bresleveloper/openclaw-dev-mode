import { r as getPluginRegistryState } from "./runtime-state-C5tDvNBc.mjs";
import { i as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
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
