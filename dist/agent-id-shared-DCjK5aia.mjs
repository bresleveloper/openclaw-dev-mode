import { O as listAgentIds, S as tryResolveLegacyCompatibilityAgentId, m as resolveDefaultAgentId, t as AgentSelectionRequiredError } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
//#region src/gateway/server-methods/agent-id-shared.ts
/**
* Shared agent-id resolver for request handlers that accept optional agent ids.
*/
function resolveAgentIdOrRespondError(params) {
	const knownAgents = listAgentIds(params.cfg);
	const requestedAgentId = params.normalize(params.rawAgentId) ?? "";
	let agentId;
	try {
		agentId = requestedAgentId || tryResolveLegacyCompatibilityAgentId(params.cfg) || resolveDefaultAgentId(params.cfg, {
			surface: "this Gateway request",
			hint: "Set agentId to one of the configured agents."
		});
	} catch (error) {
		if (!(error instanceof AgentSelectionRequiredError)) throw error;
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message));
		return null;
	}
	if (requestedAgentId && !knownAgents.includes(agentId)) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown agent id "${requestedAgentId}"`));
		return null;
	}
	return {
		cfg: params.cfg,
		agentId
	};
}
//#endregion
export { resolveAgentIdOrRespondError as t };
