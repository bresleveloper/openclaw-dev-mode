import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-CSDERtm3.mjs";
import { _ as resolveDefaultAgentId, f as resolveAgentWorkspaceDir, t as AgentSelectionRequiredError } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { t as invalidSessionRequest } from "./session-request-error-qLiiFHUD.mjs";
//#region src/gateway/server-methods/skills-workspace-handler.ts
function resolveSkillsAgentWorkspace(params, context) {
	const cfg = context.getRuntimeConfig();
	const agentIdRaw = normalizeOptionalString(params.agentId);
	let agentId;
	try {
		agentId = agentIdRaw ? normalizeAgentId(agentIdRaw) : resolveDefaultAgentId(cfg, {
			surface: "skills workspace",
			hint: "Pass agentId to select a configured agent."
		});
	} catch (error) {
		if (!(error instanceof AgentSelectionRequiredError)) throw error;
		return invalidSessionRequest(error.message);
	}
	if (agentIdRaw && !listAgentIds(cfg).includes(agentId)) return invalidSessionRequest(`unknown agent id "${agentIdRaw}"`);
	return {
		ok: true,
		cfg,
		agentId,
		workspaceDir: resolveAgentWorkspaceDir(cfg, agentId)
	};
}
//#endregion
export { resolveSkillsAgentWorkspace as t };
