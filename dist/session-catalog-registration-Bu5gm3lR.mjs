import { a as createLazyRuntimeSurface, r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { t as CLAUDE_CLI_BACKEND_ID, u as CLAUDE_CLI_ROUTE_PROBE_MODEL_IDS } from "./cli-constants-0f4y8Jm6.mjs";
import { t as resolveClaudeCatalogHomeDir } from "./session-catalog-home-DC4c4SgQ.mjs";
import { t as resolveClaudeTerminalExecutable } from "./session-catalog-executable-BtzrAp2a.mjs";
import { a as CLAUDE_TERMINAL_START_COMMAND, i as CLAUDE_TERMINAL_RESUME_COMMAND, n as CLAUDE_SESSIONS_LIST_COMMAND, r as CLAUDE_SESSION_READ_COMMAND, t as CLAUDE_CLI_NODE_RUN_COMMAND } from "./session-catalog-shared-CiyzxK6Y.mjs";
import { statSync } from "node:fs";
import path from "node:path";
//#region extensions/anthropic/session-catalog-registration.ts
const CLAUDE_SESSIONS_CAPABILITY = "claude-sessions";
const loadClaudeSessionNodeCommands = createLazyRuntimeModule(() => import("./extensions/anthropic/session-catalog-node-commands.js"));
function isClaudeSessionCatalogEnabled(pluginConfig) {
	if (!pluginConfig || typeof pluginConfig !== "object") return true;
	const sessionCatalog = pluginConfig.sessionCatalog;
	return !(sessionCatalog && typeof sessionCatalog === "object" && sessionCatalog.enabled === false);
}
function claudeProjectsAvailable(env) {
	const homeDir = resolveClaudeCatalogHomeDir(env);
	const configDir = env.CLAUDE_CONFIG_DIR?.trim();
	try {
		return statSync(path.join(configDir ? path.resolve(configDir) : path.join(homeDir, ".claude"), "projects")).isDirectory();
	} catch {
		return false;
	}
}
function currentConfig(api) {
	return api.runtime.config?.current?.() ?? api.config ?? {};
}
function registerClaudeSessionCatalog(api) {
	const loadCatalogRuntime = createLazyRuntimeSurface(() => import("./extensions/anthropic/session-catalog.js"), (module) => module.createClaudeSessionCatalogRuntime(api));
	api.registerSessionCatalog({
		id: "claude",
		label: "Claude Code",
		supportsProcessHomeIsolation: true,
		resolveCreateSession: ({ agentId }) => api.runtime.agent.resolveSessionCatalogCreateTarget({
			config: currentConfig(api),
			requestedAgentId: agentId,
			provider: "anthropic",
			modelIds: CLAUDE_CLI_ROUTE_PROBE_MODEL_IDS,
			agentRuntime: CLAUDE_CLI_BACKEND_ID
		}),
		list: async (query) => await (await loadCatalogRuntime()).list(query),
		read: async (request) => await (await loadCatalogRuntime()).read(request),
		continueSession: async (request) => await (await loadCatalogRuntime()).continueSession(request),
		startTerminalSession: async (request) => await (await loadCatalogRuntime()).startTerminalSession(request),
		openTerminal: async (request) => await (await loadCatalogRuntime()).openTerminal(request),
		checkUpstreamActivity: async (probes, policy) => await (await loadCatalogRuntime()).checkUpstreamActivity(probes, policy)
	});
}
function createClaudeSessionNodeHostCommands() {
	return [
		{
			command: CLAUDE_SESSIONS_LIST_COMMAND,
			cap: CLAUDE_SESSIONS_CAPABILITY,
			dangerous: false,
			hasActiveWork: () => false,
			isAvailable: ({ env }) => claudeProjectsAvailable(env),
			handle: async (paramsJSON) => await (await loadClaudeSessionNodeCommands()).listClaudeSessions(paramsJSON)
		},
		{
			command: CLAUDE_SESSION_READ_COMMAND,
			cap: CLAUDE_SESSIONS_CAPABILITY,
			dangerous: false,
			hasActiveWork: () => false,
			isAvailable: ({ env }) => claudeProjectsAvailable(env),
			handle: async (paramsJSON) => await (await loadClaudeSessionNodeCommands()).readClaudeSession(paramsJSON)
		},
		{
			command: CLAUDE_TERMINAL_RESUME_COMMAND,
			cap: CLAUDE_SESSIONS_CAPABILITY,
			dangerous: false,
			duplex: true,
			hasActiveWork: () => false,
			isAvailable: ({ env }) => claudeProjectsAvailable(env) && Boolean(resolveClaudeTerminalExecutable(env)),
			handle: async (paramsJSON, io) => await (await loadClaudeSessionNodeCommands()).resumeClaudeSession(paramsJSON, io)
		},
		{
			command: CLAUDE_TERMINAL_START_COMMAND,
			cap: CLAUDE_SESSIONS_CAPABILITY,
			dangerous: false,
			duplex: true,
			hasActiveWork: () => false,
			isAvailable: ({ env }) => Boolean(resolveClaudeTerminalExecutable(env)),
			handle: async (paramsJSON, io) => await (await loadClaudeSessionNodeCommands()).startClaudeSession(paramsJSON, io)
		}
	];
}
function createClaudeSessionNodeInvokePolicies() {
	return [{
		commands: [
			CLAUDE_SESSIONS_LIST_COMMAND,
			CLAUDE_SESSION_READ_COMMAND,
			CLAUDE_CLI_NODE_RUN_COMMAND,
			CLAUDE_TERMINAL_RESUME_COMMAND,
			CLAUDE_TERMINAL_START_COMMAND
		],
		defaultPlatforms: [
			"macos",
			"linux",
			"windows"
		],
		handle: (context) => {
			if (context.command === "anthropic.claude.terminal.start.v1") return context.client?.scopes?.includes("operator.admin") && context.config.gateway?.cliAgents?.enabled === true && context.config.gateway?.terminal?.enabled !== false ? { ok: true } : {
				ok: false,
				message: "Native terminal start requires operator.admin and enabled CLI agents and terminals"
			};
			return context.command === "anthropic.claude.terminal.resume.v1" ? { ok: true } : context.invokeNode();
		}
	}];
}
function registerClaudeSessionDiscovery(api) {
	if (!isClaudeSessionCatalogEnabled(api.pluginConfig)) return;
	registerClaudeSessionCatalog(api);
	for (const command of createClaudeSessionNodeHostCommands()) api.registerNodeHostCommand(command);
}
//#endregion
export { registerClaudeSessionDiscovery as n, createClaudeSessionNodeInvokePolicies as t };
