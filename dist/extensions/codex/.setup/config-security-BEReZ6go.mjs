import { f as readRecord, u as readNonEmptyString } from "./config-utils-DujwEnhg.mjs";
import { t as DEFAULT_CODEX_APP_SERVER_NETWORK_PROXY_PROFILE_PREFIX } from "./config-parsing-CcB9iPoq.mjs";
import { r as normalizeCodexAppServerArgs } from "./launch-args-DbFCehO7.mjs";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createHash } from "node:crypto";
import { AgentHarnessPreflightError } from "openclaw/plugin-sdk/agent-harness-registration";
import { parse } from "smol-toml";
import { readFileSync } from "node:fs";
import path from "node:path";
import { homedir, hostname } from "node:os";
import { isLoopbackHost } from "openclaw/plugin-sdk/request-url";
//#region extensions/codex/src/app-server/config-exec-policy.ts
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
//#endregion
//#region extensions/codex/src/app-server/config-requirements.ts
const UNIX_CODEX_REQUIREMENTS_PATH = "/etc/codex/requirements.toml";
const WINDOWS_CODEX_REQUIREMENTS_SUFFIX = "\\OpenAI\\Codex\\requirements.toml";
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
	const requirements = parseCodexRequirements(content);
	const remoteSandboxModes = parseMatchingRemoteSandboxModesFromCodexRequirements(requirements, hostName);
	if (remoteSandboxModes !== void 0) return remoteSandboxModes;
	return parseRequirementsSandboxModes(readRequirementsStringArray(requirements?.allowed_sandbox_modes));
}
function parseAllowedApprovalPoliciesFromCodexRequirements(content) {
	const values = readRequirementsStringArray(parseCodexRequirements(content)?.allowed_approval_policies);
	if (values === void 0) return;
	const normalizedPolicies = values.map((entry) => normalizeRequirementsApprovalPolicy(entry)).filter((entry) => entry !== void 0);
	return normalizedPolicies.length > 0 ? new Set(normalizedPolicies) : void 0;
}
function parseAllowedApprovalsReviewersFromCodexRequirements(content) {
	const values = readRequirementsStringArray(parseCodexRequirements(content)?.allowed_approvals_reviewers);
	if (values === void 0) return;
	const normalizedReviewers = values.map((entry) => normalizeRequirementsApprovalsReviewer(entry)).filter((entry) => entry !== void 0);
	return normalizedReviewers.length > 0 ? new Set(normalizedReviewers) : void 0;
}
function parseMatchingRemoteSandboxModesFromCodexRequirements(requirements, hostName) {
	const normalizedHostName = normalizeRequirementsHostName(hostName);
	const remoteConfigs = requirements?.remote_sandbox_config;
	if (normalizedHostName === void 0 || !Array.isArray(remoteConfigs)) return;
	for (const section of remoteConfigs) {
		const config = readRecord(section);
		const patterns = readRequirementsStringArray(config?.hostname_patterns);
		if (!patterns || !requirementsHostNameMatchesAnyPattern(normalizedHostName, patterns)) continue;
		return parseRequirementsSandboxModes(readRequirementsStringArray(config?.allowed_sandbox_modes));
	}
}
function parseRequirementsSandboxModes(values) {
	if (values === void 0) return;
	const normalizedModes = values.map((entry) => normalizeRequirementsSandboxMode(entry)).filter((entry) => entry !== void 0);
	return normalizedModes.length > 0 ? new Set(normalizedModes) : void 0;
}
function parseCodexRequirements(content) {
	try {
		return parse(content, { integersAsBigInt: true });
	} catch {
		return;
	}
}
function readRequirementsStringArray(value) {
	return Array.isArray(value) && value.every((entry) => typeof entry === "string") ? value : void 0;
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
	if (normalized === "untrusted") return normalized;
	return resolveApprovalPolicy(normalized);
}
function normalizeRequirementsApprovalsReviewer(value) {
	return resolveApprovalsReviewer(value.trim().toLowerCase());
}
function selectGuardianApprovalPolicy(allowedApprovalPolicies, execModeRequiringPromptingApprovals) {
	if (allowedApprovalPolicies === void 0 || allowedApprovalPolicies.has("on-request")) return "on-request";
	if (allowedApprovalPolicies.has("untrusted")) return "untrusted";
	if (execModeRequiringPromptingApprovals) throw new Error(`tools.exec.mode=${execModeRequiringPromptingApprovals} requires Codex app-server prompting approvals`);
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
//#endregion
//#region extensions/codex/src/app-server/auth-start-options.ts
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
function withClearedEnvironmentVariables(startOptions, envVars) {
	const clearEnv = startOptions.clearEnv ?? [];
	const missingEnvVars = envVars.filter((envVar) => !clearEnv.includes(envVar));
	if (missingEnvVars.length === 0) return startOptions;
	return {
		...startOptions,
		clearEnv: [...clearEnv, ...missingEnvVars]
	};
}
//#endregion
//#region extensions/codex/src/app-server/config-security.ts
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
	const entries = Object.entries(value ?? {}).map(([key, permission]) => [key.trim(), permission === "none" ? "deny" : permission]).filter(([key]) => key.length > 0);
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
	if (policy === "untrusted") return policy;
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
	return value === "websocket" || value === "unix" ? value : "stdio";
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
/** Applies the canonical remote-auth boundary to any Codex AppServer transport. */
function assertCodexAppServerConnectionSecurity(params) {
	assertCodexAppServerConnectionClassConfig({
		connectionClass: inferCodexAppServerConnectionClass(params),
		authToken: params.authToken,
		headers: params.headers
	});
}
function isLoopbackWebSocketUrl(value) {
	let parsed;
	try {
		parsed = new URL(value);
	} catch {
		return false;
	}
	if (parsed.protocol !== "ws:" && parsed.protocol !== "wss:") return false;
	return isLoopbackHost(parsed.hostname);
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
//#endregion
export { selectForcedPromptingSandbox as A, assertCodexAppServerAllowedForOpenClawExecMode as C, resolveEffectiveOpenClawExecModeForCodexAppServer as D, resolveCodexPolicyModeForOpenClawExecMode as E, resolveSandbox as O, selectUserApprovalsReviewer as S, resolveApprovalsReviewer as T, parseAllowedApprovalsReviewersFromCodexRequirements as _, resolveCodexAppServerNetworkProxy as a, selectGuardianApprovalPolicy as b, resolveTransport as c, resolveCodexAppServerHomeDir as d, resolveCodexAppServerLocalHomeDir as f, parseAllowedApprovalPoliciesFromCodexRequirements as g, withEphemeralCodexAuthStore as h, normalizeRemoteWorkspaceRoot as i, selectGuardianSandbox as j, selectForcedDangerFullAccessSandbox as k, shouldAutoApproveCodexAppServerApprovals as l, withClearedEnvironmentVariables as m, hasCodexMcpToolApprovalOverrides as n, resolveDefaultCodexAppServerPolicy as o, resolveCodexAppServerUserHomeDir as p, inferCodexAppServerConnectionClass as r, resolvePolicyMode as s, assertCodexAppServerConnectionSecurity as t, withMcpElicitationsApprovalPolicy as u, parseAllowedSandboxModesFromCodexRequirements as v, resolveApprovalPolicy as w, selectGuardianApprovalsReviewer as x, readCodexRequirementsToml as y };
