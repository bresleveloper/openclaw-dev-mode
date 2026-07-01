import "./agent-scope-CDZXADgT.js";
import { c as resolveDefaultAgentId, o as resolveAgentWorkspaceDir } from "./agent-scope-config-C3ijpoNo.js";
import { r as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-BcIVzXmF.js";
import { a as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-Dp5LgxH6.js";
import { i as getRuntimeConfig } from "./io-BJfjPmGW.js";
import "./config-A41fTHlt.js";
//#region src/agents/model-discovery-context.ts
/**
* Shared context resolvers for model discovery.
* Keeps callers from reaching into runtime config or plugin metadata snapshot
* plumbing directly.
*/
/** Resolve the workspace directory model discovery should use for agent scope. */
function resolveModelWorkspaceDir(cfg, explicitWorkspaceDir) {
	if (explicitWorkspaceDir !== void 0 || !cfg) return explicitWorkspaceDir;
	return resolveAgentWorkspaceDir(cfg, resolveDefaultAgentId(cfg));
}
/**
* Resolve the plugin metadata snapshot for model discovery.
*
* Explicit snapshots win for tests and prepared runtimes. Otherwise we prefer
* the current process snapshot, then fall back to resolving from config/env.
*/
function resolveModelPluginMetadataSnapshot(params) {
	if (params.pluginMetadataSnapshot) return params.pluginMetadataSnapshot;
	const env = params.env ?? process.env;
	try {
		const config = params.config ?? (params.useRuntimeConfig ? getRuntimeConfig() : void 0);
		return getCurrentPluginMetadataSnapshot({
			allowWorkspaceScopedSnapshot: true,
			env,
			...config ? { config } : {},
			...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
		}) ?? resolvePluginMetadataSnapshot({
			config: config ?? {},
			env,
			...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {},
			...params.allowWorkspaceScopedCurrent !== void 0 ? { allowWorkspaceScopedCurrent: params.allowWorkspaceScopedCurrent } : {}
		});
	} catch {
		return;
	}
}
//#endregion
export { resolveModelWorkspaceDir as n, resolveModelPluginMetadataSnapshot as t };
