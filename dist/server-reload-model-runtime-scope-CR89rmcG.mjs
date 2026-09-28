import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import "./session-key-CBvmC8zz.mjs";
import { g as refreshPreparedModelRuntimeSnapshots } from "./prepared-model-runtime-DwKkPNoF.mjs";
//#region src/gateway/server-reload-model-runtime-scope.ts
/** Returns affected agent ids when every meaningful reload path is agent-entry-local. */
function resolveReloadAgentIds(changedPaths) {
	if (changedPaths.length === 0) return;
	const agentIds = /* @__PURE__ */ new Set();
	for (const path of changedPaths) {
		if (path === "meta" || path.startsWith("meta.")) continue;
		const match = /^agents\.entries\.([^.]+)(?:\.|$)/.exec(path);
		if (!match?.[1]) return;
		agentIds.add(normalizeAgentId(match[1]));
	}
	return agentIds.size > 0 ? agentIds : void 0;
}
function refreshModelRuntimeAfterHotReload(params) {
	return refreshPreparedModelRuntimeSnapshots(params.config, {
		catalogMode: "static",
		joinSupersedingPublication: true,
		...params.isPublicationCurrent ? { isPublicationCurrent: params.isPublicationCurrent } : {},
		allowGatewaySubagentBinding: true,
		...params.agentIds ? { agentIds: params.agentIds } : {},
		...params.pluginMetadataSnapshot ? { pluginMetadataSnapshot: params.pluginMetadataSnapshot } : {}
	});
}
//#endregion
export { resolveReloadAgentIds as n, refreshModelRuntimeAfterHotReload as t };
