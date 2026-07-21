import { c as normalizeOptionalString, m as resolvePrimaryStringValue, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { _ as shortenHomePath } from "./utils-CRO4LGEB.js";
import "./agent-scope-B2Pk_xhT.js";
import { c as resolveDefaultAgentId, n as listAgentIds, o as resolveAgentWorkspaceDir } from "./agent-scope-config-BxAUeF6t.js";
import { v as resolveExecutablePath } from "./exec-command-resolution-C_2dHW1t.js";
import { u as resolveAuthStorePathForDisplay } from "./runtime-snapshots-CsKLV87K.js";
import { D as CLAUDE_CLI_PROFILE_ID } from "./source-check-CsikPIZO.js";
import { t as readClaudeCliCredentialsCached } from "./cli-credentials-B074Y7I_.js";
import { n as ensureAuthProfileStore } from "./store-9jfx-1KO.js";
import { t as resolveModelAgentRuntimeMetadata } from "./agent-runtime-metadata-CnFuII5J.js";
import { t as note } from "./note-w8AYQ4sA.js";
import { t as resolveClaudeCliProjectDirForWorkspace } from "./claude-cli-project-dir-BiEZcIls.js";
import fs from "node:fs";
//#region src/commands/doctor-claude-cli.ts
/** Doctor health note for Claude CLI binary, auth, and workspace/project directories. */
const CLAUDE_CLI_PROVIDER = "claude-cli";
function usesClaudeCliModelSelection(cfg) {
	if (normalizeOptionalLowercaseString(resolvePrimaryStringValue(cfg.agents?.defaults?.model))?.startsWith(`${CLAUDE_CLI_PROVIDER}/`)) return true;
	return Object.keys(cfg.agents?.defaults?.models ?? {}).some((key) => normalizeOptionalLowercaseString(key)?.startsWith(`${CLAUDE_CLI_PROVIDER}/`));
}
function resolveClaudeCliCommand(cfg) {
	const configured = cfg.agents?.defaults?.cliBackends ?? {};
	for (const [key, entry] of Object.entries(configured)) {
		if (normalizeOptionalLowercaseString(key) !== CLAUDE_CLI_PROVIDER) continue;
		const command = normalizeOptionalString(entry?.command);
		if (command) return command;
	}
	return "claude";
}
function probeDirectoryHealth(dirPath) {
	try {
		if (!fs.statSync(dirPath).isDirectory()) return "not_directory";
	} catch {
		return "missing";
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
function formatCredentialLabel(credential) {
	if (credential.type === "oauth" || credential.type === "token") return credential.type;
	return "unknown";
}
function formatWorkspaceHealthLine(workspaceDir, health, agentId) {
	const label = agentId ? `Agent ${agentId} workspace` : "Workspace";
	const display = shortenHomePath(workspaceDir);
	if (health === "present") return `- ${label}: ${display} (writable).`;
	if (health === "missing") return `- ${label}: ${display} (missing; OpenClaw will create it on first run).`;
	if (health === "not_directory") return `- ${label}: ${display} exists but is not a directory.`;
	if (health === "unreadable") return `- ${label}: ${display} is not readable by this user.`;
	return `- ${label}: ${display} is not writable by this user.`;
}
function formatProjectDirHealthLine(projectDir, health, agentId) {
	const label = agentId ? `Agent ${agentId} Claude project dir` : "Claude project dir";
	const display = shortenHomePath(projectDir);
	if (health === "present") return `- ${label}: ${display} (present).`;
	if (health === "missing") return `- ${label}: ${display} (not created yet; it appears after the first Claude CLI turn in this workspace).`;
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
	if (usesClaudeCliModelSelection(cfg)) return [resolveDefaultAgentId(cfg)];
	return [];
}
function resolveClaudeCliWorkspaceTargets(params) {
	const agentIds = resolveClaudeCliAgentIds(params.cfg);
	const defaultAgentId = resolveDefaultAgentId(params.cfg);
	const seen = /* @__PURE__ */ new Set();
	return agentIds.filter((agentId) => {
		if (seen.has(agentId)) return false;
		seen.add(agentId);
		return true;
	}).map((agentId) => {
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
/**
* Emits Claude CLI health diagnostics for every agent currently routed through the CLI backend.
*
* The optional deps let tests inject auth stores, PATH resolution, and workspace roots without
* touching the user's real Claude credentials or filesystem.
*/
function noteClaudeCliHealth(cfg, deps) {
	const env = deps?.env ?? process.env;
	const workspaceTargets = resolveClaudeCliWorkspaceTargets({
		cfg,
		env,
		homeDir: deps?.homeDir,
		workspaceDir: deps?.workspaceDir
	});
	if (workspaceTargets.length === 0) return;
	const store = deps?.store ?? ensureAuthProfileStore(void 0, { allowKeychainPrompt: false });
	const credential = (deps?.readClaudeCliCredentials ?? (() => readClaudeCliCredentialsCached({ allowKeychainPrompt: false })))();
	const command = resolveClaudeCliCommand(cfg);
	const commandPath = (deps?.resolveCommandPath ?? ((rawCommand, nextEnv) => resolveExecutablePath(rawCommand, { env: nextEnv })))(command, env);
	const authStorePath = resolveAuthStorePathForDisplay();
	const storedProfile = store.profiles[CLAUDE_CLI_PROFILE_ID];
	const defaultAgentId = resolveDefaultAgentId(cfg);
	const showAgentLabels = workspaceTargets.length > 1 || workspaceTargets.some((target) => target.agentId !== defaultAgentId);
	const lines = [];
	const fixHints = [];
	if (commandPath) lines.push(`- Binary: ${shortenHomePath(commandPath)}.`);
	else {
		lines.push(`- Binary: command "${command}" was not found on PATH.`);
		fixHints.push("- Fix: install Claude CLI or set agents.defaults.cliBackends.claude-cli.command to the real binary path.");
	}
	if (credential) lines.push(`- Headless Claude auth: OK (${formatCredentialLabel(credential)}).`);
	else {
		lines.push("- Headless Claude auth: unavailable without interactive prompting.");
		fixHints.push(`- Fix: run ${formatCliCommand("claude auth login")}, then ${formatCliCommand("openclaw models auth login --provider anthropic --method cli --set-default")}.`);
	}
	if (!storedProfile) {
		lines.push(`- OpenClaw auth profile: missing (${CLAUDE_CLI_PROFILE_ID}) in ${authStorePath}.`);
		fixHints.push(`- Fix: run ${formatCliCommand("openclaw models auth login --provider anthropic --method cli --set-default")}.`);
	} else if (storedProfile.provider !== CLAUDE_CLI_PROVIDER) {
		lines.push(`- OpenClaw auth profile: ${CLAUDE_CLI_PROFILE_ID} is wired to provider "${storedProfile.provider}" instead of "${CLAUDE_CLI_PROVIDER}".`);
		fixHints.push(`- Fix: rerun ${formatCliCommand("openclaw models auth login --provider anthropic --method cli --set-default")} to rewrite the profile cleanly.`);
	} else lines.push(`- OpenClaw auth profile: ${CLAUDE_CLI_PROFILE_ID} (provider ${CLAUDE_CLI_PROVIDER}).`);
	for (const target of workspaceTargets) {
		const agentLabel = showAgentLabels ? target.agentId : void 0;
		lines.push(formatWorkspaceHealthLine(target.workspaceDir, target.workspaceHealth, agentLabel));
		if (target.workspaceHealth === "readonly" || target.workspaceHealth === "unreadable" || target.workspaceHealth === "not_directory") fixHints.push(`- Fix: make ${agentLabel ? `agent ${agentLabel}'s workspace` : "the workspace"} a readable, writable directory for the gateway user.`);
		lines.push(formatProjectDirHealthLine(target.projectDir, target.projectDirHealth, agentLabel));
		if (target.projectDirHealth === "unreadable" || target.projectDirHealth === "not_directory") fixHints.push(`- Fix: make ${agentLabel ? `agent ${agentLabel}'s Claude project dir` : "the Claude project dir"} readable, or remove the broken path and let Claude recreate it.`);
	}
	if (workspaceTargets.length > 1) lines.push(`- Agents using Claude CLI: ${workspaceTargets.map((target) => target.agentId).join(", ")}.`);
	if (fixHints.length > 0) lines.push(...fixHints);
	(deps?.noteFn ?? note)(lines.join("\n"), "Claude CLI");
}
//#endregion
export { noteClaudeCliHealth };
