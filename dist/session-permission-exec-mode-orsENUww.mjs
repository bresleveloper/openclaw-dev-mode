import { u as resolveExecPolicyForMode } from "./exec-approvals-core-7oJu_fRe.mjs";
import { n as maxAsk, r as minSecurity } from "./exec-approvals-policy-Cd5JaUxb.mjs";
import { t as applyExecPolicyLayer } from "./exec-policy-CTi1mi_7.mjs";
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
/** A retained mode is a ceiling; unset mode keeps config and host approval policy. */
function intersectSessionPermissionModes(retained, current) {
	if (retained === current) return retained;
	if (retained === "read-only" || current === "read-only") return "read-only";
	if (retained === "full") return current;
	if (current === "full") return retained;
	if (retained === void 0 || current === void 0) throw new Error("The session changed between default and explicit permissions; start a new turn under the current policy.");
	return retained === "guarded" || current === "guarded" ? "guarded" : "workspace";
}
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
export { resolveSessionPermissionExecMode as a, resolveSessionPermissionCoreToolPolicy as i, intersectSessionPermissionModes as n, resolveSessionPermissionExecPolicy as o, projectEffectiveExecPolicy as r, SESSION_PERMISSION_BY_EXEC_MODE as t };
