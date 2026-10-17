import { _ as resolvePrimaryStringValue, c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { p as shortenHomePath } from "./utils-DgZn2dLu.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { o as resolveExecutablePath } from "./executable-path-CP2HPhgU.mjs";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { i as listAgentIds, o as tryResolveDefaultAgentId } from "./agent-roster-BXD1uMJD.mjs";
import { a as resolveCliBackendConfig } from "./cli-backends-CRE_cwP5.mjs";
import { t as note } from "./note-Byxgt4MB.mjs";
import { n as resolveModelAgentRuntimeMetadata } from "./agent-runtime-metadata-BYpiZnNd.mjs";
import { t as resolveClaudeCliProjectDirForWorkspace } from "./claude-cli-project-dir-Bt7WyCjA.mjs";
import fs from "node:fs";
import { spawnSync } from "node:child_process";
//#region src/commands/doctor-claude-cli.ts
const CLAUDE_CLI_PROVIDER = "claude-cli";
function isClaudeCliAuthenticated(commandPath, env) {
	const result = spawnSync(commandPath, [
		"auth",
		"status",
		"--json"
	], {
		encoding: "utf8",
		env,
		maxBuffer: 65536,
		timeout: 3e3,
		windowsHide: true
	});
	if (result.error || result.status !== 0) return false;
	try {
		const parsed = JSON.parse(result.stdout);
		return isRecord(parsed) && parsed.loggedIn === true;
	} catch {
		return false;
	}
}
function usesClaudeCliModelSelection(cfg) {
	const primary = resolvePrimaryStringValue(cfg.agents?.defaults?.model);
	if (normalizeOptionalLowercaseString(primary)?.startsWith(`${CLAUDE_CLI_PROVIDER}/`)) return true;
	return Object.keys(cfg.agents?.defaults?.models ?? {}).some((key) => normalizeOptionalLowercaseString(key)?.startsWith(`${CLAUDE_CLI_PROVIDER}/`));
}
function probeDirectoryHealth(dirPath) {
	try {
		if (!fs.statSync(dirPath).isDirectory()) return "not_directory";
	} catch (error) {
		return hasErrnoCode(error, "ENOENT") ? "missing" : "unreadable";
	}
	try {
		fs.accessSync(dirPath, fs.constants.R_OK);
	} catch {
		return "unreadable";
	}
	try {
		fs.accessSync(dirPath, fs.constants.W_OK);
	} catch {
		return "readonly";
	}
	return "present";
}
function formatDirectoryProblemLine(dirPath, health, label) {
	const display = shortenHomePath(dirPath);
	if (health === "present" || health === "missing") return null;
	if (health === "not_directory") return `- ${label}: ${display} exists but is not a directory.`;
	if (health === "unreadable") return `- ${label}: ${display} is not readable by this user.`;
	return `- ${label}: ${display} is not writable by this user.`;
}
function resolveClaudeCliAgentIds(cfg) {
	const runtimeAgentIds = listAgentIds(cfg).filter((agentId) => resolveModelAgentRuntimeMetadata({
		cfg,
		agentId
	}).id === CLAUDE_CLI_PROVIDER);
	if (runtimeAgentIds.length > 0) return runtimeAgentIds;
	if (usesClaudeCliModelSelection(cfg)) {
		const defaultAgentId = tryResolveDefaultAgentId(cfg);
		return defaultAgentId ? [defaultAgentId] : [];
	}
	return [];
}
function resolveClaudeCliWorkspaceTargets(params) {
	const agentIds = resolveClaudeCliAgentIds(params.cfg);
	const defaultAgentId = tryResolveDefaultAgentId(params.cfg);
	return agentIds.map((agentId) => {
		const workspaceDir = params.workspaceDir && agentIds.length === 1 && agentId === defaultAgentId ? params.workspaceDir : resolveAgentWorkspaceDir(params.cfg, agentId, params.env);
		const projectDir = resolveClaudeCliProjectDirForWorkspace({
			workspaceDir,
			homeDir: params.homeDir
		});
		return {
			agentId,
			workspaceDir,
			projectDir,
			workspaceHealth: probeDirectoryHealth(workspaceDir),
			projectDirHealth: probeDirectoryHealth(projectDir)
		};
	});
}
function noteClaudeCliHealth(cfg, deps) {
	const env = deps?.env ?? process.env;
	const workspaceTargets = resolveClaudeCliWorkspaceTargets({
		cfg,
		env,
		homeDir: deps?.homeDir,
		workspaceDir: deps?.workspaceDir
	});
	if (workspaceTargets.length === 0) return;
	const backend = resolveCliBackendConfig(CLAUDE_CLI_PROVIDER, cfg);
	const command = backend?.config.command ?? "claude";
	const commandPath = (deps?.resolveCommandPath ?? ((rawCommand, nextEnv) => resolveExecutablePath(rawCommand, { env: nextEnv })))(command, env);
	const authEnv = { ...env };
	for (const envName of backend?.config.clearEnv ?? []) delete authEnv[envName];
	const authenticated = commandPath ? (deps?.isAuthenticated ?? isClaudeCliAuthenticated)(commandPath, authEnv) : false;
	const defaultAgentId = tryResolveDefaultAgentId(cfg);
	const showAgentLabels = workspaceTargets.length > 1 || workspaceTargets.some((target) => target.agentId !== defaultAgentId);
	const lines = [];
	const fixHints = [];
	if (!commandPath) {
		lines.push(`- Binary: command "${command}" was not found on PATH.`);
		fixHints.push("- Fix: install Claude CLI on PATH for the gateway user; custom executable paths belong in a CLI backend plugin registration.");
	}
	if (commandPath && !authenticated) {
		lines.push("- Claude auth: not logged in.");
		fixHints.push(`- Fix: run ${formatCliCommand("claude auth login")}.`);
	}
	for (const target of workspaceTargets) {
		const agentLabel = showAgentLabels ? target.agentId : void 0;
		const workspaceProblem = formatDirectoryProblemLine(target.workspaceDir, target.workspaceHealth, agentLabel ? `Agent ${agentLabel} workspace` : "Workspace");
		if (workspaceProblem) lines.push(workspaceProblem);
		if (target.workspaceHealth === "readonly" || target.workspaceHealth === "unreadable" || target.workspaceHealth === "not_directory") fixHints.push(`- Fix: make ${agentLabel ? `agent ${agentLabel}'s workspace` : "the workspace"} a readable, writable directory for the gateway user.`);
		const projectDirProblem = formatDirectoryProblemLine(target.projectDir, target.projectDirHealth, agentLabel ? `Agent ${agentLabel} Claude project dir` : "Claude project dir");
		if (projectDirProblem) lines.push(projectDirProblem);
		if (target.projectDirHealth === "unreadable" || target.projectDirHealth === "not_directory") fixHints.push(`- Fix: make ${agentLabel ? `agent ${agentLabel}'s Claude project dir` : "the Claude project dir"} readable, or remove the broken path and let Claude recreate it.`);
	}
	if (lines.length > 0 && workspaceTargets.length > 1) lines.push(`- Agents using Claude CLI: ${workspaceTargets.map((target) => target.agentId).toSorted((a, b) => a.localeCompare(b)).join(", ")}.`);
	if (lines.length === 0 && fixHints.length === 0) return;
	if (fixHints.length > 0) lines.push(...fixHints);
	(deps?.noteFn ?? note)(lines.join("\n"), "Claude CLI");
}
//#endregion
export { noteClaudeCliHealth };
