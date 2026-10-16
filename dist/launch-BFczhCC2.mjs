import { r as resolveEnvironmentValue } from "./process-env-DlZFJzq6.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { d as resolveAgentWorkspaceDir, g as resolveDefaultAgentId, t as AgentSelectionRequiredError } from "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import { i as resolveSandboxConfigForAgent } from "./config-DGIfx80_.mjs";
import { t as isTerminalConfigEnabled } from "./enabled-BSjeiWpO.mjs";
import { statSync } from "node:fs";
import path from "node:path";
import os from "node:os";
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
	const resolveForConfig = (config, agentId, shellConfig = config) => {
		return resolveTerminalLaunch({
			config,
			agentId,
			configuredShell: shellConfig.gateway?.terminal?.shell
		});
	};
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
	const isEnabled = () => isTerminalConfigEnabled(committedTerminalConfig()) && !restartRestrictions.disabled && !commitRestrictions.disabled && (preparedConfig === null || isTerminalConfigEnabled(preparedConfig));
	return {
		resolve: (agentId) => {
			if (!isEnabled()) return {
				ok: false,
				block: { kind: "disabled" }
			};
			const active = resolveForConfig(activeConfig, agentId, committedTerminalConfig());
			if (!active.ok) return active;
			const pendingBlock = restartRestrictions.blockedAgents.get(active.plan.agentId);
			if (pendingBlock) return {
				ok: false,
				block: pendingBlock
			};
			const preparedBlock = commitRestrictions.blockedAgents.get(active.plan.agentId);
			if (preparedBlock) return {
				ok: false,
				block: preparedBlock
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
			if (hasPendingRestart) {
				if (preparedConfig) appliedConfigWhileRestartPending = preparedConfig;
				preparedConfig = null;
				clearRestrictions(commitRestrictions);
				if (appliedConfigWhileRestartPending) accumulateRestrictions(appliedConfigWhileRestartPending, commitRestrictions);
				return;
			}
			if (preparedConfig) activeConfig = preparedConfig;
			preparedConfig = null;
			clearRestrictions(commitRestrictions);
		},
		acceptConfig: (options) => {
			preparedConfig = null;
			clearRestrictions(commitRestrictions);
			if (options.retireRejectedRestart) {
				hasPendingRestart = false;
				clearRestrictions(restartRestrictions);
				if (appliedConfigWhileRestartPending) activeConfig = appliedConfigWhileRestartPending;
				appliedConfigWhileRestartPending = null;
				return;
			}
			if (appliedConfigWhileRestartPending) accumulateRestrictions(appliedConfigWhileRestartPending, commitRestrictions);
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
function shellQuote(value) {
	return `'${value.replaceAll("'", `'"'"'`)}'`;
}
/** Converts a policy-approved plan into the exact local PTY spawn. */
function resolveTerminalSpawnPlan(plan, options = {}) {
	const env = options.env ?? process.env;
	const cwd = existingDirOrHome(plan.cwdOverride ?? plan.cwd, env);
	const command = plan.initialCommand;
	if (!command || command.length === 0) return {
		agentId: plan.agentId,
		shell: plan.shell,
		args: plan.args,
		cwd
	};
	if ((options.platform ?? process.platform) === "win32") return {
		agentId: plan.agentId,
		shell: command[0] ?? plan.shell,
		args: command.slice(1),
		cwd
	};
	return {
		agentId: plan.agentId,
		shell: plan.shell,
		args: [
			"-il",
			"-c",
			command.map(shellQuote).join(" ")
		],
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
