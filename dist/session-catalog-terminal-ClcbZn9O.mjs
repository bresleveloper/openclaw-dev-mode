import { t as resolveClaudeTerminalExecutable } from "./session-catalog-executable-BtzrAp2a.mjs";
import { a as CLAUDE_TERMINAL_START_COMMAND, i as CLAUDE_TERMINAL_RESUME_COMMAND, o as ClaudeCatalogParamsError, s as isResumableClaudeSource } from "./session-catalog-shared-CiyzxK6Y.mjs";
import "./session-catalog-adoption-C3d_naEs.mjs";
import fs from "node:fs/promises";
//#region extensions/anthropic/session-catalog-terminal.ts
function isClaudeCliAvailable(pathEnv = process.env.PATH ?? "") {
	const env = {
		...process.env,
		PATH: pathEnv
	};
	return resolveClaudeTerminalExecutable(env) !== void 0;
}
function claudeNodeTerminalCapability(node) {
	const commands = node.invocableCommands ?? node.commands;
	return {
		canOpenTerminalClaude: node.connected === true && commands?.includes("anthropic.claude.terminal.resume.v1") === true,
		canStartTerminal: node.connected === true && node.invocableCommands?.includes("anthropic.claude.terminal.start.v1") === true
	};
}
function isLocalClaudeResumable(host, source) {
	return host.hostId === "gateway:local" && isResumableClaudeSource(source);
}
function canOpenClaudeTerminalSession(host, source, localCliAvailable) {
	return isResumableClaudeSource(source) && (host.hostId === "gateway:local" && localCliAvailable || host.canOpenTerminalClaude === true);
}
function terminalEligibility(host, source, localCliAvailable) {
	return {
		localResumable: isLocalClaudeResumable(host, source),
		canOpenTerminal: canOpenClaudeTerminalSession(host, source, localCliAvailable)
	};
}
async function startClaudeCatalogTerminal(params) {
	if (params.nodeId) return {
		kind: "node",
		nodeId: params.nodeId,
		command: CLAUDE_TERMINAL_START_COMMAND,
		uploadPathStyle: "native",
		paramsJSON: JSON.stringify({
			cwd: params.cwd,
			initialMessage: params.initialMessage
		}),
		cwd: params.cwd,
		title: "claude"
	};
	const resolution = resolveClaudeTerminalExecutable();
	if (!resolution) throw new ClaudeCatalogParamsError("Claude CLI is unavailable; install Claude Code or add claude to PATH, then restart the gateway");
	return {
		kind: "local",
		argv: [resolution.executable, ...params.initialMessage !== void 0 ? ["--", params.initialMessage] : []],
		cwd: params.cwd,
		...resolution.pathEnv ? { pathEnv: resolution.pathEnv } : {},
		title: "claude"
	};
}
async function openClaudeCatalogTerminal(params) {
	const title = `claude --resume ${params.threadId.slice(0, 8)}…`;
	if (params.hostId === "gateway:local") {
		const record = (await params.listClaudeSessions()).find((candidate) => candidate.threadId === params.threadId);
		if (!record || !isResumableClaudeSource(record.source)) throw new ClaudeCatalogParamsError("Claude session is unavailable");
		if (!(await fs.stat(record.filePath).catch(() => void 0))?.isFile()) throw new ClaudeCatalogParamsError("Claude session transcript is unavailable");
		const resolution = resolveClaudeTerminalExecutable();
		if (!resolution) throw new ClaudeCatalogParamsError("Claude CLI is unavailable");
		return {
			kind: "local",
			argv: [
				resolution.executable,
				"--resume",
				params.threadId
			],
			...record.cwd ? { cwd: record.cwd } : {},
			...resolution.pathEnv ? { pathEnv: resolution.pathEnv } : {},
			title
		};
	}
	if (!params.hostId.startsWith("node:")) throw new ClaudeCatalogParamsError("hostId is invalid");
	const nodeId = params.hostId.slice(5);
	if (!(await params.api.runtime.nodes.list()).nodes.find((candidate) => {
		const commands = candidate.invocableCommands ?? candidate.commands;
		return candidate.nodeId === nodeId && candidate.connected === true && commands?.includes("anthropic.claude.sessions.list.v1") === true && commands.includes("anthropic.claude.terminal.resume.v1");
	})) throw new ClaudeCatalogParamsError("paired-node Claude terminal is unavailable");
	const record = await params.resolveNodeClaudeRecord({
		runtime: params.api.runtime,
		nodeId,
		threadId: params.threadId
	});
	if (!isResumableClaudeSource(record.source)) throw new ClaudeCatalogParamsError("Claude session cannot be resumed in a terminal");
	return {
		kind: "node",
		nodeId,
		command: CLAUDE_TERMINAL_RESUME_COMMAND,
		uploadPathStyle: "native",
		paramsJSON: JSON.stringify({ threadId: params.threadId }),
		...record.cwd ? { cwd: record.cwd } : {},
		title
	};
}
//#endregion
export { terminalEligibility as a, startClaudeCatalogTerminal as i, isClaudeCliAvailable as n, openClaudeCatalogTerminal as r, claudeNodeTerminalCapability as t };
