import { r as normalizeAgentIdStrict } from "./agent-id-D1-Q6vR4.mjs";
import { T as tryResolveLegacyCompatibilityAgentId, g as resolveDefaultAgentId, t as AgentSelectionRequiredError } from "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
//#region src/gateway/server-methods/agent-id-shared.ts
function resolveConfiguredAgentIdOrRespondError(rawAgentId, cfg, respond) {
	const normalized = normalizeAgentIdStrict(rawAgentId);
	if (normalized.ok && listAgentIds(cfg).includes(normalized.value)) return normalized.value;
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `agent "${rawAgentId}" not found`));
	return null;
}
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
export { resolveConfiguredAgentIdOrRespondError as n, resolveAgentIdOrRespondError as t };
