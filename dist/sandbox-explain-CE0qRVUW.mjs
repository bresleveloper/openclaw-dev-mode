import { c as normalizeOptionalLowercaseString, f as normalizeStringifiedEntries, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as writeRuntimeJson } from "./runtime-DlO3PTAd.mjs";
import { n as isRich, r as theme, t as colorize } from "./theme-DzaUZY4q.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { d as resolveAgentWorkspaceDir, m as resolveConfiguredAgentId, r as resolveAgentConfig } from "./agent-scope-config-CDYpzA0r.mjs";
import { i as normalizeMainKey, n as buildAgentMainSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { M as parseAgentSessionKey, l as resolveAgentIdFromSessionKey } from "./session-key-C09ow4h0.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { g as resolveSessionAgentId } from "./agent-scope-CG17uXFn.mjs";
import "./registry-B3Y-vjit.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-BvpWSO2L.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CPntde4x.mjs";
import "./config-CzeZu5J_.mjs";
import { t as formatDocsLink } from "./links-4Bgsoz0M.mjs";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-B3vfipkP.mjs";
import "./message-channel-j-k-Nup3.mjs";
import { r as resolveAgentMainSessionKey } from "./main-session-00MgEWj5.mjs";
import { n as sessionDeliveryChannel } from "./delivery-context.read-CR06zOJ4.mjs";
import { o as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-AwYVLytL.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import { r as resolveSandboxToolPolicyForAgent } from "./tool-policy-eD9SQrK2.mjs";
import "./sessions-DNhLX2Ep.mjs";
import { i as resolveSandboxConfigForAgent } from "./config-DGIfx80_.mjs";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-Dk4uhhe-.mjs";
import { t as buildSandboxFsMounts } from "./fs-paths-CvBLe4BA.mjs";
import { r as resolveSandboxWorkspaceLayoutPaths } from "./shared-2nFGF-qq.mjs";
import { a as getSandboxBackendWorkdirResolver } from "./backend-DPeOs_VY.mjs";
import { r as resolveIngressWorkspaceOverrideForSessionRun } from "./spawned-context-BjFFoRwI.mjs";
import "./sandbox-DXRpw1Ja.mjs";
//#region src/commands/sandbox-explain.ts
const SANDBOX_DOCS_URL = "https://docs.openclaw.ai/sandbox";
function normalizeExplainSessionKey(params) {
	const raw = (params.session ?? "").trim();
	if (!raw) return resolveAgentMainSessionKey({
		cfg: params.cfg,
		agentId: params.agentId
	});
	if (raw.includes(":") || raw === "global") return raw;
	return buildAgentMainSessionKey({
		agentId: params.agentId,
		mainKey: normalizeMainKey(raw)
	});
}
function inferProviderFromSessionKey(params) {
	const parsed = parseAgentSessionKey(params.sessionKey);
	if (!parsed) return;
	const channel = parsed.rest.trim().split(":").find(Boolean);
	const configuredMainKey = normalizeMainKey(params.cfg.session?.mainKey);
	if (!channel || channel === configuredMainKey) return;
	const candidate = normalizeOptionalLowercaseString(channel);
	if (!candidate) return;
	if (candidate === "webchat") return INTERNAL_MESSAGE_CHANNEL;
	return normalizeAnyChannelId(candidate) ?? void 0;
}
function resolveActiveChannel(params) {
	const normalizedCandidate = normalizeOptionalLowercaseString(sessionDeliveryChannel(params.entry));
	if (normalizedCandidate === "webchat") return INTERNAL_MESSAGE_CHANNEL;
	return normalizeAnyChannelId(normalizedCandidate) ?? inferProviderFromSessionKey(params);
}
async function sandboxExplainCommand(opts, runtime) {
	const cfg = getRuntimeConfig();
	const requestedSession = opts.session?.trim();
	const requestedAgent = opts.agent?.trim();
	if (opts.agent !== void 0 && !requestedAgent) throw new Error("--agent must not be blank");
	const requestedAgentId = requestedAgent ? normalizeAgentId(requestedAgent) : void 0;
	const sessionAgentId = requestedSession && requestedSession !== "global" && requestedSession.includes(":") ? normalizeAgentId(resolveAgentIdFromSessionKey(requestedSession)) : void 0;
	if (requestedAgentId && sessionAgentId && requestedAgentId !== sessionAgentId) throw new Error(`Sandbox explain agent "${requestedAgentId}" does not match session agent "${sessionAgentId}".`);
	if (requestedAgentId) resolveConfiguredAgentId(cfg, requestedAgentId);
	const resolvedAgentId = resolveSessionAgentId({
		sessionKey: requestedSession,
		config: cfg,
		agentId: requestedAgentId
	});
	const sessionKey = normalizeExplainSessionKey({
		cfg,
		agentId: resolvedAgentId,
		session: opts.session
	});
	const toolPolicy = resolveSandboxToolPolicyForAgent(cfg, resolvedAgentId);
	const sandboxRuntime = resolveSandboxRuntimeStatus({
		cfg,
		sessionKey,
		agentId: resolvedAgentId,
		classificationAgentId: resolvedAgentId
	});
	const configuredSandbox = resolveSandboxConfigForAgent(cfg, resolvedAgentId);
	const sandboxCfg = sandboxRuntime.sandboxRequired ? {
		...configuredSandbox,
		scope: "agent",
		workspaceAccess: sandboxRuntime.workspaceAccess
	} : configuredSandbox;
	const mainSessionKey = sandboxRuntime.mainSessionKey;
	const sessionIsSandboxed = sandboxRuntime.sandboxed;
	const storePath = resolveSessionStorePathCore(cfg.session?.store, { agentId: resolvedAgentId });
	const sessionEntry = loadSessionEntryReadOnly({
		agentId: resolvedAgentId,
		sessionKey,
		storePath
	});
	const agentConfig = resolveAgentConfig(cfg, resolvedAgentId);
	const configuredWorkspaceDir = resolveAgentWorkspaceDir(cfg, resolvedAgentId);
	const effectiveAgentWorkspaceDir = resolveIngressWorkspaceOverrideForSessionRun({
		spawnedBy: sessionEntry?.spawnedBy,
		workspaceDir: sessionEntry?.spawnedWorkspaceDir,
		cwd: sessionEntry?.spawnedCwd
	}) ?? configuredWorkspaceDir;
	const directRuntimeCwd = normalizeOptionalString(sessionEntry?.spawnedCwd) ?? effectiveAgentWorkspaceDir;
	const workspaceLayout = resolveSandboxWorkspaceLayoutPaths({
		cfg: sandboxCfg,
		agentId: resolvedAgentId,
		isolationSubject: sandboxRuntime.isolationSubject,
		rawSessionKey: sessionKey === "global" ? buildAgentMainSessionKey({
			agentId: resolvedAgentId,
			mainKey: normalizeMainKey(cfg.session?.mainKey)
		}) : sessionKey,
		workspaceDir: effectiveAgentWorkspaceDir
	});
	const sandboxWorkdir = getSandboxBackendWorkdirResolver(sandboxCfg.backend)?.({
		sessionKey,
		scopeKey: workspaceLayout.scopeKey,
		workspaceDir: workspaceLayout.workspaceDir,
		agentWorkspaceDir: workspaceLayout.agentWorkspaceDir,
		skillsWorkspaceDir: workspaceLayout.skillsWorkspaceDir,
		cfg: sandboxCfg
	});
	const effectiveHostWorkspaceRoot = sessionIsSandboxed ? workspaceLayout.workspaceDir : workspaceLayout.agentWorkspaceDir;
	const runtimeWorkdir = sessionIsSandboxed ? sandboxWorkdir : directRuntimeCwd;
	const workspaceSource = sessionIsSandboxed ? workspaceLayout.workspaceSource : "direct";
	const usesLocalContainerMounts = sandboxCfg.backend.toLowerCase() === "docker" || sandboxCfg.backend.toLowerCase() === "podman";
	const workspaceMounts = sessionIsSandboxed && usesLocalContainerMounts && sandboxWorkdir ? buildSandboxFsMounts({
		workspaceDir: workspaceLayout.workspaceDir,
		agentWorkspaceDir: workspaceLayout.agentWorkspaceDir,
		skillsWorkspaceDir: workspaceLayout.skillsWorkspaceDir,
		workspaceAccess: sandboxCfg.workspaceAccess,
		containerName: "",
		containerWorkdir: sandboxWorkdir,
		docker: sandboxCfg.docker
	}) : [];
	const channel = resolveActiveChannel({
		cfg,
		entry: sessionEntry,
		sessionKey
	});
	const elevatedGlobal = cfg.tools?.elevated;
	const elevatedAgent = agentConfig?.tools?.elevated;
	const elevatedGlobalEnabled = elevatedGlobal?.enabled !== false;
	const elevatedAgentEnabled = elevatedAgent?.enabled !== false;
	const elevatedEnabled = elevatedGlobalEnabled && elevatedAgentEnabled;
	const globalAllowTokens = normalizeStringifiedEntries(channel ? elevatedGlobal?.allowFrom?.[channel] : void 0);
	const agentAllowTokens = normalizeStringifiedEntries(channel ? elevatedAgent?.allowFrom?.[channel] : void 0);
	const elevatedAllowedByConfig = elevatedEnabled && Boolean(channel) && globalAllowTokens.length > 0 && (elevatedAgent?.allowFrom ? agentAllowTokens.length > 0 : true);
	const elevatedAlwaysAllowedByConfig = elevatedAllowedByConfig && globalAllowTokens.includes("*") && (elevatedAgent?.allowFrom ? agentAllowTokens.includes("*") : true);
	const elevatedFailures = [];
	if (!elevatedGlobalEnabled) elevatedFailures.push({
		gate: "enabled",
		key: "tools.elevated.enabled"
	});
	if (!elevatedAgentEnabled) elevatedFailures.push({
		gate: "enabled",
		key: "agents.entries.*.tools.elevated.enabled"
	});
	if (channel && globalAllowTokens.length === 0) elevatedFailures.push({
		gate: "allowFrom",
		key: `tools.elevated.allowFrom.${channel}`
	});
	if (channel && elevatedAgent?.allowFrom && agentAllowTokens.length === 0) elevatedFailures.push({
		gate: "allowFrom",
		key: `agents.entries.*.tools.elevated.allowFrom.${channel}`
	});
	const fixIt = [];
	if (sandboxCfg.mode !== "off") {
		fixIt.push("agents.defaults.sandbox.mode=off");
		fixIt.push("agents.entries.*.sandbox.mode=off");
	}
	fixIt.push("tools.sandbox.tools.allow");
	fixIt.push("tools.sandbox.tools.alsoAllow");
	fixIt.push("tools.sandbox.tools.deny");
	fixIt.push("agents.entries.*.tools.sandbox.tools.allow");
	fixIt.push("agents.entries.*.tools.sandbox.tools.alsoAllow");
	fixIt.push("agents.entries.*.tools.sandbox.tools.deny");
	fixIt.push("tools.elevated.enabled");
	if (channel) fixIt.push(`tools.elevated.allowFrom.${channel}`);
	const payload = {
		docsUrl: SANDBOX_DOCS_URL,
		agentId: resolvedAgentId,
		sessionKey,
		mainSessionKey,
		sandbox: {
			mode: sandboxCfg.mode,
			scope: sandboxCfg.scope,
			backend: sandboxCfg.backend,
			workspaceAccess: sandboxCfg.workspaceAccess,
			workspaceRoot: sandboxCfg.workspaceRoot,
			effectiveHostWorkspaceRoot,
			runtimeWorkdir,
			workspaceMounts,
			workspaceSource,
			sessionIsSandboxed,
			tools: {
				allow: toolPolicy.allow,
				deny: toolPolicy.deny,
				sources: toolPolicy.sources
			}
		},
		elevated: {
			enabled: elevatedEnabled,
			channel,
			allowedByConfig: elevatedAllowedByConfig,
			alwaysAllowedByConfig: elevatedAlwaysAllowedByConfig,
			allowFrom: {
				global: channel ? globalAllowTokens : void 0,
				agent: elevatedAgent?.allowFrom && channel ? agentAllowTokens : void 0
			},
			failures: elevatedFailures
		},
		fixIt
	};
	if (opts.json) {
		writeRuntimeJson(runtime, payload);
		return;
	}
	const rich = isRich();
	const heading = (value) => colorize(rich, theme.heading, value);
	const key = (value) => colorize(rich, theme.muted, value);
	const value = (val) => colorize(rich, theme.info, val);
	const ok = (val) => colorize(rich, theme.success, val);
	const warn = (val) => colorize(rich, theme.warn, val);
	const err = (val) => colorize(rich, theme.error, val);
	const bool = (flag) => flag ? ok("true") : err("false");
	const lines = [
		heading("Effective sandbox:"),
		`  ${key("agentId:")} ${value(payload.agentId)}`,
		`  ${key("sessionKey:")} ${value(payload.sessionKey)}`,
		`  ${key("mainSessionKey:")} ${value(payload.mainSessionKey)}`,
		`  ${key("runtime:")} ${payload.sandbox.sessionIsSandboxed ? warn("sandboxed") : ok("direct")}`,
		`  ${key("mode:")} ${value(payload.sandbox.mode)} ${key("scope:")} ${value(payload.sandbox.scope)}`,
		`  ${key("workspaceAccess:")} ${value(payload.sandbox.workspaceAccess)} ${key("workspaceRoot:")} ${value(payload.sandbox.workspaceRoot)}`,
		`  ${key("effectiveHostWorkspaceRoot:")} ${value(payload.sandbox.effectiveHostWorkspaceRoot)}`,
		`  ${key("backend:")} ${value(payload.sandbox.backend)} ${key("runtimeWorkdir:")} ${value(payload.sandbox.runtimeWorkdir ?? "(direct host)")} ${key("workspaceSource:")} ${value(payload.sandbox.workspaceSource)}`
	];
	if (payload.sandbox.workspaceMounts.length > 0) {
		lines.push(`  ${key("workspaceMounts:")}`);
		for (const mount of payload.sandbox.workspaceMounts) lines.push(`    - ${value(mount.hostRoot)} -> ${value(mount.containerRoot)} ${key(mount.writable ? "rw" : "ro")} ${key(`(${mount.source})`)}`);
	}
	lines.push("", heading("Sandbox tool policy:"), `  ${key(`allow (${payload.sandbox.tools.sources.allow.source}):`)} ${value(payload.sandbox.tools.allow.join(", ") || "(empty)")}`, `  ${key(`deny  (${payload.sandbox.tools.sources.deny.source}):`)} ${value(payload.sandbox.tools.deny.join(", ") || "(empty)")}`, "", heading("Elevated:"), `  ${key("enabled:")} ${bool(payload.elevated.enabled)}`, `  ${key("channel:")} ${value(payload.elevated.channel ?? "(unknown)")}`, `  ${key("allowedByConfig:")} ${bool(payload.elevated.allowedByConfig)}`);
	if (payload.elevated.failures.length > 0) lines.push(`  ${key("failing gates:")} ${warn(payload.elevated.failures.map((f) => `${f.gate} (${f.key})`).join(", "))}`);
	if (payload.sandbox.mode === "non-main" && payload.sandbox.sessionIsSandboxed) {
		lines.push("");
		lines.push(`${warn("Hint:")} sandbox mode is non-main; use main session key to run direct: ${value(payload.mainSessionKey)}`);
	}
	lines.push("", heading("Fix-it:"));
	for (const keyLocal of payload.fixIt) lines.push(`  - ${keyLocal}`);
	lines.push("", `${key("Docs:")} ${formatDocsLink("/sandbox", "docs.openclaw.ai/sandbox")}`);
	runtime.log(`${lines.join("\n")}\n`);
}
//#endregion
export { sandboxExplainCommand };
