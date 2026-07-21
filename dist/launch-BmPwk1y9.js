import { u as normalizeAgentId } from "./session-key-VWT_xzM9.js";
import { c as resolveDefaultAgentId, n as listAgentIds, o as resolveAgentWorkspaceDir } from "./agent-scope-config-BxAUeF6t.js";
import { i as resolveSandboxConfigForAgent } from "./config-Dy4vED5-.js";
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import os from "node:os";
//#region src/gateway/terminal/launch.ts
/** Picks the interactive shell: explicit config, then the host login shell. */
function resolveTerminalShell(params) {
	const configured = params.configuredShell?.trim();
	if (configured) return {
		shell: configured,
		args: []
	};
	const platform = params.platform ?? process.platform;
	const env = params.env ?? process.env;
	if (platform === "win32") return {
		shell: env.ComSpec?.trim() || "cmd.exe",
		args: []
	};
	const loginShell = env.SHELL?.trim();
	if (loginShell) return {
		shell: loginShell,
		args: ["-l"]
	};
	return {
		shell: "/bin/bash",
		args: ["-l"]
	};
}
/**
* Resolves the terminal launch plan for one agent.
*
* The terminal always starts in the agent workspace. When the agent runs fully
* sandboxed (`sandbox.mode: "all"`), a host shell would escape the isolation the
* agent itself is under, so this returns a `sandboxed` block rather than silently
* handing back an unconfined shell — fail-closed. `"non-main"` keeps the agent's
* main session on the host, so a host terminal is allowed there.
*/
function resolveTerminalLaunch(params) {
	if (!params.enabled) return {
		ok: false,
		block: { kind: "disabled" }
	};
	const env = params.env ?? process.env;
	const requested = params.agentId?.trim();
	const agentId = requested ? normalizeAgentId(requested) : resolveDefaultAgentId(params.config);
	if (requested && !listAgentIds(params.config).includes(agentId)) return {
		ok: false,
		block: {
			kind: "unknown-agent",
			agentId
		}
	};
	if (resolveSandboxConfigForAgent(params.config, agentId).mode === "all") return {
		ok: false,
		block: {
			kind: "sandboxed",
			agentId,
			mode: "all"
		}
	};
	const cwd = existingDirOrHome(resolveAgentWorkspaceDir(params.config, agentId, env), env);
	const { shell, args } = resolveTerminalShell({
		configuredShell: params.configuredShell,
		platform: params.platform,
		env
	});
	return {
		ok: true,
		plan: {
			agentId,
			cwd,
			shell,
			args
		}
	};
}
/** Maintains fail-closed terminal admission across deferred config restarts. */
function createTerminalLaunchPolicy(initialConfig) {
	let activeConfig = initialConfig;
	let hasPendingRestart = false;
	let terminalDisabledUntilRestart = false;
	let preparedConfig = null;
	let terminalDisabledUntilCommit = false;
	const blockedAgentsUntilRestart = /* @__PURE__ */ new Map();
	const blockedAgentsUntilCommit = /* @__PURE__ */ new Map();
	const preserveTerminalConfig = (config, owner) => {
		const { terminal: _ignored, ...gateway } = config.gateway ?? {};
		const terminal = owner.gateway?.terminal;
		return {
			...config,
			gateway: {
				...gateway,
				...terminal === void 0 ? {} : { terminal }
			}
		};
	};
	const resolveForConfig = (config, agentId) => {
		const terminalConfig = config.gateway?.terminal;
		return resolveTerminalLaunch({
			config,
			enabled: terminalConfig?.enabled === true,
			agentId,
			configuredShell: terminalConfig?.shell
		});
	};
	const accumulateRestartRestrictions = (config) => {
		if (config.gateway?.terminal?.enabled !== true) {
			terminalDisabledUntilRestart = true;
			return;
		}
		const activeAgentIds = /* @__PURE__ */ new Set([...listAgentIds(activeConfig), resolveDefaultAgentId(activeConfig)]);
		for (const agentId of activeAgentIds) {
			const candidate = resolveForConfig(config, agentId);
			if (!candidate.ok) blockedAgentsUntilRestart.set(agentId, candidate.block);
		}
	};
	const accumulateCommitRestrictions = (config) => {
		if (config.gateway?.terminal?.enabled !== true) {
			terminalDisabledUntilCommit = true;
			return;
		}
		const activeAgentIds = /* @__PURE__ */ new Set([...listAgentIds(activeConfig), resolveDefaultAgentId(activeConfig)]);
		for (const agentId of activeAgentIds) {
			const candidate = resolveForConfig(config, agentId);
			if (!candidate.ok) blockedAgentsUntilCommit.set(agentId, candidate.block);
		}
	};
	return {
		resolve: (agentId) => {
			const active = resolveForConfig(activeConfig, agentId);
			if (!active.ok) return active;
			if (terminalDisabledUntilRestart) return {
				ok: false,
				block: { kind: "disabled" }
			};
			const pendingBlock = blockedAgentsUntilRestart.get(active.plan.agentId);
			if (pendingBlock) return {
				ok: false,
				block: pendingBlock
			};
			const preparedBlock = blockedAgentsUntilCommit.get(active.plan.agentId);
			if (preparedBlock) return {
				ok: false,
				block: preparedBlock
			};
			if (preparedConfig) {
				const prepared = resolveForConfig(preparedConfig, active.plan.agentId);
				if (!prepared.ok) return prepared;
			}
			return active;
		},
		isEnabled: () => activeConfig.gateway?.terminal?.enabled === true && !terminalDisabledUntilRestart && !terminalDisabledUntilCommit && (preparedConfig === null || preparedConfig.gateway?.terminal?.enabled === true),
		prepareConfig: (config, options) => {
			if (options.restartPending) {
				hasPendingRestart = true;
				terminalDisabledUntilRestart ||= terminalDisabledUntilCommit;
				for (const [agentId, block] of blockedAgentsUntilCommit) blockedAgentsUntilRestart.set(agentId, block);
				terminalDisabledUntilCommit = false;
				blockedAgentsUntilCommit.clear();
				preparedConfig = null;
				accumulateRestartRestrictions(config);
				return;
			}
			if (hasPendingRestart) {
				accumulateRestartRestrictions(config);
				return;
			}
			preparedConfig = preserveTerminalConfig(config, activeConfig);
			accumulateCommitRestrictions(preparedConfig);
		},
		commitConfig: () => {
			if (preparedConfig && !hasPendingRestart) activeConfig = preparedConfig;
			preparedConfig = null;
			terminalDisabledUntilCommit = false;
			blockedAgentsUntilCommit.clear();
		}
	};
}
/** Builds the child environment for a host terminal from the gateway env. */
function buildTerminalEnv(baseEnv) {
	const env = {};
	for (const [key, value] of Object.entries(baseEnv)) if (typeof value === "string") env[key] = value;
	env.TERM = env.TERM ?? "xterm-256color";
	env.OPENCLAW_TERMINAL = "1";
	return env;
}
function existingDirOrHome(dir, env) {
	const trimmed = dir.trim();
	const home = env.HOME?.trim() || os.homedir();
	if (!trimmed || !path.isAbsolute(trimmed)) return home;
	try {
		if (existsSync(trimmed) && statSync(trimmed).isDirectory()) return trimmed;
	} catch {}
	return home;
}
//#endregion
export { resolveTerminalShell as i, createTerminalLaunchPolicy as n, resolveTerminalLaunch as r, buildTerminalEnv as t };
