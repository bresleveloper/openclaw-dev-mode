import { a as normalizeHeaders, d as readNumberEnv, f as readRecord, i as normalizeCodexServiceTier, o as normalizePositiveNumber, p as resolveArgs, r as normalizeCodexAppServerSecretInput, s as readBooleanEnv, t as hashSecretForKey, u as readNonEmptyString } from "./config-utils-DujwEnhg.mjs";
import { A as selectForcedPromptingSandbox, C as assertCodexAppServerAllowedForOpenClawExecMode, D as resolveEffectiveOpenClawExecModeForCodexAppServer, E as resolveCodexPolicyModeForOpenClawExecMode, O as resolveSandbox, T as resolveApprovalsReviewer, a as resolveCodexAppServerNetworkProxy, c as resolveTransport, d as resolveCodexAppServerHomeDir, g as parseAllowedApprovalPoliciesFromCodexRequirements, i as normalizeRemoteWorkspaceRoot, k as selectForcedDangerFullAccessSandbox, o as resolveDefaultCodexAppServerPolicy, p as resolveCodexAppServerUserHomeDir, r as inferCodexAppServerConnectionClass, s as resolvePolicyMode, t as assertCodexAppServerConnectionSecurity, w as resolveApprovalPolicy, y as readCodexRequirementsToml } from "./config-security-BEReZ6go.mjs";
import { a as DEFAULT_CODEX_COMPUTER_USE_PLUGIN_NAME, d as readCodexPluginConfig, n as DEFAULT_CODEX_COMPUTER_USE_LIVE_TEST_TIMEOUT_MS, o as DEFAULT_CODEX_COMPUTER_USE_TOOL_CALL_TIMEOUT_MS, r as DEFAULT_CODEX_COMPUTER_USE_MARKETPLACE_DISCOVERY_TIMEOUT_MS, s as assertCodexAppServerCommandHasNoInlineArgs } from "./config-parsing-CcB9iPoq.mjs";
import { i as readCodexAppServerConfigOptions } from "./launch-args-DbFCehO7.mjs";
import { i as isJsonObject } from "./protocol-CANUwXJ3.mjs";
import { normalizeTrimmedStringList } from "openclaw/plugin-sdk/string-coerce-runtime";
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
	return (modelProvider == null || modelProvider === "openai") && (providers == null || providerRecords !== void 0) && (provider == null || openAIProvider !== void 0) && isTrustedOptionalReviewerEndpoint(config.openai_base_url, isNativeOpenAIBaseUrl) && isTrustedOptionalReviewerEndpoint(config.chatgpt_base_url, isNativeChatGPTBaseUrl) && isTrustedOptionalReviewerEndpoint(openAIProvider?.base_url, isNativeOpenAIBaseUrl);
}
function isTrustedOptionalReviewerEndpoint(value, isTrusted) {
	return value == null || typeof value === "string" && isTrusted(value);
}
function canUseCodexModelBackedApprovalsReviewerForModel(params, resolveAuthProviderId) {
	const explicitProvider = params.modelProvider?.trim().toLowerCase();
	const inferredProvider = inferProviderFromModelRef(params.model);
	if (explicitProvider && explicitProvider !== "codex" && explicitProvider !== "openai") return false;
	return (inferredProvider ?? explicitProvider) === "openai" && isTrustedCodexModelBackedOpenAIProvider(params, resolveAuthProviderId);
}
function isTrustedCodexModelBackedOpenAIProvider(params, resolveAuthProviderId) {
	if (!openAIBaseUrlEnvOverridesAreTrustedForModelBackedReview(params.env)) return false;
	if (!nativeCodexConfigIsTrustedForModelBackedReview(params)) return false;
	const openAIProviders = readConfiguredOpenAIProvidersForModelBackedReview(params.config, resolveAuthProviderId);
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
	if (configToml === false) return true;
	if (configToml === void 0) return false;
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
	for (const [pluginId, rawPluginConfig] of Object.entries(plugins)) {
		if (!params.pluginNames.some((pluginName) => pluginId === pluginName || pluginId.startsWith(`${pluginName}@`))) continue;
		const pluginConfig = readRecord(rawPluginConfig);
		if (!pluginConfig) return true;
		if (pluginConfig.enabled === false) continue;
		return true;
	}
	return false;
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
function readConfiguredOpenAIProvidersForModelBackedReview(config, resolveAuthProviderId) {
	const providerRecords = readRecord(readRecord(readRecord(config)?.models)?.providers);
	if (!providerRecords) return [];
	const openAIProviders = [];
	for (const [providerId, providerConfig] of Object.entries(providerRecords)) {
		if (resolveAuthProviderId(providerId, { config }) !== "openai") continue;
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
	return params.connectionScope === "supervision" && resolveTransport(params.appServer?.transport) !== "websocket" ? "user" : "agent";
}
function createCodexAppServerConfig({ resolveProviderIdForAuth }) {
	function resolveCodexAppServerRuntimeOptions(params = {}) {
		const env = params.env ?? process.env;
		const pluginConfig = readCodexPluginConfig(params.pluginConfig);
		const config = pluginConfig.appServer ?? {};
		const transport = resolveTransport(config.transport);
		const homeScope = resolveCodexAppServerHomeScope({ appServer: config });
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
		const authToken = normalizeCodexAppServerSecretInput({
			value: config.authToken,
			path: "plugins.entries.codex.config.appServer.authToken"
		});
		const url = readNonEmptyString(config.url) ?? (transport === "unix" ? "unix://" : void 0);
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
		if (!params.sessionPermissionMode) assertCodexAppServerAllowedForOpenClawExecMode(execMode);
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
		}, resolveProviderIdForAuth);
		const forceUserReviewer = !canUseModelBackedReviewer && (explicitApprovalsReviewer === "auto_review" || explicitApprovalsReviewer === "guardian_subagent" || explicitPolicyMode === "guardian" && explicitApprovalsReviewer !== "user") || execMode !== void 0 && execMode !== "full" && (execMode !== "auto" || !canUseModelBackedReviewer);
		const forceGuardianReviewer = execMode === "auto" && canUseModelBackedReviewer;
		const execModeRequiringPromptingApprovals = execMode === "auto" || execMode === "ask" ? execMode : forceUserReviewer ? "ask" : void 0;
		const forceDangerFullAccessSandbox = params.execPolicy?.touched === true && params.execPolicy.security === "full" && params.execPolicy.ask === "always";
		const forcePerCommandApprovals = params.execPolicy?.ask === "always";
		const requirementsToml = forcePerCommandApprovals ? readCodexRequirementsToml({
			env,
			requirementsToml: params.requirementsToml,
			requirementsPath: params.requirementsPath,
			readRequirementsFile: params.readRequirementsFile,
			platform: params.platform
		}) ?? null : params.requirementsToml;
		if (forcePerCommandApprovals && requirementsToml && parseAllowedApprovalPoliciesFromCodexRequirements(requirementsToml)?.has("untrusted") === false) throw new Error("tools.exec.ask=always requires Codex app-server per-command approvals");
		const forceRuntimePolicy = forceUserReviewer || forceGuardianReviewer || forceDangerFullAccessSandbox;
		const defaultPolicy = explicitPolicyMode && !forceRuntimePolicy && !ignoreLegacyYoloPolicyMode ? void 0 : resolveDefaultCodexAppServerPolicy({
			transport,
			env,
			forceGuardian: normalizedPolicyMode === "guardian",
			forceUserReviewer: forceUserReviewer || !canUseModelBackedReviewer,
			execModeRequiringPromptingApprovals,
			requirementsToml,
			requirementsPath: params.requirementsPath,
			readRequirementsFile: params.readRequirementsFile,
			platform: params.platform,
			hostName: params.hostName,
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
		const serviceTier = normalizeCodexServiceTier(config.serviceTier);
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
		const configApprovalPolicy = resolveApprovalPolicy(config.approvalPolicy);
		const envApprovalPolicy = resolveApprovalPolicy(env.OPENCLAW_CODEX_APP_SERVER_APPROVAL_POLICY);
		const approvalPolicy = configApprovalPolicy ?? envApprovalPolicy ?? defaultPolicy?.approvalPolicy ?? (policyMode === "guardian" ? "on-request" : "never");
		const approvalPolicySource = configApprovalPolicy ? "config" : envApprovalPolicy ? "env" : defaultPolicy?.approvalPolicy ? "requirements" : "implicit";
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
			remoteAppsSubstrate,
			...remoteWorkspaceRoot ? { remoteWorkspaceRoot } : {},
			codeModeOnly: config.codeModeOnly === true,
			loopDetectionPreToolUseRelay: config.loopDetectionPreToolUseRelay !== false,
			requestTimeoutMs: normalizePositiveNumber(config.requestTimeoutMs, 6e4),
			approvalPolicy: forcedPolicy?.approvalPolicy ?? approvalPolicy,
			approvalPolicySource,
			sandbox: resolvedSandbox,
			approvalsReviewer: forcedPolicy?.approvalsReviewer ?? explicitApprovalsReviewer ?? defaultPolicy?.approvalsReviewer ?? (policyMode === "guardian" ? "auto_review" : "user"),
			...serviceTier ? { serviceTier } : {},
			...resolveCodexAppServerNetworkProxy(config.networkProxy, resolvedSandbox)
		};
	}
	/** Resolves the passive supervision control connection without changing harness defaults. */
	function resolveCodexSupervisionAppServerRuntimeOptions(params = {}) {
		const pluginConfig = readCodexPluginConfig(params.pluginConfig);
		const appServer = pluginConfig.appServer ?? {};
		const homeScope = resolveCodexAppServerHomeScope({
			appServer,
			connectionScope: "supervision"
		});
		return resolveCodexAppServerRuntimeOptions({
			...params,
			pluginConfig: {
				...pluginConfig,
				appServer: {
					...appServer,
					homeScope
				}
			}
		});
	}
	return {
		resolveCodexAppServerRuntimeOptions,
		resolveCodexSupervisionAppServerRuntimeOptions
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
	const marketplaceSource = readNonEmptyString(params.overrides?.marketplaceSource) ?? readNonEmptyString(config.marketplaceSource) ?? readNonEmptyString(env.OPENCLAW_CODEX_COMPUTER_USE_MARKETPLACE_SOURCE);
	const marketplacePath = readNonEmptyString(params.overrides?.marketplacePath) ?? readNonEmptyString(config.marketplacePath) ?? readNonEmptyString(env.OPENCLAW_CODEX_COMPUTER_USE_MARKETPLACE_PATH);
	const marketplaceName = readNonEmptyString(params.overrides?.marketplaceName) ?? readNonEmptyString(config.marketplaceName) ?? readNonEmptyString(env.OPENCLAW_CODEX_COMPUTER_USE_MARKETPLACE_NAME);
	const configuredPluginName = readNonEmptyString(params.overrides?.pluginName) ?? readNonEmptyString(config.pluginName) ?? readNonEmptyString(env.OPENCLAW_CODEX_COMPUTER_USE_PLUGIN_NAME);
	const configuredMcpServerName = readNonEmptyString(params.overrides?.mcpServerName) ?? readNonEmptyString(config.mcpServerName) ?? readNonEmptyString(env.OPENCLAW_CODEX_COMPUTER_USE_MCP_SERVER_NAME);
	const autoInstall = params.overrides?.autoInstall ?? config.autoInstall ?? readBooleanEnv(env.OPENCLAW_CODEX_COMPUTER_USE_AUTO_INSTALL) ?? false;
	const marketplaceDiscoveryTimeoutMs = normalizePositiveNumber(params.overrides?.marketplaceDiscoveryTimeoutMs ?? config.marketplaceDiscoveryTimeoutMs ?? readNumberEnv(env.OPENCLAW_CODEX_COMPUTER_USE_MARKETPLACE_DISCOVERY_TIMEOUT_MS), DEFAULT_CODEX_COMPUTER_USE_MARKETPLACE_DISCOVERY_TIMEOUT_MS);
	const liveTestTimeoutMs = normalizePositiveNumber(params.overrides?.liveTestTimeoutMs ?? config.liveTestTimeoutMs ?? readNumberEnv(env.OPENCLAW_CODEX_COMPUTER_USE_LIVE_TEST_TIMEOUT_MS), DEFAULT_CODEX_COMPUTER_USE_LIVE_TEST_TIMEOUT_MS);
	const toolCallTimeoutMs = normalizePositiveNumber(params.overrides?.toolCallTimeoutMs ?? config.toolCallTimeoutMs ?? readNumberEnv(env.OPENCLAW_CODEX_COMPUTER_USE_TOOL_CALL_TIMEOUT_MS), DEFAULT_CODEX_COMPUTER_USE_TOOL_CALL_TIMEOUT_MS);
	const healthCheckIntervalMinutes = normalizeComputerUseHealthCheckIntervalMinutes(params.overrides?.healthCheckIntervalMinutes ?? config.healthCheckIntervalMinutes ?? readNumberEnv(env.OPENCLAW_CODEX_COMPUTER_USE_HEALTH_CHECK_INTERVAL_MINUTES));
	const healthCheckEnabled = params.overrides?.healthCheckEnabled ?? config.healthCheckEnabled ?? readBooleanEnv(env.OPENCLAW_CODEX_COMPUTER_USE_HEALTH_CHECK_ENABLED) ?? false;
	const pluginCacheMode = normalizeComputerUsePluginCacheMode(params.overrides?.pluginCacheMode) ?? normalizeComputerUsePluginCacheMode(config.pluginCacheMode) ?? normalizeComputerUsePluginCacheMode(env.OPENCLAW_CODEX_COMPUTER_USE_PLUGIN_CACHE_MODE) ?? "independent";
	const strictReadiness = params.overrides?.strictReadiness ?? config.strictReadiness ?? readBooleanEnv(env.OPENCLAW_CODEX_COMPUTER_USE_STRICT_READINESS) ?? false;
	const autoRepair = params.overrides?.autoRepair ?? config.autoRepair ?? readBooleanEnv(env.OPENCLAW_CODEX_COMPUTER_USE_AUTO_REPAIR) ?? false;
	return {
		enabled: params.overrides?.enabled ?? config.enabled ?? readBooleanEnv(env.OPENCLAW_CODEX_COMPUTER_USE) ?? Boolean(autoInstall || marketplaceSource || marketplacePath || marketplaceName || configuredPluginName || configuredMcpServerName),
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
