import { A as resolvePositiveTimerTimeoutMs } from "./number-coercion-CJQ8TR--.js";
import { d as normalizeTrimmedStringList } from "./string-normalization-CRyoFBPt.js";
import { f as normalizeResolvedSecretInputString } from "./types.secrets-OocW4TQ1.js";
import { u as normalizeAgentId } from "./session-key-VWT_xzM9.js";
import { An as preprocess, At as boolean, Et as array, Nn as record, Rn as string, Tn as object, Xn as union, Zn as unknown, dn as literal, wn as number, yt as _enum } from "./schemas-CBJjibl3.js";
import { r as resolveProviderIdForAuth } from "./provider-auth-aliases-BMy8GnRz.js";
import { n as detectWindowsSpawnCommandInlineArgs } from "./windows-spawn-C5RDaB22.js";
import { B as resolveExecApprovalsFromFile } from "./exec-approvals-BIKWP8_V.js";
import "./number-runtime-DBLVDypr.js";
import "./string-coerce-runtime-ZbuYDJgZ.js";
import "./routing-D2F-kIi9.js";
import { r as buildSecretInputSchema } from "./secret-input-Beb5fGfL.js";
import "./exec-approvals-runtime-CG1ihcHH.js";
import "./agent-runtime-CjR-oxBM.js";
import { readFileSync } from "node:fs";
import path from "node:path";
import { homedir, hostname } from "node:os";
import { createHash, createHmac, randomBytes } from "node:crypto";
//#region extensions/codex/src/app-server/config.ts
const START_OPTIONS_KEY_SECRET_SYMBOL = Symbol.for("openclaw.codexAppServerStartOptionsKeySecret");
const START_OPTIONS_KEY_SECRET = getStartOptionsKeySecret();
const UNIX_CODEX_REQUIREMENTS_PATH = "/etc/codex/requirements.toml";
const WINDOWS_CODEX_REQUIREMENTS_SUFFIX = "\\OpenAI\\Codex\\requirements.toml";
const CODEX_APP_SERVER_HOME_DIRNAME = "codex-home";
const CODEX_CONFIG_TOML_FILENAME = "config.toml";
const PLAIN_DECIMAL_NUMBER_RE = /^[+-]?(?:(?:\d+\.?\d*)|(?:\.\d+))$/;
const CODEX_PLUGINS_MARKETPLACE_NAME = "openai-curated";
function shouldAutoApproveCodexAppServerApprovals(appServer) {
	return appServer.networkProxy === void 0 && appServer.approvalPolicy === "never" && appServer.sandbox === "danger-full-access";
}
const DEFAULT_CODEX_COMPUTER_USE_PLUGIN_NAME = "computer-use";
const DEFAULT_CODEX_COMPUTER_USE_MCP_SERVER_NAME = "computer-use";
const DEFAULT_CODEX_COMPUTER_USE_MARKETPLACE_DISCOVERY_TIMEOUT_MS = 6e4;
const DEFAULT_CODEX_APP_SERVER_NETWORK_PROXY_PROFILE_PREFIX = "openclaw-network";
const codexAppServerTransportSchema = _enum(["stdio", "websocket"]);
const codexAppServerHomeScopeSchema = _enum(["agent", "user"]);
const SecretInputSchema = buildSecretInputSchema();
const codexAppServerPolicyModeSchema = _enum(["yolo", "guardian"]);
const codexAppServerApprovalPolicySchema = preprocess((value) => value === "on-failure" ? "on-request" : value, _enum([
	"never",
	"on-request",
	"untrusted"
]));
const codexAppServerSandboxSchema = _enum([
	"read-only",
	"workspace-write",
	"danger-full-access"
]);
const codexAppServerApprovalsReviewerSchema = _enum([
	"user",
	"auto_review",
	"guardian_subagent"
]);
const codexDynamicToolsLoadingSchema = _enum(["searchable", "direct"]);
const codexPluginDestructivePolicySchema = union([
	boolean(),
	literal("auto"),
	literal("ask")
]);
const codexAppServerServiceTierSchema = preprocess((value) => value === null ? null : normalizeCodexServiceTier(value), string().trim().min(1).nullable().optional()).optional();
const codexAppServerExperimentalSchema = object({ sandboxExecServer: boolean().optional() }).strict();
const codexAppServerRemoteWorkspaceRootSchema = string().trim().min(1);
const codexAppServerNetworkProxyDomainPermissionSchema = _enum(["allow", "deny"]);
const codexAppServerNetworkProxyUnixSocketPermissionSchema = _enum(["allow", "none"]);
const codexAppServerNetworkProxySchema = object({
	enabled: boolean().optional(),
	profileName: string().trim().min(1).optional(),
	baseProfile: _enum(["read-only", "workspace"]).optional(),
	mode: _enum(["limited", "full"]).optional(),
	domains: record(string(), codexAppServerNetworkProxyDomainPermissionSchema).optional(),
	unixSockets: record(string(), codexAppServerNetworkProxyUnixSocketPermissionSchema).optional(),
	proxyUrl: string().trim().min(1).optional(),
	socksUrl: string().trim().min(1).optional(),
	enableSocks5: boolean().optional(),
	enableSocks5Udp: boolean().optional(),
	allowUpstreamProxy: boolean().optional(),
	allowLocalBinding: boolean().optional(),
	dangerouslyAllowNonLoopbackProxy: boolean().optional(),
	dangerouslyAllowAllUnixSockets: boolean().optional()
}).strict();
const codexPluginEntryConfigSchema = object({
	enabled: boolean().optional(),
	marketplaceName: literal(CODEX_PLUGINS_MARKETPLACE_NAME).optional(),
	pluginName: string().trim().min(1).optional(),
	allow_destructive_actions: codexPluginDestructivePolicySchema.optional()
}).strict();
const codexPluginsConfigSchema = object({
	enabled: boolean().optional(),
	allow_all_plugins: boolean().optional(),
	allow_destructive_actions: codexPluginDestructivePolicySchema.optional(),
	plugins: record(string(), codexPluginEntryConfigSchema).optional()
}).strict();
const codexPluginConfigSchema = object({
	codexDynamicToolsLoading: codexDynamicToolsLoadingSchema.optional(),
	codexDynamicToolsExclude: array(string()).optional(),
	discovery: object({
		enabled: boolean().optional(),
		timeoutMs: number().positive().optional()
	}).strict().optional(),
	computerUse: object({
		enabled: boolean().optional(),
		autoInstall: boolean().optional(),
		marketplaceDiscoveryTimeoutMs: number().positive().optional(),
		marketplaceSource: string().optional(),
		marketplacePath: string().optional(),
		marketplaceName: string().optional(),
		pluginName: string().optional(),
		mcpServerName: string().optional()
	}).strict().optional(),
	codexPlugins: unknown().optional(),
	appServer: object({
		mode: codexAppServerPolicyModeSchema.optional(),
		transport: codexAppServerTransportSchema.optional(),
		homeScope: codexAppServerHomeScopeSchema.optional(),
		command: string().optional(),
		args: union([array(string()), string()]).optional(),
		url: string().optional(),
		authToken: SecretInputSchema.optional(),
		headers: record(string(), SecretInputSchema).optional(),
		clearEnv: array(string()).optional(),
		remoteWorkspaceRoot: codexAppServerRemoteWorkspaceRootSchema.optional(),
		codeModeOnly: boolean().optional(),
		requestTimeoutMs: number().positive().optional(),
		turnCompletionIdleTimeoutMs: number().positive().optional(),
		postToolRawAssistantCompletionIdleTimeoutMs: number().positive().optional(),
		approvalPolicy: codexAppServerApprovalPolicySchema.optional(),
		sandbox: codexAppServerSandboxSchema.optional(),
		approvalsReviewer: codexAppServerApprovalsReviewerSchema.optional(),
		serviceTier: codexAppServerServiceTierSchema,
		networkProxy: codexAppServerNetworkProxySchema.optional(),
		defaultWorkspaceDir: string().optional(),
		experimental: codexAppServerExperimentalSchema.optional()
	}).strict().optional()
}).strict();
function readCodexPluginConfig(value) {
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
function isCodexSandboxExecServerEnabled(pluginConfig) {
	return readCodexPluginConfig(pluginConfig).appServer?.experimental?.sandboxExecServer === true;
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
		if (entry.marketplaceName !== "openai-curated" || !entry.pluginName) return [];
		const entryDestructivePolicy = resolveCodexPluginDestructivePolicy(entry.allow_destructive_actions ?? config?.allow_destructive_actions ?? true);
		return [{
			configKey,
			marketplaceName: CODEX_PLUGINS_MARKETPLACE_NAME,
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
function resolveCodexAppServerRuntimeOptions(params = {}) {
	const env = params.env ?? process.env;
	const config = readCodexPluginConfig(params.pluginConfig).appServer ?? {};
	const transport = resolveTransport(config.transport);
	const homeScope = config.homeScope === "user" ? "user" : "agent";
	const configCommand = readNonEmptyString(config.command);
	const envCommand = readNonEmptyString(env.OPENCLAW_CODEX_APP_SERVER_BIN);
	const command = configCommand ?? envCommand ?? "codex";
	const commandSource = configCommand ? "config" : envCommand ? "env" : "managed";
	if (commandSource === "config" || commandSource === "env") assertCodexAppServerCommandHasNoInlineArgs({
		command,
		source: commandSource
	});
	const args = resolveArgs(config.args, env.OPENCLAW_CODEX_APP_SERVER_ARGS);
	const headers = normalizeHeaders(config.headers);
	const clearEnv = normalizeStringList(config.clearEnv);
	const authToken = normalizeCodexAppServerSecretInput({
		value: config.authToken,
		path: "plugins.entries.codex.config.appServer.authToken"
	});
	const url = readNonEmptyString(config.url);
	const connectionClass = inferCodexAppServerConnectionClass({
		transport,
		url
	});
	const remoteAppsSubstrate = "preconfigured";
	const remoteWorkspaceRoot = normalizeRemoteWorkspaceRoot(config.remoteWorkspaceRoot);
	const execMode = resolveEffectiveOpenClawExecModeForCodexAppServer({
		execMode: params.execMode,
		execPolicy: params.execPolicy
	});
	assertCodexAppServerAllowedForOpenClawExecMode(execMode);
	const explicitPolicyMode = resolvePolicyMode(config.mode) ?? resolvePolicyMode(env.OPENCLAW_CODEX_APP_SERVER_MODE);
	const configuredSandbox = resolveSandbox(config.sandbox) ?? resolveSandbox(env.OPENCLAW_CODEX_APP_SERVER_SANDBOX);
	const explicitApprovalsReviewer = resolveApprovalsReviewer(config.approvalsReviewer);
	const normalizedPolicyMode = resolveCodexPolicyModeForOpenClawExecMode(execMode);
	const ignoreLegacyYoloPolicyMode = normalizedPolicyMode === "guardian" && explicitPolicyMode === "yolo";
	const canUseModelBackedReviewer = canUseCodexModelBackedApprovalsReviewerForModel({
		modelProvider: params.modelProvider,
		model: params.model,
		config: params.config,
		env,
		agentDir: params.agentDir,
		codexConfigToml: params.codexConfigToml,
		homeScope
	});
	const forceUserReviewer = !canUseModelBackedReviewer && (explicitApprovalsReviewer === "auto_review" || explicitApprovalsReviewer === "guardian_subagent" || explicitPolicyMode === "guardian" && explicitApprovalsReviewer !== "user") || execMode !== void 0 && execMode !== "full" && (execMode !== "auto" || !canUseModelBackedReviewer);
	const forceGuardianReviewer = execMode === "auto" && canUseModelBackedReviewer;
	const execModeRequiringPromptingApprovals = execMode === "auto" || execMode === "ask" ? execMode : forceUserReviewer ? "ask" : void 0;
	const forceDangerFullAccessSandbox = params.execPolicy?.touched === true && params.execPolicy.security === "full" && params.execPolicy.ask === "always";
	const forceRuntimePolicy = forceUserReviewer || forceGuardianReviewer || forceDangerFullAccessSandbox;
	const defaultPolicy = explicitPolicyMode && !forceRuntimePolicy && !ignoreLegacyYoloPolicyMode ? void 0 : resolveDefaultCodexAppServerPolicy({
		transport,
		env,
		forceGuardian: normalizedPolicyMode === "guardian",
		forceUserReviewer: forceUserReviewer || !canUseModelBackedReviewer,
		execModeRequiringPromptingApprovals,
		requirementsToml: params.requirementsToml,
		requirementsPath: params.requirementsPath,
		readRequirementsFile: params.readRequirementsFile,
		platform: params.platform,
		hostName: params.hostName,
		execModeRequiringUserReviewer: forceUserReviewer ? execMode : void 0
	});
	const preserveExplicitAutoSandbox = forceGuardianReviewer && configuredSandbox === "read-only";
	const forcedPolicy = forceRuntimePolicy ? {
		approvalPolicy: defaultPolicy?.approvalPolicy ?? "on-request",
		sandbox: preserveExplicitAutoSandbox ? void 0 : forceDangerFullAccessSandbox ? selectForcedDangerFullAccessSandbox({
			configuredSandbox,
			defaultPolicy,
			openClawSandboxActive: Boolean(params.openClawSandboxActive)
		}) : selectForcedPromptingSandbox({
			configuredSandbox,
			defaultSandbox: defaultPolicy?.sandbox
		}),
		approvalsReviewer: defaultPolicy?.approvalsReviewer ?? (forceUserReviewer ? "user" : "auto_review")
	} : void 0;
	const policyMode = ignoreLegacyYoloPolicyMode ? normalizedPolicyMode : explicitPolicyMode ?? normalizedPolicyMode ?? defaultPolicy?.mode ?? "yolo";
	const serviceTier = normalizeCodexServiceTier(config.serviceTier);
	const resolvedSandbox = forcedPolicy?.sandbox ?? configuredSandbox ?? defaultPolicy?.sandbox ?? (policyMode === "guardian" ? "workspace-write" : "danger-full-access");
	if (transport === "websocket" && !url) throw new Error("plugins.entries.codex.config.appServer.url is required when appServer.transport is websocket");
	if (transport === "websocket" && homeScope === "user") throw new Error("plugins.entries.codex.config.appServer.homeScope=user requires appServer.transport=stdio");
	assertCodexAppServerConnectionClassConfig({
		connectionClass,
		authToken,
		headers
	});
	const configApprovalPolicy = resolveApprovalPolicy(config.approvalPolicy);
	const envApprovalPolicy = resolveApprovalPolicy(env.OPENCLAW_CODEX_APP_SERVER_APPROVAL_POLICY);
	const approvalPolicy = configApprovalPolicy ?? envApprovalPolicy ?? defaultPolicy?.approvalPolicy ?? (policyMode === "guardian" ? "on-request" : "never");
	const approvalPolicySource = configApprovalPolicy ? "config" : envApprovalPolicy ? "env" : defaultPolicy?.approvalPolicy ? "requirements" : "implicit";
	return {
		start: {
			transport,
			homeScope,
			command,
			commandSource,
			args: args.length > 0 ? args : [
				"app-server",
				"--listen",
				"stdio://"
			],
			...url ? { url } : {},
			...authToken ? { authToken } : {},
			headers,
			...transport === "stdio" && clearEnv.length > 0 ? { clearEnv } : {}
		},
		connectionClass,
		remoteAppsSubstrate,
		...remoteWorkspaceRoot ? { remoteWorkspaceRoot } : {},
		codeModeOnly: config.codeModeOnly === true,
		requestTimeoutMs: normalizePositiveNumber(config.requestTimeoutMs, 6e4),
		turnCompletionIdleTimeoutMs: normalizePositiveNumber(config.turnCompletionIdleTimeoutMs, 6e4),
		...config.postToolRawAssistantCompletionIdleTimeoutMs !== void 0 ? { postToolRawAssistantCompletionIdleTimeoutMs: normalizePositiveNumber(config.postToolRawAssistantCompletionIdleTimeoutMs, 6e4) } : {},
		approvalPolicy: forcedPolicy?.approvalPolicy ?? approvalPolicy,
		approvalPolicySource,
		sandbox: resolvedSandbox,
		approvalsReviewer: forcedPolicy?.approvalsReviewer ?? explicitApprovalsReviewer ?? defaultPolicy?.approvalsReviewer ?? (policyMode === "guardian" ? "auto_review" : "user"),
		...serviceTier ? { serviceTier } : {},
		...resolveCodexAppServerNetworkProxy(config.networkProxy, resolvedSandbox)
	};
}
function isCodexAppServerApprovalPolicyAllowedByRequirements(policy, params = {}) {
	const content = readCodexRequirementsToml(params);
	if (content === void 0) return true;
	const allowedApprovalPolicies = parseAllowedApprovalPoliciesFromCodexRequirements(content);
	return allowedApprovalPolicies === void 0 || allowedApprovalPolicies.has(policy);
}
function canUseCodexModelBackedApprovalsReviewerForModel(params) {
	const explicitProvider = params.modelProvider?.trim().toLowerCase();
	const inferredProvider = inferProviderFromModelRef(params.model);
	if (explicitProvider && explicitProvider !== "codex") return isTrustedCodexModelBackedApprovalsReviewerProvider(explicitProvider, params) && (inferredProvider === void 0 || isTrustedCodexModelBackedApprovalsReviewerProvider(inferredProvider, params));
	if (inferredProvider !== void 0) return isTrustedCodexModelBackedApprovalsReviewerProvider(inferredProvider, params);
	return isTrustedCodexModelBackedApprovalsReviewerProvider(explicitProvider, params);
}
function isTrustedCodexModelBackedOpenAIProvider(params) {
	if (!openAIBaseUrlEnvOverridesAreTrustedForModelBackedReview(params.env)) return false;
	const codexBaseUrlOverrides = readCodexBaseUrlOverridesForModelBackedReview(params);
	if (codexBaseUrlOverrides === false || !codexBaseUrlOverrides.openAI.every(isNativeOpenAIBaseUrl) || !codexBaseUrlOverrides.chatGPT.every(isNativeChatGPTBaseUrl)) return false;
	const openAIProviders = readConfiguredOpenAIProvidersForModelBackedReview(params.config);
	if (openAIProviders.length === 0) return true;
	return openAIProviders.every((openAIProvider) => configuredOpenAIProviderIsTrustedForModelBackedReview(openAIProvider, params.model));
}
function resolveCodexModelBackedReviewerPolicyContext(params) {
	const provider = params.provider?.trim();
	if (provider && provider.toLowerCase() !== "codex") return {
		modelProvider: normalizeCodexModelBackedReviewerPolicyProvider(provider),
		model: params.model
	};
	const bindingModelProvider = params.bindingModelProvider?.trim();
	const currentModel = params.model?.trim();
	const bindingModel = params.bindingModel?.trim();
	if (bindingModelProvider && currentModel && bindingModel && currentModel === bindingModel) return {
		modelProvider: normalizeCodexModelBackedReviewerPolicyProvider(bindingModelProvider),
		model: params.model ?? params.bindingModel
	};
	const currentModelProvider = inferProviderFromModelRef(params.model);
	if (currentModelProvider) return {
		modelProvider: normalizeCodexModelBackedReviewerPolicyProvider(currentModelProvider),
		model: params.model
	};
	if (bindingModelProvider) return {
		modelProvider: normalizeCodexModelBackedReviewerPolicyProvider(bindingModelProvider),
		model: params.model ?? params.bindingModel
	};
	return {
		modelProvider: params.nativeAuthProfile === true ? "openai" : void 0,
		model: params.model ?? params.bindingModel
	};
}
function resolveCodexComputerUseConfig(params = {}) {
	const env = params.env ?? process.env;
	const config = readCodexPluginConfig(params.pluginConfig).computerUse ?? {};
	const marketplaceSource = readNonEmptyString(params.overrides?.marketplaceSource) ?? readNonEmptyString(config.marketplaceSource) ?? readNonEmptyString(env.OPENCLAW_CODEX_COMPUTER_USE_MARKETPLACE_SOURCE);
	const marketplacePath = readNonEmptyString(params.overrides?.marketplacePath) ?? readNonEmptyString(config.marketplacePath) ?? readNonEmptyString(env.OPENCLAW_CODEX_COMPUTER_USE_MARKETPLACE_PATH);
	const marketplaceName = readNonEmptyString(params.overrides?.marketplaceName) ?? readNonEmptyString(config.marketplaceName) ?? readNonEmptyString(env.OPENCLAW_CODEX_COMPUTER_USE_MARKETPLACE_NAME);
	const autoInstall = params.overrides?.autoInstall ?? config.autoInstall ?? readBooleanEnv(env.OPENCLAW_CODEX_COMPUTER_USE_AUTO_INSTALL) ?? false;
	const marketplaceDiscoveryTimeoutMs = normalizePositiveNumber(params.overrides?.marketplaceDiscoveryTimeoutMs ?? config.marketplaceDiscoveryTimeoutMs ?? readNumberEnv(env.OPENCLAW_CODEX_COMPUTER_USE_MARKETPLACE_DISCOVERY_TIMEOUT_MS), DEFAULT_CODEX_COMPUTER_USE_MARKETPLACE_DISCOVERY_TIMEOUT_MS);
	return {
		enabled: params.overrides?.enabled ?? config.enabled ?? readBooleanEnv(env.OPENCLAW_CODEX_COMPUTER_USE) ?? Boolean(autoInstall || marketplaceSource || marketplacePath || marketplaceName),
		autoInstall,
		marketplaceDiscoveryTimeoutMs,
		pluginName: readNonEmptyString(params.overrides?.pluginName) ?? readNonEmptyString(config.pluginName) ?? readNonEmptyString(env.OPENCLAW_CODEX_COMPUTER_USE_PLUGIN_NAME) ?? DEFAULT_CODEX_COMPUTER_USE_PLUGIN_NAME,
		mcpServerName: readNonEmptyString(params.overrides?.mcpServerName) ?? readNonEmptyString(config.mcpServerName) ?? readNonEmptyString(env.OPENCLAW_CODEX_COMPUTER_USE_MCP_SERVER_NAME) ?? DEFAULT_CODEX_COMPUTER_USE_MCP_SERVER_NAME,
		...marketplaceSource ? { marketplaceSource } : {},
		...marketplacePath ? { marketplacePath } : {},
		...marketplaceName ? { marketplaceName } : {}
	};
}
function codexAppServerStartOptionsKey(options, params = {}) {
	return JSON.stringify({
		transport: options.transport,
		command: options.command,
		commandSource: options.commandSource ?? null,
		managedFallbackCommandPaths: [...options.managedFallbackCommandPaths ?? []],
		args: options.args,
		url: options.url ?? null,
		authToken: hashSecretForKey(options.authToken, "authToken"),
		headers: Object.entries(options.headers).toSorted(([left], [right]) => left.localeCompare(right)).map(([key, value]) => [key, hashSecretForKey(value, `header:${key}`)]),
		env: Object.entries(options.env ?? {}).toSorted(([left], [right]) => left.localeCompare(right)).map(([key, value]) => [key, hashSecretForKey(value, `env:${key}`)]),
		clearEnv: [...options.clearEnv ?? []].toSorted(),
		authProfileId: params.authProfileId ?? null,
		agentDir: params.agentDir ?? null,
		fallbackApiKeyCacheKey: params.fallbackApiKeyCacheKey ?? null
	});
}
function codexSandboxPolicyForTurn(mode, cwd) {
	if (mode === "danger-full-access") return { type: "dangerFullAccess" };
	if (mode === "read-only") return {
		type: "readOnly",
		networkAccess: false
	};
	return {
		type: "workspaceWrite",
		writableRoots: [cwd],
		networkAccess: false,
		excludeTmpdirEnvVar: false,
		excludeSlashTmp: false
	};
}
function resolveCodexAppServerNetworkProxy(config, sandbox) {
	if (config?.enabled !== true) return {};
	const fileSystemMode = config.baseProfile === "read-only" || !config.baseProfile && sandbox === "read-only" ? "read" : "write";
	const networkConfig = removeUndefinedJsonFields({
		enabled: true,
		mode: config.mode,
		domains: normalizeNetworkProxyPermissionMap(config.domains),
		unix_sockets: normalizeNetworkProxyPermissionMap(config.unixSockets),
		proxy_url: readNonEmptyString(config.proxyUrl),
		socks_url: readNonEmptyString(config.socksUrl),
		enable_socks5: config.enableSocks5,
		enable_socks5_udp: config.enableSocks5Udp,
		allow_upstream_proxy: config.allowUpstreamProxy,
		allow_local_binding: config.allowLocalBinding,
		dangerously_allow_non_loopback_proxy: config.dangerouslyAllowNonLoopbackProxy,
		dangerously_allow_all_unix_sockets: config.dangerouslyAllowAllUnixSockets
	});
	const profile = {
		filesystem: {
			":minimal": "read",
			":project_roots": { ".": fileSystemMode }
		},
		network: networkConfig
	};
	const profileName = resolveNetworkProxyPermissionProfileName(config, profile);
	const configPatch = {
		"features.network_proxy.enabled": true,
		default_permissions: profileName,
		permissions: { [profileName]: profile }
	};
	return { networkProxy: {
		profileName,
		configFingerprint: fingerprintCodexAppServerNetworkProxyConfigPatch(configPatch),
		configPatch
	} };
}
function resolveNetworkProxyPermissionProfileName(config, profile) {
	const explicitProfileName = readNonEmptyString(config.profileName);
	if (explicitProfileName) return explicitProfileName;
	const suffix = createHash("sha256").update(stableStringifyJson({
		version: 1,
		profile
	})).digest("hex").slice(0, 16);
	return `${DEFAULT_CODEX_APP_SERVER_NETWORK_PROXY_PROFILE_PREFIX}-${suffix}`;
}
function fingerprintCodexAppServerNetworkProxyConfigPatch(configPatch) {
	return createHash("sha256").update(stableStringifyJson(configPatch)).digest("hex");
}
function normalizeNetworkProxyPermissionMap(value) {
	const entries = Object.entries(value ?? {}).map(([key, permission]) => [key.trim(), permission]).filter(([key]) => key.length > 0);
	return entries.length > 0 ? Object.fromEntries(entries) : void 0;
}
function removeUndefinedJsonFields(value) {
	return Object.fromEntries(Object.entries(value).filter((entry) => entry[1] !== void 0));
}
function stableStringifyJson(value) {
	if (Array.isArray(value)) return `[${value.map((item) => stableStringifyJson(item)).join(",")}]`;
	if (value && typeof value === "object") return `{${Object.entries(value).toSorted(([left], [right]) => left.localeCompare(right)).map(([key, item]) => `${JSON.stringify(key)}:${stableStringifyJson(item)}`).join(",")}}`;
	return JSON.stringify(value);
}
function withMcpElicitationsApprovalPolicy(policy) {
	if (typeof policy !== "string") return { granular: {
		...policy.granular,
		mcp_elicitations: true
	} };
	if (policy === "never") return { granular: {
		mcp_elicitations: true,
		rules: false,
		sandbox_approval: false,
		request_permissions: false,
		skill_approval: false
	} };
	return { granular: {
		mcp_elicitations: true,
		rules: true,
		sandbox_approval: true,
		request_permissions: true,
		skill_approval: true
	} };
}
function resolveTransport(value) {
	return value === "websocket" ? "websocket" : "stdio";
}
function normalizeRemoteWorkspaceRoot(value) {
	return readNonEmptyString(value);
}
function inferCodexAppServerConnectionClass(params) {
	if (params.transport !== "websocket") return "local-loopback";
	return params.url && isLoopbackWebSocketUrl(params.url) ? "local-loopback" : "remote";
}
function assertCodexAppServerConnectionClassConfig(params) {
	if (params.connectionClass === "remote" && !hasIdentityBearingWebSocketAuth({
		authToken: params.authToken,
		headers: params.headers
	})) throw new Error("remote Codex app-server WebSocket URLs require appServer.authToken or an Authorization header");
}
function isLoopbackWebSocketUrl(value) {
	let parsed;
	try {
		parsed = new URL(value);
	} catch {
		return false;
	}
	if (parsed.protocol !== "ws:" && parsed.protocol !== "wss:") return false;
	const host = parsed.hostname.toLowerCase();
	return host === "localhost" || host === "127.0.0.1" || host === "::1" || host === "[::1]" || host.startsWith("127.");
}
function hasIdentityBearingWebSocketAuth(params) {
	if (readNonEmptyString(params.authToken)) return true;
	return Object.entries(params.headers).some(([key, value]) => key.trim().toLowerCase() === "authorization" && Boolean(readNonEmptyString(value)));
}
function resolvePolicyMode(value) {
	return value === "guardian" || value === "yolo" ? value : void 0;
}
function resolveDefaultCodexAppServerPolicy(params) {
	if (params.transport !== "stdio") return {
		mode: "yolo",
		dangerFullAccessAllowed: true
	};
	const content = readCodexRequirementsToml(params);
	if (content === void 0) {
		if (!params.forceGuardian) return {
			mode: "yolo",
			dangerFullAccessAllowed: true
		};
		return {
			mode: "guardian",
			dangerFullAccessAllowed: true,
			approvalPolicy: selectGuardianApprovalPolicy(void 0, params.execModeRequiringPromptingApprovals),
			approvalsReviewer: params.forceUserReviewer ? selectUserApprovalsReviewer(void 0, params.execModeRequiringUserReviewer) : selectGuardianApprovalsReviewer(void 0, params.execModeRequiringPromptingApprovals === "auto" ? "auto" : void 0),
			sandbox: selectGuardianSandbox(void 0)
		};
	}
	const allowedSandboxModes = parseAllowedSandboxModesFromCodexRequirements(content, readNonEmptyString(params.hostName) ?? hostname());
	const allowedApprovalPolicies = parseAllowedApprovalPoliciesFromCodexRequirements(content);
	const allowedApprovalsReviewers = parseAllowedApprovalsReviewersFromCodexRequirements(content);
	const yoloSandboxAllowed = allowedSandboxModes === void 0 || allowedSandboxModes.has("danger-full-access");
	const yoloApprovalAllowed = allowedApprovalPolicies === void 0 || allowedApprovalPolicies.has("never");
	const yoloReviewerAllowed = allowedApprovalsReviewers === void 0 || allowedApprovalsReviewers.has("user");
	if (!params.forceGuardian && yoloSandboxAllowed && yoloApprovalAllowed && yoloReviewerAllowed) return {
		mode: "yolo",
		dangerFullAccessAllowed: true
	};
	return {
		mode: "guardian",
		dangerFullAccessAllowed: yoloSandboxAllowed,
		approvalPolicy: selectGuardianApprovalPolicy(allowedApprovalPolicies, params.execModeRequiringPromptingApprovals),
		approvalsReviewer: params.forceUserReviewer ? selectUserApprovalsReviewer(allowedApprovalsReviewers, params.execModeRequiringUserReviewer) : selectGuardianApprovalsReviewer(allowedApprovalsReviewers, params.execModeRequiringPromptingApprovals === "auto" ? "auto" : void 0),
		sandbox: selectGuardianSandbox(allowedSandboxModes)
	};
}
function readCodexRequirementsToml(params) {
	if (params.requirementsToml !== void 0) return params.requirementsToml ?? void 0;
	const requirementsPath = readNonEmptyString(params.requirementsPath) ?? resolveCodexRequirementsPath(params.env ?? process.env, params.platform ?? process.platform);
	try {
		if (params.readRequirementsFile) return params.readRequirementsFile(requirementsPath);
		return readFileSync(requirementsPath, "utf8");
	} catch {
		return;
	}
}
function resolveCodexRequirementsPath(env, platform) {
	if (platform === "win32") return `${(readNonEmptyString(env.ProgramData) ?? "C:\\ProgramData").replace(/[\\/]+$/, "")}${WINDOWS_CODEX_REQUIREMENTS_SUFFIX}`;
	return UNIX_CODEX_REQUIREMENTS_PATH;
}
function parseAllowedSandboxModesFromCodexRequirements(content, hostName) {
	const remoteSandboxModes = parseMatchingRemoteSandboxModesFromCodexRequirements(content, hostName);
	if (remoteSandboxModes !== void 0) return remoteSandboxModes;
	return parseRequirementsSandboxModes(parseTopLevelRequirementsStringArray(content, "allowed_sandbox_modes"));
}
function parseAllowedApprovalPoliciesFromCodexRequirements(content) {
	const values = parseTopLevelRequirementsStringArray(content, "allowed_approval_policies");
	if (values === void 0) return;
	const normalizedPolicies = values.map((entry) => normalizeRequirementsApprovalPolicy(entry)).filter((entry) => entry !== void 0);
	return normalizedPolicies.length > 0 ? new Set(normalizedPolicies) : void 0;
}
function parseAllowedApprovalsReviewersFromCodexRequirements(content) {
	const values = parseTopLevelRequirementsStringArray(content, "allowed_approvals_reviewers");
	if (values === void 0) return;
	const normalizedReviewers = values.map((entry) => normalizeRequirementsApprovalsReviewer(entry)).filter((entry) => entry !== void 0);
	return normalizedReviewers.length > 0 ? new Set(normalizedReviewers) : void 0;
}
function parseMatchingRemoteSandboxModesFromCodexRequirements(content, hostName) {
	const normalizedHostName = normalizeRequirementsHostName(hostName);
	if (normalizedHostName === void 0) return;
	for (const section of parseTomlArrayTableSections(content, "remote_sandbox_config")) {
		const patterns = parseRequirementsStringArray(section, "hostname_patterns");
		if (!patterns || !requirementsHostNameMatchesAnyPattern(normalizedHostName, patterns)) continue;
		return parseRequirementsSandboxModes(parseRequirementsStringArray(section, "allowed_sandbox_modes"));
	}
}
function parseRequirementsSandboxModes(values) {
	if (values === void 0) return;
	const normalizedModes = values.map((entry) => normalizeRequirementsSandboxMode(entry)).filter((entry) => entry !== void 0);
	return normalizedModes.length > 0 ? new Set(normalizedModes) : void 0;
}
function parseTopLevelRequirementsStringArray(content, key) {
	return parseRequirementsStringArray(stripTomlLineComments(content).slice(0, firstTomlTableOffset(content)), key);
}
function parseTomlStringValue(content, key) {
	const match = parseTomlStringAssignment(content, tomlDottedKeyPattern(key));
	return match ? match[1] ?? match[2] ?? "" : void 0;
}
function parseInlineOpenAIModelProviderBaseUrl(content) {
	const match = parseTomlStringAssignment(content, `${tomlKeyPattern("model_providers")}\\s*=\\s*\\{[\\s\\S]*?${tomlKeyPattern("openai")}\\s*=\\s*\\{[\\s\\S]*?${tomlKeyPattern("base_url")}`);
	return match ? match[1] ?? match[2] ?? "" : void 0;
}
function parseTomlStringAssignment(content, keyPattern) {
	return content.match(new RegExp(`(?:^|\\n)\\s*${keyPattern}\\s*=\\s*(?:"([^"\\\\]*(?:\\\\.[^"\\\\]*)*)"|'([^']*)')`));
}
function tomlDottedKeyPattern(key) {
	return key.split(".").map(tomlKeyPattern).join("\\s*\\.\\s*");
}
function tomlKeyPattern(key) {
	const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	return `(?:"${escaped}"|'${escaped}'|${escaped})`;
}
function parseRequirementsStringArray(content, key) {
	const match = content.match(new RegExp(`(?:^|\\n)\\s*${key}\\s*=\\s*\\[([\\s\\S]*?)\\]`));
	if (!match) return;
	const arrayBody = match[1] ?? "";
	const stringMatches = [...arrayBody.matchAll(/"([^"\\]*(?:\\.[^"\\]*)*)"|'([^']*)'/g)];
	if (stringMatches.length === 0 && arrayBody.trim().length > 0) return;
	return stringMatches.map((entry) => entry[1] ?? entry[2] ?? "");
}
function parseTomlTableSection(content, table) {
	const strippedContent = stripTomlLineComments(content);
	const tablePattern = tomlDottedKeyPattern(table);
	const match = new RegExp(`^\\s*\\[\\s*${tablePattern}\\s*\\]\\s*$`, "m").exec(strippedContent);
	if (!match) return;
	const sectionStart = match.index + match[0].length;
	const rest = strippedContent.slice(sectionStart);
	const nextTableOffset = rest.search(/^\s*\[/m);
	return nextTableOffset === -1 ? rest : rest.slice(0, nextTableOffset);
}
function parseTomlArrayTableSections(content, table) {
	const strippedContent = stripTomlLineComments(content);
	const escapedTable = table.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const headerPattern = new RegExp(`^\\s*\\[\\[\\s*${escapedTable}\\s*\\]\\]\\s*$`, "gm");
	const sections = [];
	for (let match = headerPattern.exec(strippedContent); match; match = headerPattern.exec(strippedContent)) {
		const sectionStart = headerPattern.lastIndex;
		const rest = strippedContent.slice(sectionStart);
		const nextTableOffset = rest.search(/^\s*\[/m);
		sections.push(nextTableOffset === -1 ? rest : rest.slice(0, nextTableOffset));
	}
	return sections;
}
function firstTomlTableOffset(content) {
	return content.match(/^\s*\[[^\]\n]/m)?.index ?? content.length;
}
function stripTomlLineComments(value) {
	let output = "";
	let quote;
	let escaped = false;
	for (let index = 0; index < value.length; index += 1) {
		const char = value[index] ?? "";
		if (quote) {
			output += char;
			if (quote === "\"" && escaped) {
				escaped = false;
				continue;
			}
			if (quote === "\"" && char === "\\") {
				escaped = true;
				continue;
			}
			if (char === quote) quote = void 0;
			continue;
		}
		if (char === "\"" || char === "'") {
			quote = char;
			output += char;
			continue;
		}
		if (char === "#") {
			while (index < value.length && value[index] !== "\n") index += 1;
			if (value[index] === "\n") output += "\n";
			continue;
		}
		output += char;
	}
	return output;
}
function normalizeRequirementsSandboxMode(value) {
	const compact = value.replace(/[\s_-]/g, "").toLowerCase();
	if (compact === "readonly") return "read-only";
	if (compact === "workspacewrite") return "workspace-write";
	if (compact === "dangerfullaccess") return "danger-full-access";
}
function normalizeRequirementsHostName(value) {
	const normalized = value.trim().replace(/\.+$/g, "").toLowerCase();
	return normalized.length > 0 ? normalized : void 0;
}
function requirementsHostNameMatchesAnyPattern(hostName, patterns) {
	return patterns.some((pattern) => {
		const normalizedPattern = normalizeRequirementsHostName(pattern);
		return normalizedPattern !== void 0 && globPatternMatches(hostName, normalizedPattern);
	});
}
function globPatternMatches(value, pattern) {
	let regex = "^";
	for (const char of pattern) if (char === "*") regex += ".*";
	else if (char === "?") regex += ".";
	else regex += char.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	regex += "$";
	return new RegExp(regex).test(value);
}
function normalizeRequirementsApprovalPolicy(value) {
	const normalized = value.trim().toLowerCase();
	if (normalized === "on-failure") return "on-request";
	return resolveApprovalPolicy(normalized);
}
function normalizeRequirementsApprovalsReviewer(value) {
	return resolveApprovalsReviewer(value.trim().toLowerCase());
}
function selectGuardianApprovalPolicy(allowedApprovalPolicies, execModeRequiringPromptingApprovals) {
	if (allowedApprovalPolicies === void 0 || allowedApprovalPolicies.has("on-request")) return "on-request";
	if (execModeRequiringPromptingApprovals) throw new Error(`tools.exec.mode=${execModeRequiringPromptingApprovals} requires Codex app-server prompting approvals`);
	if (allowedApprovalPolicies.has("untrusted")) return "untrusted";
	if (allowedApprovalPolicies.has("never")) return "never";
	return "on-request";
}
function selectGuardianApprovalsReviewer(allowedApprovalsReviewers, execModeRequiringAutoReviewer) {
	if (allowedApprovalsReviewers === void 0 || allowedApprovalsReviewers.has("auto_review")) return "auto_review";
	if (allowedApprovalsReviewers.has("guardian_subagent")) return "guardian_subagent";
	if (execModeRequiringAutoReviewer) throw new Error(`tools.exec.mode=${execModeRequiringAutoReviewer} requires Codex app-server auto approvals`);
	if (allowedApprovalsReviewers.has("user")) return "user";
	return "auto_review";
}
function selectUserApprovalsReviewer(allowedApprovalsReviewers, execModeRequiringUserReviewer) {
	if (allowedApprovalsReviewers === void 0 || allowedApprovalsReviewers.has("user")) return "user";
	throw new Error(`tools.exec.mode=${execModeRequiringUserReviewer ?? "ask"} requires Codex app-server user approvals`);
}
function isCodexModelBackedApprovalsReviewerProvider(provider) {
	return provider?.trim().toLowerCase() === "openai";
}
function isTrustedCodexModelBackedApprovalsReviewerProvider(provider, params) {
	return isCodexModelBackedApprovalsReviewerProvider(provider) && isTrustedCodexModelBackedOpenAIProvider({
		config: params.config,
		env: params.env,
		model: params.model,
		agentDir: params.agentDir,
		codexConfigToml: params.codexConfigToml,
		homeScope: params.homeScope
	});
}
function readCodexBaseUrlOverridesForModelBackedReview(params) {
	const configToml = readCodexAppServerConfigToml(params);
	if (configToml === false) return false;
	if (configToml === void 0) return {
		openAI: [],
		chatGPT: []
	};
	const topLevelContent = stripTomlLineComments(configToml).slice(0, firstTomlTableOffset(configToml));
	const modelProviderOpenAISection = parseTomlTableSection(configToml, "model_providers.openai");
	return {
		openAI: [
			parseTomlStringValue(topLevelContent, "openai_base_url"),
			parseTomlStringValue(topLevelContent, "model_providers.openai.base_url"),
			parseInlineOpenAIModelProviderBaseUrl(topLevelContent),
			modelProviderOpenAISection ? parseTomlStringValue(modelProviderOpenAISection, "base_url") : void 0
		].filter((entry) => entry !== void 0),
		chatGPT: [parseTomlStringValue(topLevelContent, "chatgpt_base_url")].filter((entry) => entry !== void 0)
	};
}
function readCodexAppServerConfigToml(params) {
	if (params.codexConfigToml !== void 0) return params.codexConfigToml ?? void 0;
	const configPath = resolveCodexAppServerConfigPath(params);
	if (!configPath) return;
	try {
		return readFileSync(configPath, "utf8");
	} catch (error) {
		return readErrorCode(error) === "ENOENT" ? void 0 : false;
	}
}
function resolveCodexAppServerConfigPath(params) {
	if (params.homeScope === "user") return path.join(resolveCodexAppServerUserHomeDir(params.env), CODEX_CONFIG_TOML_FILENAME);
	const agentDir = readNonEmptyString(params.agentDir);
	const codexHome = agentDir ? path.join(path.resolve(agentDir), CODEX_APP_SERVER_HOME_DIRNAME) : void 0;
	return codexHome ? path.join(codexHome, CODEX_CONFIG_TOML_FILENAME) : void 0;
}
/** Resolves the native user Codex home used by Desktop and the CLI. */
function resolveCodexAppServerUserHomeDir(env = process.env, homedir$1 = homedir) {
	const configured = readNonEmptyString(env.CODEX_HOME);
	return path.resolve(configured ?? path.join(homedir$1(), ".codex"));
}
function readErrorCode(error) {
	return error && typeof error === "object" && "code" in error ? String(error.code) : void 0;
}
function readConfiguredOpenAIProvidersForModelBackedReview(config) {
	const providerRecords = readRecord(readRecord(readRecord(config)?.models)?.providers);
	if (!providerRecords) return [];
	const openAIProviders = [];
	for (const [providerId, providerConfig] of Object.entries(providerRecords)) {
		if (resolveProviderIdForAuth(providerId, { config }) !== "openai") continue;
		const record = readRecord(providerConfig);
		if (record) openAIProviders.push(record);
	}
	return openAIProviders;
}
function configuredOpenAIProviderIsTrustedForModelBackedReview(openAIProvider, modelInput) {
	if (readRecord(openAIProvider.localService) || hasNonEmptyRecord(openAIProvider.headers) || hasNonEmptyRecord(openAIProvider.request) || typeof openAIProvider.authHeader === "boolean" || !isNativeOpenAIBaseUrl(openAIProvider.baseUrl)) return false;
	const models = openAIProvider.models;
	if (!Array.isArray(models)) return true;
	const modelId = normalizeOpenAIModelBackedReviewerModelId(modelInput);
	if (!modelId) return false;
	for (const entry of models) {
		const model = readRecord(entry);
		if (typeof model?.id !== "string" || !matchesConfiguredOpenAIModelId(modelId, model.id)) continue;
		if (hasNonEmptyRecord(model.headers) || hasNonEmptyRecord(model.request) || !isNativeOpenAIBaseUrl(model.baseUrl)) return false;
	}
	return true;
}
function normalizeOpenAIModelBackedReviewerModelId(modelInput) {
	const normalized = modelInput?.trim() ?? "";
	const authProfileIndex = normalized.indexOf("@");
	const withoutAuthProfile = authProfileIndex > 0 ? normalized.slice(0, authProfileIndex) : normalized;
	const slashIndex = withoutAuthProfile.indexOf("/");
	return slashIndex > 0 ? withoutAuthProfile.slice(slashIndex + 1).trim() : withoutAuthProfile;
}
function matchesConfiguredOpenAIModelId(modelId, configuredModelId) {
	const configured = normalizeOpenAIModelBackedReviewerModelId(configuredModelId);
	return Boolean(configured) && (modelId === configured || modelId.startsWith(`${configured}@`));
}
function hasNonEmptyRecord(value) {
	const record = readRecord(value);
	return record !== void 0 && Object.keys(record).length > 0;
}
function isNativeOpenAIBaseUrl(value) {
	if (typeof value !== "string" || !value.trim()) return true;
	try {
		const url = new URL(value);
		return url.protocol === "https:" && url.hostname.toLowerCase() === "api.openai.com";
	} catch {
		return false;
	}
}
function openAIBaseUrlEnvOverridesAreTrustedForModelBackedReview(env) {
	return [env?.OPENAI_BASE_URL, env?.OPENAI_API_BASE].every(isNativeOpenAIBaseUrl);
}
function isNativeChatGPTBaseUrl(value) {
	if (typeof value !== "string" || !value.trim()) return true;
	try {
		const url = new URL(value);
		return url.protocol === "https:" && url.hostname.toLowerCase() === "chatgpt.com";
	} catch {
		return false;
	}
}
function normalizeCodexModelBackedReviewerPolicyProvider(provider) {
	return provider.toLowerCase() === "openai" ? "openai" : provider;
}
function inferProviderFromModelRef(model) {
	const normalized = model?.trim().toLowerCase();
	const slashIndex = normalized?.indexOf("/") ?? -1;
	return slashIndex > 0 ? normalized?.slice(0, slashIndex) : void 0;
}
function selectForcedPromptingSandbox(params) {
	if (params.configuredSandbox === "read-only" || params.defaultSandbox === "read-only") return "read-only";
	return params.defaultSandbox ?? "workspace-write";
}
function selectForcedDangerFullAccessSandbox(params) {
	if (params.configuredSandbox === "read-only") return "read-only";
	if (params.defaultPolicy?.dangerFullAccessAllowed === false) {
		if (params.openClawSandboxActive) return params.defaultPolicy.sandbox ?? "workspace-write";
		throw new Error("legacy full exec security with ask requires Codex app-server danger-full-access");
	}
	return "danger-full-access";
}
function selectGuardianSandbox(allowedSandboxModes) {
	if (allowedSandboxModes === void 0 || allowedSandboxModes.has("workspace-write")) return "workspace-write";
	if (allowedSandboxModes.has("read-only")) return "read-only";
	if (allowedSandboxModes.has("danger-full-access")) return "danger-full-access";
	return "workspace-write";
}
function resolveApprovalPolicy(value) {
	if (value === "on-failure") return "on-request";
	return value === "on-request" || value === "untrusted" || value === "never" ? value : void 0;
}
function resolveSandbox(value) {
	return value === "read-only" || value === "workspace-write" || value === "danger-full-access" ? value : void 0;
}
function resolveApprovalsReviewer(value) {
	return value === "auto_review" || value === "guardian_subagent" || value === "user" ? value : void 0;
}
function resolveOpenClawExecPolicyFromConfig(params) {
	const root = readRecord(params.config);
	const globalExec = readRecord(readRecord(root?.tools)?.exec);
	const globalPolicy = applyOpenClawExecPolicyLayer(createDefaultOpenClawExecPolicy(), globalExec);
	const agentId = params.agentId?.trim();
	if (!agentId) return globalPolicy;
	const agents = readRecord(root?.agents);
	const agentList = Array.isArray(agents?.list) ? agents.list : [];
	const normalizedAgentId = normalizeAgentId(agentId);
	return applyOpenClawExecPolicyLayer(globalPolicy, readRecord(readRecord(readRecord(agentList.find((entry) => {
		const id = readRecord(entry)?.id;
		return typeof id === "string" && normalizeAgentId(id) === normalizedAgentId;
	}))?.tools)?.exec));
}
function resolveOpenClawExecPolicyForCodexAppServer(params) {
	const overridePolicy = applyOpenClawExecPolicyLayer(resolveOpenClawExecPolicyFromConfig({
		config: params.config,
		agentId: params.agentId
	}), params.execOverrides);
	return applyOpenClawExecApprovalFloors(overridePolicy, resolveOpenClawExecApprovalFloorsForCodexAppServer({
		approvals: params.approvals,
		agentId: params.agentId,
		policy: overridePolicy
	}));
}
function resolveEffectiveOpenClawExecModeForCodexAppServer(params) {
	if (params.execPolicy?.touched === true) return params.execPolicy.mode;
	return params.execMode;
}
function resolveCodexPolicyModeForOpenClawExecMode(mode) {
	if (!mode || mode === "full") return;
	return "guardian";
}
function assertCodexAppServerAllowedForOpenClawExecMode(mode) {
	if (mode === "deny" || mode === "allowlist") throw new Error(`Codex app-server local execution is not available when tools.exec.mode=${mode}`);
}
function createDefaultOpenClawExecPolicy() {
	return {
		security: "full",
		ask: "off",
		touched: false
	};
}
function applyOpenClawExecPolicyLayer(base, exec) {
	if (!exec) return base;
	const mode = readExecMode(exec.mode);
	if (mode !== void 0) return {
		...resolveOpenClawExecPolicyForMode(mode),
		touched: true
	};
	const security = readExecSecurity(exec.security);
	const ask = readExecAsk(exec.ask);
	if (security === void 0 && ask === void 0) return base;
	const nextSecurity = security ?? base.security;
	const nextAsk = ask ?? base.ask;
	return {
		mode: resolveOpenClawExecModeFromPolicy({
			security: nextSecurity,
			ask: nextAsk
		}),
		security: nextSecurity,
		ask: nextAsk,
		touched: true
	};
}
function resolveOpenClawExecApprovalFloorsForCodexAppServer(params) {
	if (!params.approvals) return;
	return resolveExecApprovalsFromFile({
		file: params.approvals,
		agentId: params.agentId,
		overrides: {
			security: params.policy.security,
			ask: params.policy.ask
		}
	}).agent;
}
function applyOpenClawExecApprovalFloors(base, approvalFloors) {
	if (!approvalFloors) return base;
	const nextSecurity = approvalFloors.security ? minOpenClawExecSecurity(base.security, approvalFloors.security) : base.security;
	const nextAsk = approvalFloors.ask ? maxOpenClawExecAsk(base.ask, approvalFloors.ask) : base.ask;
	if (nextSecurity === base.security && nextAsk === base.ask) return base;
	return {
		mode: resolveOpenClawExecModeFromPolicy({
			security: nextSecurity,
			ask: nextAsk
		}),
		security: nextSecurity,
		ask: nextAsk,
		touched: true
	};
}
function resolveOpenClawExecPolicyForMode(mode) {
	switch (mode) {
		case "deny": return {
			mode,
			security: "deny",
			ask: "off"
		};
		case "allowlist": return {
			mode,
			security: "allowlist",
			ask: "off"
		};
		case "ask":
		case "auto": return {
			mode,
			security: "allowlist",
			ask: "on-miss"
		};
		case "full": return {
			mode,
			security: "full",
			ask: "off"
		};
	}
	return mode;
}
function resolveOpenClawExecModeFromPolicy(params) {
	if (params.security === "deny") return "deny";
	if (params.security === "allowlist" && params.ask === "off") return "allowlist";
	if (params.security === "full" && params.ask !== "always") return "full";
	return "ask";
}
function minOpenClawExecSecurity(left, right) {
	const order = {
		deny: 0,
		allowlist: 1,
		full: 2
	};
	return order[left] <= order[right] ? left : right;
}
function maxOpenClawExecAsk(left, right) {
	const order = {
		off: 0,
		"on-miss": 1,
		always: 2
	};
	return order[left] >= order[right] ? left : right;
}
function readExecMode(value) {
	return value === "deny" || value === "allowlist" || value === "ask" || value === "auto" || value === "full" ? value : void 0;
}
function readRecord(value) {
	return value && typeof value === "object" && !Array.isArray(value) ? value : void 0;
}
function normalizeCodexServiceTier(value) {
	if (typeof value !== "string") return;
	const trimmed = value.trim();
	if (!trimmed) return;
	const normalized = trimmed.toLowerCase();
	if (normalized === "fast" || normalized === "priority") return "priority";
	if (normalized === "flex") return "flex";
	return trimmed;
}
function isCodexFastServiceTier(value) {
	return normalizeCodexServiceTier(value) === "priority";
}
function normalizePositiveNumber(value, fallback) {
	return resolvePositiveTimerTimeoutMs(value, fallback);
}
function normalizeHeaders(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return {};
	return Object.fromEntries(Object.entries(value).map(([key, child]) => [key.trim(), normalizeCodexAppServerSecretInput({
		value: child,
		path: `plugins.entries.codex.config.appServer.headers.${key}`
	})]).filter((entry) => Boolean(entry[0] && entry[1])));
}
function normalizeCodexAppServerSecretInput(params) {
	return normalizeResolvedSecretInputString(params);
}
function normalizeStringList(value) {
	return normalizeTrimmedStringList(value);
}
function readBooleanEnv(value) {
	if (value === void 0) return;
	const normalized = value.trim().toLowerCase();
	if ([
		"1",
		"true",
		"yes",
		"on"
	].includes(normalized)) return true;
	if ([
		"0",
		"false",
		"no",
		"off"
	].includes(normalized)) return false;
}
function readExecSecurity(value) {
	return value === "deny" || value === "allowlist" || value === "full" ? value : void 0;
}
function readExecAsk(value) {
	return value === "off" || value === "on-miss" || value === "always" ? value : void 0;
}
function readNumberEnv(value) {
	const trimmed = value?.trim();
	if (!trimmed || !PLAIN_DECIMAL_NUMBER_RE.test(trimmed)) return;
	const parsed = Number(trimmed);
	return Number.isFinite(parsed) ? parsed : void 0;
}
function resolveArgs(configArgs, envArgs) {
	if (Array.isArray(configArgs)) return configArgs.map((entry) => readNonEmptyString(entry)).filter((entry) => entry !== void 0);
	if (typeof configArgs === "string") return splitShellWords(configArgs);
	return splitShellWords(envArgs ?? "");
}
function readNonEmptyString(value) {
	if (typeof value !== "string") return;
	return value.trim() || void 0;
}
function hashSecretForKey(value, label) {
	if (!value) return null;
	return createHmac("sha256", START_OPTIONS_KEY_SECRET).update(label).update("\0").update(value).digest("hex");
}
function getStartOptionsKeySecret() {
	const globalState = globalThis;
	globalState[START_OPTIONS_KEY_SECRET_SYMBOL] ??= randomBytes(32);
	return globalState[START_OPTIONS_KEY_SECRET_SYMBOL];
}
function splitShellWords(value) {
	const words = [];
	let current = "";
	let quote = null;
	for (const char of value) {
		if (quote) {
			if (char === quote) quote = null;
			else current += char;
			continue;
		}
		if (char === "\"" || char === "'") {
			quote = char;
			continue;
		}
		if (/\s/.test(char)) {
			if (current) {
				words.push(current);
				current = "";
			}
			continue;
		}
		current += char;
	}
	if (current) words.push(current);
	return words;
}
//#endregion
export { shouldAutoApproveCodexAppServerApprovals as _, isCodexAppServerApprovalPolicyAllowedByRequirements as a, isTrustedCodexModelBackedOpenAIProvider as c, resolveCodexAppServerRuntimeOptions as d, resolveCodexAppServerUserHomeDir as f, resolveOpenClawExecPolicyForCodexAppServer as g, resolveCodexPluginsPolicy as h, codexSandboxPolicyForTurn as i, normalizeCodexServiceTier as l, resolveCodexModelBackedReviewerPolicyContext as m, canUseCodexModelBackedApprovalsReviewerForModel as n, isCodexFastServiceTier as o, resolveCodexComputerUseConfig as p, codexAppServerStartOptionsKey as r, isCodexSandboxExecServerEnabled as s, CODEX_PLUGINS_MARKETPLACE_NAME as t, readCodexPluginConfig as u, withMcpElicitationsApprovalPolicy as v };
