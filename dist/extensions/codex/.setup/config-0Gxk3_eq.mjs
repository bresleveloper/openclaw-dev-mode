import "./config-security-KAPScztc.mjs";
import { _ as readExecSecurity, b as readRecord, g as readExecAsk } from "./config-parsing-BQq-CHTF.mjs";
import "./auth-start-options-BPIPeEX8.mjs";
import { c as canUseCodexModelBackedApprovalsReviewerForModel$1 } from "./config-options-HG_Rr3W_.mjs";
import { n as resolveCodexAppServerRuntimeOptions } from "./config-runtime-cUYrqu_a.mjs";
import { t as __exportAll } from "./session-binding-sidecars-BrdV95Fg.mjs";
import { resolveAgentConfig } from "openclaw/plugin-sdk/agent-scope-runtime";
import { execPolicy } from "openclaw/plugin-sdk/agent-harness-runtime";
import { resolveExecApprovalsFromFile } from "openclaw/plugin-sdk/exec-approvals-runtime";
import { resolveProviderIdForAuth } from "openclaw/plugin-sdk/provider-auth-aliases";
//#region extensions/codex/src/app-server/config-exec-approvals.ts
function resolveOpenClawExecPolicyFromConfig(params) {
	const globalExec = readRecord(params.config?.tools?.exec);
	const globalPolicy = applyOpenClawExecPolicyLayer({
		...resolveOpenClawExecPolicyForMode("full"),
		touched: false
	}, globalExec);
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
	return applyOpenClawExecApprovalFloors(overridePolicy, params.approvals ? resolveExecApprovalsFromFile({
		file: params.approvals,
		agentId: params.agentId,
		overrides: {
			security: overridePolicy.security,
			ask: overridePolicy.ask
		}
	}).agent : void 0);
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
//#region extensions/codex/src/app-server/config.ts
var config_exports = /* @__PURE__ */ __exportAll({
	CODEX_PLUGINS_MARKETPLACE_NAME: () => CODEX_PLUGINS_MARKETPLACE_NAME,
	CODEX_PLUGINS_WORKSPACE_MARKETPLACE_NAME: () => CODEX_PLUGINS_WORKSPACE_MARKETPLACE_NAME,
	resolveCodexAppServerRuntimeOptions: () => resolveCodexAppServerRuntimeOptions
});
//#endregion
export { canUseCodexModelBackedApprovalsReviewerForModel as n, resolveOpenClawExecPolicyForCodexAppServer as r, config_exports as t };
