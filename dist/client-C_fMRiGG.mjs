import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as signalProcessTree, t as killProcessTree } from "./kill-tree-D8IW3UNJ.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { t as ensureOpenClawCliOnPath } from "./path-env-CEnHRj9k.mjs";
import { n as sanitizeTerminalText } from "./safe-text-BjmWJADa.mjs";
import { t as settlesWithin } from "./settle-within-DLEx44ea.mjs";
import { n as readTrimmedStringAlias } from "./string-readers-V5CfgPTP.mjs";
import { a as omitEnvKeysCaseInsensitive, r as listKnownProviderAuthEnvVarNamesCore } from "./provider-env-vars-D43Pu6eG.mjs";
import { i as isKnownCoreToolId } from "./tool-catalog-DGlfxTaj.mjs";
import { a as resolveWindowsSpawnProgram, r as materializeWindowsSpawnProgram } from "./windows-spawn-BwP7BByc.mjs";
import { n as isMutatingToolCall } from "./tool-mutation-BTW6eoAN.mjs";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { trySafeFileURLToPath } from "@openclaw/fs-safe/advanced";
import { once } from "node:events";
import { Readable, Writable } from "node:stream";
import * as readline$1 from "node:readline";
import { ClientSideConnection, PROTOCOL_VERSION, ndJsonStream } from "@agentclientprotocol/sdk";
//#region src/acp/approval-classifier.ts
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
	return source ? readTrimmedStringAlias(source, keys) : void 0;
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
function resolveToolNameForPermission(toolCall) {
	const fromMeta = readFirstStringValue(asOptionalRecord(toolCall?.["_meta"]), [
		"toolName",
		"tool_name",
		"name"
	]);
	const fromRawInput = readFirstStringValue(asOptionalRecord(toolCall?.rawInput), [
		"tool",
		"toolName",
		"tool_name",
		"name"
	]);
	const metaName = fromMeta ? normalizeToolPolicyName(fromMeta) : void 0;
	const rawInputName = fromRawInput ? normalizeToolPolicyName(fromRawInput) : void 0;
	const titleName = parseToolNameFromTitle(toolCall?.title);
	if (fromMeta && !metaName || fromRawInput && !rawInputName) return;
	if (new Set([
		metaName,
		titleName,
		rawInputName
	].filter(Boolean)).size > 1) return;
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
function resolveToolPathCandidates(toolCall, toolName) {
	const locations = toolName !== "read" && Array.isArray(toolCall?.locations) ? toolCall.locations : [];
	const pathKeys = [
		"path",
		"file_path",
		"filePath"
	];
	return [
		readFirstStringValue(asOptionalRecord(toolCall?.rawInput), pathKeys),
		extractPathFromToolTitle(toolCall?.title ?? void 0, toolName),
		...locations.map((location) => readFirstStringValue(asOptionalRecord(location), pathKeys))
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
	const toolName = resolveToolNameForPermission(params.toolCall);
	if (!toolName) return {
		toolName: void 0,
		approvalClass: "unknown",
		autoApprove: false
	};
	if ((isKnownCoreToolId(toolName) || TRUSTED_SAFE_TOOL_ALIASES.has(toolName)) && (toolName === "read" || SAFE_SEARCH_TOOL_IDS.has(toolName))) {
		const rawPaths = resolveToolPathCandidates(params.toolCall, toolName);
		const autoApprove = (toolName !== "read" || rawPaths.length > 0) && rawPaths.every((rawPath) => isToolPathScopedToCwd(rawPath, params.cwd));
		return {
			toolName,
			approvalClass: autoApprove ? toolName === "read" ? "readonly_scoped" : "readonly_search" : "other",
			autoApprove
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
function promptUserPermission(toolName, toolTitle, signal) {
	if (signal?.aborted) return Promise.resolve(false);
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
			signal?.removeEventListener("abort", onClose);
			rl.off("close", onClose);
			rl.close();
			resolve(approved);
		};
		const onClose = () => finish(false);
		rl.once("close", onClose);
		signal?.addEventListener("abort", onClose, { once: true });
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
async function resolvePermissionRequest(params, deps = {}) {
	const log = deps.log ?? ((line) => console.error(line));
	if (deps.signal?.aborted) return { outcome: { outcome: "cancelled" } };
	const prompt = deps.prompt ?? ((toolName, title) => promptUserPermission(toolName, title, deps.signal));
	const cwd = deps.cwd ?? process.cwd();
	const options = params.options ?? [];
	const toolTitle = sanitizeTerminalText(params.toolCall?.title ?? "tool");
	const classification = classifyAcpToolApproval({
		toolCall: params.toolCall,
		cwd
	});
	const toolName = classification.toolName;
	const toolKind = !toolName && classification.approvalClass === "unknown" ? void 0 : classification.approvalClass;
	if (options.length === 0) {
		log(`[permission cancelled] ${toolName ?? "unknown"}: no options available`);
		return { outcome: { outcome: "cancelled" } };
	}
	const allowOption = options.find((option) => option.kind === "allow_once") ?? options.find((option) => option.kind === "allow_always");
	const rejectOption = options.find((option) => option.kind === "reject_once") ?? options.find((option) => option.kind === "reject_always");
	if (classification.autoApprove) {
		if (!allowOption) {
			log(`[permission cancelled] ${toolName ?? "unknown"}: missing allow option`);
			return { outcome: { outcome: "cancelled" } };
		}
		log(`[permission auto-approved] ${toolName} (${toolKind ?? "unknown"})`);
		return { outcome: {
			outcome: "selected",
			optionId: allowOption.optionId
		} };
	}
	log(`\n[permission requested] ${toolTitle}${toolName ? ` (${toolName})` : ""}${toolKind ? ` [${toolKind}]` : ""}`);
	const approved = await prompt(toolName, toolTitle);
	if (deps.signal?.aborted) return { outcome: { outcome: "cancelled" } };
	if (approved && allowOption) return { outcome: {
		outcome: "selected",
		optionId: allowOption.optionId
	} };
	if (!approved && rejectOption) return { outcome: {
		outcome: "selected",
		optionId: rejectOption.optionId
	} };
	log(`[permission cancelled] ${toolName ?? "unknown"}: missing ${approved ? "allow" : "reject"} option`);
	return { outcome: { outcome: "cancelled" } };
}
function resolveAcpClientSpawnEnv(baseEnv = process.env, options = {}) {
	const env = omitEnvKeysCaseInsensitive(baseEnv, options.stripKeys ?? []);
	env.OPENCLAW_SHELL = "acp-client";
	return env;
}
function shouldStripProviderAuthEnvVarsForAcpServer(params = {}) {
	const serverCommand = normalizeOptionalString(params.serverCommand);
	if (!serverCommand) return true;
	const defaultServerCommand = normalizeOptionalString(params.defaultServerCommand);
	if (!defaultServerCommand || serverCommand !== defaultServerCommand) return false;
	const serverArgs = params.serverArgs ?? [];
	const defaultServerArgs = params.defaultServerArgs ?? [];
	return serverArgs.length === defaultServerArgs.length && serverArgs.every((arg, index) => arg === defaultServerArgs[index]);
}
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
	const serverArgs = ["acp", ...opts.serverArgs ?? []];
	if (opts.serverVerbose && !serverArgs.includes("--verbose") && !serverArgs.includes("-v")) serverArgs.push("--verbose");
	const entryPath = resolveSelfEntryPath();
	const defaultServerCommand = entryPath ? process.execPath : "openclaw";
	const defaultServerArgs = entryPath ? [entryPath, ...serverArgs] : serverArgs;
	const serverCommand = opts.serverCommand ?? defaultServerCommand;
	const effectiveArgs = opts.serverCommand || !entryPath ? serverArgs : defaultServerArgs;
	const { getActiveSkillEnvKeysCore } = await import("./env-overrides-obfwOynK.mjs");
	const stripKeys = buildAcpClientStripKeys({
		stripProviderAuthEnvVars: shouldStripProviderAuthEnvVarsForAcpServer({
			serverCommand,
			serverArgs: effectiveArgs,
			defaultServerCommand,
			defaultServerArgs
		}),
		activeSkillEnvKeys: getActiveSkillEnvKeysCore()
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
	const permissions = new AbortController();
	const closed = new Promise((resolve) => {
		agent.once("close", () => resolve());
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
				return resolvePermissionRequest(params, {
					cwd,
					signal: permissions.signal
				});
			}
		}), stream);
		client.closed.then(() => permissions.abort());
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
			})).sessionId,
			closed,
			cancelPermissions: () => permissions.abort()
		};
	} catch (error) {
		permissions.abort();
		await terminateAcpServer(agent);
		await closed;
		throw error;
	}
}
/** Runs until the interactive session and its owned server have closed. */
async function runAcpClientInteractive(opts = {}) {
	const { client, agent, sessionId, closed, cancelPermissions } = await createAcpClient(opts);
	const rl = readline$1.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	let quitting = false;
	let shutdown;
	let promptTask;
	let signalCode;
	const quit = () => {
		if (shutdown) return shutdown;
		quitting = true;
		shutdown = Promise.resolve().then(async () => {
			cancelPermissions();
			rl.close();
			process.stdin.pause();
			if (!hasChildExited(agent)) {
				const activePrompt = promptTask;
				if (activePrompt) {
					await settlesWithin(client.cancel({ sessionId }).catch(() => {}), ACP_SERVER_KILL_GRACE_MS);
					await settlesWithin(activePrompt, ACP_SERVER_KILL_GRACE_MS);
				}
				agent.stdin?.end();
				if (!await waitForChildExit(agent, ACP_SERVER_KILL_GRACE_MS)) await terminateAcpServer(agent);
			}
			await closed;
		});
		return shutdown;
	};
	const onInputClose = () => {
		if (!quitting) quit();
	};
	const onSigint = () => {
		signalCode = 130;
		quit();
	};
	const onSigterm = () => {
		signalCode = 143;
		quit();
	};
	rl.once("close", onInputClose);
	process.on("SIGINT", onSigint);
	process.on("SIGTERM", onSigterm);
	const prompt = () => {
		if (quitting || hasChildExited(agent)) return;
		rl.question("> ", (input) => {
			const text = input.trim();
			if (!text) {
				prompt();
				return;
			}
			if (text === "exit" || text === "quit") {
				quit();
				return;
			}
			promptTask = (async () => {
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
				promptTask = void 0;
				prompt();
			})();
		});
	};
	try {
		console.log("OpenClaw ACP client");
		console.log(`Session: ${sessionId}`);
		console.log("Type a prompt, or \"exit\" to quit.\n");
		prompt();
		await closed;
		const code = agent.exitCode ?? (quitting ? 0 : 1);
		console.log(`\nAgent exited with ${agent.signalCode ? `signal ${agent.signalCode}` : `code ${agent.exitCode}`}`);
		return code !== 0 ? code : signalCode ?? code;
	} finally {
		await quit();
		await client.closed;
		await promptTask;
		rl.off("close", onInputClose);
		process.off("SIGINT", onSigint);
		process.off("SIGTERM", onSigterm);
	}
}
//#endregion
export { runAcpClientInteractive };
