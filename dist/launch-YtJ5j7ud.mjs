import { r as resolveEnvironmentValue } from "./process-env-BNjOnVtu.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-CSDERtm3.mjs";
import { _ as resolveDefaultAgentId, f as resolveAgentWorkspaceDir, t as AgentSelectionRequiredError } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { r as resolveSandboxConfigForAgent } from "./config-Bf089UPS.mjs";
import { t as isTerminalConfigEnabled } from "./enabled-BSjeiWpO.mjs";
import { r as buildRemoteCommand } from "./remote-shell-command-BQbVF_NL.mjs";
import { statSync } from "node:fs";
import os from "node:os";
import path from "node:path";
//#region src/gateway/terminal/launch.ts
function resolveTerminalLaunch(params) {
	const env = process.env;
	const requested = params.agentId?.trim();
	let agentId;
	try {
		agentId = requested ? normalizeAgentId(requested) : resolveDefaultAgentId(params.config);
	} catch (error) {
		if (!(error instanceof AgentSelectionRequiredError)) throw error;
		return {
			ok: false,
			block: {
				kind: "owner-required",
				message: error.message
			}
		};
	}
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
	const configuredShell = params.configuredShell?.trim();
	const windows = process.platform === "win32";
	const shell = configuredShell || (windows ? env.ComSpec?.trim() || "cmd.exe" : env.SHELL?.trim() || "/bin/bash");
	return {
		ok: true,
		plan: {
			agentId,
			cwd,
			shell,
			args: configuredShell || windows ? [] : ["-l"]
		}
	};
}
/** Maintains fail-closed terminal admission across deferred config restarts. */
function createTerminalLaunchPolicy(initialConfig) {
	let activeConfig = initialConfig;
	let hasPendingRestart = false;
	let preparedConfig = null;
	let appliedConfigWhileRestartPending = null;
	const createRestrictions = () => ({
		disabled: false,
		blockedAgents: /* @__PURE__ */ new Map()
	});
	const restartRestrictions = createRestrictions();
	const commitRestrictions = createRestrictions();
	const committedTerminalConfig = () => appliedConfigWhileRestartPending ?? activeConfig;
	const resolveForConfig = (config, agentId, shellConfig = config) => resolveTerminalLaunch({
		config,
		agentId,
		configuredShell: shellConfig.gateway?.terminal?.shell
	});
	const accumulateRestrictions = (config, restrictions) => {
		if (!isTerminalConfigEnabled(config)) restrictions.disabled ||= isTerminalConfigEnabled(committedTerminalConfig());
		for (const agentId of listAgentIds(activeConfig)) {
			const candidate = resolveForConfig(config, agentId);
			if (!candidate.ok) restrictions.blockedAgents.set(agentId, candidate.block);
		}
	};
	const clearRestrictions = (restrictions) => {
		restrictions.disabled = false;
		restrictions.blockedAgents.clear();
	};
	const settlePreparedConfig = () => {
		preparedConfig = null;
		clearRestrictions(commitRestrictions);
		if (appliedConfigWhileRestartPending) accumulateRestrictions(appliedConfigWhileRestartPending, commitRestrictions);
	};
	const isEnabled = () => isTerminalConfigEnabled(committedTerminalConfig()) && !restartRestrictions.disabled && !commitRestrictions.disabled && (preparedConfig === null || isTerminalConfigEnabled(preparedConfig));
	return {
		resolve: (agentId) => {
			if (!isEnabled()) return {
				ok: false,
				block: { kind: "disabled" }
			};
			const active = resolveForConfig(activeConfig, agentId, committedTerminalConfig());
			if (!active.ok) return active;
			const block = restartRestrictions.blockedAgents.get(active.plan.agentId) ?? commitRestrictions.blockedAgents.get(active.plan.agentId);
			if (block) return {
				ok: false,
				block
			};
			const candidateConfig = preparedConfig ?? appliedConfigWhileRestartPending;
			if (candidateConfig) {
				const prepared = resolveForConfig(candidateConfig, active.plan.agentId);
				if (!prepared.ok) return prepared;
			}
			return active;
		},
		isEnabled,
		prepareConfig: (config, options) => {
			if (options.restartPending) {
				hasPendingRestart = true;
				preparedConfig = null;
				accumulateRestrictions(config, restartRestrictions);
				return;
			}
			preparedConfig = config;
			accumulateRestrictions(preparedConfig, commitRestrictions);
		},
		commitConfig: () => {
			if (preparedConfig) {
				if (hasPendingRestart) appliedConfigWhileRestartPending = preparedConfig;
				else activeConfig = preparedConfig;
			}
			settlePreparedConfig();
		},
		acceptConfig: (options) => {
			if (options.retireRejectedRestart) {
				hasPendingRestart = false;
				clearRestrictions(restartRestrictions);
				if (appliedConfigWhileRestartPending) activeConfig = appliedConfigWhileRestartPending;
				appliedConfigWhileRestartPending = null;
			}
			settlePreparedConfig();
		}
	};
}
function buildTerminalEnv(baseEnv, platform = process.platform) {
	const env = {};
	for (const [key, value] of Object.entries(baseEnv)) if (typeof value === "string") env[key] = value;
	env.TERM = env.TERM ?? "xterm-256color";
	if (resolveEnvironmentValue(env, "COLORTERM", platform) === void 0) env.COLORTERM = "truecolor";
	env.OPENCLAW_TERMINAL = "1";
	return env;
}
/** Converts a policy-approved plan into the exact local PTY spawn. */
function resolveTerminalSpawnPlan(plan, options = {}) {
	const env = options.env ?? process.env;
	const cwd = existingDirOrHome(plan.cwdOverride ?? plan.cwd, env);
	const command = plan.initialCommand;
	let { shell, args } = plan;
	if (command?.length) {
		if ((options.platform ?? process.platform) === "win32") {
			shell = command[0] ?? shell;
			args = command.slice(1);
		} else args = [
			"-il",
			"-c",
			buildRemoteCommand(command)
		];
	}
	return {
		agentId: plan.agentId,
		shell,
		args,
		cwd
	};
}
function existingDirOrHome(dir, env) {
	const trimmed = dir.trim();
	const home = env.HOME?.trim() || os.homedir();
	if (!trimmed || !path.isAbsolute(trimmed)) return home;
	try {
		if (statSync(trimmed).isDirectory()) return trimmed;
	} catch {}
	return home;
}
//#endregion
export { createTerminalLaunchPolicy as n, resolveTerminalSpawnPlan as r, buildTerminalEnv as t };
