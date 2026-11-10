import { _ as resolvePrimaryStringValue, c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { p as shortenHomePath } from "./utils-gjJ-tD2q.mjs";
import { o as resolveExecutablePath } from "./executable-path-hXcbMo0b.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds, o as tryResolveDefaultAgentId } from "./agent-roster-gkYP38su.mjs";
import { t as loadBundledPluginPublicArtifactModuleFromCandidatesSync } from "./public-surface-loader-Dmwzhxit.mjs";
import { n as resolveModelAgentRuntimeMetadata } from "./agent-runtime-metadata-B5dnCB4A.mjs";
import { a as resolveCliBackendConfig } from "./cli-backends-BzVT3JSM.mjs";
import { t as note } from "./note-CmoIRLec.mjs";
import { t as resolveClaudeCliProjectDirForWorkspace } from "./claude-cli-project-dir-CBLEdn44.mjs";
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
	return [resolvePrimaryStringValue(cfg.agents?.defaults?.model), ...Object.keys(cfg.agents?.defaults?.models ?? {})].some((key) => normalizeOptionalLowercaseString(key)?.startsWith(`${CLAUDE_CLI_PROVIDER}/`));
}
function probeDirectoryHealth(dirPath) {
	try {
		if (!fs.statSync(dirPath).isDirectory()) return "not_directory";
	} catch (error) {
		return hasErrnoCode(error, "ENOENT") ? "missing" : "unreadable";
	}
	for (const mode of [fs.constants.R_OK, fs.constants.W_OK]) try {
		fs.accessSync(dirPath, mode);
	} catch {
		return mode === fs.constants.R_OK ? "unreadable" : "readonly";
	}
	return "present";
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
		const projectDir = resolveClaudeCliProjectDirForWorkspace({ workspaceDir });
		return {
			agentId,
			directories: [[
				workspaceDir,
				probeDirectoryHealth(workspaceDir),
				"workspace"
			], [
				projectDir,
				probeDirectoryHealth(projectDir),
				"Claude project dir"
			]]
		};
	});
}
function noteClaudeCliHealth(cfg, deps) {
	const env = process.env;
	const workspaceTargets = resolveClaudeCliWorkspaceTargets({
		cfg,
		env,
		workspaceDir: deps?.workspaceDir
	});
	if (workspaceTargets.length === 0) return;
	const backend = resolveCliBackendConfig(CLAUDE_CLI_PROVIDER, cfg);
	const command = backend?.config.command ?? "claude";
	const commandOnPath = resolveExecutablePath(command, { env });
	const claudeApi = command === "claude" ? loadBundledPluginPublicArtifactModuleFromCandidatesSync({
		dirName: "anthropic",
		artifactCandidates: ["cli-auth-api.js"]
	}) : null;
	const commandPath = claudeApi ? claudeApi.resolveClaudeTerminalExecutable(env, { pathStrategy: "direct" })?.executable : commandOnPath;
	const authEnv = { ...env };
	for (const envName of backend?.config.clearEnv ?? []) delete authEnv[envName];
	const authenticated = commandPath ? isClaudeCliAuthenticated(commandPath, authEnv) : false;
	const defaultAgentId = tryResolveDefaultAgentId(cfg);
	const showAgentLabels = workspaceTargets.length > 1 || workspaceTargets.some((target) => target.agentId !== defaultAgentId);
	const lines = [];
	const fixHints = [];
	if (!commandPath) {
		lines.push(`- Binary: command "${command}" was not found on PATH.`);
		fixHints.push("- Fix: install Claude CLI on PATH for the gateway user; custom executable paths belong in a CLI backend plugin registration.");
	} else if (!commandOnPath) lines.push(`- Binary: found at ${shortenHomePath(commandPath)} (not on service PATH).`);
	if (commandPath && !authenticated) {
		lines.push("- Claude auth: not logged in.");
		fixHints.push(`- Fix: run ${formatCliCommand("claude auth login")}.`);
	}
	for (const target of workspaceTargets) {
		const agentLabel = showAgentLabels ? target.agentId : void 0;
		for (const [dirPath, health, subject] of target.directories) {
			const workspace = subject === "workspace";
			const label = agentLabel ? `Agent ${agentLabel} ${subject}` : workspace ? "Workspace" : subject;
			const display = shortenHomePath(dirPath);
			if (health === "present" || health === "missing") continue;
			const problem = health === "not_directory" ? "exists but is not a directory." : `is not ${health === "unreadable" ? "readable" : "writable"} by this user.`;
			lines.push(`- ${label}: ${display} ${problem}`);
			if (workspace || health !== "readonly") {
				const targetLabel = agentLabel ? `agent ${agentLabel}'s ${subject}` : `the ${subject}`;
				const remedy = workspace ? "a readable, writable directory for the gateway user." : "readable, or remove the broken path and let Claude recreate it.";
				fixHints.push(`- Fix: make ${targetLabel} ${remedy}`);
			}
		}
	}
	if (lines.length > 0 && workspaceTargets.length > 1) lines.push(`- Agents using Claude CLI: ${workspaceTargets.map((target) => target.agentId).toSorted((a, b) => a.localeCompare(b)).join(", ")}.`);
	if (lines.length === 0) return;
	(deps?.noteFn ?? note)([...lines, ...fixHints].join("\n"), "Claude CLI");
}
//#endregion
export { noteClaudeCliHealth };
