import { r as isBundledManifestOwner } from "./manifest-owner-policy-D9DuiaNx.mjs";
//#region src/gateway/worker-environments/node-bootstrap-plugins.ts
/** Selects node runtime packages from the Gateway's already validated plugin generation. */
function resolveNodeBootstrapPlugins(params) {
	if (params.executionMode !== "remote-exec") return [];
	const availablePlugins = new Map(params.registry.plugins.filter((plugin) => plugin.enabled && plugin.status === "loaded").map((plugin) => [plugin.id, plugin]));
	const requiredCommands = new Set(params.registry.agentHarnesses.flatMap(({ pluginId, harness }) => availablePlugins.has(pluginId) && harness.cloudPlacement?.mode === params.executionMode ? harness.cloudPlacement?.devicePlacement?.requiredNodeCommands ?? [] : []));
	const pluginIds = /* @__PURE__ */ new Set();
	for (const command of requiredCommands) {
		const owner = params.registry.nodeHostCommands.find((entry) => entry.command.command === command);
		if (!owner || !availablePlugins.has(owner.pluginId)) throw new Error(`Cloud node bootstrap requires an available plugin for node command ${command}`);
		pluginIds.add(owner.pluginId);
	}
	return [...pluginIds].toSorted().map((id) => {
		const plugin = params.metadata.byPluginId.get(id);
		const loaded = availablePlugins.get(id);
		if (!plugin || !loaded || !isBundledManifestOwner(plugin) && plugin.trustedOfficialInstall !== true || !plugin.rootDir || !plugin.packageName || !plugin.packageVersion || plugin.rootDir !== loaded.rootDir || plugin.packageName !== loaded.packageName || plugin.packageVersion !== loaded.packageVersion) throw new Error(`Cloud node bootstrap requires the loaded trusted package for plugin ${id}; repair its installation and restart the Gateway`);
		return {
			id,
			root: plugin.rootDir
		};
	});
}
//#endregion
export { resolveNodeBootstrapPlugins };
