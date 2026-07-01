import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import { c as isRecord } from "./utils-BApvfmPs.js";
import { s as coerceSecretRef } from "./types.secrets-lIZQEgMF.js";
import { u as normalizeAgentId } from "./session-key-pTKRJb0m.js";
import { t as asBoolean } from "./boolean-CrriykWV.js";
import "./string-coerce-runtime-BiZzULo_.js";
import { l as normalizeProviderId } from "./provider-model-shared-pp09751S.js";
import "./routing-DGrdyZ4S.js";
import "./secret-input-Dq7Mxf9Y.js";
import { o as registerHealthCheck } from "./health-check-registry-CBs_fO63.js";
import "./health-DMsgwu1t.js";
import JSON5 from "json5";
import { basename, isAbsolute, resolve } from "node:path";
import os from "node:os";
import { createHash } from "node:crypto";
//#region extensions/policy/src/tool-policy-conformance.ts
const POLICY_TOOL_GROUPS = {
	"group:openclaw": [
		"code_execution",
		"web_search",
		"web_fetch",
		"x_search",
		"memory_search",
		"memory_get",
		"sessions_list",
		"sessions_history",
		"sessions_send",
		"sessions_spawn",
		"sessions_yield",
		"subagents",
		"session_status",
		"browser",
		"message",
		"heartbeat_respond",
		"cron",
		"gateway",
		"nodes",
		"agents_list",
		"update_plan",
		"image",
		"image_generate",
		"music_generate",
		"video_generate",
		"tts"
	],
	"group:fs": [
		"read",
		"write",
		"edit",
		"apply_patch"
	],
	"group:runtime": [
		"exec",
		"process",
		"code_execution"
	],
	"group:web": [
		"web_search",
		"web_fetch",
		"x_search"
	],
	"group:memory": ["memory_search", "memory_get"],
	"group:sessions": [
		"sessions_list",
		"sessions_history",
		"sessions_send",
		"sessions_spawn",
		"sessions_yield",
		"subagents",
		"session_status"
	],
	"group:ui": ["browser", "canvas"],
	"group:messaging": ["message"],
	"group:automation": [
		"heartbeat_respond",
		"cron",
		"gateway"
	],
	"group:nodes": ["nodes"],
	"group:agents": ["agents_list", "update_plan"],
	"group:media": [
		"image",
		"image_generate",
		"music_generate",
		"video_generate",
		"tts"
	]
};
//#endregion
//#region extensions/policy/src/policy-state.ts
const DEFAULT_POLICY_SANDBOX_BROWSER_NETWORK = "openclaw-sandbox-browser";
const DEFAULT_EXEC_APPROVAL_AGENT_ID = "main";
const ALLOWLIST_DEFAULT_INGRESS_GROUP_POLICY_CHANNELS = new Set([
	"googlechat",
	"irc",
	"line",
	"mattermost",
	"matrix",
	"msteams",
	"nextcloud-talk",
	"signal"
]);
const OPEN_GROUPS_DEFAULT_TO_NO_MENTION_CHANNELS = new Set(["feishu", "qa-channel"]);
const RESERVED_CHANNEL_CONFIG_KEYS = new Set(["defaults", "modelByChannel"]);
const NON_SLUG_CHARS = /[^a-z0-9-]+/g;
const COLLAPSE_HYPHENS = /-+/g;
const TRIM_HYPHENS = /^-+|-+$/g;
function policyDocumentHash(policy) {
	return sha256(stableJson(policy));
}
function policyWorkspaceHash(evidence) {
	return sha256(stableJson(evidence));
}
function policyFindingsHash(findings) {
	return sha256(stableJson(findings));
}
function policyAttestationHash(input) {
	return sha256(stableJson(input));
}
function createPolicyAttestation(input) {
	const workspaceHash = policyWorkspaceHash(input.evidence);
	const findingsHash = policyFindingsHash(input.findings);
	return {
		checkedAt: input.checkedAt,
		...input.policyHash === void 0 ? {} : { policy: {
			path: input.policyPath,
			hash: input.policyHash
		} },
		workspace: {
			scope: "policy",
			hash: workspaceHash
		},
		findingsHash,
		attestationHash: policyAttestationHash({
			ok: input.ok,
			policyHash: input.policyHash,
			workspaceHash,
			findingsHash
		})
	};
}
function collectPolicyEvidence(cfg, options = {}) {
	const evidence = {
		channels: scanPolicyChannels(cfg),
		mcpServers: scanPolicyMcpServers(cfg),
		modelProviders: scanPolicyModelProviders(cfg),
		modelRefs: scanPolicyModelRefs(cfg),
		network: scanPolicyNetwork(cfg),
		...options.includeIngress === false ? {} : { ingress: scanPolicyIngress(cfg) },
		...options.includeGatewayExposure === false ? {} : { gatewayExposure: scanPolicyGatewayExposure(cfg) },
		...options.includeAgentWorkspace === false ? {} : { agentWorkspace: scanPolicyAgentWorkspace(cfg) },
		...options.includeDataHandling === false ? {} : { dataHandling: scanPolicyDataHandling(cfg) },
		...options.includeToolPosture === false ? {} : { toolPosture: scanPolicyToolPosture(cfg) },
		...options.includeSandboxPosture === false ? {} : { sandboxPosture: scanPolicySandboxPosture(cfg) },
		...options.includeSecrets === false ? {} : { secrets: scanPolicySecrets(cfg) },
		...options.includeAuthProfiles === false ? {} : { authProfiles: scanPolicyAuthProfiles(cfg) },
		...options.includeExecApprovals === false || options.execApprovalsRaw === void 0 ? {} : { execApprovals: options.execApprovalsRaw === null ? [] : scanPolicyExecApprovals(options.execApprovalsRaw) }
	};
	if (options.toolsRaw === void 0) return evidence;
	return scanPolicyTools(options.toolsRaw).then((tools) => ({
		...evidence,
		tools
	}));
}
function scanPolicyExecApprovals(raw) {
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch {
		return [];
	}
	if (!isRecord(parsed) || parsed.version !== 1) return [];
	const evidence = [];
	const defaults = isRecord(parsed.defaults) ? parsed.defaults : {};
	evidence.push(execApprovalPostureEvidence("defaults", "defaults", defaults, "oc://exec-approvals.json/defaults"));
	for (const agent of normalizedExecApprovalAgents(parsed.agents)) {
		const agentSource = `oc://exec-approvals.json/agents/${ocPathSegment$1(agent.sourceAgentId)}`;
		evidence.push(execApprovalPostureEvidence(`agent:${agent.agentId}`, "agent", agent.value, agentSource, agent.agentId));
		for (const [index, entry] of agent.allowlistEntries.entries()) {
			const allowlistSource = `oc://exec-approvals.json/agents/${ocPathSegment$1(entry.sourceAgentId)}/allowlist/#${entry.index}`;
			evidence.push({
				id: `agent:${agent.agentId}:allowlist:${index}`,
				kind: "allowlist",
				source: allowlistSource,
				agentId: agent.agentId,
				pattern: entry.pattern,
				...entry.argPattern === void 0 ? {} : { argPattern: entry.argPattern },
				...entry.entrySource === void 0 ? {} : { entrySource: entry.entrySource }
			});
		}
	}
	return evidence;
}
function execApprovalPostureEvidence(id, kind, value, source, agentId) {
	const security = readExecApprovalSecurity(value.security);
	const ask = readExecApprovalAsk(value.ask);
	const askFallback = readExecApprovalSecurity(value.askFallback);
	const autoAllowSkills = asBoolean(value.autoAllowSkills);
	return {
		id,
		kind,
		source,
		...agentId === void 0 ? {} : { agentId },
		...value.security == null ? {} : { securityConfigured: true },
		...security === void 0 ? {} : { security },
		...ask === void 0 ? {} : { ask },
		...askFallback === void 0 ? {} : { askFallback },
		...autoAllowSkills === void 0 ? {} : { autoAllowSkills }
	};
}
function readExecApprovalSecurity(value) {
	const normalized = normalizeOptionalString(value);
	return normalized === "deny" || normalized === "allowlist" || normalized === "full" ? normalized : void 0;
}
function readExecApprovalAsk(value) {
	const normalized = normalizeOptionalString(value);
	return normalized === "off" || normalized === "on-miss" || normalized === "always" ? normalized : void 0;
}
function normalizedExecApprovalAgents(rawAgents) {
	if (!isRecord(rawAgents)) return [];
	const agents = Object.entries(rawAgents).filter((entry) => isRecord(entry[1]));
	const legacyDefault = agents.find(([agentId]) => agentId === "default")?.[1];
	const normalized = agents.filter(([agentId]) => agentId !== "default").map(([agentId, value]) => {
		if (agentId === DEFAULT_EXEC_APPROVAL_AGENT_ID && legacyDefault !== void 0) return {
			agentId,
			sourceAgentId: agentId,
			value: mergeLegacyExecApprovalAgent(value, legacyDefault),
			allowlistEntries: mergedExecApprovalAllowlistEntries(value.allowlist, legacyDefault.allowlist)
		};
		return execApprovalAgentFromParts(agentId, agentId, value);
	});
	if (legacyDefault !== void 0 && !agents.some(([agentId]) => agentId === DEFAULT_EXEC_APPROVAL_AGENT_ID)) normalized.push(execApprovalAgentFromParts(DEFAULT_EXEC_APPROVAL_AGENT_ID, "default", legacyDefault));
	return normalized.toSorted((a, b) => a.agentId.localeCompare(b.agentId));
}
function execApprovalAgentFromParts(agentId, sourceAgentId, value) {
	return {
		agentId,
		sourceAgentId,
		value,
		allowlistEntries: execApprovalAllowlistEntries$1(value.allowlist).map((entry) => ({
			index: entry.index,
			pattern: entry.pattern,
			argPattern: entry.argPattern,
			entrySource: entry.entrySource,
			sourceAgentId
		}))
	};
}
function mergeLegacyExecApprovalAgent(current, legacy) {
	return {
		...legacy,
		...current,
		security: current.security ?? legacy.security,
		ask: current.ask ?? legacy.ask,
		askFallback: current.askFallback ?? legacy.askFallback,
		autoAllowSkills: current.autoAllowSkills ?? legacy.autoAllowSkills,
		allowlist: mergedExecApprovalAllowlist(current.allowlist, legacy.allowlist)
	};
}
function mergedExecApprovalAllowlist(current, legacy) {
	const entries = mergedExecApprovalAllowlistEntries(current, legacy).map((entry) => {
		const allowlistEntry = { pattern: entry.pattern };
		if (entry.argPattern !== void 0) allowlistEntry.argPattern = entry.argPattern;
		if (entry.entrySource !== void 0) allowlistEntry.source = entry.entrySource;
		return allowlistEntry;
	});
	return entries.length === 0 ? void 0 : entries;
}
function mergedExecApprovalAllowlistEntries(current, legacy) {
	const entries = [];
	const seen = /* @__PURE__ */ new Set();
	const appendEntries = (sourceEntries) => {
		for (const sourceEntry of sourceEntries) {
			const key = `${sourceEntry.pattern.toLowerCase()}\x00${sourceEntry.argPattern ?? ""}`;
			if (seen.has(key)) continue;
			seen.add(key);
			entries.push(sourceEntry);
		}
	};
	appendEntries(withExecApprovalAllowlistSource(current, DEFAULT_EXEC_APPROVAL_AGENT_ID));
	appendEntries(withExecApprovalAllowlistSource(legacy, "default"));
	return entries;
}
function withExecApprovalAllowlistSource(value, sourceAgentId) {
	return execApprovalAllowlistEntries$1(value).map((entry) => ({
		index: entry.index,
		pattern: entry.pattern,
		argPattern: entry.argPattern,
		entrySource: entry.entrySource,
		sourceAgentId
	}));
}
function readExecApprovalAllowlistEntrySource(value) {
	return normalizeOptionalString(value) === "allow-always" ? "allow-always" : void 0;
}
function execApprovalAllowlistEntries$1(value) {
	if (!Array.isArray(value)) return [];
	const entries = [];
	for (const [index, entry] of value.entries()) {
		if (typeof entry === "string") {
			const pattern = entry.trim();
			if (pattern !== "") entries.push({
				index,
				pattern
			});
			continue;
		}
		if (!isRecord(entry)) continue;
		const pattern = normalizeOptionalString(entry.pattern);
		if (pattern === void 0) continue;
		const argPattern = normalizeOptionalString(entry.argPattern);
		const entrySource = readExecApprovalAllowlistEntrySource(entry.source);
		entries.push({
			index,
			pattern,
			...argPattern === void 0 ? {} : { argPattern },
			...entrySource === void 0 ? {} : { entrySource }
		});
	}
	return entries;
}
function scanPolicyChannels(cfg) {
	return Object.entries(configuredChannels(cfg)).filter(([id]) => !RESERVED_CHANNEL_CONFIG_KEYS.has(id)).toSorted(([a], [b]) => a.localeCompare(b)).map(([id, value]) => {
		const entry = {
			id,
			provider: id,
			source: `oc://openclaw.config/channels/${id}`
		};
		if (isRecord(value) && typeof value.enabled === "boolean") entry.enabled = value.enabled;
		return entry;
	});
}
function scanPolicyMcpServers(cfg) {
	return Object.entries(configuredMcpServers(cfg)).toSorted(([a], [b]) => a.localeCompare(b)).map(([id, value]) => {
		const entry = {
			id,
			transport: mcpServerTransport(value),
			source: `oc://openclaw.config/mcp/servers/${ocPathSegment$1(id)}`
		};
		if (isRecord(value)) {
			if (typeof value.command === "string") entry.command = value.command;
			if (typeof value.url === "string") entry.url = redactMcpUrlForEvidence(value.url);
		}
		return entry;
	});
}
function scanPolicyModelProviders(cfg) {
	return Object.keys(configuredModelProviders(cfg)).toSorted((a, b) => a.localeCompare(b)).map((id) => ({
		id: normalizeProviderId(id),
		source: `oc://openclaw.config/models/providers/${id}`
	}));
}
function scanPolicyModelRefs(cfg) {
	const refs = [];
	if (isRecord(cfg.agents)) {
		collectModelRefsFromRecord(refs, cfg.agents, "oc://openclaw.config/agents");
		collectModelRefsFromAgentAllowlist(refs, cfg.agents);
	}
	return refs.toSorted((a, b) => a.provider.localeCompare(b.provider) || a.model.localeCompare(b.model));
}
function scanPolicyNetwork(cfg) {
	return [
		networkBooleanEvidence(cfg, "browser-private-network", [
			"browser",
			"ssrfPolicy",
			"dangerouslyAllowPrivateNetwork"
		], "oc://openclaw.config/browser/ssrfPolicy/dangerouslyAllowPrivateNetwork"),
		networkBooleanEvidence(cfg, "browser-private-network-legacy", [
			"browser",
			"ssrfPolicy",
			"allowPrivateNetwork"
		], "oc://openclaw.config/browser/ssrfPolicy/allowPrivateNetwork"),
		networkBooleanEvidence(cfg, "web-fetch-private-network", [
			"tools",
			"web",
			"fetch",
			"ssrfPolicy",
			"dangerouslyAllowPrivateNetwork"
		], "oc://openclaw.config/tools/web/fetch/ssrfPolicy/dangerouslyAllowPrivateNetwork"),
		networkBooleanEvidence(cfg, "web-fetch-private-network-legacy", [
			"tools",
			"web",
			"fetch",
			"ssrfPolicy",
			"allowPrivateNetwork"
		], "oc://openclaw.config/tools/web/fetch/ssrfPolicy/allowPrivateNetwork"),
		networkBooleanEvidence(cfg, "web-fetch-rfc2544-benchmark-range", [
			"tools",
			"web",
			"fetch",
			"ssrfPolicy",
			"allowRfc2544BenchmarkRange"
		], "oc://openclaw.config/tools/web/fetch/ssrfPolicy/allowRfc2544BenchmarkRange"),
		networkBooleanEvidence(cfg, "web-fetch-ipv6-unique-local-range", [
			"tools",
			"web",
			"fetch",
			"ssrfPolicy",
			"allowIpv6UniqueLocalRange"
		], "oc://openclaw.config/tools/web/fetch/ssrfPolicy/allowIpv6UniqueLocalRange")
	].filter((entry) => entry !== void 0);
}
function scanPolicyIngress(cfg) {
	const channels = configuredChannels(cfg);
	const inheritedChannelDefaults = pickSupportedIngressDefaults(isRecord(channels.defaults) ? channels.defaults : {});
	const channelDefaultsSource = "oc://openclaw.config/channels/defaults";
	const entries = [];
	const dmScope = normalizeOptionalString((isRecord(cfg.session) ? cfg.session : {}).dmScope)?.toLowerCase();
	entries.push({
		id: "session-dm-scope",
		kind: "sessionDmScope",
		source: "oc://openclaw.config/session/dmScope",
		value: dmScope ?? "main",
		explicit: dmScope !== void 0
	});
	for (const [channel, value] of Object.entries(channels)) {
		if (RESERVED_CHANNEL_CONFIG_KEYS.has(channel) || !isRecord(value) || value.enabled === false) continue;
		const channelSource = `oc://openclaw.config/channels/${ocPathSegment$1(channel)}`;
		const accounts = isRecord(value.accounts) ? value.accounts : {};
		const configuredAccounts = Object.entries(accounts).filter((entry) => isRecord(entry[1]));
		const activeAccounts = configuredAccounts.filter(([, account]) => account.enabled !== false);
		if (configuredAccounts.length === 0 || hasImplicitDefaultAccountConfig(channel, value)) pushChannelIngress(entries, {
			channel,
			config: value,
			inheritedConfig: inheritedChannelDefaults,
			sourceBase: channelSource,
			inheritedSourceBase: channelDefaultsSource,
			fallbackSourceBase: channelSource
		});
		for (const [accountId, account] of activeAccounts) pushChannelIngress(entries, {
			channel,
			accountId,
			config: account,
			inheritedConfig: value,
			inheritNestedContainers: channel !== "telegram" || configuredAccounts.length <= 1,
			sourceBase: `${channelSource}/accounts/${ocPathSegment$1(accountId)}`,
			inheritedSourceBase: channelSource,
			fallbackConfig: inheritedChannelDefaults,
			fallbackSourceBase: channelDefaultsSource
		});
	}
	return entries.toSorted((a, b) => a.source.localeCompare(b.source) || a.id.localeCompare(b.id));
}
function scanPolicyGatewayExposure(cfg) {
	const gateway = isRecord(cfg.gateway) ? cfg.gateway : {};
	const entries = [];
	const bind = typeof gateway.bind === "string" ? gateway.bind : void 0;
	const customBindHost = typeof gateway.customBindHost === "string" ? gateway.customBindHost : void 0;
	const hasCustomBindHost = customBindHost !== void 0 && customBindHost.trim() !== "";
	const tailscale = isRecord(gateway.tailscale) ? gateway.tailscale : {};
	const tailscaleForcesLoopback = tailscale.mode === "serve" || tailscale.mode === "funnel";
	entries.push({
		id: bind === void 0 ? "gateway-bind-default" : "gateway-bind",
		kind: "bind",
		source: "oc://openclaw.config/gateway/bind",
		value: bind ?? (tailscaleForcesLoopback ? "loopback" : "runtime-default"),
		nonLoopback: bind === void 0 ? !tailscaleForcesLoopback : bind === "custom" ? false : isGatewayNonLoopbackBind(bind),
		explicit: bind !== void 0
	});
	if (bind === "custom" && hasCustomBindHost) entries.push({
		id: "gateway-custom-bind-host",
		kind: "bind",
		source: "oc://openclaw.config/gateway/customBindHost",
		value: customBindHost,
		nonLoopback: isRuntimeNonLoopbackCustomBindHost(customBindHost)
	});
	const auth = isRecord(gateway.auth) ? gateway.auth : {};
	entries.push({
		id: "gateway-auth-mode",
		kind: "auth",
		source: "oc://openclaw.config/gateway/auth/mode",
		value: typeof auth.mode === "string" ? auth.mode : "token",
		explicit: typeof auth.mode === "string"
	});
	entries.push({
		id: "gateway-auth-rate-limit",
		kind: "authRateLimit",
		source: "oc://openclaw.config/gateway/auth/rateLimit",
		value: isRecord(auth.rateLimit),
		explicit: isRecord(auth.rateLimit)
	});
	const controlUi = isRecord(gateway.controlUi) ? gateway.controlUi : {};
	pushGatewayBooleanEvidence(entries, "gateway-control-ui-enabled", "controlUi", controlUi.enabled, "oc://openclaw.config/gateway/controlUi/enabled");
	pushGatewayBooleanEvidence(entries, "gateway-control-ui-insecure-auth", "controlUi", controlUi.allowInsecureAuth, "oc://openclaw.config/gateway/controlUi/allowInsecureAuth");
	pushGatewayBooleanEvidence(entries, "gateway-control-ui-device-auth-disabled", "controlUi", controlUi.dangerouslyDisableDeviceAuth, "oc://openclaw.config/gateway/controlUi/dangerouslyDisableDeviceAuth");
	pushGatewayBooleanEvidence(entries, "gateway-control-ui-host-origin-fallback", "controlUi", controlUi.dangerouslyAllowHostHeaderOriginFallback, "oc://openclaw.config/gateway/controlUi/dangerouslyAllowHostHeaderOriginFallback");
	if (typeof tailscale.mode === "string") entries.push({
		id: "gateway-tailscale-mode",
		kind: "tailscale",
		source: "oc://openclaw.config/gateway/tailscale/mode",
		value: tailscale.mode
	});
	if (tailscale.mode === "serve" && tailscale.preserveFunnel === true) entries.push({
		id: "gateway-tailscale-preserve-funnel",
		kind: "tailscale",
		source: "oc://openclaw.config/gateway/tailscale/preserveFunnel",
		value: "funnel"
	});
	const remote = isRecord(gateway.remote) ? gateway.remote : {};
	if (gateway.mode === "remote") {
		entries.push({
			id: "gateway-mode-remote",
			kind: "remote",
			source: "oc://openclaw.config/gateway/mode",
			value: "remote"
		});
		if (typeof remote.url === "string" && remote.url.trim() !== "") entries.push({
			id: "gateway-remote-url",
			kind: "remote",
			source: "oc://openclaw.config/gateway/remote/url",
			value: true
		});
	}
	const http = isRecord(gateway.http) ? gateway.http : {};
	const endpoints = isRecord(http.endpoints) ? http.endpoints : {};
	pushGatewayHttpEndpointEvidence(entries, endpoints, "chatCompletions");
	pushGatewayHttpEndpointEvidence(entries, endpoints, "responses");
	return entries.toSorted((a, b) => a.source.localeCompare(b.source));
}
function scanPolicyAgentWorkspace(cfg) {
	const agents = isRecord(cfg.agents) ? cfg.agents : {};
	const defaults = isRecord(agents.defaults) ? agents.defaults : {};
	const defaultSandbox = isRecord(defaults.sandbox) ? defaults.sandbox : {};
	const defaultTools = isRecord(cfg.tools) ? cfg.tools : {};
	const entries = [];
	pushAgentWorkspaceEvidence(entries, {
		id: "agents-defaults",
		scope: "defaults",
		sandbox: defaultSandbox,
		inheritedSandbox: {},
		tools: defaultTools,
		inheritedTools: {},
		workspaceSourceBase: "oc://openclaw.config/agents/defaults",
		inheritedWorkspaceSourceBase: "oc://openclaw.config/agents/defaults",
		toolsSourceBase: "oc://openclaw.config/tools",
		inheritedToolsSourceBase: "oc://openclaw.config/tools"
	});
	(Array.isArray(agents.list) ? agents.list : []).forEach((agent, index) => {
		if (!isRecord(agent)) return;
		const agentId = typeof agent.id === "string" && agent.id.trim() !== "" ? agent.id.trim() : void 0;
		const sandbox = isRecord(agent.sandbox) ? agent.sandbox : {};
		const tools = isRecord(agent.tools) ? agent.tools : {};
		pushAgentWorkspaceEvidence(entries, {
			id: agentId ?? `agent-${index}`,
			scope: "agent",
			agentId,
			sandbox,
			inheritedSandbox: defaultSandbox,
			tools,
			inheritedTools: defaultTools,
			workspaceSourceBase: `oc://openclaw.config/agents/list/#${index}`,
			inheritedWorkspaceSourceBase: "oc://openclaw.config/agents/defaults",
			toolsSourceBase: `oc://openclaw.config/agents/list/#${index}/tools`,
			inheritedToolsSourceBase: "oc://openclaw.config/tools"
		});
	});
	return entries.toSorted((a, b) => a.source.localeCompare(b.source) || a.id.localeCompare(b.id));
}
function scanPolicySandboxPosture(cfg) {
	const agents = isRecord(cfg.agents) ? cfg.agents : {};
	const defaults = isRecord(agents.defaults) ? agents.defaults : {};
	const defaultSandbox = isRecord(defaults.sandbox) ? defaults.sandbox : {};
	const entries = [];
	pushSandboxPostureEvidence(entries, {
		id: "agents-defaults",
		scope: "defaults",
		sandbox: defaultSandbox,
		inheritedSandbox: {},
		sourceBase: "oc://openclaw.config/agents/defaults/sandbox",
		inheritedSourceBase: "oc://openclaw.config/agents/defaults/sandbox"
	});
	(Array.isArray(agents.list) ? agents.list : []).forEach((agent, index) => {
		if (!isRecord(agent)) return;
		const agentId = typeof agent.id === "string" && agent.id.trim() !== "" ? agent.id.trim() : void 0;
		const sandbox = isRecord(agent.sandbox) ? agent.sandbox : {};
		pushSandboxPostureEvidence(entries, {
			id: agentId ?? `agent-${index}`,
			scope: "agent",
			agentId,
			sandbox,
			inheritedSandbox: defaultSandbox,
			sharedSandboxScope: sandboxScopeIsShared(sandbox, defaultSandbox),
			sourceBase: `oc://openclaw.config/agents/list/#${index}/sandbox`,
			inheritedSourceBase: "oc://openclaw.config/agents/defaults/sandbox"
		});
	});
	return entries.toSorted((a, b) => a.source.localeCompare(b.source) || a.id.localeCompare(b.id));
}
function scanPolicyToolPosture(cfg) {
	const globalTools = isRecord(cfg.tools) ? cfg.tools : {};
	const agents = isRecord(cfg.agents) ? cfg.agents : {};
	const defaults = isRecord(agents.defaults) ? agents.defaults : {};
	const defaultSandbox = isRecord(defaults.sandbox) ? defaults.sandbox : {};
	const entries = [];
	pushToolPostureEvidence(entries, {
		id: "tools",
		scope: "global",
		tools: globalTools,
		inheritedTools: {},
		sandbox: defaultSandbox,
		inheritedSandbox: {},
		sourceBase: "oc://openclaw.config/tools",
		inheritedSourceBase: "oc://openclaw.config/tools"
	});
	(Array.isArray(agents.list) ? agents.list : []).forEach((agent, index) => {
		if (!isRecord(agent)) return;
		const agentId = typeof agent.id === "string" && agent.id.trim() !== "" ? agent.id.trim() : void 0;
		pushToolPostureEvidence(entries, {
			id: agentId ?? `agent-${index}`,
			scope: "agent",
			agentId,
			tools: isRecord(agent.tools) ? agent.tools : {},
			inheritedTools: globalTools,
			sandbox: isRecord(agent.sandbox) ? agent.sandbox : {},
			inheritedSandbox: defaultSandbox,
			sourceBase: `oc://openclaw.config/agents/list/#${index}/tools`,
			inheritedSourceBase: "oc://openclaw.config/tools"
		});
	});
	return entries.toSorted((a, b) => a.source.localeCompare(b.source) || a.id.localeCompare(b.id));
}
function scanPolicySecrets(cfg) {
	return [...scanPolicySecretProviders(cfg), ...scanPolicySecretInputs(cfg)].toSorted((a, b) => a.source.localeCompare(b.source));
}
function scanPolicyAuthProfiles(cfg) {
	const auth = isRecord(cfg.auth) ? cfg.auth : {};
	const profiles = isRecord(auth.profiles) ? auth.profiles : {};
	return Object.entries(profiles).toSorted(([a], [b]) => a.localeCompare(b)).map(([id, value]) => {
		const entry = {
			id,
			source: `oc://openclaw.config/auth/profiles/${ocPathSegment$1(id)}`,
			validMetadata: isValidAuthProfileMetadata(value)
		};
		if (isRecord(value)) {
			if (typeof value.provider === "string") entry.provider = value.provider;
			if (typeof value.mode === "string") entry.mode = value.mode;
		}
		return entry;
	});
}
function scanPolicyDataHandling(cfg) {
	const entries = [];
	const logging = isRecord(cfg.logging) ? cfg.logging : {};
	entries.push({
		id: "logging-redaction",
		kind: "sensitiveLoggingRedaction",
		source: "oc://openclaw.config/logging/redactSensitive",
		scope: "global",
		value: logging.redactSensitive !== "off",
		explicit: logging.redactSensitive !== void 0
	});
	const diagnostics = isRecord(cfg.diagnostics) ? cfg.diagnostics : {};
	const otel = isRecord(diagnostics.otel) ? diagnostics.otel : {};
	const otelEnabled = diagnostics.enabled !== false && otel.enabled === true;
	const tracesEnabled = otelEnabled && otel.traces !== false;
	const logsEnabled = otelEnabled && otel.logs === true;
	const captureContent = otelEnabled && telemetryContentCaptureEnabled(otel.captureContent, {
		tracesEnabled,
		logsEnabled
	});
	entries.push({
		id: "diagnostics-otel-content-capture",
		kind: "telemetryContentCapture",
		source: "oc://openclaw.config/diagnostics/otel/captureContent",
		scope: "global",
		value: captureContent,
		explicit: otel.captureContent !== void 0
	});
	const session = isRecord(cfg.session) ? cfg.session : {};
	const maintenance = isRecord(session.maintenance) ? session.maintenance : {};
	const retentionMode = typeof maintenance.mode === "string" ? maintenance.mode : "enforce";
	entries.push({
		id: "session-maintenance-mode",
		kind: "sessionRetentionMode",
		source: "oc://openclaw.config/session/maintenance/mode",
		scope: "global",
		value: retentionMode,
		explicit: maintenance.mode !== void 0
	});
	pushMemorySessionTranscriptIndexing(entries, cfg);
	return entries.toSorted((a, b) => a.source.localeCompare(b.source));
}
function telemetryContentCaptureEnabled(value, signals) {
	if (value === true) return signals.tracesEnabled || signals.logsEnabled;
	if (!isRecord(value)) return false;
	if (!signals.tracesEnabled) return false;
	if (value.enabled !== true) return false;
	return value.inputMessages === true || value.outputMessages === true || value.toolInputs === true || value.toolOutputs === true || value.systemPrompt === true || value.toolDefinitions === true;
}
function pushMemorySessionTranscriptIndexing(entries, cfg) {
	const memory = isRecord(cfg.memory) ? cfg.memory : {};
	const qmd = isRecord(memory.qmd) ? memory.qmd : {};
	const qmdSessions = isRecord(qmd.sessions) ? qmd.sessions : {};
	if (qmdSessions.enabled !== void 0) entries.push({
		id: "memory-qmd-session-transcripts",
		kind: "memorySessionTranscriptIndexing",
		source: "oc://openclaw.config/memory/qmd/sessions/enabled",
		scope: "global",
		value: memory.backend === "qmd" && asBoolean(qmdSessions.enabled) === true,
		explicit: true
	});
	const agents = isRecord(cfg.agents) ? cfg.agents : {};
	const defaults = isRecord(agents.defaults) ? agents.defaults : {};
	const defaultsMemorySearch = isRecord(defaults.memorySearch) ? defaults.memorySearch : {};
	const defaultSessionMemory = memorySearchSessionTranscriptIndexing(defaultsMemorySearch);
	if (defaultSessionMemory !== void 0) entries.push({
		id: "agents-defaults-memory-session-transcripts",
		kind: "memorySessionTranscriptIndexing",
		source: "oc://openclaw.config/agents/defaults/memorySearch/experimental/sessionMemory",
		scope: "global",
		value: defaultSessionMemory,
		explicit: true
	});
	if (!Array.isArray(agents.list)) return;
	agents.list.forEach((rawAgent, index) => {
		if (!isRecord(rawAgent)) return;
		const agentId = normalizeOptionalString(rawAgent.id) ?? normalizeOptionalString(rawAgent.name) ?? normalizeOptionalString(rawAgent.slug) ?? `agent-${index}`;
		const memorySearch = isRecord(rawAgent.memorySearch) ? rawAgent.memorySearch : void 0;
		const agentSessionMemory = memorySearch === void 0 ? defaultSessionMemory : memorySearchSessionTranscriptIndexing(memorySearch, defaultsMemorySearch);
		if (agentSessionMemory === void 0) return;
		const explicit = memorySearchSessionTranscriptIndexingHasLocalConfig(memorySearch);
		entries.push({
			id: `${agentId}-memory-session-transcripts`,
			kind: "memorySessionTranscriptIndexing",
			source: explicit ? `oc://openclaw.config/agents/list/#${index}/memorySearch/experimental/sessionMemory` : "oc://openclaw.config/agents/defaults/memorySearch/experimental/sessionMemory",
			scope: "agent",
			agentId: normalizeAgentId(agentId),
			value: agentSessionMemory,
			explicit
		});
	});
}
function memorySearchSessionTranscriptIndexing(memorySearch, inheritedMemorySearch) {
	if (!isRecord(memorySearch)) return;
	const experimental = isRecord(memorySearch.experimental) ? memorySearch.experimental : {};
	const inherited = isRecord(inheritedMemorySearch) ? inheritedMemorySearch : {};
	const inheritedExperimental = isRecord(inherited.experimental) ? inherited.experimental : {};
	const enabled = asBoolean(memorySearch.enabled) ?? asBoolean(inherited.enabled) ?? true;
	const sessionMemory = asBoolean(experimental.sessionMemory) ?? asBoolean(inheritedExperimental.sessionMemory);
	const sourcesIncludeSessions = memorySearchSourcesIncludeSessions(memorySearch) ?? memorySearchSourcesIncludeSessions(inherited) ?? false;
	if (sessionMemory === void 0 && memorySearchSourcesIncludeSessions(memorySearch) === void 0 && asBoolean(memorySearch.enabled) === void 0) return;
	if (!enabled) return false;
	return sessionMemory === true && sourcesIncludeSessions;
}
function memorySearchSessionTranscriptIndexingHasLocalConfig(memorySearch) {
	if (!isRecord(memorySearch)) return false;
	const experimental = isRecord(memorySearch.experimental) ? memorySearch.experimental : {};
	return asBoolean(memorySearch.enabled) !== void 0 || asBoolean(experimental.sessionMemory) !== void 0 || memorySearchSourcesIncludeSessions(memorySearch) !== void 0;
}
function memorySearchSourcesIncludeSessions(memorySearch) {
	if (!isRecord(memorySearch) || memorySearch.sources === void 0) return;
	if (!Array.isArray(memorySearch.sources)) return false;
	return memorySearch.sources.includes("sessions");
}
function scanPolicySecretProviders(cfg) {
	const secrets = isRecord(cfg.secrets) ? cfg.secrets : {};
	const providers = isRecord(secrets.providers) ? secrets.providers : {};
	return Object.entries(providers).map(([id, value]) => {
		const insecure = secretProviderInsecureFlags(value);
		const entry = {
			id,
			kind: "provider",
			source: `oc://openclaw.config/secrets/providers/${ocPathSegment$1(id)}`
		};
		if (isRecord(value) && typeof value.source === "string") entry.providerSource = value.source;
		if (insecure.length > 0) entry.insecure = insecure;
		return entry;
	});
}
function scanPolicySecretInputs(cfg) {
	const entries = [];
	collectSecretInputs(entries, cfg, [], secretRefDefaults((isRecord(cfg.secrets) ? cfg.secrets : {}).defaults));
	return entries;
}
function collectSecretInputs(entries, value, path, defaults) {
	if (Array.isArray(value)) {
		value.forEach((item, index) => collectSecretInputs(entries, item, [...path, `#${index}`], defaults));
		return;
	}
	if (!isRecord(value)) return;
	for (const [key, child] of Object.entries(value)) {
		const childPath = [...path, key];
		const source = configPathSource(childPath);
		const ref = isSecretInputPath(childPath) ? secretRefEvidence(child, defaults) : void 0;
		if (ref !== void 0) {
			entries.push({
				id: source,
				kind: "input",
				source,
				provenance: "secretRef",
				refSource: ref.source,
				refProvider: ref.provider
			});
			continue;
		}
		collectSecretInputs(entries, child, childPath, defaults);
	}
}
function configPathSource(path) {
	return `oc://openclaw.config/${path.map(ocPathSegment$1).join("/")}`;
}
function isSecretInputPath(path) {
	const key = path.at(-1);
	if (key === void 0) return false;
	if (matchesConfigPath(path, [
		"plugins",
		"entries",
		"acpx",
		"config",
		"mcpServers",
		"*",
		"env",
		"*"
	])) return true;
	if (isRawEnvMapValuePath(path)) return false;
	if (isSecretInputKey(key)) return true;
	return matchesConfigPath(path, [
		"models",
		"providers",
		"*",
		"headers",
		"*"
	]) || isConfiguredProviderRequestSecretPath(path, [
		"models",
		"providers",
		"*"
	]) || isMediaConfiguredProviderRequestSecretPath(path) || matchesConfigPath(path, [
		"agents",
		"defaults",
		"memorySearch",
		"remote",
		"headers",
		"*"
	]) || matchesConfigPath(path, [
		"diagnostics",
		"otel",
		"headers",
		"*"
	]);
}
function isRawEnvMapValuePath(path) {
	return path.length >= 2 && path.at(-2) === "env";
}
function isMediaConfiguredProviderRequestSecretPath(path) {
	return isConfiguredProviderRequestSecretPath(path, [
		"tools",
		"media",
		"models",
		"#"
	]) || isConfiguredProviderRequestSecretPath(path, [
		"tools",
		"media",
		"audio"
	]) || isConfiguredProviderRequestSecretPath(path, [
		"tools",
		"media",
		"audio",
		"models",
		"#"
	]) || isConfiguredProviderRequestSecretPath(path, [
		"tools",
		"media",
		"image"
	]) || isConfiguredProviderRequestSecretPath(path, [
		"tools",
		"media",
		"image",
		"models",
		"#"
	]) || isConfiguredProviderRequestSecretPath(path, [
		"tools",
		"media",
		"video"
	]) || isConfiguredProviderRequestSecretPath(path, [
		"tools",
		"media",
		"video",
		"models",
		"#"
	]);
}
function pushAgentWorkspaceEvidence(entries, params) {
	const explicitSandboxMode = normalizeOptionalString(params.sandbox.mode);
	const inheritedSandboxMode = normalizeOptionalString(params.inheritedSandbox.mode);
	const sandboxMode = explicitSandboxMode ?? inheritedSandboxMode ?? "off";
	const sandboxModeCoversAgentMain = sandboxMode === "all";
	const sandboxModeSource = explicitSandboxMode !== void 0 ? `${params.workspaceSourceBase}/sandbox/mode` : inheritedSandboxMode !== void 0 ? `${params.inheritedWorkspaceSourceBase}/sandbox/mode` : "oc://openclaw.config/agents/defaults/sandbox/mode";
	const explicitWorkspaceAccess = normalizeOptionalString(params.sandbox.workspaceAccess);
	const inheritedWorkspaceAccess = normalizeOptionalString(params.inheritedSandbox.workspaceAccess);
	entries.push({
		id: `${params.id}-workspace-access`,
		kind: "workspaceAccess",
		source: explicitWorkspaceAccess !== void 0 ? `${params.workspaceSourceBase}/sandbox/workspaceAccess` : inheritedWorkspaceAccess !== void 0 ? `${params.inheritedWorkspaceSourceBase}/sandbox/workspaceAccess` : "oc://openclaw.config/agents/defaults/sandbox/workspaceAccess",
		scope: params.scope,
		...params.agentId === void 0 ? {} : { agentId: params.agentId },
		value: explicitWorkspaceAccess ?? inheritedWorkspaceAccess ?? "none",
		sandboxMode,
		sandboxModeSource,
		sandboxEnabled: sandboxModeCoversAgentMain,
		explicit: explicitWorkspaceAccess !== void 0
	});
	for (const tool of AGENT_WORKSPACE_POLICY_TOOLS) {
		const denyEvidence = agentWorkspaceToolDenyEvidence(params, tool, sandboxModeCoversAgentMain);
		entries.push({
			id: `${params.id}-tool-${tool}`,
			kind: "toolDeny",
			source: denyEvidence.source,
			scope: params.scope,
			...params.agentId === void 0 ? {} : { agentId: params.agentId },
			tool,
			denied: denyEvidence.denied,
			explicit: denyEvidence.denied
		});
	}
}
function agentWorkspaceToolDenyEvidence(params, tool, sandboxModeCoversAgentMain) {
	const localSandboxToolDeny = configuredSandboxToolDenyEntries(params.tools);
	const inheritedSandboxToolDeny = configuredSandboxToolDenyEntries(params.inheritedTools);
	const match = [
		{
			entries: readStringArray(params.tools.deny),
			source: `${params.toolsSourceBase}/deny`
		},
		{
			entries: readStringArray(params.inheritedTools.deny),
			source: `${params.inheritedToolsSourceBase}/deny`
		},
		...sandboxModeCoversAgentMain ? [localSandboxToolDeny !== void 0 ? {
			entries: localSandboxToolDeny,
			source: `${params.toolsSourceBase}/sandbox/tools/deny`
		} : {
			entries: inheritedSandboxToolDeny ?? [],
			source: `${params.inheritedToolsSourceBase}/sandbox/tools/deny`
		}] : []
	].find((entry) => toolListCoversTool$2(entry.entries, tool));
	if (match !== void 0) return {
		denied: true,
		source: match.source
	};
	return {
		denied: false,
		source: `${params.toolsSourceBase}/deny`
	};
}
function configuredSandboxToolDenyEntries(tools) {
	const sandbox = isRecord(tools.sandbox) ? tools.sandbox : {};
	const sandboxTools = isRecord(sandbox.tools) ? sandbox.tools : {};
	return Array.isArray(sandboxTools.deny) ? readStringArray(sandboxTools.deny) : void 0;
}
function pushToolPostureEvidence(entries, params) {
	const localProfile = normalizeOptionalString(params.tools.profile);
	const inheritedProfile = normalizeOptionalString(params.inheritedTools.profile);
	pushToolPostureValue(entries, params, {
		suffix: "profile",
		kind: "profile",
		value: localProfile ?? inheritedProfile ?? "full",
		explicit: localProfile !== void 0 || inheritedProfile !== void 0,
		inherited: localProfile === void 0 && inheritedProfile !== void 0
	});
	pushToolPostureList(entries, params, "allow");
	pushToolAlsoAllowPostureList(entries, params);
	pushToolPostureList(entries, params, "deny");
	pushToolFsPosture(entries, params);
	pushToolExecPosture(entries, params);
	pushToolElevatedPosture(entries, params);
}
function pushToolFsPosture(entries, params) {
	const localFs = isRecord(params.tools.fs) ? params.tools.fs : {};
	const inheritedFs = isRecord(params.inheritedTools.fs) ? params.inheritedTools.fs : {};
	const localWorkspaceOnly = asBoolean(localFs.workspaceOnly);
	const inheritedWorkspaceOnly = asBoolean(inheritedFs.workspaceOnly);
	pushToolPostureValue(entries, params, {
		suffix: "fs/workspaceOnly",
		kind: "fsWorkspaceOnly",
		value: localWorkspaceOnly ?? inheritedWorkspaceOnly ?? false,
		explicit: localWorkspaceOnly !== void 0 || inheritedWorkspaceOnly !== void 0,
		inherited: localWorkspaceOnly === void 0 && inheritedWorkspaceOnly !== void 0
	});
}
function pushToolExecPosture(entries, params) {
	const localExec = isRecord(params.tools.exec) ? params.tools.exec : {};
	const inheritedExec = isRecord(params.inheritedTools.exec) ? params.inheritedTools.exec : {};
	const localHost = normalizeOptionalString(localExec.host);
	const inheritedHost = normalizeOptionalString(inheritedExec.host);
	const host = localHost ?? inheritedHost ?? "auto";
	pushToolPostureValue(entries, params, {
		suffix: "exec/host",
		kind: "execHost",
		value: host,
		explicit: localHost !== void 0 || inheritedHost !== void 0,
		inherited: localHost === void 0 && inheritedHost !== void 0
	});
	const localSecurity = normalizeOptionalString(localExec.security);
	const inheritedSecurity = normalizeOptionalString(inheritedExec.security);
	const sandboxCanApply = (normalizeOptionalString(params.sandbox.mode) ?? normalizeOptionalString(params.inheritedSandbox.mode)) === "all";
	pushToolPostureValue(entries, params, {
		suffix: "exec/security",
		kind: "execSecurity",
		value: localSecurity ?? inheritedSecurity ?? (host === "sandbox" || host === "auto" && sandboxCanApply ? "deny" : "full"),
		explicit: localSecurity !== void 0 || inheritedSecurity !== void 0,
		inherited: localSecurity === void 0 && inheritedSecurity !== void 0
	});
	const localAsk = normalizeOptionalString(localExec.ask);
	const inheritedAsk = normalizeOptionalString(inheritedExec.ask);
	pushToolPostureValue(entries, params, {
		suffix: "exec/ask",
		kind: "execAsk",
		value: localAsk ?? inheritedAsk ?? "off",
		explicit: localAsk !== void 0 || inheritedAsk !== void 0,
		inherited: localAsk === void 0 && inheritedAsk !== void 0
	});
}
function pushToolElevatedPosture(entries, params) {
	const localElevated = isRecord(params.tools.elevated) ? params.tools.elevated : {};
	const inheritedElevated = isRecord(params.inheritedTools.elevated) ? params.inheritedTools.elevated : {};
	const localEnabled = asBoolean(localElevated.enabled);
	const inheritedEnabled = asBoolean(inheritedElevated.enabled);
	pushToolPostureValue(entries, params, {
		suffix: "elevated/enabled",
		kind: "elevatedEnabled",
		value: inheritedEnabled === false ? false : localEnabled ?? inheritedEnabled ?? true,
		explicit: localEnabled !== void 0 || inheritedEnabled !== void 0,
		inherited: inheritedEnabled === false && localEnabled !== false || localEnabled === void 0 && inheritedEnabled !== void 0
	});
	const localAllowFrom = isRecord(localElevated.allowFrom) ? localElevated.allowFrom : {};
	const inheritedAllowFrom = isRecord(inheritedElevated.allowFrom) ? inheritedElevated.allowFrom : {};
	const providers = [...new Set([...Object.keys(inheritedAllowFrom), ...Object.keys(localAllowFrom)])].toSorted((a, b) => a.localeCompare(b));
	for (const provider of providers) {
		const localEntries = readStringOrNumberArray(localAllowFrom[provider]);
		const inheritedEntries = readStringOrNumberArray(inheritedAllowFrom[provider]);
		const inherited = localEntries.length === 0 && inheritedEntries.length > 0;
		entries.push({
			id: `${params.id}-elevated-allow-from-${ocPathSegment$1(provider)}`,
			kind: "elevatedAllowFrom",
			source: `${inherited ? params.inheritedSourceBase : params.sourceBase}/elevated/allowFrom/${ocPathSegment$1(provider)}`,
			scope: params.scope,
			...params.agentId === void 0 ? {} : { agentId: params.agentId },
			entries: localEntries.length > 0 ? localEntries : inheritedEntries,
			explicit: localEntries.length > 0 || inheritedEntries.length > 0
		});
	}
}
function pushSandboxPostureEvidence(entries, params) {
	const localMode = normalizeOptionalString(params.sandbox.mode);
	const inheritedMode = normalizeOptionalString(params.inheritedSandbox.mode);
	pushSandboxPostureValue(entries, params, {
		suffix: "mode",
		kind: "mode",
		value: localMode ?? inheritedMode ?? "off",
		explicit: localMode !== void 0 || inheritedMode !== void 0,
		inherited: localMode === void 0 && inheritedMode !== void 0
	});
	const localBackend = normalizeOptionalString(params.sandbox.backend);
	const inheritedBackend = normalizeOptionalString(params.inheritedSandbox.backend);
	const effectiveBackend = (localBackend ?? inheritedBackend ?? "docker").toLowerCase();
	const effectiveParams = {
		...params,
		effectiveBackend
	};
	pushSandboxPostureValue(entries, params, {
		suffix: "backend",
		kind: "backend",
		value: effectiveBackend,
		explicit: localBackend !== void 0 || inheritedBackend !== void 0,
		inherited: localBackend === void 0 && inheritedBackend !== void 0
	});
	if (effectiveBackend === "docker") pushSandboxDockerPosture(entries, effectiveParams);
	pushSandboxBrowserPosture(entries, effectiveParams);
}
function pushSandboxDockerPosture(entries, params) {
	const localDocker = !params.sharedSandboxScope && isRecord(params.sandbox.docker) ? params.sandbox.docker : {};
	const inheritedDocker = isRecord(params.inheritedSandbox.docker) ? params.inheritedSandbox.docker : {};
	const localNetwork = normalizeOptionalString(localDocker.network);
	const inheritedNetwork = normalizeOptionalString(inheritedDocker.network);
	pushSandboxPostureValue(entries, params, {
		suffix: "docker/network",
		kind: "containerNetwork",
		value: localNetwork ?? inheritedNetwork ?? "none",
		networkSurface: "docker",
		explicit: localNetwork !== void 0 || inheritedNetwork !== void 0,
		inherited: localNetwork === void 0 && inheritedNetwork !== void 0
	});
	pushSandboxDockerProfilePosture(entries, params, localDocker, inheritedDocker, "seccomp");
	pushSandboxDockerProfilePosture(entries, params, localDocker, inheritedDocker, "apparmor");
	pushSandboxBindPosture(entries, params, {
		inheritedBinds: readStringArray(inheritedDocker.binds),
		localBinds: readStringArray(localDocker.binds),
		sourceSuffix: "docker/binds",
		surface: "docker"
	});
}
function pushSandboxBindPosture(entries, params, bindParams) {
	const { inheritedBinds, localBinds } = bindParams;
	for (const [index, bind] of [...inheritedBinds, ...localBinds].entries()) {
		const inherited = index < inheritedBinds.length;
		const parsed = splitPolicyBindSpec(bind);
		entries.push({
			id: `${params.id}-${bindParams.surface}-bind-${index}`,
			kind: "containerMount",
			source: `${inherited ? params.inheritedSourceBase : params.sourceBase}/${bindParams.sourceSuffix}/#${inherited ? index : index - inheritedBinds.length}`,
			scope: params.scope,
			...params.agentId === void 0 ? {} : { agentId: params.agentId },
			bind,
			bindHost: parsed?.host,
			bindMode: parsed?.mode ?? "rw",
			bindSurface: bindParams.surface,
			explicit: true
		});
	}
}
function pushSandboxDockerProfilePosture(entries, params, localDocker, inheritedDocker, profile) {
	const key = profile === "apparmor" ? "apparmorProfile" : "seccompProfile";
	const localValue = normalizeOptionalString(localDocker[key]);
	const inheritedValue = normalizeOptionalString(inheritedDocker[key]);
	const inherited = localValue === void 0 && inheritedValue !== void 0;
	const value = localValue ?? inheritedValue;
	entries.push({
		id: `${params.id}-docker-${profile}-profile`,
		kind: "containerSecurityProfile",
		source: `${inherited ? params.inheritedSourceBase : params.sourceBase}/docker/${key}`,
		scope: params.scope,
		...params.agentId === void 0 ? {} : { agentId: params.agentId },
		profile,
		...value === void 0 ? {} : { value },
		explicit: value !== void 0
	});
}
function pushSandboxBrowserPosture(entries, params) {
	const localBrowser = !params.sharedSandboxScope && isRecord(params.sandbox.browser) ? params.sandbox.browser : {};
	const inheritedBrowser = isRecord(params.inheritedSandbox.browser) ? params.inheritedSandbox.browser : {};
	const localEnabled = asBoolean(localBrowser.enabled);
	const inheritedEnabled = asBoolean(inheritedBrowser.enabled);
	if (!(localEnabled ?? inheritedEnabled ?? false)) {
		const disabledInherited = localEnabled === void 0 && inheritedEnabled !== void 0;
		if (localEnabled !== void 0 || inheritedEnabled !== void 0) entries.push({
			id: `${params.id}-browser-cdp-source-range`,
			kind: "browserCdpSourceRange",
			source: `${disabledInherited ? params.inheritedSourceBase : params.sourceBase}/browser/enabled`,
			scope: params.scope,
			...params.agentId === void 0 ? {} : { agentId: params.agentId },
			value: false,
			explicit: true
		});
		return;
	}
	const hasLocalRange = Object.hasOwn(localBrowser, "cdpSourceRange");
	const localRange = normalizeOptionalString(localBrowser.cdpSourceRange);
	const inheritedRange = normalizeOptionalString(inheritedBrowser.cdpSourceRange);
	const inherited = !hasLocalRange && inheritedRange !== void 0;
	const value = hasLocalRange ? localRange : inheritedRange;
	entries.push({
		id: `${params.id}-browser-cdp-source-range`,
		kind: "browserCdpSourceRange",
		source: `${inherited ? params.inheritedSourceBase : params.sourceBase}/browser/cdpSourceRange`,
		scope: params.scope,
		...params.agentId === void 0 ? {} : { agentId: params.agentId },
		...value === void 0 ? {} : { value },
		explicit: value !== void 0
	});
	const localNetwork = normalizeOptionalString(localBrowser.network);
	const inheritedNetwork = normalizeOptionalString(inheritedBrowser.network);
	pushSandboxPostureValue(entries, params, {
		suffix: "browser/network",
		kind: "containerNetwork",
		value: localNetwork ?? inheritedNetwork ?? DEFAULT_POLICY_SANDBOX_BROWSER_NETWORK,
		networkSurface: "browser",
		explicit: localNetwork !== void 0 || inheritedNetwork !== void 0,
		inherited: localNetwork === void 0 && inheritedNetwork !== void 0
	});
	if (inheritedBrowser.binds !== void 0 || localBrowser.binds !== void 0) pushSandboxBindPosture(entries, params, {
		inheritedBinds: readStringArray(inheritedBrowser.binds),
		localBinds: readStringArray(localBrowser.binds),
		sourceSuffix: "browser/binds",
		surface: "browser"
	});
	else if (params.effectiveBackend !== "docker") {
		const localDocker = !params.sharedSandboxScope && isRecord(params.sandbox.docker) ? params.sandbox.docker : {};
		pushSandboxBindPosture(entries, params, {
			inheritedBinds: readStringArray((isRecord(params.inheritedSandbox.docker) ? params.inheritedSandbox.docker : {}).binds),
			localBinds: readStringArray(localDocker.binds),
			sourceSuffix: "docker/binds",
			surface: "browser"
		});
	}
}
function sandboxScopeIsShared(sandbox, inheritedSandbox) {
	const localScope = normalizeOptionalString(sandbox.scope);
	const inheritedScope = normalizeOptionalString(inheritedSandbox.scope);
	const configuredScope = localScope ?? inheritedScope;
	if (configuredScope !== void 0) return configuredScope === "shared";
	const localPerSession = asBoolean(sandbox.perSession);
	const inheritedPerSession = asBoolean(inheritedSandbox.perSession);
	return (localPerSession ?? inheritedPerSession) === false;
}
function pushSandboxPostureValue(entries, params, entry) {
	entries.push({
		id: `${params.id}-${entry.suffix.replaceAll("/", "-")}`,
		kind: entry.kind,
		source: `${entry.inherited ? params.inheritedSourceBase : params.sourceBase}/${entry.suffix}`,
		scope: params.scope,
		...params.agentId === void 0 ? {} : { agentId: params.agentId },
		...entry.value === void 0 ? {} : { value: entry.value },
		...entry.networkSurface === void 0 ? {} : { networkSurface: entry.networkSurface },
		explicit: entry.explicit
	});
}
function splitPolicyBindSpec(value) {
	const separator = policyBindSeparatorIndex(value);
	if (separator < 0) return;
	const host = value.slice(0, separator);
	const rest = value.slice(separator + 1);
	const optionsStart = policyBindOptionsSeparatorIndex(rest);
	return {
		host,
		mode: (optionsStart < 0 ? "" : rest.slice(optionsStart + 1)).split(",").map((entry) => entry.trim().toLowerCase()).includes("ro") ? "ro" : "rw"
	};
}
function policyBindSeparatorIndex(value) {
	const hasDriveLetterPrefix = /^[A-Za-z]:[\\/]/.test(value);
	for (let index = hasDriveLetterPrefix ? 2 : 0; index < value.length; index += 1) if (value[index] === ":") return index;
	return -1;
}
function policyBindOptionsSeparatorIndex(value) {
	const hasDriveLetterPrefix = /^[A-Za-z]:[\\/]/.test(value);
	for (let index = hasDriveLetterPrefix ? 2 : 0; index < value.length; index += 1) if (value[index] === ":") return index;
	return -1;
}
function pushToolPostureValue(entries, params, entry) {
	entries.push({
		id: `${params.id}-${entry.suffix.replaceAll("/", "-")}`,
		kind: entry.kind,
		source: `${entry.inherited ? params.inheritedSourceBase : params.sourceBase}/${entry.suffix}`,
		scope: params.scope,
		...params.agentId === void 0 ? {} : { agentId: params.agentId },
		...entry.value === void 0 ? {} : { value: entry.value },
		explicit: entry.explicit
	});
}
function pushToolPostureList(entries, params, key) {
	const localEntries = readStringArray(params.tools[key]);
	const inheritedEntries = readStringArray(params.inheritedTools[key]);
	const inherited = localEntries.length === 0 && inheritedEntries.length > 0;
	entries.push({
		id: `${params.id}-${key}`,
		kind: key,
		source: `${inherited ? params.inheritedSourceBase : params.sourceBase}/${key}`,
		scope: params.scope,
		...params.agentId === void 0 ? {} : { agentId: params.agentId },
		entries: [...inheritedEntries, ...localEntries],
		explicit: localEntries.length > 0 || inheritedEntries.length > 0
	});
}
function pushToolAlsoAllowPostureList(entries, params) {
	const localValue = params.tools.alsoAllow;
	const inheritedValue = params.inheritedTools.alsoAllow;
	const localConfigured = Array.isArray(localValue);
	const inheritedConfigured = Array.isArray(inheritedValue);
	const localEntries = localConfigured ? readStringArray(localValue) : [];
	const inheritedEntries = inheritedConfigured ? readStringArray(inheritedValue) : [];
	const inherited = !localConfigured && inheritedConfigured;
	entries.push({
		id: `${params.id}-alsoAllow`,
		kind: "alsoAllow",
		source: `${inherited ? params.inheritedSourceBase : params.sourceBase}/alsoAllow`,
		scope: params.scope,
		...params.agentId === void 0 ? {} : { agentId: params.agentId },
		entries: inherited ? inheritedEntries : localEntries,
		explicit: localConfigured || inheritedConfigured
	});
}
const AGENT_WORKSPACE_POLICY_TOOLS = [
	"exec",
	"process",
	"write",
	"edit",
	"apply_patch"
];
const IMPLICIT_DEFAULT_ACCOUNT_FIELDS = {
	discord: ["token"],
	googlechat: [
		"serviceAccount",
		"serviceAccountRef",
		"serviceAccountFile"
	],
	imessage: ["cliPath", "dbPath"],
	"qa-channel": ["baseUrl"],
	qqbot: [
		"appId",
		"clientSecret",
		"clientSecretFile"
	],
	signal: ["account"],
	slack: [
		"appToken",
		"botToken",
		"signingSecret"
	],
	"synology-chat": ["token"],
	telegram: ["botToken", "tokenFile"],
	tlon: ["ship"],
	twitch: ["username"],
	whatsapp: ["authDir"],
	zalo: ["botToken", "tokenFile"],
	zalouser: ["profile"]
};
function readStringArray(value) {
	if (!Array.isArray(value)) return [];
	return value.filter((entry) => typeof entry === "string" && entry.trim() !== "");
}
function readStringOrNumberArray(value) {
	if (!Array.isArray(value)) return [];
	const entries = [];
	for (const entry of value) if (typeof entry === "string" && entry.trim() !== "") entries.push(entry.trim());
	else if (typeof entry === "number" && Number.isFinite(entry)) entries.push(String(entry));
	return entries;
}
function normalizePolicyToolName$2(value) {
	const normalized = value.trim().toLowerCase();
	if (normalized === "bash") return "exec";
	if (normalized === "apply-patch") return "apply_patch";
	return normalized;
}
function policyToolGlobMatches$2(tool, pattern) {
	const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	return new RegExp(`^${escaped.replaceAll("\\*", ".*")}$`).test(tool);
}
function toolListCoversTool$2(list, tool) {
	for (const entry of list) {
		const normalized = normalizePolicyToolName$2(entry);
		if (normalized === "*" || normalized === tool) return true;
		if (POLICY_TOOL_GROUPS[normalized]?.includes(tool)) return true;
		if (normalized.includes("*") && policyToolGlobMatches$2(tool, normalized)) return true;
	}
	return false;
}
function isConfiguredProviderRequestSecretPath(path, prefix) {
	if (path.length < prefix.length + 3) return false;
	if (!matchesConfigPathPrefix(path, prefix)) return false;
	const requestIndex = prefix.length;
	if (path[requestIndex] !== "request") return false;
	const suffix = path.slice(requestIndex + 1);
	if (suffix.length === 2 && suffix[0] === "headers") return true;
	if (suffix.length === 2 && suffix[0] === "auth" && isConfiguredProviderAuthSecretKey(suffix[1])) return true;
	if (suffix.length === 2 && suffix[0] === "tls" && isConfiguredProviderTlsSecretKey(suffix[1])) return true;
	return suffix.length === 3 && suffix[0] === "proxy" && suffix[1] === "tls" && isConfiguredProviderTlsSecretKey(suffix[2]);
}
function matchesConfigPathPrefix(path, prefix) {
	if (path.length < prefix.length) return false;
	return prefix.every((segment, index) => {
		const value = path[index];
		if (segment === "*") return value !== void 0 && value !== "";
		if (segment === "#") return value?.startsWith("#") ?? false;
		return value === segment;
	});
}
function matchesConfigPath(path, pattern) {
	return path.length === pattern.length && matchesConfigPathPrefix(path, pattern);
}
function isConfiguredProviderTlsSecretKey(key) {
	return key === "ca" || key === "cert" || key === "key" || key === "passphrase";
}
function isConfiguredProviderAuthSecretKey(key) {
	return key === "token" || key === "value";
}
function isSecretInputKey(key) {
	const normalized = key.toLowerCase();
	return normalized === "apikey" || normalized === "keyref" || normalized === "token" || normalized === "tokenref" || normalized === "password" || normalized === "secret" || normalized === "encryptkey" || normalized === "webhooksecret" || normalized === "serviceaccount" || normalized === "serviceaccountref" || normalized === "privatekey" || normalized === "certificate" || normalized === "certificatedata" || normalized === "identitydata" || normalized === "knownhosts" || normalized === "knownhostsdata" || normalized.endsWith("apikey") || normalized.endsWith("token") || normalized.endsWith("secret") || normalized.endsWith("password");
}
function secretRefDefaults(value) {
	if (!isRecord(value)) return;
	const defaults = {};
	if (typeof value.env === "string") defaults.env = value.env;
	if (typeof value.file === "string") defaults.file = value.file;
	if (typeof value.exec === "string") defaults.exec = value.exec;
	return defaults;
}
function secretRefEvidence(value, defaults) {
	const ref = coerceSecretRef(value, defaults);
	return ref === null ? void 0 : {
		source: ref.source,
		provider: ref.provider,
		id: ref.id
	};
}
function secretProviderInsecureFlags(value) {
	if (!isRecord(value)) return [];
	return [...value.allowInsecurePath === true ? ["allowInsecurePath"] : [], ...value.allowSymlinkCommand === true ? ["allowSymlinkCommand"] : []];
}
function isValidAuthProfileMetadata(value) {
	if (!isRecord(value)) return false;
	return typeof value.provider === "string" && value.provider.trim() !== "" && isAuthProfileMode(value.mode);
}
function isAuthProfileMode(value) {
	return value === "api_key" || value === "aws-sdk" || value === "oauth" || value === "token";
}
function scanPolicyTools(raw) {
	return Promise.resolve(scanPolicyToolHeaders(raw));
}
function scanPolicyToolHeaders(raw) {
	const section = markdownSectionLines(raw, "tools");
	if (section.length === 0) return [];
	const tools = [];
	for (let index = 0; index < section.length; index += 1) {
		const line = section[index]?.text ?? "";
		const heading = /^###\s+([^\s#]+)(.*)$/.exec(line);
		const bullet = /^[-*+]\s+([^:\s][^:]*?)\s*:(.*)$/.exec(line);
		const match = heading ?? bullet;
		if (match === null || slugify(match[1]).length === 0) continue;
		const id = slugify(match[1]);
		const entry = {
			id,
			source: `oc://TOOLS.md/tools/${id}`,
			line: section[index]?.line ?? index + 1
		};
		const metaLines = [match[2] ?? ""];
		for (let metaIndex = index + 1; metaIndex < section.length; metaIndex += 1) {
			const metaLine = section[metaIndex]?.text ?? "";
			if (/^###\s+\S+/.test(metaLine.trim()) || /^[-*+]\s+[^:\s][^:]*?\s*:/.test(metaLine)) break;
			metaLines.push(metaLine);
		}
		const meta = metaLines.join("\n");
		const risk = riskFromMeta(meta);
		const sensitivity = /\bsensitivity\s*:\s*([a-z0-9_-]+)\b/i.exec(meta)?.[1]?.toLowerCase();
		const owner = /\bowner\s*:\s*([^\s#]+)\b/i.exec(meta)?.[1];
		const capabilities = capabilityTokensFromMetaLines(metaLines);
		if (risk !== void 0) entry.risk = risk;
		if (sensitivity !== void 0) entry.sensitivity = sensitivity;
		if (owner !== void 0) entry.owner = owner;
		if (capabilities.length > 0) entry.capabilities = capabilities;
		tools.push(entry);
	}
	return tools;
}
function markdownSectionLines(raw, sectionSlug) {
	const lines = raw.split(/\r?\n/);
	let sectionDepth;
	const section = [];
	for (let index = 0; index < lines.length; index += 1) {
		const line = lines[index] ?? "";
		const heading = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
		if (heading !== null) {
			const depth = heading[1]?.length ?? 0;
			const slug = slugify(heading[2] ?? "");
			if (sectionDepth !== void 0 && depth <= sectionDepth) break;
			if (sectionDepth !== void 0) {
				section.push({
					line: index + 1,
					text: line
				});
				continue;
			}
			if (sectionDepth === void 0 && slug === sectionSlug) sectionDepth = depth;
			continue;
		}
		if (sectionDepth !== void 0) section.push({
			line: index + 1,
			text: line
		});
	}
	return section;
}
function slugify(text) {
	return text.toLowerCase().replace(/_/g, "-").replace(NON_SLUG_CHARS, "-").replace(COLLAPSE_HYPHENS, "-").replace(TRIM_HYPHENS, "");
}
function riskFromMeta(meta) {
	const namedRisk = /\brisk\s*:\s*([a-z0-9_-]+)\b/i.exec(meta)?.[1];
	if (namedRisk !== void 0) return namedRisk.toLowerCase();
	switch (/\bR([0-5])\b/.exec(meta)?.[1]) {
		case "0":
		case "1": return "low";
		case "2":
		case "3": return "medium";
		case "4": return "high";
		case "5": return "critical";
		default: return;
	}
}
function capabilityTokensFromMetaLines(lines) {
	return lines.flatMap((line, index) => {
		const trimmed = line.trim();
		if (trimmed.length === 0) return [];
		const tokens = trimmed.match(/\b[A-Z][A-Z0-9_]{2,}\b/g) ?? [];
		if (index === 0 || /\bcapabilities\s*:/i.test(trimmed)) return tokens;
		const withoutTokens = tokens.reduce((remaining, token) => {
			return remaining.replace(token, "");
		}, trimmed);
		return /^[\s,;:[\](){}#*_-]*$/.test(withoutTokens) ? tokens : [];
	});
}
function configuredChannels(cfg) {
	return isRecord(cfg.channels) ? cfg.channels : {};
}
function configuredMcpServers(cfg) {
	return isRecord(cfg.mcp) && isRecord(cfg.mcp.servers) ? cfg.mcp.servers : {};
}
function mcpServerTransport(value) {
	if (!isRecord(value)) return "unknown";
	if (typeof value.command === "string") return "stdio";
	if (value.transport === "sse" || value.transport === "streamable-http") return value.transport;
	if (typeof value.url === "string") return "streamable-http";
	return "unknown";
}
function redactMcpUrlForEvidence(raw) {
	try {
		const url = new URL(raw);
		return `${url.protocol}//${url.host}`;
	} catch {
		return "[redacted-url]";
	}
}
function configuredModelProviders(cfg) {
	return isRecord(cfg.models) && isRecord(cfg.models.providers) ? cfg.models.providers : {};
}
function networkBooleanEvidence(cfg, id, path, source) {
	const value = readBooleanPath(cfg, path);
	return value === void 0 ? void 0 : {
		id,
		source,
		value
	};
}
function pickSupportedIngressDefaults(config) {
	const result = {};
	if (config.groupPolicy !== void 0) result.groupPolicy = config.groupPolicy;
	return result;
}
function hasImplicitDefaultAccountConfig(channel, config) {
	switch (channel) {
		case "clickclack": return hasConfiguredAccountValue(config.baseUrl) && hasConfiguredAccountValue(config.workspace) && hasConfiguredAccountValue(config.token);
		case "feishu": return hasConfiguredAccountValue(config.appId) && hasConfiguredAccountValue(config.appSecret);
		case "irc": return hasConfiguredAccountValue(config.host) && hasConfiguredAccountValue(config.nick);
		case "line": return hasConfiguredAccountValue(config.channelAccessToken) || hasConfiguredAccountValue(config.tokenFile);
		case "matrix": return hasConfiguredAccountValue(config.homeserver) && (hasConfiguredAccountValue(config.accessToken) || hasConfiguredAccountValue(config.userId) && hasConfiguredAccountValue(config.password));
		case "mattermost": return hasConfiguredAccountValue(config.baseUrl) && hasConfiguredAccountValue(config.botToken);
		case "nextcloud-talk": return hasConfiguredAccountValue(config.baseUrl) && (hasConfiguredAccountValue(config.botSecret) || hasConfiguredAccountValue(config.botSecretFile));
		default: return (IMPLICIT_DEFAULT_ACCOUNT_FIELDS[channel] ?? []).some((field) => hasConfiguredAccountValue(config[field]));
	}
}
function hasConfiguredAccountValue(value) {
	return typeof value === "string" ? value.trim().length > 0 : value !== void 0 && value !== null;
}
function pushChannelIngress(entries, params) {
	const localDmPolicy = channelDmPolicy(params.config);
	const inheritedDmPolicy = channelDmPolicy(params.inheritedConfig);
	const fallbackDmPolicy = channelDmPolicy(params.fallbackConfig ?? {});
	const effectiveDmPolicy = localDmPolicy.disabledByEnabled === true ? localDmPolicy : localDmPolicy.value !== void 0 ? localDmPolicy : inheritedDmPolicy.disabledByEnabled === true ? inheritedDmPolicy : inheritedDmPolicy.value !== void 0 ? inheritedDmPolicy : fallbackDmPolicy.disabledByEnabled === true || fallbackDmPolicy.value !== void 0 ? fallbackDmPolicy : void 0;
	const dmPolicySource = effectiveDmPolicy?.sourceSuffix === void 0 ? `${params.fallbackSourceBase}/dmPolicy` : effectiveDmPolicy === localDmPolicy ? `${params.sourceBase}/${effectiveDmPolicy.sourceSuffix}` : effectiveDmPolicy === inheritedDmPolicy ? `${params.inheritedSourceBase}/${effectiveDmPolicy.sourceSuffix}` : `${params.fallbackSourceBase}/${effectiveDmPolicy.sourceSuffix}`;
	entries.push({
		id: channelIngressId(params, "dm-policy"),
		kind: "channelDmPolicy",
		source: dmPolicySource,
		channel: params.channel,
		...params.accountId === void 0 ? {} : { accountId: params.accountId },
		value: effectiveDmPolicy?.value ?? "pairing",
		explicit: effectiveDmPolicy !== void 0
	});
	const localGroupPolicy = normalizeOptionalString(params.config.groupPolicy);
	const inheritedGroupPolicy = normalizeOptionalString(params.inheritedConfig.groupPolicy);
	const fallbackGroupPolicy = normalizeOptionalString(params.fallbackConfig?.groupPolicy);
	const implicitGroupPolicy = channelImplicitGroupPolicy(params);
	entries.push({
		id: channelIngressId(params, "group-policy"),
		kind: "channelGroupPolicy",
		source: localGroupPolicy !== void 0 ? `${params.sourceBase}/groupPolicy` : inheritedGroupPolicy !== void 0 ? `${params.inheritedSourceBase}/groupPolicy` : fallbackGroupPolicy !== void 0 ? `${params.fallbackSourceBase}/groupPolicy` : implicitGroupPolicy.source,
		channel: params.channel,
		...params.accountId === void 0 ? {} : { accountId: params.accountId },
		value: localGroupPolicy ?? inheritedGroupPolicy ?? fallbackGroupPolicy ?? implicitGroupPolicy.value,
		explicit: localGroupPolicy !== void 0 || inheritedGroupPolicy !== void 0 || fallbackGroupPolicy !== void 0
	});
	pushChannelRequireMentionIngress(entries, params);
}
function channelImplicitGroupPolicy(params) {
	for (const [config, sourceBase] of [
		[params.config, params.sourceBase],
		...params.inheritNestedContainers === true ? [[params.inheritedConfig, params.inheritedSourceBase]] : [],
		[params.fallbackConfig, params.fallbackSourceBase]
	]) {
		if (config === void 0 || sourceBase === void 0) continue;
		for (const key of ["groups"]) {
			const container = isRecord(config[key]) ? config[key] : void 0;
			if (container !== void 0 && Object.keys(container).length > 0) return {
				source: `${sourceBase}/${key}`,
				value: "allowlist"
			};
		}
	}
	return {
		source: `${params.sourceBase}/groupPolicy`,
		value: ALLOWLIST_DEFAULT_INGRESS_GROUP_POLICY_CHANNELS.has(params.channel) ? "allowlist" : "open"
	};
}
function pushChannelRequireMentionIngress(entries, params) {
	const localRequireMention = asBoolean(params.config.requireMention);
	const inheritedRequireMention = asBoolean(params.inheritedConfig.requireMention);
	const fallbackRequireMention = asBoolean(params.fallbackConfig?.requireMention);
	const wildcardRequireMention = channelWildcardRequireMention(params);
	const defaultRequireMention = channelDefaultRequireMention(params);
	entries.push({
		id: channelIngressId(params, "require-mention"),
		kind: "channelRequireMention",
		source: wildcardRequireMention !== void 0 ? wildcardRequireMention.source : localRequireMention !== void 0 ? `${params.sourceBase}/requireMention` : inheritedRequireMention !== void 0 ? `${params.inheritedSourceBase}/requireMention` : fallbackRequireMention !== void 0 ? `${params.fallbackSourceBase}/requireMention` : `${params.sourceBase}/requireMention`,
		channel: params.channel,
		...params.accountId === void 0 ? {} : { accountId: params.accountId },
		value: wildcardRequireMention?.value ?? localRequireMention ?? inheritedRequireMention ?? fallbackRequireMention ?? defaultRequireMention,
		explicit: wildcardRequireMention !== void 0 || localRequireMention !== void 0 || inheritedRequireMention !== void 0 || fallbackRequireMention !== void 0
	});
	const containers = nestedIngressContainers(params);
	for (const { containerKey, container, sourceBase } of containers) for (const [groupId, groupConfig] of Object.entries(container)) {
		if (!isRecord(groupConfig)) continue;
		pushNestedRequireMentionIngress(entries, params, containerKey, groupId, groupConfig, sourceBase);
	}
}
function channelDefaultRequireMention(params) {
	return !((normalizeOptionalString(params.config.groupPolicy) ?? normalizeOptionalString(params.inheritedConfig.groupPolicy) ?? normalizeOptionalString(params.fallbackConfig?.groupPolicy) ?? channelImplicitGroupPolicy(params).value) === "open" && OPEN_GROUPS_DEFAULT_TO_NO_MENTION_CHANNELS.has(params.channel));
}
function channelWildcardRequireMention(params) {
	for (const [config, sourceBase] of [
		[params.config, params.sourceBase],
		[params.inheritedConfig, params.inheritedSourceBase],
		[params.fallbackConfig, params.fallbackSourceBase]
	]) {
		if (config === void 0 || sourceBase === void 0) continue;
		for (const key of [
			"groups",
			"guilds",
			"channels",
			"rooms",
			"teams"
		]) {
			const container = isRecord(config[key]) ? config[key] : void 0;
			const wildcard = isRecord(container?.["*"]) ? container["*"] : void 0;
			const requireMention = asBoolean(wildcard?.requireMention);
			if (wildcard?.enabled !== false && requireMention !== void 0) return {
				source: `${sourceBase}/${key}/${ocPathSegment$1("*")}/requireMention`,
				value: requireMention
			};
		}
	}
}
function nestedIngressContainers(params) {
	const containers = [];
	for (const key of [
		"groups",
		"guilds",
		"channels",
		"rooms",
		"teams"
	]) {
		const local = isRecord(params.config[key]) ? params.config[key] : void 0;
		const inherited = isRecord(params.inheritedConfig[key]) ? params.inheritedConfig[key] : void 0;
		if (local !== void 0) {
			if (Object.keys(local).length > 0) containers.push({
				containerKey: key,
				container: local,
				sourceBase: params.sourceBase
			});
		} else if (params.inheritNestedContainers === true && inherited !== void 0) containers.push({
			containerKey: key,
			container: inherited,
			sourceBase: params.inheritedSourceBase
		});
	}
	return containers;
}
function pushNestedRequireMentionIngress(entries, params, containerKey, groupId, config, parentSourceBase) {
	if (config.enabled === false) return;
	const sourceBase = `${parentSourceBase}/${containerKey}/${ocPathSegment$1(groupId)}`;
	const requireMention = asBoolean(config.requireMention);
	if (requireMention !== void 0) entries.push({
		id: `${channelIngressId(params, `${containerKey}-${ocPathSegment$1(groupId)}`)}-require-mention`,
		kind: "channelRequireMention",
		source: `${sourceBase}/requireMention`,
		channel: params.channel,
		...params.accountId === void 0 ? {} : { accountId: params.accountId },
		groupId,
		value: requireMention ?? true,
		explicit: requireMention !== void 0
	});
	for (const nestedKey of ["channels", "topics"]) {
		const nested = config[nestedKey];
		if (!isRecord(nested)) continue;
		for (const [nestedId, nestedConfig] of Object.entries(nested)) if (isRecord(nestedConfig)) pushNestedRequireMentionIngress(entries, params, `${containerKey}/${ocPathSegment$1(groupId)}/${nestedKey}`, nestedId, nestedConfig, parentSourceBase);
	}
}
function channelDmPolicy(config) {
	const dm = isRecord(config.dm) ? config.dm : {};
	if (dm.enabled === false) return {
		value: "disabled",
		sourceSuffix: "dm/enabled",
		disabledByEnabled: true
	};
	const direct = normalizeOptionalString(config.dmPolicy);
	if (direct !== void 0) return {
		value: direct,
		sourceSuffix: "dmPolicy"
	};
	const legacy = normalizeOptionalString(dm.policy);
	return legacy === void 0 ? {} : {
		value: legacy,
		sourceSuffix: "dm/policy"
	};
}
function channelIngressId(params, suffix) {
	return params.accountId === void 0 ? `${params.channel}-${suffix}` : `${params.channel}-${params.accountId}-${suffix}`;
}
function pushGatewayBooleanEvidence(entries, id, kind, value, source) {
	if (typeof value !== "boolean") return;
	entries.push({
		id,
		kind,
		source,
		value
	});
}
function pushGatewayHttpEndpointEvidence(entries, endpoints, endpoint) {
	const config = endpoints[endpoint];
	if (!isRecord(config)) return;
	const source = `oc://openclaw.config/gateway/http/endpoints/${endpoint}`;
	const enabled = config.enabled === true;
	if (enabled) entries.push({
		id: `gateway-http-${endpoint}`,
		kind: "httpEndpoint",
		source: `${source}/enabled`,
		value: true,
		endpoint
	});
	if (!enabled) return;
	if (endpoint === "chatCompletions") {
		pushGatewayHttpUrlFetchEvidence(entries, source, endpoint, ["images"], config.images);
		return;
	}
	pushGatewayHttpUrlFetchEvidence(entries, source, endpoint, ["files"], config.files);
	pushGatewayHttpUrlFetchEvidence(entries, source, endpoint, ["images"], config.images);
}
function pushGatewayHttpUrlFetchEvidence(entries, endpointSource, endpoint, path, value) {
	const allowUrl = isRecord(value) ? value.allowUrl : void 0;
	if (allowUrl === false || allowUrl !== true && endpoint !== "responses") return;
	const allowlist = isRecord(value) ? value.urlAllowlist : void 0;
	const hasEffectiveAllowlist = Array.isArray(allowlist) && allowlist.some((entry) => isEffectiveGatewayUrlAllowlistEntry(entry));
	entries.push({
		id: `gateway-http-${endpoint}-${path.join("-")}-url-fetch`,
		kind: "httpUrlFetch",
		source: `${endpointSource}/${path.map(ocPathSegment$1).join("/")}/allowUrl`,
		value: true,
		endpoint,
		explicit: allowUrl === true,
		hasAllowlist: hasEffectiveAllowlist
	});
}
function isEffectiveGatewayUrlAllowlistEntry(value) {
	if (typeof value !== "string") return false;
	const normalized = value.trim().toLowerCase();
	return normalized !== "" && normalized !== "*" && normalized !== "*.";
}
function isGatewayNonLoopbackBind(value) {
	return value === "auto" || value === "lan" || value === "custom" || value === "tailnet";
}
function isRuntimeNonLoopbackCustomBindHost(value) {
	const normalized = value.trim().toLowerCase();
	return isCanonicalDottedDecimalIPv4(normalized) && !normalized.startsWith("127.");
}
function isCanonicalDottedDecimalIPv4(value) {
	return /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/.test(value);
}
function readBooleanPath(value, path) {
	let current = value;
	for (const part of path) {
		if (!isRecord(current)) return;
		current = current[part];
	}
	return typeof current === "boolean" ? current : void 0;
}
function collectModelRefsFromValue(refs, value, source) {
	if (typeof value === "string") {
		pushModelRef(refs, value, source);
		return;
	}
	if (!isRecord(value)) return;
	if (typeof value.primary === "string") pushModelRef(refs, value.primary, `${source}/primary`);
	if (Array.isArray(value.fallbacks)) {
		for (const [index, fallback] of value.fallbacks.entries()) if (typeof fallback === "string") pushModelRef(refs, fallback, `${source}/fallbacks/#${index}`);
	}
}
function collectModelRefsFromRecord(refs, value, source) {
	for (const [key, child] of Object.entries(value)) {
		const childPath = `${source}/${key}`;
		if (isModelSettingKey(key)) {
			collectModelRefsFromValue(refs, child, childPath);
			continue;
		}
		if (Array.isArray(child)) {
			for (const [index, item] of child.entries()) if (isRecord(item)) collectModelRefsFromRecord(refs, item, `${childPath}/#${index}`);
			continue;
		}
		if (isRecord(child)) collectModelRefsFromRecord(refs, child, childPath);
	}
}
function collectModelRefsFromAgentAllowlist(refs, agents) {
	const defaults = agents.defaults;
	if (isRecord(defaults) && isRecord(defaults.models)) collectModelRefsFromModelMap(refs, defaults.models, "oc://openclaw.config/agents/defaults/models");
	const list = agents.list;
	if (!Array.isArray(list)) return;
	for (const [index, agent] of list.entries()) {
		if (!isRecord(agent) || !isRecord(agent.models)) continue;
		collectModelRefsFromModelMap(refs, agent.models, `oc://openclaw.config/agents/list/#${index}/models`);
	}
}
function collectModelRefsFromModelMap(refs, models, source) {
	for (const ref of Object.keys(models)) pushModelRef(refs, ref, `${source}/${ocPathSegment$1(ref)}`);
}
function isModelSettingKey(key) {
	return key === "model" || key.endsWith("Model");
}
function ocPathSegment$1(value) {
	if (/^(?:[A-Za-z0-9_-]+|#\d+)$/.test(value)) return value;
	if (value.includes("\"") || value.includes("\\")) return value;
	return `"${value}"`;
}
function pushModelRef(refs, ref, source) {
	const parsed = parseModelRef(ref);
	if (parsed === void 0) return;
	refs.push({
		ref,
		provider: parsed.provider,
		model: parsed.model,
		source
	});
}
function parseModelRef(ref) {
	const trimmed = ref.trim();
	const slash = trimmed.indexOf("/");
	if (slash <= 0 || slash >= trimmed.length - 1) return;
	return {
		provider: normalizeProviderId(trimmed.slice(0, slash)),
		model: trimmed.slice(slash + 1)
	};
}
function sha256(value) {
	return `sha256:${createHash("sha256").update(value).digest("hex")}`;
}
function stableJson(value) {
	if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
	if (isRecord(value)) return `{${Object.entries(value).toSorted(([a], [b]) => a.localeCompare(b)).map(([key, child]) => `${JSON.stringify(key)}:${stableJson(child)}`).join(",")}}`;
	return JSON.stringify(value);
}
//#endregion
//#region extensions/policy/src/doctor/metadata.ts
const CHECK_IDS = {
	policyAttestationMismatch: "policy/attestation-hash-mismatch",
	policyDeniedChannelProvider: "policy/channels-denied-provider",
	policyHashMismatch: "policy/policy-hash-mismatch",
	policyInvalidFile: "policy/policy-jsonc-invalid",
	policyMissingFile: "policy/policy-jsonc-missing",
	policyDeniedMcpServer: "policy/mcp-denied-server",
	policyUnapprovedMcpServer: "policy/mcp-unapproved-server",
	policyDeniedModelProvider: "policy/models-denied-provider",
	policyUnapprovedModelProvider: "policy/models-unapproved-provider",
	policyPrivateNetworkAccess: "policy/network-private-access-enabled",
	policyIngressDmPolicyUnapproved: "policy/ingress-dm-policy-unapproved",
	policyIngressDmScopeUnapproved: "policy/ingress-dm-scope-unapproved",
	policyIngressOpenGroupsDenied: "policy/ingress-open-groups-denied",
	policyIngressGroupMentionRequired: "policy/ingress-group-mention-required",
	policyGatewayNonLoopbackBind: "policy/gateway-non-loopback-bind",
	policyGatewayAuthDisabled: "policy/gateway-auth-disabled",
	policyGatewayRateLimitMissing: "policy/gateway-rate-limit-missing",
	policyGatewayControlUiInsecure: "policy/gateway-control-ui-insecure",
	policyGatewayTailscaleFunnel: "policy/gateway-tailscale-funnel",
	policyGatewayRemoteEnabled: "policy/gateway-remote-enabled",
	policyGatewayHttpEndpointEnabled: "policy/gateway-http-endpoint-enabled",
	policyGatewayHttpUrlFetchUnrestricted: "policy/gateway-http-url-fetch-unrestricted",
	policyAgentsWorkspaceAccessDenied: "policy/agents-workspace-access-denied",
	policyAgentsToolNotDenied: "policy/agents-tool-not-denied",
	policyToolsElevatedEnabled: "policy/tools-elevated-enabled",
	policyToolsAlsoAllowMissing: "policy/tools-also-allow-missing",
	policyToolsAlsoAllowUnexpected: "policy/tools-also-allow-unexpected",
	policyToolsExecAskUnapproved: "policy/tools-exec-ask-unapproved",
	policyToolsExecHostUnapproved: "policy/tools-exec-host-unapproved",
	policyToolsExecSecurityUnapproved: "policy/tools-exec-security-unapproved",
	policyToolsFsWorkspaceOnlyRequired: "policy/tools-fs-workspace-only-required",
	policyToolsProfileUnapproved: "policy/tools-profile-unapproved",
	policyToolsRequiredDenyMissing: "policy/tools-required-deny-missing",
	policySandboxModeUnapproved: "policy/sandbox-mode-unapproved",
	policySandboxBackendUnapproved: "policy/sandbox-backend-unapproved",
	policySandboxContainerPostureUnobservable: "policy/sandbox-container-posture-unobservable",
	policySandboxContainerHostNetworkDenied: "policy/sandbox-container-host-network-denied",
	policySandboxContainerNamespaceJoinDenied: "policy/sandbox-container-namespace-join-denied",
	policySandboxContainerMountModeRequired: "policy/sandbox-container-mount-mode-required",
	policySandboxContainerRuntimeSocketMount: "policy/sandbox-container-runtime-socket-mount",
	policySandboxContainerUnconfinedProfile: "policy/sandbox-container-unconfined-profile",
	policySandboxBrowserCdpSourceRangeMissing: "policy/sandbox-browser-cdp-source-range-missing",
	policyDataHandlingRedactionDisabled: "policy/data-handling-redaction-disabled",
	policyDataHandlingTelemetryContentCapture: "policy/data-handling-telemetry-content-capture",
	policyDataHandlingSessionRetentionNotEnforced: "policy/data-handling-session-retention-not-enforced",
	policyDataHandlingSessionTranscriptMemory: "policy/data-handling-session-transcript-memory-enabled",
	policySecretsUnmanagedProvider: "policy/secrets-unmanaged-provider",
	policySecretsDeniedProviderSource: "policy/secrets-denied-provider-source",
	policySecretsInsecureProvider: "policy/secrets-insecure-provider",
	policyAuthProfileInvalidMetadata: "policy/auth-profile-invalid-metadata",
	policyAuthProfileUnapprovedMode: "policy/auth-profile-unapproved-mode",
	policyExecApprovalsMissing: "policy/exec-approvals-missing",
	policyExecApprovalsInvalid: "policy/exec-approvals-invalid",
	policyExecApprovalsDefaultSecurityUnapproved: "policy/exec-approvals-default-security-unapproved",
	policyExecApprovalsAgentSecurityUnapproved: "policy/exec-approvals-agent-security-unapproved",
	policyExecApprovalsAutoAllowSkillsEnabled: "policy/exec-approvals-auto-allow-skills-enabled",
	policyExecApprovalsAllowlistMissing: "policy/exec-approvals-allowlist-missing",
	policyExecApprovalsAllowlistUnexpected: "policy/exec-approvals-allowlist-unexpected",
	policyMissingToolOwner: "policy/tools-missing-owner",
	policyMissingToolRisk: "policy/tools-missing-risk-level",
	policyMissingToolSensitivity: "policy/tools-missing-sensitivity-token",
	policyUnknownToolRisk: "policy/tools-unknown-risk-level",
	policyUnknownToolSensitivity: "policy/tools-unknown-sensitivity-token"
};
const POLICY_CHECK_IDS = [
	CHECK_IDS.policyMissingFile,
	CHECK_IDS.policyInvalidFile,
	CHECK_IDS.policyHashMismatch,
	CHECK_IDS.policyAttestationMismatch,
	CHECK_IDS.policyDeniedChannelProvider,
	CHECK_IDS.policyDeniedMcpServer,
	CHECK_IDS.policyUnapprovedMcpServer,
	CHECK_IDS.policyDeniedModelProvider,
	CHECK_IDS.policyUnapprovedModelProvider,
	CHECK_IDS.policyPrivateNetworkAccess,
	CHECK_IDS.policyIngressDmPolicyUnapproved,
	CHECK_IDS.policyIngressDmScopeUnapproved,
	CHECK_IDS.policyIngressOpenGroupsDenied,
	CHECK_IDS.policyIngressGroupMentionRequired,
	CHECK_IDS.policyGatewayNonLoopbackBind,
	CHECK_IDS.policyGatewayAuthDisabled,
	CHECK_IDS.policyGatewayRateLimitMissing,
	CHECK_IDS.policyGatewayControlUiInsecure,
	CHECK_IDS.policyGatewayTailscaleFunnel,
	CHECK_IDS.policyGatewayRemoteEnabled,
	CHECK_IDS.policyGatewayHttpEndpointEnabled,
	CHECK_IDS.policyGatewayHttpUrlFetchUnrestricted,
	CHECK_IDS.policyAgentsWorkspaceAccessDenied,
	CHECK_IDS.policyAgentsToolNotDenied,
	CHECK_IDS.policyToolsProfileUnapproved,
	CHECK_IDS.policyToolsFsWorkspaceOnlyRequired,
	CHECK_IDS.policyToolsExecSecurityUnapproved,
	CHECK_IDS.policyToolsExecAskUnapproved,
	CHECK_IDS.policyToolsExecHostUnapproved,
	CHECK_IDS.policyToolsElevatedEnabled,
	CHECK_IDS.policyToolsAlsoAllowMissing,
	CHECK_IDS.policyToolsAlsoAllowUnexpected,
	CHECK_IDS.policyToolsRequiredDenyMissing,
	CHECK_IDS.policySandboxModeUnapproved,
	CHECK_IDS.policySandboxBackendUnapproved,
	CHECK_IDS.policySandboxContainerPostureUnobservable,
	CHECK_IDS.policySandboxContainerHostNetworkDenied,
	CHECK_IDS.policySandboxContainerNamespaceJoinDenied,
	CHECK_IDS.policySandboxContainerMountModeRequired,
	CHECK_IDS.policySandboxContainerRuntimeSocketMount,
	CHECK_IDS.policySandboxContainerUnconfinedProfile,
	CHECK_IDS.policySandboxBrowserCdpSourceRangeMissing,
	CHECK_IDS.policyDataHandlingRedactionDisabled,
	CHECK_IDS.policyDataHandlingTelemetryContentCapture,
	CHECK_IDS.policyDataHandlingSessionRetentionNotEnforced,
	CHECK_IDS.policyDataHandlingSessionTranscriptMemory,
	CHECK_IDS.policySecretsUnmanagedProvider,
	CHECK_IDS.policySecretsDeniedProviderSource,
	CHECK_IDS.policySecretsInsecureProvider,
	CHECK_IDS.policyAuthProfileInvalidMetadata,
	CHECK_IDS.policyAuthProfileUnapprovedMode,
	CHECK_IDS.policyExecApprovalsMissing,
	CHECK_IDS.policyExecApprovalsInvalid,
	CHECK_IDS.policyExecApprovalsDefaultSecurityUnapproved,
	CHECK_IDS.policyExecApprovalsAgentSecurityUnapproved,
	CHECK_IDS.policyExecApprovalsAutoAllowSkillsEnabled,
	CHECK_IDS.policyExecApprovalsAllowlistMissing,
	CHECK_IDS.policyExecApprovalsAllowlistUnexpected,
	CHECK_IDS.policyMissingToolRisk,
	CHECK_IDS.policyUnknownToolRisk,
	CHECK_IDS.policyMissingToolSensitivity,
	CHECK_IDS.policyMissingToolOwner,
	CHECK_IDS.policyUnknownToolSensitivity
];
const SANDBOX_CONTAINER_POLICY_RULES = [
	{
		key: "denyHostNetwork",
		label: "host network posture",
		checkIds: [CHECK_IDS.policySandboxContainerHostNetworkDenied]
	},
	{
		key: "denyContainerNamespaceJoin",
		label: "container namespace posture",
		checkIds: [CHECK_IDS.policySandboxContainerNamespaceJoinDenied]
	},
	{
		key: "requireReadOnlyMounts",
		label: "container mount mode posture",
		checkIds: [CHECK_IDS.policySandboxContainerMountModeRequired]
	},
	{
		key: "denyContainerRuntimeSocketMounts",
		label: "container runtime socket mount posture",
		checkIds: [CHECK_IDS.policySandboxContainerRuntimeSocketMount]
	},
	{
		key: "denyUnconfinedProfiles",
		label: "container security profile posture",
		checkIds: [CHECK_IDS.policySandboxContainerUnconfinedProfile]
	}
];
const SANDBOX_POLICY_RULE_METADATA = [
	{
		policyPath: ["sandbox", "requireMode"],
		strictness: "allowlist-subset",
		valueType: "string-list",
		checkIds: [CHECK_IDS.policySandboxModeUnapproved],
		emptyList: "disabled",
		allowedValues: [
			"off",
			"non-main",
			"all"
		],
		scopeSelectors: ["agentIds"]
	},
	{
		policyPath: ["sandbox", "allowBackends"],
		strictness: "allowlist-subset",
		valueType: "string-list",
		checkIds: [CHECK_IDS.policySandboxBackendUnapproved],
		emptyList: "disabled",
		scopeSelectors: ["agentIds"]
	},
	...SANDBOX_CONTAINER_POLICY_RULES.map((rule) => ({
		policyPath: [
			"sandbox",
			"containers",
			rule.key
		],
		strictness: "requires-true",
		valueType: "boolean",
		checkIds: rule.checkIds,
		scopeSelectors: ["agentIds"]
	})),
	{
		policyPath: [
			"sandbox",
			"browser",
			"requireCdpSourceRange"
		],
		strictness: "requires-true",
		valueType: "boolean",
		checkIds: [CHECK_IDS.policySandboxBrowserCdpSourceRangeMissing],
		scopeSelectors: ["agentIds"]
	}
];
const POLICY_RULE_METADATA = [
	{
		policyPath: ["channels", "denyRules"],
		strictness: "denylist-superset",
		valueType: "channel-provider-deny-rules",
		checkIds: [CHECK_IDS.policyDeniedChannelProvider],
		emptyList: "meaningful",
		caseSensitive: true
	},
	{
		policyPath: [
			"mcp",
			"servers",
			"allow"
		],
		strictness: "allowlist-subset",
		valueType: "string-list",
		checkIds: [CHECK_IDS.policyUnapprovedMcpServer],
		emptyList: "disabled",
		caseSensitive: true
	},
	{
		policyPath: [
			"mcp",
			"servers",
			"deny"
		],
		strictness: "denylist-superset",
		valueType: "string-list",
		checkIds: [CHECK_IDS.policyDeniedMcpServer],
		caseSensitive: true
	},
	{
		policyPath: [
			"models",
			"providers",
			"allow"
		],
		strictness: "allowlist-subset",
		valueType: "string-list",
		checkIds: [CHECK_IDS.policyUnapprovedModelProvider],
		emptyList: "disabled",
		normalizeValues: "model-provider"
	},
	{
		policyPath: [
			"models",
			"providers",
			"deny"
		],
		strictness: "denylist-superset",
		valueType: "string-list",
		checkIds: [CHECK_IDS.policyDeniedModelProvider],
		normalizeValues: "model-provider"
	},
	{
		policyPath: [
			"network",
			"privateNetwork",
			"allow"
		],
		strictness: "requires-false",
		valueType: "boolean",
		checkIds: [CHECK_IDS.policyPrivateNetworkAccess]
	},
	{
		policyPath: [
			"ingress",
			"session",
			"requireDmScope"
		],
		strictness: "ordered-string",
		valueType: "string",
		orderedValues: [
			"main",
			"per-peer",
			"per-channel-peer",
			"per-account-channel-peer"
		],
		checkIds: [CHECK_IDS.policyIngressDmScopeUnapproved]
	},
	{
		policyPath: [
			"gateway",
			"exposure",
			"allowNonLoopbackBind"
		],
		strictness: "requires-false",
		valueType: "boolean",
		checkIds: [CHECK_IDS.policyGatewayNonLoopbackBind]
	},
	{
		policyPath: [
			"gateway",
			"exposure",
			"allowTailscaleFunnel"
		],
		strictness: "requires-false",
		valueType: "boolean",
		checkIds: [CHECK_IDS.policyGatewayTailscaleFunnel]
	},
	{
		policyPath: [
			"gateway",
			"auth",
			"requireAuth"
		],
		strictness: "requires-true",
		valueType: "boolean",
		checkIds: [CHECK_IDS.policyGatewayAuthDisabled]
	},
	{
		policyPath: [
			"gateway",
			"auth",
			"requireExplicitRateLimit"
		],
		strictness: "requires-true",
		valueType: "boolean",
		checkIds: [CHECK_IDS.policyGatewayRateLimitMissing]
	},
	{
		policyPath: [
			"gateway",
			"controlUi",
			"allowInsecure"
		],
		strictness: "requires-false",
		valueType: "boolean",
		checkIds: [CHECK_IDS.policyGatewayControlUiInsecure]
	},
	{
		policyPath: [
			"gateway",
			"remote",
			"allow"
		],
		strictness: "requires-false",
		valueType: "boolean",
		checkIds: [CHECK_IDS.policyGatewayRemoteEnabled]
	},
	{
		policyPath: [
			"gateway",
			"http",
			"denyEndpoints"
		],
		strictness: "denylist-superset",
		valueType: "string-list",
		checkIds: [CHECK_IDS.policyGatewayHttpEndpointEnabled],
		allowedValues: ["chatCompletions", "responses"],
		caseSensitive: true
	},
	{
		policyPath: [
			"gateway",
			"http",
			"requireUrlAllowlists"
		],
		strictness: "requires-true",
		valueType: "boolean",
		checkIds: [CHECK_IDS.policyGatewayHttpUrlFetchUnrestricted]
	},
	{
		policyPath: [
			"agents",
			"workspace",
			"allowedAccess"
		],
		strictness: "allowlist-subset",
		valueType: "string-list",
		checkIds: [CHECK_IDS.policyAgentsWorkspaceAccessDenied],
		emptyList: "disabled",
		allowedValues: [
			"none",
			"ro",
			"rw"
		],
		scopeSelectors: ["agentIds"]
	},
	{
		policyPath: [
			"agents",
			"workspace",
			"denyTools"
		],
		strictness: "denylist-superset",
		valueType: "string-list",
		checkIds: [CHECK_IDS.policyAgentsToolNotDenied],
		allowedValues: [
			"exec",
			"process",
			"write",
			"edit",
			"apply_patch"
		],
		scopeSelectors: ["agentIds"]
	},
	{
		policyPath: [
			"tools",
			"profiles",
			"allow"
		],
		strictness: "allowlist-subset",
		valueType: "string-list",
		checkIds: [CHECK_IDS.policyToolsProfileUnapproved],
		emptyList: "disabled",
		allowedValues: [
			"minimal",
			"coding",
			"messaging",
			"full"
		],
		scopeSelectors: ["agentIds"]
	},
	{
		policyPath: [
			"tools",
			"fs",
			"requireWorkspaceOnly"
		],
		strictness: "requires-true",
		valueType: "boolean",
		checkIds: [CHECK_IDS.policyToolsFsWorkspaceOnlyRequired],
		scopeSelectors: ["agentIds"]
	},
	{
		policyPath: [
			"tools",
			"exec",
			"allowSecurity"
		],
		strictness: "allowlist-subset",
		valueType: "string-list",
		checkIds: [CHECK_IDS.policyToolsExecSecurityUnapproved],
		emptyList: "disabled",
		allowedValues: [
			"deny",
			"allowlist",
			"full"
		],
		scopeSelectors: ["agentIds"]
	},
	{
		policyPath: [
			"tools",
			"exec",
			"requireAsk"
		],
		strictness: "allowlist-subset",
		valueType: "string-list",
		checkIds: [CHECK_IDS.policyToolsExecAskUnapproved],
		emptyList: "disabled",
		allowedValues: [
			"off",
			"on-miss",
			"always"
		],
		scopeSelectors: ["agentIds"]
	},
	{
		policyPath: [
			"tools",
			"exec",
			"allowHosts"
		],
		strictness: "allowlist-subset",
		valueType: "string-list",
		checkIds: [CHECK_IDS.policyToolsExecHostUnapproved],
		emptyList: "disabled",
		allowedValues: [
			"auto",
			"sandbox",
			"gateway",
			"node"
		],
		scopeSelectors: ["agentIds"]
	},
	{
		policyPath: [
			"tools",
			"elevated",
			"allow"
		],
		strictness: "requires-false",
		valueType: "boolean",
		checkIds: [CHECK_IDS.policyToolsElevatedEnabled],
		scopeSelectors: ["agentIds"]
	},
	{
		policyPath: [
			"tools",
			"alsoAllow",
			"expected"
		],
		strictness: "exact-list",
		valueType: "string-list",
		checkIds: [CHECK_IDS.policyToolsAlsoAllowMissing, CHECK_IDS.policyToolsAlsoAllowUnexpected],
		emptyList: "meaningful",
		scopeSelectors: ["agentIds"]
	},
	{
		policyPath: ["tools", "denyTools"],
		strictness: "denylist-superset",
		valueType: "string-list",
		checkIds: [CHECK_IDS.policyToolsRequiredDenyMissing],
		scopeSelectors: ["agentIds"]
	},
	{
		policyPath: ["tools", "requireMetadata"],
		strictness: "denylist-superset",
		valueType: "string-list",
		checkIds: [
			CHECK_IDS.policyMissingToolRisk,
			CHECK_IDS.policyMissingToolSensitivity,
			CHECK_IDS.policyMissingToolOwner
		],
		allowedValues: [
			"risk",
			"sensitivity",
			"owner"
		]
	},
	...SANDBOX_POLICY_RULE_METADATA,
	{
		policyPath: [
			"ingress",
			"channels",
			"allowDmPolicies"
		],
		strictness: "allowlist-subset",
		valueType: "string-list",
		checkIds: [CHECK_IDS.policyIngressDmPolicyUnapproved],
		emptyList: "disabled",
		allowedValues: [
			"pairing",
			"allowlist",
			"open",
			"disabled"
		],
		scopeSelectors: ["channelIds"]
	},
	{
		policyPath: [
			"ingress",
			"channels",
			"denyOpenGroups"
		],
		strictness: "requires-true",
		valueType: "boolean",
		checkIds: [CHECK_IDS.policyIngressOpenGroupsDenied],
		scopeSelectors: ["channelIds"]
	},
	{
		policyPath: [
			"ingress",
			"channels",
			"requireMentionInGroups"
		],
		strictness: "requires-true",
		valueType: "boolean",
		checkIds: [CHECK_IDS.policyIngressGroupMentionRequired],
		scopeSelectors: ["channelIds"]
	},
	{
		policyPath: [
			"dataHandling",
			"sensitiveLogging",
			"requireRedaction"
		],
		strictness: "requires-true",
		valueType: "boolean",
		checkIds: [CHECK_IDS.policyDataHandlingRedactionDisabled]
	},
	{
		policyPath: [
			"dataHandling",
			"telemetry",
			"denyContentCapture"
		],
		strictness: "requires-true",
		valueType: "boolean",
		checkIds: [CHECK_IDS.policyDataHandlingTelemetryContentCapture]
	},
	{
		policyPath: [
			"dataHandling",
			"retention",
			"requireSessionMaintenance"
		],
		strictness: "requires-true",
		valueType: "boolean",
		checkIds: [CHECK_IDS.policyDataHandlingSessionRetentionNotEnforced]
	},
	{
		policyPath: [
			"dataHandling",
			"memory",
			"denySessionTranscriptIndexing"
		],
		strictness: "requires-true",
		valueType: "boolean",
		checkIds: [CHECK_IDS.policyDataHandlingSessionTranscriptMemory],
		scopeSelectors: ["agentIds"]
	},
	{
		policyPath: ["secrets", "requireManagedProviders"],
		strictness: "requires-true",
		valueType: "boolean",
		checkIds: [CHECK_IDS.policySecretsUnmanagedProvider]
	},
	{
		policyPath: ["secrets", "denySources"],
		strictness: "denylist-superset",
		valueType: "string-list",
		checkIds: [CHECK_IDS.policySecretsDeniedProviderSource]
	},
	{
		policyPath: ["secrets", "allowInsecureProviders"],
		strictness: "requires-false",
		valueType: "boolean",
		checkIds: [CHECK_IDS.policySecretsInsecureProvider]
	},
	{
		policyPath: ["execApprovals", "requireFile"],
		strictness: "requires-true",
		valueType: "boolean",
		checkIds: [CHECK_IDS.policyExecApprovalsMissing]
	},
	{
		policyPath: [
			"execApprovals",
			"defaults",
			"allowSecurity"
		],
		strictness: "allowlist-subset",
		valueType: "string-list",
		checkIds: [CHECK_IDS.policyExecApprovalsDefaultSecurityUnapproved],
		emptyList: "disabled",
		allowedValues: [
			"deny",
			"allowlist",
			"full"
		]
	},
	{
		policyPath: [
			"execApprovals",
			"agents",
			"allowSecurity"
		],
		strictness: "allowlist-subset",
		valueType: "string-list",
		checkIds: [CHECK_IDS.policyExecApprovalsAgentSecurityUnapproved],
		emptyList: "disabled",
		allowedValues: [
			"deny",
			"allowlist",
			"full"
		],
		scopeSelectors: ["agentIds"]
	},
	{
		policyPath: [
			"execApprovals",
			"agents",
			"allowAutoAllowSkills"
		],
		strictness: "requires-false",
		valueType: "boolean",
		checkIds: [CHECK_IDS.policyExecApprovalsAutoAllowSkillsEnabled],
		scopeSelectors: ["agentIds"]
	},
	{
		policyPath: [
			"execApprovals",
			"agents",
			"allowlist",
			"expected"
		],
		strictness: "exact-list",
		valueType: "string-list",
		checkIds: [CHECK_IDS.policyExecApprovalsAllowlistMissing, CHECK_IDS.policyExecApprovalsAllowlistUnexpected],
		emptyList: "meaningful",
		caseSensitive: true,
		scopeSelectors: ["agentIds"]
	},
	{
		policyPath: [
			"auth",
			"profiles",
			"requireMetadata"
		],
		strictness: "denylist-superset",
		valueType: "string-list",
		checkIds: [CHECK_IDS.policyAuthProfileInvalidMetadata],
		allowedValues: ["provider", "mode"]
	},
	{
		policyPath: [
			"auth",
			"profiles",
			"allowModes"
		],
		strictness: "allowlist-subset",
		valueType: "string-list",
		checkIds: [CHECK_IDS.policyAuthProfileUnapprovedMode],
		emptyList: "disabled",
		allowedValues: [
			"api_key",
			"aws-sdk",
			"oauth",
			"token"
		]
	}
];
//#endregion
//#region extensions/policy/src/doctor/scopes/channels.ts
function createPolicyChannelProviderChecks(deps) {
	const { channelIdsFromFindings, disableChannels, evaluatePolicy, findingsForCheck, workspaceRepairsDisabledResult, workspaceRepairsEnabled } = deps;
	return [{
		id: CHECK_IDS.policyDeniedChannelProvider,
		kind: "plugin",
		description: "Configured channels satisfy policy deny rules.",
		source: "policy",
		async detect(ctx) {
			return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyDeniedChannelProvider);
		},
		async repair(ctx, findings) {
			if (!workspaceRepairsEnabled(ctx)) return workspaceRepairsDisabledResult("channel config");
			const channelIds = channelIdsFromFindings(findings);
			if (channelIds.length === 0) return {
				status: "skipped",
				reason: "no channel findings matched a configurable channel",
				changes: []
			};
			const next = disableChannels(ctx.cfg, channelIds);
			if (next.changed.length === 0) return {
				status: "skipped",
				reason: "matching channels were already disabled or missing",
				changes: []
			};
			return {
				config: next.config,
				changes: next.changed.map((id) => `Disabled channels.${id}.enabled for policy conformance.`)
			};
		}
	}];
}
function createPolicyIngressChecks(deps) {
	const { evaluatePolicy, findingsForCheck } = deps;
	return [
		{
			id: CHECK_IDS.policyIngressDmPolicyUnapproved,
			kind: "plugin",
			description: "Channel direct-message access policy matches ingress requirements.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyIngressDmPolicyUnapproved);
			}
		},
		{
			id: CHECK_IDS.policyIngressDmScopeUnapproved,
			kind: "plugin",
			description: "Direct-message sessions use the policy-required isolation scope.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyIngressDmScopeUnapproved);
			}
		},
		{
			id: CHECK_IDS.policyIngressOpenGroupsDenied,
			kind: "plugin",
			description: "Channel group access does not use open group policy when denied.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyIngressOpenGroupsDenied);
			}
		},
		{
			id: CHECK_IDS.policyIngressGroupMentionRequired,
			kind: "plugin",
			description: "Channel group access keeps mention gates enabled when required.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyIngressGroupMentionRequired);
			}
		}
	];
}
//#endregion
//#region extensions/policy/src/doctor/scopes/core.ts
function createPolicyCoreChecks(deps) {
	const { evaluatePolicy, findingsForCheck } = deps;
	const policyMissingFileCheck = {
		id: CHECK_IDS.policyMissingFile,
		kind: "plugin",
		description: "The enabled Policy plugin has a policy file to verify.",
		source: "policy",
		async detect(ctx) {
			return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyMissingFile);
		}
	};
	const policyHashMismatchCheck = {
		id: CHECK_IDS.policyHashMismatch,
		kind: "plugin",
		description: "The policy file matches the configured expected hash.",
		source: "policy",
		async detect(ctx) {
			return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyHashMismatch);
		}
	};
	const policyAttestationMismatchCheck = {
		id: CHECK_IDS.policyAttestationMismatch,
		kind: "plugin",
		description: "The current policy check matches the accepted attestation.",
		source: "policy",
		async detect(ctx) {
			return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyAttestationMismatch);
		}
	};
	return [
		policyMissingFileCheck,
		{
			id: CHECK_IDS.policyInvalidFile,
			kind: "plugin",
			description: "The enabled policy file parses before policy checks run.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyInvalidFile);
			}
		},
		policyHashMismatchCheck,
		policyAttestationMismatchCheck
	];
}
//#endregion
//#region extensions/policy/src/doctor/scopes/data-auth.ts
function createPolicyDataAuthChecks(deps) {
	const { evaluatePolicy, findingsForCheck } = deps;
	return [
		{
			id: CHECK_IDS.policyDataHandlingRedactionDisabled,
			kind: "plugin",
			description: "Sensitive logging redaction remains enabled when policy requires it.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyDataHandlingRedactionDisabled);
			}
		},
		{
			id: CHECK_IDS.policyDataHandlingTelemetryContentCapture,
			kind: "plugin",
			description: "Telemetry content capture remains disabled when policy denies it.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyDataHandlingTelemetryContentCapture);
			}
		},
		{
			id: CHECK_IDS.policyDataHandlingSessionRetentionNotEnforced,
			kind: "plugin",
			description: "Session retention maintenance is enforced when policy requires it.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyDataHandlingSessionRetentionNotEnforced);
			}
		},
		{
			id: CHECK_IDS.policyDataHandlingSessionTranscriptMemory,
			kind: "plugin",
			description: "Session transcript memory indexing remains disabled when policy denies it.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyDataHandlingSessionTranscriptMemory);
			}
		},
		{
			id: CHECK_IDS.policySecretsUnmanagedProvider,
			kind: "plugin",
			description: "OpenClaw config SecretRefs use configured secret providers when policy requires managed providers.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policySecretsUnmanagedProvider);
			}
		},
		{
			id: CHECK_IDS.policySecretsDeniedProviderSource,
			kind: "plugin",
			description: "OpenClaw config secret providers and SecretRefs do not use sources denied by policy.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policySecretsDeniedProviderSource);
			}
		},
		{
			id: CHECK_IDS.policySecretsInsecureProvider,
			kind: "plugin",
			description: "Configured secret providers do not opt into insecure posture unless policy allows it.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policySecretsInsecureProvider);
			}
		},
		{
			id: CHECK_IDS.policyAuthProfileInvalidMetadata,
			kind: "plugin",
			description: "OpenClaw config auth profiles declare required provider and mode metadata.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyAuthProfileInvalidMetadata);
			}
		},
		{
			id: CHECK_IDS.policyAuthProfileUnapprovedMode,
			kind: "plugin",
			description: "OpenClaw config auth profile modes stay within the policy allowlist.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyAuthProfileUnapprovedMode);
			}
		}
	];
}
//#endregion
//#region extensions/policy/src/doctor/scopes/exec-approvals.ts
function createPolicyExecApprovalChecks(deps) {
	const { evaluatePolicy, findingsForCheck } = deps;
	return [
		{
			id: CHECK_IDS.policyExecApprovalsMissing,
			kind: "plugin",
			description: "Required exec approvals artifact is present for policy conformance.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyExecApprovalsMissing);
			}
		},
		{
			id: CHECK_IDS.policyExecApprovalsInvalid,
			kind: "plugin",
			description: "Exec approvals artifact parses before policy checks run.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyExecApprovalsInvalid);
			}
		},
		{
			id: CHECK_IDS.policyExecApprovalsDefaultSecurityUnapproved,
			kind: "plugin",
			description: "Exec approval defaults use a policy-approved security mode.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyExecApprovalsDefaultSecurityUnapproved);
			}
		},
		{
			id: CHECK_IDS.policyExecApprovalsAgentSecurityUnapproved,
			kind: "plugin",
			description: "Per-agent exec approval settings use policy-approved security modes.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyExecApprovalsAgentSecurityUnapproved);
			}
		},
		{
			id: CHECK_IDS.policyExecApprovalsAutoAllowSkillsEnabled,
			kind: "plugin",
			description: "Exec approval agents do not implicitly auto-allow skill CLIs unless policy allows it.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyExecApprovalsAutoAllowSkillsEnabled);
			}
		},
		{
			id: CHECK_IDS.policyExecApprovalsAllowlistMissing,
			kind: "plugin",
			description: "Exec approval allowlists include every pattern required by policy.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyExecApprovalsAllowlistMissing);
			}
		},
		{
			id: CHECK_IDS.policyExecApprovalsAllowlistUnexpected,
			kind: "plugin",
			description: "Exec approval allowlists do not contain patterns outside policy.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyExecApprovalsAllowlistUnexpected);
			}
		}
	];
}
//#endregion
//#region extensions/policy/src/doctor/utils.ts
function readPolicyStringArray(policy, path, options = {}) {
	let current = policy;
	for (const part of path) {
		if (!isRecord(current)) return;
		current = current[part];
	}
	if (!Array.isArray(current) || !current.every((entry) => typeof entry === "string")) return;
	const lowercase = options.lowercase ?? true;
	return current.map((entry) => {
		const trimmed = entry.trim();
		return lowercase ? trimmed.toLowerCase() : trimmed;
	}).filter(Boolean);
}
function readStringList(policy, path, options) {
	return readPolicyStringArray(policy, path, options) ?? [];
}
function readString(policy, path) {
	let current = policy;
	for (const part of path) {
		if (!isRecord(current)) return;
		current = current[part];
	}
	return typeof current === "string" ? current.trim().toLowerCase() : void 0;
}
function ocPathSegment(value) {
	if (/^(?:[A-Za-z0-9_-]+|#\d+)$/.test(value)) return value;
	return JSON.stringify(value);
}
function readPolicyBoolean(policy, path) {
	let current = policy;
	for (const part of path) {
		if (!isRecord(current)) return;
		current = current[part];
	}
	return typeof current === "boolean" ? current : void 0;
}
//#endregion
//#region extensions/policy/src/doctor/scopes/gateway.ts
function createPolicyGatewayChecks(deps) {
	const { evaluatePolicy, findingsForCheck } = deps;
	return [
		{
			id: CHECK_IDS.policyGatewayNonLoopbackBind,
			kind: "plugin",
			description: "Gateway bind posture matches policy exposure requirements.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyGatewayNonLoopbackBind);
			}
		},
		{
			id: CHECK_IDS.policyGatewayAuthDisabled,
			kind: "plugin",
			description: "Gateway authentication remains enabled when required by policy.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyGatewayAuthDisabled);
			}
		},
		{
			id: CHECK_IDS.policyGatewayRateLimitMissing,
			kind: "plugin",
			description: "Gateway authentication rate-limit posture is explicit when required by policy.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyGatewayRateLimitMissing);
			}
		},
		{
			id: CHECK_IDS.policyGatewayControlUiInsecure,
			kind: "plugin",
			description: "Gateway Control UI insecure exposure toggles remain disabled by policy.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyGatewayControlUiInsecure);
			}
		},
		{
			id: CHECK_IDS.policyGatewayTailscaleFunnel,
			kind: "plugin",
			description: "Gateway Tailscale Funnel exposure matches policy.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyGatewayTailscaleFunnel);
			}
		},
		{
			id: CHECK_IDS.policyGatewayRemoteEnabled,
			kind: "plugin",
			description: "Remote gateway mode matches policy.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyGatewayRemoteEnabled);
			}
		},
		{
			id: CHECK_IDS.policyGatewayHttpEndpointEnabled,
			kind: "plugin",
			description: "Gateway HTTP API endpoints match policy.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyGatewayHttpEndpointEnabled);
			}
		},
		{
			id: CHECK_IDS.policyGatewayHttpUrlFetchUnrestricted,
			kind: "plugin",
			description: "Gateway HTTP URL-fetch inputs have allowlists when required by policy.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyGatewayHttpUrlFetchUnrestricted);
			}
		}
	];
}
function gatewayExposureFindings(policy, policyDocName, evidence) {
	return [
		...gatewayNonLoopbackBindFindings(policy, policyDocName, evidence),
		...gatewayAuthFindings(policy, policyDocName, evidence),
		...gatewayControlUiFindings(policy, policyDocName, evidence),
		...gatewayTailscaleFindings(policy, policyDocName, evidence),
		...gatewayRemoteFindings(policy, policyDocName, evidence),
		...gatewayHttpEndpointFindings(policy, policyDocName, evidence),
		...gatewayHttpUrlFetchFindings(policy, policyDocName, evidence)
	];
}
function gatewayNonLoopbackBindFindings(policy, policyDocName, evidence) {
	if (readPolicyBoolean(policy, [
		"gateway",
		"exposure",
		"allowNonLoopbackBind"
	]) !== false) return [];
	return (evidence.gatewayExposure ?? []).filter((entry) => entry.kind === "bind" && entry.nonLoopback === true).map((entry) => {
		return {
			checkId: CHECK_IDS.policyGatewayNonLoopbackBind,
			severity: "error",
			message: entry.explicit === false ? "Gateway bind is omitted while the runtime default can permit non-loopback exposure." : `Gateway bind setting '${entry.id}' permits non-loopback exposure.`,
			source: "policy",
			path: "openclaw config",
			ocPath: entry.source,
			target: entry.source,
			requirement: `oc://${policyDocName}/gateway/exposure/allowNonLoopbackBind`,
			fixHint: "Use gateway.bind=loopback or update policy after review."
		};
	});
}
function gatewayAuthFindings(policy, policyDocName, evidence) {
	const findings = [];
	if (readPolicyBoolean(policy, [
		"gateway",
		"auth",
		"requireAuth"
	]) === true) findings.push(...(evidence.gatewayExposure ?? []).filter((entry) => entry.kind === "auth" && entry.value === "none").map((entry) => {
		return {
			checkId: CHECK_IDS.policyGatewayAuthDisabled,
			severity: "error",
			message: "Gateway authentication is disabled.",
			source: "policy",
			path: "openclaw config",
			ocPath: entry.source,
			target: entry.source,
			requirement: `oc://${policyDocName}/gateway/auth/requireAuth`,
			fixHint: "Set gateway.auth.mode to token, password, or trusted-proxy."
		};
	}));
	if (readPolicyBoolean(policy, [
		"gateway",
		"auth",
		"requireExplicitRateLimit"
	]) === true) findings.push(...(evidence.gatewayExposure ?? []).filter((entry) => entry.kind === "authRateLimit" && entry.explicit !== true).map((entry) => {
		return {
			checkId: CHECK_IDS.policyGatewayRateLimitMissing,
			severity: "error",
			message: "Gateway authentication rate-limit posture is not explicit.",
			source: "policy",
			path: "openclaw config",
			ocPath: entry.source,
			target: entry.source,
			requirement: `oc://${policyDocName}/gateway/auth/requireExplicitRateLimit`,
			fixHint: "Configure gateway.auth.rateLimit or update policy after review."
		};
	}));
	return findings;
}
function gatewayControlUiFindings(policy, policyDocName, evidence) {
	if (readPolicyBoolean(policy, [
		"gateway",
		"controlUi",
		"allowInsecure"
	]) !== false) return [];
	return (evidence.gatewayExposure ?? []).filter((entry) => entry.kind === "controlUi" && entry.value === true && (entry.id === "gateway-control-ui-insecure-auth" || entry.id === "gateway-control-ui-device-auth-disabled" || entry.id === "gateway-control-ui-host-origin-fallback")).map((entry) => {
		return {
			checkId: CHECK_IDS.policyGatewayControlUiInsecure,
			severity: "error",
			message: `Gateway Control UI insecure toggle '${entry.id}' is enabled.`,
			source: "policy",
			path: "openclaw config",
			ocPath: entry.source,
			target: entry.source,
			requirement: `oc://${policyDocName}/gateway/controlUi/allowInsecure`,
			fixHint: "Disable the insecure Control UI toggle or update policy after review."
		};
	});
}
function gatewayTailscaleFindings(policy, policyDocName, evidence) {
	if (readPolicyBoolean(policy, [
		"gateway",
		"exposure",
		"allowTailscaleFunnel"
	]) !== false) return [];
	return (evidence.gatewayExposure ?? []).filter((entry) => entry.kind === "tailscale" && entry.value === "funnel").map((entry) => {
		return {
			checkId: CHECK_IDS.policyGatewayTailscaleFunnel,
			severity: "error",
			message: "Gateway Tailscale Funnel exposure is enabled.",
			source: "policy",
			path: "openclaw config",
			ocPath: entry.source,
			target: entry.source,
			requirement: `oc://${policyDocName}/gateway/exposure/allowTailscaleFunnel`,
			fixHint: "Use tailscale serve/off or update policy after review."
		};
	});
}
function gatewayRemoteFindings(policy, policyDocName, evidence) {
	if (readPolicyBoolean(policy, [
		"gateway",
		"remote",
		"allow"
	]) !== false) return [];
	return (evidence.gatewayExposure ?? []).filter((entry) => entry.kind === "remote").map((entry) => {
		return {
			checkId: CHECK_IDS.policyGatewayRemoteEnabled,
			severity: "error",
			message: `Gateway remote posture '${entry.id}' is enabled.`,
			source: "policy",
			path: "openclaw config",
			ocPath: entry.source,
			target: entry.source,
			requirement: `oc://${policyDocName}/gateway/remote/allow`,
			fixHint: "Disable remote gateway mode/config or update policy after review."
		};
	});
}
function gatewayHttpEndpointFindings(policy, policyDocName, evidence) {
	const denied = new Set(readStringList(policy, [
		"gateway",
		"http",
		"denyEndpoints"
	]).map((endpoint) => endpoint.toLowerCase()));
	if (denied.size === 0) return [];
	return (evidence.gatewayExposure ?? []).filter((entry) => entry.kind === "httpEndpoint" && entry.endpoint !== void 0 && denied.has(entry.endpoint.toLowerCase())).map((entry) => {
		return {
			checkId: CHECK_IDS.policyGatewayHttpEndpointEnabled,
			severity: "error",
			message: `Gateway HTTP endpoint '${entry.endpoint ?? entry.id}' is denied by policy.`,
			source: "policy",
			path: "openclaw config",
			ocPath: entry.source,
			target: entry.source,
			requirement: `oc://${policyDocName}/gateway/http/denyEndpoints`,
			fixHint: "Disable the HTTP endpoint or update policy after review."
		};
	});
}
function gatewayHttpUrlFetchFindings(policy, policyDocName, evidence) {
	if (readPolicyBoolean(policy, [
		"gateway",
		"http",
		"requireUrlAllowlists"
	]) !== true) return [];
	return (evidence.gatewayExposure ?? []).filter((entry) => entry.kind === "httpUrlFetch" && entry.hasAllowlist !== true).map((entry) => {
		return {
			checkId: CHECK_IDS.policyGatewayHttpUrlFetchUnrestricted,
			severity: "error",
			message: `Gateway HTTP URL-fetch input '${entry.id}' has no URL allowlist.`,
			source: "policy",
			path: "openclaw config",
			ocPath: entry.source,
			target: entry.source,
			requirement: `oc://${policyDocName}/gateway/http/requireUrlAllowlists`,
			fixHint: "Add a urlAllowlist for this URL-fetch input or update policy after review."
		};
	});
}
//#endregion
//#region extensions/policy/src/doctor/scopes/model-network.ts
function createPolicyModelNetworkChecks(deps) {
	const { evaluatePolicy, findingsForCheck } = deps;
	return [
		{
			id: CHECK_IDS.policyDeniedMcpServer,
			kind: "plugin",
			description: "Configured MCP servers do not match policy deny rules.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyDeniedMcpServer);
			}
		},
		{
			id: CHECK_IDS.policyUnapprovedMcpServer,
			kind: "plugin",
			description: "Configured MCP servers do not match policy allow rules.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyUnapprovedMcpServer);
			}
		},
		{
			id: CHECK_IDS.policyDeniedModelProvider,
			kind: "plugin",
			description: "Configured model providers do not match policy deny rules.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyDeniedModelProvider);
			}
		},
		{
			id: CHECK_IDS.policyUnapprovedModelProvider,
			kind: "plugin",
			description: "Configured model providers do not match policy allow rules.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyUnapprovedModelProvider);
			}
		},
		{
			id: CHECK_IDS.policyPrivateNetworkAccess,
			kind: "plugin",
			description: "Network SSRF policy settings match private-network requirements.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyPrivateNetworkAccess);
			}
		}
	];
}
function mcpServerFindings(policy, policyDocName, evidence) {
	const denied = new Set(readStringList(policy, [
		"mcp",
		"servers",
		"deny"
	], { lowercase: false }));
	const allowed = readStringList(policy, [
		"mcp",
		"servers",
		"allow"
	], { lowercase: false });
	const allowedSet = new Set(allowed);
	const findings = [];
	for (const server of evidence.mcpServers) {
		if (denied.has(server.id)) {
			findings.push({
				checkId: CHECK_IDS.policyDeniedMcpServer,
				severity: "error",
				message: `MCP server '${server.id}' is denied by policy.`,
				source: "policy",
				path: "openclaw config",
				ocPath: server.source,
				target: server.source,
				requirement: `oc://${policyDocName}/mcp/servers/deny`,
				fixHint: "Remove this configured MCP server or update the policy after review."
			});
			continue;
		}
		if (allowedSet.size > 0 && !allowedSet.has(server.id)) findings.push({
			checkId: CHECK_IDS.policyUnapprovedMcpServer,
			severity: "error",
			message: `MCP server '${server.id}' is not in the policy allowlist.`,
			source: "policy",
			path: "openclaw config",
			ocPath: server.source,
			target: server.source,
			requirement: `oc://${policyDocName}/mcp/servers/allow`,
			fixHint: "Use an approved MCP server or update the policy after review."
		});
	}
	return findings;
}
function modelProviderFindings(policy, policyDocName, evidence) {
	const denied = new Set(readModelProviderPolicyList(policy, [
		"models",
		"providers",
		"deny"
	]));
	const allowed = readModelProviderPolicyList(policy, [
		"models",
		"providers",
		"allow"
	]);
	const allowedSet = new Set(allowed);
	const findings = [];
	for (const provider of evidence.modelProviders) findings.push(...modelProviderConformanceFindings(provider, denied, allowedSet, policyDocName));
	for (const modelRef of evidence.modelRefs) findings.push(...modelRefConformanceFindings(modelRef, denied, allowedSet, policyDocName));
	return findings;
}
function readModelProviderPolicyList(policy, path) {
	return readStringList(policy, path).map((provider) => normalizeProviderId(provider));
}
function modelProviderConformanceFindings(provider, denied, allowed, policyDocName) {
	const findings = [];
	if (denied.has(provider.id)) findings.push({
		checkId: CHECK_IDS.policyDeniedModelProvider,
		severity: "error",
		message: `Model provider '${provider.id}' is denied by policy.`,
		source: "policy",
		path: "openclaw config",
		ocPath: provider.source,
		target: provider.source,
		requirement: `oc://${policyDocName}/models/providers/deny`,
		fixHint: "Remove this configured provider or update the policy after review."
	});
	if (!denied.has(provider.id) && allowed.size > 0 && !allowed.has(provider.id)) findings.push({
		checkId: CHECK_IDS.policyUnapprovedModelProvider,
		severity: "error",
		message: `Model provider '${provider.id}' is not in the policy allowlist.`,
		source: "policy",
		path: "openclaw config",
		ocPath: provider.source,
		target: provider.source,
		requirement: `oc://${policyDocName}/models/providers/allow`,
		fixHint: "Use an approved model provider or update the policy after review."
	});
	return findings;
}
function modelRefConformanceFindings(modelRef, denied, allowed, policyDocName) {
	const findings = [];
	if (denied.has(modelRef.provider)) findings.push({
		checkId: CHECK_IDS.policyDeniedModelProvider,
		severity: "error",
		message: `Model ref '${modelRef.ref}' uses denied provider '${modelRef.provider}'.`,
		source: "policy",
		path: "openclaw config",
		ocPath: modelRef.source,
		target: modelRef.source,
		requirement: `oc://${policyDocName}/models/providers/deny`,
		fixHint: "Select an approved model provider or update the policy after review."
	});
	if (!denied.has(modelRef.provider) && allowed.size > 0 && !allowed.has(modelRef.provider)) findings.push({
		checkId: CHECK_IDS.policyUnapprovedModelProvider,
		severity: "error",
		message: `Model ref '${modelRef.ref}' uses unapproved provider '${modelRef.provider}'.`,
		source: "policy",
		path: "openclaw config",
		ocPath: modelRef.source,
		target: modelRef.source,
		requirement: `oc://${policyDocName}/models/providers/allow`,
		fixHint: "Select an approved model provider or update the policy after review."
	});
	return findings;
}
function networkFindings(policy, policyDocName, evidence) {
	if (readPolicyBoolean(policy, [
		"network",
		"privateNetwork",
		"allow"
	]) !== false) return [];
	return evidence.network.filter((setting) => setting.value).map((setting) => {
		return {
			checkId: CHECK_IDS.policyPrivateNetworkAccess,
			severity: "error",
			message: `Network setting '${setting.id}' allows private-network access.`,
			source: "policy",
			path: "openclaw config",
			ocPath: setting.source,
			target: setting.source,
			requirement: `oc://${policyDocName}/network/privateNetwork/allow`,
			fixHint: "Disable this private-network access setting or update policy after review."
		};
	});
}
//#endregion
//#region extensions/policy/src/doctor/scopes/sandbox.ts
function createPolicySandboxChecks(deps) {
	const { evaluatePolicy, findingsForCheck } = deps;
	return [
		{
			id: CHECK_IDS.policySandboxModeUnapproved,
			kind: "plugin",
			description: "Sandbox mode config satisfies policy requirements.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policySandboxModeUnapproved);
			}
		},
		{
			id: CHECK_IDS.policySandboxBackendUnapproved,
			kind: "plugin",
			description: "Sandbox backend config satisfies policy requirements.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policySandboxBackendUnapproved);
			}
		},
		{
			id: CHECK_IDS.policySandboxContainerPostureUnobservable,
			kind: "plugin",
			description: "Sandbox container posture policy only targets observable container backends.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policySandboxContainerPostureUnobservable);
			}
		},
		{
			id: CHECK_IDS.policySandboxContainerHostNetworkDenied,
			kind: "plugin",
			description: "Sandbox container config avoids host network mode.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policySandboxContainerHostNetworkDenied);
			}
		},
		{
			id: CHECK_IDS.policySandboxContainerNamespaceJoinDenied,
			kind: "plugin",
			description: "Sandbox container config avoids joining another container network namespace.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policySandboxContainerNamespaceJoinDenied);
			}
		},
		{
			id: CHECK_IDS.policySandboxContainerMountModeRequired,
			kind: "plugin",
			description: "Sandbox container mounts are read-only when policy requires it.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policySandboxContainerMountModeRequired);
			}
		},
		{
			id: CHECK_IDS.policySandboxContainerRuntimeSocketMount,
			kind: "plugin",
			description: "Sandbox container mounts avoid host container runtime sockets.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policySandboxContainerRuntimeSocketMount);
			}
		},
		{
			id: CHECK_IDS.policySandboxContainerUnconfinedProfile,
			kind: "plugin",
			description: "Sandbox container profile config avoids unconfined profiles.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policySandboxContainerUnconfinedProfile);
			}
		},
		{
			id: CHECK_IDS.policySandboxBrowserCdpSourceRangeMissing,
			kind: "plugin",
			description: "Sandbox browser CDP config includes a source range when policy requires it.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policySandboxBrowserCdpSourceRangeMissing);
			}
		}
	];
}
//#endregion
//#region extensions/policy/src/doctor/scopes/tools.ts
function createPolicyAgentToolChecks(deps) {
	const { evaluatePolicy, findingsForCheck } = deps;
	return [
		{
			id: CHECK_IDS.policyAgentsWorkspaceAccessDenied,
			kind: "plugin",
			description: "Agent sandbox workspace access matches policy.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyAgentsWorkspaceAccessDenied);
			}
		},
		{
			id: CHECK_IDS.policyAgentsToolNotDenied,
			kind: "plugin",
			description: "Agent workspace mutation/runtime tools are denied when policy requires it.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyAgentsToolNotDenied);
			}
		},
		{
			id: CHECK_IDS.policyToolsProfileUnapproved,
			kind: "plugin",
			description: "Configured tool profiles match policy allow rules.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyToolsProfileUnapproved);
			}
		},
		{
			id: CHECK_IDS.policyToolsFsWorkspaceOnlyRequired,
			kind: "plugin",
			description: "Filesystem tools use workspace-only posture when policy requires it.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyToolsFsWorkspaceOnlyRequired);
			}
		},
		{
			id: CHECK_IDS.policyToolsExecSecurityUnapproved,
			kind: "plugin",
			description: "Exec tool security mode matches policy allow rules.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyToolsExecSecurityUnapproved);
			}
		},
		{
			id: CHECK_IDS.policyToolsExecAskUnapproved,
			kind: "plugin",
			description: "Exec tool ask mode matches policy allow rules.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyToolsExecAskUnapproved);
			}
		},
		{
			id: CHECK_IDS.policyToolsExecHostUnapproved,
			kind: "plugin",
			description: "Exec tool host routing matches policy allow rules.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyToolsExecHostUnapproved);
			}
		},
		{
			id: CHECK_IDS.policyToolsElevatedEnabled,
			kind: "plugin",
			description: "Elevated tool mode remains disabled when policy requires it.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyToolsElevatedEnabled);
			}
		},
		{
			id: CHECK_IDS.policyToolsAlsoAllowMissing,
			kind: "plugin",
			description: "Configured tools.alsoAllow entries include policy expected lists.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyToolsAlsoAllowMissing);
			}
		},
		{
			id: CHECK_IDS.policyToolsAlsoAllowUnexpected,
			kind: "plugin",
			description: "Configured tools.alsoAllow entries match policy expected lists.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyToolsAlsoAllowUnexpected);
			}
		},
		{
			id: CHECK_IDS.policyToolsRequiredDenyMissing,
			kind: "plugin",
			description: "Configured tool deny lists include tools required by policy.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyToolsRequiredDenyMissing);
			}
		}
	];
}
function createPolicyToolMetadataChecks(deps) {
	const { evaluatePolicy, findingsForCheck } = deps;
	const policyToolsMissingRiskCheck = {
		id: CHECK_IDS.policyMissingToolRisk,
		kind: "plugin",
		description: "TOOLS.md policy entries declare explicit risk levels.",
		source: "policy",
		async detect(ctx) {
			return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyMissingToolRisk);
		}
	};
	const policyToolsUnknownRiskCheck = {
		id: CHECK_IDS.policyUnknownToolRisk,
		kind: "plugin",
		description: "TOOLS.md policy entries use known risk levels.",
		source: "policy",
		async detect(ctx) {
			return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyUnknownToolRisk);
		}
	};
	const policyToolsMissingSensitivityCheck = {
		id: CHECK_IDS.policyMissingToolSensitivity,
		kind: "plugin",
		description: "TOOLS.md policy entries declare default artifact sensitivity.",
		source: "policy",
		async detect(ctx) {
			return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyMissingToolSensitivity);
		}
	};
	const policyToolsUnknownSensitivityCheck = {
		id: CHECK_IDS.policyUnknownToolSensitivity,
		kind: "plugin",
		description: "TOOLS.md policy entries use known sensitivity levels.",
		source: "policy",
		async detect(ctx) {
			return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyUnknownToolSensitivity);
		}
	};
	return [
		policyToolsMissingRiskCheck,
		policyToolsUnknownRiskCheck,
		policyToolsMissingSensitivityCheck,
		{
			id: CHECK_IDS.policyMissingToolOwner,
			kind: "plugin",
			description: "TOOLS.md policy entries declare an accountable owner.",
			source: "policy",
			async detect(ctx) {
				return findingsForCheck(await evaluatePolicy(ctx), CHECK_IDS.policyMissingToolOwner);
			}
		},
		policyToolsUnknownSensitivityCheck
	];
}
//#endregion
//#region extensions/policy/src/doctor/checks.ts
function createPolicyDoctorChecks(deps) {
	return [
		...createPolicyCoreChecks(deps),
		...createPolicyChannelProviderChecks(deps),
		...createPolicyModelNetworkChecks(deps),
		...createPolicyIngressChecks(deps),
		...createPolicyGatewayChecks(deps),
		...createPolicyAgentToolChecks(deps),
		...createPolicySandboxChecks(deps),
		...createPolicyDataAuthChecks(deps),
		...createPolicyExecApprovalChecks(deps),
		...createPolicyToolMetadataChecks(deps)
	];
}
//#endregion
//#region extensions/policy/src/doctor/strictness.ts
function isPolicyValueAtLeastAsStrict(metadata, candidate, baseline) {
	switch (metadata.strictness) {
		case "allowlist-subset": return isPolicyAllowlistSubset(metadata, candidate, baseline);
		case "denylist-superset": return isPolicyDenylistSuperset(metadata, candidate, baseline);
		case "ordered-string": return isPolicyOrderedStringAtLeastAsStrict(metadata, candidate, baseline);
		case "requires-true": return baseline !== true || candidate === true;
		case "requires-false": return baseline !== false || candidate === false;
		case "exact-list": return samePolicyStringList(candidate, baseline, metadata);
	}
	return false;
}
function isPolicyOrderedStringAtLeastAsStrict(metadata, candidate, baseline) {
	const candidateValue = policyString(candidate, metadata);
	const baselineValue = policyString(baseline, metadata);
	if (candidateValue === void 0 || baselineValue === void 0 || metadata.orderedValues === void 0) return false;
	const orderedValues = metadata.orderedValues.map((entry) => metadata.caseSensitive === true ? entry : entry.toLowerCase());
	const candidateIndex = orderedValues.indexOf(candidateValue);
	const baselineIndex = orderedValues.indexOf(baselineValue);
	return candidateIndex >= 0 && baselineIndex >= 0 && candidateIndex >= baselineIndex;
}
function isPolicyAllowlistSubset(metadata, candidate, baseline) {
	const candidateList = policyStringList(candidate, metadata);
	const baselineList = policyStringList(baseline, metadata);
	if (candidateList === void 0 || baselineList === void 0) return false;
	if (metadata.emptyList === "disabled" && baselineList.length === 0) return true;
	if (metadata.emptyList === "disabled" && baselineList.length > 0 && candidateList.length === 0) return false;
	const allowed = new Set(baselineList);
	return candidateList.every((entry) => allowed.has(entry));
}
function isPolicyDenylistSuperset(metadata, candidate, baseline) {
	const candidateList = policyStringList(candidate, metadata);
	const baselineList = policyStringList(baseline, metadata);
	if (candidateList === void 0 || baselineList === void 0) return false;
	if (metadata.policyPath.join(".") === "tools.denyTools") return baselineList.flatMap(expandPolicyToolRequirement$1).every((tool) => toolListCoversTool$1(candidateList, tool));
	const denied = new Set(candidateList);
	return baselineList.every((entry) => denied.has(entry));
}
function samePolicyStringList(candidate, baseline, metadata) {
	const candidateList = policyStringList(candidate, metadata);
	const baselineList = policyStringList(baseline, metadata);
	if (candidateList === void 0 || baselineList === void 0) return false;
	const candidateSorted = candidateList.toSorted();
	const baselineSorted = baselineList.toSorted();
	return candidateSorted.length === baselineSorted.length && candidateSorted.every((entry, index) => entry === baselineSorted[index]);
}
function policyStringList(value, metadata) {
	if (metadata.valueType === "channel-provider-deny-rules") return channelProviderDenyRuleList(value, metadata);
	if (!Array.isArray(value)) return;
	if (metadata.policyPath.join(".") === "execApprovals.agents.allowlist.expected") {
		const entries = value.map(execApprovalAllowlistRequirement$1);
		if (!entries.every((entry) => entry !== void 0)) return;
		return entries.map((entry) => entry.key);
	}
	if (!value.every((entry) => typeof entry === "string")) return;
	return value.map((entry) => entry.trim()).filter(Boolean).map((entry) => normalizePolicyStringListEntry(entry, metadata));
}
function normalizePolicyStringListEntry(entry, metadata) {
	if (metadata.normalizeValues === "model-provider") return normalizeProviderId(entry);
	return metadata.caseSensitive === true ? entry : entry.toLowerCase();
}
function channelProviderDenyRuleList(value, metadata) {
	if (!Array.isArray(value)) return;
	const providers = [];
	for (const entry of value) {
		if (!isChannelDenyRule$1(entry)) return;
		const provider = entry.when?.provider?.trim();
		if (provider !== void 0 && provider !== "") providers.push(metadata.caseSensitive === true ? provider : provider.toLowerCase());
	}
	return providers;
}
function policyString(value, metadata) {
	if (typeof value !== "string" || value.trim() === "") return;
	const trimmed = value.trim();
	return metadata.caseSensitive === true ? trimmed : trimmed.toLowerCase();
}
function execApprovalAllowlistRequirement$1(value) {
	if (typeof value === "string") {
		const pattern = value.trim();
		return pattern === "" ? void 0 : execApprovalAllowlistRequirementFromParts$1(pattern);
	}
	if (!isRecord(value)) return;
	if (Object.keys(value).some((key) => key !== "argPattern" && key !== "pattern")) return;
	const pattern = typeof value.pattern === "string" ? value.pattern.trim() : "";
	if (pattern === "") return;
	const argPattern = typeof value.argPattern === "string" ? value.argPattern.trim() : void 0;
	if (value.argPattern !== void 0 && argPattern === void 0) return;
	return execApprovalAllowlistRequirementFromParts$1(pattern, argPattern === "" ? void 0 : argPattern);
}
function execApprovalAllowlistRequirementFromParts$1(pattern, argPattern) {
	return {
		key: execApprovalAllowlistRequirementKey$1(pattern, argPattern),
		pattern,
		...argPattern === void 0 ? {} : { argPattern }
	};
}
function execApprovalAllowlistRequirementKey$1(pattern, argPattern) {
	return `${pattern}\0${argPattern ?? ""}`;
}
function isChannelDenyRule$1(value) {
	return isRecord(value) && (value.id === void 0 || typeof value.id === "string") && (value.reason === void 0 || typeof value.reason === "string") && isRecord(value.when) && typeof value.when.provider === "string";
}
function toolListCoversTool$1(list, tool) {
	for (const entry of list) {
		const normalized = normalizePolicyToolName$1(entry);
		if (normalized === "*" || normalized === tool) return true;
		if (POLICY_TOOL_GROUPS[normalized]?.includes(tool)) return true;
		if (normalized.includes("*") && policyToolGlobMatches$1(tool, normalized)) return true;
	}
	return false;
}
function expandPolicyToolRequirement$1(value) {
	const normalized = normalizePolicyToolName$1(value);
	return POLICY_TOOL_GROUPS[normalized] ?? [normalized];
}
function normalizePolicyToolName$1(value) {
	const normalized = value.trim().toLowerCase();
	if (normalized === "bash") return "exec";
	if (normalized === "apply-patch") return "apply_patch";
	return normalized;
}
function policyToolGlobMatches$1(tool, pattern) {
	const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	return new RegExp(`^${escaped.replaceAll("\\*", ".*")}$`).test(tool);
}
//#endregion
//#region extensions/policy/src/doctor/register.ts
let fsPromisesModulePromise = null;
const loadFsPromisesModule = async () => {
	fsPromisesModulePromise ??= import("node:fs/promises");
	return await fsPromisesModulePromise;
};
const POLICY_RULES = POLICY_RULE_METADATA;
const KNOWN_RISK_LEVELS = [
	"low",
	"medium",
	"high",
	"critical"
];
const KNOWN_SENSITIVITY_LEVELS = [
	"public",
	"internal",
	"confidential",
	"restricted"
];
const SUPPORTED_TOOL_METADATA = [
	"risk",
	"sensitivity",
	"owner"
];
const SUPPORTED_AUTH_PROFILE_METADATA = ["provider", "mode"];
const SUPPORTED_AUTH_PROFILE_MODES = [
	"api_key",
	"aws-sdk",
	"oauth",
	"token"
];
const SUPPORTED_POLICY_SECTIONS = [
	"auth",
	"agents",
	"channels",
	"dataHandling",
	"execApprovals",
	"gateway",
	"ingress",
	"mcp",
	"models",
	"network",
	"sandbox",
	"scopes",
	"secrets",
	"tools"
];
const SUPPORTED_GATEWAY_POLICY_SECTIONS = [
	"auth",
	"controlUi",
	"exposure",
	"http",
	"remote"
];
const SUPPORTED_GATEWAY_HTTP_ENDPOINTS = ["chatCompletions", "responses"];
const SUPPORTED_DM_POLICIES = [
	"pairing",
	"allowlist",
	"open",
	"disabled"
];
const SUPPORTED_DM_SCOPES = [
	"main",
	"per-peer",
	"per-channel-peer",
	"per-account-channel-peer"
];
const SUPPORTED_AGENT_WORKSPACE_DENY_TOOLS = [
	"exec",
	"process",
	"write",
	"edit",
	"apply_patch"
];
const SUPPORTED_TOOL_PROFILES = [
	"minimal",
	"coding",
	"messaging",
	"full"
];
const SUPPORTED_TOOL_EXEC_SECURITY = [
	"deny",
	"allowlist",
	"full"
];
const SUPPORTED_TOOL_EXEC_ASK = [
	"off",
	"on-miss",
	"always"
];
const SUPPORTED_TOOL_EXEC_HOST = [
	"auto",
	"sandbox",
	"gateway",
	"node"
];
const SUPPORTED_EXEC_APPROVAL_SECURITY = [
	"deny",
	"allowlist",
	"full"
];
const SUPPORTED_SANDBOX_MODES = [
	"off",
	"non-main",
	"all"
];
let registered = false;
const policyEvaluationCache = /* @__PURE__ */ new WeakMap();
function registerPolicyDoctorChecks(host) {
	if (registered) return;
	const registerHealthCheck$1 = host?.registerHealthCheck ?? registerHealthCheck;
	for (const check of createPolicyDoctorChecks({
		channelIdsFromFindings,
		disableChannels,
		evaluatePolicy,
		findingsForCheck,
		workspaceRepairsDisabledResult,
		workspaceRepairsEnabled
	})) registerHealthCheck$1(check);
	registered = true;
}
function evaluatePolicy(ctx) {
	const cached = policyEvaluationCache.get(ctx);
	if (cached !== void 0) return cached;
	const next = evaluatePolicyUncached(ctx);
	policyEvaluationCache.set(ctx, next);
	return next;
}
async function evaluatePolicyUncached(ctx) {
	const settings = policySettings(ctx);
	const policyPath = policyDisplayName(ctx);
	let evidence = collectPolicyEvidence(ctx.cfg, {
		includeIngress: false,
		includeGatewayExposure: false,
		includeAgentWorkspace: false,
		includeToolPosture: false,
		includeSandboxPosture: false,
		includeSecrets: false,
		includeAuthProfiles: false,
		includeExecApprovals: false
	});
	const findings = [];
	if (!policyChecksEnabled(ctx, settings)) return {
		policyPath,
		evidence,
		expectedAttestationHash: settings.expectedAttestationHash,
		findings,
		attestedFindings: findings
	};
	const policyFile = await readPolicyFile(ctx);
	if (policyFile === null) {
		findings.push({
			checkId: CHECK_IDS.policyMissingFile,
			severity: "warning",
			message: `${policyPath} is missing for the enabled Policy plugin.`,
			source: "policy",
			path: policyPath,
			fixHint: `Restore ${policyPath} or add the policy artifact for this workspace.`
		});
		return {
			policyPath,
			evidence,
			expectedAttestationHash: settings.expectedAttestationHash,
			findings,
			attestedFindings: findings
		};
	}
	const parsedPolicy = parsePolicyFile(policyFile.raw);
	if (!parsedPolicy.ok) {
		findings.push(policyParseFinding(policyFile.displayName, policyFile.ocDocName, parsedPolicy));
		return {
			policyPath,
			evidence,
			expectedAttestationHash: settings.expectedAttestationHash,
			findings,
			attestedFindings: findings
		};
	}
	const policy = parsedPolicy.value;
	const policyHash = policyDocumentHash(policy);
	const expectedHash = settings.expectedHash;
	if (typeof expectedHash === "string" && expectedHash.trim() !== "" && policyHash !== expectedHash.trim()) {
		findings.push({
			checkId: CHECK_IDS.policyHashMismatch,
			severity: "error",
			message: `${policyFile.displayName} does not match the configured policy hash.`,
			source: "policy",
			path: policyFile.displayName,
			target: `oc://${policyFile.ocDocName}`,
			requirement: "oc://openclaw.config/plugins/entries/policy/config/expectedHash",
			fixHint: `Restore the approved policy artifact or update plugins.entries.policy.config.expectedHash after review.`
		});
		return {
			policyPath,
			policy: {
				value: policy,
				hash: policyHash
			},
			evidence,
			expectedAttestationHash: settings.expectedAttestationHash,
			findings,
			attestedFindings: findings
		};
	}
	const metadataRequirementFindings = toolMetadataRequirementFindings(policy, policyFile.displayName, policyFile.ocDocName);
	const authMetadataRequirementFindings = authProfileMetadataRequirementFindings(policy, policyFile.displayName, policyFile.ocDocName);
	const requiredMetadata = metadataRequirementFindings.length === 0 ? requiredToolMetadata(policy) : /* @__PURE__ */ new Set();
	const includeSecrets = policyHasSecretRules(policy);
	const includeAuthProfiles = policyHasAuthProfileRules(policy);
	const includeIngress = policyHasIngressRules(policy);
	const includeGatewayExposure = policyHasGatewayRules(policy);
	const includeAgentWorkspace = policyHasAgentWorkspaceRules(policy);
	const includeDataHandling = policyHasDataHandlingRules(policy);
	const includeSandboxPosture = policyHasSandboxPostureRules(policy);
	const includeExecApprovals = policyHasExecApprovalsRules(policy);
	const execApprovalsFile = includeExecApprovals ? await readExecApprovalsFile(ctx) : void 0;
	if (requiredMetadata.size > 0) {
		const toolsFile = await readWorkspaceFile(ctx, "TOOLS.md");
		evidence = await collectPolicyEvidence(ctx.cfg, {
			toolsRaw: toolsFile?.raw ?? "",
			includeIngress,
			includeGatewayExposure,
			includeAgentWorkspace,
			includeDataHandling,
			includeToolPosture: policyHasToolPostureRules(policy),
			includeSandboxPosture,
			includeSecrets,
			includeAuthProfiles,
			includeExecApprovals,
			execApprovalsRaw: includeExecApprovals ? execApprovalsFile?.raw ?? null : void 0
		});
	} else evidence = collectPolicyEvidence(ctx.cfg, {
		includeIngress,
		includeGatewayExposure,
		includeAgentWorkspace,
		includeDataHandling,
		includeToolPosture: policyHasToolPostureRules(policy),
		includeSandboxPosture,
		includeSecrets,
		includeAuthProfiles,
		includeExecApprovals,
		execApprovalsRaw: includeExecApprovals ? execApprovalsFile?.raw ?? null : void 0
	});
	const policyFindings = [
		...policyContainerShapeFindings(policy, policyFile.displayName, policyFile.ocDocName),
		...channelFindings(policy, policyFile.displayName, policyFile.ocDocName, evidence),
		...mcpServerFindings(policy, policyFile.ocDocName, evidence),
		...modelProviderFindings(policy, policyFile.ocDocName, evidence),
		...networkFindings(policy, policyFile.ocDocName, evidence),
		...ingressFindings(policy, policyFile.displayName, policyFile.ocDocName, evidence),
		...gatewayExposureFindings(policy, policyFile.ocDocName, evidence),
		...agentWorkspaceFindings(policy, policyFile.displayName, policyFile.ocDocName, evidence),
		...toolPostureFindings(policy, policyFile.displayName, policyFile.ocDocName, evidence),
		...sandboxPostureFindings(policy, policyFile.displayName, policyFile.ocDocName, evidence),
		...dataHandlingFindings(policy, policyFile.displayName, policyFile.ocDocName, evidence),
		...secretAuthProvenanceFindings(policy, policyFile.displayName, policyFile.ocDocName, evidence),
		...execApprovalsFindings(policy, policyFile.displayName, policyFile.ocDocName, evidence, execApprovalsFile, execApprovalsDisplayName()),
		...authMetadataRequirementFindings,
		...metadataRequirementFindings
	];
	if (requiredMetadata.has("risk")) {
		policyFindings.push(...toolRiskFindings(policyFile.ocDocName, evidence));
		policyFindings.push(...toolUnknownRiskFindings(policyFile.ocDocName, evidence));
	}
	if (requiredMetadata.has("sensitivity")) policyFindings.push(...toolSensitivityFindings(policyFile.ocDocName, evidence));
	if (requiredMetadata.has("owner")) policyFindings.push(...toolOwnerFindings(policyFile.ocDocName, evidence));
	const attestationFindings = policyAttestationFindings(policyFile.displayName, policyHash, evidence, policyFindings, settings);
	if (hasPolicyValidationFinding(policyFindings)) findings.push(...policyFindings);
	else if (attestationFindings.length > 0) findings.push(...attestationFindings);
	else findings.push(...policyFindings);
	return {
		policyPath,
		policy: {
			value: policy,
			hash: policyHash
		},
		evidence,
		expectedAttestationHash: settings.expectedAttestationHash,
		findings,
		attestedFindings: policyFindings
	};
}
function policyParseFinding(policyPath, policyDocName, parseError) {
	return {
		checkId: CHECK_IDS.policyInvalidFile,
		severity: "error",
		message: `${policyPath} could not be parsed: ${parseError.message}`,
		source: "policy",
		path: policyPath,
		target: `oc://${policyDocName}`,
		fixHint: `Fix ${policyPath} so policy conformance checks can run.`
	};
}
function findingsForCheck(evaluation, checkId) {
	return evaluation.findings.filter((finding) => finding.checkId === checkId);
}
function hasPolicyValidationFinding(findings) {
	return findings.some((finding) => finding.checkId === CHECK_IDS.policyInvalidFile);
}
function channelFindings(policy, policyPath, policyDocName, evidence) {
	const invalidRules = invalidChannelDenyRuleFindings(policy, policyPath, policyDocName);
	if (invalidRules.length > 0) return invalidRules;
	const denyRules = readChannelDenyRules(policy, policyDocName);
	if (denyRules.length === 0) return [];
	return evidence.channels.flatMap((channel) => {
		if (channel.enabled === false) return [];
		const rule = denyRules.find((candidate) => candidate.when?.provider === channel.provider);
		if (rule === void 0) return [];
		return [{
			checkId: CHECK_IDS.policyDeniedChannelProvider,
			severity: "error",
			message: `Channel '${channel.id}' uses denied provider '${channel.provider}'.`,
			source: "policy",
			path: "openclaw config",
			ocPath: channel.source,
			target: channel.source,
			requirement: rule.requirement,
			fixHint: rule.reason ?? "Disable this channel, remove it from config, or update the policy deny rule."
		}];
	});
}
function policyAttestationFindings(policyPath, policyHash, evidence, findings, settings) {
	const expected = settings.expectedAttestationHash?.trim();
	if (!expected) return [];
	const current = createPolicyAttestation({
		ok: findings.length === 0,
		checkedAt: (/* @__PURE__ */ new Date(0)).toISOString(),
		policyPath,
		policyHash,
		evidence,
		findings: findings.map(toAttestedFinding)
	});
	if (current.attestationHash === expected) return [];
	return [{
		checkId: CHECK_IDS.policyAttestationMismatch,
		severity: "error",
		message: "The current policy check no longer matches the accepted policy attestation.",
		source: "policy",
		path: "policy attestation",
		target: "oc://policy/attestation/current",
		requirement: "oc://openclaw.config/plugins/entries/policy/config/expectedAttestationHash",
		fixHint: `Run policy check, review attestation ${current.attestationHash}, then update plugins.entries.policy.config.expectedAttestationHash and the supervisor/gateway accepted attestation.`
	}];
}
function toAttestedFinding(finding) {
	return {
		checkId: finding.checkId,
		severity: finding.severity,
		message: finding.message,
		...finding.source !== void 0 ? { source: finding.source } : {},
		...finding.path !== void 0 ? { path: finding.path } : {},
		...finding.line !== void 0 ? { line: finding.line } : {},
		...finding.column !== void 0 ? { column: finding.column } : {},
		...finding.ocPath !== void 0 ? { ocPath: finding.ocPath } : {},
		...finding.target !== void 0 ? { target: finding.target } : {},
		...finding.requirement !== void 0 ? { requirement: finding.requirement } : {},
		...finding.fixHint !== void 0 ? { fixHint: finding.fixHint } : {}
	};
}
function toolMetadataRequirementFindings(policy, policyPath, policyDocName) {
	if (!isRecord(policy) || !isRecord(policy.tools) || policy.tools.requireMetadata === void 0) return [];
	if (!Array.isArray(policy.tools.requireMetadata)) return [{
		checkId: CHECK_IDS.policyInvalidFile,
		severity: "error",
		message: `${policyPath} tools.requireMetadata must be an array of metadata keys.`,
		source: "policy",
		path: policyPath,
		target: `oc://${policyDocName}/tools/requireMetadata`,
		fixHint: `Use supported metadata keys: ${SUPPORTED_TOOL_METADATA.join(", ")}.`
	}];
	const invalidIndex = policy.tools.requireMetadata.findIndex((entry) => typeof entry !== "string" || !SUPPORTED_TOOL_METADATA.includes(entry.trim().toLowerCase()));
	if (invalidIndex < 0) return [];
	return [{
		checkId: CHECK_IDS.policyInvalidFile,
		severity: "error",
		message: `${policyPath} tools.requireMetadata[${invalidIndex}] must be a supported metadata key.`,
		source: "policy",
		path: policyPath,
		target: `oc://${policyDocName}/tools/requireMetadata/#${invalidIndex}`,
		fixHint: `Use supported metadata keys: ${SUPPORTED_TOOL_METADATA.join(", ")}.`
	}];
}
function policyContainerShapeFindings(policy, policyPath, policyDocName) {
	if (!isRecord(policy)) return [policyShapeFinding(policyPath, `oc://${policyDocName}`, `${policyPath} must contain a policy object.`, `Fix ${policyPath} so the top-level policy is an object.`)];
	const unsupportedTopLevel = unsupportedPolicyKey(policy, SUPPORTED_POLICY_SECTIONS);
	if (unsupportedTopLevel !== void 0) return [policyShapeFinding(policyPath, `oc://${policyDocName}/${ocPathSegment(unsupportedTopLevel)}`, `${policyPath} ${unsupportedTopLevel} is not a supported policy section.`, `Remove ${unsupportedTopLevel} or use a supported policy section.`)];
	if (policy.tools !== void 0 && !isRecord(policy.tools)) return [policyShapeFinding(policyPath, `oc://${policyDocName}/tools`, `${policyPath} tools must be an object.`, `Fix ${policyPath} so tools is an object.`)];
	if (isRecord(policy.tools)) {
		const postureFinding = toolPosturePolicyShapeFinding(policy.tools, {
			policyDocName,
			policyPath
		});
		if (postureFinding !== void 0) return [postureFinding];
	}
	if (policy.channels !== void 0 && !isRecord(policy.channels)) return [policyShapeFinding(policyPath, `oc://${policyDocName}/channels`, `${policyPath} channels must be an object.`, `Fix ${policyPath} so channels is an object.`)];
	if (isRecord(policy.channels)) {
		const unsupportedChannelKey = unsupportedPolicyKey(policy.channels, ["denyRules"]);
		if (unsupportedChannelKey !== void 0) return [policyShapeFinding(policyPath, `oc://${policyDocName}/channels/${ocPathSegment(unsupportedChannelKey)}`, `${policyPath} channels.${unsupportedChannelKey} is not supported in channel policy.`, `Remove channels.${unsupportedChannelKey} or use channels.denyRules.`)];
	}
	if (policy.mcp !== void 0 && !isRecord(policy.mcp)) return [policyShapeFinding(policyPath, `oc://${policyDocName}/mcp`, `${policyPath} mcp must be an object.`, `Fix ${policyPath} so mcp is an object.`)];
	if (isRecord(policy.mcp)) {
		const unsupportedMcpKey = unsupportedPolicyKey(policy.mcp, ["servers"]);
		if (unsupportedMcpKey !== void 0) return [policyShapeFinding(policyPath, `oc://${policyDocName}/mcp/${ocPathSegment(unsupportedMcpKey)}`, `${policyPath} mcp.${unsupportedMcpKey} is not supported in MCP policy.`, `Remove mcp.${unsupportedMcpKey} or use mcp.servers.`)];
	}
	if (policy.dataHandling !== void 0 && !isRecord(policy.dataHandling)) return [policyShapeFinding(policyPath, `oc://${policyDocName}/dataHandling`, `${policyPath} dataHandling must be an object.`, `Fix ${policyPath} so dataHandling is an object.`)];
	if (isRecord(policy.mcp)) {
		const finding = policyStringArrayShapeFinding(policy.mcp.servers, {
			property: "mcp.servers",
			policyDocName,
			policyPath,
			target: "mcp/servers",
			valueName: "MCP server id"
		});
		if (finding !== void 0) return [finding];
	}
	if (policy.models !== void 0 && !isRecord(policy.models)) return [policyShapeFinding(policyPath, `oc://${policyDocName}/models`, `${policyPath} models must be an object.`, `Fix ${policyPath} so models is an object.`)];
	if (isRecord(policy.models)) {
		const unsupportedModelsKey = unsupportedPolicyKey(policy.models, ["providers"]);
		if (unsupportedModelsKey !== void 0) return [policyShapeFinding(policyPath, `oc://${policyDocName}/models/${ocPathSegment(unsupportedModelsKey)}`, `${policyPath} models.${unsupportedModelsKey} is not supported in model policy.`, `Remove models.${unsupportedModelsKey} or use models.providers.`)];
	}
	if (isRecord(policy.models)) {
		const finding = policyStringArrayShapeFinding(policy.models.providers, {
			property: "models.providers",
			policyDocName,
			policyPath,
			target: "models/providers",
			valueName: "model provider id"
		});
		if (finding !== void 0) return [finding];
	}
	if (policy.network !== void 0 && !isRecord(policy.network)) return [policyShapeFinding(policyPath, `oc://${policyDocName}/network`, `${policyPath} network must be an object.`, `Fix ${policyPath} so network is an object.`)];
	if (isRecord(policy.network)) {
		const unsupportedNetworkKey = unsupportedPolicyKey(policy.network, ["privateNetwork"]);
		if (unsupportedNetworkKey !== void 0) return [policyShapeFinding(policyPath, `oc://${policyDocName}/network/${ocPathSegment(unsupportedNetworkKey)}`, `${policyPath} network.${unsupportedNetworkKey} is not supported in network policy.`, `Remove network.${unsupportedNetworkKey} or use network.privateNetwork.`)];
		if (policy.network.privateNetwork !== void 0 && !isRecord(policy.network.privateNetwork)) return [policyShapeFinding(policyPath, `oc://${policyDocName}/network/privateNetwork`, `${policyPath} network.privateNetwork must be an object.`, `Fix ${policyPath} so network.privateNetwork is an object.`)];
		if (isRecord(policy.network.privateNetwork)) {
			const unsupportedPrivateNetworkKey = unsupportedPolicyKey(policy.network.privateNetwork, ["allow"]);
			if (unsupportedPrivateNetworkKey !== void 0) return [policyShapeFinding(policyPath, `oc://${policyDocName}/network/privateNetwork/${ocPathSegment(unsupportedPrivateNetworkKey)}`, `${policyPath} network.privateNetwork.${unsupportedPrivateNetworkKey} is not supported in network policy.`, `Remove network.privateNetwork.${unsupportedPrivateNetworkKey} or use network.privateNetwork.allow.`)];
		}
		if (isRecord(policy.network.privateNetwork) && policy.network.privateNetwork.allow !== void 0 && typeof policy.network.privateNetwork.allow !== "boolean") return [policyShapeFinding(policyPath, `oc://${policyDocName}/network/privateNetwork/allow`, `${policyPath} network.privateNetwork.allow must be a boolean.`, `Fix ${policyPath} so network.privateNetwork.allow is true or false.`)];
	}
	if (policy.secrets !== void 0 && !isRecord(policy.secrets)) return [policyShapeFinding(policyPath, `oc://${policyDocName}/secrets`, `${policyPath} secrets must be an object.`, `Fix ${policyPath} so secrets is an object.`)];
	if (isRecord(policy.secrets)) {
		const unsupportedSecretsKey = unsupportedPolicyKey(policy.secrets, [
			"allowInsecureProviders",
			"denySources",
			"requireManagedProviders"
		]);
		if (unsupportedSecretsKey !== void 0) return [policyShapeFinding(policyPath, `oc://${policyDocName}/secrets/${ocPathSegment(unsupportedSecretsKey)}`, `${policyPath} secrets.${unsupportedSecretsKey} is not supported in secrets policy.`, `Remove secrets.${unsupportedSecretsKey} or use a supported secrets policy rule.`)];
	}
	if (policy.auth !== void 0 && !isRecord(policy.auth)) return [policyShapeFinding(policyPath, `oc://${policyDocName}/auth`, `${policyPath} auth must be an object.`, `Fix ${policyPath} so auth is an object.`)];
	if (isRecord(policy.auth)) {
		const unsupportedAuthKey = unsupportedPolicyKey(policy.auth, ["profiles"]);
		if (unsupportedAuthKey !== void 0) return [policyShapeFinding(policyPath, `oc://${policyDocName}/auth/${ocPathSegment(unsupportedAuthKey)}`, `${policyPath} auth.${unsupportedAuthKey} is not supported in auth policy.`, `Remove auth.${unsupportedAuthKey} or use auth.profiles.`)];
	}
	if (isRecord(policy.auth) && policy.auth.profiles !== void 0 && !isRecord(policy.auth.profiles)) return [policyShapeFinding(policyPath, `oc://${policyDocName}/auth/profiles`, `${policyPath} auth.profiles must be an object.`, `Fix ${policyPath} so auth.profiles is an object.`)];
	if (isRecord(policy.auth) && isRecord(policy.auth.profiles)) {
		const unsupportedProfilesKey = unsupportedPolicyKey(policy.auth.profiles, ["allowModes", "requireMetadata"]);
		if (unsupportedProfilesKey !== void 0) return [policyShapeFinding(policyPath, `oc://${policyDocName}/auth/profiles/${ocPathSegment(unsupportedProfilesKey)}`, `${policyPath} auth.profiles.${unsupportedProfilesKey} is not supported in auth profile policy.`, `Remove auth.profiles.${unsupportedProfilesKey} or use a supported auth profile policy rule.`)];
	}
	const execApprovalsFinding = execApprovalsPolicyShapeFinding(policy.execApprovals, {
		policyDocName,
		policyPath
	});
	if (execApprovalsFinding !== void 0) return [execApprovalsFinding];
	const sandboxFinding = sandboxPolicyShapeFinding(policy.sandbox, {
		policyDocName,
		policyPath
	});
	if (sandboxFinding !== void 0) return [sandboxFinding];
	const ingressFindingValue = ingressPolicyShapeFinding(policy.ingress, {
		policyDocName,
		policyPath
	});
	if (ingressFindingValue !== void 0) return [ingressFindingValue];
	const gatewayFinding = gatewayPolicyShapeFinding(policy.gateway, {
		policyDocName,
		policyPath
	});
	if (gatewayFinding !== void 0) return [gatewayFinding];
	const agentsFinding = agentsPolicyShapeFinding(policy.agents, {
		policyDocName,
		policyPath
	});
	if (agentsFinding !== void 0) return [agentsFinding];
	const scopesFinding = scopedPolicyShapeFinding(policy.scopes, {
		policyDocName,
		policyPath,
		policy
	});
	if (scopesFinding !== void 0) return [scopesFinding];
	return [];
}
function ingressPolicyShapeFinding(value, params) {
	const targetPrefix = params.targetPrefix ?? "ingress";
	const propertyPrefix = params.propertyPrefix ?? "ingress";
	const allowSession = params.allowSession ?? true;
	if (value === void 0) return;
	if (!isRecord(value)) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${targetPrefix}`, `${params.policyPath} ${propertyPrefix} must be an object.`, `Fix ${params.policyPath} so ${propertyPrefix} is an object.`);
	if (!allowSession && value.session !== void 0) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${targetPrefix}/session`, `${params.policyPath} ${propertyPrefix}.session is not supported by the channelIds selector.`, `Move session ingress rules to top-level ingress; scoped ingress currently supports ingress.channels.*.`);
	const unsupportedIngressKey = unsupportedPolicyKey(value, ["channels", "session"]);
	if (unsupportedIngressKey !== void 0) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${targetPrefix}/${ocPathSegment(unsupportedIngressKey)}`, `${params.policyPath} ${propertyPrefix}.${unsupportedIngressKey} is not supported in ingress policy.`, `Remove ${propertyPrefix}.${unsupportedIngressKey} or use ingress.session or ingress.channels.`);
	for (const section of ["session", "channels"]) if (value[section] !== void 0 && !isRecord(value[section])) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${targetPrefix}/${section}`, `${params.policyPath} ${propertyPrefix}.${section} must be an object.`, `Fix ${params.policyPath} so ${propertyPrefix}.${section} is an object.`);
	const session = isRecord(value.session) ? value.session : {};
	const unsupportedSessionKey = unsupportedPolicyKey(session, ["requireDmScope"]);
	if (unsupportedSessionKey !== void 0) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${targetPrefix}/session/${ocPathSegment(unsupportedSessionKey)}`, `${params.policyPath} ${propertyPrefix}.session.${unsupportedSessionKey} is not supported in ingress policy.`, `Remove ${propertyPrefix}.session.${unsupportedSessionKey} or use ${propertyPrefix}.session.requireDmScope.`);
	if (session.requireDmScope !== void 0 && !SUPPORTED_DM_SCOPES.includes(session.requireDmScope)) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${targetPrefix}/session/requireDmScope`, `${params.policyPath} ${propertyPrefix}.session.requireDmScope must be a supported DM scope.`, `Use supported DM scopes: ${SUPPORTED_DM_SCOPES.join(", ")}.`);
	const channels = isRecord(value.channels) ? value.channels : {};
	const unsupportedChannelsKey = unsupportedPolicyKey(channels, [
		"allowDmPolicies",
		"denyOpenGroups",
		"requireMentionInGroups"
	]);
	if (unsupportedChannelsKey !== void 0) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${targetPrefix}/channels/${ocPathSegment(unsupportedChannelsKey)}`, `${params.policyPath} ${propertyPrefix}.channels.${unsupportedChannelsKey} is not supported in ingress policy.`, `Remove ${propertyPrefix}.channels.${unsupportedChannelsKey} or use a supported ingress channel policy rule.`);
	const allowDmPoliciesFinding = policyStringArrayPropertyShapeFinding(channels.allowDmPolicies, {
		allowed: SUPPORTED_DM_POLICIES,
		policyDocName: params.policyDocName,
		policyPath: params.policyPath,
		property: `${propertyPrefix}.channels.allowDmPolicies`,
		target: `${targetPrefix}/channels/allowDmPolicies`,
		valueName: "DM policy"
	});
	if (allowDmPoliciesFinding !== void 0) return allowDmPoliciesFinding;
	for (const key of ["denyOpenGroups", "requireMentionInGroups"]) if (channels[key] !== void 0 && typeof channels[key] !== "boolean") return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${targetPrefix}/channels/${key}`, `${params.policyPath} ${propertyPrefix}.channels.${key} must be a boolean.`, `Set ${propertyPrefix}.channels.${key} to true or false.`);
}
function execApprovalsPolicyShapeFinding(value, params) {
	const targetPrefix = params.targetPrefix ?? "execApprovals";
	const propertyPrefix = params.propertyPrefix ?? "execApprovals";
	const allowDefaults = params.allowDefaults ?? true;
	if (value === void 0) return;
	if (!isRecord(value)) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${targetPrefix}`, `${params.policyPath} ${propertyPrefix} must be an object.`, `Fix ${params.policyPath} so ${propertyPrefix} is an object.`);
	const unsupportedTopLevel = unsupportedPolicyKey(value, allowDefaults ? [
		"agents",
		"defaults",
		"requireFile"
	] : ["agents"]);
	if (unsupportedTopLevel !== void 0) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${targetPrefix}/${ocPathSegment(unsupportedTopLevel)}`, `${params.policyPath} ${propertyPrefix}.${unsupportedTopLevel} is not supported in exec approvals policy.`, `Remove ${propertyPrefix}.${unsupportedTopLevel} or use a supported execApprovals rule.`);
	if (value.requireFile !== void 0 && typeof value.requireFile !== "boolean") return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${targetPrefix}/requireFile`, `${params.policyPath} ${propertyPrefix}.requireFile must be a boolean.`, `Set execApprovals.requireFile to true or false.`);
	for (const section of allowDefaults ? ["defaults", "agents"] : ["agents"]) if (value[section] !== void 0 && !isRecord(value[section])) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${targetPrefix}/${section}`, `${params.policyPath} ${propertyPrefix}.${section} must be an object.`, `Fix ${params.policyPath} so ${propertyPrefix}.${section} is an object.`);
	const defaults = allowDefaults && isRecord(value.defaults) ? value.defaults : {};
	const unsupportedDefaultsKey = unsupportedPolicyKey(defaults, ["allowSecurity"]);
	if (unsupportedDefaultsKey !== void 0) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${targetPrefix}/defaults/${ocPathSegment(unsupportedDefaultsKey)}`, `${params.policyPath} ${propertyPrefix}.defaults.${unsupportedDefaultsKey} is not supported in exec approvals policy.`, `Use execApprovals.defaults.allowSecurity or remove the unsupported rule.`);
	const defaultsSecurityFinding = policyStringArrayPropertyShapeFinding(defaults.allowSecurity, {
		allowed: SUPPORTED_EXEC_APPROVAL_SECURITY,
		policyDocName: params.policyDocName,
		policyPath: params.policyPath,
		property: `${propertyPrefix}.defaults.allowSecurity`,
		target: `${targetPrefix}/defaults/allowSecurity`,
		valueName: "exec approval security mode"
	});
	if (defaultsSecurityFinding !== void 0) return defaultsSecurityFinding;
	const agents = isRecord(value.agents) ? value.agents : {};
	const unsupportedAgentsKey = unsupportedPolicyKey(agents, [
		"allowAutoAllowSkills",
		"allowSecurity",
		"allowlist"
	]);
	if (unsupportedAgentsKey !== void 0) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${targetPrefix}/agents/${ocPathSegment(unsupportedAgentsKey)}`, `${params.policyPath} ${propertyPrefix}.agents.${unsupportedAgentsKey} is not supported in exec approvals policy.`, `Use execApprovals.agents.allowSecurity, execApprovals.agents.allowAutoAllowSkills, or execApprovals.agents.allowlist.expected.`);
	const agentSecurityFinding = policyStringArrayPropertyShapeFinding(agents.allowSecurity, {
		allowed: SUPPORTED_EXEC_APPROVAL_SECURITY,
		policyDocName: params.policyDocName,
		policyPath: params.policyPath,
		property: `${propertyPrefix}.agents.allowSecurity`,
		target: `${targetPrefix}/agents/allowSecurity`,
		valueName: "exec approval security mode"
	});
	if (agentSecurityFinding !== void 0) return agentSecurityFinding;
	if (agents.allowAutoAllowSkills !== void 0 && typeof agents.allowAutoAllowSkills !== "boolean") return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${targetPrefix}/agents/allowAutoAllowSkills`, `${params.policyPath} ${propertyPrefix}.agents.allowAutoAllowSkills must be a boolean.`, `Set execApprovals.agents.allowAutoAllowSkills to true or false.`);
	if (agents.allowlist !== void 0 && !isRecord(agents.allowlist)) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${targetPrefix}/agents/allowlist`, `${params.policyPath} ${propertyPrefix}.agents.allowlist must be an object.`, `Fix ${params.policyPath} so ${propertyPrefix}.agents.allowlist is an object.`);
	const allowlist = isRecord(agents.allowlist) ? agents.allowlist : {};
	const unsupportedAllowlistKey = unsupportedPolicyKey(allowlist, ["expected"]);
	if (unsupportedAllowlistKey !== void 0) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${targetPrefix}/agents/allowlist/${ocPathSegment(unsupportedAllowlistKey)}`, `${params.policyPath} ${propertyPrefix}.agents.allowlist.${unsupportedAllowlistKey} is not supported in exec approvals policy.`, `Use execApprovals.agents.allowlist.expected or remove the unsupported rule.`);
	return execApprovalAllowlistExpectedShapeFinding(allowlist.expected, {
		policyDocName: params.policyDocName,
		policyPath: params.policyPath,
		property: `${propertyPrefix}.agents.allowlist.expected`,
		target: `${targetPrefix}/agents/allowlist/expected`
	});
}
function agentsPolicyShapeFinding(value, params) {
	if (value === void 0) return;
	if (!isRecord(value)) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/agents`, `${params.policyPath} agents must be an object.`, `Fix ${params.policyPath} so agents is an object.`);
	const unsupportedAgentsKey = unsupportedPolicyKey(value, ["workspace"]);
	if (unsupportedAgentsKey !== void 0) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/agents/${ocPathSegment(unsupportedAgentsKey)}`, `${params.policyPath} agents.${unsupportedAgentsKey} is not supported in agents policy.`, `Remove agents.${unsupportedAgentsKey} or use agents.workspace.`);
	const workspaceFinding = agentWorkspacePolicyShapeFinding(value.workspace, {
		policyDocName: params.policyDocName,
		policyPath: params.policyPath,
		targetPrefix: "agents/workspace",
		propertyPrefix: "agents.workspace"
	});
	if (workspaceFinding !== void 0) return workspaceFinding;
}
function scopedPolicyShapeFinding(value, params) {
	if (value === void 0) return;
	if (!isRecord(value)) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/scopes`, `${params.policyPath} scopes must be an object.`, `Fix ${params.policyPath} so scopes maps scope names to policy overlays with selectors such as agentIds.`);
	for (const [scopeName, overlay] of Object.entries(value)) {
		const targetPrefix = `scopes/${ocPathSegment(scopeName)}`;
		if (!isRecord(overlay)) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${targetPrefix}`, `${params.policyPath} scopes.${scopeName} must be an object.`, `Fix ${params.policyPath} so the named policy scope is an object.`);
		const hasAgentIds = overlay.agentIds !== void 0;
		const hasChannelIds = overlay.channelIds !== void 0;
		if (!hasAgentIds && !hasChannelIds) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${targetPrefix}`, `${params.policyPath} scopes.${scopeName} must define at least one selector.`, `List agentIds for agent-scoped policy or channelIds for channel-scoped ingress policy.`);
		const agentIdsFinding = scopedSelectorShapeFinding(overlay.agentIds, {
			policyDocName: params.policyDocName,
			policyPath: params.policyPath,
			property: `scopes.${scopeName}.agentIds`,
			target: `${targetPrefix}/agentIds`,
			valueName: "agent id",
			normalize: normalizeAgentId
		});
		if (agentIdsFinding !== void 0) return agentIdsFinding;
		const channelIdsFinding = scopedSelectorShapeFinding(overlay.channelIds, {
			policyDocName: params.policyDocName,
			policyPath: params.policyPath,
			property: `scopes.${scopeName}.channelIds`,
			target: `${targetPrefix}/channelIds`,
			valueName: "channel id",
			normalize: normalizePolicyChannelId
		});
		if (channelIdsFinding !== void 0) return channelIdsFinding;
		if (overlay.ingress !== void 0 && !hasChannelIds) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${targetPrefix}/ingress`, `${params.policyPath} scopes.${scopeName}.ingress requires the channelIds selector.`, `Move global ingress rules to top-level ingress, or list channelIds for channel-scoped ingress policy.`);
		if ((overlay.agents !== void 0 || overlay.dataHandling !== void 0 || overlay.execApprovals !== void 0 || overlay.tools !== void 0 || overlay.sandbox !== void 0) && !hasAgentIds) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${targetPrefix}`, `${params.policyPath} scopes.${scopeName} uses agent-scoped sections without agentIds.`, `List agentIds for agents.workspace, dataHandling.memory, tools, or sandbox policy sections.`);
		const unsupportedKey = Object.keys(overlay).find((key) => key !== "agentIds" && key !== "channelIds" && key !== "agents" && key !== "dataHandling" && key !== "execApprovals" && key !== "tools" && key !== "sandbox" && key !== "ingress");
		if (unsupportedKey !== void 0) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${targetPrefix}/${ocPathSegment(unsupportedKey)}`, `${params.policyPath} scopes.${scopeName}.${unsupportedKey} is not a supported scoped policy section.`, `Use agentIds with agents.workspace, dataHandling.memory, execApprovals, tools, or sandbox, and channelIds with ingress.channels.`);
		if (overlay.dataHandling !== void 0 && !isRecord(overlay.dataHandling)) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${targetPrefix}/dataHandling`, `${params.policyPath} scopes.${scopeName}.dataHandling must be an object.`, `Fix ${params.policyPath} so the scoped dataHandling policy section is an object.`);
		if (isRecord(overlay.dataHandling)) {
			const scopedDataHandlingFinding = scopedDataHandlingPolicyShapeFinding(overlay.dataHandling, {
				policyPath: params.policyPath,
				policyDocName: params.policyDocName,
				targetPrefix,
				scopeName
			});
			if (scopedDataHandlingFinding !== void 0) return scopedDataHandlingFinding;
		}
		if (overlay.agents !== void 0 && !isRecord(overlay.agents)) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${targetPrefix}/agents`, `${params.policyPath} scopes.${scopeName}.agents must be an object.`, `Fix ${params.policyPath} so the scoped agents policy section is an object.`);
		const scopedAgents = isRecord(overlay.agents) ? overlay.agents : {};
		const unsupportedAgentKey = Object.keys(scopedAgents).find((key) => key !== "workspace");
		if (unsupportedAgentKey !== void 0) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${targetPrefix}/agents/${ocPathSegment(unsupportedAgentKey)}`, `${params.policyPath} scopes.${scopeName}.agents.${unsupportedAgentKey} is not supported by the agentIds selector.`, `Move the rule under agents.workspace or a supported scoped top-level section.`);
		const workspaceFinding = agentWorkspacePolicyShapeFinding(scopedAgents.workspace, {
			policyDocName: params.policyDocName,
			policyPath: params.policyPath,
			targetPrefix: `${targetPrefix}/agents/workspace`,
			propertyPrefix: `scopes.${scopeName}.agents.workspace`
		});
		if (workspaceFinding !== void 0) return workspaceFinding;
		const scopedExecApprovalsFinding = execApprovalsPolicyShapeFinding(overlay.execApprovals, {
			policyDocName: params.policyDocName,
			policyPath: params.policyPath,
			targetPrefix: `${targetPrefix}/execApprovals`,
			propertyPrefix: `scopes.${scopeName}.execApprovals`,
			allowDefaults: false
		});
		if (scopedExecApprovalsFinding !== void 0) return scopedExecApprovalsFinding;
		if (overlay.tools !== void 0 && !isRecord(overlay.tools)) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${targetPrefix}/tools`, `${params.policyPath} scopes.${scopeName}.tools must be an object.`, `Fix ${params.policyPath} so the scoped tools policy overlay is an object.`);
		if (isRecord(overlay.tools)) {
			const toolsFinding = scopedToolsPolicyShapeFinding(overlay.tools, {
				policyDocName: params.policyDocName,
				policyPath: params.policyPath,
				targetPrefix: `${targetPrefix}/tools`,
				propertyPrefix: `scopes.${scopeName}.tools`
			});
			if (toolsFinding !== void 0) return toolsFinding;
		}
		const sandboxFinding = sandboxPolicyShapeFinding(overlay.sandbox, {
			policyDocName: params.policyDocName,
			policyPath: params.policyPath,
			targetPrefix: `${targetPrefix}/sandbox`,
			propertyPrefix: `scopes.${scopeName}.sandbox`
		});
		if (sandboxFinding !== void 0) return sandboxFinding;
		const ingressFindingLocal = ingressPolicyShapeFinding(overlay.ingress, {
			policyDocName: params.policyDocName,
			policyPath: params.policyPath,
			targetPrefix: `${targetPrefix}/ingress`,
			propertyPrefix: `scopes.${scopeName}.ingress`,
			allowSession: false
		});
		if (ingressFindingLocal !== void 0) return ingressFindingLocal;
	}
	return duplicateScopedPolicyFieldFinding(value, {
		policyDocName: params.policyDocName,
		policyPath: params.policyPath,
		policy: params.policy
	});
}
function scopedDataHandlingPolicyShapeFinding(dataHandling, params) {
	const unsupportedKey = Object.keys(dataHandling).find((key) => key !== "memory");
	if (unsupportedKey !== void 0) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${params.targetPrefix}/dataHandling/${ocPathSegment(unsupportedKey)}`, `${params.policyPath} scopes.${params.scopeName}.dataHandling.${unsupportedKey} is not a supported scoped policy section.`, `Move global data-handling rules to top-level dataHandling, or use dataHandling.memory with agentIds.`);
	if (dataHandling.memory !== void 0 && !isRecord(dataHandling.memory)) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${params.targetPrefix}/dataHandling/memory`, `${params.policyPath} scopes.${params.scopeName}.dataHandling.memory must be an object.`, `Fix ${params.policyPath} so the scoped dataHandling.memory policy section is an object.`);
	if (!isRecord(dataHandling.memory)) return;
	const unsupportedMemoryKey = Object.keys(dataHandling.memory).find((key) => key !== "denySessionTranscriptIndexing");
	if (unsupportedMemoryKey !== void 0) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${params.targetPrefix}/dataHandling/memory/${ocPathSegment(unsupportedMemoryKey)}`, `${params.policyPath} scopes.${params.scopeName}.dataHandling.memory.${unsupportedMemoryKey} is not a supported scoped policy rule.`, `Use dataHandling.memory.denySessionTranscriptIndexing or remove the unsupported rule.`);
	if (dataHandling.memory.denySessionTranscriptIndexing !== void 0 && typeof dataHandling.memory.denySessionTranscriptIndexing !== "boolean") return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${params.targetPrefix}/dataHandling/memory/denySessionTranscriptIndexing`, `${params.policyPath} scopes.${params.scopeName}.dataHandling.memory.denySessionTranscriptIndexing must be a boolean.`, `Set dataHandling.memory.denySessionTranscriptIndexing to true or false.`);
}
function scopedSelectorShapeFinding(value, params) {
	const selectorFinding = policyStringArrayPropertyShapeFinding(value, {
		policyDocName: params.policyDocName,
		policyPath: params.policyPath,
		property: params.property,
		target: params.target,
		valueName: params.valueName
	});
	if (selectorFinding !== void 0) return selectorFinding;
	if (value === void 0) return;
	if (Array.isArray(value) && value.length === 0) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${params.target}`, `${params.policyPath} ${params.property} must include at least one ${params.valueName}.`, `Add one or more ${params.valueName}s to ${params.policyPath} ${params.property}.`);
	if (Array.isArray(value)) {
		const seen = /* @__PURE__ */ new Map();
		for (const [index, rawValue] of value.entries()) {
			if (typeof rawValue !== "string") continue;
			const normalized = params.normalize(rawValue);
			const previous = seen.get(normalized);
			if (previous !== void 0) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${params.target}/#${index}`, `${params.policyPath} ${params.property}[${index}] duplicates ${params.property}[${previous}] after normalization.`, `List each ${params.valueName} only once per named policy scope.`);
			seen.set(normalized, index);
		}
	}
}
function scopedToolsPolicyShapeFinding(value, params) {
	const allowedTopLevel = new Set([
		"profiles",
		"fs",
		"exec",
		"elevated",
		"alsoAllow",
		"denyTools"
	]);
	const unsupportedTopLevel = Object.keys(value).find((key) => !allowedTopLevel.has(key));
	if (unsupportedTopLevel !== void 0) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${params.targetPrefix}/${ocPathSegment(unsupportedTopLevel)}`, `${params.policyPath} ${params.propertyPrefix}.${unsupportedTopLevel} is not supported in agent-scoped tools policy.`, `Move ${params.propertyPrefix}.${unsupportedTopLevel} to top-level tools or use a supported scoped tools posture rule.`);
	for (const [section, allowedKeys] of [
		["profiles", ["allow"]],
		["fs", ["requireWorkspaceOnly"]],
		["exec", [
			"allowSecurity",
			"requireAsk",
			"allowHosts"
		]],
		["elevated", ["allow"]],
		["alsoAllow", ["expected"]]
	]) {
		const sectionValue = value[section];
		if (!isRecord(sectionValue)) continue;
		const allowed = new Set(allowedKeys);
		const unsupportedKey = Object.keys(sectionValue).find((key) => !allowed.has(key));
		if (unsupportedKey !== void 0) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${params.targetPrefix}/${section}/${ocPathSegment(unsupportedKey)}`, `${params.policyPath} ${params.propertyPrefix}.${section}.${unsupportedKey} is not supported in agent-scoped tools policy.`, `Move ${params.propertyPrefix}.${section}.${unsupportedKey} to top-level tools or use a supported scoped tools posture rule.`);
	}
	return toolPosturePolicyShapeFinding(value, params);
}
function agentWorkspacePolicyShapeFinding(value, params) {
	if (value === void 0) return;
	if (!isRecord(value)) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${params.targetPrefix}`, `${params.policyPath} ${params.propertyPrefix} must be an object.`, `Fix ${params.policyPath} so ${params.propertyPrefix} is an object.`);
	const unsupportedWorkspaceKey = unsupportedPolicyKey(value, ["allowedAccess", "denyTools"]);
	if (unsupportedWorkspaceKey !== void 0) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${params.targetPrefix}/${ocPathSegment(unsupportedWorkspaceKey)}`, `${params.policyPath} ${params.propertyPrefix}.${unsupportedWorkspaceKey} is not supported in agent workspace policy.`, `Remove ${params.propertyPrefix}.${unsupportedWorkspaceKey} or use a supported agent workspace policy rule.`);
	const allowedAccess = value.allowedAccess;
	if (allowedAccess !== void 0 && !Array.isArray(allowedAccess)) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${params.targetPrefix}/allowedAccess`, `${params.policyPath} ${params.propertyPrefix}.allowedAccess must be an array.`, "Use workspace access values such as [\"none\", \"ro\"].");
	if (Array.isArray(allowedAccess)) {
		const invalidIndex = allowedAccess.findIndex((entry) => entry !== "none" && entry !== "ro" && entry !== "rw");
		if (invalidIndex >= 0) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${params.targetPrefix}/allowedAccess/#${invalidIndex}`, `${params.policyPath} ${params.propertyPrefix}.allowedAccess[${invalidIndex}] must be none, ro, or rw.`, "Use workspace access values such as [\"none\", \"ro\"].");
	}
	const denyTools = value.denyTools;
	if (denyTools !== void 0 && !Array.isArray(denyTools)) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${params.targetPrefix}/denyTools`, `${params.policyPath} ${params.propertyPrefix}.denyTools must be an array.`, "Use tool ids such as [\"exec\", \"process\", \"write\", \"edit\", \"apply_patch\"].");
	if (Array.isArray(denyTools)) {
		const invalidIndex = denyTools.findIndex((entry) => typeof entry !== "string" || !SUPPORTED_AGENT_WORKSPACE_DENY_TOOLS.includes(entry.trim()));
		if (invalidIndex >= 0) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${params.targetPrefix}/denyTools/#${invalidIndex}`, `${params.policyPath} ${params.propertyPrefix}.denyTools[${invalidIndex}] must be a supported agent workspace tool id.`, `Use supported tool ids: ${SUPPORTED_AGENT_WORKSPACE_DENY_TOOLS.join(", ")}.`);
	}
}
function toolPosturePolicyShapeFinding(tools, params) {
	const targetPrefix = params.targetPrefix ?? "tools";
	const propertyPrefix = params.propertyPrefix ?? "tools";
	const unsupportedTopLevel = unsupportedPolicyKey(tools, [
		"alsoAllow",
		"denyTools",
		"elevated",
		"exec",
		"fs",
		"profiles",
		"requireMetadata"
	]);
	if (unsupportedTopLevel !== void 0) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${targetPrefix}/${ocPathSegment(unsupportedTopLevel)}`, `${params.policyPath} ${propertyPrefix}.${unsupportedTopLevel} is not supported in tools policy.`, `Remove ${propertyPrefix}.${unsupportedTopLevel} or use a supported tools policy rule.`);
	for (const section of [
		"profiles",
		"fs",
		"exec",
		"elevated",
		"alsoAllow"
	]) if (tools[section] !== void 0 && !isRecord(tools[section])) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${targetPrefix}/${section}`, `${params.policyPath} ${propertyPrefix}.${section} must be an object.`, `Fix ${params.policyPath} so ${propertyPrefix}.${section} is an object.`);
	const profiles = isRecord(tools.profiles) ? tools.profiles : {};
	const unsupportedProfileKey = unsupportedPolicyKey(profiles, ["allow"]);
	if (unsupportedProfileKey !== void 0) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${targetPrefix}/profiles/${ocPathSegment(unsupportedProfileKey)}`, `${params.policyPath} ${propertyPrefix}.profiles.${unsupportedProfileKey} is not supported in tools policy.`, `Remove ${propertyPrefix}.profiles.${unsupportedProfileKey} or use ${propertyPrefix}.profiles.allow.`);
	const profileAllowFinding = policyStringArrayPropertyShapeFinding(profiles.allow, {
		allowed: SUPPORTED_TOOL_PROFILES,
		policyDocName: params.policyDocName,
		policyPath: params.policyPath,
		property: `${propertyPrefix}.profiles.allow`,
		target: `${targetPrefix}/profiles/allow`,
		valueName: "tool profile id"
	});
	if (profileAllowFinding !== void 0) return profileAllowFinding;
	const fs = isRecord(tools.fs) ? tools.fs : {};
	const unsupportedFsKey = unsupportedPolicyKey(fs, ["requireWorkspaceOnly"]);
	if (unsupportedFsKey !== void 0) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${targetPrefix}/fs/${ocPathSegment(unsupportedFsKey)}`, `${params.policyPath} ${propertyPrefix}.fs.${unsupportedFsKey} is not supported in tools policy.`, `Remove ${propertyPrefix}.fs.${unsupportedFsKey} or use ${propertyPrefix}.fs.requireWorkspaceOnly.`);
	if (fs.requireWorkspaceOnly !== void 0 && typeof fs.requireWorkspaceOnly !== "boolean") return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${targetPrefix}/fs/requireWorkspaceOnly`, `${params.policyPath} ${propertyPrefix}.fs.requireWorkspaceOnly must be a boolean.`, `Set ${propertyPrefix}.fs.requireWorkspaceOnly to true or false.`);
	const exec = isRecord(tools.exec) ? tools.exec : {};
	const unsupportedExecKey = unsupportedPolicyKey(exec, [
		"allowHosts",
		"allowSecurity",
		"requireAsk"
	]);
	if (unsupportedExecKey !== void 0) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${targetPrefix}/exec/${ocPathSegment(unsupportedExecKey)}`, `${params.policyPath} ${propertyPrefix}.exec.${unsupportedExecKey} is not supported in tools policy.`, `Remove ${propertyPrefix}.exec.${unsupportedExecKey} or use a supported tools exec policy rule.`);
	const execLists = [
		[
			"allowSecurity",
			SUPPORTED_TOOL_EXEC_SECURITY,
			"exec security mode"
		],
		[
			"requireAsk",
			SUPPORTED_TOOL_EXEC_ASK,
			"exec ask mode"
		],
		[
			"allowHosts",
			SUPPORTED_TOOL_EXEC_HOST,
			"exec host"
		]
	];
	for (const [key, supported, valueName] of execLists) {
		const finding = policyStringArrayPropertyShapeFinding(exec[key], {
			allowed: supported,
			policyDocName: params.policyDocName,
			policyPath: params.policyPath,
			property: `${propertyPrefix}.exec.${key}`,
			target: `${targetPrefix}/exec/${key}`,
			valueName
		});
		if (finding !== void 0) return finding;
	}
	const elevated = isRecord(tools.elevated) ? tools.elevated : {};
	const unsupportedElevatedKey = unsupportedPolicyKey(elevated, ["allow"]);
	if (unsupportedElevatedKey !== void 0) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${targetPrefix}/elevated/${ocPathSegment(unsupportedElevatedKey)}`, `${params.policyPath} ${propertyPrefix}.elevated.${unsupportedElevatedKey} is not supported in tools policy.`, `Remove ${propertyPrefix}.elevated.${unsupportedElevatedKey} or use ${propertyPrefix}.elevated.allow.`);
	if (elevated.allow !== void 0 && typeof elevated.allow !== "boolean") return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${targetPrefix}/elevated/allow`, `${params.policyPath} ${propertyPrefix}.elevated.allow must be a boolean.`, `Set ${propertyPrefix}.elevated.allow to true or false.`);
	const alsoAllow = isRecord(tools.alsoAllow) ? tools.alsoAllow : {};
	const unsupportedAlsoAllowKey = unsupportedPolicyKey(alsoAllow, ["expected"]);
	if (unsupportedAlsoAllowKey !== void 0) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${targetPrefix}/alsoAllow/${ocPathSegment(unsupportedAlsoAllowKey)}`, `${params.policyPath} ${propertyPrefix}.alsoAllow.${unsupportedAlsoAllowKey} is not supported in tools policy.`, `Remove ${propertyPrefix}.alsoAllow.${unsupportedAlsoAllowKey} or use ${propertyPrefix}.alsoAllow.expected.`);
	const alsoAllowExpectedFinding = policyStringArrayPropertyShapeFinding(alsoAllow.expected, {
		policyDocName: params.policyDocName,
		policyPath: params.policyPath,
		property: `${propertyPrefix}.alsoAllow.expected`,
		target: `${targetPrefix}/alsoAllow/expected`,
		valueName: "tool id"
	});
	if (alsoAllowExpectedFinding !== void 0) return alsoAllowExpectedFinding;
	return policyStringArrayPropertyShapeFinding(tools.denyTools, {
		policyDocName: params.policyDocName,
		policyPath: params.policyPath,
		property: `${propertyPrefix}.denyTools`,
		target: `${targetPrefix}/denyTools`,
		valueName: "tool id or group"
	});
}
function sandboxPolicyShapeFinding(value, params) {
	const targetPrefix = params.targetPrefix ?? "sandbox";
	const propertyPrefix = params.propertyPrefix ?? "sandbox";
	if (value === void 0) return;
	if (!isRecord(value)) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${targetPrefix}`, `${params.policyPath} ${propertyPrefix} must be an object.`, `Fix ${params.policyPath} so ${propertyPrefix} is an object.`);
	const unsupportedTopLevel = unsupportedPolicyKey(value, [
		"requireMode",
		"allowBackends",
		"containers",
		"browser"
	]);
	if (unsupportedTopLevel !== void 0) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${targetPrefix}/${ocPathSegment(unsupportedTopLevel)}`, `${params.policyPath} ${propertyPrefix}.${unsupportedTopLevel} is not supported in sandbox policy.`, `Remove ${propertyPrefix}.${unsupportedTopLevel} or use a supported sandbox posture rule.`);
	const modeFinding = policyStringArrayPropertyShapeFinding(value.requireMode, {
		allowed: SUPPORTED_SANDBOX_MODES,
		policyDocName: params.policyDocName,
		policyPath: params.policyPath,
		property: `${propertyPrefix}.requireMode`,
		target: `${targetPrefix}/requireMode`,
		valueName: "sandbox mode"
	});
	if (modeFinding !== void 0) return modeFinding;
	const backendFinding = policyStringArrayPropertyShapeFinding(value.allowBackends, {
		policyDocName: params.policyDocName,
		policyPath: params.policyPath,
		property: `${propertyPrefix}.allowBackends`,
		target: `${targetPrefix}/allowBackends`,
		valueName: "sandbox backend id"
	});
	if (backendFinding !== void 0) return backendFinding;
	for (const section of ["containers", "browser"]) if (value[section] !== void 0 && !isRecord(value[section])) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${targetPrefix}/${section}`, `${params.policyPath} ${propertyPrefix}.${section} must be an object.`, `Fix ${params.policyPath} so ${propertyPrefix}.${section} is an object.`);
	const containers = isRecord(value.containers) ? value.containers : {};
	const unsupportedContainerKey = unsupportedPolicyKey(containers, SANDBOX_CONTAINER_POLICY_RULES.map((rule) => rule.key));
	if (unsupportedContainerKey !== void 0) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${targetPrefix}/containers/${ocPathSegment(unsupportedContainerKey)}`, `${params.policyPath} ${propertyPrefix}.containers.${unsupportedContainerKey} is not supported in sandbox policy.`, `Remove ${propertyPrefix}.containers.${unsupportedContainerKey} or use a supported sandbox container posture rule.`);
	for (const { key } of SANDBOX_CONTAINER_POLICY_RULES) if (containers[key] !== void 0 && typeof containers[key] !== "boolean") return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${targetPrefix}/containers/${key}`, `${params.policyPath} ${propertyPrefix}.containers.${key} must be a boolean.`, `Set ${propertyPrefix}.containers.${key} to true or false.`);
	const browser = isRecord(value.browser) ? value.browser : {};
	const unsupportedBrowserKey = unsupportedPolicyKey(browser, ["requireCdpSourceRange"]);
	if (unsupportedBrowserKey !== void 0) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${targetPrefix}/browser/${ocPathSegment(unsupportedBrowserKey)}`, `${params.policyPath} ${propertyPrefix}.browser.${unsupportedBrowserKey} is not supported in sandbox policy.`, `Remove ${propertyPrefix}.browser.${unsupportedBrowserKey} or use a supported sandbox browser posture rule.`);
	if (browser.requireCdpSourceRange !== void 0 && typeof browser.requireCdpSourceRange !== "boolean") return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${targetPrefix}/browser/requireCdpSourceRange`, `${params.policyPath} ${propertyPrefix}.browser.requireCdpSourceRange must be a boolean.`, `Set ${propertyPrefix}.browser.requireCdpSourceRange to true or false.`);
}
function unsupportedPolicyKey(value, allowedKeys) {
	const allowed = new Set(allowedKeys);
	return Object.keys(value).find((key) => !allowed.has(key));
}
function gatewayPolicyShapeFinding(value, params) {
	if (value === void 0) return;
	if (!isRecord(value)) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/gateway`, `${params.policyPath} gateway must be an object.`, `Fix ${params.policyPath} so gateway is an object.`);
	for (const section of [
		"exposure",
		"auth",
		"controlUi",
		"remote",
		"http"
	]) if (value[section] !== void 0 && !isRecord(value[section])) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/gateway/${section}`, `${params.policyPath} gateway.${section} must be an object.`, `Fix ${params.policyPath} so gateway.${section} is an object.`);
	const unsupportedGatewayKey = unsupportedPolicyKey(value, SUPPORTED_GATEWAY_POLICY_SECTIONS);
	if (unsupportedGatewayKey !== void 0) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/gateway/${ocPathSegment(unsupportedGatewayKey)}`, `${params.policyPath} gateway.${unsupportedGatewayKey} is not supported in Gateway policy.`, `Remove gateway.${unsupportedGatewayKey} or use a supported Gateway policy section.`);
	const exposure = isRecord(value.exposure) ? value.exposure : {};
	const auth = isRecord(value.auth) ? value.auth : {};
	const controlUi = isRecord(value.controlUi) ? value.controlUi : {};
	const remote = isRecord(value.remote) ? value.remote : {};
	const http = isRecord(value.http) ? value.http : {};
	for (const [section, sectionValue, allowedKeys] of [
		[
			"exposure",
			exposure,
			["allowNonLoopbackBind", "allowTailscaleFunnel"]
		],
		[
			"auth",
			auth,
			["requireAuth", "requireExplicitRateLimit"]
		],
		[
			"controlUi",
			controlUi,
			["allowInsecure"]
		],
		[
			"remote",
			remote,
			["allow"]
		],
		[
			"http",
			http,
			["denyEndpoints", "requireUrlAllowlists"]
		]
	]) {
		const unsupportedKey = unsupportedPolicyKey(sectionValue, allowedKeys);
		if (unsupportedKey !== void 0) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/gateway/${section}/${ocPathSegment(unsupportedKey)}`, `${params.policyPath} gateway.${section}.${unsupportedKey} is not supported in Gateway policy.`, `Remove gateway.${section}.${unsupportedKey} or use a supported Gateway policy rule.`);
	}
	const booleanRules = [
		[
			"gateway/exposure/allowNonLoopbackBind",
			"gateway.exposure.allowNonLoopbackBind",
			exposure.allowNonLoopbackBind
		],
		[
			"gateway/exposure/allowTailscaleFunnel",
			"gateway.exposure.allowTailscaleFunnel",
			exposure.allowTailscaleFunnel
		],
		[
			"gateway/auth/requireAuth",
			"gateway.auth.requireAuth",
			auth.requireAuth
		],
		[
			"gateway/auth/requireExplicitRateLimit",
			"gateway.auth.requireExplicitRateLimit",
			auth.requireExplicitRateLimit
		],
		[
			"gateway/controlUi/allowInsecure",
			"gateway.controlUi.allowInsecure",
			controlUi.allowInsecure
		],
		[
			"gateway/remote/allow",
			"gateway.remote.allow",
			remote.allow
		],
		[
			"gateway/http/requireUrlAllowlists",
			"gateway.http.requireUrlAllowlists",
			http.requireUrlAllowlists
		]
	];
	for (const [target, property, ruleValue] of booleanRules) if (ruleValue !== void 0 && typeof ruleValue !== "boolean") return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${target}`, `${params.policyPath} ${property} must be a boolean.`, `Fix ${params.policyPath} so ${property} is true or false.`);
	const denyEndpoints = http.denyEndpoints;
	if (denyEndpoints !== void 0 && !Array.isArray(denyEndpoints)) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/gateway/http/denyEndpoints`, `${params.policyPath} gateway.http.denyEndpoints must be an array.`, "Use an array of endpoint ids such as [\"responses\"] or remove gateway.http.denyEndpoints.");
	if (Array.isArray(denyEndpoints)) {
		const invalidIndex = denyEndpoints.findIndex((entry) => typeof entry !== "string" || !SUPPORTED_GATEWAY_HTTP_ENDPOINTS.includes(entry.trim()));
		if (invalidIndex >= 0) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/gateway/http/denyEndpoints/#${invalidIndex}`, `${params.policyPath} gateway.http.denyEndpoints[${invalidIndex}] must be a supported endpoint id.`, `Use supported endpoint ids: ${SUPPORTED_GATEWAY_HTTP_ENDPOINTS.join(", ")}.`);
	}
}
function policyStringArrayShapeFinding(value, params) {
	if (value === void 0) return;
	if (!isRecord(value)) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${params.target}`, `${params.policyPath} ${params.property} must be an object.`, `Fix ${params.policyPath} so ${params.property} is an object.`);
	const unsupportedKey = unsupportedPolicyKey(value, ["allow", "deny"]);
	if (unsupportedKey !== void 0) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${params.target}/${ocPathSegment(unsupportedKey)}`, `${params.policyPath} ${params.property}.${unsupportedKey} is not supported in policy.`, `Remove ${params.property}.${unsupportedKey} or use ${params.property}.allow or ${params.property}.deny.`);
	for (const key of ["allow", "deny"]) {
		const entries = value[key];
		if (entries === void 0) continue;
		const target = `oc://${params.policyDocName}/${params.target}/${key}`;
		if (!Array.isArray(entries)) return policyShapeFinding(params.policyPath, target, `${params.policyPath} ${params.property}.${key} must be an array.`, `Fix ${params.policyPath} so ${params.property}.${key} is an array of ${params.valueName}s.`);
		const invalidIndex = entries.findIndex((entry) => typeof entry !== "string" || entry.trim() === "");
		if (invalidIndex >= 0) return policyShapeFinding(params.policyPath, `${target}/#${invalidIndex}`, `${params.policyPath} ${params.property}.${key}[${invalidIndex}] must be a non-empty string.`, `Fix ${params.policyPath} so each ${params.property}.${key} entry is a ${params.valueName}.`);
	}
}
function execApprovalAllowlistExpectedShapeFinding(value, params) {
	if (value === void 0) return;
	if (!Array.isArray(value)) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${params.target}`, `${params.policyPath} ${params.property} must be an array.`, `Fix ${params.policyPath} so ${params.property} is an array of exec approval allowlist entries.`);
	const invalidIndex = value.findIndex((entry) => execApprovalAllowlistRequirement(entry) === void 0);
	if (invalidIndex < 0) return;
	return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${params.target}/#${invalidIndex}`, `${params.policyPath} ${params.property}[${invalidIndex}] must be a non-empty string or an object with pattern and optional argPattern strings.`, `Use entries such as "deploy" or { "pattern": "deploy", "argPattern": "^--prod$" }.`);
}
function policyStringArrayPropertyShapeFinding(value, params) {
	if (value === void 0) return;
	if (!Array.isArray(value)) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${params.target}`, `${params.policyPath} ${params.property} must be an array.`, `Fix ${params.policyPath} so ${params.property} is an array of ${params.valueName}s.`);
	const invalidIndex = value.findIndex((entry) => {
		if (typeof entry !== "string" || entry.trim() === "") return true;
		return params.allowed !== void 0 && !params.allowed.includes(entry.trim());
	});
	if (invalidIndex < 0) return;
	const allowedHint = params.allowed === void 0 ? "" : ` Supported values: ${params.allowed.join(", ")}.`;
	return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${params.target}/#${invalidIndex}`, `${params.policyPath} ${params.property}[${invalidIndex}] must be a supported ${params.valueName}.`, `Use non-empty ${params.valueName} entries.${allowedHint}`);
}
function policyShapeFinding(policyPath, target, message, fixHint) {
	return {
		checkId: CHECK_IDS.policyInvalidFile,
		severity: "error",
		message,
		source: "policy",
		path: policyPath,
		target,
		fixHint
	};
}
function authProfileMetadataRequirementFindings(policy, policyPath, policyDocName) {
	if (!isRecord(policy) || !isRecord(policy.auth) || !isRecord(policy.auth.profiles) || policy.auth.profiles.requireMetadata === void 0) return [];
	if (!Array.isArray(policy.auth.profiles.requireMetadata)) return [{
		checkId: CHECK_IDS.policyInvalidFile,
		severity: "error",
		message: `${policyPath} auth.profiles.requireMetadata must be an array of metadata keys.`,
		source: "policy",
		path: policyPath,
		target: `oc://${policyDocName}/auth/profiles/requireMetadata`,
		fixHint: `Use supported metadata keys: ${SUPPORTED_AUTH_PROFILE_METADATA.join(", ")}.`
	}];
	const invalidIndex = policy.auth.profiles.requireMetadata.findIndex((entry) => typeof entry !== "string" || !SUPPORTED_AUTH_PROFILE_METADATA.includes(entry.trim().toLowerCase()));
	if (invalidIndex < 0) return [];
	return [{
		checkId: CHECK_IDS.policyInvalidFile,
		severity: "error",
		message: `${policyPath} auth.profiles.requireMetadata[${invalidIndex}] must be a supported metadata key.`,
		source: "policy",
		path: policyPath,
		target: `oc://${policyDocName}/auth/profiles/requireMetadata/#${invalidIndex}`,
		fixHint: `Use supported metadata keys: ${SUPPORTED_AUTH_PROFILE_METADATA.join(", ")}.`
	}];
}
function invalidChannelDenyRuleFindings(policy, policyPath, policyDocName) {
	if (!isRecord(policy) || !isRecord(policy.channels) || policy.channels.denyRules === void 0) return [];
	if (!Array.isArray(policy.channels.denyRules)) return [{
		checkId: CHECK_IDS.policyInvalidFile,
		severity: "error",
		message: `${policyPath} channels.denyRules must be an array.`,
		source: "policy",
		path: policyPath,
		target: `oc://${policyDocName}/channels/denyRules`,
		fixHint: `Fix ${policyPath} so channel deny rules are an array.`
	}];
	for (const [index, rule] of policy.channels.denyRules.entries()) {
		if (!isRecord(rule)) continue;
		const unsupportedRuleKey = unsupportedPolicyKey(rule, [
			"id",
			"reason",
			"when"
		]);
		if (unsupportedRuleKey !== void 0) return [{
			checkId: CHECK_IDS.policyInvalidFile,
			severity: "error",
			message: `${policyPath} channels.denyRules[${index}].${unsupportedRuleKey} is not supported in channel deny rules.`,
			source: "policy",
			path: policyPath,
			target: `oc://${policyDocName}/channels/denyRules/#${index}/${ocPathSegment(unsupportedRuleKey)}`,
			fixHint: `Remove channels.denyRules[${index}].${unsupportedRuleKey} or use id, when.provider, and reason.`
		}];
		if (isRecord(rule.when)) {
			const unsupportedWhenKey = unsupportedPolicyKey(rule.when, ["provider"]);
			if (unsupportedWhenKey !== void 0) return [{
				checkId: CHECK_IDS.policyInvalidFile,
				severity: "error",
				message: `${policyPath} channels.denyRules[${index}].when.${unsupportedWhenKey} is not supported in channel deny rules.`,
				source: "policy",
				path: policyPath,
				target: `oc://${policyDocName}/channels/denyRules/#${index}/when/${ocPathSegment(unsupportedWhenKey)}`,
				fixHint: `Remove channels.denyRules[${index}].when.${unsupportedWhenKey} or use when.provider.`
			}];
		}
	}
	const invalid = policy.channels.denyRules.findIndex((rule) => !isChannelDenyRule(rule));
	if (invalid < 0) return [];
	return [{
		checkId: CHECK_IDS.policyInvalidFile,
		severity: "error",
		message: `${policyPath} channels.denyRules[${invalid}] must define when.provider as a string.`,
		source: "policy",
		path: policyPath,
		target: `oc://${policyDocName}/channels/denyRules/#${invalid}`,
		fixHint: `Fix ${policyPath} so each channel deny rule has a provider match.`
	}];
}
function ingressFindings(policy, policyPath, policyDocName, evidence) {
	if (!isRecord(policy)) return [];
	const findings = [];
	const ingressPolicy = policy.ingress;
	if (ingressPolicyShapeFinding(ingressPolicy, {
		policyDocName,
		policyPath
	}) === void 0 && isRecord(ingressPolicy)) findings.push(...ingressFindingsForRule(ingressPolicy, policyDocName, "ingress", evidence, () => true));
	if (hasValidScopedPolicy(policy, policyPath, policyDocName)) for (const target of channelScopedPolicyTargets(policy)) {
		if (ingressPolicyShapeFinding(target.overlay.ingress, {
			policyDocName,
			policyPath,
			targetPrefix: `scopes/${ocPathSegment(target.scopeName)}/ingress`,
			propertyPrefix: `scopes.${target.scopeName}.ingress`,
			allowSession: false
		}) !== void 0 || !isRecord(target.overlay.ingress)) continue;
		findings.push(...ingressFindingsForRule(target.overlay.ingress, policyDocName, `scopes/${ocPathSegment(target.scopeName)}/ingress`, evidence, (entry) => scopedIngressChannelMatches(entry, target.channelId)));
	}
	return findings;
}
function ingressFindingsForRule(ingressPolicy, policyDocName, requirementBase, evidence, evidenceFilter) {
	if (!isRecord(ingressPolicy)) return [];
	return [
		...ingressDmScopeFindings(ingressPolicy, policyDocName, requirementBase, evidence, evidenceFilter),
		...ingressDmPolicyFindings(ingressPolicy, policyDocName, requirementBase, evidence, evidenceFilter),
		...ingressOpenGroupFindings(ingressPolicy, policyDocName, requirementBase, evidence, evidenceFilter),
		...ingressRequireMentionFindings(ingressPolicy, policyDocName, requirementBase, evidence, evidenceFilter)
	];
}
function ingressDmScopeFindings(ingressPolicy, policyDocName, requirementBase, evidence, evidenceFilter) {
	const required = readString(ingressPolicy, ["session", "requireDmScope"]);
	if (required === void 0) return [];
	return ingressEntries(evidence, "sessionDmScope").filter(evidenceFilter).filter((entry) => entry.value !== required).map((entry) => ingressFinding(entry, {
		checkId: CHECK_IDS.policyIngressDmScopeUnapproved,
		message: `session.dmScope '${entry.value ?? ""}' does not match policy.`,
		requirement: `oc://${policyDocName}/${requirementBase}/session/requireDmScope`,
		fixHint: "Set session.dmScope to the required isolation scope or update policy after review."
	}));
}
function ingressDmPolicyFindings(ingressPolicy, policyDocName, requirementBase, evidence, evidenceFilter) {
	const allowed = new Set(readStringList(ingressPolicy, ["channels", "allowDmPolicies"]));
	if (allowed.size === 0) return [];
	return ingressEntries(evidence, "channelDmPolicy").filter(evidenceFilter).filter((entry) => typeof entry.value === "string" && !allowed.has(entry.value.toLowerCase())).map((entry) => ingressFinding(entry, {
		checkId: CHECK_IDS.policyIngressDmPolicyUnapproved,
		message: `${ingressLabel(entry)} uses unapproved DM policy '${entry.value ?? ""}'.`,
		requirement: `oc://${policyDocName}/${requirementBase}/channels/allowDmPolicies`,
		fixHint: "Set the channel DM policy to an allowed value or update policy after review."
	}));
}
function ingressOpenGroupFindings(ingressPolicy, policyDocName, requirementBase, evidence, evidenceFilter) {
	if (readPolicyBoolean(ingressPolicy, ["channels", "denyOpenGroups"]) !== true) return [];
	return ingressEntries(evidence, "channelGroupPolicy").filter(evidenceFilter).filter((entry) => entry.value !== "allowlist" && entry.value !== "disabled").map((entry) => ingressFinding(entry, {
		checkId: CHECK_IDS.policyIngressOpenGroupsDenied,
		message: `${ingressLabel(entry)} allows open group ingress.`,
		requirement: `oc://${policyDocName}/${requirementBase}/channels/denyOpenGroups`,
		fixHint: "Set groupPolicy to allowlist or disabled, or update policy after review."
	}));
}
function ingressRequireMentionFindings(ingressPolicy, policyDocName, requirementBase, evidence, evidenceFilter) {
	if (readPolicyBoolean(ingressPolicy, ["channels", "requireMentionInGroups"]) !== true) return [];
	const groupPolicies = ingressEntries(evidence, "channelGroupPolicy").filter(evidenceFilter);
	return ingressEntries(evidence, "channelRequireMention").filter(evidenceFilter).filter((entry) => !isGroupIngressDisabled(entry, groupPolicies)).filter((entry) => entry.value !== true).map((entry) => ingressFinding(entry, {
		checkId: CHECK_IDS.policyIngressGroupMentionRequired,
		message: `${ingressLabel(entry)} does not require group mentions.`,
		requirement: `oc://${policyDocName}/${requirementBase}/channels/requireMentionInGroups`,
		fixHint: "Set requireMention=true for the channel/group entry or update policy after review."
	}));
}
function isGroupIngressDisabled(entry, groupPolicies) {
	const entryParent = ocPathParent(entry.source);
	const channelDefaultsParent = "oc://openclaw.config/channels/defaults";
	return groupPolicies.filter((candidate) => {
		const candidateParent = ocPathParent(candidate.source);
		return candidate.channel === entry.channel && (candidate.accountId ?? "") === (entry.accountId ?? "") && (candidateParent === channelDefaultsParent || entryParent === candidateParent || entryParent.startsWith(`${candidateParent}/`));
	}).toSorted((left, right) => ocPathParent(right.source).length - ocPathParent(left.source).length)[0]?.value === "disabled";
}
function ocPathParent(source) {
	return source.slice(0, Math.max(0, source.lastIndexOf("/")));
}
function ingressEntries(evidence, kind) {
	return (evidence.ingress ?? []).filter((entry) => entry.kind === kind);
}
function scopedIngressChannelMatches(entry, policyChannelId) {
	return normalizePolicyChannelId(entry.channel ?? "") === policyChannelId;
}
function ingressFinding(entry, params) {
	return {
		checkId: params.checkId,
		severity: "error",
		message: params.message,
		source: "policy",
		path: "openclaw config",
		ocPath: entry.source,
		target: entry.source,
		requirement: params.requirement,
		fixHint: params.fixHint
	};
}
function ingressLabel(entry) {
	const account = entry.accountId === void 0 ? "" : ` account '${entry.accountId}'`;
	const group = entry.groupId === void 0 ? "" : ` group '${entry.groupId}'`;
	return `channel '${entry.channel ?? "unknown"}'${account}${group}`;
}
function agentWorkspaceFindings(policy, policyPath, policyDocName, evidence) {
	if (agentsPolicyShapeFinding(isRecord(policy) ? policy.agents : void 0, {
		policyDocName,
		policyPath
	}) !== void 0) return [];
	return [
		...agentWorkspaceAccessFindings(policy, [
			"agents",
			"workspace",
			"allowedAccess"
		], policyDocName, "agents/workspace/allowedAccess", evidence, () => true),
		...agentWorkspaceToolDenyFindings(policy, [
			"agents",
			"workspace",
			"denyTools"
		], policyDocName, "agents/workspace/denyTools", evidence, () => true),
		...agentScopedWorkspaceFindings(policy, policyPath, policyDocName, evidence)
	];
}
function agentWorkspaceAccessFindings(policy, policyPath, policyDocName, requirementPath, evidence, evidenceFilter) {
	const allowed = new Set(readStringList(policy, policyPath));
	if (allowed.size === 0) return [];
	return (evidence.agentWorkspace ?? []).filter(evidenceFilter).filter((entry) => entry.kind === "workspaceAccess" && entry.value !== void 0 && (entry.sandboxEnabled !== true || !allowed.has(entry.value))).map((entry) => {
		const label = entry.agentId === void 0 ? "agents.defaults" : `agent '${entry.agentId}'`;
		const sandboxDisabled = entry.sandboxEnabled !== true;
		const observed = sandboxDisabled ? `sandbox mode '${entry.sandboxMode ?? "off"}'` : `sandbox workspaceAccess '${entry.value ?? ""}'`;
		const ocPath = sandboxDisabled ? entry.sandboxModeSource ?? entry.source : entry.source;
		return {
			checkId: CHECK_IDS.policyAgentsWorkspaceAccessDenied,
			severity: "error",
			message: `${label} ${observed} is not allowed by policy.`,
			source: "policy",
			path: "openclaw config",
			ocPath,
			target: ocPath,
			requirement: `oc://${policyDocName}/${requirementPath}`,
			fixHint: "Enable sandbox mode with workspaceAccess none/ro or update policy after review."
		};
	});
}
function agentWorkspaceToolDenyFindings(policy, policyPath, policyDocName, requirementPath, evidence, evidenceFilter) {
	const requiredDeniedTools = new Set(readStringList(policy, policyPath));
	if (requiredDeniedTools.size === 0) return [];
	return (evidence.agentWorkspace ?? []).filter(evidenceFilter).filter((entry) => entry.kind === "toolDeny" && entry.tool !== void 0 && requiredDeniedTools.has(entry.tool) && entry.denied !== true).map((entry) => {
		const label = entry.agentId === void 0 ? "agents.defaults" : `agent '${entry.agentId}'`;
		return {
			checkId: CHECK_IDS.policyAgentsToolNotDenied,
			severity: "error",
			message: `${label} does not deny required tool '${entry.tool ?? ""}'.`,
			source: "policy",
			path: "openclaw config",
			ocPath: entry.source,
			target: entry.source,
			requirement: `oc://${policyDocName}/${requirementPath}`,
			fixHint: "Add the tool to tools.deny or agents.list[].tools.deny, or update policy after review."
		};
	});
}
function agentScopedWorkspaceFindings(policy, policyPath, policyDocName, evidence) {
	if (!hasValidScopedPolicy(policy, policyPath, policyDocName)) return [];
	const findings = [];
	for (const target of agentScopedPolicyTargets(policy)) {
		const scopedAgents = isRecord(target.overlay.agents) ? target.overlay.agents : {};
		const workspace = isRecord(scopedAgents.workspace) ? scopedAgents.workspace : {};
		const requirementBase = `scopes/${ocPathSegment(target.scopeName)}/agents/workspace`;
		const evidenceFilter = (entry) => scopedWorkspaceAgentMatches(entry, target.agentId, evidence.agentWorkspace ?? []);
		findings.push(...agentWorkspaceAccessFindings({ workspace }, ["workspace", "allowedAccess"], policyDocName, `${requirementBase}/allowedAccess`, evidence, evidenceFilter), ...agentWorkspaceToolDenyFindings({ workspace }, ["workspace", "denyTools"], policyDocName, `${requirementBase}/denyTools`, evidence, evidenceFilter));
	}
	return findings;
}
function execApprovalsFindings(policy, policyPath, policyDocName, evidence, file, displayName) {
	if (!isRecord(policy)) return [];
	const findings = [];
	const entries = evidence.execApprovals ?? [];
	const defaults = entries.find((entry) => entry.kind === "defaults");
	const defaultSecurity = defaults?.security ?? "full";
	if (isRecord(policy.execApprovals)) {
		const shapeFinding = execApprovalsPolicyShapeFinding(policy.execApprovals, {
			policyDocName,
			policyPath
		});
		if (shapeFinding !== void 0) return [shapeFinding];
		const fileFindings = execApprovalsFileFindings(policy.execApprovals, {
			policyDocName,
			file,
			displayName,
			requirementBase: "execApprovals"
		});
		findings.push(...fileFindings);
		if (fileFindings.length > 0) return findings;
		findings.push(...execApprovalsRuleFindings(policy.execApprovals, {
			entries,
			defaultSecurity,
			defaults,
			displayName,
			fileDisplayName: file?.displayName,
			policyDocName,
			requirementBase: "execApprovals"
		}));
	}
	if (!hasValidScopedPolicy(policy, policyPath, policyDocName)) return findings;
	const scopedFileFindingScopes = /* @__PURE__ */ new Set();
	for (const target of agentScopedPolicyTargets(policy)) {
		if (!isRecord(target.overlay.execApprovals)) continue;
		const requirementBase = `scopes/${ocPathSegment(target.scopeName)}/execApprovals`;
		const shapeFinding = execApprovalsPolicyShapeFinding(target.overlay.execApprovals, {
			policyDocName,
			policyPath,
			targetPrefix: requirementBase,
			propertyPrefix: `scopes.${target.scopeName}.execApprovals`,
			allowDefaults: false
		});
		if (shapeFinding !== void 0) {
			findings.push(shapeFinding);
			continue;
		}
		const fileFindings = execApprovalsFileFindings(target.overlay.execApprovals, {
			policyDocName,
			file,
			displayName,
			requirementBase
		});
		if (fileFindings.length > 0) {
			if (!scopedFileFindingScopes.has(target.scopeName)) {
				findings.push(...fileFindings);
				scopedFileFindingScopes.add(target.scopeName);
			}
			continue;
		}
		findings.push(...execApprovalsRuleFindings(target.overlay.execApprovals, {
			entries,
			defaultSecurity,
			defaults,
			displayName,
			fileDisplayName: file?.displayName,
			policyDocName,
			requirementBase,
			targetAgentId: target.agentId
		}));
	}
	return findings;
}
function execApprovalsFileFindings(execApprovalsPolicy, params) {
	const requireFile = readPolicyBoolean(execApprovalsPolicy, ["requireFile"]) === true;
	const needsArtifactEvidence = requireFile || execApprovalsPolicyNeedsArtifactEvidence(execApprovalsPolicy);
	if (needsArtifactEvidence && params.file === null) return [{
		checkId: CHECK_IDS.policyExecApprovalsMissing,
		severity: "error",
		message: "exec-approvals.json evidence is required by policy but was not found.",
		source: "policy",
		path: params.displayName,
		target: "oc://exec-approvals.json",
		requirement: `oc://${params.policyDocName}/${requireFile ? `${params.requirementBase}/requireFile` : params.requirementBase}`,
		fixHint: "Restore the approved exec approvals artifact or update policy after review."
	}];
	if (params.file === null || params.file === void 0) return [];
	const parsed = parseExecApprovalsFile(params.file.raw);
	if (parsed.ok || !needsArtifactEvidence) return [];
	return [{
		checkId: CHECK_IDS.policyExecApprovalsInvalid,
		severity: "error",
		message: `${params.file.displayName} could not be parsed: ${parsed.message}`,
		source: "policy",
		path: params.file.displayName,
		target: `oc://${params.file.ocDocName}`,
		requirement: `oc://${params.policyDocName}/${params.requirementBase}`,
		fixHint: "Fix exec-approvals.json so it is valid JSON."
	}];
}
function execApprovalsPolicyNeedsArtifactEvidence(execApprovalsPolicy) {
	return isRecord(execApprovalsPolicy.defaults) || isRecord(execApprovalsPolicy.agents);
}
function execApprovalsRuleFindings(execApprovalsPolicy, params) {
	const findings = [];
	const allowedDefaults = new Set(readStringList(execApprovalsPolicy, ["defaults", "allowSecurity"]));
	if (params.targetAgentId === void 0 && allowedDefaults.size > 0 && !allowedDefaults.has(params.defaultSecurity.toLowerCase())) findings.push(execApprovalFinding(params.defaults, {
		checkId: CHECK_IDS.policyExecApprovalsDefaultSecurityUnapproved,
		message: `exec approvals defaults use unapproved security mode '${params.defaultSecurity}'.`,
		requirement: `oc://${params.policyDocName}/${params.requirementBase}/defaults/allowSecurity`,
		fixHint: "Set defaults.security to an approved mode or update policy after review."
	}));
	const allowedAgents = new Set(readStringList(execApprovalsPolicy, ["agents", "allowSecurity"]));
	if (allowedAgents.size > 0) {
		const agentEntries = params.targetAgentId === void 0 ? globalExecApprovalAgentSecurityEntries(params.entries, params.defaults) : [effectiveExecApprovalAgentSecurityEntry(params.entries, params.targetAgentId) ?? params.defaults ?? syntheticExecApprovalAgentEntry(params.targetAgentId)];
		for (const entry of agentEntries) {
			const security = entry.security ?? params.defaultSecurity;
			if (allowedAgents.has(security.toLowerCase())) continue;
			findings.push(execApprovalFinding(entry, {
				checkId: CHECK_IDS.policyExecApprovalsAgentSecurityUnapproved,
				message: `exec approvals agent '${entry.agentId ?? params.targetAgentId ?? "inherited defaults"}' uses unapproved security mode '${security}'.`,
				requirement: `oc://${params.policyDocName}/${params.requirementBase}/agents/allowSecurity`,
				fixHint: "Set the agent approval security mode to an approved value or update policy after review."
			}));
		}
	}
	if (readPolicyBoolean(execApprovalsPolicy, ["agents", "allowAutoAllowSkills"]) === false) {
		const autoAllowEntries = params.targetAgentId === void 0 ? globalExecApprovalAgentAutoAllowSkillsEntries(params.entries, params.defaults) : [effectiveExecApprovalAgentAutoAllowSkillsEntry(params.entries, params.targetAgentId) ?? params.defaults ?? syntheticExecApprovalAgentEntry(params.targetAgentId)];
		for (const entry of autoAllowEntries) {
			if (entry.autoAllowSkills !== true) continue;
			findings.push(execApprovalFinding(entry, {
				checkId: CHECK_IDS.policyExecApprovalsAutoAllowSkillsEnabled,
				message: `exec approvals agent '${entry.agentId ?? params.targetAgentId ?? "inherited defaults"}' enables autoAllowSkills outside policy.`,
				requirement: `oc://${params.policyDocName}/${params.requirementBase}/agents/allowAutoAllowSkills`,
				fixHint: "Set autoAllowSkills to false or update policy after reviewing implicit skill CLI trust."
			}));
		}
	}
	const expected = readExecApprovalAllowlistRequirements(execApprovalsPolicy, [
		"agents",
		"allowlist",
		"expected"
	]);
	if (expected !== void 0) {
		const expectedSet = new Set(expected.map((entry) => entry.key));
		const actualEntries = execApprovalAllowlistEntries(params.entries, params.targetAgentId).filter((entry) => entry.pattern !== void 0);
		const actual = actualEntries.map((entry) => execApprovalAllowlistRequirementKey(entry.pattern, entry.argPattern)).toSorted();
		const actualSet = new Set(actual);
		for (const entry of expected.toSorted((a, b) => a.key.localeCompare(b.key))) if (!actualSet.has(entry.key)) {
			const requirement = `oc://${params.policyDocName}/${params.requirementBase}/agents/allowlist/expected`;
			const target = execApprovalAllowlistMissingTarget(params.targetAgentId);
			findings.push({
				checkId: CHECK_IDS.policyExecApprovalsAllowlistMissing,
				severity: "error",
				message: `exec approvals allowlist is missing expected pattern '${formatExecApprovalAllowlistRequirement(entry)}'.`,
				source: "policy",
				path: params.fileDisplayName ?? params.displayName,
				target,
				requirement,
				fixHint: "Add the expected approval pattern or update policy after review."
			});
		}
		for (const key of actualSet) {
			if (expectedSet.has(key)) continue;
			const entry = actualEntries.find((candidate) => candidate.pattern !== void 0 && execApprovalAllowlistRequirementKey(candidate.pattern, candidate.argPattern) === key);
			findings.push(execApprovalFinding(entry, {
				checkId: CHECK_IDS.policyExecApprovalsAllowlistUnexpected,
				message: `exec approvals allowlist has unexpected pattern '${formatExecApprovalAllowlistEntry(entry)}'.`,
				requirement: `oc://${params.policyDocName}/${params.requirementBase}/agents/allowlist/expected`,
				fixHint: "Remove the unexpected approval pattern or update policy after review."
			}));
		}
	}
	return findings;
}
function globalExecApprovalAgentSecurityEntries(entries, defaults) {
	const agentEntries = entries.filter((candidate) => candidate.kind === "agent");
	const wildcard = agentEntries.find((entry) => entry.agentId === "*");
	const securityEntries = agentEntries.filter((entry) => entry.agentId === "*" || entry.security !== void 0 || entry.securityConfigured === true);
	return wildcard === void 0 ? [...securityEntries, defaults ?? syntheticExecApprovalAgentEntry("*")] : securityEntries;
}
function globalExecApprovalAgentAutoAllowSkillsEntries(entries, defaults) {
	const agentEntries = entries.filter((candidate) => candidate.kind === "agent");
	const wildcard = agentEntries.find((entry) => entry.agentId === "*");
	const explicitEntries = agentEntries.filter((entry) => entry.autoAllowSkills !== void 0);
	return wildcard?.autoAllowSkills === void 0 ? [...explicitEntries, defaults ?? syntheticExecApprovalAgentEntry("*")] : explicitEntries;
}
function readExecApprovalAllowlistRequirements(policy, path) {
	let current = policy;
	for (const part of path) {
		if (!isRecord(current)) return;
		current = current[part];
	}
	if (!Array.isArray(current)) return;
	const entries = current.map(execApprovalAllowlistRequirement);
	return entries.every((entry) => entry !== void 0) ? entries : void 0;
}
function execApprovalAllowlistRequirement(value) {
	if (typeof value === "string") {
		const pattern = value.trim();
		return pattern === "" ? void 0 : execApprovalAllowlistRequirementFromParts(pattern);
	}
	if (!isRecord(value)) return;
	if (unsupportedPolicyKey(value, ["argPattern", "pattern"]) !== void 0) return;
	const pattern = typeof value.pattern === "string" ? value.pattern.trim() : "";
	if (pattern === "") return;
	const argPattern = typeof value.argPattern === "string" ? value.argPattern.trim() : void 0;
	if (value.argPattern !== void 0 && argPattern === void 0) return;
	return execApprovalAllowlistRequirementFromParts(pattern, argPattern === "" ? void 0 : argPattern);
}
function execApprovalAllowlistRequirementFromParts(pattern, argPattern) {
	return {
		key: execApprovalAllowlistRequirementKey(pattern, argPattern),
		pattern,
		...argPattern === void 0 ? {} : { argPattern }
	};
}
function execApprovalAllowlistRequirementKey(pattern, argPattern) {
	return `${pattern}\0${argPattern ?? ""}`;
}
function execApprovalAllowlistMissingTarget(agentId) {
	return agentId === void 0 ? "oc://exec-approvals.json" : `oc://exec-approvals.json/agents/${ocPathSegment(agentId)}/allowlist`;
}
function formatExecApprovalAllowlistRequirement(entry) {
	return formatExecApprovalAllowlistParts(entry.pattern, entry.argPattern);
}
function formatExecApprovalAllowlistEntry(entry) {
	return formatExecApprovalAllowlistParts(entry?.pattern ?? "", entry?.argPattern);
}
function formatExecApprovalAllowlistParts(pattern, argPattern) {
	return argPattern === void 0 ? pattern : `${pattern} argPattern=${argPattern}`;
}
function effectiveExecApprovalAgentSecurityEntry(entries, agentId) {
	const exact = entries.find((entry) => entry.kind === "agent" && entry.agentId !== void 0 && normalizeAgentId(entry.agentId) === normalizeAgentId(agentId));
	const wildcard = entries.find((entry) => entry.kind === "agent" && entry.agentId === "*");
	if (exact?.security !== void 0 || exact?.securityConfigured === true) return exact;
	return wildcard?.security === void 0 ? exact ?? wildcard : wildcard;
}
function effectiveExecApprovalAgentAutoAllowSkillsEntry(entries, agentId) {
	const exact = entries.find((entry) => entry.kind === "agent" && entry.agentId !== void 0 && normalizeAgentId(entry.agentId) === normalizeAgentId(agentId));
	if (exact?.autoAllowSkills !== void 0) return exact;
	const wildcard = entries.find((entry) => entry.kind === "agent" && entry.agentId === "*");
	return wildcard?.autoAllowSkills === void 0 ? void 0 : wildcard;
}
function syntheticExecApprovalAgentEntry(agentId) {
	return {
		id: `agent:${agentId}:runtime-defaults`,
		kind: "agent",
		source: "oc://exec-approvals.json",
		agentId
	};
}
function execApprovalAllowlistEntries(entries, agentId) {
	if (agentId === void 0) return entries.filter((entry) => entry.kind === "allowlist");
	return entries.filter((entry) => entry.kind === "allowlist" && entry.agentId !== void 0 && (normalizeAgentId(entry.agentId) === normalizeAgentId(agentId) || entry.agentId === "*"));
}
function execApprovalFinding(entry, params) {
	const target = entry?.source ?? "oc://exec-approvals.json";
	return {
		checkId: params.checkId,
		severity: "error",
		message: params.message,
		source: "policy",
		path: "exec-approvals.json",
		ocPath: target,
		target,
		requirement: params.requirement,
		fixHint: params.fixHint
	};
}
function toolPostureFindings(policy, policyPath, policyDocName, evidence) {
	const findings = [];
	if (isRecord(policy) && isRecord(policy.tools) && toolPosturePolicyShapeFinding(policy.tools, {
		policyDocName,
		policyPath
	}) === void 0) findings.push(...toolPostureFindingsForRule(policy.tools, policyDocName, "tools", evidence, () => true));
	if (!hasValidScopedPolicy(policy, policyPath, policyDocName)) return findings;
	for (const target of agentScopedPolicyTargets(policy)) {
		if (!isRecord(target.overlay.tools)) continue;
		const requirementBase = `scopes/${ocPathSegment(target.scopeName)}/tools`;
		if (toolPosturePolicyShapeFinding(target.overlay.tools, {
			policyDocName,
			policyPath,
			targetPrefix: requirementBase,
			propertyPrefix: `scopes.${target.scopeName}.tools`
		}) !== void 0) continue;
		findings.push(...toolPostureFindingsForRule(target.overlay.tools, policyDocName, requirementBase, evidence, (entry) => scopedToolAgentMatches(entry, target.agentId, evidence.toolPosture ?? [])));
	}
	return findings;
}
function hasValidScopedPolicy(policy, policyPath, policyDocName) {
	return isRecord(policy) && scopedPolicyShapeFinding(policy.scopes, {
		policyDocName,
		policyPath,
		policy
	}) === void 0;
}
function scopedWorkspaceAgentMatches(entry, policyAgentId, entries) {
	if (scopedAgentIdMatches(entry.agentId, policyAgentId)) return true;
	return entry.scope === "defaults" && !hasScopedAgentEvidence(entries, entry.kind, policyAgentId);
}
function scopedToolAgentMatches(entry, policyAgentId, entries) {
	if (scopedAgentIdMatches(entry.agentId, policyAgentId)) return true;
	return entry.scope === "global" && !hasScopedToolEvidence(entries, entry.kind, policyAgentId);
}
function hasScopedAgentEvidence(entries, kind, policyAgentId) {
	return entries.some((candidate) => candidate.scope === "agent" && candidate.kind === kind && scopedAgentIdMatches(candidate.agentId, policyAgentId));
}
function hasScopedToolEvidence(entries, kind, policyAgentId) {
	return entries.some((candidate) => candidate.scope === "agent" && candidate.kind === kind && scopedAgentIdMatches(candidate.agentId, policyAgentId));
}
function scopedAgentIdMatches(evidenceAgentId, policyAgentId) {
	return evidenceAgentId !== void 0 && normalizeAgentId(evidenceAgentId) === normalizeAgentId(policyAgentId);
}
function toolPostureFindingsForRule(toolsPolicy, policyDocName, requirementBase, evidence, evidenceFilter) {
	return [
		...toolProfileFindings(toolsPolicy, policyDocName, requirementBase, evidence, evidenceFilter),
		...toolFsWorkspaceOnlyFindings(toolsPolicy, policyDocName, requirementBase, evidence, evidenceFilter),
		...toolExecPostureFindings(toolsPolicy, policyDocName, requirementBase, evidence, evidenceFilter),
		...toolElevatedFindings(toolsPolicy, policyDocName, requirementBase, evidence, evidenceFilter),
		...toolAlsoAllowExpectedFindings(toolsPolicy, policyDocName, requirementBase, evidence, evidenceFilter),
		...toolRequiredDenyFindings(toolsPolicy, policyDocName, requirementBase, evidence, evidenceFilter)
	];
}
function toolProfileFindings(toolsPolicy, policyDocName, requirementBase, evidence, evidenceFilter) {
	const allowed = new Set(readStringList(toolsPolicy, ["profiles", "allow"]));
	if (allowed.size === 0) return [];
	return toolPostureEntries(evidence, "profile").filter(evidenceFilter).filter((entry) => typeof entry.value === "string" && !allowed.has(entry.value.toLowerCase())).map((entry) => {
		return toolPostureFinding(entry, {
			checkId: CHECK_IDS.policyToolsProfileUnapproved,
			message: `${toolPostureLabel(entry)} uses unapproved tool profile '${entry.value ?? ""}'.`,
			requirement: `oc://${policyDocName}/${requirementBase}/profiles/allow`,
			fixHint: "Use an approved tools.profile value or update policy after review."
		});
	});
}
function toolFsWorkspaceOnlyFindings(toolsPolicy, policyDocName, requirementBase, evidence, evidenceFilter) {
	if (readPolicyBoolean(toolsPolicy, ["fs", "requireWorkspaceOnly"]) !== true) return [];
	return toolPostureEntries(evidence, "fsWorkspaceOnly").filter(evidenceFilter).filter((entry) => entry.value !== true).map((entry) => {
		return toolPostureFinding(entry, {
			checkId: CHECK_IDS.policyToolsFsWorkspaceOnlyRequired,
			message: `${toolPostureLabel(entry)} does not require workspace-only filesystem tools.`,
			requirement: `oc://${policyDocName}/${requirementBase}/fs/requireWorkspaceOnly`,
			fixHint: "Set tools.fs.workspaceOnly=true or update policy after review."
		});
	});
}
function toolExecPostureFindings(toolsPolicy, policyDocName, requirementBase, evidence, evidenceFilter) {
	return [
		...toolStringPostureAllowFindings(toolsPolicy, policyDocName, requirementBase, evidence, {
			checkId: CHECK_IDS.policyToolsExecSecurityUnapproved,
			kind: "execSecurity",
			policyPath: ["exec", "allowSecurity"],
			requirementPath: "exec/allowSecurity",
			settingLabel: "exec security",
			evidenceFilter
		}),
		...toolStringPostureAllowFindings(toolsPolicy, policyDocName, requirementBase, evidence, {
			checkId: CHECK_IDS.policyToolsExecAskUnapproved,
			kind: "execAsk",
			policyPath: ["exec", "requireAsk"],
			requirementPath: "exec/requireAsk",
			settingLabel: "exec ask",
			evidenceFilter
		}),
		...toolStringPostureAllowFindings(toolsPolicy, policyDocName, requirementBase, evidence, {
			checkId: CHECK_IDS.policyToolsExecHostUnapproved,
			kind: "execHost",
			policyPath: ["exec", "allowHosts"],
			requirementPath: "exec/allowHosts",
			settingLabel: "exec host",
			evidenceFilter
		})
	];
}
function toolStringPostureAllowFindings(toolsPolicy, policyDocName, requirementBase, evidence, params) {
	const allowed = new Set(readStringList(toolsPolicy, params.policyPath));
	if (allowed.size === 0) return [];
	return toolPostureEntries(evidence, params.kind).filter(params.evidenceFilter).filter((entry) => typeof entry.value === "string" && !allowed.has(entry.value.toLowerCase())).map((entry) => {
		return toolPostureFinding(entry, {
			checkId: params.checkId,
			message: `${toolPostureLabel(entry)} uses unapproved ${params.settingLabel} '${entry.value ?? ""}'.`,
			requirement: `oc://${policyDocName}/${requirementBase}/${params.requirementPath}`,
			fixHint: "Adjust the configured tool posture or update policy after review."
		});
	});
}
function toolElevatedFindings(toolsPolicy, policyDocName, requirementBase, evidence, evidenceFilter) {
	if (readPolicyBoolean(toolsPolicy, ["elevated", "allow"]) !== false) return [];
	return toolPostureEntries(evidence, "elevatedEnabled").filter(evidenceFilter).filter((entry) => entry.value !== false).map((entry) => {
		return toolPostureFinding(entry, {
			checkId: CHECK_IDS.policyToolsElevatedEnabled,
			message: `${toolPostureLabel(entry)} permits elevated tool mode.`,
			requirement: `oc://${policyDocName}/${requirementBase}/elevated/allow`,
			fixHint: "Set tools.elevated.enabled=false or update policy after review."
		});
	});
}
function toolAlsoAllowExpectedFindings(toolsPolicy, policyDocName, requirementBase, evidence, evidenceFilter) {
	if ((isRecord(toolsPolicy.alsoAllow) ? toolsPolicy.alsoAllow : {}).expected === void 0) return [];
	const expected = normalizedStringSet(readStringList(toolsPolicy, ["alsoAllow", "expected"]));
	const findings = [];
	for (const entry of toolPostureEntries(evidence, "alsoAllow").filter(evidenceFilter)) {
		const actual = normalizedStringSet(entry.entries ?? []);
		for (const expectedTool of expected) {
			if (actual.has(expectedTool)) continue;
			findings.push(toolPostureFinding(entry, {
				checkId: CHECK_IDS.policyToolsAlsoAllowMissing,
				message: `${toolPostureLabel(entry)} is missing expected tools.alsoAllow entry '${expectedTool}'.`,
				requirement: `oc://${policyDocName}/${requirementBase}/alsoAllow/expected`,
				fixHint: "Add the expected tools.alsoAllow entry or update policy after review."
			}));
		}
		for (const actualTool of actual) {
			if (expected.has(actualTool)) continue;
			findings.push(toolPostureFinding(entry, {
				checkId: CHECK_IDS.policyToolsAlsoAllowUnexpected,
				message: `${toolPostureLabel(entry)} has unexpected tools.alsoAllow entry '${actualTool}'.`,
				requirement: `oc://${policyDocName}/${requirementBase}/alsoAllow/expected`,
				fixHint: "Remove the unexpected tools.alsoAllow entry or update policy after review."
			}));
		}
	}
	return findings;
}
function normalizedStringSet(entries) {
	return new Set(entries.map((entry) => entry.trim().toLowerCase()).filter(Boolean).toSorted());
}
function toolRequiredDenyFindings(toolsPolicy, policyDocName, requirementBase, evidence, evidenceFilter) {
	const required = readStringList(toolsPolicy, ["denyTools"]);
	if (required.length === 0) return [];
	const requiredTools = uniqueStrings(required.flatMap(expandPolicyToolRequirement));
	const findings = [];
	for (const entry of toolPostureEntries(evidence, "deny").filter(evidenceFilter)) for (const tool of requiredTools) {
		if (toolListCoversTool(entry.entries ?? [], tool)) continue;
		findings.push(toolPostureFinding(entry, {
			checkId: CHECK_IDS.policyToolsRequiredDenyMissing,
			message: `${toolPostureLabel(entry)} does not deny required tool '${tool}'.`,
			requirement: `oc://${policyDocName}/${requirementBase}/denyTools`,
			fixHint: "Add the tool or group to tools.deny/agents.list[].tools.deny, or update policy after review."
		}));
	}
	return findings;
}
function toolPostureEntries(evidence, kind) {
	return (evidence.toolPosture ?? []).filter((entry) => entry.kind === kind);
}
function toolPostureFinding(entry, params) {
	return {
		checkId: params.checkId,
		severity: "error",
		message: params.message,
		source: "policy",
		path: "openclaw config",
		ocPath: entry.source,
		target: entry.source,
		requirement: params.requirement,
		fixHint: params.fixHint
	};
}
function toolPostureLabel(entry) {
	return entry.agentId === void 0 ? "global tools config" : `agent '${entry.agentId}'`;
}
function sandboxPostureFindings(policy, policyPath, policyDocName, evidence) {
	if (!isRecord(policy)) return [];
	const findings = [];
	const sandboxPolicy = policy.sandbox;
	if (isRecord(sandboxPolicy) && sandboxPolicyShapeFinding(sandboxPolicy, {
		policyDocName,
		policyPath
	}) === void 0) findings.push(...sandboxPostureFindingsForRule(sandboxPolicy, policyDocName, "sandbox", evidence, () => true));
	if (!hasValidScopedPolicy(policy, policyPath, policyDocName)) return findings;
	for (const target of agentScopedPolicyTargets(policy)) {
		const scopedSandboxPolicy = target.overlay.sandbox;
		if (sandboxPolicyShapeFinding(scopedSandboxPolicy, {
			policyDocName,
			policyPath,
			targetPrefix: `scopes/${ocPathSegment(target.scopeName)}/sandbox`,
			propertyPrefix: `scopes.${target.scopeName}.sandbox`
		}) !== void 0 || !isRecord(scopedSandboxPolicy)) continue;
		findings.push(...sandboxPostureFindingsForRule(scopedSandboxPolicy, policyDocName, `scopes/${ocPathSegment(target.scopeName)}/sandbox`, evidence, (entry) => scopedSandboxAgentMatches(entry, target.agentId, evidence.sandboxPosture ?? [])));
	}
	return findings;
}
function sandboxPostureFindingsForRule(sandboxPolicy, policyDocName, requirementBase, evidence, evidenceFilter) {
	if (!isRecord(sandboxPolicy)) return [];
	return [
		...sandboxModeFindings(sandboxPolicy, policyDocName, requirementBase, evidence, evidenceFilter),
		...sandboxBackendFindings(sandboxPolicy, policyDocName, requirementBase, evidence, evidenceFilter),
		...sandboxContainerPostureUnobservableFindings(sandboxPolicy, policyDocName, requirementBase, evidence, evidenceFilter),
		...sandboxContainerHostNetworkFindings(sandboxPolicy, policyDocName, requirementBase, evidence, evidenceFilter),
		...sandboxContainerNamespaceJoinFindings(sandboxPolicy, policyDocName, requirementBase, evidence, evidenceFilter),
		...sandboxContainerMountModeFindings(sandboxPolicy, policyDocName, requirementBase, evidence, evidenceFilter),
		...sandboxContainerRuntimeSocketMountFindings(sandboxPolicy, policyDocName, requirementBase, evidence, evidenceFilter),
		...sandboxContainerUnconfinedProfileFindings(sandboxPolicy, policyDocName, requirementBase, evidence, evidenceFilter),
		...sandboxBrowserCdpSourceRangeFindings(sandboxPolicy, policyDocName, requirementBase, evidence, evidenceFilter)
	];
}
function scopedSandboxAgentMatches(entry, policyAgentId, entries) {
	if (scopedAgentIdMatches(entry.agentId, policyAgentId)) return true;
	return entry.scope === "defaults" && !scopedSandboxDefaultDisabledForAgent(entry, policyAgentId, entries) && !entries.some((candidate) => candidate.scope === "agent" && sandboxPostureEntriesDescribeSameField(candidate, entry) && scopedAgentIdMatches(candidate.agentId, policyAgentId));
}
function scopedSandboxDefaultDisabledForAgent(entry, policyAgentId, entries) {
	if (sandboxEntryRequiresContainerBackend(entry)) {
		const backend = entries.find((candidate) => candidate.scope === "agent" && candidate.kind === "backend" && scopedAgentIdMatches(candidate.agentId, policyAgentId));
		if (typeof backend?.value === "string" && backend.value.toLowerCase() !== "docker") return true;
	}
	if (sandboxEntryRequiresBrowser(entry)) {
		if (entries.find((candidate) => candidate.scope === "agent" && candidate.kind === "browserCdpSourceRange" && scopedAgentIdMatches(candidate.agentId, policyAgentId))?.value === false) return true;
	}
	return false;
}
function sandboxEntryRequiresContainerBackend(entry) {
	return entry.kind === "containerNetwork" && entry.networkSurface === "docker" || entry.kind === "containerSecurityProfile" || entry.kind === "containerMount" && entry.bindSurface === "docker";
}
function sandboxEntryRequiresBrowser(entry) {
	return entry.kind === "browserCdpSourceRange" || entry.kind === "containerNetwork" && entry.networkSurface === "browser" || entry.kind === "containerMount" && entry.bindSurface === "browser";
}
function sandboxPostureEntriesDescribeSameField(candidate, baseline) {
	return candidate.kind === baseline.kind && candidate.bindSurface === baseline.bindSurface && candidate.networkSurface === baseline.networkSurface && candidate.profile === baseline.profile;
}
function sandboxModeFindings(sandboxPolicy, policyDocName, requirementBase, evidence, evidenceFilter) {
	const allowed = new Set(readStringList(sandboxPolicy, ["requireMode"]));
	if (allowed.size === 0) return [];
	return sandboxPostureEntries(evidence, "mode").filter(evidenceFilter).filter((entry) => typeof entry.value === "string" && !allowed.has(entry.value.toLowerCase())).map((entry) => sandboxPostureFinding(entry, {
		checkId: CHECK_IDS.policySandboxModeUnapproved,
		message: `${sandboxPostureLabel(entry)} uses unapproved sandbox mode '${entry.value ?? ""}'.`,
		requirement: `oc://${policyDocName}/${requirementBase}/requireMode`,
		fixHint: "Set agents.defaults.sandbox.mode or agents.list[].sandbox.mode to an approved value."
	}));
}
function sandboxBackendFindings(sandboxPolicy, policyDocName, requirementBase, evidence, evidenceFilter) {
	const allowed = new Set(readStringList(sandboxPolicy, ["allowBackends"]));
	if (allowed.size === 0) return [];
	return sandboxPostureEntries(evidence, "backend").filter(evidenceFilter).filter((entry) => typeof entry.value === "string" && !allowed.has(entry.value.toLowerCase())).map((entry) => sandboxPostureFinding(entry, {
		checkId: CHECK_IDS.policySandboxBackendUnapproved,
		message: `${sandboxPostureLabel(entry)} uses unapproved sandbox backend '${entry.value ?? ""}'.`,
		requirement: `oc://${policyDocName}/${requirementBase}/allowBackends`,
		fixHint: "Use an approved sandbox backend or update policy after review."
	}));
}
function sandboxContainerPostureUnobservableFindings(sandboxPolicy, policyDocName, requirementBase, evidence, evidenceFilter) {
	const enabledRules = SANDBOX_CONTAINER_POLICY_RULES.filter((rule) => readPolicyBoolean(sandboxPolicy, ["containers", rule.key]) === true);
	if (enabledRules.length === 0) return [];
	return sandboxPostureEntries(evidence, "backend").filter(evidenceFilter).filter((entry) => typeof entry.value === "string" && entry.value.toLowerCase() !== "docker").flatMap((entry) => enabledRules.map((rule) => sandboxPostureFinding(entry, {
		checkId: CHECK_IDS.policySandboxContainerPostureUnobservable,
		message: `${sandboxPostureLabel(entry)} uses sandbox backend '${entry.value ?? ""}', which cannot observe ${rule.label}.`,
		requirement: `oc://${policyDocName}/${requirementBase}/containers/${rule.key}`,
		fixHint: "Use an observable container backend for this sandbox or remove the container posture rule."
	})));
}
function sandboxContainerHostNetworkFindings(sandboxPolicy, policyDocName, requirementBase, evidence, evidenceFilter) {
	if (readPolicyBoolean(sandboxPolicy, ["containers", "denyHostNetwork"]) !== true) return [];
	return sandboxPostureEntries(evidence, "containerNetwork").filter(evidenceFilter).filter((entry) => typeof entry.value === "string" && entry.value.toLowerCase() === "host").map((entry) => sandboxPostureFinding(entry, {
		checkId: CHECK_IDS.policySandboxContainerHostNetworkDenied,
		message: `${sandboxPostureLabel(entry)} uses host container network mode.`,
		requirement: `oc://${policyDocName}/${requirementBase}/containers/denyHostNetwork`,
		fixHint: "Change the container network mode or update policy after review."
	}));
}
function sandboxContainerNamespaceJoinFindings(sandboxPolicy, policyDocName, requirementBase, evidence, evidenceFilter) {
	if (readPolicyBoolean(sandboxPolicy, ["containers", "denyContainerNamespaceJoin"]) !== true) return [];
	const containerNamespacePrefix = "container:";
	return sandboxPostureEntries(evidence, "containerNetwork").filter(evidenceFilter).filter((entry) => typeof entry.value === "string" && entry.value.toLowerCase().startsWith(containerNamespacePrefix)).map((entry) => sandboxPostureFinding(entry, {
		checkId: CHECK_IDS.policySandboxContainerNamespaceJoinDenied,
		message: `${sandboxPostureLabel(entry)} joins another container network namespace '${entry.value ?? ""}'.`,
		requirement: `oc://${policyDocName}/${requirementBase}/containers/denyContainerNamespaceJoin`,
		fixHint: "Change the container network mode or update policy after review."
	}));
}
function sandboxContainerMountModeFindings(sandboxPolicy, policyDocName, requirementBase, evidence, evidenceFilter) {
	if (readPolicyBoolean(sandboxPolicy, ["containers", "requireReadOnlyMounts"]) !== true) return [];
	return sandboxPostureEntries(evidence, "containerMount").filter(evidenceFilter).filter((entry) => entry.bindMode !== "ro").map((entry) => sandboxPostureFinding(entry, {
		checkId: CHECK_IDS.policySandboxContainerMountModeRequired,
		message: `${sandboxPostureLabel(entry)} has container mount '${entry.bind ?? ""}' with mode '${entry.bindMode ?? "unknown"}'.`,
		requirement: `oc://${policyDocName}/${requirementBase}/containers/requireReadOnlyMounts`,
		fixHint: "Set the mount mode to read-only or update policy after review."
	}));
}
function sandboxContainerRuntimeSocketMountFindings(sandboxPolicy, policyDocName, requirementBase, evidence, evidenceFilter) {
	if (readPolicyBoolean(sandboxPolicy, ["containers", "denyContainerRuntimeSocketMounts"]) !== true) return [];
	return sandboxPostureEntries(evidence, "containerMount").filter(evidenceFilter).filter((entry) => bindHostLooksLikeContainerRuntimeSocket(entry.bindHost)).map((entry) => sandboxPostureFinding(entry, {
		checkId: CHECK_IDS.policySandboxContainerRuntimeSocketMount,
		message: `${sandboxPostureLabel(entry)} binds host container runtime socket '${entry.bindHost ?? ""}'.`,
		requirement: `oc://${policyDocName}/${requirementBase}/containers/denyContainerRuntimeSocketMounts`,
		fixHint: "Remove the container runtime socket bind or update policy after review."
	}));
}
function sandboxContainerUnconfinedProfileFindings(sandboxPolicy, policyDocName, requirementBase, evidence, evidenceFilter) {
	if (readPolicyBoolean(sandboxPolicy, ["containers", "denyUnconfinedProfiles"]) !== true) return [];
	return sandboxPostureEntries(evidence, "containerSecurityProfile").filter(evidenceFilter).filter((entry) => typeof entry.value === "string" && entry.value.toLowerCase() === "unconfined").map((entry) => sandboxPostureFinding(entry, {
		checkId: CHECK_IDS.policySandboxContainerUnconfinedProfile,
		message: `${sandboxPostureLabel(entry)} sets container ${entry.profile ?? "security"} profile to unconfined.`,
		requirement: `oc://${policyDocName}/${requirementBase}/containers/denyUnconfinedProfiles`,
		fixHint: "Remove the unconfined container profile or update policy after review."
	}));
}
function sandboxBrowserCdpSourceRangeFindings(sandboxPolicy, policyDocName, requirementBase, evidence, evidenceFilter) {
	if (readPolicyBoolean(sandboxPolicy, ["browser", "requireCdpSourceRange"]) !== true) return [];
	return sandboxPostureEntries(evidence, "browserCdpSourceRange").filter(evidenceFilter).filter((entry) => entry.value === void 0).map((entry) => sandboxPostureFinding(entry, {
		checkId: CHECK_IDS.policySandboxBrowserCdpSourceRangeMissing,
		message: `${sandboxPostureLabel(entry)} enables sandbox browser without cdpSourceRange.`,
		requirement: `oc://${policyDocName}/${requirementBase}/browser/requireCdpSourceRange`,
		fixHint: "Set agents.*.sandbox.browser.cdpSourceRange or update policy after review."
	}));
}
function sandboxPostureEntries(evidence, kind) {
	return (evidence.sandboxPosture ?? []).filter((entry) => entry.kind === kind);
}
function sandboxPostureFinding(entry, params) {
	return {
		checkId: params.checkId,
		severity: "error",
		message: params.message,
		source: "policy",
		path: "openclaw config",
		ocPath: entry.source,
		target: entry.source,
		requirement: params.requirement,
		fixHint: params.fixHint
	};
}
function sandboxPostureLabel(entry) {
	return entry.agentId === void 0 ? "default sandbox config" : `agent '${entry.agentId}'`;
}
const CONTAINER_RUNTIME_SOCKET_BASENAMES = new Set([
	"containerd.sock",
	"docker.sock",
	"podman.sock"
]);
const CONTAINER_RUNTIME_SOCKET_PATHS = new Set([
	"/run/containerd/containerd.sock",
	"/run/docker.sock",
	"/run/podman/podman.sock",
	"/var/run/docker.sock",
	"/var/run/podman/podman.sock"
]);
function bindHostLooksLikeContainerRuntimeSocket(value) {
	if (value === void 0) return false;
	const normalized = value.replaceAll("\\", "/").toLowerCase();
	const basenameLocal = normalized.split("/").at(-1) ?? "";
	return CONTAINER_RUNTIME_SOCKET_PATHS.has(normalized) || CONTAINER_RUNTIME_SOCKET_BASENAMES.has(basenameLocal);
}
function secretAuthProvenanceFindings(policy, policyPath, policyDocName, evidence) {
	const secretShapeFindings = secretPolicyShapeFindings(policy, policyPath, policyDocName);
	const authShapeFindings = authProfileAllowModesShapeFindings(policy, policyPath, policyDocName);
	return [...secretShapeFindings.length > 0 ? secretShapeFindings : [
		...secretManagedProviderFindings(policy, policyDocName, evidence),
		...secretDeniedSourceFindings(policy, policyDocName, evidence),
		...secretInsecureProviderFindings(policy, policyDocName, evidence)
	], ...authShapeFindings.length > 0 ? authShapeFindings : [...authProfileMetadataFindings(policy, policyDocName, evidence), ...authProfileModeFindings(policy, policyDocName, evidence)]];
}
function dataHandlingFindings(policy, policyPath, policyDocName, evidence) {
	const shapeFindings = dataHandlingPolicyShapeFindings(policy, policyPath, policyDocName);
	if (shapeFindings.length > 0) return shapeFindings;
	const findings = [];
	findings.push(...dataHandlingFindingsForRule(policy, policyDocName, "dataHandling", evidence, () => true));
	for (const target of agentScopedPolicyTargets(policy)) {
		if (!dataHandlingPolicyHasRules(target.overlay.dataHandling)) continue;
		findings.push(...dataHandlingFindingsForRule(target.overlay, policyDocName, `scopes/${ocPathSegment(target.scopeName)}/dataHandling`, evidence, (entry) => entry.kind !== "memorySessionTranscriptIndexing" || scopedDataHandlingAgentMatches(entry, target.agentId, evidence.dataHandling ?? [])));
	}
	return findings;
}
function scopedDataHandlingAgentMatches(entry, policyAgentId, entries) {
	if (entry.id === "memory-qmd-session-transcripts") return true;
	if (scopedAgentIdMatches(entry.agentId, policyAgentId)) return true;
	return entry.id === "agents-defaults-memory-session-transcripts" && !entries.some((candidate) => candidate.scope === "agent" && candidate.kind === entry.kind && scopedAgentIdMatches(candidate.agentId, policyAgentId));
}
function dataHandlingFindingsForRule(policy, policyDocName, requirementBase, evidence, evidenceFilter) {
	const dataHandling = isRecord(policy) ? policy.dataHandling : void 0;
	if (!isRecord(dataHandling)) return [];
	const findings = [];
	if (readPolicyBoolean(dataHandling, ["sensitiveLogging", "requireRedaction"]) === true) findings.push(...dataHandlingEntries(evidence, "sensitiveLoggingRedaction").filter(evidenceFilter).filter((entry) => entry.value !== true).map((entry) => dataHandlingFinding(entry, {
		checkId: CHECK_IDS.policyDataHandlingRedactionDisabled,
		message: "Sensitive logging redaction is disabled.",
		requirement: `oc://${policyDocName}/${requirementBase}/sensitiveLogging/requireRedaction`,
		fixHint: "Set logging.redactSensitive to tools or update policy after review."
	})));
	if (readPolicyBoolean(dataHandling, ["telemetry", "denyContentCapture"]) === true) findings.push(...dataHandlingEntries(evidence, "telemetryContentCapture").filter(evidenceFilter).filter((entry) => entry.value === true).map((entry) => dataHandlingFinding(entry, {
		checkId: CHECK_IDS.policyDataHandlingTelemetryContentCapture,
		message: "Telemetry content capture is enabled.",
		requirement: `oc://${policyDocName}/${requirementBase}/telemetry/denyContentCapture`,
		fixHint: "Disable diagnostics.otel.captureContent or update policy after review."
	})));
	if (readPolicyBoolean(dataHandling, ["retention", "requireSessionMaintenance"]) === true) findings.push(...dataHandlingEntries(evidence, "sessionRetentionMode").filter(evidenceFilter).filter((entry) => entry.value !== "enforce").map((entry) => dataHandlingFinding(entry, {
		checkId: CHECK_IDS.policyDataHandlingSessionRetentionNotEnforced,
		message: `Session retention maintenance mode is '${entry.value ?? "unknown"}'.`,
		requirement: `oc://${policyDocName}/${requirementBase}/retention/requireSessionMaintenance`,
		fixHint: "Set session.maintenance.mode to enforce or update policy after review."
	})));
	if (readPolicyBoolean(dataHandling, ["memory", "denySessionTranscriptIndexing"]) === true) findings.push(...dataHandlingEntries(evidence, "memorySessionTranscriptIndexing").filter(evidenceFilter).filter((entry) => entry.value === true).map((entry) => dataHandlingFinding(entry, {
		checkId: CHECK_IDS.policyDataHandlingSessionTranscriptMemory,
		message: `${dataHandlingLabel(entry)} enables session transcript memory indexing.`,
		requirement: `oc://${policyDocName}/${requirementBase}/memory/denySessionTranscriptIndexing`,
		fixHint: "Disable session transcript memory indexing for the matching config surface or update policy after review."
	})));
	return findings;
}
function dataHandlingPolicyShapeFindings(policy, policyPath, policyDocName) {
	if (!isRecord(policy)) return [];
	if (!isRecord(policy.dataHandling)) return [];
	return [
		policySectionUnsupportedKeyFinding(policy.dataHandling, {
			policyPath,
			policyDocName,
			propertyPath: "dataHandling",
			targetPath: "dataHandling",
			sectionName: "data-handling",
			allowedKeys: [
				"memory",
				"retention",
				"sensitiveLogging",
				"telemetry"
			]
		}),
		dataHandlingSectionShapeFinding(policy.dataHandling, {
			policyPath,
			policyDocName,
			propertyPath: "dataHandling.sensitiveLogging",
			targetPath: "dataHandling/sensitiveLogging",
			section: "sensitiveLogging"
		}),
		dataHandlingSectionShapeFinding(policy.dataHandling, {
			policyPath,
			policyDocName,
			propertyPath: "dataHandling.telemetry",
			targetPath: "dataHandling/telemetry",
			section: "telemetry"
		}),
		dataHandlingSectionShapeFinding(policy.dataHandling, {
			policyPath,
			policyDocName,
			propertyPath: "dataHandling.retention",
			targetPath: "dataHandling/retention",
			section: "retention"
		}),
		dataHandlingSectionShapeFinding(policy.dataHandling, {
			policyPath,
			policyDocName,
			propertyPath: "dataHandling.memory",
			targetPath: "dataHandling/memory",
			section: "memory"
		}),
		dataHandlingBooleanShapeFinding(policy.dataHandling, {
			policyPath,
			policyDocName,
			propertyPath: "dataHandling.sensitiveLogging.requireRedaction",
			targetPath: "dataHandling/sensitiveLogging/requireRedaction",
			path: ["sensitiveLogging", "requireRedaction"]
		}),
		dataHandlingBooleanShapeFinding(policy.dataHandling, {
			policyPath,
			policyDocName,
			propertyPath: "dataHandling.telemetry.denyContentCapture",
			targetPath: "dataHandling/telemetry/denyContentCapture",
			path: ["telemetry", "denyContentCapture"]
		}),
		dataHandlingBooleanShapeFinding(policy.dataHandling, {
			policyPath,
			policyDocName,
			propertyPath: "dataHandling.retention.requireSessionMaintenance",
			targetPath: "dataHandling/retention/requireSessionMaintenance",
			path: ["retention", "requireSessionMaintenance"]
		}),
		dataHandlingBooleanShapeFinding(policy.dataHandling, {
			policyPath,
			policyDocName,
			propertyPath: "dataHandling.memory.denySessionTranscriptIndexing",
			targetPath: "dataHandling/memory/denySessionTranscriptIndexing",
			path: ["memory", "denySessionTranscriptIndexing"]
		})
	].filter((finding) => finding !== void 0);
}
function policySectionUnsupportedKeyFinding(value, params) {
	const unsupportedKey = unsupportedPolicyKey(value, params.allowedKeys);
	if (unsupportedKey === void 0) return;
	return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${params.targetPath}/${ocPathSegment(unsupportedKey)}`, `${params.policyPath} ${params.propertyPath}.${unsupportedKey} is not supported in ${params.sectionName} policy.`, `Remove ${params.propertyPath}.${unsupportedKey} or use a supported ${params.sectionName} policy rule.`);
}
function dataHandlingSectionShapeFinding(dataHandling, params) {
	const value = dataHandling[params.section];
	if (value === void 0 || isRecord(value)) return;
	return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${params.targetPath}`, `${params.policyPath} ${params.propertyPath} must be an object.`, `Fix ${params.propertyPath} so it contains boolean policy rules.`);
}
function dataHandlingBooleanShapeFinding(dataHandling, params) {
	const value = getPolicyPath(dataHandling, params.path);
	if (isRecord(dataHandling) && typeof params.path[0] === "string") {
		const section = dataHandling[params.path[0]];
		if (isRecord(section) && typeof params.path[1] === "string") {
			const sectionPath = params.path.slice(0, -1).join(".");
			const unsupportedKey = unsupportedPolicyKey(section, [params.path[1]]);
			if (unsupportedKey !== void 0) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${params.targetPath.split("/").slice(0, -1).join("/")}/${ocPathSegment(unsupportedKey)}`, `${params.policyPath} dataHandling.${sectionPath}.${unsupportedKey} is not supported in data-handling policy.`, `Remove dataHandling.${sectionPath}.${unsupportedKey} or use ${params.propertyPath}.`);
		}
	}
	if (value === void 0 || typeof value === "boolean") return;
	return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${params.targetPath}`, `${params.policyPath} ${params.propertyPath} must be a boolean.`, `Set ${params.propertyPath} to true or false.`);
}
function dataHandlingEntries(evidence, kind) {
	return (evidence.dataHandling ?? []).filter((entry) => entry.kind === kind);
}
function dataHandlingFinding(entry, params) {
	return {
		checkId: params.checkId,
		severity: "error",
		message: params.message,
		source: "policy",
		path: "openclaw config",
		ocPath: entry.source,
		target: entry.source,
		requirement: params.requirement,
		fixHint: params.fixHint
	};
}
function dataHandlingLabel(entry) {
	return entry.agentId === void 0 ? "Global data handling config" : `agent '${entry.agentId}'`;
}
function policyHasExecApprovalsRules(policy) {
	if (!isRecord(policy)) return false;
	if (execApprovalsPolicyHasRules(policy.execApprovals)) return true;
	return agentScopedPolicyOverlays(policy).some(([, overlay]) => execApprovalsPolicyHasRules(overlay.execApprovals));
}
function execApprovalsPolicyHasRules(value) {
	return isRecord(value) && (value.requireFile !== void 0 || isRecord(value.defaults) || isRecord(value.agents));
}
function policyHasSecretRules(policy) {
	if (!isRecord(policy) || !isRecord(policy.secrets)) return false;
	return policy.secrets.requireManagedProviders !== void 0 || policy.secrets.denySources !== void 0 || policy.secrets.allowInsecureProviders !== void 0;
}
function policyHasAuthProfileRules(policy) {
	return isRecord(policy) && isRecord(policy.auth) && isRecord(policy.auth.profiles) && (policy.auth.profiles.requireMetadata !== void 0 || policy.auth.profiles.allowModes !== void 0);
}
function policyHasIngressRules(policy) {
	if (!isRecord(policy)) return false;
	if (ingressPolicyHasRules(policy.ingress)) return true;
	return agentScopedPolicyOverlays(policy).some(([, overlay]) => ingressPolicyHasRules(overlay.ingress));
}
function ingressPolicyHasRules(value) {
	if (!isRecord(value)) return false;
	const ingress = value;
	return isRecord(ingress.session) && ingress.session.requireDmScope !== void 0 || isRecord(ingress.channels) && (ingress.channels.allowDmPolicies !== void 0 || ingress.channels.denyOpenGroups !== void 0 || ingress.channels.requireMentionInGroups !== void 0);
}
function policyHasGatewayRules(policy) {
	if (!isRecord(policy) || !isRecord(policy.gateway)) return false;
	const gateway = policy.gateway;
	return isRecord(gateway.exposure) && (gateway.exposure.allowNonLoopbackBind !== void 0 || gateway.exposure.allowTailscaleFunnel !== void 0) || isRecord(gateway.auth) && (gateway.auth.requireAuth !== void 0 || gateway.auth.requireExplicitRateLimit !== void 0) || isRecord(gateway.controlUi) && gateway.controlUi.allowInsecure !== void 0 || isRecord(gateway.remote) && gateway.remote.allow !== void 0 || isRecord(gateway.http) && (gateway.http.denyEndpoints !== void 0 || gateway.http.requireUrlAllowlists !== void 0);
}
function policyHasAgentWorkspaceRules(policy) {
	if (!isRecord(policy)) return false;
	if (isRecord(policy.agents) && workspacePolicyHasRules(policy.agents.workspace)) return true;
	return agentScopedPolicyOverlays(policy).some(([, overlay]) => {
		return workspacePolicyHasRules((isRecord(overlay.agents) ? overlay.agents : {}).workspace);
	});
}
function policyHasSandboxPostureRules(policy) {
	if (!isRecord(policy)) return false;
	if (sandboxPosturePolicyHasRules(policy.sandbox)) return true;
	return agentScopedPolicyOverlays(policy).some(([, overlay]) => sandboxPosturePolicyHasRules(overlay.sandbox));
}
function sandboxPosturePolicyHasRules(value) {
	if (!isRecord(value)) return false;
	const sandbox = value;
	const containers = isRecord(sandbox.containers) ? sandbox.containers : void 0;
	const browser = isRecord(sandbox.browser) ? sandbox.browser : void 0;
	return sandbox.requireMode !== void 0 || sandbox.allowBackends !== void 0 || containers !== void 0 && SANDBOX_CONTAINER_POLICY_RULES.some((rule) => containers[rule.key] !== void 0) || browser?.requireCdpSourceRange !== void 0;
}
function policyHasDataHandlingRules(policy) {
	if (!isRecord(policy)) return false;
	if (dataHandlingPolicyHasRules(policy.dataHandling)) return true;
	return agentScopedPolicyOverlays(policy).some(([, overlay]) => dataHandlingPolicyHasRules(overlay.dataHandling));
}
function dataHandlingPolicyHasRules(value) {
	if (!isRecord(value)) return false;
	const dataHandling = value;
	return isRecord(dataHandling.sensitiveLogging) && dataHandling.sensitiveLogging.requireRedaction !== void 0 || isRecord(dataHandling.telemetry) && dataHandling.telemetry.denyContentCapture !== void 0 || isRecord(dataHandling.retention) && dataHandling.retention.requireSessionMaintenance !== void 0 || isRecord(dataHandling.memory) && dataHandling.memory.denySessionTranscriptIndexing !== void 0;
}
function policyHasToolPostureRules(policy) {
	if (!isRecord(policy)) return false;
	if (toolPosturePolicyHasRules(policy.tools)) return true;
	return agentScopedPolicyOverlays(policy).some(([, overlay]) => toolPosturePolicyHasRules(overlay.tools));
}
function workspacePolicyHasRules(value) {
	return isRecord(value) && (value.allowedAccess !== void 0 || value.denyTools !== void 0);
}
function toolPosturePolicyHasRules(value) {
	if (!isRecord(value)) return false;
	const tools = value;
	return isRecord(tools.profiles) && tools.profiles.allow !== void 0 || isRecord(tools.fs) && tools.fs.requireWorkspaceOnly !== void 0 || isRecord(tools.exec) && (tools.exec.allowSecurity !== void 0 || tools.exec.requireAsk !== void 0 || tools.exec.allowHosts !== void 0) || isRecord(tools.elevated) && tools.elevated.allow !== void 0 || isRecord(tools.alsoAllow) && tools.alsoAllow.expected !== void 0 || tools.denyTools !== void 0;
}
function agentScopedPolicyOverlays(policy) {
	if (!isRecord(policy) || !isRecord(policy.scopes)) return [];
	return Object.entries(policy.scopes).filter((entry) => isRecord(entry[1]));
}
function agentScopedPolicyTargets(policy) {
	const targets = [];
	for (const [scopeName, overlay] of agentScopedPolicyOverlays(policy)) {
		if (!Array.isArray(overlay.agentIds)) continue;
		for (const rawAgentId of overlay.agentIds) {
			if (typeof rawAgentId !== "string" || rawAgentId.trim() === "") continue;
			targets.push({
				scopeName,
				agentId: normalizeAgentId(rawAgentId),
				overlay
			});
		}
	}
	return targets;
}
function channelScopedPolicyTargets(policy) {
	const targets = [];
	for (const [scopeName, overlay] of agentScopedPolicyOverlays(policy)) {
		if (!Array.isArray(overlay.channelIds)) continue;
		for (const rawChannelId of overlay.channelIds) {
			if (typeof rawChannelId !== "string" || rawChannelId.trim() === "") continue;
			targets.push({
				scopeName,
				channelId: normalizePolicyChannelId(rawChannelId),
				overlay
			});
		}
	}
	return targets;
}
function duplicateScopedPolicyFieldFinding(scopes, params) {
	return duplicateScopedFieldFinding(scopes, {
		...params,
		selector: "agentIds",
		selectorLabel: "agent",
		normalize: normalizeAgentId
	}) ?? duplicateScopedFieldFinding(scopes, {
		...params,
		selector: "channelIds",
		selectorLabel: "channel",
		normalize: normalizePolicyChannelId
	});
}
function duplicateScopedFieldFinding(scopes, params) {
	const seen = /* @__PURE__ */ new Map();
	for (const [scopeName, overlay] of Object.entries(scopes)) {
		if (!isRecord(overlay)) continue;
		const selectorValues = overlay[params.selector];
		if (!Array.isArray(selectorValues)) continue;
		const fields = scopedPolicyFields(scopeName, overlay, params.selector);
		for (const rawSelectorValue of selectorValues) {
			if (typeof rawSelectorValue !== "string" || rawSelectorValue.trim() === "") continue;
			const selectorValue = params.normalize(rawSelectorValue);
			for (const field of fields) {
				const topLevelValue = getPolicyPath(params.policy, field.metadata.policyPath);
				if (topLevelValue !== void 0 && !isPolicyValueAtLeastAsStrict(field.metadata, field.value, topLevelValue)) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${field.targetPath}`, `${params.policyPath} scopes.${scopeName}.${field.propertyPath} is weaker than the top-level ${field.propertyPath} policy.`, `Use an equally or more restrictive scoped value, or remove the scoped override.`);
				const key = `${selectorValue}\0${field.fieldPath}`;
				const previous = seen.get(key);
				if (previous !== void 0) {
					if (isPolicyValueAtLeastAsStrict(field.metadata, field.value, previous.field.value)) {
						seen.set(key, {
							scopeName,
							propertyPath: `scopes.${scopeName}.${field.propertyPath}`,
							field
						});
						continue;
					}
					return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${field.targetPath}`, `${params.policyPath} scopes.${scopeName}.${field.propertyPath} is not an equally or more restrictive override of ${previous.propertyPath} for ${params.selectorLabel} '${selectorValue}'.`, `Use one effective scoped value per ${params.selectorLabel}, or make later scoped values stricter according to policy metadata.`);
				}
				seen.set(key, {
					scopeName,
					propertyPath: `scopes.${scopeName}.${field.propertyPath}`,
					field
				});
			}
		}
	}
}
function scopedPolicyFields(scopeName, overlay, selector) {
	const prefix = `scopes/${ocPathSegment(scopeName)}`;
	return POLICY_RULES.filter((rule) => rule.scopeSelectors?.includes(selector) === true).map((rule) => ({
		rule,
		value: scopedPolicyValue(overlay, rule.policyPath)
	})).filter((entry) => entry.value !== void 0).map(({ rule, value }) => ({
		fieldPath: rule.policyPath.join("."),
		propertyPath: rule.policyPath.join("."),
		targetPath: `${prefix}/${rule.policyPath.map(ocPathSegment).join("/")}`,
		metadata: rule,
		value
	}));
}
function scopedPolicyValue(overlay, path) {
	const scopedRoot = path[0] === "agents" ? overlay.agents : overlay[path[0]];
	if (path[0] === "agents") return getPolicyPath(scopedRoot, path.slice(1));
	return getPolicyPath(scopedRoot, path.slice(1));
}
function getPolicyPath(value, path) {
	let current = value;
	for (const part of path) {
		if (!isRecord(current)) return;
		current = current[part];
	}
	return current;
}
function secretPolicyShapeFindings(policy, policyPath, policyDocName) {
	if (!isRecord(policy) || !isRecord(policy.secrets)) return [];
	const findings = [];
	for (const key of ["requireManagedProviders", "allowInsecureProviders"]) if (policy.secrets[key] !== void 0 && typeof policy.secrets[key] !== "boolean") findings.push(policyShapeFinding(policyPath, `oc://${policyDocName}/secrets/${key}`, `${policyPath} secrets.${key} must be a boolean.`, `Set secrets.${key} to true or false.`));
	if (policy.secrets.denySources !== void 0 && !Array.isArray(policy.secrets.denySources)) findings.push(policyShapeFinding(policyPath, `oc://${policyDocName}/secrets/denySources`, `${policyPath} secrets.denySources must be an array of source names.`, "Use an array such as [\"exec\"] or remove secrets.denySources."));
	else if (Array.isArray(policy.secrets.denySources)) {
		const invalidIndex = policy.secrets.denySources.findIndex((entry) => typeof entry !== "string" || entry.trim() === "");
		if (invalidIndex >= 0) findings.push(policyShapeFinding(policyPath, `oc://${policyDocName}/secrets/denySources/#${invalidIndex}`, `${policyPath} secrets.denySources[${invalidIndex}] must be a non-empty source name.`, "Use non-empty source names such as env, file, exec, or openclaw."));
	}
	return findings;
}
function authProfileAllowModesShapeFindings(policy, policyPath, policyDocName) {
	if (!isRecord(policy) || !isRecord(policy.auth) || !isRecord(policy.auth.profiles) || policy.auth.profiles.allowModes === void 0) return [];
	if (!Array.isArray(policy.auth.profiles.allowModes)) return [policyShapeFinding(policyPath, `oc://${policyDocName}/auth/profiles/allowModes`, `${policyPath} auth.profiles.allowModes must be an array of auth modes.`, `Use supported auth modes: ${SUPPORTED_AUTH_PROFILE_MODES.join(", ")}.`)];
	const invalidIndex = policy.auth.profiles.allowModes.findIndex((entry) => typeof entry !== "string" || !SUPPORTED_AUTH_PROFILE_MODES.includes(entry.trim().toLowerCase()));
	if (invalidIndex < 0) return [];
	return [policyShapeFinding(policyPath, `oc://${policyDocName}/auth/profiles/allowModes/#${invalidIndex}`, `${policyPath} auth.profiles.allowModes[${invalidIndex}] must be a supported auth mode.`, `Use supported auth modes: ${SUPPORTED_AUTH_PROFILE_MODES.join(", ")}.`)];
}
function secretManagedProviderFindings(policy, policyDocName, evidence) {
	if (readPolicyBoolean(policy, ["secrets", "requireManagedProviders"]) !== true) return [];
	const secrets = evidence.secrets ?? [];
	const providerKeys = new Set(secrets.filter((secret) => secret.kind === "provider" && secret.providerSource !== void 0).map((secret) => `${secret.providerSource}:${secret.id}`));
	return secrets.filter((secret) => secret.kind === "input" && secret.provenance === "secretRef" && (secret.refProvider === void 0 || secret.refSource === void 0 || !providerKeys.has(`${secret.refSource}:${secret.refProvider}`))).map((secret) => {
		return {
			checkId: CHECK_IDS.policySecretsUnmanagedProvider,
			severity: "error",
			message: `SecretRef uses unmanaged provider '${secret.refProvider ?? "default"}'.`,
			source: "policy",
			path: "openclaw config",
			ocPath: secret.source,
			target: secret.source,
			requirement: `oc://${policyDocName}/secrets/requireManagedProviders`,
			fixHint: "Declare the referenced provider under secrets.providers or update policy after review."
		};
	});
}
function secretDeniedSourceFindings(policy, policyDocName, evidence) {
	const deniedSources = new Set(readStringList(policy, ["secrets", "denySources"]));
	if (deniedSources.size === 0) return [];
	return (evidence.secrets ?? []).filter((secret) => {
		const source = secret.kind === "provider" ? secret.providerSource : secret.refSource;
		return source !== void 0 && deniedSources.has(source);
	}).map((secret) => {
		const source = secret.kind === "provider" ? secret.providerSource : secret.refSource;
		return {
			checkId: CHECK_IDS.policySecretsDeniedProviderSource,
			severity: "error",
			message: `Secret ${secret.kind} '${secret.id}' uses denied source '${source}'.`,
			source: "policy",
			path: "openclaw config",
			ocPath: secret.source,
			target: secret.source,
			requirement: `oc://${policyDocName}/secrets/denySources`,
			fixHint: "Move this secret to an approved source or update policy after review."
		};
	});
}
function secretInsecureProviderFindings(policy, policyDocName, evidence) {
	if (readPolicyBoolean(policy, ["secrets", "allowInsecureProviders"]) !== false) return [];
	return (evidence.secrets ?? []).filter((secret) => secret.kind === "provider" && (secret.insecure?.length ?? 0) > 0).map((secret) => {
		return {
			checkId: CHECK_IDS.policySecretsInsecureProvider,
			severity: "error",
			message: `Secret provider '${secret.id}' enables insecure posture: ${(secret.insecure ?? []).join(", ")}.`,
			source: "policy",
			path: "openclaw config",
			ocPath: secret.source,
			target: secret.source,
			requirement: `oc://${policyDocName}/secrets/allowInsecureProviders`,
			fixHint: "Remove insecure provider overrides or update policy after review."
		};
	});
}
function authProfileMetadataFindings(policy, policyDocName, evidence) {
	const requiredMetadata = requiredAuthProfileMetadata(policy);
	if (requiredMetadata.size === 0) return [];
	return (evidence.authProfiles ?? []).flatMap((profile) => {
		const missing = [...requiredMetadata].filter((metadata) => !authProfileHasMetadata(profile, metadata));
		if (missing.length === 0) return [];
		return [{
			checkId: CHECK_IDS.policyAuthProfileInvalidMetadata,
			severity: "error",
			message: `Auth profile '${profile.id}' is missing required metadata: ${missing.join(", ")}.`,
			source: "policy",
			path: "openclaw config",
			ocPath: profile.source,
			target: profile.source,
			requirement: `oc://${policyDocName}/auth/profiles/requireMetadata`,
			fixHint: "Set auth.profiles.<id>.provider and a supported auth profile mode."
		}];
	});
}
function authProfileModeFindings(policy, policyDocName, evidence) {
	const allowedModes = new Set(readStringList(policy, [
		"auth",
		"profiles",
		"allowModes"
	]));
	if (allowedModes.size === 0) return [];
	return (evidence.authProfiles ?? []).filter((profile) => profile.mode !== void 0 && !allowedModes.has(profile.mode)).map((profile) => {
		return {
			checkId: CHECK_IDS.policyAuthProfileUnapprovedMode,
			severity: "error",
			message: `Auth profile '${profile.id}' uses mode '${profile.mode}' outside the policy allowlist.`,
			source: "policy",
			path: "openclaw config",
			ocPath: profile.source,
			target: profile.source,
			requirement: `oc://${policyDocName}/auth/profiles/allowModes`,
			fixHint: "Change the auth profile mode or update policy after review."
		};
	});
}
function toolRiskFindings(policyDocName, evidence) {
	return (evidence.tools ?? []).filter((tool) => tool.risk === void 0).map((tool) => {
		return {
			checkId: CHECK_IDS.policyMissingToolRisk,
			severity: "error",
			message: `TOOLS.md tool '${tool.id}' has no explicit risk classification.`,
			source: "policy",
			path: "TOOLS.md",
			line: tool.line,
			ocPath: tool.source,
			target: tool.source,
			requirement: `oc://${policyDocName}/tools/requireMetadata`,
			fixHint: "Declare risk:low, risk:medium, risk:high, risk:critical, or an R0-R5 review alias."
		};
	});
}
function toolUnknownRiskFindings(policyDocName, evidence) {
	return (evidence.tools ?? []).filter((tool) => tool.risk !== void 0 && !KNOWN_RISK_LEVELS.includes(tool.risk)).map((tool) => {
		return {
			checkId: CHECK_IDS.policyUnknownToolRisk,
			severity: "error",
			message: `TOOLS.md tool '${tool.id}' declares unknown risk '${tool.risk}'.`,
			source: "policy",
			path: "TOOLS.md",
			line: tool.line,
			ocPath: tool.source,
			target: tool.source,
			requirement: `oc://${policyDocName}/tools/requireMetadata`,
			fixHint: `Use one of: ${KNOWN_RISK_LEVELS.join(", ")}.`
		};
	});
}
function toolSensitivityFindings(policyDocName, evidence) {
	return (evidence.tools ?? []).flatMap((tool) => {
		if (tool.sensitivity === void 0) return [{
			checkId: CHECK_IDS.policyMissingToolSensitivity,
			severity: "error",
			message: `TOOLS.md tool '${tool.id}' has no declared artifact sensitivity.`,
			source: "policy",
			path: "TOOLS.md",
			line: tool.line,
			ocPath: tool.source,
			target: tool.source,
			requirement: `oc://${policyDocName}/tools/requireMetadata`,
			fixHint: `Declare sensitivity as one of: ${KNOWN_SENSITIVITY_LEVELS.join(", ")}.`
		}];
		if (KNOWN_SENSITIVITY_LEVELS.includes(tool.sensitivity)) return [];
		return [{
			checkId: CHECK_IDS.policyUnknownToolSensitivity,
			severity: "error",
			message: `TOOLS.md tool '${tool.id}' declares unknown sensitivity '${tool.sensitivity}'.`,
			source: "policy",
			path: "TOOLS.md",
			line: tool.line,
			ocPath: tool.source,
			target: tool.source,
			requirement: `oc://${policyDocName}/tools/requireMetadata`,
			fixHint: `Use one of: ${KNOWN_SENSITIVITY_LEVELS.join(", ")}.`
		}];
	});
}
function toolOwnerFindings(policyDocName, evidence) {
	return (evidence.tools ?? []).filter((tool) => tool.owner === void 0).map((tool) => {
		return {
			checkId: CHECK_IDS.policyMissingToolOwner,
			severity: "error",
			message: `TOOLS.md tool '${tool.id}' has no declared owner.`,
			source: "policy",
			path: "TOOLS.md",
			line: tool.line,
			ocPath: tool.source,
			target: tool.source,
			requirement: `oc://${policyDocName}/tools/requireMetadata`,
			fixHint: "Declare owner:<team-or-person> for this tool."
		};
	});
}
async function readPolicyFile(ctx) {
	const displayName = policyDisplayName(ctx);
	const path = resolveWorkspacePath(ctx, policyPathSetting(ctx));
	try {
		return {
			raw: await (await loadFsPromisesModule()).readFile(path, "utf-8"),
			path,
			displayName,
			ocDocName: basename(displayName)
		};
	} catch (err) {
		if (isNotFound(err)) return null;
		throw err;
	}
}
async function readExecApprovalsFile(ctx) {
	const artifact = execApprovalsArtifactLocation(ctx);
	try {
		return {
			raw: await (await loadFsPromisesModule()).readFile(artifact.path, "utf-8"),
			path: artifact.path,
			displayName: artifact.displayName,
			ocDocName: "exec-approvals.json"
		};
	} catch (err) {
		if (isNotFound(err)) return null;
		throw err;
	}
}
async function readWorkspaceFile(ctx, fileName) {
	const path = resolveWorkspacePath(ctx, fileName);
	try {
		return {
			raw: await (await loadFsPromisesModule()).readFile(path, "utf-8"),
			path
		};
	} catch (err) {
		if (isNotFound(err)) return null;
		throw err;
	}
}
function resolvePolicyArtifactPath(ctx, fileName) {
	if (fileName.startsWith("~/") || fileName.startsWith("~\\")) {
		const home = resolvePolicyArtifactHomeDir();
		if (home !== void 0) return resolve(home, fileName.slice(2));
	}
	return resolveWorkspacePath(ctx, fileName);
}
function resolvePolicyArtifactHomeDir() {
	const explicitHome = normalizedEnvValue(process.env.OPENCLAW_HOME);
	if (explicitHome !== void 0) {
		if (explicitHome === "~" || explicitHome.startsWith("~/") || explicitHome.startsWith("~\\")) return resolvePolicyHomeRelativePath(explicitHome);
		return resolve(explicitHome);
	}
	return resolveOsPolicyHomeDir();
}
function resolvePolicyHomeRelativePath(value) {
	const fallbackHome = resolveOsPolicyHomeDir();
	return fallbackHome === void 0 ? resolve(value) : resolve(value.replace(/^~(?=$|[\\/])/, fallbackHome));
}
function resolveOsPolicyHomeDir() {
	return normalizedEnvValue(process.env.HOME) ?? normalizedEnvValue(process.env.USERPROFILE) ?? safeOsHomeDir();
}
function safeOsHomeDir() {
	try {
		return normalizedEnvValue(os.homedir());
	} catch {
		return;
	}
}
function normalizedEnvValue(value) {
	const trimmed = value?.trim();
	return trimmed === void 0 || trimmed === "" || trimmed === "undefined" || trimmed === "null" ? void 0 : trimmed;
}
function resolveWorkspacePath(ctx, fileName) {
	if (isAbsolute(fileName)) return fileName;
	return resolve(ctx.cwd ?? process.cwd(), fileName);
}
function isNotFound(err) {
	return typeof err === "object" && err !== null && "code" in err && err.code === "ENOENT";
}
function parseExecApprovalsFile(raw) {
	try {
		const value = JSON.parse(raw);
		if (!isRecord(value) || value.version !== 1) return {
			ok: false,
			message: "unsupported exec approvals version"
		};
		return {
			ok: true,
			value
		};
	} catch (err) {
		return {
			ok: false,
			message: err instanceof Error ? err.message : String(err)
		};
	}
}
function parsePolicyFile(raw) {
	try {
		return {
			ok: true,
			value: JSON5.parse(raw)
		};
	} catch (err) {
		return {
			ok: false,
			message: err instanceof Error ? err.message : String(err)
		};
	}
}
function workspaceRepairsEnabled(ctx) {
	return policySettings(ctx).workspaceRepairs === true;
}
function workspaceRepairsDisabledResult(fileName) {
	return {
		status: "skipped",
		reason: "workspace repairs are disabled",
		changes: [],
		warnings: [`Skipped ${fileName} repair. Enable plugins.entries.policy.config.workspaceRepairs to let doctor --fix edit workspace files.`]
	};
}
function readChannelDenyRules(policy, policyDocName) {
	if (!isRecord(policy) || !isRecord(policy.channels) || !Array.isArray(policy.channels.denyRules)) return [];
	return policy.channels.denyRules.map((rule, index) => ({
		rule,
		index
	})).filter((entry) => isChannelDenyRule(entry.rule)).map(({ rule, index }) => {
		const next = {
			when: rule.when,
			requirement: `oc://${policyDocName}/channels/denyRules/#${index}`
		};
		if (rule.id !== void 0) next.id = rule.id;
		if (rule.reason !== void 0) next.reason = rule.reason;
		return next;
	});
}
function isChannelDenyRule(value) {
	return isRecord(value) && (value.id === void 0 || typeof value.id === "string") && (value.reason === void 0 || typeof value.reason === "string") && isRecord(value.when) && typeof value.when.provider === "string";
}
function channelIdsFromFindings(findings) {
	return [...new Set(findings.filter((finding) => finding.checkId === CHECK_IDS.policyDeniedChannelProvider).map((finding) => finding.ocPath?.match(/^oc:\/\/openclaw\.config\/channels\/(.+)$/)?.[1]).filter((id) => id !== void 0 && id !== ""))];
}
function disableChannels(cfg, channelIds) {
	if (!isRecord(cfg.channels)) return {
		config: cfg,
		changed: []
	};
	const channels = { ...cfg.channels };
	const changed = [];
	for (const id of channelIds) {
		const current = channels[id];
		if (!isRecord(current) || current.enabled === false) continue;
		channels[id] = {
			...current,
			enabled: false
		};
		changed.push(id);
	}
	if (changed.length === 0) return {
		config: cfg,
		changed
	};
	return {
		config: {
			...cfg,
			channels
		},
		changed
	};
}
function policySettings(ctx) {
	const pluginConfig = ctx.cfg.plugins?.entries?.["policy"]?.config;
	if (!isRecord(pluginConfig)) return {};
	return pluginConfig;
}
function policyChecksEnabled(ctx, settings) {
	const entry = ctx.cfg.plugins?.entries?.["policy"];
	if (!isRecord(entry) || entry.enabled === false) return false;
	return settings.enabled !== false;
}
function requiredToolMetadata(policy) {
	return new Set(readPolicyStringArray(policy, ["tools", "requireMetadata"]) ?? []);
}
function requiredAuthProfileMetadata(policy) {
	const entries = readPolicyStringArray(policy, [
		"auth",
		"profiles",
		"requireMetadata"
	]) ?? [];
	return new Set(entries.filter((entry) => SUPPORTED_AUTH_PROFILE_METADATA.includes(entry)));
}
function authProfileHasMetadata(profile, metadata) {
	if (metadata === "provider") return profile.provider !== void 0 && profile.provider.trim() !== "";
	return SUPPORTED_AUTH_PROFILE_MODES.includes(profile.mode);
}
function policyToolGlobMatches(tool, pattern) {
	const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	return new RegExp(`^${escaped.replaceAll("\\*", ".*")}$`).test(tool);
}
function toolListCoversTool(list, tool) {
	for (const entry of list) {
		const normalized = normalizePolicyToolName(entry);
		if (normalized === "*" || normalized === tool) return true;
		if (POLICY_TOOL_GROUPS[normalized]?.includes(tool)) return true;
		if (normalized.includes("*") && policyToolGlobMatches(tool, normalized)) return true;
	}
	return false;
}
function expandPolicyToolRequirement(value) {
	const normalized = normalizePolicyToolName(value);
	return POLICY_TOOL_GROUPS[normalized] ?? [normalized];
}
function normalizePolicyToolName(value) {
	const normalized = value.trim().toLowerCase();
	if (normalized === "bash") return "exec";
	if (normalized === "apply-patch") return "apply_patch";
	return normalized;
}
function normalizePolicyChannelId(value) {
	return value.trim().toLowerCase();
}
function canonicalExecApprovalsPath() {
	return "~/.openclaw/exec-approvals.json";
}
function execApprovalsArtifactLocation(ctx) {
	const stateDir = normalizedEnvValue(process.env.OPENCLAW_STATE_DIR);
	if (stateDir !== void 0) {
		const path = resolve(resolvePolicyStateDir(stateDir), "exec-approvals.json");
		return {
			path,
			displayName: path
		};
	}
	return {
		path: resolvePolicyArtifactPath(ctx, canonicalExecApprovalsPath()),
		displayName: canonicalExecApprovalsPath()
	};
}
function execApprovalsDisplayName() {
	const stateDir = normalizedEnvValue(process.env.OPENCLAW_STATE_DIR);
	if (stateDir === void 0) return canonicalExecApprovalsPath();
	return resolve(resolvePolicyStateDir(stateDir), "exec-approvals.json");
}
function resolvePolicyStateDir(stateDir) {
	return stateDir.startsWith("~") ? resolvePolicyHomeRelativePath(stateDir) : resolve(stateDir);
}
function policyPathSetting(ctx) {
	const configured = policySettings(ctx).path;
	return typeof configured === "string" && configured.trim() !== "" ? configured.trim() : "policy.jsonc";
}
function policyDisplayName(ctx) {
	const configured = policyPathSetting(ctx);
	return isAbsolute(configured) ? basename(configured) : configured;
}
//#endregion
export { POLICY_CHECK_IDS as a, isPolicyValueAtLeastAsStrict as i, policyContainerShapeFindings as n, POLICY_RULE_METADATA as o, registerPolicyDoctorChecks as r, createPolicyAttestation as s, evaluatePolicy as t };
