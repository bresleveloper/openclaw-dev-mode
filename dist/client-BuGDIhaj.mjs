import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as signalProcessTree, t as killProcessTree } from "./kill-tree-BGQdx374.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { r as isKnownCoreToolId } from "./tool-catalog-CLTpLFor.mjs";
import { n as readTrimmedStringAlias } from "./string-readers-Dkx3Z36w.mjs";
import { a as omitEnvKeysCaseInsensitive, r as listKnownProviderAuthEnvVarNamesCore } from "./provider-env-vars-BM4XH1SL.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
import { a as resolveWindowsSpawnProgram, r as materializeWindowsSpawnProgram } from "./windows-spawn-CR3vyrK9.mjs";
import { o as trySafeFileURLToPath } from "./local-file-access-B6bU8SNO.mjs";
import { n as isMutatingToolCall } from "./tool-mutation-BV25PrZA.mjs";
import { t as ensureOpenClawCliOnPath } from "./path-env-j7HKgcii.mjs";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { spawn } from "node:child_process";
import { homedir } from "node:os";
import { Readable, Writable } from "node:stream";
import { once } from "node:events";
import * as readline$1 from "node:readline";
import { ClientSideConnection, PROTOCOL_VERSION, ndJsonStream } from "@agentclientprotocol/sdk";
//#region src/acp/approval-classifier.ts
/** Classifies ACP tool permission requests into auto-approved and prompt-required risk buckets. */
const SAFE_SEARCH_TOOL_IDS = /* @__PURE__ */ new Set([
	"search",
	"web_search",
	"memory_search"
]);
const TRUSTED_SAFE_TOOL_ALIASES = /* @__PURE__ */ new Set(["search"]);
const EXEC_CAPABLE_TOOL_IDS = /* @__PURE__ */ new Set([
	"exec",
	"spawn",
	"shell",
	"bash",
	"process",
	"code_execution",
	"nodes"
]);
const CONTROL_PLANE_TOOL_IDS = /* @__PURE__ */ new Set([
	"cron",
	"gateway",
	"sessions_spawn",
	"sessions_send",
	"session_status"
]);
function readFirstStringValue(source, keys) {
	if (!source) return;
	return readTrimmedStringAlias(source, keys);
}
function normalizeToolPolicyName(value) {
	const normalized = normalizeLowercaseStringOrEmpty(value);
	if (!normalized || normalized.length > 128) return;
	return /^[a-z0-9._-]+$/.test(normalized) ? normalized : void 0;
}
function parseToolNameFromTitle(title) {
	if (!title) return;
	const head = normalizeOptionalString(title.split(":", 1)[0]);
	return head ? normalizeToolPolicyName(head) : void 0;
}
function resolveToolNameForPermission(params) {
	const toolCall = params.toolCall;
	const toolMeta = asOptionalRecord(toolCall?.["_meta"]);
	const rawInput = asOptionalRecord(toolCall?.rawInput);
	const fromMeta = readFirstStringValue(toolMeta, [
		"toolName",
		"tool_name",
		"name"
	]);
	const fromRawInput = readFirstStringValue(rawInput, [
		"tool",
		"toolName",
		"tool_name",
		"name"
	]);
	const fromTitle = parseToolNameFromTitle(toolCall?.title);
	const metaName = fromMeta ? normalizeToolPolicyName(fromMeta) : void 0;
	const rawInputName = fromRawInput ? normalizeToolPolicyName(fromRawInput) : void 0;
	const titleName = fromTitle;
	if (fromMeta && !metaName || fromRawInput && !rawInputName) return;
	if (metaName && titleName && metaName !== titleName) return;
	if (rawInputName && metaName && rawInputName !== metaName) return;
	if (rawInputName && titleName && rawInputName !== titleName) return;
	return metaName ?? titleName ?? rawInputName;
}
function extractPathFromToolTitle(toolTitle, toolName) {
	if (!toolTitle) return;
	const separator = toolTitle.indexOf(":");
	if (separator < 0) return;
	const tail = toolTitle.slice(separator + 1).trim();
	if (!tail) return;
	const keyedMatch = toolName === "read" ? tail.match(/(?:^|,\s*)(?:path|file_path|filePath)\s*:\s*([^,]+)/) : tail.match(/^(?:path|file_path|filePath)\s*:\s*([^,]+)/);
	if (keyedMatch?.[1]) return keyedMatch[1].trim();
	return toolName === "read" ? tail : void 0;
}
function readLocationPaths(locations) {
	if (!Array.isArray(locations)) return [];
	const paths = [];
	for (const location of locations) {
		const pathValue = readFirstStringValue(asOptionalRecord(location), [
			"path",
			"file_path",
			"filePath"
		]);
		if (pathValue) paths.push(pathValue);
	}
	return paths;
}
function resolveToolPathCandidates(params) {
	return [
		readFirstStringValue(asOptionalRecord(params.toolCall?.rawInput), [
			"path",
			"file_path",
			"filePath"
		]),
		extractPathFromToolTitle(params.toolTitle, params.toolName),
		...params.includeLocations ? readLocationPaths(params.toolCall?.locations) : []
	].filter((value) => value !== void 0);
}
function resolveAbsoluteScopedPath(value, cwd) {
	let candidate = value.trim();
	if (!candidate) return;
	if (/^file:/i.test(candidate)) {
		candidate = trySafeFileURLToPath(candidate) ?? "";
		if (!candidate) return;
	}
	if (candidate === "~") candidate = homedir();
	else if (candidate.startsWith("~/")) candidate = path.join(homedir(), candidate.slice(2));
	return path.isAbsolute(candidate) ? path.normalize(candidate) : path.resolve(cwd, candidate);
}
function isToolPathScopedToCwd(rawPath, cwd) {
	const absolutePath = resolveAbsoluteScopedPath(rawPath, cwd);
	if (!absolutePath) return false;
	return isPathInside(path.resolve(cwd), absolutePath);
}
/** Resolves the ACP approval class for one tool call, failing closed on spoofed tool identity. */
function classifyAcpToolApproval(params) {
	const toolName = resolveToolNameForPermission(params);
	if (!toolName) return {
		toolName: void 0,
		approvalClass: "unknown",
		autoApprove: false
	};
	const isTrustedToolId = isKnownCoreToolId(toolName) || TRUSTED_SAFE_TOOL_ALIASES.has(toolName);
	if (toolName === "read" && isTrustedToolId) {
		const rawPaths = resolveToolPathCandidates({
			includeLocations: false,
			toolCall: params.toolCall,
			toolName,
			toolTitle: params.toolCall?.title ?? void 0
		});
		const autoApprove = rawPaths.length > 0 && rawPaths.every((rawPath) => isToolPathScopedToCwd(rawPath, params.cwd));
		return {
			toolName,
			approvalClass: autoApprove ? "readonly_scoped" : "other",
			autoApprove
		};
	}
	if (SAFE_SEARCH_TOOL_IDS.has(toolName) && isTrustedToolId) {
		if (resolveToolPathCandidates({
			includeLocations: true,
			toolCall: params.toolCall,
			toolName,
			toolTitle: params.toolCall?.title ?? void 0
		}).some((rawPath) => !isToolPathScopedToCwd(rawPath, params.cwd))) return {
			toolName,
			approvalClass: "other",
			autoApprove: false
		};
		return {
			toolName,
			approvalClass: "readonly_search",
			autoApprove: true
		};
	}
	if (EXEC_CAPABLE_TOOL_IDS.has(toolName)) return {
		toolName,
		approvalClass: "exec_capable",
		autoApprove: false
	};
	if (CONTROL_PLANE_TOOL_IDS.has(toolName)) return {
		toolName,
		approvalClass: "control_plane",
		autoApprove: false
	};
	if (isMutatingToolCall(toolName, params.toolCall?.rawInput)) return {
		toolName,
		approvalClass: "mutating",
		autoApprove: false
	};
	return {
		toolName,
		approvalClass: "other",
		autoApprove: false
	};
}
//#endregion
//#region src/acp/client-helpers.ts
/** Permission, environment, and spawn helpers for the standalone ACP client. */
function resolveToolKindForPermission(toolName, approvalClass) {
	if (!toolName && approvalClass === "unknown") return;
	if (approvalClass === "readonly_scoped") return "readonly_scoped";
	if (approvalClass === "readonly_search") return "readonly_search";
	return approvalClass;
}
function pickOption(options, kinds) {
	for (const kind of kinds) {
		const match = options.find((option) => option.kind === kind);
		if (match) return match;
	}
}
function selectedPermission(optionId) {
	return { outcome: {
		outcome: "selected",
		optionId
	} };
}
function cancelledPermission() {
	return { outcome: { outcome: "cancelled" } };
}
function promptUserPermission(toolName, toolTitle) {
	if (!process.stdin.isTTY || !process.stderr.isTTY) {
		console.error(`[permission denied] ${toolName ?? "unknown"}: non-interactive terminal`);
		return Promise.resolve(false);
	}
	return new Promise((resolve) => {
		let settled = false;
		const rl = readline$1.createInterface({
			input: process.stdin,
			output: process.stderr
		});
		const finish = (approved) => {
			if (settled) return;
			settled = true;
			clearTimeout(timeout);
			rl.close();
			resolve(approved);
		};
		const timeout = setTimeout(() => {
			console.error(`\n[permission timeout] denied: ${toolName ?? "unknown"}`);
			finish(false);
		}, 3e4);
		const label = toolTitle ? toolName ? `${toolTitle} (${toolName})` : toolTitle : toolName ?? "unknown tool";
		rl.question(`\n[permission] Allow "${label}"? (y/N) `, (answer) => {
			const approved = normalizeLowercaseStringOrEmpty(answer) === "y";
			console.error(`[permission ${approved ? "approved" : "denied"}] ${toolName ?? "unknown"}`);
			finish(approved);
		});
	});
}
/** Converts an ACP permission request into a selected allow/reject option or cancellation. */
async function resolvePermissionRequest(params, deps = {}) {
	const log = deps.log ?? ((line) => console.error(line));
	const prompt = deps.prompt ?? promptUserPermission;
	const cwd = deps.cwd ?? process.cwd();
	const options = params.options ?? [];
	const toolTitle = sanitizeTerminalText(params.toolCall?.title ?? "tool");
	const classification = classifyAcpToolApproval({
		toolCall: params.toolCall,
		cwd
	});
	const toolName = classification.toolName;
	const toolKind = resolveToolKindForPermission(toolName, classification.approvalClass);
	if (options.length === 0) {
		log(`[permission cancelled] ${toolName ?? "unknown"}: no options available`);
		return cancelledPermission();
	}
	const allowOption = pickOption(options, ["allow_once", "allow_always"]);
	const rejectOption = pickOption(options, ["reject_once", "reject_always"]);
	if (!!classification.autoApprove) {
		if (!allowOption) {
			log(`[permission cancelled] ${toolName ?? "unknown"}: missing allow option`);
			return cancelledPermission();
		}
		log(`[permission auto-approved] ${toolName} (${toolKind ?? "unknown"})`);
		return selectedPermission(allowOption.optionId);
	}
	log(`\n[permission requested] ${toolTitle}${toolName ? ` (${toolName})` : ""}${toolKind ? ` [${toolKind}]` : ""}`);
	const approved = await prompt(toolName, toolTitle);
	if (approved && allowOption) return selectedPermission(allowOption.optionId);
	if (!approved && rejectOption) return selectedPermission(rejectOption.optionId);
	log(`[permission cancelled] ${toolName ?? "unknown"}: missing ${approved ? "allow" : "reject"} option`);
	return cancelledPermission();
}
/** Builds the sanitized environment used when spawning an ACP client process. */
function resolveAcpClientSpawnEnv(baseEnv = process.env, options = {}) {
	const env = omitEnvKeysCaseInsensitive(baseEnv, options.stripKeys ?? []);
	env.OPENCLAW_SHELL = "acp-client";
	return env;
}
/** Returns true when the client should hide provider credentials from the spawned server. */
function shouldStripProviderAuthEnvVarsForAcpServer(params = {}) {
	const serverCommand = normalizeOptionalString(params.serverCommand);
	if (!serverCommand) return true;
	const defaultServerCommand = normalizeOptionalString(params.defaultServerCommand);
	if (!defaultServerCommand || serverCommand !== defaultServerCommand) return false;
	const serverArgs = params.serverArgs ?? [];
	const defaultServerArgs = params.defaultServerArgs ?? [];
	return serverArgs.length === defaultServerArgs.length && serverArgs.every((arg, index) => arg === defaultServerArgs[index]);
}
/** Builds the exact environment variable denylist used for ACP client subprocesses. */
function buildAcpClientStripKeys(params) {
	const stripKeys = new Set(params.activeSkillEnvKeys ?? []);
	if (params.stripProviderAuthEnvVars) for (const key of listKnownProviderAuthEnvVarNamesCore()) stripKeys.add(key);
	return stripKeys;
}
const DEFAULT_ACP_SPAWN_RUNTIME = {
	platform: process.platform,
	env: process.env,
	execPath: process.execPath
};
/** Resolves the executable/args used to spawn an ACP server, including Windows shims. */
function resolveAcpClientSpawnInvocation(params, runtime = DEFAULT_ACP_SPAWN_RUNTIME) {
	const program = resolveWindowsSpawnProgram({
		command: params.serverCommand,
		platform: runtime.platform,
		env: runtime.env,
		execPath: runtime.execPath,
		packageName: "openclaw"
	});
	const resolved = materializeWindowsSpawnProgram(program, params.serverArgs);
	return {
		command: resolved.command,
		args: resolved.argv,
		shell: resolved.shell,
		windowsHide: resolved.windowsHide
	};
}
//#endregion
//#region src/acp/client.ts
/** Interactive stdio ACP client used to connect a terminal session to an OpenClaw ACP server. */
const ACP_SERVER_KILL_GRACE_MS = 1e3;
const ACP_SERVER_FORCE_KILL_TIMEOUT_MS = 1e3;
function hasChildExited(child) {
	return child.exitCode !== null || child.signalCode !== null;
}
async function waitForChildExit(child, timeoutMs) {
	if (!hasChildExited(child)) await once(child, "exit", { signal: AbortSignal.timeout(timeoutMs) }).catch(() => {});
	return hasChildExited(child);
}
async function terminateAcpServer(child) {
	if (hasChildExited(child)) return;
	if (child.pid) killProcessTree(child.pid, {
		detached: false,
		graceMs: ACP_SERVER_KILL_GRACE_MS
	});
	else child.kill("SIGTERM");
	if (await waitForChildExit(child, 2e3)) return;
	if (child.pid) signalProcessTree(child.pid, "SIGKILL", { detached: false });
	else child.kill("SIGKILL");
	await waitForChildExit(child, ACP_SERVER_FORCE_KILL_TIMEOUT_MS);
}
function toArgs(value) {
	if (!value) return [];
	return Array.isArray(value) ? value : [value];
}
function buildServerArgs(opts) {
	const args = ["acp", ...toArgs(opts.serverArgs)];
	if (opts.serverVerbose && !args.includes("--verbose") && !args.includes("-v")) args.push("--verbose");
	return args;
}
function resolveSelfEntryPath() {
	try {
		const here = fileURLToPath(import.meta.url);
		const candidate = path.resolve(path.dirname(here), "..", "entry.js");
		if (fs.existsSync(candidate)) return candidate;
	} catch {}
	const argv1 = normalizeOptionalString(process.argv[1]);
	if (argv1) return path.isAbsolute(argv1) ? argv1 : path.resolve(process.cwd(), argv1);
	return null;
}
function printSessionUpdate(notification) {
	const update = notification.update;
	switch (update.sessionUpdate) {
		case "agent_message_chunk":
			if (update.content?.type === "text") process.stdout.write(update.content.text);
			return;
		case "tool_call":
			console.log(`\n[tool] ${update.title} (${update.status})`);
			return;
		case "tool_call_update":
			if (update.status) console.log(`[tool update] ${update.toolCallId}: ${update.status}`);
			return;
		case "available_commands_update": {
			const names = update.availableCommands?.map((cmd) => `/${cmd.name}`).join(" ");
			if (names) console.log(`\n[commands] ${names}`);
		}
	}
}
async function createAcpClient(opts = {}) {
	const cwd = opts.cwd ?? process.cwd();
	const log = Boolean(opts.verbose) ? (msg) => console.error(`[acp-client] ${msg}`) : () => {};
	ensureOpenClawCliOnPath();
	const serverArgs = buildServerArgs(opts);
	const entryPath = resolveSelfEntryPath();
	const defaultServerCommand = entryPath ? process.execPath : "openclaw";
	const defaultServerArgs = entryPath ? [entryPath, ...serverArgs] : serverArgs;
	const serverCommand = opts.serverCommand ?? defaultServerCommand;
	const effectiveArgs = opts.serverCommand || !entryPath ? serverArgs : defaultServerArgs;
	const { getActiveSkillEnvKeys } = await import("./env-overrides.runtime.js");
	const stripKeys = buildAcpClientStripKeys({
		stripProviderAuthEnvVars: shouldStripProviderAuthEnvVarsForAcpServer({
			serverCommand,
			serverArgs: effectiveArgs,
			defaultServerCommand,
			defaultServerArgs
		}),
		activeSkillEnvKeys: getActiveSkillEnvKeys()
	});
	const spawnEnv = resolveAcpClientSpawnEnv(process.env, { stripKeys });
	const spawnInvocation = resolveAcpClientSpawnInvocation({
		serverCommand,
		serverArgs: effectiveArgs
	}, {
		platform: process.platform,
		env: spawnEnv,
		execPath: process.execPath
	});
	log(`spawning: ${spawnInvocation.command} ${spawnInvocation.args.join(" ")}`);
	const agent = spawn(spawnInvocation.command, spawnInvocation.args, {
		stdio: [
			"pipe",
			"pipe",
			"inherit"
		],
		cwd,
		env: spawnEnv,
		shell: spawnInvocation.shell,
		windowsHide: spawnInvocation.windowsHide
	});
	agent.on("error", (err) => {
		log(`agent error: ${String(err)}`);
	});
	try {
		if (!agent.stdin || !agent.stdout) throw new Error("Failed to create ACP stdio pipes");
		const input = Writable.toWeb(agent.stdin);
		const output = Readable.toWeb(agent.stdout);
		const stream = ndJsonStream(input, output);
		const client = new ClientSideConnection(() => ({
			sessionUpdate: async (params) => {
				printSessionUpdate(params);
			},
			requestPermission: async (params) => {
				return resolvePermissionRequest(params, { cwd });
			}
		}), stream);
		log("initializing");
		await client.initialize({
			protocolVersion: PROTOCOL_VERSION,
			clientCapabilities: {
				fs: {
					readTextFile: true,
					writeTextFile: true
				},
				terminal: true
			},
			clientInfo: {
				name: "openclaw-acp-client",
				version: "1.0.0"
			}
		});
		log("creating session");
		return {
			client,
			agent,
			sessionId: (await client.newSession({
				cwd,
				mcpServers: []
			})).sessionId
		};
	} catch (error) {
		await terminateAcpServer(agent);
		throw error;
	}
}
/** Starts the terminal prompt loop for a local ACP client session. */
async function runAcpClientInteractive(opts = {}) {
	const { client, agent, sessionId } = await createAcpClient(opts);
	const rl = readline$1.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	console.log("OpenClaw ACP client");
	console.log(`Session: ${sessionId}`);
	console.log("Type a prompt, or \"exit\" to quit.\n");
	let quitting = false;
	const quit = async () => {
		if (quitting || hasChildExited(agent)) return;
		quitting = true;
		await terminateAcpServer(agent);
		rl.close();
		process.exit(0);
	};
	rl.once("close", () => {
		quit();
	});
	const prompt = () => {
		if (quitting) return;
		rl.question("> ", (input) => {
			(async () => {
				const text = input.trim();
				if (!text) {
					prompt();
					return;
				}
				if (text === "exit" || text === "quit") {
					await quit();
					return;
				}
				try {
					const response = await client.prompt({
						sessionId,
						prompt: [{
							type: "text",
							text
						}]
					});
					console.log(`\n[${response.stopReason}]\n`);
				} catch (err) {
					console.error(`\n[error] ${String(err)}\n`);
				}
				prompt();
			})();
		});
	};
	prompt();
	agent.on("exit", (code, signal) => {
		console.log(`\nAgent exited with ${signal ? `signal ${signal}` : `code ${code}`}`);
		rl.close();
		process.exit(code ?? (quitting ? 0 : 1));
	});
}
//#endregion
export { runAcpClientInteractive };
