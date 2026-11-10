import { resolveAgentConfig, tryResolveDefaultAgentId } from "openclaw/plugin-sdk/agent-scope-runtime";
import { normalizeAgentId, parseAgentSessionKey } from "openclaw/plugin-sdk/routing";
import { resolvePreparedSandboxRuntimeStatus } from "openclaw/plugin-sdk/sandbox";
import { captureSessionEntryCurrentCheckAsync } from "openclaw/plugin-sdk/session-binding-runtime";
//#region extensions/codex/src/app-server/native-execution-policy.ts
function resolveRunPolicyParams(params, options) {
	return {
		config: params.config,
		sessionKey: options.runtimeSessionKey?.trim() || params.sandboxSessionKey?.trim() || params.sessionKey?.trim() || params.sessionId,
		sessionId: params.sessionId,
		agentId: options.agentId,
		sessionTarget: params.sessionTarget,
		execOverrides: params.execOverrides,
		sandboxAvailable: options.sandbox === null ? false : options.sandbox?.enabled,
		readRuntimeSessionEntry: true
	};
}
function prepareCodexNativeExecutionPolicyForRun(params, options = {}) {
	return prepareCodexNativeExecutionPolicy(resolveRunPolicyParams(params, options));
}
/** Prepare the selected row once; retained checks use its exact execution policy. */
async function prepareCodexNativeExecutionPolicy(params) {
	const captured = {
		...params,
		execOverrides: params.execOverrides && { ...params.execOverrides },
		sessionTarget: params.sessionTarget && { ...params.sessionTarget }
	};
	const { sourceAgentId, sourceSessionKey, canReadSessionEntry } = resolveSessionSelection(captured);
	if (!canReadSessionEntry || !sourceAgentId || !sourceSessionKey) return {
		policy: resolveCodexNativeExecutionPolicy({
			...captured,
			sessionEntry: captured.sessionEntry ?? null
		}),
		async assertCurrent() {},
		retain: () => () => {},
		release() {}
	};
	const selected = await captureSessionEntryCurrentCheckAsync({
		agentId: sourceAgentId,
		sessionKey: sourceSessionKey,
		storePath: captured.sessionTarget?.storePath ?? captured.storePath,
		fields: [
			"sessionId",
			"lifecycleRevision",
			"execHost",
			"execNode",
			"sandbox",
			"sandboxMode"
		],
		errorMessage: "Codex session execution policy changed; prepare the operation again."
	});
	try {
		let owners = 0;
		const retain = () => {
			owners++;
			let released = false;
			return () => {
				if (released) return;
				released = true;
				if (--owners === 0) selected.release();
			};
		};
		return {
			policy: resolveCodexNativeExecutionPolicy({
				...captured,
				sessionEntry: selected.entry ?? null,
				readRuntimeSessionEntry: false
			}),
			assertCurrent: selected.assertCurrent,
			source: selected.source,
			retain,
			release: retain()
		};
	} catch (error) {
		selected.release();
		throw error;
	}
}
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
	const { agentId, sessionKey } = resolveSessionSelection(params);
	const sessionEntry = params.sessionEntry;
	const sandboxAgentId = parseAgentSessionKey(sessionKey)?.agentId ?? agentId;
	const sandboxed = params.sandboxAvailable === true || (sessionKey && sandboxAgentId ? resolvePreparedSandboxRuntimeStatus({
		cfg: config,
		sessionKey,
		agentId: sandboxAgentId,
		classificationAgentId: sandboxAgentId,
		preparedSessionEntry: sessionEntry
	}).sandboxed : false);
	const sandboxAvailable = params.sandboxAvailable ?? sandboxed;
	const agentExec = agentId ? resolveAgentConfig(config, agentId)?.tools?.exec : void 0;
	const globalExec = config.tools?.exec;
	const requestedExecHost = normalizeExecTarget(params.execOverrides?.host) ?? normalizeExecTarget(sessionEntry?.execHost) ?? normalizeExecTarget(agentExec?.host) ?? normalizeExecTarget(globalExec?.host) ?? "auto";
	const effectiveExecHost = requestedExecHost === "auto" ? sandboxAvailable ? "sandbox" : "gateway" : requestedExecHost;
	const node = params.execOverrides?.node ?? sessionEntry?.execNode ?? agentExec?.node ?? globalExec?.node;
	return {
		nativeToolSurfaceAllowed: effectiveExecHost !== "node",
		sandboxed,
		requestedExecHost,
		effectiveExecHost,
		node,
		...effectiveExecHost === "node" ? { blockReason: "OpenClaw exec host=node is active for this session. Codex app-server native execution cannot route shell, filesystem, MCP, or app-backed work through the selected OpenClaw node." } : {}
	};
}
function resolveSessionSelection(params) {
	const config = params.config ?? {};
	const sessionKey = params.sessionKey?.trim() || params.sessionId?.trim() || void 0;
	const agentId = normalizeAgentIdOrDefault(params.agentId) ?? parseAgentIdFromSessionKey(sessionKey) ?? tryResolveDefaultAgentId(config);
	return {
		sessionKey,
		agentId,
		sourceSessionKey: params.sessionTarget?.sessionKey ?? sessionKey,
		sourceAgentId: params.sessionTarget?.agentId ?? agentId,
		canReadSessionEntry: params.sessionEntry === void 0 && params.readRuntimeSessionEntry && (params.sessionTarget !== void 0 || (parseAgentIdFromSessionKey(sessionKey) ?? tryResolveDefaultAgentId(config)) === agentId)
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
function parseAgentIdFromSessionKey(sessionKey) {
	const raw = sessionKey?.trim();
	if (!raw) return;
	const parts = raw.toLowerCase().split(":").filter(Boolean);
	if (parts.length < 3 || parts[0] !== "agent" || !parts[2]) return;
	return normalizeAgentIdOrDefault(parts[1]);
}
function normalizeAgentIdOrDefault(value) {
	const normalized = normalizeAgentId(value);
	return normalized === "main" && !(value ?? "").trim() ? void 0 : normalized;
}
function normalizeExecTarget(value) {
	const normalized = value?.trim().toLowerCase();
	if (normalized === "auto" || normalized === "sandbox" || normalized === "gateway" || normalized === "node") return normalized;
}
//#endregion
export { resolveCodexNodeExecToolOverrides as a, resolveCodexNativeExecutionPolicy as i, prepareCodexNativeExecutionPolicy as n, prepareCodexNativeExecutionPolicyForRun as r, formatCodexNativeNodeExecBlock as t };
