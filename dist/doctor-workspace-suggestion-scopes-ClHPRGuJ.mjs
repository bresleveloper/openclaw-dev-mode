import { _ as resolveDefaultAgentId, f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import "./agent-scope-DXrnO3F4.mjs";
//#region src/flows/doctor-workspace-suggestion-scopes.ts
/** Resolves every configured agent workspace while preserving invalid empty-roster failures. */
function resolveDoctorWorkspaceSuggestionScopes(cfg) {
	const listedAgentIds = listAgentIds(cfg);
	const agentIds = listedAgentIds.length > 0 ? listedAgentIds : [resolveDefaultAgentId(cfg)];
	const labelAgent = agentIds.length > 1;
	return agentIds.map((agentId) => ({
		agentId,
		workspaceDir: resolveAgentWorkspaceDir(cfg, agentId),
		labelAgent
	}));
}
//#endregion
export { resolveDoctorWorkspaceSuggestionScopes as t };
