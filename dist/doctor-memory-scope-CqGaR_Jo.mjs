import { a as resolveAgentDir, d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import "./agent-scope-CG17uXFn.mjs";
//#region src/commands/doctor-memory-scope.ts
function resolveMemoryDoctorAgentScopes(cfg) {
	return listAgentIds(cfg).map((agentId) => ({
		agentId,
		agentDir: resolveAgentDir(cfg, agentId),
		workspaceDir: resolveAgentWorkspaceDir(cfg, agentId)
	}));
}
function formatMemoryDoctorAgentMessage(agentId, labelAgent, message) {
	return `${labelAgent ? `Agent "${agentId}": ` : ""}${message}`;
}
//#endregion
export { resolveMemoryDoctorAgentScopes as n, formatMemoryDoctorAgentMessage as t };
