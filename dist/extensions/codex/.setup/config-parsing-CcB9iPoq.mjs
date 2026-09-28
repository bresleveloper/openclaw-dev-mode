import { i as normalizeCodexServiceTier, m as CODEX_PLUGIN_MARKETPLACE_NAME_PATTERN } from "./config-utils-DujwEnhg.mjs";
import { asNullableRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { z } from "zod";
import { buildSecretInputSchema } from "openclaw/plugin-sdk/secret-input";
import { detectWindowsSpawnCommandInlineArgs } from "openclaw/plugin-sdk/windows-spawn";
//#region extensions/codex/src/app-server/session-discovery-config.ts
const codexSessionCatalogHomeSchema = z.union([z.string().trim().min(1), z.object({
	path: z.string().trim().min(1),
	label: z.string().trim().min(1).optional()
}).strict()]);
const codexSessionCatalogConfigSchema = z.object({
	enabled: z.boolean().optional(),
	homes: z.array(codexSessionCatalogHomeSchema).optional()
}).strict();
const codexDiscoveryConfigSchema = z.object({
	enabled: z.boolean().optional(),
	timeoutMs: z.number().positive().optional()
}).strict();
//#endregion
//#region extensions/codex/src/app-server/config-parsing.ts
const DEFAULT_CODEX_COMPUTER_USE_PLUGIN_NAME = "computer-use";
const DEFAULT_CODEX_COMPUTER_USE_MCP_SERVER_NAME = "computer-use";
const DEFAULT_CODEX_COMPUTER_USE_MARKETPLACE_DISCOVERY_TIMEOUT_MS = 6e4;
const DEFAULT_CODEX_COMPUTER_USE_LIVE_TEST_TIMEOUT_MS = 6e4;
const DEFAULT_CODEX_COMPUTER_USE_TOOL_CALL_TIMEOUT_MS = 6e4;
const DEFAULT_CODEX_APP_SERVER_NETWORK_PROXY_PROFILE_PREFIX = "openclaw-network";
const codexAppServerTransportSchema = z.enum([
	"stdio",
	"websocket",
	"unix"
]);
const codexAppServerHomeScopeSchema = z.enum(["agent", "user"]);
const SecretInputSchema = buildSecretInputSchema();
const codexAppServerPolicyModeSchema = z.enum(["yolo", "guardian"]);
const codexAppServerApprovalPolicySchema = z.preprocess((value) => value === "on-failure" ? "on-request" : value, z.enum(["never", "on-request"]));
const codexAppServerSandboxSchema = z.enum([
	"read-only",
	"workspace-write",
	"danger-full-access"
]);
const codexAppServerApprovalsReviewerSchema = z.enum([
	"user",
	"auto_review",
	"guardian_subagent"
]);
const codexDynamicToolsLoadingSchema = z.enum(["searchable", "direct"]);
const codexComputerUseHealthIntervalSchema = z.union([
	z.literal(30),
	z.literal(60),
	z.literal(120),
	z.literal(240)
]);
const codexComputerUsePluginCacheModeSchema = z.enum(["shared", "independent"]);
const codexPluginDestructivePolicySchema = z.union([
	z.boolean(),
	z.literal("auto"),
	z.literal("ask")
]);
const codexAppServerServiceTierSchema = z.preprocess((value) => value === null ? null : normalizeCodexServiceTier(value), z.string().trim().min(1).nullable().optional()).optional();
const codexAppServerCyberFailoverSchema = z.object({
	mode: z.enum(["auto", "off"]).optional(),
	model: z.string().trim().min(1).optional(),
	cooloffMs: z.number().positive().optional()
}).strict();
const codexAppServerExperimentalSchema = z.object({ sandboxExecServer: z.boolean().optional() }).strict();
const codexAppServerRemoteWorkspaceRootSchema = z.string().trim().min(1);
const codexAppServerNetworkProxyDomainPermissionSchema = z.enum(["allow", "deny"]);
const codexAppServerNetworkProxyUnixSocketPermissionSchema = z.enum(["allow", "none"]);
const codexAppServerNetworkProxySchema = z.object({
	enabled: z.boolean().optional(),
	profileName: z.string().trim().min(1).optional(),
	baseProfile: z.enum(["read-only", "workspace"]).optional(),
	mode: z.enum(["limited", "full"]).optional(),
	domains: z.record(z.string(), codexAppServerNetworkProxyDomainPermissionSchema).optional(),
	unixSockets: z.record(z.string(), codexAppServerNetworkProxyUnixSocketPermissionSchema).optional(),
	proxyUrl: z.string().trim().min(1).optional(),
	socksUrl: z.string().trim().min(1).optional(),
	enableSocks5: z.boolean().optional(),
	enableSocks5Udp: z.boolean().optional(),
	allowUpstreamProxy: z.boolean().optional(),
	allowLocalBinding: z.boolean().optional(),
	dangerouslyAllowNonLoopbackProxy: z.boolean().optional(),
	dangerouslyAllowAllUnixSockets: z.boolean().optional()
}).strict();
const codexPluginEntryConfigSchema = z.object({
	enabled: z.boolean().optional(),
	marketplaceName: z.string().regex(CODEX_PLUGIN_MARKETPLACE_NAME_PATTERN).optional(),
	pluginName: z.string().trim().min(1).optional(),
	allow_destructive_actions: codexPluginDestructivePolicySchema.optional()
}).strict();
const codexPluginsConfigSchema = z.object({
	enabled: z.boolean().optional(),
	allow_all_plugins: z.boolean().optional(),
	allow_destructive_actions: codexPluginDestructivePolicySchema.optional(),
	plugins: z.record(z.string(), codexPluginEntryConfigSchema).optional()
}).strict();
const codexSupervisionEndpointSchema = z.union([z.object({
	id: z.string().optional(),
	label: z.string().optional(),
	transport: z.literal("stdio-proxy").optional(),
	command: z.string().optional(),
	args: z.array(z.string()).optional(),
	cwd: z.string().optional()
}).strict(), z.object({
	id: z.string().optional(),
	label: z.string().optional(),
	transport: z.literal("websocket"),
	url: z.string(),
	authTokenEnv: z.string().optional()
}).strict()]);
const codexSupervisionConfigSchema = z.object({
	enabled: z.boolean().optional(),
	endpoints: z.array(codexSupervisionEndpointSchema).optional(),
	allowRawTranscripts: z.boolean().optional(),
	allowWriteControls: z.boolean().optional()
}).strict();
const codexPluginConfigSchema = z.object({
	codexDynamicToolsLoading: codexDynamicToolsLoadingSchema.optional(),
	codexDynamicToolsExclude: z.array(z.string()).optional(),
	sessionCatalog: codexSessionCatalogConfigSchema.optional(),
	discovery: codexDiscoveryConfigSchema.optional(),
	computerUse: z.object({
		enabled: z.boolean().optional(),
		autoInstall: z.boolean().optional(),
		marketplaceDiscoveryTimeoutMs: z.number().positive().optional(),
		liveTestTimeoutMs: z.number().positive().optional(),
		toolCallTimeoutMs: z.number().positive().optional(),
		healthCheckEnabled: z.boolean().optional(),
		healthCheckIntervalMinutes: codexComputerUseHealthIntervalSchema.optional(),
		pluginCacheMode: codexComputerUsePluginCacheModeSchema.optional(),
		strictReadiness: z.boolean().optional(),
		autoRepair: z.boolean().optional(),
		marketplaceSource: z.string().optional(),
		marketplacePath: z.string().optional(),
		marketplaceName: z.string().optional(),
		pluginName: z.string().optional(),
		mcpServerName: z.string().optional()
	}).strict().optional(),
	codexPlugins: z.unknown().optional(),
	supervision: codexSupervisionConfigSchema.optional(),
	appServer: z.object({
		mode: codexAppServerPolicyModeSchema.optional(),
		transport: codexAppServerTransportSchema.optional(),
		homeScope: codexAppServerHomeScopeSchema.optional(),
		command: z.string().optional(),
		args: z.union([z.array(z.string()), z.string()]).optional(),
		url: z.string().optional(),
		authToken: SecretInputSchema.optional(),
		headers: z.record(z.string(), SecretInputSchema).optional(),
		clearEnv: z.array(z.string()).optional(),
		remoteWorkspaceRoot: codexAppServerRemoteWorkspaceRootSchema.optional(),
		codeModeOnly: z.boolean().optional(),
		loopDetectionPreToolUseRelay: z.boolean().optional(),
		requestTimeoutMs: z.number().positive().optional(),
		approvalPolicy: codexAppServerApprovalPolicySchema.optional(),
		sandbox: codexAppServerSandboxSchema.optional(),
		approvalsReviewer: codexAppServerApprovalsReviewerSchema.optional(),
		serviceTier: codexAppServerServiceTierSchema,
		cyberFailover: codexAppServerCyberFailoverSchema.optional(),
		networkProxy: codexAppServerNetworkProxySchema.optional(),
		defaultWorkspaceDir: z.string().optional(),
		experimental: codexAppServerExperimentalSchema.optional()
	}).strict().optional()
}).strict();
function readCodexPluginConfig(value) {
	if (asNullableRecord(asNullableRecord(value)?.appServer)?.approvalPolicy === "untrusted") throw new Error("plugins.entries.codex.config.appServer.approvalPolicy=\"untrusted\" is retired; run \"openclaw doctor --fix\" to migrate it to \"on-request\".");
	const parsed = codexPluginConfigSchema.safeParse(value);
	if (!parsed.success) return {};
	const { codexPlugins: rawCodexPlugins, ...config } = parsed.data;
	const plugins = codexPluginsConfigSchema.safeParse(rawCodexPlugins);
	if (!plugins.success) return config;
	return {
		...config,
		...plugins.data ? { codexPlugins: plugins.data } : {}
	};
}
function isCodexSandboxExecServerEnabled(pluginConfig, sandbox) {
	return isCodexRemoteExecPlacementSandbox(sandbox) || readCodexPluginConfig(pluginConfig).appServer?.experimental?.sandboxExecServer === true;
}
function isCodexRemoteExecPlacementSandbox(sandbox) {
	return typeof sandbox === "object" && sandbox !== null && "placementExecutionMode" in sandbox && sandbox.placementExecutionMode === "remote-exec";
}
function isCodexPairedNodeRemoteExecPlacementSandbox(sandbox) {
	return isCodexRemoteExecPlacementSandbox(sandbox) && typeof sandbox === "object" && sandbox !== null && "placementNodeId" in sandbox && typeof sandbox.placementNodeId === "string" && sandbox.placementNodeId.length > 0;
}
function assertCodexAppServerCommandHasNoInlineArgs(params) {
	const inlineArgs = detectWindowsSpawnCommandInlineArgs(params.command);
	if (!inlineArgs) return;
	const sourceLabel = params.source === "env" ? "OPENCLAW_CODEX_APP_SERVER_BIN" : "plugins.entries.codex.config.appServer.command";
	const argsLabel = params.source === "env" ? "OPENCLAW_CODEX_APP_SERVER_ARGS" : "plugins.entries.codex.config.appServer.args";
	throw new Error(`${sourceLabel} must be only the Codex app-server executable path; "${inlineArgs.executable}" was configured with inline arguments "${inlineArgs.arguments}". Move those arguments to ${argsLabel}, or remove the override to use the managed Codex startup path.`);
}
function resolveCodexPluginsPolicy(pluginConfig) {
	const config = readCodexPluginConfig(pluginConfig).codexPlugins;
	const configured = config !== void 0;
	const enabled = config?.enabled === true;
	const destructivePolicy = resolveCodexPluginDestructivePolicy(config?.allow_destructive_actions ?? true);
	const pluginPolicies = Object.entries(config?.plugins ?? {}).flatMap(([configKey, entry]) => {
		if (!isCodexPluginMarketplaceName(entry.marketplaceName) || !entry.pluginName) return [];
		const entryDestructivePolicy = resolveCodexPluginDestructivePolicy(entry.allow_destructive_actions ?? config?.allow_destructive_actions ?? true);
		return [{
			configKey,
			marketplaceName: entry.marketplaceName,
			pluginName: entry.pluginName,
			enabled: enabled && entry.enabled !== false,
			allowDestructiveActions: entryDestructivePolicy.allowDestructiveActions,
			destructiveApprovalMode: entryDestructivePolicy.destructiveApprovalMode
		}];
	}).toSorted((left, right) => left.configKey.localeCompare(right.configKey));
	return {
		configured,
		enabled,
		allowAllPlugins: enabled && config?.allow_all_plugins === true,
		allowDestructiveActions: destructivePolicy.allowDestructiveActions,
		destructiveApprovalMode: destructivePolicy.destructiveApprovalMode,
		pluginPolicies
	};
}
function isCodexPluginMarketplaceName(value) {
	return typeof value === "string" && CODEX_PLUGIN_MARKETPLACE_NAME_PATTERN.test(value);
}
function resolveCodexPluginDestructivePolicy(policy) {
	if (policy === "auto" || policy === "ask") return {
		allowDestructiveActions: true,
		destructiveApprovalMode: policy
	};
	return {
		allowDestructiveActions: policy,
		destructiveApprovalMode: policy ? "allow" : "deny"
	};
}
//#endregion
export { DEFAULT_CODEX_COMPUTER_USE_PLUGIN_NAME as a, isCodexPairedNodeRemoteExecPlacementSandbox as c, readCodexPluginConfig as d, resolveCodexPluginsPolicy as f, DEFAULT_CODEX_COMPUTER_USE_MCP_SERVER_NAME as i, isCodexRemoteExecPlacementSandbox as l, DEFAULT_CODEX_COMPUTER_USE_LIVE_TEST_TIMEOUT_MS as n, DEFAULT_CODEX_COMPUTER_USE_TOOL_CALL_TIMEOUT_MS as o, DEFAULT_CODEX_COMPUTER_USE_MARKETPLACE_DISCOVERY_TIMEOUT_MS as r, assertCodexAppServerCommandHasNoInlineArgs as s, DEFAULT_CODEX_APP_SERVER_NETWORK_PROXY_PROFILE_PREFIX as t, isCodexSandboxExecServerEnabled as u };
