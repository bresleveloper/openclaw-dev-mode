import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as normalizeAgentId, t as isValidAgentId } from "./agent-id-GA8mwdTG.mjs";
import "./session-key-CBvmC8zz.mjs";
import { r as normalizeConfiguredMcpServers } from "./mcp-config-normalize-Cl4qyvGH.mjs";
import { _ as resolveSessionAgentId } from "./agent-scope-CTuYDtny.mjs";
import { c as releaseSessionMcpRuntime, n as acquireSessionMcpRuntime } from "./agent-bundle-mcp-manager-api-BwOPQ1t_.mjs";
import { a as partitionMcpServersByConnectionScope } from "./mcp-connection-resolver-BWfIk8DO.mjs";
import { r as resolveMcpBearerBundleConfig, t as requiresMcpBearerProjection } from "./mcp-auth-profile-BKId7Bvr.mjs";
import { r as getPluginToolMeta } from "./tool-metadata-DpaqT_qU.mjs";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-GvZUbuy9.mjs";
import { t as buildBundleMcpToolsFromCatalog } from "./agent-bundle-mcp-materialize-Cvwg99KJ.mjs";
import { t as resolveConversationCapabilityProfile } from "./conversation-capability-profile-DHYohf4q.mjs";
import { t as applyFinalEffectiveToolPolicy } from "./effective-tool-policy-DOxCMP7W.mjs";
import { t as applyEmbeddedAttemptToolsAllow } from "./attempt-tool-construction-plan-DN-5OrUy.mjs";
import { t as loadMcpToolGrants } from "./exec-approvals-mcp-B_umLODz.mjs";
import { a as normalizeCodexMcpServerConfig, n as buildCodexMcpServersConfig, t as applyCodexSessionMcpToolDenials } from "./codex-mcp-config-Dgzz3FQY.mjs";
import { n as serializeTomlInlineValue } from "./toml-inline-kFOEkXyt.mjs";
//#region src/agents/native-mcp-policy.ts
function buildPolicyProjectionTools(catalog) {
	const callableTools = buildBundleMcpToolsFromCatalog({ catalog }).filter((tool) => getPluginToolMeta(tool)?.mcp?.operation === "tool");
	const callableIdentities = new Set(callableTools.flatMap((tool) => {
		const mcp = getPluginToolMeta(tool)?.mcp;
		return mcp?.operation === "tool" ? [JSON.stringify([mcp.serverName, mcp.toolName])] : [];
	}));
	const hiddenPolicyTools = (catalog.policyTools ?? [...catalog.tools, ...catalog.sessionDeniedTools ?? []]).filter((tool) => !callableIdentities.has(JSON.stringify([tool.serverName, tool.toolName])));
	const hiddenTools = buildBundleMcpToolsFromCatalog({
		catalog: {
			...catalog,
			tools: hiddenPolicyTools,
			policyTools: void 0,
			sessionDeniedTools: void 0
		},
		reservedToolNames: callableTools.map((tool) => tool.name),
		includeAppOnlyInventory: true
	}).filter((tool) => getPluginToolMeta(tool)?.mcp?.operation === "tool");
	return [...callableTools, ...hiddenTools];
}
async function prepareNativeMcpPolicy(params) {
	params.runtime.markUsed();
	const allTools = buildPolicyProjectionTools(await params.runtime.getCatalog());
	const runtimeAllowed = applyEmbeddedAttemptToolsAllow(allTools, params.runtimeToolsAllow, { toolMeta: (tool) => getPluginToolMeta(tool) });
	const effectiveAllowed = applyFinalEffectiveToolPolicy({
		bundledTools: runtimeAllowed,
		config: params.config,
		workspaceDir: params.workspaceDir,
		conversationCapabilityProfile: params.capabilityProfile,
		warn: params.warn
	});
	const effectiveAllowedNames = new Set(effectiveAllowed.map((tool) => tool.name));
	const servers = {};
	for (const tool of allTools) {
		const mcp = getPluginToolMeta(tool)?.mcp;
		if (!mcp || mcp.operation !== "tool") continue;
		const server = servers[mcp.serverName] ??= {
			serverName: mcp.serverName,
			safeServerName: mcp.safeServerName,
			allowedTools: [],
			deniedTools: []
		};
		(!mcp.excludedFromOpenClawCatalog && !mcp.deniedBySession && effectiveAllowedNames.has(tool.name) ? server.allowedTools : server.deniedTools).push(mcp.toolName);
	}
	for (const server of Object.values(servers)) {
		server.allowedTools = [...new Set(server.allowedTools)].toSorted();
		server.deniedTools = [...new Set(server.deniedTools)].toSorted();
	}
	return { servers: Object.fromEntries(Object.entries(servers).toSorted(([left], [right]) => left.localeCompare(right))) };
}
/** Applies one prepared policy to the provider-neutral MCP config shape. */
function applyPreparedNativeMcpPolicy(config, policy) {
	return { mcpServers: Object.fromEntries(Object.entries(config.mcpServers).flatMap(([serverName, server]) => {
		const prepared = policy.servers[serverName];
		if (!prepared || prepared.allowedTools.length === 0) return [];
		const toolFilter = isRecord(server.toolFilter) ? server.toolFilter : {};
		return [[serverName, {
			...server,
			toolFilter: {
				...toolFilter,
				include: prepared.allowedTools,
				exclude: prepared.deniedTools
			}
		}]];
	})) };
}
/** Returns raw per-server denials for backends that enforce a deny list. */
function preparedNativeMcpDenials(policy) {
	const entries = Object.values(policy.servers).filter((server) => server.deniedTools.length > 0).map((server) => [server.serverName, server.deniedTools]);
	return entries.length > 0 ? Object.fromEntries(entries) : void 0;
}
//#endregion
//#region src/agents/cli-runner/bundle-mcp-codex.ts
/**
* Codex CLI and app-server bundle MCP projection helpers.
*/
function normalizeAgentIds(value) {
	if (!Array.isArray(value)) return [];
	return value.filter((entry) => typeof entry === "string").map((entry) => entry.trim()).filter((entry) => isValidAgentId(entry)).map((entry) => normalizeAgentId(entry));
}
function readCodexProjectionConfig(server) {
	return isRecord(server.codex) ? server.codex : {};
}
function isCodexMcpServerAllowedForAgent(server, options) {
	const codex = readCodexProjectionConfig(server);
	if (!Object.hasOwn(codex, "agents")) return true;
	const agentIds = normalizeAgentIds(codex.agents);
	if (agentIds.length === 0 || !options?.agentId) return false;
	return agentIds.includes(normalizeAgentId(options.agentId));
}
/**
* Applies Codex-only agent scoping before OpenClaw resolves credentials or opens transports.
* Session overrides may narrow this result, but cannot widen `codex.agents`.
*/
function resolveCodexMcpToolOverridesForAgent(cfg, options) {
	const deniedServerNames = Object.entries(normalizeConfiguredMcpServers(cfg?.mcp?.servers)).filter(([, server]) => !isCodexMcpServerAllowedForAgent(server, options)).map(([name]) => name);
	if (deniedServerNames.length === 0) return options.toolOverrides;
	const mcpServers = { ...options.toolOverrides?.mcpServers };
	for (const serverName of deniedServerNames) mcpServers[serverName] = false;
	return {
		...options.toolOverrides,
		mcpServers
	};
}
function readSessionMcpServerOverride(options, name) {
	const overrides = options?.toolOverrides?.mcpServers;
	return overrides && Object.hasOwn(overrides, name) ? overrides[name] : void 0;
}
function selectCodexProjectableMcpServers(cfg, options) {
	const userServers = normalizeConfiguredMcpServers(cfg?.mcp?.servers);
	const { staticServers } = partitionMcpServersByConnectionScope(userServers);
	return Object.fromEntries(Object.entries(staticServers).filter(([serverName, server]) => {
		const serverOverride = readSessionMcpServerOverride(options, serverName);
		if (!(serverOverride !== false && (serverOverride === true || server.enabled !== false) && isCodexMcpServerAllowedForAgent(server, options))) return false;
		if (options?.allowLiteralOAuthProjection === false && requiresMcpBearerProjection(server)) {
			options.onServerUnavailable?.(serverName, /* @__PURE__ */ new Error(`MCP OAuth bearer projection is only supported for local app-server connections.`));
			return false;
		}
		return true;
	}));
}
/** Returns Codex CLI args with TOML MCP server overrides injected. */
function injectCodexMcpConfigArgs(args, config) {
	const overrides = serializeTomlInlineValue(buildCodexMcpServersConfig(config));
	return [
		...args ?? [],
		"-c",
		`mcp_servers=${overrides}`
	];
}
/** Async runtime projection that resolves OpenClaw-managed MCP bearer tokens. */
async function buildCodexUserMcpServersThreadConfigPatchForRuntime(cfg, options) {
	let allowedServers = selectCodexProjectableMcpServers(cfg, options);
	if (options?.preparationOnly && Object.values(allowedServers).some(requiresMcpBearerProjection)) throw new Error("Native fork preparation cannot resolve MCP bearer credentials. Fork an original imported message instead.");
	if (options?.preparedNativeMcpPolicy) allowedServers = applyPreparedNativeMcpPolicy({ mcpServers: allowedServers }, options.preparedNativeMcpPolicy).mcpServers;
	if (Object.keys(allowedServers).length === 0) return;
	const grants = options?.agentId ? await loadMcpToolGrants(options.agentId) : [];
	const resolvedConfig = await resolveMcpBearerBundleConfig({
		config: { mcpServers: allowedServers },
		cfg,
		agentDir: options?.agentDir,
		tokenProjection: "literal",
		omitUnavailableOAuthServers: true,
		onServerUnavailable: options?.onServerUnavailable
	});
	const mcp_servers = Object.fromEntries(Object.entries(resolvedConfig.config.mcpServers).map(([name, server]) => [name, normalizeCodexMcpServerConfig(name, applyCodexSessionMcpToolDenials(name, server, options?.toolOverrides), grants)]));
	return Object.keys(mcp_servers).length === 0 ? void 0 : { mcp_servers };
}
/** Prepares canonical native MCP policy and projects it into Codex before thread creation. */
async function buildCodexUserMcpServersThreadConfigPatchForRun(params) {
	const run = params.run;
	const agentId = params.agentId ?? run.agentId;
	const scopedToolOverrides = resolveCodexMcpToolOverridesForAgent(run.config, {
		agentId,
		toolOverrides: run.toolOverrides
	});
	const policySessionKey = run.sandboxSessionKey ?? run.sessionKey;
	const policyAgentId = resolveSessionAgentId({
		config: run.config,
		sessionKey: policySessionKey,
		agentId: run.sandboxAgentId,
		fallbackAgentId: agentId
	});
	const sandboxStatus = resolveSandboxRuntimeStatus({
		cfg: run.config,
		sessionKey: policySessionKey,
		agentId: policyAgentId
	});
	const capabilityProfile = resolveConversationCapabilityProfile({
		config: run.config,
		sessionKey: policySessionKey,
		runSessionKey: run.sessionKey && run.sessionKey !== policySessionKey ? run.sessionKey : void 0,
		sessionId: run.sessionId,
		runId: run.runId,
		agentId: policyAgentId,
		agentDir: run.agentDir,
		agentAccountId: run.agentAccountId,
		messageProvider: run.messageProvider ?? run.messageChannel,
		messageChannel: run.messageChannel,
		chatType: run.chatType,
		messageTo: run.messageTo,
		messageThreadId: run.messageThreadId,
		currentChannelId: run.currentChannelId,
		currentMessagingTarget: run.currentMessagingTarget,
		currentThreadTs: run.currentThreadTs,
		currentMessageId: run.currentMessageId,
		groupId: run.groupId,
		groupChannel: run.groupChannel,
		groupSpace: run.groupSpace,
		memberRoleIds: run.memberRoleIds,
		spawnedBy: run.spawnedBy,
		senderId: run.senderId,
		senderName: run.senderName,
		senderUsername: run.senderUsername,
		senderE164: run.senderE164,
		senderIsOwner: run.senderIsOwner,
		modelProvider: run.provider,
		modelId: run.modelId,
		modelApi: run.model?.api,
		modelContextWindowTokens: run.model?.contextWindow,
		modelHasVision: run.model?.input?.includes("image") ?? false,
		workspaceDir: run.workspaceDir,
		cwd: params.cwd,
		skillsSnapshot: run.skillsSnapshot,
		sandboxToolPolicy: sandboxStatus.sandboxed ? sandboxStatus.toolPolicy : void 0,
		runtimeToolAllowlist: run.toolsAllow,
		inheritRuntimeToolAllowlist: true,
		runtimePluginToolGrant: run.runtimePluginToolGrant,
		inputProvenance: run.inputProvenance,
		trustedInternalHandoff: run.trustedInternalHandoff,
		scheduledToolPolicy: run.scheduledToolPolicy
	});
	const configuredMcpServers = selectCodexProjectableMcpServers(run.config, {
		agentId,
		allowLiteralOAuthProjection: params.allowLiteralOAuthProjection,
		onServerUnavailable: params.onServerUnavailable,
		toolOverrides: scopedToolOverrides
	});
	if (Object.keys(configuredMcpServers).length === 0) return;
	const projectionConfig = {
		...run.config,
		mcp: {
			...run.config?.mcp,
			servers: configuredMcpServers
		}
	};
	const acquisition = await acquireSessionMcpRuntime({
		sessionId: run.sessionId,
		sessionKey: run.sessionKey,
		workspaceDir: run.workspaceDir,
		agentDir: run.agentDir,
		cfg: projectionConfig,
		requesterSenderId: run.senderId,
		agentAccountId: run.agentAccountId,
		messageChannel: run.messageChannel,
		toolOverrides: scopedToolOverrides,
		toolDenylist: capabilityProfile.policy.explicitToolDenylist
	});
	let retainedServerNames;
	try {
		const preparedNativeMcpPolicy = await prepareNativeMcpPolicy({
			runtime: acquisition.runtime,
			config: run.config,
			workspaceDir: run.workspaceDir,
			capabilityProfile,
			runtimeToolsAllow: run.toolsAllow,
			warn: params.warn ?? (() => {})
		});
		const prepared = await buildCodexUserMcpServersThreadConfigPatchForRuntime(projectionConfig, {
			agentId,
			agentDir: run.agentDir,
			allowLiteralOAuthProjection: params.allowLiteralOAuthProjection,
			onServerUnavailable: params.onServerUnavailable,
			toolOverrides: scopedToolOverrides,
			preparedNativeMcpPolicy
		});
		retainedServerNames = new Set(Object.keys(prepared?.mcp_servers ?? {}));
		return prepared;
	} finally {
		await releaseSessionMcpRuntime(acquisition, retainedServerNames);
	}
}
//#endregion
export { applyPreparedNativeMcpPolicy as a, resolveCodexMcpToolOverridesForAgent as i, buildCodexUserMcpServersThreadConfigPatchForRuntime as n, prepareNativeMcpPolicy as o, injectCodexMcpConfigArgs as r, preparedNativeMcpDenials as s, buildCodexUserMcpServersThreadConfigPatchForRun as t };
