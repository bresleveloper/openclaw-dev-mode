import { resolveAgentConfig, tryResolveDefaultAgentId } from "openclaw/plugin-sdk/agent-scope-runtime";
import { normalizeAgentId, parseAgentSessionKey } from "openclaw/plugin-sdk/routing";
import { getSessionEntry } from "openclaw/plugin-sdk/session-store-runtime";
import { resolveSandboxRuntimeStatus } from "openclaw/plugin-sdk/sandbox";
//#region extensions/codex/src/app-server/native-execution-policy.ts
/** Projects node execution ownership into the runtime tool factory options. */
function resolveCodexNodeExecToolOverrides(policy) {
	if (policy.effectiveExecHost !== "node") return;
	const node = policy.node?.trim();
	return {
		host: "node",
		...node ? { node } : {}
	};
}
/** Resolves node/gateway/sandbox execution ownership from overrides, session, agent, and config. */
function resolveCodexNativeExecutionPolicy(params) {
	const config = params.config ?? {};
	const sessionKey = params.sessionKey?.trim() || params.sessionId?.trim() || void 0;
	const agentId = resolvePolicyAgentId({
		config,
		sessionKey,
		agentId: params.agentId
	});
	const canReadSessionEntry = Boolean(agentId) && params.readRuntimeSessionEntry && shouldReadRuntimeSessionEntry({
		config,
		sessionKey,
		agentId
	});
	const sessionEntry = params.sessionEntry ?? (canReadSessionEntry && sessionKey && agentId ? readRuntimeSessionEntryBestEffort({
		sessionKey,
		agentId
	}) : void 0);
	const sandboxAgentId = parseAgentSessionKey(sessionKey)?.agentId ?? agentId;
	const sandboxAvailable = params.sandboxAvailable ?? (sessionKey && sandboxAgentId ? resolveSandboxRuntimeStatus({
		cfg: config,
		sessionKey,
		agentId: sandboxAgentId,
		classificationAgentId: sandboxAgentId
	}).sandboxed : false);
	const agentExec = agentId ? resolvePolicyAgentExec({
		config,
		agentId
	}) : void 0;
	const globalExec = config.tools?.exec;
	const requestedExecHost = normalizeExecTarget(params.execOverrides?.host) ?? normalizeExecTarget(sessionEntry?.execHost) ?? normalizeExecTarget(agentExec?.host) ?? normalizeExecTarget(globalExec?.host) ?? "auto";
	const effectiveExecHost = resolveEffectiveExecHost({
		requestedExecHost,
		sandboxAvailable
	});
	const node = params.execOverrides?.node ?? sessionEntry?.execNode ?? agentExec?.node ?? globalExec?.node;
	if (effectiveExecHost !== "node") return {
		nativeToolSurfaceAllowed: true,
		requestedExecHost,
		effectiveExecHost,
		node
	};
	return {
		nativeToolSurfaceAllowed: false,
		requestedExecHost,
		effectiveExecHost,
		node,
		blockReason: "OpenClaw exec host=node is active for this session. Codex app-server native execution cannot route shell, filesystem, MCP, or app-backed work through the selected OpenClaw node."
	};
}
/** Formats the user-facing explanation shown when native tools are blocked by exec host=node. */
function formatCodexNativeNodeExecBlock(params) {
	return [
		`Codex-native ${params.surface} is unavailable because OpenClaw exec host=node is active for this session.`,
		params.reason ?? "Codex app-server native execution cannot route execution through the selected OpenClaw node.",
		"Use a normal Codex harness turn so OpenClaw exec/process tools run on the node, or switch exec host to gateway for native Codex app-server execution."
	].join(" ");
}
function resolvePolicyAgentId(params) {
	const explicitAgentId = normalizeAgentIdOrDefault(params.agentId);
	if (explicitAgentId) return explicitAgentId;
	const sessionAgentId = parseAgentIdFromSessionKey(params.sessionKey);
	if (sessionAgentId) return sessionAgentId;
	return tryResolveDefaultAgentId(params.config);
}
function resolvePolicyAgentExec(params) {
	return resolveAgentConfig(params.config, params.agentId)?.tools?.exec;
}
function parseAgentIdFromSessionKey(sessionKey) {
	const raw = sessionKey?.trim();
	if (!raw) return;
	const parts = raw.toLowerCase().split(":").filter(Boolean);
	if (parts.length < 3 || parts[0] !== "agent" || !parts[2]) return;
	return normalizeAgentIdOrDefault(parts[1]);
}
function shouldReadRuntimeSessionEntry(params) {
	if (!params.sessionKey) return false;
	const explicitAgentId = normalizeAgentIdOrDefault(params.agentId);
	if (!explicitAgentId) return true;
	const sessionAgentId = parseAgentIdFromSessionKey(params.sessionKey);
	if (!sessionAgentId) return isDefaultAgentSessionKeyForAgent({
		config: params.config,
		agentId: explicitAgentId
	});
	return sessionAgentId === explicitAgentId;
}
function isDefaultAgentSessionKeyForAgent(params) {
	return normalizeAgentId(params.agentId) === tryResolveDefaultAgentId(params.config);
}
function normalizeAgentIdOrDefault(value) {
	const normalized = normalizeAgentId(value);
	return normalized === "main" && !(value ?? "").trim() ? void 0 : normalized;
}
function normalizeExecTarget(value) {
	const normalized = value?.trim().toLowerCase();
	if (normalized === "auto" || normalized === "sandbox" || normalized === "gateway" || normalized === "node") return normalized;
}
function resolveEffectiveExecHost(params) {
	if (params.requestedExecHost === "auto") return params.sandboxAvailable ? "sandbox" : "gateway";
	return params.requestedExecHost;
}
function readRuntimeSessionEntryBestEffort(params) {
	try {
		return getSessionEntry({
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			hydrateSkillPromptRefs: false
		});
	} catch {
		return;
	}
}
//#endregion
export { resolveCodexNativeExecutionPolicy as n, resolveCodexNodeExecToolOverrides as r, formatCodexNativeNodeExecBlock as t };
