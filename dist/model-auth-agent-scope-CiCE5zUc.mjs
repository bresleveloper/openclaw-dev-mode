import { r as normalizeAgentIdStrict } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-CSDERtm3.mjs";
import { _ as resolveDefaultAgentId, a as resolveAgentDir, t as AgentSelectionRequiredError } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { r as GatewayErrorDetailCodes, t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
//#region src/gateway/server-methods/model-auth-agent-scope.ts
/** Resolves model-auth RPC scope without letting explicit garbage reach the default store. */
function resolveModelAuthAgentScope(cfg, requestedAgentId) {
	let agentId;
	if (requestedAgentId === void 0 || requestedAgentId === "") try {
		agentId = resolveDefaultAgentId(cfg, {
			surface: "model auth",
			hint: "Pass agentId to select a configured agent."
		});
	} catch (error) {
		if (!(error instanceof AgentSelectionRequiredError)) throw error;
		return {
			ok: false,
			error: errorShape(ErrorCodes.INVALID_REQUEST, error.message)
		};
	}
	else {
		if (typeof requestedAgentId !== "string") return unknownAgentScope(requestedAgentId === null ? "null" : typeof requestedAgentId);
		const rawAgentId = requestedAgentId.trim();
		if (!rawAgentId) return unknownAgentScope(requestedAgentId);
		const normalized = normalizeAgentIdStrict(rawAgentId);
		if (!normalized.ok || !listAgentIds(cfg).includes(normalized.value)) return unknownAgentScope(rawAgentId);
		agentId = normalized.value;
	}
	return {
		ok: true,
		agentId,
		agentDir: resolveAgentDir(cfg, agentId)
	};
}
function unknownAgentScope(agentId) {
	const details = {
		code: GatewayErrorDetailCodes.UNKNOWN_AGENT_ID,
		agentId
	};
	return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, `unknown agent id "${agentId}"`, { details })
	};
}
//#endregion
export { resolveModelAuthAgentScope as t };
