import { v as resolveSessionAgentId } from "./agent-scope-B2Pk_xhT.js";
import { r as resolveAgentConfig } from "./agent-scope-config-BxAUeF6t.js";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-BRnZ3ffr.js";
import { B as resolveExecApprovalsFromFile, C as normalizeExecSecurity, G as resolveExecModePolicy, W as resolveExecModeFromPolicy, _ as minSecurity, b as normalizeExecAsk, h as maxAsk, m as loadExecApprovals, w as normalizeExecTarget } from "./exec-approvals-BIKWP8_V.js";
import { t as applyExecPolicyLayer } from "./exec-policy-CBUzYdh5.js";
import { m as resolveExecTarget, u as isRequestedExecTargetAllowed } from "./bash-tools.exec-runtime-C4wbBIx6.js";
//#region src/agents/exec-defaults.ts
function applySessionLegacyExecPolicyLayer(base, sessionEntry) {
	const security = normalizeExecSecurity(sessionEntry?.execSecurity);
	const ask = normalizeExecAsk(sessionEntry?.execAsk);
	if (security !== null || ask !== null) return {
		security: security ?? base.security,
		ask: ask ?? base.ask
	};
	return base;
}
function resolveExecConfigState(params) {
	const cfg = params.cfg ?? {};
	const resolvedAgentId = params.agentId ?? resolveSessionAgentId({
		sessionKey: params.sessionKey,
		config: cfg
	});
	const globalExec = cfg.tools?.exec;
	const agentExec = resolvedAgentId ? resolveAgentConfig(cfg, resolvedAgentId)?.tools?.exec : void 0;
	return {
		cfg,
		host: params.execOverrides?.host ?? normalizeExecTarget(params.sessionEntry?.execHost) ?? agentExec?.host ?? globalExec?.host ?? "auto",
		agentId: resolvedAgentId,
		agentExec,
		globalExec
	};
}
function resolveExecSandboxAvailability(params) {
	return params.sandboxAvailable ?? (params.sessionKey ? resolveSandboxRuntimeStatus({
		cfg: params.cfg,
		sessionKey: params.sessionKey
	}).sandboxed : false);
}
/** Returns whether the current exec policy allows requesting host node execution. */
function canExecRequestNode(params) {
	const { cfg, host } = resolveExecConfigState(params);
	return isRequestedExecTargetAllowed({
		configuredTarget: host,
		requestedTarget: "node",
		sandboxAvailable: resolveExecSandboxAvailability({
			cfg,
			sessionKey: params.sessionKey,
			sandboxAvailable: params.sandboxAvailable
		})
	});
}
/** Resolves effective exec host, mode, approval policy, and node availability. */
function resolveExecDefaults(params) {
	const { cfg, host, agentId: resolvedAgentId, agentExec, globalExec } = resolveExecConfigState(params);
	const sandboxAvailable = resolveExecSandboxAvailability({
		cfg,
		sessionKey: params.sessionKey,
		sandboxAvailable: params.sandboxAvailable
	});
	const resolved = resolveExecTarget({
		configuredTarget: host,
		elevatedRequested: params.elevatedRequested === true,
		sandboxAvailable
	});
	const defaultSecurity = resolved.effectiveHost === "sandbox" ? "deny" : "full";
	const approvalDefaults = resolved.effectiveHost === "sandbox" ? void 0 : resolveExecApprovalsFromFile({
		file: loadExecApprovals(),
		agentId: resolvedAgentId,
		overrides: {
			security: defaultSecurity,
			ask: "off"
		}
	}).agent;
	const modePolicy = resolveExecModePolicy(applyExecPolicyLayer(applySessionLegacyExecPolicyLayer(applyExecPolicyLayer(applyExecPolicyLayer({
		security: approvalDefaults?.security ?? defaultSecurity,
		ask: approvalDefaults?.ask ?? "off"
	}, globalExec), agentExec), params.sessionEntry), params.execOverrides));
	const security = approvalDefaults?.security !== void 0 ? minSecurity(modePolicy.security, approvalDefaults.security) : modePolicy.security;
	const ask = approvalDefaults?.ask !== void 0 ? maxAsk(modePolicy.ask, approvalDefaults.ask) : modePolicy.ask;
	const mode = security === modePolicy.security && ask === modePolicy.ask ? modePolicy.mode : resolveExecModeFromPolicy({
		security,
		ask
	});
	return {
		host,
		effectiveHost: resolved.effectiveHost,
		mode,
		security,
		ask,
		node: params.execOverrides?.node ?? params.sessionEntry?.execNode ?? agentExec?.node ?? globalExec?.node,
		canRequestNode: isRequestedExecTargetAllowed({
			configuredTarget: host,
			requestedTarget: "node",
			sandboxAvailable
		})
	};
}
//#endregion
export { resolveExecDefaults as n, canExecRequestNode as t };
