import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-CSDERtm3.mjs";
import { n as AcpRuntimeError } from "./errors-C8Hasc_X.mjs";
import "./errors-BYR7FGxG.mjs";
//#region src/acp/policy.ts
const ACP_DISABLED_MESSAGE = "ACP is disabled by policy (`acp.enabled=false`).";
const ACP_DISPATCH_DISABLED_MESSAGE = "ACP dispatch is disabled by policy (`acp.dispatch.enabled=false`).";
function isAcpEnabledByPolicy(cfg) {
	return cfg.acp?.enabled !== false;
}
function resolveAcpDispatchPolicyMessage(cfg) {
	if (!isAcpEnabledByPolicy(cfg)) return ACP_DISABLED_MESSAGE;
	return cfg.acp?.dispatch?.enabled === false ? ACP_DISPATCH_DISABLED_MESSAGE : null;
}
function resolveAcpDispatchPolicyError(cfg) {
	const message = resolveAcpDispatchPolicyMessage(cfg);
	if (!message) return null;
	return new AcpRuntimeError("ACP_DISPATCH_DISABLED", message);
}
/** Returns the runtime error for explicit ACP turns when ACP itself is disabled. */
function resolveAcpExplicitTurnPolicyError(cfg) {
	if (isAcpEnabledByPolicy(cfg)) return null;
	return new AcpRuntimeError("ACP_DISPATCH_DISABLED", ACP_DISABLED_MESSAGE);
}
function resolveAcpAgentPolicyError(cfg, agentId) {
	const allowed = (cfg.acp?.allowedAgents ?? []).map(normalizeAgentId).filter(Boolean);
	if (allowed.length === 0 || allowed.includes(normalizeAgentId(agentId))) return null;
	return new AcpRuntimeError("ACP_SESSION_INIT_FAILED", `ACP agent "${normalizeAgentId(agentId)}" is not allowed by policy.`);
}
//#endregion
export { resolveAcpExplicitTurnPolicyError as a, resolveAcpDispatchPolicyMessage as i, resolveAcpAgentPolicyError as n, resolveAcpDispatchPolicyError as r, isAcpEnabledByPolicy as t };
