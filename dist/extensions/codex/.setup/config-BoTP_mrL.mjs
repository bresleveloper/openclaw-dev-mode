import { c as readExecAsk, f as readRecord, l as readExecSecurity } from "./config-utils-DujwEnhg.mjs";
import "./config-security-BEReZ6go.mjs";
import "./config-parsing-CcB9iPoq.mjs";
import { c as canUseCodexModelBackedApprovalsReviewerForModel$1 } from "./config-options-BvaRs51b.mjs";
import "./config-runtime-C8Rw1m1m.mjs";
import { resolveAgentConfig } from "openclaw/plugin-sdk/agent-scope-runtime";
import { execPolicy } from "openclaw/plugin-sdk/agent-harness-runtime";
import { resolveExecApprovalsFromFile } from "openclaw/plugin-sdk/exec-approvals-runtime";
import { resolveProviderIdForAuth } from "openclaw/plugin-sdk/provider-auth-aliases";
//#region extensions/codex/src/app-server/config-exec-approvals.ts
function resolveOpenClawExecPolicyFromConfig(params) {
	const globalExec = readRecord(params.config?.tools?.exec);
	const globalPolicy = applyOpenClawExecPolicyLayer(createDefaultOpenClawExecPolicy(), globalExec);
	const agentId = params.agentId?.trim();
	return applyOpenClawExecPolicyLayer(globalPolicy, agentId ? readRecord(resolveAgentConfig(params.config ?? {}, agentId)?.tools?.exec) : void 0);
}
function resolveOpenClawExecPolicyForCodexAppServer(params) {
	if (params.permissionMode === "full") return {
		...resolveOpenClawExecPolicyForMode("full"),
		touched: true
	};
	const overridePolicy = applyOpenClawExecPolicyLayer(resolveOpenClawExecPolicyFromConfig({
		config: params.config,
		agentId: params.agentId
	}), params.execOverrides);
	return applyOpenClawExecApprovalFloors(overridePolicy, resolveOpenClawExecApprovalFloorsForCodexAppServer({
		approvals: params.approvals,
		agentId: params.agentId,
		policy: overridePolicy
	}));
}
function createDefaultOpenClawExecPolicy() {
	return {
		...resolveOpenClawExecPolicyForMode("full"),
		touched: false
	};
}
function applyOpenClawExecPolicyLayer(base, exec) {
	if (!exec) return base;
	const mode = readExecMode(exec.mode);
	if (mode !== void 0) return {
		...resolveOpenClawExecPolicyForMode(mode),
		touched: true
	};
	const security = readExecSecurity(exec.security);
	const ask = readExecAsk(exec.ask);
	if (security === void 0 && ask === void 0) return base;
	const nextSecurity = security ?? base.security;
	const nextAsk = ask ?? base.ask;
	return {
		mode: execPolicy.resolveExecModePolicy({
			security: nextSecurity,
			ask: nextAsk
		}).mode,
		security: nextSecurity,
		ask: nextAsk,
		touched: true
	};
}
function resolveOpenClawExecApprovalFloorsForCodexAppServer(params) {
	if (!params.approvals) return;
	return resolveExecApprovalsFromFile({
		file: params.approvals,
		agentId: params.agentId,
		overrides: {
			security: params.policy.security,
			ask: params.policy.ask
		}
	}).agent;
}
function applyOpenClawExecApprovalFloors(base, approvalFloors) {
	if (!approvalFloors) return base;
	const nextSecurity = approvalFloors.security ? execPolicy.minSecurity(base.security, approvalFloors.security) : base.security;
	const nextAsk = approvalFloors.ask ? execPolicy.maxAsk(base.ask, approvalFloors.ask) : base.ask;
	if (nextSecurity === base.security && nextAsk === base.ask) return base;
	return {
		mode: execPolicy.resolveExecModePolicy({
			security: nextSecurity,
			ask: nextAsk
		}).mode,
		security: nextSecurity,
		ask: nextAsk,
		touched: true
	};
}
function resolveOpenClawExecPolicyForMode(mode) {
	const { security, ask } = execPolicy.resolveExecModePolicy({
		mode,
		security: "full",
		ask: "off"
	});
	return {
		mode,
		security,
		ask
	};
}
function readExecMode(value) {
	return value === "deny" || value === "allowlist" || value === "ask" || value === "auto" || value === "full" ? value : void 0;
}
//#endregion
//#region extensions/codex/src/app-server/config-reviewer.ts
function canUseCodexModelBackedApprovalsReviewerForModel(params) {
	return canUseCodexModelBackedApprovalsReviewerForModel$1(params, resolveProviderIdForAuth);
}
//#endregion
export { resolveOpenClawExecPolicyForCodexAppServer as n, canUseCodexModelBackedApprovalsReviewerForModel as t };
