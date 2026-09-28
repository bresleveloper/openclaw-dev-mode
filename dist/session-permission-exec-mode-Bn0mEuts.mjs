import { f as resolveExecPolicyForMode } from "./exec-approvals-core-BZ3ECkXD.mjs";
import { C as minSecurity, S as maxAsk } from "./exec-approvals-authorization.kernel-DYisNIDQ.mjs";
import { t as applyExecPolicyLayer } from "./exec-policy-L7B_Bk9D.mjs";
//#region src/agents/session-permission-exec-mode.ts
const EXEC_MODE_BY_PERMISSION_MODE = {
	"read-only": "deny",
	guarded: "ask",
	workspace: "auto",
	full: "full"
};
const SESSION_PERMISSION_BY_EXEC_MODE = {
	deny: "read-only",
	allowlist: "guarded",
	ask: "guarded",
	auto: "workspace",
	full: "full"
};
function resolveSessionPermissionCoreToolPolicy(policy) {
	const workspaceOnly = policy.mode !== "full";
	return {
		workspaceOnly,
		readOnly: policy.mode === "read-only",
		applyPatchWorkspaceOnly: workspaceOnly,
		execMode: EXEC_MODE_BY_PERMISSION_MODE[policy.mode],
		bypassHostApprovalFloors: policy.mode === "full"
	};
}
function resolveSessionPermissionExecMode(policy) {
	return resolveSessionPermissionCoreToolPolicy(policy).execMode;
}
function resolveSessionPermissionExecPolicy(policy, overrides) {
	const mode = resolveSessionPermissionExecMode(policy);
	const base = resolveExecPolicyForMode(mode);
	const override = overrides?.mode ? resolveExecPolicyForMode(overrides.mode) : base;
	const security = minSecurity(base.security, minSecurity(override.security, overrides?.security ?? "full"));
	const ask = maxAsk(base.ask, maxAsk(override.ask, overrides?.ask ?? "off"));
	return {
		mode: security === base.security && ask === base.ask ? mode : void 0,
		security,
		ask
	};
}
/** Pure final projection shared by local tool construction and worker dispatch. */
function projectEffectiveExecPolicy(params) {
	const policy = params.permissionPolicy ? resolveSessionPermissionExecPolicy(params.permissionPolicy, params.overrides) : applyExecPolicyLayer(params.base, params.overrides);
	const target = params.scheduledExecTarget;
	const host = params.overrides?.host ?? params.base.host;
	return {
		host: host === void 0 || host === "auto" ? target?.host ?? host : host,
		mode: target?.ask ? void 0 : policy.mode,
		security: policy.security,
		ask: target?.ask ?? policy.ask,
		bypassHostApprovalFloors: target?.ask !== "always" && params.permissionPolicy?.mode === "full" && policy.security === "full"
	};
}
//#endregion
export { resolveSessionPermissionExecPolicy as a, resolveSessionPermissionExecMode as i, projectEffectiveExecPolicy as n, resolveSessionPermissionCoreToolPolicy as r, SESSION_PERMISSION_BY_EXEC_MODE as t };
