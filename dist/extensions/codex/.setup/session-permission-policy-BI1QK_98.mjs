import { S as selectUserApprovalsReviewer, _ as parseAllowedApprovalsReviewersFromCodexRequirements, a as resolveCodexAppServerNetworkProxy, b as selectGuardianApprovalPolicy, g as parseAllowedApprovalPoliciesFromCodexRequirements, j as selectGuardianSandbox, v as parseAllowedSandboxModesFromCodexRequirements, x as selectGuardianApprovalsReviewer } from "./config-security-BEReZ6go.mjs";
import { t as canUseCodexModelBackedApprovalsReviewerForModel } from "./config-BoTP_mrL.mjs";
import { hostname } from "node:os";
import { isPathInside } from "openclaw/plugin-sdk/file-access-runtime";
//#region extensions/codex/src/app-server/app-server-policy.ts
function resolveCodexAppServerForModelProvider(params) {
	if (!isCodexModelBackedApprovalsReviewer(params.appServer.approvalsReviewer) || canUseCodexModelBackedApprovalsReviewerForModel({
		modelProvider: params.provider,
		model: params.model,
		config: params.config,
		env: {
			...params.env ?? process.env,
			...params.appServer.start.env
		},
		agentDir: params.agentDir,
		codexConfigToml: params.codexConfigToml,
		homeScope: params.appServer.start.homeScope,
		codexArgs: params.appServer.start.args
	})) return params.appServer;
	return {
		...params.appServer,
		approvalsReviewer: "user"
	};
}
function isCodexModelBackedApprovalsReviewer(value) {
	return value === "auto_review" || value === "guardian_subagent";
}
//#endregion
//#region extensions/codex/src/app-server/session-permission-policy.ts
const CODEX_SESSION_PERMISSION_EXEC_MODES = {
	"read-only": "deny",
	guarded: "ask",
	workspace: "auto",
	full: "full"
};
function tupleForMode(mode, canUseAutoReview) {
	switch (mode) {
		case "read-only": return {
			sandbox: "read-only",
			approvalPolicy: "on-request",
			approvalsReviewer: "user"
		};
		case "guarded": return {
			sandbox: "workspace-write",
			approvalPolicy: "on-request",
			approvalsReviewer: "user"
		};
		case "workspace": return {
			sandbox: "workspace-write",
			approvalPolicy: "on-request",
			approvalsReviewer: canUseAutoReview ? "auto_review" : "user"
		};
		case "full": return {
			sandbox: "danger-full-access",
			approvalPolicy: "never",
			approvalsReviewer: "user"
		};
	}
	return mode;
}
function requirementsAllowTuple(tuple, allowed) {
	return (allowed.sandboxes === void 0 || allowed.sandboxes.has(tuple.sandbox)) && (allowed.approvalPolicies === void 0 || allowed.approvalPolicies.has(tuple.approvalPolicy)) && (allowed.reviewers === void 0 || allowed.reviewers.has(tuple.approvalsReviewer));
}
function tightenTupleForExecMode(tuple, execMode, requiresPerCommandApproval) {
	switch (execMode) {
		case "deny":
		case "allowlist": return {
			sandbox: "read-only",
			approvalPolicy: "on-request",
			approvalsReviewer: "user"
		};
		case "ask": return {
			...tuple,
			approvalPolicy: requiresPerCommandApproval ? "untrusted" : "on-request",
			approvalsReviewer: "user"
		};
		case "auto":
		case "full":
		case void 0: return tuple;
	}
	return execMode;
}
function clampSessionPermissionTuple(params) {
	if (!params.requirementsToml) return params.requested;
	const allowed = {
		sandboxes: parseAllowedSandboxModesFromCodexRequirements(params.requirementsToml, params.hostName ?? hostname()),
		approvalPolicies: parseAllowedApprovalPoliciesFromCodexRequirements(params.requirementsToml),
		reviewers: parseAllowedApprovalsReviewersFromCodexRequirements(params.requirementsToml)
	};
	if (requirementsAllowTuple(params.requested, allowed)) return params.requested;
	if (params.requested.approvalPolicy === "untrusted" && allowed.approvalPolicies?.has("untrusted") === false) throw new Error("tools.exec.ask=always requires Codex app-server per-command approvals");
	const userReviewRequired = params.mode === "read-only" || params.mode === "guarded" || params.mode === "workspace" && !params.canUseAutoReview;
	const sandboxAuthority = {
		"read-only": 0,
		"workspace-write": 1,
		"danger-full-access": 2
	};
	const allowedSandboxes = new Set([
		"read-only",
		"workspace-write",
		"danger-full-access"
	].filter((sandbox) => sandboxAuthority[sandbox] <= sandboxAuthority[params.requested.sandbox] && (allowed.sandboxes === void 0 || allowed.sandboxes.has(sandbox))));
	if (allowedSandboxes.size === 0) throw new Error(`Codex session permission mode=${params.mode} cannot satisfy managed sandbox requirements without widening access`);
	return {
		sandbox: selectGuardianSandbox(allowedSandboxes),
		approvalPolicy: params.requested.approvalPolicy === "untrusted" ? "untrusted" : selectGuardianApprovalPolicy(allowed.approvalPolicies, userReviewRequired ? "ask" : "auto"),
		approvalsReviewer: userReviewRequired ? selectUserApprovalsReviewer(allowed.reviewers) : selectGuardianApprovalsReviewer(allowed.reviewers, "auto")
	};
}
/** Applies one complete session-mode tuple without mixing requirements-clamped fields. */
function applyCodexSessionPermissionPolicy(params) {
	if (!params.permissionMode) return params.appServer;
	const sessionRoot = params.sessionRoot?.trim() || params.defaultRoot;
	if (params.policyLocked) return {
		...params.appServer,
		sessionRoot
	};
	const requested = tightenTupleForExecMode(tupleForMode(params.permissionMode, params.canUseAutoReview), params.execMode, params.appServer.approvalPolicy === "untrusted");
	const tuple = params.appServer.start.transport === "stdio" ? clampSessionPermissionTuple({
		mode: params.permissionMode,
		requested,
		requirementsToml: params.requirementsToml,
		hostName: params.hostName,
		canUseAutoReview: params.canUseAutoReview
	}) : requested;
	const networkProxy = params.appServer.networkProxy ? resolveCodexAppServerNetworkProxy(params.pluginConfig.appServer?.networkProxy, tuple.sandbox).networkProxy : void 0;
	const resolved = {
		...params.appServer,
		...tuple,
		sessionRoot
	};
	if (networkProxy) resolved.networkProxy = networkProxy;
	else delete resolved.networkProxy;
	return resolved;
}
function resolveCodexEffectiveSessionPermissionPolicy(params) {
	if (!params.permissionMode) return;
	const root = params.sessionRoot?.trim() || params.defaultRoot;
	const { sandbox, approvalPolicy, approvalsReviewer } = params.appServer;
	const fullAccess = params.permissionMode === "full" && sandbox === "danger-full-access" && approvalPolicy === "never";
	const guardianReview = params.permissionMode !== "guarded" && sandbox === "workspace-write" && approvalPolicy === "on-request" && approvalsReviewer !== "user";
	const mode = params.permissionMode === "read-only" || sandbox === "read-only" ? "read-only" : fullAccess ? "full" : guardianReview ? "workspace" : "guarded";
	return {
		mode,
		root,
		execMode: CODEX_SESSION_PERMISSION_EXEC_MODES[mode]
	};
}
/** Keeps relative execution inside the prepared root without filesystem rediscovery. */
function resolveCodexSessionPermissionCwd(params) {
	if (!params.permissionMode) return params.requestedCwd ?? params.fallbackCwd;
	const sessionRoot = params.sessionRoot?.trim() || params.defaultRoot;
	const requestedCwd = params.requestedCwd?.trim();
	return requestedCwd && isPathInside(sessionRoot, requestedCwd) ? requestedCwd : sessionRoot;
}
//#endregion
export { resolveCodexAppServerForModelProvider as a, resolveCodexSessionPermissionCwd as i, applyCodexSessionPermissionPolicy as n, resolveCodexEffectiveSessionPermissionPolicy as r, CODEX_SESSION_PERMISSION_EXEC_MODES as t };
