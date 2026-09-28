import { b as tryResolveAmbientOwnerAgentId, l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
//#region src/plugins/control-plane-workspace.ts
/** Resolves the optional agent workspace enrichment used by plugin control-plane inventory. */
const PLUGIN_WORKSPACE_SCOPE_OMITTED_DIAGNOSTIC_CODE = "workspace-scope-omitted";
/**
* Resolve workspace discovery without inventing ownership for an explicit roster.
* Shared roots remain safe to inspect when no system owner can be proven.
*/
function resolvePluginControlPlaneWorkspace(params) {
	if (params.workspaceDir !== void 0) return {
		workspaceDir: params.workspaceDir,
		workspaceScope: "selected"
	};
	const agentId = tryResolveAmbientOwnerAgentId(params.config);
	const workspaceDir = agentId ? resolveAgentWorkspaceDir(params.config, agentId, params.env) : void 0;
	if (workspaceDir) return {
		agentId,
		workspaceDir,
		workspaceScope: "selected"
	};
	return {
		workspaceScope: "omitted",
		diagnostic: {
			level: "warn",
			code: PLUGIN_WORKSPACE_SCOPE_OMITTED_DIAGNOSTIC_CODE,
			message: "Workspace plugin discovery was skipped because multiple explicit agents are configured without agents.defaults.systemAgent.agentId. This partial result includes bundled, managed, and global plugins only; set agents.defaults.systemAgent.agentId to include that owner's workspace plugins."
		}
	};
}
function appendPluginControlPlaneWorkspaceDiagnostic(diagnostics, resolution) {
	const diagnostic = resolution.diagnostic;
	if (!diagnostic || diagnostics.some((entry) => entry.code === PLUGIN_WORKSPACE_SCOPE_OMITTED_DIAGNOSTIC_CODE)) return [...diagnostics];
	return [...diagnostics, diagnostic];
}
//#endregion
export { resolvePluginControlPlaneWorkspace as n, appendPluginControlPlaneWorkspaceDiagnostic as t };
