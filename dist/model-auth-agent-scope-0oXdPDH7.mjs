import { r as normalizeAgentIdStrict } from "./agent-id-D1-Q6vR4.mjs";
import { a as resolveAgentDir, g as resolveDefaultAgentId, t as AgentSelectionRequiredError } from "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { r as GatewayErrorDetailCodes, t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
//#region src/gateway/server-methods/model-auth-agent-scope.ts
/** Resolves model-auth RPC scope without letting explicit garbage reach the default store. */
function resolveModelAuthAgentScope(cfg, requestedAgentId) {
	if (requestedAgentId === void 0 || requestedAgentId === "") {
		let defaultAgentId;
		try {
			defaultAgentId = resolveDefaultAgentId(cfg, {
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
		return {
			ok: true,
			agentId: defaultAgentId,
			agentDir: resolveAgentDir(cfg, defaultAgentId)
		};
	}
	if (typeof requestedAgentId !== "string") return unknownAgentScope(requestedAgentId === null ? "null" : typeof requestedAgentId);
	const rawAgentId = requestedAgentId.trim();
	if (!rawAgentId) return unknownAgentScope(requestedAgentId);
	const normalized = normalizeAgentIdStrict(rawAgentId);
	if (!normalized.ok || !listAgentIds(cfg).includes(normalized.value)) return unknownAgentScope(rawAgentId);
	const agentId = normalized.value;
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
