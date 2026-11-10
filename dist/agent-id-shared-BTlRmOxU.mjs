import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as normalizeAgentIdStrict } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-CSDERtm3.mjs";
import { E as tryResolveLegacyCompatibilityAgentId, _ as resolveDefaultAgentId, t as AgentSelectionRequiredError } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
//#region src/gateway/server-methods/agent-id-shared.ts
function resolveConfiguredAgentIdOrRespondError(rawAgentId, cfg, respond) {
	const normalized = normalizeAgentIdStrict(rawAgentId);
	if (normalized.ok && listAgentIds(cfg).includes(normalized.value)) return normalized.value;
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `agent "${rawAgentId}" not found`));
	return null;
}
function resolveAgentIdOrRespondError(params) {
	const knownAgents = listAgentIds(params.cfg);
	const requestedAgentId = normalizeOptionalString(params.rawAgentId) ?? "";
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
export { resolveConfiguredAgentIdOrRespondError as n, resolveAgentIdOrRespondError as t };
