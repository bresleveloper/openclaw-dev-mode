import { a as resolveAgentDir, f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import "./agent-scope-DXrnO3F4.mjs";
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
