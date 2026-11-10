import { r as resolveAgentConfig } from "./agent-scope-config-fjA2T9Gz.mjs";
import { h as resolveSessionAgentId } from "./agent-scope-DXrnO3F4.mjs";
import { a as normalizeExecTarget, c as resolveExecModeFromPolicy, l as resolveExecModePolicy } from "./exec-approvals-core-7oJu_fRe.mjs";
import { n as maxAsk, r as minSecurity } from "./exec-approvals-policy-Cd5JaUxb.mjs";
import { t as applyExecPolicyLayer } from "./exec-policy-CTi1mi_7.mjs";
import { o as resolveSessionPermissionExecPolicy } from "./session-permission-exec-mode-orsENUww.mjs";
import { t as resolveExecApprovalsFromFileInternal } from "./exec-approvals-resolver-BYbI_zvO.mjs";
import { a as loadExecApprovalsReadOnlyAsync, r as loadExecApprovals } from "./exec-approvals-store-BhzM_h1C.mjs";
import "./exec-approvals-ByI8H66l.mjs";
import { f as resolveExecTarget } from "./bash-tools.exec-runtime-BPbW16Jz.mjs";
import { t as isRequestedExecTargetAllowed } from "./bash-tools.exec-target-CRl70nUx.mjs";
import { r as resolveSandboxRuntimeStatus, s as withSandboxRuntimeStatusInWorker } from "./runtime-status-DWm-5zUj.mjs";
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
function resolveNodeExecEligibility(params, preparedDefaults) {
	const defaults = preparedDefaults ?? resolveExecDefaults(params);
	const systemRunDenied = params.cfg?.gateway?.nodes?.commands?.deny?.some((command) => command.trim() === "system.run");
	return {
		canExec: defaults.canRequestNode && defaults.security !== "deny" && !systemRunDenied,
		...defaults.node ? { node: defaults.node } : {}
	};
}
/** Resolve node availability without reading the approval store on the caller thread. */
async function resolveNodeExecEligibilityAsync(params) {
	return resolveNodeExecEligibility(params, await resolveExecDefaultsAsync(params));
}
/** Resolve policy inputs first; only the host-floor branch requests approval state. */
function prepareExecDefaults(params, preparedSandbox) {
	const { cfg, host, agentId: resolvedAgentId, agentExec, globalExec } = resolveExecConfigState(params);
	const sandboxRuntime = params.sessionKey ? preparedSandbox ?? resolveSandboxRuntimeStatus({
		cfg,
		agentId: resolvedAgentId,
		sessionKey: params.sessionKey,
		preparedSessionEntry: params.sessionEntry
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
		let layeredPolicy = sessionPermissionPolicy ?? {
			security: approvalDefaults?.security ?? defaultSecurity,
			ask: approvalDefaults?.ask ?? "off"
		};
		if (!sessionPermissionPolicy) for (const layer of [
			globalExec,
			agentExec,
			params.execOverrides
		]) layeredPolicy = applyExecPolicyLayer(layeredPolicy, layer);
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
function resolveExecDefaults(params, preparedSandbox) {
	const preparation = prepareExecDefaults(params, preparedSandbox);
	return preparation.kind === "resolved" ? preparation.defaults : preparation.resolve(preparation.suppliedApprovals ?? loadExecApprovals());
}
/** Prepare session classification and host approval floors through their existing workers. */
async function resolveExecDefaultsAsync(params) {
	const { agentId } = resolveExecConfigState(params);
	const resolve = (sandbox) => resolvePreparedExecDefaultsAsync(prepareExecDefaults(params, sandbox), loadExecApprovalsReadOnlyAsync);
	if (params.sessionEntry !== void 0) return resolve(resolveSandboxRuntimeStatus({
		cfg: params.cfg,
		agentId,
		sessionKey: params.sessionKey,
		preparedSessionEntry: params.sessionEntry
	}));
	return withSandboxRuntimeStatusInWorker({
		cfg: params.cfg,
		agentId,
		sessionKey: params.sessionKey
	}, {
		env: process.env,
		cwd: process.cwd(),
		assertCurrent: () => {}
	}, resolve);
}
/** Called inside retained session-reader scopes, before synchronous tool construction. */
async function resolvePreparedExecDefaultsAsync(preparation, loadApprovals) {
	return preparation.kind === "resolved" ? preparation.defaults : preparation.resolve(preparation.suppliedApprovals ?? await loadApprovals());
}
//#endregion
export { resolveNodeExecEligibility as a, resolveExecDefaultsAsync as i, resolveExecConfigState as n, resolveNodeExecEligibilityAsync as o, resolveExecDefaults as r, resolvePreparedExecDefaultsAsync as s, prepareExecDefaults as t };
