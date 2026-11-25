import { c as readNumberEnv, i as normalizeHeaders, l as readRecord, n as hashSecretForKey, s as readNonEmptyString, u as resolveArgs } from "./config-utils-QUqoHnvX.mjs";
import { c as assertCodexAppServerCommandHasNoInlineArgs, i as DEFAULT_CODEX_COMPUTER_USE_MARKETPLACE_DISCOVERY_TIMEOUT_MS, o as DEFAULT_CODEX_COMPUTER_USE_PLUGIN_NAME, r as DEFAULT_CODEX_COMPUTER_USE_LIVE_TEST_TIMEOUT_MS, s as DEFAULT_CODEX_COMPUTER_USE_TOOL_CALL_TIMEOUT_MS } from "./config-parsing-BugaRTEy.mjs";
import { r as isJsonObject } from "./protocol-NX-eGZn-.mjs";
import { i as readCodexAppServerConfigOptions, n as isCodexAppServerProxyLaunch, r as normalizeCodexAppServerArgs } from "./launch-args-DWBRnfHh.mjs";
import { normalizeOptionalString, normalizeTrimmedStringList, parseBooleanValue } from "openclaw/plugin-sdk/string-coerce-runtime";
import { normalizeResolvedSecretInputString } from "openclaw/plugin-sdk/secret-input";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { AgentHarnessPreflightError } from "openclaw/plugin-sdk/agent-harness-registration";
import { isDeepStrictEqual } from "node:util";
import { parse } from "smol-toml";
import { resolvePositiveTimerTimeoutMs } from "openclaw/plugin-sdk/number-runtime";
import { isStringArray } from "openclaw/plugin-sdk/collection-input-runtime";
import { escapeRegExp } from "openclaw/plugin-sdk/text-utility-runtime";
import { homedir, hostname } from "node:os";
import { isLoopbackHost } from "openclaw/plugin-sdk/request-url";
// extensions/codex/src/app-server/config-exec-policy.ts
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
	return [
		"workspace-write",
		"read-only",
		"danger-full-access"
	].find((mode) => allowedSandboxModes?.has(mode)) ?? "workspace-write";
}
function resolveApprovalPolicy(value) {
	if (value === "untrusted") throw new Error("Codex app-server approval policy \"untrusted\" is retired; run \"openclaw doctor --fix\" and use \"on-request\".");
	if (value === "on-failure") return "on-request";
	return value === "on-request" || value === "never" ? value : void 0;
}
function resolveSandbox(value) {
	return value === "read-only" || value === "workspace-write" || value === "danger-full-access" ? value : void 0;
}
function resolveApprovalsReviewer(value) {
	return value === "auto_review" || value === "guardian_subagent" || value === "user" ? value : void 0;
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
	if (mode === "deny" || mode === "allowlist") throw new AgentHarnessPreflightError(`Codex app-server local execution is unavailable because effective tools.exec.mode=${mode}. Execution-host approvals are authoritative. For gateway turns, inspect them with \`openclaw approvals get --gateway\` and update that same target with \`openclaw approvals set --gateway --stdin\`; for local \`agent exec\`, omit \`--gateway\`. Intentionally align that host policy before retrying.`, { scope: "harness" });
}
// extensions/codex/src/app-server/config-requirements.ts
const UNIX_CODEX_REQUIREMENTS_PATH = "/etc/codex/requirements.toml";
const WINDOWS_CODEX_REQUIREMENTS_SUFFIX = "\\OpenAI\\Codex\\requirements.toml";
function readCodexRequirementsToml(params) {
	if (params.requirementsToml !== void 0) return params.requirementsToml ?? void 0;
	const requirementsPath = resolveCodexRequirementsPath(params.env ?? process.env, params.platform ?? process.platform);
	try {
		return readFileSync(requirementsPath, "utf8");
	} catch {
		return;
	}
}
function resolveCodexRequirementsPath(env, platform) {
	if (platform === "win32") return `${(readNonEmptyString(env.ProgramData) ?? "C:\\ProgramData").replace(/[\\/]+$/, "")}${WINDOWS_CODEX_REQUIREMENTS_SUFFIX}`;
	return UNIX_CODEX_REQUIREMENTS_PATH;
}
function parseCodexRequirementsPolicy(content, hostName = "") {
	const requirements = content === void 0 ? void 0 : parseCodexRequirements(content);
	return {
		allowedSandboxModes: parseMatchingRemoteSandboxModesFromCodexRequirements(requirements, hostName) ?? parseRequirementsValues(requirements?.allowed_sandbox_modes, normalizeRequirementsSandboxMode),
		allowedApprovalPolicies: parseRequirementsValues(requirements?.allowed_approval_policies, normalizeRequirementsApprovalPolicy),
		allowedApprovalsReviewers: parseRequirementsValues(requirements?.allowed_approvals_reviewers, (value) => resolveApprovalsReviewer(value.trim().toLowerCase()))
	};
}
function parseMatchingRemoteSandboxModesFromCodexRequirements(requirements, hostName) {
	const normalizedHostName = normalizeRequirementsHostName(hostName);
	const remoteConfigs = requirements?.remote_sandbox_config;
	if (normalizedHostName === void 0 || !Array.isArray(remoteConfigs)) return;
	for (const section of remoteConfigs) {
		const config = readRecord(section);
		const patterns = readRequirementsStringArray(config?.hostname_patterns);
		if (!patterns || !requirementsHostNameMatchesAnyPattern(normalizedHostName, patterns)) continue;
		return parseRequirementsValues(config?.allowed_sandbox_modes, normalizeRequirementsSandboxMode);
	}
}
function parseRequirementsValues(value, normalize) {
	const values = readRequirementsStringArray(value);
	if (values === void 0) return;
	const normalized = values.map(normalize).filter((entry) => entry !== void 0);
	return normalized.length > 0 ? new Set(normalized) : void 0;
}
function parseCodexRequirements(content) {
	try {
		return parse(content, { integersAsBigInt: true });
	} catch {
		return;
	}
}
function readRequirementsStringArray(value) {
	return isStringArray(value) ? value : void 0;
}
function normalizeRequirementsSandboxMode(value) {
	const compact = value.replace(/[\s_-]/g, "").toLowerCase();
	return [
		"read-only",
		"workspace-write",
		"danger-full-access"
	].find((mode) => mode.replaceAll("-", "") === compact);
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
	const regex = escapeRegExp(pattern).replaceAll("\\*", ".*").replaceAll("\\?", ".");
	return new RegExp(`^${regex}$`).test(value);
}
function normalizeRequirementsApprovalPolicy(value) {
	const normalized = value.trim().toLowerCase();
	if (normalized === "untrusted") return normalized;
	return resolveApprovalPolicy(normalized);
}
function selectGuardianApprovalPolicy(allowedApprovalPolicies, execModeRequiringPromptingApprovals) {
	return selectManagedPolicy(allowedApprovalPolicies, [
		"on-request",
		"untrusted",
		"never"
	], execModeRequiringPromptingApprovals && `tools.exec.mode=${execModeRequiringPromptingApprovals} requires Codex app-server prompting approvals`);
}
function selectGuardianApprovalsReviewer(allowedApprovalsReviewers, execModeRequiringAutoReviewer) {
	return selectManagedPolicy(allowedApprovalsReviewers, [
		"auto_review",
		"guardian_subagent",
		"user"
	], execModeRequiringAutoReviewer && `tools.exec.mode=${execModeRequiringAutoReviewer} requires Codex app-server auto approvals`);
}
function selectUserApprovalsReviewer(allowedApprovalsReviewers, execModeRequiringUserReviewer) {
	if (allowedApprovalsReviewers === void 0 || allowedApprovalsReviewers.has("user")) return "user";
	throw new Error(`tools.exec.mode=${execModeRequiringUserReviewer ?? "ask"} requires Codex app-server user approvals`);
}
function selectManagedPolicy(allowed, [preferred, alternate, fallback], requiredMessage) {
	if (allowed === void 0 || allowed.has(preferred)) return preferred;
	if (allowed.has(alternate)) return alternate;
	if (requiredMessage) throw new Error(requiredMessage);
	return allowed.has(fallback) ? fallback : preferred;
}
// extensions/codex/src/app-server/auth-start-options.ts
const CODEX_APP_SERVER_HOME_DIRNAME = "codex-home";
const CODEX_EPHEMERAL_AUTH_STORE_OVERRIDE = "cli_auth_credentials_store=\"ephemeral\"";
function resolveCodexAppServerHomeDir(agentDir) {
	if (!agentDir) throw new Error("Agent-scoped Codex requires an OpenClaw agent directory");
	return path.join(path.resolve(agentDir), CODEX_APP_SERVER_HOME_DIRNAME);
}
/** Resolves the native user Codex home used by Desktop and the CLI. */
function resolveCodexAppServerUserHomeDir(env = process.env, homedir$1 = homedir) {
	const configured = normalizeOptionalString(env.CODEX_HOME);
	return path.resolve(configured ?? path.join(homedir$1(), ".codex"));
}
/** Resolves the local CODEX_HOME used when starting one app-server connection. */
function resolveCodexAppServerLocalHomeDir(startOptions, agentDir, env = process.env) {
	if (startOptions.codexHome) return startOptions.codexHome;
	const configured = startOptions.env?.CODEX_HOME;
	if (configured?.trim()) return configured;
	return startOptions.homeScope === "user" ? resolveCodexAppServerUserHomeDir(env) : resolveCodexAppServerHomeDir(agentDir);
}
/**
* Rollout paths name files on this host only when a local transport runs Codex
* against the home OpenClaw selected; remote or redirected homes stay unreadable.
*/
function resolveCodexAppServerVerifiedLocalHomeDir(appServer, agentDir, actualHome) {
	if (appServer.start.transport !== "stdio" && appServer.start.transport !== "unix" || appServer.remoteWorkspaceRoot || !actualHome) return;
	const home = resolveCodexAppServerLocalHomeDir(appServer.start, agentDir);
	return path.resolve(actualHome) === path.resolve(home) ? home : void 0;
}
/** Forces OpenClaw-owned Codex auth to remain process-local. */
function withEphemeralCodexAuthStore(params) {
	const { startOptions } = params;
	if (!params.preparedAuth && params.authProfileId === null) return startOptions;
	const args = normalizeCodexAppServerArgs(startOptions.args, CODEX_EPHEMERAL_AUTH_STORE_OVERRIDE);
	return args === startOptions.args ? startOptions : {
		...startOptions,
		args
	};
}
function usesManagedCodexThreadUnloading(start) {
	return start.transport === "stdio" && start.homeScope !== "user" && !isCodexAppServerProxyLaunch(start.args);
}
function withManagedCodexThreadUnloading(startOptions) {
	if (!usesManagedCodexThreadUnloading(startOptions)) return startOptions;
	const args = normalizeCodexAppServerArgs(startOptions.args, "thread_unload_delay_secs=0");
	return args === startOptions.args ? startOptions : {
		...startOptions,
		args
	};
}
function withClearedEnvironmentVariables(startOptions, envVars) {
	const clearEnv = startOptions.clearEnv ?? [];
	const missingEnvVars = envVars.filter((envVar) => !clearEnv.includes(envVar));
	if (missingEnvVars.length === 0) return startOptions;
	return {
		...startOptions,
		clearEnv: [...clearEnv, ...missingEnvVars]
	};
}
// extensions/codex/src/app-server/config-layer-policy.ts
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
function readCodexConfigValue(config, key) {
	if (Object.hasOwn(config, key)) return config[key];
	const separator = key.indexOf(".");
	if (separator < 0) return;
	const child = config[key.slice(0, separator)];
	return isJsonObject(child) ? readCodexConfigValue(child, key.slice(separator + 1)) : void 0;
}
function readCodexAuthoredConfigValue(snapshot, key) {
	const origin = snapshot.origins[key];
	if (!origin) return;
	const effective = readCodexConfigValue(snapshot.config, key);
	if (effective !== void 0) return effective;
	const layer = snapshot.layers?.find((entry) => isJsonObject(entry) && !entry.disabledReason && entry.version === origin.version && isDeepStrictEqual(entry.name, origin.name));
	return isJsonObject(layer) && isJsonObject(layer.config) ? readCodexConfigValue(layer.config, key) : void 0;
}
// extensions/codex/src/app-server/config-reviewer-policy.ts
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
// extensions/codex/src/app-server/config-policy-json.ts
function fingerprintCodexPolicy(value) {
	return createHash("sha256").update(stringifyCodexPolicy(value)).digest("hex");
}
function stringifyCodexPolicy(value) {
	if (Array.isArray(value)) return `[${value.map((item) => stringifyCodexPolicy(item)).join(",")}]`;
	if (value && typeof value === "object") return `{${Object.entries(value).toSorted(([left], [right]) => left.localeCompare(right)).map(([key, item]) => `${JSON.stringify(key)}:${stringifyCodexPolicy(item)}`).join(",")}}`;
	return JSON.stringify(value);
}
// extensions/codex/src/app-server/config-security.ts
function shouldAutoApproveCodexAppServerApprovals(appServer) {
	return appServer.networkProxy === void 0 && appServer.approvalPolicy === "never" && appServer.sandbox === "danger-full-access";
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
	const profileName = readNonEmptyString(config.profileName) ?? `openclaw-network-${fingerprintCodexPolicy({
		version: 1,
		profile
	}).slice(0, 16)}`;
	const configPatch = {
		"features.network_proxy.enabled": true,
		default_permissions: profileName,
		permissions: { [profileName]: profile }
	};
	return { networkProxy: {
		profileName,
		configFingerprint: fingerprintCodexPolicy(configPatch),
		configPatch
	} };
}
function normalizeNetworkProxyPermissionMap(value) {
	const entries = Object.entries(value ?? {}).map(([key, permission]) => [key.trim(), permission === "none" ? "deny" : permission]).filter(([key]) => key.length > 0);
	return entries.length > 0 ? Object.fromEntries(entries) : void 0;
}
function removeUndefinedJsonFields(value) {
	return Object.fromEntries(Object.entries(value).filter((entry) => entry[1] !== void 0));
}
/** Explicit MCP prompting must bypass Codex's unconditional Never-policy approval. */
function hasCodexMcpToolApprovalOverrides(servers, serverNames, projectedMcpServers) {
	const modes = new Map(Object.entries(projectedMcpServers ?? {}).map(([name, server]) => [name, server.default_tools_approval_mode]));
	for (const name of serverNames ?? Object.keys(servers ?? {})) {
		const server = servers?.[name];
		const mode = server?.codex?.defaultToolsApprovalMode;
		if (mode !== void 0 && (serverNames !== void 0 || server?.enabled !== false)) modes.set(name, mode);
	}
	return [...modes.values()].some((mode) => mode === "auto" || mode === "prompt");
}
function withMcpElicitationsApprovalPolicy(policy) {
	if (policy === "untrusted" || policy === "on-request") return policy;
	if (typeof policy !== "string") return { granular: {
		...policy.granular,
		mcp_elicitations: true
	} };
	const prompting = policy !== "never";
	return { granular: {
		mcp_elicitations: true,
		rules: prompting,
		sandbox_approval: prompting,
		request_permissions: prompting,
		skill_approval: prompting
	} };
}
function inferCodexAppServerConnectionClass(params) {
	if (params.transport !== "websocket") return "local-loopback";
	const parsed = params.url ? URL.parse(params.url) : null;
	return (parsed?.protocol === "ws:" || parsed?.protocol === "wss:") && isLoopbackHost(parsed.hostname) ? "local-loopback" : "remote";
}
/** Applies the canonical remote-auth boundary to any Codex AppServer transport. */
function assertCodexAppServerConnectionSecurity(params) {
	if (inferCodexAppServerConnectionClass(params) === "remote" && !readNonEmptyString(params.authToken) && !Object.entries(params.headers).some(([key, value]) => key.trim().toLowerCase() === "authorization" && Boolean(readNonEmptyString(value)))) throw new Error("remote Codex app-server WebSocket URLs require appServer.authToken or an Authorization header");
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
	if (content === void 0 && !params.forceGuardian) return {
		mode: "yolo",
		dangerFullAccessAllowed: true
	};
	const { allowedSandboxModes, allowedApprovalPolicies, allowedApprovalsReviewers } = parseCodexRequirementsPolicy(content, content === void 0 ? void 0 : readNonEmptyString(params.hostName) ?? hostname());
	const yoloSandboxAllowed = allowedSandboxModes === void 0 || allowedSandboxModes.has("danger-full-access");
	const yoloApprovalAllowed = allowedApprovalPolicies === void 0 || allowedApprovalPolicies.has("never") && !allowedApprovalPolicies.has("untrusted");
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
// extensions/codex/src/app-server/config-options.ts
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
function resolveCodexAppServerRequestTimeoutMs(pluginConfig) {
	return resolvePositiveTimerTimeoutMs(pluginConfig?.appServer?.requestTimeoutMs, 6e4);
}
function createCodexAppServerConfig({ resolveProviderIdForAuth }) {
	function resolveRuntimeOptions(params, connectionScope) {
		const env = params.env ?? process.env;
		const pluginConfig = params.pluginConfig ?? {};
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
			pluginConfig,
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
			requestTimeoutMs: resolveCodexAppServerRequestTimeoutMs(pluginConfig),
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
	const config = params.pluginConfig?.computerUse ?? {};
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
		managedGitConfigParameters: hashSecretForKey(options.managedGitConfigParameters, "managedGitConfigParameters"),
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
export { parseCodexRequirementsPolicy as A, resolveCodexAppServerLocalHomeDir as C, withClearedEnvironmentVariables as D, usesManagedCodexThreadUnloading as E, selectGuardianSandbox as F, selectGuardianApprovalPolicy as M, selectGuardianApprovalsReviewer as N, withEphemeralCodexAuthStore as O, selectUserApprovalsReviewer as P, resolveCodexAppServerHomeDir as S, resolveCodexAppServerVerifiedLocalHomeDir as T, resolveCodexModelBackedReviewerPolicyContext as _, resolveCodexAppServerRequestTimeoutMs as a, readCodexConfigValue as b, assertCodexAppServerConnectionSecurity as c, resolveCodexAppServerNetworkProxy as d, shouldAutoApproveCodexAppServerApprovals as f, canUseCodexModelBackedApprovalsReviewerForModel as g, assertCodexModelBackedReviewerEffectiveConfig as h, resolveCodexAppServerHomeScope as i, readCodexRequirementsToml as j, withManagedCodexThreadUnloading as k, hasCodexMcpToolApprovalOverrides as l, fingerprintCodexPolicy as m, codexSandboxPolicyForTurn as n, resolveCodexAppServerStartOptionsForAgent as o, withMcpElicitationsApprovalPolicy as p, createCodexAppServerConfig as r, resolveCodexComputerUseConfig as s, codexAppServerStartOptionsKey as t, inferCodexAppServerConnectionClass as u, CODEX_SESSION_OVERRIDABLE_LAYER_TYPES as v, resolveCodexAppServerUserHomeDir as w, readCodexEffectiveConfig as x, readCodexAuthoredConfigValue as y };
