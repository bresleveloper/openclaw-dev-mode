import "./config-security-BxV4sSRz.mjs";
import { a as readExecAsk, l as readRecord, o as readExecSecurity } from "./config-utils-DN_YT7dE.mjs";
import "./config-parsing-DsWSCPHO.mjs";
import "./auth-start-options-P3n7Bssz.mjs";
import { c as canUseCodexModelBackedApprovalsReviewerForModel$1 } from "./config-options-l737cwJB.mjs";
import { n as resolveCodexAppServerRuntimeOptions } from "./config-runtime-Be4ZqerX.mjs";
import { t as __exportAll } from "./session-binding-sidecars-D0c8mmZ9.mjs";
import { resolveAgentConfig } from "openclaw/plugin-sdk/agent-scope-runtime";
import { execPolicy } from "openclaw/plugin-sdk/agent-harness-runtime";
import { resolveExecApprovalsFromFile } from "openclaw/plugin-sdk/exec-approvals-runtime";
import { resolveProviderIdForAuth } from "openclaw/plugin-sdk/provider-auth-aliases";
//#region extensions/codex/src/app-server/config-exec-approvals.ts
function resolveOpenClawExecPolicyForCodexAppServer(params) {
	if (params.permissionMode === "full") return resolveOpenClawExecPolicy({ mode: "full" });
	const globalExec = readRecord(params.config?.tools?.exec);
	const globalPolicy = applyOpenClawExecPolicyLayer(resolveOpenClawExecPolicy({ mode: "full" }, false), globalExec);
	const agentId = params.agentId?.trim();
	const overridePolicy = applyOpenClawExecPolicyLayer(applyOpenClawExecPolicyLayer(globalPolicy, agentId ? readRecord(resolveAgentConfig(params.config ?? {}, agentId)?.tools?.exec) : void 0), params.execOverrides);
	const approvalFloors = params.approvals ? resolveExecApprovalsFromFile({
		file: params.approvals,
		agentId: params.agentId,
		overrides: {
			security: overridePolicy.security,
			ask: overridePolicy.ask
		}
	}).agent : void 0;
	if (!approvalFloors) return overridePolicy;
	const nextSecurity = approvalFloors.security ? execPolicy.minSecurity(overridePolicy.security, approvalFloors.security) : overridePolicy.security;
	const nextAsk = approvalFloors.ask ? execPolicy.maxAsk(overridePolicy.ask, approvalFloors.ask) : overridePolicy.ask;
	if (nextSecurity === overridePolicy.security && nextAsk === overridePolicy.ask) return overridePolicy;
	return resolveOpenClawExecPolicy({
		security: nextSecurity,
		ask: nextAsk
	});
}
function applyOpenClawExecPolicyLayer(base, exec) {
	if (!exec) return base;
	const mode = readExecMode(exec.mode);
	if (mode !== void 0) return resolveOpenClawExecPolicy({ mode });
	const security = readExecSecurity(exec.security);
	const ask = readExecAsk(exec.ask);
	if (security === void 0 && ask === void 0) return base;
	return resolveOpenClawExecPolicy({
		security: security ?? base.security,
		ask: ask ?? base.ask
	});
}
function resolveOpenClawExecPolicy(policy, touched = true) {
	const { mode, security, ask } = execPolicy.resolveExecModePolicy({
		mode: policy.mode,
		security: policy.security ?? "full",
		ask: policy.ask ?? "off"
	});
	return {
		mode,
		security,
		ask,
		touched
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
