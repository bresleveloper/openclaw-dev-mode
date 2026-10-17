import { r as resolveAgentConfig } from "./agent-scope-config-CDYpzA0r.mjs";
import { g as resolveSessionAgentId } from "./agent-scope-CG17uXFn.mjs";
import { a as normalizeExecTarget, c as resolveExecModeFromPolicy, l as resolveExecModePolicy } from "./exec-approvals-core-s7tTQC_a.mjs";
import { b as resolveExecApprovalsFromFileInternal, m as minSecurity, p as maxAsk } from "./exec-approvals-authorization.kernel-C_vJhPCn.mjs";
import { r as loadExecApprovals } from "./exec-approvals-store-DGp2moY9.mjs";
import "./exec-approvals-B1rZTeax.mjs";
import { t as applyExecPolicyLayer } from "./exec-policy-DDPEdabr.mjs";
import { a as resolveSessionPermissionExecPolicy } from "./session-permission-exec-mode-B_8rJnOA.mjs";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-m46YZG5q.mjs";
import { d as isRequestedExecTargetAllowed, m as resolveExecTarget } from "./bash-tools.exec-runtime-BETUcUuq.mjs";
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
/** Resolve policy inputs first; only the host-floor branch requests approval state. */
function prepareExecDefaults(params, preparedSandbox) {
	const { cfg, host, agentId: resolvedAgentId, agentExec, globalExec } = resolveExecConfigState(params);
	const sandboxRuntime = params.sessionKey ? preparedSandbox ?? resolveSandboxRuntimeStatus({
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
	const resolve = (approvalDefaults) => {
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
	};
	if (resolved.effectiveHost === "sandbox" || bypassHostApprovalFloors) return {
		kind: "resolved",
		defaults: resolve(void 0)
	};
	return {
		kind: "needs-approvals",
		suppliedApprovals: params.execApprovals,
		resolve: (file) => resolve(resolveExecApprovalsFromFileInternal({
			file,
			agentId: resolvedAgentId,
			overrides: {
				security: defaultSecurity,
				ask: "off"
			}
		}).agent)
	};
}
/** Resolves effective exec host, mode, approval policy, and node availability. */
function resolveExecDefaults(params) {
	const preparation = prepareExecDefaults(params);
	return preparation.kind === "resolved" ? preparation.defaults : preparation.resolve(preparation.suppliedApprovals ?? loadExecApprovals());
}
/** Called inside retained session-reader scopes, before synchronous tool construction. */
async function resolvePreparedExecDefaultsAsync(preparation, loadApprovals) {
	return preparation.kind === "resolved" ? preparation.defaults : preparation.resolve(preparation.suppliedApprovals ?? await loadApprovals());
}
//#endregion
export { resolvePreparedExecDefaultsAsync as a, resolveNodeExecEligibility as i, resolveExecConfigState as n, resolveExecDefaults as r, prepareExecDefaults as t };
