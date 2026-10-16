import { b as readRecord, v as readNonEmptyString } from "./config-parsing-BQq-CHTF.mjs";
import { createHash } from "node:crypto";
import { AgentHarnessPreflightError } from "openclaw/plugin-sdk/agent-harness-registration";
import { parse } from "smol-toml";
import { readFileSync } from "node:fs";
import { hostname } from "node:os";
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
	if (normalized === "untrusted") return normalized;
	return resolveApprovalPolicy(normalized);
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
//#region extensions/codex/src/app-server/config-policy-json.ts
function fingerprintCodexPolicy(value) {
	return createHash("sha256").update(stringifyCodexPolicy(value)).digest("hex");
}
function stringifyCodexPolicy(value) {
	if (Array.isArray(value)) return `[${value.map((item) => stringifyCodexPolicy(item)).join(",")}]`;
	if (value && typeof value === "object") return `{${Object.entries(value).toSorted(([left], [right]) => left.localeCompare(right)).map(([key, item]) => `${JSON.stringify(key)}:${stringifyCodexPolicy(item)}`).join(",")}}`;
	return JSON.stringify(value);
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
	if (policy === "untrusted") return policy;
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
function resolveTransport(value) {
	return value === "websocket" || value === "unix" ? value : "stdio";
}
function inferCodexAppServerConnectionClass(params) {
	if (params.transport !== "websocket") return "local-loopback";
	return params.url && isLoopbackWebSocketUrl(params.url) ? "local-loopback" : "remote";
}
/** Applies the canonical remote-auth boundary to any Codex AppServer transport. */
function assertCodexAppServerConnectionSecurity(params) {
	if (inferCodexAppServerConnectionClass(params) === "remote" && !hasIdentityBearingWebSocketAuth(params)) throw new Error("remote Codex app-server WebSocket URLs require appServer.authToken or an Authorization header");
}
function isLoopbackWebSocketUrl(value) {
	const parsed = URL.parse(value);
	if (parsed?.protocol !== "ws:" && parsed?.protocol !== "wss:") return false;
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
//#endregion
export { selectForcedPromptingSandbox as C, selectForcedDangerFullAccessSandbox as S, resolveApprovalPolicy as _, resolveDefaultCodexAppServerPolicy as a, resolveEffectiveOpenClawExecModeForCodexAppServer as b, shouldAutoApproveCodexAppServerApprovals as c, parseCodexRequirementsPolicy as d, readCodexRequirementsToml as f, assertCodexAppServerAllowedForOpenClawExecMode as g, selectUserApprovalsReviewer as h, resolveCodexAppServerNetworkProxy as i, withMcpElicitationsApprovalPolicy as l, selectGuardianApprovalsReviewer as m, hasCodexMcpToolApprovalOverrides as n, resolvePolicyMode as o, selectGuardianApprovalPolicy as p, inferCodexAppServerConnectionClass as r, resolveTransport as s, assertCodexAppServerConnectionSecurity as t, fingerprintCodexPolicy as u, resolveApprovalsReviewer as v, selectGuardianSandbox as w, resolveSandbox as x, resolveCodexPolicyModeForOpenClawExecMode as y };
