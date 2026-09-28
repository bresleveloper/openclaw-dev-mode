import { h as releaseLeasedSharedCodexAppServerClient } from "./shared-client-DA4VR4Eb.mjs";
import { ut as normalizeCodexDynamicToolName } from "./thread-requests-BLvGkP2R.mjs";
import { pinExecToolTarget } from "openclaw/plugin-sdk/codex-mcp-projection";
import { loadNodeExecAvailability } from "openclaw/plugin-sdk/node-selection-runtime";
//#region extensions/codex/src/app-server/shell-dynamic-tools.ts
const CODEX_NODE_EXEC_DYNAMIC_TOOL_NAME = "node_exec";
const CODEX_GATEWAY_EXEC_DYNAMIC_TOOL_NAME = "gateway_exec";
const CODEX_GATEWAY_PROCESS_DYNAMIC_TOOL_NAME = "gateway_process";
const PROCESS_FOLLOWUP_TEXT = "Use process (list/poll/log/write/send-keys/submit/paste/kill/clear/remove) for follow-up.";
/** Returns true when plugin config explicitly removes any named dynamic tool. */
function isCodexDynamicToolExcluded(config, names) {
	const normalizedNames = new Set(names.map((name) => normalizeCodexDynamicToolName(name)));
	return (config.codexDynamicToolsExclude ?? []).some((name) => normalizedNames.has(normalizeCodexDynamicToolName(name)));
}
async function createNodeExecAliasDynamicTool(execTool, node, discoverySignal, availabilityRef) {
	const pinnedNode = node?.trim();
	const availability = await (availabilityRef ? availabilityRef.current ??= loadNodeExecAvailability(discoverySignal) : loadNodeExecAvailability(discoverySignal));
	discoverySignal?.throwIfAborted();
	if (!availability.isAvailable(pinnedNode)) return;
	const pinnedTool = pinExecToolTarget(execTool, {
		host: "node",
		...pinnedNode ? { node: pinnedNode } : {}
	});
	const execute = async (toolCallId, args, signal, onUpdate) => {
		const result = await pinnedTool.execute(toolCallId, args, signal, onUpdate);
		return {
			...result,
			content: result.content.map((item) => item.type === "text" ? Object.assign({}, item, { text: item.text.replace(PROCESS_FOLLOWUP_TEXT, "Remote-node background follow-up is unavailable. Wait for the command to complete.") }) : item)
		};
	};
	return {
		...pinnedTool,
		name: CODEX_NODE_EXEC_DYNAMIC_TOOL_NAME,
		description: pinnedNode ? "Run a shell command to completion on the OpenClaw configured remote node for this session. This tool always uses OpenClaw host=node internally and follows the existing node exec approval and allowlist policy. Remote-node background follow-up is unavailable. Use Codex's native shell for local app-server work when it is available." : "Run a shell command to completion on an OpenClaw remote node. The sole connected node that can execute commands is selected automatically; select by name or id when several can. This tool always uses OpenClaw host=node internally and follows the existing node exec approval and allowlist policy. Remote-node background follow-up is unavailable. Use Codex's native shell for local app-server work when it is available.",
		execute
	};
}
function createGatewayExecProjection(createProjection, execTool, params) {
	return createProjection(execTool, {
		kind: "exec",
		name: CODEX_GATEWAY_EXEC_DYNAMIC_TOOL_NAME,
		description: "Run a shell command through OpenClaw on the Gateway host for OpenClaw-managed Gateway environment access, including Secret Store agent-readable environment values and protected egress sentinels. Native Codex shell remains preferred for ordinary local work. This tool always uses OpenClaw host=gateway internally and follows Gateway exec approval and allowlist policy.",
		followupText: params.processAliasAvailable ? "Use gateway_process (list/poll/log/write/send-keys/submit/paste/kill/clear/remove) for follow-up." : "Background session follow-up is unavailable because gateway_process is not exposed. Rerun without background=true and set yieldMs high enough to wait for completion.",
		...params.ask ? { ask: params.ask } : {}
	});
}
function createGatewayProcessProjection(createProjection, processTool) {
	return createProjection(processTool, {
		kind: "process",
		name: CODEX_GATEWAY_PROCESS_DYNAMIC_TOOL_NAME,
		description: "Manage background shell sessions in the existing per-session OpenClaw process scope: list, poll, log, write, send-keys, submit, paste, kill, clear, or remove. Use for gateway_exec follow-up; use native Codex shell session handling for ordinary local work."
	});
}
function createSandboxExecProjection(execTool) {
	return {
		...execTool,
		name: "sandbox_exec",
		description: "Run a shell command through OpenClaw's configured sandbox backend for this session. Use when OpenClaw sandboxing is active or when a command must execute in the sandbox backend, such as an SSH-backed sandbox or Docker container-path bind layout. Use Codex's native shell only when no OpenClaw sandbox is active and native Code Mode is available.",
		execute: async (toolCallId, args, signal, onUpdate) => {
			const result = await execTool.execute(toolCallId, args, signal, onUpdate);
			return {
				...result,
				content: result.content.map((item) => item.type === "text" ? Object.assign({}, item, { text: item.text.replace(PROCESS_FOLLOWUP_TEXT, "Use sandbox_process (list/poll/log/write/send-keys/submit/paste/kill/clear/remove) for follow-up.") }) : item)
			};
		}
	};
}
function createSandboxProcessProjection(processTool) {
	return {
		...processTool,
		name: "sandbox_process",
		description: "Manage background shell sessions through OpenClaw's configured sandbox backend for this session: list, poll, log, write, send-keys, submit, paste, kill, clear, or remove. Use only for sandbox follow-up; use Codex's native shell session handling only when no OpenClaw sandbox is active and native Code Mode is available."
	};
}
//#endregion
//#region extensions/codex/src/app-server/provider-capabilities.ts
function resolveOverriddenProviderWebSearchSupport(modelProviderOverride) {
	const provider = modelProviderOverride?.trim().toLowerCase();
	if (!provider) return;
	return provider === "openai" ? "supported" : "unsupported";
}
async function readConfiguredProviderWebSearchSupport(params) {
	if (params.expectedNativeModelProvider) {
		if (((await params.client.request("config/read", { includeLayers: false }, {
			timeoutMs: params.timeoutMs,
			signal: params.signal
		})).config.model_provider ?? "openai") !== params.expectedNativeModelProvider) return "unknown";
	}
	return (await params.client.request("modelProvider/capabilities/read", {}, {
		timeoutMs: params.timeoutMs,
		signal: params.signal
	})).webSearch ? "supported" : "unsupported";
}
async function resolveCodexProviderWebSearchSupportForClient(params) {
	const overrideSupport = resolveOverriddenProviderWebSearchSupport(params.modelProviderOverride);
	if (overrideSupport) return overrideSupport;
	try {
		return await readConfiguredProviderWebSearchSupport(params);
	} catch {
		return "unknown";
	}
}
async function resolveCodexProviderWebSearchSupport(params) {
	const overrideSupport = resolveOverriddenProviderWebSearchSupport(params.modelProviderOverride);
	if (overrideSupport) return overrideSupport;
	let client;
	try {
		client = await params.clientFactory({
			startOptions: params.appServer.start,
			...params.preparedAuth ? { preparedAuth: params.preparedAuth } : { authProfileId: params.authProfileId },
			agentDir: params.agentDir,
			config: params.config,
			timeoutMs: params.appServer.requestTimeoutMs
		});
		return await resolveCodexProviderWebSearchSupportForClient({
			client,
			timeoutMs: params.appServer.requestTimeoutMs,
			modelProviderOverride: params.modelProviderOverride,
			expectedNativeModelProvider: params.expectedNativeModelProvider,
			signal: params.signal
		});
	} catch {
		return "unknown";
	} finally {
		if (client) releaseLeasedSharedCodexAppServerClient(client);
	}
}
//#endregion
export { CODEX_NODE_EXEC_DYNAMIC_TOOL_NAME as a, createNodeExecAliasDynamicTool as c, isCodexDynamicToolExcluded as d, CODEX_GATEWAY_PROCESS_DYNAMIC_TOOL_NAME as i, createSandboxExecProjection as l, resolveCodexProviderWebSearchSupportForClient as n, createGatewayExecProjection as o, CODEX_GATEWAY_EXEC_DYNAMIC_TOOL_NAME as r, createGatewayProcessProjection as s, resolveCodexProviderWebSearchSupport as t, createSandboxProcessProjection as u };
