import { r as resolveAgentConfig } from "./agent-scope-config-IQKOEtZ4.mjs";
import { _ as resolveSessionAgentId } from "./agent-scope-CTuYDtny.mjs";
import { d as resolveExecModePolicy, s as normalizeExecTarget, u as resolveExecModeFromPolicy } from "./exec-approvals-core-BZ3ECkXD.mjs";
import { C as minSecurity, S as maxAsk } from "./exec-approvals-authorization.kernel-DYisNIDQ.mjs";
import { i as loadExecApprovals } from "./exec-approvals-store-CTT-ox-I.mjs";
import { i as resolveExecApprovalsFromFile } from "./exec-approvals-BgZlQ2Qp.mjs";
import { t as applyExecPolicyLayer } from "./exec-policy-L7B_Bk9D.mjs";
import { a as resolveSessionPermissionExecPolicy } from "./session-permission-exec-mode-Bn0mEuts.mjs";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-GvZUbuy9.mjs";
import { d as isRequestedExecTargetAllowed, h as resolveExecTarget } from "./bash-tools.exec-runtime--ySnbUm6.mjs";
//#region src/agents/exec-defaults.ts
function resolveExecConfigState(params) {
	const cfg = params.cfg ?? {};
	const resolvedAgentId = params.scope?.kind === "defaults" ? void 0 : params.agentId ?? resolveSessionAgentId({
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
/** Resolves whether node exec is usable and any effective node binding. */
function resolveNodeExecEligibility(params) {
	const defaults = resolveExecDefaults(params);
	const systemRunDenied = params.cfg?.gateway?.nodes?.commands?.deny?.some((command) => command.trim() === "system.run");
	return {
		canExec: defaults.canRequestNode && defaults.security !== "deny" && !systemRunDenied,
		...defaults.node ? { node: defaults.node } : {}
	};
}
/** Resolves effective exec host, mode, approval policy, and node availability. */
function resolveExecDefaults(params) {
	const { cfg, host, agentId: resolvedAgentId, agentExec, globalExec } = resolveExecConfigState(params);
	const sandboxRuntime = params.sessionKey ? resolveSandboxRuntimeStatus({
		cfg,
		agentId: resolvedAgentId,
		sessionKey: params.sessionKey
	}) : void 0;
	const sandboxRequired = params.sessionEntry?.sandbox === "required" || sandboxRuntime?.sandboxRequired === true;
	const sandboxAvailable = params.sandboxAvailable ?? sandboxRuntime?.sandboxed ?? false;
	const resolved = resolveExecTarget({
		configuredTarget: host,
		elevatedRequested: params.elevatedRequested === true && !sandboxRequired,
		sandboxAvailable,
		sandboxRequired
	});
	const defaultSecurity = resolved.effectiveHost === "sandbox" ? "deny" : "full";
	const sessionPermissionPolicy = params.sessionEntry?.permissionMode ? resolveSessionPermissionExecPolicy({ mode: params.sessionEntry.permissionMode }, params.execOverrides) : void 0;
	const bypassHostApprovalFloors = params.sessionEntry?.permissionMode === "full" && sessionPermissionPolicy?.security === "full";
	const approvalDefaults = resolved.effectiveHost === "sandbox" || bypassHostApprovalFloors ? void 0 : resolveExecApprovalsFromFile({
		file: params.execApprovals ?? loadExecApprovals(),
		agentId: resolvedAgentId,
		overrides: {
			security: defaultSecurity,
			ask: "off"
		}
	}).agent;
	const layeredPolicy = sessionPermissionPolicy ?? applyExecPolicyLayer(applyExecPolicyLayer(applyExecPolicyLayer({
		security: approvalDefaults?.security ?? defaultSecurity,
		ask: approvalDefaults?.ask ?? "off"
	}, globalExec), agentExec), params.execOverrides);
	const modePolicy = resolveExecModePolicy(layeredPolicy);
	const security = approvalDefaults?.security !== void 0 ? minSecurity(modePolicy.security, approvalDefaults.security) : modePolicy.security;
	const ask = approvalDefaults?.ask !== void 0 ? maxAsk(modePolicy.ask, approvalDefaults.ask) : modePolicy.ask;
	const mode = security === modePolicy.security && ask === modePolicy.ask ? modePolicy.mode : resolveExecModeFromPolicy({
		security,
		ask
	});
	return {
		host: resolved.configuredTarget,
		effectiveHost: resolved.effectiveHost,
		mode,
		security,
		ask,
		node: params.execOverrides?.node ?? params.sessionEntry?.execNode ?? agentExec?.node ?? globalExec?.node,
		canRequestNode: isRequestedExecTargetAllowed({
			configuredTarget: resolved.configuredTarget,
			requestedTarget: "node",
			sandboxAvailable
		})
	};
}
//#endregion
export { resolveExecDefaults as n, resolveNodeExecEligibility as r, resolveExecConfigState as t };
