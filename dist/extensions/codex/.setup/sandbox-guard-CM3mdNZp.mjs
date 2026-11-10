import { l as isCodexRemoteExecPlacementSandbox } from "./config-parsing-DsWSCPHO.mjs";
import { n as prepareCodexNativeExecutionPolicy, t as formatCodexNativeNodeExecBlock } from "./native-execution-policy-D09tLP-u.mjs";
import { t as __exportAll } from "./session-binding-sidecars-D0c8mmZ9.mjs";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/codex/src/app-server/sandbox-guard.ts
var sandbox_guard_exports = /* @__PURE__ */ __exportAll({
	assertNativeConversationApprovalPolicySupported: () => assertNativeConversationApprovalPolicySupported,
	prepareCodexAppServerDirectSandboxBypassBlock: () => prepareCodexAppServerDirectSandboxBypassBlock,
	prepareCodexNativeExecutionBlock: () => prepareCodexNativeExecutionBlock,
	prepareCodexNativeSandboxBlock: () => prepareCodexNativeSandboxBlock,
	resolveCodexAppServerDirectSandboxBypassBlock: () => resolveCodexAppServerDirectSandboxBypassBlock,
	resolveCodexNativeExecutionBlock: () => resolveCodexNativeExecutionBlock,
	resolveCodexNativeSandboxBlock: () => resolveCodexNativeSandboxBlock
});
const ALLOWED_CONTROL_PLANE_METHODS = /* @__PURE__ */ new Set([
	"account/rateLimits/read",
	"account/read",
	"app/installed",
	"app/list",
	"app/read",
	"config/batchWrite",
	"config/mcpServer/reload",
	"config/read",
	"config/value/write",
	"environment/add",
	"experimentalFeature/list",
	"experimentalFeature/enablement/set",
	"feedback/upload",
	"hooks/list",
	"initialize",
	"marketplace/add",
	"mcpServerStatus/list",
	"model/list",
	"plugin/install",
	"plugin/installed",
	"plugin/list",
	"plugin/read",
	"skills/list",
	"thread/archive",
	"thread/inject_items",
	"thread/list",
	"thread/metadata/update",
	"thread/name/set",
	"thread/read",
	"thread/rollback",
	"thread/unarchive",
	"thread/unsubscribe",
	"turn/interrupt",
	"turn/steer"
]);
/** Returns a block message when a direct app-server method would bypass OpenClaw execution policy. */
function resolveCodexAppServerDirectSandboxBypassBlock(params) {
	const controlPlane = ALLOWED_CONTROL_PLANE_METHODS.has(params.method);
	if (!controlPlane || params.method === "config/mcpServer/reload") {
		const nodeExecBlock = resolveCodexNativeNodeExecBlock({
			config: params.config,
			sessionKey: params.sessionKey,
			sessionId: params.sessionId,
			agentId: params.agentId,
			storePath: params.storePath,
			sessionTarget: params.sessionTarget,
			executionPolicy: params.executionPolicy,
			surface: `app-server method \`${params.method}\``
		});
		if (nodeExecBlock) return nodeExecBlock;
	}
	if (controlPlane) return;
	const sessionKey = params.sessionKey?.trim() || params.sessionId?.trim();
	if (!sessionKey) return;
	const sandboxBlock = resolveCodexNativeSandboxBlock({
		...params,
		sessionKey,
		surface: `app-server method \`${params.method}\``
	});
	return sandboxBlock && params.method === "thread/start" && hasOpenClawSandboxEnvironmentSelection(params.requestParams) ? void 0 : sandboxBlock;
}
/** Resolve policy before yielding to client acquisition and recheck it at each write. */
async function prepareCodexAppServerDirectSandboxBypassBlock(params) {
	if (ALLOWED_CONTROL_PLANE_METHODS.has(params.method) && params.method !== "config/mcpServer/reload") return {
		block: void 0,
		async assertCurrent() {},
		release() {}
	};
	const selected = await prepareCodexNativeExecutionPolicy({
		...params,
		readRuntimeSessionEntry: true
	});
	return {
		block: resolveCodexAppServerDirectSandboxBypassBlock({
			...params,
			executionPolicy: selected.policy
		}),
		assertCurrent: selected.assertCurrent,
		source: selected.source,
		release: selected.release
	};
}
async function prepareCodexNativeExecutionBlock(params) {
	const selected = await prepareCodexNativeExecutionPolicy({
		...params,
		readRuntimeSessionEntry: true
	});
	return {
		block: resolveCodexNativeExecutionBlock({
			...params,
			executionPolicy: selected.policy
		}),
		assertCurrent: selected.assertCurrent,
		source: selected.source,
		release: selected.release
	};
}
async function prepareCodexNativeSandboxBlock(params) {
	const selected = await prepareCodexNativeExecutionPolicy({
		...params,
		readRuntimeSessionEntry: true
	});
	return {
		block: resolveCodexNativeSandboxBlock({
			...params,
			executionPolicy: selected.policy
		}),
		assertCurrent: selected.assertCurrent,
		source: selected.source,
		release: selected.release
	};
}
/** Resolves the generic native-execution block for sandboxed or node-hosted sessions. */
function resolveCodexNativeExecutionBlock(params) {
	return resolveCodexNativeSandboxBlock(params) ?? resolveCodexNativeNodeExecBlock(params);
}
/** Returns a block message when native Codex execution cannot honor active sandboxing. */
function resolveCodexNativeSandboxBlock(params) {
	if (params.sandboxEnvironmentSelected) return;
	if (!(params.sessionKey?.trim() || params.sessionId?.trim())) return;
	if (isCodexRemoteExecPlacementSandbox(params.sandbox) || params.sandbox?.enabled === true) return formatCodexNativeSandboxBlock({ surface: params.surface });
	return params.executionPolicy.sandboxed ? formatCodexNativeSandboxBlock({ surface: params.surface }) : void 0;
}
function hasOpenClawSandboxEnvironmentSelection(value) {
	if (!isRecord(value)) return false;
	const environments = value.environments;
	return Array.isArray(environments) && environments.length > 0 && environments.every((environment) => isRecord(environment) && typeof environment.environmentId === "string" && environment.environmentId.startsWith("openclaw-sandbox-") && typeof environment.cwd === "string" && environment.cwd.trim().length > 0);
}
function formatCodexNativeSandboxBlock(params) {
	return [
		`Codex-native ${params.surface} is unavailable because OpenClaw sandboxing is active for this session.`,
		"This mode cannot route execution through the OpenClaw sandbox backend.",
		"Use a normal Codex harness turn, or run an intentionally unsandboxed session."
	].join(" ");
}
function resolveCodexNativeNodeExecBlock(params) {
	const policy = params.executionPolicy;
	if (policy.nativeToolSurfaceAllowed) return;
	return formatCodexNativeNodeExecBlock({
		surface: params.surface,
		reason: policy.blockReason
	});
}
const NATIVE_CONVERSATION_INTERACTIVE_APPROVALS_UNAVAILABLE = "OpenClaw native Codex conversation binding cannot route interactive approvals yet; use the Codex harness or explicit /acp spawn codex for that workflow.";
function assertNativeConversationApprovalPolicySupported(runtime) {
	if (runtime.approvalPolicy !== "never" && runtime.approvalsReviewer === "user") throw new Error(NATIVE_CONVERSATION_INTERACTIVE_APPROVALS_UNAVAILABLE);
}
//#endregion
export { sandbox_guard_exports as a, resolveCodexNativeExecutionBlock as i, prepareCodexNativeExecutionBlock as n, prepareCodexNativeSandboxBlock as r, assertNativeConversationApprovalPolicySupported as t };
