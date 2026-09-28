import { c as normalizeOptionalLowercaseString, f as normalizeStringifiedEntries, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { a as writeRuntimeJson } from "./runtime-BC29JSZp.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { f as resolveConfiguredAgentId, l as resolveAgentWorkspaceDir, r as resolveAgentConfig } from "./agent-scope-config-IQKOEtZ4.mjs";
import { i as normalizeMainKey, n as buildAgentMainSessionKey } from "./session-key-CUi_tcgF.mjs";
import { A as parseAgentSessionKey, l as resolveAgentIdFromSessionKey } from "./session-key-CBvmC8zz.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { _ as resolveSessionAgentId } from "./agent-scope-CTuYDtny.mjs";
import { n as isRich, r as theme, t as colorize } from "./theme-DzaUZY4q.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import { t as formatDocsLink } from "./links-B3qXeqz-.mjs";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-Cd7Eq8Zi.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-X0yNhfFZ.mjs";
import "./registry-BKdVEB34.mjs";
import "./message-channel-DDcHHhpX.mjs";
import { r as resolveAgentMainSessionKey } from "./main-session-De-bcoks.mjs";
import { n as sessionDeliveryChannel } from "./delivery-context.read-CR06zOJ4.mjs";
import { l as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-BTkJgNr-.mjs";
import "./session-accessor-C05KQ5A3.mjs";
import "./sessions-Cesa3L0p.mjs";
import { r as resolveSandboxToolPolicyForAgent } from "./tool-policy-C8ci7WKM.mjs";
import { i as resolveSandboxConfigForAgent } from "./config-B2J3OrFT.mjs";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-GvZUbuy9.mjs";
import { r as resolveSandboxWorkspaceLayoutPaths } from "./shared-ByhrzAKj.mjs";
import { a as getSandboxBackendWorkdirResolver } from "./backend-CGPDIYBL.mjs";
import { t as buildSandboxFsMounts } from "./fs-paths-DFN3paLR.mjs";
import "./sandbox-wz8zRGj4.mjs";
import { r as resolveIngressWorkspaceOverrideForSessionRun } from "./spawned-context-sV3cxQP9.mjs";
//#region src/commands/sandbox-explain.ts
/**
* Sandbox explanation command.
*
* It resolves the effective sandbox/tool/elevated policy for an agent session
* and prints either JSON or a human-readable fix-it report.
*/
const SANDBOX_DOCS_URL = "https://docs.openclaw.ai/sandbox";
function normalizeExplainSessionKey(params) {
	const raw = (params.session ?? "").trim();
	if (!raw) return resolveAgentMainSessionKey({
		cfg: params.cfg,
		agentId: params.agentId
	});
	if (raw.includes(":")) return raw;
	if (raw === "global") return "global";
	return buildAgentMainSessionKey({
		agentId: params.agentId,
		mainKey: normalizeMainKey(raw)
	});
}
function inferProviderFromSessionKey(params) {
	const parsed = parseAgentSessionKey(params.sessionKey);
	if (!parsed) return;
	const rest = parsed.rest.trim();
	if (!rest) return;
	const parts = rest.split(":").filter(Boolean);
	if (parts.length === 0) return;
	const configuredMainKey = normalizeMainKey(params.cfg.session?.mainKey);
	if (parts[0] === configuredMainKey) return;
	const candidate = normalizeOptionalLowercaseString(parts[0]);
	if (!candidate) return;
	if (candidate === "webchat") return INTERNAL_MESSAGE_CHANNEL;
	return normalizeAnyChannelId(candidate) ?? void 0;
}
function resolveActiveChannel(params) {
	const candidate = (sessionDeliveryChannel(params.entry) ?? "").trim();
	const normalizedCandidate = normalizeOptionalLowercaseString(candidate);
	if (!normalizedCandidate) return inferProviderFromSessionKey({
		cfg: params.cfg,
		sessionKey: params.sessionKey
	});
	if (normalizedCandidate === "webchat") return INTERNAL_MESSAGE_CHANNEL;
	const normalized = normalizeAnyChannelId(normalizedCandidate);
	if (normalized) return normalized;
	return inferProviderFromSessionKey({
		cfg: params.cfg,
		sessionKey: params.sessionKey
	});
}
/** Prints the effective sandbox policy for a session or agent. */
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
	const globalAllow = channel ? elevatedGlobal?.allowFrom?.[channel] : void 0;
	const agentAllow = channel ? elevatedAgent?.allowFrom?.[channel] : void 0;
	const allowTokens = (values) => normalizeStringifiedEntries(values);
	const globalAllowTokens = allowTokens(globalAllow);
	const agentAllowTokens = allowTokens(agentAllow);
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
	const lines = [];
	lines.push(heading("Effective sandbox:"));
	lines.push(`  ${key("agentId:")} ${value(payload.agentId)}`);
	lines.push(`  ${key("sessionKey:")} ${value(payload.sessionKey)}`);
	lines.push(`  ${key("mainSessionKey:")} ${value(payload.mainSessionKey)}`);
	lines.push(`  ${key("runtime:")} ${payload.sandbox.sessionIsSandboxed ? warn("sandboxed") : ok("direct")}`);
	lines.push(`  ${key("mode:")} ${value(payload.sandbox.mode)} ${key("scope:")} ${value(payload.sandbox.scope)}`);
	lines.push(`  ${key("workspaceAccess:")} ${value(payload.sandbox.workspaceAccess)} ${key("workspaceRoot:")} ${value(payload.sandbox.workspaceRoot)}`);
	lines.push(`  ${key("effectiveHostWorkspaceRoot:")} ${value(payload.sandbox.effectiveHostWorkspaceRoot)}`);
	lines.push(`  ${key("backend:")} ${value(payload.sandbox.backend)} ${key("runtimeWorkdir:")} ${value(payload.sandbox.runtimeWorkdir ?? "(direct host)")} ${key("workspaceSource:")} ${value(payload.sandbox.workspaceSource)}`);
	if (payload.sandbox.workspaceMounts.length > 0) {
		lines.push(`  ${key("workspaceMounts:")}`);
		for (const mount of payload.sandbox.workspaceMounts) lines.push(`    - ${value(mount.hostRoot)} -> ${value(mount.containerRoot)} ${key(mount.writable ? "rw" : "ro")} ${key(`(${mount.source})`)}`);
	}
	lines.push("");
	lines.push(heading("Sandbox tool policy:"));
	lines.push(`  ${key(`allow (${payload.sandbox.tools.sources.allow.source}):`)} ${value(payload.sandbox.tools.allow.join(", ") || "(empty)")}`);
	lines.push(`  ${key(`deny  (${payload.sandbox.tools.sources.deny.source}):`)} ${value(payload.sandbox.tools.deny.join(", ") || "(empty)")}`);
	lines.push("");
	lines.push(heading("Elevated:"));
	lines.push(`  ${key("enabled:")} ${bool(payload.elevated.enabled)}`);
	lines.push(`  ${key("channel:")} ${value(payload.elevated.channel ?? "(unknown)")}`);
	lines.push(`  ${key("allowedByConfig:")} ${bool(payload.elevated.allowedByConfig)}`);
	if (payload.elevated.failures.length > 0) lines.push(`  ${key("failing gates:")} ${warn(payload.elevated.failures.map((f) => `${f.gate} (${f.key})`).join(", "))}`);
	if (payload.sandbox.mode === "non-main" && payload.sandbox.sessionIsSandboxed) {
		lines.push("");
		lines.push(`${warn("Hint:")} sandbox mode is non-main; use main session key to run direct: ${value(payload.mainSessionKey)}`);
	}
	lines.push("");
	lines.push(heading("Fix-it:"));
	for (const keyLocal of payload.fixIt) lines.push(`  - ${keyLocal}`);
	lines.push("");
	lines.push(`${key("Docs:")} ${formatDocsLink("/sandbox", "docs.openclaw.ai/sandbox")}`);
	runtime.log(`${lines.join("\n")}\n`);
}
//#endregion
export { sandboxExplainCommand };
