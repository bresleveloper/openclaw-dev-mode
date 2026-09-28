import { t as __exportAll } from "./rolldown-runtime-8H4AJuhK.mjs";
import { l as isCodexRemoteExecPlacementSandbox } from "./config-parsing-CcB9iPoq.mjs";
import { n as resolveCodexNativeExecutionPolicy, t as formatCodexNativeNodeExecBlock } from "./native-execution-policy-umd0tgh4.mjs";
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
const DIRECT_METHOD_POLICIES = /* @__PURE__ */ new Map([
	["account/rateLimits/read", "allowed-control-plane"],
	["account/read", "allowed-control-plane"],
	["app/installed", "allowed-control-plane"],
	["app/list", "allowed-control-plane"],
	["app/read", "allowed-control-plane"],
	["config/batchWrite", "allowed-control-plane"],
	["config/mcpServer/reload", "allowed-control-plane"],
	["config/read", "allowed-control-plane"],
	["config/value/write", "allowed-control-plane"],
	["environment/add", "allowed-control-plane"],
	["experimentalFeature/list", "allowed-control-plane"],
	["experimentalFeature/enablement/set", "allowed-control-plane"],
	["feedback/upload", "allowed-control-plane"],
	["hooks/list", "allowed-control-plane"],
	["initialize", "allowed-control-plane"],
	["marketplace/add", "allowed-control-plane"],
	["mcpServerStatus/list", "allowed-control-plane"],
	["model/list", "allowed-control-plane"],
	["plugin/install", "allowed-control-plane"],
	["plugin/installed", "allowed-control-plane"],
	["plugin/list", "allowed-control-plane"],
	["plugin/read", "allowed-control-plane"],
	["skills/list", "allowed-control-plane"],
	["thread/archive", "allowed-control-plane"],
	["thread/inject_items", "allowed-control-plane"],
	["thread/list", "allowed-control-plane"],
	["thread/metadata/update", "allowed-control-plane"],
	["thread/name/set", "allowed-control-plane"],
	["thread/read", "allowed-control-plane"],
	["thread/rollback", "allowed-control-plane"],
	["thread/start", "requires-openclaw-environment"],
	["thread/unarchive", "allowed-control-plane"],
	["thread/unsubscribe", "allowed-control-plane"],
	["turn/interrupt", "allowed-control-plane"],
	["turn/steer", "allowed-control-plane"],
	["command/exec", "blocked-native-bypass"],
	["command/resize", "blocked-native-bypass"],
	["command/terminate", "blocked-native-bypass"],
	["command/write", "blocked-native-bypass"],
	["fuzzyFileSearch", "blocked-native-bypass"],
	["mcpServer/resource/read", "blocked-native-bypass"],
	["mcpServer/tool/call", "blocked-native-bypass"],
	["process/kill", "blocked-native-bypass"],
	["process/resizePty", "blocked-native-bypass"],
	["process/spawn", "blocked-native-bypass"],
	["process/writeStdin", "blocked-native-bypass"],
	["review/start", "blocked-native-bypass"],
	["thread/compact/start", "blocked-native-bypass"],
	["thread/fork", "blocked-native-bypass"],
	["thread/resume", "blocked-native-bypass"],
	["thread/shellCommand", "blocked-native-bypass"],
	["turn/start", "blocked-native-bypass"]
]);
const BLOCKED_DIRECT_METHOD_PREFIXES = [
	"command/",
	"fs/",
	"windowsSandbox/"
];
const NODE_EXEC_BLOCKED_CONTROL_PLANE_METHODS = /* @__PURE__ */ new Set(["config/mcpServer/reload"]);
/** Returns a block message when a direct app-server method would bypass OpenClaw execution policy. */
function resolveCodexAppServerDirectSandboxBypassBlock(params) {
	const policy = resolveDirectMethodPolicy(params.method);
	if (NODE_EXEC_BLOCKED_CONTROL_PLANE_METHODS.has(params.method)) {
		const nodeExecBlock = resolveCodexNativeNodeExecBlock({
			config: params.config,
			sessionKey: params.sessionKey,
			sessionId: params.sessionId,
			surface: `app-server method \`${params.method}\``
		});
		if (nodeExecBlock) return nodeExecBlock;
	}
	if (policy === "allowed-control-plane") return;
	const nodeExecBlock = resolveCodexNativeNodeExecBlock({
		config: params.config,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		surface: `app-server method \`${params.method}\``
	});
	if (nodeExecBlock) return nodeExecBlock;
	const sessionKey = params.sessionKey?.trim() || params.sessionId?.trim();
	if (!sessionKey) return;
	const sandboxBlock = resolveCodexNativeSandboxBlock({
		config: params.config,
		sessionKey,
		sandbox: params.sandbox,
		surface: `app-server method \`${params.method}\``
	});
	if (!sandboxBlock) return;
	if (policy === "requires-openclaw-environment" && hasOpenClawSandboxEnvironmentSelection(params.requestParams)) return;
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
function resolveDirectMethodPolicy(method) {
	const exact = DIRECT_METHOD_POLICIES.get(method);
	if (exact) return exact;
	if (BLOCKED_DIRECT_METHOD_PREFIXES.some((prefix) => method.startsWith(prefix))) return "blocked-native-bypass";
	return "blocked-native-bypass";
}
function hasOpenClawSandboxEnvironmentSelection(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return false;
	const environments = value.environments;
	return Array.isArray(environments) && environments.length > 0 && environments.every((entry) => {
		if (!entry || typeof entry !== "object" || Array.isArray(entry)) return false;
		const environment = entry;
		return typeof environment.environmentId === "string" && environment.environmentId.startsWith("openclaw-sandbox-") && typeof environment.cwd === "string" && environment.cwd.trim().length > 0;
	});
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
