import { l as isCodexRemoteExecPlacementSandbox } from "./config-parsing-BQq-CHTF.mjs";
import { n as resolveCodexNativeExecutionPolicy, t as formatCodexNativeNodeExecBlock } from "./native-execution-policy-ClzpdG3D.mjs";
import { t as __exportAll } from "./session-binding-sidecars-BrdV95Fg.mjs";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { tryResolveDefaultAgentId } from "openclaw/plugin-sdk/agent-scope-runtime";
import { parseAgentSessionKey } from "openclaw/plugin-sdk/routing";
import { resolveSandboxRuntimeStatus } from "openclaw/plugin-sdk/sandbox";
//#region extensions/codex/src/app-server/sandbox-guard.ts
/**
* Blocks direct Codex app-server requests that would bypass OpenClaw sandbox or
* node-exec routing guarantees.
*/
var sandbox_guard_exports = /* @__PURE__ */ __exportAll({
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
			surface: `app-server method \`${params.method}\``
		});
		if (nodeExecBlock) return nodeExecBlock;
	}
	if (controlPlane) return;
	const sessionKey = params.sessionKey?.trim() || params.sessionId?.trim();
	if (!sessionKey) return;
	const sandboxBlock = resolveCodexNativeSandboxBlock({
		config: params.config,
		sessionKey,
		sandbox: params.sandbox,
		surface: `app-server method \`${params.method}\``
	});
	if (!sandboxBlock) return;
	if (params.method === "thread/start" && hasOpenClawSandboxEnvironmentSelection(params.requestParams)) return;
	return sandboxBlock;
}
/** Resolves the generic native-execution block for sandboxed or node-hosted sessions. */
function resolveCodexNativeExecutionBlock(params) {
	return resolveCodexNativeSandboxBlock(params) ?? resolveCodexNativeNodeExecBlock(params);
}
/** Returns a block message when native Codex execution cannot honor active sandboxing. */
function resolveCodexNativeSandboxBlock(params) {
	if (params.sandboxEnvironmentSelected) return;
	const sessionKey = params.sessionKey?.trim() || params.sessionId?.trim();
	if (!sessionKey) return;
	if (isCodexRemoteExecPlacementSandbox(params.sandbox) || params.sandbox?.enabled === true) return formatCodexNativeSandboxBlock({ surface: params.surface });
	const sandboxAgentId = parseAgentSessionKey(sessionKey)?.agentId ?? params.agentId ?? tryResolveDefaultAgentId(params.config ?? {});
	if (!sandboxAgentId) return;
	if (!resolveSandboxRuntimeStatus({
		cfg: params.config,
		sessionKey,
		agentId: sandboxAgentId,
		classificationAgentId: sandboxAgentId
	}).sandboxed) return;
	return formatCodexNativeSandboxBlock({ surface: params.surface });
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
	const sessionKey = params.sessionKey?.trim() || params.sessionId?.trim();
	const policy = resolveCodexNativeExecutionPolicy({
		config: params.config,
		sessionKey,
		agentId: params.agentId,
		readRuntimeSessionEntry: Boolean(sessionKey)
	});
	if (policy.nativeToolSurfaceAllowed) return;
	return formatCodexNativeNodeExecBlock({
		surface: params.surface,
		reason: policy.blockReason
	});
}
//#endregion
export { resolveCodexNativeSandboxBlock as n, sandbox_guard_exports as r, resolveCodexNativeExecutionBlock as t };
