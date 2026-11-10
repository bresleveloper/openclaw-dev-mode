import { r as isJsonObject } from "./protocol-CaPAVwe9.mjs";
import { _ as resolveCodexPolicyModeForOpenClawExecMode, a as resolveDefaultCodexAppServerPolicy, b as selectForcedDangerFullAccessSandbox, d as readCodexRequirementsToml, g as resolveApprovalPolicy, h as assertCodexAppServerAllowedForOpenClawExecMode, i as resolveCodexAppServerNetworkProxy, o as resolvePolicyMode, r as inferCodexAppServerConnectionClass, t as assertCodexAppServerConnectionSecurity, u as parseCodexRequirementsPolicy, v as resolveEffectiveOpenClawExecModeForCodexAppServer, x as selectForcedPromptingSandbox, y as resolveSandbox } from "./config-security-BxV4sSRz.mjs";
import { c as readNumberEnv, i as normalizeHeaders, l as readRecord, n as hashSecretForKey, s as readNonEmptyString, u as resolveArgs } from "./config-utils-DN_YT7dE.mjs";
import { a as DEFAULT_CODEX_COMPUTER_USE_PLUGIN_NAME, d as readCodexPluginConfig, n as DEFAULT_CODEX_COMPUTER_USE_LIVE_TEST_TIMEOUT_MS, o as DEFAULT_CODEX_COMPUTER_USE_TOOL_CALL_TIMEOUT_MS, r as DEFAULT_CODEX_COMPUTER_USE_MARKETPLACE_DISCOVERY_TIMEOUT_MS, s as assertCodexAppServerCommandHasNoInlineArgs } from "./config-parsing-DsWSCPHO.mjs";
import { i as readCodexAppServerConfigOptions } from "./launch-args-DbFCehO7.mjs";
import { r as resolveCodexAppServerUserHomeDir, t as resolveCodexAppServerHomeDir } from "./auth-start-options-P3n7Bssz.mjs";
import { normalizeTrimmedStringList, parseBooleanValue } from "openclaw/plugin-sdk/string-coerce-runtime";
import { resolvePositiveTimerTimeoutMs } from "openclaw/plugin-sdk/number-runtime";
import { normalizeResolvedSecretInputString } from "openclaw/plugin-sdk/secret-input";
import { parse } from "smol-toml";
import { readFileSync } from "node:fs";
import path from "node:path";
//#region extensions/codex/src/app-server/config-layer-policy.ts
const CODEX_SESSION_OVERRIDABLE_LAYER_TYPES = /* @__PURE__ */ new Set([
	"packagedDefaults",
	"mdm",
	"system",
	"enterpriseManaged",
	"user",
	"project",
	"sessionFlags"
]);
/** Read one effective snapshot for the current boundary's reviewer and tool-policy checks. */
async function readCodexEffectiveConfig(client, cwd, options) {
	const response = await client.request("config/read", {
		cwd: path.resolve(cwd),
		includeLayers: true
	}, options);
	if (!isJsonObject(response) || !isJsonObject(response.config)) throw new Error("Codex config/read returned an invalid effective config");
	return response;
}
//#endregion
//#region extensions/codex/src/app-server/config-reviewer-policy.ts
const CODEX_CONFIG_TOML_FILENAME = "config.toml";
const CODEX_CLI_WHITESPACE = /^\p{White_Space}+|\p{White_Space}+$/gu;
/** Cloud/system config can redirect reviews after local home/profile checks have passed. */
async function assertCodexModelBackedReviewerEffectiveConfig(params) {
	if (params.approvalsReviewer !== "auto_review" && params.approvalsReviewer !== "guardian_subagent") return;
	const response = await readCodexEffectiveConfig(params.client, params.cwd, { signal: params.signal });
	if (!isTrustedCodexReviewerConfig(response.config)) throw new Error("Codex model-backed approval reviewer requires the running server to use a trusted OpenAI endpoint");
	return response;
}
function isTrustedCodexReviewerConfig(config) {
	const modelProvider = config.model_provider;
	const providers = config.model_providers;
	const providerRecords = providers == null ? void 0 : readRecord(providers);
	const provider = providerRecords?.openai;
	const openAIProvider = provider == null ? void 0 : readRecord(provider);
	return (modelProvider == null || modelProvider === "openai") && (providers == null || providerRecords !== void 0) && (provider == null || openAIProvider !== void 0) && isTrustedOptionalReviewerEndpoint(config.openai_base_url, "api.openai.com") && isTrustedOptionalReviewerEndpoint(config.chatgpt_base_url, "chatgpt.com") && isTrustedOptionalReviewerEndpoint(openAIProvider?.base_url, "api.openai.com");
}
function isTrustedOptionalReviewerEndpoint(value, hostname) {
	return value == null || typeof value === "string" && isNativeReviewerBaseUrl(value, hostname);
}
function canUseCodexModelBackedApprovalsReviewerForModel(params, resolveAuthProviderId) {
	const explicitProvider = params.modelProvider?.trim().toLowerCase();
	const inferredProvider = inferProviderFromModelRef(params.model);
	if (explicitProvider && explicitProvider !== "codex" && explicitProvider !== "openai") return false;
	if ((inferredProvider ?? explicitProvider) !== "openai") return false;
	if (![params.env?.OPENAI_BASE_URL, params.env?.OPENAI_API_BASE].every(isNativeOpenAIBaseUrl)) return false;
	if (!nativeCodexConfigIsTrustedForModelBackedReview(params)) return false;
	const config = params.config;
	const providerRecords = readRecord(readRecord(readRecord(config)?.models)?.providers);
	return Object.entries(providerRecords ?? {}).flatMap(([providerId, providerConfig]) => {
		if (resolveAuthProviderId(providerId, { config }) !== "openai") return [];
		const record = readRecord(providerConfig);
		return record ? [record] : [];
	}).every((provider) => configuredOpenAIProviderIsTrustedForModelBackedReview(provider, params.model));
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
	const modelProvider = bindingModelProvider && currentModel && bindingModel && currentModel === bindingModel ? bindingModelProvider : (inferProviderFromModelRef(params.model) ?? bindingModelProvider) || (params.nativeAuthProfile === true ? "openai" : void 0);
	return {
		modelProvider: modelProvider ? normalizeCodexModelBackedReviewerPolicyProvider(modelProvider) : void 0,
		model: params.model ?? params.bindingModel
	};
}
function nativeCodexConfigIsTrustedForModelBackedReview(params) {
	const configToml = readCodexAppServerConfigToml(params);
	if (configToml === false) return false;
	const nativeOverrides = readNativeCodexReviewerConfigOverrides(params);
	if (nativeOverrides === false) return false;
	if (configToml !== void 0) try {
		nativeOverrides.unshift(parse(configToml, { integersAsBigInt: true }));
	} catch {
		return false;
	}
	return nativeOverrides.every(isTrustedCodexReviewerConfig);
}
function readNativeCodexReviewerConfigOverrides(params) {
	if (params.codexArgs?.some((arg) => !arg)) return false;
	const overrides = [];
	let profile;
	for (const { name, value } of readCodexAppServerConfigOptions(params.codexArgs ?? [])) {
		if (!value) return false;
		if (name === "--profile" || name === "-p") profile = value;
		else {
			const override = parseNativeCodexReviewerConfigOverride(value);
			if (override === false) return false;
			overrides.push(override);
		}
	}
	if (profile) {
		if (path.basename(profile) !== profile || profile === "." || profile === "..") return false;
		const configPath = resolveCodexAppServerConfigPath(params);
		if (!configPath) return false;
		try {
			overrides.unshift(parse(readFileSync(path.join(path.dirname(configPath), `${profile}.config.toml`), "utf8"), { integersAsBigInt: true }));
		} catch (error) {
			if (readErrorCode(error) !== "ENOENT") return false;
		}
	}
	return overrides;
}
function parseNativeCodexReviewerConfigOverride(override) {
	const separator = override.indexOf("=");
	if (separator < 0) return false;
	const key = override.slice(0, separator).replace(CODEX_CLI_WHITESPACE, "");
	if (!key) return false;
	const raw = override.slice(separator + 1).replace(CODEX_CLI_WHITESPACE, "");
	let value;
	try {
		value = parse(`_x_ = ${raw}`, { integersAsBigInt: true })["_x_"];
	} catch {
		value = raw.replace(/^["']+|["']+$/g, "");
	}
	for (const segment of key.split(".").toReversed()) value = { [segment]: value };
	return readRecord(value) ?? false;
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
function codexConfigEnablesNativeComputerUse(params) {
	const configToml = readCodexAppServerConfigToml(params);
	if (typeof configToml !== "string") return configToml === false;
	let parsedConfig;
	try {
		parsedConfig = parse(configToml, { integersAsBigInt: true });
	} catch {
		return true;
	}
	const rawPlugins = parsedConfig.plugins;
	if (rawPlugins === void 0) return false;
	const plugins = readRecord(rawPlugins);
	if (!plugins) return true;
	return Object.entries(plugins).some(([pluginId, pluginConfig]) => params.pluginNames.some((pluginName) => pluginId === pluginName || pluginId.startsWith(`${pluginName}@`)) && readRecord(pluginConfig)?.enabled !== false);
}
function resolveCodexAppServerConfigPath(params) {
	if (params.codexHome) return path.join(params.codexHome, CODEX_CONFIG_TOML_FILENAME);
	if (params.homeScope === "user") return path.join(resolveCodexAppServerUserHomeDir(params.env), CODEX_CONFIG_TOML_FILENAME);
	const agentDir = readNonEmptyString(params.agentDir);
	return agentDir ? path.join(resolveCodexAppServerHomeDir(agentDir), CODEX_CONFIG_TOML_FILENAME) : void 0;
}
function readErrorCode(error) {
	return error && typeof error === "object" && "code" in error ? String(error.code) : void 0;
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
	return isNativeReviewerBaseUrl(value, "api.openai.com");
}
function isNativeReviewerBaseUrl(value, hostname) {
	if (typeof value !== "string" || !value.trim()) return true;
	const url = URL.parse(value);
	return url?.protocol === "https:" && url.hostname.toLowerCase() === hostname;
}
function normalizeCodexModelBackedReviewerPolicyProvider(provider) {
	return provider.toLowerCase() === "openai" ? "openai" : provider;
}
function inferProviderFromModelRef(model) {
	const normalized = model?.trim().toLowerCase();
	const slashIndex = normalized?.indexOf("/") ?? -1;
	return slashIndex > 0 ? normalized?.slice(0, slashIndex) : void 0;
}
//#endregion
//#region extensions/codex/src/app-server/config-options.ts
/**
* Sole owner of the app-server home-scope decision. Ordinary harness connections
* default to the isolated agent home; the supervision connection owns the operator's
* native Codex home on local transports. Auth handoffs must read the scope from here
* (or from resolved start options) because a prepared login on a native home rewrites
* the account Codex CLI and Desktop share.
*/
function resolveCodexAppServerHomeScope(params) {
	const configured = params.appServer?.homeScope;
	if (configured) return configured;
	return params.connectionScope === "supervision" && params.appServer?.transport !== "websocket" ? "user" : "agent";
}
function createCodexAppServerConfig({ resolveProviderIdForAuth }) {
	function resolveRuntimeOptions(params, connectionScope) {
		const env = params.env ?? process.env;
		const pluginConfig = readCodexPluginConfig(params.pluginConfig);
		const config = pluginConfig.appServer ?? {};
		const transport = config.transport ?? "stdio";
		const homeScope = resolveCodexAppServerHomeScope({
			appServer: config,
			connectionScope
		});
		if (transport !== "stdio" && pluginConfig.sessionCatalog?.homes?.length) throw new Error("plugins.entries.codex.config.sessionCatalog.homes requires appServer.transport=stdio");
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
		const clearEnv = normalizeTrimmedStringList(config.clearEnv);
		const authToken = normalizeResolvedSecretInputString({
			value: config.authToken,
			path: "plugins.entries.codex.config.appServer.authToken"
		});
		const url = readNonEmptyString(config.url) ?? (transport === "unix" ? "unix://" : void 0);
		const connectionClass = inferCodexAppServerConnectionClass({
			transport,
			url
		});
		const remoteWorkspaceRoot = readNonEmptyString(config.remoteWorkspaceRoot);
		const execMode = resolveEffectiveOpenClawExecModeForCodexAppServer(params);
		if (!params.sessionPermissionMode) assertCodexAppServerAllowedForOpenClawExecMode(execMode);
		const explicitPolicyMode = config.mode ?? resolvePolicyMode(env.OPENCLAW_CODEX_APP_SERVER_MODE);
		const configuredSandbox = config.sandbox ?? resolveSandbox(env.OPENCLAW_CODEX_APP_SERVER_SANDBOX);
		const explicitApprovalsReviewer = config.approvalsReviewer;
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
		}, resolveProviderIdForAuth);
		const forceUserReviewer = !canUseModelBackedReviewer && (explicitApprovalsReviewer === "auto_review" || explicitApprovalsReviewer === "guardian_subagent" || explicitPolicyMode === "guardian" && explicitApprovalsReviewer !== "user") || execMode !== void 0 && execMode !== "full" && (execMode !== "auto" || !canUseModelBackedReviewer);
		const forceGuardianReviewer = execMode === "auto" && canUseModelBackedReviewer;
		const execModeRequiringPromptingApprovals = execMode === "auto" || execMode === "ask" ? execMode : forceUserReviewer ? "ask" : void 0;
		const forceDangerFullAccessSandbox = params.execPolicy?.touched === true && params.execPolicy.security === "full" && params.execPolicy.ask === "always";
		const forcePerCommandApprovals = params.execPolicy?.ask === "always";
		const requirementsToml = forcePerCommandApprovals ? readCodexRequirementsToml({
			...params,
			env
		}) ?? null : params.requirementsToml;
		if (forcePerCommandApprovals && requirementsToml && parseCodexRequirementsPolicy(requirementsToml).allowedApprovalPolicies?.has("untrusted") === false) throw new Error("tools.exec.ask=always requires Codex app-server per-command approvals");
		const forceRuntimePolicy = forceUserReviewer || forceGuardianReviewer || forceDangerFullAccessSandbox;
		const defaultPolicy = explicitPolicyMode && !forceRuntimePolicy && !ignoreLegacyYoloPolicyMode ? void 0 : resolveDefaultCodexAppServerPolicy({
			...params,
			transport,
			env,
			forceGuardian: normalizedPolicyMode === "guardian",
			forceUserReviewer: forceUserReviewer || !canUseModelBackedReviewer,
			execModeRequiringPromptingApprovals,
			requirementsToml,
			execModeRequiringUserReviewer: forceUserReviewer ? execMode : void 0
		});
		const preserveExplicitAutoSandbox = forceGuardianReviewer && configuredSandbox === "read-only";
		const forcedPolicy = forceRuntimePolicy ? {
			approvalPolicy: forcePerCommandApprovals ? "untrusted" : defaultPolicy?.approvalPolicy ?? "on-request",
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
		const serviceTier = config.serviceTier;
		const resolvedSandbox = forcedPolicy?.sandbox ?? configuredSandbox ?? defaultPolicy?.sandbox ?? (policyMode === "guardian" ? "workspace-write" : "danger-full-access");
		if (transport === "websocket" && !url) throw new Error("plugins.entries.codex.config.appServer.url is required when appServer.transport is websocket");
		if (transport === "websocket" && homeScope === "user") throw new Error("plugins.entries.codex.config.appServer.homeScope=user requires appServer.transport=stdio or unix");
		if (transport === "unix" && homeScope !== "user") throw new Error("plugins.entries.codex.config.appServer.transport=unix requires appServer.homeScope=user");
		if (transport === "unix" && !url?.startsWith("unix://")) throw new Error("plugins.entries.codex.config.appServer.url must use unix:// when appServer.transport is unix");
		assertCodexAppServerConnectionSecurity({
			transport,
			url,
			authToken,
			headers
		});
		const configApprovalPolicy = config.approvalPolicy;
		const envApprovalPolicy = resolveApprovalPolicy(env.OPENCLAW_CODEX_APP_SERVER_APPROVAL_POLICY);
		const approvalPolicy = configApprovalPolicy ?? envApprovalPolicy ?? defaultPolicy?.approvalPolicy ?? (policyMode === "guardian" ? "on-request" : "never");
		const computerUseConfig = resolveCodexComputerUseConfig({
			pluginConfig: params.pluginConfig,
			env
		});
		const managedCommandOrder = params.managedCommandOrder ?? (homeScope === "user" || computerUseConfig.enabled ? "desktop-first" : "package-first");
		const includeManagedCommandOrder = commandSource === "managed" && (managedCommandOrder === "desktop-first" || params.managedCommandOrder !== void 0);
		const managedComputerUsePluginNames = [.../* @__PURE__ */ new Set([DEFAULT_CODEX_COMPUTER_USE_PLUGIN_NAME, computerUseConfig.pluginName])];
		return {
			start: {
				transport,
				homeScope,
				command,
				commandSource,
				...includeManagedCommandOrder ? { managedCommandOrder } : {},
				...commandSource === "managed" ? { managedComputerUsePluginNames } : {},
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
			...remoteWorkspaceRoot ? { remoteWorkspaceRoot } : {},
			...config.nativeHookRelay ? { nativeHookRelay: config.nativeHookRelay } : {},
			codeModeOnly: config.codeModeOnly === true,
			loopDetectionPreToolUseRelay: config.loopDetectionPreToolUseRelay !== false,
			requestTimeoutMs: resolvePositiveTimerTimeoutMs(config.requestTimeoutMs, 6e4),
			approvalPolicy: forcedPolicy?.approvalPolicy ?? approvalPolicy,
			sandbox: resolvedSandbox,
			approvalsReviewer: forcedPolicy?.approvalsReviewer ?? explicitApprovalsReviewer ?? defaultPolicy?.approvalsReviewer ?? (policyMode === "guardian" ? "auto_review" : "user"),
			...serviceTier ? { serviceTier } : {},
			enableUltrafast: config.enableUltrafast !== false,
			...resolveCodexAppServerNetworkProxy(config.networkProxy, resolvedSandbox)
		};
	}
	return {
		resolveCodexAppServerRuntimeOptions: (params = {}) => resolveRuntimeOptions(params, "harness"),
		resolveCodexSupervisionAppServerRuntimeOptions: (params = {}) => resolveRuntimeOptions(params, "supervision")
	};
}
/**
* Rechecks Codex-owned plugin state at the final spawn boundary, where the
* effective agent home is known, so Computer Use keeps the desktop app's TCC ownership.
*/
function resolveCodexAppServerStartOptionsForAgent(params) {
	const startOptions = params.startOptions;
	if (startOptions.transport !== "stdio" || startOptions.commandSource !== "managed" || startOptions.managedCommandOrder !== void 0) return startOptions;
	if (startOptions.homeScope === "user") return {
		...startOptions,
		managedCommandOrder: "desktop-first"
	};
	if (!params.agentDir) throw new Error("Agent-scoped Codex requires an OpenClaw agent directory");
	return codexConfigEnablesNativeComputerUse({
		agentDir: params.agentDir,
		codexHome: startOptions.codexHome,
		codexConfigToml: params.codexConfigToml,
		env: params.env,
		homeScope: "agent",
		pluginNames: startOptions.managedComputerUsePluginNames ?? ["computer-use"]
	}) ? {
		...startOptions,
		managedCommandOrder: "desktop-first"
	} : startOptions;
}
function resolveCodexComputerUseConfig(params = {}) {
	const env = params.env ?? process.env;
	const config = readCodexPluginConfig(params.pluginConfig).computerUse ?? {};
	const option = (key) => params.overrides?.[key] ?? config[key];
	const envOption = (key) => env[`OPENCLAW_CODEX_COMPUTER_USE_${key.replace(/[A-Z]/g, "_$&").toUpperCase()}`];
	const stringOption = (key) => readNonEmptyString(params.overrides?.[key]) ?? readNonEmptyString(config[key]) ?? readNonEmptyString(envOption(key));
	const booleanOption = (key) => option(key) ?? parseBooleanValue(envOption(key)) ?? false;
	const timeoutOption = (key, fallback) => resolvePositiveTimerTimeoutMs(option(key) ?? readNumberEnv(envOption(key)), fallback);
	const marketplaceSource = stringOption("marketplaceSource");
	const marketplacePath = stringOption("marketplacePath");
	const marketplaceName = stringOption("marketplaceName");
	const configuredPluginName = stringOption("pluginName");
	const configuredMcpServerName = stringOption("mcpServerName");
	const autoInstall = booleanOption("autoInstall");
	const marketplaceDiscoveryTimeoutMs = timeoutOption("marketplaceDiscoveryTimeoutMs", DEFAULT_CODEX_COMPUTER_USE_MARKETPLACE_DISCOVERY_TIMEOUT_MS);
	const liveTestTimeoutMs = timeoutOption("liveTestTimeoutMs", DEFAULT_CODEX_COMPUTER_USE_LIVE_TEST_TIMEOUT_MS);
	const toolCallTimeoutMs = timeoutOption("toolCallTimeoutMs", DEFAULT_CODEX_COMPUTER_USE_TOOL_CALL_TIMEOUT_MS);
	const healthCheckIntervalMinutes = normalizeComputerUseHealthCheckIntervalMinutes(option("healthCheckIntervalMinutes") ?? readNumberEnv(envOption("healthCheckIntervalMinutes")));
	const healthCheckEnabled = booleanOption("healthCheckEnabled");
	const pluginCacheMode = normalizeComputerUsePluginCacheMode(params.overrides?.pluginCacheMode) ?? config.pluginCacheMode ?? normalizeComputerUsePluginCacheMode(envOption("pluginCacheMode")) ?? "independent";
	const strictReadiness = booleanOption("strictReadiness");
	const autoRepair = booleanOption("autoRepair");
	return {
		enabled: option("enabled") ?? parseBooleanValue(env.OPENCLAW_CODEX_COMPUTER_USE) ?? Boolean(autoInstall || marketplaceSource || marketplacePath || marketplaceName || configuredPluginName || configuredMcpServerName),
		autoInstall,
		marketplaceDiscoveryTimeoutMs,
		liveTestTimeoutMs,
		toolCallTimeoutMs,
		healthCheckEnabled,
		healthCheckIntervalMinutes,
		pluginCacheMode,
		strictReadiness,
		autoRepair,
		pluginName: configuredPluginName ?? "computer-use",
		mcpServerName: configuredMcpServerName ?? "computer-use",
		...marketplaceSource ? { marketplaceSource } : {},
		...marketplacePath ? { marketplacePath } : {},
		...marketplaceName ? { marketplaceName } : {}
	};
}
function normalizeComputerUseHealthCheckIntervalMinutes(value) {
	return value === 30 || value === 60 || value === 120 || value === 240 ? value : 60;
}
function normalizeComputerUsePluginCacheMode(value) {
	return value === "shared" || value === "independent" ? value : null;
}
function codexAppServerStartOptionsKey(options, params = {}) {
	return JSON.stringify({
		transport: options.transport,
		command: options.command,
		commandSource: options.commandSource ?? null,
		managedCommandOrder: options.managedCommandOrder ?? "package-first",
		managedComputerUsePluginNames: [...options.managedComputerUsePluginNames ?? []].toSorted(),
		managedFallbackCommandPaths: [...options.managedFallbackCommandPaths ?? []],
		args: options.args,
		cwd: options.cwd ?? null,
		url: options.url ?? null,
		authToken: hashSecretForKey(options.authToken, "authToken"),
		headers: Object.entries(options.headers).toSorted(([left], [right]) => left.localeCompare(right)).map(([key, value]) => [key, hashSecretForKey(value, `header:${key}`)]),
		env: Object.entries({
			...options.env,
			...options.codexHome ? { CODEX_HOME: options.codexHome } : {}
		}).toSorted(([left], [right]) => left.localeCompare(right)).map(([key, value]) => [key, hashSecretForKey(value, `env:${key}`)]),
		clearEnv: [...options.clearEnv ?? []].toSorted(),
		authProfileId: params.authProfileId ?? null,
		authBindingFingerprint: params.authBindingFingerprint ?? null,
		agentDir: params.agentDir ?? null,
		fallbackApiKeyCacheKey: params.fallbackApiKeyCacheKey ?? null
	});
}
function codexSandboxPolicyForTurn(mode, cwd, nativeArgs = []) {
	if (mode === "danger-full-access") return { type: "dangerFullAccess" };
	if (mode === "read-only") return {
		type: "readOnly",
		networkAccess: false
	};
	let excludeTmpdirEnvVar = false;
	let excludeSlashTmp = false;
	for (const { name, value: override } of readCodexAppServerConfigOptions(nativeArgs)) {
		if (name !== "-c" && name !== "--config" || !override) continue;
		const separator = override.indexOf("=");
		if (separator < 0) continue;
		const key = override.slice(0, separator).trim();
		const isTmpdirExclusion = key === "sandbox_workspace_write.exclude_tmpdir_env_var";
		if (!isTmpdirExclusion && key !== "sandbox_workspace_write.exclude_slash_tmp") continue;
		let value;
		try {
			value = parse(`_x_ = ${override.slice(separator + 1).trim()}`)["_x_"];
		} catch {
			continue;
		}
		if (typeof value !== "boolean") continue;
		if (isTmpdirExclusion) excludeTmpdirEnvVar = value;
		else excludeSlashTmp = value;
	}
	return {
		type: "workspaceWrite",
		writableRoots: [cwd],
		networkAccess: false,
		excludeTmpdirEnvVar,
		excludeSlashTmp
	};
}
//#endregion
export { resolveCodexAppServerStartOptionsForAgent as a, canUseCodexModelBackedApprovalsReviewerForModel as c, readCodexEffectiveConfig as d, resolveCodexAppServerHomeScope as i, resolveCodexModelBackedReviewerPolicyContext as l, codexSandboxPolicyForTurn as n, resolveCodexComputerUseConfig as o, createCodexAppServerConfig as r, assertCodexModelBackedReviewerEffectiveConfig as s, codexAppServerStartOptionsKey as t, CODEX_SESSION_OVERRIDABLE_LAYER_TYPES as u };
