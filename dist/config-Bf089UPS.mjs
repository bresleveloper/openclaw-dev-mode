import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { F as resolveTimerTimeoutMs } from "./number-coercion-CkhMiRw8.mjs";
import { f as normalizeSecretInputString } from "./types.secrets-Dgbd2kyP.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-fjA2T9Gz.mjs";
import { n as resolveSandboxScope, t as resolveSandboxDockerEnv } from "./config-contract-CgxcWtCc.mjs";
import "./browser-network-BG6jdrVm.mjs";
import { p as DEFAULT_SANDBOX_WORKSPACE_ROOT, t as DEFAULT_SANDBOX_BROWSER_AUTOSTART_TIMEOUT_MS } from "./constants-Cg33NnpI.mjs";
import { r as resolveSandboxToolPolicyForAgent } from "./tool-policy-CGPJHOz_.mjs";
//#region src/agents/sandbox/config.ts
const DANGEROUS_SANDBOX_DOCKER_BOOLEAN_KEYS = [
	"dangerouslyAllowReservedContainerTargets",
	"dangerouslyAllowExternalBindSources",
	"dangerouslyAllowContainerNamespaceJoin"
];
const DEFAULT_SANDBOX_SSH_COMMAND = "ssh";
const DEFAULT_SANDBOX_SSH_WORKSPACE_ROOT = "/tmp/openclaw-sandboxes";
function resolveDangerousSandboxDockerBooleans(agentDocker, globalDocker) {
	const resolved = {};
	for (const key of DANGEROUS_SANDBOX_DOCKER_BOOLEAN_KEYS) resolved[key] = agentDocker?.[key] ?? globalDocker?.[key];
	return resolved;
}
function resolveSandboxBrowserDockerCreateConfig(params) {
	const browserNetwork = params.browser.network.trim();
	const base = {
		...params.docker,
		network: browserNetwork || "openclaw-sandbox-browser",
		image: params.browser.image
	};
	return params.browser.binds !== void 0 ? {
		...base,
		binds: params.browser.binds
	} : base;
}
function resolveSandboxDockerConfig(scope, globalDocker, agentDocker) {
	const env = resolveSandboxDockerEnv({
		scope,
		globalEnv: globalDocker?.env,
		agentEnv: agentDocker?.env
	});
	const ulimits = agentDocker?.ulimits ? {
		...globalDocker?.ulimits,
		...agentDocker.ulimits
	} : globalDocker?.ulimits;
	const binds = [...globalDocker?.binds ?? [], ...agentDocker?.binds ?? []];
	return {
		image: agentDocker?.image ?? globalDocker?.image ?? "openclaw-sandbox:bookworm-slim",
		containerPrefix: agentDocker?.containerPrefix ?? globalDocker?.containerPrefix ?? "openclaw-sbx-",
		workdir: agentDocker?.workdir ?? globalDocker?.workdir ?? "/workspace",
		readOnlyRoot: agentDocker?.readOnlyRoot ?? globalDocker?.readOnlyRoot ?? true,
		tmpfs: agentDocker?.tmpfs ?? globalDocker?.tmpfs ?? [
			"/tmp",
			"/var/tmp",
			"/run"
		],
		network: agentDocker?.network ?? globalDocker?.network ?? "none",
		user: agentDocker?.user ?? globalDocker?.user,
		capDrop: agentDocker?.capDrop ?? globalDocker?.capDrop ?? ["ALL"],
		env,
		setupCommand: agentDocker?.setupCommand ?? globalDocker?.setupCommand,
		pidsLimit: agentDocker?.pidsLimit ?? globalDocker?.pidsLimit,
		memory: agentDocker?.memory ?? globalDocker?.memory,
		memorySwap: agentDocker?.memorySwap ?? globalDocker?.memorySwap,
		cpus: agentDocker?.cpus ?? globalDocker?.cpus,
		gpus: normalizeOptionalString(agentDocker?.gpus ?? globalDocker?.gpus),
		ulimits,
		seccompProfile: agentDocker?.seccompProfile ?? globalDocker?.seccompProfile,
		apparmorProfile: agentDocker?.apparmorProfile ?? globalDocker?.apparmorProfile,
		dns: agentDocker?.dns ?? globalDocker?.dns,
		extraHosts: agentDocker?.extraHosts ?? globalDocker?.extraHosts,
		binds: binds.length ? binds : void 0,
		...resolveDangerousSandboxDockerBooleans(agentDocker, globalDocker)
	};
}
function resolveSandboxBrowserConfig(globalBrowser, agentBrowser) {
	const binds = [...globalBrowser?.binds ?? [], ...agentBrowser?.binds ?? []];
	const bindsConfigured = globalBrowser?.binds !== void 0 || agentBrowser?.binds !== void 0;
	return {
		enabled: agentBrowser?.enabled ?? globalBrowser?.enabled ?? false,
		image: agentBrowser?.image ?? globalBrowser?.image ?? "openclaw-sandbox-browser:bookworm-slim",
		containerPrefix: agentBrowser?.containerPrefix ?? globalBrowser?.containerPrefix ?? "openclaw-sbx-browser-",
		network: agentBrowser?.network ?? globalBrowser?.network ?? "openclaw-sandbox-browser",
		cdpPort: agentBrowser?.cdpPort ?? globalBrowser?.cdpPort ?? 9222,
		cdpSourceRange: agentBrowser?.cdpSourceRange ?? globalBrowser?.cdpSourceRange,
		vncPort: agentBrowser?.vncPort ?? globalBrowser?.vncPort ?? 5900,
		noVncPort: agentBrowser?.noVncPort ?? globalBrowser?.noVncPort ?? 6080,
		headless: agentBrowser?.headless ?? globalBrowser?.headless ?? false,
		noVncEnabled: agentBrowser?.noVncEnabled ?? globalBrowser?.noVncEnabled ?? true,
		allowHostControl: agentBrowser?.allowHostControl ?? globalBrowser?.allowHostControl ?? false,
		autoStart: agentBrowser?.autoStart ?? globalBrowser?.autoStart ?? true,
		autoStartTimeoutMs: resolveTimerTimeoutMs(agentBrowser?.autoStartTimeoutMs ?? globalBrowser?.autoStartTimeoutMs, DEFAULT_SANDBOX_BROWSER_AUTOSTART_TIMEOUT_MS),
		binds: bindsConfigured ? binds : void 0
	};
}
function resolveSandboxPruneConfig(globalPrune, agentPrune) {
	return {
		idleHours: agentPrune?.idleHours ?? globalPrune?.idleHours ?? 24,
		maxAgeDays: agentPrune?.maxAgeDays ?? globalPrune?.maxAgeDays ?? 7
	};
}
function normalizeRemoteRoot(value, fallback) {
	const normalized = normalizeOptionalString(value) ?? fallback;
	const posix = normalized.replaceAll("\\", "/");
	if (!posix.startsWith("/")) throw new Error(`Sandbox SSH workspaceRoot must be an absolute POSIX path: ${normalized}`);
	return posix.replace(/\/+$/g, "") || "/";
}
function resolveSandboxSshConfig(globalSsh, agentSsh) {
	return {
		target: normalizeOptionalString(agentSsh?.target ?? globalSsh?.target),
		command: normalizeOptionalString(agentSsh?.command ?? globalSsh?.command) ?? DEFAULT_SANDBOX_SSH_COMMAND,
		workspaceRoot: normalizeRemoteRoot(agentSsh?.workspaceRoot ?? globalSsh?.workspaceRoot, DEFAULT_SANDBOX_SSH_WORKSPACE_ROOT),
		strictHostKeyChecking: agentSsh?.strictHostKeyChecking ?? globalSsh?.strictHostKeyChecking ?? true,
		updateHostKeys: agentSsh?.updateHostKeys ?? globalSsh?.updateHostKeys ?? true,
		identityFile: normalizeOptionalString(agentSsh?.identityFile ?? globalSsh?.identityFile),
		certificateFile: normalizeOptionalString(agentSsh?.certificateFile ?? globalSsh?.certificateFile),
		knownHostsFile: normalizeOptionalString(agentSsh?.knownHostsFile ?? globalSsh?.knownHostsFile),
		identityData: normalizeSecretInputString(agentSsh?.identityData ?? globalSsh?.identityData),
		certificateData: normalizeSecretInputString(agentSsh?.certificateData ?? globalSsh?.certificateData),
		knownHostsData: normalizeSecretInputString(agentSsh?.knownHostsData ?? globalSsh?.knownHostsData)
	};
}
function resolveSandboxConfigForAgent(cfg, agentId) {
	const agent = cfg?.agents?.defaults?.sandbox;
	const agentSandbox = (cfg && agentId ? resolveAgentConfig(cfg, agentId) : void 0)?.sandbox;
	const scope = resolveSandboxScope({ scope: agentSandbox?.scope ?? agent?.scope });
	const { sources: _toolPolicySources, ...toolPolicy } = resolveSandboxToolPolicyForAgent(cfg, agentId);
	const scopedAgentSandbox = scope === "shared" ? void 0 : agentSandbox;
	return {
		mode: agentSandbox?.mode ?? agent?.mode ?? "off",
		backend: agentSandbox?.backend?.trim() || agent?.backend?.trim() || "docker",
		scope,
		workspaceAccess: agentSandbox?.workspaceAccess ?? agent?.workspaceAccess ?? "none",
		workspaceRoot: agentSandbox?.workspaceRoot ?? agent?.workspaceRoot ?? DEFAULT_SANDBOX_WORKSPACE_ROOT,
		dockerTmpfsSource: scopedAgentSandbox?.docker?.tmpfs === void 0 && agent?.docker?.tmpfs === void 0 ? "default" : "configured",
		docker: resolveSandboxDockerConfig(scope, agent?.docker, scopedAgentSandbox?.docker),
		ssh: resolveSandboxSshConfig(agent?.ssh, scopedAgentSandbox?.ssh),
		browser: resolveSandboxBrowserConfig(agent?.browser, scopedAgentSandbox?.browser),
		tools: toolPolicy,
		prune: resolveSandboxPruneConfig(agent?.prune, scopedAgentSandbox?.prune)
	};
}
//#endregion
export { resolveSandboxBrowserDockerCreateConfig as n, resolveSandboxConfigForAgent as r, DANGEROUS_SANDBOX_DOCKER_BOOLEAN_KEYS as t };
